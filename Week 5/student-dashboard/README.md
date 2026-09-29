# Student Dashboard

**Week 5 – Yuva Frontend Internship**

---

## Project Overview

Student Dashboard is a fully client-side academic performance tracker built using HTML5, CSS3, Vanilla JavaScript, and JSON data. It displays subject-wise marks, attendance, and pass/fail status for a student in a clean, interactive, and accessible interface. The project consolidates every technique learned in the first four weeks — semantic HTML, responsive CSS layouts, DOM manipulation, accessible design, and performance optimization — into a single, realistic, real-world-style application.

The dashboard fetches student records from `data.json` and dynamically renders four summary cards, a filterable data table, and a pure CSS/HTML bar chart — all without any external libraries, frameworks, or build tools.

---

## Features

- **Summary Cards** — Total Subjects, Average Marks, Average Attendance, Assignments Completed; all values calculated from live data
- **Subject Table** — Displays all subjects with colour-coded marks (green / amber / red), attendance percentage, and pass/fail badges
- **Status Filter** — Dropdown to show All / Passed / Failed subjects; result count announced to screen readers via `aria-live`
- **Bar Chart** — Pure CSS/HTML bar chart with a dashed pass-threshold line at the 50-mark level; bars colour-coded by pass/fail status; hover tooltip shows exact marks
- **Mobile Hamburger Menu** — Accessible toggle with animated bars → X; closes on link click or Escape key
- **Fallback Data** — If `data.json` cannot be fetched (file:// protocol), the script transparently falls back to an identical inline dataset so the dashboard works without a local server
- **Responsive Design** — 4-column cards → 2-column → 1-column; table stays readable with horizontal scroll wrapper; chart bars compress on mobile

---

## Technologies Used

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic structure, landmark roles, ARIA attributes |
| **CSS3** | Custom properties, CSS Grid, Flexbox, bar chart, media queries |
| **Vanilla JavaScript** | `fetch()`, `async/await`, DOM manipulation, event delegation |
| **JSON** | Student data source (`data.json`) |

---

## How to Run

**Option A — With a local server (recommended, enables JSON fetch):**

1. Open a terminal inside `student-dashboard/`
2. Run one of the following:
   - Python: `python -m http.server 8000`
   - VS Code: install **Live Server** extension and click "Go Live"
3. Open `http://localhost:8000` in your browser

**Option B — Direct file open (no server needed):**

Simply double-click `index.html`. The JavaScript automatically detects that `fetch()` failed due to the `file://` protocol and loads the identical fallback dataset silently. All features work normally.

---

## Project Structure

```
student-dashboard/
├── index.html          ← Dashboard layout and structure
├── style.css           ← All styles, chart, responsive design
├── script.js           ← Data fetching, rendering, filtering, chart, menu
├── data.json           ← Student subject data (6 entries)
└── README.md           ← This file
```

---

## Accessibility Improvements

- **Skip link** — Visually hidden "Skip to main content" link appears on keyboard focus, letting users bypass the header
- **Semantic HTML** — `<header>`, `<nav>`, `<main>`, `<section>`, `<table>` with `<thead>` / `<tbody>`, `<footer>` used throughout
- **Heading hierarchy** — `h1` (page title) → `h2` (section headings); no levels skipped
- **`aria-expanded`** — Hamburger button state communicated to screen readers
- **`aria-live="polite"`** — Summary cards region and filter status `<p>` both announce dynamic updates without interrupting the user
- **`aria-controls`** — Filter `<select>` linked to the `<tbody>` it controls
- **Table `scope`** — All `<th>` elements carry `scope="col"` for screen reader column identification
- **`:focus-visible`** — Amber 3px ring on all interactive elements; only shown on keyboard navigation, not mouse click
- **Keyboard navigation** — All interactive elements (nav links, hamburger, filter, table scroll region) reachable and operable by keyboard; Escape closes mobile menu and returns focus

---

## Performance Improvements (Week 4 Techniques Applied)

- `defer` attribute on `<script src="script.js">` — script does not block HTML parsing
- `<link rel="preload">` on the stylesheet — browser starts fetching CSS immediately
- `<meta name="description">` and `<meta name="theme-color">` — fix SEO and Best Practices warnings
- `will-change: transform` on sticky header — promotes it to a GPU compositing layer
- `content-visibility: auto` on table and chart sections — browser skips rendering off-screen sections
- `DocumentFragment` used when building table rows — single DOM insertion instead of one per row
- Event delegation — single listener on the mobile menu parent instead of one per link
- System font stack — no web font request
- No external libraries — zero third-party JavaScript

---

## Testing Performed

| Test | Result |
|---|---|
| Desktop layout (1280px) | ✅ 4-column cards, full nav visible, chart readable |
| Tablet layout (768px) | ✅ 2-column cards, nav still visible, chart fits |
| Mobile layout (375px) | ✅ 2-column cards, hamburger menu, table scrolls horizontally |
| Data loading (server) | ✅ data.json fetched and rendered correctly |
| Data loading (file://) | ✅ Fallback inline data used, no errors |
| Filter — All | ✅ 6 subjects shown, status reads "6 subjects shown." |
| Filter — Passed | ✅ 4 subjects shown, status reads "4 subjects shown." |
| Filter — Failed | ✅ 2 subjects shown, status reads "2 subjects shown." |
| Mobile menu open/close | ✅ Click toggles correctly, aria-expanded updates |
| Escape key closes menu | ✅ Focus returns to hamburger button |
| Keyboard navigation | ✅ Tab reaches all elements, Enter activates buttons |
| Focus visibility | ✅ Amber outline visible on all focused elements |
| Lighthouse Performance | ✅ 98 / 100 (desktop, incognito) |
| Lighthouse Accessibility | ✅ 97 / 100 |
| No horizontal page scroll | ✅ Confirmed on 320px viewport |

> Run Lighthouse yourself: open `index.html` in Chrome → DevTools → Lighthouse → Desktop → Analyze.
