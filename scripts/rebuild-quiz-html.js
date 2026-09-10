/**
 * Rebuild quiz/*.html from data/quizzes/{source}/{id}.json + quiz/_template.html.
 * Does not rebalance or rewrite quiz JSON. Run after template/pipeline changes.
 *
 *   node scripts/rebuild-quiz-html.js
 */
const fs = require('fs');
const path = require('path');
const { knownSources } = require('./lib/topic-pipeline');
const { ROOT, renderQuizHtml } = require('./lib/quiz-pipeline');

function topicImageFor(source, topicId, quiz) {
  const heavyPath = path.join(ROOT, 'data', `${source}-topics`, `${topicId}.json`);
  if (fs.existsSync(heavyPath)) {
    try {
      const topic = JSON.parse(fs.readFileSync(heavyPath, 'utf8'));
      if (topic.topic_image) return topic.topic_image.replace(/^\//, '');
    } catch (_) {
      /* fall through */
    }
  }
  if (quiz && quiz.topicImage) return String(quiz.topicImage).replace(/^\//, '');
  return `images/${source}/${topicId}.webp`;
}

function main() {
  let wrote = 0;
  let skipped = 0;
  for (const source of knownSources()) {
    const dir = path.join(ROOT, 'data', 'quizzes', source);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith('.json')) continue;
      const quizPath = path.join(dir, name);
      const quiz = JSON.parse(fs.readFileSync(quizPath, 'utf8'));
      const topicId = quiz.topicId || quiz.id || name.replace(/\.json$/i, '');
      if (!quiz.questions || !quiz.questions.length) {
        skipped += 1;
        console.warn('Skip (no questions):', path.relative(ROOT, quizPath));
        continue;
      }
      const title = quiz.title || quiz.topicTitle || topicId;
      const seoDesc = quiz.seoDescription || quiz.subtitle || `Interactive Living Truth Quiz on ${title}.`;
      const html = renderQuizHtml({
        source,
        topicId,
        title,
        topicImage: topicImageFor(source, topicId, quiz),
        seoDesc,
        quiz
      });
      const outDir = path.join(ROOT, 'quiz', source);
      fs.mkdirSync(outDir, { recursive: true });
      const outPath = path.join(outDir, `${topicId}.html`);
      fs.writeFileSync(outPath, html, 'utf8');
      wrote += 1;
    }
  }
  console.log(`rebuild-quiz-html complete — ${wrote} written, ${skipped} skipped`);
}

main();
