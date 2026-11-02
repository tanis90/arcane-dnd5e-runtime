/** Describe declared requirements, not installed capabilities or resource readiness.
 * This pure browser-safe function never resolves a UUID or reads a content pack.
 */
export function describeSpellRequirements(plan) {
  const projection = plan?.projection;
  if (plan?.emissionMode !== 'clean-room' || projection?.schemaVersion !== 1
    || projection.spellId !== plan.definitionId) throw new Error('Unsupported spell plan');
  const adapters = [];
  for (const site of ['actions', 'internalActions', 'runtimeRules', 'artifacts']) {
    for (const entry of projection[site]) {
      if (!entry.adapter) continue;
      // Some adapters are expressed as effect flags, not a named dispatcher.
      // Retain the full declared configuration so those dependencies are visible.
      if (typeof entry.adapter !== 'object' || Array.isArray(entry.adapter)) {
        throw new Error('Invalid runtime adapter requirement');
      }
      adapters.push({site, id: entry.semanticId ?? entry.id,
        provider: entry.adapter.provider ?? entry.provider ?? null,
        configuration: structuredClone(entry.adapter)});
    }
  }
  const resources = [];
  for (const artifact of projection.artifacts) {
    if (artifact.kind !== 'entity') continue;
    if (!Array.isArray(artifact.state?.profiles) || !artifact.state.profiles.length) {
      throw new Error('Entity resource profiles are missing');
    }
    for (const profile of artifact.state.profiles) {
      if (!profile.profileId || !profile.documentId || !profile.recipeId || !Number.isInteger(profile.revision)) {
        throw new Error('Incomplete entity resource contract');
      }
      resources.push({kind: 'summon-profile', artifactId: artifact.semanticId,
        poolId: artifact.state.poolId, choice: profile.choice,
        profileId: profile.profileId, revision: profile.revision,
        recipeId: profile.recipeId, originalDocumentId: profile.documentId});
    }
  }
  const script = projection.perSpellScript;
  return {
    schemaVersion: 1, spellId: plan.definitionId,
    providers: [...new Set(projection.capabilities)].sort(),
    adapters,
    scripts: script ? [{id: script.id, version: script.version, schemaVersion: script.schemaVersion,
      handlers: structuredClone(script.handlers)}] : [],
    resources,
  };
}
