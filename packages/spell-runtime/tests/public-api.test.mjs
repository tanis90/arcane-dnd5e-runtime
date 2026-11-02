import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {
  CONTENT_POLICY,
  DEFAULT_MODULE_ID,
  RUNTIME_SCHEMA_VERSION,
  SDK_ENGINES,
  SDK_VERSION,
  buildSpellRuntime,
  createAuto2014Runtime,
  readRuntimeSource,
} from '../src/index.mjs';
import {hashString} from '@arcanedesk/automation-contracts/semantics';
import {createBrowserHost} from './host-fixture.mjs';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const baseline = JSON.parse(await readFile(new URL('../src/source-baseline.json', import.meta.url), 'utf8'));
const artifact = await readFile(new URL('../dist/spell-runtime.mjs', import.meta.url), 'utf8');
const manifest = JSON.parse(await readFile(new URL('../dist/manifest.json', import.meta.url), 'utf8'));

test('readRuntimeSource and buildSpellRuntime keep their compatibility surface', async () => {
  const source = await readRuntimeSource();
  assert.equal(hashString(source), baseline.sha256);
  const built = await buildSpellRuntime();
  assert.equal(built.source, artifact);
  assert.equal(hashString(built.source), manifest.buildHash);
  assert(built.report.declarations.includes('dispatchPerSpellScript'));
  assert(!built.report.declarations.includes('applyDeclaredDivineSmite'));
  assert(built.source.includes('options?.longRestCleanup !== true'));
  assert(source.includes('modules/arcane-dnd5e-2014-automation/Nicons/Ability_Ambush.png'));
});

test('createAuto2014Runtime exposes a locked manifest and browser initializer without touching a world', async () => {
  assert.equal(globalThis.game, undefined);
  const sdk = await createAuto2014Runtime();
  assert.equal(globalThis.game, undefined);
  assert(SDK_ENGINES.node === '>=22.12');
  assert.equal(SDK_VERSION, packageJson.version);
  assert.equal(sdk.manifest.name, packageJson.name);
  assert.equal(sdk.manifest.version, SDK_VERSION);
  assert.equal(sdk.manifest.schemaVersion, RUNTIME_SCHEMA_VERSION);
  assert.equal(sdk.manifest.contentPolicy, CONTENT_POLICY);
  assert.equal(sdk.manifest.runtimeProfile.id, 'arcane-dnd5e-2014');
  assert.equal(sdk.manifest.runtimeProfile.version, 1);
  assert.equal(sdk.manifest.sourceHash, baseline.sha256);
  assert.equal(sdk.manifest.buildHash, hashString(artifact));
  assert.equal(sdk.manifest.artifact.sha256, sdk.manifest.buildHash);
  assert.equal(sdk.manifest.provenance.upstreamCommit, 'f91719cf19cc8208e7568c6d31b1e18c3e43deab');
  assert.deepEqual(sdk.manifest.provenance.reviewedDifferences, [
    'longRestCleanup compatibility shim',
    'Dread Ambusher effect icon',
  ]);
  assert(Object.isFrozen(sdk));
  assert(Object.isFrozen(sdk.manifest));
  assert(Object.isFrozen(sdk.initializer));
  assert.equal(sdk.initializer.factoryName, 'initializeSpellRuntime');
  assert.equal(sdk.initializer.moduleId, DEFAULT_MODULE_ID);
  assert.equal(sdk.initializer.source, artifact);
  assert.equal(typeof sdk.initialize, 'function');
});

test('initialize(host) delegates an immutable payload and passes the host runtime through', async () => {
  const sdk = await createAuto2014Runtime({moduleId: 'test-host'});
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

test('initialize rejects missing or invalid hosts before evaluation', async () => {
  const sdk = await createAuto2014Runtime();
  let called = 0;
  const host = {evaluateInitializer: () => { called += 1; }};
  await assert.rejects(() => sdk.initialize(undefined), /evaluateInitializer/);
  await assert.rejects(() => sdk.initialize({}), /evaluateInitializer/);
  await assert.rejects(() => sdk.initialize(host), /must return the initialized runtime/);
  assert.equal(called, 1);
  const failure = new Error('host evaluation failed');
  await assert.rejects(() => sdk.initialize({evaluateInitializer: async () => { throw failure; }}), failure);
  await assert.rejects(() => createAuto2014Runtime({moduleId: 'Not A Module'}), /moduleId/);
});

test('the generated initializer executes in a real VM through the public host contract', async () => {
  const sdk = await createAuto2014Runtime();
  const host = createBrowserHost();
  const runtime = await sdk.initialize(host);
  assert.equal(host.calls.length, 1);
  assert.equal(runtime.mode, 'standalone');
  assert(host.hooks.size > 0);
  const hookNames = [...host.hooks.values()].map(hook => hook.name);
  for (const name of ['ready', 'dae.modifySpecials', 'dnd5e.preUseActivity', 'midi-qol.RollComplete']) {
    assert(hookNames.includes(name), name);
  }
  for (const name of ['createItem', 'preCreateItem', 'dnd5e.preRollInitiative', 'dnd5e.preRollAttack']) {
    assert(!hookNames.includes(name), name);
  }
  assert(await sdk.initialize(host) === runtime);
  assert.equal(host.hooks.size, hookNames.length);
  const ready = [...host.hooks.values()].find(hook => hook.name === 'ready');
  ready.callback();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(typeof runtime.api.dispatchPerSpellScript, 'function');
  assert.equal(runtime.api.applyDeclaredDivineSmite, undefined);
});

test('the public host contract observes legacy ownership and rolls back partial registration', async () => {
  const sdk = await createAuto2014Runtime();
  const legacyHost = createBrowserHost({legacy: true});
  const legacy = await sdk.initialize(legacyHost);
  assert.equal(legacy.mode, 'legacy');
  assert.equal(legacy.api.original, true);
  assert.equal(legacyHost.hooks.size, 0);

  const failingHost = createBrowserHost({failAt: 4});
  await assert.rejects(() => sdk.initialize(failingHost), /registration failure/);
  assert.equal(failingHost.hooks.size, 0);
  assert.equal(failingHost.context.ArcaneDnd5e2014SpellScripts, undefined);
});

test('manifest and projection are deterministic across repeated calls', async () => {
  const first = await createAuto2014Runtime();
  const second = await createAuto2014Runtime();
  assert.deepEqual(first.manifest, second.manifest);
  assert.equal(first.initializer.source, second.initializer.source);
  const [a, b] = await Promise.all([buildSpellRuntime(), buildSpellRuntime()]);
  assert.equal(a.source, b.source);
  assert.deepEqual(a.report, b.report);
});
