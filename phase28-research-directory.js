/* Phase 28 — research directory search/filter */
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
