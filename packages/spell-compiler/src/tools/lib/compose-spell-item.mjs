import {compileSpellAutomation} from './spell-automation-compiler.mjs';
import {extractCleanRoomDocumentIdentity,extractCleanRoomPackaging} from './spell-automation-cleanroom.mjs';
import {emitSpellAutomationItem} from './spell-automation-emitter.mjs';

/** Compose an offline Item from caller-owned content and a trusted automation recipe.
 * Does not write to Foundry or update an existing Actor. The caller must install
 * the matching runtime and any recipe-specific scripts before using the Item.
 */
export function composeSpellItem(contentItem,definition,emissionOptions={}) {
  const compilation=compileSpellAutomation(contentItem,definition,{
    documentIdentity:extractCleanRoomDocumentIdentity(contentItem),
    packaging:extractCleanRoomPackaging(contentItem),
  });
  const item=emitSpellAutomationItem(contentItem,compilation,emissionOptions);
  return {item,compilation};
}
