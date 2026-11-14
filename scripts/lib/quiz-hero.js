/**
 * Pre-render the top of a quiz page's start card (back links + topic art)
 * inside #quiz-root, so the hero image (the page's LCP) is in the first HTML
 * the browser reads: loaded eagerly at fetchpriority="high", from the small
 * display copies (images/thumbs/{source}/{id}-640.webp …) instead of the full
 * original. quiz.js then paints the full start card over it with the same image.
 *
 *   applyQuizHero(html, { source, topicId }) -> html
 *
 * Used by scripts/sync-quiz-chrome.js (all quiz pages, every build) and by the
 * quiz installer (scripts/lib/quiz-pipeline.js) for new quizzes.
 */
const fs = require('fs');
const path = require('path');
const { topicSrcset } = require('./image-variants');

const ROOT = path.join(__dirname, '..', '..');
const BASE = '../../';
// .quiz-card is at most 46rem wide (quiz.css); the hero spans the card.
const QUIZ_HERO_SIZES = '(max-width: 46rem) calc(100vw - 3rem), 46rem';
const ROOT_REGEX = /<div id="quiz-root"([^>]*)>(?:<!-- quiz-prerender:start -->[\s\S]*?<!-- quiz-prerender:end -->)?<\/div>/;

function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function encodePath(p) {
  return String(p).split('/').map(encodeURIComponent).join('/');
}

const indexCache = new Map();
/** topic_image for one topic, from data/{source}-topics-index.json (then the content file). */
function indexImages(source) {
  if (indexCache.has(source)) return indexCache.get(source);
  const map = new Map();
  const p = path.join(ROOT, 'data', `${source}-topics-index.json`);
  const walk = (items) => {
    for (const t of items || []) {
      if (t && t.id && t.topic_image) map.set(t.id, String(t.topic_image));
      walk(t && t.subtopics);
    }
  };
  if (fs.existsSync(p)) {
    try {
      walk(JSON.parse(fs.readFileSync(p, 'utf8')).topics);
    } catch {
      /* unreadable index: fall back below */
    }
  }
  indexCache.set(source, map);
  return map;
}

function topicImageFor(source, topicId) {
  let rel = indexImages(source).get(topicId) || '';
  if (!rel) {
    const dataPath = path.join(ROOT, 'data', `${source}-topics`, `${topicId}.json`);
    try {
      rel = String(JSON.parse(fs.readFileSync(dataPath, 'utf8')).topic_image || '');
    } catch {
      rel = '';
    }
  }
  rel = rel.replace(/\\/g, '/').replace(/^\.?\//, '');
  if (!rel || /placeholder/i.test(rel) || !fs.existsSync(path.join(ROOT, rel))) {
    rel = `images/${source}/${topicId}.webp`;
  }
  return fs.existsSync(path.join(ROOT, rel)) ? rel : '';
}

function prerenderHtml(source, topicId, rel) {
  const srcset = topicSrcset(rel, (p) => BASE + encodePath(p));
  const src = BASE + encodePath(srcset ? rel.replace(/^images\/([\w-]+)\/(.+)\.webp$/, 'images/thumbs/$1/$2-640.webp') : rel);
  const srcsetAttr = srcset ? ` srcset="${esc(srcset)}" sizes="${QUIZ_HERO_SIZES}"` : '';
  return `<!-- quiz-prerender:start --><div class="quiz-shell"><div class="quiz-back-row"><a href="/quizzes.html?browse=1&amp;source=${esc(source)}&amp;focus=${esc(topicId)}#quiz-${esc(source)}-${esc(topicId)}" class="text-link quiz-back-link">← Quizzes</a><span class="quiz-back-row__more"><a href="${BASE}dive/${esc(source)}/${esc(topicId)}.html" class="text-link">Topic</a><span class="quiz-back-row__dot" aria-hidden="true">·</span><a href="/codex.html" class="text-link">Codex</a></span></div><div class="quiz-card quiz-card--start quiz-card--prerender"><div class="quiz-hero"><img src="${esc(src)}"${srcsetAttr} alt="" width="1280" height="720" loading="eager" fetchpriority="high" decoding="async"></div></div></div><!-- quiz-prerender:end -->`;
}

function applyQuizHero(html, { source, topicId }) {
  if (!ROOT_REGEX.test(html)) return html;
  const rel = source && topicId ? topicImageFor(source, topicId) : '';
  return html.replace(ROOT_REGEX, (m, attrs) => {
    // data-topic-image tells quiz.js which art to use (not the share card in og:image).
    const clean = attrs.replace(/\s+data-topic-(?:image|srcset)="[^"]*"/g, '');
    if (!rel) return `<div id="quiz-root"${clean}></div>`;
    const srcset = topicSrcset(rel, (p) => BASE + encodePath(p));
    const extra = ` data-topic-image="${esc(BASE + encodePath(rel))}"${srcset ? ` data-topic-srcset="${esc(srcset)}"` : ''}`;
    const withExtra = clean.replace(/(\s+aria-live=)/, `${extra}$1`);
    const finalAttrs = withExtra === clean ? `${clean}${extra}` : withExtra;
    return `<div id="quiz-root"${finalAttrs}>${prerenderHtml(source, topicId, rel)}</div>`;
  });
}

module.exports = { applyQuizHero, QUIZ_HERO_SIZES };
