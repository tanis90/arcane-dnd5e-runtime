import {ARCANE_RUNTIME_INVOCATION_SITES,ARCANE_RUNTIME_RULE_ADAPTERS,ARCANE_RUNTIME_ARTIFACT_ADAPTERS} from '@arcanedesk/automation-contracts/runtime-adapters';
export {ARCANE_RUNTIME_INVOCATION_SITES,ARCANE_RUNTIME_RULE_ADAPTERS,ARCANE_RUNTIME_ARTIFACT_ADAPTERS} from '@arcanedesk/automation-contracts/runtime-adapters';
import {bindSpellPlan} from "./spell-plan-binding.mjs";
export {bindSpellPlan} from "./spell-plan-binding.mjs";
import {stableValue, semanticHash, stableStringify, SPELL_AUTOMATION_SCHEMA_VERSION, SPELL_AUTOMATION_COMPILER_VERSION, ARCANE_AUTOMATION_MODULE_ID} from "@arcanedesk/automation-contracts/semantics";
export {semanticHash, stableStringify, SPELL_AUTOMATION_SCHEMA_VERSION, SPELL_AUTOMATION_COMPILER_VERSION, ARCANE_AUTOMATION_MODULE_ID} from "@arcanedesk/automation-contracts/semantics";
import {
  cleanRoomSemanticSource,
  importCleanRoomContent,
  normalizeCleanRoomPackaging,
  prepareCleanRoomFragments,
} from "./spell-automation-cleanroom.mjs";





const ACTION_ACTIVATIONS = new Set([
  "action",
  "bonus",
  "reaction",
  "minute",
  "hour",
  "day",
  "special",
  "none",
]);
const ACTION_VISIBILITIES = new Set(["public", "automation-only"]);
const ACTION_DELIVERIES = new Set(["standalone", "declared-rider"]);
const ARTIFACT_KINDS = new Set([
  "effect",
  "zone",
  "entity",
  "state",
  "visual",
  "marker",
  "enchantment",
]);
const ARTIFACT_ROLES = new Set(["mechanical", "presentation"]);
const ARTIFACT_SCOPES = new Set([
  "cast",
  "source",
  "target",
  "source-target",
  "source-item",
  "cast-target",
  "world",
]);
const TARGET_RESULTS = new Set(["tokens", "point", "template-members", "source", "items"]);
const TARGET_EVALUATIONS = new Set(["snapshot", "live"]);
const SUPPORT_LEVELS = new Set(["full", "simplified", "marker-only", "manual"]);
const LOWERING_PROVIDERS = new Set([
  "active-auras",
  "arcane-runtime",
  "aura-effects",
  "dnd5e-midi-native",
  "midi-overtime",
  "native-active-effect",
]);




const OPERATION_TYPES = new Set([
  "consume-resource",
  "saving-throw",
  "attack-roll",
  "damage",
  "healing",
  "create-artifact",
  "update-artifact",
  "delete-artifact",
  "apply-artifact",
  "move-token",
  "emit-event",
  "grant-temporary-hp",
  "remove-statuses",
  "grant-attack-advantage",
  "allocate-hit-point-pool",
  "weapon-attack",
  "grant-hit-point-capacity",
  "suppress-statuses",
  "check",
  "dash",
  "reassert-native-summon-control",
]);
const BLOCKED_ACTION_KINDS = new Set(["attack", "spell", "reaction", "action"]);

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

function primitive(kind, value) {
  if (!value || typeof value !== "object") throw new TypeError(`${kind} must be an object`);
  return compactObject({ primitive: kind, ...clone(value) });
}

export function action(value) {
  return primitive("action", {
    delivery: "standalone",
    parameters: [],
    availableWhen: [],
    ...value,
  });
}

export function trigger(type, value = {}) {
  return primitive("trigger", { type, ...value });
}

export function targetQuery(value) {
  return primitive("target-query", {
    evaluation: "snapshot",
    predicates: [],
    ...value,
  });
}

export function predicate(type, value = {}) {
  return primitive("predicate", { type, ...value });
}

export function operation(type, value = {}) {
  return primitive("operation", { type, ...value });
}

export function lifecycle(type, value = {}) {
  return primitive("lifecycle", { type, ...value });
}

export function artifact(value) {
  return primitive("artifact", value);
}

export function rule(value) {
  return primitive("rule", {
    when: [],
    targets: [],
    do: [],
    ...value,
  });
}

export function replaceNode(kind, id, expected, next) {
  return primitive("mutation", {
    type: "replace",
    kind,
    id,
    expected: clone(expected ?? {}),
    next: clone(next),
  });
}

export function removeNode(kind, id, reason, expected = {}) {
  if (!reason) throw new Error(`remove ${kind}:${id} requires a reason`);
  return primitive("mutation", {
    type: "remove",
    kind,
    id,
    reason,
    expected: clone(expected),
  });
}

export function graphFragment({
  id,
  provides = [],
  requires = [],
  actions = [],
  artifacts = [],
  rules = [],
  mutations = [],
} = {}) {
  return compactObject({
    id,
    provides: [...provides],
    requires: [...requires],
    actions: clone(actions),
    artifacts: clone(artifacts),
    rules: clone(rules),
    mutations: clone(mutations),
  });
}

export function compose(...fragments) {
  const flattened = fragments.flat(Infinity).filter(Boolean).map(clone);
  return graphFragment({
    id: "composed",
    provides: [...new Set(flattened.flatMap(fragment => fragment.provides ?? []))],
    requires: [...new Set(flattened.flatMap(fragment => fragment.requires ?? []))],
    actions: flattened.flatMap(fragment => fragment.actions ?? []),
    artifacts: flattened.flatMap(fragment => fragment.artifacts ?? []),
    rules: flattened.flatMap(fragment => fragment.rules ?? []),
    mutations: flattened.flatMap(fragment => fragment.mutations ?? []),
  });
}

export function defineSpell({
  id,
  sourceMode = "explicit",
  support = { level: "full", omissions: [] },
  contract,
  content,
  fragments = [],
  loweringHints = {},
  emission = {},
  sourceAssertions = {},
  acceptance = {},
  script,
} = {}) {
  if (!id) throw new Error("Spell definition requires id");
  if (!["explicit", "lift"].includes(sourceMode)) {
    throw new Error(`${id} has invalid sourceMode ${sourceMode}`);
  }
  return compactObject({
    schemaVersion: SPELL_AUTOMATION_SCHEMA_VERSION,
    id,
    sourceMode,
    support: {
      level: support.level ?? "full",
      omissions: [...(support.omissions ?? [])],
    },
    contract: clone(contract),
    content: clone(content),
    fragments: clone(fragments),
    loweringHints: clone(loweringHints),
    emission: clone(emission),
    sourceAssertions: clone(sourceAssertions),
    acceptance: clone(acceptance),
    script: clone(script),
  });
}

function slug(value, fallback = "node") {
  const normalized = String(value ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || fallback;
}

function asArray(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function numberOrNull(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function numberOrExpression(value) {
  const numeric = numberOrNull(value);
  if (numeric !== null) return numeric;
  const expression = String(value ?? "").trim();
  return expression || null;
}

function cardinalityMax(value) {
  return numberOrExpression(value) ?? "any";
}

function inferredTargetCardinality(origin, target) {
  if (["self", "placed-point"].includes(origin?.type)) return { min: 1, max: 1 };
  return {
    min: origin?.type === "selected" ? 1 : 0,
    max: cardinalityMax(target?.affects?.count),
  };
}

function effectiveTarget(item, activity) {
  return activity?.target?.override === true
    ? activity.target ?? {}
    : item?.system?.target ?? activity?.target ?? {};
}

function effectiveRange(item, activity) {
  return activity?.range?.override === true
    ? activity.range ?? {}
    : item?.system?.range ?? activity?.range ?? {};
}

function effectiveActivation(item, activity) {
  return activity?.activation?.override === true
    ? activity.activation ?? {}
    : item?.system?.activation ?? activity?.activation ?? {};
}

function effectiveDuration(item, activity) {
  return activity?.duration?.override === true
    ? activity.duration ?? {}
    : item?.system?.duration ?? activity?.duration ?? {};
}

function normalizedActivation(value) {
  const raw = String(value?.type ?? "").trim();
  return ACTION_ACTIVATIONS.has(raw) ? raw : "none";
}

function targetOriginFromItem(item, activity) {
  const target = effectiveTarget(item, activity);
  const range = effectiveRange(item, activity);
  const template = target?.template ?? {};
  const templateType = String(template.type ?? "").trim();
  const affectsType = String(target?.affects?.type ?? "").trim();
  const rangeUnits = String(range?.units ?? "").trim();
  if (templateType) {
    if (rangeUnits === "self" && ["radius", "squareRadius"].includes(templateType)) {
      return { type: "self" };
    }
    return {
      type: "placed-template",
      shape: {
        type: templateType,
        size: numberOrExpression(template.size),
        width: numberOrExpression(template.width),
        height: numberOrExpression(template.height),
        units: template.units || "ft",
      },
    };
  }
  if (affectsType === "self" || rangeUnits === "self") return { type: "self" };
  if (["creature", "ally", "enemy", "token", "space"].includes(affectsType)) {
    return { type: "selected" };
  }
  if (["attack", "save", "damage", "heal"].includes(activity?.type)) {
    return { type: "selected" };
  }
  return { type: "self" };
}

function predicatesFromItem(item, activity) {
  const range = effectiveRange(item, activity);
  const affects = effectiveTarget(item, activity)?.affects ?? {};
  const values = [];
  if (range?.units) {
    values.push(predicate("within-range", {
      distance: numberOrExpression(range.value),
      units: range.units,
      from: "source",
    }));
  }
  if (["ally", "enemy"].includes(affects.type)) {
    values.push(predicate("disposition", {
      value: affects.type === "ally" ? "friendly" : "hostile",
    }));
  }
  if (affects.type) values.push(predicate("target-kind", { value: affects.type }));
  return values;
}

function formulaFromPart(part) {
  if (!part) return null;
  if (part.custom?.enabled && part.custom?.formula) return String(part.custom.formula);
  const number = numberOrNull(part.number);
  const denomination = numberOrNull(part.denomination);
  const dice = number && denomination ? `${number}d${denomination}` : "";
  const bonus = String(part.bonus ?? "").trim();
  return [dice, bonus].filter(Boolean).join("+") || null;
}

function scalingFromPart(part, spellLevel) {
  const mode = String(part?.scaling?.mode ?? "").trim();
  if (!mode) return null;
  return compactObject({
    mode: mode === "whole"
      ? Number(spellLevel) === 0
        ? "character-level"
        : "slot-level"
      : mode,
    number: numberOrNull(part.scaling?.number),
    formula: String(part.scaling?.formula ?? "").trim() || undefined,
  });
}

function semanticChange(change) {
  const key = String(change?.key ?? "");
  const value = String(change?.value ?? "");
  const common = { mode: numberOrNull(change?.mode), priority: numberOrNull(change?.priority) };
  if (
    key === "system.attributes.ac.bonus"
    || key === "system.attributes.ac.value"
  ) return { type: "ac-bonus", value, ...common };
  if (key === "system.bonuses.abilities.check") {
    return { type: "ability-check-bonus", value, ...common };
  }
  if (key === "system.bonuses.abilities.save") return { type: "save-bonus", value, ...common };
  if (/^system\.bonuses\.(mwak|msak|rwak|rsak)\.attack$/.test(key)) {
    return { type: "attack-bonus", attack: key.split(".")[2], value, ...common };
  }
  if (/^system\.bonuses\.(mwak|msak|rwak|rsak)\.damage$/.test(key)) {
    return { type: "damage-bonus", attack: key.split(".")[2], value, ...common };
  }
  if (key === "system.traits.dr.value") return { type: "damage-resistance", value, ...common };
  if (key === "system.traits.ci.value") return { type: "condition-immunity", value, ...common };
  if (key === "flags.midi-qol.grants.advantage.attack.all") {
    return { type: "grant-attack-advantage", value: value === "true", ...common };
  }
  if (key === "flags.midi-qol.advantage.attack.all") {
    return { type: "gain-attack-advantage", value: value === "true", ...common };
  }
  if (key === "flags.midi-qol.disadvantage.attack.all") {
    return { type: "gain-attack-disadvantage", value: value === "true", ...common };
  }
  if (key === "flags.midi-qol.fail.spell.vocal") {
    return { type: "block-vocal-spell", value: value === "true", ...common };
  }
  if (key === "flags.midi-qol.ActivityOverTime") {
    return { type: "activity-over-time", value, ...common };
  }
  return { type: "provider-change", key, value, ...common };
}

function effectLifecycle(effect) {
  const durationSeconds = numberOrNull(effect?.duration?.seconds);
  const specialDuration = [...(effect?.flags?.dae?.specialDuration ?? [])];
  const values = [];
  if (durationSeconds !== null) values.push(lifecycle("duration", { value: durationSeconds, units: "seconds" }));
  for (const value of specialDuration) {
    const triggerMap = {
      isDamaged: trigger("damage-taken", { subject: "effect-target" }),
      isAttacked: trigger("attack-targeted", { subject: "effect-target" }),
      "1Attack": trigger("attack-roll-made", { subject: "effect-target" }),
      turnEndSource: trigger("turn-end", { subject: "source" }),
      turnStartSource: trigger("turn-start", { subject: "source" }),
      turnEnd: trigger("turn-end", { subject: "effect-target" }),
      turnStart: trigger("turn-start", { subject: "effect-target" }),
    };
    values.push(lifecycle("until-trigger", {
      trigger: triggerMap[value] ?? trigger("provider-special-duration", { value }),
    }));
  }
  if (values.length === 0) return lifecycle("workflow");
  if (values.length === 1) return values[0];
  return lifecycle("first-of", { values });
}

function artifactFromEffect(effect, index) {
  const name = effect?.name || `Effect ${index + 1}`;
  return artifact({
    id: slug(name, `effect-${index + 1}`),
    kind: "effect",
    role: "mechanical",
    identity: {
      scope: "source-target",
      keys: ["sourceUuid", "targetUuid"],
    },
    state: {
      statuses: [...(effect?.statuses ?? [])].sort(),
      changes: (effect?.changes ?? []).map(semanticChange),
      disabled: effect?.disabled === true,
      transfer: effect?.transfer === true,
    },
    lifecycle: effectLifecycle(effect),
    provenance: { effectId: effect?._id, effectName: name },
  });
}

function actionIdsForActivities(activities) {
  const used = new Set();
  return activities.map((activity, index) => {
    let candidate = "cast";
    if (index > 0 || used.has(candidate)) {
      const identifier = String(activity?.midiProperties?.identifier ?? "").trim();
      const name = slug(activity?.name);
      candidate = identifier ? slug(identifier) : name !== "node" ? name : `${activity.type || "activity"}-${index + 1}`;
      if (activity.type === "heal" && !used.has("heal")) candidate = "heal";
    }
    let unique = candidate;
    let suffix = 2;
    while (used.has(unique)) unique = `${candidate}-${suffix++}`;
    used.add(unique);
    return unique;
  });
}

function isConcentration(item, activity) {
  return effectiveDuration(item, activity)?.concentration === true
    || item?.system?.duration?.concentration === true
    || (item?.system?.properties instanceof Set && item.system.properties.has("concentration"))
    || asArray(item?.system?.properties).includes("concentration");
}

function referenceArtifactId(effectRef, effects, artifactByEffectId) {
  const id = typeof effectRef === "string" ? effectRef : effectRef?._id;
  if (!id) return null;
  if (artifactByEffectId.has(id)) return artifactByEffectId.get(id);
  const index = effects.findIndex(effect => effect?._id === id);
  return index >= 0 ? slug(effects[index]?.name, `effect-${index + 1}`) : null;
}

function inheritAttachedEffectLifecycle(currentArtifact, item, activity) {
  if (!currentArtifact) return;
  let inherited = currentArtifact.lifecycle ?? lifecycle("workflow");
  if (inherited.type === "workflow") {
    const duration = effectiveDuration(item, activity);
    const value = numberOrNull(duration?.value);
    const units = String(duration?.units ?? "").trim();
    if (value !== null && units && units !== "inst") {
      inherited = lifecycle("duration", { value, units });
    }
  }
  if (isConcentration(item, activity) && currentArtifact.id !== "concentration") {
    const concentrationLifetime = lifecycle("while-artifact", { artifactId: "concentration" });
    if (inherited.type === "workflow") inherited = concentrationLifetime;
    else if (
      inherited.type !== "while-artifact"
      || inherited.artifactId !== "concentration"
    ) {
      const values = inherited.type === "first-of"
        ? [...(inherited.values ?? [])]
        : [inherited];
      if (!values.some(value =>
        value.type === "while-artifact" && value.artifactId === "concentration"
      )) {
        values.push(concentrationLifetime);
      }
      inherited = lifecycle("first-of", { values });
    }
  }
  currentArtifact.lifecycle = inherited;
}

export function liftSpellItem(item) {
  if (item?.type !== "spell") throw new Error("liftSpellItem requires a spell Item");
  const identifier = item.system?.identifier;
  if (!identifier) throw new Error(`Spell ${item.name ?? item._id} has no system.identifier`);
  const activities = Object.values(item.system?.activities ?? {});
  const effects = [...(item.effects ?? [])];
  const artifacts = effects.map(artifactFromEffect);
  const artifactByEffectId = new Map(
    effects.map((effect, index) => [effect?._id, artifacts[index]?.id]).filter(([id]) => Boolean(id)),
  );
  const artifactBySemanticId = new Map(artifacts.map(currentArtifact => [currentArtifact.id, currentArtifact]));
  const concentrationNeeded = activities.some(activity => isConcentration(item, activity));
  if (concentrationNeeded && !artifacts.some(candidate => candidate.id === "concentration")) {
    artifacts.push(artifact({
      id: "concentration",
      kind: "effect",
      role: "mechanical",
      identity: { scope: "source", keys: ["sourceUuid"] },
      state: { concentration: true },
      lifecycle: (() => {
        const duration = effectiveDuration(item, activities[0]);
        const seconds = numberOrNull(duration?.value);
        return seconds === null
          ? lifecycle("manual")
          : lifecycle("duration", { value: seconds, units: duration.units || "seconds" });
      })(),
      provenance: { inferredFromItemDuration: true },
    }));
  }

  const ids = actionIdsForActivities(activities);
  const actions = [];
  const rules = [];
  for (let index = 0; index < activities.length; index += 1) {
    const activity = activities[index];
    const actionId = ids[index];
    const target = effectiveTarget(item, activity);
    const targetOrigin = targetOriginFromItem(item, activity);
    const targetQueryId = `target:${actionId}`;
    const publicAction = activity?.midiProperties?.automationOnly !== true;
    actions.push(action({
      id: actionId,
      name: activity.name || item.name || actionId,
      activation: {
        type: normalizedActivation(effectiveActivation(item, activity)),
        cost: numberOrNull(effectiveActivation(item, activity)?.value) ?? 1,
      },
      visibility: publicAction ? "public" : "automation-only",
      provenance: { activityId: activity._id, activityType: activity.type },
    }));

    const query = targetQuery({
      id: targetQueryId,
      result: target?.template?.type
        ? "template-members"
        : targetOrigin.type === "self"
          ? "source"
          : "tokens",
      origin: targetOrigin,
      evaluation: "snapshot",
      cardinality: inferredTargetCardinality(targetOrigin, target),
      predicates: predicatesFromItem(item, activity),
    });
    const operations = [];
    if (activity?.consumption?.spellSlot === true) {
      operations.push(operation("consume-resource", {
        id: `${actionId}:consume`,
        resource: "spell-slot",
        timing: "on-use",
      }));
    }
    if (concentrationNeeded && actionId === "cast") {
      operations.push(operation("create-artifact", {
        id: `${actionId}:create-concentration`,
        artifactId: "concentration",
        target: "source",
      }));
    }
    if (activity.type === "save" || activity.save?.ability?.length) {
      operations.push(operation("saving-throw", {
        id: `${actionId}:save`,
        ability: asArray(activity.save?.ability).map(String),
        target: targetQueryId,
        onSave: activity.damage?.onSave ?? "none",
      }));
    }
    if (activity.type === "attack" || activity.attack) {
      operations.push(operation("attack-roll", {
        id: `${actionId}:attack`,
        attackType: activity.attack?.type?.value ?? "spell",
        target: targetQueryId,
      }));
    }
    for (let partIndex = 0; partIndex < (activity.damage?.parts ?? []).length; partIndex += 1) {
      const part = activity.damage.parts[partIndex];
      operations.push(operation("damage", {
        id: `${actionId}:damage:${partIndex + 1}`,
        target: targetQueryId,
        formula: formulaFromPart(part),
        damageTypes: [...(part.types ?? [])],
        scaling: scalingFromPart(part, item.system?.level),
        onSave: activity.damage?.onSave ?? "none",
      }));
    }
    if (activity.healing) {
      operations.push(operation("healing", {
        id: `${actionId}:healing`,
        target: targetQueryId,
        formula: formulaFromPart(activity.healing),
        healingTypes: [...(activity.healing.types ?? [])],
        scaling: scalingFromPart(activity.healing, item.system?.level),
      }));
    }

    const attachedArtifactIds = (activity.effects ?? [])
      .map(effectRef => referenceArtifactId(effectRef, effects, artifactByEffectId))
      .filter(Boolean);
    for (const artifactId of attachedArtifactIds) {
      inheritAttachedEffectLifecycle(artifactBySemanticId.get(artifactId), item, activity);
    }
    const outcomeOperation = operations.find(candidate => candidate.type === "saving-throw")
      ?? operations.find(candidate => candidate.type === "attack-roll");
    if (!outcomeOperation) {
      for (const artifactId of attachedArtifactIds) {
        operations.push(operation("apply-artifact", {
          id: `${actionId}:apply:${artifactId}`,
          artifactId,
          target: targetQueryId,
        }));
      }
    }

    rules.push(rule({
      id: `use:${actionId}`,
      on: trigger("action-used", { actionId }),
      targets: [query],
      do: operations,
      provenance: { activityId: activity._id },
    }));

    if (outcomeOperation) {
      const outcome = outcomeOperation.type === "saving-throw" ? "failure" : "hit";
      for (const artifactId of attachedArtifactIds) {
        rules.push(rule({
          id: `outcome:${outcomeOperation.id}:${outcome}:apply:${artifactId}`,
          on: trigger("operation-outcome", {
            operationId: outcomeOperation.id,
            outcome,
          }),
          targets: [targetQuery({
            id: `event-target:${artifactId}`,
            result: "tokens",
            origin: { type: "event-binding", name: "target" },
            evaluation: "snapshot",
            cardinality: { min: 1, max: 1 },
          })],
          do: [operation("apply-artifact", {
            id: `${actionId}:apply:${artifactId}`,
            artifactId,
            target: `event-target:${artifactId}`,
          })],
        }));
      }
    }
  }

  const graph = normalizeGraph({
    schemaVersion: SPELL_AUTOMATION_SCHEMA_VERSION,
    id: identifier,
    support: { level: "full", omissions: [] },
    actions,
    artifacts,
    rules,
  });
  return {
    graph,
    provenance: {
      itemId: item._id,
      itemName: item.name,
      activityIds: activities.map(activity => activity._id),
      effectIds: effects.map(effect => effect._id),
      actionActivityIds: Object.fromEntries(
        ids.map((actionId, index) => [actionId, activities[index]?._id])
          .filter(([, activityId]) => Boolean(activityId)),
      ),
      artifactEffectIds: Object.fromEntries(
        effects.map((effect, index) => [artifacts[index]?.id, effect?._id])
          .filter(([artifactId, effectId]) => Boolean(artifactId) && Boolean(effectId)),
      ),
    },
  };
}

function nodeCollectionName(kind) {
  if (kind === "action") return "actions";
  if (kind === "artifact") return "artifacts";
  if (kind === "rule") return "rules";
  throw new Error(`Unsupported node kind ${kind}`);
}

function isSubset(expected, actual) {
  if (expected === undefined) return true;
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual) || expected.length !== actual.length) return false;
    return expected.every((value, index) => isSubset(value, actual[index]));
  }
  if (expected && typeof expected === "object") {
    if (!actual || typeof actual !== "object") return false;
    return Object.entries(expected).every(([key, value]) => isSubset(value, actual[key]));
  }
  return Object.is(expected, actual);
}

function materializeFragments(baseGraph, fragments) {
  const graph = clone(baseGraph);
  graph.actions ??= [];
  graph.artifacts ??= [];
  graph.rules ??= [];
  const composed = compose(...fragments);
  const provided = new Set([
    ...graph.actions.map(node => node.id),
    ...graph.artifacts.map(node => node.id),
    ...graph.rules.map(node => node.id),
    ...(composed.provides ?? []),
  ]);
  for (const requirement of composed.requires ?? []) {
    if (!provided.has(requirement)) throw new Error(`Missing fragment requirement ${requirement}`);
  }

  const mutations = [...(composed.mutations ?? [])].sort((left, right) =>
    `${left.kind}:${left.id}:${left.type}`.localeCompare(`${right.kind}:${right.id}:${right.type}`),
  );
  const mutationKeys = new Set();
  for (const mutation of mutations) {
    const key = `${mutation.kind}:${mutation.id}`;
    if (mutationKeys.has(key)) throw new Error(`Conflicting mutations for ${key}`);
    mutationKeys.add(key);
    const collectionName = nodeCollectionName(mutation.kind);
    const collection = graph[collectionName];
    const index = collection.findIndex(node => node.id === mutation.id);
    if (index < 0) throw new Error(`Cannot ${mutation.type} missing ${key}`);
    if (!isSubset(mutation.expected ?? {}, collection[index])) {
      throw new Error(`${mutation.type} expected shape mismatch for ${key}`);
    }
    if (mutation.type === "remove") collection.splice(index, 1);
    else if (mutation.type === "replace") collection[index] = clone(mutation.next);
    else throw new Error(`Unsupported mutation ${mutation.type}`);
  }

  for (const [collectionName, nodes] of [
    ["actions", composed.actions],
    ["artifacts", composed.artifacts],
    ["rules", composed.rules],
  ]) {
    for (const node of nodes ?? []) {
      if (graph[collectionName].some(existing => existing.id === node.id)) {
        throw new Error(`Duplicate ${collectionName.slice(0, -1)} id ${node.id}`);
      }
      graph[collectionName].push(clone(node));
    }
  }
  return graph;
}

function canonicalNode(node) {
  return stableValue(node);
}

export function normalizeGraph(graph) {
  return {
    schemaVersion: graph.schemaVersion ?? SPELL_AUTOMATION_SCHEMA_VERSION,
    id: graph.id,
    support: {
      level: graph.support?.level ?? "full",
      omissions: [...(graph.support?.omissions ?? [])].sort(),
    },
    actions: [...(graph.actions ?? [])].map(canonicalNode).sort((left, right) => left.id.localeCompare(right.id)),
    artifacts: [...(graph.artifacts ?? [])].map(canonicalNode).sort((left, right) => left.id.localeCompare(right.id)),
    rules: [...(graph.rules ?? [])].map(canonicalNode).sort((left, right) => left.id.localeCompare(right.id)),
  };
}

function collectOperations(graph) {
  const values = new Map();
  for (const currentRule of graph.rules ?? []) {
    for (const currentOperation of currentRule.do ?? []) {
      if (currentOperation.id) values.set(currentOperation.id, currentOperation);
    }
  }
  return values;
}

function collectTargetQueries(graph) {
  const values = new Map();
  for (const currentRule of graph.rules ?? []) {
    for (const query of currentRule.targets ?? []) {
      if (query.id) values.set(query.id, query);
    }
  }
  return values;
}

function lifecycleDependencies(value, output = []) {
  if (!value || typeof value !== "object") return output;
  if (value.type === "while-artifact" && value.artifactId) output.push(value.artifactId);
  for (const child of Object.values(value)) {
    if (Array.isArray(child)) child.forEach(entry => lifecycleDependencies(entry, output));
    else if (child && typeof child === "object") lifecycleDependencies(child, output);
  }
  return output;
}

function detectLifecycleCycle(artifacts) {
  const dependencies = new Map(
    artifacts.map(current => [current.id, lifecycleDependencies(current.lifecycle)]),
  );
  const visiting = new Set();
  const visited = new Set();
  function visit(id) {
    if (visiting.has(id)) return [id];
    if (visited.has(id)) return null;
    visiting.add(id);
    for (const dependency of dependencies.get(id) ?? []) {
      const cycle = visit(dependency);
      if (cycle) return [id, ...cycle];
    }
    visiting.delete(id);
    visited.add(id);
    return null;
  }
  for (const id of dependencies.keys()) {
    const cycle = visit(id);
    if (cycle) return cycle;
  }
  return null;
}

function positiveDiceExpression(value) {
  return value?.type === "dice"
    && Number.isInteger(Number(value.count))
    && Number(value.count) > 0
    && Number.isInteger(Number(value.faces))
    && Number(value.faces) > 1;
}

function validateHitPointPoolAllocator(
  currentOperation,
  currentRule,
  artifactById,
  targetQueries,
  errors,
) {
  const label = `${currentRule.id} allocate-hit-point-pool`;
  const expression = currentOperation.formulaExpression;
  if (
    !positiveDiceExpression(expression)
    && !(
      expression?.type === "per-slot-above-base"
      && positiveDiceExpression(expression.base)
      && positiveDiceExpression(expression.increment)
    )
  ) {
    errors.push(
      `${label} formula must lower from dice or per-slot-above-base dice`,
    );
  }
  const artifactValue = artifactById.get(currentOperation.artifactId);
  if (
    !artifactValue
    || artifactValue.kind !== "effect"
    || artifactValue.role !== "mechanical"
    || artifactValue.host !== "actor"
    || artifactValue.identity?.scope !== "source-target"
  ) {
    errors.push(
      `${label} requires an actor-hosted source-target mechanical effect artifact`,
    );
  }
  const query = targetQueries.get(currentOperation.target);
  const targetKinds = (query?.predicates ?? []).filter(predicateValue =>
    predicateValue.type === "target-kind"
  );
  if (
    !query
    || query.result !== "template-members"
    || query.origin?.type !== "placed-template"
    || query.evaluation !== "snapshot"
    || targetKinds.length !== 1
    || targetKinds[0].value !== "creature"
  ) {
    errors.push(
      `${label} requires one snapshot placed-template creature-member target`,
    );
  }
  const eligibility = currentOperation.eligibility;
  if (
    eligibility?.currentHitPoints !== "positive"
    || !Array.isArray(eligibility?.excludedStatuses)
    || eligibility.excludedStatuses.length === 0
    || eligibility.excludedStatuses.some(status =>
      !["blinded", "dead", "unconscious"].includes(status)
    )
    || new Set(eligibility.excludedStatuses).size
      !== eligibility.excludedStatuses.length
    || ![
      "magical-sleep",
      "condition:blinded",
    ].includes(eligibility.requiredSusceptibility)
  ) {
    errors.push(`${label} has an unsupported eligibility policy`);
  }
}

function validateInputSelectionPredicates(
  currentRule,
  graph,
  actionById,
  errors,
) {
  const predicates = (currentRule.when ?? []).filter(current =>
    current.type === "input-selection-equals"
  );
  if (!predicates.length) return;

  const sourceActionId = sourceActionIdForRule(currentRule, graph);
  const sourceAction = actionById.get(sourceActionId);
  const parameters = (sourceAction?.parameters ?? []).filter(parameter =>
    parameter.type === "enum"
    && parameter.lowering === "runtime-required"
  );
  if (!sourceAction || parameters.length === 0) {
    errors.push(
      `${currentRule.id} input-selection-equals requires its source action `
      + `${sourceActionId ?? "(unresolved)"} to declare at least one `
      + "runtime-required enum parameter",
    );
    return;
  }

  const parametersById = new Map(parameters.map(parameter => [
    parameter.id,
    parameter,
  ]));
  for (const predicateValue of predicates) {
    const parameter = parametersById.get(predicateValue.id);
    if (!parameter) {
      errors.push(
        `${currentRule.id} input-selection-equals references unknown parameter `
        + `${predicateValue.id}; source action ${sourceActionId} declares `
        + `${parameters.map(current => current.id).join(", ")}`,
      );
      continue;
    }
    if (!(parameter.values ?? []).includes(predicateValue.value)) {
      errors.push(
        `${currentRule.id} input-selection-equals value ${predicateValue.value} `
        + `is outside source action ${sourceActionId} enum ${parameter.id}`,
      );
    }
  }
}

export function validateSemanticGraph(graph, { throwOnError = true } = {}) {
  const errors = [];
  const actionById = new Map();
  const artifactById = new Map();
  const ruleById = new Map();
  const operations = collectOperations(graph);
  const targetQueries = collectTargetQueries(graph);

  if (!graph.id) errors.push("graph.id is required");
  if (graph.schemaVersion !== SPELL_AUTOMATION_SCHEMA_VERSION) {
    errors.push(`graph schemaVersion must be ${SPELL_AUTOMATION_SCHEMA_VERSION}`);
  }
  if (!SUPPORT_LEVELS.has(graph.support?.level)) {
    errors.push(`invalid support level ${graph.support?.level}`);
  }

  for (const currentAction of graph.actions ?? []) {
    if (!currentAction.id) errors.push("action id is required");
    else if (actionById.has(currentAction.id)) errors.push(`duplicate action ${currentAction.id}`);
    else actionById.set(currentAction.id, currentAction);
    if (!ACTION_ACTIVATIONS.has(currentAction.activation?.type ?? "none")) {
      errors.push(`${currentAction.id} has invalid activation ${currentAction.activation?.type}`);
    }
    if (!ACTION_VISIBILITIES.has(currentAction.visibility)) {
      errors.push(`${currentAction.id} has invalid visibility ${currentAction.visibility}`);
    }
    if (!ACTION_DELIVERIES.has(currentAction.delivery ?? "standalone")) {
      errors.push(`${currentAction.id} has invalid delivery ${currentAction.delivery}`);
    }
  }

  for (const currentArtifact of graph.artifacts ?? []) {
    if (!currentArtifact.id) errors.push("artifact id is required");
    else if (artifactById.has(currentArtifact.id)) errors.push(`duplicate artifact ${currentArtifact.id}`);
    else artifactById.set(currentArtifact.id, currentArtifact);
    if (!ARTIFACT_KINDS.has(currentArtifact.kind)) {
      errors.push(`${currentArtifact.id} has invalid kind ${currentArtifact.kind}`);
    }
    if (!ARTIFACT_ROLES.has(currentArtifact.role)) {
      errors.push(`${currentArtifact.id} has invalid role ${currentArtifact.role}`);
    }
    if (!ARTIFACT_SCOPES.has(currentArtifact.identity?.scope)) {
      errors.push(`${currentArtifact.id} has invalid identity scope ${currentArtifact.identity?.scope}`);
    }
    if (!currentArtifact.lifecycle?.type) errors.push(`${currentArtifact.id} has no lifecycle`);
    const savingThrowAdvantage = currentArtifact.state?.savingThrowAdvantage;
    if (
      savingThrowAdvantage !== undefined
      && (
        !savingThrowAdvantage
        || typeof savingThrowAdvantage !== "object"
        || !Array.isArray(savingThrowAdvantage.against)
        || savingThrowAdvantage.against.length === 0
        || savingThrowAdvantage.against.some(value => typeof value !== "string" || value.length === 0)
      )
    ) {
      errors.push(
        `${currentArtifact.id} savingThrowAdvantage requires a non-empty against string array`,
      );
    }
    const blockedActionKinds = currentArtifact.state?.blockedActionKinds;
    if (
      blockedActionKinds !== undefined
      && (
        !Array.isArray(blockedActionKinds)
        || blockedActionKinds.length === 0
        || blockedActionKinds.some(value => !BLOCKED_ACTION_KINDS.has(value))
        || new Set(blockedActionKinds).size !== blockedActionKinds.length
      )
    ) {
      errors.push(
        `${currentArtifact.id} blockedActionKinds requires unique attack/spell/reaction/action values`,
      );
    }
  }

  for (const currentRule of graph.rules ?? []) {
    if (!currentRule.id) errors.push("rule id is required");
    else if (ruleById.has(currentRule.id)) errors.push(`duplicate rule ${currentRule.id}`);
    else ruleById.set(currentRule.id, currentRule);
    if (!currentRule.on?.type) errors.push(`${currentRule.id} has no trigger`);
    if (currentRule.on?.type === "action-used" && !actionById.has(currentRule.on.actionId)) {
      errors.push(`${currentRule.id} references missing action ${currentRule.on.actionId}`);
    }
    if (
      ["operation-outcome", "operation-complete"].includes(
        currentRule.on?.type,
      )
      && !operations.has(currentRule.on.operationId)
      && !String(currentRule.on.operationId ?? "").startsWith("external:")
    ) {
      errors.push(`${currentRule.id} references missing operation ${currentRule.on.operationId}`);
    }
    validateInputSelectionPredicates(
      currentRule,
      graph,
      actionById,
      errors,
    );
    for (const query of currentRule.targets ?? []) {
      if (!query.id) errors.push(`${currentRule.id} has target query without id`);
      if (!TARGET_RESULTS.has(query.result)) errors.push(`${query.id} has invalid result ${query.result}`);
      if (!TARGET_EVALUATIONS.has(query.evaluation)) {
        errors.push(`${query.id} must declare snapshot or live evaluation`);
      }
      if (!query.origin?.type) errors.push(`${query.id} has no origin`);
      if (
        query.origin?.type === "selected"
        && (query.cardinality?.max === undefined || query.cardinality?.max === null)
      ) {
        errors.push(`${query.id} selected target requires cardinality.max`);
      }
      if (
        typeof query.cardinality?.min === "number"
        && query.cardinality.min < 0
      ) {
        errors.push(`${query.id} cardinality.min cannot be negative`);
      }
      if (
        typeof query.cardinality?.min === "number"
        && typeof query.cardinality?.max === "number"
        && query.cardinality.max < query.cardinality.min
      ) {
        errors.push(`${query.id} cardinality.max cannot be less than cardinality.min`);
      }
      if (
        query.origin?.type === "placed-template"
        && (!query.origin.shape?.type || query.origin.shape?.size === undefined)
      ) {
        errors.push(`${query.id} placed template requires shape type and size`);
      }
      if (query.evaluation === "live") {
        const hasReevaluation = (graph.rules ?? []).some(candidate =>
          ["enter", "leave", "token-moved", "turn-start", "turn-end"].includes(candidate.on?.type),
        );
        if (!hasReevaluation) errors.push(`${query.id} is live but graph has no reevaluation trigger`);
      }
    }
    for (const currentOperation of currentRule.do ?? []) {
      if (!OPERATION_TYPES.has(currentOperation.type)) {
        errors.push(`${currentRule.id} has unsupported operation ${currentOperation.type}`);
      }
      if (currentOperation.type === "damage") {
        if (!String(currentOperation.formula ?? "").trim()) {
          errors.push(`${currentRule.id} damage operation requires a formula`);
        }
        if (
          currentOperation.multiplier !== undefined
          && (
            !Number.isFinite(Number(currentOperation.multiplier))
            || Number(currentOperation.multiplier) <= 0
          )
        ) {
          errors.push(`${currentRule.id} damage multiplier must be a positive number`);
        }
        if (
          currentOperation.rounding !== undefined
          && !["down", "nearest", "up"].includes(currentOperation.rounding)
        ) {
          errors.push(`${currentRule.id} damage rounding must be down, nearest, or up`);
        }
      }
      if (currentOperation.type === "emit-event" && currentOperation.pool !== undefined) {
        const poolFormula = String(currentOperation.pool?.formula ?? "").trim();
        const poolScaling = currentOperation.pool?.scaling ?? {};
        if (!poolFormula) {
          errors.push(`${currentRule.id} emit-event pool.formula is required`);
        }
        if (poolScaling.mode === "slot-level") {
          const dicePerLevel = Number(poolScaling.dicePerLevel);
          if (!Number.isInteger(dicePerLevel) || dicePerLevel <= 0) {
            errors.push(
              `${currentRule.id} emit-event slot-level pool dicePerLevel must be a positive integer`,
            );
          }
          if (poolFormula && !/^\d+d\d+$/i.test(poolFormula.replace(/\s+/g, ""))) {
            errors.push(
              `${currentRule.id} emit-event slot-level pool formula must be a single dice term`,
            );
          }
        }
      }
      if (currentOperation.type === "allocate-hit-point-pool") {
        validateHitPointPoolAllocator(
          currentOperation,
          currentRule,
          artifactById,
          targetQueries,
          errors,
        );
      }
      if (
        [
          "create-artifact",
          "update-artifact",
          "delete-artifact",
          "apply-artifact",
          "allocate-hit-point-pool",
          "grant-hit-point-capacity",
          "reassert-native-summon-control",
        ].includes(currentOperation.type)
        && !artifactById.has(currentOperation.artifactId)
      ) {
        errors.push(`${currentRule.id} references missing artifact ${currentOperation.artifactId}`);
      }
      if (
        currentOperation.target
        && !["source", "event-target", "trigger-target"].includes(currentOperation.target)
        && !targetQueries.has(currentOperation.target)
      ) {
        errors.push(`${currentRule.id} operation ${currentOperation.id ?? currentOperation.type} references missing target ${currentOperation.target}`);
      }
      if (
        currentOperation.weapon
        && !targetQueries.has(currentOperation.weapon)
      ) {
        errors.push(
          `${currentRule.id} operation ${currentOperation.id ?? currentOperation.type} references missing weapon target ${currentOperation.weapon}`,
        );
      }
    }
    const hitPointPoolAllocators = (currentRule.do ?? []).filter(
      currentOperation => currentOperation.type === "allocate-hit-point-pool",
    );
    if (
      hitPointPoolAllocators.length > 0
      && (
        hitPointPoolAllocators.length !== 1
        || currentRule.on?.type !== "action-used"
        || (currentRule.do ?? []).some(currentOperation =>
          !["consume-resource", "allocate-hit-point-pool"].includes(
            currentOperation.type,
          )
        )
      )
    ) {
      errors.push(
        `${currentRule.id} hit-point pool rule requires one action-used allocator plus optional resource consumption`,
      );
    }
  }

  for (const currentAction of graph.actions ?? []) {
    const actionRules = (graph.rules ?? []).filter(currentRule =>
      currentRule.on?.type === "action-used" && currentRule.on.actionId === currentAction.id
    );
    if ((currentAction.delivery ?? "standalone") === "standalone" && actionRules.length === 0) {
      errors.push(`${currentAction.id} has no action-used rule`);
    }
  }

  const lifecycleCycle = detectLifecycleCycle(graph.artifacts ?? []);
  if (lifecycleCycle) errors.push(`artifact lifecycle cycle: ${lifecycleCycle.join(" -> ")}`);
  const abilityIds = new Set(["str", "dex", "con", "int", "wis", "cha"]);
  for (const currentArtifact of graph.artifacts ?? []) {
    for (const modifier of currentArtifact.state?.runtimeModifiers ?? []) {
      if (modifier?.type !== "ability-check-disadvantage-selection") continue;
      const creators = (graph.rules ?? []).filter(currentRule =>
        currentRule.on?.type === "action-used"
        && (currentRule.do ?? []).some(currentOperation =>
          ["create-artifact", "apply-artifact"].includes(currentOperation.type)
          && currentOperation.artifactId === currentArtifact.id
        )
      );
      const parameters = creators.flatMap(currentRule =>
        actionById.get(currentRule.on.actionId)?.parameters ?? []
      ).filter(parameter =>
        parameter.id === modifier.parameterId
        && parameter.type === "enum"
        && parameter.lowering === "runtime-required"
      );
      if (
        creators.length !== 1
        || parameters.length !== 1
        || !(parameters[0].values ?? []).length
        || parameters[0].values.some(value => !abilityIds.has(value))
      ) {
        errors.push(
          `${currentArtifact.id} ability-check disadvantage selection `
          + `${modifier.parameterId} requires one runtime-required D&D ability enum on its creator action`,
        );
      }
    }
  }
  for (const currentArtifact of graph.artifacts ?? []) {
    for (const dependency of lifecycleDependencies(currentArtifact.lifecycle)) {
      if (!artifactById.has(dependency)) {
        errors.push(`${currentArtifact.id} lifecycle references missing artifact ${dependency}`);
      }
    }
  }

  if (
    graph.support?.level !== "full"
    && (graph.support?.omissions ?? []).length === 0
  ) {
    errors.push(`${graph.support?.level} support requires explicit omissions`);
  }
  if (
    graph.support?.level === "full"
    && (graph.support?.omissions ?? []).length > 0
  ) {
    errors.push("full support cannot declare omissions");
  }
  if (errors.length && throwOnError) {
    throw new Error(`Invalid spell semantic graph ${graph.id}:\n- ${errors.join("\n- ")}`);
  }
  return errors;
}

function substituteBindings(value, bindings) {
  if (typeof value === "string") {
    const exact = value.match(/^\$parameter\.([A-Za-z0-9_-]+)$/);
    if (exact) return bindings[exact[1]];
    return value.replace(/\$parameter\.([A-Za-z0-9_-]+)/g, (_, key) => String(bindings[key] ?? ""));
  }
  if (Array.isArray(value)) return value.map(child => substituteBindings(child, bindings));
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, substituteBindings(child, bindings)]),
  );
}

function parameterExpansions(currentAction) {
  const named = (currentAction.parameters ?? []).filter(parameter =>
    parameter.type === "enum" && parameter.lowering === "named-actions"
  );
  if (named.length === 0) return [{ actionId: currentAction.id, name: currentAction.name, bindings: {} }];
  let expansions = [{ actionId: currentAction.id, name: currentAction.name, bindings: {} }];
  for (const parameter of named) {
    expansions = expansions.flatMap(existing =>
      (parameter.values ?? []).map(value => ({
        actionId: `${existing.actionId}:${value}`,
        name: parameter.labels?.[value]
          ? `${currentAction.name}: ${parameter.labels[value]}`
          : `${currentAction.name}: ${value}`,
        bindings: { ...existing.bindings, [parameter.id]: value },
      }))
    );
  }
  return expansions;
}

function resolveNativeSummonChoiceCardinality(currentArtifact, bindings, graphId) {
  if (
    currentArtifact?.kind !== "entity"
    || currentArtifact.state?.cardinality?.type !== "profile-choice"
  ) {
    return currentArtifact;
  }
  const selectionId = currentArtifact.state?.selection?.id;
  const selectedChoice = selectionId ? bindings?.[selectionId] : null;
  const profiles = (currentArtifact.state?.profiles ?? []).filter(profile =>
    profile.choice === selectedChoice
  );
  if (profiles.length !== 1) {
    throw new Error(
      `${graphId} native summon action must resolve exactly one cardinality profile choice`,
    );
  }
  const cardinality = profiles[0].cardinality;
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
      `${graphId} native summon profile ${selectedChoice} has invalid canonical cardinality`,
    );
  }
  return {
    ...currentArtifact,
    state: {
      ...currentArtifact.state,
      cardinality: clone(cardinality),
    },
  };
}

function withinRange(target) {
  return (target?.predicates ?? []).find(current => current.type === "within-range") ?? null;
}

function targetKind(target) {
  return (target?.predicates ?? []).find(current => current.type === "target-kind")?.value ?? "creature";
}

function deriveInput(target, delivery) {
  if (delivery === "declared-rider") return "inherited-trigger-target";
  if (!target) return "none";
  if (target.origin?.type === "self") return "self";
  if (target.origin?.type === "selected") return "selected-targets";
  if (target.origin?.type === "placed-template") {
    const range = withinRange(target);
    const shapeType = target.origin?.shape?.type;
    if (
      range?.units === "self"
      && ["radius", "squareRadius"].includes(shapeType)
    ) {
      return "self";
    }
    return "placed-template";
  }
  if (target.origin?.type === "placed-point") return "placed-template";
  if (["event-binding", "event-neighborhood"].includes(target.origin?.type)) {
    return "event-binding";
  }
  return "none";
}

function targetSelectionConstraints(target) {
  return (target?.predicates ?? [])
    .filter(current =>
      current.type === "pairwise-within-distance"
      || current.type === "exclude-source"
      || current.type === "artifact-exists"
    )
    .map(current => {
      if (current.type === "pairwise-within-distance") {
        return {
          type: current.type,
          maximum: current.distance,
          units: current.units,
        };
      }
      if (current.type === "exclude-source") {
        return { type: current.type };
      }
      if (current.subject !== "target") {
        throw new Error(
          `selected target artifact-exists predicate subject must be "target"; `
          + `received ${current.subject}`,
        );
      }
      return {
        type: current.type,
        artifactId: current.artifactId,
        subject: current.subject,
      };
    });
}

function loweringAdapter(hint) {
  if (!hint || typeof hint === "string") return null;
  return clone(hint);
}

function loweringProvider(hint) {
  return typeof hint === "string" ? hint : hint?.provider;
}

function operationResultReferences(value, output = []) {
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
      child.forEach(entry => operationResultReferences(entry, output));
    } else if (child && typeof child === "object") {
      operationResultReferences(child, output);
    }
  }
  return output;
}

function runtimeOwnedOperationIds(ruleValue) {
  const operations = ruleValue?.do ?? [];
  const byId = new Map(
    operations
      .filter(current => current.id)
      .map(current => [current.id, current]),
  );
  const owned = new Set();
  for (const current of operations) {
    if ([
      "weapon-attack",
      "grant-hit-point-capacity",
      "suppress-statuses",
      "reassert-native-summon-control",
    ].includes(current.type)) {
      if (current.id) owned.add(current.id);
      continue;
    }
    if (current.type === "allocate-hit-point-pool") {
      if (current.id) owned.add(current.id);
      continue;
    }
    if (current.type === "remove-statuses") {
      if (current.id) owned.add(current.id);
      continue;
    }
    const references = operationResultReferences(
      current.formulaExpression ?? current.formula,
    );
    if (references.length > 0 || current.mitigation === "none") {
      if (current.id) owned.add(current.id);
      references.forEach(operationId => {
        if (byId.has(operationId)) owned.add(operationId);
      });
    }
  }
  return owned;
}

function inferredRuleAdapter(ruleValue) {
  const operations = ruleValue?.do ?? [];
  const summonControlOperations = operations.filter(current =>
    current.type === "reassert-native-summon-control"
  );
  if (summonControlOperations.length > 0) {
    if (
      summonControlOperations.length !== 1
      || operations.some(current =>
        !["consume-resource", "reassert-native-summon-control"].includes(current.type)
      )
    ) {
      throw new Error(
        `${ruleValue.id} native summon control rule has unsupported companion operations`,
      );
    }
    return { adapter: "native-summon-control-v1" };
  }
  const weaponAttacks = operations.filter(current =>
    current.type === "weapon-attack"
  );
  if (weaponAttacks.length > 0) {
    if (
      weaponAttacks.length !== 1
      || operations.some(current => current.type !== "weapon-attack")
    ) {
      throw new Error(
        `${ruleValue.id} owned weapon attack rule must contain exactly one weapon-attack`,
      );
    }
    return { adapter: "owned-weapon-attack-v1", phase: "cast" };
  }
  const capacities = operations.filter(current =>
    current.type === "grant-hit-point-capacity"
  );
  if (capacities.length > 0) {
    if (
      capacities.length !== 1
      || operations.some(current =>
        !["consume-resource", "grant-hit-point-capacity"].includes(current.type)
      )
    ) {
      throw new Error(
        `${ruleValue.id} hit-point capacity rule has unsupported companion operations`,
      );
    }
    return { adapter: "reversible-hit-point-capacity-v1" };
  }
  const suppressions = operations.filter(current =>
    current.type === "suppress-statuses"
  );
  if (suppressions.length > 0) {
    if (
      suppressions.length !== 1
      || operations.some(current =>
        !["apply-artifact", "suppress-statuses"].includes(current.type)
      )
    ) {
      throw new Error(
        `${ruleValue.id} status suppression rule has unsupported companion operations`,
      );
    }
    return { adapter: "status-effect-suppression-v1" };
  }
  if (
    (ruleValue.when ?? []).some(current =>
      current.type === "input-selection-equals"
    )
  ) {
    if (
      (ruleValue.do ?? []).length === 0
      || (ruleValue.do ?? []).some(current =>
        current.type !== "apply-artifact"
      )
    ) {
      throw new Error(
        `${ruleValue.id} required-selection outcome supports only artifact applications`,
      );
    }
    return { adapter: "required-selection-outcome-v1" };
  }
  const hitPointPoolAllocators = operations.filter(current =>
    current.type === "allocate-hit-point-pool"
  );
  if (hitPointPoolAllocators.length > 0) {
    if (
      hitPointPoolAllocators.length !== 1
      || operations.some(current =>
        !["consume-resource", "allocate-hit-point-pool"].includes(current.type)
      )
    ) {
      throw new Error(
        `${ruleValue.id} cannot mix allocate-hit-point-pool with unrelated operations`,
      );
    }
    return { adapter: "hit-point-pool-allocator-v1" };
  }
  const hasStatusRemoval = operations.some(current =>
    current.type === "remove-statuses"
  );
  const runtimeOwnedIds = runtimeOwnedOperationIds(ruleValue);
  const hasLinkedOperations = operations.some(current =>
    current.type !== "remove-statuses"
    && runtimeOwnedIds.has(current.id)
  );
  if (hasStatusRemoval && hasLinkedOperations) {
    throw new Error(
      `${ruleValue.id} cannot mix remove-statuses with linked operation results `
      + "in one runtime rule",
    );
  }
  if (hasStatusRemoval) {
    return { adapter: "target-status-removal-v1" };
  }
  if (hasLinkedOperations) {
    return { adapter: "linked-operation-results-v1" };
  }
  return null;
}

function operationRunsInActivity(currentOperation, currentRule) {
  if ([
    "remove-statuses",
    "weapon-attack",
    "grant-hit-point-capacity",
    "suppress-statuses",
    "reassert-native-summon-control",
  ].includes(currentOperation.type)) return false;
  if (
    currentOperation.type === "delete-artifact"
    && currentRule.on?.type === "action-used"
  ) return false;
  return !runtimeOwnedOperationIds(currentRule).has(currentOperation.id);
}

function graphOperation(graph, operationId) {
  for (const currentRule of graph.rules ?? []) {
    const currentOperation = (currentRule.do ?? []).find(value => value.id === operationId);
    if (currentOperation) return currentOperation;
  }
  return null;
}

function graphRuleForOperation(graph, operationId) {
  return (graph.rules ?? []).find(currentRule =>
    (currentRule.do ?? []).some(currentOperation =>
      currentOperation.id === operationId
    )
  ) ?? null;
}

function nativeOutcomeRule(ruleValue, graph) {
  if (ruleValue.on?.type !== "operation-outcome") return false;
  const outcome = ruleValue.on?.outcome;
  const sourceOperation = graphOperation(graph, ruleValue.on?.operationId);
  const effectOnly = (ruleValue.do ?? []).length > 0
    && (ruleValue.do ?? []).every(value =>
      ["create-artifact", "apply-artifact"].includes(value.type)
    );
  const workflowTargets = (ruleValue.targets ?? []).length > 0
    && (ruleValue.targets ?? []).every(value =>
      value.origin?.type === "event-binding"
      && value.origin?.name === "target"
    );
  if (!sourceOperation || !effectOnly || !workflowTargets) return false;
  if (sourceOperation.type === "saving-throw") {
    return ["success", "failure"].includes(outcome);
  }
  return sourceOperation.type === "attack-roll" && outcome === "hit";
}

function ruleProvider(ruleValue, graph, hints) {
  const explicit = loweringProvider(hints?.rules?.[ruleValue.id]);
  if (explicit) return explicit;
  if (inferredRuleAdapter(ruleValue)) return "arcane-runtime";
  if (ruleValue.on?.type === "action-used") {
    const types = new Set((ruleValue.do ?? []).map(value => value.type));
    const runtimeOwnedArtifact = (ruleValue.do ?? [])
      .filter(value => ["create-artifact", "apply-artifact", "update-artifact"].includes(value.type))
      .map(value => (graph.artifacts ?? []).find(artifactValue => artifactValue.id === value.artifactId))
      .filter(Boolean)
      .some(artifactValue =>
        artifactValue.kind !== "effect"
        && artifactProvider(artifactValue, hints) === "arcane-runtime"
      );
    if (runtimeOwnedArtifact) return "arcane-runtime";
    if ([...types].every(type => [
      "consume-resource",
      "saving-throw",
      "attack-roll",
      "damage",
      "healing",
      "grant-temporary-hp",
      "create-artifact",
      "apply-artifact",
      "dash",
    ].includes(type))) {
      return "dnd5e-midi-native";
    }
  }
  if (["enter", "leave"].includes(ruleValue.on?.type)) return "active-auras";
  if (["turn-start", "turn-end"].includes(ruleValue.on?.type)) return "midi-overtime";
  if (ruleValue.on?.type === "operation-outcome") {
    if (String(ruleValue.on.operationId ?? "").startsWith("external:")) return "arcane-runtime";
    return nativeOutcomeRule(ruleValue, graph)
      ? "dnd5e-midi-native"
      : "arcane-runtime";
  }
  return "arcane-runtime";
}

function artifactProvider(artifactValue, hints) {
  const explicit = loweringProvider(hints?.artifacts?.[artifactValue.id]);
  if (explicit) return explicit;
  if (artifactValue.kind === "marker") return "arcane-runtime";
  if (artifactValue.role === "presentation") return "aura-effects";
  if (artifactValue.kind === "zone") return "active-auras";
  if (artifactValue.kind === "effect") return "native-active-effect";
  return "arcane-runtime";
}

function artifactCapabilities(artifactValue, hints) {
  const capabilities = new Set([artifactProvider(artifactValue, hints)]);
  if (
    (artifactValue.state?.blockedActionKinds ?? []).length > 0
    || (artifactValue.state?.runtimeModifiers ?? []).length > 0
    || artifactValue.state?.outcomeRace
    || artifactValue.state?.sourceTermination?.type
      === "last-dependent-ended"
  ) {
    capabilities.add("arcane-runtime");
  }
  return [...capabilities];
}

function artifactAdapter(artifactValue, hints) {
  return loweringAdapter(hints?.artifacts?.[artifactValue.id]);
}

function ruleAdapter(ruleValue, hints) {
  return loweringAdapter(hints?.rules?.[ruleValue.id])
    ?? inferredRuleAdapter(ruleValue);
}

function runtimeAdapterPhase(contract, ruleHint) {
  if (!contract?.phases) return contract;
  const phase = ruleHint?.phase;
  return phase ? contract.phases[phase] ?? null : null;
}

function arcaneRuntimeLink(ruleValue, hints) {
  const ruleHint = ruleAdapter(ruleValue, hints);
  if (!ruleHint || typeof ruleHint !== "object") return false;
  const contract = ARCANE_RUNTIME_RULE_ADAPTERS[ruleHint.adapter];
  if (!contract) return false;
  const phaseContract = runtimeAdapterPhase(contract, ruleHint);
  if (!phaseContract) return false;
  if (
    Array.isArray(phaseContract.triggers)
    && !phaseContract.triggers.includes(ruleValue.on?.type)
  ) {
    return false;
  }
  const activityBinding = phaseContract.activityBinding
    ?? (contract.requiresActivityIdentifier ? "uses" : null);
  if (activityBinding === "uses") {
    const identifier = ruleHint.usesActivityIdentifier;
    if (!identifier) return false;
    return Object.values(hints?.rules ?? {}).some(value =>
      value
      && typeof value === "object"
      && value.activityIdentifier === identifier
    );
  }
  if (activityBinding === "defines-or-uses") {
    if (ruleHint.activityIdentifier) return true;
    const identifier = ruleHint.usesActivityIdentifier;
    if (!identifier) return false;
    return Object.values(hints?.rules ?? {}).some(value =>
      value
      && typeof value === "object"
      && value.activityIdentifier === identifier
    );
  }
  if (activityBinding === "defines") return Boolean(ruleHint.activityIdentifier);
  return true;
}

function midiOvertimeLink(ruleValue, hints) {
  const ruleHint = hints?.rules?.[ruleValue.id];
  if (!ruleHint || typeof ruleHint !== "object") return false;
  if (["turn-start", "turn-end"].includes(ruleValue.on?.type)) {
    return Boolean(
      ruleHint.activityIdentifier
      && ruleHint.overTime
      && ["start", "end"].includes(ruleHint.overTime.turnChoice)
      && typeof ruleHint.overTime.saveRemoves === "boolean"
      && ["source", "target"].includes(ruleHint.overTime.rollAs),
    );
  }
  if (ruleValue.on?.type === "operation-outcome") {
    const identifier = ruleHint.usesActivityIdentifier;
    if (!identifier) return false;
    return Object.values(hints?.rules ?? {}).some(value =>
      value
      && typeof value === "object"
      && value.activityIdentifier === identifier
      && value.overTime?.saveRemoves === true
    );
  }
  return false;
}

function mergeArtifactLoweringHint(left = {}, right = {}) {
  if (typeof left === "string" || typeof right === "string") return clone(right);
  return {
    ...clone(left),
    ...clone(right),
    flags: {
      ...(clone(left?.flags) ?? {}),
      ...(clone(right?.flags) ?? {}),
    },
  };
}

function mergeInferredLoweringHints(inferred, explicit = {}) {
  const artifacts = { ...(inferred.artifacts ?? {}) };
  for (const [artifactId, hint] of Object.entries(explicit.artifacts ?? {})) {
    artifacts[artifactId] = mergeArtifactLoweringHint(
      artifacts[artifactId],
      hint,
    );
  }
  return {
    ...clone(inferred),
    ...clone(explicit),
    artifacts,
    rules: {
      ...(inferred.rules ?? {}),
      ...(clone(explicit.rules) ?? {}),
    },
    identity: {
      ...(inferred.identity ?? {}),
      ...(clone(explicit.identity) ?? {}),
    },
    dedupe: {
      ...(inferred.dedupe ?? {}),
      ...(clone(explicit.dedupe) ?? {}),
    },
    representations: {
      ...(inferred.representations ?? {}),
      ...(clone(explicit.representations) ?? {}),
    },
    moduleFlags: clone(explicit.moduleFlags ?? inferred.moduleFlags ?? {}),
  };
}

function inferPerSpellScriptRuntimeHints(graph, script, explicit = {}) {
  if (!script) return explicit;
  const inferred = { rules: {}, identity: {}, dedupe: {} };
  for (const handler of script.handlers ?? []) {
    if (handler.event !== "typed-damage-transaction") continue;
    const currentRule = (graph.rules ?? []).find(ruleValue =>
      ruleValue.id === handler.runtimeRuleId
    );
    if (!currentRule) {
      throw new Error(
        `${graph.id} typed damage handler ${handler.id} references a missing rule`,
      );
    }
    inferred.rules[currentRule.id] = {
      provider: "arcane-runtime",
      adapter: "typed-damage-dispatcher-v2",
      version: 2,
      scriptId: script.id,
      scriptVersion: script.version,
      handlerId: handler.id,
      artifactId: handler.artifactId,
    };
    inferred.identity[currentRule.id] = "transactionId + targetActorUuid";
    inferred.dedupe[currentRule.id] = handler.dedupe;
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalFatalDamageInterceptionHints(
  graph,
  explicit = {},
) {
  const inferred = {
    artifacts: {},
    rules: {},
    dedupe: {},
  };
  const artifacts = (graph.artifacts ?? []).filter(current =>
    (current.state?.runtimeModifiers ?? []).some(modifier =>
      modifier?.type === "fatal-damage-interception"
    )
  );
  for (const artifactValue of artifacts) {
    const sourceArtifact = sourceTargetMechanicalEffect(
      graph,
      artifactValue.id,
      `${graph.id} fatal-damage interception`,
    );
    const modifiers = sourceArtifact.state?.runtimeModifiers ?? [];
    const modifier = modifiers.find(current =>
      current?.type === "fatal-damage-interception"
    );
    if (
      sourceArtifact.kind !== "effect"
      || sourceArtifact.host !== "actor"
      || modifiers.length !== 1
      || stableStringify(Object.keys(modifier ?? {}).sort())
        !== stableStringify(["minimumHitPoints", "type", "version"])
      || modifier?.version !== 1
      || modifier?.minimumHitPoints !== 1
    ) {
      throw new Error(
        `${graph.id} fatal-damage interception requires one version-1 `
        + "source-target actor effect that clamps damage to 1 HP",
      );
    }

    const creators = (graph.rules ?? []).flatMap(currentRule =>
      (currentRule.do ?? [])
        .filter(currentOperation =>
          currentOperation.type === "apply-artifact"
          && currentOperation.artifactId === sourceArtifact.id
        )
        .map(currentOperation => ({ currentRule, currentOperation }))
    );
    if (creators.length !== 1) {
      throw new Error(
        `${graph.id} fatal-damage interception effect ${sourceArtifact.id} `
        + "requires exactly one cast application",
      );
    }
    const { currentRule: castRule, currentOperation: application } = creators[0];
    const target = (castRule.targets ?? []).find(current =>
      current.id === application.target
    );
    const operations = castRule.do ?? [];
    const consumptions = operations.filter(current =>
      current.type === "consume-resource"
      && current.resource === "spell-slot"
      && current.timing === "on-use"
    );
    const range = (target?.predicates ?? []).find(current =>
      current.type === "within-range"
    );
    const targetKind = (target?.predicates ?? []).find(current =>
      current.type === "target-kind"
    );
    if (
      castRule.on?.type !== "action-used"
      || (castRule.when ?? []).length !== 0
      || (castRule.targets ?? []).length !== 1
      || target?.result !== "tokens"
      || target?.origin?.type !== "selected"
      || target?.evaluation !== "snapshot"
      || target?.cardinality?.min !== 1
      || target?.cardinality?.max !== 1
      || range?.distance !== null
      || range?.units !== "touch"
      || range?.from !== "source"
      || targetKind?.value !== "creature"
      || (target?.predicates ?? []).length !== 2
      || consumptions.length !== 1
      || operations.length !== 2
    ) {
      throw new Error(
        `${castRule.id} fatal-damage interception requires one ordinary `
        + "spell-slot cast applying the effect to exactly one touched creature",
      );
    }
    const contract = {
      version: 1,
      kind: "death-ward",
      rank: 100,
      minimumHitPoints: 1,
      artifactId: sourceArtifact.id,
    };
    inferred.artifacts[sourceArtifact.id] = mergeArtifactLoweringHint(
      inferred.artifacts[sourceArtifact.id],
      {
        provider: "native-active-effect",
        adapter: "fatal-damage-interception-v1",
        flags: { fatalDamageInterception: contract },
      },
    );
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalNativeSummonHints(graph, explicit = {}, { contract } = {}) {
  const inferred = {
    artifacts: {},
    rules: {},
    identity: {},
    dedupe: {},
    representations: {},
  };
  const entities = (graph.artifacts ?? []).filter(current =>
    current.kind === "entity"
  );
  if (entities.length === 0) {
    return mergeInferredLoweringHints(inferred, explicit);
  }
  if (entities.length !== 1) {
    throw new Error(
      `${graph.id} native summon requires exactly one entity artifact`,
    );
  }
  if (graph.support?.level !== "simplified") {
    throw new Error(`${graph.id} native summon requires simplified support`);
  }
  if (!Array.isArray(graph.support?.omissions) || graph.support.omissions.length === 0) {
    throw new Error(`${graph.id} native summon requires explicit HITL omissions`);
  }

  const entity = entities[0];
  const creatorRules = (graph.rules ?? []).filter(current =>
    (current.do ?? []).some(operationValue =>
      operationValue.type === "create-artifact"
      && operationValue.artifactId === entity.id
    )
  );
  if (creatorRules.length !== 1) {
    throw new Error(
      `${graph.id} native summon entity ${entity.id} must have exactly one creator rule`,
    );
  }
  const currentRule = creatorRules[0];
  if (explicit.rules?.[currentRule.id] || explicit.artifacts?.[entity.id]) {
    throw new Error(
      `${graph.id} native summon does not permit explicit provider or adapter hints`,
    );
  }
  const actionValue = (graph.actions ?? []).find(current =>
    current.id === currentRule.on?.actionId
  );
  const targets = currentRule.targets ?? [];
  const operations = currentRule.do ?? [];
  const consumes = operations.filter(current =>
    current.type === "consume-resource"
  );
  const creates = operations.filter(current =>
    current.type === "create-artifact"
  );
  const selfTarget = targets[0];
  if (
    currentRule.on?.type !== "action-used"
    || !actionValue
    || actionValue.delivery !== "standalone"
    || actionValue.visibility !== "public"
    || (actionValue.availableWhen ?? []).length !== 0
    || actionValue.resolution !== undefined
    || actionValue.defaultTargetSelection !== undefined
    || (currentRule.when ?? []).length !== 0
    || targets.length !== 1
    || selfTarget.result !== "source"
    || selfTarget.origin?.type !== "self"
    || selfTarget.evaluation !== "snapshot"
    || selfTarget.cardinality?.min !== 1
    || selfTarget.cardinality?.max !== 1
    || (selfTarget.predicates ?? []).length !== 0
    || operations.length !== 2
    || operations[0]?.type !== "consume-resource"
    || operations[1]?.type !== "create-artifact"
    || consumes.length !== 1
    || consumes[0].resource !== "spell-slot"
    || consumes[0].timing !== "on-use"
    || creates.length !== 1
    || creates[0].artifactId !== entity.id
    || creates[0].target !== "source"
  ) {
    throw new Error(
      `${graph.id} native summon requires one unconditional public standalone self action, `
      + "one on-use spell-slot consumption, and one source entity creation",
    );
  }

  const selectionParameterId = entity.state?.selection?.id ?? null;
  const enumParameters = (actionValue.parameters ?? []).filter(current =>
    current.type === "enum"
    && current.lowering === "named-actions"
  );
  const allParameters = actionValue.parameters ?? [];
  if (selectionParameterId === null) {
    if (allParameters.length !== 0) {
      throw new Error(
        `${graph.id} fixed native summon action must not declare parameters`,
      );
    }
  } else {
    const selection = enumParameters.find(current =>
      current.id === selectionParameterId
    );
    const expectedChoices = (entity.state?.profiles ?? [])
      .map(current => current.choice);
    const actualChoices = [...(selection?.values ?? [])];
    const expectedLabels = Object.fromEntries(
      (entity.state?.profiles ?? []).map(current => [current.choice, current.label]),
    );
    if (
      allParameters.length !== 1
      || enumParameters.length !== 1
      || !selection
      || stableStringify(actualChoices) !== stableStringify(expectedChoices)
      || stableStringify(selection.labels ?? {}) !== stableStringify(expectedLabels)
    ) {
      throw new Error(
        `${graph.id} native summon named actions must exactly match ordered pool choices and labels`,
      );
    }
  }

  const entityCardinality = entity.state?.cardinality;
  const profiles = entity.state?.profiles ?? [];
  if (entityCardinality?.type === "profile-choice") {
    if (
      selectionParameterId === null
      || Object.keys(entityCardinality).length !== 1
      || profiles.some(profile => {
        const cardinality = profile.cardinality;
        return !(
          (cardinality?.type === "single" && cardinality?.count === 1)
          || (cardinality?.type === "fixed-small" && cardinality?.count === 2)
          || (cardinality?.type === "fixed-three" && cardinality?.count === 3)
          || (cardinality?.type === "fixed-group" && cardinality?.count === 5)
        );
      })
    ) {
      throw new Error(
        `${graph.id} native summon profile-choice cardinality must resolve to canonical single/1, fixed-small/2, fixed-three/3, or fixed-group/5 choices`,
      );
    }
  } else if (
    !(
      (entityCardinality?.type === "single" && entityCardinality?.count === 1)
      || (entityCardinality?.type === "fixed-small" && entityCardinality?.count === 2)
      || (entityCardinality?.type === "fixed-three" && entityCardinality?.count === 3)
      || (entityCardinality?.type === "fixed-group" && entityCardinality?.count === 5)
    )
    || profiles.length !== 1
    || stableStringify(profiles[0]?.cardinality) !== stableStringify(entityCardinality)
  ) {
    throw new Error(
      `${graph.id} fixed native summon cardinality must exactly match its sole profile`,
    );
  }

  const concentration = contract?.lifetime?.concentration === true;
  const cleanupExpiry = entity.state?.cleanup?.expiry ?? null;
  const control = entity.state?.control ?? null;
  if (concentration !== (cleanupExpiry === "concentration-effect")) {
    throw new Error(
      `${graph.id} native summon cleanup policy must match the spell concentration contract`,
    );
  }
  if (
    control
    && (
      control.type !== "time-bound"
      || control.expiry !== "release-control-keep-entity"
      || control.duration?.type !== "duration"
      || control.duration?.value !== 24
      || control.duration?.units !== "hours"
      || cleanupExpiry !== null
      || entity.lifecycle?.type !== "manual"
    )
  ) {
    throw new Error(
      `${graph.id} time-bound native summon control must be a manual 24-hour keep-entity relationship`,
    );
  }
  if (
    cleanupExpiry === "long-rest-or-defeat-or-dismiss"
    && (
      entity.state?.cleanup?.fallback !== "dm-dismiss-source-marker"
      || entity.lifecycle?.type !== "manual"
    )
  ) {
    throw new Error(
      `${graph.id} planar native summon lifecycle requires a manual DM-dismiss source marker`,
    );
  }
  if (
    entity.state?.cleanup?.expiry === "dm-duration"
    && (
      entity.state?.uniqueness?.scope !== "source-actor-item"
      || entity.state?.uniqueness?.maximum !== 1
      || entity.state?.uniqueness?.enforcement !== "replace-after-create"
    )
  ) {
    throw new Error(
      `${graph.id} non-concentration native summon requires replace-after-success uniqueness`,
    );
  }

  const otherReferences = (graph.rules ?? []).flatMap(ruleValue =>
    (ruleValue.do ?? []).filter(operationValue =>
      operationValue.artifactId === entity.id
      && operationValue !== creates[0]
    )
  );
  const reassertReferences = otherReferences.filter(operationValue =>
    operationValue.type === "reassert-native-summon-control"
  );
  const forbiddenReferences = otherReferences.filter(operationValue =>
    operationValue.type !== "reassert-native-summon-control"
  );
  const availabilityReferences = (graph.actions ?? []).flatMap(actionEntry =>
    (actionEntry.availableWhen ?? []).filter(condition =>
      condition.artifactId === entity.id
    )
  );
  const predicateReferences = (graph.rules ?? []).flatMap(ruleValue => [
    ...(ruleValue.when ?? []),
    ...(ruleValue.targets ?? []).flatMap(target => target.predicates ?? []),
  ]).filter(condition => condition.artifactId === entity.id);
  const lifecycleReferences = (graph.artifacts ?? [])
    .filter(current => current !== entity)
    .filter(current => JSON.stringify(current.lifecycle ?? {}).includes(entity.id));
  if (
    forbiddenReferences.length > 0
    || availabilityReferences.length > 0
    || predicateReferences.length > 0
    || lifecycleReferences.length > 0
  ) {
    throw new Error(
      `${graph.id} native summon entity ${entity.id} cannot be referenced outside its creator rule`,
    );
  }

  if ((control ? reassertReferences.length : 0) !== reassertReferences.length) {
    throw new Error(
      `${graph.id} reassert-native-summon-control requires a time-bound entity control contract`,
    );
  }
  if (control && reassertReferences.length !== 1) {
    throw new Error(
      `${graph.id} time-bound native summon control requires exactly one reassert rule`,
    );
  }
  if (reassertReferences.length === 1) {
    const reassertOperation = reassertReferences[0];
    const reassertRule = (graph.rules ?? []).find(ruleValue =>
      (ruleValue.do ?? []).includes(reassertOperation)
    );
    const reassertAction = (graph.actions ?? []).find(actionEntry =>
      actionEntry.id === reassertRule?.on?.actionId
    );
    const reassertTarget = reassertRule?.targets?.[0];
    const reassertOperations = reassertRule?.do ?? [];
    if (
      reassertRule?.on?.type !== "action-used"
      || !reassertAction
      || reassertAction.visibility !== "public"
      || reassertAction.delivery !== "standalone"
      || (reassertAction.parameters ?? []).length !== 0
      || (reassertAction.availableWhen ?? []).length !== 0
      || (reassertRule.when ?? []).length !== 0
      || (reassertRule.targets ?? []).length !== 1
      || reassertTarget?.origin?.type !== "selected"
      || reassertTarget?.result !== "tokens"
      || reassertTarget?.cardinality?.min !== 1
      || reassertTarget?.cardinality?.max !== 3
      || targetKind(reassertTarget) !== "creature"
      || reassertTarget?.predicates?.filter(predicateValue =>
        predicateValue.type === "within-range"
        && predicateValue.distance === 10
        && predicateValue.units === "ft"
        && predicateValue.from === "source"
      ).length !== 1
      || reassertOperations.length !== 2
      || reassertOperations[0]?.type !== "consume-resource"
      || reassertOperations[0]?.resource !== "spell-slot"
      || reassertOperations[1] !== reassertOperation
      || reassertOperation.target !== reassertTarget.id
    ) {
      throw new Error(
        `${graph.id} native summon control reassert must be one public 1..3 target, 10-foot, spell-slot action`,
      );
    }
    const controlContract = {
      version: 1,
      operation: "reassert",
      artifactId: entity.id,
      profileIds: [...new Set(profiles.map(profile => profile.profileId))],
      expiry: control.expiry,
      durationSeconds: 24 * 60 * 60,
      minimumTargets: 1,
      maximumTargets: 3,
      range: { distance: 10, units: "ft" },
    };
    inferred.rules[reassertRule.id] = {
      provider: "arcane-runtime",
      adapter: "native-summon-control-v1",
      ...controlContract,
    };
    inferred.identity[reassertRule.id] =
      "workflowUuid + sourceActorUuid + orderedTargetUuids";
    inferred.dedupe[reassertRule.id] =
      "workflowUuid + sourceActorUuid + orderedTargetUuids";
    inferred.representations[reassertAction.id] = {
      activityFlags: { nativeSummonControlAction: controlContract },
    };
  }

  inferred.rules[currentRule.id] = {
    provider: "arcane-runtime",
    adapter: "native-summon",
    artifactId: entity.id,
  };
  inferred.identity[currentRule.id] = "castId";
  inferred.dedupe[currentRule.id] = "castId";
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalCastOriginStaticMarkerHints(graph, explicit = {}) {
  const inferred = {
    artifacts: {},
    rules: {},
    identity: {},
    dedupe: {},
    representations: {},
  };
  for (const marker of (graph.artifacts ?? []).filter(current =>
    current.kind === "marker" && current.state?.anchor === "cast-origin"
  )) {
    const sourceArtifactId = marker.lifecycle?.artifactId;
    const sourceArtifact = (graph.artifacts ?? []).find(current =>
      current.id === sourceArtifactId
    );
    if (
      !sourceArtifact
      || sourceArtifact.kind !== "effect"
      || sourceArtifact.identity?.scope !== "source"
    ) {
      throw new Error(
        `${graph.id} static marker ${marker.id} requires one source-scoped effect owner`,
      );
    }
    const creatorRules = (graph.rules ?? []).filter(current =>
      current.on?.type === "action-used"
      && (current.do ?? []).some(operationValue =>
        operationValue.type === "create-artifact"
        && operationValue.artifactId === marker.id
      )
    );
    if (creatorRules.length !== 1) {
      throw new Error(
        `${graph.id} static marker ${marker.id} requires exactly one cast creator rule`,
      );
    }
    const creator = creatorRules[0];
    if (explicit.rules?.[creator.id]) {
      throw new Error(
        `${graph.id} static marker lowering is compiler-owned and cannot be overridden`,
      );
    }
    const templateTargets = (creator.targets ?? []).filter(current =>
      current.origin?.type === "placed-template"
    );
    const creation = (creator.do ?? []).find(operationValue =>
      operationValue.type === "create-artifact"
      && operationValue.artifactId === marker.id
    );
    const sourceApplication = (creator.do ?? []).find(operationValue =>
      operationValue.type === "apply-artifact"
      && operationValue.artifactId === sourceArtifactId
      && operationValue.target === "source"
    );
    const target = templateTargets[0];
    const shape = target?.origin?.shape;
    const range = withinRange(target);
    if (
      templateTargets.length !== 1
      || creation?.target !== target?.id
      || !sourceApplication
      || shape?.type !== "radius"
      || Number(shape?.size) !== Number(marker.state?.shape?.size)
      || shape?.units !== marker.state?.shape?.units
      || range?.units !== "self"
    ) {
      throw new Error(
        `${graph.id} static marker ${marker.id} requires one matching self-centered `
        + "radius template and one source owner application",
      );
    }
    const contract = {
      version: 1,
      artifactId: marker.id,
      sourceArtifactId,
      shape: clone(marker.state.shape),
      color: marker.state.color ?? null,
      opacity: marker.state.opacity ?? null,
      stationary: true,
    };
    inferred.artifacts[marker.id] = {
      provider: "arcane-runtime",
      flags: { castOriginStaticMarker: contract },
    };
    inferred.rules[creator.id] = {
      provider: "arcane-runtime",
      adapter: "cast-origin-static-marker-v1",
      artifactId: marker.id,
      sourceArtifactId,
      activityFlags: { castOriginStaticMarker: contract },
    };
    inferred.representations[creator.on.actionId] = {
      activityFlags: { castOriginStaticMarker: contract },
    };
    inferred.identity[creator.id] = "workflowUuid + templateUuid";
    inferred.dedupe[creator.id] = "workflowUuid + templateUuid";
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalPlacedPointMoveTokenHints(graph, explicit = {}) {
  const inferred = {
    artifacts: {},
    rules: {},
    representations: {},
  };
  const roots = (graph.rules ?? []).filter(current =>
    current.on?.type === "action-used"
    && (current.do ?? []).some(operationValue =>
      operationValue.type === "move-token"
    )
  );
  const pending = roots.filter(current => !explicit.rules?.[current.id]);
  if (pending.length === 0) {
    return mergeInferredLoweringHints(inferred, explicit);
  }
  if (pending.length !== roots.length) {
    throw new Error(
      `${graph.id} placed-point token moves cannot mix explicit and inferred lowering`,
    );
  }

  const actions = new Map(
    (graph.actions ?? []).map(current => [current.id, current]),
  );
  for (const currentRule of pending) {
    const actionValue = actions.get(currentRule.on.actionId);
    const targets = currentRule.targets ?? [];
    const operations = currentRule.do ?? [];
    const consumes = operations.filter(current =>
      current.type === "consume-resource"
    );
    const moves = operations.filter(current => current.type === "move-token");
    if (
      !actionValue
      || actionValue.delivery !== "standalone"
      || actionValue.visibility !== "public"
      || (currentRule.when ?? []).length !== 0
      || targets.length !== 1
      || targets[0].result !== "point"
      || targets[0].origin?.type !== "placed-point"
      || targets[0].evaluation !== "snapshot"
      || targets[0].cardinality?.min !== 1
      || targets[0].cardinality?.max !== 1
      || consumes.length !== 1
      || consumes[0].resource !== "spell-slot"
      || consumes[0].timing !== "on-use"
      || moves.length !== 1
      || operations.length !== 2
      || moves[0].target !== "source"
      || moves[0].destination !== targets[0].id
      || moves[0].distance !== undefined
      || moves[0].units !== undefined
    ) {
      throw new Error(
        `${currentRule.id} placed-point token move requires one unconditional public standalone action, `
        + "one snapshot point target, one on-use spell-slot consumption, and one source move "
        + "without duplicated distance metadata",
      );
    }
    const rangePredicates = (targets[0].predicates ?? []).filter(current =>
      current.type === "within-range"
    );
    const kindPredicates = (targets[0].predicates ?? []).filter(current =>
      current.type === "target-kind"
    );
    const range = rangePredicates[0];
    if (
      rangePredicates.length !== 1
      || kindPredicates.length !== 1
      || kindPredicates[0].value !== "space"
      || (targets[0].predicates ?? []).length !== 2
      || range.from !== "source"
      || !Number.isFinite(Number(range.distance))
      || Number(range.distance) <= 0
      || range.units !== "ft"
    ) {
      throw new Error(
        `${currentRule.id} placed-point token move requires one finite source-relative `
        + "space range in feet",
      );
    }
    if (inferred.representations[currentRule.on.actionId]) {
      throw new Error(
        `${graph.id} defines multiple placed-point token moves for action `
        + currentRule.on.actionId,
      );
    }
    inferred.rules[currentRule.id] = {
      provider: "arcane-runtime",
      adapter: "placed-point-move-token-v1",
    };
    inferred.representations[currentRule.on.actionId] = {
      template: {
        type: "square",
        size: 5,
        units: range.units,
      },
      affects: {
        type: "space",
        count: 1,
      },
      activityFlags: {
        placedPointMoveDestination: true,
      },
    };
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function repeatSaveArtifactId(ruleValue) {
  const predicates = (ruleValue.when ?? []).filter(current =>
    current.type === "artifact-exists"
    && current.subject === "effect-target"
  );
  if (predicates.length === 0) return null;
  if (predicates.length > 1) {
    throw new Error(
      `${ruleValue.id} repeat save requires exactly one effect-target artifact-exists predicate`,
    );
  }
  return predicates[0].artifactId;
}

function repeatSaveSuccessRule(graph, saveOperation, artifactId) {
  const candidates = (graph.rules ?? []).filter(current =>
    current.on?.type === "operation-outcome"
    && current.on.operationId === saveOperation.id
    && current.on.outcome === "success"
  );
  if (candidates.length !== 1) {
    throw new Error(
      `${saveOperation.id} repeat save requires exactly one success outcome rule`,
    );
  }
  const deletes = (candidates[0].do ?? []).filter(current =>
    current.type === "delete-artifact"
  );
  if (
    deletes.length !== 1
    || deletes[0].artifactId !== artifactId
  ) {
    throw new Error(
      `${candidates[0].id} must delete repeat-save artifact ${artifactId}`,
    );
  }
  return candidates[0];
}

function lowerCamelIdentifier(value) {
  const parts = slug(value).split("-").filter(Boolean);
  return parts.map((part, index) =>
    index === 0 ? part : part[0].toUpperCase() + part.slice(1)
  ).join("");
}

function repeatRuleArtifactId(ruleValue) {
  return (ruleValue.when ?? []).find(current =>
    current.type === "artifact-exists"
    && current.subject === "effect-target"
  )?.artifactId ?? null;
}

function repeatSaveActivityIdentifier(graph, artifactId, triggerType) {
  const repeatArtifactIds = new Set(
    (graph.rules ?? [])
      .filter(current =>
        ["turn-start", "turn-end", "damage-taken"].includes(current.on?.type)
        && (current.do ?? []).some(operationValue =>
          operationValue.type === "saving-throw"
        )
      )
      .map(repeatRuleArtifactId)
      .filter(Boolean),
  );
  const stem = lowerCamelIdentifier(
    repeatArtifactIds.size > 1 ? artifactId : graph.id,
  );
  const suffix = triggerType === "turn-start"
    ? "StartSave"
    : triggerType === "turn-end"
      ? "EndSave"
      : "DamageSave";
  return `${stem}${suffix}`;
}

function reusableTurnSaveIdentifier(graph, currentRule, artifactId, saveOperation) {
  const turnRule = (graph.rules ?? []).find(candidate =>
    ["turn-start", "turn-end"].includes(candidate.on?.type)
    && repeatRuleArtifactId(candidate) === artifactId
    && (candidate.do ?? []).some(operationValue =>
      operationValue.type === "saving-throw"
      && operationValue.ability?.[0] === saveOperation.ability?.[0]
    )
  );
  return turnRule
    ? repeatSaveActivityIdentifier(graph, artifactId, turnRule.on.type)
    : null;
}

function canonicalZonePulseRule(ruleValue, {
  triggerType,
  membershipId,
  turnSubject = "zone-member",
  branchArtifactId = null,
  failureArtifactId = null,
  allowFailureOnlyDamage = false,
  receiptIdentities = [
    "zoneInstanceId + targetUuid + turn",
    "zoneInstanceId + targetUuid + turn + phase",
  ],
  graph = null,
} = {}) {
  if (ruleValue.on?.type !== triggerType) return null;
  if (
    ["turn-start", "turn-end"].includes(triggerType)
    && ruleValue.on?.subject !== turnSubject
  ) {
    return null;
  }
  const targets = ruleValue.targets ?? [];
  if (
    targets.length !== 1
    || targets[0].origin?.type !== "event-binding"
    || targets[0].origin?.name !== "target"
    || targets[0].evaluation !== "snapshot"
    || targets[0].cardinality?.min !== 1
    || targets[0].cardinality?.max !== 1
  ) {
    return null;
  }
  const oncePerTurn = (ruleValue.when ?? []).filter(current =>
    current.type === "once-per-turn"
  );
  const artifactGuards = (ruleValue.when ?? []).filter(current =>
    current.type === "artifact-exists"
  );
  const expectedArtifactGuards = [
    ...(["turn-start", "turn-end"].includes(triggerType)
      ? [{ artifactId: membershipId, subject: "effect-target" }]
      : []),
    ...(branchArtifactId
      ? [{ artifactId: branchArtifactId, subject: "effect-target" }]
      : []),
  ].sort((left, right) => left.artifactId.localeCompare(right.artifactId));
  const actualArtifactGuards = artifactGuards.map(current => ({
    artifactId: current.artifactId,
    subject: current.subject,
  })).sort((left, right) => left.artifactId.localeCompare(right.artifactId));
  const expectedPredicateCount = 1 + expectedArtifactGuards.length;
  if (
    oncePerTurn.length !== 1
    || !receiptIdentities.includes(oncePerTurn[0].identity)
    || (ruleValue.when ?? []).length !== expectedPredicateCount
    || stableStringify(actualArtifactGuards)
      !== stableStringify(expectedArtifactGuards)
  ) {
    return null;
  }
  const operations = ruleValue.do ?? [];
  const saves = operations.filter(current => current.type === "saving-throw");
  const damages = operations.filter(current => current.type === "damage");
  const save = saves[0] ?? null;
  const damage = damages[0] ?? null;
  const saveOnly = (
    operations.length === 1
    && saves.length === 1
    && damages.length === 0
    && save.target === targets[0].id
    && save.ability?.length === 1
    && save.onSave === "none"
  );
  const damageOnly = (
    operations.length === 1
    && saves.length === 0
    && damages.length === 1
    && damage.target === targets[0].id
    && [undefined, "none"].includes(damage.onSave)
    && damage.damageTypes?.length === 1
  );
  const saveAndDamage = (
    operations.length === 2
    && saves.length === 1
    && damages.length === 1
    && save.target === targets[0].id
    && damage.target === targets[0].id
    && save.ability?.length === 1
    && (
      (save.onSave === "half" && damage.onSave === "half")
      || (
        allowFailureOnlyDamage
        && save.onSave === "none"
        && [undefined, "none"].includes(damage.onSave)
      )
    )
    && damage.damageTypes?.length === 1
  );
  if (!saveOnly && !damageOnly && !saveAndDamage) return null;

  const outcomeOperations = [];
  if (graph && save) {
    const outcomeRules = (graph.rules ?? []).filter(current =>
      current.on?.type === "operation-outcome"
      && current.on.operationId === save.id
    );
    for (const outcomeRule of outcomeRules) {
      if (
        outcomeRule.on.outcome !== "failure"
        || (outcomeRule.when ?? []).length !== 0
        || (outcomeRule.targets ?? []).length !== 1
        || outcomeRule.targets[0]?.origin?.type !== "event-binding"
        || outcomeRule.targets[0]?.origin?.name !== "target"
        || outcomeRule.targets[0]?.evaluation !== "snapshot"
        || outcomeRule.targets[0]?.cardinality?.min !== 1
        || outcomeRule.targets[0]?.cardinality?.max !== 1
        || (outcomeRule.do ?? []).length === 0
      ) {
        return null;
      }
      const failureOperations = outcomeRule.do ?? [];
      if (!failureOperations.every(current =>
        current.type === "apply-artifact"
        && current.target === outcomeRule.targets[0].id
      )) {
        return null;
      }
      for (const current of outcomeRule.do ?? []) {
        outcomeOperations.push({
          ...Object.fromEntries(
            Object.entries(clone(current))
              .filter(([key]) => !["id", "target"].includes(key)),
          ),
          conditionalOutcome: "failure",
        });
      }
    }
    if (failureArtifactId) {
      const outcomeRules = (graph.rules ?? []).filter(current =>
        current.on?.type === "operation-outcome"
        && current.on.operationId === save.id
      );
      if (
        outcomeRules.length !== 1
        || outcomeRules[0].on.outcome !== "failure"
        || (outcomeRules[0].do ?? []).length !== 1
        || outcomeRules[0].do[0].type !== "apply-artifact"
        || outcomeRules[0].do[0].artifactId !== failureArtifactId
      ) return null;
    }
  }
  const rootOperations = operations.map(current =>
    Object.fromEntries(
      Object.entries(clone(current))
        .filter(([key]) => !["id", "target"].includes(key)),
    )
  );
  return {
    oncePerTurn: oncePerTurn[0],
    save,
    damage,
    outcomeRuleIds: (graph && save)
      ? (graph.rules ?? []).filter(current =>
          current.on?.type === "operation-outcome"
          && current.on.operationId === save.id
        ).map(current => current.id).sort()
      : [],
    includeNativeOutcomeOperations: outcomeOperations.length > 0,
    mechanics: {
      operations: [...rootOperations, ...outcomeOperations],
    },
  };
}

function canonicalZoneLeaveCleanupRule(ruleValue, zoneId, graph) {
  if (ruleValue.on?.type !== "leave" || ruleValue.on.zoneId !== zoneId) {
    return null;
  }
  const targets = ruleValue.targets ?? [];
  const guards = (ruleValue.when ?? []).filter(current =>
    current.type === "artifact-exists"
    && current.subject === "effect-target"
  );
  const operations = ruleValue.do ?? [];
  const artifactId = operations[0]?.artifactId;
  const affectedArtifact = (graph?.artifacts ?? []).find(current =>
    current.id === artifactId
  );
  const sourceTargetIdentity = affectedArtifact?.identity;
  if (
    targets.length !== 1
    || targets[0].origin?.type !== "event-binding"
    || targets[0].origin?.name !== "target"
    || targets[0].evaluation !== "snapshot"
    || targets[0].cardinality?.min !== 1
    || targets[0].cardinality?.max !== 1
    || guards.length !== 1
    || (ruleValue.when ?? []).length !== 1
    || operations.length !== 1
    || operations[0].type !== "delete-artifact"
    || operations[0].target !== targets[0].id
    || operations[0].artifactId !== guards[0].artifactId
    || affectedArtifact?.kind !== "effect"
    || affectedArtifact?.role !== "mechanical"
    || affectedArtifact?.host !== "actor"
    || sourceTargetIdentity?.scope !== "source-target"
    || stableStringify(sourceTargetIdentity?.keys)
      !== stableStringify(["sourceUuid", "targetUuid"])
    || !lifecycleDependencies(affectedArtifact?.lifecycle)
      .includes("concentration")
  ) return null;
  return { artifactId };
}

function zonePulseDamageSignature(operationValue) {
  if (operationValue?.type !== "damage") return null;
  return stableStringify(Object.fromEntries(
    Object.entries(clone(operationValue)).filter(([key]) =>
      !["id", "target", "conditionalOutcome"].includes(key)
    ),
  ));
}

function conditionalZoneBranchArtifactIds(graph, zoneId, membershipId) {
  const values = new Set();
  for (const current of graph.rules ?? []) {
    if (
      !["enter", "turn-start", "turn-end"].includes(current.on?.type)
      || (current.on.type === "enter" && current.on.zoneId !== zoneId)
      || (["turn-start", "turn-end"].includes(current.on.type)
        && current.on.subject !== "zone-member")
    ) continue;
    const guards = (current.when ?? []).filter(predicateValue =>
      predicateValue.type === "artifact-exists"
      && predicateValue.subject === "effect-target"
      && predicateValue.artifactId !== membershipId
    );
    if (guards.length === 1) values.add(guards[0].artifactId);
  }
  return [...values];
}

function canonicalConditionalZoneArtifactBranch(
  graph,
  zone,
  membership,
) {
  const candidateArtifactIds = conditionalZoneBranchArtifactIds(
    graph,
    zone.id,
    membership.id,
  );
  if (candidateArtifactIds.length === 0) return null;
  const matches = [];
  for (const artifactId of candidateArtifactIds) {
    const branchArtifact = (graph.artifacts ?? []).find(current =>
      current.id === artifactId
    );
    const identity = branchArtifact?.identity;
    if (
      branchArtifact?.kind !== "effect"
      || branchArtifact?.role !== "mechanical"
      || branchArtifact?.host !== "actor"
      || branchArtifact?.reapply !== "replace"
      || identity?.scope !== "source-target"
      || stableStringify(identity?.keys)
        !== stableStringify(["sourceUuid", "targetUuid"])
      || !lifecycleDependencies(branchArtifact.lifecycle)
        .includes("concentration")
    ) continue;

    const phaseMatches = {};
    for (const phase of ["entry", "turn-start", "turn-end"]) {
      const triggerType = phase === "entry" ? "enter" : phase;
      const phaseRules = (graph.rules ?? []).filter(current =>
        current.on?.type === triggerType
        && (triggerType !== "enter" || current.on.zoneId === zone.id)
      );
      const absent = phaseRules.map(ruleValue => ({
        rule: ruleValue,
        contract: canonicalZonePulseRule(ruleValue, {
          triggerType,
          membershipId: membership.id,
          failureArtifactId: artifactId,
          allowFailureOnlyDamage: true,
          receiptIdentities: ["zoneInstanceId + targetUuid + turn"],
          graph,
        }),
      })).filter(value =>
        value.contract?.save
        && value.contract.damage
      );
      const present = phaseRules.map(ruleValue => ({
        rule: ruleValue,
        contract: canonicalZonePulseRule(ruleValue, {
          triggerType,
          membershipId: membership.id,
          branchArtifactId: artifactId,
          receiptIdentities: ["zoneInstanceId + targetUuid + turn"],
          graph,
        }),
      })).filter(value =>
        value.contract?.damage
        && !value.contract.save
      );
      if (absent.length > 1 || present.length > 1) {
        throw new Error(
          `${graph.id} zone ${zone.id} conditional artifact branch ${artifactId} `
          + `permits exactly one ${phase} rule per branch`,
        );
      }
      if ((absent.length === 1) !== (present.length === 1)) {
        throw new Error(
          `${graph.id} zone ${zone.id} conditional artifact branch ${artifactId} `
          + `${phase} must declare both artifact-present damage and artifact-absent save rules`,
        );
      }
      if (absent.length === 1) {
        phaseMatches[phase] = {
          absent: absent[0],
          present: present[0],
        };
      }
    }
    const turnPhases = ["turn-start", "turn-end"].filter(phase =>
      phaseMatches[phase]
    );
    if (
      turnPhases.length !== 1
      || turnPhases[0] !== "turn-start"
      || !phaseMatches.entry
    ) continue;
    const turnPhase = "turn-start";
    const canonicalPairs = [
      phaseMatches[turnPhase],
      ...(phaseMatches.entry ? [phaseMatches.entry] : []),
    ];
    const receiptIdentities = new Set(canonicalPairs.flatMap(pair => [
      pair.absent.contract.oncePerTurn.identity,
      pair.present.contract.oncePerTurn.identity,
    ]));
    if (
      receiptIdentities.size !== 1
      || !receiptIdentities.has("zoneInstanceId + targetUuid + turn")
    ) continue;
    const turnPair = phaseMatches[turnPhase];
    const mechanicsMatch = canonicalPairs.every(pair =>
      stableStringify(pair.absent.contract.mechanics)
        === stableStringify(turnPair.absent.contract.mechanics)
      && stableStringify(pair.present.contract.mechanics)
        === stableStringify(turnPair.present.contract.mechanics)
    );
    const damageMatch = canonicalPairs.every(pair =>
      zonePulseDamageSignature(pair.present.contract.damage)
        === zonePulseDamageSignature(pair.absent.contract.damage)
    );
    if (!mechanicsMatch || !damageMatch) continue;
    matches.push({
      artifactId,
      branchArtifact,
      turnPhase,
      phases: phaseMatches,
    });
  }
  if (matches.length !== 1) {
    throw new Error(
      `${graph.id} zone ${zone.id} conditional artifact pulse must close exactly `
      + `one source-target artifact branch; received ${matches.length}`,
    );
  }
  return matches[0];
}

function inferCanonicalZonePulseHints(graph, explicit = {}, {
  contract,
} = {}) {
  const inferred = {
    artifacts: {},
    rules: {},
    identity: {},
    dedupe: {},
  };
  const zones = (graph.artifacts ?? []).filter(current => current.kind === "zone");
  for (const zone of zones) {
    const memberships = (graph.artifacts ?? []).filter(current =>
      current.kind === "effect"
      && current.role === "mechanical"
      && current.lifecycle?.type === "while-artifact"
      && current.lifecycle.artifactId === zone.id
    );
    if (memberships.length !== 1) continue;
    const membership = memberships[0];
    const conditionalBranch = canonicalConditionalZoneArtifactBranch(
      graph,
      zone,
      membership,
    );
    if (conditionalBranch) {
      const stem = lowerCamelIdentifier(zones.length > 1 ? zone.id : graph.id);
      const baseActivityIdentifier = `${stem}UnmarkedZonePulse`;
      const branchActivityIdentifier = `${stem}MarkedZonePulse`;
      const phasePair = phase => conditionalBranch.phases[phase] ?? null;
      const baseRuleIds = {
        entryRuleId: phasePair("entry")?.absent.rule.id ?? null,
        turnStartRuleId: phasePair("turn-start")?.absent.rule.id ?? null,
        turnEndRuleId: phasePair("turn-end")?.absent.rule.id ?? null,
      };
      const branchRuleIds = {
        entryRuleId: phasePair("entry")?.present.rule.id ?? null,
        turnStartRuleId: phasePair("turn-start")?.present.rule.id ?? null,
      };
      const runtimeContract = {
        version: 1,
        zoneArtifactId: zone.id,
        membershipArtifactId: membership.id,
        ...baseRuleIds,
        activityIdentifier: baseActivityIdentifier,
        dedupe: "zone-instance-target-turn",
        refreshMembershipOnTemplateMove:
          zone.state?.anchor === "movable-template",
        leaveCleanupArtifactIds: [],
        artifactExistsBranch: {
          artifactId: conditionalBranch.artifactId,
          ...branchRuleIds,
          activityIdentifier: branchActivityIdentifier,
        },
      };
      inferred.artifacts[zone.id] = mergeArtifactLoweringHint(
        inferred.artifacts[zone.id],
        { flags: { zoneEventActivity: runtimeContract } },
      );

      const registerPulseRules = (branchName, activityIdentifier) => {
        const pairKey = branchName === "absent" ? "absent" : "present";
        for (const phase of ["entry", "turn-start", "turn-end"]) {
          const pair = phasePair(phase);
          if (!pair) continue;
          const pulse = pair[pairKey];
          inferred.rules[pulse.rule.id] = phase === "entry"
            ? {
                provider: "arcane-runtime",
                adapter: "zone-event-activity-v1",
                phase,
                usesActivityIdentifier: activityIdentifier,
              }
            : {
                provider: "arcane-runtime",
                adapter: "zone-event-activity-v1",
                phase,
                activityIdentifier,
                activityName: `${graph.id}: ${branchName} zone pulse`,
                ...(pulse.contract.includeNativeOutcomeOperations
                  ? { includeNativeOutcomeOperations: true }
                  : {}),
                ...(phasePair("entry")?.[pairKey].contract.outcomeRuleIds?.length
                  ? {
                      representedRuleIds: [
                        ...phasePair("entry")[pairKey].contract.outcomeRuleIds,
                      ],
                    }
                  : {}),
              };
          inferred.dedupe[pulse.rule.id] =
            "zoneInstanceId + targetUuid + combatRound + combatTurn";
          for (const outcomeRuleId of pulse.contract.outcomeRuleIds ?? []) {
            inferred.rules[outcomeRuleId] = {
              provider: "dnd5e-midi-native",
            };
          }
        }
      };
      registerPulseRules("absent", baseActivityIdentifier);
      registerPulseRules("present", branchActivityIdentifier);
      continue;
    }
    const entries = (graph.rules ?? []).filter(current =>
      current.on?.type === "enter"
      && current.on.zoneId === zone.id
      && canonicalZonePulseRule(current, {
        triggerType: "enter",
        membershipId: membership.id,
        graph,
      })
    );
    const turnStartCandidates = (graph.rules ?? []).filter(current =>
      canonicalZonePulseRule(current, {
        triggerType: "turn-start",
        membershipId: membership.id,
        graph,
      })
    );
    const turnEndCandidates = (graph.rules ?? []).filter(current =>
      canonicalZonePulseRule(current, {
        triggerType: "turn-end",
        membershipId: membership.id,
        graph,
      })
    );
    if (
      entries.length === 0
      && turnStartCandidates.length === 0
      && turnEndCandidates.length === 0
    ) continue;
    if (entries.length > 1) {
      throw new Error(
        `${graph.id} zone ${zone.id} permits at most one canonical entry pulse; `
        + `received ${entries.length}`,
      );
    }
    if (turnStartCandidates.length > 1 || turnEndCandidates.length > 1) {
      throw new Error(
        `${graph.id} zone ${zone.id} permits at most one canonical zone-member `
        + `turn pulse per phase; received turn-start ${turnStartCandidates.length}, `
        + `turn-end ${turnEndCandidates.length}`,
      );
    }
    if (turnStartCandidates.length + turnEndCandidates.length === 0) {
      throw new Error(
        `${graph.id} zone ${zone.id} requires at least one canonical `
        + "zone-member turn-start or turn-end pulse",
      );
    }
    const turnPulses = [
      ...turnStartCandidates.map(rule => ({ rule, phase: "turn-start" })),
      ...turnEndCandidates.map(rule => ({ rule, phase: "turn-end" })),
    ];
    const dualPhase = turnPulses.length === 2;
    const zoneLifetime = contract?.lifetime;
    const resolvableZoneInstances = zoneLifetime?.concentration === true
      || (
        zoneLifetime?.concentration === false
        && zoneLifetime?.duration?.type === "duration"
      );
    if (!resolvableZoneInstances) {
      throw new Error(
        `${graph.id} canonical zone event activity requires a concentration `
        + "SpellContract or a non-concentration duration lifetime so zone "
        + "instances resolve unambiguously",
      );
    }
    const entry = entries[0] ?? null;
    if (dualPhase && entry) {
      throw new Error(
        `${graph.id} zone ${zone.id} dual-phase turn pulses do not yet support `
        + "a canonical entry pulse",
      );
    }
    const turnContracts = turnPulses.map(({ rule, phase }) => ({
      rule,
      phase,
      contract: canonicalZonePulseRule(rule, {
        triggerType: phase,
        membershipId: membership.id,
        graph,
      }),
    }));
    const turnPulse = turnContracts[0].rule;
    const turnPhase = turnContracts[0].phase;
    const turnContract = turnContracts[0].contract;
    const entryContract = entry
      ? canonicalZonePulseRule(entry, {
          triggerType: "enter",
          membershipId: membership.id,
          graph,
        })
      : null;
    if (
      entryContract
      && entryContract.oncePerTurn.identity !== turnContract.oncePerTurn.identity
    ) {
      throw new Error(
        `${entry.id} canonical zone entry pulse must use the same receipt identity as `
        + `${turnPulse.id}`,
      );
    }
    if (
      entryContract
      && stableStringify(entryContract.mechanics)
        !== stableStringify(turnContract.mechanics)
    ) {
      throw new Error(
        `${entry.id} canonical zone entry pulse must match `
        + `${turnPulse.id} ${turnPhase} mechanics`,
      );
    }
    if (dualPhase) {
      // Two turn pulses with (potentially) different mechanics must never share
      // one receipt; each phase settles independently.
      for (const { rule, contract: pulseContract } of turnContracts) {
        if (!pulseContract.oncePerTurn.identity.endsWith(" + phase")) {
          throw new Error(
            `${rule.id} dual-phase zone pulses must keep receipts phase-separated `
            + "(once-per-turn identity must end with \" + phase\")",
          );
        }
      }
    }
    const leaveEntries = (graph.rules ?? []).map(current => ({
      rule: current,
      contract: canonicalZoneLeaveCleanupRule(current, zone.id, graph),
    })).filter(current => current.contract);
    if (leaveEntries.length > 1) {
      throw new Error(
        `${graph.id} zone ${zone.id} permits at most one canonical leave cleanup`,
      );
    }
    const phaseRules = [
      entry,
      ...turnPulses.map(value => value.rule),
      ...leaveEntries.map(value => value.rule),
    ].filter(Boolean);
    const explicitRules = phaseRules.map(value => value.id).filter(ruleId =>
      explicit.rules?.[ruleId]
    );
    if (explicitRules.length > 0) {
      if (explicitRules.length !== phaseRules.length) {
        throw new Error(
          `${graph.id} zone event rules must either all use inferred `
          + "zone pulse lowering or all declare it",
        );
      }
      continue;
    }
    const baseActivityIdentifier = `${lowerCamelIdentifier(
      zones.length > 1 ? zone.id : graph.id,
    )}ZonePulse`;
    // Dual-phase zones carry different mechanics per phase, so each phase gets
    // its own hidden pulse activity; single-phase zones keep the legacy
    // shared identifier byte-for-byte.
    const phaseActivityIdentifier = phase => dualPhase
      ? `${lowerCamelIdentifier(zones.length > 1 ? zone.id : graph.id)}${
          phase === "turn-start" ? "TurnStart" : "TurnEnd"
        }ZonePulse`
      : baseActivityIdentifier;
    const phaseActivityName = phase => dualPhase
      ? `${graph.id}: zone pulse (${phase === "turn-start" ? "turn start" : "turn end"})`
      : `${graph.id}: zone pulse`;
    const activityIdentifier = phaseActivityIdentifier("turn-start");
    const activityName = `${graph.id}: zone pulse`;
    const runtimeContract = {
      version: 1,
      zoneArtifactId: zone.id,
      membershipArtifactId: membership.id,
      entryRuleId: entry?.id ?? null,
      turnStartRuleId: turnStartCandidates[0]?.id ?? null,
      turnEndRuleId: turnEndCandidates[0]?.id ?? null,
      activityIdentifier,
      ...(dualPhase
        ? {
            turnStartActivityIdentifier: phaseActivityIdentifier("turn-start"),
            turnEndActivityIdentifier: phaseActivityIdentifier("turn-end"),
          }
        : {}),
      dedupe: turnContracts.some(value =>
          value.contract.oncePerTurn.identity.endsWith(" + phase")
        )
        ? "zone-instance-target-turn-phase"
        : "zone-instance-target-turn",
      refreshMembershipOnTemplateMove:
        zone.state?.anchor === "movable-template",
      leaveCleanupArtifactIds: leaveEntries.map(value => value.contract.artifactId),
      ...(zone.state?.concentrationDisruption
        ? {
            concentrationDisruption: {
              ability: String(zone.state.concentrationDisruption.ability),
              activityIdentifier: `${lowerCamelIdentifier(
                zones.length > 1 ? zone.id : graph.id,
              )}ConcentrationZonePulse`,
              phases: [
                entry ? "entry" : null,
                turnStartCandidates.length > 0 ? "turn-start" : null,
                turnEndCandidates.length > 0 ? "turn-end" : null,
              ].filter(Boolean),
            },
          }
        : {}),
    };
    inferred.artifacts[zone.id] = mergeArtifactLoweringHint(
      inferred.artifacts[zone.id],
      {
        flags: {
          zoneEventActivity: runtimeContract,
        },
      },
    );
    if (entry) {
      inferred.rules[entry.id] = {
        provider: "arcane-runtime",
        adapter: "zone-event-activity-v1",
        phase: "entry",
        usesActivityIdentifier: activityIdentifier,
      };
    }
    for (const { rule: pulseRule, phase: pulsePhase, contract: pulseContract } of turnContracts) {
      inferred.rules[pulseRule.id] = {
        provider: "arcane-runtime",
        adapter: "zone-event-activity-v1",
        phase: pulsePhase,
        activityIdentifier: phaseActivityIdentifier(pulsePhase),
        activityName: phaseActivityName(pulsePhase),
        ...(pulseContract.includeNativeOutcomeOperations
          ? { includeNativeOutcomeOperations: true }
          : {}),
        ...(entryContract?.outcomeRuleIds?.length
          ? { representedRuleIds: [...entryContract.outcomeRuleIds] }
          : {}),
      };
      inferred.dedupe[pulseRule.id] =
        "zoneInstanceId + targetUuid + combatRound + combatTurn";
    }
    if (entry) {
      inferred.dedupe[entry.id] =
        "zoneInstanceId + targetUuid + combatRound + combatTurn";
    }
    for (const leave of leaveEntries) {
      inferred.rules[leave.rule.id] = {
        provider: "arcane-runtime",
        adapter: "zone-event-activity-v1",
        phase: "leave-cleanup",
      };
      inferred.identity[leave.rule.id] =
        "zoneInstanceId + sourceUuid + targetUuid + artifactId";
      inferred.dedupe[leave.rule.id] =
        "zoneInstanceId + sourceUuid + targetUuid + artifactId";
    }
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalFollowingAuraPulseHints(graph, explicit = {}, {
  contract,
} = {}) {
  const inferred = {
    artifacts: {},
    rules: {},
    dedupe: {},
  };
  const followingAuras = (graph.artifacts ?? []).filter(current =>
    current.kind === "visual"
    && current.role === "presentation"
    && current.state?.membership === "dynamic"
    && current.lifecycle?.type === "while-artifact"
  );
  const claimedSources = new Set();
  for (const aura of followingAuras) {
    const sourceArtifactId = aura.lifecycle.artifactId;
    const sourceArtifact = (graph.artifacts ?? []).find(current =>
      current.id === sourceArtifactId
    );
    if (
      !sourceArtifact
      || sourceArtifact.kind !== "effect"
      || sourceArtifact.role !== "mechanical"
      || sourceArtifact.identity?.scope !== "source"
    ) {
      continue;
    }
    if (claimedSources.has(sourceArtifactId)) {
      throw new Error(
        `${graph.id} following aura source ${sourceArtifactId} cannot own more than one `
        + "following-aura presentation",
      );
    }
    claimedSources.add(sourceArtifactId);
    const entries = (graph.rules ?? []).filter(current =>
      current.on?.type === "enter"
      && current.on.zoneId === sourceArtifactId
      && canonicalZonePulseRule(current, {
        triggerType: "enter",
        membershipId: sourceArtifactId,
        receiptIdentities: ["auraInstanceId + targetUuid + turn"],
      })
    );
    if (entries.length === 0) continue;
    if (!lifecycleDependencies(sourceArtifact.lifecycle).includes("concentration")) {
      throw new Error(
        `${graph.id} canonical following-aura event activity requires source artifact `
        + `${sourceArtifactId} to use a while-spell-active lifecycle bound to concentration`,
      );
    }
    if (aura.state?.includeSelf !== false) {
      throw new Error(
        `${graph.id} canonical following-aura event activity currently requires `
        + `${aura.id}.state.includeSelf to be false`,
      );
    }
    if (entries.length !== 1) {
      throw new Error(
        `${graph.id} following aura ${aura.id} requires exactly one canonical entry pulse; `
        + `received ${entries.length}`,
      );
    }
    if (contract?.lifetime?.concentration !== true) {
      throw new Error(
        `${graph.id} canonical following-aura event activity currently requires a `
        + "concentration SpellContract so one source Item owns at most one live aura instance",
      );
    }
    const entry = entries[0];
    const entryContract = canonicalZonePulseRule(entry, {
      triggerType: "enter",
      membershipId: sourceArtifactId,
      receiptIdentities: ["auraInstanceId + targetUuid + turn"],
    });
    const turnCandidates = (graph.rules ?? []).filter(current => {
      const currentContract = canonicalZonePulseRule(current, {
        triggerType: "turn-start",
        membershipId: sourceArtifactId,
        turnSubject: "aura-member",
        receiptIdentities: ["auraInstanceId + targetUuid + turn"],
      });
      return currentContract
        && stableStringify(currentContract.mechanics)
          === stableStringify(entryContract.mechanics);
    });
    if (turnCandidates.length !== 1) {
      throw new Error(
        `${entry.id} canonical following-aura entry pulse requires exactly one matching `
        + `aura-member turn-start pulse; received ${turnCandidates.length}`,
      );
    }
    const turnStart = turnCandidates[0];
    const explicitRules = [entry.id, turnStart.id].filter(ruleId =>
      explicit.rules?.[ruleId]
    );
    if (explicitRules.length > 0) {
      if (explicitRules.length !== 2) {
        throw new Error(
          `${entry.id} and ${turnStart.id} must either both use inferred `
          + "following-aura pulse lowering or both declare it",
        );
      }
      continue;
    }
    const activityIdentifier = `${lowerCamelIdentifier(
      followingAuras.length > 1 ? aura.id : graph.id,
    )}AuraPulse`;
    const activityName = `${graph.id}: following aura pulse`;
    const runtimeContract = {
      version: 1,
      sourceArtifactId,
      presentationArtifactId: aura.id,
      entryRuleId: entry.id,
      turnStartRuleId: turnStart.id,
      activityIdentifier,
      dedupe: "aura-instance-target-turn",
    };
    inferred.artifacts[sourceArtifactId] = mergeArtifactLoweringHint(
      inferred.artifacts[sourceArtifactId],
      {
        flags: {
          followingAuraEventActivity: runtimeContract,
        },
      },
    );
    inferred.rules[entry.id] = {
      provider: "arcane-runtime",
      adapter: "following-aura-event-activity-v1",
      phase: "entry",
      usesActivityIdentifier: activityIdentifier,
    };
    inferred.rules[turnStart.id] = {
      provider: "arcane-runtime",
      adapter: "following-aura-event-activity-v1",
      phase: "turn-start",
      activityIdentifier,
      activityName,
    };
    inferred.dedupe[entry.id] =
      "auraInstanceId + targetUuid + combatRound + combatTurn";
    inferred.dedupe[turnStart.id] =
      "auraInstanceId + targetUuid + combatRound + combatTurn";
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalWorkflowOutcomeDamageHints(graph, explicit = {}) {
  const inferred = {
    rules: {},
    dedupe: {},
  };
  for (const currentRule of graph.rules ?? []) {
    if (
      explicit.rules?.[currentRule.id]
      || currentRule.on?.type !== "operation-outcome"
      || String(currentRule.on?.operationId ?? "").startsWith("external:")
    ) {
      continue;
    }
    const operations = currentRule.do ?? [];
    if (
      operations.length === 0
      || !operations.every(current => current.type === "damage")
    ) {
      continue;
    }
    const sourceOperation = graphOperation(graph, currentRule.on.operationId);
    const sourceRule = graphRuleForOperation(
      graph,
      currentRule.on.operationId,
    );
    const sourceRuleHint = sourceRule
      ? explicit.rules?.[sourceRule.id]
      : null;
    const sourceActivityIdentifier = sourceRuleHint?.activityIdentifier
      ?? sourceRuleHint?.usesActivityIdentifier
      ?? null;
    const validOutcome = (
      sourceOperation?.type === "attack-roll"
      && ["hit", "miss"].includes(currentRule.on.outcome)
    ) || (
      sourceOperation?.type === "saving-throw"
      && ["success", "failure"].includes(currentRule.on.outcome)
    );
    if (!validOutcome) {
      throw new Error(
        `${currentRule.id} workflow-outcome damage requires a matching attack hit/miss `
        + "or saving-throw success/failure trigger",
      );
    }
    if ((currentRule.when ?? []).length > 0) {
      throw new Error(
        `${currentRule.id} workflow-outcome damage cannot declare predicates because `
        + "workflow-outcome-operations-v1 does not evaluate them",
      );
    }
    const target = oneEventBoundTarget(
      currentRule,
      "workflow-outcome damage",
    );
    if (
      operations.some(current =>
        current.target !== target.id
        || !String(current.formula ?? "").trim()
        || (current.damageTypes ?? []).length !== 1
      )
    ) {
      throw new Error(
        `${currentRule.id} workflow-outcome damage requires single-type damage `
        + `operations bound to ${target.id}`,
      );
    }
    inferred.rules[currentRule.id] = {
      provider: "arcane-runtime",
      adapter: "workflow-outcome-operations-v1",
      ...(sourceActivityIdentifier
        ? { usesActivityIdentifier: sourceActivityIdentifier }
        : {}),
    };
    inferred.dedupe[currentRule.id] =
      "workflowUuid + ruleId + targetUuid";
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalWorkflowOutcomeActivityHints(
  graph,
  explicit = {},
) {
  const inferred = {
    rules: {},
    dedupe: {},
  };
  for (const currentRule of graph.rules ?? []) {
    if (
      explicit.rules?.[currentRule.id]
      || currentRule.on?.type !== "operation-outcome"
      || String(currentRule.on?.operationId ?? "").startsWith("external:")
    ) {
      continue;
    }
    const sourceOperation = graphOperation(
      graph,
      currentRule.on.operationId,
    );
    const operations = currentRule.do ?? [];
    const targets = currentRule.targets ?? [];
    const target = targets[0];
    const selectionDrivenDamage = (
      sourceOperation?.type === "attack-roll"
      && currentRule.on.outcome === "hit"
      && (currentRule.when ?? []).some(current =>
        current.type === "input-selection-equals"
      )
      && targets.length === 1
      && target?.origin?.type === "event-binding"
      && target?.origin?.name === "target"
      && operations.length > 0
      && operations.every(current =>
        current.type === "damage"
        && current.target === target.id
        && current.rollIntegration === "parent-damage-roll"
        && current.critical === "midi-qol"
        && String(current.formula ?? "").trim()
        && (current.damageTypes ?? []).length === 1
      )
    );
    const hitTriggeredSave = (
      sourceOperation?.type === "attack-roll"
      && currentRule.on.outcome === "hit"
      && (currentRule.when ?? []).length === 0
      && targets.length === 1
      && target?.origin?.type === "event-binding"
      && target?.origin?.name === "target"
      && operations.length === 1
      && operations[0].type === "saving-throw"
      && operations[0].target === target.id
      && Array.isArray(operations[0].ability)
      && operations[0].ability.length > 0
      && operations[0].onSave === "none"
    );
    if (!selectionDrivenDamage && !hitTriggeredSave) continue;
    if (
      selectionDrivenDamage
      && operations.some(current => current.type !== "damage")
    ) {
      throw new Error(
        `${currentRule.id} selection-driven workflow outcome must be ` +
        "a hit-bound Midi damage activity on one event target",
      );
    }
    const activityIdentifier =
      `${lowerCamelIdentifier(currentRule.id)}Outcome`;
    inferred.rules[currentRule.id] = {
      provider: "arcane-runtime",
      adapter: "workflow-outcome-activity-v1",
      activityIdentifier,
      activityName: `${graph.id}: ${currentRule.id}`,
      activityType: hitTriggeredSave ? "save" : "damage",
      includeNativeOutcomeOperations: hitTriggeredSave,
    };
    inferred.dedupe[currentRule.id] =
      "workflowUuid + ruleId + targetUuid";
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalSourceArmedAttackTransformHints(
  graph,
  explicit = {},
) {
  const inferred = {
    artifacts: {},
    rules: {},
    dedupe: {},
  };
  const roots = (graph.rules ?? []).filter(current =>
    current.on?.type === "operation-outcome"
    && current.on.operationId === "external:source-ranged-weapon-attack"
    && ["hit", "miss"].includes(current.on.outcome)
  );
  const pending = roots.filter(current => !explicit.rules?.[current.id]);
  if (pending.length === 0) {
    return mergeInferredLoweringHints(inferred, explicit);
  }
  if (
    roots.length !== 2
    || pending.length !== 2
    || new Set(roots.map(current => current.on.outcome)).size !== 2
  ) {
    throw new Error(
      `${graph.id} source-armed attack transform requires one hit and one miss rule`,
    );
  }

  const phases = {};
  let artifactId = null;
  for (const rootRule of roots) {
    const attack = onePredicate(rootRule, "attack-kind");
    const ready = onePredicate(rootRule, "artifact-exists");
    if (
      (rootRule.when ?? []).length !== 2
      || attack.value !== "ranged-weapon"
      || ready.subject !== "source"
    ) {
      throw new Error(
        `${rootRule.id} source-armed transform requires ranged-weapon and source artifact guards`,
      );
    }
    artifactId ??= ready.artifactId;
    if (artifactId !== ready.artifactId) {
      throw new Error(
        `${graph.id} source-armed transform phases must share one ready artifact`,
      );
    }
    const targets = rootRule.targets ?? [];
    const target = targets[0];
    if (
      targets.length !== 1
      || target?.origin?.type !== "event-binding"
      || target.origin.name !== "target"
      || target.cardinality?.min !== 1
      || target.cardinality?.max !== 1
    ) {
      throw new Error(
        `${rootRule.id} source-armed transform requires one event-bound attack target`,
      );
    }
    const damage = (rootRule.do ?? []).filter(current =>
      current.type === "damage"
    );
    const deletes = (rootRule.do ?? []).filter(current =>
      current.type === "delete-artifact"
    );
    if (
      damage.length !== 1
      || deletes.length !== 1
      || (rootRule.do ?? []).length !== 2
      || damage[0].target !== target.id
      || deletes[0].artifactId !== artifactId
      || deletes[0].target !== "source"
      || (damage[0].damageTypes ?? []).length !== 1
    ) {
      throw new Error(
        `${rootRule.id} source-armed transform requires one damage and one ready deletion`,
      );
    }
    if (
      rootRule.on.outcome === "hit"
      && (
        damage[0].replacement !== "triggering-weapon-base-damage"
        || damage[0].rollIntegration !== "parent-damage-roll"
        || damage[0].critical !== "midi-qol"
        || damage[0].multiplier !== undefined
      )
    ) {
      throw new Error(
        `${rootRule.id} hit phase must replace the triggering weapon base damage`,
      );
    }
    if (
      rootRule.on.outcome === "miss"
      && (
        Number(damage[0].multiplier) !== 0.5
        || damage[0].rounding !== "down"
        || damage[0].rollIntegration !== undefined
      )
    ) {
      throw new Error(
        `${rootRule.id} miss phase must deal one rounded-down half-damage operation`,
      );
    }
    const splashRules = (graph.rules ?? []).filter(current =>
      current.on?.type === "operation-complete"
      && current.on.operationId === damage[0].id
    );
    if (splashRules.length !== 1) {
      throw new Error(
        `${rootRule.id} source-armed transform requires one post-damage neighborhood rule`,
      );
    }
    const splashRule = splashRules[0];
    const splashTarget = splashRule.targets?.[0];
    const saves = (splashRule.do ?? []).filter(current =>
      current.type === "saving-throw"
    );
    const splashDamage = (splashRule.do ?? []).filter(current =>
      current.type === "damage"
    );
    if (
      (splashRule.when ?? []).length !== 0
      || (splashRule.targets ?? []).length !== 1
      || splashTarget?.origin?.type !== "event-neighborhood"
      || splashTarget.origin.anchor !== "target"
      || typeof splashTarget.origin.includeAnchor !== "boolean"
      || splashTarget.origin.units !== "ft"
      || !(Number(splashTarget.origin.radius) > 0)
      || saves.length !== 1
      || splashDamage.length !== 1
      || (splashRule.do ?? []).length !== 2
      || saves[0].target !== splashTarget.id
      || splashDamage[0].target !== splashTarget.id
      || saves[0].onSave !== splashDamage[0].onSave
      || !["none", "half"].includes(saves[0].onSave)
    ) {
      throw new Error(
        `${splashRule.id} source-armed transform requires one matching neighborhood save and damage`,
      );
    }
    const activityIdentifier =
      `${lowerCamelIdentifier(splashRule.id)}Triggered`;
    phases[rootRule.on.outcome] = {
      rootRule,
      damage: operationProjection(damage[0]),
      splashRule,
      activityIdentifier,
    };
  }

  const readyArtifact = graphArtifact(graph, artifactId, graph.id);
  if (
    readyArtifact.kind !== "effect"
    || readyArtifact.host !== "actor"
    || readyArtifact.identity?.scope !== "source-target"
  ) {
    throw new Error(
      `${graph.id} source-armed transform requires one source-target ready effect`,
    );
  }
  const castRules = (graph.rules ?? []).filter(current =>
    current.on?.type === "action-used"
    && (current.do ?? []).some(operationValue =>
      operationValue.type === "apply-artifact"
      && operationValue.artifactId === artifactId
    )
  );
  if (castRules.length !== 1) {
    throw new Error(
      `${graph.id} source-armed transform requires one cast rule applying its ready effect`,
    );
  }
  const castRule = castRules[0];
  const consumes = (castRule.do ?? []).filter(current =>
    current.type === "consume-resource"
    && current.resource === "spell-slot"
    && current.timing === "on-use"
  );
  if (consumes.length !== 1) {
    throw new Error(
      `${castRule.id} source-armed transform must consume one spell slot on cast`,
    );
  }

  const contract = {
    version: 1,
    artifactId,
    attackType: "ranged-weapon",
    hit: {
      runtimeRuleId: phases.hit.rootRule.id,
      damage: phases.hit.damage,
      activityIdentifier: phases.hit.activityIdentifier,
    },
    miss: {
      runtimeRuleId: phases.miss.rootRule.id,
      damage: phases.miss.damage,
      activityIdentifier: phases.miss.activityIdentifier,
    },
  };
  inferred.artifacts[artifactId] = {
    provider: "native-active-effect",
    flags: { sourceArmedAttackTransform: contract },
  };
  inferred.rules[castRule.id] = {
    provider: "arcane-runtime",
    adapter: "source-armed-attack-transform-v1",
    phase: "arm",
    artifactId,
  };
  for (const outcome of ["hit", "miss"]) {
    const phase = phases[outcome];
    inferred.rules[phase.rootRule.id] = {
      provider: "arcane-runtime",
      adapter: "source-armed-attack-transform-v1",
      phase: outcome,
      artifactId,
    };
    inferred.rules[phase.splashRule.id] = {
      provider: "arcane-runtime",
      adapter: "source-armed-attack-transform-v1",
      phase: `${outcome}-activity`,
      artifactId,
      activityIdentifier: phase.activityIdentifier,
      activityName: `${graph.id}: ${phase.splashRule.id}`,
      activityType: "save",
      activityFlags: {
        triggeredEventActivity: {
          version: 1,
          inheritParentScaling: true,
          inheritParentSaveDc: true,
          includeAnchor:
            phase.splashRule.targets[0].origin.includeAnchor,
          radius: phase.splashRule.targets[0].origin.radius,
          units: phase.splashRule.targets[0].origin.units,
          kind:
            phase.splashRule.targets[0].targetKind
            ?? phase.splashRule.targets[0].kind
            ?? "creature",
          sourceOperationId: phase.splashRule.on.operationId,
        },
      },
    };
    inferred.dedupe[phase.rootRule.id] =
      "workflowUuid + sourceEffectUuid + outcome";
    inferred.dedupe[phase.splashRule.id] =
      "workflowUuid + ruleId + targetUuid";
  }
  inferred.dedupe[castRule.id] = "workflowUuid + sourceEffectUuid";
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalTriggeredEventActivityHints(
  graph,
  explicit = {},
) {
  const inferred = {
    rules: {},
    dedupe: {},
  };
  for (const currentRule of graph.rules ?? []) {
    if (
      explicit.rules?.[currentRule.id]
      || currentRule.on?.type !== "operation-complete"
      || String(currentRule.on?.operationId ?? "").startsWith("external:")
    ) {
      continue;
    }
    const sourceOperation = graphOperation(
      graph,
      currentRule.on.operationId,
    );
    const targets = currentRule.targets ?? [];
    const target = targets[0];
    const operations = currentRule.do ?? [];
    const saves = operations.filter(current =>
      current.type === "saving-throw"
    );
    const damages = operations.filter(current =>
      current.type === "damage"
    );
    const valid = (
      sourceOperation?.type === "attack-roll"
      && (currentRule.when ?? []).length === 0
      && targets.length === 1
      && target?.result === "tokens"
      && target?.origin?.type === "event-neighborhood"
      && target.origin.anchor === "target"
      && target.origin.includeAnchor === true
      && Number.isFinite(Number(target.origin.radius))
      && Number(target.origin.radius) > 0
      && target.origin.units === "ft"
      && saves.length === 1
      && damages.length === 1
      && operations.length === 2
      && operations.every(current =>
        current.target === target.id
      )
      && Array.isArray(saves[0].ability)
      && saves[0].ability.length > 0
      && saves[0].onSave === "none"
      && String(damages[0].formula ?? "").trim()
      && (damages[0].damageTypes ?? []).length === 1
      && damages[0].onSave === "none"
    );
    if (!valid) {
      throw new Error(
        `${currentRule.id} triggered event activity requires an attack completion, ` +
        "one feet-based target neighborhood, and one save plus one damage operation",
      );
    }
    const activityIdentifier =
      `${lowerCamelIdentifier(currentRule.id)}Triggered`;
    inferred.rules[currentRule.id] = {
      provider: "arcane-runtime",
      adapter: "triggered-event-activity-v1",
      activityIdentifier,
      activityName: `${graph.id}: ${currentRule.id}`,
      activityType: "save",
      activityFlags: {
        triggeredEventActivity: {
          version: 1,
          inheritParentScaling: true,
          inheritParentSaveDc: true,
          includeAnchor: target.origin.includeAnchor !== false,
          radius: target.origin.radius,
          units: target.origin.units,
          kind: target.targetKind ?? target.kind ?? "creature",
          sourceOperationId: currentRule.on.operationId,
        },
      },
    };
    inferred.dedupe[currentRule.id] = "workflowUuid + ruleId";
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalWorkflowOutcomeForcedMovementHints(
  graph,
  explicit = {},
) {
  const inferred = {
    rules: {},
    dedupe: {},
  };
  for (const currentRule of graph.rules ?? []) {
    if (
      explicit.rules?.[currentRule.id]
      || currentRule.on?.type !== "operation-outcome"
      || String(currentRule.on?.operationId ?? "").startsWith("external:")
    ) {
      continue;
    }
    const operations = currentRule.do ?? [];
    if (!operations.some(current => current.type === "move-token")) continue;
    if (
      operations.length === 0
      || !operations.every(current => current.type === "move-token")
    ) {
      throw new Error(
        `${currentRule.id} workflow-outcome forced movement cannot mix move-token `
        + "with other operations",
      );
    }
    const sourceOperation = graphOperation(graph, currentRule.on.operationId);
    const validOutcome = (
      sourceOperation?.type === "saving-throw"
      && currentRule.on.outcome === "failure"
    );
    if (!validOutcome) {
      throw new Error(
        `${currentRule.id} workflow-outcome forced movement requires a matching `
        + "saving-throw failure trigger",
      );
    }
    if ((currentRule.when ?? []).length > 0) {
      throw new Error(
        `${currentRule.id} workflow-outcome forced movement cannot declare predicates`,
      );
    }
    const target = oneEventBoundTarget(
      currentRule,
      "workflow-outcome forced movement",
    );
    for (const currentOperation of operations) {
      const destination = currentOperation.destination;
      if (
        currentOperation.target !== target.id
        || destination?.type !== "away-from-source"
        || !Number.isFinite(Number(destination.distance))
        || Number(destination.distance) <= 0
        || destination.units !== "ft"
        || Object.keys(destination).sort().join(",") !== "distance,type,units"
      ) {
        throw new Error(
          `${currentRule.id} workflow-outcome forced movement requires each event `
          + `target move to use {type:"away-from-source", distance:positive, units:"ft"}`,
        );
      }
    }
    inferred.rules[currentRule.id] = {
      provider: "arcane-runtime",
      adapter: "workflow-outcome-forced-movement-v1",
    };
    inferred.dedupe[currentRule.id] =
      "workflowUuid + ruleId + targetUuid";
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function lifecycleContainsExactTrigger(value, triggerType, subject) {
  if (!value || typeof value !== "object") return false;
  if (
    value.type === "until-trigger"
    && value.trigger?.type === triggerType
    && value.trigger?.subject === subject
  ) {
    return true;
  }
  return value.type === "first-of"
    && (value.values ?? []).some(current =>
      lifecycleContainsExactTrigger(current, triggerType, subject)
    );
}

function inferCanonicalOneShotTurnDamageHints(graph, explicit = {}) {
  const inferred = {
    artifacts: {},
    rules: {},
    dedupe: {},
  };
  const activityDefinitions = new Map();
  for (const currentRule of graph.rules ?? []) {
    if (
      explicit.rules?.[currentRule.id]
      || !["turn-start", "turn-end"].includes(currentRule.on?.type)
      || currentRule.on?.subject !== "effect-target"
    ) {
      continue;
    }
    const damageOperations = (currentRule.do ?? []).filter(current =>
      current.type === "damage"
    );
    const deleteOperations = (currentRule.do ?? []).filter(current =>
      current.type === "delete-artifact"
    );
    if (damageOperations.length === 0 && deleteOperations.length === 0) continue;
    if (
      damageOperations.length !== 1
      || deleteOperations.length !== 1
      || (currentRule.do ?? []).length !== 2
    ) {
      continue;
    }
    const artifactPredicates = (currentRule.when ?? []).filter(current =>
      current.type === "artifact-exists"
      && current.subject === "effect-target"
    );
    if (
      artifactPredicates.length !== 1
      || (currentRule.when ?? []).length !== 1
    ) {
      throw new Error(
        `${currentRule.id} one-shot turn damage requires exactly one `
        + "effect-target artifact-exists predicate",
      );
    }
    const artifactId = artifactPredicates[0].artifactId;
    const artifactValue = graphArtifact(
      graph,
      artifactId,
      `${currentRule.id} one-shot turn damage`,
    );
    if (
      artifactValue.kind !== "effect"
      || artifactValue.role !== "mechanical"
      || artifactValue.identity?.scope !== "source-target"
      || !["replace", "stack"].includes(artifactValue.reapply)
    ) {
      throw new Error(
        `${currentRule.id} one-shot turn damage requires a replace- or stack-scoped `
        + `source-target mechanical effect ${artifactId}`,
      );
    }
    if (
      !lifecycleContainsExactTrigger(
        artifactValue.lifecycle,
        currentRule.on.type,
        "effect-target",
      )
    ) {
      throw new Error(
        `${currentRule.id} one-shot turn damage requires ${artifactId} to end on `
        + `${currentRule.on.type}(effect-target)`,
      );
    }
    const target = oneEventBoundTarget(
      currentRule,
      "one-shot turn damage",
    );
    const damage = damageOperations[0];
    const deletion = deleteOperations[0];
    if (
      damage.target !== target.id
      || deletion.target !== target.id
      || deletion.artifactId !== artifactId
      || !String(damage.formula ?? "").trim()
      || (damage.damageTypes ?? []).length !== 1
    ) {
      throw new Error(
        `${currentRule.id} one-shot turn damage must damage ${target.id} and `
        + `then delete ${artifactId} from the same target`,
      );
    }
    const identifierBase = lowerCamelIdentifier(artifactId);
    const activityIdentifier = /damage$/i.test(identifierBase)
      ? identifierBase
      : `${identifierBase}Damage`;
    const existing = activityDefinitions.get(activityIdentifier);
    if (existing) {
      throw new Error(
        `${currentRule.id} and ${existing} define duplicate one-shot turn `
        + `damage activity ${activityIdentifier}`,
      );
    }
    activityDefinitions.set(activityIdentifier, currentRule.id);
    inferred.rules[currentRule.id] = {
      provider: "midi-overtime",
      activityIdentifier,
      activityName:
        artifactValue.state?.name
        ?? `${graph.id}: ${damage.id}`,
      overTime: {
        turnChoice: currentRule.on.type === "turn-start" ? "start" : "end",
        saveRemoves: false,
        rollAs: "source",
        postRemoveConditionText: "true",
      },
    };
    inferred.artifacts[artifactId] = mergeArtifactLoweringHint(
      inferred.artifacts[artifactId],
      {
        provider: "native-active-effect",
        activityOverTime: activityIdentifier,
        deferLifecycleCleanupToActivity: true,
      },
    );
    inferred.dedupe[currentRule.id] =
      "sourceEffectUuid + targetUuid + targetTurn";
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalRecurringTurnDamageHints(graph, explicit = {}) {
  const inferred = {
    artifacts: {},
    rules: {},
    dedupe: {},
  };
  for (const currentRule of graph.rules ?? []) {
    if (
      explicit.rules?.[currentRule.id]
      || !["turn-start", "turn-end"].includes(currentRule.on?.type)
      || currentRule.on?.subject !== "effect-target"
    ) continue;
    const damage = (currentRule.do ?? []).filter(current =>
      current.type === "damage"
    );
    if (damage.length === 0) continue;
    const guards = (currentRule.when ?? []).filter(current =>
      current.type === "artifact-exists"
      && current.subject === "effect-target"
    );
    if (
      damage.length !== 1
      || (currentRule.do ?? []).length !== 1
      || guards.length !== 1
      || (currentRule.when ?? []).length !== 1
      || (currentRule.targets ?? []).length !== 1
      || currentRule.targets[0]?.origin?.type !== "event-binding"
      || currentRule.targets[0]?.origin?.name !== "target"
      || damage[0].target !== currentRule.targets[0].id
      || (damage[0].damageTypes ?? []).length !== 1
    ) {
      throw new Error(
        `${currentRule.id} recurring turn damage requires one guarded event-target damage operation`,
      );
    }
    const artifact = graphArtifact(
      graph,
      guards[0].artifactId,
      currentRule.id,
    );
    if (
      artifact.kind !== "effect"
      || artifact.role !== "mechanical"
      || artifact.identity?.scope !== "source-target"
    ) {
      throw new Error(
        `${currentRule.id} recurring turn damage requires a source-target effect`,
      );
    }
    const identifier = `${lowerCamelIdentifier(artifact.id)}RecurringDamage`;
    inferred.rules[currentRule.id] = {
      provider: "midi-overtime",
      activityIdentifier: identifier,
      activityName: artifact.state?.name ?? `${graph.id}: ${damage[0].id}`,
      overTime: {
        turnChoice: currentRule.on.type === "turn-start" ? "start" : "end",
        saveRemoves: false,
        rollAs: "source",
      },
    };
    inferred.artifacts[artifact.id] = mergeArtifactLoweringHint(
      inferred.artifacts[artifact.id],
      {
        provider: "native-active-effect",
        activityOverTime: identifier,
      },
    );
    inferred.dedupe[currentRule.id] =
      "sourceEffectUuid + targetUuid + targetTurn";
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function repeatSaveRollAs(graph, artifactId) {
  const artifactValue = (graph.artifacts ?? []).find(current =>
    current.id === artifactId
  );
  if (!artifactValue) {
    throw new Error(`Repeat save references missing artifact ${artifactId}`);
  }
  // Midi creates the synthetic overtime Item under rollActor. A spell save whose
  // DC comes from the original caster must therefore always roll as the source;
  // rollAs "target" would recompute the DC from the affected creature.
  return "source";
}

function inferCanonicalOutcomeRaceHints(graph, explicit = {}) {
  const inferred = {
    artifacts: {},
    rules: {},
    dedupe: {},
  };
  for (const pending of (graph.artifacts ?? []).filter(current =>
    current.kind === "effect" && current.state?.outcomeRace
  )) {
    const race = pending.state.outcomeRace;
    const sourceBound = race.profile === "source-bound-natural-expiry";
    const entryOperationType = sourceBound ? "saving-throw" : "attack-roll";
    const repeatRule = (graph.rules ?? []).find(current =>
      current.id === race.repeatSaveRuleId
    );
    const saveOperation = repeatRule?.do?.[0];
    const entryRule = (graph.rules ?? []).find(current =>
      current.on?.type === "action-used"
      && (current.do ?? []).some(operationValue =>
        operationValue.id === race.entry.operationId
        && operationValue.type === entryOperationType
      )
    );
    if (!repeatRule || !saveOperation || !entryRule) {
      throw new Error(
        `${graph.id} outcome race ${pending.id} is missing its entry or repeat save rule`,
      );
    }
    if (explicit.rules?.[entryRule.id] || explicit.rules?.[repeatRule.id]) {
      throw new Error(
        `${graph.id} outcome race ${pending.id} cannot mix explicit and inferred lowering`,
      );
    }
    const entryOutcomeRule = (graph.rules ?? []).find(current =>
      current.on?.type === "operation-outcome"
      && current.on.operationId === race.entry.operationId
      && current.on.outcome === race.entry.beginOn
      && (current.do ?? []).some(operationValue =>
        operationValue.type === "apply-artifact"
        && operationValue.artifactId === pending.id
      )
    );
    if (!entryOutcomeRule) {
      throw new Error(
        `${graph.id} outcome race ${pending.id} must apply its pending artifact `
        + `when ${race.entry.operationId} resolves as ${race.entry.beginOn}`,
      );
    }
    const activityIdentifier = repeatSaveActivityIdentifier(
      graph,
      pending.id,
      repeatRule.on.type,
    );
    const contract = {
      version: 1,
      profile: race.profile,
      pendingArtifactId: pending.id,
      failureArtifactId: race.failureArtifactId,
      naturalExpiryArtifactId: race.naturalExpiryArtifactId ?? null,
      entryOperationId: race.entry.operationId,
      entryActionId: entryRule.on.actionId,
      beginOn: race.entry.beginOn,
      endSourceOn: race.entry.endSourceOn ?? null,
      repeatSaveRuleId: repeatRule.id,
      repeatSaveOperationId: saveOperation.id,
      successThreshold: race.successThreshold,
      failureThreshold: race.failureThreshold,
      activityIdentifier,
    };
    inferred.artifacts[pending.id] = mergeArtifactLoweringHint(
      inferred.artifacts[pending.id],
      {
        provider: "native-active-effect",
        activityOverTime: activityIdentifier,
        flags: { outcomeRace: contract },
      },
    );
    if (sourceBound) {
      inferred.artifacts[race.failureArtifactId] = mergeArtifactLoweringHint(
        inferred.artifacts[race.failureArtifactId],
        {
          provider: "native-active-effect",
          flags: {
            outcomeRaceTerminal: {
              version: 1,
              pendingArtifactId: pending.id,
              naturalExpiryArtifactId: race.naturalExpiryArtifactId,
            },
          },
        },
      );
    }
    inferred.rules[entryRule.id] = {
      provider: "arcane-runtime",
      adapter: "outcome-race-v1",
      phase: "entry",
      ...contract,
      // The entry phase runs on the public Cast activity. Only the repeat
      // phase defines the synthetic overtime save Activity.
      activityIdentifier: undefined,
    };
    inferred.rules[repeatRule.id] = {
      provider: "arcane-runtime",
      adapter: "outcome-race-v1",
      phase: "repeat",
      ...contract,
      activityIdentifier,
      activityName: `${graph.id}: ${saveOperation.id}`,
      overTime: {
        turnChoice: repeatRule.on.type === "turn-start" ? "start" : "end",
        saveRemoves: false,
        rollAs: repeatSaveRollAs(graph, pending.id),
      },
    };
    inferred.dedupe[entryRule.id] = "workflowUuid + sourceItemUuid";
    inferred.dedupe[repeatRule.id] =
      "sourceEffectUuid + targetUuid + targetTurn";
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalRepeatSaveHints(graph, explicit = {}, script = null) {
  const inferred = {
    artifacts: {},
    rules: {},
    dedupe: {},
  };
  const activityDefinitions = new Map();
  const damageContracts = new Map();
  const claimActivityDefinition = (identifier, ruleId) => {
    const existing = activityDefinitions.get(identifier);
    if (existing) {
      throw new Error(
        `${ruleId} and ${existing} would define duplicate repeat-save activity ${identifier}`,
      );
    }
    activityDefinitions.set(identifier, ruleId);
  };
  for (const currentRule of graph.rules ?? []) {
    if (explicit.rules?.[currentRule.id]) continue;
    if (!["turn-start", "turn-end", "damage-taken"].includes(currentRule.on?.type)) {
      continue;
    }
    const saveOperations = (currentRule.do ?? []).filter(current =>
      current.type === "saving-throw"
    );
    if (saveOperations.length === 0) continue;
    if (saveOperations.length !== 1 || (currentRule.do ?? []).length !== 1) {
      throw new Error(
        `${currentRule.id} repeat-save rule must contain exactly one saving throw`,
      );
    }
    const saveOperation = saveOperations[0];
    const artifactId = repeatSaveArtifactId(currentRule);
    if (!artifactId) continue;
    const scriptHandler = (script?.handlers ?? []).find(handler =>
      handler?.event === "repeat-save-outcome"
      && handler?.ruleId === currentRule.id
    ) ?? null;
    if (scriptHandler && scriptHandler.artifactId !== artifactId) {
      throw new Error(
        `${currentRule.id} script handler ${scriptHandler.id} must own repeat-save artifact ${artifactId}`,
      );
    }
    const successRule = scriptHandler
      ? null
      : repeatSaveSuccessRule(graph, saveOperation, artifactId);
    if (successRule && explicit.rules?.[successRule.id]) {
      throw new Error(
        `${currentRule.id} and ${successRule.id} must either both use inferred lowering or both declare it`,
      );
    }
    const reusableIdentifier = currentRule.on.type === "damage-taken"
      ? reusableTurnSaveIdentifier(graph, currentRule, artifactId, saveOperation)
      : null;
    const identifier = reusableIdentifier
      ?? repeatSaveActivityIdentifier(graph, artifactId, currentRule.on.type);
    const activityName = `${graph.id}: ${saveOperation.id}`;
    if (currentRule.on.type === "damage-taken") {
      const existingDamageRule = damageContracts.get(artifactId);
      if (existingDamageRule) {
        throw new Error(
          `${currentRule.id} and ${existingDamageRule} define multiple damage repeat saves for artifact ${artifactId}`,
        );
      }
      damageContracts.set(artifactId, currentRule.id);
      const damagePredicate = (currentRule.when ?? []).find(current =>
        current.type === "damage-applied"
      );
      if (!damagePredicate || Number(damagePredicate.minimum ?? 1) < 1) {
        throw new Error(
          `${currentRule.id} damage repeat save requires positive damage-applied`,
        );
      }
      const rollMode = saveOperation.rollMode ?? "normal";
      if (!reusableIdentifier) {
        claimActivityDefinition(identifier, currentRule.id);
      }
      inferred.rules[currentRule.id] = {
        provider: "arcane-runtime",
        adapter: "damage-triggered-repeat-save-v1",
        phase: "damage",
        ...(reusableIdentifier
          ? { usesActivityIdentifier: identifier }
          : { activityIdentifier: identifier }),
        activityName,
      };
      inferred.rules[successRule.id] = {
        provider: "arcane-runtime",
        adapter: "damage-triggered-repeat-save-v1",
        phase: "success-cleanup",
        usesActivityIdentifier: identifier,
      };
      inferred.artifacts[artifactId] = mergeArtifactLoweringHint(
        inferred.artifacts[artifactId],
        {
          provider: "native-active-effect",
          flags: {
            damageTriggeredRepeatSave: {
              activityIdentifier: identifier,
              ability: saveOperation.ability?.[0],
              rollMode,
              advantage: rollMode === "advantage",
              removesOnSave: true,
            },
          },
        },
      );
      inferred.dedupe[currentRule.id] =
        "workflowUuid + targetUuid + sourceEffectUuid";
      continue;
    }
    claimActivityDefinition(identifier, currentRule.id);
    inferred.rules[currentRule.id] = {
      provider: "midi-overtime",
      activityIdentifier: identifier,
      activityName,
      overTime: {
        turnChoice: currentRule.on.type === "turn-start" ? "start" : "end",
        saveRemoves: true,
        rollAs: repeatSaveRollAs(graph, artifactId),
      },
    };
    if (successRule) {
      inferred.rules[successRule.id] = {
        provider: "midi-overtime",
        usesActivityIdentifier: identifier,
      };
    }
    inferred.artifacts[artifactId] = mergeArtifactLoweringHint(
      inferred.artifacts[artifactId],
      {
        provider: "native-active-effect",
        activityOverTime: identifier,
      },
    );
    if (scriptHandler) {
      inferred.rules[currentRule.id].overTime.saveRemoves = false;
    }
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

const DECLARED_WEAPON_ATTACK_KINDS = new Set([
  "melee-weapon",
  "ranged-weapon",
  "weapon",
]);

function predicatesOfType(ruleValue, type) {
  return (ruleValue.when ?? []).filter(current => current.type === type);
}

function onePredicate(ruleValue, type, label = type) {
  const predicates = predicatesOfType(ruleValue, type);
  if (predicates.length !== 1) {
    throw new Error(
      `${ruleValue.id} requires exactly one ${label} predicate`,
    );
  }
  return predicates[0];
}

function oneOperation(ruleValue, type, label = type) {
  const operations = (ruleValue.do ?? []).filter(current =>
    current.type === type
  );
  if (operations.length !== 1) {
    throw new Error(
      `${ruleValue.id} requires exactly one ${label} operation`,
    );
  }
  return operations[0];
}

function oneEventBoundTarget(ruleValue, label) {
  const targets = ruleValue.targets ?? [];
  if (
    targets.length !== 1
    || targets[0]?.result !== "tokens"
    || targets[0]?.origin?.type !== "event-binding"
    || targets[0]?.origin?.name !== "target"
    || targets[0]?.cardinality?.min !== 1
    || targets[0]?.cardinality?.max !== 1
  ) {
    throw new Error(
      `${ruleValue.id} ${label} requires one event-bound token target`,
    );
  }
  return targets[0];
}

function graphArtifact(graph, artifactId, label) {
  const artifactValue = (graph.artifacts ?? []).find(current =>
    current.id === artifactId
  );
  if (!artifactValue || artifactValue.kind !== "effect") {
    throw new Error(
      `${label} references missing effect artifact ${artifactId}`,
    );
  }
  return artifactValue;
}

function spellDamageProperties(damage) {
  return [...new Set(["spell", ...(damage?.properties ?? [])])];
}

function oneAttackerBoundTarget(ruleValue, label) {
  const targets = ruleValue.targets ?? [];
  if (
    targets.length !== 1
    || targets[0]?.result !== "tokens"
    || targets[0]?.origin?.type !== "event-binding"
    || targets[0]?.origin?.name !== "attacker"
    || targets[0]?.evaluation !== "snapshot"
    || targets[0]?.cardinality?.min !== 1
    || targets[0]?.cardinality?.max !== 1
  ) {
    throw new Error(
      `${ruleValue.id} ${label} requires one event-bound attacker token`,
    );
  }
  return targets[0];
}

function operationFormulaContract(operationValue) {
  return compactObject({
    formula: operationValue.formula,
    formulaExpression: clone(operationValue.formulaExpression),
    scaling: clone(operationValue.scaling),
  });
}

function lifecycleContainsTrigger(lifecycleValue, triggerType, artifactId) {
  if (!lifecycleValue || typeof lifecycleValue !== "object") return false;
  if (
    lifecycleValue.type === "until-trigger"
    && lifecycleValue.trigger?.type === triggerType
    && (
      artifactId === undefined
      || lifecycleValue.trigger?.artifactId === artifactId
    )
  ) {
    return true;
  }
  if (lifecycleValue.type === "first-of") {
    return (lifecycleValue.values ?? []).some(current =>
      lifecycleContainsTrigger(current, triggerType, artifactId)
    );
  }
  return false;
}

function sourceTargetMechanicalEffect(graph, artifactId, label) {
  const artifactValue = graphArtifact(graph, artifactId, label);
  if (
    artifactValue.role !== "mechanical"
    || artifactValue.identity?.scope !== "source-target"
    || artifactValue.reapply !== "replace"
  ) {
    throw new Error(
      `${label} requires replace-scoped source-target mechanical effect ${artifactId}`,
    );
  }
  return artifactValue;
}

function temporaryHitPointsCastBinding(graph, castRule) {
  const grants = (castRule.do ?? []).filter(current =>
    current.type === "grant-temporary-hp"
  );
  if (grants.length === 0) return null;
  if (grants.length !== 1) {
    throw new Error(
      `${castRule.id} temporary-hit-points source requires exactly one grant-temporary-hp`,
    );
  }
  const grant = grants[0];
  const applications = (castRule.do ?? []).filter(current =>
    current.type === "apply-artifact"
    && current.target === grant.target
  );
  if (applications.length === 0) return null;
  if (applications.length !== 1) {
    throw new Error(
      `${castRule.id} temporary-hit-points source requires exactly one effect on ${grant.target}`,
    );
  }
  const application = applications[0];
  const artifactValue = sourceTargetMechanicalEffect(
    graph,
    application.artifactId,
    castRule.id,
  );
  return {
    artifact: artifactValue,
    application,
    grant,
  };
}

function temporaryHitPointsArtifactCastBinding(
  graph,
  castRule,
  artifactId,
) {
  const applications = (castRule.do ?? []).filter(current =>
    current.type === "apply-artifact"
    && current.artifactId === artifactId
  );
  if (applications.length === 0) return null;
  if (applications.length !== 1) {
    throw new Error(
      `${castRule.id} temporary-hit-points refresh requires exactly one `
      + `application of ${artifactId}`,
    );
  }
  const application = applications[0];
  const grants = (castRule.do ?? []).filter(current =>
    current.type === "grant-temporary-hp"
    && current.target === application.target
  );
  if (grants.length > 1) {
    throw new Error(
      `${castRule.id} temporary-hit-points refresh allows at most one `
      + `initial grant on ${application.target}`,
    );
  }
  return {
    artifact: sourceTargetMechanicalEffect(
      graph,
      artifactId,
      castRule.id,
    ),
    application,
    grant: grants[0] ?? null,
  };
}

function inferCanonicalTemporaryHitPointsSourceHints(
  graph,
  explicit = {},
) {
  const inferred = {
    artifacts: {},
    rules: {},
    dedupe: {},
  };
  const castRules = (graph.rules ?? []).filter(current =>
    current.on?.type === "action-used"
    && (current.do ?? []).some(operationValue =>
      operationValue.type === "grant-temporary-hp"
    )
  );
  const claimedArtifacts = new Set();
  for (const castRule of castRules) {
    const binding = temporaryHitPointsCastBinding(graph, castRule);
    if (!binding) continue;
    const artifactId = binding.artifact.id;
    if (claimedArtifacts.has(artifactId)) {
      throw new Error(
        `${graph.id} defines multiple temporary-hit-points source casts for ${artifactId}`,
      );
    }
    claimedArtifacts.add(artifactId);

    const depletedRules = (graph.rules ?? []).filter(current =>
      current.on?.type === "temporary-hit-points-depleted"
      && current.on?.artifactId === artifactId
    );
    if (depletedRules.length > 1) {
      throw new Error(
        `${artifactId} has multiple temporary-hit-points-depleted rules`,
      );
    }
    const depletedRule = depletedRules[0] ?? null;
    if (
      depletedRule
      && !lifecycleContainsTrigger(
        binding.artifact.lifecycle,
        "temporary-hit-points-depleted",
        artifactId,
      )
    ) {
      throw new Error(
        `${depletedRule.id} requires ${artifactId} lifecycle to end when its temporary HP depletes`,
      );
    }
    if (depletedRule) {
      const target = oneEventBoundTarget(
        depletedRule,
        "temporary-hit-points depletion",
      );
      const deletion = oneOperation(
        depletedRule,
        "delete-artifact",
        "temporary-hit-points source cleanup",
      );
      if (
        (depletedRule.when ?? []).length !== 0
        || (depletedRule.do ?? []).length !== 1
        || deletion.artifactId !== artifactId
        || deletion.target !== target.id
      ) {
        throw new Error(
          `${depletedRule.id} must only delete depleted source artifact ${artifactId}`,
        );
      }
    }

    const involvedRuleIds = [
      castRule.id,
      ...(depletedRule ? [depletedRule.id] : []),
    ];
    if (involvedRuleIds.some(ruleId => explicit.rules?.[ruleId])) {
      throw new Error(
        `${graph.id} temporary-hit-points source cannot mix explicit and inferred lowering`,
      );
    }
    const contract = {
      version: 1,
      artifactId,
      castRuleId: castRule.id,
      initialGrant: true,
      grantOperationId: binding.grant.id,
      amount: operationFormulaContract(binding.grant),
      ...(depletedRule ? { depletionRuleId: depletedRule.id } : {}),
    };
    inferred.artifacts[artifactId] = mergeArtifactLoweringHint(
      inferred.artifacts[artifactId],
      {
        provider: "native-active-effect",
        flags: {
          temporaryHitPointsSource: contract,
        },
      },
    );
    inferred.rules[castRule.id] = {
      provider: "arcane-runtime",
      adapter: "temporary-hit-points-source-v1",
      phase: "bind",
      artifactId,
      initialGrant: true,
      grantOperationId: binding.grant.id,
    };
    inferred.dedupe[castRule.id] =
      "workflowUuid + sourceEffectUuid + targetActorUuid";
    if (depletedRule) {
      inferred.rules[depletedRule.id] = {
        provider: "arcane-runtime",
        adapter: "temporary-hit-points-source-v1",
        phase: "depleted",
        artifactId,
      };
      inferred.dedupe[depletedRule.id] =
        "damageTransactionUuid + sourceEffectUuid";
    }
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalTemporaryHitPointsRefreshHints(
  graph,
  explicit = {},
) {
  const inferred = {
    artifacts: {},
    rules: {},
    dedupe: {},
  };
  const refreshRules = (graph.rules ?? []).filter(current =>
    current.on?.type === "turn-start"
    && (current.do ?? []).some(operationValue =>
      operationValue.type === "grant-temporary-hp"
    )
  );
  const claimedArtifacts = new Set();
  for (const refreshRule of refreshRules) {
    const exists = onePredicate(refreshRule, "artifact-exists");
    const target = oneEventBoundTarget(
      refreshRule,
      "temporary-hit-points refresh",
    );
    const refresh = oneOperation(
      refreshRule,
      "grant-temporary-hp",
      "temporary-hit-points refresh",
    );
    if (
      (refreshRule.when ?? []).length !== 1
      || (refreshRule.do ?? []).length !== 1
      || exists.subject !== "effect-target"
      || refresh.target !== target.id
    ) {
      throw new Error(
        `${refreshRule.id} must refresh one effect-target temporary-HP source`,
      );
    }
    const artifactValue = sourceTargetMechanicalEffect(
      graph,
      exists.artifactId,
      refreshRule.id,
    );
    if (claimedArtifacts.has(artifactValue.id)) {
      throw new Error(
        `${graph.id} defines multiple temporary-hit-points refresh rules for ${artifactValue.id}`,
      );
    }
    claimedArtifacts.add(artifactValue.id);
    const castBindings = (graph.rules ?? [])
      .filter(current => current.on?.type === "action-used")
      .map(current => ({
        rule: current,
        binding: temporaryHitPointsArtifactCastBinding(
          graph,
          current,
          artifactValue.id,
        ),
      }))
      .filter(current => current.binding?.artifact.id === artifactValue.id);
    if (castBindings.length !== 1) {
      throw new Error(
        `${refreshRule.id} requires one cast binding for ${artifactValue.id}`,
      );
    }
    const cast = castBindings[0];
    if (
      cast.binding.grant
      && (
        stableStringify(operationFormulaContract(cast.binding.grant))
        !== stableStringify(operationFormulaContract(refresh))
      )
    ) {
      throw new Error(
        `${refreshRule.id} amount must match cast temporary HP for ${artifactValue.id}`,
      );
    }
    if (explicit.rules?.[refreshRule.id]) {
      throw new Error(
        `${graph.id} temporary-hit-points refresh cannot mix explicit and inferred lowering`,
      );
    }
    const amount = operationFormulaContract(refresh);
    inferred.artifacts[artifactValue.id] = mergeArtifactLoweringHint(
      inferred.artifacts[artifactValue.id],
      {
        provider: "native-active-effect",
        flags: {
          ...(!cast.binding.grant
            ? {
                temporaryHitPointsSource: {
                  version: 1,
                  artifactId: artifactValue.id,
                  castRuleId: cast.rule.id,
                  initialGrant: false,
                  amount,
                },
              }
            : {}),
          temporaryHitPointsRefresh: {
            version: 1,
            artifactId: artifactValue.id,
            castRuleId: cast.rule.id,
            refreshRuleId: refreshRule.id,
            amount,
            evaluation: "source-at-trigger",
            refresh: "raise-to-minimum",
          },
        },
      },
    );
    if (!cast.binding.grant) {
      if (explicit.rules?.[cast.rule.id]) {
        throw new Error(
          `${graph.id} refresh-only temporary-hit-points source cannot mix `
          + "explicit and inferred lowering",
        );
      }
      inferred.rules[cast.rule.id] = {
        provider: "arcane-runtime",
        adapter: "temporary-hit-points-source-v1",
        phase: "bind",
        artifactId: artifactValue.id,
        initialGrant: false,
      };
      inferred.dedupe[cast.rule.id] =
        "workflowUuid + sourceEffectUuid + targetActorUuid";
    }
    inferred.rules[refreshRule.id] = {
      provider: "arcane-runtime",
      adapter: "temporary-hit-points-refresh-v1",
      phase: "refresh",
      artifactId: artifactValue.id,
    };
    inferred.dedupe[refreshRule.id] =
      "combatUuid + round + turn + sourceEffectUuid";
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalSourceArtifactDismissHints(
  graph,
  explicit = {},
) {
  const inferred = {
    artifacts: {},
    rules: {},
    dedupe: {},
  };
  const oneShotConsumersByArtifact = new Map();
  for (const actionValue of graph.actions ?? []) {
    const availability = actionValue.availableWhen ?? [];
    const consumingEntries = availability.filter(current =>
      current?.consumption === "one-shot"
    );
    if (consumingEntries.length === 0) continue;
    const consumingAvailability = consumingEntries[0];
    if (
      availability.length !== 1
      || consumingEntries.length !== 1
      || consumingAvailability?.type !== "artifact-exists"
      || consumingAvailability?.subject !== "source"
      || !consumingAvailability?.artifactId
    ) {
      throw new Error(
        `${graph.id} one-shot source consumption must declare exactly one exact source artifact availability`,
      );
    }
    const actionRules = (graph.rules ?? []).filter(current =>
      current.on?.type === "action-used"
      && current.on.actionId === actionValue.id
    );
    const deletions = actionRules.flatMap(currentRule =>
      (currentRule.do ?? [])
        .filter(currentOperation => currentOperation.type === "delete-artifact")
        .map(currentOperation => ({ currentRule, currentOperation }))
    );
    const matchingDeletions = deletions.filter(({ currentOperation }) =>
      currentOperation.target === "source"
      && currentOperation.artifactId === consumingAvailability.artifactId
    );
    if (deletions.length !== 1 || matchingDeletions.length !== 1) {
      throw new Error(
        `${graph.id} one-shot Action ${actionValue.id} must have exactly one source delete-artifact operation for ${consumingAvailability.artifactId}`,
      );
    }
    const priorConsumer = oneShotConsumersByArtifact.get(
      consumingAvailability.artifactId,
    );
    if (priorConsumer) {
      throw new Error(
        `${graph.id} source artifact ${consumingAvailability.artifactId} cannot be consumed by more than one one-shot Action (${priorConsumer}, ${actionValue.id})`,
      );
    }
    oneShotConsumersByArtifact.set(
      consumingAvailability.artifactId,
      actionValue.id,
    );
  }
  const roots = (graph.rules ?? []).filter(current => {
    if (current.on?.type !== "action-used") return false;
    const actionValue = (graph.actions ?? []).find(actionEntry =>
      actionEntry.id === current.on.actionId
    );
    const availability = actionValue?.availableWhen ?? [];
    if (availability.length !== 1) return false;
    return (current.do ?? []).some(operationValue =>
      operationValue.type === "delete-artifact"
      && operationValue.target === "source"
      && availability[0]?.type === "artifact-exists"
      && availability[0]?.subject === "source"
      && availability[0]?.artifactId === operationValue.artifactId
    );
  });
  for (const rootRule of roots) {
    if (explicit.rules?.[rootRule.id]) {
      throw new Error(
        `${graph.id} source artifact dismiss cannot mix explicit and inferred lowering`,
      );
    }
    const deletion = oneOperation(
      rootRule,
      "delete-artifact",
      "source artifact transition",
    );
    const actionValue = (graph.actions ?? []).find(current =>
      current.id === rootRule.on.actionId
    );
    const availability = actionValue?.availableWhen ?? [];
    const oneShot = availability[0]?.consumption === "one-shot";
    if ((rootRule.when ?? []).length !== 0 || deletion.target !== "source") {
      throw new Error(
        `${rootRule.id} source artifact transition must be unconditional and delete its source artifact`,
      );
    }
    const sourceArtifact = graphArtifact(
      graph,
      deletion.artifactId,
      rootRule.id,
    );
    if (
      sourceArtifact.role !== "mechanical"
      || sourceArtifact.host !== "actor"
      || sourceArtifact.identity?.scope !== "source"
      || sourceArtifact.reapply !== "replace"
    ) {
      throw new Error(
        `${rootRule.id} source artifact dismiss requires a source-scoped mechanical effect`,
      );
    }
    const targets = rootRule.targets ?? [];
    if (
      !actionValue
      || actionValue.visibility !== "public"
      || actionValue.delivery !== "standalone"
      || actionValue.activation?.type !== "action"
      || actionValue.activation?.cost !== 1
      || availability.length !== 1
      || availability[0]?.type !== "artifact-exists"
      || availability[0]?.subject !== "source"
      || availability[0]?.artifactId !== sourceArtifact.id
    ) {
      throw new Error(
        `${rootRule.id} source transition must be a one-action public standalone action gated `
        + "by its exact source artifact",
      );
    }
    if (
      !oneShot
      && (
        (rootRule.do ?? []).length !== 1
        || targets.length !== 1
        || targets[0]?.result !== "source"
        || targets[0]?.origin?.type !== "self"
        || targets[0]?.evaluation !== "snapshot"
        || targets[0]?.cardinality?.min !== 1
        || targets[0]?.cardinality?.max !== 1
      )
    ) {
      throw new Error(
        `${rootRule.id} repeatable dismiss must only delete one source artifact from self`,
      );
    }
    inferred.rules[rootRule.id] = {
      provider: "arcane-runtime",
      adapter: oneShot
        ? "source-bound-one-shot-v1"
        : "source-artifact-dismiss-v1",
      artifactId: sourceArtifact.id,
    };
    inferred.dedupe[rootRule.id] =
      oneShot
        ? "sourceEffectUuid"
        : "workflowUuid + sourceActorUuid + sourceEffectUuid";
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function appendArtifactTransitionHint(inferred, artifactId, contract) {
  const current = inferred.artifacts[artifactId]
    ?.flags?.externalOperationArtifactTransitions ?? [];
  inferred.artifacts[artifactId] = mergeArtifactLoweringHint(
    inferred.artifacts[artifactId],
    {
      provider: "native-active-effect",
      flags: {
        externalOperationArtifactTransitions: [
          ...current,
          contract,
        ],
      },
    },
  );
}

function inferCanonicalExternalOperationArtifactTransitionHints(
  graph,
  explicit = {},
) {
  const inferred = {
    artifacts: {},
    rules: {},
    dedupe: {},
  };
  const applyRules = (graph.rules ?? []).filter(current =>
    current.on?.type === "operation-outcome"
    && String(current.on?.operationId ?? "").startsWith("external:")
    && current.on?.outcome === "hit"
    && (current.do ?? []).some(operationValue =>
      operationValue.type === "apply-artifact"
    )
    && (current.when ?? []).some(predicateValue =>
      predicateValue.type === "temporary-hit-points-from-artifact"
    )
  );
  for (const applyRule of applyRules) {
    const exists = onePredicate(applyRule, "artifact-exists");
    const temporaryHitPoints = onePredicate(
      applyRule,
      "temporary-hit-points-from-artifact",
    );
    const target = oneEventBoundTarget(
      applyRule,
      "external operation artifact transition",
    );
    const application = oneOperation(
      applyRule,
      "apply-artifact",
      "external operation artifact transition",
    );
    if (
      (applyRule.when ?? []).length !== 2
      || (applyRule.do ?? []).length !== 1
      || exists.subject !== "attack-target"
      || temporaryHitPoints.subject !== "attack-target"
      || exists.artifactId !== temporaryHitPoints.artifactId
      || application.target !== target.id
    ) {
      throw new Error(
        `${applyRule.id} must transition one temporary-HP source on the hit target`,
      );
    }
    const sourceArtifact = sourceTargetMechanicalEffect(
      graph,
      exists.artifactId,
      applyRule.id,
    );
    const resultArtifact = sourceTargetMechanicalEffect(
      graph,
      application.artifactId,
      applyRule.id,
    );
    if (!(resultArtifact.state?.changes ?? []).some(current =>
      current.type === "gain-attack-advantage"
    )) {
      throw new Error(
        `${applyRule.id} result artifact ${resultArtifact.id} must give its holder attack advantage`,
      );
    }

    const consumeRules = (graph.rules ?? []).filter(current =>
      current.on?.type === "operation-outcome"
      && current.on?.operationId === applyRule.on.operationId
      && ["hit", "miss"].includes(current.on?.outcome)
      && (current.when ?? []).some(predicateValue =>
        predicateValue.type === "artifact-exists"
        && predicateValue.artifactId === resultArtifact.id
        && predicateValue.subject === "attack-source"
      )
    );
    const outcomes = new Set(consumeRules.map(current => current.on.outcome));
    if (
      consumeRules.length !== 2
      || !outcomes.has("hit")
      || !outcomes.has("miss")
    ) {
      throw new Error(
        `${applyRule.id} result artifact ${resultArtifact.id} requires hit and miss consumption rules`,
      );
    }
    for (const consumeRule of consumeRules) {
      const predicateValue = onePredicate(
        consumeRule,
        "artifact-exists",
      );
      const attacker = oneAttackerBoundTarget(
        consumeRule,
        "external operation artifact consumption",
      );
      const deletion = oneOperation(
        consumeRule,
        "delete-artifact",
        "external operation artifact consumption",
      );
      if (
        (consumeRule.when ?? []).length !== 1
        || (consumeRule.do ?? []).length !== 1
        || predicateValue.subject !== "attack-source"
        || predicateValue.artifactId !== resultArtifact.id
        || deletion.artifactId !== resultArtifact.id
        || deletion.target !== attacker.id
      ) {
        throw new Error(
          `${consumeRule.id} must consume ${resultArtifact.id} from the attacker`,
        );
      }
    }
    const ruleIds = [applyRule.id, ...consumeRules.map(current => current.id)];
    if (ruleIds.some(ruleId => explicit.rules?.[ruleId])) {
      throw new Error(
        `${graph.id} external artifact transition cannot mix explicit and inferred lowering`,
      );
    }
    const contract = {
      version: 1,
      operationId: applyRule.on.operationId,
      outcome: "hit",
      sourceArtifactId: sourceArtifact.id,
      resultArtifactId: resultArtifact.id,
      applyRuleId: applyRule.id,
      consumeRuleIds: consumeRules.map(current => current.id).sort(),
    };
    appendArtifactTransitionHint(
      inferred,
      sourceArtifact.id,
      { ...contract, role: "source" },
    );
    appendArtifactTransitionHint(
      inferred,
      resultArtifact.id,
      { ...contract, role: "result" },
    );
    inferred.rules[applyRule.id] = {
      provider: "arcane-runtime",
      adapter: "external-operation-artifact-transition-v1",
      phase: "apply",
      ...contract,
    };
    inferred.dedupe[applyRule.id] =
      "workflowUuid + sourceEffectUuid + targetActorUuid + resultArtifactId";
    for (const consumeRule of consumeRules) {
      inferred.rules[consumeRule.id] = {
        provider: "arcane-runtime",
        adapter: "external-operation-artifact-transition-v1",
        phase: "consume",
        ...contract,
        outcome: consumeRule.on.outcome,
      };
      inferred.dedupe[consumeRule.id] =
        "workflowUuid + resultEffectUuid + attackerActorUuid";
    }
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalEffectHostHitByAttackHints(
  graph,
  explicit = {},
) {
  const inferred = {
    artifacts: {},
    rules: {},
    dedupe: {},
  };
  const roots = (graph.rules ?? []).filter(current =>
    current.on?.type === "operation-outcome"
    && current.on?.operationId === "external:attack-roll"
    && current.on?.outcome === "hit"
    && (current.do ?? []).some(operationValue =>
      operationValue.type === "damage"
    )
    && (current.when ?? []).some(predicateValue =>
      predicateValue.type === "artifact-exists"
      && predicateValue.subject === "attack-target"
    )
  );
  const pending = roots.filter(current => !explicit.rules?.[current.id]);
  if (pending.length === 0) {
    return mergeInferredLoweringHints(inferred, explicit);
  }
  if (pending.length !== roots.length) {
    throw new Error(
      `${graph.id} effect-host attack retaliation cannot mix explicit and inferred lowering`,
    );
  }

  const sourceArtifacts = new Set();
  for (const rootRule of pending) {
    const exists = onePredicate(rootRule, "artifact-exists");
    const attack = onePredicate(rootRule, "attack-kind");
    const temporaryHitPoints = (rootRule.when ?? []).find(current =>
      current.type === "temporary-hit-points-from-artifact"
    ) ?? null;
    const expectedPredicateCount = temporaryHitPoints ? 3 : 2;
    if (
      (rootRule.when ?? []).length !== expectedPredicateCount
      || exists.subject !== "attack-target"
      || attack.value !== "melee"
      || (
        temporaryHitPoints
        && (
          temporaryHitPoints.subject !== "attack-target"
          || temporaryHitPoints.artifactId !== exists.artifactId
        )
      )
    ) {
      throw new Error(
        `${rootRule.id} effect-host retaliation requires one attack-target artifact, `
        + "a melee attack, and at most that artifact's temporary-HP guard",
      );
    }

    const attacker = oneAttackerBoundTarget(
      rootRule,
      "effect-host attack retaliation",
    );
    const damage = oneOperation(rootRule, "damage");
    if (
      (rootRule.do ?? []).length !== 1
      || damage.target !== attacker.id
      || !String(damage.formula ?? "").trim()
      || (damage.damageTypes ?? []).length !== 1
      || ["none", "parent-primary"].includes(damage.damageTypes[0])
      || damage.mitigation === "none"
      || damage.attachment === "triggering-attack"
    ) {
      throw new Error(
        `${rootRule.id} effect-host retaliation must only deal one ordinary `
        + "single-type damage operation to the event attacker",
      );
    }

    const sourceArtifact = graphArtifact(
      graph,
      exists.artifactId,
      rootRule.id,
    );
    if (
      sourceArtifact.role !== "mechanical"
      || sourceArtifact.host !== "actor"
      || sourceArtifact.identity?.scope !== "source"
      || sourceArtifact.reapply !== "replace"
    ) {
      throw new Error(
        `${rootRule.id} effect-host retaliation requires a replace-on-reapply `
        + "source-scoped actor mechanical effect",
      );
    }
    if (sourceArtifacts.has(sourceArtifact.id)) {
      throw new Error(
        `${graph.id} defines multiple effect-host retaliation rules for ${sourceArtifact.id}`,
      );
    }
    sourceArtifacts.add(sourceArtifact.id);

    const castRules = (graph.rules ?? []).filter(current =>
      current.on?.type === "action-used"
      && (current.do ?? []).some(operationValue =>
        operationValue.type === "apply-artifact"
        && operationValue.artifactId === sourceArtifact.id
        && operationValue.target === "source"
      )
    );
    if (castRules.length !== 1) {
      throw new Error(
        `${rootRule.id} effect-host retaliation requires one cast rule applying `
        + `${sourceArtifact.id} to the source`,
      );
    }
    const castRule = castRules[0];
    if (explicit.rules?.[castRule.id]) {
      throw new Error(
        `${graph.id} effect-host retaliation cannot explicitly lower cast rule ${castRule.id}`,
      );
    }
    const castOperations = castRule.do ?? [];
    const castConsumptions = castOperations.filter(current =>
      current.type === "consume-resource"
      && current.resource === "spell-slot"
      && current.timing === "on-use"
    );
    const castApplications = castOperations.filter(current =>
      current.type === "apply-artifact"
      && current.artifactId === sourceArtifact.id
      && current.target === "source"
    );
    const replacementArtifactIds = castOperations
      .filter(current =>
        current.type === "delete-artifact"
        && current.target === "source"
        && current.artifactId !== sourceArtifact.id
      )
      .map(current => current.artifactId);
    for (const replacementArtifactId of replacementArtifactIds) {
      const replacementArtifact = graphArtifact(
        graph,
        replacementArtifactId,
        castRule.id,
      );
      if (
        replacementArtifact.role !== "mechanical"
        || replacementArtifact.host !== "actor"
        || replacementArtifact.identity?.scope !== "source"
        || replacementArtifact.reapply !== "replace"
      ) {
        throw new Error(
          `${castRule.id} can only replace source-scoped actor mechanical effects`,
        );
      }
    }
    const allowedCastOperations = new Set([
      ...castConsumptions,
      ...castApplications,
      ...castOperations.filter(current =>
        replacementArtifactIds.includes(current.artifactId)
        && current.type === "delete-artifact"
        && current.target === "source"
      ),
      ...castOperations.filter(current =>
        temporaryHitPoints
        && (
          current.type === "grant-temporary-hp"
          || (
            current.type === "healing"
            && stableStringify(current.healingTypes) === stableStringify(["temphp"])
          )
        )
      ),
    ]);
    if (
      castConsumptions.length !== 1
      || castApplications.length !== 1
      || allowedCastOperations.size !== castOperations.length
    ) {
      throw new Error(
        `${castRule.id} effect-host retaliation cast supports only slot consumption, `
        + "its source effect, optional matching temporary HP, and explicit sibling replacement",
      );
    }
    if (temporaryHitPoints) {
      const grants = (castRule.do ?? []).filter(current =>
        (
          current.type === "healing"
          && stableStringify(current.healingTypes) === stableStringify(["temphp"])
        )
        || current.type === "grant-temporary-hp"
      );
      if (
        grants.length !== 1
        || grants[0].target !== "source"
        || stableStringify(operationFormulaContract(grants[0]))
          !== stableStringify(operationFormulaContract(damage))
      ) {
        throw new Error(
          `${castRule.id} temporary-HP retaliation requires one matching source grant`,
        );
      }
    }

    const contract = {
      version: 1,
      runtimeRuleId: rootRule.id,
      sourceArtifactId: sourceArtifact.id,
      operationId: "external:attack-roll",
      attackKind: "melee",
      requiresTemporaryHitPoints: Boolean(temporaryHitPoints),
      damage: {
        ...operationFormulaContract(damage),
        types: [...damage.damageTypes],
        properties: spellDamageProperties(damage),
      },
    };
    inferred.artifacts[sourceArtifact.id] = mergeArtifactLoweringHint(
      inferred.artifacts[sourceArtifact.id],
      {
        provider: "native-active-effect",
        flags: { effectHostHitByAttack: contract },
      },
    );
    inferred.rules[castRule.id] = {
      provider: "arcane-runtime",
      adapter: "effect-host-hit-by-attack-v1",
      phase: "cast",
      sourceArtifactId: sourceArtifact.id,
      replaceSourceArtifactIds: replacementArtifactIds,
    };
    inferred.rules[rootRule.id] = {
      provider: "arcane-runtime",
      adapter: "effect-host-hit-by-attack-v1",
      phase: "retaliation",
      sourceArtifactId: sourceArtifact.id,
    };
    inferred.dedupe[castRule.id] =
      "workflowUuid + sourceActorUuid + sourceArtifactId";
    inferred.dedupe[rootRule.id] =
      "workflowUuid + sourceEffectUuid + effectHostTokenUuid + attackerTokenUuid";
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalTemporaryHitPointsRetaliationHints(
  graph,
  explicit = {},
) {
  const inferred = {
    artifacts: {},
    rules: {},
    dedupe: {},
  };
  const roots = (graph.rules ?? []).filter(current =>
    current.on?.type === "damage-taken"
    && (current.when ?? []).some(predicateValue =>
      predicateValue.type === "temporary-hit-points-from-artifact"
    )
  );
  const pending = roots.filter(current => !explicit.rules?.[current.id]);
  if (pending.length === 0) {
    return mergeInferredLoweringHints(inferred, explicit);
  }
  if (pending.length !== roots.length) {
    throw new Error(
      `${graph.id} temporary-hit-points retaliation cannot mix explicit and inferred lowering`,
    );
  }

  const sourceArtifacts = new Set();
  for (const rootRule of pending) {
    const exists = onePredicate(rootRule, "artifact-exists");
    const attack = onePredicate(rootRule, "attack-kind");
    const temporaryHitPoints = onePredicate(
      rootRule,
      "temporary-hit-points-from-artifact",
    );
    if (
      (rootRule.when ?? []).length !== 3
      || exists.subject !== "effect-target"
      || temporaryHitPoints.subject !== "effect-target"
      || exists.artifactId !== temporaryHitPoints.artifactId
      || attack.value !== "melee"
    ) {
      throw new Error(
        `${rootRule.id} temporary-hit-points retaliation requires the same `
        + "effect-target artifact, its surviving temporary HP, and a melee attack",
      );
    }

    const attacker = oneAttackerBoundTarget(
      rootRule,
      "temporary-hit-points retaliation",
    );
    const damage = oneOperation(rootRule, "damage");
    if (
      (rootRule.do ?? []).length !== 1
      || damage.target !== attacker.id
      || !String(damage.formula ?? "").trim()
      || (damage.damageTypes ?? []).length !== 1
      || ["none", "parent-primary"].includes(damage.damageTypes[0])
      || damage.mitigation === "none"
    ) {
      throw new Error(
        `${rootRule.id} temporary-hit-points retaliation must only deal one `
        + "ordinary single-type damage operation to the event attacker",
      );
    }

    const sourceArtifact = graphArtifact(
      graph,
      exists.artifactId,
      rootRule.id,
    );
    if (
      sourceArtifact.role !== "mechanical"
      || sourceArtifact.identity?.scope !== "source"
    ) {
      throw new Error(
        `${rootRule.id} temporary-hit-points retaliation requires a `
        + "source-scoped mechanical effect",
      );
    }
    if (sourceArtifacts.has(sourceArtifact.id)) {
      throw new Error(
        `${graph.id} defines multiple temporary-hit-points retaliation rules `
        + `for ${sourceArtifact.id}`,
      );
    }
    sourceArtifacts.add(sourceArtifact.id);

    const castRules = (graph.rules ?? []).filter(current =>
      current.on?.type === "action-used"
      && (current.do ?? []).some(operationValue =>
        operationValue.type === "apply-artifact"
        && operationValue.artifactId === sourceArtifact.id
        && operationValue.target === "source"
      )
    );
    if (castRules.length !== 1) {
      throw new Error(
        `${rootRule.id} temporary-hit-points retaliation requires one cast `
        + `rule applying ${sourceArtifact.id} to the source`,
      );
    }
    const castRule = castRules[0];
    if (explicit.rules?.[castRule.id]) {
      throw new Error(
        `${graph.id} temporary-hit-points retaliation cannot explicitly lower `
        + `its cast rule ${castRule.id}`,
      );
    }
    const temporaryHitPointOperations = (castRule.do ?? []).filter(current =>
      (
        current.type === "healing"
        && stableStringify(current.healingTypes) === stableStringify(["temphp"])
      )
      || current.type === "grant-temporary-hp"
    );
    if (
      temporaryHitPointOperations.length !== 1
      || temporaryHitPointOperations[0].target !== "source"
      || stableStringify(operationFormulaContract(temporaryHitPointOperations[0]))
        !== stableStringify(operationFormulaContract(damage))
    ) {
      throw new Error(
        `${castRule.id} temporary-hit-points retaliation requires one source `
        + "temporary-HP operation whose amount matches the retaliation damage",
      );
    }

    const temporaryHitPointOperation = temporaryHitPointOperations[0];
    inferred.artifacts[sourceArtifact.id] = {
      provider: "native-active-effect",
      flags: {
        temporaryHitPointsRetaliation: {
          version: 1,
          runtimeRuleId: rootRule.id,
          sourceArtifactId: sourceArtifact.id,
          attackType: "melee",
          temporaryHitPoints: operationFormulaContract(
            temporaryHitPointOperation,
          ),
          damage: {
            ...operationFormulaContract(damage),
            types: [...damage.damageTypes],
            properties: spellDamageProperties(damage),
          },
        },
      },
    };
    inferred.rules[castRule.id] = {
      provider: "arcane-runtime",
      adapter: "temporary-hit-points-retaliation-v1",
      phase: "cast",
      sourceArtifactId: sourceArtifact.id,
    };
    inferred.rules[rootRule.id] = {
      provider: "arcane-runtime",
      adapter: "temporary-hit-points-retaliation-v1",
      phase: "retaliation",
      sourceArtifactId: sourceArtifact.id,
    };
    inferred.dedupe[castRule.id] =
      "workflowUuid + sourceActorUuid + sourceArtifactId";
    inferred.dedupe[rootRule.id] =
      "workflowUuid + sourceEffectUuid + attackerUuid";
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalSourceTargetDamageMirrorHints(
  graph,
  explicit = {},
) {
  const inferred = {
    artifacts: {},
    rules: {},
    dedupe: {},
  };
  const roots = (graph.rules ?? []).filter(current =>
    current.on?.type === "damage-taken"
    && (current.do ?? []).some(operationValue =>
      operationValue.type === "damage"
      && operationValue.formulaExpression?.type === "actual-damage"
    )
  );
  const pending = roots.filter(current => !explicit.rules?.[current.id]);
  if (pending.length === 0) {
    return mergeInferredLoweringHints(inferred, explicit);
  }
  if (pending.length !== roots.length) {
    throw new Error(
      `${graph.id} source-target damage mirrors cannot mix explicit and inferred lowering`,
    );
  }

  const targetArtifacts = new Set();
  for (const rootRule of pending) {
    const exists = onePredicate(rootRule, "artifact-exists");
    const positiveDamage = onePredicate(rootRule, "damage-applied");
    if (
      (rootRule.when ?? []).length !== 2
      || exists.subject !== "effect-target"
      || positiveDamage.minimum !== 1
    ) {
      throw new Error(
        `${rootRule.id} source-target damage mirror requires one effect-target `
        + "artifact and positive post-mitigation damage",
      );
    }

    const targets = rootRule.targets ?? [];
    const sourceTarget = targets[0];
    if (
      targets.length !== 1
      || sourceTarget?.result !== "source"
      || sourceTarget?.origin?.type !== "artifact"
      || sourceTarget.origin.artifactId !== exists.artifactId
      || sourceTarget.evaluation !== "snapshot"
      || sourceTarget.cardinality?.min !== 1
      || sourceTarget.cardinality?.max !== 1
    ) {
      throw new Error(
        `${rootRule.id} source-target damage mirror requires one source resolved `
        + "from the guarded target artifact",
      );
    }

    const damage = oneOperation(rootRule, "damage");
    if (
      (rootRule.do ?? []).length !== 1
      || damage.target !== sourceTarget.id
      || damage.formula !== "@actualDamage"
      || damage.formulaExpression?.type !== "actual-damage"
      || damage.formulaExpression?.stage !== "post-mitigation"
      || stableStringify(damage.damageTypes) !== stableStringify(["none"])
      || damage.mitigation !== "none"
    ) {
      throw new Error(
        `${rootRule.id} source-target damage mirror must deal the exact `
        + "post-mitigation actualDamage to its source with no second mitigation",
      );
    }

    const targetArtifact = graphArtifact(
      graph,
      exists.artifactId,
      rootRule.id,
    );
    if (
      targetArtifact.role !== "mechanical"
      || targetArtifact.identity?.scope !== "source-target"
    ) {
      throw new Error(
        `${rootRule.id} source-target damage mirror requires a source-target `
        + "mechanical effect",
      );
    }
    if (targetArtifacts.has(targetArtifact.id)) {
      throw new Error(
        `${graph.id} defines multiple source-target damage mirrors for `
        + targetArtifact.id,
      );
    }
    targetArtifacts.add(targetArtifact.id);

    const castRules = (graph.rules ?? []).filter(current =>
      current.on?.type === "action-used"
      && (current.do ?? []).some(operationValue =>
        operationValue.type === "apply-artifact"
        && operationValue.artifactId === targetArtifact.id
        && operationValue.target !== "source"
      )
    );
    if (castRules.length !== 1) {
      throw new Error(
        `${rootRule.id} source-target damage mirror requires one cast rule `
        + `applying ${targetArtifact.id} to its selected target`,
      );
    }
    const castRule = castRules[0];
    if (explicit.rules?.[castRule.id]) {
      throw new Error(
        `${graph.id} source-target damage mirror cannot explicitly lower its `
        + `cast rule ${castRule.id}`,
      );
    }
    const targetApplications = (castRule.do ?? []).filter(current =>
      current.type === "apply-artifact"
      && current.artifactId === targetArtifact.id
    );
    const sourceApplications = (castRule.do ?? []).filter(current =>
      current.type === "apply-artifact"
      && current.target === "source"
      && current.artifactId !== targetArtifact.id
    );
    if (
      targetApplications.length !== 1
      || sourceApplications.length !== 1
    ) {
      throw new Error(
        `${castRule.id} source-target damage mirror requires exactly one target `
        + "endpoint and one source endpoint application",
      );
    }
    const targetApplication = targetApplications[0];
    const castTarget = (castRule.targets ?? []).find(current =>
      current.id === targetApplication.target
    );
    if (
      !castTarget
      || castTarget.result !== "tokens"
      || castTarget.origin?.type !== "selected"
      || castTarget.cardinality?.min !== 1
      || castTarget.cardinality?.max !== 1
    ) {
      throw new Error(
        `${castRule.id} source-target damage mirror requires one selected target`,
      );
    }

    const sourceArtifactId = sourceApplications[0].artifactId;
    const sourceArtifact = graphArtifact(
      graph,
      sourceArtifactId,
      castRule.id,
    );
    if (
      sourceArtifact.role !== "mechanical"
      || sourceArtifact.identity?.scope !== "source"
      || !lifecycleDependencies(targetArtifact.lifecycle).includes(
        sourceArtifactId,
      )
    ) {
      throw new Error(
        `${castRule.id} source-target damage mirror requires a source-scoped `
        + "mechanical endpoint that owns the target endpoint lifecycle",
      );
    }

    const contract = {
      version: 1,
      runtimeRuleId: rootRule.id,
      sourceArtifactId,
      targetArtifactId: targetArtifact.id,
      amount: {
        type: "actual-damage",
        stage: "post-mitigation",
      },
      mitigation: "none",
    };
    inferred.artifacts[sourceArtifactId] = {
      provider: "native-active-effect",
      flags: {
        sourceTargetDamageMirror: {
          ...contract,
          endpoint: "source",
        },
      },
    };
    inferred.artifacts[targetArtifact.id] = {
      provider: "native-active-effect",
      flags: {
        sourceTargetDamageMirror: {
          ...contract,
          endpoint: "target",
        },
      },
    };
    inferred.rules[castRule.id] = {
      provider: "arcane-runtime",
      adapter: "source-target-damage-mirror-v1",
      phase: "bind",
      runtimeRuleId: rootRule.id,
      sourceArtifactId,
      targetArtifactId: targetArtifact.id,
    };
    inferred.rules[rootRule.id] = {
      provider: "arcane-runtime",
      adapter: "source-target-damage-mirror-v1",
      phase: "mirror",
      runtimeRuleId: rootRule.id,
      sourceArtifactId,
      targetArtifactId: targetArtifact.id,
    };
    inferred.dedupe[castRule.id] =
      "workflowUuid + sourceActorUuid + targetActorUuid";
    inferred.dedupe[rootRule.id] =
      "damageEventId + sourceActorUuid + targetActorUuid";
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalHealSourceByDamageFractionHints(graph, explicit = {}) {
  const inferred = {
    artifacts: {},
    rules: {},
    dedupe: {},
  };
  const roots = (graph.rules ?? []).filter(current =>
    current.on?.type === "operation-outcome"
    && current.on?.outcome === "hit"
    && (current.do ?? []).some(operationValue =>
      operationValue.type === "healing"
      && operationValue.formulaExpression?.type === "actual-damage"
      && operationValue.healingFraction !== undefined
    )
  );
  const pending = roots.filter(current => !explicit.rules?.[current.id]);
  if (pending.length === 0) {
    return mergeInferredLoweringHints(inferred, explicit);
  }
  if (pending.length !== roots.length) {
    throw new Error(
      `${graph.id} heal-source damage mirrors cannot mix explicit and inferred lowering`,
    );
  }

  for (const rootRule of pending) {
    const attackOperationId = rootRule.on.operationId;
    const attackOperation = (graph.rules ?? [])
      .flatMap(current => current.do ?? [])
      .find(operationValue =>
        operationValue.id === attackOperationId
        && operationValue.type === "attack-roll"
      );
    if (!attackOperation) {
      throw new Error(
        `${rootRule.id} heal-source damage mirror requires an attack-roll outcome trigger`,
      );
    }
    const attackRule = (graph.rules ?? []).find(current =>
      (current.do ?? []).some(operationValue =>
        operationValue.id === attackOperationId
        && operationValue.type === "attack-roll"
      )
    );
    const nativeDamageOperations = attackRule?.on?.type === "action-used"
      ? (attackRule.do ?? []).filter(operationValue =>
          operationValue.type === "damage"
        )
      : [];
    const outcomeDamageOperations = (graph.rules ?? [])
      .filter(current =>
        current.on?.type === "operation-outcome"
        && current.on.operationId === attackOperationId
        && current.on.outcome === "hit"
      )
      .flatMap(current => current.do ?? [])
      .filter(operationValue => operationValue.type === "damage");
    const damageOperations = [
      ...nativeDamageOperations,
      ...outcomeDamageOperations,
    ];
    if (
      damageOperations.length !== 1
      || damageOperations[0].damageTypes?.length !== 1
    ) {
      throw new Error(
        `${rootRule.id} heal-source damage mirror requires exactly one single-type `
        + "native attack damage or hit-outcome damage operation for the same attack",
      );
    }
    const targets = rootRule.targets ?? [];
    const sourceTarget = targets[0];
    if (
      targets.length !== 1
      || sourceTarget?.result !== "source"
      || sourceTarget?.origin?.type !== "self"
      || sourceTarget?.evaluation !== "snapshot"
      || sourceTarget?.cardinality?.min !== 1
      || sourceTarget?.cardinality?.max !== 1
    ) {
      throw new Error(
        `${rootRule.id} heal-source damage mirror requires one self target`,
      );
    }
    const healing = oneOperation(rootRule, "healing");
    const fraction = Number(rootRule.do[0]?.healingFraction?.value);
    if (
      (rootRule.do ?? []).length !== 1
      || healing.target !== sourceTarget.id
      || healing.formula !== "@actualDamage"
      || healing.formulaExpression?.type !== "actual-damage"
      || healing.formulaExpression?.stage !== "post-mitigation"
      || !Number.isFinite(fraction)
      || fraction <= 0
      || fraction > 1
      || !(healing.healingTypes ?? []).includes("healing")
    ) {
      throw new Error(
        `${rootRule.id} heal-source damage mirror must heal its source by a `
        + "constant fraction of the post-mitigation actualDamage",
      );
    }
    inferred.rules[rootRule.id] = {
      provider: "arcane-runtime",
      adapter: "damage-mirror-heal-source-v1",
      fraction,
      damageType: damageOperations[0].damageTypes[0],
      runtimeRuleId: rootRule.id,
    };
    inferred.dedupe[rootRule.id] =
      "workflowUuid + ruleId + sourceActorUuid";
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalArtifactEndedOutcomeHints(graph, explicit = {}) {
  const inferred = {
    artifacts: {},
    rules: {},
    dedupe: {},
  };
  for (const rootRule of (graph.rules ?? []).filter(current =>
    current.on?.type === "artifact-deleted"
  )) {
    const sourceArtifact = graphArtifact(graph, rootRule.on.artifactId, rootRule.id);
    if (sourceArtifact.kind !== "effect") {
      throw new Error(
        `${rootRule.id} artifact-ended outcome requires an effect artifact trigger`,
      );
    }
    const targets = rootRule.targets ?? [];
    const hostTarget = targets[0];
    if (
      targets.length !== 1
      || hostTarget?.result !== "tokens"
      || hostTarget?.origin?.type !== "event-binding"
      || hostTarget?.origin?.name !== "host"
      || hostTarget?.evaluation !== "snapshot"
      || hostTarget?.cardinality?.min !== 1
      || hostTarget?.cardinality?.max !== 1
    ) {
      throw new Error(
        `${rootRule.id} artifact-ended outcome requires one snapshot `
        + "event-binding host target",
      );
    }
    const applications = (rootRule.do ?? []).filter(current =>
      current.type === "apply-artifact"
    );
    if (
      (rootRule.do ?? []).length !== 1
      || applications.length !== 1
      || applications[0].target !== hostTarget.id
    ) {
      throw new Error(
        `${rootRule.id} artifact-ended outcome must apply one artifact `
        + "to the host target",
      );
    }
    const outcomeArtifact = graphArtifact(graph, applications[0].artifactId, rootRule.id);
    if (outcomeArtifact.kind !== "effect" || outcomeArtifact.id === sourceArtifact.id) {
      throw new Error(
        `${rootRule.id} artifact-ended outcome must apply a different effect artifact`,
      );
    }
    inferred.rules[rootRule.id] = {
      provider: "arcane-runtime",
      adapter: "artifact-ended-outcome-v1",
      sourceArtifactId: sourceArtifact.id,
      outcomeArtifactId: outcomeArtifact.id,
    };
    inferred.dedupe[rootRule.id] = "endedEffectUuid + hostActorUuid";
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalSourceTurnCheckHints(graph, explicit = {}) {
  const inferred = {
    artifacts: {},
    rules: {},
    dedupe: {},
  };
  for (const rootRule of (graph.rules ?? []).filter(current =>
    ["turn-start", "turn-end"].includes(current.on?.type)
    && current.on?.subject === "source"
  )) {
    const guards = rootRule.when ?? [];
    if (
      guards.length !== 1
      || guards[0]?.type !== "artifact-exists"
      || guards[0]?.subject !== "source"
    ) {
      throw new Error(
        `${rootRule.id} source turn check requires exactly one source `
        + "artifact-exists guard",
      );
    }
    const guardArtifact = graphArtifact(graph, guards[0].artifactId, rootRule.id);
    if (
      guardArtifact.kind !== "effect"
      || guardArtifact.identity?.scope !== "source"
    ) {
      throw new Error(
        `${rootRule.id} source turn check guard must be a source-scoped `
        + "effect artifact",
      );
    }
    const targets = rootRule.targets ?? [];
    const eventTargetQuery = targets[0];
    if (
      targets.length !== 1
      || eventTargetQuery?.result !== "tokens"
      || eventTargetQuery?.origin?.type !== "event-binding"
      || eventTargetQuery?.origin?.name !== "target"
      || eventTargetQuery?.evaluation !== "snapshot"
      || eventTargetQuery?.cardinality?.min !== 1
      || eventTargetQuery?.cardinality?.max !== 1
    ) {
      throw new Error(
        `${rootRule.id} source turn check requires one snapshot event target`,
      );
    }
    const checks = (rootRule.do ?? []).filter(current => current.type === "check");
    if (
      (rootRule.do ?? []).length !== 1
      || checks.length !== 1
      || checks[0].target !== eventTargetQuery.id
    ) {
      throw new Error(
        `${rootRule.id} source turn check must run exactly one check operation `
        + "on the event target",
      );
    }
    const checkOperation = checks[0];
    const formula = typeof checkOperation.formula === "string"
      ? checkOperation.formula.trim()
      : checkOperation.formula?.type === "dice"
        ? `${checkOperation.formula.count}d${checkOperation.formula.faces}`
        : "";
    if (!/^\d+d\d+$/.test(formula)) {
      throw new Error(
        `${rootRule.id} source turn check only supports a flat dice formula`,
      );
    }
    const threshold = Number(checkOperation.threshold);
    if (!Number.isFinite(threshold)) {
      throw new Error(`${rootRule.id} source turn check requires a finite threshold`);
    }
    const contract = {
      version: 1,
      runtimeRuleId: rootRule.id,
      phase: rootRule.on.type,
      guardArtifactId: guardArtifact.id,
      formula,
      threshold,
      successChat: String(checkOperation.onSuccess?.chat ?? ""),
      failureChat: String(checkOperation.onFailure?.chat ?? ""),
    };
    inferred.artifacts[guardArtifact.id] = mergeArtifactLoweringHint(
      inferred.artifacts[guardArtifact.id],
      {
        flags: {
          sourceTurnCheck: contract,
        },
      },
    );
    inferred.rules[rootRule.id] = {
      provider: "arcane-runtime",
      adapter: "source-turn-check-v1",
      phase: rootRule.on.type,
      guardArtifactId: guardArtifact.id,
    };
    inferred.dedupe[rootRule.id] = "sourceEffectUuid + combatRound + combatTurn";
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalMarkedTargetParentDamageHints(graph, explicit = {}) {
  const inferred = {
    artifacts: {},
    rules: {},
    dedupe: {},
  };
  const roots = (graph.rules ?? []).filter(current =>
    current.on?.type === "operation-outcome"
    && [
      "external:source-weapon-attack",
      "external:source-attack",
    ].includes(current.on.operationId)
    && current.on.outcome === "hit"
    && (current.when ?? []).some(predicateValue =>
      predicateValue.type === "artifact-source-matches"
      && predicateValue.subject === "attack-target"
    )
  );
  const pending = roots.filter(current => !explicit.rules?.[current.id]);
  if (pending.length === 0) {
    return mergeInferredLoweringHints(inferred, explicit);
  }
  if (roots.length !== 1 || pending.length !== 1) {
    throw new Error(
      `${graph.id} marked-target parent damage requires exactly one source attack-hit rule`,
    );
  }

  const rootRule = pending[0];
  const attack = onePredicate(rootRule, "attack-kind");
  const exists = onePredicate(rootRule, "artifact-exists");
  const sourceMatches = onePredicate(
    rootRule,
    "artifact-source-matches",
    "artifact-source-matches",
  );
  if ((rootRule.when ?? []).length !== 3) {
    throw new Error(
      `${rootRule.id} marked-target parent damage requires only attack-kind, `
      + "artifact-exists, and artifact-source-matches predicates",
    );
  }
  if (
    ![...DECLARED_WEAPON_ATTACK_KINDS, "attack"].includes(attack.value)
    || (
      attack.value === "attack"
      && rootRule.on.operationId !== "external:source-attack"
    )
    || (
      attack.value !== "attack"
      && rootRule.on.operationId !== "external:source-weapon-attack"
    )
  ) {
    throw new Error(
      `${rootRule.id} marked-target parent damage has unsupported attack-kind ${attack.value}`,
    );
  }
  if (
    exists.subject !== "attack-target"
    || sourceMatches.subject !== "attack-target"
    || sourceMatches.source !== "source"
    || sourceMatches.artifactId !== exists.artifactId
  ) {
    throw new Error(
      `${rootRule.id} marked-target parent damage must match the attack target's `
      + "artifact to the attacking source",
    );
  }

  const target = oneEventBoundTarget(rootRule, "marked-target parent damage");
  const damage = oneOperation(rootRule, "damage");
  if ((rootRule.do ?? []).length !== 1 || damage.target !== target.id) {
    throw new Error(
      `${rootRule.id} marked-target parent damage must only damage its event target`,
    );
  }
  if (
    !String(damage.formula ?? "").trim()
    || (damage.damageTypes ?? []).length !== 1
    || damage.rollIntegration !== "parent-damage-roll"
    || damage.critical !== "midi-qol"
  ) {
    throw new Error(
      `${rootRule.id} marked-target damage must use one damage type, join the `
      + "parent damage roll, and delegate critical dice to midi-qol",
    );
  }

  graphArtifact(graph, exists.artifactId, rootRule.id);
  inferred.artifacts[exists.artifactId] = {
    provider: "native-active-effect",
    flags: {
      markedTargetParentDamage: {
        version: 1,
        formula: damage.formula,
        damageType: damage.damageTypes[0],
        attackType: attack.value === "attack" ? "any" : "weapon",
        ...(damage.damageTypes[0] === "parent-primary"
          ? {}
          : { properties: spellDamageProperties(damage) }),
      },
    },
  };
  inferred.rules[rootRule.id] = {
    provider: "arcane-runtime",
    adapter: "marked-target-parent-damage-v1",
    integration: {
      roll: "parent-damage-roll",
      criticalOwner: "midi-qol",
    },
  };
  inferred.dedupe[rootRule.id] =
    "workflowUuid + sourceEffectUuid + targetUuid";
  return mergeInferredLoweringHints(inferred, explicit);
}

function declaredActiveBuffGuard(ruleValue, actionId) {
  const declared = onePredicate(ruleValue, "declared");
  const attack = onePredicate(ruleValue, "attack-kind");
  const ready = onePredicate(ruleValue, "artifact-exists");
  if ((ruleValue.when ?? []).length !== 3) {
    throw new Error(
      `${ruleValue.id} declared active buff requires only declared, attack-kind, `
      + "and artifact-exists predicates",
    );
  }
  if (declared.actionId !== undefined && declared.actionId !== actionId) {
    throw new Error(
      `${ruleValue.id} declared active buff does not reference action ${actionId}`,
    );
  }
  if (!DECLARED_WEAPON_ATTACK_KINDS.has(attack.value)) {
    throw new Error(
      `${ruleValue.id} declared active buff has unsupported attack-kind ${attack.value}`,
    );
  }
  if (ready.subject !== "source") {
    throw new Error(
      `${ruleValue.id} declared active buff ready artifact must be source-scoped`,
    );
  }
  return {
    attackKind: attack.value,
    readyArtifactId: ready.artifactId,
  };
}

function declaredActiveBuffResolution(ruleValue, {
  allowDamage,
} = {}) {
  const deletes = (ruleValue.do ?? []).filter(current =>
    current.type === "delete-artifact"
    && current.target === "source"
  );
  const applications = (ruleValue.do ?? []).filter(current =>
    current.type === "apply-artifact"
    && current.target === "source"
  );
  const damages = (ruleValue.do ?? []).filter(current =>
    current.type === "damage"
  );
  const expectedCount = deletes.length + applications.length + damages.length;
  if (
    deletes.length !== 1
    || applications.length !== 1
    || expectedCount !== (ruleValue.do ?? []).length
    || (!allowDamage && damages.length !== 0)
    || (allowDamage && damages.length > 1)
  ) {
    throw new Error(
      `${ruleValue.id} declared active buff resolution requires one source delete, `
      + `one source apply${allowDamage ? ", and at most one damage" : ""}`,
    );
  }
  return {
    consumedArtifactId: deletes[0].artifactId,
    appliedArtifactId: applications[0].artifactId,
    damage: damages[0] ?? null,
  };
}

function inferCanonicalDeclaredActiveBuffHints(
  graph,
  explicit = {},
  { definitionId = graph.id } = {},
) {
  const inferred = {
    artifacts: {},
    rules: {},
    dedupe: {},
  };
  const actions = (graph.actions ?? []).filter(current =>
    current.delivery === "declared-rider"
  );
  if (actions.length === 0) {
    return mergeInferredLoweringHints(inferred, explicit);
  }
  const configureRules = (graph.rules ?? []).filter(current =>
    current.on?.type === "attack-roll-config"
  );
  const hitRules = (graph.rules ?? []).filter(current =>
    current.on?.type === "operation-outcome"
    && current.on.operationId === "external:triggering-weapon-attack"
    && current.on.outcome === "hit"
  );
  const missRules = (graph.rules ?? []).filter(current =>
    current.on?.type === "operation-outcome"
    && current.on.operationId === "external:triggering-weapon-attack"
    && current.on.outcome === "miss"
  );
  if (configureRules.length === 0 && missRules.length === 0) {
    return mergeInferredLoweringHints(inferred, explicit);
  }
  const topologyRules = [...configureRules, ...hitRules, ...missRules];
  const explicitlyLowered = topologyRules.filter(current =>
    explicit.rules?.[current.id]
  );
  if (explicitlyLowered.length === topologyRules.length) {
    return mergeInferredLoweringHints(inferred, explicit);
  }
  if (explicitlyLowered.length > 0) {
    throw new Error(
      `${graph.id} declared active buff cannot mix explicit and inferred rule lowering`,
    );
  }
  if (
    actions.length !== 1
    || configureRules.length !== 1
    || hitRules.length !== 1
    || missRules.length !== 1
  ) {
    throw new Error(
      `${graph.id} declared active buff requires one declared action and exactly `
      + "one attack-config, hit, and miss rule",
    );
  }

  const actionValue = actions[0];
  const configureRule = configureRules[0];
  const hitRule = hitRules[0];
  const missRule = missRules[0];
  const configureGuard = declaredActiveBuffGuard(
    configureRule,
    actionValue.id,
  );
  const hitGuard = declaredActiveBuffGuard(hitRule, actionValue.id);
  const missGuard = declaredActiveBuffGuard(missRule, actionValue.id);
  if (
    configureGuard.readyArtifactId !== hitGuard.readyArtifactId
    || configureGuard.readyArtifactId !== missGuard.readyArtifactId
    || configureGuard.attackKind !== hitGuard.attackKind
    || configureGuard.attackKind !== missGuard.attackKind
  ) {
    throw new Error(
      `${graph.id} declared active buff phases must share one ready artifact and attack-kind`,
    );
  }

  const advantage = oneOperation(configureRule, "emit-event");
  if (
    (configureRule.do ?? []).length !== 1
    || advantage.target !== "source"
    || advantage.event !== "grant-attack-advantage"
    || advantage.scope !== "triggering-attack"
  ) {
    throw new Error(
      `${configureRule.id} must only grant advantage to the triggering source attack`,
    );
  }
  const hit = declaredActiveBuffResolution(hitRule, { allowDamage: true });
  const miss = declaredActiveBuffResolution(missRule, { allowDamage: false });
  if (
    hit.consumedArtifactId !== configureGuard.readyArtifactId
    || miss.consumedArtifactId !== configureGuard.readyArtifactId
    || hit.appliedArtifactId !== miss.appliedArtifactId
  ) {
    throw new Error(
      `${graph.id} declared active buff hit/miss phases must consume the ready `
      + "artifact and apply the same result artifact",
    );
  }
  graphArtifact(graph, configureGuard.readyArtifactId, configureRule.id);
  graphArtifact(graph, hit.appliedArtifactId, hitRule.id);
  if (hit.damage) {
    const target = oneEventBoundTarget(
      hitRule,
      "declared active buff hit",
    );
    if (
      hit.damage.target !== target.id
      || !String(hit.damage.formula ?? "").trim()
      || (hit.damage.damageTypes ?? []).length !== 1
      || hit.damage.rollIntegration !== "parent-damage-roll"
      || hit.damage.critical !== "midi-qol"
    ) {
      throw new Error(
        `${hitRule.id} damage must target the event hit, join the parent damage `
        + "roll, and delegate critical dice to midi-qol",
      );
    }
  }

  const declaration = {
    actionId: actionValue.id,
    identifier: definitionId,
    resource: "none",
  };
  inferred.rules[configureRule.id] = {
    provider: "arcane-runtime",
    adapter: "declared-active-buff-v1",
    phase: "attack-config",
    declaration,
  };
  inferred.rules[hitRule.id] = {
    provider: "arcane-runtime",
    adapter: "declared-active-buff-v1",
    phase: "resolve-hit",
    declaration,
    integration: {
      roll: "parent-damage-roll",
      criticalOwner: "midi-qol",
    },
  };
  inferred.rules[missRule.id] = {
    provider: "arcane-runtime",
    adapter: "declared-active-buff-v1",
    phase: "resolve-miss",
    declaration,
  };
  inferred.dedupe[configureRule.id] =
    "workflowUuid + sourceEffectUuid + attack-config";
  inferred.dedupe[hitRule.id] =
    "workflowUuid + sourceEffectUuid + hit";
  inferred.dedupe[missRule.id] =
    "workflowUuid + sourceEffectUuid + miss";
  return mergeInferredLoweringHints(inferred, explicit);
}

function sourceAttackProximityContract(graph, ruleValue) {
  const artifactExists = onePredicate(ruleValue, "artifact-exists");
  const withinRangePredicate = onePredicate(ruleValue, "within-range");
  if (
    (ruleValue.when ?? []).length !== 2
    || artifactExists.subject !== "source"
    || withinRangePredicate.from !== "source"
    || !Number.isFinite(Number(withinRangePredicate.distance))
    || Number(withinRangePredicate.distance) < 0
  ) {
    throw new Error(
      `${ruleValue.id} source attack proximity rider requires one source artifact `
      + "and one finite source-relative range",
    );
  }
  const target = oneEventBoundTarget(
    ruleValue,
    "source attack proximity rider",
  );
  const damage = oneOperation(ruleValue, "damage");
  const applies = oneOperation(ruleValue, "apply-artifact");
  if (
    (ruleValue.do ?? []).length !== 2
    || damage.target !== target.id
    || applies.target !== target.id
    || !String(damage.formula ?? "").trim()
    || (damage.damageTypes ?? []).length !== 1
    || damage.damageTypes[0] === "parent-primary"
    || damage.rollIntegration !== "parent-damage-roll"
    || damage.critical !== "midi-qol"
  ) {
    throw new Error(
      `${ruleValue.id} source attack proximity rider must damage and apply one `
      + "effect to the event target through the parent damage roll",
    );
  }
  const sourceArtifact = graphArtifact(
    graph,
    artifactExists.artifactId,
    ruleValue.id,
  );
  if (
    sourceArtifact.identity?.scope !== "source"
    || sourceArtifact.role !== "mechanical"
  ) {
    throw new Error(
      `${ruleValue.id} proximity rider source artifact must be a source-scoped mechanical effect`,
    );
  }
  graphArtifact(graph, applies.artifactId, ruleValue.id);
  return {
    sourceArtifactId: artifactExists.artifactId,
    appliedArtifactId: applies.artifactId,
    damage,
    range: {
      distance: Number(withinRangePredicate.distance),
      units: withinRangePredicate.units,
    },
  };
}

function inferCanonicalSourceAttackProximityRiderHints(
  graph,
  explicit = {},
  { contract } = {},
) {
  const inferred = {
    artifacts: {},
    rules: {},
    dedupe: {},
    representations: {},
  };
  const roots = (graph.rules ?? []).filter(current =>
    current.on?.type === "operation-outcome"
    && current.on.operationId === "external:source-attack"
    && current.on.outcome === "hit"
  );
  const pending = roots.filter(current => !explicit.rules?.[current.id]);
  if (pending.length === 0) {
    return mergeInferredLoweringHints(inferred, explicit);
  }
  if (pending.length !== roots.length) {
    throw new Error(
      `${graph.id} source attack proximity riders cannot mix explicit and inferred lowering`,
    );
  }

  const sourceContracts = new Map();
  for (const rootRule of pending) {
    const current = sourceAttackProximityContract(graph, rootRule);
    if (sourceContracts.has(current.sourceArtifactId)) {
      throw new Error(
        `${graph.id} defines multiple source attack proximity riders for `
        + current.sourceArtifactId,
      );
    }
    sourceContracts.set(current.sourceArtifactId, current);
    const damageType = current.damage.damageTypes[0];
    inferred.artifacts[current.sourceArtifactId] = {
      provider: "native-active-effect",
      flags: {
        damageType,
        sourceAttackProximityRider: {
          version: 1,
          runtimeRuleId: rootRule.id,
          attackType: "any",
          range: current.range,
          damage: {
            formula: current.damage.formula,
            ...(current.damage.formulaExpression
              ? { formulaExpression: clone(current.damage.formulaExpression) }
              : {}),
            ...(current.damage.scaling
              ? { scaling: clone(current.damage.scaling) }
              : {}),
            types: [...current.damage.damageTypes],
            properties: spellDamageProperties(current.damage),
            rollIntegration: "parent-damage-roll",
            criticalOwner: "midi-qol",
          },
          appliedArtifactId: current.appliedArtifactId,
        },
      },
    };
    inferred.rules[rootRule.id] = {
      provider: "arcane-runtime",
      adapter: "source-attack-proximity-rider-v1",
      integration: {
        roll: "parent-damage-roll",
        criticalOwner: "midi-qol",
      },
    };
    inferred.dedupe[rootRule.id] =
      "workflowUuid + sourceEffectUuid + targetUuid";
  }

  const actionsById = new Map(
    (graph.actions ?? []).map(current => [current.id, current]),
  );
  for (const [sourceArtifactId, current] of sourceContracts) {
    const castRules = (graph.rules ?? []).filter(ruleValue =>
      ruleValue.on?.type === "action-used"
      && (ruleValue.do ?? []).some(operationValue =>
        operationValue.type === "apply-artifact"
        && operationValue.artifactId === sourceArtifactId
        && operationValue.target === "source"
      )
    );
    if (castRules.length !== 1) {
      throw new Error(
        `${graph.id} source proximity artifact ${sourceArtifactId} requires one cast rule`,
      );
    }
    const actionId = castRules[0].on.actionId;
    if (!actionsById.has(actionId)) {
      throw new Error(
        `${castRules[0].id} references missing source proximity action ${actionId}`,
      );
    }
    inferred.representations[actionId] = {
      activityFlags: {
        mode: {
          damageType: current.damage.damageTypes[0],
          default: contract?.primaryActionId === actionId,
        },
      },
    };
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalSourceTurnStartProximityEffectHints(
  graph,
  explicit = {},
) {
  const inferred = {
    artifacts: {},
    rules: {},
    dedupe: {},
  };
  const roots = (graph.rules ?? []).filter(current =>
    current.on?.type === "turn-start"
    && current.on.subject === "creature"
    && (current.when ?? []).some(predicateValue =>
      predicateValue.type === "any-artifact-exists"
      && predicateValue.subject === "source"
    )
  );
  const pending = roots.filter(current => !explicit.rules?.[current.id]);
  if (pending.length === 0) {
    return mergeInferredLoweringHints(inferred, explicit);
  }
  if (roots.length !== 1 || pending.length !== 1) {
    throw new Error(
      `${graph.id} source turn-start proximity effect requires exactly one inferred rule`,
    );
  }
  const rootRule = pending[0];
  const sources = onePredicate(rootRule, "any-artifact-exists");
  const opposing = onePredicate(rootRule, "opposing-disposition");
  const withinRangePredicate = onePredicate(rootRule, "within-range");
  onePredicate(rootRule, "visible-to-source");
  if (
    (rootRule.when ?? []).length !== 4
    || opposing.from !== undefined
    || sources.subject !== "source"
    || withinRangePredicate.from !== "source"
    || !Number.isFinite(Number(withinRangePredicate.distance))
    || Number(withinRangePredicate.distance) < 0
  ) {
    throw new Error(
      `${rootRule.id} turn-start proximity effect requires source artifacts, `
      + "opposing disposition, finite source-relative range, and source visibility",
    );
  }
  const sourceArtifactIds = [...(sources.artifactIds ?? [])];
  if (
    sourceArtifactIds.length === 0
    || new Set(sourceArtifactIds).size !== sourceArtifactIds.length
  ) {
    throw new Error(
      `${rootRule.id} turn-start proximity effect requires unique source artifacts`,
    );
  }
  const target = oneEventBoundTarget(
    rootRule,
    "source turn-start proximity effect",
  );
  const applies = oneOperation(rootRule, "apply-artifact");
  if (
    (rootRule.do ?? []).length !== 1
    || applies.target !== target.id
  ) {
    throw new Error(
      `${rootRule.id} turn-start proximity effect must only apply one effect to the event target`,
    );
  }
  graphArtifact(graph, applies.artifactId, rootRule.id);
  const range = {
    distance: Number(withinRangePredicate.distance),
    units: withinRangePredicate.units,
  };
  for (const artifactId of sourceArtifactIds) {
    const sourceArtifact = graphArtifact(graph, artifactId, rootRule.id);
    if (
      sourceArtifact.identity?.scope !== "source"
      || sourceArtifact.role !== "mechanical"
    ) {
      throw new Error(
        `${rootRule.id} turn-start source ${artifactId} must be a source-scoped mechanical effect`,
      );
    }
    inferred.artifacts[artifactId] = {
      provider: "native-active-effect",
      flags: {
        sourceTurnStartProximityEffect: {
          version: 1,
          runtimeRuleId: rootRule.id,
          subject: "creature",
          range,
          targetPolicy: {
            opposing: true,
            visibleToSource: true,
          },
          appliedArtifactId: applies.artifactId,
        },
      },
    };
  }
  inferred.rules[rootRule.id] = {
    provider: "arcane-runtime",
    adapter: "source-turn-start-proximity-effect-v1",
  };
  inferred.dedupe[rootRule.id] =
    "sourceEffectUuid + targetUuid + combatRound + combatTurn";
  return mergeInferredLoweringHints(inferred, explicit);
}

function canonicalDeclaredRiderEffectIds(graph, rootRule) {
  const operations = rootRule.do ?? [];
  const saveOperations = operations.filter(current =>
    current.type === "saving-throw"
  );
  const directApplications = operations.filter(current =>
    current.type === "apply-artifact"
  );
  if (saveOperations.length > 1) {
    throw new Error(
      `${rootRule.id} declared weapon rider supports at most one saving throw`,
    );
  }
  if (directApplications.length > 1) {
    throw new Error(
      `${rootRule.id} declared weapon rider supports at most one direct effect`,
    );
  }
  if (saveOperations.length === 0) {
    return directApplications.map(current => current.artifactId);
  }
  if (directApplications.length > 0) {
    throw new Error(
      `${rootRule.id} declared weapon rider cannot mix a direct effect with a save-gated effect`,
    );
  }

  const save = saveOperations[0];
  const outcomes = (graph.rules ?? []).filter(current =>
    current.on?.type === "operation-outcome"
    && current.on.operationId === save.id
  );
  const failureRules = outcomes.filter(current =>
    current.on.outcome === "failure"
  );
  const successRules = outcomes.filter(current =>
    current.on.outcome === "success"
  );
  if (
    failureRules.length === 0
    && successRules.length === 0
    && directApplications.length === 0
  ) {
    return [];
  }
  if (failureRules.length !== 1 || successRules.length !== 0) {
    throw new Error(
      `${rootRule.id} declared weapon rider save requires exactly one failure effect rule and no success rule`,
    );
  }
  const failureRule = failureRules[0];
  const applications = (failureRule.do ?? []).filter(current =>
    current.type === "apply-artifact"
  );
  if (
    applications.length !== 1
    || (failureRule.do ?? []).length !== 1
    || (failureRule.targets ?? []).length !== 1
    || failureRule.targets[0]?.origin?.type !== "event-binding"
    || failureRule.targets[0]?.origin?.name !== "target"
  ) {
    throw new Error(
      `${failureRule.id} declared weapon rider save failure must only apply one effect to the event target`,
    );
  }
  return [applications[0].artifactId];
}

function inferCanonicalDeclaredWeaponSpellRiderHints(graph, explicit = {}) {
  const inferred = {
    artifacts: {},
    rules: {},
  };
  const actions = (graph.actions ?? []).filter(current =>
    current.delivery === "declared-rider"
  );
  const roots = (graph.rules ?? []).filter(current =>
    current.on?.type === "operation-outcome"
    && current.on.operationId === "external:triggering-weapon-attack"
    && current.on.outcome === "hit"
  );
  if (
    actions.length === 0
    || (
      roots.length > 0
      && roots.every(current => explicit.rules?.[current.id])
    )
  ) {
    return mergeInferredLoweringHints(inferred, explicit);
  }
  if (actions.length !== 1 || roots.length !== 1) {
    throw new Error(
      `${graph.id} inferred declared weapon rider requires exactly one declared action and one external weapon-hit rule`,
    );
  }

  const actionValue = actions[0];
  const rootRule = roots[0];
  if (explicit.rules?.[rootRule.id]) {
    return mergeInferredLoweringHints(inferred, explicit);
  }
  const predicates = rootRule.when ?? [];
  const declaredPredicates = predicates.filter(current =>
    current.type === "declared"
  );
  const attackPredicates = predicates.filter(current =>
    current.type === "attack-kind"
  );
  if (
    predicates.length !== 2
    || declaredPredicates.length !== 1
    || attackPredicates.length !== 1
  ) {
    throw new Error(
      `${rootRule.id} declared weapon rider requires exactly declared and attack-kind predicates`,
    );
  }
  if (
    declaredPredicates[0].actionId !== undefined
    && declaredPredicates[0].actionId !== actionValue.id
  ) {
    throw new Error(
      `${rootRule.id} declared predicate does not reference action ${actionValue.id}`,
    );
  }
  if (!DECLARED_WEAPON_ATTACK_KINDS.has(attackPredicates[0].value)) {
    throw new Error(
      `${rootRule.id} declared weapon rider has unsupported attack-kind ${attackPredicates[0].value}`,
    );
  }

  const targets = rootRule.targets ?? [];
  const riderTarget = targets[0];
  const eventBoundTarget =
    riderTarget?.result === "tokens"
    && riderTarget?.origin?.type === "event-binding"
    && riderTarget?.origin?.name === "target"
    && riderTarget?.cardinality?.min === 1
    && riderTarget?.cardinality?.max === 1;
  const eventNeighborhoodTarget =
    riderTarget?.result === "tokens"
    && riderTarget?.origin?.type === "event-neighborhood"
    && riderTarget?.origin?.anchor === "target"
    && riderTarget?.origin?.units === "ft"
    && Number(riderTarget?.origin?.radius) > 0;
  if (
    targets.length !== 1
    || (!eventBoundTarget && !eventNeighborhoodTarget)
  ) {
    throw new Error(
      `${rootRule.id} declared weapon rider requires one event-bound hit target `
      + "or one target-anchored event neighborhood",
    );
  }

  const operations = rootRule.do ?? [];
  const consumes = operations.filter(current =>
    current.type === "consume-resource"
  );
  const damages = operations.filter(current => current.type === "damage");
  const saves = operations.filter(current => current.type === "saving-throw");
  const directApplications = operations.filter(current =>
    current.type === "apply-artifact"
  );
  const supportedOperationCount =
    consumes.length + damages.length + saves.length + directApplications.length;
  if (
    consumes.length !== 1
    || consumes[0].resource !== "spell-slot"
    || consumes[0].timing !== "on-hit"
  ) {
    throw new Error(
      `${rootRule.id} declared weapon rider requires exactly one on-hit spell-slot consumption`,
    );
  }
  if (
    damages.length > 1
    || damages.some(current =>
      !String(current.formula ?? "").trim()
      || (current.damageTypes ?? []).length !== 1
      || current.target !== riderTarget.id
    )
    || (damages.length === 0 && saves.length === 0 && directApplications.length === 0)
  ) {
    throw new Error(
      `${rootRule.id} declared weapon rider supports at most one single-type damage `
      + "operation and requires damage, a save, or a direct effect",
    );
  }
  if (
    saves.length > 1
    || saves.some(current => current.target !== targets[0].id)
    || directApplications.some(current => current.target !== targets[0].id)
    || supportedOperationCount !== operations.length
  ) {
    throw new Error(
      `${rootRule.id} declared weapon rider contains unsupported or mis-targeted operations`,
    );
  }

  const effectIds = canonicalDeclaredRiderEffectIds(graph, rootRule);
  for (const artifactId of effectIds) {
    const artifactValue = (graph.artifacts ?? []).find(current =>
      current.id === artifactId
    );
    if (!artifactValue || artifactValue.kind !== "effect") {
      throw new Error(
        `${rootRule.id} declared weapon rider references missing effect ${artifactId}`,
      );
    }
    inferred.artifacts[artifactId] = mergeArtifactLoweringHint(
      inferred.artifacts[artifactId],
      {
        provider: "native-active-effect",
        flags: {
          declaredWeaponSpellRider: true,
          riderIdentifier: graph.id,
        },
      },
    );
  }
  inferred.rules[rootRule.id] = {
    provider: "arcane-runtime",
    adapter: "declared-weapon-spell-rider-v1",
    resolution: eventNeighborhoodTarget
      ? "post-hit-activity"
      : "parent-damage-roll",
  };
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalWeaponEnchantmentHints(
  graph,
  explicit = {},
  { contract } = {},
) {
  const inferred = {
    artifacts: {},
    rules: {},
    identity: {},
    dedupe: {},
  };
  const enchantments = (graph.artifacts ?? []).filter(current =>
    current.kind === "enchantment"
  );
  if (enchantments.length === 0) {
    return mergeInferredLoweringHints(inferred, explicit);
  }

  const actions = new Map(
    (graph.actions ?? []).map(current => [current.id, current]),
  );
  for (const enchantment of enchantments) {
    const creators = (graph.rules ?? []).flatMap(currentRule =>
      (currentRule.do ?? [])
        .filter(currentOperation =>
          currentOperation.type === "create-artifact"
          && currentOperation.artifactId === enchantment.id
        )
        .map(currentOperation => ({ currentRule, currentOperation }))
    );
    if (creators.length !== 1) {
      throw new Error(
        `${graph.id} enchantment ${enchantment.id} requires exactly one creator`,
      );
    }
    const { currentRule, currentOperation } = creators[0];
    const actionValue = actions.get(currentRule.on?.actionId);
    const targets = currentRule.targets ?? [];
    const sourceTarget = targets.find(current =>
      current.result === "source"
      && current.origin?.type === "self"
    );
    const itemTarget = targets.find(current =>
      current.id === currentOperation.target
    );
    const operations = currentRule.do ?? [];
    const consumes = operations.filter(current =>
      current.type === "consume-resource"
    );
    const castLevelExpressions = [
      enchantment.state?.attackAndDamageBonus,
      enchantment.state?.attackBonus,
      enchantment.state?.hitDamageRider?.value,
    ].filter(Boolean);
    const invalidCastLevelExpression = castLevelExpressions.find(expression =>
      expression?.type !== "tiers"
      || expression.selector?.type !== "cast-level"
      || !(expression.entries ?? []).length
    );
    const substantiveState = [
      enchantment.state?.attackAndDamageBonus,
      enchantment.state?.attackBonus,
      enchantment.state?.hitDamageRider,
      enchantment.state?.baseDamageDie,
      enchantment.state?.spellcastingAttack === true ? true : null,
    ].filter(Boolean);
    const creator = operations.filter(current =>
      current.type === "create-artifact"
      && current.artifactId === enchantment.id
    );
    const sourceApplications = operations.filter(current =>
      current.type === "apply-artifact"
      && current.target === "source"
    );
    const unsupportedOperations = operations.filter(current =>
      !["consume-resource", "create-artifact", "apply-artifact"].includes(
        current.type,
      )
    );
    const spellLevel = Math.max(0, Number(contract?.level ?? 0) || 0);
    if (
      currentRule.on?.type !== "action-used"
      || !actionValue
      || actionValue.delivery !== "standalone"
      || actionValue.visibility !== "public"
      || sourceTarget?.result !== "source"
      || sourceTarget?.origin?.type !== "self"
      || sourceTarget?.cardinality?.min !== 1
      || sourceTarget?.cardinality?.max !== 1
      || itemTarget?.result !== "items"
      || itemTarget?.origin?.type !== "actor-items"
      || itemTarget.origin.actor !== "source"
      || itemTarget.evaluation !== "snapshot"
      || itemTarget.cardinality?.min !== 1
      || itemTarget.cardinality?.max !== 1
      || itemTarget.selection?.type !== "first-stable"
      || (itemTarget.selection?.order ?? []).join(",") !== "sort,name,id"
      || creator.length !== 1
      || unsupportedOperations.length > 0
      || consumes.length !== (spellLevel > 0 ? 1 : 0)
      || consumes.some(current =>
        current.resource !== "spell-slot"
        || current.timing !== "on-use"
      )
      || enchantment.host !== "item"
      || enchantment.identity?.scope !== "source-item"
      || enchantment.reapply !== "replace"
      || enchantment.lifecycle?.type !== "while-artifact"
      || enchantment.state?.magical !== true
      || substantiveState.length === 0
      || invalidCastLevelExpression
    ) {
      throw new Error(
        `${graph.id} enchantment ${enchantment.id} does not match the closed `
        + "source-owned weapon enchantment contract",
      );
    }
    const predicateMap = new Map(
      (itemTarget.predicates ?? []).map(current => [current.type, current]),
    );
    const allowedItemPredicates = new Set([
      "item-type",
      "item-equipped",
      "item-magical",
      "item-attack-range",
      "item-base-item-in",
    ]);
    if (
      predicateMap.get("item-type")?.value !== "weapon"
      || predicateMap.get("item-equipped")?.value !== true
      || (itemTarget.predicates ?? []).some(current =>
        !allowedItemPredicates.has(current.type)
      )
    ) {
      throw new Error(
        `${graph.id} enchantment ${enchantment.id} requires one supported `
        + "equipped weapon query selected from the source inventory",
      );
    }
    const lifecycleArtifact = (graph.artifacts ?? []).find(current =>
      current.id === enchantment.lifecycle.artifactId
    );
    if (
      !lifecycleArtifact
      || lifecycleArtifact.kind !== "effect"
      || lifecycleArtifact.host !== "actor"
      || lifecycleArtifact.identity?.scope !== "source"
    ) {
      throw new Error(
        `${graph.id} enchantment ${enchantment.id} requires a source-owned `
        + "actor effect lifecycle",
      );
    }
    if (
      lifecycleArtifact.id !== "concentration"
      && !sourceApplications.some(current =>
        current.artifactId === lifecycleArtifact.id
      )
    ) {
      throw new Error(
        `${graph.id} enchantment ${enchantment.id} must create its non-concentration `
        + "source lifecycle artifact in the same cast",
      );
    }
    const profileSelections = [];
    const damageType = enchantment.state?.hitDamageRider?.damageType;
    if (
      damageType?.type === "action-parameter"
    ) {
      const parameter = (actionValue.parameters ?? []).find(current =>
        current.id === damageType.id
        && current.type === "enum"
        && current.lowering === "runtime-required"
      );
      if (!parameter || !(parameter.values ?? []).length) {
        throw new Error(
          `${graph.id} enchantment ${enchantment.id} references missing runtime `
          + `selection ${damageType.id}`,
        );
      }
      profileSelections.push({
        id: parameter.id,
        values: [...parameter.values],
      });
    }
    if (explicit.rules?.[currentRule.id]) {
      throw new Error(
        `${graph.id} weapon enchantment lowering is compiler-owned and cannot be overridden`,
      );
    }
    inferred.artifacts[enchantment.id] = {
      provider: "arcane-runtime",
    };
    inferred.rules[currentRule.id] = {
      provider: "arcane-runtime",
      adapter: "weapon-enchantment-v1",
      phase: "cast-lifecycle",
      activityIdentifier: `arcane-enchant-${enchantment.id}`,
      activityName: `${enchantment.state?.name ?? actionValue.name}: Enchantment`,
      activityType: "enchant",
      artifactId: enchantment.id,
      lifecycleArtifactId: enchantment.lifecycle.artifactId,
      allowMagical: predicateMap.get("item-magical")?.value !== false,
      profileSelections,
    };
    inferred.identity[currentRule.id] =
      "workflowUuid + sourceUuid + itemUuid";
    inferred.dedupe[currentRule.id] =
      "workflowUuid + sourceUuid + itemUuid";
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function inferCanonicalOwnedWeaponAttackHints(graph, explicit = {}) {
  const inferred = {
    artifacts: {},
    rules: {},
    identity: {},
    dedupe: {},
  };
  const operations = new Map();
  for (const currentRule of graph.rules ?? []) {
    for (const currentOperation of currentRule.do ?? []) {
      if (currentOperation.id) {
        operations.set(currentOperation.id, {
          rule: currentRule,
          operation: currentOperation,
        });
      }
    }
  }

  for (const { rule: rootRule, operation: weaponAttack } of operations.values()) {
    if (weaponAttack.type !== "weapon-attack") continue;
    const weaponTarget = (rootRule.targets ?? []).find(current =>
      current.id === weaponAttack.weapon
    );
    const creatureTarget = (rootRule.targets ?? []).find(current =>
      current.id === weaponAttack.target
    );
    const predicateMap = new Map(
      (weaponTarget?.predicates ?? []).map(current => [
        current.type,
        current,
      ]),
    );
    if (
      rootRule.on?.type !== "action-used"
      || weaponTarget?.result !== "items"
      || weaponTarget?.origin?.type !== "actor-items"
      || weaponTarget?.selection?.type !== "first-stable"
      || (weaponTarget?.selection?.order ?? []).join(",") !== "sort,name,id"
      || predicateMap.get("item-type")?.value !== "weapon"
      || predicateMap.get("item-equipped")?.value !== true
      || predicateMap.get("item-attack-range")?.value !== "melee"
      || creatureTarget?.origin?.type !== "selected"
      || creatureTarget?.cardinality?.min !== 1
      || creatureTarget?.cardinality?.max !== 1
    ) {
      throw new Error(
        `${rootRule.id} does not match the closed owned melee weapon attack contract`,
      );
    }
    if (explicit.rules?.[rootRule.id]) {
      throw new Error(
        `${graph.id} owned weapon attack lowering is compiler-owned and cannot be overridden`,
      );
    }
    inferred.rules[rootRule.id] = {
      provider: "arcane-runtime",
      adapter: "owned-weapon-attack-v1",
      phase: "cast",
      weaponOperationId: weaponAttack.id,
      weaponTargetId: weaponAttack.weapon,
      creatureTargetId: weaponAttack.target,
    };
    inferred.identity[rootRule.id] =
      "workflowUuid + sourceUuid + targetUuid + weaponUuid";
    inferred.dedupe[rootRule.id] =
      "workflowUuid + sourceUuid + targetUuid + weaponUuid";

    const outcomeRules = (graph.rules ?? []).filter(current =>
      current.on?.type === "operation-outcome"
      && current.on.operationId === weaponAttack.id
    );
    for (const outcomeRule of outcomeRules) {
      if (!["hit", "miss"].includes(outcomeRule.on.outcome)) {
        throw new Error(
          `${outcomeRule.id} owned weapon outcome must be hit or miss`,
        );
      }
      if (explicit.rules?.[outcomeRule.id]) {
        throw new Error(
          `${graph.id} owned weapon outcome lowering is compiler-owned and cannot be overridden`,
        );
      }
      inferred.rules[outcomeRule.id] = {
        provider: "arcane-runtime",
        adapter: "owned-weapon-attack-v1",
        phase: outcomeRule.on.outcome,
        parentOperationId: weaponAttack.id,
      };
      inferred.identity[outcomeRule.id] =
        "childWorkflowUuid + sourceUuid + targetUuid";
      inferred.dedupe[outcomeRule.id] =
        "childWorkflowUuid + sourceUuid + targetUuid";
    }
  }
  return mergeInferredLoweringHints(inferred, explicit);
}

function activeAurasLink(ruleValue, graph, hints) {
  if (!["enter", "leave"].includes(ruleValue.on?.type)) return false;
  const zoneId = ruleValue.on?.zoneId;
  const zone = (graph.artifacts ?? []).find(value =>
    value.id === zoneId
    && value.kind === "zone"
    && artifactProvider(value, hints) === "active-auras"
  );
  if (!zone) return false;
  return (ruleValue.do ?? []).every(value => {
    if (!["create-artifact", "apply-artifact", "delete-artifact"].includes(value.type)) {
      return false;
    }
    const affected = (graph.artifacts ?? []).find(candidate => candidate.id === value.artifactId);
    return affected && artifactProvider(affected, hints) === "active-auras";
  });
}

function connectedRules(graph, rootRule) {
  const result = [rootRule];
  const operationIds = new Set((rootRule.do ?? []).map(value => value.id).filter(Boolean));
  let changed = true;
  while (changed) {
    changed = false;
    for (const currentRule of graph.rules ?? []) {
      if (
        ["operation-outcome", "operation-complete"].includes(
          currentRule.on?.type,
        )
        && operationIds.has(currentRule.on.operationId)
        && !result.some(existing => existing.id === currentRule.id)
      ) {
        result.push(currentRule);
        for (const currentOperation of currentRule.do ?? []) {
          if (currentOperation.id) operationIds.add(currentOperation.id);
        }
        changed = true;
      }
    }
  }
  return result;
}

function connectedActivityRules(graph, rootRule, hints) {
  const result = [rootRule];
  const operationIds = new Set((rootRule.do ?? []).map(value => value.id).filter(Boolean));
  let changed = true;
  while (changed) {
    changed = false;
    for (const currentRule of graph.rules ?? []) {
      if (
        currentRule.on?.type !== "operation-outcome"
        || !operationIds.has(currentRule.on.operationId)
        || result.some(existing => existing.id === currentRule.id)
        || !["dnd5e-midi-native", "native-active-effect"].includes(
          ruleProvider(currentRule, graph, hints),
        )
      ) {
        continue;
      }
      result.push(currentRule);
      for (const currentOperation of currentRule.do ?? []) {
        if (currentOperation.id) operationIds.add(currentOperation.id);
      }
      changed = true;
    }
  }
  return result;
}

function sourceActionIdForRule(ruleValue, graph, seen = new Set()) {
  if (!ruleValue || seen.has(ruleValue.id)) return null;
  seen.add(ruleValue.id);
  if (ruleValue.on?.type === "action-used") return ruleValue.on.actionId ?? null;
  if (!["operation-outcome", "operation-complete"].includes(
    ruleValue.on?.type,
  )) return null;
  const operationId = ruleValue.on.operationId;
  if (!operationId || String(operationId).startsWith("external:")) return null;
  const parentRule = (graph.rules ?? []).find(candidate =>
    (candidate.do ?? []).some(currentOperation => currentOperation.id === operationId)
  );
  return sourceActionIdForRule(parentRule, graph, seen);
}

function operationProjection(currentOperation, currentRule = null) {
  const projected = clone(currentOperation);
  delete projected.primitive;
  if (currentRule?.on?.type === "operation-outcome") {
    projected.conditionalOutcome = {
      operationId: currentRule.on.operationId,
      outcome: currentRule.on.outcome,
    };
  }
  return compactObject(projected);
}

function targetProjection(currentTarget) {
  if (!currentTarget) return null;
  const range = withinRange(currentTarget);
  return compactObject({
    result: currentTarget.result,
    origin: clone(currentTarget.origin),
    evaluation: currentTarget.evaluation,
    cardinality: clone(currentTarget.cardinality),
    selection: clone(currentTarget.selection),
    range: range ? {
      value: range.distance,
      units: range.units,
      from: range.from,
    } : undefined,
    targetKind: targetKind(currentTarget),
    disposition: (currentTarget.predicates ?? []).find(value => value.type === "disposition")?.value,
    predicates: clone(currentTarget.predicates ?? []),
  });
}

function defaultTargetSelectionProjection(value) {
  if (!value) return null;
  const projected = clone(value);
  delete projected.primitive;
  delete projected.type;
  return compactObject(projected);
}

function runtimeTargetProjection(currentTarget) {
  return compactObject({
    semanticId: currentTarget?.id,
    ...targetProjection(currentTarget),
  });
}

function actionActivityType(operations, delivery) {
  if (delivery === "declared-rider") return "declared-rider";
  if (operations.some(value =>
    value.type === "healing" || value.type === "grant-temporary-hp"
  )) return "heal";
  if (operations.some(value => value.type === "saving-throw")) return "save";
  if (operations.some(value => value.type === "attack-roll")) return "attack";
  if (operations.some(value => value.type === "damage")) return "damage";
  return "utility";
}

function uniqueByHash(values) {
  const seen = new Set();
  return values.filter(value => {
    const hash = semanticHash(value);
    if (seen.has(hash)) return false;
    seen.add(hash);
    return true;
  });
}

function parameterKeysUsed(value, bindings) {
  const encoded = JSON.stringify(value);
  return Object.keys(bindings ?? {}).filter(key => encoded.includes(`$parameter.${key}`));
}

function projectedArtifact(currentArtifact, hints, {
  semanticId = currentArtifact.id,
  sourceSemanticId = currentArtifact.id,
} = {}) {
  return compactObject({
    semanticId,
    sourceSemanticId,
    kind: currentArtifact.kind,
    role: currentArtifact.role,
    host: currentArtifact.host,
    identity: clone(currentArtifact.identity),
    reapply: currentArtifact.reapply,
    state: clone(currentArtifact.state),
    lifecycle: clone(currentArtifact.lifecycle),
    provider: artifactProvider(currentArtifact, hints),
    adapter: artifactAdapter(currentArtifact, hints),
  });
}

function runtimeOperationProjection(currentOperation, currentRule, adapter) {
  const projected = operationProjection(currentOperation);
  const adapterName = typeof adapter === "string"
    ? adapter
    : adapter?.adapter;
  if (
    projected.type === "damage"
    && [
      "declared-active-buff-v1",
      "source-attack-proximity-rider-v1",
    ].includes(adapterName)
  ) {
    projected.properties = spellDamageProperties(projected);
  }
  return projected;
}

function projectedRuntimeRule(currentRule, graph, hints) {
  const provider = ruleProvider(currentRule, graph, hints);
  const explicitAdapter = loweringAdapter(hints?.rules?.[currentRule.id]);
  const inferredAdapter = explicitAdapter ? null : inferredRuleAdapter(currentRule);
  const adapter = ruleAdapter(currentRule, hints);
  const adapterName = typeof adapter === "string"
    ? adapter
    : adapter?.adapter;
  const runtimeOwnedIds = runtimeOwnedOperationIds(currentRule);
  const operations = inferredAdapter?.adapter === "target-status-removal-v1"
    ? (currentRule.do ?? []).filter(current => current.type === "remove-statuses")
    : inferredAdapter?.adapter === "linked-operation-results-v1"
      ? (currentRule.do ?? []).filter(current => runtimeOwnedIds.has(current.id))
      : inferredAdapter?.adapter === "hit-point-pool-allocator-v1"
        ? (currentRule.do ?? []).filter(current =>
            current.type === "allocate-hit-point-pool"
          )
      : (currentRule.do ?? []);
  return compactObject({
    id: currentRule.id,
    sourceActionId: sourceActionIdForRule(currentRule, graph),
    trigger: currentRule.on?.type,
    on: clone(currentRule.on),
    when: clone(currentRule.when ?? []),
    targets: (currentRule.targets ?? []).map(current =>
      [
        "linked-operation-results-v1",
        "hit-point-pool-allocator-v1",
        "weapon-enchantment-v1",
        "owned-weapon-attack-v1",
        "reversible-hit-point-capacity-v1",
        "required-selection-outcome-v1",
        "status-effect-suppression-v1",
        "workflow-outcome-forced-movement-v1",
      ].includes(adapterName ?? inferredAdapter?.adapter)
        ? runtimeTargetProjection(current)
        : targetProjection(current)
    ),
    operations: operations.map(current =>
      runtimeOperationProjection(current, currentRule, adapter)
    ),
    provider,
    identity: hints?.identity?.[currentRule.id] ?? null,
    dedupe: hints?.dedupe?.[currentRule.id] ?? null,
    adapter,
  });
}

function projectedInternalAction(runtimeRule, graph, hints) {
  const identifier = runtimeRule.adapter?.activityIdentifier;
  if (!identifier) return null;
  const adapterName = runtimeRule.adapter?.adapter;
  let operations = adapterName === "weapon-enchantment-v1"
    ? (runtimeRule.operations ?? []).filter(current =>
        current.type === "create-artifact"
        && current.artifactId === runtimeRule.adapter?.artifactId
      )
    : clone(runtimeRule.operations ?? []);
  let activityRules = [];
  if (runtimeRule.adapter?.includeNativeOutcomeOperations === true) {
    const sourceRule = (graph.rules ?? []).find(current =>
      current.id === runtimeRule.id
    );
    if (!sourceRule) {
      throw new Error(
        `${runtimeRule.id} cannot materialize its internal activity source rule`,
      );
    }
    activityRules = connectedActivityRules(graph, sourceRule, hints);
    operations = activityRules
      .flatMap(currentRule => (currentRule.do ?? [])
        .filter(currentOperation =>
          operationRunsInActivity(currentOperation, currentRule)
        )
        .map(currentOperation =>
          operationProjection(currentOperation, currentRule)
        )
      );
  }
  const operationTarget = operations.find(current => current.target)?.target;
  const target = (
    runtimeRule.targets ?? []
  ).find(current => current.semanticId === operationTarget)
    ?? runtimeRule.targets?.[0]
    ?? null;
  return compactObject({
    semanticId: `runtime:${identifier}`,
    sourceRuleId: runtimeRule.id,
    sourceRuleIds: [...new Set([
      ...(activityRules.length > 0
        ? activityRules.map(current => current.id)
        : [runtimeRule.id]),
      ...(runtimeRule.adapter?.representedRuleIds ?? []),
    ])].sort(),
    name: runtimeRule.adapter?.activityName ?? runtimeRule.id,
    delivery: "internal",
    visibility: "automation-only",
    activation: { type: "none", cost: 0 },
    input: target ? deriveInput(target, "standalone") : "event-binding",
    activityType:
      runtimeRule.adapter?.activityType
      ?? actionActivityType(operations, "standalone"),
    target,
    operations,
    interaction: clone(runtimeRule.adapter?.interaction),
    representation: clone(runtimeRule.adapter?.representation),
    availability: [],
    providers: [runtimeRule.provider],
    adapter: clone(runtimeRule.adapter),
  });
}

function projectedDeclaredRiderSaveAction({
  graphId,
  actionValue,
  expandedActionId,
  rules,
  operations,
  fallbackTarget,
}) {
  if (actionValue.delivery !== "declared-rider") return null;
  const saves = operations.filter(current => current.type === "saving-throw");
  if (saves.length === 0) return null;
  if (saves.length > 1) {
    throw new Error(
      `${graphId} declared rider ${expandedActionId} has ${saves.length} saving throws; `
      + "split them into separate declared actions before lowering",
    );
  }

  const save = saves[0];
  const conditionalOperations = operations.filter(current =>
    current.conditionalOutcome?.operationId === save.id
  );
  const unsupported = conditionalOperations.filter(current =>
    !["create-artifact", "apply-artifact"].includes(current.type)
  );
  if (unsupported.length > 0) {
    throw new Error(
      `${graphId} declared rider save ${save.id} has unsupported follow-up operations: `
      + unsupported.map(current => current.type).join(", "),
    );
  }

  const sourceRule = rules.find(current =>
    (current.do ?? []).some(currentOperation => currentOperation.id === save.id)
  );
  const target = (rules.flatMap(current => current.targets ?? [])
    .find(current => current.id === save.target)) ?? fallbackTarget;
  const neighborhoodDamageOperations =
    target?.origin?.type === "event-neighborhood"
      ? operations.filter(current =>
          current.type === "damage"
          && current.target === save.target
          && current.rollIntegration !== "parent-damage-roll"
        )
      : [];
  const hasExpandedActionId = expandedActionId !== actionValue.id;
  const identifier = hasExpandedActionId
    ? `${graphId}-${slug(expandedActionId)}RiderSave`
    : `${graphId}RiderSave`;
  const name = `${actionValue.name}: Rider Save`;
  const followUpOperations = [
    save,
    ...neighborhoodDamageOperations,
    ...conditionalOperations,
  ];

  return compactObject({
    semanticId: `runtime:${identifier}`,
    sourceRuleId: sourceRule?.id ?? expandedActionId,
    name,
    delivery: "internal",
    visibility: "automation-only",
    activation: { type: "none", cost: 0 },
    input: "event-binding",
    activityType: "save",
    target: targetProjection(target),
    operations: clone(followUpOperations),
    availability: [],
    providers: [
      "dnd5e-midi-native",
      ...(conditionalOperations.length > 0 ? ["native-active-effect"] : []),
    ],
    adapter: {
      activityIdentifier: identifier,
      activityName: name,
      triggeredEventActivity: {
        version: 1,
        inheritParentScaling: true,
        inheritParentSaveDc: true,
        ...(target?.origin?.type === "event-neighborhood"
          ? {
              includeAnchor: target.origin.includeAnchor !== false,
              radius: target.origin.radius,
              units: target.origin.units,
              kind: target.targetKind ?? target.kind ?? "creature",
            }
          : {}),
      },
    },
  });
}

export function assertLoweringCoverage(graph, projection, loweringHints = {}) {
  const errors = [];
  const actionIds = new Set((projection.actions ?? []).map(value => value.sourceActionId));
  for (const currentAction of graph.actions ?? []) {
    if (!actionIds.has(currentAction.id)) errors.push(`action ${currentAction.id} was not lowered`);
  }

  const projectedArtifactIds = new Set(
    (projection.artifacts ?? []).flatMap(value => [
      value.semanticId,
      value.sourceSemanticId,
    ]).filter(Boolean),
  );
  for (const currentArtifact of graph.artifacts ?? []) {
    if (!projectedArtifactIds.has(currentArtifact.id)) {
      errors.push(`artifact ${currentArtifact.id} was not lowered`);
    }
  }

  const runtimeRuleIds = new Set((projection.runtimeRules ?? []).map(value => value.id));
  for (const currentRule of graph.rules ?? []) {
    const provider = ruleProvider(currentRule, graph, loweringHints);
    const projectedNatively = ["dnd5e-midi-native", "native-active-effect"].includes(provider)
      && [
        ...(projection.actions ?? []),
        ...(projection.internalActions ?? []),
      ].some(currentAction =>
        currentAction.sourceRuleIds?.includes(currentRule.id)
      );
    if (!projectedNatively && !runtimeRuleIds.has(currentRule.id)) {
      errors.push(`rule ${currentRule.id} has no lowering receipt`);
    }
    if (provider === "arcane-runtime" && !arcaneRuntimeLink(currentRule, loweringHints)) {
      errors.push(`rule ${currentRule.id} has no registered arcane-runtime adapter`);
    }
    if (
      provider === "arcane-runtime"
      && ruleAdapter(currentRule, loweringHints)?.adapter === "workflow-outcome-operations-v1"
      && (
        currentRule.on?.type !== "operation-outcome"
        || !["hit", "miss", "success", "failure"].includes(currentRule.on?.outcome)
        || (currentRule.do ?? []).length === 0
        || !(currentRule.do ?? []).every(currentOperation =>
          currentOperation.type === "damage"
          && String(currentOperation.formula ?? "").trim()
          && (currentOperation.damageTypes ?? []).length === 1
        )
      )
    ) {
      errors.push(
        `rule ${currentRule.id} workflow-outcome-operations-v1 requires a hit/miss/success/failure trigger and single-type damage operations`,
      );
    }
    if (
      provider === "arcane-runtime"
      && ruleAdapter(currentRule, loweringHints)?.adapter
        === "workflow-outcome-forced-movement-v1"
    ) {
      const sourceOperation = graphOperation(
        graph,
        currentRule.on?.operationId,
      );
      const validOutcome = (
        sourceOperation?.type === "saving-throw"
        && currentRule.on?.outcome === "failure"
      );
      const targets = currentRule.targets ?? [];
      const eventTarget = targets[0];
      const operations = currentRule.do ?? [];
      const validTarget = (
        targets.length === 1
        && eventTarget?.result === "tokens"
        && eventTarget?.origin?.type === "event-binding"
        && eventTarget?.origin?.name === "target"
        && eventTarget?.cardinality?.min === 1
        && eventTarget?.cardinality?.max === 1
      );
      const validMoves = (
        operations.length > 0
        && operations.every(currentOperation => {
          const destination = currentOperation.destination;
          return (
            currentOperation.type === "move-token"
            && currentOperation.target === eventTarget?.id
            && destination?.type === "away-from-source"
            && Number.isFinite(Number(destination.distance))
            && Number(destination.distance) > 0
            && destination.units === "ft"
          );
        })
      );
      if (
        currentRule.on?.type !== "operation-outcome"
        || !validOutcome
        || (currentRule.when ?? []).length > 0
        || !validTarget
        || !validMoves
      ) {
        errors.push(
          `rule ${currentRule.id} workflow-outcome-forced-movement-v1 requires `
          + "a failed save, one event target, and feet-based away-from-source moves",
        );
      }
    }
    if (provider === "midi-overtime" && !midiOvertimeLink(currentRule, loweringHints)) {
      errors.push(`rule ${currentRule.id} has no complete midi-overtime adapter`);
    }
    if (provider === "active-auras" && !activeAurasLink(currentRule, graph, loweringHints)) {
      errors.push(`rule ${currentRule.id} has no complete ActiveAuras zone binding`);
    }
  }

  for (const provider of projection.capabilities ?? []) {
    if (!LOWERING_PROVIDERS.has(provider)) errors.push(`unknown lowering provider ${provider}`);
  }
  if (
    (graph.artifacts ?? []).some(artifactValue =>
      (artifactValue.state?.blockedActionKinds ?? []).length > 0
    )
    && !(projection.capabilities ?? []).includes("arcane-runtime")
  ) {
    errors.push("blockedActionKinds has no arcane-runtime capability receipt");
  }
  if (stableStringify(projection).includes("$parameter.")) {
    errors.push("lowering projection contains unresolved parameter bindings");
  }
  for (const runtimeRule of projection.runtimeRules ?? []) {
    if (!runtimeRule.on || !Array.isArray(runtimeRule.operations)) {
      errors.push(`runtime rule ${runtimeRule.id} is diagnostic-only`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Incomplete lowering for ${graph.id}:\n- ${errors.join("\n- ")}`);
  }
  return true;
}

export function lowerSemanticGraph(graph, loweringHints = {}, {
  contract,
  definitionId = graph.id,
  script = null,
} = {}) {
  validateSemanticGraph(graph);
  loweringHints = inferCanonicalNativeSummonHints(
    graph,
    loweringHints,
    { contract },
  );
  loweringHints = inferCanonicalCastOriginStaticMarkerHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalFatalDamageInterceptionHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalPlacedPointMoveTokenHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalZonePulseHints(graph, loweringHints, { contract });
  loweringHints = inferCanonicalFollowingAuraPulseHints(
    graph,
    loweringHints,
    { contract },
  );
  loweringHints = inferCanonicalSourceArmedAttackTransformHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalTriggeredEventActivityHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalWorkflowOutcomeActivityHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalOutcomeRaceHints(graph, loweringHints);
  loweringHints = inferCanonicalRepeatSaveHints(graph, loweringHints, script);
  loweringHints = inferCanonicalWorkflowOutcomeDamageHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalWorkflowOutcomeForcedMovementHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalOneShotTurnDamageHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalRecurringTurnDamageHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalSourceArtifactDismissHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalTemporaryHitPointsSourceHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalTemporaryHitPointsRefreshHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalExternalOperationArtifactTransitionHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalEffectHostHitByAttackHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalTemporaryHitPointsRetaliationHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalSourceTargetDamageMirrorHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalHealSourceByDamageFractionHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalArtifactEndedOutcomeHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalSourceTurnCheckHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalMarkedTargetParentDamageHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalDeclaredActiveBuffHints(
    graph,
    loweringHints,
    { definitionId },
  );
  loweringHints = inferCanonicalSourceAttackProximityRiderHints(
    graph,
    loweringHints,
    { contract },
  );
  loweringHints = inferCanonicalSourceTurnStartProximityEffectHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalDeclaredWeaponSpellRiderHints(
    graph,
    loweringHints,
  );
  loweringHints = inferCanonicalWeaponEnchantmentHints(
    graph,
    loweringHints,
    { contract },
  );
  loweringHints = inferCanonicalOwnedWeaponAttackHints(
    graph,
    loweringHints,
  );
  loweringHints = inferPerSpellScriptRuntimeHints(
    graph,
    script,
    loweringHints,
  );
  const moduleFlags = clone(loweringHints?.moduleFlags ?? {});
  if (!moduleFlags || typeof moduleFlags !== "object" || Array.isArray(moduleFlags)) {
    throw new Error(`${graph.id} loweringHints.moduleFlags must be an object`);
  }
  const reservedModuleFlags = [
    "compiler",
    "declaredActiveBuff",
    "declaredWeaponSpellRider",
    "spellAutomation",
    "spellContentVersion",
  ];
  const reservedModuleFlag = reservedModuleFlags.find(key =>
    Object.prototype.hasOwnProperty.call(moduleFlags, key)
  );
  if (reservedModuleFlag) {
    throw new Error(
      `${graph.id} loweringHints.moduleFlags cannot override compiler-owned ${reservedModuleFlag}`,
    );
  }
  const artifactsById = new Map((graph.artifacts ?? []).map(value => [value.id, value]));
  const loweredActions = [];
  const declaredRiderInternalActions = [];
  const runtimeRules = [];
  const capabilities = new Set();
  if (script) capabilities.add("arcane-runtime");

  for (const currentRule of graph.rules ?? []) {
    const provider = ruleProvider(currentRule, graph, loweringHints);
    if (!LOWERING_PROVIDERS.has(provider)) {
      throw new Error(`${graph.id} rule ${currentRule.id} uses unknown provider ${provider}`);
    }
    capabilities.add(provider);
    if (!["dnd5e-midi-native", "native-active-effect"].includes(provider)) {
      runtimeRules.push(projectedRuntimeRule(currentRule, graph, loweringHints));
    }
  }

  const loweredArtifacts = [];
  for (const currentArtifact of graph.artifacts ?? []) {
    const provider = artifactProvider(currentArtifact, loweringHints);
    if (!LOWERING_PROVIDERS.has(provider)) {
      throw new Error(`${graph.id} artifact ${currentArtifact.id} uses unknown provider ${provider}`);
    }
    for (const capability of artifactCapabilities(currentArtifact, loweringHints)) {
      if (!LOWERING_PROVIDERS.has(capability)) {
        throw new Error(
          `${graph.id} artifact ${currentArtifact.id} uses unknown capability ${capability}`,
        );
      }
      capabilities.add(capability);
    }
    const adapterHint = artifactAdapter(currentArtifact, loweringHints);
    const artifactAdapterId = adapterHint?.adapter;
    if (artifactAdapterId) {
      const adapterContract = ARCANE_RUNTIME_ARTIFACT_ADAPTERS[artifactAdapterId];
      if (!adapterContract) {
        throw new Error(
          `${graph.id} artifact ${currentArtifact.id} uses unknown runtime `
          + `artifact adapter ${artifactAdapterId}`,
        );
      }
      if (!(currentArtifact.state?.runtimeModifiers ?? []).some(current =>
        current?.type === adapterContract.modifier
      )) {
        throw new Error(
          `${graph.id} artifact ${currentArtifact.id} adapter ${artifactAdapterId} `
          + `requires runtime modifier ${adapterContract.modifier}`,
        );
      }
    }
    loweredArtifacts.push(projectedArtifact(currentArtifact, loweringHints));
  }

  const parameterizedArtifactIds = new Set();
  const boundArtifacts = new Map();
  for (const currentAction of graph.actions ?? []) {
    const rootRules = (graph.rules ?? []).filter(currentRule =>
      currentRule.on?.type === "action-used" && currentRule.on.actionId === currentAction.id
    );
    const declaredRules = (graph.rules ?? []).filter(currentRule =>
      currentAction.delivery === "declared-rider"
      && currentRule.on?.type === "operation-outcome"
      && String(currentRule.on.operationId ?? "").startsWith("external:")
    );
    const roots = rootRules.length ? rootRules : declaredRules;
    if (currentAction.resolution?.type === "independent-projectiles") {
      capabilities.add("arcane-runtime");
    }
    for (const expansion of parameterExpansions(currentAction)) {
      const boundRoots = roots.map(value => substituteBindings(value, expansion.bindings));
      const allRules = uniqueByHash(roots.flatMap(value =>
        connectedRules(graph, value).map(connected =>
          substituteBindings(connected, expansion.bindings)
        )
      ));
      const activityRules = uniqueByHash(roots.flatMap(value =>
        connectedActivityRules(graph, value, loweringHints).map(connected =>
          substituteBindings(connected, expansion.bindings)
        )
      ));
      const operationEntries = allRules.flatMap(currentRule =>
        (currentRule.do ?? []).map(currentOperation => ({
          currentRule,
          currentOperation,
        }))
      );
      const activityOperationEntries = activityRules.flatMap(currentRule =>
        (currentRule.do ?? [])
          .filter(currentOperation =>
            operationRunsInActivity(currentOperation, currentRule)
          )
          .map(currentOperation => ({
            currentRule,
            currentOperation,
          }))
      );
      const rawOperations = operationEntries.map(value => value.currentOperation);
      const rootTargets = boundRoots.flatMap(value => value.targets ?? []);
      const activityOperationTargetIds = new Set(
        activityOperationEntries
          .map(({ currentOperation }) => currentOperation.target)
          .filter(Boolean),
      );
      const meaningfulOperationTargetIds = new Set(
        operationEntries
          .filter(({ currentOperation }) =>
            !["consume-resource", "delete-artifact"].includes(
              currentOperation.type,
            )
          )
          .map(({ currentOperation }) => currentOperation.target)
          .filter(Boolean),
      );
      const publicInputTargets = rootTargets.filter(current =>
        ["self", "selected-targets", "placed-template"].includes(
          deriveInput(current, currentAction.delivery),
        )
      );
      const primaryTarget = publicInputTargets.find(current =>
        meaningfulOperationTargetIds.has(current.id)
      ) ?? publicInputTargets.find(current =>
        activityOperationTargetIds.has(current.id)
      ) ?? publicInputTargets[0] ?? rootTargets[0] ?? null;
      const referencedArtifactIds = new Set(
        rawOperations
          .filter(value => ["create-artifact", "apply-artifact", "update-artifact"].includes(value.type))
          .map(value => value.artifactId)
          .filter(Boolean),
      );
      const boundArtifactIds = new Map();
      const actionArtifacts = [];
      for (const artifactId of referencedArtifactIds) {
        const sourceArtifact = artifactsById.get(artifactId);
        if (!sourceArtifact) continue;
        const usedKeys = parameterKeysUsed(sourceArtifact, expansion.bindings);
        const boundArtifact = resolveNativeSummonChoiceCardinality(
          substituteBindings(sourceArtifact, expansion.bindings),
          expansion.bindings,
          graph.id,
        );
        const semanticId = usedKeys.length > 0
          ? `${sourceArtifact.id}:${usedKeys.map(key => expansion.bindings[key]).join(":")}`
          : sourceArtifact.id;
        const projected = projectedArtifact(boundArtifact, loweringHints, {
          semanticId,
          sourceSemanticId: sourceArtifact.id,
        });
        boundArtifactIds.set(sourceArtifact.id, semanticId);
        actionArtifacts.push(projected);
        if (usedKeys.length > 0) {
          parameterizedArtifactIds.add(sourceArtifact.id);
          boundArtifacts.set(semanticId, projected);
        }
      }
      const operations = activityOperationEntries
        .map(({ currentOperation, currentRule }) =>
          operationProjection(currentOperation, currentRule)
        )
        .map(currentOperation => (
        currentOperation.artifactId && boundArtifactIds.has(currentOperation.artifactId)
          ? { ...currentOperation, artifactId: boundArtifactIds.get(currentOperation.artifactId) }
          : currentOperation
        ));
      const resolvesTemplateMembersInWorkflow = primaryTarget?.origin?.type === "placed-template"
        && boundRoots.some(value => (value.do ?? []).some(currentOperation =>
          [
            "saving-throw",
            "attack-roll",
            "damage",
            "healing",
            "apply-artifact",
            "emit-event",
            "allocate-hit-point-pool",
          ].includes(currentOperation.type)
          && currentOperation.target === primaryTarget.id
        ));
      const selectionConstraints = targetSelectionConstraints(primaryTarget);
      const selectionCardinality = primaryTarget?.origin?.type === "selected"
        ? {
            version: 1,
            min: primaryTarget.cardinality?.min,
            max: primaryTarget.cardinality?.max,
            countScope: "explicit-selected",
          }
        : null;
      const saveRollMode = operations.find(current =>
        current.type === "saving-throw"
      )?.rollMode;
      const triggeredRuntimeRules = runtimeRules.filter(current =>
        current.sourceActionId === currentAction.id
        && current.adapter?.adapter === "triggered-event-activity-v1"
      );
      if (triggeredRuntimeRules.length > 1) {
        throw new Error(
          `${graph.id} action ${currentAction.id} has more than one triggered event activity`,
        );
      }
      const triggeredRuntimeRule = triggeredRuntimeRules[0] ?? null;
      loweredActions.push(compactObject({
        semanticId: expansion.actionId,
        sourceActionId: currentAction.id,
        sourceRuleIds: allRules.map(value => value.id).sort(),
        name: expansion.name,
        bindings: expansion.bindings,
        delivery: currentAction.delivery ?? "standalone",
        visibility: currentAction.visibility,
        activation: clone(currentAction.activation),
        resolution: clone(currentAction.resolution),
        triggeredActivity: triggeredRuntimeRule
          ? {
              semanticActionId:
                `runtime:${triggeredRuntimeRule.adapter.activityIdentifier}`,
              runtime: true,
              conditionText: "true",
              targets: "targets",
              rollAs: "firstTarget",
              consume: false,
              configure: false,
            }
          : undefined,
        requiredSelections: (currentAction.parameters ?? [])
          .filter(parameter =>
            parameter.type === "enum"
            && parameter.lowering === "runtime-required"
          )
          .map(parameter => ({
            id: parameter.id,
            type: "enum",
            required: true,
            values: parameter.values.map(value => ({
              value,
              label: parameter.labels?.[value] ?? value,
            })),
          })),
        input: deriveInput(primaryTarget, currentAction.delivery),
        activityType: actionArtifacts.some(current => current.kind === "entity")
          ? "summon"
          : actionActivityType(operations, currentAction.delivery),
        target: targetProjection(primaryTarget),
        operations,
        artifacts: actionArtifacts,
        interaction:
          primaryTarget?.origin?.type === "placed-template"
          || selectionCardinality
          || selectionConstraints.length > 0
          || saveRollMode
            ? compactObject({
                ...(primaryTarget?.origin?.type === "placed-template"
                  ? {
                      templateTargets: resolvesTemplateMembersInWorkflow ? "workflow" : "none",
                    }
                  : {}),
                ...(selectionCardinality ? { selectionCardinality } : {}),
                ...(selectionConstraints.length > 0 ? { selectionConstraints } : {}),
                ...(saveRollMode ? { saveRollMode } : {}),
              })
            : undefined,
        defaultTargetSelection: defaultTargetSelectionProjection(
          currentAction.defaultTargetSelection,
        ),
        representation: clone(loweringHints?.representations?.[currentAction.id]),
        availability: clone(currentAction.availableWhen ?? []),
        providers: [...new Set([
          ...allRules.map(value => ruleProvider(value, graph, loweringHints)),
          ...(currentAction.resolution?.type === "independent-projectiles"
            ? ["arcane-runtime"]
            : []),
        ])].sort(),
      }));
      const declaredRiderSave = projectedDeclaredRiderSaveAction({
        graphId: graph.id,
        actionValue: currentAction,
        expandedActionId: expansion.actionId,
        rules: allRules,
        operations,
        fallbackTarget: primaryTarget,
      });
      if (declaredRiderSave) declaredRiderInternalActions.push(declaredRiderSave);
    }
  }

  const materializedArtifacts = [
    ...loweredArtifacts.filter(value => !parameterizedArtifactIds.has(value.semanticId)),
    ...boundArtifacts.values(),
  ];
  const internalActions = uniqueByHash(
    [
      ...runtimeRules.map(current =>
        projectedInternalAction(current, graph, loweringHints)
      ).filter(Boolean),
      ...declaredRiderInternalActions,
    ],
  );
  // Zones that declare concentration disruption get a second hidden save-only
  // activity; the runtime runs it for concentrating members on the zone's own
  // pulse phases and ends concentration on a failure.
  const concentrationInternalActions = [];
  for (const artifactValue of materializedArtifacts) {
    const zoneContract = artifactValue?.adapter?.flags?.zoneEventActivity;
    const disruption = zoneContract?.concentrationDisruption ?? null;
    if (!disruption) continue;
    const pulseAction = internalActions.find(current =>
      current.semanticId === `runtime:${zoneContract.activityIdentifier}`
    ) ?? null;
    if (!pulseAction) {
      throw new Error(
        `${artifactValue.semanticId} concentration disruption requires its zone pulse activity`,
      );
    }
    const pulseSave = (pulseAction.operations ?? []).find(current =>
      current.type === "saving-throw"
    );
    concentrationInternalActions.push(compactObject({
      semanticId: `runtime:${disruption.activityIdentifier}`,
      sourceRuleId: pulseAction.sourceRuleId,
      sourceRuleIds: [...(pulseAction.sourceRuleIds ?? [])],
      name: `${graph.id}: concentration pulse`,
      delivery: "internal",
      visibility: "automation-only",
      activation: { type: "none", cost: 0 },
      input: pulseAction.input,
      activityType: "save",
      target: clone(pulseAction.target),
      operations: [compactObject({
        type: "saving-throw",
        id: "concentration-save",
        ability: [disruption.ability],
        onSave: "none",
        ...(pulseSave?.target ? { target: pulseSave.target } : {}),
      })],
      availability: [],
      providers: ["arcane-runtime"],
      adapter: {
        adapter: "zone-event-activity-v1",
        phase: "concentration",
        activityIdentifier: disruption.activityIdentifier,
      },
    }));
  }
  const perSpellScript = script
    ? {
        ...clone(script),
        handlers: (script.handlers ?? []).map(handler => {
          const runtimeRule = runtimeRules.find(rule =>
            rule.id === (handler.runtimeRuleId ?? handler.ruleId)
          );
          if (!runtimeRule) {
            throw new Error(
              `${graph.id} per-spell script handler ${handler.id} references missing runtime rule`,
            );
          }
          if (handler.event === "declared-rider-after-damage") {
            if (runtimeRule.adapter?.adapter !== "declared-weapon-spell-rider-v1") {
              throw new Error(
                `${graph.id} handler ${handler.id} requires declared-weapon-spell-rider-v1`,
              );
            }
            return clone(handler);
          }
          if (handler.event === "repeat-save-outcome") {
            const activityIdentifier =
              runtimeRule.adapter?.activityIdentifier
              ?? runtimeRule.adapter?.usesActivityIdentifier;
            if (!activityIdentifier) {
              throw new Error(
                `${graph.id} handler ${handler.id} repeat-save rule has no activity`,
              );
            }
            return {
              ...clone(handler),
              activityIdentifier,
              semanticActionId: `runtime:${activityIdentifier}`,
            };
          }
          if (handler.event === "typed-damage-transaction") {
            if (
              runtimeRule.adapter?.adapter !== "typed-damage-dispatcher-v2"
              || runtimeRule.adapter?.scriptId !== script.id
              || runtimeRule.adapter?.handlerId !== handler.id
              || runtimeRule.adapter?.artifactId !== handler.artifactId
            ) {
              throw new Error(
                `${graph.id} handler ${handler.id} requires typed-damage-dispatcher-v2`,
              );
            }
            return clone(handler);
          }
          throw new Error(
            `${graph.id} handler ${handler.id} has unsupported event ${handler.event}`,
          );
        }),
      }
    : null;
  const perSpellScriptConcentrationHandlers = (perSpellScript?.handlers ?? [])
    .filter(handler => (handler.writes ?? []).includes("artifact:concentration"));
  const runtimeAnchors = [];
  if (perSpellScriptConcentrationHandlers.length > 0) {
    const concentrationArtifact = materializedArtifacts.find(current =>
      current.semanticId === "concentration"
      && current.kind === "effect"
      && current.state?.concentration === true
    );
    if (!concentrationArtifact) {
      throw new Error(
        `${graph.id} per-spell script writes concentration without a concentration artifact`,
      );
    }
    runtimeAnchors.push({
      id: "per-spell-script-concentration",
      kind: "native-concentration",
      artifactId: concentrationArtifact.semanticId,
      name: `${graph.id}: scripted concentration`,
      activityType: "utility",
      activityIdentifier: "arcanePerSpellScriptConcentration",
    });
  }
  const projection = {
    schemaVersion: SPELL_AUTOMATION_SCHEMA_VERSION,
    spellId: graph.id,
    support: clone(graph.support),
    moduleFlags,
    actions: loweredActions.sort((left, right) => left.semanticId.localeCompare(right.semanticId)),
    internalActions: [...internalActions, ...concentrationInternalActions]
      .sort((left, right) => left.semanticId.localeCompare(right.semanticId)),
    ...(runtimeAnchors.length > 0 ? { runtimeAnchors } : {}),
    artifacts: materializedArtifacts.sort((left, right) => left.semanticId.localeCompare(right.semanticId)),
    runtimeRules: runtimeRules.sort((left, right) => left.id.localeCompare(right.id)),
    ...(perSpellScript ? { perSpellScript } : {}),
    capabilities: [...capabilities].sort(),
  };
  assertLoweringCoverage(graph, projection, loweringHints);
  return {
    projection,
    planHash: semanticHash(projection),
  };
}

function assertSourceShape(item, definition) {
  const assertions = definition.sourceAssertions ?? {};
  const activities = Object.values(item.system?.activities ?? {});
  const activityTypes = activities.map(value => value.type);
  if (assertions.activityTypes) {
    for (const type of assertions.activityTypes) {
      if (!activityTypes.includes(type)) {
        throw new Error(`${definition.id} raw Item no longer contains expected ${type} activity`);
      }
    }
  }
  if (assertions.minActivities !== undefined && activities.length < assertions.minActivities) {
    throw new Error(`${definition.id} raw Item has ${activities.length} activities; expected at least ${assertions.minActivities}`);
  }
  if (assertions.itemLevel !== undefined && Number(item.system?.level) !== assertions.itemLevel) {
    throw new Error(`${definition.id} raw Item level ${item.system?.level}; expected ${assertions.itemLevel}`);
  }
}

export function compileSpellDefinition(definition, { liftedGraph = null } = {}) {
  const empty = {
    schemaVersion: SPELL_AUTOMATION_SCHEMA_VERSION,
    id: definition.id,
    support: clone(definition.support),
    actions: [],
    artifacts: [],
    rules: [],
  };
  const base = definition.sourceMode === "lift"
    ? clone(liftedGraph ?? empty)
    : empty;
  base.id = definition.id;
  base.support = clone(definition.support);
  const composed = materializeFragments(base, definition.fragments ?? []);
  composed.id = definition.id;
  composed.support = clone(definition.support);
  const graph = normalizeGraph(composed);
  validateSemanticGraph(graph);
  const lowering = lowerSemanticGraph(
    graph,
    definition.loweringHints,
    {
      contract: definition.contract,
      definitionId: definition.id,
      script: definition.script,
    },
  );
  return {
    graph,
    graphHash: semanticHash(graph),
    ...lowering,
  };
}

/** Compile a trusted clean-room definition without reading any content document.
 * Resource references remain explicit in the plan; compilation is not readiness.
 */
export function compileSpellPlan(definition, {runtimeProfile = {}} = {}) {
  if (definition?.emission?.mode !== "clean-room") {
    throw new Error("Content-independent compilation requires a clean-room definition");
  }
    const prepared = prepareCleanRoomFragments(definition, runtimeProfile);
    const compiled = compileSpellDefinition({
      ...definition,
      sourceMode: "explicit",
      fragments: prepared.fragments,
      loweringHints: {},
      sourceAssertions: {},
    });
    const semanticSource = cleanRoomSemanticSource(definition);
    const cleanRoomSemanticHash = semanticHash(semanticSource);
    const runtimeProfileHash = semanticHash(prepared.runtimeProfile);
    const {
      support: _projectionSupport,
      ...executableProjection
    } = compiled.projection;
    const executionPlanHash = semanticHash({
      semanticHash: cleanRoomSemanticHash,
      projection: executableProjection,
      runtimeProfileHash,
    });
    return {
      compilerVersion: SPELL_AUTOMATION_COMPILER_VERSION,
      definitionId: definition.id,
      definitionHash: semanticHash(definition),
      sourceMode: definition.sourceMode,
      emissionMode: "clean-room",
      support: clone(definition.support),
      emission: clone(definition.emission),
      acceptance: clone(definition.acceptance),
      contract: clone(definition.contract),
      contentReference: clone(definition.content),
      semanticHash: cleanRoomSemanticHash,
      executionPlanHash,
      runtimeProfile: clone(prepared.runtimeProfile),
      runtimeProfileVersion: prepared.runtimeProfile.version,
      runtimeProfileHash,
      ...compiled,
    };
}

export function compileSpellAutomation(item, definition, {
  runtimeProfile = {},
  documentIdentity,
  packaging = {},
} = {}) {
  if (item?.system?.identifier !== definition.id) {
    throw new Error(`Definition ${definition.id} cannot compile Item ${item?.system?.identifier}`);
  }
  if (definition.emission?.mode === "clean-room") {
    return bindSpellPlan(item, compileSpellPlan(definition, {runtimeProfile}), {documentIdentity, packaging});
  }
  assertSourceShape(item, definition);
  const lifted = liftSpellItem(item);
  const compiled = compileSpellDefinition(definition, { liftedGraph: lifted.graph });
  return {
    compilerVersion: SPELL_AUTOMATION_COMPILER_VERSION,
    definitionId: definition.id,
    definitionHash: semanticHash(definition),
    sourceMode: definition.sourceMode,
    support: clone(definition.support),
    emission: clone(definition.emission),
    acceptance: clone(definition.acceptance),
    liftedGraph: lifted.graph,
    liftedGraphHash: semanticHash(lifted.graph),
    provenance: lifted.provenance,
    ...compiled,
  };
}

function observedEffect(item, effect) {
  return {
    providerId: effect?._id,
    name: effect?.name,
    statuses: [...(effect?.statuses ?? [])].sort(),
    changes: (effect?.changes ?? []).map(semanticChange),
    duration: {
      seconds: numberOrNull(effect?.duration?.seconds),
      rounds: numberOrNull(effect?.duration?.rounds),
      turns: numberOrNull(effect?.duration?.turns),
      special: [...(effect?.flags?.dae?.specialDuration ?? [])].sort(),
    },
    flags: {
      arcane: clone(effect?.flags?.[ARCANE_AUTOMATION_MODULE_ID] ?? {}),
      activeAuras: clone(effect?.flags?.ActiveAuras ?? {}),
      auraEffects: clone(effect?.flags?.["aura-effects"] ?? effect?.flags?.auraeffects ?? {}),
      dae: {
        stackable: effect?.flags?.dae?.stackable,
        specialDuration: [...(effect?.flags?.dae?.specialDuration ?? [])].sort(),
      },
    },
  };
}

function observedOperationProjection(activity, attachedEffects, spellLevel) {
  const values = [];
  if (activity?.consumption?.spellSlot === true) {
    values.push({ type: "consume-resource", resource: "spell-slot", timing: "on-use" });
  }
  if (activity.type === "save" || activity.save?.ability?.length) {
    values.push({
      type: "saving-throw",
      ability: asArray(activity.save?.ability).map(String),
      onSave: activity.damage?.onSave ?? "none",
    });
  }
  if (activity.type === "attack" || activity.attack) {
    values.push({
      type: "attack-roll",
      attackType: activity.attack?.type?.value ?? "spell",
    });
  }
  for (const part of activity.damage?.parts ?? []) {
    values.push({
      type: "damage",
      formula: formulaFromPart(part),
      damageTypes: [...(part.types ?? [])],
      scaling: scalingFromPart(part, spellLevel),
      onSave: activity.damage?.onSave ?? "none",
    });
  }
  if (activity.healing) {
    values.push({
      type: "healing",
      formula: formulaFromPart(activity.healing),
      healingTypes: [...(activity.healing.types ?? [])],
      scaling: scalingFromPart(activity.healing, spellLevel),
    });
  }
  for (const currentEffect of attachedEffects) {
    values.push({
      type: "apply-artifact",
      artifact: currentEffect,
    });
  }
  return values;
}

function observedTargetProjection(item, activity) {
  const target = effectiveTarget(item, activity);
  const range = effectiveRange(item, activity);
  const interaction = activity.flags?.[ARCANE_AUTOMATION_MODULE_ID]?.interaction ?? {};
  const placedPointMoveDestination =
    activity.flags?.[ARCANE_AUTOMATION_MODULE_ID]?.placedPointMoveDestination === true
    || activity.flags?.[ARCANE_AUTOMATION_MODULE_ID]?.mistyStepDestination === true;
  const template = target?.template ?? {};
  const templateType = String(template.type ?? "").trim();
  const selfCenteredTemplate = (
    interaction.input === "self"
    && String(range?.units ?? "").trim() === "self"
    && ["radius", "squareRadius"].includes(templateType)
  );
  const origin = placedPointMoveDestination
    ? { type: "placed-point" }
    : selfCenteredTemplate
      ? {
          type: "placed-template",
          shape: {
            type: templateType,
            size: numberOrExpression(template.size),
            width: numberOrExpression(template.width),
            height: numberOrExpression(template.height),
            units: template.units || "ft",
          },
        }
    : targetOriginFromItem(item, activity);
  // Human placement is always a one-time Action input. A `templateTargets=none`
  // contract means that the placed template is an artifact/zone rather than
  // the current workflow's target set; it does not turn the placement query
  // itself into a live TargetQuery. Live membership belongs to later rules.
  const evaluation = "snapshot";
  return compactObject({
    result: origin.type === "placed-point"
      ? "point"
      : origin.type === "placed-template"
      ? "template-members"
      : origin.type === "self" ? "source" : "tokens",
    origin,
    evaluation,
    cardinality: inferredTargetCardinality(origin, target),
    range: range?.units ? {
      value: numberOrExpression(range.value),
      units: range.units,
      from: "source",
    } : undefined,
    targetKind: target?.affects?.type || "creature",
    disposition: ["ally", "enemy"].includes(target?.affects?.type)
      ? target.affects.type === "ally" ? "friendly" : "hostile"
      : undefined,
  });
}

function currentItemCapabilities(item, observedEffects) {
  const values = new Set(["dnd5e-midi-native"]);
  const itemArcane = item.flags?.[ARCANE_AUTOMATION_MODULE_ID] ?? {};
  if (observedEffects.some(effect => effect.flags?.activeAuras?.isAura === true)) values.add("active-auras");
  if (observedEffects.some(effect => Object.keys(effect.flags?.auraEffects ?? {}).length > 0)) values.add("aura-effects");
  if (item.flags?.dae?.macro?.command || item.flags?.["midi-qol"]?.onUseMacroName) values.add("item-macro");
  if (
    itemArcane.declaredWeaponSpellRider
    || (
      itemArcane.spellAutomation?.runtimePlan?.actionResolutions?.length
        > 0
    )
    || observedEffects.some(effect => Object.keys(effect.flags?.arcane ?? {}).length > 0)
  ) {
    values.add("arcane-runtime");
  }
  return [...values].sort();
}

export function observeSpellItem(item, profile = {}) {
  const effects = (item.effects ?? []).map(effect => observedEffect(item, effect));
  const effectsById = new Map(effects.map(effect => [effect.providerId, effect]));
  const actions = Object.values(item.system?.activities ?? {}).map(activity => {
    const attachedEffects = (activity.effects ?? [])
      .map(reference => effectsById.get(typeof reference === "string" ? reference : reference?._id))
      .filter(Boolean);
    const target = observedTargetProjection(item, activity);
    const interaction = activity.flags?.[ARCANE_AUTOMATION_MODULE_ID]?.interaction ?? {};
    const availability = activity.flags?.[ARCANE_AUTOMATION_MODULE_ID]?.availability;
    return compactObject({
      providerId: activity._id,
      name: activity.name,
      visibility: activity.midiProperties?.automationOnly === true ? "automation-only" : "public",
      activation: {
        type: normalizedActivation(effectiveActivation(item, activity)),
        cost: numberOrNull(effectiveActivation(item, activity)?.value) ?? 1,
      },
      input: interaction.input ?? deriveInput(target, "standalone"),
      activityType: activity.type,
      target,
      operations: observedOperationProjection(
        activity,
        attachedEffects,
        item.system?.level,
      ),
      interaction:
        target?.origin?.type === "placed-template"
        || interaction.selectionCardinality
        || (interaction.selectionConstraints ?? []).length > 0
        || interaction.resolution
          ? compactObject({
              ...(target?.origin?.type === "placed-template"
                ? {
                    templateTargets: interaction.templateTargets
                      ?? profile.activities?.[activity._id]?.templateTargets
                      ?? profile.templateTargets
                      ?? null,
                  }
                : {}),
              ...((interaction.selectionConstraints ?? []).length > 0
                ? {
                    selectionConstraints: clone(
                      interaction.selectionConstraints,
                    ),
                  }
                : {}),
              ...(interaction.selectionCardinality
                ? {
                    selectionCardinality: clone(
                      interaction.selectionCardinality,
                    ),
                  }
                : {}),
              ...(interaction.resolution
                ? { resolution: clone(interaction.resolution) }
                : {}),
            })
          : undefined,
      availability: availability
        ? [{ type: "artifact-exists", identifier: availability.requiresEffectIdentifier }]
        : [],
      flags: {
        arcane: clone(activity.flags?.[ARCANE_AUTOMATION_MODULE_ID] ?? {}),
        midi: {
          identifier: activity.midiProperties?.identifier,
          autoTargetAction: activity.midiProperties?.autoTargetAction,
          autoTargetType: activity.midiProperties?.autoTargetType,
          isOverTime: activity.isOverTimeFlag === true,
        },
      },
    });
  });
  const observation = {
    spellId: item.system?.identifier,
    itemId: item._id,
    itemName: item.name,
    concentration: Object.values(item.system?.activities ?? {}).some(activity => isConcentration(item, activity)),
    actions: actions.sort((left, right) => String(left.providerId).localeCompare(String(right.providerId))),
    effects: effects.sort((left, right) => String(left.providerId).localeCompare(String(right.providerId))),
    itemFlags: {
      arcane: clone(item.flags?.[ARCANE_AUTOMATION_MODULE_ID] ?? {}),
      midi: clone(item.flags?.["midi-qol"] ?? {}),
      dae: clone(item.flags?.dae ?? {}),
      autoanimations: clone(item.flags?.autoanimations ?? {}),
    },
    profile: clone(profile),
    capabilities: currentItemCapabilities(item, effects),
  };
  return {
    observation,
    observationHash: semanticHash(observation),
  };
}

function normalizeFormula(value) {
  return String(value ?? "")
    .replace(/\s+/g, "")
    .replace(/\+\-/g, "-")
    .toLowerCase();
}

function sameNumberOrExpression(left, right) {
  const leftNumber = numberOrNull(left);
  const rightNumber = numberOrNull(right);
  if (leftNumber !== null || rightNumber !== null) {
    return leftNumber !== null && rightNumber !== null && leftNumber === rightNumber;
  }
  return normalizeFormula(left) === normalizeFormula(right);
}

function expectedOperationSignature(currentOperation) {
  return compactObject({
    type: currentOperation.type,
    resource: currentOperation.resource,
    timing: currentOperation.timing,
    ability: asArray(currentOperation.ability).map(String).sort(),
    attackType: currentOperation.attackType,
    formula: currentOperation.formula ? normalizeFormula(currentOperation.formula) : undefined,
    damageTypes: [...(currentOperation.damageTypes ?? [])].sort(),
    healingTypes: [...(currentOperation.healingTypes ?? [])].sort(),
    onSave: currentOperation.onSave,
    scaling: clone(currentOperation.scaling),
  });
}

function observedOperationSignature(currentOperation) {
  return compactObject({
    type: currentOperation.type,
    resource: currentOperation.resource,
    timing: currentOperation.timing,
    ability: asArray(currentOperation.ability).map(String).sort(),
    attackType: currentOperation.attackType,
    formula: currentOperation.formula ? normalizeFormula(currentOperation.formula) : undefined,
    damageTypes: [...(currentOperation.damageTypes ?? [])].sort(),
    healingTypes: [...(currentOperation.healingTypes ?? [])].sort(),
    onSave: currentOperation.onSave,
    scaling: clone(currentOperation.scaling),
  });
}

function targetCore(target) {
  return compactObject({
    originType: target?.origin?.type,
    result: target?.result,
    evaluation: target?.evaluation,
    cardinality: target?.cardinality,
    range: target?.range,
    targetKind: target?.targetKind,
    disposition: target?.disposition,
    shape: target?.origin?.shape,
  });
}

function actionMatchScore(expected, observed) {
  let score = 0;
  if (expected.visibility === observed.visibility) score += 20;
  if (expected.activityType === observed.activityType) score += 30;
  if (expected.activation?.type === observed.activation?.type) score += 8;
  if (expected.input === observed.input) score += 20;
  if (expected.target?.origin?.type === observed.target?.origin?.type) score += 12;
  if (expected.bindings && Object.keys(expected.bindings).length) {
    const haystack = stableStringify(observed).toLowerCase();
    for (const value of Object.values(expected.bindings)) {
      if (haystack.includes(String(value).toLowerCase())) score += 20;
    }
  }
  const expectedTypes = new Set((expected.operations ?? []).map(value => value.type));
  const observedTypes = new Set((observed.operations ?? []).map(value => value.type));
  for (const type of expectedTypes) if (observedTypes.has(type)) score += 5;
  return score;
}

function findBestActionMatch(expected, observedActions, used) {
  const candidates = observedActions
    .map((value, index) => ({ value, index, score: used.has(index) ? -Infinity : actionMatchScore(expected, value) }))
    .sort((left, right) => right.score - left.score || String(left.value.providerId).localeCompare(String(right.value.providerId)));
  return candidates[0]?.score > 0 ? candidates[0] : null;
}

function addCheck(checks, {
  path,
  expected,
  observed,
  severity = "required",
  compare = (left, right) => stableStringify(left) === stableStringify(right),
  note,
}) {
  const pass = compare(expected, observed);
  checks.push(compactObject({ path, severity, pass, expected, observed, note }));
  return pass;
}

function checkTarget(checks, expected, observed, prefix, representation = {}) {
  addCheck(checks, {
    path: `${prefix}.target.origin`,
    expected: expected?.origin?.type,
    observed: observed?.origin?.type,
  });
  addCheck(checks, {
    path: `${prefix}.target.evaluation`,
    expected: expected?.evaluation,
    observed: observed?.evaluation,
  });
  if (expected?.cardinality?.min !== undefined) {
    addCheck(checks, {
      path: `${prefix}.target.cardinality.min`,
      expected: expected.cardinality.min,
      observed: observed?.cardinality?.min,
    });
  }
  if (expected?.cardinality?.max !== undefined) {
    addCheck(checks, {
      path: `${prefix}.target.cardinality.max`,
      expected: expected.cardinality.max,
      observed: observed?.cardinality?.max,
    });
  }
  if (expected?.range?.units) {
    addCheck(checks, {
      path: `${prefix}.target.range.units`,
      expected: expected.range.units,
      observed: observed?.range?.units,
      compare: (left, right) =>
        left === right
        || (
          representation.range === "touch-as-5-ft"
          && left === "touch"
          && right === "ft"
          && Number(observed?.range?.value) === 5
        ),
    });
    if (expected.range.value !== undefined && expected.range.value !== null) {
      addCheck(checks, {
        path: `${prefix}.target.range.value`,
        expected: expected.range.value,
        observed: observed?.range?.value,
        compare: sameNumberOrExpression,
      });
    }
  }
  if (expected?.origin?.shape?.type) {
    addCheck(checks, {
      path: `${prefix}.target.shape.type`,
      expected: expected.origin.shape.type,
      observed: observed?.origin?.shape?.type,
    });
    addCheck(checks, {
      path: `${prefix}.target.shape.size`,
      expected: expected.origin.shape.size,
      observed: observed?.origin?.shape?.size,
      compare: sameNumberOrExpression,
    });
  }
}

function checkOperations(checks, expected, observed, prefix) {
  const expectedValues = (expected ?? []).map(expectedOperationSignature);
  const observedValues = (observed ?? []).map(observedOperationSignature);
  for (let index = 0; index < expectedValues.length; index += 1) {
    const expectedValue = expectedValues[index];
    if (["create-artifact", "apply-artifact", "update-artifact", "delete-artifact", "move-token", "grant-temporary-hp"].includes(expectedValue.type)) {
      continue;
    }
    const match = observedValues.find(candidate => {
      if (candidate.type !== expectedValue.type) return false;
      if (expectedValue.resource && candidate.resource !== expectedValue.resource) return false;
      if (expectedValue.timing && candidate.timing !== expectedValue.timing) return false;
      if (expectedValue.ability?.length && stableStringify(candidate.ability) !== stableStringify(expectedValue.ability)) return false;
      if (expectedValue.attackType && candidate.attackType !== expectedValue.attackType) return false;
      if (expectedValue.formula && candidate.formula !== expectedValue.formula) return false;
      if (expectedValue.damageTypes?.length && stableStringify(candidate.damageTypes) !== stableStringify(expectedValue.damageTypes)) return false;
      if (expectedValue.healingTypes?.length && stableStringify(candidate.healingTypes) !== stableStringify(expectedValue.healingTypes)) return false;
      if (expectedValue.onSave && candidate.onSave !== expectedValue.onSave) return false;
      if (expectedValue.scaling && stableStringify(candidate.scaling) !== stableStringify(expectedValue.scaling)) return false;
      return true;
    });
    addCheck(checks, {
      path: `${prefix}.operations.${expectedValue.type}.${index + 1}`,
      expected: expectedValue,
      observed: match ?? null,
      compare: (_left, right) => Boolean(right),
    });
  }
}

function stateFacts(state) {
  const facts = new Set();
  for (const status of state?.statuses ?? []) facts.add(`status:${status}`);
  if (state?.movement?.all !== undefined) facts.add(`movement:all:${state.movement.all}`);
  if (state?.acBonus !== undefined) facts.add(`ac-bonus:${state.acBonus}`);
  if (state?.saveBonus !== undefined) facts.add(`save-bonus:${state.saveBonus}`);
  if (state?.grantsAttackAdvantage === true) facts.add("grant-attack-advantage:true");
  if (state?.blocksVocalSpell === true) facts.add("block-vocal-spell:true");
  for (const value of state?.blockedActionKinds ?? []) facts.add(`block-action:${value}`);
  for (const value of state?.damageResistance ?? []) facts.add(`damage-resistance:${value}`);
  for (const value of state?.conditionImmunity ?? []) facts.add(`condition-immunity:${value}`);
  for (const currentChange of state?.changes ?? []) {
    if (currentChange.type === "provider-change") continue;
    if (currentChange.type === "attack-bonus") facts.add(`attack-bonus:${currentChange.attack}:${currentChange.value}`);
    else if (currentChange.type === "damage-bonus") facts.add(`damage-bonus:${currentChange.attack}:${currentChange.value}`);
    else facts.add(`${currentChange.type}:${currentChange.value}`);
  }
  return [...facts].sort();
}

function observedEffectFacts(effect) {
  return stateFacts({
    statuses: effect.statuses,
    changes: effect.changes,
    blockedActionKinds: effect.flags?.[ARCANE_AUTOMATION_MODULE_ID]?.blockedActionKinds,
  });
}

function compareArtifacts(checks, compilation, observation) {
  const observedFacts = new Set(observation.effects.flatMap(observedEffectFacts));
  const parameterizedArtifactIds = new Set(
    compilation.projection.actions
      .flatMap(value => value.artifacts ?? [])
      .map(value => value.sourceSemanticId),
  );
  const actionArtifactVariants = compilation.projection.actions
    .flatMap(value => value.artifacts ?? [])
    .map(value => ({
      semanticId: value.semanticId,
      kind: "effect",
      role: "mechanical",
      state: value.state,
      lifecycle: value.lifecycle,
      provider: value.provider,
    }));
  const expectedArtifacts = [
    ...compilation.projection.artifacts.filter(value => {
      if (!parameterizedArtifactIds.has(value.semanticId)) return true;
      return !stableStringify(value.state).includes("$parameter.");
    }),
    ...actionArtifactVariants,
  ];
  for (const expectedArtifact of uniqueByHash(expectedArtifacts)) {
    if (expectedArtifact.role === "presentation") {
      addCheck(checks, {
        path: `artifact.${expectedArtifact.semanticId}.presentation-provider`,
        expected: expectedArtifact.provider,
        observed: observation.capabilities,
        severity: "advisory",
        compare: (left, right) => right.includes(left) || right.includes("item-macro"),
      });
      continue;
    }
    if (expectedArtifact.kind !== "effect") continue;
    const expectedFacts = stateFacts(expectedArtifact.state);
    const runtimeOwned = expectedArtifact.provider === "arcane-runtime";
    for (const fact of expectedFacts) {
      addCheck(checks, {
        path: `artifact.${expectedArtifact.semanticId}.${fact}`,
        expected: fact,
        observed: observedFacts.has(fact) ? fact : null,
        severity: runtimeOwned ? "runtime-evidence" : "required",
        compare: (_left, right) => runtimeOwned || Boolean(right),
        note: runtimeOwned ? "Owned by accepted Arcane runtime behavior; Item flags are structural evidence only." : undefined,
      });
    }
  }
}

function checkSpecialAdapters(checks, compilation, observation) {
  const compiledActions = compilation.projection.actions;
  if (compiledActions.some(value => value.delivery === "declared-rider")) {
    addCheck(checks, {
      path: "adapter.declared-rider",
      expected: true,
      observed: Boolean(observation.itemFlags.arcane?.declaredWeaponSpellRider),
    });
  }
  if (compiledActions.some(value => (value.operations ?? []).some(operationValue => operationValue.type === "move-token"))) {
    addCheck(checks, {
      path: "adapter.move-token",
      expected: true,
      observed: observation.actions.some(value =>
        value.flags?.arcane?.placedPointMoveDestination === true
        || value.flags?.arcane?.mistyStepDestination === true
      ),
    });
  }
  if (compilation.projection.runtimeRules.some(value => value.provider === "active-auras")) {
    addCheck(checks, {
      path: "adapter.active-auras",
      expected: true,
      observed: observation.capabilities.includes("active-auras"),
    });
  }
  if (compiledActions.some(value => (value.availability ?? []).some(current => current.type === "artifact-exists"))) {
    addCheck(checks, {
      path: "adapter.follow-up-availability",
      expected: true,
      observed: observation.actions.some(value => (value.availability ?? []).length > 0),
    });
  }
  for (const currentAction of compiledActions.filter(value =>
    value.resolution?.type === "independent-projectiles"
  )) {
    addCheck(checks, {
      path: `runtime.action.${currentAction.semanticId}.independent-projectiles`,
      expected: "passed",
      observed: compilation.acceptance?.status ?? null,
      severity: "runtime-evidence",
      note: compilation.acceptance?.source
        ? `Existing runtime evidence: ${compilation.acceptance.source}`
        : "Independent projectile resolution requires an accepted world result.",
    });
  }
  for (const runtimeRule of compilation.projection.runtimeRules) {
    if (["active-auras", "aura-effects"].includes(runtimeRule.provider)) continue;
    addCheck(checks, {
      path: `runtime.${runtimeRule.id}.accepted-evidence`,
      expected: "passed",
      observed: compilation.acceptance?.status ?? null,
      severity: "runtime-evidence",
      note: compilation.acceptance?.source
        ? `Existing runtime evidence: ${compilation.acceptance.source}`
        : "Runtime-owned semantic rule requires an accepted world result.",
    });
  }
}

export function compareSpellAutomationCompilation(compilation, item, {
  profile = {},
} = {}) {
  const observed = observeSpellItem(item, profile);
  const observation = observed.observation;
  const checks = [];
  const used = new Set();

  for (const expectedAction of compilation.projection.actions) {
    if (expectedAction.delivery === "declared-rider") continue;
    const match = findBestActionMatch(expectedAction, observation.actions, used);
    const prefix = `action.${expectedAction.semanticId}`;
    addCheck(checks, {
      path: `${prefix}.exists`,
      expected: true,
      observed: Boolean(match),
    });
    if (!match) continue;
    used.add(match.index);
    const currentObserved = match.value;
    for (const [field, expectedValue, observedValue] of [
      ["visibility", expectedAction.visibility, currentObserved.visibility],
      ["activityType", expectedAction.activityType, currentObserved.activityType],
      ["activation", expectedAction.activation?.type, currentObserved.activation?.type],
      ["input", expectedAction.input, currentObserved.input],
    ]) {
      addCheck(checks, {
        path: `${prefix}.${field}`,
        expected: expectedValue,
        observed: observedValue,
      });
    }
    checkTarget(
      checks,
      expectedAction.target,
      currentObserved.target,
      prefix,
      expectedAction.representation,
    );
    if (expectedAction.interaction?.templateTargets) {
      addCheck(checks, {
        path: `${prefix}.interaction.templateTargets`,
        expected: expectedAction.interaction.templateTargets,
        observed: currentObserved.interaction?.templateTargets,
      });
    }
    if ((expectedAction.interaction?.selectionConstraints ?? []).length > 0) {
      addCheck(checks, {
        path: `${prefix}.interaction.selectionConstraints`,
        expected: expectedAction.interaction.selectionConstraints,
        observed: currentObserved.interaction?.selectionConstraints,
      });
    }
    if (expectedAction.interaction?.selectionCardinality) {
      addCheck(checks, {
        path: `${prefix}.interaction.selectionCardinality`,
        expected: expectedAction.interaction.selectionCardinality,
        observed: currentObserved.interaction?.selectionCardinality,
      });
    }
    if (expectedAction.resolution) {
      addCheck(checks, {
        path: `${prefix}.interaction.resolution`,
        expected: expectedAction.resolution,
        observed: currentObserved.interaction?.resolution,
      });
    }
    checkOperations(checks, expectedAction.operations, currentObserved.operations, prefix);
  }

  const unmatchedPublic = observation.actions.filter((currentAction, index) =>
    currentAction.visibility === "public" && !used.has(index)
  );
  addCheck(checks, {
    path: "actions.unmatched-public",
    expected: [],
    observed: unmatchedPublic.map(value => ({
      providerId: value.providerId,
      name: value.name,
      activityType: value.activityType,
    })),
    severity: "risk",
  });

  const expectsConcentration = compilation.projection.artifacts.some(value => value.state?.concentration === true);
  if (expectsConcentration) {
    addCheck(checks, {
      path: "spell.concentration",
      expected: true,
      observed: observation.concentration,
    });
  }
  compareArtifacts(checks, compilation, observation);
  checkSpecialAdapters(checks, compilation, observation);

  const requiredFailures = checks.filter(value =>
    !value.pass && ["required", "risk"].includes(value.severity)
  );
  const advisoryDifferences = checks.filter(value =>
    !value.pass && !["required", "risk"].includes(value.severity)
  );
  const runtimeEvidenceChecks = checks.filter(value => value.severity === "runtime-evidence");
  const status = requiredFailures.length > 0
    ? "divergent"
    : advisoryDifferences.length > 0 || runtimeEvidenceChecks.length > 0
      ? "compatible"
      : "equivalent";

  return {
    id: compilation.definitionId,
    status,
    sourceMode: compilation.sourceMode,
    support: clone(compilation.support),
    compilerVersion: compilation.compilerVersion,
    definitionHash: compilation.definitionHash,
    graphHash: compilation.graphHash,
    liftedGraphHash: compilation.liftedGraphHash,
    planHash: compilation.planHash,
    observationHash: observed.observationHash,
    acceptance: clone(compilation.acceptance),
    summary: {
      checks: checks.length,
      passed: checks.filter(value => value.pass).length,
      requiredFailures: requiredFailures.length,
      advisoryDifferences: advisoryDifferences.length,
      runtimeEvidenceChecks: runtimeEvidenceChecks.length,
    },
    requiredFailures,
    advisoryDifferences,
    checks,
    graph: compilation.graph,
    projection: compilation.projection,
    observation,
  };
}

export function createShadowBenchmarkReport(results, benchmarkIds) {
  const sorted = [...results].sort((left, right) => left.id.localeCompare(right.id));
  const expectedIds = [...benchmarkIds].sort();
  const actualIds = sorted.map(value => value.id);
  if (stableStringify(expectedIds) !== stableStringify(actualIds)) {
    throw new Error(`Shadow benchmark result ids differ: expected ${expectedIds.join(", ")}, got ${actualIds.join(", ")}`);
  }
  const summary = {
    total: sorted.length,
    equivalent: sorted.filter(value => value.status === "equivalent").length,
    compatible: sorted.filter(value => value.status === "compatible").length,
    divergent: sorted.filter(value => value.status === "divergent").length,
    requiredFailures: sorted.reduce((sum, value) => sum + value.summary.requiredFailures, 0),
    advisoryDifferences: sorted.reduce((sum, value) => sum + value.summary.advisoryDifferences, 0),
    runtimeEvidenceChecks: sorted.reduce((sum, value) => sum + value.summary.runtimeEvidenceChecks, 0),
  };
  const reportRows = sorted.map(value => ({
    id: value.id,
    status: value.status,
    sourceMode: value.sourceMode,
    support: clone(value.support),
    compilerVersion: value.compilerVersion,
    definitionHash: value.definitionHash,
    graphHash: value.graphHash,
    liftedGraphHash: value.liftedGraphHash,
    planHash: value.planHash,
    observationHash: value.observationHash,
    acceptance: clone(value.acceptance),
    summary: clone(value.summary),
    requiredFailures: clone(value.requiredFailures),
    advisoryDifferences: clone(value.advisoryDifferences),
    runtimeEvidence: value.checks
      .filter(check => check.severity === "runtime-evidence")
      .map(check => ({
        path: check.path,
        pass: check.pass,
        note: check.note,
      })),
    compiledActions: value.projection.actions.map(currentAction => compactObject({
      id: currentAction.semanticId,
      sourceActionId: currentAction.sourceActionId,
      delivery: currentAction.delivery,
      visibility: currentAction.visibility,
      activation: clone(currentAction.activation),
      input: currentAction.input,
      activityType: currentAction.activityType,
      target: clone(currentAction.target),
      interaction: clone(currentAction.interaction),
      resolution: clone(currentAction.resolution),
      representation: clone(currentAction.representation),
      providers: clone(currentAction.providers),
    })),
    compiledArtifacts: value.projection.artifacts.map(currentArtifact => compactObject({
      id: currentArtifact.semanticId,
      kind: currentArtifact.kind,
      role: currentArtifact.role,
      identity: clone(currentArtifact.identity),
      lifecycle: clone(currentArtifact.lifecycle),
      provider: currentArtifact.provider,
    })),
    runtimeRules: clone(value.projection.runtimeRules),
    capabilities: clone(value.projection.capabilities),
  }));
  const report = {
    schemaVersion: SPELL_AUTOMATION_SCHEMA_VERSION,
    compilerVersion: SPELL_AUTOMATION_COMPILER_VERSION,
    mode: "shadow",
    mutatesPack: false,
    comparisonPolicy: {
      exactIdentityRequired: false,
      ignored: ["Foundry ids", "names and localization", "field ordering", "provider-private defaults", "images"],
      required: [
        "public action surface",
        "activation and three-input contract",
        "target cardinality/range/template semantics",
        "resource timing",
        "save/attack/damage/healing semantics",
        "mechanical artifact facts",
        "provider ownership markers for runtime-owned rules",
      ],
    },
    benchmarkIds: expectedIds,
    summary,
    spells: reportRows,
  };
  return {
    ...report,
    reportHash: semanticHash(report),
  };
}
