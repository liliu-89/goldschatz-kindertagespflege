/**
 * Kindertagespflege Goldschatz – script.js
 * Vanilla JS · keine externen Abhängigkeiten · 2026
 */
"use strict";

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* === Header Scroll Shadow ======================== */
function initHeaderScroll() {
  const header = $("#site-header");
  if (!header) return;
  const sentinel = document.createElement("div");
  sentinel.style.cssText = "position:absolute;top:120px;height:1px;width:1px;pointer-events:none";
  document.body.prepend(sentinel);
  new IntersectionObserver(
    ([e]) => header.classList.toggle("scrolled", !e.isIntersecting),
    { threshold: 0 }
  ).observe(sentinel);
}

/* === Mobile Navigation =========================== */
function initMobileNav() {
  const btn     = $("#mobile-menu-btn");
  const overlay = $("#mobile-overlay");
  const drawer  = $("#mobile-drawer");
  const closeBtn = $("#drawer-close");
  if (!btn || !drawer || !overlay) return;

function open() {
  btn.classList.add("open");
  btn.setAttribute("aria-expanded", "true");

  // Drawer einfahren: translate-x-full entfernen, translate-x-0 setzen
  drawer.classList.remove("translate-x-full");
  drawer.classList.add("translate-x-0");
  drawer.setAttribute("aria-hidden", "false");

  // Overlay: erst display:none entfernen, dann in nächstem Frame einblenden
  overlay.classList.remove("hidden");
  overlay.classList.remove("opacity-100");
  overlay.classList.add("opacity-0");

  document.body.style.overflow = "hidden";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.remove("opacity-0");
      overlay.classList.add("opacity-100");
    });
    closeBtn?.focus();
  });
}

function close() {
  btn.classList.remove("open");
  btn.setAttribute("aria-expanded", "false");

  // Drawer ausfahren: translate-x-0 entfernen, translate-x-full setzen
  drawer.classList.remove("translate-x-0");
  drawer.classList.add("translate-x-full");
  drawer.setAttribute("aria-hidden", "true");

  // Overlay: ausblenden, dann display:none
  overlay.classList.remove("opacity-100");
  overlay.classList.add("opacity-0");

  document.body.style.overflow = "";

  setTimeout(() => {
    overlay.classList.add("hidden");
    btn.focus();
  }, 300);
}

  btn.addEventListener("click", () =>
    drawer.classList.contains("translate-x-full") ? open() : close()
  );
  overlay.addEventListener("click", close);
  closeBtn?.addEventListener("click", close);

  $$(".drawer-link", drawer).forEach(a => a.addEventListener("click", close));

  drawer.addEventListener("keydown", (e) => {
  // nur wenn Drawer offen ist (also translate-x-full NICHT vorhanden)
  if (drawer.classList.contains("translate-x-full")) return;

  if (e.key === "Escape") { close(); return; }
  if (e.key !== "Tab") return;

  const focusable = $$('a,button,[tabindex]:not([tabindex="-1"])', drawer);
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
}

/* === Scroll Animations =========================== */
function initScrollAnimations() {
  if (!("IntersectionObserver" in window)) {
    $$("[data-animate]").forEach(el => el.classList.add("animated"));
    return;
  }
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("animated"); obs.unobserve(e.target); }
    }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  $$("[data-animate]").forEach(el => obs.observe(el));
}

/* === Active Nav Highlight ======================== */
function initActiveNav() {
  const sections = $$("section[id]");
  const links = $$(".nav-link");
  if (!sections.length || !links.length) return;

  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l =>
        l.classList.toggle("active", l.getAttribute("href") === `#${e.target.id}`)
      );
    }),
    { threshold: 0.35 }
  );

  sections.forEach(s => obs.observe(s));
}

/* === Footer Year ================================= */
function initFooterYear() {
  const el = $("#year");
  if (el) el.textContent = new Date().getFullYear();
}

/* === Smooth Scroll =============================== */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a =>
    a.addEventListener("click", e => {
      const id = a.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", `#${id}`);
    })
  );
}

/* === Init ======================================== */
document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initMobileNav();
  initScrollAnimations();
  initActiveNav();
  initFooterYear();
  initSmoothScroll();
});

/* === E-Mail-Adresse im HTML maskieren und per JS zusammensetzen ======================================== */
document.addEventListener("DOMContentLoaded", function () {
  const user = "goldschatz.hohenzollernstr.24";
  const domain = "gmail.com";
  const email = user + "@" + domain;

  const link = document.createElement("a");
  link.href = "mailto:" + email;
  link.className = "flex items-center gap-4 p-3 -mx-2 rounded-2xl hover:bg-gold-100 transition-colors border-gold-200 mb-1";
  link.innerHTML = `
    <div class="w-10 h-10 shrink-0 rounded-xl bg-gold-200 flex items-center justify-center">
  <svg class="w-5 h-5 text-[#5a3e00]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z"/>
    <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z"/>
  </svg>
</div>
    <div>
      <strong class="block text-xs mb-0.5">E-Mail</strong>
      <span class="text-sm text-ink-700">${email}</span>
    </div>
  `;

  document.getElementById("mail-link").appendChild(link);
});