# `@arcanedesk/spell-runtime-sdk`

Runtime-only distribution of the sole Auto 2014 spell automation runtime.
Version `0.1.0`, runtime schema `1`, Node `>=22.12`.

```js
import {
  buildSpellRuntime,
  createAuto2014Runtime,
  readRuntimeSource,
} from '@arcanedesk/spell-runtime-sdk';

const source = await readRuntimeSource();
const built = await buildSpellRuntime();
const sdk = await createAuto2014Runtime({moduleId: 'arcane-spells-2014'});
```

`readRuntimeSource()` returns the reviewed `src/automation.js` bytes.
`buildSpellRuntime()` emits the reviewed browser projection and its audit report.
`createAuto2014Runtime()` returns a locked manifest plus an initializer. The SDK
entry is a Node build-time module; `dist/spell-runtime.mjs` is the browser
artifact. The host must implement `evaluateInitializer({source, manifest,
moduleId})`; the SDK does not evaluate code or connect to a world.

## Generated build

`npm run build` in the workspace writes:

- `dist/spell-runtime.mjs` — browser initializer projection.
- `dist/manifest.json` — SDK version, schema, enforced profile, source/build
  hashes, provenance and `runtime-only` content policy.

Both are generated and must not be hand-edited. The source baseline is reviewed
manually and is never refreshed automatically by CI.

## Package boundaries

This package ships runtime mechanics, contracts, the source review record and
build metadata. It ships no spell descriptions, compendium documents,
translations, images, audio, summon stat blocks or world state. A host adapter is
responsible for loading/evaluating the initializer and for all world access.

The package-local smoke tests execute the generated initializer in a real Node
`vm`, including rollback, legacy ownership and ready API checks. They are not a
substitute for a real VTT/FVTT dual-host certification. See the repository
`README.md`, `MIGRATION.md` and `docs/evolution-plan.md`.
