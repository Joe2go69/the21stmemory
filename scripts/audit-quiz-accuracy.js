/**
 * Quiz accuracy audit: is each correct answer backed by its topic report, and does
 * any wrong answer look like something the report actually says?
 *
 * Heuristic only (content-word coverage + 4-gram phrase hits against
 * data/{source}-topics/{id}.json "report"). Words from the question stem are ignored
 * so shared vocabulary does not count as support. Flags are for human review.
 *
 *   node scripts/audit-quiz-accuracy.js [--json out.json] [--md out.md]
 */
const fs = require('fs');
const path = require('path');
const { loadCorpus, isTrueFalse } = require('./lib/quiz-quality');

const ROOT = path.join(__dirname, '..');
const STOP = new Set(
  `a an the and or but of to in on at by for with from into onto upon over under as is are was were be been being has have had do does did not no nor so if then than that this these those it its their there they them which who whom whose what when where why how all any each every both few more most other some such only own same very just also can will would could should may might must shall about after before during between through within without against across per via while because until unless whether either neither yet once here again further out up down off above below`
    .split(/\s+/)
);
const WEAK = Number(process.env.QUIZ_WEAK || 0.4);
const NEG = /\b(never|no|not|none|nothing|only|without|merely|purely|solely|instead|rather|false|fake)\b/i;

function stem(w) {
  return w.replace(/(ies)$/, 'y').replace(/(ing|ed|es|s)$/, '').replace(/[-']/g, '');
}
function tokens(t) {
  return String(t || '')
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/re-?sets?/g, 'reset')
    .split(/[^a-z0-9%'-]+/)
    .filter(Boolean);
}
function content(t) {
  return tokens(t)
    .filter((w) => w.length > 2 && !STOP.has(w))
    .map(stem);
}
function grams(list, n) {
  const out = [];
  for (let i = 0; i + n <= list.length; i++) out.push(list.slice(i, i + n).join(' '));
  return out;
}

function reportFor(source, id) {
  const p = path.join(ROOT, 'data', `${source}-topics`, `${id}.json`);
  if (!fs.existsSync(p)) return null;
  const t = JSON.parse(fs.readFileSync(p, 'utf8'));
  return String(t.report || '');
}

function scoreOption(text, stemSet, rep) {
  const words = content(text).filter((w) => !stemSet.has(w));
  const uniq = [...new Set(words)];
  const hit = uniq.filter((w) => rep.words.has(w));
  const g = grams(content(text), 3).filter((x) => rep.grams.has(x) && !x.split(' ').every((w) => stemSet.has(w)));
  return {
    coverage: uniq.length ? hit.length / uniq.length : 1,
    missing: uniq.filter((w) => !rep.words.has(w)),
    phraseHits: g.length,
    n: uniq.length,
  };
}

function audit() {
  const corpus = loadCorpus(ROOT);
  const flags = [];
  let checked = 0;
  for (const { source, id, quiz } of corpus) {
    const reportText = reportFor(source, quiz.topicId || id);
    if (!reportText) {
      flags.push({ source, id, q: null, type: 'no-report', why: 'No report JSON found' });
      continue;
    }
    const rc = content(reportText);
    const rep = { words: new Set(rc), grams: new Set(grams(rc, 3)) };
    for (const q of quiz.questions || []) {
      checked++;
      const stemSet = new Set(content(q.question));
      const correct = q.options.find((o) => o.isCorrect);
      if (!correct) continue;
      if (isTrueFalse(q)) {
        // Score the statement in the stem plus the rationale of the keyed answer.
        const s = scoreOption(`${q.question} ${correct.rationale}`, new Set(), rep);
        if (s.coverage < 0.45 && s.phraseHits === 0) {
          flags.push({ source, id, q: q.number, type: 'tf-weak', score: +s.coverage.toFixed(2), question: q.question, correct: correct.text, rationale: correct.rationale, missing: s.missing.slice(0, 8) });
        }
        continue;
      }
      const cs = scoreOption(correct.text, stemSet, rep);
      if (cs.n >= 3 && cs.coverage < WEAK && cs.phraseHits === 0) {
        flags.push({ source, id, q: q.number, type: 'correct-weak', score: +cs.coverage.toFixed(2), question: q.question, correct: correct.text, missing: cs.missing.slice(0, 8) });
      }
      const negStem = /\b(NOT|EXCEPT)\b/.test(q.question);
      for (const o of q.options) {
        if (o.isCorrect || negStem) continue;
        const ws = scoreOption(o.text, stemSet, rep);
        if (
          !NEG.test(o.text) &&
          ws.n >= 4 &&
          ws.coverage >= 0.85 &&
          ws.phraseHits >= 2 &&
          ws.coverage >= cs.coverage + 0.1 &&
          ws.phraseHits > cs.phraseHits
        ) {
          flags.push({ source, id, q: q.number, type: 'distractor-supported', score: +ws.coverage.toFixed(2), correctScore: +cs.coverage.toFixed(2), question: q.question, correct: correct.text, distractor: o.text, label: o.label });
        }
      }
    }
  }
  return { checked, flags };
}

if (require.main === module) {
  const { checked, flags } = audit();
  const by = {};
  for (const f of flags) by[f.type] = (by[f.type] || 0) + 1;
  console.log(`Checked ${checked} questions; flags:`, by);
  const ji = process.argv.indexOf('--json');
  if (ji > 0) fs.writeFileSync(process.argv[ji + 1], JSON.stringify(flags, null, 2));
}

module.exports = { audit };
