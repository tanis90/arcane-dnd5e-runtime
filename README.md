# Arcane Auto 2014 Runtime and DSL SDK

Public source for the Auto 2014 spell automation runtime, the mechanism DSL and
compiler, and the shared automation contracts. The runtime SDK includes the sole
rules implementation, a reviewed browser projection and versioned host metadata.
The compiler turns an original mechanism declaration into a runtime plan and a
Foundry Item. No package ships a Foundry module, compendium, spell description,
translation, image or world state.

Repository: <https://github.com/tanis90/arcane-spell-runtime>

Current releases: runtime SDK `0.1.0` (schema `1`, Node `>=22.12`), contracts
`0.1.0`, compiler `0.9.0` (Node `>=24 <25`). The compiler's higher Node floor is
declared only on that package; the browser/runtime floor is not silently raised.

## Packages

| Package | Purpose | Node |
| --- | --- | --- |
| `@arcanedesk/spell-runtime-sdk` | Runtime source, reviewed browser projection, manifest and host API | `>=22.12` |
| `@arcanedesk/spell-compiler` | Mechanism DSL, clean-room compiler, binder and Item emitter | `>=24 <25` |
| `@arcanedesk/automation-contracts` | Browser-safe runtime profile, requirements, bindings and adapter registries | `>=22.12` |

The workspace is independently installable with `npm install` or `npm ci`. No
private registry, environment variable or local path is required. Install under
Node 24 to exercise every package under its declared engine; the runtime package
can be built and tested independently on Node 22.

## Authoring to runtime

1. Declare a mechanism with `@arcanedesk/spell-compiler/dsl`. A definition names
   actions, targets, triggers, operations, artifacts and explicit omissions; it
   does not contain rules prose.
2. Compile it with `compileSpellPlan(definition)` from
   `@arcanedesk/spell-compiler`. The result includes a deterministic projection,
   runtime rules and hashes.
3. Bind caller-owned content and emit an Item with `compileSpellAutomation` plus
   `emitSpellAutomationItem`. The Item's
   `flags["arcane-dnd5e-2014-automation"].spellAutomation.runtimePlan` is the
   contract the runtime consumes.
4. Check the compiled requirements with `describeSpellRequirements` and the
   runtime's `createRuntimeAvailability` before claiming readiness.

```js
import {compileSpellPlan} from '@arcanedesk/spell-compiler';
import {forgeSpark} from './your-mechanism.mjs';

const plan = compileSpellPlan(forgeSpark);
const runtimePlan = plan.projection;
```

The complete executable example is in `docs/dsl-authoring.md`; the compiler test
fixture is `packages/spell-compiler/tests/fixtures/forge-spark.mjs`. It is an
original mechanism-only fixture, not a production spell catalogue.

## Runtime API

```js
import {
  buildSpellRuntime,
  createAuto2014Runtime,
  readRuntimeSource,
} from '@arcanedesk/spell-runtime-sdk';

const source = await readRuntimeSource();       // exact src/automation.js bytes
const built = await buildSpellRuntime();        // {source, report}
const sdk = await createAuto2014Runtime({moduleId: 'arcane-spells-2014'});
```

`readRuntimeSource()` and `buildSpellRuntime()` are retained from the previous
source package. `createAuto2014Runtime()` returns a locked manifest and a browser
initializer. The SDK entry itself is a Node build-time module; the emitted
`dist/spell-runtime.mjs` is the browser artifact. Importing the SDK does not
connect to a world, register hooks or evaluate code. The manifest exposes
`version`, `schemaVersion`, `sourceHash`, `buildHash`, the enforced runtime
profile and the `runtime-only` content policy.

### Host contract

The host owns module loading, evaluation and every world access. The SDK passes
the reviewed source and manifest to `host.evaluateInitializer()` and returns the
host's runtime object unchanged:

```js
const runtime = await sdk.initialize({
  async evaluateInitializer({source, manifest, moduleId}) {
    const initializeSpellRuntime = await loadHostModule(source, manifest);
    return initializeSpellRuntime({moduleId});
  },
});
```

`initializeSpellRuntime({moduleId})` must be called by the host. It returns
`{mode: 'standalone' | 'legacy', ...}` and installs the spell hooks/API. The host
must not install two copies or ignore the legacy active-module check.

## Build and test

```sh
npm ci
npm test
npm run build
npm run test:compiler:node24
npm run pack:check
npm pack --dry-run --workspace @arcanedesk/spell-runtime-sdk
```

`npm run build` writes the reviewed projection to
`packages/spell-runtime/dist/spell-runtime.mjs` and its machine-readable metadata
to `packages/spell-runtime/dist/manifest.json`. Both are generated artifacts and
must not be edited by hand. `npm test` executes the generated initializer in a
real Node `vm` host, compiles the original mechanism fixture, checks rollback and
legacy ownership, and audits the repository plus every package tarball.

The compiler declares Node 24. `npm test` still runs its small suite on the
caller's Node when possible; `npm run test:compiler:node24` explicitly exercises
the declared engine with the locally available Node 24. `npm run pack:check`
audits the final repository and all `npm pack --dry-run` file lists for private
paths, credentials, images, compendium/world data and extra files.

`packages/spell-runtime/src/source-baseline.json` is a manually reviewed source
hash. It is never refreshed automatically by CI. A source change requires a
review of the spell-only projection boundary before the baseline is updated.

## Content policy and provenance

Every published package contains mechanisms, contracts, compiler code, tests
that are not packed, and build metadata only. The runtime does not bundle Actor,
Item, Effect or world data; the compiler does not bundle any spell catalogue.
Private QA-log path constants from the internal compiler source are not exported
here; callers pass their own acceptance source.

- Upstream public source: `tanis90/arcanedesk-fvtt-mods`
  at `f91719cf19cc8208e7568c6d31b1e18c3e43deab`.
- Runtime source baseline: SHA256
  `874c0249322163d2cd2583efd9b1866cc714eb6147eac411f0a2a49847b5df65`.
- The upstream runtime file at that commit has SHA256
  `83e5edbe453ea0e8e61e9a95852c2fc8a4ff746c996f93bec7c51f56d509c54d`.
- Two reviewed runtime differences are preserved from the current tested VTT
  copy: the `longRestCleanup` reversible-hit-point compatibility shim, and the
  Dread Ambusher effect icon path (retained in source; the spell-only projection
  excludes that class hook). See `MIGRATION.md`.

## Scope and limitations

This repository establishes the public runtime SDK and the included compiler /
authoring closure. It does not migrate the VTT or FVTT callers, change production
runtime profiles or certify live dual-host combat. VM/build/compiler acceptance
is not a claim of real GM/player or real Foundry smoke certification. The staged
plan is in `docs/evolution-plan.md`; the authoring entry point is in
`docs/dsl-authoring.md`.

The repository is public, but no npm publication, deployment or release/tag is
performed by this workspace.
