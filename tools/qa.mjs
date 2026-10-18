import { execFileSync } from 'node:child_process';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targetArg = process.argv[2] || '.';
const target = path.resolve(scriptRoot, targetArg);
const errors = [];
const warnings = [];
const metrics = { html: 0, js: 0, css: 0, json: 0, localRefs: 0, anchors: 0 };

const exists = async p => {
  try { await stat(p); return true; } catch { return false; }
};

const walk = async dir => {
  const output = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (['.git', '.lighthouseci', 'node_modules'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) output.push(...await walk(full));
    else output.push(full);
  }
  return output;
};

const stripQuery = value => value.split('?')[0];
const idsFor = html => new Set([...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(m => m[1]));
const duplicateIds = html => {
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(m => m[1]);
  return [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
};

const resolveLocal = (htmlFile, ref) => {
  const withoutFragment = ref.split('#')[0];
  let pathname = stripQuery(withoutFragment);
  try { pathname = decodeURIComponent(pathname); } catch {}
  if (!pathname || pathname === '.') return htmlFile;
  if (pathname === './' || pathname === '/') return path.join(target, 'index.html');
  const base = pathname.startsWith('/') ? target : path.dirname(htmlFile);
  const candidate = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  return path.resolve(base, candidate);
};

const files = await walk(target);
const htmlFiles = files.filter(f => f.endsWith('.html'));
const jsFiles = files.filter(f => f.endsWith('.js'));
const cssFiles = files.filter(f => f.endsWith('.css'));
const jsonFiles = files.filter(f => f.endsWith('.json') || f.endsWith('.webmanifest'));
metrics.html = htmlFiles.length;
metrics.js = jsFiles.length;
metrics.css = cssFiles.length;
metrics.json = jsonFiles.length;

for (const js of jsFiles) {
  try { execFileSync(process.execPath, ['--check', js], { stdio: 'pipe' }); }
  catch (error) { errors.push(`JavaScript syntax: ${path.relative(target, js)} — ${String(error.stderr || error.message).trim()}`); }
}

for (const json of jsonFiles) {
  try { JSON.parse(await readFile(json, 'utf8')); }
  catch (error) { errors.push(`Invalid JSON: ${path.relative(target, json)} — ${error.message}`); }
}

const htmlCache = new Map();
for (const file of htmlFiles) htmlCache.set(file, await readFile(file, 'utf8'));

for (const [file, html] of htmlCache) {
  const rel = path.relative(target, file);
  const duplicates = duplicateIds(html);
  if (duplicates.length) errors.push(`Duplicate IDs in ${rel}: ${duplicates.join(', ')}`);

  if (!/<html\b[^>]*\blang=["'][^"']+/i.test(html)) errors.push(`Missing html[lang] in ${rel}`);
  if (!/<title>[^<]+<\/title>/i.test(html)) errors.push(`Missing <title> in ${rel}`);
  if (!/<meta\b[^>]*name=["']viewport["']/i.test(html)) errors.push(`Missing viewport meta in ${rel}`);
  if (!/<main\b/i.test(html)) warnings.push(`No <main> landmark in ${rel}`);
  if (!/<h1\b/i.test(html)) warnings.push(`No <h1> in ${rel}`);

  for (const match of html.matchAll(/<a\b([^>]*?)target=["']_blank["']([^>]*)>/gi)) {
    const attrs = `${match[1]} ${match[2]}`;
    const relMatch = attrs.match(/\brel=["']([^"']*)["']/i);
    const relTokens = new Set((relMatch?.[1] || '').split(/\s+/).filter(Boolean));
    if (!relTokens.has('noopener') || !relTokens.has('noreferrer')) errors.push(`Unsafe target=_blank link in ${rel}`);
  }

  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
    const ref = match[1].trim();
    if (!ref || ref.includes('${') || ref.startsWith('data:') || ref.startsWith('javascript:')) continue;
    if (/^(https?:|mailto:|tel:|sms:|whatsapp:)/i.test(ref)) {
      if (/^http:\/\//i.test(ref)) warnings.push(`Insecure external HTTP reference in ${rel}: ${ref}`);
      continue;
    }

    metrics.localRefs += 1;
    const [pathPart, fragment] = ref.split('#');
    const resolved = resolveLocal(file, ref);
    let targetFile = resolved;
    if (await exists(resolved)) {
      const info = await stat(resolved);
      if (info.isDirectory()) targetFile = path.join(resolved, 'index.html');
    }

    if (!await exists(targetFile)) {
      errors.push(`Broken local reference in ${rel}: ${ref}`);
      continue;
    }

    if (fragment) {
      metrics.anchors += 1;
      const ext = path.extname(targetFile).toLowerCase();
      if (ext === '.html') {
        const targetHtml = htmlCache.get(targetFile) ?? await readFile(targetFile, 'utf8');
        if (!idsFor(targetHtml).has(fragment)) errors.push(`Broken fragment in ${rel}: ${ref}`);
      }
    }
  }

  if (/\b(?:TODO|FIXME|LOREM IPSUM)\b/i.test(html)) warnings.push(`Development placeholder text found in ${rel}`);
}

const indexPath = path.join(target, 'index.html');
if (!await exists(indexPath)) errors.push('Missing index.html');
else {
  const index = htmlCache.get(indexPath) ?? await readFile(indexPath, 'utf8');
  if (!/<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']{40,}["']/i.test(index) &&
      !/<meta\b[^>]*content=["'][^"']{40,}["'][^>]*name=["']description["']/i.test(index)) {
    warnings.push('Homepage meta description is missing or unusually short.');
  }
  if (!/application\/ld\+json/i.test(index)) warnings.push('Homepage has no JSON-LD structured data.');
}

for (const required of ['404.html', 'robots.txt', 'site.webmanifest']) {
  if (!await exists(path.join(target, required))) errors.push(`Missing production file: ${required}`);
}

console.log('\nPortfolio production QA');
console.log('-----------------------');
console.log(`Target: ${path.relative(scriptRoot, target) || '.'}`);
console.log(`HTML: ${metrics.html} | JS: ${metrics.js} | CSS: ${metrics.css} | JSON/manifest: ${metrics.json}`);
console.log(`Local references checked: ${metrics.localRefs} | Fragment anchors checked: ${metrics.anchors}`);

if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  for (const warning of warnings) console.log(`  - ${warning}`);
}

if (errors.length) {
  console.error(`\nFAIL (${errors.length} errors):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log('\nPASS — no blocking production-integrity errors found.');
