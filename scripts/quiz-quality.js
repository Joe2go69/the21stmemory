/**
 * Quiz quality CLI.
 *   node scripts/quiz-quality.js --stats   corpus stats (giveaway rates, length tells, positions)
 *   node scripts/quiz-quality.js --fix     strip stock distractor tails from data/quizzes/**
 *   node scripts/quiz-quality.js --lint    exit 1 on stock tails, structural issues, or new
 *                                           distractor-only endings (also run by build:quizzes)
 */
const fs = require('fs');
const path = require('path');
const Q = require('./lib/quiz-quality');

const ROOT = path.join(__dirname, '..');

function fix() {
  const corpus = Q.loadCorpus(ROOT);
  let changedOptions = 0;
  let changedQuestions = 0;
  let changedFiles = 0;
  for (const { file, quiz } of corpus) {
    let fileChanged = false;
    for (const q of quiz.questions || []) {
      let qChanged = false;
      for (const o of q.options || []) {
        if (o.isCorrect) continue;
        const next = Q.stripStockTails(o.text);
        if (next !== o.text) {
          o.text = next;
          changedOptions++;
          qChanged = true;
        }
      }
      if (qChanged) {
        changedQuestions++;
        fileChanged = true;
      }
    }
    if (fileChanged) {
      fs.writeFileSync(file, JSON.stringify(quiz, null, 2) + '\n', 'utf8');
      changedFiles++;
    }
  }
  console.log(JSON.stringify({ changedFiles, changedQuestions, changedOptions }));
}

const arg = process.argv[2] || '--stats';
if (arg === '--fix') fix();
else if (arg === '--lint') {
  const failures = Q.lintCorpus(ROOT);
  if (failures.length) {
    console.error(`Quiz lint failed (${failures.length}):`);
    failures.slice(0, 40).forEach((f) => console.error('  ' + f));
    process.exit(1);
  }
  console.log('Quiz lint passed.');
} else {
  const corpus = Q.loadCorpus(ROOT);
  console.log(JSON.stringify(Q.corpusStats(corpus), null, 2));
  const mined = Q.mineDistractorOnlySuffixes(corpus);
  console.log(`distractor-only endings (>=5 words, >=8 uses, >=5 quizzes): ${mined.length}`);
  mined.slice(0, 15).forEach((m) => console.log(`  ${m.count} / ${m.quizzes}q  ${m.suffix}`));
}
