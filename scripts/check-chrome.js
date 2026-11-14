/**
 * Chrome + copy-rule check (runs in CI before and after the build).
 *
 * 1. Menu/footer drift: every page's <nav class="navbar"> and
 *    <footer class="site-footer"> must match what chrome-renderer.js builds
 *    from assets/data/navbar.json + footer.json. Covers root pages, every
 *    dive and quiz page, and quiz/_template.html (the seed for new quizzes).
 * 2. Copy rules (Joe's standing rules): no future-paywall wording such as
 *    "stays free", "always free", "always will be" in published pages or the
 *    shared chrome data.
 *
 * Fix drift by editing the JSON files and running `npm run build`, never by
 * hand-editing the inlined blocks.
 *
 *   node scripts/check-chrome.js              # exit 1 on any problem
 *   node scripts/check-chrome.js --committed  # same, but only in CI (npm "prebuild"):
 *                                             # checks the pages as committed, before the
 *                                             # build regenerates them. Skipped locally so
 *                                             # you can always run the build to fix drift.
 */
if (process.argv.includes('--committed') && !process.env.CI) {
  console.log('check-chrome: committed-pages check runs in CI only (skipped locally)');
  process.exit(0);
}
const fs = require('fs');
const path = require('path');
const { renderNavbar, renderFooter } = require('./chrome-renderer');

const ROOT = path.join(__dirname, '..');
const navbarData = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/navbar.json'), 'utf8'));
const footerData = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/footer.json'), 'utf8'));

const NAV_RE = /<nav class="navbar">[\s\S]*?<\/nav>/;
const FOOTER_RE = /<footer class="site-footer">[\s\S]*?<\/footer>/;
const PAYWALL_RE = /\b(?:stays|always|forever) free\b|\balways will be\b|\bfree either way\b|\bit stays free\b/i;
// Root pages served at any depth use root-absolute chrome.
const ROOT_ABSOLUTE = new Set(['404.html']);

// Quiz pages drop the Tailwind utility classes on footer-inner (they do not
// load tailwind.css); that is the only allowed difference.
const normFooter = (html) => html.replace(/<div class="footer-inner[^"]*">/g, '<div class="footer-inner">');

const expected = new Map();
function chromeFor(basePath) {
  if (!expected.has(basePath)) {
    expected.set(basePath, {
      nav: renderNavbar(navbarData, { basePath }),
      footer: renderFooter(footerData, { basePath }),
    });
  }
  return expected.get(basePath);
}

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, acc);
    else if (name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const pages = [
  ...fs.readdirSync(ROOT).filter((f) => f.endsWith('.html')).map((f) => path.join(ROOT, f)),
  ...walk(path.join(ROOT, 'dive')),
  ...walk(path.join(ROOT, 'quiz')),
];

const problems = [];
let checked = 0;
for (const file of pages) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  const html = fs.readFileSync(file, 'utf8');
  const isRedirect = /<meta[^>]+http-equiv=["']refresh["']/i.test(html);
  const nested = rel.startsWith('dive/') || rel.startsWith('quiz/');
  const base = nested ? '../../' : ROOT_ABSOLUTE.has(rel) ? '/' : '';

  if (!isRedirect) {
    const want = chromeFor(base);
    const nav = html.match(NAV_RE);
    const footer = html.match(FOOTER_RE);
    if (!nav) problems.push(`${rel}: no <nav class="navbar"> block`);
    else if (nav[0] !== want.nav) problems.push(`${rel}: menu differs from navbar.json (run npm run build)`);
    if (!footer) problems.push(`${rel}: no <footer class="site-footer"> block`);
    else if (normFooter(footer[0]) !== normFooter(want.footer)) problems.push(`${rel}: footer differs from footer.json (run npm run build)`);
    checked++;
  }

  // Copy rules apply to visible page text and meta, not to embedded quiz data.
  const visible = html
    .replace(/<script\b[^>]*type=["']application\/json["'][^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<script\b(?![^>]*ld\+json)[^>]*>[\s\S]*?<\/script>/gi, '');
  const hit = visible.match(PAYWALL_RE);
  if (hit) problems.push(`${rel}: future-paywall wording "${hit[0]}"`);
}

for (const rel of ['assets/data/footer.json', 'assets/data/seo.json', 'scripts/chrome-renderer.js']) {
  const text = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const hit = text.match(PAYWALL_RE);
  if (hit) problems.push(`${rel}: future-paywall wording "${hit[0]}"`);
}

if (problems.length) {
  console.error(`check-chrome: ${problems.length} problem(s) across ${checked} pages`);
  for (const p of problems.slice(0, 40)) console.error(`  - ${p}`);
  if (problems.length > 40) console.error(`  … and ${problems.length - 40} more`);
  process.exit(1);
}
console.log(`check-chrome: ${checked} pages share one menu and footer; copy rules OK`);
