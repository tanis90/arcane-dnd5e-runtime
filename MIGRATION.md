# Migration guide

## New identity

The public source now ships one complete DND5E 2014 runtime as
`@arcanedesk/dnd5e-runtime@0.1.0` at
<https://github.com/tanis90/arcane-dnd5e-runtime>. The earlier spell-only SDK and
its projection artifact are retired; there is no compatibility spell-only mode
and no second browser runtime. The previous repository URL redirects to the new
repository, but update local remotes and CI references to the new URL.

The compiler and contracts remain available as `@arcanedesk/spell-compiler@0.9.0`
and `@arcanedesk/automation-contracts@0.1.0`.

## Runtime API

`readRuntimeSource()` returns the exact reviewed `src/automation.js` bytes.
`buildDnd5eRuntime()` wraps all declarations, class/ancestry/UI/spell hooks and
API entries into the full initializer. `createDnd5eRuntime(options)` returns:

```js
const sdk = {
  manifest: {
    version: '0.1.0',
    schemaVersion: 1,
    runtimeKind: 'full',
    factoryName: 'initializeDnd5eRuntime',
    sourceHash: reviewedSourceHash,
    buildHash: reviewedBuildHash,
    runtimeProfile: {id: 'arcane-dnd5e-2014', version: 1},
    contentPolicy: 'runtime-only',
    provenance: reviewedProvenance,
  },
  initializer: {
    factoryName: 'initializeDnd5eRuntime',
    moduleId: 'arcane-dnd5e-2014-automation',
    source: reviewedSource,
    manifest: reviewedManifest,
    initialize(host) {
      return host.evaluateInitializer({
        source: reviewedSource,
        manifest: reviewedManifest,
        moduleId: 'arcane-dnd5e-2014-automation',
      });
    },
  },
  initialize(host) {
    return this.initializer.initialize(host);
  },
};
```

`createAuto2014Runtime` is retained as a compatibility alias for
`createDnd5eRuntime`; both resolve to the same full runtime. The host must
provide `evaluateInitializer({source, manifest, moduleId})` and return the
initialized runtime. The SDK never calls `eval`, `new Function`, a Foundry API or
a world document itself.

## Self-identity and legacy ownership

The factory determines ownership from the module identity:

- `legacy = game.modules.get('arcane-dnd5e-2014-automation')`
- `host = game.modules.get(moduleId)`
- `sameModuleReplacement = moduleId === 'arcane-dnd5e-2014-automation' && host === legacy`

Same-module source replacement initializes standalone even when the old Auto
module is active. A different module that sees the old Auto module active
receives `{mode: 'legacy'}`, exposes its API, and registers no hooks. There is no
`respectLegacy` global switch. Repeated initialization is idempotent; a partial
failure rolls back all registered hooks and restores
`ArcaneDnd5e2014SpellScripts`.

## Complete baseline

The complete runtime source is copied from the current tested VTT runtime, not
from a stale container or a spell-only projection. The reviewed record lives in
`packages/dnd5e-runtime/src/source-baseline.json`:

- Copied source SHA256:
  `a92843bd942d0c3ed90f3a8ac827f6a6cf7550638cbeb3169b3ad0be2ccd25b8`.
- Upstream commit:
  `f91719cf19cc8208e7568c6d31b1e18c3e43deab`.
- Upstream source SHA256:
  `83e5edbe453ea0e8e61e9a95852c2fc8a4ff746c996f93bec7c51f56d509c54d`.

The complete source retains these tested differences:

1. `cleanupReversibleHitPointCapacity(effect, options)` skips the second
   current-hit-point adjustment when the host deletes a registered reversible
   hit-point-capacity effect with `{longRestCleanup: true}`. Native long rest has
   already cleared temporary maximum HP and restored the base maximum; rebalance
   and ordinary expiry/deletion paths are unchanged.
2. The Dread Ambusher effect keeps the tested host icon path
   `modules/arcane-dnd5e-2014-automation/Nicons/Ability_Ambush.png` instead of
   the upstream game-icons SVG path.
3. `applyHitPointPoolAllocatorFromUse` recognizes the first-party HP pool
   settlement receipt (`__mtHpPoolProcessed` plus a strictly shaped
   `__mtHpPool`) and returns without a second roll, artifact or chat message.
   Success, explicit failure and explicit empty-target receipts are all accepted;
   a processed marker with a malformed receipt throws instead of falling back.
4. `applyIndependentProjectilesFromUse` honors `__mtProjectileOwner` on the real
   `workflowOptions`/usage paths, so the first-party projectile runtime remains
   the only orchestrator for the workflows it creates. The runtime direct path,
   child guard and receipts are unchanged.

The full runtime test baseline contains 54 hook registrations (48 unique names)
and 163 API keys. It is stored in
`packages/dnd5e-runtime/tests/fixtures/full-runtime-baseline.json`; the VM test
executes both the raw current runtime and the generated initializer and compares
the complete sets.

Do not replace this source with a projection, a stale container copy or an older
SDK artifact. Never refresh the baseline hash automatically in CI.

## Compiler and authoring closure

`@arcanedesk/spell-compiler@0.9.0` keeps its existing DSL and compiler exports.
The compiler declares Node `>=24 <25`; the runtime package keeps `>=22.12`. The
higher compiler floor is explicit and is not propagated to the runtime.

The original mechanism fixture
`packages/spell-compiler/tests/fixtures/forge-spark.mjs` demonstrates DSL →
`compileSpellPlan` → `runtimePlan` → runtime availability without a production
spell catalogue, rules prose or private content. The internal QA-log path
constants are not exported from the public DSL.

## Build and rollback

`npm run build` regenerates `dist/dnd5e-runtime.mjs` and `dist/manifest.json`.
The manifest binds the package version, schema, factory, full runtime profile,
source hash and build hash. Pin a released version plus its hashes; do not edit
the generated files or copy an unreviewed runtime into a live module.

Rollback restores the previous pinned package version and its matching
`dist/` artifact/manifest. Do not roll back by editing a current generated file.
The complete runtime and host adapter must be rolled back together.

## Not migrated in this batch

This repository establishes the public complete runtime SDK and compiler closure.
It does not switch VTT or FVTT callers, migrate a host adapter, change the
production runtime profile, publish to npm, create a release tag or certify a
live world. See `docs/evolution-plan.md`.
