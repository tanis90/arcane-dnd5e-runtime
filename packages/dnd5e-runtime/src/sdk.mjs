import {readFile} from 'node:fs/promises';
import {hashString} from '@arcanedesk/automation-contracts/semantics';
import {
  CONTENT_POLICY,
  DEFAULT_MODULE_ID,
  INITIALIZER_FACTORY,
  RUNTIME_KIND,
  RUNTIME_SCHEMA_VERSION,
  SDK_VERSION,
} from './metadata.mjs';

const PACKAGE_NAME = '@arcanedesk/dnd5e-runtime';
const MANIFEST_URL = new URL('../dist/manifest.json', import.meta.url);
const ARTIFACT_URL = new URL('../dist/dnd5e-runtime.mjs', import.meta.url);
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
    throw new Error(`Unexpected DND5E runtime manifest identity: ${manifest?.name}@${manifest?.version}`);
  }
  if (manifest.schemaVersion !== RUNTIME_SCHEMA_VERSION) {
    throw new Error(`Unsupported DND5E runtime schema: ${manifest.schemaVersion}`);
  }
  if (manifest.contentPolicy !== CONTENT_POLICY) {
    throw new Error(`Unexpected DND5E runtime content policy: ${manifest.contentPolicy}`);
  }
  if (manifest.runtimeKind !== RUNTIME_KIND || manifest.factoryName !== INITIALIZER_FACTORY) {
    throw new Error('DND5E runtime manifest does not describe the full initializer');
  }
  if (manifest.artifact?.path !== 'dist/dnd5e-runtime.mjs' || manifest.artifact?.sha256 !== manifest.buildHash) {
    throw new Error('DND5E runtime manifest artifact hash is inconsistent');
  }
  if (manifest.source?.path !== 'src/automation.js' || manifest.source?.sha256 !== manifest.sourceHash) {
    throw new Error('DND5E runtime manifest source hash is inconsistent');
  }
}

async function readRuntimeBuild() {
  const [manifestText, source, automation] = await Promise.all([
    readText(MANIFEST_URL, 'DND5E runtime manifest'),
    readText(ARTIFACT_URL, 'DND5E runtime build'),
    readText(SOURCE_URL, 'DND5E runtime source'),
  ]);
  let manifest;
  try {
    manifest = JSON.parse(manifestText);
  } catch (error) {
    throw new Error('DND5E runtime manifest is not valid JSON', {cause: error});
  }
  validateManifest(manifest);
  if (hashString(source) !== manifest.buildHash) {
    throw new Error('DND5E runtime build hash does not match its manifest; run npm run build');
  }
  if (hashString(automation) !== manifest.sourceHash) {
    throw new Error('DND5E runtime source hash does not match its manifest; review and rebuild');
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

/** Read the locked full runtime build and return a browser initializer payload.
 * The SDK only reads bytes; the host owns module loading/evaluation and world
 * access. There is no spell-only projection or second runtime in this package.
 */
export async function createDnd5eRuntime(options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('createDnd5eRuntime options must be an object');
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

/** Compatibility name for hosts that used the previous Auto 2014 SDK entry.
 * It resolves to the same full runtime; there is no separate spell-only mode.
 */
export const createAuto2014Runtime = createDnd5eRuntime;
