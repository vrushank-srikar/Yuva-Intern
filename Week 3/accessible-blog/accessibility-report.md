# Accessibility Report – DevInsight Blog Portal

**Project:** Week 3 – Accessible Blog / Information Portal
**Author:** Vrushank Srikar
**Date:** September 2026
**Tools used for audit:** Chrome DevTools Accessibility Tree, manual keyboard testing, Lighthouse (Accessibility)

---

## 1. Project Overview

DevInsight is a fictional developer blog and information portal built as the Week 3 task of the Yuva Frontend Internship. The website displays three article cards covering web accessibility, CSS layout, and JavaScript DOM manipulation. It includes a header with navigation, a hero section with a working article search, an about section, a contact section, and a footer.

The primary objective of this project was **not** just to build a visually appealing page, but to demonstrate a thorough understanding of web accessibility principles — making every part of the page usable by anyone, regardless of how they interact with the web (mouse, keyboard, or screen reader).

---

## 2. Initial Accessibility Issues Identified

Before applying accessibility improvements, the following problems were identified through code review and manual audit:

| # | Issue |
|---|---|
| 1 | Navigation links were `<div>` elements and not keyboard-reachable |
| 2 | Hamburger button had no accessible label — screen readers would announce it as an unnamed button |
| 3 | Mobile menu state (open/closed) was not communicated to assistive technology |
| 4 | Search input had only a placeholder — no visible `<label>` element |
| 5 | Search results were not announced to screen readers |
| 6 | Focus outlines were removed by `outline: none` with no replacement |
| 7 | Article "Read more" links all had the same text — ambiguous for screen reader users who tab through links |
| 8 | Decorative emoji/icon elements were read aloud by screen readers unnecessarily |
| 9 | Heading hierarchy was inconsistent — `<h1>` was followed by `<h4>` in some areas |
| 10 | No skip link, forcing keyboard users to Tab through the entire header on every page |
| 11 | Colour contrast of body text on some backgrounds was below the WCAG AA 4.5:1 ratio |
| 12 | Images (colour blocks) had no `alt` attribute at all |

---

## 3. Improvements Made

### 3.1 Semantic HTML

Replaced generic `<div>` containers with appropriate semantic elements throughout:

- `<header role="banner">` wraps the site header
- `<nav aria-label="Primary navigation">` and `<nav aria-label="Mobile navigation">` for both nav bars
- `<main id="main-content">` wraps all page content
- `<section aria-labelledby="...">` for each page section (hero, articles, about, contact)
- `<article>` for each individual blog card
- `<aside>` for the quick-facts panel inside the About section
- `<footer role="contentinfo">` for the site footer
- `<address>` for contact details
- `<form role="search">` for the search form

This gives the page a meaningful document outline that screen readers and other assistive technologies can navigate efficiently.

### 3.2 Skip Link

Added a visually hidden "Skip to main content" anchor at the very top of the `<body>`. It is positioned off-screen with CSS (`top: -100%`) and slides into view (`top: 0.75rem`) only when it receives keyboard focus. This lets keyboard users jump directly to `#main-content`, bypassing the navigation header.

```html
<a class="skip-link" href="#main-content">Skip to main content</a>
```

### 3.3 Visible Focus Styles

Removed all instances of `outline: none`. Instead, a global `:focus-visible` rule applies a **3px amber ring** (`#f59e0b`) with a 3px offset on all interactive elements. Amber was chosen because it provides strong contrast against both the light page background and the dark hero/footer sections. The `:focus-visible` pseudo-class ensures the outline only appears for keyboard navigation, not mouse clicks.

### 3.4 Mobile Menu ARIA

The hamburger `<button>` was given:

- `aria-expanded="false"` (updated to `"true"` when open)
- `aria-controls="mobile-menu"` to programmatically link the button to its controlled panel
- `aria-label="Open navigation menu"` (updated to `"Close navigation menu"` when open)

The mobile menu uses the native HTML `hidden` attribute instead of `display: none` via class, which is better understood by assistive technologies. Pressing **Escape** closes the menu and returns focus to the hamburger button.

### 3.5 Search Form Labels

Replaced the placeholder-only search pattern with a proper visible `<label for="search">` element. The `<label>` is always visible above the input, not replaced by a placeholder. An additional `<p id="search-hint">` is linked via `aria-describedby` to provide extra context about how the search works.

### 3.6 Aria-live Search Results

An `aria-live="polite"` region (`#search-status`) is updated with the result count after every search. Screen readers will announce the new text automatically without the user needing to navigate to it. Messages are human-friendly:

- `"3 articles found."`
- `"1 article found."`
- `"No articles found."`

### 3.7 Descriptive Link Text

All "Read more" links include a visually hidden but screen-reader-accessible `aria-label` attribute with the full article title:

```html
aria-label="Read more about Building Accessible Web Experiences"
```

This ensures screen reader users who navigate by links hear the full context, not just "Read more".

### 3.8 Decorative Elements

All emoji icons and decorative colour blocks are wrapped with `aria-hidden="true"` so screen readers skip them entirely. They are purely visual and carry no informational value.

### 3.9 Heading Hierarchy

The heading structure was corrected to follow a strict, unbroken hierarchy:

```
h1  – "Ideas Worth Reading" (hero)
 └── h2 – "Latest Articles"
 │    └── h3 – Individual article titles
 └── h2 – "About DevInsight"
 │    └── h3 – "Quick Facts" (aside)
 └── h2 – "Get in Touch"
```

No heading levels are skipped.

### 3.10 Colour Contrast

All text/background colour combinations were selected to meet or exceed the WCAG 2.1 AA standard (minimum 4.5:1 for normal text, 3:1 for large text):

| Pairing | Ratio |
|---|---|
| `#1e293b` text on `#f8fafc` background | ~12.6:1 ✅ |
| `#3730a3` primary on white | ~7.2:1 ✅ |
| `#475569` secondary text on white | ~4.6:1 ✅ |
| White text on `#1e1b4b` hero background | ~14.1:1 ✅ |
| `#a5b4fc` link text on `#1e1b4b` | ~5.1:1 ✅ |

---

## 4. Keyboard Navigation Testing

The following behaviours were manually verified using only the keyboard:

| Key | Expected Behaviour | Result |
|---|---|---|
| `Tab` | Moves focus through all interactive elements in DOM order | ✅ |
| `Shift + Tab` | Moves focus backwards | ✅ |
| `Enter` on hamburger | Opens/closes mobile menu | ✅ |
| `Space` on hamburger | Opens/closes mobile menu (native button behaviour) | ✅ |
| `Escape` | Closes mobile menu, returns focus to hamburger | ✅ |
| `Enter` on nav link | Navigates to section | ✅ |
| `Tab` to search input | Input receives visible amber focus ring | ✅ |
| `Enter` in search input | Triggers search immediately | ✅ |
| `Tab` to Search button | Button receives visible focus ring | ✅ |
| `Enter` on Search button | Triggers search | ✅ |
| `Tab` through article cards | "Read more" links are focusable and described | ✅ |

The skip link (`Skip to main content`) is the first Tab stop on the page and jumps focus directly to `#main-content`, bypassing the header.

---

## 5. Audit Results

The following table summarises the results of manual testing and Lighthouse accessibility audit:

| Test | Result |
|---|---|
| Semantic HTML structure | ✅ Passed |
| Heading hierarchy (h1→h2→h3) | ✅ Passed |
| Skip link present and functional | ✅ Passed |
| Keyboard navigation (all interactive elements) | ✅ Passed |
| Visible focus styles | ✅ Passed |
| Mobile hamburger menu ARIA | ✅ Passed |
| Mobile menu Escape key + focus return | ✅ Passed |
| Search form visible label | ✅ Passed |
| Search results announced (aria-live) | ✅ Passed |
| Descriptive link text (Read more) | ✅ Passed |
| Decorative elements hidden from AT | ✅ Passed |
| Image alt text | ✅ Passed (decorative images use `alt=""`) |
| Colour contrast (WCAG AA) | ✅ Passed |
| No horizontal scrolling on mobile | ✅ Passed |
| Responsive layout (desktop / tablet / mobile) | ✅ Passed |
| JavaScript error handling (null guards) | ✅ Passed |

---

## 6. WCAG 2.1 Considerations

The Web Content Accessibility Guidelines (WCAG) 2.1 are organised around four core principles, often referred to as **POUR**:

### Perceivable
Information must be presentable in ways users can perceive. This was addressed by:
- Providing `alt` text on all images (empty `alt=""` for decorative ones)
- Maintaining sufficient colour contrast ratios (≥ 4.5:1)
- Not relying on colour alone to communicate information — text and icons are used alongside colour

### Operable
All functionality must be operable via keyboard (not just mouse). This was addressed by:
- Using native `<button>` and `<a>` elements that are keyboard-focusable by default
- Adding visible focus styles so users always know which element is focused
- Providing a skip link to avoid repetitive navigation
- Implementing Escape key to close the mobile menu and return focus

### Understandable
The interface and information must be understandable. This was addressed by:
- Clear, human-friendly search result messages (`"2 articles found."`)
- Descriptive `aria-label` on "Read more" links to give full context
- Visible `<label>` on the search input with a clear hint text
- Consistent and predictable navigation behaviour across all pages

### Robust
Content must be interpretable by a wide variety of assistive technologies. This was addressed by:
- Using standard semantic HTML elements with their built-in ARIA roles
- Adding ARIA attributes only where native HTML was insufficient (mobile menu state)
- Using the `hidden` HTML attribute (understood by all AT) rather than CSS `display: none`
- Testing with the Chrome Accessibility Tree to confirm the DOM tree is clean

---

## 7. How to Test

Follow these steps to manually test the accessibility of the page:

1. **Open** `index.html` in any modern browser (Chrome, Firefox, Edge).
2. **Press `Tab`** immediately — the "Skip to main content" link should become visible.
3. **Press `Enter`** on the skip link — focus should jump to the articles section.
4. **Continue pressing `Tab`** — verify that every interactive element (nav links, hamburger, search input, search button, read more links, footer links) receives a clearly visible amber focus ring in the correct DOM order.
5. **On a narrow window (< 600px or DevTools mobile emulation):** press `Tab` to reach the hamburger button, then `Enter` or `Space` to open the mobile menu. Press `Escape` to close it — focus should return to the hamburger button.
6. **Click into the search input** and type `css` — the CSS article should remain visible, others hidden, and the status region should read `"1 article found."`.
7. **Type `xyz`** (no match) — all articles hide, the no-results message appears, and status reads `"No articles found."`.
8. **Clear the search field** — all articles reappear.
9. **Open Chrome DevTools → Lighthouse** and run an Accessibility audit. Review the score and address any flagged issues.
10. **Open DevTools → Accessibility pane** and inspect the element tree to verify ARIA attributes are correct.
