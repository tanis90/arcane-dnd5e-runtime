import {readFile} from 'node:fs/promises';
import {hashString} from '@arcanedesk/automation-contracts/semantics';
import {
  CONTENT_POLICY,
  DEFAULT_MODULE_ID,
  INITIALIZER_FACTORY,
  RUNTIME_SCHEMA_VERSION,
  SDK_VERSION,
} from './metadata.mjs';

const PACKAGE_NAME = '@arcanedesk/spell-runtime-sdk';
const MANIFEST_URL = new URL('../dist/manifest.json', import.meta.url);
const ARTIFACT_URL = new URL('../dist/spell-runtime.mjs', import.meta.url);
const SOURCE_URL = new URL('./automation.js', import.meta.url);

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

async function readText(url, label) {
  try {
    return await readFile(url, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw new Error(`${label} is missing; run npm run build in the SDK workspace`, {cause: error});
    }
    throw error;
  }
}

function validateManifest(manifest) {
  if (manifest?.name !== PACKAGE_NAME || manifest.version !== SDK_VERSION) {
    throw new Error(`Unexpected spell runtime manifest identity: ${manifest?.name}@${manifest?.version}`);
  }
  if (manifest.schemaVersion !== RUNTIME_SCHEMA_VERSION) {
    throw new Error(`Unsupported spell runtime schema: ${manifest.schemaVersion}`);
  }
  if (manifest.contentPolicy !== CONTENT_POLICY) {
    throw new Error(`Unexpected spell runtime content policy: ${manifest.contentPolicy}`);
  }
  if (manifest.artifact?.path !== 'dist/spell-runtime.mjs' || manifest.artifact?.sha256 !== manifest.buildHash) {
    throw new Error('Spell runtime manifest artifact hash is inconsistent');
  }
  if (manifest.source?.path !== 'src/automation.js' || manifest.source?.sha256 !== manifest.sourceHash) {
    throw new Error('Spell runtime manifest source hash is inconsistent');
  }
}

async function readRuntimeBuild() {
  const [manifestText, source, automation] = await Promise.all([
    readText(MANIFEST_URL, 'Spell runtime manifest'),
    readText(ARTIFACT_URL, 'Spell runtime build'),
    readText(SOURCE_URL, 'Spell runtime source'),
  ]);
  let manifest;
  try {
    manifest = JSON.parse(manifestText);
  } catch (error) {
    throw new Error('Spell runtime manifest is not valid JSON', {cause: error});
  }
  validateManifest(manifest);
  if (hashString(source) !== manifest.buildHash) {
    throw new Error('Spell runtime build hash does not match its manifest; run npm run build');
  }
  if (hashString(automation) !== manifest.sourceHash) {
    throw new Error('Spell runtime source hash does not match its manifest; review and rebuild the projection');
  }
  return {manifest: deepFreeze(manifest), source};
}

function assertModuleId(moduleId) {
  if (typeof moduleId !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(moduleId)) {
    throw new TypeError('moduleId must be a lowercase package-style identifier');
  }
}

function assertHost(host) {
  if (!host || typeof host !== 'object' || typeof host.evaluateInitializer !== 'function') {
    throw new TypeError('initialize(host) requires host.evaluateInitializer({source, manifest, moduleId})');
  }
}

/** Read the locked build and return a browser initializer payload. The SDK only
 * reads bytes; the host owns module loading/evaluation and world access.
 */
export async function createAuto2014Runtime(options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('createAuto2014Runtime options must be an object');
  }
  const moduleId = options.moduleId ?? DEFAULT_MODULE_ID;
  assertModuleId(moduleId);
  const {manifest, source} = await readRuntimeBuild();

  const initializer = {
    factoryName: INITIALIZER_FACTORY,
    moduleId,
    source,
    manifest,
    /** Delegate evaluation to the host. The host receives an immutable payload;
     * its return value is the initialized runtime and is passed through as-is.
     */
    async initialize(host) {
      assertHost(host);
      const runtime = await host.evaluateInitializer(Object.freeze({source, manifest, moduleId}));
      if (!runtime || typeof runtime !== 'object') {
        throw new TypeError('host.evaluateInitializer must return the initialized runtime object');
      }
      return runtime;
    },
  };

  return Object.freeze({
    manifest,
    initializer: deepFreeze(initializer),
    initialize(host) {
      return initializer.initialize(host);
    },
  });
}
