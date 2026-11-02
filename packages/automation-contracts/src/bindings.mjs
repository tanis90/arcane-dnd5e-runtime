import {describeSpellRequirements} from './requirements.mjs';

const itemUuid = /^Compendium\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.Item\.[A-Za-z0-9]{16}$/;
const actorUuid = /^(?:Actor\.[A-Za-z0-9]{16}|Compendium\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.Actor\.[A-Za-z0-9]{16})$/;

/** Check explicit installation bindings. Does not claim the Actor exists or that
 * its statistics satisfy the provider contract; that is the host's next check.
 */
export function checkSpellBindings(plan, bindings, documentId) {
  const errors = [];
  if (!itemUuid.test(bindings?.documentUuid ?? '') || bindings.documentUuid.split('.').at(-1) !== documentId) {
    errors.push({code: 'invalid-target-identity'});
  }
  const requirements = describeSpellRequirements(plan);
  const resources = bindings?.summonProfiles ?? {};
  for (const required of requirements.resources) {
    const bound = Object.hasOwn(resources, required.profileId) ? resources[required.profileId] : null;
    if (!bound) {
      errors.push({code: 'missing-summon-profile', profileId: required.profileId});
    } else if (bound.revision !== required.revision || bound.recipeId !== required.recipeId
      || !actorUuid.test(bound.uuid ?? '')) {
      errors.push({code: 'incompatible-summon-profile', profileId: required.profileId});
    }
  }
  return {valid: errors.length === 0, errors, requirements};
}

/** Legacy internal builds retain their original explicit content layout. Public
 * consumers supply bindings, in which case unresolved profiles never fall back.
 */
export function summonProfileUuid(profile, bindings, legacyModuleId) {
  if (bindings === undefined) return `Compendium.${legacyModuleId}.summons.Actor.${profile.documentId}`;
  const bound = Object.hasOwn(bindings.summonProfiles ?? {}, profile.profileId)
    ? bindings.summonProfiles[profile.profileId] : null;
  if (!bound || bound.revision !== profile.revision || bound.recipeId !== profile.recipeId
    || !actorUuid.test(bound.uuid ?? '')) throw new Error(`Unbound summon profile ${profile.profileId}`);
  return bound.uuid;
}
