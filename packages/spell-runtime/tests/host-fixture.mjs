import vm from 'node:vm';

export function createBrowserHost({legacy = false, failAt = Infinity} = {}) {
  const hooks = new Map();
  const calls = [];
  let nextId = 0;
  const add = (name, callback) => {
    if (++nextId === failAt) throw new Error('Original registration failure');
    hooks.set(nextId, {name, callback});
    return nextId;
  };
  const game = {
    actors: [],
    users: [],
    scenes: [],
    modules: new Map([
      ['arcane-spells-2014', {active: true}],
      ['arcane-dnd5e-2014-automation', {active: legacy, api: legacy ? {original: true} : undefined}],
    ]),
  };
  const warnings = [];
  const context = vm.createContext({
    game,
    canvas: {tokens: {placeables: []}},
    Hooks: {
      on: add,
      once: add,
      off: (_name, id) => hooks.delete(id),
      callAll: () => {},
      call: () => true,
    },
    console: {warn: (...args) => warnings.push(args), log: () => {}},
    setTimeout,
    clearTimeout,
    queueMicrotask,
  });

  return {
    context,
    game,
    hooks,
    warnings,
    calls,
    async evaluateInitializer(payload) {
      calls.push(payload);
      const factorySource = `${payload.source.replace(
        'export function initializeSpellRuntime',
        'function initializeSpellRuntime',
      )}\nglobalThis.__initializeSpellRuntime = initializeSpellRuntime;`;
      new vm.Script(factorySource, {filename: 'spell-runtime.mjs'}).runInContext(context);
      return context.__initializeSpellRuntime({moduleId: payload.moduleId});
    },
  };
}
