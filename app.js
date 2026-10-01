/* Ishika Masta portfolio — motion layer (motion.dev / Motion One) */
(function () {
  "use strict";

  var preloader = document.getElementById("preloader");

  // Graceful fallback: if the animation lib failed to load, just show the page.
  if (!window.Motion) {
    if (preloader) preloader.style.display = "none";
    document.getElementById("nav").style.transform = "none";
    return;
  }

  var animate = Motion.animate;
  var inView = Motion.inView;
  var scroll = Motion.scroll;
  var stagger = Motion.stagger;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- preloader ---------- */
  var preName = document.getElementById("preName");
  var letters = preName.textContent.split("");
  preName.innerHTML = letters
    .map(function (ch) { return '<span>' + (ch === " " ? "&nbsp;" : ch) + "</span>"; })
    .join("");

  function heroIntro() {
    animate("#nav", { y: ["-100%", "0%"] }, { duration: 0.8, easing: [0.22, 1, 0.36, 1] });
    animate(
      "[data-hero]",
      { opacity: [0, 1], y: [36, 0] },
      { duration: 0.9, delay: stagger(0.12), easing: [0.22, 1, 0.36, 1] }
    );
  }

  if (reduceMotion) {
    preloader.style.display = "none";
    heroIntro();
  } else {
    animate("#preloader .pre-name span", { opacity: [0, 1], y: [24, 0] },
      { duration: 0.5, delay: stagger(0.035), easing: "ease-out" });
    animate("#preloader .pre-sub", { opacity: [0, 1] }, { duration: 0.6, delay: 0.7 });
    animate("#preloader", { y: ["0%", "-100%"] },
      { duration: 0.9, delay: 1.5, easing: [0.76, 0, 0.24, 1],
        onComplete: function () { preloader.style.display = "none"; } });
    setTimeout(heroIntro, 1600);
  }

  /* ---------- scroll reveals ---------- */
  document.querySelectorAll(".reveal").forEach(function (el) {
    if (reduceMotion) return;
    animate(el, { opacity: 0, y: 40 }, { duration: 0 });
    inView(el, function () {
      animate(el, { opacity: 1, y: 0 },
        { duration: 0.9, easing: [0.22, 1, 0.36, 1] });
    }, { amount: 0.2 });
  });

  /* ---------- animated counters ---------- */
  document.querySelectorAll(".counter").forEach(function (el) {
    var target = parseFloat(el.dataset.target);
    var decimals = parseInt(el.dataset.decimals || "0", 10);
    var suffix = el.dataset.suffix || "";
    var done = false;
    inView(el, function () {
      if (done) return; done = true;
      if (reduceMotion) { el.textContent = target.toFixed(decimals) + suffix; return; }
      animate(0, target, {
        duration: 1.8, easing: [0.16, 1, 0.3, 1],
        onUpdate: function (v) { el.textContent = v.toFixed(decimals) + suffix; }
      });
    }, { amount: 0.6 });
  });

  /* ---------- scroll progress bar ---------- */
  var bar = document.getElementById("progressBar");
  scroll(function (info) { bar.style.transform = "scaleX(" + info.y.progress + ")"; });

  /* ---------- parallax orbs ---------- */
  if (!reduceMotion) {
    scroll(function (info) {
      var p = info.y.progress;
      document.querySelector(".orb-a").style.transform = "translateY(" + p * 220 + "px)";
      document.querySelector(".orb-b").style.transform = "translateY(" + -p * 160 + "px)";
    });
  }

  /* ---------- magnetic buttons ---------- */
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".magnetic").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        animate(btn, { x: x * 0.25, y: y * 0.25 }, { duration: 0.3, easing: "ease-out" });
      });
      btn.addEventListener("mouseleave", function () {
        animate(btn, { x: 0, y: 0 }, { duration: 0.5, easing: [0.22, 1, 0.36, 1] });
      });
    });

    /* ---------- 3D tilt on proof cards ---------- */
    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
        animate(card, { rotateX: rx, rotateY: ry, scale: 1.015 },
          { duration: 0.4, easing: "ease-out" });
      });
      card.addEventListener("mouseleave", function () {
        animate(card, { rotateX: 0, rotateY: 0, scale: 1 },
          { duration: 0.7, easing: [0.22, 1, 0.36, 1] });
      });
    });

    /* ---------- cursor glow on service cards ---------- */
    document.querySelectorAll(".svc").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---------- nav shadow on scroll ---------- */
  var nav = document.getElementById("nav");
  scroll(function (info) {
    nav.style.boxShadow = info.y.progress > 0.02
      ? "0 8px 30px rgba(0,0,0,0.45)" : "none";
  });
})();
