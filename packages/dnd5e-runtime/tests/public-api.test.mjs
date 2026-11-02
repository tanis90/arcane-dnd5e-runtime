import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as api from '../src/index.mjs';
import {
  CONTENT_POLICY,
  DEFAULT_MODULE_ID,
  INITIALIZER_FACTORY,
  RUNTIME_KIND,
  RUNTIME_SCHEMA_VERSION,
  SDK_ENGINES,
  SDK_VERSION,
  buildDnd5eRuntime,
  createAuto2014Runtime,
  createDnd5eRuntime,
  readRuntimeSource,
} from '../src/index.mjs';
import {hashString} from '@arcanedesk/automation-contracts/semantics';
import {createFullHost, LEGACY_MODULE_ID} from './full-host-fixture.mjs';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const baseline = JSON.parse(await readFile(new URL('../src/source-baseline.json', import.meta.url), 'utf8'));
const artifact = await readFile(new URL('../dist/dnd5e-runtime.mjs', import.meta.url), 'utf8');
const manifest = JSON.parse(await readFile(new URL('../dist/manifest.json', import.meta.url), 'utf8'));
const expectedKeys = JSON.parse(await readFile(new URL('./fixtures/full-runtime-baseline.json', import.meta.url), 'utf8'));

test('readRuntimeSource and buildDnd5eRuntime expose the single full artifact', async () => {
  const source = await readRuntimeSource();
  assert.equal(hashString(source), baseline.sha256);
  const built = await buildDnd5eRuntime();
  assert.equal(built.source, artifact);
  assert.equal(hashString(built.source), manifest.buildHash);
  assert(built.source.includes('export function initializeDnd5eRuntime'));
  assert(!('buildSpellRuntime' in api));
});

test('createDnd5eRuntime exposes the full manifest and initializer without touching a world', async () => {
  assert.equal(globalThis.game, undefined);
  const sdk = await createDnd5eRuntime();
  assert.equal(globalThis.game, undefined);
  assert.equal(SDK_VERSION, '0.1.0');
  assert.equal(packageJson.version, SDK_VERSION);
  assert.equal(packageJson.name, '@arcanedesk/dnd5e-runtime');
  assert.equal(SDK_ENGINES.node, '>=22.12');
  assert.equal(DEFAULT_MODULE_ID, LEGACY_MODULE_ID);
  assert.equal(sdk.manifest.name, packageJson.name);
  assert.equal(sdk.manifest.version, SDK_VERSION);
  assert.equal(sdk.manifest.schemaVersion, RUNTIME_SCHEMA_VERSION);
  assert.equal(sdk.manifest.runtimeKind, RUNTIME_KIND);
  assert.equal(sdk.manifest.factoryName, INITIALIZER_FACTORY);
  assert.equal(sdk.manifest.contentPolicy, CONTENT_POLICY);
  assert.equal(sdk.manifest.runtimeProfile.id, 'arcane-dnd5e-2014');
  assert.equal(sdk.manifest.runtimeProfile.version, 1);
  assert.equal(sdk.manifest.sourceHash, baseline.sha256);
  assert.equal(sdk.manifest.buildHash, hashString(artifact));
  assert.equal(sdk.manifest.artifact.path, 'dist/dnd5e-runtime.mjs');
  assert.equal(sdk.manifest.artifact.sha256, sdk.manifest.buildHash);
  assert.equal(sdk.manifest.provenance.testedRuntimeSha256, baseline.sha256);
  assert(Object.isFrozen(sdk));
  assert(Object.isFrozen(sdk.manifest));
  assert(Object.isFrozen(sdk.initializer));
  assert.equal(sdk.initializer.factoryName, INITIALIZER_FACTORY);
  assert.equal(sdk.initializer.moduleId, LEGACY_MODULE_ID);
  assert.equal(sdk.initializer.source, artifact);
  assert.equal(typeof sdk.initialize, 'function');
});

test('createAuto2014Runtime remains the same full-runtime compatibility alias', async () => {
  assert.equal(createAuto2014Runtime, createDnd5eRuntime);
  const sdk = await createAuto2014Runtime();
  assert.equal(sdk.manifest.runtimeKind, 'full');
});

test('initialize(host) delegates an immutable payload and passes the host runtime through', async () => {
  const sdk = await createDnd5eRuntime({moduleId: 'test-host'});
  const payloads = [];
  const expected = {mode: 'host-owned'};
  const host = {
    async evaluateInitializer(payload) {
      payloads.push(payload);
      return expected;
    },
  };
  assert.equal(await sdk.initializer.initialize(host), expected);
  assert.equal(await sdk.initialize(host), expected);
  assert.equal(payloads.length, 2);
  for (const payload of payloads) {
    assert.equal(payload.moduleId, 'test-host');
    assert.equal(payload.source, artifact);
    assert.equal(payload.manifest, sdk.manifest);
    assert(Object.isFrozen(payload));
  }
});

test('initialize rejects invalid hosts and invalid module ids', async () => {
  const sdk = await createDnd5eRuntime();
  let called = 0;
  await assert.rejects(() => sdk.initialize(undefined), /evaluateInitializer/);
  await assert.rejects(() => sdk.initialize({}), /evaluateInitializer/);
  await assert.rejects(() => sdk.initialize({evaluateInitializer: () => { called += 1; }}),
    /must return the initialized runtime/);
  assert.equal(called, 1);
  const failure = new Error('host evaluation failed');
  await assert.rejects(() => sdk.initialize({evaluateInitializer: async () => { throw failure; }}), failure);
  await assert.rejects(() => createDnd5eRuntime({moduleId: 'Not A Module'}), /moduleId/);
});

test('the public host contract executes the full runtime and matches the baseline', async () => {
  const sdk = await createDnd5eRuntime();
  const host = createFullHost({legacyActive: true, moduleId: LEGACY_MODULE_ID});
  const runtime = await sdk.initialize(host);
  assert.equal(runtime.mode, 'standalone');
  host.triggerReady();
  assert.equal(host.hookNames().length, 54);
  assert.deepEqual(host.hookNames(), expectedKeys.hookNames);
  assert.deepEqual(host.apiKeys(), expectedKeys.apiKeys);
  assert.equal(host.apiKeys().length, 163);
});

test('a different module with active legacy Auto remains legacy through the public API', async () => {
  const sdk = await createDnd5eRuntime({moduleId: 'arcane-spells-2014'});
  const host = createFullHost({legacyActive: true, moduleId: 'arcane-spells-2014'});
  const runtime = await sdk.initialize(host);
  assert.equal(runtime.mode, 'legacy');
  assert.equal(runtime.api.original, true);
  assert.equal(host.hooks.size, 0);
});

test('public host failure rolls back hooks and the script registry', async () => {
  const sdk = await createDnd5eRuntime();
  const host = createFullHost({failAt: 2});
  await assert.rejects(() => sdk.initialize(host), /registration failure/);
  assert.equal(host.hooks.size, 0);
  assert.equal(host.context.ArcaneDnd5e2014SpellScripts, host.priorScripts);
});

test('full manifest and build are deterministic across repeated calls', async () => {
  const first = await createDnd5eRuntime();
  const second = await createDnd5eRuntime();
  assert.deepEqual(first.manifest, second.manifest);
  assert.equal(first.initializer.source, second.initializer.source);
  const [a, b] = await Promise.all([buildDnd5eRuntime(), buildDnd5eRuntime()]);
  assert.equal(a.source, b.source);
  assert.equal(expectedKeys.hookCount, 54);
  assert.equal(expectedKeys.apiCount, 163);
});
