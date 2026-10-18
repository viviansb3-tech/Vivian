const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const GH_CACHE = 'vivian_github_cache_v2';

// Reveal-on-scroll, with an immediate fallback for browsers without IntersectionObserver.
const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('on');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold: 0.12}) : null;
$$('.reveal').forEach(el => revealObserver ? revealObserver.observe(el) : el.classList.add('on'));

// Current-focus queue.
const explore = $('#explore');
['Statistical Computing','Data Science','Spatial Statistics','Machine Learning','Software Development','Educational Technology']
  .forEach((label, i) => {
    if (!explore) return;
    const el = document.createElement('div');
    el.textContent = label;
    el.style.animation = `fade .5s ${i * 80}ms forwards`;
    explore.appendChild(el);
  });

// Skill inspector.
const skillDescriptions = {
  Python:'Used for data analysis, automation, statistical computing and web development.',
  R:'Used for statistical analysis, modelling and research workflows.',
  PCA:'Used to reduce dimensionality and inspect multivariate structure.',
  "Hotelling's T²":'Used for multivariate process monitoring and control-chart analysis.',
  "Moran's I":'Used to investigate spatial autocorrelation.',
  React:'Used for component-based interactive web applications.',
  SQL:'Used for querying and working with structured data.',
  Excel:'Used for data handling, analysis, reporting and practical spreadsheet workflows.',
  'Google Earth Pro':'Used for geospatial visualisation, exploration and location-based analysis.'
};
const skillTitle = $('.skill strong');
const skillCopy = $('.skill p');
$$('.chips button').forEach(button => {
  const update = () => {
    if (!skillTitle || !skillCopy) return;
    skillTitle.textContent = button.textContent;
    skillCopy.textContent = skillDescriptions[button.textContent] || 'Capability detail can be expanded here as the portfolio evolves.';
  };
  button.addEventListener('mouseenter', update);
  button.addEventListener('focus', update);
});

// Research lab visual modules. All generated values are explicitly illustrative.
const labs = {
  pca: {
    title:'PCA EXPLORER', copy:'A principal-component interface for dimensionality reduction and multivariate structure. Values are illustrative UI, not claimed project results.', tags:['scree plot','components','variance'],
    view:()=>`<div class="chart-card"><div class="chart-label">ILLUSTRATIVE SCREE PROFILE</div><div class="bars"><i style="height:92%"></i><i style="height:68%"></i><i style="height:45%"></i><i style="height:28%"></i><i style="height:18%"></i></div><div class="mini-legend"><span><i></i>conceptual component strength</span></div></div>`
  },
  garch: {
    title:'ARIMA + GARCH', copy:'An illustrative financial time-series surface combining mean dynamics and conditional volatility. It is not the original Bitcoin result set.', tags:['ARIMA','GARCH','Bitcoin volatility'],
    view:()=>`<div class="chart-wrap"><div class="chart-card"><div class="chart-label">ILLUSTRATIVE RETURN PATH</div>${svgLine([120,112,130,105,138,96,148,122,140,151,158,144,166,131,178,150,170,186,198,177,190,205,181,214,201,220,210,195,226,205,238,218],'accent')}</div><div class="chart-card"><div class="chart-label">VOLATILITY CLUSTERS</div><div class="chart-value" id="volVal">0.62</div><p class="labpanel-copy">Move the control to change the conceptual volatility level.</p><div class="slider-row"><input id="volSlider" type="range" min="10" max="95" value="62"><output id="volOut">62%</output></div></div></div>`
  },
  cointegration: {
    title:'COINTEGRATION', copy:'An interactive illustration of two non-stationary price paths that can share a stable long-run relationship.', tags:['long-run relation','residual','time series'],
    view:()=>`<div class="chart-card"><div class="chart-label">ILLUSTRATIVE CRUDE OIL / BRENT PATHS</div><div class="coin-chart">${svgLine([175,168,182,151,159,138,145,128,135,117,126,108,115,98,105,90,98,82,88,72],'accent')}<svg viewBox="0 0 720 250" preserveAspectRatio="none"><polyline class="accent2" points="18,182 55,171 92,179 129,150 166,156 203,130 240,142 277,112 314,120 351,92 388,106 425,78 462,90 499,70 536,82 573,52 610,65 647,45 702,58"/></svg></div><div class="mini-legend"><span><i></i>series A / illustrative</span><span><i class="cyan"></i>series B / illustrative</span></div></div>`
  },
  factor: {
    title:'BIG FIVE FACTORS', copy:'A visual map of the five-factor confirmatory structure you described: Agreeableness, Conscientiousness, Extraversion, Neuroticism and Openness.', tags:['25 items','2,800 respondents','5 factors'],
    view:()=>`<div class="chart-wrap"><div class="chart-card"><div class="chart-label">HYPOTHESISED FACTOR STRUCTURE</div><div class="factor-map">${[['A',78],['C',90],['E',66],['N',84],['O',72]].map(x=>`<div class="factor-bar" style="--h:${x[1]}%"><span>${x[0]}</span></div>`).join('')}</div><div class="mini-legend"><span><i></i>conceptual factor prominence</span></div></div><div class="chart-card"><div class="chart-label">CONFIRMATORY SCOPE</div><div class="stat-strip"><div><b>25</b><small>ITEMS</small></div><div><b>2,800</b><small>RESPONDENTS</small></div><div><b>5</b><small>FACTORS</small></div></div><p class="labpanel-copy">The portfolio records the theory-driven structure and loading-check approach you supplied; actual loadings are not fabricated here.</p></div></div>`
  },
  cca: {
    title:'CANONICAL CORRELATION', copy:'A conceptual view of CCA linking two multivariate sets: fear of computers and fear of statistics.', tags:['7 computer items','8 statistics items','2,571 respondents'],
    view:()=>`<div class="chart-wrap"><div class="chart-card"><div class="chart-label">ILLUSTRATIVE CROSS-SET RELATIONSHIP</div><div class="matrix" id="ccaMatrix"></div><div class="mini-legend"><span><i></i>conceptual shared variation</span></div></div><div class="chart-card"><div class="chart-label">ANALYSIS SCOPE</div><div class="stat-strip"><div><b>7</b><small>COMPUTER FEAR</small></div><div><b>8</b><small>STATISTICS FEAR</small></div><div><b>2,571</b><small>RESPONDENTS</small></div></div><p class="labpanel-copy">Canonical functions summarise shared variation between the two item sets. Reliability and interpretation belong to the original analysis output.</p></div></div>`
  },
  spatial: {
    title:'SPATIAL STATISTICS', copy:'A conceptual spatial field showing how points, density and neighbourhood relationships can be visualised before applying a formal spatial method.', tags:["Moran's I",'KDE','point patterns','Google Earth Pro'],
    view:()=>`<div class="chart-card"><div class="chart-label">ILLUSTRATIVE SPATIAL FIELD</div><svg viewBox="0 0 720 250"><g class="axis">${Array.from({length:9},(_,i)=>`<line x1="${30+i*82}" y1="20" x2="${30+i*82}" y2="230"/>`).join('')}${Array.from({length:5},(_,i)=>`<line x1="30" y1="${25+i*51}" x2="690" y2="${25+i*51}"/>`).join('')}</g>${Array.from({length:55},(_,i)=>{const x=50+(i*83)%610,y=35+(i*47)%180;return `<circle class="point" cx="${x}" cy="${y}" r="${i%5===0?3.5:2}" opacity="${.35+(i%4)*.12}"/>`}).join('')}</svg></div>`
  },
  t2: {
    title:"HOTELLING'S T²", copy:'An interactive conceptual control-chart surface for multivariate monitoring. The control limit is illustrative.', tags:['T²','multivariate monitoring','control limit'],
    view:()=>`<div class="chart-card"><div class="chart-label">ILLUSTRATIVE MULTIVARIATE CONTROL CHART</div><svg viewBox="0 0 720 250"><line class="axis" x1="20" y1="55" x2="700" y2="55"/><polyline class="accent2" points="20,205 65,183 110,190 155,150 200,165 245,115 290,135 335,92 380,121 425,76 470,106 515,64 560,118 605,48 650,98 700,70"/>${[[155,150],[245,115],[335,92],[425,76],[515,64],[605,48]].map(([x,y])=>`<circle class="point" cx="${x}" cy="${y}" r="4"/>`).join('')}<text x="28" y="46" fill="#6f7e92" font-size="9">ILLUSTRATIVE CONTROL LIMIT</text></svg><div class="mini-legend"><span><i></i>observations</span></div></div>`
  },
  arl: {
    title:'ARL SIMULATION', copy:'A lightweight run-length interaction. Increase the threshold to see the conceptual monitor state change.', tags:['control charts','run length','simulation'],
    view:()=>`<div class="chart-wrap"><div class="chart-card"><div class="chart-label">THRESHOLD CONTROL</div><div class="slider-row"><input id="arl16" type="range" min="1" max="20" value="8"><output id="arl16out">08</output></div><div id="arl16value" class="chart-value" style="margin-top:30px">IN CONTROL</div></div><div class="chart-card"><div class="chart-label">ILLUSTRATIVE RUN LENGTH</div>${svgLine([30,45,38,60,52,75,67,83,72,92,80,101,95,110],'accent2')}</div></div>`
  }
};
function svgLine(values, cls='accent') {
  const max=Math.max(...values), min=Math.min(...values), span=max-min||1;
  const points=values.map((v,i)=>`${(i/(values.length-1))*700+10},${220-((v-min)/span)*175}`).join(' ');
  return `<svg viewBox="0 0 720 250" preserveAspectRatio="none"><line class="axis" x1="10" y1="220" x2="710" y2="220"/><polyline class="${cls}" points="${points}"/></svg>`;
}
function renderLab(key) {
  const panel=$('#labpanel'); const x=labs[key]||labs.pca; if(!panel)return;
  panel.innerHTML=`<div class="labview"><div><div class="labpanel-title">MODULE_${key.toUpperCase()}<strong>${x.title}</strong></div><p class="labpanel-copy">${x.copy}</p><div class="method-tags">${x.tags.map(t=>`<span>${t}</span>`).join('')}</div></div><div class="viz">${x.view()}</div></div>`;
  if(key==='garch'){
    const s=$('#volSlider'),o=$('#volOut'),v=$('#volVal');
    s.oninput=()=>{o.value=s.value+'%';v.textContent=(s.value/100).toFixed(2)};
  }
  if(key==='cca'){
    const g=$('#ccaMatrix');
    for(let i=0;i<105;i++){const d=Math.abs(Math.floor(i/15)-i%15),c=document.createElement('i');c.style.setProperty('--a',Math.max(.04,.68-d*.055+Math.random()*.08));g.appendChild(c)}
  }
  if(key==='arl'){
    const s=$('#arl16'),o=$('#arl16out'),v=$('#arl16value');
    const update=()=>{o.value=String(s.value).padStart(2,'0');v.textContent=+s.value<7?'SIGNAL / REVIEW':+s.value<14?'MONITOR':'IN CONTROL'};
    s.oninput=update; update();
  }
}
$$('.tabs button').forEach((button,index,nodes) => {
  button.setAttribute('role','tab');
  button.setAttribute('aria-selected',button.classList.contains('active')?'true':'false');
  button.addEventListener('click',()=>{
    nodes.forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false')});
    button.classList.add('active');button.setAttribute('aria-selected','true');renderLab(button.dataset.lab);
  });
  button.addEventListener('keydown',event=>{
    if(!['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(event.key)) return;
    event.preventDefault(); const delta=(event.key==='ArrowRight'||event.key==='ArrowDown')?1:-1; nodes[(index+delta+nodes.length)%nodes.length].focus();
  });
});
renderLab('pca');

// Project case studies.
const caseData={
 bitcoin:{code:'PROJECT_01 / TIME SERIES + FINANCE',title:'ARIMA + GARCH Models for Bitcoin Volatility',intro:'A financial time-series project combining ARIMA forecasting with GARCH volatility modelling to study Bitcoin behaviour.',question:'Model and understand the time-series and volatility structure of Bitcoin data.',method:'ARIMA for conditional mean / forecasting structure; GARCH-family modelling for conditional volatility.',data:'Bitcoin price/return series supplied for the project.'},
 oil:{code:'PROJECT_02 / ECONOMETRICS',title:'Cointegration of Crude Oil vs Brent Oil',intro:'An econometric analysis of the long-run relationship between crude oil and Brent oil price series.',question:'Assess whether the two oil-price series share a stable long-run relationship.',method:'Cointegration analysis with time-series diagnostics.',data:'Crude oil and Brent oil price series.'},
 bigfive:{code:'PROJECT_03 / FACTOR ANALYSIS',title:'Confirmatory Factor Analysis: Big Five Personality Model',intro:'A theory-driven analysis testing whether 25 personality items align with the pre-specified five-factor Big Five structure.',question:'Assess whether item correlations support the hypothesised Agreeableness, Conscientiousness, Extraversion, Neuroticism and Openness structure.',method:'Factor extraction guided by data-driven criteria and theory, rotation, and comparison of largest item loadings with their hypothesised factors.',data:'2,800 respondents; 25 items; six-point response scale.'},
 cca:{code:'PROJECT_04 / CANONICAL CORRELATION',title:'Fear of Computers × Fear of Statistics',intro:'Canonical correlation analysis examining shared variation between two quantitative-anxiety domains.',question:'Identify reliable canonical dimensions linking fear of computers with fear of statistics and interpret their relationship to the original items.',method:'Canonical correlation analysis across seven computer-fear items and eight statistics-fear items.',data:'2,571 respondents; five-point Likert scale.'}
};
const modal=$('#caseModal'); let lastCaseTrigger=null;
function openCase(key,trigger){const d=caseData[key];if(!d||!modal)return;lastCaseTrigger=trigger||null;$('#caseCode').textContent=d.code;$('#caseTitle').textContent=d.title;$('#caseIntro').textContent=d.intro;$('#caseQuestion').textContent=d.question;$('#caseMethod').textContent=d.method;$('#caseData').textContent=d.data;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');$('.case-close')?.focus()}
function closeCase(){if(!modal)return;modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');lastCaseTrigger?.focus();lastCaseTrigger=null}
$$('.case-open').forEach(button=>button.addEventListener('click',()=>openCase(button.dataset.case,button)));
$$('[data-close-case]').forEach(el=>el.addEventListener('click',closeCase));

// Selected-work explorer: filtering/search layers over the existing work.
// Nothing is deleted; items are only visually hidden while a filter/search is active.
const workFilters=$$('.work-filter');
const workItems=$$('.work-item');
const workSearch=$('#workSearch');
const workCount=$('#workCount');
const workClear=$('#workClear');
let activeWorkFilter='all';
function updateWorkExplorer(){
  const term=(workSearch?.value||'').trim().toLowerCase();
  let visible=0;
  workItems.forEach(item=>{
    const categoryMatch=activeWorkFilter==='all'||item.dataset.category===activeWorkFilter;
    const textMatch=!term||item.textContent.toLowerCase().includes(term);
    const show=categoryMatch&&textMatch;
    item.classList.toggle('is-hidden',!show);
    item.setAttribute('aria-hidden',show?'false':'true');
    if(show)visible++;
  });
  if(workCount)workCount.textContent=`${visible} of ${workItems.length} projects visible`;
}
workFilters.forEach(btn=>btn.addEventListener('click',()=>{
  activeWorkFilter=btn.dataset.filter||'all';
  workFilters.forEach(x=>{x.classList.toggle('active',x===btn);x.setAttribute('aria-pressed',x===btn?'true':'false')});
  updateWorkExplorer();
}));
workSearch?.addEventListener('input',updateWorkExplorer);
workClear?.addEventListener('click',()=>{
  if(workSearch)workSearch.value='';
  activeWorkFilter='all';
  workFilters.forEach((x,i)=>{x.classList.toggle('active',i===0);x.setAttribute('aria-pressed',i===0?'true':'false')});
  updateWorkExplorer();
  workSearch?.focus();
});
workFilters.forEach((x,i)=>x.setAttribute('aria-pressed',i===0?'true':'false'));
updateWorkExplorer();

// GitHub command centre with 10-minute cache and safe fallback.
async function github(){
  const status=$('#ghstatus'),stats=$('#stats'),repos=$('#repos'); if(!status||!stats||!repos)return;
  const render=(user,items,mode)=>{
    status.textContent=`Public profile · ${user.public_repos??0} repositories · ${mode}`;
    stats.innerHTML=[['REPOSITORIES',user.public_repos??0],['FOLLOWERS',user.followers??0],['FOLLOWING',user.following??0],['GISTS',user.public_gists??0]].map(x=>`<div><b>${x[1]}</b><small>${x[0]}</small></div>`).join('');
    repos.innerHTML=(Array.isArray(items)?items:[]).map(x=>`<article class="repo"><a href="${x.html_url}" target="_blank" rel="noreferrer">${x.name}</a><p>${x.description||'No description supplied.'}</p><small>${x.language||': '}　★ ${x.stargazers_count||0}　⑂ ${x.forks_count||0}</small></article>`).join('')||'<article class="repo"><p>No public repositories returned.</p></article>';
  };
  try{
    const cached=JSON.parse(localStorage.getItem(GH_CACHE)||'null');
    if(cached&&Date.now()-cached.ts<10*60*1000){render(cached.user,cached.repos,'cached');return;}
    const [uResponse,rResponse]=await Promise.all([fetch('https://api.github.com/users/viviansb3-tech'),fetch('https://api.github.com/users/viviansb3-tech/repos?sort=updated&per_page=6')]);
    const user=await uResponse.json(), reposData=await rResponse.json(); if(user.message)throw Error('GitHub API');
    localStorage.setItem(GH_CACHE,JSON.stringify({ts:Date.now(),user,repos:reposData})); render(user,reposData,'live');
  }catch(error){
    try{const cached=JSON.parse(localStorage.getItem(GH_CACHE)||'null');if(cached){render(cached.user,cached.repos,'cached · offline');return;}}catch(_){/* ignore */}
    status.textContent='GitHub data unavailable: fallback mode';
    stats.innerHTML=[['PROFILE','viviansb3-tech'],['REPOSITORY','Vivian'],['MODE','FALLBACK'],['STATUS','UNAVAILABLE']].map(x=>`<div><b>${x[1]}</b><small>${x[0]}</small></div>`).join('');
    repos.innerHTML='<article class="repo"><a href="https://github.com/viviansb3-tech" target="_blank" rel="noreferrer">viviansb3-tech</a><p>Open the GitHub profile to view current confirmed metadata.</p></article>';
  }
}
// Phase 47 owns GitHub rendering and live repository proof.

// Contact delivery is handled by phase49-contact-conversion.js.

// Floating particle field. Performance-aware: desktop only, ~30fps, pauses in background tabs.
const canvas=$('#data-canvas');
if(canvas){
  const coarse=window.matchMedia('(pointer:coarse)').matches;
  if(reduced||coarse||innerWidth<820){canvas.hidden=true;}else{
    const ctx=canvas.getContext('2d'); let particles=[],raf=0,last=0;
    const resize=()=>{const dpr=Math.min(window.devicePixelRatio||1,1.5);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0);particles=Array.from({length:28},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.14,vy:(Math.random()-.5)*.14,r:Math.random()*1.1+.35}))};
    const draw=t=>{raf=requestAnimationFrame(draw);if(document.hidden||t-last<33)return;last=t;ctx.clearRect(0,0,innerWidth,innerHeight);particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>innerWidth)p.vx*=-1;if(p.y<0||p.y>innerHeight)p.vy*=-1;ctx.fillStyle='rgba(110,190,255,.38)';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()});for(let i=0;i<particles.length;i++)for(let j=i+1;j<particles.length;j++){const a=particles[i],b=particles[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<120){ctx.strokeStyle=`rgba(77,163,255,${.045*(1-d/120)})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}};
    resize();addEventListener('resize',resize,{passive:true});raf=requestAnimationFrame(draw);
    addEventListener('pagehide',()=>cancelAnimationFrame(raf),{once:true});
  }
}

// Mobile navigation.
const menuButton=$('.menu'),links=$('.links');
menuButton?.addEventListener('click',()=>{const open=links.classList.toggle('mobile-open');menuButton.setAttribute('aria-expanded',open?'true':'false');menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation')});
$$('.links a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('mobile-open');menuButton?.setAttribute('aria-expanded','false');menuButton?.setAttribute('aria-label','Open navigation')}));

// Scroll progress and active navigation.
const progress=$('#scrollProgress');
const navLinks=$$('.links a');
const sections=navLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
const updateScrollUI=()=>{
  const max=document.documentElement.scrollHeight-innerHeight; if(progress)progress.style.width=(max>0?(scrollY/max)*100:0)+'%';
  $('#nav')?.classList.toggle('scrolled',scrollY>40); $('#backTop')?.classList.toggle('show',scrollY>700);
};
let scrollTick=false;
addEventListener('scroll',()=>{if(scrollTick)return;scrollTick=true;requestAnimationFrame(()=>{updateScrollUI();scrollTick=false})},{passive:true});updateScrollUI();
if('IntersectionObserver' in window){const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id))}),{rootMargin:'-40% 0px -50% 0px',threshold:0});sections.forEach(s=>navObserver.observe(s));}

// Command palette.
const commandPalette=$('#commandPalette'),commandSearch=$('#commandSearch'),commandResults=$('#commandResults');
const commandItems=[
 ['About','Profile, statistics, data, technology and education','about'],['Philosophy','From numbers to insight','philosophy'],['Journey','University of the Free State, tutoring and development','journey'],['Technology Stack','Python, R, SQL, GIS, Excel and development','stack'],['Selected Work','Statistical projects and case studies','work'],['Workflow','From research question to insight','workflow'],['Research Archive','Research areas and methods','research'],['Data Science Lab','PCA, ARIMA, GARCH, CCA, spatial and multivariate demos','lab'],['GitHub','Live repository command centre','github'],['CV','View or download Vivian Sibanda CV','cv'],['Contact','WhatsApp, call or email Vivian','contact']
];
function renderCommands(query=''){
  if(!commandResults)return; const term=query.trim().toLowerCase(); const rows=commandItems.filter(x=>(x[0]+' '+x[1]).toLowerCase().includes(term));
  commandResults.innerHTML=rows.map((x,i)=>`<button class="command-item" data-target="${x[2]}"><span>${String(i+1).padStart(2,'0')}</span><strong>${x[0]}</strong><small>${x[1]}</small><b>↗</b></button>`).join('')||'<div class="command-empty">No matching section.</div>';
  $$('.command-item',commandResults).forEach(b=>b.addEventListener('click',()=>{closeCommand();document.getElementById(b.dataset.target)?.scrollIntoView({behavior:reduced?'auto':'smooth'})}));
}
function openCommand(){if(!commandPalette)return;commandPalette.classList.add('open');commandPalette.setAttribute('aria-hidden','false');renderCommands();setTimeout(()=>commandSearch?.focus(),20)}
function closeCommand(){if(!commandPalette)return;commandPalette.classList.remove('open');commandPalette.setAttribute('aria-hidden','true')}
$('.palette-trigger')?.addEventListener('click',openCommand);commandSearch?.addEventListener('input',e=>renderCommands(e.target.value));$$('[data-close-command]').forEach(x=>x.addEventListener('click',closeCommand));
document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();commandPalette?.classList.contains('open')?closeCommand():openCommand()}if(event.key==='Escape'){closeCommand();closeCase()}});
$('#backTop')?.addEventListener('click',()=>scrollTo({top:0,behavior:reduced?'auto':'smooth'}));

// Basic focus trap for open overlays.
document.addEventListener('keydown',event=>{
  const overlay=commandPalette?.classList.contains('open')?commandPalette:(modal?.classList.contains('open')?modal:null); if(!overlay||event.key!=='Tab')return;
  const focusables=$$('button,a,input,textarea,select,[tabindex]:not([tabindex="-1"])',overlay).filter(x=>!x.disabled);
  if(!focusables.length)return; const first=focusables[0],last=focusables[focusables.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
});

if(reduced)document.body.classList.add('reduced');

// Phase 22: interactive research workflow. This is additive and does not remove existing modules.
const workflowStages={
 question:{code:'STAGE_01 / QUESTION',title:'START WITH THE QUESTION.',copy:'Good analysis starts by defining what needs to be understood, measured or predicted. The method follows the question: not the other way around.',tags:['RESEARCH QUESTION','OBJECTIVE','CONTEXT']},
 data:{code:'STAGE_02 / DATA',title:'UNDERSTAND THE EVIDENCE.',copy:'Inspect the structure, quality and context of the data before modelling. Data cleaning, exploratory analysis and clear variable definitions create the foundation for defensible work.',tags:['DATA QUALITY','EDA','VARIABLES']},
 model:{code:'STAGE_03 / MODEL',title:'CHOOSE THE METHOD.',copy:'Select a method that matches the question and data. Your project experience spans time-series, multivariate, factor, canonical-correlation and spatial approaches.',tags:['ARIMA','GARCH','PCA','FACTOR ANALYSIS','CCA','SPATIAL']},
 validate:{code:'STAGE_04 / VALIDATE',title:'CHALLENGE THE RESULT.',copy:'A useful model needs scrutiny. Check assumptions, structure, reliability and whether the result actually answers the original question. Unsupported claims stay out of the portfolio.',tags:['ASSUMPTIONS','DIAGNOSTICS','RELIABILITY']},
 insight:{code:'STAGE_05 / INSIGHT',title:'MAKE THE RESULT USEFUL.',copy:'The final step is communication: turn statistical output into information that another person can understand, question and use.',tags:['INFORMATION','INSIGHT','COMMUNICATION']}
};
const wfButtons=$$('.workflow-step'),wfPanel=$('#workflowPanel');
function renderWorkflow(key){const d=workflowStages[key]||workflowStages.question;if(!wfPanel)return;$('#workflowCode').textContent=d.code;$('#workflowTitle').textContent=d.title;$('#workflowCopy').textContent=d.copy;$('#workflowTags').innerHTML=d.tags.map(t=>`<span>${t}</span>`).join('');wfButtons.forEach(b=>{const on=b.dataset.stage===key;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')})}
wfButtons.forEach((b,i)=>{b.addEventListener('click',()=>renderWorkflow(b.dataset.stage));b.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(e.key))return;e.preventDefault();const dir=(e.key==='ArrowRight'||e.key==='ArrowDown')?1:-1;wfButtons[(i+dir+wfButtons.length)%wfButtons.length].focus();renderWorkflow(wfButtons[(i+dir+wfButtons.length)%wfButtons.length].dataset.stage)})});
renderWorkflow('question');

/* PHASE 37: premium interaction layer */
(() => {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const interactive = $$('a,button,.work-item,.signal-card,.cap-card,.quote,.contact-card');

  // Pointer-driven ambient light and custom cursor on capable desktop pointers.
  if (!reduce && window.matchMedia('(pointer:fine)').matches) {
    const cursor = document.createElement('div'); cursor.className='p37-cursor'; document.body.appendChild(cursor);
    const dot = document.createElement('div'); dot.className='p37-cursor-dot'; document.body.appendChild(dot);
    let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my,dx=mx,dy=my,cursorRaf=0;
    const frame=()=>{cx+=(mx-cx)*.22;cy+=(my-cy)*.22;dx+=(mx-dx)*.42;dy+=(my-dy)*.42;cursor.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;dot.style.transform=`translate(${dx}px,${dy}px) translate(-50%,-50%)`;if(Math.abs(mx-cx)+Math.abs(my-cy)+Math.abs(mx-dx)+Math.abs(my-dy)>.35)cursorRaf=requestAnimationFrame(frame);else cursorRaf=0};
    const move=e=>{mx=e.clientX;my=e.clientY;root.style.setProperty('--p37-x',`${mx}px`);root.style.setProperty('--p37-y',`${my}px`);cursor.classList.add('is-active');dot.classList.add('is-active');if(!cursorRaf)cursorRaf=requestAnimationFrame(frame)};
    window.addEventListener('pointermove',move,{passive:true});
    interactive.forEach(el=>{el.addEventListener('mouseenter',()=>cursor.classList.add('is-hover'));el.addEventListener('mouseleave',()=>cursor.classList.remove('is-hover'))});
    window.addEventListener('blur',()=>{cursor.classList.remove('is-active');dot.classList.remove('is-active')});
  }

  // Subtle magnetic motion for primary calls-to-action.
  if (!reduce && window.matchMedia('(pointer:fine)').matches) {
    $$('.btn.primary,.palette-trigger,.theme-toggle').forEach(el=>{
      el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)/r.width,y=(e.clientY-r.top-r.height/2)/r.height;el.style.transform=`translate(${x*7}px,${y*6}px)`});
      el.addEventListener('pointerleave',()=>el.style.transform='');
    });
  }

  // Lightweight 3D tilt on the hero portrait and floating data cards.
  if (!reduce && window.matchMedia('(pointer:fine)').matches) {
    $$('.hero .portrait,.hero .float').forEach(card=>{
      card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),rx=((e.clientY-r.top)/r.height-.5)*-5,ry=((e.clientX-r.left)/r.width-.5)*7;card.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(4px)`});
      card.addEventListener('pointerleave',()=>card.style.transform='');
    });
  }

  // Staggered reveal for sections that were added before the phase-37 layer.
  const revealTargets=$$('.section > .kicker, .section > .section-head, .section > .philosophy-head, .section > .quote-grid, .section > .work-grid, .section > .cap-grid');
  revealTargets.forEach((el,i)=>{el.classList.add('p37-reveal',`p37-delay-${(i%3)+1}`)});
  if (!reduce && 'IntersectionObserver' in window) {
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('p37-visible');io.unobserve(entry.target)}}),{threshold:.12});
    revealTargets.forEach(el=>io.observe(el));
  } else revealTargets.forEach(el=>el.classList.add('p37-visible'));

  // Add a subtle live-status cue to the hero metadata without changing existing content.
  const meta=$('.hero-meta');
  if(meta && !meta.querySelector('.p37-status')){const s=document.createElement('span');s.className='p37-status';s.innerHTML='<i aria-hidden="true"></i><b>SYSTEM / ONLINE</b>';meta.appendChild(s)}
  const stage=$('.hero .stage');
  if(stage && !stage.querySelector('.p37-hero-orb')){const orb=document.createElement('div');orb.className='p37-hero-orb';orb.setAttribute('aria-hidden','true');stage.appendChild(orb)}
})();


// Phase 52.3: homepage start + navigation flow stability.
// Prevent browsers from restoring an old scroll position when the root homepage is reopened.
try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (_) {}
const phase523StartAtHome = () => {
  // Respect deliberate deep links, but a normal root-page visit always begins at the hero.
  if (!window.location.hash || window.location.hash === '#home') {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }
};
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', phase523StartAtHome, { once: true });
} else {
  phase523StartAtHome();
}
window.addEventListener('pageshow', phase523StartAtHome);

// Keep the top navigation visually attached to the viewport as the page scrolls.
const phase523Header = document.querySelector('body > header');
const phase523Nav = document.getElementById('nav');
const phase523SyncNav = () => {
  const scrolled = window.scrollY > 40;
  phase523Header?.classList.toggle('nav-scrolled', scrolled);
  phase523Nav?.classList.toggle('scrolled', scrolled);
};
phase523SyncNav();
window.addEventListener('scroll', phase523SyncNav, { passive: true });
