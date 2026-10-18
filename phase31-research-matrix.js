/* Phase 31 — research matrix filters */
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
