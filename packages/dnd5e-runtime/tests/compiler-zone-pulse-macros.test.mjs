import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {executeRawFull} from './full-host-fixture.mjs';

const MODULE_ID = 'arcane-dnd5e-2014-automation';
const source = await readFile(new URL('../src/automation.js', import.meta.url), 'utf8');

// Moonbeam-shaped compiler zone: one shared hidden pulse activity for entry and
// turn-end, and a cast activity that owns the ActiveAuras template effects.
const ZONE_CONTRACT = {
  version: 1,
  zoneArtifactId: 'moonbeam-zone',
  membershipArtifactId: 'moonbeam-membership',
  entryRuleId: 'moonbeam-entry',
  turnStartRuleId: null,
  turnEndRuleId: 'moonbeam-turn-end',
  activityIdentifier: 'moonbeamZonePulse',
  dedupe: 'zone-instance-target-turn',
  refreshMembershipOnTemplateMove: true,
  leaveCleanupArtifactIds: [],
};

const ITEM_UUID = 'Actor.caster.Item.moonbeam';
const TEMPLATE_UUID = 'Scene.s1.MeasuredTemplate.moonbeam';
const SOURCE_EFFECT_UUID = 'Actor.caster.ActiveEffect.moonbeam-source';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function zoneSourceItem() {
  const templateEffectIds = ['moonbeamEffect'];
  return {
    documentName: 'Item',
    id: 'moonbeam',
    uuid: ITEM_UUID,
    name: 'Moonbeam',
    type: 'spell',
    actor: {documentName: 'Actor', uuid: 'Actor.caster'},
    effects: [{id: 'moonbeamEffect', name: 'Moonbeam'}],
    flags: {
      [MODULE_ID]: {
        spellAutomation: {
          source: 'compiler',
          runtimePlan: {
            rules: [
              {
                id: 'moonbeam-entry',
                adapter: {
                  provider: 'arcane-runtime',
                  adapter: 'zone-event-activity-v1',
                  phase: 'entry',
                  usesActivityIdentifier: 'moonbeamZonePulse',
                },
              },
              {
                id: 'moonbeam-turn-end',
                adapter: {
                  provider: 'arcane-runtime',
                  adapter: 'zone-event-activity-v1',
                  phase: 'turn-end',
                  activityIdentifier: 'moonbeamZonePulse',
                },
              },
            ],
          },
        },
      },
      'midi-qol': {onUseMacroName: '[preActiveEffects]ItemMacro'},
      dae: {macro: {name: 'Moonbeam', type: 'script', scope: 'global'}},
    },
    system: {
      identifier: 'moonbeam',
      level: 2,
      activities: [
        {
          id: 'cast',
          name: 'Moonbeam: Place Moonbeam',
          type: 'save',
          midiProperties: {identifier: 'cast'},
          flags: {
            [MODULE_ID]: {
              templateEffectIds,
              templateEffectMode: 'exclusive',
            },
          },
        },
        {
          id: 'pulse',
          name: 'moonbeam: zone pulse',
          type: 'save',
          midiProperties: {identifier: 'moonbeamZonePulse'},
          // The emitter deletes the template contract from pulse activities:
          // they never own the template binder.
          flags: {[MODULE_ID]: {semanticActionId: 'runtime:moonbeamZonePulse'}},
        },
      ],
    },
  };
}

function zoneAuraCopy(targetActor) {
  return {
    id: 'copy',
    uuid: `Actor.${targetActor.id}.ActiveEffect.moonbeam`,
    name: 'Moonbeam',
    origin: ITEM_UUID,
    parent: targetActor,
    flags: {
      ActiveAuras: {applied: true},
      [MODULE_ID]: {
        zoneEventActivity: clone(ZONE_CONTRACT),
        zoneMembershipProvenance: {
          version: 1,
          templateUuid: TEMPLATE_UUID,
          sourceItemUuid: ITEM_UUID,
          sourceActorUuid: 'Actor.caster',
          sourceEffectUuid: SOURCE_EFFECT_UUID,
          targetUuid: targetActor.uuid,
          zoneArtifactId: 'moonbeam-zone',
          membershipArtifactId: 'moonbeam-membership',
        },
        zoneTemplateUuid: TEMPLATE_UUID,
      },
    },
  };
}

function targetToken(hitPoints) {
  const flags = {};
  const actor = {
    documentName: 'Actor',
    id: 'target',
    uuid: 'Actor.target',
    name: 'Target',
    effects: [],
    getFlag: (scope, key) => (
      key === undefined ? flags[scope] : flags[scope]?.[key]
    ),
    setFlag: async (scope, key, value) => {
      flags[scope] ??= {};
      flags[scope][key] = clone(value);
    },
    system: {
      attributes: {hp: {value: hitPoints, max: 40}},
      traits: {ci: {value: new Set(), custom: ''}},
      details: {type: {value: 'humanoid'}},
    },
  };
  return {
    id: 'target',
    name: 'Target',
    actor,
    document: {id: 'target', uuid: 'Scene.s1.Token.target', name: 'Target'},
  };
}

/**
 * Midi executes an Item's OnUse macros on every activity of that Item. The
 * compiler's ActiveAuras binder is installed at Item level, so it also runs for
 * the hidden zone pulse unless the workflow opts out; without template
 * provenance in that pulse it throws exactly like the live R5 failure.
 */
function runCompilerTemplateBinder(activity, {templateId}) {
  const template = templateId ? {uuid: templateId} : null;
  if (!template?.uuid) {
    throw new Error('ActiveAuras template provenance is unavailable');
  }
  const macroFlags = activity?.flags?.[MODULE_ID] ?? {};
  if (!['exclusive', 'mixed'].includes(macroFlags.templateEffectMode)) {
    throw new Error('ActiveAuras template effect mode is unavailable');
  }
  return {haltEffectsApplication: true};
}

function installMidi(host, item, {macrosEnabled = true} = {}) {
  const state = {calls: [], macroRuns: [], resolved: []};
  host.context.MidiQOL = {
    async completeActivityUse(activity, usage = {}) {
      state.calls.push({activity, usage});
      const workflowOptions = usage.midiOptions?.workflowOptions ?? {};
      if (macrosEnabled && workflowOptions.noOnUseMacro !== true) {
        runCompilerTemplateBinder(activity, {
          templateId: usage.midiOptions?.templateId ?? null,
        });
        state.macroRuns.push(activity.midiProperties?.identifier ?? 'unknown');
      }
      state.resolved.push(activity);
      for (const target of usage.midiOptions?.targetsToUse ?? []) {
        if (target?.actor) target.actor.system.attributes.hp.value -= 5;
      }
      return {
        aborted: false,
        activity,
        item,
        targets: new Set(usage.midiOptions?.targetsToUse ?? []),
        failedSaves: new Set(usage.midiOptions?.targetsToUse ?? []),
      };
    },
  };
  return state;
}

async function installZoneHarness() {
  const host = await executeRawFull(source);
  const item = zoneSourceItem();
  const target = targetToken(20);
  const templateDocument = persistentTemplateDocument();
  const plainTemplateDocument = plainAuraTemplateDocument();
  const sourceEffect = {
    documentName: 'ActiveEffect',
    uuid: SOURCE_EFFECT_UUID,
    parent: {uuid: 'Actor.caster'},
    disabled: false,
  };
  host.context.foundry.utils = {deepClone: clone, randomID: () => 'r5'};
  host.context.fromUuid = async uuid => {
    if (uuid === ITEM_UUID) return item;
    if (uuid === TEMPLATE_UUID) return templateDocument;
    if (uuid === SOURCE_EFFECT_UUID) return sourceEffect;
    return null;
  };
  host.context.fromUuidSync = uuid => {
    if (uuid === TEMPLATE_UUID) return templateDocument;
    if (uuid === SOURCE_EFFECT_UUID) return sourceEffect;
    return null;
  };
  host.context.canvas.templates = {placeables: [], get: () => null};
  const state = installMidi(host, item);
  const copy = zoneAuraCopy(target.actor);
  return {
    host,
    item,
    target,
    copy,
    templateDocument,
    plainTemplateDocument,
    state,
  };
}

function persistentTemplateDocument() {
  const document = {
    documentName: 'MeasuredTemplate',
    id: 'moonbeam',
    uuid: TEMPLATE_UUID,
    object: {document: null},
    flags: {
      dnd5e: {dependentOn: SOURCE_EFFECT_UUID},
      ActiveAuras: {
        IsAura: [{
          data: {
            origin: ITEM_UUID,
            flags: {
              [MODULE_ID]: {
                persistentTemplate: true,
                compilerArtifactIds: ['moonbeam-membership', 'moonbeam-zone'],
                zoneEventActivity: clone(ZONE_CONTRACT),
              },
            },
          },
        }],
      },
    },
  };
  document.object.document = document;
  return document;
}

// A template with an ActiveAuras aura that is not owned by the compiler: no
// persistentTemplate flag and no compiler artifact ids.
function plainAuraTemplateDocument() {
  const document = {
    documentName: 'MeasuredTemplate',
    id: 'plain',
    uuid: 'Scene.s1.MeasuredTemplate.plain',
    flags: {
      dnd5e: {dependentOn: 'Actor.host.ActiveEffect.plain-source'},
      ActiveAuras: {
        IsAura: [{data: {origin: 'Actor.host.Item.plain-aura'}}],
      },
    },
  };
  return document;
}

test('a compiler zone pulse suppresses only its own OnUse macro run and still resolves natively', async () => {
  const {host, target, copy, state} = await installZoneHarness();
  const api = host.api();
  assert.equal(typeof api.triggerCompilerZoneEventActivity, 'function');

  const result = await api.triggerCompilerZoneEventActivity(copy, target, {
    phase: 'entry',
    noncombatEventKey: 'move-1',
  });
  assert.equal(result, true);

  assert.equal(state.calls.length, 1);
  const [{activity, usage}] = state.calls;
  assert.equal(activity.midiProperties.identifier, 'moonbeamZonePulse');
  assert.equal(usage.midiOptions.workflowOptions?.noOnUseMacro, true);
  assert.equal(usage.midiOptions.spellLevel, 2);
  assert.deepEqual(Array.from(usage.midiOptions.targetUuids), ['Scene.s1.Token.target']);
  assert.equal(usage.concentration.begin, false);

  // The pulse runs with macros opted out, so the Item binder never executes and
  // the native save/damage still lands.
  assert.deepEqual(state.macroRuns, []);
  assert.deepEqual(
    state.resolved.map(entry => entry.midiProperties.identifier),
    ['moonbeamZonePulse'],
  );
  assert.equal(target.actor.system.attributes.hp.value, 15);
  assert.deepEqual(
    Object.keys(target.actor.getFlag(MODULE_ID, 'compilerZoneEventTriggers') ?? {}),
    ['Scene_s1_MeasuredTemplate_moonbeam_moonbeam_entry_Scene_s1_Token_target'],
  );
});

test('a following turn-end pulse also opts out and keeps its own dedupe receipt', async () => {
  const {host, target, copy, state} = await installZoneHarness();
  const api = host.api();

  await api.triggerCompilerZoneEventActivity(copy, target, {
    phase: 'entry',
    noncombatEventKey: 'move-1',
  });
  await api.triggerCompilerZoneEventActivity(copy, target, {
    phase: 'turn-end',
    noncombatEventKey: 'turn-1',
  });

  assert.equal(state.calls.length, 2);
  for (const {usage} of state.calls) {
    assert.equal(usage.midiOptions.workflowOptions?.noOnUseMacro, true);
  }
  assert.deepEqual(state.macroRuns, []);
  assert.equal(target.actor.system.attributes.hp.value, 10);
});

function firePreDelete(host, templateDocument, options) {
  let blocked = false;
  for (const hook of [...host.hooks.values()]) {
    if (hook.name !== 'preDeleteMeasuredTemplate') continue;
    if (hook.callback(templateDocument, options) === false) blocked = true;
  }
  return blocked;
}

/**
 * Mirrors Midi's checkDeleteTemplate (midi-qol.js:11176) plus the dnd5e
 * deletion it performs: the dependent source effect (which owns concentration)
 * is deleted once its last dependent template is gone, unless the public
 * `noConcentrationCheck` option is set.
 */
function simulateMidiTemplateDelete({templateDocument, options, sourceEffect}) {
  const state = {concentrationEnded: false, sourceEffectDeleted: false};
  if (options.noConcentrationCheck) return state;
  const dependentOn = templateDocument.flags?.dnd5e?.dependentOn;
  if (!dependentOn) return state;
  if (dependentOn === sourceEffect.uuid) {
    state.sourceEffectDeleted = true;
    state.concentrationEnded = true;
  }
  return state;
}

test('deleting a compiler persistent zone template keeps concentration through the public Midi option', async () => {
  const {host, templateDocument} = await installZoneHarness();
  const sourceEffect = {uuid: SOURCE_EFFECT_UUID, documentName: 'ActiveEffect'};
  const options = {};

  // The host runs preDelete before the document is gone. The runtime owns this
  // hook, and Midi reads the same options object afterwards.
  const blocked = firePreDelete(host, templateDocument, options);
  assert.equal(blocked, false);
  assert.equal(options.noConcentrationCheck, true);

  const result = simulateMidiTemplateDelete({templateDocument, options, sourceEffect});
  assert.equal(result.sourceEffectDeleted, false);
  assert.equal(result.concentrationEnded, false);

  // Without the flag Midi would delete the source effect and concentration, so
  // the assertion above is the behaviour the hook prevents.
  const withoutHook = simulateMidiTemplateDelete({
    templateDocument,
    options: {},
    sourceEffect,
  });
  assert.equal(withoutHook.sourceEffectDeleted, true);
  assert.equal(withoutHook.concentrationEnded, true);
});

test('deleting a non-compiler aura template keeps the native Midi concentration cleanup', async () => {
  const {host, plainTemplateDocument} = await installZoneHarness();
  const options = {};
  const blocked = firePreDelete(host, plainTemplateDocument, options);
  assert.equal(blocked, false);
  assert.equal(options.noConcentrationCheck, undefined);
  assert.equal('noConcentrationCheck' in options, false);

  const result = simulateMidiTemplateDelete({
    templateDocument: plainTemplateDocument,
    options,
    sourceEffect: {uuid: 'Actor.host.ActiveEffect.plain-source'},
  });
  assert.equal(result.sourceEffectDeleted, true);
  assert.equal(result.concentrationEnded, true);
});

test('the compiler template delete hook leaves ordinary cleanup and TimesUp expiry untouched', async () => {
  const {host, templateDocument} = await installZoneHarness();
  const options = {noConcentrationCheck: true, undo: false};
  firePreDelete(host, templateDocument, options);

  // The hook only annotates the delete options; it must not consume the
  // template or end the source effect itself. The existing
  // deleteMeasuredTemplate membership cleanup still runs and owns that part.
  assert.equal(templateDocument.flags.dnd5e.dependentOn, SOURCE_EFFECT_UUID);
  assert.equal(templateDocument.flags.ActiveAuras.IsAura.length, 1);
  assert.deepEqual(
    [...host.hooks.values()]
      .filter(hook => hook.name === 'deleteMeasuredTemplate')
      .length,
    1,
  );
  const hookNames = host.hookNames();
  assert.equal(hookNames.filter(name => name === 'preDeleteMeasuredTemplate').length, 1);
});

test('the ordinary cast keeps its Item-level ActiveAuras binder and the runtime only scopes the pulse', async () => {
  const {host, item, target, copy, state} = await installZoneHarness();
  const api = host.api();

  await api.triggerCompilerZoneEventActivity(copy, target, {
    phase: 'entry',
    noncombatEventKey: 'move-1',
  });
  // The pulse must not rewrite the Item or its cast activity, which is what
  // keeps the template placement macro (and any other normal spell use) intact.
  assert.equal(item.flags['midi-qol'].onUseMacroName, '[preActiveEffects]ItemMacro');
  const cast = item.system.activities.find(entry => entry.midiProperties.identifier === 'cast');
  assert.deepEqual(cast.flags[MODULE_ID].templateEffectIds, ['moonbeamEffect']);
  assert.equal(cast.flags[MODULE_ID].templateEffectMode, 'exclusive');

  // A plain cast reaches Midi without any runtime workflowOptions, exactly as a
  // sheet use does; the binder still runs and the template is not touched.
  const castUsage = {
    midiOptions: {
      spellLevel: 2,
      templateId: TEMPLATE_UUID,
      targetUuids: ['Scene.s1.Token.target'],
      targetsToUse: new Set([target]),
    },
  };
  const workflow = await host.context.MidiQOL.completeActivityUse(cast, castUsage);
  assert.equal(workflow.aborted, false);
  assert.deepEqual(state.macroRuns, ['cast']);
  assert.equal(castUsage.midiOptions.workflowOptions, undefined);
  assert.equal(target.actor.system.attributes.hp.value, 10);
});
