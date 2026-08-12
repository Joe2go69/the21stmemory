/**
 * Inject vault critical-paint CSS into all quiz/*.html pages so first paint
 * is #0F0A1F instead of browser white before main.min.css loads.
 *
 * Run: node scripts/patch-quiz-critical-paint.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CRITICAL = `    <!-- Critical paint: solid vault color before main.css (prevents white flash) -->
    <style>html,body{background-color:#0F0A1F}</style>
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

function ensureCriticalPaint(html) {
  if (html.includes('html,body{background-color:#0F0A1F}')) {
    return { html, changed: false };
  }

  const markers = [
    '    <link rel="preload" href="../../assets/css/main.min.css" as="style">',
    '    <link rel="stylesheet" href="../../assets/css/tailwind.css">',
    '    <link rel="stylesheet" href="../../assets/css/main.min.css">',
    '    <link rel="stylesheet" href="../../assets/css/quiz.css">',
  ];

  for (const marker of markers) {
    if (html.includes(marker)) {
      return { html: html.replace(marker, CRITICAL + marker), changed: true };
    }
  }

  // Fallback: first stylesheet link
  const re = /(\n)([ \t]*)(<link[^>]+rel=["']stylesheet["'][^>]*>)/i;
  if (re.test(html)) {
    return {
      html: html.replace(re, `$1$2${CRITICAL.trim()}\n$2$3`),
      changed: true,
    };
  }

  return { html, changed: false };
}

function ensureThemeColor(html) {
  if (/name=["']theme-color["']/.test(html)) return { html, changed: false };
  const viewport = /(<meta name=["']viewport["'][^>]*>)/i;
  if (!viewport.test(html)) return { html, changed: false };
  return {
    html: html.replace(
      viewport,
      '$1\n    <meta name="theme-color" content="#0F0A1F">'
    ),
    changed: true,
  };
}

const files = walk(path.join(ROOT, 'quiz'));
let updated = 0;
let skipped = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  let changed = false;

  const paint = ensureCriticalPaint(html);
  html = paint.html;
  changed = changed || paint.changed;

  const theme = ensureThemeColor(html);
  html = theme.html;
  changed = changed || theme.changed;

  if (!changed) {
    skipped++;
    continue;
  }

  fs.writeFileSync(file, html, 'utf8');
  updated++;
}

console.log(
  `patch-quiz-critical-paint: updated ${updated}, already ok ${skipped}, total ${files.length}`
);
