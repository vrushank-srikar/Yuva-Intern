// ============================================================
// Student Dashboard – script.js
// Week 5 | Yuva Frontend Internship
//
// Loaded with `defer` — runs after HTML is fully parsed.
// ============================================================

// ── Element references ────────────────────────────────────────
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobile-menu');
const filterSelect = document.getElementById('filter-select');
const filterStatus = document.getElementById('filter-status');
const tbody        = document.getElementById('subject-tbody');
const barChart     = document.getElementById('bar-chart');

// Summary card value spans
const cardTotal       = document.getElementById('card-total');
const cardAvg         = document.getElementById('card-avg');
const cardAttendance  = document.getElementById('card-attendance');
const cardAssignments = document.getElementById('card-assignments');

// ── Module-level state ────────────────────────────────────────
// Store full dataset so filter can work without re-fetching.
let allStudentData = [];

// ============================================================
// 1. MOBILE MENU
// ============================================================

function openMenu() {
  mobileMenu.removeAttribute('hidden');
  hamburger.setAttribute('aria-expanded', 'true');
  hamburger.setAttribute('aria-label', 'Close navigation menu');
}

function closeMenu() {
  mobileMenu.setAttribute('hidden', '');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Open navigation menu');
}

function toggleMenu() {
  hamburger.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', toggleMenu);

  // Event delegation — single listener for all mobile links
  mobileMenu.addEventListener('click', function (e) {
    if (e.target.closest('.mobile-menu__link')) closeMenu();
  });

  // Escape key closes the menu and returns focus
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      hamburger.focus();
    }
  });
}

// ============================================================
// 2. DATA FETCHING
// ============================================================

/**
 * loadData()
 * Tries to fetch data.json via the Fetch API.
 * Falls back to inline data if fetch fails (e.g. file:// protocol
 * in some browsers blocks cross-origin requests to local JSON).
 */
async function loadData() {
  // Inline fallback data — mirrors data.json exactly.
  // Used automatically if the page is opened without a local server.
  const fallback = [
    { subject: 'Mathematics',     marks: 88, attendance: 94, status: 'Passed' },
    { subject: 'Physics',         marks: 72, attendance: 86, status: 'Passed' },
    { subject: 'Chemistry',       marks: 45, attendance: 60, status: 'Failed' },
    { subject: 'Computer Science',marks: 95, attendance: 98, status: 'Passed' },
    { subject: 'English',         marks: 38, attendance: 55, status: 'Failed' },
    { subject: 'History',         marks: 79, attendance: 88, status: 'Passed' }
  ];

  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (err) {
    // fetch failed (file:// protocol or network error) — use fallback silently
    console.info('data.json not reachable via fetch — using inline fallback data.');
    return fallback;
  }
}

// ============================================================
// 3. SUMMARY CARDS
// ============================================================

/**
 * renderCards(data)
 * Calculates and displays the four summary statistics.
 *
 * @param {Array} data – full student dataset
 */
function renderCards(data) {
  if (!data.length) return;

  const total      = data.length;
  const avgMarks   = Math.round(data.reduce((sum, s) => sum + s.marks, 0) / total);
  const avgAttend  = Math.round(data.reduce((sum, s) => sum + s.attendance, 0) / total);
  const passed     = data.filter(s => s.status === 'Passed').length;

  if (cardTotal)       cardTotal.textContent       = total;
  if (cardAvg)         cardAvg.textContent         = avgMarks + '%';
  if (cardAttendance)  cardAttendance.textContent  = avgAttend + '%';
  if (cardAssignments) cardAssignments.textContent = passed + ' / ' + total;
}

// ============================================================
// 4. TABLE RENDERING
// ============================================================

/**
 * getMarksClass(marks)
 * Returns a CSS class based on the marks value for colour coding.
 *
 * @param {number} marks
 * @returns {string} CSS class name
 */
function getMarksClass(marks) {
  if (marks >= 75) return 'marks--high';
  if (marks >= 50) return 'marks--medium';
  return 'marks--low';
}

/**
 * renderTable(data)
 * Clears and re-renders the <tbody> with the given data array.
 * Also updates the aria-live filter status message.
 *
 * @param {Array} data – filtered (or full) dataset
 */
function renderTable(data) {
  if (!tbody) return;

  // Clear existing rows
  tbody.innerHTML = '';

  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="table-loading">No subjects match this filter.</td></tr>';
    if (filterStatus) filterStatus.textContent = 'No subjects found.';
    return;
  }

  // Build rows using a DocumentFragment for performance (single DOM insertion)
  const fragment = document.createDocumentFragment();

  data.forEach(function (student) {
    const tr = document.createElement('tr');

    // Subject cell
    const tdSubject = document.createElement('td');
    tdSubject.textContent = student.subject;

    // Marks cell with colour class
    const tdMarks = document.createElement('td');
    const marksSpan = document.createElement('span');
    marksSpan.className = getMarksClass(student.marks);
    marksSpan.textContent = student.marks;
    tdMarks.appendChild(marksSpan);

    // Attendance cell
    const tdAttend = document.createElement('td');
    tdAttend.textContent = student.attendance + '%';

    // Status badge cell
    const tdStatus = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = 'badge ' + (student.status === 'Passed' ? 'badge--pass' : 'badge--fail');
    badge.textContent = student.status;
    tdStatus.appendChild(badge);

    tr.appendChild(tdSubject);
    tr.appendChild(tdMarks);
    tr.appendChild(tdAttend);
    tr.appendChild(tdStatus);
    fragment.appendChild(tr);
  });

  tbody.appendChild(fragment);

  // Update accessible live region
  if (filterStatus) {
    const count = data.length;
    filterStatus.textContent = count === 1 ? '1 subject shown.' : count + ' subjects shown.';
  }
}

// ============================================================
// 5. BAR CHART
// ============================================================

/**
 * renderChart(data)
 * Builds a pure CSS/HTML bar chart. Each bar's height is set
 * inline as a percentage of the chart container height,
 * proportional to the subject's marks (0–100).
 *
 * @param {Array} data – full dataset (chart always shows all subjects)
 */
function renderChart(data) {
  if (!barChart || !data.length) return;

  barChart.innerHTML = ''; // clear previous bars
  const fragment = document.createDocumentFragment();

  data.forEach(function (student) {
    // Percentage height = marks value (since max is 100)
    const heightPct = student.marks + '%';
    const isPassed  = student.status === 'Passed';

    const group = document.createElement('div');
    group.className = 'chart-bar-group';

    const bar = document.createElement('div');
    bar.className = 'chart-bar ' + (isPassed ? 'chart-bar--pass' : 'chart-bar--fail');
    bar.style.height = heightPct;
    bar.setAttribute('data-marks', student.marks);
    // Accessibility: title provides text alternative for the bar
    bar.setAttribute('title', student.subject + ': ' + student.marks + ' marks');

    const label = document.createElement('span');
    label.className = 'chart-label';
    // Abbreviate long subject names for the chart label
    label.textContent = student.subject.length > 8
      ? student.subject.slice(0, 7) + '…'
      : student.subject;

    group.appendChild(bar);
    group.appendChild(label);
    fragment.appendChild(group);
  });

  barChart.appendChild(fragment);
}

// ============================================================
// 6. FILTER
// ============================================================

/**
 * applyFilter()
 * Reads the current filter value and re-renders the table.
 * The chart always shows all subjects (not affected by filter).
 */
function applyFilter() {
  if (!filterSelect) return;

  const value = filterSelect.value; // 'all' | 'Passed' | 'Failed'

  const filtered = value === 'all'
    ? allStudentData
    : allStudentData.filter(s => s.status === value);

  renderTable(filtered);
}

if (filterSelect) {
  filterSelect.addEventListener('change', applyFilter);
}

// ============================================================
// 7. INITIALISE
// ============================================================

/**
 * init()
 * Entry point — fetches data, then renders cards, table, and chart.
 */
async function init() {
  const data = await loadData();

  // Guard: stop if data is empty or malformed
  if (!Array.isArray(data) || data.length === 0) {
    if (tbody) tbody.innerHTML = '<tr><td colspan="4" class="table-loading">Failed to load data.</td></tr>';
    return;
  }

  allStudentData = data;

  renderCards(data);
  renderTable(data);
  renderChart(data);
}

// Run on page load (defer ensures DOM is ready)
init();
