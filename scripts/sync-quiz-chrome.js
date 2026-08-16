/**
 * Sync navbar + footer on all quiz pages with path prefix ../../
 * Also ensures vault critical-paint CSS is present (prevents white FOUC).
 * Run after build:chrome, or as part of full build.
 */
const fs = require('fs');
const path = require('path');
const { renderNavbar, renderFooter } = require('./chrome-renderer');

const ROOT = path.join(__dirname, '..');
const BASE = '../../';

const navbarData = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'assets/data/navbar.json'), 'utf8')
);
const footerData = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'assets/data/footer.json'), 'utf8')
);

const navbarHTML = renderNavbar(navbarData, { basePath: BASE });
const footerHTML = renderFooter(footerData, { basePath: BASE });

const NAV_REGEX = /<nav class="navbar">[\s\S]*?<\/nav>/;
const FOOTER_REGEX = /<footer class="site-footer">[\s\S]*?<\/footer>/;
const CRITICAL_PAINT = `    <!-- Critical paint: solid vault color before main.css (prevents white flash) -->
    <style>html,body{background-color:#0F0A1F;color-scheme:dark}body{padding-top:calc(5rem + env(safe-area-inset-top,0px))}</style>
`;

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

/** Keep first paint vault-colored even before main.min.css arrives. */
function ensureCriticalPaint(html) {
  if (html.includes('html,body{background-color:#0F0A1F}')) return html;

  const markers = [
    '    <link rel="preload" href="../../assets/css/main.min.css" as="style">',
    '    <link rel="stylesheet" href="../../assets/css/tailwind.css">',
    '    <link rel="stylesheet" href="../../assets/css/main.min.css">',
    '    <link rel="stylesheet" href="../../assets/css/quiz.css">',
  ];
  for (const marker of markers) {
    if (html.includes(marker)) {
      return html.replace(marker, CRITICAL_PAINT + marker);
    }
  }
  return html;
}

function ensureThemeColor(html) {
  if (/name=["']theme-color["']/.test(html)) return html;
  return html.replace(
    /(<meta name=["']viewport["'][^>]*>)/i,
    '$1\n    <meta name="theme-color" content="#0F0A1F">'
  );
}

function ensurePageInterior(html) {
  if (/<body[^>]*\bpage-interior\b/.test(html)) return html;
  return html.replace(
    /<body class="cosmic-bg"/,
    '<body class="cosmic-bg page-interior"'
  );
}

const quizFiles = walk(path.join(ROOT, 'quiz'));
let updated = 0;
let skipped = 0;

for (const file of quizFiles) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  let changed = false;

  if (NAV_REGEX.test(html)) {
    html = html.replace(NAV_REGEX, navbarHTML);
    changed = true;
  }
  if (FOOTER_REGEX.test(html)) {
    html = html.replace(FOOTER_REGEX, footerHTML);
    changed = true;
  }

  html = ensureCriticalPaint(html);
  html = ensureThemeColor(html);
  html = ensurePageInterior(html);
  if (html !== before) changed = true;

  if (!changed) {
    skipped++;
    console.warn('Skip (no chrome):', path.relative(ROOT, file));
    continue;
  }

  fs.writeFileSync(file, html, 'utf8');
  updated++;
}

console.log(`sync-quiz-chrome complete — ${updated} updated, ${skipped} skipped`);
