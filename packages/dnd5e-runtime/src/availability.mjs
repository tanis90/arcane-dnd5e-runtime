import {ARCANE_RUNTIME_RULE_ADAPTERS, ARCANE_RUNTIME_ARTIFACT_ADAPTERS} from '@arcanedesk/automation-contracts/runtime-adapters';

/** Installation readiness, not a claim that live combat QA has passed. Resource
 * verification is delegated to the host that can read the actual Actor provider.
 */
export function createRuntimeAvailability({game, runtime, midi = () => globalThis.MidiQOL, verifyResources}) {
  return async requirements => {
    const reasons = [];
    if (game.system?.id !== 'dnd5e' || Number(String(game.system.version).split('.')[0]) !== 5) reasons.push('Requires dnd5e 5.x');
    if (Number(game.release?.generation) !== 13) reasons.push('This candidate targets Foundry 13');
    for (const moduleId of ['midi-qol', 'dae']) {
      if (!game.modules.get(moduleId)?.active) reasons.push(`Enable ${moduleId}`);
    }
    if (typeof midi()?.completeItemUse !== 'function') reasons.push('Midi workflow API is unavailable');
    if (typeof runtime.api?.applyCompilerRuntimePostUse !== 'function'
      || typeof runtime.api?.dispatchPerSpellScript !== 'function') reasons.push('Arcane runtime has not finished initialization');
    const modules = {'active-auras': 'ActiveAuras', 'aura-effects': 'auraeffects'};
    const builtins = new Set(['arcane-runtime', 'dnd5e-midi-native', 'midi-overtime', 'native-active-effect']);
    for (const provider of requirements.providers) {
      if (modules[provider]) {
        if (!game.modules.get(modules[provider])?.active) reasons.push(`Enable ${modules[provider]}`);
      } else if (!builtins.has(provider)) reasons.push(`Unsupported provider: ${provider}`);
    }
    for (const entry of requirements.adapters) {
      const name = entry.configuration?.adapter;
      const registry = entry.site === 'artifacts' ? ARCANE_RUNTIME_ARTIFACT_ADAPTERS : ARCANE_RUNTIME_RULE_ADAPTERS;
      if (name && !Object.hasOwn(registry, name)) reasons.push(`Unsupported adapter: ${name}`);
      if (name && runtime.mode === 'standalone' && !runtime.adapters?.includes(name)) reasons.push(`Runtime adapter is missing: ${name}`);
    }
    for (const required of requirements.scripts) {
      const installed = runtime.getScriptContract?.(required.id) ?? runtime.api?.getScriptContract?.(required.id);
      if (!installed || installed.version !== required.version
        || required.handlers.some(handler => !installed.handlers.includes(handler.id))) reasons.push(`Script contract unavailable: ${required.id} v${required.version}`);
    }
    if (requirements.resources.length) {
      if (typeof verifyResources !== 'function') reasons.push('Summon resource provider is not configured');
      else {
        const result = await verifyResources(requirements.resources);
        if (result?.valid !== true) reasons.push(result?.reason ?? 'Summon resources have not been verified');
      }
    }
    return {available: reasons.length === 0, reason: [...new Set(reasons)].join('; ')};
  };
}
