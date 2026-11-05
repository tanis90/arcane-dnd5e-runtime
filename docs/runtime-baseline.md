# Complete runtime baseline

The single browser artifact is
`packages/dnd5e-runtime/dist/dnd5e-runtime.mjs`; its factory is
`initializeDnd5eRuntime`. It is generated from
`packages/dnd5e-runtime/src/automation.js` and retains all class, ancestry, UI
and spell hooks/API entries.

The canonical machine-readable baseline is
`packages/dnd5e-runtime/tests/fixtures/full-runtime-baseline.json`:

- 54 hook registrations
- 48 unique hook names
- 163 API keys
- source SHA256:
  `a92843bd942d0c3ed90f3a8ac827f6a6cf7550638cbeb3169b3ad0be2ccd25b8`

The VM test executes the raw current runtime and the generated initializer and
compares both complete sorted lists. No projection is applied.

## Manifest fields

`packages/dnd5e-runtime/dist/manifest.json` exposes:

- `name` and `version`: package identity (`0.1.0` for this build)
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
