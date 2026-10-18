import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.resolve(root, process.argv[2] || 'dist');
const errors=[];
const warnings=[];
const read=rel=>readFile(path.join(target,rel),'utf8');

const rootHtml=(await readdir(target)).filter(x=>x.endsWith('.html'));
const projectHtml=(await readdir(path.join(target,'projects'))).filter(x=>x.endsWith('.html')).map(x=>'projects/'+x);
const pages=[...rootHtml,...projectHtml];
for(const rel of pages){
  const html=await read(rel);
  if(!/name=["']viewport["'][^>]*width=device-width/i.test(html) && !/width=device-width[^>]*name=["']viewport["']/i.test(html)) errors.push(`${rel}: missing responsive viewport meta.`);
  if(/user-scalable\s*=\s*no|maximum-scale\s*=\s*1/i.test(html)) errors.push(`${rel}: zoom is restricted.`);
  if(rel==='index.html' || rel==='projects.html'){
    if(!/landing\.css/.test(html)) errors.push(`${rel}: missing landing stylesheet.`);
  }else if(rel==='explorer.html'){
    const bundle=await read('portfolio.min.css');
    if(!/Phase 54 — mobile & cross-device reliability layer/.test(bundle)) errors.push('index.html: Phase 54 mobile layer is not bundled into portfolio.min.css.');
  }else{
    const expected=rel.startsWith('projects/')?'../mobile-reliability.css':'mobile-reliability.css';
    if(!html.includes(`href="${expected}"`) && !html.includes(`href='${expected}'`)) errors.push(`${rel}: mobile reliability stylesheet not linked.`);
  }
}
const css=await read('mobile-reliability.css');
for(const [label,re] of [
  ['safe-area support',/safe-area-inset/],
  ['dynamic viewport support',/100dvh/],
  ['coarse pointer rules',/pointer:coarse/],
  ['small-phone breakpoint',/max-width:430px/],
  ['landscape-phone breakpoint',/orientation:landscape/],
  ['touch research-map layout',/\.phase40-map[\s\S]*display:grid!important/]
]) if(!re.test(css)) errors.push(`mobile-reliability.css: missing ${label}.`);
const app=await read('portfolio.js');
for(const [label,re] of [
  ['body scroll lock',/mobile-nav-open/],
  ['Escape close',/e\.key==='Escape'/],
  ['outside-tap close',/pointerdown/],
  ['desktop resize reset',/innerWidth>900/]
]) if(!re.test(app)) errors.push(`portfolio.js: missing ${label}.`);
const projectJs=await read('project-pages.js');
if(!/themeMeta.*theme-color/s.test(projectJs)) errors.push('project-pages.js: browser theme color does not follow project theme.');

console.log('\nPhase 56 mobile reliability QA');
console.log('------------------------------');
console.log(`HTML pages inspected: ${pages.length}`);
for(const w of warnings) console.log(`WARN  ${w}`);
if(errors.length){for(const e of errors) console.error(`FAIL  ${e}`);process.exit(1);}
console.log('PASS — responsive viewport, safe-area, touch navigation, mobile research layout and project theme hooks are wired correctly.');
