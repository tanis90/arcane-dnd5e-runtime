import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {buildDnd5eRuntime} from '../src/build.mjs';
import {
  LEGACY_MODULE_ID,
  createFullHost,
  executeFullSource,
  executeRawFull,
} from './full-host-fixture.mjs';

const MODULE_ID = 'arcane-dnd5e-2014-automation';
const STATUS_ID = 'arcane-bardic-inspiration';
const STATUS_ICON = 'modules/arcane-dnd5e-2014-automation/assets/game-icons/delapouite/drum.svg';
const DREAD_AMBUSHER_ICON = 'modules/arcane-dnd5e-2014-automation/assets/game-icons/lorc/shadow-follower.svg';
const built = await buildDnd5eRuntime();
const rawSource = await readFile(new URL('../src/automation.js', import.meta.url), 'utf8');

const statuses = host => host.CONFIG.statusEffects.filter(status => status.id === STATUS_ID);

test('setup registers the bardic status after dnd5e replaces CONFIG.statusEffects', () => {
  const host = createFullHost();
  host.context.Hooks.once('setup', () => {
    host.CONFIG.statusEffects = [
      {id: 'prone', name: 'Prone', img: 'icons/svg/falling.svg'},
      {id: 'blinded', name: 'Blinded', img: 'icons/svg/blind.svg'},
    ];
  });
  const factory = host.evaluateFull(built.source);
  const runtime = factory({moduleId: LEGACY_MODULE_ID});
  assert.equal(factory({moduleId: LEGACY_MODULE_ID}), runtime);

  host.triggerSetup();
  assert.equal(statuses(host).length, 1);
  assert.deepEqual({...statuses(host)[0]}, {
    id: STATUS_ID,
    name: 'Bardic Inspiration',
    img: STATUS_ICON,
  });
  assert(host.CONFIG.statusEffects.some(status => status.id === 'prone'));

  host.triggerSetup();
  host.triggerReady();
  assert.equal(statuses(host).length, 1);
  assert.equal([...host.hooks.values()].filter(hook => hook.name === 'setup').length, 0);
});

test('setup does not duplicate a status another module already registered', () => {
  const host = createFullHost();
  host.CONFIG.statusEffects.push({id: STATUS_ID, name: 'Existing', img: 'icons/svg/aura.svg'});
  const factory = host.evaluateFull(built.source);
  factory({moduleId: LEGACY_MODULE_ID});
  host.triggerSetup();
  assert.equal(statuses(host).length, 1);
  assert.equal(statuses(host)[0].name, 'Existing');
});

test('grantBardicInspiration stamps the visibility status on the granted effect', async () => {
  const {host} = await executeFullSource(built.source);
  const created = [];
  const item = {
    name: 'Bardic Inspiration',
    img: 'icons/skills/afflictions/aura-buff-bard-yellow.webp',
    uuid: 'Actor.bard.Item.bardic-inspiration',
    system: {
      identifier: 'bardic-inspiration',
      uses: {max: 3, spent: 0},
    },
    update: async () => {},
  };
  const sourceActor = {
    id: 'bard',
    uuid: 'Actor.bard',
    name: 'Bard',
    items: [item],
    system: {classes: {bard: {levels: 5}}},
  };
  const targetActor = {
    id: 'target',
    uuid: 'Actor.target',
    name: 'Target',
    effects: [],
    createEmbeddedDocuments: async (_collection, documents) => {
      created.push(...documents);
      return documents;
    },
    deleteEmbeddedDocuments: async () => {},
  };
  host.game.actors = new Map([['bard', sourceActor], ['target', targetActor]]);

  const result = await host.api().grantBardicInspiration('bard', 'target', {consume: false});
  assert.equal(result.die, '1d8');
  assert.equal(created.length, 1);
  assert.deepEqual([...created[0].statuses], [STATUS_ID]);
  assert.equal(created[0].flags[MODULE_ID].bardicInspiration, true);
});

test('Dread Ambusher effect uses the game-icons shadow follower image', async () => {
  const host = await executeRawFull(rawSource);
  const created = [];
  const actor = {
    uuid: 'Actor.ranger',
    name: 'Ranger',
    items: [{name: 'Dread Ambusher', type: 'feat', system: {identifier: 'dread-ambusher'}}],
    effects: [],
    createEmbeddedDocuments: async (_collection, documents) => {
      created.push(...documents);
      return documents;
    },
    deleteEmbeddedDocuments: async () => {},
  };
  const combat = {
    round: 1,
    turn: 0,
    combatant: {token: {object: {}}, actor},
  };

  await host.context.applyDreadAmbusherTurnStart(combat, {turn: 0});
  assert.equal(created.length, 1);
  assert.equal(created[0].img, DREAD_AMBUSHER_ICON);
  assert(!created[0].img.includes('Ability_Ambush'));
});
