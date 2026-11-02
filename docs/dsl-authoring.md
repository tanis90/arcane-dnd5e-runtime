# Authoring mechanisms with the spell compiler DSL

The repository includes the mechanism DSL, compiler and emitter in
`@arcanedesk/spell-compiler`, and one complete DND5E runtime in
`@arcanedesk/dnd5e-runtime`. It is the same `@arcanedesk/spell-compiler/dsl`
entry used by the public source, not a second authoring language. The compiler
turns a definition into a plan/projection; the runtime consumes the emitted
`runtimePlan`. Authors do not need to know module IDs, Midi-QOL/DAE flags or
Foundry document internals.

This page shows original mechanism fixtures only. It contains no rules text,
translation or artwork. The executable fixture is
`packages/spell-compiler/tests/fixtures/forge-spark.mjs`.

## Minimal mechanism

```js
import {
  cleanRoomEffect,
  cleanRoomSpell,
  consume,
  contentRef,
  dice,
  duration,
  graphFragment,
  operation,
  publicAction,
  rule,
  selected,
  spellContract,
  spellLifetime,
  trigger,
  whileSpellActive,
} from '@arcanedesk/spell-compiler/dsl';

export const forgeSpark = cleanRoomSpell({
  id: 'forge-spark',
  contract: spellContract({
    ruleset: '2014',
    level: 1,
    school: 'evo',
    components: {verbal: true, somatic: true, material: false},
    lifetime: spellLifetime(duration(1, 'minutes')),
  }),
  content: contentRef('forge-spark', {fields: ['name']}),
  emission: {contentVersion: 1},
  support: {
    level: 'simplified',
    omissions: [
      'Authoring fixture only; no published game content is included.',
    ],
  },
  fragments: [
    graphFragment({
      id: 'forge-spark-graph',
      actions: [publicAction('cast', 'Forge Spark')],
      artifacts: [
        cleanRoomEffect('forge-spark-mark', {
          host: 'actor',
          scope: 'source-target',
          reapply: 'replace',
          name: 'Forge Spark Mark',
          lifecycle: whileSpellActive(),
        }),
      ],
      rules: [
        rule({
          id: 'cast-forge-spark',
          on: trigger('action-used', {actionId: 'cast'}),
          targets: [
            selected('target:cast', {min: 1, max: 1, range: 30, kind: 'creature'}),
          ],
          do: [
            consume(),
            operation('damage', {
              id: 'cast:damage',
              target: 'target:cast',
              formula: dice(1, 6),
              damageTypes: ['force'],
            }),
            operation('apply-artifact', {
              id: 'cast:apply-mark',
              artifactId: 'forge-spark-mark',
              target: 'target:cast',
            }),
          ],
        }),
      ],
    }),
  ],
});
```

The author declares *what* happens: an action, a trigger, a target query,
operations and an artifact lifecycle. The compiler's lower-level `defineSpell`
form is also available; `cleanRoomSpell` adds the clean-room emission policy. The
compiler and runtime own host-specific wiring, resource consumption, Effect
lifecycle and damage application.

## Compile and consume

The compiler is build-time tooling and declares Node `>=24 <25`. The runtime SDK
and its browser artifact keep Node `>=22.12`:

```sh
npm ci
npm run test:compiler:node24
npm test
```

The chain is:

1. `compileSpellPlan(definition)` validates the DSL and returns the deterministic
   plan, including runtime rules, capabilities and hashes.
2. `compileSpellAutomation(sourceItem, definition)` binds caller-owned content
   identity and prepares the Foundry Item compilation.
3. `emitSpellAutomationItem(sourceItem, compilation)` emits the Item. Its
   `flags["arcane-dnd5e-2014-automation"].spellAutomation.runtimePlan` is the
   runtime-facing contract.
4. `describeSpellRequirements(plan)` describes declared providers, adapters,
   scripts and resources. `createRuntimeAvailability` in the runtime SDK checks
   installation readiness; it does not certify live combat.

```js
import {
  compileSpellAutomation,
  compileSpellPlan,
  emitSpellAutomationItem,
} from '@arcanedesk/spell-compiler';
import {describeSpellRequirements} from '@arcanedesk/automation-contracts/requirements';
import {createRuntimeAvailability} from '@arcanedesk/dnd5e-runtime';
import {forgeSpark, forgeSparkSourceItem} from './fixtures/forge-spark.mjs';

const plan = compileSpellPlan(forgeSpark);
const requirements = describeSpellRequirements(plan);
const sourceItem = forgeSparkSourceItem();
const compilation = compileSpellAutomation(sourceItem, forgeSpark, {
  documentIdentity: {_id: sourceItem._id},
  packaging: {},
});
const item = emitSpellAutomationItem(sourceItem, compilation);
const runtimePlan = item.flags['arcane-dnd5e-2014-automation'].spellAutomation.runtimePlan;

const checkReadiness = createRuntimeAvailability({
  game: hostGame,
  runtime: hostRuntime,
  midi: () => hostMidi,
});
const availability = await checkReadiness(requirements);
```

`hostGame`, `hostRuntime` and `hostMidi` are supplied by the host. The compiler
does not read a world, a compendium or an image asset. A compiled plan alone does
not certify resource readiness.

## Reusable pieces

- `graphFragment({actions, artifacts, rules})` groups a mechanism. Fragments can
  be composed without copying host code.
- `artifact(...)`/`cleanRoomEffect(...)` describe persistent effects and their
  lifecycle. Use them for a mechanism that must survive a turn or an encounter.
- `operation(...)` names a runtime mechanism; `predicate(...)` guards it.
- `script` plus `spellScriptHandler(...)` is the reviewed extension point when a
  mechanism cannot be expressed with existing operations. New operations belong
  in the compiler/runtime contracts, not in an author-local JSON dialect.
- `support.omissions` records deliberate DM adjudication boundaries. It is part
  of the mechanism contract, not a second description.

## Content and resource boundaries

Names used by the compiler are mechanism identifiers. Display names, rules text,
translations and images belong to a separately licensed content binding. The
fixture requests only the `name` content field; the compiler can bind a caller's
content Item when a definition requests other fields, but the runtime and
compiler packages do not carry that content.

A summon or other resource is an explicit profile binding with `profileId`,
`revision` and a resolved document; it is never inferred from a private
compendium or a hard-coded world path.

Authors should be able to change a mechanic without knowing which host module
loads it. If a change needs a Foundry flag layout, a specific module ID or a
world document, it belongs in the host adapter or a reviewed runtime operation,
not in the author's spell definition.
