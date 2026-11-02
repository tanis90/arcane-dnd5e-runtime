import {SPELL_AUTOMATION_COMPILER_VERSION, semanticHash} from '@arcanedesk/automation-contracts/semantics';
import {checkSpellBindings} from '@arcanedesk/automation-contracts/bindings';
import {normalizeCleanRoomPackaging, importCleanRoomContent} from './spell-automation-cleanroom.mjs';
const clone = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));

/** Bind caller-owned presentation and target identity to a compiled plan.
 * Does not load a source pack, run hooks or mutate the plan or source document.
 */
export function bindSpellPlan(item, plan, {documentIdentity, packaging = {}, resourceBindings} = {}) {
  if (plan?.compilerVersion !== SPELL_AUTOMATION_COMPILER_VERSION
    || plan?.emissionMode !== "clean-room"
    || plan?.contentReference?.identifier !== plan?.definitionId) {
    throw new Error("Incompatible or invalid spell plan");
  }
  if (item?.system?.identifier !== plan.definitionId) {
    throw new Error(`Definition ${plan.definitionId} cannot compile Item ${item?.system?.identifier}`);
  }
  if (resourceBindings !== undefined) {
    const check = checkSpellBindings(plan, resourceBindings, documentIdentity?._id);
    if (!check.valid) throw new Error(`Invalid spell bindings: ${check.errors.map(error => error.code).join(', ')}`);
  }
  const cleanRoomPackaging = normalizeCleanRoomPackaging(packaging);
  const content = importCleanRoomContent(item, plan.contentReference);
  const {
    compilerVersion, definitionId, definitionHash, sourceMode, emissionMode,
    support, emission, acceptance, contract, contentReference,
    semanticHash: cleanRoomSemanticHash, executionPlanHash,
    runtimeProfile, runtimeProfileVersion, runtimeProfileHash, ...compiled
  } = clone(plan);
  // Preserve the historical compilation shape and field order for internal builds.
  return {
    compilerVersion, definitionId, definitionHash, sourceMode, emissionMode,
    support, emission, acceptance, contract, content,
    contentHash: semanticHash(content),
    semanticHash: cleanRoomSemanticHash, executionPlanHash,
    runtimeProfile, runtimeProfileVersion, runtimeProfileHash,
    documentIdentity: clone(documentIdentity ?? {}),
    packaging: cleanRoomPackaging, provenance: {}, ...compiled,
    ...(resourceBindings === undefined ? {} : {resourceBindings: clone(resourceBindings)}),
  };
}
