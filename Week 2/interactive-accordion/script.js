// ============================================================
// Interactive FAQ Accordion – script.js
// Week 2 | Yuva Frontend Internship
// ============================================================

// ── 1. Grab all accordion items on the page ──────────────────
const accordionItems = document.querySelectorAll('.accordion__item');

// Guard: if no accordion items exist on the page, stop here.
if (accordionItems.length === 0) {
  console.warn('Accordion: no .accordion__item elements found.');
}

// ============================================================
// Core Functions
// ============================================================

/**
 * openAccordion(item)
 * Opens a single accordion item.
 * - Adds the .is-open class (drives CSS styles)
 * - Sets max-height to the panel's actual scrollHeight (enables animation)
 * - Updates icon text and aria-expanded for accessibility
 *
 * @param {Element} item – the .accordion__item element to open
 */
function openAccordion(item) {
  const trigger = item.querySelector('.accordion__trigger');
  const body    = item.querySelector('.accordion__body');
  const icon    = item.querySelector('.accordion__icon');

  // Safety check – skip if child elements are missing
  if (!trigger || !body || !icon) return;

  item.classList.add('is-open');

  // Set max-height to the real content height so CSS can animate it
  body.style.maxHeight = body.scrollHeight + 'px';

  // Change icon from + to −
  icon.textContent = '−';

  // Tell screen readers this panel is now expanded
  trigger.setAttribute('aria-expanded', 'true');
}

/**
 * closeAccordion(item)
 * Closes a single accordion item.
 * - Removes .is-open class
 * - Collapses max-height back to 0 (CSS animates the transition)
 * - Resets icon and aria-expanded
 *
 * @param {Element} item – the .accordion__item element to close
 */
function closeAccordion(item) {
  const trigger = item.querySelector('.accordion__trigger');
  const body    = item.querySelector('.accordion__body');
  const icon    = item.querySelector('.accordion__icon');

  // Safety check
  if (!trigger || !body || !icon) return;

  item.classList.remove('is-open');

  // Collapse the panel
  body.style.maxHeight = '0';

  // Change icon back to +
  icon.textContent = '+';

  // Tell screen readers this panel is now collapsed
  trigger.setAttribute('aria-expanded', 'false');
}

/**
 * toggleAccordion(clickedItem)
 * Handles a click on any accordion trigger.
 * - Closes all OTHER open items (only one open at a time)
 * - Toggles the clicked item open or closed
 *
 * @param {Element} clickedItem – the .accordion__item that was activated
 */
function toggleAccordion(clickedItem) {
  const isAlreadyOpen = clickedItem.classList.contains('is-open');

  // Close every item that is currently open
  accordionItems.forEach(function (item) {
    if (item.classList.contains('is-open')) {
      closeAccordion(item);
    }
  });

  // If the clicked item was NOT already open, open it now
  if (!isAlreadyOpen) {
    openAccordion(clickedItem);
  }
  // If it was already open, it was closed in the loop above – done.
}

// ============================================================
// Event Listeners
// ============================================================

accordionItems.forEach(function (item) {
  const trigger = item.querySelector('.accordion__trigger');

  // Guard: skip items that don't have a trigger button
  if (!trigger) {
    console.warn('Accordion: an .accordion__item is missing a .accordion__trigger button.');
    return;
  }

  // Mouse / touch click
  trigger.addEventListener('click', function () {
    toggleAccordion(item);
  });

  // Keyboard: Enter and Space are natively handled by <button>,
  // but this explicit listener makes the behaviour crystal clear.
  trigger.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // prevent page scroll on Space
      toggleAccordion(item);
    }
  });
});
