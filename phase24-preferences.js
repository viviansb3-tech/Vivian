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
