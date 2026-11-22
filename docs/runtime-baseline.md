# Complete runtime baseline

The single browser artifact is
`packages/dnd5e-runtime/dist/dnd5e-runtime.mjs`; its factory is
`initializeDnd5eRuntime`. It is generated from
`packages/dnd5e-runtime/src/automation.js` and retains all class, ancestry, UI
and spell hooks/API entries.

The canonical machine-readable baseline is
`packages/dnd5e-runtime/tests/fixtures/full-runtime-baseline.json`:

- 55 hook registrations
- 49 unique hook names
- 163 API keys
- source SHA256:
  `1459e6507fc9dc2400d324c8303f488a2908b832d916e1dea260e1c06145a71a`

The 55-registration baseline is the persistent post-ready set. The browser
runtime also registers one one-shot `setup` callback that adds the Bardic
Inspiration status; it is consumed before the snapshot and is not counted as a
56th persistent hook.

## Reviewed source differences

The reviewed differences from the upstream copy are recorded in
`packages/dnd5e-runtime/src/source-baseline.json` and summarized in
`MIGRATION.md`. They cover the `longRestCleanup` shim, the Bardic Inspiration
status, the Dread Ambusher icon path, the first-party HP-pool and projectile
ownership handshakes, the compiler zone pulse macro isolation and the compiler
zone template deletion rule. The hidden compiler pulse passes
`workflowOptions.noOnUseMacro = true` so the Item-level ActiveAuras template
binder installed for the placing cast is not re-run without template
provenance; the pulse's own native save/damage still resolves and ordinary
spell uses keep their OnUse macros. `preDeleteMeasuredTemplate` sets
`options.noConcentrationCheck = true` only for compiler persistent zone
templates, so deleting one keeps the caster's concentration (the runtime's
membership cleanup and TimesUp own that lifecycle) while non-compiler templates
keep Midi's native deletion behaviour. The added hook is why the persistent
baseline is 55 registrations and 49 unique names.

The VM test executes the raw current runtime and the generated initializer and
compares both complete sorted lists. No projection is applied.

## Manifest fields

`packages/dnd5e-runtime/dist/manifest.json` exposes:

- `name` and `version`: package identity (`0.1.1` for this build)
- `schemaVersion`: `1`
- `runtimeKind`: `full`
- `factoryName`: `initializeDnd5eRuntime`
- `runtimeProfile`: `{id: "arcane-dnd5e-2014", version: 1, ruleset: "2014", system: {id: "dnd5e", majorVersion: 5}}`
- `engines`: `{node: ">=22.12"}`
- `moduleId`: default `arcane-dnd5e-2014-automation`
- `source` and `sourceHash`
- `artifact` and `buildHash`
- `contentPolicy`: `runtime-only`
- `baseline` and `provenance`

## Self-identity behavior

The factory uses the host module objects, not a global switch:

```js
const legacy = game.modules.get('arcane-dnd5e-2014-automation');
const host = game.modules.get(moduleId);
const sameModuleReplacement = moduleId === 'arcane-dnd5e-2014-automation' && host === legacy;
```

- Same module and same legacy object: initialize `standalone` even if active.
- Different module with the legacy Auto module active: return `legacy`, expose
  its API, register no hooks.
- Repeated call: return the existing runtime (Symbol idempotency).
- Failure: remove all registered hooks and restore the prior
  `ArcaneDnd5e2014SpellScripts` registry.
