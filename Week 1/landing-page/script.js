// ============================================
// Hamburger menu toggle
// ============================================

const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

// Toggle the mobile nav open/closed when hamburger is clicked
hamburger.addEventListener('click', function () {
  const isOpen = mobileNav.classList.toggle('is-open');
  hamburger.classList.toggle('is-active', isOpen);

  // Update aria-expanded for accessibility
  hamburger.setAttribute('aria-expanded', isOpen);
});

// ============================================
// Close the mobile menu when a nav link is clicked
// ============================================

const mobileLinks = mobileNav.querySelectorAll('.mobile-nav__link, .mobile-nav__cta');

mobileLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    mobileNav.classList.remove('is-open');
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});
