/**
 * Install a topic and/or quiz from scripts/payloads/{id}.{topic|quiz}.js
 *
 *   node scripts/install.js topic <source> <id>
 *   node scripts/install.js quiz  <source> <id>
 *   node scripts/install.js all   <source> <id>
 *
 * Rebuilds only this dive page (plus prev/next). Does not restamp dates
 * on the rest of the archive. Sitemap lastmod is patched for new/changed URLs only.
 */
const path = require('path');
const { applyTopic, refreshTopicIndex, knownSources } = require('./lib/topic-pipeline');
const { applyQuiz } = require('./lib/quiz-pipeline');
const { buildDives } = require('./build-static-dives');
const { buildQuizzesHub } = require('./build-quizzes-hub');
const { patchSitemap } = require('./generate-sitemap');
const { verifyInstall, printReport } = require('./lib/verify-install');

function loadPayload(kind, id) {
  const payloadPath = path.join(__dirname, 'payloads', `${id}.${kind}.js`);
  let payload;
  try {
    payload = require(payloadPath);
  } catch (err) {
    throw new Error(`Missing payload ${payloadPath}: ${err.message}`);
  }
  return payload;
}

async function run(kind, source, id) {
  if (!['topic', 'quiz', 'all'].includes(kind)) {
    throw new Error('Kind must be topic, quiz, or all');
  }
  const allowed = knownSources();
  if (!allowed.includes(source) || !id) {
    throw new Error(`Usage: node scripts/install.js <topic|quiz|all> <${allowed.join('|')}> <id>`);
  }

  const doTopic = kind === 'topic' || kind === 'all';
  const doQuiz = kind === 'quiz' || kind === 'all';

  if (doTopic) {
    const payload = loadPayload('topic', id);
    if (payload.source && payload.source !== source) {
      throw new Error(`Payload source ${payload.source} != CLI ${source}`);
    }
    if (payload.id && payload.id !== id) {
      throw new Error(`Payload id ${payload.id} != CLI ${id}`);
    }
    payload.source = source;
    payload.id = id;
    await applyTopic(payload);
    refreshTopicIndex(source, id);
  }

  if (doQuiz) {
    const payload = loadPayload('quiz', id);
    if (payload.source && payload.source !== source) {
      throw new Error(`Payload source ${payload.source} != CLI ${source}`);
    }
    if (payload.id && payload.id !== id) {
      throw new Error(`Payload id ${payload.id} != CLI ${id}`);
    }
    payload.source = source;
    payload.id = id;
    applyQuiz(payload);
    refreshTopicIndex(source, id);
  }

  buildDives({ only: [{ source, id }] });
  if (doQuiz) buildQuizzesHub();

  const sitemapPaths = [`/dive/${source}/${id}.html`];
  if (doQuiz) sitemapPaths.push(`/quiz/${source}/${id}.html`);
  patchSitemap(sitemapPaths);

  const result = verifyInstall({ source, id, kind });
  printReport(result);
  if (!result.ok) process.exit(1);
}

async function main() {
  const kind = process.argv[2];
  const source = process.argv[3];
  const id = process.argv[4];
  if (!kind || !source || !id) {
    console.error('Usage: node scripts/install.js <topic|quiz|all> <alice|breakdown> <id>');
    process.exit(1);
  }
  await run(kind, source, id);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
