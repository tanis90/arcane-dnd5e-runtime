import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readRuntimeSource} from '../src/index.mjs';

test('runtime source parses and registers core hooks without accessing a world at load time', async () => {
  const registered = [];
  const Hooks = {
    on: (name, callback) => {
      assert.equal(typeof callback, 'function');
      registered.push(name);
    },
    once: (name, callback) => {
      assert.equal(typeof callback, 'function');
      registered.push(name);
    },
  };
  const source = await readRuntimeSource();
  new vm.Script(source, {filename: 'automation.js'}).runInNewContext({Hooks, console});
  for (const name of ['ready', 'dnd5e.preUseActivity', 'midi-qol.RollComplete', 'updateCombat', 'deleteCombat']) {
    assert(registered.includes(name), name);
  }
});
