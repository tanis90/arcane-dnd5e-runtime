// Reviewed product boundary. These roots belong to careers, ancestry, house
// rules or character-builder UI, not the independently installed spell runtime.
export const excludedRuntimeRoots = new Set([
  'patchActorStudioArcaneSpellPack', 'configureActorStudioSpellSource',
  'hideFthCharacterCreatorControl', 'hideCurrentFthCharacterCreatorControl',
  'hideNativeActorCreateButton', 'injectBg3ShortRestButton', 'injectBg3ShortRestButtonsIntoOpenSheets',
  'configureMidiQolFullAutomationSettings', 'migrateCharacterSpellInteractionContracts',
  'preventDuplicateArcaneFeatCreate', 'handleRangerTcePatchCreate', 'applyRangerTceOptionalFeaturesPatch',
  'prepareTurnUndeadTargetsForUse', 'prepareTwilightSanctuaryTargetsForUse', 'prepareAasimarNecroticShroudTargetsForUse',
  'applyDeclaredPowerAttackBeforeUse', 'cleanupDeclaredPowerAttackEffect',
  'hasVowOfEnmityMarker', 'applyVowOfEnmityAdvantage', 'applyVowOfEnmityMarker', 'applyVowOfEnmityMarkerFromUse',
  'applyDeclaredDivineSmite', 'applyDeclaredSneakAttack', 'applyDeclaredDreadAmbusher',
  'applyDeclaredAasimarRevelationDamage', 'applyVigilantBlessingFromUse',
  'grantBardicInspiration', 'declareBardicInspirationUse', 'applyBardicInspirationFromUse',
  'applyBardicInspirationAttack', 'applyBardicInspirationSavingThrow', 'recoverBardicInspirationOnRest',
  'applyCountercharmFromUse', 'applyCountercharmSavingThrow', 'applyTwilightSanctuaryFromUse',
  'applyTwilightSanctuaryTurnEnd', 'applyAasimarRevelationFromUse', 'applyRadiantConsumptionTurnEnd',
  'applyVampireRegenerationTurnStart', 'suppressVampireRegenerationFromDamage', 'applyRacialSavingThrowAutomation',
  'applySunlightSensitivityAttack', 'applySavageAttacksDamageBonus', 'applySavageAttackerHouseRuleReroll',
  'applyTurnUndeadFromWorkflow', 'applyAuraOfProtectionSave', 'applyAuraOfProtectionSavingThrow',
  'applyDuelingDamageBonus', 'applyGreatWeaponFightingReroll', 'applyFavoredFoe', 'cleanupFavoredFoeTargets',
  'applyDreadAmbusherInitiative', 'applyDreadAmbusherTurnStart',
  'applyBg3ShortRestHealing', 'bg3ShortRestQuota', 'restActor', 'restGroup',
  'findNearbyAuraSources', 'bestAuraSource', 'isExactRelentlessEnduranceInterceptionItem',
]);
export const excludedRuntimeHooks = new Set([
  'getSceneControlButtons', 'renderApplicationV2', 'renderActorDirectory', 'renderActorDirectory5e',
  'preCreateItem', 'createItem', 'dnd5e.preRollInitiative', 'dnd5e.preRollAttack',
]);
