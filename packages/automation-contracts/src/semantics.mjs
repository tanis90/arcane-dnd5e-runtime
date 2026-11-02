import {sha256} from "@noble/hashes/sha2.js";
import {bytesToHex} from "@noble/hashes/utils.js";

export const SPELL_AUTOMATION_SCHEMA_VERSION = 1;
export const SPELL_AUTOMATION_COMPILER_VERSION = "0.9.0";
export const ARCANE_AUTOMATION_MODULE_ID = "arcane-dnd5e-2014-automation";

export function hashString(value) {
  return bytesToHex(sha256(new TextEncoder().encode(value)));
}

export function stableValue(value) {
  if (Array.isArray(value)) {
    // Array order is semantic for rule targets/guards/operations. Callers that
    // model a set must sort that set before hashing or comparing it.
    return value.map(stableValue);
  }
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.keys(value)
      .filter(key => value[key] !== undefined && key !== "primitive" && key !== "provenance")
      .sort()
      .map(key => [key, stableValue(value[key])]),
  );
}

export function stableStringify(value, spaces = 0) {
  return JSON.stringify(stableValue(value), null, spaces);
}

export function semanticHash(value) {
  return hashString(stableStringify(value));
}
