import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {buildDnd5eRuntime} from '../src/build.mjs';
import {readRuntimeSource} from '../src/runtime-source.mjs';
import {hashString} from '@arcanedesk/automation-contracts/semantics';
import {
  LEGACY_MODULE_ID,
  createFullHost,
  executeFullSource,
  executeRawFull,
} from './full-host-fixture.mjs';

const fixture = JSON.parse(await readFile(new URL('./fixtures/full-runtime-baseline.json', import.meta.url), 'utf8'));
const rawSource = await readFile(new URL('../src/automation.js', import.meta.url), 'utf8');
const built = await buildDnd5eRuntime();

test('full build is deterministic and preserves the reviewed raw source', async () => {
  const second = await buildDnd5eRuntime();
  assert.equal(second.source, built.source);
  assert.equal(hashString(rawSource), fixture.sourceSha256);
  assert.equal(hashString(await readRuntimeSource()), fixture.sourceSha256);
  assert.equal(built.report.apiAssignmentCount, 1);
  assert.equal(built.report.adapters.length, 44);
  assert(built.source.includes('export function initializeDnd5eRuntime'));
  assert(built.source.includes('options?.longRestCleanup !== true'));
  assert(built.source.includes('modules/arcane-dnd5e-2014-automation/Nicons/Ability_Ambush.png'));
  assert(built.source.includes('applyDeclaredDivineSmite'));
  assert(built.source.includes('applyRangerTceOptionalFeaturesPatch'));
  assert(built.source.includes('hideCurrentFthCharacterCreatorControl'));
});

test('full initializer matches the current complete runtime hooks and API keys exactly', async () => {
  const rawHost = await executeRawFull(rawSource);
  assert.deepEqual(rawHost.hookNames(), fixture.hookNames);
  assert.deepEqual(rawHost.apiKeys(LEGACY_MODULE_ID), fixture.apiKeys);
  assert.equal(rawHost.hookNames().length, 54);
  assert.equal(fixture.hookNames.length, 54);
  assert.equal(fixture.apiKeys.length, 163);
  assert.equal(new Set(fixture.hookNames).size, 48);

  const {host, runtime} = await executeFullSource(built.source);
  assert.equal(runtime.mode, 'standalone');
  assert.deepEqual(host.hookNames(), rawHost.hookNames());
  assert.deepEqual(host.apiKeys(LEGACY_MODULE_ID), rawHost.apiKeys(LEGACY_MODULE_ID));
  assert.equal(host.hookNames().length, 54);
  assert.equal(host.apiKeys().length, 163);
  for (const name of ['getSceneControlButtons', 'renderApplicationV2', 'renderActorDirectory',
    'renderActorDirectory5e', 'preCreateItem', 'createItem', 'dnd5e.preRollInitiative',
    'dnd5e.preRollAttack', 'midi-qol.RollComplete']) {
    assert(host.hookNames().includes(name), name);
  }
  for (const key of ['restActor', 'applyDreadAmbusherInitiative', 'applyRacialSavingThrowAutomation',
    'injectBg3ShortRestButton', 'applyDeclaredDivineSmite', 'applyVowOfEnmityAdvantage',
    'hideCurrentFthCharacterCreatorControl', 'applyTurnUndeadFromWorkflow']) {
    assert(host.apiKeys().includes(key), key);
  }
  assert.equal(host.api().applyDeclaredDivineSmite !== undefined, true);
  assert.equal(host.api().restActor !== undefined, true);
});

test('same-module active source replacement initializes standalone', async () => {
  const host = createFullHost({legacyActive: true, moduleId: LEGACY_MODULE_ID});
  const factory = host.evaluateFull(built.source);
  const runtime = factory({moduleId: LEGACY_MODULE_ID});
  assert.equal(runtime.mode, 'standalone');
  assert(host.hooks.size > 0);
  host.triggerReady();
  assert.equal(host.api().restActor !== undefined, true);
  assert.equal(host.api().applyDeclaredDivineSmite !== undefined, true);
});

test('a different module sees active legacy Auto and does not register hooks', () => {
  const host = createFullHost({legacyActive: true, moduleId: 'arcane-spells-2014'});
  const factory = host.evaluateFull(built.source);
  const runtime = factory({moduleId: 'arcane-spells-2014'});
  assert.equal(runtime.mode, 'legacy');
  assert.equal(runtime.api.original, true);
  assert.equal(host.hooks.size, 0);
});

test('repeated initialization is idempotent before and after ready', async () => {
  const host = createFullHost();
  const factory = host.evaluateFull(built.source);
  const first = factory({moduleId: LEGACY_MODULE_ID});
  const hookCount = host.hooks.size;
  assert.equal(factory({moduleId: LEGACY_MODULE_ID}), first);
  assert.equal(host.hooks.size, hookCount);
  host.triggerReady();
  const api = host.api();
  const afterReadyHooks = host.hooks.size;
  assert.equal(factory({moduleId: LEGACY_MODULE_ID}), first);
  assert.equal(host.hooks.size, afterReadyHooks);
  assert.equal(host.api(), api);
  assert.equal(typeof host.api().dispatchPerSpellScript, 'function');
});

test('partial full initialization failure rolls back hooks and the script registry', () => {
  const host = createFullHost({failAt: 2});
  const factory = host.evaluateFull(built.source);
  assert.throws(() => factory({moduleId: LEGACY_MODULE_ID}), /registration failure/);
  assert.equal(host.hooks.size, 0);
  assert.equal(host.context.ArcaneDnd5e2014SpellScripts, host.priorScripts);
  assert.equal(host.context[Symbol.for('arcanedesk.dnd5e-runtime.v1')], undefined);
});

test('bootstrap can abort before ready and retry without replacing the prior registry', async () => {
  const host = createFullHost();
  const factory = host.evaluateFull(built.source);
  const prior = host.context.ArcaneDnd5e2014SpellScripts;
  const runtime = factory({moduleId: LEGACY_MODULE_ID});
  assert(host.hooks.size > 0);
  runtime.abortInitialization();
  assert.equal(host.hooks.size, 0);
  assert.equal(host.context.ArcaneDnd5e2014SpellScripts, prior);
  const retry = factory({moduleId: LEGACY_MODULE_ID});
  assert.notEqual(retry, runtime);
  assert(host.hooks.size > 0);
  host.triggerReady();
  assert.throws(() => retry.abortInitialization(), /already started/);
});
