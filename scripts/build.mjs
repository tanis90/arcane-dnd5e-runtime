import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildDnd5eRuntime} from '../packages/dnd5e-runtime/src/build.mjs';
import {readRuntimeSource} from '../packages/dnd5e-runtime/src/runtime-source.mjs';
import {hashString} from '../packages/automation-contracts/src/semantics.mjs';
import {ARCANE_DND5E_2014_RUNTIME_PROFILE} from '../packages/automation-contracts/src/runtime-profile.mjs';
import {
  CONTENT_POLICY,
  DEFAULT_MODULE_ID,
  INITIALIZER_FACTORY,
  RUNTIME_KIND,
  RUNTIME_SCHEMA_VERSION,
  SDK_ENGINES,
  SDK_VERSION,
} from '../packages/dnd5e-runtime/src/metadata.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageDir = path.join(root, 'packages', 'dnd5e-runtime');
const packagePath = path.join(packageDir, 'package.json');
const baselinePath = path.join(packageDir, 'src', 'source-baseline.json');
const distDir = path.join(packageDir, 'dist');
const artifactName = 'dnd5e-runtime.mjs';
const manifestName = 'manifest.json';

const [packageText, baselineText, source] = await Promise.all([
  readFile(packagePath, 'utf8'),
  readFile(baselinePath, 'utf8'),
  readRuntimeSource(),
]);
const packageJson = JSON.parse(packageText);
const baseline = JSON.parse(baselineText);

if (packageJson.name !== '@arcanedesk/dnd5e-runtime' || packageJson.version !== SDK_VERSION) {
  throw new Error('Package identity or version does not match the SDK metadata module');
}
if (baseline.review?.refreshPolicy !== 'manual-only') {
  throw new Error('source-baseline.json must remain manual-review-only');
}
if (hashString(source) !== baseline.sha256) {
  throw new Error('Runtime source does not match the manually reviewed source-baseline.json');
}

const built = await buildDnd5eRuntime();
const artifact = built.source;
const sourceHash = hashString(source);
const buildHash = hashString(artifact);
const manifest = {
  name: packageJson.name,
  version: SDK_VERSION,
  schemaVersion: RUNTIME_SCHEMA_VERSION,
  runtimeKind: RUNTIME_KIND,
  factoryName: INITIALIZER_FACTORY,
  runtimeProfile: {
    id: ARCANE_DND5E_2014_RUNTIME_PROFILE.id,
    version: ARCANE_DND5E_2014_RUNTIME_PROFILE.version,
    ruleset: ARCANE_DND5E_2014_RUNTIME_PROFILE.ruleset,
    system: {
      id: ARCANE_DND5E_2014_RUNTIME_PROFILE.system.id,
      majorVersion: ARCANE_DND5E_2014_RUNTIME_PROFILE.system.majorVersion,
    },
  },
  engines: SDK_ENGINES,
  moduleId: DEFAULT_MODULE_ID,
  source: {
    path: 'src/automation.js',
    bytes: Buffer.byteLength(source),
    sha256: sourceHash,
  },
  sourceHash,
  artifact: {
    path: `dist/${artifactName}`,
    bytes: Buffer.byteLength(artifact),
    sha256: buildHash,
  },
  buildHash,
  contentPolicy: CONTENT_POLICY,
  contentPolicySummary: 'Complete DND5E 2014 runtime mechanics only; no spell descriptions, compendium documents, images, translations or world state.',
  baseline: {
    path: 'src/source-baseline.json',
    sha256: hashString(baselineText),
    refreshPolicy: baseline.review?.refreshPolicy,
  },
  provenance: {
    upstreamRepository: baseline.upstream?.repository,
    upstreamCommit: baseline.upstream?.commit,
    upstreamSourceSha256: baseline.upstream?.sha256,
    testedRuntimeOrigin: baseline.source?.origin,
    testedRuntimeSha256: baseline.sha256,
    reviewedDifferences: baseline.differences.map(entry => entry.name),
  },
  generatedBy: 'scripts/build.mjs',
};

await mkdir(distDir, {recursive: true});
await writeFile(path.join(distDir, artifactName), artifact, 'utf8');
await writeFile(path.join(distDir, manifestName), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

console.log(`Built ${path.relative(root, path.join(distDir, artifactName))} (${manifest.artifact.bytes} bytes)`);
console.log(`sourceHash=${sourceHash}`);
console.log(`buildHash=${buildHash}`);
console.log(`apiAssignmentCount=${built.report.apiAssignmentCount}, adapters=${built.report.adapters.length}`);
