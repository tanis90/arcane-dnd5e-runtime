import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {auditAllPackages, auditRepository, PACKAGE_NAMES} from '../scripts/audit-lib.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));

test('the public repository has no private paths, credentials or content assets', async () => {
  const report = await auditRepository(root);
  assert(report.fileCount > 20);
  assert(report.files.includes('README.md'));
  assert(report.files.includes('packages/spell-compiler/src/data/spell-automation/dsl.mjs'));
  assert(!report.files.some(file => file.startsWith('node_modules/')));
});

test('every published workspace package passes the tarball content audit', async () => {
  const results = await auditAllPackages(root);
  assert.deepEqual(results.map(result => result.name).sort(), [
    '@arcanedesk/automation-contracts',
    '@arcanedesk/dnd5e-runtime',
    '@arcanedesk/spell-compiler',
  ]);
  assert.equal(results.length, PACKAGE_NAMES.length);
  for (const result of results) {
    assert(result.fileCount > 0);
    assert(result.files.every(file => !file.startsWith('tests/')));
    assert(result.files.every(file => !file.startsWith('fixtures/')));
  }
  const compiler = results.find(result => result.name === '@arcanedesk/spell-compiler');
  assert(compiler.files.includes('src/data/spell-automation/dsl.mjs'));
  const runtime = results.find(result => result.name === '@arcanedesk/dnd5e-runtime');
  assert(runtime.files.includes('dist/dnd5e-runtime.mjs'));
  assert(!runtime.files.some(file => file.includes('spell-runtime')));
});
