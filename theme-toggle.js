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
