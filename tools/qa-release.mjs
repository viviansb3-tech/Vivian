import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.resolve(root, process.argv[2] || 'dist');
const manifestPath = path.join(target, 'release-manifest.json');
const sha = buffer => createHash('sha256').update(buffer).digest('hex');
const errors = [];
let manifest;
try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')); }
catch (error) { console.error(`FAIL — release-manifest.json unavailable: ${error.message}`); process.exit(1); }
if (manifest.phase !== 57) errors.push(`Manifest phase is ${manifest.phase}, expected 57.`);
if (manifest.hashAlgorithm !== 'SHA-256') errors.push(`Unexpected hash algorithm: ${manifest.hashAlgorithm}`);
if (!Array.isArray(manifest.entries) || !manifest.entries.length) errors.push('Manifest contains no file entries.');
const rebuilt = [];
for (const entry of manifest.entries || []) {
  const file = path.join(target, ...entry.path.split('/'));
  try {
    const info = await stat(file);
    const data = await readFile(file);
    const digest = sha(data);
    if (info.size !== entry.bytes) errors.push(`${entry.path}: size changed (${entry.bytes} -> ${info.size}).`);
    if (digest !== entry.sha256) errors.push(`${entry.path}: SHA-256 mismatch.`);
    rebuilt.push(`${entry.path}:${digest}`);
  } catch { errors.push(`${entry.path}: missing from release.`); }
}
const fingerprint = sha(Buffer.from(rebuilt.join('\n')));
if (fingerprint !== manifest.fingerprint) errors.push('Release fingerprint does not match manifest entries.');
if (manifest.files !== (manifest.entries || []).length) errors.push('Manifest file count is inconsistent.');
console.log('\nPhase 57 release verification');
console.log('-----------------------------');
console.log(`Release: ${manifest.releaseId || 'unknown'}`);
console.log(`Files verified: ${(manifest.entries || []).length}`);
console.log(`Fingerprint: ${String(manifest.fingerprint || '').slice(0, 20)}`);
if (errors.length) { for (const error of errors) console.error(`FAIL  ${error}`); process.exit(1); }
console.log('PASS — every public release file matches the SHA-256 manifest.');
