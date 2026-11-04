export function initializeDnd5eRuntime({moduleId = 'arcane-dnd5e-2014-automation'} = {}) {
    const HOST_MODULE_ID = moduleId;
    const legacy = globalThis.game?.modules?.get('arcane-dnd5e-2014-automation');
    const host = globalThis.game?.modules?.get(moduleId);
    const sameModuleReplacement = moduleId === 'arcane-dnd5e-2014-automation' && host === legacy;
    if (legacy?.active && !sameModuleReplacement) return {mode: 'legacy', get api() {return legacy.api;}};
    const key = Symbol.for('arcanedesk.dnd5e-runtime.v1');
    if (globalThis[key]) return globalThis[key];
    const registered = [], nativeHooks = globalThis.Hooks;
    let readyStarted = false;
    const priorScripts = globalThis.ArcaneDnd5e2014SpellScripts;
    const Hooks = {
      on(name, callback) {const id = nativeHooks.on(name, callback); registered.push([name, id ?? callback]); return id;},
      once(name, callback) {const wrapped = name === 'ready' ? (...args) => {readyStarted = true; return callback(...args);} : callback;
        const id = nativeHooks.once(name, wrapped); registered.push([name, id ?? wrapped]); return id;},
      off(name, id) {
        if (typeof nativeHooks.off === 'function') nativeHooks.off(name, id);
        const index = registered.findIndex(([registeredName, registeredId]) => registeredName === name && registeredId === id);
        if (index >= 0) registered.splice(index, 1);
      },
      callAll: (...args) => nativeHooks.callAll(...args),
      call: (...args) => nativeHooks.call(...args),
    };
    try {
      const MODULE_ID = "arcane-dnd5e-2014-automation";
const NATIVE_SUMMON_MARKER_KEYS = Object.freeze([
  "provider",
  "humanStep",
  "artifactId",
  "choice",
  "profileId",
  "revision",
  "documentId",
  "expectedCount",
  "cleanup",
  "uniqueness",
]);
const NATIVE_SUMMON_INVOCATIONS = new Map();
let NATIVE_SUMMON_COMBAT_CLEANUP_QUEUE = Promise.resolve();
const NATIVE_SUMMON_CONTROL_VERSION = 1;
const NATIVE_SUMMON_CONTROL_RECEIPTS_FLAG = "nativeSummonControlReceipts";
const NATIVE_SUMMON_CONTROL_ACTOR_QUEUES = new Map();
const NATIVE_SUMMON_LIFECYCLE_VERSION = 1;
const NATIVE_SUMMON_LIFECYCLE_DELETIONS = new Set();
const NATIVE_SUMMON_LIFECYCLE_TASKS = new Map();
const PER_SPELL_DAMAGE_TRANSACTION_VERSION = 2;
const PER_SPELL_DAMAGE_PENDING_FLAG = "perSpellDamageTransactionsPending";
const PER_SPELL_DAMAGE_COMPLETED_FLAG = "perSpellDamageTransactionsCompleted";
const PER_SPELL_DAMAGE_ACTOR_QUEUES = new Map();
const PER_SPELL_DAMAGE_WORKFLOWS = new Map();
const VOW_OF_ENMITY_IDENTIFIER = "channel-divinity-vow-of-enmity";
const VOW_OF_ENMITY_FLAG = "vowOfEnmity";
const VOW_OF_ENMITY_SOURCE = "arcane-vow-of-enmity";
const DIVINE_SMITE_IDENTIFIER = "divine-smite";
const SNEAK_ATTACK_IDENTIFIER = "sneak-attack";
const SNEAK_ATTACK_DAMAGE_FORMULA = "@scale.rogue.sneak-attack";
const AURA_OF_PROTECTION_IDENTIFIER = "aura-of-protection";
const DUELING_IDENTIFIER = "fighting-style-dueling";
const GREAT_WEAPON_FIGHTING_IDENTIFIER = "fighting-style-great-weapon-fighting";
const VIGILANT_BLESSING_IDENTIFIER = "vigilant-blessing";
const BARDIC_INSPIRATION_IDENTIFIER = "bardic-inspiration";
const FONT_OF_INSPIRATION_IDENTIFIER = "font-of-inspiration";
const SONG_OF_REST_IDENTIFIER = "song-of-rest";
const COUNTERCHARM_IDENTIFIER = "countercharm";
const BARDIC_INSPIRATION_FLAG = "bardicInspiration";
const COUNTERCHARM_FLAG = "countercharm";
const BG3_SHORT_RESTS_USED_FLAG = "bg3ShortRestsUsed";
const TWILIGHT_SANCTUARY_IDENTIFIER = "channel-divinity-twilight-sanctuary";
const TWILIGHT_SANCTUARY_RADIUS_FEET = 30;
const TWILIGHT_SANCTUARY_RING_FILE = "jb2a.extras.tmfx.border.circle.simple.01";
const TWILIGHT_SANCTUARY_RING_TINT = "#6f9dff";
const TWILIGHT_SANCTUARY_RING_NAME_PREFIX = "arcane-twilight-sanctuary-ring:";
const TURN_UNDEAD_IDENTIFIER = "channel-divinity-turn-undead";
const DESTROY_UNDEAD_IDENTIFIER = "destroy-undead";
const DREAD_AMBUSHER_IDENTIFIER = "dread-ambusher";
const DREAD_AMBUSHER_RIDER_FLAG = "dreadAmbusherRider";
const AASIMAR_REVELATION_DAMAGE_IDENTIFIER = "aasimar-revelation-damage";
const AASIMAR_REVELATION_FLAG = "aasimarRevelation";
const AASIMAR_NECROTIC_SHROUD_IDENTIFIER = "aasimar-necrotic-shroud";
const AASIMAR_RADIANT_CONSUMPTION_IDENTIFIER = "aasimar-radiant-consumption";
const AASIMAR_RADIANT_SOUL_IDENTIFIER = "aasimar-radiant-soul";
const FEY_ANCESTRY_IDENTIFIER = "fey-ancestry";
const DWARVEN_RESILIENCE_IDENTIFIER = "dwarven-resilience";
const HALFLING_BRAVE_IDENTIFIER = "halfling-brave";
const GNOME_CUNNING_IDENTIFIER = "gnome-cunning";
const DROW_SUNLIGHT_SENSITIVITY_IDENTIFIER = "drow-sunlight-sensitivity";
const SAVAGE_ATTACKS_IDENTIFIER = "savage-attacks";
const BLOOD_SEEKING_IDENTIFIER = "blood-seeking";
const SAVAGE_ATTACKER_IDENTIFIER = "phb-savage-attacker";
const GREAT_WEAPON_MASTER_IDENTIFIER = "phb-great-weapon-master";
const SHARPSHOOTER_IDENTIFIER = "phb-sharpshooter";
const VAMPIRE_REGENERATION_FLAG = "vampireRegenerationSuppressed";
const VAMPIRE_REGENERATION_HEAL = 10;
const DAMAGE_SUMMARY_FLAG = "damageSummary";
const DAMAGE_SUMMARY_TYPE = "damage-summary";
const PENDING_DAMAGE_SEGMENTS = new Map();
const DAMAGE_SUMMARY_TIMERS = new Map();
const DECLARED_WEAPON_SPELL_RIDER_STATES = new WeakMap();
const DECLARED_ACTIVE_BUFF_STATES = new WeakMap();
const DECLARED_ACTIVE_BUFF_RESERVATIONS = new Map();
const PARENT_DAMAGE_RIDER_STATES = new WeakMap();
const SOURCE_ATTACK_PROXIMITY_RIDER_STATES = new WeakMap();
const SOURCE_ARMED_ATTACK_TRANSFORM_STATES = new WeakMap();
const SOURCE_ARMED_ATTACK_TRANSFORM_RESERVATIONS = new Map();
const DAMAGE_TRIGGERED_REPEAT_SAVE_STATES = new WeakMap();
const PER_SPELL_SCRIPT_REGISTRY = new Map();
const PER_SPELL_SCRIPT_TRANSACTIONS = new Map();
const PER_SPELL_SCRIPT_TRANSACTION_LIMIT = 4096;
const PER_SPELL_SCRIPT_RECEIPT_STATUSES = new Set([
  "resolved",
  "skipped",
  "partial",
  "indeterminate",
]);
const PER_SPELL_SCRIPT_GLOBAL = "ArcaneDnd5e2014SpellScripts";
const COMPILER_ZONE_EVENT_TRIGGER_QUEUES = new Map();
const COMPILER_ZONE_EVENT_ENTRY_TASKS = new Map();
const COMPILER_ZONE_EVENT_ACTOR_QUEUES = new Map();
const COMPILER_FOLLOWING_AURA_EVENT_TRIGGER_QUEUES = new Map();
const COMPILER_FOLLOWING_AURA_EVENT_ACTOR_QUEUES = new Map();
const REVERSIBLE_HP_CAPACITY_ACTOR_QUEUES = new Map();
const REVERSIBLE_HP_CAPACITY_EFFECTIVE = new Map();
const REVERSIBLE_HP_CAPACITY_DELETE_SNAPSHOTS = new Map();
const STATUS_EFFECT_SUPPRESSION_QUEUES = new Map();
const OWNED_WEAPON_ATTACK_ACTOR_QUEUES = new Map();
const COMPILER_ZONE_TEMPLATE_REFRESH_TASKS = new Map();
const COMPILER_WEAPON_RESISTANCE_STATES = new WeakMap();
const COMPILER_PHYSICAL_SIZE_SYNC_TASKS = new Map();
const COMPILER_PHYSICAL_SIZE_BASELINES = new Map();
const COMPILER_NEXT_TURN_ATTACK_RESERVATIONS = new Map();
const COMPILER_NEXT_TURN_ATTACK_STATES = new WeakMap();
const FATAL_DAMAGE_INTERCEPTION_FLAG = "fatalDamageInterception";
const FATAL_DAMAGE_INTERCEPTION_PENDING_FLAG = "fatalDamageInterceptionPending";
const FATAL_DAMAGE_INTERCEPTION_VERSION = 1;
const FATAL_DAMAGE_INTERCEPTION_RESERVATION_TTL_MS = 60000;
const FATAL_DAMAGE_INTERCEPTION_TRANSACTION_IDS = new WeakMap();
const FATAL_DAMAGE_INTERCEPTION_TRANSACTION_RESERVATIONS = new Map();
const FATAL_DAMAGE_INTERCEPTION_SOURCE_RESERVATIONS = new Map();
const FATAL_DAMAGE_INTERCEPTION_RESERVATION_TIMERS = new Map();
const FATAL_DAMAGE_INTERCEPTION_ACTOR_QUEUES = new Map();
const FATAL_DAMAGE_INTERCEPTION_FAILURE_NOTICES = new Set();
const ACTOR_STUDIO_MODULE_ID = "foundryvtt-actor-studio";
const ARCANE_SPELL_PACK_ID = MODULE_ID + ".spells";
const ARCANE_RACE_PACK_ID = MODULE_ID + ".races";
const ARCANE_RACIAL_TRAIT_PACK_ID = MODULE_ID + ".racialtraits";
const ARCANE_BACKGROUND_PACK_ID = MODULE_ID + ".backgrounds";
const ARCANE_FEAT_PACK_ID = MODULE_ID + ".feats";
const ARCANE_CLASS_PACK_ID = MODULE_ID + ".classes";
const ARCANE_SUBCLASS_PACK_ID = MODULE_ID + ".subclasses";
const ARCANE_CLASS_FEATURE_PACK_ID = MODULE_ID + ".classfeatures";
const LEVEL3_SPELL_CONTENT_VERSION = 4;
const LEVEL3_SPELL_CONTENT_IDENTIFIERS = new Set([
  "aura-of-vitality",
  "beacon-of-hope",
  "bestow-curse",
  "enemies-abound",
  "gaseous-form",
  "incite-greed",
  "life-transference",
  "mass-healing-word",
  "motivational-speech",
  "protection-from-energy",
  "slow",
  "spirit-guardians",
  "spirit-shroud-tce",
]);

Hooks.on("dae.modifySpecials", (actorType, specials) => {
  if (!["character", "npc"].includes(String(actorType))) return;
  specials["system.attributes.movement.jump"] = [
    new foundry.data.fields.NumberField(),
    CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
  ];
});
const LEVEL1_2_SPELL_CONTENT_VERSION = 1;
const LEVEL1_2_SPELL_CONTENT_IDENTIFIERS = new Set([
  "armor-of-agathys",
  "bane",
  "bless",
  "blindnessdeafness",
  "branding-smite",
  "command",
  "cure-wounds",
  "darkness",
  "dissonant-whispers",
  "divine-favor",
  "faerie-fire",
  "guiding-bolt",
  "healing-word",
  "heroism",
  "hideous-laughter",
  "hold-person",
  "hunters-mark",
  "inflict-wounds",
  "lesser-restoration",
  "magic-weapon",
  "mirror-image",
  "misty-step",
  "moonbeam",
  "pass-without-trace",
  "prayer-of-healing",
  "protection-from-evil-and-good",
  "protection-from-poison",
  "sanctuary",
  "searing-smite",
  "shield-of-faith",
  "silence",
  "sleep",
  "thunderous-smite",
  "warding-bond",
  "wrathful-smite",
  "zephyr-strike",
]);
const VERSIONED_SPELL_CONTENT_IDENTIFIERS = new Set([
  ...LEVEL3_SPELL_CONTENT_IDENTIFIERS,
  ...LEVEL1_2_SPELL_CONTENT_IDENTIFIERS,
]);
const DND5E_2024_BROWSER_PACK_IDS = [
  "dnd5e.actors24",
  "dnd5e.classes24",
  "dnd5e.content24",
  "dnd5e.equipment24",
  "dnd5e.feats24",
  "dnd5e.monsterfeatures24",
  "dnd5e.origins24",
  "dnd5e.spells24",
  "dnd5e.tables24",
];

function cloneSettings(value) {
  if (globalThis.foundry?.utils?.deepClone) return foundry.utils.deepClone(value);
  return JSON.parse(JSON.stringify(value ?? {}));
}

function mergeActorStudioSources(basePackId, currentSources) {
  const extras = Array.isArray(currentSources)
    ? currentSources.filter(packId => packId && packId !== basePackId)
    : [];
  return [basePackId, ...new Set(extras)];
}

async function configureActorStudioSpellSource() {
  if (!game.user?.isGM) return false;
  if (!game.modules.get(ACTOR_STUDIO_MODULE_ID)?.active) return false;
  if (!game.packs.get(ARCANE_SPELL_PACK_ID)) {
    console.warn(`[${MODULE_ID}] Actor Studio spell source was not changed because pack ${ARCANE_SPELL_PACK_ID} is missing.`);
    return false;
  }
  if (!game.packs.get(ARCANE_FEAT_PACK_ID)) {
    console.warn(`[${MODULE_ID}] Actor Studio feat source was not changed because pack ${ARCANE_FEAT_PACK_ID} is missing.`);
    return false;
  }

  const currentSources = game.settings.get(ACTOR_STUDIO_MODULE_ID, "compendiumSources") ?? {};
  const nextSources = cloneSettings(currentSources);
  const currentSpells = Array.isArray(nextSources.spells) ? nextSources.spells : [];
  const currentBackgrounds = Array.isArray(nextSources.backgrounds) ? nextSources.backgrounds : [];
  const currentFeats = Array.isArray(nextSources.feats) ? nextSources.feats : [];
  const alreadyArcaneOnly = currentSpells.length === 1 && currentSpells[0] === ARCANE_SPELL_PACK_ID;

  if (!alreadyArcaneOnly) {
    nextSources.spells = [ARCANE_SPELL_PACK_ID];
  }
  nextSources.races = [ARCANE_RACE_PACK_ID];
  nextSources.racialFeatures = [ARCANE_RACIAL_TRAIT_PACK_ID];
  nextSources.classes = [ARCANE_CLASS_PACK_ID];
  nextSources.subclasses = [ARCANE_SUBCLASS_PACK_ID];
  nextSources.classFeatures = [ARCANE_CLASS_FEATURE_PACK_ID];
  nextSources.features = [ARCANE_CLASS_FEATURE_PACK_ID];
  // Background and feat sources are intentionally extensible. A GM may add a
  // campaign supplement pack (for example Dragonlance) through Actor Studio's
  // world-scoped source settings. Keep those packs while ensuring the Arcane
  // baseline remains first; do not silently reset a world's selected add-ons.
  nextSources.backgrounds = mergeActorStudioSources(ARCANE_BACKGROUND_PACK_ID, currentBackgrounds);
  nextSources.feats = mergeActorStudioSources(ARCANE_FEAT_PACK_ID, currentFeats);
  await game.settings.set(ACTOR_STUDIO_MODULE_ID, "compendiumSources", nextSources);

  if (game.settings.get(ACTOR_STUDIO_MODULE_ID, "enableSpellSelection") !== true) {
    await game.settings.set(ACTOR_STUDIO_MODULE_ID, "enableSpellSelection", true);
  }
  if (game.settings.get(ACTOR_STUDIO_MODULE_ID, "enableCustomSpellListFiltering") !== true) {
    await game.settings.set(ACTOR_STUDIO_MODULE_ID, "enableCustomSpellListFiltering", true);
  }
  if (game.settings.get(ACTOR_STUDIO_MODULE_ID, "enableCustomFeatSelector") !== true) {
    await game.settings.set(ACTOR_STUDIO_MODULE_ID, "enableCustomFeatSelector", true);
  }

  if (game.settings.settings.has("dnd5e.packSourceConfiguration")) {
    const currentPackSources = game.settings.get("dnd5e", "packSourceConfiguration") ?? {};
    const nextPackSources = cloneSettings(currentPackSources);
    let changedPackSources = false;
    for (const packId of DND5E_2024_BROWSER_PACK_IDS) {
      if (nextPackSources[packId] === false) continue;
      nextPackSources[packId] = false;
      changedPackSources = true;
    }
    if (changedPackSources) {
      await game.settings.set("dnd5e", "packSourceConfiguration", nextPackSources);
    }
  }

  if (!alreadyArcaneOnly) {
    console.info(`[${MODULE_ID}] Actor Studio spell source set to ${ARCANE_SPELL_PACK_ID}.`);
  }
  return true;
}

async function configureMidiQolFullAutomationSettings() {
  if (!game.user?.isGM) return false;
  if (!game.modules.get("midi-qol")?.active) return false;

  const current = game.settings.get("midi-qol", "ConfigSettings") ?? {};
  const next = cloneSettings(current);
  const expected = {
    autoApplyDamage: "yesCard",
    autoCheckHit: "all",
    autoCheckSaves: "all",
    autoCompleteWorkflow: true,
    autoItemEffects: "applyRemove",
    autoRemoveInstantaneousTemplate: true,
    autoRollDamage: "onHit",
    criticalDamage: "default",
    criticalDamageGM: "default",
    gmAutoAttack: true,
    gmAutoDamage: "onHit",
    gmRemoveButtons: "all",
    removeButtons: "all",
    skillAbilityCheckAdvantage: true,
  };
  let changed = false;

  for (const [key, value] of Object.entries(expected)) {
    if (next[key] === value) continue;
    next[key] = value;
    changed = true;
  }

  if (changed) {
    await game.settings.set("midi-qol", "ConfigSettings", next);
    console.info(`[${MODULE_ID}] midi-qol full automation settings updated.`, expected);
  }
  return changed;
}

function classMapForActorStudio(classes) {
  const identifiers = Array.isArray(classes) && classes.length ? classes : ["arcane-hidden"];
  return Object.fromEntries(identifiers.map(identifier => [
    identifier,
    {
      type: "class",
      name: identifier,
      system: { identifier },
    },
  ]));
}

function actorStudioClassesFromSpellDocument(doc) {
  const flagged = doc.flags?.[MODULE_ID]?.spellClasses ?? doc._source?.flags?.[MODULE_ID]?.spellClasses;
  if (Array.isArray(flagged)) return flagged;

  const rawClasses = doc._source?.system?.classes?.value ?? doc.system?.classes?.value;
  if (typeof rawClasses === "string" && rawClasses.trim()) {
    const classes = rawClasses.split(",").map(value => value.trim()).filter(Boolean);
    return classes.filter(identifier => identifier !== "arcane-hidden");
  }

  return [];
}

function annotateActorStudioSpellDocument(doc) {
  if (!doc || doc.type !== "spell") return doc;
  const classes = actorStudioClassesFromSpellDocument(doc);
  const labelsClasses = classes.length ? classes : ["arcane-hidden"];
  doc.labels ??= {};
  Object.defineProperty(doc.labels, "classes", {
    value: labelsClasses,
    configurable: true,
    enumerable: true,
    writable: true,
  });
  doc._lazy ??= {};
  doc._lazy.classes = classMapForActorStudio(classes);
  return doc;
}

function patchActorStudioArcaneSpellPack() {
  if (!game.modules.get(ACTOR_STUDIO_MODULE_ID)?.active) return false;
  const pack = game.packs.get(ARCANE_SPELL_PACK_ID);
  if (!pack || pack[MODULE_ID]?.actorStudioClassPatch) return false;

  const originalGetDocuments = pack.getDocuments.bind(pack);
  pack.getDocuments = async function arcaneGetDocumentsWithSpellClasses(...args) {
    const docs = await originalGetDocuments(...args);
    return docs.map(annotateActorStudioSpellDocument);
  };
  pack[MODULE_ID] = {
    ...(pack[MODULE_ID] ?? {}),
    actorStudioClassPatch: true,
  };
  console.info(`[${MODULE_ID}] Actor Studio Arcane spell class filtering patch installed.`);
  return true;
}

function hideFthCharacterCreatorControl(controls) {
  const tokenTools = controls?.tokens?.tools;
  if (!tokenTools) return false;
  if (tokenTools instanceof Map) return tokenTools.delete("fth-character-creator");
  if (Object.hasOwn(tokenTools, "fth-character-creator")) {
    delete tokenTools["fth-character-creator"];
    return true;
  }
  return false;
}

function currentSceneControls() {
  const controls = ui.controls?.controls;
  if (controls instanceof Map) return Object.fromEntries(controls.entries());
  if (Array.isArray(controls)) return Object.fromEntries(controls.map(control => [control.name, control]));
  return controls ?? {};
}

function hideCurrentFthCharacterCreatorControl() {
  const removed = hideFthCharacterCreatorControl(currentSceneControls());
  if (!removed) return false;
  if (typeof ui.controls.render === "function") ui.controls.render({ force: true });
  return true;
}

function hideNativeActorCreateButton() {
  if (!game.modules.get(ACTOR_STUDIO_MODULE_ID)?.active) return false;
  const actorStudioButton = document.querySelector("#gas-sidebar-button");
  const header = actorStudioButton?.closest(".directory-header");
  const nativeCreateButton = header?.querySelector('button.create-entry[data-action="createEntry"]');
  if (!nativeCreateButton || nativeCreateButton.hidden) return false;
  nativeCreateButton.hidden = true;
  nativeCreateButton.dataset.arcaneHiddenNativeActorCreate = "true";
  return true;
}

function sourceActorUuidFromOrigin(origin) {
  if (!origin || typeof origin !== "string") return null;

  try {
    const sourceDocument = typeof fromUuidSync === "function" ? fromUuidSync(origin) : null;
    if (sourceDocument?.actor?.uuid) return sourceDocument.actor.uuid;
    if (sourceDocument?.parent?.documentName === "Actor") return sourceDocument.parent.uuid;
    if (sourceDocument?.parent?.actor?.uuid) return sourceDocument.parent.actor.uuid;
  } catch (error) {
    console.warn(`[${MODULE_ID}] Could not resolve Vow of Enmity origin`, origin, error);
  }

  const actorMatch = origin.match(/(?:^|\.)Actor\.([^.]+)/);
  if (actorMatch) return `Actor.${actorMatch[1]}`;

  const tokenActorMatch = origin.match(/^Scene\.[^.]+\.Token\.([^.]+)\.Actor/);
  if (tokenActorMatch) return origin.split(".Actor")[0] + ".Actor";

  return null;
}

function compilerSourceItemUuidFromEffect(effect) {
  const activityUuid = effect?.flags?.dae?.activity;
  const candidates = [
    arcaneEffectFlag(effect, "sourceItemUuid"),
    effect?.flags?.["midi-qol"]?.castData?.itemUuid,
    effect?.flags?.dnd5e?.item?.uuid,
    typeof activityUuid === "string" ? activityUuid.split(".Activity.")[0] : null,
    effect?.origin,
  ].filter(value => typeof value === "string" && value.length > 0);
  for (const candidate of candidates) {
    const itemUuid = candidate.split(".ActiveEffect.")[0];
    if (/(?:^|.)Item.[^.]+$/.test(itemUuid)) return itemUuid;
  }
  return null;
}

function hasVowOfEnmityMarker(targetToken, attacker) {
  if (!targetToken?.actor || !attacker) return false;

  for (const effect of targetToken.actor.effects ?? []) {
    if (!effect?.getFlag?.(MODULE_ID, VOW_OF_ENMITY_FLAG)) continue;

    const sourceActorUuid = effect.getFlag(MODULE_ID, "sourceActorUuid") ?? sourceActorUuidFromOrigin(effect.origin);
    if (sourceActorUuid === attacker.uuid) return true;
  }

  return false;
}

function isVowOfEnmityWorkflow(workflow) {
  return workflow?.item?.system?.identifier === VOW_OF_ENMITY_IDENTIFIER;
}

function applyVowOfEnmityAdvantage(workflow) {
  const attacker = workflow?.actor;
  const targets = Array.from(workflow?.targets ?? []);
  if (!attacker || targets.length !== 1) return true;

  if (!hasVowOfEnmityMarker(targets[0], attacker)) return true;

  workflow.attackRollModifierTracker?.advantage?.add?.(VOW_OF_ENMITY_SOURCE, "Vow of Enmity");
  return true;
}

function getVowMarkerEffectData(item, actor) {
  const marker = Array.from(item?.effects ?? []).find(effect => effect.getFlag?.(MODULE_ID, VOW_OF_ENMITY_FLAG));
  if (!marker) return null;

  const data = marker.toObject();
  delete data._id;
  data.origin = item.uuid;
  data.transfer = false;
  data.disabled = false;
  data.flags ??= {};
  data.flags[MODULE_ID] = {
    ...(data.flags[MODULE_ID] ?? {}),
    vowOfEnmity: true,
    sourceActorUuid: actor.uuid,
  };
  return data;
}

async function clearPriorVowMarkersForSource(sourceActorUuid) {
  const seenActors = new Set();
  for (const token of canvas.tokens?.placeables ?? []) {
    const actor = token.actor;
    if (!actor || seenActors.has(actor.uuid)) continue;
    seenActors.add(actor.uuid);

    const markers = Array.from(actor.effects ?? []).filter(effect => {
      if (!effect.getFlag?.(MODULE_ID, VOW_OF_ENMITY_FLAG)) return false;
      const source = effect.getFlag(MODULE_ID, "sourceActorUuid") ?? sourceActorUuidFromOrigin(effect.origin);
      return source === sourceActorUuid;
    });
    if (markers.length) await actor.deleteEmbeddedDocuments("ActiveEffect", markers.map(effect => effect.id));
  }
}

async function consumeChannelDivinity(actor) {
  const channelDivinity = actor?.items?.find(item => item.system?.identifier === "channel-divinity");
  const max = Number(channelDivinity?.system?.uses?.max ?? 0);
  const spent = Number(channelDivinity?.system?.uses?.spent ?? 0);
  if (!channelDivinity || !Number.isFinite(max) || max <= 0 || spent >= max) return false;

  await channelDivinity.update({ "system.uses.spent": spent + 1 });
  return true;
}

async function applyVowOfEnmityMarker(workflow) {
  if (!isVowOfEnmityWorkflow(workflow)) return true;

  const targets = Array.from(workflow.targets ?? []);
  if (targets.length !== 1 || !targets[0]?.actor) {
    console.warn(`[${MODULE_ID}] Vow of Enmity requires exactly one target.`, targets);
    return true;
  }

  const effectData = getVowMarkerEffectData(workflow.item, workflow.actor);
  if (!effectData) {
    console.warn(`[${MODULE_ID}] Vow of Enmity item has no marker effect.`, workflow.item);
    return true;
  }

  await clearPriorVowMarkersForSource(workflow.actor.uuid);
  const [effect] = await targets[0].actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
  await consumeChannelDivinity(workflow.actor);
  console.info(`[${MODULE_ID}] Applied Vow of Enmity marker`, {
    source: workflow.actor.name,
    target: targets[0].name,
    effect: effect?.name,
  });
  return true;
}

function targetsFromUseConfig(workflow, usageConfig) {
  const workflowTargets = Array.from(workflow?.targets ?? []);
  if (workflowTargets.length) return workflowTargets;

  const configuredTargets = usageConfig?.midiOptions?.targetsToUse;
  if (configuredTargets instanceof Set) return Array.from(configuredTargets);
  if (Array.isArray(configuredTargets)) return configuredTargets;

  const targetUuids = usageConfig?.midiOptions?.targetUuids ?? usageConfig?.midiOptions?.workflowOptions?.targetUuids ?? [];
  const tokens = targetUuids
    .map(uuid => (typeof fromUuidSync === "function" ? fromUuidSync(uuid) : null))
    .map(document => document?.object ?? document)
    .filter(token => token?.actor);
  if (tokens.length) return tokens;

  return Array.from(game.user?.targets ?? []);
}

async function applyVowOfEnmityMarkerFromUse(item, usageConfig, workflow) {
  if (item?.system?.identifier !== VOW_OF_ENMITY_IDENTIFIER) return true;

  const actor = workflow?.actor ?? item.actor;
  const targets = targetsFromUseConfig(workflow, usageConfig);
  return applyVowOfEnmityMarker({ actor, item, targets });
}

function actorRaceOrType(actor) {
  const details = actor?.system?.details ?? {};
  const type = details.type ?? {};
  return [
    type.value,
    type.subtype,
    type.custom,
    details.race,
    details.species,
  ]
    .filter(value => typeof value === "string")
    .join(" ")
    .toLowerCase();
}

function isUndeadActor(actor) {
  return /(^|\W)(undead|\u4e0d\u6b7b)(\W|$)/i.test(actorRaceOrType(actor));
}

function classLevels(actor, identifier) {
  const systemLevels = Number(actor?.system?.classes?.[identifier]?.levels ?? 0);
  if (systemLevels) return systemLevels;
  const classItem = actor?.items?.find(item => item.type === "class" && item.system?.identifier === identifier);
  return Number(classItem?.system?.levels ?? 0);
}

function effectDataFromItem(item, predicate, actor) {
  const effect = Array.from(item?.effects ?? []).find(predicate);
  if (!effect) return null;
  const data = effect.toObject();
  delete data._id;
  data.origin = item.uuid;
  data.transfer = false;
  data.disabled = false;
  data.flags ??= {};
  data.flags[MODULE_ID] = {
    ...(data.flags[MODULE_ID] ?? {}),
    sourceActorUuid: actor?.uuid,
    identifier: item?.system?.identifier,
  };
  return data;
}

async function applyFirstEffectToTargets(item, usageConfig, workflow, predicate) {
  const actor = workflow?.actor ?? item.actor;
  const targets = targetsFromUseConfig(workflow, usageConfig);
  if (!actor || targets.length === 0) return true;
  const baseData = effectDataFromItem(item, predicate, actor);
  if (!baseData) return true;

  for (const target of targets) {
    if (!target?.actor) continue;
    await target.actor.createEmbeddedDocuments("ActiveEffect", [baseData]);
  }
  return true;
}

async function removeStatusesFromTargets(item, usageConfig, workflow, statuses) {
  const targets = targetsFromUseConfig(workflow, usageConfig);
  if (!targets.length) return true;
  const wanted = new Set(statuses);
  const canonicalStatusEffectIds = new Map(
    (CONFIG.statusEffects ?? [])
      .filter(status => wanted.has(status.id) && status._id)
      .map(status => [status.id, status._id]),
  );
  for (const target of targets) {
    const actor = target?.actor;
    if (!actor) continue;
    for (const status of wanted) {
      const canonicalEffectId = canonicalStatusEffectIds.get(status);
      for (const effect of Array.from(actor.effects ?? [])) {
        const effectStatuses = Array.from(effect.statuses ?? []);
        if (!effectStatuses.includes(status)) continue;
        if (canonicalEffectId && effect.id === canonicalEffectId) continue;
        const remaining = effectStatuses.filter(current => current !== status);
        const hasMechanicalChanges = Array.isArray(effect.changes) && effect.changes.length > 0;
        if (remaining.length === 0 && !hasMechanicalChanges) {
          await actor.deleteEmbeddedDocuments("ActiveEffect", [effect.id]);
        } else {
          await effect.update({ statuses: remaining });
        }
      }
      if (actor.statuses?.has(status)) {
        await actor.toggleStatusEffect(status, { active: false });
      }
    }
  }
  return true;
}

function compilerRuntimeRulesForAdapter(item, adapter) {
  const rules = item?.flags?.[MODULE_ID]?.spellAutomation?.runtimePlan?.rules ?? [];
  return rules.filter(rule => {
    const value = typeof rule?.adapter === "string"
      ? rule.adapter
      : rule?.adapter?.adapter;
    return value === adapter;
  });
}

function compilerRuntimeArtifact(item, artifactId) {
  return (
    item?.flags?.[MODULE_ID]?.spellAutomation?.runtimePlan?.artifacts ?? []
  ).find(current => current?.semanticId === artifactId) ?? null;
}


function nativeSummonActivityUuid(activity) {
  const direct = String(activity?.uuid ?? "").trim();
  if (direct) return direct;
  const itemUuid = String(activity?.item?.uuid ?? "").trim();
  const activityId = String(activity?.id ?? "").trim();
  return itemUuid && activityId
    ? itemUuid + ".Activity." + activityId
    : "";
}

function nativeSummonContract(activity) {
  const marker = activity?.flags?.[MODULE_ID]?.nativeSummon;
  if (marker === undefined || marker === null) return null;
  if (!marker || typeof marker !== "object" || Array.isArray(marker)) {
    throw new Error("native summon marker must be an object");
  }
  const actualKeys = Object.keys(marker).sort();
  const expectedKeys = [
    ...NATIVE_SUMMON_MARKER_KEYS,
    ...(marker.control === undefined ? [] : ["control"]),
  ].sort();
  if (JSON.stringify(actualKeys) !== JSON.stringify(expectedKeys)) {
    throw new Error(
      "native summon marker keys must be exactly " + expectedKeys.join(", "),
    );
  }
  if (
    activity?.type !== "summon"
    || marker.provider !== "dnd5e"
    || marker.humanStep !== "native-summon-placement"
  ) {
    throw new Error("native summon marker is not bound to a dnd5e SummonActivity");
  }
  for (const key of ["artifactId", "choice", "profileId", "documentId", "cleanup"]) {
    if (!String(marker[key] ?? "").trim()) {
      throw new Error("native summon marker requires " + key);
    }
  }
  if (![
    "concentration-effect",
    "dm-duration",
    "root-concentration",
    "retain-entity",
    "long-rest-or-defeat-or-dismiss",
  ].includes(marker.cleanup)) {
    throw new Error("native summon cleanup is outside the closed lifecycle contract");
  }
  const control = marker.control ?? null;
  if (control !== null) {
    if (
      !control
      || typeof control !== "object"
      || Array.isArray(control)
      || JSON.stringify(Object.keys(control).sort())
        !== JSON.stringify([
          "contractId",
          "durationSeconds",
          "expiry",
          "version",
        ])
      || Number(control.version) !== NATIVE_SUMMON_CONTROL_VERSION
      || !String(control.contractId ?? "").trim()
      || Number(control.durationSeconds) !== 24 * 60 * 60
      || control.expiry !== "release-control-keep-entity"
    ) {
      throw new Error("native summon control is outside the closed 24-hour retain-entity contract");
    }
  }
  if ((marker.cleanup === "retain-entity") !== Boolean(control)) {
    throw new Error("native summon retain-entity cleanup and control must be declared together");
  }
  if (!Number.isInteger(Number(marker.revision)) || Number(marker.revision) < 1) {
    throw new Error("native summon marker revision must be a positive integer");
  }
  const expectedCount = Number(marker.expectedCount);
  if (!Number.isInteger(expectedCount) || ![1, 2, 3, 5].includes(expectedCount)) {
    throw new Error("native summon expectedCount must be one, two, three, or five");
  }
  if (
    marker.uniqueness !== null
    && (!marker.uniqueness || typeof marker.uniqueness !== "object" || Array.isArray(marker.uniqueness))
  ) {
    throw new Error("native summon uniqueness must be an object or null");
  }
  if (marker.uniqueness !== null && (
    JSON.stringify(Object.keys(marker.uniqueness).sort())
      !== JSON.stringify(["enforcement", "maximum", "scope"])
    || Number(marker.uniqueness.maximum) !== 1
    || !(
      marker.uniqueness.scope === "source-actor-item"
        && marker.uniqueness.enforcement === "replace-after-create"
      || marker.uniqueness.scope === "root-invocation"
        && marker.uniqueness.enforcement === "pre-use-reject"
    )
  )) {
    throw new Error("native summon uniqueness is outside the closed replace/guard contract");
  }
  const rootGuard = marker.uniqueness?.scope === "root-invocation"
    && marker.uniqueness?.enforcement === "pre-use-reject";
  if ((marker.cleanup === "root-concentration") !== rootGuard) {
    throw new Error("native summon root lifecycle and live guard must be declared together");
  }
  const profiles = Array.from(activity?.profiles ?? []);
  if (profiles.length !== 1) {
    throw new Error("native summon Activity must expose exactly one native profile");
  }
  const profile = profiles[0];
  const profileDocumentId = String(profile?.uuid ?? "").split(".").at(-1);
  if (
    !String(profile?._id ?? "").trim()
    || Number(profile?.count || 1) !== expectedCount
    || profileDocumentId !== marker.documentId
    || activity?.summon?.prompt !== true
  ) {
    throw new Error("native summon Activity profile/count/prompt drifted from its marker");
  }
  return {
    marker: foundry.utils.deepClone(marker),
    nativeProfileId: String(profile._id),
    expectedCount,
  };
}

function nativeSummonRequestId(value, { create = false } = {}) {
  let requestId = String(value ?? "").trim();
  if (!requestId && create) requestId = foundry.utils.randomID();
  if (!/^[A-Za-z0-9_-]{8,128}$/.test(requestId)) {
    throw new Error("native summon requestId is missing or invalid");
  }
  return requestId;
}

function nativeSummonSequenceId(value, { create = false } = {}) {
  let sequenceId = String(value ?? "").trim();
  if (!sequenceId && create) sequenceId = foundry.utils.randomID();
  if (!/^[A-Za-z0-9_-]{8,128}$/.test(sequenceId)) {
    throw new Error("native summon sequenceId is missing or invalid");
  }
  return sequenceId;
}

function nativeSummonTokenDocument(value) {
  if (value?.documentName === "Token") return value;
  if (value?.document?.documentName === "Token") return value.document;
  return null;
}

function nativeSummonSourceToken(activity, usageConfig = {}) {
  const explicitUuid = String(
    usageConfig?.midiOptions?.tokenUuid
      ?? usageConfig?.tokenUuid
      ?? "",
  ).trim();
  if (explicitUuid) {
    const explicit = nativeSummonTokenDocument(fromUuidSync(explicitUuid, { strict: false }));
    if (!explicit) throw new Error("native summon explicit source Token does not resolve");
    return explicit;
  }
  const explicitId = String(
    usageConfig?.midiOptions?.tokenId
      ?? usageConfig?.tokenId
      ?? "",
  ).trim();
  if (explicitId) {
    const explicit = nativeSummonTokenDocument(canvas.scene?.tokens?.get?.(explicitId));
    if (!explicit) throw new Error("native summon explicit source tokenId does not resolve");
    return explicit;
  }
  const candidates = new Map();
  for (const candidate of [activity?.actor?.token, activity?.getUsageToken?.()]) {
    const token = nativeSummonTokenDocument(candidate);
    if (token?.uuid) candidates.set(token.uuid, token);
  }
  if (!candidates.size && canvas.ready && canvas.scene) {
    for (const token of canvas.scene.tokens ?? []) {
      if (
        String(token.actor?.uuid ?? "") === String(activity?.actor?.uuid ?? "")
        || String(token.actorId ?? "") === String(activity?.actor?.id ?? "")
      ) {
        candidates.set(token.uuid, token);
      }
    }
  }
  if (candidates.size !== 1) {
    throw new Error("native summon requires exactly one source Token in the viewed scene");
  }
  return candidates.values().next().value;
}

function nativeSummonFiniteInitiative(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function nativeSummonSourceCombatant(sourceToken) {
  const scene = sourceToken?.parent;
  const combats = Array.from(game.combats ?? []).filter(combat =>
    combat.active === true && combat.scene?.uuid === scene?.uuid
  );
  if (combats.length !== 1) {
    throw new Error("native summon requires exactly one active Combat for the source Scene");
  }
  const combat = combats[0];
  const matches = Array.from(combat.combatants ?? []).filter(combatant =>
    String(combatant.sceneId ?? combat.scene?.id ?? "") === String(scene?.id ?? "")
      && String(combatant.tokenId ?? "") === String(sourceToken?.id ?? "")
      && String(combatant.actorId ?? "") === String(sourceToken?.actorId ?? "")
  );
  if (matches.length !== 1 || !nativeSummonFiniteInitiative(matches[0].initiative)) {
    throw new Error(
      "native summon source Token requires exactly one Combatant with finite initiative before consumption",
    );
  }
  return { combat, combatant: matches[0], initiative: Number(matches[0].initiative) };
}

function nativeSummonUniqueActiveOwner(actor) {
  const owners = Array.from(game.users ?? []).filter(user => {
    if (!user?.active || user.isGM) return false;
    try {
      return actor.testUserPermission?.(user, "OWNER", { exact: true }) === true;
    } catch (_error) {
      return Number(actor?._source?.ownership?.[user.id] ?? 0) === 3;
    }
  });
  return owners.length === 1 ? owners[0].id : null;
}

function nativeSummonProvenance(token) {
  return token?.flags?.[MODULE_ID]?.nativeSummon
    ?? token?.actor?.flags?.[MODULE_ID]?.nativeSummon
    ?? null;
}

function nativeSummonOwnedTokens(predicate = () => true) {
  const matches = [];
  for (const scene of game.scenes ?? []) {
    for (const token of scene.tokens ?? []) {
      const provenance = nativeSummonProvenance(token);
      if (provenance && predicate(provenance, token, scene)) {
        matches.push({ scene, token, provenance });
      }
    }
  }
  return matches;
}

function nativeSummonTokenIsLive(token) {
  if (!token?.actor) return false;
  const hp = Number(token.actor.system?.attributes?.hp?.value);
  if (Number.isFinite(hp) && hp <= 0) return false;
  const statuses = token?.actor?.statuses instanceof Set
    ? token.actor.statuses
    : new Set(token?.actor?.statuses ?? []);
  if (statuses.has("dead")) return false;
  return !Array.from(game.combats ?? []).some(combat =>
    Array.from(combat.combatants ?? []).some(combatant =>
      String(combatant.sceneId ?? combat.scene?.id ?? "") === String(token?.parent?.id ?? "")
        && String(combatant.tokenId ?? "") === String(token?.id ?? "")
        && combatant.isDefeated === true
    )
  );
}

function nativeSummonRootEffect(provenance) {
  const effectUuid = String(provenance?.rootConcentrationEffectUuid ?? "").trim();
  if (!effectUuid) return null;
  const effect = fromUuidSync(effectUuid, { strict: false });
  if (
    effect?.documentName !== "ActiveEffect"
    || effect.disabled === true
    || effect.active === false
    || effect.isSuppressed === true
  ) {
    return null;
  }
  return effect;
}

function pruneNativeSummonInvocations(now = Date.now()) {
  for (const [requestId, record] of NATIVE_SUMMON_INVOCATIONS) {
    if (now - Number(record.createdAt ?? 0) > 10 * 60 * 1000) {
      NATIVE_SUMMON_INVOCATIONS.delete(requestId);
    }
  }
}

function prepareNativeSummonUse(activity, usageConfig = {}) {
  const contract = nativeSummonContract(activity);
  if (!contract) return true;
  if (!game.user?.isGM) {
    throw new Error("native summon Activity use must execute in the GM browser session");
  }
  if (usageConfig?.create?.summons !== true) {
    throw new Error("native summon Activity use must enter dnd5e native placement");
  }
  usageConfig.summons ??= {};
  if (!usageConfig.summons.profile) {
    usageConfig.summons.profile = contract.nativeProfileId;
  }
  if (String(usageConfig.summons.profile) !== contract.nativeProfileId) {
    throw new Error("native summon usage selected a profile outside the named Activity");
  }
  const requestId = nativeSummonRequestId(
    usageConfig.summons.arcaneNativeRequestId,
    { create: true },
  );
  usageConfig.summons.arcaneNativeRequestId = requestId;
  usageConfig.midiOptions ??= {};
  usageConfig.midiOptions.workflowOptions ??= {};
  const workflowOptions = usageConfig.midiOptions.workflowOptions;
  const workflowRequestId = String(workflowOptions.arcaneNativeRequestId ?? "").trim();
  if (workflowRequestId && workflowRequestId !== requestId) {
    throw new Error("native summon workflow requestId does not match its Activity invocation");
  }
  const midiSequenceId = nativeSummonSequenceId(
    workflowOptions.arcaneNativeSequenceId,
    { create: true },
  );
  workflowOptions.arcaneNativeRequestId = requestId;
  workflowOptions.arcaneNativeSequenceId = midiSequenceId;
  pruneNativeSummonInvocations();
  if (NATIVE_SUMMON_INVOCATIONS.has(requestId)) {
    throw new Error("native summon requestId was already used");
  }
  const sourceToken = nativeSummonSourceToken(activity, usageConfig);
  const usageToken = nativeSummonTokenDocument(activity?.getUsageToken?.());
  if (!usageToken?.uuid || usageToken.uuid !== sourceToken.uuid) {
    throw new Error(
      "native summon controlled usage Token does not match the requested source Combatant Token",
    );
  }
  if (sourceToken.parent?.uuid !== canvas.scene?.uuid) {
    throw new Error("native summon source Token must belong to the viewed Scene");
  }
  const source = nativeSummonSourceCombatant(sourceToken);
  const sourceProvenance = nativeSummonProvenance(sourceToken);
  let inheritedRootEffect = null;
  if (sourceProvenance?.rootConcentrationEffectUuid) {
    if (contract.marker.cleanup !== "root-concentration") {
      throw new Error("nested native summon requires the closed root-concentration marker");
    }
    inheritedRootEffect = nativeSummonRootEffect(sourceProvenance);
    if (!inheritedRootEffect) {
      throw new Error("nested native summon requires its live root concentration effect");
    }
    const liveChildren = nativeSummonOwnedTokens((provenance, token) =>
      provenance.parentTokenUuid === sourceToken.uuid
        && provenance.rootConcentrationEffectUuid === inheritedRootEffect.uuid
        && provenance.artifactId === contract.marker.artifactId
        && provenance.sourceItemUuid === activity.item.uuid
        && String(provenance.sourceActivityId ?? "") === String(activity.id ?? "")
        && nativeSummonTokenIsLive(token)
    );
    if (liveChildren.length) {
      const activityName = String(activity?.name ?? activity?.item?.name ?? "").trim()
        || "This activity";
      const profile = Array.from(activity?.profiles ?? []).find(candidate =>
        String(candidate?._id ?? "") === contract.nativeProfileId
      );
      const profileName = String(profile?.name ?? contract.marker.profileId ?? "").trim()
        || "summon";
      const error = new Error(
        activityName + " cannot summon another " + profileName
        + " while its current " + profileName + " is alive",
      );
      error.arcaneNativeSummonRejectionCode = "ACTION_BLOCKED";
      throw error;
    }
  } else if (contract.marker.cleanup === "root-concentration") {
    throw new Error("root-concentration native summon requires a summoned source Token");
  }
  const activityUuid = nativeSummonActivityUuid(activity);
  if (!activityUuid || !activity?.item?.uuid || !activity?.actor?.uuid) {
    throw new Error("native summon source Activity graph lacks stable UUIDs");
  }
  NATIVE_SUMMON_INVOCATIONS.set(requestId, {
    requestId,
    midiSequenceId,
    createdAt: Date.now(),
    activityUuid,
    activityId: String(activity.id),
    sourceActorUuid: activity.actor.uuid,
    sourceTokenUuid: sourceToken.uuid,
    sourceItemUuid: activity.item.uuid,
    combatUuid: source.combat.uuid,
    sourceCombatantUuid: source.combatant.uuid,
    inheritedInitiative: source.initiative,
    ownerUserId: nativeSummonUniqueActiveOwner(activity.actor),
    contract,
    sourceProvenance: sourceProvenance
      ? foundry.utils.deepClone(sourceProvenance)
      : null,
    inheritedRootEffectUuid: inheritedRootEffect?.uuid ?? null,
    preparedCount: 0,
    postSummonSeen: false,
    postSummonTokenUuids: [],
    postUseSeen: false,
    postUseTokenUuids: [],
    concentrationEffectUuid: null,
    messageUuid: null,
    finalizePromise: null,
    receipt: null,
  });
  return true;
}

function cancelNativeSummonUse(input) {
  const requestId = nativeSummonRequestId(input?.requestId);
  const record = NATIVE_SUMMON_INVOCATIONS.get(requestId);
  if (!record) return false;
  const expected = {
    activityUuid: record.activityUuid,
    sourceTokenUuid: record.sourceTokenUuid,
    sourceItemUuid: record.sourceItemUuid,
    midiSequenceId: record.midiSequenceId,
  };
  for (const [key, value] of Object.entries(expected)) {
    if (String(input?.[key] ?? "") !== String(value ?? "")) {
      throw new Error("native summon cancellation " + key + " does not match the invocation");
    }
  }
  if (
    record.postSummonSeen
    || record.postUseSeen
    || record.finalizePromise
    || record.receipt
  ) {
    return false;
  }
  NATIVE_SUMMON_INVOCATIONS.delete(requestId);
  return true;
}

function guardNativeSummonPlacement(activity, profile, options = {}) {
  const contract = nativeSummonContract(activity);
  if (!contract) return true;
  const requestId = String(options?.arcaneNativeRequestId ?? "").trim();
  const record = requestId ? NATIVE_SUMMON_INVOCATIONS.get(requestId) : null;
  if (
    !record
    || record.postSummonSeen
    || record.activityUuid !== nativeSummonActivityUuid(activity)
    || String(profile?._id ?? "") !== contract.nativeProfileId
  ) {
    ui.notifications?.warn(
      "Arcane blocked Place Summons without the original native Activity invocation.",
    );
    return false;
  }
  return true;
}

function nativeSummonPreparedProvenance(record, memberIndex) {
  const marker = record.contract.marker;
  const nested = Boolean(record.inheritedRootEffectUuid);
  const concentrationRoot = !nested && marker.cleanup === "concentration-effect";
  const inherited = record.sourceProvenance ?? {};
  return {
    requestId: record.requestId,
    artifactId: marker.artifactId,
    choice: marker.choice,
    profileId: marker.profileId,
    sourceActorUuid: record.sourceActorUuid,
    sourceTokenUuid: record.sourceTokenUuid,
    sourceItemUuid: record.sourceItemUuid,
    sourceActivityId: record.activityId,
    memberIndex,
    parentTokenUuid: nested ? record.sourceTokenUuid : null,
    rootRequestId: nested
      ? String(inherited.rootRequestId ?? inherited.requestId ?? "") || null
      : concentrationRoot ? record.requestId : null,
    rootSourceActorUuid: nested
      ? String(inherited.rootSourceActorUuid ?? "") || null
      : concentrationRoot ? record.sourceActorUuid : null,
    rootSourceTokenUuid: nested
      ? String(inherited.rootSourceTokenUuid ?? "") || null
      : concentrationRoot ? record.sourceTokenUuid : null,
    rootSourceItemUuid: nested
      ? String(inherited.rootSourceItemUuid ?? "") || null
      : concentrationRoot ? record.sourceItemUuid : null,
    rootConcentrationEffectUuid: nested
      ? record.inheritedRootEffectUuid
      : null,
    controlContractId: marker.control?.contractId ?? null,
    lifecyclePolicy: marker.cleanup,
    lifecycleEffectUuid: null,
    controlEffectUuid: null,
  };
}

function nativeSummonCanonicalTokens(record, tokens, stage) {
  const created = Array.from(tokens ?? []);
  if (
    created.length > record.contract.expectedCount
    || created.some(token => token?.documentName !== "Token" || !String(token.uuid ?? "").trim())
  ) {
    throw new Error("native summon " + stage + " returned an invalid Token batch");
  }
  const byMemberIndex = new Map();
  const tokenUuids = new Set();
  for (const token of created) {
    const provenance = nativeSummonProvenance(token);
    const memberIndex = provenance?.memberIndex;
    if (
      !Number.isInteger(memberIndex)
      || memberIndex < 0
      || memberIndex >= created.length
      || byMemberIndex.has(memberIndex)
      || tokenUuids.has(token.uuid)
    ) {
      throw new Error("native summon " + stage + " returned non-canonical Token provenance");
    }
    const expected = nativeSummonPreparedProvenance(record, memberIndex);
    const actualKeys = provenance && typeof provenance === "object" && !Array.isArray(provenance)
      ? Object.keys(provenance).sort()
      : [];
    const expectedKeys = Object.keys(expected).sort();
    const finalizedRootEffectUuid = record.inheritedRootEffectUuid
      ?? record.concentrationEffectUuid
      ?? null;
    if (
      actualKeys.length !== expectedKeys.length
      || actualKeys.some((key, index) => key !== expectedKeys[index])
      || expectedKeys.some(key => {
        if (
          ![
            "rootConcentrationEffectUuid",
            "lifecycleEffectUuid",
            "controlEffectUuid",
          ].includes(key)
          || stage !== "finalizer"
        ) {
          return provenance[key] !== expected[key];
        }
        if (key === "rootConcentrationEffectUuid") {
          return provenance[key] !== expected[key]
            && provenance[key] !== finalizedRootEffectUuid;
        }
        return provenance[key] !== expected[key]
          && !String(provenance[key] ?? "").trim();
      })
    ) {
      throw new Error("native summon " + stage + " Token provenance drifted from its invocation");
    }
    byMemberIndex.set(memberIndex, token);
    tokenUuids.add(token.uuid);
  }
  const ordered = [];
  for (let memberIndex = 0; memberIndex < created.length; memberIndex += 1) {
    const token = byMemberIndex.get(memberIndex);
    if (!token) {
      throw new Error("native summon " + stage + " Token provenance is not contiguous");
    }
    ordered.push(token);
  }
  return ordered;
}

function prepareNativeSummonTokenData(activity, profile, tokenData, options = {}) {
  const contract = nativeSummonContract(activity);
  if (!contract) return;
  const requestId = nativeSummonRequestId(options?.arcaneNativeRequestId);
  const record = NATIVE_SUMMON_INVOCATIONS.get(requestId);
  if (
    !record
    || record.activityUuid !== nativeSummonActivityUuid(activity)
    || String(profile?._id ?? "") !== contract.nativeProfileId
  ) {
    throw new Error("native summon token data lacks its exact invocation");
  }
  if (tokenData?.actorLink !== false) {
    throw new Error("native summon profiles must produce unlinked Token ActorDelta documents");
  }
  const memberIndex = record.preparedCount;
  if (memberIndex >= contract.expectedCount) {
    throw new Error("native summon prepared more Token data than the profile count");
  }
  const provenance = nativeSummonPreparedProvenance(record, memberIndex);
  const ownership = { default: 0 };
  if (record.ownerUserId) ownership[record.ownerUserId] = 3;
  foundry.utils.setProperty(
    tokenData,
    "flags." + MODULE_ID + ".nativeSummon",
    foundry.utils.deepClone(provenance),
  );
  foundry.utils.setProperty(
    tokenData,
    "delta.flags." + MODULE_ID + ".nativeSummon",
    foundry.utils.deepClone(provenance),
  );
  foundry.utils.setProperty(tokenData, "delta.ownership", ownership);
  record.preparedCount += 1;
}

function captureNativeSummonTokens(activity, profile, tokens, options = {}) {
  const contract = nativeSummonContract(activity);
  if (!contract) return;
  const requestId = nativeSummonRequestId(options?.arcaneNativeRequestId);
  const record = NATIVE_SUMMON_INVOCATIONS.get(requestId);
  if (
    !record
    || record.postSummonSeen
    || record.activityUuid !== nativeSummonActivityUuid(activity)
    || String(profile?._id ?? "") !== contract.nativeProfileId
  ) {
    throw new Error("native summon postSummon hook lacks its exact invocation");
  }
  const created = nativeSummonCanonicalTokens(record, tokens, "postSummon");
  if (created.length !== record.preparedCount) {
    throw new Error("native summon postSummon returned an invalid Token batch");
  }
  record.postSummonSeen = true;
  record.postSummonTokenUuids = created.map(token => token.uuid);
}

function nativeSummonSameOrderedUuids(left, right) {
  return Array.isArray(left)
    && Array.isArray(right)
    && left.length === right.length
    && left.every((uuid, index) => String(uuid) === String(right[index]));
}

function nativeSummonConcentrationEffectFromUse(record, results) {
  const actor = fromUuidSync(record.sourceActorUuid, { strict: false });
  const candidates = Array.from(results?.effects ?? []).filter(effect => {
    const current = actor?.effects?.get?.(effect?.id);
    const statuses = current?.statuses instanceof Set
      ? current.statuses
      : new Set(current?.statuses ?? []);
    return current === effect
      && effect?.documentName === "ActiveEffect"
      && effect.disabled !== true
      && effect.active !== false
      && effect.isSuppressed !== true
      && statuses.has("concentrating")
      && String(effect.origin ?? "") === record.sourceItemUuid;
  });
  if (candidates.length !== 1) {
    throw new Error("native summon concentration use did not return one exact source effect");
  }
  return candidates[0];
}

function bindNativeSummonPostUseWorkflow(record, usageConfig, messageUuid) {
  const workflow = usageConfig?.workflow;
  if (!workflow || typeof workflow !== "object") {
    throw new Error("native summon postUseActivity lacks its Midi workflow");
  }
  const boundMessageUuid = String(messageUuid ?? "").trim();
  if (!boundMessageUuid.startsWith("ChatMessage.")) {
    throw new Error("native summon postUseActivity workflow requires its exact ChatMessage UUID");
  }
  const sourceTokenUuid = String(
    nativeSummonTokenDocument(workflow.token)?.uuid
      ?? workflow.tokenUuid
      ?? "",
  ).trim();
  const expected = {
    activityUuid: record.activityUuid,
    sourceTokenUuid: record.sourceTokenUuid,
    sourceItemUuid: record.sourceItemUuid,
  };
  const actual = {
    activityUuid: nativeSummonActivityUuid(workflow.activity),
    sourceTokenUuid,
    sourceItemUuid: String(
      workflow.item?.uuid
        ?? workflow.activity?.item?.uuid
        ?? "",
    ).trim(),
  };
  for (const [key, value] of Object.entries(expected)) {
    if (String(actual[key] ?? "") !== String(value ?? "")) {
      throw new Error("native summon postUseActivity workflow " + key + " does not match the invocation");
    }
  }
  workflow.workflowOptions ??= {};
  const workflowRequestId = String(
    workflow.workflowOptions.arcaneNativeRequestId ?? "",
  ).trim();
  const workflowSequenceId = String(
    workflow.workflowOptions.arcaneNativeSequenceId ?? "",
  ).trim();
  const usageSequenceId = String(
    usageConfig?.midiOptions?.workflowOptions?.arcaneNativeSequenceId ?? "",
  ).trim();
  // dnd5e deep-clones usage before preUseActivity while Midi creates its
  // workflow from the outer usage object. The clone-local sequence is therefore
  // an optional echo, not a durable identity carrier. Any non-empty echo remains
  // fail-closed; the invocation record and exact workflow graph are authoritative.
  if (usageSequenceId && usageSequenceId !== record.midiSequenceId) {
    throw new Error("native summon postUseActivity usage midiSequenceId does not match the invocation");
  }
  if (workflowRequestId && workflowRequestId !== record.requestId) {
    throw new Error("native summon postUseActivity workflow requestId does not match the invocation");
  }
  if (workflowSequenceId && workflowSequenceId !== record.midiSequenceId) {
    throw new Error("native summon postUseActivity workflow midiSequenceId does not match the invocation");
  }
  workflow.workflowOptions.arcaneNativeRequestId = record.requestId;
  workflow.workflowOptions.arcaneNativeSequenceId = record.midiSequenceId;
  const binding = {
    requestId: record.requestId,
    midiSequenceId: record.midiSequenceId,
    activityUuid: record.activityUuid,
    sourceTokenUuid: record.sourceTokenUuid,
    sourceItemUuid: record.sourceItemUuid,
    messageUuid: boundMessageUuid,
  };
  if (
    workflow.__arcaneNativeSummonBinding
    && JSON.stringify(workflow.__arcaneNativeSummonBinding) !== JSON.stringify(binding)
  ) {
    throw new Error("native summon postUseActivity workflow binding was already claimed");
  }
  workflow.__arcaneNativeSummonBinding = Object.freeze(binding);
  return workflow;
}

function captureNativeSummonPostUse(activity, usageConfig = {}, results = {}) {
  const contract = nativeSummonContract(activity);
  if (!contract) return true;
  const requestId = nativeSummonRequestId(
    usageConfig?.summons?.arcaneNativeRequestId,
  );
  const record = NATIVE_SUMMON_INVOCATIONS.get(requestId);
  if (
    !record
    || record.postUseSeen
    || record.activityUuid !== nativeSummonActivityUuid(activity)
  ) {
    throw new Error("native summon postUseActivity hook lacks its exact invocation");
  }
  const created = nativeSummonCanonicalTokens(record, results?.summoned, "postUseActivity");
  const createdTokenUuids = created.map(token => token.uuid);
  if (
    !record.postSummonSeen
    || !nativeSummonSameOrderedUuids(createdTokenUuids, record.postSummonTokenUuids)
  ) {
    throw new Error("native summon postUseActivity result drifted from postSummon");
  }
  let concentrationEffectUuid = null;
  if (!record.inheritedRootEffectUuid && contract.marker.cleanup === "concentration-effect") {
    concentrationEffectUuid = nativeSummonConcentrationEffectFromUse(record, results).uuid;
  }
  const messageUuid = String(results?.message?.uuid ?? "").trim();
  if (!messageUuid) {
    throw new Error("native summon postUseActivity did not return its ChatMessage UUID");
  }
  const workflow = bindNativeSummonPostUseWorkflow(record, usageConfig, messageUuid);
  record.postUseTokenUuids = [...createdTokenUuids];
  record.messageUuid = messageUuid;
  record.concentrationEffectUuid = concentrationEffectUuid;
  record.postUseSeen = true;
  results.arcaneNativeSummonInvocation = {
    requestId,
    activityUuid: record.activityUuid,
    profileId: contract.marker.profileId,
    sourceTokenUuid: record.sourceTokenUuid,
    sourceItemUuid: record.sourceItemUuid,
    createdTokenUuids,
    messageUuid: record.messageUuid,
  };
  // dnd5e has already committed the native Token batch at postUseActivity.
  // Start the one workflow-scoped terminal task here so a later Midi
  // postChatCardChecks=false return cannot strand the committed Tokens without
  // Combatants, lifecycle, or a receipt. postCleanup and public wrappers join it.
  finalizeNativeSummonFromWorkflow(workflow).catch(() => {});
  return true;
}

function nativeSummonWorkflowUuid(workflow) {
  return String(
    workflow?.itemCardUuid
      ?? workflow?.__arcaneNativeSummonBinding?.messageUuid
      ?? workflow?.id
      ?? "",
  ).trim();
}

async function finalizeNativeSummonFromWorkflow(workflow) {
  if (!workflow) return null;
  if (
    workflow.aborted === true
    && !workflow.__arcaneNativeSummonBinding
    && !workflow.__arcaneNativeSummonReceipt
    && !workflow.__arcaneNativeSummonFinalizePromise
  ) return null;
  if (workflow.__arcaneNativeSummonReceipt) {
    return foundry.utils.deepClone(workflow.__arcaneNativeSummonReceipt);
  }
  if (workflow.__arcaneNativeSummonFinalizePromise) {
    return workflow.__arcaneNativeSummonFinalizePromise;
  }
  const activity = workflow?.activity;
  const marker = activity?.flags?.[MODULE_ID]?.nativeSummon;
  if (
    !workflow.__arcaneNativeSummonBinding
    && (marker === undefined || marker === null)
  ) return null;
  const task = (async () => {
    const workflowOptions = workflow?.workflowOptions ?? {};
    const rawRequestId = String(
      workflow?.__arcaneNativeSummonBinding?.requestId
        ?? workflowOptions.arcaneNativeRequestId
        ?? "",
    ).trim();
    let record = null;
    try {
      if (!nativeSummonContract(activity)) {
        throw new Error(
          "native summon workflow marker is missing from its postUseActivity binding",
        );
      }
      const requestId = nativeSummonRequestId(rawRequestId);
      record = NATIVE_SUMMON_INVOCATIONS.get(requestId);
      if (!record || !record.postUseSeen) {
        throw new Error("native summon workflow finalizer lacks its exact postUseActivity invocation");
      }
      if (!workflow.__arcaneNativeSummonBinding) {
        throw new Error("native summon workflow lacks its exact postUseActivity binding");
      }
      const sourceTokenUuid = String(
        nativeSummonTokenDocument(workflow?.token)?.uuid
          ?? workflow?.tokenUuid
          ?? "",
      ).trim();
      const expected = {
        activityUuid: record.activityUuid,
        sourceTokenUuid: record.sourceTokenUuid,
        sourceItemUuid: record.sourceItemUuid,
        midiSequenceId: record.midiSequenceId,
        messageUuid: record.messageUuid,
      };
      const actual = {
        activityUuid: String(
          workflow.__arcaneNativeSummonBinding?.activityUuid
            ?? nativeSummonActivityUuid(activity),
        ).trim(),
        sourceTokenUuid: String(
          workflow.__arcaneNativeSummonBinding?.sourceTokenUuid
            ?? sourceTokenUuid,
        ).trim(),
        sourceItemUuid: String(
          workflow.__arcaneNativeSummonBinding?.sourceItemUuid
            ?? workflow.item?.uuid
            ?? activity?.item?.uuid
            ?? "",
        ).trim(),
        midiSequenceId: String(
          workflow.__arcaneNativeSummonBinding?.midiSequenceId ?? "",
        ).trim(),
        messageUuid: String(
          workflow.__arcaneNativeSummonBinding?.messageUuid ?? "",
        ).trim(),
      };
      for (const [key, value] of Object.entries(expected)) {
        if (String(actual[key] ?? "") !== String(value ?? "")) {
          throw new Error("native summon workflow " + key + " does not match the invocation");
        }
      }
      const live = {
        activityUuid: nativeSummonActivityUuid(activity),
        sourceTokenUuid,
        sourceItemUuid: String(
          workflow.item?.uuid
            ?? activity?.item?.uuid
            ?? "",
        ).trim(),
        requestId: String(workflowOptions.arcaneNativeRequestId ?? "").trim(),
        midiSequenceId: String(workflowOptions.arcaneNativeSequenceId ?? "").trim(),
        messageUuid: nativeSummonWorkflowUuid(workflow),
      };
      for (const [key, value] of Object.entries({
        ...expected,
        requestId: record.requestId,
      })) {
        if (String(live[key] ?? "") !== String(value ?? "")) {
          throw new Error("native summon workflow " + key + " drifted from its postUseActivity binding");
        }
      }
      const workflowUuid = nativeSummonWorkflowUuid(workflow);
      if (!workflowUuid || workflowUuid !== record.messageUuid) {
        throw new Error("native summon workflow finalizer requires its exact ChatMessage workflow UUID");
      }
      const receipt = await finalizeNativeSummonUse({
        requestId: record.requestId,
        activityUuid: record.activityUuid,
        profileId: record.contract.marker.profileId,
        sourceTokenUuid: record.sourceTokenUuid,
        sourceItemUuid: record.sourceItemUuid,
        createdTokenUuids: [...record.postUseTokenUuids],
        messageUuid: record.messageUuid,
        workflowUuid,
      });
      workflow.__arcaneNativeSummonReceipt = foundry.utils.deepClone(receipt);
      Hooks.callAll(MODULE_ID + ".nativeSummonFinalized", foundry.utils.deepClone(receipt));
      return receipt;
    } catch (error) {
      const message = String(error?.message ?? error);
      Hooks.callAll(MODULE_ID + ".nativeSummonFinalizeFailed", {
        requestId: (record?.requestId ?? rawRequestId) || null,
        activityUuid: (
          record?.activityUuid
            ?? nativeSummonActivityUuid(activity)
        ) || null,
        sourceTokenUuid: (
          record?.sourceTokenUuid
            ?? String(workflow?.tokenUuid ?? "").trim()
        ) || null,
        sourceItemUuid: (
          record?.sourceItemUuid
            ?? String(
              workflow?.item?.uuid
                ?? activity?.item?.uuid
                ?? "",
            ).trim()
        ) || null,
        message,
      });
      ui.notifications?.error(message);
      console.warn("[" + MODULE_ID + "] native summon workflow finalization failed", error);
      throw error;
    }
  })();
  workflow.__arcaneNativeSummonFinalizePromise = task;
  return task;
}

function nativeSummonValidateFinalizeInput(input, record) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("finalizeNativeSummonUse requires one input object");
  }
  const expected = {
    activityUuid: record.activityUuid,
    profileId: record.contract.marker.profileId,
    sourceTokenUuid: record.sourceTokenUuid,
    sourceItemUuid: record.sourceItemUuid,
  };
  for (const [key, value] of Object.entries(expected)) {
    if (String(input[key] ?? "") !== String(value)) {
      throw new Error("native summon finalizer " + key + " does not match the invocation");
    }
  }
  if (
    !Array.isArray(input.createdTokenUuids)
    || !nativeSummonSameOrderedUuids(input.createdTokenUuids, record.postUseTokenUuids)
  ) {
    throw new Error("native summon finalizer requires the exact ordered postUse Token UUIDs");
  }
  for (const key of ["messageUuid", "workflowUuid"]) {
    if (input[key] !== null && input[key] !== undefined && typeof input[key] !== "string") {
      throw new Error("native summon finalizer " + key + " must be a string or null");
    }
  }
  if (String(input.messageUuid ?? "") !== String(record.messageUuid ?? "")) {
    throw new Error("native summon finalizer messageUuid does not match postUseActivity");
  }
}

async function nativeSummonResolveCreatedTokens(record, createdTokenUuids) {
  const tokens = [];
  for (const tokenUuid of createdTokenUuids) {
    const token = await fromUuid(tokenUuid).catch(() => null);
    if (
      token?.documentName !== "Token"
      || token.parent?.uuid !== canvas.scene?.uuid
    ) {
      throw new Error("native summon returned Token no longer resolves with exact provenance");
    }
    tokens.push(token);
  }
  const ordered = nativeSummonCanonicalTokens(record, tokens, "finalizer");
  if (!nativeSummonSameOrderedUuids(
    ordered.map(token => token.uuid),
    createdTokenUuids,
  )) {
    throw new Error("native summon returned Token no longer resolves with exact provenance");
  }
  return ordered;
}

async function nativeSummonApplyOwnershipAndProvenance(record, tokens) {
  const ownership = { default: 0 };
  if (record.ownerUserId) ownership[record.ownerUserId] = 3;
  for (let memberIndex = 0; memberIndex < tokens.length; memberIndex += 1) {
    const token = tokens[memberIndex];
    const provenance = nativeSummonPreparedProvenance(record, memberIndex);
    provenance.rootConcentrationEffectUuid = record.inheritedRootEffectUuid
      ?? record.concentrationEffectUuid
      ?? null;
    await token.update({
      ["flags." + MODULE_ID + ".nativeSummon"]: foundry.utils.deepClone(provenance),
    });
    if (token.actor?.isToken !== true) {
      throw new Error("native summon finalizer requires one synthetic Token ActorDelta");
    }
    await token.actor.update({
      ownership,
      ["flags." + MODULE_ID + ".nativeSummon"]: foundry.utils.deepClone(provenance),
    });
  }
}

function nativeSummonDependentsRegistry() {
  const dependents = globalThis.dnd5e?.registry?.dependents
    ?? game.dnd5e?.registry?.dependents;
  if (
    typeof dependents?.get !== "function"
    || typeof dependents?.untrack !== "function"
  ) {
    throw new Error("native summon requires the dnd5e dependents registry");
  }
  return dependents;
}

function nativeSummonRegistryHasDependent(dependents, effectUuid, token) {
  const tokenUuid = String(token?.uuid ?? "").trim();
  if (!tokenUuid) {
    throw new Error("native summon lifecycle Token lacks a stable UUID");
  }
  return Array.from(dependents.get(effectUuid) ?? []).some(candidate =>
    String(candidate?.uuid ?? candidate ?? "").trim() === tokenUuid
  );
}

function nativeSummonUntrackDependent(dependents, effectUuid, token) {
  dependents.untrack(effectUuid, token);
  if (nativeSummonRegistryHasDependent(dependents, effectUuid, token)) {
    throw new Error("native summon Token remained in its old lifecycle registry");
  }
}

function nativeSummonControlEffectContract(effect) {
  const value = effect?.flags?.[MODULE_ID]?.nativeSummonControl;
  const keys = value && typeof value === "object" && !Array.isArray(value)
    ? Object.keys(value).sort()
    : null;
  const legacyKeys = [
    "artifactId",
    "contractId",
    "controllerActorUuid",
    "expiresWorldTime",
    "lastInvocationId",
    "memberIndex",
    "requestId",
    "sourceItemUuid",
    "tokenUuid",
    "version",
  ];
  const currentKeys = legacyKeys.filter(key => key !== "expiresWorldTime");
  if (
    !keys
    || (
      JSON.stringify(keys) !== JSON.stringify(currentKeys)
      && JSON.stringify(keys) !== JSON.stringify(legacyKeys)
    )
    || Number(value.version) !== NATIVE_SUMMON_CONTROL_VERSION
    || !String(value.contractId ?? "").trim()
    || !String(value.controllerActorUuid ?? "").trim()
    || !String(value.sourceItemUuid ?? "").trim()
    || !String(value.artifactId ?? "").trim()
    || !String(value.requestId ?? "").trim()
    || !String(value.lastInvocationId ?? "").trim()
    || !Number.isInteger(Number(value.memberIndex))
    || Number(value.memberIndex) < 0
    || !String(value.tokenUuid ?? "").trim()
  ) return null;
  return value;
}

function nativeSummonEntityLifecycleContract(effect) {
  const value = effect?.flags?.[MODULE_ID]?.nativeSummonEntityLifecycle;
  if (
    !value
    || typeof value !== "object"
    || Array.isArray(value)
    || JSON.stringify(Object.keys(value).sort()) !== JSON.stringify([
      "artifactId",
      "choice",
      "memberTokenUuids",
      "policy",
      "profileId",
      "requestId",
      "sourceActorUuid",
      "sourceItemUuid",
      "sourceTokenUuid",
      "version",
    ])
    || Number(value.version) !== NATIVE_SUMMON_LIFECYCLE_VERSION
    || value.policy !== "long-rest-or-defeat-or-dismiss"
    || !String(value.requestId ?? "").trim()
    || !String(value.artifactId ?? "").trim()
    || !String(value.sourceActorUuid ?? "").trim()
    || !String(value.sourceTokenUuid ?? "").trim()
    || !String(value.sourceItemUuid ?? "").trim()
    || !String(value.choice ?? "").trim()
    || !String(value.profileId ?? "").trim()
    || !Array.isArray(value.memberTokenUuids)
    || value.memberTokenUuids.length < 1
    || value.memberTokenUuids.some(uuid => !String(uuid ?? "").trim())
    || new Set(value.memberTokenUuids).size !== value.memberTokenUuids.length
  ) return null;
  return value;
}

async function nativeSummonDetachSourceDuration(record, tokens) {
  const dependents = nativeSummonDependentsRegistry();
  for (const token of tokens) {
    const dependentOn = String(
      token.getFlag("dnd5e", "dependentOn") ?? "",
    ).trim();
    if (!dependentOn) continue;
    const effect = await fromUuid(dependentOn).catch(() => null);
    if (String(effect?.origin ?? "") !== record.sourceItemUuid) continue;
    nativeSummonUntrackDependent(dependents, dependentOn, token);
    await token.unsetFlag("dnd5e", "dependentOn");
    if (
      String(token.getFlag("dnd5e", "dependentOn") ?? "").trim()
      || nativeSummonRegistryHasDependent(dependents, dependentOn, token)
    ) {
      throw new Error(
        "native summon Token did not detach from its native duration lifecycle",
      );
    }
  }
  return true;
}

async function nativeSummonWriteFinalProvenance(token, updates) {
  const provenance = nativeSummonProvenance(token);
  if (!provenance || typeof provenance !== "object" || Array.isArray(provenance)) {
    throw new Error("native summon final provenance no longer resolves");
  }
  const next = { ...foundry.utils.deepClone(provenance), ...updates };
  await token.update({
    ["flags." + MODULE_ID + ".nativeSummon"]: foundry.utils.deepClone(next),
  });
  if (token.actor?.isToken !== true) {
    throw new Error("native summon final provenance requires one synthetic ActorDelta");
  }
  await token.actor.update({
    ["flags." + MODULE_ID + ".nativeSummon"]: foundry.utils.deepClone(next),
  });
  return next;
}

async function nativeSummonCreateControlEffects(record, tokens) {
  const control = record.contract.marker.control;
  if (!control) return [];
  const effectUuids = [];
  for (let memberIndex = 0; memberIndex < tokens.length; memberIndex += 1) {
    const token = tokens[memberIndex];
    const effectId = foundry.utils.randomID();
    const [effect] = await token.actor.createEmbeddedDocuments("ActiveEffect", [{
      _id: effectId,
      name: "Create Undead Control — " + String(token.name ?? "Ghoul"),
      img: token.actor?.img ?? token.texture?.src ?? "icons/svg/skull.svg",
      origin: record.sourceItemUuid,
      transfer: false,
      disabled: false,
      changes: [],
      duration: {},
      statuses: [],
      flags: {
        [MODULE_ID]: {
          nativeSummonControl: {
            version: NATIVE_SUMMON_CONTROL_VERSION,
            contractId: control.contractId,
            controllerActorUuid: record.sourceActorUuid,
            sourceItemUuid: record.sourceItemUuid,
            artifactId: record.contract.marker.artifactId,
            requestId: record.requestId,
            memberIndex,
            tokenUuid: token.uuid,
            lastInvocationId: record.requestId,
          },
        },
        dae: {
          stackable: "multi",
          showIcon: true,
          specialDuration: [],
        },
      },
      type: "base",
      system: {},
    }]);
    const contract = nativeSummonControlEffectContract(effect);
    if (
      !contract
      || effect.parent?.uuid !== token.actor.uuid
      || contract.tokenUuid !== token.uuid
    ) {
      throw new Error("native summon control effect failed exact materialization");
    }
    await nativeSummonWriteFinalProvenance(token, {
      controlEffectUuid: effect.uuid,
    });
    effectUuids.push(effect.uuid);
  }
  return effectUuids;
}

async function nativeSummonCreateEntityLifecycle(record, tokens) {
  if (record.contract.marker.cleanup !== "long-rest-or-defeat-or-dismiss") {
    return null;
  }
  if (!tokens.length) return null;
  const sourceActor = await fromUuid(record.sourceActorUuid).catch(() => null);
  const sourceItem = await fromUuid(record.sourceItemUuid).catch(() => null);
  if (
    sourceActor?.documentName !== "Actor"
    || sourceItem?.documentName !== "Item"
    || (sourceItem.actor ?? sourceItem.parent)?.uuid !== sourceActor.uuid
  ) {
    throw new Error("native summon entity lifecycle source graph no longer resolves");
  }
  const memberTokenUuids = tokens.map(token => token.uuid);
  const [effect] = await sourceActor.createEmbeddedDocuments("ActiveEffect", [{
    name: String(sourceItem.name ?? "Planar Ally") + " — "
      + String(record.contract.marker.choice),
    img: sourceItem.img ?? "icons/svg/aura.svg",
    origin: sourceItem.uuid,
    transfer: false,
    disabled: false,
    changes: [],
    duration: {},
    statuses: [],
    flags: {
      [MODULE_ID]: {
        nativeSummonEntityLifecycle: {
          version: NATIVE_SUMMON_LIFECYCLE_VERSION,
          policy: "long-rest-or-defeat-or-dismiss",
          requestId: record.requestId,
          artifactId: record.contract.marker.artifactId,
          sourceActorUuid: record.sourceActorUuid,
          sourceTokenUuid: record.sourceTokenUuid,
          sourceItemUuid: record.sourceItemUuid,
          choice: record.contract.marker.choice,
          profileId: record.contract.marker.profileId,
          memberTokenUuids,
        },
      },
      dae: {
        stackable: "multi",
        showIcon: true,
        specialDuration: [],
      },
    },
    type: "base",
    system: {},
  }]);
  const contract = nativeSummonEntityLifecycleContract(effect);
  if (!contract || effect.parent?.uuid !== sourceActor.uuid) {
    throw new Error("native summon entity lifecycle marker failed exact materialization");
  }
  if (tokens.length) await effect.addDependent(...tokens);
  const dependents = nativeSummonDependentsRegistry();
  for (const token of tokens) {
    if (
      String(token.getFlag("dnd5e", "dependentOn") ?? "") !== effect.uuid
      || !nativeSummonRegistryHasDependent(dependents, effect.uuid, token)
    ) {
      throw new Error("native summon entity did not bind to its source lifecycle marker");
    }
    await nativeSummonWriteFinalProvenance(token, {
      lifecycleEffectUuid: effect.uuid,
      lifecyclePolicy: contract.policy,
    });
  }
  return effect;
}

async function nativeSummonBindLifecycle(record, tokens) {
  if (record.contract.marker.cleanup === "retain-entity") {
    await nativeSummonDetachSourceDuration(record, tokens);
    const effectUuids = await nativeSummonCreateControlEffects(record, tokens);
    return {
      mode: "control-duration-retain-entity",
      effectUuid: null,
      effectUuids,
    };
  }
  if (record.contract.marker.cleanup === "long-rest-or-defeat-or-dismiss") {
    await nativeSummonDetachSourceDuration(record, tokens);
    const effect = await nativeSummonCreateEntityLifecycle(record, tokens);
    return {
      mode: "long-rest-or-defeat-or-dismiss",
      effectUuid: effect?.uuid ?? null,
    };
  }
  const nested = Boolean(record.inheritedRootEffectUuid);
  const concentration = record.contract.marker.cleanup === "concentration-effect";
  const effectUuid = nested
    ? record.inheritedRootEffectUuid
    : concentration ? record.concentrationEffectUuid : null;
  if ((nested || concentration) && !effectUuid) {
    throw new Error("native summon lifecycle requires one exact root concentration effect");
  }
  if (effectUuid) {
    const effect = await fromUuid(effectUuid).catch(() => null);
    if (
      effect?.documentName !== "ActiveEffect"
      || effect.disabled === true
      || effect.active === false
      || effect.isSuppressed === true
    ) {
      throw new Error("native summon root lifecycle effect no longer resolves");
    }
    const dependents = nativeSummonDependentsRegistry();
    for (const token of tokens) {
      const priorEffectUuid = String(
        token.getFlag("dnd5e", "dependentOn") ?? "",
      ).trim();
      if (priorEffectUuid && priorEffectUuid !== effect.uuid) {
        nativeSummonUntrackDependent(dependents, priorEffectUuid, token);
      }
    }
    if (tokens.length) await effect.addDependent(...tokens);
    for (const token of tokens) {
      if (String(token.getFlag("dnd5e", "dependentOn") ?? "") !== effect.uuid) {
        throw new Error("native summon Token did not bind to the exact root lifecycle effect");
      }
      if (!nativeSummonRegistryHasDependent(dependents, effect.uuid, token)) {
        throw new Error("native summon Token did not enter the root lifecycle registry");
      }
    }
    return {
      mode: nested ? "root-concentration" : "concentration",
      effectUuid: effect.uuid,
    };
  }
  if (record.contract.marker.cleanup === "dm-duration") {
    await nativeSummonDetachSourceDuration(record, tokens);
    return { mode: "dm-duration", effectUuid: null };
  }
  return { mode: "native", effectUuid: null };
}

function nativeSummonCombatCursor(combat) {
  const currentId = combat?.combatant?.id ?? null;
  const turnIds = Array.from(combat?.turns ?? []).map(turn => turn.id);
  return {
    round: combat?.round ?? null,
    currentId,
    turnIds,
    currentIndex: turnIds.indexOf(currentId),
  };
}

async function nativeSummonRestoreCombatCursor(combat, snapshot, replacementId = null) {
  let desiredId = snapshot.currentId;
  const survivors = new Set(Array.from(combat.turns ?? []).map(turn => turn.id));
  if (desiredId && !survivors.has(desiredId)) {
    if (replacementId && survivors.has(replacementId)) {
      desiredId = replacementId;
    } else {
      desiredId = snapshot.turnIds
        .slice(Math.max(0, snapshot.currentIndex + 1))
        .concat(snapshot.turnIds.slice(0, Math.max(0, snapshot.currentIndex)))
        .find(id => survivors.has(id)) ?? null;
    }
  }
  const turn = desiredId
    ? Array.from(combat.turns ?? []).findIndex(entry => entry.id === desiredId)
    : -1;
  if (
    (combat.combatant?.id ?? null) !== (turn >= 0 ? desiredId : null)
    || combat.round !== snapshot.round
  ) {
    await combat.update(
      { round: snapshot.round, turn: turn >= 0 ? turn : null },
      { turnEvents: false },
    );
  }
  if (
    (combat.combatant?.id ?? null) !== (turn >= 0 ? desiredId : null)
    || combat.round !== snapshot.round
  ) {
    throw new Error("native summon Combat mutation changed the active cursor");
  }
}

async function nativeSummonMutateCombatPreservingCursor(combat, operation) {
  const snapshot = nativeSummonCombatCursor(combat);
  let result;
  let operationError = null;
  try {
    result = await operation(snapshot);
  } catch (error) {
    operationError = error;
  }
  let restoreError = null;
  try {
    await nativeSummonRestoreCombatCursor(
      combat,
      snapshot,
      result?.cursorReplacementCombatantId ?? null,
    );
  } catch (error) {
    restoreError = error;
  }
  if (operationError && restoreError) {
    throw new AggregateError(
      [operationError, restoreError],
      "native summon Combat mutation and cursor restoration both failed",
    );
  }
  if (operationError) throw operationError;
  if (restoreError) throw restoreError;
  return result;
}

function nativeSummonCombatantsForToken(combat, token) {
  return Array.from(combat?.combatants ?? []).filter(combatant =>
    String(combatant.sceneId ?? combat.scene?.id ?? "") === String(token?.parent?.id ?? "")
      && String(combatant.tokenId ?? "") === String(token?.id ?? "")
  );
}

async function nativeSummonEnsureCombatants(record, combat, tokens) {
  const updates = [];
  const creates = [];
  for (let memberIndex = 0; memberIndex < tokens.length; memberIndex += 1) {
    const token = tokens[memberIndex];
    const elsewhere = Array.from(game.combats ?? []).flatMap(candidate =>
      candidate.uuid === combat.uuid
        ? []
        : nativeSummonCombatantsForToken(candidate, token)
    );
    if (elsewhere.length) {
      throw new Error("native summon Token already belongs to another Combat");
    }
    const matches = nativeSummonCombatantsForToken(combat, token);
    if (matches.length > 1) {
      throw new Error("native summon Token has duplicate Combatants");
    }
    const sidecar = {
      requestId: record.requestId,
      memberIndex,
      tokenUuid: token.uuid,
    };
    if (matches.length === 1) {
      updates.push({
        _id: matches[0].id,
        initiative: record.inheritedInitiative,
        ["flags." + MODULE_ID + ".nativeSummon"]: sidecar,
      });
    } else {
      creates.push({
        tokenId: token.id,
        sceneId: token.parent.id,
        actorId: token.actorId,
        name: token.name,
        img: token.texture?.src,
        hidden: token.hidden,
        initiative: record.inheritedInitiative,
        flags: { [MODULE_ID]: { nativeSummon: sidecar } },
      });
    }
  }
  if (updates.length) {
    await combat.updateEmbeddedDocuments("Combatant", updates, { turnEvents: false });
  }
  if (creates.length) {
    await combat.createEmbeddedDocuments("Combatant", creates, { turnEvents: false });
  }
  return tokens.map(token => {
    const matches = nativeSummonCombatantsForToken(combat, token);
    if (
      matches.length !== 1
      || Number(matches[0].initiative) !== record.inheritedInitiative
    ) {
      throw new Error("native summon did not produce one exact-initiative Combatant per Token");
    }
    return matches[0];
  });
}

function nativeSummonReplacementTokens(record, tokens) {
  if (
    record.contract.marker.uniqueness?.enforcement !== "replace-after-create"
    || tokens.length === 0
  ) return [];
  const current = new Set(tokens.map(token => token.uuid));
  return nativeSummonOwnedTokens((provenance, token) =>
    !current.has(token.uuid)
      && provenance.requestId !== record.requestId
      && provenance.sourceActorUuid === record.sourceActorUuid
      && provenance.sourceItemUuid === record.sourceItemUuid
      && provenance.artifactId === record.contract.marker.artifactId
  );
}

async function nativeSummonDeleteReplacedTokens(replacements) {
  const byScene = new Map();
  for (const replacement of replacements) {
    const tokenIds = byScene.get(replacement.scene.uuid) ?? [];
    tokenIds.push(replacement.token.id);
    byScene.set(replacement.scene.uuid, tokenIds);
  }
  for (const [sceneUuid, tokenIds] of byScene) {
    const scene = await fromUuid(sceneUuid).catch(() => null);
    if (scene?.documentName !== "Scene") {
      throw new Error("native summon replacement Scene no longer resolves");
    }
    await scene.deleteEmbeddedDocuments("Token", tokenIds, {
      turnEvents: false,
      [MODULE_ID]: { nativeSummonReplace: true },
    });
  }
}

async function cleanupNativeSummonCombatantsForDeletedToken(token) {
  const activeGM = game.users?.activeGM;
  if (
    game.user?.isGM !== true
    || (activeGM && activeGM.id !== game.user.id)
  ) return;
  const provenance = token?.flags?.[MODULE_ID]?.nativeSummon ?? null;
  if (
    !provenance
    || typeof provenance.requestId !== "string"
    || !provenance.requestId.trim()
    || !Number.isInteger(provenance.memberIndex)
    || provenance.memberIndex < 0
    || typeof token?.uuid !== "string"
    || !token.uuid
  ) return;
  const groups = [];
  for (const combat of Array.from(game.combats ?? [])) {
    const combatants = nativeSummonCombatantsForToken(combat, token);
    if (!combatants.length) continue;
    for (const combatant of combatants) {
      const sidecar = combatant.flags?.[MODULE_ID]?.nativeSummon;
      if (
        !sidecar
        || sidecar.requestId !== provenance.requestId
        || sidecar.memberIndex !== provenance.memberIndex
        || sidecar.tokenUuid !== token.uuid
      ) {
        throw new Error("deleted native summon Token has a drifted Combatant sidecar");
      }
    }
    groups.push({ combat, combatants });
  }
  for (const { combat, combatants } of groups) {
    await nativeSummonMutateCombatPreservingCursor(
      combat,
      () => combat.deleteEmbeddedDocuments(
        "Combatant",
        combatants.map(combatant => combatant.id),
        { turnEvents: false },
      ),
    );
  }
  const remaining = Array.from(game.combats ?? []).flatMap(combat =>
    nativeSummonCombatantsForToken(combat, token)
  );
  if (remaining.length) {
    throw new Error("deleted native summon Token retained an orphan Combatant");
  }
}

async function finalizeNativeSummonCore(record, input) {
  if (!record.postSummonSeen || !record.postUseSeen) {
    throw new Error("native summon finalizer may only consume the exact postUseActivity result");
  }
  const tokens = await nativeSummonResolveCreatedTokens(record, input.createdTokenUuids);
  await nativeSummonApplyOwnershipAndProvenance(record, tokens);
  const lifecycle = await nativeSummonBindLifecycle(record, tokens);
  const combat = await fromUuid(record.combatUuid).catch(() => null);
  if (
    combat?.documentName !== "Combat"
    || combat.active !== true
    || (
      tokens.length > 0
      && combat.scene?.uuid !== tokens[0]?.parent?.uuid
    )
  ) {
    throw new Error("native summon active Combat no longer matches the returned Token batch");
  }
  const replacements = nativeSummonReplacementTokens(record, tokens);
  const mutation = await nativeSummonMutateCombatPreservingCursor(
    combat,
    async snapshot => {
      const combatants = await nativeSummonEnsureCombatants(record, combat, tokens);
      const replacedCombatants = replacements.flatMap(replacement =>
        replacement.scene?.uuid === combat.scene?.uuid
          ? nativeSummonCombatantsForToken(combat, replacement.token)
          : []
      );
      if (replacedCombatants.length) {
        await combat.deleteEmbeddedDocuments(
          "Combatant",
          [...new Set(replacedCombatants.map(combatant => combatant.id))],
          { turnEvents: false },
        );
      }
      return {
        combatants,
        cursorReplacementCombatantId: replacedCombatants.some(combatant =>
          combatant.id === snapshot.currentId
        ) ? combatants[0]?.id ?? null : null,
      };
    },
  );
  const otherCombatants = [];
  for (const replacement of replacements) {
    for (const candidate of game.combats ?? []) {
      if (candidate.uuid === combat.uuid) continue;
      for (const combatant of nativeSummonCombatantsForToken(candidate, replacement.token)) {
        otherCombatants.push({ combat: candidate, combatant });
      }
    }
  }
  const otherCombatantsByCombat = new Map();
  for (const entry of otherCombatants) {
    const entries = otherCombatantsByCombat.get(entry.combat.uuid) ?? [];
    entries.push(entry);
    otherCombatantsByCombat.set(entry.combat.uuid, entries);
  }
  for (const entries of otherCombatantsByCombat.values()) {
    const otherCombat = entries[0].combat;
    await nativeSummonMutateCombatPreservingCursor(
      otherCombat,
      () => otherCombat.deleteEmbeddedDocuments(
        "Combatant",
        entries.map(entry => entry.combatant.id),
        { turnEvents: false },
      ),
    );
  }
  await nativeSummonDeleteReplacedTokens(replacements);
  const placedCount = tokens.length;
  const expectedCount = record.contract.expectedCount;
  const outcome = placedCount === expectedCount
    ? "placed"
    : placedCount === 0 ? "skipped-manual" : "partial-manual";
  const receipt = {
    kind: "native-summon",
    humanStep: "native-summon-placement",
    outcome,
    requestId: record.requestId,
    activityUuid: record.activityUuid,
    artifactId: record.contract.marker.artifactId,
    choice: record.contract.marker.choice,
    profileId: record.contract.marker.profileId,
    expectedCount,
    placedCount,
    skippedCount: expectedCount - placedCount,
    workflowUuid: String(input.workflowUuid ?? "").trim() || null,
    messageUuid: String(input.messageUuid ?? record.messageUuid ?? "").trim() || null,
    members: tokens.map((token, memberIndex) => ({
      memberIndex,
      tokenUuid: token.uuid,
      combatantUuid: mutation.combatants[memberIndex]?.uuid ?? null,
    })),
    sourceCombatantUuid: record.sourceCombatantUuid,
    inheritedInitiative: record.inheritedInitiative,
    lifecycle,
    retry: false,
  };
  record.receipt = foundry.utils.deepClone(receipt);
  globalThis.setTimeout(() => {
    if (NATIVE_SUMMON_INVOCATIONS.get(record.requestId)?.receipt) {
      NATIVE_SUMMON_INVOCATIONS.delete(record.requestId);
    }
  }, 2 * 60 * 1000);
  return receipt;
}

function finalizeNativeSummonUse(input) {
  const requestId = nativeSummonRequestId(input?.requestId);
  const record = NATIVE_SUMMON_INVOCATIONS.get(requestId);
  if (!record) throw new Error("native summon finalizer cannot resolve its invocation");
  nativeSummonValidateFinalizeInput(input, record);
  if (record.receipt) return Promise.resolve(foundry.utils.deepClone(record.receipt));
  if (record.finalizePromise) return record.finalizePromise;
  const promise = finalizeNativeSummonCore(record, input);
  record.finalizePromise = promise;
  promise.catch(() => {
    if (record.finalizePromise === promise && !record.receipt) {
      record.finalizePromise = null;
    }
  });
  return promise;
}

function nativeSummonControlActionContract(activity) {
  const value = activity?.flags?.[MODULE_ID]?.nativeSummonControlAction;
  if (value === undefined || value === null) return null;
  if (
    !value
    || typeof value !== "object"
    || Array.isArray(value)
    || JSON.stringify(Object.keys(value).sort())
      !== JSON.stringify([
        "artifactId",
        "contractId",
        "durationSeconds",
        "expiry",
        "maximumTargets",
        "minimumTargets",
        "operation",
        "range",
        "version",
      ])
    || Number(value.version) !== NATIVE_SUMMON_CONTROL_VERSION
    || value.operation !== "reassert"
    || !String(value.artifactId ?? "").trim()
    || !String(value.contractId ?? "").trim()
    || Number(value.durationSeconds) !== 24 * 60 * 60
    || value.expiry !== "release-control-keep-entity"
    || Number(value.minimumTargets) !== 1
    || Number(value.maximumTargets) !== 3
    || Number(value.range?.distance) !== 10
    || value.range?.units !== "ft"
  ) {
    throw new Error("native summon control action marker is outside the closed contract");
  }
  return value;
}

function activeNativeSummonControlEffect(actor, expected) {
  const matches = Array.from(actor?.effects ?? []).filter(effect => {
    if (
      effect.disabled === true
      || effect.active === false
      || effect.isSuppressed === true
    ) return false;
    const contract = nativeSummonControlEffectContract(effect);
    return Boolean(
      contract
      && contract.contractId === expected.contractId
      && contract.controllerActorUuid === expected.controllerActorUuid
      && contract.sourceItemUuid === expected.sourceItemUuid
      && contract.artifactId === expected.artifactId
      && contract.tokenUuid === expected.tokenUuid
    );
  });
  return matches.length === 1 ? matches[0] : null;
}

function nativeSummonControlTargetUuid(target) {
  return String(target?.document?.uuid ?? target?.uuid ?? "").trim();
}

function nativeSummonControlPreflightBlock(message, error = null) {
  return {
    kind: "native-summon-control",
    effectName: "Create Undead Control",
    message,
    error,
  };
}

function guardNativeSummonControlAction(actor, item, activity, workflow, usageConfig = null) {
  let contract;
  try {
    contract = nativeSummonControlActionContract(activity);
  } catch (error) {
    return nativeSummonControlPreflightBlock(error.message, error);
  }
  if (!contract) return null;
  if (!isPrimaryAutomationGM()) {
    return nativeSummonControlPreflightBlock(
      "Reassert Control must execute in the primary active GM session.",
    );
  }
  const sourceActor = actor ?? workflow?.actor ?? item?.actor;
  const semanticActionId = workflowSemanticActionId(workflow)
    ?? activity?.flags?.[MODULE_ID]?.semanticActionId;
  const rules = compilerRuntimeRulesForAdapter(
    item,
    "native-summon-control-v1",
  ).filter(rule =>
    rule.trigger === "action-used"
    && (!rule.sourceActionId || rule.sourceActionId === semanticActionId)
  );
  if (!sourceActor?.uuid || rules.length !== 1) {
    return nativeSummonControlPreflightBlock(
      "Reassert Control could not resolve its exact compiler rule and source Actor.",
    );
  }
  const sourceToken = nativeSummonTokenDocument(workflow?.token)
    ?? nativeSummonTokenDocument(activity?.getUsageToken?.())
    ?? findSourceToken(sourceActor);
  const rawTargets = targetsFromUseConfig(workflow, usageConfig)
    .filter(target => target?.actor && nativeSummonControlTargetUuid(target));
  const rawTargetUuids = rawTargets.map(nativeSummonControlTargetUuid);
  if (new Set(rawTargetUuids).size !== rawTargetUuids.length) {
    return nativeSummonControlPreflightBlock(
      "Reassert Control cannot target the same Ghoul more than once.",
    );
  }
  const targets = Array.from(new Map(
    rawTargets.map(target => [nativeSummonControlTargetUuid(target), target]),
  ).values());
  if (
    !sourceToken
    || targets.length < Number(contract.minimumTargets)
    || targets.length > Number(contract.maximumTargets)
  ) {
    return nativeSummonControlPreflightBlock(
      "Reassert Control requires one source Token and 1–3 unique Ghoul targets.",
    );
  }
  const members = [];
  for (const target of targets) {
    const targetToken = nativeSummonTokenDocument(target)
      ?? nativeSummonTokenDocument(target?.document);
    const provenance = nativeSummonProvenance(targetToken);
    const tokenUuid = nativeSummonControlTargetUuid(targetToken);
    if (
      !targetToken
      || !provenance
      || provenance.sourceActorUuid !== sourceActor.uuid
      || provenance.sourceItemUuid !== item?.uuid
      || provenance.artifactId !== contract.artifactId
      || provenance.controlContractId !== contract.contractId
      || provenance.lifecyclePolicy !== "retain-entity"
      || distanceBetweenTokenOccupancies(sourceToken.object ?? sourceToken, targetToken.object ?? targetToken)
        > Number(contract.range.distance)
    ) {
      return nativeSummonControlPreflightBlock(
        "Every Reassert Control target must be an eligible Ghoul from this caster and spell within 10 feet.",
      );
    }
    const effect = activeNativeSummonControlEffect(targetToken.actor, {
      contractId: contract.contractId,
      controllerActorUuid: sourceActor.uuid,
      sourceItemUuid: item.uuid,
      artifactId: contract.artifactId,
      tokenUuid,
    });
    if (!effect) {
      return nativeSummonControlPreflightBlock(
        "A Reassert Control target has no exact active Arcane control effect.",
      );
    }
    members.push({
      tokenUuid,
      actorUuid: targetToken.actor.uuid,
      effectUuid: effect.uuid,
      requestId: provenance.requestId,
      memberIndex: provenance.memberIndex,
    });
  }
  if (workflow && typeof workflow === "object") {
    const invocationId = String(
      workflow.__arcaneNativeSummonControlPreflight?.invocationId
      ?? foundry.utils.randomID(24),
    );
    workflow.__arcaneNativeSummonControlPreflight = Object.freeze({
      version: NATIVE_SUMMON_CONTROL_VERSION,
      invocationId,
      sourceActorUuid: sourceActor.uuid,
      sourceItemUuid: item.uuid,
      activityId: String(activity?.id ?? activity?._id ?? ""),
      ruleId: rules[0].id,
      contract: foundry.utils.deepClone(contract),
      members: foundry.utils.deepClone(members),
    });
  }
  return null;
}

function nativeSummonControlReceiptMap(actor) {
  const value = actor?.flags?.[MODULE_ID]?.[NATIVE_SUMMON_CONTROL_RECEIPTS_FLAG];
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

async function writeNativeSummonControlReceipt(actor, receipt) {
  await actor.update({
    [
      "flags." + MODULE_ID + "." + NATIVE_SUMMON_CONTROL_RECEIPTS_FLAG
      + "." + receipt.invocationId
    ]: foundry.utils.deepClone(receipt),
  });
  return receipt;
}

async function queueNativeSummonControlActor(actor, task) {
  const key = String(actor?.uuid ?? actor?.id ?? "actor");
  const previous = NATIVE_SUMMON_CONTROL_ACTOR_QUEUES.get(key)
    ?? Promise.resolve();
  const current = previous.catch(() => null).then(task);
  NATIVE_SUMMON_CONTROL_ACTOR_QUEUES.set(key, current);
  try {
    return await current;
  } finally {
    if (NATIVE_SUMMON_CONTROL_ACTOR_QUEUES.get(key) === current) {
      NATIVE_SUMMON_CONTROL_ACTOR_QUEUES.delete(key);
    }
  }
}

async function applyNativeSummonControlFromUse(item, usageConfig, workflow) {
  if (!workflow || workflow.aborted === true) return false;
  const activity = workflow.activity;
  if (!nativeSummonControlActionContract(activity)) return false;
  const sourceActor = workflow.actor ?? item?.actor;
  if (!sourceActor?.uuid) {
    throw new Error("Reassert Control could not resolve its source Actor.");
  }
  return queueNativeSummonControlActor(
    sourceActor,
    () => applyNativeSummonControlFromUseCore(item, usageConfig, workflow),
  );
}

async function applyNativeSummonControlFromUseCore(item, usageConfig, workflow) {
  if (!workflow || workflow.aborted === true) return false;
  const activity = workflow.activity;
  const contract = nativeSummonControlActionContract(activity);
  if (!contract) return false;
  const sourceActor = workflow.actor ?? item?.actor;
  const block = guardNativeSummonControlAction(
    sourceActor,
    item,
    activity,
    workflow,
    usageConfig,
  );
  if (block) throw block.error ?? new Error(block.message);
  const snapshot = workflow.__arcaneNativeSummonControlPreflight;
  const existing = nativeSummonControlReceiptMap(sourceActor)[snapshot.invocationId];
  if (existing?.status === "completed") {
    workflow.__arcaneNativeSummonControlReceipt = foundry.utils.deepClone(existing);
    return true;
  }
  const now = Number(game.time?.worldTime ?? 0);
  const receipt = existing && typeof existing === "object"
    ? foundry.utils.deepClone(existing)
    : {
        version: NATIVE_SUMMON_CONTROL_VERSION,
        kind: "native-summon-control",
        invocationId: snapshot.invocationId,
        status: "pending",
        sourceActorUuid: snapshot.sourceActorUuid,
        sourceItemUuid: snapshot.sourceItemUuid,
        activityId: snapshot.activityId,
        ruleId: snapshot.ruleId,
        artifactId: contract.artifactId,
        contractId: contract.contractId,
        startedWorldTime: now,
        completed: [],
        pending: snapshot.members.map(member => member.tokenUuid),
        retry: false,
      };
  await writeNativeSummonControlReceipt(sourceActor, receipt);
  for (const member of snapshot.members) {
    if (receipt.completed.some(entry => entry.tokenUuid === member.tokenUuid)) {
      continue;
    }
    const effect = await fromUuid(member.effectUuid).catch(() => null);
    const effectContract = nativeSummonControlEffectContract(effect);
    if (
      !effectContract
      || effect.parent?.uuid !== member.actorUuid
      || effectContract.tokenUuid !== member.tokenUuid
      || effectContract.contractId !== contract.contractId
      || effectContract.controllerActorUuid !== sourceActor.uuid
      || effectContract.sourceItemUuid !== item.uuid
      || effectContract.artifactId !== contract.artifactId
    ) {
      receipt.status = "partial";
      receipt.retry = false;
      receipt.error = "control-effect-drift:" + member.tokenUuid;
      await writeNativeSummonControlReceipt(sourceActor, receipt);
      workflow.__arcaneNativeSummonControlReceipt = foundry.utils.deepClone(receipt);
      throw new Error("Reassert Control lost an exact target control effect after consumption");
    }
    await effect.update({
      ["flags." + MODULE_ID + ".nativeSummonControl.lastInvocationId"]:
        snapshot.invocationId,
    });
    receipt.completed.push({
      tokenUuid: member.tokenUuid,
      actorUuid: member.actorUuid,
      effectUuid: member.effectUuid,
      requestId: member.requestId,
      memberIndex: member.memberIndex,
    });
    receipt.pending = receipt.pending.filter(uuid => uuid !== member.tokenUuid);
    await writeNativeSummonControlReceipt(sourceActor, receipt);
  }
  receipt.status = "completed";
  receipt.completedWorldTime = Number(game.time?.worldTime ?? now);
  receipt.retry = false;
  await writeNativeSummonControlReceipt(sourceActor, receipt);
  workflow.__arcaneNativeSummonControlReceipt = foundry.utils.deepClone(receipt);
  workflow.flags ??= {};
  workflow.flags[MODULE_ID] = {
    ...(workflow.flags[MODULE_ID] ?? {}),
    nativeSummonControlReceipt: foundry.utils.deepClone(receipt),
  };
  return true;
}

function queueNativeSummonLifecycle(effectUuid, task) {
  const key = String(effectUuid ?? "");
  const previous = NATIVE_SUMMON_LIFECYCLE_TASKS.get(key) ?? Promise.resolve();
  const current = previous.catch(() => null).then(task);
  NATIVE_SUMMON_LIFECYCLE_TASKS.set(key, current);
  current.finally(() => {
    if (NATIVE_SUMMON_LIFECYCLE_TASKS.get(key) === current) {
      NATIVE_SUMMON_LIFECYCLE_TASKS.delete(key);
    }
  });
  return current;
}

async function deleteNativeSummonEntityLifecycle(effect, reason) {
  const contract = nativeSummonEntityLifecycleContract(effect);
  if (
    !contract
    || effect.parent?.uuid !== contract.sourceActorUuid
    || !isPrimaryAutomationGM()
  ) return false;
  return queueNativeSummonLifecycle(effect.uuid, async () => {
    const current = await fromUuid(effect.uuid).catch(() => null);
    if (!nativeSummonEntityLifecycleContract(current)) return true;
    await current.delete({
      [MODULE_ID]: {
        nativeSummonLifecycleCleanup: true,
        reason,
        requestId: contract.requestId,
      },
    });
    return true;
  });
}

async function cleanupNativeSummonLifecycleForDeletedToken(token) {
  const provenance = token?.flags?.[MODULE_ID]?.nativeSummon ?? null;
  const effectUuid = String(provenance?.lifecycleEffectUuid ?? "").trim();
  if (
    !effectUuid
    || provenance?.lifecyclePolicy !== "long-rest-or-defeat-or-dismiss"
    || NATIVE_SUMMON_LIFECYCLE_DELETIONS.has(effectUuid)
    || !isPrimaryAutomationGM()
  ) return true;
  const effect = await fromUuid(effectUuid).catch(() => null);
  const contract = nativeSummonEntityLifecycleContract(effect);
  if (
    !contract
    || contract.requestId !== provenance.requestId
    || !contract.memberTokenUuids.includes(token.uuid)
  ) return true;
  await deleteNativeSummonEntityLifecycle(effect, "dm-dismiss-token");
  return true;
}

async function cleanupNativeSummonChildrenForDeletedToken(token) {
  if (!isPrimaryAutomationGM()) return true;
  const parentTokenUuid = String(token?.uuid ?? "").trim();
  if (!parentTokenUuid) return true;
  const byScene = new Map();
  for (const scene of Array.from(game.scenes ?? [])) {
    const tokenIds = [];
    for (const child of Array.from(scene?.tokens ?? [])) {
      const provenance = nativeSummonProvenance(child);
      if (provenance?.parentTokenUuid !== parentTokenUuid) continue;
      const tokenId = String(child?.id ?? "").trim();
      if (tokenId) tokenIds.push(tokenId);
    }
    if (tokenIds.length) byScene.set(scene, [...new Set(tokenIds)]);
  }
  for (const [scene, tokenIds] of byScene) {
    try {
      await scene.deleteEmbeddedDocuments("Token", tokenIds);
    } catch (_error) {
      // A concurrent deletion already removed the child Token batch.
    }
  }
  return true;
}

async function nativeSummonLifecycleEffectForMember(provenance, tokenUuid) {
  const effectUuid = String(provenance?.lifecycleEffectUuid ?? "").trim();
  const memberTokenUuid = String(tokenUuid ?? "").trim();
  if (
    !effectUuid
    || !memberTokenUuid
    || provenance?.lifecyclePolicy !== "long-rest-or-defeat-or-dismiss"
  ) return null;
  const effect = await fromUuid(effectUuid).catch(() => null);
  const contract = nativeSummonEntityLifecycleContract(effect);
  if (
    !contract
    || contract.requestId !== provenance.requestId
    || contract.artifactId !== provenance.artifactId
    || contract.sourceActorUuid !== provenance.sourceActorUuid
    || contract.sourceTokenUuid !== provenance.sourceTokenUuid
    || contract.sourceItemUuid !== provenance.sourceItemUuid
    || contract.choice !== provenance.choice
    || contract.profileId !== provenance.profileId
    || !contract.memberTokenUuids.includes(memberTokenUuid)
  ) return null;
  return effect;
}

async function cleanupNativeSummonLifecycleForDefeatedActor(actor) {
  if (!actor || !isPrimaryAutomationGM()) return true;
  const provenance = actor.flags?.[MODULE_ID]?.nativeSummon;
  if (provenance?.lifecyclePolicy !== "long-rest-or-defeat-or-dismiss") {
    return true;
  }
  const hp = Number(actor.system?.attributes?.hp?.value);
  const statuses = actor.statuses instanceof Set
    ? actor.statuses
    : new Set(actor.statuses ?? []);
  if ((Number.isFinite(hp) && hp > 0) && !statuses.has("dead")) return true;
  const tokenUuid = String(
    actor.token?.uuid
      ?? actor.parent?.uuid
      ?? "",
  ).trim();
  const effect = await nativeSummonLifecycleEffectForMember(
    provenance,
    tokenUuid,
  );
  await deleteNativeSummonEntityLifecycle(effect, "ally-defeated");
  return true;
}

async function cleanupNativeSummonLifecycleForDefeatedCombatant(combatant) {
  if (combatant?.isDefeated !== true || !isPrimaryAutomationGM()) return true;
  const token = combatant.token;
  const provenance = nativeSummonProvenance(token);
  if (provenance?.lifecyclePolicy !== "long-rest-or-defeat-or-dismiss") {
    return true;
  }
  const effect = await nativeSummonLifecycleEffectForMember(
    provenance,
    token?.uuid,
  );
  await deleteNativeSummonEntityLifecycle(effect, "ally-defeated");
  return true;
}

function nativeSummonControlSourceUuids(actor) {
  const uuids = new Set();
  const add = value => {
    const text = String(value ?? "").trim();
    if (text) uuids.add(text);
  };
  add(actor?.uuid);
  add(actor?.parent?.uuid);
  add(actor?.token?.uuid);
  add(actor?.token?.actor?.uuid);
  const tokenUuid = String(actor?.token?.uuid ?? "").trim();
  if (tokenUuid) {
    add(
      tokenUuid + ".Actor." + String(
        actor?.token?.actorId ?? actor?.token?.actor?.id ?? actor?.id ?? "",
      ),
    );
  }
  const actorId = String(actor?.id ?? "").trim();
  for (const scene of Array.from(game.scenes ?? [])) {
    for (const token of Array.from(scene?.tokens ?? [])) {
      const tokenActor = token?.actor ?? null;
      if (
        (actorId && String(token?.actorId ?? "") === actorId)
        || (actor?.uuid && String(tokenActor?.uuid ?? "") === String(actor.uuid))
      ) {
        add(token?.uuid);
        add(tokenActor?.uuid);
        if (token?.uuid) {
          add(
            String(token.uuid) + ".Actor." + String(
              token?.actorId ?? tokenActor?.id ?? "",
            ),
          );
        }
      }
    }
  }
  return uuids;
}

function nativeSummonControlSourceMatches(provenance, sourceUuids) {
  const sourceActorUuid = String(provenance?.sourceActorUuid ?? "").trim();
  const sourceTokenUuid = String(provenance?.sourceTokenUuid ?? "").trim();
  return Boolean(
    (sourceActorUuid && sourceUuids.has(sourceActorUuid))
    || (sourceTokenUuid && sourceUuids.has(sourceTokenUuid))
  );
}

async function releaseNativeSummonControlCore(actor) {
  const sourceUuids = nativeSummonControlSourceUuids(actor);
  const retained = nativeSummonOwnedTokens((provenance, token) =>
    provenance.lifecyclePolicy === "retain-entity"
    && String(provenance.controlContractId ?? "").trim()
    && nativeSummonControlSourceMatches(provenance, sourceUuids)
  );
  for (const { token, provenance } of retained) {
    const tokenActor = token?.actor;
    if (!tokenActor) continue;
    const contractId = String(provenance.controlContractId ?? "").trim();
    const requestId = String(provenance.requestId ?? "").trim();
    const effects = Array.from(tokenActor.effects ?? []).filter(effect => {
      const contract = nativeSummonControlEffectContract(effect);
      return Boolean(
        contract
        && contract.contractId === contractId
        && (!requestId || contract.requestId === requestId)
        && contract.tokenUuid === token.uuid
        && contract.controllerActorUuid === provenance.sourceActorUuid
        && contract.sourceItemUuid === provenance.sourceItemUuid
        && contract.artifactId === provenance.artifactId
      );
    });
    if (effects.length) {
      await tokenActor.deleteEmbeddedDocuments(
        "ActiveEffect",
        effects.map(effect => effect.id),
      );
    }
    if (tokenActor.isToken === true) {
      const current = tokenActor.ownership ?? tokenActor._source?.ownership ?? {};
      const ownership = { default: 0 };
      let changed = Number(current.default ?? 0) !== 0;
      for (const userId of Object.keys(current)) {
        if (userId === "default") continue;
        ownership[userId] = 0;
        if (Number(current[userId] ?? 0) !== 0) changed = true;
      }
      if (changed) await tokenActor.update({ ownership });
    }
  }
  return true;
}

async function releaseNativeSummonControlOnLongRest(actor) {
  if (!actor || !isPrimaryAutomationGM()) return true;
  return queueNativeSummonControlActor(
    actor,
    () => releaseNativeSummonControlCore(actor),
  );
}

async function cleanupNativeSummonLifecycleOnLongRest(actor, result) {
  if (
    (result?.type !== "long" && result?.longRest !== true)
    || !isPrimaryAutomationGM()
  ) return true;
  await releaseNativeSummonControlOnLongRest(actor);
  const effects = Array.from(actor?.effects ?? []).filter(effect => {
    const contract = nativeSummonEntityLifecycleContract(effect);
    return contract?.sourceActorUuid === actor.uuid;
  });
  for (const effect of effects) {
    await deleteNativeSummonEntityLifecycle(effect, "source-long-rest");
  }
  return true;
}

async function recoverNativeSummonEntityLifecycles() {
  if (!isPrimaryAutomationGM()) return true;
  const actors = new Map();
  for (const scene of Array.from(game.scenes ?? [])) {
    for (const token of Array.from(scene?.tokens ?? [])) {
      if (token?.actor?.uuid) actors.set(token.actor.uuid, token.actor);
    }
  }
  for (const token of Array.from(canvas.tokens?.placeables ?? [])) {
    if (token?.actor?.uuid) actors.set(token.actor.uuid, token.actor);
  }
  await Promise.all(
    Array.from(actors.values()).map(actor =>
      cleanupNativeSummonLifecycleForDefeatedActor(actor)
    ),
  );
  return true;
}

async function applyTargetStatusRemovalFromUse(item, usageConfig, workflow) {
  const rules = compilerRuntimeRulesForAdapter(item, "target-status-removal-v1");
  if (!rules.length) return false;
  const operations = rules.flatMap(rule => rule.operations ?? []).filter(operation =>
    operation.type === "remove-statuses"
    || (
      operation.type === "emit-event"
      && operation.event === "remove-statuses"
    )
  );
  if (!operations.length) {
    throw new Error("target-status-removal-v1 requires a remove-statuses operation");
  }
  const statuses = [...new Set(operations.flatMap(operation => operation.statuses ?? []))];
  if (!statuses.length) {
    throw new Error("target-status-removal-v1 requires at least one status");
  }
  await removeStatusesFromTargets(item, usageConfig, workflow, statuses);
  return true;
}

async function applyRestorationSpellAutomation(item, usageConfig, workflow) {
  const identifier = item?.system?.identifier;
  if (!workflow || workflow.aborted === true) return true;
  if (await applyTargetStatusRemovalFromUse(item, usageConfig, workflow)) return true;
  const compilerManaged = Boolean(item?.flags?.[MODULE_ID]?.compiler?.version);
  if (
    compilerManaged
    && ["lesser-restoration", "protection-from-poison"].includes(identifier)
  ) {
    throw new Error(identifier + " compiler output is missing target-status-removal-v1");
  }
  if (identifier === "lesser-restoration") {
    return removeStatusesFromTargets(item, usageConfig, workflow, ["blinded", "deafened", "paralyzed", "poisoned"]);
  }
  if (identifier === "protection-from-poison") {
    return removeStatusesFromTargets(item, usageConfig, workflow, ["poisoned"]);
  }
  return true;
}

function simpleSpellEffectData(item, actor, { name, img, durationSeconds = null, changes = [], flags = {} }) {
  const extraFlags = Object.fromEntries(
    Object.entries(flags ?? {}).filter(([key]) => key !== MODULE_ID)
  );
  return {
    name,
    type: "base",
    img: img ?? item?.img ?? "icons/svg/aura.svg",
    origin: item?.uuid,
    transfer: false,
    disabled: false,
    duration: {
      seconds: durationSeconds,
      rounds: durationSeconds ? Math.ceil(durationSeconds / 6) : null,
      turns: null,
    },
    statuses: [],
    changes,
    flags: {
      ...extraFlags,
      [MODULE_ID]: {
        ...(flags[MODULE_ID] ?? {}),
        sourceActorUuid: actor?.uuid,
        identifier: item?.system?.identifier,
      },
    },
    system: {},
  };
}

async function applyEffectDataToTokens(tokens, effectData) {
  for (const token of tokens) {
    if (!token?.actor) continue;
    const stackable = effectData.flags?.dae?.stackable ?? "";
    const existing = Array.from(token.actor.effects ?? []).filter(effect => {
      if (stackable === "multi") return false;
      if (stackable === "none") {
        return Boolean(effectData.origin && effect.origin === effectData.origin);
      }
      if (effect.name !== effectData.name) return false;
      if (stackable === "noneName") {
        return Boolean(effectData.origin && effect.origin === effectData.origin);
      }
      return true;
    });
    if (existing.length) await token.actor.deleteEmbeddedDocuments("ActiveEffect", existing.map(effect => effect.id));
    await token.actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
  }
}

async function removeEffectsFromTargets(tokens, predicate) {
  for (const token of tokens) {
    const actor = token?.actor;
    if (!actor) continue;
    const removable = Array.from(actor.effects ?? [])
      .filter(effect => predicate(effect, actor))
      .map(effect => effect.id);
    if (removable.length) await actor.deleteEmbeddedDocuments("ActiveEffect", removable);
  }
}

function failedSaveTargets(workflow, usageConfig) {
  const failed = Array.from(workflow?.failedSaves ?? []);
  if (failed.length) return failed;
  return targetsFromUseConfig(workflow, usageConfig);
}

async function applySimpleSpellMarkerAutomation(item, usageConfig, workflow) {
  const identifier = item?.system?.identifier;
  const actor = workflow?.actor ?? item?.actor;
  if (!identifier || !actor) return true;

  const markerSpecs = {
    "compelled-duel": { name: "Compelled Duel", durationSeconds: 60 },
    "antagonize": { name: "Antagonize", durationSeconds: 6 },
  };
  if (markerSpecs[identifier]) {
    const targets = failedSaveTargets(workflow, usageConfig);
    if (!targets.length) return true;
    await applyEffectDataToTokens(targets, simpleSpellEffectData(item, actor, markerSpecs[identifier]));
    return true;
  }

  return true;
}

async function updateActorHp(actor, delta) {
  const hp = actor?.system?.attributes?.hp;
  if (!actor || !hp) return { oldHP: 0, newHP: 0, hpDamage: 0 };
  const oldHP = Number(hp.value ?? 0);
  const maxHP = Number(hp.max ?? oldHP);
  const newHP = Math.max(0, Math.min(maxHP, oldHP + delta));
  await actor.update({ "system.attributes.hp.value": newHP });
  return { oldHP, newHP, hpDamage: oldHP - newHP };
}

async function rollDamageToTargets(targets, formula) {
  const roll = await new Roll(formula).evaluate();
  const damage = Number(roll.total ?? 0);
  const damageList = [];
  for (const target of targets) damageList.push(await updateActorHp(target.actor, -damage));
  return { damage, damageList };
}

async function applyVampiricTouchHealingFromUse(item, usageConfig, workflow) {
  if (item?.system?.identifier !== "vampiric-touch") return true;
  // Compiler-owned Vampiric Touch heals via the generic
  // damage-mirror-heal-source-v1 adapter; keep this legacy handler for
  // pre-compiler embedded copies only.
  if (item?.flags?.[MODULE_ID]?.spellAutomation?.source === "compiler") return true;
  const actor = workflow?.actor ?? item?.actor;
  if (!actor) return true;
  const healed = (workflow?.damageList ?? [])
    .map(entry => Number(entry?.hpDamage ?? 0))
    .filter(value => value > 0)
    .reduce((sum, value) => sum + Math.floor(value / 2), 0);
  if (healed > 0) await updateActorHp(actor, healed);
  return true;
}

async function applyVigilantBlessingFromUse(item, usageConfig, workflow) {
  if (item?.system?.identifier !== VIGILANT_BLESSING_IDENTIFIER) return true;
  return applyFirstEffectToTargets(item, usageConfig, workflow, effect => effect.getFlag?.(MODULE_ID, "vigilantBlessing"));
}

function tokenMatchesActor(token, actor) {
  if (!token || !actor) return false;
  if (token.actor?.uuid === actor.uuid) return true;
  if (token.actor?.id === actor.id) return true;
  if (token.document?.actorId === actor.id) return true;
  return false;
}

function findSourceToken(actor) {
  const tokenDocument = actor?.token;
  const exactToken = tokenDocument?.object
    ?? (tokenDocument?.id ? canvas.tokens?.get(tokenDocument.id) : null);
  if (exactToken) return exactToken;
  const exactUuidToken = canvas.tokens?.placeables?.find(candidate => candidate.actor?.uuid === actor?.uuid);
  if (exactUuidToken) return exactUuidToken;
  return canvas.tokens?.placeables?.find(candidate => tokenMatchesActor(candidate, actor));
}

function twilightSanctuaryRingName(effectId) {
  return TWILIGHT_SANCTUARY_RING_NAME_PREFIX + effectId;
}

async function playTwilightSanctuaryRing(token, effectId) {
  if (!token || !effectId) return;
  if (!globalThis.Sequence || !globalThis.Sequencer?.EffectManager) return;
  const gridDistance = canvas.scene?.grid?.distance || 5;
  const diameterGrids = (TWILIGHT_SANCTUARY_RADIUS_FEET / gridDistance) * 2;
  const name = twilightSanctuaryRingName(effectId);
  try {
    await Sequencer.EffectManager.endEffects({ name });
    await new Sequence()
      .effect()
      .file(TWILIGHT_SANCTUARY_RING_FILE)
      .attachTo(token)
      .persist()
      .name(name)
      .size({ width: diameterGrids, height: diameterGrids }, { gridUnits: true })
      .opacity(0.75)
      .tint(TWILIGHT_SANCTUARY_RING_TINT)
      .fadeIn(250)
      .fadeOut(700)
      .play();
  } catch (error) {
    console.warn("[" + MODULE_ID + "] Twilight Sanctuary ring animation failed", error);
  }
}

function endTwilightSanctuaryRing(effectId) {
  if (!effectId || !globalThis.Sequencer?.EffectManager) return;
  try {
    Sequencer.EffectManager.endEffects({ name: twilightSanctuaryRingName(effectId) }).catch(() => {});
  } catch (_error) {}
}

async function applyTwilightSanctuaryFromUse(item, usageConfig, workflow) {
  if (item?.system?.identifier !== TWILIGHT_SANCTUARY_IDENTIFIER) return true;
  const actor = workflow?.actor ?? item.actor;
  if (!actor) return true;
  const token = findSourceToken(actor);
  if (!token) return true;
  const effectData = effectDataFromItem(item, effect => effect.getFlag?.(MODULE_ID, "twilightSanctuary"), actor);
  if (!effectData) return true;
  const effectActor = token.actor ?? actor;
  for (const target of workflow?.targets ?? []) {
    if (tokenMatchesActor(target, actor)) continue;
    const stray = Array.from(target?.actor?.effects ?? []).filter(effect =>
      effect.getFlag?.(MODULE_ID, "twilightSanctuary")
      && (effect.origin === item.uuid || effect.getFlag(MODULE_ID, "sourceActorUuid") === actor.uuid)
    );
    if (stray.length) await target.actor.deleteEmbeddedDocuments("ActiveEffect", stray.map(effect => effect.id));
  }
  // Recast refreshes the marker; this also keeps the dnd5e.postUseActivity and
  // midi completeItemUse entry points idempotent relative to each other.
  const stale = Array.from(effectActor.effects ?? []).filter(effect =>
    effect.getFlag?.(MODULE_ID, "twilightSanctuary")
    && (effect.origin === item.uuid || effect.getFlag(MODULE_ID, "sourceActorUuid") === actor.uuid)
  );
  if (stale.length) await effectActor.deleteEmbeddedDocuments("ActiveEffect", stale.map(effect => effect.id));
  const created = await effectActor.createEmbeddedDocuments("ActiveEffect", [effectData]);
  await playTwilightSanctuaryRing(token, created?.[0]?.id);
  return true;
}

async function applyTwilightSanctuaryFromActivityUse(activity, usageConfig) {
  const item = activity?.item;
  if (item?.system?.identifier !== TWILIGHT_SANCTUARY_IDENTIFIER) return true;
  const actor = activity?.actor ?? item.actor;
  return applyTwilightSanctuaryFromUse(item, usageConfig, { actor, targets: [] });
}

async function applyCountercharmFromUse(item, usageConfig, workflow) {
  if (item?.system?.identifier !== COUNTERCHARM_IDENTIFIER) return true;
  const actor = workflow?.actor ?? item.actor;
  if (!actor) return true;
  const token = findSourceToken(actor);
  if (!token) return true;
  const effectActor = token.actor ?? actor;
  const effectData = effectDataFromItem(item, effect => effect.getFlag?.(MODULE_ID, COUNTERCHARM_FLAG), effectActor);
  if (!effectData) return true;
  const existing = countercharmMarkerEffect(effectActor);
  if (existing) await effectActor.deleteEmbeddedDocuments("ActiveEffect", [existing.id]);
  await effectActor.createEmbeddedDocuments("ActiveEffect", [effectData]);
  return true;
}

function distanceBetweenTokens(a, b) {
  if (!a || !b) return Infinity;
  const gridDistance = canvas.grid?.measurePath
    ? canvas.grid.measurePath([a.center, b.center])?.distance
    : canvas.grid?.measureDistance?.(a.center, b.center);
  return Number.isFinite(gridDistance) ? gridDistance : Infinity;
}

function distanceBetweenTokenOccupancies(a, b) {
  if (!a || !b) return Infinity;
  const midiDistance = typeof MidiQOL?.computeDistance === "function"
    ? MidiQOL.computeDistance(a, b, {
        wallsBlock: false,
        includeCover: false,
      })
    : null;
  if (Number.isFinite(midiDistance) && midiDistance >= 0) {
    return midiDistance;
  }
  return distanceBetweenTokens(a, b);
}

function workflowCastLevel(item, usageConfig, workflow) {
  const baseLevel = Math.max(0, Number(item?.system?.level ?? 0) || 0);
  const slotMatch = /^spell([1-9])$/.exec(
    String(usageConfig?.spell?.slot ?? "").trim(),
  );
  const usageScaling = Number(usageConfig?.scaling);
  const candidates = [
    workflow?.castData?.castLevel,
    workflow?.options?.spellLevel,
    workflow?.workflowOptions?.spellLevel,
    usageConfig?.midiOptions?.spellLevel,
    usageConfig?.spellLevel,
    slotMatch?.[1],
    Number.isInteger(usageScaling) && usageScaling >= 0
      ? baseLevel + usageScaling
      : null,
    item?.system?.level,
  ];
  for (const candidate of candidates) {
    const level = Number(candidate);
    if (Number.isFinite(level) && level > 0) return Math.min(9, Math.max(Number(item?.system?.level ?? 1), level));
  }
  return Number(item?.system?.level ?? 1);
}

function parseCompilerSelectionCardinality(activity) {
  const interaction = activity?.getFlag?.(MODULE_ID, "interaction")
    ?? activity?.flags?.[MODULE_ID]?.interaction
    ?? null;
  const value = interaction?.selectionCardinality;
  if (value === undefined) return { cardinality: null, problem: null };
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      cardinality: null,
      problem: "interaction-selection-cardinality-invalid",
    };
  }
  const min = Number(value.min);
  const rawMax = value.max;
  const numericMax = typeof rawMax === "number"
    || (typeof rawMax === "string" && /^\d+$/.test(rawMax.trim()))
    ? Number(rawMax)
    : null;
  const textMax = typeof rawMax === "string"
    ? rawMax.replace(/\s+/g, "")
    : null;
  const formulaMax = typeof textMax === "string"
    && /^@item\.level(?:[+-]\d+)?$/.test(textMax)
    ? textMax
    : null;
  const max = numericMax ?? (textMax === "any" ? "any" : formulaMax);
  if (
    Number(value.version) !== 1
    || !Number.isInteger(min)
    || min < 0
    || max === null
    || (typeof max === "number" && (!Number.isInteger(max) || max < min))
    || value.countScope !== "explicit-selected"
  ) {
    return {
      cardinality: null,
      problem: "interaction-selection-cardinality-invalid",
    };
  }
  return {
    cardinality: {
      version: 1,
      min,
      max,
      countScope: "explicit-selected",
    },
    problem: null,
  };
}

function resolveCompilerSelectionCardinalityMaximum(cardinality, castLevel) {
  const max = cardinality?.max;
  if (max === "any") return null;
  if (Number.isInteger(max)) return Number(max);
  const formula = typeof max === "string" ? max.replace(/\s+/g, "") : "";
  const match = /^@item\.level(?:([+-])(\d+))?$/.exec(formula);
  const level = Number(castLevel);
  if (!match || !Number.isInteger(level) || level < 0 || level > 9) {
    throw compilerSelectionCardinalityFailure(
      "selectionCardinality.max could not be resolved for this cast level",
      "ACTION_MISCONFIGURED",
    );
  }
  const offset = match[2]
    ? Number(match[2]) * (match[1] === "-" ? -1 : 1)
    : 0;
  const resolved = level + offset;
  const minimum = Number(cardinality?.min);
  if (!Number.isInteger(resolved) || resolved < minimum) {
    throw compilerSelectionCardinalityFailure(
      "selectionCardinality.max resolves below its minimum",
      "ACTION_MISCONFIGURED",
    );
  }
  return resolved;
}

function compilerSelectionCardinalityFailure(message, code = "ACTION_BLOCKED") {
  const error = new Error(message);
  error.code = code;
  error.retry = false;
  error.arcaneActionRejectionCode = code;
  return error;
}

// dnd5e deep-clones Activity usage before preUse hooks. Publish the exact
// request identity so an agent caller can distinguish a pre-consumption block
// from an otherwise ambiguous completeItemUse(false) without sharing objects.
function publishArcaneActionPreflightRejection(
  activity,
  usageConfig,
  code,
  message,
) {
  const workflow = usageConfig?.workflow ?? null;
  const item = activity?.item ?? workflow?.item;
  const actor = activity?.actor ?? workflow?.actor ?? item?.actor;
  const workflowOptions = usageConfig?.midiOptions?.workflowOptions ?? {};
  const normalizedCode = code === "ACTION_BLOCKED"
    ? "ACTION_BLOCKED"
    : "ACTION_MISCONFIGURED";
  const normalizedMessage = String(
    message ?? "Arcane action preflight rejected the use",
  ).trim() || "Arcane action preflight rejected the use";
  const rejection = {
    code: normalizedCode,
    message: normalizedMessage,
  };
  if (usageConfig && typeof usageConfig === "object") {
    usageConfig.arcaneActionRejection = rejection;
  }
  const eventIdentity = {
    invocationId: String(
      workflowOptions.arcaneActionInvocationId
        ?? usageConfig?.arcaneActionInvocationId
        ?? "",
    ).trim(),
    activityUuid: String(activity?.uuid ?? "").trim(),
    sourceItemUuid: String(item?.uuid ?? "").trim(),
    sourceActorUuid: String(actor?.uuid ?? "").trim(),
    sourceTokenUuid: String(
      workflowOptions.sourceTokenUuid
        ?? workflow?.token?.document?.uuid
        ?? workflow?.token?.uuid
        ?? "",
    ).trim(),
  };
  if (Object.values(eventIdentity).every(Boolean)) {
    Hooks.callAll(MODULE_ID + ".actionPreflightRejected", {
      version: 1,
      kind: "action-preflight-rejection",
      ...eventIdentity,
      code: normalizedCode,
      message: normalizedMessage,
      committed: false,
    });
  }
  return rejection;
}

function compilerSelectedTargetIdentity(target) {
  const document = target?.document ?? target;
  const direct = String(document?.uuid ?? target?.uuid ?? "").trim();
  if (direct) return direct;
  const sceneId = String(document?.parent?.id ?? document?.scene?.id ?? "").trim();
  const tokenId = String(document?.id ?? target?.id ?? "").trim();
  if (sceneId && tokenId) return "Scene." + sceneId + ".Token." + tokenId;
  return tokenId;
}

function preflightCompilerSelectionCardinality(activity, usageConfig, workflow = null) {
  const parsed = parseCompilerSelectionCardinality(activity);
  if (parsed.problem) {
    throw compilerSelectionCardinalityFailure(
      parsed.problem,
      "ACTION_MISCONFIGURED",
    );
  }
  if (!parsed.cardinality) return true;
  const item = activity?.item ?? workflow?.item;
  const targets = targetsFromUseConfig(workflow, usageConfig);
  const identities = targets.map(compilerSelectedTargetIdentity);
  if (identities.some(identity => !identity)) {
    throw compilerSelectionCardinalityFailure(
      "Selected target identity could not be resolved",
      "ACTION_MISCONFIGURED",
    );
  }
  if (new Set(identities).size !== identities.length) {
    throw compilerSelectionCardinalityFailure(
      "Selected targets must not contain duplicate token identities",
    );
  }
  const castLevel = workflowCastLevel(item, usageConfig, workflow);
  const maximum = resolveCompilerSelectionCardinalityMaximum(
    parsed.cardinality,
    castLevel,
  );
  if (identities.length < parsed.cardinality.min) {
    throw compilerSelectionCardinalityFailure(
      "Selected target count is below action minimum of "
        + parsed.cardinality.min,
    );
  }
  if (maximum !== null && identities.length > maximum) {
    throw compilerSelectionCardinalityFailure(
      "Selected target count exceeds action maximum of " + maximum,
    );
  }
  return true;
}

function workflowSemanticActionId(workflow) {
  const activity = workflow?.activity;
  return activity?.getFlag?.(MODULE_ID, "semanticActionId")
    ?? activity?.flags?.[MODULE_ID]?.semanticActionId
    ?? null;
}

function compilerWorkflowOutcomeRuleMatchesActivity(rule, workflow) {
  const activity = workflow?.activity;
  const semanticActionId = activity?.getFlag?.(MODULE_ID, "semanticActionId")
    ?? activity?.flags?.[MODULE_ID]?.semanticActionId
    ?? null;
  const requiredIdentifier = rule?.adapter?.usesActivityIdentifier;
  if (requiredIdentifier) {
    const activityIdentifier = activity?.midiProperties?.identifier
      ?? activity?.identifier
      ?? null;
    return activityIdentifier === requiredIdentifier
      || semanticActionId === "runtime:" + requiredIdentifier;
  }
  return !rule?.sourceActionId || rule.sourceActionId === semanticActionId;
}

function workflowTokenIdentity(token) {
  return token?.document?.uuid
    ?? token?.uuid
    ?? token?.document?.id
    ?? token?.id
    ?? token?.actor?.uuid
    ?? null;
}

function workflowOutcomeTargets(workflow, usageConfig, outcome) {
  const allTargets = targetsFromUseConfig(workflow, usageConfig).filter(target => target?.actor);
  const hitTargets = workflowHitTargets(workflow);
  if (outcome === "hit") {
    if (hitTargets.length) return hitTargets;
    return workflow?.isHit === true || workflow?.hit === true ? allTargets : [];
  }
  if (outcome === "miss") {
    if (workflow?.isHit === false || workflow?.hit === false) return allTargets;
    const hitIds = new Set(hitTargets.map(workflowTokenIdentity).filter(Boolean));
    return allTargets.filter(target => !hitIds.has(workflowTokenIdentity(target)));
  }
  const saveTargets = outcome === "success"
    ? Array.from(workflow?.saves ?? [])
    : outcome === "failure"
      ? Array.from(workflow?.failedSaves ?? [])
      : [];
  return saveTargets.filter(target => target?.actor);
}

function compilerWorkflowOutcomeCastLevel(
  item,
  usageConfig,
  workflow,
  rule,
  targets,
) {
  const fallback = workflowCastLevel(item, usageConfig, workflow);
  const requiredIdentifier = rule?.adapter?.usesActivityIdentifier;
  if (!requiredIdentifier) return fallback;
  const baseLevel = Math.max(0, Number(item?.system?.level ?? 0) || 0);
  for (const target of targets ?? []) {
    for (const effect of Array.from(target?.actor?.effects ?? [])) {
      if (
        effect?.disabled === true
        || effect?.active === false
        || effect?.isSuppressed === true
        || !compilerEffectOriginatesFromItem(effect, item)
        || !Array.from(effect?.changes ?? []).some(change =>
          change?.key === "flags.midi-qol.ActivityOverTime"
          && String(change?.value ?? "").trim() === requiredIdentifier
        )
      ) continue;
      const candidates = [
        arcaneEffectFlag(effect, "sourceCastLevel"),
        arcaneEffectFlag(effect, "castLevel"),
        effect?.flags?.["midi-qol"]?.castData?.castLevel,
      ];
      for (const candidate of candidates) {
        const level = Number(candidate);
        if (Number.isFinite(level) && level >= baseLevel) {
          return Math.min(9, Math.floor(level));
        }
      }
    }
  }
  throw new Error(
    "workflow-outcome-operations-v1 hidden activity "
      + requiredIdentifier
      + " requires an exact active dependent with source cast-level provenance",
  );
}

function compilerOutcomeDamageFormula(
  operation,
  item,
  usageConfig,
  workflow,
  castLevelOverride = null,
) {
  const requestedCastLevel = Number(castLevelOverride);
  const minSlotLevel = Math.max(1, Number(item?.system?.level) || 1);
  const castLevel = Number.isFinite(requestedCastLevel)
    && requestedCastLevel >= minSlotLevel
    ? Math.min(9, Math.floor(requestedCastLevel))
    : workflowCastLevel(item, usageConfig, workflow);
  const baseFormula = compilerRiderDamageFormula(operation, castLevel, minSlotLevel);
  const multiplier = operation?.multiplier === undefined
    ? 1
    : Number(operation.multiplier);
  if (!Number.isFinite(multiplier) || multiplier <= 0) {
    throw new Error("workflow-outcome-operations-v1 damage multiplier must be positive");
  }
  if (multiplier === 1) return baseFormula;
  const roundingFunction = {
    down: "floor",
    nearest: "round",
    up: "ceil",
  }[operation.rounding ?? "nearest"];
  if (!roundingFunction) {
    throw new Error(
      "workflow-outcome-operations-v1 damage rounding must be down, nearest, or up",
    );
  }
  return roundingFunction + "((" + baseFormula + ") * " + multiplier + ")";
}

async function applyCompilerWorkflowOutcomeOperations(item, usageConfig, workflow) {
  const rules = compilerRuntimeRulesForAdapter(item, "workflow-outcome-operations-v1");
  if (!rules.length) return false;
  const matchingRules = rules.filter(rule =>
    rule.trigger === "operation-outcome"
    && compilerWorkflowOutcomeRuleMatchesActivity(rule, workflow)
  );
  if (!matchingRules.length) return false;

  workflow.__arcaneCompilerOutcomeRules ??= new Set();
  for (const currentRule of matchingRules) {
    const outcome = currentRule.on?.outcome;
    const targets = workflowOutcomeTargets(workflow, usageConfig, outcome);
    if (!targets.length) continue;
    const castLevel = compilerWorkflowOutcomeCastLevel(
      item,
      usageConfig,
      workflow,
      currentRule,
      targets,
    );
    const dedupeKey = [
      workflow?.uuid ?? workflow?.id ?? workflow?.itemCardId ?? "workflow",
      currentRule.id,
      ...targets.map(workflowTokenIdentity).filter(Boolean).sort(),
    ].join(":");
    if (workflow.__arcaneCompilerOutcomeRules.has(dedupeKey)) continue;
    workflow.__arcaneCompilerOutcomeRules.add(dedupeKey);
    try {
      for (const currentOperation of currentRule.operations ?? []) {
        if (
          currentOperation.type !== "damage"
          || !String(currentOperation.formula ?? "").trim()
          || (currentOperation.damageTypes ?? []).length !== 1
        ) {
          throw new Error(
            "workflow-outcome-operations-v1 only supports single-type damage operations",
          );
        }
        await applyBonusDamageWorkflow(
          workflow,
          compilerOutcomeDamageFormula(
            currentOperation,
            item,
            usageConfig,
            workflow,
            castLevel,
          ),
          currentOperation.damageTypes[0],
          item.name + ": " + outcome,
          {
            riderId: currentRule.id + ":" + (currentOperation.id ?? "damage"),
            targets,
            isCritical: false,
          },
        );
      }
    } catch (error) {
      workflow.__arcaneCompilerOutcomeRules.delete(dedupeKey);
      throw error;
    }
  }
  return true;
}

async function applyCompilerWorkflowOutcomeActivities(
  item,
  usageConfig,
  workflow,
) {
  if (
    !workflow
    || workflow.aborted === true
    || !isPrimaryAutomationGM()
  ) return false;
  const rules = compilerRuntimeRulesForAdapter(
    item,
    "workflow-outcome-activity-v1",
  );
  if (!rules.length) return false;
  const semanticActionId = workflowSemanticActionId(workflow);
  const selections = compilerRuntimeSelections(usageConfig, workflow);
  const castLevel = workflowCastLevel(item, usageConfig, workflow);
  const baseLevel = Math.max(0, Number(item?.system?.level ?? 0) || 0);
  const scaling = Math.max(0, castLevel - baseLevel);
  workflow.__arcaneCompilerOutcomeActivityRules ??= new Set();

  for (const currentRule of rules) {
    if (
      currentRule.trigger !== "operation-outcome"
      || (
        currentRule.sourceActionId
        && currentRule.sourceActionId !== semanticActionId
      )
      || !compilerSelectionPredicatesMatch(currentRule, selections)
    ) continue;
    const targets = workflowOutcomeTargets(
      workflow,
      usageConfig,
      currentRule.on?.outcome,
    );
    if (!targets.length) continue;
    const activityIdentifier =
      currentRule.adapter?.activityIdentifier;
    const activity = Array.from(item?.system?.activities ?? []).find(
      candidate =>
        candidate.midiProperties?.identifier === activityIdentifier,
    );
    if (!activity) {
      throw new Error(
        "workflow-outcome-activity-v1 is missing activity "
        + String(activityIdentifier ?? "<unknown>"),
      );
    }
    const dedupeKey = [
      workflow?.uuid ?? workflow?.id ?? workflow?.itemCardId ?? "workflow",
      currentRule.id,
      ...targets.map(workflowTokenIdentity).filter(Boolean).sort(),
    ].join(":");
    if (workflow.__arcaneCompilerOutcomeActivityRules.has(dedupeKey)) {
      continue;
    }
    workflow.__arcaneCompilerOutcomeActivityRules.add(dedupeKey);
    try {
      for (const target of targets) {
        const targetUuid =
          target?.document?.uuid ?? target?.uuid ?? null;
        if (!targetUuid) {
          throw new Error(
            "workflow-outcome-activity-v1 target has no UUID",
          );
        }
        const childWorkflow = await MidiQOL.completeActivityUse(
          activity,
          {
            consume: {
              action: false,
              resources: false,
              spellSlot: false,
            },
            concentration: { begin: false },
            scaling,
            midiOptions: {
              spellLevel: castLevel,
              isCritical: workflow?.isCritical === true,
              noUseWarning: true,
              targetUuids: [targetUuid],
              targetsToUse: new Set([target]),
              ignoreUserTargets: true,
              fastForward: true,
              workflowOptions: {
                arcaneWorkflowOutcomeActivityChild: true,
                isCritical: workflow?.isCritical === true,
                targetUuids: [targetUuid],
                sourceTokenUuid:
                  workflow?.token?.document?.uuid
                  ?? workflow?.tokenUuid
                  ?? null,
                targetConfirmation: "none",
              },
            },
          },
        );
        if (!childWorkflow || childWorkflow.aborted === true) {
          throw new Error(
            "workflow-outcome-activity-v1 child did not complete",
          );
        }
      }
    } catch (error) {
      workflow.__arcaneCompilerOutcomeActivityRules.delete(dedupeKey);
      throw error;
    }
  }
  return true;
}

async function applyCompilerWorkflowOutcomeForcedMovement(
  item,
  usageConfig,
  workflow,
) {
  // RollComplete is observed by every connected client. Arcane runtime mutations
  // belong to the primary active GM; the workflow-local receipts below deliberately
  // do not attempt cross-GM synchronization.
  if (!isPrimaryAutomationGM()) return false;
  const rules = compilerRuntimeRulesForAdapter(
    item,
    "workflow-outcome-forced-movement-v1",
  );
  if (!rules.length) return false;
  const semanticActionId = workflowSemanticActionId(workflow);
  const matchingRules = rules.filter(rule =>
    rule.trigger === "operation-outcome"
    && (!rule.sourceActionId || rule.sourceActionId === semanticActionId)
  );
  if (!matchingRules.length) return false;

  const sourceActor = workflow?.actor ?? item?.actor;
  const workflowToken = workflow?.token?.object ?? workflow?.token;
  const sourceToken = workflowToken?.center
    ? workflowToken
    : findSourceToken(sourceActor);
  const sourcePoint = {
    x: Number(sourceToken?.center?.x),
    y: Number(sourceToken?.center?.y),
  };
  if (
    !sourceToken
    || !Number.isFinite(sourcePoint.x)
    || !Number.isFinite(sourcePoint.y)
  ) {
    throw new Error(
      "workflow-outcome-forced-movement-v1 requires a source token",
    );
  }
  if (typeof globalThis.MidiQOL?.moveTokenAwayFromPoint !== "function") {
    throw new Error(
      "workflow-outcome-forced-movement-v1 requires MidiQOL.moveTokenAwayFromPoint",
    );
  }

  workflow.__arcaneCompilerForcedMovementRules ??= new Set();
  workflow.__arcaneCompilerForcedMovementOperations ??= new Set();
  const workflowIdentity =
    workflow?.uuid ?? workflow?.id ?? workflow?.itemCardId ?? "workflow";
  for (const currentRule of matchingRules) {
    const outcome = currentRule.on?.outcome;
    if (outcome !== "failure") {
      throw new Error(
        "workflow-outcome-forced-movement-v1 only supports failure outcomes",
      );
    }
    const operations = currentRule.operations ?? [];
    if (!operations.length) {
      throw new Error(
        "workflow-outcome-forced-movement-v1 requires a move-token operation",
      );
    }
    for (const currentOperation of operations) {
      const destination = currentOperation?.destination;
      const distance = Number(destination?.distance);
      if (
        currentOperation?.type !== "move-token"
        || destination?.type !== "away-from-source"
        || destination?.units !== "ft"
        || !Number.isFinite(distance)
        || distance <= 0
      ) {
        throw new Error(
          "workflow-outcome-forced-movement-v1 requires move-token away-from-source in ft",
        );
      }
    }
    const targets = workflowOutcomeTargets(
      workflow,
      usageConfig,
      outcome,
    );
    if (!targets.length) continue;
    for (const target of targets) {
      const targetIdentity = workflowTokenIdentity(target);
      if (!targetIdentity) {
        throw new Error(
          "workflow-outcome-forced-movement-v1 requires a target UUID",
        );
      }
      const ruleTargetKey = [
        workflowIdentity,
        currentRule.id,
        targetIdentity,
      ].join(":");
      if (workflow.__arcaneCompilerForcedMovementRules.has(ruleTargetKey)) {
        continue;
      }
      for (let index = 0; index < operations.length; index += 1) {
        const currentOperation = operations[index];
        const operationIdentity = currentOperation.id ?? "operation-" + index;
        const operationTargetKey = [
          ruleTargetKey,
          operationIdentity,
        ].join(":");
        if (
          workflow.__arcaneCompilerForcedMovementOperations.has(
            operationTargetKey,
          )
        ) {
          continue;
        }
        const distance = Number(currentOperation.destination.distance);
        await globalThis.MidiQOL.moveTokenAwayFromPoint(
          target,
          distance,
          sourcePoint,
          {
            animate: true,
            ignoreWalls: false,
            ignoreTokens: false,
            autoRotate: false,
          },
        );
        workflow.__arcaneCompilerForcedMovementOperations.add(
          operationTargetKey,
        );
      }
      // This is the public runtime-plan receipt:
      // workflowUuid + ruleId + targetUuid.
      workflow.__arcaneCompilerForcedMovementRules.add(ruleTargetKey);
    }
  }
  return true;
}

function compilerRuntimeSelections(usageConfig, workflow) {
  const candidates = [
    usageConfig?.arcaneSelections,
    usageConfig?.midiOptions?.arcaneSelections,
    usageConfig?.midiOptions?.workflowOptions?.arcaneSelections,
    workflow?.options?.arcaneSelections,
    workflow?.options?.workflowOptions?.arcaneSelections,
    workflow?.workflowOptions?.arcaneSelections,
  ];
  return candidates.find(value =>
    value
    && typeof value === "object"
    && !Array.isArray(value)
  ) ?? {};
}

async function applyRequiredSelectionEffectModifiersFromUse(
  item,
  usageConfig,
  workflow,
) {
  if (!item || !workflow || workflow.aborted === true) return false;
  const templates = Array.from(item.effects ?? []).filter(effect =>
    compilerRuntimeModifiers(
      effect,
      "ability-check-disadvantage-selection",
    ).length > 0
  );
  if (!templates.length) return false;
  const selections = compilerRuntimeSelections(usageConfig, workflow);
  const sourceActor = workflow.actor ?? item.actor;
  const actors = [...new Set([
    sourceActor,
    ...targetsFromUseConfig(workflow, usageConfig).map(target => target?.actor),
  ].filter(Boolean))];
  let materialized = 0;
  for (const template of templates) {
    const artifactIds = compilerArtifactIds(template);
    const modifiers = compilerRuntimeModifiers(
      template,
      "ability-check-disadvantage-selection",
    );
    for (const modifier of modifiers) {
      const parameterId = String(modifier.parameterId ?? "").trim();
      const ability = String(selections?.[parameterId] ?? "").trim();
      if (!parameterId || !["str", "dex", "con", "int", "wis", "cha"].includes(ability)) {
        throw new Error(
          (item.name ?? "Compiler effect")
          + " is missing a valid required ability selection",
        );
      }
      for (const actor of actors) {
        const effect = newestEffect(Array.from(actor.effects ?? []).filter(candidate =>
          candidate.disabled !== true
          && candidate.active !== false
          && candidate.isSuppressed !== true
          && compilerEffectOriginatesFromItem(candidate, item)
          && artifactIds.some(id => compilerArtifactIds(candidate).includes(id))
          && compilerRuntimeModifiers(
            candidate,
            "ability-check-disadvantage-selection",
          ).some(current => current.parameterId === parameterId)
        ));
        if (!effect) continue;
        const staticChanges = Array.from(template.changes ?? []).filter(change =>
          !String(change?.key ?? "").startsWith(
            "flags.midi-qol.disadvantage.check.",
          )
        );
        await effect.update({
          changes: [
            ...staticChanges,
            {
              key: "flags.midi-qol.disadvantage.check." + ability,
              mode: 5,
              value: "true",
              priority: 20,
            },
          ],
          ["flags." + MODULE_ID + ".runtimeSelectionValues"]: {
            ...(arcaneEffectFlag(effect, "runtimeSelectionValues") ?? {}),
            [parameterId]: ability,
          },
          ["flags." + MODULE_ID + ".sourceActorUuid"]:
            sourceActor?.uuid ?? null,
          ["flags." + MODULE_ID + ".sourceItemUuid"]: item.uuid,
        });
        materialized += 1;
      }
    }
  }
  if (materialized === 0) {
    throw new Error(
      (item.name ?? "Compiler effect")
      + " did not create the effect required for its runtime selection",
    );
  }
  return true;
}

function compilerInteractionTargetFilter(workflow) {
  const activity = workflow?.activity;
  const value = activity?.getFlag?.(MODULE_ID, "interaction")
    ?? activity?.flags?.[MODULE_ID]?.interaction
    ?? null;
  const filter = value?.targetFilter;
  return filter
    && typeof filter === "object"
    && !Array.isArray(filter)
    && filter.type === "creature-type"
    && Array.isArray(filter.values)
    && filter.values.length > 0
    ? filter
    : null;
}

function compilerInteractionSelectionConstraints(workflow) {
  const activity = workflow?.activity;
  const value = activity?.getFlag?.(MODULE_ID, "interaction")
    ?? activity?.flags?.[MODULE_ID]?.interaction
    ?? null;
  const constraints = Array.isArray(value?.selectionConstraints)
    ? value.selectionConstraints
    : value?.selectionConstraints
      && typeof value.selectionConstraints === "object"
      && !Array.isArray(value.selectionConstraints)
      ? [value.selectionConstraints]
      : [];
  return constraints.filter(constraint =>
    constraint
    && typeof constraint === "object"
    && !Array.isArray(constraint)
    && ["pairwise-within-distance", "artifact-exists"].includes(constraint.type)
  );
}

function compilerInteractionExcludesSource(workflow) {
  const activity = workflow?.activity;
  const interaction = activity?.getFlag?.(MODULE_ID, "interaction")
    ?? activity?.flags?.[MODULE_ID]?.interaction
    ?? null;
  if (
    !interaction
    || typeof interaction !== "object"
    || Array.isArray(interaction)
  ) return false;
  const special = String(
    activity?.target?.affects?.special ?? "",
  );
  return special
    .split(";")
    .map(value => value.trim())
    .includes("-self");
}

function compilerActorCreatureType(actor) {
  const type = actor?.system?.details?.type;
  const value = String(
    typeof type === "string"
      ? type
      : type?.value ?? "",
  ).trim().toLowerCase();
  if (value) return value;
  return actor?.type === "character" ? "humanoid" : "";
}

function compilerSelectionConstraintFailure(constraints, targets) {
  const numericDistanceEpsilon = 1e-6;
  for (const constraint of constraints) {
    const distance = Number(
      constraint.maximum ?? constraint.distance,
    );
    const units = String(constraint.units ?? "ft");
    if (!Number.isFinite(distance) || distance < 0 || units !== "ft") {
      return "The selected targets have an invalid pairwise distance constraint.";
    }
    for (let left = 0; left < targets.length; left += 1) {
      for (let right = left + 1; right < targets.length; right += 1) {
        const leftToken = targets[left]?.object ?? targets[left];
        const rightToken = targets[right]?.object ?? targets[right];
        const leftCenter = leftToken?.center;
        const rightCenter = rightToken?.center;
        if (
          !Number.isFinite(Number(leftCenter?.x))
          || !Number.isFinite(Number(leftCenter?.y))
          || !Number.isFinite(Number(rightCenter?.x))
          || !Number.isFinite(Number(rightCenter?.y))
        ) {
          return "The distance between the selected targets could not be determined.";
        }
        const midiCheckDistance = globalThis.MidiQOL?.checkDistance;
        let withinDistance = null;
        if (typeof midiCheckDistance === "function") {
          try {
            const result = midiCheckDistance(
              leftToken,
              rightToken,
              distance,
              {
                wallsBlock: false,
                includeCover: false,
              },
            );
            withinDistance = typeof result === "boolean" ? result : null;
          } catch (_error) {
            withinDistance = null;
          }
        } else {
          let measured = Infinity;
          try {
            measured = distanceBetweenTokens(leftToken, rightToken);
          } catch (_error) {
            measured = Infinity;
          }
          withinDistance = Number.isFinite(measured)
            ? measured <= distance + numericDistanceEpsilon
            : null;
        }
        if (withinDistance === null) {
          return "The distance between the selected targets could not be determined.";
        }
        if (!withinDistance) {
          return (
            "Every selected target must be within "
            + distance
            + " "
            + units
            + " of every other selected target."
          );
        }
      }
    }
  }
  return null;
}

function compilerArtifactExistsConstraintFailure(constraints, targets, item) {
  const itemUuid = String(item?.uuid ?? "");
  const originMatchesItem = effect => {
    const direct = String(
      effect?.flags?.[MODULE_ID]?.sourceItemUuid ?? effect?.origin ?? "",
    );
    if (direct === itemUuid) return true;
    try {
      const owner = typeof fromUuidSync === "function" ? fromUuidSync(direct) : null;
      return (
        owner?.documentName === "ActiveEffect"
        && String(owner?.origin ?? "") === itemUuid
      );
    } catch {
      return false;
    }
  };
  for (const constraint of constraints) {
    if (constraint?.type !== "artifact-exists") continue;
    const artifactId = String(constraint.artifactId ?? "");
    const subject = String(constraint.subject ?? "target");
    if (!artifactId || subject !== "target") {
      return "The artifact-exists selection constraint is invalid.";
    }
    for (const target of targets) {
      const actor = (target?.object ?? target)?.actor;
      const hasArtifact = Array.from(actor?.effects ?? []).some(effect =>
        effect?.disabled !== true
        && effect?.active !== false
        && effect?.isSuppressed !== true
        && compilerArtifactIds(effect).includes(artifactId)
        && originMatchesItem(effect, actor)
      );
      if (!hasArtifact) {
        return (
          "The selected target does not hold the required "
          + artifactId
          + " marker from this spell."
        );
      }
    }
  }
  return null;
}

function filterCompilerWorkflowTargets(workflow, {
  preserveOutcomeSets = false,
} = {}) {
  const filter = compilerInteractionTargetFilter(workflow);
  const constraints = compilerInteractionSelectionConstraints(workflow);
  const excludesSource = compilerInteractionExcludesSource(workflow);
  if (!filter && !constraints.length && !excludesSource) return true;
  const allowed = new Set((filter?.values ?? []).map(value =>
    String(value ?? "").trim().toLowerCase()
  ));
  const sourceToken =
    workflow?.token?.object
    ?? workflow?.token
    ?? findSourceToken(workflow?.actor ?? workflow?.item?.actor);
  const sourceTokenId =
    sourceToken?.document?.id
    ?? sourceToken?.id
    ?? null;
  const accepts = target => {
    const targetToken = target?.object ?? target;
    const targetTokenId =
      targetToken?.document?.id
      ?? targetToken?.id
      ?? null;
    if (
      excludesSource
      && sourceTokenId
      && targetTokenId === sourceTokenId
    ) return false;
    return !filter || allowed.has(compilerActorCreatureType(targetToken?.actor));
  };
  const targetValues = Array.from(workflow?.targets ?? []).filter(accepts);
  const constraintFailure = compilerSelectionConstraintFailure(
    constraints.filter(constraint => constraint?.type === "pairwise-within-distance"),
    targetValues,
  ) ?? compilerArtifactExistsConstraintFailure(
    constraints,
    targetValues,
    workflow?.item ?? workflow?.activity?.item,
  );
  if (constraintFailure) {
    ui.notifications?.warn(constraintFailure);
    return false;
  }
  const targets = new Set(targetValues);
  if (preserveOutcomeSets) {
    for (const property of [
      "targets",
      "hitTargets",
      "hitTargetsEC",
      "failedSaves",
    ]) {
      workflow[property] = new Set(
        Array.from(workflow?.[property] ?? []).filter(accepts),
      );
    }
    return true;
  }
  if (typeof workflow?.setTargets === "function") {
    workflow.setTargets(targets);
  } else if (workflow) {
    workflow.targets = targets;
  }
  return true;
}

function preflightRequiredCompilerSelections(item, activity, workflow) {
  const interaction = activity?.getFlag?.(MODULE_ID, "interaction")
    ?? activity?.flags?.[MODULE_ID]?.interaction
    ?? null;
  const definitions = Array.isArray(interaction?.requiredSelections)
    ? interaction.requiredSelections
    : [];
  if (!definitions.length) return null;
  const selections = compilerRuntimeSelections(null, workflow);
  const declaredIds = new Set(definitions.map(definition =>
    String(definition?.id ?? "")
  ));
  const unknown = Object.keys(selections).find(id => !declaredIds.has(id));
  if (unknown) {
    return {
      kind: "required-selection",
      message:
        (item?.name ?? activity?.name ?? "Action")
        + " received an unknown selection: "
        + unknown
        + ".",
    };
  }
  for (const definition of definitions) {
    const id = String(definition?.id ?? "");
    const value = selections?.[id];
    const allowed = Array.from(definition?.values ?? []).map(entry =>
      String(entry?.value ?? "")
    );
    if (
      !id
      || typeof value !== "string"
      || !allowed.includes(value)
    ) {
      return {
        kind: "required-selection",
        message:
          (item?.name ?? activity?.name ?? "Action")
          + " requires an explicit "
          + id
          + " selection.",
      };
    }
  }
  return null;
}

function compilerSelectionPredicatesMatch(rule, selections) {
  return (rule?.when ?? []).every(predicate => {
    if (predicate?.type !== "input-selection-equals") return true;
    return String(selections?.[predicate.id] ?? "") === String(predicate.value ?? "");
  });
}

function suppressionContract(effect) {
  const value = arcaneEffectFlag(effect, "statusEffectSuppression");
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Number(value.version) === 1
    ? value
    : null;
}

async function queueStatusEffectSuppression(actor, effectId, task) {
  const key = String(actor?.uuid ?? actor?.id ?? "actor")
    + ":"
    + String(effectId ?? "effect");
  const previous = STATUS_EFFECT_SUPPRESSION_QUEUES.get(key)
    ?? Promise.resolve();
  const current = previous.catch(() => null).then(task);
  STATUS_EFFECT_SUPPRESSION_QUEUES.set(key, current);
  try {
    return await current;
  } finally {
    if (STATUS_EFFECT_SUPPRESSION_QUEUES.get(key) === current) {
      STATUS_EFFECT_SUPPRESSION_QUEUES.delete(key);
    }
  }
}

function liveSuppressionSourceEffectUuids(actor, values, additions = []) {
  const live = new Set(
    Array.from(actor?.effects ?? []).map(effect => String(effect.uuid)),
  );
  return [...new Set([
    ...Array.from(values ?? []).map(String).filter(uuid => live.has(uuid)),
    ...Array.from(additions ?? []).map(String).filter(uuid => live.has(uuid)),
  ])].sort();
}

async function suppressStatusEffectsForMarker(marker, statuses) {
  const actor = marker?.parent;
  if (!actor || marker?.documentName !== "ActiveEffect") return false;
  const wanted = new Set(Array.from(statuses ?? []).map(String));
  const suppressedEffectIds = [];
  for (const effect of Array.from(actor.effects ?? [])) {
    if (effect.id === marker.id) continue;
    const effectStatuses = Array.from(effect.statuses ?? []);
    if (!effectStatuses.some(status => wanted.has(String(status)))) continue;
    const suppressed = await queueStatusEffectSuppression(
      actor,
      effect.id,
      async () => {
        const original = actor.effects?.get?.(effect.id)
          ?? Array.from(actor.effects ?? []).find(current =>
            current.id === effect.id
          )
          ?? null;
        const existing = suppressionContract(original);
        if (!original) return false;
        if (original.disabled === true && !existing?.disabledByArcane) {
          return false;
        }
        const sourceEffectUuids = liveSuppressionSourceEffectUuids(
          actor,
          existing?.sourceEffectUuids,
          [marker.uuid],
        );
        await original.update({
          disabled: true,
          ["flags." + MODULE_ID + ".statusEffectSuppression"]: {
            version: 1,
            disabledByArcane: true,
            sourceEffectUuids,
          },
        });
        return true;
      },
    );
    if (suppressed) suppressedEffectIds.push(effect.id);
  }
  if (marker.parent) {
    await marker.update({
      ["flags." + MODULE_ID + ".suppressedEffectIds"]:
        [...new Set(suppressedEffectIds)].sort(),
    });
  }
  return true;
}

async function restoreSuppressedStatusEffects(effect) {
  if (!isPrimaryAutomationGM()) return true;
  const suppressedEffectIds = Array.from(
    arcaneEffectFlag(effect, "suppressedEffectIds") ?? [],
  );
  const actor = effect?.parent;
  if (!actor || !suppressedEffectIds.length) return true;
  for (const effectId of suppressedEffectIds) {
    await queueStatusEffectSuppression(actor, effectId, async () => {
      const original = actor.effects?.get?.(effectId)
        ?? Array.from(actor.effects ?? []).find(current =>
          current.id === effectId
        )
        ?? null;
      const contract = suppressionContract(original);
      if (!original || !contract?.disabledByArcane) return;
      const remaining = liveSuppressionSourceEffectUuids(
        actor,
        contract.sourceEffectUuids,
      ).filter(uuid => uuid !== String(effect.uuid));
      if (remaining.length) {
        await original.update({
          ["flags." + MODULE_ID + ".statusEffectSuppression.sourceEffectUuids"]:
            remaining,
        });
        return;
      }
      await original.update({
        disabled: false,
        ["flags." + MODULE_ID + ".-=statusEffectSuppression"]: null,
      });
    });
  }
  return true;
}

async function applyRequiredSelectionOutcomesFromUse(item, usageConfig, workflow) {
  if (!workflow || workflow.aborted === true) return false;
  const rules = [
    ...compilerRuntimeRulesForAdapter(item, "required-selection-outcome-v1"),
    ...compilerRuntimeRulesForAdapter(item, "status-effect-suppression-v1"),
  ];
  if (!rules.length) return false;
  const semanticActionId = workflowSemanticActionId(workflow);
  const selections = compilerRuntimeSelections(usageConfig, workflow);
  const sourceActor = workflow?.actor ?? item?.actor;
  if (!sourceActor) return false;
  let sourceEffect = compilerConcentrationEffect(
    sourceActor,
    item,
    workflow?.activity,
    workflow,
  );
  if (!sourceEffect) {
    await Promise.resolve();
    sourceEffect = compilerConcentrationEffect(
      sourceActor,
      item,
      workflow?.activity,
      workflow,
    );
  }
  if (!sourceEffect) {
    throw new Error(
      "required-selection outcome requires the spell concentration effect",
    );
  }

  workflow.__arcaneRequiredSelectionRules ??= new Set();
  for (const currentRule of rules) {
    if (
      currentRule.trigger !== "operation-outcome"
      || (currentRule.sourceActionId && currentRule.sourceActionId !== semanticActionId)
      || !compilerSelectionPredicatesMatch(currentRule, selections)
    ) continue;
    const targets = workflowOutcomeTargets(
      workflow,
      usageConfig,
      currentRule.on?.outcome,
    );
    if (!targets.length) continue;
    const dedupeKey = [
      workflow?.uuid ?? workflow?.id ?? workflow?.itemCardId ?? "workflow",
      currentRule.id,
      ...targets.map(workflowTokenIdentity).filter(Boolean).sort(),
    ].join(":");
    if (workflow.__arcaneRequiredSelectionRules.has(dedupeKey)) continue;
    workflow.__arcaneRequiredSelectionRules.add(dedupeKey);
    const applications = (currentRule.operations ?? []).filter(operation =>
      operation.type === "apply-artifact"
    );
    const suppression = (currentRule.operations ?? []).find(operation =>
      operation.type === "suppress-statuses"
    );
    for (const target of targets) {
      for (const application of applications) {
        await applyCompilerDependentArtifact({
          sourceEffect,
          sourceActor,
          sourceItem: item,
          target,
          artifactId: application.artifactId,
        });
        if (!suppression) continue;
        const marker = newestEffect(
          compilerEffectsForArtifact(
            target.actor,
            application.artifactId,
            item,
          ).filter(candidate =>
            String(arcaneEffectFlag(candidate, "sourceEffectUuid") ?? "")
              === String(sourceEffect.uuid)
          ),
        );
        if (!marker) {
          throw new Error(
            "status-effect-suppression-v1 could not materialize its marker",
          );
        }
        await suppressStatusEffectsForMarker(marker, suppression.statuses);
      }
    }
  }
  return true;
}

function reversibleHitPointCapacityContract(effect) {
  const value = arcaneEffectFlag(effect, "reversibleHitPointCapacity");
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Number(value.version) === 1
    ? value
    : null;
}

function reversibleHitPointCapacityEffects(actor, group) {
  return Array.from(actor?.effects ?? []).filter(effect => {
    const contract = reversibleHitPointCapacityContract(effect);
    return contract
      && String(contract.group ?? "") === String(group ?? "");
  });
}

function reversibleHitPointCapacityWinner(effects) {
  return [...effects].sort((left, right) => {
    const leftContract = reversibleHitPointCapacityContract(left) ?? {};
    const rightContract = reversibleHitPointCapacityContract(right) ?? {};
    return Number(rightContract.amount ?? 0) - Number(leftContract.amount ?? 0)
      || Number(rightContract.appliedAt ?? 0) - Number(leftContract.appliedAt ?? 0)
      || String(rightContract.castUuid ?? "").localeCompare(
        String(leftContract.castUuid ?? ""),
      );
  })[0] ?? null;
}

function reversibleHitPointCapacityAmount(effect) {
  return Math.max(
    0,
    Number(reversibleHitPointCapacityContract(effect)?.amount ?? 0) || 0,
  );
}

function reversibleHitPointCapacityKey(actor, group) {
  return String(actor?.uuid ?? actor?.id ?? "actor")
    + ":"
    + String(group ?? "");
}

async function queueReversibleHitPointCapacity(actor, task) {
  const key = String(actor?.uuid ?? actor?.id ?? "actor");
  const previous = REVERSIBLE_HP_CAPACITY_ACTOR_QUEUES.get(key)
    ?? Promise.resolve();
  const current = previous.catch(() => null).then(task);
  REVERSIBLE_HP_CAPACITY_ACTOR_QUEUES.set(key, current);
  try {
    return await current;
  } finally {
    if (REVERSIBLE_HP_CAPACITY_ACTOR_QUEUES.get(key) === current) {
      REVERSIBLE_HP_CAPACITY_ACTOR_QUEUES.delete(key);
    }
  }
}

async function rebalanceReversibleHitPointCapacity(actor, group) {
  const effects = reversibleHitPointCapacityEffects(actor, group);
  const winner = reversibleHitPointCapacityWinner(effects);
  for (const current of effects) {
    const baseChanges = Array.from(current.changes ?? []).filter(change =>
      change.key !== "system.attributes.hp.tempmax"
    );
    const changes = current.id === winner?.id
      ? [
          ...baseChanges,
          {
            key: "system.attributes.hp.tempmax",
            mode: 2,
            value: String(reversibleHitPointCapacityAmount(current)),
            priority: 20,
          },
        ]
      : baseChanges;
    const isEffective = current.id === winner?.id;
    if (
      JSON.stringify(current.changes ?? []) !== JSON.stringify(changes)
      || reversibleHitPointCapacityContract(current)?.isEffective !== isEffective
    ) {
      await current.update({
        changes,
        ["flags." + MODULE_ID + ".reversibleHitPointCapacity.isEffective"]:
          isEffective,
      });
    }
  }
  return reversibleHitPointCapacityAmount(winner);
}

async function updateReversibleHitPointCapacityCurrent(actor, current, delta) {
  const hp = actor?.system?.attributes?.hp ?? {};
  const preparedMaximum = Number(hp.effectiveMax);
  const baseMaximum = Number(hp.max ?? 0);
  const temporaryMaximum = Number(hp.tempmax ?? 0);
  const maximum = Number.isFinite(preparedMaximum)
    ? preparedMaximum
    : baseMaximum + (Number.isFinite(temporaryMaximum) ? temporaryMaximum : 0);
  const next = Math.max(
    0,
    Math.min(
      Number.isFinite(maximum) && maximum >= 0 ? maximum : Infinity,
      Number(current ?? hp.value ?? 0) + Number(delta ?? 0),
    ),
  );
  await actor.update(
    { "system.attributes.hp.value": next },
    { isRest: true, arcaneHitPointCapacity: true },
  );
  return next;
}

async function applyReversibleHitPointCapacityFromUse(item, usageConfig, workflow) {
  if (!workflow || workflow.aborted === true) return false;
  const semanticActionId = workflowSemanticActionId(workflow);
  const rules = compilerRuntimeRulesForAdapter(
    item,
    "reversible-hit-point-capacity-v1",
  ).filter(rule =>
    rule.trigger === "action-used"
    && (!rule.sourceActionId || rule.sourceActionId === semanticActionId)
  );
  if (!rules.length) return false;
  if (!isPrimaryAutomationGM()) {
    throw new Error(
      "reversible-hit-point-capacity-v1 requires the primary active GM",
    );
  }
  const sourceActor = workflow?.actor ?? item?.actor;
  const targets = Array.from(new Map(
    targetsFromUseConfig(workflow, usageConfig)
      .filter(target => target?.actor?.uuid)
      .map(target => [target.actor.uuid, target]),
  ).values());
  if (!sourceActor || !targets.length) return false;
  workflow.__arcaneReversibleHitPointCapacityRules ??= new Set();
  for (const currentRule of rules) {
    const operation = (currentRule.operations ?? []).find(current =>
      current.type === "grant-hit-point-capacity"
    );
    if (!operation) {
      throw new Error(
        "reversible-hit-point-capacity-v1 requires grant-hit-point-capacity",
      );
    }
    const formulaScope = operation.formulaScope ?? "shared";
    if (!["shared", "per-target"].includes(formulaScope)) {
      throw new Error(
        "reversible-hit-point-capacity-v1 has an invalid formulaScope",
      );
    }
    const expressionContext = {
      operationResults: new Map(),
      item,
      usageConfig,
      workflow,
    };
    const sharedAmount = formulaScope === "shared"
      ? await compilerRuntimeExpressionValue(
          operation.formulaExpression ?? operation.formula,
          expressionContext,
        )
      : null;
    const castUuid = String(
      workflow?.uuid
      ?? workflow?.id
      ?? workflow?.itemCardId
      ?? foundry.utils.randomID(),
    );
    const group = String(item?.system?.identifier ?? item?.id ?? "");
    const appliedAt = Date.now();
    const dedupeKey = castUuid + ":" + currentRule.id;
    if (workflow.__arcaneReversibleHitPointCapacityRules.has(dedupeKey)) {
      continue;
    }
    workflow.__arcaneReversibleHitPointCapacityRules.add(dedupeKey);
    for (const target of targets) {
      const amount = formulaScope === "per-target"
        ? await compilerRuntimeExpressionValue(
            operation.formulaExpression ?? operation.formula,
            {
              ...expressionContext,
              targetActor: target.actor,
              targetToken: target,
            },
          )
        : sharedAmount;
      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error(
          "reversible-hit-point-capacity-v1 requires a positive amount",
        );
      }
      await queueReversibleHitPointCapacity(target.actor, async () => {
        const key = reversibleHitPointCapacityKey(target.actor, group);
        const oldWinner = reversibleHitPointCapacityWinner(
          reversibleHitPointCapacityEffects(target.actor, group),
        );
        const oldEffective = REVERSIBLE_HP_CAPACITY_EFFECTIVE.has(key)
          ? Number(REVERSIBLE_HP_CAPACITY_EFFECTIVE.get(key))
          : reversibleHitPointCapacityAmount(oldWinner);
        const currentHitPoints = Number(
          target.actor.system?.attributes?.hp?.value ?? 0,
        );
        const effectData = effectDataFromItem(
          item,
          effect => compilerArtifactIds(effect).includes(operation.artifactId),
          sourceActor,
        );
        if (!effectData) {
          throw new Error(
            "reversible-hit-point-capacity-v1 could not materialize "
            + operation.artifactId,
          );
        }
        effectData.changes = Array.from(effectData.changes ?? []).filter(change =>
          change.key !== "system.attributes.hp.tempmax"
        );
        effectData.flags ??= {};
        effectData.flags[MODULE_ID] = {
          ...(effectData.flags[MODULE_ID] ?? {}),
          sourceActorUuid: sourceActor.uuid,
          sourceItemUuid: item.uuid,
          reversibleHitPointCapacity: {
            version: 1,
            group,
            amount: Number(amount),
            appliedAt,
            castUuid,
            isEffective: false,
          },
        };
        effectData.flags.dae = {
          ...(effectData.flags.dae ?? {}),
          stackable: "multi",
        };
        await target.actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
        const newEffective = await rebalanceReversibleHitPointCapacity(
          target.actor,
          group,
        );
        REVERSIBLE_HP_CAPACITY_EFFECTIVE.set(key, newEffective);
        await updateReversibleHitPointCapacityCurrent(
          target.actor,
          currentHitPoints,
          newEffective - oldEffective,
        );
      });
    }
  }
  return true;
}

function snapshotReversibleHitPointCapacityDelete(effect) {
  if (!isPrimaryAutomationGM()) return true;
  const contract = reversibleHitPointCapacityContract(effect);
  const actor = effect?.parent;
  if (!contract || !actor) return true;
  REVERSIBLE_HP_CAPACITY_DELETE_SNAPSHOTS.set(
    String(effect.uuid ?? effect.id),
    {
      currentHitPoints: Number(actor.system?.attributes?.hp?.value ?? 0),
      effective: reversibleHitPointCapacityAmount(
        reversibleHitPointCapacityWinner(
          reversibleHitPointCapacityEffects(actor, contract.group),
        ),
      ),
    },
  );
  return true;
}

async function cleanupReversibleHitPointCapacity(effect, options) {
  if (!isPrimaryAutomationGM()) return true;
  const contract = reversibleHitPointCapacityContract(effect);
  const actor = effect?.parent;
  if (!contract || !actor) return true;
  const effectKey = String(effect.uuid ?? effect.id);
  const snapshot = REVERSIBLE_HP_CAPACITY_DELETE_SNAPSHOTS.get(effectKey);
  REVERSIBLE_HP_CAPACITY_DELETE_SNAPSHOTS.delete(effectKey);
  await queueReversibleHitPointCapacity(actor, async () => {
    await Promise.resolve();
    const key = reversibleHitPointCapacityKey(actor, contract.group);
    const oldEffective = REVERSIBLE_HP_CAPACITY_EFFECTIVE.has(key)
      ? Number(REVERSIBLE_HP_CAPACITY_EFFECTIVE.get(key))
      : Number(snapshot?.effective ?? contract.amount ?? 0);
    const newEffective = await rebalanceReversibleHitPointCapacity(
      actor,
      contract.group,
    );
    REVERSIBLE_HP_CAPACITY_EFFECTIVE.set(key, newEffective);
    if (newEffective === oldEffective) return;
    // 长休白名单清理（compat shim）：原生长休已清 tempmax 并回满基础上限，删除登记效果时
    // 跳过 HP 当前值二次扣减；rebalance 与其余清理保持不变。常规撤销/到期路径不受影响。
    if (options?.longRestCleanup !== true) {
      await updateReversibleHitPointCapacityCurrent(
        actor,
        snapshot?.currentHitPoints
          ?? Number(actor.system?.attributes?.hp?.value ?? 0),
        newEffective - oldEffective,
      );
    }
  });
  return true;
}

function actorCharacterLevel(actor) {
  const prepared = Number(actor?.system?.details?.level);
  if (Number.isFinite(prepared) && prepared >= 0) return Math.floor(prepared);
  return Array.from(actor?.items ?? [])
    .filter(item => item.type === "class")
    .reduce((sum, item) =>
      sum + Math.max(0, Number(item.system?.levels ?? 0) || 0)
    , 0);
}

function ownedWeaponAttackCantripFormula(expression, actor, spellItem) {
  if (expression?.type !== "cantrip-progression") return "";
  const systemCantripLevel = Number(
    actor?.system?.cantripLevel?.(spellItem),
  );
  const level = Number.isFinite(systemCantripLevel) && systemCantripLevel >= 0
    ? Math.floor(systemCantripLevel)
    : actorCharacterLevel(actor);
  const increments = level >= 17 ? 3 : level >= 11 ? 2 : level >= 5 ? 1 : 0;
  const context = {
    castLevel: 0,
    baseLevel: 0,
    sourceActor: actor,
    characterLevel: level,
  };
  const terms = [
    runtimeValueExpressionFormula(expression.base, context),
    ...Array.from(
      { length: increments },
      () => runtimeValueExpressionFormula(expression.increment, context),
    ),
  ].filter(value => value && value !== "0");
  return terms.join("+");
}

function resolveOwnedWeaponAttack(actor, spellItem, activity) {
  const semanticActionId = activity?.getFlag?.(MODULE_ID, "semanticActionId")
    ?? activity?.flags?.[MODULE_ID]?.semanticActionId
    ?? null;
  const rule = compilerRuntimeRulesForAdapter(
    spellItem,
    "owned-weapon-attack-v1",
  ).find(current =>
    current.adapter?.phase === "cast"
    && (!current.sourceActionId || current.sourceActionId === semanticActionId)
  );
  if (!rule) return null;
  const operation = (rule.operations ?? []).find(current =>
    current.type === "weapon-attack"
  );
  const query = (rule.targets ?? []).find(current =>
    current.semanticId === operation?.weapon
  );
  if (!operation || !query) {
    throw new Error(
      "owned-weapon-attack-v1 requires a weapon operation and query",
    );
  }
  const predicates = new Map(
    Array.from(query.predicates ?? []).map(current => [
      current.type,
      current,
    ]),
  );
  const magical = predicates.get("item-magical")?.value;
  const candidates = Array.from(actor?.items ?? [])
    .filter(candidate => {
      if (
        candidate.type !== "weapon"
        || candidate.system?.equipped !== true
      ) return false;
      if (
        magical !== undefined
        && weaponIsMagicalWithoutEnchantments(candidate) !== magical
      ) return false;
      return activityValues(candidate).some(candidateActivity =>
        candidateActivity?.type === "attack"
        && isMeleeWeaponAttack(candidate, candidateActivity)
      );
    })
    .sort((left, right) =>
      Number(left.sort ?? 0) - Number(right.sort ?? 0)
      || String(left?._source?.name ?? left.name ?? "").localeCompare(
        String(right?._source?.name ?? right.name ?? ""),
      )
      || String(left.id ?? "").localeCompare(String(right.id ?? ""))
    );
  const weapon = candidates[0] ?? null;
  if (!weapon) return { rule, operation, weapon: null, activity: null };
  const attackActivity = activityValues(weapon)
    .filter(candidate =>
      candidate?.type === "attack"
      && isMeleeWeaponAttack(weapon, candidate)
    )
    .sort((left, right) =>
      Number(left.sort ?? 0) - Number(right.sort ?? 0)
      || String(left.name ?? "").localeCompare(String(right.name ?? ""))
      || String(left.id ?? "").localeCompare(String(right.id ?? ""))
    )[0] ?? null;
  return { rule, operation, weapon, activity: attackActivity };
}

function preflightOwnedWeaponAttack(actor, item, activity) {
  const hasAdapter = compilerRuntimeRulesForAdapter(
    item,
    "owned-weapon-attack-v1",
  ).some(rule =>
    rule.adapter?.phase === "cast"
    && (
      !rule.sourceActionId
      || rule.sourceActionId === (
        activity?.getFlag?.(MODULE_ID, "semanticActionId")
        ?? activity?.flags?.[MODULE_ID]?.semanticActionId
      )
    )
  );
  if (!hasAdapter) return null;
  try {
    const resolved = resolveOwnedWeaponAttack(actor, item, activity);
    if (resolved?.weapon && resolved?.activity) return null;
    return {
      kind: "owned-weapon-attack",
      message:
        (actor?.name ?? "Actor")
        + " has no equipped melee weapon with a usable attack activity.",
    };
  } catch (error) {
    return {
      kind: "owned-weapon-attack",
      message: "Owned weapon attack preflight failed.",
      error,
    };
  }
}

async function createOwnedWeaponAttackMarker({
  item,
  sourceActor,
  target,
  artifactId,
}) {
  const targetActor = target?.actor;
  if (!targetActor) return false;
  const existing = Array.from(targetActor.effects ?? []).filter(effect =>
    compilerArtifactIds(effect).includes(artifactId)
    && String(arcaneEffectFlag(effect, "sourceActorUuid") ?? "")
      === String(sourceActor.uuid)
  );
  if (existing.length) {
    await targetActor.deleteEmbeddedDocuments(
      "ActiveEffect",
      existing.map(effect => effect.id),
    );
  }
  const data = effectDataFromItem(
    item,
    effect => compilerArtifactIds(effect).includes(artifactId),
    sourceActor,
  );
  if (!data) return false;
  data.flags ??= {};
  data.flags[MODULE_ID] = {
    ...(data.flags[MODULE_ID] ?? {}),
    sourceActorUuid: sourceActor.uuid,
    sourceItemUuid: item.uuid,
  };
  await targetActor.createEmbeddedDocuments("ActiveEffect", [data]);
  return true;
}

async function queueOwnedWeaponAttack(actor, task) {
  const key = String(actor?.uuid ?? actor?.id ?? "actor");
  const previous = OWNED_WEAPON_ATTACK_ACTOR_QUEUES.get(key)
    ?? Promise.resolve();
  const current = previous.catch(() => null).then(task);
  OWNED_WEAPON_ATTACK_ACTOR_QUEUES.set(key, current);
  try {
    return await current;
  } finally {
    if (OWNED_WEAPON_ATTACK_ACTOR_QUEUES.get(key) === current) {
      OWNED_WEAPON_ATTACK_ACTOR_QUEUES.delete(key);
    }
  }
}

async function cleanupOrphanedOwnedWeaponAttackDamageEffects(actor) {
  const ids = Array.from(actor?.effects ?? [])
    .filter(effect =>
      arcaneEffectFlag(effect, "ownedWeaponAttackDamage") === true
    )
    .map(effect => effect.id);
  if (!ids.length) return 0;
  await actor.deleteEmbeddedDocuments("ActiveEffect", ids);
  return ids.length;
}

async function applyOwnedWeaponAttackFromUse(item, usageConfig, workflow) {
  if (!workflow || workflow.aborted === true) return false;
  const resolved = resolveOwnedWeaponAttack(
    workflow?.actor ?? item?.actor,
    item,
    workflow?.activity,
  );
  if (!resolved?.rule) return false;
  if (!resolved.weapon || !resolved.activity) {
    throw new Error(
      "owned-weapon-attack-v1 found no equipped melee weapon attack",
    );
  }
  const targets = targetsFromUseConfig(workflow, usageConfig)
    .filter(candidate => candidate?.actor);
  if (targets.length !== 1) {
    throw new Error("owned-weapon-attack-v1 requires exactly one target");
  }
  const [target] = targets;
  const sourceActor = workflow.actor ?? item.actor;
  return queueOwnedWeaponAttack(sourceActor, async () => {
  await cleanupOrphanedOwnedWeaponAttackDamageEffects(sourceActor);
  const parentKey = String(
    workflow?.uuid ?? workflow?.id ?? workflow?.itemCardId ?? "workflow",
  ) + ":" + resolved.rule.id;
  workflow.__arcaneOwnedWeaponAttackRules ??= new Set();
  if (workflow.__arcaneOwnedWeaponAttackRules.has(parentKey)) return true;
  workflow.__arcaneOwnedWeaponAttackRules.add(parentKey);

  const hitRule = compilerRuntimeRulesForAdapter(
    item,
    "owned-weapon-attack-v1",
  ).find(rule =>
    rule.adapter?.phase === "hit"
    && rule.on?.operationId === resolved.operation.id
  );
  const damage = (hitRule?.operations ?? []).find(operation =>
    operation.type === "damage"
  );
  const formula = ownedWeaponAttackCantripFormula(
    damage?.formulaExpression,
    workflow.actor ?? item.actor,
    item,
  );
  let damageEffect = null;
  if (formula) {
    [damageEffect] = await sourceActor
      .createEmbeddedDocuments("ActiveEffect", [{
        name: item.name + ": Weapon Hit Damage",
        img: item.img,
        origin: item.uuid,
        transfer: false,
        disabled: false,
        changes: [{
          key: "system.bonuses.mwak.damage",
          mode: 2,
          value: formula + "[thunder]",
          priority: 20,
        }],
        flags: {
          [MODULE_ID]: {
            ownedWeaponAttackDamage: true,
            parentWorkflowUuid: workflow?.uuid ?? workflow?.id ?? null,
          },
          dae: {
            stackable: "noneName",
            showIcon: false,
            specialDuration: [],
          },
        },
        duration: {
          seconds: 6,
          startTime: game.time?.worldTime,
        },
        statuses: [],
        type: "base",
        system: {},
      }]);
  }

  let childWorkflow = null;
  const targetUuid = target?.document?.uuid ?? target?.uuid;
  try {
    childWorkflow = await MidiQOL.completeItemUse(
      resolved.weapon,
      {
        chooseActivity: false,
        configure: false,
        createMessage: true,
        midiOptions: {
          activityId: resolved.activity.id ?? resolved.activity._id,
          targetUuids: [targetUuid],
          targetsToUse: new Set([target]),
          ignoreUserTargets: true,
          fastForward: true,
          advantage: usageConfig?.midiOptions?.advantage === true,
          disadvantage: usageConfig?.midiOptions?.disadvantage === true,
          workflowOptions: {
            targetUuids: [targetUuid],
            sourceTokenUuid:
              workflow?.token?.document?.uuid
              ?? workflow?.tokenUuid
              ?? null,
            targetConfirmation: "none",
            arcaneOwnedWeaponAttackParent:
              workflow?.uuid ?? workflow?.id ?? null,
          },
        },
      },
      { configure: false },
      {},
    );
  } finally {
    if (damageEffect?.parent && damageEffect.id) {
      await damageEffect.parent
        .deleteEmbeddedDocuments("ActiveEffect", [damageEffect.id])
        .catch(() => null);
    }
  }
  if (!childWorkflow || childWorkflow.aborted === true) return true;
  const hitTargets = workflowOutcomeTargets(
    childWorkflow,
    null,
    "hit",
  );
  if (!hitTargets.length || !hitRule) return true;
  for (const application of (hitRule.operations ?? []).filter(operation =>
    operation.type === "apply-artifact"
  )) {
    for (const hitTarget of hitTargets) {
      await createOwnedWeaponAttackMarker({
        item,
        sourceActor,
        target: hitTarget,
        artifactId: application.artifactId,
      });
    }
  }
  return true;
  });
}

function compilerOperationResultReferences(value, output = []) {
  if (!value || typeof value !== "object") return output;
  if (
    value.type === "operation-result"
    && typeof value.operationId === "string"
  ) {
    output.push(value.operationId);
    return output;
  }
  for (const child of Object.values(value)) {
    if (Array.isArray(child)) {
      child.forEach(entry => compilerOperationResultReferences(entry, output));
    } else if (child && typeof child === "object") {
      compilerOperationResultReferences(child, output);
    }
  }
  return output;
}

function compilerLinkedOperationIds(rule) {
  const operations = rule?.operations ?? [];
  const byId = new Map(
    operations
      .filter(operation => operation.id)
      .map(operation => [operation.id, operation]),
  );
  const linked = new Set();
  for (const operation of operations) {
    const references = compilerOperationResultReferences(
      operation.formulaExpression ?? operation.formula,
    );
    if (references.length || operation.mitigation === "none") {
      if (operation.id) linked.add(operation.id);
      for (const operationId of references) {
        if (byId.has(operationId)) linked.add(operationId);
      }
    }
  }
  return linked;
}

async function compilerRuntimeExpressionValue(expression, {
  operationResults,
  item,
  usageConfig,
  workflow,
} = {}) {
  if (typeof expression === "number") return expression;
  if (!expression || typeof expression !== "object") {
    const number = Number(expression);
    if (!Number.isFinite(number)) {
      throw new Error("linked-operation-results-v1 requires a numeric expression");
    }
    return number;
  }
  if (expression.type === "constant") return Number(expression.value);
  if (expression.type === "operation-result") {
    const result = operationResults.get(expression.operationId);
    const amount = Number(result?.[expression.value === "rolled-amount" ? "rolledAmount" : ""]);
    if (!Number.isFinite(amount)) {
      throw new Error(
        "linked-operation-results-v1 cannot resolve " + expression.operationId
        + ":" + expression.value,
      );
    }
    return amount;
  }
  if (expression.type === "add") {
    let total = 0;
    for (const term of expression.terms ?? []) {
      total += await compilerRuntimeExpressionValue(term, {
        operationResults,
        item,
        usageConfig,
        workflow,
      });
    }
    return total;
  }
  if (expression.type === "multiply") {
    let total = 1;
    for (const factor of expression.factors ?? []) {
      total *= await compilerRuntimeExpressionValue(factor, {
        operationResults,
        item,
        usageConfig,
        workflow,
      });
    }
    return total;
  }
  if (expression.type === "round-down") {
    return Math.floor(await compilerRuntimeExpressionValue(expression.value, {
      operationResults,
      item,
      usageConfig,
      workflow,
    }));
  }
  if (expression.type === "cast-level") {
    return workflowCastLevel(item, usageConfig, workflow);
  }
  if (expression.type === "levels-above-base") {
    return Math.max(
      0,
      workflowCastLevel(item, usageConfig, workflow)
        - Math.max(0, Number(item?.system?.level) || 0),
    );
  }
  if (expression.type === "spellcasting-modifier") {
    const actor = workflow?.actor ?? item?.actor;
    return actorSpellcastingModifier(actor);
  }
  if (expression.type === "per-slot-above-base") {
    const base = await compilerRuntimeExpressionValue(expression.base, {
      operationResults,
      item,
      usageConfig,
      workflow,
    });
    const levels = Math.max(
      0,
      workflowCastLevel(item, usageConfig, workflow)
        - Math.max(0, Number(item?.system?.level) || 0),
    );
    let total = base;
    for (let index = 0; index < levels; index += 1) {
      total += await compilerRuntimeExpressionValue(expression.increment, {
        operationResults,
        item,
        usageConfig,
        workflow,
      });
    }
    return total;
  }
  if (expression.type === "cantrip-progression") {
    const base = await compilerRuntimeExpressionValue(expression.base, {
      operationResults,
      item,
      usageConfig,
      workflow,
    });
    const increment = await compilerRuntimeExpressionValue(
      expression.increment,
      {
        operationResults,
        item,
        usageConfig,
        workflow,
      },
    );
    const directIncrease = Number(item?.system?.scalingIncrease);
    let scalingIncrease =
      Number.isFinite(directIncrease) && directIncrease >= 0
        ? directIncrease
        : Number.NaN;
    if (!Number.isFinite(scalingIncrease)) {
      const actor = workflow?.actor ?? item?.actor;
      const cantripLevel = Number(actor?.system?.cantripLevel?.(item));
      scalingIncrease =
        Number.isFinite(cantripLevel) && cantripLevel >= 0
          ? Math.floor((cantripLevel + 1) / 6)
          : 0;
    }
    return base + scalingIncrease * increment;
  }
  if (expression.type === "tiers") {
    const selector = await compilerRuntimeExpressionValue(expression.selector, {
      operationResults,
      item,
      usageConfig,
      workflow,
    });
    const entry = [...(expression.entries ?? [])]
      .sort((left, right) => Number(right.minimum) - Number(left.minimum))
      .find(candidate => selector >= Number(candidate.minimum));
    if (!entry) {
      throw new Error("linked-operation-results-v1 tiers expression has no matching entry");
    }
    return compilerRuntimeExpressionValue(entry.value, {
      operationResults,
      item,
      usageConfig,
      workflow,
    });
  }
  if (expression.type === "dice") {
    const roll = await new Roll(
      String(expression.count) + "d" + String(expression.faces),
    ).evaluate();
    if (game.dice3d) await game.dice3d.showForRoll(roll, game.user);
    return Number(roll.total ?? 0);
  }
  throw new Error(
    "linked-operation-results-v1 cannot evaluate expression " + expression.type,
  );
}

function compilerOperationActors(operation, rule, actor, workflow, usageConfig) {
  if (operation.target === "source") return actor ? [actor] : [];
  const target = (rule?.targets ?? []).find(candidate =>
    candidate.semanticId === operation.target
  );
  if (!target) {
    throw new Error(
      "linked-operation-results-v1 cannot resolve target " + operation.target,
    );
  }
  if (!["selected", "event-binding"].includes(target.origin?.type)) {
    throw new Error(
      "linked-operation-results-v1 does not support target origin "
      + target.origin?.type,
    );
  }
  return targetsFromUseConfig(workflow, usageConfig)
    .map(target => target?.actor)
    .filter(Boolean);
}

async function applyLinkedOperationResultsFromUse(item, usageConfig, workflow) {
  if (!workflow || workflow.aborted === true) return false;
  const rules = compilerRuntimeRulesForAdapter(item, "linked-operation-results-v1");
  if (!rules.length) return false;
  const semanticActionId = workflowSemanticActionId(workflow);
  const matchingRules = rules.filter(rule =>
    rule.trigger === "action-used"
    && (!rule.sourceActionId || rule.sourceActionId === semanticActionId)
  );
  if (!matchingRules.length) return false;

  const actor = workflow?.actor ?? item?.actor;
  if (!actor) return false;
  workflow.__arcaneLinkedOperationRules ??= new Set();
  for (const currentRule of matchingRules) {
    const dedupeKey = String(
      workflow?.uuid ?? workflow?.id ?? workflow?.itemCardId ?? "workflow",
    ) + ":" + currentRule.id;
    if (workflow.__arcaneLinkedOperationRules.has(dedupeKey)) continue;
    const linkedIds = compilerLinkedOperationIds(currentRule);
    const operationResults = new Map();
    const summaries = [];
    for (const currentOperation of currentRule.operations ?? []) {
      if (!linkedIds.has(currentOperation.id)) continue;
      const targets = compilerOperationActors(
        currentOperation,
        currentRule,
        actor,
        workflow,
        usageConfig,
      );
      if (!targets.length) continue;
      if (currentOperation.type === "damage") {
        const castLevel = workflowCastLevel(item, usageConfig, workflow);
        const minSlotLevel = Math.max(1, Number(item?.system?.level) || 1);
        const formula = compilerRiderDamageFormula(
          currentOperation,
          castLevel,
          minSlotLevel,
        );
        const roll = await new Roll(formula).evaluate();
        if (game.dice3d) await game.dice3d.showForRoll(roll, game.user);
        const amount = Math.max(0, Number(roll.total ?? 0));
        operationResults.set(currentOperation.id, { rolledAmount: amount });
        for (const targetActor of targets) {
          if (currentOperation.mitigation === "none") {
            await targetActor.applyDamage(amount, { ignore: true });
          } else {
            const damageType = currentOperation.damageTypes?.[0] ?? "none";
            await targetActor.applyDamage([{ value: amount, type: damageType }]);
          }
        }
        summaries.push(currentOperation.id + " " + roll.formula + " = " + amount);
        continue;
      }
      if (currentOperation.type === "healing") {
        const amount = Math.max(
          0,
          await compilerRuntimeExpressionValue(
            currentOperation.formulaExpression ?? currentOperation.formula,
            {
              operationResults,
              item,
              usageConfig,
              workflow,
            },
          ),
        );
        operationResults.set(currentOperation.id, { rolledAmount: amount });
        for (const targetActor of targets) {
          await targetActor.applyDamage(
            [{ value: amount, type: "healing" }],
            { only: "healing" },
          );
        }
        summaries.push(currentOperation.id + " = " + amount);
        continue;
      }
      throw new Error(
        "linked-operation-results-v1 cannot execute operation "
        + currentOperation.type,
      );
    }
    if (summaries.length) {
      await ChatMessage.create({
        user: game.user?.id,
        speaker: ChatMessage.getSpeaker({ actor }),
        flags: {
          [MODULE_ID]: {
            type: "linked-operation-results",
            ruleId: currentRule.id,
            results: Object.fromEntries(operationResults),
          },
        },
        content: "<p><strong>" + item.name + ":</strong> "
          + summaries.join("; ") + ".</p>",
      });
    }
    workflow.__arcaneLinkedOperationRules.add(dedupeKey);
  }
  return true;
}

async function applyLifeTransferenceFromUse(item, usageConfig, workflow) {
  if (item?.system?.identifier !== "life-transference" || workflow?.aborted === true) return true;
  const compilerManaged = Boolean(item?.flags?.[MODULE_ID]?.compiler?.version);
  const legacyRules = compilerRuntimeRulesForAdapter(item, "life-transference-v1");
  if (compilerManaged && !legacyRules.length) return true;
  const actor = workflow?.actor ?? item?.actor;
  const target = targetsFromUseConfig(workflow, usageConfig)[0];
  if (!actor || !target?.actor) return true;
  const castLevel = workflowCastLevel(item, usageConfig, workflow);
  const dice = 4 + Math.max(0, castLevel - 3);
  const roll = await new Roll(String(dice) + "d8[necrotic]").evaluate();
  if (game.dice3d) await game.dice3d.showForRoll(roll, game.user);
  const damage = Math.max(0, Number(roll.total ?? 0));
  const casterBefore = Number(actor.system?.attributes?.hp?.value ?? 0);
  const targetBefore = Number(target.actor.system?.attributes?.hp?.value ?? 0);
  await actor.applyDamage(damage, { ignore: true });
  await target.actor.applyDamage(
    [{ value: damage * 2, type: "healing" }],
    { only: "healing" },
  );
  const casterAfter = Number(actor.system?.attributes?.hp?.value ?? 0);
  const targetAfter = Number(target.actor.system?.attributes?.hp?.value ?? 0);
  await ChatMessage.create({
    user: game.user?.id,
    speaker: ChatMessage.getSpeaker({ actor }),
    flags: {
      [MODULE_ID]: {
        type: "life-transference",
        castLevel,
        damage,
        healing: damage * 2,
      },
    },
    content: "<p><strong>Life Transference:</strong> " + roll.formula + " = " + damage
      + " necrotic damage (" + casterBefore + " → " + casterAfter + "). "
      + target.name + " heals up to " + (damage * 2) + " HP (" + targetBefore + " → " + targetAfter + ").</p>",
  });
  return true;
}

function temporaryHitPointsSourceContract(effect) {
  const value = arcaneEffectFlag(effect, "temporaryHitPointsSource");
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Number(value.version) === 1
    ? value
    : null;
}

function temporaryHitPointsSourceInstance(effect) {
  const value = arcaneEffectFlag(effect, "temporaryHitPointsSourceInstance");
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Number(value.version) === 1
    ? value
    : null;
}

function temporaryHitPointsRefreshContract(effect) {
  const value = arcaneEffectFlag(effect, "temporaryHitPointsRefresh");
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Number(value.version) === 1
    ? value
    : null;
}

function externalOperationArtifactTransitionContracts(effect, role = null) {
  const values = arcaneEffectFlag(effect, "externalOperationArtifactTransitions");
  return (Array.isArray(values) ? values : []).filter(value =>
    value
    && typeof value === "object"
    && Number(value.version) === 1
    && (!role || value.role === role)
  );
}

function temporaryHitPointsSourceEffects(actor, {
  depletedOnly = false,
} = {}) {
  return Array.from(actor?.effects ?? []).filter(effect => {
    if (
      effect.disabled === true
      || effect.active === false
      || effect.isSuppressed === true
    ) return false;
    const contract = temporaryHitPointsSourceContract(effect);
    return Boolean(contract && (!depletedOnly || contract.depletionRuleId));
  });
}

async function temporaryHitPointsAmountForRule(
  rule,
  item,
  usageConfig,
  workflow,
) {
  const adapter = runtimeRuleAdapterData(rule);
  if (adapter.initialGrant === false) return 0;
  const operation = (rule.operations ?? []).find(current =>
    current.type === "grant-temporary-hp"
    && (
      !adapter.grantOperationId
      || current.id === adapter.grantOperationId
    )
  );
  if (!operation) {
    throw new Error("temporary-hit-points-source-v1 requires grant-temporary-hp");
  }
  const expression = operation.formulaExpression;
  if (expression) {
    const amount = await compilerRuntimeExpressionValue(expression, {
      operationResults: new Map(),
      item,
      usageConfig,
      workflow,
    });
    return Math.max(0, Number(amount) || 0);
  }
  const workflowAmount = temporaryHitPointsGrantedByWorkflow(workflow);
  if (Number.isFinite(workflowAmount) && workflowAmount >= 0) {
    return workflowAmount;
  }
  const formula = Number(operation.formula);
  return Number.isFinite(formula) ? Math.max(0, formula) : 0;
}

async function bindTemporaryHitPointsSourcesFromUse(
  item,
  usageConfig,
  workflow,
) {
  if (
    !isPrimaryAutomationGM()
    || !item
    || workflow?.aborted === true
  ) return true;
  const rules = compilerRuntimeRulesForAdapter(
    item,
    "temporary-hit-points-source-v1",
  ).filter(rule => runtimeRuleAdapterData(rule).phase === "bind");
  if (!rules.length) return true;
  const sourceActor = workflow?.actor ?? item?.actor;
  if (!sourceActor) return true;
  const castLevel = workflowCastLevel(item, usageConfig, workflow);
  const targets = targetsFromUseConfig(workflow, usageConfig);
  for (const rule of rules) {
    const adapter = runtimeRuleAdapterData(rule);
    const artifactId = String(adapter.artifactId ?? "").trim();
    if (!artifactId) {
      throw new Error("temporary-hit-points-source-v1 bind rule requires artifactId");
    }
    const amount = await temporaryHitPointsAmountForRule(
      rule,
      item,
      usageConfig,
      workflow,
    );
    for (const target of targets) {
      const actor = target?.actor;
      if (!actor) continue;
      let effect = newestEffect(
        compilerEffectsForArtifact(actor, artifactId, item),
      );
      if (!effect) {
        effect = await createCompilerArtifactEffect(
          item,
          actor,
          artifactId,
        );
      }
      if (!effect) {
        throw new Error(
          "temporary-hit-points-source-v1 could not materialize artifact "
          + artifactId,
        );
      }
      await effect.update({
        ["flags." + MODULE_ID + ".sourceActorUuid"]: sourceActor.uuid,
        ["flags." + MODULE_ID + ".temporaryHitPointsSourceInstance"]: {
          version: 1,
          artifactId,
          sourceActorUuid: sourceActor.uuid,
          sourceItemUuid: item.uuid,
          castLevel,
          grantedAmount: amount,
          runtimeRuleId: rule.id,
        },
      });
    }
  }
  return true;
}

async function cleanupTemporaryHitPointsSourcesAfterDamage(actor) {
  if (!isPrimaryAutomationGM()) return true;
  if (!actor || Number(actor.system?.attributes?.hp?.temp ?? 0) > 0) return true;
  const effects = temporaryHitPointsSourceEffects(actor, {
    depletedOnly: true,
  });
  if (effects.length) {
    await actor.deleteEmbeddedDocuments(
      "ActiveEffect",
      effects.map(effect => effect.id),
    );
  }
  return true;
}

async function cleanupTemporaryHitPointsSourceOnDelete(effect, options = {}) {
  const contract = temporaryHitPointsSourceContract(effect);
  const instance = temporaryHitPointsSourceInstance(effect);
  if (!contract || !instance || !isPrimaryAutomationGM()) return true;
  if (options?.existing === "effect-stacking") return true;
  const actor = effect.parent;
  if (!actor?.update) return true;
  const current = Math.max(
    0,
    Number(actor.system?.attributes?.hp?.temp ?? 0) || 0,
  );
  const removedAmount = Math.max(0, Number(instance.grantedAmount ?? 0) || 0);
  if (current <= 0 || current > removedAmount) return true;
  const survivingAmount = temporaryHitPointsSourceEffects(actor)
    .filter(currentEffect => currentEffect.id !== effect.id)
    .map(currentEffect =>
      Number(
        temporaryHitPointsSourceInstance(currentEffect)?.grantedAmount ?? 0,
      ) || 0
    )
    .reduce((maximum, value) => Math.max(maximum, value), 0);
  await actor.update({
    "system.attributes.hp.temp": survivingAmount,
  });
  return true;
}

async function temporaryHitPointsRefreshAmount(effect) {
  const contract = temporaryHitPointsRefreshContract(effect);
  const instance = temporaryHitPointsSourceInstance(effect);
  if (!contract || !instance) return null;
  const sourceItem = instance.sourceItemUuid
    ? await fromUuid(instance.sourceItemUuid).catch(() => null)
    : null;
  const sourceActor = instance.sourceActorUuid
    ? await fromUuid(instance.sourceActorUuid).catch(() => null)
    : sourceItem?.actor ?? null;
  const castLevel = Math.min(
    9,
    Math.max(
      Number(sourceItem?.system?.level ?? 1),
      Number(instance.castLevel ?? sourceItem?.system?.level ?? 1),
    ),
  );
  let amount = Number.NaN;
  if (contract.amount?.formulaExpression && sourceItem && sourceActor) {
    amount = await compilerRuntimeExpressionValue(
      contract.amount.formulaExpression,
      {
        operationResults: new Map(),
        item: sourceItem,
        usageConfig: { spellLevel: castLevel },
        workflow: {
          actor: sourceActor,
          item: sourceItem,
          castData: { castLevel },
        },
      },
    );
  }
  if (!Number.isFinite(Number(amount))) {
    amount = Number(contract.amount?.formula);
  }
  if (!Number.isFinite(Number(amount))) {
    amount = Number(instance.grantedAmount ?? 0);
  }
  return {
    amount: Math.max(0, Number(amount) || 0),
    castLevel,
    sourceActorUuid: sourceActor?.uuid ?? instance.sourceActorUuid,
    sourceItemUuid: sourceItem?.uuid ?? instance.sourceItemUuid,
  };
}

async function refreshTemporaryHitPointsSourcesAtTurnStart(combat, changed) {
  if (!isPrimaryAutomationGM()) return true;
  if (!("turn" in changed) && !("round" in changed)) return true;
  const actor = combat?.combatant?.actor;
  if (!actor) return true;
  const effects = Array.from(actor.effects ?? []).filter(effect =>
    effect.disabled !== true
    && effect.active !== false
    && effect.isSuppressed !== true
    && temporaryHitPointsRefreshContract(effect)
    && temporaryHitPointsSourceInstance(effect)
  );
  if (!effects.length) return true;
  let amount = 0;
  for (const effect of effects) {
    const refreshed = await temporaryHitPointsRefreshAmount(effect);
    if (!refreshed) continue;
    amount = Math.max(amount, refreshed.amount);
    const instance = temporaryHitPointsSourceInstance(effect);
    if (
      Number(instance?.grantedAmount ?? 0) !== refreshed.amount
      || instance?.sourceActorUuid !== refreshed.sourceActorUuid
      || instance?.sourceItemUuid !== refreshed.sourceItemUuid
      || Number(instance?.castLevel ?? 0) !== refreshed.castLevel
    ) {
      await effect.update({
        ["flags." + MODULE_ID + ".temporaryHitPointsSourceInstance"]: {
          ...instance,
          version: 1,
          artifactId:
            instance?.artifactId
            ?? temporaryHitPointsRefreshContract(effect)?.artifactId,
          sourceActorUuid: refreshed.sourceActorUuid,
          sourceItemUuid: refreshed.sourceItemUuid,
          castLevel: refreshed.castLevel,
          grantedAmount: refreshed.amount,
        },
      });
    }
  }
  const current = Math.max(
    0,
    Number(actor.system?.attributes?.hp?.temp ?? 0) || 0,
  );
  if (current < amount) {
    await actor.update({ "system.attributes.hp.temp": amount });
  }
  return true;
}

function arcaneEffectFlag(effect, key) {
  return effect?.getFlag?.(MODULE_ID, key) ?? effect?.flags?.[MODULE_ID]?.[key];
}

function compilerRuntimeModifiers(effect, type = null) {
  const value = arcaneEffectFlag(effect, "runtimeModifiers");
  const modifiers = value instanceof Set
    ? Array.from(value)
    : Array.isArray(value)
      ? value
      : [];
  return modifiers.filter(modifier =>
    modifier
    && typeof modifier === "object"
    && !Array.isArray(modifier)
    && (!type || modifier.type === type)
  );
}

function activeCompilerRuntimeEffects(actor, type) {
  return Array.from(actor?.effects ?? []).filter(effect =>
    effect?.disabled !== true
    && effect?.active !== false
    && effect?.isSuppressed !== true
    && compilerRuntimeModifiers(effect, type).length > 0
  );
}

function effectiveActivityActivationType(item, activity) {
  const itemType = String(item?.system?.activation?.type ?? "");
  const activityType = String(activity?.activation?.type ?? "");
  return activity?.activation?.override === true
    ? activityType || itemType
    : itemType || activityType;
}

function blockedActionForActor(actor, item, activity) {
  if (!actor) return null;
  const activationType = effectiveActivityActivationType(item, activity);
  const isSpell = item?.type === "spell";
  const isAttack = activity?.type === "attack";
  const isReaction = activationType === "reaction";
  const isAction = activationType === "action";
  if (!isSpell && !isAttack && !isReaction && !isAction) return null;
  for (const effect of Array.from(actor.effects ?? [])) {
    if (
      effect?.disabled === true
      || effect?.active === false
      || effect?.isSuppressed === true
    ) continue;
    const kinds = arcaneEffectFlag(effect, "blockedActionKinds");
    const values = kinds instanceof Set
      ? Array.from(kinds)
      : Array.isArray(kinds)
        ? kinds
        : [];
    const kind = isReaction && values.includes("reaction")
      ? "reaction"
      : isAction && values.includes("action")
        ? "action"
        : isSpell && values.includes("spell")
          ? "spell"
          : isAttack && values.includes("attack")
            ? "attack"
            : null;
    if (kind) {
      return {
        kind,
        effectId: effect.id ?? null,
        effectName: effect.name ?? effect.label ?? null,
      };
    }
  }
  return null;
}

function spellCastLevel(item, usageConfig, workflow) {
  const values = [
    workflow?.castData?.castLevel,
    workflow?.options?.spellLevel,
    workflow?.workflowOptions?.spellLevel,
    usageConfig?.midiOptions?.spellLevel,
    usageConfig?.spellLevel,
    item?.system?.level,
  ];
  for (const value of values) {
    const level = Number(value);
    if (Number.isFinite(level) && level > 0) return Math.min(9, Math.max(1, level));
  }
  return Math.max(1, Number(item?.system?.level ?? 1) || 1);
}

function actorSpellcastingModifier(actor) {
  const ability = String(
    actor?.system?.attributes?.spellcasting
    ?? actor?.system?.attributes?.spell?.ability
    ?? ""
  );
  const direct = Number(actor?.system?.attributes?.spell?.mod);
  if (Number.isFinite(direct)) return direct;
  const modifier = Number(actor?.system?.abilities?.[ability]?.mod);
  return Number.isFinite(modifier) ? modifier : 0;
}

function effectForArcaneFlag(actor, key) {
  return Array.from(actor?.effects ?? []).find(effect => effect.disabled !== true && arcaneEffectFlag(effect, key) === true);
}

const SOURCE_TARGET_DAMAGE_MIRROR_CLEANUP = new Set();
const COMPILER_SOURCE_TERMINATION_QUEUES = new Map();

function compilerSourceTerminationContract(effect) {
  const value = arcaneEffectFlag(effect, "sourceTermination");
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Number(value.version) === 1
    && value.policy === "last-dependent-ended"
    && typeof value.artifactId === "string"
    && value.artifactId.length > 0
    ? value
    : null;
}

function liveMatchingSourceDependents(sourceEffect, contract, deletedEffect) {
  const dependents = typeof sourceEffect?.getDependents === "function"
    ? sourceEffect.getDependents()
    : [];
  return dependents.filter(candidate => {
    if (
      !candidate
      || candidate === deletedEffect
      || candidate.uuid === deletedEffect?.uuid
      || candidate.documentName !== "ActiveEffect"
      || candidate.parent?.effects?.get?.(candidate.id) !== candidate
    ) return false;
    const candidateContract = compilerSourceTerminationContract(candidate);
    return (
      candidateContract?.policy === contract.policy
      && candidateContract.artifactId === contract.artifactId
      && String(candidate.flags?.dnd5e?.dependentOn ?? "")
        === String(sourceEffect.uuid ?? "")
    );
  });
}

async function cleanupCompilerSourceWhenLastDependentEnds(effect, options = {}) {
  if (!isPrimaryAutomationGM()) return true;
  // DAE's none/noneName replacement deletes the old document from inside
  // preCreateActiveEffect and marks that deletion with this option. The new
  // dependent is guaranteed by the same create transaction, so treating the
  // intentional replacement gap as a real last-dependent exit would wrongly
  // delete concentration.
  if (options?.existing === "effect-stacking") return true;
  const contract = compilerSourceTerminationContract(effect);
  const sourceEffectUuid = String(
    effect?.flags?.dnd5e?.dependentOn ?? "",
  ).trim();
  if (!contract || !sourceEffectUuid) return true;
  const lockKey = [
    sourceEffectUuid,
    contract.policy,
    contract.artifactId,
  ].join(":");
  const previous = COMPILER_SOURCE_TERMINATION_QUEUES.get(lockKey)
    ?? Promise.resolve();
  const task = previous
    .catch(() => undefined)
    .then(async () => {
      // Let dnd5e unregister this child, then re-evaluate after every earlier
      // deletion for the same source. A skipped concurrent hook can otherwise
      // leave a stale concentration effect behind.
      await Promise.resolve();
      const sourceEffect = await fromUuid(sourceEffectUuid).catch(() => null);
      if (
        sourceEffect?.documentName !== "ActiveEffect"
        || !sourceEffect.parent
        || sourceEffect.parent.effects?.get?.(sourceEffect.id) !== sourceEffect
        || liveMatchingSourceDependents(sourceEffect, contract, effect).length > 0
      ) return true;

      await sourceEffect.parent.deleteEmbeddedDocuments(
        "ActiveEffect",
        [sourceEffect.id],
        {
          arcaneCompilerSourceTermination: {
            version: 1,
            policy: contract.policy,
            artifactId: contract.artifactId,
          },
        },
      );
      return true;
    });
  COMPILER_SOURCE_TERMINATION_QUEUES.set(lockKey, task);
  try {
    await task;
  } finally {
    if (COMPILER_SOURCE_TERMINATION_QUEUES.get(lockKey) === task) {
      COMPILER_SOURCE_TERMINATION_QUEUES.delete(lockKey);
    }
  }
  return true;
}

function runtimeRuleAdapterData(rule) {
  return rule?.adapter && typeof rule.adapter === "object"
    ? rule.adapter
    : {};
}

function sourceTargetDamageMirrorBindings(item) {
  const rules = compilerRuntimeRulesForAdapter(item, "source-target-damage-mirror-v1");
  const bindings = new Map();
  for (const rule of rules) {
    const adapter = runtimeRuleAdapterData(rule);
    const relation = adapter.relation && typeof adapter.relation === "object"
      ? adapter.relation
      : adapter;
    const sourceArtifactId = String(
      relation.sourceArtifactId
      ?? adapter.sourceArtifactId
      ?? "",
    ).trim();
    const targetArtifactId = String(
      relation.targetArtifactId
      ?? adapter.targetArtifactId
      ?? "",
    ).trim();
    if (!sourceArtifactId || !targetArtifactId) continue;
    const key = sourceArtifactId + ":" + targetArtifactId;
    const current = bindings.get(key) ?? {
      sourceArtifactId,
      targetArtifactId,
      runtimeRuleIds: [],
    };
    current.runtimeRuleIds.push(rule.id);
    bindings.set(key, current);
  }
  for (const effect of item?.effects ?? []) {
    const contract = effect?.flags?.[MODULE_ID]?.sourceTargetDamageMirror;
    if (
      !contract
      || typeof contract !== "object"
      || Number(contract.version) !== 1
    ) continue;
    const sourceArtifactId = String(contract.sourceArtifactId ?? "").trim();
    const targetArtifactId = String(contract.targetArtifactId ?? "").trim();
    if (!sourceArtifactId || !targetArtifactId) continue;
    const key = sourceArtifactId + ":" + targetArtifactId;
    const current = bindings.get(key) ?? {
      sourceArtifactId,
      targetArtifactId,
      runtimeRuleIds: [],
    };
    current.runtimeRuleIds.push(
      ...rules.map(rule => rule.id),
      ...(contract.runtimeRuleId ? [contract.runtimeRuleId] : []),
    );
    bindings.set(key, current);
  }
  return [...bindings.values()];
}

function sourceTargetDamageMirrorContract(effect) {
  const value = arcaneEffectFlag(effect, "sourceTargetDamageMirror");
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Number(value.version) === 1
    ? value
    : null;
}

function compilerEffectMatchesItem(effect, item) {
  if (!item) return true;
  const flags = effect?.flags?.[MODULE_ID] ?? {};
  const identifier = String(item.system?.identifier ?? "").trim();
  return (
    (identifier && String(flags.identifier ?? "") === identifier)
    || String(flags.sourceSpellId ?? "") === String(item.id ?? "")
    || String(effect.origin ?? "") === String(item.uuid ?? "")
  );
}

function compilerEffectOriginatesFromItem(effect, item) {
  if (!item?.uuid) return false;
  const flags = effect?.flags?.[MODULE_ID] ?? {};
  const itemUuid = String(item.uuid);
  if (
    String(effect?.origin ?? "") === itemUuid
    || String(flags.sourceItemUuid ?? "") === itemUuid
    || String(effect?.flags?.core?.sourceId ?? "") === itemUuid
  ) return true;

  // Concentration automation makes the caster's concentration effect the
  // dependent effect's origin. Resolve that document so runtime selection can
  // still bind to the exact actor-owned item, including concurrent casts of
  // the same spell from different sources.
  if (typeof globalThis.fromUuidSync !== "function") return false;
  const provenanceUuids = [...new Set([
    effect?.origin,
    effect?.flags?.dnd5e?.dependentOn,
  ].map(value => String(value ?? "")).filter(Boolean))];
  for (const provenanceUuid of provenanceUuids) {
    try {
      const originDocument = globalThis.fromUuidSync(provenanceUuid);
      if (
        String(originDocument?.origin ?? "") === itemUuid
        || String(originDocument?.flags?.dnd5e?.item?.uuid ?? "") === itemUuid
        || String(originDocument?.flags?.core?.sourceId ?? "") === itemUuid
      ) return true;
    } catch (_error) {
      // A stale origin must not hide a valid dependentOn provenance link.
    }
  }
  return false;
}

function compilerEffectsForArtifact(actor, artifactId, item = null) {
  return Array.from(actor?.effects ?? []).filter(effect =>
    effect.disabled !== true
    && effect.active !== false
    && effect.isSuppressed !== true
    && compilerArtifactIds(effect).includes(artifactId)
    && (!item || compilerEffectOriginatesFromItem(effect, item))
  );
}

function newestEffect(effects) {
  return [...effects].sort((left, right) =>
    Number(right?._stats?.createdTime ?? 0)
    - Number(left?._stats?.createdTime ?? 0)
  )[0] ?? null;
}

async function createCompilerArtifactEffect(item, actor, artifactId) {
  const sourceActor = item?.actor ?? item?.parent;
  const data = effectDataFromItem(
    item,
    effect => compilerArtifactIds(effect).includes(artifactId),
    sourceActor,
  );
  if (!data) return null;
  data.flags ??= {};
  data.flags[MODULE_ID] = {
    ...(data.flags[MODULE_ID] ?? {}),
    sourceActorUuid: sourceActor?.uuid,
    sourceItemUuid: item?.uuid,
    targetUuid: actor?.uuid,
  };
  const [created] = await actor.createEmbeddedDocuments("ActiveEffect", [data]);
  return created ?? null;
}

async function applyCompilerArtifactEndedOutcomes(effect, options) {
  if (!isPrimaryAutomationGM()) return true;
  if (options?.existing === "effect-stacking") return true;
  const hostActor = effect?.parent;
  if (hostActor?.documentName !== "Actor") return true;
  const artifactIds = compilerArtifactIds(effect);
  if (!artifactIds.length) return true;
  const expectedSourceActorUuid = String(
    arcaneEffectFlag(effect, "sourceActorUuid")
    ?? arcaneEffectFlag(effect, "sourceUuid")
    ?? "",
  ).trim() || null;
  const sourceItem = await sourceItemForTriggeredEffect(effect, {
    actorOwned: true,
    sourceActorUuid: expectedSourceActorUuid,
  });
  if (sourceItem?.documentName !== "Item") return true;
  const sourceActor = sourceItem.actor ?? sourceItem.parent;
  if (
    sourceActor?.documentName !== "Actor"
    || (expectedSourceActorUuid && sourceActor.uuid !== expectedSourceActorUuid)
  ) return true;
  const rules = (
    sourceItem.flags?.[MODULE_ID]?.spellAutomation?.runtimePlan?.rules ?? []
  ).filter(rule =>
    rule.adapter?.adapter === "artifact-ended-outcome-v1"
    && artifactIds.includes(rule.adapter?.sourceArtifactId)
  );
  for (const rule of rules) {
    const outcomeArtifactId = rule.adapter?.outcomeArtifactId;
    if (!outcomeArtifactId) continue;
    if (compilerEffectsForArtifact(hostActor, outcomeArtifactId, sourceItem).length) {
      continue;
    }
    await createCompilerArtifactEffect(sourceItem, hostActor, outcomeArtifactId);
  }
  return true;
}

async function applySourceArtifactsFromUse(item, usageConfig, workflow) {
  if (!workflow || workflow.aborted === true) return true;
  const activity = workflow?.activity;
  const artifactIds = activity?.flags?.[MODULE_ID]?.applySourceArtifacts ?? [];
  if (!artifactIds.length) return true;
  const sourceActor = workflow?.actor ?? item?.actor;
  if (!sourceActor) return true;
  const concentrationEffect = Array.from(sourceActor.effects ?? []).find(effect => {
    const statuses = effect.statuses instanceof Set
      ? Array.from(effect.statuses)
      : Array.from(effect.statuses ?? []);
    return (
      statuses.includes("concentrating")
      && String(effect.origin ?? "") === String(item?.uuid ?? "")
    );
  }) ?? null;
  const dependents = globalThis.dnd5e?.registry?.dependents
    ?? game.dnd5e?.registry?.dependents;
  const castLevel = workflowCastLevel(item, usageConfig, workflow);
  for (const artifactId of artifactIds) {
    const existing = compilerEffectsForArtifact(sourceActor, artifactId, item);
    if (existing.length) {
      await sourceActor.deleteEmbeddedDocuments(
        "ActiveEffect",
        existing.map(effect => effect.id),
      );
    }
    const created = await createCompilerArtifactEffect(item, sourceActor, artifactId);
    if (created) {
      await created.setFlag(MODULE_ID, "sourceCastLevel", castLevel);
    }
    if (created && concentrationEffect) {
      await created.setFlag("dnd5e", "dependentOn", concentrationEffect.uuid);
      dependents?.track?.(concentrationEffect.uuid, created);
    }
  }
  return true;
}

async function applySourceArtifactDismissFromUse(item, usageConfig, workflow) {
  if (
    !isPrimaryAutomationGM()
    || !item
    || workflow?.aborted === true
  ) return true;
  const semanticActionId = workflowSemanticActionId(workflow);
  const rules = compilerRuntimeRulesForAdapter(
    item,
    "source-artifact-dismiss-v1",
  ).filter(rule =>
    !rule.sourceActionId || rule.sourceActionId === semanticActionId
  );
  if (!rules.length) return true;
  if (rules.length !== 1) {
    throw new Error(
      "source-artifact-dismiss-v1 requires exactly one rule for the used action",
    );
  }
  const actor = workflow?.actor ?? item?.actor;
  const rule = rules[0];
  const adapter = runtimeRuleAdapterData(rule);
  const artifactId = String(adapter.artifactId ?? "").trim();
  if (!actor || !artifactId) {
    throw new Error(
      "source-artifact-dismiss-v1 could not resolve its source actor or artifact",
    );
  }
  workflow.__arcaneSourceArtifactDismissed ??= new Set();
  workflow.__arcaneSourceArtifactDismissReservations ??= new Set();
  const effects = compilerEffectsForArtifact(actor, artifactId, item);
  if (effects.length !== 1) {
    throw new Error(
      "source-artifact-dismiss-v1 expected one exact " + artifactId
      + " effect; found " + effects.length,
    );
  }
  const receiptKey = [
    workflow?.uuid ?? workflow?.id ?? "workflow",
    rule.id,
    actor.uuid,
    effects[0].uuid ?? effects[0].id,
  ].join(":");
  if (
    workflow.__arcaneSourceArtifactDismissed.has(receiptKey)
    || workflow.__arcaneSourceArtifactDismissReservations.has(receiptKey)
  ) return true;
  workflow.__arcaneSourceArtifactDismissReservations.add(receiptKey);
  try {
    await actor.deleteEmbeddedDocuments("ActiveEffect", [effects[0].id]);
    workflow.__arcaneSourceArtifactDismissed.add(receiptKey);
  } finally {
    workflow.__arcaneSourceArtifactDismissReservations.delete(receiptKey);
  }
  return true;
}

const SOURCE_BOUND_ONE_SHOT_RESERVATIONS = new Map();
const SOURCE_BOUND_ONE_SHOT_FLAG = "sourceBoundOneShots";

function sourceBoundOneShotRules(item, semanticActionId) {
  return compilerRuntimeRulesForAdapter(
    item,
    "source-bound-one-shot-v1",
  ).filter(rule =>
    !rule.sourceActionId || rule.sourceActionId === semanticActionId
  );
}

function sourceBoundOneShotActorState(actor) {
  const state = actor?.getFlag?.(MODULE_ID, SOURCE_BOUND_ONE_SHOT_FLAG)
    ?? actor?.flags?.[MODULE_ID]?.[SOURCE_BOUND_ONE_SHOT_FLAG]
    ?? {};
  if (!state || typeof state !== "object" || Array.isArray(state)) {
    throw new Error("source-bound-one-shot-v1 actor state must be an object");
  }
  return state;
}

function sourceBoundOneShotPrunedState(actor, state) {
  const liveEffectIds = new Set(
    Array.from(actor?.effects ?? []).map(effect => String(effect?.id ?? "")),
  );
  return Object.fromEntries(
    Object.entries(state).filter(([effectId]) => liveEffectIds.has(effectId)),
  );
}

function sourceBoundOneShotReservationKey(effect) {
  return String(effect?.uuid ?? effect?.id ?? "");
}

function sourceBoundOneShotAvailability(activity) {
  return activity?.getFlag?.(MODULE_ID, "availability")
    ?? activity?.flags?.[MODULE_ID]?.availability
    ?? null;
}

function sourceBoundOneShotFailure(message, {
  code = "ACTION_MISCONFIGURED",
  retry = false,
} = {}) {
  const error = new Error(message);
  error.code = code;
  error.retry = retry;
  error.arcaneSourceBoundOneShotCode = code;
  return error;
}

function sourceBoundOneShotReceiptPath(effectId, deleting = false) {
  const suffix = deleting ? "-=" + String(effectId) : String(effectId);
  return "flags." + MODULE_ID + "." + SOURCE_BOUND_ONE_SHOT_FLAG + "." + suffix;
}

function sourceBoundOneShotEffectCreatedTime(effect) {
  return Number(effect?._stats?.createdTime ?? 0) || 0;
}

function sourceBoundOneShotEffectModifiedTime(effect) {
  return Number(effect?._stats?.modifiedTime ?? 0) || 0;
}

function sourceBoundOneShotValidateActivityContract(activity, item, semanticActionId) {
  const availability = sourceBoundOneShotAvailability(activity);
  const sourceConsumption = availability?.sourceConsumption ?? null;
  const rules = sourceBoundOneShotRules(item, semanticActionId);
  if (!sourceConsumption && rules.length === 0) return null;
  if (sourceConsumption !== "one-shot" || rules.length !== 1) {
    throw sourceBoundOneShotFailure(
      "source-bound-one-shot-v1 Activity/runtime contract drifted; expected one marked Activity and one exact rule",
    );
  }
  const adapter = runtimeRuleAdapterData(rules[0]);
  const artifactId = String(adapter.artifactId ?? "").trim();
  const requiredArtifactId = String(
    availability?.requiresArtifactId ?? "",
  ).trim();
  if (!artifactId || requiredArtifactId !== artifactId) {
    throw sourceBoundOneShotFailure(
      "source-bound-one-shot-v1 Activity/runtime artifact identity drifted",
    );
  }
  return { availability, rules, adapter, artifactId };
}

function prepareSourceBoundOneShotConsumption(activity, usageConfig, updates) {
  preflightCompilerSelectionCardinality(
    activity,
    usageConfig,
    usageConfig?.workflow ?? null,
  );
  const semanticActionId = activity?.getFlag?.(MODULE_ID, "semanticActionId")
    ?? activity?.flags?.[MODULE_ID]?.semanticActionId
    ?? null;
  const item = activity?.item;
  const contract = sourceBoundOneShotValidateActivityContract(
    activity,
    item,
    semanticActionId,
  );
  if (!contract) return true;
  if (!isPrimaryAutomationGM()) {
    throw sourceBoundOneShotFailure(
      "source-bound one-shot Actions must be committed by the primary active GM",
      { code: "ACTION_BLOCKED", retry: false },
    );
  }
  const actor = activity?.actor ?? item?.actor;
  const artifactId = contract.artifactId;
  if (!actor || !artifactId || !semanticActionId) {
    throw sourceBoundOneShotFailure(
      "source-bound-one-shot-v1 could not resolve actor, action, or source artifact",
    );
  }
  const effects = compilerEffectsForArtifact(actor, artifactId, item);
  if (effects.length !== 1) {
    throw sourceBoundOneShotFailure(
      "source-bound-one-shot-v1 expected one exact " + artifactId
      + " effect; found " + effects.length,
      { code: "ACTION_BLOCKED", retry: false },
    );
  }
  const effect = effects[0];
  const reservationKey = sourceBoundOneShotReservationKey(effect);
  const existingState = sourceBoundOneShotActorState(actor);
  if (existingState[effect.id]) {
    throw sourceBoundOneShotFailure(
      "source-bound-one-shot-v1 source was already committed and cannot replay",
      { code: "ACTION_BLOCKED", retry: false },
    );
  }
  if (SOURCE_BOUND_ONE_SHOT_RESERVATIONS.has(reservationKey)) {
    throw sourceBoundOneShotFailure(
      "source-bound-one-shot-v1 source is already reserved by another workflow",
      { code: "ACTION_BLOCKED", retry: false },
    );
  }
  if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
    throw sourceBoundOneShotFailure(
      "source-bound-one-shot-v1 requires activity consumption updates",
    );
  }
  updates.actor ??= {};
  if (!updates.actor || typeof updates.actor !== "object" || Array.isArray(updates.actor)) {
    throw sourceBoundOneShotFailure(
      "source-bound-one-shot-v1 actor updates must be an object",
    );
  }
  const workflow = usageConfig?.workflow;
  const workflowUuid = String(
    workflow?.uuid
      ?? workflow?.id
      ?? workflow?.sequenceId
      ?? "pending-workflow",
  );
  const receipt = Object.freeze({
    schemaVersion: 1,
    state: "committed",
    artifactId,
    sourceActorUuid: String(actor.uuid ?? ""),
    sourceEffectId: String(effect.id),
    sourceEffectUuid: String(effect.uuid ?? ""),
    sourceEffectOrigin: String(effect.origin ?? ""),
    sourceEffectCreatedTime: sourceBoundOneShotEffectCreatedTime(effect),
    sourceEffectModifiedTime: sourceBoundOneShotEffectModifiedTime(effect),
    sourceItemUuid: String(item?.uuid ?? ""),
    semanticActionId: String(semanticActionId),
    workflowUuid,
    committedAt: Number(game.time?.worldTime ?? Date.now()),
  });
  updates.actor[sourceBoundOneShotReceiptPath(effect.id)] = receipt;
  const reservation = {
    state: "reserved",
    actorUuid: actor.uuid,
    effectId: effect.id,
    receipt,
  };
  SOURCE_BOUND_ONE_SHOT_RESERVATIONS.set(reservationKey, reservation);
  if (workflow && typeof workflow === "object") {
    workflow.__arcaneSourceBoundOneShot = Object.freeze({
      reservationKey,
      ...receipt,
    });
  }
  // A timeout cannot prove that the world update failed: a slow or briefly
  // disconnected client may still commit it later. Keep the reservation
  // fail-closed until RollComplete settles it, or until a page reload clears
  // in-memory state and durable receipt recovery takes over.
  return true;
}

function sourceBoundOneShotExactItem(actor, item, receipt) {
  return Boolean(
    actor
    && item
    && String(actor.uuid ?? "") === String(receipt?.sourceActorUuid ?? "")
    && String(item.uuid ?? "") === String(receipt?.sourceItemUuid ?? "")
    && String(item.actor?.uuid ?? item.parent?.uuid ?? "")
      === String(actor.uuid ?? "")
  );
}

function sourceBoundOneShotExactEffect(effect, item, receipt) {
  if (!effect) return false;
  const artifactIds = effect.getFlag?.(MODULE_ID, "compilerArtifactIds")
    ?? effect.flags?.[MODULE_ID]?.compilerArtifactIds
    ?? [];
  return Boolean(
    String(effect.id ?? "") === String(receipt?.sourceEffectId ?? "")
    && String(effect.uuid ?? "") === String(receipt?.sourceEffectUuid ?? "")
    && String(effect.origin ?? "") === String(receipt?.sourceEffectOrigin ?? "")
    && compilerEffectOriginatesFromItem(effect, item)
    && sourceBoundOneShotEffectCreatedTime(effect)
      === Number(receipt?.sourceEffectCreatedTime ?? 0)
    && sourceBoundOneShotEffectModifiedTime(effect)
      === Number(receipt?.sourceEffectModifiedTime ?? 0)
    && Array.isArray(artifactIds)
    && artifactIds.includes(receipt?.artifactId)
  );
}

async function settleSourceBoundOneShotReceipt(actor, item, receipt) {
  if (receipt?.schemaVersion !== 1 || receipt?.state !== "committed") {
    throw sourceBoundOneShotFailure(
      "source-bound-one-shot-v1 durable receipt is malformed",
    );
  }
  if (!sourceBoundOneShotExactItem(actor, item, receipt)) {
    throw sourceBoundOneShotFailure(
      "source-bound-one-shot-v1 source item identity drifted; receipt retained",
    );
  }
  const liveEffect = actor.effects?.get?.(receipt.sourceEffectId)
    ?? Array.from(actor.effects ?? []).find(effect => effect.id === receipt.sourceEffectId)
    ?? null;
  if (liveEffect) {
    if (!sourceBoundOneShotExactEffect(liveEffect, item, receipt)) {
      throw sourceBoundOneShotFailure(
        "source-bound-one-shot-v1 source effect identity drifted; replacement preserved and receipt retained",
      );
    }
    await actor.deleteEmbeddedDocuments("ActiveEffect", [liveEffect.id]);
  }
  await actor.update({
    [sourceBoundOneShotReceiptPath(receipt.sourceEffectId, true)]: null,
  });
  SOURCE_BOUND_ONE_SHOT_RESERVATIONS.delete(receipt.sourceEffectUuid);
  return Object.freeze({
    status: "committed",
    retry: false,
    sourceEffectUuid: receipt.sourceEffectUuid,
    semanticActionId: receipt.semanticActionId,
    workflowUuid: receipt.workflowUuid,
  });
}

async function reconcileSourceBoundOneShotActor(actor) {
  if (!isPrimaryAutomationGM() || !actor) return { recovered: 0, failed: 0 };
  const state = sourceBoundOneShotActorState(actor);
  let recovered = 0;
  let failed = 0;
  for (const [effectId, receipt] of Object.entries(state)) {
    if (receipt?.state !== "committed") continue;
    const reservationKey = String(receipt?.sourceEffectUuid ?? "");
    const liveReservation = SOURCE_BOUND_ONE_SHOT_RESERVATIONS.get(reservationKey);
    if (
      liveReservation
      && liveReservation.receipt?.sourceEffectUuid === receipt?.sourceEffectUuid
      && liveReservation.receipt?.semanticActionId === receipt?.semanticActionId
    ) continue;
    try {
      const item = receipt?.sourceItemUuid && typeof fromUuid === "function"
        ? await fromUuid(receipt.sourceItemUuid).catch(() => null)
        : null;
      if (!item) {
        throw sourceBoundOneShotFailure(
          "source-bound-one-shot-v1 recovery could not resolve its exact source item; receipt retained",
        );
      }
      if (String(effectId) !== String(receipt.sourceEffectId ?? "")) {
        throw sourceBoundOneShotFailure(
          "source-bound-one-shot-v1 recovery flag key drifted; receipt retained",
        );
      }
      await settleSourceBoundOneShotReceipt(actor, item, receipt);
      recovered += 1;
    } catch (error) {
      failed += 1;
      ui.notifications?.error(String(error?.message ?? error));
      console.warn(
        "[" + MODULE_ID + "] source-bound one-shot receipt recovery failed",
        error,
      );
    }
  }
  return { recovered, failed };
}

async function recoverSourceBoundOneShotReceipts() {
  if (!isPrimaryAutomationGM()) return { recovered: 0, failed: 0 };
  const actors = new Map(
    Array.from(game.actors ?? [])
      .concat(Array.from(canvas.tokens?.placeables ?? []).map(token => token.actor))
      .filter(actor => actor?.uuid)
      .map(actor => [actor.uuid, actor]),
  );
  let recovered = 0;
  let failed = 0;
  for (const actor of actors.values()) {
    const result = await reconcileSourceBoundOneShotActor(actor);
    recovered += result.recovered;
    failed += result.failed;
  }
  return { recovered, failed };
}

async function applySourceBoundOneShotFromUse(item, usageConfig, workflow) {
  if (!workflow) return true;
  const resolvedItem = item ?? workflow?.activity?.item ?? workflow?.item;
  const activity = workflow?.activity ?? usageConfig?.activity ?? null;
  const semanticActionId = workflowSemanticActionId(workflow)
    ?? activity?.getFlag?.(MODULE_ID, "semanticActionId")
    ?? activity?.flags?.[MODULE_ID]?.semanticActionId
    ?? null;
  const contract = sourceBoundOneShotValidateActivityContract(
    activity,
    resolvedItem,
    semanticActionId,
  );
  if (!contract) return true;
  if (!isPrimaryAutomationGM()) {
    throw sourceBoundOneShotFailure(
      "source-bound-one-shot-v1 completion requires the primary active GM",
      { code: "ACTION_BLOCKED", retry: false },
    );
  }
  const actor = workflow?.actor ?? resolvedItem?.actor;
  if (!actor) {
    throw sourceBoundOneShotFailure(
      "source-bound-one-shot-v1 completion lacks its source actor",
    );
  }
  const state = sourceBoundOneShotActorState(actor);
  const workflowReceipt = workflow.__arcaneSourceBoundOneShot ?? null;
  const candidates = Object.values(state).filter(receipt =>
    receipt?.state === "committed"
    && receipt?.sourceItemUuid === resolvedItem?.uuid
    && receipt?.semanticActionId === semanticActionId
    && receipt?.artifactId === contract.artifactId
  );
  const receipt = workflowReceipt?.sourceEffectId
    ? state[workflowReceipt.sourceEffectId]
    : (candidates.length === 1 ? candidates[0] : null);
  if (
    !receipt
    || candidates.length !== 1
    || receipt.sourceEffectUuid !== (workflowReceipt?.sourceEffectUuid
      ?? receipt.sourceEffectUuid)
  ) {
    throw sourceBoundOneShotFailure(
      "source-bound-one-shot-v1 completion lacks one exact durable committed receipt",
      { code: "ACTION_BLOCKED", retry: false },
    );
  }
  const completion = await settleSourceBoundOneShotReceipt(
    actor,
    resolvedItem,
    receipt,
  );
  workflow.__arcaneSourceBoundOneShotCompletion = completion;
  return completion;
}

function compilerRuntimeCollectionValues(collection) {
  if (!collection) return [];
  if (Array.isArray(collection)) return collection;
  if (typeof collection.values === "function") {
    return Array.from(collection.values());
  }
  if (typeof collection === "object") return Object.values(collection);
  return [];
}

function compilerDamageTypeAliases(damageType) {
  const canonical = String(damageType ?? "").trim().toLowerCase();
  const aliases = new Set(canonical ? [canonical] : []);
  const configured = globalThis.CONFIG?.DND5E?.damageTypes?.[canonical];
  if (typeof configured === "string") {
    aliases.add(configured.trim().toLowerCase());
  } else if (configured && typeof configured === "object") {
    for (const candidate of [configured.label, configured.name]) {
      const normalized = String(candidate ?? "").trim().toLowerCase();
      if (normalized) aliases.add(normalized);
    }
  }
  return aliases;
}

function compilerSettledTypedDamageFromEntry(entry, damageType) {
  const applied =
    Math.max(0, Number(entry?.hpDamage ?? 0) || 0)
    + Math.max(0, Number(entry?.tempDamage ?? 0) || 0);
  if (applied <= 0) return 0;

  // Midi 13 exposes the actor-resolved per-type transaction as
  // damageDetails.combinedDamage. Keep the two compatibility shapes for
  // legacy workflows, but never use workflow-level pre-mitigation roll data.
  const candidates = [
    entry?.damageDetails?.combinedDamage,
    entry?.tokenDamages?.combinedDamage,
    entry?.damageDetail,
  ];
  const detail = candidates.find(candidate =>
    candidate !== undefined && candidate !== null
  );
  if (detail === undefined) return null;

  const aliases = compilerDamageTypeAliases(damageType);
  const typed = compilerRuntimeCollectionValues(detail).reduce((sum, current) => {
    const currentType = String(current?.type ?? "").trim().toLowerCase();
    if (!aliases.has(currentType)) return sum;
    return sum + Math.max(
      0,
      Number(current?.value ?? current?.damage ?? 0) || 0,
    );
  }, 0);
  // Overkill and temporary HP can make the settled HP transaction smaller
  // than the resolved component. Healing follows the real loss.
  return Math.min(applied, typed);
}

function compilerWorkflowHasSameTypeExtraDamage(workflow, damageType) {
  const aliases = compilerDamageTypeAliases(damageType);
  return [
    ...compilerRuntimeCollectionValues(workflow?.bonusDamageRolls),
    ...compilerRuntimeCollectionValues(workflow?.otherDamageRolls),
  ].some(roll => {
    const rollType = String(
      roll?.options?.type ?? roll?.options?.damageType ?? "",
    ).trim().toLowerCase();
    return rollType && aliases.has(rollType);
  });
}

async function applyDamageMirrorHealSourceFromUse(item, usageConfig, workflow) {
  if (!workflow || workflow.aborted === true) return true;
  const riderRuleId = String(item?.flags?.[MODULE_ID]?.riderId ?? "").split(":")[0] || null;
  let rules = compilerRuntimeRulesForAdapter(item, "damage-mirror-heal-source-v1");
  if (!rules.length) {
    // Parent-damage-rider workflows carry the hit damage on a transient
    // synthetic item; resolve the source item to find the compiler rules.
    const sourceItemUuid = item?.flags?.[MODULE_ID]?.sourceItemUuid;
    if (sourceItemUuid) {
      const sourceItem = await fromUuid(sourceItemUuid).catch(() => null);
      if (sourceItem) {
        item = sourceItem;
        rules = compilerRuntimeRulesForAdapter(item, "damage-mirror-heal-source-v1");
      }
    }
  }
  if (!rules.length) return true;
  {
    // A spell can expose multiple attack actions with distinct heal rules.
    // Bind the settled damage event to the action that actually produced it;
    // synthetic rider workflows recover that action through their rider rule.
    const allRules = item?.flags?.[MODULE_ID]?.spellAutomation?.runtimePlan?.rules ?? [];
    const originActionId = riderRuleId
      ? allRules.find(rule => rule?.id === riderRuleId)?.sourceActionId ?? null
      : workflowSemanticActionId(workflow);
    if (originActionId) {
      rules = rules.filter(rule => (rule?.sourceActionId ?? null) === originActionId);
    }
  }
  if (!rules.length) return true;
  const sourceActor = workflow?.actor ?? item?.actor;
  if (!sourceActor) return true;
  // Invoked from midi-qol.RollComplete: the Midi damage transaction has
  // settled by then, and an attack that hit nothing must not heal.
  if (workflow?.attackRoll && !(workflow?.hitTargets?.size > 0)) return true;

  for (const rule of rules) {
    const fraction = Number(rule.adapter?.fraction);
    const damageType = String(rule.adapter?.damageType ?? "").toLowerCase();
    if (
      !Number.isFinite(fraction)
      || fraction <= 0
      || fraction > 1
      || !damageType
    ) continue;
    // Once Midi merges an extra rider of the same damage type into its HP
    // transaction, operation provenance is gone. Refuse to guess rather than
    // over-heal; RollComplete records a runtime diagnostic for the DM.
    if (compilerWorkflowHasSameTypeExtraDamage(workflow, damageType)) {
      throw new Error(
        "Cannot isolate " + damageType
          + " source damage from a same-type bonus/other damage rider",
      );
    }
    const damageList = compilerRuntimeCollectionValues(workflow?.damageList);
    if (!damageList.length) continue;
    let applied = 0;
    let unresolved = false;
    for (const entry of damageList) {
      const settled = compilerSettledTypedDamageFromEntry(entry, damageType);
      if (settled === null) {
        unresolved = true;
        break;
      }
      applied += settled;
    }
    if (unresolved) {
      throw new Error(
        "Cannot resolve settled " + damageType
          + " damage from Midi's damage transaction",
      );
    }
    const healAmount = Math.floor(applied * fraction);
    if (healAmount <= 0) continue;
    await sourceActor.applyDamage(
      [{ value: healAmount, type: "healing" }],
      { only: "healing" },
    );
  }
  return true;
}

async function bindSourceTargetDamageMirrorFromUse(item, usageConfig, workflow) {
  const bindings = sourceTargetDamageMirrorBindings(item);
  if (!bindings.length || workflow?.aborted === true) return true;
  const sourceActor = workflow?.actor ?? item?.actor;
  const target = targetsFromUseConfig(workflow, usageConfig)[0];
  const targetActor = target?.actor;
  if (!sourceActor || !targetActor || targetActor.uuid === sourceActor.uuid) return true;

  for (const binding of bindings) {
    const misplacedSourceEffects = compilerEffectsForArtifact(
      targetActor,
      binding.sourceArtifactId,
      item,
    );
    if (misplacedSourceEffects.length) {
      await targetActor.deleteEmbeddedDocuments(
        "ActiveEffect",
        misplacedSourceEffects.map(effect => effect.id),
      );
    }

    const oldSourceEffects = compilerEffectsForArtifact(
      sourceActor,
      binding.sourceArtifactId,
      item,
    );
    if (oldSourceEffects.length) {
      await sourceActor.deleteEmbeddedDocuments(
        "ActiveEffect",
        oldSourceEffects.map(effect => effect.id),
      );
    }
    let targetEffect = newestEffect(
      compilerEffectsForArtifact(targetActor, binding.targetArtifactId, item),
    );
    if (!targetEffect) {
      targetEffect = await createCompilerArtifactEffect(
        item,
        targetActor,
        binding.targetArtifactId,
      );
    }
    if (!targetEffect) {
      throw new Error(
        "source-target-damage-mirror-v1 could not materialize target artifact "
        + binding.targetArtifactId,
      );
    }
    const sourceEffect = await createCompilerArtifactEffect(
      item,
      sourceActor,
      binding.sourceArtifactId,
    );
    if (!sourceEffect) {
      throw new Error(
        "source-target-damage-mirror-v1 could not materialize source artifact "
        + binding.sourceArtifactId,
      );
    }

    const shared = {
      version: 1,
      sourceArtifactId: binding.sourceArtifactId,
      targetArtifactId: binding.targetArtifactId,
      runtimeRuleIds: [...new Set(binding.runtimeRuleIds)].sort(),
      sourceActorUuid: sourceActor.uuid,
      targetActorUuid: targetActor.uuid,
      sourceEffectUuid: sourceEffect.uuid,
      targetEffectUuid: targetEffect.uuid,
    };
    await sourceEffect.update({
      ["flags." + MODULE_ID + ".sourceTargetDamageMirror"]: {
        ...shared,
        role: "source",
        counterpartEffectUuid: targetEffect.uuid,
      },
      ["flags." + MODULE_ID + ".targetActorUuid"]: targetActor.uuid,
      ["flags." + MODULE_ID + ".targetEffectUuid"]: targetEffect.uuid,
    });
    await targetEffect.update({
      ["flags." + MODULE_ID + ".sourceTargetDamageMirror"]: {
        ...shared,
        role: "target",
        counterpartEffectUuid: sourceEffect.uuid,
      },
      ["flags." + MODULE_ID + ".sourceActorUuid"]: sourceActor.uuid,
      ["flags." + MODULE_ID + ".sourceEffectUuid"]: sourceEffect.uuid,
      "flags.dnd5e.dependentOn": sourceEffect.uuid,
    });
  }
  return true;
}

async function cleanupSourceTargetDamageMirrorCounterpart(effect) {
  const contract = sourceTargetDamageMirrorContract(effect);
  const endpoint = contract?.role ?? contract?.endpoint;
  // dnd5e owns source -> target cleanup through flags.dnd5e.dependentOn.
  // Arcane only supplies the reverse edge when the target endpoint is removed
  // first; attempting both directions races ActiveEffect5e's dependent cleanup.
  if (
    !isPrimaryAutomationGM()
    || endpoint !== "target"
    || !contract?.counterpartEffectUuid
  ) return true;
  const key = effect.uuid ?? effect.id;
  if (SOURCE_TARGET_DAMAGE_MIRROR_CLEANUP.has(key)) return true;
  SOURCE_TARGET_DAMAGE_MIRROR_CLEANUP.add(key);
  try {
    const counterpart = await fromUuid(contract.counterpartEffectUuid).catch(() => null);
    if (!counterpart?.parent || counterpart.documentName !== "ActiveEffect") return true;
    const counterpartKey = counterpart.uuid ?? counterpart.id;
    SOURCE_TARGET_DAMAGE_MIRROR_CLEANUP.add(counterpartKey);
    await counterpart.parent
      .deleteEmbeddedDocuments("ActiveEffect", [counterpart.id])
      .catch(() => {});
    SOURCE_TARGET_DAMAGE_MIRROR_CLEANUP.delete(counterpartKey);
  } finally {
    SOURCE_TARGET_DAMAGE_MIRROR_CLEANUP.delete(key);
  }
  return true;
}

async function mirrorSourceTargetDamage(actor, amount, options) {
  const applied = Number(amount);
  if (
    !actor
    || !Number.isFinite(applied)
    || applied <= 0
    || options?.arcaneSourceTargetDamageMirror
  ) return true;
  const targetEffects = Array.from(actor.effects ?? []).filter(effect =>
    effect.disabled !== true
    && effect.isSuppressed !== true
    && sourceTargetDamageMirrorContract(effect)?.role === "target"
  );
  for (const targetEffect of targetEffects) {
    const contract = sourceTargetDamageMirrorContract(targetEffect);
    const sourceActor = contract?.sourceActorUuid
      ? await fromUuid(contract.sourceActorUuid).catch(() => null)
      : null;
    const sourceEffect = contract?.sourceEffectUuid
      ? await fromUuid(contract.sourceEffectUuid).catch(() => null)
      : null;
    if (
      !sourceActor
      || !sourceEffect
      || sourceEffect.disabled === true
      || sourceEffect.isSuppressed === true
      || Number(sourceActor.system?.attributes?.hp?.value ?? 0) <= 0
    ) {
      await actor.deleteEmbeddedDocuments("ActiveEffect", [targetEffect.id]);
      continue;
    }
    await sourceActor.applyDamage(applied, {
      ignore: true,
      arcaneSourceTargetDamageMirror: true,
      source: "source-target-damage-mirror-v1",
      runtimeRuleIds: contract.runtimeRuleIds,
    });
  }
  return true;
}

function weaponIsMagical(item) {
  const properties = item?.system?.properties;
  if (properties?.has?.("mgc")) return true;
  if (Array.isArray(properties) && properties.includes("mgc")) return true;
  return Number(item?.system?.magicalBonus ?? 0) > 0;
}

function deterministicMagicWeapon(actor) {
  return Array.from(actor?.items ?? [])
    .filter(item => item.type === "weapon" && item.system?.equipped === true && !weaponIsMagical(item))
    .sort((left, right) =>
      Number(left.sort ?? 0) - Number(right.sort ?? 0)
      || String(left.name ?? "").localeCompare(String(right.name ?? ""))
      || String(left.id ?? "").localeCompare(String(right.id ?? ""))
    )[0] ?? null;
}

function activityForCompilerIdentifier(item, identifier) {
  return activityValues(item).find(activity =>
    activity?.midiProperties?.identifier === identifier
    || activity?.flags?.[MODULE_ID]?.semanticActionId
      === "runtime:" + identifier
  ) ?? null;
}

function itemEffectValues(item) {
  const effects = item?.effects;
  if (!effects) return [];
  if (typeof effects.values === "function") return Array.from(effects.values());
  return Array.from(effects);
}

function activityAppliedEnchantments(activity) {
  const tracked = Array.from(activity?.appliedEnchantments ?? []).filter(Boolean);
  if (tracked.length > 0) return tracked;
  const actor = activity?.actor ?? activity?.item?.actor;
  return Array.from(actor?.items ?? []).flatMap(ownedItem =>
    itemEffectValues(ownedItem).filter(effect =>
      effect?.origin === activity?.uuid
      && effect?.type === "enchantment"
    )
  );
}

function weaponIsMagicalWithoutEnchantments(item, ignoredEnchantments = []) {
  if (!ignoredEnchantments.length) return weaponIsMagical(item);
  const ignoredIds = new Set(
    ignoredEnchantments.flatMap(effect =>
      [effect?.id, effect?._id, effect?.uuid].filter(Boolean)
    ),
  );
  const sourceProperties = item?._source?.system?.properties;
  if (
    sourceProperties?.has?.("mgc")
    || Array.from(sourceProperties ?? []).includes("mgc")
    || Number(item?._source?.system?.magicalBonus ?? 0) > 0
  ) {
    return true;
  }
  return itemEffectValues(item).some(effect => {
    if (
      ignoredIds.has(effect?.id)
      || ignoredIds.has(effect?._id)
      || ignoredIds.has(effect?.uuid)
      || effect?.disabled === true
      || effect?.isSuppressed === true
    ) {
      return false;
    }
    return Array.from(effect?.changes ?? []).some(change =>
      (
        change?.key === "system.properties"
        && String(change?.value ?? "").split(/[\s,]+/).includes("mgc")
      )
      || (
        change?.key === "system.magicalBonus"
        && Number(change?.value ?? 0) > 0
      )
    );
  });
}

function resolveCompilerOwnedItem(actor, query, {
  ignoredEnchantments = [],
} = {}) {
  if (
    !actor
    || query?.result !== "items"
    || query?.origin?.type !== "actor-items"
    || query?.origin?.actor !== "source"
    || query?.evaluation !== "snapshot"
    || query?.cardinality?.min !== 1
    || query?.cardinality?.max !== 1
    || query?.selection?.type !== "first-stable"
    || Array.from(query?.selection?.order ?? []).join(",") !== "sort,name,id"
  ) {
    throw new Error(
      "weapon-enchantment-v1 requires one stable source-inventory item query",
    );
  }
  const predicates = new Map(
    Array.from(query?.predicates ?? []).map(current => [current.type, current]),
  );
  if (
    predicates.get("item-type")?.value !== "weapon"
    || predicates.get("item-equipped")?.value !== true
  ) {
    throw new Error(
      "weapon-enchantment-v1 requires an equipped weapon query",
    );
  }
  const allowedPredicates = new Set([
    "item-type",
    "item-equipped",
    "item-magical",
    "item-attack-range",
    "item-base-item-in",
  ]);
  if (
    predicates.size !== Array.from(query?.predicates ?? []).length
    || Array.from(predicates.keys()).some(type => !allowedPredicates.has(type))
  ) {
    throw new Error(
      "weapon-enchantment-v1 received unsupported or duplicate item predicates",
    );
  }
  const requiredMagical = predicates.get("item-magical")?.value;
  const requiredAttackRange = predicates.get("item-attack-range")?.value;
  const allowedBaseItems = new Set(
    Array.from(predicates.get("item-base-item-in")?.values ?? []).map(value =>
      String(value).trim().toLowerCase()
    ),
  );
  return Array.from(actor.items ?? [])
    .filter(current => {
      if (current.type !== "weapon" || current.system?.equipped !== true) {
        return false;
      }
      if (requiredMagical !== undefined) {
        const magical = weaponIsMagicalWithoutEnchantments(
          current,
          ignoredEnchantments.filter(effect =>
            effect?.parent?.uuid === current.uuid
          ),
        );
        if (magical !== requiredMagical) return false;
      }
      if (
        requiredAttackRange === "melee"
        && !Array.from(current.system?.activities ?? []).some(activity =>
          isMeleeWeaponAttack(current, activity)
        )
      ) return false;
      if (allowedBaseItems.size > 0) {
        const identifiers = [
          current.system?.identifier,
          current.system?.type?.baseItem,
          current.system?.type?.value,
        ].map(value => String(value ?? "").trim().toLowerCase());
        if (!identifiers.some(value => allowedBaseItems.has(value))) {
          return false;
        }
      }
      return true;
    })
    .sort((left, right) =>
      Number(left.sort ?? 0) - Number(right.sort ?? 0)
      || String(left?._source?.name ?? left.name ?? "").localeCompare(
        String(right?._source?.name ?? right.name ?? ""),
      )
      || String(left.id ?? "").localeCompare(String(right.id ?? ""))
    )[0] ?? null;
}

function compilerWeaponEnchantmentBindings(item, semanticActionId) {
  return compilerRuntimeRulesForAdapter(item, "weapon-enchantment-v1")
    .filter(rule =>
      rule.trigger === "action-used"
      && (!rule.sourceActionId || rule.sourceActionId === semanticActionId)
    )
    .map(rule => {
      const adapter = runtimeRuleAdapterData(rule);
      const operationValue = (rule.operations ?? []).find(current =>
        current.type === "create-artifact"
        && current.artifactId === adapter.artifactId
      );
      const query = (rule.targets ?? []).find(current =>
        current.semanticId === operationValue?.target
      );
      const artifactValue = compilerRuntimeArtifact(item, adapter.artifactId);
      const activity = activityForCompilerIdentifier(
        item,
        adapter.activityIdentifier,
      );
      if (
        !operationValue
        || !query
        || !artifactValue
        || artifactValue.kind !== "enchantment"
        || artifactValue.host !== "item"
        || artifactValue.identity?.scope !== "source-item"
        || artifactValue.lifecycle?.type !== "while-artifact"
        || artifactValue.lifecycle.artifactId !== adapter.lifecycleArtifactId
        || activity?.type !== "enchant"
        || typeof activity?.applyEnchantment !== "function"
      ) {
        throw new Error(
          "weapon-enchantment-v1 runtime receipt is incomplete for " + rule.id,
        );
      }
      return {
        rule,
        adapter,
        query,
        artifactValue,
        activity,
      };
    });
}

function compilerWeaponEnchantmentPreflight(actor, item, activity) {
  try {
    const semanticActionId =
      activity?.flags?.[MODULE_ID]?.semanticActionId
      ?? activity?.getFlag?.(MODULE_ID, "semanticActionId")
      ?? null;
    const bindings = compilerWeaponEnchantmentBindings(item, semanticActionId);
    for (const binding of bindings) {
      const previous = activityAppliedEnchantments(binding.activity);
      const targetItem = resolveCompilerOwnedItem(actor, binding.query, {
        ignoredEnchantments: previous,
      });
      if (!targetItem) {
        return {
          message:
            (item?.name ?? "Weapon enchantment")
            + " found no equipped weapon matching its compiler-owned query.",
        };
      }
    }
    return null;
  } catch (error) {
    return {
      message:
        (item?.name ?? "Weapon enchantment")
        + " cannot start because its compiler runtime contract is invalid.",
      error,
    };
  }
}

function compilerConcentrationEffectMatches(effect, item, activity) {
  const concentrating =
    CONFIG.specialStatusEffects?.CONCENTRATING
    ?? "concentrating";
  const statuses = Array.from(effect?.statuses ?? []);
  const activityData = effect?.flags?.dnd5e?.activity ?? {};
  const itemData = effect?.flags?.dnd5e?.item ?? {};
  return (
    effect?.disabled !== true
    && effect?.isSuppressed !== true
    && (
      effect?.statuses?.has?.(concentrating)
      || statuses.includes(concentrating)
      || effect?.statuses?.has?.("concentrating")
      || statuses.includes("concentrating")
    )
    && activityData.uuid === activity?.uuid
    && itemData.uuid === item?.uuid
    && effect?.origin === item?.uuid
  );
}

function compilerWorkflowChatMessage(workflow) {
  const reference = workflow?.itemCardUuid ?? workflow?.itemCardId ?? null;
  if (!reference) return null;
  if (typeof globalThis.fromUuidSync === "function") {
    try {
      const value = globalThis.fromUuidSync(reference);
      if (value) return value;
    } catch (_error) {
      // A few Midi versions expose the bare ChatMessage id instead of its UUID.
    }
  }
  return game.messages?.get?.(String(reference).split(".").at(-1)) ?? null;
}

function compilerConcentrationEffect(actor, item, activity, workflow) {
  const message = compilerWorkflowChatMessage(workflow);
  const messageEffect = message?.system?.concentration
    ? actor?.effects?.get?.(message.system.concentration)
    : null;
  if (compilerConcentrationEffectMatches(messageEffect, item, activity)) {
    return messageEffect;
  }
  return Array.from(actor?.effects ?? []).find(effect =>
    compilerConcentrationEffectMatches(effect, item, activity)
  ) ?? null;
}

function compilerEnchantmentProfile(
  activity,
  artifactId,
  castLevel,
  selections,
) {
  const matches = Array.from(activity?.effects ?? []).filter(application => {
    const effect =
      application?.effect
      ?? activity?.item?.effects?.get?.(application?._id)
      ?? null;
    if (
      effect?.type !== "enchantment"
      || !Array.from(
        effect?.flags?.[MODULE_ID]?.compilerArtifactIds ?? [],
      ).includes(artifactId)
    ) {
      return false;
    }
    const level = application?.level ?? {};
    const requiredSelections =
      effect?.flags?.[MODULE_ID]?.enchantmentSelections ?? {};
    return (
      (level.min === null || level.min === undefined || castLevel >= Number(level.min))
      && (level.max === null || level.max === undefined || castLevel <= Number(level.max))
      && Object.entries(requiredSelections).every(([id, value]) =>
        String(selections?.[id] ?? "") === String(value)
      )
    );
  });
  if (matches.length > 1) {
    throw new Error(
      "weapon-enchantment-v1 matched multiple profiles for one cast",
    );
  }
  return matches[0] ?? null;
}

async function applyWeaponEnchantmentFromUse(item, usageConfig, workflow) {
  if (!workflow || workflow.aborted === true) return false;
  const semanticActionId = workflowSemanticActionId(workflow);
  const bindings = compilerWeaponEnchantmentBindings(item, semanticActionId);
  if (!bindings.length) return false;
  const actor = workflow?.actor ?? item?.actor;
  if (!actor) {
    throw new Error("weapon-enchantment-v1 could not resolve the caster");
  }
  const castLevel = spellCastLevel(item, usageConfig, workflow);
  const selections = compilerRuntimeSelections(usageConfig, workflow);
  for (const binding of bindings) {
    const previous = activityAppliedEnchantments(binding.activity);
    const targetItem = resolveCompilerOwnedItem(actor, binding.query, {
      ignoredEnchantments: previous,
    });
    if (!targetItem) {
      throw new Error(
        "weapon-enchantment-v1 found no equipped weapon matching its query",
      );
    }
    const enchantmentActivity = binding.activity;
    const profile = compilerEnchantmentProfile(
      enchantmentActivity,
      binding.adapter.artifactId,
      castLevel,
      selections,
    );
    if (!profile) {
      throw new Error(
        "weapon-enchantment-v1 found no profile for cast level " + castLevel,
      );
    }
    const lifecycleEffect =
      binding.adapter.lifecycleArtifactId === "concentration"
        ? compilerConcentrationEffect(actor, item, workflow?.activity, workflow)
        : newestEffect(compilerEffectsForArtifact(
            actor,
            binding.adapter.lifecycleArtifactId,
            item,
          ));
    if (!lifecycleEffect) {
      throw new Error(
        "weapon-enchantment-v1 could not resolve lifecycle artifact "
        + binding.adapter.lifecycleArtifactId,
      );
    }
    for (const effect of previous) {
      await effect.delete();
    }
    const applied = await enchantmentActivity.applyEnchantment(
      profile._id,
      targetItem,
      {
        concentration: lifecycleEffect,
        strict: true,
      },
    );
    if (!applied) {
      throw new Error(
        "weapon-enchantment-v1 native dnd5e application was rejected",
      );
    }
    // The cloned profile already carries the compiler artifact receipt; its
    // origin identifies the source activity, its parent is the target Item,
    // and dnd5e dependentOn owns cleanup. Avoid a redundant update after the
    // native applyEnchantment call has finalized the created effect.
  }
  return true;
}

async function removeMagicWeaponEnchantments(actor) {
  for (const weapon of Array.from(actor?.items ?? []).filter(item => item.type === "weapon")) {
    const effects = Array.from(weapon.effects ?? []).filter(effect => arcaneEffectFlag(effect, "magicWeaponEnchantment"));
    if (effects.length) await weapon.deleteEmbeddedDocuments("ActiveEffect", effects.map(effect => effect.id));
  }
}

async function applyMagicWeaponFromUse(item, usageConfig, workflow) {
  if (
    compilerRuntimeRulesForAdapter(
      item,
      "weapon-enchantment-v1",
    ).length > 0
  ) return true;
  if (item?.system?.identifier !== "magic-weapon") return true;
  const actor = workflow?.actor ?? item.actor;
  if (!actor) return true;
  const sourceEffect = effectForArcaneFlag(actor, "magicWeaponSource");
  if (!sourceEffect) {
    ui.notifications?.warn("Magic Weapon source effect was not created; enchantment skipped.");
    return true;
  }
  const weapon = deterministicMagicWeapon(actor);
  if (!weapon) {
    ui.notifications?.warn("Magic Weapon found no equipped nonmagical weapon.");
    return true;
  }
  await removeMagicWeaponEnchantments(actor);
  const castLevel = spellCastLevel(item, usageConfig, workflow);
  const bonus = castLevel >= 6 ? 3 : castLevel >= 4 ? 2 : 1;
  const [enchantment] = await weapon.createEmbeddedDocuments("ActiveEffect", [{
    name: "Magic Weapon, +" + bonus,
    type: "enchantment",
    img: item.img,
    origin: item.uuid,
    transfer: false,
    disabled: false,
    statuses: [],
    duration: { seconds: 3600, rounds: 600, turns: null },
    changes: [
      { key: "name", mode: 5, value: "{}, +" + bonus, priority: null },
      { key: "system.properties", mode: 2, value: "mgc", priority: null },
      { key: "system.magicalBonus", mode: 5, value: String(bonus), priority: null },
    ],
    flags: {
      [MODULE_ID]: {
        magicWeaponEnchantment: true,
        sourceActorUuid: actor.uuid,
        sourceEffectUuid: sourceEffect?.uuid,
        bonus,
      },
      dnd5e: { enchantment: { level: { min: castLevel, max: castLevel }, riders: [] } },
    },
    system: {},
  }]);
  if (sourceEffect) {
    await sourceEffect.update({
      ["flags." + MODULE_ID + ".weaponUuid"]: weapon.uuid,
      ["flags." + MODULE_ID + ".enchantmentUuid"]: enchantment?.uuid,
      ["flags." + MODULE_ID + ".bonus"]: bonus,
    });
  }
  return true;
}

async function cleanupMagicWeaponFromSource(effect) {
  if (!arcaneEffectFlag(effect, "magicWeaponSource")) return true;
  const enchantmentUuid = arcaneEffectFlag(effect, "enchantmentUuid");
  if (!enchantmentUuid) return true;
  const enchantment = await fromUuid(enchantmentUuid).catch(() => null);
  if (enchantment?.parent && enchantment.documentName === "ActiveEffect") {
    await enchantment.parent.deleteEmbeddedDocuments("ActiveEffect", [enchantment.id]).catch(() => {});
  }
  return true;
}

function isMeleeAttackWorkflow(workflow) {
  const raw = [
    workflow?.activity?.attack?.type?.value,
    workflow?.activity?.attack?.type,
    workflow?.activity?.attack?.classification,
    workflow?.item?.system?.actionType,
  ].filter(Boolean).join(" ").toLowerCase();
  if (/mwak|msak|melee/.test(raw)) return true;
  return isMeleeWeaponWorkflow(workflow);
}

function effectHostHitByAttackContract(effect) {
  const value = arcaneEffectFlag(effect, "effectHostHitByAttack");
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Number(value.version) === 1
    ? value
    : null;
}

function isEffectHostMeleeAttackWorkflow(workflow) {
  if (workflow?.activity?.type !== "attack") return false;
  const actionType = workflowActionType(workflow);
  if (["mwak", "msak", "melee"].includes(actionType)) return true;
  return false;
}

async function captureEffectHostHitByAttackCast(item, usageConfig, workflow) {
  if (
    !isPrimaryAutomationGM()
    || !item
    || workflow?.aborted === true
  ) return true;
  const rules = compilerRuntimeRulesForAdapter(
    item,
    "effect-host-hit-by-attack-v1",
  ).filter(rule =>
    runtimeRuleAdapterData(rule).phase === "cast"
    && (
      !rule.sourceActionId
      || rule.sourceActionId === workflowSemanticActionId(workflow)
    )
  );
  if (!rules.length) return true;
  const actor = workflow?.actor ?? item?.actor;
  if (!actor) return true;
  const castLevel = workflowCastLevel(item, usageConfig, workflow);
  const grantedTemporaryHitPoints = temporaryHitPointsGrantedByWorkflow(workflow);
  const sourceArtifactIds = [...new Set(rules.map(rule =>
    runtimeRuleAdapterData(rule).sourceArtifactId
  ).filter(Boolean))];
  const effects = sourceArtifactIds.flatMap(artifactId =>
    compilerEffectsForArtifact(actor, artifactId, item)
  ).filter((effect, index, values) =>
    values.findIndex(candidate => candidate.id === effect.id) === index
    && effect.disabled !== true
    && effect.isSuppressed !== true
    && effectHostHitByAttackContract(effect)
  );
  if (effects.length !== sourceArtifactIds.length) {
    const error = new Error(
      "effect-host-hit-by-attack-v1 did not find each exact source effect after cast",
    );
    recordCompilerRuntimeError(workflow, error, "effect-host-cast");
    throw error;
  }
  if (
    effects.some(effect =>
      effectHostHitByAttackContract(effect)?.requiresTemporaryHitPoints === true
    )
    && !(Number.isFinite(grantedTemporaryHitPoints) && grantedTemporaryHitPoints > 0)
  ) {
    const error = new Error(
      "effect-host-hit-by-attack-v1 could not capture granted temporary hit points",
    );
    recordCompilerRuntimeError(workflow, error, "effect-host-cast");
    throw error;
  }
  const replacementArtifactIds = new Set(
    rules.flatMap(rule =>
      runtimeRuleAdapterData(rule).replaceSourceArtifactIds ?? []
    ).filter(Boolean),
  );
  const replacements = [...replacementArtifactIds].flatMap(artifactId =>
    compilerEffectsForArtifact(actor, artifactId, item)
  );
  if (replacements.length) {
    await actor.deleteEmbeddedDocuments(
      "ActiveEffect",
      [...new Set(replacements.map(effect => effect.id))],
    );
  }
  for (const effect of effects) {
    const contract = effectHostHitByAttackContract(effect);
    const updates = {
      ["flags." + MODULE_ID + ".sourceActorUuid"]: actor.uuid,
      ["flags." + MODULE_ID + ".sourceItemUuid"]: item.uuid,
      ["flags." + MODULE_ID + ".sourceCastLevel"]: castLevel,
      ["flags." + MODULE_ID + ".castLevel"]: castLevel,
    };
    if (
      contract?.requiresTemporaryHitPoints === true
      && grantedTemporaryHitPoints !== null
    ) {
      updates["flags." + MODULE_ID + ".temporaryHitPointsGranted"] =
        grantedTemporaryHitPoints;
    }
    await effect.update(updates);
  }
  return true;
}

function effectHostHitByAttackSnapshotKey(
  workflow,
  contract,
  effect,
  hostActor,
  targetToken,
  attackerToken,
) {
  return [
    workflow?.uuid ?? workflow?.id ?? "workflow",
    contract.runtimeRuleId ?? "effect-host-hit-by-attack",
    effect?.uuid ?? effect?.id,
    targetToken?.document?.uuid ?? targetToken?.uuid ?? targetToken?.id,
    attackerToken?.document?.uuid ?? attackerToken?.uuid ?? attackerToken?.id,
  ].join(":");
}

function effectHostHitByAttackParentWorkflowId(workflow, snapshot = {}) {
  for (const candidate of [
    workflow?.id,
    workflow?.uuid,
    snapshot?.parentWorkflowId,
  ]) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }
  return null;
}

async function captureEffectHostHitByAttackForTarget(workflow, targetToken) {
  const hostToken = targetToken?.object ?? targetToken;
  const hostActor = hostToken?.actor ?? targetToken?.actor;
  const attackerToken = workflow?.token?.object ?? workflow?.token;
  if (
    !hostActor
    || !attackerToken?.actor
    || !isEffectHostMeleeAttackWorkflow(workflow)
  ) return true;
  workflow.__arcaneEffectHostHitByAttackSnapshots ??= new Map();
  workflow.__arcaneEffectHostHitByAttackReservations ??= new Set();
  for (const effect of Array.from(hostActor.effects ?? [])) {
    if (
      effect.disabled === true
      || effect.active === false
      || effect.isSuppressed === true
    ) continue;
    const contract = effectHostHitByAttackContract(effect);
    if (
      !contract
      || contract.operationId !== "external:attack-roll"
      || contract.attackKind !== "melee"
    ) continue;
    if (
      contract.requiresTemporaryHitPoints === true
      && Number(hostActor.system?.attributes?.hp?.temp ?? 0) <= 0
    ) continue;
    const key = effectHostHitByAttackSnapshotKey(
      workflow,
      contract,
      effect,
      hostActor,
      hostToken,
      attackerToken,
    );
    if (
      workflow.__arcaneEffectHostHitByAttackSnapshots.has(key)
      || workflow.__arcaneEffectHostHitByAttackReservations.has(key)
    ) continue;
    workflow.__arcaneEffectHostHitByAttackReservations.add(key);
    try {
      const sourceItem = await exactSourceItemForEffectHostHitByAttack(
        effect,
        hostActor,
      );
      const damage = contract.damage ?? {};
      const damageTypes = Array.isArray(damage.types)
        ? damage.types.filter(Boolean)
        : [];
      const damageType = String(damageTypes[0] ?? "").trim();
      const formula = sourceEffectDamageFormula(
        damage.formulaExpression,
        damage.formula,
        effect,
        sourceItem,
      );
      const hostTokenUuid = hostToken?.document?.uuid ?? hostToken?.uuid ?? null;
      const attackerTokenUuid =
        attackerToken?.document?.uuid ?? attackerToken?.uuid ?? null;
      if (
        !sourceItem
        || !formula
        || !damageType
        || damageTypes.length !== 1
        || !hostTokenUuid
        || !attackerTokenUuid
      ) {
        throw new Error(
          "effect-host-hit-by-attack-v1 could not capture exact retaliation provenance",
        );
      }
      workflow.__arcaneEffectHostHitByAttackSnapshots.set(key, {
        key,
        runtimeRuleId: contract.runtimeRuleId,
        parentWorkflowId: effectHostHitByAttackParentWorkflowId(workflow),
        sourceEffectUuid: effect.uuid,
        sourceItemUuid: sourceItem.uuid,
        hostActorUuid: hostActor.uuid,
        hostTokenUuid,
        attackerTokenUuid,
        formula,
        damageType,
        properties: damage.properties ?? ["spell", "mgc"],
        label: (sourceItem.name ?? effect.name) + " Retaliation",
      });
    } finally {
      workflow.__arcaneEffectHostHitByAttackReservations.delete(key);
    }
  }
  return true;
}

async function captureEffectHostHitByAttackBeforeDamage(target, context = {}) {
  const workflow = context?.workflow ?? context;
  if (
    !isPrimaryAutomationGM()
    || context?.damageItem?.wasHit === false
    || !isEffectHostMeleeAttackWorkflow(workflow)
  ) return true;
  return captureEffectHostHitByAttackForTarget(workflow, target);
}

async function resolveEffectHostHitByAttack(workflow) {
  if (
    !isPrimaryAutomationGM()
    || workflow?.aborted === true
    || !isEffectHostMeleeAttackWorkflow(workflow)
  ) return true;
  const hitTargets = effectHostHitTargets(workflow);
  for (const target of hitTargets) {
    await captureEffectHostHitByAttackForTarget(workflow, target);
  }
  const finalHitTargetUuids = new Set(hitTargets.map(target =>
    target?.document?.uuid ?? target?.uuid ?? null
  ).filter(Boolean));
  const snapshots = [
    ...(workflow.__arcaneEffectHostHitByAttackSnapshots?.values?.() ?? []),
  ];
  workflow.__arcaneEffectHostHitByAttackResolved ??= new Set();
  for (const snapshot of snapshots) {
    if (!finalHitTargetUuids.has(snapshot.hostTokenUuid)) continue;
    if (workflow.__arcaneEffectHostHitByAttackResolved.has(snapshot.key)) continue;
    // DamageOnlyWorkflow can fail after partially applying damage. Reserve the
    // receipt before mutation and retain it on failure: this contract is
    // deliberately at-most-once, with the runtime error surfaced to the DM.
    workflow.__arcaneEffectHostHitByAttackResolved.add(snapshot.key);
    const sourceItem = await fromUuid(snapshot.sourceItemUuid).catch(() => null);
    const hostActor = await fromUuid(snapshot.hostActorUuid).catch(() => null);
    const hostDocument = await fromUuid(snapshot.hostTokenUuid).catch(() => null);
    const attackerDocument = await fromUuid(snapshot.attackerTokenUuid).catch(() => null);
    const hostToken = hostDocument?.object ?? hostDocument;
    const attackerToken = attackerDocument?.object ?? attackerDocument;
    if (!sourceItem || !hostActor || !hostToken || !attackerToken?.actor) {
      throw new Error(
        "effect-host-hit-by-attack-v1 lost captured retaliation provenance",
      );
    }
    const parentWorkflowId = effectHostHitByAttackParentWorkflowId(
      workflow,
      snapshot,
    );
    if (!parentWorkflowId) {
      throw new Error(
        "effect-host-hit-by-attack-v1 lost its parent workflow id",
      );
    }
    await applyBonusDamageWorkflow({
      actor: hostActor,
      token: hostToken,
      item: sourceItem,
      activity: null,
      hitTargets: new Set([attackerToken]),
      targets: new Set([attackerToken]),
      itemCardId: workflow.itemCardId,
    }, snapshot.formula, snapshot.damageType, snapshot.label, {
      riderId: snapshot.runtimeRuleId ?? "effect-host-hit-by-attack-v1",
      parentWorkflowId,
      sourceEffectUuid: snapshot.sourceEffectUuid,
      targets: [attackerToken],
      properties: snapshot.properties,
    });
  }
  return true;
}

async function cleanupEffectHostHitByAttackAfterDamage(actor) {
  if (
    !isPrimaryAutomationGM()
    || !actor
    || Number(actor.system?.attributes?.hp?.temp ?? 0) > 0
  ) return true;
  const effects = Array.from(actor.effects ?? []).filter(effect =>
    effectHostHitByAttackContract(effect)?.requiresTemporaryHitPoints === true
  );
  if (effects.length) {
    await actor.deleteEmbeddedDocuments(
      "ActiveEffect",
      effects.map(effect => effect.id),
    );
  }
  return true;
}

async function cleanupEffectHostHitByAttackOnDelete(effect, options) {
  const contract = effectHostHitByAttackContract(effect);
  const actor = effect?.parent;
  if (
    contract?.requiresTemporaryHitPoints !== true
    || !isPrimaryAutomationGM()
    || actor?.documentName !== "Actor"
  ) return true;
  if (options?.existing === "effect-stacking") return true;
  const replacement = Array.from(actor.effects ?? []).some(current =>
    current.id !== effect.id
    && current.disabled !== true
    && current.isSuppressed !== true
    && effectHostHitByAttackContract(current)?.requiresTemporaryHitPoints === true
  );
  if (replacement) return true;
  const current = Number(actor.system?.attributes?.hp?.temp ?? 0);
  const granted = Number(
    arcaneEffectFlag(effect, "temporaryHitPointsGranted") ?? 0,
  );
  if (
    current > 0
    && Number.isFinite(granted)
    && granted > 0
    && current <= granted
  ) {
    await actor.update({ "system.attributes.hp.temp": 0 });
  }
  return true;
}

function temporaryHitPointsRetaliationContract(effect) {
  const value = arcaneEffectFlag(effect, "temporaryHitPointsRetaliation");
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Number(value.version) === 1
    ? value
    : null;
}

function temporaryHitPointsGrantedByWorkflow(workflow) {
  const rolls = [
    ...Array.from(workflow?.damageRolls ?? []),
    ...Array.from(workflow?.otherDamageRolls ?? []),
    ...Array.from(workflow?.bonusDamageRolls ?? []),
  ];
  const roll = rolls.find(current =>
    current?.options?.type === "temphp"
    || current?.options?.types?.includes?.("temphp")
  );
  const rollTotal = Number(roll?.total);
  if (Number.isFinite(rollTotal) && rollTotal > 0) return rollTotal;
  const detail = [
    ...Array.from(workflow?.damageDetail ?? []),
    ...Array.from(workflow?.otherDamageDetail ?? []),
    ...Array.from(workflow?.bonusDamageDetail ?? []),
  ].filter(current =>
    current?.type === "temphp"
    || current?.types?.includes?.("temphp")
  );
  const detailTotal = detail.reduce(
    (sum, current) => sum + Math.max(0, Number(current?.value ?? current?.damage ?? 0) || 0),
    0,
  );
  return detailTotal > 0 ? detailTotal : null;
}

async function captureTemporaryHitPointsRetaliationCast(item, usageConfig, workflow) {
  const rules = compilerRuntimeRulesForAdapter(
    item,
    "temporary-hit-points-retaliation-v1",
  );
  if (!rules.length || workflow?.aborted === true) return true;
  const actor = workflow?.actor ?? item?.actor;
  if (!actor) return true;
  const castLevel = spellCastLevel(item, usageConfig, workflow);
  const grantedTemporaryHitPoints = temporaryHitPointsGrantedByWorkflow(workflow);
  const artifactIds = new Set(
    rules.flatMap(rule => {
      const adapter = runtimeRuleAdapterData(rule);
      return [
        adapter.artifactId,
        adapter.sourceArtifactId,
        adapter.retaliation?.artifactId,
      ].filter(Boolean);
    }),
  );
  const effects = Array.from(actor.effects ?? []).filter(effect => {
    if (!temporaryHitPointsRetaliationContract(effect)) return false;
    if (!compilerEffectMatchesItem(effect, item)) return false;
    if (artifactIds.size === 0) return true;
    return compilerArtifactIds(effect).some(id => artifactIds.has(id));
  });
  for (const effect of effects) {
    const updates = {
      ["flags." + MODULE_ID + ".sourceActorUuid"]: actor.uuid,
      ["flags." + MODULE_ID + ".castLevel"]: castLevel,
    };
    if (grantedTemporaryHitPoints !== null) {
      updates["flags." + MODULE_ID + ".temporaryHitPointsGranted"] =
        grantedTemporaryHitPoints;
    }
    await effect.update(updates);
  }
  return true;
}

async function applyTemporaryHitPointsRetaliation(target, context) {
  const targetToken = target?.object ?? target;
  const actor = targetToken?.actor ?? target?.actor;
  const workflow = context?.workflow ?? context;
  if (
    !actor
    || !workflow
    || context?.damageItem?.wasHit === false
    || Number(actor.system?.attributes?.hp?.temp ?? 0) <= 0
  ) return true;
  const effects = Array.from(actor.effects ?? []).filter(effect =>
    effect.disabled !== true
    && effect.isSuppressed !== true
    && temporaryHitPointsRetaliationContract(effect)
  );
  if (!effects.length) return true;
  const attacker = workflow?.token?.object ?? workflow?.token;
  if (!attacker?.actor || !targetToken) return true;

  workflow.__arcaneTemporaryHitPointsRetaliation ??= new Set();
  for (const effect of effects) {
    const contract = temporaryHitPointsRetaliationContract(effect);
    const attackKind = String(
      contract.attackKind
      ?? contract.attackType
      ?? "melee",
    ).toLowerCase();
    if (attackKind === "melee" && !isMeleeAttackWorkflow(workflow)) continue;
    if (!["melee", "any"].includes(attackKind)) continue;
    const dedupeKey = [
      contract.runtimeRuleId ?? "temporary-hit-points-retaliation",
      effect.uuid ?? effect.id,
      attacker.document?.uuid ?? attacker.id ?? attacker.actor.uuid,
    ].join(":");
    if (workflow.__arcaneTemporaryHitPointsRetaliation.has(dedupeKey)) continue;

    const sourceItem = await sourceItemForCompilerSourceEffect(effect, actor);
    const damage = contract.damage ?? {};
    const damageTypes = Array.isArray(damage.types)
      ? damage.types.filter(Boolean)
      : Array.isArray(damage.damageTypes)
        ? damage.damageTypes.filter(Boolean)
        : [];
    const damageType = String(
      damage.damageType
      ?? damageTypes[0]
      ?? "",
    ).trim();
    const formula = sourceEffectDamageFormula(
      damage.formulaExpression,
      damage.formula,
      effect,
      sourceItem,
    );
    if (!sourceItem || !formula || !damageType || damageTypes.length > 1) continue;

    workflow.__arcaneTemporaryHitPointsRetaliation.add(dedupeKey);
    await applyBonusDamageWorkflow({
      actor,
      token: targetToken,
      item: sourceItem,
      activity: null,
      hitTargets: new Set([attacker]),
      targets: new Set([attacker]),
      itemCardId: workflow.itemCardId,
    }, formula, damageType, (sourceItem.name ?? effect.name) + " Retaliation", {
      riderId: contract.runtimeRuleId ?? "temporary-hit-points-retaliation-v1",
      sourceEffectUuid: effect.uuid,
      targets: [attacker],
      properties: damage.properties ?? ["spell", "mgc"],
    });
  }
  return true;
}

async function cleanupTemporaryHitPointsRetaliationAfterDamage(actor) {
  if (!actor || Number(actor.system?.attributes?.hp?.temp ?? 0) > 0) return true;
  const effects = Array.from(actor.effects ?? []).filter(effect =>
    temporaryHitPointsRetaliationContract(effect)
  );
  if (effects.length) {
    await actor.deleteEmbeddedDocuments(
      "ActiveEffect",
      effects.map(effect => effect.id),
    );
  }
  return true;
}

async function cleanupTemporaryHitPointsRetaliationOnDelete(effect, options) {
  const contract = temporaryHitPointsRetaliationContract(effect);
  const actor = effect?.parent;
  if (
    !contract
    || !isPrimaryAutomationGM()
    || actor?.documentName !== "Actor"
  ) return true;
  // DAE identifies the deletion that belongs to a reapplication transaction.
  // Preserve the current temporary HP in that path: the replacement workflow
  // owns the new value. Expiry and explicit deletion have no replacement and
  // must start cleanup immediately, without a wall-clock timer that can be
  // throttled in a background Foundry tab.
  if (options?.existing === "effect-stacking") return true;
  const replacement = Array.from(actor.effects ?? []).some(current =>
    current.id !== effect.id
    && current.disabled !== true
    && current.isSuppressed !== true
    && temporaryHitPointsRetaliationContract(current)
  );
  if (replacement) return true;
  const current = Number(actor.system?.attributes?.hp?.temp ?? 0);
  const granted = Number(
    arcaneEffectFlag(effect, "temporaryHitPointsGranted") ?? 0,
  );
  if (
    current > 0
    && Number.isFinite(granted)
    && granted > 0
    && current <= granted
  ) {
    await actor.update({ "system.attributes.hp.temp": 0 });
  }
  return true;
}

function sleepImmuneActor(actor) {
  if (!actor) return true;
  const type = actorRaceOrType(actor);
  if (/(^|\W)undead(\W|$)/i.test(type)) return true;
  const ci = actor.system?.traits?.ci;
  const values = new Set(
    Array.from(ci?.value ?? []).map(value => String(value).toLowerCase()),
  );
  const custom = String(ci?.custom ?? "").toLowerCase();
  return ["charmed", "unconscious", "incapacitated", "sleep"].some(value =>
    values.has(value)
  )
    || /magical sleep|(?:can(?:not|'t)|unable to) be put to sleep|magic can(?:not|'t) put .* to sleep|\u514d\u75ab.*\u7761\u7720|\u7761\u7720.*\u514d\u75ab/.test(custom);
}

function conditionImmuneActor(actor, condition) {
  if (!actor || !condition) return true;
  const values = new Set(
    Array.from(actor.system?.traits?.ci?.value ?? []).map(value =>
      String(value).toLowerCase()
    ),
  );
  return values.has(String(condition).toLowerCase());
}

function hitPointPoolActorIsSusceptible(actor, policy) {
  switch (policy) {
    case "magical-sleep":
      return !sleepImmuneActor(actor);
    case "condition:blinded":
      return !conditionImmuneActor(actor, "blinded");
    default:
      return false;
  }
}

async function templateDocumentForWorkflow(workflow) {
  const templateUuid = workflow?.templateUuid ?? workflow?.template?.uuid;
  let template = templateUuid ? await fromUuid(templateUuid).catch(() => null) : null;
  if (!template && workflow?.templateId) template = canvas.scene?.templates?.get(workflow.templateId);
  return template?.document ?? template ?? null;
}

async function templateTargetsForWorkflow(item, workflow, knownTemplate = null) {
  const direct = workflowTargetTokens(workflow);
  if (direct.length) return direct;
  const template = knownTemplate ?? await templateDocumentForWorkflow(workflow);
  if (!template || typeof MidiQOL?.computeTargetsFromTemplates !== "function") return [];
  return Array.from(
    MidiQOL.computeTargetsFromTemplates(
      [template],
      item?.actor?.uuid ?? "",
      false,
      "any",
      "wallsBlock",
    ) ?? [],
  );
}

function workflowTemplateMatchesItem(item, workflow, candidate) {
  const template = candidate?.document ?? candidate;
  if (!template) return false;
  const itemUuid = String(item?.uuid ?? "");
  const activityUuid = String(workflow?.activity?.uuid ?? "");
  const references = [
    template.flags?.dnd5e?.origin,
    template.flags?.dnd5e?.item,
    template.flags?.dnd5e?.itemUuid,
    template.flags?.["midi-qol"]?.originUuid,
  ].map(value => String(value ?? "")).filter(Boolean);
  return references.some(reference =>
    (activityUuid && reference === activityUuid)
    || (itemUuid && reference === itemUuid)
  );
}

async function ownedTemplateDocumentForWorkflow(item, workflow) {
  const candidates = [
    workflow?.template,
    workflow?.templateDocument,
    workflow?.templateUuid ? await fromUuid(workflow.templateUuid).catch(() => null) : null,
    workflow?.templateId ? canvas.scene?.templates?.get(workflow.templateId) : null,
  ].filter(Boolean);
  const match = candidates.find(candidate =>
    workflowTemplateMatchesItem(item, workflow, candidate)
  );
  return match?.document ?? match ?? null;
}

function compilerWorkflowUsesSnapshotTemplate(item, workflow) {
  const automation = item?.flags?.[MODULE_ID]?.spellAutomation;
  const interaction = workflow?.activity?.flags?.[MODULE_ID]?.interaction;
  return automation?.source === "compiler"
    && automation?.areaBehavior !== "persistent-zone"
    && interaction?.input === "placed-template"
    && interaction?.templateTargets === "workflow";
}

function compilerWorkflowUsesCastOriginStaticMarker(item, workflow) {
  const automation = item?.flags?.[MODULE_ID]?.spellAutomation;
  const contract = workflow?.activity?.flags?.[MODULE_ID]?.castOriginStaticMarker;
  return Boolean(
    automation?.source === "compiler"
    && Number(contract?.version) === 1
    && contract?.stationary === true
    && contract?.artifactId
    && contract?.sourceArtifactId
  );
}

async function applyCastOriginStaticMarkerFromUse(item, usageConfig, workflow) {
  if (
    !isPrimaryAutomationGM()
    || !compilerWorkflowUsesCastOriginStaticMarker(item, workflow)
  ) return false;
  const contract = workflow.activity.flags[MODULE_ID].castOriginStaticMarker;
  const rules = compilerRuntimeRulesForAdapter(
    item,
    "cast-origin-static-marker-v1",
  ).filter(rule =>
    rule.id === workflowSemanticActionId(workflow)
    || rule.sourceActionId === workflowSemanticActionId(workflow)
  );
  if (
    rules.length !== 1
    || rules[0]?.adapter?.artifactId !== contract.artifactId
    || rules[0]?.adapter?.sourceArtifactId !== contract.sourceArtifactId
  ) {
    throw new Error("cast-origin-static-marker-v1 runtime contract drifted");
  }
  const markerDistance = Number(contract.shape?.size);
  if (
    contract.shape?.type !== "radius"
    || contract.shape?.units !== "ft"
    || !Number.isFinite(markerDistance)
    || markerDistance <= 0
  ) {
    throw new Error("cast-origin-static-marker-v1 requires one positive foot radius");
  }
  const actor = workflow?.actor ?? item?.actor ?? item?.parent;
  const sourceEffects = compilerEffectsForArtifact(
    actor,
    contract.sourceArtifactId,
    item,
  );
  if (sourceEffects.length !== 1) {
    throw new Error("cast-origin-static-marker-v1 requires one exact source effect");
  }
  const template = await ownedTemplateDocumentForWorkflow(item, workflow);
  if (!template?.uuid || template.parent?.documentName !== "Scene") {
    throw new Error("cast-origin-static-marker-v1 could not resolve its workflow template");
  }
  const existingContract = template.flags?.[MODULE_ID]?.castOriginStaticMarker;
  if (existingContract?.workflowUuid) {
    if (
      existingContract.workflowUuid !== perSpellScriptWorkflowUuid(workflow)
      || existingContract.sourceEffectUuid !== sourceEffects[0].uuid
    ) {
      throw new Error("cast-origin-static-marker-v1 template is already owned elsewhere");
    }
  }
  await template.update({
    // D&D5e/Midi self-radius placement may add half of the source Token's
    // footprint (plus a provider epsilon) to the stored distance. A
    // cast-origin marker is center-anchored by contract, so settle the
    // persisted document back to the authored radius and disable any later
    // token-size adjustment.
    distance: markerDistance,
    "flags.dnd5e.dimensions.size": markerDistance,
    "flags.dnd5e.dimensions.adjustedSize": false,
    "flags.dnd5e.dependentOn": sourceEffects[0].uuid,
    ["flags." + MODULE_ID + ".castOriginStaticMarker"]: {
      version: 1,
      artifactId: contract.artifactId,
      sourceArtifactId: contract.sourceArtifactId,
      sourceActorUuid: actor.uuid,
      sourceItemUuid: item.uuid,
      sourceEffectUuid: sourceEffects[0].uuid,
      workflowUuid: perSpellScriptWorkflowUuid(workflow),
      distance: markerDistance,
      stationary: true,
    },
    ...(contract.color ? { fillColor: contract.color } : {}),
    ...(Number.isFinite(Number(contract.opacity))
      ? { fillAlpha: Number(contract.opacity) }
      : {}),
  });
  if (!existingContract?.workflowUuid) {
    const dependents = globalThis.dnd5e?.registry?.dependents
      ?? game.dnd5e?.registry?.dependents;
    if (!dependents?.track) {
      throw new Error("cast-origin-static-marker-v1 dependent registry is unavailable");
    }
    dependents.track(sourceEffects[0].uuid, template);
  }
  workflow.__arcaneCastOriginStaticMarkerReceipt = {
    schema: "arcane.cast-origin-static-marker-receipt.v1",
    templateUuid: template.uuid,
    sourceEffectUuid: sourceEffects[0].uuid,
    distance: markerDistance,
    retry: false,
  };
  return true;
}

async function releaseCompilerSnapshotTemplateFromUse(item, usageConfig, workflow) {
  if (!compilerWorkflowUsesSnapshotTemplate(item, workflow)) return false;
  const candidate = await ownedTemplateDocumentForWorkflow(item, workflow);
  const template = candidate?.uuid
    ? await fromUuid(candidate.uuid).catch(() => null)
    : null;
  if (!template) return false;

  const dependentOn = template.flags?.dnd5e?.dependentOn;
  const dependents = globalThis.dnd5e?.registry?.dependents
    ?? game.dnd5e?.registry?.dependents;
  if (
    dependentOn
    && (
      typeof dependents?.untrack !== "function"
      || typeof dependents?.track !== "function"
    )
  ) {
    throw new Error(
      "compiler snapshot-template cleanup requires the dnd5e dependents registry",
    );
  }

  if (dependentOn) {
    dependents.untrack(dependentOn, template);
    try {
      await template.unsetFlag("dnd5e", "dependentOn");
    } catch (error) {
      dependents.track(dependentOn, template);
      throw error;
    }
  }

  const receipt = {
    version: 1,
    templateUuid: template.uuid,
    detachedFrom: dependentOn ?? null,
    deleted: false,
  };
  workflow.__arcaneSnapshotTemplateCleanup = receipt;
  try {
    await template.delete({ noConcentrationCheck: true });
    receipt.deleted = true;
  } catch (error) {
    if (dependentOn) {
      await template.setFlag("dnd5e", "dependentOn", dependentOn)
        .catch(() => null);
      dependents.track(dependentOn, template);
    }
    throw error;
  }
  return true;
}

async function releaseHitPointPoolTemplateSource(item, sourceActor, template) {
  const dependentOn = template?.flags?.dnd5e?.dependentOn;
  if (!dependentOn) return false;
  const sourceEffect = await fromUuid(dependentOn).catch(() => null);
  if (!sourceEffect) return false;
  const itemUuid = String(item?.uuid ?? "");
  const origin = String(sourceEffect.origin ?? "");
  if (
    sourceEffect.documentName !== "ActiveEffect"
    || String(sourceEffect.parent?.uuid ?? "") !== String(sourceActor?.uuid ?? "")
    || !itemUuid
    || !(origin === itemUuid || origin.startsWith(itemUuid + ".Activity."))
  ) {
    throw new Error(
      "hit-point-pool-allocator-v1 refused to delete an unrelated template source",
    );
  }
  await sourceEffect.delete();
  return true;
}

function hitPointPoolTargetSnapshot(token) {
  const actor = token?.actor;
  const hitPoints = Number(actor?.system?.attributes?.hp?.value);
  if (!actor || !Number.isFinite(hitPoints)) return null;
  return {
    token,
    actor,
    hitPoints,
    stableId: String(token?.document?.uuid ?? token?.uuid ?? token?.id ?? actor.uuid ?? ""),
    statuses: new Set(
      Array.from(actor.statuses ?? []).map(value => String(value).toLowerCase()),
    ),
  };
}

function hitPointPoolTargetsForTemplate(item, template) {
  if (typeof MidiQOL?.computeTargetsFromTemplates !== "function") {
    throw new Error(
      "hit-point-pool-allocator-v1 requires Midi template target computation",
    );
  }
  return Array.from(
    MidiQOL.computeTargetsFromTemplates(
      [template],
      item?.actor?.uuid ?? "",
      false,
      "any",
      "wallsBlock",
    ) ?? [],
  );
}

async function applyHitPointPoolArtifact(
  item,
  sourceActor,
  targetSnapshot,
  artifactId,
) {
  const targetActor = targetSnapshot.actor;
  const effectData = effectDataFromItem(
    item,
    effect => compilerArtifactIds(effect).includes(artifactId),
    sourceActor,
  );
  if (!effectData) {
    throw new Error(
      "hit-point-pool-allocator-v1 could not materialize artifact " + artifactId,
    );
  }
  const moduleFlags = effectData.flags?.[MODULE_ID] ?? {};
  effectData.flags ??= {};
  effectData.flags[MODULE_ID] = {
    ...moduleFlags,
    sourceUuid: sourceActor.uuid,
    targetUuid: targetActor.uuid,
    targetTokenUuid:
      targetSnapshot.token?.document?.uuid
      ?? targetSnapshot.token?.uuid
      ?? null,
  };
  anchorRuntimeEffectLifecycleData(effectData);
  const existing = compilerEffectsForArtifact(targetActor, artifactId, item)
    .filter(effect => {
      const flags = effect.flags?.[MODULE_ID] ?? {};
      return String(flags.sourceUuid ?? flags.sourceActorUuid ?? "")
          === String(sourceActor.uuid ?? "")
        && String(flags.targetUuid ?? targetActor.uuid)
          === String(targetActor.uuid ?? "");
    });
  if (existing.length) {
    await targetActor.deleteEmbeddedDocuments(
      "ActiveEffect",
      existing.map(effect => effect.id),
    );
  }
  const [created] = await targetActor.createEmbeddedDocuments(
    "ActiveEffect",
    [effectData],
  );
  if (!created) {
    throw new Error(
      "hit-point-pool-allocator-v1 failed to create artifact " + artifactId,
    );
  }
  return created;
}

async function applyHitPointPoolAllocatorFromUse(item, usageConfig, workflow) {
  const semanticActionId = workflowSemanticActionId(workflow);
  const allRules = compilerRuntimeRulesForAdapter(
    item,
    "hit-point-pool-allocator-v1",
  );
  if (allRules.length > 0 && !semanticActionId) {
    throw new Error(
      "hit-point-pool-allocator-v1 requires compiler semantic action identity",
    );
  }
  const rules = allRules.filter(rule =>
    rule.trigger === "action-used"
    && (!rule.sourceActionId || rule.sourceActionId === semanticActionId)
  );
  if (!rules.length) return false;
  if (rules.length !== 1) {
    throw new Error(
      "hit-point-pool-allocator-v1 requires exactly one runtime rule per action",
    );
  }
  const rule = rules[0];
  const operations = (rule.operations ?? []).filter(operationValue =>
    operationValue.type === "allocate-hit-point-pool"
  );
  const operationValue = operations[0];
  const target = (rule.targets ?? []).find(candidate =>
    candidate.semanticId === operationValue?.target
  );
  if (
    operations.length !== 1
    || !operationValue?.artifactId
    || !operationValue.formulaExpression
    || !target
    || target.origin?.type !== "placed-template"
    || target.evaluation !== "snapshot"
    || target.targetKind !== "creature"
    || operationValue.eligibility?.currentHitPoints !== "positive"
    || ![
      "magical-sleep",
      "condition:blinded",
    ].includes(operationValue.eligibility?.requiredSusceptibility)
  ) {
    throw new Error(
      "hit-point-pool-allocator-v1 received an invalid compiler runtime plan",
    );
  }
  workflow.__arcaneHitPointPoolAllocatorRules ??= new Set();
  if (workflow.__arcaneHitPointPoolAllocatorRules.has(rule.id)) return true;
  workflow.__arcaneHitPointPoolAllocatorRules.add(rule.id);
  try {
    const sourceActor = workflow?.actor ?? item?.actor;
    if (!sourceActor) {
      throw new Error("hit-point-pool-allocator-v1 could not resolve source actor");
    }
    const template = await ownedTemplateDocumentForWorkflow(item, workflow);
    if (!template) {
      throw new Error(
        "hit-point-pool-allocator-v1 could not resolve its owned measured template",
      );
    }
    const excludedStatuses = new Set(
      operationValue.eligibility.excludedStatuses ?? [],
    );
    const snapshotCandidates = hitPointPoolTargetsForTemplate(item, template)
      .map(hitPointPoolTargetSnapshot)
      .filter(Boolean)
      .filter(snapshot =>
        ["character", "npc"].includes(String(snapshot.actor?.type ?? ""))
      )
      .filter(snapshot => snapshot.hitPoints > 0)
      .filter(snapshot =>
        ![...excludedStatuses].some(status => snapshot.statuses.has(status))
      )
      .filter(snapshot => hitPointPoolActorIsSusceptible(
        snapshot.actor,
        operationValue.eligibility.requiredSusceptibility,
      ));
    const snapshotsByActor = new Map();
    for (const snapshot of snapshotCandidates) {
      const actorIdentity = String(
        snapshot.actor?.uuid ?? snapshot.actor?.id ?? snapshot.stableId,
      );
      const existing = snapshotsByActor.get(actorIdentity);
      if (!existing || snapshot.stableId.localeCompare(existing.stableId) < 0) {
        snapshotsByActor.set(actorIdentity, snapshot);
      }
    }
    const snapshots = [...snapshotsByActor.values()].sort((left, right) =>
        left.hitPoints - right.hitPoints
        || left.stableId.localeCompare(right.stableId)
      );
    const castLevel = workflowCastLevel(item, usageConfig, workflow);
    const formula = runtimeValueExpressionFormula(
      operationValue.formulaExpression,
      {
        castLevel,
        baseLevel: Math.max(0, Number(item?.system?.level ?? 0) || 0),
        sourceActor,
      },
    );
    if (!formula) {
      throw new Error(
        "hit-point-pool-allocator-v1 could not lower its pool formula",
      );
    }
    const roll = await new Roll(formula).evaluate();
    if (game.dice3d) await game.dice3d.showForRoll(roll, game.user);
    let remaining = Number(roll.total ?? 0);
    const affected = [];
    for (const snapshot of snapshots) {
      if (snapshot.hitPoints > remaining) continue;
      remaining -= snapshot.hitPoints;
      await applyHitPointPoolArtifact(
        item,
        sourceActor,
        snapshot,
        operationValue.artifactId,
      );
      affected.push(
        snapshot.token?.name
        ?? snapshot.actor?.name
        ?? snapshot.stableId,
      );
    }
    // The placed template is owned by dnd5e/Midi. Release its provider-created
    // source effect so dnd5e performs one dependency-aware template cleanup;
    // deleting the template document directly races the provider cleanup.
    await releaseHitPointPoolTemplateSource(item, sourceActor, template);
    await ChatMessage.create({
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: sourceActor }),
      content: "<p><strong>" + item.name + ":</strong> "
        + roll.formula + " = " + roll.total
        + "; affected " + (affected.join(", ") || "none")
        + "; remaining pool " + remaining + ".</p>",
    });
    return true;
  } catch (error) {
    workflow.__arcaneHitPointPoolAllocatorRules.delete(rule.id);
    throw error;
  }
}

async function applySleepFromUse(item, usageConfig, workflow) {
  if (item?.system?.identifier !== "sleep") return true;
  const actor = workflow?.actor ?? item.actor;
  if (!actor) return true;
  const template = await templateDocumentForWorkflow(workflow);
  const targets = (await templateTargetsForWorkflow(item, workflow, template))
    .filter(token => token?.actor)
    .filter(token => Number(token.actor.system?.attributes?.hp?.value ?? 0) > 0)
    .filter(token => !token.actor.statuses?.has("unconscious"))
    .filter(token => !sleepImmuneActor(token.actor))
    .sort((left, right) =>
      Number(left.actor.system?.attributes?.hp?.value ?? 0)
      - Number(right.actor.system?.attributes?.hp?.value ?? 0)
      || String(left.id ?? "").localeCompare(String(right.id ?? ""))
    );
  const castLevel = spellCastLevel(item, usageConfig, workflow);
  const dice = 5 + Math.max(0, castLevel - 1) * 2;
  const roll = await new Roll(String(dice) + "d8").evaluate();
  let remaining = Number(roll.total ?? 0);
  const affected = [];
  const effectData = effectDataFromItem(item, effect => effect.getFlag?.(MODULE_ID, "sleepEffect"), actor);
  if (effectData) {
    for (const token of targets) {
      const hp = Number(token.actor.system?.attributes?.hp?.value ?? 0);
      if (hp > remaining) continue;
      remaining -= hp;
      await applyEffectDataToTokens([token], effectData);
      affected.push(token.name ?? token.actor.name);
    }
  }
  if (template?.delete) await template.delete().catch(() => {});
  await ChatMessage.create({
    user: game.user?.id,
    speaker: ChatMessage.getSpeaker({ actor }),
    content: "<p><strong>Sleep:</strong> " + roll.formula + " = " + roll.total
      + "; affected " + (affected.join(", ") || "none") + "; remaining pool " + remaining + ".</p>",
  });
  return true;
}

function placedPointMoveTemplateMatches(item, workflow, candidate) {
  return workflowTemplateMatchesItem(item, workflow, candidate);
}

async function placedPointMoveTemplate(item, workflow) {
  const candidates = [
    workflow?.template,
    workflow?.templateDocument,
    workflow?.templateUuid ? await fromUuid(workflow.templateUuid).catch(() => null) : null,
    workflow?.templateId ? canvas.scene?.templates?.get(workflow.templateId) : null,
  ].filter(Boolean);
  const direct = candidates.find(candidate =>
    placedPointMoveTemplateMatches(item, workflow, candidate)
  );
  if (direct) return direct.document ?? direct;
  return Array.from(canvas.scene?.templates ?? [])
    .filter(template => placedPointMoveTemplateMatches(item, workflow, template))
    .filter(template => {
      const created = Number(template._stats?.createdTime ?? 0);
      return !created || Date.now() - created < 30000;
    })
    .sort((left, right) =>
      Number(right._stats?.createdTime ?? 0) - Number(left._stats?.createdTime ?? 0)
    )[0] ?? null;
}

async function applyPlacedPointMoveTokenFromUse(item, usageConfig, workflow) {
  const semanticActionId = workflowSemanticActionId(workflow);
  const rules = compilerRuntimeRulesForAdapter(
    item,
    "placed-point-move-token-v1",
  ).filter(rule =>
    rule.trigger === "action-used"
    && (!rule.sourceActionId || rule.sourceActionId === semanticActionId)
  );
  const activityFlags = workflow?.activity?.flags?.[MODULE_ID] ?? {};
  const legacyMistyStep = item?.system?.identifier === "misty-step"
    && (
      activityFlags.mistyStepDestination === true
      || activityFlags.placedPointMoveDestination === true
    );
  if (rules.length === 0 && !legacyMistyStep) return false;
  if (rules.length > 1) {
    throw new Error(
      "placed-point-move-token-v1 requires exactly one runtime rule per action",
    );
  }
  if (rules.length === 1) {
    const moves = (rules[0].operations ?? []).filter(operationValue =>
      operationValue.type === "move-token"
    );
    if (
      moves.length !== 1
      || moves[0].target !== "source"
      || !String(moves[0].destination ?? "").trim()
    ) {
      throw new Error(
        "placed-point-move-token-v1 requires one source move with a destination",
      );
    }
  }
  if (workflow.__arcanePlacedPointMoveTokenApplied === true) return true;
  const actor = workflow?.actor ?? item.actor;
  const token = workflow?.token?.object ?? workflow?.token ?? findSourceToken(actor);
  const template = await placedPointMoveTemplate(item, workflow);
  if (!token?.document) {
    throw new Error("placed-point-move-token-v1 could not resolve the source token");
  }
  if (!template) {
    throw new Error("placed-point-move-token-v1 could not resolve its owned destination template");
  }
  const destination = rules.length === 1
    ? {
        // The compiler lowers a placed space to one 5-ft square. Foundry
        // stores that square's snapped top-left grid vertex on the template.
        // TokenDocument x/y use the same top-left coordinate system.
        x: Number(template.x ?? 0),
        y: Number(template.y ?? 0),
      }
    : (() => {
        // Preserve the historical embedded-item fallback, whose 1-ft radius
        // template represented its center rather than an occupied square.
        const gridSize = Number(
          canvas.grid?.size ?? canvas.scene?.grid?.size ?? 100,
        );
        const width = Number(token.document.width ?? 1) * gridSize;
        const height = Number(token.document.height ?? 1) * gridSize;
        return {
          x: Number(template.x ?? 0) - width / 2,
          y: Number(template.y ?? 0) - height / 2,
        };
      })();
  await token.document.update(destination);
  await template.delete();
  workflow.__arcanePlacedPointMoveTokenApplied = true;
  return true;
}

async function applyLevel12SpellPostUse(item, usageConfig, workflow) {
  await applyMagicWeaponFromUse(item, usageConfig, workflow);
  if (
    compilerRuntimeRulesForAdapter(
      item,
      "hit-point-pool-allocator-v1",
    ).length === 0
  ) {
    await applySleepFromUse(item, usageConfig, workflow);
  }
  return true;
}

function externalTransitionCaptureKey(contract, sourceEffect, actor) {
  return [
    contract.applyRuleId,
    sourceEffect?.uuid,
    actor?.uuid,
    contract.resultArtifactId,
  ].join(":");
}

function captureExternalOperationArtifactTransition(
  workflow,
  actor,
  sourceEffect,
  contract,
) {
  const instance = temporaryHitPointsSourceInstance(sourceEffect);
  if (!instance || Number(actor?.system?.attributes?.hp?.temp ?? 0) <= 0) {
    return false;
  }
  workflow.__arcaneExternalArtifactTransitions ??= new Map();
  workflow.__arcaneExternalArtifactTransitions.set(
    externalTransitionCaptureKey(contract, sourceEffect, actor),
    {
      actorUuid: actor.uuid,
      sourceActorUuid: instance.sourceActorUuid,
      sourceItemUuid: instance.sourceItemUuid || sourceEffect.origin,
      sourceEffectUuid: sourceEffect.uuid,
      contract,
    },
  );
  return true;
}

function captureExternalOperationArtifactTransitionsBeforeDamage(
  target,
  context = {},
) {
  const workflow = context?.workflow;
  if (
    !isPrimaryAutomationGM()
    || workflow?.activity?.type !== "attack"
    || context?.damageItem?.wasHit === false
  ) return true;
  const actor = target?.actor;
  if (!actor || Number(actor.system?.attributes?.hp?.temp ?? 0) <= 0) return true;
  for (const sourceEffect of Array.from(actor.effects ?? [])) {
    for (
      const contract
      of externalOperationArtifactTransitionContracts(sourceEffect, "source")
    ) {
      if (contract.operationId !== "external:attack-roll") continue;
      captureExternalOperationArtifactTransition(
        workflow,
        actor,
        sourceEffect,
        contract,
      );
    }
  }
  return true;
}

async function consumeExternalOperationArtifactTransitions(workflow) {
  if (
    !isPrimaryAutomationGM()
    || workflow?.aborted === true
    || workflow?.activity?.type !== "attack"
  ) return true;
  const actor = workflow?.actor ?? workflow?.item?.actor;
  if (!actor) return true;
  const effects = Array.from(actor.effects ?? []).filter(effect =>
    externalOperationArtifactTransitionContracts(effect, "result")
      .some(contract => contract.operationId === "external:attack-roll")
  );
  if (effects.length) {
    await actor.deleteEmbeddedDocuments(
      "ActiveEffect",
      effects.map(effect => effect.id),
    );
  }
  return true;
}

async function resolveExternalOperationArtifactTransitions(workflow) {
  if (
    !isPrimaryAutomationGM()
    || workflow?.aborted === true
    || workflow?.activity?.type !== "attack"
  ) return true;
  const hits = new Map(workflow.__arcaneExternalArtifactTransitions ?? []);
  for (const target of confirmedHitTargets(workflow)) {
    const actor = target?.actor;
    if (!actor || Number(actor.system?.attributes?.hp?.temp ?? 0) <= 0) continue;
    for (const sourceEffect of Array.from(actor.effects ?? [])) {
      for (
        const contract
        of externalOperationArtifactTransitionContracts(sourceEffect, "source")
      ) {
        if (contract.operationId !== "external:attack-roll") continue;
        captureExternalOperationArtifactTransition(
          workflow,
          actor,
          sourceEffect,
          contract,
        );
      }
    }
  }
  for (
    const [key, value]
    of workflow.__arcaneExternalArtifactTransitions ?? []
  ) {
    hits.set(key, value);
  }
  for (const hit of hits.values()) {
    const actor = await fromUuid(hit.actorUuid);
    const sourceActor = hit.sourceActorUuid
      ? await fromUuid(hit.sourceActorUuid).catch(() => null)
      : null;
    const sourceItem = hit.sourceItemUuid
      ? await fromUuid(hit.sourceItemUuid).catch(() => null)
      : null;
    const resultArtifactId = String(
      hit.contract?.resultArtifactId ?? "",
    ).trim();
    if (!actor || !sourceItem || !resultArtifactId) continue;
    const existing = compilerEffectsForArtifact(
      actor,
      resultArtifactId,
      sourceItem,
    );
    if (existing.length) {
      await actor.deleteEmbeddedDocuments(
        "ActiveEffect",
        existing.map(effect => effect.id),
      );
    }
    const created = await createCompilerArtifactEffect(
      sourceItem,
      actor,
      resultArtifactId,
    );
    if (!created) {
      throw new Error(
        "external-operation-artifact-transition-v1 could not materialize "
        + resultArtifactId,
      );
    }
    await created.update({
      ["flags." + MODULE_ID + ".sourceActorUuid"]:
        sourceActor?.uuid ?? hit.sourceActorUuid,
      ["flags." + MODULE_ID + ".externalOperationArtifactTransitionInstance"]: {
        version: 1,
        applyRuleId: hit.contract.applyRuleId,
        sourceEffectUuid: hit.sourceEffectUuid,
        sourceItemUuid: sourceItem.uuid,
        resultArtifactId,
      },
    });
  }
  return true;
}

function spiritShroudSourceEffect(actor) {
  return Array.from(actor?.effects ?? []).find(effect =>
    effect.disabled !== true
    && !effect.flags?.auraeffects?.fromAura
    && (effect.getFlag?.(MODULE_ID, "spiritShroud") === true || effect.flags?.[MODULE_ID]?.spiritShroud === true)
  );
}

function spiritShroudCastLevel(effect) {
  return Math.min(9, Math.max(3, Number(
    effect?.flags?.["midi-qol"]?.castData?.castLevel
    ?? effect?.flags?.[MODULE_ID]?.castLevel
    ?? 3
  ) || 3));
}

function opposedDisposition(sourceToken, targetToken) {
  const source = Number(sourceToken?.document?.disposition ?? 0);
  const target = Number(targetToken?.document?.disposition ?? 0);
  return source !== 0 && target !== 0 && Math.sign(source) !== Math.sign(target);
}

function bloodSeekingFeature(actor) {
  return Array.from(actor?.items ?? []).find(item =>
    item?.system?.identifier === BLOOD_SEEKING_IDENTIFIER
    || item?.flags?.[MODULE_ID]?.bloodSeeking?.version === 1
  ) ?? null;
}

function bloodSeekingToken(value) {
  if (!value) return null;
  if (value.document?.disposition !== undefined) return value;
  if (value.object?.document?.disposition !== undefined) return value.object;
  if (value.disposition !== undefined && value.actor) {
    return { document: value, actor: value.actor };
  }
  return null;
}

async function bloodSeekingTargetForDamageEntry(entry, workflow) {
  const targetUuid = String(entry?.tokenUuid ?? entry?.targetUuid ?? "");
  const actorUuid = String(entry?.actorUuid ?? "");
  const candidates = [
    ...compilerRuntimeCollectionValues(workflow?.hitTargets),
    ...compilerRuntimeCollectionValues(workflow?.targets),
  ].map(bloodSeekingToken).filter(Boolean);
  const existing = candidates.find(target =>
    (targetUuid && String(target.document?.uuid ?? "") === targetUuid)
    || (actorUuid && String(target.actor?.uuid ?? "") === actorUuid)
  );
  if (existing) return existing;
  if (!targetUuid) return null;
  const document = await fromUuid(targetUuid).catch(() => null);
  return bloodSeekingToken(document);
}

function bloodSeekingDamageEntryDefeated(entry, target) {
  const hpDamage = Number(entry?.hpDamage ?? entry?.totalDamage ?? 0);
  const settledHp = Number(target?.actor?.system?.attributes?.hp?.value);
  const reportedNext = Number(entry?.newHP ?? entry?.newHp);
  const newHp = Number.isFinite(reportedNext) ? reportedNext : settledHp;
  const reportedOld = Number(entry?.oldHP ?? entry?.oldHp);
  const oldHp = Number.isFinite(reportedOld)
    ? reportedOld
    : Number.isFinite(newHp) && hpDamage > 0
      ? newHp + hpDamage
      : Number.NaN;
  return hpDamage > 0 && Number.isFinite(oldHp) && oldHp > 0
    && Number.isFinite(newHp) && newHp <= 0;
}

function bloodSeekingTemporaryHitPoints(actor, feature) {
  const charismaModifier = Number(actor?.system?.abilities?.cha?.mod ?? 0);
  const levelBonus = Number(feature?.flags?.[MODULE_ID]?.bloodSeeking?.levelBonus ?? 1);
  return Math.max(
    1,
    (Number.isFinite(charismaModifier) ? charismaModifier : 0)
      + (Number.isFinite(levelBonus) ? levelBonus : 1),
  );
}

async function applyBloodSeekingFromWorkflow(workflow) {
  if (
    !isPrimaryAutomationGM()
    || !workflow
    || workflow.aborted === true
    || workflow.__arcaneBloodSeeking
  ) return true;

  workflow.__arcaneBloodSeeking = { version: 1, triggered: false };
  const actor = workflow.actor ?? workflow.item?.actor ?? workflow.activity?.actor;
  const feature = bloodSeekingFeature(actor);
  const sourceToken = bloodSeekingToken(workflow.token) ?? findSourceToken(actor);
  if (!actor || !feature || !sourceToken) return true;

  const defeated = [];
  for (const entry of compilerRuntimeCollectionValues(workflow.damageList)) {
    const target = await bloodSeekingTargetForDamageEntry(entry, workflow);
    if (
      !target?.actor
      || target.actor.uuid === actor.uuid
      || !opposedDisposition(sourceToken, target)
      || !bloodSeekingDamageEntryDefeated(entry, target)
    ) continue;
    defeated.push(target);
  }
  if (!defeated.length) return true;

  const amount = bloodSeekingTemporaryHitPoints(actor, feature);
  const previous = Math.max(0, Number(actor.system?.attributes?.hp?.temp ?? 0) || 0);
  const next = Math.max(previous, amount);
  if (next !== previous) {
    await actor.update({ "system.attributes.hp.temp": next });
  }
  workflow.__arcaneBloodSeeking = {
    version: 1,
    triggered: true,
    featureUuid: feature.uuid,
    defeatedTokenUuids: defeated.map(target => target.document?.uuid).filter(Boolean),
    amount,
    previous,
    next,
  };
  const detail = next > previous
    ? "获得了 <strong>" + amount + "</strong> 点临时生命值。"
    : "触发了寻血，但保留现有更高的 <strong>" + previous + "</strong> 点临时生命值。";
  await ChatMessage.create({
    user: game.user?.id,
    speaker: ChatMessage.getSpeaker({ actor }),
    content: "<p><strong>寻血：</strong>" + detail + "</p>",
    flags: {
      [MODULE_ID]: {
        bloodSeeking: workflow.__arcaneBloodSeeking,
      },
    },
  });
  return true;
}

function isPrimaryAutomationGM() {
  const activeGMs = Array.from(game.users ?? [])
    .filter(user => user?.active === true && user?.isGM === true)
    .sort((left, right) => String(left.id).localeCompare(String(right.id)));
  return game.user?.isGM === true && (!activeGMs.length || activeGMs[0].id === game.user.id);
}

function registerPerSpellScript(registration) {
  if (!registration || typeof registration !== "object" || Array.isArray(registration)) {
    throw new Error("Per-spell script registration must be an object");
  }
  const unknown = Object.keys(registration).filter(key =>
    !["id", "version", "handlers"].includes(key)
  );
  if (unknown.length) {
    throw new Error("Per-spell script registration has unknown fields: " + unknown.join(", "));
  }
  const id = String(registration.id ?? "").trim();
  const version = Number(registration.version);
  const handlers = registration.handlers;
  if (!id || !Number.isInteger(version) || version < 1) {
    throw new Error("Per-spell script registration requires an id and positive integer version");
  }
  if (!handlers || typeof handlers !== "object" || Array.isArray(handlers)) {
    throw new Error(id + " per-spell script handlers must be an object");
  }
  if (
    Object.keys(handlers).length === 0
    || Object.values(handlers).some(handler => typeof handler !== "function")
  ) {
    throw new Error(id + " per-spell script must register callable handlers");
  }
  if (PER_SPELL_SCRIPT_REGISTRY.has(id)) {
    throw new Error("Duplicate per-spell script registration: " + id);
  }
  PER_SPELL_SCRIPT_REGISTRY.set(id, Object.freeze({
    id,
    version,
    handlers: Object.freeze({ ...handlers }),
  }));
  return true;
}

globalThis[PER_SPELL_SCRIPT_GLOBAL] = Object.freeze({
  schemaVersion: 1,
  register: registerPerSpellScript,
});

function perSpellScriptPlan(item) {
  const plan = item?.flags?.[MODULE_ID]?.spellAutomation?.runtimePlan?.script;
  return plan
    && typeof plan === "object"
    && !Array.isArray(plan)
    && Number(plan.schemaVersion) === 1
    ? plan
    : null;
}

function perSpellScriptWorkflowUuid(workflow) {
  return String(
    workflow?.id
    ?? workflow?.itemCardId
    ?? workflow?.uuid
    ?? "workflow",
  );
}

function samePerSpellScriptTarget(left, right) {
  const leftUuid = left?.document?.uuid ?? left?.uuid ?? left?.actor?.uuid;
  const rightUuid = right?.document?.uuid ?? right?.uuid ?? right?.actor?.uuid;
  return Boolean(leftUuid && rightUuid && leftUuid === rightUuid);
}

function perSpellScriptSaveOutcome(workflow, target) {
  const collections = [
    ["failure", workflow?.failedSaves],
    ["success", workflow?.saves],
    ["success", workflow?.successfulSaves],
  ];
  for (const [outcome, collection] of collections) {
    if (Array.from(collection ?? []).some(candidate =>
      samePerSpellScriptTarget(candidate, target)
    )) return outcome;
  }
  return null;
}

function perSpellScriptTargetTurnKey(workflow, target) {
  const eventKey = perSpellScriptWorkflowUuid(workflow);
  const combat = game.combat;
  if (!combat?.started) return compilerEventTurnKey(eventKey, null);
  const cursors = [];
  const previous = compilerPreviousTurnState(combat);
  if (previous?.combatantId) {
    cursors.push({
      combatant: combat.combatants?.get?.(previous.combatantId) ?? null,
      cursor: compilerZoneEventCursor(combat, previous),
    });
  }
  cursors.push({
    combatant: combat.combatant,
    cursor: compilerZoneEventCursor(combat),
  });
  const exact = cursors.find(({ combatant }) =>
    combatant && samePerSpellScriptTarget(combatant.token, target)
  );
  return exact?.cursor ? compilerEventTurnKey(eventKey, exact.cursor) : null;
}

function appendPerSpellScriptReceipt(workflow, receipt) {
  if (!workflow || typeof workflow !== "object") return receipt;
  workflow.__arcanePerSpellScriptReceipts ??= [];
  workflow.__arcanePerSpellScriptReceipts.push(receipt);
  workflow.flags ??= {};
  workflow.flags[MODULE_ID] = {
    ...(workflow.flags[MODULE_ID] ?? {}),
    perSpellScriptReceipts: [...workflow.__arcanePerSpellScriptReceipts],
  };
  Hooks.callAll(MODULE_ID + ".perSpellScriptReceipt", receipt);
  return receipt;
}

function perSpellScriptReceipt({
  plan,
  handler,
  item,
  workflow,
  target,
  sourceEffect,
  status,
  committed,
  retry,
  details = {},
}) {
  if (!PER_SPELL_SCRIPT_RECEIPT_STATUSES.has(status)) {
    throw new Error("Invalid per-spell script completion status " + status);
  }
  if (typeof committed !== "boolean" || typeof retry !== "boolean") {
    throw new Error("Per-spell script completion must declare committed and retry");
  }
  if ((committed || status === "partial" || status === "indeterminate") && retry) {
    throw new Error("Committed, partial, or indeterminate per-spell scripts cannot be retried");
  }
  return {
    schema: "arcane.per-spell-script-receipt.v1",
    scriptId: plan.id,
    scriptVersion: plan.version,
    handlerId: handler.id,
    event: handler.event,
    authority: handler.authority,
    dedupe: handler.dedupe,
    workflowUuid: perSpellScriptWorkflowUuid(workflow),
    sourceItemUuid: item?.uuid ?? null,
    sourceEffectUuid: sourceEffect?.uuid ?? null,
    targetUuid:
      target?.document?.uuid
      ?? target?.uuid
      ?? target?.actor?.uuid
      ?? null,
    status,
    committed,
    retry,
    details,
  };
}

function assertPerSpellScriptWrite(handler, kind, artifactId) {
  const write = kind + ":" + artifactId;
  if (!(handler.writes ?? []).includes(write)) {
    throw new Error(
      "Per-spell script handler " + handler.id + " did not declare write " + write,
    );
  }
}

function activePerSpellScriptConcentrationEffects(actor) {
  const native = Array.from(actor?.concentration?.effects ?? []);
  const candidates = native.length > 0 ? native : Array.from(actor?.effects ?? []);
  return candidates.filter(effect => {
    if (
      effect?.disabled === true
      || effect?.active === false
      || effect?.isSuppressed === true
    ) return false;
    const statuses = effect.statuses instanceof Set
      ? Array.from(effect.statuses)
      : Array.from(effect.statuses ?? []);
    return statuses.includes("concentrating");
  });
}

function perSpellScriptConcentrationAnchor(item, artifactId) {
  const activities = Array.from(item?.system?.activities ?? []);
  const matches = activities.filter(activity => {
    const anchor = activity?.flags?.[MODULE_ID]?.runtimeAnchor;
    return (
      Number(anchor?.version) === 1
      && anchor?.kind === "native-concentration"
      && anchor?.artifactId === artifactId
    );
  });
  if (matches.length !== 1) {
    throw new Error(
      "Per-spell script concentration requires exactly one native Activity anchor",
    );
  }
  const activity = matches[0];
  if (
    activity?.item !== item
    || activity?.duration?.concentration !== true
    || activity?.midiProperties?.automationOnly !== true
    || activity?.consumption?.spellSlot !== false
  ) {
    throw new Error("Per-spell script concentration Activity anchor is not prepared");
  }
  return activity;
}

async function beginPerSpellScriptConcentration(item, sourceActor, artifactId, {
  replace = false,
} = {}) {
  if (
    !item?.isEmbedded
    || item?.actor !== sourceActor
    || typeof sourceActor?.beginConcentrating !== "function"
    || typeof sourceActor?.endConcentration !== "function"
  ) {
    throw new Error("Per-spell script native concentration lifecycle is unavailable");
  }
  const previous = activePerSpellScriptConcentrationEffects(sourceActor);
  if (previous.length > 0 && !replace) {
    throw new Error("Per-spell script concentration already exists");
  }
  const anchor = perSpellScriptConcentrationAnchor(item, artifactId);
  const effect = await sourceActor.beginConcentrating(anchor, {
    ["flags." + MODULE_ID]: {
      identifier: item.system?.identifier,
      sourceSpellId: item.id,
      compilerVersion: item.flags?.[MODULE_ID]?.compiler?.version,
      compilerArtifactIds: [artifactId],
      sourceActorUuid: sourceActor.uuid,
      sourceItemUuid: item.uuid,
      targetUuid: sourceActor.uuid,
      perSpellScriptNativeConcentration: true,
    },
  });
  if (!effect) {
    throw new Error("Per-spell script native concentration creation was vetoed");
  }
  const rollbackNewEffect = async message => {
    if (sourceActor.effects?.get?.(effect.id) === effect) {
      await effect.delete();
    }
    if (sourceActor.effects?.get?.(effect.id) === effect) {
      throw new Error("Per-spell script concentration rollback did not settle");
    }
    throw new Error(message);
  };
  try {
    for (const current of previous) {
      if (current?.uuid === effect.uuid) continue;
      await sourceActor.endConcentration(current);
    }
  } catch (error) {
    await rollbackNewEffect(
      "Per-spell script previous concentration replacement failed: "
        + String(error?.message ?? error),
    );
  }
  const unsettled = previous.filter(current =>
    current?.uuid !== effect.uuid
    && sourceActor.effects?.get?.(current.id) === current
  );
  if (unsettled.length > 0) {
    // A partial or total preEnd veto must never strand the just-created source
    // beside an older concentration effect.
    await rollbackNewEffect(
      "Per-spell script previous concentration did not settle",
    );
  }
  const concentration = sourceActor.concentration;
  const active = Array.from(concentration?.effects ?? []);
  const items = Array.from(concentration?.items ?? []);
  if (
    active.length !== 1
    || active[0]?.uuid !== effect.uuid
    || !items.some(current => current?.uuid === item.uuid)
  ) {
    await rollbackNewEffect(
      "Per-spell script native concentration provenance did not settle",
    );
  }
  return effect;
}

function perSpellScriptServices(item, handler) {
  const sourceActor = item?.actor ?? item?.parent;
  return Object.freeze({
    findArtifactEffects(targetActor, artifactId) {
      return compilerEffectsForArtifact(targetActor, artifactId, item);
    },
    readHitPoints(targetActor) {
      return Number(targetActor?.system?.attributes?.hp?.value ?? 0);
    },
    readState(effect) {
      return foundry.utils.deepClone(
        arcaneEffectFlag(effect, "perSpellScriptState") ?? null,
      );
    },
    async updateState(effect, artifactId, state) {
      assertPerSpellScriptWrite(handler, "state", artifactId);
      await effect.update({
        ["flags." + MODULE_ID + ".perSpellScriptState"]: state,
      });
      return effect;
    },
    async createArtifactEffect(targetActor, artifactId, {
      replace = false,
      state = null,
      dependentOn = null,
    } = {}) {
      assertPerSpellScriptWrite(handler, "artifact", artifactId);
      if (artifactId === "concentration") {
        if (!sourceActor || targetActor?.uuid !== sourceActor.uuid) {
          throw new Error("Per-spell script concentration must be source-scoped");
        }
        return beginPerSpellScriptConcentration(
          item,
          sourceActor,
          artifactId,
          { replace },
        );
      }
      const existing = compilerEffectsForArtifact(targetActor, artifactId, item);
      if (existing.length && !replace) {
        throw new Error(
          "Per-spell script artifact already exists: " + artifactId,
        );
      }
      if (existing.length) {
        await targetActor.deleteEmbeddedDocuments(
          "ActiveEffect",
          existing.map(effect => effect.id),
        );
      }
      const created = await createCompilerArtifactEffect(item, targetActor, artifactId);
      if (!created) {
        throw new Error("Could not materialize per-spell script artifact " + artifactId);
      }
      const updates = {};
      if (state !== null) {
        updates["flags." + MODULE_ID + ".perSpellScriptState"] = state;
      }
      if (dependentOn?.uuid) {
        updates["flags.dnd5e.dependentOn"] = dependentOn.uuid;
      }
      if (Object.keys(updates).length) await created.update(updates);
      if (dependentOn?.uuid) {
        const dependents = globalThis.dnd5e?.registry?.dependents
          ?? game.dnd5e?.registry?.dependents;
        if (!dependents?.track) {
          throw new Error("Per-spell script dependent registry is unavailable");
        }
        dependents.track(dependentOn.uuid, created);
      }
      return created;
    },
    async deleteArtifactEffect(effect, artifactId) {
      assertPerSpellScriptWrite(handler, "artifact", artifactId);
      if (!effect?.parent || effect.parent.documentName !== "Actor") {
        throw new Error("Per-spell script can only delete an Actor effect");
      }
      await effect.parent.deleteEmbeddedDocuments("ActiveEffect", [effect.id]);
      return true;
    },
    completion(status, {
      committed = false,
      retry = false,
      details = {},
    } = {}) {
      return { status, committed, retry, details };
    },
    resolveTypedDamageTransaction(context, configuration) {
      return resolveTypedDamageTransactionService(
        item,
        handler,
        context,
        configuration,
      );
    },
    sourceActor,
  });
}

function perSpellScriptTransactionKey({
  event,
  plan,
  handler,
  target,
  sourceEffect,
  targetTurnKey,
}) {
  if (event !== "repeat-save-outcome" || !targetTurnKey) return null;
  const targetUuid = target?.actor?.uuid ?? target?.uuid;
  if (!plan?.id || !handler?.id || !targetUuid || !sourceEffect?.uuid) return null;
  return [
    plan.id,
    handler.id,
    sourceEffect.uuid,
    targetUuid,
    targetTurnKey,
  ].join(":");
}

function prunePerSpellScriptTransactions() {
  if (PER_SPELL_SCRIPT_TRANSACTIONS.size <= PER_SPELL_SCRIPT_TRANSACTION_LIMIT) {
    return true;
  }
  for (const [key, record] of PER_SPELL_SCRIPT_TRANSACTIONS) {
    if (PER_SPELL_SCRIPT_TRANSACTIONS.size <= PER_SPELL_SCRIPT_TRANSACTION_LIMIT) {
      break;
    }
    if (record?.settled === true) PER_SPELL_SCRIPT_TRANSACTIONS.delete(key);
  }
  return true;
}

async function invokePerSpellScriptTransaction(
  transactionKey,
  invoke,
  { targetTurnKey = null } = {},
) {
  if (!transactionKey) return invoke();
  const existing = PER_SPELL_SCRIPT_TRANSACTIONS.get(transactionKey);
  if (existing) {
    let primaryStatus = "indeterminate";
    try {
      const primary = await existing.promise;
      primaryStatus = primary?.status ?? primaryStatus;
    } catch (_error) {
      // The primary invocation owns its error receipt. A duplicate never
      // replays committed state even when that first result was uncertain.
    }
    return {
      status: "skipped",
      committed: true,
      retry: false,
      details: {
        reason: "duplicate-target-turn",
        transactionKey,
        targetTurn: targetTurnKey,
        primaryStatus,
      },
    };
  }
  const record = { settled: false, promise: null };
  record.promise = Promise.resolve()
    .then(invoke)
    .finally(() => {
      record.settled = true;
    });
  PER_SPELL_SCRIPT_TRANSACTIONS.set(transactionKey, record);
  prunePerSpellScriptTransactions();
  return record.promise;
}

async function dispatchPerSpellScript({
  event,
  item,
  workflow,
  target = null,
  sourceEffect = null,
  damageReceipt = null,
  committed = true,
  matches = () => true,
} = {}) {
  const plan = perSpellScriptPlan(item);
  if (!plan || !isPrimaryAutomationGM()) return [];
  if (plan.id !== item?.system?.identifier) {
    throw new Error("Per-spell script plan id does not match its source Item");
  }
  const registration = PER_SPELL_SCRIPT_REGISTRY.get(plan.id);
  const handlers = (plan.handlers ?? []).filter(handler =>
    handler.event === event && matches(handler)
  );
  const receipts = [];
  for (const handler of handlers) {
    let resolvedTarget = target;
    let resolvedSourceEffect = sourceEffect;
    let outcome = null;
    let targetTurnKey = null;
    if (event === "repeat-save-outcome") {
      if (workflowSemanticActionId(workflow) !== handler.semanticActionId) continue;
      const targets = workflowTargetTokens(workflow);
      if (targets.length === 1) resolvedTarget = targets[0];
      if (resolvedTarget?.actor) {
        const effects = compilerEffectsForArtifact(
          resolvedTarget.actor,
          handler.artifactId,
          item,
        );
        if (effects.length === 1) resolvedSourceEffect = effects[0];
      }
      outcome = perSpellScriptSaveOutcome(workflow, resolvedTarget);
      if (outcome && !(handler.outcomes ?? []).includes(outcome)) continue;
      targetTurnKey = perSpellScriptTargetTurnKey(workflow, resolvedTarget);
    }
    const dedupeKey = [
      perSpellScriptWorkflowUuid(workflow),
      handler.id,
      resolvedTarget?.actor?.uuid ?? resolvedTarget?.uuid ?? "target",
      resolvedSourceEffect?.uuid ?? "effect",
    ].join(":");
    workflow.__arcanePerSpellScriptDedupe ??= new Set();
    if (workflow.__arcanePerSpellScriptDedupe.has(dedupeKey)) continue;
    workflow.__arcanePerSpellScriptDedupe.add(dedupeKey);
    try {
      if (
        !registration
        || Number(registration.version) !== Number(plan.version)
        || typeof registration.handlers?.[handler.id] !== "function"
      ) {
        throw new Error("Per-spell script registry does not match compiled plan " + plan.id);
      }
      if (
        event === "repeat-save-outcome"
        && (!resolvedTarget?.actor || !resolvedSourceEffect || !outcome || !targetTurnKey)
      ) {
        throw new Error("Repeat-save script could not resolve one target, source effect, and outcome");
      }
      const services = perSpellScriptServices(item, handler);
      const context = Object.freeze({
        schemaVersion: 1,
        event,
        plan,
        handler,
        sourceItem: item,
        sourceActor: item?.actor ?? item?.parent,
        target: resolvedTarget,
        targetActor: resolvedTarget?.actor ?? null,
        sourceEffect: resolvedSourceEffect,
        outcome,
        targetTurnKey,
        damageReceipt,
        workflow,
        services,
      });
      const transactionKey = perSpellScriptTransactionKey({
        event,
        plan,
        handler,
        target: resolvedTarget,
        sourceEffect: resolvedSourceEffect,
        targetTurnKey,
      });
      const result = await invokePerSpellScriptTransaction(
        transactionKey,
        () => registration.handlers[handler.id](context),
        { targetTurnKey },
      );
      const receipt = perSpellScriptReceipt({
        plan,
        handler,
        item,
        workflow,
        target: resolvedTarget,
        sourceEffect: resolvedSourceEffect,
        status: result?.status,
        committed: result?.committed ?? committed,
        retry: result?.retry ?? false,
        details: result?.details ?? {},
      });
      receipts.push(appendPerSpellScriptReceipt(workflow, receipt));
    } catch (error) {
      const receipt = perSpellScriptReceipt({
        plan,
        handler,
        item,
        workflow,
        target: resolvedTarget,
        sourceEffect: resolvedSourceEffect,
        status: "indeterminate",
        committed,
        retry: false,
        details: { message: String(error?.message ?? error) },
      });
      receipts.push(appendPerSpellScriptReceipt(workflow, receipt));
      recordCompilerRuntimeError(workflow, error, "per-spell-script:" + handler.id);
    }
  }
  return receipts;
}

async function dispatchPerSpellScriptActivity(item, workflow) {
  return dispatchPerSpellScript({
    event: "repeat-save-outcome",
    item,
    workflow,
    committed: true,
  });
}

function typedDamageDispatcherBinding(item, {
  handlerId = null,
  runtimeRuleId = null,
} = {}) {
  const plan = perSpellScriptPlan(item);
  if (!plan) return null;
  const handlers = (plan.handlers ?? []).filter(handler =>
    handler.event === "typed-damage-transaction"
    && (!handlerId || handler.id === handlerId)
    && (!runtimeRuleId || handler.runtimeRuleId === runtimeRuleId)
  );
  if (handlers.length === 0) return null;
  if (handlers.length !== 1) {
    throw new Error("Typed damage dispatcher requires exactly one script handler");
  }
  const handler = handlers[0];
  const rules = compilerRuntimeRulesForAdapter(
    item,
    "typed-damage-dispatcher-v2",
  ).filter(rule =>
    rule.id === handler.runtimeRuleId
    && rule.adapter?.scriptId === plan.id
    && Number(rule.adapter?.scriptVersion) === Number(plan.version)
    && rule.adapter?.handlerId === handler.id
    && rule.adapter?.artifactId === handler.artifactId
    && Number(rule.adapter?.version) === PER_SPELL_DAMAGE_TRANSACTION_VERSION
  );
  if (rules.length !== 1) {
    throw new Error("Typed damage dispatcher could not resolve one exact runtime rule");
  }
  const rule = rules[0];
  const saveOperations = (rule.operations ?? []).filter(operation =>
    operation.type === "saving-throw"
  );
  const damageOperations = (rule.operations ?? []).filter(operation =>
    operation.type === "damage"
  );
  if (
    saveOperations.length !== 1
    || damageOperations.length !== 1
    || rule.trigger !== "action-used"
  ) {
    throw new Error("Typed damage dispatcher rule must contain one save and one damage");
  }
  const registration = PER_SPELL_SCRIPT_REGISTRY.get(plan.id);
  if (
    !registration
    || Number(registration.version) !== Number(plan.version)
    || typeof registration.handlers?.[handler.id] !== "function"
  ) {
    throw new Error("Typed damage script registry does not match its compiled plan");
  }
  const executionPlanHash = String(
    item?.flags?.[MODULE_ID]?.compiler?.executionPlanHash
      ?? item?.flags?.[MODULE_ID]?.compiler?.planHash
      ?? "",
  ).trim();
  if (!executionPlanHash) {
    throw new Error("Typed damage dispatcher requires one execution plan hash");
  }
  return {
    plan,
    handler,
    rule,
    saveOperation: saveOperations[0],
    damageOperation: damageOperations[0],
    registration,
    executionPlanHash,
  };
}

function typedDamageConfiguration(value) {
  const keys = value && typeof value === "object" && !Array.isArray(value)
    ? Object.keys(value).sort()
    : [];
  if (
    JSON.stringify(keys) !== JSON.stringify([
      "durationSeconds",
      "minimumHitPoints",
      "reductionBasis",
      "reductionOutcome",
      "schemaVersion",
    ])
    || Number(value.schemaVersion) !== 1
    || !Number.isInteger(Number(value.minimumHitPoints))
    || Number(value.minimumHitPoints) < 0
    || !["success", "failure"].includes(value.reductionOutcome)
    || value.reductionBasis !== "ordinary-hit-point-loss"
    || !Number.isFinite(Number(value.durationSeconds))
    || Number(value.durationSeconds) <= 0
  ) {
    throw new Error("Typed damage script configuration is malformed");
  }
  return value;
}

function invokeTypedDamageScript({
  phase,
  item,
  binding,
  workflow = null,
  target = null,
  actor = null,
  damageContext = null,
  amount = null,
  updates = null,
  options = null,
  envelope = null,
  receipt = null,
  recovery = false,
} = {}) {
  if (!binding) {
    throw new Error("Typed damage dispatcher cannot invoke without a binding");
  }
  const services = perSpellScriptServices(item, binding.handler);
  const context = Object.freeze({
    schemaVersion: PER_SPELL_DAMAGE_TRANSACTION_VERSION,
    event: "typed-damage-transaction",
    phase,
    plan: binding.plan,
    handler: binding.handler,
    runtimeRule: binding.rule,
    saveOperation: binding.saveOperation,
    damageOperation: binding.damageOperation,
    executionPlanHash: binding.executionPlanHash,
    sourceItem: item,
    sourceActor: item?.actor ?? item?.parent ?? null,
    workflow,
    target,
    targetActor: actor ?? target?.actor ?? null,
    damageContext,
    amount,
    updates,
    options,
    envelope,
    receipt,
    recovery,
    services,
  });
  const result = binding.registration.handlers[binding.handler.id](context);
  if (phase === "pre-apply" && result?.then) {
    throw new Error("Typed damage pre-apply handler must be synchronous");
  }
  return result;
}

const PER_SPELL_DAMAGE_ENVELOPE_KEYS = Object.freeze([
  "activityUuid",
  "artifactId",
  "clampedHitPointDamage",
  "createdAt",
  "damageOperationId",
  "durationSeconds",
  "effectId",
  "executionPlanHash",
  "handlerId",
  "minimumHitPoints",
  "newTemporaryHitPoints",
  "oldHitPoints",
  "oldTemporaryHitPoints",
  "originalHitPointDamage",
  "proposedNewHitPoints",
  "runtimeRuleId",
  "saveOutcome",
  "schema",
  "scriptId",
  "scriptVersion",
  "semanticActionId",
  "sourceActorUuid",
  "sourceItemUuid",
  "sourceTokenUuid",
  "status",
  "targetActorUuid",
  "targetTokenUuid",
  "temporaryHitPointDamage",
  "transactionId",
  "version",
  "workflowUuid",
  "worldTime",
].sort());

function perSpellDamageEnvelope(value) {
  if (
    !value
    || typeof value !== "object"
    || Array.isArray(value)
    || JSON.stringify(Object.keys(value).sort())
      !== JSON.stringify(PER_SPELL_DAMAGE_ENVELOPE_KEYS)
    || value.schema !== "arcane.per-spell-damage-transaction.v2"
    || value.status !== "prepared"
    || Number(value.version) !== PER_SPELL_DAMAGE_TRANSACTION_VERSION
  ) return null;
  const requiredStrings = [
    "transactionId",
    "scriptId",
    "handlerId",
    "executionPlanHash",
    "workflowUuid",
    "sourceActorUuid",
    "sourceTokenUuid",
    "sourceItemUuid",
    "activityUuid",
    "semanticActionId",
    "runtimeRuleId",
    "damageOperationId",
    "targetActorUuid",
    "targetTokenUuid",
    "saveOutcome",
    "artifactId",
    "effectId",
  ];
  if (requiredStrings.some(key => !String(value[key] ?? "").trim())) return null;
  if (!["success", "failure"].includes(value.saveOutcome)) return null;
  const finiteNumbers = [
    "oldHitPoints",
    "oldTemporaryHitPoints",
    "newTemporaryHitPoints",
    "temporaryHitPointDamage",
    "originalHitPointDamage",
    "clampedHitPointDamage",
    "proposedNewHitPoints",
    "minimumHitPoints",
    "durationSeconds",
    "createdAt",
    "worldTime",
  ];
  if (finiteNumbers.some(key => !Number.isFinite(Number(value[key])))) return null;
  if (
    !Number.isInteger(Number(value.scriptVersion))
    || Number(value.scriptVersion) < 1
    || Number(value.oldHitPoints) < 0
    || Number(value.oldTemporaryHitPoints) < 0
    || Number(value.newTemporaryHitPoints) < 0
    || Number(value.temporaryHitPointDamage) < 0
    || Number(value.originalHitPointDamage) < 0
    || Number(value.clampedHitPointDamage) < 0
    || Number(value.proposedNewHitPoints) < 0
    || Number(value.minimumHitPoints) < 0
    || Number(value.durationSeconds) <= 0
    || Number(value.createdAt) <= 0
    || Number(value.worldTime) < 0
    || Number(value.proposedNewHitPoints)
      !== Number(value.oldHitPoints) - Number(value.clampedHitPointDamage)
  ) return null;
  return value;
}

function perSpellDamageEnvelopeFromDamageItem(damageItem) {
  return perSpellDamageEnvelope(
    damageItem?.flags?.[MODULE_ID]?.perSpellDamageTransaction
      ?? damageItem?.calcDamageOptions?.[MODULE_ID]?.perSpellDamageTransaction,
  );
}

function writePerSpellDamageEnvelopeToMidiCarriers(damageItem, envelope) {
  if (!damageItem || typeof damageItem !== "object") {
    throw new Error("Typed damage prepare is missing Midi's damage item carrier");
  }
  if (
    !damageItem.calcDamageOptions
    || typeof damageItem.calcDamageOptions !== "object"
    || Array.isArray(damageItem.calcDamageOptions)
  ) {
    throw new Error("Typed damage prepare is missing Midi's apply-options carrier");
  }
  const clonedEnvelope = foundry.utils.deepClone(envelope);
  damageItem.flags ??= {};
  damageItem.flags[MODULE_ID] = {
    ...(damageItem.flags[MODULE_ID] ?? {}),
    perSpellDamageTransaction: foundry.utils.deepClone(clonedEnvelope),
  };
  damageItem.calcDamageOptions[MODULE_ID] = {
    ...(damageItem.calcDamageOptions[MODULE_ID] ?? {}),
    perSpellDamageTransaction: clonedEnvelope,
  };
  return true;
}

function perSpellDamageTargetTokenUuid(target) {
  return String(
    target?.document?.uuid
      ?? target?.uuid
      ?? "",
  ).trim();
}

function neutralizePerSpellDamageItem(damageItem) {
  if (!damageItem || typeof damageItem !== "object") return false;
  const oldHitPoints = Number(damageItem.oldHP);
  const oldTemporaryHitPoints = Number(damageItem.oldTempHP);
  if (Number.isFinite(oldHitPoints)) {
    damageItem.hpDamage = 0;
    damageItem.newHP = oldHitPoints;
  }
  if (Number.isFinite(oldTemporaryHitPoints)) {
    damageItem.tempDamage = 0;
    damageItem.newTempHP = oldTemporaryHitPoints;
  }
  damageItem.appliedDamage = 0;
  return true;
}

function rememberPerSpellDamageWorkflow(envelope, workflow, item, target) {
  workflow.__arcanePerSpellDamageTransactionIds ??= new Set();
  workflow.__arcanePerSpellDamageTransactionIds.add(envelope.transactionId);
  PER_SPELL_DAMAGE_WORKFLOWS.set(envelope.transactionId, {
    workflow,
    item,
    target,
    targetActor: target?.actor ?? null,
  });
  setTimeout(() => {
    const current = PER_SPELL_DAMAGE_WORKFLOWS.get(envelope.transactionId);
    if (current?.workflow === workflow) {
      PER_SPELL_DAMAGE_WORKFLOWS.delete(envelope.transactionId);
    }
  }, 2 * 60 * 1000);
}

function preparePerSpellDamageTransactionCore(item, binding, target, context, configuration) {
  const config = typedDamageConfiguration(configuration);
  const workflow = context?.workflow;
  const damageItem = context?.damageItem ?? context?.ditem;
  const targetActor = target?.actor;
  const targetTokenUuid = perSpellDamageTargetTokenUuid(target);
  const sourceActor = item?.actor ?? item?.parent;
  const sourceToken = nativeSummonTokenDocument(workflow?.token)
    ?? findSourceToken(sourceActor);
  const activity = workflow?.activity;
  const semanticActionId = workflowSemanticActionId(workflow);
  const workflowUuid = perSpellScriptWorkflowUuid(workflow);
  if (
    !workflow
    || !damageItem
    || !targetActor?.uuid
    || !targetTokenUuid
    || !sourceActor?.uuid
    || !sourceToken?.uuid
    || !item?.uuid
    || !activity
    || !semanticActionId
    || semanticActionId !== binding.rule.sourceActionId
    || String(damageItem.actorUuid ?? targetActor.uuid) !== targetActor.uuid
  ) {
    throw new Error("Typed damage prepare could not bind its workflow graph");
  }
  const existing = perSpellDamageEnvelopeFromDamageItem(damageItem);
  if (existing) {
    if (
      existing.sourceItemUuid !== item.uuid
      || existing.targetActorUuid !== targetActor.uuid
      || existing.targetTokenUuid !== targetTokenUuid
      || existing.runtimeRuleId !== binding.rule.id
      || existing.handlerId !== binding.handler.id
      || existing.executionPlanHash !== binding.executionPlanHash
    ) {
      throw new Error("Typed damage prepare found a conflicting transaction envelope");
    }
    damageItem.hpDamage = Number(existing.clampedHitPointDamage);
    damageItem.newHP = Number(existing.proposedNewHitPoints);
    damageItem.appliedDamage = Number(existing.temporaryHitPointDamage)
      + Number(existing.clampedHitPointDamage);
    writePerSpellDamageEnvelopeToMidiCarriers(damageItem, existing);
    rememberPerSpellDamageWorkflow(existing, workflow, item, target);
    return { status: "prepared", envelope: foundry.utils.deepClone(existing) };
  }
  const oldHitPoints = Number(damageItem.oldHP);
  const oldTemporaryHitPoints = Number(damageItem.oldTempHP ?? 0);
  const newTemporaryHitPoints = Number(damageItem.newTempHP ?? oldTemporaryHitPoints);
  const temporaryHitPointDamage = Number(
    damageItem.tempDamage ?? oldTemporaryHitPoints - newTemporaryHitPoints,
  );
  const originalHitPointDamage = Number(
    damageItem.hpDamage ?? oldHitPoints - Number(damageItem.newHP),
  );
  if (
    !Number.isFinite(oldHitPoints)
    || !Number.isFinite(oldTemporaryHitPoints)
    || !Number.isFinite(newTemporaryHitPoints)
    || !Number.isFinite(temporaryHitPointDamage)
    || !Number.isFinite(originalHitPointDamage)
    || oldHitPoints < 0
    || oldTemporaryHitPoints < 0
    || newTemporaryHitPoints < 0
    || temporaryHitPointDamage < 0
    || originalHitPointDamage < 0
  ) {
    throw new Error("Typed damage prepare received invalid post-mitigation damage");
  }
  const saveOutcome = perSpellScriptSaveOutcome(workflow, target);
  if (!(binding.handler.outcomes ?? []).includes(saveOutcome)) {
    throw new Error("Typed damage prepare could not resolve one save outcome");
  }
  const floor = oldHitPoints > 0
    ? Math.min(oldHitPoints, Number(config.minimumHitPoints))
    : 0;
  const clampedHitPointDamage = Math.min(
    originalHitPointDamage,
    Math.max(0, oldHitPoints - floor),
  );
  const proposedNewHitPoints = oldHitPoints - clampedHitPointDamage;
  const envelope = {
    schema: "arcane.per-spell-damage-transaction.v2",
    version: PER_SPELL_DAMAGE_TRANSACTION_VERSION,
    status: "prepared",
    transactionId: foundry.utils.randomID(24),
    scriptId: binding.plan.id,
    scriptVersion: Number(binding.plan.version),
    handlerId: binding.handler.id,
    executionPlanHash: binding.executionPlanHash,
    workflowUuid,
    sourceActorUuid: sourceActor.uuid,
    sourceTokenUuid: sourceToken.uuid,
    sourceItemUuid: item.uuid,
    activityUuid: String(activity.uuid ?? nativeSummonActivityUuid(activity)),
    semanticActionId,
    runtimeRuleId: binding.rule.id,
    damageOperationId: binding.damageOperation.id,
    targetActorUuid: targetActor.uuid,
    targetTokenUuid,
    saveOutcome,
    oldHitPoints,
    oldTemporaryHitPoints,
    newTemporaryHitPoints,
    temporaryHitPointDamage,
    originalHitPointDamage,
    clampedHitPointDamage,
    proposedNewHitPoints,
    minimumHitPoints: Number(config.minimumHitPoints),
    durationSeconds: Number(config.durationSeconds),
    artifactId: binding.handler.artifactId,
    effectId: foundry.utils.randomID(),
    createdAt: Date.now(),
    worldTime: Number(game.time?.worldTime ?? 0),
  };
  if (!perSpellDamageEnvelope(envelope)) {
    throw new Error("Typed damage prepare produced an invalid transaction envelope");
  }
  writePerSpellDamageEnvelopeToMidiCarriers(damageItem, envelope);
  damageItem.hpDamage = clampedHitPointDamage;
  damageItem.newHP = proposedNewHitPoints;
  damageItem.appliedDamage = temporaryHitPointDamage + clampedHitPointDamage;
  rememberPerSpellDamageWorkflow(envelope, workflow, item, target);
  return { status: "prepared", envelope: foundry.utils.deepClone(envelope) };
}

async function prepareBoundedDamageTransaction(target, context) {
  const item = context?.item ?? context?.workflow?.item;
  const binding = typedDamageDispatcherBinding(item);
  if (!binding) return true;
  try {
    const result = await invokeTypedDamageScript({
      phase: "prepare",
      item,
      binding,
      workflow: context?.workflow,
      target,
      actor: target?.actor,
      damageContext: context,
    });
    if (result?.status !== "prepared" || !perSpellDamageEnvelope(result.envelope)) {
      throw new Error("Typed damage prepare script returned an invalid result");
    }
    return true;
  } catch (error) {
    neutralizePerSpellDamageItem(context?.damageItem ?? context?.ditem);
    recordCompilerRuntimeError(
      context?.workflow ?? context,
      error,
      "typed-damage-prepare",
    );
    throw error;
  }
}

function perSpellDamageActorState(actor, flag) {
  const value = actor?.flags?.[MODULE_ID]?.[flag];
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

const PER_SPELL_DAMAGE_RECEIPT_KEYS = Object.freeze([
  "activityUuid",
  "artifactId",
  "committedAt",
  "completedAt",
  "createdAt",
  "damageOperationId",
  "durationSeconds",
  "effectApplied",
  "effectId",
  "effectUuid",
  "executionPlanHash",
  "handlerId",
  "minimumHitPoints",
  "newHitPoints",
  "newTemporaryHitPoints",
  "oldHitPoints",
  "oldTemporaryHitPoints",
  "ordinaryHitPointLoss",
  "runtimeRuleId",
  "saveOutcome",
  "schema",
  "scriptId",
  "scriptVersion",
  "semanticActionId",
  "sourceActorUuid",
  "sourceItemUuid",
  "sourceTokenUuid",
  "status",
  "targetActorUuid",
  "targetTokenUuid",
  "temporaryHitPointDamage",
  "transactionId",
  "version",
  "workflowUuid",
  "worldTime",
].sort());

function perSpellDamageReceipt(value, actor = null) {
  if (
    !value
    || typeof value !== "object"
    || Array.isArray(value)
    || JSON.stringify(Object.keys(value).sort())
      !== JSON.stringify(PER_SPELL_DAMAGE_RECEIPT_KEYS)
    || value.schema !== "arcane.per-spell-damage-receipt.v2"
    || Number(value.version) !== PER_SPELL_DAMAGE_TRANSACTION_VERSION
    || !["pending", "completed"].includes(value.status)
  ) return null;
  const requiredStrings = [
    "transactionId",
    "scriptId",
    "handlerId",
    "executionPlanHash",
    "workflowUuid",
    "sourceActorUuid",
    "sourceTokenUuid",
    "sourceItemUuid",
    "activityUuid",
    "semanticActionId",
    "runtimeRuleId",
    "damageOperationId",
    "targetActorUuid",
    "targetTokenUuid",
    "saveOutcome",
    "artifactId",
    "effectId",
    "effectUuid",
  ];
  if (requiredStrings.some(key => !String(value[key] ?? "").trim())) return null;
  if (actor?.uuid && value.targetActorUuid !== actor.uuid) return null;
  if (typeof value.effectApplied !== "boolean") return null;
  const numbers = [
    "oldHitPoints",
    "newHitPoints",
    "oldTemporaryHitPoints",
    "newTemporaryHitPoints",
    "temporaryHitPointDamage",
    "ordinaryHitPointLoss",
    "minimumHitPoints",
    "durationSeconds",
    "createdAt",
    "worldTime",
    "committedAt",
  ];
  if (numbers.some(key => !Number.isFinite(Number(value[key])))) return null;
  if (
    Number(value.ordinaryHitPointLoss)
      !== Number(value.oldHitPoints) - Number(value.newHitPoints)
    || Number(value.ordinaryHitPointLoss) < 0
    || Number(value.newHitPoints) < 0
    || Number(value.oldTemporaryHitPoints) < 0
    || Number(value.newTemporaryHitPoints) < 0
    || Number(value.temporaryHitPointDamage) < 0
    || Number(value.durationSeconds) <= 0
    || Number(value.committedAt) <= 0
    || (value.status === "pending" && value.completedAt !== null)
    || (
      value.status === "completed"
      && (!Number.isFinite(Number(value.completedAt)) || Number(value.completedAt) <= 0)
    )
  ) return null;
  return value;
}

function samePerSpellDamageReceipt(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function writePerSpellDamagePendingUpdate(updates, receipt) {
  const rootPath = "flags." + MODULE_ID + "." + PER_SPELL_DAMAGE_PENDING_FLAG;
  const root = updates[rootPath];
  if (root && typeof root === "object" && !Array.isArray(root)) {
    root[receipt.transactionId] = foundry.utils.deepClone(receipt);
  } else {
    updates[rootPath + "." + receipt.transactionId]
      = foundry.utils.deepClone(receipt);
  }
}

function perSpellDamageItemFromEnvelope(envelope) {
  if (typeof globalThis.fromUuidSync !== "function") return null;
  try {
    return globalThis.fromUuidSync(envelope.sourceItemUuid);
  } catch (_error) {
    return null;
  }
}

function commitPerSpellDamageTransactionCore(
  item,
  binding,
  actor,
  amount,
  updates,
  options,
  envelope,
  configuration,
) {
  const config = typedDamageConfiguration(configuration);
  const hitPointPath = "system.attributes.hp.value";
  const temporaryHitPointPath = "system.attributes.hp.temp";
  const incomingHitPoints = Number(updates?.[hitPointPath]);
  const incomingTemporaryHitPoints = Number(updates?.[temporaryHitPointPath]);
  const hasTemporaryHitPointUpdate = Object.prototype.hasOwnProperty.call(
    updates ?? {},
    temporaryHitPointPath,
  );
  const requiresTemporaryHitPointUpdate =
    Number(envelope?.temporaryHitPointDamage) > 0
    || Number(envelope?.oldTemporaryHitPoints)
      !== Number(envelope?.newTemporaryHitPoints);
  const ordinaryProjectedHitPoints = Number(envelope?.oldHitPoints)
    - Number(envelope?.originalHitPointDamage);
  const acceptedIncomingHitPoints = new Set([
    Number(envelope?.proposedNewHitPoints),
    ordinaryProjectedHitPoints,
  ]);
  if (
    !perSpellDamageEnvelope(envelope)
    || item?.uuid !== envelope.sourceItemUuid
    || binding.plan.id !== envelope.scriptId
    || Number(binding.plan.version) !== Number(envelope.scriptVersion)
    || binding.handler.id !== envelope.handlerId
    || binding.rule.id !== envelope.runtimeRuleId
    || binding.damageOperation.id !== envelope.damageOperationId
    || binding.executionPlanHash !== envelope.executionPlanHash
    || binding.handler.artifactId !== envelope.artifactId
    || actor?.uuid !== envelope.targetActorUuid
    || Number(config.minimumHitPoints) !== Number(envelope.minimumHitPoints)
    || Number(config.durationSeconds) !== Number(envelope.durationSeconds)
    || !updates
    || typeof updates !== "object"
    || !Object.prototype.hasOwnProperty.call(updates, hitPointPath)
    || !acceptedIncomingHitPoints.has(incomingHitPoints)
    || (requiresTemporaryHitPointUpdate && !hasTemporaryHitPointUpdate)
    || (
      hasTemporaryHitPointUpdate
      && incomingTemporaryHitPoints !== Number(envelope.newTemporaryHitPoints)
    )
    || !Number.isFinite(Number(amount))
    || Number(amount) < 0
    || Number(amount) < Number(envelope.temporaryHitPointDamage)
      + Number(envelope.originalHitPointDamage)
  ) {
    throw new Error("Typed damage pre-apply contract no longer matches its envelope");
  }
  const pendingState = perSpellDamageActorState(
    actor,
    PER_SPELL_DAMAGE_PENDING_FLAG,
  );
  const completedState = perSpellDamageActorState(
    actor,
    PER_SPELL_DAMAGE_COMPLETED_FLAG,
  );
  const completed = perSpellDamageReceipt(
    completedState[envelope.transactionId],
    actor,
  );
  if (completed) return { allowUpdate: false, receipt: completed };
  const pending = perSpellDamageReceipt(
    pendingState[envelope.transactionId],
    actor,
  );
  if (pending) {
    if (
      Number(actor.system?.attributes?.hp?.value) !== Number(pending.oldHitPoints)
      || Number(actor.system?.attributes?.hp?.temp ?? 0)
        !== Number(pending.oldTemporaryHitPoints)
    ) return { allowUpdate: false, receipt: pending };
    writePerSpellDamagePendingUpdate(updates, pending);
    updates[hitPointPath] = Number(envelope.proposedNewHitPoints);
    if (hasTemporaryHitPointUpdate) {
      updates[temporaryHitPointPath] = Number(envelope.newTemporaryHitPoints);
    }
    return { allowUpdate: true, receipt: pending };
  }
  const currentHitPoints = Number(actor.system?.attributes?.hp?.value);
  const currentTemporaryHitPoints = Number(actor.system?.attributes?.hp?.temp ?? 0);
  if (
    currentHitPoints !== Number(envelope.oldHitPoints)
    || currentTemporaryHitPoints !== Number(envelope.oldTemporaryHitPoints)
  ) {
    throw new Error("Typed damage target changed before atomic HP commit");
  }
  const receipt = {
    schema: "arcane.per-spell-damage-receipt.v2",
    version: PER_SPELL_DAMAGE_TRANSACTION_VERSION,
    status: "pending",
    transactionId: envelope.transactionId,
    scriptId: envelope.scriptId,
    scriptVersion: envelope.scriptVersion,
    handlerId: envelope.handlerId,
    executionPlanHash: envelope.executionPlanHash,
    workflowUuid: envelope.workflowUuid,
    sourceActorUuid: envelope.sourceActorUuid,
    sourceTokenUuid: envelope.sourceTokenUuid,
    sourceItemUuid: envelope.sourceItemUuid,
    activityUuid: envelope.activityUuid,
    semanticActionId: envelope.semanticActionId,
    runtimeRuleId: envelope.runtimeRuleId,
    damageOperationId: envelope.damageOperationId,
    targetActorUuid: envelope.targetActorUuid,
    targetTokenUuid: envelope.targetTokenUuid,
    saveOutcome: envelope.saveOutcome,
    oldHitPoints: envelope.oldHitPoints,
    newHitPoints: envelope.proposedNewHitPoints,
    oldTemporaryHitPoints: envelope.oldTemporaryHitPoints,
    newTemporaryHitPoints: envelope.newTemporaryHitPoints,
    temporaryHitPointDamage: envelope.temporaryHitPointDamage,
    ordinaryHitPointLoss:
      Number(envelope.oldHitPoints) - Number(envelope.proposedNewHitPoints),
    minimumHitPoints: envelope.minimumHitPoints,
    durationSeconds: envelope.durationSeconds,
    artifactId: envelope.artifactId,
    effectId: envelope.effectId,
    effectUuid: actor.uuid + ".ActiveEffect." + envelope.effectId,
    effectApplied: false,
    createdAt: envelope.createdAt,
    worldTime: envelope.worldTime,
    committedAt: Date.now(),
    completedAt: null,
  };
  if (!perSpellDamageReceipt(receipt, actor)) {
    throw new Error("Typed damage pre-apply produced an invalid pending receipt");
  }
  writePerSpellDamagePendingUpdate(updates, receipt);
  updates[hitPointPath] = Number(envelope.proposedNewHitPoints);
  if (hasTemporaryHitPointUpdate) {
    updates[temporaryHitPointPath] = Number(envelope.newTemporaryHitPoints);
  }
  return { allowUpdate: true, receipt };
}

function applyBoundedDamageTransactionPreDamage(actor, amount, updates, options = {}) {
  const rawEnvelope = options?.[MODULE_ID]?.perSpellDamageTransaction
    ?? options?.damageItem?.flags?.[MODULE_ID]?.perSpellDamageTransaction;
  if (rawEnvelope === undefined || rawEnvelope === null) return true;
  const envelope = perSpellDamageEnvelope(rawEnvelope);
  try {
    if (!envelope) {
      throw new Error("Typed damage pre-apply received a malformed envelope");
    }
    const item = perSpellDamageItemFromEnvelope(envelope);
    const binding = typedDamageDispatcherBinding(item, {
      handlerId: envelope.handlerId,
      runtimeRuleId: envelope.runtimeRuleId,
    });
    if (!item || !binding) {
      throw new Error("Typed damage pre-apply could not resolve its live source plan");
    }
    const result = invokeTypedDamageScript({
      phase: "pre-apply",
      item,
      binding,
      actor,
      amount,
      updates,
      options,
      envelope,
    });
    if (!result || typeof result.allowUpdate !== "boolean") {
      throw new Error("Typed damage pre-apply script returned an invalid result");
    }
    return result.allowUpdate;
  } catch (error) {
    const workflowRecord = envelope
      ? PER_SPELL_DAMAGE_WORKFLOWS.get(envelope.transactionId)
      : null;
    if (workflowRecord?.workflow) {
      recordCompilerRuntimeError(
        workflowRecord.workflow,
        error,
        "typed-damage-pre-apply",
      );
    }
    console.warn("[" + MODULE_ID + "] Typed damage pre-apply failed", error);
    return false;
  }
}

function perSpellDamageCapacityEffectContract(
  receipt,
  item,
  configuration,
) {
  const config = typedDamageConfiguration(configuration);
  return {
    schema: "arcane.per-spell-damage-capacity-effect.v2",
    version: PER_SPELL_DAMAGE_TRANSACTION_VERSION,
    transactionId: receipt.transactionId,
    scriptId: receipt.scriptId,
    scriptVersion: receipt.scriptVersion,
    handlerId: receipt.handlerId,
    executionPlanHash: receipt.executionPlanHash,
    sourceActorUuid: receipt.sourceActorUuid,
    sourceTokenUuid: receipt.sourceTokenUuid,
    sourceItemUuid: item.uuid,
    targetActorUuid: receipt.targetActorUuid,
    targetTokenUuid: receipt.targetTokenUuid,
    artifactId: receipt.artifactId,
    ordinaryHitPointLoss: Number(receipt.ordinaryHitPointLoss),
    durationSeconds: Number(config.durationSeconds),
  };
}

const PER_SPELL_DAMAGE_CAPACITY_EFFECT_KEYS = Object.freeze([
  "artifactId",
  "durationSeconds",
  "executionPlanHash",
  "handlerId",
  "ordinaryHitPointLoss",
  "schema",
  "scriptId",
  "scriptVersion",
  "sourceActorUuid",
  "sourceItemUuid",
  "sourceTokenUuid",
  "targetActorUuid",
  "targetTokenUuid",
  "transactionId",
  "version",
].sort());

function validatePerSpellDamageCapacityEffect(
  effect,
  actor,
  receipt,
  item,
  configuration,
) {
  const expected = perSpellDamageCapacityEffectContract(
    receipt,
    item,
    configuration,
  );
  const actual = arcaneEffectFlag(
    effect,
    "perSpellDamageCapacityReduction",
  );
  const changes = Array.from(effect?.changes ?? []);
  if (
    !effect
    || effect.id !== receipt.effectId
    || effect.parent?.uuid !== actor.uuid
    || String(effect.origin ?? "") !== item.uuid
    || !actual
    || typeof actual !== "object"
    || Array.isArray(actual)
    || JSON.stringify(Object.keys(actual).sort())
      !== JSON.stringify(PER_SPELL_DAMAGE_CAPACITY_EFFECT_KEYS)
    || !samePerSpellDamageReceipt(actual, expected)
    || compilerArtifactIds(effect).length !== 1
    || compilerArtifactIds(effect)[0] !== receipt.artifactId
    || changes.length !== 1
    || changes[0].key !== "system.attributes.hp.tempmax"
    || Number(changes[0].mode) !== 2
    || Number(changes[0].value) !== -Number(receipt.ordinaryHitPointLoss)
    || Number(changes[0].priority) !== 20
    || Number(effect.duration?.seconds) !== Number(configuration.durationSeconds)
    || effect.flags?.dae?.stackable !== "multi"
  ) {
    throw new Error("Typed damage capacity effect does not match its receipt");
  }
  return effect;
}

async function materializePerSpellDamageCapacityEffect(
  actor,
  receipt,
  item,
  binding,
  configuration,
) {
  const existing = actor.effects?.get?.(receipt.effectId) ?? null;
  if (existing) {
    return validatePerSpellDamageCapacityEffect(
      existing,
      actor,
      receipt,
      item,
      configuration,
    );
  }
  const sourceActor = item?.actor ?? item?.parent;
  const data = effectDataFromItem(
    item,
    effect => compilerArtifactIds(effect).includes(binding.handler.artifactId),
    sourceActor,
  );
  if (!data) {
    throw new Error("Typed damage capacity artifact template is missing");
  }
  data._id = receipt.effectId;
  data.origin = item.uuid;
  data.transfer = false;
  data.disabled = false;
  data.changes = [{
    key: "system.attributes.hp.tempmax",
    mode: 2,
    value: String(-Number(receipt.ordinaryHitPointLoss)),
    priority: 20,
  }];
  data.duration = {
    ...(data.duration ?? {}),
    seconds: Number(configuration.durationSeconds),
    startTime: Number(game.time?.worldTime ?? 0),
  };
  data.flags ??= {};
  data.flags[MODULE_ID] = {
    ...(data.flags[MODULE_ID] ?? {}),
    sourceActorUuid: receipt.sourceActorUuid,
    sourceTokenUuid: receipt.sourceTokenUuid,
    sourceItemUuid: receipt.sourceItemUuid,
    targetUuid: receipt.targetActorUuid,
    perSpellDamageCapacityReduction:
      perSpellDamageCapacityEffectContract(receipt, item, configuration),
  };
  data.flags.dae = {
    ...(data.flags.dae ?? {}),
    stackable: "multi",
    showIcon: true,
    specialDuration: [],
  };
  const created = await actor.createEmbeddedDocuments(
    "ActiveEffect",
    [data],
    { keepId: true },
  );
  const effect = created?.[0] ?? actor.effects?.get?.(receipt.effectId) ?? null;
  return validatePerSpellDamageCapacityEffect(
    effect,
    actor,
    receipt,
    item,
    configuration,
  );
}

function completedPerSpellDamageReceipt(actor, transactionId) {
  return perSpellDamageReceipt(
    perSpellDamageActorState(
      actor,
      PER_SPELL_DAMAGE_COMPLETED_FLAG,
    )[transactionId],
    actor,
  );
}

async function settlePerSpellDamageTransactionCore(
  item,
  binding,
  actor,
  receiptValue,
  configuration,
  { recovery = false } = {},
) {
  const config = typedDamageConfiguration(configuration);
  const receipt = perSpellDamageReceipt(receiptValue, actor);
  if (
    !receipt
    || receipt.status !== "pending"
    || item?.uuid !== receipt.sourceItemUuid
    || binding.plan.id !== receipt.scriptId
    || Number(binding.plan.version) !== Number(receipt.scriptVersion)
    || binding.handler.id !== receipt.handlerId
    || binding.rule.id !== receipt.runtimeRuleId
    || binding.damageOperation.id !== receipt.damageOperationId
    || binding.executionPlanHash !== receipt.executionPlanHash
    || binding.handler.artifactId !== receipt.artifactId
    || Number(config.minimumHitPoints) !== Number(receipt.minimumHitPoints)
    || Number(config.durationSeconds) !== Number(receipt.durationSeconds)
  ) {
    throw new Error("Typed damage settlement does not match its pending receipt");
  }
  const priorCompleted = completedPerSpellDamageReceipt(
    actor,
    receipt.transactionId,
  );
  if (priorCompleted) return priorCompleted;
  const livePending = perSpellDamageReceipt(
    perSpellDamageActorState(
      actor,
      PER_SPELL_DAMAGE_PENDING_FLAG,
    )[receipt.transactionId],
    actor,
  );
  if (!livePending || !samePerSpellDamageReceipt(livePending, receipt)) {
    throw new Error("Typed damage pending receipt changed before settlement");
  }
  if (
    Number(actor.system?.attributes?.hp?.value) !== Number(receipt.newHitPoints)
    || Number(actor.system?.attributes?.hp?.temp ?? 0)
      !== Number(receipt.newTemporaryHitPoints)
  ) {
    throw new Error("Typed damage HP commit is not visible at settlement");
  }
  const effectRequired = (
    receipt.saveOutcome === config.reductionOutcome
    && Number(receipt.ordinaryHitPointLoss) > 0
  );
  const existingEffect = actor.effects?.get?.(receipt.effectId) ?? null;
  if (!effectRequired && existingEffect) {
    throw new Error("Typed damage found an effect on a non-reduction outcome");
  }
  if (effectRequired) {
    await materializePerSpellDamageCapacityEffect(
      actor,
      receipt,
      item,
      binding,
      config,
    );
  }
  const completed = {
    ...foundry.utils.deepClone(receipt),
    status: "completed",
    effectApplied: effectRequired,
    completedAt: Date.now(),
  };
  if (!perSpellDamageReceipt(completed, actor)) {
    throw new Error("Typed damage produced an invalid completed receipt");
  }
  const nextPending = foundry.utils.deepClone(
    perSpellDamageActorState(actor, PER_SPELL_DAMAGE_PENDING_FLAG),
  );
  delete nextPending[receipt.transactionId];
  const nextCompleted = foundry.utils.deepClone(
    perSpellDamageActorState(actor, PER_SPELL_DAMAGE_COMPLETED_FLAG),
  );
  nextCompleted[receipt.transactionId] = completed;
  await actor.update({
    ["flags." + MODULE_ID + "." + PER_SPELL_DAMAGE_PENDING_FLAG]: nextPending,
    ["flags." + MODULE_ID + "." + PER_SPELL_DAMAGE_COMPLETED_FLAG]: nextCompleted,
  }, {
    [MODULE_ID]: {
      perSpellDamageSettlement: true,
      recovery,
      transactionId: receipt.transactionId,
    },
  });
  const settled = completedPerSpellDamageReceipt(actor, receipt.transactionId);
  if (!settled || !samePerSpellDamageReceipt(settled, completed)) {
    throw new Error("Typed damage completed receipt did not persist");
  }
  Hooks.callAll(MODULE_ID + ".perSpellDamageReceipt", settled);
  return settled;
}

async function perSpellDamageSourceItem(receipt) {
  let item = perSpellDamageItemFromEnvelope(receipt);
  if (!item && typeof globalThis.fromUuid === "function") {
    try {
      item = await globalThis.fromUuid(receipt.sourceItemUuid);
    } catch (_error) {
      item = null;
    }
  }
  return item?.documentName === "Item" ? item : null;
}

async function settleBoundedDamageTransactionsCore(actor, { recovery = false } = {}) {
  const pendingState = foundry.utils.deepClone(
    perSpellDamageActorState(actor, PER_SPELL_DAMAGE_PENDING_FLAG),
  );
  const errors = [];
  for (const transactionId of Object.keys(pendingState).sort()) {
    try {
      const receipt = perSpellDamageReceipt(pendingState[transactionId], actor);
      if (!receipt || receipt.status !== "pending") {
        throw new Error("Typed damage actor contains a malformed pending receipt");
      }
      const item = await perSpellDamageSourceItem(receipt);
      const binding = typedDamageDispatcherBinding(item, {
        handlerId: receipt.handlerId,
        runtimeRuleId: receipt.runtimeRuleId,
      });
      if (!item || !binding) {
        throw new Error("Typed damage settlement could not resolve its source plan");
      }
      const result = await invokeTypedDamageScript({
        phase: recovery ? "recover" : "settle",
        item,
        binding,
        actor,
        receipt,
        recovery,
      });
      if (!perSpellDamageReceipt(result, actor) || result.status !== "completed") {
        throw new Error("Typed damage settlement script returned an invalid receipt");
      }
    } catch (error) {
      errors.push(error);
      console.warn("[" + MODULE_ID + "] Typed damage settlement failed", error);
    }
  }
  if (errors.length > 0) throw errors[0];
  return true;
}

async function settleBoundedDamageTransactions(actor, options = {}) {
  if (!isPrimaryAutomationGM() || !actor?.uuid) return true;
  const actorKey = actor.uuid;
  const previous = PER_SPELL_DAMAGE_ACTOR_QUEUES.get(actorKey)
    ?? Promise.resolve();
  const current = previous.then(
    () => settleBoundedDamageTransactionsCore(actor, options),
    () => settleBoundedDamageTransactionsCore(actor, options),
  );
  PER_SPELL_DAMAGE_ACTOR_QUEUES.set(actorKey, current);
  try {
    return await current;
  } finally {
    if (PER_SPELL_DAMAGE_ACTOR_QUEUES.get(actorKey) === current) {
      PER_SPELL_DAMAGE_ACTOR_QUEUES.delete(actorKey);
    }
  }
}

async function recoverBoundedDamageTransactions() {
  if (!isPrimaryAutomationGM()) return true;
  await Promise.all(
    fatalDamageInterceptionRecoveryActors().map(actor =>
      settleBoundedDamageTransactions(actor, { recovery: true })
    ),
  );
  return true;
}

function appendCompletedPerSpellDamageReceipt(workflow, record, receipt) {
  const existing = Array.from(
    workflow?.__arcanePerSpellScriptReceipts ?? [],
  ).find(current =>
    current?.event === "typed-damage-transaction"
    && current?.details?.transactionId === receipt.transactionId
  );
  if (existing) return existing;
  const binding = typedDamageDispatcherBinding(record.item, {
    handlerId: receipt.handlerId,
    runtimeRuleId: receipt.runtimeRuleId,
  });
  if (!binding) {
    throw new Error("Typed damage finalizer could not resolve its script binding");
  }
  return appendPerSpellScriptReceipt(
    workflow,
    perSpellScriptReceipt({
      plan: binding.plan,
      handler: binding.handler,
      item: record.item,
      workflow,
      target: record.target,
      status: "resolved",
      committed: true,
      retry: false,
      details: {
        transactionId: receipt.transactionId,
        targetActorUuid: receipt.targetActorUuid,
        saveOutcome: receipt.saveOutcome,
        ordinaryHitPointLoss: receipt.ordinaryHitPointLoss,
        effectApplied: receipt.effectApplied,
        effectUuid: receipt.effectApplied ? receipt.effectUuid : null,
      },
    }),
  );
}

async function finalizePerSpellDamageTransactions(workflow) {
  const transactionIds = Array.from(
    workflow?.__arcanePerSpellDamageTransactionIds ?? [],
  );
  for (const transactionId of transactionIds) {
    const record = PER_SPELL_DAMAGE_WORKFLOWS.get(transactionId);
    if (!record?.targetActor) {
      throw new Error("Typed damage workflow lost its target settlement record");
    }
    await settleBoundedDamageTransactions(record.targetActor);
    const receipt = completedPerSpellDamageReceipt(
      record.targetActor,
      transactionId,
    );
    if (!receipt) {
      throw new Error("Typed damage workflow completed without a durable receipt");
    }
    appendCompletedPerSpellDamageReceipt(workflow, record, receipt);
    PER_SPELL_DAMAGE_WORKFLOWS.delete(transactionId);
  }
  return true;
}

function resolveTypedDamageTransactionService(
  item,
  handler,
  context,
  configuration,
) {
  const binding = typedDamageDispatcherBinding(item, {
    handlerId: handler.id,
    runtimeRuleId: handler.runtimeRuleId,
  });
  if (!binding) {
    throw new Error("Typed damage service could not resolve its dispatcher binding");
  }
  if (context.phase === "prepare") {
    return preparePerSpellDamageTransactionCore(
      item,
      binding,
      context.target,
      context.damageContext,
      configuration,
    );
  }
  if (context.phase === "pre-apply") {
    return commitPerSpellDamageTransactionCore(
      item,
      binding,
      context.targetActor,
      context.amount,
      context.updates,
      context.options,
      context.envelope,
      configuration,
    );
  }
  if (["settle", "recover"].includes(context.phase)) {
    return settlePerSpellDamageTransactionCore(
      item,
      binding,
      context.targetActor,
      context.receipt,
      configuration,
      { recovery: context.recovery === true },
    );
  }
  throw new Error("Typed damage service received an unsupported phase");
}

const OUTCOME_RACE_TRANSACTIONS = new Map();

function outcomeRaceRuntimeRules(item, phase = null) {
  return compilerRuntimeRulesForAdapter(item, "outcome-race-v1").filter(rule =>
    phase === null || rule?.adapter?.phase === phase
  );
}

function outcomeRaceContract(rule) {
  const contract = rule?.adapter;
  const profile = contract?.profile;
  if (
    contract?.adapter !== "outcome-race-v1"
    || Number(contract.version) !== 1
    || ![
      "source-bound-natural-expiry",
      "independent-terminal",
    ].includes(profile)
    || !["entry", "repeat"].includes(contract.phase)
    || !contract.pendingArtifactId
    || !contract.failureArtifactId
    || !contract.entryOperationId
    || !contract.entryActionId
    || !contract.repeatSaveRuleId
    || !contract.repeatSaveOperationId
    || !Number.isInteger(contract.successThreshold)
    || contract.successThreshold <= 0
    || !Number.isInteger(contract.failureThreshold)
    || contract.failureThreshold <= 0
  ) {
    throw new Error("outcome-race-v1 runtime contract is malformed");
  }
  if (
    profile === "source-bound-natural-expiry"
    && (
      !contract.naturalExpiryArtifactId
      || contract.beginOn !== "failure"
      || contract.endSourceOn !== "success"
    )
  ) {
    throw new Error("outcome-race-v1 source-bound profile is malformed");
  }
  if (
    profile === "independent-terminal"
    && (
      contract.naturalExpiryArtifactId !== null
      || contract.beginOn !== "hit"
      || contract.endSourceOn !== null
    )
  ) {
    throw new Error("outcome-race-v1 independent profile is malformed");
  }
  return contract;
}

function outcomeRaceNaturalExpiryAt(effect, item) {
  const startTime = Number(effect?.duration?.startTime);
  const effectSeconds = Number(effect?.duration?.seconds);
  if (Number.isFinite(startTime) && Number.isFinite(effectSeconds) && effectSeconds > 0) {
    return startTime + effectSeconds;
  }
  const itemDuration = item?.system?.duration ?? {};
  const value = Number(itemDuration.value);
  const multipliers = {
    second: 1,
    seconds: 1,
    round: Number(CONFIG.time?.roundTime ?? 6),
    rounds: Number(CONFIG.time?.roundTime ?? 6),
    minute: 60,
    minutes: 60,
    hour: 3600,
    hours: 3600,
  };
  const multiplier = multipliers[String(itemDuration.units ?? "").toLowerCase()];
  if (Number.isFinite(value) && value > 0 && Number.isFinite(multiplier)) {
    return Number(game.time?.worldTime ?? 0) + value * multiplier;
  }
  throw new Error("outcome-race-v1 could not resolve the source natural-expiry deadline");
}

function outcomeRaceInitialState(effect, item, contract) {
  return {
    schemaVersion: 1,
    profile: contract.profile,
    pendingArtifactId: contract.pendingArtifactId,
    failureArtifactId: contract.failureArtifactId,
    naturalExpiryArtifactId: contract.naturalExpiryArtifactId,
    successes: 0,
    failures: 0,
    phase: "pending",
    lastTargetTurn: null,
    lastOutcome: null,
    naturalExpiryAt: contract.profile === "source-bound-natural-expiry"
      ? outcomeRaceNaturalExpiryAt(effect, item)
      : null,
  };
}

function outcomeRaceState(effect, item, contract) {
  const current = arcaneEffectFlag(effect, "outcomeRaceState");
  if (current === undefined || current === null) {
    return outcomeRaceInitialState(effect, item, contract);
  }
  const validCount = value => Number.isInteger(value) && value >= 0;
  if (
    current?.schemaVersion !== 1
    || current.profile !== contract.profile
    || current.pendingArtifactId !== contract.pendingArtifactId
    || current.failureArtifactId !== contract.failureArtifactId
    || current.naturalExpiryArtifactId !== contract.naturalExpiryArtifactId
    || !validCount(current.successes)
    || !validCount(current.failures)
    || !["pending", "recovering", "transitioning"].includes(current.phase)
    || (
      contract.profile === "source-bound-natural-expiry"
        ? !Number.isFinite(Number(current.naturalExpiryAt))
        : current.naturalExpiryAt !== null
    )
  ) {
    throw new Error("outcome-race-v1 durable state is malformed");
  }
  return current;
}

function appendOutcomeRaceReceipt(workflow, receipt) {
  if (!workflow || typeof workflow !== "object") return receipt;
  workflow.__arcaneOutcomeRaceReceipts ??= [];
  workflow.__arcaneOutcomeRaceReceipts.push(receipt);
  workflow.flags ??= {};
  workflow.flags[MODULE_ID] = {
    ...(workflow.flags[MODULE_ID] ?? {}),
    outcomeRaceReceipts: [...workflow.__arcaneOutcomeRaceReceipts],
  };
  globalThis.Hooks?.callAll?.(
    MODULE_ID + ".outcomeRaceReceipt",
    receipt,
    workflow,
  );
  return receipt;
}

function outcomeRaceReceipt(rule, workflow, status, details = {}) {
  return {
    schema: "arcane.outcome-race-receipt.v1",
    ruleId: rule.id,
    phase: rule.adapter.phase,
    workflowUuid: perSpellScriptWorkflowUuid(workflow),
    status,
    committed: true,
    retry: false,
    details,
  };
}

async function resolveOutcomeRaceEntry(item, workflow, rule) {
  const contract = outcomeRaceContract(rule);
  if (workflowSemanticActionId(workflow) !== contract.entryActionId) return null;
  const targets = workflowTargetTokens(workflow);
  if (targets.length !== 1) {
    throw new Error("outcome-race-v1 entry requires exactly one target");
  }
  const target = targets[0];
  if (contract.profile === "independent-terminal") {
    const hit = workflowHitTargets(workflow).some(candidate =>
      samePerSpellScriptTarget(candidate, target)
    );
    if (!hit) return null;
    const pending = compilerEffectsForArtifact(
      target.actor,
      contract.pendingArtifactId,
      item,
    );
    if (pending.length !== 1) {
      throw new Error(
        "outcome-race-v1 independent entry did not settle one exact pending effect",
      );
    }
    return appendOutcomeRaceReceipt(
      workflow,
      outcomeRaceReceipt(rule, workflow, "resolved", {
        outcome: "hit",
        pendingEffectUuid: pending[0].uuid,
      }),
    );
  }
  const outcome = perSpellScriptSaveOutcome(workflow, target);
  if (outcome !== contract.endSourceOn) return null;
  const sourceActor = item?.actor ?? item?.parent;
  const sources = activePerSpellScriptConcentrationEffects(sourceActor).filter(effect =>
    compilerEffectOriginatesFromItem(effect, item)
  );
  if (sources.length !== 1 || typeof sourceActor?.endConcentration !== "function") {
    throw new Error("outcome-race-v1 entry could not resolve one exact concentration source");
  }
  await sourceActor.endConcentration(sources[0]);
  return appendOutcomeRaceReceipt(
    workflow,
    outcomeRaceReceipt(rule, workflow, "resolved", {
      outcome,
      sourceEffectUuid: sources[0].uuid,
    }),
  );
}

async function resolveOutcomeRaceRepeat(item, workflow, rule) {
  const contract = outcomeRaceContract(rule);
  const activityIdentifier = String(
    workflow?.activity?.midiProperties?.identifier
    ?? workflow?.activity?.identifier
    ?? "",
  );
  if (
    workflowSemanticActionId(workflow) !== "runtime:" + contract.activityIdentifier
    && activityIdentifier !== contract.activityIdentifier
  ) return null;
  const targets = workflowTargetTokens(workflow);
  if (targets.length !== 1 || !targets[0]?.actor) {
    throw new Error("outcome-race-v1 repeat save requires exactly one target Actor");
  }
  const target = targets[0];
  const pendingEffects = compilerEffectsForArtifact(
    target.actor,
    contract.pendingArtifactId,
    item,
  );
  if (pendingEffects.length !== 1) {
    throw new Error("outcome-race-v1 could not resolve one exact pending effect");
  }
  const pending = pendingEffects[0];
  const outcome = perSpellScriptSaveOutcome(workflow, target);
  const targetTurnKey = perSpellScriptTargetTurnKey(workflow, target);
  if (!outcome || !targetTurnKey) {
    throw new Error("outcome-race-v1 could not resolve save outcome and target turn");
  }
  const transactionKey = [pending.uuid, target.actor.uuid, targetTurnKey].join(":");
  if (OUTCOME_RACE_TRANSACTIONS.has(transactionKey)) {
    await OUTCOME_RACE_TRANSACTIONS.get(transactionKey);
    return appendOutcomeRaceReceipt(
      workflow,
      outcomeRaceReceipt(rule, workflow, "skipped", {
        reason: "duplicate-target-turn",
        sourceEffectUuid: pending.uuid,
        targetTurn: targetTurnKey,
      }),
    );
  }
  const transaction = (async () => {
    const state = outcomeRaceState(pending, item, contract);
    if (state.phase !== "pending") {
      throw new Error("outcome-race-v1 prior terminal transition requires DM review");
    }
    if (state.lastTargetTurn === targetTurnKey) {
      return outcomeRaceReceipt(rule, workflow, "skipped", {
        reason: "durable-duplicate-target-turn",
        sourceEffectUuid: pending.uuid,
        targetTurn: targetTurnKey,
      });
    }
    const next = {
      ...state,
      successes: state.successes + (outcome === "success" ? 1 : 0),
      failures: state.failures + (outcome === "failure" ? 1 : 0),
      lastTargetTurn: targetTurnKey,
      lastOutcome: outcome,
    };
    if (
      next.successes < contract.successThreshold
      && next.failures < contract.failureThreshold
    ) {
      await pending.update({
        ["flags." + MODULE_ID + ".outcomeRaceState"]: next,
      });
      return outcomeRaceReceipt(rule, workflow, "resolved", next);
    }
    if (next.successes >= contract.successThreshold) {
      const recovering = { ...next, phase: "recovering" };
      await pending.update({
        ["flags." + MODULE_ID + ".outcomeRaceState"]: recovering,
      });
      await target.actor.deleteEmbeddedDocuments("ActiveEffect", [pending.id]);
      return outcomeRaceReceipt(rule, workflow, "resolved", {
        ...recovering,
        terminal: "success",
      });
    }
    const transitioning = { ...next, phase: "transitioning" };
    await pending.update({
      ["flags." + MODULE_ID + ".outcomeRaceState"]: transitioning,
    });
    if (contract.profile === "independent-terminal") {
      const existingFailure = compilerEffectsForArtifact(
        target.actor,
        contract.failureArtifactId,
        item,
      );
      if (existingFailure.length > 1) {
        throw new Error(
          "outcome-race-v1 independent transition found duplicate failure artifacts",
        );
      }
      const disease = existingFailure[0]
        ?? await createCompilerArtifactEffect(
          item,
          target.actor,
          contract.failureArtifactId,
        );
      if (!disease) {
        throw new Error(
          "outcome-race-v1 independent transition could not create its failure artifact",
        );
      }
      try {
        await target.actor.deleteEmbeddedDocuments(
          "ActiveEffect",
          [pending.id],
          {
            existing: "effect-stacking",
            arcaneOutcomeRaceTransition: true,
          },
        );
      } catch (error) {
        return outcomeRaceReceipt(rule, workflow, "partial", {
          ...transitioning,
          terminal: "failure",
          failureEffectUuid: disease.uuid,
          message: String(error?.message ?? error),
        });
      }
      return outcomeRaceReceipt(rule, workflow, "resolved", {
        ...transitioning,
        terminal: "failure",
        failureEffectUuid: disease.uuid,
      });
    }
    const sourceEffectUuid = String(
      pending?.flags?.dnd5e?.dependentOn ?? "",
    ).trim();
    const sourceEffect = sourceEffectUuid
      ? await fromUuid(sourceEffectUuid).catch(() => null)
      : null;
    if (!sourceEffect || sourceEffect.documentName !== "ActiveEffect") {
      throw new Error("outcome-race-v1 terminal transition lost its exact source effect");
    }
    const bound = await createCompilerArtifactEffect(
      item,
      target.actor,
      contract.failureArtifactId,
    );
    if (!bound) {
      throw new Error("outcome-race-v1 could not create its failure artifact");
    }
    await bound.update({
      ["flags.dnd5e.dependentOn"]: sourceEffectUuid,
      ["flags." + MODULE_ID + ".outcomeRaceTerminalState"]: {
        schemaVersion: 1,
        pendingArtifactId: contract.pendingArtifactId,
        naturalExpiryArtifactId: contract.naturalExpiryArtifactId,
        sourceEffectUuid,
        sourceItemUuid: item.uuid,
        targetActorUuid: target.actor.uuid,
        naturalExpiryAt: transitioning.naturalExpiryAt,
      },
    });
    const dependents = globalThis.dnd5e?.registry?.dependents
      ?? game.dnd5e?.registry?.dependents;
    if (!dependents?.track) {
      throw new Error("outcome-race-v1 dependent registry is unavailable");
    }
    dependents.track(sourceEffectUuid, bound);
    await target.actor.deleteEmbeddedDocuments(
      "ActiveEffect",
      [pending.id],
      {
        existing: "effect-stacking",
        arcaneOutcomeRaceTransition: true,
      },
    );
    return outcomeRaceReceipt(rule, workflow, "resolved", {
      ...transitioning,
      terminal: "failure",
      boundEffectUuid: bound.uuid,
      sourceEffectUuid,
    });
  })();
  OUTCOME_RACE_TRANSACTIONS.set(transactionKey, transaction);
  try {
    return appendOutcomeRaceReceipt(workflow, await transaction);
  } finally {
    globalThis.setTimeout(() => {
      if (OUTCOME_RACE_TRANSACTIONS.get(transactionKey) === transaction) {
        OUTCOME_RACE_TRANSACTIONS.delete(transactionKey);
      }
    }, 10000);
  }
}

async function dispatchOutcomeRaceActivity(item, workflow) {
  if (!isPrimaryAutomationGM() || !item || !workflow) return [];
  const receipts = [];
  for (const rule of outcomeRaceRuntimeRules(item)) {
    try {
      const receipt = rule.adapter?.phase === "entry"
        ? await resolveOutcomeRaceEntry(item, workflow, rule)
        : await resolveOutcomeRaceRepeat(item, workflow, rule);
      if (receipt) receipts.push(receipt);
    } catch (error) {
      const receipt = appendOutcomeRaceReceipt(
        workflow,
        outcomeRaceReceipt(rule, workflow, "indeterminate", {
          message: String(error?.message ?? error),
        }),
      );
      receipts.push(receipt);
      recordCompilerRuntimeError(workflow, error, "outcome-race:" + rule.id);
    }
  }
  return receipts;
}

async function applyOutcomeRaceNaturalExpiry(effect, options = {}) {
  if (!isPrimaryAutomationGM() || options?.existing === "effect-stacking") {
    return true;
  }
  const contract = arcaneEffectFlag(effect, "outcomeRaceTerminal");
  const state = arcaneEffectFlag(effect, "outcomeRaceTerminalState");
  if (
    Number(contract?.version) !== 1
    || state?.schemaVersion !== 1
    || contract.pendingArtifactId !== state.pendingArtifactId
    || contract.naturalExpiryArtifactId !== state.naturalExpiryArtifactId
  ) return true;
  const now = Number(game.time?.worldTime ?? 0);
  if (!Number.isFinite(now) || now + 0.001 < Number(state.naturalExpiryAt)) {
    return true;
  }
  const actor = effect?.parent;
  if (actor?.documentName !== "Actor") return true;
  const item = await sourceItemForTriggeredEffect(effect, {
    actorOwned: true,
    sourceActorUuid: arcaneEffectFlag(effect, "sourceActorUuid") ?? null,
  });
  if (!item || String(item.uuid ?? "") !== String(state.sourceItemUuid ?? "")) {
    throw new Error("outcome-race-v1 natural expiry lost exact source Item provenance");
  }
  if (
    compilerEffectsForArtifact(
      actor,
      state.naturalExpiryArtifactId,
      item,
    ).length > 0
  ) return true;
  const permanent = await createCompilerArtifactEffect(
    item,
    actor,
    state.naturalExpiryArtifactId,
  );
  if (!permanent) {
    throw new Error("outcome-race-v1 could not materialize natural-expiry artifact");
  }
  if (permanent.flags?.dnd5e?.dependentOn) {
    await permanent.update({ "flags.dnd5e.-=dependentOn": null });
  }
  return true;
}

function combatCursor(combat) {
  if (!combat) return null;
  return {
    combatUuid: combat.uuid ?? combat.id ?? null,
    round: combat.round ?? null,
    turn: combat.turn ?? null,
    combatantId: combat.combatant?.id ?? null,
  };
}

function sameCombatCursor(left, right) {
  return Boolean(
    left
    && right
    && String(left.combatUuid ?? "") === String(right.combatUuid ?? "")
    && left.round === right.round
    && left.turn === right.turn
    && String(left.combatantId ?? "") === String(right.combatantId ?? "")
  );
}

function combatantTokenUuid(combatant) {
  return (
    combatant?.token?.uuid
    ?? combatant?.token?.document?.uuid
    ?? null
  );
}

function sourceCombatantForActorUuid(combat, actorUuid, tokenUuid = null) {
  if (!combat || (!actorUuid && !tokenUuid)) return null;
  if (tokenUuid) {
    const tokenMatches = Array.from(combat.combatants ?? []).filter(combatant =>
      combatantTokenUuid(combatant) === tokenUuid
    );
    return tokenMatches.length === 1 ? tokenMatches[0] : null;
  }
  const current = combat.combatant;
  if (combatantActorUuid(current) === actorUuid) return current;
  const matches = Array.from(combat.combatants ?? []).filter(combatant =>
    combatantActorUuid(combatant) === actorUuid
  );
  return matches.length === 1 ? matches[0] : null;
}

function anchorRuntimeEffectLifecycleData(effectData, combat = game.combat) {
  const contract = arcaneEffectFlag(effectData, "runtimeLifecycle");
  const supportedBoundary = [
    "current-combat-turn",
    "next-source-turn-end",
    "next-effect-target-turn-end",
  ].includes(contract?.boundary);
  if (
    contract?.version !== 1
    || contract?.event !== "turn-end"
    || !supportedBoundary
    || contract?.anchor
  ) return effectData;
  const anchor = combatCursor(combat);
  const sourceActorUuid =
    arcaneEffectFlag(effectData, "sourceActorUuid")
    ?? sourceActorUuidFromOrigin(effectData?.origin)
    ?? null;
  const declaredSourceTokenUuid = arcaneEffectFlag(
    effectData,
    "sourceTokenUuid",
  );
  const sourceCombatant = sourceCombatantForActorUuid(
    combat,
    sourceActorUuid,
    declaredSourceTokenUuid,
  );
  const sourceTokenUuid =
    declaredSourceTokenUuid
    ?? sourceCombatant?.token?.uuid
    ?? sourceCombatant?.token?.document?.uuid
    ?? null;
  const effectTargetActorUuid =
    arcaneEffectFlag(effectData, "targetUuid")
    ?? contract.effectTargetActorUuid
    ?? null;
  const declaredEffectTargetTokenUuid = arcaneEffectFlag(
    effectData,
    "targetTokenUuid",
  );
  const effectTargetCombatant = sourceCombatantForActorUuid(
    combat,
    effectTargetActorUuid,
    declaredEffectTargetTokenUuid,
  );
  const effectTargetTokenUuid =
    declaredEffectTargetTokenUuid
    ?? effectTargetCombatant?.token?.uuid
    ?? effectTargetCombatant?.token?.document?.uuid
    ?? null;
  const boundaryActorUuid = contract.boundary === "next-effect-target-turn-end"
    ? effectTargetActorUuid
    : sourceActorUuid;
  const boundaryCombatant = contract.boundary === "next-effect-target-turn-end"
    ? effectTargetCombatant
    : sourceCombatant;
  const lifecycleAnchor = contract.boundary === "current-combat-turn"
    ? anchor
    : boundaryCombatant
      ? anchor
      : null;
  if (!lifecycleAnchor?.combatUuid && !boundaryActorUuid) return effectData;
  effectData.flags ??= {};
  effectData.flags[MODULE_ID] = {
    ...(effectData.flags[MODULE_ID] ?? {}),
    runtimeLifecycle: {
      ...contract,
      ...(lifecycleAnchor?.combatUuid ? { anchor: lifecycleAnchor } : {}),
      ...(sourceActorUuid ? { sourceActorUuid } : {}),
      ...(sourceCombatant?.id
        ? { sourceCombatantId: sourceCombatant.id }
        : {}),
      ...(sourceTokenUuid ? { sourceTokenUuid } : {}),
      ...(effectTargetActorUuid ? { effectTargetActorUuid } : {}),
      ...(effectTargetCombatant?.id
        ? { effectTargetCombatantId: effectTargetCombatant.id }
        : {}),
      ...(effectTargetTokenUuid ? { effectTargetTokenUuid } : {}),
    },
  };
  if (
    [
      "next-source-turn-end",
      "next-effect-target-turn-end",
    ].includes(contract.boundary)
  ) {
    effectData.duration ??= {};
    effectData.duration.rounds = Math.max(
      2,
      Number(effectData.duration.rounds) || 0,
    );
    effectData.duration.seconds = Math.max(
      Number(CONFIG.time?.roundTime ?? 6) * 2,
      Number(effectData.duration.seconds) || 0,
    );
  }
  return effectData;
}

async function guardNextTurnLifecycleDuration(effect) {
  const contract = arcaneEffectFlag(effect, "runtimeLifecycle");
  if (
    contract?.version !== 1
    || ![
      "next-source-turn-end",
      "next-effect-target-turn-end",
    ].includes(contract?.boundary)
  ) return true;
  const roundTime = Number(CONFIG.time?.roundTime ?? 6) || 6;
  const durationUpdates = {};
  const currentRounds = Number(effect.duration?.rounds);
  const currentSeconds = Number(effect.duration?.seconds);
  if (!Number.isFinite(currentRounds) || currentRounds < 2) {
    durationUpdates["duration.rounds"] = 2;
  }
  if (!Number.isFinite(currentSeconds) || currentSeconds < roundTime * 2) {
    durationUpdates["duration.seconds"] = roundTime * 2;
  }
  if (Object.keys(durationUpdates).length) await effect.update(durationUpdates);

  if (!contract.anchor?.combatUuid) return true;
  if (contract.boundary !== "next-source-turn-end") return true;

  const dependentOn = effect.flags?.dnd5e?.dependentOn;
  const originDocument =
    (dependentOn && await fromUuid(dependentOn))
    || (effect.origin && await fromUuid(effect.origin))
    || null;
  if (
    originDocument?.documentName === "ActiveEffect"
    && hasEffectStatus(originDocument, "concentrating")
  ) {
    const sourceUpdates = {};
    if (
      Number(originDocument.duration?.rounds) > 0
      && Number(originDocument.duration.rounds) < 2
    ) {
      sourceUpdates["duration.rounds"] = 2;
    }
    if (
      Number(originDocument.duration?.seconds) > 0
      && Number(originDocument.duration.seconds) < roundTime * 2
    ) {
      sourceUpdates["duration.seconds"] = roundTime * 2;
    }
    if (Object.keys(sourceUpdates).length) {
      await originDocument.update(sourceUpdates);
    }
  }
  return true;
}

async function anchorRuntimeEffectLifecycle(effect) {
  if (!isPrimaryAutomationGM()) return true;
  if (effect?.parent?.documentName !== "Actor") return true;
  const before = arcaneEffectFlag(effect, "runtimeLifecycle");
  if (
    before?.version !== 1
    || before?.event !== "turn-end"
    || ![
      "current-combat-turn",
      "next-source-turn-end",
      "next-effect-target-turn-end",
    ].includes(before?.boundary)
  ) return true;
  if (before.anchor) {
    await guardNextTurnLifecycleDuration(effect);
    return true;
  }
  const data = anchorRuntimeEffectLifecycleData({
    origin: effect.origin,
    flags: {
      [MODULE_ID]: {
        sourceActorUuid:
          arcaneEffectFlag(effect, "sourceActorUuid")
          ?? sourceActorUuidFromOrigin(effect.origin)
          ?? null,
        targetUuid:
          arcaneEffectFlag(effect, "targetUuid")
          ?? effect.parent?.uuid
          ?? null,
        runtimeLifecycle: cloneSettings(before),
      },
    },
  });
  const after = arcaneEffectFlag(data, "runtimeLifecycle");
  if (after?.anchor) {
    await effect.update({
      ["flags." + MODULE_ID + ".runtimeLifecycle"]: after,
    });
  }
  await guardNextTurnLifecycleDuration(effect);
  return true;
}

function prepareRuntimeEffectLifecycle(effect) {
  if (effect?.parent?.documentName !== "Actor") return true;
  const before = arcaneEffectFlag(effect, "runtimeLifecycle");
  if (
    before?.version !== 1
    || before?.event !== "turn-end"
    || ![
      "current-combat-turn",
      "next-source-turn-end",
      "next-effect-target-turn-end",
    ].includes(
      before?.boundary,
    )
    || before.anchor
  ) return true;
  const data = anchorRuntimeEffectLifecycleData(effect.toObject());
  const after = arcaneEffectFlag(data, "runtimeLifecycle");
  const updates = {
    ...(after?.anchor
      ? { ["flags." + MODULE_ID + ".runtimeLifecycle"]: after }
      : {}),
    ...(data.duration ? { duration: data.duration } : {}),
  };
  if (Object.keys(updates).length) effect.updateSource(updates);
  return true;
}

function compilerSourceTargetIdentityUpdates(effect) {
  if (effect?.parent?.documentName !== "Actor") return {};
  const identity = arcaneEffectFlag(effect, "identity");
  const sourceScoped =
    identity?.scope === "source"
    && Array.isArray(identity.keys)
    && identity.keys.length === 1
    && identity.keys[0] === "sourceUuid";
  const sourceTargetScoped =
    identity?.scope === "source-target"
    && Array.isArray(identity.keys)
    && identity.keys.length === 2
    && identity.keys[0] === "sourceUuid"
    && identity.keys[1] === "targetUuid";
  if (!sourceScoped && !sourceTargetScoped) return {};
  const sourceActorUuid =
    arcaneEffectFlag(effect, "sourceActorUuid")
    ?? arcaneEffectFlag(effect, "sourceUuid")
    ?? sourceActorUuidFromOrigin(effect.origin)
    ?? (sourceScoped ? effect.parent.uuid : null)
    ?? null;
  const targetUuid =
    arcaneEffectFlag(effect, "targetUuid")
    ?? effect.parent.uuid
    ?? null;
  if (!sourceActorUuid || !targetUuid) {
    return {};
  }
  const updates = {};
  if (!arcaneEffectFlag(effect, "sourceUuid")) {
    updates["flags." + MODULE_ID + ".sourceUuid"] = sourceActorUuid;
  }
  if (!arcaneEffectFlag(effect, "sourceActorUuid")) {
    updates["flags." + MODULE_ID + ".sourceActorUuid"] = sourceActorUuid;
  }
  if (!arcaneEffectFlag(effect, "targetUuid")) {
    updates["flags." + MODULE_ID + ".targetUuid"] = targetUuid;
  }
  const sourceItemUuid = compilerSourceItemUuidFromEffect(effect);
  if (sourceItemUuid && !arcaneEffectFlag(effect, "sourceItemUuid")) {
    updates["flags." + MODULE_ID + ".sourceItemUuid"] = sourceItemUuid;
  }
  return updates;
}

function prepareCompilerSourceTargetIdentity(effect) {
  const updates = compilerSourceTargetIdentityUpdates(effect);
  if (Object.keys(updates).length) effect.updateSource(updates);
  return true;
}

async function materializeCompilerSourceTargetIdentity(effect) {
  if (!isPrimaryAutomationGM()) return true;
  const updates = compilerSourceTargetIdentityUpdates(effect);
  if (Object.keys(updates).length) await effect.update(updates);
  return true;
}

function runtimeLifecycleActors(combat) {
  const actors = new Map();
  const add = actor => {
    if (actor?.uuid) actors.set(actor.uuid, actor);
  };
  for (const combatant of Array.from(combat?.combatants ?? [])) {
    add(combatant?.actor);
    add(combatant?.token?.actor);
    add(combatant?.token?.object?.actor);
  }
  for (const token of Array.from(canvas.tokens?.placeables ?? [])) add(token?.actor);
  return Array.from(actors.values());
}

function combatantActorUuid(combatant) {
  return (
    combatant?.actor?.uuid
    ?? combatant?.token?.actor?.uuid
    ?? combatant?.token?.object?.actor?.uuid
    ?? null
  );
}

async function cleanupRuntimeEffectLifecycles(combat, changed = {}, { ended = false } = {}) {
  if (!isPrimaryAutomationGM() || (!ended && !("round" in changed) && !("turn" in changed))) {
    return true;
  }
  const cursor = ended ? null : combatCursor(combat);
  const combatUuid = String(combat?.uuid ?? combat?.id ?? "");
  const currentActorUuid = ended ? null : combatantActorUuid(combat?.combatant);
  const currentTokenUuid = ended ? null : combatantTokenUuid(combat?.combatant);
  const currentCombatantId = ended ? null : combat?.combatant?.id ?? null;
  for (const actor of runtimeLifecycleActors(combat)) {
    const effectIds = [];
    for (const effect of Array.from(actor.effects ?? [])) {
      if (
        effect?.disabled === true
        || effect?.active === false
        || effect?.isSuppressed === true
      ) continue;
      const contract = arcaneEffectFlag(effect, "runtimeLifecycle");
      if (
        contract?.version !== 1
        || contract?.event !== "turn-end"
        || ![
          "current-combat-turn",
          "next-source-turn-end",
          "next-effect-target-turn-end",
        ].includes(
          contract?.boundary,
        )
      ) continue;
      const anchor = contract.anchor;
      if (ended) {
        if (
          anchor?.combatUuid
          && String(anchor.combatUuid) === combatUuid
        ) effectIds.push(effect.id);
        continue;
      }
      const effectTargetBoundary =
        contract.boundary === "next-effect-target-turn-end";
      const subjectActorUuid = effectTargetBoundary
        ? (
            contract.effectTargetActorUuid
            ?? arcaneEffectFlag(effect, "targetUuid")
            ?? effect.parent?.uuid
            ?? null
          )
        : (
            contract.sourceActorUuid
            ?? arcaneEffectFlag(effect, "sourceActorUuid")
            ?? sourceActorUuidFromOrigin(effect.origin)
            ?? null
          );
      const subjectCombatantId = effectTargetBoundary
        ? contract.effectTargetCombatantId
        : contract.sourceCombatantId;
      const subjectTokenUuid = effectTargetBoundary
        ? (
            contract.effectTargetTokenUuid
            ?? arcaneEffectFlag(effect, "targetTokenUuid")
            ?? null
          )
        : (
            contract.sourceTokenUuid
            ?? arcaneEffectFlag(effect, "sourceTokenUuid")
            ?? null
          );
      const storedSubjectCombatant = subjectCombatantId
        ? Array.from(combat?.combatants ?? []).find(
            combatant => combatant?.id === subjectCombatantId,
          ) ?? null
        : null;
      const resolvedSubjectCombatant =
        storedSubjectCombatant
        ?? sourceCombatantForActorUuid(
          combat,
          subjectActorUuid,
          subjectTokenUuid,
        );
      const resolvedSubjectCombatantId =
        resolvedSubjectCombatant?.id
        ?? null;
      const resolvedSubjectTokenUuid =
        subjectTokenUuid
        ?? combatantTokenUuid(resolvedSubjectCombatant)
        ?? null;
      const activeTurn = effectTargetBoundary
        ? contract.activeEffectTargetTurn
        : contract.activeSourceTurn;
      const activeTurnField = effectTargetBoundary
        ? "activeEffectTargetTurn"
        : "activeSourceTurn";
      const subjectIsCurrent = Boolean(
        resolvedSubjectCombatantId
          ? resolvedSubjectCombatantId === currentCombatantId
          : resolvedSubjectTokenUuid
            ? resolvedSubjectTokenUuid === currentTokenUuid
            : subjectActorUuid && subjectActorUuid === currentActorUuid
      );
      if (!anchor?.combatUuid) {
        if (!resolvedSubjectCombatantId) continue;
        await effect.update({
          ["flags." + MODULE_ID + ".runtimeLifecycle"]: {
            ...contract,
            anchor: cursor,
            ...(effectTargetBoundary
              ? { effectTargetActorUuid: subjectActorUuid }
              : { sourceActorUuid: subjectActorUuid }),
            ...(resolvedSubjectCombatantId
              ? effectTargetBoundary
                ? { effectTargetCombatantId: resolvedSubjectCombatantId }
                : { sourceCombatantId: resolvedSubjectCombatantId }
              : {}),
            ...(resolvedSubjectTokenUuid
              ? effectTargetBoundary
                ? { effectTargetTokenUuid: resolvedSubjectTokenUuid }
                : { sourceTokenUuid: resolvedSubjectTokenUuid }
              : {}),
            ...(subjectIsCurrent ? { [activeTurnField]: cursor } : {}),
          },
        });
        continue;
      }
      if (String(anchor.combatUuid) !== combatUuid) {
        continue;
      }
      if (contract.boundary === "current-combat-turn") {
        if (!sameCombatCursor(anchor, cursor)) effectIds.push(effect.id);
        continue;
      }
      if (activeTurn) {
        if (!sameCombatCursor(activeTurn, cursor)) {
          effectIds.push(effect.id);
        }
        continue;
      }
      if (subjectIsCurrent && !sameCombatCursor(anchor, cursor)) {
        await effect.update({
          ["flags." + MODULE_ID + ".runtimeLifecycle"]: {
            ...contract,
            ...(effectTargetBoundary
              ? { effectTargetActorUuid: subjectActorUuid }
              : { sourceActorUuid: subjectActorUuid }),
            ...(resolvedSubjectCombatantId
              ? effectTargetBoundary
                ? { effectTargetCombatantId: resolvedSubjectCombatantId }
                : { sourceCombatantId: resolvedSubjectCombatantId }
              : {}),
            ...(resolvedSubjectTokenUuid
              ? effectTargetBoundary
                ? { effectTargetTokenUuid: resolvedSubjectTokenUuid }
                : { sourceTokenUuid: resolvedSubjectTokenUuid }
              : {}),
            [activeTurnField]: cursor,
          },
        });
      }
    }
    const existingIds = effectIds.filter(effectId => actor.effects?.get?.(effectId));
    if (existingIds.length) {
      await actor.deleteEmbeddedDocuments("ActiveEffect", existingIds);
    }
  }
  return true;
}

function runtimeLifecycleIsActiveSourceTurn(effect, combat = game.combat) {
  const contract = arcaneEffectFlag(effect, "runtimeLifecycle");
  if (
    contract?.version !== 1
    || contract?.event !== "turn-end"
    || contract?.boundary !== "next-source-turn-end"
    || !combat
  ) return false;
  const cursor = combatCursor(combat);
  if (!cursor?.combatUuid) return false;
  if (contract.activeSourceTurn) {
    return sameCombatCursor(contract.activeSourceTurn, cursor);
  }
  if (
    !contract.anchor?.combatUuid
    || String(contract.anchor.combatUuid) !== String(cursor.combatUuid)
    || sameCombatCursor(contract.anchor, cursor)
  ) return false;
  const currentCombatantId = combat.combatant?.id ?? null;
  if (contract.sourceCombatantId) {
    return contract.sourceCombatantId === currentCombatantId;
  }
  const sourceActorUuid =
    contract.sourceActorUuid
    ?? arcaneEffectFlag(effect, "sourceActorUuid")
    ?? sourceActorUuidFromOrigin(effect.origin)
    ?? null;
  return Boolean(sourceActorUuid && sourceActorUuid === combatantActorUuid(combat.combatant));
}

function compilerWeaponAttackActionType(workflow) {
  return String(
    workflow?.activity?.actionType
    ?? workflow?.activity?.attack?.type?.value
    ?? workflow?.item?.system?.actionType
    ?? "",
  ).trim().toLowerCase();
}

function compilerWeaponAttackMagicClassification(workflow) {
  const activity = workflow?.activity ?? null;
  const item = workflow?.item ?? activity?.item ?? null;
  if (!item || typeof item !== "object") return "unknown";
  const documents = [
    item,
    workflow?.ammunition,
    workflow?.ammo,
    activity?.ammunition,
  ].filter(current => current && typeof current === "object");
  const hasProperty = (document, property) => {
    const properties = document?.system?.properties;
    return Boolean(
      properties?.has?.(property)
      || (Array.isArray(properties) && properties.includes(property))
      || Array.from(properties ?? []).includes(property)
    );
  };
  const hasMagicDamageFlag = document => Boolean(
    document?.flags?.midiProperties?.magicdam === true
    || document?.flags?.["midi-qol"]?.magicdam === true
  );
  if (
    documents.some(document =>
      hasProperty(document, "mgc")
      || Number(document?.system?.magicalBonus ?? 0) > 0
      || hasMagicDamageFlag(document)
    )
    || activity?.midiProperties?.magicdam === true
    || workflow?.midiProperties?.magicdam === true
  ) return "magical";
  return "nonmagical";
}

function compilerWeaponResistanceSourceEffects(actor) {
  return activeCompilerRuntimeEffects(
    actor,
    "weapon-attack-damage-resistance",
  );
}

async function prepareCompilerWeaponAttackResistance(workflow) {
  if (
    !workflow
    || COMPILER_WEAPON_RESISTANCE_STATES.has(workflow)
    || !["mwak", "rwak"].includes(compilerWeaponAttackActionType(workflow))
  ) return true;
  const targets = workflowHitTargets(workflow);
  if (!targets.length) return true;
  const weaponMagic = compilerWeaponAttackMagicClassification(workflow);
  const created = [];
  for (const target of targets) {
    const actor = target?.actor;
    if (!actor) continue;
    const sourceEffects = compilerWeaponResistanceSourceEffects(actor);
    if (!sourceEffects.length) continue;
    const damageTypes = new Set();
    const matchingSourceEffects = new Set();
    for (const sourceEffect of sourceEffects) {
      for (const modifier of compilerRuntimeModifiers(
        sourceEffect,
        "weapon-attack-damage-resistance",
      )) {
        const requiredWeaponMagic = modifier.weaponMagic ?? "any";
        if (
          requiredWeaponMagic === "nonmagical"
          && weaponMagic !== "nonmagical"
        ) {
          if (weaponMagic === "unknown") {
            workflow.__arcaneCompilerWeaponMagicUnknown = true;
          }
          continue;
        }
        matchingSourceEffects.add(sourceEffect);
        for (const damageType of modifier.damageTypes ?? []) {
          if (typeof damageType === "string" && damageType.trim()) {
            damageTypes.add(damageType.trim());
          }
        }
      }
    }
    if (!damageTypes.size) continue;
    const matchingSources = Array.from(matchingSourceEffects);
    const [effect] = await actor.createEmbeddedDocuments("ActiveEffect", [{
      name: "Conditional weapon-attack resistance",
      img: matchingSources[0]?.img ?? matchingSources[0]?.icon ?? "icons/svg/shield.svg",
      origin: matchingSources[0]?.uuid ?? null,
      transfer: false,
      disabled: false,
      changes: Array.from(damageTypes).map(damageType => ({
        key: "system.traits.dr.value",
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value: damageType,
        priority: 20,
      })),
      flags: {
        dae: {
          showIcon: false,
          stackable: "multi",
          specialDuration: [],
        },
        [MODULE_ID]: {
          compilerWeaponResistanceTransient: {
            version: 1,
            workflowUuid: workflow.uuid ?? workflow.id ?? null,
            sourceEffectUuids: matchingSources.map(candidate => candidate.uuid),
            weaponMagic,
          },
        },
      },
    }]);
    if (effect) created.push({ actor, effectId: effect.id });
  }
  if (created.length) {
    COMPILER_WEAPON_RESISTANCE_STATES.set(workflow, created);
  }
  return true;
}

async function cleanupCompilerWeaponAttackResistance(workflow) {
  const created = COMPILER_WEAPON_RESISTANCE_STATES.get(workflow) ?? [];
  COMPILER_WEAPON_RESISTANCE_STATES.delete(workflow);
  for (const { actor, effectId } of created) {
    if (actor?.effects?.get?.(effectId)) {
      await actor.deleteEmbeddedDocuments("ActiveEffect", [effectId]);
    }
  }
  return true;
}

async function cleanupCompilerTransientWorkflowState(workflow) {
  releaseCompilerNextTurnAttackAdvantage(workflow);
  await cleanupCompilerWeaponAttackResistance(workflow);
  return true;
}

function recordCompilerRuntimeError(workflow, error, phase) {
  const message = error?.message ?? String(error ?? "compiler-runtime-failed");
  if (workflow && typeof workflow === "object") {
    workflow.__arcaneCompilerRuntimeError = {
      phase: String(phase ?? "runtime"),
      message,
    };
  }
  return message;
}

async function cleanupOrphanedCompilerWeaponResistanceEffects(actor) {
  if (!actor) return true;
  const ids = Array.from(actor.effects ?? [])
    .filter(effect =>
      arcaneEffectFlag(effect, "compilerWeaponResistanceTransient")?.version === 1
    )
    .map(effect => effect.id);
  if (ids.length) await actor.deleteEmbeddedDocuments("ActiveEffect", ids);
  return true;
}

function nextTurnAttackAdvantageMatch(workflow) {
  const sourceActor = workflow?.actor;
  const targets = workflowTargetTokens(workflow);
  if (!sourceActor || targets.length !== 1 || !game.combat) return null;
  const targetActor = targets[0]?.actor;
  if (!targetActor) return null;
  const sourceTokenUuid =
    workflow?.token?.document?.uuid
    ?? workflow?.token?.uuid
    ?? null;
  for (const effect of activeCompilerRuntimeEffects(
    targetActor,
    "next-turn-attack-advantage-against-marked-target",
  )) {
    const effectSourceActorUuid =
      arcaneEffectFlag(effect, "sourceActorUuid")
      ?? sourceActorUuidFromOrigin(effect.origin)
      ?? null;
    if (effectSourceActorUuid !== sourceActor.uuid) continue;
    const lifecycle = arcaneEffectFlag(effect, "runtimeLifecycle");
    if (
      lifecycle?.sourceTokenUuid
      && sourceTokenUuid
      && lifecycle.sourceTokenUuid !== sourceTokenUuid
    ) continue;
    if (!runtimeLifecycleIsActiveSourceTurn(effect, game.combat)) continue;
    return { effect, targetActor };
  }
  return null;
}

function applyCompilerNextTurnAttackAdvantage(workflow) {
  if (!workflow || COMPILER_NEXT_TURN_ATTACK_STATES.has(workflow)) return true;
  const match = nextTurnAttackAdvantageMatch(workflow);
  if (!match) return true;
  const reservationKey = String(match.effect.uuid ?? match.effect.id ?? "");
  if (!reservationKey) return true;
  const owner = COMPILER_NEXT_TURN_ATTACK_RESERVATIONS.get(reservationKey);
  if (owner && owner !== workflow) return true;
  COMPILER_NEXT_TURN_ATTACK_RESERVATIONS.set(reservationKey, workflow);
  COMPILER_NEXT_TURN_ATTACK_STATES.set(workflow, {
    ...match,
    reservationKey,
  });
  const tracker = workflow.attackRollModifierTracker?.advantage;
  if (typeof tracker?.add === "function") {
    tracker.add(
      MODULE_ID + ":next-turn-attack:" + match.effect.id,
      match.effect.name ?? "True Strike",
    );
  } else {
    workflow.advantage = true;
  }
  return true;
}

function releaseCompilerNextTurnAttackAdvantage(workflow) {
  const state = COMPILER_NEXT_TURN_ATTACK_STATES.get(workflow);
  if (
    state?.reservationKey
    && COMPILER_NEXT_TURN_ATTACK_RESERVATIONS.get(state.reservationKey) === workflow
  ) {
    COMPILER_NEXT_TURN_ATTACK_RESERVATIONS.delete(state.reservationKey);
  }
  COMPILER_NEXT_TURN_ATTACK_STATES.delete(workflow);
  return state ?? null;
}

async function consumeCompilerNextTurnAttackAdvantage(workflow) {
  const state = releaseCompilerNextTurnAttackAdvantage(workflow);
  if (!state || !workflow?.attackRoll) return true;
  if (state.targetActor?.effects?.get?.(state.effect.id)) {
    await state.targetActor.deleteEmbeddedDocuments("ActiveEffect", [state.effect.id]);
  }
  return true;
}

function actorHasRuntimeStatus(actor, status) {
  if (actor?.statuses instanceof Set && actor.statuses.has(status)) return true;
  return Array.from(actor?.effects ?? []).some(effect =>
    effect?.disabled !== true
    && effect?.active !== false
    && effect?.isSuppressed !== true
    && hasEffectStatus(effect, status)
  );
}

function compilerSenseRangeInSceneUnits(actor, sense) {
  const senses = actor?.system?.attributes?.senses ?? {};
  const raw = Number(senses.ranges?.[sense] ?? senses[sense] ?? 0);
  if (!Number.isFinite(raw) || raw <= 0) return 0;
  const fromUnits = String(senses.units ?? "ft");
  const toUnits = String(canvas.scene?.grid?.units ?? "ft");
  const convertLength = globalThis.dnd5e?.utils?.convertLength
    ?? game.dnd5e?.utils?.convertLength;
  if (typeof convertLength !== "function" || fromUnits === toUnits) return raw;
  try {
    const converted = Number(
      convertLength(raw, fromUnits, toUnits, { strict: false }),
    );
    return Number.isFinite(converted) ? converted : raw;
  } catch (_error) {
    return raw;
  }
}

function compilerSensesBypassBlur(attackerToken, targetToken) {
  if (!attackerToken || !targetToken) return false;
  const actor = attackerToken.actor;
  const blinded = actorHasRuntimeStatus(actor, "blinded");
  const canSenseModes = globalThis.MidiQOL?.canSenseModes;
  if (typeof canSenseModes === "function") {
    try {
      const modes = canSenseModes(
        attackerToken,
        targetToken,
        ["blindsight", "truesight"],
      );
      if (Array.isArray(modes) && modes.includes("blindsight")) return true;
      if (
        Array.isArray(modes)
        && modes.includes("truesight")
        && !blinded
      ) return true;
    } catch (_error) {
      // Fall back to explicit system sense ranges.
    }
  }
  const computeDistance = globalThis.MidiQOL?.computeDistance;
  let distance = Infinity;
  try {
    distance = typeof computeDistance === "function"
      ? Number(computeDistance(attackerToken, targetToken, {
          wallsBlock: false,
          includeCover: false,
        }))
      : distanceBetweenTokens(attackerToken, targetToken);
  } catch (_error) {
    distance = Infinity;
  }
  if (!Number.isFinite(distance)) return false;
  const blindsight = compilerSenseRangeInSceneUnits(actor, "blindsight");
  if (blindsight > 0 && blindsight >= distance) return true;
  const truesight = compilerSenseRangeInSceneUnits(actor, "truesight");
  return (
    !blinded
    && truesight > 0
    && truesight >= distance
  );
}

function applyCompilerBlurDisadvantage(workflow) {
  const targets = workflowTargetTokens(workflow);
  if (!workflow?.actor || targets.length !== 1) return true;
  const target = targets[0];
  const effects = activeCompilerRuntimeEffects(
    target?.actor,
    "sight-dependent-incoming-attack-disadvantage",
  );
  if (!effects.length || compilerSensesBypassBlur(workflow.token, target)) {
    return true;
  }
  const tracker = workflow.attackRollModifierTracker?.disadvantage;
  for (const effect of effects) {
    if (typeof tracker?.add === "function") {
      tracker.add(
        MODULE_ID + ":sight-dependent-disadvantage:" + effect.id,
        effect.name ?? "Blur",
      );
    } else {
      workflow.disadvantage = true;
      break;
    }
  }
  return true;
}

function compilerPhysicalSizeModifier(effect) {
  return compilerRuntimeModifiers(effect, "transform-physical-size")[0] ?? null;
}

function orderedDnd5eActorSizes() {
  return Object.entries(CONFIG.DND5E.actorSizes ?? {})
    .filter(([, config]) => Number.isFinite(Number(config?.numerical)))
    .sort((left, right) =>
      Number(left[1].numerical) - Number(right[1].numerical)
    );
}

function compilerPhysicalSizeIdentityMatches(left, right) {
  const leftFlags = left?.flags?.[MODULE_ID] ?? {};
  const rightFlags = right?.flags?.[MODULE_ID] ?? {};
  return Boolean(
    leftFlags.identifier
    && leftFlags.identifier === rightFlags.identifier
    && String(leftFlags.sourceActorUuid ?? "")
      === String(rightFlags.sourceActorUuid ?? "")
  );
}

function compilerPhysicalSizeActorTokens(actor) {
  if (!actor?.uuid) return [];
  const tokens = new Map();
  const add = token => {
    if (!token?.uuid || token?.actor?.uuid !== actor.uuid) return;
    tokens.set(token.uuid, token);
  };
  add(actor.token);
  for (const scene of Array.from(game.scenes ?? [])) {
    for (const token of Array.from(scene.tokens ?? [])) add(token);
  }
  return Array.from(tokens.values());
}

function normalizeCompilerPhysicalSizeTokenBaselines(value) {
  const entries = Array.isArray(value) ? value : [];
  const baselines = new Map();
  for (const entry of entries) {
    const tokenUuid = String(entry?.tokenUuid ?? "").trim();
    const width = Number(entry?.width);
    const height = Number(entry?.height);
    if (
      !tokenUuid
      || !Number.isFinite(width)
      || width <= 0
      || !Number.isFinite(height)
      || height <= 0
      || baselines.has(tokenUuid)
    ) continue;
    baselines.set(tokenUuid, { tokenUuid, width, height });
  }
  return Array.from(baselines.values());
}

function mergeCompilerPhysicalSizeTokenBaselines(...sources) {
  const merged = new Map();
  for (const source of sources) {
    for (const entry of normalizeCompilerPhysicalSizeTokenBaselines(source)) {
      if (!merged.has(entry.tokenUuid)) merged.set(entry.tokenUuid, entry);
    }
  }
  return Array.from(merged.values());
}

function compilerPhysicalSizeTokenBaselines(actor) {
  return compilerPhysicalSizeActorTokens(actor).map(token => ({
    tokenUuid: token.uuid,
    width: Number(token.width) || 1,
    height: Number(token.height) || 1,
  }));
}

function prepareCompilerPhysicalSizeEffect(effect) {
  const actor = effect?.parent;
  const modifier = compilerPhysicalSizeModifier(effect);
  if (actor?.documentName !== "Actor" || !modifier) return true;
  const sizes = orderedDnd5eActorSizes();
  if (!sizes.length) return true;
  const replacing = Array.from(actor.effects ?? []).find(candidate =>
    candidate.id !== effect.id
    && compilerPhysicalSizeModifier(candidate)
    && compilerPhysicalSizeIdentityMatches(candidate, effect)
  );
  const replacedTransform = arcaneEffectFlag(
    replacing,
    "physicalSizeTransform",
  );
  const pendingTransform = COMPILER_PHYSICAL_SIZE_SYNC_TASKS.get(actor.uuid)
    ?.restoreTransform;
  const lifecycleState = COMPILER_PHYSICAL_SIZE_BASELINES.get(actor.uuid);
  const tokenBaselines = mergeCompilerPhysicalSizeTokenBaselines(
    lifecycleState?.tokenBaselines,
    replacedTransform?.tokenBaselines,
    pendingTransform?.tokenBaselines,
    compilerPhysicalSizeTokenBaselines(actor),
  );
  const baseSize = String(
    lifecycleState?.baseSize
    ?? replacedTransform?.baseSize
    ?? pendingTransform?.baseSize
    ?? actor.system?.traits?.size
    ?? actor._source?.system?.traits?.size
    ?? "",
  );
  COMPILER_PHYSICAL_SIZE_BASELINES.set(actor.uuid, {
    baseSize,
    tokenBaselines: foundry.utils.deepClone(tokenBaselines),
  });
  let baseIndex = sizes.findIndex(([size]) => size === baseSize);
  if (baseIndex < 0) {
    const sourceSize = String(actor._source?.system?.traits?.size ?? "");
    baseIndex = sizes.findIndex(([size]) => size === sourceSize);
  }
  if (baseIndex < 0) {
    baseIndex = sizes.findIndex(([size]) => size === "med");
  }
  if (baseIndex < 0) baseIndex = 0;
  const steps = Math.trunc(Number(modifier.sizeCategorySteps) || 0);
  const resultIndex = Math.max(
    0,
    Math.min(sizes.length - 1, baseIndex + steps),
  );
  const [resultSize, resultConfig] = sizes[resultIndex];
  const tokenFootprint = Math.max(0.5, Number(resultConfig?.token) || 1);
  const generatedKeys = new Set([
    "system.traits.size",
    "ATL.width",
    "ATL.height",
  ]);
  const changes = Array.from(effect.changes ?? [])
    .filter(change => !generatedKeys.has(change.key))
    .concat([
      {
        key: "system.traits.size",
        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
        value: resultSize,
        priority: 30,
      },
    ]);
  effect.updateSource({
    changes,
    ["flags." + MODULE_ID + ".physicalSizeTransform"]: {
      version: 1,
      baseSize,
      resultSize,
      tokenFootprint,
      dimensionScale: modifier.dimensionScale ?? "1",
      weightScale: modifier.weightScale ?? "1",
      tokenBaselines,
    },
  });
  return true;
}

async function syncCompilerPhysicalSizeTokens(actor, {
  restoreTransform = null,
} = {}) {
  if (!isPrimaryAutomationGM() || !actor) return true;
  actor.prepareData();
  const size = String(actor.system?.traits?.size ?? "");
  const standardFootprint = Math.max(
    0.5,
    Number(CONFIG.DND5E.actorSizes?.[size]?.token) || 1,
  );
  const activeEffects = activeCompilerRuntimeEffects(
    actor,
    "transform-physical-size",
  );
  const activeEffect = activeEffects.at(-1) ?? null;
  const activeTransform = arcaneEffectFlag(
    activeEffect,
    "physicalSizeTransform",
  );
  const hasActiveTransform = Boolean(activeEffect);
  const lifecycleState = COMPILER_PHYSICAL_SIZE_BASELINES.get(actor.uuid);
  const tokenBaselines = mergeCompilerPhysicalSizeTokenBaselines(
    lifecycleState?.tokenBaselines,
    activeTransform?.tokenBaselines,
    restoreTransform?.tokenBaselines,
    hasActiveTransform ? compilerPhysicalSizeTokenBaselines(actor) : [],
  );
  const baseSize = String(
    lifecycleState?.baseSize
    ?? activeTransform?.baseSize
    ?? restoreTransform?.baseSize
    ?? "",
  );
  if (baseSize || tokenBaselines.length) {
    COMPILER_PHYSICAL_SIZE_BASELINES.set(actor.uuid, {
      baseSize,
      tokenBaselines: foundry.utils.deepClone(tokenBaselines),
    });
  }
  if (
    activeEffect
    && activeTransform?.version === 1
    && JSON.stringify(normalizeCompilerPhysicalSizeTokenBaselines(
      activeTransform.tokenBaselines,
    )) !== JSON.stringify(tokenBaselines)
  ) {
    await activeEffect.update({
      ["flags." + MODULE_ID + ".physicalSizeTransform.tokenBaselines"]:
        foundry.utils.deepClone(tokenBaselines),
    });
  }
  const baselineByTokenUuid = new Map(
    tokenBaselines.map(entry => [String(entry.tokenUuid), entry]),
  );
  const tokens = compilerPhysicalSizeActorTokens(actor);
  for (const token of tokens) {
    const oldWidth = Number(token.width) || 1;
    const oldHeight = Number(token.height) || 1;
    const baseline = baselineByTokenUuid.get(String(token.uuid ?? ""));
    if (!hasActiveTransform && !baseline) continue;
    const width = hasActiveTransform
      ? Math.max(
          0.5,
          Number(activeTransform?.tokenFootprint) || standardFootprint,
        )
      : Math.max(0.5, Number(baseline.width));
    const height = hasActiveTransform
      ? Math.max(
          0.5,
          Number(activeTransform?.tokenFootprint) || standardFootprint,
        )
      : Math.max(0.5, Number(baseline.height));
    if (oldWidth === width && oldHeight === height) continue;
    const update = {
      width,
      height,
    };
    const gridSize = Number(
      token.parent?.grid?.size
      ?? token.parent?.dimensions?.size
      ?? canvas.grid?.size
      ?? canvas.dimensions?.size
      ?? 0,
    );
    if (gridSize > 0) {
      update.x = Number(token.x) + ((oldWidth - width) * gridSize / 2);
      update.y = Number(token.y) + ((oldHeight - height) * gridSize / 2);
    }
    await token.update(update, {
      animate: false,
      arcaneCompilerPhysicalSize: true,
    });
  }
  if (!hasActiveTransform) COMPILER_PHYSICAL_SIZE_BASELINES.delete(actor.uuid);
  return true;
}

function scheduleCompilerPhysicalSizeSync(effect) {
  const actor = effect?.parent;
  if (
    actor?.documentName !== "Actor"
    || (
      !compilerPhysicalSizeModifier(effect)
      && arcaneEffectFlag(effect, "physicalSizeTransform")?.version !== 1
    )
  ) return false;
  const key = actor.uuid;
  const previous = COMPILER_PHYSICAL_SIZE_SYNC_TASKS.get(key);
  if (previous?.timeoutId) clearTimeout(previous.timeoutId);
  const deletedTransform = actor.effects?.get?.(effect.id) === effect
    ? null
    : arcaneEffectFlag(effect, "physicalSizeTransform");
  const restoreTransform = deletedTransform?.version === 1
    ? foundry.utils.deepClone(deletedTransform)
    : previous?.restoreTransform ?? null;
  if (restoreTransform?.version === 1) {
    const lifecycleState = COMPILER_PHYSICAL_SIZE_BASELINES.get(key);
    COMPILER_PHYSICAL_SIZE_BASELINES.set(key, {
      baseSize: String(
        lifecycleState?.baseSize
        ?? restoreTransform.baseSize
        ?? "",
      ),
      tokenBaselines: mergeCompilerPhysicalSizeTokenBaselines(
        lifecycleState?.tokenBaselines,
        restoreTransform.tokenBaselines,
      ),
    });
  }
  const timeoutId = setTimeout(() => {
    COMPILER_PHYSICAL_SIZE_SYNC_TASKS.delete(key);
    syncCompilerPhysicalSizeTokens(actor, {
      restoreTransform,
    }).catch(error => {
      console.warn(
        "[" + MODULE_ID + "] Compiler physical-size token sync failed",
        error,
      );
    });
  }, 0);
  COMPILER_PHYSICAL_SIZE_SYNC_TASKS.set(key, {
    timeoutId,
    restoreTransform,
  });
  return true;
}

function scheduleCompilerPhysicalSizeActorSync(actor) {
  const effect = activeCompilerRuntimeEffects(
    actor,
    "transform-physical-size",
  ).at(-1);
  return effect ? scheduleCompilerPhysicalSizeSync(effect) : false;
}

function compilerSaveRollMode(workflow) {
  const activity = workflow?.activity;
  const interaction = activity?.getFlag?.(MODULE_ID, "interaction")
    ?? activity?.flags?.[MODULE_ID]?.interaction
    ?? null;
  return String(interaction?.saveRollMode ?? "");
}

function removeWorkflowTargetFromCollection(collection, target) {
  if (collection instanceof Set) {
    collection.delete(target);
    return;
  }
  if (!Array.isArray(collection)) return;
  const index = collection.indexOf(target);
  if (index >= 0) collection.splice(index, 1);
}

function prepareCompilerConditionalSaveTargets(workflow) {
  if (
    compilerSaveRollMode(workflow) !== "unwilling-creature-only"
    || compilerRuntimeSelections(null, workflow).targetWillingness !== "willing"
  ) return true;
  for (const target of workflowTargetTokens(workflow)) {
    removeWorkflowTargetFromCollection(workflow.hitTargets, target);
    removeWorkflowTargetFromCollection(workflow.hitTargetsEC, target);
  }
  return true;
}

function tokenCanSee(sourceToken, targetToken) {
  if (typeof globalThis.MidiQOL?.canSee === "function") {
    return globalThis.MidiQOL.canSee(sourceToken, targetToken) !== false;
  }
  return targetToken?.document?.hidden !== true;
}

function activeSourceRuntimeEffects(actor, flagName) {
  return Array.from(actor?.effects ?? []).filter(effect => {
    if (
      effect?.disabled === true
      || effect?.active === false
      || effect?.isSuppressed === true
      || effect?.flags?.auraeffects?.fromAura === true
    ) return false;
    const contract = arcaneEffectFlag(effect, flagName);
    return Boolean(
      contract
      && typeof contract === "object"
      && !Array.isArray(contract)
      && Number(contract.version) === 1
    );
  });
}

function sourceAttackProximityRiderContract(effect) {
  const contract = arcaneEffectFlag(effect, "sourceAttackProximityRider");
  return contract
    && typeof contract === "object"
    && !Array.isArray(contract)
    && Number(contract.version) === 1
    ? contract
    : null;
}

function sourceTurnStartProximityEffectContract(effect) {
  const contract = arcaneEffectFlag(effect, "sourceTurnStartProximityEffect");
  return contract
    && typeof contract === "object"
    && !Array.isArray(contract)
    && Number(contract.version) === 1
    ? contract
    : null;
}

function runtimeContractRangeDistance(contract) {
  const range = contract?.range;
  const distance = Number(
    range && typeof range === "object"
      ? range.distance
      : range
  );
  const units = String(
    range && typeof range === "object"
      ? range.units ?? "ft"
      : "ft"
  ).trim().toLowerCase();
  if (!Number.isFinite(distance) || distance < 0) return null;
  if (!["ft", "foot", "feet"].includes(units)) return null;
  return distance;
}

function compilerArtifactIds(effect) {
  const values = arcaneEffectFlag(effect, "compilerArtifactIds");
  if (values instanceof Set) return Array.from(values);
  if (Array.isArray(values)) return values;
  if (typeof values === "string" && values.trim()) return [values];
  return [];
}

async function sourceItemForCompilerSourceEffect(effect, sourceActor) {
  const exactSourceItemUuid = String(
    arcaneEffectFlag(effect, "sourceItemUuid") ?? "",
  ).trim();
  if (exactSourceItemUuid) {
    const exactItem = await fromUuid(exactSourceItemUuid).catch(() => null);
    const exactActorUuid = exactItem?.actor?.uuid ?? exactItem?.parent?.uuid;
    return exactItem?.documentName === "Item"
      && exactActorUuid === sourceActor?.uuid
      ? exactItem
      : null;
  }
  const originItem = await sourceItemForTriggeredEffect(effect);
  const originActorUuid = originItem?.actor?.uuid ?? originItem?.parent?.uuid;
  if (originItem?.documentName === "Item" && originActorUuid === sourceActor?.uuid) {
    return originItem;
  }

  const flags = effect?.flags?.[MODULE_ID] ?? {};
  const sourceSpellId = String(flags.sourceSpellId ?? "").trim();
  const identifier = String(flags.identifier ?? "").trim();
  const actorItems = Array.from(sourceActor?.items ?? []);
  const actorItem = sourceActor?.items?.get?.(sourceSpellId)
    ?? actorItems.find(item => sourceSpellId && item.id === sourceSpellId)
    ?? actorItems.find(item => identifier && item.system?.identifier === identifier);
  return actorItem ?? originItem ?? null;
}

async function exactSourceItemForEffectHostHitByAttack(effect, sourceActor) {
  const exactSourceItemUuid = String(
    arcaneEffectFlag(effect, "sourceItemUuid") ?? "",
  ).trim();
  if (exactSourceItemUuid) {
    const exactItem = await fromUuid(exactSourceItemUuid).catch(() => null);
    const exactActorUuid = exactItem?.actor?.uuid ?? exactItem?.parent?.uuid;
    return exactItem?.documentName === "Item"
      && exactActorUuid === sourceActor?.uuid
      ? exactItem
      : null;
  }
  return sourceItemForTriggeredEffect(effect, {
    actorOwned: true,
    sourceActorUuid: sourceActor?.uuid ?? null,
  });
}

function sourceEffectCastLevel(sourceEffect, sourceItem) {
  const candidates = [
    arcaneEffectFlag(sourceEffect, "sourceCastLevel"),
    sourceEffect?.flags?.["midi-qol"]?.castData?.castLevel,
    sourceEffect?.flags?.[MODULE_ID]?.castLevel,
    sourceItem?.system?.level,
  ];
  for (const candidate of candidates) {
    const level = Number(candidate);
    if (Number.isFinite(level) && level >= 0) {
      return Math.min(9, Math.floor(level));
    }
  }
  return 0;
}

function runtimeValueExpressionNumber(expression, context) {
  if (typeof expression === "number" && Number.isFinite(expression)) return expression;
  if (
    !expression
    || typeof expression !== "object"
    || (
      expression.primitive !== undefined
      && expression.primitive !== "value-expression"
    )
  ) return null;
  if (expression.type === "constant") {
    const value = Number(expression.value);
    return Number.isFinite(value) ? value : null;
  }
  if (expression.type === "cast-level") return context.castLevel;
  if (expression.type === "levels-above-base") {
    return Math.max(0, context.castLevel - context.baseLevel);
  }
  if (expression.type === "add" && Array.isArray(expression.terms)) {
    const terms = expression.terms.map(term => runtimeValueExpressionNumber(term, context));
    return terms.every(Number.isFinite)
      ? terms.reduce((sum, value) => sum + value, 0)
      : null;
  }
  if (expression.type === "multiply" && Array.isArray(expression.factors)) {
    const factors = expression.factors.map(factor =>
      runtimeValueExpressionNumber(factor, context)
    );
    return factors.every(Number.isFinite)
      ? factors.reduce((product, value) => product * value, 1)
      : null;
  }
  if (expression.type === "maximum" && Array.isArray(expression.values)) {
    const values = expression.values.map(value =>
      runtimeValueExpressionNumber(value, context)
    );
    return values.length > 0 && values.every(Number.isFinite)
      ? Math.max(...values)
      : null;
  }
  if (expression.type === "spellcasting-modifier") {
    return actorSpellcastingModifier(context.sourceActor);
  }
  if (expression.type === "round-down") {
    const value = runtimeValueExpressionNumber(expression.value, context);
    return Number.isFinite(value) ? Math.floor(value) : null;
  }
  return null;
}

function runtimeValueExpressionFormula(expression, context) {
  if (typeof expression === "number" && Number.isFinite(expression)) {
    return String(expression);
  }
  if (
    !expression
    || typeof expression !== "object"
    || (
      expression.primitive !== undefined
      && expression.primitive !== "value-expression"
    )
  ) return "";
  if (expression.type === "constant") {
    const value = Number(expression.value);
    return Number.isFinite(value) ? String(value) : "";
  }
  if (expression.type === "dice") {
    const count = Number(expression.count);
    const faces = Number(expression.faces);
    return Number.isInteger(count) && count > 0 && Number.isInteger(faces) && faces > 1
      ? String(count) + "d" + String(faces)
      : "";
  }
  if (["cast-level", "levels-above-base", "round-down"].includes(expression.type)) {
    const value = runtimeValueExpressionNumber(expression, context);
    return Number.isFinite(value) ? String(value) : "";
  }
  if (expression.type === "add" && Array.isArray(expression.terms)) {
    const terms = expression.terms.map(term => runtimeValueExpressionFormula(term, context));
    return terms.length > 0 && terms.every(Boolean)
      ? terms.map(term => "(" + term + ")").join("+")
      : "";
  }
  if (expression.type === "multiply" && Array.isArray(expression.factors)) {
    const factors = expression.factors.map(factor =>
      runtimeValueExpressionFormula(factor, context)
    );
    return factors.length > 0 && factors.every(Boolean)
      ? factors.map(factor => "(" + factor + ")").join("*")
      : "";
  }
  if (
    expression.type === "maximum"
    && Array.isArray(expression.values)
  ) {
    const values = expression.values.map(value =>
      runtimeValueExpressionNumber(value, context)
    );
    return values.length > 0 && values.every(Number.isFinite)
      ? String(Math.max(...values))
      : "";
  }
  if (expression.type === "spellcasting-modifier") {
    const value = runtimeValueExpressionNumber(expression, context);
    return Number.isFinite(value) ? String(value) : "";
  }
  if (expression.type === "tiers" && Array.isArray(expression.entries)) {
    const selector = runtimeValueExpressionNumber(expression.selector, context);
    const entries = expression.entries
      .filter(entry => Number.isFinite(Number(entry?.minimum)))
      .sort((left, right) => Number(left.minimum) - Number(right.minimum));
    if (!Number.isFinite(selector) || !entries.length) return "";
    const selected = entries
      .filter(entry => Number(entry.minimum) <= selector)
      .at(-1) ?? entries[0];
    return runtimeValueExpressionFormula(selected.value, context);
  }
  if (expression.type === "per-slot-above-base") {
    const base = runtimeValueExpressionFormula(expression.base, context);
    const increment = runtimeValueExpressionFormula(expression.increment, context);
    const increments = Math.max(0, Math.floor(context.castLevel - context.baseLevel));
    if (!base || (increments > 0 && !increment)) return "";
    return [
      base,
      ...Array.from({ length: increments }, () => increment),
    ].map(term => "(" + term + ")").join("+");
  }
  return "";
}

function sourceEffectDamageFormula(formulaExpression, formula, sourceEffect, sourceItem) {
  const castLevel = sourceEffectCastLevel(sourceEffect, sourceItem);
  const baseLevel = Math.max(0, Number(sourceItem?.system?.level ?? 0) || 0);
  if (formulaExpression !== undefined && formulaExpression !== null) {
    return runtimeValueExpressionFormula(formulaExpression, {
      castLevel,
      baseLevel,
      sourceActor: sourceItem?.actor ?? sourceItem?.parent ?? null,
    });
  }
  if (typeof formula !== "string" && typeof formula !== "number") return "";
  const value = String(formula).trim();
  return value.replace(/@item\.level\b/g, String(castLevel));
}

async function applyCompilerDependentArtifact({
  sourceEffect,
  sourceActor,
  sourceItem,
  target,
  artifactId,
}) {
  const targetActor = target?.actor;
  if (!sourceEffect?.uuid || !sourceActor?.uuid || !sourceItem || !targetActor || !artifactId) {
    return false;
  }
  const effectData = effectDataFromItem(
    sourceItem,
    effect => compilerArtifactIds(effect).includes(artifactId),
    sourceActor,
  );
  if (!effectData) return false;

  const existing = Array.from(targetActor.effects ?? []).filter(effect =>
    compilerArtifactIds(effect).includes(artifactId)
    && String(arcaneEffectFlag(effect, "sourceEffectUuid") ?? "") === String(sourceEffect.uuid)
  );
  if (existing.length) {
    await targetActor.deleteEmbeddedDocuments(
      "ActiveEffect",
      existing.map(effect => effect.id),
      {
        existing: "effect-stacking",
        arcaneCompilerReplacement: true,
      },
    );
  }

  effectData.flags ??= {};
  effectData.flags[MODULE_ID] = {
    ...(effectData.flags[MODULE_ID] ?? {}),
    sourceActorUuid: sourceActor.uuid,
    sourceEffectUuid: sourceEffect.uuid,
    sourceItemUuid: sourceItem.uuid,
    sourceCastLevel: sourceEffectCastLevel(sourceEffect, sourceItem),
  };
  effectData.flags.dnd5e = {
    ...(effectData.flags.dnd5e ?? {}),
    dependentOn: sourceEffect.uuid,
    riders: effectData.flags.dnd5e?.riders ?? { statuses: [] },
  };
  try {
    await targetActor.createEmbeddedDocuments("ActiveEffect", [effectData]);
  } catch (error) {
    // The old dependents deliberately skipped cleanup while the replacement
    // transaction was open. If creation itself fails, close that transaction
    // by re-running last-dependent cleanup without the replacement marker.
    for (const deletedEffect of existing) {
      await cleanupCompilerSourceWhenLastDependentEnds(deletedEffect);
    }
    throw error;
  }
  return true;
}

async function applySpiritShroudBlockedHealing(sourceEffect, sourceActor, target) {
  const actor = target?.actor;
  if (!actor) return;
  const existing = Array.from(actor.effects ?? []).filter(effect =>
    (effect.getFlag?.(MODULE_ID, "spiritShroudBlockedHealing") === true
      || effect.flags?.[MODULE_ID]?.spiritShroudBlockedHealing === true)
    && (effect.getFlag?.(MODULE_ID, "sourceActorUuid") ?? effect.flags?.[MODULE_ID]?.sourceActorUuid) === sourceActor.uuid
  );
  if (existing.length) await actor.deleteEmbeddedDocuments("ActiveEffect", existing.map(effect => effect.id));
  const sourceItem = Array.from(sourceActor.items ?? []).find(item =>
    item.system?.identifier === "spirit-shroud-tce"
  );
  const effectData = effectDataFromItem(
    sourceItem,
    effect => effect.getFlag?.(MODULE_ID, "spiritShroudBlockedHealing") === true,
    sourceActor,
  );
  if (!effectData) return;
  effectData.flags[MODULE_ID] = {
    ...(effectData.flags[MODULE_ID] ?? {}),
    sourceActorUuid: sourceActor.uuid,
    sourceEffectUuid: sourceEffect.uuid,
  };
  // dnd5e tracks this world-UUID dependency across actors and owns cleanup
  // when the caster's source effect ends.
  effectData.flags.dnd5e = {
    ...(effectData.flags.dnd5e ?? {}),
    dependentOn: sourceEffect.uuid,
    riders: { statuses: [] },
  };
  await actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
}

async function applySpiritShroudDamageBonus(workflow) {
  if (workflow?.__arcaneSpiritShroudApplied || workflow?.activity?.type !== "attack") return true;
  const actor = workflow?.actor;
  const sourceEffect = spiritShroudSourceEffect(actor);
  const sourceToken = workflow?.token ?? findSourceToken(actor);
  if (!actor || !sourceEffect || !sourceToken) return true;
  if (sourceAttackProximityRiderContract(sourceEffect)) return true;
  const targets = confirmedHitTargets(workflow).filter(target => distanceBetweenTokens(sourceToken, target) <= 10);
  if (!targets.length) return true;
  workflow.__arcaneSpiritShroudApplied = true;
  const castLevel = spiritShroudCastLevel(sourceEffect);
  const baseDice = 1 + Math.floor((castLevel - 3) / 2);
  const dice = baseDice * (isCriticalHitWorkflow(workflow) ? 2 : 1);
  const damageType = sourceEffect.getFlag?.(MODULE_ID, "damageType")
    ?? sourceEffect.flags?.[MODULE_ID]?.damageType
    ?? "radiant";
  await applyBonusDamageWorkflow(workflow, String(dice) + "d8", damageType, "Spirit Shroud (" + damageType + ")", {
    riderId: "spirit-shroud",
    sourceEffectUuid: sourceEffect.uuid,
    targets,
    isCritical: isCriticalHitWorkflow(workflow),
  });
  for (const target of targets) await applySpiritShroudBlockedHealing(sourceEffect, actor, target);
  return true;
}

async function applySpiritShroudTurnStart(combat, changed) {
  if (!isPrimaryAutomationGM()) return;
  if (!("turn" in changed) && !("round" in changed)) return;
  const active = combat?.combatant;
  const targetToken = active?.token?.object ?? canvas.tokens?.get(active?.tokenId);
  if (!targetToken?.actor) return;

  for (const sourceToken of Array.from(canvas.tokens?.placeables ?? [])) {
    if (!sourceToken?.actor || sourceToken.id === targetToken.id) continue;
    const sourceEffect = spiritShroudSourceEffect(sourceToken.actor);
    if (!sourceEffect) continue;
    if (sourceTurnStartProximityEffectContract(sourceEffect)) continue;
    if (!opposedDisposition(sourceToken, targetToken)) continue;
    if (distanceBetweenTokens(sourceToken, targetToken) > 10) continue;
    if (!tokenCanSee(sourceToken, targetToken)) continue;
    const exists = Array.from(targetToken.actor.effects ?? []).some(effect =>
      (effect.getFlag?.(MODULE_ID, "spiritShroudSlow") === true
        || effect.flags?.[MODULE_ID]?.spiritShroudSlow === true)
      && (effect.getFlag?.(MODULE_ID, "sourceActorUuid")
        ?? effect.flags?.[MODULE_ID]?.sourceActorUuid) === sourceToken.actor.uuid
    );
    if (exists) continue;
    const sourceItem = Array.from(sourceToken.actor.items ?? []).find(item =>
      item.system?.identifier === "spirit-shroud-tce"
    );
    const effectData = effectDataFromItem(
      sourceItem,
      effect => effect.getFlag?.(MODULE_ID, "spiritShroudSlow") === true,
      sourceToken.actor,
    );
    if (!effectData) continue;
    effectData.flags[MODULE_ID] = {
      ...(effectData.flags[MODULE_ID] ?? {}),
      sourceActorUuid: sourceToken.actor.uuid,
      sourceEffectUuid: sourceEffect.uuid,
    };
    effectData.flags.dnd5e = {
      ...(effectData.flags.dnd5e ?? {}),
      dependentOn: sourceEffect.uuid,
      riders: { statuses: [] },
    };
    await targetToken.actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
  }
}

async function applySourceTurnStartProximityEffect(combat, changed) {
  if (!isPrimaryAutomationGM()) return true;
  if (!("turn" in (changed ?? {})) && !("round" in (changed ?? {}))) return true;
  const active = combat?.combatant;
  const targetToken = active?.token?.object ?? canvas.tokens?.get(active?.tokenId);
  if (!targetToken?.actor) return true;

  for (const sourceToken of Array.from(canvas.tokens?.placeables ?? [])) {
    if (!sourceToken?.actor || sourceToken.id === targetToken.id) continue;
    for (const sourceEffect of activeSourceRuntimeEffects(
      sourceToken.actor,
      "sourceTurnStartProximityEffect",
    )) {
      const contract = sourceTurnStartProximityEffectContract(sourceEffect);
      const runtimeRuleId = String(contract?.runtimeRuleId ?? contract?.ruleId ?? "").trim();
      const range = runtimeContractRangeDistance(contract);
      const policy = contract?.targetPolicy;
      const opposing = typeof contract?.opposing === "boolean"
        ? contract.opposing
        : typeof policy?.opposing === "boolean"
          ? policy.opposing
          : policy === "opposing"
            ? true
            : null;
      const requiresVisibility = typeof contract?.requiresVisibility === "boolean"
        ? contract.requiresVisibility
        : typeof contract?.visibility === "boolean"
          ? contract.visibility
          : typeof policy?.visibleToSource === "boolean"
            ? policy.visibleToSource
            : null;
      if (
        !runtimeRuleId
        || range === null
        || !contract.appliedArtifactId
        || opposing === null
        || requiresVisibility === null
        || (contract.subject && contract.subject !== "creature")
        || (opposing && !opposedDisposition(sourceToken, targetToken))
        || distanceBetweenTokens(sourceToken, targetToken) > range
        || (requiresVisibility && !tokenCanSee(sourceToken, targetToken))
      ) continue;
      const sourceItem = await sourceItemForCompilerSourceEffect(
        sourceEffect,
        sourceToken.actor,
      );
      if (!sourceItem) continue;
      await applyCompilerDependentArtifact({
        sourceEffect,
        sourceActor: sourceToken.actor,
        sourceItem,
        target: targetToken,
        artifactId: contract.appliedArtifactId,
      });
    }
  }
  return true;
}

function compilerZoneEventCursor(combat, state = null) {
  if (!combat?.started) return null;
  const combatId = String(combat.id ?? combat.uuid ?? "").trim();
  const cursorState = state ?? {
    round: combat.round,
    turn: combat.turn,
    combatantId: combat.combatant?.id,
  };
  const round = Number(cursorState?.round);
  const turn = Number(cursorState?.turn);
  const combatantId = String(cursorState?.combatantId ?? "").trim();
  if (
    !combatId
    || !Number.isInteger(round)
    || round < 0
    || !Number.isInteger(turn)
    || turn < 0
    || !combatantId
  ) return null;
  const combatant = combat.combatants?.get?.(combatantId)
    ?? Array.from(combat.combatants ?? []).find(candidate =>
      String(candidate?.id ?? "") === combatantId
    )
    ?? Array.from(combat.turns ?? []).find(candidate =>
      String(candidate?.id ?? "") === combatantId
    )
    ?? null;
  if (!combatant) return null;
  const indexedCombatant = Array.from(combat.turns ?? [])[turn] ?? null;
  if (indexedCombatant && String(indexedCombatant.id ?? "") !== combatantId) {
    return null;
  }
  return { combatId, round, turn, combatantId };
}

function compilerEventTurnKey(
  noncombatEventKey = null,
  combatEventCursor = undefined,
) {
  if (combatEventCursor !== undefined) {
    if (combatEventCursor !== null) {
      const combatId = String(combatEventCursor?.combatId ?? "").trim();
      const round = Number(combatEventCursor?.round);
      const turn = Number(combatEventCursor?.turn);
      const combatantId = String(combatEventCursor?.combatantId ?? "").trim();
      if (
        !combatId
        || !Number.isInteger(round)
        || round < 0
        || !Number.isInteger(turn)
        || turn < 0
        || !combatantId
      ) return null;
      return [combatId, round, turn].join(":");
    }
    // An explicit null means dispatch happened out of combat. Preserve only an
    // exact noncombat event receipt; never borrow a later live turn or degrade
    // a turn phase into a world-time receipt after the Actor queue wakes.
    if (noncombatEventKey) return "event:" + noncombatEventKey;
    return null;
  } else {
    // Preserve the legacy live lookup for non-zone callers. Zone dispatches
    // always provide the cursor captured before they enter the Actor queue.
    const combat = game.combat;
    if (combat?.started) {
      return [combat.id, combat.round ?? 0, combat.turn ?? -1].join(":");
    }
  }
  if (noncombatEventKey) return "event:" + noncombatEventKey;
  return "world:" + Math.floor(Number(game.time?.worldTime ?? 0));
}

function compilerFollowingAuraEventContract(document) {
  const contract = document?.getFlag?.(MODULE_ID, "followingAuraEventActivity")
    ?? document?.flags?.[MODULE_ID]?.followingAuraEventActivity;
  if (
    contract?.version !== 1
    || typeof contract.sourceArtifactId !== "string"
    || typeof contract.presentationArtifactId !== "string"
    || typeof contract.entryRuleId !== "string"
    || typeof contract.turnStartRuleId !== "string"
    || typeof contract.activityIdentifier !== "string"
    || contract.dedupe !== "aura-instance-target-turn"
  ) {
    return null;
  }
  return contract;
}

function isCompilerFollowingAuraEventCopy(effect) {
  const actor = effect?.parent;
  return actor?.effects?.get?.(effect.id) === effect
    && effect?.flags?.auraeffects?.fromAura === true
    && effect.disabled !== true
    && effect.active !== false
    && effect.isSuppressed !== true
    && Boolean(compilerFollowingAuraEventContract(effect));
}

function activeCompilerFollowingAuraSourceUuids() {
  const sourceUuids = new Set();
  for (const token of Array.from(canvas.tokens?.placeables ?? [])) {
    for (const effect of Array.from(token?.actor?.effects ?? [])) {
      if (
        effect?.flags?.auraeffects?.fromAura !== true
        && effect.disabled !== true
        && effect.active !== false
        && effect.isSuppressed !== true
        && compilerFollowingAuraEventContract(effect)
      ) {
        sourceUuids.add(effect.uuid);
      }
    }
  }
  return sourceUuids;
}

function compilerAuraMembershipName(effect) {
  return String(effect?.system?.overrideName ?? "").trim()
    || String(effect?.name ?? "").trim();
}

function isActiveCompilerAuraSource(effect) {
  return effect?.type === "auraeffects.aura"
    && effect?.flags?.auraeffects?.fromAura !== true
    && effect?.flags?.[MODULE_ID]?.sourceAura === true
    && effect.disabled !== true
    && effect.active !== false
    && effect.isSuppressed !== true;
}

let AURA_EFFECTS_HELPERS_PROMISE = null;

async function auraEffectsRuntimeHelpers() {
  AURA_EFFECTS_HELPERS_PROMISE ??= import(
    "/modules/auraeffects/scripts/helpers.mjs"
  );
  return AURA_EFFECTS_HELPERS_PROMISE;
}

async function replaceCompilerAuraCopiesWithNewSource(effect) {
  if (!isActiveCompilerAuraSource(effect) || effect.system?.canStack !== false) {
    return true;
  }
  const activeGM = game.users?.activeGM;
  if (!activeGM || game.user?.id !== activeGM.id) return true;
  const actor = effect.parent;
  const membershipName = compilerAuraMembershipName(effect);
  if (!actor || !membershipName) return true;
  await new Promise(resolve => setTimeout(resolve, 100));
  if (actor.effects?.get?.(effect.id) !== effect) return true;
  const replacedCopies = Array.from(actor.effects ?? []).filter(candidate =>
    candidate.flags?.auraeffects?.fromAura === true
    && compilerAuraMembershipName(candidate) === membershipName
  );
  if (replacedCopies.length > 0) {
    await activeGM.query("auraeffects.deleteEffects", {
      effectUuids: replacedCopies.map(candidate => candidate.uuid),
    });
  }
  return true;
}

async function restoreCompilerAuraMembershipAfterSourceDelete(effect) {
  if (
    effect?.type !== "auraeffects.aura"
    || effect?.flags?.auraeffects?.fromAura === true
    || effect?.flags?.[MODULE_ID]?.sourceAura !== true
  ) {
    return true;
  }
  const activeGM = game.users?.activeGM;
  if (!activeGM || game.user?.id !== activeGM.id) return true;
  const targetActorUuid = effect.parent?.uuid;
  const deletedMembershipName = compilerAuraMembershipName(effect);
  if (!targetActorUuid || !deletedMembershipName) return true;

  // Aura Effects 1.5.2 removes downstream copies when a non-stacking source
  // disappears, but does not promote another same-name source onto the former
  // source actor until that token moves. Reuse Aura Effects' own range and
  // custom-check helpers so membership still follows Foundry geometry.
  await new Promise(resolve => setTimeout(resolve, 100));
  const targetActor = await fromUuid(targetActorUuid).catch(() => null);
  const targetToken = targetActor?.getActiveTokens?.(false, true)?.[0];
  if (!targetActor || !targetToken || targetToken.parent?.id !== canvas.scene?.id) {
    return true;
  }
  const {
    executeScript,
    getAllAuraEffects,
    getNearbyTokens,
  } = await auraEffectsRuntimeHelpers();
  const candidateUuids = new Set();
  for (const sourceToken of Array.from(canvas.scene?.tokens ?? [])) {
    if (!sourceToken?.actor || sourceToken.actor.uuid === targetActor.uuid) continue;
    const [activeSources] = getAllAuraEffects(sourceToken.actor);
    for (const candidate of activeSources) {
      if (
        !isActiveCompilerAuraSource(candidate)
        || compilerAuraMembershipName(candidate) !== deletedMembershipName
      ) {
        continue;
      }
      const nearby = getNearbyTokens(sourceToken, candidate.system.distance, {
        disposition: candidate.system.disposition,
        collisionTypes: candidate.system.collisionTypes,
      });
      if (
        nearby.some(token => token.id === targetToken.id)
        && executeScript(sourceToken, targetToken, candidate)
      ) {
        candidateUuids.add(candidate.uuid);
      }
    }
  }
  if (candidateUuids.size > 0) {
    await activeGM.query("auraeffects.applyAuraEffects", {
      [targetActor.uuid]: Array.from(candidateUuids),
    });
  }
  return true;
}

async function compilerFollowingAuraEventSourceData(auraCopy) {
  const contract = compilerFollowingAuraEventContract(auraCopy);
  if (!contract) return null;
  const sourceEffect = auraCopy?.origin
    ? await fromUuid(auraCopy.origin).catch(() => null)
    : null;
  const sourceActor = sourceEffect?.parent;
  if (
    !sourceEffect
    || !sourceActor
    || sourceEffect.disabled === true
    || sourceEffect.active === false
    || sourceEffect.isSuppressed === true
    || sourceActor.effects?.get?.(sourceEffect.id) !== sourceEffect
  ) {
    return null;
  }
  if (!compilerArtifactIds(sourceEffect).includes(contract.sourceArtifactId)) return null;
  const sourceItem = await sourceItemForCompilerSourceEffect(sourceEffect, sourceActor);
  const automation = sourceItem?.flags?.[MODULE_ID]?.spellAutomation;
  const runtimeRules = automation?.runtimePlan?.rules ?? [];
  const entryRule = runtimeRules.find(rule =>
    rule.id === contract.entryRuleId
    && rule.adapter?.adapter === "following-aura-event-activity-v1"
    && rule.adapter?.phase === "entry"
    && rule.adapter?.usesActivityIdentifier === contract.activityIdentifier
  );
  const turnStartRule = runtimeRules.find(rule =>
    rule.id === contract.turnStartRuleId
    && rule.adapter?.adapter === "following-aura-event-activity-v1"
    && rule.adapter?.phase === "turn-start"
    && rule.adapter?.activityIdentifier === contract.activityIdentifier
  );
  if (
    sourceItem?.documentName !== "Item"
    || automation?.source !== "compiler"
    || !entryRule
    || !turnStartRule
  ) {
    return null;
  }
  const activity = Array.from(sourceItem.system?.activities ?? []).find(candidate =>
    candidate.midiProperties?.identifier === contract.activityIdentifier
  );
  if (!activity) return null;
  const baseLevel = Math.max(0, Number(sourceItem.system?.level ?? 0) || 0);
  const castLevel = Math.min(
    9,
    Math.max(baseLevel, sourceEffectCastLevel(sourceEffect, sourceItem)),
  );
  return {
    contract,
    sourceEffect,
    sourceActor,
    sourceItem,
    activity,
    castLevel,
  };
}

async function executeCompilerFollowingAuraEventActivity(
  auraCopy,
  targetToken,
  resolvedSource = null,
  noncombatEventKey = null,
) {
  const source = resolvedSource
    ?? await compilerFollowingAuraEventSourceData(auraCopy);
  if (!source || !targetToken?.actor) return true;
  const targetActor = targetToken.actor;
  const sourceUuid = source.sourceEffect.uuid;
  const sourceKey = (
    sourceUuid
    + ":" + source.contract.entryRuleId
    + ":" + (targetToken.document?.uuid ?? targetToken.id)
  ).replace(/[^A-Za-z0-9]/g, "_");
  const turnKey = compilerEventTurnKey(noncombatEventKey);
  const triggers = foundry.utils.deepClone(
    targetActor.getFlag(MODULE_ID, "compilerFollowingAuraEventTriggers") ?? {}
  );
  for (const [key, value] of Object.entries(triggers)) {
    if (value !== turnKey) delete triggers[key];
  }
  if (triggers[sourceKey] === turnKey) return true;
  triggers[sourceKey] = turnKey;
  await targetActor.setFlag(
    MODULE_ID,
    "compilerFollowingAuraEventTriggers",
    triggers,
  );
  try {
    const queueKey = sourceUuid + ":" + source.contract.activityIdentifier;
    const previous =
      COMPILER_FOLLOWING_AURA_EVENT_TRIGGER_QUEUES.get(queueKey)
      ?? Promise.resolve();
    const current = previous.catch(() => undefined).then(async () => {
      if (
        !isCompilerFollowingAuraEventCopy(auraCopy)
        || source.sourceEffect.disabled === true
        || source.sourceEffect.active === false
        || source.sourceEffect.isSuppressed === true
        || source.sourceActor.effects?.get?.(source.sourceEffect.id)
          !== source.sourceEffect
      ) {
        throw new Error("Compiler following-aura source or membership became inactive");
      }
      const workflow = await MidiQOL.completeActivityUse(source.activity, {
        concentration: { begin: false },
        midiOptions: {
          spellLevel: source.castLevel,
          noUseWarning: true,
          targetUuids: [targetToken.document.uuid],
          targetsToUse: new Set([targetToken]),
          ignoreUserTargets: true,
          fastForward: true,
        },
      });
      if (!workflow || workflow.aborted === true) {
        throw new Error("Compiler following-aura event activity did not complete");
      }
      return workflow;
    });
    COMPILER_FOLLOWING_AURA_EVENT_TRIGGER_QUEUES.set(queueKey, current);
    try {
      await current;
    } finally {
      if (
        COMPILER_FOLLOWING_AURA_EVENT_TRIGGER_QUEUES.get(queueKey) === current
      ) {
        COMPILER_FOLLOWING_AURA_EVENT_TRIGGER_QUEUES.delete(queueKey);
      }
    }
  } catch (error) {
    const current = foundry.utils.deepClone(
      targetActor.getFlag(MODULE_ID, "compilerFollowingAuraEventTriggers") ?? {}
    );
    if (current[sourceKey] === turnKey) {
      delete current[sourceKey];
      await targetActor.setFlag(
        MODULE_ID,
        "compilerFollowingAuraEventTriggers",
        current,
      );
    }
    throw error;
  }
  return true;
}

async function triggerCompilerFollowingAuraEventActivity(
  auraCopy,
  targetToken,
  resolvedSource = null,
  noncombatEventKey = null,
) {
  if (
    !isPrimaryAutomationGM()
    || !isCompilerFollowingAuraEventCopy(auraCopy)
    || !targetToken?.actor
  ) {
    return true;
  }
  const actorKey = targetToken.actor.uuid;
  const previous =
    COMPILER_FOLLOWING_AURA_EVENT_ACTOR_QUEUES.get(actorKey)
    ?? Promise.resolve();
  const current = previous.catch(() => undefined).then(() =>
    executeCompilerFollowingAuraEventActivity(
      auraCopy,
      targetToken,
      resolvedSource,
      noncombatEventKey,
    )
  );
  COMPILER_FOLLOWING_AURA_EVENT_ACTOR_QUEUES.set(actorKey, current);
  try {
    return await current;
  } finally {
    if (COMPILER_FOLLOWING_AURA_EVENT_ACTOR_QUEUES.get(actorKey) === current) {
      COMPILER_FOLLOWING_AURA_EVENT_ACTOR_QUEUES.delete(actorKey);
    }
  }
}

function compilerFollowingAuraMembershipOrigins(actor) {
  return new Set(
    Array.from(actor?.effects ?? [])
      .filter(isCompilerFollowingAuraEventCopy)
      .map(effect => String(effect.origin ?? ""))
      .filter(Boolean),
  );
}

async function handleCompilerFollowingAuraTokenMoved(tokenDocument, movement) {
  if (!isPrimaryAutomationGM() || !movement?.origin) return true;
  const targetToken = tokenDocument?.object ?? canvas.tokens?.get(tokenDocument?.id);
  const targetActor = tokenDocument?.actor ?? targetToken?.actor;
  if (!targetToken?.actor || !targetActor || targetToken.actor.uuid !== targetActor.uuid) {
    return true;
  }

  // The moveToken hook is the causality boundary: only membership created while
  // this target token completes its own movement can count as "enters".
  const membershipBefore = compilerFollowingAuraMembershipOrigins(targetActor);
  const sourcesBefore = activeCompilerFollowingAuraSourceUuids();
  const movementId = foundry.utils.randomID();
  const triggeredCopies = new Set();

  await Promise.resolve(targetToken.movementAnimationPromise).catch(() => undefined);
  for (const delay of [0, 50, 100, 200, 400, 800]) {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    const copies = Array.from(targetActor.effects ?? []).filter(effect =>
      isCompilerFollowingAuraEventCopy(effect)
      && !membershipBefore.has(String(effect.origin ?? ""))
      && sourcesBefore.has(String(effect.origin ?? ""))
      && !triggeredCopies.has(effect.uuid)
    );
    for (const copy of copies) {
      triggeredCopies.add(copy.uuid);
      await triggerCompilerFollowingAuraEventActivity(
        copy,
        targetToken,
        null,
        movementId,
      );
    }
  }
  return true;
}

async function applyCompilerFollowingAuraTurnStart(combat, changed) {
  if (!isPrimaryAutomationGM()) return true;
  if (!("turn" in changed) && !("round" in changed)) return true;
  const active = combat?.combatant;
  const targetToken = active?.token?.object ?? canvas.tokens?.get(active?.tokenId);
  if (!targetToken?.actor) return true;
  for (const effect of Array.from(targetToken.actor.effects ?? []).filter(
    isCompilerFollowingAuraEventCopy
  )) {
    await triggerCompilerFollowingAuraEventActivity(effect, targetToken);
  }
  return true;
}

function compilerZoneArtifactExistsBranch(contract) {
  const branch = contract?.artifactExistsBranch;
  if (branch === undefined || branch === null) return null;
  const keys = Object.keys(branch).sort();
  const expectedKeys = [
    "activityIdentifier",
    "artifactId",
    "entryRuleId",
    "turnStartRuleId",
  ].sort();
  const nullableRule = value => value === null || typeof value === "string";
  if (
    JSON.stringify(keys) !== JSON.stringify(expectedKeys)
    || typeof branch.artifactId !== "string"
    || branch.artifactId.length === 0
    || typeof branch.activityIdentifier !== "string"
    || branch.activityIdentifier.length === 0
    || !nullableRule(branch.entryRuleId)
    || !nullableRule(branch.turnStartRuleId)
    || (
      branch.entryRuleId === null
      && branch.turnStartRuleId === null
    )
    || branch.entryRuleId === null
    || branch.turnStartRuleId === null
  ) return null;
  return branch;
}

function compilerZoneEventContract(document) {
  const contract = document?.getFlag?.(MODULE_ID, "zoneEventActivity")
    ?? document?.flags?.[MODULE_ID]?.zoneEventActivity;
  const artifactExistsBranch = compilerZoneArtifactExistsBranch(contract);
  if (
    contract?.version !== 1
    || typeof contract.zoneArtifactId !== "string"
    || typeof contract.membershipArtifactId !== "string"
    || !(
      contract.entryRuleId === null
      || typeof contract.entryRuleId === "string"
    )
    || !(
      (contract.turnStartRuleId ?? null) === null
      || typeof contract.turnStartRuleId === "string"
    )
    || !(
      (contract.turnEndRuleId ?? null) === null
      || typeof contract.turnEndRuleId === "string"
    )
    || !(
      (contract.turnStartActivityIdentifier ?? null) === null
      || typeof contract.turnStartActivityIdentifier === "string"
    )
    || !(
      (contract.turnEndActivityIdentifier ?? null) === null
      || typeof contract.turnEndActivityIdentifier === "string"
    )
    || !(
      contract.concentrationDisruption === undefined
      || contract.concentrationDisruption === null
      || (
        typeof contract.concentrationDisruption === "object"
        && !Array.isArray(contract.concentrationDisruption)
        && typeof contract.concentrationDisruption.ability === "string"
        && typeof contract.concentrationDisruption.activityIdentifier === "string"
        && Array.isArray(contract.concentrationDisruption.phases)
        && contract.concentrationDisruption.phases.every(value =>
          ["entry", "turn-start", "turn-end"].includes(value)
        )
      )
    )
    || (
      contract.entryRuleId === null
      && (contract.turnStartRuleId ?? null) === null
      && (contract.turnEndRuleId ?? null) === null
    )
    || typeof contract.activityIdentifier !== "string"
    || (
      contract.artifactExistsBranch !== undefined
      && contract.artifactExistsBranch !== null
      && !artifactExistsBranch
    )
    || (
      artifactExistsBranch
      && (
        artifactExistsBranch.activityIdentifier === contract.activityIdentifier
        || artifactExistsBranch.artifactId === contract.membershipArtifactId
        || artifactExistsBranch.artifactId === contract.zoneArtifactId
        || contract.leaveCleanupArtifactIds?.includes(
          artifactExistsBranch.artifactId,
        )
        || ["entryRuleId", "turnStartRuleId"].some(key =>
          (artifactExistsBranch[key] === null)
            !== ((contract[key] ?? null) === null)
        )
        || (contract.turnEndRuleId ?? null) !== null
        || contract.dedupe !== "zone-instance-target-turn"
      )
    )
    || !["zone-instance-target-turn", "zone-instance-target-turn-phase"]
      .includes(contract.dedupe)
    || typeof contract.refreshMembershipOnTemplateMove !== "boolean"
    || !Array.isArray(contract.leaveCleanupArtifactIds)
    || contract.leaveCleanupArtifactIds.some(value =>
      typeof value !== "string" || value.length === 0
    )
    || new Set(contract.leaveCleanupArtifactIds).size
      !== contract.leaveCleanupArtifactIds.length
  ) {
    return null;
  }
  return contract;
}

function compilerZoneMembershipProvenance(document) {
  const value = document?.getFlag?.(MODULE_ID, "zoneMembershipProvenance")
    ?? document?.flags?.[MODULE_ID]?.zoneMembershipProvenance;
  if (
    value?.version !== 1
    || ![
      "templateUuid",
      "sourceItemUuid",
      "sourceActorUuid",
      "sourceEffectUuid",
      "targetUuid",
      "zoneArtifactId",
      "membershipArtifactId",
    ].every(key => typeof value[key] === "string" && value[key].length > 0)
  ) return null;
  return value;
}

function compilerZoneTemplateEntries(templateDocument) {
  return Array.from(templateDocument?.flags?.ActiveAuras?.IsAura ?? [])
    .map(entry => ({ entry, effectData: entry?.data ?? entry }));
}

function compilerZoneTemplateEntryMatches(
  templateDocument,
  sourceItem,
  contract,
) {
  if (!templateDocument || !sourceItem?.uuid || !contract) return false;
  return compilerZoneTemplateEntries(templateDocument).some(({ effectData }) => {
    const candidate = compilerZoneEventContract(effectData);
    const candidateBranch = compilerZoneArtifactExistsBranch(candidate);
    const contractBranch = compilerZoneArtifactExistsBranch(contract);
    return (
      candidate?.zoneArtifactId === contract.zoneArtifactId
      && candidate?.membershipArtifactId === contract.membershipArtifactId
      && candidate?.activityIdentifier === contract.activityIdentifier
      && JSON.stringify(candidateBranch) === JSON.stringify(contractBranch)
      && String(effectData?.origin ?? "") === String(sourceItem.uuid)
    );
  });
}

function prepareCompilerZoneMembershipProvenance(effect) {
  if (!isCompilerZoneEventAuraCopy(effect)) return true;
  const contract = compilerZoneEventContract(effect);
  const templateUuid = String(
    effect?.flags?.[MODULE_ID]?.zoneTemplateUuid ?? "",
  ).trim();
  const sourceItem = effect?.origin && typeof fromUuidSync === "function"
    ? fromUuidSync(effect.origin)
    : null;
  const templateDocument = templateUuid && typeof fromUuidSync === "function"
    ? fromUuidSync(templateUuid)
    : null;
  const sourceEffectUuid = String(
    templateDocument?.flags?.dnd5e?.dependentOn ?? "",
  ).trim();
  const sourceEffect = sourceEffectUuid && typeof fromUuidSync === "function"
    ? fromUuidSync(sourceEffectUuid)
    : null;
  const sourceActor = sourceItem?.actor ?? sourceItem?.parent;
  const targetActor = effect?.parent;
  if (
    sourceItem?.documentName !== "Item"
    || templateDocument?.documentName !== "MeasuredTemplate"
    || sourceEffect?.documentName !== "ActiveEffect"
    || sourceActor?.documentName !== "Actor"
    || targetActor?.documentName !== "Actor"
    || sourceEffect.parent?.uuid !== sourceActor.uuid
    || !compilerEffectOriginatesFromItem(sourceEffect, sourceItem)
    || !compilerZoneTemplateEntryMatches(
      templateDocument,
      sourceItem,
      contract,
    )
  ) return true;
  effect.updateSource({
    ["flags." + MODULE_ID + ".zoneMembershipProvenance"]: {
      version: 1,
      templateUuid: templateDocument.uuid,
      sourceItemUuid: sourceItem.uuid,
      sourceActorUuid: sourceActor.uuid,
      sourceEffectUuid: sourceEffect.uuid,
      targetUuid: targetActor.uuid,
      zoneArtifactId: contract.zoneArtifactId,
      membershipArtifactId: contract.membershipArtifactId,
    },
  });
  return true;
}

function isCompilerZoneEventAuraCopy(effect) {
  return effect?.flags?.ActiveAuras?.applied === true
    && Boolean(compilerZoneEventContract(effect));
}

function compilerZoneEntryReceipt(provenance) {
  if (!provenance) return null;
  return [
    provenance.templateUuid,
    provenance.sourceItemUuid,
    provenance.sourceActorUuid,
    provenance.sourceEffectUuid,
    provenance.targetUuid ?? "*",
    provenance.zoneArtifactId,
    provenance.membershipArtifactId,
  ].join("|");
}

function activeCompilerZoneEntrySourceReceipts() {
  const receipts = new Set();
  for (const template of Array.from(canvas.templates?.placeables ?? [])) {
    const templateDocument = template?.document;
    const sourceEffectUuid = String(
      templateDocument?.flags?.dnd5e?.dependentOn ?? "",
    ).trim();
    const sourceEffect = sourceEffectUuid && typeof fromUuidSync === "function"
      ? fromUuidSync(sourceEffectUuid)
      : null;
    if (
      sourceEffect?.documentName !== "ActiveEffect"
      || sourceEffect.disabled === true
      || sourceEffect.active === false
      || sourceEffect.isSuppressed === true
    ) continue;
    for (const { effectData } of compilerZoneTemplateEntries(templateDocument)) {
      const contract = compilerZoneEventContract(effectData);
      if (!contract?.entryRuleId) continue;
      const sourceItemUuid = String(effectData?.origin ?? "").trim();
      const sourceItem = sourceItemUuid && typeof fromUuidSync === "function"
        ? fromUuidSync(sourceItemUuid)
        : null;
      const sourceActor = sourceItem?.actor ?? sourceItem?.parent;
      if (
        sourceItem?.documentName !== "Item"
        || sourceActor?.documentName !== "Actor"
        || sourceEffect.parent?.uuid !== sourceActor.uuid
        || !compilerEffectOriginatesFromItem(sourceEffect, sourceItem)
        || !compilerZoneTemplateEntryMatches(templateDocument, sourceItem, contract)
      ) continue;
      receipts.add(compilerZoneEntryReceipt({
        templateUuid: templateDocument.uuid,
        sourceItemUuid: sourceItem.uuid,
        sourceActorUuid: sourceActor.uuid,
        sourceEffectUuid: sourceEffect.uuid,
        zoneArtifactId: contract.zoneArtifactId,
        membershipArtifactId: contract.membershipArtifactId,
      }));
    }
  }
  return receipts;
}

function compilerZoneActorMembershipReceipts(actor) {
  return new Set(
    Array.from(actor?.effects ?? [])
      .filter(effect =>
        isCompilerZoneEventAuraCopy(effect)
        && effect.disabled !== true
        && effect.active !== false
        && effect.isSuppressed !== true
      )
      .map(effect => compilerZoneEntryReceipt(compilerZoneMembershipProvenance(effect)))
      .filter(Boolean),
  );
}

async function waitForActiveAurasStable(timeoutMs = 15000) {
  const semaphore = globalThis.CONFIG?.AA?.Semaphore;
  if (typeof semaphore?.add !== "function") {
    throw new Error("ActiveAuras semaphore is unavailable");
  }
  let timeoutId;
  try {
    await Promise.race([
      Promise.resolve(semaphore.add(async () => true)),
      new Promise((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error("Timed out waiting for ActiveAuras to become idle")),
          timeoutMs,
        );
      }),
    ]);
  } finally {
    clearTimeout(timeoutId);
  }
  return true;
}

async function handleCompilerZoneTokenMoved(tokenDocument, movement) {
  if (!isPrimaryAutomationGM() || !movement?.origin) return true;
  const targetToken = tokenDocument?.object ?? canvas.tokens?.get(tokenDocument?.id);
  const targetActor = tokenDocument?.actor ?? targetToken?.actor;
  if (!targetToken?.actor || !targetActor || targetToken.actor.uuid !== targetActor.uuid) {
    return true;
  }
  const moved = ["x", "y", "elevation"].some(key =>
    Number.isFinite(Number(movement.origin?.[key]))
    && Number(movement.origin[key]) !== Number(tokenDocument?.[key] ?? 0)
  );
  if (!moved) return true;

  // Snapshot both sides of the relationship before this exact token movement
  // settles. Template placement and recollation have no movement receipt, and
  // an existing membership cannot become a new entry merely by being copied.
  const membershipBefore = compilerZoneActorMembershipReceipts(targetActor);
  const sourcesBefore = activeCompilerZoneEntrySourceReceipts();
  if (!sourcesBefore.size) return true;
  const movementId = foundry.utils.randomID();
  const triggeredReceipts = new Set();

  await Promise.resolve(targetToken.movementAnimationPromise).catch(() => undefined);
  // ActiveAuras already owns updateToken -> movementUpdate. Do not launch a
  // second UserCollateAuras transaction here: that public API bypasses its
  // Semaphore and can race the native movement path. Instead, observe the
  // exact applied-copy receipt produced by the authoritative path for a
  // bounded window. No new receipt means there was no proven zone entry.
  for (const delay of [0, 50, 100, 200, 400, 800]) {
    if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay));
    const copies = Array.from(targetActor.effects ?? []).filter(effect => {
      if (
        !isCompilerZoneEventAuraCopy(effect)
        || effect.disabled === true
        || effect.active === false
        || effect.isSuppressed === true
        || compilerZoneEventContract(effect)?.entryRuleId === null
      ) return false;
      const receipt = compilerZoneEntryReceipt(compilerZoneMembershipProvenance(effect));
      if (!receipt || membershipBefore.has(receipt) || triggeredReceipts.has(receipt)) {
        return false;
      }
      // Source receipts deliberately omit targetUuid so one live zone receipt
      // can be matched against the membership receipt for this moving token.
      const provenance = compilerZoneMembershipProvenance(effect);
      const sourceReceipt = compilerZoneEntryReceipt({ ...provenance, targetUuid: "*" });
      return sourcesBefore.has(sourceReceipt);
    });
    for (const copy of copies) {
      const receipt = compilerZoneEntryReceipt(compilerZoneMembershipProvenance(copy));
      triggeredReceipts.add(receipt);
      const key = movementId + ":" + receipt;
      const existing = COMPILER_ZONE_EVENT_ENTRY_TASKS.get(key);
      const task = existing ?? triggerCompilerZoneEventActivity(
        copy,
        targetToken,
        { phase: "entry", noncombatEventKey: movementId },
      );
      if (!existing) COMPILER_ZONE_EVENT_ENTRY_TASKS.set(key, task);
      try {
        await task;
      } finally {
        if (COMPILER_ZONE_EVENT_ENTRY_TASKS.get(key) === task) {
          COMPILER_ZONE_EVENT_ENTRY_TASKS.delete(key);
        }
      }
    }
  }
  return true;
}

function compilerZoneEventTemplateSource(sourceItem, contract) {
  if (!sourceItem || !contract) return null;
  const matches = [];
  for (const template of Array.from(canvas.templates?.placeables ?? [])) {
    for (const { entry, effectData } of compilerZoneTemplateEntries(
      template.document,
    )) {
      if (!compilerZoneTemplateEntryMatches(
        template.document,
        sourceItem,
        contract,
      )) continue;
      const candidate = compilerZoneEventContract(effectData);
      if (
        candidate?.zoneArtifactId === contract.zoneArtifactId
        && candidate?.membershipArtifactId === contract.membershipArtifactId
        && candidate?.activityIdentifier === contract.activityIdentifier
        && String(effectData?.origin ?? "") === String(sourceItem.uuid)
      ) matches.push({ template, entry });
    }
  }
  return matches.length === 1 ? matches[0] : null;
}

function compilerZoneEventTemplateSourceByUuid(sourceItem, contract, templateUuid) {
  if (!sourceItem || !contract || !templateUuid) return null;
  const templateDocument = typeof fromUuidSync === "function"
    ? fromUuidSync(templateUuid)
    : null;
  if (templateDocument?.documentName !== "MeasuredTemplate") return null;
  const template = templateDocument.object
    ?? canvas.templates?.get?.(templateDocument.id)
    ?? null;
  if (!template) return null;
  if (!compilerZoneTemplateEntryMatches(templateDocument, sourceItem, contract)) {
    return null;
  }
  for (const { entry, effectData } of compilerZoneTemplateEntries(templateDocument)) {
    const candidate = compilerZoneEventContract(effectData);
    if (
      candidate?.zoneArtifactId === contract.zoneArtifactId
      && candidate?.membershipArtifactId === contract.membershipArtifactId
      && candidate?.activityIdentifier === contract.activityIdentifier
      && String(effectData?.origin ?? "") === String(sourceItem.uuid)
    ) return { template, entry };
  }
  return null;
}

function isCompilerZoneEventAuraTemplate(templateDocument) {
  const auraEntries = templateDocument?.flags?.ActiveAuras?.IsAura ?? [];
  return auraEntries.some(entry => {
    const effectData = entry?.data ?? entry;
    return compilerZoneEventContract(effectData)?.refreshMembershipOnTemplateMove === true;
  });
}

function isCompilerPersistentAuraTemplate(templateDocument) {
  return compilerZoneTemplateEntries(templateDocument).some(({ effectData }) =>
    effectData?.flags?.[MODULE_ID]?.persistentTemplate === true
    && compilerArtifactIds(effectData).length > 0
  );
}

async function cleanupCompilerZoneMembershipOnTemplateDelete(templateDocument) {
  if (!isPrimaryAutomationGM()) return true;
  const isCompilerZone = compilerZoneTemplateEntries(templateDocument).some(({ effectData }) =>
    effectData?.flags?.[MODULE_ID]?.persistentTemplate === true
  );
  if (!isCompilerZone) return true;
  const templateUuid = templateDocument?.uuid;
  if (!templateUuid) return true;
  // ActiveAuras removes applied copies by shared item origin, so it cannot tell
  // two live instances of the same source item apart. The per-template link
  // written by the zone macro is the only exact receipt: a deleted zone owns
  // its membership copies, regardless of any sibling zone from the same item.
  const actors = new Map(
    Array.from(game.actors ?? [])
      .concat(Array.from(canvas.tokens?.placeables ?? []).map(token => token?.actor))
      .filter(actor => actor?.uuid)
      .map(actor => [actor.uuid, actor]),
  );
  for (const actor of actors.values()) {
    const copies = Array.from(actor.effects ?? [])
      .filter(effect =>
        effect?.flags?.ActiveAuras?.applied === true
        && String(effect?.flags?.[MODULE_ID]?.zoneTemplateUuid ?? "") === templateUuid
      );
    for (const copy of copies) {
      await cleanupCompilerZoneLeaveArtifacts(copy, {
        arcaneCompilerZoneTemplateDelete: true,
        arcaneCompilerZoneTemplateUuid: templateUuid,
      });
    }
    const copyIds = copies.map(effect => effect.id).filter(Boolean);
    if (copyIds.length > 0) {
      await actor.deleteEmbeddedDocuments("ActiveEffect", copyIds, {
        arcaneCompilerZoneTemplateDelete: true,
        arcaneCompilerZoneTemplateDeleteCleanupCompleted: true,
      });
    }
  }
  return true;
}

async function refreshCompilerZoneTemplateMembership(templateDocument, changed, _options, userId) {
  if (!game.user?.isGM || (userId && userId !== game.user.id)) return true;
  const geometryChanged = ["x", "y", "distance", "direction", "angle", "width", "elevation"]
    .some(key => Object.prototype.hasOwnProperty.call(changed ?? {}, key));
  const auraAttached = foundry.utils.hasProperty(changed ?? {}, "flags.ActiveAuras");
  const persistentTemplate = isCompilerPersistentAuraTemplate(templateDocument);
  const refreshAfterMovement = geometryChanged
    && isCompilerZoneEventAuraTemplate(templateDocument);
  const collateAfterAttachment = auraAttached && persistentTemplate;
  if (!refreshAfterMovement && !collateAfterAttachment) return true;

  const activeAuras = game.modules.get("ActiveAuras");
  const collate = activeAuras?.api?.AAHelpers?.UserCollateAuras;
  if (typeof collate !== "function") {
    throw new Error("ActiveAuras UserCollateAuras is required for compiler zone movement");
  }
  const templateKey = templateDocument.uuid ?? templateDocument.id;
  const refreshId = foundry.utils.randomID();
  COMPILER_ZONE_TEMPLATE_REFRESH_TASKS.set(templateKey, refreshId);
  // The elected ActiveAuras GM can be a different browser. Give that client
  // time to receive the template document update before it recomputes members.
  await new Promise(resolve => setTimeout(resolve, 500));
  if (COMPILER_ZONE_TEMPLATE_REFRESH_TASKS.get(templateKey) !== refreshId) return true;
  try {
    await collate(
      templateDocument.parent?.id ?? canvas.scene?.id,
      true,
      refreshAfterMovement,
      collateAfterAttachment
        ? "Arcane compiler persistent template attachment"
        : "Arcane compiler zone template update"
    );
  } finally {
    if (COMPILER_ZONE_TEMPLATE_REFRESH_TASKS.get(templateKey) === refreshId) {
      COMPILER_ZONE_TEMPLATE_REFRESH_TASKS.delete(templateKey);
    }
  }
  return true;
}

async function compilerZoneEventSourceData(auraCopy) {
  const rawContract = compilerZoneEventContract(auraCopy);
  if (!rawContract) return null;
  const artifactExistsBranch = compilerZoneArtifactExistsBranch(rawContract);
  const contract = {
    ...rawContract,
    turnStartRuleId: rawContract.turnStartRuleId ?? null,
    turnEndRuleId: rawContract.turnEndRuleId ?? null,
    turnStartActivityIdentifier: rawContract.turnStartActivityIdentifier ?? null,
    turnEndActivityIdentifier: rawContract.turnEndActivityIdentifier ?? null,
  };
  const provenance = compilerZoneMembershipProvenance(auraCopy);
  const sourceItemUuid = provenance?.sourceItemUuid ?? auraCopy?.origin;
  const sourceItem = sourceItemUuid
    ? await fromUuid(sourceItemUuid).catch(() => null)
    : null;
  if (sourceItem?.documentName !== "Item") {
    throw new Error(
      "Compiler zone membership " + (auraCopy?.uuid ?? auraCopy?.id ?? "unknown")
      + " cannot resolve its source Item",
    );
  }
  let conditionalSourceEffect = null;
  if (artifactExistsBranch) {
    conditionalSourceEffect = provenance?.sourceEffectUuid
      ? await fromUuid(provenance.sourceEffectUuid).catch(() => null)
      : null;
    const sourceActor = sourceItem?.actor ?? sourceItem?.parent;
    if (
      !provenance
      || sourceActor?.documentName !== "Actor"
      || sourceActor.uuid !== provenance.sourceActorUuid
      || conditionalSourceEffect?.documentName !== "ActiveEffect"
      || conditionalSourceEffect.parent?.uuid !== provenance.sourceActorUuid
      || conditionalSourceEffect.disabled === true
      || conditionalSourceEffect.active === false
      || conditionalSourceEffect.isSuppressed === true
      || provenance.sourceItemUuid !== sourceItem.uuid
      || !compilerEffectOriginatesFromItem(conditionalSourceEffect, sourceItem)
    ) {
      throw new Error(
        "Compiler conditional zone membership "
        + (auraCopy?.uuid ?? auraCopy?.id ?? "unknown")
        + " is missing exact source provenance",
      );
    }
  }
  const automation = sourceItem.flags?.[MODULE_ID]?.spellAutomation;
  const runtimeRules = automation?.runtimePlan?.rules ?? [];
  const turnStartActivityIdentifier = contract.turnStartActivityIdentifier
    ?? contract.activityIdentifier;
  const turnEndActivityIdentifier = contract.turnEndActivityIdentifier
    ?? contract.activityIdentifier;
  const entryRule = runtimeRules.find(rule =>
    contract.entryRuleId !== null
    && rule.id === contract.entryRuleId
    && rule.adapter?.adapter === "zone-event-activity-v1"
    && rule.adapter?.phase === "entry"
    && rule.adapter?.usesActivityIdentifier === contract.activityIdentifier
  );
  const turnStartRule = runtimeRules.find(rule =>
    contract.turnStartRuleId !== null
    && rule.id === contract.turnStartRuleId
    && rule.adapter?.adapter === "zone-event-activity-v1"
    && rule.adapter?.phase === "turn-start"
    && rule.adapter?.activityIdentifier === turnStartActivityIdentifier
  );
  const turnEndRule = runtimeRules.find(rule =>
    contract.turnEndRuleId !== null
    && rule.id === contract.turnEndRuleId
    && rule.adapter?.adapter === "zone-event-activity-v1"
    && rule.adapter?.phase === "turn-end"
    && rule.adapter?.activityIdentifier === turnEndActivityIdentifier
  );
  const branchEntryRule = runtimeRules.find(rule =>
    artifactExistsBranch
    && artifactExistsBranch.entryRuleId !== null
    && rule.id === artifactExistsBranch.entryRuleId
    && rule.adapter?.adapter === "zone-event-activity-v1"
    && rule.adapter?.phase === "entry"
    && rule.adapter?.usesActivityIdentifier
      === artifactExistsBranch?.activityIdentifier
  );
  const branchTurnStartRule = runtimeRules.find(rule =>
    artifactExistsBranch
    && artifactExistsBranch.turnStartRuleId !== null
    && rule.id === artifactExistsBranch.turnStartRuleId
    && rule.adapter?.adapter === "zone-event-activity-v1"
    && rule.adapter?.phase === "turn-start"
    && rule.adapter?.activityIdentifier
      === artifactExistsBranch?.activityIdentifier
  );
  if (
    automation?.source !== "compiler"
    || (contract.entryRuleId !== null && !entryRule)
    || (contract.turnStartRuleId !== null && !turnStartRule)
    || (contract.turnEndRuleId !== null && !turnEndRule)
    || (artifactExistsBranch?.entryRuleId && !branchEntryRule)
    || (artifactExistsBranch?.turnStartRuleId && !branchTurnStartRule)
  ) {
    throw new Error(
      "Compiler zone contract does not match the emitted runtime rules for "
      + sourceItem.uuid,
    );
  }
  const activity = Array.from(sourceItem.system?.activities ?? []).find(candidate =>
    candidate.midiProperties?.identifier === contract.activityIdentifier
  );
  const templateSource = provenance?.templateUuid
    ? compilerZoneEventTemplateSourceByUuid(
        sourceItem,
        contract,
        provenance.templateUuid,
      )
    : compilerZoneEventTemplateSource(sourceItem, contract);
  const declaredPhaseActivities = [
    contract.turnStartRuleId !== null ? turnStartActivityIdentifier : null,
    contract.turnEndRuleId !== null ? turnEndActivityIdentifier : null,
    artifactExistsBranch?.activityIdentifier ?? null,
  ].filter(Boolean);
  const activityIdentifiers = new Set(
    Array.from(sourceItem.system?.activities ?? [])
      .map(candidate => candidate.midiProperties?.identifier)
      .filter(Boolean),
  );
  if (
    !activity
    || !templateSource
    || declaredPhaseActivities.some(identifier => !activityIdentifiers.has(identifier))
  ) {
    throw new Error(
      "Compiler zone source is missing its exact template or phase activity for "
      + sourceItem.uuid,
    );
  }
  if (
    artifactExistsBranch
    && (
      templateSource.template?.document?.uuid !== provenance.templateUuid
      || String(
        templateSource.template?.document?.flags?.dnd5e?.dependentOn ?? "",
      ).trim() !== provenance.sourceEffectUuid
      || conditionalSourceEffect?.uuid !== provenance.sourceEffectUuid
    )
  ) {
    throw new Error(
      "Compiler conditional zone source chain does not match the exact "
      + "template dependency for " + sourceItem.uuid,
    );
  }
  const baseLevel = Math.max(0, Number(sourceItem.system?.level ?? 0) || 0);
  const castLevel = Math.min(9, Math.max(baseLevel, Number(
    templateSource.entry?.castLevel
    ?? auraCopy.flags?.["midi-qol"]?.castData?.castLevel
    ?? sourceItem.system?.level
    ?? baseLevel
  ) || baseLevel));
  return {
    contract,
    sourceItem,
    activity,
    template: templateSource.template,
    castLevel,
    artifactExistsBranch,
  };
}

async function bindCompilerZoneOutcomeArtifacts(
  source,
  auraCopy,
  targetActor,
  options = {},
) {
  const {
    workflow = null,
    targetToken = null,
    usedArtifactExistsBranch = false,
    branchArtifactEffectUuidsBefore = new Set(),
  } = options;
  const leaveCleanupArtifactIds = new Set(
    source?.contract?.leaveCleanupArtifactIds ?? [],
  );
  const branchArtifactId = source?.artifactExistsBranch?.artifactId ?? null;
  const artifactIds = [...new Set([
    ...leaveCleanupArtifactIds,
    ...(branchArtifactId ? [branchArtifactId] : []),
  ])];
  if (!artifactIds.length) return true;
  const provenance = compilerZoneMembershipProvenance(auraCopy);
  if (
    !provenance
    || provenance.sourceItemUuid !== source.sourceItem.uuid
    || provenance.templateUuid !== source.template.document?.uuid
    || provenance.zoneArtifactId !== source.contract.zoneArtifactId
    || provenance.membershipArtifactId !== source.contract.membershipArtifactId
    || provenance.targetUuid !== targetActor?.uuid
  ) return true;
  const sourceEffect = await fromUuid(provenance.sourceEffectUuid)
    .catch(() => null);
  if (
    sourceEffect?.documentName !== "ActiveEffect"
    || sourceEffect.parent?.uuid !== provenance.sourceActorUuid
    || !compilerEffectOriginatesFromItem(sourceEffect, source.sourceItem)
  ) return true;
  const targetKeys = new Set([
    targetActor?.uuid,
    targetActor?.id,
    targetToken?.uuid,
    targetToken?.id,
    targetToken?.document?.uuid,
    targetToken?.document?.id,
  ].map(value => String(value ?? "").trim()).filter(Boolean));
  const branchTargetFailedSave = Boolean(
    branchArtifactId
    && !usedArtifactExistsBranch
    && Array.from(workflow?.failedSaves ?? []).some(entry => {
      if (typeof entry === "string") return targetKeys.has(entry);
      return [
        entry?.uuid,
        entry?.id,
        entry?.actor?.uuid,
        entry?.actor?.id,
        entry?.document?.uuid,
        entry?.document?.id,
        entry?.document?.actor?.uuid,
        entry?.document?.actor?.id,
        entry?.actorId,
        entry?.document?.actorId,
      ].some(value => targetKeys.has(String(value ?? "").trim()));
    })
  );
  const branchCandidates = [];
  const bindEffect = async effect => {
    const updates = {
      ["flags." + MODULE_ID + ".sourceItemUuid"]: provenance.sourceItemUuid,
      ["flags." + MODULE_ID + ".sourceActorUuid"]: provenance.sourceActorUuid,
      ["flags." + MODULE_ID + ".sourceEffectUuid"]: provenance.sourceEffectUuid,
      ["flags." + MODULE_ID + ".targetUuid"]: provenance.targetUuid,
    };
    if (
      String(effect.flags?.dnd5e?.dependentOn ?? "")
      !== provenance.sourceEffectUuid
    ) {
      updates["flags.dnd5e.dependentOn"] = provenance.sourceEffectUuid;
    }
    await effect.update(updates);
  };

  for (const effect of Array.from(targetActor.effects ?? [])) {
    const effectArtifactIds = compilerArtifactIds(effect);
    if (
      !artifactIds.some(id => effectArtifactIds.includes(id))
      || !compilerEffectOriginatesFromItem(effect, source.sourceItem)
    ) continue;
    const isBranchArtifact = Boolean(
      branchArtifactId && effectArtifactIds.includes(branchArtifactId),
    );
    if (isBranchArtifact) {
      if (
        effect?.disabled === true
        || effect?.active === false
        || effect?.isSuppressed === true
      ) continue;
      const exactFields = [
        ["sourceItemUuid", provenance.sourceItemUuid],
        ["sourceActorUuid", provenance.sourceActorUuid],
        ["sourceEffectUuid", provenance.sourceEffectUuid],
        ["targetUuid", provenance.targetUuid],
      ];
      const conflictsWithExistingProvenance = exactFields.some(
        ([key, expected]) => {
          const current = String(arcaneEffectFlag(effect, key) ?? "").trim();
          return current.length > 0 && current !== expected;
        },
      );
      const currentDependentOn = String(
        effect.flags?.dnd5e?.dependentOn ?? "",
      ).trim();
      const effectUuid = String(effect.uuid ?? effect.id ?? "").trim();
      const alreadyExactCurrentSource = exactFields.every(
        ([key, expected]) =>
          String(arcaneEffectFlag(effect, key) ?? "").trim() === expected,
      ) && currentDependentOn === provenance.sourceEffectUuid;
      if (
        conflictsWithExistingProvenance
        || (
          currentDependentOn.length > 0
          && currentDependentOn !== provenance.sourceEffectUuid
        )
        || (
          effectUuid.length > 0
          && branchArtifactEffectUuidsBefore.has(effectUuid)
          && !alreadyExactCurrentSource
        )
      ) continue;
      const isNewOutcome = effectUuid.length > 0
        && !branchArtifactEffectUuidsBefore.has(effectUuid);
      if (isNewOutcome || alreadyExactCurrentSource) {
        branchCandidates.push(effect);
      }
      continue;
    }
    await bindEffect(effect);
  }
  if (branchArtifactId && !usedArtifactExistsBranch) {
    if (!branchTargetFailedSave && branchCandidates.length > 0) {
      throw new Error(
        "Compiler conditional zone workflow produced an outcome artifact "
        + "without an exact failed-save receipt for " + targetActor.uuid,
      );
    }
    if (branchTargetFailedSave && branchCandidates.length !== 1) {
      throw new Error(
        "Compiler conditional zone failed save must bind exactly one outcome "
        + "artifact for " + targetActor.uuid + "; received "
        + branchCandidates.length,
      );
    }
    if (branchTargetFailedSave) await bindEffect(branchCandidates[0]);
  }
  return true;
}

function compilerZoneExactOutcomeArtifactExists(
  source,
  auraCopy,
  targetActor,
) {
  const artifactId = source?.artifactExistsBranch?.artifactId;
  const provenance = compilerZoneMembershipProvenance(auraCopy);
  if (!artifactId) return false;
  if (
    !provenance
    || targetActor?.documentName !== "Actor"
    || provenance.sourceItemUuid !== source.sourceItem.uuid
    || provenance.templateUuid !== source.template.document?.uuid
    || provenance.zoneArtifactId !== source.contract.zoneArtifactId
    || provenance.membershipArtifactId !== source.contract.membershipArtifactId
    || provenance.targetUuid !== targetActor.uuid
  ) {
    throw new Error(
      "Compiler conditional zone branch cannot resolve exact membership "
      + "provenance for " + (targetActor?.uuid ?? "unknown target"),
    );
  }
  const matches = Array.from(targetActor.effects ?? []).filter(effect =>
    effect?.disabled !== true
    && effect?.active !== false
    && effect?.isSuppressed !== true
    && compilerArtifactIds(effect).includes(artifactId)
    && compilerEffectOriginatesFromItem(effect, source.sourceItem)
    && String(effect.flags?.dnd5e?.dependentOn ?? "")
      === provenance.sourceEffectUuid
    && String(arcaneEffectFlag(effect, "sourceEffectUuid") ?? "")
      === provenance.sourceEffectUuid
    && String(arcaneEffectFlag(effect, "sourceItemUuid") ?? "")
      === provenance.sourceItemUuid
    && String(arcaneEffectFlag(effect, "sourceActorUuid") ?? "")
      === provenance.sourceActorUuid
    && String(arcaneEffectFlag(effect, "targetUuid") ?? "")
      === provenance.targetUuid
  );
  if (matches.length > 1) {
    throw new Error(
      "Compiler zone conditional branch found duplicate exact artifacts for "
      + targetActor.uuid,
    );
  }
  return matches.length === 1;
}

async function executeCompilerZoneEventActivity(
  auraCopy,
  targetToken,
  {
    phase = null,
    noncombatEventKey = null,
    combatEventCursor = undefined,
  } = {},
) {
  const source = await compilerZoneEventSourceData(auraCopy);
  if (!source) return true;

  const phaseRuleId = phase === "entry"
    ? source.contract.entryRuleId
    : phase === "turn-start"
      ? source.contract.turnStartRuleId
      : phase === "turn-end"
        ? source.contract.turnEndRuleId
        : null;
  // A dispatch with an explicit phase must own a rule for that phase; otherwise
  // this copy's zone simply has no mechanic for the event and stays silent.
  if (phase && !phaseRuleId) return true;
  // Dual-phase zones emit one hidden pulse activity per phase; resolve the
  // activity for this dispatch's phase, falling back to the shared identifier.
  const useArtifactExistsBranch = Boolean(
    source.artifactExistsBranch
    && compilerZoneExactOutcomeArtifactExists(
      source,
      auraCopy,
      targetToken.actor,
    )
  );
  const phaseActivityIdentifier = useArtifactExistsBranch
    ? source.artifactExistsBranch.activityIdentifier
    : phase === "turn-start"
      ? (source.contract.turnStartActivityIdentifier ?? source.contract.activityIdentifier)
      : phase === "turn-end"
        ? (source.contract.turnEndActivityIdentifier ?? source.contract.activityIdentifier)
        : source.contract.activityIdentifier;
  const phaseActivity = phaseActivityIdentifier === source.activity?.midiProperties?.identifier
    ? source.activity
    : Array.from(source.sourceItem.system?.activities ?? []).find(candidate =>
        candidate.midiProperties?.identifier === phaseActivityIdentifier
      );
  if (!phaseActivity) {
    throw new Error(
      "Compiler zone phase activity " + phaseActivityIdentifier + " is unavailable",
    );
  }
  const sharedRuleId = source.contract.entryRuleId
    ?? source.contract.turnStartRuleId
    ?? source.contract.turnEndRuleId;
  const receiptRuleId = source.contract.dedupe === "zone-instance-target-turn-phase"
    ? (phaseRuleId ?? sharedRuleId)
    : sharedRuleId;
  const sourceUuid = source.template.document?.uuid ?? source.sourceItem.uuid;
  const sourceKey = (
    sourceUuid
    + ":" + receiptRuleId
    + ":" + (targetToken.document?.uuid ?? targetToken.id)
  )
    .replace(/[^A-Za-z0-9]/g, "_");
  const turnKey = compilerEventTurnKey(noncombatEventKey, combatEventCursor);
  if (!turnKey) {
    throw new Error("Compiler zone event is missing its exact combat cursor");
  }
  const targetActor = targetToken.actor;
  const triggers = foundry.utils.deepClone(
    targetActor.getFlag(MODULE_ID, "compilerZoneEventTriggers") ?? {}
  );
  for (const [key, value] of Object.entries(triggers)) {
    if (value !== turnKey) delete triggers[key];
  }
  if (triggers[sourceKey] === turnKey) return true;
  triggers[sourceKey] = turnKey;
  await targetActor.setFlag(MODULE_ID, "compilerZoneEventTriggers", triggers);

  try {
    const queueKey = sourceUuid + ":" + phaseActivityIdentifier;
    const previous = COMPILER_ZONE_EVENT_TRIGGER_QUEUES.get(queueKey) ?? Promise.resolve();
    const current = previous.catch(() => undefined).then(async () => {
      const branchArtifactEffectUuidsBefore = new Set(
        source.artifactExistsBranch
          ? Array.from(targetActor.effects ?? [])
              .filter(effect => compilerArtifactIds(effect).includes(
                source.artifactExistsBranch.artifactId,
              ))
              .map(effect => String(effect.uuid ?? effect.id ?? "").trim())
              .filter(Boolean)
          : [],
      );
      const workflow = await MidiQOL.completeActivityUse(phaseActivity, {
        concentration: { begin: false },
        midiOptions: {
          spellLevel: source.castLevel,
          noUseWarning: true,
          targetUuids: [targetToken.document.uuid],
          targetsToUse: new Set([targetToken]),
          ignoreUserTargets: true,
          fastForward: true,
        },
      });
      if (!workflow || workflow.aborted === true) {
        throw new Error("Compiler zone event activity did not complete");
      }
      await bindCompilerZoneOutcomeArtifacts(
        source,
        auraCopy,
        targetActor,
        {
          workflow,
          targetToken,
          usedArtifactExistsBranch: useArtifactExistsBranch,
          branchArtifactEffectUuidsBefore,
        },
      );
      const disruption = source.contract.concentrationDisruption ?? null;
      if (disruption && (disruption.phases ?? []).includes(phase)) {
        const concentrationEffects = Array.from(targetActor.effects ?? []).filter(effect => {
          if (
            effect?.disabled === true
            || effect?.active === false
            || effect?.isSuppressed === true
          ) return false;
          const statuses = effect.statuses instanceof Set
            ? Array.from(effect.statuses)
            : Array.from(effect.statuses ?? []);
          return statuses.includes("concentrating");
        });
        const concentrationActivity = concentrationEffects.length > 0
          ? Array.from(source.sourceItem.system?.activities ?? []).find(candidate =>
              candidate.midiProperties?.identifier === disruption.activityIdentifier
            )
          : null;
        if (concentrationActivity) {
          const concentrationWorkflow = await MidiQOL.completeActivityUse(
            concentrationActivity,
            {
              concentration: { begin: false },
              midiOptions: {
                spellLevel: source.castLevel,
                noUseWarning: true,
                targetUuids: [targetToken.document.uuid],
                targetsToUse: new Set([targetToken]),
                ignoreUserTargets: true,
                fastForward: true,
              },
            },
          );
          const failedSaves = concentrationWorkflow?.failedSaves;
          const failed = failedSaves instanceof Set
            ? Array.from(failedSaves).some(entry =>
                entry === targetToken
                || entry?.id === targetToken.id
                || entry?.actor === targetActor
              )
            : false;
          if (failed && typeof targetActor.endConcentration === "function") {
            await targetActor.endConcentration();
          }
        }
      }
      return workflow;
    });
    COMPILER_ZONE_EVENT_TRIGGER_QUEUES.set(queueKey, current);
    try {
      await current;
    } finally {
      if (COMPILER_ZONE_EVENT_TRIGGER_QUEUES.get(queueKey) === current) {
        COMPILER_ZONE_EVENT_TRIGGER_QUEUES.delete(queueKey);
      }
    }
  } catch (error) {
    const current = foundry.utils.deepClone(
      targetActor.getFlag(MODULE_ID, "compilerZoneEventTriggers") ?? {}
    );
    if (current[sourceKey] === turnKey) {
      delete current[sourceKey];
      await targetActor.setFlag(MODULE_ID, "compilerZoneEventTriggers", current);
    }
    throw error;
  }
  return true;
}

async function triggerCompilerZoneEventActivity(auraCopy, targetToken, options = {}) {
  if (!isPrimaryAutomationGM()) return true;
  if (
    !isCompilerZoneEventAuraCopy(auraCopy)
    || auraCopy.disabled === true
    || auraCopy.active === false
    || auraCopy.isSuppressed === true
    || !targetToken?.actor
  ) return true;
  const suppliedCombatEventCursor = Object.prototype.hasOwnProperty.call(
    options,
    "combatEventCursor",
  )
    ? options.combatEventCursor
    : compilerZoneEventCursor(game.combat);
  const capturedCombatEventCursor = suppliedCombatEventCursor
    && typeof suppliedCombatEventCursor === "object"
    ? Object.freeze({ ...suppliedCombatEventCursor })
    : suppliedCombatEventCursor;
  const queuedOptions = {
    ...options,
    combatEventCursor: capturedCombatEventCursor,
  };
  const actorKey = targetToken.actor.uuid;
  const previous = COMPILER_ZONE_EVENT_ACTOR_QUEUES.get(actorKey) ?? Promise.resolve();
  const current = previous.catch(() => undefined).then(() =>
    executeCompilerZoneEventActivity(auraCopy, targetToken, queuedOptions)
  );
  COMPILER_ZONE_EVENT_ACTOR_QUEUES.set(actorKey, current);
  try {
    return await current;
  } finally {
    if (COMPILER_ZONE_EVENT_ACTOR_QUEUES.get(actorKey) === current) {
      COMPILER_ZONE_EVENT_ACTOR_QUEUES.delete(actorKey);
    }
  }
}

async function cleanupCompilerZoneLeaveArtifacts(effect, options = {}) {
  if (!isPrimaryAutomationGM() || !isCompilerZoneEventAuraCopy(effect)) return true;
  if (options?.existing === "effect-stacking") return true;
  if (options?.arcaneCompilerZoneTemplateDeleteCleanupCompleted === true) return true;
  const contract = compilerZoneEventContract(effect);
  if (!contract?.leaveCleanupArtifactIds?.length) return true;
  const provenance = compilerZoneMembershipProvenance(effect);
  const targetActor = effect.parent;
  if (
    !provenance
    || targetActor?.documentName !== "Actor"
    || provenance.targetUuid !== targetActor.uuid
    || provenance.zoneArtifactId !== contract.zoneArtifactId
    || provenance.membershipArtifactId !== contract.membershipArtifactId
  ) return true;
  const templateDelete = options?.arcaneCompilerZoneTemplateDelete === true;
  if (
    templateDelete
    && String(options?.arcaneCompilerZoneTemplateUuid ?? "")
      !== provenance.templateUuid
  ) return true;

  // ActiveAuras can briefly replace membership copies during recollation.
  // Queue an idle barrier behind its pending work and then give its direct
  // movement path a bounded replacement window. A timeout fails closed: it is
  // safer to leave an outcome marker for the DM than to delete a still-valid
  // effect while the authoritative membership transaction is unresolved.
  if (!templateDelete) {
    try {
      await waitForActiveAurasStable();
    } catch (error) {
      console.warn("[" + MODULE_ID + "] Zone leave cleanup deferred", error);
      return true;
    }
  }
  const [sourceItem, sourceEffect, templateDocument] = await Promise.all([
    fromUuid(provenance.sourceItemUuid).catch(() => null),
    fromUuid(provenance.sourceEffectUuid).catch(() => null),
    fromUuid(provenance.templateUuid).catch(() => null),
  ]);
  if (
    sourceItem?.documentName !== "Item"
    || sourceEffect?.documentName !== "ActiveEffect"
    || sourceEffect.parent?.uuid !== provenance.sourceActorUuid
    || !compilerEffectOriginatesFromItem(sourceEffect, sourceItem)
  ) return true;

  if (!templateDelete) {
    if (
      templateDocument?.documentName !== "MeasuredTemplate"
      || templateDocument.flags?.dnd5e?.dependentOn !== provenance.sourceEffectUuid
      || !compilerZoneTemplateEntryMatches(
        templateDocument,
        sourceItem,
        contract,
      )
    ) return true;
  }

  const exactReplacementExists = () => Array.from(targetActor.effects ?? []).some(candidate => {
    if (
      candidate?.id === effect?.id
      || !isCompilerZoneEventAuraCopy(candidate)
      || candidate.disabled === true
      || candidate.active === false
      || candidate.isSuppressed === true
    ) return false;
    const replacement = compilerZoneMembershipProvenance(candidate);
    return replacement
      && replacement.templateUuid === provenance.templateUuid
      && replacement.sourceItemUuid === provenance.sourceItemUuid
      && replacement.sourceActorUuid === provenance.sourceActorUuid
      && replacement.sourceEffectUuid === provenance.sourceEffectUuid
      && replacement.targetUuid === provenance.targetUuid
      && replacement.zoneArtifactId === provenance.zoneArtifactId
      && replacement.membershipArtifactId === provenance.membershipArtifactId;
  });
  if (!templateDelete) {
    for (const delay of [0, 50, 100, 200, 400, 800]) {
      if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay));
      if (exactReplacementExists()) return true;
    }
  }

  const ids = new Set(contract.leaveCleanupArtifactIds);
  const cleanupIds = Array.from(targetActor.effects ?? []).filter(candidate =>
    candidate?.id
    && ids.size > 0
    && compilerArtifactIds(candidate).some(id => ids.has(id))
    && String(candidate.flags?.dnd5e?.dependentOn ?? "")
      === provenance.sourceEffectUuid
    && String(arcaneEffectFlag(candidate, "sourceEffectUuid") ?? "")
      === provenance.sourceEffectUuid
    && String(arcaneEffectFlag(candidate, "sourceItemUuid") ?? "")
      === provenance.sourceItemUuid
    && String(arcaneEffectFlag(candidate, "sourceActorUuid") ?? "")
      === provenance.sourceActorUuid
    && String(arcaneEffectFlag(candidate, "targetUuid") ?? "")
      === provenance.targetUuid
    && compilerEffectOriginatesFromItem(candidate, sourceItem)
  ).map(candidate => candidate.id);
  if (cleanupIds.length > 0) {
    await targetActor.deleteEmbeddedDocuments("ActiveEffect", cleanupIds, {
      arcaneCompilerZoneLeaveCleanup: true,
    });
  }
  return true;
}

async function applyCompilerZoneTurnStart(combat, changed) {
  if (!isPrimaryAutomationGM()) return true;
  if (!("turn" in changed) && !("round" in changed)) return true;
  const active = combat?.combatant;
  const targetToken = active?.token?.object ?? canvas.tokens?.get(active?.tokenId);
  if (!targetToken?.actor) return true;
  const combatEventCursor = compilerZoneEventCursor(combat);
  if (!combatEventCursor) return true;
  for (const effect of Array.from(targetToken.actor.effects ?? []).filter(
    isCompilerZoneEventAuraCopy
  )) {
    await triggerCompilerZoneEventActivity(effect, targetToken, {
      phase: "turn-start",
      combatEventCursor,
    });
  }
  return true;
}

function compilerPreviousTurnState(combat) {
  const previous = combat?.previous;
  const current = combat?.current;
  if (!previous?.combatantId || !current?.combatantId) return null;
  if (
    previous.combatantId === current.combatantId
    && Number(previous.round) === Number(current.round)
    && Number(previous.turn) === Number(current.turn)
  ) return null;
  return previous;
}

async function applyCompilerZoneTurnEnd(combat, changed) {
  if (!isPrimaryAutomationGM()) return true;
  if (!("turn" in changed) && !("round" in changed)) return true;
  const previousState = compilerPreviousTurnState(combat);
  if (!previousState) return true;
  const combatEventCursor = compilerZoneEventCursor(combat, previousState);
  if (!combatEventCursor) return true;
  const previous = combat?.combatants?.get?.(previousState.combatantId) ?? null;
  const targetToken = previous?.token?.object ?? canvas.tokens?.get(previous?.tokenId);
  if (!targetToken?.actor) return true;
  for (const effect of Array.from(targetToken.actor.effects ?? []).filter(
    isCompilerZoneEventAuraCopy
  )) {
    await triggerCompilerZoneEventActivity(effect, targetToken, {
      phase: "turn-end",
      combatEventCursor,
    });
  }
  return true;
}

function compilerSourceTurnCheckContracts(actor, phase) {
  const matches = [];
  for (const effect of Array.from(actor?.effects ?? [])) {
    if (
      effect?.disabled === true
      || effect?.active === false
      || effect?.isSuppressed === true
    ) continue;
    const contract = effect?.getFlag?.(MODULE_ID, "sourceTurnCheck")
      ?? effect?.flags?.[MODULE_ID]?.sourceTurnCheck;
    if (
      contract?.version !== 1
      || typeof contract.runtimeRuleId !== "string"
      || contract.phase !== phase
      || typeof contract.guardArtifactId !== "string"
      || typeof contract.formula !== "string"
      || !Number.isFinite(Number(contract.threshold))
    ) continue;
    // The carrying effect is itself the guard artifact; a copy that lost its
    // artifact ids never rolls.
    if (!compilerArtifactIds(effect).includes(contract.guardArtifactId)) continue;
    const identity = arcaneEffectFlag(effect, "identity");
    const sourceActorUuid = String(
      arcaneEffectFlag(effect, "sourceActorUuid")
      ?? arcaneEffectFlag(effect, "sourceUuid")
      ?? sourceActorUuidFromOrigin(effect.origin)
      ?? (identity?.scope === "source" ? effect.parent?.uuid : null)
      ?? "",
    );
    const sourceItemUuid = String(
      arcaneEffectFlag(effect, "sourceItemUuid")
      ?? compilerSourceItemUuidFromEffect(effect)
      ?? "",
    );
    const targetUuid = String(
      arcaneEffectFlag(effect, "targetUuid")
      ?? (identity?.scope === "source" ? effect.parent?.uuid : null)
      ?? "",
    );
    let sourceItem = null;
    try {
      sourceItem = sourceItemUuid && typeof fromUuidSync === "function"
        ? fromUuidSync(sourceItemUuid)
        : null;
    } catch (_error) {
      sourceItem = null;
    }
    const sourceItemActor = sourceItem?.actor ?? sourceItem?.parent;
    if (
      identity?.scope !== "source"
      || sourceActorUuid !== actor?.uuid
      || targetUuid !== actor?.uuid
      || sourceItem?.documentName !== "Item"
      || sourceItemActor?.uuid !== actor?.uuid
    ) continue;
    matches.push({ contract, effect });
  }
  return matches;
}

async function applyCompilerSourceTurnChecks(combat, changed, phase) {
  if (!isPrimaryAutomationGM()) return true;
  if (!["turn-start", "turn-end"].includes(phase)) return true;
  if (!("turn" in changed) && !("round" in changed)) return true;
  const cursor = phase === "turn-start"
    ? combat?.current
    : compilerPreviousTurnState(combat);
  if (!cursor?.combatantId) return true;
  const combatant = combat?.combatants?.get?.(cursor.combatantId) ?? null;
  const token = combatant?.token?.object ?? canvas.tokens?.get(combatant?.tokenId);
  const actor = token?.actor;
  if (!actor) return true;
  for (const { contract, effect } of compilerSourceTurnCheckContracts(actor, phase)) {
    const receiptKey = contract.runtimeRuleId + ":" + phase;
    const cursorKey = [
      combat?.id,
      cursor.round,
      cursor.turn,
      cursor.combatantId,
      phase,
    ].join(":");
    const receipts = foundry.utils.deepClone(
      effect.getFlag?.(MODULE_ID, "sourceTurnCheckReceipts")
      ?? effect.flags?.[MODULE_ID]?.sourceTurnCheckReceipts
      ?? {},
    );
    if (receipts[receiptKey] === cursorKey) continue;
    const previousReceipt = receipts[receiptKey];
    receipts[receiptKey] = cursorKey;
    await effect.setFlag(MODULE_ID, "sourceTurnCheckReceipts", receipts);
    try {
      const roll = await new Roll(contract.formula).evaluate();
      const success = Number(roll.total) >= Number(contract.threshold);
      const text = String(
        (success ? contract.successChat : contract.failureChat) ?? "",
      ).trim();
      const content = text || (success ? "Success." : "Failure.");
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ token: token?.document ?? token, actor }),
        content: "<p><strong>" + (effect.name ?? "Turn check") + "</strong> — " + content + "</p>",
        rolls: [roll],
      });
    } catch (error) {
      const currentReceipts = foundry.utils.deepClone(
        effect.getFlag?.(MODULE_ID, "sourceTurnCheckReceipts") ?? {},
      );
      if (currentReceipts[receiptKey] === cursorKey) {
        if (previousReceipt === undefined) delete currentReceipts[receiptKey];
        else currentReceipts[receiptKey] = previousReceipt;
        await effect.setFlag(MODULE_ID, "sourceTurnCheckReceipts", currentReceipts);
      }
      throw error;
    }
  }
  return true;
}

function tokenHasSelfSourcedMarker(token, flagName) {
  return Array.from(token?.actor?.effects ?? []).some(effect => {
    if (!effect.getFlag?.(MODULE_ID, flagName)) return false;
    return effect.getFlag(MODULE_ID, "sourceActorUuid") === token.actor?.uuid;
  });
}

function tokenIsConscious(token) {
  const statuses = token?.actor?.statuses;
  if (!statuses) return true;
  return !["dead", "unconscious", "incapacitated"].some(status => statuses.has(status));
}

function tokenIsEligibleAuraSource(sourceToken, targetToken, { markerFlag, featureIdentifier, distance = 0, disposition = "same", includeSelf = true, requireConscious = true } = {}) {
  if (!sourceToken?.actor || !targetToken?.actor) return false;
  if (!includeSelf && sourceToken.id === targetToken.id) return false;
  if (requireConscious && !tokenIsConscious(sourceToken)) return false;
  if (disposition === "same" && sourceToken.document?.disposition !== targetToken.document?.disposition) return false;
  if (disposition === "not-hostile" && targetToken.document?.disposition === -1) return false;
  if (markerFlag && !tokenHasSelfSourcedMarker(sourceToken, markerFlag)) return false;
  if (featureIdentifier && !actorHasFeature(sourceToken.actor, featureIdentifier)) return false;
  return distanceBetweenTokens(sourceToken, targetToken) <= distance;
}

function findNearbyAuraSources(targetToken, options) {
  return Array.from(canvas.tokens?.placeables ?? []).filter(token => tokenIsEligibleAuraSource(token, targetToken, options));
}

function bestAuraSource(targetToken, options, scoreSource = () => 0) {
  const sources = findNearbyAuraSources(targetToken, options);
  if (!sources.length) return null;
  return sources.reduce((best, source) => (scoreSource(source) > scoreSource(best) ? source : best), sources[0]);
}

function findNearbyCountercharmSource(targetToken) {
  return bestAuraSource(targetToken, {
    markerFlag: COUNTERCHARM_FLAG,
    distance: 30,
    disposition: "same",
    includeSelf: true,
    requireConscious: true,
  });
}

function isCharmOrFearSave(config) {
  const subject = config?.subject;
  const item = subject?.item?.documentName === "Item" ? subject.item : null;
  const activity = subject?.activity ?? config?.activity;
  const text = [
    item?.name,
    item?.system?.identifier,
    item?.system?.description?.value,
    activity?.name,
    activity?.description?.chatFlavor,
    activity?.useConditionText,
    activity?.effectConditionText,
    config?.flavor,
  ]
    .filter(value => typeof value === "string")
    .join(" ")
    .toLowerCase();
  return /charm|charmed|frightened|fear|恐慌|惊恐|恐惧|魅惑|着迷/.test(text);
}

function savingThrowContextText(config) {
  const subject = config?.subject;
  const item = savingThrowItem(config);
  const activity =
    subject?.activity ??
    config?.activity ??
    config?.midiOptions?.workflow?.activity;
  return [
    item?.name,
    item?.type,
    item?.system?.identifier,
    item?.system?.description?.value,
    Array.from(item?.system?.properties ?? []).join(" "),
    activity?.name,
    activity?.description?.chatFlavor,
    activity?.useConditionText,
    activity?.effectConditionText,
    config?.flavor,
  ]
    .filter(value => typeof value === "string")
    .join(" ")
    .toLowerCase();
}

function savingThrowAbility(config) {
  const raw = config?.ability ?? config?.data?.ability ?? config?.rolls?.[0]?.options?.ability;
  if (Array.isArray(raw)) return String(raw[0] ?? "").toLowerCase();
  return String(raw ?? "").toLowerCase();
}

function savingThrowItem(config) {
  const subject = config?.subject;
  if (subject?.item?.documentName === "Item") return subject.item;
  if (config?.item?.documentName === "Item") return config.item;
  return config?.midiOptions?.workflow?.item;
}

function isPoisonSave(config) {
  return /poison|poisoned|毒|中毒/.test(savingThrowContextText(config));
}

function isCharmSave(config) {
  return /charm|charmed|魅惑|着迷/.test(savingThrowContextText(config));
}

function isFearSave(config) {
  return /frightened|fear|恐慌|惊恐|恐惧/.test(savingThrowContextText(config));
}

function isMagicSave(config) {
  const item = savingThrowItem(config);
  if (item?.type === "spell") return true;
  if (item?.system?.properties?.has?.("mgc")) return true;
  return /spell|magic|magical|法术|魔法/.test(savingThrowContextText(config));
}

function applyCountercharmSavingThrow(config, dialog, message) {
  const actor = config?.subject;
  if (!actor || !isCharmOrFearSave(config)) return;
  const targetToken = findSourceToken(actor);
  if (!targetToken) return;
  const sourceToken = findNearbyCountercharmSource(targetToken);
  if (!sourceToken) return;
  config.advantage = true;
  message.data ??= {};
  message.data.flags ??= {};
  message.data.flags[MODULE_ID] = {
    ...(message.data.flags[MODULE_ID] ?? {}),
    countercharm: {
      sourceActorUuid: sourceToken.actor.uuid,
      sourceTokenUuid: sourceToken.document.uuid,
      sourceName: sourceToken.name,
    },
  };
}

function applyRacialSavingThrowAutomation(config, dialog, message) {
  const actor = config?.subject;
  if (!actor) return;
  const reasons = [];
  const ability = savingThrowAbility(config);
  if (actorHasFeature(actor, FEY_ANCESTRY_IDENTIFIER) && isCharmSave(config)) reasons.push("Fey Ancestry");
  if (actorHasFeature(actor, HALFLING_BRAVE_IDENTIFIER) && isFearSave(config)) reasons.push("Brave");
  if (actorHasFeature(actor, DWARVEN_RESILIENCE_IDENTIFIER) && isPoisonSave(config)) reasons.push("Dwarven/Stout Resilience");
  if (actorHasFeature(actor, GNOME_CUNNING_IDENTIFIER) && ["int", "wis", "cha"].includes(ability) && isMagicSave(config)) {
    reasons.push("Gnome Cunning");
  }
  if (!reasons.length) return;
  config.advantage = true;
  message.data ??= {};
  message.data.flags ??= {};
  message.data.flags[MODULE_ID] = {
    ...(message.data.flags[MODULE_ID] ?? {}),
    racialSavingThrowAdvantage: reasons,
  };
}

function applyProtectionFromPoisonSavingThrow(config, message) {
  const actor = config?.subject;
  if (!actor || !isPoisonSave(config)) return;
  const effect = Array.from(actor.effects ?? []).find(candidate => {
    const semantic = arcaneEffectFlag(candidate, "savingThrowAdvantage");
    if (Array.isArray(semantic?.against) && semantic.against.includes("poison")) return true;
    return arcaneEffectFlag(candidate, "protectionFromPoison") === true
      && arcaneEffectFlag(candidate, "poisonSaveAdvantage") === true;
  });
  if (!effect) return;
  config.advantage = true;
  for (const roll of config.rolls ?? []) {
    roll.options ??= {};
    roll.options.advantage = true;
  }
  config.flags ??= {};
  config.flags[MODULE_ID] = {
    ...(config.flags[MODULE_ID] ?? {}),
    protectionFromPoisonAdvantage: true,
    savingThrowAdvantage: {
      against: ["poison"],
      sourceEffectUuid: effect.uuid,
    },
  };
  message.data ??= {};
  message.data.flags ??= {};
  message.data.flags[MODULE_ID] = {
    ...(message.data.flags[MODULE_ID] ?? {}),
    protectionFromPoisonAdvantage: true,
    savingThrowAdvantage: {
      against: ["poison"],
      sourceEffectUuid: effect.uuid,
    },
  };
}

function applyTriggeredRepeatSaveRollMode(config, message) {
  const actor = config?.subject;
  if (!actor) return;
  const effect = Array.from(actor.effects ?? []).find(candidate =>
    arcaneEffectFlag(candidate, "temporaryRepeatSaveRollMode")
  );
  const contract = arcaneEffectFlag(effect, "temporaryRepeatSaveRollMode");
  const ability = savingThrowAbility(config);
  if (
    !contract
    || contract.ability !== ability
    || !["advantage", "disadvantage"].includes(contract.mode)
  ) return;
  config[contract.mode] = true;
  for (const roll of config.rolls ?? []) {
    roll.options ??= {};
    roll.options[contract.mode] = true;
  }
  config.flags ??= {};
  config.flags[MODULE_ID] = {
    ...(config.flags[MODULE_ID] ?? {}),
    triggeredRepeatSaveRollMode: {
      mode: contract.mode,
      ability,
      sourceEffectUuid: effect.uuid,
    },
  };
  message.data ??= {};
  message.data.flags ??= {};
  message.data.flags[MODULE_ID] = {
    ...(message.data.flags[MODULE_ID] ?? {}),
    triggeredRepeatSaveRollMode: {
      mode: contract.mode,
      ability,
      sourceEffectUuid: effect.uuid,
    },
  };
}

function nearbyUndeadTokens(actor, distance = 30) {
  const sourceToken = findSourceToken(actor);
  if (!sourceToken) return Array.from(game.user?.targets ?? []).filter(target => isUndeadActor(target.actor));

  return Array.from(canvas.tokens?.placeables ?? []).filter(token => {
    if (!token?.actor || token.id === sourceToken.id) return false;
    if (!isUndeadActor(token.actor)) return false;
    return distanceBetweenTokens(sourceToken, token) <= distance;
  });
}

function prepareTurnUndeadTargetsForUse(item, usageConfig) {
  if (item?.system?.identifier !== TURN_UNDEAD_IDENTIFIER) return;
  const targets = nearbyUndeadTokens(item.actor);
  usageConfig.midiOptions ??= {};
  usageConfig.midiOptions.targetsToUse = new Set(targets);
  usageConfig.midiOptions.targetUuids = targets.map(target => target.document.uuid);
}

function prepareTwilightSanctuaryTargetsForUse(item, usageConfig) {
  if (item?.system?.identifier !== TWILIGHT_SANCTUARY_IDENTIFIER) return;
  const sourceToken = findSourceToken(item.actor);
  if (!sourceToken) return;
  usageConfig.midiOptions ??= {};
  usageConfig.midiOptions.targetsToUse = new Set([sourceToken]);
  usageConfig.midiOptions.targetUuids = [sourceToken.document.uuid];
}

function nearbyNonAlliedTokens(actor, distance = 10) {
  const sourceToken = findSourceToken(actor);
  if (!sourceToken) return Array.from(game.user?.targets ?? []).filter(target =>
    target?.actor && target.document?.disposition !== findSourceToken(actor)?.document?.disposition
  );

  return Array.from(canvas.tokens?.placeables ?? []).filter(token => {
    if (!token?.actor || token.id === sourceToken.id) return false;
    if (token.document?.disposition === sourceToken.document?.disposition) return false;
    return distanceBetweenTokens(sourceToken, token) <= distance;
  });
}

function prepareAasimarNecroticShroudTargetsForUse(item, usageConfig) {
  if (item?.system?.identifier !== AASIMAR_NECROTIC_SHROUD_IDENTIFIER) return;
  const targets = nearbyNonAlliedTokens(item.actor, 10);
  usageConfig.midiOptions ??= {};
  usageConfig.midiOptions.targetsToUse = new Set(targets);
  usageConfig.midiOptions.targetUuids = targets.map(target => target.document.uuid);
}

function turnUndeadFailedSaveTargets(workflow) {
  const failed = workflow?.failedSaves;
  if (failed instanceof Set) return Array.from(failed);
  if (Array.isArray(failed)) return failed;
  return [];
}

function destroyUndeadThreshold(actor) {
  if (!actorHasFeature(actor, DESTROY_UNDEAD_IDENTIFIER)) return null;
  const clericLevels = classLevels(actor, "cleric");
  if (clericLevels >= 17) return 4;
  if (clericLevels >= 14) return 3;
  if (clericLevels >= 11) return 2;
  if (clericLevels >= 8) return 1;
  if (clericLevels >= 5) return 0.5;
  return null;
}

function actorChallengeRating(actor) {
  const cr = actor?.system?.details?.cr;
  if (typeof cr === "number") return cr;
  if (typeof cr === "string") {
    const fraction = cr.match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
    if (fraction) return Number(fraction[1]) / Number(fraction[2]);
    const parsed = Number(cr);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

async function destroyUndeadTarget(target) {
  const actor = target?.actor;
  if (!actor) return;
  await actor.update({ "system.attributes.hp.value": 0 });
  const defeated = CONFIG.specialStatusEffects?.DEFEATED ?? "dead";
  if (CONFIG.statusEffects?.some(status => status.id === defeated)) {
    await actor.toggleStatusEffect(defeated, { active: true });
  }
}

async function applyTurnedUndeadEffect(item, actor, target) {
  const effectData = effectDataFromItem(item, effect => effect.getFlag?.(MODULE_ID, "turnedUndead"), actor);
  if (!effectData || !target?.actor) return;
  await target.actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
}

async function applyTurnUndeadFromWorkflow(workflow) {
  if (workflow?.item?.system?.identifier !== TURN_UNDEAD_IDENTIFIER) return true;
  const actor = workflow.actor;
  const threshold = destroyUndeadThreshold(actor);
  for (const target of turnUndeadFailedSaveTargets(workflow)) {
    if (!target?.actor || !isUndeadActor(target.actor)) continue;
    const cr = actorChallengeRating(target.actor);
    if (threshold !== null && cr !== null && cr <= threshold) {
      await destroyUndeadTarget(target);
    } else {
      await applyTurnedUndeadEffect(workflow.item, actor, target);
    }
  }
  return true;
}

function actorHasFeature(actor, identifier) {
  const normalizedIdentifier = String(identifier ?? "").toLowerCase();
  return actor?.items?.some(item => {
    const itemIdentifier = String(item.system?.identifier ?? "").toLowerCase();
    const itemName = String(item.name ?? "").toLowerCase();
    return itemIdentifier === normalizedIdentifier || itemName.includes(normalizedIdentifier.replaceAll("-", " "));
  });
}

function bardicInspirationItem(actor) {
  return actor?.items?.find(item => item.system?.identifier === BARDIC_INSPIRATION_IDENTIFIER);
}

function bardicInspirationDie(actor) {
  const levels = classLevels(actor, "bard");
  if (levels >= 15) return "1d12";
  if (levels >= 10) return "1d10";
  if (levels >= 5) return "1d8";
  return "1d6";
}

function activeBardicInspirationEffect(actor) {
  return Array.from(actor?.effects ?? []).find(effect => effect.getFlag?.(MODULE_ID, BARDIC_INSPIRATION_FLAG));
}

function countercharmMarkerEffect(actor) {
  return Array.from(actor?.effects ?? []).find(effect => effect.getFlag?.(MODULE_ID, COUNTERCHARM_FLAG));
}

async function clearBardicInspirationEffect(actor) {
  const existing = activeBardicInspirationEffect(actor);
  if (existing) await actor.deleteEmbeddedDocuments("ActiveEffect", [existing.id]);
}

async function grantBardicInspiration(sourceIdentifier, targetIdentifier, config = {}) {
  const sourceActor = resolveWorldActor(sourceIdentifier);
  const targetActor = resolveWorldActor(targetIdentifier);
  if (!sourceActor) throw new Error(`Bard not found: ${sourceIdentifier}`);
  if (!targetActor) throw new Error(`Target actor not found: ${targetIdentifier}`);
  if (sourceActor.id === targetActor.id) throw new Error("Bardic Inspiration cannot target self.");

  const item = bardicInspirationItem(sourceActor);
  if (!item) throw new Error(`${sourceActor.name} does not have Bardic Inspiration.`);
  const max = Number(item.system?.uses?.max ?? 0);
  const spent = Number(item.system?.uses?.spent ?? 0);
  const shouldConsume = config.consume !== false;
  if (shouldConsume && (!Number.isFinite(max) || max <= 0 || spent >= max)) {
    throw new Error(`${sourceActor.name} has no Bardic Inspiration uses remaining.`);
  }

  await clearBardicInspirationEffect(targetActor);
  const die = bardicInspirationDie(sourceActor);
  await targetActor.createEmbeddedDocuments("ActiveEffect", [{
    name: "Bardic Inspiration",
    img: item.img,
    origin: item.uuid,
    transfer: false,
    disabled: false,
    type: "base",
    system: {},
    changes: [],
    duration: { seconds: 600 },
    statuses: [],
    flags: {
      [MODULE_ID]: {
        [BARDIC_INSPIRATION_FLAG]: true,
        die,
        sourceActorUuid: sourceActor.uuid,
        sourceName: sourceActor.name,
      },
    },
  }]);
  if (shouldConsume) await item.update({ "system.uses.spent": spent + 1 });
  return {
    sourceActorId: sourceActor.id,
    sourceActorName: sourceActor.name,
    targetActorId: targetActor.id,
    targetActorName: targetActor.name,
    die,
    usesSpent: shouldConsume ? spent + 1 : spent,
    usesMax: max,
  };
}

async function applyBardicInspirationFromUse(item, usageConfig, workflow) {
  if (item?.system?.identifier !== BARDIC_INSPIRATION_IDENTIFIER) return true;
  const sourceActor = workflow?.actor ?? item.actor;
  const targets = targetsFromUseConfig(workflow, usageConfig);
  if (!sourceActor || targets.length !== 1 || !targets[0]?.actor) return true;
  if (targets[0].actor.id === sourceActor.id) return true;
  await grantBardicInspiration(sourceActor.id, targets[0].actor.id, { consume: false });
  return true;
}

async function declareBardicInspirationUse(targetIdentifier, rollType = "attack") {
  const actor = resolveWorldActor(targetIdentifier);
  if (!actor) throw new Error(`Actor not found: ${targetIdentifier}`);
  const normalizedRollType = String(rollType ?? "attack").toLowerCase();
  if (!["attack", "save", "savingThrow", "check", "abilityCheck", "any"].includes(normalizedRollType)) {
    throw new Error(`Unsupported Bardic Inspiration roll type: ${rollType}`);
  }
  const effect = activeBardicInspirationEffect(actor);
  if (!effect) throw new Error(`${actor.name} does not have Bardic Inspiration.`);
  await effect.setFlag(MODULE_ID, "declaredRollType", normalizedRollType === "savingthrow" ? "save" : normalizedRollType);
  return {
    actorId: actor.id,
    actorName: actor.name,
    die: effect.getFlag(MODULE_ID, "die") ?? "1d6",
    declaredRollType: normalizedRollType,
    sourceName: effect.getFlag(MODULE_ID, "sourceName") ?? "",
  };
}

function declaredBardicInspirationEffect(actor, rollType) {
  const normalizedRollType = String(rollType ?? "").toLowerCase();
  const effect = activeBardicInspirationEffect(actor);
  if (!effect) return null;
  const declared = String(effect.getFlag(MODULE_ID, "declaredRollType") ?? "").toLowerCase();
  if (!declared) return null;
  if (declared === "any" || declared === normalizedRollType) return effect;
  if (declared === "abilitycheck" && normalizedRollType === "check") return effect;
  return null;
}

function addBardicDieToRollConfig(config, actor, rollType, message) {
  const effect = declaredBardicInspirationEffect(actor, rollType);
  if (!effect) return false;
  const die = String(effect.getFlag(MODULE_ID, "die") ?? "1d6");
  for (const roll of config?.rolls ?? []) {
    roll.parts ??= [];
    roll.parts.push(die);
  }
  config.parts ??= [];
  config.parts.push(die);
  message.data ??= {};
  message.data.flags ??= {};
  message.data.flags[MODULE_ID] = {
    ...(message.data.flags[MODULE_ID] ?? {}),
    bardicInspiration: {
      die,
      sourceActorUuid: effect.getFlag(MODULE_ID, "sourceActorUuid") ?? null,
      sourceName: effect.getFlag(MODULE_ID, "sourceName") ?? "",
    },
  };
  actor.deleteEmbeddedDocuments("ActiveEffect", [effect.id]);
  return true;
}

function applyBardicInspirationAttack(config, dialog, message) {
  const actor = config?.subject?.actor ?? config?.subject?.item?.actor ?? config?.actor;
  if (!actor) return;
  addBardicDieToRollConfig(config, actor, "attack", message);
}

function applyBardicInspirationSavingThrow(config, dialog, message) {
  const actor = config?.subject;
  if (!actor) return;
  addBardicDieToRollConfig(config, actor, "save", message);
}

async function recoverBardicInspirationOnRest(actor, result) {
  if (!actor || result?.type !== "short") return false;
  if (!actorHasFeature(actor, FONT_OF_INSPIRATION_IDENTIFIER)) return false;
  const item = bardicInspirationItem(actor);
  if (!item) return false;
  const spent = Number(item.system?.uses?.spent ?? 0);
  if (!spent) return false;
  await item.update({ "system.uses.spent": 0 });
  return true;
}

function resolveWorldActor(identifier) {
  if (!identifier) return null;
  if (identifier.documentName === "Actor") return identifier;
  if (typeof identifier !== "string") return null;
  return game.actors.get(identifier) ?? game.actors.getName(identifier) ?? null;
}

function restAutomationConfig(type) {
  return type === "short" ? { autoHD: false } : {};
}

async function applyBg3ShortRestHealing(actor, config = {}) {
  if (!actor || config.bg3Healing === false) return 0;
  const hp = actor.system?.attributes?.hp;
  if (!hp) return 0;
  const current = Number(hp.value ?? 0);
  const max = Number(hp.effectiveMax ?? hp.max ?? 0);
  if (!Number.isFinite(current) || !Number.isFinite(max) || max <= 0 || current >= max) return 0;
  const healing = Math.floor(max / 2);
  if (healing <= 0) return 0;
  const next = Math.min(max, current + healing);
  await actor.update({ "system.attributes.hp.value": next });
  return next - current;
}

function groupMemberActors(actor) {
  if (actor?.type !== "group") return [];
  return (actor.system?.members ?? [])
    .map(member => member.actor?.documentName === "Actor" ? member.actor : resolveWorldActor(member.actor))
    .filter(member => member?.documentName === "Actor");
}

function bg3ShortRestLimit(actor) {
  const actors = actor?.type === "group" ? groupMemberActors(actor) : [actor].filter(Boolean);
  const hasSongOfRest = actors.some(member => actorHasFeature(member, SONG_OF_REST_IDENTIFIER));
  return 2 + (hasSongOfRest ? 1 : 0);
}

function bg3ShortRestQuota(actor) {
  const limit = bg3ShortRestLimit(actor);
  const rawUsed = Number(actor?.getFlag?.(MODULE_ID, BG3_SHORT_RESTS_USED_FLAG) ?? 0);
  const used = Math.clamp(Number.isFinite(rawUsed) ? rawUsed : 0, 0, limit);
  return {
    used,
    limit,
    remaining: Math.max(limit - used, 0),
    songOfRestAvailable: limit > 2,
  };
}

function assertBg3ShortRestQuota(actor, config = {}) {
  const quota = bg3ShortRestQuota(actor);
  if (config.enforceShortRestQuota === false) return quota;
  if (quota.remaining <= 0) {
    throw new Error(`${actor.name} has no BG3 short rests remaining (${quota.used}/${quota.limit}). Take a long rest first.`);
  }
  return quota;
}

async function consumeBg3ShortRestQuota(actor, config = {}) {
  const before = bg3ShortRestQuota(actor);
  if (config.enforceShortRestQuota === false) return before;
  const used = Math.min(before.used + 1, before.limit);
  await actor.setFlag(MODULE_ID, BG3_SHORT_RESTS_USED_FLAG, used);
  return bg3ShortRestQuota(actor);
}

async function resetBg3ShortRestQuota(actor) {
  if (!actor?.setFlag) return null;
  await actor.setFlag(MODULE_ID, BG3_SHORT_RESTS_USED_FLAG, 0);
  return bg3ShortRestQuota(actor);
}

async function resetBg3ShortRestQuotaForTarget(actor) {
  const quota = await resetBg3ShortRestQuota(actor);
  if (actor?.type === "group") {
    for (const member of groupMemberActors(actor)) {
      await resetBg3ShortRestQuota(member);
    }
  }
  return quota;
}

async function restGroup(identifier, type = "short", config = {}) {
  const actor = resolveWorldActor(identifier);
  if (!actor) throw new Error(`Group actor not found: ${identifier}`);
  if (actor.type !== "group") throw new Error(`${actor.name} is not a group actor`);
  if (!["short", "long"].includes(type)) throw new Error(`Unsupported rest type: ${type}`);
  const quotaBefore = type === "short" ? assertBg3ShortRestQuota(actor, config) : null;
  const result = await actor[`${type}Rest`]({ dialog: false, autoRest: true, ...restAutomationConfig(type), ...config });
  const healing = [];
  if (type === "short") {
    for (const memberActor of groupMemberActors(actor)) {
      const healed = await applyBg3ShortRestHealing(memberActor, config);
      healing.push({ actorId: memberActor.id, actorName: memberActor.name, healed });
      await recoverBardicInspirationOnRest(memberActor, { type: "short" });
    }
    const quotaAfter = await consumeBg3ShortRestQuota(actor, config);
    return { type, targetId: actor.id, targetName: actor.name, targetType: "group", quotaBefore, quotaAfter, healing };
  }
  const quotaAfter = await resetBg3ShortRestQuotaForTarget(actor);
  return { type, targetId: actor.id, targetName: actor.name, targetType: "group", quotaAfter, restResult: result };
}

async function restActor(identifier, type = "short", config = {}) {
  const actor = resolveWorldActor(identifier);
  if (!actor) throw new Error(`Actor not found: ${identifier}`);
  if (actor.type === "group") return restGroup(actor, type, config);
  if (!["short", "long"].includes(type)) throw new Error(`Unsupported rest type: ${type}`);
  const quotaBefore = type === "short" ? assertBg3ShortRestQuota(actor, config) : null;
  const result = await actor[`${type}Rest`]({ dialog: false, ...restAutomationConfig(type), ...config });
  if (type === "short") {
    const healed = await applyBg3ShortRestHealing(actor, config);
    await recoverBardicInspirationOnRest(actor, { type: "short" });
    const quotaAfter = await consumeBg3ShortRestQuota(actor, config);
    return { type, targetId: actor.id, targetName: actor.name, targetType: "actor", quotaBefore, quotaAfter, healing: [{ actorId: actor.id, actorName: actor.name, healed }] };
  }
  const quotaAfter = await resetBg3ShortRestQuotaForTarget(actor);
  return { type, targetId: actor.id, targetName: actor.name, targetType: "actor", quotaAfter, restResult: result };
}

const ARCANE_BG3_SHORT_REST_BUTTON_CLASS = "arcane-bg3-short-rest";

function bg3ShortRestButtonLabel(actor) {
  const quota = bg3ShortRestQuota(actor);
  return "博德之门3短休 (" + quota.remaining + "/" + quota.limit + ")";
}

function updateBg3ShortRestButton(button, actor, busy = false) {
  if (!button || !actor) return null;
  const quota = bg3ShortRestQuota(actor);
  const label = bg3ShortRestButtonLabel(actor);
  button.dataset.tooltip = label;
  button.setAttribute("aria-label", label);
  button.setAttribute("type", "button");
  button.disabled = busy || quota.remaining <= 0;
  button.classList.toggle("disabled", button.disabled);
  return quota;
}

function updateBg3ShortRestButtonsForActor(actor) {
  if (!actor?.id) return;
  for (const button of document.querySelectorAll("." + ARCANE_BG3_SHORT_REST_BUTTON_CLASS + "[data-actor-id='" + actor.id + "']")) {
    updateBg3ShortRestButton(button, actor);
  }
}

async function handleBg3ShortRestButtonClick(event, actor) {
  event.preventDefault();
  event.stopPropagation();
  const button = event.currentTarget;
  updateBg3ShortRestButton(button, actor, true);
  button?.setAttribute("aria-busy", "true");
  try {
    const result = await restGroup(actor, "short");
    const quota = result?.quotaAfter ?? bg3ShortRestQuota(actor);
    ui.notifications?.info("博德之门3短休完成 (" + quota.remaining + "/" + quota.limit + ")");
  } catch (error) {
    console.warn("[" + MODULE_ID + "] BG3 short rest button failed", error);
    ui.notifications?.error(error?.message ?? String(error));
  } finally {
    button?.removeAttribute("aria-busy");
    updateBg3ShortRestButtonsForActor(actor);
  }
}

function injectBg3ShortRestButton(app, element) {
  const actor = app?.actor ?? app?.document;
  if (actor?.documentName !== "Actor" || actor.type !== "group") return;
  const root = element instanceof HTMLElement ? element : element?.[0] ?? app?.element;
  if (!(root instanceof HTMLElement)) return;
  const buttonRow = root.querySelector(".sheet-header-buttons");
  if (!buttonRow) return;

  let button = buttonRow.querySelector("." + ARCANE_BG3_SHORT_REST_BUTTON_CLASS);
  if (!button) {
    button = document.createElement("button");
    button.classList.add(ARCANE_BG3_SHORT_REST_BUTTON_CLASS, "gold-button");
    button.dataset.actorId = actor.id;
    button.innerHTML = '<i class="fa-solid fa-mug-hot" inert=""></i>';
    button.addEventListener("click", event => handleBg3ShortRestButtonClick(event, actor));
    const nativeShortRest = buttonRow.querySelector("button.short-rest[data-action='rest'][data-type='short']");
    nativeShortRest?.after(button);
    if (!button.isConnected) buttonRow.append(button);
  }
  updateBg3ShortRestButton(button, actor);
}

function injectBg3ShortRestButtonsIntoOpenSheets() {
  const instances = foundry.applications?.instances;
  if (!instances?.values) return;
  for (const app of instances.values()) injectBg3ShortRestButton(app, app.element);
}

function auraOfProtectionBonus(sourceToken) {
  if (!sourceToken?.actor || !actorHasFeature(sourceToken.actor, AURA_OF_PROTECTION_IDENTIFIER)) return 0;
  const cha = Number(sourceToken.actor.system?.abilities?.cha?.mod ?? 0);
  return Math.max(1, Number.isFinite(cha) ? cha : 0);
}

function applyAuraOfProtectionSave(actor, rollData) {
  if (!actor) return;
  const targetToken = findSourceToken(actor);
  if (!targetToken) return;
  const sourceToken = bestAuraSource(targetToken, {
    featureIdentifier: AURA_OF_PROTECTION_IDENTIFIER,
    distance: 10,
    disposition: "same",
    includeSelf: true,
    requireConscious: true,
  }, auraOfProtectionBonus);
  if (!sourceToken) return;
  const bonus = auraOfProtectionBonus(sourceToken);
  if (!bonus) return;

  rollData.parts ??= [];
  rollData.parts.push(String(bonus));
  rollData.messageData ??= {};
  rollData.messageData.flags ??= {};
  rollData.messageData.flags[MODULE_ID] = {
    ...(rollData.messageData.flags[MODULE_ID] ?? {}),
    auraOfProtection: {
      sourceActorUuid: sourceToken.actor.uuid,
      sourceTokenUuid: sourceToken.document.uuid,
      sourceName: sourceToken.name,
      bonus,
    },
  };
}

function applyAuraOfProtectionSavingThrow(config, message) {
  const actor = config?.subject;
  if (!actor) return;
  const targetToken = findSourceToken(actor);
  if (!targetToken) return;
  const sourceToken = bestAuraSource(targetToken, {
    featureIdentifier: AURA_OF_PROTECTION_IDENTIFIER,
    distance: 10,
    disposition: "same",
    includeSelf: true,
    requireConscious: true,
  }, auraOfProtectionBonus);
  if (!sourceToken) return;
  const bonus = auraOfProtectionBonus(sourceToken);
  if (!bonus) return;

  for (const roll of config.rolls ?? []) {
    roll.parts ??= [];
    roll.parts.push(String(bonus));
  }
  message.data ??= {};
  message.data.flags ??= {};
  message.data.flags[MODULE_ID] = {
    ...(message.data.flags[MODULE_ID] ?? {}),
    auraOfProtection: {
      sourceActorUuid: sourceToken.actor.uuid,
      sourceTokenUuid: sourceToken.document.uuid,
      sourceName: sourceToken.name,
      bonus,
    },
  };
}

function applyDreadAmbusherInitiative(combatant, rollConfig) {
  const actor = combatant?.actor;
  if (!actorHasFeature(actor, DREAD_AMBUSHER_IDENTIFIER)) return;
  const wis = Number(actor.system?.abilities?.wis?.mod ?? 0);
  if (!wis) return;
  rollConfig.parts ??= [];
  rollConfig.parts.push(String(wis));
}

async function applyDreadAmbusherTurnStart(combat, changed) {
  if (!("turn" in changed)) return;
  const combatant = combat.combatant;
  const token = combatant?.token?.object;
  const actor = combatant?.actor;
  if (!token || !actorHasFeature(actor, DREAD_AMBUSHER_IDENTIFIER)) return;
  const isFirstRound = Number(combat.round ?? 0) === 1;
  const existing = Array.from(actor.effects ?? []).find(effect => effect.getFlag?.(MODULE_ID, "dreadAmbusherRoundOne"));
  if (!isFirstRound && existing) {
    await actor.deleteEmbeddedDocuments("ActiveEffect", [existing.id]);
    return;
  }
  if (!isFirstRound || existing) return;
  await actor.createEmbeddedDocuments("ActiveEffect", [{
    name: "Dread Ambusher: Round One",
    origin: actor.uuid,
    transfer: false,
    disabled: false,
    changes: [{ key: "system.attributes.movement.walk", mode: 2, value: "10", priority: 20 }],
    duration: { rounds: 1, turns: 1, startRound: combat.round, startTurn: combat.turn },
    statuses: [],
    flags: {
      dae: { specialDuration: ["turnEnd", "combatEnd"], stackable: "noneName", showIcon: true },
      [MODULE_ID]: { dreadAmbusherRoundOne: true },
    },
    img: "modules/arcane-dnd5e-2014-automation/Nicons/Ability_Ambush.png",
    type: "base",
    system: {},
  }]);
}

function activityValues(item) {
  const activities = item?.system?.activities;
  if (!activities) return [];
  if (typeof activities.values === "function") return Array.from(activities.values());
  return Object.values(activities);
}

function activityHasHealingFormula(activity, formula) {
  const parts = Array.isArray(activity?.damage?.parts)
    ? activity.damage.parts
    : Object.values(activity?.damage?.parts ?? {});
  return parts.some(part => {
    const types = Array.isArray(part?.types) ? part.types : [part?.type, part?.damageType];
    const partFormula = String(part?.custom?.formula ?? part?.formula ?? "").trim();
    return types.some(type => String(type ?? "").toLowerCase() === "healing") && partFormula === String(formula);
  });
}

const VAMPIRE_REGENERATION_EXTRA_ACTOR_NAMES = new Set([
  "瓦伦汀·维尔 valentin veyr",
]);

function actorIsVampireRegenerationCandidate(actorName) {
  return actorName.includes("vampire spawn")
    || actorName.includes("吸血鬼衍体")
    || VAMPIRE_REGENERATION_EXTRA_ACTOR_NAMES.has(actorName);
}

function vampireRegenerationFeature(actor) {
  if (!actor || actor.type !== "npc" || !isUndeadActor(actor)) return null;
  const actorName = String(actor.name ?? "").toLowerCase();
  if (!actorIsVampireRegenerationCandidate(actorName)) return null;
  return actor.items?.find(item => {
    const itemName = String(item.name ?? "").toLowerCase();
    const identifier = String(item.system?.identifier ?? "").toLowerCase();
    const description = String(item.system?.description?.value ?? "").toLowerCase();
    const isRegeneration = identifier === "regeneration"
      || itemName.includes("regeneration")
      || itemName.includes("再生")
      || description.includes("regains 10 hit points")
      || description.includes("恢复 10");
    if (!isRegeneration) return false;
    return activityValues(item).some(activity => activityHasHealingFormula(activity, VAMPIRE_REGENERATION_HEAL))
      || /regains\s+10\s+hit points|恢复\s*10/.test(description);
  }) ?? null;
}

function actorHasVampireRegenerationBlocker(actor) {
  const blockerPattern = /regeneration suppressed|no regeneration|sunlight|running water|holy water|再生.*(抑制|禁用|失效)|日光|阳光|流水|圣水/i;
  return Array.from(actor?.effects ?? []).some(effect => {
    const text = [
      effect.name,
      effect.label,
      Array.from(effect.statuses ?? []).join(" "),
      effect.getFlag?.(MODULE_ID, "vampireRegenerationBlocker") ? "regeneration suppressed" : "",
    ].join(" ");
    return blockerPattern.test(text);
  });
}

async function consumeVampireRegenerationSuppression(actor, combat) {
  const marker = actor?.getFlag?.(MODULE_ID, VAMPIRE_REGENERATION_FLAG);
  if (!marker) return false;
  await actor.unsetFlag(MODULE_ID, VAMPIRE_REGENERATION_FLAG).catch(() => undefined);
  if (!combat || !marker.combatId) return true;
  return marker.combatId === combat.id;
}

async function createVampireRegenerationMessage(actor, content) {
  await ChatMessage.create({
    user: game.user?.id,
    speaker: ChatMessage.getSpeaker({ actor }),
    content,
  });
}

async function applyVampireRegenerationTurnStart(combat, changed) {
  if (!("turn" in changed)) return;
  const combatant = combat.combatant;
  const token = combatant?.token?.object;
  const actor = combatant?.actor ?? token?.actor;
  const feature = vampireRegenerationFeature(actor);
  if (!token || !actor || !feature) return;

  const hp = actor.system?.attributes?.hp;
  const current = Number(hp?.value ?? 0);
  const max = Number(hp?.max ?? hp?.effectiveMax ?? current);
  const suppressed = await consumeVampireRegenerationSuppression(actor, combat);
  if (suppressed || actorHasVampireRegenerationBlocker(actor)) {
    if (current > 0 && current < max) {
      await createVampireRegenerationMessage(actor, "<p><strong>Regeneration:</strong> suppressed this turn.</p>");
    }
    return;
  }
  if (!Number.isFinite(current) || !Number.isFinite(max) || current <= 0 || current >= max) return;
  const result = await updateActorHp(actor, VAMPIRE_REGENERATION_HEAL);
  const healed = Math.max(0, Number(result.newHP ?? 0) - Number(result.oldHP ?? 0));
  if (healed > 0) {
    await createVampireRegenerationMessage(actor, "<p><strong>Regeneration:</strong> " + actor.name + " regains " + healed + " HP.</p>");
  }
}

function collectDamageTypes(value, output = [], seen = new WeakSet()) {
  if (!value) return output;
  if (typeof value === "string") {
    output.push(value);
    return output;
  }
  if (Array.isArray(value)) {
    for (const entry of value) collectDamageTypes(entry, output, seen);
    return output;
  }
  if (typeof value !== "object") return output;
  if (seen.has(value)) return output;
  seen.add(value);
  for (const key of ["type", "damageType", "oldType", "newType"]) {
    if (typeof value[key] === "string") output.push(value[key]);
  }
  for (const key of ["damageDetail", "rawDamageDetail", "damageItem", "damageItems"]) {
    collectDamageTypes(value[key], output, seen);
  }
  return output;
}

function damagePayloadText(data) {
  const item = data?.item ?? data?.workflow?.item;
  const damageItem = data?.damageItem;
  return [
    item?.name,
    item?.system?.identifier,
    item?.system?.description?.value,
    data?.workflow?.item?.name,
    data?.workflow?.item?.system?.identifier,
    data?.workflow?.flavor,
    data?.workflow?.itemCardData?.flavor,
    damageItem?.name,
    damageItem?.flavor,
    damageItem?.type,
    damageItem?.damageType,
  ]
    .filter(value => typeof value === "string")
    .join(" ")
    .toLowerCase();
}

function damageSuppressesVampireRegeneration(data) {
  const damageTypes = collectDamageTypes([
    data?.damageItem,
    data?.damageDetail,
    data?.rawDamageDetail,
    data?.workflow?.damageItem,
    data?.workflow?.damageDetail,
    data?.workflow?.rawDamageDetail,
  ]).map(type => String(type ?? "").toLowerCase());
  if (damageTypes.includes("radiant")) return true;
  return /holy water|圣水/.test(damagePayloadText(data));
}

async function suppressVampireRegenerationFromDamage(token, data) {
  const actor = token?.actor ?? token?.document?.actor;
  if (!actor || !game.combat || !vampireRegenerationFeature(actor)) return false;
  if (!damageSuppressesVampireRegeneration(data)) return false;
  await actor.setFlag(MODULE_ID, VAMPIRE_REGENERATION_FLAG, {
    combatId: game.combat.id,
    round: game.combat.round,
    turn: game.combat.turn,
    source: "radiant-or-holy-water-damage",
  });
  return true;
}

async function sourceItemForTriggeredEffect(
  effect,
  { actorOwned = false, sourceActorUuid = null } = {},
) {
  const accepts = item => {
    if (item?.documentName !== "Item") return false;
    const actor = item.actor ?? item.parent;
    if (actorOwned && actor?.documentName !== "Actor") return false;
    if (sourceActorUuid && actor?.uuid !== sourceActorUuid) return false;
    return true;
  };
  const activityUuid = effect?.flags?.dae?.activity;
  const itemUuids = [
    effect?.flags?.[MODULE_ID]?.sourceItemUuid,
    effect?.flags?.["midi-qol"]?.castData?.itemUuid,
    effect?.flags?.dnd5e?.item?.uuid,
    effect?.flags?.core?.sourceId,
    typeof activityUuid === "string" ? activityUuid.split(".Activity.")[0] : null,
  ].filter(Boolean);
  for (const itemUuid of itemUuids) {
    const item = await fromUuid(itemUuid).catch(() => null);
    if (accepts(item)) return item;
  }

  const originDocument = effect?.origin
    ? await fromUuid(effect.origin).catch(() => null)
    : null;
  if (accepts(originDocument)) return originDocument;

  const originActivityUuid = originDocument?.flags?.dae?.activity;
  const originItemUuids = [
    originDocument?.flags?.[MODULE_ID]?.sourceItemUuid,
    originDocument?.flags?.["midi-qol"]?.castData?.itemUuid,
    originDocument?.flags?.dnd5e?.item?.uuid,
    originDocument?.flags?.core?.sourceId,
    typeof originActivityUuid === "string" ? originActivityUuid.split(".Activity.")[0] : null,
  ].filter(Boolean);
  for (const itemUuid of originItemUuids) {
    const item = await fromUuid(itemUuid).catch(() => null);
    if (accepts(item)) return item;
  }
  return null;
}

function appliedDamageFromMidiContext(data) {
  const damageItem = data?.damageItem ?? data?.ditem;
  return (
    Math.max(0, Number(damageItem?.hpDamage ?? 0))
    + Math.max(0, Number(damageItem?.tempDamage ?? 0))
  );
}

function damageTriggeredRepeatSaveEffects(actor) {
  return Array.from(actor?.effects ?? []).filter(effect => {
    if (
      effect.disabled === true
      || effect.active === false
      || effect.isSuppressed === true
    ) return false;
    const contract = arcaneEffectFlag(effect, "damageTriggeredRepeatSave");
    return contract && typeof contract === "object" && contract.activityIdentifier;
  });
}

function claimDamageTriggeredRepeatSave(workflow, effect, actor) {
  if (!workflow || typeof workflow !== "object") return true;
  let claims = DAMAGE_TRIGGERED_REPEAT_SAVE_STATES.get(workflow);
  if (!claims) {
    claims = new Set();
    DAMAGE_TRIGGERED_REPEAT_SAVE_STATES.set(workflow, claims);
  }
  const key = effect.uuid ?? actor?.uuid + "." + effect.id;
  if (claims.has(key)) return false;
  claims.add(key);
  return true;
}

async function applyDamageTriggeredRepeatSave(token, data) {
  const targetToken = token?.object ?? token;
  const actor = targetToken?.actor ?? token?.actor;
  if (!actor || !targetToken?.document || appliedDamageFromMidiContext(data) <= 0) return true;

  for (const effect of damageTriggeredRepeatSaveEffects(actor)) {
    if (!claimDamageTriggeredRepeatSave(data?.workflow, effect, actor)) continue;
    const contract = arcaneEffectFlag(effect, "damageTriggeredRepeatSave");
    const sourceItem = await sourceItemForTriggeredEffect(effect);
    const activity = Array.from(sourceItem?.system?.activities ?? []).find(candidate =>
      candidate.midiProperties?.identifier === contract.activityIdentifier
    );
    if (!sourceItem || !activity) {
      console.warn(
        "[" + MODULE_ID + "] Damage-triggered repeat save is missing activity "
        + String(contract.activityIdentifier ?? "<unknown>"),
      );
      continue;
    }

    const rollMode = contract.rollMode
      ?? (contract.advantage === true ? "advantage" : "normal");
    const ability = String(contract.ability ?? "");
    const rollModeOptions = ["advantage", "disadvantage"].includes(rollMode)
      ? { [rollMode]: true }
      : {};
    const [rollModeEffect] = rollMode === "normal"
      ? [null]
      : await actor.createEmbeddedDocuments("ActiveEffect", [{
          name: sourceItem.name + ": Repeat Save " + rollMode,
          img: sourceItem.img,
          origin: sourceItem.uuid,
          transfer: false,
          disabled: false,
          changes: [{
            key: "flags.midi-qol." + rollMode + ".ability.save." + ability,
            mode: 5,
            value: "true",
            priority: 99,
          }],
          flags: {
            [MODULE_ID]: {
              temporaryRepeatSaveRollMode: {
                mode: rollMode,
                ability,
              },
            },
          },
        }]);
    let result = null;
    try {
      result = await MidiQOL.completeActivityUse(activity, {
        concentration: { begin: false },
        midiOptions: {
          noUseWarning: true,
          ...rollModeOptions,
          targetUuids: [targetToken.document.uuid],
          targetsToUse: new Set([targetToken]),
          ignoreUserTargets: true,
          fastForward: true,
          workflowOptions: {
            ...rollModeOptions,
            targetUuids: [targetToken.document.uuid],
          },
        },
      }).catch(error => {
        console.warn("[" + MODULE_ID + "] Damage-triggered repeat save failed", error);
        return null;
      });
    } finally {
      if (rollModeEffect?.id && actor.effects?.get?.(rollModeEffect.id)) {
        await actor.deleteEmbeddedDocuments("ActiveEffect", [rollModeEffect.id]);
      }
    }
    const saved = Array.from(result?.saves ?? []).some(savedTarget =>
      savedTarget?.actor?.uuid === actor.uuid
    );
    if (
      saved
      && contract.removesOnSave === true
      && actor.effects?.get?.(effect.id)
    ) {
      await actor.deleteEmbeddedDocuments("ActiveEffect", [effect.id]);
    }
  }
  return true;
}

function declaredRidersFromUse(usageConfig, workflow) {
  const candidates = [
    usageConfig?.arcaneDeclaredRiders,
    usageConfig?.declaredRiders,
    usageConfig?.midiOptions?.arcaneDeclaredRiders,
    usageConfig?.midiOptions?.workflowOptions?.arcaneDeclaredRiders,
    workflow?.options?.arcaneDeclaredRiders,
    workflow?.workflowOptions?.arcaneDeclaredRiders,
  ];
  return candidates.find(candidate => Array.isArray(candidate)) ?? [];
}

function declaredRider(usageConfig, workflow, identifiers) {
  const wanted = new Set((Array.isArray(identifiers) ? identifiers : [identifiers]).filter(Boolean));
  return declaredRidersFromUse(usageConfig, workflow).find(rider =>
    wanted.has(rider?.id) || wanted.has(rider?.identifier)
  );
}

function declaredDivineSmiteRider(usageConfig, workflow) {
  return declaredRider(usageConfig, workflow, DIVINE_SMITE_IDENTIFIER);
}

function declaredSneakAttackRider(usageConfig, workflow) {
  return declaredRider(usageConfig, workflow, SNEAK_ATTACK_IDENTIFIER);
}

function declaredDreadAmbusherRider(usageConfig, workflow) {
  return declaredRider(usageConfig, workflow, DREAD_AMBUSHER_IDENTIFIER);
}

// Compiler-owned spell riders are intentionally not mirrored here. A missing
// compiler contract must fail visibly instead of falling through to a partial
// spell-id-specific implementation.
const DECLARED_WEAPON_SPELL_RIDERS = {};

function compilerRiderDamageFormula(damage, slotLevel, minSlotLevel) {
  const formula = String(damage?.formula ?? "").trim();
  if (!formula || damage?.scaling?.mode !== "slot-level") return formula;
  const perLevel = Math.max(0, Number(damage.scaling.number) || 0);
  const extraDice = Math.max(0, Number(slotLevel) - Number(minSlotLevel)) * perLevel;
  if (!extraDice) return formula;
  return formula.replace(/(\d+)d(\d+)/i, (_, dice, faces) =>
    String(Number(dice) + extraDice) + "d" + faces
  );
}

function compilerDeclaredWeaponSpellRider(actor, usageConfig, workflow) {
  let matched = null;
  for (const rider of declaredRidersFromUse(usageConfig, workflow)) {
    const identifier = String(rider?.id ?? rider?.identifier ?? "").trim();
    if (!identifier) continue;
    const spellItem = actor?.items?.find(candidate =>
      candidate.type === "spell"
      && candidate.flags?.[MODULE_ID]?.compiler?.version
      && candidate.flags?.[MODULE_ID]?.declaredWeaponSpellRider?.identifier === identifier
    );
    if (!spellItem) continue;

    const contract = spellItem.flags[MODULE_ID].declaredWeaponSpellRider;
    const damageTypes = Array.from(contract.damage?.types ?? []).filter(Boolean);
    if (
      contract.damage
      && (!contract.damage.formula || damageTypes.length !== 1)
    ) {
      throw new Error(identifier + " compiler rider has an invalid parent damage contract");
    }
    if (!contract.damage && !contract.saveActivityIdentifier) {
      throw new Error(identifier + " compiler rider has no parent damage or post-hit activity");
    }
    if (matched) {
      throw new Error(
        "Only one compiler spell-slot-on-hit rider may resolve on one attack",
      );
    }
    const firstEffect = Array.from(spellItem.effects ?? [])[0];
    const minSlotLevel = Math.max(1, Number(contract.minSpellLevel) || Number(spellItem.system?.level) || 1);
    matched = {
      rider,
      spellItem,
      spec: {
        aliases: [identifier],
        itemIdentifiers: [spellItem.system?.identifier],
        name: spellItem.name,
        minSlotLevel,
        attackType: contract.attackType ?? "weapon",
        ...(contract.damage
          ? {
              damageType: damageTypes[0],
              damageFormula: slotLevel => compilerRiderDamageFormula(
                contract.damage,
                slotLevel,
                minSlotLevel,
              ),
            }
          : {
              damageType: null,
              damageFormula: () => null,
            }),
        ...(contract.appliesEffect
          ? {
              effect: {
                name: firstEffect?.name ?? spellItem.name,
                durationSeconds: Number(firstEffect?.duration?.seconds ?? 60) || 60,
              },
            }
          : {}),
        ...(contract.saveActivityIdentifier
          ? { saveActivityIdentifier: contract.saveActivityIdentifier }
          : {}),
        requiresBonusAction: contract.requiresBonusAction === true,
        compilerContract: true,
      },
    };
  }
  return matched;
}

function declaredWeaponSpellRider(usageConfig, workflow, actor) {
  const compilerMatch = compilerDeclaredWeaponSpellRider(actor, usageConfig, workflow);
  if (compilerMatch) return compilerMatch;
  for (const spec of Object.values(DECLARED_WEAPON_SPELL_RIDERS)) {
    const rider = declaredRider(usageConfig, workflow, spec.aliases);
    if (rider) return { rider, spec };
  }
  return null;
}

function workflowHitTargets(workflow) {
  const hitTargets = workflow?.hitTargets;
  if (hitTargets instanceof Set) return Array.from(hitTargets).filter(target => target?.actor);
  if (Array.isArray(hitTargets)) return hitTargets.filter(target => target?.actor);
  return [];
}

function effectHostHitTargets(workflow) {
  const targets = [
    ...Array.from(workflow?.hitTargets ?? []),
    ...Array.from(workflow?.hitTargetsEC ?? []),
  ].filter(target => target?.actor);
  const unique = new Map();
  for (const target of targets) {
    const key = target?.document?.uuid ?? target?.uuid ?? target?.id;
    if (key && !unique.has(key)) unique.set(key, target);
  }
  return [...unique.values()];
}

function isMeleeWeaponWorkflow(workflow) {
  return workflow?.item?.type === "weapon"
    && ["mwak", "melee"].includes(workflowActionType(workflow));
}

function isMeleeWeaponAttack(item, activity) {
  if (item?.type !== "weapon") return false;
  const weaponType = item.system?.type?.value ?? item.system?.type;
  const attackType = activityAttackType(activity);
  const classification = String(attackType.classification ?? "").toLowerCase();
  const value = String(attackType.value ?? item.system?.actionType ?? "").toLowerCase();
  if (classification && classification !== "weapon") return false;
  if (value) return ["melee", "mwak"].includes(value);
  return ["simpleM", "martialM"].includes(String(weaponType));
}

function isRangedWeaponItem(item) {
  if (item?.type !== "weapon") return false;
  const weaponType = item.system?.type?.value ?? item.system?.type;
  return ["simpleR", "martialR"].includes(String(weaponType));
}

function activityAttackType(activity) {
  const type = activity?.attack?.type ?? {};
  if (typeof type === "string") return { value: type, classification: "" };
  return {
    value: type.value ?? activity?.attack?.value ?? "",
    classification: type.classification ?? activity?.attack?.classification ?? "",
  };
}

function isRangedWeaponAttack(item, activity) {
  if (!isRangedWeaponItem(item)) return false;
  const attackType = activityAttackType(activity);
  const classification = String(attackType.classification ?? "").toLowerCase();
  const value = String(attackType.value ?? "").toLowerCase();
  if (classification && classification !== "weapon") return false;
  if (value && !["ranged", "rwak"].includes(value)) return false;
  return true;
}

function isWeaponWorkflow(workflow) {
  return workflow?.item?.type === "weapon";
}

function workflowActionType(workflow) {
  const activity = workflow?.activity;
  const attackMode =
    workflow?.attackMode
    ?? workflow?.options?.attackMode
    ?? workflow?.workflowOptions?.attackMode
    ?? "";
  if (typeof activity?.getActionType === "function") {
    const resolved = String(activity.getActionType(attackMode) ?? "")
      .trim()
      .toLowerCase();
    if (resolved) return resolved;
  }
  const attackType = activityAttackType(activity);
  const value = String(
    activity?.actionType
    ?? attackType.value
    ?? workflow?.item?.system?.actionType
    ?? "",
  ).trim().toLowerCase();
  if (value === "melee") return "mwak";
  if (value === "ranged") return "rwak";
  return value;
}

function isRangedWeaponWorkflow(workflow) {
  return isWeaponWorkflow(workflow)
    && ["rwak", "ranged"].includes(workflowActionType(workflow));
}

function workflowTargetTokens(workflow) {
  const targets = workflow?.targets;
  if (targets instanceof Set) return Array.from(targets).filter(target => target?.actor);
  if (Array.isArray(targets)) return targets.filter(target => target?.actor);
  return [];
}

function workflowExplicitlyMissed(workflow) {
  return workflow?.isHit === false || workflow?.hit === false;
}

function confirmedHitTargets(workflow) {
  const hitTargets = workflowHitTargets(workflow);
  if (hitTargets.length) return hitTargets;
  if (workflowExplicitlyMissed(workflow)) return [];
  if (!workflowDamageRolls(workflow).length && !workflow?.damageRoll) return [];
  return workflowTargetTokens(workflow);
}

function weaponSpellRiderAttackAllowed(workflow, spec) {
  if (spec.attackType === "melee") return isMeleeWeaponWorkflow(workflow);
  if (spec.attackType === "ranged") return isRangedWeaponWorkflow(workflow);
  return isWeaponWorkflow(workflow);
}

function attackRollContext(configOrWorkflow) {
  const subject = configOrWorkflow?.subject;
  const activity = configOrWorkflow?.activity
    ?? subject?.activity
    ?? (subject?.type === "attack" ? subject : null);
  const item = configOrWorkflow?.item
    ?? activity?.item
    ?? subject?.item
    ?? subject?.item?.document
    ?? null;
  const actor = configOrWorkflow?.actor
    ?? item?.actor
    ?? subject?.actor
    ?? null;
  return { actor, item, activity };
}

function addAttackRollPart(config, part) {
  let applied = false;
  for (const roll of config?.rolls ?? []) {
    roll.parts ??= [];
    roll.parts.push(part);
    applied = true;
  }
  config.parts ??= [];
  config.parts.push(part);
  return applied || true;
}

function isSceneSunlit(token) {
  const scene = token?.document?.parent ?? canvas.scene;
  const explicit = scene?.getFlag?.(MODULE_ID, "sunlight");
  if (explicit === true) return true;
  if (explicit === false) return false;
  return false;
}

function applySunlightSensitivityAttack(config, dialog, message) {
  const { actor } = attackRollContext(config);
  if (!actorHasFeature(actor, DROW_SUNLIGHT_SENSITIVITY_IDENTIFIER)) return false;
  if (!isSceneSunlit(findSourceToken(actor))) return false;
  config.disadvantage = true;
  message.data ??= {};
  message.data.flags ??= {};
  message.data.flags[MODULE_ID] = {
    ...(message.data.flags[MODULE_ID] ?? {}),
    sunlightSensitivity: true,
  };
  return true;
}

function propertyValues(collection) {
  if (!collection) return [];
  if (collection instanceof Set) return Array.from(collection);
  if (Array.isArray(collection)) return collection;
  if (typeof collection === "object") {
    return Object.entries(collection)
      .filter(([, value]) => value === true || value === "true" || value === 1)
      .map(([key]) => key);
  }
  return [];
}

function itemHasProperty(item, aliases) {
  const wanted = new Set(aliases.map(alias => String(alias).toLowerCase()));
  return propertyValues(item?.system?.properties).some(value => wanted.has(String(value).toLowerCase()));
}

function isItemEquipped(item) {
  return item?.system?.equipped === true || item?.system?.equipped?.value === true || item?.system?.equipped === undefined;
}

function equippedWeapons(actor) {
  return Array.from(actor?.items ?? []).filter(item => item.type === "weapon" && isItemEquipped(item));
}

function hasOtherEquippedWeapon(actor, currentItem) {
  return equippedWeapons(actor).some(item => item.id !== currentItem?.id);
}

function hasEquippedShield(actor) {
  return Array.from(actor?.items ?? []).some(item => {
    if (!isItemEquipped(item)) return false;
    const armor = item.system?.armor ?? {};
    const type = armor.type ?? item.system?.type?.value ?? item.system?.type;
    return item.type === "equipment" && /shield|盾/i.test(String(type) + " " + item.name);
  });
}

function explicitWeaponUse(workflow) {
  const rolls = [
    workflow?.damageRoll,
    ...(Array.isArray(workflow?.damageRolls) ? workflow.damageRolls : []),
  ].filter(Boolean);
  const candidates = [
    workflow?.options?.weaponUse,
    workflow?.workflowOptions?.weaponUse,
    workflow?.midiOptions?.workflowOptions?.weaponUse,
    workflow?.attackMode,
    workflow?.rollOptions?.attackMode,
    workflow?.options?.attackMode,
    workflow?.workflowOptions?.attackMode,
    ...rolls.map(roll => roll?.options?.attackMode),
  ].filter(value => value !== undefined && value !== null);

  const versatileCandidates = [
    workflow?.options?.versatile,
    workflow?.workflowOptions?.versatile,
    workflow?.midiOptions?.workflowOptions?.versatile,
    ...rolls.map(roll => roll?.options?.versatile),
  ];
  if (versatileCandidates.some(value => value === true || value === "true")) return "two-handed";

  for (const candidate of candidates) {
    const value = String(candidate).toLowerCase();
    if (["two-handed", "twohanded", "two_handed", "two handed", "versatile"].includes(value)) return "two-handed";
    if (["one-handed", "onehanded", "one_handed", "one handed"].includes(value)) return "one-handed";
  }

  return null;
}

function isVersatileTwoHandedUse(workflow) {
  const explicit = explicitWeaponUse(workflow);
  if (explicit) return explicit === "two-handed";
  const actor = workflow?.actor;
  if (hasEquippedShield(actor)) return false;
  if (hasOtherEquippedWeapon(actor, workflow?.item)) return false;
  return true;
}

function isDuelingEligible(workflow) {
  const actor = workflow?.actor;
  const item = workflow?.item;
  if (!actorHasFeature(actor, DUELING_IDENTIFIER)) return false;
  if (!isMeleeWeaponWorkflow(workflow)) return false;
  if (itemHasProperty(item, ["two", "two-handed", "twoHanded"])) return false;
  if (hasOtherEquippedWeapon(actor, item)) return false;
  if (itemHasProperty(item, ["ver", "versatile"]) && isVersatileTwoHandedUse(workflow)) return false;
  return true;
}

function isGreatWeaponFightingEligible(workflow) {
  const actor = workflow?.actor;
  const item = workflow?.item;
  if (!actorHasFeature(actor, GREAT_WEAPON_FIGHTING_IDENTIFIER)) return false;
  if (!isMeleeWeaponWorkflow(workflow)) return false;
  if (itemHasProperty(item, ["two", "two-handed", "twoHanded"])) return true;
  if (itemHasProperty(item, ["ver", "versatile"])) return isVersatileTwoHandedUse(workflow);
  return false;
}

function workflowDamageRolls(workflow) {
  if (Array.isArray(workflow?.damageRolls) && workflow.damageRolls.length) return workflow.damageRolls.filter(Boolean);
  return workflow?.damageRoll ? [workflow.damageRoll] : [];
}

function isArcaneExtraDamageRoll(roll) {
  return roll?.options?.[MODULE_ID]?.damageRole === "extra";
}

function workflowDamageType(workflow) {
  const detail = workflow?.damageDetail ?? workflow?.rawDamageDetail ?? [];
  const type = Array.isArray(detail) ? detail.find(entry => entry?.type)?.type : null;
  if (type) return type;
  const activityPart = Object.values(workflow?.activity?.damage?.parts ?? {})[0];
  const itemPart = Array.isArray(workflow?.item?.system?.damage?.parts) ? workflow.item.system.damage.parts[0] : null;
  return activityPart?.types?.[0] ?? itemPart?.[1] ?? workflow?.defaultDamageType ?? "slashing";
}

function arcaneExtraDamageItemData(workflow, segment, damageType, flavor) {
  const itemId = segment.riderId ?? segment.id ?? "arcane-extra-damage";
  const name = segment.name ?? flavor ?? "Arcane Extra Damage";
  return {
    name,
    type: "feat",
    img: segment.img ?? workflow?.item?.img ?? "icons/svg/dice-target.svg",
    system: { actionType: "other", save: { type: "" } },
    flags: {
      [MODULE_ID]: {
        damageRole: "extra",
        riderId: itemId,
        parentWorkflowId:
          segment.parentWorkflowId ?? workflow?.id ?? workflow?.uuid,
        parentItemCardId: workflow?.itemCardId,
        sourceItemUuid: workflow?.item?.uuid,
        sourceEffectUuid: segment.sourceEffectUuid,
        resource: segment.resource,
        damageType,
      },
    },
  };
}

function messageArcaneFlags(message) {
  const direct = message?.flags?.[MODULE_ID];
  if (direct) return direct;
  const midiFlags = message?.flags?.["midi-qol"] ?? {};
  const dnd5eFlags = message?.flags?.dnd5e ?? {};
  return midiFlags?.item?.flags?.[MODULE_ID]
    ?? dnd5eFlags?.item?.flags?.[MODULE_ID]
    ?? message?.item?.flags?.[MODULE_ID]
    ?? {};
}

function messageUndoDamage(message) {
  const dashed = message?.flags?.["midi-qol"]?.undoDamage;
  if (Array.isArray(dashed)) return dashed;
  const compact = message?.flags?.midiqol?.undoDamage;
  return Array.isArray(compact) ? compact : [];
}

function damageSegmentLabel(segment) {
  if (segment.riderId === DIVINE_SMITE_IDENTIFIER) return "Divine Smite";
  if (segment.riderId === SNEAK_ATTACK_IDENTIFIER) return "Sneak Attack";
  if (segment.riderId === "hunters-mark") return "Hunter's Mark";
  if (segment.riderId === DREAD_AMBUSHER_IDENTIFIER) return "Dread Ambusher";
  if (segment.role === "weapon") return segment.itemName ?? "Weapon";
  return segment.label ?? segment.riderId ?? "Damage";
}

function damageTargetUuid(target) {
  return target?.document?.uuid ?? target?.uuid ?? target?.actor?.uuid;
}

function damageTargetUuids(target) {
  return [...new Set([
    target?.document?.uuid,
    target?.uuid,
    target?.actor?.uuid,
    target?.document?.actor?.uuid,
  ].map(value => String(value ?? "").trim()).filter(Boolean))];
}

function normalizeDamageType(type) {
  const value = String(type ?? "").trim().toLowerCase();
  if (!value) return "";
  const localized = {
    "\u5149\u8000": "radiant",
    "\u5288\u780d": "slashing",
    "\u523a\u7a7f": "piercing",
    "\u949d\u51fb": "bludgeoning",
  };
  return localized[value] ?? value;
}

function normalizeFormula(formula) {
  return String(formula ?? "").replace(/\s+/g, "").replace(/^\+/, "").toLowerCase();
}

function pendingDamageSegmentsForItemCard(itemCardId) {
  if (!itemCardId) return [];
  const pending = PENDING_DAMAGE_SEGMENTS.get(itemCardId);
  return Array.isArray(pending) ? pending : [];
}

function registerPendingDamageSegment(workflow, segment, roll, damageType, flavor, targets) {
  const itemCardId = workflow?.itemCardId;
  if (!itemCardId) return [];
  const entries = pendingDamageSegmentsForItemCard(itemCardId);
  const targetUuids = Array.from(new Set(
    Array.from(targets ?? []).flatMap(damageTargetUuids),
  ));
  const entry = {
    riderId: segment.riderId ?? segment.id,
    label: segment.label ?? segment.name ?? flavor,
    formula: roll?.formula ?? String(segment.formula ?? ""),
    normalizedFormula: normalizeFormula(roll?.formula ?? segment.formula),
    total: Number(roll?.total ?? 0),
    damageType,
    normalizedDamageType: normalizeDamageType(damageType),
    targetUuids,
    sourceEffectUuid: segment.sourceEffectUuid,
    resource: segment.resource,
    isCritical: Boolean(segment.isCritical),
    parentItemCardId: itemCardId,
    parentWorkflowId: workflow?.uuid ?? workflow?.id ?? null,
    sourceItemUuid: segment.sourceItemUuid ?? workflow?.item?.uuid ?? null,
    damageCorrelationId: segment.damageCorrelationId ?? null,
    registeredAt: Date.now(),
    knownMessageIds: new Set(
      Array.from(game.messages ?? []).map(message => message?.id).filter(Boolean),
    ),
    consumed: false,
  };
  entries.push(entry);
  PENDING_DAMAGE_SEGMENTS.set(itemCardId, entries);
  return [entry];
}

function delay(ms) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

function undoDamageTargetUuids(entry) {
  return [...new Set([
    entry?.targetUuid,
    entry?.tokenUuid,
    entry?.actorUuid,
    entry?.damageItem?.targetUuid,
    entry?.damageItem?.tokenUuid,
    entry?.damageItem?.actorUuid,
  ].map(value => String(value ?? "").trim()).filter(Boolean))];
}

function damageMessageMatchesPendingSegment(message, pendingSegment) {
  if (!pendingSegment) return false;
  if (!damageMessageBelongsToPendingSegment(message, pendingSegment)) return false;
  if (String(pendingSegment.damageCorrelationId ?? "").trim()) {
    return messageUndoDamage(message).some(entry =>
      undoDamageTargetUuids(entry).some(uuid =>
        pendingSegment.targetUuids?.includes(uuid)
      )
    );
  }
  for (const entry of messageUndoDamage(message)) {
    const details = damageSummaryDetailsForEntry(entry);
    if (details.some(detail => pendingSegmentScore({ ...pendingSegment, consumed: false }, detail, entry) >= 5)) return true;
  }
  return false;
}

async function waitForPendingDamageSegments(pendingSegments, timeoutMs = 5000) {
  const wanted = Array.from(pendingSegments ?? []).filter(Boolean);
  if (!wanted.length) return true;
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const messages = Array.from(game.messages ?? []);
    const allMatched = wanted.every(pendingSegment =>
      messages.some(message => damageMessageMatchesPendingSegment(message, pendingSegment))
    );
    if (allMatched) return true;
    await delay(100);
  }
  console.warn("[" + MODULE_ID + "] Timed out waiting for extra damage HP card", wanted);
  return false;
}

function pendingSegmentScore(pending, detail, entry) {
  if (!pending || pending.consumed) return -1;
  let score = 0;
  const applied = Number(
    detail?.damage
    ?? detail?.value
    ?? entry?.totalDamage
    ?? entry?.hpDamage
    ?? entry?.damageItem?.totalDamage
    ?? entry?.damageItem?.hpDamage
    ?? 0,
  );
  if (Number.isFinite(applied) && applied === Number(pending.total)) score += 5;
  const targetUuids = undoDamageTargetUuids(entry);
  if (targetUuids.some(uuid => pending.targetUuids?.includes(uuid))) score += 4;
  const detailFormula = normalizeFormula(detail?.formula);
  if (detailFormula && pending.normalizedFormula && detailFormula !== pending.normalizedFormula) return -1;
  if (detailFormula && detailFormula === pending.normalizedFormula) score += 6;
  const detailType = normalizeDamageType(detail?.type ?? detail?.damageType);
  if (detailType && pending.normalizedDamageType && detailType === pending.normalizedDamageType) score += 2;
  return score;
}

function matchPendingDamageSegment(pendingSegments, detail, entry) {
  let best = null;
  let bestScore = 0;
  for (const pending of pendingSegments ?? []) {
    const score = pendingSegmentScore(pending, detail, entry);
    if (score > bestScore) {
      best = pending;
      bestScore = score;
    }
  }
  if (!best || bestScore < 5) return null;
  best.consumed = true;
  return best;
}

function damageSummaryDetailsForEntry(entry) {
  const candidates = [
    entry?.damageDetails?.combinedDamage,
    entry?.damageDetail,
    entry?.rawDamageDetail,
    entry?.damageItem?.damageDetails?.combinedDamage,
    entry?.damageItem?.damageDetail,
    entry?.damageItem?.rawDamageDetail,
  ];
  for (const candidate of candidates) {
    if (!Array.isArray(candidate) || candidate.length === 0) continue;
    const details = candidate.flat(Infinity).filter(detail =>
      detail && typeof detail === "object" && !Array.isArray(detail)
    );
    if (details.length) return details;
  }
  return [entry?.damageItem ?? entry];
}

function damageSummaryAppliedValues(entry, details) {
  const values = Array.from(details ?? []).map(detail => {
    const value = Number(detail?.value ?? detail?.damage ?? 0);
    return Number.isFinite(value) ? value : 0;
  });
  const appliedTotal = Number(
    entry?.totalDamage
    ?? entry?.healingAdjustedTotalDamage
    ?? entry?.hpDamage
    ?? entry?.damageItem?.totalDamage
    ?? entry?.damageItem?.healingAdjustedTotalDamage
    ?? entry?.damageItem?.hpDamage,
  );
  if (!Number.isFinite(appliedTotal) || values.length === 0) return values;
  if (values.length === 1) return [appliedTotal];

  const truncated = values.map(value => Math.trunc(value));
  let remainder = Math.trunc(appliedTotal - truncated.reduce((sum, value) => sum + value, 0));
  const order = values
    .map((value, index) => ({ index, fraction: Math.abs(value - Math.trunc(value)) }))
    .sort((left, right) => right.fraction - left.fraction || left.index - right.index);
  for (let offset = 0; remainder !== 0 && order.length; offset += 1) {
    const index = order[offset % order.length].index;
    const step = remainder > 0 ? 1 : -1;
    truncated[index] += step;
    remainder -= step;
  }
  return truncated;
}

function damageSummarySegmentFromUndo(message, entry, detail, pendingSegment = null, appliedOverride = null) {
  const arcaneFlags = messageArcaneFlags(message);
  const calcMidi = entry?.calcDamageOptions?.midi ?? {};
  const role = pendingSegment || arcaneFlags.damageRole === "extra" ? "rider" : "weapon";
  const rolledTotal = Number(detail?.damage ?? detail?.value ?? entry?.rawTotalDamage ?? 0);
  const appliedTotal = Number(appliedOverride ?? detail?.value ?? entry?.totalDamage ?? entry?.hpDamage ?? 0);
  const segment = {
    role,
    riderId: pendingSegment?.riderId ?? arcaneFlags.riderId,
    formula: detail?.formula ?? "",
    type: detail?.type ?? detail?.damageType ?? pendingSegment?.damageType ?? arcaneFlags.damageType,
    applied: appliedTotal,
    total: rolledTotal,
    messageId: message?.id,
    targetUuid: entry?.targetUuid ?? entry?.tokenUuid,
    actorUuid: entry?.actorUuid,
    oldHP: entry?.oldHP,
    newHP: entry?.newHP,
    resource: pendingSegment?.resource ?? arcaneFlags.resource,
    sourceEffectUuid: pendingSegment?.sourceEffectUuid ?? arcaneFlags.sourceEffectUuid,
    damageType: pendingSegment?.damageType ?? arcaneFlags.damageType,
    parentWorkflowId: arcaneFlags.parentWorkflowId,
    parentItemCardId: arcaneFlags.parentItemCardId,
    itemType: calcMidi.itemType,
    isCritical: Boolean(pendingSegment?.isCritical),
  };
  if (pendingSegment?.label) segment.label = pendingSegment.label;
  segment.label = damageSegmentLabel(segment);
  return segment;
}

function damageSummarySegmentsForMessage(message, pendingSegments = []) {
  const segments = [];
  for (const entry of messageUndoDamage(message)) {
    const details = damageSummaryDetailsForEntry(entry);
    const appliedValues = damageSummaryAppliedValues(entry, details);
    for (const [index, detail] of details.entries()) {
      segments.push(damageSummarySegmentFromUndo(
        message,
        entry,
        detail,
        matchPendingDamageSegment(pendingSegments, detail, entry),
        appliedValues[index],
      ));
    }
  }
  return segments.filter(segment => Number.isFinite(segment.applied) && segment.applied !== 0);
}

function damageSummaryMessagesForItemCard(itemCardId) {
  return Array.from(game.messages ?? []).filter(message =>
    message?.getFlag?.(MODULE_ID, DAMAGE_SUMMARY_FLAG)?.parentItemCardId === itemCardId
  );
}

async function createDamageSummaryForItemCard(itemCardId) {
  if (!itemCardId || damageSummaryMessagesForItemCard(itemCardId).length) return false;
  const messages = Array.from(game.messages ?? []);
  const itemIndex = messages.findIndex(message => message.id === itemCardId);
  if (itemIndex < 0) return false;
  const itemMessage = messages[itemIndex];
  const related = messages.slice(itemIndex + 1, itemIndex + 12);
  const pendingSegments = pendingDamageSegmentsForItemCard(itemCardId).map(segment => ({ ...segment, consumed: false }));
  const segments = related.flatMap(message => damageSummarySegmentsForMessage(message, pendingSegments))
    .filter(segment => !segment.parentItemCardId || segment.parentItemCardId === itemCardId);
  if (segments.length < 2) return false;

  const totalApplied = segments.reduce((sum, segment) => sum + (Number(segment.applied) || 0), 0);
  const targetTokenUuids = Array.from(new Set(segments.map(segment => segment.targetUuid).filter(Boolean)));
  const sourceActorUuid = itemMessage?.speaker?.actor ? "Actor." + itemMessage.speaker.actor : undefined;
  const rows = segments.map(segment =>
    "<li><strong>" + damageSegmentLabel(segment) + ":</strong> "
    + (segment.formula || "?") + " = " + segment.applied + " " + (segment.type ?? "") + "</li>"
  ).join("");
  await ChatMessage.create({
    user: game.user?.id,
    speaker: itemMessage?.speaker,
    flags: {
      [MODULE_ID]: {
        [DAMAGE_SUMMARY_FLAG]: {
          type: DAMAGE_SUMMARY_TYPE,
          parentItemCardId: itemCardId,
          parentWorkflowId: itemMessage?.flags?.["midi-qol"]?.workflowId ?? itemMessage?.uuid,
          sourceTokenId: itemMessage?.speaker?.token,
          sourceActorUuid,
          targetTokenUuids,
          segments,
          totalApplied,
        },
      },
    },
    content: "<div class=\"arcane-damage-summary\"><h3>Damage Summary</h3><ul>" + rows
      + "</ul><p><strong>Total:</strong> " + totalApplied + "</p></div>",
  });
  PENDING_DAMAGE_SEGMENTS.delete(itemCardId);
  DAMAGE_SUMMARY_TIMERS.delete(itemCardId);
  return true;
}

function scheduleDamageSummaryForWorkflow(workflow, delay = 1800) {
  const itemCardId = workflow?.itemCardId;
  if (!itemCardId) return;
  const existing = DAMAGE_SUMMARY_TIMERS.get(itemCardId);
  if (existing) window.clearTimeout(existing);
  const timer = window.setTimeout(() => {
    DAMAGE_SUMMARY_TIMERS.delete(itemCardId);
    createDamageSummaryForItemCard(itemCardId).catch(error => {
      console.warn(`[${MODULE_ID}] Damage summary creation failed`, error);
    });
  }, delay);
  DAMAGE_SUMMARY_TIMERS.set(itemCardId, timer);
}

async function applyExtraDamageSegment(workflow, segment) {
  const actor = segment.actor ?? workflow?.actor;
  const targets = Array.from(segment.targets ?? confirmedHitTargets(workflow)).filter(target => target?.actor);
  if (!actor || targets.length === 0) return false;
  const formula = String(segment.formula ?? "");
  if (!formula) return false;
  const damageType = segment.damageType ?? workflowDamageType(workflow);
  const flavor = segment.flavor ?? segment.name ?? segment.riderId ?? "Arcane Extra Damage";
  let roll = await new Roll(formula).evaluate();
  const damageScale = compilerWeaponHitDamageScale(workflow);
  if (damageScale < 1) {
    const priorReceipt = workflow?.flags?.[MODULE_ID]?.weaponHitDamageScale;
    const scaled = scaledCompilerDamageRolls(
      [roll],
      damageScale,
      "weapon hit damage scale",
      Number(priorReceipt?.multiplier) === Number(damageScale)
        ? {
            originalTotal: priorReceipt.originalTotal,
            adjustedTotal: priorReceipt.adjustedTotal,
          }
        : {},
    );
    if (scaled.changed) {
      if (scaled.rolls.length !== 1) {
        throw new Error(
          "weapon-hit-damage-scale cannot split one extra damage segment",
        );
      }
      [roll] = scaled.rolls;
    }
    appendCompilerWeaponHitDamageScaleReceipt(
      workflow,
      damageScale,
      "extra:" + String(segment.riderId ?? segment.id ?? "damage"),
      scaled,
    );
  }
  if (game.dice3d) await game.dice3d.showForRoll(roll, game.user);
  const pendingSegments = registerPendingDamageSegment(workflow, segment, roll, damageType, flavor, targets);

  const midi = globalThis.MidiQOL;
  if (typeof midi?.DamageOnlyWorkflow === "function") {
    new midi.DamageOnlyWorkflow(actor, segment.token ?? workflow?.token ?? findSourceToken(actor), roll.total, damageType, targets, roll, {
      flavor,
      itemData: arcaneExtraDamageItemData(workflow, segment, damageType, flavor),
      isCritical: Boolean(segment.isCritical),
    });
    await waitForPendingDamageSegments(pendingSegments);
  } else {
    await ChatMessage.create({
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor }),
      flags: {
        [MODULE_ID]: {
          damageRole: "extra",
          riderId: segment.riderId ?? segment.id,
          parentWorkflowId:
            segment.parentWorkflowId ?? workflow?.id ?? workflow?.uuid,
          parentItemCardId: workflow?.itemCardId,
          sourceEffectUuid: segment.sourceEffectUuid,
          resource: segment.resource,
          damageType,
        },
      },
      content: "<p><strong>" + flavor + ":</strong> " + roll.formula + " = " + roll.total + "</p>",
    });
  }
  return true;
}

async function applyBonusDamageWorkflow(workflow, formula, damageType, flavor, options = {}) {
  return applyExtraDamageSegment(workflow, {
    ...options,
    formula,
    damageType,
    flavor,
    riderId: options.riderId ?? options.id ?? "bonus-damage",
  });
}

function aasimarRevelationMarker(actor) {
  return Array.from(actor?.effects ?? []).find(effect => effect.getFlag?.(MODULE_ID, AASIMAR_REVELATION_FLAG));
}

function aasimarRevelationDamageType(effect) {
  return effect?.getFlag?.(MODULE_ID, "damageType") ?? effect?.flags?.[MODULE_ID]?.damageType ?? null;
}

async function applyAasimarRevelationFromUse(item, usageConfig, workflow) {
  const identifier = item?.system?.identifier;
  if (![AASIMAR_NECROTIC_SHROUD_IDENTIFIER, AASIMAR_RADIANT_CONSUMPTION_IDENTIFIER, AASIMAR_RADIANT_SOUL_IDENTIFIER].includes(identifier)) {
    return true;
  }

  const actor = workflow?.actor ?? item.actor;
  if (!actor) return true;
  const existing = aasimarRevelationMarker(actor);
  if (existing) await actor.deleteEmbeddedDocuments("ActiveEffect", [existing.id]);

  const effectData = effectDataFromItem(item, effect => effect.getFlag?.(MODULE_ID, AASIMAR_REVELATION_FLAG), actor);
  if (!effectData) return true;
  effectData.flags ??= {};
  effectData.flags[MODULE_ID] = {
    ...(effectData.flags[MODULE_ID] ?? {}),
    sourceActorUuid: actor.uuid,
  };
  await actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
  return true;
}

async function applyDeclaredAasimarRevelationDamage(item, usageConfig, workflow) {
  const rider = declaredRider(usageConfig, workflow, AASIMAR_REVELATION_DAMAGE_IDENTIFIER);
  if (!rider) return true;

  const actor = workflow?.actor ?? item?.actor;
  const marker = aasimarRevelationMarker(actor);
  if (!actor || !marker) {
    await ChatMessage.create({
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor }),
      content: "<p><strong>Aasimar Revelation:</strong> skipped; no active revelation.</p>",
    });
    return true;
  }

  const requestedDamageType = String(rider.damageType ?? aasimarRevelationDamageType(marker) ?? "").toLowerCase();
  const allowedDamageType = String(aasimarRevelationDamageType(marker) ?? "").toLowerCase();
  if (!requestedDamageType || requestedDamageType !== allowedDamageType) {
    await ChatMessage.create({
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor }),
      content: "<p><strong>Aasimar Revelation:</strong> skipped; declared damage type does not match the active revelation.</p>",
    });
    return true;
  }

  const prof = Number(actor.system?.attributes?.prof ?? 0);
  if (!Number.isFinite(prof) || prof <= 0) return true;
  await applyBonusDamageWorkflow(workflow, String(prof), requestedDamageType, `Aasimar Revelation (+${prof} ${requestedDamageType})`);
  return true;
}

function tokenHasAasimarRevelation(token, identifier) {
  return Array.from(token?.actor?.effects ?? []).some(effect => {
    if (!effect.getFlag?.(MODULE_ID, AASIMAR_REVELATION_FLAG)) return false;
    const sourceActorUuid = effect.getFlag(MODULE_ID, "sourceActorUuid");
    const baseActorUuid = game.actors?.get(token.document?.actorId)?.uuid;
    if (!sourceActorUuid || ![token.actor?.uuid, baseActorUuid].includes(sourceActorUuid)) return false;
    return !identifier || effect.getFlag(MODULE_ID, "identifier") === identifier;
  });
}

async function applyRadiantConsumptionTurnEnd(sourceToken) {
  if (!sourceToken?.actor || !tokenHasAasimarRevelation(sourceToken, AASIMAR_RADIANT_CONSUMPTION_IDENTIFIER)) return;
  const prof = Number(sourceToken.actor.system?.attributes?.prof ?? 0);
  if (!Number.isFinite(prof) || prof <= 0) return;
  const targets = Array.from(canvas.tokens?.placeables ?? []).filter(token =>
    token?.actor && distanceBetweenTokens(sourceToken, token) <= 10
  );
  if (!targets.length) return;
  await applyBonusDamageWorkflow({
    actor: sourceToken.actor,
    token: sourceToken,
    hitTargets: new Set(targets),
    itemCardId: null,
  }, String(prof), "radiant", `Radiant Consumption (+${prof} radiant)`);
}

async function applyDuelingDamageBonus(workflow) {
  if (workflow?.flags?.[MODULE_ID]?.duelingApplied || workflow?.__arcaneDuelingApplied) return true;
  if (!isDuelingEligible(workflow)) return true;
  workflow.__arcaneDuelingApplied = true;
  workflow.flags ??= {};
  workflow.flags[MODULE_ID] = {
    ...(workflow.flags[MODULE_ID] ?? {}),
    duelingApplied: true,
  };
  await applyBonusDamageWorkflow(workflow, "2", workflowDamageType(workflow), "Dueling Fighting Style (+2)");
  return true;
}

function effectSourceMatchesActor(effect, actor, token) {
  const sourceActorUuid =
    effect?.getFlag?.(MODULE_ID, "sourceActorUuid")
    ?? effect?.flags?.[MODULE_ID]?.sourceActorUuid
    ?? sourceActorUuidFromOrigin(effect?.origin);
  const baseActorUuid = token?.document?.actorId ? game.actors?.get(token.document.actorId)?.uuid : null;
  return Boolean(sourceActorUuid && [actor?.uuid, baseActorUuid].includes(sourceActorUuid));
}

function actorEffectForCompilerArtifact(actor, artifactId) {
  if (!artifactId) return null;
  return Array.from(actor?.effects ?? []).find(effect =>
    effect.disabled !== true
    && Array.from(arcaneEffectFlag(effect, "compilerArtifactIds") ?? []).includes(artifactId)
  ) ?? null;
}

function parentDamageRiderStates(workflow) {
  let states = PARENT_DAMAGE_RIDER_STATES.get(workflow);
  if (!states) {
    states = [];
    PARENT_DAMAGE_RIDER_STATES.set(workflow, states);
  }
  return states;
}

function workflowItemProperties(workflow, fallback = []) {
  const properties = workflow?.item?.system?.properties;
  if (properties instanceof Set) return Array.from(properties);
  if (Array.isArray(properties)) return [...properties];
  return [...fallback];
}

function prepareParentDamageRiderRoll(workflow, config, {
  riderId,
  formula,
  damageType,
  flavor,
  sourceEffect,
  sourceItem,
  targets,
  properties,
}) {
  if (!workflow || !config || !riderId || !formula || !damageType) return false;
  const sourceEffectUuid = sourceEffect?.uuid;
  const states = parentDamageRiderStates(workflow);
  const riderKey = [riderId, sourceEffectUuid ?? sourceItem?.uuid ?? "source"].join(":");
  if (states.some(state => state.riderKey === riderKey)) return false;
  const rollConfig = {
    parts: [formula],
    data: sourceItem?.getRollData?.()
      ?? workflow?.item?.getRollData?.()
      ?? workflow?.actor?.getRollData?.()
      ?? {},
    options: {
      type: damageType,
      types: [damageType],
      properties: [...new Set(properties ?? [])],
      flavor,
      [MODULE_ID]: {
        damageRole: "extra",
        parentDamageRider: true,
        riderId,
        riderKey,
        sourceItemUuid: sourceItem?.uuid,
        sourceEffectUuid,
        damageType,
      },
    },
  };
  config.rolls = Array.isArray(config.rolls) ? config.rolls : [];
  config.rolls.push(rollConfig);
  states.push({
    riderId,
    riderKey,
    formula,
    damageType,
    flavor,
    sourceEffectUuid,
    targets: [...(targets ?? [])],
    finalized: false,
  });
  return true;
}

function sourceAttackProximityRiderStates(workflow) {
  let states = SOURCE_ATTACK_PROXIMITY_RIDER_STATES.get(workflow);
  if (!states) {
    states = [];
    SOURCE_ATTACK_PROXIMITY_RIDER_STATES.set(workflow, states);
  }
  return states;
}

function sourceAttackTypeAllowed(workflow, activity, attackType) {
  const normalized = String(attackType ?? "any").trim().toLowerCase();
  if ((activity ?? workflow?.activity)?.type !== "attack") return false;
  if (normalized === "any") return true;
  if (normalized === "weapon") return isWeaponWorkflow(workflow);
  if (normalized === "spell") return workflow?.item?.type === "spell";
  return false;
}

async function prepareSourceAttackProximityRider(workflow, activity, config) {
  if (!workflow || !config) return true;
  const actor = workflow.actor ?? activity?.actor;
  const sourceToken = workflow.token ?? findSourceToken(actor);
  const hitTargets = workflowHitTargets(workflow);
  if (!actor || !sourceToken || hitTargets.length !== 1) return true;
  const target = hitTargets[0];

  for (const sourceEffect of activeSourceRuntimeEffects(actor, "sourceAttackProximityRider")) {
    const contract = sourceAttackProximityRiderContract(sourceEffect);
    const runtimeRuleId = String(contract?.runtimeRuleId ?? contract?.ruleId ?? "").trim();
    const range = runtimeContractRangeDistance(contract);
    const damage = contract?.damage;
    const damageTypes = Array.isArray(damage?.types)
      ? damage.types.filter(value => typeof value === "string" && value.trim())
      : [];
    const damageType = String(damage?.damageType ?? damageTypes[0] ?? "").trim();
    const properties = damage?.properties instanceof Set
      ? Array.from(damage.properties)
      : Array.isArray(damage?.properties)
        ? damage.properties
        : ["spell", "mgc"];
    const sourceItem = await sourceItemForCompilerSourceEffect(sourceEffect, actor);
    const formula = sourceEffectDamageFormula(
      damage?.formulaExpression,
      damage?.formula,
      sourceEffect,
      sourceItem,
    );
    if (
      !runtimeRuleId
      || range === null
      || !sourceItem
      || !formula
      || !damageType
      || damageTypes.length > 1
      || !contract.appliedArtifactId
      || !sourceAttackTypeAllowed(workflow, activity, contract.attackType)
      || distanceBetweenTokens(sourceToken, target) > range
      || (damage?.rollIntegration && damage.rollIntegration !== "parent-damage-roll")
      || (damage?.criticalOwner && damage.criticalOwner !== "midi-qol")
    ) continue;

    const prepared = prepareParentDamageRiderRoll(workflow, config, {
      riderId: runtimeRuleId,
      formula,
      damageType,
      flavor: sourceItem.name ?? sourceEffect.name ?? runtimeRuleId,
      sourceEffect,
      sourceItem,
      targets: hitTargets,
      properties,
    });
    if (!prepared) continue;
    const parentState = parentDamageRiderStates(workflow).at(-1);
    sourceAttackProximityRiderStates(workflow).push({
      parentRiderKey: parentState?.riderKey,
      sourceEffect,
      sourceActor: actor,
      sourceItem,
      targets: [...hitTargets],
      appliedArtifactId: contract.appliedArtifactId,
      finalized: false,
    });
  }
  return true;
}

async function prepareMarkedTargetParentDamage(workflow, activity, config) {
  if (!workflow || !config) return true;
  const actor = workflow.actor ?? activity?.actor;
  const hitTargets = workflowHitTargets(workflow);
  // Parent damage rolls apply to the workflow's complete target set. Refuse a
  // mixed multi-target attack rather than leaking marked damage to an
  // unmarked creature.
  if (!actor || hitTargets.length !== 1) return true;
  const target = hitTargets[0];
  const effects = Array.from(target?.actor?.effects ?? []).filter(candidate => {
    const contract = arcaneEffectFlag(candidate, "markedTargetParentDamage");
    return (
      candidate.disabled !== true
      && candidate.active !== false
      && candidate.isSuppressed !== true
      && contract
      && typeof contract === "object"
      && effectSourceMatchesActor(candidate, actor, workflow?.token)
    );
  });
  for (const effect of effects) {
    const contract = arcaneEffectFlag(effect, "markedTargetParentDamage");
    if (!sourceAttackTypeAllowed(workflow, activity, contract.attackType)) {
      continue;
    }
    const sourceItem = await sourceItemForCompilerSourceEffect(effect, actor);
    const formula = sourceEffectDamageFormula(
      contract.formulaExpression,
      contract.formula,
      effect,
      sourceItem,
    );
    const damageType = contract.damageType === "parent-primary"
      ? workflowDamageType(workflow)
      : String(contract.damageType ?? workflowDamageType(workflow));
    prepareParentDamageRiderRoll(workflow, config, {
      riderId:
        arcaneEffectFlag(effect, "identifier")
        ?? contract.runtimeRuleId
        ?? "marked-target-damage",
      formula,
      damageType,
      flavor: effect.name ?? "Marked Target",
      sourceEffect: effect,
      sourceItem,
      targets: hitTargets,
      properties: Array.isArray(contract.properties)
        ? contract.properties
        : workflowItemProperties(workflow),
    });
  }
  return true;
}

function sourceArmedAttackTransformContract(effect) {
  const value = arcaneEffectFlag(effect, "sourceArmedAttackTransform");
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Number(value.version) === 1
    ? value
    : null;
}

function sourceArmedAttackTransformInstance(effect) {
  const value = arcaneEffectFlag(effect, "sourceArmedAttackTransformInstance");
  return value
    && typeof value === "object"
    && !Array.isArray(value)
    && Number(value.version) === 1
    ? value
    : null;
}

async function applySourceArmedAttackTransformFromUse(
  item,
  usageConfig,
  workflow,
) {
  const rules = compilerRuntimeRulesForAdapter(
    item,
    "source-armed-attack-transform-v1",
  ).filter(rule => rule.adapter?.phase === "arm");
  if (!rules.length || !workflow || workflow.aborted === true) return false;
  const actor = workflow.actor ?? item.actor;
  if (!actor) return false;
  const castLevel = spellCastLevel(item, usageConfig, workflow);
  for (const rule of rules) {
    const artifactId = rule.adapter?.artifactId;
    const effect = newestEffect(compilerEffectsForArtifact(
      actor,
      artifactId,
      item,
    ));
    if (!effect || !sourceArmedAttackTransformContract(effect)) {
      throw new Error(
        "source-armed-attack-transform-v1 did not create its ready effect",
      );
    }
    await effect.update({
      ["flags." + MODULE_ID + ".sourceArmedAttackTransformInstance"]: {
        version: 1,
        artifactId,
        sourceActorUuid: actor.uuid,
        sourceItemUuid: item.uuid,
        castLevel,
      },
      ["flags." + MODULE_ID + ".sourceActorUuid"]: actor.uuid,
      ["flags." + MODULE_ID + ".sourceItemUuid"]: item.uuid,
      ["flags." + MODULE_ID + ".castLevel"]: castLevel,
    });
  }
  return true;
}

function releaseSourceArmedAttackTransform(workflow) {
  const state = SOURCE_ARMED_ATTACK_TRANSFORM_STATES.get(workflow);
  const key = state?.reservationKey;
  if (
    key
    && SOURCE_ARMED_ATTACK_TRANSFORM_RESERVATIONS.get(key) === workflow
  ) {
    SOURCE_ARMED_ATTACK_TRANSFORM_RESERVATIONS.delete(key);
  }
  SOURCE_ARMED_ATTACK_TRANSFORM_STATES.delete(workflow);
  return true;
}

function prepareSourceArmedAttackTransformAttack(workflow) {
  if (
    !workflow
    || SOURCE_ARMED_ATTACK_TRANSFORM_STATES.has(workflow)
    || !isRangedWeaponWorkflow(workflow)
  ) return true;
  const actor = workflow.actor;
  if (!actor) return true;
  const effect = newestEffect(Array.from(actor.effects ?? []).filter(candidate =>
    candidate.disabled !== true
    && candidate.active !== false
    && candidate.isSuppressed !== true
    && sourceArmedAttackTransformContract(candidate)
    && sourceArmedAttackTransformInstance(candidate)
  ));
  if (!effect) return true;
  const reservationKey = String(effect.uuid ?? effect.id ?? "");
  if (!reservationKey) return true;
  const owner = SOURCE_ARMED_ATTACK_TRANSFORM_RESERVATIONS.get(reservationKey);
  if (owner && owner !== workflow) return true;
  SOURCE_ARMED_ATTACK_TRANSFORM_RESERVATIONS.set(reservationKey, workflow);
  SOURCE_ARMED_ATTACK_TRANSFORM_STATES.set(workflow, {
    effect,
    contract: sourceArmedAttackTransformContract(effect),
    instance: sourceArmedAttackTransformInstance(effect),
    reservationKey,
    replacementPrepared: false,
    resolved: false,
  });
  return true;
}

async function prepareSourceArmedAttackTransformDamage(workflow, config) {
  const state = SOURCE_ARMED_ATTACK_TRANSFORM_STATES.get(workflow);
  if (!state || state.resolved || !config) return true;
  const hitTargets = workflowHitTargets(workflow);
  if (hitTargets.length !== 1) return true;
  const sourceItem = await sourceItemForCompilerSourceEffect(
    state.effect,
    workflow.actor,
  );
  if (!sourceItem) {
    throw new Error(
      "source-armed-attack-transform-v1 cannot resolve its source spell",
    );
  }
  const damage = state.contract?.hit?.damage;
  const damageType = Array.from(damage?.damageTypes ?? [])[0];
  const castLevel = Number(state.instance?.castLevel) || Number(sourceItem.system?.level) || 1;
  const formula = compilerRiderDamageFormula(
    damage,
    castLevel,
    Number(sourceItem.system?.level) || 1,
  );
  if (
    damage?.replacement !== "triggering-weapon-base-damage"
    || !formula
    || !damageType
  ) {
    throw new Error(
      "source-armed-attack-transform-v1 has an invalid hit replacement",
    );
  }
  config.arcaneSourceArmedAttackTransform = {
    formula,
    damageType,
    properties: [...new Set(["spell", "mgc", ...(damage.properties ?? [])])],
  };
  state.sourceItem = sourceItem;
  state.castLevel = castLevel;
  state.target = hitTargets[0];
  state.replacementPrepared = true;
  return true;
}

function applySourceArmedAttackTransformDamageConfig(config) {
  const transform = config?.arcaneSourceArmedAttackTransform;
  if (!transform) return true;
  const base = Array.from(config.rolls ?? [])[0];
  if (!base) {
    throw new Error(
      "source-armed-attack-transform-v1 found no weapon base damage roll",
    );
  }
  base.parts = [transform.formula];
  base.options = {
    ...(base.options ?? {}),
    type: transform.damageType,
    types: [transform.damageType],
    properties: [...transform.properties],
  };
  return true;
}

async function executeCompilerEventNeighborhoodActivity({
  sourceItem,
  activityIdentifier,
  parentWorkflow,
  anchorTarget,
  castLevel,
}) {
  const activity = Array.from(sourceItem?.system?.activities ?? []).find(
    candidate => candidate.midiProperties?.identifier === activityIdentifier,
  );
  const targetUuid = anchorTarget?.document?.uuid ?? anchorTarget?.uuid;
  if (!activity || !targetUuid) {
    throw new Error(
      "Compiler event-neighborhood activity is missing its activity or anchor",
    );
  }
  const contract = activity.getFlag?.(MODULE_ID, "triggeredEventActivity")
    ?? activity.flags?.[MODULE_ID]?.triggeredEventActivity;
  const radius = Number(contract?.radius);
  const hasNeighborhood = contract?.radius !== undefined;
  if (
    Number(contract?.version) !== 1
    || (
      hasNeighborhood
      && (
        !Number.isFinite(radius)
        || radius <= 0
        || contract?.units !== "ft"
      )
    )
  ) {
    throw new Error(
      "Compiler triggered activity has an invalid target contract",
    );
  }
  let targets = [anchorTarget];
  if (hasNeighborhood) {
    const includeAnchor = contract.includeAnchor !== false;
    const targetKind = String(contract.kind ?? "creature");
    const anchorIdentity = workflowTokenIdentity(anchorTarget);
    targets = Array.from(canvas.tokens?.placeables ?? []).filter(token => {
      if (!token?.actor) return false;
      if (
        targetKind === "creature"
        && !["character", "npc"].includes(String(token.actor.type ?? ""))
      ) return false;
      if (!includeAnchor && workflowTokenIdentity(token) === anchorIdentity) {
        return false;
      }
      return distanceBetweenTokenOccupancies(anchorTarget, token) <= radius;
    });
    if (
      includeAnchor
      && anchorTarget?.actor
      && !targets.some(token => workflowTokenIdentity(token) === anchorIdentity)
    ) {
      targets.push(anchorTarget);
    }
  }
  if (targets.length === 0) return null;
  const targetUuids = targets
    .map(token => token?.document?.uuid ?? token?.uuid)
    .filter(Boolean);
  const baseLevel = Math.max(0, Number(sourceItem.system?.level ?? 0) || 0);
  const parentWorkflowIds = new Set(
    [parentWorkflow?.id, parentWorkflow?.uuid, parentWorkflow?.itemCardId]
      .map(value => String(value ?? "").replace(/^ChatMessage./, ""))
      .filter(Boolean),
  );
  let resolvePostCleanup;
  const postCleanup = new Promise(resolve => {
    resolvePostCleanup = resolve;
  });
  const hookId = Hooks.on("midi-qol.postCleanup", candidate => {
    if (candidate?.activity?.id !== activity.id) return;
    const triggeringWorkflowId = String(
      candidate?.workflowOptions?.triggeringWorkflowId
      ?? candidate?.options?.triggeringWorkflowId
      ?? "",
    ).replace(/^ChatMessage./, "");
    if (
      triggeringWorkflowId
      && parentWorkflowIds.has(triggeringWorkflowId)
    ) {
      resolvePostCleanup(candidate);
    }
  });
  const usePromise = MidiQOL.completeActivityUse(activity, {
    consume: { action: false, resources: false, spellSlot: false },
    concentration: { begin: false },
    scaling: Math.max(0, Number(castLevel) - baseLevel),
    midiOptions: {
      spellLevel: castLevel,
      isCritical: false,
      noUseWarning: true,
      ignoreUserTargets: true,
      fastForward: true,
      fastForwardAttack: true,
      fastForwardDamage: true,
      targetUuids,
      targetsToUse: new Set(targets),
      workflowOptions: {
        arcaneEventNeighborhoodChild: true,
        autoRollAttack: true,
        autoRollDamage: "always",
        fastForwardAttack: true,
        fastForwardDamage: true,
        triggeringWorkflowId:
          parentWorkflow?.id ?? parentWorkflow?.uuid ?? null,
        isCritical: false,
        targetUuids,
        targetConfirmation: "none",
      },
    },
  });
  // Midi can leave completeActivityUse pending after the workflow has emitted
  // postCleanup. Treat the correlated cleanup hook as the authoritative native completion
  // receipt, while still surfacing an earlier rejection from the use promise.
  let child;
  try {
    child = await Promise.race([usePromise, postCleanup]);
  } finally {
    Hooks.off("midi-qol.postCleanup", hookId);
  }
  void Promise.resolve(usePromise).catch(error => {
    console.warn(
      "[" + MODULE_ID + "] Event-neighborhood activity rejected after completion",
      error,
    );
  });
  if (!child || child.aborted === true) {
    throw new Error("Compiler event-neighborhood child did not complete");
  }
  return child;
}

async function applyCompilerRuntimeTriggeredActivityFromUse(
  item,
  usageConfig,
  workflow,
) {
  const parentActivity = workflow?.activity;
  const link = parentActivity?.getFlag?.(
    MODULE_ID,
    "runtimeTriggeredActivity",
  ) ?? parentActivity?.flags?.[MODULE_ID]?.runtimeTriggeredActivity;
  if (Number(link?.version) !== 1) return true;
  const anchorTargets = workflowTargetTokens(workflow);
  if (anchorTargets.length !== 1) {
    throw new Error(
      "Runtime triggered event activity requires exactly one parent target",
    );
  }
  await executeCompilerEventNeighborhoodActivity({
    sourceItem: item,
    activityIdentifier: link.activityIdentifier,
    parentWorkflow: workflow,
    anchorTarget: anchorTargets[0],
    castLevel: workflowCastLevel(item, usageConfig, workflow),
  });
  return true;
}

async function resolveSourceArmedAttackTransform(workflow) {
  const state = SOURCE_ARMED_ATTACK_TRANSFORM_STATES.get(workflow);
  if (!state || state.resolved || workflow?.aborted === true) return true;
  const hitTargets = workflowHitTargets(workflow);
  const attackTargets = workflowTargetTokens(workflow);
  const outcome = hitTargets.length === 1 ? "hit" : "miss";
  const target = hitTargets[0] ?? attackTargets[0] ?? null;
  if (!target || hitTargets.length > 1 || attackTargets.length > 1) {
    return true;
  }
  const sourceItem = state.sourceItem
    ?? await sourceItemForCompilerSourceEffect(state.effect, workflow.actor);
  const castLevel = Number(state.castLevel ?? state.instance?.castLevel)
    || Number(sourceItem?.system?.level)
    || 1;
  const phase = state.contract?.[outcome];
  if (!sourceItem || !phase?.activityIdentifier) {
    throw new Error(
      "source-armed-attack-transform-v1 has an incomplete outcome contract",
    );
  }
  if (outcome === "hit" && !state.replacementPrepared) {
    throw new Error(
      "source-armed-attack-transform-v1 did not replace the hit damage",
    );
  }
  // The triggering attack has already produced an observable outcome. Consume
  // the one-shot source before any follow-up damage or child activity starts,
  // so a later partial failure is reported as indeterminate but can never
  // replay the spell on the next attack.
  state.resolved = true;
  await state.effect.delete();
  releaseSourceArmedAttackTransform(workflow);
  if (outcome === "miss") {
    const damage = phase.damage;
    const damageType = Array.from(damage?.damageTypes ?? [])[0];
    const formula = compilerRiderDamageFormula(
      damage,
      castLevel,
      Number(sourceItem.system?.level) || 1,
    );
    if (!formula || !damageType) {
      throw new Error(
        "source-armed-attack-transform-v1 has an invalid miss damage contract",
      );
    }
    await applyBonusDamageWorkflow(
      workflow,
      "floor((" + formula + ") / 2)",
      damageType,
      sourceItem.name + ": miss",
      {
        riderId: phase.runtimeRuleId,
        targets: [target],
        isCritical: false,
      },
    );
  }
  await executeCompilerEventNeighborhoodActivity({
    sourceItem,
    activityIdentifier: phase.activityIdentifier,
    parentWorkflow: workflow,
    anchorTarget: target,
    castLevel,
  });
  return true;
}

function declaredActiveBuffMatch(workflow) {
  const actor = workflow?.actor;
  if (!actor || !isWeaponWorkflow(workflow)) return null;
  for (const rider of declaredRidersFromUse(null, workflow)) {
    const identifier = String(rider?.id ?? rider?.identifier ?? "").trim();
    if (!identifier) continue;
    const spellItem = Array.from(actor.items ?? []).find(candidate =>
      candidate.type === "spell"
      && candidate.flags?.[MODULE_ID]?.declaredActiveBuff?.identifier === identifier
    );
    const contract = spellItem?.flags?.[MODULE_ID]?.declaredActiveBuff;
    if (!contract || !weaponSpellRiderAttackAllowed(workflow, contract)) continue;
    const readyEffect = actorEffectForCompilerArtifact(actor, contract.requiredArtifactId);
    if (!readyEffect) continue;
    return { rider, spellItem, contract, readyEffect };
  }
  return null;
}

function applyDeclaredActiveBuffAdvantage(workflow, state) {
  const advantageTracker = workflow?.attackRollModifierTracker?.advantage;
  if (typeof advantageTracker?.add === "function") {
    advantageTracker.add(
      MODULE_ID + ":" + state.contract.identifier + ":" + state.readyEffect.id,
      state.spellItem.name,
    );
  } else if (workflow) {
    workflow.advantage = true;
  }
}

function declaredActiveBuffReservationKey(readyEffect) {
  return String(readyEffect?.uuid ?? readyEffect?.id ?? "");
}

function reserveDeclaredActiveBuff(workflow, match) {
  const reservationKey = declaredActiveBuffReservationKey(match?.readyEffect);
  if (!workflow || !reservationKey) return null;
  const owner = DECLARED_ACTIVE_BUFF_RESERVATIONS.get(reservationKey);
  if (owner && owner !== workflow) return null;
  DECLARED_ACTIVE_BUFF_RESERVATIONS.set(reservationKey, workflow);
  return reservationKey;
}

function releaseDeclaredActiveBuff(workflow) {
  if (!workflow) return true;
  const state = DECLARED_ACTIVE_BUFF_STATES.get(workflow);
  const reservationKey = state?.reservationKey;
  if (
    reservationKey
    && DECLARED_ACTIVE_BUFF_RESERVATIONS.get(reservationKey) === workflow
  ) {
    DECLARED_ACTIVE_BUFF_RESERVATIONS.delete(reservationKey);
  }
  DECLARED_ACTIVE_BUFF_STATES.delete(workflow);
  return true;
}

function applyDeclaredActiveBuffAttackConfig(workflow) {
  if (!workflow) return true;
  const existingState = DECLARED_ACTIVE_BUFF_STATES.get(workflow);
  if (existingState) {
    if (
      DECLARED_ACTIVE_BUFF_RESERVATIONS.get(existingState.reservationKey)
      !== workflow
    ) {
      DECLARED_ACTIVE_BUFF_STATES.delete(workflow);
      return true;
    }
    applyDeclaredActiveBuffAdvantage(workflow, existingState);
    return true;
  }
  const match = declaredActiveBuffMatch(workflow);
  if (!match) return true;
  const reservationKey = reserveDeclaredActiveBuff(workflow, match);
  if (!reservationKey) return true;
  applyDeclaredActiveBuffAdvantage(workflow, match);
  workflow.flags ??= {};
  workflow.flags[MODULE_ID] = {
    ...(workflow.flags[MODULE_ID] ?? {}),
    declaredActiveBuff: {
      identifier: match.contract.identifier,
      sourceEffectUuid: match.readyEffect.uuid,
    },
  };
  DECLARED_ACTIVE_BUFF_STATES.set(workflow, {
    ...match,
    reservationKey,
    damagePrepared: false,
    finalized: false,
  });
  return true;
}

async function prepareDeclaredActiveBuffDamage(workflow, activity, config) {
  if (!workflow || !config) return true;
  applyDeclaredActiveBuffAttackConfig(workflow);
  const state = DECLARED_ACTIVE_BUFF_STATES.get(workflow);
  if (!state || state.damagePrepared) return true;
  const hitTargets = workflowHitTargets(workflow);
  if (hitTargets.length !== 1) return true;
  const damage = state.contract.damage;
  const damageTypes = Array.from(damage?.types ?? []).filter(Boolean);
  if (!damage?.formula || damageTypes.length !== 1) return true;
  state.damagePrepared = prepareParentDamageRiderRoll(workflow, config, {
    riderId: state.contract.identifier,
    formula: damage.formula,
    damageType: damageTypes[0],
    flavor: state.spellItem.name,
    sourceEffect: state.readyEffect,
    sourceItem: state.spellItem,
    targets: hitTargets,
    properties: Array.from(state.contract.damage?.properties ?? ["spell", "mgc"]),
  });
  return true;
}

async function finalizeParentDamageRiders(workflow) {
  const states = PARENT_DAMAGE_RIDER_STATES.get(workflow) ?? [];
  for (const state of states) {
    if (state.finalized) continue;
    const roll = workflowDamageRolls(workflow).find(candidate =>
      candidate?.options?.[MODULE_ID]?.parentDamageRider === true
      && candidate?.options?.[MODULE_ID]?.riderKey === state.riderKey
    );
    if (!roll) continue;
    registerPendingDamageSegment(workflow, {
      riderId: state.riderId,
      formula: state.formula,
      damageType: state.damageType,
      flavor: state.flavor,
      targets: state.targets,
      sourceEffectUuid: state.sourceEffectUuid,
      isCritical: Boolean(roll.isCritical ?? isCriticalHitWorkflow(workflow)),
    }, roll, state.damageType, state.flavor, state.targets);
    state.finalized = true;
  }
  return true;
}

async function finalizeSourceAttackProximityRiders(workflow) {
  const states = SOURCE_ATTACK_PROXIMITY_RIDER_STATES.get(workflow) ?? [];
  const parentStates = PARENT_DAMAGE_RIDER_STATES.get(workflow) ?? [];
  for (const state of states) {
    if (state.finalized) continue;
    const parentState = parentStates.find(candidate =>
      candidate.riderKey === state.parentRiderKey
    );
    if (!parentState?.finalized) continue;
    const results = [];
    for (const target of state.targets) {
      results.push(await applyCompilerDependentArtifact({
        sourceEffect: state.sourceEffect,
        sourceActor: state.sourceActor,
        sourceItem: state.sourceItem,
        target,
        artifactId: state.appliedArtifactId,
      }));
    }
    state.finalized = results.length > 0 && results.every(Boolean);
  }
  return true;
}

async function finalizeDeclaredActiveBuff(workflow) {
  const state = DECLARED_ACTIVE_BUFF_STATES.get(workflow);
  if (!state || state.finalized) return true;
  state.finalized = true;
  try {
    const actor = workflow?.actor;
    const readyEffect = actor?.effects?.get?.(state.readyEffect.id);
    if (!actor || !readyEffect) return true;
    await actor.deleteEmbeddedDocuments("ActiveEffect", [readyEffect.id]);
    const existing = actorEffectForCompilerArtifact(actor, state.contract.appliedArtifactId);
    if (existing) await actor.deleteEmbeddedDocuments("ActiveEffect", [existing.id]);
    const effectData = effectDataFromItem(
      state.spellItem,
      effect => Array.from(arcaneEffectFlag(effect, "compilerArtifactIds") ?? [])
        .includes(state.contract.appliedArtifactId),
      actor,
    );
    if (effectData) {
      anchorRuntimeEffectLifecycleData(effectData);
      await actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
    }
    return true;
  } finally {
    releaseDeclaredActiveBuff(workflow);
  }
}

function hunterMarkEffectForTarget(target, sourceActor, sourceToken) {
  return Array.from(target?.actor?.effects ?? []).find(effect => {
    const identifier = effect.getFlag?.(MODULE_ID, "identifier") ?? effect.flags?.[MODULE_ID]?.identifier;
    const isHunterMark =
      identifier === "hunters-mark" ||
      /hunter'?s mark|猎人印记/i.test(String(effect.name ?? ""));
    if (!isHunterMark) return false;
    return effectSourceMatchesActor(effect, sourceActor, sourceToken);
  });
}

async function applyHuntersMarkDamageBonus(workflow) {
  if (workflow?.flags?.[MODULE_ID]?.huntersMarkApplied || workflow?.__arcaneHuntersMarkApplied) return true;
  if (!isWeaponWorkflow(workflow)) return true;
  const actor = workflow?.actor;
  const hunterMarkItem = Array.from(actor?.items ?? []).find(item => item.system?.identifier === "hunters-mark");
  if (hunterMarkItem?.flags?.[MODULE_ID]?.compiler?.version) return true;
  if (hunterMarkItem?.getFlag?.(MODULE_ID, "huntersMarkMarkerOnly") === true
    || hunterMarkItem?.flags?.[MODULE_ID]?.huntersMarkMarkerOnly === true) {
    return true;
  }
  const damageTargets = confirmedHitTargets(workflow);
  if (!actor || !damageTargets.length) return true;
  const markedTargets = damageTargets.filter(target => hunterMarkEffectForTarget(target, actor, workflow?.token));
  if (!markedTargets.length) return true;

  workflow.__arcaneHuntersMarkApplied = true;
  workflow.flags ??= {};
  workflow.flags[MODULE_ID] = {
    ...(workflow.flags[MODULE_ID] ?? {}),
    huntersMarkApplied: true,
  };
  const firstEffect = hunterMarkEffectForTarget(markedTargets[0], actor, workflow?.token);
  await applyBonusDamageWorkflow(workflow, isCriticalHitWorkflow(workflow) ? "2d6" : "1d6", workflowDamageType(workflow), "Hunter's Mark", {
    riderId: "hunters-mark",
    sourceEffectUuid: firstEffect?.uuid,
    targets: markedTargets,
    isCritical: isCriticalHitWorkflow(workflow),
  });
  return true;
}

function weaponBaseDamageFaces(workflow) {
  const activityPart = Object.values(workflow?.activity?.damage?.parts ?? {})[0];
  const itemPart = Array.isArray(workflow?.item?.system?.damage?.parts) ? workflow.item.system.damage.parts[0] : null;
  const faces = Number(activityPart?.denomination ?? itemPart?.[0]?.match?.(/d(\d+)/i)?.[1]);
  return Number.isFinite(faces) && faces > 0 ? new Set([faces]) : null;
}

async function applyGreatWeaponFightingReroll(workflow) {
  if (workflow?.flags?.[MODULE_ID]?.greatWeaponFightingApplied || workflow?.__arcaneGreatWeaponFightingApplied) return true;
  if (!isGreatWeaponFightingEligible(workflow)) return true;
  const allowedFaces = weaponBaseDamageFaces(workflow);
  if (!allowedFaces) return true;

  const changes = [];
  for (const roll of workflowDamageRolls(workflow)) {
    if (isArcaneExtraDamageRoll(roll)) continue;
    for (const term of roll.terms ?? []) {
      const faces = Number(term.faces);
      if (!allowedFaces.has(faces) || !Array.isArray(term.results)) continue;
      for (const result of term.results) {
        if (result.active === false || result.discarded || result.rerolled) continue;
        const original = Number(result.result);
        if (![1, 2].includes(original)) continue;
        const replacementRoll = await new Roll("1d" + faces).evaluate();
        const replacement = Number(replacementRoll.total);
        result.result = replacement;
        changes.push({ original, replacement, faces });
      }
    }
    if (changes.length && typeof roll._evaluateTotal === "function") roll._total = roll._evaluateTotal();
  }

  if (!changes.length) return true;
  workflow.__arcaneGreatWeaponFightingApplied = true;
  workflow.flags ??= {};
  workflow.flags[MODULE_ID] = {
    ...(workflow.flags[MODULE_ID] ?? {}),
    greatWeaponFightingApplied: true,
    greatWeaponFightingRerolls: changes,
  };
  if (typeof workflow.setDamageRolls === "function") await workflow.setDamageRolls(workflow.damageRolls);
  const totalDelta = changes.reduce((sum, change) => sum + change.replacement - change.original, 0);
  await ChatMessage.create({
    user: game.user?.id,
    speaker: ChatMessage.getSpeaker({ actor: workflow.actor }),
    content: "<p><strong>Great Weapon Fighting:</strong> rerolled "
      + changes.map(change => "d" + change.faces + " " + change.original + " -> " + change.replacement).join(", ")
      + " (" + (totalDelta >= 0 ? "+" : "") + totalDelta + ")</p>",
  });
  return true;
}

async function applySavageAttackerHouseRuleReroll(workflow) {
  if (workflow?.flags?.[MODULE_ID]?.savageAttackerApplied || workflow?.__arcaneSavageAttackerApplied) return true;
  if (!actorHasFeature(workflow?.actor, SAVAGE_ATTACKER_IDENTIFIER)) return true;
  if (!isWeaponWorkflow(workflow)) return true;

  const kept = [];
  const improved = [];
  for (const roll of workflowDamageRolls(workflow)) {
    if (isArcaneExtraDamageRoll(roll)) continue;
    const candidates = [];
    for (const term of roll.terms ?? []) {
      const faces = Number(term.faces);
      if (!Number.isFinite(faces) || faces <= 0 || !Array.isArray(term.results)) continue;
      for (const result of term.results) {
        if (result.active === false || result.discarded || result.rerolled) continue;
        const original = Number(result.result);
        if (!Number.isFinite(original)) continue;
        const replacementRoll = await new Roll("1d" + faces).evaluate();
        const replacement = Number(replacementRoll.total);
        if (!Number.isFinite(replacement)) continue;
        candidates.push({ result, original, replacement, faces });
      }
    }
    if (!candidates.length) continue;

    const originalDiceTotal = candidates.reduce((sum, change) => sum + change.original, 0);
    const replacementDiceTotal = candidates.reduce((sum, change) => sum + change.replacement, 0);
    if (replacementDiceTotal > originalDiceTotal) {
      for (const change of candidates) change.result.result = change.replacement;
      if (typeof roll._evaluateTotal === "function") roll._total = roll._evaluateTotal();
      improved.push({ originalDiceTotal, replacementDiceTotal, dice: candidates.map(change => ({ original: change.original, replacement: change.replacement, faces: change.faces })) });
    } else {
      kept.push({ originalDiceTotal, replacementDiceTotal });
    }
  }

  if (!improved.length && !kept.length) return true;
  workflow.__arcaneSavageAttackerApplied = true;
  workflow.flags ??= {};
  workflow.flags[MODULE_ID] = {
    ...(workflow.flags[MODULE_ID] ?? {}),
    savageAttackerApplied: true,
    savageAttackerRerolls: { improved, kept },
  };
  if (improved.length && typeof workflow.setDamageRolls === "function") await workflow.setDamageRolls(workflow.damageRolls);

  const detail = improved.length
    ? "kept reroll (" + improved.map(entry => entry.originalDiceTotal + " -> " + entry.replacementDiceTotal).join(", ") + ")"
    : "kept original; reroll was not higher";
  await ChatMessage.create({
    user: game.user?.id,
    speaker: ChatMessage.getSpeaker({ actor: workflow.actor }),
    content: "<p><strong>Savage Attacker:</strong> " + detail + ".</p>",
  });
  return true;
}

async function applySavageAttacksDamageBonus(workflow) {
  if (workflow?.flags?.[MODULE_ID]?.savageAttacksApplied || workflow?.__arcaneSavageAttacksApplied) return true;
  if (!actorHasFeature(workflow?.actor, SAVAGE_ATTACKS_IDENTIFIER)) return true;
  if (!isMeleeWeaponWorkflow(workflow) || !isCriticalHitWorkflow(workflow)) return true;
  const allowedFaces = weaponBaseDamageFaces(workflow);
  const faces = allowedFaces ? Math.max(...allowedFaces) : 0;
  if (!Number.isFinite(faces) || faces <= 0) return true;
  workflow.__arcaneSavageAttacksApplied = true;
  workflow.flags ??= {};
  workflow.flags[MODULE_ID] = {
    ...(workflow.flags[MODULE_ID] ?? {}),
    savageAttacksApplied: true,
  };
  await applyBonusDamageWorkflow(workflow, `1d${faces}`, workflowDamageType(workflow), `Savage Attacks (+1d${faces})`);
  return true;
}

function compilerWeaponDamageMinimum(actor) {
  let minimum = 0;
  for (const effect of activeCompilerRuntimeEffects(
    actor,
    "weapon-damage-minimum-total",
  )) {
    for (const modifier of compilerRuntimeModifiers(
      effect,
      "weapon-damage-minimum-total",
    )) {
      const value = Number(modifier.minimumTotal);
      if (Number.isFinite(value)) minimum = Math.max(minimum, value);
    }
  }
  return minimum;
}

function cacheCompilerWeaponAttackAbility(workflow) {
  if (!isWeaponWorkflow(workflow)) return null;
  const ability = String(workflow?.activity?.ability ?? "").toLowerCase();
  if (!["str", "dex", "con", "int", "wis", "cha"].includes(ability)) {
    return null;
  }
  workflow.__arcaneWeaponAttackAbility = ability;
  return ability;
}

function compilerWeaponHitDamageScale(workflow) {
  if (!isWeaponWorkflow(workflow)) return 1;
  const ability = String(
    workflow?.__arcaneWeaponAttackAbility
    ?? cacheCompilerWeaponAttackAbility(workflow)
    ?? "",
  ).toLowerCase();
  if (!ability) return 1;
  let multiplier = 1;
  for (const effect of activeCompilerRuntimeEffects(
    workflow.actor,
    "weapon-hit-damage-scale",
  )) {
    for (const modifier of compilerRuntimeModifiers(
      effect,
      "weapon-hit-damage-scale",
    )) {
      if (!Array.from(modifier.abilities ?? []).includes(ability)) continue;
      const value = Number(modifier.multiplier);
      if (Number.isFinite(value) && value > 0 && value <= 1) {
        multiplier = Math.min(multiplier, value);
      }
    }
  }
  return multiplier;
}

function scaledCompilerDamageRolls(rolls, multiplier, label, cumulative = {}) {
  const values = Array.from(rolls ?? []).filter(Boolean);
  if (!values.length || !(multiplier > 0 && multiplier < 1)) {
    return {
      rolls: values,
      changed: false,
      originalTotal: 0,
      adjustedTotal: 0,
      cumulativeOriginalTotal: Number(cumulative.originalTotal ?? 0) || 0,
      cumulativeAdjustedTotal: Number(cumulative.adjustedTotal ?? 0) || 0,
    };
  }
  if (typeof game.system?.dice?.aggregateDamageRolls !== "function") {
    throw new Error(
      "weapon-hit-damage-scale requires dnd5e aggregateDamageRolls",
    );
  }
  const aggregated = game.system.dice.aggregateDamageRolls(values, {
    respectProperties: true,
  });
  const totals = aggregated.map(roll =>
    Math.max(0, Number(roll?.total) || 0)
  );
  const originalTotal = totals.reduce((sum, total) => sum + total, 0);
  const previousOriginalTotal = Math.max(
    0,
    Number(cumulative.originalTotal ?? 0) || 0,
  );
  const previousAdjustedTotal = Math.max(
    0,
    Number(cumulative.adjustedTotal ?? 0) || 0,
  );
  const cumulativeOriginalTotal = previousOriginalTotal + originalTotal;
  const cumulativeAdjustedTotal = Math.floor(
    cumulativeOriginalTotal * multiplier,
  );
  const wantedTotal = Math.max(
    0,
    Math.min(
      originalTotal,
      cumulativeAdjustedTotal - previousAdjustedTotal,
    ),
  );
  const allocations = totals.map(() => 0);
  if (originalTotal > 0 && wantedTotal > 0) {
    const exact = totals.map(total => total * wantedTotal / originalTotal);
    let allocated = 0;
    for (let index = 0; index < totals.length; index += 1) {
      allocations[index] = Math.min(totals[index], Math.floor(exact[index]));
      allocated += allocations[index];
    }
    const order = exact.map((value, index) => ({
      index,
      remainder: value - Math.floor(value),
    })).sort((left, right) =>
      right.remainder - left.remainder
      || left.index - right.index
    );
    for (const current of order) {
      if (allocated >= wantedTotal) break;
      if (allocations[current.index] >= totals[current.index]) continue;
      allocations[current.index] += 1;
      allocated += 1;
    }
  }
  let changed = false;
  for (let index = 0; index < aggregated.length; index += 1) {
    const roll = aggregated[index];
    const total = totals[index];
    const wanted = allocations[index];
    const reduction = total - wanted;
    if (!(reduction > 0)) continue;
    roll.terms.push(
      new OperatorTerm({ operator: "-" }),
      new NumericTerm({
        number: reduction,
        options: {
          flavor: roll.options?.type ?? label,
          [MODULE_ID]: {
            weaponHitDamageScale: true,
            multiplier,
          },
        },
      }),
    );
    if (typeof roll.resetFormula === "function") roll.resetFormula();
    if (typeof roll._evaluateTotal === "function") {
      roll._total = roll._evaluateTotal();
    }
    changed = true;
  }
  return {
    rolls: aggregated,
    changed,
    originalTotal,
    adjustedTotal: allocations.reduce((sum, total) => sum + total, 0),
    cumulativeOriginalTotal,
    cumulativeAdjustedTotal,
  };
}

function compilerWeaponHitDamageScaleReceipt(workflow, multiplier) {
  workflow.flags ??= {};
  const existing = workflow.flags[MODULE_ID]?.weaponHitDamageScale;
  const receipt = (
    existing
    && Number(existing.multiplier) === Number(multiplier)
  ) ? existing : {
    ability: workflow.__arcaneWeaponAttackAbility,
    multiplier,
    originalTotal: 0,
    adjustedTotal: 0,
    receipts: [],
  };
  workflow.flags[MODULE_ID] = {
    ...(workflow.flags[MODULE_ID] ?? {}),
    weaponHitDamageScale: receipt,
  };
  return receipt;
}

function appendCompilerWeaponHitDamageScaleReceipt(
  workflow,
  multiplier,
  container,
  scaled,
) {
  const receipt = compilerWeaponHitDamageScaleReceipt(workflow, multiplier);
  receipt.originalTotal = scaled.cumulativeOriginalTotal;
  receipt.adjustedTotal = scaled.cumulativeAdjustedTotal;
  receipt.receipts.push({
    container,
    originalTotal: scaled.originalTotal,
    adjustedTotal: scaled.adjustedTotal,
    cumulativeOriginalTotal: scaled.cumulativeOriginalTotal,
    cumulativeAdjustedTotal: scaled.cumulativeAdjustedTotal,
  });
  return receipt;
}

async function enforceCompilerWeaponHitDamageScale(workflow) {
  if (
    !workflow
    || workflow.__arcaneWeaponHitDamageScaleApplied
    || !isWeaponWorkflow(workflow)
  ) return true;
  const multiplier = compilerWeaponHitDamageScale(workflow);
  if (!(multiplier > 0 && multiplier < 1)) return true;
  const containers = [
    { property: "damageRolls", setter: "setDamageRolls" },
    { property: "bonusDamageRolls", setter: "setBonusDamageRolls" },
    { property: "otherDamageRolls", setter: "setOtherDamageRolls" },
  ];
  const priorReceipt = workflow?.flags?.[MODULE_ID]?.weaponHitDamageScale;
  let cumulative = (
    Number(priorReceipt?.multiplier) === Number(multiplier)
  ) ? {
      originalTotal: Number(priorReceipt.originalTotal ?? 0) || 0,
      adjustedTotal: Number(priorReceipt.adjustedTotal ?? 0) || 0,
    } : { originalTotal: 0, adjustedTotal: 0 };
  for (const container of containers) {
    const rolls = Array.from(workflow?.[container.property] ?? [])
      .filter(Boolean);
    if (!rolls.length) continue;
    const scaled = scaledCompilerDamageRolls(
      rolls,
      multiplier,
      container.property,
      cumulative,
    );
    cumulative = {
      originalTotal: scaled.cumulativeOriginalTotal,
      adjustedTotal: scaled.cumulativeAdjustedTotal,
    };
    if (scaled.changed) {
      if (typeof workflow?.[container.setter] !== "function") {
        throw new Error(
          "weapon-hit-damage-scale requires Midi workflow."
          + container.setter,
        );
      }
      await workflow[container.setter](scaled.rolls);
    }
    appendCompilerWeaponHitDamageScaleReceipt(
      workflow,
      multiplier,
      container.property,
      scaled,
    );
  }
  workflow.__arcaneWeaponHitDamageScaleApplied = true;
  compilerWeaponHitDamageScaleReceipt(workflow, multiplier);
  return true;
}

function rebuildCompilerWorkflowDamageDetail(workflow) {
  const rolls = foundry.utils.deepClone(workflow?.damageRolls ?? []);
  if (!rolls.length || typeof game.system?.dice?.aggregateDamageRolls !== "function") {
    return false;
  }
  for (const roll of rolls) {
    roll.options ??= {};
    roll.options.type ??=
      workflow.defaultDamageType
      ?? workflowDamageType(workflow);
  }
  const aggregated = game.system.dice.aggregateDamageRolls(rolls);
  workflow.damageDetail = aggregated.map(roll => {
    const total = Number(roll.total);
    const value = roll.options.type === "healing"
      ? total
      : Math.max(0, total);
    return {
      // Midi 13's v3 damage application reads value; damage remains its
      // compatibility/display alias. Omitting either creates a split-brain
      // roll where chat shows the adjusted total but Actor.calculateDamage
      // receives NaN and applies nothing.
      value,
      damage: value,
      type: roll.options.type,
      formula: roll.formula,
      properties: new Set(roll.options.properties ?? []),
    };
  });
  return true;
}

async function enforceCompilerWeaponDamageMinimum(workflow) {
  if (
    !workflow
    || workflow.__arcaneWeaponDamageMinimumApplied
    || !isWeaponWorkflow(workflow)
  ) return true;
  const minimum = compilerWeaponDamageMinimum(workflow.actor);
  if (!(minimum > 0)) return true;
  const roll = workflowDamageRolls(workflow).find(candidate =>
    !isArcaneExtraDamageRoll(candidate)
  );
  const total = Number(roll?.total);
  if (!roll || !Number.isFinite(total) || total >= minimum) return true;
  const delta = minimum - total;
  roll.terms.push(
    new OperatorTerm({ operator: "+" }),
    new NumericTerm({
      number: delta,
      options: {
        flavor: workflowDamageType(workflow),
        [MODULE_ID]: { weaponDamageMinimum: true },
      },
    }),
  );
  if (typeof roll.resetFormula === "function") roll.resetFormula();
  if (typeof roll._evaluateTotal === "function") roll._total = roll._evaluateTotal();
  workflow.__arcaneWeaponDamageMinimumApplied = true;
  workflow.flags ??= {};
  workflow.flags[MODULE_ID] = {
    ...(workflow.flags[MODULE_ID] ?? {}),
    weaponDamageMinimum: {
      minimum,
      originalTotal: total,
      adjustedTotal: Number(roll.total),
    },
  };
  if (typeof workflow.setDamageRolls === "function") {
    await workflow.setDamageRolls(workflow.damageRolls);
  }
  rebuildCompilerWorkflowDamageDetail(workflow);
  return true;
}

function fatalDamageInterceptionContract(document) {
  const value =
    document?.getFlag?.(MODULE_ID, FATAL_DAMAGE_INTERCEPTION_FLAG)
    ?? document?.flags?.[MODULE_ID]?.[FATAL_DAMAGE_INTERCEPTION_FLAG];
  if (
    value == null
    && document?.documentName === "Item"
    && document.system?.identifier === "relentless-endurance"
  ) {
    // Existing world Actors keep embedded Item copies when the Arcane pack is
    // rebuilt. Preserve those exact 2014 Relentless Endurance Items without a
    // world mutation; malformed explicit contracts still fail closed below.
    return {
      version: FATAL_DAMAGE_INTERCEPTION_VERSION,
      kind: "relentless-endurance",
      rank: 200,
      minimumHitPoints: 1,
      artifactId: null,
    };
  }
  if (
    !value
    || typeof value !== "object"
    || Array.isArray(value)
    || Number(value.version) !== FATAL_DAMAGE_INTERCEPTION_VERSION
  ) return null;
  const kind = String(value.kind ?? "");
  const expectedRank = kind === "death-ward"
    ? 100
    : kind === "relentless-endurance"
      ? 200
      : null;
  if (
    expectedRank === null
    || Number(value.rank) !== expectedRank
    || Number(value.minimumHitPoints) !== 1
  ) return null;
  return {
    version: FATAL_DAMAGE_INTERCEPTION_VERSION,
    kind,
    rank: expectedRank,
    minimumHitPoints: 1,
    artifactId: typeof value.artifactId === "string" && value.artifactId.trim()
      ? value.artifactId.trim()
      : null,
  };
}

function isExactDeathWardInterceptionEffect(effect, actor, contract, artifactId = null) {
  const compilerIds = compilerArtifactIds(effect);
  return Boolean(
    effect?.documentName === "ActiveEffect"
    && effect.parent?.uuid === actor?.uuid
    && contract?.kind === "death-ward"
    && contract.rank === 100
    && contract.minimumHitPoints === 1
    && contract.artifactId
    && (!artifactId || contract.artifactId === artifactId)
    && compilerIds.includes(contract.artifactId)
    && arcaneEffectFlag(effect, "runtimeArtifactAdapter")
      === "fatal-damage-interception-v1"
    && arcaneEffectFlag(effect, "identifier") === "death-ward"
  );
}

function isExactRelentlessEnduranceInterceptionItem(item, actor, contract) {
  return Boolean(
    item?.documentName === "Item"
    && (item.actor ?? item.parent)?.uuid === actor?.uuid
    && item.system?.identifier === "relentless-endurance"
    && contract?.kind === "relentless-endurance"
    && contract.rank === 200
    && contract.minimumHitPoints === 1
    && !contract.artifactId
  );
}

function fatalDamageInterceptionPendingReceipts(actor) {
  const value =
    actor?.getFlag?.(MODULE_ID, FATAL_DAMAGE_INTERCEPTION_PENDING_FLAG)
    ?? actor?.flags?.[MODULE_ID]?.[FATAL_DAMAGE_INTERCEPTION_PENDING_FLAG];
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return Object.entries(value)
    .filter(([receiptId, receipt]) =>
      Boolean(receiptId)
      && receipt
      && typeof receipt === "object"
      && !Array.isArray(receipt)
    )
    .map(([receiptId, receipt]) => ({ ...receipt, receiptId }));
}

function isValidFatalDamageInterceptionReceipt(actor, receipt) {
  const originalHitPoints = Number(receipt?.originalHitPoints);
  const originalNextHitPoints = Number(receipt?.originalNextHitPoints);
  const damageAmount = Number(receipt?.damageAmount);
  const createdAt = Number(receipt?.createdAt);
  if (
    Number(receipt?.version) !== FATAL_DAMAGE_INTERCEPTION_VERSION
    || receipt?.status !== "pending"
    || receipt?.actorUuid !== actor?.uuid
    || typeof receipt?.receiptId !== "string"
    || !receipt.receiptId
    || typeof receipt?.transactionId !== "string"
    || !receipt.transactionId
    || typeof receipt?.sourceDocumentUuid !== "string"
    || !receipt.sourceDocumentUuid
    || Number(receipt?.minimumHitPoints) !== 1
    || !Number.isFinite(originalHitPoints)
    || originalHitPoints <= 0
    || !Number.isFinite(originalNextHitPoints)
    || originalNextHitPoints > 0
    || !Number.isFinite(damageAmount)
    || damageAmount <= 0
    || !Number.isFinite(createdAt)
    || createdAt <= 0
  ) return false;
  if (receipt.candidateKind === "death-ward") {
    return Boolean(
      Number(receipt.rank) === 100
      && receipt.sourceEffectUuid === receipt.sourceDocumentUuid
      && typeof receipt.sourceActorUuid === "string"
      && receipt.sourceActorUuid
      && typeof receipt.sourceItemUuid === "string"
      && receipt.sourceItemUuid
      && typeof receipt.artifactId === "string"
      && receipt.artifactId
      && receipt.usesSpentBefore === null
      && receipt.usesSpentAfter === null
    );
  }
  if (receipt.candidateKind === "relentless-endurance") {
    const spentBefore = Number(receipt.usesSpentBefore);
    const spentAfter = Number(receipt.usesSpentAfter);
    return Boolean(
      Number(receipt.rank) === 200
      && receipt.sourceActorUuid === actor.uuid
      && receipt.sourceItemUuid === receipt.sourceDocumentUuid
      && !receipt.sourceEffectUuid
      && !receipt.artifactId
      && Number.isFinite(spentBefore)
      && Number.isFinite(spentAfter)
      && spentBefore >= 0
      && spentAfter === spentBefore + 1
    );
  }
  return false;
}

function sameFatalDamageInterceptionReceipt(left, right) {
  const fields = [
    "version",
    "receiptId",
    "transactionId",
    "actorUuid",
    "status",
    "candidateKind",
    "rank",
    "sourceDocumentUuid",
    "sourceActorUuid",
    "sourceItemUuid",
    "sourceEffectUuid",
    "artifactId",
    "usesSpentBefore",
    "usesSpentAfter",
    "originalHitPoints",
    "originalNextHitPoints",
    "minimumHitPoints",
    "damageAmount",
    "createdAt",
  ];
  return fields.every(field => Object.is(left?.[field] ?? null, right?.[field] ?? null));
}

function fatalDamageInterceptionTransactionKey(actorUuid, transactionId) {
  return String(actorUuid ?? "") + ":" + String(transactionId ?? "");
}

function fatalDamageInterceptionSourceReservationKey(actorUuid, sourceDocumentUuid) {
  return String(actorUuid ?? "") + ":" + String(sourceDocumentUuid ?? "");
}

function fatalDamageInterceptionTransactionIdFromOptions(options = {}) {
  const carriers = [options?.damageItem, options].filter(candidate =>
    candidate && typeof candidate === "object"
  );
  for (const candidate of [
    options?.damageItem?.flags?.[MODULE_ID]?.fatalDamageTransactionId,
    options?.[MODULE_ID]?.fatalDamageTransactionId,
    ...carriers.map(carrier => FATAL_DAMAGE_INTERCEPTION_TRANSACTION_IDS.get(carrier)),
  ]) {
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  }
  return null;
}

function fatalDamageInterceptionRememberTransactionId(options, transactionId) {
  const damageItem = options?.damageItem;
  for (const carrier of [damageItem, options]) {
    if (!carrier || typeof carrier !== "object") continue;
    FATAL_DAMAGE_INTERCEPTION_TRANSACTION_IDS.set(carrier, transactionId);
  }
  try {
    if (damageItem && typeof damageItem === "object") {
      damageItem.flags ??= {};
      damageItem.flags[MODULE_ID] = {
        ...(damageItem.flags[MODULE_ID] ?? {}),
        fatalDamageTransactionId: transactionId,
      };
    }
  } catch (_error) {
    // The WeakMap identity above still keeps a frozen Midi damage item stable.
  }
  try {
    if (options && typeof options === "object") {
      options[MODULE_ID] = {
        ...(options[MODULE_ID] ?? {}),
        fatalDamageTransactionId: transactionId,
      };
    }
  } catch (_error) {
    // The WeakMap identity above still keeps a frozen update context stable.
  }
  return transactionId;
}

function fatalDamageInterceptionTransactionId(actor, options = {}) {
  const existing = fatalDamageInterceptionTransactionIdFromOptions(options);
  if (existing) return existing;
  const suffix = globalThis.foundry?.utils?.randomID?.(24)
    ?? (Date.now().toString(36) + Math.random().toString(36).slice(2));
  return fatalDamageInterceptionRememberTransactionId(
    options,
    String(actor?.uuid ?? "Actor") + ":" + suffix,
  );
}

function releaseFatalDamageInterceptionReservation(receipt) {
  const transactionKey = fatalDamageInterceptionTransactionKey(
    receipt?.actorUuid,
    receipt?.transactionId,
  );
  const reserved = FATAL_DAMAGE_INTERCEPTION_TRANSACTION_RESERVATIONS.get(transactionKey);
  if (!reserved || reserved.receiptId === receipt?.receiptId) {
    FATAL_DAMAGE_INTERCEPTION_TRANSACTION_RESERVATIONS.delete(transactionKey);
  }
  const sourceKey = fatalDamageInterceptionSourceReservationKey(
    receipt?.actorUuid,
    receipt?.sourceDocumentUuid,
  );
  if (FATAL_DAMAGE_INTERCEPTION_SOURCE_RESERVATIONS.get(sourceKey) === transactionKey) {
    FATAL_DAMAGE_INTERCEPTION_SOURCE_RESERVATIONS.delete(sourceKey);
  }
  const timer = FATAL_DAMAGE_INTERCEPTION_RESERVATION_TIMERS.get(transactionKey);
  if (timer) clearTimeout(timer);
  FATAL_DAMAGE_INTERCEPTION_RESERVATION_TIMERS.delete(transactionKey);
}

function reserveFatalDamageInterception(receipt) {
  const transactionKey = fatalDamageInterceptionTransactionKey(
    receipt.actorUuid,
    receipt.transactionId,
  );
  const sourceKey = fatalDamageInterceptionSourceReservationKey(
    receipt.actorUuid,
    receipt.sourceDocumentUuid,
  );
  FATAL_DAMAGE_INTERCEPTION_TRANSACTION_RESERVATIONS.set(transactionKey, receipt);
  FATAL_DAMAGE_INTERCEPTION_SOURCE_RESERVATIONS.set(sourceKey, transactionKey);
  const timer = setTimeout(() => {
    const current = FATAL_DAMAGE_INTERCEPTION_TRANSACTION_RESERVATIONS.get(transactionKey);
    if (current?.receiptId !== receipt.receiptId) return;
    FATAL_DAMAGE_INTERCEPTION_TRANSACTION_RESERVATIONS.delete(transactionKey);
    if (FATAL_DAMAGE_INTERCEPTION_SOURCE_RESERVATIONS.get(sourceKey) === transactionKey) {
      FATAL_DAMAGE_INTERCEPTION_SOURCE_RESERVATIONS.delete(sourceKey);
    }
    FATAL_DAMAGE_INTERCEPTION_RESERVATION_TIMERS.delete(transactionKey);
  }, FATAL_DAMAGE_INTERCEPTION_RESERVATION_TTL_MS);
  FATAL_DAMAGE_INTERCEPTION_RESERVATION_TIMERS.set(transactionKey, timer);
}

function collectFatalDamageInterceptionCandidates(actor) {
  if (!actor?.uuid) return [];
  const pendingSources = new Set(
    fatalDamageInterceptionPendingReceipts(actor)
      .map(receipt => String(receipt.sourceDocumentUuid ?? ""))
      .filter(Boolean),
  );
  const candidates = [];

  for (const effect of Array.from(actor.effects ?? [])) {
    const contract = fatalDamageInterceptionContract(effect);
    const sourceDocumentUuid = String(effect?.uuid ?? "");
    const sourceKey = fatalDamageInterceptionSourceReservationKey(
      actor.uuid,
      sourceDocumentUuid,
    );
    if (
      !isExactDeathWardInterceptionEffect(effect, actor, contract)
      || effect.disabled === true
      || effect.active === false
      || effect.isSuppressed === true
      || !sourceDocumentUuid
      || pendingSources.has(sourceDocumentUuid)
      || FATAL_DAMAGE_INTERCEPTION_SOURCE_RESERVATIONS.has(sourceKey)
    ) continue;
    candidates.push({
      candidateKind: contract.kind,
      rank: contract.rank,
      minimumHitPoints: contract.minimumHitPoints,
      sourceDocumentUuid,
      sourceActorUuid: arcaneEffectFlag(effect, "sourceActorUuid") ?? null,
      sourceItemUuid: arcaneEffectFlag(effect, "sourceItemUuid") ?? null,
      sourceEffectUuid: sourceDocumentUuid,
      artifactId: contract.artifactId,
      usesSpentBefore: null,
      usesSpentAfter: null,
      createdAt: Number(effect?._stats?.createdTime ?? 0) || 0,
    });
  }

  for (const item of Array.from(actor.items ?? [])) {
    const contract = fatalDamageInterceptionContract(item);
    const sourceDocumentUuid = String(item?.uuid ?? "");
    const sourceKey = fatalDamageInterceptionSourceReservationKey(
      actor.uuid,
      sourceDocumentUuid,
    );
    const max = Number(item.system?.uses?.max ?? 0);
    const spent = Number(item.system?.uses?.spent ?? 0);
    if (
      !isExactRelentlessEnduranceInterceptionItem(item, actor, contract)
      || !sourceDocumentUuid
      || pendingSources.has(sourceDocumentUuid)
      || FATAL_DAMAGE_INTERCEPTION_SOURCE_RESERVATIONS.has(sourceKey)
      || !Number.isFinite(max)
      || max <= 0
      || !Number.isFinite(spent)
      || spent < 0
      || spent >= max
    ) continue;
    candidates.push({
      candidateKind: contract.kind,
      rank: contract.rank,
      minimumHitPoints: contract.minimumHitPoints,
      sourceDocumentUuid,
      sourceActorUuid: actor.uuid,
      sourceItemUuid: sourceDocumentUuid,
      sourceEffectUuid: null,
      artifactId: null,
      usesSpentBefore: spent,
      usesSpentAfter: spent + 1,
      createdAt: Number(item?._stats?.createdTime ?? 0) || 0,
    });
  }

  return candidates.sort((left, right) =>
    left.rank - right.rank
    || right.createdAt - left.createdAt
    || left.sourceDocumentUuid.localeCompare(right.sourceDocumentUuid)
  );
}

function fatalDamageWouldKillOutright(actor, amount) {
  const hitPoints = actor?.system?.attributes?.hp;
  const current = Number(hitPoints?.value);
  const temporary = Number(hitPoints?.temp ?? 0);
  const maximum = Number(hitPoints?.max);
  const appliedAmount = Number(amount);
  if (
    !Number.isFinite(current)
    || !Number.isFinite(temporary)
    || !Number.isFinite(maximum)
    || !Number.isFinite(appliedAmount)
    || current <= 0
    || temporary < 0
    || maximum <= 0
    || appliedAmount <= 0
  ) return false;
  return appliedAmount - temporary - current >= maximum;
}

function writeFatalDamageInterceptionReceiptUpdate(updates, receipt) {
  const pendingPath = "flags." + MODULE_ID + "." + FATAL_DAMAGE_INTERCEPTION_PENDING_FLAG;
  const pendingUpdate = updates[pendingPath];
  if (pendingUpdate && typeof pendingUpdate === "object" && !Array.isArray(pendingUpdate)) {
    pendingUpdate[receipt.receiptId] = receipt;
  } else {
    updates[pendingPath + "." + receipt.receiptId] = receipt;
  }
}

function applyFatalDamageInterceptionPreDamage(actor, amount, updates, options = {}) {
  const hitPointPath = "system.attributes.hp.value";
  if (
    !actor?.uuid
    || !updates
    || typeof updates !== "object"
    || !Object.prototype.hasOwnProperty.call(updates, hitPointPath)
  ) return true;
  const current = Number(actor.system?.attributes?.hp?.value);
  const proposed = Number(updates[hitPointPath]);
  const appliedAmount = Number(amount);
  if (
    !Number.isFinite(current)
    || !Number.isFinite(proposed)
    || !Number.isFinite(appliedAmount)
    || current <= 0
    || appliedAmount <= 0
  ) return true;

  const existingTransactionId = fatalDamageInterceptionTransactionIdFromOptions(options);
  if (existingTransactionId) {
    const existingTransactionKey = fatalDamageInterceptionTransactionKey(
      actor.uuid,
      existingTransactionId,
    );
    const persisted = fatalDamageInterceptionPendingReceipts(actor).find(receipt =>
      isValidFatalDamageInterceptionReceipt(actor, receipt)
      && receipt.transactionId === existingTransactionId
    );
    if (persisted && proposed <= persisted.minimumHitPoints) {
      writeFatalDamageInterceptionReceiptUpdate(updates, persisted);
      updates[hitPointPath] = persisted.minimumHitPoints;
      return true;
    }
    const reserved = FATAL_DAMAGE_INTERCEPTION_TRANSACTION_RESERVATIONS.get(
      existingTransactionKey,
    );
    if (
      isValidFatalDamageInterceptionReceipt(actor, reserved)
      && proposed <= reserved.minimumHitPoints
    ) {
      writeFatalDamageInterceptionReceiptUpdate(updates, reserved);
      updates[hitPointPath] = reserved.minimumHitPoints;
      return true;
    }
  }

  if (proposed > 0 || proposed >= current) return true;
  // A transaction id is reusable only while its exact pending/reservation is
  // live. Midi damage-card reapply can reuse the same options object later;
  // that is a new damage transaction and must arbitrate a fresh source.
  const transactionId = existingTransactionId
    ? fatalDamageInterceptionRememberTransactionId(
      options,
      String(actor.uuid) + ":" + (
        globalThis.foundry?.utils?.randomID?.(24)
        ?? (Date.now().toString(36) + Math.random().toString(36).slice(2))
      ),
    )
    : fatalDamageInterceptionTransactionId(actor, options);
  const killedOutright = fatalDamageWouldKillOutright(actor, appliedAmount);
  const candidate = collectFatalDamageInterceptionCandidates(actor).find(currentCandidate =>
    currentCandidate.candidateKind !== "relentless-endurance" || !killedOutright
  );
  if (!candidate) return true;
  const receiptId = globalThis.foundry?.utils?.randomID?.(24)
    ?? (Date.now().toString(36) + Math.random().toString(36).slice(2));
  const receipt = {
    version: FATAL_DAMAGE_INTERCEPTION_VERSION,
    receiptId,
    transactionId,
    actorUuid: actor.uuid,
    status: "pending",
    candidateKind: candidate.candidateKind,
    rank: candidate.rank,
    sourceDocumentUuid: candidate.sourceDocumentUuid,
    sourceActorUuid: candidate.sourceActorUuid,
    sourceItemUuid: candidate.sourceItemUuid,
    sourceEffectUuid: candidate.sourceEffectUuid,
    artifactId: candidate.artifactId,
    usesSpentBefore: candidate.usesSpentBefore,
    usesSpentAfter: candidate.usesSpentAfter,
    originalHitPoints: current,
    originalNextHitPoints: proposed,
    minimumHitPoints: candidate.minimumHitPoints,
    damageAmount: appliedAmount,
    createdAt: Date.now(),
  };
  reserveFatalDamageInterception(receipt);
  try {
    writeFatalDamageInterceptionReceiptUpdate(updates, receipt);
    updates[hitPointPath] = candidate.minimumHitPoints;
  } catch (error) {
    releaseFatalDamageInterceptionReservation(receipt);
    throw error;
  }
  return true;
}

async function consumeFatalDamageInterceptionSource(actor, receipt) {
  const source = await fromUuid(receipt.sourceDocumentUuid);
  if (!source) return true;
  const contract = fatalDamageInterceptionContract(source);
  if (receipt.candidateKind === "death-ward") {
    if (
      !isExactDeathWardInterceptionEffect(
        source,
        actor,
        contract,
        receipt.artifactId,
      )
      || source.uuid !== receipt.sourceEffectUuid
    ) {
      throw new Error("Death Ward pending receipt no longer matches its exact source effect");
    }
    await source.delete({
      [MODULE_ID]: { fatalDamageInterceptionReceiptId: receipt.receiptId },
    });
    return true;
  }
  if (receipt.candidateKind === "relentless-endurance") {
    if (
      !isExactRelentlessEnduranceInterceptionItem(source, actor, contract)
      || source.uuid !== receipt.sourceItemUuid
    ) {
      throw new Error(
        "Relentless Endurance pending receipt no longer matches its exact source item"
      );
    }
    const spentBefore = Number(receipt.usesSpentBefore);
    const spentAfter = Number(receipt.usesSpentAfter);
    const currentSpent = Number(source.system?.uses?.spent ?? 0);
    if (
      !Number.isFinite(spentBefore)
      || !Number.isFinite(spentAfter)
      || spentAfter !== spentBefore + 1
      || !Number.isFinite(currentSpent)
    ) {
      throw new Error("Relentless Endurance pending receipt has invalid use accounting");
    }
    const lastReceiptId = String(
      source.getFlag?.(MODULE_ID, "fatalDamageInterceptionLastReceiptId")
      ?? source.flags?.[MODULE_ID]?.fatalDamageInterceptionLastReceiptId
      ?? "",
    );
    if (currentSpent >= spentAfter) {
      if (lastReceiptId === receipt.receiptId) return true;
      throw new Error("Relentless Endurance use was spent by another transaction");
    }
    if (currentSpent !== spentBefore) {
      throw new Error("Relentless Endurance use state diverged before settlement");
    }
    await source.update({
      "system.uses.spent": spentAfter,
      ["flags." + MODULE_ID + ".fatalDamageInterceptionLastReceiptId"]:
        receipt.receiptId,
    });
    if (
      Number(source.system?.uses?.spent ?? 0) < spentAfter
      || String(
        source.getFlag?.(MODULE_ID, "fatalDamageInterceptionLastReceiptId")
        ?? source.flags?.[MODULE_ID]?.fatalDamageInterceptionLastReceiptId
        ?? "",
      ) !== receipt.receiptId
    ) {
      throw new Error("Relentless Endurance use update did not settle");
    }
    return true;
  }
  throw new Error("Unknown fatal damage interception candidate kind");
}

async function clearFatalDamageInterceptionReceipt(actor, receipt) {
  const pending = fatalDamageInterceptionPendingReceipts(actor);
  if (!pending.some(candidate => candidate.receiptId === receipt.receiptId)) return true;
  await actor.update({
    [
      "flags." + MODULE_ID + "." + FATAL_DAMAGE_INTERCEPTION_PENDING_FLAG
      + ".-=" + receipt.receiptId
    ]: null,
  }, {
    [MODULE_ID]: { fatalDamageInterceptionSettlement: true },
  });
  return true;
}

async function announceFatalDamageInterception(actor, receipt) {
  const label = receipt.candidateKind === "death-ward"
    ? "Death Ward"
    : "Relentless Endurance";
  try {
    await ChatMessage.create({
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor }),
      content:
        "<p><strong>" + label + ":</strong> "
        + actor.name + " drops to 1 HP instead.</p>",
    });
  } catch (error) {
    console.warn("[" + MODULE_ID + "] Fatal damage interception chat failed", error);
  }
}

async function settleFatalDamageInterceptionReceipt(actor, receipt) {
  if (!isValidFatalDamageInterceptionReceipt(actor, receipt)) {
    throw new Error("Invalid fatal damage interception pending receipt");
  }
  const persisted = fatalDamageInterceptionPendingReceipts(actor).find(current =>
    current.receiptId === receipt.receiptId
  );
  if (!persisted) {
    // A full workflow undo or an explicit DM recovery removed the transaction
    // before this queued settlement began. It must not consume a restored
    // protection after the fact.
    releaseFatalDamageInterceptionReservation(receipt);
    FATAL_DAMAGE_INTERCEPTION_FAILURE_NOTICES.delete(
      fatalDamageInterceptionTransactionKey(actor.uuid, receipt.receiptId),
    );
    return false;
  }
  if (
    !isValidFatalDamageInterceptionReceipt(actor, persisted)
    || !sameFatalDamageInterceptionReceipt(receipt, persisted)
  ) {
    throw new Error("Fatal damage interception receipt changed before settlement");
  }
  await consumeFatalDamageInterceptionSource(actor, persisted);
  await clearFatalDamageInterceptionReceipt(actor, persisted);
  releaseFatalDamageInterceptionReservation(persisted);
  FATAL_DAMAGE_INTERCEPTION_FAILURE_NOTICES.delete(
    fatalDamageInterceptionTransactionKey(actor.uuid, persisted.receiptId),
  );
  await announceFatalDamageInterception(actor, persisted);
  return true;
}

async function executeFatalDamageInterceptionSettlement(actor) {
  const receipts = fatalDamageInterceptionPendingReceipts(actor).sort((left, right) =>
    Number(left.createdAt ?? 0) - Number(right.createdAt ?? 0)
    || left.receiptId.localeCompare(right.receiptId)
  );
  const liveNoticeKeys = new Set(receipts.map(receipt =>
    fatalDamageInterceptionTransactionKey(actor.uuid, receipt.receiptId)
  ));
  for (const noticeKey of Array.from(FATAL_DAMAGE_INTERCEPTION_FAILURE_NOTICES)) {
    if (
      noticeKey.startsWith(fatalDamageInterceptionTransactionKey(actor.uuid, ""))
      && !liveNoticeKeys.has(noticeKey)
    ) FATAL_DAMAGE_INTERCEPTION_FAILURE_NOTICES.delete(noticeKey);
  }
  for (const receipt of receipts) {
    try {
      await settleFatalDamageInterceptionReceipt(actor, receipt);
    } catch (error) {
      console.warn(
        "[" + MODULE_ID + "] Fatal damage interception settlement failed for "
        + receipt.receiptId,
        error,
      );
      const noticeKey = fatalDamageInterceptionTransactionKey(
        actor.uuid,
        receipt.receiptId,
      );
      if (!FATAL_DAMAGE_INTERCEPTION_FAILURE_NOTICES.has(noticeKey)) {
        FATAL_DAMAGE_INTERCEPTION_FAILURE_NOTICES.add(noticeKey);
        ui.notifications?.error?.(
          "Fatal-damage protection for " + actor.name
          + " is pending settlement. Keep the Actor at 1 HP and retry recovery or resolve the exact source manually.",
          { permanent: true },
        );
      }
    }
  }
  return true;
}

async function settleFatalDamageInterceptions(actor) {
  if (!isPrimaryAutomationGM() || !actor?.uuid) return true;
  const actorKey = actor.uuid;
  const previous = FATAL_DAMAGE_INTERCEPTION_ACTOR_QUEUES.get(actorKey)
    ?? Promise.resolve();
  const current = previous.catch(() => undefined).then(() =>
    executeFatalDamageInterceptionSettlement(actor)
  );
  FATAL_DAMAGE_INTERCEPTION_ACTOR_QUEUES.set(actorKey, current);
  try {
    return await current;
  } finally {
    if (FATAL_DAMAGE_INTERCEPTION_ACTOR_QUEUES.get(actorKey) === current) {
      FATAL_DAMAGE_INTERCEPTION_ACTOR_QUEUES.delete(actorKey);
    }
  }
}

function fatalDamageInterceptionRecoveryActors() {
  const actors = new Map();
  for (const actor of Array.from(game.actors ?? [])) {
    if (actor?.uuid) actors.set(actor.uuid, actor);
  }
  for (const scene of Array.from(game.scenes ?? [])) {
    for (const token of Array.from(scene?.tokens ?? [])) {
      if (token?.actor?.uuid) actors.set(token.actor.uuid, token.actor);
    }
  }
  for (const token of Array.from(canvas.tokens?.placeables ?? [])) {
    if (token?.actor?.uuid) actors.set(token.actor.uuid, token.actor);
  }
  return Array.from(actors.values());
}

async function recoverFatalDamageInterceptions() {
  if (!isPrimaryAutomationGM()) return true;
  await Promise.all(
    fatalDamageInterceptionRecoveryActors().map(actor =>
      settleFatalDamageInterceptions(actor)
    ),
  );
  return true;
}

function isUndeadOrFiendActor(actor) {
  return /(^|[^A-Za-z0-9_])(undead|fiend|不死|邪魔)([^A-Za-z0-9_]|$)/i.test(actorRaceOrType(actor));
}

function spellSlotPath(level) {
  const slotLevel = Math.max(1, Math.min(9, Number(level) || 1));
  return `system.spells.spell${slotLevel}.value`;
}

function availableSpellSlotValue(actor, level) {
  const slotLevel = Math.max(1, Math.min(9, Number(level) || 1));
  const slot = actor?.system?.spells?.[`spell${slotLevel}`];
  const value = Number(slot?.value ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function resolveDivineSmiteSlot(actor, requestedLevel) {
  const parsedRequestedLevel = Number(requestedLevel);
  if (Number.isFinite(parsedRequestedLevel) && parsedRequestedLevel > 0) {
    const slotLevel = Math.max(1, Math.min(9, parsedRequestedLevel));
    return availableSpellSlotValue(actor, slotLevel) > 0 ? slotLevel : null;
  }

  for (let slotLevel = 1; slotLevel <= 9; slotLevel += 1) {
    if (availableSpellSlotValue(actor, slotLevel) > 0) return slotLevel;
  }

  return null;
}

async function consumeSpellSlot(actor, level) {
  const slotLevel = Math.max(1, Math.min(9, Number(level) || 1));
  const value = availableSpellSlotValue(actor, slotLevel);
  if (!actor || value <= 0) return false;
  await actor.update({ [spellSlotPath(slotLevel)]: value - 1 });
  return true;
}

function divineSmiteDice(slotLevel, hitTargets) {
  const baseDice = Math.min(5, Math.max(1, Number(slotLevel) || 1) + 1);
  const bonusDice = hitTargets.some(target => isUndeadOrFiendActor(target.actor)) ? 1 : 0;
  return baseDice + bonusDice;
}

function isCriticalHitWorkflow(workflow) {
  // Midi's workflow result is authoritative when present. A forced-success
  // attack can make a Roll getter report isCritical=true (for example a
  // 1d20min99 QA roll) while Midi correctly records workflow.isCritical
  // as false. Never let a derived Roll value override that explicit result.
  if (typeof workflow?.isCritical === "boolean") return workflow.isCritical;
  if (typeof workflow?.critical === "boolean") return workflow.critical;
  return [
    workflow?.attackRoll?.isCritical,
    workflow?.d20AttackRoll?.isCritical,
    workflow?.attackRoll?.options?.critical,
    workflow?.d20AttackRoll?.options?.critical,
  ].some(value => value === true);
}

async function createDivineSmiteResultMessage(actor, status, detail) {
  await ChatMessage.create({
    user: game.user?.id,
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `<p><strong>Divine Smite:</strong> ${status}</p><p>${detail}</p>`,
  });
}

async function createDreadAmbusherResultMessage(actor, status, detail) {
  await ChatMessage.create({
    user: game.user?.id,
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `<p><strong>Dread Ambusher:</strong> ${status}</p><p>${detail}</p>`,
  });
}

async function applyDivineSmiteDamageWorkflow(workflow, hitTargets, dice, slotLevel, isCritical) {
  await applyExtraDamageSegment(workflow, {
    riderId: DIVINE_SMITE_IDENTIFIER,
    formula: `${dice}d8`,
    damageType: "radiant",
    flavor: `Divine Smite - Level ${slotLevel} Spell Slot${isCritical ? " Critical" : ""} (Radiant)`,
    targets: hitTargets,
    isCritical,
    resource: { type: "spellSlot", level: slotLevel },
  });
}

async function applyDeclaredDivineSmite(item, usageConfig, workflow) {
  const rider = declaredDivineSmiteRider(usageConfig, workflow);
  if (!rider) return true;

  const actor = workflow?.actor ?? item?.actor;
  const smiteFeature = actor?.items?.find(candidate => candidate.system?.identifier === DIVINE_SMITE_IDENTIFIER);
  if (!actor || !smiteFeature) return true;

  if (!isMeleeWeaponWorkflow(workflow)) {
    await createDivineSmiteResultMessage(actor, "skipped", "The triggering workflow was not a melee weapon attack.");
    return true;
  }

  const hitTargets = workflowHitTargets(workflow);
  if (hitTargets.length === 0) {
    await createDivineSmiteResultMessage(actor, "skipped", "The attack did not hit, so no spell slot was consumed.");
    return true;
  }

  const requestedLevel = rider.spellLevel ?? rider.level;
  const slotLevel = resolveDivineSmiteSlot(actor, requestedLevel);
  if (!slotLevel) {
    const requested = Number(requestedLevel);
    const detail = Number.isFinite(requested) && requested > 0
      ? `No available level ${Math.max(1, Math.min(9, requested))} spell slot.`
      : "No available spell slot.";
    await createDivineSmiteResultMessage(actor, "skipped", detail);
    return true;
  }

  const slotBefore = availableSpellSlotValue(actor, slotLevel);
  const consumed = await consumeSpellSlot(actor, slotLevel);
  if (!consumed) {
    await createDivineSmiteResultMessage(actor, "skipped", `No available level ${slotLevel} spell slot.`);
    return true;
  }

  const isCritical = isCriticalHitWorkflow(workflow);
  const dice = divineSmiteDice(slotLevel, hitTargets) * (isCritical ? 2 : 1);
  await applyDivineSmiteDamageWorkflow(workflow, hitTargets, dice, slotLevel, isCritical);
  workflow.flags ??= {};
  workflow.flags[MODULE_ID] = {
    ...(workflow.flags[MODULE_ID] ?? {}),
    divineSmiteResource: { type: "spellSlot", level: slotLevel, before: slotBefore, after: availableSpellSlotValue(actor, slotLevel) },
  };
  return true;
}

function sneakAttackDamageFormula(actor, isCritical) {
  const rollData = actor?.getRollData?.() ?? {};
  const resolved = String(
    Roll.replaceFormulaData(SNEAK_ATTACK_DAMAGE_FORMULA, rollData),
  ).trim();
  if (!resolved || resolved.includes("@")) {
    throw new Error("Sneak Attack could not resolve the Rogue sneak-attack scale");
  }
  if (!isCritical) return resolved;

  const doubled = resolved.replace(/(\d+)d(\d+)/gi, (_match, dice, faces) =>
    String(Number(dice) * 2) + "d" + faces
  );
  if (doubled === resolved) {
    throw new Error("Sneak Attack critical damage requires a dice scale formula");
  }
  return doubled;
}

async function applyDeclaredSneakAttack(item, usageConfig, workflow) {
  if (!declaredSneakAttackRider(usageConfig, workflow)) return true;

  const actor = workflow?.actor ?? item?.actor;
  const sneakAttackFeature = actor?.items?.find(candidate =>
    candidate.system?.identifier === SNEAK_ATTACK_IDENTIFIER
  );
  if (!actor || !sneakAttackFeature) return true;

  // The DM's explicit declaration is the rules decision. Runtime deliberately
  // does not re-check weapon properties, roll mode, adjacency, or turn usage.
  // It only waits for the parent workflow's final hit result before damage.
  const hitTargets = effectHostHitTargets(workflow);
  if (hitTargets.length === 0) return true;

  const isCritical = isCriticalHitWorkflow(workflow);
  await applyExtraDamageSegment(workflow, {
    riderId: SNEAK_ATTACK_IDENTIFIER,
    formula: sneakAttackDamageFormula(actor, isCritical),
    damageType: workflowDamageType(workflow),
    flavor: "Sneak Attack" + (isCritical ? " Critical" : ""),
    targets: hitTargets,
    isCritical,
    img: sneakAttackFeature.img,
  });
  return true;
}

function dreadAmbusherFeature(actor) {
  return actor?.items?.find(candidate => candidate.system?.identifier === DREAD_AMBUSHER_IDENTIFIER);
}

function dreadAmbusherAvailable(feature) {
  const max = Number(feature?.system?.uses?.max ?? 0);
  const spent = Number(feature?.system?.uses?.spent ?? 0);
  return !Number.isFinite(max) || max <= 0 || spent < max;
}

async function consumeDreadAmbusherUse(feature) {
  const max = Number(feature?.system?.uses?.max ?? 0);
  const spent = Number(feature?.system?.uses?.spent ?? 0);
  if (Number.isFinite(max) && max > 0 && spent >= max) return false;
  if (Number.isFinite(max) && max > 0) {
    await feature.update({ "system.uses.spent": Math.min(max, spent + 1) });
  }
  return true;
}

function isCombatRoundOneForActor(actor) {
  const combat = game.combat;
  if (!combat || Number(combat.round ?? 0) !== 1) return false;
  const combatantActor = combat.combatant?.actor;
  if (!combatantActor) return true;
  return combatantActor.uuid === actor?.uuid || combatantActor.id === actor?.id;
}

async function applyDeclaredDreadAmbusher(item, usageConfig, workflow) {
  const rider = declaredDreadAmbusherRider(usageConfig, workflow);
  if (!rider) return true;

  const actor = workflow?.actor ?? item?.actor;
  const feature = dreadAmbusherFeature(actor);
  if (!actor || !feature) return true;

  if (!isWeaponWorkflow(workflow)) {
    await createDreadAmbusherResultMessage(actor, "skipped", "The triggering workflow was not a weapon attack.");
    return true;
  }
  if (!isCombatRoundOneForActor(actor)) {
    await createDreadAmbusherResultMessage(actor, "skipped", "Dread Ambusher extra damage is only available on the actor's first combat turn.");
    return true;
  }

  const hitTargets = workflowHitTargets(workflow);
  if (!hitTargets.length) {
    await createDreadAmbusherResultMessage(actor, "skipped", "The attack did not hit, so Dread Ambusher was not spent.");
    return true;
  }
  if (!dreadAmbusherAvailable(feature)) {
    await createDreadAmbusherResultMessage(actor, "skipped", "Dread Ambusher has already been used.");
    return true;
  }

  const spentBefore = Number(feature.system?.uses?.spent ?? 0);
  const consumed = await consumeDreadAmbusherUse(feature);
  if (!consumed) {
    await createDreadAmbusherResultMessage(actor, "skipped", "Dread Ambusher has already been used.");
    return true;
  }

  const isCritical = isCriticalHitWorkflow(workflow);
  await applyExtraDamageSegment(workflow, {
    riderId: DREAD_AMBUSHER_IDENTIFIER,
    formula: isCritical ? "2d8" : "1d8",
    damageType: workflowDamageType(workflow),
    flavor: `Dread Ambusher${isCritical ? " Critical" : ""}`,
    targets: hitTargets,
    isCritical,
    resource: { type: "itemUses", itemUuid: feature.uuid, before: spentBefore, after: Number(feature.system?.uses?.spent ?? spentBefore + 1) },
  });
  return true;
}

async function createWeaponSpellRiderMessage(actor, name, status, detail) {
  await ChatMessage.create({
    user: game.user?.id,
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `<p><strong>${name}:</strong> ${status}</p><p>${detail}</p>`,
  });
}

function actorHasSpellIdentifier(actor, identifiers) {
  const wanted = new Set(identifiers);
  return actor?.items?.find(candidate => candidate.type === "spell" && wanted.has(candidate.system?.identifier));
}

function availableSpellRiderSlot(actor, requestedLevel, minSlotLevel) {
  const minimum = Math.max(1, Math.min(9, Number(minSlotLevel) || 1));
  if (requestedLevel === undefined || requestedLevel === null) {
    return availableSpellSlotValue(actor, minimum) > 0 ? minimum : null;
  }
  if (
    typeof requestedLevel !== "number"
    || !Number.isInteger(requestedLevel)
    || requestedLevel < minimum
    || requestedLevel > 9
  ) return null;
  return availableSpellSlotValue(actor, requestedLevel) > 0
    ? requestedLevel
    : null;
}

function bonusActionAlreadyUsed(actor) {
  const midi = globalThis.MidiQOL;
  if (typeof midi?.hasUsedBonusAction !== "function") return false;
  try {
    return Boolean(midi.hasUsedBonusAction(actor));
  } catch (error) {
    console.warn(`[${MODULE_ID}] midi-qol bonus action check failed`, error);
    return false;
  }
}

async function markBonusActionUsed(actor) {
  const midi = globalThis.MidiQOL;
  if (typeof midi?.setBonusActionUsed !== "function") return;
  try {
    await midi.setBonusActionUsed(actor);
  } catch (error) {
    console.warn(`[${MODULE_ID}] midi-qol bonus action mark failed`, error);
  }
}

async function applyWeaponSpellRiderEffect(workflow, hitTargets, spec, spellItem, slotLevel) {
  if (Array.isArray(spec.removeStatuses) && spec.removeStatuses.length) {
    for (const status of spec.removeStatuses) {
      for (const target of hitTargets) {
        if (target.actor?.statuses?.has(status)) await target.actor.toggleStatusEffect(status, { active: false });
      }
    }
    await removeEffectsFromTargets(hitTargets, effect =>
      Array.from(effect.statuses ?? []).some(status => spec.removeStatuses.includes(status))
    );
  }
  const actor = workflow?.actor;
  const compilerSaveActivityIdentifier =
    spellItem?.flags?.[MODULE_ID]?.declaredWeaponSpellRider?.saveActivityIdentifier;
  const saveActivityIdentifier = compilerSaveActivityIdentifier ?? spec.saveActivityIdentifier;
  if (saveActivityIdentifier) {
    const activity = Array.from(spellItem?.system?.activities ?? []).find(candidate =>
      candidate.midiProperties?.identifier === saveActivityIdentifier
    );
    if (!activity) throw new Error(spec.name + " is missing its rider save activity");
    for (const target of hitTargets) {
      await executeCompilerEventNeighborhoodActivity({
        sourceItem: spellItem,
        activityIdentifier: saveActivityIdentifier,
        parentWorkflow: workflow,
        anchorTarget: target,
        castLevel: slotLevel,
      });
    }
    return;
  }
  if (!spec.effect) return;

  const effectData = effectDataFromItem(
    spellItem,
    effect => arcaneEffectFlag(effect, "declaredWeaponSpellRider") === true,
    actor
  ) ?? simpleSpellEffectData(spellItem, actor, {
    name: spec.effect.name,
    durationSeconds: spec.effect.durationSeconds,
  });
  effectData.flags ??= {};
  effectData.flags[MODULE_ID] = {
    ...(effectData.flags[MODULE_ID] ?? {}),
    declaredWeaponSpellRider: true,
    riderName: spec.name,
    castLevel: slotLevel,
  };
  await applyEffectDataToTokens(hitTargets, effectData);
}

async function prepareDeclaredWeaponSpellRiderDamage(workflow, activity, config) {
  if (!workflow || !config || DECLARED_WEAPON_SPELL_RIDER_STATES.has(workflow)) return true;
  const actor = workflow.actor ?? activity?.actor;
  if (!actor) return true;
  const match = declaredWeaponSpellRider(null, workflow, actor);
  if (!match) return true;

  const { rider, spec } = match;
  const spellItem = match.spellItem ?? actorHasSpellIdentifier(actor, spec.itemIdentifiers);
  if (!spellItem || !weaponSpellRiderAttackAllowed(workflow, spec)) return true;

  const hitTargets = workflowHitTargets(workflow);
  if (hitTargets.length !== 1) return true;
  if (spec.requiresBonusAction && bonusActionAlreadyUsed(actor)) return true;

  const requestedLevel = rider.spellLevel ?? rider.level;
  const slotLevel = availableSpellRiderSlot(actor, requestedLevel, spec.minSlotLevel);
  if (!slotLevel) return true;

  const formula = spec.damageFormula?.(slotLevel) ?? null;
  const riderId = spellItem.system?.identifier ?? rider.id ?? rider.identifier;
  const isCritical = isCriticalHitWorkflow(workflow);
  const flavor = `${spec.name} - Level ${slotLevel} Spell Slot`
    + (formula && isCritical ? " Critical" : "")
    + (formula && spec.damageType ? ` (${spec.damageType})` : "");
  const slotBefore = availableSpellSlotValue(actor, slotLevel);
  const resource = {
    type: "spellSlot",
    key: "spell" + slotLevel,
    level: slotLevel,
    before: slotBefore,
    after: Math.max(0, slotBefore - 1),
    itemUuid: spellItem.uuid,
  };
  const consumed = await consumeSpellSlot(actor, slotLevel);
  if (!consumed) return true;
  resource.after = availableSpellSlotValue(actor, slotLevel);
  if (spec.requiresBonusAction) await markBonusActionUsed(actor);

  if (formula) {
    const rollConfig = {
      parts: [formula],
      data: spellItem.getRollData?.() ?? actor.getRollData?.() ?? {},
      options: {
        type: spec.damageType,
        types: [spec.damageType],
        properties: ["spell"],
        flavor,
        [MODULE_ID]: {
          damageRole: "extra",
          declaredWeaponSpellRider: true,
          riderId,
          sourceItemUuid: spellItem.uuid,
          resource,
          damageType: spec.damageType,
        },
      },
    };
    config.rolls = Array.isArray(config.rolls) ? config.rolls : [];
    config.rolls.push(rollConfig);
  }
  DECLARED_WEAPON_SPELL_RIDER_STATES.set(workflow, {
    rider,
    spec,
    spellItem,
    hitTargets,
    slotLevel,
    formula,
    riderId,
    flavor,
    resource,
    finalized: !formula,
  });
  return true;
}

function declaredWeaponSpellRiderDamageRoll(workflow, state) {
  return workflowDamageRolls(workflow).find(roll =>
    roll?.options?.[MODULE_ID]?.declaredWeaponSpellRider === true
    && roll?.options?.[MODULE_ID]?.riderId === state?.riderId
  );
}

async function finalizeDeclaredWeaponSpellRiderDamage(workflow) {
  const state = DECLARED_WEAPON_SPELL_RIDER_STATES.get(workflow);
  if (!state || state.finalized) return true;
  const roll = declaredWeaponSpellRiderDamageRoll(workflow, state);
  if (!roll) return true;
  const damageCorrelationId = [
    "declared-weapon-spell-rider",
    workflow?.uuid ?? workflow?.id ?? workflow?.itemCardId ?? "workflow",
    state.riderId,
    foundry.utils.randomID(),
  ].join(":");
  workflow.flagTags ??= {};
  workflow.flagTags[MODULE_ID] = {
    ...(workflow.flagTags[MODULE_ID] ?? {}),
    damageCorrelationId,
    parentItemCardId: workflow?.itemCardId,
    parentWorkflowId: workflow?.uuid ?? workflow?.id ?? null,
    sourceItemUuid: state.spellItem?.uuid ?? null,
    riderId: state.riderId,
  };
  state.pendingSegments = registerPendingDamageSegment(workflow, {
    riderId: state.riderId,
    formula: state.formula,
    damageType: state.spec.damageType,
    flavor: state.flavor,
    targets: state.hitTargets,
    isCritical: Boolean(roll.isCritical ?? isCriticalHitWorkflow(workflow)),
    resource: state.resource,
    sourceItemUuid: state.spellItem?.uuid ?? null,
    damageCorrelationId,
  }, roll, state.spec.damageType, state.flavor, state.hitTargets);
  state.finalized = true;
  return true;
}

function damageMessageBelongsToPendingSegment(message, pendingSegment) {
  if (!message || !pendingSegment) return false;
  const requiredCorrelationId = String(
    pendingSegment.damageCorrelationId ?? "",
  ).trim();
  if (requiredCorrelationId) {
    const observedCorrelationId = String(
      messageArcaneFlags(message)?.damageCorrelationId ?? "",
    ).trim();
    return observedCorrelationId === requiredCorrelationId;
  }
  if (pendingSegment.knownMessageIds?.has?.(message.id)) return false;
  const timestamp = Number(message?.timestamp ?? message?._source?.timestamp);
  if (
    Number.isFinite(timestamp)
    && Number.isFinite(Number(pendingSegment.registeredAt))
    && timestamp + 1000 < Number(pendingSegment.registeredAt)
  ) return false;
  return true;
}

function authoritativePendingDamageReceipt(pendingSegments, target) {
  const wanted = Array.from(pendingSegments ?? []).filter(pending =>
    Boolean(String(pending?.damageCorrelationId ?? "").trim())
  );
  const targetUuids = new Set(damageTargetUuids(target));
  if (!wanted.length || !targetUuids.size) return null;
  const observations = new Map();
  for (const message of Array.from(game.messages ?? [])) {
    if (!wanted.some(pending =>
      damageMessageBelongsToPendingSegment(message, pending)
    )) continue;
    for (const entry of messageUndoDamage(message)) {
      const entryUuids = undoDamageTargetUuids(entry);
      if (!entryUuids.some(uuid => targetUuids.has(uuid))) continue;
      const matched = wanted.some(pending =>
        damageMessageBelongsToPendingSegment(message, pending)
        &&
        (pending.targetUuids ?? []).some(uuid => entryUuids.includes(uuid))
      );
      if (!matched) continue;
      const finiteValues = key => [entry?.[key], entry?.damageItem?.[key]]
        .filter(value => value !== null && value !== undefined && value !== "")
        .map(Number)
        .filter(Number.isFinite);
      const oldHitPoints = finiteValues("oldHP")[0];
      const newHitPoints = finiteValues("newHP")[0];
      if (
        !Number.isFinite(oldHitPoints)
        || !Number.isFinite(newHitPoints)
      ) continue;
      const hpDelta = Math.max(0, oldHitPoints - newHitPoints);
      const explicitHitPointDamage = finiteValues("hpDamage");
      if (explicitHitPointDamage.some(value => value !== hpDelta)) continue;
      const hitPointDamage = explicitHitPointDamage[0] ?? hpDelta;
      const appliedDamageValues = finiteValues("appliedDamage");
      const totalDamageValues = finiteValues("totalDamage");
      const appliedDamage = appliedDamageValues[0] ?? totalDamageValues[0];
      const totalDamage = totalDamageValues[0];
      const receipt = {
        schema: "arcane.authoritative-damage-receipt.v1",
        targetUuid: damageTargetUuid(target) ?? entryUuids[0],
        actorUuid:
          entry?.actorUuid
          ?? entry?.damageItem?.actorUuid
          ?? target?.actor?.uuid
          ?? null,
        messageUuid: message?.uuid ?? (message?.id ? "ChatMessage." + message.id : null),
        oldHitPoints,
        newHitPoints,
        hitPointDamage,
        appliedDamage: Number.isFinite(appliedDamage) ? appliedDamage : null,
        totalDamage: Number.isFinite(totalDamage) ? totalDamage : null,
      };
      const key = [
        receipt.actorUuid,
        receipt.targetUuid,
        oldHitPoints,
        newHitPoints,
        hitPointDamage,
        receipt.appliedDamage,
        receipt.totalDamage,
      ].join(":");
      observations.set(key, receipt);
    }
  }
  return observations.size === 1 ? observations.values().next().value : null;
}

async function dispatchDeclaredRiderPerSpellScript(workflow, state) {
  const plan = perSpellScriptPlan(state?.spellItem);
  const runtimeRuleId =
    state?.spellItem?.flags?.[MODULE_ID]?.declaredWeaponSpellRider?.runtimeRuleId;
  const handlers = (plan?.handlers ?? []).filter(handler =>
    handler.event === "declared-rider-after-damage"
    && handler.runtimeRuleId === runtimeRuleId
  );
  if (!handlers.length || !isPrimaryAutomationGM()) return [];
  const observed = await waitForPendingDamageSegments(state.pendingSegments ?? []);
  const target = state.hitTargets?.[0] ?? null;
  const damageReceipt = observed
    ? authoritativePendingDamageReceipt(state.pendingSegments ?? [], target)
    : null;
  if (damageReceipt) {
    return dispatchPerSpellScript({
      event: "declared-rider-after-damage",
      item: state.spellItem,
      workflow,
      target,
      damageReceipt,
      committed: true,
      matches: handler => handler.runtimeRuleId === runtimeRuleId,
    });
  }
  return handlers.map(handler => appendPerSpellScriptReceipt(
    workflow,
    perSpellScriptReceipt({
      plan,
      handler,
      item: state.spellItem,
      workflow,
      target,
      sourceEffect: null,
      status: "indeterminate",
      committed: true,
      retry: false,
      details: {
        message: "Parent damage committed but one exact authoritative HP receipt was not observed",
      },
    }),
  ));
}

async function applyDeclaredWeaponSpellRider(item, usageConfig, workflow) {
  const actor = workflow?.actor ?? item?.actor;
  if (!actor) return true;
  const prepared = DECLARED_WEAPON_SPELL_RIDER_STATES.get(workflow);
  if (prepared) {
    try {
      if (!prepared.finalized) {
        await createWeaponSpellRiderMessage(
          actor,
          prepared.spec.name,
          "partial",
          "The spell slot was consumed, but the parent damage roll did not complete.",
        );
        return true;
      }
      await applyWeaponSpellRiderEffect(
        workflow,
        prepared.hitTargets,
        prepared.spec,
        prepared.spellItem,
        prepared.slotLevel,
      );
      await dispatchDeclaredRiderPerSpellScript(workflow, prepared);
      if (prepared.spec.note) {
        await createWeaponSpellRiderMessage(actor, prepared.spec.name, "resolved", prepared.spec.note);
      }
      return true;
    } finally {
      DECLARED_WEAPON_SPELL_RIDER_STATES.delete(workflow);
    }
  }

  const match = declaredWeaponSpellRider(usageConfig, workflow, actor);
  if (!match) return true;

  const { rider, spec } = match;
  const spellItem = match.spellItem ?? actorHasSpellIdentifier(actor, spec.itemIdentifiers);
  if (!spellItem) {
    await createWeaponSpellRiderMessage(actor, spec.name, "skipped", "The actor does not have the matching spell item.");
    return true;
  }

  if (!weaponSpellRiderAttackAllowed(workflow, spec)) {
    await createWeaponSpellRiderMessage(actor, spec.name, "skipped", "The triggering workflow was not the required weapon attack type.");
    return true;
  }

  const hitTargets = workflowHitTargets(workflow);
  if (!hitTargets.length) {
    await createWeaponSpellRiderMessage(actor, spec.name, "skipped", "The attack did not hit, so no spell slot was consumed.");
    return true;
  }

  if (spec.requiresBonusAction && bonusActionAlreadyUsed(actor)) {
    await createWeaponSpellRiderMessage(actor, spec.name, "skipped", "midi-qol reports the actor has already used a bonus action.");
    return true;
  }

  const requestedLevel = rider.spellLevel ?? rider.level;
  const slotLevel = availableSpellRiderSlot(actor, requestedLevel, spec.minSlotLevel);
  if (!slotLevel) {
    await createWeaponSpellRiderMessage(actor, spec.name, "skipped", `No available level ${spec.minSlotLevel}+ spell slot.`);
    return true;
  }

  await createWeaponSpellRiderMessage(
    actor,
    spec.name,
    "skipped",
    "The rider was not attached to the parent damage workflow, so no spell slot was consumed.",
  );
  return true;
}

const RANGER_TCE_PATCH_IDENTIFIER = "ranger-tce-optional-features-patch";
const RANGER_TCE_PATCH_VERSION = 1;
const CHARACTER_PATCH_PACK_ID = MODULE_ID + ".characterpatches";
const CLASS_FEATURE_PACK_ID = MODULE_ID + ".classfeatures";
const RANGER_TCE_FEATURES_BY_LEVEL = [
  { level: 1, packId: CLASS_FEATURE_PACK_ID, id: "X9xPihIslNck5bCk", identifier: "favored-foe" },
  { level: 1, packId: CLASS_FEATURE_PACK_ID, id: "KyGD0UqLk90Er2cd", identifier: "deft-explorer" },
  { level: 1, packId: CLASS_FEATURE_PACK_ID, id: "dyR8ImgN3MyQCMJ1", identifier: "canny" },
  { level: 2, packId: CLASS_FEATURE_PACK_ID, id: "W8IgV3zZSWduIjd0", identifier: "additional-ranger-spells" },
  { level: 3, packId: CLASS_FEATURE_PACK_ID, id: "1ViKFKTqfFSHAiM5", identifier: "primal-awareness" },
  { level: 3, packId: CHARACTER_PATCH_PACK_ID, id: "arcPrimalSpeak01", identifier: "speak-with-animals-primal-awareness" },
  { level: 5, packId: CHARACTER_PATCH_PACK_ID, id: "arcPrimalBeast01", identifier: "beast-sense-primal-awareness" },
  { level: 6, packId: CLASS_FEATURE_PACK_ID, id: "WYSbzjOzh5IVQYR1", identifier: "roving" },
];
const RANGER_PHB_REPLACED_FEATURE_IDS = new Set(["4Vpj9vCOB37GtXk6", "8fbZt2Qh7ZttwIan"]);
const RANGER_PHB_REPLACED_IDENTIFIERS = new Set(["favored-enemy", "natural-explorer"]);

function itemIdentifier(item) {
  return item?.system?.identifier || item?.flags?.[MODULE_ID]?.sourceIdentifier || "";
}

function isRangerTcePatchItem(item) {
  return item?.type === "feat"
    && (itemIdentifier(item) === RANGER_TCE_PATCH_IDENTIFIER || item?.flags?.[MODULE_ID]?.rangerTcePatch === true);
}

async function compendiumItemDocument(packId, id, identifier) {
  const pack = game.packs.get(packId);
  if (!pack) return null;
  if (id) {
    const direct = await pack.getDocument(id).catch(() => null);
    if (direct) return direct;
  }
  const docs = await pack.getDocuments();
  return docs.find(doc => itemIdentifier(doc) === identifier) ?? null;
}

function rangerTceEmbeddedSourceDocument(patchItem, spec) {
  const sources = patchItem?.flags?.[MODULE_ID]?.rangerTcePatchSources;
  const data = sources?.[spec.id] ?? sources?.[spec.identifier];
  return data ? deepClone(data) : null;
}

function actorHasItemIdentifier(actor, identifier) {
  return actor?.items?.some(item => itemIdentifier(item) === identifier);
}

async function createActorItemFromCompendium(actor, sourceDoc, spec) {
  const data = typeof sourceDoc.toObject === "function" ? sourceDoc.toObject() : deepClone(sourceDoc);
  delete data._id;
  data.flags ??= {};
  data.flags[MODULE_ID] = {
    ...(data.flags[MODULE_ID] ?? {}),
    rangerTcePatchAdded: true,
    sourceCompendiumId: spec.id,
    sourceIdentifier: spec.identifier,
  };
  await actor.createEmbeddedDocuments("Item", [data], { keepId: false });
}

async function removeRangerPhbReplacedFeatures(actor) {
  const removable = actor.items
    .filter(item => item.type === "feat")
    .filter(item => RANGER_PHB_REPLACED_FEATURE_IDS.has(item.flags?.[MODULE_ID]?.sourceCompendiumId)
      || RANGER_PHB_REPLACED_FEATURE_IDS.has(item._id)
      || RANGER_PHB_REPLACED_IDENTIFIERS.has(itemIdentifier(item)))
    .map(item => item.id);
  if (removable.length) await actor.deleteEmbeddedDocuments("Item", removable);
  return removable.length;
}

async function deletePatchItem(item) {
  if (!item?.parent) return;
  await item.parent.deleteEmbeddedDocuments("Item", [item.id]).catch(() => {});
}

async function applyRangerTceOptionalFeaturesPatch(actor, patchItem) {
  const rangerLevel = classLevels(actor, "ranger");
  if (!rangerLevel) {
    ui.notifications?.warn("Ranger TCE patch skipped: this actor has no Ranger class levels.");
    await deletePatchItem(patchItem);
    return { skipped: true, reason: "not-ranger" };
  }

  const specs = RANGER_TCE_FEATURES_BY_LEVEL.filter(spec => rangerLevel >= spec.level);
  const sourceDocs = [];
  for (const spec of specs) {
    if (actorHasItemIdentifier(actor, spec.identifier)) continue;
    const doc = rangerTceEmbeddedSourceDocument(patchItem, spec)
      ?? await compendiumItemDocument(spec.packId, spec.id, spec.identifier);
    if (!doc) {
      ui.notifications?.warn("Ranger TCE patch skipped: missing source item " + spec.identifier + ".");
      await deletePatchItem(patchItem);
      return { skipped: true, reason: "missing-source", spec };
    }
    sourceDocs.push({ spec, doc });
  }

  const removed = await removeRangerPhbReplacedFeatures(actor);
  const added = [];
  for (const entry of sourceDocs) {
    if (actorHasItemIdentifier(actor, entry.spec.identifier)) continue;
    await createActorItemFromCompendium(actor, entry.doc, entry.spec);
    added.push(entry.spec.identifier);
  }

  await actor.setFlag(MODULE_ID, "rangerTcePatch", {
    version: RANGER_TCE_PATCH_VERSION,
    appliedAt: Date.now(),
    rangerLevel,
    removed,
    added,
  });
  await deletePatchItem(patchItem);
  ui.notifications?.info("Ranger TCE patch applied: level " + rangerLevel + ", added " + added.length + ", removed " + removed + ".");
  return { rangerLevel, removed, added };
}

async function handleRangerTcePatchCreate(item, options, userId) {
  if (!isRangerTcePatchItem(item)) return;
  if (!item.parent || item.parent.documentName !== "Actor") return;
  if (userId && game.user?.id !== userId && !game.user?.isGM) return;
  await applyRangerTceOptionalFeaturesPatch(item.parent, item);
}

function favoredFoeDamageFormula(actor) {
  const level = classLevels(actor, "ranger");
  if (level >= 14) return "1d8";
  if (level >= 6) return "1d6";
  return "1d4";
}

function favoredFoeSourceEffects(actor) {
  return Array.from(actor?.effects ?? []).filter(effect => effect.flags?.[MODULE_ID]?.favoredFoeSource === true);
}

function favoredFoeTargetEffects(actor, sourceActorUuid) {
  return Array.from(actor?.effects ?? []).filter(effect =>
    effect.flags?.[MODULE_ID]?.favoredFoeTarget === true
    && effect.flags?.[MODULE_ID]?.sourceActorUuid === sourceActorUuid
  );
}

function targetTokensFromInput(targets) {
  if (targets instanceof Set) return Array.from(targets);
  if (Array.isArray(targets)) return targets;
  if (targets?.actor) return [targets];
  return Array.from(game.user?.targets ?? []);
}

async function createFavoredFoeSourceEffect(actor, item) {
  const data = simpleSpellEffectData(item, actor, {
    name: "Favored Foe Concentration",
    durationSeconds: 60,
    flags: {
      [MODULE_ID]: {
        favoredFoeSource: true,
        sourceActorUuid: actor.uuid,
      },
      "midi-qol": {
        isConcentration: true,
      },
    },
  });
  data.statuses = ["concentrating"];
  await actor.createEmbeddedDocuments("ActiveEffect", [data]);
}

async function createFavoredFoeTargetEffect(actor, item, targets) {
  const data = simpleSpellEffectData(item, actor, {
    name: "Favored Foe",
    durationSeconds: 60,
    flags: {
      [MODULE_ID]: {
        favoredFoeTarget: true,
        sourceActorUuid: actor.uuid,
      },
    },
  });
  await applyEffectDataToTokens(targets, data);
}

async function consumeFavoredFoeUse(item) {
  const uses = item?.system?.uses;
  const maxRaw = String(uses?.max ?? "");
  const max = maxRaw === "@prof" ? Number(item.actor?.system?.attributes?.prof ?? 0) : Number(maxRaw || 0);
  const spent = Number(uses?.spent ?? 0);
  if (max && spent >= max) return false;
  await item.update({ "system.uses.spent": spent + 1 });
  return true;
}

async function applyFavoredFoe(actor, targets = null) {
  const item = actor?.items?.find(candidate => itemIdentifier(candidate) === "favored-foe");
  const tokens = targetTokensFromInput(targets).filter(token => token?.actor);
  if (!actor || !item || !tokens.length) return { applied: false };
  const hasSource = favoredFoeSourceEffects(actor).length > 0;
  if (!hasSource) {
    const consumed = await consumeFavoredFoeUse(item);
    if (!consumed) {
      ui.notifications?.warn("Favored Foe has no remaining uses.");
      return { applied: false, reason: "no-uses" };
    }
    await createFavoredFoeSourceEffect(actor, item);
    await createFavoredFoeTargetEffect(actor, item, tokens);
  }
  const formula = favoredFoeDamageFormula(actor);
  const result = await rollDamageToTargets(tokens, formula);
  await ChatMessage.create({
    user: game.user?.id,
    speaker: ChatMessage.getSpeaker({ actor }),
    content: "<p><strong>Favored Foe:</strong> " + formula + " = " + result.damage + " damage.</p>",
  });
  return { applied: true, formula, damage: result.damage, consumed: !hasSource };
}

async function cleanupFavoredFoeTargets(effect) {
  if (effect?.flags?.[MODULE_ID]?.favoredFoeSource !== true) return;
  const sourceActorUuid = effect.flags?.[MODULE_ID]?.sourceActorUuid;
  if (!sourceActorUuid) return;
  for (const token of canvas?.tokens?.placeables ?? []) {
    const actor = token?.actor;
    const removable = favoredFoeTargetEffects(actor, sourceActorUuid).map(targetEffect => targetEffect.id);
    if (removable.length) await actor.deleteEmbeddedDocuments("ActiveEffect", removable);
  }
}

function isArcaneFeatItem(item) {
  return item?.type === "feat"
    && item.system?.identifier
    && item.flags?.[MODULE_ID]?.sourcePack === "feats-all";
}

function preventDuplicateArcaneFeatCreate(item) {
  if (!isArcaneFeatItem(item)) return true;
  const actor = item.parent ?? item.actor;
  if (!actor?.items) return true;
  const identifier = item.system.identifier;
  const duplicate = Array.from(actor.items).some(existing =>
    existing?.id !== item.id
    && isArcaneFeatItem(existing)
    && existing.system?.identifier === identifier
  );
  if (!duplicate) return true;
  ui.notifications?.warn("Arcane feat already exists on this actor: " + item.name);
  return false;
}

function declaredPowerAttackUse(item, usageConfig) {
  const rider = declaredRider(usageConfig, null, [GREAT_WEAPON_MASTER_IDENTIFIER, SHARPSHOOTER_IDENTIFIER]);
  if (!rider) return null;
  const actor = item?.actor;
  const activity = usageConfig?.activity ?? usageConfig?.workflowOptions?.activity ?? null;
  const identifier = rider.identifier ?? rider.id ?? "";
  if (identifier === GREAT_WEAPON_MASTER_IDENTIFIER) {
    if (!actorHasFeature(actor, GREAT_WEAPON_MASTER_IDENTIFIER)) return null;
    if (!isMeleeWeaponAttack(item, activity)) return null;
    if (!itemHasProperty(item, ["hvy", "heavy"])) return null;
    return {
      name: "Great Weapon Master",
      attackBonusKey: "system.bonuses.mwak.attack",
      damageBonusKey: "system.bonuses.mwak.damage",
      identifier,
    };
  }
  if (identifier === SHARPSHOOTER_IDENTIFIER) {
    if (!actorHasFeature(actor, SHARPSHOOTER_IDENTIFIER)) return null;
    if (!isRangedWeaponAttack(item, activity)) return null;
    return {
      name: "Sharpshooter",
      attackBonusKey: "system.bonuses.rwak.attack",
      damageBonusKey: "system.bonuses.rwak.damage",
      identifier,
    };
  }
  return null;
}

async function applyDeclaredPowerAttackBeforeUse(item, usageConfig) {
  const actor = item?.actor;
  const declaration = declaredPowerAttackUse(item, usageConfig);
  if (!actor || !declaration) return null;
  const [effect] = await actor.createEmbeddedDocuments("ActiveEffect", [{
    name: declaration.name + " Declared",
    img: item?.img,
    origin: item?.uuid,
    disabled: false,
    transfer: false,
    changes: [
      { key: declaration.attackBonusKey, mode: 2, value: "-5", priority: 20 },
      { key: declaration.damageBonusKey, mode: 2, value: "+10", priority: 20 },
    ],
    flags: {
      [MODULE_ID]: {
        declaredPowerAttack: true,
        identifier: declaration.identifier,
      },
      dae: { specialDuration: ["1Attack", "1Hit", "turnEnd", "combatEnd"], stackable: "noneName", showIcon: false },
    },
    type: "base",
    system: {},
  }]);
  return effect ?? null;
}

async function cleanupDeclaredPowerAttackEffect(effect) {
  if (!effect) return;
  const actor = effect.parent;
  if (actor?.deleteEmbeddedDocuments && effect.id) {
    await actor.deleteEmbeddedDocuments("ActiveEffect", [effect.id]).catch(() => null);
    return;
  }
  if (typeof effect.delete === "function") await effect.delete().catch(() => null);
}

function interactionContractVersion(interaction) {
  const version = Number(interaction?.version ?? 0);
  return Number.isFinite(version) && version > 0 ? version : 0;
}

function activityById(item, activityId) {
  return item?.system?.activities?.get?.(activityId)
    ?? activityValues(item).find(activity => (activity.id ?? activity._id) === activityId)
    ?? null;
}

let characterSpellInteractionMigrationPromise = null;

function compilerSpellContentNeedsUpdate(item, sourceCompiler) {
  if (!sourceCompiler?.version) return false;
  const currentCompiler = item?.flags?.[MODULE_ID]?.compiler ?? {};
  return [
    "schemaVersion",
    "version",
    "definitionHash",
    "graphHash",
    "planHash",
  ].some(key => currentCompiler[key] !== sourceCompiler[key]);
}

async function migrateCharacterSpellInteractionContracts() {
  if (characterSpellInteractionMigrationPromise) return characterSpellInteractionMigrationPromise;
  const migration = migrateCharacterSpellInteractionContractsOnce();
  characterSpellInteractionMigrationPromise = migration;
  try {
    return await migration;
  } finally {
    if (characterSpellInteractionMigrationPromise === migration) {
      characterSpellInteractionMigrationPromise = null;
    }
  }
}

async function migrateCharacterSpellInteractionContractsOnce() {
  if (!game.user?.isGM) return { skipped: true, reason: "not-gm" };
  const pack = game.packs.get(ARCANE_SPELL_PACK_ID);
  if (!pack) return { skipped: true, reason: "missing-pack" };

  const index = await pack.getIndex({
    fields: [
      "name",
      "system.identifier",
      "system.activities",
      "flags." + MODULE_ID + ".spellContentVersion",
      "flags." + MODULE_ID + ".compiler",
    ],
  });
  const sourceByIdentifier = new Map();
  for (const entry of index) {
    const identifier = String(entry.system?.identifier ?? "").trim();
    if (identifier) sourceByIdentifier.set(identifier, entry);
  }

  const result = {
    actors: 0,
    spells: 0,
    contentUpdated: 0,
    effectsRebuilt: 0,
    updatedActivities: 0,
    skippedActivityMismatches: 0,
  };

  for (const actor of game.actors.filter(candidate => candidate.type === "character")) {
    let actorChanged = false;
    for (const item of actor.items.filter(candidate => candidate.type === "spell")) {
      const identifier = String(item.system?.identifier ?? "").trim();
      const source = identifier ? sourceByIdentifier.get(identifier) : null;
      if (!source) continue;

      const compilerManaged = Boolean(source.flags?.[MODULE_ID]?.compiler?.version);
      if (VERSIONED_SPELL_CONTENT_IDENTIFIERS.has(identifier) || compilerManaged) {
        const currentVersion = Number(item.getFlag?.(MODULE_ID, "spellContentVersion") ?? 0);
        const fallbackVersion = LEVEL3_SPELL_CONTENT_IDENTIFIERS.has(identifier)
          ? LEVEL3_SPELL_CONTENT_VERSION
          : LEVEL1_2_SPELL_CONTENT_VERSION;
        const sourceVersion = Number(source.flags?.[MODULE_ID]?.spellContentVersion ?? fallbackVersion);
        const sourceCompiler = source.flags?.[MODULE_ID]?.compiler;
        if (
          currentVersion < sourceVersion
          || compilerSpellContentNeedsUpdate(item, sourceCompiler)
        ) {
          const sourceDocument = await pack.getDocument(source._id);
          const sourceData = sourceDocument?.toObject();
          if (!sourceData) continue;

          const sourceActivities = sourceData.system?.activities ?? {};
          const systemUpdate = cloneSettings(item._source?.system ?? item.toObject()?.system ?? {});
          systemUpdate.activities = cloneSettings(sourceActivities);
          systemUpdate.ability = cloneSettings(sourceData.system?.ability ?? "");
          systemUpdate.properties = cloneSettings(sourceData.system?.properties ?? []);

          const oldEffects = Array.from(item.effects ?? []);
          if (oldEffects.length) {
            await item.deleteEmbeddedDocuments("ActiveEffect", oldEffects.map(effect => effect.id));
          }
          const sourceEffects = (sourceData.effects ?? []).map(effect => {
            const copy = cloneSettings(effect);
            delete copy._stats;
            return copy;
          });
          if (sourceEffects.length) {
            await item.createEmbeddedDocuments("ActiveEffect", sourceEffects, { keepId: true });
          }
          await item.update({ system: systemUpdate }, { recursive: false });
          const managedFlagNamespaces = ["midi-qol", "dae", "autoanimations", MODULE_ID];
          const flagDeletes = {};
          for (const namespace of managedFlagNamespaces) {
            if (item.flags?.[namespace] !== undefined) {
              flagDeletes["flags.-=" + namespace] = null;
            }
          }
          if (Object.keys(flagDeletes).length) await item.update(flagDeletes);

          const automationFlags = {};
          for (const namespace of ["midi-qol", "dae", "autoanimations"]) {
            const sourceFlags = sourceData.flags?.[namespace];
            if (sourceFlags !== undefined) {
              automationFlags["flags." + namespace] = cloneSettings(sourceFlags);
            }
          }
          const sourceModuleFlags = cloneSettings(sourceData.flags?.[MODULE_ID] ?? {});
          sourceModuleFlags.spellContentVersion = sourceVersion;
          sourceModuleFlags.spellAutomation = cloneSettings(
            sourceData.flags?.[MODULE_ID]?.spellAutomation ?? {},
          );
          automationFlags["flags." + MODULE_ID] = sourceModuleFlags;
          await item.update(automationFlags);
          result.spells += 1;
          result.contentUpdated += 1;
          result.effectsRebuilt += sourceEffects.length;
          actorChanged = true;
        }
        continue;
      }

      const sourceActivities = activityValues(source).filter(activity =>
        typeof activity.flags?.[MODULE_ID]?.interaction?.templateTargets === "string"
      );
      if (!sourceActivities.length) continue;
      result.spells += 1;

      for (const sourceActivity of sourceActivities) {
        const activityId = sourceActivity.id ?? sourceActivity._id;
        const activity = activityById(item, activityId);
        if (!activity) {
          result.skippedActivityMismatches += 1;
          continue;
        }

        const sourceInteraction = sourceActivity.flags?.[MODULE_ID]?.interaction;
        const currentInteraction = activity.flags?.[MODULE_ID]?.interaction;
        if (interactionContractVersion(currentInteraction) >= interactionContractVersion(sourceInteraction)) continue;

        const update = {
          ["flags." + MODULE_ID + ".interaction"]: cloneSettings(sourceInteraction),
        };
        if (typeof sourceActivity.target?.prompt === "boolean") {
          update["target.prompt"] = sourceActivity.target.prompt;
        }
        if (typeof sourceActivity.midiProperties?.autoTargetAction === "string") {
          update["midiProperties.autoTargetAction"] = sourceActivity.midiProperties.autoTargetAction;
        }
        if (typeof sourceActivity.midiProperties?.autoTargetType === "string") {
          update["midiProperties.autoTargetType"] = sourceActivity.midiProperties.autoTargetType;
        }

        await item.updateActivity(activityId, update);
        result.updatedActivities += 1;
        actorChanged = true;
      }
    }
    if (actorChanged) result.actors += 1;
  }

  if (result.contentUpdated || result.updatedActivities || result.skippedActivityMismatches) {
    console.info("[" + MODULE_ID + "] character spell interaction migration complete.", result);
  }
  return result;
}

function compilerIndependentProjectilesContract(item, workflow) {
  const activity = workflow?.activity;
  const interaction = activity?.getFlag?.(MODULE_ID, "interaction")
    ?? activity?.flags?.[MODULE_ID]?.interaction
    ?? null;
  const resolution = interaction?.resolution;
  if (
    Number(interaction?.version) !== 2
    || (
      resolution?.primitive !== undefined
      && resolution?.primitive !== "action-resolution"
    )
    || resolution?.type !== "independent-projectiles"
    || resolution?.allocation !== "optional-explicit"
    || resolution?.defaultTarget !== "concentrate"
    || !resolution?.count
  ) return null;
  return resolution;
}

function inheritCompilerTriggeredActivityScaling(activity, usageConfig) {
  const contract = activity?.getFlag?.(
    MODULE_ID,
    "triggeredEventActivity",
  ) ?? activity?.flags?.[MODULE_ID]?.triggeredEventActivity;
  if (
    Number(contract?.version) !== 1
    || (
      contract?.inheritParentScaling !== true
      && contract?.inheritParentSaveDc !== true
    )
  ) return true;
  const triggeringWorkflowId =
    usageConfig?.midiOptions?.workflowOptions?.triggeringWorkflowId;
  if (!triggeringWorkflowId) return true;
  const parentWorkflow =
    globalThis.MidiQOL?.Workflow?.getWorkflow?.(triggeringWorkflowId);
  if (contract?.inheritParentScaling === true) {
    const scaling = Number(parentWorkflow?.castData?.scaling);
    if (!Number.isInteger(scaling) || scaling < 0) {
      console.warn(
        "[" + MODULE_ID + "] Triggered activity could not inherit scaling",
        {
          activity: activity?.uuid ?? activity?.id ?? null,
          triggeringWorkflowId,
          scaling: parentWorkflow?.castData?.scaling,
        },
      );
    } else {
      usageConfig.scaling = scaling;
    }
  }
  if (contract?.inheritParentSaveDc === true) {
    const parentActor =
      parentWorkflow?.actor
      ?? parentWorkflow?.item?.actor
      ?? parentWorkflow?.activity?.actor;
    const spellcastingAbility = String(
      parentActor?.system?.attributes?.spellcasting ?? "",
    );
    const parentSaveDc = Number(
      parentWorkflow?.activity?.save?.dc?.value
      ?? parentActor?.system?.attributes?.spell?.dc
      ?? parentActor?.system?.abilities?.[spellcastingAbility]?.dc,
    );
    if (!Number.isFinite(parentSaveDc) || parentSaveDc <= 0) {
      console.warn(
        "[" + MODULE_ID + "] Triggered activity could not inherit save DC",
        {
          activity: activity?.uuid ?? activity?.id ?? null,
          triggeringWorkflowId,
          parentSaveDc,
        },
      );
    } else {
      activity.updateSource?.({
        "save.dc.calculation": "",
        "save.dc.formula": String(parentSaveDc),
      });
      activity.item?.prepareFinalAttributes?.();
      const preparedActivity =
        activity.item?.system?.activities?.get?.(activity.id)
        ?? activity;
      if (preparedActivity?.save?.dc) {
        preparedActivity.save.dc.calculation = "";
        preparedActivity.save.dc.formula = String(parentSaveDc);
        preparedActivity.save.dc.value = parentSaveDc;
      }
    }
  }
  return true;
}

function independentProjectileChildWorkflow(workflow) {
  return Boolean(
    workflow?.options?.arcaneIndependentProjectileChild
    ?? workflow?.workflowOptions?.arcaneIndependentProjectileChild
  );
}

function independentProjectileAllocationFromUse(usageConfig, workflow) {
  const candidates = [
    usageConfig?.arcaneProjectileAllocation,
    usageConfig?.midiOptions?.arcaneProjectileAllocation,
    usageConfig?.midiOptions?.workflowOptions?.arcaneProjectileAllocation,
    workflow?.options?.arcaneProjectileAllocation,
    workflow?.workflowOptions?.arcaneProjectileAllocation,
  ];
  return candidates.find(candidate => Array.isArray(candidate)) ?? null;
}

function independentProjectileTargetById(targetTokenId) {
  return canvas.tokens?.get?.(targetTokenId)
    ?? canvas.tokens?.placeables?.find(candidate =>
      String(candidate?.document?.id ?? candidate?.id ?? "")
        === String(targetTokenId ?? "")
    )
    ?? null;
}

function independentProjectileWorkflowReceipt(workflow, index, targetTokenId) {
  const hitTargets = workflowHitTargets(workflow);
  const hasAttack = workflow?.activity?.hasAttack === true
    || workflow?.activity?.type === "attack";
  const attackRoll =
    workflow?.attackRoll
    ?? activityValues(workflow?.attackRolls)[0]
    ?? activityValues(workflow?.attacks)[0]
    ?? null;
  const receipt = {
    index,
    targetTokenId,
    workflowId: workflow?.uuid ?? workflow?.id ?? null,
    hit: hasAttack ? hitTargets.length > 0 : null,
    critical: hasAttack ? workflow?.isCritical === true : null,
    attackTotal: Number.isFinite(Number(attackRoll?.total))
      ? Number(attackRoll.total)
      : null,
    damageRolled: activityValues(workflow?.damageRolls).map(roll => ({
      formula: roll?.formula ?? roll?._formula ?? null,
      total: Number.isFinite(Number(roll?.total))
        ? Number(roll.total)
        : null,
      type: roll?.options?.type ?? roll?.options?.rollType ?? null,
    })),
  };
  Object.defineProperty(receipt, "__workflow", {
    value: workflow,
    enumerable: false,
    configurable: false,
    writable: false,
  });
  return receipt;
}

async function waitForIndependentProjectileRollComplete(
  workflow,
  timeoutMs = 15000,
) {
  if (workflow?.__arcaneRollComplete === true) return workflow;
  const deadline = Date.now() + timeoutMs;
  while (
    workflow?.__arcaneRollComplete !== true
    && Date.now() < deadline
  ) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  if (workflow?.__arcaneRollComplete !== true) {
    throw new Error(
      "independent-projectiles workflow did not reach RollComplete",
    );
  }
  return workflow;
}

async function applyIndependentProjectilesFromUse(item, usageConfig, workflow) {
  if (
    !workflow
    || workflow.aborted === true
    || independentProjectileChildWorkflow(workflow)
    || !isPrimaryAutomationGM()
  ) return false;
  const resolution = compilerIndependentProjectilesContract(item, workflow);
  if (!resolution) return false;
  if (workflow.__arcaneIndependentProjectiles) return true;

  const expected = await compilerRuntimeExpressionValue(
    resolution.count,
    {
      operationResults: new Map(),
      item,
      usageConfig,
      workflow,
    },
  );
  if (!Number.isInteger(expected) || expected <= 0) {
    throw new Error(
      "independent-projectiles count must resolve to a positive integer",
    );
  }

  const parentTargets = targetsFromUseConfig(workflow, usageConfig)
    .filter(target => target?.actor);
  const allocation = independentProjectileAllocationFromUse(
    usageConfig,
    workflow,
  );
  let sequence = [];
  if (allocation) {
    const seen = new Set();
    for (const [index, entry] of allocation.entries()) {
      const targetTokenId = String(entry?.targetTokenId ?? "").trim();
      const count = Number(entry?.count);
      if (
        !targetTokenId
        || !Number.isInteger(count)
        || count <= 0
        || seen.has(targetTokenId)
      ) {
        throw new Error(
          "independent-projectiles received invalid allocation entry "
          + String(index),
        );
      }
      seen.add(targetTokenId);
      sequence.push(
        ...Array.from({ length: count }, () => targetTokenId),
      );
    }
    if (sequence.length !== expected) {
      throw new Error(
        "independent-projectiles allocation count "
        + String(sequence.length)
        + " does not match "
        + String(expected),
      );
    }
  } else {
    if (parentTargets.length !== 1) {
      throw new Error(
        "independent-projectiles requires one default target",
      );
    }
    const targetTokenId = String(
      parentTargets[0]?.document?.id ?? parentTargets[0]?.id ?? "",
    );
    sequence = Array.from({ length: expected }, () => targetTokenId);
  }

  const parentTargetId = String(
    parentTargets[0]?.document?.id ?? parentTargets[0]?.id ?? "",
  );
  if (
    parentTargets.length !== 1
    || !parentTargetId
    || sequence[0] !== parentTargetId
  ) {
    throw new Error(
      "independent-projectiles parent workflow target must match the first allocation",
    );
  }

  const receipt = {
    expected,
    completed: 1,
    projectiles: [
      independentProjectileWorkflowReceipt(
        workflow,
        0,
        parentTargetId,
      ),
    ],
  };
  workflow.__arcaneIndependentProjectiles = receipt;
  const activity = workflow.activity;
  const baseLevel = Math.max(0, Number(item?.system?.level ?? 0) || 0);
  const castLevel = workflowCastLevel(item, usageConfig, workflow);
  const scaling = Math.max(0, castLevel - baseLevel);
  const sourceTokenUuid =
    workflow?.token?.document?.uuid
    ?? workflow?.tokenUuid
    ?? null;
  const advantage = usageConfig?.midiOptions?.advantage === true
    || workflow?.workflowOptions?.advantage === true;
  const disadvantage = usageConfig?.midiOptions?.disadvantage === true
    || workflow?.workflowOptions?.disadvantage === true;

  for (let index = 1; index < sequence.length; index += 1) {
    const targetTokenId = sequence[index];
    const target = independentProjectileTargetById(targetTokenId);
    if (!target?.actor || !target?.document?.uuid) {
      receipt.error = "target-not-found:" + targetTokenId;
      throw new Error(
        "independent-projectiles target not found: " + targetTokenId,
      );
    }
    let childWorkflow = null;
    try {
      childWorkflow = await MidiQOL.completeActivityUse(activity, {
        consume: {
          action: false,
          resources: false,
          spellSlot: false,
        },
        concentration: { begin: false },
        scaling,
        midiOptions: {
          spellLevel: castLevel,
          noUseWarning: true,
          targetUuids: [target.document.uuid],
          targetsToUse: new Set([target]),
          ignoreUserTargets: true,
          fastForward: true,
          advantage,
          disadvantage,
          workflowOptions: {
            arcaneIndependentProjectileChild: true,
            targetUuids: [target.document.uuid],
            sourceTokenUuid,
            targetConfirmation: "none",
            advantage,
            disadvantage,
          },
        },
      });
    } catch (error) {
      receipt.error =
        error?.message ?? String(error ?? "child-workflow-failed");
      throw error;
    }
    if (!childWorkflow || childWorkflow.aborted === true) {
      receipt.error = "child-workflow-aborted:" + String(index);
      throw new Error(
        "independent-projectiles child workflow did not complete",
      );
    }
    await waitForIndependentProjectileRollComplete(childWorkflow);
    receipt.projectiles.push(
      independentProjectileWorkflowReceipt(
        childWorkflow,
        index,
        targetTokenId,
      ),
    );
    receipt.completed = receipt.projectiles.length;
  }
  await waitForIndependentProjectileRollComplete(workflow);
  receipt.projectiles[0] = independentProjectileWorkflowReceipt(
    workflow,
    0,
    parentTargetId,
  );
  return true;
}

async function applyCompilerRuntimePostUse(item, usageConfig, workflow) {
  if (!workflow) return true;
  if (workflow.__arcaneCompilerRuntimePostUse) {
    return workflow.__arcaneCompilerRuntimePostUse;
  }

  const resolvedItem = item ?? workflow?.activity?.item ?? workflow?.item;
  const task = (async () => {
    const sourceBoundOneShotCompletion = await applySourceBoundOneShotFromUse(
      resolvedItem,
      usageConfig,
      workflow,
    );
    if (workflow.aborted === true) return sourceBoundOneShotCompletion;
    await applyPlacedPointMoveTokenFromUse(resolvedItem, usageConfig, workflow);
    await applyIndependentProjectilesFromUse(
      resolvedItem,
      usageConfig,
      workflow,
    );
    await applyCompilerRuntimeTriggeredActivityFromUse(
      resolvedItem,
      usageConfig,
      workflow,
    );
    await applyOwnedWeaponAttackFromUse(resolvedItem, usageConfig, workflow);
    await applyNativeSummonControlFromUse(resolvedItem, usageConfig, workflow);
    await applyHitPointPoolAllocatorFromUse(resolvedItem, usageConfig, workflow);
    await applyReversibleHitPointCapacityFromUse(resolvedItem, usageConfig, workflow);
    await applyCompilerWorkflowOutcomeOperations(resolvedItem, usageConfig, workflow);
    await applyCompilerWorkflowOutcomeActivities(
      resolvedItem,
      usageConfig,
      workflow,
    );
    await applyCompilerWorkflowOutcomeForcedMovement(
      resolvedItem,
      usageConfig,
      workflow,
    );
    await applyRequiredSelectionOutcomesFromUse(resolvedItem, usageConfig, workflow);
    await applyRequiredSelectionEffectModifiersFromUse(
      resolvedItem,
      usageConfig,
      workflow,
    );
    await applySourceArmedAttackTransformFromUse(
      resolvedItem,
      usageConfig,
      workflow,
    );
    await applyRestorationSpellAutomation(resolvedItem, usageConfig, workflow);
    await applyLinkedOperationResultsFromUse(resolvedItem, usageConfig, workflow);
    await applySourceArtifactsFromUse(resolvedItem, usageConfig, workflow);
    await applyCastOriginStaticMarkerFromUse(resolvedItem, usageConfig, workflow);
    await applySourceArtifactDismissFromUse(resolvedItem, usageConfig, workflow);
    await applyWeaponEnchantmentFromUse(resolvedItem, usageConfig, workflow);
    await bindSourceTargetDamageMirrorFromUse(resolvedItem, usageConfig, workflow);
    await bindTemporaryHitPointsSourcesFromUse(resolvedItem, usageConfig, workflow);
    await captureTemporaryHitPointsRetaliationCast(resolvedItem, usageConfig, workflow);
    await captureEffectHostHitByAttackCast(resolvedItem, usageConfig, workflow);
    await applyLifeTransferenceFromUse(resolvedItem, usageConfig, workflow);
    await consumeExternalOperationArtifactTransitions(workflow);
    await resolveExternalOperationArtifactTransitions(workflow);
    await dispatchOutcomeRaceActivity(resolvedItem, workflow);
    await dispatchPerSpellScriptActivity(resolvedItem, workflow);
    await finalizePerSpellDamageTransactions(workflow);
    await releaseCompilerSnapshotTemplateFromUse(
      resolvedItem,
      usageConfig,
      workflow,
    );
    return true;
  })();
  workflow.__arcaneCompilerRuntimePostUse = task;
  return task;
}

function inheritCompilerFollowUpCastLevel(activity, item, usageConfig) {
  if (!item?.actor || !usageConfig) return true;
  const resolvedActivity = activity
    ?? usageConfig?.activity
    ?? Array.from(item?.system?.activities ?? []).find(candidate =>
      candidate?.flags?.[MODULE_ID]?.availability?.requiresArtifactId
    );
  const artifactId = resolvedActivity
    ?.flags?.[MODULE_ID]?.availability?.requiresArtifactId;
  if (!artifactId) return true;
  const sourceEffects = compilerEffectsForArtifact(
    item.actor,
    artifactId,
    item,
  );
  if (sourceEffects.length === 0) return true;
  if (sourceEffects.length !== 1) {
    throw compilerSelectionCardinalityFailure(
      "Follow-up action expected one exact active source artifact; found "
        + sourceEffects.length,
      "ACTION_MISCONFIGURED",
    );
  }
  const sourceEffect = sourceEffects[0];
  const castLevel = Number(
    sourceEffect?.flags?.[MODULE_ID]?.sourceCastLevel
      ?? sourceEffect?.flags?.["midi-qol"]?.castData?.castLevel,
  );
  const baseLevel = Math.max(0, Number(item?.system?.level ?? 0) || 0);
  if (
    !Number.isInteger(castLevel)
    || castLevel < baseLevel
    || castLevel > 9
  ) {
    throw compilerSelectionCardinalityFailure(
      "Follow-up action source artifact has invalid cast-level provenance",
      "ACTION_MISCONFIGURED",
    );
  }
  usageConfig.scaling = castLevel - baseLevel;
  usageConfig.spell ??= {};
  usageConfig.spell.slot = "spell" + castLevel;
  usageConfig.midiOptions ??= {};
  usageConfig.midiOptions.spellLevel = castLevel;
  return true;
}

function patchMidiCompleteItemUse() {
  const midi = globalThis.MidiQOL;
  if (!midi?.completeItemUse || midi.completeItemUse.__arcaneVowPatch) return;

  const originalCompleteItemUse = midi.completeItemUse.bind(midi);
  midi.completeItemUse = async function arcaneCompleteItemUse(item, usageConfig, dialogConfig, messageConfig) {
    prepareTurnUndeadTargetsForUse(item, usageConfig);
    prepareTwilightSanctuaryTargetsForUse(item, usageConfig);
    prepareAasimarNecroticShroudTargetsForUse(item, usageConfig);
    inheritCompilerFollowUpCastLevel(
      usageConfig?.activity ?? null,
      item,
      usageConfig,
    );
    const declaredPowerAttackEffect = await applyDeclaredPowerAttackBeforeUse(item, usageConfig);
    let workflow = null;
    try {
      workflow = await originalCompleteItemUse(item, usageConfig, dialogConfig, messageConfig);
      if (!workflow) {
        return workflow;
      }
      await finalizeNativeSummonFromWorkflow(workflow);
      await applyCompilerRuntimePostUse(item, usageConfig, workflow);
      if (workflow.aborted === true) {
        return workflow;
      }
      try {
        await applyVowOfEnmityMarkerFromUse(item, usageConfig, workflow);
        await finalizeDeclaredActiveBuff(workflow);
        await finalizeSourceAttackProximityRiders(workflow);
        await applyHuntersMarkDamageBonus(workflow);
        await applySpiritShroudDamageBonus(workflow);
        await applyDeclaredDivineSmite(item, usageConfig, workflow);
        await applyDeclaredSneakAttack(item, usageConfig, workflow);
        await applyDeclaredDreadAmbusher(item, usageConfig, workflow);
        await applyDeclaredWeaponSpellRider(item, usageConfig, workflow);
        await applyDeclaredAasimarRevelationDamage(item, usageConfig, workflow);
        await applyVigilantBlessingFromUse(item, usageConfig, workflow);
        await applyBardicInspirationFromUse(item, usageConfig, workflow);
        await applyCountercharmFromUse(item, usageConfig, workflow);
        await applyTwilightSanctuaryFromUse(item, usageConfig, workflow);
        await applyAasimarRevelationFromUse(item, usageConfig, workflow);
        await applySimpleSpellMarkerAutomation(item, usageConfig, workflow);
        await applyLevel12SpellPostUse(item, usageConfig, workflow);
        await applyVampiricTouchHealingFromUse(item, usageConfig, workflow);
      } catch (error) {
        recordCompilerRuntimeError(workflow, error, "complete-item-use-post-use");
        console.warn(`[${MODULE_ID}] completeItemUse automation patch failed`, error);
        throw error;
      }
      return workflow;
    } finally {
      releaseDeclaredActiveBuff(workflow);
      await cleanupDeclaredPowerAttackEffect(declaredPowerAttackEffect);
    }
  };
  midi.completeItemUse.__arcaneVowPatch = true;
}

function isCompilerPersistentTemplateItem(item) {
  const automation = item?.flags?.[MODULE_ID]?.spellAutomation;
  if (
    automation?.source !== "compiler"
    || automation?.areaBehavior !== "persistent-zone"
  ) {
    return false;
  }
  return Array.from(item.effects ?? []).some(effect =>
    effect.flags?.[MODULE_ID]?.persistentTemplate === true
  );
}

function hasEffectStatus(effect, status) {
  if (effect?.statuses instanceof Set) return effect.statuses.has(status);
  return Array.from(effect?.statuses ?? []).includes(status);
}

function measuredTemplatesDependingOn(effectUuid) {
  const matches = [];
  for (const scene of game.scenes ?? []) {
    for (const template of scene.templates ?? []) {
      if (template.flags?.dnd5e?.dependentOn === effectUuid) {
        matches.push(template);
      }
    }
  }
  return matches;
}

function isolatedTemplateCleanupEffectData(effect, item, templateDocument) {
  const data = effect.toObject();
  delete data._id;
  delete data._stats;
  data.name = effect.name + " [" + templateDocument.id + "]";
  data.origin = item.uuid;
  data.transfer = false;
  data.disabled = false;
  data.duration ??= {};
  if (Number.isFinite(Number(data.duration.seconds))) {
    data.duration.startTime = game.time?.worldTime;
    delete data.duration.startRound;
    delete data.duration.startTurn;
  } else {
    data.duration.startRound = game.combat?.round ?? 0;
    data.duration.startTurn = game.combat?.turn ?? 0;
    delete data.duration.startTime;
  }
  data.flags ??= {};
  data.flags.dae = {
    ...(data.flags.dae ?? {}),
    stackable: "multi",
    showIcon: false,
  };
  data.flags[MODULE_ID] = {
    ...(data.flags[MODULE_ID] ?? {}),
    persistentTemplateCleanup: {
      version: 1,
      itemUuid: item.uuid,
      templateUuid: templateDocument.uuid,
    },
  };
  return data;
}

async function isolateSharedPersistentTemplateCleanup(workflow, templateDocument, result) {
  const item = workflow?.item ?? workflow?.activity?.item;
  if (!isCompilerPersistentTemplateItem(item)) return result;

  const effectUuid = templateDocument?.flags?.dnd5e?.dependentOn;
  if (!effectUuid) return result;
  const effect = await fromUuid(effectUuid);
  if (
    effect?.documentName !== "ActiveEffect"
    || effect.parent?.uuid !== workflow?.actor?.uuid
    || hasEffectStatus(effect, "concentrating")
  ) {
    return result;
  }

  const otherTemplates = measuredTemplatesDependingOn(effect.uuid)
    .filter(template => template.uuid !== templateDocument.uuid);
  if (otherTemplates.length === 0) return result;

  const [isolatedEffect] = await workflow.actor.createEmbeddedDocuments(
    "ActiveEffect",
    [isolatedTemplateCleanupEffectData(effect, item, templateDocument)],
  );
  if (!isolatedEffect) {
    throw new Error(
      "Could not create an independent persistent-template cleanup effect for "
      + templateDocument.uuid
    );
  }
  const dependents = globalThis.dnd5e?.registry?.dependents
    ?? game.dnd5e?.registry?.dependents;
  if (
    typeof dependents?.untrack !== "function"
    || typeof dependents?.track !== "function"
  ) {
    await isolatedEffect.delete();
    throw new Error("dnd5e dependents registry is unavailable");
  }
  dependents.untrack(effect.uuid, templateDocument);
  try {
    await templateDocument.setFlag("dnd5e", "dependentOn", isolatedEffect.uuid);
    // prepareData also tracks the new relationship; explicit tracking makes
    // the ownership transfer independent of that internal call ordering.
    dependents.track(isolatedEffect.uuid, templateDocument);
  } catch (error) {
    dependents.track(effect.uuid, templateDocument);
    await isolatedEffect.delete();
    throw error;
  }
  return result;
}

function patchMidiPersistentTemplateCleanupIsolation() {
  const workflowPrototype = globalThis.MidiQOL?.Workflow?.prototype;
  const original = workflowPrototype?.setupTemplateCleanup;
  if (
    typeof original !== "function"
    || original.__arcanePersistentTemplateCleanupIsolationPatch
  ) {
    return false;
  }

  async function arcaneSetupTemplateCleanup(templateDocument) {
    const result = await original.call(this, templateDocument);
    return isolateSharedPersistentTemplateCleanup(this, templateDocument, result);
  }
  arcaneSetupTemplateCleanup.__arcanePersistentTemplateCleanupIsolationPatch = true;
  workflowPrototype.setupTemplateCleanup = arcaneSetupTemplateCleanup;
  return true;
}

function patchMidiInstantTemplateRemoval() {
  const workflowPrototype = globalThis.MidiQOL?.Workflow?.prototype;
  const original = workflowPrototype?.WorkflowState_Cleanup;
  if (
    typeof original !== "function"
    || original.__arcaneCompilerInstantTemplatePatch
    || original.__arcaneCompilerZoneInstantTemplatePatch
  ) {
    return false;
  }

  // Midi's state machine derives hook names from the state function's own
  // ".name" property (nameForState); wrapping it under a different function
  // name would silence midi-qol.preCleanup/postCleanup, and with them the
  // Arcane runtime completion receipt that the CLI waits on to confirm an
  // action finished.
  const arcaneWorkflowStateCleanup = {
    async WorkflowState_Cleanup(context = {}) {
      const midiConfig = game.settings?.get?.("midi-qol", "ConfigSettings") ?? {};
      const item = this?.item ?? this?.activity?.item;
      const compilerOwnsTemplateCleanup = isCompilerPersistentTemplateItem(item)
        || compilerWorkflowUsesSnapshotTemplate(item, this)
        || compilerWorkflowUsesCastOriginStaticMarker(item, this);
      if (
        midiConfig.autoRemoveInstantaneousTemplate !== true
        || !compilerOwnsTemplateCleanup
        || !Array.isArray(this?.templateUuids)
        || this.templateUuids.length === 0
      ) {
        return original.call(this, context);
      }
      // Compiler-owned persistent zones and snapshot workflow templates both
      // have an explicit Arcane cleanup owner. Midi's delayed instantaneous
      // cleanup would either destroy a persistent zone or race Arcane's exact
      // snapshot release. Hide these UUIDs from that branch and preserve the
      // workflow state for every other Midi consumer.
      const templateUuids = this.templateUuids;
      this.templateUuids = [];
      try {
        return await original.call(this, context);
      } finally {
        this.templateUuids = templateUuids;
      }
    },
  }.WorkflowState_Cleanup;
  arcaneWorkflowStateCleanup.__arcaneCompilerInstantTemplatePatch = true;
  workflowPrototype.WorkflowState_Cleanup = arcaneWorkflowStateCleanup;
  return true;
}

Hooks.once("ready", () => {
  patchMidiPersistentTemplateCleanupIsolation();
  patchMidiInstantTemplateRemoval();
  patchMidiCompleteItemUse();
  const runtimeActors = new Map(
    Array.from(game.actors ?? [])
      .concat(Array.from(canvas.tokens?.placeables ?? []).map(token => token.actor))
      .filter(actor => actor?.uuid)
      .map(actor => [actor.uuid, actor]),
  );
  Promise.all(
    Array.from(runtimeActors.values()).flatMap(actor => [
      cleanupOrphanedOwnedWeaponAttackDamageEffects(actor),
      cleanupOrphanedCompilerWeaponResistanceEffects(actor),
    ]),
  ).catch(error => {
    console.warn(
      "[" + MODULE_ID + "] Owned-weapon attack damage cleanup failed",
      error,
    );
  });
  recoverFatalDamageInterceptions().catch(error => {
    console.warn(
      "[" + MODULE_ID + "] Fatal damage interception recovery failed",
      error,
    );
  });
  recoverBoundedDamageTransactions().catch(error => {
    console.warn(
      "[" + MODULE_ID + "] typed damage startup recovery failed",
      error,
    );
  });
  recoverSourceBoundOneShotReceipts().catch(error => {
    console.warn(
      "[" + MODULE_ID + "] source-bound one-shot startup recovery failed",
      error,
    );
  });
  recoverNativeSummonEntityLifecycles().catch(error => {
    console.warn(
      "[" + MODULE_ID + "] native summon lifecycle startup recovery failed",
      error,
    );
  });
  patchActorStudioArcaneSpellPack();
  Hooks.on("getSceneControlButtons", hideFthCharacterCreatorControl);
  Hooks.on("renderApplicationV2", injectBg3ShortRestButton);
  hideCurrentFthCharacterCreatorControl();
  Hooks.on("renderActorDirectory", hideNativeActorCreateButton);
  Hooks.on("renderActorDirectory5e", hideNativeActorCreateButton);
  Hooks.on("preCreateItem", (item) => preventDuplicateArcaneFeatCreate(item));
  Hooks.on("midi-qol.targetingComplete", workflow => {
    try {
      return filterCompilerWorkflowTargets(workflow);
    } catch (error) {
      console.warn(
        "[" + MODULE_ID + "] Compiler target filtering failed",
        error,
      );
      return false;
    }
  });
  Hooks.on("midi-qol.preCheckSaves", workflow => {
    try {
      prepareCompilerConditionalSaveTargets(workflow);
      return filterCompilerWorkflowTargets(workflow, {
        preserveOutcomeSets: true,
      });
    } catch (error) {
      console.warn(
        "[" + MODULE_ID + "] Compiler save-target filtering failed",
        error,
      );
      return false;
    }
  });
  Hooks.on("createItem", (item, options, userId) => {
    handleRangerTcePatchCreate(item, options, userId).catch(error => {
      console.warn("[" + MODULE_ID + "] Ranger TCE patch failed", error);
    });
  });
  Hooks.on("deleteActiveEffect", (effect, options) => {
    if (nativeSummonEntityLifecycleContract(effect)) {
      NATIVE_SUMMON_LIFECYCLE_DELETIONS.delete(effect.uuid);
    }
    scheduleCompilerPhysicalSizeSync(effect);
    Promise.all([
      cleanupFavoredFoeTargets(effect),
      cleanupSourceTargetDamageMirrorCounterpart(effect),
      cleanupCompilerSourceWhenLastDependentEnds(effect, options),
      applyOutcomeRaceNaturalExpiry(effect, options),
      cleanupTemporaryHitPointsSourceOnDelete(effect, options),
      cleanupTemporaryHitPointsRetaliationOnDelete(effect, options),
      cleanupEffectHostHitByAttackOnDelete(effect, options),
      cleanupMagicWeaponFromSource(effect),
      cleanupReversibleHitPointCapacity(effect, options),
      restoreSuppressedStatusEffects(effect, options),
      restoreCompilerAuraMembershipAfterSourceDelete(effect),
      cleanupCompilerZoneLeaveArtifacts(effect, options),
      applyCompilerArtifactEndedOutcomes(effect, options),
    ]).catch(error => {
      console.warn("[" + MODULE_ID + "] ActiveEffect cleanup failed", error);
    });
  });
  Hooks.on("preDeleteActiveEffect", (effect, options) => {
    if (nativeSummonEntityLifecycleContract(effect)) {
      NATIVE_SUMMON_LIFECYCLE_DELETIONS.add(effect.uuid);
    }
    snapshotReversibleHitPointCapacityDelete(effect, options);
  });
  Hooks.on("preCreateActiveEffect", effect => {
    try {
      prepareCompilerZoneMembershipProvenance(effect);
      prepareCompilerSourceTargetIdentity(effect);
      prepareRuntimeEffectLifecycle(effect);
      prepareCompilerPhysicalSizeEffect(effect);
    } catch (error) {
      console.warn(
        "[" + MODULE_ID + "] Compiler ActiveEffect preparation failed",
        error,
      );
    }
  });
  Hooks.on("createActiveEffect", effect => {
    scheduleCompilerPhysicalSizeSync(effect);
    replaceCompilerAuraCopiesWithNewSource(effect).catch(error => {
      console.warn("[" + MODULE_ID + "] Compiler aura source normalization failed", error);
    });
    materializeCompilerSourceTargetIdentity(effect)
      .then(() => anchorRuntimeEffectLifecycle(effect))
      .catch(error => {
        console.warn(
          "[" + MODULE_ID + "] Runtime identity/lifecycle materialization failed",
          error,
        );
      });
  });
  Hooks.on("updateActiveEffect", effect => {
    scheduleCompilerPhysicalSizeSync(effect);
  });
  Hooks.on("createToken", token => {
    scheduleCompilerPhysicalSizeActorSync(token?.actor);
  });
  Hooks.on("deleteToken", token => {
    const cleanup = async () => {
      await cleanupNativeSummonChildrenForDeletedToken(token);
      await cleanupNativeSummonCombatantsForDeletedToken(token);
      await cleanupNativeSummonLifecycleForDeletedToken(token);
    };
    NATIVE_SUMMON_COMBAT_CLEANUP_QUEUE = NATIVE_SUMMON_COMBAT_CLEANUP_QUEUE
      .then(cleanup, cleanup)
      .catch(error => {
        console.warn(
          "[" + MODULE_ID + "] Native summon Combatant cleanup failed",
          error,
        );
      });
  });
  Hooks.on("canvasReady", () => {
    const actors = new Map();
    for (const token of Array.from(canvas.scene?.tokens ?? [])) {
      if (token?.actor?.uuid) actors.set(token.actor.uuid, token.actor);
    }
    for (const actor of actors.values()) {
      scheduleCompilerPhysicalSizeActorSync(actor);
    }
    recoverFatalDamageInterceptions().catch(error => {
      console.warn(
        "[" + MODULE_ID + "] Fatal damage interception canvas recovery failed",
        error,
      );
    });
    recoverBoundedDamageTransactions().catch(error => {
      console.warn(
        "[" + MODULE_ID + "] typed damage canvas recovery failed",
        error,
      );
    });
    recoverSourceBoundOneShotReceipts().catch(error => {
      console.warn(
        "[" + MODULE_ID + "] source-bound one-shot canvas recovery failed",
        error,
      );
    });
    recoverNativeSummonEntityLifecycles().catch(error => {
      console.warn(
        "[" + MODULE_ID + "] native summon lifecycle canvas recovery failed",
        error,
      );
    });
  });
  Hooks.on("dnd5e.preUseActivity", (activity, usageConfig) => {
    try {
      const workflow = usageConfig?.workflow ?? null;
      const item = activity?.item ?? workflow?.item;
      const actor = activity?.actor ?? workflow?.actor ?? item?.actor;
      const block = guardNativeSummonControlAction(
        actor,
        item,
        activity,
        workflow,
        usageConfig,
      );
      if (block) {
        const rejection = publishArcaneActionPreflightRejection(
          activity,
          usageConfig,
          block.error ? "ACTION_MISCONFIGURED" : "ACTION_BLOCKED",
          block.message,
        );
        ui.notifications?.warn(rejection.message);
        return false;
      }
      return prepareNativeSummonUse(activity, usageConfig);
    } catch (error) {
      usageConfig.arcaneNativeSummonError = String(error?.message ?? error);
      usageConfig.arcaneActionRejection = {
        code: error?.arcaneNativeSummonRejectionCode === "ACTION_BLOCKED"
          ? "ACTION_BLOCKED"
          : "ACTION_MISCONFIGURED",
        message: usageConfig.arcaneNativeSummonError,
      };
      const requestId = String(
        usageConfig?.summons?.arcaneNativeRequestId
          ?? usageConfig?.midiOptions?.workflowOptions?.arcaneNativeRequestId
          ?? "",
      ).trim();
      Hooks.callAll(MODULE_ID + ".nativeSummonRejected", {
        requestId: requestId || null,
        activityUuid: nativeSummonActivityUuid(activity) || null,
        sourceItemUuid: String(activity?.item?.uuid ?? "").trim() || null,
        code: error?.arcaneNativeSummonRejectionCode === "ACTION_BLOCKED"
          ? "ACTION_BLOCKED"
          : "ACTION_MISCONFIGURED",
        message: usageConfig.arcaneNativeSummonError,
      });
      ui.notifications?.error(usageConfig.arcaneNativeSummonError);
      console.warn("[" + MODULE_ID + "] native summon pre-use rejected", error);
      return false;
    }
  });
  Hooks.on("dnd5e.activityConsumption", (activity, usageConfig, _messageConfig, updates) => {
    try {
      return prepareSourceBoundOneShotConsumption(activity, usageConfig, updates);
    } catch (error) {
      const rejection = publishArcaneActionPreflightRejection(
        activity,
        usageConfig,
        error?.arcaneSourceBoundOneShotCode
          ?? error?.code
          ?? "ACTION_MISCONFIGURED",
        error?.message ?? error,
      );
      usageConfig.arcaneSourceBoundOneShotError = rejection.message;
      usageConfig.arcaneSourceBoundOneShotCode = rejection.code;
      usageConfig.arcaneSourceBoundOneShotRetry = error?.retry === true;
      ui.notifications?.error(usageConfig.arcaneSourceBoundOneShotError);
      console.warn("[" + MODULE_ID + "] source-bound one-shot consumption rejected", error);
      return false;
    }
  });
  Hooks.on("dnd5e.preSummon", (activity, profile, options) => {
    try {
      return guardNativeSummonPlacement(activity, profile, options);
    } catch (error) {
      ui.notifications?.error(String(error?.message ?? error));
      console.warn("[" + MODULE_ID + "] native summon placement rejected", error);
      return false;
    }
  });
  Hooks.on("dnd5e.summonToken", (activity, profile, tokenData, options) => {
    prepareNativeSummonTokenData(activity, profile, tokenData, options);
  });
  Hooks.on("dnd5e.postSummon", (activity, profile, tokens, options) => {
    captureNativeSummonTokens(activity, profile, tokens, options);
  });
  Hooks.on("dnd5e.postUseActivity", (activity, usageConfig, results) => {
    try {
      return captureNativeSummonPostUse(activity, usageConfig, results);
    } catch (error) {
      results.arcaneNativeSummonError = String(error?.message ?? error);
      console.warn("[" + MODULE_ID + "] native summon post-use capture failed", error);
      return true;
    }
  });
  // Twilight Sanctuary's utility Activity never enters a Midi workflow, so the
  // completeItemUse path never fires for it; this dnd5e-native hook is the
  // reliable entry point for its marker. Kept as a separate registration so
  // the frozen native-summon invocation site keeps its exact shape.
  Hooks.on("dnd5e.postUseActivity", async (activity, usageConfig) => {
    try {
      await applyTwilightSanctuaryFromActivityUse(activity, usageConfig);
    } catch (error) {
      console.warn("[" + MODULE_ID + "] Twilight Sanctuary post-use automation failed", error);
    }
    return true;
  });
  Hooks.on("deleteActiveEffect", effect => {
    try {
      if (!effect?.getFlag?.(MODULE_ID, "twilightSanctuary")) return true;
      endTwilightSanctuaryRing(effect.id);
    } catch (_error) {}
    return true;
  });
  Hooks.on("combatEnd", () => {
    try {
      for (const token of canvas.tokens?.placeables ?? []) {
        for (const effect of token.actor?.effects ?? []) {
          if (!effect?.getFlag?.(MODULE_ID, "twilightSanctuary")) continue;
          if (effect.isActive) continue;
          endTwilightSanctuaryRing(effect.id);
        }
      }
    } catch (_error) {}
    return true;
  });
  Hooks.on("midi-qol.postCleanup", async workflow => {
    try {
      await finalizeNativeSummonFromWorkflow(workflow);
    } catch (_error) {
      // The finalizer already emitted one exact failure event and notification.
      // Keep Midi cleanup moving; public Context callers re-observe the same
      // workflow-scoped rejected promise from the completeItemUse wrapper.
    }
    return true;
  });
  Hooks.on("updateUser", (user, changed) => {
    if (!("active" in (changed ?? {}))) return;
    recoverFatalDamageInterceptions().catch(error => {
      console.warn(
        "[" + MODULE_ID + "] Fatal damage interception GM-handoff recovery failed",
        error,
      );
    });
    recoverSourceBoundOneShotReceipts().catch(error => {
      console.warn(
        "[" + MODULE_ID + "] source-bound one-shot GM-handoff recovery failed",
        error,
      );
    });
  });
  Hooks.on("moveToken", (token, movement) => {
    handleCompilerFollowingAuraTokenMoved(token, movement).catch(error => {
      console.warn("[" + MODULE_ID + "] Compiler following-aura entry automation failed", error);
    });
    handleCompilerZoneTokenMoved(token, movement).catch(error => {
      console.warn("[" + MODULE_ID + "] Compiler zone entry automation failed", error);
    });
  });
  Hooks.on("updateMeasuredTemplate", (template, changed, options, userId) => {
    refreshCompilerZoneTemplateMembership(template, changed, options, userId).catch(error => {
      console.warn("[" + MODULE_ID + "] Compiler zone template refresh failed", error);
    });
  });
  Hooks.on("deleteMeasuredTemplate", template => {
    cleanupCompilerZoneMembershipOnTemplateDelete(template).catch(error => {
      console.warn("[" + MODULE_ID + "] Compiler zone membership cleanup failed", error);
    });
  });
  queueMicrotask(hideNativeActorCreateButton);
  queueMicrotask(injectBg3ShortRestButtonsIntoOpenSheets);
  configureActorStudioSpellSource().catch(error => {
    console.warn(`[${MODULE_ID}] Actor Studio spell source configuration failed`, error);
  });
  configureMidiQolFullAutomationSettings().catch(error => {
    console.warn(`[${MODULE_ID}] midi-qol automation configuration failed`, error);
  });
  game.modules.get(HOST_MODULE_ID).api = {
    cancelNativeSummonUse,
    finalizeNativeSummonUse,
    hideFthCharacterCreatorControl,
    hideCurrentFthCharacterCreatorControl,
    hideNativeActorCreateButton,
    hasVowOfEnmityMarker,
    applyVowOfEnmityAdvantage,
    applyVowOfEnmityMarker,
    applyVowOfEnmityMarkerFromUse,
    configureMidiQolFullAutomationSettings,
    migrateCharacterSpellInteractionContracts,
    applyDeclaredDivineSmite,
    applyDeclaredWeaponSpellRider,
    dispatchPerSpellScript,
    dispatchPerSpellScriptActivity,
    dispatchOutcomeRaceActivity,
    applyOutcomeRaceNaturalExpiry,
    registerPerSpellScript,
    applyLevel12SpellPostUse,
    bindSourceTargetDamageMirrorFromUse,
    mirrorSourceTargetDamage,
    cleanupSourceTargetDamageMirrorCounterpart,
    cleanupCompilerSourceWhenLastDependentEnds,
    captureTemporaryHitPointsRetaliationCast,
    applyTemporaryHitPointsRetaliation,
    cleanupTemporaryHitPointsRetaliationAfterDamage,
    cleanupTemporaryHitPointsRetaliationOnDelete,
    captureEffectHostHitByAttackCast,
    captureEffectHostHitByAttackBeforeDamage,
    resolveEffectHostHitByAttack,
    cleanupEffectHostHitByAttackAfterDamage,
    cleanupEffectHostHitByAttackOnDelete,
    prepareSourceBoundOneShotConsumption,
    applySourceBoundOneShotFromUse,
    reconcileSourceBoundOneShotActor,
    recoverSourceBoundOneShotReceipts,
    applySourceArtifactDismissFromUse,
    applyCastOriginStaticMarkerFromUse,
    compilerWorkflowUsesCastOriginStaticMarker,
    applyWeaponEnchantmentFromUse,
    applyMagicWeaponFromUse,
    bindTemporaryHitPointsSourcesFromUse,
    cleanupTemporaryHitPointsSourcesAfterDamage,
    cleanupTemporaryHitPointsSourceOnDelete,
    refreshTemporaryHitPointsSourcesAtTurnStart,
    captureExternalOperationArtifactTransitionsBeforeDamage,
    consumeExternalOperationArtifactTransitions,
    resolveExternalOperationArtifactTransitions,
    applyHitPointPoolAllocatorFromUse,
    applySleepFromUse,
    applyPlacedPointMoveTokenFromUse,
    applyDamageTriggeredRepeatSave,
    applyTargetStatusRemovalFromUse,
    applyProtectionFromPoisonSavingThrow,
    applyRangerTceOptionalFeaturesPatch,
    applyFavoredFoe,
    applyVigilantBlessingFromUse,
    grantBardicInspiration,
    declareBardicInspirationUse,
    applyBardicInspirationFromUse,
    applyBardicInspirationAttack,
    applyBardicInspirationSavingThrow,
    applyCountercharmFromUse,
    applyCountercharmSavingThrow,
    applyTwilightSanctuaryFromUse,
    playTwilightSanctuaryRing,
    endTwilightSanctuaryRing,
    applyAasimarRevelationFromUse,
    applyDeclaredAasimarRevelationDamage,
    applyRadiantConsumptionTurnEnd,
    applyVampireRegenerationTurnStart,
    suppressVampireRegenerationFromDamage,
    applyRacialSavingThrowAutomation,
    applySunlightSensitivityAttack,
    applySavageAttacksDamageBonus,
    applySavageAttackerHouseRuleReroll,
    applyFatalDamageInterceptionPreDamage,
    collectFatalDamageInterceptionCandidates,
    fatalDamageWouldKillOutright,
    settleFatalDamageInterceptions,
    recoverFatalDamageInterceptions,
    bloodSeekingTemporaryHitPoints,
    bloodSeekingDamageEntryDefeated,
    applyBloodSeekingFromWorkflow,
    applyTurnUndeadFromWorkflow,
    applyAuraOfProtectionSave,
    applyAuraOfProtectionSavingThrow,
    isRangedWeaponAttack,
    applyDuelingDamageBonus,
    applyGreatWeaponFightingReroll,
    applyExtraDamageSegment,
    createDamageSummaryForItemCard,
    scheduleDamageSummaryForWorkflow,
    confirmedHitTargets,
    prepareMarkedTargetParentDamage,
    prepareSourceAttackProximityRider,
    prepareSourceArmedAttackTransformAttack,
    prepareSourceArmedAttackTransformDamage,
    applySourceArmedAttackTransformDamageConfig,
    resolveSourceArmedAttackTransform,
    applyDeclaredActiveBuffAttackConfig,
    prepareDeclaredActiveBuffDamage,
    finalizeParentDamageRiders,
    finalizeSourceAttackProximityRiders,
    finalizeDeclaredActiveBuff,
    blockedActionForActor,
    anchorRuntimeEffectLifecycleData,
    materializeCompilerSourceTargetIdentity,
    cleanupRuntimeEffectLifecycles,
    runtimeLifecycleIsActiveSourceTurn,
    compilerRuntimeModifiers,
    compilerWeaponAttackMagicClassification,
    prepareCompilerWeaponAttackResistance,
    cleanupCompilerWeaponAttackResistance,
    cleanupCompilerTransientWorkflowState,
    applyCompilerNextTurnAttackAdvantage,
    consumeCompilerNextTurnAttackAdvantage,
    applyCompilerBlurDisadvantage,
    prepareCompilerPhysicalSizeEffect,
    syncCompilerPhysicalSizeTokens,
    prepareCompilerConditionalSaveTargets,
    enforceCompilerWeaponDamageMinimum,
    cacheCompilerWeaponAttackAbility,
    compilerWeaponHitDamageScale,
    scaledCompilerDamageRolls,
    appendCompilerWeaponHitDamageScaleReceipt,
    enforceCompilerWeaponHitDamageScale,
    applyHuntersMarkDamageBonus,
    applySpiritShroudDamageBonus,
    applySpiritShroudTurnStart,
    applySourceTurnStartProximityEffect,
    applyCompilerFollowingAuraTurnStart,
    handleCompilerFollowingAuraTokenMoved,
    triggerCompilerFollowingAuraEventActivity,
    triggerCompilerZoneEventActivity,
    handleCompilerZoneTokenMoved,
    applyCompilerZoneTurnStart,
    applyCompilerZoneTurnEnd,
    cleanupCompilerZoneLeaveArtifacts,
    refreshCompilerZoneTemplateMembership,
    cleanupCompilerZoneMembershipOnTemplateDelete,
    applyCompilerRuntimePostUse,
    applyIndependentProjectilesFromUse,
    applyCompilerWorkflowOutcomeActivities,
    inheritCompilerTriggeredActivityScaling,
    applyLinkedOperationResultsFromUse,
    applyLifeTransferenceFromUse,
    applyDeclaredDreadAmbusher,
    applyDeclaredPowerAttackBeforeUse,
    preventDuplicateArcaneFeatCreate,
    applyDreadAmbusherInitiative,
    applyDreadAmbusherTurnStart,
    applyBg3ShortRestHealing,
    bg3ShortRestQuota,
    recoverBardicInspirationOnRest,
    restActor,
    restGroup,
    injectBg3ShortRestButton,
    injectBg3ShortRestButtonsIntoOpenSheets,
    findNearbyAuraSources,
    bestAuraSource,
    patchMidiCompleteItemUse,
    sourceActorUuidFromOrigin,
  };
});

Hooks.on("midi-qol.preAttackRollConfig", workflow => {
  try {
    prepareSourceArmedAttackTransformAttack(workflow);
    applyVowOfEnmityAdvantage(workflow);
    applyDeclaredActiveBuffAttackConfig(workflow);
    applyCompilerNextTurnAttackAdvantage(workflow);
    applyCompilerBlurDisadvantage(workflow);
    return true;
  } catch (error) {
    console.warn(`[${MODULE_ID}] Vow of Enmity automation failed`, error);
    return true;
  }
});

Hooks.on("midi-qol.AttackRollComplete", async workflow => {
  try {
    // The final dnd5e attack mode (including thrown) is only reliable after
    // the attack roll. Re-run the idempotent reservation here so ranged spell
    // transforms see the canonical action type before damage or miss handling.
    prepareSourceArmedAttackTransformAttack(workflow);
    cacheCompilerWeaponAttackAbility(workflow);
    await consumeCompilerNextTurnAttackAdvantage(workflow);
    return true;
  } catch (error) {
    releaseCompilerNextTurnAttackAdvantage(workflow);
    console.warn(
      "[" + MODULE_ID + "] Next-turn attack advantage cleanup failed",
      error,
    );
    return true;
  }
});

Hooks.on("midi-qol.RollComplete", workflow => {
  if (workflow && typeof workflow === "object") {
    workflow.__arcaneRollComplete = true;
  }
  return true;
});

Hooks.on("dnd5e.preUseActivity", (activity, usageConfig) => {
  try {
    inheritCompilerTriggeredActivityScaling(activity, usageConfig);
  } catch (error) {
    console.warn(
      "[" + MODULE_ID + "] Triggered activity scaling inheritance failed",
      error,
    );
  }
  try {
    const workflow = usageConfig?.workflow ?? null;
    const item = activity?.item ?? workflow?.item;
    inheritCompilerFollowUpCastLevel(activity, item, usageConfig);
    preflightCompilerSelectionCardinality(activity, usageConfig, workflow);
    const availability = activity?.getFlag?.(MODULE_ID, "availability")
      ?? activity?.flags?.[MODULE_ID]?.availability
      ?? null;
    const requiredArtifactId = String(
      availability?.requiresArtifactId ?? "",
    ).trim();
    if (
      requiredArtifactId
      && !compilerEffectsForArtifact(
        activity?.actor ?? workflow?.actor ?? item?.actor,
        requiredArtifactId,
        item,
      ).length
    ) {
      throw compilerSelectionCardinalityFailure(
        "Action requires an active " + requiredArtifactId
          + " source from this exact Item",
      );
    }
    return true;
  } catch (error) {
    const code = error?.arcaneActionRejectionCode
      ?? error?.code
      ?? "ACTION_MISCONFIGURED";
    const rejection = publishArcaneActionPreflightRejection(
      activity,
      usageConfig,
      code,
      error?.message ?? error,
    );
    ui.notifications?.warn(rejection.message);
    console.warn(
      "[" + MODULE_ID + "] Compiler Activity pre-use rejected",
      error,
    );
    return false;
  }
});

Hooks.on("midi-qol.preItemRollV2", ({ workflow } = {}) => {
  try {
    const activity = workflow?.activity;
    const item = activity?.item ?? workflow?.item;
    const actor = activity?.actor ?? workflow?.actor ?? item?.actor;
    const block = blockedActionForActor(actor, item, activity)
      ?? preflightRequiredCompilerSelections(item, activity, workflow)
      ?? preflightOwnedWeaponAttack(actor, item, activity)
      ?? compilerWeaponEnchantmentPreflight(actor, item, activity);
    if (!block) {
      // Seed the original Midi workflow on success, but defer every Reassert
      // Control rejection to dnd5e.preUseActivity. Returning false here makes
      // Midi publish an aborted workflow, which is intentionally not a safe
      // no-write rejection receipt for an agent caller.
      guardNativeSummonControlAction(actor, item, activity, workflow);
      return true;
    }
    ui.notifications?.warn(
      block.message
      ?? (
        (actor?.name ?? "Actor")
          + " cannot use "
          + (item?.name ?? activity?.name ?? block.kind)
          + " while affected by "
          + (block.effectName ?? "an action-blocking effect")
          + "."
      ),
    );
    if (block.error) {
      console.warn(
        "[" + MODULE_ID + "] Weapon enchantment preflight failed",
        block.error,
      );
    }
    return false;
  } catch (error) {
    console.warn("[" + MODULE_ID + "] Action-block check failed", error);
    return true;
  }
});

Hooks.on("midi-qol.preDamageRoll", async (workflow, activity, config) => {
  try {
    await prepareSourceArmedAttackTransformDamage(workflow, config);
    await prepareCompilerWeaponAttackResistance(workflow);
    await prepareDeclaredWeaponSpellRiderDamage(workflow, activity, config);
    await prepareMarkedTargetParentDamage(workflow, activity, config);
    await prepareSourceAttackProximityRider(workflow, activity, config);
    await prepareDeclaredActiveBuffDamage(workflow, activity, config);
    return true;
  } catch (error) {
    console.warn(`[${MODULE_ID}] Declared weapon spell rider preparation failed`, error);
    return true;
  }
});

Hooks.on("dnd5e.preRollDamage", config => {
  try {
    applySourceArmedAttackTransformDamageConfig(config);
    return true;
  } catch (error) {
    console.warn(
      "[" + MODULE_ID + "] Source-armed damage replacement failed",
      error,
    );
    return true;
  }
});

Hooks.on("dnd5e.preRollAttack", (config, dialog, message) => {
  try {
    applySunlightSensitivityAttack(config, dialog, message);
    applyBardicInspirationAttack(config, dialog, message);
  } catch (error) {
    console.warn(`[${MODULE_ID}] Attack roll automation failed`, error);
  }
});

Hooks.on("midi-qol.RollComplete", workflow => {
  const task = (async () => {
    const priorError = workflow?.__arcaneCompilerRuntimeError;
    if (priorError?.message) throw new Error(priorError.message);
    applyVowOfEnmityMarker(workflow);
    await applyTurnUndeadFromWorkflow(workflow);
    await applyCompilerRuntimePostUse(
      workflow?.activity?.item ?? workflow?.item,
      null,
      workflow,
    );
    await resolveEffectHostHitByAttack(workflow);
    await applyDamageMirrorHealSourceFromUse(workflow?.activity?.item ?? workflow?.item, null, workflow);
    await applyBloodSeekingFromWorkflow(workflow);
    await resolveSourceArmedAttackTransform(workflow);
    return true;
  })();
  if (workflow && typeof workflow === "object") {
    workflow.__arcaneCompilerRuntimeCompletion = task;
  }
  void task.catch(error => {
    recordCompilerRuntimeError(workflow, error, "roll-complete");
    releaseSourceArmedAttackTransform(workflow);
    console.warn(`[${MODULE_ID}] RollComplete automation failed`, error);
  });
  return true;
});

Hooks.on("midi-qol.RollComplete", async workflow => {
  try {
    await cleanupCompilerTransientWorkflowState(workflow);
    return true;
  } catch (error) {
    console.warn(
      "[" + MODULE_ID + "] Compiler transient workflow cleanup failed",
      error,
    );
    return true;
  }
});

for (const hookName of ["midi-qol.preAbort", "midi-qol.postCleanup"]) {
  Hooks.on(hookName, async workflow => {
    try {
      if (hookName === "midi-qol.preAbort" || workflow?.aborted === true) {
        releaseSourceArmedAttackTransform(workflow);
      }
      await cleanupCompilerTransientWorkflowState(workflow);
      return true;
    } catch (error) {
      console.warn(
        "[" + MODULE_ID + "] Compiler transient " + hookName + " cleanup failed",
        error,
      );
      return true;
    }
  });
}

Hooks.on("midi-qol.DamageRollComplete", async workflow => {
  try {
    await finalizeDeclaredWeaponSpellRiderDamage(workflow);
    await finalizeParentDamageRiders(workflow);
    await finalizeSourceAttackProximityRiders(workflow);
    await applyGreatWeaponFightingReroll(workflow);
    await applySavageAttackerHouseRuleReroll(workflow);
    await enforceCompilerWeaponDamageMinimum(workflow);
    await enforceCompilerWeaponHitDamageScale(workflow);
    await applyDuelingDamageBonus(workflow);
    await applySavageAttacksDamageBonus(workflow);
    return true;
  } catch (error) {
    recordCompilerRuntimeError(workflow, error, "damage-roll-complete");
    console.warn(`[${MODULE_ID}] DamageRollComplete automation failed`, error);
    return true;
  }
});

Hooks.on("dnd5e.preRollInitiative", (combatant, rollConfig) => {
  try {
    applyDreadAmbusherInitiative(combatant, rollConfig);
    const actor = combatant?.actor;
    const blessing = Array.from(actor?.effects ?? []).find(effect => effect.getFlag?.(MODULE_ID, "vigilantBlessing"));
    if (blessing) {
      rollConfig.advantage = true;
      actor.deleteEmbeddedDocuments("ActiveEffect", [blessing.id]);
    }
  } catch (error) {
    console.warn(`[${MODULE_ID}] Initiative automation failed`, error);
  }
});

Hooks.on("dnd5e.preRollSavingThrow", (config, dialog, message) => {
  try {
    applyCountercharmSavingThrow(config, dialog, message);
    applyRacialSavingThrowAutomation(config, dialog, message);
    applyTriggeredRepeatSaveRollMode(config, message);
    applyProtectionFromPoisonSavingThrow(config, message);
    applyBardicInspirationSavingThrow(config, dialog, message);
    applyAuraOfProtectionSavingThrow(config, message);
  } catch (error) {
    console.warn(`[${MODULE_ID}] Saving throw automation failed`, error);
  }
});

Hooks.on("midi-qol.preTargetDamageApplication", async (target, context) => {
  try {
    await prepareBoundedDamageTransaction(target, context);
    captureExternalOperationArtifactTransitionsBeforeDamage(target, context);
    await captureEffectHostHitByAttackBeforeDamage(target, context);
    await applyTemporaryHitPointsRetaliation(target, context);
    await suppressVampireRegenerationFromDamage(target, context);
    await applyDamageTriggeredRepeatSave(target, context);
  } catch (error) {
    recordCompilerRuntimeError(
      context?.workflow ?? context,
      error,
      "pre-target-damage",
    );
    console.warn("[" + MODULE_ID + "] Pre-damage target automation failed", error);
    return false;
  }
  return true;
});

Hooks.on("dnd5e.preApplyDamage", (actor, amount, updates, options) => {
  try {
    if (!applyBoundedDamageTransactionPreDamage(actor, amount, updates, options)) {
      return false;
    }
    return applyFatalDamageInterceptionPreDamage(actor, amount, updates, options);
  } catch (error) {
    console.warn(`[${MODULE_ID}] Fatal damage interception failed`, error);
    return true;
  }
});

Hooks.on("updateActor", (actor, changed, options) => {
  if (options?.[MODULE_ID]?.perSpellDamageSettlement !== true) {
    settleBoundedDamageTransactions(actor).catch(error => {
      console.warn("[" + MODULE_ID + "] Typed damage update settle failed", error);
    });
  }
  if (options?.[MODULE_ID]?.fatalDamageInterceptionSettlement !== true) {
    settleFatalDamageInterceptions(actor).catch(error => {
      console.warn("[" + MODULE_ID + "] Fatal damage interception update settle failed", error);
    });
  }
  cleanupNativeSummonLifecycleForDefeatedActor(actor).catch(error => {
    console.warn("[" + MODULE_ID + "] Native summon defeated Actor cleanup failed", error);
  });
});

Hooks.on("updateCombatant", combatant => {
  cleanupNativeSummonLifecycleForDefeatedCombatant(combatant).catch(error => {
    console.warn("[" + MODULE_ID + "] Native summon defeated Combatant cleanup failed", error);
  });
});

Hooks.on("dnd5e.applyDamage", (actor, amount, options) => {
  Promise.all([
    settleBoundedDamageTransactions(actor),
    settleFatalDamageInterceptions(actor),
    cleanupTemporaryHitPointsSourcesAfterDamage(actor),
    cleanupTemporaryHitPointsRetaliationAfterDamage(actor),
    cleanupEffectHostHitByAttackAfterDamage(actor),
    mirrorSourceTargetDamage(actor, amount, options),
  ]).catch(error => {
    console.warn("[" + MODULE_ID + "] Post-damage automation failed", error);
  });
});

Hooks.on("dnd5e.restCompleted", async (actor, result) => {
  try {
    await recoverBardicInspirationOnRest(actor, result);
    await cleanupNativeSummonLifecycleOnLongRest(actor, result);
    if (result?.type === "long" || result?.longRest === true) {
      await resetBg3ShortRestQuotaForTarget(actor);
      if (actor?.type !== "group") {
        for (const group of game.actors.filter(candidate => candidate?.type === "group")) {
          if (groupMemberActors(group).some(member => member?.id === actor.id)) {
            await resetBg3ShortRestQuota(group);
          }
        }
      }
    }
  } catch (error) {
    console.warn(`[${MODULE_ID}] Bard rest automation failed`, error);
  }
});

Hooks.on("updateCombat", async (combat, changed) => {
  try {
    await cleanupRuntimeEffectLifecycles(combat, changed);
    if ("turn" in changed) {
      const previousTurn = changed.turn === 0 ? combat.turns.length - 1 : changed.turn - 1;
      const previousCombatant = combat.turns[previousTurn];
      await applyRadiantConsumptionTurnEnd(previousCombatant?.token?.object);
    }
    await applyCompilerFollowingAuraTurnStart(combat, changed);
    await applyCompilerZoneTurnEnd(combat, changed);
    await applyCompilerZoneTurnStart(combat, changed);
    await applyCompilerSourceTurnChecks(combat, changed, "turn-end");
    await applyCompilerSourceTurnChecks(combat, changed, "turn-start");
    await applySourceTurnStartProximityEffect(combat, changed);
    await applySpiritShroudTurnStart(combat, changed);
    await refreshTemporaryHitPointsSourcesAtTurnStart(combat, changed);
    await applyDreadAmbusherTurnStart(combat, changed);
    await applyVampireRegenerationTurnStart(combat, changed);
  } catch (error) {
    console.warn(`[${MODULE_ID}] Combat automation failed`, error);
  }
});

Hooks.on("deleteCombat", combat => {
  cleanupRuntimeEffectLifecycles(combat, {}, { ended: true }).catch(error => {
    console.warn("[" + MODULE_ID + "] Combat-end runtime lifecycle cleanup failed", error);
  });
});

      const runtime = {mode: 'standalone', kind: 'full', adapters: ["artifact-ended-outcome-v1","cast-origin-static-marker-v1","damage-mirror-heal-source-v1","damage-triggered-repeat-save-v1","declared-active-buff-v1","declared-weapon-spell-rider-v1","effect-host-hit-by-attack-v1","external-operation-artifact-transition-v1","fatal-damage-interception-v1","following-aura-event-activity-v1","hit-point-pool-allocator-v1","life-transference-v1","linked-operation-results-v1","magic-weapon-enchantment-v1","marked-target-parent-damage-v1","native-summon","native-summon-control-v1","outcome-race-v1","owned-weapon-attack-v1","placed-point-move-token-v1","required-selection-outcome-v1","reversible-hit-point-capacity-v1","sleep-hit-point-pool-v1","source-armed-attack-transform-v1","source-artifact-dismiss-v1","source-attack-proximity-rider-v1","source-bound-one-shot-v1","source-target-damage-mirror-v1","source-turn-check-v1","source-turn-start-proximity-effect-v1","spirit-shroud-hit-v1","spirit-shroud-turn-start-v1","status-effect-suppression-v1","target-status-removal-v1","temporary-hit-points-refresh-v1","temporary-hit-points-retaliation-v1","temporary-hit-points-source-v1","triggered-event-activity-v1","typed-damage-dispatcher-v2","weapon-enchantment-v1","workflow-outcome-activity-v1","workflow-outcome-forced-movement-v1","workflow-outcome-operations-v1","zone-event-activity-v1"],
        abortInitialization() {
          if (readyStarted) throw new Error('Runtime already started; reload the world to change modules');
          for (const [name, id] of registered) nativeHooks.off(name, id);
          globalThis.ArcaneDnd5e2014SpellScripts = priorScripts;
          if (globalThis[key] === runtime) delete globalThis[key];
        },
        getScriptContract(id) {const script = PER_SPELL_SCRIPT_REGISTRY.get(id); return script
          ? {id: script.id, version: script.version, handlers: Object.keys(script.handlers)} : null;},
        get api() {return globalThis.game?.modules?.get(moduleId)?.api;}};
      globalThis[key] = runtime;
      return runtime;
    } catch (error) {
      for (const [name, id] of registered) nativeHooks.off(name, id);
      globalThis.ArcaneDnd5e2014SpellScripts = priorScripts;
      throw error;
    }
  }
