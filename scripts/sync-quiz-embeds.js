/**
 * Keep built quiz pages in step with data/quizzes/{source}/{id}.json without
 * regenerating the whole page (rebuild-quiz-html.js does that, but later build
 * steps add chrome/SEO that a full regenerate would duplicate).
 *
 * For every quiz/{source}/{id}.html this rewrites only:
 *   - the inline <script id="quiz-data"> JSON (so edits to quiz JSON ship), and
 *   - the <noscript> intro (title, description, question count, direct dive link).
 * Idempotent; part of `npm run build`.
 *
 *   node scripts/sync-quiz-embeds.js
 */
const fs = require('fs');
const path = require('path');
const { ROOT, embedQuizJson } = require('./lib/quiz-pipeline');

const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
const unesc = (v) =>
  String(v ?? '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const template = fs.readFileSync(path.join(ROOT, 'quiz', '_template.html'), 'utf8');
const NOSCRIPT_RE = /[ \t]*<noscript>[\s\S]*?<\/noscript>/;
const tplNoscript = template.match(NOSCRIPT_RE);
if (!tplNoscript || !tplNoscript[0].includes('quiz-noscript')) {
  throw new Error('quiz/_template.html: quiz <noscript> block not found');
}

function pageDescription(html, quiz, title) {
  const m = html.match(/<meta name="description" content="([^"]*)"/);
  const raw = m ? unesc(m[1]).replace(/\s*—\s*from the 21st Memory archive\.?\s*$/, '') : '';
  return raw || quiz.seoDescription || quiz.subtitle || `Interactive Living Truth Quiz on ${title}.`;
}

function main() {
  let changed = 0;
  let checked = 0;
  const quizRoot = path.join(ROOT, 'data', 'quizzes');
  for (const source of fs.readdirSync(quizRoot)) {
    const dir = path.join(quizRoot, source);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const name of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
      const quiz = JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
      const topicId = quiz.topicId || quiz.id || name.replace(/\.json$/, '');
      const htmlPath = path.join(ROOT, 'quiz', source, `${topicId}.html`);
      if (!fs.existsSync(htmlPath)) continue;
      checked += 1;
      const before = fs.readFileSync(htmlPath, 'utf8');
      const title = quiz.title || quiz.topicTitle || topicId;
      const count = Array.isArray(quiz.questions) ? quiz.questions.length : quiz.totalQuestions || 25;
      const noscript = tplNoscript[0]
        .replace(/__TOPIC_TITLE__/g, () => esc(title))
        .replace(/__SEO_DESC__/g, () => esc(pageDescription(before, quiz, title)))
        .replace(/__QUESTION_COUNT__/g, () => String(count))
        .replace(/__SOURCE__/g, () => source)
        .replace(/__TOPIC_ID__/g, () => topicId);
      let after = before.replace(NOSCRIPT_RE, () => noscript);
      after = after.replace(
        /(<script type="application\/json" id="quiz-data">)[\s\S]*?(<\/script>)/,
        (_, open, close) => `${open}${embedQuizJson(quiz)}${close}`
      );
      if (after !== before) {
        fs.writeFileSync(htmlPath, after, 'utf8');
        changed += 1;
      }
    }
  }
  console.log(`sync-quiz-embeds: ${changed} of ${checked} quiz pages updated`);
}

main();
