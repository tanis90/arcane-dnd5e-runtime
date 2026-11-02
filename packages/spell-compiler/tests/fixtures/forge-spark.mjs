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

// Original mechanism fixture. It intentionally has no rules text, translation,
// image asset, compendium entry or world document.
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
    omissions: ['Authoring fixture only; no published game content is included.'],
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

export function forgeSparkSourceItem() {
  return {
    _id: 'aaaaaaaaaaaaaaaa',
    type: 'spell',
    name: 'Forge Spark',
    img: '',
    system: {
      identifier: 'forge-spark',
      description: {value: '', chat: ''},
      source: {
        custom: '',
        book: '',
        page: '',
        license: '',
        rules: '2014',
        revision: 1,
      },
      materials: {value: '', cost: 0, consumed: false},
      level: 1,
      classes: {value: ''},
      activities: {},
    },
    flags: {},
    effects: [],
    ownership: {default: 0},
    folder: null,
    sort: 0,
  };
}
