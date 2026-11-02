import {parse} from 'acorn';
import {readRuntimeSource} from './runtime-source.mjs';
import {excludedRuntimeRoots, excludedRuntimeHooks} from './exclusions.mjs';
import {ARCANE_RUNTIME_RULE_ADAPTERS, ARCANE_RUNTIME_ARTIFACT_ADAPTERS} from '@arcanedesk/automation-contracts/runtime-adapters';
import {hashString} from '@arcanedesk/automation-contracts/semantics';
import baseline from './source-baseline.json' with {type: 'json'};

const options = {ecmaVersion: 'latest', sourceType: 'module'};
function children(node) {
  return Object.values(node).flatMap(value => Array.isArray(value) ? value : [value])
    .filter(value => value && typeof value === 'object' && typeof value.type === 'string');
}
function identifiers(node, result = new Set()) {
  if (node.type === 'Identifier') result.add(node.name);
  for (const child of children(node)) identifiers(child, result);
  return result;
}
function directRoot(expression) {
  if (!expression) return null;
  if (expression.type === 'AwaitExpression' || expression.type === 'ChainExpression') return directRoot(expression.argument ?? expression.expression);
  if (expression.type === 'CallExpression') return directRoot(expression.callee);
  if (expression.type === 'MemberExpression') return directRoot(expression.object);
  return expression.type === 'Identifier' ? expression.name : null;
}

/** Build a spell-only execution closure from the reviewed runtime source.
 * The SDK retains those bytes. This is a reviewed projection, not another
 * editable copy of the automation functions. No code is evaluated.
 */
export async function buildSpellRuntime() {
  const original = (await readRuntimeSource()).replace(/\r\n/g, '\n');
  if (hashString(original) !== baseline.sha256) throw new Error('Shared runtime changed; review the spell projection before updating its source baseline');
  const ast = parse(original, options);
  const edits = [], removed = [];
  function remove(node, label, comma = false, replacement = '') {
    let end = node.end;
    if (comma) {while (/\s/.test(original[end] ?? '') && end < original.length) end++; if (original[end] === ',') end++; else end = node.end;}
    edits.push({start: node.start, end, replacement}); removed.push(label);
  }
  function visit(node) {
    // MODULE_ID is the persisted automation schema shared with internal builds,
    // not the standalone host's installation ID. Foundry getFlag/setFlag reject
    // an uninstalled module scope; use document flags/update for this schema only.
    if (node.type === 'CallExpression' && node.callee.type === 'MemberExpression'
      && !node.callee.computed && ['getFlag', 'setFlag', 'unsetFlag'].includes(node.callee.property.name)
      && node.arguments[0]?.type === 'Identifier' && node.arguments[0].name === 'MODULE_ID') {
      const helper = {getFlag: 'readSharedAutomationFlag', setFlag: 'writeSharedAutomationFlag',
        unsetFlag: 'deleteSharedAutomationFlag'}[node.callee.property.name];
      const args = [node.callee.object, ...node.arguments.slice(1)].map(arg => original.slice(arg.start, arg.end));
      remove(node, `shared-schema:${node.callee.property.name}`, false, `${helper}(${args.join(', ')})`);
      return;
    }
    if (node.type === 'FunctionDeclaration' && node.id.name === 'fatalDamageInterceptionPendingReceipts') {
      const returned = node.body.body.find(statement => statement.type === 'ReturnStatement');
      if (!returned?.argument) throw new Error('Fatal damage receipt boundary changed');
      remove(returned.argument, 'spell-only-fatal-damage-receipts', false,
        `(${original.slice(returned.argument.start, returned.argument.end)}).filter(receipt => receipt.candidateKind === "death-ward")`);
      // The receipt reader also uses shared flags before its return expression.
      for (const statement of node.body.body) if (statement !== returned) visit(statement);
      return;
    }
    if (node.type === 'CallExpression' && directRoot(node) === 'isExactRelentlessEnduranceInterceptionItem') {
      remove(node, 'relentless-endurance-predicate', false, 'false'); return;
    }
    const expression = node.type === 'ExpressionStatement' ? node.expression : node.type === 'ReturnStatement' ? node.argument : null;
    const root = directRoot(expression);
    if (root && excludedRuntimeRoots.has(root)) {
      remove(node, root, false, node.type === 'ReturnStatement'
        ? (root === 'isExactRelentlessEnduranceInterceptionItem' ? 'return false;' : 'return true;') : ';'); return;
    }
    if (node.type === 'ExpressionStatement' && expression?.type === 'CallExpression') {
      const call = expression;
      if ((root === 'Hooks' && (excludedRuntimeHooks.has(call.arguments[0]?.value)
        || call.arguments.some(argument => argument.type === 'Identifier' && excludedRuntimeRoots.has(argument.name))))
        || (root === 'queueMicrotask' && excludedRuntimeRoots.has(call.arguments[0]?.name))) {
        remove(node, `hook-or-task:${call.arguments[0]?.value ?? call.arguments[0]?.name}`, false, ';'); return;
      }
    }
    if (node.type === 'VariableDeclaration' && node.declarations.some(declaration =>
      excludedRuntimeRoots.has(directRoot(declaration.init)) && directRoot(declaration.init) !== 'isExactRelentlessEnduranceInterceptionItem')) {
      remove(node, 'excluded-initializer', false, ';'); return;
    }
    if (node.type === 'Property' && excludedRuntimeRoots.has(node.value?.name)) {
      remove(node, `api:${node.value.name}`, true); return;
    }
    // Death Ward remains; the ancestry-specific competing candidate loop does not.
    if (node.type === 'ForOfStatement' && identifiers(node).has('isExactRelentlessEnduranceInterceptionItem')) {
      remove(node, 'relentless-endurance-candidate-loop', false, ';'); return;
    }
    if (node.type === 'ArrayExpression') {
      for (const element of node.elements.filter(Boolean)) {
        if (excludedRuntimeRoots.has(directRoot(element))) remove(element, directRoot(element), true);
        else visit(element);
      }
      return;
    }
    for (const child of children(node)) visit(child);
  }
  visit(ast);
  let projected = original;
  for (const edit of edits.sort((a, b) => b.start - a.start)) projected = projected.slice(0, edit.start) + edit.replacement + projected.slice(edit.end);
  projected = projected.replace('game.modules.get(MODULE_ID).api = {', 'game.modules.get(HOST_MODULE_ID).api = {');
  let projectedAst;
  try {projectedAst = parse(projected, options);} catch (error) {
    throw new Error(`Runtime projection syntax: ${error.message}\n${projected.slice(error.pos - 180, error.pos + 180)}`);
  }
  const declarations = new Map(), roots = [];
  for (const node of projectedAst.body) {
    if (node.type === 'FunctionDeclaration') declarations.set(node.id.name, node);
    else if (node.type === 'VariableDeclaration') {
      for (const declaration of node.declarations) {
        if (declaration.id.type !== 'Identifier') throw new Error('Unsupported top-level runtime declaration');
        declarations.set(declaration.id.name, node);
      }
    } else roots.push(node);
  }
  const selected = new Set(roots), pending = roots.flatMap(node => [...identifiers(node)]);
  while (pending.length) {
    const name = pending.pop(), node = declarations.get(name);
    if (!node || selected.has(node)) continue;
    if (excludedRuntimeRoots.has(name)) throw new Error(`Spell runtime still reaches excluded root ${name}`);
    selected.add(node); pending.push(...identifiers(node));
  }
  const includedNames = [...declarations].filter(([, node]) => selected.has(node)).map(([name]) => name).sort();
  const adapters = [...new Set([...Object.keys(ARCANE_RUNTIME_RULE_ADAPTERS),
    ...Object.keys(ARCANE_RUNTIME_ARTIFACT_ADAPTERS)])].sort();
  const handlers = new Set();
  function collectHandlers(value) {
    if (!value || typeof value !== 'object') return;
    if (typeof value.handler === 'string') handlers.add(value.handler);
    for (const child of Object.values(value)) collectHandlers(child);
  }
  collectHandlers(ARCANE_RUNTIME_RULE_ADAPTERS);
  collectHandlers(ARCANE_RUNTIME_ARTIFACT_ADAPTERS);
  for (const handler of handlers) {
    if (!includedNames.includes(handler)) throw new Error(`Spell runtime lacks declared adapter handler ${handler}`);
  }
  const body = projectedAst.body.filter(node => selected.has(node)).map(node => projected.slice(node.start, node.end)).join('\n\n');
  const source = `export function initializeSpellRuntime({moduleId = 'arcane-spells-2014'} = {}) {
    const HOST_MODULE_ID = moduleId;
    function readSharedAutomationFlag(document, key) {
      return key.split('.').reduce((value, part) => value?.[part], document?.flags?.['arcane-dnd5e-2014-automation']);
    }
    function writeSharedAutomationFlag(document, key, value) {
      return document.update({['flags.arcane-dnd5e-2014-automation.' + key]: value});
    }
    function deleteSharedAutomationFlag(document, key) {
      const parts = key.split('.'); const leaf = parts.pop();
      return document.update({['flags.arcane-dnd5e-2014-automation.' + (parts.length ? parts.join('.') + '.' : '') + '-=' + leaf]: null});
    }
    const legacy = globalThis.game?.modules?.get('arcane-dnd5e-2014-automation');
    if (legacy?.active) return {mode: 'legacy', get api() {return legacy.api;}};
    const key = Symbol.for('arcanedesk.spell-runtime.v1');
    if (globalThis[key]) return globalThis[key];
    const registered = [], nativeHooks = globalThis.Hooks;
    let readyStarted = false;
    const priorScripts = globalThis.ArcaneDnd5e2014SpellScripts;
    const Hooks = {
      on(name, callback) {const id = nativeHooks.on(name, callback); registered.push([name, id ?? callback]); return id;},
      once(name, callback) {const wrapped = name === 'ready' ? (...args) => {readyStarted = true; return callback(...args);} : callback;
        const id = nativeHooks.once(name, wrapped); registered.push([name, id ?? wrapped]); return id;},
      callAll: (...args) => nativeHooks.callAll(...args),
      call: (...args) => nativeHooks.call(...args),
    };
    try {
      ${body}
      const runtime = {mode: 'standalone', adapters: ${JSON.stringify(adapters)},
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
  parse(source, options);
  return {source, report: {originalBytes: Buffer.byteLength(original), spellBytes: Buffer.byteLength(source),
    declarations: includedNames, adapters, handlers: [...handlers].sort(), removed: [...new Set(removed)].sort()}};
}
