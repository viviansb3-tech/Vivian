(() => {
  const root = document.getElementById('career-lens');
  if (!root) return;

  const roles = {
    'data-scientist': {
      label: 'DATA SCIENTIST',
      title: 'Evidence-first data science.',
      summary: 'A portfolio lens centred on exploratory analysis, modelling, multivariate methods, time-series work and communicating defensible results with code.',
      skills: ['R + Python', 'EDA', 'PCA / CCA', 'Time Series', 'Visualisation'],
      proofs: [
        'Worked across multivariate, time-series, spatial and survey-analysis workflows.',
        'Built evidence-aware case studies that distinguish verified findings from values requiring original output.',
        'Uses statistical computing and visual communication to move from raw data to interpretable conclusions.'
      ],
      projects: [
        ['PCA / Dimensionality Reduction', '23-variable multivariate workflow', 'projects/pca.html'],
        ['Time-Series Forecasting', 'Forecasting logic, diagnostics and model evaluation', 'projects/time-series-forecasting.html'],
        ['EDA + Data Workflows', 'Descriptive statistics, transformations and visual exploration', 'projects/eda-data-analysis.html']
      ],
      match: ['pca.html','canonical-correlation.html','time-series-forecasting.html','financial-volatility.html','eda-data-analysis.html','regression-modelling.html','cointegration-bitcoin.html']
    },
    statistician: {
      label: 'STATISTICIAN',
      title: 'Inference, dependence and statistical structure.',
      summary: 'A technical lens highlighting multivariate analysis, statistical process monitoring, simulation, survey statistics and model interpretation.',
      skills: ['Multivariate Methods', 'Simulation', 'Hotelling T²', 'Sampling', 'Inference'],
      proofs: [
        'Hotelling’s T² simulation design spans n = 1, 3, 5; ρ = 0, 0.3, 0.7; and mean shifts 0, 0.5, 1, 1.5.',
        'Canonical correlation work uses 2,571 observations across 7 computer-fear and 8 statistics-fear items.',
        'Factor-analysis work uses 2,800 observations and 25 measured items.'
      ],
      projects: [
        ['Hotelling’s T² Simulation', 'Multivariate monitoring under dependence', 'projects/hotelling-simulation.html'],
        ['Canonical Correlation', 'Relationship between two multivariate variable sets', 'projects/canonical-correlation.html'],
        ['Big Five Factor Analysis', 'Latent structure across 2,800 observations', 'projects/factor-analysis.html']
      ],
      match: ['hotelling-t2.html','hotelling-simulation.html','canonical-correlation.html','factor-analysis.html','pca.html','sampling-survey-analysis.html','regression-modelling.html']
    },
    researcher: {
      label: 'RESEARCHER',
      title: 'Question → method → evidence → interpretation.',
      summary: 'A research-facing lens for academic supervisors and collaborators, foregrounding methodology, reproducible reasoning, evidence integrity and cross-domain quantitative work.',
      skills: ['Research Design', 'Statistical Computing', 'Spatial Statistics', 'Methodology', 'Evidence Integrity'],
      proofs: [
        'Portfolio case studies explicitly separate documented numerical results from values not present in the original outputs.',
        'Bloemfontein schools analysis combines point-pattern methods, GIS thinking and accessibility interpretation across 125 schools.',
        'Research work connects multivariate analysis, process monitoring, spatial statistics and time-series methods.'
      ],
      projects: [
        ['Bloemfontein Schools', '125-school spatial-statistics investigation', 'projects/bloemfontein-schools.html'],
        ['Hotelling’s T² Research', 'Multivariate process-monitoring framework', 'projects/hotelling-t2.html'],
        ['Canonical Correlation', 'Multivariate research on computer/statistics anxiety', 'projects/canonical-correlation.html']
      ],
      match: ['bloemfontein-schools.html','hotelling-t2.html','hotelling-simulation.html','canonical-correlation.html','factor-analysis.html','spatial-analysis.html','cointegration-bitcoin.html']
    },
    developer: {
      label: 'SOFTWARE DEVELOPER',
      title: 'Build useful systems around real workflows.',
      summary: 'A software lens highlighting application architecture, front-end interaction, role-based experiences, real-time concepts and the translation of practical requirements into usable interfaces.',
      skills: ['JavaScript', 'React', 'Flask', 'Node.js', 'SQL'],
      proofs: [
        'Designed a role-based tutoring platform spanning student, tutor and administrator experiences.',
        'Specified booking, grading, progress tracking, messaging and real-time Need Help / Raise Hand workflows.',
        'This portfolio itself combines responsive UI, accessibility, search, filtering and interactive research visualisation.'
      ],
      projects: [
        ['Tutoring Platform', 'Role-based classroom and assistance workflow', 'projects/tutoring-platform.html'],
        ['EDA + Data Workflows', 'Programming-led analytical workflow', 'projects/eda-data-analysis.html'],
        ['Time-Series Forecasting', 'Statistical computing applied to modelling', 'projects/time-series-forecasting.html']
      ],
      match: ['tutoring-platform.html','eda-data-analysis.html','time-series-forecasting.html','financial-volatility.html']
    },
    educator: {
      label: 'TUTOR / EDUCATOR',
      title: 'Technical depth, explained clearly.',
      summary: 'An education lens centred on tutoring, quantitative communication and the ability to turn difficult statistical, mathematical and scientific ideas into understandable learning experiences.',
      skills: ['Tutoring', 'Mathematics', 'Statistics', 'Biology', 'Communication'],
      proofs: [
        'Tutoring experience spans Mathematics, Biology, Computer Science and Statistics contexts.',
        'Designed a tutoring platform around private dashboards, progress tracking, grading, booking and communication.',
        'Project case studies demonstrate a consistent emphasis on explaining methods and interpreting results rather than presenting numbers alone.'
      ],
      projects: [
        ['Tutoring Platform', 'Education technology built around learner support', 'projects/tutoring-platform.html'],
        ['PCA', 'Clear explanation of dimensionality reduction and scores', 'projects/pca.html'],
        ['EDA + Data Workflows', 'Teaching-friendly descriptive and visual analysis', 'projects/eda-data-analysis.html']
      ],
      match: ['tutoring-platform.html','pca.html','eda-data-analysis.html','sampling-survey-analysis.html']
    }
  };

  const buttons = [...root.querySelectorAll('.phase45-role')];
  const els = {
    title: root.querySelector('#phase45-role-title'),
    summary: root.querySelector('#phase45-role-summary'),
    skills: root.querySelector('#phase45-role-skills'),
    proofs: root.querySelector('#phase45-role-proofs'),
    projects: root.querySelector('#phase45-featured')
  };
  const banner = document.getElementById('phase45-mode-banner');
  let bannerTimer;

  function projectAnchors() {
    return [...document.querySelectorAll('.phase28-project, .phase37-archive-card, .phase29-launch-card, .phase31-matrix-item')];
  }

  function applyHighlights(match) {
    projectAnchors().forEach(a => {
      const href = a.getAttribute('href') || '';
      const isMatch = match.some(name => href.endsWith(name));
      a.classList.toggle('phase45-role-highlight', isMatch);
      a.classList.toggle('phase45-role-soft', !isMatch);
    });
  }

  function render(key, announce = false) {
    const role = roles[key] || roles['data-scientist'];
    buttons.forEach(btn => btn.setAttribute('aria-selected', String(btn.dataset.role === key)));
    els.title.textContent = role.title;
    els.summary.textContent = role.summary;
    els.skills.innerHTML = role.skills.map(x => `<span>${x}</span>`).join('');
    els.proofs.innerHTML = role.proofs.map(x => `<li>${x}</li>`).join('');
    els.projects.innerHTML = role.projects.map((p, i) => `<a href="${p[2]}"><small>0${i + 1} / FEATURED</small><strong>${p[0]}</strong><span>${p[1]}</span><b>OPEN →</b></a>`).join('');
    document.documentElement.dataset.careerLens = key;
    applyHighlights(role.match);
    try { localStorage.setItem('vivian-career-lens', key); } catch (_) {}
    const url = new URL(window.location.href);
    url.searchParams.set('view', key);
    history.replaceState(null, '', url);
    if (announce && banner) {
      banner.querySelector('span').textContent = `${role.label} VIEW ACTIVE`;
      banner.classList.add('is-visible');
      clearTimeout(bannerTimer);
      bannerTimer = setTimeout(() => banner.classList.remove('is-visible'), 2200);
    }
  }

  buttons.forEach(btn => btn.addEventListener('click', () => render(btn.dataset.role, true)));
  root.addEventListener('keydown', e => {
    if (!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key)) return;
    const current = buttons.findIndex(b => b.getAttribute('aria-selected') === 'true');
    const delta = ['ArrowRight','ArrowDown'].includes(e.key) ? 1 : -1;
    const next = (current + delta + buttons.length) % buttons.length;
    e.preventDefault();
    buttons[next].focus();
    render(buttons[next].dataset.role, true);
  });

  const query = new URLSearchParams(location.search).get('view');
  let stored = '';
  try { stored = localStorage.getItem('vivian-career-lens') || ''; } catch (_) {}
  const initial = roles[query] ? query : (roles[stored] ? stored : 'data-scientist');
  render(initial, false);
})();
