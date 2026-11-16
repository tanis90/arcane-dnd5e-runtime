# Arcane DND5E 2014 Runtime and DSL SDK

Public source for the complete DND5E 2014 automation runtime, the mechanism DSL
and compiler, and the shared automation contracts. The runtime keeps every
class, ancestry, UI and spell hook in one browser initializer. It is not a
spell-only projection and it does not ship a second rules implementation.

Repository: <https://github.com/tanis90/arcane-dnd5e-runtime>

Current releases: runtime `@arcanedesk/dnd5e-runtime@0.1.1` (schema `1`, Node
`>=22.12`), contracts `0.1.0`, compiler `0.9.0` (Node `>=24 <25`). The
compiler's higher Node floor is declared only on that package; the browser/runtime
floor is not silently raised.

## Packages

| Package | Purpose | Node |
| --- | --- | --- |
| `@arcanedesk/dnd5e-runtime` | Complete runtime source, browser initializer, manifest and host API | `>=22.12` |
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
  buildDnd5eRuntime,
  createDnd5eRuntime,
  readRuntimeSource,
} from '@arcanedesk/dnd5e-runtime';

const source = await readRuntimeSource();       // exact src/automation.js bytes
const built = await buildDnd5eRuntime();        // wrapped full initializer
const sdk = await createDnd5eRuntime({moduleId: 'arcane-dnd5e-2014-automation'});
```

`readRuntimeSource()` returns the reviewed source. `buildDnd5eRuntime()` wraps
all runtime declarations, hooks and API entries into factory
`initializeDnd5eRuntime`. `createDnd5eRuntime()` returns the locked manifest and
browser initializer. The SDK entry is a Node build-time module; the emitted
`dist/dnd5e-runtime.mjs` is the browser artifact. Importing the SDK does not
connect to a world, register hooks or evaluate code.

`createAuto2014Runtime` remains a compatibility alias for `createDnd5eRuntime`.
It is the same full runtime, not a separate mode. The exact 54-hook/163-API
baseline, artifact path, manifest fields and self-identity rules are recorded in
`docs/runtime-baseline.md`.

### Host contract

The host owns module loading, evaluation and every world access. The SDK passes
the reviewed source and manifest to `host.evaluateInitializer()` and returns the
host's runtime object unchanged:

```js
const runtime = await sdk.initialize({
  async evaluateInitializer({source, manifest, moduleId}) {
    const initializeDnd5eRuntime = await loadHostModule(source, manifest);
    return initializeDnd5eRuntime({moduleId});
  },
});
```

`initializeDnd5eRuntime({moduleId})` must be called by the host. It returns
`{mode: 'standalone' | 'legacy', ...}`. The complete runtime is the only
artifact; there is no spell-only fallback.

### Self-identity and legacy ownership

The factory uses the module identity, not a global switch:

```js
const legacy = game.modules.get('arcane-dnd5e-2014-automation');
const host = game.modules.get(moduleId);
const sameModuleReplacement = moduleId === 'arcane-dnd5e-2014-automation' && host === legacy;
```

Same-module source replacement initializes standalone even when the old module is
active. A different module that sees the old Auto module active receives
`{mode: 'legacy'}`, exposes its API, and registers no hooks. Repeated
initialization is idempotent; a partial failure rolls back hooks and the
spell-script registry.

## Build and test

```sh
npm ci
npm test
npm run build
npm run test:compiler:node24
npm run pack:check
npm pack --dry-run --workspace @arcanedesk/dnd5e-runtime
```

`npm run build` writes `packages/dnd5e-runtime/dist/dnd5e-runtime.mjs` and
`packages/dnd5e-runtime/dist/manifest.json`. Both are generated artifacts and
must not be edited by hand. `npm test` executes the complete initializer in a
real Node `vm`, compares its 54 hook registrations and 163 API keys exactly
against the reviewed current-runtime baseline, compiles the original mechanism
fixture, checks rollback and legacy ownership, and audits the repository plus
every package tarball.

The compiler declares Node 24. `npm test` still runs its small suite on the
caller's Node when possible; `npm run test:compiler:node24` explicitly exercises
the declared engine with the locally available Node 24. `npm run pack:check`
audits the final repository and all `npm pack --dry-run` file lists for private
paths, credentials, images, compendium/world data and extra files.

`packages/dnd5e-runtime/src/source-baseline.json` is a manually reviewed full
runtime source hash. It is never refreshed automatically by CI.

## Owner CI receipt

`.github/workflows/owner-ci.yml` runs on every push, pull request and manual
dispatch under Node 24. Owner tooling (this workflow source plus `tools/`) and
the tested source are checked out separately: PRs and pushes test
`github.sha`, while a manual dispatch accepts a `testedCommit` input (a full
40-hex sha, defaulting to the pinned release commit) so an older pinned
commit can be certified after the tooling has merged. Each tree runs its own
`npm ci`; the tested source then runs `npm run build`, `npm test`,
`npm run test:compiler:node24` and `npm run pack:check`, and the tooling runs
`node owner-meta/tools/verify-owner-release.mjs --root <source> ...` as the
final step. The verifier re-checks the tested commit, the reviewed
`src/automation.js` hash, the committed `dist/dnd5e-runtime.mjs` bytes and
hashes, the manifest wiring and a deterministic in-memory rebuild of the
artifact. Only after every step and the verifier itself have succeeded does it
write `owner-ci-receipt.json` with `result: "passed"`, the Actions run URL and
the `testedCommit` / `artifactHash` values a federated frontend manifest binds
to. The workflow uploads the receipt and the tested dist as run artifacts. Any
failing step means no receipt exists, and outside Actions the verifier reports
`"runUrl": null`, so a local run can never be presented as CI evidence.

## SDK release artifact

A second job, `sdk-artifact`, re-checks out the certified commit, rebuilds it,
requires the committed `dist/` bytes to equal the rebuild, and assembles the
deterministic SDK distribution artifact with `tools/owner-ci/release.mjs`: four
members (`dnd5e-runtime.mjs`, `dnd5e-runtime.sdk-manifest.json`,
`dnd5e-runtime.LICENSE.txt`, `dnd5e-runtime.NOTICE.txt`), store-only, paths
sorted, fixed 1980-01-01 timestamps, `0644`, plus a manifest and a receipt.
Every member is compared with the git blob at the released commit, and the zip
is unpacked again and diffed against the source tree before the files are
written. `tools/owner-ci/README.md` documents the recipe and the local commands.

`release-publish` turns those three files into the assets of a GitHub Release,
but only for a `release-*` tag whose commit is an ancestor of `origin/main`
(D2/D8). It verifies the downloaded bytes against the tag commit, refuses to
overwrite an existing release, uploads to a draft, re-checks the draft's asset
names and sizes, and only then publishes. Branch pushes and pull requests upload
the same three files as private run artifacts (30-day retention) and never
create a release.

## Content policy and provenance

Every published package follows the `runtime-only` content policy: mechanisms,
contracts, compiler code, tests that are not packed, and build metadata only.
The runtime does not bundle Actor, Item, Effect or world data; the compiler does
not bundle any spell catalogue.
Private QA-log path constants from the internal compiler source are not exported
here; callers pass their own acceptance source.

- Upstream public source: `tanis90/arcanedesk-fvtt-mods`
  at `f91719cf19cc8208e7568c6d31b1e18c3e43deab`.
- Runtime source baseline: SHA256
  `581b0b651386438ef325754cbf9bf07fbc287a9b440cc798d908676ed7ddb86d`.
- The upstream runtime file at that commit has SHA256
  `83e5edbe453ea0e8e61e9a95852c2fc8a4ff746c996f93bec7c51f56d509c54d`.
- The complete source retains the `longRestCleanup` reversible-hit-point
  compatibility shim, the first-party HP-pool/projectile handshakes, the
  Bardic Inspiration visibility status and the Dread Ambusher game-icons path.
  These are part of the full runtime baseline, not a projection exception.

## Scope and limitations

This repository establishes the public complete runtime SDK and the included
compiler/authoring closure. It does not switch the VTT or FVTT callers, migrate a
host adapter, change production runtime profiles or certify live dual-host
combat. VM/build/compiler acceptance is not a claim of real GM/player or real
Foundry smoke certification. The staged plan is in `docs/evolution-plan.md`; the
authoring entry point is in `docs/dsl-authoring.md`.

The repository is public, but no npm publication or deployment is performed by
this workspace. The only release coordinate is a `release-*` GitHub Release cut
from `main`: tagging is a deliberate human action, and the owner CI lane then
attaches the deterministic three-file SDK artifact described above.
