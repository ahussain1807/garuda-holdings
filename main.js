/* Garuda Holdings, Inc. — site behaviour */

/* ------------------------------------------------------------------
   CONFIGURATION POINT: ENQUIRY FORM DELIVERY
   ------------------------------------------------------------------
   Leave contactEndpoint empty ("") and the public site shows
   "Contact details will be available here soon." and NO form.

   To enable the form, set contactEndpoint to a real HTTPS endpoint that
   accepts a JSON POST and returns a 2xx status when it has received the
   message (for example a Formspree form URL, or your own serverless
   function). The success message only appears when the endpoint returns
   a 2xx response. Do not put API keys or secrets in this file.
   Before going live, publish a privacy notice that accurately describes
   how submitted enquiries are handled.
------------------------------------------------------------------ */
var CONFIG = {
  contactEndpoint: ""
};

(function () {
  "use strict";
  window.__garudaReady = true;

  var d = document, root = d.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  /* Year */
  var yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* Entrance reveals */
  var items = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  /* Header shadow */
  var header = $("#site-header");
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* Mobile menu */
  var btn = $("#menu-btn"), nav = $("#site-nav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  btn.addEventListener("click", function () { setMenu(btn.getAttribute("aria-expanded") !== "true"); });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  d.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") { setMenu(false); btn.focus(); }
  });
  window.matchMedia("(min-width: 861px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });

  /* Active nav link */
  var links = $$("nav a[href^='#']", nav);
  if ("IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["about", "investment-focus", "approach", "contact"].forEach(function (id) { var s = d.getElementById(id); if (s) so.observe(s); });
  }

  /* Emblem: very light pointer parallax (fine pointers only) */
  var em = $("#emblem");
  if (em && !reduce && window.matchMedia("(pointer: fine)").matches) {
    var img = $("img", em), hero = $(".hero");
    hero.addEventListener("mousemove", function (e) {
      var r = em.getBoundingClientRect();
      var x = (e.clientX - (r.left + r.width / 2)) / r.width, y = (e.clientY - (r.top + r.height / 2)) / r.height;
      img.style.setProperty("--px", (x * -12).toFixed(1) + "px");
      img.style.setProperty("--py", (y * -8).toFixed(1) + "px");
    });
    hero.addEventListener("mouseleave", function () { img.style.setProperty("--px", "0px"); img.style.setProperty("--py", "0px"); });
  }

  /* Enquiry form: only mounted when a delivery endpoint is configured */
  var endpoint = (CONFIG.contactEndpoint || "").trim();
  var tpl = $("#enquiry-form-template"), mount = $("#contact-form-mount");
  if (endpoint && tpl && mount) {
    var soon = $("#contact-soon"); if (soon) soon.hidden = true;
    mount.appendChild(tpl.content.cloneNode(true));
    var form = $("#enquiry-form"), status = $("#form-status"), submit = $("button[type=submit]", form);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "status"; status.textContent = "";
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      if (data.website) { return; } /* honeypot: bots fill this in */
      delete data.website;

      submit.disabled = true;
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        form.reset();
        status.className = "status ok";
        status.textContent = "Thank you for contacting Garuda Holdings. Your enquiry has been received.";
      }).catch(function () {
        status.className = "status err";
        status.textContent = "Your enquiry could not be sent. Please try again.";
      }).then(function () { submit.disabled = false; });
    });
  }
})();
