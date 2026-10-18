import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.resolve(root, process.argv[2] || 'dist');
const errors = [];
const warnings = [];

const exists = async file => { try { await stat(file); return true; } catch { return false; } };
const metaPath = path.join(target, 'deployment-meta.json');
if (!await exists(metaPath)) {
  console.error('FAIL — deployment-meta.json is missing.');
  process.exit(1);
}
const meta = JSON.parse(await readFile(metaPath, 'utf8'));
const htmlFiles = [];
const walk = async dir => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
};
await walk(target);

const robots = await readFile(path.join(target, 'robots.txt'), 'utf8');
const sitemapPath = path.join(target, 'sitemap.xml');

if (meta.production) {
  if (!meta.canonicalBaseUrl) errors.push('Production build has no canonicalBaseUrl.');
  if (!await exists(sitemapPath)) errors.push('Production build is missing sitemap.xml.');
  if (!/Sitemap:\s+https?:\/\//i.test(robots)) errors.push('Production robots.txt has no absolute Sitemap directive.');
  if (/^Disallow:\s*\/$/mi.test(robots)) errors.push('Production robots.txt blocks the entire site.');
} else {
  if (!/^Disallow:\s*\/$/mi.test(robots)) errors.push('Non-production build must block indexing in robots.txt.');
  if (await exists(sitemapPath)) errors.push('Non-production build should not publish sitemap.xml.');
}

for (const file of htmlFiles) {
  const rel = path.relative(target, file).split(path.sep).join('/');
  const html = await readFile(file, 'utf8');
  const robotsMeta = html.match(/<meta\b[^>]*name=["']robots["'][^>]*content=["']([^"']+)/i)?.[1]
    || html.match(/<meta\b[^>]*content=["']([^"']+)["'][^>]*name=["']robots["']/i)?.[1]
    || '';
  const canonical = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1]
    || html.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)?.[1]
    || null;
  const ogUrl = html.match(/<meta\b[^>]*property=["']og:url["'][^>]*content=["']([^"']+)/i)?.[1]
    || html.match(/<meta\b[^>]*content=["']([^"']+)["'][^>]*property=["']og:url["']/i)?.[1]
    || null;
  const shouldIndex = meta.production && !['404.html', 'thanks.html'].includes(rel);
  if (shouldIndex) {
    if (!canonical || !/^https?:\/\//i.test(canonical)) errors.push(`${rel}: missing absolute canonical URL.`);
    if (!ogUrl || !/^https?:\/\//i.test(ogUrl)) errors.push(`${rel}: missing absolute og:url.`);
    if (/noindex/i.test(robotsMeta)) errors.push(`${rel}: indexable production page is marked noindex.`);
  } else if (!/noindex/i.test(robotsMeta)) {
    errors.push(`${rel}: non-indexable page/build is missing noindex.`);
  }
}

if (meta.production && await exists(sitemapPath)) {
  const sitemap = await readFile(sitemapPath, 'utf8');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  if (!locs.length) errors.push('sitemap.xml contains no <loc> entries.');
  if (locs.some(url => !/^https?:\/\//i.test(url))) errors.push('sitemap.xml contains non-absolute URLs.');
  if (locs.some(url => /(?:404|thanks)(?:\.html)?\/?$/i.test(url))) errors.push('sitemap.xml includes a non-indexable utility page.');
}

console.log('\nDeployment intelligence QA');
console.log('--------------------------');
console.log(`Provider: ${meta.provider} | Environment: ${meta.environment} | Production: ${meta.production}`);
console.log(`Canonical: ${meta.canonicalBaseUrl || 'pending deployment'}`);
console.log(`HTML inspected: ${htmlFiles.length}`);
if (warnings.length) for (const warning of warnings) console.log(`WARN  ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`FAIL  ${error}`);
  process.exit(1);
}
console.log('PASS — deployment metadata, indexing and canonical rules are internally consistent.');
