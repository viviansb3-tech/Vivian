(() => {
  const USER = 'viviansb3-tech';
  const CACHE_KEY = 'vivian_github_proof_v3';
  const CACHE_MS = 15 * 60 * 1000;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const escapeHTML = (value = '') => String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  const safeURL = value => /^https:\/\//i.test(String(value || '')) ? String(value) : '#';

  const catalog = {
    'tutoring-2.0': {
      order: 1,
      category: 'software web case',
      label: 'PRIMARY CODE PROOF',
      copy: 'Full-stack tutoring platform with role dashboards, SQLite-backed registration, booking, assessment/progress workflows, messaging, audit/notification features and email setup.',
      caseStudy: 'projects/tutoring-platform.html',
      docs: 'https://github.com/viviansb3-tech/tutoring-2.0/blob/main/README.md'
    },
    'Ridgefield': {
      order: 2,
      category: 'web case',
      label: 'WEBSITE BUILD',
      copy: 'Public front-end repository supporting the Ridgefield school website reconstruction and education-content build.',
      caseStudy: 'projects/ridgefield-website.html'
    },
    'services': {
      order: 3,
      category: 'web',
      label: 'WEB DEVELOPMENT',
      copy: 'Public webpages-development repository containing HTML/CSS/JavaScript structure and web assets.'
    },
    'vivians-tutoring-service': {
      order: 4,
      category: 'software web case',
      label: 'EARLIER TUTORING BUILD',
      copy: 'Earlier public tutoring-service codebase retained as development evidence and iteration history.',
      caseStudy: 'projects/tutoring-platform.html'
    },
    'Vivian': {
      order: 5,
      category: 'placeholder',
      label: 'REPOSITORY SHELL',
      copy: 'Public repository shell. It is intentionally not presented as completed project evidence.'
    }
  };

  const fallbackRepos = [
    {name:'tutoring-2.0', html_url:'https://github.com/viviansb3-tech/tutoring-2.0', language:'HTML', size:1, stargazers_count:0, forks_count:0, updated_at:null},
    {name:'Ridgefield', html_url:'https://github.com/viviansb3-tech/Ridgefield', language:'HTML', size:1, stargazers_count:0, forks_count:0, updated_at:null},
    {name:'services', html_url:'https://github.com/viviansb3-tech/services', language:'HTML', size:1, stargazers_count:0, forks_count:0, updated_at:null},
    {name:'vivians-tutoring-service', html_url:'https://github.com/viviansb3-tech/vivians-tutoring-service', language:'JavaScript', size:1, stargazers_count:0, forks_count:0, updated_at:null},
    {name:'Vivian', html_url:'https://github.com/viviansb3-tech/Vivian', language:null, size:0, stargazers_count:0, forks_count:0, updated_at:null}
  ];

  const status = $('#ghstatus');
  const stats = $('#stats');
  const repos = $('#repos');
  const sync = $('#phase47-sync');
  const count = $('#phase47-verified-count');
  const empty = $('#phase47-empty');
  const search = $('#phase47-repo-search');
  if (!status || !stats || !repos) return;

  let currentRepos = [];
  let activeFilter = 'all';

  function dateLabel(value) {
    if (!value) return 'static snapshot';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return ': ';
    return new Intl.DateTimeFormat('en-ZA', {year:'numeric', month:'short', day:'2-digit'}).format(d);
  }

  function renderStats(user, items, mode) {
    const sourceBacked = items.filter(x => Number(x.size || 0) > 0).length;
    const mapped = items.filter(x => catalog[x.name]?.caseStudy).length;
    const repoCount = Number(user?.public_repos ?? items.length);
    stats.innerHTML = [
      ['PUBLIC REPOS', repoCount],
      ['SOURCE-BACKED', sourceBacked],
      ['CASE-MAPPED', mapped],
      ['SYNC MODE', mode.toUpperCase()]
    ].map(([label, value]) => `<div><b>${escapeHTML(value)}</b><small>${label}</small></div>`).join('');
    if (count) count.textContent = String(repoCount);
  }

  function renderRepos(items) {
    const known = items.filter(x => catalog[x.name]).sort((a,b) => (catalog[a.name]?.order || 99) - (catalog[b.name]?.order || 99));
    const extras = items.filter(x => !catalog[x.name]).sort((a,b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
    currentRepos = [...known, ...extras];
    repos.innerHTML = currentRepos.map(item => {
      const c = catalog[item.name] || {category:'source', label:'PUBLIC REPOSITORY', copy:item.description || 'Public GitHub repository.'};
      const isEmpty = Number(item.size || 0) === 0;
      const category = `${c.category || 'source'} ${isEmpty ? 'placeholder' : 'source'}`.trim();
      const source = safeURL(item.html_url || `https://github.com/${USER}/${encodeURIComponent(item.name)}`);
      const docs = c.docs ? `<a href="${c.docs}" target="_blank" rel="noreferrer">README</a>` : '';
      const caseLink = c.caseStudy ? `<a class="primary" href="${c.caseStudy}">CASE STUDY →</a>` : '';
      return `<article class="repo phase47-repo-card" data-category="${escapeHTML(category)}" data-search="${escapeHTML(`${item.name} ${c.copy} ${item.language || ''} ${category}`.toLowerCase())}">
        <div class="phase47-repo-top">
          <a href="${source}" target="_blank" rel="noreferrer">${escapeHTML(item.name)}</a>
          <div class="phase47-badges">
            <span class="phase47-badge ${isEmpty ? 'placeholder' : 'source'}">${isEmpty ? 'PLACEHOLDER' : 'PUBLIC SOURCE'}</span>
            ${c.caseStudy ? '<span class="phase47-badge case">CASE MAPPED</span>' : ''}
          </div>
        </div>
        <small>${escapeHTML(c.label)}</small>
        <p>${escapeHTML(c.copy || item.description || 'Public repository.')}</p>
        <div class="phase47-repo-meta">
          <span><b>LANGUAGE</b>${escapeHTML(item.language || ': ')}</span>
          <span><b>UPDATED</b>${escapeHTML(dateLabel(item.updated_at))}</span>
          <span><b>STATUS</b>${isEmpty ? 'shell only' : 'source present'}</span>
        </div>
        <div class="phase47-repo-actions"><a href="${source}" target="_blank" rel="noreferrer">VIEW SOURCE</a>${docs}${caseLink}</div>
      </article>`;
    }).join('');
    applyFilter();
  }

  function applyFilter() {
    const term = (search?.value || '').trim().toLowerCase();
    let visible = 0;
    $$('.phase47-repo-card', repos).forEach(card => {
      const filterMatch = activeFilter === 'all' || (card.dataset.category || '').split(/\s+/).includes(activeFilter);
      const searchMatch = !term || (card.dataset.search || '').includes(term);
      const show = filterMatch && searchMatch;
      card.classList.toggle('is-hidden', !show);
      if (show) visible += 1;
    });
    empty?.classList.toggle('show', visible === 0);
  }

  $$('.phase47-filter').forEach(btn => btn.addEventListener('click', () => {
    activeFilter = btn.dataset.filter || 'all';
    $$('.phase47-filter').forEach(x => {
      const selected = x === btn;
      x.classList.toggle('active', selected);
      x.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
    applyFilter();
  }));
  search?.addEventListener('input', applyFilter);

  async function fetchGithub() {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.ts < CACHE_MS) {
        renderStats(cached.user, cached.repos, 'cached');
        renderRepos(cached.repos);
        status.textContent = `Verified public footprint · ${cached.user.public_repos ?? cached.repos.length} repositories · cached live data`;
        if (sync) sync.textContent = `GitHub snapshot cached ${dateLabel(cached.ts)} · public metadata only`;
        return;
      }
      const [userResponse, repoResponse] = await Promise.all([
        fetch(`https://api.github.com/users/${USER}`, {headers:{Accept:'application/vnd.github+json'}}),
        fetch(`https://api.github.com/users/${USER}/repos?sort=updated&per_page=100`, {headers:{Accept:'application/vnd.github+json'}})
      ]);
      if (!userResponse.ok || !repoResponse.ok) throw new Error('GitHub API unavailable');
      const user = await userResponse.json();
      const repoItems = await repoResponse.json();
      if (!Array.isArray(repoItems)) throw new Error('Invalid repository response');
      localStorage.setItem(CACHE_KEY, JSON.stringify({ts:Date.now(), user, repos:repoItems}));
      renderStats(user, repoItems, 'live');
      renderRepos(repoItems);
      status.textContent = `Verified public footprint · ${user.public_repos ?? repoItems.length} repositories · live GitHub metadata`;
      if (sync) sync.textContent = `Live GitHub metadata refreshed ${dateLabel(Date.now())} · public metadata only`;
    } catch (err) {
      const user = {public_repos: fallbackRepos.length};
      renderStats(user, fallbackRepos, 'fallback');
      renderRepos(fallbackRepos);
      status.textContent = 'Static verified fallback · live GitHub metadata unavailable';
      if (sync) sync.textContent = 'Fallback snapshot verified 17 Aug 2026 · live values refresh when GitHub is reachable';
    }
  }

  renderStats({public_repos:fallbackRepos.length}, fallbackRepos, 'loading');
  renderRepos(fallbackRepos);
  const githubSection = document.getElementById('github');
  if ('IntersectionObserver' in window && githubSection) {
    const io = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      io.disconnect(); fetchGithub();
    }, {rootMargin:'700px 0px'});
    io.observe(githubSection);
  } else if ('requestIdleCallback' in window) requestIdleCallback(fetchGithub, {timeout:3000});
  else setTimeout(fetchGithub, 1200);
})();
