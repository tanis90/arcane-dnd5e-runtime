export const ARCANE_RUNTIME_INVOCATION_SITES = Object.freeze({
  "hook:dnd5e-pre-use-activity:native-summon": {
    evidence: [
      'Hooks.on("dnd5e.preUseActivity", (activity, usageConfig) => {',
      "return prepareNativeSummonUse(activity, usageConfig);",
    ],
  },
  "hook:dnd5e-pre-summon:native-summon": {
    evidence: [
      'Hooks.on("dnd5e.preSummon", (activity, profile, options) => {',
      "return guardNativeSummonPlacement(activity, profile, options);",
    ],
  },
  "hook:dnd5e-summon-token:native-summon": {
    evidence: [
      'Hooks.on("dnd5e.summonToken", (activity, profile, tokenData, options) => {',
      "prepareNativeSummonTokenData(activity, profile, tokenData, options);",
    ],
  },
  "hook:dnd5e-post-summon:native-summon": {
    evidence: [
      'Hooks.on("dnd5e.postSummon", (activity, profile, tokens, options) => {',
      "captureNativeSummonTokens(activity, profile, tokens, options);",
    ],
  },
  "hook:dnd5e-post-use-activity:native-summon": {
    evidence: [
      'Hooks.on("dnd5e.postUseActivity", (activity, usageConfig, results) => {',
      "return captureNativeSummonPostUse(activity, usageConfig, results);",
    ],
  },
  "module-api:finalize-native-summon": {
    evidence: [
      "game.modules.get(MODULE_ID).api = {",
      "finalizeNativeSummonUse,",
    ],
  },
  "complete-item-use:post": {
    evidence: [
      "midi.completeItemUse = async function arcaneCompleteItemUse",
      "await applyCompilerRuntimePostUse(item, usageConfig, workflow);",
    ],
  },
  "hook:midi-pre-attack-config": {
    evidence: ['Hooks.on("midi-qol.preAttackRollConfig"'],
  },
  "hook:midi-pre-item-roll": {
    evidence: [
      'Hooks.on("midi-qol.preItemRollV2"',
      "const block = blockedActionForActor(actor, item, activity)",
      "if (!block) {",
      "return false;",
    ],
  },
  "hook:dnd5e-pre-use-activity:native-control": {
    evidence: [
      'Hooks.on("dnd5e.preUseActivity", (activity, usageConfig) => {',
      "const block = guardNativeSummonControlAction(",
      "const rejection = publishArcaneActionPreflightRejection(",
      "return false;",
    ],
  },
  "hook:midi-pre-damage-roll": {
    evidence: ['Hooks.on("midi-qol.preDamageRoll"'],
  },
  "hook:midi-damage-roll-complete": {
    evidence: ['Hooks.on("midi-qol.DamageRollComplete"'],
  },
  "hook:midi-roll-complete": {
    evidence: [
      'Hooks.on("midi-qol.RollComplete"',
      "await applyCompilerRuntimePostUse(",
    ],
  },
  "hook:midi-pre-target-damage": {
    evidence: ['Hooks.on("midi-qol.preTargetDamageApplication"'],
  },
  "hook:dnd5e-pre-save": {
    evidence: ['Hooks.on("dnd5e.preRollSavingThrow"'],
  },
  "hook:dnd5e-pre-use-activity": {
    evidence: ['Hooks.on("dnd5e.preUseActivity"'],
  },
  "hook:dnd5e-activity-consumption": {
    evidence: [
      'Hooks.on("dnd5e.activityConsumption"',
      "return prepareSourceBoundOneShotConsumption(activity, usageConfig, updates);",
    ],
  },
  "hook:dnd5e-pre-roll-damage": {
    evidence: ['Hooks.on("dnd5e.preRollDamage"'],
  },
  "hook:dnd5e-apply-damage": {
    evidence: ['Hooks.on("dnd5e.applyDamage"'],
  },
  "hook:dnd5e-pre-apply-damage": {
    evidence: [
      'Hooks.on("dnd5e.preApplyDamage"',
      "applyFatalDamageInterceptionPreDamage(actor, amount, updates, options);",
    ],
  },
  "hook:update-actor": {
    evidence: [
      'Hooks.on("updateActor"',
      "settleFatalDamageInterceptions(actor)",
    ],
  },
  "hook:ready-recovery": {
    evidence: [
      'Hooks.once("ready"',
      "recoverFatalDamageInterceptions()",
    ],
  },
  "hook:ready": {
    evidence: [
      'Hooks.once("ready"',
      "patchMidiInstantTemplateRemoval();",
    ],
  },
  "hook:canvas-ready-recovery": {
    evidence: [
      'Hooks.on("canvasReady"',
      "recoverFatalDamageInterceptions()",
    ],
  },
  "hook:update-user-recovery": {
    evidence: [
      'Hooks.on("updateUser"',
      "recoverFatalDamageInterceptions()",
    ],
  },
  "hook:create-active-effect": {
    evidence: ['Hooks.on("createActiveEffect"'],
  },
  "hook:delete-active-effect": {
    evidence: ['Hooks.on("deleteActiveEffect"'],
  },
  "hook:pre-delete-active-effect": {
    evidence: ['Hooks.on("preDeleteActiveEffect"'],
  },
  "hook:update-combat": {
    evidence: ['Hooks.on("updateCombat"'],
  },
  "hook:update-token": {
    evidence: ['Hooks.on("updateToken"'],
  },
  "hook:move-token": {
    evidence: ['Hooks.on("moveToken"'],
  },
});

export const ARCANE_RUNTIME_RULE_ADAPTERS = Object.freeze({
  "owned-weapon-attack-v1": {
    phases: {
      cast: {
        triggers: ["action-used"],
        invocations: [
          {
            handler: "applyOwnedWeaponAttackFromUse",
            site: "complete-item-use:post",
            evidence: [
              "await applyOwnedWeaponAttackFromUse(resolvedItem, usageConfig, workflow);",
            ],
          },
          {
            handler: "preflightOwnedWeaponAttack",
            site: "hook:midi-pre-item-roll",
            evidence: [
              "?? preflightOwnedWeaponAttack(actor, item, activity)",
            ],
          },
        ],
      },
      hit: {
        triggers: ["operation-outcome"],
        invocations: [{
          handler: "applyOwnedWeaponAttackFromUse",
          site: "complete-item-use:post",
          evidence: [
            "await applyOwnedWeaponAttackFromUse(resolvedItem, usageConfig, workflow);",
          ],
        }],
      },
    },
  },
  "reversible-hit-point-capacity-v1": {
    triggers: ["action-used"],
    invocations: [
      {
        handler: "applyReversibleHitPointCapacityFromUse",
        site: "complete-item-use:post",
        evidence: [
          "await applyReversibleHitPointCapacityFromUse(resolvedItem, usageConfig, workflow);",
        ],
      },
      {
        handler: "snapshotReversibleHitPointCapacityDelete",
        site: "hook:pre-delete-active-effect",
        evidence: ["snapshotReversibleHitPointCapacityDelete(effect, options);"],
      },
      {
        handler: "cleanupReversibleHitPointCapacity",
        site: "hook:delete-active-effect",
        evidence: ["cleanupReversibleHitPointCapacity(effect, options),"],
      },
    ],
  },
  "required-selection-outcome-v1": {
    triggers: ["operation-outcome"],
    invocations: [{
      handler: "applyRequiredSelectionOutcomesFromUse",
      site: "complete-item-use:post",
      evidence: [
        "await applyRequiredSelectionOutcomesFromUse(resolvedItem, usageConfig, workflow);",
      ],
    }],
  },
  "workflow-outcome-activity-v1": {
    triggers: ["operation-outcome"],
    activityBinding: "defines",
    invocations: [{
      handler: "applyCompilerWorkflowOutcomeActivities",
      site: "complete-item-use:post",
      evidence: [
        "await applyCompilerWorkflowOutcomeActivities(",
      ],
    }],
  },
  "triggered-event-activity-v1": {
    triggers: ["operation-complete"],
    activityBinding: "defines",
    invocations: [{
      handler: "inheritCompilerTriggeredActivityScaling",
      site: "hook:dnd5e-pre-use-activity",
      evidence: [
        "inheritCompilerTriggeredActivityScaling(activity, usageConfig);",
      ],
    }],
  },
  "status-effect-suppression-v1": {
    triggers: ["operation-outcome"],
    invocations: [
      {
        handler: "applyRequiredSelectionOutcomesFromUse",
        site: "complete-item-use:post",
        evidence: [
          "await applyRequiredSelectionOutcomesFromUse(resolvedItem, usageConfig, workflow);",
        ],
      },
      {
        handler: "restoreSuppressedStatusEffects",
        site: "hook:delete-active-effect",
        evidence: ["restoreSuppressedStatusEffects(effect, options),"],
      },
    ],
  },
  "temporary-hit-points-retaliation-v1": {
    phases: {
      cast: {
        triggers: ["action-used"],
        invocations: [{
          handler: "captureTemporaryHitPointsRetaliationCast",
          site: "complete-item-use:post",
          evidence: [
            "await captureTemporaryHitPointsRetaliationCast(resolvedItem, usageConfig, workflow);",
          ],
        }],
      },
      retaliation: {
        triggers: ["damage-taken"],
        invocations: [
          {
            handler: "applyTemporaryHitPointsRetaliation",
            site: "hook:midi-pre-target-damage",
            evidence: ["await applyTemporaryHitPointsRetaliation(target, context);"],
          },
          {
            handler: "cleanupTemporaryHitPointsRetaliationAfterDamage",
            site: "hook:dnd5e-apply-damage",
            evidence: ["cleanupTemporaryHitPointsRetaliationAfterDamage(actor),"],
          },
        ],
      },
    },
  },
  "effect-host-hit-by-attack-v1": {
    phases: {
      cast: {
        triggers: ["action-used"],
        invocations: [{
          handler: "captureEffectHostHitByAttackCast",
          site: "complete-item-use:post",
          evidence: [
            "await captureEffectHostHitByAttackCast(resolvedItem, usageConfig, workflow);",
          ],
        }],
      },
      retaliation: {
        triggers: ["operation-outcome"],
        invocations: [
          {
            handler: "captureEffectHostHitByAttackBeforeDamage",
            site: "hook:midi-pre-target-damage",
            evidence: [
              "await captureEffectHostHitByAttackBeforeDamage(target, context);",
            ],
          },
          {
            handler: "resolveEffectHostHitByAttack",
            site: "hook:midi-roll-complete",
            evidence: ["await resolveEffectHostHitByAttack(workflow);"],
          },
          {
            handler: "cleanupEffectHostHitByAttackAfterDamage",
            site: "hook:dnd5e-apply-damage",
            evidence: ["cleanupEffectHostHitByAttackAfterDamage(actor),"],
          },
          {
            handler: "cleanupEffectHostHitByAttackOnDelete",
            site: "hook:delete-active-effect",
            evidence: ["cleanupEffectHostHitByAttackOnDelete(effect, options),"],
          },
        ],
      },
    },
  },
  "source-artifact-dismiss-v1": {
    triggers: ["action-used"],
    invocations: [{
      handler: "applySourceArtifactDismissFromUse",
      site: "complete-item-use:post",
      evidence: [
        "await applySourceArtifactDismissFromUse(resolvedItem, usageConfig, workflow);",
      ],
    }],
  },
  "source-bound-one-shot-v1": {
    triggers: ["action-used"],
    invocations: [
      {
        handler: "prepareSourceBoundOneShotConsumption",
        site: "hook:dnd5e-activity-consumption",
        evidence: [
          "return prepareSourceBoundOneShotConsumption(activity, usageConfig, updates);",
        ],
      },
      {
        handler: "applySourceBoundOneShotFromUse",
        site: "complete-item-use:post",
        evidence: [
          "const sourceBoundOneShotCompletion = await applySourceBoundOneShotFromUse(",
        ],
      },
    ],
  },
  "cast-origin-static-marker-v1": {
    triggers: ["action-used"],
    invocations: [
      {
        handler: "applyCastOriginStaticMarkerFromUse",
        site: "complete-item-use:post",
        evidence: [
          "await applyCastOriginStaticMarkerFromUse(resolvedItem, usageConfig, workflow);",
        ],
      },
      {
        handler: "patchMidiInstantTemplateRemoval",
        site: "hook:ready",
        evidence: ["patchMidiInstantTemplateRemoval();"],
      },
    ],
  },
  "declared-weapon-spell-rider-v1": {
    handler: "applyDeclaredWeaponSpellRider",
  },
  "marked-target-parent-damage-v1": {
    triggers: ["operation-outcome"],
    invocations: [
      {
        handler: "prepareMarkedTargetParentDamage",
        site: "hook:midi-pre-damage-roll",
        evidence: ["await prepareMarkedTargetParentDamage(workflow, activity, config);"],
      },
      {
        handler: "finalizeParentDamageRiders",
        site: "hook:midi-damage-roll-complete",
        evidence: ["await finalizeParentDamageRiders(workflow);"],
      },
    ],
  },
  "source-armed-attack-transform-v1": {
    phases: {
      arm: {
        triggers: ["action-used"],
        invocations: [{
          handler: "applySourceArmedAttackTransformFromUse",
          site: "complete-item-use:post",
          evidence: [
            "await applySourceArmedAttackTransformFromUse(",
          ],
        }],
      },
      "hit-activity": {
        triggers: ["operation-complete"],
        activityBinding: "defines",
        invocations: [{
          handler: "resolveSourceArmedAttackTransform",
          site: "hook:midi-roll-complete",
          evidence: ["await resolveSourceArmedAttackTransform(workflow);"],
        }],
      },
      "miss-activity": {
        triggers: ["operation-complete"],
        activityBinding: "defines",
        invocations: [{
          handler: "resolveSourceArmedAttackTransform",
          site: "hook:midi-roll-complete",
          evidence: ["await resolveSourceArmedAttackTransform(workflow);"],
        }],
      },
      hit: {
        triggers: ["operation-outcome"],
        invocations: [
          {
            handler: "prepareSourceArmedAttackTransformAttack",
            site: "hook:midi-pre-attack-config",
            evidence: ["prepareSourceArmedAttackTransformAttack(workflow);"],
          },
          {
            handler: "prepareSourceArmedAttackTransformDamage",
            site: "hook:midi-pre-damage-roll",
            evidence: [
              "await prepareSourceArmedAttackTransformDamage(workflow, config);",
            ],
          },
          {
            handler: "applySourceArmedAttackTransformDamageConfig",
            site: "hook:dnd5e-pre-roll-damage",
            evidence: ["applySourceArmedAttackTransformDamageConfig(config);"],
          },
          {
            handler: "resolveSourceArmedAttackTransform",
            site: "hook:midi-roll-complete",
            evidence: ["await resolveSourceArmedAttackTransform(workflow);"],
          },
        ],
      },
      miss: {
        triggers: ["operation-outcome"],
        invocations: [
          {
            handler: "prepareSourceArmedAttackTransformAttack",
            site: "hook:midi-pre-attack-config",
            evidence: ["prepareSourceArmedAttackTransformAttack(workflow);"],
          },
          {
            handler: "prepareSourceArmedAttackTransformDamage",
            site: "hook:midi-pre-damage-roll",
            evidence: [
              "await prepareSourceArmedAttackTransformDamage(workflow, config);",
            ],
          },
          {
            handler: "applySourceArmedAttackTransformDamageConfig",
            site: "hook:dnd5e-pre-roll-damage",
            evidence: ["applySourceArmedAttackTransformDamageConfig(config);"],
          },
          {
            handler: "resolveSourceArmedAttackTransform",
            site: "hook:midi-roll-complete",
            evidence: ["await resolveSourceArmedAttackTransform(workflow);"],
          },
        ],
      },
    },
  },
  "source-attack-proximity-rider-v1": {
    triggers: ["operation-outcome"],
    invocations: [
      {
        handler: "prepareSourceAttackProximityRider",
        site: "hook:midi-pre-damage-roll",
        evidence: ["await prepareSourceAttackProximityRider(workflow, activity, config);"],
      },
      {
        handler: "finalizeParentDamageRiders",
        site: "hook:midi-damage-roll-complete",
        evidence: ["await finalizeParentDamageRiders(workflow);"],
      },
      {
        handler: "finalizeSourceAttackProximityRiders",
        site: "hook:midi-damage-roll-complete",
        evidence: ["await finalizeSourceAttackProximityRiders(workflow);"],
      },
    ],
  },
  "source-turn-start-proximity-effect-v1": {
    triggers: ["turn-start"],
    invocations: [{
      handler: "applySourceTurnStartProximityEffect",
      site: "hook:update-combat",
      evidence: ["await applySourceTurnStartProximityEffect(combat, changed);"],
    }],
  },
  "declared-active-buff-v1": {
    phases: {
      "attack-config": {
        triggers: ["attack-roll-config"],
        invocations: [{
          handler: "applyDeclaredActiveBuffAttackConfig",
          site: "hook:midi-pre-attack-config",
          evidence: ["applyDeclaredActiveBuffAttackConfig(workflow);"],
        }],
      },
      "resolve-hit": {
        triggers: ["operation-outcome"],
        invocations: [
          {
            handler: "prepareDeclaredActiveBuffDamage",
            site: "hook:midi-pre-damage-roll",
            evidence: ["await prepareDeclaredActiveBuffDamage(workflow, activity, config);"],
          },
          {
            handler: "finalizeParentDamageRiders",
            site: "hook:midi-damage-roll-complete",
            evidence: ["await finalizeParentDamageRiders(workflow);"],
          },
          {
            handler: "finalizeDeclaredActiveBuff",
            site: "complete-item-use:post",
            evidence: ["await finalizeDeclaredActiveBuff(workflow);"],
          },
        ],
      },
      "resolve-miss": {
        triggers: ["operation-outcome"],
        invocations: [{
          handler: "finalizeDeclaredActiveBuff",
          site: "complete-item-use:post",
          evidence: ["await finalizeDeclaredActiveBuff(workflow);"],
        }],
      },
    },
  },
  "damage-triggered-repeat-save-v1": {
    phases: {
      damage: {
        triggers: ["damage-taken"],
        activityBinding: "defines-or-uses",
        invocations: [
          {
            handler: "applyDamageTriggeredRepeatSave",
            site: "hook:midi-pre-target-damage",
            evidence: ["await applyDamageTriggeredRepeatSave(target, context);"],
          },
          {
            handler: "applyTriggeredRepeatSaveRollMode",
            site: "hook:dnd5e-pre-save",
            evidence: ["applyTriggeredRepeatSaveRollMode(config, message);"],
          },
        ],
      },
      "success-cleanup": {
        triggers: ["operation-outcome"],
        activityBinding: "uses",
        invocations: [{
          handler: "applyDamageTriggeredRepeatSave",
          site: "hook:midi-pre-target-damage",
          evidence: ["await applyDamageTriggeredRepeatSave(target, context);"],
        }],
      },
    },
  },
  "outcome-race-v1": {
    phases: {
      entry: {
        triggers: ["action-used"],
        invocations: [{
          handler: "dispatchOutcomeRaceActivity",
          site: "complete-item-use:post",
          evidence: [
            "await dispatchOutcomeRaceActivity(resolvedItem, workflow);",
          ],
        }],
      },
      repeat: {
        triggers: ["turn-end"],
        activityBinding: "defines",
        invocations: [
          {
            handler: "dispatchOutcomeRaceActivity",
            site: "complete-item-use:post",
            evidence: [
              "await dispatchOutcomeRaceActivity(resolvedItem, workflow);",
            ],
          },
          {
            handler: "applyOutcomeRaceNaturalExpiry",
            site: "hook:delete-active-effect",
            evidence: ["applyOutcomeRaceNaturalExpiry(effect, options),"],
          },
        ],
      },
    },
  },
  "zone-event-activity-v1": {
    phases: {
      entry: {
        triggers: ["enter"],
        activityBinding: "uses",
        invocations: [{
          handler: "handleCompilerZoneTokenMoved",
          site: "hook:move-token",
          evidence: ["handleCompilerZoneTokenMoved(token, movement).catch"],
        }],
      },
      "turn-start": {
        triggers: ["turn-start"],
        activityBinding: "defines",
        invocations: [{
          handler: "applyCompilerZoneTurnStart",
          site: "hook:update-combat",
          evidence: ["await applyCompilerZoneTurnStart(combat, changed);"],
        }],
      },
      "turn-end": {
        triggers: ["turn-end"],
        activityBinding: "defines",
        invocations: [{
          handler: "applyCompilerZoneTurnEnd",
          site: "hook:update-combat",
          evidence: ["await applyCompilerZoneTurnEnd(combat, changed);"],
        }],
      },
      "leave-cleanup": {
        triggers: ["leave"],
        invocations: [{
          handler: "cleanupCompilerZoneLeaveArtifacts",
          site: "hook:delete-active-effect",
          evidence: ["cleanupCompilerZoneLeaveArtifacts(effect, options)"],
        }],
      },
    },
  },
  "following-aura-event-activity-v1": {
    phases: {
      entry: {
        triggers: ["enter"],
        activityBinding: "uses",
        invocations: [{
          handler: "handleCompilerFollowingAuraTokenMoved",
          site: "hook:move-token",
          evidence: ["handleCompilerFollowingAuraTokenMoved(token, movement).catch"],
        }],
      },
      "turn-start": {
        triggers: ["turn-start"],
        activityBinding: "defines",
        invocations: [{
          handler: "applyCompilerFollowingAuraTurnStart",
          site: "hook:update-combat",
          evidence: ["await applyCompilerFollowingAuraTurnStart(combat, changed);"],
        }],
      },
    },
  },
  "placed-point-move-token-v1": {
    handler: "applyPlacedPointMoveTokenFromUse",
  },
  "target-status-removal-v1": {
    invocations: [{
      handler: "applyTargetStatusRemovalFromUse",
      site: "hook:midi-roll-complete",
      via: ["applyRestorationSpellAutomation", "applyCompilerRuntimePostUse"],
      evidence: [
        "await applyRestorationSpellAutomation(resolvedItem, usageConfig, workflow);",
        "if (await applyTargetStatusRemovalFromUse(item, usageConfig, workflow)) return true;",
      ],
    }],
  },
  "workflow-outcome-operations-v1": {
    triggers: ["operation-outcome"],
    invocations: [{
      handler: "applyCompilerWorkflowOutcomeOperations",
      site: "hook:midi-roll-complete",
      evidence: ["await applyCompilerWorkflowOutcomeOperations(resolvedItem, usageConfig, workflow);"],
    }],
  },
  "workflow-outcome-forced-movement-v1": {
    triggers: ["operation-outcome"],
    invocations: [{
      handler: "applyCompilerWorkflowOutcomeForcedMovement",
      site: "hook:midi-roll-complete",
      evidence: [
        "await applyCompilerWorkflowOutcomeForcedMovement(",
      ],
    }],
  },
  "source-target-damage-mirror-v1": {
    phases: {
      bind: {
        triggers: ["action-used"],
        invocations: [
          {
            handler: "bindSourceTargetDamageMirrorFromUse",
            site: "complete-item-use:post",
            evidence: [
              "await bindSourceTargetDamageMirrorFromUse(resolvedItem, usageConfig, workflow);",
            ],
          },
          {
            handler: "cleanupSourceTargetDamageMirrorCounterpart",
            site: "hook:delete-active-effect",
            evidence: ["cleanupSourceTargetDamageMirrorCounterpart(effect),"],
          },
        ],
      },
      mirror: {
        triggers: ["damage-taken"],
        invocations: [{
          handler: "mirrorSourceTargetDamage",
          site: "hook:dnd5e-apply-damage",
          evidence: ["mirrorSourceTargetDamage(actor, amount, options),"],
        }],
      },
    },
  },
  "damage-mirror-heal-source-v1": {
    handler: "applyDamageMirrorHealSourceFromUse",
    invocations: [{
      handler: "applyDamageMirrorHealSourceFromUse",
      site: "hook:midi-roll-complete",
      evidence: [
        "await applyDamageMirrorHealSourceFromUse(workflow?.activity?.item ?? workflow?.item, null, workflow);",
      ],
    }],
  },
  "artifact-ended-outcome-v1": {
    handler: "applyCompilerArtifactEndedOutcomes",
    invocations: [{
      handler: "applyCompilerArtifactEndedOutcomes",
      site: "hook:delete-active-effect",
      evidence: ["applyCompilerArtifactEndedOutcomes(effect, options),"],
    }],
  },
  "source-turn-check-v1": {
    handler: "applyCompilerSourceTurnChecks",
    invocations: [{
      handler: "applyCompilerSourceTurnChecks",
      site: "hook:update-combat",
      evidence: ["applyCompilerSourceTurnChecks(combat, changed,"],
    }],
  },
  "temporary-hit-points-source-v1": {
    phases: {
      bind: {
        triggers: ["action-used"],
        invocations: [
          {
            handler: "bindTemporaryHitPointsSourcesFromUse",
            site: "complete-item-use:post",
            evidence: [
              "await bindTemporaryHitPointsSourcesFromUse(resolvedItem, usageConfig, workflow);",
            ],
          },
          {
            handler: "cleanupTemporaryHitPointsSourceOnDelete",
            site: "hook:delete-active-effect",
            evidence: ["cleanupTemporaryHitPointsSourceOnDelete(effect, options),"],
          },
        ],
      },
      depleted: {
        triggers: ["temporary-hit-points-depleted"],
        invocations: [{
          handler: "cleanupTemporaryHitPointsSourcesAfterDamage",
          site: "hook:dnd5e-apply-damage",
          evidence: ["cleanupTemporaryHitPointsSourcesAfterDamage(actor),"],
        }],
      },
    },
  },
  "temporary-hit-points-refresh-v1": {
    phases: {
      refresh: {
        triggers: ["turn-start"],
        invocations: [{
          handler: "refreshTemporaryHitPointsSourcesAtTurnStart",
          site: "hook:update-combat",
          evidence: ["await refreshTemporaryHitPointsSourcesAtTurnStart(combat, changed);"],
        }],
      },
    },
  },
  "magic-weapon-enchantment-v1": {
    phases: {
      "cast-lifecycle": {
        triggers: ["action-used"],
        invocations: [
          {
            handler: "applyMagicWeaponFromUse",
            site: "complete-item-use:post",
            via: ["applyLevel12SpellPostUse"],
            evidence: [
              "await applyLevel12SpellPostUse(item, usageConfig, workflow);",
              "await applyMagicWeaponFromUse(item, usageConfig, workflow);",
            ],
          },
          {
            handler: "cleanupMagicWeaponFromSource",
            site: "hook:delete-active-effect",
            evidence: ["cleanupMagicWeaponFromSource(effect),"],
          },
        ],
      },
    },
  },
  "weapon-enchantment-v1": {
    phases: {
      "cast-lifecycle": {
        triggers: ["action-used"],
        activityBinding: "defines",
        invocations: [{
          handler: "applyWeaponEnchantmentFromUse",
          site: "complete-item-use:post",
          via: ["applyCompilerRuntimePostUse"],
          evidence: [
            "await applyCompilerRuntimePostUse(item, usageConfig, workflow);",
            "await applyWeaponEnchantmentFromUse(resolvedItem, usageConfig, workflow);",
          ],
        }],
      },
    },
  },
  "life-transference-v1": {
    phases: {
      cast: {
        triggers: ["action-used"],
        invocations: [{
          handler: "applyLifeTransferenceFromUse",
          site: "complete-item-use:post",
          evidence: ["await applyLifeTransferenceFromUse(item, usageConfig, workflow);"],
        }],
      },
    },
  },
  "linked-operation-results-v1": {
    requiresActivityIdentifier: false,
    invocations: [{
      handler: "applyLinkedOperationResultsFromUse",
      site: "hook:midi-roll-complete",
      evidence: ["await applyLinkedOperationResultsFromUse(resolvedItem, usageConfig, workflow);"],
    }],
  },
  "external-operation-artifact-transition-v1": {
    phases: {
      apply: {
        triggers: ["operation-outcome"],
        invocations: [
          {
            handler: "captureExternalOperationArtifactTransitionsBeforeDamage",
            site: "hook:midi-pre-target-damage",
            evidence: ["captureExternalOperationArtifactTransitionsBeforeDamage(target, context);"],
          },
          {
            handler: "resolveExternalOperationArtifactTransitions",
            site: "hook:midi-roll-complete",
            evidence: ["await resolveExternalOperationArtifactTransitions(workflow);"],
          },
        ],
      },
      consume: {
        triggers: ["operation-outcome"],
        invocations: [{
          handler: "consumeExternalOperationArtifactTransitions",
          site: "hook:midi-roll-complete",
          evidence: ["await consumeExternalOperationArtifactTransitions(workflow);"],
        }],
      },
    },
  },
  "sleep-hit-point-pool-v1": {
    phases: {
      cast: {
        triggers: ["action-used"],
        invocations: [{
          handler: "applySleepFromUse",
          site: "complete-item-use:post",
          via: ["applyLevel12SpellPostUse"],
          evidence: [
            "await applyLevel12SpellPostUse(item, usageConfig, workflow);",
            "await applySleepFromUse(item, usageConfig, workflow);",
          ],
        }],
      },
    },
  },
  "hit-point-pool-allocator-v1": {
    requiresActivityIdentifier: false,
    triggers: ["action-used"],
    invocations: [{
      handler: "applyHitPointPoolAllocatorFromUse",
      site: "complete-item-use:post",
      evidence: [
        "await applyHitPointPoolAllocatorFromUse(resolvedItem, usageConfig, workflow);",
      ],
    }],
  },
  "spirit-shroud-hit-v1": {
    phases: {
      hit: {
        triggers: ["operation-outcome"],
        invocations: [{
          handler: "applySpiritShroudDamageBonus",
          site: "complete-item-use:post",
          evidence: ["await applySpiritShroudDamageBonus(workflow);"],
        }],
      },
    },
  },
  "spirit-shroud-turn-start-v1": {
    phases: {
      "turn-start": {
        triggers: ["turn-start"],
        invocations: [{
          handler: "applySpiritShroudTurnStart",
          site: "hook:update-combat",
          evidence: ["await applySpiritShroudTurnStart(combat, changed);"],
        }],
      },
    },
  },
  "native-summon": {
    triggers: ["action-used"],
    invocations: [
      {
        handler: "prepareNativeSummonUse",
        site: "hook:dnd5e-pre-use-activity:native-summon",
      },
      {
        handler: "guardNativeSummonPlacement",
        site: "hook:dnd5e-pre-summon:native-summon",
      },
      {
        handler: "prepareNativeSummonTokenData",
        site: "hook:dnd5e-summon-token:native-summon",
      },
      {
        handler: "captureNativeSummonTokens",
        site: "hook:dnd5e-post-summon:native-summon",
      },
      {
        handler: "captureNativeSummonPostUse",
        site: "hook:dnd5e-post-use-activity:native-summon",
      },
      {
        handler: "finalizeNativeSummonUse",
        site: "module-api:finalize-native-summon",
      },
    ],
  },
  "native-summon-control-v1": {
    triggers: ["action-used"],
    invocations: [
      {
        handler: "guardNativeSummonControlAction",
        site: "hook:midi-pre-item-roll",
        evidence: [
          "guardNativeSummonControlAction(actor, item, activity, workflow);",
        ],
      },
      {
        handler: "guardNativeSummonControlAction",
        site: "hook:dnd5e-pre-use-activity:native-control",
        evidence: [
          "const block = guardNativeSummonControlAction(\n        actor,\n        item,\n        activity,\n        workflow,\n        usageConfig,",
        ],
      },
      {
        handler: "applyNativeSummonControlFromUse",
        site: "complete-item-use:post",
        evidence: [
          "await applyNativeSummonControlFromUse(resolvedItem, usageConfig, workflow);",
        ],
      },
    ],
  },
  "typed-damage-dispatcher-v2": {
    triggers: ["action-used"],
    invocations: [
      {
        handler: "prepareBoundedDamageTransaction",
        site: "hook:midi-pre-target-damage",
        evidence: ["await prepareBoundedDamageTransaction(target, context);"],
      },
      {
        handler: "applyBoundedDamageTransactionPreDamage",
        site: "hook:dnd5e-pre-apply-damage",
        evidence: ["applyBoundedDamageTransactionPreDamage(actor, amount, updates, options)"],
      },
      {
        handler: "settleBoundedDamageTransactions",
        site: "hook:dnd5e-apply-damage",
        evidence: ["settleBoundedDamageTransactions(actor)"],
      },
      {
        handler: "recoverBoundedDamageTransactions",
        site: "hook:ready-recovery",
        evidence: ["recoverBoundedDamageTransactions()"],
      },
    ],
  },
});

export const ARCANE_RUNTIME_ARTIFACT_ADAPTERS = Object.freeze({
  "fatal-damage-interception-v1": {
    modifier: "fatal-damage-interception",
    invocations: [
      {
        handler: "applyFatalDamageInterceptionPreDamage",
        site: "hook:dnd5e-pre-apply-damage",
      },
      {
        handler: "settleFatalDamageInterceptions",
        site: "hook:update-actor",
      },
      {
        handler: "settleFatalDamageInterceptions",
        site: "hook:dnd5e-apply-damage",
      },
      {
        handler: "recoverFatalDamageInterceptions",
        site: "hook:ready-recovery",
      },
      {
        handler: "recoverFatalDamageInterceptions",
        site: "hook:canvas-ready-recovery",
      },
      {
        handler: "recoverFatalDamageInterceptions",
        site: "hook:update-user-recovery",
      },
    ],
  },
  "cast-origin-static-marker-v1": {
    invocations: [
      {
        handler: "applyCastOriginStaticMarkerFromUse",
        site: "complete-item-use:post",
      },
      {
        handler: "patchMidiInstantTemplateRemoval",
        site: "hook:ready",
      },
    ],
  },
});
