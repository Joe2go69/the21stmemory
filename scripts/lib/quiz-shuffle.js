/**
 * Stable-seed A–D shuffle for quiz options.
 *
 * Shared by the install pipeline (scripts/lib/quiz-pipeline.js) and the legacy
 * scripts/rebalance-quiz-length.js. The shuffle only reorders options and relabels
 * them; it never changes option text. Seeded by quiz id + question number, so
 * reinstalling the same payload always gives the same letters.
 *
 * True/False questions are not shuffled: True is always A, False is always B.
 */
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

function isTrueFalseOptions(options) {
  return (
    (options || []).length === 2 &&
    options.every((o) => /^(true|false)$/i.test(String(o.text || '').trim()))
  );
}

/** Returns { options, correctAnswer } for one question. Text is never changed. */
function shuffleQuestionOptions(quizId, number, options) {
  const opts = (options || []).map((o) => ({ ...o }));
  if (isTrueFalseOptions(opts)) {
    const t = opts.find((o) => /^true$/i.test(String(o.text).trim()));
    const f = opts.find((o) => /^false$/i.test(String(o.text).trim()));
    const ordered = [
      { ...t, label: 'A', text: 'True' },
      { ...f, label: 'B', text: 'False' },
    ];
    return { options: ordered, correctAnswer: ordered.find((o) => o.isCorrect).label };
  }
  const rand = mulberry32(hashSeed(`${quizId}::${number}`));
  const shuffled = shuffle(opts, rand).map((o, i) => ({ ...o, label: LABELS[i] }));
  const correct = shuffled.find((o) => o.isCorrect);
  return { options: shuffled, correctAnswer: correct ? correct.label : undefined };
}

module.exports = { LABELS, mulberry32, hashSeed, shuffle, isTrueFalseOptions, shuffleQuestionOptions };
