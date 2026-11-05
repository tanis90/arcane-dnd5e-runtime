import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDnd5eRuntime} from '../src/build.mjs';
import {createFullHost, LEGACY_MODULE_ID} from './full-host-fixture.mjs';

const MODULE_ID = 'arcane-dnd5e-2014-automation';
const built = await buildDnd5eRuntime();

function createHarness() {
  const host = createFullHost();
  const factory = host.evaluateFull(built.source);
  const runtime = factory({moduleId: LEGACY_MODULE_ID});
  host.triggerReady();
  return {host, runtime, api: host.api(), context: host.context};
}

function sourceActor() {
  return {
    id: 'source',
    uuid: 'Actor.source',
    name: 'Source',
    type: 'character',
    system: {},
  };
}

function targetToken(id, hitPoints) {
  const actor = {
    id,
    uuid: `Actor.${id}`,
    name: id,
    type: 'character',
    statuses: new Set(),
    effects: [],
    createEmbeddedDocuments: async () => [{id: `${id}-effect`}],
    deleteEmbeddedDocuments: async () => {},
    system: {
      attributes: {hp: {value: hitPoints, max: hitPoints}},
      traits: {ci: {value: new Set(), custom: ''}},
      details: {type: {value: 'humanoid'}},
    },
  };
  return {
    id,
    name: id,
    actor,
    document: {id, uuid: `Scene.s1.Token.${id}`, name: id, actorId: id},
  };
}

function hpPoolItem(actor, artifactId = 'sleep-artifact') {
  const semanticActionId = 'action-sleep';
  const effect = {
    flags: {[MODULE_ID]: {compilerArtifactIds: [artifactId]}},
    toObject: () => ({
      name: 'Sleep',
      statuses: ['unconscious', 'incapacitated'],
      changes: [],
      flags: {[MODULE_ID]: {compilerArtifactIds: [artifactId]}},
    }),
  };
  const decoy = {
    flags: {[MODULE_ID]: {compilerArtifactIds: ['decoy-artifact']}},
    toObject: () => ({
      name: 'Decoy',
      statuses: ['charmed'],
      changes: [],
      flags: {[MODULE_ID]: {compilerArtifactIds: ['decoy-artifact']}},
    }),
  };
  const item = {
    id: 'sleep',
    uuid: 'Actor.source.Item.sleep',
    name: 'Sleep',
    type: 'spell',
    actor,
    effects: [decoy, effect],
    system: {identifier: 'sleep', level: 1},
    flags: {
      [MODULE_ID]: {
        spellAutomation: {
          runtimePlan: {
            rules: [{
              id: 'sleep-pool',
              adapter: 'hit-point-pool-allocator-v1',
              trigger: 'action-used',
              sourceActionId: semanticActionId,
              targets: [{
                semanticId: 'pool-targets',
                origin: {type: 'placed-template'},
                evaluation: 'snapshot',
                targetKind: 'creature',
              }],
              operations: [{
                type: 'allocate-hit-point-pool',
                target: 'pool-targets',
                artifactId,
                formulaExpression: {
                  primitive: 'value-expression',
                  type: 'dice',
                  count: 5,
                  faces: 8,
                },
                eligibility: {
                  currentHitPoints: 'positive',
                  requiredSusceptibility: 'magical-sleep',
                },
              }],
            }],
            artifacts: [{semanticId: artifactId}],
          },
        },
      },
    },
  };
  const activity = {
    uuid: 'Actor.source.Item.sleep.Activity.use',
    flags: {[MODULE_ID]: {semanticActionId}},
  };
  return {item, activity, semanticActionId};
}

function installHpPoolHarness() {
  const harness = createHarness();
  const actor = sourceActor();
  const target = targetToken('target-1', 5);
  const template = {
    uuid: 'Scene.s1.MeasuredTemplate.sleep',
    flags: {
      dnd5e: {
        origin: 'Actor.source.Item.sleep',
        dependentOn: 'Actor.source.ActiveEffect.sleep-source',
      },
    },
  };
  const {item, activity} = hpPoolItem(actor);
  const state = {
    rolls: [],
    messages: [],
    effects: 0,
    effectData: [],
    templateReleases: 0,
  };
  class FakeRoll {
    constructor(formula) {
      this.formula = formula;
      this.total = 8;
      state.rolls.push(formula);
    }
    async evaluate() {
      return this;
    }
  }
  target.actor.createEmbeddedDocuments = async (_type, documents) => {
    state.effects += 1;
    state.effectData.push(documents[0]);
    return [{id: 'target-1-effect'}];
  };
  const sourceEffect = {
    documentName: 'ActiveEffect',
    uuid: 'Actor.source.ActiveEffect.sleep-source',
    origin: item.uuid,
    parent: {uuid: actor.uuid},
    async delete() {
      state.templateReleases += 1;
    },
  };
  harness.context.Roll = FakeRoll;
  harness.context.ChatMessage = {
    create: async () => {
      state.messages.push(true);
      return {id: 'message'};
    },
    getSpeaker: () => ({}),
  };
  harness.context.fromUuid = async (uuid) => (
    uuid === sourceEffect.uuid ? sourceEffect : null
  );
  harness.context.MidiQOL = {
    computeTargetsFromTemplates: () => [target],
  };
  harness.context.canvas.tokens.placeables = [target];
  const workflow = {
    actor,
    activity,
    targets: new Set([target]),
    template,
  };
  return {harness, actor, item, activity, workflow, target, state};
}

function hostSettlement({
  pool = {},
  affectedTokens = [],
  skippedTokens = [],
} = {}) {
  return {
    pool: {
      formula: '5d8',
      total: 20,
      remaining: 20,
      castLevel: 1,
      affected: [],
      skipped: [],
      ...pool,
    },
    affectedTokens,
    skippedTokens,
  };
}

function hostAffected(token) {
  const tokenId = String(token?.document?.id ?? token?.id ?? '');
  return {
    tokenId,
    name: token?.name ?? tokenId,
    hp: Number(token?.actor?.system?.attributes?.hp?.value ?? 0),
    cost: Number(token?.actor?.system?.attributes?.hp?.value ?? 0),
  };
}

test('host HP pool success applies the compiler artifact once without a second roll or pool message', async () => {
  const {harness, item, workflow, target, state} = installHpPoolHarness();
  workflow.__mtHpPoolProcessed = true;
  workflow.__mtHpPool = hostSettlement({
    pool: { affected: [hostAffected(target)] },
    affectedTokens: [target],
  });

  assert.equal(await harness.api.applyHitPointPoolAllocatorFromUse(item, {}, workflow), true);
  assert.equal(await harness.api.applyHitPointPoolAllocatorFromUse(item, {}, workflow), true);

  assert.deepEqual(state.rolls, []);
  assert.deepEqual(state.messages, []);
  assert.equal(state.effects, 1);
  assert.equal(state.templateReleases, 1);
  const created = state.effectData[0];
  assert.equal(created.name, 'Sleep');
  assert.deepEqual(created.statuses, ['unconscious', 'incapacitated']);
  assert.equal(created.flags[MODULE_ID].sourceUuid, 'Actor.source');
  assert.equal(created.flags[MODULE_ID].targetUuid, 'Actor.target-1');
  assert.equal(created.flags[MODULE_ID].targetTokenUuid, 'Scene.s1.Token.target-1');
});

test('host HP pool success with a missing compiler artifact fails closed', async () => {
  const {harness, item, workflow, target, state} = installHpPoolHarness();
  item.effects = item.effects.filter(effect =>
    !effect.flags[MODULE_ID].compilerArtifactIds.includes('sleep-artifact')
  );
  workflow.__mtHpPoolProcessed = true;
  workflow.__mtHpPool = hostSettlement({
    pool: { affected: [hostAffected(target)] },
    affectedTokens: [target],
  });

  await assert.rejects(
    () => harness.api.applyHitPointPoolAllocatorFromUse(item, {}, workflow),
    /could not materialize artifact sleep-artifact/,
  );

  assert.deepEqual(state.rolls, []);
  assert.deepEqual(state.messages, []);
  assert.equal(state.effects, 0);
  assert.equal(state.templateReleases, 0);
});

test('host HP pool success with no affected targets only releases the template', async () => {
  const {harness, item, workflow, state} = installHpPoolHarness();
  workflow.__mtHpPoolProcessed = true;
  workflow.__mtHpPool = hostSettlement({
    pool: {
      remaining: 20,
      skipped: [{tokenId: 'target-1', name: 'target-1', hp: 20, reason: 'pool'}],
    },
    skippedTokens: [workflow.targets.values().next().value],
  });

  assert.equal(await harness.api.applyHitPointPoolAllocatorFromUse(item, {}, workflow), true);

  assert.deepEqual(state.rolls, []);
  assert.deepEqual(state.messages, []);
  assert.equal(state.effects, 0);
  assert.equal(state.templateReleases, 1);
});

test('a malformed host receipt is rejected without a second roll, artifact or message', async () => {
  const {harness, item, workflow, state} = installHpPoolHarness();
  workflow.__mtHpPoolProcessed = true;
  workflow.__mtHpPool = {pool: {}};

  await assert.rejects(
    () => harness.api.applyHitPointPoolAllocatorFromUse(item, {}, workflow),
    /host settlement receipt is malformed/,
  );

  assert.deepEqual(state.rolls, []);
  assert.equal(state.effects, 0);
  assert.deepEqual(state.messages, []);
  assert.equal(state.templateReleases, 0);
});

test('a processed workflow without any receipt is rejected instead of re-rolled', async () => {
  const {harness, item, workflow, state} = installHpPoolHarness();
  workflow.__mtHpPoolProcessed = true;

  await assert.rejects(
    () => harness.api.applyHitPointPoolAllocatorFromUse(item, {}, workflow),
    /host settlement receipt is malformed/,
  );

  assert.deepEqual(state.rolls, []);
  assert.equal(state.effects, 0);
  assert.deepEqual(state.messages, []);
  assert.equal(state.templateReleases, 0);
});

test('a valid first-party failure receipt suppresses the runtime allocator', async () => {
  const {harness, item, workflow, state} = installHpPoolHarness();
  workflow.__mtHpPoolProcessed = true;
  workflow.__mtHpPool = hostSettlement({
    pool: {
      formula: '',
      total: null,
      remaining: null,
      error: 'HP pool formula could not be read',
    },
  });

  assert.equal(await harness.api.applyHitPointPoolAllocatorFromUse(item, {}, workflow), true);

  assert.deepEqual(state.rolls, []);
  assert.equal(state.effects, 0);
  assert.deepEqual(state.messages, []);
  assert.equal(state.templateReleases, 0);
});

test('a valid first-party empty-target receipt suppresses the runtime allocator', async () => {
  const {harness, item, workflow, state} = installHpPoolHarness();
  workflow.__mtHpPoolProcessed = true;
  workflow.__mtHpPool = {
    pool: {
      formula: '5d8',
      total: null,
      remaining: null,
      castLevel: 1,
      affected: [],
      skipped: [],
      empty: true,
    },
    affectedTokens: [],
    skippedTokens: [],
  };

  assert.equal(await harness.api.applyHitPointPoolAllocatorFromUse(item, {}, workflow), true);

  assert.deepEqual(state.rolls, []);
  assert.equal(state.effects, 0);
  assert.deepEqual(state.messages, []);
  assert.equal(state.templateReleases, 0);
});

test('host affected and affectedTokens length mismatch fails closed', async () => {
  const {harness, item, workflow, target, state} = installHpPoolHarness();
  workflow.__mtHpPoolProcessed = true;
  workflow.__mtHpPool = hostSettlement({
    pool: { affected: [hostAffected(target)] },
    affectedTokens: [],
  });

  await assert.rejects(
    () => harness.api.applyHitPointPoolAllocatorFromUse(item, {}, workflow),
    /affected and affectedTokens lengths differ/,
  );

  assert.deepEqual(state.rolls, []);
  assert.equal(state.effects, 0);
  assert.deepEqual(state.messages, []);
  assert.equal(state.templateReleases, 0);
});

test('host affectedTokens order/id mismatch fails closed', async () => {
  const {harness, item, workflow, target, state} = installHpPoolHarness();
  const other = targetToken('target-2', 5);
  workflow.__mtHpPoolProcessed = true;
  workflow.__mtHpPool = hostSettlement({
    pool: { affected: [hostAffected(target)] },
    affectedTokens: [other],
  });

  await assert.rejects(
    () => harness.api.applyHitPointPoolAllocatorFromUse(item, {}, workflow),
    /does not match pool\.affected/,
  );

  assert.deepEqual(state.rolls, []);
  assert.equal(state.effects, 0);
  assert.deepEqual(state.messages, []);
  assert.equal(state.templateReleases, 0);
});

test('host affectedTokens outside workflow.targets fails closed', async () => {
  const {harness, item, workflow, target, state} = installHpPoolHarness();
  const impostor = targetToken('target-1', 5);
  impostor.document.uuid = 'Scene.s1.Token.impostor';
  workflow.__mtHpPoolProcessed = true;
  workflow.__mtHpPool = hostSettlement({
    pool: { affected: [hostAffected(target)] },
    affectedTokens: [impostor],
  });

  await assert.rejects(
    () => harness.api.applyHitPointPoolAllocatorFromUse(item, {}, workflow),
    /object is not the workflow target/,
  );

  assert.deepEqual(state.rolls, []);
  assert.equal(state.effects, 0);
  assert.deepEqual(state.messages, []);
  assert.equal(state.templateReleases, 0);
});

test('host success without a source actor fails closed', async () => {
  const {harness, actor, item, workflow, target, state} = installHpPoolHarness();
  workflow.actor = null;
  item.actor = null;
  workflow.__mtHpPoolProcessed = true;
  workflow.__mtHpPool = hostSettlement({
    pool: { affected: [hostAffected(target)] },
    affectedTokens: [target],
  });

  await assert.rejects(
    () => harness.api.applyHitPointPoolAllocatorFromUse(item, {}, workflow),
    /could not resolve source actor/,
  );

  assert.equal(actor.uuid, 'Actor.source');
  assert.deepEqual(state.rolls, []);
  assert.equal(state.effects, 0);
  assert.deepEqual(state.messages, []);
  assert.equal(state.templateReleases, 0);
});

test('host affected token without an actor fails closed', async () => {
  const {harness, item, workflow, target, state} = installHpPoolHarness();
  target.actor = null;
  workflow.__mtHpPoolProcessed = true;
  workflow.__mtHpPool = hostSettlement({
    pool: { affected: [{tokenId: 'target-1', name: 'target-1', hp: 5, cost: 5}] },
    affectedTokens: [target],
  });

  await assert.rejects(
    () => harness.api.applyHitPointPoolAllocatorFromUse(item, {}, workflow),
    /has no actor/,
  );

  assert.deepEqual(state.rolls, []);
  assert.equal(state.effects, 0);
  assert.deepEqual(state.messages, []);
  assert.equal(state.templateReleases, 0);
});

test('an unmarked workflow still rolls once and stays idempotent on the same workflow', async () => {
  const {harness, item, workflow, state} = installHpPoolHarness();

  assert.equal(await harness.api.applyHitPointPoolAllocatorFromUse(item, {}, workflow), true);
  assert.equal(await harness.api.applyHitPointPoolAllocatorFromUse(item, {}, workflow), true);

  assert.deepEqual(state.rolls, ['5d8']);
  assert.equal(state.effects, 1);
  assert.equal(state.messages.length, 1);
  assert.equal(state.templateReleases, 1);
});

test('a host marker on an item without a matching compiler rule is not treated as host-owned', async () => {
  const {harness, item, workflow, state} = installHpPoolHarness();
  item.flags[MODULE_ID].spellAutomation.runtimePlan.rules = [];
  workflow.__mtHpPoolProcessed = true;
  workflow.__mtHpPool = hostSettlement();

  assert.equal(await harness.api.applyHitPointPoolAllocatorFromUse(item, {}, workflow), false);
  assert.deepEqual(state.rolls, []);
  assert.equal(state.effects, 0);
  assert.deepEqual(state.messages, []);
});

function projectileHarness() {
  const harness = createHarness();
  const actor = sourceActor();
  const target = targetToken('target-1', 20);
  const semanticActionId = 'action-magic-missile';
  const activity = {
    uuid: 'Actor.source.Item.magic-missile.Activity.use',
    type: 'damage',
    hasAttack: false,
    damage: {parts: [{types: ['force']}]},
    flags: {
      [MODULE_ID]: {
        semanticActionId,
        interaction: {
          version: 2,
          resolution: {
            type: 'independent-projectiles',
            allocation: 'optional-explicit',
            defaultTarget: 'concentrate',
            count: {primitive: 'value-expression', type: 'constant', value: 2},
          },
        },
      },
    },
  };
  const item = {
    id: 'magic-missile',
    uuid: 'Actor.source.Item.magic-missile',
    name: 'Magic Missile',
    type: 'spell',
    actor,
    effects: [],
    system: {identifier: 'magic-missile', level: 1},
    flags: {[MODULE_ID]: {spellAutomation: {runtimePlan: {rules: [], artifacts: []}}}},
  };
  const calls = [];
  harness.context.MidiQOL = {
    completeActivityUse: async (usedActivity, usage) => {
      calls.push({activity: usedActivity, usage});
      return {
        aborted: false,
        __arcaneRollComplete: true,
        activity: usedActivity,
        item,
        targets: new Set([target]),
        damageRolls: [],
        itemCardUuid: null,
      };
    },
  };
  harness.context.canvas.tokens.placeables = [target];
  const workflow = {
    actor,
    activity,
    item,
    targets: new Set([target]),
    __arcaneRollComplete: true,
    workflowOptions: {},
  };
  return {harness, actor, target, item, activity, workflow, calls};
}

test('first-party projectile owner marker on the real workflowOptions path skips runtime orchestration', async () => {
  const {harness, item, workflow, calls} = projectileHarness();
  workflow.workflowOptions.__mtProjectileOwner = true;

  assert.equal(await harness.api.applyIndependentProjectilesFromUse(item, {}, workflow), false);
  assert.equal(calls.length, 0);
});

test('first-party child marker also skips runtime orchestration', async () => {
  const {harness, item, workflow, calls} = projectileHarness();
  workflow.workflowOptions.__mtProjectileOwner = true;
  workflow.workflowOptions.__mtProjectileChild = true;

  assert.equal(await harness.api.applyIndependentProjectilesFromUse(item, {}, workflow), false);
  assert.equal(calls.length, 0);
});

test('an unmarked runtime parent still runs its own child chain and receipt', async () => {
  const {harness, item, workflow, calls} = projectileHarness();

  assert.equal(await harness.api.applyIndependentProjectilesFromUse(item, {}, workflow), true);

  assert.equal(calls.length, 1);
  assert.equal(calls[0].usage.midiOptions.workflowOptions.arcaneIndependentProjectileChild, true);
  assert.equal(calls[0].usage.midiOptions.workflowOptions.__mtProjectileOwner, undefined);
  assert.equal(workflow.__arcaneIndependentProjectiles.expected, 2);
  assert.equal(workflow.__arcaneIndependentProjectiles.completed, 2);
});

test('the runtime direct path keeps its own child protection', async () => {
  const {harness, item, workflow, calls} = projectileHarness();
  workflow.workflowOptions.arcaneIndependentProjectileChild = true;

  assert.equal(await harness.api.applyIndependentProjectilesFromUse(item, {}, workflow), false);
  assert.equal(calls.length, 0);
});
