(function(){
  'use strict';

  var root=document.documentElement;
  var btn=document.getElementById('project-theme-toggle');
  var label=btn && btn.querySelector('[data-theme-label]');
  var storageKey='vivian-theme';

  var projects=[
    {file:'pca.html',title:'Principal Component Analysis',group:'Multivariate'},
    {file:'factor-analysis.html',title:'Big Five Factor Analysis',group:'Multivariate'},
    {file:'canonical-correlation.html',title:'Canonical Correlation Analysis',group:'Multivariate'},
    {file:'hotelling-t2.html',title:"Hotelling's T² Honours Research",group:'Research'},
    {file:'hotelling-simulation.html',title:"Hotelling's T² Simulation",group:'Simulation'},
    {file:'spatial-analysis.html',title:'Geospatial Analysis',group:'Spatial'},
    {file:'bloemfontein-schools.html',title:'Bloemfontein Schools',group:'Spatial'},
    {file:'time-series-forecasting.html',title:'Time-Series Forecasting',group:'Time Series'},
    {file:'financial-volatility.html',title:'Financial Volatility Modelling',group:'Time Series'},
    {file:'netcare-ppc-cointegration-garch.html',title:'Netcare + PPC Cointegration & Volatility',group:'Time Series'},
    {file:'cointegration-bitcoin.html',title:'Cointegration & Bitcoin',group:'Time Series'},
    {file:'regression-modelling.html',title:'Regression Modelling',group:'Statistics'},
    {file:'eda-data-analysis.html',title:'EDA & Data Workflows',group:'Data Science'},
    {file:'sampling-survey-analysis.html',title:'Sampling & Survey Analysis',group:'Statistics'},
    {file:'tutoring-platform.html',title:'Tutoring Platform',group:'Software'},
    {file:'ridgefield-website.html',title:'Ridgefield Website',group:'Software'}
  ];

  function getSaved(){try{return localStorage.getItem(storageKey);}catch(e){return null;}}
  function save(v){try{localStorage.setItem(storageKey,v);}catch(e){}}
  function apply(theme){
    theme=theme==='light'?'light':'dark';
    root.setAttribute('data-theme',theme);
    root.style.colorScheme=theme;
    var themeMeta=document.querySelector('meta[name="theme-color"]');
    if(themeMeta) themeMeta.setAttribute('content',theme==='light'?'#f4f7fb':'#05070b');
    if(btn){
      var isLight=theme==='light';
      btn.setAttribute('aria-pressed',String(isLight));
      btn.setAttribute('aria-label',isLight?'Switch to dark mode':'Switch to light mode');
      if(label) label.textContent=isLight?'DARK':'LIGHT';
    }
    save(theme);
  }

  function currentFile(){
    var path=(location.pathname||'').split('/').filter(Boolean).pop()||'';
    try{return decodeURIComponent(path);}catch(e){return path;}
  }

  function el(tag,className,text){
    var node=document.createElement(tag);
    if(className) node.className=className;
    if(text!=null) node.textContent=text;
    return node;
  }

  function createLink(href,className,text){
    var a=el('a',className,text);
    a.href=href;
    return a;
  }

  function installProjectExperience(){
    var file=currentFile();
    var index=projects.findIndex(function(project){return project.file===file;});
    if(index<0) return;

    var current=projects[index];
    var prev=projects[index-1]||null;
    var next=projects[index+1]||null;
    var main=document.querySelector('main');
    var end=document.querySelector('.project-page-end');
    var navBadge=document.querySelector('.project-nav__brand b');

    document.body.setAttribute('data-project-index',String(index+1));
    document.body.setAttribute('data-project-group',current.group.toLowerCase().replace(/\s+/g,'-'));

    if(navBadge) navBadge.textContent='PROJECT '+String(index+1).padStart(2,'0')+' / '+String(projects.length).padStart(2,'0');

    if(main && !main.querySelector('.project-context')){
      var context=el('div','project-context');
      context.setAttribute('aria-label','Breadcrumb');
      var trail=el('div','project-context__trail');
      trail.appendChild(createLink('../index.html','project-context__home','PORTFOLIO'));
      trail.appendChild(el('span','project-context__sep','/'));
      trail.appendChild(createLink('../projects.html','project-context__home','WORK'));
      trail.appendChild(el('span','project-context__sep','/'));
      var group=el('span','project-context__group',current.group.toUpperCase());
      group.setAttribute('aria-current','page');
      trail.appendChild(group);
      var count=el('span','project-context__count',String(index+1).padStart(2,'0')+' / '+String(projects.length).padStart(2,'0'));
      context.appendChild(trail);
      context.appendChild(count);
      main.insertBefore(context,main.firstChild);
    }

    if(end){
      end.innerHTML='';
      end.classList.add('project-sequence');
      var meta=el('div','project-sequence__meta');
      meta.appendChild(el('span','project-sequence__eyebrow','CONTINUE EXPLORING'));
      meta.appendChild(el('strong','project-sequence__current',current.title));
      meta.appendChild(el('small','project-sequence__group',current.group+' · '+String(index+1)+' of '+String(projects.length)));
      var links=el('div','project-sequence__links');
      if(prev){
        var prevLink=createLink(prev.file,'project-sequence__link project-sequence__link--prev','');
        prevLink.setAttribute('aria-label','Previous project: '+prev.title);
        prevLink.innerHTML='<span>← PREVIOUS</span><strong>'+escapeHtml(prev.title)+'</strong>';
        links.appendChild(prevLink);
      }else{
        links.appendChild(createLink('../projects.html','project-sequence__link project-sequence__link--prev','← ALL WORK'));
      }
      if(next){
        var nextLink=createLink(next.file,'project-sequence__link project-sequence__link--next','');
        nextLink.setAttribute('aria-label','Next project: '+next.title);
        nextLink.innerHTML='<span>NEXT →</span><strong>'+escapeHtml(next.title)+'</strong>';
        links.appendChild(nextLink);
      }else{
        links.appendChild(createLink('../index.html#contact','project-sequence__link project-sequence__link--next','CONTACT →'));
      }
      end.appendChild(meta);
      end.appendChild(links);
    }

    var progress=el('div','project-scroll-progress');
    progress.setAttribute('aria-hidden','true');
    var progressBar=el('i','project-scroll-progress__bar');
    progress.appendChild(progressBar);
    document.body.appendChild(progress);

    var ticking=false;
    function updateProgress(){
      var max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
      var value=Math.min(1,Math.max(0,window.scrollY/max));
      progressBar.style.transform='scaleX('+value+')';
      ticking=false;
    }
    function requestProgress(){
      if(!ticking){ticking=true;requestAnimationFrame(updateProgress);}
    }
    addEventListener('scroll',requestProgress,{passive:true});
    addEventListener('resize',requestProgress,{passive:true});
    updateProgress();
  }

  function escapeHtml(value){
    return String(value).replace(/[&<>'"]/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch];
    });
  }

  apply(getSaved() || root.getAttribute('data-theme') || 'dark');
  if(btn){btn.addEventListener('click',function(){apply(root.getAttribute('data-theme')==='light'?'dark':'light');});}

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',installProjectExperience,{once:true});
  else installProjectExperience();
})();
