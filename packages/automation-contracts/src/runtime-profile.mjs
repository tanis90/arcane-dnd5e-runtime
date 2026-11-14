export const SPELL_AUTOMATION_RUNTIME_PROFILE_VERSION = 1;

const DEFAULT_ACTIVITY_MIDI_POLICY = Object.freeze({
  forceConsumeDialog: "never",
  forceRollDialog: "never",
  forceDamageDialog: "never",
  confirmTargets: "never",
  chooseEffects: false,
  removeChatButtons: "all",
});

export const ARCANE_DND5E_2014_RUNTIME_PROFILE = Object.freeze({
  id: "arcane-dnd5e-2014",
  version: SPELL_AUTOMATION_RUNTIME_PROFILE_VERSION,
  ruleset: "2014",
  system: Object.freeze({
    id: "dnd5e",
    majorVersion: 5,
  }),
  providers: Object.freeze({
    workflow: "midi-qol",
    effects: "dae",
    auras: Object.freeze(["ActiveAuras", "aura-effects"]),
  }),
  expressions: Object.freeze({
    castLevel: "@item.level",
    spellcastingModifier: "@mod",
  }),
  itemDefaults: Object.freeze({
    ability: "",
    method: "spell",
    prepared: 0,
  }),
  activityDefaults: DEFAULT_ACTIVITY_MIDI_POLICY,
  effectDefaults: Object.freeze({
    reapply: "replace",
  }),
});

// 2024 内容线运行在与 2014 相同的系统与 Foundry 供给（midi-qol/DAE/AA）上；
// 差异只在内容（ruleset 标识与法术语义），故 profile 与 2014 同形、id/ruleset 不同。
// 引自 auto2024 M1.1（docs/design/auto2024-m1-spell-audit.md）。
export const ARCANE_DND5E_2024_RUNTIME_PROFILE = Object.freeze({
  id: "arcane-dnd5e-2024",
  version: SPELL_AUTOMATION_RUNTIME_PROFILE_VERSION,
  ruleset: "2024",
  system: ARCANE_DND5E_2014_RUNTIME_PROFILE.system,
  providers: ARCANE_DND5E_2014_RUNTIME_PROFILE.providers,
  expressions: ARCANE_DND5E_2014_RUNTIME_PROFILE.expressions,
  itemDefaults: ARCANE_DND5E_2014_RUNTIME_PROFILE.itemDefaults,
  activityDefaults: DEFAULT_ACTIVITY_MIDI_POLICY,
  effectDefaults: ARCANE_DND5E_2014_RUNTIME_PROFILE.effectDefaults,
});

function runtimeProfileBase(ruleset) {
  if (ruleset === undefined || ruleset === "2014") return ARCANE_DND5E_2014_RUNTIME_PROFILE;
  if (ruleset === "2024") return ARCANE_DND5E_2024_RUNTIME_PROFILE;
  throw new Error(`runtimeProfile.ruleset is unsupported: ${String(ruleset)}`);
}

function assertKnownKeys(value, allowed, path) {
  if (value === undefined) return;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${path} must be an object`);
  }
  const unknown = Object.keys(value).filter(key => !allowed.includes(key));
  if (unknown.length > 0) {
    throw new Error(`${path} has unknown field(s): ${unknown.join(", ")}`);
  }
}

function assertOneOf(value, allowed, path) {
  if (!allowed.includes(value)) {
    throw new Error(`${path} must be one of ${allowed.join(", ")}`);
  }
}

function assertFixedObject(actual, expected, path) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${path} is fixed by runtime profile version 1`);
  }
}

export function resolveSpellAutomationRuntimeProfile(profile = {}) {
  if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
    throw new TypeError("Spell automation runtime profile must be an object");
  }
  assertKnownKeys(
    profile,
    [
      "id",
      "version",
      "ruleset",
      "system",
      "providers",
      "expressions",
      "itemDefaults",
      "activityDefaults",
      "effectDefaults",
    ],
    "runtimeProfile",
  );
  assertKnownKeys(profile.system, ["id", "majorVersion"], "runtimeProfile.system");
  assertKnownKeys(
    profile.providers,
    ["workflow", "effects", "auras"],
    "runtimeProfile.providers",
  );
  assertKnownKeys(
    profile.expressions,
    ["castLevel", "spellcastingModifier"],
    "runtimeProfile.expressions",
  );
  assertKnownKeys(
    profile.itemDefaults,
    ["ability", "method", "prepared"],
    "runtimeProfile.itemDefaults",
  );
  assertKnownKeys(
    profile.activityDefaults,
    [
      "forceConsumeDialog",
      "forceRollDialog",
      "forceDamageDialog",
      "confirmTargets",
      "chooseEffects",
      "removeChatButtons",
    ],
    "runtimeProfile.activityDefaults",
  );
  assertKnownKeys(profile.effectDefaults, ["reapply"], "runtimeProfile.effectDefaults");
  const base = runtimeProfileBase(profile.ruleset);
  const resolved = {
    ...base,
    ...profile,
    system: {
      ...base.system,
      ...(profile.system ?? {}),
    },
    providers: {
      ...base.providers,
      ...(profile.providers ?? {}),
    },
    expressions: {
      ...base.expressions,
      ...(profile.expressions ?? {}),
    },
    itemDefaults: {
      ...base.itemDefaults,
      ...(profile.itemDefaults ?? {}),
    },
    activityDefaults: {
      ...base.activityDefaults,
      ...(profile.activityDefaults ?? {}),
    },
    effectDefaults: {
      ...base.effectDefaults,
      ...(profile.effectDefaults ?? {}),
    },
  };
  if (resolved.version !== SPELL_AUTOMATION_RUNTIME_PROFILE_VERSION) {
    throw new Error(
      `Runtime profile version must be exactly ${SPELL_AUTOMATION_RUNTIME_PROFILE_VERSION}`,
    );
  }
  if (
    resolved.system.id !== "dnd5e"
    || resolved.system.majorVersion !== 5
    || resolved.id !== runtimeProfileBase(resolved.ruleset).id
  ) {
    throw new Error(
      "Runtime profile target must remain arcane-dnd5e-2014/2024 / dnd5e 5.x / id 与 ruleset 配对一致",
    );
  }
  assertFixedObject(
    resolved.providers,
    ARCANE_DND5E_2014_RUNTIME_PROFILE.providers,
    "runtimeProfile.providers",
  );
  assertFixedObject(
    resolved.effectDefaults,
    ARCANE_DND5E_2014_RUNTIME_PROFILE.effectDefaults,
    "runtimeProfile.effectDefaults",
  );
  if (
    typeof resolved.expressions.castLevel !== "string"
    || !resolved.expressions.castLevel
    || typeof resolved.expressions.spellcastingModifier !== "string"
    || !resolved.expressions.spellcastingModifier
  ) {
    throw new Error("runtimeProfile expressions must be non-empty strings");
  }
  assertOneOf(resolved.itemDefaults.method, ["spell", "atwill"], "runtimeProfile.itemDefaults.method");
  assertOneOf(
    resolved.itemDefaults.ability,
    ["", "str", "dex", "con", "int", "wis", "cha"],
    "runtimeProfile.itemDefaults.ability",
  );
  if (
    !Number.isInteger(resolved.itemDefaults.prepared)
    || ![0, 1, 2].includes(resolved.itemDefaults.prepared)
  ) {
    throw new Error("runtimeProfile.itemDefaults.prepared must be 0, 1, or 2");
  }
  for (const key of [
    "forceConsumeDialog",
    "forceRollDialog",
    "forceDamageDialog",
    "confirmTargets",
  ]) {
    assertOneOf(
      resolved.activityDefaults[key],
      ["default", "never", "always"],
      `runtimeProfile.activityDefaults.${key}`,
    );
  }
  if (typeof resolved.activityDefaults.chooseEffects !== "boolean") {
    throw new Error("runtimeProfile.activityDefaults.chooseEffects must be boolean");
  }
  assertOneOf(
    resolved.activityDefaults.removeChatButtons,
    ["default", "all", "none"],
    "runtimeProfile.activityDefaults.removeChatButtons",
  );
  return resolved;
}
