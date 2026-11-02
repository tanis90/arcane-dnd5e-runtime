import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {buildSpellRuntime} from '../src/build.mjs';

const built = await buildSpellRuntime();
function host({legacy = false, failAt = Infinity} = {}) {
  const hooks = new Map(); let nextId = 0;
  const add = (name, callback) => {if (++nextId === failAt) throw new Error('Original registration failure');
    hooks.set(nextId, {name, callback}); return nextId;};
  const game = {actors: [], users: [], scenes: [], modules: new Map([
    ['arcane-spells-2014', {active: true}],
    ['arcane-dnd5e-2014-automation', {active: legacy, api: legacy ? {original: true} : undefined}],
  ])};
  const warnings = [];
  const context = vm.createContext({game, canvas: {tokens: {placeables: []}},
    Hooks: {on: add, once: add, off: (_name, id) => hooks.delete(id), callAll: () => {}, call: () => true},
    console: {warn: (...args) => warnings.push(args), log: () => {}}, setTimeout, clearTimeout, queueMicrotask});
  new vm.Script(built.source.replace('export function initializeSpellRuntime', 'function initializeSpellRuntime')
    + '\nglobalThis.initialize = initializeSpellRuntime;').runInContext(context);
  return {context, game, hooks, warnings};
}

test('spell closure excludes career entry points and is deterministic', async () => {
  assert.equal((await buildSpellRuntime()).source, built.source);
  for (const name of ['applyDeclaredDivineSmite', 'applyDeclaredSneakAttack', 'applyRangerTceOptionalFeaturesPatch',
    'grantBardicInspiration', 'applyVowOfEnmityAdvantage', 'isExactRelentlessEnduranceInterceptionItem']) {
    assert(!built.report.declarations.includes(name), name);
  }
  for (const name of ['dispatchPerSpellScript', 'applyCompilerRuntimePostUse', 'finalizeNativeSummonUse',
    'applyFatalDamageInterceptionPreDamage', 'applyCompilerZoneTurnStart', 'settleBoundedDamageTransactions']) {
    assert(built.report.declarations.includes(name), name);
  }
});

test('initialization is idempotent and preserves spell hooks without class hooks', () => {
  const h = host(); const first = h.context.initialize(); const count = h.hooks.size;
  assert.equal(first.mode, 'standalone'); assert.equal(h.context.initialize(), first);
  assert.equal(h.hooks.size, count);
  const names = [...h.hooks.values()].map(hook => hook.name);
  for (const name of ['ready', 'dae.modifySpecials', 'dnd5e.preUseActivity', 'midi-qol.RollComplete', 'dnd5e.preApplyDamage']) assert(names.includes(name));
  for (const name of ['dnd5e.preRollInitiative', 'dnd5e.preRollAttack', 'createItem', 'preCreateItem']) assert(!names.includes(name));
  assert.equal(h.context.ArcaneDnd5e2014SpellScripts.schemaVersion, 1);
});

test('active internal package owns the core; public entry adds no duplicate hooks', () => {
  const h = host({legacy: true}); const runtime = h.context.initialize();
  assert.equal(runtime.mode, 'legacy'); assert.equal(runtime.api.original, true);
  assert.equal(h.hooks.size, 0);
});

test('partial initialization failure rolls back hooks and script registry', () => {
  const h = host({failAt: 4});
  assert.throws(() => h.context.initialize(), /registration failure/);
  assert.equal(h.hooks.size, 0);
  assert.equal(h.context.ArcaneDnd5e2014SpellScripts, undefined);
});

test('bootstrap can abort before ready and retry without leaving hooks or replacing prior registry', () => {
  const h = host(); const prior = {original: true};
  h.context.ArcaneDnd5e2014SpellScripts = prior;
  const runtime = h.context.initialize();
  assert(h.hooks.size > 0);
  runtime.abortInitialization();
  assert.equal(h.hooks.size, 0);
  assert.equal(h.context.ArcaneDnd5e2014SpellScripts, prior);
  const retry = h.context.initialize();
  assert.notEqual(retry, runtime);
  assert(h.hooks.size > 0);
  [...h.hooks.values()].find(hook => hook.name === 'ready').callback();
  assert.throws(() => retry.abortInitialization(), /already started/);
});

test('ready wiring exposes spell API with an empty offline host', async () => {
  const h = host(); const runtime = h.context.initialize();
  const ready = [...h.hooks.values()].find(hook => hook.name === 'ready');
  ready.callback();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(typeof runtime.api.dispatchPerSpellScript, 'function');
  assert.equal(typeof runtime.api.finalizeNativeSummonUse, 'function');
  assert.equal(runtime.api.applyDeclaredDivineSmite, undefined);
  assert.equal(runtime.api.restActor, undefined);
  assert.deepEqual(h.warnings, []);
});

test('spell-only recovery ignores ancestry receipts on existing actors', async () => {
  const h = host(); const runtime = h.context.initialize();
  [...h.hooks.values()].find(hook => hook.name === 'ready').callback();
  h.game.user = {id: 'gm1', isGM: true};
  h.game.users = [{id: 'gm1', isGM: true, active: true}];
  const actor = {uuid: 'Actor.originalActor001', name: 'Original',
    flags: {'arcane-dnd5e-2014-automation': {fatalDamageInterceptionPending: {
      originalReceipt: {candidateKind: 'relentless-endurance'}}}},
    getFlag: () => {throw new Error('Uninstalled module scope');},
    update: () => {throw new Error('Ancestry state must not be changed');}};
  await runtime.api.settleFatalDamageInterceptions(actor);
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(h.warnings, []);
});

test('standalone post-use can inspect shared actor flags without the internal module installed', async () => {
  const h = host(); const runtime = h.context.initialize();
  [...h.hooks.values()].find(hook => hook.name === 'ready').callback();
  h.game.user = {id: 'gm1', isGM: true};
  h.game.users = [{id: 'gm1', isGM: true, active: true}];
  const actor = {uuid: 'Actor.original', flags: {}, effects: [],
    getFlag() {throw new Error('Uninstalled module scope');}};
  const item = {type: 'spell', actor, system: {identifier: 'original'}, flags: {}};
  const workflow = {item, actor, targets: new Set(), aborted: true};
  await runtime.api.applyCompilerRuntimePostUse(item, {}, workflow);
});
