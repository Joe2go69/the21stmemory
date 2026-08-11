/**
 * Elevation plan verification (Phases 1–4).
 * Run: node scripts/verify-elevation.js
 *      npm run verify:elevation
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const results = [];
let failed = 0;

function check(group, name, ok, detail = '') {
  const pass = !!ok;
  results.push({ group, name, pass, detail });
  if (!pass) failed += 1;
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function fileSize(rel) {
  return fs.statSync(path.join(ROOT, rel)).size;
}

// ── Phase 1: Buttons, footer, brand assets, quiz path-first ─────
(function phase1() {
  const g = 'Elev P1';
  const css = read('assets/css/main.css');
  check(g, 'btn-primary unified cascade present', css.includes('PHASE 1') || css.includes('btn-primary--lg'));
  check(g, 'footer short message support CSS', css.includes('footer-support-message--short'));
  check(g, 'footer.json has messageShort', JSON.parse(read('assets/data/footer.json')).support?.messageShort);

  const index = read('index.html');
  check(g, 'index footer short message class', index.includes('footer-support-message--short'));
  check(g, 'index no topics-utils', !index.includes('topics-utils.js'));
  check(g, 'brand mark small', fileSize('images/21st-mark.webp') < 20 * 1024, `${fileSize('images/21st-mark.webp')} B`);
  check(g, 'favicon small', fileSize('images/favicon.webp') < 10 * 1024, `${fileSize('images/favicon.webp')} B`);

  const quizzes = read('quizzes.html');
  check(g, 'quizzes path-first markup', quizzes.includes('quiz-hub-path-card') || quizzes.includes('data-quiz-path'));
  check(g, 'quizzes no featured start-here', !quizzes.includes('quiz-hub-featured') && !quizzes.includes('Start here'));
  check(g, 'quizzes no hero featured CTAs', !quizzes.includes('Start with a featured quiz') && !quizzes.includes('Browse Alice quizzes'));
})();

// ── Phase 2: Quiz scale tools, home banners, network filters ────
(function phase2() {
  const g = 'Elev P2';
  const quizzes = read('quizzes.html');
  check(g, 'continue strip mount', quizzes.includes('quiz-continue'));
  check(g, 'sort control', quizzes.includes('quizzes-sort'));
  check(g, 'view toggle', quizzes.includes('quizzes-view-toggle') || quizzes.includes('data-quiz-view'));
  check(g, 'no show more control', !quizzes.includes('quizzes-show-more') && !quizzes.includes('quizzes-more-wrap'));

  const qjs = read('assets/js/quizzes.js');
  check(g, 'quizzes.js no pagination', !qjs.includes('QUIZ_PAGE_SIZE') && !qjs.includes('pageLimit'));
  check(g, 'quizzes.js continue strip', qjs.includes('paintContinueStrip'));

  const index = read('index.html');
  // Product hierarchy: Codex hero + Oracle focus pair (About is editorial lower, not a banner)
  check(g, 'home banner modifiers', index.includes('home-banner--product') && index.includes('home-banner--focus'));
  check(g, 'home banner srcset', index.includes('codex-banner') && index.includes('srcset'));

  const network = read('network.html');
  check(g, 'network filter bar no flex-wrap util', !/id="network-filters"[^>]*flex-wrap/.test(network));
})();

// ── Phase 3: Performance ────────────────────────────────────────
(function phase3() {
  const g = 'Elev P3';
  check(g, 'fonts.css exists', exists('assets/css/fonts.css'));
  check(g, 'main.min.css exists', exists('assets/css/main.min.css'));
  check(g, 'fonts dir has woff2', fs.readdirSync(path.join(ROOT, 'assets/fonts')).some((f) => f.endsWith('.woff2')));

  const index = read('index.html');
  check(g, 'index uses main.min.css', index.includes('main.min.css'));
  check(g, 'index uses fonts.css', index.includes('fonts.css'));
  check(g, 'index no google fonts', !index.includes('fonts.googleapis.com'));
  check(g, 'index scripts deferred', /icons\.js(?:\?[^"]*)?" defer/.test(index) && /home\.js(?:\?[^"]*)?" defer/.test(index));

  const minSize = fileSize('assets/css/main.min.css');
  const fullSize = fileSize('assets/css/main.css');
  check(g, 'min CSS smaller than source', minSize < fullSize, `${minSize} < ${fullSize}`);
  check(g, 'min CSS not stale (>50% of source after edit drift)', minSize > fullSize * 0.5);

  const quizzes = read('quizzes.html');
  check(g, 'quiz hub slim HTML', fileSize('quizzes.html') < 80 * 1024, `${fileSize('quizzes.html')} B`);
  check(g, 'lazy catalog shell', quizzes.includes('data-quiz-lazy-shell') || quizzes.includes('quiz-hub-lazy'));
  check(g, 'quizzes-index.json present', exists('data/quizzes-index.json'));

  const dive = read('dive/alice/firmament.html');
  check(g, 'dive uses main.min.css', dive.includes('main.min.css'));
  check(g, 'dive uses fonts.css', dive.includes('fonts.css'));

  check(g, 'banner 640 variant', exists('images/about-640.webp'));
  check(g, 'banner 960 variant', exists('images/about-960.webp'));
})();

// ── Phase 4: Hardening ──────────────────────────────────────────
(function phase4() {
  const g = 'Elev P4';
  const css = read('assets/css/main.css');
  check(g, 'phase 4 a11y focus rules', css.includes('PHASE 4') || css.includes('prefers-contrast'));
  check(g, 'reduced-motion rules exist', css.includes('prefers-reduced-motion'));

  const qjs = read('assets/js/quizzes.js');
  check(g, 'catalog aria-busy', qjs.includes('aria-busy'));

  for (const page of ['codex.html', 'network.html', 'topics.html', '404.html']) {
    const html = read(page);
    check(g, `${page} scripts deferred`, /<script src="assets\/js\/[^"]+" defer>/.test(html));
    check(g, `${page} skip-link or redirect`, html.includes('skip-link') || html.includes('location.replace') || page === '404.html');
  }

  check(g, 'DESIGN.md present', exists('DESIGN.md'));
  check(g, 'verify-elevation script is self', exists('scripts/verify-elevation.js'));

  // Root pages should not request Google fonts
  const roots = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));
  let google = 0;
  for (const f of roots) {
    if (read(f).includes('fonts.googleapis.com')) google += 1;
  }
  check(g, 'root HTML free of Google Fonts', google === 0, String(google));
})();

// ── Report ──────────────────────────────────────────────────────
const width = Math.max(...results.map((r) => r.name.length));
for (const r of results) {
  const mark = r.pass ? 'PASS' : 'FAIL';
  const detail = r.detail ? ` (${r.detail})` : '';
  console.log(`[${mark}] ${r.group} · ${r.name.padEnd(width)}${detail}`);
}
console.log('');
console.log(`${results.length - failed}/${results.length} checks passed`);
if (failed) {
  console.error(`${failed} failed`);
  process.exit(1);
}
console.log('Elevation verification OK');
