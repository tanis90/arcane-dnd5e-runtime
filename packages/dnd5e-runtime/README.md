# `@arcanedesk/dnd5e-runtime`

Complete DND5E 2014 automation runtime, version `0.1.0`, runtime schema `1`,
Node `>=22.12`. This is the only runtime artifact: there is no spell-only
projection or second rules implementation.

```js
import {
  buildDnd5eRuntime,
  createDnd5eRuntime,
  readRuntimeSource,
} from '@arcanedesk/dnd5e-runtime';

const source = await readRuntimeSource();
const built = await buildDnd5eRuntime();
const sdk = await createDnd5eRuntime({moduleId: 'arcane-dnd5e-2014-automation'});
```

`readRuntimeSource()` returns the exact reviewed `src/automation.js` bytes.
`buildDnd5eRuntime()` wraps those bytes as the complete browser initializer. All
class, ancestry, UI and spell hooks/API entries are retained. The host must
provide `evaluateInitializer({source, manifest, moduleId})`; the SDK does not
evaluate code or connect to a world.

`createAuto2014Runtime` is a compatibility alias for `createDnd5eRuntime`; it
resolves to the same full runtime and is not a separate mode.

## Generated build

Workspace `npm run build` writes:

- `dist/dnd5e-runtime.mjs` — full browser initializer, factory
  `initializeDnd5eRuntime`.
- `dist/manifest.json` — SDK version, schema, factory, runtime profile,
  source/build hashes, provenance and `runtime-only` content policy.

Both are generated and must not be hand-edited. The source baseline is reviewed
manually and is never refreshed automatically by CI.

## Self-identity and legacy ownership

The factory receives `moduleId`. It computes:

```js
const legacy = game.modules.get('arcane-dnd5e-2014-automation');
const host = game.modules.get(moduleId);
const sameModuleReplacement = moduleId === 'arcane-dnd5e-2014-automation' && host === legacy;
```

When the legacy module itself is the host, this is an in-place source replacement
and full initialization is allowed. A different module that sees the old Auto
module active receives `{mode: 'legacy'}` and registers no hooks. There is no
`respectLegacy` global switch. Repeated initialization returns the same runtime;
partial registration failure removes all registered hooks and restores the prior
spell-script registry.

## Content boundary

The package ships runtime mechanics, contracts and build metadata only. It ships
no spell descriptions, translations, compendium documents, images, audio, world
state or private paths. Runtime code reads Actor/Item/Effect data supplied by the
host. One reviewed dynamic import points at the host's
`/modules/auraeffects/scripts/helpers.mjs` dependency.

The real Node `vm` and compiler tests in this workspace are not a VTT/FVTT
integration certification. See the repository `README.md`, `MIGRATION.md` and
`docs/evolution-plan.md`.
