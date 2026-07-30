/**
 * Builds the Living Truth Quizzes hub:
 *  - data/quizzes-index.json
 *  - Injects path cards, featured set, and compact catalog into quizzes.html
 *
 * Run: node scripts/build-quizzes-hub.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const QUIZZES_DIR = path.join(ROOT, 'data', 'quizzes');
const INDEX_OUT = path.join(ROOT, 'data', 'quizzes-index.json');
const HUB_HTML = path.join(ROOT, 'quizzes.html');

const SOURCE_META = {
  alice: {
    id: 'alice',
    label: 'Alice',
    title: 'Following Alice in the Rabbit Hole',
    short: 'Foundational rabbit-hole transmission',
    desc: 'Core rabbit-hole topics — density, history, control systems, and the path of remembering.',
    image: 'images/alice-codex-card.webp',
  },
  breakdown: {
    id: 'breakdown',
    label: 'Breakdown',
    title: 'Mega Breakdown Board Notes',
    short: 'Final-stage Great Awakening notes',
    desc: 'Board-note deep dives on the grid, timelines, and the architecture of the shift.',
    image: 'images/breakdown-codex-card.webp',
  },
};

/** Curated “Start here” keys (sourceId/id). Falls back if missing. */
const FEATURED_KEYS = [
  'alice/essence-of-the-transmission',
  'alice/3rd-density-overlays',
  'alice/amnesia-vortex',
  'alice/fake-linear-time',
  'alice/firmament',
  'alice/control-mechanisms',
  'breakdown/essence-of-the-transmission',
  'breakdown/crystalline-architecture',
  'breakdown/frequency-trick',
];

const OVERVIEW_START = '<!-- QUIZZES-OVERVIEW-START -->';
const OVERVIEW_END = '<!-- QUIZZES-OVERVIEW-END -->';
const GRID_START = '<!-- QUIZZES-GRID-START -->';
const GRID_END = '<!-- QUIZZES-GRID-END -->';
const STATS_START = '<!-- QUIZZES-STATS-START -->';
const STATS_END = '<!-- QUIZZES-STATS-END -->';

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, '&#39;');
}

function collectQuizzes() {
  const quizzes = [];
  if (!fs.existsSync(QUIZZES_DIR)) return quizzes;

  for (const sourceId of fs.readdirSync(QUIZZES_DIR)) {
    const sourceDir = path.join(QUIZZES_DIR, sourceId);
    if (!fs.statSync(sourceDir).isDirectory()) continue;
    const meta = SOURCE_META[sourceId] || {
      id: sourceId,
      label: sourceId,
      title: sourceId,
      short: '',
      desc: '',
    };

    for (const file of fs.readdirSync(sourceDir).filter((f) => f.endsWith('.json'))) {
      const raw = JSON.parse(fs.readFileSync(path.join(sourceDir, file), 'utf8'));
      const id = raw.id || raw.topicId || file.replace(/\.json$/, '');
      const questionCount =
        raw.totalQuestions ||
        (Array.isArray(raw.questions) ? raw.questions.length : 0);
      const href = `quiz/${sourceId}/${id}.html`;
      const key = `${sourceId}/${id}`;
      const featured = FEATURED_KEYS.includes(key);

      quizzes.push({
        id,
        sourceId,
        sourceLabel: meta.label,
        sourceTitle: meta.title,
        sourceShort: meta.short,
        title: raw.title || raw.topicTitle || id,
        subtitle: raw.subtitle || raw.description || '',
        questionCount,
        href,
        diveHref: `dive/${sourceId}/${id}.html`,
        featured,
        key,
      });
    }
  }

  quizzes.sort((a, b) => {
    if (a.sourceId !== b.sourceId) return a.sourceId.localeCompare(b.sourceId);
    return a.title.localeCompare(b.title);
  });

  return quizzes;
}

function pickFeatured(quizzes) {
  const byKey = new Map(quizzes.map((q) => [q.key, q]));
  const picked = [];
  for (const key of FEATURED_KEYS) {
    const q = byKey.get(key);
    if (q) picked.push(q);
  }
  // Fallback fill from Alice then Breakdown if curated list is short
  if (picked.length < 6) {
    for (const q of quizzes) {
      if (picked.length >= 9) break;
      if (!picked.includes(q)) picked.push(q);
    }
  }
  return picked.slice(0, 9);
}

function renderPathCards(quizzes) {
  const cards = Object.values(SOURCE_META)
    .map((meta) => {
      const count = quizzes.filter((q) => q.sourceId === meta.id).length;
      if (!count) return '';
      return `<button type="button" class="quiz-hub-path-card quiz-hub-path-card--${escapeAttr(meta.id)}" data-quiz-path="${escapeAttr(meta.id)}" aria-controls="quiz-browse">
  <p class="quiz-hub-path-card__eyebrow">${escapeHtml(meta.short)}</p>
  <h2 class="quiz-hub-path-card__title">${escapeHtml(meta.title)}</h2>
  <p class="quiz-hub-path-card__desc">${escapeHtml(meta.desc || meta.short)}</p>
  <div class="quiz-hub-path-card__meta">
    <span class="quiz-hub-path-card__count">${count} quizzes</span>
    <span class="quiz-hub-path-card__cta">Browse path →</span>
  </div>
</button>`;
    })
    .filter(Boolean)
    .join('\n');

  return `<div class="quiz-hub-paths" role="navigation" aria-label="Quiz paths">
${cards}
</div>`;
}

function renderFeatured(featured) {
  if (!featured.length) return '';
  const cards = featured
    .map((quiz) => {
      const badgeMod =
        quiz.sourceId === 'breakdown' ? ' quiz-hub-featured-card__badge--breakdown' : '';
      return `<a href="${escapeAttr(quiz.href)}" class="quiz-hub-featured-card" data-source="${escapeAttr(quiz.sourceId)}" data-quiz-key="${escapeAttr(quiz.key)}">
  <span class="quiz-hub-featured-card__badge${badgeMod}">${escapeHtml(quiz.sourceLabel)}</span>
  <span class="quiz-hub-featured-card__title">${escapeHtml(quiz.title)}</span>
  <p class="quiz-hub-featured-card__sub">${escapeHtml(quiz.subtitle)}</p>
  <span class="quiz-hub-featured-card__foot">
    <span class="quiz-hub-featured-card__count">${quiz.questionCount} questions</span>
    <span class="quiz-hub-featured-card__cta">Start quiz →</span>
  </span>
</a>`;
    })
    .join('\n');

  return `<section class="quiz-hub-featured" aria-labelledby="quiz-featured-title">
  <div class="quiz-hub-featured__head">
    <h2 id="quiz-featured-title" class="quiz-hub-featured__title">Start here</h2>
    <p class="quiz-hub-featured__hint">Curated entry points · ${featured.length} picks</p>
  </div>
  <div class="quiz-hub-featured__grid">
${cards}
  </div>
</section>`;
}

function renderOverview(quizzes) {
  const featured = pickFeatured(quizzes);
  return `${renderPathCards(quizzes)}
${renderFeatured(featured)}`;
}

function renderRow(quiz) {
  const searchBlob = [quiz.title, quiz.subtitle, quiz.sourceLabel, quiz.sourceTitle]
    .join(' ')
    .toLowerCase();

  return `<a href="${escapeAttr(quiz.href)}" class="quiz-hub-row quiz-hub-card" role="listitem" data-source="${escapeAttr(quiz.sourceId)}" data-quiz-key="${escapeAttr(quiz.key)}" data-search="${escapeAttr(searchBlob)}">
  <span class="quiz-hub-row__body">
    <span class="quiz-hub-card__title quiz-hub-row__title">${escapeHtml(quiz.title)}</span>
    <span class="quiz-hub-card__meta quiz-hub-row__meta">
      <span class="quiz-hub-card__count quiz-hub-row__count">${quiz.questionCount} Q</span>
      <span class="quiz-hub-card__score quiz-hub-row__score" data-quiz-score hidden></span>
    </span>
  </span>
  <span class="quiz-hub-card__cta quiz-hub-row__cta">Open →</span>
</a>`;
}

function renderSourceSection(sourceId, quizzes) {
  const meta = SOURCE_META[sourceId] || {
    id: sourceId,
    label: sourceId,
    title: sourceId,
    short: '',
  };
  const rows = quizzes.map(renderRow).join('\n');
  return `<section class="quiz-hub-section" data-source-section="${escapeAttr(sourceId)}" id="quiz-source-${escapeAttr(sourceId)}">
  <header class="quiz-hub-section__head">
    <div>
      <p class="quiz-hub-section__eyebrow">${escapeHtml(meta.short || meta.label)}</p>
      <h2 class="quiz-hub-section__title">${escapeHtml(meta.title)}</h2>
      <p class="quiz-hub-section__meta"><span class="quiz-hub-section__count" data-section-count>${quizzes.length}</span> quizzes in this transmission</p>
    </div>
    <a href="topics.html?source=${escapeAttr(sourceId)}" class="quiz-hub-section__link">Browse topics →</a>
  </header>
  <div class="quiz-hub-section__grid" role="list">
${rows}
  </div>
</section>`;
}

function renderGroupedGrid(quizzes) {
  // Phase 3: catalog is lazy-loaded from quizzes-index.json (keeps hub HTML light).
  // Leave a lightweight shell so progressive enhancement / SEO still has structure hooks.
  void quizzes;
  return `<div class="quiz-hub-lazy-shell" data-quiz-lazy-shell>
  <p class="quiz-hub-lazy-note text-sm text-mem-muted">Loading catalog…</p>
</div>
<noscript>
  <p class="text-sm text-mem-muted mt-4">JavaScript is required to browse the full quiz catalog. Featured quizzes above work without it, or open <a href="data/quizzes-index.json">quizzes-index.json</a>.</p>
</noscript>`;
}

function renderStats(quizzes) {
  const bySource = {};
  for (const q of quizzes) {
    bySource[q.sourceId] = (bySource[q.sourceId] || 0) + 1;
  }
  const alice = bySource.alice || 0;
  const breakdown = bySource.breakdown || 0;

  // Compact totals kept for filter affordance (hidden in overview CSS if needed)
  return `<div class="quiz-hub-stats quiz-hub-stats--compact" aria-label="Quiz archive totals" hidden>
  <button type="button" class="quiz-hub-stat is-active" data-quiz-filter="all" aria-pressed="true">
    <div class="quiz-hub-stat__value">${quizzes.length}</div>
    <div class="quiz-hub-stat__label">All quizzes</div>
  </button>
  <button type="button" class="quiz-hub-stat" data-quiz-filter="alice" aria-pressed="false">
    <div class="quiz-hub-stat__value">${alice}</div>
    <div class="quiz-hub-stat__label">Alice transmission</div>
  </button>
  <button type="button" class="quiz-hub-stat" data-quiz-filter="breakdown" aria-pressed="false">
    <div class="quiz-hub-stat__value">${breakdown}</div>
    <div class="quiz-hub-stat__label">Mega Breakdown</div>
  </button>
</div>`;
}

function injectBlock(html, start, end, content) {
  const startIdx = html.indexOf(start);
  const endIdx = html.indexOf(end);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    throw new Error(`Markers not found: ${start} … ${end}`);
  }
  return (
    html.slice(0, startIdx + start.length) +
    '\n' +
    content +
    '\n' +
    html.slice(endIdx)
  );
}

function ensureOverviewMarkers(html) {
  if (html.includes(OVERVIEW_START) && html.includes(OVERVIEW_END)) {
    return html;
  }
  // Insert overview markers after page-shell open / before stats
  const shell = 'page-shell page-shell--after-hero';
  const idx = html.indexOf(shell);
  if (idx === -1) {
    throw new Error('Could not find quiz hub page-shell to inject overview markers');
  }
  const afterOpen = html.indexOf('>', idx);
  if (afterOpen === -1) throw new Error('Malformed page-shell tag');
  const insertAt = afterOpen + 1;
  const block = `\n        ${OVERVIEW_START}\n        ${OVERVIEW_END}\n`;
  return html.slice(0, insertAt) + block + html.slice(insertAt);
}

function main() {
  const quizzes = collectQuizzes();
  const featured = pickFeatured(quizzes);
  const sources = Object.values(SOURCE_META).map((meta) => ({
    ...meta,
    count: quizzes.filter((q) => q.sourceId === meta.id).length,
  }));

  const index = {
    generatedAt: new Date().toISOString(),
    total: quizzes.length,
    sources,
    featured: featured.map((q) => q.key),
    quizzes,
  };
  fs.writeFileSync(INDEX_OUT, JSON.stringify(index, null, 2), 'utf8');
  console.log(`Wrote data/quizzes-index.json (${quizzes.length} quizzes, ${featured.length} featured)`);

  if (!fs.existsSync(HUB_HTML)) {
    console.warn('quizzes.html not found — index only');
    return;
  }

  let html = fs.readFileSync(HUB_HTML, 'utf8');
  html = ensureOverviewMarkers(html);
  html = injectBlock(html, OVERVIEW_START, OVERVIEW_END, renderOverview(quizzes));

  if (html.includes(STATS_START) && html.includes(STATS_END)) {
    html = injectBlock(html, STATS_START, STATS_END, renderStats(quizzes));
  }

  html = injectBlock(html, GRID_START, GRID_END, renderGroupedGrid(quizzes));
  fs.writeFileSync(HUB_HTML, html, 'utf8');
  console.log(
    `Injected overview + lazy catalog shell (${quizzes.length} quizzes in index, ${sources.length} sources) → quizzes.html`
  );
}

main();
