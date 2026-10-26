/* WTF — site behaviour: header state, mobile nav, scroll reveal, invitation form. */
(function () {
  "use strict";

  /* ---- Form delivery ------------------------------------------------------
     Set FORM_ENDPOINT to a form service URL (e.g. https://formspree.io/f/xxxx)
     to receive requests directly. Left empty, the form opens the visitor's
     mail app addressed to CONTACT_EMAIL instead. */
  var FORM_ENDPOINT = "";
  var CONTACT_EMAIL = "hello@tayloredfunctions.com";

  document.documentElement.classList.add("js");

  // Header gains a solid background once the page scrolls.
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile navigation.
  var menuBtn = document.querySelector(".menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        document.body.classList.remove("nav-open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.focus();
      }
    });
  }

  // Reveal on scroll.
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // Footer year.
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Invitation form.
  var form = document.querySelector("#invite-form");
  if (form) {
    // Preselect the interest from ?interest=hosting or the #nominate link.
    var interest = new URLSearchParams(window.location.search).get("interest") ||
      (window.location.hash === "#nominate" ? "nominate" : "");
    var preset = interest && form.querySelector("#i-" + interest.replace(/[^a-z]/g, ""));
    if (preset) preset.checked = true;

    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var data = new FormData(form);

      if (FORM_ENDPOINT) {
        fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(function (res) {
            if (!res.ok) throw new Error(res.statusText);
            form.reset();
            show("Thank you. Your request is with us, and we'll be in touch personally within a week.");
          })
          .catch(function () {
            show("Something went wrong sending that. Please email " + CONTACT_EMAIL + " directly.");
          });
        return;
      }

      var lines = [];
      data.forEach(function (value, key) { if (value) lines.push(key + ": " + value); });
      var subject = "Invitation request: " + (data.get("Name") || "");
      window.location.href = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n\n"));
      show("Your mail app should open with the request filled in. Press send and it reaches us.");
    });

    function show(msg) {
      status.textContent = msg;
      status.classList.add("show");
    }
  }
})();
