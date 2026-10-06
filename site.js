(function () {
  // Theme toggle (light by default)
  var root = document.documentElement;
  var toggle = document.getElementById("themeToggle");
  function label() {
    var dark = root.getAttribute("data-theme") === "dark";
    if (toggle) toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("vt-theme", next); } catch (e) {}
      label();
    });
  }
  label();

  // Copy buttons
  document.querySelectorAll(".copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var el = document.getElementById(btn.getAttribute("data-copy"));
      if (!el) return;
      var text = el.textContent.trim();
      var done = function () { btn.textContent = "Copied"; setTimeout(function () { btn.textContent = "Copy"; }, 1600); };
      var fallback = function () {
        var r = document.createRange(); r.selectNodeContents(el);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        btn.textContent = "Selected. Press Ctrl+C";
      };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, fallback);
        } else { fallback(); }
      } catch (e) { fallback(); }
    });
  });

  // Publication filters
  var list = document.getElementById("publist");
  if (!list) return;
  var items = Array.prototype.slice.call(list.children);
  var chips = document.querySelectorAll(".chip");
  var search = document.getElementById("pubsearch");
  var count = document.getElementById("pubcount");
  var empty = document.getElementById("pubempty");
  var kind = "all";
  items.forEach(function (li) { li.dataset.text = li.textContent.toLowerCase(); });

  function apply() {
    var q = (search.value || "").trim().toLowerCase();
    var n = 0;
    items.forEach(function (li) {
      var show = (kind === "all" || li.dataset.kind === kind) && (!q || li.dataset.text.indexOf(q) !== -1);
      li.hidden = !show;
      if (show) n++;
    });
    count.textContent = "Showing " + n + (n === 1 ? " publication" : " publications");
    empty.hidden = n !== 0;
  }
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      kind = c.getAttribute("data-filter");
      chips.forEach(function (o) { o.setAttribute("aria-pressed", o === c ? "true" : "false"); });
      apply();
    });
  });
  search.addEventListener("input", apply);
  apply();
})();
