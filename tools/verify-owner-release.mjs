import {execFileSync} from 'node:child_process';
import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {hashString} from '../packages/automation-contracts/src/semantics.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RUNTIME_PACKAGE_DIR = 'packages/dnd5e-runtime';
const SOURCE_PATH = `${RUNTIME_PACKAGE_DIR}/src/automation.js`;
const ARTIFACT_PATH = `${RUNTIME_PACKAGE_DIR}/dist/dnd5e-runtime.mjs`;
const MANIFEST_PATH = `${RUNTIME_PACKAGE_DIR}/dist/manifest.json`;
const BASELINE_PATH = `${RUNTIME_PACKAGE_DIR}/src/source-baseline.json`;
const PACKAGE_JSON_PATH = `${RUNTIME_PACKAGE_DIR}/package.json`;
const COMMIT_PATTERN = /^[0-9a-f]{40}$/;

export const RECEIPT_KIND = 'owner-ci-receipt';
export const RECEIPT_SCHEMA_VERSION = 1;
// The exact command chain owner-ci.yml runs; a receipt is only issued after
// every one of them has succeeded and this verifier passed last.
export const DEFAULT_COMMANDS = Object.freeze([
  'npm ci',
  'npm run build',
  'npm test',
  'npm run test:compiler:node24',
  'npm run pack:check',
  'node tools/verify-owner-release.mjs',
]);

function check(name, pass, detail) {
  return {name, pass, detail};
}

/** Reads every release-relevant file of the runtime package. */
export async function readReleaseInputs(packageRoot = root) {
  const [sourceText, baselineText, manifestText, artifactText, packageText] = await Promise.all([
    readFile(path.join(packageRoot, SOURCE_PATH), 'utf8'),
    readFile(path.join(packageRoot, BASELINE_PATH), 'utf8'),
    readFile(path.join(packageRoot, MANIFEST_PATH), 'utf8'),
    readFile(path.join(packageRoot, ARTIFACT_PATH), 'utf8'),
    readFile(path.join(packageRoot, PACKAGE_JSON_PATH), 'utf8'),
  ]);
  return {
    source: {path: SOURCE_PATH, text: sourceText, bytes: Buffer.byteLength(sourceText), sha256: hashString(sourceText)},
    baselineText,
    baseline: JSON.parse(baselineText),
    manifest: JSON.parse(manifestText),
    artifact: {path: ARTIFACT_PATH, text: artifactText, bytes: Buffer.byteLength(artifactText), sha256: hashString(artifactText)},
    packageJson: JSON.parse(packageText),
  };
}

/** Rebuilds the browser initializer in memory from the current sources.
 * Never writes to dist; the emitted bytes must equal the committed artifact.
 */
export async function rebuildRuntimeArtifact(packageRoot = root) {
  const buildModule = pathToFileURL(path.join(packageRoot, RUNTIME_PACKAGE_DIR, 'src', 'build.mjs')).href;
  const {buildDnd5eRuntime} = await import(buildModule);
  return (await buildDnd5eRuntime()).source;
}

/** Collects every release-consistency check instead of failing fast, so the
 * report names all mismatches at once. Rebuild comparison runs only when the
 * caller supplies `rebuiltArtifact`.
 */
export function verifyReleaseConsistency({source, baseline, baselineText, manifest, artifact, packageJson, rebuiltArtifact}) {
  const checks = [];
  checks.push(check('source-baseline', source.sha256 === baseline.sha256,
    `src/automation.js ${source.sha256} vs reviewed baseline ${baseline.sha256}`));
  checks.push(check('manifest-source-hash', manifest.sourceHash === source.sha256 && manifest.source?.sha256 === source.sha256,
    `manifest ${manifest.sourceHash} vs file ${source.sha256}`));
  checks.push(check('manifest-source-bytes', manifest.source?.bytes === source.bytes && manifest.source?.path === 'src/automation.js',
    `manifest ${manifest.source?.bytes} bytes vs file ${source.bytes} bytes`));
  checks.push(check('manifest-artifact-hash', manifest.buildHash === artifact.sha256 && manifest.artifact?.sha256 === artifact.sha256,
    `manifest ${manifest.buildHash} vs file ${artifact.sha256}`));
  checks.push(check('manifest-artifact-bytes', manifest.artifact?.bytes === artifact.bytes && manifest.artifact?.path === 'dist/dnd5e-runtime.mjs',
    `manifest ${manifest.artifact?.bytes} bytes vs file ${artifact.bytes} bytes`));
  checks.push(check('manifest-baseline-hash', manifest.baseline?.sha256 === hashString(baselineText),
    `manifest ${manifest.baseline?.sha256} vs source-baseline.json ${hashString(baselineText)}`));
  const identityOk = manifest.contentPolicy === 'runtime-only'
    && manifest.runtimeKind === 'full'
    && manifest.factoryName === 'initializeDnd5eRuntime'
    && manifest.schemaVersion === 1;
  checks.push(check('manifest-identity', identityOk,
    `contentPolicy=${manifest.contentPolicy}, runtimeKind=${manifest.runtimeKind}, factory=${manifest.factoryName}, schema=${manifest.schemaVersion}`));
  checks.push(check('package-identity', manifest.name === packageJson?.name && manifest.version === packageJson?.version,
    `package.json ${packageJson?.name}@${packageJson?.version} vs manifest ${manifest.name}@${manifest.version}`));
  if (rebuiltArtifact !== undefined) {
    checks.push(check('rebuild-deterministic', rebuiltArtifact === artifact.text,
      `fresh build ${hashString(rebuiltArtifact)} vs committed artifact ${artifact.sha256}`));
  }
  const failures = checks.filter(result => !result.pass);
  return {
    passed: failures.length === 0,
    checks,
    failures,
    sourceHash: source.sha256,
    buildHash: artifact.sha256,
    artifactHash: artifact.sha256,
    manifest,
  };
}

/** Pure git binding rule, separable from repo access so tests can drive it. */
export function assertGitBinding({headCommit, expectedCommit, statusLines = []}) {
  if (typeof headCommit !== 'string' || !COMMIT_PATTERN.test(headCommit)) {
    throw new Error(`No testable HEAD commit resolved: ${JSON.stringify(headCommit)}`);
  }
  const dirty = statusLines.filter(line => line.trim().length > 0);
  if (dirty.length > 0) throw new Error(`Release tree has uncommitted drift: ${dirty.join(' | ')}`);
  if (expectedCommit !== undefined) {
    if (typeof expectedCommit !== 'string' || !COMMIT_PATTERN.test(expectedCommit)) {
      throw new Error(`Expected commit is not a full sha: ${JSON.stringify(expectedCommit)}`);
    }
    if (headCommit !== expectedCommit) {
      throw new Error(`Tested commit ${headCommit} does not match the expected commit ${expectedCommit}`);
    }
  }
  return {commit: headCommit};
}

/** HEAD plus the cleanliness of every package source/dist path that feeds the
 * artifact hash. Untracked files outside packages/ (for example a receipt) are
 * ignored.
 */
export function resolveGitBinding(repoRoot = root, {expectedCommit} = {}) {
  const headCommit = execFileSync('git', ['rev-parse', 'HEAD'], {cwd: repoRoot, encoding: 'utf8'}).trim();
  const statusLines = execFileSync('git', ['status', '--porcelain', '--', 'packages'], {cwd: repoRoot, encoding: 'utf8'})
    .split('\n').filter(line => line.trim().length > 0);
  return assertGitBinding({headCommit, expectedCommit, statusLines});
}

/** Builds the machine-readable receipt for the frontend manifest ci block.
 * `result` is 'passed' and reachable only from a fully verified state; runUrl
 * stays null unless a CI run URL is handed in, so a local run can never be
 * mistaken for a CI receipt.
 */
export function buildOwnerReceipt({verified, testedCommit, runUrl = null, commands = DEFAULT_COMMANDS}) {
  if (!verified?.passed) throw new Error('Refusing to build a passed receipt from a failed verification');
  const {commit} = assertGitBinding({headCommit: testedCommit});
  if (runUrl !== null && (typeof runUrl !== 'string' || runUrl.length === 0)) {
    throw new Error(`runUrl must be null or a non-empty URL, received ${JSON.stringify(runUrl)}`);
  }
  const {manifest} = verified;
  return {
    schemaVersion: RECEIPT_SCHEMA_VERSION,
    kind: RECEIPT_KIND,
    unit: {
      package: manifest.name,
      version: manifest.version,
      moduleId: manifest.moduleId,
      schemaVersion: manifest.schemaVersion,
      contentPolicy: manifest.contentPolicy,
      sourcePath: SOURCE_PATH,
      artifactPath: ARTIFACT_PATH,
      artifactBytes: manifest.artifact.bytes,
    },
    testedCommit: commit,
    sourceHash: verified.sourceHash,
    buildHash: verified.buildHash,
    artifactHash: verified.artifactHash,
    commands: [...commands],
    runUrl,
    result: 'passed',
    checks: verified.checks.map(result => result.name),
  };
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (value === undefined) throw new Error(`Missing value for ${JSON.stringify(flag)}`);
    if (flag === '--receipt') args.receipt = value;
    else if (flag === '--run-url') args.runUrl = value === 'null' ? null : value;
    else if (flag === '--commit') args.commit = value;
    else if (flag === '--root') args.root = value;
    else throw new Error(`Unknown argument ${JSON.stringify(flag)}`);
  }
  return args;
}

/** CLI entry. The tool runs from the owner tooling checkout but reads,
 * rebuilds and binds to the tested source tree given by `--root` (default:
 * the checkout that contains this tool). Every file read, the in-memory
 * rebuild and the git binding target that root; only this module's own
 * imports come from the tooling checkout, so a pinned older source can be
 * certified without its own copy of these tools.
 */
export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const testedRoot = args.root ? path.resolve(args.root) : root;
  let git;
  try {
    git = resolveGitBinding(testedRoot, {expectedCommit: args.commit});
  } catch (error) {
    throw new Error(`Tested source root ${testedRoot} has no usable git checkout: ${error.message}`);
  }
  let inputs;
  try {
    inputs = await readReleaseInputs(testedRoot);
  } catch (error) {
    throw new Error(`Tested source root ${testedRoot} is not a readable release tree: ${error.message}`);
  }
  let rebuilt;
  try {
    rebuilt = await rebuildRuntimeArtifact(testedRoot);
  } catch (error) {
    throw new Error(`In-memory rebuild of the tested source failed (run npm ci in the tested root first): ${error.message}`);
  }
  const verified = verifyReleaseConsistency({...inputs, rebuiltArtifact: rebuilt});
  for (const failure of verified.failures) console.error(`FAIL ${failure.name}: ${failure.detail}`);
  if (!verified.passed) throw new Error(`Owner release verification failed with ${verified.failures.length} mismatch(es)`);
  const receipt = buildOwnerReceipt({verified, testedCommit: git.commit, runUrl: args.runUrl ?? null});
  if (args.receipt) await writeFile(args.receipt, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(receipt, null, 2));
  return receipt;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch(error => {
    console.error(`owner-release verify: ${error.message}`);
    process.exitCode = 1;
  });
}
