// ============================================================
// PrepMaster Landing Page – script.js (optimized)
// Week 4 | Yuva Frontend Internship
//
// PERF OPT: Script loaded with `defer` in index.html.
// defer means this file executes AFTER the HTML is fully
// parsed, so document.getElementById() calls are always safe
// and there is no need to wait for DOMContentLoaded.
// ============================================================

// ── Element references ────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

// ── Guard: stop early if elements are missing ─────────────────
// PERF OPT: The original script had no null check. If the IDs
// ever changed, addEventListener would throw and crash the page.
if (!hamburger || !mobileNav) {
  console.warn('PrepMaster: hamburger or mobileNav element not found.');
  // Exit — nothing to do without these elements
} else {

  // ── Hamburger toggle ────────────────────────────────────────
  hamburger.addEventListener('click', function () {
    const isOpen = mobileNav.classList.toggle('is-open');
    hamburger.classList.toggle('is-active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // ── Close menu on link click ────────────────────────────────
  // PERF OPT: Use event delegation on the parent instead of
  // attaching one listener per link. This is one listener vs
  // five — fewer event registrations, less memory usage.
  mobileNav.addEventListener('click', function (event) {
    const link = event.target.closest('.mobile-nav__link, .mobile-nav__cta');
    if (!link) return; // click was not on a link — ignore

    mobileNav.classList.remove('is-open');
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
  });

}
