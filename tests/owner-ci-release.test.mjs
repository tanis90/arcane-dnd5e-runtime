import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ZIP_RECIPE, makeZip, readZip} from '../tools/owner-ci/zip.mjs';
import {canonicalSetHash, collectMembers, inspect, loadWhitelist} from '../tools/owner-ci/release.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const toolPath = path.join(root, 'tools', 'owner-ci', 'release.mjs');
const ZIP_FILE = 'dnd5e-runtime-sdk.zip';
const MANIFEST_FILE = 'dnd5e-runtime-sdk-manifest.json';
const RECEIPT_FILE = 'dnd5e-runtime-sdk-receipt.json';

const head = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], {encoding: 'utf8'}).trim();
const tempDirs = [];
const makeTemp = () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'dnd5e-sdk-test-'));
  tempDirs.push(dir);
  return dir;
};

const assemble = (outDir, extra = []) => spawnSync(process.execPath, [
  toolPath, 'assemble', '--root', root, '--out-dir', outDir, ...extra,
], {encoding: 'utf8'});

const verify = (outDir, extra = []) => spawnSync(process.execPath, [
  toolPath, 'verify',
  '--artifact', path.join(outDir, ZIP_FILE),
  '--manifest', path.join(outDir, MANIFEST_FILE),
  '--receipt', path.join(outDir, RECEIPT_FILE),
  ...extra,
], {encoding: 'utf8'});

// One real artifact for the whole file: building it is the expensive step.
let artifactDir = null;
const ensureArtifact = () => {
  if (artifactDir) return artifactDir;
  const dir = makeTemp();
  const result = assemble(dir);
  assert.equal(result.status, 0, result.stderr);
  artifactDir = dir;
  return artifactDir;
};

test.after(() => {
  for (const dir of tempDirs) rmSync(dir, {recursive: true, force: true});
});

test('the distribution whitelist is the four repo-owned SDK files plus one consumer pin', () => {
  const problems = [];
  const whitelist = loadWhitelist(problems);
  assert.deepEqual(problems, []);
  assert.deepEqual(whitelist.members.map(member => member.path).sort(), [
    'dnd5e-runtime.LICENSE.txt',
    'dnd5e-runtime.NOTICE.txt',
    'dnd5e-runtime.mjs',
    'dnd5e-runtime.sdk-manifest.json',
  ]);
  assert.equal(whitelist.consumerGenerated.path, 'dnd5e-runtime.manifest.json');
  assert.equal(whitelist.distributionRoot, 'web/runtime-sdk/dnd5e-runtime');

  const collected = collectMembers({root, commit: head, whitelist, problems: []});
  const sdkManifest = JSON.parse(readFileSync(path.join(root, collected.identity.sdkManifest.sourcePath), 'utf8'));
  assert.equal(collected.identity.artifact.sha256, sdkManifest.buildHash);
  assert.equal(collected.identity.source.sha256, sdkManifest.sourceHash);
  assert.equal(collected.files.length, 4);
  assert.equal(canonicalSetHash(collected.files).length, 64);
});

test('assemble is byte-deterministic and self-verifies against the commit', () => {
  const first = ensureArtifact();
  const second = makeTemp();
  const result = assemble(second);
  assert.equal(result.status, 0, result.stderr);
  for (const file of [ZIP_FILE, MANIFEST_FILE, RECEIPT_FILE]) {
    assert(
      readFileSync(path.join(first, file)).equals(readFileSync(path.join(second, file))),
      `${file} must be byte-identical across two builds`,
    );
  }
  const manifest = JSON.parse(readFileSync(path.join(first, MANIFEST_FILE), 'utf8'));
  const receipt = JSON.parse(readFileSync(path.join(first, RECEIPT_FILE), 'utf8'));
  assert.equal(manifest.commit, head);
  assert.equal(receipt.result, 'passed');
  assert.equal(receipt.runUrl, null);
  assert.equal(manifest.artifact.zipRecipe, ZIP_RECIPE);
  assert.equal(receipt.setHash, manifest.setHash);
  assert.equal(receipt.artifact.sha256, manifest.artifact.sha256);
});

test('assembling inside the repository is refused so audits never see a zip', () => {
  const inside = path.join(root, 'release-out');
  const result = assemble(inside);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /--out-dir 必须位于仓外/);
  assert.equal(existsSync(inside), false);
});

test('verify rebinds the zip to the commit, the source tree and a distribution directory', () => {
  const dir = ensureArtifact();
  const clean = verify(dir, ['--root', root, '--expect-head', head]);
  assert.equal(clean.status, 0, clean.stderr);

  const dist = makeTemp();
  const zip = readZip(readFileSync(path.join(dir, ZIP_FILE)));
  assert.deepEqual(zip.problems, []);
  for (const entry of zip.entries) writeFileSync(path.join(dist, entry.path), entry.bytes);
  const ok = verify(dir, ['--distribution-dir', dist]);
  assert.equal(ok.status, 0, ok.stderr);
  assert.match(ok.stdout, /消费方分发目录没有 dnd5e-runtime\.manifest\.json/);

  writeFileSync(path.join(dist, 'dnd5e-runtime.NOTICE.txt'), 'tampered');
  const drift = verify(dir, ['--distribution-dir', dist]);
  assert.notEqual(drift.status, 0);
  assert.match(drift.stderr, /dnd5e-runtime\.NOTICE\.txt 与 zip 成员不逐字节一致/);
});

test('the consumer pin must bind the released artifact bytes', () => {
  const dir = ensureArtifact();
  const manifest = JSON.parse(readFileSync(path.join(dir, MANIFEST_FILE), 'utf8'));
  const dist = makeTemp();
  for (const file of manifest.files) {
    writeFileSync(path.join(dist, file.path), readFileSync(path.join(root, file.source)));
  }
  const pin = {
    formatVersion: 1,
    generatedBy: 'tools/sync-dnd5e-runtime.mjs',
    package: manifest.unit.package,
    version: manifest.unit.version,
    schemaVersion: manifest.unit.schemaVersion,
    runtimeKind: manifest.unit.runtimeKind,
    factoryName: manifest.unit.factoryName,
    moduleId: manifest.unit.moduleId,
    commit: manifest.commit,
    sourceHash: manifest.unit.source.sha256,
    buildHash: manifest.unit.artifact.sha256,
    artifact: {path: 'scripts/dnd5e-runtime.mjs', sha256: manifest.unit.artifact.sha256},
    sdkManifest: {path: 'scripts/dnd5e-runtime.sdk-manifest.json', sha256: manifest.unit.sdkManifest.sha256},
    contentPolicy: 'runtime-only',
  };
  writeFileSync(path.join(dist, 'dnd5e-runtime.manifest.json'), `${JSON.stringify(pin, null, 2)}\n`);
  const bound = verify(dir, ['--distribution-dir', dist]);
  assert.equal(bound.status, 0, bound.stderr);
  assert.match(bound.stdout, /消费方 pin 已绑定本次 commit/);

  writeFileSync(path.join(dist, 'dnd5e-runtime.manifest.json'), `${JSON.stringify({...pin, buildHash: '0'.repeat(64)}, null, 2)}\n`);
  const tampered = verify(dir, ['--distribution-dir', dist]);
  assert.notEqual(tampered.status, 0);
  assert.match(tampered.stderr, /buildHash\/artifact\.sha256 与本次出件 artifact 字节不符/);
});

test('a mutated zip member or manifest hash is rejected, not repaired', () => {
  const dir = ensureArtifact();
  const zip = readZip(readFileSync(path.join(dir, ZIP_FILE)));
  const entries = zip.entries.map(entry => (entry.path === 'dnd5e-runtime.mjs'
    ? {path: entry.path, bytes: Buffer.concat([entry.bytes, Buffer.from(' ')])}
    : {path: entry.path, bytes: entry.bytes}));
  const manifestBytes = readFileSync(path.join(dir, MANIFEST_FILE));
  const mutated = {...JSON.parse(manifestBytes.toString('utf8'))};
  mutated.artifact = {...mutated.artifact, sha256: '0'.repeat(64)};

  const tamperDir = makeTemp();
  writeFileSync(path.join(tamperDir, ZIP_FILE), makeZip(entries));
  writeFileSync(path.join(tamperDir, MANIFEST_FILE), `${JSON.stringify(mutated, null, 2)}\n`);
  writeFileSync(path.join(tamperDir, RECEIPT_FILE), readFileSync(path.join(dir, RECEIPT_FILE)));

  const inspected = inspect({
    artifact: path.join(tamperDir, ZIP_FILE),
    manifest: path.join(tamperDir, MANIFEST_FILE),
    receipt: path.join(tamperDir, RECEIPT_FILE),
    root: null,
    whitelist: loadWhitelist([]),
  });
  assert(inspected.problems.length > 0);
  assert(inspected.problems.some(problem => problem.includes('manifest.artifact.sha256')));
  assert(inspected.problems.some(problem => problem.includes('manifest.files[1]') || problem.includes('manifest.files[2]')));
});

test('readZip flags any drift from the deterministic recipe', () => {
  const dir = ensureArtifact();
  const bytes = Buffer.from(readFileSync(path.join(dir, ZIP_FILE)));

  const appended = Buffer.concat([bytes, Buffer.from('x')]);
  assert.match(readZip(appended).problems.join('\n'), /EOCD/);

  const repatched = Buffer.from(bytes);
  repatched.writeUInt16LE(0x22, 12); // local DOS date is fixed at 0x21 (1980-01-01)
  assert.match(readZip(repatched).problems.join('\n'), /时间戳非固定值/);
});
