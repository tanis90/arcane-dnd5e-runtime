import {summonProfileUuid} from "@arcanedesk/automation-contracts/bindings";
import {hashString} from "@arcanedesk/automation-contracts/semantics";
import {
  ARCANE_AUTOMATION_MODULE_ID,
  SPELL_AUTOMATION_COMPILER_VERSION,
  SPELL_AUTOMATION_SCHEMA_VERSION,
  semanticHash,
  stableStringify,
} from "@arcanedesk/automation-contracts/semantics";
import {
  normalizeCleanRoomPackaging,
} from "./spell-automation-cleanroom.mjs";

const MODULE_ID = ARCANE_AUTOMATION_MODULE_ID;
const SPELL_AUTOMATION_PROFILE_VERSION = 1;
const COMPILER_ACTIVITY_CONTRACT_VERSION = 1;
const DND5E_CREATURE_TYPES = new Set([
  "aberration",
  "beast",
  "celestial",
  "construct",
  "dragon",
  "elemental",
  "fey",
  "fiend",
  "giant",
  "humanoid",
  "monstrosity",
  "ooze",
  "plant",
  "undead",
]);
const ACTIVE_AURAS_TEMPLATE_MACRO = `const arg = Array.isArray(args) ? args[0] : args;
if (arg?.macroPass !== "preActiveEffects" && arg?.tag !== "OnUse") return;
const activeAuras = game.modules.get("ActiveAuras");
if (!activeAuras?.active || typeof activeAuras.api?.AAHelpers?.applyTemplate !== "function") {
  ui.notifications.error("This spell requires the ActiveAuras module.");
  throw new Error("ActiveAuras is required for template automation");
}
const template = canvas.templates.get(arg.templateId)?.document
  ?? (arg.templateUuid ? await fromUuid(arg.templateUuid) : null);
if (!template?.uuid) throw new Error("ActiveAuras template provenance is unavailable");
const activity = arg.workflow?.activity ?? arg.activity;
const templateEffectIds = activity?.flags?.["${MODULE_ID}"]?.templateEffectIds ?? [];
const templateEffectMode = activity?.flags?.["${MODULE_ID}"]?.templateEffectMode;
if (!["exclusive", "mixed"].includes(templateEffectMode)) {
  throw new Error("ActiveAuras template effect mode is unavailable");
}
const sourceItem = arg.item ?? activity?.item ?? arg.workflow?.item;
const sourceActor = arg.actor ?? activity?.actor ?? sourceItem?.actor;
const sourceSpellLevel = arg.spellLevel
  ?? arg.workflow?.castData?.castLevel
  ?? arg.workflow?.spellLevel
  ?? sourceItem?.system?.level;
const sourceEffects = Array.from(sourceItem?.effects ?? []).filter(effect =>
  templateEffectIds.includes(effect.id ?? effect._id)
);
if (sourceEffects.length !== templateEffectIds.length || sourceEffects.length === 0) {
  throw new Error("ActiveAuras template effects do not match the compiled activity contract");
}
const templateEffects = sourceEffects.map(effect => {
  const data = effect?.toObject ? effect.toObject() : foundry.utils.deepClone(effect);
  const contract = data?.flags?.["${MODULE_ID}"]?.zoneEventActivity;
  if (
    contract?.version === 1
    || data?.flags?.["${MODULE_ID}"]?.persistentTemplate === true
  ) {
    data.flags["${MODULE_ID}"].zoneTemplateUuid = template.uuid;
  }
  return data;
});
// ActiveAuras mutates its argument with haltEffectsApplication=true. Pass a
// shallow wrapper so it owns only the template effects. A mixed activity must
// then let Midi apply its ordinary target effects (for example a failed-save
// condition); an exclusive activity keeps the template effect as dnd5e's
// lifecycle anchor and preserves ActiveAuras' halt so it is never applied to a
// workflow target as an ordinary effect.
const templateResult = await activeAuras.api.AAHelpers.applyTemplate({
  ...arg,
  item: sourceItem,
  actor: sourceActor,
  spellLevel: sourceSpellLevel,
  effects: templateEffects,
});
return templateEffectMode === "mixed" ? {} : templateResult;`;

function clone(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

function compactObject(value) {
  if (Array.isArray(value)) return value.map(compactObject);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, child]) => child !== undefined)
      .map(([key, child]) => [key, compactObject(child)]),
  );
}

export function stableFoundryId(...parts) {
  return hashString(parts.map(value => String(value ?? "")).join(":")).slice(0, 16);
}

function blankTemplate(units = "ft") {
  return {
    count: "",
    contiguous: false,
    type: "",
    size: "",
    width: "",
    height: "",
    units,
    stationary: false,
  };
}

export function blankActivity(type = "utility", {
  runtimeProfile = {},
} = {}) {
  const activityDefaults = runtimeProfile.activityDefaults ?? {};
  return {
    _id: "",
    type,
    activation: {
      type: "",
      value: null,
      override: true,
      condition: "",
    },
    consumption: {
      targets: [],
      scaling: { allowed: false, max: "" },
      spellSlot: false,
    },
    description: { chatFlavor: "" },
    duration: {
      units: "inst",
      concentration: false,
      override: false,
    },
    effects: [],
    range: {
      value: null,
      units: "any",
      special: "",
      override: true,
    },
    target: {
      prompt: false,
      template: blankTemplate("ft"),
      affects: {
        count: "",
        type: "",
        choice: false,
        special: "",
      },
      override: true,
    },
    uses: {
      spent: 0,
      recovery: [],
      max: "",
    },
    sort: 0,
    name: "",
    img: "",
    visibility: {
      level: { min: null, max: null },
      requireAttunement: false,
      requireIdentification: false,
      requireMagic: false,
    },
    flags: {},
    useConditionText: "",
    useConditionReason: "",
    effectConditionText: "",
    macroData: { name: "", command: "" },
    ignoreTraits: {
      idi: false,
      idr: false,
      idv: false,
      ida: false,
      idm: false,
    },
    midiProperties: {
      ignoreTraits: [],
      triggeredActivityId: "none",
      triggeredActivityConditionText: "",
      triggeredActivityTargets: "targets",
      triggeredActivityRollAs: "self",
      triggeredActivityConsume: true,
      triggeredActivityConfigure: true,
      autoConsume: false,
      forceConsumeDialog: activityDefaults.forceConsumeDialog ?? "never",
      forceRollDialog: activityDefaults.forceRollDialog ?? "never",
      forceDamageDialog: activityDefaults.forceDamageDialog ?? "never",
      confirmTargets: activityDefaults.confirmTargets ?? "never",
      autoTargetType: "any",
      autoTargetAction: "none",
      automationOnly: false,
      otherActivityCompatible: true,
      otherActivityAsParentType: true,
      identifier: "",
      displayActivityName: false,
      rollMode: "default",
      chooseEffects: activityDefaults.chooseEffects ?? false,
      toggleEffect: false,
      ignoreFullCover: false,
      removeChatButtons: activityDefaults.removeChatButtons ?? "all",
      magicEffect: false,
      magicDamage: false,
      noConcentrationCheck: false,
      skipConcentrationCheck: false,
      autoCEEffects: "default",
    },
    isOverTimeFlag: false,
  };
}

export function blankActiveEffect(type = "base") {
  return {
    _id: "",
    name: "",
    img: "",
    origin: null,
    transfer: false,
    type,
    system: {},
    changes: [],
    disabled: false,
    duration: {
      startTime: null,
      combat: null,
      seconds: null,
      rounds: null,
      turns: null,
      startRound: null,
      startTurn: null,
    },
    description: "",
    tint: "#ffffff",
    statuses: [],
    sort: 0,
    flags: {},
  };
}

export function blankSpellItem({
  identifier,
  name,
  img = "icons/svg/book.svg",
  description = { value: "", chat: "" },
  source = {
    custom: "",
    book: "",
    page: "",
    license: "",
    rules: "2014",
    revision: 1,
  },
  documentIdentity = {},
  packaging = {},
  runtimeProfile = {},
} = {}) {
  if (!identifier) throw new Error("blankSpellItem requires an identifier");
  const cleanRoomPackaging = normalizeCleanRoomPackaging(packaging);
  const item = {
    _id: documentIdentity._id ?? stableFoundryId(identifier, "item"),
    name: name || identifier,
    ownership: clone(documentIdentity.ownership ?? { default: 0 }),
    type: "spell",
    system: {
      description: clone(description),
      source: clone(source),
      activation: { type: "", condition: "", value: null },
      duration: { value: null, units: "inst" },
      target: {
        affects: {
          count: "",
          type: "",
          choice: false,
          special: "",
        },
        template: blankTemplate("ft"),
      },
      range: {
        value: null,
        units: "any",
        special: "",
      },
      uses: {
        max: "",
        recovery: [],
        spent: 0,
      },
      level: 0,
      school: "",
      materials: {
        value: "",
        consumed: false,
        cost: 0,
        supply: 0,
      },
      properties: [],
      activities: {},
      identifier,
      method: runtimeProfile.itemDefaults?.method ?? "spell",
      prepared: runtimeProfile.itemDefaults?.prepared ?? 0,
      ability: runtimeProfile.itemDefaults?.ability ?? "",
      ...(cleanRoomPackaging.system ?? {}),
    },
    sort: documentIdentity.sort ?? 0,
    flags: clone(cleanRoomPackaging.flags ?? {}),
    img,
    effects: [],
  };
  if (documentIdentity.folder !== undefined) item.folder = documentIdentity.folder;
  if (documentIdentity._stats !== undefined) item._stats = clone(documentIdentity._stats);
  return item;
}

function normalizeActivityForAutomation(activity, policy = {}) {
  activity.target ??= {};
  activity.midiProperties ??= {};
  activity.midiProperties.forceConsumeDialog = policy.forceConsumeDialog ?? "never";
  activity.midiProperties.forceRollDialog = policy.forceRollDialog ?? "never";
  activity.midiProperties.forceDamageDialog = policy.forceDamageDialog ?? "never";
  activity.midiProperties.confirmTargets = policy.confirmTargets ?? "never";
  activity.midiProperties.chooseEffects = policy.chooseEffects ?? false;
  activity.midiProperties.removeChatButtons = policy.removeChatButtons ?? "all";
}

function configureActivation(activity, activation = {}) {
  const type = activation.type === "none" ? "" : String(activation.type ?? "");
  activity.activation = {
    ...(activity.activation ?? {}),
    type,
    value: activation.cost ?? null,
    override: true,
    // The semantic Action owns its activation. Donor activities sometimes
    // carry rider/trigger prose here (for example Hunter's Mark on-hit text);
    // retaining that text on a compiler-emitted cast is a misleading second
    // execution contract.
    condition: "",
  };
}

function isTriggerOnlyLifecycle(current, artifactsById = new Map()) {
  return lifecycleSeconds(current, artifactsById) === null
    && lifecycleSpecialDurations(current).length > 0;
}

function actionAppliesTriggerOnlyArtifact(action, artifactsById = new Map()) {
  return (action.operations ?? []).some(current => {
    if (!["create-artifact", "apply-artifact"].includes(current.type)) return false;
    const artifact = artifactsById.get(current.artifactId);
    return artifact && isTriggerOnlyLifecycle(artifact.lifecycle, artifactsById);
  });
}

function configureDuration(activity, action, artifactsById = new Map()) {
  const isFollowUpAction = (action.availability ?? []).some(current =>
    current.type === "artifact-exists"
  );
  const isInternalAction = action.delivery === "internal";
  const appliesTriggerOnlyArtifact = actionAppliesTriggerOnlyArtifact(
    action,
    artifactsById,
  );
  if (!isFollowUpAction && !isInternalAction && !appliesTriggerOnlyArtifact) return;
  activity.duration = {
    concentration: false,
    value: "",
    units: "inst",
    special: "",
    override: true,
  };
}

function stringOrEmpty(value) {
  if (value === undefined || value === null || value === "any") return "";
  return String(value);
}

function targetExcludesSource(target) {
  return (target?.predicates ?? []).some(current =>
    current?.type === "exclude-source"
  );
}

function configureTarget(activity, target, representation = {}) {
  const origin = target?.origin?.type ?? "none";
  const range = target?.range ?? {};
  const rangeUnits = range.units || (origin === "self" ? "self" : "ft");

  if (origin === "self") {
    activity.target = {
      ...(activity.target ?? {}),
      prompt: false,
      override: true,
      affects: {
        count: "",
        type: "self",
        choice: false,
        special: target?.origin?.includeAnchor === false ? "-self" : "",
      },
      template: blankTemplate("ft"),
    };
    activity.range = {
      ...(activity.range ?? {}),
      value: null,
      units: "self",
      special: "",
      override: true,
    };
    return;
  }

  if (origin === "placed-template") {
    const shape = target?.origin?.shape ?? {};
    const targetKind = String(target?.targetKind ?? "");
    activity.target = {
      ...(activity.target ?? {}),
      prompt: true,
      override: true,
      affects: {
        count: "",
        type:
          targetKind === "creature"
            ? ""
            : DND5E_CREATURE_TYPES.has(targetKind)
              ? "creature"
              : targetKind,
        choice: false,
        special: targetExcludesSource(target) ? "-self" : "",
      },
      template: {
        ...blankTemplate(shape.units || "ft"),
        type: String(shape.type ?? ""),
        size: stringOrEmpty(shape.size),
        width: stringOrEmpty(shape.width),
        height: stringOrEmpty(shape.height),
      },
    };
    activity.range = {
      ...(activity.range ?? {}),
      value: range.value ?? null,
      units: rangeUnits,
      special: "",
      override: true,
    };
    return;
  }

  if (origin === "placed-point") {
    const template = representation.template ?? {
      type: "radius",
      size: 1,
      units: rangeUnits,
    };
    activity.target = {
      ...(activity.target ?? {}),
      prompt: true,
      override: true,
      affects: {
        count: stringOrEmpty(representation.affects?.count ?? 1),
        type: String(representation.affects?.type ?? "space"),
        choice: false,
        special: "",
      },
      template: {
        ...blankTemplate(template.units || rangeUnits),
        type: String(template.type ?? "radius"),
        size: stringOrEmpty(template.size ?? 1),
        width: stringOrEmpty(template.width),
        height: stringOrEmpty(template.height),
      },
    };
    activity.range = {
      ...(activity.range ?? {}),
      value: range.value ?? null,
      units: rangeUnits,
      special: "",
      override: true,
    };
    return;
  }

  if (origin === "event-neighborhood") {
    activity.target = {
      ...(activity.target ?? {}),
      // Event neighborhoods are runtime-computed token snapshots around an
      // event anchor. Keep the hidden activity caster-owned and template-free;
      // the runtime passes the resolved token set explicitly.
      prompt: false,
      override: true,
      affects: {
        count: "",
        type: String(target?.targetKind ?? "creature"),
        choice: false,
        special: "",
      },
      template: blankTemplate(target?.origin?.units ?? "ft"),
    };
    activity.range = {
      ...(activity.range ?? {}),
      value: null,
      units: "any",
      special: "",
      override: true,
    };
    return;
  }

  activity.target = {
    ...(activity.target ?? {}),
    prompt: false,
    override: true,
    affects: {
      count: stringOrEmpty(target?.cardinality?.max),
      type: String(target?.targetKind ?? "creature"),
      choice: false,
      special: targetExcludesSource(target) ? "-self" : "",
    },
    template: blankTemplate(rangeUnits),
  };
  activity.range = {
    ...(activity.range ?? {}),
    value: range.value ?? null,
    units: rangeUnits,
    special: "",
    override: true,
  };
}

function normalizeFormula(value) {
  return String(value ?? "").replace(/\s+/g, "");
}

function dnd5eScaling(scaling = {}) {
  const formula = scaling.formula ?? "";
  return {
    // The semantic graph distinguishes slot-level and standard 2014 cantrip
    // character-level progression. dnd5e activities call both provider
    // representations "whole"; the Item's spell level selects the behavior.
    mode: ["slot-level", "character-level"].includes(scaling.mode)
      ? "whole"
      : scaling.mode ?? "",
    // In the semantic DSL an omitted dice increment means "no extra dice".
    // dnd5e defaults this field to one, which would silently turn a fixed
    // per-slot bonus (for example False Life +5) into dice + fixed bonus.
    number: scaling.number ?? (formula ? 0 : 1),
    formula,
  };
}

function dicePartFromFormula(formula, scaling = {}) {
  const normalized = normalizeFormula(formula);
  const match = normalized.match(/^(\d+)d(\d+)(.*)$/i);
  if (!match) {
    return {
      number: null,
      denomination: 0,
      bonus: "",
      custom: { enabled: true, formula: normalized },
      scaling: dnd5eScaling(scaling),
    };
  }
  const suffix = String(match[3] ?? "").replace(/^\+/, "");
  return {
    number: Number(match[1]),
    denomination: Number(match[2]),
    bonus: suffix,
    custom: { enabled: false, formula: "" },
    scaling: dnd5eScaling(scaling),
  };
}

function configureOperations(activity, operations) {
  const consumeSpellSlot = operations.some(current =>
    current.type === "consume-resource" && current.resource === "spell-slot"
  );
  activity.consumption = {
    ...(activity.consumption ?? {}),
    targets: [],
    scaling: {
      allowed: activity.consumption?.scaling?.allowed ?? false,
      max: activity.consumption?.scaling?.max ?? "",
    },
    spellSlot: consumeSpellSlot,
  };

  const save = operations.find(current => current.type === "saving-throw");
  const attack = operations.find(current => current.type === "attack-roll");
  const damage = operations.filter(current => current.type === "damage");
  const healing = operations.find(current =>
    current.type === "healing" || current.type === "grant-temporary-hp"
  );

  if (save) {
    activity.save = {
      ...(activity.save ?? {}),
      ability: [...(save.ability ?? [])],
      dc: {
        calculation: activity.save?.dc?.calculation ?? "spellcasting",
        formula: activity.save?.dc?.formula ?? "",
      },
    };
  } else {
    delete activity.save;
  }

  if (attack) {
    const spellcastingAttack = attack.attackSource === "spellcasting";
    activity.attack = {
      ...(activity.attack ?? {}),
      ...(spellcastingAttack ? { ability: "spellcasting" } : {}),
      type: {
        ...(activity.attack?.type ?? {}),
        value: attack.attackType ?? "spell",
        ...(spellcastingAttack ? { classification: "spell" } : {}),
      },
    };
  } else {
    delete activity.attack;
  }

  if (damage.length > 0 || save) {
    activity.damage = {
      ...(activity.damage ?? {}),
      onSave: save?.onSave ?? damage[0]?.onSave ?? activity.damage?.onSave ?? "none",
      parts: damage.map(current => {
        const part = dicePartFromFormula(current.formula, current.scaling);
        return {
          ...part,
          types: [
            ...(current.damageTypes ?? (current.damageType ? [current.damageType] : [])),
          ],
        };
      }),
      critical: {
        allow: attack
          ? activity.damage?.critical?.allow !== false
          : damage.some(current => current.critical === "midi-qol")
            || Boolean(activity.damage?.critical?.allow),
        bonus: activity.damage?.critical?.bonus ?? "",
      },
    };
  } else {
    delete activity.damage;
  }

  if (healing) {
    activity.healing = {
      ...dicePartFromFormula(healing.formula, healing.scaling),
      types: [
        ...(healing.type === "grant-temporary-hp"
          ? ["temphp"]
          : healing.healingTypes ?? ["healing"]),
      ],
    };
  } else {
    delete activity.healing;
  }

  // A donor activity is only a structural starting point. Generic rolls must
  // not survive as a hidden second execution path. In particular,
  // emit-event.pool is input to its declared runtime provider; it is not a
  // second native dnd5e roll (Sleep's runtime owns and resolves that pool).
  delete activity.roll;
}

function clearForeignActivitySchema(activity) {
  // Source activities are donors, not owners of the emitted schema. When the
  // compiler changes an activity type, type-exclusive donor fields must not
  // survive and activate a second dnd5e execution path.
  if (activity.type !== "enchant") {
    delete activity.enchant;
    delete activity.restrictions;
  }
  if (activity.type !== "summon") {
    delete activity.bonuses;
    delete activity.creatureSizes;
    delete activity.creatureTypes;
    delete activity.match;
    delete activity.profiles;
    delete activity.summon;
    delete activity.tempHP;
  }
}

function nativeSummonBinding(entity, slot) {
  const matches = (entity?.state?.deltaBindings ?? []).filter(binding =>
    binding.slot === slot
  );
  if (matches.length > 1) {
    throw new Error(`${entity?.semanticId ?? "summon entity"} has duplicate native summon binding ${slot}`);
  }
  return matches[0] ?? null;
}

function nativeSummonFormula(binding, { baseLevel }) {
  const formula = typeof binding?.formula === "string"
    ? binding.formula.trim()
    : "";
  if (!formula) {
    throw new Error("native summon bonus must have a lowered Roll formula");
  }
  const scaling = binding.scaling ?? null;
  if (!scaling) return formula;
  if (
    scaling.mode !== "slot-level"
    || !Number.isInteger(Number(scaling.number))
    || Number(scaling.number) < 0
    || typeof scaling.formula !== "string"
  ) {
    throw new Error("native summon bonus has unsupported Roll scaling");
  }
  const levels = `max(0,(@item.level)-(${baseLevel}))`;
  const dice = /^(\d+)d(\d+)$/u.exec(formula);
  const diceIncrement = Number(scaling.number);
  if (diceIncrement > 0) {
    if (!dice) {
      throw new Error("native summon dice scaling requires a simple base dice formula");
    }
    return `(${dice[1]}+(${levels})*(${diceIncrement}))d${dice[2]}`;
  }
  const increment = scaling.formula.trim();
  if (!increment) {
    throw new Error("native summon formula scaling requires a non-empty increment");
  }
  return `(${formula})+(${levels})*(${increment})`;
}

function configureSummonActivity(activity, item, action, compilation) {
  if (activity.type !== "summon") return;
  const entities = (action.artifacts ?? []).filter(current =>
    current.kind === "entity"
  );
  if (entities.length !== 1) {
    throw new Error(
      `${item.system.identifier} summon action ${action.semanticId} must project exactly one entity`,
    );
  }
  const entity = entities[0];
  const selectionId = entity.state?.selection?.id ?? null;
  const selectedChoice = selectionId
    ? action.bindings?.[selectionId]
    : null;
  const profiles = (entity.state?.profiles ?? []).filter(profile =>
    selectedChoice === null || profile.choice === selectedChoice
  );
  if (profiles.length !== 1) {
    throw new Error(
      `${item.system.identifier} summon action ${action.semanticId} must resolve exactly one profile`,
    );
  }
  const profile = profiles[0];
  const cardinality = entity.state?.cardinality;
  const canonicalCardinality = (
    cardinality?.type === "single"
    && cardinality?.count === 1
  ) || (
    cardinality?.type === "fixed-small"
    && cardinality?.count === 2
  ) || (
    cardinality?.type === "fixed-three"
    && cardinality?.count === 3
  ) || (
    cardinality?.type === "fixed-group"
    && cardinality?.count === 5
  );
  if (!canonicalCardinality) {
    throw new Error(
      `${item.system.identifier} summon action ${action.semanticId} must resolve canonical cardinality`,
    );
  }
  if (
    stableStringify(profile.cardinality) !== stableStringify(cardinality)
  ) {
    throw new Error(
      `${item.system.identifier} summon action ${action.semanticId} cardinality drifted from its profile choice`,
    );
  }
  const hpBinding = nativeSummonBinding(entity, "hit-points");
  const attackBinding = nativeSummonBinding(entity, "spell-attack-bonus");
  const saveBinding = nativeSummonBinding(entity, "spell-save-dc");
  const damageBinding = nativeSummonBinding(entity, "activity-damage");
  if (attackBinding && saveBinding) {
    throw new Error(
      `${item.system.identifier} summon action ${action.semanticId} cannot match attacks and saves together`,
    );
  }
  if (attackBinding && (
    attackBinding.formula !== "@spellAttackBonus"
    || attackBinding.scaling !== undefined
  )) {
    throw new Error(
      `${item.system.identifier} summon action ${action.semanticId} must match the source spell attack bonus exactly`,
    );
  }
  if (saveBinding && (
    saveBinding.formula !== "@spellSaveDc"
    || saveBinding.scaling !== undefined
  )) {
    throw new Error(
      `${item.system.identifier} summon action ${action.semanticId} must match the source spell save DC exactly`,
    );
  }
  const baseLevel = Number(item.system.level);
  activity.bonuses = {
    ac: "",
    hd: "",
    hp: hpBinding ? nativeSummonFormula(hpBinding, { baseLevel }) : "",
    attackDamage: attackBinding && damageBinding
      ? nativeSummonFormula(damageBinding, { baseLevel })
      : "",
    saveDamage: saveBinding && damageBinding
      ? nativeSummonFormula(damageBinding, { baseLevel })
      : "",
    healing: "",
  };
  activity.creatureSizes = [];
  activity.creatureTypes = [];
  activity.match = {
    ability: "",
    attacks: Boolean(attackBinding),
    disposition: true,
    proficiency: false,
    saves: Boolean(saveBinding),
  };
  activity.profiles = [{
    _id: stableFoundryId(
      item.system.identifier,
      action.semanticId,
      "summon-profile",
      profile.choice,
    ),
    count: String(cardinality.count),
    cr: "",
    level: { min: null, max: null },
    name: profile.label,
    types: [],
    uuid: summonProfileUuid(profile, compilation.resourceBindings, MODULE_ID),
  }];
  // dnd5e owns the entire summon creation path, including one human placement
  // for each profile count and the final Token batch. Arcane only observes the
  // returned Tokens and adds thin ownership/combat/lifecycle sidecars.
  activity.summon = { mode: "", prompt: true };
  activity.tempHP = "";
  activity.flags ??= {};
  activity.flags[MODULE_ID] ??= {};
  delete activity.flags[MODULE_ID].summon;
  const control = entity.state.control
    ? {
        version: 1,
        contractId: stableFoundryId(
          item.system.identifier,
          entity.sourceSemanticId ?? entity.semanticId,
          "native-summon-control-v1",
        ),
        durationSeconds: Number(entity.state.control.duration?.value) * 60 * 60,
        expiry: entity.state.control.expiry,
      }
    : null;
  activity.flags[MODULE_ID].nativeSummon = {
    provider: "dnd5e",
    humanStep: "native-summon-placement",
    artifactId: entity.sourceSemanticId ?? entity.semanticId,
    choice: profile.choice,
    profileId: profile.profileId,
    revision: profile.revision,
    documentId: profile.documentId,
    expectedCount: cardinality.count,
    cleanup: control ? "retain-entity" : entity.state.cleanup.expiry,
    uniqueness: clone(entity.state.uniqueness ?? null),
    ...(control ? { control } : {}),
  };
}

function configureEnchantmentActivity(activity, action) {
  if (activity.type !== "enchant") return;
  activity.enchant = { self: false };
  activity.restrictions = {
    allowMagical: action?.adapter?.allowMagical === true,
    type: "weapon",
    categories: [],
    properties: [],
  };
  activity.range = {
    ...(activity.range ?? {}),
    value: null,
    units: "self",
    special: "",
    override: true,
  };
  activity.target = {
    ...(activity.target ?? {}),
    prompt: false,
    override: true,
    affects: {
      count: "",
      type: "",
      choice: false,
      special: "",
    },
    template: blankTemplate("ft"),
  };
}

function configureWeaponEnchantmentRiderActivity(activity, action) {
  if (action?.adapter?.enchantmentRider !== true) return;
  activity.attack ??= {};
  activity.attack.ability = "spellcasting";
  activity.attack.type = {
    ...(activity.attack.type ?? {}),
    value: "melee",
    classification: "weapon",
  };
  activity.attackMode = "oneHanded";
  activity.damage ??= {};
  activity.damage.includeBase = true;
  activity.damage.parts = [];
  activity.range ??= {};
  activity.range.override = false;
  activity.target ??= {};
  activity.target.override = false;
  activity.target.prompt = false;
}

function lifecycleSeconds(current, artifactsById = new Map(), seen = new Set()) {
  if (!current || typeof current !== "object") return null;
  if (current.type === "first-of") {
    for (const child of current.values ?? []) {
      const seconds = lifecycleSeconds(child, artifactsById, seen);
      if (seconds !== null) return seconds;
    }
    return null;
  }
  if (current.type === "while-artifact" && current.artifactId) {
    if (seen.has(current.artifactId)) return null;
    const dependency = artifactsById.get(current.artifactId);
    if (!dependency) return null;
    const nextSeen = new Set(seen);
    nextSeen.add(current.artifactId);
    return lifecycleSeconds(dependency.lifecycle, artifactsById, nextSeen);
  }
  if (current.type !== "duration") return null;
  const value = Number(current.value);
  if (!Number.isFinite(value)) return null;
  const multipliers = {
    second: 1,
    seconds: 1,
    turn: 6,
    turns: 6,
    round: 6,
    rounds: 6,
    minute: 60,
    minutes: 60,
    hour: 3600,
    hours: 3600,
    day: 86400,
    days: 86400,
  };
  return value * (multipliers[current.units] ?? 1);
}

function lifecycleSpecialDurations(current, output = []) {
  if (!current || typeof current !== "object") return output;
  if (current.type === "first-of") {
    for (const child of current.values ?? []) lifecycleSpecialDurations(child, output);
    return output;
  }
  if (current.type !== "until-trigger") return output;
  const currentTrigger = current.trigger ?? {};
  const mappings = {
    "attack-roll-made:effect-target": ["1Attack"],
    "spell-cast:effect-target": ["1Spell"],
    "attack-targeted:effect-target": ["isAttacked"],
    "damage-taken:effect-target": ["isDamaged"],
    "turn-end:source": ["turnEndSource"],
    "turn-start:source": ["turnStartSource"],
    "turn-end:effect-target": ["turnEnd"],
    "turn-start:effect-target": ["turnStart"],
    "hit-points-depleted:effect-target": ["zeroHP"],
  };
  const mapped = currentTrigger.type === "provider-special-duration"
    ? [currentTrigger.value]
    : currentTrigger.occurrence === "next-after-created"
      ? []
    : mappings[`${currentTrigger.type}:${currentTrigger.subject ?? ""}`] ?? [];
  for (const specialDuration of mapped) {
    if (specialDuration && !output.includes(specialDuration)) {
      output.push(specialDuration);
    }
  }
  return output;
}

function lifecycleRuntimeContract(current) {
  if (!current || typeof current !== "object") return null;
  if (current.type === "first-of") {
    for (const child of current.values ?? []) {
      const contract = lifecycleRuntimeContract(child);
      if (contract) return contract;
    }
    return null;
  }
  if (
    current.type === "until-trigger"
    && current.trigger?.type === "turn-end"
    && current.trigger?.subject === "current-turn"
  ) {
    return {
      version: 1,
      event: "turn-end",
      boundary: "current-combat-turn",
    };
  }
  if (
    current.type === "until-trigger"
    && current.trigger?.type === "turn-end"
    && current.trigger?.subject === "source"
    && current.trigger?.occurrence === "next-after-created"
  ) {
    return {
      version: 1,
      event: "turn-end",
      boundary: "next-source-turn-end",
    };
  }
  if (
    current.type === "until-trigger"
    && current.trigger?.type === "turn-end"
    && current.trigger?.subject === "effect-target"
    && current.trigger?.occurrence === "next-after-created"
  ) {
    return {
      version: 1,
      event: "turn-end",
      boundary: "next-effect-target-turn-end",
    };
  }
  if (current.trigger?.occurrence === "next-after-created") {
    throw new Error(
      `Unsupported next-after-created lifecycle ${current.trigger?.type ?? "<missing>"}`
      + `:${current.trigger?.subject ?? "<missing>"}`,
    );
  }
  return null;
}

function providerChange(change) {
  const mode = change?.mode ?? 2;
  const priority = change?.priority ?? 20;
  const result = (key, value = change?.value, defaultMode = mode) => ({
    key,
    mode: defaultMode,
    value: typeof value === "boolean" ? String(value) : String(value ?? ""),
    priority,
  });
  if (change?.type === "provider-change") {
    return {
      key: change.key,
      mode,
      value: change.value,
      priority,
    };
  }
  // movement.all is a DAE CUSTOM pseudo-field, not a real numeric Actor
  // field. ADD would merely leave an inert `movement.all` property behind.
  if (change?.type === "movement-all") {
    return result("system.attributes.movement.all", change.value, 0);
  }
  if (change?.type === "movement-all-increase") {
    return result("system.attributes.movement.all", `+${change.value}`, 0);
  }
  if (change?.type === "movement-increase") {
    return result(
      `system.attributes.movement.${change.movement}`,
      change.value,
      2,
    );
  }
  if (change?.type === "movement-all-decrease") {
    return result("system.attributes.movement.all", `-${change.value}`, 0);
  }
  if (change?.type === "grant-hover") {
    return result("system.attributes.movement.hover", true, 0);
  }
  // DAE applies attributes.ac.value after dnd5e has prepared every AC mode.
  // attributes.ac.bonus is ignored by actors using flat AC (notably many NPCs),
  // so an additive spell bonus must target the prepared value to affect every
  // creature the spell is allowed to target.
  if (change?.type === "ac-bonus") return result("system.attributes.ac.value");
  if (change?.type === "save-bonus") return result("system.bonuses.abilities.save");
  if (change?.type === "ability-save-bonus") {
    return result(`system.abilities.${change.ability}.bonuses.save`);
  }
  if (change?.type === "attack-bonus") {
    return result(`system.bonuses.${change.attack}.attack`);
  }
  if (change?.type === "damage-bonus") {
    return result(`system.bonuses.${change.attack}.damage`);
  }
  if (change?.type === "damage-resistance") return result("system.traits.dr.value");
  if (change?.type === "damage-immunity") return result("system.traits.di.value");
  if (change?.type === "healing-immunity") {
    return result("system.traits.di.value", "healing", 2);
  }
  if (change?.type === "grant-nonmagical-damage-resistance") {
    return result("system.traits.dr.custom", "nonMagical", 0);
  }
  if (change?.type === "condition-immunity") return result("system.traits.ci.value");
  if (change?.type === "grant-ability-saving-throw-advantage") {
    return result(
      `flags.midi-qol.advantage.save.${change.ability}`,
      true,
      change.mode ?? 5,
    );
  }
  if (change?.type === "grant-ability-check-advantage") {
    return result(
      `flags.midi-qol.advantage.check.${change.ability}`,
      true,
      change.mode ?? 5,
    );
  }
  if (change?.type === "grant-ability-check-disadvantage") {
    return result(
      `flags.midi-qol.disadvantage.check.${change.ability}`,
      true,
      change.mode ?? 5,
    );
  }
  if (change?.type === "grant-ability-saving-throw-disadvantage") {
    return result(
      `flags.midi-qol.disadvantage.save.${change.ability}`,
      true,
      change.mode ?? 5,
    );
  }
  if (change?.type === "grant-death-saving-throw-advantage") {
    return result("system.attributes.death.roll.mode", 1, change.mode ?? 2);
  }
  if (change?.type === "maximize-healing-received") {
    return result(
      "flags.midi-qol.grants.max.damage.heal",
      change.value,
      change.mode ?? 5,
    );
  }
  if (change?.type === "grant-attack-advantage") {
    return result("flags.midi-qol.grants.advantage.attack.all", change.value, change.mode ?? 5);
  }
  if (change?.type === "gain-attack-advantage") {
    return result("flags.midi-qol.advantage.attack.all", change.value, change.mode ?? 5);
  }
  if (change?.type === "gain-attack-disadvantage") {
    return result(
      "flags.midi-qol.disadvantage.attack.all",
      change.value,
      change.mode ?? 5,
    );
  }
  if (change?.type === "ability-check-bonus") {
    return result("system.bonuses.abilities.check");
  }
  if (change?.type === "block-vocal-spell") {
    return result("flags.midi-qol.fail.spell.vocal", change.value, change.mode ?? 5);
  }
  if (change?.type === "block-reactions") {
    return result("flags.midi-qol.actions.reactionsMax", 0, change.mode ?? 5);
  }
  if (change?.type === "activity-over-time") {
    return result("flags.midi-qol.ActivityOverTime", change.value, change.mode ?? 5);
  }
  throw new Error(`Unsupported semantic effect change ${change?.type ?? "<missing>"}`);
}

function semanticStateChanges(state = {}) {
  const changes = [...(state.changes ?? [])];
  if (state.acBonus !== undefined) {
    changes.push({ type: "ac-bonus", value: state.acBonus, mode: 2, priority: 20 });
  }
  if (state.saveBonus !== undefined) {
    changes.push({ type: "save-bonus", value: state.saveBonus, mode: 2, priority: 20 });
  }
  for (const damageType of state.damageResistance ?? []) {
    changes.push({ type: "damage-resistance", value: damageType, mode: 2, priority: 20 });
  }
  if (state.blocksVocalSpell === true) {
    changes.push({ type: "block-vocal-spell", value: true, mode: 5, priority: 20 });
  }
  if ((state.blockedActionKinds ?? []).includes("reaction")) {
    changes.push({ type: "block-reactions", value: 0, mode: 5, priority: 20 });
  }
  if (state.grantsAttackAdvantage === true) {
    changes.push({ type: "grant-attack-advantage", value: true, mode: 5, priority: 20 });
  }
  if (state.activityOverTime) {
    changes.push({
      type: "activity-over-time",
      value: state.activityOverTime,
      mode: 5,
      priority: 20,
    });
  }
  return changes;
}

function optionalRollBonusProviderChanges(state = {}, semanticId = "") {
  const key = String(semanticId)
    .replace(/[^A-Za-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const output = [];
  for (const bonus of state.optionalRollBonuses ?? []) {
    if (!["all-ability-checks", "all-saving-throws"].includes(
      bonus.selector,
    )) {
      throw new Error(
        `Unsupported optional roll bonus selector ${bonus.selector ?? "<missing>"}`,
      );
    }
    if (!key) throw new Error("Optional roll bonus requires an artifact semantic id");
    const prefix = `flags.midi-qol.optional.${key}`;
    const rollKeys = bonus.selector === "all-saving-throws"
      ? ["save.all"]
      : ["check.all", "skill.all"];
    output.push(
      ...rollKeys.map(keySuffix => ({
        key: `${prefix}.${keySuffix}`,
        mode: 5,
        value: String(bonus.formula ?? ""),
        priority: 20,
      })),
      {
        key: `${prefix}.label`,
        mode: 5,
        value: String(bonus.label ?? ""),
        priority: 20,
      },
      {
        key: `${prefix}.count`,
        mode: 5,
        value: String(bonus.uses ?? 1),
        priority: 20,
      },
    );
  }
  return output;
}

function effectProviderChanges(artifact, state = {}) {
  return [
    ...semanticStateChanges(state).map(providerChange),
    ...optionalRollBonusProviderChanges(state, artifact.semanticId),
  ];
}

function daeFlags(existing = {}) {
  return {
    enableCondition: "",
    disableCondition: "",
    disableIncapacitated: false,
    selfTarget: false,
    selfTargetAlways: false,
    dontApply: false,
    stackable: "noneName",
    showIcon: true,
    durationExpression: "",
    macroRepeat: "none",
    specialDuration: [],
    ...existing,
  };
}

function auraSystem(state = {}, existing = {}) {
  const result = {
    applyToSelf: true,
    bestFormula: "",
    canStack: false,
    collisionTypes: ["move"],
    color: "#7dd3fc",
    combatOnly: false,
    disableOnHidden: true,
    distanceFormula: "0",
    disposition: 0,
    evaluatePreApply: false,
    opacity: 0.2,
    overrideName: "",
    script: "token === sourceToken",
    stashedChanges: [],
    stashedStatuses: [],
    showRadius: true,
    ...existing,
  };
  result.color = state.color ?? result.color;
  result.distanceFormula = String(state.radius ?? state.distance ?? result.distanceFormula);
  result.opacity = state.opacity ?? result.opacity;
  if (state.membership === "dynamic") {
    result.applyToSelf = state.includeSelf;
    result.disposition = {
      "same-disposition": 1,
      "opposing-disposition": -1,
      all: 0,
    }[state.recipientPolicy];
    // Disposition is the typed membership policy. The script remains a
    // predicate hook but must not accidentally turn a following aura back into
    // a source-only range indicator.
    result.script = "true";
  } else {
    result.disposition = state.disposition ?? result.disposition;
    result.script = state.script ?? result.script;
  }
  return result;
}

function applyActiveAurasZone(effect, zone) {
  const adapter = zone.adapter ?? {};
  const shape = zone.state?.shape ?? {};
  effect.flags ??= {};
  effect.flags[MODULE_ID] = {
    ...(effect.flags[MODULE_ID] ?? {}),
    ...(adapter.flags ?? {}),
    persistentTemplate: true,
  };
  effect.flags.ActiveAuras = {
    isAura: true,
    aura: "All",
    nameOverride: effect.name,
    radius: "",
    customCheck: "",
    ignoreSelf: false,
    height: Boolean(shape.height),
    hidden: false,
    displayTemp: true,
    hostile: false,
    onlyOnce: false,
    wallsBlock: "system",
    statuses: [],
    ...(adapter.activeAuras ?? {}),
  };
  return effect;
}

function configureActiveAurasTemplateItem(item) {
  item.flags ??= {};
  item.flags["midi-qol"] ??= {};
  item.flags["midi-qol"].onUseMacroName = "[preActiveEffects]ItemMacro";
  item.flags.dae ??= {};
  item.flags.dae.macro = {
    ...(item.flags.dae.macro ?? {}),
    name: item.name,
    img: item.img,
    type: "script",
    scope: "global",
    command: ACTIVE_AURAS_TEMPLATE_MACRO,
  };
}

function createEffect(item, artifact, presentationArtifacts, sourceEffect, {
  artifactsById = new Map(),
  additionalArtifactIds = [],
  cleanRoom = false,
  documentUuid,
} = {}) {
  const presentation = presentationArtifacts.find(current =>
    current.provider === "aura-effects"
  );
  const effect = clone(
    sourceEffect
    ?? (cleanRoom ? blankActiveEffect(presentation ? "auraeffects.aura" : "base") : {}),
  );
  const artifactIds = [
    artifact.semanticId,
    ...additionalArtifactIds,
    ...presentationArtifacts.map(current => current.semanticId),
  ];
  const seconds = lifecycleSeconds(artifact.lifecycle, artifactsById);
  // A one-shot overtime activity must remove its own source effect after the
  // activity resolves. Letting DAE consume the same turn boundary first can
  // delete the ActivityOverTime carrier before Midi runs it.
  const specialDuration = artifact.adapter?.deferLifecycleCleanupToActivity
    ? []
    : lifecycleSpecialDurations(artifact.lifecycle);
  const runtimeLifecycle = lifecycleRuntimeContract(artifact.lifecycle);
  const state = artifact.state ?? {};
  const generatedChanges = effectProviderChanges(artifact, {
    ...state,
    activityOverTime:
      artifact.adapter?.activityOverTime
      ?? state.activityOverTime,
  });
  const bindingSuffix = artifact.sourceSemanticId
    && artifact.sourceSemanticId !== artifact.semanticId
    ? artifact.semanticId.slice(artifact.sourceSemanticId.length + 1)
    : "";

  const isBoundArtifact = artifact.sourceSemanticId
    && artifact.sourceSemanticId !== artifact.semanticId;
  if (isBoundArtifact) {
    // A lifted donor effect may already have an _id. Parameter expansion creates
    // multiple concrete effects from that donor, so each bound artifact must
    // receive its own deterministic Foundry id.
    effect._id = stableFoundryId(item.system.identifier, "artifact", artifact.semanticId);
  } else if (cleanRoom) {
    effect._id = stableFoundryId(item.system.identifier, "artifact", artifact.semanticId);
  } else {
    if (!effect._id) {
      effect._id = stableFoundryId(item.system.identifier, "artifact", artifact.semanticId);
    }
  }
  effect.name = cleanRoom
    ? (
        artifact.adapter?.name
        || state.name
        || effect.name
        || (bindingSuffix
          ? `${item.system.identifier}:${artifact.semanticId}:${bindingSuffix}`
          : `${item.system.identifier}:${artifact.semanticId}`)
      )
    : (
        artifact.adapter?.name
        ?? state.name
        ?? effect.name
        ?? (bindingSuffix ? `${item.name}: ${bindingSuffix}` : item.name)
      );
  effect.type = presentation ? "auraeffects.aura" : (effect.type ?? "base");
  effect.img = cleanRoom
    ? (
        artifact.adapter?.img
        || state.img
        || effect.img
        || item.img
        || "icons/svg/aura.svg"
      )
    : (
        artifact.adapter?.img
        ?? state.img
        ?? effect.img
        ?? item.img
        ?? "icons/svg/aura.svg"
      );
  effect.origin = documentUuid ?? `Compendium.${MODULE_ID}.spells.Item.${item._id}`;
  effect.transfer = state.transfer ?? effect.transfer ?? false;
  effect.disabled = state.disabled ?? effect.disabled ?? false;
  effect.statuses = [...(state.statuses ?? effect.statuses ?? [])];
  effect.duration = {
    ...(effect.duration ?? {}),
    seconds: seconds ?? effect.duration?.seconds ?? null,
    rounds: seconds === null ? effect.duration?.rounds ?? null : Math.ceil(seconds / 6),
    turns: effect.duration?.turns ?? null,
  };
  effect.changes = generatedChanges;
  effect.flags ??= {};
  effect.flags[MODULE_ID] = {
    ...(effect.flags[MODULE_ID] ?? {}),
    ...(artifact.adapter?.flags ?? {}),
    ...(state.savingThrowAdvantage
      ? { savingThrowAdvantage: clone(state.savingThrowAdvantage) }
      : {}),
    ...(state.blockedActionKinds
      ? { blockedActionKinds: [...state.blockedActionKinds] }
      : {}),
    ...(state.runtimeModifiers?.length
      ? { runtimeModifiers: clone(state.runtimeModifiers) }
      : {}),
    ...(artifact.adapter?.adapter
      ? { runtimeArtifactAdapter: artifact.adapter.adapter }
      : {}),
    ...(state.sourceTermination?.type === "last-dependent-ended"
      ? {
        sourceTermination: {
          version: 1,
          policy: "last-dependent-ended",
          artifactId: artifact.semanticId,
        },
      }
      : {}),
    ...(state.markerOnly === true ? { markerOnly: true } : {}),
    ...(runtimeLifecycle ? { runtimeLifecycle } : {}),
    identifier: item.system.identifier,
    sourceSpellId: item._id,
    compilerVersion: SPELL_AUTOMATION_COMPILER_VERSION,
    compilerArtifactIds: artifactIds,
    ...(artifact.host ? { host: artifact.host } : {}),
    ...(cleanRoom && artifact.identity ? { identity: clone(artifact.identity) } : {}),
    ...(artifact.reapply ? { reapply: artifact.reapply } : {}),
    ...(presentation ? { sourceAura: true } : {}),
  };
  effect.flags.dae = daeFlags({
    ...(effect.flags.dae ?? {}),
    ...(artifact.reapply
      ? {
        stackable: {
            "replace": "noneName",
            "stack": "multi",
          }[artifact.reapply],
        }
      : {}),
    specialDuration,
  });
  effect.flags.dnd5e = {
    ...(effect.flags.dnd5e ?? {}),
    // Compiler-owned conditions live in `effect.statuses`; donor riders would
    // create a second condition/effect path.
    riders: { statuses: [] },
  };
  effect.system = presentation
    ? auraSystem(presentation.state, effect.system)
    : (effect.system ?? {});
  if (presentation) {
    effect.flags.auraeffects = {
      originalType: "base",
      ...(effect.flags.auraeffects ?? {}),
    };
  }
  return effect;
}

function enchantmentTierValue(expression, castLevel) {
  if (!expression) return null;
  if (expression.type !== "tiers") return expression;
  const entries = [...(expression.entries ?? [])]
    .sort((left, right) => Number(left.minimum) - Number(right.minimum));
  return entries.filter(current => Number(current.minimum) <= castLevel).at(-1)?.value
    ?? entries[0]?.value
    ?? null;
}

function enchantmentProfileSelections(domains) {
  let values = [{}];
  for (const domain of domains ?? []) {
    values = values.flatMap(current => (domain.values ?? []).map(value => ({
      ...current,
      [domain.id]: value,
    })));
  }
  return values;
}

function enchantmentDamageType(value, selections) {
  if (value?.type === "action-parameter") return selections?.[value.id];
  return value;
}

function createWeaponEnchantmentProfiles(item, artifact, compilation) {
  const runtimeRule = (compilation.projection.runtimeRules ?? []).find(current =>
    current.adapter?.adapter === "weapon-enchantment-v1"
    && current.adapter?.artifactId === artifact.semanticId
  );
  if (!runtimeRule) {
    throw new Error(
      `${item.system.identifier} ${artifact.semanticId} has no weapon-enchantment-v1 receipt`,
    );
  }
  const adapter = runtimeRule.adapter;
  const expressions = [
    artifact.state?.attackAndDamageBonus,
    artifact.state?.attackBonus,
    artifact.state?.hitDamageRider?.value,
  ].filter(Boolean);
  const tierMinimums = [...new Set(expressions.flatMap(expression =>
    expression?.type === "tiers"
      ? (expression.entries ?? []).map(current => Number(current.minimum))
      : []
  ))].filter(Number.isFinite).sort((left, right) => left - right);
  const castLevels = tierMinimums.length > 0 ? tierMinimums : [0];
  const selections = enchantmentProfileSelections(adapter.profileSelections);
  const riderActivityId = adapter.riderActivityIdentifier
    ? stableFoundryId(
        item.system.identifier,
        "action",
        `runtime:${adapter.riderActivityIdentifier}`,
      )
    : null;
  return castLevels.flatMap((castLevel, index) => {
    const minimum = index === 0 ? null : castLevel;
    const nextMinimum = Number(castLevels[index + 1]);
    const maximum = Number.isFinite(nextMinimum) ? nextMinimum - 1 : null;
    return selections.map(selection => {
      const attackAndDamage = enchantmentTierValue(
        artifact.state?.attackAndDamageBonus,
        castLevel,
      );
      const attackBonus = enchantmentTierValue(
        artifact.state?.attackBonus,
        castLevel,
      );
      const hitDamage = enchantmentTierValue(
        artifact.state?.hitDamageRider?.value,
        castLevel,
      );
      const damageType = enchantmentDamageType(
        artifact.state?.hitDamageRider?.damageType,
        selection,
      );
      const suffix = [
        Number(attackAndDamage?.value) > 0
          ? `+${Number(attackAndDamage.value)}`
          : null,
        Number(attackBonus?.value) > 0
          ? `+${Number(attackBonus.value)} attack`
          : null,
        damageType || null,
      ].filter(Boolean).join(", ");
    const effect = blankActiveEffect("enchantment");
    effect._id = stableFoundryId(
      item.system.identifier,
      "enchantment",
      artifact.semanticId,
      tierMinimums.length > 0 ? castLevel : "fixed",
      ...Object.entries(selection).flat(),
    );
    effect.name = [artifact.state?.name ?? item.name, suffix]
      .filter(Boolean)
      .join(", ");
    effect.img = artifact.state?.img ?? item.img;
    effect.origin = null;
    effect.description = `<p>${effect.name}</p>`;
    effect.changes = [
      {
        key: "name",
        mode: 5,
        value: `{}, ${suffix || artifact.state?.name || item.name}`,
        priority: null,
      },
      { key: "system.properties", mode: 2, value: "mgc", priority: null },
      ...(Number(attackAndDamage?.value) > 0
        ? [{
            key: "system.magicalBonus",
            mode: 5,
            value: String(Number(attackAndDamage.value)),
            priority: null,
          }]
        : []),
      ...(Number(attackBonus?.value) > 0
        ? [{
            key: "activities[attack].attack.bonus",
            mode: 2,
            value: `+${Number(attackBonus.value)}`,
            priority: null,
          }]
        : []),
      ...(hitDamage?.type === "dice" && damageType
        ? [{
            key: "activities[attack].damage.parts",
            mode: 2,
            value: JSON.stringify({
              number: Number(hitDamage.count),
              denomination: Number(hitDamage.faces),
              types: [damageType],
            }),
            priority: null,
          }]
        : []),
      ...(artifact.state?.baseDamageDie?.type === "dice"
        ? [
            {
              key: "system.damage.base.number",
              mode: 5,
              value: String(Number(artifact.state.baseDamageDie.count)),
              priority: null,
            },
            {
              key: "system.damage.base.denomination",
              mode: 5,
              value: String(Number(artifact.state.baseDamageDie.faces)),
              priority: null,
            },
          ]
        : []),
      ...(artifact.state?.spellcastingAttack === true
        ? [{
            key: "activities[attack].attack.ability",
            mode: 5,
            value: "spellcasting",
            priority: null,
          }]
        : []),
    ];
    effect.flags = {
      [MODULE_ID]: {
        identifier: item.system.identifier,
        sourceSpellId: item._id,
        compilerVersion: SPELL_AUTOMATION_COMPILER_VERSION,
        compilerArtifactIds: [artifact.semanticId],
        host: artifact.host,
        identity: clone(artifact.identity),
        reapply: artifact.reapply,
        ...(Object.keys(selection).length > 0
          ? { enchantmentSelections: clone(selection) }
          : {}),
      },
      dnd5e: {
        enchantment: {
          level: { min: minimum, max: maximum },
          riders: riderActivityId ? [riderActivityId] : [],
        },
      },
    };
    return effect;
    });
  });
}

function findSourceActivity(item, compilation, action, usedIds) {
  const activities = Object.values(item.system?.activities ?? {});
  const mappedId = compilation.provenance?.actionActivityIds?.[action.sourceActionId];
  if (mappedId && !usedIds.has(mappedId)) {
    const mapped = activities.find(current => current._id === mappedId);
    if (mapped) return mapped;
  }
  const typed = activities.find(current =>
    !usedIds.has(current._id) && current.type === action.activityType
  );
  if (typed) return typed;
  return activities.find(current => !usedIds.has(current._id)) ?? null;
}

function activityName(item, compilation, action, sourceActivity) {
  if (compilation.sourceMode === "explicit") return action.name || item.name;
  const sourceName = String(sourceActivity?.name ?? "").trim();
  if (sourceName && sourceName.toLowerCase() !== "cast") return sourceName;
  return item.name;
}

function configureActivityEffects(activity, action, effectByArtifactId) {
  const hasSave = action.operations.some(current => current.type === "saving-throw");
  const refs = [];
  const templateEffectIds = [];
  const sourceArtifactApplications = [];
  for (const current of action.operations) {
    if (!["create-artifact", "apply-artifact"].includes(current.type)) continue;
    // Source-scoped applications on actions that target other creatures must
    // not be handed to Midi's effect application: it would land the artifact
    // on the target instead of the caster. The Arcane runtime applies them
    // to the caster post-use from this activity flag instead.
    if (
      current.type === "apply-artifact"
      && current.target === "source"
      && (
        action.input !== "self"
        || action.target?.origin?.type === "placed-template"
      )
    ) {
      sourceArtifactApplications.push(current.artifactId);
      continue;
    }
    const effectValue = effectByArtifactId.get(current.artifactId);
    const effects = Array.isArray(effectValue) ? effectValue : [effectValue];
    if (Array.isArray(effectValue) && action.activityType !== "enchant") continue;
    if (!Array.isArray(effectValue) && action.activityType === "enchant") continue;
    const outcome = current.conditionalOutcome?.outcome;
    const isPersistentTemplate = (
      !Array.isArray(effectValue)
      && effectValue?.flags?.[MODULE_ID]?.persistentTemplate === true
    );
    if (hasSave && outcome && !["success", "failure"].includes(outcome)) {
      throw new Error(
        `${action.semanticId} cannot lower effect outcome ${outcome} through a save activity`,
      );
    }
    if (
      hasSave
      && !outcome
      && !isPersistentTemplate
      && current.target !== "source"
    ) {
      throw new Error(
        `${action.semanticId} applies ${current.artifactId} after a save without a success/failure branch`,
      );
    }
    for (const effect of effects) {
      if (!effect || refs.some(reference => reference._id === effect._id)) continue;
      if (isPersistentTemplate) {
        if (!templateEffectIds.includes(effect._id)) templateEffectIds.push(effect._id);
        continue;
      }
      if (action.activityType === "enchant") {
        refs.push({
          _id: effect._id,
          level: clone(effect.flags?.dnd5e?.enchantment?.level ?? {}),
          riders: {
            activity: [],
            effect: [],
            item: [],
          },
        });
      } else {
        refs.push({
          _id: effect._id,
          level: {},
          onSave: hasSave && outcome === "success",
        });
      }
    }
  }
  activity.flags ??= {};
  activity.flags[MODULE_ID] ??= {};
  if (templateEffectIds.length > 0) {
    activity.flags[MODULE_ID].templateEffectIds = templateEffectIds;
    activity.flags[MODULE_ID].templateEffectMode = refs.length > 0
      ? "mixed"
      : "exclusive";
    if (refs.length === 0) {
      for (const effectId of templateEffectIds) {
        refs.push({
          _id: effectId,
          level: {},
          onSave: false,
        });
      }
    }
  } else {
    delete activity.flags[MODULE_ID].templateEffectIds;
    delete activity.flags[MODULE_ID].templateEffectMode;
  }
  if (sourceArtifactApplications.length > 0) {
    activity.flags[MODULE_ID].applySourceArtifacts = [...new Set(sourceArtifactApplications)];
  } else {
    delete activity.flags[MODULE_ID].applySourceArtifacts;
  }
  activity.effects = refs;
}

function activityTargetFilter(action) {
  const targetKind = String(action.target?.targetKind ?? "");
  return (
    action.target?.origin?.type === "placed-template"
    && DND5E_CREATURE_TYPES.has(targetKind)
  )
    ? {
        type: "creature-type",
        values: [targetKind],
      }
    : null;
}

function activitySelectionConstraints(action) {
  return clone(action.interaction?.selectionConstraints ?? []);
}

function configureActivityContract(activity, item, action) {
  activity.flags ??= {};
  activity.flags[MODULE_ID] ??= {};
  activity.flags[MODULE_ID].semanticActionId = action.semanticId;
  const targetFilter = activityTargetFilter(action);
  const selectionConstraints = activitySelectionConstraints(action);
  activity.flags[MODULE_ID].interaction = {
    version: action.resolution
      ? COMPILER_ACTIVITY_CONTRACT_VERSION + 1
      : COMPILER_ACTIVITY_CONTRACT_VERSION,
    input: action.input,
    ...(action.resolution
      ? { resolution: clone(action.resolution) }
      : {}),
    ...(action.requiredSelections?.length
      ? { requiredSelections: clone(action.requiredSelections) }
      : {}),
    ...(action.input === "placed-template"
      || action.target?.origin?.type === "placed-template"
      ? { templateTargets: action.interaction?.templateTargets ?? "none" }
      : {}),
    ...(action.interaction?.selectionCardinality
      ? { selectionCardinality: clone(action.interaction.selectionCardinality) }
      : {}),
    ...(targetFilter ? { targetFilter } : {}),
    ...(selectionConstraints.length > 0 ? { selectionConstraints } : {}),
    ...(action.interaction?.saveRollMode
      ? { saveRollMode: action.interaction.saveRollMode }
      : {}),
  };

  const availability = (action.availability ?? []).find(current =>
    current.type === "artifact-exists"
  );
  if (availability) {
    activity.flags[MODULE_ID].availability = {
      requiresArtifactId: availability.artifactId,
      // Compatibility field read by the current CLI and embedded-item migration.
      requiresEffectIdentifier: item.system.identifier,
      ...(availability.consumption
        ? { sourceConsumption: availability.consumption }
        : {}),
    };
    // Midi evaluates useConditionText against its serializable condition-data
    // sandbox. The top-level `effects` array is available there; the live
    // `actor.effects` Collection is intentionally not and causes evaluation
    // errors to take Midi's permissive errorReturn path.
    activity.useConditionText =
      "effects.some(effect => "
      + "effect.disabled !== true "
      + "&& effect.active !== false "
      + "&& effect.isSuppressed !== true "
      + `&& effect.flags?.["${MODULE_ID}"]?.identifier === "${item.system.identifier}" `
      + `&& effect.flags?.["${MODULE_ID}"]?.compilerArtifactIds?.includes("${availability.artifactId}"))`;
  } else {
    delete activity.flags[MODULE_ID].availability;
    activity.useConditionText = "";
  }

  activity.midiProperties ??= {};
  activity.midiProperties.identifier =
    action.adapter?.activityIdentifier ?? action.semanticId;
  activity.midiProperties.automationOnly = action.visibility === "automation-only";
  if (activity.midiProperties.automationOnly) {
    // Midi treats a compatible damage activity on the same Item as the
    // public attack's "other damage". Internal activities are invoked only
    // by their declared runtime adapter (for example ActivityOverTime), so
    // they must never be folded into the parent cast.
    activity.midiProperties.otherActivityCompatible = false;
    activity.midiProperties.otherActivityAsParentType = false;
  }
  if (
    action.input === "placed-template"
    || action.target?.origin?.type === "placed-template"
  ) {
    const templateTargets = action.interaction?.templateTargets ?? "none";
    activity.midiProperties.autoTargetAction =
      templateTargets === "workflow" ? "always" : "none";
    activity.midiProperties.autoTargetType = "any";
  } else {
    delete activity.midiProperties.autoTargetAction;
    delete activity.midiProperties.autoTargetType;
  }
  const activityFlags = {
    ...(action.representation?.activityFlags ?? {}),
    ...(action.adapter?.activityFlags ?? {}),
    ...(action.adapter?.triggeredEventActivity
      ? {
          triggeredEventActivity: clone(
            action.adapter.triggeredEventActivity,
          ),
        }
      : {}),
  };
  if (action.defaultTargetSelection) {
    activityFlags.choiceDefault = clone(action.defaultTargetSelection);
  }
  if (activityFlags.nativeSummonControlAction) {
    const source = activityFlags.nativeSummonControlAction;
    const { profileIds: _profileIds, ...closed } = source;
    activityFlags.nativeSummonControlAction = {
      ...closed,
      contractId: stableFoundryId(
        item.system.identifier,
        source.artifactId,
        "native-summon-control-v1",
      ),
    };
  }
  if (Object.keys(activityFlags).length > 0) {
    Object.assign(activity.flags[MODULE_ID], clone(activityFlags));
  }
  if (activityFlags.castOriginStaticMarker?.stationary === true) {
    if (!activity.target?.template) {
      throw new Error(
        `${action.semanticId} cast-origin static marker requires a native template target`,
      );
    }
    // Foundry/D&D5e owns the actual "cannot move" behavior through this native
    // template field. The Arcane contract flag is provenance, not a substitute
    // for lowering the stationary rule into the provider document.
    activity.target.template.stationary = true;
  }
  if (action.adapter?.overTime) {
    activity.isOverTimeFlag = true;
    activity.overTimeProperties = {
      ...(activity.overTimeProperties ?? {}),
      ...clone(action.adapter.overTime),
    };
  } else {
    // A source-pack donor may itself be an overtime activity. The semantic
    // action owns this choice, so never let donor overtime state leak into a
    // public cast or an unrelated hidden action.
    activity.isOverTimeFlag = false;
    delete activity.overTimeProperties;
  }
}

function emitEffects(item, compilation) {
  const sourceEffects = new Map(
    (item.effects ?? [])
      .filter(current => current?._id)
      .map(current => [current._id, current]),
  );
  const effectByArtifactId = new Map();
  const emitted = [];
  const artifacts = compilation.projection.artifacts ?? [];
  const artifactsById = new Map(artifacts.map(current => [current.semanticId, current]));
  const presentations = artifacts.filter(current =>
    current.role === "presentation"
  );
  const handled = new Set();

  for (const enchantment of artifacts.filter(current =>
    current.kind === "enchantment"
    && current.provider === "arcane-runtime"
  )) {
    const profiles = createWeaponEnchantmentProfiles(
      item,
      enchantment,
      compilation,
    );
    emitted.push(...profiles);
    effectByArtifactId.set(enchantment.semanticId, profiles);
    handled.add(enchantment.semanticId);
  }

  for (const zone of artifacts.filter(current =>
    current.kind === "zone" && current.provider === "active-auras"
  )) {
    const membership = artifacts.find(current =>
      current.kind === "effect"
      && current.lifecycle?.type === "while-artifact"
      && current.lifecycle.artifactId === zone.semanticId
    );
    if (!membership) {
      throw new Error(`${item.system.identifier} zone ${zone.semanticId} has no membership effect`);
    }
    const sourceEffectId =
      compilation.provenance?.artifactEffectIds?.[membership.sourceSemanticId ?? membership.semanticId];
    const effect = createEffect(
      item,
      membership,
      [],
      sourceEffects.get(sourceEffectId),
      {
        artifactsById,
        additionalArtifactIds: [zone.semanticId],
        cleanRoom: compilation.emissionMode === "clean-room",
        documentUuid: compilation.resourceBindings?.documentUuid,
      },
    );
    applyActiveAurasZone(effect, zone);
    emitted.push(effect);
    effectByArtifactId.set(zone.semanticId, effect);
    effectByArtifactId.set(membership.semanticId, effect);
    handled.add(zone.semanticId);
    handled.add(membership.semanticId);
  }

  for (const artifact of artifacts) {
    if (handled.has(artifact.semanticId)) continue;
    if (artifact.role === "presentation") continue;
    // Concentration is a virtual lifecycle artifact owned by dnd5e. For a
    // delayed per-spell transition, the compiler emits a hidden native
    // Activity anchor and the shared dispatcher calls Actor.beginConcentrating.
    if (artifact.semanticId === "concentration") continue;
    if (artifact.kind !== "effect") continue;
    const sourceEffectId =
      compilation.provenance?.artifactEffectIds?.[artifact.sourceSemanticId ?? artifact.semanticId];
    const linkedPresentations = presentations.filter(current =>
      current.lifecycle?.type === "while-artifact"
      && current.lifecycle.artifactId === artifact.semanticId
    );
    const effect = createEffect(
      item,
      artifact,
      linkedPresentations,
      sourceEffects.get(sourceEffectId),
      {
        artifactsById,
        cleanRoom: compilation.emissionMode === "clean-room",
        documentUuid: compilation.resourceBindings?.documentUuid,
      },
    );
    emitted.push(effect);
    effectByArtifactId.set(artifact.semanticId, effect);
    for (const presentation of linkedPresentations) {
      effectByArtifactId.set(presentation.semanticId, effect);
    }
  }
  return {
    emitted,
    effectByArtifactId,
    hasActiveAurasZones: artifacts.some(current =>
      current.kind === "zone" && current.provider === "active-auras"
    ),
  };
}

function emitActivities(item, compilation, effectByArtifactId) {
  const emitted = {};
  const usedIds = new Set();
  const artifactsById = new Map(
    (compilation.projection.artifacts ?? []).map(current => [current.semanticId, current]),
  );
  const standaloneActions = [
    ...compilation.projection.actions.filter(current => current.delivery === "standalone"),
    ...(compilation.projection.internalActions ?? []),
  ];

  for (let index = 0; index < standaloneActions.length; index += 1) {
    const action = standaloneActions[index];
    const sourceActivity = findSourceActivity(item, compilation, action, usedIds);
    const activity = clone(
      sourceActivity
      ?? (
        compilation.emissionMode === "clean-room"
          ? blankActivity(action.activityType, {
              runtimeProfile: compilation.runtimeProfile,
            })
          : {}
      ),
    );
    activity._id ||= stableFoundryId(item.system.identifier, "action", action.semanticId);
    usedIds.add(activity._id);
    activity.name = activityName(item, compilation, action, sourceActivity);
    activity.type = action.activityType;
    activity.sort = sourceActivity?.sort ?? index * 100;
    clearForeignActivitySchema(activity);
    normalizeActivityForAutomation(
      activity,
      compilation.emissionMode === "clean-room"
        ? compilation.runtimeProfile?.activityDefaults
        : {},
    );
    configureActivation(activity, action.activation);
    configureDuration(activity, action, artifactsById);
    configureTarget(activity, action.target, action.representation);
    if (
      action.input === "self"
      && action.target?.origin?.type === "placed-template"
    ) {
      activity.target.prompt = false;
    }
    configureOperations(activity, action.operations ?? []);
    if (
      action.delivery === "internal"
      && action.target?.origin?.type !== "event-neighborhood"
      && action.adapter?.enchantmentRider !== true
    ) {
      activity.range = {
        ...(activity.range ?? {}),
        value: null,
        units: "any",
        special: "",
        override: true,
      };
      activity.target ??= {};
      activity.target.prompt = false;
      activity.target.affects = {
        ...(activity.target.affects ?? {}),
        count: stringOrEmpty(action.target?.cardinality?.max ?? 1),
        type: action.target?.targetKind ?? "creature",
        choice: false,
        special: "",
      };
    }
    configureEnchantmentActivity(activity, action);
    configureWeaponEnchantmentRiderActivity(activity, action);
    configureSummonActivity(activity, item, action, compilation);
    configureActivityEffects(activity, action, effectByArtifactId);
    configureActivityContract(activity, item, action);
    emitted[activity._id] = activity;
  }
  for (const [index, anchor] of (compilation.projection.runtimeAnchors ?? []).entries()) {
    if (
      anchor?.kind !== "native-concentration"
      || anchor?.artifactId !== "concentration"
      || anchor?.activityType !== "utility"
      || !anchor?.id
      || !anchor?.activityIdentifier
    ) {
      throw new Error(`${item.system.identifier} has an invalid runtime anchor`);
    }
    const activity = blankActivity(anchor.activityType, {
      runtimeProfile: compilation.runtimeProfile,
    });
    activity._id = stableFoundryId(
      item.system.identifier,
      "runtime-anchor",
      anchor.id,
    );
    if (usedIds.has(activity._id) || emitted[activity._id]) {
      throw new Error(`${item.system.identifier} emitted a duplicate runtime anchor id`);
    }
    usedIds.add(activity._id);
    activity.name = anchor.name;
    activity.sort = standaloneActions.length * 100 + index * 100;
    activity.activation = {
      type: "",
      value: null,
      override: true,
      condition: "",
    };
    activity.consumption = {
      targets: [],
      scaling: { allowed: false, max: "" },
      spellSlot: false,
    };
    activity.duration = {
      concentration: true,
      value: stringOrEmpty(item.system.duration?.value),
      units: item.system.duration?.units ?? "inst",
      special: "",
      override: true,
    };
    activity.effects = [];
    activity.range = {
      value: null,
      units: "self",
      special: "",
      override: true,
    };
    activity.target = {
      prompt: false,
      override: true,
      affects: {
        count: "",
        type: "self",
        choice: false,
        special: "",
      },
      template: blankTemplate("ft"),
    };
    activity.flags = {
      [MODULE_ID]: {
        runtimeAnchor: {
          version: 1,
          id: anchor.id,
          kind: anchor.kind,
          artifactId: anchor.artifactId,
        },
      },
    };
    activity.midiProperties.identifier = anchor.activityIdentifier;
    activity.midiProperties.automationOnly = true;
    activity.midiProperties.otherActivityCompatible = false;
    activity.midiProperties.otherActivityAsParentType = false;
    activity.isOverTimeFlag = false;
    delete activity.overTimeProperties;
    emitted[activity._id] = activity;
  }
  const activityBySemanticId = new Map(
    Object.values(emitted).map(activity => [
      activity.flags?.[MODULE_ID]?.semanticActionId,
      activity,
    ]),
  );
  for (const runtimeRule of compilation.projection.runtimeRules ?? []) {
    const adapter = runtimeRule.adapter;
    if (
      adapter?.adapter !== "weapon-enchantment-v1"
      || !adapter.riderActivityIdentifier
    ) continue;
    const enchantmentActivity = Object.values(emitted).find(activity =>
      activity.midiProperties?.identifier === adapter.activityIdentifier
    );
    const riderActivity = Object.values(emitted).find(activity =>
      activity.midiProperties?.identifier === adapter.riderActivityIdentifier
    );
    if (!enchantmentActivity || !riderActivity) {
      throw new Error(
        `${item.system.identifier} cannot link weapon enchantment rider `
        + adapter.riderActivityIdentifier,
      );
    }
    for (const reference of enchantmentActivity.effects ?? []) {
      reference.riders ??= { activity: [], effect: [], item: [] };
      reference.riders.activity = [riderActivity._id];
    }
    item.flags ??= {};
    item.flags.dnd5e ??= {};
    item.flags.dnd5e.riders ??= {};
    item.flags.dnd5e.riders.activity = [...new Set([
      ...(item.flags.dnd5e.riders.activity ?? []),
      riderActivity._id,
    ])];
  }
  for (const action of compilation.projection.actions ?? []) {
    const link = action.triggeredActivity;
    if (!link) continue;
    const parent = activityBySemanticId.get(action.semanticId);
    const child = activityBySemanticId.get(link.semanticActionId);
    if (!parent || !child) {
      throw new Error(
        `${action.semanticId} cannot link triggered activity ${link.semanticActionId}`,
      );
    }
    parent.midiProperties ??= {};
    if (link.runtime === true) {
      parent.flags ??= {};
      parent.flags[MODULE_ID] ??= {};
      parent.flags[MODULE_ID].runtimeTriggeredActivity = {
        version: 1,
        activityIdentifier: child.midiProperties?.identifier,
      };
      parent.midiProperties.triggeredActivityId = "none";
      parent.midiProperties.triggeredActivityConditionText = "";
      parent.midiProperties.triggeredActivityTargets = "targets";
      parent.midiProperties.triggeredActivityRollAs = "self";
      parent.midiProperties.triggeredActivityConsume = true;
      parent.midiProperties.triggeredActivityConfigure = true;
    } else {
      parent.midiProperties.triggeredActivityId = child._id;
      parent.midiProperties.triggeredActivityConditionText =
        link.conditionText ?? "";
      parent.midiProperties.triggeredActivityTargets =
        link.targets ?? "targets";
      parent.midiProperties.triggeredActivityRollAs =
        link.rollAs ?? "self";
      parent.midiProperties.triggeredActivityConsume =
        link.consume !== false;
      parent.midiProperties.triggeredActivityConfigure =
        link.configure !== false;
    }
  }
  return emitted;
}

function configureDeclaredRiderContracts(item, compilation) {
  const rider = compilation.projection.actions.find(current =>
    current.delivery === "declared-rider"
  );
  if (!rider) {
    delete item.flags[MODULE_ID].declaredActiveBuff;
    delete item.flags[MODULE_ID].declaredWeaponSpellRider;
    return;
  }
  const activeBuffRules = compilation.projection.runtimeRules.filter(current => {
    const adapter = typeof current.adapter === "string"
      ? current.adapter
      : current.adapter?.adapter;
    return adapter === "declared-active-buff-v1";
  });
  if (activeBuffRules.length > 0) {
    const requiredArtifactId = activeBuffRules
      .flatMap(current => current.when ?? [])
      .find(current =>
        current.type === "artifact-exists"
        && current.subject === "source"
      )?.artifactId;
    const consumedArtifactId = activeBuffRules
      .flatMap(current => current.operations ?? [])
      .find(current =>
        current.type === "delete-artifact"
        && current.target === "source"
      )?.artifactId;
    const appliedArtifactId = activeBuffRules
      .flatMap(current => current.operations ?? [])
      .find(current =>
        current.type === "apply-artifact"
        && current.target === "source"
        && current.artifactId !== requiredArtifactId
      )?.artifactId;
    const damage = activeBuffRules
      .flatMap(current => current.operations ?? [])
      .find(current => current.type === "damage");
    const attackKind = activeBuffRules
      .flatMap(current => current.when ?? [])
      .find(current => current.type === "attack-kind")?.value;
    if (!requiredArtifactId || !consumedArtifactId || !appliedArtifactId) {
      throw new Error(
        `${item.system.identifier} declared-active-buff-v1 requires source ready, consume, and result artifacts`,
      );
    }
    item.flags[MODULE_ID].declaredActiveBuff = {
      identifier: item.system.identifier,
      declaration: "weapon-action-input",
      resource: "none",
      attackType: String(attackKind ?? "weapon").includes("melee")
        ? "melee"
        : String(attackKind ?? "weapon").includes("ranged")
          ? "ranged"
          : "weapon",
      semanticActionId: rider.semanticId,
      runtimeRuleIds: activeBuffRules.map(current => current.id).sort(),
      requiredArtifactId,
      consumedArtifactId,
      appliedArtifactId,
      ...(damage
        ? {
            damage: {
              formula: damage.formula,
              types: [...(damage.damageTypes ?? [])],
              properties: [...new Set(["spell", ...(damage.properties ?? [])])],
            },
          }
        : {}),
    };
    delete item.flags[MODULE_ID].declaredWeaponSpellRider;
    return;
  }
  delete item.flags[MODULE_ID].declaredActiveBuff;
  const runtimeRule = compilation.projection.runtimeRules.find(current =>
    current.adapter?.adapter === "declared-weapon-spell-rider-v1"
    && current.operations?.some(operation =>
      operation.type === "consume-resource" && operation.timing === "on-hit"
    )
  );
  const attackKind = runtimeRule?.when?.find(current =>
    current.type === "attack-kind"
  )?.value;
  const saveFollowUp = (compilation.projection.internalActions ?? []).find(current =>
    current.activityType === "save"
    && current.adapter?.activityIdentifier
  );
  const damage = runtimeRule?.adapter?.resolution === "post-hit-activity"
    ? null
    : runtimeRule?.operations?.find(operation =>
        operation.type === "damage"
      );
  const appliesArtifact = runtimeRule?.operations?.some(operation =>
    operation.type === "apply-artifact"
  ) === true;
  item.flags[MODULE_ID].declaredWeaponSpellRider = {
    identifier: item.system.identifier,
    declaration: "weapon-action-input",
    consumesOnHit: runtimeRule?.operations?.some(operation =>
      operation.type === "consume-resource" && operation.timing === "on-hit"
    ) === true,
    attackType: String(attackKind ?? "").includes("melee")
      ? "melee"
      : String(attackKind ?? "").includes("ranged")
        ? "ranged"
        : "any",
    minSpellLevel: Number(item.system?.level ?? 1) || 1,
    requiresBonusAction: rider.activation?.type === "bonus",
    semanticActionId: rider.semanticId,
    runtimeRuleId: runtimeRule?.id,
    ...(damage
      ? {
          damage: {
            formula: damage.formula,
            types: [...(damage.damageTypes ?? [])],
            scaling: clone(damage.scaling ?? null),
          },
        }
      : {}),
    appliesEffect: appliesArtifact || Boolean(saveFollowUp),
    ...(saveFollowUp
      ? { saveActivityIdentifier: saveFollowUp.adapter.activityIdentifier }
      : {}),
  };
}

function automationImplementation(profile, projection) {
  const capabilities = new Set(projection.capabilities ?? []);
  if (capabilities.has("active-auras") && capabilities.has("midi-overtime")) {
    return capabilities.has("arcane-runtime")
      ? "active-auras-overtime-runtime"
      : "active-auras-overtime";
  }
  if (capabilities.has("active-auras")) {
    return capabilities.has("arcane-runtime")
      ? "active-auras-runtime"
      : "active-auras-template";
  }
  if (capabilities.has("arcane-runtime")) return "compiler-runtime";
  return profile.implementation ?? "native";
}

function dnd5eDurationUnit(units) {
  return {
    seconds: "second",
    rounds: "round",
    minutes: "minute",
    hours: "hour",
    days: "day",
  }[units] ?? units;
}

function rootTargetFromAction(action) {
  // A declared rider is prepared by the caster and inherits the eventual
  // weapon workflow's hit target. That inherited target is runtime input, not
  // the spell Item's own target metadata.
  if (action?.delivery === "declared-rider") {
    return {
      target: {
        affects: {
          count: "",
          type: "self",
          choice: false,
          special: "",
        },
        template: blankTemplate("ft"),
      },
      range: {
        value: null,
        units: "self",
        special: "",
      },
    };
  }
  const target = action?.target;
  const origin = target?.origin?.type ?? "none";
  const rangeUnits = target?.range?.units || (origin === "self" ? "self" : "ft");
  if (origin === "self") {
    return {
      target: {
        affects: {
          count: "",
          type: "self",
          choice: false,
          special: "",
        },
        template: blankTemplate("ft"),
      },
      range: {
        value: null,
        units: "self",
        special: "",
      },
    };
  }
  if (origin === "placed-template") {
    const shape = target.origin?.shape ?? {};
    return {
      target: {
        affects: {
          count: "",
          type: target.targetKind === "creature" ? "" : String(target.targetKind ?? ""),
          choice: false,
          special: "",
        },
        template: {
          ...blankTemplate(shape.units || "ft"),
          type: String(shape.type ?? ""),
          size: stringOrEmpty(shape.size),
          width: stringOrEmpty(shape.width),
          height: stringOrEmpty(shape.height),
        },
      },
      range: {
        value: target.range?.value ?? null,
        units: rangeUnits,
        special: "",
      },
    };
  }
  return {
    target: {
      affects: {
        count: stringOrEmpty(target?.cardinality?.max),
        type: String(target?.targetKind ?? ""),
        choice: false,
        special: "",
      },
      template: blankTemplate(rangeUnits),
    },
    range: {
      value: target?.range?.value ?? null,
      units: target ? rangeUnits : "any",
      special: "",
    },
  };
}

function applyCleanRoomSpellContract(item, compilation) {
  const contract = compilation.contract;
  if (!contract) throw new Error(`${compilation.definitionId} has no clean-room SpellContract`);
  const primaryAction = compilation.projection.actions.find(current =>
    current.semanticId === contract.primaryActionId
    || current.sourceActionId === contract.primaryActionId
  );
  if (!primaryAction) {
    throw new Error(
      `${compilation.definitionId} has no emitted primary action ${contract.primaryActionId}`,
    );
  }
  const lifetime = contract.lifetime?.duration ?? { type: "instant" };
  const properties = new Set();
  if (contract.components?.verbal) properties.add("vocal");
  if (contract.components?.somatic) properties.add("somatic");
  if (contract.components?.material) properties.add("material");
  if (contract.ritual) properties.add("ritual");
  if (contract.lifetime?.concentration) properties.add("concentration");
  const rootTarget = rootTargetFromAction(primaryAction);
  item.system.level = contract.level;
  item.system.school = contract.school;
  item.system.activation = {
    type: primaryAction.activation?.type === "none"
      ? ""
      : String(primaryAction.activation?.type ?? ""),
    condition: "",
    value: primaryAction.activation?.cost ?? null,
  };
  item.system.duration = lifetime.type === "instant"
    ? { value: null, units: "inst" }
    : {
        value: String(lifetime.value ?? ""),
        units: dnd5eDurationUnit(lifetime.units),
      };
  item.system.target = rootTarget.target;
  item.system.range = rootTarget.range;
  item.system.materials = {
    value: compilation.content?.materialText ?? "",
    consumed: Boolean(contract.material?.consumed),
    cost: Number(contract.material?.cost ?? 0),
    supply: 0,
  };
  item.system.properties = [...properties];
  item.system.method = compilation.runtimeProfile?.itemDefaults?.method ?? "spell";
  item.system.prepared = compilation.runtimeProfile?.itemDefaults?.prepared ?? 0;
  item.system.ability = compilation.runtimeProfile?.itemDefaults?.ability ?? "";
  return item;
}

function cleanRoomSpellItem(compilation) {
  const item = blankSpellItem({
    identifier: compilation.definitionId,
    name: compilation.content?.name ?? compilation.definitionId,
    img: compilation.content?.img,
    description: compilation.content?.description,
    source: compilation.content?.source,
    documentIdentity: compilation.documentIdentity,
    packaging: compilation.packaging,
    runtimeProfile: compilation.runtimeProfile,
  });
  if (compilation.content?.localization) {
    item.flags[MODULE_ID] ??= {};
    item.flags[MODULE_ID].contentLocalization = clone(compilation.content.localization);
  }
  return applyCleanRoomSpellContract(item, compilation);
}

export function cleanRoomExecutableItemSnapshot(item, {documentUuid} = {}) {
  const snapshot = clone(item);
  const sourceDocumentId = snapshot._id;
  delete snapshot._id;
  delete snapshot.name;
  delete snapshot.img;
  delete snapshot.ownership;
  delete snapshot.folder;
  delete snapshot.sort;
  delete snapshot._stats;
  delete snapshot.system?.description;
  delete snapshot.system?.source;
  delete snapshot.system?.classes;
  if (snapshot.system?.materials) snapshot.system.materials.value = "";
  const moduleFlags = snapshot.flags?.[MODULE_ID];
  if (moduleFlags) {
    delete moduleFlags.contentLocalization;
    delete moduleFlags.compiler;
    delete moduleFlags.spellContentVersion;
    delete moduleFlags.spellClasses;
    delete moduleFlags.sourcePack;
    delete moduleFlags.sourceUuid;
    if (moduleFlags.spellAutomation) {
      delete moduleFlags.spellAutomation.support;
      delete moduleFlags.spellAutomation.acceptance;
    }
  }
  for (const activity of Object.values(snapshot.system?.activities ?? {})) {
    delete activity.name;
    delete activity.img;
    delete activity.sort;
    delete activity.description;
  }
  for (const effect of snapshot.effects ?? []) {
    const effectFlags = effect.flags?.[MODULE_ID];
    if (effectFlags?.sourceSpellId !== undefined) {
      if (effectFlags.sourceSpellId !== sourceDocumentId) {
        throw new Error(
          `${item.system?.identifier} effect ${effect._id} references foreign sourceSpellId `
          + effectFlags.sourceSpellId,
        );
      }
      effectFlags.sourceSpellId = "<spell-document-id>";
    }
    const expectedOrigin = documentUuid ?? `Compendium.${MODULE_ID}.spells.Item.${sourceDocumentId}`;
    const nativeEnchantmentProfile =
      effect.type === "enchantment"
      && effect.origin === null;
    if (!nativeEnchantmentProfile && effect.origin !== expectedOrigin) {
      throw new Error(
        `${item.system?.identifier} effect ${effect._id} references foreign origin `
        + effect.origin,
      );
    }
    effect.origin = nativeEnchantmentProfile
      ? "<native-enchantment-profile>"
      : "<spell-document-origin>";
    delete effect.img;
    delete effect.description;
    delete effect.sort;
  }
  return snapshot;
}

export function emitSpellAutomationItem(sourceItem, compilation, { profile = {} } = {}) {
  if (sourceItem?.system?.identifier !== compilation?.definitionId) {
    throw new Error(
      `Cannot emit ${compilation?.definitionId} into ${sourceItem?.system?.identifier}`,
    );
  }
  const item = compilation.emissionMode === "clean-room"
    ? cleanRoomSpellItem(compilation)
    : clone(sourceItem);
  item.system ??= {};
  item.flags ??= {};
  item.flags[MODULE_ID] ??= {};
  // A spell save's target ability belongs on the activity. The Item-level
  // ability field is the caster-side spellcasting override and must remain
  // empty unless the DSL grows an explicit override primitive.
  if (compilation.emissionMode !== "clean-room") item.system.ability = "";

  const {
    emitted: effects,
    effectByArtifactId,
    hasActiveAurasZones,
  } = emitEffects(item, compilation);
  item.effects = effects;
  item.system.activities = emitActivities(item, compilation, effectByArtifactId);
  if (hasActiveAurasZones) configureActiveAurasTemplateItem(item);
  if (compilation.projection.actions.some(current =>
    current.target?.origin?.type === "placed-point"
    && current.operations?.some(operation => operation.type === "move-token")
  )) {
    item.flags.autoanimations = {
      ...(item.flags.autoanimations ?? {}),
      isEnabled: false,
      isCustomized: false,
      fromAmmo: false,
      version: 5,
    };
  }
  configureDeclaredRiderContracts(item, compilation);
  Object.assign(
    item.flags[MODULE_ID],
    clone(compilation.projection.moduleFlags ?? {}),
  );

  const concentration = compilation.projection.artifacts.some(current =>
    current.state?.concentration === true
  );
  const properties = new Set(item.system.properties ?? []);
  if (concentration) {
    properties.add("concentration");
  } else {
    properties.delete("concentration");
  }
  item.system.properties = [...properties];

  item.flags[MODULE_ID].compiler = {
    schemaVersion: SPELL_AUTOMATION_SCHEMA_VERSION,
    version: SPELL_AUTOMATION_COMPILER_VERSION,
    definitionHash: compilation.definitionHash,
    graphHash: compilation.graphHash,
    planHash: compilation.planHash,
    ...(compilation.emissionMode === "clean-room"
      ? {
          contentHash: compilation.contentHash,
          semanticHash: compilation.semanticHash,
          executionPlanHash: compilation.executionPlanHash,
          runtimeProfileVersion: compilation.runtimeProfileVersion,
          runtimeProfileHash: compilation.runtimeProfileHash,
        }
      : {}),
  };
  if (compilation.emission?.contentVersion !== undefined) {
    item.flags[MODULE_ID].spellContentVersion = compilation.emission.contentVersion;
  }
  const legacyProfile = compilation.emissionMode === "clean-room" ? {} : profile;
  item.flags[MODULE_ID].spellAutomation = {
    ...(item.flags[MODULE_ID].spellAutomation ?? {}),
    version: SPELL_AUTOMATION_PROFILE_VERSION,
    areaBehavior: compilation.projection.artifacts.some(current => current.kind === "zone")
      ? "persistent-zone"
      : legacyProfile.areaBehavior ?? "native",
    implementation: automationImplementation(legacyProfile, compilation.projection),
    source: "compiler",
    support: clone(compilation.support),
    capabilities: [...(compilation.projection.capabilities ?? [])],
    acceptance: {
      compilerStatus: "static-passed",
      evidenceStatus: compilation.acceptance?.status ?? "none",
      evidenceSource: compilation.acceptance?.source ?? null,
    },
    runtimePlan: (() => {
      const runtimeArtifacts = (compilation.projection.artifacts ?? [])
        .filter(current => current.provider === "arcane-runtime");
      return {
        rules: clone(compilation.projection.runtimeRules ?? []),
        ...(compilation.projection.perSpellScript
          ? { script: clone(compilation.projection.perSpellScript) }
          : {}),
        ...((compilation.projection.runtimeAnchors ?? []).length > 0
          ? { anchors: clone(compilation.projection.runtimeAnchors) }
          : {}),
        actionResolutions: (compilation.projection.actions ?? [])
          .filter(current => current.resolution)
          .map(current => ({
            semanticActionId: current.semanticId,
            resolution: clone(current.resolution),
          })),
        internalActions: (compilation.projection.internalActions ?? []).map(current => ({
          semanticId: current.semanticId,
          sourceRuleId: current.sourceRuleId,
          activityIdentifier: current.adapter?.activityIdentifier,
        })),
        ...(runtimeArtifacts.length > 0
          ? { artifacts: clone(runtimeArtifacts) }
          : {}),
      };
    })(),
  };
  if (compilation.emissionMode === "clean-room") {
    item.flags[MODULE_ID].compiler.executableHash = semanticHash(
      cleanRoomExecutableItemSnapshot(item, {documentUuid: compilation.resourceBindings?.documentUuid}),
    );
  }

  assertEmittedSpellItem(item, compilation);
  return item;
}

function effectiveActivityInput(activity) {
  return activity.flags?.[MODULE_ID]?.interaction?.input ?? null;
}

function formulaFromDicePart(part) {
  if (part?.custom?.enabled) return normalizeFormula(part.custom.formula);
  const number = part?.number ?? 0;
  const denomination = part?.denomination ?? 0;
  const bonus = String(part?.bonus ?? "").trim();
  return `${number}d${denomination}${bonus ? `+${bonus}` : ""}`;
}

export function assertEmittedSpellItem(item, compilation) {
  const errors = [];
  const activities = Object.values(item.system?.activities ?? {});
  const effectsById = new Map((item.effects ?? []).map(current => [current._id, current]));
  const artifactsById = new Map(
    (compilation.projection.artifacts ?? []).map(current => [current.semanticId, current]),
  );
  if (effectsById.size !== (item.effects ?? []).length) {
    errors.push("emitted duplicate ActiveEffect ids");
  }
  const expectedActions = [
    ...compilation.projection.actions.filter(current => current.delivery === "standalone"),
    ...(compilation.projection.internalActions ?? []),
  ];
  const expectedAnchors = compilation.projection.runtimeAnchors ?? [];
  if (activities.length !== expectedActions.length + expectedAnchors.length) {
    errors.push(
      `expected ${expectedActions.length} actions and ${expectedAnchors.length} anchors, `
      + `emitted ${activities.length} activities`,
    );
  }

  for (const expected of expectedAnchors) {
    const matches = activities.filter(current =>
      current.flags?.[MODULE_ID]?.runtimeAnchor?.id === expected.id
    );
    const activity = matches[0];
    const contract = activity?.flags?.[MODULE_ID]?.runtimeAnchor;
    if (
      matches.length !== 1
      || contract?.version !== 1
      || contract?.kind !== expected.kind
      || contract?.artifactId !== expected.artifactId
      || activity?.type !== expected.activityType
      || activity?.midiProperties?.identifier !== expected.activityIdentifier
      || activity?.midiProperties?.automationOnly !== true
      || activity?.midiProperties?.otherActivityCompatible !== false
      || activity?.midiProperties?.otherActivityAsParentType !== false
      || activity?.consumption?.spellSlot !== false
      || (activity?.consumption?.targets ?? []).length !== 0
      || (activity?.effects ?? []).length !== 0
      || activity?.duration?.concentration !== true
      || activity?.duration?.value !== stringOrEmpty(item.system.duration?.value)
      || activity?.duration?.units !== (item.system.duration?.units ?? "inst")
      || activity?.duration?.override !== true
      || activity?.activation?.type !== ""
      || activity?.target?.prompt !== false
      || activity?.target?.affects?.type !== "self"
      || activity?.range?.units !== "self"
      || activity?.flags?.[MODULE_ID]?.semanticActionId !== undefined
      || activity?.flags?.[MODULE_ID]?.interaction !== undefined
    ) {
      errors.push(`runtime anchor ${expected.id} does not match its closed contract`);
    }
  }

  for (const expected of expectedActions) {
    const activity = activities.find(current =>
      current.flags?.[MODULE_ID]?.semanticActionId === expected.semanticId
    );
    if (!activity) {
      errors.push(`missing activity ${expected.semanticId}`);
      continue;
    }
    if (activity.type !== expected.activityType) {
      errors.push(`${expected.semanticId} type ${activity.type}; expected ${expected.activityType}`);
    }
    if (effectiveActivityInput(activity) !== expected.input) {
      errors.push(`${expected.semanticId} input ${effectiveActivityInput(activity)}; expected ${expected.input}`);
    }
    if (
      stableStringify(
        activity.flags?.[MODULE_ID]?.interaction?.requiredSelections ?? [],
      ) !== stableStringify(expected.requiredSelections ?? [])
    ) {
      errors.push(`${expected.semanticId} required selections mismatch`);
    }
    if (
      stableStringify(
        activity.flags?.[MODULE_ID]?.interaction?.targetFilter ?? null,
      ) !== stableStringify(activityTargetFilter(expected))
    ) {
      errors.push(`${expected.semanticId} target filter mismatch`);
    }
    if (
      stableStringify(
        activity.flags?.[MODULE_ID]?.interaction?.selectionConstraints ?? [],
      ) !== stableStringify(activitySelectionConstraints(expected))
    ) {
      errors.push(`${expected.semanticId} selection constraints mismatch`);
    }
    if (
      stableStringify(
        activity.flags?.[MODULE_ID]?.interaction?.resolution ?? null,
      ) !== stableStringify(expected.resolution ?? null)
    ) {
      errors.push(`${expected.semanticId} resolution mismatch`);
    }
    if (expected.triggeredActivity) {
      const linkedActivity = activities.find(current =>
        current.flags?.[MODULE_ID]?.semanticActionId
          === expected.triggeredActivity.semanticActionId
      );
      if (!linkedActivity) {
        errors.push(
          `${expected.semanticId} is missing triggered activity ` +
          expected.triggeredActivity.semanticActionId,
        );
      } else if (expected.triggeredActivity.runtime === true) {
        const runtimeLink = activity.flags?.[MODULE_ID]
          ?.runtimeTriggeredActivity;
        if (
          Number(runtimeLink?.version) !== 1
          || runtimeLink?.activityIdentifier
            !== linkedActivity.midiProperties?.identifier
          || activity.midiProperties?.triggeredActivityId !== "none"
        ) {
          errors.push(
            `${expected.semanticId} runtime triggered activity contract mismatch`,
          );
        }
      } else if (
        activity.midiProperties?.triggeredActivityId !== linkedActivity._id
        || activity.midiProperties?.triggeredActivityConditionText
          !== expected.triggeredActivity.conditionText
        || activity.midiProperties?.triggeredActivityTargets
          !== expected.triggeredActivity.targets
        || activity.midiProperties?.triggeredActivityRollAs
          !== expected.triggeredActivity.rollAs
        || activity.midiProperties?.triggeredActivityConsume
          !== expected.triggeredActivity.consume
        || activity.midiProperties?.triggeredActivityConfigure
          !== expected.triggeredActivity.configure
      ) {
        errors.push(`${expected.semanticId} triggered activity contract mismatch`);
      }
    }
    if (
      expected.input === "placed-template"
      && (!activity.target?.template?.type || activity.target?.template?.size === "")
    ) {
      errors.push(`${expected.semanticId} has no concrete template geometry`);
    }
    if (
      expected.input === "self"
      && expected.target?.origin?.type === "placed-template"
      && activity.target?.prompt !== false
    ) {
      errors.push(`${expected.semanticId} self-centered template must not prompt for placement`);
    }
    if (
      expected.target?.origin?.type === "placed-template"
      && targetExcludesSource(expected.target)
      && !String(activity.target?.affects?.special ?? "")
        .split(";")
        .includes("-self")
    ) {
      errors.push(`${expected.semanticId} must exclude its source from template targets`);
    }
    const expectedActivation = expected.activation?.type === "none"
      ? ""
      : expected.activation?.type;
    if (activity.activation?.type !== expectedActivation) {
      errors.push(`${expected.semanticId} activation ${activity.activation?.type}; expected ${expectedActivation}`);
    }
    const requiresInstantDuration = expected.delivery === "internal"
      || (expected.availability ?? []).some(current => current.type === "artifact-exists")
      || actionAppliesTriggerOnlyArtifact(expected, artifactsById);
    if (
      requiresInstantDuration
      && (
        activity.duration?.concentration !== false
        || activity.duration?.value !== ""
        || activity.duration?.units !== "inst"
        || activity.duration?.special !== ""
        || activity.duration?.override !== true
      )
    ) {
      errors.push(`${expected.semanticId} must have an explicit non-concentration instant duration`);
    }
    const expectedOrigin = expected.target?.origin?.type ?? "none";
    if (expectedOrigin === "self") {
      if (activity.target?.affects?.type !== "self" || activity.range?.units !== "self") {
        errors.push(`${expected.semanticId} must retain its self target`);
      }
    } else if (expected.target && expected.activityType !== "enchant") {
      const expectedCount = stringOrEmpty(expected.target.cardinality?.max);
      if (String(activity.target?.affects?.count ?? "") !== expectedCount) {
        errors.push(`${expected.semanticId} target count ${activity.target?.affects?.count}; expected ${expectedCount}`);
      }
      if (expectedOrigin === "placed-template") {
        const shape = expected.target.origin?.shape ?? {};
        for (const field of ["type", "size", "width", "height"]) {
          const expectedValue = stringOrEmpty(shape[field]);
          if (String(activity.target?.template?.[field] ?? "") !== expectedValue) {
            errors.push(`${expected.semanticId} template ${field} ${activity.target?.template?.[field]}; expected ${expectedValue}`);
          }
        }
        const staticMarker = expected.representation?.activityFlags
          ?.castOriginStaticMarker
          ?? expected.adapter?.activityFlags?.castOriginStaticMarker;
        if (
          staticMarker?.stationary === true
          && activity.target?.template?.stationary !== true
        ) {
          errors.push(`${expected.semanticId} cast-origin marker must lower native template stationary=true`);
        }
      } else if (expectedOrigin === "placed-point") {
        const template = expected.representation?.template ?? { type: "radius", size: 1 };
        if (
          activity.target?.affects?.type !== (expected.representation?.affects?.type ?? "space")
          || String(activity.target?.template?.type ?? "") !== String(template.type ?? "radius")
          || String(activity.target?.template?.size ?? "") !== String(template.size ?? 1)
        ) {
          errors.push(`${expected.semanticId} placed-point representation mismatch`);
        }
      } else if (expectedOrigin === "event-neighborhood") {
        if (
          activity.target?.prompt !== false
          || activity.target?.affects?.type
            !== (expected.target.targetKind ?? "creature")
          || String(activity.target?.template?.type ?? "") !== ""
          || String(activity.target?.template?.size ?? "") !== ""
          || activity.midiProperties?.autoTargetAction !== undefined
        ) {
          errors.push(
            `${expected.semanticId} event-neighborhood representation mismatch`,
          );
        }
      } else if (activity.target?.affects?.type !== (expected.target.targetKind ?? "creature")) {
        errors.push(`${expected.semanticId} target kind ${activity.target?.affects?.type}; expected ${expected.target.targetKind}`);
      }
      const eventNeighborhood = expectedOrigin === "event-neighborhood";
      const enchantmentRider = expected.adapter?.enchantmentRider === true;
      const expectedRangeUnits = enchantmentRider
        ? "ft"
        : eventNeighborhood
        ? "any"
        : expected.delivery === "internal"
        ? "any"
        : expected.target.range?.units ?? "ft";
      const expectedRangeValue = enchantmentRider
        ? ""
        : eventNeighborhood
        ? ""
        : expected.delivery === "internal"
        ? ""
        : expected.target.range?.value ?? "";
      if (
        String(activity.range?.units ?? "") !== String(expectedRangeUnits)
        || String(activity.range?.value ?? "") !== String(expectedRangeValue)
      ) {
        errors.push(
          `${expected.semanticId} range ${activity.range?.value ?? ""} ${activity.range?.units ?? ""}; `
          + `expected ${expectedRangeValue} ${expectedRangeUnits}`,
        );
      }
    }
    const expectsSlot = expected.operations.some(current =>
      current.type === "consume-resource" && current.resource === "spell-slot"
    );
    if (activity.consumption?.spellSlot !== expectsSlot) {
      errors.push(`${expected.semanticId} spellSlot ${activity.consumption?.spellSlot}; expected ${expectsSlot}`);
    }
    const healing = expected.operations.find(current =>
      current.type === "healing" || current.type === "grant-temporary-hp"
    );
    if (healing && normalizeFormula(formulaFromDicePart(activity.healing)) !== normalizeFormula(healing.formula)) {
      errors.push(`${expected.semanticId} healing ${formulaFromDicePart(activity.healing)}; expected ${healing.formula}`);
    }
    if (healing) {
      const actualScaling = activity.healing?.scaling ?? {};
      const expectedScaling = dnd5eScaling(healing.scaling);
      if (
        stableStringify(actualScaling) !== stableStringify(expectedScaling)
        || stableStringify(activity.healing?.types ?? []) !== stableStringify(
          healing.type === "grant-temporary-hp"
            ? ["temphp"]
            : healing.healingTypes ?? ["healing"],
        )
      ) {
        errors.push(`${expected.semanticId} healing scaling/types do not match the semantic operation`);
      }
    }
    const save = expected.operations.find(current => current.type === "saving-throw");
    if (save) {
      if (
        stableStringify([...(activity.save?.ability ?? [])].sort())
          !== stableStringify([...(save.ability ?? [])].sort())
        || activity.damage?.onSave !== (save.onSave ?? "none")
      ) {
        errors.push(`${expected.semanticId} save ability/outcome does not match the semantic operation`);
      }
    } else if (activity.save) {
      errors.push(`${expected.semanticId} emitted an unexpected saving throw`);
    }
    const attack = expected.operations.find(current => current.type === "attack-roll");
    if (attack) {
      if (activity.attack?.type?.value !== (attack.attackType ?? "spell")) {
        errors.push(`${expected.semanticId} attack type ${activity.attack?.type?.value}; expected ${attack.attackType ?? "spell"}`);
      }
      if (
        attack.attackSource === "spellcasting"
        && (
          activity.attack?.ability !== "spellcasting"
          || activity.attack?.type?.classification !== (
            expected.adapter?.enchantmentRider === true
              ? "weapon"
              : "spell"
          )
        )
      ) {
        errors.push(
          `${expected.semanticId} spellcasting attack must emit spell ability/classification`,
        );
      }
    } else if (activity.attack) {
      errors.push(`${expected.semanticId} emitted an unexpected attack roll`);
    }
    const damage = expected.operations.filter(current => current.type === "damage");
    const damageParts = activity.damage?.parts ?? [];
    if (damageParts.length !== damage.length) {
      errors.push(`${expected.semanticId} emitted ${damageParts.length} damage parts; expected ${damage.length}`);
    }
    for (let index = 0; index < damage.length; index += 1) {
      const expectedDamage = damage[index];
      const actualPart = damageParts[index];
      if (
        normalizeFormula(formulaFromDicePart(actualPart)) !== normalizeFormula(expectedDamage.formula)
        || stableStringify(actualPart?.types ?? []) !== stableStringify(
          expectedDamage.damageTypes ?? (
            expectedDamage.damageType ? [expectedDamage.damageType] : []
          ),
        )
        || stableStringify(actualPart?.scaling ?? {}) !== stableStringify(dnd5eScaling(expectedDamage.scaling))
      ) {
        errors.push(`${expected.semanticId} damage part ${index} does not match the semantic operation`);
      }
    }
    const expectedCriticalDamage = Boolean(attack)
      || damage.some(current => current.critical === "midi-qol");
    if (
      damage.length > 0
      && activity.damage?.critical?.allow !== expectedCriticalDamage
    ) {
      errors.push(
        `${expected.semanticId} critical damage ownership does not match the semantic operation`,
      );
    }
    if (activity.roll !== undefined) {
      errors.push(`${expected.semanticId} emitted an unexpected generic roll`);
    }
    if (expected.activityType === "summon") {
      const entities = (expected.artifacts ?? []).filter(current =>
        current.kind === "entity"
      );
      const entity = entities[0];
      const selectionId = entity?.state?.selection?.id ?? null;
      const selectedChoice = selectionId
        ? expected.bindings?.[selectionId]
        : null;
      const profiles = (entity?.state?.profiles ?? []).filter(profile =>
        selectedChoice === null || profile.choice === selectedChoice
      );
      const profile = profiles[0];
      const emittedProfile = activity.profiles?.[0];
      const cardinality = entity?.state?.cardinality;
      const baseLevel = Number(item.system.level);
      const hpBinding = nativeSummonBinding(entity, "hit-points");
      const attackBinding = nativeSummonBinding(entity, "spell-attack-bonus");
      const saveBinding = nativeSummonBinding(entity, "spell-save-dc");
      const damageBinding = nativeSummonBinding(entity, "activity-damage");
      const expectedBonuses = {
        ac: "",
        hd: "",
        hp: hpBinding ? nativeSummonFormula(hpBinding, { baseLevel }) : "",
        attackDamage: attackBinding && damageBinding
          ? nativeSummonFormula(damageBinding, { baseLevel })
          : "",
        saveDamage: saveBinding && damageBinding
          ? nativeSummonFormula(damageBinding, { baseLevel })
          : "",
        healing: "",
      };
      const expectedMatch = {
        ability: "",
        attacks: Boolean(attackBinding),
        disposition: true,
        proficiency: false,
        saves: Boolean(saveBinding),
      };
      const canonicalCardinality = (
        cardinality?.type === "single"
        && cardinality?.count === 1
      ) || (
        cardinality?.type === "fixed-small"
        && cardinality?.count === 2
      ) || (
        cardinality?.type === "fixed-three"
        && cardinality?.count === 3
      ) || (
        cardinality?.type === "fixed-group"
        && cardinality?.count === 5
      );
      if (
        entities.length !== 1
        || profiles.length !== 1
        || !canonicalCardinality
        || stableStringify(profile?.cardinality) !== stableStringify(cardinality)
        || activity.profiles?.length !== 1
        || emittedProfile?.count !== String(cardinality?.count ?? "")
        || emittedProfile?.name !== profile?.label
        || emittedProfile?.uuid
          !== summonProfileUuid(profile, compilation.resourceBindings, MODULE_ID)
        || activity.summon?.mode !== ""
        || activity.summon?.prompt !== true
        || stableStringify(activity.bonuses ?? {}) !== stableStringify(expectedBonuses)
        || stableStringify(activity.match ?? {}) !== stableStringify(expectedMatch)
        || activity.midiProperties?.removeChatButtons !== "all"
        || activity.attack !== undefined
        || activity.save !== undefined
        || activity.damage !== undefined
        || activity.healing !== undefined
        || activity.target?.prompt !== false
        || activity.target?.template?.type !== ""
        || activity.target?.template?.size !== ""
      ) {
        errors.push(`${expected.semanticId} has an invalid closed summon activity projection`);
      }
      const contract = activity.flags?.[MODULE_ID]?.nativeSummon;
      const expectedControl = entity?.state?.control
        ? {
            version: 1,
            contractId: stableFoundryId(
              item.system.identifier,
              entity?.sourceSemanticId ?? entity?.semanticId,
              "native-summon-control-v1",
            ),
            durationSeconds: Number(entity.state.control.duration?.value) * 60 * 60,
            expiry: entity.state.control.expiry,
          }
        : null;
      const expectedContract = {
        provider: "dnd5e",
        humanStep: "native-summon-placement",
        artifactId: entity?.sourceSemanticId ?? entity?.semanticId,
        choice: profile?.choice,
        profileId: profile?.profileId,
        revision: profile?.revision,
        documentId: profile?.documentId,
        expectedCount: cardinality?.count,
        cleanup: expectedControl
          ? "retain-entity"
          : entity?.state?.cleanup?.expiry,
        uniqueness: clone(entity?.state?.uniqueness ?? null),
        ...(expectedControl ? { control: expectedControl } : {}),
      };
      if (
        stableStringify(contract ?? {}) !== stableStringify(expectedContract)
        || activity.flags?.[MODULE_ID]?.summon !== undefined
        || contract?.provider !== "dnd5e"
        || contract?.humanStep !== "native-summon-placement"
        || contract?.artifactId !== (entity?.sourceSemanticId ?? entity?.semanticId)
        || contract?.choice !== profile?.choice
        || contract?.profileId !== profile?.profileId
        || contract?.revision !== profile?.revision
        || contract?.documentId !== profile?.documentId
        || contract?.expectedCount !== cardinality?.count
      ) {
        errors.push(`${expected.semanticId} has an invalid summon profile contract`);
      }
    }
    if (
      expected.activityType === "enchant"
      && (
        activity.enchant?.self !== false
        || activity.restrictions?.allowMagical
          !== (expected.adapter?.allowMagical === true)
        || activity.restrictions?.type !== "weapon"
      )
    ) {
      errors.push(`${expected.semanticId} has an invalid native weapon enchantment schema`);
    }
    for (const operation of expected.operations) {
      if (!["create-artifact", "apply-artifact"].includes(operation.type)) continue;
      const artifact = artifactsById.get(operation.artifactId);
      if (artifact?.kind === "enchantment") {
        if (expected.activityType !== "enchant") continue;
        const profiles = (item.effects ?? []).filter(current =>
          current.flags?.[MODULE_ID]?.compilerArtifactIds?.includes(
            operation.artifactId,
          )
        );
        const referencedIds = new Set(
          (activity.effects ?? []).map(current => current._id),
        );
        if (
          profiles.length === 0
          || profiles.some(current => !referencedIds.has(current._id))
        ) {
          errors.push(
            `${expected.semanticId} does not reference every enchantment profile `
            + operation.artifactId,
          );
        }
        continue;
      }
      const expectedEffect = (item.effects ?? []).find(current =>
        current.flags?.[MODULE_ID]?.compilerArtifactIds?.includes(operation.artifactId)
      );
      const isPersistentTemplate =
        expectedEffect?.flags?.[MODULE_ID]?.persistentTemplate === true;
      const reference = expectedEffect
        ? (activity.effects ?? []).find(current => current._id === expectedEffect._id)
        : null;
      const templateReference = isPersistentTemplate
        && (activity.flags?.[MODULE_ID]?.templateEffectIds ?? [])
          .includes(expectedEffect._id);
      const sourceApplicationReference = (
        activity.flags?.[MODULE_ID]?.applySourceArtifacts ?? []
      ).includes(operation.artifactId);
      if (expectedEffect && !reference && !templateReference && !sourceApplicationReference) {
        errors.push(`${expected.semanticId} does not reference artifact ${operation.artifactId}`);
      } else if (
        reference
        && reference.onSave !== (
          expected.operations.some(current => current.type === "saving-throw")
          && operation.conditionalOutcome?.outcome === "success"
        )
      ) {
        errors.push(`${expected.semanticId} applies ${operation.artifactId} on the wrong save outcome`);
      }
    }
    for (const reference of activity.effects ?? []) {
      if (!effectsById.has(reference._id)) {
        errors.push(`${expected.semanticId} references missing effect ${reference._id}`);
      }
    }
    if (
      expected.visibility === "automation-only"
      && activity.midiProperties?.automationOnly !== true
    ) {
      errors.push(`${expected.semanticId} must be automation-only`);
    }
  }

  for (const artifact of compilation.projection.artifacts ?? []) {
    if (artifact.role === "presentation" || artifact.semanticId === "concentration") continue;
    if (artifact.kind === "enchantment") {
      const profiles = (item.effects ?? []).filter(current =>
        current.flags?.[MODULE_ID]?.compilerArtifactIds?.includes(
          artifact.semanticId,
        )
      );
      const runtimeRule = (compilation.projection.runtimeRules ?? []).find(current =>
        current.adapter?.adapter === "weapon-enchantment-v1"
        && current.adapter?.artifactId === artifact.semanticId
      );
      const expressions = [
        artifact.state?.attackAndDamageBonus,
        artifact.state?.attackBonus,
        artifact.state?.hitDamageRider?.value,
      ].filter(Boolean);
      const tierCount = Math.max(1, new Set(expressions.flatMap(expression =>
        expression?.type === "tiers"
          ? (expression.entries ?? []).map(current => Number(current.minimum))
          : []
      )).size);
      const selectionCount = (runtimeRule?.adapter?.profileSelections ?? [])
        .reduce(
          (count, domain) => count * Math.max(1, domain.values?.length ?? 0),
          1,
        );
      const expectedProfileCount = tierCount * selectionCount;
      if (profiles.length !== expectedProfileCount) {
        errors.push(
          `${artifact.semanticId} emitted ${profiles.length} enchantment profiles; `
          + `expected ${expectedProfileCount}`,
        );
        continue;
      }
      if (profiles.some(profile =>
        profile.type !== "enchantment"
        || !profile.changes?.some(change =>
            change.key === "system.properties"
            && change.value === "mgc"
          )
      )) {
        errors.push(`${artifact.semanticId} has an invalid native enchantment profile`);
      }
      continue;
    }
    if (!["effect", "zone"].includes(artifact.kind)) continue;
    const effect = (item.effects ?? []).find(current =>
      current.flags?.[MODULE_ID]?.compilerArtifactIds?.includes(artifact.semanticId)
    );
    if (!effect) {
      errors.push(`missing emitted artifact ${artifact.semanticId}`);
      continue;
    }
    if (artifact.kind === "effect") {
      const expectedChanges = effectProviderChanges(artifact, {
        ...(artifact.state ?? {}),
        activityOverTime:
          artifact.adapter?.activityOverTime
          ?? artifact.state?.activityOverTime,
      });
      if (stableStringify(effect.changes ?? []) !== stableStringify(expectedChanges)) {
        errors.push(`${artifact.semanticId} effect changes do not exactly match the semantic state`);
      }
      if (
        artifact.state?.statuses !== undefined
        && stableStringify([...(effect.statuses ?? [])].sort())
          !== stableStringify([...(artifact.state.statuses ?? [])].sort())
      ) {
        errors.push(`${artifact.semanticId} effect statuses do not exactly match the semantic state`);
      }
      if (
        effect.transfer !== (artifact.state?.transfer ?? effect.transfer ?? false)
        || effect.disabled !== (artifact.state?.disabled ?? effect.disabled ?? false)
      ) {
        errors.push(`${artifact.semanticId} transfer/disabled state mismatch`);
      }
      const expectedSeconds = lifecycleSeconds(artifact.lifecycle, artifactsById);
      if (expectedSeconds !== null && Number(effect.duration?.seconds) !== expectedSeconds) {
        errors.push(`${artifact.semanticId} duration ${effect.duration?.seconds}; expected ${expectedSeconds}`);
      }
      const expectedSpecialDuration =
        artifact.adapter?.deferLifecycleCleanupToActivity
          ? []
          : lifecycleSpecialDurations(artifact.lifecycle);
      if (
        stableStringify([...(effect.flags?.dae?.specialDuration ?? [])].sort())
          !== stableStringify([...expectedSpecialDuration].sort())
      ) {
        errors.push(`${artifact.semanticId} DAE lifecycle cleanup mismatch`);
      }
      for (const [key, value] of Object.entries(artifact.adapter?.flags ?? {})) {
        if (stableStringify(effect.flags?.[MODULE_ID]?.[key]) !== stableStringify(value)) {
          errors.push(`${artifact.semanticId} missing adapter flag ${key}`);
        }
      }
      if (
        artifact.state?.savingThrowAdvantage
        && stableStringify(effect.flags?.[MODULE_ID]?.savingThrowAdvantage)
          !== stableStringify(artifact.state.savingThrowAdvantage)
      ) {
        errors.push(`${artifact.semanticId} saving throw advantage state was not emitted`);
      }
    }
  }

  const runtimePlan = item.flags?.[MODULE_ID]?.spellAutomation?.runtimePlan;
  const expectedRuntimeRules = compilation.projection.runtimeRules ?? [];
  if (stableStringify(runtimePlan?.rules ?? []) !== stableStringify(expectedRuntimeRules)) {
    errors.push("runtime lowering receipts do not exactly match the compiler projection");
  }
  const expectedRuntimeArtifacts = (compilation.projection.artifacts ?? [])
    .filter(current => current.provider === "arcane-runtime");
  if (
    stableStringify(runtimePlan?.script ?? null)
      !== stableStringify(compilation.projection.perSpellScript ?? null)
  ) {
    errors.push("runtime per-spell script plan does not exactly match the compiler projection");
  }
  if (
    stableStringify(runtimePlan?.anchors ?? [])
      !== stableStringify(compilation.projection.runtimeAnchors ?? [])
  ) {
    errors.push("runtime anchor receipts do not exactly match the compiler projection");
  }
  if (
    stableStringify(runtimePlan?.artifacts ?? [])
      !== stableStringify(expectedRuntimeArtifacts)
  ) {
    errors.push("runtime artifact receipts do not exactly match the compiler projection");
  }
  const expectedInternalActions = (compilation.projection.internalActions ?? []).map(current => ({
    semanticId: current.semanticId,
    sourceRuleId: current.sourceRuleId,
    activityIdentifier: current.adapter?.activityIdentifier,
  }));
  if (
    stableStringify(runtimePlan?.internalActions ?? [])
      !== stableStringify(expectedInternalActions)
  ) {
    errors.push("runtime internal-action receipts do not exactly match the compiler projection");
  }
  if (
    compilation.projection.artifacts.some(current => current.state?.concentration === true)
    && !(item.system?.properties ?? []).includes("concentration")
  ) {
    errors.push("missing concentration property");
  }
  if (
    !compilation.projection.artifacts.some(current => current.state?.concentration === true)
    && (item.system?.properties ?? []).includes("concentration")
  ) {
    errors.push("unexpected concentration property");
  }
  if (String(item.system?.ability ?? "") !== "") {
    errors.push("spell Item ability must defer to the actor spellcasting ability");
  }
  if (compilation.projection.actions.some(current => current.delivery === "declared-rider")) {
    const activeBuffRules = compilation.projection.runtimeRules.filter(current => {
      const adapter = typeof current.adapter === "string"
        ? current.adapter
        : current.adapter?.adapter;
      return adapter === "declared-active-buff-v1";
    });
    if (activeBuffRules.length > 0) {
      const contract = item.flags?.[MODULE_ID]?.declaredActiveBuff;
      const damage = activeBuffRules
        .flatMap(current => current.operations ?? [])
        .find(operation => operation.type === "damage");
      if (!contract) {
        errors.push("missing declared active-buff Item contract");
      } else if (
        !contract.requiredArtifactId
        || !contract.consumedArtifactId
        || !contract.appliedArtifactId
      ) {
        errors.push("declared active-buff contract is missing lifecycle artifacts");
      } else if (
        damage
        && stableStringify(contract.damage) !== stableStringify({
          formula: damage.formula,
          types: [...(damage.damageTypes ?? [])],
          properties: [...(damage.properties ?? [])],
        })
      ) {
        errors.push("declared active-buff damage contract does not match the compiler projection");
      }
    } else {
      const contract = item.flags?.[MODULE_ID]?.declaredWeaponSpellRider;
      if (!contract) {
        errors.push("missing declared-rider Item contract");
      } else {
        const runtimeRule = compilation.projection.runtimeRules.find(current =>
          current.id === contract.runtimeRuleId
        );
        const damage = runtimeRule?.adapter?.resolution === "post-hit-activity"
          ? null
          : runtimeRule?.operations?.find(operation => operation.type === "damage");
        if (
          !damage && !contract.saveActivityIdentifier
        ) {
          errors.push("declared rider has neither parent damage nor a hidden activity");
        } else if (
          damage
          && stableStringify(contract.damage) !== stableStringify({
              formula: damage.formula,
              types: [...(damage.damageTypes ?? [])],
              scaling: clone(damage.scaling ?? null),
            })
        ) {
          errors.push("declared-rider damage contract does not match the compiler projection");
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Invalid emitted spell Item ${item.system?.identifier}:\n- ${errors.join("\n- ")}`);
  }
  return true;
}

function compiledItemHash(item) {
  const canonical = clone(item);
  canonical.effects = [...(canonical.effects ?? [])]
    .sort((left, right) => String(left._id).localeCompare(String(right._id)));
  if (canonical.system?.activities) {
    canonical.system.activities = Object.fromEntries(
      Object.entries(canonical.system.activities)
        .sort(([left], [right]) => left.localeCompare(right)),
    );
  }
  if (Array.isArray(canonical.system?.properties)) {
    canonical.system.properties.sort();
  }
  return semanticHash(canonical);
}

export function compiledSpellItemSnapshot(item) {
  const moduleFlags = item.flags?.[MODULE_ID] ?? {};
  const providerModuleFlags = Object.fromEntries(
    Object.entries(moduleFlags).filter(([key]) =>
      ![
        "compiler",
        "declaredActiveBuff",
        "declaredWeaponSpellRider",
        "spellAutomation",
        "spellContentVersion",
      ].includes(key)
    ),
  );
  return compactObject({
    id: item.system?.identifier,
    itemId: item._id,
    name: item.name,
    compiler: clone(moduleFlags.compiler),
    spellAutomation: clone(moduleFlags.spellAutomation),
    itemHash: compiledItemHash(item),
    itemSystem: {
      level: item.system?.level,
      activation: clone(item.system?.activation),
      duration: clone(item.system?.duration),
      range: clone(item.system?.range),
      target: clone(item.system?.target),
    },
    properties: [...(item.system?.properties ?? [])].sort(),
    itemFlags: compactObject({
      module: Object.keys(providerModuleFlags).length
        ? clone(providerModuleFlags)
        : undefined,
      declaredWeaponSpellRider: clone(moduleFlags.declaredWeaponSpellRider),
      declaredActiveBuff: clone(moduleFlags.declaredActiveBuff),
      midiQol: clone(item.flags?.["midi-qol"]),
      dae: clone(item.flags?.dae),
      autoanimations: clone(item.flags?.autoanimations),
    }),
    activities: Object.values(item.system?.activities ?? {})
      .map(current => ({
        id: current._id,
        semanticActionId: current.flags?.[MODULE_ID]?.semanticActionId,
        name: current.name,
        type: current.type,
        activation: clone(current.activation),
        duration: clone(current.duration),
        target: clone(current.target),
        range: clone(current.range),
        consumption: clone(current.consumption),
        save: clone(current.save),
        attack: clone(current.attack),
        damage: clone(current.damage),
        healing: clone(current.healing),
        roll: clone(current.roll),
        effects: clone(current.effects),
        flags: clone(current.flags),
        interaction: clone(current.flags?.[MODULE_ID]?.interaction),
        availability: clone(current.flags?.[MODULE_ID]?.availability),
        midiProperties: clone(current.midiProperties),
        isOverTimeFlag: current.isOverTimeFlag,
        overTimeProperties: clone(current.overTimeProperties),
        useConditionText: current.useConditionText,
      }))
      .sort((left, right) => String(left.semanticActionId).localeCompare(String(right.semanticActionId))),
    effects: (item.effects ?? [])
      .map(current => ({
        id: current._id,
        name: current.name,
        type: current.type,
        statuses: [...(current.statuses ?? [])],
        duration: clone(current.duration),
        changes: clone(current.changes),
        flags: clone(current.flags),
        system: clone(current.system),
      }))
      .sort((left, right) => left.id.localeCompare(right.id)),
  });
}

export function createCompiledSpellSnapshot(items) {
  const spells = items
    .map(compiledSpellItemSnapshot)
    .sort((left, right) => left.id.localeCompare(right.id));
  const snapshot = {
    schemaVersion: SPELL_AUTOMATION_SCHEMA_VERSION,
    compilerVersion: SPELL_AUTOMATION_COMPILER_VERSION,
    mode: "emitter",
    spells,
  };
  return {
    ...snapshot,
    snapshotHash: semanticHash(snapshot),
    canonicalJson: stableStringify(snapshot, 2),
  };
}
