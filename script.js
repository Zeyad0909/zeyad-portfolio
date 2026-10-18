(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");

  /* ------------------------------------------------------------------
     PROJECT LINKS: add real URLs here when they exist. Leave a value as
     an empty string and the card shows "Repository coming soon".
     ------------------------------------------------------------------ */
  var PROJECT_LINKS = {
    blog:     { repo: "", demo: "" },
    iti:      { repo: "", demo: "" },
    platform: { repo: "", demo: "" }
  };

  var ARROW = '<svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg>';
  function linkEl(url, label) {
    var a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.innerHTML = label + " " + ARROW;
    return a;
  }
  document.querySelectorAll("[data-project]").forEach(function (box) {
    var cfg = PROJECT_LINKS[box.getAttribute("data-project")];
    if (!cfg || (!cfg.repo && !cfg.demo)) return;
    box.textContent = "";
    if (cfg.repo) box.appendChild(linkEl(cfg.repo, "Repository"));
    else { var s = document.createElement("span"); s.className = "soon"; s.textContent = "Repository coming soon"; box.appendChild(s); }
    if (cfg.demo) box.appendChild(linkEl(cfg.demo, "Live demo"));
  });

  /* Footer year */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* Mobile menu */
  var btn = document.querySelector(".menu-btn");
  var nav = document.getElementById("site-nav");
  function setMenu(open) {
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    nav.classList.toggle("open", open);
  }
  btn.addEventListener("click", function () { setMenu(btn.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") { setMenu(false); btn.focus(); }
  });
  window.addEventListener("resize", function () { if (window.innerWidth > 820) setMenu(false); });

  /* Active nav link */
  var links = Array.prototype.slice.call(nav.querySelectorAll("a"));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          var on = a.getAttribute("href") === "#" + en.target.id;
          a.classList.toggle("active", on);
          if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { if (s) spy.observe(s); });

    /* Scroll reveal */
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var items = document.querySelectorAll(".reveal");
    if (reduce) {
      items.forEach(function (el) { el.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      items.forEach(function (el) { io.observe(el); });
    }
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* Copy email (clipboard can be refused, so fall back to selecting the text) */
  var copyBtn = document.getElementById("copy-email");
  var emailText = document.getElementById("email-text");
  var label = document.getElementById("copy-label");
  var status = document.getElementById("copy-status");
  function flash(msg) {
    label.textContent = msg;
    status.textContent = msg === "Copied" ? "Email address copied" : "Email address selected";
    copyBtn.classList.toggle("done", msg === "Copied");
    setTimeout(function () { label.textContent = "Copy"; copyBtn.classList.remove("done"); }, 2000);
  }
  function selectText() {
    var r = document.createRange();
    r.selectNodeContents(emailText);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
    flash("Selected");
  }
  copyBtn.addEventListener("click", function () {
    try {
      navigator.clipboard.writeText("aymanzyad3@gmail.com").then(function () { flash("Copied"); }, selectText);
    } catch (err) { selectText(); }
  });
})();
