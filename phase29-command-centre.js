/* Phase 29 — keyboard command centre */
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
