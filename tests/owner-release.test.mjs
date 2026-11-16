import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdir, mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {hashString} from '../packages/automation-contracts/src/semantics.mjs';
import {
  DEFAULT_COMMANDS,
  RECEIPT_KIND,
  RECEIPT_SCHEMA_VERSION,
  assertGitBinding,
  buildOwnerReceipt,
  readReleaseInputs,
  rebuildRuntimeArtifact,
  resolveGitBinding,
  verifyReleaseConsistency,
} from '../tools/verify-owner-release.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const toolPath = path.join(root, 'tools', 'verify-owner-release.mjs');

const EXPECTED_CHECKS = [
  'source-baseline',
  'manifest-source-hash',
  'manifest-source-bytes',
  'manifest-artifact-hash',
  'manifest-artifact-bytes',
  'manifest-baseline-hash',
  'manifest-identity',
  'package-identity',
  'rebuild-deterministic',
];

function withSource(inputs, text) {
  return {...inputs, source: {path: inputs.source.path, text, bytes: Buffer.byteLength(text), sha256: hashString(text)}};
}

function withArtifact(inputs, text) {
  return {...inputs, artifact: {path: inputs.artifact.path, text, bytes: Buffer.byteLength(text), sha256: hashString(text)}};
}

function withManifest(inputs, patch) {
  return {...inputs, manifest: {...inputs.manifest, ...patch}};
}

function assertFails(inputs, checkName) {
  const result = verifyReleaseConsistency(inputs);
  assert.equal(result.passed, false, `expected ${checkName} to fail`);
  assert(
    result.failures.some(failure => failure.name === checkName),
    `expected failure ${checkName}, got [${result.failures.map(failure => failure.name).join(', ')}]`,
  );
  assert.throws(() => buildOwnerReceipt({verified: result, testedCommit: '0'.repeat(40)}), /Refusing/);
}

test('the committed release tree verifies fully, including a deterministic in-memory rebuild', async () => {
  const inputs = await readReleaseInputs(root);
  const rebuilt = await rebuildRuntimeArtifact(root);
  const verified = verifyReleaseConsistency({...inputs, rebuiltArtifact: rebuilt});
  assert.deepEqual(verified.failures, []);
  assert.equal(verified.passed, true);
  assert.deepEqual(verified.checks.map(check => check.name), EXPECTED_CHECKS);
  assert.equal(verified.sourceHash, inputs.manifest.sourceHash);
  assert.equal(verified.buildHash, inputs.manifest.buildHash);
  assert.equal(rebuilt, inputs.artifact.text);
});

test('git binding resolves HEAD and accepts the matching expected commit', () => {
  const headCommit = execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim();
  const binding = resolveGitBinding(root, {expectedCommit: headCommit});
  assert.equal(binding.commit, headCommit);
  assert.match(binding.commit, /^[0-9a-f]{40}$/);
});

test('git binding rejects a foreign commit, dirty release paths and malformed input', () => {
  const headCommit = execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim();
  assert.throws(
    () => assertGitBinding({headCommit, expectedCommit: '0'.repeat(40), statusLines: []}),
    /does not match the expected commit/,
  );
  assert.throws(
    () => assertGitBinding({headCommit, statusLines: [' M packages/dnd5e-runtime/dist/manifest.json']}),
    /uncommitted drift/,
  );
  assert.throws(() => assertGitBinding({headCommit: 'abc', statusLines: []}), /No testable HEAD commit/);
  assert.throws(() => assertGitBinding({headCommit, expectedCommit: 'abc', statusLines: []}), /not a full sha/);
});

test('a source file drift fails the reviewed-baseline and manifest-source checks', async () => {
  const inputs = await readReleaseInputs(root);
  assertFails(withSource(inputs, `${inputs.source.text}\n// tampered\n`), 'source-baseline');
});

test('an artifact byte drift fails the manifest build-hash check', async () => {
  const inputs = await readReleaseInputs(root);
  assertFails(withArtifact(inputs, inputs.artifact.text.replace('initializeDnd5eRuntime', 'initializeDnd5eRuntimeX')), 'manifest-artifact-hash');
});

test('a tampered manifest sourceHash fails the manifest-source-hash check', async () => {
  const inputs = await readReleaseInputs(root);
  assertFails(withManifest(inputs, {sourceHash: '0'.repeat(64)}), 'manifest-source-hash');
});

test('a tampered manifest buildHash fails the manifest-artifact-hash check', async () => {
  const inputs = await readReleaseInputs(root);
  assertFails(withManifest(inputs, {buildHash: '1'.repeat(64)}), 'manifest-artifact-hash');
});

test('a tampered manifest byte count fails the manifest-artifact-bytes check', async () => {
  const inputs = await readReleaseInputs(root);
  assertFails(withManifest(inputs, {artifact: {...inputs.manifest.artifact, bytes: inputs.manifest.artifact.bytes + 1}}), 'manifest-artifact-bytes');
});

test('a tampered manifest source byte count fails the manifest-source-bytes check', async () => {
  const inputs = await readReleaseInputs(root);
  assertFails(withManifest(inputs, {source: {...inputs.manifest.source, bytes: inputs.manifest.source.bytes - 1}}), 'manifest-source-bytes');
});

test('a source-baseline.json edit fails the manifest-baseline-hash check', async () => {
  const inputs = await readReleaseInputs(root);
  assertFails({...inputs, baselineText: `${inputs.baselineText}\n`}, 'manifest-baseline-hash');
});

test('a fresh build that differs from the committed artifact fails rebuild-deterministic', async () => {
  const inputs = await readReleaseInputs(root);
  assertFails({...inputs, rebuiltArtifact: `${inputs.artifact.text}\n`}, 'rebuild-deterministic');
});

test('a package identity mismatch fails the package-identity check', async () => {
  const inputs = await readReleaseInputs(root);
  assertFails({...inputs, packageJson: {...inputs.packageJson, version: '9.9.9'}}, 'package-identity');
});

test('a manifest identity drift fails the manifest-identity check', async () => {
  const inputs = await readReleaseInputs(root);
  assertFails(withManifest(inputs, {contentPolicy: 'runtime-plus'}), 'manifest-identity');
});

test('a verified state yields a passed receipt with null runUrl by default', async () => {
  const inputs = await readReleaseInputs(root);
  const rebuilt = await rebuildRuntimeArtifact(root);
  const verified = verifyReleaseConsistency({...inputs, rebuiltArtifact: rebuilt});
  const receipt = buildOwnerReceipt({verified, testedCommit: resolveGitBinding(root).commit});
  assert.equal(receipt.schemaVersion, RECEIPT_SCHEMA_VERSION);
  assert.equal(receipt.kind, RECEIPT_KIND);
  assert.equal(receipt.result, 'passed');
  assert.equal(receipt.runUrl, null);
  assert.equal(receipt.testedCommit, resolveGitBinding(root).commit);
  assert.equal(receipt.sourceHash, inputs.manifest.sourceHash);
  assert.equal(receipt.buildHash, inputs.manifest.buildHash);
  assert.equal(receipt.artifactHash, inputs.artifact.sha256);
  assert.deepEqual(receipt.commands, [...DEFAULT_COMMANDS]);
  assert.equal(receipt.unit.package, '@arcanedesk/dnd5e-runtime');
  assert.equal(receipt.unit.artifactPath, 'packages/dnd5e-runtime/dist/dnd5e-runtime.mjs');
  assert.equal(receipt.unit.artifactBytes, inputs.manifest.artifact.bytes);
  assert.deepEqual(receipt.checks, EXPECTED_CHECKS);
});

test('an explicit CI run URL is preserved verbatim in the receipt', async () => {
  const inputs = await readReleaseInputs(root);
  const rebuilt = await rebuildRuntimeArtifact(root);
  const verified = verifyReleaseConsistency({...inputs, rebuiltArtifact: rebuilt});
  const runUrl = 'https://example.invalid/org/repo/actions/runs/1';
  const receipt = buildOwnerReceipt({verified, testedCommit: resolveGitBinding(root).commit, runUrl});
  assert.equal(receipt.runUrl, runUrl);
  assert.equal(receipt.result, 'passed');
});

test('the CLI writes a local receipt with runUrl null and real hashes', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'owner-release-'));
  try {
    const receiptPath = path.join(directory, 'owner-ci-receipt.json');
    const stdout = execFileSync(process.execPath, [toolPath, '--receipt', receiptPath], {cwd: root, encoding: 'utf8'});
    const printed = JSON.parse(stdout);
    const written = JSON.parse(await readFile(receiptPath, 'utf8'));
    for (const receipt of [printed, written]) {
      assert.equal(receipt.result, 'passed');
      assert.equal(receipt.runUrl, null);
      assert.equal(receipt.testedCommit, resolveGitBinding(root).commit);
      assert.match(receipt.sourceHash, /^[0-9a-f]{64}$/);
      assert.equal(receipt.artifactHash, receipt.buildHash);
      assert.deepEqual(receipt.checks, EXPECTED_CHECKS);
    }
    assert.deepEqual(printed, written);
  } finally {
    await rm(directory, {recursive: true, force: true});
  }
});

test('the CLI refuses to write any receipt when the commit binding is wrong', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'owner-release-'));
  try {
    const receiptPath = path.join(directory, 'owner-ci-receipt.json');
    let failed = false;
    try {
      execFileSync(process.execPath, [toolPath, '--receipt', receiptPath, '--commit', '0'.repeat(40)],
        {cwd: root, encoding: 'utf8'});
    } catch (error) {
      failed = true;
      assert.match(String(error.stderr), /does not match the expected commit/);
      assert.notEqual(error.status, 0);
    }
    assert.equal(failed, true, 'expected the CLI to fail on a foreign --commit');
    assert.equal(existsSync(receiptPath), false, 'no receipt may exist after a failed verification');
  } finally {
    await rm(directory, {recursive: true, force: true});
  }
});

test('an explicit tested root is read directly and never falls back to the tool checkout', async () => {
  const ownerInputs = await readReleaseInputs(root);
  const directory = await mkdtemp(path.join(os.tmpdir(), 'owner-release-root-'));
  try {
    const packageDir = path.join(directory, 'packages', 'dnd5e-runtime');
    await mkdir(path.join(packageDir, 'src'), {recursive: true});
    await mkdir(path.join(packageDir, 'dist'), {recursive: true});
    const tamperedArtifact = `${ownerInputs.artifact.text}\n// tampered copy\n`;
    await writeFile(path.join(packageDir, 'src', 'automation.js'), ownerInputs.source.text, 'utf8');
    await writeFile(path.join(packageDir, 'src', 'source-baseline.json'), ownerInputs.baselineText, 'utf8');
    await writeFile(path.join(packageDir, 'dist', 'manifest.json'), JSON.stringify(ownerInputs.manifest, null, 2), 'utf8');
    await writeFile(path.join(packageDir, 'dist', 'dnd5e-runtime.mjs'), tamperedArtifact, 'utf8');
    await writeFile(path.join(packageDir, 'package.json'), JSON.stringify(ownerInputs.packageJson, null, 2), 'utf8');

    const copied = await readReleaseInputs(directory);
    assert.notEqual(copied.artifact.sha256, ownerInputs.artifact.sha256, 'the copy must be hashed from its own bytes');
    const result = verifyReleaseConsistency(copied);
    assert.equal(result.passed, false);
    const artifactFailure = result.failures.find(failure => failure.name === 'manifest-artifact-hash');
    assert(artifactFailure, 'expected manifest-artifact-hash to fail');
    assert(artifactFailure.detail.includes(copied.artifact.sha256), 'the failure must cite the tested root bytes');
    assert(artifactFailure.detail.includes(ownerInputs.manifest.buildHash), 'the failure must cite the tested root manifest');
    assert.throws(() => buildOwnerReceipt({verified: result, testedCommit: '0'.repeat(40)}), /Refusing/);
  } finally {
    await rm(directory, {recursive: true, force: true});
  }
});

test('the CLI rejects a tested root without a release tree and writes no receipt', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'owner-release-badroot-'));
  try {
    const receiptPath = path.join(directory, 'owner-ci-receipt.json');
    const missingRoot = path.join(directory, 'missing-source');
    let failed = false;
    try {
      execFileSync(process.execPath, [toolPath, '--root', missingRoot, '--receipt', receiptPath],
        {cwd: root, encoding: 'utf8'});
    } catch (error) {
      failed = true;
      assert.match(String(error.stderr), /Tested source root/);
      assert.notEqual(error.status, 0);
    }
    assert.equal(failed, true, 'expected the CLI to fail on a missing tested root');
    assert.equal(existsSync(receiptPath), false, 'no receipt may exist for a missing tested root');
  } finally {
    await rm(directory, {recursive: true, force: true});
  }
});

test('the CLI rejects a non-40-hex tested commit and writes no receipt', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'owner-release-sha-'));
  try {
    const receiptPath = path.join(directory, 'owner-ci-receipt.json');
    let failed = false;
    try {
      execFileSync(process.execPath, [toolPath, '--receipt', receiptPath, '--commit', 'abc123'],
        {cwd: root, encoding: 'utf8'});
    } catch (error) {
      failed = true;
      assert.match(String(error.stderr), /not a full sha/);
      assert.notEqual(error.status, 0);
    }
    assert.equal(failed, true, 'expected the CLI to fail on a malformed --commit');
    assert.equal(existsSync(receiptPath), false, 'no receipt may exist for a malformed --commit');
  } finally {
    await rm(directory, {recursive: true, force: true});
  }
});
