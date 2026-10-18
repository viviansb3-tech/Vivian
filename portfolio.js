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

// Mobile navigation: touch-safe, focus-aware, and self-closing.
const menuButton=$('.menu'),links=$('.links');
const closeMobileNav=(restoreFocus=false)=>{
  if(!links)return;
  const wasOpen=links.classList.contains('mobile-open');
  links.classList.remove('mobile-open');
  document.body.classList.remove('mobile-nav-open');
  menuButton?.setAttribute('aria-expanded','false');
  menuButton?.setAttribute('aria-label','Open navigation');
  if(restoreFocus&&wasOpen)menuButton?.focus();
};
const openMobileNav=()=>{
  if(!links)return;
  links.classList.add('mobile-open');
  document.body.classList.add('mobile-nav-open');
  menuButton?.setAttribute('aria-expanded','true');
  menuButton?.setAttribute('aria-label','Close navigation');
};
menuButton?.addEventListener('click',()=>links?.classList.contains('mobile-open')?closeMobileNav():openMobileNav());
$$('.links a').forEach(a=>a.addEventListener('click',()=>closeMobileNav()));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&links?.classList.contains('mobile-open'))closeMobileNav(true)});
document.addEventListener('pointerdown',e=>{if(links?.classList.contains('mobile-open')&&!links.contains(e.target)&&!menuButton?.contains(e.target))closeMobileNav()});
addEventListener('resize',()=>{if(innerWidth>900)closeMobileNav()},{passive:true});

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

;
/* Phase 23: Light/Dark theme controller */
(function () {
  "use strict";
  var root = document.documentElement;
  var button = document.getElementById("theme-toggle");
  var storageKey = "vivian-theme";
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function apply(theme) {
    theme = theme === "light" ? "light" : "dark";
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
    if (themeMeta) themeMeta.setAttribute("content", theme === "light" ? "#f4f7fb" : "#07090d");
    if (button) {
      var isLight = theme === "light";
      button.setAttribute("aria-pressed", String(isLight));
      button.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
      var label = button.querySelector(".theme-toggle-label");
      var icon = button.querySelector(".theme-toggle-icon");
      if (label) label.textContent = isLight ? "DARK" : "LIGHT";
      if (icon) icon.textContent = isLight ? "☾" : "☼";
    }
    try { localStorage.setItem(storageKey, theme); } catch (e) {}
  }

  var saved = null;
  try { saved = localStorage.getItem(storageKey); } catch (e) {}
  apply(saved || "dark");

  if (button) {
    button.addEventListener("click", function () {
      apply(root.getAttribute("data-theme") === "light" ? "dark" : "light");
    });
  }
}());

;
/* Phase 24: accessibility preference controller */
(function () {
  "use strict";
  var root = document.documentElement;
  var keys = {
    text: "vivian-large-text",
    contrast: "vivian-high-contrast",
    motion: "vivian-reduced-motion"
  };

  function read(key) {
    try { return localStorage.getItem(key) === "1"; } catch (e) { return false; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, value ? "1" : "0"); } catch (e) {}
  }
  function setClass(name, on) {
    root.classList.toggle(name, on);
  }
  function sync() {
    var text = read(keys.text);
    var contrast = read(keys.contrast);
    var motion = read(keys.motion);
    setClass("phase24-large-text", text);
    setClass("phase24-high-contrast", contrast);
    setClass("phase24-reduced-motion", motion);

    var a = document.getElementById("phase24-text-toggle");
    var b = document.getElementById("phase24-contrast-toggle");
    var c = document.getElementById("phase24-motion-toggle");
    if (a) a.setAttribute("aria-pressed", String(text));
    if (b) b.setAttribute("aria-pressed", String(contrast));
    if (c) c.setAttribute("aria-pressed", String(motion));
  }

  function bind(id, key, cls) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", function () {
      var next = !read(key);
      save(key, next);
      setClass(cls, next);
      el.setAttribute("aria-pressed", String(next));
    });
  }

  sync();
  bind("phase24-text-toggle", keys.text, "phase24-large-text");
  bind("phase24-contrast-toggle", keys.contrast, "phase24-high-contrast");
  bind("phase24-motion-toggle", keys.motion, "phase24-reduced-motion");
}());

;
/* Phase 28: research directory search/filter */
(function(){
  "use strict";
  function init(){
    var input=document.getElementById("phase28-project-search");
    var grid=document.getElementById("phase28-project-grid");
    var empty=document.getElementById("phase28-empty");
    if(!input||!grid) return;
    var cards=[].slice.call(grid.querySelectorAll(".phase28-project"));
    var buttons=[].slice.call(document.querySelectorAll(".phase28-filter"));
    var active="all";

    function apply(){
      var q=(input.value||"").trim().toLowerCase();
      var shown=0;
      cards.forEach(function(card){
        var tags=(card.getAttribute("data-tags")||"").split(/\s+/);
        var title=(card.getAttribute("data-title")||"").toLowerCase();
        var text=card.textContent.toLowerCase();
        var tagOK=active==="all"||tags.indexOf(active)!==-1;
        var searchOK=!q||title.indexOf(q)!==-1||text.indexOf(q)!==-1;
        var show=tagOK&&searchOK;
        card.hidden=!show;
        if(show) shown++;
      });
      if(empty) empty.hidden=shown!==0;
    }
    buttons.forEach(function(btn){
      btn.addEventListener("click",function(){
        active=btn.getAttribute("data-filter")||"all";
        buttons.forEach(function(b){b.classList.toggle("is-active",b===btn);});
        apply();
      });
    });
    input.addEventListener("input",apply);
    apply();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init);
  else init();
}());

;
/* Phase 29: keyboard command centre */
(function(){
  "use strict";
  var items=[
    ["HOME","#","Portfolio home"],
    ["ABOUT","#about","About Vivian"],
    ["EDUCATION","#education","Education journey"],
    ["TECHNOLOGY STACK","#skills","Technology stack"],
    ["SELECTED WORK","#projects","Selected work"],
    ["RESEARCH","#research","Research"],
    ["DATA SCIENCE LAB","#data-science-lab","Interactive lab"],
    ["GITHUB","#github","GitHub"],
    ["CONTACT","#contact","Contact"],
    ["COINTEGRATION + BITCOIN","cointegration-bitcoin.html","ARIMA / GARCH + cointegration"],
    ["PCA","projects/pca.html","Principal Component Analysis"],
    ["BIG FIVE FACTOR ANALYSIS","projects/factor-analysis.html","Five-factor personality analysis"],
    ["CANONICAL CORRELATION","projects/canonical-correlation.html","Computer fear ↔ statistics fear"],
    ["GEOSPATIAL ANALYSIS","projects/spatial-analysis.html","Spatial analysis"]
  ];
  function init(){
    var modal=document.getElementById("phase29-command-palette");
    var input=document.getElementById("phase29-command-input");
    var results=document.getElementById("phase29-command-results");
    var trigger=document.getElementById("phase29-command-trigger");
    if(!modal||!input||!results||!trigger)return;
    var lastFocus=null;
    function render(){
      var q=(input.value||"").toLowerCase().trim();
      var filtered=items.filter(function(x){return !q||x[0].toLowerCase().indexOf(q)>-1||x[2].toLowerCase().indexOf(q)>-1;});
      results.innerHTML=filtered.map(function(x){
        return '<a class="phase29-command-result" href="'+x[1]+'"><span>'+x[0]+'</span><small>'+x[2]+'</small></a>';
      }).join("") || '<div class="phase29-command-result"><span>No match</span><small>Try another term</small></div>';
    }
    function open(){
      lastFocus=document.activeElement;
      modal.hidden=false; modal.setAttribute("aria-hidden","false");
      input.value=""; render(); setTimeout(function(){input.focus();},0);
    }
    function close(){
      modal.hidden=true; modal.setAttribute("aria-hidden","true");
      if(lastFocus&&lastFocus.focus)lastFocus.focus();
    }
    trigger.addEventListener("click",open);
    input.addEventListener("input",render);
    modal.querySelectorAll("[data-command-close]").forEach(function(el){el.addEventListener("click",close);});
    document.addEventListener("keydown",function(e){
      if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();open();}
      if(e.key==="Escape"&&!modal.hidden)close();
    });
    render();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
}());

;
/* Phase 30: lightweight interface telemetry */
(function(){
"use strict";
function init(){
 var bar=document.querySelector("#phase30-scroll-progress span");
 var hud=document.getElementById("phase30-hud-section");
 function progress(){
  var doc=document.documentElement, max=doc.scrollHeight-window.innerHeight;
  var pct=max>0?(window.scrollY/max)*100:0;
  if(bar) bar.style.width=Math.min(100,Math.max(0,pct))+"%";
 }
 var ids=["home","about","education","skills","projects","research","data-science-lab","github","contact","project-launchpad","system-map"];
 var sections=ids.map(function(id){return document.getElementById(id)}).filter(Boolean);
 function active(){
  if(!hud||!sections.length)return;
  var best=sections[0],dist=Infinity;
  sections.forEach(function(sec){var d=Math.abs(sec.getBoundingClientRect().top-window.innerHeight*.24);if(d<dist){best=sec;dist=d;}});
  hud.textContent=(best.getAttribute("data-nav-label")||best.id||"HOME").replace(/-/g," ").toUpperCase();
 }
 var ticking=false;
 window.addEventListener("scroll",function(){if(ticking)return;ticking=true;requestAnimationFrame(function(){progress();active();ticking=false})},{passive:true});
 window.addEventListener("resize",function(){if(ticking)return;ticking=true;requestAnimationFrame(function(){progress();active();ticking=false})},{passive:true});
 progress();active();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
}());

;
/* Phase 31: research matrix filters */
(function(){
"use strict";
function init(){
 var buttons=[].slice.call(document.querySelectorAll(".phase31-filter"));
 var cards=[].slice.call(document.querySelectorAll(".phase31-matrix-item"));
 if(!buttons.length||!cards.length)return;
 buttons.forEach(function(btn){
  btn.addEventListener("click",function(){
   var filter=btn.getAttribute("data-filter");
   buttons.forEach(function(b){b.classList.toggle("is-active",b===btn);});
   cards.forEach(function(card){
    var categories=(card.getAttribute("data-category")||"").split(/\s+/);
    card.classList.toggle("is-hidden",filter!=="all" && categories.indexOf(filter)===-1);
   });
  });
 });
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
}());

;
/* Phase 32: research dossier tabs */
(function(){
"use strict";
function init(){
 var tabs=[].slice.call(document.querySelectorAll(".phase32-dossier-tab"));
 var panels=[].slice.call(document.querySelectorAll(".phase32-dossier-panel"));
 if(!tabs.length||!panels.length)return;
 function activate(key){
  tabs.forEach(function(tab){
   var active=tab.getAttribute("data-dossier")===key;
   tab.classList.toggle("is-active",active);
   tab.setAttribute("aria-selected",active?"true":"false");
  });
  panels.forEach(function(panel){
   panel.classList.toggle("is-active",panel.getAttribute("data-panel")===key);
  });
 }
 tabs.forEach(function(tab){
  tab.setAttribute("role","tab");
  tab.setAttribute("aria-selected",tab.classList.contains("is-active")?"true":"false");
  tab.addEventListener("click",function(){activate(tab.getAttribute("data-dossier"));});
  tab.addEventListener("keydown",function(e){
   if(e.key!=="ArrowDown"&&e.key!=="ArrowUp")return;
   e.preventDefault();
   var i=tabs.indexOf(tab), next=e.key==="ArrowDown"?i+1:i-1;
   if(next<0)next=tabs.length-1;if(next>=tabs.length)next=0;
   tabs[next].focus();activate(tabs[next].getAttribute("data-dossier"));
  });
 });
 panels.forEach(function(p){p.setAttribute("role","tabpanel");});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
}());

;
(() => {
  const input = document.getElementById('workSearch');
  const items = [...document.querySelectorAll('.work-item')];
  const filters = [...document.querySelectorAll('.work-filter')];
  const count = document.getElementById('workCount');
  if (!input || !items.length) return;
  let active = 'all';

  const apply = () => {
    const q = input.value.trim().toLowerCase();
    let visible = 0;
    items.forEach(item => {
      const category = item.dataset.category || '';
      const haystack = item.textContent.toLowerCase();
      const matchCategory = active === 'all' || category === active;
      const matchSearch = !q || haystack.includes(q);
      const show = matchCategory && matchSearch;
      item.hidden = !show;
      if (show) visible++;
    });
    if (count) count.textContent = visible;
  };

  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    active = button.dataset.filter || 'all';
    apply();
  }));

  input.addEventListener('input', apply);
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault(); input.focus(); input.select();
    }
    if (e.key === 'Escape' && document.activeElement === input) {
      input.value = ''; input.blur(); apply();
    }
  });
  apply();
})();

;
(() => {
  const root = document.getElementById('research-intelligence');
  if (!root) return;
  const nodes = [...root.querySelectorAll('.phase40-node')];
  const filters = [...root.querySelectorAll('.phase40-filter')];
  const detail = root.querySelector('#phase40Detail');
  const title = root.querySelector('#phase40DetailTitle');
  const copy = root.querySelector('#phase40DetailCopy');
  const meta = root.querySelector('#phase40DetailMeta');
  const tags = root.querySelector('#phase40DetailTags');
  const count = root.querySelector('#phase40Count');
  let active = 'all';

  const render = (node) => {
    if (!node || !title) return;
    title.textContent = node.dataset.title || 'Research project';
    copy.textContent = node.dataset.copy || '';
    meta.textContent = node.dataset.meta || '';
    tags.innerHTML = (node.dataset.tags || '').split('|').filter(Boolean).map(t => `<span>${t}</span>`).join('');
    nodes.forEach(n => n.classList.toggle('is-selected', n === node));
    detail?.scrollIntoView({behavior:'smooth', block:'nearest'});
  };
  const apply = () => {
    let visible = 0;
    nodes.forEach(node => {
      const categories = (node.dataset.category || '').split(' ');
      const show = active === 'all' || categories.includes(active);
      node.hidden = !show;
      if (show) visible++;
    });
    if (count) count.textContent = visible;
    const selected = nodes.find(n => !n.hidden && n.classList.contains('is-selected')) || nodes.find(n => !n.hidden);
    if (selected) render(selected);
  };
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    active = btn.dataset.filter || 'all';
    apply();
  }));
  nodes.forEach(node => node.addEventListener('click', e => {
    if (e.target.closest('a')) return;
    render(node);
  }));
  const timeline = [...root.querySelectorAll('.phase40-timeline-item')];
  timeline.forEach(item => item.addEventListener('click', () => {
    const target = nodes.find(n => n.dataset.key === item.dataset.key);
    if (target) render(target);
  }));
  apply();
})();

;
(() => {
  const data = {
    pca:{title:'Principal Component Analysis',area:'MULTIVARIATE',kpi:'PCA',kpiLabel:'DIMENSION REDUCTION',metrics:[['Input','23 variables','Original feature space'],['Output','Principal components','Linear combinations'],['Core idea','Variance','Retain informative structure']],bars:[['Correlation structure',88],['Variance interpretation',82],['Visualisation',78]],note:'The PCA work focuses on reducing a correlated multivariate system into interpretable components while preserving as much variance as practical.',tags:['PCA','EIGENVALUES','LOADINGS','SCORES']},
    factor:{title:'Big Five Factor Analysis',area:'MULTIVARIATE',kpi:'2,800',kpiLabel:'OBSERVATIONS',metrics:[['Items','25','Observed variables'],['Factors','5','Hypothesised dimensions'],['Scale','Likert','Psychometric structure']],bars:[['Sample scale',94],['Factor structure',86],['Interpretation',84]],note:'The project examines a 25-item instrument against a five-factor personality structure, with emphasis on factorability, extraction and interpretation.',tags:['FACTOR ANALYSIS','PSYCHOMETRICS','LIKERT','R']},
    cca:{title:'Canonical Correlation Analysis',area:'MULTIVARIATE',kpi:'2,571',kpiLabel:'OBSERVATIONS',metrics:[['Set A','7 items','Computer fear'],['Set B','8 items','Statistics fear'],['Goal','Canonical variates','Relationship between sets']],bars:[['Multivariate structure',90],['Relationship analysis',88],['Interpretation',82]],note:'The CCA project studies the multivariate relationship between fear-of-computers and fear-of-statistics item sets rather than relying on isolated pairwise correlations.',tags:['CCA','CANONICAL VARIATES','MULTIVARIATE','PSYCHOMETRICS']},
    spatial:{title:'Bloemfontein Schools Spatial Analysis',area:'SPATIAL',kpi:'125',kpiLabel:'SCHOOLS',metrics:[['SD','0.0727','Reported standard distance'],['Ellipse','142.99°','Directional orientation'],['Buffer','1 km','Walking-accessibility view']],bars:[['Clustering evidence',92],['Spatial diagnostics',89],['GIS communication',94]],note:'The spatial project combines point-pattern and GIS methods to investigate clustering, dispersion, density and accessibility of schools across Bloemfontein.',tags:['QUADRAT','RIPLEY K','KDE','VORONOI','MORAN I','GIS']},
    hotelling:{title:"Honours Hotelling's T² Research",area:'SIMULATION',kpi:'ARL',kpiLabel:'PERFORMANCE FOCUS',metrics:[['ρ','0 / 0.3 / 0.7','Dependence levels'],['n','1 / 3 / 5','Sample-size scenarios'],['Shift','0 / 0.5 / 1 / 1.5','Mean-shift scenarios']],bars:[['Simulation design',96],['Dependence scenarios',94],['Control monitoring',91]],note:'The honours research investigates multivariate control-chart performance under independence, autocorrelation, cross-correlation and combined dependence.',tags:['HOTELLING T²','ARL','SDRL','SIMULATION','CONTROL CHARTS']},
    time:{title:'Financial Time-Series & Cointegration',area:'TIME SERIES',kpi:'ARIMA',kpiLabel:'MODELLING FAMILY',metrics:[['Markets','Bitcoin / Brent / WTI','Financial series'],['Focus','Cointegration','Long-run relationships'],['Volatility','GARCH','Conditional variance']],bars:[['Time dependence',91],['Model diagnostics',86],['Financial interpretation',83]],note:'The financial work combines time-series reasoning with cointegration and volatility modelling to study dependence across market series.',tags:['ARIMA','COINTEGRATION','GARCH','VOLATILITY']},
    software:{title:'Tutoring & Virtual Classroom Platform',area:'SOFTWARE',kpi:'3',kpiLabel:'USER ROLES',metrics:[['Roles','Student / Tutor / Admin','Role-based access'],['Tracking','Progress + grades','Private dashboards'],['Realtime','Raise Hand / Help','Classroom assistance']],bars:[['Product architecture',92],['Education workflow',95],['User experience',88]],note:'The platform work translates educational workflows into a role-based web application with private student views, tutor controls, grading, progress tracking and assistance flows.',tags:['HTML','CSS','JAVASCRIPT','REACT','FLASK','SOCKET.IO','SQL']}
  };
  const root=document.querySelector('#phase41-evidence'); if(!root)return;
  const tabs=[...root.querySelectorAll('.phase41-tab')], panel=root.querySelector('#phase41-panel');
  function render(key){const d=data[key]||data.pca; tabs.forEach(t=>{const on=t.dataset.key===key;t.classList.toggle('active',on);t.setAttribute('aria-selected',on)});panel.innerHTML=`<div class="phase41-panel-head"><div><small class="phase41-label">${d.area}</small><h3>${d.title}</h3></div><div><div class="phase41-kpi">${d.kpi}</div><small class="phase41-label">${d.kpiLabel}</small></div></div><div class="phase41-metrics">${d.metrics.map(m=>`<div class="phase41-metric"><strong>${m[1]}</strong><span>${m[0]} · ${m[2]}</span></div>`).join('')}</div><div class="phase41-bars">${d.bars.map(b=>`<div class="phase41-bar-row"><span>${b[0]}</span><div class="phase41-bar"><i style="--w:${b[1]}%"></i></div><b>${b[1]}%</b></div>`).join('')}</div><div class="phase41-note">${d.note}</div><div class="phase41-legend">${d.tags.map(x=>`<span>${x}</span>`).join('')}</div>`}
  tabs.forEach(t=>t.addEventListener('click',()=>render(t.dataset.key))); render('pca');
})();

;
(()=>{
const root=document.querySelector('#phase42-visualisations'); if(!root)return;
const scale=[['Big Five FA',2800],['CCA',2571],['Schools',125],['PCA vars',23],['CCA items',15],['Big Five items',25]];
const scenarios=[['ρ = 0',1,1,1],['ρ = 0.3',.75,.75,.75],['ρ = 0.7',.5,.5,.5]];
function scaleChart(){const max=2800,w=760,h=240,p=45,barW=80,gap=42;return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Confirmed project scale comparison"><line x1="${p}" y1="${h-p}" x2="${w-p}" y2="${h-p}" stroke="currentColor" opacity=".25"/>${scale.map((d,i)=>{let bh=Math.max(8,(h-p*1.5)*d[1]/max);let x=p+i*(barW+gap);return `<g><rect x="${x}" y="${h-p-bh}" width="${barW}" height="${bh}" rx="10" fill="currentColor" opacity="${i<2?.65:.3}"/><text x="${x+barW/2}" y="${h-p-bh-10}" text-anchor="middle" font-size="12" fill="currentColor">${d[1].toLocaleString()}</text><text x="${x+barW/2}" y="${h-12}" text-anchor="middle" font-size="10" fill="currentColor" opacity=".6">${d[0]}</text></g>`}).join('')}</svg>`}
function spatialChart(){const cx=380,cy=125,r=88,a=(142.99-90)*Math.PI/180,x=cx+r*Math.cos(a),y=cy+r*Math.sin(a);return `<svg viewBox="0 0 760 250" role="img" aria-label="Directional ellipse orientation 142.99 degrees"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" opacity=".12"/><ellipse cx="${cx}" cy="${cy}" rx="130" ry="55" transform="rotate(142.99 ${cx} ${cy})" fill="none" stroke="currentColor" opacity=".5"/><line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="currentColor" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="7" fill="currentColor"/><text x="${cx+15}" y="${cy-15}" font-size="13" fill="currentColor">125 schools</text><text x="${cx+15}" y="${cy+8}" font-size="12" fill="currentColor" opacity=".65">orientation 142.99°</text><text x="25" y="30" font-size="11" fill="currentColor" opacity=".55">REPORTED SPATIAL SIGNAL</text></svg>`}
function scenarioTable(){return `<div class="phase42-mobile-scroll"><table class="phase42-table"><thead><tr><th>Dependence</th><th>n = 1</th><th>n = 3</th><th>n = 5</th></tr></thead><tbody>${scenarios.map(s=>`<tr><td>${s[0]}</td>${s.slice(1).map(v=>`<td><span class="phase42-cell" style="--a:${Math.round(v*100)}"></span></td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="phase42-note">This is the confirmed simulation design space, not a fabricated ARL result. The portfolio shows the scenarios you designed; numerical ARL/SDRL outputs should be populated from the final simulation run.</p>`}
root.querySelector('#scale-chart').innerHTML=scaleChart();root.querySelector('#spatial-chart').innerHTML=spatialChart();root.querySelector('#scenario-chart').innerHTML=scenarioTable();
})();

;
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
        ['Netcare + PPC Econometrics', 'Cointegration, ECM and GJR-GARCH with verified report evidence', 'projects/netcare-ppc-cointegration-garch.html'],
        ['EDA + Data Workflows', 'Descriptive statistics, transformations and visual exploration', 'projects/eda-data-analysis.html']
      ],
      match: ['pca.html','canonical-correlation.html','time-series-forecasting.html','financial-volatility.html','netcare-ppc-cointegration-garch.html','eda-data-analysis.html','regression-modelling.html','cointegration-bitcoin.html']
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
      match: ['bloemfontein-schools.html','hotelling-t2.html','hotelling-simulation.html','canonical-correlation.html','factor-analysis.html','spatial-analysis.html','cointegration-bitcoin.html','netcare-ppc-cointegration-garch.html']
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

;
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
      projects:[['PCA / Dimensionality Reduction','23-variable multivariate workflow','projects/pca.html'],['Netcare + PPC Econometrics','Cointegration, ECM and GJR-GARCH evidence','projects/netcare-ppc-cointegration-garch.html'],['EDA + Data Workflows','From descriptive analysis to interpretable evidence','projects/eda-data-analysis.html']]
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
    catch (_) { els.status.textContent='COPY BLOCKED: USE THE URL IN YOUR ADDRESS BAR.'; }
    setTimeout(()=>{els.status.textContent='';},2600);
  });

  const observer=new MutationObserver(mutations=>{
    if(mutations.some(m=>m.attributeName==='data-career-lens')) render();
  });
  observer.observe(document.documentElement,{attributes:true});
  render();
})();

;
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
      const docs = c.docs ? `<a href="${c.docs}" target="_blank" rel="noreferrer">README ↗</a>` : '';
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
        <div class="phase47-repo-actions"><a href="${source}" target="_blank" rel="noreferrer">VIEW SOURCE ↗</a>${docs}${caseLink}</div>
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

;
(() => {
  document.querySelectorAll('a[target="_blank"]').forEach(a => {
    const rel = new Set((a.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
    rel.add('noopener'); rel.add('noreferrer'); a.setAttribute('rel',[...rel].join(' '));
  });
  document.querySelectorAll('footer span').forEach(el => {
    if (/^©\s*\d{4}\s+Vivian Sibanda$/.test(el.textContent.trim())) el.textContent = `© ${new Date().getFullYear()} Vivian Sibanda`;
  });
})();
;
(()=>{
  'use strict';
  const form=document.getElementById('form');
  const note=document.getElementById('formnote');
  const submit=document.getElementById('phase49Submit');
  const whatsapp=document.getElementById('phase49Whatsapp');
  const email='viviansb3@gmail.com';
  const phone='27621616889';

  const values=()=>{
    if(!form) return {};
    const data=new FormData(form);
    return {
      name:String(data.get('name')||'').trim(),
      email:String(data.get('email')||'').trim(),
      intent:String(data.get('intent')||'').trim(),
      subject:String(data.get('subject')||'').trim(),
      message:String(data.get('message')||'').trim()
    };
  };
  const messageText=v=>`Hello Vivian,\n\nName: ${v.name}\nEmail: ${v.email}\nEnquiry: ${v.intent}\nSubject: ${v.subject}\n\n${v.message}`;
  const setState=(state,text)=>{ if(form) form.dataset.state=state||''; if(note) note.textContent=text; };
  const valid=()=>{
    if(!form) return false;
    if(form.checkValidity()) return true;
    form.reportValidity();
    setState('error','Please complete the required fields before sending.');
    return false;
  };
  const encodedForm=()=>{
    const fd=new FormData(form);
    fd.set('form-name','portfolio-contact');
    return new URLSearchParams(fd).toString();
  };
  const openEmail=v=>{
    const subject=encodeURIComponent(v.subject || 'Portfolio enquiry');
    const body=encodeURIComponent(messageText(v));
    location.href=`mailto:${email}?subject=${subject}&body=${body}`;
  };
  const openWhatsapp=()=>{
    if(!valid()) return;
    const v=values();
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(messageText(v))}`,'_blank','noopener,noreferrer');
    setState('','WhatsApp opened with your message prefilled.');
    track('Contact WhatsApp',{intent:v.intent||'unspecified'});
  };

  async function submitContact(event){
    event.preventDefault();
    if(!valid()) return;
    const v=values();
    setState('sending','Sending…');
    if(submit) submit.textContent='SENDING…';

    // Netlify Forms accepts this POST when deployed on Netlify. Other static hosts
    // typically reject it, at which point the experience falls back to email.
    if(location.protocol==='http:' || location.protocol==='https:'){
      try{
        const response=await fetch('/',{
          method:'POST',
          headers:{'Content-Type':'application/x-www-form-urlencoded'},
          body:encodedForm()
        });
        const netlifyConfirmed=/\.netlify\.app$/i.test(location.hostname) || response.headers.has('x-nf-request-id');
        if(response.ok && netlifyConfirmed){
          form.reset();
          setState('success','Message sent successfully. Thank you: Vivian can reply using the email you provided.');
          track('Contact Form Sent',{intent:v.intent||'unspecified'});
          if(submit) submit.textContent='MESSAGE SENT ✓';
          setTimeout(()=>{if(submit) submit.textContent='SEND MESSAGE →';},2600);
          return;
        }
      }catch(_){/* fall through to email */}
    }
    setState('','Your host does not provide form capture, so a prefilled email draft is opening instead.');
    track('Contact Email Fallback',{intent:v.intent||'unspecified'});
    openEmail(v);
    if(submit) submit.textContent='SEND MESSAGE →';
  }

  // Privacy-safe event hooks. Nothing is transmitted unless the owner later
  // installs/configures Plausible and exposes window.plausible.
  function track(name,props={}){
    window.dispatchEvent(new CustomEvent('portfolio:interaction',{detail:{name,props}}));
    if(typeof window.plausible==='function') window.plausible(name,{props});
  }

  if(form) form.addEventListener('submit',submitContact);
  if(whatsapp) whatsapp.addEventListener('click',openWhatsapp);

  document.addEventListener('click',event=>{
    const target=event.target.closest('a,button');
    if(!target) return;
    const explicit=target.dataset.track;
    if(explicit){ track('CTA Click',{target:explicit}); return; }
    const href=target.getAttribute('href')||'';
    if(href.includes('github.com/')) track('GitHub Click');
    else if(href.includes('linkedin.com/')) track('LinkedIn Click');
    else if(href.includes('vivian-sibanda-cv.pdf')) track('CV Click');
    else if(href.startsWith('mailto:')) track('Email Click');
    else if(href.startsWith('tel:')) track('Phone Click');
    else if(href.includes('wa.me/')) track('WhatsApp Click');
    else if(href.startsWith('projects/')) track('Project Open',{project:href});
  },{passive:true});
})();

;
(() => {
  const root = document.querySelector('[data-phase51-deployment]');
  if (!root) return;
  const set = (key, value) => {
    const el = root.querySelector(`[data-phase51-${key}]`);
    if (el) el.textContent = value;
  };
  fetch('deployment-meta.json', { cache: 'no-store' })
    .then(response => response.ok ? response.json() : Promise.reject(new Error('metadata unavailable')))
    .then(meta => {
      const state = meta.canonicalStatus === 'resolved' ? 'resolved' : 'pending';
      root.querySelector('[data-phase51-canonical-card]')?.setAttribute('data-state', state);
      set('provider', String(meta.provider || 'static').toUpperCase());
      set('environment', String(meta.environment || 'production').toUpperCase());
      set('canonical', meta.canonicalBaseUrl ? new URL(meta.canonicalBaseUrl).host : 'ASSIGNED AT DEPLOY');
      set('indexing', String(meta.indexing || 'controlled').toUpperCase());
    })
    .catch(() => {
      set('provider', 'STATIC');
      set('environment', 'LOCAL / PREVIEW');
      set('canonical', 'ASSIGNED AT DEPLOY');
      set('indexing', 'CONTROLLED');
    });
})();

;
(() => {
  const root = document.querySelector('[data-phase52-launch]');
  if (!root) return;
  const put = (key, value) => {
    const el = root.querySelector(`[data-phase52-${key}]`);
    if (el) el.textContent = value;
  };
  const setState = (key, state) => root.querySelector(`[data-phase52-${key}-card]`)?.setAttribute('data-state', state);

  Promise.all([
    fetch('release-manifest.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject(new Error('manifest unavailable'))),
    fetch('deployment-meta.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.resolve({}))
  ]).then(([release, deploy]) => {
    put('release', release.releaseId || 'VERIFIED BUILD');
    put('files', `${release.files || 0} FILES`);
    put('fingerprint', (release.fingerprint || '').slice(0, 12).toUpperCase() || 'VERIFIED');
    put('mode', deploy.production ? 'LIVE READY' : 'LAUNCH CANDIDATE');
    setState('release', 'verified');
    setState('files', 'verified');
    setState('fingerprint', 'verified');
    setState('mode', deploy.production ? 'verified' : 'pending');
  }).catch(() => {
    put('release', 'BUILD PENDING');
    put('files', 'VERIFY AT BUILD');
    put('fingerprint', 'SHA-256');
    put('mode', 'LAUNCH CANDIDATE');
    ['release','files','fingerprint','mode'].forEach(key => setState(key, 'pending'));
  });
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
