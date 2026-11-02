# Evolution plan: VTT and FVTT

Status: Stage A and the public compiler/authoring closure are implemented in
this workspace. Stages B-D are not started here. This document is a gate plan,
not a claim that either host has switched.

## Invariants

1. One runtime implementation. VTT, FVTT and the SDK consume the same reviewed
   `automation.js`; adapters add host wiring, not a second rules implementation.
2. Runtime-only distribution. No spell descriptions, translations, compendium
   documents, images, world state or private credentials enter any package
   tarball or the public repository.
3. Explicit host boundary. The SDK reads bytes and hands them to the host. It
   never evaluates code or touches a world on import.
4. Versioned enforcement. Every installed runtime is identified by package
   version, schema version, enforced profile version, source hash and build hash.
5. Generated artifacts are immutable. `dist/dnd5e-runtime.mjs` and
   `dist/manifest.json` are rebuilt, never hand-edited. The source baseline hash
   changes only after human review.
6. A green build/VM suite is installation evidence, not live dual-host combat
   certification.

## Stage A: complete runtime SDK and compiler (this batch)

Deliverables:

- `@arcanedesk/dnd5e-runtime@0.1.0`, schema `1`, Node `>=22.12`.
- One full browser artifact, `dist/dnd5e-runtime.mjs`, with factory
  `initializeDnd5eRuntime`. All class, ancestry, UI and spell hooks/API entries
  are retained; there is no spell-only projection.
- `@arcanedesk/spell-compiler@0.9.0` with the existing DSL/compiler exports,
  explicit Node `>=24 <25`, and an original mechanism fixture.
- `readRuntimeSource()` and `buildDnd5eRuntime()` APIs.
- `createDnd5eRuntime()` with a manifest and explicit `initialize(host)`
  delegation; `createAuto2014Runtime` is only a compatibility alias.
- Reviewed full source baseline and deterministic `dist/` build.
- Real Node `vm` tests comparing the full initializer's 54 hook registrations and
  163 API keys exactly with the current complete runtime, plus self-identity,
  idempotency, rollback, ready API and long-rest behavior.
- Real compiler tests for DSL → deterministic plan → `runtimePlan` → runtime
  availability, plus explicit negative cases.
- Release-content checks over the repository and every package tarball: file
  whitelist, no content assets, manifest hash match, reviewed import graph and
  `npm pack --dry-run`.

Exit criteria for this closure: `npm ci`, all workspace tests, `npm run build`,
`npm run test:compiler:node24`, `npm run pack:check`, `npm pack --dry-run` and
`git diff --check` pass. No host is migrated.

## Stage B: VTT versioned adapter

### B1. Pin the runtime

Add the SDK as a pinned dependency of the VTT build. Record the manifest's
`version`, `schemaVersion`, `runtimeKind`, `factoryName`, `sourceHash`,
`buildHash` and enforced profile `arcane-dnd5e-2014` version `1` in the build
record. The VTT package should contain only the generated
`dist/dnd5e-runtime.mjs` and manifest, not another hand-maintained copy of
`automation.js`.

### B2. Extract the host adapter

Move the remaining host-specific wiring into a named VTT adapter:

- module registration and legacy/standalone ownership;
- `game`/`Hooks` access and module readiness;
- world document lookup and Effect lifecycle calls;
- rest orchestration and module availability checks.

The adapter calls `initializeDnd5eRuntime({moduleId})` through the host
`evaluateInitializer` contract. It must not import the SDK and silently register
hooks at module load time. The complete runtime's module identity rule applies:
same-module source replacement is standalone; a different module with active old
Auto is legacy and registers no hooks.

### B3. Migrate the long-rest hook

The current tested host deletes whitelisted registered effects with
`{longRestCleanup: true}`. The runtime's `deleteActiveEffect` path then skips the
second HP adjustment for reversible hit-point capacity while preserving rebalance
and ordinary deletion behavior. In Stage B:

1. Move the whitelist matching and rest listener into the adapter.
2. Keep the exact identifier plus compiler-artifact matching; do not delete all
   effects or clear concentration wholesale.
3. Pass `longRestCleanup: true` only for the registered long-rest cleanup path.
4. Run the long-rest suite before removing any compatibility shim.
5. Do not move the shim into shared runtime code until FVTT has the same host
   behavior.

### B4. Gates

Do not cut over on unit tests alone. Required evidence:

- complete Auto2014 regression suite (the current 1220-case chain);
- R3 six-spell and long-rest gates, including Aid/Warding Bond/Death Ward/
  Heroism/Heroes' Feast/Harm cleanup behavior;
- all 54 complete-runtime hook registrations and 163 API keys present;
- real GM plus non-GM player dual-client gate with actual HP/effects/slots;
- reload and rollback checks;
- a diff showing the VTT adapter, not the rule implementation, is the only
  changed layer.

### B5. Cutover and rollback

Cut over by pinning the SDK version and manifest hashes, then replacing the
generated artifact through the normal build. Roll back by restoring the previous
pinned version and its matching `dist/` artifact/manifest. Rolling back by
editing a generated file or copying a stale container runtime is prohibited.

## Stage C: FVTT Auto package as SDK + adapter

The Foundry module becomes a thin distribution:

- the SDK is pinned to the same version and manifest hashes as VTT;
- a Foundry adapter supplies `game`, `Hooks`, module registration, document
  access and FVTT-specific rest/effect wiring;
- the package manifest records the SDK version/hash and the enforced profile;
- no second copy of `automation.js` is created in the module tree.

Run a real FVTT smoke test on the declared Foundry and dnd5e versions, covering
initialization, legacy ownership, one representative spell, one long rest and a
reload. The shared VM suite does not replace this smoke test. Only after both
hosts pass the same version/hash is the SDK considered dual-host verified.

## Stage D: DSL authoring and custom mechanics

Authors use the included `@arcanedesk/spell-compiler/dsl`, not a new JSON
sandbox or a second DSL. A definition declares actions, targets, triggers,
operations, artifacts, lifecycle and support omissions. The compiler produces the
plan/projection; the emitted Item's `runtimePlan` is consumed by the runtime.
Compiler tooling declares Node `>=24 <25` while the runtime keeps `>=22.12`.

Display names, rules text, translations and images belong to a separate
licensed content binding. They are not part of the runtime SDK and are not
needed for an author to express a mechanism. Summon resources are explicit
bindings with profile IDs and revisions, not implicit compendium lookups.

Custom mechanics should be expressed with existing DSL atoms or reviewed script
handlers. New atoms require compiler/runtime contract updates and a schema
decision; authors should not need to know Midi-QOL, DAE, module IDs or Foundry
flag layouts.

## Enforced profile, hashes and CI

The current enforced profile is `arcane-dnd5e-2014`, version `1`, ruleset
`2014`, system `dnd5e` major version `5`. The manifest includes it together with
`sourceHash` and `buildHash`.

- Any profile change requires a new profile version and a regenerated manifest.
- CI checks the generated artifact against the manifest and the reviewed source
  baseline. It fails on drift; it never rewrites `source-baseline.json`.
- Release records pin the package version, profile version and both hashes.
- `npm pack --dry-run` must show only the reviewed mechanism-only file set for
  each package.
- `git diff --check` and a clean worktree are release hygiene, not runtime
  certification.

## Rollback discipline

Rollback restores the previous pinned package version and its matching generated
artifact/manifest. Never roll back by hand-editing a current `dist/` file,
copying an unreviewed container copy or changing the source baseline in place.
The manifest hashes and the release record must match the restored artifact.

## Known limits

- Stage B/C do not exist yet; VTT and FVTT remain on their existing wiring.
- The full runtime contains one reviewed dynamic import of the host's Aura
  Effects helper module; that is a host dependency, not bundled content.
- The compiler is included in this repository, but production spell catalogues,
  licensed content bindings and live-host certification remain outside it.
- The compiler's Node `>=24 <25` engine is explicit; the runtime SDK and browser
  artifact remain on `>=22.12`.
