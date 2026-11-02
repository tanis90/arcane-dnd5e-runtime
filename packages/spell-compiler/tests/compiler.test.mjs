import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assertEmittedSpellItem,
  compileSpellAutomation,
  compileSpellPlan,
  emitSpellAutomationItem,
} from '@arcanedesk/spell-compiler';
import {contentRef, defineSpell, graphFragment} from '@arcanedesk/spell-compiler/dsl';
import {describeSpellRequirements} from '@arcanedesk/automation-contracts/requirements';
import {createRuntimeAvailability} from '../../spell-runtime/src/index.mjs';
import {forgeSpark, forgeSparkSourceItem} from './fixtures/forge-spark.mjs';

const MODULE_ID = 'arcane-dnd5e-2014-automation';

test('an original clean-room mechanism compiles deterministically to a runtime plan', () => {
  const first = compileSpellPlan(forgeSpark);
  const second = compileSpellPlan(forgeSpark);
  assert.equal(first.compilerVersion, '0.9.0');
  assert.equal(first.definitionId, 'forge-spark');
  assert.equal(first.emissionMode, 'clean-room');
  assert.equal(first.runtimeProfileVersion, 1);
  assert.match(first.runtimeProfileHash, /^[0-9a-f]{64}$/);
  assert.match(first.executionPlanHash, /^[0-9a-f]{64}$/);
  assert.deepEqual(first.projection, second.projection);
  assert.equal(first.executionPlanHash, second.executionPlanHash);
  assert.deepEqual(first.contentReference.fields, ['name']);
  assert.equal(first.projection.actions.length, 1);
  assert.equal(first.projection.artifacts.length, 1);
  assert.equal(first.projection.artifacts[0].provider, 'native-active-effect');
  assert.deepEqual(first.projection.capabilities, ['dnd5e-midi-native', 'native-active-effect']);
});

test('runtime availability consumes the compiled requirements contract', async () => {
  const plan = compileSpellPlan(forgeSpark);
  const requirements = describeSpellRequirements(plan);
  assert.deepEqual(requirements.providers, ['dnd5e-midi-native', 'native-active-effect']);
  assert.deepEqual(requirements.adapters, []);
  assert.deepEqual(requirements.scripts, []);
  assert.deepEqual(requirements.resources, []);

  const game = {
    system: {id: 'dnd5e', version: '5.3.3'},
    release: {generation: 13},
    modules: new Map([['midi-qol', {active: true}], ['dae', {active: true}]]),
  };
  const runtime = {
    mode: 'standalone',
    adapters: [],
    api: {
      applyCompilerRuntimePostUse() {},
      dispatchPerSpellScript() {},
    },
  };
  const check = createRuntimeAvailability({
    game,
    runtime,
    midi: () => ({completeItemUse() {}}),
  });
  const available = await check(requirements);
  assert.equal(available.available, true, available.reason);
});

test('the emitted Item carries the compiler runtimePlan consumed by the runtime', () => {
  const sourceItem = forgeSparkSourceItem();
  const compilation = compileSpellAutomation(sourceItem, forgeSpark, {
    documentIdentity: {_id: sourceItem._id},
    packaging: {},
  });
  const item = emitSpellAutomationItem(sourceItem, compilation);
  assertEmittedSpellItem(item, compilation);
  const arcane = item.flags[MODULE_ID];
  assert.equal(arcane.compiler.version, '0.9.0');
  assert.equal(arcane.compiler.definitionHash, compilation.definitionHash);
  assert.equal(arcane.spellAutomation.source, 'compiler');
  assert.deepEqual(arcane.spellAutomation.runtimePlan, {
    rules: [],
    actionResolutions: [],
    internalActions: [],
  });
  assert.equal(item.system.identifier, 'forge-spark');
  assert.equal(item.system.description.value, '');
  assert.equal(item.system.description.chat, '');
  assert.equal(item.effects.length, 1);
  assert.equal(Object.keys(item.system.activities).length, 1);
  assert.equal(compilation.content.description, undefined);
});

test('negative inputs remain explicit compiler failures', () => {
  assert.throws(
    () => compileSpellPlan(defineSpell({
      id: 'legacy-shape',
      sourceMode: 'explicit',
      contract: {},
      content: {},
      fragments: [],
      emission: {mode: 'explicit'},
    })),
    /clean-room/,
  );
  assert.throws(
    () => contentRef('bad-content', {fields: ['not-a-content-field']}),
    /unsupported fields/,
  );
  assert.throws(
    () => compileSpellPlan({
      ...forgeSpark,
      id: 'bad-operation',
      content: contentRef('bad-operation', {fields: ['name']}),
      fragments: [graphFragment({
        id: 'bad-operation-graph',
        actions: [],
        rules: [],
      })],
    }),
    /action|primaryActionId|missing/i,
  );
});
