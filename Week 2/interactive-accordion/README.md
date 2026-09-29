# Interactive FAQ Accordion

## Description

A lightweight, accessible FAQ accordion component built from scratch using HTML5, CSS3, and Vanilla JavaScript — no frameworks, no libraries. Users can click or keyboard-navigate through five FAQ questions. Each answer expands and collapses with a smooth animation, and only one answer is ever visible at a time.

## Technologies

- **HTML5** – Semantic structure (`<section>`, `<h2>`, `<button>`, `<p>`)
- **CSS3** – Custom properties, `max-height` animation, Flexbox, focus-visible styles, media queries
- **Vanilla JavaScript** – DOM manipulation, event listeners, class toggling, ARIA updates

## Features

- ✅ Expand / collapse FAQ answers on click
- ✅ Only one item open at a time (others auto-close)
- ✅ Smooth open/close animation via `max-height` transition
- ✅ Plus icon rotates to a minus icon when open
- ✅ Full keyboard support (`Enter` / `Space` keys)
- ✅ ARIA accessibility (`aria-expanded`, `aria-controls`, `role="region"`)
- ✅ Responsive design (desktop + mobile)
- ✅ Visible focus states for keyboard users
- ✅ Graceful fallback when JavaScript is disabled

## How to Run

No build step or server required.

1. Clone or download the project.
2. Open `index.html` directly in any modern browser:

```
interactive-accordion/
├── index.html   ← open this
├── style.css
└── script.js
```

Double-clicking `index.html` in your file explorer is enough.

## Project Structure

```
interactive-accordion/
├── index.html    – Page markup and accordion HTML
├── style.css     – All styles and animations
├── script.js     – Accordion toggle logic
└── README.md     – This file
```

## How It Works

### HTML Structure

Each FAQ item is an `.accordion__item` `<div>` containing:
- An `<h2>` heading wrapping a `<button>` (the trigger). Using a real `<button>` gives us click + keyboard behaviour for free.
- A `<div>` panel (`accordion__body`) that holds the answer text. It is linked to the button via `aria-controls` / `aria-labelledby`.

### CSS Styling

The panel starts at `max-height: 0; overflow: hidden` so it is invisible. When the `.is-open` class is added, JavaScript sets `max-height` to the panel's real `scrollHeight`, and the CSS `transition` animates the height change smoothly. Removing the class collapses it back to zero.

### JavaScript DOM Manipulation

Three focused functions handle all behaviour:

| Function | Responsibility |
|---|---|
| `openAccordion(item)` | Adds `.is-open`, sets `max-height`, updates icon and `aria-expanded` |
| `closeAccordion(item)` | Removes `.is-open`, resets `max-height` to 0, reverts icon and `aria-expanded` |
| `toggleAccordion(item)` | Closes all open items, then opens the clicked one (if it was closed) |

### Event Handling

Each trigger button gets two listeners:
- `click` – for mouse and touch
- `keydown` – checks for `Enter` or `Space` and calls `toggleAccordion`

### Accessibility Implementation

- `aria-expanded="true/false"` on the button reflects open/closed state for screen readers.
- `aria-controls="panel-N"` links the button to its answer panel.
- `role="region"` + `aria-labelledby` on the panel identifies it as a landmark.
- `:focus-visible` CSS rule shows a clear outline only for keyboard users, not mouse clicks.
- A `<noscript>` style block makes all answers visible when JavaScript is unavailable.

## Testing Checklist

- [ ] Open/close FAQ items by clicking
- [ ] Only one FAQ item opens at a time
- [ ] Keyboard navigation works (`Tab` to focus, `Enter`/`Space` to toggle)
- [ ] Mobile layout looks correct (no horizontal scroll, text wraps)
- [ ] Hover states visible on desktop
- [ ] Focus outline visible when navigating by keyboard
- [ ] No JavaScript errors in the browser console
- [ ] Answers are readable when JavaScript is disabled (`noscript` fallback)
