import {
  action,
  artifact,
  defineSpell,
  graphFragment,
  lifecycle,
  operation,
  predicate,
  removeNode,
  replaceNode,
  rule,
  targetQuery,
  trigger,
} from "../../tools/lib/spell-automation-compiler.mjs";
import {
  contentRef as cleanRoomContentRef,
} from "../../tools/lib/spell-automation-cleanroom.mjs";

export {
  action,
  artifact,
  defineSpell,
  graphFragment,
  lifecycle,
  operation,
  predicate,
  removeNode,
  replaceNode,
  rule,
  targetQuery,
  trigger,
};

export {
  CLEAN_ROOM_SPELL_SCHEMA_VERSION,
  abilitySavingThrows,
  actualDamage,
  add,
  allAbilityChecks,
  allAttackRolls,
  allSavingThrows,
  allWeaponHits,
  blockHealing,
  blockVocalSpell,
  blockActionKinds,
  bonus,
  cantripProgression,
  castLevel,
  castOriginStaticMarker,
  cleanRoomEffect,
  cleanRoomFollowingAura,
  cleanRoomRangeIndicator,
  cleanRoomSummonedEntity,
  cleanRoomWeaponEnchantment,
  concentration,
  constant,
  consumesSourceArtifact,
  contentRef,
  defaultTargetSelection,
  decreaseAllMovement,
  dice,
  duration,
  dropToOneHitPointOnDamage,
  endSourceWhenLastDependentEnds,
  enumParameter,
  excludeSource,
  gainAttackAdvantage,
  gainAttackDisadvantage,
  grantAbilityCheckAdvantage,
  grantAbilityCheckDisadvantage,
  grantAttackAdvantage,
  grantAbilitySavingThrowAdvantage,
  grantAbilitySavingThrowDisadvantage,
  grantArmorClassBonus,
  grantConditionImmunity,
  grantDamageImmunity,
  grantDeathSavingThrowAdvantage,
  grantHover,
  grantIncomingAttackDisadvantage,
  grantSightDependentIncomingAttackDisadvantage,
  grantWeaponAttackDamageResistance,
  grantMagicalWeapon,
  grantNonmagicalDamageResistance,
  grantResistance,
  grantSavingThrowAdvantage,
  grantSkillCheckBonus,
  grantSkillCheckDisadvantage,
  grantStatus,
  halveAllMovement,
  instant,
  increaseAllMovement,
  increaseMovement,
  independentProjectiles,
  levelsAboveBase,
  manual,
  maximizeHealingReceived,
  minimumMovement,
  minimumSenseRange,
  minimumTokenLight,
  multiply,
  nativeSummonControl,
  nextTurnAttackAdvantageAgainstMarkedTarget,
  operationResult,
  optionalRollBonus,
  outcomeRace,
  ownedItem,
  pairwiseWithinDistance,
  perSlotAboveBase,
  requiredEnumSelection,
  parameterValue,
  parentPrimaryDamageType,
  requiresSourceArtifact,
  roundDown,
  scaleJumpDistance,
  scaleAllMovement,
  setAllMovement,
  setMovement,
  spellContract,
  spellLifetime,
  spellAttackBonus,
  spellSaveDc,
  spellScript,
  spellScriptHandler,
  spellcastingModifier,
  tiers,
  temporaryHitPointsFromArtifact,
  transformPhysicalSize,
  untilTrigger,
  weaponHitDamageRider,
  adjustWeaponHitDamage,
  weaponAttackBonus,
  weaponAttackAndDamageBonus,
  replaceWeaponBaseDamageDie,
  scaleWeaponHitDamage,
  useSpellcastingAbilityForWeaponAttacks,
  whileSpellActive,
} from "../../tools/lib/spell-automation-cleanroom.mjs";

export function acceptance(source, invariants, {
  status = "legacy-runtime-passed",
} = {}) {
  return {
    status,
    source,
    invariants,
  };
}

export function compilerAcceptance(source, invariants) {
  return acceptance(source, invariants, { status: "compiler-runtime-passed" });
}

export function activation(type = "action", cost = 1) {
  return { type, cost };
}

export function publicAction(id, name, {
  activationType = "action",
  delivery = "standalone",
  parameters = [],
  availableWhen = [],
  defaultTargetSelection,
  resolution,
} = {}) {
  return action({
    id,
    name,
    activation: activation(activationType),
    visibility: "public",
    delivery,
    parameters,
    availableWhen,
    defaultTargetSelection,
    resolution,
  });
}

export function selected(id, {
  max = 1,
  min = 1,
  range = null,
  units = "ft",
  kind = "creature",
  predicates = [],
} = {}) {
  return targetQuery({
    id,
    result: "tokens",
    origin: { type: "selected" },
    evaluation: "snapshot",
    cardinality: { min, max },
    predicates: [
      predicate("within-range", { distance: range, units, from: "source" }),
      predicate("target-kind", { value: kind }),
      ...predicates,
    ],
  });
}

export function self(id = "target:cast") {
  return targetQuery({
    id,
    result: "source",
    origin: { type: "self" },
    evaluation: "snapshot",
    cardinality: { min: 1, max: 1 },
  });
}

export function placedTemplate(id, {
  type,
  size,
  width = null,
  height = null,
  range,
  rangeUnits = "ft",
  kind = "creature",
  evaluation = "snapshot",
  predicates = [],
} = {}) {
  return targetQuery({
    id,
    result: "template-members",
    origin: {
      type: "placed-template",
      shape: {
        type,
        size,
        width,
        height,
        units: "ft",
      },
    },
    evaluation,
    cardinality: { min: 0, max: "any" },
    predicates: [
      predicate("within-range", { distance: range, units: rangeUnits, from: "source" }),
      predicate("target-kind", { value: kind }),
      ...predicates,
    ],
  });
}

export function placedPoint(id, range) {
  return targetQuery({
    id,
    result: "point",
    origin: { type: "placed-point" },
    evaluation: "snapshot",
    cardinality: { min: 1, max: 1 },
    predicates: [
      predicate("within-range", { distance: range, units: "ft", from: "source" }),
      predicate("target-kind", { value: "space" }),
    ],
  });
}

export function eventTarget(id, predicates = []) {
  return targetQuery({
    id,
    result: "tokens",
    origin: { type: "event-binding", name: "target" },
    evaluation: "snapshot",
    cardinality: { min: 1, max: 1 },
    predicates,
  });
}

export function eventNeighborhood(id, {
  anchor = "target",
  radius,
  units = "ft",
  includeAnchor = true,
  kind = "creature",
} = {}) {
  return targetQuery({
    id,
    result: "tokens",
    origin: {
      type: "event-neighborhood",
      anchor,
      radius,
      units,
      includeAnchor,
    },
    evaluation: "snapshot",
    cardinality: { min: 0, max: "any" },
    predicates: [
      predicate("target-kind", { value: kind }),
    ],
  });
}

export function zoneMembers(id, zoneId, predicates = []) {
  return targetQuery({
    id,
    result: "template-members",
    origin: { type: "artifact", artifactId: zoneId },
    evaluation: "live",
    cardinality: { min: 0, max: "any" },
    predicates,
  });
}

export function consume(id = "cast:consume", timing = "on-use") {
  return operation("consume-resource", {
    id,
    resource: "spell-slot",
    timing,
  });
}

export function durationSeconds(value) {
  return lifecycle("duration", { value, units: "seconds" });
}

export function whileArtifact(artifactId) {
  return lifecycle("while-artifact", { artifactId });
}

export function firstOf(...values) {
  return lifecycle("first-of", { values });
}

export function sourceConcentration(id, seconds) {
  return artifact({
    id,
    kind: "effect",
    role: "mechanical",
    identity: { scope: "source", keys: ["sourceUuid"] },
    state: { concentration: true },
    lifecycle: durationSeconds(seconds),
  });
}

export function effectArtifact(id, {
  scope = "source-target",
  state = {},
  lifecycle: lifetime,
} = {}) {
  return artifact({
    id,
    kind: "effect",
    role: "mechanical",
    identity: {
      scope,
      keys: scope === "source"
        ? ["sourceUuid"]
        : scope === "target"
          ? ["targetUuid"]
          : ["sourceUuid", "targetUuid"],
    },
    state,
    lifecycle: lifetime,
  });
}

export function explicitSpell({
  id,
  support,
  fragments,
  loweringHints,
  emission,
  sourceAssertions,
  accepted,
}) {
  return defineSpell({
    id,
    sourceMode: "explicit",
    support,
    fragments,
    loweringHints,
    emission,
    sourceAssertions,
    acceptance: accepted,
  });
}

export function liftedSpell({
  id,
  support = { level: "full", omissions: [] },
  fragments = [],
  emission,
  sourceAssertions,
  accepted,
}) {
  return defineSpell({
    id,
    sourceMode: "lift",
    support,
    fragments,
    emission,
    sourceAssertions,
    acceptance: accepted,
  });
}

export function cleanRoomSpell({
  id,
  contract,
  content = cleanRoomContentRef(id),
  support = { level: "full", omissions: [] },
  fragments = [],
  emission = {},
  accepted,
  script,
}) {
  return defineSpell({
    id,
    sourceMode: "explicit",
    contract,
    content,
    support,
    fragments,
    emission: {
      ...emission,
      mode: "clean-room",
    },
    acceptance: accepted,
    script,
  });
}
