/**
 * Rebalance quiz option order and length tells.
 * - Shuffles options so correct answers spread across A/B/C/D (seeded, stable)
 * - Expands short wrong options so "longest answer = correct" is less reliable
 *
 * Usage:
 *   node scripts/rebalance-quiz-options.js
 *   node scripts/rebalance-quiz-options.js data/quizzes/alice/grey-ets.json
 *   node scripts/rebalance-quiz-options.js --all-alice
 *   node scripts/rebalance-quiz-options.js --min-a 15
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LABELS = ['A', 'B', 'C', 'D'];

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffle(arr, rand) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Expand a short wrong option so length is less of a tell. Keeps the claim wrong. */
function expandWrong(text, targetLen, rand) {
  let t = (text || '').trim();
  if (t.length >= targetLen) return t;

  const tails = [
    ', presented as if it were the natural or official account of events',
    ', which would leave the control matrix intact and the population asleep',
    ' — a cover story that cannot survive contact with the deeper mechanics',
    ', treating the prison architecture as if it were ordinary progress or accident',
    ', as though the parasitic inversion had never engineered the outcome',
    ' and ignoring the deliberate design of the subjugation systems',
    ', which collapses once the inverted timeline and harvest architecture are seen',
  ];

  // Prefer one solid expansion; add a second only if still short
  let i = Math.floor(rand() * tails.length);
  if (!/[.!?]$/.test(t)) {
    // Keep as one flowing sentence when original had no terminal punct
    t = t.replace(/[.;,\s]+$/, '') + tails[i];
  } else {
    t = t.replace(/[.!?]\s*$/, '') + tails[i] + '.';
  }

  if (t.length < targetLen * 0.85) {
    const j = (i + 3) % tails.length;
    t = t.replace(/[.!?]\s*$/, '') + tails[j] + '.';
  }

  // Soft cap so wrongs do not become essays
  if (t.length > targetLen * 1.35 && targetLen > 40) {
    t = t.slice(0, Math.floor(targetLen * 1.25));
    const cut = t.lastIndexOf(' ');
    if (cut > 40) t = t.slice(0, cut);
    if (!/[.!?]$/.test(t)) t += '.';
  }

  return t.replace(/[ \t]{2,}/g, ' ').trim();
}

/** Slightly tighten very long correct answers that are multi-clause walls of text. */
function tightenCorrect(text, medianWrongLen) {
  let t = (text || '').trim();
  if (medianWrongLen < 40) return t;
  // Only trim when correct is dramatically longer (2x+) and multi-sentence
  const sentences = t.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length >= 2 && t.length > medianWrongLen * 2.2) {
    // Keep first sentence if it already carries the core claim; else first two
    if (sentences[0].length >= medianWrongLen * 0.9) {
      return sentences[0].trim();
    }
    return sentences.slice(0, 2).join(' ').trim();
  }
  return t;
}

function rebalanceQuiz(quiz, filePath) {
  const id = quiz.id || quiz.topicId || path.basename(filePath, '.json');
  const letterBefore = { A: 0, B: 0, C: 0, D: 0 };
  const letterAfter = { A: 0, B: 0, C: 0, D: 0 };
  let expanded = 0;
  let tightened = 0;

  quiz.questions = (quiz.questions || []).map((q) => {
    letterBefore[q.correctAnswer] = (letterBefore[q.correctAnswer] || 0) + 1;

    const seed = hashSeed(`${id}::${q.number}::rebalance-v1`);
    const rand = mulberry32(seed);

    let options = (q.options || []).map((o) => ({
      label: o.label,
      text: o.text,
      isCorrect: !!o.isCorrect,
      rationale: o.rationale,
    }));

    const correct = options.find((o) => o.isCorrect);
    if (!correct) throw new Error(`${id} Q${q.number}: no correct option`);

    const wrongs = options.filter((o) => !o.isCorrect);
    const wrongLens = wrongs.map((o) => o.text.length).sort((a, b) => a - b);
    const medianWrong =
      wrongLens.length === 0
        ? 80
        : wrongLens[Math.floor(wrongLens.length / 2)];

    const beforeCorrectLen = correct.text.length;
    correct.text = tightenCorrect(correct.text, medianWrong);
    if (correct.text.length < beforeCorrectLen) tightened++;

    // Target wrong length near ~85% of correct (or at least ~median of better quizzes)
    const targetWrong = Math.max(
      70,
      Math.min(Math.floor(correct.text.length * 0.92), 220)
    );

    options = options.map((o) => {
      if (o.isCorrect) return o;
      const before = o.text.length;
      const next = expandWrong(o.text, targetWrong, rand);
      if (next.length > before + 10) expanded++;
      return { ...o, text: next };
    });

    // Shuffle and relabel
    options = shuffle(options, rand).map((o, i) => ({
      ...o,
      label: LABELS[i],
    }));

    const newCorrect = options.find((o) => o.isCorrect);
    letterAfter[newCorrect.label] = (letterAfter[newCorrect.label] || 0) + 1;

    return {
      ...q,
      options,
      correctAnswer: newCorrect.label,
    };
  });

  return { letterBefore, letterAfter, expanded, tightened };
}

function loadQuizPaths(argv) {
  const args = argv.slice(2);
  if (args.includes('--all-alice') || args.length === 0) {
    const dir = path.join(ROOT, 'data', 'quizzes', 'alice');
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => path.join(dir, f));
  }
  return args
    .filter((a) => !a.startsWith('--'))
    .map((a) => (path.isAbsolute(a) ? a : path.join(ROOT, a)));
}

function countCorrectLetters(quiz) {
  const c = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of quiz.questions || []) {
    c[q.correctAnswer] = (c[q.correctAnswer] || 0) + 1;
  }
  return c;
}

function main() {
  const args = process.argv.slice(2);
  const minA = (() => {
    const i = args.indexOf('--min-a');
    return i >= 0 ? parseInt(args[i + 1], 10) : 0;
  })();

  const paths = loadQuizPaths(process.argv);
  let files = 0;

  for (const p of paths) {
    if (!fs.existsSync(p)) {
      console.warn('Skip missing', p);
      continue;
    }
    const quiz = JSON.parse(fs.readFileSync(p, 'utf8'));
    const before = countCorrectLetters(quiz);
    if (minA > 0 && (before.A || 0) < minA) {
      console.log(
        'Skip (A-count)',
        path.relative(ROOT, p),
        before
      );
      continue;
    }

    const stats = rebalanceQuiz(quiz, p);
    fs.writeFileSync(p, JSON.stringify(quiz, null, 2) + '\n', 'utf8');
    files++;
    console.log(
      path.relative(ROOT, p),
      'letters',
      stats.letterBefore,
      '→',
      stats.letterAfter,
      `expandedWrongs=${stats.expanded}`,
      `tightenedCorrect=${stats.tightened}`
    );
  }

  console.log(`Done. Rebalanced ${files} quiz file(s).`);
}

main();
