/**
 * Quiz quality: stock distractor tails, structural lint, and corpus stats.
 *
 * Background: older install passes (rebalance-quiz-length.js, polish-severe-*.js)
 * padded wrong answers with generic trailing clauses so the correct option was not
 * the longest. Those clauses never appeared on correct answers, so they became a
 * stronger tell than length. STOCK_TAILS lists every known clause; stripStockTails()
 * removes them, and lintQuiz()/lintCorpus() fail the build if any come back.
 *
 * CLI: node scripts/quiz-quality.js --stats | --fix | --lint
 */
const fs = require("fs");
const path = require("path");

const STOCK_TAILS = [
  'leaving cognitive autonomy untouched and unmediated',
  'as though that single factor closed the case',
  'and treating side systems as noise rather than design',
  'as the sole operative factor in the outcome',
  'not the deeper control mechanism described by the living truth',
  'and that is treated as the entire mechanism',
  'as a one-factor story with a tidy edge',
  'without a larger engineered system underneath',
  'with no further layer required beyond that account',
  'as if no adjacent systems participated at all',
  'stopping the explanation at that boundary alone',
  'held as a complete closed account of the events',
  'and declining any account that reaches past that point',
  'without extending the chain into harvest or inversion logistics',
  'keeping every neighboring mechanism off the board',
  'with every larger system treated as clean, uninvolved, or beside the point',
  'and no hidden harvest architecture behind the scenes',
  'and no coordinated multi-system design behind it',
  'with the surrounding architecture waved away as irrelevant',
  'in any density, cycle, or historical configuration',
  'with no deeper inversion layered underneath that step',
  'so harvest logistics, density tech, and inverted narrative machinery play no part',
  'while spiritual attention and institutional trust stay fully intact',
  'disconnected from any deliberate long-game control design',
  'so no severance from that system would ever be required',
  'that mechanism alone, with no wider inversion stack required to produce the result',
  'as if liberating forces ran the prison architecture instead of dismantling it',
  'with no deliberate multi-generational control design behind the outcome at all',
  'with no blackmail structure and no proxy role for non-human overlords',
  'with no manufactured population pipeline and no blank-slate reboot',
  'with souls moving freely and no trap logistics at death or birth',
  'the complete identity of the thing, with no deeper parasitic function underneath',
  'with no artificial sky, no enclosed realm, and no engineered reset scarring',
  'casting liberating forces as operators of the prison rather than its dismantlers',
  'framed only in those terms with nothing added',
  'as a sealed explanation that needs no sequel clause',
  'and with every other driver dismissed as coincidence',
  'read as a self-limited cause with no upstream design',
  'with broader scaffolding left unnamed and unexamined',
  'stopping short of any multi-layered control model',
  'and insisting the rest of the matrix had no hand in it',
  'without assigning intent beyond that surface reading',
  'kept inside a minimal local explanation only',
  'as if complexity past that line were imaginary',
  'which would fully account for the outcome without any wider inversion architecture',
  'presented as the full identity of the thing with no deeper parasitic layer',
  'taken as a complete alternative reading that stops at that surface mechanism',
  'remaining a self-contained alternative that never invokes harvest or inversion logistics',
  'disconnected from any deliberate multi-generational control design behind events',
  'with every broader engineered system treated as irrelevant to the outcome',
  'and nothing beyond that limited account is required to explain the outcome',
  'with no deliberate long-game control design behind the outcome',
  'rather than any deeper multi-faction control model of the same events',
  'rather than any account that rejects this limited reading of the same question',
  'offered as a complete local story that needs no wider harvest architecture to make sense',
  'so any multi-layered control model is treated as unnecessary speculation about the mechanism',
  'keeping the account sealed at that surface reading with no upstream designer required',
  'and framing every larger system as coincidence rather than coordinated inversion work',
  'with the rest of the matrix dismissed as noise that never shaped the actual outcome',
  'leaving any wider engineered design out of the picture',
  'and nothing outside that narrow scope is required in this view',
  'taking that limited mechanism as the whole story',
  'full stop — no wider engineered layer in that reading',
  'and the rest of the matrix is treated as irrelevant noise',
  'treating the landscape and sky as ordinary geology and astronomy only',
  'leaving parasites, resets, and density tech entirely outside the explanation of events',
  'treating the outcome as ordinary chance rather than engineered multi-generational design',
  'with no manufactured population pipeline and no blank-slate re-education apparatus afterward',
  'as though liberating forces ran harvest logistics instead of dismantling the prison grid',
  'so narrative control through prestige institutions is dismissed as irrelevant charity noise',
  'with no loosh broadcast role and no holographic cover over any command deck hardware',
  'so biological inversion of intuition is treated as impossible under any delivery system',
  'with no demographic purge of memory-holders and no cover story for free-energy removal',
  'while spiritual attention stays free and institutional money myths hold no binding power',
  'with no proxy role for non-human overlords and no vault pipeline for confiscated evidence',
  'as if ambient vibration, sky projection, and node architecture played no part in control',
  'and no holographic shell, breakaway blondes, or loosh-harvest role in the night sky',
  'amplifying positive aether only and never redirecting planetary flow toward control grids',
  'with every larger engineered system treated as clean, uninvolved, or beside the point',
  'in any density, cycle, or configuration of the inverted realm',
  'standing as a full competing answer that rejects the deeper control reading of the question',
  'across any density, cycle, or historical configuration of the realm',
  'presented as if it were the natural or official account of events',
  'which would leave the control matrix intact and the population asleep',
  'a cover story that cannot survive contact with the deeper mechanics',
  'treating the prison architecture as if it were ordinary progress or accident',
  'as though the parasitic inversion had never engineered the outcome',
  'which collapses once the inverted timeline and harvest architecture are seen'
];

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tailBody(tail) {
  return tail
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(escapeRe)
    .join("[\\s,]+");
}

// Tail at the very end of the option (optionally followed by terminal punctuation).
// A second topic pad sometimes follows the stock tail ("…, without a larger engineered
// system underneath instead of the crystalline Second Realm path."); it goes too.
const AFTER_TAIL = "(?:\\s+(?:across|instead\\s+of|under|during|within|rather\\s+than)\\b[^;]*?)?";
const TAIL_AT_END = STOCK_TAILS.map(
  (t) =>
    new RegExp(
      "(?:\\s*[,;]\\s*|\\s+[—–-]\\s+|\\s+)" + tailBody(t) + AFTER_TAIL + "\\s*[.!?…]?\\s*$",
      "i"
    )
);
// Tail anywhere (used by lint).
const TAIL_ANYWHERE = STOCK_TAILS.map((t) => new RegExp("\\b" + tailBody(t) + "\\b", "i"));


function finishSentence(t) {
  t = String(t || '').replace(/[\s,;:—–-]+$/g, '').replace(/[ \t]{2,}/g, ' ').trim();
  if (t.length > 12 && !/[.!?…]$/.test(t) && !/^(true|false)$/i.test(t)) t += '.';
  return t;
}

/** Remove every stock tail from the end of an option (tails can be chained). */
function stripStockTails(text) {
  let t = String(text || '').trim();
  const original = t;
  for (let guard = 0; guard < 6; guard++) {
    let changed = false;
    for (const re of TAIL_AT_END) {
      const next = t.replace(re, '');
      if (next !== t && next.trim().length >= 3) {
        t = next.replace(/[\s,;:—–-]+$/g, '');
        changed = true;
      }
    }
    if (!changed) break;
  }
  return t === original ? original : finishSentence(t);
}

function hasStockTail(text) {
  return TAIL_ANYWHERE.some((re) => re.test(String(text || '')));
}

function norm(t) {
  return String(t || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function words(t) {
  return norm(t).split(' ').filter(Boolean);
}

function isTrueFalse(q) {
  const opts = q.options || [];
  return opts.length === 2 && opts.every((o) => /^(true|false)$/i.test(String(o.text).trim()));
}

/** Structural problems that should fail the build. */
function questionIssues(q) {
  const issues = [];
  const opts = q.options || [];
  const correct = opts.filter((o) => o.isCorrect);
  if (correct.length !== 1) issues.push({ type: 'correct-count', detail: `${correct.length} correct options` });
  if (isTrueFalse(q)) {
    // fine
  } else if (opts.length !== 4) {
    issues.push({ type: 'option-count', detail: `${opts.length} options (expected 4, or True/False)` });
  }
  const seen = new Map();
  for (const o of opts) {
    const k = norm(o.text);
    if (seen.has(k)) issues.push({ type: 'duplicate-option', detail: `${seen.get(k)} and ${o.label} are identical` });
    else seen.set(k, o.label);
    if (k && k === norm(q.question)) issues.push({ type: 'option-repeats-question', detail: `${o.label} repeats the question` });
    if (!o.isCorrect && hasStockTail(o.text)) {
      issues.push({ type: 'stock-tail', detail: `${o.label}: ${String(o.text).slice(-90)}` });
    }
    if (o.isCorrect && hasStockTail(o.text)) {
      issues.push({ type: 'stock-tail-on-correct', detail: `${o.label}: ${String(o.text).slice(-90)}` });
    }
  }
  return issues;
}

function loadCorpus(root) {
  const dir = path.join(root, 'data', 'quizzes');
  const quizzes = [];
  for (const source of fs.readdirSync(dir).sort()) {
    const sd = path.join(dir, source);
    if (!fs.statSync(sd).isDirectory()) continue;
    for (const f of fs.readdirSync(sd).filter((x) => x.endsWith('.json')).sort()) {
      const file = path.join(sd, f);
      quizzes.push({ source, id: f.replace(/\.json$/, ''), file, quiz: JSON.parse(fs.readFileSync(file, 'utf8')) });
    }
  }
  return quizzes;
}

/**
 * Data-driven tell finder: trailing word runs (>= minWords) that show up on many
 * wrong answers across many quizzes and never on a correct answer.
 */
function mineDistractorOnlySuffixes(corpus, { minWords = 5, maxWords = 14, minCount = 8, minQuizzes = 5 } = {}) {
  const dc = new Map();
  const cc = new Map();
  const qz = new Map();
  for (const { source, id, quiz } of corpus) {
    for (const q of quiz.questions || []) {
      for (const o of q.options || []) {
        const w = words(o.text);
        for (let k = minWords; k <= maxWords && k < w.length; k++) {
          const suf = w.slice(-k).join(' ');
          const m = o.isCorrect ? cc : dc;
          m.set(suf, (m.get(suf) || 0) + 1);
          if (!o.isCorrect) {
            if (!qz.has(suf)) qz.set(suf, new Set());
            qz.get(suf).add(`${source}/${id}`);
          }
        }
      }
    }
  }
  const hits = [...dc]
    .filter(([s, n]) => n >= minCount && !cc.get(s) && qz.get(s).size >= minQuizzes)
    .sort((a, b) => a[0].length - b[0].length);
  // keep the shortest representative of each family
  const out = [];
  for (const [s, n] of hits) {
    if (out.some((o) => s.endsWith(' ' + o.suffix))) continue;
    out.push({ suffix: s, count: n, quizzes: qz.get(s).size });
  }
  return out.sort((a, b) => b.count - a.count);
}

function corpusStats(corpus) {
  const st = {
    quizzes: corpus.length,
    questions: 0,
    multipleChoice: 0,
    trueFalse: 0,
    options: 0,
    stockTailOptions: 0,
    questionsWithAnyStockTail: 0,
    questionsWith2PlusStockTails: 0,
    questionsAllWrongTagged: 0,
    correctUniqueLongest: 0,
    correctUniqueShortest: 0,
    lengthRatioSum: 0,
    positions: { A: 0, B: 0, C: 0, D: 0 },
    duplicateOptions: 0,
    optionRepeatsQuestion: 0,
    structuralIssues: 0,
  };
  for (const { quiz } of corpus) {
    for (const q of quiz.questions || []) {
      st.questions++;
      const opts = q.options || [];
      st.options += opts.length;
      for (const i of questionIssues(q)) {
        if (i.type === 'duplicate-option') st.duplicateOptions++;
        else if (i.type === 'option-repeats-question') st.optionRepeatsQuestion++;
        else if (!i.type.startsWith('stock-tail')) st.structuralIssues++;
      }
      if (isTrueFalse(q)) {
        st.trueFalse++;
        continue;
      }
      st.multipleChoice++;
      const c = opts.find((o) => o.isCorrect);
      if (!c) continue;
      st.positions[c.label] = (st.positions[c.label] || 0) + 1;
      const wrong = opts.filter((o) => !o.isCorrect);
      const tagged = wrong.filter((o) => hasStockTail(o.text)).length;
      st.stockTailOptions += tagged;
      if (tagged) st.questionsWithAnyStockTail++;
      if (tagged >= 2) st.questionsWith2PlusStockTails++;
      if (tagged && tagged === wrong.length) st.questionsAllWrongTagged++;
      const cl = c.text.length;
      const wl = wrong.map((o) => o.text.length);
      if (cl > Math.max(...wl)) st.correctUniqueLongest++;
      if (cl < Math.min(...wl)) st.correctUniqueShortest++;
      st.lengthRatioSum += cl / (wl.reduce((a, b) => a + b, 0) / wl.length);
    }
  }
  const mc = Math.max(st.multipleChoice, 1);
  return {
    ...st,
    pctQuestionsWithAnyStockTail: +((100 * st.questionsWithAnyStockTail) / mc).toFixed(1),
    pctQuestionsWith2PlusStockTails: +((100 * st.questionsWith2PlusStockTails) / mc).toFixed(1),
    pctQuestionsAllWrongTagged: +((100 * st.questionsAllWrongTagged) / mc).toFixed(1),
    pctCorrectUniqueLongest: +((100 * st.correctUniqueLongest) / mc).toFixed(1),
    pctCorrectUniqueShortest: +((100 * st.correctUniqueShortest) / mc).toFixed(1),
    meanCorrectToWrongLength: +(st.lengthRatioSum / mc).toFixed(2),
  };
}

/** Returns a list of failures for the whole corpus (empty = pass). */
function lintCorpus(root) {
  const corpus = loadCorpus(root);
  const failures = [];
  for (const { source, id, quiz } of corpus) {
    for (const q of quiz.questions || []) {
      for (const i of questionIssues(q)) {
        failures.push(`${source}/${id} Q${q.number} [${i.type}] ${i.detail}`);
      }
    }
  }
  for (const m of mineDistractorOnlySuffixes(corpus)) {
    failures.push(
      `corpus [distractor-only-ending] "${m.suffix}" ends ${m.count} wrong answers in ${m.quizzes} quizzes and no correct answer`
    );
  }
  return failures;
}

module.exports = {
  STOCK_TAILS,
  stripStockTails,
  hasStockTail,
  questionIssues,
  loadCorpus,
  mineDistractorOnlySuffixes,
  corpusStats,
  lintCorpus,
  isTrueFalse,
  finishSentence,
};
