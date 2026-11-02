import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'acorn';

const repoRoot = fileURLToPath(new URL('../../../', import.meta.url));
const documents = {
  readme: 'README.md',
  migration: 'MIGRATION.md',
  evolution: 'docs/evolution-plan.md',
  dsl: 'docs/dsl-authoring.md',
  packageReadme: 'packages/spell-runtime/README.md',
};

async function textOf(relative) {
  return readFile(path.join(repoRoot, relative), 'utf8');
}

function codeBlocks(markdown) {
  return [...markdown.matchAll(/```(?:js|javascript)\n([\s\S]*?)```/g)].map(match => match[1]);
}

test('documentation covers the SDK boundary and staged host migration', async () => {
  const contents = Object.fromEntries(await Promise.all(
    Object.entries(documents).map(async ([key, relative]) => [key, await textOf(relative)]),
  ));
  const required = {
    readme: ['runtime-only', 'createAuto2014Runtime', 'evaluateInitializer', 'not a claim',
      '874c0249322163d2cd2583efd9b1866cc714eb6147eac411f0a2a49847b5df65'],
    migration: ['longRestCleanup', 'Dread Ambusher', 'rollback', 'source-baseline.json'],
    evolution: ['Stage A', 'Stage B', 'Stage C', 'Stage D', 'enforced profile', 'longRestCleanup',
      'Rollback', 'Generated artifacts', 'FVTT', 'R3'],
    dsl: ['@arcanedesk/spell-compiler/dsl', 'defineSpell', 'graphFragment', 'rule', 'operation',
      'artifact', 'omissions', 'profileId'],
    packageReadme: ['runtime-only', 'createAuto2014Runtime', 'evaluateInitializer', 'vm'],
  };
  for (const [key, terms] of Object.entries(required)) {
    const normalized = contents[key].replace(/\s+/g, ' ');
    for (const term of terms) assert(normalized.includes(term), `${documents[key]} lacks ${term}`);
  }
  for (const content of Object.values(contents)) {
    assert(!/\/home\/|\/Users\/|[A-Za-z]:\\|\/tmp\/|file:\/\/\//.test(content), 'private path in docs');
    assert(!/BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}/.test(content),
      'credential material in docs');
  }
});

test('documented JavaScript snippets parse without a second DSL or host side effects', async () => {
  for (const [key, relative] of Object.entries(documents)) {
    const markdown = await textOf(relative);
    const blocks = codeBlocks(markdown);
    if (key !== 'evolution') assert(blocks.length > 0, `${relative} has no JavaScript example`);
    for (const [index, block] of blocks.entries()) {
      assert.doesNotThrow(() => parse(block, {
        ecmaVersion: 'latest',
        sourceType: 'module',
        allowAwaitOutsideFunction: true,
      }), `${relative} block ${index + 1} does not parse`);
      assert(!/\beval\s*\(|\bnew Function\s*\(/.test(block), `${relative} tells the host to eval code`);
    }
  }
});

test('documented repository links resolve', async () => {
  const all = (await Promise.all(Object.values(documents).map(textOf))).join('\n');
  const links = new Set([...all.matchAll(/`(README\.md|MIGRATION\.md|docs\/[A-Za-z0-9._-]+\.md|packages\/[A-Za-z0-9._/-]+)`/g)]
    .map(match => match[1]));
  for (const link of links) {
    const info = await stat(path.join(repoRoot, link));
    assert(info.isFile(), link);
  }
});
