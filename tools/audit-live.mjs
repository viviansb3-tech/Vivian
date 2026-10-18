import { writeFile } from 'node:fs/promises';

const raw = process.argv[2] || process.env.PORTFOLIO_SITE_URL;
if (!raw) {
  console.error('Usage: node tools/audit-live.mjs https://example.com/');
  process.exit(2);
}

let base;
try {
  base = new URL(raw);
  if (!base.pathname.endsWith('/')) base.pathname += '/';
} catch {
  console.error(`Invalid live URL: ${raw}`);
  process.exit(2);
}

const checks = [];
const fail = (name, detail) => checks.push({ name, ok: false, detail });
const pass = (name, detail) => checks.push({ name, ok: true, detail });

const get = async pathname => {
  const url = new URL(pathname, base);
  const response = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'VivianPortfolioPhase57Audit/1.0' } });
  return { url, response, text: await response.text() };
};

try {
  const home = await get('./');
  home.response.ok ? pass('Homepage HTTP', `${home.response.status} ${home.response.url}`) : fail('Homepage HTTP', `${home.response.status}`);
  const canonical = home.text.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1] || home.text.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)?.[1];
  canonical ? pass('Canonical URL', canonical) : fail('Canonical URL', 'Missing on homepage');
  const ogUrl = home.text.match(/<meta\b[^>]*property=["']og:url["'][^>]*content=["']([^"']+)/i)?.[1] || home.text.match(/<meta\b[^>]*content=["']([^"']+)["'][^>]*property=["']og:url["']/i)?.[1];
  ogUrl ? pass('Open Graph URL', ogUrl) : fail('Open Graph URL', 'Missing on homepage');
  /application\/ld\+json/i.test(home.text) ? pass('Structured data', 'JSON-LD present') : fail('Structured data', 'JSON-LD missing');
} catch (error) {
  fail('Homepage fetch', error.message);
}

for (const pathname of ['robots.txt', 'sitemap.xml', 'site.webmanifest', 'deployment-meta.json', 'release-manifest.json', 'application-brief.html', 'projects/hotelling-simulation.html']) {
  try {
    const item = await get(pathname);
    item.response.ok ? pass(pathname, `${item.response.status}`) : fail(pathname, `${item.response.status}`);
  } catch (error) {
    fail(pathname, error.message);
  }
}

try {
  const sitemap = await get('sitemap.xml');
  /<urlset\b/i.test(sitemap.text) && /<loc>https?:\/\//i.test(sitemap.text)
    ? pass('Sitemap format', 'Absolute URL entries present')
    : fail('Sitemap format', 'Missing urlset or absolute loc entries');
} catch (error) {
  fail('Sitemap format', error.message);
}

try {
  const release = await get('release-manifest.json');
  const data = JSON.parse(release.text);
  data.phase === 57 && data.releaseId && /^[a-f0-9]{64}$/i.test(data.fingerprint || '')
    ? pass('Release identity', `${data.releaseId} · ${data.files} files`)
    : fail('Release identity', 'Manifest phase/releaseId/fingerprint invalid');
} catch (error) {
  fail('Release identity', error.message);
}

const result = {
  auditedUrl: base.toString(),
  auditedAt: new Date().toISOString(),
  passed: checks.filter(x => x.ok).length,
  failed: checks.filter(x => !x.ok).length,
  checks
};
await writeFile('live-audit.json', `${JSON.stringify(result, null, 2)}\n`, 'utf8');

console.log('\nPhase 57 live-site audit');
console.log('------------------------');
for (const check of checks) console.log(`${check.ok ? 'PASS' : 'FAIL'}  ${check.name}: ${check.detail}`);
console.log(`\n${result.passed} passed, ${result.failed} failed.`);
if (result.failed) process.exit(1);
