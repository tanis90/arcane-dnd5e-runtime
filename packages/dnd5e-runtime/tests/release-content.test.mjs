import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'acorn';
import {hashString} from '@arcanedesk/automation-contracts/semantics';

const packageDir = fileURLToPath(new URL('../', import.meta.url));
const packageJson = JSON.parse(await readFile(path.join(packageDir, 'package.json'), 'utf8'));
const manifest = JSON.parse(await readFile(path.join(packageDir, 'dist/manifest.json'), 'utf8'));
const baseline = JSON.parse(await readFile(path.join(packageDir, 'src/source-baseline.json'), 'utf8'));

const ROOT_FILES = ['LICENSE', 'NOTICE', 'README.md', 'package.json'];
const SOURCE_FILES = [
  'automation.js',
  'availability.mjs',
  'build.mjs',
  'index.mjs',
  'metadata.mjs',
  'runtime-source.mjs',
  'sdk.mjs',
  'source-baseline.json',
];
const DIST_FILES = ['manifest.json', 'dnd5e-runtime.mjs'];
const PUBLISHABLE_FILES = new Set([
  ...ROOT_FILES,
  ...SOURCE_FILES.map(file => `src/${file}`),
  ...DIST_FILES.map(file => `dist/${file}`),
]);
const FORBIDDEN_EXTENSIONS = /\.(?:png|jpe?g|gif|webp|avif|svg|ico|bmp|tiff?|mp3|wav|ogg|flac|mp4|webm|mov|woff2?|ttf|otf|pdf|zip|tar|gz|7z|db|sqlite|sqlite3|wasm)$/i;
const FORBIDDEN_SEGMENTS = new Set([
  'compendium', 'compendiums', 'world', 'worlds', 'packs', 'assets',
  'img', 'images', 'icons', 'audio', 'sounds', 'tokens',
]);
const CONTENT_KEYS = new Set([
  'spell', 'spells', 'item', 'items', 'actor', 'actors', 'world', 'worlds',
  'compendium', 'compendiums', 'description', 'descriptions', 'image', 'images',
  'token', 'tokens', 'creature', 'creatures',
]);
const ALLOWED_DYNAMIC_IMPORTS = new Set(['/modules/auraeffects/scripts/helpers.mjs']);

function walkAst(node, visit) {
  if (!node || typeof node !== 'object') return;
  if (typeof node.type === 'string') visit(node);
  for (const [key, value] of Object.entries(node)) {
    if (key === 'loc' || key === 'range') continue;
    if (Array.isArray(value)) for (const child of value) walkAst(child, visit);
    else walkAst(value, visit);
  }
}

function references(source, sourceType) {
  const ast = parse(source, {ecmaVersion: 'latest', sourceType});
  const found = [];
  walkAst(ast, node => {
    if (['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].includes(node.type)
      && node.source) {
      found.push({specifier: node.source.value, dynamic: false});
    }
    if (node.type === 'ImportExpression') {
      found.push({specifier: node.source.type === 'Literal' ? node.source.value : null, dynamic: true});
    }
  });
  return found;
}

function assertJsonBoundary(value, trail = '') {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    assert(!CONTENT_KEYS.has(key), `content-bearing JSON key ${trail}${key}`);
    assertJsonBoundary(child, `${trail}${key}.`);
  }
}

test('the publishable file set is a whitelist with no content assets', async () => {
  assert.deepEqual(packageJson.files, ['src/', 'dist/', 'README.md', 'LICENSE', 'NOTICE']);
  assert.equal(packageJson.name, '@arcanedesk/dnd5e-runtime');
  assert.equal(packageJson.version, manifest.version);
  for (const relative of PUBLISHABLE_FILES) {
    const info = await stat(path.join(packageDir, relative));
    assert(info.isFile(), relative);
    assert(!FORBIDDEN_EXTENSIONS.test(relative), relative);
    for (const segment of relative.split('/')) assert(!FORBIDDEN_SEGMENTS.has(segment), relative);
    const bytes = await readFile(path.join(packageDir, relative));
    assert(!bytes.includes(0), `${relative} is binary`);
    const text = bytes.toString('utf8');
    assert(!/data:image\//i.test(text), `${relative} embeds image data`);
    assert(!/\beval\s*\(|\bnew Function\s*\(/.test(text), `${relative} evaluates code`);
    assert(!/\/home\/|\/Users\/|[A-Za-z]:\\[A-Za-z0-9_.-]|\/tmp\/|file:\/\/\//.test(text),
      `${relative} contains an absolute private path`);
    assert(!/BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}/.test(text),
      `${relative} contains credential material`);
  }
  const manifestKeys = ['artifact', 'baseline', 'buildHash', 'contentPolicy', 'contentPolicySummary',
    'engines', 'factoryName', 'generatedBy', 'moduleId', 'name', 'provenance', 'runtimeKind',
    'runtimeProfile', 'schemaVersion', 'source', 'sourceHash', 'version'];
  assert.deepEqual(Object.keys(manifest).sort(), manifestKeys.sort());
  assert.deepEqual(Object.keys(baseline).sort(), ['differences', 'review', 'schemaVersion', 'sha256', 'source', 'upstream']);
  assertJsonBoundary(manifest);
  assertJsonBoundary(baseline);
});

test('manifest hashes and byte counts match the final full artifact and source', async () => {
  const [source, artifact, baselineText] = await Promise.all([
    readFile(path.join(packageDir, 'src/automation.js')),
    readFile(path.join(packageDir, 'dist/dnd5e-runtime.mjs')),
    readFile(path.join(packageDir, 'src/source-baseline.json'), 'utf8'),
  ]);
  assert.equal(manifest.sourceHash, hashString(source.toString('utf8')));
  assert.equal(manifest.buildHash, hashString(artifact.toString('utf8')));
  assert.equal(manifest.artifact.sha256, manifest.buildHash);
  assert.equal(manifest.artifact.path, 'dist/dnd5e-runtime.mjs');
  assert.equal(manifest.artifact.bytes, Buffer.byteLength(artifact));
  assert.equal(manifest.source.sha256, manifest.sourceHash);
  assert.equal(manifest.source.bytes, Buffer.byteLength(source));
  assert.equal(manifest.baseline.sha256, hashString(baselineText));
  assert.equal(manifest.baseline.refreshPolicy, 'manual-only');
  assert.equal(manifest.provenance.testedRuntimeSha256, manifest.sourceHash);
  assert.equal(manifest.provenance.upstreamSourceSha256, baseline.upstream.sha256);
  assert.equal(manifest.contentPolicy, 'runtime-only');
  assert.equal(manifest.runtimeKind, 'full');
  assert.equal(manifest.factoryName, 'initializeDnd5eRuntime');
});

test('the full artifact keeps the reviewed host dynamic dependency and no static content imports', async () => {
  const artifactRefs = references(
    await readFile(path.join(packageDir, 'dist/dnd5e-runtime.mjs'), 'utf8'),
    'module',
  );
  assert.deepEqual(artifactRefs.filter(entry => !entry.dynamic), []);
  for (const entry of artifactRefs.filter(entry => entry.dynamic)) {
    assert(ALLOWED_DYNAMIC_IMPORTS.has(entry.specifier), `unreviewed dynamic import ${entry.specifier}`);
  }
  const sourceRefs = references(
    await readFile(path.join(packageDir, 'src/automation.js'), 'utf8'),
    'script',
  );
  assert.deepEqual(sourceRefs.filter(entry => !entry.dynamic), []);
  for (const entry of sourceRefs.filter(entry => entry.dynamic)) {
    assert(ALLOWED_DYNAMIC_IMPORTS.has(entry.specifier), `unreviewed source dynamic import ${entry.specifier}`);
  }
});

test('npm pack --dry-run contains exactly the reviewed package files', async () => {
  const output = execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: packageDir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const [packed] = JSON.parse(output);
  const packedFiles = packed.files.map(file => file.path).sort();
  assert.deepEqual(packedFiles, [...PUBLISHABLE_FILES].sort());
  assert.equal(packed.name, packageJson.name);
  assert.equal(packed.version, packageJson.version);
  assert(packed.unpackedSize > 0);
});
