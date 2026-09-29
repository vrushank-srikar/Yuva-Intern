// ============================================================
// Accessible Blog – script.js
// Week 3 | Yuva Frontend Internship
// ============================================================

// ── Element references ────────────────────────────────────────
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');
const searchInput = document.getElementById('search');
const searchBtn   = document.getElementById('search-btn');
const searchStatus= document.getElementById('search-status');
const articlesGrid= document.getElementById('articles-grid');
const noResults   = document.getElementById('no-results');

// ── Guard: only run if the essential elements exist ───────────
if (!hamburger || !mobileMenu) {
  console.warn('Navigation elements not found. Check IDs in index.html.');
}

// ============================================================
// 1. MOBILE MENU
// ============================================================

/**
 * openMobileMenu()
 * Shows the mobile menu, updates ARIA state and button label.
 */
function openMobileMenu() {
  mobileMenu.removeAttribute('hidden');       // reveal the nav
  hamburger.setAttribute('aria-expanded', 'true');
  hamburger.setAttribute('aria-label', 'Close navigation menu');
}

/**
 * closeMobileMenu()
 * Hides the mobile menu, resets ARIA state and button label.
 */
function closeMobileMenu() {
  mobileMenu.setAttribute('hidden', '');      // hide the nav
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Open navigation menu');
}

/**
 * toggleMobileMenu()
 * Reads current state and calls open or close accordingly.
 */
function toggleMobileMenu() {
  const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
  isOpen ? closeMobileMenu() : openMobileMenu();
}

// Hamburger click
if (hamburger) {
  hamburger.addEventListener('click', toggleMobileMenu);
}

// Close menu when a mobile nav link is clicked
if (mobileMenu) {
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });
}

// Close menu when Escape key is pressed (keyboard UX)
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    const isOpen = hamburger && hamburger.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMobileMenu();
      hamburger.focus(); // return focus to trigger button
    }
  }
});

// ============================================================
// 2. ARTICLE SEARCH
// ============================================================

/**
 * getArticleCards()
 * Returns a NodeList of all .article-card elements.
 * Wrapped in a function so it's always up to date.
 */
function getArticleCards() {
  if (!articlesGrid) return [];
  return articlesGrid.querySelectorAll('.article-card');
}

/**
 * runSearch(keyword)
 * Filters articles by matching keyword against the card's
 * data-tags attribute and visible text content.
 * Updates the aria-live search-status region.
 *
 * @param {string} keyword – the user's search term (trimmed)
 */
function runSearch(keyword) {
  // Guard: elements must exist
  if (!searchStatus || !noResults) return;

  const cards      = getArticleCards();
  const query      = keyword.toLowerCase().trim();
  let   matchCount = 0;

  cards.forEach(function (card) {
    const tags    = (card.dataset.tags || '').toLowerCase();
    const text    = card.textContent.toLowerCase();
    const matches = query === '' || tags.includes(query) || text.includes(query);

    if (matches) {
      card.removeAttribute('hidden');
      matchCount++;
    } else {
      card.setAttribute('hidden', '');
    }
  });

  // Show/hide "no results" message
  if (matchCount === 0 && query !== '') {
    noResults.removeAttribute('hidden');
  } else {
    noResults.setAttribute('hidden', '');
  }

  // Update live region (announced by screen readers)
  if (query === '') {
    searchStatus.textContent = ''; // clear status when query is empty
  } else if (matchCount === 0) {
    searchStatus.textContent = 'No articles found.';
  } else {
    searchStatus.textContent =
      matchCount === 1 ? '1 article found.' : matchCount + ' articles found.';
  }
}

// Search button click
if (searchBtn) {
  searchBtn.addEventListener('click', function () {
    runSearch(searchInput ? searchInput.value : '');
  });
}

// Real-time search as user types (debounced slightly)
let debounceTimer;
if (searchInput) {
  searchInput.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      runSearch(searchInput.value);
    }, 250); // wait 250ms after last keystroke before filtering
  });

  // Also trigger on Enter key inside the search field
  searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      clearTimeout(debounceTimer);
      runSearch(searchInput.value);
    }
  });
}
