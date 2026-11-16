import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {executeRawFull} from './full-host-fixture.mjs';

const MODULE_ID = 'arcane-dnd5e-2014-automation';
const source = await readFile(new URL('../src/automation.js', import.meta.url), 'utf8');

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function controlContract(overrides = {}) {
  return {
    version: 1,
    contractId: 'control-contract',
    controllerActorUuid: 'Actor.caster',
    sourceItemUuid: 'Actor.caster.Item.spell',
    artifactId: 'create-undead',
    requestId: 'request-1',
    memberIndex: 0,
    tokenUuid: 'Scene.scene.Token.ghoul',
    lastInvocationId: 'request-1',
    ...overrides,
  };
}

function controlEffect(overrides = {}, effectOverrides = {}) {
  return {
    id: 'control-effect',
    disabled: false,
    flags: {
      [MODULE_ID]: {
        nativeSummonControl: controlContract(overrides),
      },
    },
    ...effectOverrides,
  };
}

async function hostForSource() {
  return executeRawFull(source);
}

test('control effect contracts accept current and legacy v1 flags without a world-time gate', async () => {
  const host = await hostForSource();
  const current = controlContract();
  assert.equal(
    host.context.nativeSummonControlEffectContract({
      flags: {[MODULE_ID]: {nativeSummonControl: current}},
    })?.contractId,
    current.contractId,
  );

  const legacy = {...current, expiresWorldTime: 1};
  assert.equal(
    host.context.nativeSummonControlEffectContract({
      flags: {[MODULE_ID]: {nativeSummonControl: legacy}},
    })?.lastInvocationId,
    current.lastInvocationId,
  );
  assert.equal(
    host.context.nativeSummonControlEffectContract({
      flags: {[MODULE_ID]: {nativeSummonControl: {...current, unexpected: true}}},
    }),
    null,
  );

  host.game.time.worldTime = 1_000_000;
  const effect = controlEffect({expiresWorldTime: 1});
  assert.equal(
    host.context.activeNativeSummonControlEffect(
      {effects: [effect]},
      {
        contractId: current.contractId,
        controllerActorUuid: current.controllerActorUuid,
        sourceItemUuid: current.sourceItemUuid,
        artifactId: current.artifactId,
        tokenUuid: current.tokenUuid,
      },
    ),
    effect,
  );
});

test('new control effects have no active duration or expiry provenance', async () => {
  const host = await hostForSource();
  const created = [];
  const token = {
    name: 'Ghoul',
    uuid: 'Scene.scene.Token.ghoul',
    flags: {
      [MODULE_ID]: {
        nativeSummon: {
          requestId: 'request-1',
          lifecyclePolicy: 'retain-entity',
          controlContractId: 'control-contract',
        },
      },
    },
    update: async updates => {
      const value = updates[`flags.${MODULE_ID}.nativeSummon`];
      if (value) token.flags[MODULE_ID].nativeSummon = value;
    },
    actor: {
      uuid: 'Scene.scene.Token.ghoul.Actor.actor',
      img: 'icons/svg/skull.svg',
      isToken: true,
      effects: [],
      createEmbeddedDocuments: async (_type, [data]) => {
        created.push(data);
        const effect = {
          ...data,
          uuid: 'Scene.scene.Token.ghoul.Actor.actor.ActiveEffect.control',
          parent: token.actor,
        };
        token.actor.effects.push(effect);
        return [effect];
      },
      update: async () => {},
    },
  };
  host.context.foundry.utils = {
    randomID: () => 'control',
    deepClone: clone,
  };
  const record = {
    requestId: 'request-1',
    sourceActorUuid: 'Actor.caster',
    sourceItemUuid: 'Actor.caster.Item.spell',
    contract: {
      marker: {
        control: {contractId: 'control-contract'},
        artifactId: 'create-undead',
      },
    },
  };
  const effectUuids = clone(
    await host.context.nativeSummonCreateControlEffects(record, [token]),
  );
  assert.deepEqual(effectUuids, ['Scene.scene.Token.ghoul.Actor.actor.ActiveEffect.control']);
  assert.deepEqual(clone(created[0].duration), {});
  const flags = created[0].flags[MODULE_ID].nativeSummonControl;
  assert.equal(flags.expiresWorldTime, undefined);
  assert.equal(flags.contractId, 'control-contract');
  assert.equal(flags.tokenUuid, token.uuid);
  const provenance = token.flags[MODULE_ID].nativeSummon;
  assert.equal(provenance.controlExpiresWorldTime, undefined);
  assert.equal(
    provenance.controlEffectUuid,
    'Scene.scene.Token.ghoul.Actor.actor.ActiveEffect.control',
  );
});

test('long rest releases retained control effects and revokes synthetic ownership', async () => {
  const host = await hostForSource();
  const deleted = [];
  const effect = controlEffect({expiresWorldTime: 1});
  const tokenActor = {
    uuid: 'Scene.scene.Token.ghoul.Actor.actor',
    isToken: true,
    ownership: {default: 0, player1: 3},
    effects: [effect],
    deleteEmbeddedDocuments: async (type, ids) => {
      deleted.push([type, ids]);
      tokenActor.effects = tokenActor.effects.filter(candidate => !ids.includes(candidate.id));
    },
    update: async updates => {
      Object.assign(tokenActor, updates);
    },
  };
  const token = {
    id: 'ghoul',
    uuid: 'Scene.scene.Token.ghoul',
    flags: {
      [MODULE_ID]: {
        nativeSummon: {
          requestId: 'request-1',
          lifecyclePolicy: 'retain-entity',
          controlContractId: 'control-contract',
          sourceActorUuid: 'Actor.caster',
          sourceTokenUuid: 'Scene.scene.Token.caster',
          sourceItemUuid: 'Actor.caster.Item.spell',
          artifactId: 'create-undead',
          tokenUuid: 'Scene.scene.Token.ghoul',
        },
      },
    },
    actor: tokenActor,
  };
  const scene = {
    tokens: [token],
    deleteEmbeddedDocuments: async () => {
      throw new Error('long rest must not delete retained Tokens');
    },
  };
  host.game.scenes = [scene];
  const restingActor = {
    uuid: 'Actor.caster',
    id: 'caster',
    token: {uuid: 'Scene.scene.Token.caster'},
    effects: [],
  };
  await host.context.cleanupNativeSummonLifecycleOnLongRest(restingActor, {type: 'long'});
  assert.deepEqual(clone(deleted), [['ActiveEffect', ['control-effect']]]);
  assert.deepEqual(clone(tokenActor.ownership), {default: 0, player1: 0});

  await host.context.cleanupNativeSummonLifecycleOnLongRest(restingActor, {type: 'long'});
  assert.deepEqual(clone(deleted), [['ActiveEffect', ['control-effect']]]);
  assert.deepEqual(clone(tokenActor.ownership), {default: 0, player1: 0});
});

test('any non-long rest leaves the control effect and ownership intact', async () => {
  const host = await hostForSource();
  const effect = controlEffect();
  const tokenActor = {
    uuid: 'Scene.scene.Token.ghoul.Actor.actor',
    isToken: true,
    ownership: {default: 0, player1: 3},
    effects: [effect],
    deleteEmbeddedDocuments: async () => {
      throw new Error('short rest must not release control');
    },
    update: async () => {
      throw new Error('short rest must not reset ownership');
    },
  };
  host.game.scenes = [{
    tokens: [{
      uuid: 'Scene.scene.Token.ghoul',
      flags: {
        [MODULE_ID]: {
          nativeSummon: {
            requestId: 'request-1',
            lifecyclePolicy: 'retain-entity',
            controlContractId: 'control-contract',
            sourceActorUuid: 'Actor.caster',
            sourceTokenUuid: 'Scene.scene.Token.caster',
            sourceItemUuid: 'Actor.caster.Item.spell',
            artifactId: 'create-undead',
            tokenUuid: 'Scene.scene.Token.ghoul',
          },
        },
      },
      actor: tokenActor,
    }],
  }];
  await host.context.cleanupNativeSummonLifecycleOnLongRest(
    {uuid: 'Actor.caster', effects: []},
    {type: 'short'},
  );
  assert.equal(tokenActor.effects.length, 1);
});

test('retained summons without a control effect are ordinary NPCs again', async () => {
  const host = await hostForSource();
  const actor = {
    name: 'Ghoul',
    uuid: 'Scene.scene.Token.ghoul.Actor.actor',
    effects: [],
    flags: {
      [MODULE_ID]: {
        nativeSummon: {
          lifecyclePolicy: 'retain-entity',
          controlContractId: 'control-contract',
          sourceActorUuid: 'Actor.caster',
          sourceItemUuid: 'Actor.caster.Item.spell',
          artifactId: 'create-undead',
          tokenUuid: 'Scene.scene.Token.ghoul',
        },
      },
    },
  };
  assert.equal(
    host.context.blockedActionForActor(actor, {type: 'npc'}, {type: 'attack'}),
    null,
  );
});

test('deleting a parent Token cascades its nested summon children per scene', async () => {
  const host = await hostForSource();
  const calls = [];
  const child = (id, parentTokenUuid) => ({
    id,
    uuid: `Scene.scene.Token.${id}`,
    flags: {[MODULE_ID]: {nativeSummon: {parentTokenUuid}}},
  });
  host.game.scenes = [
    {
      id: 'scene',
      tokens: [
        child('child-1', 'Scene.scene.Token.parent'),
        child('child-2', 'Scene.scene.Token.parent'),
        child('unrelated', 'Scene.scene.Token.other'),
      ],
      deleteEmbeddedDocuments: async (type, ids) => {
        calls.push(['scene', type, ids]);
      },
    },
    {
      id: 'other-scene',
      tokens: [child('child-3', 'Scene.scene.Token.parent')],
      deleteEmbeddedDocuments: async (type, ids) => {
        calls.push(['other-scene', type, ids]);
      },
    },
  ];
  await host.context.cleanupNativeSummonChildrenForDeletedToken({
    uuid: 'Scene.scene.Token.parent',
  });
  assert.deepEqual(clone(calls), [
    ['scene', 'Token', ['child-1', 'child-2']],
    ['other-scene', 'Token', ['child-3']],
  ]);
});
