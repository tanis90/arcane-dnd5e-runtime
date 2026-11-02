# `@arcanedesk/spell-compiler`

Content-independent compiler, clean-room emitter and mechanism DSL for Arcane
Auto 2014. Version `0.9.0`.

This package is build-time tooling and declares Node `>=24 <25`. The separate
runtime SDK keeps its browser/runtime-compatible Node floor of `>=22.12`; the
compiler's higher floor is not propagated to the runtime.

```js
import {compileSpellPlan} from '@arcanedesk/spell-compiler';
import {
  cleanRoomSpell,
  graphFragment,
  publicAction,
  rule,
  selected,
  trigger,
} from '@arcanedesk/spell-compiler/dsl';

const plan = compileSpellPlan(definition);
```

`compileSpellPlan(definition)` compiles a trusted clean-room DSL graph without
reading a source Item. The JSON-serializable result contains mechanics, content
references, runtime rules and hashes, but no description, translation, image or
target document identity.

`compileSpellAutomation(sourceItem, definition, options)` binds caller-owned
content identity and returns the input for `emitSpellAutomationItem`. The emitted
Item carries `flags["arcane-dnd5e-2014-automation"].spellAutomation.runtimePlan`,
which is the contract consumed by the runtime. The compiler does not certify
runtime resource readiness; use `describeSpellRequirements` and the host's
resource verifier for that step.

`bindSpellPlan`, `composeSpellItem`, `extractCleanRoomDocumentIdentity` and
`extractCleanRoomPackaging` retain their existing exports. The `./binding` and
`./emitter` subpaths are browser-safe for precompiled plans; the DSL/compiler
entry remains Node build-time tooling.

## Public source boundary

This package contains mechanisms only. It ships no spell descriptions, rules
text, translations, images, compendium documents, world state or private content.
The original internal QA-log path constants are not exported here because they
reference private documentation; callers can pass their own acceptance source
string to `acceptance()`.

The compiler test suite uses an original `forge-spark` mechanism fixture. It
compiles a DSL definition, checks deterministic plan/runtime hashes, verifies the
runtime availability contract and emits a Foundry Item whose `runtimePlan` is
present without any rules prose. No production spell catalogue is required.
