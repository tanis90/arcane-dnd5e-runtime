import fs from 'node:fs/promises';

/** Compatibility surface retained from @arcanedesk/auto2014-runtime. Reads the
 * canonical runtime bytes only; it does not evaluate them or touch a world.
 */
export function readRuntimeSource() {
  return fs.readFile(new URL('./automation.js', import.meta.url), 'utf8');
}
