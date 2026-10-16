/**
 * Quiz quality CLI.
 *   node scripts/quiz-quality.js --stats   corpus stats (giveaway rates, length tells, positions)
 *   node scripts/quiz-quality.js --fix     strip stock distractor tails from data/quizzes/**
 *   node scripts/quiz-quality.js --lint    exit 1 on stock tails, structural issues, or new
 *                                           distractor-only endings (also run by build:quizzes),
 *                                           a correct answer >2x the longest wrong one, or the
 *                                           length-bias / absolute-word ratchet getting worse,
 *                                           or a series with reverse length bias (correct answer
 *                                           uniquely longest in <10% or uniquely shortest in >45%
 *                                           of its multiple-choice questions; series with >=100 MC)
 *   node scripts/quiz-quality.js --warnings list softer findings (correct >1.6x, absolute-word
 *                                           distractors, reverse length bias: series longest <15% or
 *                                           shortest >35%; quizzes with >=15 MC where the correct
 *                                           answer is never uniquely longest or is uniquely shortest
 *                                           in >50%) without failing
 *   node scripts/quiz-quality.js --baseline rewrite scripts/lib/quiz-quality-baseline.json from the
 *                                           current corpus (run after an improvement pass)
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
} else if (arg === '--warnings') {
  const w = Q.lintWarnings(ROOT);
  const byType = {};
  for (const x of w) {
    const t = (x.match(/\[([a-z-]+)\]/) || [])[1];
    byType[t] = (byType[t] || 0) + 1;
  }
  console.log(JSON.stringify(byType));
  w.slice(0, Number(process.argv[3] || 40)).forEach((x) => console.log('  ' + x));
} else if (arg === '--baseline') {
  const m = Q.biasMetrics(Q.loadCorpus(ROOT));
  fs.writeFileSync(Q.BASELINE_FILE, JSON.stringify(m, null, 2) + '\n', 'utf8');
  console.log(`wrote ${path.relative(ROOT, Q.BASELINE_FILE)}: ${JSON.stringify(m)}`);
} else {
  const corpus = Q.loadCorpus(ROOT);
  console.log(JSON.stringify({ ...Q.corpusStats(corpus), ...Q.biasMetrics(corpus) }, null, 2));
  console.log('per-series length ranks (correct uniquely longest / shortest):');
  for (const [s, t] of Object.entries(Q.reverseBiasFindings(corpus).series)) {
    console.log(`  ${s}: ${t.pctLongest}% / ${t.pctShortest}% of ${t.mc} MC`);
  }
  const mined = Q.mineDistractorOnlySuffixes(corpus);
  console.log(`distractor-only endings (>=5 words, >=8 uses, >=5 quizzes): ${mined.length}`);
  mined.slice(0, 15).forEach((m) => console.log(`  ${m.count} / ${m.quizzes}q  ${m.suffix}`));
}
