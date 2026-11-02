import {
  ARCANE_DND5E_2014_RUNTIME_PROFILE,
  resolveSpellAutomationRuntimeProfile,
} from "./spell-automation-runtime-profile.mjs";

export const CLEAN_ROOM_SPELL_SCHEMA_VERSION = 1;

const CONTENT_FIELDS = Object.freeze([
  "name",
  "description",
  "img",
  "source",
  "materialText",
  "localization",
]);
const CONTENT_FIELD_SET = new Set(CONTENT_FIELDS);
const MODULE_ID = "arcane-dnd5e-2014-automation";
const RULESETS = new Set(["2014"]);
const SCHOOLS = new Set(["abj", "con", "div", "enc", "evo", "ill", "nec", "trs"]);
const ABILITY_IDS = new Set(["str", "dex", "con", "int", "wis", "cha"]);
const SKILL_IDS = new Set([
  "acr",
  "ani",
  "arc",
  "ath",
  "dec",
  "his",
  "ins",
  "itm",
  "inv",
  "med",
  "nat",
  "prc",
  "prf",
  "per",
  "rel",
  "slt",
  "ste",
  "sur",
]);
const CONDITION_IDS = new Set([
  "blinded",
  "charmed",
  "deafened",
  "exhaustion",
  "frightened",
  "grappled",
  "incapacitated",
  "invisible",
  "paralyzed",
  "petrified",
  "poisoned",
  "prone",
  "restrained",
  "stunned",
  "unconscious",
]);
const CREATURE_TYPE_IDS = new Set([
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
const MOVEMENT_MODES = new Set(["burrow", "climb", "fly", "swim", "walk"]);
const SENSE_RANGES = new Set(["blindsight", "darkvision", "tremorsense", "truesight"]);
const DAMAGE_TYPES = new Set([
  "acid",
  "bludgeoning",
  "cold",
  "fire",
  "force",
  "lightning",
  "necrotic",
  "piercing",
  "poison",
  "psychic",
  "radiant",
  "slashing",
  "thunder",
]);
const HEALING_TYPES = new Set(["healing", "temphp"]);
const DAMAGE_PROPERTIES = new Set(["magical"]);
const BLOCKED_ACTION_KINDS = new Set(["attack", "spell", "reaction", "action"]);
const REAPPLY_POLICIES = new Set([
  "replace",
  "stack",
]);
const LOWERABLE_REAPPLY_POLICIES = new Set([
  "replace",
  "stack",
]);
const SOURCE_TERMINATION_POLICIES = new Set([
  "last-dependent-ended",
]);
const ARTIFACT_HOSTS = new Set(["actor", "item"]);
const ARTIFACT_IDENTITIES = Object.freeze({
  source: Object.freeze(["sourceUuid"]),
  "source-target": Object.freeze(["sourceUuid", "targetUuid"]),
  "source-item": Object.freeze(["sourceUuid", "itemUuid"]),
  "cast-target": Object.freeze(["castUuid", "targetUuid"]),
});
const ITEM_ENCHANTMENT_MODIFIERS = new Set([
  "grant-magical-weapon",
  "weapon-attack-and-damage-bonus",
  "weapon-attack-bonus",
  "weapon-hit-damage-rider",
  "replace-weapon-base-damage-die",
  "use-spellcasting-ability-for-weapon-attacks",
]);
const ITEM_ONLY_ENCHANTMENT_MODIFIERS = new Set([
  "grant-magical-weapon",
  "weapon-attack-and-damage-bonus",
  "weapon-attack-bonus",
  "replace-weapon-base-damage-die",
  "use-spellcasting-ability-for-weapon-attacks",
]);
const LOWERABLE_LIFECYCLE_TRIGGERS = new Set([
  "attack-roll-made:effect-target",
  "spell-cast:effect-target",
  "attack-targeted:effect-target",
  "damage-taken:effect-target",
  "turn-end:source",
  "turn-start:source",
  "turn-end:effect-target",
  "turn-start:effect-target",
  "turn-end:current-turn",
  "hit-points-depleted:effect-target",
  "temporary-hit-points-depleted:",
]);
const PROVIDER_LEAK_KEYS = new Set([
  "adapter",
  "activityFlags",
  "activityIdentifier",
  "key",
  "mode",
  "moduleFlags",
  "overTime",
  "priority",
  "provider",
]);
const PROVIDER_LEAK_STRING_PATTERNS = [
  /\b(?:mwak|rwak|msak|rsak)\b/i,
  /@item\b/i,
  /\bsystem\./i,
  /\bflags\./i,
  /\barcane-runtime\b/i,
  /\bmidi-qol\b/i,
  /\bactive-auras\b/i,
  /\baura-effects\b/i,
  /\bnative-active-effect\b/i,
  /\bdnd5e-midi-native\b/i,
  /\bActivityOverTime\b/i,
  /\b[a-z][a-z0-9-]+-v\d+\b/i,
];
const PER_SPELL_SCRIPT_EVENTS = new Set([
  "declared-rider-after-damage",
  "repeat-save-outcome",
  "typed-damage-transaction",
]);
const PER_SPELL_SCRIPT_OUTCOMES = new Set(["success", "failure"]);

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

function sourcePrimitive(kind, type, value = {}) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${kind} ${type} must be an object`);
  }
  return compactObject({
    primitive: kind,
    type,
    ...clone(value),
  });
}

export function contentRef(identifier, {
  fields = CONTENT_FIELDS,
} = {}) {
  if (!identifier) throw new Error("ContentRef requires an identifier");
  const uniqueFields = [...new Set(fields)];
  const unknown = uniqueFields.filter(field => !CONTENT_FIELD_SET.has(field));
  if (unknown.length > 0) {
    throw new Error(`ContentRef ${identifier} has unsupported fields: ${unknown.join(", ")}`);
  }
  return {
    schemaVersion: CLEAN_ROOM_SPELL_SCHEMA_VERSION,
    source: "dnd5e-item",
    identifier,
    fields: uniqueFields.sort(),
  };
}

export function instant() {
  return sourcePrimitive("lifecycle", "instant");
}

export function duration(value, units) {
  return sourcePrimitive("lifecycle", "duration", { value, units });
}

export function whileSpellActive() {
  return sourcePrimitive("lifecycle", "while-spell-active");
}

export function manual() {
  return sourcePrimitive("lifecycle", "manual");
}

export function untilTrigger(triggerValue) {
  return sourcePrimitive("lifecycle", "until-trigger", {
    trigger: clone(triggerValue),
  });
}

export function requiresSourceArtifact(artifactId) {
  return {
    type: "artifact-exists",
    artifactId,
    subject: "source",
  };
}

export function consumesSourceArtifact(artifactId) {
  return {
    type: "artifact-exists",
    artifactId,
    subject: "source",
    consumption: "one-shot",
  };
}

export function spellLifetime(durationValue = instant(), {
  concentration = false,
} = {}) {
  return {
    primitive: "spell-lifetime",
    duration: clone(durationValue),
    concentration,
  };
}

export function concentration(durationValue) {
  return spellLifetime(durationValue, { concentration: true });
}

export function spellContract({
  ruleset = "2014",
  level,
  school,
  components = {},
  material = {},
  ritual = false,
  lifetime = spellLifetime(),
  primaryActionId = "cast",
} = {}) {
  return compactObject({
    schemaVersion: CLEAN_ROOM_SPELL_SCHEMA_VERSION,
    ruleset,
    level,
    school,
    components: {
      verbal: components.verbal === undefined ? false : components.verbal,
      somatic: components.somatic === undefined ? false : components.somatic,
      material: components.material === undefined ? false : components.material,
    },
    material: {
      cost: material.cost === undefined ? 0 : material.cost,
      consumed: material.consumed === undefined ? false : material.consumed,
    },
    ritual,
    lifetime: clone(lifetime),
    primaryActionId,
  });
}

export function constant(value) {
  return sourcePrimitive("value-expression", "constant", { value });
}

export function dice(count, faces) {
  return sourcePrimitive("value-expression", "dice", { count, faces });
}

export function add(...terms) {
  return sourcePrimitive("value-expression", "add", { terms: terms.flat() });
}

export function multiply(...factors) {
  return sourcePrimitive("value-expression", "multiply", { factors: factors.flat() });
}

export function castLevel() {
  return sourcePrimitive("value-expression", "cast-level");
}

export function levelsAboveBase() {
  return sourcePrimitive("value-expression", "levels-above-base");
}

export function spellcastingModifier() {
  return sourcePrimitive("value-expression", "spellcasting-modifier");
}

export function spellAttackBonus() {
  return sourcePrimitive("value-expression", "spell-attack-bonus");
}

export function spellSaveDc() {
  return sourcePrimitive("value-expression", "spell-save-dc");
}

export function actualDamage() {
  return sourcePrimitive("value-expression", "actual-damage", {
    stage: "post-mitigation",
  });
}

export function spellScriptHandler(id, event, {
  runtimeRuleId,
  ruleId,
  artifactId,
  outcomes = [],
  authority = "primary-active-gm",
  dedupe,
  cleanupOwner,
  writes = [],
  configuration,
} = {}) {
  return compactObject({
    id,
    event,
    runtimeRuleId,
    ruleId,
    artifactId,
    outcomes: [...outcomes],
    authority,
    dedupe,
    cleanupOwner,
    writes: [...writes],
    configuration: clone(configuration),
  });
}

export function spellScript(id, {
  version = 1,
  handlers = [],
} = {}) {
  return {
    schemaVersion: 1,
    id,
    version,
    handlers: clone(handlers),
  };
}

export function perSlotAboveBase(base, increment) {
  return sourcePrimitive("value-expression", "per-slot-above-base", {
    base,
    increment,
  });
}

export function cantripProgression(base, increment) {
  return sourcePrimitive("value-expression", "cantrip-progression", {
    base,
    increment,
  });
}

export function tiers(entries, selector = castLevel()) {
  return sourcePrimitive("value-expression", "tiers", {
    selector,
    entries,
  });
}

export function roundDown(value) {
  return sourcePrimitive("value-expression", "round-down", { value });
}

export function independentProjectiles(count, {
  allocation = "optional-explicit",
  defaultTarget = "concentrate",
} = {}) {
  return sourcePrimitive("action-resolution", "independent-projectiles", {
    count,
    allocation,
    defaultTarget,
  });
}

export function operationResult(operationId, {
  value = "rolled-amount",
} = {}) {
  return sourcePrimitive("value-expression", "operation-result", {
    operationId,
    value,
  });
}

export function allAttackRolls() {
  return sourcePrimitive("selector", "all-attack-rolls");
}

export function allAbilityChecks() {
  return sourcePrimitive("selector", "all-ability-checks");
}

export function allSavingThrows() {
  return sourcePrimitive("selector", "all-saving-throws");
}

export function abilitySavingThrows(abilities) {
  return sourcePrimitive("selector", "ability-saving-throws", {
    abilities: Array.isArray(abilities) ? [...abilities] : [abilities],
  });
}

export function allWeaponHits() {
  return sourcePrimitive("selector", "all-weapon-hits");
}

export function bonus(selector, value) {
  return sourcePrimitive("modifier", "bonus", { selector, value });
}

export function optionalRollBonus(selector, value, {
  uses = 1,
  label,
} = {}) {
  return sourcePrimitive("modifier", "optional-roll-bonus", {
    selector,
    value,
    uses,
    label,
  });
}

export function grantArmorClassBonus(value) {
  return sourcePrimitive("modifier", "armor-class-bonus", { value });
}

export function grantSkillCheckBonus(skill, value) {
  return sourcePrimitive("modifier", "skill-check-bonus", { skill, value });
}

export function grantSkillCheckDisadvantage(skill) {
  return sourcePrimitive("modifier", "skill-check-disadvantage", { skill });
}

export function grantStatus(status) {
  return sourcePrimitive("modifier", "grant-status", { status });
}

export function grantConditionImmunity(condition) {
  return sourcePrimitive("modifier", "grant-condition-immunity", { condition });
}

export function grantDamageImmunity(damageType) {
  return sourcePrimitive("modifier", "grant-damage-immunity", { damageType });
}

export function setMovement(movement, value) {
  return sourcePrimitive("modifier", "set-movement", { movement, value });
}

export function increaseMovement(movement, value) {
  return sourcePrimitive("modifier", "increase-movement", { movement, value });
}

export function minimumMovement(movement, value) {
  return sourcePrimitive("modifier", "minimum-movement", { movement, value });
}

export function minimumSenseRange(sense, value) {
  return sourcePrimitive("modifier", "minimum-sense-range", { sense, value });
}

export function minimumTokenLight(bright, dim) {
  return sourcePrimitive("modifier", "minimum-token-light", { bright, dim });
}

export function setAllMovement(value) {
  return sourcePrimitive("modifier", "set-all-movement", { value });
}

export function increaseAllMovement(value) {
  return sourcePrimitive("modifier", "increase-all-movement", { value });
}

export function decreaseAllMovement(value) {
  return sourcePrimitive("modifier", "decrease-all-movement", { value });
}

export function scaleAllMovement(value) {
  return sourcePrimitive("modifier", "scale-all-movement", { value });
}

export function halveAllMovement() {
  return scaleAllMovement(constant(0.5));
}

export function grantHover() {
  return sourcePrimitive("modifier", "grant-hover");
}

export function grantResistance(damageType) {
  return sourcePrimitive("modifier", "grant-resistance", { damageType });
}

export function grantNonmagicalDamageResistance() {
  return sourcePrimitive("modifier", "grant-nonmagical-damage-resistance");
}

export function dropToOneHitPointOnDamage() {
  return sourcePrimitive("modifier", "drop-to-one-hit-point-on-damage");
}

export function blockHealing() {
  return sourcePrimitive("modifier", "block-healing");
}

export function blockVocalSpell() {
  return sourcePrimitive("modifier", "block-vocal-spell");
}

export function parentPrimaryDamageType() {
  return "parent-primary";
}

export function parameterValue(id) {
  return sourcePrimitive("parameter-reference", "action-parameter", { id });
}

export function enumParameter(id, values, {
  labels = {},
} = {}) {
  return sourcePrimitive("parameter", "enum", {
    id,
    values: [...values],
    lowering: "named-actions",
    labels: { ...labels },
  });
}

export function requiredEnumSelection(id, values, {
  labels = {},
} = {}) {
  return sourcePrimitive("parameter", "enum", {
    id,
    values: [...values],
    lowering: "runtime-required",
    labels: { ...labels },
  });
}

export function grantSavingThrowAdvantage(against) {
  return sourcePrimitive("modifier", "grant-saving-throw-advantage", {
    against: Array.isArray(against) ? [...against] : [against],
  });
}

export function grantAbilitySavingThrowAdvantage(abilities) {
  return sourcePrimitive("modifier", "grant-ability-saving-throw-advantage", {
    abilities: Array.isArray(abilities) ? [...abilities] : [abilities],
  });
}

export function grantDeathSavingThrowAdvantage() {
  return sourcePrimitive("modifier", "grant-death-saving-throw-advantage");
}

export function maximizeHealingReceived() {
  return sourcePrimitive("modifier", "maximize-healing-received");
}

export function grantAttackAdvantage(selector = allAttackRolls()) {
  return sourcePrimitive("modifier", "grant-attack-advantage", { selector });
}

export function gainAttackAdvantage(selector = allAttackRolls()) {
  return sourcePrimitive("modifier", "gain-attack-advantage", { selector });
}

export function gainAttackDisadvantage(selector = allAttackRolls()) {
  return sourcePrimitive("modifier", "gain-attack-disadvantage", { selector });
}

export function grantIncomingAttackDisadvantage({
  attackerCreatureTypes,
} = {}) {
  return sourcePrimitive("modifier", "grant-incoming-attack-disadvantage", {
    attackerCreatureTypes: [...(attackerCreatureTypes ?? [])],
  });
}

export function grantWeaponAttackDamageResistance(damageTypes, {
  weaponMagic = "any",
} = {}) {
  return sourcePrimitive(
    "modifier",
    "grant-weapon-attack-damage-resistance",
    {
      damageTypes: Array.isArray(damageTypes)
        ? [...damageTypes]
        : [damageTypes],
      weaponMagic,
    },
  );
}

export function nextTurnAttackAdvantageAgainstMarkedTarget() {
  return sourcePrimitive(
    "modifier",
    "next-turn-attack-advantage-against-marked-target",
  );
}

export function scaleJumpDistance(value) {
  return sourcePrimitive("modifier", "scale-jump-distance", { value });
}

export function grantSightDependentIncomingAttackDisadvantage() {
  return sourcePrimitive(
    "modifier",
    "grant-sight-dependent-incoming-attack-disadvantage",
  );
}

export function transformPhysicalSize({
  sizeCategorySteps,
  dimensionScale,
  weightScale,
  tokenFootprint = "from-resulting-size-category",
} = {}) {
  return sourcePrimitive("modifier", "transform-physical-size", {
    sizeCategorySteps,
    dimensionScale,
    weightScale,
    tokenFootprint,
  });
}

export function grantAbilityCheckAdvantage(abilities) {
  return sourcePrimitive("modifier", "grant-ability-check-advantage", {
    abilities: Array.isArray(abilities) ? [...abilities] : [abilities],
  });
}

export function grantAbilityCheckDisadvantage(abilities) {
  return sourcePrimitive("modifier", "grant-ability-check-disadvantage", {
    abilities: Array.isArray(abilities) ? [...abilities] : [abilities],
  });
}

export function grantAbilitySavingThrowDisadvantage(abilities) {
  return sourcePrimitive(
    "modifier",
    "grant-ability-saving-throw-disadvantage",
    {
      abilities: Array.isArray(abilities) ? [...abilities] : [abilities],
    },
  );
}

export function adjustWeaponHitDamage({
  direction,
  value,
  damageType,
  minimumTotal,
} = {}) {
  return sourcePrimitive("modifier", "adjust-weapon-hit-damage", {
    direction,
    value,
    damageType,
    minimumTotal,
  });
}

export function scaleWeaponHitDamage({
  abilities,
  multiplier,
} = {}) {
  return sourcePrimitive("modifier", "scale-weapon-hit-damage", {
    abilities: Array.isArray(abilities) ? [...abilities] : [abilities],
    multiplier,
  });
}

export function weaponHitDamageRider(value, damageType) {
  return sourcePrimitive("modifier", "weapon-hit-damage-rider", {
    selector: allWeaponHits(),
    value,
    damageType,
  });
}

export function grantMagicalWeapon() {
  return sourcePrimitive("modifier", "grant-magical-weapon");
}

export function weaponAttackAndDamageBonus(value) {
  return sourcePrimitive("modifier", "weapon-attack-and-damage-bonus", {
    value,
  });
}

export function weaponAttackBonus(value) {
  return sourcePrimitive("modifier", "weapon-attack-bonus", { value });
}

export function replaceWeaponBaseDamageDie(value) {
  return sourcePrimitive("modifier", "replace-weapon-base-damage-die", {
    value,
  });
}

export function useSpellcastingAbilityForWeaponAttacks() {
  return sourcePrimitive(
    "modifier",
    "use-spellcasting-ability-for-weapon-attacks",
  );
}

export function blockActionKinds(kinds) {
  return sourcePrimitive("modifier", "block-action-kinds", {
    kinds: [...kinds],
  });
}

export function temporaryHitPointsFromArtifact(artifactId, {
  subject = "effect-target",
} = {}) {
  return sourcePrimitive("predicate", "temporary-hit-points-from-artifact", {
    artifactId,
    subject,
  });
}

export function pairwiseWithinDistance(distance, {
  units = "ft",
} = {}) {
  return sourcePrimitive("predicate", "pairwise-within-distance", {
    distance,
    units,
  });
}

export function excludeSource() {
  return sourcePrimitive("predicate", "exclude-source");
}

export function defaultTargetSelection({
  cardinality = "any",
  polarity,
  targetPolicy,
  timing = "cast",
  includeSelf = false,
  requiresTargetCanSeeSource = false,
} = {}) {
  return sourcePrimitive("target-selection-default", "policy", {
    cardinality,
    polarity,
    targetPolicy,
    timing,
    includeSelf,
    requiresTargetCanSeeSource,
  });
}

export function ownedItem(id, {
  itemType,
  equipped,
  magical,
  attackRange,
  baseItems,
  selection = "first-stable",
} = {}) {
  const predicates = [
    sourcePrimitive("predicate", "item-type", { value: itemType }),
    sourcePrimitive("predicate", "item-equipped", { value: equipped }),
  ];
  if (magical !== undefined) {
    predicates.push(
      sourcePrimitive("predicate", "item-magical", { value: magical }),
    );
  }
  if (attackRange !== undefined) {
    predicates.push(
      sourcePrimitive("predicate", "item-attack-range", {
        value: attackRange,
      }),
    );
  }
  if (baseItems !== undefined) {
    if (!Array.isArray(baseItems) || baseItems.length === 0) {
      throw new Error("ownedItem().baseItems must be a non-empty array");
    }
    predicates.push(
      sourcePrimitive("predicate", "item-base-item-in", {
        values: [...baseItems],
      }),
    );
  }
  return {
    primitive: "target-query",
    id,
    result: "items",
    origin: {
      type: "actor-items",
      actor: "source",
    },
    evaluation: "snapshot",
    cardinality: { min: 1, max: 1 },
    predicates,
    selection: sourcePrimitive("selection", selection, {
      order: ["sort", "name", "id"],
    }),
  };
}

export function cleanRoomEffect(id, {
  host = "actor",
  scope = "source-target",
  identityKeys,
  reapply = "replace",
  name,
  img,
  markerOnly,
  disabled = false,
  transfer = false,
  modifiers = [],
  sourceTermination,
  outcomeRace,
  lifecycle = whileSpellActive(),
} = {}) {
  const keys = identityKeys ?? (
    scope === "source"
      ? ["sourceUuid"]
      : scope === "target"
        ? ["targetUuid"]
        : ["sourceUuid", "targetUuid"]
  );
  return {
    primitive: "artifact",
    id,
    kind: "effect",
    role: "mechanical",
    host,
    identity: { scope, keys },
    reapply,
    state: compactObject({
      name,
      img,
      markerOnly,
      disabled,
      transfer,
      modifiers: clone(modifiers),
      sourceTermination: clone(sourceTermination),
      outcomeRace: clone(outcomeRace),
    }),
    lifecycle: clone(lifecycle),
  };
}

/**
 * Declare one Arcane-owned summon entity without exposing Foundry Actor or
 * provider details to spell source. Every closed pool choice carries its
 * native profile cardinality. A named-action selection resolves that
 * cardinality at compile time; a one-profile spell keeps it directly.
 */
export function cleanRoomSummonedEntity(id, {
  pool,
  selection = null,
  rulesModel = "bg3-simplified",
  deltaBindings = [],
  control,
  cleanup,
  uniqueness,
  lifecycle = whileSpellActive(),
} = {}) {
  const profiles = (pool?.choices ?? []).map(choice => {
    const clonedChoice = clone(choice);
    const {
      mode,
      count,
      ...profile
    } = clonedChoice;
    return {
      ...profile,
      cardinality: { type: mode, count },
    };
  });
  const cardinality = selection === null && profiles.length === 1
    ? clone(profiles[0].cardinality)
    : { type: "profile-choice" };
  return {
    primitive: "artifact",
    id,
    kind: "entity",
    role: "mechanical",
    identity: { scope: "cast", keys: ["castId"] },
    state: compactObject({
      poolId: pool?.poolId,
      profiles,
      selection: clone(selection),
      rulesModel,
      cardinality,
      placement: { type: "native-token-placement" },
      disposition: "inherit-source",
      ownership: "unique-active-source-owner-or-gm",
      combat: "independent",
      deltaBindings: clone(deltaBindings),
      control: clone(control),
      cleanup: clone(cleanup),
      uniqueness: clone(uniqueness),
    }),
    lifecycle: clone(lifecycle),
  };
}

/**
 * Declare a time-bounded controller relationship for a native summon. The
 * relationship may expire without deleting the summoned world entity.
 */
export function nativeSummonControl({
  duration: durationValue,
  expiry,
} = {}) {
  return sourcePrimitive("summon-control", "time-bound", {
    duration: clone(durationValue),
    expiry,
  });
}

export function endSourceWhenLastDependentEnds() {
  return sourcePrimitive("source-termination", "last-dependent-ended");
}

export function outcomeRace({
  profile,
  entry,
  repeatSaveRuleId,
  successThreshold,
  failureThreshold,
  failureArtifactId,
  naturalExpiryArtifactId,
} = {}) {
  return sourcePrimitive("outcome-race", "nonconsecutive-thresholds", {
    profile,
    entry: clone(entry),
    repeatSaveRuleId,
    successThreshold,
    failureThreshold,
    failureArtifactId,
    naturalExpiryArtifactId,
  });
}

export function cleanRoomWeaponEnchantment(id, {
  name,
  img,
  modifiers = [],
  lifecycle,
} = {}) {
  return {
    primitive: "artifact",
    id,
    kind: "enchantment",
    role: "mechanical",
    host: "item",
    identity: {
      scope: "source-item",
      keys: ["sourceUuid", "itemUuid"],
    },
    reapply: "replace",
    state: compactObject({
      name,
      img,
      modifiers: clone(modifiers),
    }),
    lifecycle: clone(lifecycle),
  };
}

export function cleanRoomRangeIndicator(id, {
  sourceArtifactId,
  radius,
  units = "ft",
  color,
  opacity,
} = {}) {
  return {
    primitive: "artifact",
    id,
    kind: "visual",
    role: "presentation",
    host: "actor",
    identity: { scope: "source", keys: ["sourceUuid"] },
    reapply: "replace",
    state: compactObject({
      shape: "circle",
      radius,
      units,
      follows: "source-token",
      color,
      opacity,
    }),
    lifecycle: sourcePrimitive("lifecycle", "while-artifact", {
      artifactId: sourceArtifactId,
    }),
  };
}

export function castOriginStaticMarker(id, {
  sourceArtifactId,
  radius,
  units = "ft",
  color,
  opacity,
} = {}) {
  return {
    primitive: "artifact",
    id,
    kind: "marker",
    role: "presentation",
    identity: { scope: "cast", keys: ["castId"] },
    state: compactObject({
      anchor: "cast-origin",
      shape: { type: "radius", size: radius, units },
      stationary: true,
      color,
      opacity,
    }),
    lifecycle: sourcePrimitive("lifecycle", "while-artifact", {
      artifactId: sourceArtifactId,
    }),
  };
}

export function cleanRoomFollowingAura(id, {
  sourceArtifactId,
  radius,
  units = "ft",
  recipientPolicy,
  includeSelf,
  color,
  opacity,
} = {}) {
  return {
    primitive: "artifact",
    id,
    kind: "visual",
    role: "presentation",
    host: "actor",
    identity: { scope: "source", keys: ["sourceUuid"] },
    reapply: "replace",
    state: compactObject({
      shape: "circle",
      radius,
      units,
      follows: "source-token",
      membership: "dynamic",
      recipientPolicy,
      includeSelf,
      color,
      opacity,
    }),
    lifecycle: sourcePrimitive("lifecycle", "while-artifact", {
      artifactId: sourceArtifactId,
    }),
  };
}

function assertObject(value, path) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${path} must be an object`);
  }
}

function assertExactKeys(value, allowed, path) {
  assertObject(value, path);
  const unknown = Object.keys(value).filter(key => !allowed.includes(key));
  if (unknown.length > 0) {
    throw new Error(`${path} has unknown field(s): ${unknown.join(", ")}`);
  }
}

function assertString(value, path) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${path} must be a non-empty string`);
  }
}

function assertNumber(value, path, {
  integer = false,
  minimum = -Infinity,
} = {}) {
  if (
    typeof value !== "number"
    || !Number.isFinite(value)
    || (integer && !Number.isInteger(value))
    || value < minimum
  ) {
    throw new Error(`${path} must be ${integer ? "an integer" : "a number"} >= ${minimum}`);
  }
}

function assertProviderIsolation(value, path = "$") {
  if (Array.isArray(value)) {
    value.forEach((child, index) => assertProviderIsolation(child, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") {
    if (typeof value === "string") {
      const pattern = PROVIDER_LEAK_STRING_PATTERNS.find(candidate => candidate.test(value));
      if (pattern) throw new Error(`${path} contains provider token ${JSON.stringify(value)}`);
    }
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    const childPath = `${path}.${key}`;
    const keyPattern = PROVIDER_LEAK_STRING_PATTERNS.find(candidate => candidate.test(key));
    if (keyPattern) {
      throw new Error(`${childPath} contains provider token in field name`);
    }
    if (PROVIDER_LEAK_KEYS.has(key)) {
      throw new Error(`${childPath} is a provider-only field`);
    }
    if (key === "type" && child === "provider-change") {
      throw new Error(`${childPath} contains provider-only type provider-change`);
    }
    assertProviderIsolation(child, childPath);
  }
}

function isValueExpression(value) {
  return value?.primitive === "value-expression";
}

function validateValueExpression(value, path, {
  allowActualDamage = false,
  allowOperationResult = false,
  allowCantripProgression = false,
  allowSummonSnapshotStatistics = false,
} = {}) {
  assertExactKeys(value, {
    "constant": ["primitive", "type", "value"],
    "dice": ["primitive", "type", "count", "faces"],
    "add": ["primitive", "type", "terms"],
    "multiply": ["primitive", "type", "factors"],
    "cast-level": ["primitive", "type"],
    "levels-above-base": ["primitive", "type"],
    "spellcasting-modifier": ["primitive", "type"],
    "spell-attack-bonus": ["primitive", "type"],
    "spell-save-dc": ["primitive", "type"],
    "actual-damage": ["primitive", "type", "stage"],
    "operation-result": ["primitive", "type", "operationId", "value"],
    "per-slot-above-base": ["primitive", "type", "base", "increment"],
    "cantrip-progression": ["primitive", "type", "base", "increment"],
    "tiers": ["primitive", "type", "selector", "entries"],
    "round-down": ["primitive", "type", "value"],
  }[value?.type] ?? [], path);
  if (value.primitive !== "value-expression") {
    throw new Error(`${path}.primitive must be value-expression`);
  }
  if (value.type === "constant") {
    assertNumber(value.value, `${path}.value`);
    return;
  }
  if (value.type === "dice") {
    assertNumber(value.count, `${path}.count`, { integer: true, minimum: 1 });
    assertNumber(value.faces, `${path}.faces`, { integer: true, minimum: 2 });
    return;
  }
  if (["add", "multiply"].includes(value.type)) {
    const children = value.type === "add" ? value.terms : value.factors;
    if (!Array.isArray(children) || children.length < 2) {
      throw new Error(`${path}.${value.type === "add" ? "terms" : "factors"} requires at least two expressions`);
    }
    children.forEach((child, index) =>
      validateValueExpression(child, `${path}[${index}]`, {
        allowActualDamage,
        allowOperationResult,
        allowSummonSnapshotStatistics,
      })
    );
    return;
  }
  if (["spell-attack-bonus", "spell-save-dc"].includes(value.type)) {
    if (!allowSummonSnapshotStatistics) {
      throw new Error(
        `${path} ${value.type} is only valid in a summoned entity delta binding`,
      );
    }
    return;
  }
  if ([
    "cast-level",
    "levels-above-base",
    "spellcasting-modifier",
  ].includes(value.type)) return;
  if (value.type === "actual-damage") {
    if (!allowActualDamage) {
      throw new Error(
        `${path} actualDamage is only valid in a damage operation triggered by damage-taken, `
        + "or in a healing operation with healingFraction triggered by an attack hit",
      );
    }
    if (value.stage !== "post-mitigation") {
      throw new Error(`${path}.stage must be post-mitigation`);
    }
    return;
  }
  if (value.type === "operation-result") {
    if (!allowOperationResult) {
      throw new Error(`${path} operationResult is only valid in operation formulas`);
    }
    assertString(value.operationId, `${path}.operationId`);
    if (value.value !== "rolled-amount") {
      throw new Error(`${path}.value must be rolled-amount`);
    }
    return;
  }
  if (value.type === "per-slot-above-base") {
    validateValueExpression(value.base, `${path}.base`, {
      allowActualDamage,
      allowOperationResult,
      allowSummonSnapshotStatistics,
    });
    validateValueExpression(value.increment, `${path}.increment`, {
      allowActualDamage,
      allowOperationResult,
      allowSummonSnapshotStatistics,
    });
    return;
  }
  if (value.type === "cantrip-progression") {
    if (!allowCantripProgression) {
      throw new Error(
        `${path} cantripProgression is only valid as the top-level formula `
        + "of a damage or healing operation",
      );
    }
    validateValueExpression(value.base, `${path}.base`);
    validateValueExpression(value.increment, `${path}.increment`);
    return;
  }
  if (value.type === "tiers") {
    validateValueExpression(value.selector, `${path}.selector`, {
      allowActualDamage,
      allowOperationResult,
      allowSummonSnapshotStatistics,
    });
    if (!Array.isArray(value.entries) || value.entries.length === 0) {
      throw new Error(`${path}.entries must be a non-empty array`);
    }
    let previous = -Infinity;
    value.entries.forEach((entry, index) => {
      assertExactKeys(entry, ["minimum", "value"], `${path}.entries[${index}]`);
      assertNumber(entry.minimum, `${path}.entries[${index}].minimum`, {
        integer: true,
        minimum: 0,
      });
      if (entry.minimum <= previous) {
        throw new Error(`${path}.entries must be ordered by increasing minimum`);
      }
      previous = entry.minimum;
      validateValueExpression(entry.value, `${path}.entries[${index}].value`, {
        allowActualDamage,
        allowOperationResult,
        allowSummonSnapshotStatistics,
      });
    });
    return;
  }
  if (value.type === "round-down") {
    validateValueExpression(value.value, `${path}.value`, {
      allowActualDamage,
      allowOperationResult,
      allowSummonSnapshotStatistics,
    });
    return;
  }
  throw new Error(`${path} has unknown ValueExpression type ${value.type}`);
}

function validateSummonDeltaBinding(binding, path) {
  if (binding.slot === "spell-attack-bonus") {
    if (binding.value?.type !== "spell-attack-bonus") {
      throw new Error(`${path}.value must use spellAttackBonus()`);
    }
    return;
  }
  if (binding.slot === "spell-save-dc") {
    if (binding.value?.type !== "spell-save-dc") {
      throw new Error(`${path}.value must use spellSaveDc()`);
    }
    return;
  }
  if (binding.slot === "hit-points") {
    const isNonNegativeConstant = current =>
      current?.type === "constant"
      && Number.isFinite(current.value)
      && current.value >= 0;
    const validTieredHitPoints = binding.value?.type === "tiers"
      && binding.value.selector?.type === "cast-level"
      && (binding.value.entries ?? []).every(current =>
        isNonNegativeConstant(current.value)
      );
    if (!isNonNegativeConstant(binding.value) && !validTieredHitPoints) {
      throw new Error(
        `${path}.value must be a non-negative constant or cast-level tiers of constants`,
      );
    }
    return;
  }
  if (binding.slot === "activity-damage") {
    if (["spell-attack-bonus", "spell-save-dc"].includes(binding.value?.type)) {
      throw new Error(`${path}.value must be a roll/scaling expression`);
    }
  }
}

function validateSelector(value, path) {
  const keys = value?.type === "ability-saving-throws"
    ? ["primitive", "type", "abilities"]
    : ["primitive", "type"];
  assertExactKeys(value, keys, path);
  if (value.primitive !== "selector") throw new Error(`${path}.primitive must be selector`);
  if (![
    "all-attack-rolls",
    "all-ability-checks",
    "all-saving-throws",
    "ability-saving-throws",
    "all-weapon-hits",
  ].includes(value.type)) {
    throw new Error(`${path} has unknown selector ${value.type}`);
  }
  if (
    value.type === "ability-saving-throws"
    && (
      !Array.isArray(value.abilities)
      || value.abilities.length === 0
      || value.abilities.some(ability =>
        !["str", "dex", "con", "int", "wis", "cha"].includes(ability)
      )
      || new Set(value.abilities).size !== value.abilities.length
    )
  ) {
    throw new Error(`${path}.abilities requires unique D&D abilities`);
  }
}

function isParameterValue(value) {
  return value?.primitive === "parameter-reference"
    && value?.type === "action-parameter";
}

function validateParameterValue(value, path) {
  assertExactKeys(value, ["primitive", "type", "id"], path);
  if (!isParameterValue(value)) {
    throw new Error(`${path} must be an action parameter reference`);
  }
  assertString(value.id, `${path}.id`);
  if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(value.id)) {
    throw new Error(`${path}.id must be an action parameter identifier`);
  }
}

function validateActionParameter(value, path) {
  assertExactKeys(
    value,
    ["primitive", "type", "id", "values", "lowering", "labels"],
    path,
  );
  if (value.primitive !== "parameter" || value.type !== "enum") {
    throw new Error(`${path} must be an enum parameter`);
  }
  assertString(value.id, `${path}.id`);
  if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(value.id)) {
    throw new Error(`${path}.id must be an action parameter identifier`);
  }
  if (
    !Array.isArray(value.values)
    || value.values.length === 0
    || value.values.some(entry => typeof entry !== "string" || entry.length === 0)
    || new Set(value.values).size !== value.values.length
  ) {
    throw new Error(`${path}.values requires unique non-empty strings`);
  }
  if (value.values.some(entry => !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(entry))) {
    throw new Error(`${path}.values must be safe action identifier segments`);
  }
  if (!["named-actions", "runtime-required"].includes(value.lowering)) {
    throw new Error(
      `${path}.lowering must be named-actions or runtime-required`,
    );
  }
  assertObject(value.labels, `${path}.labels`);
  const unknownLabels = Object.keys(value.labels).filter(key => !value.values.includes(key));
  if (unknownLabels.length > 0) {
    throw new Error(`${path}.labels has keys outside values: ${unknownLabels.join(", ")}`);
  }
  for (const [key, label] of Object.entries(value.labels)) {
    assertString(label, `${path}.labels.${key}`);
  }
}

function validateModifier(value, path) {
  const allowed = {
    "bonus": ["primitive", "type", "selector", "value"],
    "optional-roll-bonus": [
      "primitive",
      "type",
      "selector",
      "value",
      "uses",
      "label",
    ],
    "armor-class-bonus": ["primitive", "type", "value"],
    "skill-check-bonus": ["primitive", "type", "skill", "value"],
    "skill-check-disadvantage": ["primitive", "type", "skill"],
    "grant-status": ["primitive", "type", "status"],
    "grant-condition-immunity": ["primitive", "type", "condition"],
    "grant-damage-immunity": ["primitive", "type", "damageType"],
    "set-movement": ["primitive", "type", "movement", "value"],
    "increase-movement": ["primitive", "type", "movement", "value"],
    "minimum-movement": ["primitive", "type", "movement", "value"],
    "minimum-sense-range": ["primitive", "type", "sense", "value"],
    "minimum-token-light": ["primitive", "type", "bright", "dim"],
    "set-all-movement": ["primitive", "type", "value"],
    "increase-all-movement": ["primitive", "type", "value"],
    "decrease-all-movement": ["primitive", "type", "value"],
    "scale-all-movement": ["primitive", "type", "value"],
    "grant-hover": ["primitive", "type"],
    "grant-resistance": ["primitive", "type", "damageType"],
    "grant-nonmagical-damage-resistance": ["primitive", "type"],
    "drop-to-one-hit-point-on-damage": ["primitive", "type"],
    "block-healing": ["primitive", "type"],
    "block-vocal-spell": ["primitive", "type"],
    "grant-saving-throw-advantage": ["primitive", "type", "against"],
    "grant-ability-saving-throw-advantage": ["primitive", "type", "abilities"],
    "grant-death-saving-throw-advantage": ["primitive", "type"],
    "maximize-healing-received": ["primitive", "type"],
    "grant-attack-advantage": ["primitive", "type", "selector"],
    "gain-attack-advantage": ["primitive", "type", "selector"],
    "gain-attack-disadvantage": ["primitive", "type", "selector"],
    "grant-incoming-attack-disadvantage": [
      "primitive",
      "type",
      "attackerCreatureTypes",
    ],
    "grant-weapon-attack-damage-resistance": [
      "primitive",
      "type",
      "damageTypes",
      "weaponMagic",
    ],
    "next-turn-attack-advantage-against-marked-target": [
      "primitive",
      "type",
    ],
    "scale-jump-distance": ["primitive", "type", "value"],
    "grant-sight-dependent-incoming-attack-disadvantage": [
      "primitive",
      "type",
    ],
    "transform-physical-size": [
      "primitive",
      "type",
      "sizeCategorySteps",
      "dimensionScale",
      "weightScale",
      "tokenFootprint",
    ],
    "grant-ability-check-advantage": [
      "primitive",
      "type",
      "abilities",
    ],
    "grant-ability-check-disadvantage": [
      "primitive",
      "type",
      "abilities",
    ],
    "grant-ability-saving-throw-disadvantage": [
      "primitive",
      "type",
      "abilities",
    ],
    "adjust-weapon-hit-damage": [
      "primitive",
      "type",
      "direction",
      "value",
      "damageType",
      "minimumTotal",
    ],
    "scale-weapon-hit-damage": [
      "primitive",
      "type",
      "abilities",
      "multiplier",
    ],
    "weapon-hit-damage-rider": [
      "primitive",
      "type",
      "selector",
      "value",
      "damageType",
    ],
    "grant-magical-weapon": ["primitive", "type"],
    "weapon-attack-and-damage-bonus": ["primitive", "type", "value"],
    "weapon-attack-bonus": ["primitive", "type", "value"],
    "replace-weapon-base-damage-die": ["primitive", "type", "value"],
    "use-spellcasting-ability-for-weapon-attacks": ["primitive", "type"],
    "block-action-kinds": ["primitive", "type", "kinds"],
  };
  assertExactKeys(value, allowed[value?.type] ?? [], path);
  if (value.primitive !== "modifier") throw new Error(`${path}.primitive must be modifier`);
  if (!allowed[value.type]) throw new Error(`${path} has unknown modifier ${value.type}`);
  if (value.selector) validateSelector(value.selector, `${path}.selector`);
  if (
    value.type === "bonus"
    && ![
      "all-attack-rolls",
      "all-ability-checks",
      "all-saving-throws",
      "ability-saving-throws",
    ].includes(value.selector?.type)
  ) {
    throw new Error(
      `${path}.selector ${value.selector?.type ?? "<missing>"} is not compatible with bonus`,
    );
  }
  if (
    value.type === "optional-roll-bonus"
    && !["all-ability-checks", "all-saving-throws"].includes(
      value.selector?.type,
    )
  ) {
    throw new Error(
      `${path}.selector ${value.selector?.type ?? "<missing>"} is not compatible `
      + "with optional-roll-bonus",
    );
  }
  if (
    [
      "grant-attack-advantage",
      "gain-attack-advantage",
      "gain-attack-disadvantage",
    ].includes(value.type)
    && value.selector?.type !== "all-attack-rolls"
  ) {
    throw new Error(
      `${path} ${value.type} has incompatible selector `
      + (value.selector?.type ?? "<missing>"),
    );
  }
  if (value.type === "grant-incoming-attack-disadvantage") {
    if (
      !Array.isArray(value.attackerCreatureTypes)
      || value.attackerCreatureTypes.length === 0
      || value.attackerCreatureTypes.some(type => !CREATURE_TYPE_IDS.has(type))
      || new Set(value.attackerCreatureTypes).size !== value.attackerCreatureTypes.length
    ) {
      throw new Error(
        `${path}.attackerCreatureTypes requires unique standard D&D creature types`,
      );
    }
  }
  if (value.type === "grant-weapon-attack-damage-resistance") {
    if (
      !Array.isArray(value.damageTypes)
      || value.damageTypes.length === 0
      || value.damageTypes.some(type => !DAMAGE_TYPES.has(type))
      || new Set(value.damageTypes).size !== value.damageTypes.length
    ) {
      throw new Error(
        `${path}.damageTypes requires unique standard D&D damage types`,
      );
    }
    if (!["any", "nonmagical"].includes(value.weaponMagic)) {
      throw new Error(
        `${path}.weaponMagic must be any or nonmagical`,
      );
    }
  }
  if (
    value.type === "weapon-hit-damage-rider"
    && value.selector?.type !== "all-weapon-hits"
  ) {
    throw new Error(
      `${path}.selector ${value.selector?.type ?? "<missing>"} is not compatible with `
      + "weapon-hit-damage-rider",
    );
  }
  if ([
    "bonus",
    "optional-roll-bonus",
    "armor-class-bonus",
    "skill-check-bonus",
    "set-movement",
    "increase-movement",
    "minimum-movement",
    "minimum-sense-range",
    "set-all-movement",
    "increase-all-movement",
    "decrease-all-movement",
    "scale-all-movement",
    "weapon-hit-damage-rider",
    "weapon-attack-and-damage-bonus",
    "weapon-attack-bonus",
    "replace-weapon-base-damage-die",
    "scale-jump-distance",
    "adjust-weapon-hit-damage",
  ].includes(value.type)) {
    validateValueExpression(value.value, `${path}.value`);
  }
  if (value.type === "minimum-token-light") {
    validateValueExpression(value.bright, `${path}.bright`);
    validateValueExpression(value.dim, `${path}.dim`);
    if (
      value.bright.type !== "constant"
      || value.dim.type !== "constant"
      || value.bright.value < 0
      || value.dim.value <= 0
      || value.dim.value < value.bright.value
    ) {
      throw new Error(
        `${path} requires constant light radii with dim > 0 and dim >= bright >= 0`,
      );
    }
  }
  if (value.type === "scale-weapon-hit-damage") {
    if (
      !Array.isArray(value.abilities)
      || value.abilities.length === 0
      || value.abilities.some(ability => !ABILITY_IDS.has(ability))
      || new Set(value.abilities).size !== value.abilities.length
    ) {
      throw new Error(
        `${path}.abilities requires unique D&D abilities from str, dex, con, int, wis, cha`,
      );
    }
    validateValueExpression(value.multiplier, `${path}.multiplier`);
    if (
      value.multiplier.type !== "constant"
      || value.multiplier.value <= 0
      || value.multiplier.value > 1
    ) {
      throw new Error(`${path}.multiplier must be a constant above 0 and at most 1`);
    }
  }
  if (
    value.type === "replace-weapon-base-damage-die"
    && (
      value.value.type !== "dice"
      || Number(value.value.count) !== 1
      || !Number.isInteger(Number(value.value.faces))
      || Number(value.value.faces) <= 0
    )
  ) {
    throw new Error(`${path}.value must be one positive damage die`);
  }
  if (value.type === "transform-physical-size") {
    assertNumber(value.sizeCategorySteps, `${path}.sizeCategorySteps`, {
      integer: true,
    });
    if (![-1, 1].includes(value.sizeCategorySteps)) {
      throw new Error(`${path}.sizeCategorySteps must be -1 or 1`);
    }
    validateValueExpression(
      value.dimensionScale,
      `${path}.dimensionScale`,
    );
    validateValueExpression(value.weightScale, `${path}.weightScale`);
    if (
      value.dimensionScale.type !== "constant"
      || value.dimensionScale.value <= 0
      || value.weightScale.type !== "constant"
      || value.weightScale.value <= 0
    ) {
      throw new Error(
        `${path} dimensionScale and weightScale must be positive constants`,
      );
    }
    if (value.tokenFootprint !== "from-resulting-size-category") {
      throw new Error(
        `${path}.tokenFootprint must be from-resulting-size-category`,
      );
    }
  }
  if ([
    "grant-ability-check-advantage",
    "grant-ability-check-disadvantage",
    "grant-ability-saving-throw-disadvantage",
  ].includes(value.type)) {
    const parameterized =
      value.type === "grant-ability-check-disadvantage"
      && Array.isArray(value.abilities)
      && value.abilities.length === 1
      && isParameterValue(value.abilities[0]);
    if (
      !Array.isArray(value.abilities)
      || value.abilities.length === 0
      || (!parameterized && value.abilities.some(ability => !ABILITY_IDS.has(ability)))
      || new Set(value.abilities).size !== value.abilities.length
    ) {
      throw new Error(
        `${path}.abilities requires unique D&D abilities from str, dex, con, int, wis, cha`,
      );
    }
    if (parameterized) {
      validateParameterValue(value.abilities[0], `${path}.abilities[0]`);
    }
  }
  if (value.type === "adjust-weapon-hit-damage") {
    if (!["add", "subtract"].includes(value.direction)) {
      throw new Error(`${path}.direction must be add or subtract`);
    }
    if (
      value.damageType !== "parent-primary"
      && !DAMAGE_TYPES.has(value.damageType)
    ) {
      throw new Error(`${path}.damageType has unsupported damage type`);
    }
    if (value.minimumTotal !== undefined) {
      validateValueExpression(value.minimumTotal, `${path}.minimumTotal`);
      if (
        value.minimumTotal.type !== "constant"
        || value.minimumTotal.value < 0
      ) {
        throw new Error(
          `${path}.minimumTotal must be a non-negative constant`,
        );
      }
    }
    if (value.direction === "add" && value.minimumTotal !== undefined) {
      throw new Error(`${path}.minimumTotal is only valid for subtract`);
    }
  }
  if (value.type === "optional-roll-bonus") {
    assertNumber(value.uses, `${path}.uses`, {
      integer: true,
      minimum: 1,
    });
    assertString(value.label, `${path}.label`);
  }
  if (
    ["skill-check-bonus", "skill-check-disadvantage"].includes(value.type)
    && !SKILL_IDS.has(value.skill)
  ) {
    throw new Error(`${path}.skill has unsupported D&D skill ${value.skill}`);
  }
  if (
    ["increase-movement", "increase-all-movement", "decrease-all-movement"].includes(value.type)
    && (
      value.value.type !== "constant"
      || value.value.value <= 0
    )
  ) {
    throw new Error(`${path}.value must be a positive constant`);
  }
  if (
    value.type === "scale-all-movement"
    && (
      value.value.type !== "constant"
      || value.value.value < 0
    )
  ) {
    throw new Error(`${path}.value must be a non-negative constant`);
  }
  if (
    ["set-movement", "increase-movement", "minimum-movement"].includes(value.type)
    && !MOVEMENT_MODES.has(value.movement)
  ) {
    throw new Error(`${path}.movement has unsupported movement mode ${value.movement}`);
  }
  if (value.type === "minimum-sense-range" && !SENSE_RANGES.has(value.sense)) {
    throw new Error(`${path}.sense has unsupported sense range ${value.sense}`);
  }
  if (value.type === "grant-status") assertString(value.status, `${path}.status`);
  if (value.type === "grant-condition-immunity") {
    if (!CONDITION_IDS.has(value.condition)) {
      throw new Error(`${path}.condition must be a standard D&D condition`);
    }
  }
  if (
    value.type === "grant-damage-immunity"
    && !DAMAGE_TYPES.has(value.damageType)
  ) {
    throw new Error(
      `${path}.damageType has unsupported damage type ${value.damageType}`,
    );
  }
  if (
    ["grant-resistance", "weapon-hit-damage-rider"].includes(value.type)
    && isParameterValue(value.damageType)
  ) {
    validateParameterValue(value.damageType, `${path}.damageType`);
  } else if (
    ["grant-resistance", "weapon-hit-damage-rider"].includes(value.type)
    && !DAMAGE_TYPES.has(value.damageType)
  ) {
    throw new Error(`${path}.damageType has unsupported damage type ${value.damageType}`);
  }
  if (value.type === "grant-saving-throw-advantage") {
    if (
      !Array.isArray(value.against)
      || value.against.length === 0
      || value.against.some(entry => typeof entry !== "string" || entry.length === 0)
      || new Set(value.against).size !== value.against.length
    ) {
      throw new Error(`${path}.against requires unique non-empty semantic categories`);
    }
    if (value.against.some(entry => entry !== "poison")) {
      throw new Error(`${path}.against only supports poison in Runtime Profile version 1`);
    }
  }
  if (value.type === "grant-ability-saving-throw-advantage") {
    if (
      !Array.isArray(value.abilities)
      || value.abilities.length === 0
      || value.abilities.some(ability => !ABILITY_IDS.has(ability))
      || new Set(value.abilities).size !== value.abilities.length
    ) {
      throw new Error(
        `${path}.abilities requires unique D&D abilities from str, dex, con, int, wis, cha`,
      );
    }
  }
  if (value.type === "block-action-kinds") {
    if (
      !Array.isArray(value.kinds)
      || value.kinds.length === 0
      || value.kinds.some(kind => !BLOCKED_ACTION_KINDS.has(kind))
      || new Set(value.kinds).size !== value.kinds.length
    ) {
      throw new Error(`${path}.kinds requires unique attack/spell/reaction/action values`);
    }
  }
}

function validateLifecycle(value, path, {
  allowWhileSpellActive = true,
} = {}) {
  const allowed = {
    "instant": ["primitive", "type"],
    "duration": ["primitive", "type", "value", "units"],
    "while-spell-active": ["primitive", "type"],
    "while-artifact": ["primitive", "type", "artifactId"],
    "first-of": ["primitive", "type", "values"],
    "until-trigger": ["primitive", "type", "trigger"],
    "workflow": ["primitive", "type"],
    "manual": ["primitive", "type"],
  };
  assertExactKeys(value, allowed[value?.type] ?? [], path);
  if (!allowed[value.type]) throw new Error(`${path} has unknown lifecycle ${value.type}`);
  if (value.type === "while-spell-active" && !allowWhileSpellActive) {
    throw new Error(`${path} cannot reference whileSpellActive here`);
  }
  if (value.type === "duration") {
    if (isValueExpression(value.value)) {
      throw new Error(
        `${path}.value dynamic duration expressions are not supported by clean-room P0`,
      );
    } else {
      assertNumber(value.value, `${path}.value`, { minimum: 0 });
    }
    if (!["seconds", "rounds", "minutes", "hours", "days"].includes(value.units)) {
      throw new Error(`${path}.units has unsupported duration unit ${value.units}`);
    }
  }
  if (value.type === "while-artifact") assertString(value.artifactId, `${path}.artifactId`);
  if (value.type === "first-of") {
    if (!Array.isArray(value.values) || value.values.length < 2) {
      throw new Error(`${path}.values requires at least two lifecycles`);
    }
    value.values.forEach((child, index) =>
      validateLifecycle(child, `${path}.values[${index}]`, { allowWhileSpellActive })
    );
  }
  if (value.type === "until-trigger") {
    validateTrigger(value.trigger, `${path}.trigger`);
    const triggerKey = `${value.trigger.type}:${value.trigger.subject ?? ""}`;
    if (!LOWERABLE_LIFECYCLE_TRIGGERS.has(triggerKey)) {
      throw new Error(
        `${path}.trigger ${triggerKey} has no clean-room lifecycle lowering`,
      );
    }
  }
}

function lifecycleContains(value, type) {
  if (value?.type === type) return true;
  if (value?.type === "first-of") {
    return value.values.some(child => lifecycleContains(child, type));
  }
  return false;
}

const TRIGGER_KEYS = {
  "action-used": ["primitive", "type", "actionId"],
  "operation-outcome": ["primitive", "type", "operationId", "outcome"],
  "operation-complete": ["primitive", "type", "operationId"],
  "turn-start": ["primitive", "type", "subject"],
  "turn-end": ["primitive", "type", "subject", "occurrence"],
  "enter": ["primitive", "type", "zoneId"],
  "leave": ["primitive", "type", "zoneId"],
  "damage-taken": ["primitive", "type", "subject"],
  "hit-points-depleted": ["primitive", "type", "subject"],
  "attack-roll-config": ["primitive", "type"],
  "artifact-created": ["primitive", "type", "artifactId"],
  "artifact-deleted": ["primitive", "type", "artifactId"],
  "artifact-depleted": ["primitive", "type", "artifactId"],
  "temporary-hit-points-depleted": ["primitive", "type", "artifactId"],
  "attack-targeted": ["primitive", "type", "subject"],
  "attack-roll-made": ["primitive", "type", "subject"],
  "spell-cast": ["primitive", "type", "subject"],
};

function validateTrigger(value, path) {
  assertExactKeys(value, TRIGGER_KEYS[value?.type] ?? [], path);
  if (!TRIGGER_KEYS[value.type]) throw new Error(`${path} has unknown trigger ${value.type}`);
  if (value.primitive !== "trigger") throw new Error(`${path}.primitive must be trigger`);
  if (["action-used"].includes(value.type)) {
    assertString(value.actionId, `${path}.actionId`);
  }
  if (["operation-outcome", "operation-complete"].includes(value.type)) {
    assertString(value.operationId, `${path}.operationId`);
  }
  if (value.type === "operation-outcome") {
    if (!["success", "failure", "hit", "miss"].includes(value.outcome)) {
      throw new Error(`${path}.outcome is unsupported`);
    }
  }
  if ([
    "turn-start",
    "turn-end",
    "damage-taken",
    "hit-points-depleted",
    "attack-targeted",
    "attack-roll-made",
    "spell-cast",
  ].includes(value.type)) {
    assertString(value.subject, `${path}.subject`);
  }
  if (value.occurrence !== undefined) {
    if (
      value.type !== "turn-end"
      || value.occurrence !== "next-after-created"
      || !["source", "effect-target"].includes(value.subject)
    ) {
      throw new Error(
        `${path}.occurrence only supports source/effect-target turn-end next-after-created`,
      );
    }
  }
  if (["enter", "leave"].includes(value.type)) assertString(value.zoneId, `${path}.zoneId`);
  if (["artifact-created", "artifact-deleted", "artifact-depleted", "temporary-hit-points-depleted"].includes(value.type)) {
    assertString(value.artifactId, `${path}.artifactId`);
  }
}

const PREDICATE_KEYS = {
  "within-range": ["primitive", "type", "distance", "units", "from"],
  "pairwise-within-distance": ["primitive", "type", "distance", "units"],
  "exclude-source": ["primitive", "type"],
  "target-kind": ["primitive", "type", "value"],
  "item-type": ["primitive", "type", "value"],
  "item-equipped": ["primitive", "type", "value"],
  "item-magical": ["primitive", "type", "value"],
  "item-attack-range": ["primitive", "type", "value"],
  "item-base-item-in": ["primitive", "type", "values"],
  "disposition": ["primitive", "type", "value"],
  "artifact-exists": ["primitive", "type", "artifactId", "subject"],
  "any-artifact-exists": ["primitive", "type", "artifactIds", "subject"],
  "artifact-source-matches": [
    "primitive",
    "type",
    "artifactId",
    "subject",
    "source",
  ],
  "attack-kind": ["primitive", "type", "value"],
  "declared": ["primitive", "type"],
  "damage-applied": ["primitive", "type", "minimum"],
  "creature-type": ["primitive", "type", "value"],
  "opposing-disposition": ["primitive", "type"],
  "visible-to-source": ["primitive", "type"],
  "can-see-source": ["primitive", "type"],
  "once-per-turn": ["primitive", "type", "identity"],
  "temporary-hit-points-from-artifact": [
    "primitive",
    "type",
    "artifactId",
    "subject",
  ],
  "input-selection-equals": ["primitive", "type", "id", "value"],
  "willing": ["primitive", "type"],
};

function validatePredicate(value, path) {
  assertExactKeys(value, PREDICATE_KEYS[value?.type] ?? [], path);
  if (!PREDICATE_KEYS[value.type]) throw new Error(`${path} has unknown predicate ${value.type}`);
  if (value.primitive !== "predicate") throw new Error(`${path}.primitive must be predicate`);
  if (value.type === "within-range") {
    if (value.distance !== null) {
      assertNumber(value.distance, `${path}.distance`, { minimum: 0 });
    }
    if (!["ft", "mi", "self", "touch", "spec"].includes(value.units)) {
      throw new Error(`${path}.units is unsupported`);
    }
    if (!["source", "target"].includes(value.from)) {
      throw new Error(`${path}.from is unsupported`);
    }
  }
  if (value.type === "pairwise-within-distance") {
    assertNumber(value.distance, `${path}.distance`, { minimum: 0 });
    if (value.distance <= 0) {
      throw new Error(`${path}.distance must be greater than 0`);
    }
    if (value.units !== "ft") {
      throw new Error(`${path}.units currently supports only ft`);
    }
  }
  if ([
    "target-kind",
    "item-type",
    "item-attack-range",
    "disposition",
    "attack-kind",
    "creature-type",
  ].includes(value.type)) {
    assertString(value.value, `${path}.value`);
  }
  if (
    value.type === "item-attack-range"
    && value.value !== "melee"
  ) {
    throw new Error(`${path}.value currently supports only melee`);
  }
  if (
    value.type === "item-base-item-in"
    && (
      !Array.isArray(value.values)
      || value.values.length === 0
      || value.values.some(current =>
        typeof current !== "string"
        || !/^[a-z0-9][a-z0-9-]*$/.test(current)
      )
      || new Set(value.values).size !== value.values.length
    )
  ) {
    throw new Error(`${path}.values requires unique base item identifiers`);
  }
  if (value.type === "input-selection-equals") {
    assertString(value.id, `${path}.id`);
    assertString(value.value, `${path}.value`);
  }
  if (
    ["item-equipped", "item-magical"].includes(value.type)
    && typeof value.value !== "boolean"
  ) {
    throw new Error(`${path}.value must be a boolean`);
  }
  if (value.type === "damage-applied" && value.minimum !== undefined) {
    assertNumber(value.minimum, `${path}.minimum`, { minimum: 0 });
    if (value.minimum !== 1) {
      throw new Error(
        `${path}.minimum currently supports exactly 1 because the runtime adapter only distinguishes positive damage`,
      );
    }
  }
  if (["artifact-exists", "any-artifact-exists", "artifact-source-matches"].includes(value.type)) {
    if (value.type === "artifact-exists") {
      assertString(value.artifactId, `${path}.artifactId`);
    } else if (value.type === "artifact-source-matches") {
      assertString(value.artifactId, `${path}.artifactId`);
      assertString(value.source, `${path}.source`);
      if (value.source !== "source") {
        throw new Error(`${path}.source currently supports only source`);
      }
    } else if (
      !Array.isArray(value.artifactIds)
      || value.artifactIds.length === 0
      || value.artifactIds.some(id => typeof id !== "string" || !id)
    ) {
      throw new Error(`${path}.artifactIds must contain artifact identifiers`);
    }
    assertString(value.subject, `${path}.subject`);
  }
  if (value.type === "once-per-turn") assertString(value.identity, `${path}.identity`);
  if (value.type === "temporary-hit-points-from-artifact") {
    assertString(value.artifactId, `${path}.artifactId`);
    assertString(value.subject, `${path}.subject`);
  }
}

function spatialExpressionMinimum(value) {
  if (!isValueExpression(value)) return Number(value);
  switch (value.type) {
    case "constant":
      return Number(value.value);
    case "cast-level":
      return 1;
    case "levels-above-base":
      return 0;
    case "add":
      return value.terms.reduce(
        (total, term) => total + spatialExpressionMinimum(term),
        0,
      );
    case "multiply":
      return value.factors.reduce(
        (total, factor) => total * spatialExpressionMinimum(factor),
        1,
      );
    case "per-slot-above-base":
      return spatialExpressionMinimum(value.base);
    case "round-down":
      return Math.floor(spatialExpressionMinimum(value.value));
    default:
      throw new Error(
        `Spatial ValueExpression cannot use ${value.type}; use deterministic `
        + "constant/cast-level arithmetic",
      );
  }
}

function validateNonNegativeSpatialExpression(value, path) {
  if (!isValueExpression(value)) {
    assertNumber(value, path, { minimum: 0 });
    return;
  }
  switch (value.type) {
    case "constant":
      assertNumber(value.value, `${path}.value`, { minimum: 0 });
      return;
    case "cast-level":
    case "levels-above-base":
      return;
    case "add":
      value.terms.forEach((term, index) =>
        validateNonNegativeSpatialExpression(term, `${path}.terms[${index}]`)
      );
      return;
    case "multiply":
      value.factors.forEach((factor, index) =>
        validateNonNegativeSpatialExpression(factor, `${path}.factors[${index}]`)
      );
      return;
    case "per-slot-above-base":
      validateNonNegativeSpatialExpression(value.base, `${path}.base`);
      validateNonNegativeSpatialExpression(value.increment, `${path}.increment`);
      return;
    case "round-down":
      validateNonNegativeSpatialExpression(value.value, `${path}.value`);
      return;
    default:
      throw new Error(
        `${path} cannot use ${value.type}; spatial values require deterministic `
        + "non-negative constant/cast-level arithmetic",
      );
  }
}

function validateSpatialValue(value, path, {
  strictlyPositive = false,
} = {}) {
  if (isValueExpression(value)) {
    validateValueExpression(value, path);
  } else {
    assertNumber(value, path, { minimum: 0 });
  }
  validateNonNegativeSpatialExpression(value, path);
  const minimum = spatialExpressionMinimum(value);
  if (!Number.isFinite(minimum) || minimum < 0) {
    throw new Error(`${path} must remain non-negative at every legal cast level`);
  }
  if (strictlyPositive && !(minimum > 0)) {
    throw new Error(`${path} must remain greater than 0 at every legal cast level`);
  }
}

function validateTargetOrigin(value, path) {
  const allowed = {
    "self": ["type"],
    "selected": ["type"],
    "actor-items": ["type", "actor"],
    "placed-template": ["type", "shape"],
    "placed-point": ["type"],
    "event-binding": ["type", "name"],
    "event-neighborhood": [
      "type",
      "anchor",
      "radius",
      "units",
      "includeAnchor",
    ],
    "artifact": ["type", "artifactId"],
  };
  assertExactKeys(value, allowed[value?.type] ?? [], path);
  if (!allowed[value.type]) throw new Error(`${path} has unknown target origin ${value.type}`);
  if (value.type === "actor-items" && value.actor !== "source") {
    throw new Error(`${path}.actor currently supports only source`);
  }
  if (value.type === "event-binding") assertString(value.name, `${path}.name`);
  if (value.type === "event-neighborhood") {
    if (value.anchor !== "target") {
      throw new Error(`${path}.anchor currently supports only target`);
    }
    assertNumber(value.radius, `${path}.radius`, { minimum: 0 });
    if (!(value.radius > 0)) {
      throw new Error(`${path}.radius must be greater than 0`);
    }
    if (!["ft", "mi"].includes(value.units)) {
      throw new Error(`${path}.units is unsupported`);
    }
    if (typeof value.includeAnchor !== "boolean") {
      throw new Error(`${path}.includeAnchor must be a boolean`);
    }
  }
  if (value.type === "artifact") assertString(value.artifactId, `${path}.artifactId`);
  if (value.type === "placed-template") {
    assertExactKeys(
      value.shape,
      ["type", "size", "width", "height", "units"],
      `${path}.shape`,
    );
    if (![
      "circle",
      "cone",
      "cube",
      "cylinder",
      "line",
      "radius",
      "rect",
      "sphere",
      "square",
      "squareRadius",
      "wall",
    ].includes(
      value.shape.type,
    )) {
      throw new Error(`${path}.shape.type is unsupported`);
    }
    validateSpatialValue(
      value.shape.size,
      `${path}.shape.size`,
      { strictlyPositive: true },
    );
    for (const key of ["width", "height"]) {
      if (value.shape[key] !== null && value.shape[key] !== undefined) {
        validateSpatialValue(
          value.shape[key],
          `${path}.shape.${key}`,
          { strictlyPositive: true },
        );
      }
    }
    if (
      value.shape.type === "cylinder"
      && (value.shape.height === null || value.shape.height === undefined)
    ) {
      throw new Error(`${path}.shape.height is required for cylinder`);
    }
    if (
      value.shape.type === "line"
      && (value.shape.width === null || value.shape.width === undefined)
    ) {
      throw new Error(`${path}.shape.width is required for line`);
    }
    if (
      value.shape.type === "sphere"
      && value.shape.height !== null
      && value.shape.height !== undefined
    ) {
      throw new Error(`${path}.shape.height is not allowed for sphere`);
    }
    if (!["ft", "mi"].includes(value.shape.units)) {
      throw new Error(`${path}.shape.units is unsupported`);
    }
  }
}

function validateTargetQuery(value, path) {
  assertExactKeys(
    value,
    [
      "primitive",
      "id",
      "result",
      "origin",
      "evaluation",
      "cardinality",
      "predicates",
      "selection",
    ],
    path,
  );
  if (value.primitive !== "target-query") {
    throw new Error(`${path}.primitive must be target-query`);
  }
  assertString(value.id, `${path}.id`);
  if (!["tokens", "point", "template-members", "source", "items"].includes(value.result)) {
    throw new Error(`${path}.result is unsupported`);
  }
  if (!["snapshot", "live"].includes(value.evaluation)) {
    throw new Error(`${path}.evaluation is unsupported`);
  }
  validateTargetOrigin(value.origin, `${path}.origin`);
  assertExactKeys(value.cardinality, ["min", "max"], `${path}.cardinality`);
  for (const [key, cardinality] of Object.entries(value.cardinality)) {
    if (isValueExpression(cardinality)) {
      validateValueExpression(cardinality, `${path}.cardinality.${key}`);
    } else if (cardinality !== "any") {
      assertNumber(cardinality, `${path}.cardinality.${key}`, { minimum: 0 });
    }
  }
  if (!Array.isArray(value.predicates)) throw new Error(`${path}.predicates must be an array`);
  value.predicates.forEach((current, index) =>
    validatePredicate(current, `${path}.predicates[${index}]`)
  );
  const itemPredicateTypes = new Set([
    "item-type",
    "item-equipped",
    "item-magical",
    "item-attack-range",
    "item-base-item-in",
  ]);
  if (value.origin.type === "actor-items") {
    if (
      value.result !== "items"
      || value.evaluation !== "snapshot"
      || value.cardinality.min !== 1
      || value.cardinality.max !== 1
    ) {
      throw new Error(
        `${path} actor-items requires one snapshot item result`,
      );
    }
    assertExactKeys(
      value.selection,
      ["primitive", "type", "order"],
      `${path}.selection`,
    );
    if (
      value.selection.primitive !== "selection"
      || value.selection.type !== "first-stable"
      || !Array.isArray(value.selection.order)
      || value.selection.order.join(",") !== "sort,name,id"
    ) {
      throw new Error(
        `${path}.selection must be first-stable ordered by sort, name, id`,
      );
    }
    const predicates = new Map(value.predicates.map(current => [current.type, current]));
    const allowedPredicateTypes = new Set([
      "item-type",
      "item-equipped",
      "item-magical",
      "item-attack-range",
      "item-base-item-in",
    ]);
    if (
      value.predicates.length < 2
      || value.predicates.length > 5
      || value.predicates.some(current =>
        !allowedPredicateTypes.has(current.type)
      )
      || predicates.size !== value.predicates.length
      || predicates.get("item-type")?.value !== "weapon"
      || predicates.get("item-equipped")?.value !== true
      || (
        predicates.has("item-attack-range")
        && predicates.get("item-attack-range")?.value !== "melee"
      )
    ) {
      throw new Error(
        `${path} supports one equipped weapon query with optional magical and melee predicates`,
      );
    }
  } else {
    if (value.selection !== undefined) {
      throw new Error(`${path}.selection is only valid for actor-items`);
    }
    if (value.predicates.some(current => itemPredicateTypes.has(current.type))) {
      throw new Error(`${path} item predicates are only valid for actor-items`);
    }
  }
}

const OPERATION_KEYS = {
  "consume-resource": ["primitive", "type", "id", "resource", "timing", "target"],
  "saving-throw": [
    "primitive",
    "type",
    "id",
    "target",
    "ability",
    "onSave",
    "rollMode",
  ],
  "attack-roll": ["primitive", "type", "id", "target", "attack"],
  "damage": [
    "primitive",
    "type",
    "id",
    "target",
    "formula",
    "damageTypes",
    "properties",
    "onSave",
    "multiplier",
    "rounding",
    "mitigation",
    "attachment",
    "replacement",
  ],
  "healing": ["primitive", "type", "id", "target", "formula", "healingTypes", "healingFraction"],
  "grant-temporary-hp": ["primitive", "type", "id", "target", "formula"],
  "create-artifact": ["primitive", "type", "id", "artifactId", "target"],
  "apply-artifact": ["primitive", "type", "id", "artifactId", "target"],
  "update-artifact": ["primitive", "type", "id", "artifactId", "target"],
  "delete-artifact": ["primitive", "type", "id", "artifactId", "target"],
  "move-token": ["primitive", "type", "id", "target", "destination"],
  "remove-statuses": ["primitive", "type", "id", "target", "statuses"],
  "grant-attack-advantage": [
    "primitive",
    "type",
    "id",
    "target",
    "scope",
  ],
  "allocate-hit-point-pool": [
    "primitive",
    "type",
    "id",
    "target",
    "formula",
    "artifactId",
    "eligibility",
  ],
  "weapon-attack": [
    "primitive",
    "type",
    "id",
    "weapon",
    "target",
  ],
  "grant-hit-point-capacity": [
    "primitive",
    "type",
    "id",
    "target",
    "artifactId",
    "formula",
    "formulaScope",
    "stacking",
  ],
  "suppress-statuses": [
    "primitive",
    "type",
    "id",
    "target",
    "statuses",
  ],
  "emit-event": ["primitive", "type", "id", "event", "target", "payload"],
  "check": [
    "primitive",
    "type",
    "id",
    "target",
    "formula",
    "threshold",
    "onSuccess",
    "onFailure",
  ],
  "dash": ["primitive", "type", "id", "target"],
  "reassert-native-summon-control": [
    "primitive",
    "type",
    "id",
    "target",
    "artifactId",
  ],
};

function validateOperation(value, path, {
  allowActualDamage = false,
} = {}) {
  assertExactKeys(value, OPERATION_KEYS[value?.type] ?? [], path);
  if (!OPERATION_KEYS[value.type]) throw new Error(`${path} has unknown operation ${value.type}`);
  if (value.primitive !== "operation") throw new Error(`${path}.primitive must be operation`);
  assertString(value.id, `${path}.id`);
  if (value.type === "emit-event") {
    throw new Error(`${path} emit-event is not supported by clean-room P0`);
  }
  if (value.type === "check") {
    validateValueExpression(value.formula, `${path}.formula`);
    assertNumber(value.threshold, `${path}.threshold`);
    for (const branch of ["onSuccess", "onFailure"]) {
      if (value[branch] === undefined) continue;
      const branchValue = value[branch];
      if (
        !branchValue
        || typeof branchValue !== "object"
        || Array.isArray(branchValue)
        || Object.keys(branchValue).some(key => key !== "chat")
        || typeof branchValue.chat !== "string"
        || branchValue.chat.trim().length === 0
      ) {
        throw new Error(`${path}.${branch} only supports a non-empty chat string`);
      }
    }
  }
  if (value.target !== undefined) assertString(value.target, `${path}.target`);
  if (value.type === "consume-resource") {
    if (value.resource !== "spell-slot") {
      throw new Error(`${path}.resource must be spell-slot`);
    }
    if (!["on-use", "on-hit"].includes(value.timing)) {
      throw new Error(`${path}.timing is unsupported`);
    }
  }
  if (value.type === "saving-throw") {
    if (
      !Array.isArray(value.ability)
      || value.ability.length !== 1
      || !["str", "dex", "con", "int", "wis", "cha"].includes(value.ability[0])
    ) {
      throw new Error(`${path}.ability must contain exactly one D&D ability`);
    }
    if (!["none", "half", "negates"].includes(value.onSave)) {
      throw new Error(`${path}.onSave is unsupported`);
    }
    if (
      value.rollMode !== undefined
      && ![
        "normal",
        "advantage",
        "disadvantage",
        "unwilling-creature-only",
      ].includes(value.rollMode)
    ) {
      throw new Error(`${path}.rollMode is unsupported`);
    }
  }
  if ([
    "damage",
    "healing",
    "grant-temporary-hp",
    "allocate-hit-point-pool",
    "grant-hit-point-capacity",
  ].includes(value.type)) {
    if (!isValueExpression(value.formula)) {
      throw new Error(`${path}.formula must be a ValueExpression`);
    }
    validateValueExpression(value.formula, `${path}.formula`, {
      allowActualDamage: allowActualDamage && (
        value.type === "damage"
        || (value.type === "healing" && value.healingFraction !== undefined)
      ),
      allowOperationResult: true,
      allowCantripProgression: ["damage", "healing"].includes(value.type),
    });
  }
  if (value.type === "grant-hit-point-capacity") {
    assertString(value.artifactId, `${path}.artifactId`);
    if (
      value.formulaScope !== undefined
      && !["shared", "per-target"].includes(value.formulaScope)
    ) {
      throw new Error(
        `${path}.formulaScope must be shared or per-target when declared`,
      );
    }
    if (value.stacking !== "same-spell-strongest-latest") {
      throw new Error(
        `${path}.stacking must be same-spell-strongest-latest`,
      );
    }
  }
  if (value.type === "weapon-attack") {
    assertString(value.weapon, `${path}.weapon`);
  }
  if (value.type === "allocate-hit-point-pool") {
    assertString(value.artifactId, `${path}.artifactId`);
    assertExactKeys(
      value.eligibility,
      [
        "currentHitPoints",
        "excludedStatuses",
        "requiredSusceptibility",
      ],
      `${path}.eligibility`,
    );
    if (value.eligibility.currentHitPoints !== "positive") {
      throw new Error(`${path}.eligibility.currentHitPoints must be positive`);
    }
    if (
      !Array.isArray(value.eligibility.excludedStatuses)
      || value.eligibility.excludedStatuses.length === 0
      || value.eligibility.excludedStatuses.some(status =>
        !["blinded", "dead", "unconscious"].includes(status)
      )
      || new Set(value.eligibility.excludedStatuses).size
        !== value.eligibility.excludedStatuses.length
    ) {
      throw new Error(
        `${path}.eligibility.excludedStatuses requires unique blinded/dead/unconscious values`,
      );
    }
    if (![
      "magical-sleep",
      "condition:blinded",
    ].includes(value.eligibility.requiredSusceptibility)) {
      throw new Error(
        `${path}.eligibility.requiredSusceptibility must be magical-sleep or condition:blinded`,
      );
    }
  }
  if (value.type === "damage") {
    const attachedToAttack = value.attachment === "triggering-attack";
    if (
      !Array.isArray(value.damageTypes)
      || value.damageTypes.length === 0
      || value.damageTypes.some(type =>
        !DAMAGE_TYPES.has(type)
          && !(attachedToAttack && type === "parent-primary")
          && !(value.mitigation === "none" && type === "none")
      )
      || new Set(value.damageTypes).size !== value.damageTypes.length
    ) {
      throw new Error(`${path}.damageTypes requires unique D&D damage types`);
    }
    if (value.attachment !== undefined && !attachedToAttack) {
      throw new Error(`${path}.attachment must be triggering-attack when declared`);
    }
    if (
      value.replacement !== undefined
      && (
        value.replacement !== "triggering-weapon-base-damage"
        || !attachedToAttack
      )
    ) {
      throw new Error(
        `${path}.replacement requires triggering-weapon-base-damage attached to the triggering attack`,
      );
    }
    if (
      value.damageTypes.includes("parent-primary")
      && (
        !attachedToAttack
        || value.damageTypes.length !== 1
      )
    ) {
      throw new Error(
        `${path}.parent-primary requires one damage type attached to the triggering attack`,
      );
    }
    if (
      value.damageTypes.includes("none")
      && (
        value.damageTypes.length !== 1
        || value.mitigation !== "none"
      )
    ) {
      throw new Error(
        `${path}.damageTypes none requires exactly one type and mitigation none`,
      );
    }
    if (
      actualDamageReferences(value.formula).length > 0
      && (
        value.damageTypes.length !== 1
        || value.damageTypes[0] !== "none"
        || value.mitigation !== "none"
      )
    ) {
      throw new Error(
        `${path} actualDamage requires damageTypes none and mitigation none`,
      );
    }
    if (
      value.properties !== undefined
      && (
        !Array.isArray(value.properties)
        || value.properties.some(property => !DAMAGE_PROPERTIES.has(property))
        || new Set(value.properties).size !== value.properties.length
      )
    ) {
      throw new Error(`${path}.properties contains unsupported D&D damage properties`);
    }
    if (value.onSave !== undefined && !["none", "half", "negates"].includes(value.onSave)) {
      throw new Error(`${path}.onSave is unsupported`);
    }
    if (value.multiplier !== undefined) {
      assertNumber(value.multiplier, `${path}.multiplier`, { minimum: 0 });
    }
    if (value.rounding !== undefined && !["down", "up", "nearest"].includes(value.rounding)) {
      throw new Error(`${path}.rounding is unsupported`);
    }
    if (value.mitigation !== undefined && value.mitigation !== "none") {
      throw new Error(`${path}.mitigation must be none when declared`);
    }
  }
  if (value.type === "healing") {
    if (
      !Array.isArray(value.healingTypes)
      || value.healingTypes.length === 0
      || value.healingTypes.some(type => !HEALING_TYPES.has(type))
      || new Set(value.healingTypes).size !== value.healingTypes.length
    ) {
      throw new Error(`${path}.healingTypes requires unique healing/temphp values`);
    }
    if (value.healingFraction !== undefined) {
      if (
        value.healingFraction?.primitive !== "value-expression"
        || value.healingFraction.type !== "constant"
        || !Number.isFinite(Number(value.healingFraction.value))
        || Number(value.healingFraction.value) <= 0
        || Number(value.healingFraction.value) > 1
      ) {
        throw new Error(
          `${path}.healingFraction must be a constant value expression in (0, 1]`,
        );
      }
    }
  }
  if (value.type === "attack-roll") {
    assertExactKeys(value.attack, ["source", "range"], `${path}.attack`);
    if (value.attack.source !== "spellcasting") {
      throw new Error(`${path}.attack.source must be spellcasting`);
    }
    if (!["melee", "ranged"].includes(value.attack.range)) {
      throw new Error(`${path}.attack.range must be melee or ranged`);
    }
  }
  if (["remove-statuses", "suppress-statuses"].includes(value.type)) {
    if (
      !Array.isArray(value.statuses)
      || value.statuses.length === 0
      || value.statuses.some(status => typeof status !== "string" || status.length === 0)
      || new Set(value.statuses).size !== value.statuses.length
    ) {
      throw new Error(`${path}.statuses requires unique non-empty status identifiers`);
    }
  }
  if (value.type === "grant-attack-advantage") {
    if (value.target !== "source" || value.scope !== "triggering-attack") {
      throw new Error(
        `${path} requires target source and scope triggering-attack`,
      );
    }
  }
}

function validateArtifact(value, path) {
  assertExactKeys(
    value,
    [
      "primitive",
      "id",
      "kind",
      "role",
      "host",
      "identity",
      "reapply",
      "state",
      "lifecycle",
    ],
    path,
  );
  if (value.primitive !== "artifact") {
    throw new Error(`${path}.primitive must be artifact`);
  }
  assertString(value.id, `${path}.id`);
  if (value.kind === "zone") {
    if (value.role !== "mechanical") {
      throw new Error(`${path}.role must be mechanical for clean-room zones`);
    }
    if (
      Object.prototype.hasOwnProperty.call(value, "host")
      || Object.prototype.hasOwnProperty.call(value, "reapply")
    ) {
      throw new Error(`${path} clean-room zones must not declare host or reapply`);
    }
    assertExactKeys(value.identity, ["scope", "keys"], `${path}.identity`);
    if (
      value.identity.scope !== "cast"
      || !Array.isArray(value.identity.keys)
      || value.identity.keys.length !== 1
      || value.identity.keys[0] !== "castId"
    ) {
      throw new Error(
        `${path}.identity must use cast scope with exactly the castId key`,
      );
    }
    assertExactKeys(
      value.state,
      ["anchor", "shape", "stationary", "concentrationDisruption"],
      `${path}.state`,
    );
    if (!["placed-point", "movable-template"].includes(value.state.anchor)) {
      throw new Error(
        `${path}.state.anchor must be placed-point or movable-template`,
      );
    }
    if (value.state.concentrationDisruption !== undefined) {
      const disruption = value.state.concentrationDisruption;
      assertExactKeys(
        disruption,
        ["ability"],
        `${path}.state.concentrationDisruption`,
      );
      if (!/^[a-z]{3}$/.test(String(disruption.ability ?? ""))) {
        throw new Error(
          `${path}.state.concentrationDisruption.ability must be a dnd5e ability id`,
        );
      }
    }
    const expectedStationary = value.state.anchor === "placed-point";
    if (value.state.stationary !== expectedStationary) {
      throw new Error(
        `${path}.state.stationary must be ${expectedStationary} for `
        + `${value.state.anchor}`,
      );
    }
    const shapePath = `${path}.state.shape`;
    const shape = value.state.shape;
    const shapeKeys = {
      circle: ["type", "radius", "units"],
      sphere: ["type", "radius", "units"],
      cylinder: ["type", "radius", "height", "units"],
      radius: ["type", "size", "units"],
      square: ["type", "size", "units"],
      cube: ["type", "size", "units"],
      line: ["type", "size", "width", "units"],
    };
    if (!shapeKeys[shape?.type]) {
      throw new Error(
        `${shapePath}.type must be circle, sphere, cylinder, radius, square, cube, or line`,
      );
    }
    assertExactKeys(shape, shapeKeys[shape.type], shapePath);
    if (["circle", "sphere", "cylinder"].includes(shape.type)) {
      validateSpatialValue(
        shape.radius,
        `${shapePath}.radius`,
        { strictlyPositive: true },
      );
    } else {
      validateSpatialValue(
        shape.size,
        `${shapePath}.size`,
        { strictlyPositive: true },
      );
    }
    if (shape.type === "cylinder") {
      validateSpatialValue(
        shape.height,
        `${shapePath}.height`,
        { strictlyPositive: true },
      );
    }
    if (shape.type === "line") {
      validateSpatialValue(
        shape.width,
        `${shapePath}.width`,
        { strictlyPositive: true },
      );
    }
    if (shape.units !== "ft") {
      throw new Error(`${shapePath}.units must be ft`);
    }
    validateLifecycle(value.lifecycle, `${path}.lifecycle`);
    if (!["while-spell-active", "manual"].includes(value.lifecycle.type)) {
      throw new Error(
        `${path} clean-room zone lifecycle must use whileSpellActive() or manual() `
        + "so the lifetime owner is explicit",
      );
    }
    return;
  }
  if (value.kind === "marker") {
    if (
      value.role !== "presentation"
      || Object.prototype.hasOwnProperty.call(value, "host")
      || Object.prototype.hasOwnProperty.call(value, "reapply")
    ) {
      throw new Error(
        `${path} clean-room static markers require presentation role and no host/reapply`,
      );
    }
    assertExactKeys(value.identity, ["scope", "keys"], `${path}.identity`);
    if (
      value.identity.scope !== "cast"
      || !Array.isArray(value.identity.keys)
      || value.identity.keys.length !== 1
      || value.identity.keys[0] !== "castId"
    ) {
      throw new Error(`${path}.identity must use cast/castId`);
    }
    assertExactKeys(
      value.state,
      ["anchor", "shape", "stationary", "color", "opacity"],
      `${path}.state`,
    );
    if (value.state.anchor !== "cast-origin" || value.state.stationary !== true) {
      throw new Error(`${path}.state must be a stationary cast-origin marker`);
    }
    assertExactKeys(
      value.state.shape,
      ["type", "size", "units"],
      `${path}.state.shape`,
    );
    if (value.state.shape.type !== "radius" || value.state.shape.units !== "ft") {
      throw new Error(`${path}.state.shape must be a feet-based radius`);
    }
    validateSpatialValue(
      value.state.shape.size,
      `${path}.state.shape.size`,
      { strictlyPositive: true },
    );
    if (value.state.color !== undefined) {
      assertString(value.state.color, `${path}.state.color`);
    }
    if (value.state.opacity !== undefined) {
      assertNumber(value.state.opacity, `${path}.state.opacity`, { minimum: 0 });
      if (value.state.opacity > 1) {
        throw new Error(`${path}.state.opacity must be <= 1`);
      }
    }
    validateLifecycle(value.lifecycle, `${path}.lifecycle`);
    if (value.lifecycle.type !== "while-artifact") {
      throw new Error(`${path}.lifecycle must use its source artifact`);
    }
    return;
  }
  if (value.kind === "entity") {
    if (value.role !== "mechanical") {
      throw new Error(`${path}.role must be mechanical for clean-room entities`);
    }
    if (
      Object.prototype.hasOwnProperty.call(value, "host")
      || Object.prototype.hasOwnProperty.call(value, "reapply")
    ) {
      throw new Error(`${path} clean-room entities must not declare host or reapply`);
    }
    assertExactKeys(value.identity, ["scope", "keys"], `${path}.identity`);
    if (
      value.identity.scope !== "cast"
      || !Array.isArray(value.identity.keys)
      || value.identity.keys.length !== 1
      || value.identity.keys[0] !== "castId"
    ) {
      throw new Error(
        `${path}.identity must use cast scope with exactly the castId key`,
      );
    }
    assertExactKeys(
      value.state,
      [
        "poolId",
        "profiles",
        "selection",
        "rulesModel",
        "cardinality",
        "placement",
        "disposition",
        "ownership",
        "combat",
        "deltaBindings",
        "control",
        "cleanup",
        "uniqueness",
      ],
      `${path}.state`,
    );
    assertString(value.state.poolId, `${path}.state.poolId`);
    if (!Array.isArray(value.state.profiles) || value.state.profiles.length === 0) {
      throw new Error(`${path}.state.profiles must be a non-empty array`);
    }
    const profileChoices = new Set();
    value.state.profiles.forEach((profile, index) => {
      const profilePath = `${path}.state.profiles[${index}]`;
      assertExactKeys(
        profile,
        [
          "choice",
          "label",
          "profileId",
          "revision",
          "documentId",
          "recipeId",
          "cardinality",
        ],
        profilePath,
      );
      assertString(profile.choice, `${profilePath}.choice`);
      assertString(profile.label, `${profilePath}.label`);
      assertString(profile.profileId, `${profilePath}.profileId`);
      assertString(profile.documentId, `${profilePath}.documentId`);
      assertString(profile.recipeId, `${profilePath}.recipeId`);
      if (!/^[A-Za-z0-9]{16}$/.test(profile.documentId)) {
        throw new Error(`${profilePath}.documentId must be a 16-character Foundry id`);
      }
      assertNumber(profile.revision, `${profilePath}.revision`, {
        integer: true,
        minimum: 1,
      });
      assertExactKeys(
        profile.cardinality,
        ["type", "count"],
        `${profilePath}.cardinality`,
      );
      const canonicalCardinality = (
        profile.cardinality.type === "single"
        && profile.cardinality.count === 1
      ) || (
        profile.cardinality.type === "fixed-small"
        && profile.cardinality.count === 2
      ) || (
        profile.cardinality.type === "fixed-three"
        && profile.cardinality.count === 3
      ) || (
        profile.cardinality.type === "fixed-group"
        && profile.cardinality.count === 5
      );
      if (!canonicalCardinality) {
        throw new Error(
          `${profilePath}.cardinality must be single/count 1, fixed-small/count 2, fixed-three/count 3, or fixed-group/count 5`,
        );
      }
      if (profileChoices.has(profile.choice)) {
        throw new Error(`${path}.state.profiles has duplicate choice ${profile.choice}`);
      }
      profileChoices.add(profile.choice);
    });
    if (value.state.selection === null) {
      if (value.state.profiles.length !== 1) {
        throw new Error(
          `${path}.state.selection may be null only for one fixed profile`,
        );
      }
    } else {
      assertExactKeys(
        value.state.selection,
        ["primitive", "type", "id"],
        `${path}.state.selection`,
      );
      if (
        value.state.selection.primitive !== "parameter-reference"
        || value.state.selection.type !== "action-parameter"
      ) {
        throw new Error(`${path}.state.selection must use parameterValue()`);
      }
      assertString(value.state.selection.id, `${path}.state.selection.id`);
      if (value.state.profiles.length < 2) {
        throw new Error(
          `${path}.state.selection requires at least two profile choices`,
        );
      }
    }
    const usesProfileChoiceCardinality = value.state.selection !== null;
    assertExactKeys(
      value.state.cardinality,
      usesProfileChoiceCardinality ? ["type"] : ["type", "count"],
      `${path}.state.cardinality`,
    );
    if (usesProfileChoiceCardinality) {
      if (value.state.cardinality.type !== "profile-choice") {
        throw new Error(
          `${path}.state.cardinality must resolve from the selected profile choice`,
        );
      }
      if (value.state.selection === null) {
        throw new Error(
          `${path}.state.cardinality profile-choice requires an explicit selection`,
        );
      }
    } else if (
      JSON.stringify(value.state.cardinality)
      !== JSON.stringify(value.state.profiles[0].cardinality)
    ) {
      throw new Error(
        `${path}.state.cardinality must exactly match its sole native profile`,
      );
    }
    if (!["bg3-simplified", "dnd5e-2014-simplified"].includes(value.state.rulesModel)) {
      throw new Error(
        `${path}.state.rulesModel must be bg3-simplified or dnd5e-2014-simplified`,
      );
    }
    assertExactKeys(value.state.placement, ["type"], `${path}.state.placement`);
    if (value.state.placement.type !== "native-token-placement") {
      throw new Error(`${path}.state.placement must be native-token-placement`);
    }
    if (value.state.disposition !== "inherit-source") {
      throw new Error(`${path}.state.disposition must be inherit-source`);
    }
    if (value.state.ownership !== "unique-active-source-owner-or-gm") {
      throw new Error(
        `${path}.state.ownership must be unique-active-source-owner-or-gm`,
      );
    }
    if (value.state.combat !== "independent") {
      throw new Error(`${path}.state.combat must be independent`);
    }
    if (!Array.isArray(value.state.deltaBindings)) {
      throw new Error(`${path}.state.deltaBindings must be an array`);
    }
    const deltaSlots = new Set();
    value.state.deltaBindings.forEach((binding, index) => {
      const bindingPath = `${path}.state.deltaBindings[${index}]`;
      assertExactKeys(binding, ["slot", "value"], bindingPath);
      if (![
        "hit-points",
        "spell-attack-bonus",
        "spell-save-dc",
        "activity-damage",
      ].includes(binding.slot)) {
        throw new Error(`${bindingPath}.slot is not a closed summon delta slot`);
      }
      if (deltaSlots.has(binding.slot)) {
        throw new Error(`${path}.state.deltaBindings has duplicate slot ${binding.slot}`);
      }
      deltaSlots.add(binding.slot);
      validateValueExpression(binding.value, `${bindingPath}.value`, {
        allowSummonSnapshotStatistics: true,
      });
      validateSummonDeltaBinding(binding, bindingPath);
    });
    const control = value.state.control;
    const cleanup = value.state.cleanup;
    if (control !== undefined) {
      assertExactKeys(
        control,
        ["primitive", "type", "duration", "expiry"],
        `${path}.state.control`,
      );
      if (
        control.primitive !== "summon-control"
        || control.type !== "time-bound"
        || control.expiry !== "release-control-keep-entity"
      ) {
        throw new Error(
          `${path}.state.control must use nativeSummonControl() with release-control-keep-entity`,
        );
      }
      validateLifecycle(control.duration, `${path}.state.control.duration`);
      if (
        control.duration.type !== "duration"
        || control.duration.value !== 24
        || control.duration.units !== "hours"
      ) {
        throw new Error(`${path}.state.control duration must be exactly 24 hours`);
      }
      if (cleanup !== undefined || value.state.uniqueness !== undefined) {
        throw new Error(
          `${path}.state.control summons cannot declare cleanup or uniqueness`,
        );
      }
    } else {
      assertExactKeys(cleanup, ["expiry", "fallback"], `${path}.state.cleanup`);
      if (!["concentration-effect", "dm-duration", "long-rest-or-defeat-or-dismiss"].includes(cleanup.expiry)) {
        throw new Error(
          `${path}.state.cleanup.expiry must be concentration-effect, dm-duration, or long-rest-or-defeat-or-dismiss`,
        );
      }
      if (cleanup.expiry === "concentration-effect") {
        if (cleanup.fallback !== "dm") {
          throw new Error(
            `${path}.state.cleanup.fallback must be dm for concentration cleanup`,
          );
        }
        if (value.state.uniqueness !== undefined) {
          throw new Error(`${path}.state.uniqueness is invalid for concentration summons`);
        }
      } else if (cleanup.expiry === "dm-duration") {
        if (cleanup.fallback !== undefined) {
          throw new Error(`${path}.state.cleanup.fallback is invalid for dm-duration`);
        }
        assertExactKeys(
          value.state.uniqueness,
          ["scope", "maximum", "enforcement"],
          `${path}.state.uniqueness`,
        );
        if (
          value.state.uniqueness.scope !== "source-actor-item"
          || value.state.uniqueness.maximum !== 1
          || value.state.uniqueness.enforcement !== "replace-after-create"
        ) {
          throw new Error(
            `${path}.state.uniqueness must be source-actor-item/1/replace-after-create`,
          );
        }
      } else {
        if (cleanup.fallback !== "dm-dismiss-source-marker") {
          throw new Error(
            `${path}.state.cleanup.fallback must be dm-dismiss-source-marker for planar lifecycle`,
          );
        }
        if (value.state.uniqueness !== undefined) {
          throw new Error(`${path}.state.uniqueness is invalid for planar lifecycle summons`);
        }
      }
    }
    validateLifecycle(value.lifecycle, `${path}.lifecycle`);
    const expectedLifecycle = control !== undefined
      || cleanup?.expiry === "long-rest-or-defeat-or-dismiss"
      ? "manual"
      : "while-spell-active";
    if (value.lifecycle.type !== expectedLifecycle) {
      throw new Error(
        `${path} clean-room entity lifecycle must use ${expectedLifecycle === "manual" ? "manual()" : "whileSpellActive()"}`,
      );
    }
    return;
  }
  if (!["effect", "visual", "enchantment"].includes(value.kind)) {
    throw new Error(`${path}.kind ${value.kind} is not yet supported by clean-room P0`);
  }
  if (!ARTIFACT_HOSTS.has(value.host)) {
    throw new Error(`${path}.host ${value.host} is not supported by clean-room P0`);
  }
  if (!REAPPLY_POLICIES.has(value.reapply)) {
    throw new Error(
      `${value.id} reapply policy ${value.reapply} has no registered Runtime Profile lowering`,
    );
  }
  assertExactKeys(value.identity, ["scope", "keys"], `${path}.identity`);
  const identityKeys = ARTIFACT_IDENTITIES[value.identity.scope];
  if (!identityKeys) {
    throw new Error(
      `${path}.identity.scope ${value.identity.scope} is not supported by clean-room P0`,
    );
  }
  if (
    !Array.isArray(value.identity.keys)
    || value.identity.keys.length !== identityKeys.length
    || value.identity.keys.some((key, index) => key !== identityKeys[index])
  ) {
    throw new Error(
      `${path}.identity.keys must exactly match ${identityKeys.join(", ")} for `
      + value.identity.scope,
    );
  }
  if (value.kind === "enchantment") {
    if (
      value.role !== "mechanical"
      || value.host !== "item"
      || value.identity.scope !== "source-item"
      || value.reapply !== "replace"
    ) {
      throw new Error(
        `${path} clean-room enchantments require mechanical item host, `
        + "source-item identity, and replace reapply",
      );
    }
    assertExactKeys(value.state, ["name", "img", "modifiers"], `${path}.state`);
    if (value.state.name !== undefined) {
      assertString(value.state.name, `${path}.state.name`);
    }
    if (value.state.img !== undefined) {
      assertString(value.state.img, `${path}.state.img`);
    }
    if (
      !Array.isArray(value.state.modifiers)
      || value.state.modifiers.length === 0
    ) {
      throw new Error(`${path}.state.modifiers must be a non-empty array`);
    }
    value.state.modifiers.forEach((modifier, index) => {
      validateModifier(modifier, `${path}.state.modifiers[${index}]`);
      if (!ITEM_ENCHANTMENT_MODIFIERS.has(modifier.type)) {
        throw new Error(
          `${path}.state.modifiers[${index}] ${modifier.type} cannot be hosted on an item`,
        );
      }
    });
    const modifierTypes = value.state.modifiers.map(modifier => modifier.type);
    const mechanicalTypes = modifierTypes.filter(type =>
      type !== "grant-magical-weapon"
    );
    if (
      new Set(modifierTypes).size !== modifierTypes.length
      || !modifierTypes.includes("grant-magical-weapon")
      || mechanicalTypes.length === 0
    ) {
      throw new Error(
        `${path} requires one magical-weapon modifier and at least one unique weapon modifier`,
      );
    }
    validateLifecycle(value.lifecycle, `${path}.lifecycle`);
    if (value.lifecycle.type !== "while-artifact") {
      throw new Error(
        `${path} item enchantment lifecycle must be owned by a source artifact`,
      );
    }
    return;
  }
  if (value.kind === "visual") {
    if (value.role !== "presentation") {
      throw new Error(`${path}.role must be presentation for clean-room visuals`);
    }
    if (
      value.host !== "actor"
      ||
      value.identity.scope !== "source"
      || value.reapply !== "replace"
      || value.lifecycle?.type !== "while-artifact"
    ) {
      throw new Error(
        `${path} clean-room range indicators require source identity, replace reapply, `
        + "and a while-artifact lifecycle",
      );
    }
    assertExactKeys(
      value.state,
      [
        "shape",
        "radius",
        "units",
        "follows",
        "membership",
        "recipientPolicy",
        "includeSelf",
        "color",
        "opacity",
      ],
      `${path}.state`,
    );
    if (value.state.shape !== "circle") {
      throw new Error(`${path}.state.shape must be circle`);
    }
    assertNumber(value.state.radius, `${path}.state.radius`, { minimum: 0 });
    if (value.state.radius <= 0) {
      throw new Error(`${path}.state.radius must be greater than 0`);
    }
    if (value.state.units !== "ft") {
      throw new Error(`${path}.state.units must be ft`);
    }
    if (value.state.follows !== "source-token") {
      throw new Error(`${path}.state.follows must be source-token`);
    }
    const followingAura = value.state.membership !== undefined
      || value.state.recipientPolicy !== undefined
      || value.state.includeSelf !== undefined;
    if (followingAura) {
      if (value.state.membership !== "dynamic") {
        throw new Error(`${path}.state.membership must be dynamic`);
      }
      if (![
        "same-disposition",
        "opposing-disposition",
        "all",
      ].includes(value.state.recipientPolicy)) {
        throw new Error(
          `${path}.state.recipientPolicy must be same-disposition, `
          + "opposing-disposition, or all",
        );
      }
      if (typeof value.state.includeSelf !== "boolean") {
        throw new Error(`${path}.state.includeSelf must be a boolean`);
      }
      if (
        value.state.recipientPolicy === "opposing-disposition"
        && value.state.includeSelf === true
      ) {
        throw new Error(
          `${path}.state opposing-disposition cannot include the source itself`,
        );
      }
    }
    if (value.state.color !== undefined) {
      assertString(value.state.color, `${path}.state.color`);
    }
    if (value.state.opacity !== undefined) {
      assertNumber(value.state.opacity, `${path}.state.opacity`, { minimum: 0 });
      if (value.state.opacity > 1) {
        throw new Error(`${path}.state.opacity must be <= 1`);
      }
    }
    validateLifecycle(value.lifecycle, `${path}.lifecycle`);
    return;
  }
  assertExactKeys(
    value.state,
    [
      "name",
      "img",
      "markerOnly",
      "disabled",
      "transfer",
      "modifiers",
      "sourceTermination",
      "outcomeRace",
    ],
    `${path}.state`,
  );
  if (value.host !== "actor") {
    throw new Error(`${path}.host must be actor for clean-room effects`);
  }
  if (value.role !== "mechanical") {
    throw new Error(`${path}.role must be mechanical for clean-room effects`);
  }
  if (value.state.name !== undefined) assertString(value.state.name, `${path}.state.name`);
  if (value.state.img !== undefined) assertString(value.state.img, `${path}.state.img`);
  if (value.state.markerOnly !== undefined && typeof value.state.markerOnly !== "boolean") {
    throw new Error(`${path}.state.markerOnly must be a boolean`);
  }
  if (typeof value.state.disabled !== "boolean" || typeof value.state.transfer !== "boolean") {
    throw new Error(`${path}.state disabled and transfer must be booleans`);
  }
  if (!Array.isArray(value.state.modifiers)) {
    throw new Error(`${path}.state.modifiers must be an array`);
  }
  if (value.state.sourceTermination !== undefined) {
    assertExactKeys(
      value.state.sourceTermination,
      ["primitive", "type"],
      `${path}.state.sourceTermination`,
    );
    if (
      value.state.sourceTermination.primitive !== "source-termination"
      || !SOURCE_TERMINATION_POLICIES.has(value.state.sourceTermination.type)
    ) {
      throw new Error(
        `${path}.state.sourceTermination must use `
        + "endSourceWhenLastDependentEnds()",
      );
    }
    if (value.identity.scope !== "source-target") {
      throw new Error(
        `${path}.state.sourceTermination requires source-target identity`,
      );
    }
  }
  if (value.state.markerOnly === true && value.state.modifiers.length > 0) {
    throw new Error(`${path}.state.markerOnly cannot declare mechanical modifiers`);
  }
  value.state.modifiers.forEach((modifier, index) =>
    validateModifier(modifier, `${path}.state.modifiers[${index}]`)
  );
  if (
    value.state.modifiers.filter(modifier =>
      modifier.type === "optional-roll-bonus"
    ).length > 1
  ) {
    throw new Error(
      `${path}.state.modifiers supports at most one optional-roll-bonus`,
    );
  }
  if (
    value.state.modifiers.some(modifier =>
      ITEM_ONLY_ENCHANTMENT_MODIFIERS.has(modifier.type)
    )
  ) {
    throw new Error(`${path} item enchantment modifiers cannot be hosted on an actor`);
  }
  if (value.state.outcomeRace !== undefined) {
    const race = value.state.outcomeRace;
    assertExactKeys(
      race,
      [
        "primitive",
        "type",
        "profile",
        "entry",
        "repeatSaveRuleId",
        "successThreshold",
        "failureThreshold",
        "failureArtifactId",
        "naturalExpiryArtifactId",
      ],
      `${path}.state.outcomeRace`,
    );
    if (
      race.primitive !== "outcome-race"
      || race.type !== "nonconsecutive-thresholds"
    ) {
      throw new Error(`${path}.state.outcomeRace must use outcomeRace()`);
    }
    if (![
      "source-bound-natural-expiry",
      "independent-terminal",
    ].includes(race.profile)) {
      throw new Error(
        `${path}.state.outcomeRace.profile must use a supported closed profile`,
      );
    }
    const sourceBound = race.profile === "source-bound-natural-expiry";
    assertExactKeys(
      race.entry,
      sourceBound
        ? ["operationId", "beginOn", "endSourceOn"]
        : ["operationId", "beginOn"],
      `${path}.state.outcomeRace.entry`,
    );
    assertString(
      race.entry.operationId,
      `${path}.state.outcomeRace.entry.operationId`,
    );
    if (sourceBound) {
      if (race.entry.beginOn !== "failure" || race.entry.endSourceOn !== "success") {
        throw new Error(
          `${path}.state.outcomeRace.entry must begin on failure and end source on success`,
        );
      }
    } else if (race.entry.beginOn !== "hit") {
      throw new Error(
        `${path}.state.outcomeRace.entry must begin on hit for independent-terminal`,
      );
    }
    assertString(
      race.repeatSaveRuleId,
      `${path}.state.outcomeRace.repeatSaveRuleId`,
    );
    for (const key of ["successThreshold", "failureThreshold"]) {
      if (!Number.isInteger(race[key]) || race[key] <= 0) {
        throw new Error(`${path}.state.outcomeRace.${key} must be a positive integer`);
      }
    }
    assertString(race.failureArtifactId, `${path}.state.outcomeRace.failureArtifactId`);
    if (sourceBound) {
      assertString(
        race.naturalExpiryArtifactId,
        `${path}.state.outcomeRace.naturalExpiryArtifactId`,
      );
    } else if (race.naturalExpiryArtifactId !== null) {
      throw new Error(
        `${path}.state.outcomeRace.naturalExpiryArtifactId must be null for independent-terminal`,
      );
    }
    if (
      value.identity.scope !== "source-target"
      || value.reapply !== "replace"
    ) {
      throw new Error(
        `${path}.state.outcomeRace requires a replace-scoped source-target effect`,
      );
    }
  }
  validateLifecycle(value.lifecycle, `${path}.lifecycle`);
}

function validateDefaultTargetSelection(value, path) {
  assertExactKeys(
    value,
    [
      "primitive",
      "type",
      "cardinality",
      "polarity",
      "targetPolicy",
      "timing",
      "includeSelf",
      "requiresTargetCanSeeSource",
    ],
    path,
  );
  if (
    value.primitive !== "target-selection-default"
    || value.type !== "policy"
  ) {
    throw new Error(`${path} must be a target selection policy`);
  }
  if (value.cardinality !== "any") {
    throw new Error(
      `${path}.cardinality must be any until the CLI has a deterministic single-target default policy`,
    );
  }
  if (!["helpful", "harmful"].includes(value.polarity)) {
    throw new Error(`${path}.polarity must be helpful or harmful`);
  }
  if (![
    "same-disposition-all",
    "opposing-disposition-all",
  ].includes(value.targetPolicy)) {
    throw new Error(`${path}.targetPolicy is unsupported`);
  }
  if (value.timing !== "cast") {
    throw new Error(`${path}.timing must be cast`);
  }
  if (typeof value.includeSelf !== "boolean") {
    throw new Error(`${path}.includeSelf must be a boolean`);
  }
  if (typeof value.requiresTargetCanSeeSource !== "boolean") {
    throw new Error(`${path}.requiresTargetCanSeeSource must be a boolean`);
  }
}

function validateAction(value, path) {
  assertExactKeys(
    value,
    [
      "primitive",
      "id",
      "name",
      "activation",
      "visibility",
      "delivery",
      "parameters",
      "availableWhen",
      "defaultTargetSelection",
      "resolution",
    ],
    path,
  );
  if (value.primitive !== "action") throw new Error(`${path}.primitive must be action`);
  assertString(value.id, `${path}.id`);
  assertString(value.name, `${path}.name`);
  assertExactKeys(value.activation, ["type", "cost"], `${path}.activation`);
  if (!["action", "bonus", "reaction", "minute", "hour", "day", "special", "none"].includes(
    value.activation.type,
  )) {
    throw new Error(`${path}.activation.type is unsupported`);
  }
  assertNumber(value.activation.cost, `${path}.activation.cost`, { minimum: 0 });
  if (!["public", "automation-only"].includes(value.visibility)) {
    throw new Error(`${path}.visibility is unsupported`);
  }
  if (!["standalone", "declared-rider"].includes(value.delivery)) {
    throw new Error(`${path}.delivery is unsupported`);
  }
  if (!Array.isArray(value.parameters)) throw new Error(`${path}.parameters must be an array`);
  if (!Array.isArray(value.availableWhen)) {
    throw new Error(`${path}.availableWhen must be an array`);
  }
  if (value.defaultTargetSelection !== undefined) {
    validateDefaultTargetSelection(
      value.defaultTargetSelection,
      `${path}.defaultTargetSelection`,
    );
  }
  if (value.resolution !== undefined) {
    assertExactKeys(
      value.resolution,
      [
        "primitive",
        "type",
        "count",
        "allocation",
        "defaultTarget",
      ],
      `${path}.resolution`,
    );
    if (
      value.resolution.primitive !== "action-resolution"
      || value.resolution.type !== "independent-projectiles"
    ) {
      throw new Error(
        `${path}.resolution must be an independent-projectiles action-resolution`,
      );
    }
    validateValueExpression(
      value.resolution.count,
      `${path}.resolution.count`,
      { allowCantripProgression: true },
    );
    const findUnsupportedCountExpression = expression => {
      if (!expression || typeof expression !== "object") return null;
      if (
        expression.primitive === "value-expression"
        && ![
          "constant",
          "add",
          "multiply",
          "cast-level",
          "levels-above-base",
          "per-slot-above-base",
          "cantrip-progression",
          "tiers",
          "round-down",
        ].includes(expression.type)
      ) return expression.type;
      for (const child of Object.values(expression)) {
        if (Array.isArray(child)) {
          for (const entry of child) {
            const result = findUnsupportedCountExpression(entry);
            if (result) return result;
          }
        } else if (child && typeof child === "object") {
          const result = findUnsupportedCountExpression(child);
          if (result) return result;
        }
      }
      return null;
    };
    const unsupportedCountExpression =
      findUnsupportedCountExpression(value.resolution.count);
    if (unsupportedCountExpression) {
      throw new Error(
        `${path}.resolution.count cannot use ${unsupportedCountExpression}`,
      );
    }
    if (value.resolution.allocation !== "optional-explicit") {
      throw new Error(
        `${path}.resolution.allocation must be optional-explicit`,
      );
    }
    if (value.resolution.defaultTarget !== "concentrate") {
      throw new Error(
        `${path}.resolution.defaultTarget must be concentrate`,
      );
    }
  }
  const parameterIds = new Set();
  for (const [index, parameter] of (value.parameters ?? []).entries()) {
    validateActionParameter(parameter, `${path}.parameters[${index}]`);
    if (parameterIds.has(parameter.id)) {
      throw new Error(`${path}.parameters has duplicate id ${parameter.id}`);
    }
    parameterIds.add(parameter.id);
  }
  for (const [index, availability] of (value.availableWhen ?? []).entries()) {
    assertExactKeys(
      availability,
      availability.consumption === undefined
        ? ["type", "artifactId", "subject"]
        : ["type", "artifactId", "subject", "consumption"],
      `${path}.availableWhen[${index}]`,
    );
    if (availability.type !== "artifact-exists") {
      throw new Error(`${path}.availableWhen[${index}] has unknown availability ${availability.type}`);
    }
    assertString(availability.artifactId, `${path}.availableWhen[${index}].artifactId`);
    if (availability.subject !== "source") {
      throw new Error(
        `${path}.availableWhen[${index}].subject must be source for actor action availability`,
      );
    }
    if (
      availability.consumption !== undefined
      && availability.consumption !== "one-shot"
    ) {
      throw new Error(
        `${path}.availableWhen[${index}].consumption must be one-shot when declared`,
      );
    }
  }
  if (value.type === "reassert-native-summon-control") {
    assertString(value.artifactId, `${path}.artifactId`);
  }
}

function operationResultReferences(value, output = []) {
  if (!value || typeof value !== "object") return output;
  if (
    value.primitive === "value-expression"
    && value.type === "operation-result"
  ) {
    output.push(value.operationId);
    return output;
  }
  for (const child of Object.values(value)) {
    if (Array.isArray(child)) {
      child.forEach(entry => operationResultReferences(entry, output));
    } else if (child && typeof child === "object") {
      operationResultReferences(child, output);
    }
  }
  return output;
}

function actualDamageReferences(value, output = []) {
  if (!value || typeof value !== "object") return output;
  if (
    value.primitive === "value-expression"
    && value.type === "actual-damage"
  ) {
    output.push(value);
    return output;
  }
  for (const child of Object.values(value)) {
    if (Array.isArray(child)) {
      child.forEach(entry => actualDamageReferences(entry, output));
    } else if (child && typeof child === "object") {
      actualDamageReferences(child, output);
    }
  }
  return output;
}

function linkedDamageFormulaSupported(value) {
  if (value?.type === "dice") return true;
  return value?.type === "per-slot-above-base"
    && value.base?.type === "dice"
    && value.increment?.type === "dice"
    && value.base.faces === value.increment.faces;
}

function validateRule(value, path) {
  assertExactKeys(value, ["primitive", "id", "on", "when", "targets", "do"], path);
  if (value.primitive !== "rule") throw new Error(`${path}.primitive must be rule`);
  assertString(value.id, `${path}.id`);
  if (!Array.isArray(value.when)) throw new Error(`${path}.when must be an array`);
  if (!Array.isArray(value.targets)) throw new Error(`${path}.targets must be an array`);
  if (!Array.isArray(value.do)) throw new Error(`${path}.do must be an array`);
  validateTrigger(value.on, `${path}.on`);
  (value.when ?? []).forEach((current, index) =>
    validatePredicate(current, `${path}.when[${index}]`)
  );
  (value.targets ?? []).forEach((current, index) =>
    validateTargetQuery(current, `${path}.targets[${index}]`)
  );
  const precedingOperations = new Map();
  (value.do ?? []).forEach((current, index) => {
    validateOperation(current, `${path}.do[${index}]`, {
      allowActualDamage: value.on?.type === "damage-taken"
        || (
          value.on?.type === "operation-outcome"
          && current.type === "healing"
          && current.healingFraction !== undefined
        ),
    });
    if (current.type === "saving-throw" && current.rollMode !== undefined) {
      const initialWillingnessPolicy =
        value.on?.type === "action-used"
        && current.rollMode === "unwilling-creature-only";
      if (value.on?.type !== "damage-taken" && !initialWillingnessPolicy) {
        throw new Error(
          `${path}.do[${index}].rollMode is currently supported only for damage-taken repeat saves`,
        );
      }
    }
    const resultReferences = operationResultReferences(current.formula);
    if (
      resultReferences.length > 0
      && (
        current.type !== "healing"
        || current.healingTypes?.length !== 1
        || current.healingTypes[0] !== "healing"
      )
    ) {
      throw new Error(
        `${path}.do[${index}] operationResult is currently supported only by healing operations`,
      );
    }
    for (const operationId of resultReferences) {
      const source = precedingOperations.get(operationId);
      if (!source) {
        throw new Error(
          `${path}.do[${index}].formula operationResult references missing or later operation `
          + operationId,
        );
      }
      if (source.type !== "damage") {
        throw new Error(
          `${path}.do[${index}].formula operationResult ${operationId} cannot read `
          + `${source.type} rolled-amount`,
        );
      }
      if (
        source.damageTypes?.length !== 1
        || !linkedDamageFormulaSupported(source.formula)
      ) {
        throw new Error(
          `${path}.do[${index}].formula operationResult ${operationId} requires `
          + "one typed damage roll with a dice or same-die per-slot formula",
        );
      }
    }
    if (current.id) precedingOperations.set(current.id, current);
  });
  const targetsById = new Map(
    (value.targets ?? []).map(current => [current.id, current]),
  );
  for (const [index, current] of (value.do ?? []).entries()) {
    if (current.type !== "weapon-attack") continue;
    const weapon = targetsById.get(current.weapon);
    const target = targetsById.get(current.target);
    if (
      weapon?.result !== "items"
      || weapon?.origin?.type !== "actor-items"
      || weapon?.cardinality?.min !== 1
      || weapon?.cardinality?.max !== 1
      || target?.origin?.type !== "selected"
      || target?.cardinality?.min !== 1
      || target?.cardinality?.max !== 1
    ) {
      throw new Error(
        `${path}.do[${index}] weapon-attack requires one actor-owned item and one selected target`,
      );
    }
  }
}

function validateContract(value, path) {
  assertExactKeys(
    value,
    [
      "schemaVersion",
      "ruleset",
      "level",
      "school",
      "components",
      "material",
      "ritual",
      "lifetime",
      "primaryActionId",
    ],
    path,
  );
  if (value.schemaVersion !== CLEAN_ROOM_SPELL_SCHEMA_VERSION) {
    throw new Error(`${path}.schemaVersion must be ${CLEAN_ROOM_SPELL_SCHEMA_VERSION}`);
  }
  if (!RULESETS.has(value.ruleset)) throw new Error(`${path}.ruleset is unsupported`);
  assertNumber(value.level, `${path}.level`, { integer: true, minimum: 0 });
  if (value.level > 9) throw new Error(`${path}.level cannot exceed 9`);
  if (!SCHOOLS.has(value.school)) throw new Error(`${path}.school is unsupported`);
  assertExactKeys(value.components, ["verbal", "somatic", "material"], `${path}.components`);
  for (const component of ["verbal", "somatic", "material"]) {
    if (typeof value.components[component] !== "boolean") {
      throw new Error(`${path}.components.${component} must be a boolean`);
    }
  }
  assertExactKeys(value.material, ["cost", "consumed"], `${path}.material`);
  assertNumber(value.material.cost, `${path}.material.cost`, { minimum: 0 });
  if (typeof value.material.consumed !== "boolean") {
    throw new Error(`${path}.material.consumed must be a boolean`);
  }
  if (
    value.components.material === false
    && (value.material.cost !== 0 || value.material.consumed !== false)
  ) {
    throw new Error(
      `${path}.material cost or consumption requires components.material=true`,
    );
  }
  if (typeof value.ritual !== "boolean") {
    throw new Error(`${path}.ritual must be a boolean`);
  }
  assertExactKeys(
    value.lifetime,
    ["primitive", "duration", "concentration"],
    `${path}.lifetime`,
  );
  if (value.lifetime.primitive !== "spell-lifetime") {
    throw new Error(`${path}.lifetime.primitive must be spell-lifetime`);
  }
  validateLifecycle(value.lifetime.duration, `${path}.lifetime.duration`, {
    allowWhileSpellActive: false,
  });
  if (!["instant", "duration"].includes(value.lifetime.duration.type)) {
    throw new Error(`${path}.lifetime.duration must be instant or duration`);
  }
  if (typeof value.lifetime.concentration !== "boolean") {
    throw new Error(`${path}.lifetime.concentration must be a boolean`);
  }
  assertString(value.primaryActionId, `${path}.primaryActionId`);
}

function validateContentRef(value, path) {
  assertExactKeys(
    value,
    ["schemaVersion", "source", "identifier", "fields"],
    path,
  );
  if (value.schemaVersion !== CLEAN_ROOM_SPELL_SCHEMA_VERSION) {
    throw new Error(`${path}.schemaVersion must be ${CLEAN_ROOM_SPELL_SCHEMA_VERSION}`);
  }
  if (value.source !== "dnd5e-item") throw new Error(`${path}.source must be dnd5e-item`);
  assertString(value.identifier, `${path}.identifier`);
  if (
    !Array.isArray(value.fields)
    || value.fields.some(field => !CONTENT_FIELD_SET.has(field))
    || new Set(value.fields).size !== value.fields.length
  ) {
    throw new Error(`${path}.fields must contain unique supported content fields`);
  }
}

function validateStaticPlacedZoneClosure(definition, artifacts, rules) {
  const zones = artifacts.filter(current => current.kind === "zone");
  for (const zone of zones) {
    const zonePath = `${definition.id}.artifact.${zone.id}`;
    const memberships = artifacts.filter(current =>
      current.kind === "effect"
      && current.role === "mechanical"
      && current.lifecycle?.type === "while-artifact"
      && current.lifecycle.artifactId === zone.id
    );
    if (memberships.length !== 1) {
      throw new Error(
        `${zonePath} requires exactly one mechanical membership effect with `
        + `whileArtifact("${zone.id}"); received ${memberships.length}`,
      );
    }
    const membership = memberships[0];
    if (
      membership.host !== "actor"
      || membership.identity?.scope !== "source-target"
      || !Array.isArray(membership.identity?.keys)
      || membership.identity.keys.length !== 2
      || membership.identity.keys[0] !== "sourceUuid"
      || membership.identity.keys[1] !== "targetUuid"
      || membership.reapply !== "replace"
    ) {
      throw new Error(
        `${zonePath} membership effect must use actor host, source-target identity `
        + "with sourceUuid/targetUuid keys, and replace reapply",
      );
    }

    const creations = [];
    for (const currentRule of rules) {
      for (const currentOperation of currentRule.do ?? []) {
        if (
          currentOperation.type === "create-artifact"
          && currentOperation.artifactId === zone.id
        ) {
          creations.push({ rule: currentRule, operation: currentOperation });
        }
      }
    }
    if (creations.length !== 1) {
      throw new Error(
        `${zonePath} requires exactly one create-artifact operation; `
        + `received ${creations.length}`,
      );
    }

    const creation = creations[0];
    if (creation.rule.on?.type !== "action-used") {
      throw new Error(
        `${zonePath} must be created by an action-used rule`,
      );
    }
    const matchingTargets = (creation.rule.targets ?? []).filter(current =>
      current.id === creation.operation.target
    );
    if (matchingTargets.length !== 1) {
      throw new Error(
        `${zonePath} create-artifact target ${creation.operation.target} `
        + `must resolve to exactly one target query`,
      );
    }
    const target = matchingTargets[0];
    if (
      target.result !== "template-members"
      || target.evaluation !== "snapshot"
      || target.origin?.type !== "placed-template"
    ) {
      throw new Error(
        `${zonePath} create-artifact target must be a snapshot placed-template query`,
      );
    }

    const zoneShape = zone.state.shape;
    const targetShape = target.origin.shape;
    const sameSpatialValue = (left, right) => (
      JSON.stringify(left) === JSON.stringify(right)
      || (
        !isValueExpression(left)
        && !isValueExpression(right)
        && Number(left) === Number(right)
      )
    );
    const expectedSize = ["circle", "sphere", "cylinder"].includes(zoneShape.type)
      ? zoneShape.radius
      : zoneShape.size;
    const expectedWidth = zoneShape.type === "line" ? zoneShape.width : null;
    const expectedHeight = zoneShape.type === "cylinder" ? zoneShape.height : null;
    const normalizedTargetWidth = targetShape.width ?? null;
    const normalizedTargetHeight = targetShape.height ?? null;
    const sameShape = (
      targetShape.type === zoneShape.type
      && sameSpatialValue(targetShape.size, expectedSize)
      && targetShape.units === zoneShape.units
      && (
        expectedWidth === null
          ? normalizedTargetWidth === null
          : sameSpatialValue(normalizedTargetWidth, expectedWidth)
      )
      && (
        expectedHeight === null
          ? normalizedTargetHeight === null
          : sameSpatialValue(normalizedTargetHeight, expectedHeight)
      )
    );
    if (!sameShape) {
      throw new Error(
        `${zonePath} shape must exactly match its placed-template target`,
      );
    }
  }
}

function validatePerSpellScript(definition, artifacts, rules) {
  const script = definition.script;
  if (script === undefined) return;
  const path = `${definition.id}.script`;
  assertExactKeys(script, ["schemaVersion", "id", "version", "handlers"], path);
  if (script.schemaVersion !== 1) throw new Error(`${path}.schemaVersion must be 1`);
  if (script.id !== definition.id) {
    throw new Error(`${path}.id must exactly match the spell id`);
  }
  assertNumber(script.version, `${path}.version`, { integer: true, minimum: 1 });
  if (!Array.isArray(script.handlers) || script.handlers.length === 0) {
    throw new Error(`${path}.handlers must be a non-empty array`);
  }
  const handlerIds = new Set();
  const artifactsById = new Map(artifacts.map(artifact => [artifact.id, artifact]));
  const rulesById = new Map(rules.map(rule => [rule.id, rule]));
  for (const [index, handler] of script.handlers.entries()) {
    const handlerPath = `${path}.handlers[${index}]`;
    assertExactKeys(handler, [
      "id",
      "event",
      "runtimeRuleId",
      "ruleId",
      "artifactId",
      "outcomes",
      "authority",
      "dedupe",
      "cleanupOwner",
      "writes",
      "configuration",
    ], handlerPath);
    assertString(handler.id, `${handlerPath}.id`);
    if (handlerIds.has(handler.id)) {
      throw new Error(`${path} has duplicate handler id ${handler.id}`);
    }
    handlerIds.add(handler.id);
    if (!PER_SPELL_SCRIPT_EVENTS.has(handler.event)) {
      throw new Error(`${handlerPath}.event is unsupported: ${handler.event}`);
    }
    if (handler.authority !== "primary-active-gm") {
      throw new Error(`${handlerPath}.authority must be primary-active-gm`);
    }
    assertString(handler.dedupe, `${handlerPath}.dedupe`);
    if (!["source", "script"].includes(handler.cleanupOwner)) {
      throw new Error(`${handlerPath}.cleanupOwner must be source or script`);
    }
    if (
      !Array.isArray(handler.writes)
      || handler.writes.length === 0
      || handler.writes.some(value => typeof value !== "string" || !value)
      || new Set(handler.writes).size !== handler.writes.length
    ) {
      throw new Error(`${handlerPath}.writes must contain unique non-empty strings`);
    }
    if (handler.event === "declared-rider-after-damage") {
      assertString(handler.runtimeRuleId, `${handlerPath}.runtimeRuleId`);
      const rule = rulesById.get(handler.runtimeRuleId);
      if (
        !rule
        || rule.on?.type !== "operation-outcome"
        || rule.on?.operationId !== "external:triggering-weapon-attack"
        || rule.on?.outcome !== "hit"
        || !(rule.do ?? []).some(operation => operation.type === "damage")
      ) {
        throw new Error(`${handlerPath} must reference a damaging declared-rider hit rule`);
      }
      if (handler.ruleId !== undefined || (handler.outcomes ?? []).length > 0) {
        throw new Error(`${handlerPath} cannot declare repeat-save fields`);
      }
    } else if (handler.event === "typed-damage-transaction") {
      assertString(handler.runtimeRuleId, `${handlerPath}.runtimeRuleId`);
      assertString(handler.artifactId, `${handlerPath}.artifactId`);
      const runtimeRule = rulesById.get(handler.runtimeRuleId);
      const saveOperations = (runtimeRule?.do ?? []).filter(operation =>
        operation.type === "saving-throw"
      );
      const damageOperations = (runtimeRule?.do ?? []).filter(operation =>
        operation.type === "damage"
      );
      const artifactValue = artifactsById.get(handler.artifactId);
      const configuration = handler.configuration;
      assertExactKeys(configuration, [
        "schemaVersion",
        "minimumHitPoints",
        "reductionOutcome",
        "reductionBasis",
        "durationSeconds",
      ], `${handlerPath}.configuration`);
      if (
        !runtimeRule
        || runtimeRule.on?.type !== "action-used"
        || saveOperations.length !== 1
        || damageOperations.length !== 1
        || (runtimeRule.do ?? []).some(operation => ![
          "consume-resource",
          "saving-throw",
          "damage",
        ].includes(operation.type))
        || !artifactValue
        || artifactValue.kind !== "effect"
        || artifactValue.reapply !== "stack"
        || artifactValue.lifecycle?.type !== "duration"
        || configuration?.schemaVersion !== 1
        || configuration?.minimumHitPoints !== 1
        || configuration?.reductionOutcome !== "failure"
        || configuration?.reductionBasis !== "ordinary-hit-point-loss"
        || configuration?.durationSeconds !== 60 * 60
        || artifactValue.lifecycle?.value !== 1
        || artifactValue.lifecycle?.units !== "hours"
      ) {
        throw new Error(
          `${handlerPath} must own one closed typed damage transaction and one stacked one-hour artifact`,
        );
      }
      if (
        !Array.isArray(handler.outcomes)
        || handler.outcomes.length !== 2
        || new Set(handler.outcomes).size !== 2
        || handler.outcomes.some(outcome => !PER_SPELL_SCRIPT_OUTCOMES.has(outcome))
        || handler.ruleId !== undefined
      ) {
        throw new Error(
          `${handlerPath}.outcomes must be exactly success and failure`,
        );
      }
    } else {
      assertString(handler.ruleId, `${handlerPath}.ruleId`);
      assertString(handler.artifactId, `${handlerPath}.artifactId`);
      const rule = rulesById.get(handler.ruleId);
      const saveOperations = (rule?.do ?? []).filter(operation =>
        operation.type === "saving-throw"
      );
      const guardedArtifactIds = (rule?.when ?? [])
        .filter(predicate =>
          predicate.type === "artifact-exists"
          && predicate.subject === "effect-target"
        )
        .map(predicate => predicate.artifactId);
      if (
        !rule
        || !["turn-start", "turn-end"].includes(rule.on?.type)
        || rule.on?.subject !== "effect-target"
        || saveOperations.length !== 1
        || (rule.do ?? []).length !== 1
        || !guardedArtifactIds.includes(handler.artifactId)
        || !artifactsById.has(handler.artifactId)
      ) {
        throw new Error(`${handlerPath} must own one guarded turn repeat-save rule`);
      }
      if (
        !Array.isArray(handler.outcomes)
        || handler.outcomes.length !== 2
        || new Set(handler.outcomes).size !== 2
        || handler.outcomes.some(outcome => !PER_SPELL_SCRIPT_OUTCOMES.has(outcome))
      ) {
        throw new Error(`${handlerPath}.outcomes must be exactly success and failure`);
      }
      if (handler.runtimeRuleId !== undefined) {
        throw new Error(`${handlerPath} cannot declare runtimeRuleId`);
      }
    }
  }
}

export function assertCleanRoomDefinition(definition) {
  if (definition?.emission?.mode !== "clean-room") {
    throw new Error(`${definition?.id ?? "Spell"} is not a clean-room definition`);
  }
  if (definition.sourceMode !== "explicit") {
    throw new Error(`${definition.id} clean-room definitions must use an explicit semantic graph`);
  }
  if (Object.keys(definition.loweringHints ?? {}).length > 0) {
    throw new Error(`${definition.id}.loweringHints is forbidden in clean-room source`);
  }
  if (Object.keys(definition.sourceAssertions ?? {}).length > 0) {
    throw new Error(`${definition.id}.sourceAssertions is forbidden in clean-room source`);
  }
  assertProviderIsolation({
    contract: definition.contract,
    fragments: definition.fragments,
  }, definition.id);
  validateContract(definition.contract, `${definition.id}.contract`);
  validateContentRef(definition.content, `${definition.id}.content`);
  if (definition.content.identifier !== definition.id) {
    throw new Error(`${definition.id}.content identifier must match the spell id`);
  }
  const actions = [];
  const artifacts = [];
  const rules = [];
  for (const [fragmentIndex, fragment] of (definition.fragments ?? []).entries()) {
    const path = `${definition.id}.fragments[${fragmentIndex}]`;
    assertExactKeys(
      fragment,
      ["id", "provides", "requires", "actions", "artifacts", "rules", "mutations"],
      path,
    );
    if ((fragment.mutations ?? []).length > 0) {
      throw new Error(`${path}.mutations are forbidden in clean-room source`);
    }
    (fragment.actions ?? []).forEach((current, index) => {
      validateAction(current, `${path}.actions[${index}]`);
      actions.push(current);
    });
    (fragment.artifacts ?? []).forEach((current, index) =>
      {
        validateArtifact(current, `${path}.artifacts[${index}]`);
        artifacts.push(current);
        if (
          definition.contract.lifetime.duration.type === "instant"
          && lifecycleContains(current.lifecycle, "while-spell-active")
        ) {
          throw new Error(
            `${path}.artifacts[${index}].lifecycle cannot use whileSpellActive() `
            + "when the spell lifetime is instant",
          );
        }
      }
    );
    (fragment.rules ?? []).forEach((current, index) => {
      validateRule(current, `${path}.rules[${index}]`);
      rules.push(current);
    });
  }
  validatePerSpellScript(definition, artifacts, rules);
  validateStaticPlacedZoneClosure(definition, artifacts, rules);
  if (
    definition.contract.level === 0
    && rules.some(currentRule =>
      (currentRule.do ?? []).some(currentOperation =>
        currentOperation.type === "consume-resource"
        && currentOperation.resource === "spell-slot"
      )
    )
  ) {
    throw new Error(
      `${definition.id} level-0 spell contracts cannot consume a spell slot`,
    );
  }
  if (
    definition.contract.level !== 0
    && rules.some(currentRule =>
      (currentRule.do ?? []).some(currentOperation =>
        ["damage", "healing"].includes(currentOperation.type)
        && currentOperation.formula?.type === "cantrip-progression"
      )
    )
  ) {
    throw new Error(
      `${definition.id} cantripProgression requires a level-0 spell contract`,
    );
  }
  const artifactsById = new Map(artifacts.map(artifact => [artifact.id, artifact]));
  const rulesById = new Map(rules.map(current => [current.id, current]));
  for (const pending of artifacts.filter(artifact => artifact.state?.outcomeRace)) {
    const race = pending.state.outcomeRace;
    const sourceBound = race.profile === "source-bound-natural-expiry";
    const repeatRule = rulesById.get(race.repeatSaveRuleId);
    if (
      !repeatRule
      || repeatRule.on?.type !== "turn-end"
      || repeatRule.on?.subject !== "effect-target"
      || (repeatRule.do ?? []).length !== 1
      || repeatRule.do[0]?.type !== "saving-throw"
    ) {
      throw new Error(
        `${definition.id}.artifact.${pending.id} outcome race requires one `
        + `effect-target turn-end saving throw rule ${race.repeatSaveRuleId}`,
      );
    }
    const entryOperations = rules.flatMap(current => current.do ?? []).filter(operation =>
      operation.id === race.entry.operationId
    );
    if (
      entryOperations.length !== 1
      || entryOperations[0].type !== (sourceBound ? "saving-throw" : "attack-roll")
    ) {
      throw new Error(
        `${definition.id}.artifact.${pending.id} outcome race requires one `
        + `entry ${sourceBound ? "saving throw" : "attack roll"} `
        + race.entry.operationId,
      );
    }
    const terminal = artifactsById.get(race.failureArtifactId);
    if (
      !terminal
      || terminal.kind !== "effect"
      || terminal.identity?.scope !== "source-target"
      || terminal.id === pending.id
    ) {
      throw new Error(
        `${definition.id}.artifact.${pending.id} outcome race requires a distinct `
        + `source-target failure artifact ${race.failureArtifactId}`,
      );
    }
    if (sourceBound) {
      const permanent = artifactsById.get(race.naturalExpiryArtifactId);
      if (
        !permanent
        || permanent.kind !== "effect"
        || permanent.identity?.scope !== "source-target"
        || permanent.id === pending.id
        || permanent.id === terminal.id
        || permanent.lifecycle?.type !== "manual"
      ) {
        throw new Error(
          `${definition.id}.artifact.${pending.id} outcome race requires a distinct `
          + `manual natural-expiry artifact ${race.naturalExpiryArtifactId}`,
        );
      }
      if (pending.state.sourceTermination?.type !== "last-dependent-ended") {
        throw new Error(
          `${definition.id}.artifact.${pending.id} outcome race requires `
          + "endSourceWhenLastDependentEnds()",
        );
      }
    } else if (pending.state.sourceTermination !== undefined) {
      throw new Error(
        `${definition.id}.artifact.${pending.id} independent-terminal outcome race `
        + "cannot terminate its source",
      );
    }
  }
  const parameterDefinitions = new Map();
  const expandedActionIds = new Set();
  for (const action of actions) {
    const parameter = (action.parameters ?? []).find(current =>
      current.lowering === "named-actions"
    );
    const actionIds = parameter
      ? parameter.values.map(value => `${action.id}:${value}`)
      : [action.id];
    for (const actionId of actionIds) {
      if (expandedActionIds.has(actionId)) {
        throw new Error(
          `${definition.id} named-action expansion creates duplicate action id ${actionId}`,
        );
      }
      expandedActionIds.add(actionId);
    }
    for (const current of action.parameters ?? []) {
      const definitions = parameterDefinitions.get(current.id) ?? [];
      definitions.push(current);
      parameterDefinitions.set(current.id, definitions);
    }
  }
  const declaredParameterIds = new Set(parameterDefinitions.keys());
  for (const artifact of artifacts) {
    const references = [];
    const visit = value => {
      if (isParameterValue(value)) {
        references.push(value.id);
        return;
      }
      if (Array.isArray(value)) {
        value.forEach(visit);
        return;
      }
      if (!value || typeof value !== "object") return;
      Object.values(value).forEach(visit);
    };
    visit(artifact);
    for (const parameterId of references) {
      if (!declaredParameterIds.has(parameterId)) {
        throw new Error(
          `${definition.id}.artifact.${artifact.id} references undeclared action parameter `
          + parameterId,
        );
      }
    }
    for (const modifier of artifact.state?.modifiers ?? []) {
      if (
        modifier.type !== "grant-resistance"
        || !isParameterValue(modifier.damageType)
      ) {
        continue;
      }
      const definitions = parameterDefinitions.get(modifier.damageType.id) ?? [];
      const unsupportedValues = definitions
        .flatMap(parameter => parameter.values)
        .filter(value => !DAMAGE_TYPES.has(value));
      if (unsupportedValues.length > 0) {
        throw new Error(
          `${definition.id}.artifact.${artifact.id} resistance parameter `
          + `${modifier.damageType.id} has unsupported damage type values: `
          + [...new Set(unsupportedValues)].join(", "),
        );
      }
    }
  }
  const maximizesHealingReceived = artifacts.some(artifact =>
    (artifact.state?.modifiers ?? []).some(modifier =>
      modifier.type === "maximize-healing-received"
    )
  );
  if (
    maximizesHealingReceived
    && (
      definition.support?.level === "full"
      || (definition.support?.omissions ?? []).length === 0
    )
  ) {
    throw new Error(
      `${definition.id} maximizeHealingReceived() requires non-full support `
      + "with explicit omissions until an exact per-target healing runtime exists",
    );
  }
  for (const action of actions) {
    for (const availability of action.availableWhen ?? []) {
      const required = artifactsById.get(availability.artifactId);
      if (!required) {
        throw new Error(
          `${definition.id}.actions.${action.id}.availableWhen references missing artifact `
          + availability.artifactId,
        );
      }
      if (
        required.kind !== "effect"
        || required.role !== "mechanical"
        || required.identity?.scope !== "source"
      ) {
        throw new Error(
          `${definition.id}.actions.${action.id}.availableWhen artifact `
          + `${availability.artifactId} must be a source-scoped mechanical effect`,
        );
      }
    }
  }
  const presentationBySourceArtifactId = new Map();
  for (const visual of artifacts.filter(artifact => artifact.kind === "visual")) {
    const sourceArtifactId = visual.lifecycle.artifactId;
    const sourceArtifact = artifactsById.get(sourceArtifactId);
    if (!sourceArtifact) {
      throw new Error(
        `${definition.id}.artifact.${visual.id} references missing source artifact `
        + sourceArtifactId,
      );
    }
    if (
      sourceArtifact.kind !== "effect"
      || sourceArtifact.role !== "mechanical"
      || sourceArtifact.identity?.scope !== "source"
    ) {
      throw new Error(
        `${definition.id}.artifact.${visual.id} source artifact ${sourceArtifactId} `
        + "must be a source-scoped mechanical effect",
      );
    }
    const existingPresentation = presentationBySourceArtifactId.get(
      sourceArtifactId,
    );
    if (existingPresentation) {
      throw new Error(
        `${definition.id}.artifact.${visual.id} and ${existingPresentation.id} `
        + `both decorate source artifact ${sourceArtifactId}; clean-room emission `
        + "supports exactly one presentation per mechanical source",
      );
    }
    presentationBySourceArtifactId.set(sourceArtifactId, visual);
    if (visual.state.membership === "dynamic") {
      const sourceApplications = rules.flatMap(currentRule =>
        (currentRule.do ?? [])
          .filter(currentOperation =>
            currentOperation.type === "apply-artifact"
            && currentOperation.artifactId === sourceArtifactId
            && currentOperation.target === "source"
          )
          .map(currentOperation => ({
            rule: currentRule,
            operation: currentOperation,
          }))
      );
      if (
        sourceApplications.length !== 1
        || sourceApplications[0].rule.on?.type !== "action-used"
      ) {
        throw new Error(
          `${definition.id}.artifact.${visual.id} dynamic membership source `
          + `${sourceArtifactId} requires exactly one action-used apply-artifact `
          + `operation targeting source; received ${sourceApplications.length}`,
        );
      }
    }
  }
  if (!actions.some(action => action.id === definition.contract.primaryActionId)) {
    throw new Error(
      `${definition.id}.contract.primaryActionId references missing action `
      + definition.contract.primaryActionId,
    );
  }
  return true;
}

function tierStepIndicator(selector, minimum) {
  // Foundry Roll formulas do not support JavaScript ternaries. Cast levels are
  // discrete. Floor any legal numeric selector before clamping so tiers()
  // remains a step function even when a custom expression yields a fraction.
  return `min(1,max(0,floor(${selector})-(${minimum})+1))`;
}

function tierFormula(value, { baseLevel, profile }) {
  const entries = [...value.entries]
    .sort((left, right) => Number(left.minimum) - Number(right.minimum));
  if (!entries.length) throw new Error("tiers() requires at least one entry");
  const selector = expressionFormula(value.selector, { baseLevel, profile });

  const constants = entries.every(entry => entry.value?.type === "constant");
  if (constants) {
    let previous = Number(entries[0].value.value);
    const terms = [String(previous)];
    for (const entry of entries.slice(1)) {
      const current = Number(entry.value.value);
      const delta = current - previous;
      if (delta !== 0) {
        terms.push(
          `(${delta})*${tierStepIndicator(selector, entry.minimum)}`,
        );
      }
      previous = current;
    }
    return terms.length === 1 ? terms[0] : `(${terms.join("+")})`;
  }

  const dice = entries.every(entry => entry.value?.type === "dice");
  const faces = Number(entries[0].value?.faces);
  if (
    dice
    && Number.isInteger(faces)
    && faces > 1
    && entries.every(entry =>
      Number(entry.value.faces) === faces
      && Number.isInteger(Number(entry.value.count))
      && Number(entry.value.count) > 0
    )
  ) {
    let previous = Number(entries[0].value.count);
    const terms = [String(previous)];
    for (const entry of entries.slice(1)) {
      const current = Number(entry.value.count);
      const delta = current - previous;
      if (delta !== 0) {
        terms.push(
          `(${delta})*${tierStepIndicator(selector, entry.minimum)}`,
        );
      }
      previous = current;
    }
    const count = terms.length === 1 ? terms[0] : `(${terms.join("+")})`;
    return `(${count})d${faces}`;
  }

  throw new Error(
    "tiers() Roll lowering requires constants or dice with one denomination",
  );
}

function expressionFormula(value, {
  baseLevel,
  profile,
} = {}) {
  if (!isValueExpression(value)) return String(value ?? "");
  switch (value.type) {
    case "constant":
      return String(value.value);
    case "dice":
      return `${value.count}d${value.faces}`;
    case "add":
      return value.terms.map(term => expressionFormula(term, { baseLevel, profile })).join("+");
    case "multiply": {
      if (value.factors.length === 2) {
        const negativeOneIndex = value.factors.findIndex(factor =>
          factor.type === "constant" && factor.value === -1
        );
        if (negativeOneIndex >= 0) {
          const other = value.factors[negativeOneIndex === 0 ? 1 : 0];
          const formula = expressionFormula(other, { baseLevel, profile });
          return [
            "constant",
            "dice",
            "cast-level",
            "levels-above-base",
            "spellcasting-modifier",
            "spell-attack-bonus",
            "spell-save-dc",
          ]
            .includes(other.type)
            ? `-${formula}`
            : `-(${formula})`;
        }
      }
      return value.factors
        .map(factor => `(${expressionFormula(factor, { baseLevel, profile })})`)
        .join("*");
    }
    case "cast-level":
      return profile.expressions.castLevel;
    case "levels-above-base":
      return `max(0,(${profile.expressions.castLevel})-(${baseLevel}))`;
    case "spellcasting-modifier":
      return profile.expressions.spellcastingModifier;
    case "spell-attack-bonus":
      return "@spellAttackBonus";
    case "spell-save-dc":
      return "@spellSaveDc";
    case "actual-damage":
      return "@actualDamage";
    case "round-down":
      return `floor(${expressionFormula(value.value, { baseLevel, profile })})`;
    case "tiers":
      return tierFormula(value, { baseLevel, profile });
    case "per-slot-above-base":
      return expressionFormula(value.base, { baseLevel, profile });
    case "cantrip-progression":
      return expressionFormula(value.base, { baseLevel, profile });
    default:
      throw new Error(`Cannot lower ValueExpression ${value.type}`);
  }
}

function spatialExpressionFormula(value, options = {}) {
  if (!isValueExpression(value)) return String(value ?? "");
  switch (value.type) {
    case "constant":
      return String(value.value);
    case "cast-level":
      return options.profile.expressions.castLevel;
    case "levels-above-base":
      return `max(0,(${options.profile.expressions.castLevel})-(${options.baseLevel}))`;
    case "add":
      return value.terms
        .map(term => `(${spatialExpressionFormula(term, options)})`)
        .join("+");
    case "multiply":
      return value.factors
        .map(factor => `(${spatialExpressionFormula(factor, options)})`)
        .join("*");
    case "per-slot-above-base": {
      const base = spatialExpressionFormula(value.base, options);
      const increment = spatialExpressionFormula(value.increment, options);
      const levels = `max(0,(${options.profile.expressions.castLevel})-(${options.baseLevel}))`;
      return `(${base})+(${increment})*(${levels})`;
    }
    case "round-down":
      return `floor(${spatialExpressionFormula(value.value, options)})`;
    default:
      throw new Error(`Cannot lower spatial ValueExpression ${value.type}`);
  }
}

function affineCardinality(value, {
  baseLevel,
} = {}) {
  if (!isValueExpression(value)) {
    const number = Number(value);
    if (!Number.isFinite(number)) {
      throw new Error(`Target cardinality ${value} is not numeric`);
    }
    return { castLevel: 0, constant: number };
  }
  if (value.type === "constant") {
    return { castLevel: 0, constant: value.value };
  }
  if (value.type === "cast-level") {
    return { castLevel: 1, constant: 0 };
  }
  if (value.type === "levels-above-base") {
    // dnd5e cannot cast a spell below its base level. Avoid leaking max()
    // into the CLI contract, whose expression grammar intentionally remains
    // limited to arithmetic.
    return { castLevel: 1, constant: -baseLevel };
  }
  if (value.type === "add") {
    return value.terms
      .map(term => affineCardinality(term, { baseLevel }))
      .reduce((total, current) => ({
        castLevel: total.castLevel + current.castLevel,
        constant: total.constant + current.constant,
      }), { castLevel: 0, constant: 0 });
  }
  if (value.type === "multiply") {
    let coefficient = { castLevel: 0, constant: 1 };
    for (const factor of value.factors) {
      const current = affineCardinality(factor, { baseLevel });
      if (coefficient.castLevel !== 0 && current.castLevel !== 0) {
        throw new Error("Target cardinality expressions must remain linear in castLevel()");
      }
      coefficient = {
        castLevel:
          coefficient.castLevel * current.constant
          + current.castLevel * coefficient.constant,
        constant: coefficient.constant * current.constant,
      };
    }
    return coefficient;
  }
  throw new Error(
    `Target cardinality cannot use ${value.type}; only constant, castLevel(), `
    + "levelsAboveBase(), add() and constant multiplication are supported",
  );
}

function cardinalityFormula(value, {
  baseLevel,
  profile,
} = {}) {
  const affine = affineCardinality(value, { baseLevel });
  if (!Number.isInteger(affine.castLevel) || !Number.isInteger(affine.constant)) {
    throw new Error("Target cardinality must lower to integer coefficients");
  }
  const castLevel = profile.expressions.castLevel;
  const parts = [];
  if (affine.castLevel === 1) {
    parts.push(castLevel);
  } else if (affine.castLevel === -1) {
    parts.push(`-${castLevel}`);
  } else if (affine.castLevel !== 0) {
    parts.push(`${affine.castLevel}*${castLevel}`);
  }
  if (affine.constant !== 0 || parts.length === 0) {
    const sign = affine.constant > 0 && parts.length > 0 ? "+" : "";
    parts.push(`${sign}${affine.constant}`);
  }
  return parts.join("");
}

function lowerRollExpression(value, options) {
  if (!["per-slot-above-base", "cantrip-progression"].includes(value.type)) {
    return { formula: expressionFormula(value, options) };
  }
  if (value.type === "cantrip-progression" && options.baseLevel !== 0) {
    throw new Error(
      "cantripProgression() is only valid for a level-0 spell contract",
    );
  }
  const increment = value.increment;
  return {
    formula: expressionFormula(value.base, options),
    scaling: increment.type === "dice"
      ? {
          mode: value.type === "cantrip-progression"
            ? "character-level"
            : "slot-level",
          number: increment.count,
          formula: "",
        }
      : {
          mode: value.type === "cantrip-progression"
            ? "character-level"
            : "slot-level",
          number: 0,
          formula: expressionFormula(increment, options),
        },
  };
}

function lowerModifier(modifier, options) {
  const formula = modifier.value
    ? expressionFormula(modifier.value, options)
    : null;
  if (modifier.type === "bonus" && modifier.selector.type === "all-attack-rolls") {
    return {
      changes: ["mwak", "msak", "rwak", "rsak"].map(attack => ({
        type: "attack-bonus",
        attack,
        value: formula,
        mode: 2,
        priority: 20,
      })),
    };
  }
  if (modifier.type === "bonus" && modifier.selector.type === "all-ability-checks") {
    return {
      changes: [{
        type: "ability-check-bonus",
        value: formula,
        mode: 2,
        priority: 20,
      }],
    };
  }
  if (modifier.type === "optional-roll-bonus") {
    return {
      optionalRollBonuses: [{
        selector: modifier.selector.type,
        formula,
        uses: modifier.uses,
        label: modifier.label,
      }],
    };
  }
  if (modifier.type === "bonus" && modifier.selector.type === "all-saving-throws") {
    return {
      changes: [{ type: "save-bonus", value: formula, mode: 2, priority: 20 }],
    };
  }
  if (modifier.type === "bonus" && modifier.selector.type === "ability-saving-throws") {
    return {
      changes: modifier.selector.abilities.map(ability => ({
        type: "ability-save-bonus",
        ability,
        value: formula,
        mode: 2,
        priority: 20,
      })),
    };
  }
  if (modifier.type === "armor-class-bonus") {
    return {
      changes: [{
        type: "ac-bonus",
        value: formula,
        mode: 2,
        priority: 20,
      }],
    };
  }
  if (modifier.type === "skill-check-bonus") {
    return {
      changes: [{
        type: "provider-change",
        key: `system.skills.${modifier.skill}.bonuses.check`,
        value: formula,
        mode: 2,
        priority: 20,
      }],
    };
  }
  if (modifier.type === "skill-check-disadvantage") {
    return {
      changes: [{
        type: "provider-change",
        key: `flags.midi-qol.disadvantage.skill.${modifier.skill}`,
        value: "1",
        mode: 5,
        priority: 20,
      }],
    };
  }
  if (modifier.type === "grant-status") return { statuses: [modifier.status] };
  if (modifier.type === "grant-condition-immunity") {
    return {
      changes: [{
        type: "condition-immunity",
        value: modifier.condition,
        mode: 2,
        priority: 20,
      }],
    };
  }
  if (modifier.type === "grant-damage-immunity") {
    return {
      changes: [{
        type: "damage-immunity",
        value: modifier.damageType,
        mode: 2,
        priority: 20,
      }],
    };
  }
  if (modifier.type === "set-movement") {
    return {
      changes: [{
        type: "provider-change",
        key: `system.attributes.movement.${modifier.movement}`,
        value: formula,
        mode: 5,
        priority: 20,
      }],
    };
  }
  if (modifier.type === "increase-movement") {
    return {
      changes: [{
        type: "movement-increase",
        movement: modifier.movement,
        value: formula,
        mode: 2,
        priority: 20,
      }],
    };
  }
  if (modifier.type === "minimum-movement") {
    return {
      changes: [{
        type: "provider-change",
        key: `system.attributes.movement.${modifier.movement}`,
        value: formula,
        mode: 4,
        priority: 20,
      }],
    };
  }
  if (modifier.type === "minimum-sense-range") {
    return {
      changes: [{
        type: "provider-change",
        key: `system.attributes.senses.ranges.${modifier.sense}`,
        value: formula,
        mode: 4,
        priority: 20,
      }],
    };
  }
  if (modifier.type === "minimum-token-light") {
    return {
      changes: [
        {
          type: "provider-change",
          key: "ATL.light.bright",
          value: expressionFormula(modifier.bright, options),
          mode: 4,
          priority: 20,
        },
        {
          type: "provider-change",
          key: "ATL.light.dim",
          value: expressionFormula(modifier.dim, options),
          mode: 4,
          priority: 20,
        },
      ],
    };
  }
  if (modifier.type === "set-all-movement") {
    return {
      changes: [{ type: "movement-all", value: formula, mode: 0, priority: 20 }],
    };
  }
  if (modifier.type === "increase-all-movement") {
    return {
      changes: [{
        type: "movement-all-increase",
        value: formula,
        mode: 0,
        priority: 20,
      }],
    };
  }
  if (modifier.type === "decrease-all-movement") {
    return {
      changes: [{
        type: "movement-all-decrease",
        value: formula,
        mode: 0,
        priority: 20,
      }],
    };
  }
  if (modifier.type === "scale-all-movement") {
    return {
      changes: ["burrow", "climb", "fly", "swim", "walk"].map(movement => ({
        type: "provider-change",
        key: `system.attributes.movement.${movement}`,
        value: formula,
        mode: 1,
        priority: 20,
      })),
    };
  }
  if (modifier.type === "grant-hover") {
    return {
      changes: [{ type: "grant-hover", value: true, mode: 0, priority: 20 }],
    };
  }
  if (modifier.type === "grant-resistance") {
    return {
      changes: [{
        type: "damage-resistance",
        value: isParameterValue(modifier.damageType)
          ? `$parameter.${modifier.damageType.id}`
          : modifier.damageType,
        mode: 2,
        priority: 20,
      }],
    };
  }
  if (modifier.type === "grant-nonmagical-damage-resistance") {
    return {
      changes: [{
        type: "grant-nonmagical-damage-resistance",
        value: true,
        mode: 0,
        priority: 20,
      }],
    };
  }
  if (modifier.type === "drop-to-one-hit-point-on-damage") {
    return {
      runtimeModifiers: [{
        type: "fatal-damage-interception",
        version: 1,
        minimumHitPoints: 1,
      }],
    };
  }
  if (modifier.type === "block-healing") {
    return {
      changes: [{
        type: "healing-immunity",
        value: "healing",
        mode: 2,
        priority: 20,
      }],
    };
  }
  if (modifier.type === "block-vocal-spell") {
    return {
      changes: [{
        type: "block-vocal-spell",
        value: true,
        mode: 5,
        priority: 20,
      }],
    };
  }
  if (modifier.type === "grant-saving-throw-advantage") {
    return {
      savingThrowAdvantage: {
        against: [...modifier.against],
      },
    };
  }
  if (modifier.type === "grant-ability-saving-throw-advantage") {
    return {
      changes: modifier.abilities.map(ability => ({
        type: "grant-ability-saving-throw-advantage",
        ability,
        value: true,
        mode: 5,
        priority: 20,
      })),
    };
  }
  if (modifier.type === "grant-death-saving-throw-advantage") {
    return {
      changes: [{
        type: "grant-death-saving-throw-advantage",
        value: true,
        mode: 2,
        priority: 20,
      }],
    };
  }
  if (modifier.type === "maximize-healing-received") {
    return {
      changes: [{
        type: "maximize-healing-received",
        value: true,
        mode: 5,
        priority: 20,
      }],
    };
  }
  if (modifier.type === "grant-attack-advantage") {
    return {
      changes: [{ type: "grant-attack-advantage", value: true, mode: 5, priority: 20 }],
    };
  }
  if (modifier.type === "gain-attack-advantage") {
    return {
      changes: [{ type: "gain-attack-advantage", value: true, mode: 5, priority: 20 }],
    };
  }
  if (modifier.type === "gain-attack-disadvantage") {
    return {
      changes: [{
        type: "gain-attack-disadvantage",
        value: true,
        mode: 5,
        priority: 20,
      }],
    };
  }
  if (modifier.type === "grant-incoming-attack-disadvantage") {
    return {
      changes: [{
        type: "provider-change",
        key: "flags.midi-qol.grants.disadvantage.attack.all",
        value: `${JSON.stringify(modifier.attackerCreatureTypes)}.includes(actor.raceOrType)`,
        mode: 0,
        priority: 20,
      }],
    };
  }
  if (modifier.type === "grant-weapon-attack-damage-resistance") {
    return {
      runtimeModifiers: [{
        type: "weapon-attack-damage-resistance",
        version: 1,
        damageTypes: [...modifier.damageTypes],
        weaponMagic: modifier.weaponMagic,
      }],
    };
  }
  if (
    modifier.type
    === "next-turn-attack-advantage-against-marked-target"
  ) {
    return {
      runtimeModifiers: [{
        type: "next-turn-attack-advantage-against-marked-target",
      }],
    };
  }
  if (modifier.type === "scale-jump-distance") {
    return {
      changes: [{
        type: "provider-change",
        key: "system.attributes.movement.jump",
        value: formula,
        mode: 1,
        priority: 20,
      }],
    };
  }
  if (
    modifier.type
    === "grant-sight-dependent-incoming-attack-disadvantage"
  ) {
    return {
      runtimeModifiers: [{
        type: "sight-dependent-incoming-attack-disadvantage",
      }],
    };
  }
  if (modifier.type === "transform-physical-size") {
    return {
      runtimeModifiers: [{
        type: "transform-physical-size",
        sizeCategorySteps: modifier.sizeCategorySteps,
        dimensionScale: expressionFormula(
          modifier.dimensionScale,
          options,
        ),
        weightScale: expressionFormula(modifier.weightScale, options),
        tokenFootprint: modifier.tokenFootprint,
      }],
    };
  }
  if (modifier.type === "grant-ability-check-advantage") {
    return {
      changes: modifier.abilities.map(ability => ({
        type: "grant-ability-check-advantage",
        ability,
        value: true,
        mode: 5,
        priority: 20,
      })),
    };
  }
  if (modifier.type === "grant-ability-check-disadvantage") {
    if (
      modifier.abilities.length === 1
      && isParameterValue(modifier.abilities[0])
    ) {
      return {
        runtimeModifiers: [{
          type: "ability-check-disadvantage-selection",
          parameterId: modifier.abilities[0].id,
        }],
      };
    }
    return {
      changes: modifier.abilities.map(ability => ({
        type: "grant-ability-check-disadvantage",
        ability,
        value: true,
        mode: 5,
        priority: 20,
      })),
    };
  }
  if (modifier.type === "grant-ability-saving-throw-disadvantage") {
    return {
      changes: modifier.abilities.map(ability => ({
        type: "grant-ability-saving-throw-disadvantage",
        ability,
        value: true,
        mode: 5,
        priority: 20,
      })),
    };
  }
  if (modifier.type === "adjust-weapon-hit-damage") {
    return {
      changes: [{
        type: "provider-change",
        key: "system.bonuses.weapon.damage",
        value: modifier.direction === "subtract"
          ? `-${formula}`
          : formula,
        mode: 2,
        priority: 20,
      }],
      ...(modifier.minimumTotal !== undefined
        ? {
            runtimeModifiers: [{
              type: "weapon-damage-minimum-total",
              minimumTotal: expressionFormula(
                modifier.minimumTotal,
                options,
              ),
            }],
          }
        : {}),
    };
  }
  if (modifier.type === "scale-weapon-hit-damage") {
    return {
      runtimeModifiers: [{
        type: "weapon-hit-damage-scale",
        abilities: [...modifier.abilities],
        multiplier: expressionFormula(modifier.multiplier, options),
      }],
    };
  }
  if (modifier.type === "weapon-hit-damage-rider") {
    return {
      changes: ["mwak", "rwak"].map(attack => ({
        type: "damage-bonus",
        attack,
        value: `${formula}[${modifier.damageType}]`,
        mode: 2,
        priority: 20,
      })),
    };
  }
  if (modifier.type === "block-action-kinds") {
    return { blockedActionKinds: [...modifier.kinds] };
  }
  throw new Error(`Cannot lower modifier ${modifier.type}`);
}

function concreteSpellLifecycle(contract) {
  const durationValue = clone(contract.lifetime.duration);
  if (!contract.lifetime.concentration) return durationValue;
  return {
    primitive: "lifecycle",
    type: "first-of",
    values: [
      durationValue,
      {
        primitive: "lifecycle",
        type: "while-artifact",
        artifactId: "concentration",
      },
    ],
  };
}

function lowerLifecycle(value, contract, options) {
  if (value.type === "while-spell-active") {
    return lowerLifecycle(concreteSpellLifecycle(contract), contract, options);
  }
  const lowered = clone(value);
  if (lowered.type === "duration" && isValueExpression(lowered.value)) {
    lowered.value = expressionFormula(lowered.value, options);
  }
  if (lowered.type === "first-of") {
    lowered.values = lowered.values.map(child =>
      lowerLifecycle(child, contract, options)
    );
  }
  return lowered;
}

function lowerTargetQuery(value, options) {
  const lowered = clone(value);
  for (const key of ["min", "max"]) {
    if (isValueExpression(lowered.cardinality?.[key])) {
      lowered.cardinality[key] = cardinalityFormula(lowered.cardinality[key], options);
    }
  }
  if (lowered.origin?.type === "placed-template") {
    for (const key of ["size", "width", "height"]) {
      if (isValueExpression(lowered.origin.shape?.[key])) {
        lowered.origin.shape[key] = spatialExpressionFormula(
          lowered.origin.shape[key],
          options,
        );
      }
    }
  }
  return lowered;
}

function lowerOperation(value, options) {
  const lowered = clone(value);
  if (isValueExpression(lowered.formula)) {
    const formulaExpression = clone(lowered.formula);
    const linkedResult = operationResultReferences(lowered.formula).length > 0;
    const postMitigationDamage = actualDamageReferences(lowered.formula).length > 0;
    if (linkedResult) {
      lowered.formulaExpression = clone(lowered.formula);
      delete lowered.formula;
    } else {
      Object.assign(lowered, lowerRollExpression(lowered.formula, options));
      if (
        formulaExpression.type === "tiers"
        || formulaExpression.type === "cantrip-progression"
        || postMitigationDamage
        || lowered.type === "grant-temporary-hp"
        || lowered.type === "allocate-hit-point-pool"
        || lowered.type === "grant-hit-point-capacity"
      ) {
        lowered.formulaExpression = formulaExpression;
      }
    }
  }
  if (lowered.type === "attack-roll") {
    lowered.attackType = lowered.attack.range;
    lowered.attackSource = lowered.attack.source;
    delete lowered.attack;
  }
  if (lowered.type === "damage" && lowered.properties) {
    lowered.properties = lowered.properties.map(property =>
      property === "magical" ? "mgc" : property
    );
  }
  if (
    lowered.type === "damage"
    && lowered.attachment === "triggering-attack"
  ) {
    lowered.rollIntegration = "parent-damage-roll";
    lowered.critical = "midi-qol";
    delete lowered.attachment;
  }
  if (lowered.type === "grant-attack-advantage") {
    lowered.type = "emit-event";
    lowered.event = "grant-attack-advantage";
    delete lowered.scope;
    lowered.scope = "triggering-attack";
  }
  return lowered;
}

function lowerArtifact(value, contract, options) {
  if (value.kind === "zone") {
    const lowered = clone(value);
    for (const key of ["radius", "size", "width", "height"]) {
      if (isValueExpression(lowered.state?.shape?.[key])) {
        lowered.state.shape[key] = spatialExpressionFormula(
          lowered.state.shape[key],
          options,
        );
      }
    }
    lowered.lifecycle = lowerLifecycle(lowered.lifecycle, contract, options);
    return lowered;
  }
  if (value.kind === "entity") {
    const lowered = clone(value);
    lowered.state.deltaBindings = value.state.deltaBindings.map(binding => ({
      slot: binding.slot,
      ...lowerRollExpression(binding.value, options),
    }));
    lowered.lifecycle = lowerLifecycle(lowered.lifecycle, contract, options);
    return lowered;
  }
  if (value.kind === "marker") {
    const lowered = clone(value);
    lowered.lifecycle = lowerLifecycle(lowered.lifecycle, contract, options);
    return lowered;
  }
  if (!LOWERABLE_REAPPLY_POLICIES.has(value.reapply)) {
    throw new Error(
      `${value.id} reapply policy ${value.reapply} has no registered Runtime Profile lowering`,
    );
  }
  const lowered = clone(value);
  if (lowered.kind === "visual") {
    lowered.lifecycle = lowerLifecycle(lowered.lifecycle, contract, options);
    return lowered;
  }
  if (lowered.kind === "enchantment") {
    const magical = value.state.modifiers.find(
      modifier => modifier.type === "grant-magical-weapon",
    );
    const bonus = value.state.modifiers.find(
      modifier => modifier.type === "weapon-attack-and-damage-bonus",
    );
    const attackBonus = value.state.modifiers.find(
      modifier => modifier.type === "weapon-attack-bonus",
    );
    const hitDamageRider = value.state.modifiers.find(
      modifier => modifier.type === "weapon-hit-damage-rider",
    );
    const baseDamageDie = value.state.modifiers.find(
      modifier => modifier.type === "replace-weapon-base-damage-die",
    );
    const spellcastingAttack = value.state.modifiers.some(
      modifier => modifier.type === "use-spellcasting-ability-for-weapon-attacks",
    );
    lowered.state = compactObject({
      name: value.state.name,
      img: value.state.img,
      magical: Boolean(magical),
      attackAndDamageBonus: clone(bonus?.value),
      attackBonus: clone(attackBonus?.value),
      hitDamageRider: hitDamageRider
        ? {
            value: clone(hitDamageRider.value),
            damageType: clone(hitDamageRider.damageType),
          }
        : undefined,
      baseDamageDie: clone(baseDamageDie?.value),
      spellcastingAttack,
    });
    lowered.lifecycle = lowerLifecycle(lowered.lifecycle, contract, options);
    return lowered;
  }
  const state = {
    ...lowered.state,
    statuses: [],
    changes: [],
    blockedActionKinds: [],
    optionalRollBonuses: [],
    savingThrowAdvantageAgainst: [],
    runtimeModifiers: [],
  };
  delete state.modifiers;
  for (const modifier of value.state.modifiers ?? []) {
    const result = lowerModifier(modifier, options);
    state.statuses.push(...(result.statuses ?? []));
    state.changes.push(...(result.changes ?? []));
    state.blockedActionKinds.push(...(result.blockedActionKinds ?? []));
    state.optionalRollBonuses.push(...(result.optionalRollBonuses ?? []));
    state.runtimeModifiers.push(...(result.runtimeModifiers ?? []));
    state.savingThrowAdvantageAgainst.push(
      ...(result.savingThrowAdvantage?.against ?? []),
    );
  }
  if (state.statuses.length === 0) delete state.statuses;
  if (state.changes.length === 0) delete state.changes;
  if (state.blockedActionKinds.length === 0) delete state.blockedActionKinds;
  if (state.optionalRollBonuses.length === 0) delete state.optionalRollBonuses;
  if (state.runtimeModifiers.length === 0) delete state.runtimeModifiers;
  if (state.savingThrowAdvantageAgainst.length > 0) {
    state.savingThrowAdvantage = {
      against: [...new Set(state.savingThrowAdvantageAgainst)],
    };
  }
  delete state.savingThrowAdvantageAgainst;
  lowered.state = state;
  lowered.lifecycle = lowerLifecycle(lowered.lifecycle, contract, options);
  return lowered;
}

export function prepareCleanRoomFragments(definition, runtimeProfile = {}) {
  assertCleanRoomDefinition(definition);
  const profile = resolveSpellAutomationRuntimeProfile(runtimeProfile);
  if (profile.ruleset !== definition.contract.ruleset) {
    throw new Error(
      `${definition.id} ruleset ${definition.contract.ruleset} does not match runtime profile `
      + profile.ruleset,
    );
  }
  const options = {
    baseLevel: definition.contract.level,
    profile,
  };
  const fragments = clone(definition.fragments).map(fragment => ({
    ...fragment,
    actions: clone(fragment.actions ?? []),
    artifacts: (fragment.artifacts ?? []).map(value =>
      lowerArtifact(value, definition.contract, options)
    ),
    rules: (fragment.rules ?? []).map(current => ({
      ...current,
      targets: (current.targets ?? []).map(value => lowerTargetQuery(value, options)),
      do: (current.do ?? []).map(value => lowerOperation(value, options)),
    })),
    mutations: [],
  }));
  if (definition.contract.lifetime.concentration) {
    fragments.push({
      id: "clean-room-spell-lifetime",
      provides: ["concentration"],
      requires: [],
      actions: [],
      artifacts: [{
        primitive: "artifact",
        id: "concentration",
        kind: "effect",
        role: "mechanical",
        host: "actor",
        identity: { scope: "source", keys: ["sourceUuid"] },
        reapply: "replace",
        state: { concentration: true },
        lifecycle: lowerLifecycle(
          definition.contract.lifetime.duration,
          definition.contract,
          options,
        ),
      }],
      rules: [],
      mutations: [],
    });
  }
  return {
    fragments,
    runtimeProfile: profile,
  };
}

export function sanitizeCleanRoomRichText(value) {
  return String(value ?? "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<(?:input|select|option|textarea)\b[^>]*>[\s\S]*?<\/(?:select|option|textarea)\s*>/gi, "")
    .replace(/<(?:input)\b[^>]*\/?\s*>/gi, "")
    .replace(/<\/?(?:button|form)\b[^>]*>/gi, "")
    .replace(
      /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
      "",
    )
    .replace(
      /\s+data-(?:action|macro|command)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
      "",
    )
    .replace(
      /\b(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi,
      '$1="#"',
    )
    .replace(/@(?:ItemMacro|Macro)\[[^\]]*\](?:\{[^}]*\})?/gi, "");
}

function sanitizeDescription(value) {
  return {
    value: sanitizeCleanRoomRichText(value?.value),
    chat: sanitizeCleanRoomRichText(value?.chat),
  };
}

function sanitizeSourceCitation(value) {
  return {
    custom: String(value?.custom ?? ""),
    book: String(value?.book ?? ""),
    page: String(value?.page ?? ""),
    license: String(value?.license ?? ""),
    rules: String(value?.rules ?? "2014"),
    revision: Number(value?.revision ?? 1),
  };
}

function sanitizeLocalization(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const localized = {};
  for (const [locale, entry] of Object.entries(value)) {
    if (!/^[A-Za-z0-9_-]+$/.test(locale) || !entry || typeof entry !== "object") continue;
    localized[locale] = compactObject({
      name: entry.name === undefined
        ? undefined
        : sanitizeCleanRoomRichText(entry.name),
      description: entry.description === undefined
        ? undefined
        : sanitizeDescription(entry.description),
    });
  }
  return Object.keys(localized).length > 0 ? localized : undefined;
}

export function importCleanRoomContent(sourceItem, reference) {
  validateContentRef(reference, `${reference?.identifier ?? "spell"}.content`);
  if (sourceItem?.system?.identifier !== reference.identifier) {
    throw new Error(
      `ContentRef ${reference.identifier} cannot import Item `
      + `${sourceItem?.system?.identifier ?? "<missing>"}`,
    );
  }
  const fields = new Set(reference.fields);
  return compactObject({
    name: fields.has("name")
      ? sanitizeCleanRoomRichText(sourceItem.name ?? reference.identifier)
      : undefined,
    description: fields.has("description")
      ? sanitizeDescription(sourceItem.system?.description)
      : undefined,
    img: fields.has("img") ? String(sourceItem.img ?? "icons/svg/book.svg") : undefined,
    source: fields.has("source")
      ? sanitizeSourceCitation(sourceItem.system?.source)
      : undefined,
    materialText: fields.has("materialText")
      ? sanitizeCleanRoomRichText(sourceItem.system?.materials?.value)
      : undefined,
    localization: fields.has("localization")
      ? sanitizeLocalization(sourceItem.flags?.[MODULE_ID]?.localization)
      : undefined,
  });
}

export function extractCleanRoomDocumentIdentity(item) {
  if (!item?._id) throw new Error("Clean-room document identity requires a Foundry _id");
  return compactObject({
    _id: item._id,
    ownership: clone(item.ownership ?? { default: 0 }),
    folder: item.folder,
    sort: item.sort ?? 0,
    _stats: clone(item._stats),
  });
}

export function extractCleanRoomPackaging(item) {
  const arcaneFlags = item?.flags?.[MODULE_ID] ?? {};
  return compactObject({
    system: item?.system?.classes
      ? { classes: clone(item.system.classes) }
      : {},
    flags: {
      [MODULE_ID]: compactObject({
        spellClasses: clone(arcaneFlags.spellClasses),
        sourcePack: arcaneFlags.sourcePack,
        sourceUuid: arcaneFlags.sourceUuid,
      }),
    },
  });
}

export function normalizeCleanRoomPackaging(packaging = {}) {
  assertExactKeys(packaging, ["system", "flags"], "cleanRoom.packaging");
  const system = packaging.system ?? {};
  assertExactKeys(system, ["classes"], "cleanRoom.packaging.system");
  if (system.classes !== undefined) {
    assertExactKeys(system.classes, ["value"], "cleanRoom.packaging.system.classes");
    assertString(system.classes.value, "cleanRoom.packaging.system.classes.value");
  }
  const flags = packaging.flags ?? {};
  assertExactKeys(flags, [MODULE_ID], "cleanRoom.packaging.flags");
  const arcane = flags[MODULE_ID] ?? {};
  assertExactKeys(
    arcane,
    ["spellClasses", "sourcePack", "sourceUuid"],
    `cleanRoom.packaging.flags.${MODULE_ID}`,
  );
  if (
    arcane.spellClasses !== undefined
    && (
      !Array.isArray(arcane.spellClasses)
      || arcane.spellClasses.some(value => typeof value !== "string" || !value)
      || new Set(arcane.spellClasses).size !== arcane.spellClasses.length
    )
  ) {
    throw new Error(
      `cleanRoom.packaging.flags.${MODULE_ID}.spellClasses must contain unique identifiers`,
    );
  }
  if (arcane.sourcePack !== undefined) {
    assertString(arcane.sourcePack, `cleanRoom.packaging.flags.${MODULE_ID}.sourcePack`);
  }
  if (arcane.sourceUuid !== undefined) {
    assertString(arcane.sourceUuid, `cleanRoom.packaging.flags.${MODULE_ID}.sourceUuid`);
  }
  return compactObject({
    system: clone(system),
    flags: Object.keys(arcane).length > 0
      ? { [MODULE_ID]: clone(arcane) }
      : {},
  });
}

export function cleanRoomSemanticSource(definition) {
  assertCleanRoomDefinition(definition);
  const byId = (left, right) => String(left.id).localeCompare(String(right.id));
  return {
    schemaVersion: CLEAN_ROOM_SPELL_SCHEMA_VERSION,
    id: definition.id,
    contract: clone(definition.contract),
    ...(definition.script ? { script: clone(definition.script) } : {}),
    graph: {
      actions: definition.fragments.flatMap(fragment => clone(fragment.actions ?? [])).sort(byId),
      artifacts: definition.fragments
        .flatMap(fragment => clone(fragment.artifacts ?? []))
        .sort(byId),
      rules: definition.fragments.flatMap(fragment => clone(fragment.rules ?? [])).sort(byId),
    },
  };
}

export function cleanRoomRuntimeProfile(profile = {}) {
  return resolveSpellAutomationRuntimeProfile({
    ...ARCANE_DND5E_2014_RUNTIME_PROFILE,
    ...profile,
  });
}
