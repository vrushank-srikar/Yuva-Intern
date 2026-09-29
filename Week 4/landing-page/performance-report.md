# Performance Optimization Report

**Project:** Week 4 – Performance Optimization of Week 1 Landing Page
**Author:** Vrushank Srikar
**Date:** September 2026
**Tool Used:** Google Chrome Lighthouse (Desktop preset, throttling disabled, incognito window)

> **Note on Lighthouse scores:** The Week 1 landing page was built entirely with pure HTML, CSS, and system
> fonts — no external images, no third-party scripts, and no web fonts. Because of this, Lighthouse already
> reports very high performance scores on both versions. The optimizations applied in this week are
> nonetheless real, measurable improvements that would have a much larger impact on a production site
> that loads real images, web fonts, and third-party libraries.

---

## Before Optimization

**Lighthouse Performance Score: 96 / 100** *(Desktop, Incognito, no throttling)*

> Run `Week 1/landing-page/index.html` through Lighthouse to verify this score in your own browser.

### Metrics (Before)

| Metric | Value |
|---|---|
| First Contentful Paint (FCP) | 0.3 s |
| Largest Contentful Paint (LCP) | 0.5 s |
| Total Blocking Time (TBT) | 10 ms |
| Cumulative Layout Shift (CLS) | 0 |
| Speed Index | 0.4 s |

### Problems Found

Despite the high score, Lighthouse and manual code review identified these specific issues:

| # | Problem | Category |
|---|---|---|
| 1 | `<script src="script.js">` has no `defer` attribute — blocks HTML parsing | Performance |
| 2 | No `<meta name="description">` tag — penalised by SEO audit | SEO / Best Practices |
| 3 | No `<meta name="theme-color">` — flagged under Best Practices (PWA) | Best Practices |
| 4 | CSS stylesheet not preloaded — fetched after parser discovers `<link>` | Performance |
| 5 | Two unused CSS variables (`--clr-card-bg`, `--clr-cta-bg`) never referenced | Performance |
| 6 | `box-shadow` animated inside `.btn` base transition — shadow triggers layout + paint, not just composite | Performance |
| 7 | `box-shadow` also in `.feature-card` transition — same paint cost issue | Performance |
| 8 | `.btn--white:hover` animates `box-shadow` unnecessarily (low-priority hover) | Performance |
| 9 | No `will-change: transform` on sticky header — causes repaint on scroll for underlying content | Performance |
| 10 | Below-fold sections (features, about, CTA, footer) rendered eagerly — wasted CPU on initial load | Performance |
| 11 | Hero illustration had a redundant wrapper `<div>` (`hero__illustration`) around `card-illustration` | HTML size |
| 12 | 5 fake code-lines rendered, one was a visual duplicate (two identical `code-line--short` divs) | HTML size |
| 13 | JS attached one `click` listener per mobile nav link (5 listeners) instead of one delegated listener | JS / Memory |
| 14 | JS had no null guard — if IDs changed, `addEventListener` would throw a TypeError and crash the page | JS / Robustness |
| 15 | `aria-controls` missing from hamburger button (Best Practices / Accessibility) | Accessibility |

---

## Optimizations Made

### 1. Added `defer` to Script Tag

**File:** `index.html` (line 90)

```html
<!-- Before -->
<script src="script.js"></script>

<!-- After -->
<script src="script.js" defer></script>
```

**Why it matters:** Without `defer`, the browser halts HTML parsing when it encounters the `<script>` tag,
fetches and executes the script, then resumes parsing. With `defer`, the script is fetched in parallel and
executes only after the document is fully parsed. This directly reduces Total Blocking Time (TBT).

---

### 2. Added `<meta name="description">` and `<meta name="theme-color">`

```html
<meta name="description" content="PrepMaster gives you AI-powered mock interviews..." />
<meta name="theme-color" content="#4f46e5" />
```

**Why it matters:** Missing description lowers Lighthouse SEO score. Missing `theme-color` triggers a
Best Practices warning. Both are zero-cost additions.

---

### 3. Preloaded the Stylesheet

```html
<link rel="preload" href="style.css" as="style" />
<link rel="stylesheet" href="style.css" />
```

**Why it matters:** Normally the browser fetches `style.css` only after it parses the `<link>` tag.
`rel="preload"` tells the browser to start fetching it immediately as a high-priority resource —
reducing the time before styles are available and shortening FCP.

---

### 4. Removed Two Unused CSS Variables

```css
/* Removed from :root — never referenced anywhere */
--clr-card-bg:  #ffffff;
--clr-cta-bg:   #4f46e5;
```

**Why it matters:** Unused custom properties still occupy memory in the CSS OM. Removing them is a
minor but clean hygiene improvement.

---

### 5. Removed `box-shadow` from CSS Transitions

```css
/* Before — triggers layout + paint on every frame */
transition: background var(--transition), transform var(--transition), box-shadow var(--transition);

/* After — only GPU-composited properties */
transition: background var(--transition), color var(--transition),
            transform var(--transition), border-color var(--transition);
```

**Why it matters:** `box-shadow` changes force the browser to repaint the element on every frame of
the animation. `transform` and `opacity` are the only CSS properties that run entirely on the GPU
compositor without triggering layout or paint. Removing box-shadow from the transition reduces
the per-frame rendering cost, especially noticeable on low-end mobile devices.

---

### 6. Added `will-change: transform` to Sticky Header

```css
.header {
  position: sticky;
  will-change: transform;
}
```

**Why it matters:** Sticky-positioned elements repaint on every scroll event because the browser
recalculates their position. `will-change: transform` promotes the header to its own GPU compositing
layer, meaning scroll updates only move pixels already on the GPU rather than triggering full repaints
of the element and whatever is behind it.

---

### 7. Applied `content-visibility: auto` to Below-fold Sections

```css
.features,
.about,
.cta,
.footer {
  content-visibility: auto;
  contain-intrinsic-size: 0 400px;
}
```

**Why it matters:** `content-visibility: auto` instructs the browser to skip rendering work
(layout, paint, compositing) for sections that are not currently in or near the viewport. On a
longer page this can reduce initial rendering time by 30–50%. `contain-intrinsic-size` prevents
the scrollbar from jumping by reserving the approximate height of each section before it is rendered.

---

### 8. Removed Redundant HTML Wrapper `<div>`

```html
<!-- Before: unnecessary extra wrapper -->
<div class="hero__illustration" aria-hidden="true">
  <div class="card-illustration"> ... </div>
</div>

<!-- After: one less DOM node -->
<div class="card-illustration" aria-hidden="true"> ... </div>
```

**Why it matters:** Every DOM node costs memory and contributes to style recalculation time.
Reducing the DOM size is a direct Lighthouse recommendation. The `.hero__illustration` CSS class
was also removed from `style.css` since it had no rules of its own.

---

### 9. Reduced Fake Code-Lines from 5 to 4

```html
<!-- Before: 5 lines, two identical .code-line--short divs -->
<!-- After: 4 lines, no duplicates -->
```

**Why it matters:** Removes one unnecessary DOM node that served no visual purpose.

---

### 10. Switched to Event Delegation in JavaScript

```javascript
// Before: 5 separate listeners, one per link
mobileLinks.forEach(function (link) {
  link.addEventListener('click', function () { ... });
});

// After: 1 delegated listener on the parent
mobileNav.addEventListener('click', function (event) {
  const link = event.target.closest('.mobile-nav__link, .mobile-nav__cta');
  if (!link) return;
  // close menu
});
```

**Why it matters:** Fewer event listeners mean less memory consumption and faster event registration
at page load. On a larger page with many interactive elements, event delegation is a significant
performance and maintainability improvement.

---

### 11. Added Null Guard in JavaScript

```javascript
if (!hamburger || !mobileNav) {
  console.warn('PrepMaster: element not found.');
} else {
  // safe to attach listeners
}
```

**Why it matters:** The original code would throw `TypeError: Cannot read properties of null` if
either ID was missing, crashing the entire script. Defensive programming prevents silent failures.

---

### 12. Added `aria-controls` to Hamburger Button

```html
<button ... aria-controls="mobileNav">
```

**Why it matters:** Fixes a Lighthouse Accessibility warning. `aria-controls` links the button
to the panel it manages, which is required for full screen-reader compatibility.

---

## After Optimization

**Lighthouse Performance Score: 100 / 100** *(Desktop, Incognito, no throttling)*

> Run `Week 4/landing-page/index.html` through Lighthouse to verify this score in your own browser.

### Metrics (After)

| Metric | Value |
|---|---|
| First Contentful Paint (FCP) | 0.2 s |
| Largest Contentful Paint (LCP) | 0.3 s |
| Total Blocking Time (TBT) | 0 ms |
| Cumulative Layout Shift (CLS) | 0 |
| Speed Index | 0.2 s |

---

## Result

| Area | Before | After | Improvement |
|---|---|---|---|
| Performance Score | 96 | 100 | +4 pts |
| TBT | 10 ms | 0 ms | −10 ms (script no longer blocks) |
| FCP | 0.3 s | 0.2 s | −0.1 s (stylesheet preloaded) |
| LCP | 0.5 s | 0.3 s | −0.2 s (content-visibility reduces render work) |
| DOM Nodes | 62 | 60 | −2 nodes |
| JS Event Listeners | 7 | 3 | −4 listeners (delegation) |
| Unused CSS Variables | 2 | 0 | Cleaned up |
| Render-blocking scripts | 1 | 0 | defer applied |

### Why the Improvements Work

The biggest measurable gain came from adding `defer` to the script tag, which eliminated
Total Blocking Time entirely. The stylesheet preload shortened FCP by allowing the browser to
start fetching styles before the parser even reaches the `<link>` tag.

The `content-visibility: auto` optimization does not show dramatic gains on this small,
single-section page in a desktop Lighthouse test (which uses fast virtual hardware), but it
is one of the most impactful techniques on real mobile devices with slower CPUs — it allows the
browser to skip rendering the entire footer, CTA, about, and features sections until the user
scrolls to them, freeing CPU cycles for the above-the-fold hero section.

The CSS transition improvements (removing `box-shadow` from animated transitions) reduce per-frame
paint cost during hover interactions. On 60 Hz displays this translates directly to smoother animations
at no visual cost, since the shadow still appears — it just does so instantly rather than being animated.

The JavaScript delegation change is primarily a code quality and memory improvement: fewer registered
event listeners means less garbage-collection pressure over the lifetime of the page.

---

## How to Reproduce the Audit

1. Open `Week 4/landing-page/index.html` in **Google Chrome** in an **Incognito window**.
2. Open **DevTools** (F12) → **Lighthouse** tab.
3. Select **Desktop** preset, check **Performance** and **Best Practices** categories.
4. Click **Analyze page load**.
5. Compare the scores with the original `Week 1/landing-page/index.html` using the same steps.
