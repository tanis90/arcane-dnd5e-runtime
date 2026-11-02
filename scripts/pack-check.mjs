import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {auditAllPackages, auditRepository} from './audit-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repository = await auditRepository(root);
const packages = await auditAllPackages(root);

console.log(`Repository audit: ${repository.fileCount} files, no private paths, credentials or content assets`);
for (const result of packages) {
  console.log(`Pack check: ${result.name}@${result.version}, ${result.fileCount} files, ${result.unpackedSize} bytes unpacked`);
}
