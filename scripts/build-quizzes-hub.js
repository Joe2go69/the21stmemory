/**
 * Builds the Living Truth Quizzes hub:
 *  - data/quizzes-index.json
 *  - Injects path cards and compact catalog shell into quizzes.html
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

function renderPathCards(quizzes) {
  const cards = Object.values(SOURCE_META)
    .map((meta) => {
      const count = quizzes.filter((q) => q.sourceId === meta.id).length;
      if (!count) return '';
      const img = meta.image
        ? `<span class="quiz-hub-path-card__media" aria-hidden="true">
  <img src="${escapeAttr(meta.image)}" alt="" class="quiz-hub-path-card__img" width="640" height="360" loading="lazy" decoding="async" />
  <span class="quiz-hub-path-card__scrim"></span>
</span>`
        : '';
      return `<button type="button" class="quiz-hub-path-card quiz-hub-path-card--${escapeAttr(meta.id)}${meta.image ? ' quiz-hub-path-card--has-media' : ''}" data-quiz-path="${escapeAttr(meta.id)}" aria-controls="quiz-browse">
  ${img}
  <span class="quiz-hub-path-card__body">
    <p class="quiz-hub-path-card__eyebrow">${escapeHtml(meta.short)}</p>
    <h2 class="quiz-hub-path-card__title">${escapeHtml(meta.title)}</h2>
    <p class="quiz-hub-path-card__desc">${escapeHtml(meta.desc || meta.short)}</p>
    <span class="quiz-hub-path-card__meta">
      <span class="quiz-hub-path-card__count">${count} quizzes</span>
      <span class="quiz-hub-path-card__cta">Browse path →</span>
    </span>
  </span>
</button>`;
    })
    .filter(Boolean)
    .join('\n');

  return `<div class="quiz-hub-paths" role="navigation" aria-label="Quiz paths">
${cards}
</div>`;
}

function renderOverview(quizzes) {
  return renderPathCards(quizzes);
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
  <p class="text-sm text-mem-muted mt-4">JavaScript is required to browse the full quiz catalog. You can also open <a href="data/quizzes-index.json">quizzes-index.json</a>.</p>
</noscript>`;
}

/** Stats strip removed — path cards + toolbar filters cover the same ground. */
function renderStats() {
  return '';
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
  const sources = Object.values(SOURCE_META).map((meta) => ({
    ...meta,
    count: quizzes.filter((q) => q.sourceId === meta.id).length,
  }));

  const index = {
    generatedAt: new Date().toISOString(),
    total: quizzes.length,
    sources,
    quizzes,
  };
  fs.writeFileSync(INDEX_OUT, JSON.stringify(index, null, 2), 'utf8');
  console.log(`Wrote data/quizzes-index.json (${quizzes.length} quizzes)`);

  if (!fs.existsSync(HUB_HTML)) {
    console.warn('quizzes.html not found — index only');
    return;
  }

  let html = fs.readFileSync(HUB_HTML, 'utf8');
  html = ensureOverviewMarkers(html);
  html = injectBlock(html, OVERVIEW_START, OVERVIEW_END, renderOverview(quizzes));

  if (html.includes(STATS_START) && html.includes(STATS_END)) {
    html = injectBlock(html, STATS_START, STATS_END, renderStats());
  }

  html = injectBlock(html, GRID_START, GRID_END, renderGroupedGrid(quizzes));
  fs.writeFileSync(HUB_HTML, html, 'utf8');
  console.log(
    `Injected path cards + lazy catalog shell (${quizzes.length} quizzes in index, ${sources.length} sources) → quizzes.html`
  );
}

main();
