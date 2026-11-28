/**
 * Pre-render the series cards on the browse pages (Codex and the topics.html
 * series chooser) straight into the HTML.
 *
 * Why: the first series card is the largest thing on screen (Lighthouse LCP).
 * When JavaScript painted it after loading the topic indexes, phones waited
 * ~4.5 s for it and the grid jumped into place (layout shift). Now the browser
 * finds the image in the first HTML it reads, loads it eagerly with
 * fetchpriority="high", and the JS re-renders the same cards in place.
 *
 * The cards come from the same renderer the browser uses
 * (RenderUtils.renderSourceCard) and the same data files, so they match.
 * The live counts are refreshed by the page script on load.
 *
 * Run after data changes (part of `npm run build`):
 *   node scripts/build-browse-cards.js
 */
const fs = require('fs');
const path = require('path');
const { TopicUtils, RenderUtils } = require('./lib/browser-renderers');

const ROOT = path.join(__dirname, '..');

// Same visual order as assets/js/codex.js (CODEX_SERIES_RANK).
const CODEX_SERIES_RANK = ['mind-map', 'revelations', 'alice', 'breakdown', 'ascension', 'special-requests'];

const CHOOSER_HEADER = `
      <header class="page-hero page-hero--interior max-w-3xl mx-auto text-center">
        <h1 class="page-hero-title page-hero-title--hub font-semibold tracking-tighter leading-none mb-4">Choose a transmission</h1>
        <p class="page-hero-lead max-w-xl mx-auto text-base md:text-lg text-mem-muted font-normal mb-3">Each Codex shelf is one source series. Open one to browse its topics.</p>
        <p class="mb-0"><a href="codex.html" class="text-link">← Back to Codex</a></p>
      </header>
    `;

function loadSeries() {
  const { sources } = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources.json'), 'utf8'));
  return sources.map((s) => {
    const indexPath = path.join(ROOT, 'data', `${s.id}-topics-index.json`);
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    const topics = TopicUtils.normalizeTopicsFromIndex(index.topics || []);
    const stats = TopicUtils.countTopicStats(topics);
    return {
      id: s.id,
      title: index.title || s.title,
      subtitle: index.subtitle || '',
      description: index.description || '',
      card_blurb: index.card_blurb || '',
      image: index.image || '',
      stats
    };
  });
}

function cardsHtml(series) {
  return series
    .map((source, index) =>
      RenderUtils.renderSourceCard(source, {
        soonCount: Math.max(0, (source.stats.total || 0) - (source.stats.live || 0)),
        eager: index === 0
      }).trim()
    )
    .join('\n');
}

function replaceBetween(html, name, inner, file) {
  const re = new RegExp(`(<!-- ${name}:start -->)[\\s\\S]*?(<!-- ${name}:end -->)`);
  if (!re.test(html)) throw new Error(`${file}: missing <!-- ${name}:start/end --> markers`);
  return html.replace(re, `$1\n${inner}\n$2`);
}

function writeIfChanged(file, html) {
  const abs = path.join(ROOT, file);
  if (fs.readFileSync(abs, 'utf8') !== html) {
    fs.writeFileSync(abs, html, 'utf8');
    return true;
  }
  return false;
}

function buildBrowseCards() {
  const series = loadSeries();
  const rank = (s) => {
    const i = CODEX_SERIES_RANK.indexOf(s.id);
    return i === -1 ? CODEX_SERIES_RANK.length : i;
  };
  const codexOrder = [...series].sort((a, b) => rank(a) - rank(b));

  const changed = [];
  let codex = fs.readFileSync(path.join(ROOT, 'codex.html'), 'utf8');
  codex = replaceBetween(codex, 'codex-series-cards', cardsHtml(codexOrder), 'codex.html');
  if (writeIfChanged('codex.html', codex)) changed.push('codex.html');

  // topics.html with no ?source= is the series chooser (sources.json order).
  // build-series-pages.js strips these blocks again for series-*.html.
  let topics = fs.readFileSync(path.join(ROOT, 'topics.html'), 'utf8');
  topics = replaceBetween(
    topics,
    'chooser-header',
    `        <div id="source-header" class="source-hero-host mb-0" aria-busy="false">${CHOOSER_HEADER}</div>`,
    'topics.html'
  );
  topics = replaceBetween(
    topics,
    'chooser-cards',
    `        <div id="topics-container" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch min-h-[400px]" aria-busy="false">\n` +
      `<h2 class="sr-only">Series</h2>\n${cardsHtml(series)}\n        </div>`,
    'topics.html'
  );
  if (writeIfChanged('topics.html', topics)) changed.push('topics.html');

  console.log(`Browse cards: ${series.length} series pre-rendered${changed.length ? ` (${changed.join(', ')} updated)` : ''}`);
}

module.exports = { buildBrowseCards };

if (require.main === module) buildBrowseCards();
