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
  `581b0b651386438ef325754cbf9bf07fbc287a9b440cc798d908676ed7ddb86d`

The 54-registration baseline is the persistent post-ready set. The browser
runtime also registers one one-shot `setup` callback that adds the Bardic
Inspiration status; it is consumed before the snapshot and is not counted as a
55th persistent hook.

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
