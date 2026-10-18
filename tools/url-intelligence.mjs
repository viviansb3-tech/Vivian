import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.resolve(root, process.argv[2] || 'dist');

const cleanBase = value => {
  if (!value) return null;
  let candidate = String(value).trim();
  if (!candidate) return null;
  if (!/^https?:\/\//i.test(candidate)) candidate = `https://${candidate}`;
  try {
    const url = new URL(candidate);
    url.hash = '';
    url.search = '';
    if (!url.pathname.endsWith('/')) url.pathname += '/';
    return url.toString();
  } catch {
    return null;
  }
};

const inferGitHubPages = () => {
  const repository = process.env.GITHUB_REPOSITORY || '';
  const [owner, repo] = repository.split('/');
  if (!owner || !repo) return null;
  if (repo.toLowerCase() === `${owner.toLowerCase()}.github.io`) return `https://${owner}.github.io/`;
  return `https://${owner}.github.io/${repo}/`;
};

const provider = process.env.PORTFOLIO_DEPLOY_PROVIDER
  || (process.env.NETLIFY === 'true' || process.env.CONTEXT ? 'netlify'
  : process.env.VERCEL === '1' || process.env.VERCEL_ENV ? 'vercel'
  : process.env.GITHUB_ACTIONS === 'true' ? 'github-pages'
  : 'local');

const deployContext = process.env.PORTFOLIO_DEPLOY_CONTEXT
  || process.env.CONTEXT
  || process.env.VERCEL_ENV
  || (process.env.GITHUB_ACTIONS === 'true' ? 'production' : 'local');
const production = deployContext === 'production' || (provider === 'github-pages' && deployContext !== 'preview');

const explicit = cleanBase(process.env.PORTFOLIO_SITE_URL);
const netlifyBase = cleanBase(process.env.URL);
const vercelProduction = cleanBase(process.env.VERCEL_PROJECT_PRODUCTION_URL);
const vercelDeployment = cleanBase(process.env.VERCEL_URL);
const githubBase = cleanBase(process.env.GITHUB_PAGES_URL) || cleanBase(inferGitHubPages());

let baseUrl = explicit;
if (!baseUrl && provider === 'netlify') baseUrl = netlifyBase;
if (!baseUrl && provider === 'vercel') baseUrl = vercelProduction || (production ? vercelDeployment : null);
if (!baseUrl && provider === 'github-pages') baseUrl = githubBase;

const walk = async dir => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
};

const escapeAttr = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
const relativeWebPath = file => path.relative(target, file).split(path.sep).join('/');
const pageUrl = rel => {
  if (!baseUrl) return null;
  if (rel === 'index.html') return baseUrl;
  const canonicalPath = provider === 'vercel' ? rel.replace(/\.html$/i, '') : rel;
  return new URL(canonicalPath, baseUrl).toString();
};
const assetUrl = rel => baseUrl ? new URL(rel, baseUrl).toString() : null;

const upsertHead = (html, tag, matcher) => {
  html = html.replace(matcher, '');
  return html.replace('</head>', `${tag}</head>`);
};

const commonImage = assetUrl('images/vivian-graduation-primary.jpg');
const htmlFiles = (await walk(target)).filter(file => file.endsWith('.html'));
const sitemapEntries = [];

for (const file of htmlFiles) {
  let html = await readFile(file, 'utf8');
  const rel = relativeWebPath(file);
  const canonical = pageUrl(rel);

  html = html.replace(/<link\b[^>]*rel=["']canonical["'][^>]*>\s*/gi, '');
  html = html.replace(/<meta\b[^>]*property=["']og:url["'][^>]*>\s*/gi, '');
  html = html.replace(/<meta\b[^>]*name=["']portfolio-(?:environment|provider|canonical-status|build)["'][^>]*>\s*/gi, '');

  const pageShouldIndex = production && !['404.html', 'thanks.html'].includes(rel);
  const indexing = pageShouldIndex ? 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' : (production ? 'noindex,follow,noarchive' : 'noindex,nofollow,noarchive');
  if (/<meta\b[^>]*name=["']robots["']/i.test(html)) {
    html = html.replace(/<meta\b([^>]*?)name=["']robots["']([^>]*?)>/i, `<meta name="robots" content="${indexing}">`);
  } else {
    html = html.replace('</head>', `<meta name="robots" content="${indexing}"></head>`);
  }

  const metadata = [
    `<meta name="portfolio-environment" content="${escapeAttr(deployContext)}">`,
    `<meta name="portfolio-provider" content="${escapeAttr(provider)}">`,
    `<meta name="portfolio-canonical-status" content="${baseUrl ? 'resolved' : 'pending-deployment'}">`
  ].join('');
  html = html.replace('</head>', `${metadata}</head>`);

  if (canonical) {
    html = html.replace('</head>', `<link rel="canonical" href="${escapeAttr(canonical)}"><meta property="og:url" content="${escapeAttr(canonical)}"></head>`);
    if (pageShouldIndex) sitemapEntries.push(canonical);
  }

  if (commonImage) {
    if (/<meta\b[^>]*property=["']og:image["']/i.test(html)) {
      html = html.replace(/<meta\b([^>]*?)property=["']og:image["']([^>]*?)>/i, `<meta property="og:image" content="${escapeAttr(commonImage)}">`);
    } else {
      html = html.replace('</head>', `<meta property="og:image" content="${escapeAttr(commonImage)}"></head>`);
    }
    if (/<meta\b[^>]*name=["']twitter:image["']/i.test(html)) {
      html = html.replace(/<meta\b([^>]*?)name=["']twitter:image["']([^>]*?)>/i, `<meta name="twitter:image" content="${escapeAttr(commonImage)}">`);
    }
  }

  if (rel === 'index.html' && baseUrl) {
    html = html.replace(/<script([^>]*type=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/i, (whole, attrs, body) => {
      try {
        const data = JSON.parse(body);
        data.url = baseUrl;
        data.image = commonImage || data.image;
        return `<script${attrs}>${JSON.stringify(data)}</script>`;
      } catch {
        return whole;
      }
    });
  }

  await writeFile(file, html, 'utf8');
}

const robotsPath = path.join(target, 'robots.txt');
const robots = production
  ? `User-agent: *\nAllow: /\n${baseUrl ? `\nSitemap: ${new URL('sitemap.xml', baseUrl)}\n` : ''}`
  : 'User-agent: *\nDisallow: /\n';
await writeFile(robotsPath, robots, 'utf8');

const sitemapPath = path.join(target, 'sitemap.xml');
if (production && baseUrl) {
  const urls = [...new Set(sitemapEntries)].sort();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${url.replaceAll('&', '&amp;')}</loc></url>`).join('\n')}\n</urlset>\n`;
  await writeFile(sitemapPath, xml, 'utf8');
}

const commit = (process.env.GITHUB_SHA || process.env.COMMIT_REF || process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 12) || null;
const meta = {
  phase: 57,
  provider,
  environment: deployContext,
  production,
  canonicalBaseUrl: baseUrl,
  canonicalStatus: baseUrl ? 'resolved' : 'pending-deployment',
  commit,
  generatedAt: new Date().toISOString(),
  indexing: production ? 'index' : 'noindex'
};
await writeFile(path.join(target, 'deployment-meta.json'), `${JSON.stringify(meta, null, 2)}\n`, 'utf8');

console.log(`URL intelligence: provider=${provider}, environment=${deployContext}, canonical=${baseUrl || 'pending'}, indexing=${meta.indexing}`);
