(() => {
  const root = document.getElementById('application-mode');
  if (!root) return;

  const profiles = {
    'data-scientist': {
      label:'DATA SCIENTIST',
      headline:'Statistical depth with an applied data mindset.',
      why:'Vivian combines statistical computing, exploratory analysis and model interpretation with a portfolio that makes methods, evidence and limitations visible. The strongest fit is work that needs rigorous analysis without losing sight of clear communication.',
      signals:[['R + Python','Statistical computing'],['MULTIVARIATE','PCA · CCA · FA'],['TIME SERIES','Forecasting · volatility']],
      matrix:[['ANALYSIS','PRIMARY','EDA, modelling and interpretation'],['CODING','STRONG','R, Python, SQL and web workflows'],['RESEARCH','PRIMARY','Method-first evidence discipline'],['COMMUNICATION','STRONG','Case studies and tutoring experience']],
      projects:[['PCA / Dimensionality Reduction','23-variable multivariate workflow','projects/pca.html'],['Time-Series Forecasting','Diagnostics, forecasting and model evaluation','projects/time-series-forecasting.html'],['EDA + Data Workflows','From descriptive analysis to interpretable evidence','projects/eda-data-analysis.html']]
    },
    statistician: {
      label:'STATISTICIAN',
      headline:'Inference, structure and dependence are the centre of the work.',
      why:'Vivian’s statistical work spans multivariate methods, process monitoring, sampling, simulation and model interpretation. The portfolio is strongest where statistical assumptions, dependence structures and defensible conclusions matter as much as the final output.',
      signals:[['T²','Process monitoring'],['2,571','CCA observations'],['2,800','Factor-analysis observations']],
      matrix:[['INFERENCE','PRIMARY','Multivariate and model-based reasoning'],['SIMULATION','PRIMARY','Dependence and mean-shift scenarios'],['CODING','STRONG','R-led statistical workflows'],['COMMUNICATION','SUPPORTING','Interpretation alongside computation']],
      projects:[['Hotelling’s T² Simulation','Monitoring performance under dependence','projects/hotelling-simulation.html'],['Canonical Correlation','7 × 8 multivariate relationship study','projects/canonical-correlation.html'],['Big Five Factor Analysis','Latent structure across 25 measured items','projects/factor-analysis.html']]
    },
    researcher: {
      label:'RESEARCHER',
      headline:'Research questions translated into transparent quantitative evidence.',
      why:'Vivian works across statistical, spatial and computational research problems with an explicit question → method → evidence → interpretation structure. The portfolio separates verified results from unavailable outputs, making the reasoning trail clear for academic review.',
      signals:[['125','Schools in spatial study'],['142.99°','Directional orientation'],['EVIDENCE','Integrity gate']],
      matrix:[['DESIGN','PRIMARY','Question, objective and method alignment'],['METHODS','PRIMARY','Multivariate, spatial and simulation'],['EVIDENCE','PRIMARY','Verified-result discipline'],['WRITING','SUPPORTING','Structured research communication']],
      projects:[['Bloemfontein Schools','Spatial-statistics and accessibility investigation','projects/bloemfontein-schools.html'],['Hotelling’s T² Research','Multivariate process-monitoring framework','projects/hotelling-t2.html'],['Canonical Correlation','Computer/statistics anxiety multivariate study','projects/canonical-correlation.html']]
    },
    developer: {
      label:'SOFTWARE DEVELOPER',
      headline:'Practical software built around real analytical and education workflows.',
      why:'Vivian brings a statistics-informed approach to software: understand the workflow, define user roles, structure the data and build clear interfaces around the problem. The tutoring platform and this portfolio demonstrate front-end interaction, application architecture and responsive design thinking.',
      signals:[['JAVASCRIPT','Interactive UI'],['FULL STACK','Flask · Node · SQL'],['REAL-TIME','Raise Hand workflow']],
      matrix:[['FRONT END','PRIMARY','Responsive interaction and accessibility'],['ARCHITECTURE','SUPPORTING','Role-based platform design'],['DATA','STRONG','SQL and analytical workflows'],['PRODUCT','STRONG','Requirements translated into usable systems']],
      projects:[['Tutoring Platform','Role-based classroom and assistance system','projects/tutoring-platform.html'],['EDA + Data Workflows','Code-driven analysis pipeline','projects/eda-data-analysis.html'],['Time-Series Forecasting','Statistical computing applied to modelling','projects/time-series-forecasting.html']]
    },
    educator: {
      label:'TUTOR / EDUCATOR',
      headline:'Quantitative depth with a strong explanation layer.',
      why:'Vivian’s tutoring and technical work share the same principle: difficult ideas should be made understandable without making them inaccurate. Mathematics, Statistics and Biology teaching experience is reinforced by project work designed to explain methods and evidence clearly.',
      signals:[['MATHS','Quantitative tutoring'],['STATS','Methods + interpretation'],['EDTECH','Learning platform design']],
      matrix:[['TEACHING','PRIMARY','Structured quantitative explanation'],['COMMUNICATION','PRIMARY','Learner-centred clarity'],['SUBJECT DEPTH','STRONG','Maths, Statistics and Biology'],['TECHNOLOGY','SUPPORTING','Digital learning workflow design']],
      projects:[['Tutoring Platform','Private dashboards, grading and learner support','projects/tutoring-platform.html'],['PCA','Dimensionality reduction explained clearly','projects/pca.html'],['EDA + Data Workflows','Visual, teaching-friendly analysis','projects/eda-data-analysis.html']]
    }
  };

  const els = {
    label:root.querySelector('#phase46-role-label'),
    headline:root.querySelector('#phase46-headline'),
    why:root.querySelector('#phase46-why-copy'),
    signals:root.querySelector('#phase46-signals'),
    matrix:root.querySelector('#phase46-matrix-list'),
    projects:root.querySelector('#phase46-projects'),
    brief:root.querySelector('#phase46-brief-link'),
    print:root.querySelector('#phase46-print-link'),
    copy:root.querySelector('#phase46-copy-link'),
    status:root.querySelector('#phase46-copy-status')
  };

  function currentKey(){
    const key = document.documentElement.dataset.careerLens;
    return profiles[key] ? key : 'data-scientist';
  }
  function render(){
    const key=currentKey(), p=profiles[key];
    els.label.textContent=`CURRENT LENS / ${p.label}`;
    els.headline.textContent=p.headline;
    els.why.textContent=p.why;
    els.signals.innerHTML=p.signals.map(s=>`<div class="phase46-signal"><b>${s[0]}</b><span>${s[1]}</span></div>`).join('');
    els.matrix.innerHTML=p.matrix.map(m=>`<div class="phase46-matrix-row"><span class="phase46-matrix-label">${m[0]}</span><span class="phase46-matrix-level">${m[1]} EMPHASIS</span><span class="phase46-matrix-copy">${m[2]}</span></div>`).join('');
    els.projects.innerHTML=p.projects.map((x,i)=>`<a class="phase46-project" href="${x[2]}"><small>0${i+1} / SHORTLIST</small><strong>${x[0]}</strong><span>${x[1]}</span><b>OPEN →</b></a>`).join('');
    els.brief.href=`application-brief.html?view=${encodeURIComponent(key)}`;
    els.print.href=`application-brief.html?view=${encodeURIComponent(key)}&print=1`;
  }

  els.copy?.addEventListener('click', async () => {
    const url=new URL(location.href); url.searchParams.set('view',currentKey()); url.hash='application-mode';
    try { await navigator.clipboard.writeText(url.toString()); els.status.textContent='ROLE-SPECIFIC PORTFOLIO LINK COPIED.'; }
    catch (_) { els.status.textContent='COPY BLOCKED — USE THE URL IN YOUR ADDRESS BAR.'; }
    setTimeout(()=>{els.status.textContent='';},2600);
  });

  const observer=new MutationObserver(mutations=>{
    if(mutations.some(m=>m.attributeName==='data-career-lens')) render();
  });
  observer.observe(document.documentElement,{attributes:true});
  render();
})();
