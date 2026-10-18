/* Phase 30 — lightweight interface telemetry */
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
