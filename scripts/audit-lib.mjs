import {execFileSync} from 'node:child_process';
import {readFile, readdir, stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {hashString} from '../packages/automation-contracts/src/semantics.mjs';

export const PACKAGE_NAMES = ['automation-contracts', 'spell-compiler', 'dnd5e-runtime'];

const IGNORED_REPOSITORY_DIRS = new Set(['.git', 'node_modules']);
const FORBIDDEN_EXTENSIONS = /\.(?:png|jpe?g|gif|webp|avif|svg|ico|bmp|tiff?|mp3|wav|ogg|flac|mp4|webm|mov|woff2?|ttf|otf|pdf|zip|tar|gz|7z|db|sqlite|sqlite3|wasm)$/i;
const FORBIDDEN_SEGMENTS = new Set([
  'compendium', 'compendiums', 'world', 'worlds', 'packs', 'assets',
  'img', 'images', 'icons', 'audio', 'sounds', 'tokens', 'spells-2014',
]);
const SECRET_PATTERNS = [
  {label: 'absolute private path', pattern: /\/home\/|\/Users\/|[A-Za-z]:\\[A-Za-z0-9_.-]|\/tmp\/|file:\/\/\//},
  {label: 'private compiler log path', pattern: /docs\/foundry-automation/},
  {label: 'private workspace path', pattern: /web\/packages\//},
  {label: 'private key material', pattern: /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/},
  {label: 'credential material', pattern: /AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|xox[baprs]-/},
  {label: 'embedded image data', pattern: /data:image\//i},
];
const SENSITIVE_BASENAMES = new Set(['.npmrc', '.env', 'id_rsa', 'id_ed25519']);
// The audit tooling must contain the detector patterns themselves; scan its
// paths for assets/sensitive names but do not match its own regex literals.
const AUDIT_TOOLING = new Set(['scripts/audit-lib.mjs', 'scripts/pack-check.mjs']);

async function walk(directory, relative = '') {
  const files = [];
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    if (IGNORED_REPOSITORY_DIRS.has(entry.name)) continue;
    const relativePath = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...await walk(path.join(directory, entry.name), relativePath));
    else if (entry.isFile()) files.push(relativePath);
  }
  return files.sort();
}

function checkPath(relative, {allowTests = true} = {}) {
  assert(!FORBIDDEN_EXTENSIONS.test(relative), `forbidden asset extension: ${relative}`);
  const segments = relative.split('/');
  for (const segment of segments) assert(!FORBIDDEN_SEGMENTS.has(segment), `forbidden content path: ${relative}`);
  assert(!SENSITIVE_BASENAMES.has(segments.at(-1)), `sensitive file: ${relative}`);
  if (!allowTests) assert(!segments.includes('tests') && !segments.includes('fixtures'), `test-only file in package: ${relative}`);
}

async function checkFile(directory, relative, options) {
  checkPath(relative, options);
  const bytes = await readFile(path.join(directory, relative));
  assert(!bytes.includes(0), `binary file in public content: ${relative}`);
  if (!AUDIT_TOOLING.has(relative)) {
    const text = bytes.toString('utf8');
    for (const {label, pattern} of SECRET_PATTERNS) {
      assert(!pattern.test(text), `${label} in ${relative}`);
    }
  }
  return bytes;
}

export async function auditRepository(root) {
  const files = await walk(root);
  for (const relative of files) await checkFile(root, relative);
  return {root, fileCount: files.length, files};
}

async function publishableFiles(packageDir, files) {
  const expected = [];
  for (const entry of files) {
    if (entry.endsWith('/')) {
      const relativeDir = entry.slice(0, -1);
      const entries = await walk(path.join(packageDir, relativeDir));
      for (const relative of entries) expected.push(`${relativeDir}/${relative}`);
    } else {
      const info = await stat(path.join(packageDir, entry));
      if (info.isFile()) expected.push(entry);
    }
  }
  expected.push('package.json');
  return [...new Set(expected)].sort();
}

async function verifyRuntimeManifest(packageDir, source, artifact) {
  const manifest = JSON.parse(await readFile(path.join(packageDir, 'dist/manifest.json'), 'utf8'));
  assert.equal(manifest.contentPolicy, 'runtime-only');
  assert.equal(manifest.runtimeKind, 'full');
  assert.equal(manifest.factoryName, 'initializeDnd5eRuntime');
  assert.equal(manifest.artifact.path, 'dist/dnd5e-runtime.mjs');
  assert.equal(manifest.sourceHash, hashString(source.toString('utf8')));
  assert.equal(manifest.buildHash, hashString(artifact.toString('utf8')));
  assert.equal(manifest.artifact.sha256, manifest.buildHash);
  assert.equal(manifest.source.sha256, manifest.sourceHash);
  return manifest;
}

export async function auditPackage(root, name) {
  const packageDir = path.join(root, 'packages', name);
  const packageJson = JSON.parse(await readFile(path.join(packageDir, 'package.json'), 'utf8'));
  const expected = await publishableFiles(packageDir, packageJson.files);
  const output = execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: packageDir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const [packed] = JSON.parse(output);
  const packedFiles = packed.files.map(file => file.path).sort();
  assert.deepEqual(packedFiles, expected, `${packageJson.name} tarball file whitelist`);
  assert.equal(packed.name, packageJson.name);
  assert.equal(packed.version, packageJson.version);
  for (const relative of packedFiles) await checkFile(packageDir, relative, {allowTests: false});

  if (name === 'dnd5e-runtime' || name === 'automation-contracts') {
    assert.equal(packageJson.engines.node, '>=22.12', `${packageJson.name} runtime engine floor`);
  }
  if (name === 'dnd5e-runtime') {
    const [source, artifact] = await Promise.all([
      readFile(path.join(packageDir, 'src/automation.js')),
      readFile(path.join(packageDir, 'dist/dnd5e-runtime.mjs')),
    ]);
    verifyRuntimeManifest(packageDir, source, artifact);
  }
  if (name === 'spell-compiler') {
    assert.equal(packageJson.engines.node, '>=24 <25', 'compiler must keep its explicit Node 24 engine');
    assert(packedFiles.includes('src/data/spell-automation/dsl.mjs'));
    assert(packedFiles.includes('src/tools/lib/spell-automation-compiler.mjs'));
  }

  return {
    name: packageJson.name,
    version: packageJson.version,
    fileCount: packedFiles.length,
    unpackedSize: packed.unpackedSize,
    files: packedFiles,
  };
}

export async function auditAllPackages(root) {
  const results = [];
  for (const name of PACKAGE_NAMES) results.push(await auditPackage(root, name));
  return results;
}
