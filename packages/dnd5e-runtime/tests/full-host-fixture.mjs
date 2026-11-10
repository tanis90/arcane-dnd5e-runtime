import vm from 'node:vm';

export const LEGACY_MODULE_ID = 'arcane-dnd5e-2014-automation';

/** Host-shaped VM fixture. It exercises the complete runtime, not a projection. */
export function createFullHost({
  legacyActive = true,
  moduleId = LEGACY_MODULE_ID,
  failAt = Infinity,
  priorScripts = {prior: true},
} = {}) {
  const hooks = new Map();
  const warnings = [];
  let nextId = 0;
  const register = (once) => (name, callback) => {
    if (++nextId === failAt) throw new Error('Original registration failure');
    const id = nextId;
    hooks.set(id, {name, callback, once});
    return id;
  };
  const on = register(false);
  const once = register(true);
  const off = (_name, id) => hooks.delete(id);
  const legacyModule = {active: legacyActive, api: legacyActive ? {original: true} : undefined};
  const CONFIG = {
    statusEffects: [],
    specialStatusEffects: {},
    time: {roundTime: 6},
    DND5E: {actorSizes: {}},
  };
  const modules = new Map([
    [LEGACY_MODULE_ID, legacyModule],
    [moduleId, moduleId === LEGACY_MODULE_ID ? legacyModule : {active: true}],
    ['midi-qol', {active: false}],
    ['ActiveAuras', {active: false}],
    ['foundryvtt-actor-studio', {active: false}],
  ]);
  const game = {
    actors: [],
    users: [],
    scenes: [],
    modules,
    packs: new Map(),
    settings: {get: () => undefined, set: () => {}},
    user: {id: 'gm1', isGM: true, active: true},
    release: {generation: 13},
    system: {id: 'dnd5e', version: '5.3.3'},
    time: {worldTime: 0},
    combat: null,
    i18n: {localize: value => value, format: value => value},
  };
  const canvas = {tokens: {placeables: []}, scene: {tokens: []}, ready: true};
  const ui = {
    notifications: {warn() {}, error() {}, info() {}},
    controls: {controls: new Map(), render() {}},
    windows: {},
  };
  const context = vm.createContext({
    game,
    canvas,
    ui,
    CONFIG,
    document: {querySelector: () => null},
    foundry: {applications: {instances: new Map()}},
    console: {
      warn: (...args) => warnings.push(args),
      error: (...args) => warnings.push(args),
      log: () => {},
      info: () => {},
    },
    Hooks: {on, once, off, callAll() {}, call() {}},
    setTimeout,
    clearTimeout,
    queueMicrotask: () => {},
  });
  context.ArcaneDnd5e2014SpellScripts = priorScripts;

  const runHooks = name => {
    for (const [id, hook] of [...hooks]) {
      if (hook.name !== name) continue;
      hooks.delete(id);
      hook.callback();
    }
  };

  return {
    context,
    game,
    CONFIG,
    hooks,
    warnings,
    priorScripts,
    evaluateRaw(source) {
      new vm.Script(source, {filename: 'automation.js'}).runInContext(context);
    },
    evaluateFull(source) {
      const wrapped = `${source.replace(
        'export function initializeDnd5eRuntime',
        'function initializeDnd5eRuntime',
      )}\nglobalThis.__initializeDnd5eRuntime = initializeDnd5eRuntime;`;
      new vm.Script(wrapped, {filename: 'dnd5e-runtime.mjs'}).runInContext(context);
      return context.__initializeDnd5eRuntime;
    },
    evaluateInitializer({source, moduleId}) {
      const factory = this.evaluateFull(source);
      return factory({moduleId});
    },
    triggerSetup() {
      runHooks('setup');
    },
    triggerReady() {
      runHooks('setup');
      runHooks('ready');
    },
    hookNames() {
      return [...hooks.values()].map(hook => hook.name).sort();
    },
    apiKeys(targetModuleId = moduleId) {
      return Object.keys(game.modules.get(targetModuleId)?.api ?? {}).sort();
    },
    api(targetModuleId = moduleId) {
      return game.modules.get(targetModuleId)?.api;
    },
  };
}

export async function executeRawFull(source) {
  const host = createFullHost();
  host.evaluateRaw(source);
  host.triggerReady();
  return host;
}

export async function executeFullSource(source, options = {}) {
  const host = createFullHost(options);
  const factory = host.evaluateFull(source);
  const runtime = factory(options);
  host.triggerReady();
  return {host, runtime};
}
