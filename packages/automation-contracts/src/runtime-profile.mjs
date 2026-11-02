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
  const resolved = {
    ...ARCANE_DND5E_2014_RUNTIME_PROFILE,
    ...profile,
    system: {
      ...ARCANE_DND5E_2014_RUNTIME_PROFILE.system,
      ...(profile.system ?? {}),
    },
    providers: {
      ...ARCANE_DND5E_2014_RUNTIME_PROFILE.providers,
      ...(profile.providers ?? {}),
    },
    expressions: {
      ...ARCANE_DND5E_2014_RUNTIME_PROFILE.expressions,
      ...(profile.expressions ?? {}),
    },
    itemDefaults: {
      ...ARCANE_DND5E_2014_RUNTIME_PROFILE.itemDefaults,
      ...(profile.itemDefaults ?? {}),
    },
    activityDefaults: {
      ...ARCANE_DND5E_2014_RUNTIME_PROFILE.activityDefaults,
      ...(profile.activityDefaults ?? {}),
    },
    effectDefaults: {
      ...ARCANE_DND5E_2014_RUNTIME_PROFILE.effectDefaults,
      ...(profile.effectDefaults ?? {}),
    },
  };
  if (resolved.version !== SPELL_AUTOMATION_RUNTIME_PROFILE_VERSION) {
    throw new Error(
      `Runtime profile version must be exactly ${SPELL_AUTOMATION_RUNTIME_PROFILE_VERSION}`,
    );
  }
  if (
    resolved.id !== ARCANE_DND5E_2014_RUNTIME_PROFILE.id
    || resolved.ruleset !== "2014"
    || resolved.system.id !== "dnd5e"
    || resolved.system.majorVersion !== 5
  ) {
    throw new Error(
      "Runtime profile target must remain arcane-dnd5e-2014 / dnd5e 5.x / 2014 rules",
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
