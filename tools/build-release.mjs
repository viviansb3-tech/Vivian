import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const rootExtensions = new Set(['.html']);
const rootFiles = new Set([
  'favicon.svg',
  'landing.css',
  'site.webmanifest',
  'robots.txt',
  '.nojekyll',
  'styles.css',
  'phase43-case-studies.css',
  'phase44-real-results.css',
  'phase47-code-proof.css',
  'portfolio.min.css',
  'portfolio.js',
  'project-pages.css',
  'project-pages.js',
  'mobile-reliability.css'
]);
const publicDirectories = ['assets', 'images', 'projects'];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const entries = await readdir(root);
for (const entry of entries) {
  const source = path.join(root, entry);
  const info = await stat(source);
  if (!info.isFile()) continue;
  if (!rootExtensions.has(path.extname(entry)) && !rootFiles.has(entry)) continue;
  await cp(source, path.join(dist, entry));
}

for (const directory of publicDirectories) {
  await cp(path.join(root, directory), path.join(dist, directory), { recursive: true });
}

const copied = await readdir(dist);
console.log(`Release built in dist/ with ${copied.length} top-level entries.`);
