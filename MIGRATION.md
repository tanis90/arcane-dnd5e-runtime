# Migration guide

## From the source packages

The previous public source split the runtime across two packages:

- `@arcanedesk/auto2014-runtime@0.4.0`: `readRuntimeSource()` and the raw
  `automation.js`.
- `@arcanedesk/spell-runtime@0.1.0`: `buildSpellRuntime()`, exclusions and
  availability checks, projected into a browser initializer.

This workspace replaces both entry points with `@arcanedesk/spell-runtime-sdk`.
The package is renamed to avoid confusion with the old projection-only package.
`@arcanedesk/automation-contracts@0.1.0` keeps its API and package name.

| Previous import | New import |
| --- | --- |
| `@arcanedesk/auto2014-runtime` | `@arcanedesk/spell-runtime-sdk` (`readRuntimeSource`) |
| `@arcanedesk/spell-runtime` | `@arcanedesk/spell-runtime-sdk` (`buildSpellRuntime`, `createRuntimeAvailability`) |
| `@arcanedesk/automation-contracts/*` | unchanged |

## Compiler and authoring closure

`@arcanedesk/spell-compiler@0.9.0` is now part of this repository. Its existing
`@arcanedesk/spell-compiler/dsl`, `compileSpellPlan`, `bindSpellPlan`,
`compileSpellAutomation`, `emitSpellAutomationItem` and subpath exports are
retained. The compiler declares Node `>=24 <25`; the runtime SDK and contracts
keep Node `>=22.12`. The higher compiler floor is explicit and is not propagated
to the runtime.

The internal QA-log path constants are not exported from the public DSL because
they pointed at private documentation. Pass an explicit acceptance source string
to `acceptance()`. The original mechanism fixture
`packages/spell-compiler/tests/fixtures/forge-spark.mjs` demonstrates DSL →
`compileSpellPlan` → `runtimePlan` → runtime availability without a production
spell catalogue, rules prose or private content.

## API mapping

`readRuntimeSource()` returns the exact reviewed `src/automation.js` bytes.
`buildSpellRuntime()` keeps its existing `{source, report}` result and projection
behavior. The new `createAuto2014Runtime(options)` is asynchronous and returns:

```js
const sdk = {
  manifest: {
    version: '0.1.0',
    schemaVersion: 1,
    sourceHash: reviewedSourceHash,
    buildHash: reviewedBuildHash,
    runtimeProfile: {id: 'arcane-dnd5e-2014', version: 1},
    contentPolicy: 'runtime-only',
    provenance: reviewedProvenance,
  },
  initializer: {
    factoryName: 'initializeSpellRuntime',
    moduleId: 'arcane-spells-2014',
    source: reviewedSource,
    manifest: reviewedManifest,
    initialize(host) {
      return host.evaluateInitializer({
        source: reviewedSource,
        manifest: reviewedManifest,
        moduleId: 'arcane-spells-2014',
      });
    },
  },
  initialize(host) {
    return this.initializer.initialize(host);
  },
};
```

The host must provide `evaluateInitializer({source, manifest, moduleId})` and
return the initialized runtime. The SDK never calls `eval`, `new Function`, a
Foundry API or a world document itself. A host may reuse an existing loader,
but it must call `initializeSpellRuntime({moduleId})` and preserve the
legacy-module ownership check.

## Source baseline and the two reviewed differences

This SDK copies the current tested VTT runtime, not a stale container or the
upstream file. The reviewed record lives in
`packages/spell-runtime/src/source-baseline.json`:

- Copied source SHA256:
  `874c0249322163d2cd2583efd9b1866cc714eb6147eac411f0a2a49847b5df65`.
- Upstream commit:
  `f91719cf19cc8208e7568c6d31b1e18c3e43deab`.
- Upstream source SHA256:
  `83e5edbe453ea0e8e61e9a95852c2fc8a4ff746c996f93bec7c51f56d509c54d`.

The only differences from upstream are:

1. `cleanupReversibleHitPointCapacity(effect, options)` skips the second
   current-hit-point adjustment when the host deletes a registered reversible
   hit-point-capacity effect with `{longRestCleanup: true}`. Native long rest has
   already cleared temporary maximum HP and restored the base maximum; rebalance
   and ordinary expiry/deletion paths are unchanged.
2. The source copy's Dread Ambusher effect keeps the tested host icon path
   `modules/arcane-dnd5e-2014-automation/Nicons/Ability_Ambush.png` instead of
   the upstream game-icons SVG path. The spell-only projection removes the
   Dread Ambusher class hook, so this class-ability icon is retained in the
   reviewed source/baseline but is not expected in the generated spell artifact.

Do not replace this file with the upstream or an older container copy. If the
host-specific long-rest behavior is reworked, the adapter and the runtime patch
must be migrated together and the source baseline reviewed again. Never refresh
the baseline hash automatically in CI.

## Host migration notes

- **Module ID:** the manifest default is `arcane-spells-2014`; callers may pass a
  different host `moduleId`, but the internal automation schema and persisted
  flags remain `arcane-dnd5e-2014-automation`.
- **Long-rest hook:** the current host deletes registered effects with
  `{longRestCleanup: true}` and lets `deleteActiveEffect` perform cleanup. Move
  that rest orchestration into a named host adapter in Stage B; do not remove the
  runtime shim until the full Auto2014/R3 and real GM/player gates pass.
- **Icons:** keep the tested icon path until the host asset pipeline is rebuilt;
  this SDK does not ship that image.
- **Availability:** `createRuntimeAvailability()` is unchanged and still checks
  installation prerequisites, not live combat readiness.

## Build and rollback

`npm run build` regenerates `dist/spell-runtime.mjs` and `dist/manifest.json`.
The manifest binds the package version, schema, enforced runtime profile, source
hash and build hash. Pin a released version plus its hashes; do not edit the
generated files or copy an unreviewed runtime into a live module.

Rollback by pinning the previous SDK version and restoring its matching
`dist/` artifact/manifest. Do not roll back by editing a current generated file.
The old source packages can remain as compatibility re-exports later, but this
batch does not modify their repositories.

## Not migrated in this batch

This repository establishes the public runtime SDK and compiler/authoring
closure. It does not switch VTT or FVTT to the SDK, migrate the long-rest
adapter, change the production runtime profile, publish to npm, create a release
tag or certify a live world. See `docs/evolution-plan.md`.
