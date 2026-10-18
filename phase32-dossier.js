/* Phase 32 — research dossier tabs */
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
