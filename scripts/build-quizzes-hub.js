/**
 * Builds the Living Truth Quizzes hub:
 *  - data/quizzes-index.json
 *  - Injects transmission-grouped quiz sections into quizzes.html
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
  },
  breakdown: {
    id: 'breakdown',
    label: 'Breakdown',
    title: 'Mega Breakdown Board Notes',
    short: 'Final-stage Great Awakening notes',
  },
};

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
    };

    for (const file of fs.readdirSync(sourceDir).filter((f) => f.endsWith('.json'))) {
      const raw = JSON.parse(fs.readFileSync(path.join(sourceDir, file), 'utf8'));
      const id = raw.id || raw.topicId || file.replace(/\.json$/, '');
      const questionCount =
        raw.totalQuestions ||
        (Array.isArray(raw.questions) ? raw.questions.length : 0);
      const href = `quiz/${sourceId}/${id}.html`;

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
      });
    }
  }

  quizzes.sort((a, b) => {
    if (a.sourceId !== b.sourceId) return a.sourceId.localeCompare(b.sourceId);
    return a.title.localeCompare(b.title);
  });

  return quizzes;
}

function renderCard(quiz) {
  const searchBlob = [quiz.title, quiz.subtitle, quiz.sourceLabel, quiz.sourceTitle]
    .join(' ')
    .toLowerCase();

  return `<a href="${escapeAttr(quiz.href)}" class="quiz-hub-row" data-source="${escapeAttr(quiz.sourceId)}" data-quiz-key="${escapeAttr(quiz.sourceId + '/' + quiz.id)}" data-search="${escapeAttr(searchBlob)}">
  <span class="quiz-hub-row__title">${escapeHtml(quiz.title)}</span>
  <span class="quiz-hub-row__meta">
    <span class="quiz-hub-row__count">${quiz.questionCount} Q</span>
    <span class="quiz-hub-row__score" data-quiz-score hidden></span>
    <span class="quiz-hub-row__cta">Open →</span>
  </span>
</a>`;
}

function renderSourceSection(sourceId, quizzes) {
  const meta = SOURCE_META[sourceId] || {
    id: sourceId,
    label: sourceId,
    title: sourceId,
    short: '',
  };
  const cards = quizzes.map(renderCard).join('\n');
  return `<section class="quiz-hub-section" data-source-section="${escapeAttr(sourceId)}" id="quiz-source-${escapeAttr(sourceId)}">
  <header class="quiz-hub-section__head">
    <div>
      <p class="quiz-hub-section__eyebrow">${escapeHtml(meta.short || meta.label)}</p>
      <h2 class="quiz-hub-section__title">${escapeHtml(meta.title)}</h2>
      <p class="quiz-hub-section__meta"><span class="quiz-hub-section__count" data-section-count>${quizzes.length}</span> quizzes in this transmission</p>
    </div>
    <a href="topics.html?source=${escapeAttr(sourceId)}" class="quiz-hub-section__link">Browse topics →</a>
  </header>
  <div class="quiz-hub-section__list" role="list">
${cards}
  </div>
</section>`;
}

function renderGroupedGrid(quizzes) {
  const order = Object.keys(SOURCE_META);
  const extra = [...new Set(quizzes.map((q) => q.sourceId))].filter((id) => !order.includes(id));
  const sections = [...order, ...extra]
    .map((sourceId) => {
      const list = quizzes.filter((q) => q.sourceId === sourceId);
      if (!list.length) return '';
      return renderSourceSection(sourceId, list);
    })
    .filter(Boolean);
  return sections.join('\n');
}

function renderStats(quizzes) {
  const bySource = {};
  for (const q of quizzes) {
    bySource[q.sourceId] = (bySource[q.sourceId] || 0) + 1;
  }
  const alice = bySource.alice || 0;
  const breakdown = bySource.breakdown || 0;

  return `<div class="quiz-hub-stats" aria-label="Quiz archive totals">
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
  html = injectBlock(html, STATS_START, STATS_END, renderStats(quizzes));
  html = injectBlock(html, GRID_START, GRID_END, renderGroupedGrid(quizzes));
  fs.writeFileSync(HUB_HTML, html, 'utf8');
  console.log(`Injected ${quizzes.length} cards in ${sources.length} transmission sections → quizzes.html`);
}

main();
