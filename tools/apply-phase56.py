from bs4 import BeautifulSoup
from pathlib import Path

root = Path('/mnt/data/phase56')
index = root/'index.html'
soup = BeautifulSoup(index.read_text(errors='ignore'), 'html.parser')

# ---- Main navigation: simplify the first-read path ----
nav = soup.find('nav', id='nav')
if nav:
    links = nav.find('div', class_='links')
    if links:
        links.clear()
        for label, href in [
            ('About', '#about'),
            ('Work', '#featured-work'),
            ('Research', '#research-intelligence'),
            ('Code', '#github'),
            ('CV', '#cv'),
            ('Contact', '#contact'),
        ]:
            a = soup.new_tag('a', href=href)
            a.string = label
            links.append(a)

# ---- Hero CTA cleanup ----
hero = soup.find('section', id='home')
if hero:
    actions = hero.select_one('.actions')
    if actions:
        actions.clear()
        ctas = [
            ('Explore featured work', '#featured-work', 'btn primary'),
            ('View CV', 'assets/vivian-sibanda-cv.pdf', 'btn'),
            ('Start a conversation', '#contact', 'btn'),
        ]
        for text, href, cls in ctas:
            a=soup.new_tag('a', href=href)
            a['class']=cls.split()
            a.string=text
            actions.append(a)
    copy = hero.select_one('.copy')
    if copy and not copy.select_one('.p56-hero-proof'):
        proof = BeautifulSoup('''<div class="p56-hero-proof" aria-label="Portfolio summary">
          <span><b>16</b><small>CASE STUDIES</small></span>
          <span><b>6</b><small>REPORT-INTEGRATED ACADEMIC WORKSTREAMS</small></span>
          <span><b>R · PY · SQL · JS</b><small>ANALYSIS + BUILD STACK</small></span>
        </div>''','html.parser').div
        sym = copy.select_one('.symbols')
        if sym:
            sym.insert_before(proof)
        else:
            copy.append(proof)

# ---- Featured work: strong first content after Philosophy ----
philosophy = soup.find('section', id='philosophy')
if philosophy and not soup.find(id='featured-work'):
    frag = BeautifulSoup('''
<section class="p56-featured section" id="featured-work" aria-labelledby="p56-featured-title">
  <div class="p56-featured-head">
    <div>
      <small class="kicker">SELECTED / HIGH-SIGNAL WORK</small>
      <h2 class="display" id="p56-featured-title">START WITH<br><i>THE PROOF.</i></h2>
    </div>
    <div class="p56-featured-copy">
      <p>Four projects that best represent the portfolio across statistical research, financial modelling, spatial analysis and software engineering.</p>
      <a class="btn" href="#work">Browse all selected work</a>
    </div>
  </div>
  <div class="p56-featured-grid">
    <a class="p56-feature-card p56-feature-card--hero glass" href="projects/netcare-ppc-cointegration-garch.html">
      <span>01 / FINANCIAL ECONOMETRICS</span>
      <h3>Netcare + PPC<br>Cointegration &amp; Volatility</h3>
      <p>Engle–Granger, Johansen, ECM, ARIMA and GJR-GARCH brought together in one report-backed time-series case.</p>
      <div class="p56-card-evidence"><b>p = .0004</b><b>Trace = 36.55</b><b>GJR-GARCH</b></div>
      <em>OPEN CASE STUDY →</em>
    </a>
    <a class="p56-feature-card glass" href="projects/hotelling-t2.html">
      <span>02 / HONOURS RESEARCH</span>
      <h3>Hotelling's T²</h3>
      <p>Dependence, simulation design and multivariate process monitoring.</p>
      <div class="p56-card-evidence"><b>n = 1, 3, 5</b><b>ρ = 0, .3, .7</b></div>
      <em>OPEN RESEARCH →</em>
    </a>
    <a class="p56-feature-card glass" href="projects/bloemfontein-schools.html">
      <span>03 / SPATIAL STATISTICS</span>
      <h3>Bloemfontein Schools</h3>
      <p>Clustering, directional structure and accessibility across 125 school locations.</p>
      <div class="p56-card-evidence"><b>125 SCHOOLS</b><b>142.99°</b></div>
      <em>OPEN SPATIAL CASE →</em>
    </a>
    <a class="p56-feature-card glass" href="projects/tutoring-platform.html">
      <span>04 / SOFTWARE</span>
      <h3>Tutoring Platform</h3>
      <p>Role-based education software connecting registration, booking, progress, messaging and administration.</p>
      <div class="p56-card-evidence"><b>NODE.JS</b><b>SQLITE</b><b>ROLE ACCESS</b></div>
      <em>OPEN BUILD CASE →</em>
    </a>
  </div>
  <div class="p56-deep-entry glass">
    <div><small>DEEP PORTFOLIO MODE</small><strong>Need the full research system?</strong><p>Open the role lens, matrices, dossier, evidence lab, visualisation studio and methodology layers.</p></div>
    <button class="btn p56-deep-toggle" type="button" aria-expanded="false" aria-controls="p56-deep-sections">OPEN DEEP EXPLORER</button>
  </div>
</section>
''','html.parser').section
    philosophy.insert_after(frag)

# ---- Reduce homepage repetition by collapsing legacy/deep tools by default ----
secondary_ids = {
    'career-lens','application-mode','accessibility-preferences','research-directory',
    'work-archive','project-launchpad','system-map','research-matrix','research-dossier',
    'honours-research','journey','stack','research','lab','evidence','phase41-evidence',
    'phase42-visualisations','phase44-results','capabilities','workflow','case-studies'
}
for sec in soup.find_all('section'):
    sid = sec.get('id')
    if sid in secondary_ids:
        classes = list(sec.get('class') or [])
        if 'p56-secondary' not in classes:
            classes.append('p56-secondary')
        sec['class'] = classes
        sec['data-p56-secondary'] = 'true'

# The phase55 report-integrated proof section has no id; make it deep secondary because
# the new featured section carries the proof at a higher hierarchy.
for sec in soup.find_all('section'):
    classes = sec.get('class') or []
    if 'phase55-work-proof' in classes:
        classes = list(classes)
        if 'p56-secondary' not in classes: classes.append('p56-secondary')
        sec['class']=classes
        sec['data-p56-secondary']='true'

# Education + tutoring anonymous section is duplicate support content.
for sec in soup.find_all('section'):
    if not sec.get('id'):
        text = sec.get_text(' ', strip=True).upper()
        if text.startswith('EDUCATION + TUTORING'):
            cls=list(sec.get('class') or [])
            if 'p56-secondary' not in cls: cls.append('p56-secondary')
            sec['class']=cls; sec['data-p56-secondary']='true'

# Add an ID to the primary 'work' section for clarity in analytics / nav.
work = soup.find('section', id='work')
if work:
    work['data-p56-primary']='true'
for sid in ['home','philosophy','featured-work','research-intelligence','about','work','github','cv','contact']:
    sec=soup.find('section', id=sid)
    if sec: sec['data-p56-primary']='true'

# ---- Add design layer marker and script hook ----
body=soup.body
if body:
    body['data-portfolio-release']='56'

index.write_text(str(soup), encoding='utf-8')

# ---- Add phase 56 CSS to existing homepage bundle ----
css = root/'portfolio.min.css'
phase_css = r'''
/* === PHASE 56 / EXECUTIVE PORTFOLIO REFRESH === */
body[data-portfolio-release="56"]{--p56-radius:30px;--p56-soft:rgba(255,255,255,.045);}
body[data-portfolio-release="56"] .section{padding-top:clamp(84px,9vw,126px);padding-bottom:clamp(72px,8vw,110px)}
body[data-portfolio-release="56"] .hero{min-height:94svh;padding-top:132px}
body[data-portfolio-release="56"] .hero .copy>p{font-size:clamp(16px,1.45vw,19px);max-width:620px}
body[data-portfolio-release="56"] .hero .actions{margin-top:24px}
.p56-hero-proof{display:grid;grid-template-columns:.8fr 1.55fr 1.2fr;gap:8px;max-width:680px;margin-top:30px}
.p56-hero-proof span{min-height:78px;padding:14px 15px;border:1px solid var(--line);border-radius:18px;background:rgba(255,255,255,.035);display:flex;flex-direction:column;justify-content:space-between}
.p56-hero-proof b{font:700 15px/1.2 'Space Grotesk',system-ui,sans-serif;color:var(--text);letter-spacing:-.02em}
.p56-hero-proof small{font-size:8px;line-height:1.35;color:var(--muted)}
.p56-featured{max-width:1240px}
.p56-featured-head{display:grid;grid-template-columns:1.1fr .9fr;gap:56px;align-items:end;margin-bottom:44px}
.p56-featured-head .kicker{margin-bottom:24px}.p56-featured-copy{max-width:510px;justify-self:end}.p56-featured-copy p{color:var(--muted);line-height:1.8;margin:0 0 22px}
.p56-featured-grid{display:grid;grid-template-columns:1.3fr .7fr;grid-template-rows:repeat(3,minmax(190px,auto));gap:14px}
.p56-feature-card{position:relative;overflow:hidden;padding:28px;border-radius:var(--p56-radius);text-decoration:none;color:var(--text);min-height:220px;display:flex;flex-direction:column;justify-content:flex-end;transition:transform .24s ease,border-color .24s ease,background .24s ease}
.p56-feature-card:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 85% 15%,rgba(77,163,255,.13),transparent 35%);pointer-events:none}
.p56-feature-card:hover{transform:translateY(-3px);border-color:rgba(116,231,255,.34)}
.p56-feature-card--hero{grid-row:1/4;min-height:640px;padding:36px;background:radial-gradient(circle at 75% 20%,rgba(77,163,255,.16),transparent 33%),rgba(255,255,255,.055)}
.p56-feature-card>span{position:absolute;top:26px;left:28px;font:600 9px/1.3 'IBM Plex Mono',monospace;letter-spacing:.14em;color:var(--blue)}
.p56-feature-card h3{position:relative;margin:0 0 14px;font:650 clamp(28px,3.2vw,52px)/.96 'Space Grotesk',system-ui,sans-serif;letter-spacing:-.055em}
.p56-feature-card:not(.p56-feature-card--hero) h3{font-size:clamp(24px,2.4vw,34px)}
.p56-feature-card p{position:relative;color:var(--muted);line-height:1.68;max-width:640px;margin:0 0 20px;font-size:12px}
.p56-feature-card em{position:relative;color:#9ecfff;font:700 9px 'IBM Plex Mono',monospace;font-style:normal;letter-spacing:.08em;margin-top:8px}
.p56-card-evidence{position:relative;display:flex;flex-wrap:wrap;gap:7px;margin-top:2px}.p56-card-evidence b{font:600 9px 'IBM Plex Mono',monospace;padding:7px 9px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.04)}
.p56-deep-entry{margin-top:14px;border-radius:24px;padding:22px 24px;display:flex;align-items:center;justify-content:space-between;gap:28px}
.p56-deep-entry>div{max-width:760px}.p56-deep-entry small{color:var(--blue)}.p56-deep-entry strong{display:block;font:600 24px 'Space Grotesk',system-ui,sans-serif;margin:6px 0}.p56-deep-entry p{margin:0;color:var(--muted);font-size:12px;line-height:1.6}
.p56-secondary{display:none!important}.p56-show-deep .p56-secondary{display:block!important}.p56-show-deep .p56-deep-entry{border-color:rgba(116,231,255,.28)}
.p56-show-deep .p56-deep-toggle{background:rgba(77,163,255,.12);border-color:rgba(77,163,255,.3)}
/* Give the primary path stronger visual separation. */
[data-p56-primary="true"]{scroll-margin-top:96px}
[data-p56-primary="true"]+.p56-secondary{margin-top:0}
/* Cleaner section labels on the primary path. */
body[data-portfolio-release="56"] [data-p56-primary="true"]>.kicker{color:var(--blue)}
/* Light-mode polish */
html[data-theme="light"] .p56-hero-proof span,html[data-theme="light"] .p56-feature-card,html[data-theme="light"] .p56-deep-entry{background:rgba(255,255,255,.78)!important;border-color:var(--theme-border)!important;box-shadow:0 18px 55px rgba(28,45,70,.07)}
html[data-theme="light"] .p56-feature-card--hero{background:radial-gradient(circle at 75% 20%,rgba(23,105,210,.11),transparent 35%),rgba(255,255,255,.86)!important}
html[data-theme="light"] .p56-feature-card h3,html[data-theme="light"] .p56-hero-proof b,html[data-theme="light"] .p56-deep-entry strong{color:var(--theme-text)!important}
html[data-theme="light"] .p56-feature-card p,html[data-theme="light"] .p56-featured-copy p,html[data-theme="light"] .p56-deep-entry p{color:var(--theme-muted)!important}
@media(max-width:900px){
  .p56-featured-head{grid-template-columns:1fr;gap:20px}.p56-featured-copy{justify-self:start}
  .p56-featured-grid{grid-template-columns:1fr;grid-template-rows:auto}.p56-feature-card--hero{grid-row:auto;min-height:460px}.p56-feature-card{min-height:250px}
  .p56-deep-entry{align-items:flex-start;flex-direction:column}.p56-deep-toggle{width:100%}
  .p56-hero-proof{grid-template-columns:1fr 1fr}.p56-hero-proof span:last-child{grid-column:1/-1}
}
@media(max-width:580px){
  body[data-portfolio-release="56"] .hero{padding-top:112px}
  .p56-hero-proof{grid-template-columns:1fr;margin-top:22px}.p56-hero-proof span:last-child{grid-column:auto}
  .p56-feature-card--hero{min-height:390px;padding:26px}.p56-feature-card{padding:24px;min-height:225px}.p56-feature-card>span{top:22px;left:24px}
  .p56-feature-card h3,.p56-feature-card:not(.p56-feature-card--hero) h3{font-size:clamp(27px,10vw,38px)}
}
@media(prefers-reduced-motion:reduce){.p56-feature-card{transition:none}.p56-feature-card:hover{transform:none}}
'''
text=css.read_text(errors='ignore')
if 'PHASE 56 / EXECUTIVE PORTFOLIO REFRESH' not in text:
    css.write_text(text+'\n'+phase_css, encoding='utf-8')

# ---- Add deep explorer behaviour to homepage bundle ----
js = root/'portfolio.js'
phase_js = r'''

/* === PHASE 56 / EXECUTIVE PORTFOLIO REFRESH === */
(() => {
  const body = document.body;
  const secondarySelector = '[data-p56-secondary="true"]';
  const toggles = Array.from(document.querySelectorAll('.p56-deep-toggle'));
  if (!body || !toggles.length) return;

  const setDeep = (open, {scroll=false} = {}) => {
    body.classList.toggle('p56-show-deep', open);
    toggles.forEach(btn => {
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'CLOSE DEEP EXPLORER' : 'OPEN DEEP EXPLORER';
    });
    try { sessionStorage.setItem('p56-deep-open', open ? '1' : '0'); } catch (_) {}
    if (scroll && open) {
      const first = document.querySelector(secondarySelector);
      if (first) requestAnimationFrame(() => first.scrollIntoView({behavior:'smooth', block:'start'}));
    }
  };

  toggles.forEach(btn => btn.addEventListener('click', () => setDeep(!body.classList.contains('p56-show-deep'), {scroll:false})));

  const revealForHash = () => {
    if (!location.hash) return;
    const target = document.querySelector(location.hash);
    if (target && target.matches(secondarySelector)) setDeep(true);
  };
  revealForHash();
  window.addEventListener('hashchange', revealForHash);

  // Links to hidden legacy/deep sections reveal the explorer first.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (target && target.matches(secondarySelector)) setDeep(true);
  });
})();
'''
text=js.read_text(errors='ignore')
if 'PHASE 56 / EXECUTIVE PORTFOLIO REFRESH' not in text:
    js.write_text(text+phase_js, encoding='utf-8')

# ---- Project page design refinement: use existing project-pages.css ----
pp = root/'project-pages.css'
project_css = r'''

/* === PHASE 56 / PROJECT READING SYSTEM === */
.project-detail-page{--p56-project-max:1160px}
.project-detail-page main,.project-detail-page>.project-evidence,.project-detail-page>.phase43-case,.project-detail-page>.phase44-results,.project-detail-page>.project-page-end{max-width:var(--p56-project-max);margin-left:auto;margin-right:auto}
.project-detail-page main{position:relative}
.project-detail-page main h1{max-width:1000px;text-wrap:balance}
.project-detail-page main p{max-width:900px}
.project-detail-page .project-evidence{border-radius:32px;overflow:hidden}
.project-detail-page .project-evidence__metrics{gap:10px}
.project-detail-page .project-evidence__metric,.project-detail-page .phase43-panel,.project-detail-page .phase44-result{transition:transform .2s ease,border-color .2s ease}
.project-detail-page .project-evidence__metric:hover,.project-detail-page .phase43-panel:hover,.project-detail-page .phase44-result:hover{transform:translateY(-2px);border-color:rgba(116,231,255,.28)}
.project-detail-page .project-page-end{margin-top:18px;margin-bottom:48px;border-radius:18px;padding:18px 20px;border:1px solid var(--project-line,rgba(255,255,255,.12));background:rgba(255,255,255,.035)}
.project-detail-page .project-nav__inner{max-width:var(--p56-project-max)}
html[data-theme="light"] .project-detail-page .project-page-end{background:rgba(255,255,255,.78);border-color:var(--theme-border)!important}
@media(max-width:760px){.project-detail-page .project-evidence{border-radius:24px}.project-detail-page .project-page-end{margin-left:16px;margin-right:16px}.project-detail-page .project-evidence__metric:hover,.project-detail-page .phase43-panel:hover,.project-detail-page .phase44-result:hover{transform:none}}
@media(prefers-reduced-motion:reduce){.project-detail-page .project-evidence__metric,.project-detail-page .phase43-panel,.project-detail-page .phase44-result{transition:none}}
'''
text=pp.read_text(errors='ignore')
if 'PHASE 56 / PROJECT READING SYSTEM' not in text:
    pp.write_text(text+project_css, encoding='utf-8')

# ---- Release metadata ----
import json
pkg_path=root/'package.json'
pkg=json.loads(pkg_path.read_text())
pkg['version']='56.0.0'
pkg['description']='Executive portfolio refresh with a streamlined homepage hierarchy, high-signal featured work, collapsible deep research tools, and unified project reading polish.'
pkg_path.write_text(json.dumps(pkg, indent=2)+'\n')

# Update release identity tools to P56 / Phase 56.
for rel in ['tools/release-manifest.mjs','tools/qa-release.mjs','tools/qa-mobile.mjs','tools/preflight.mjs']:
    path=root/rel
    t=path.read_text(errors='ignore')
    t=t.replace('P55-', 'P56-').replace('Phase 55', 'Phase 56')
    path.write_text(t)

# Notes
(root/'PHASE_56_NOTES.md').write_text('''# Phase 56 — Executive Portfolio Refresh\n\n- Streamlined the homepage into a high-signal first-read path.\n- Added a new Featured Work section prioritising four representative projects.\n- Moved legacy/research-system modules behind an accessible Deep Explorer toggle instead of deleting them.\n- Simplified the primary navigation to About, Work, Research, Code, CV and Contact.\n- Added concise verified portfolio proof in the hero.\n- Added a shared project-reading polish layer across all case studies.\n- Preserved Phase 55 report-backed numerical evidence and Phase 54 mobile/theme stability.\n''')
