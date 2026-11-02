import {parse} from 'acorn';
import {readRuntimeSource} from './runtime-source.mjs';
import {ARCANE_RUNTIME_RULE_ADAPTERS, ARCANE_RUNTIME_ARTIFACT_ADAPTERS} from '@arcanedesk/automation-contracts/runtime-adapters';
import {hashString} from '@arcanedesk/automation-contracts/semantics';
import baseline from './source-baseline.json' with {type: 'json'};

const options = {ecmaVersion: 'latest', sourceType: 'module'};
const LEGACY_MODULE_ID = 'arcane-dnd5e-2014-automation';
const API_ASSIGNMENT = 'game.modules.get(MODULE_ID).api = {';

function adapters() {
  return [...new Set([
    ...Object.keys(ARCANE_RUNTIME_RULE_ADAPTERS),
    ...Object.keys(ARCANE_RUNTIME_ARTIFACT_ADAPTERS),
  ])].sort();
}

/** Build the complete DND5E browser initializer from the reviewed source.
 * This keeps every automation declaration, hook and API entry. The source is
 * wrapped, not projected, and no code is evaluated during the build.
 */
export async function buildDnd5eRuntime() {
  const original = await readRuntimeSource();
  if (hashString(original) !== baseline.sha256) {
    throw new Error('Shared runtime changed; review the full runtime baseline before rebuilding');
  }
  const assignmentCount = original.split(API_ASSIGNMENT).length - 1;
  if (assignmentCount !== 1) {
    throw new Error(`Expected exactly one API assignment boundary; found ${assignmentCount}`);
  }
  const body = original.replace(API_ASSIGNMENT, 'game.modules.get(HOST_MODULE_ID).api = {');
  const source = `export function initializeDnd5eRuntime({moduleId = '${LEGACY_MODULE_ID}'} = {}) {
    const HOST_MODULE_ID = moduleId;
    const legacy = globalThis.game?.modules?.get('${LEGACY_MODULE_ID}');
    const host = globalThis.game?.modules?.get(moduleId);
    const sameModuleReplacement = moduleId === '${LEGACY_MODULE_ID}' && host === legacy;
    if (legacy?.active && !sameModuleReplacement) return {mode: 'legacy', get api() {return legacy.api;}};
    const key = Symbol.for('arcanedesk.dnd5e-runtime.v1');
    if (globalThis[key]) return globalThis[key];
    const registered = [], nativeHooks = globalThis.Hooks;
    let readyStarted = false;
    const priorScripts = globalThis.ArcaneDnd5e2014SpellScripts;
    const Hooks = {
      on(name, callback) {const id = nativeHooks.on(name, callback); registered.push([name, id ?? callback]); return id;},
      once(name, callback) {const wrapped = name === 'ready' ? (...args) => {readyStarted = true; return callback(...args);} : callback;
        const id = nativeHooks.once(name, wrapped); registered.push([name, id ?? wrapped]); return id;},
      off(name, id) {
        if (typeof nativeHooks.off === 'function') nativeHooks.off(name, id);
        const index = registered.findIndex(([registeredName, registeredId]) => registeredName === name && registeredId === id);
        if (index >= 0) registered.splice(index, 1);
      },
      callAll: (...args) => nativeHooks.callAll(...args),
      call: (...args) => nativeHooks.call(...args),
    };
    try {
      ${body}
      const runtime = {mode: 'standalone', kind: 'full', adapters: ${JSON.stringify(adapters())},
        abortInitialization() {
          if (readyStarted) throw new Error('Runtime already started; reload the world to change modules');
          for (const [name, id] of registered) nativeHooks.off(name, id);
          globalThis.ArcaneDnd5e2014SpellScripts = priorScripts;
          if (globalThis[key] === runtime) delete globalThis[key];
        },
        getScriptContract(id) {const script = PER_SPELL_SCRIPT_REGISTRY.get(id); return script
          ? {id: script.id, version: script.version, handlers: Object.keys(script.handlers)} : null;},
        get api() {return globalThis.game?.modules?.get(moduleId)?.api;}};
      globalThis[key] = runtime;
      return runtime;
    } catch (error) {
      for (const [name, id] of registered) nativeHooks.off(name, id);
      globalThis.ArcaneDnd5e2014SpellScripts = priorScripts;
      throw error;
    }
  }\n`;
  try {
    parse(source, options);
  } catch (error) {
    throw new Error(`Full runtime wrapper syntax: ${error.message}`);
  }
  return {
    source,
    report: {
      originalBytes: Buffer.byteLength(original),
      runtimeBytes: Buffer.byteLength(source),
      apiAssignmentCount: assignmentCount,
      adapters: adapters(),
    },
  };
}
