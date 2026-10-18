import { createHash } from 'node:crypto';
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.resolve(root, process.argv[2] || 'dist');
const manifestPath = path.join(target, 'release-manifest.json');

const walk = async dir => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
};
const sha = buffer => createHash('sha256').update(buffer).digest('hex');
const files = (await walk(target)).filter(file => file !== manifestPath).sort();
const entries = [];
let bytes = 0;
for (const file of files) {
  const data = await readFile(file);
  const info = await stat(file);
  const rel = path.relative(target, file).split(path.sep).join('/');
  bytes += info.size;
  entries.push({ path: rel, bytes: info.size, sha256: sha(data) });
}
const fingerprintInput = entries.map(item => `${item.path}:${item.sha256}`).join('\n');
const fingerprint = sha(Buffer.from(fingerprintInput));
const deploy = JSON.parse(await readFile(path.join(target, 'deployment-meta.json'), 'utf8'));
const releaseId = `P57-${fingerprint.slice(0, 12).toUpperCase()}`;
const manifest = {
  phase: 57,
  releaseId,
  fingerprint,
  hashAlgorithm: 'SHA-256',
  files: entries.length,
  bytes,
  provider: deploy.provider,
  environment: deploy.environment,
  production: deploy.production,
  canonicalBaseUrl: deploy.canonicalBaseUrl,
  commit: deploy.commit || null,
  generatedAt: new Date().toISOString(),
  entries
};
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Release manifest: ${releaseId} · ${entries.length} files · ${bytes} bytes · ${fingerprint.slice(0, 16)}`);
