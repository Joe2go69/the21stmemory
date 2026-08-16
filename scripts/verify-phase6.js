/**
 * Phase 6 — full site verification across Phases 1–5.
 * Run: node scripts/verify-phase6.js
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

// ── Phase 1: Brand SEO ──────────────────────────────────────────
(function phase1() {
  const g = 'P1 Brand SEO';
  check(g, 'seo.json exists', exists('assets/data/seo.json'));
  const seo = JSON.parse(read('assets/data/seo.json'));
  const names = seo.brand?.alternateNames || [];
  check(g, 'alternateName 21stmemory', names.includes('21stmemory'));
  check(g, 'alternateName 21stMemory', names.includes('21stMemory'));
  check(g, 'sameAs includes YouTube', (seo.brand.sameAs || []).some((u) => u.includes('youtube')));
  check(g, 'og-default.webp', exists('images/og-default.webp'));
  check(g, 'apple-touch-icon.png', exists('images/apple-touch-icon.png'));

  const index = read('index.html');
  check(g, 'index theme-color', index.includes('theme-color'));
  check(g, 'index og-default', index.includes('og-default.webp'));
  check(g, 'index 21stmemory copy', index.includes('21stmemory'));
  check(g, 'index JSON-LD alternateName', index.includes('"21stmemory"'));
  check(g, 'footer domain copyright', index.includes('21stmemory.com'));

  const tw = read('tailwind.config.js');
  check(g, 'tailwind quiz content glob', tw.includes('./quiz/**/*.html'));
})();

// ── Phase 2: Quizzes hub + nav ──────────────────────────────────
(function phase2() {
  const g = 'P2 Quizzes hub';
  check(g, 'quizzes.html exists', exists('quizzes.html'));
  const q = read('quizzes.html');
  check(g, 'quizzes SEO title', q.includes('Living Truth Quizzes'));
  check(g, 'quizzes nav link', /href="quizzes\.html"[^>]*>Quizzes</.test(q));
  // Elevation redesign: path-first + featured in HTML; full catalog lazy from JSON
  check(g, 'quizzes path cards', q.includes('quiz-hub-path-card') || q.includes('data-quiz-path'));
  check(g, 'quizzes featured or overview', q.includes('quiz-hub-featured') || q.includes('QUIZZES-OVERVIEW'));
  check(g, 'quizzes lazy catalog shell', q.includes('data-quiz-lazy-shell') || q.includes('quiz-hub-lazy'));
  check(g, 'quizzes filters', q.includes('data-quiz-filter'));
  check(g, 'quizzes-index.json', exists('data/quizzes-index.json'));
  const qi = JSON.parse(read('data/quizzes-index.json'));
  check(g, 'quiz index count >= 100', qi.total >= 100 && qi.total <= 200, String(qi.total));
  check(g, 'quiz index has quiz list', Array.isArray(qi.quizzes) && qi.quizzes.length >= 100);

  const index = read('index.html');
  check(g, 'index nav Quizzes', /href="quizzes\.html"[^>]*>Quizzes</.test(index));
  check(g, 'index quiz CTA', index.includes('href="quizzes.html"'));
  check(g, 'codex quiz link', read('codex.html').includes('quizzes.html'));

  const quizNav = read('quiz/alice/nature-of-reality.html');
  check(g, 'nested quiz nav Quizzes', quizNav.includes('../../quizzes.html'));
  check(g, 'shared quiz family active', read('assets/js/shared.js').includes('isQuizFamilyPage'));
})();

// ── Phase 3: Static dives ───────────────────────────────────────
(function phase3() {
  const g = 'P3 Static dives';
  check(g, 'dive-manifest.json', exists('data/dive-manifest.json'));
  const manifest = JSON.parse(read('data/dive-manifest.json'));
  const live = (manifest.pages || []).filter((p) => p.live);
  const stubs = (manifest.pages || []).filter((p) => !p.live);
  check(g, 'live dives ~100', live.length >= 90 && live.length <= 120, String(live.length));
  check(g, 'stub dives ~64', stubs.length >= 50, String(stubs.length));

  const sample = 'dive/alice/nature-of-reality.html';
  check(g, 'live sample exists', exists(sample));
  if (exists(sample)) {
    const h = read(sample);
    check(g, 'live unique title', h.includes('Nature of Reality'));
    check(g, 'live report prerendered', h.includes('report-prerendered') || h.includes('Overview'));
    check(g, 'live Article schema', h.includes('"@type": "Article"'));
    check(g, 'live canonical path', h.includes('/dive/alice/nature-of-reality.html'));
    check(g, 'live no noindex', !h.includes('noindex'));
    check(g, 'live copy link', h.includes('data-share-action="copy-link"') || h.includes('dive-copy-link'));
  }

  const stub = 'dive/breakdown/human-sols.html';
  check(g, 'stub sample exists', exists(stub));
  if (exists(stub)) {
    check(g, 'stub noindex', read(stub).includes('noindex'));
  }

  const sm = read('sitemap.xml');
  check(g, 'sitemap has dive URLs', sm.includes('/dive/alice/nature-of-reality.html'));
  check(g, 'sitemap no query deep-dives', !sm.includes('deep-dive.html?'));
  check(g, 'sitemap excludes stub', !sm.includes('/dive/breakdown/human-sols.html'));
  check(g, 'sitemap has quizzes hub', sm.includes('/quizzes.html'));

  check(g, 'topics-utils diveUrl', read('assets/js/topics-utils.js').includes('diveUrl'));
  check(g, 'deep-dive redirect', read('assets/js/deep-dive.js').includes('maybeRedirectToStaticDive'));
  check(g, 'shell redirect /dive/', read('deep-dive.html').includes("/dive/'"));
  // Home is self-contained (no topics-utils); stats fetch + video facades live in home.js
  check(
    g,
    'home self-contained stats/video',
    read('assets/js/home.js').includes('archive-stats.json') &&
      read('assets/js/home.js').includes('setupHomeVideos')
  );
})();

// ── Phase 4: Visual / perf ──────────────────────────────────────
(function phase4() {
  const g = 'P4 Visual & perf';
  const index = read('index.html');
  check(g, 'page-home', index.includes('page-home'));
  check(g, 'page-hero', index.includes('page-hero'));
  check(g, 'section-eyebrow', index.includes('section-eyebrow'));
  check(g, 'rumble facades', index.includes('data-rumble-embed='));
  check(g, 'no auto rumble iframe on home', !/<iframe[^>]+rumble\.com\/embed/i.test(index));

  const css = read('assets/css/main.css');
  check(g, 'safe-area navbar', css.includes('safe-area-inset-top'));
  check(g, '44px touch targets', css.includes('min-height: 44px'));
  check(g, 'report 70ch', /max-width:\s*(70|58|52|48|42)ch/.test(css));

  check(g, 'source plain labels', read('assets/js/render-utils.js').includes('Foundational rabbit-hole'));
  for (const f of ['codex.html', 'quizzes.html', 'network.html', 'topics.html', '404.html']) {
    check(g, `${f} page-interior`, read(f).includes('page-interior'));
  }
})();

// ── Phase 5: Trust / hygiene ────────────────────────────────────
(function phase5() {
  const g = 'P5 Content hygiene';
  const live = read('dive/alice/nature-of-reality.html');
  check(g, 'continue learning block', live.includes('dive-continue'));
  check(g, 'network CTA on dive', live.includes('Thalon Thor Network') || live.includes('network.html'));
  check(g, 'AI disclaimer', live.includes('AI-assisted bridge') || live.includes('AI may miss'));
  check(g, 'updated stamp', /Updated \d{4}-\d{2}-\d{2}/.test(live));

  const about = read('index.html');
  check(g, 'about no process line', !about.includes('How this archive works'));
  check(g, 'about AI bridge heading', about.includes('AI is a bridge, not the source'));
  check(g, 'about AI note', about.includes('about-banner-footnote') || about.includes('about-ai-note'));

  const stub = read('dive/breakdown/human-sols.html');
  check(g, 'stub browse ready CTA', stub.includes('Browse ready topics'));

  check(g, 'SPA continue helper', read('assets/js/deep-dive.js').includes('renderContinueLearning'));

  const manifest = JSON.parse(read('data/dive-manifest.json'));
  const liveCount = manifest.pages.filter((p) => p.live).length;
  const sm = read('sitemap.xml');
  const smDive = (sm.match(/\/dive\//g) || []).length;
  check(g, 'sitemap dive count = live', smDive === liveCount, `${smDive} vs ${liveCount}`);
})();

// ── Cross-cutting integrity ─────────────────────────────────────
(function integrity() {
  const g = 'Integrity';
  check(g, 'robots.txt sitemap', read('robots.txt').includes('sitemap.xml'));
  check(g, 'CNAME domain', read('CNAME').trim() === '21stmemory.com');
  check(g, 'dive-static.js', exists('assets/js/dive-static.js'));
  check(g, 'quizzes.js', exists('assets/js/quizzes.js'));

  // Every live manifest page file exists
  const manifest = JSON.parse(read('data/dive-manifest.json'));
  let missing = 0;
  for (const p of manifest.pages || []) {
    const rel = p.path.replace(/^\//, '');
    if (!exists(rel)) missing += 1;
  }
  check(g, 'all manifest pages on disk', missing === 0, missing ? `${missing} missing` : '');

  // Nav Quizzes on major shells
  for (const f of ['index.html', 'codex.html', 'network.html', 'topics.html']) {
    check(g, `${f} has Quizzes nav`, read(f).includes('>Quizzes</a>'));
  }

  // Sitemap XML validity: no raw & in locs
  const sm = read('sitemap.xml');
  const badAmp = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((loc) => /&(?!amp;|lt;|gt;|quot;|apos;)/.test(loc));
  check(g, 'sitemap escaped ampersands', badAmp.length === 0, badAmp.slice(0, 2).join(', '));

  const urlCount = (sm.match(/<loc>/g) || []).length;
  check(g, 'sitemap URL count > 150', urlCount > 150, String(urlCount));

  // Brand assets non-empty
  const ogStat = fs.statSync(path.join(ROOT, 'images/og-default.webp'));
  check(g, 'og image non-empty', ogStat.size > 1000, String(ogStat.size));

  // community.html must remain a noindex redirect, not a full shell
  const community = read('community.html');
  check(g, 'community noindex', community.includes('noindex'));
  check(g, 'community redirects', community.includes('location.replace') || community.includes('network.html'));
  check(g, 'community not full nav chrome', !community.includes('class="navbar"'));
})();

// ── Report ──────────────────────────────────────────────────────
const byGroup = {};
for (const r of results) {
  byGroup[r.group] = byGroup[r.group] || { pass: 0, fail: 0, items: [] };
  if (r.pass) byGroup[r.group].pass += 1;
  else byGroup[r.group].fail += 1;
  byGroup[r.group].items.push(r);
}

console.log('\n══ Phase 6 Verification Report ══\n');
for (const [group, data] of Object.entries(byGroup)) {
  const status = data.fail ? 'FAIL' : 'PASS';
  console.log(`${status}  ${group}  (${data.pass} ok, ${data.fail} failed)`);
  for (const item of data.items) {
    if (!item.pass) {
      console.log(`      ✗ ${item.name}${item.detail ? ' — ' + item.detail : ''}`);
    }
  }
}

console.log(`\nTotal: ${results.length - failed}/${results.length} passed`);
if (failed) {
  console.log(`\n${failed} check(s) failed — review above.`);
} else {
  console.log('\nAll critical checks passed. Ready for deploy + Search Console sitemap submit.');
}

// Write markdown report for the user
const reportLines = [
  '# Phase 6 Verification Report',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  `**Result: ${failed ? 'FAILED' : 'PASSED'}** — ${results.length - failed}/${results.length} checks`,
  '',
];
for (const [group, data] of Object.entries(byGroup)) {
  reportLines.push(`## ${group}`);
  reportLines.push('');
  reportLines.push(`- Passed: ${data.pass}`);
  reportLines.push(`- Failed: ${data.fail}`);
  reportLines.push('');
  for (const item of data.items) {
    reportLines.push(`- ${item.pass ? '✅' : '❌'} ${item.name}${item.detail ? ` (${item.detail})` : ''}`);
  }
  reportLines.push('');
}
reportLines.push('## Post-deploy checklist (manual)');
reportLines.push('');
reportLines.push('1. Open https://21stmemory.com/ — hero, nav (Quizzes), footer, support copy');
reportLines.push('2. Open a dive URL e.g. /dive/alice/nature-of-reality.html — view-source shows report');
reportLines.push('3. Share that URL in Telegram/X — preview title/image correct');
reportLines.push('4. Google Search Console: submit sitemap.xml; inspect one dive URL');
reportLines.push('5. Watch queries `the21stmemory` vs `21stmemory` over following weeks');
reportLines.push('6. Spot-check quiz hub → one quiz flow');
reportLines.push('');

const reportPath = path.join(ROOT, 'scripts', 'PHASE6-REPORT.md');
fs.writeFileSync(reportPath, reportLines.join('\n'), 'utf8');
console.log(`Report written: scripts/PHASE6-REPORT.md`);

process.exitCode = failed ? 1 : 0;
