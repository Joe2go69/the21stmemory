/**
 * Shared helpers so install-*-quiz.js scripts do not always emit correct=A
 * with multi-sentence correct options and one-line distractors.
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

  const i = Math.floor(rand() * tails.length);
  if (!/[.!?]$/.test(t)) {
    t = t.replace(/[.;,\s]+$/, '') + tails[i];
  } else {
    t = t.replace(/[.!?]\s*$/, '') + tails[i] + '.';
  }

  if (t.length < targetLen * 0.85) {
    const j = (i + 3) % tails.length;
    t = t.replace(/[.!?]\s*$/, '') + tails[j] + '.';
  }

  if (t.length > targetLen * 1.35 && targetLen > 40) {
    t = t.slice(0, Math.floor(targetLen * 1.25));
    const cut = t.lastIndexOf(' ');
    if (cut > 40) t = t.slice(0, cut);
    if (!/[.!?]$/.test(t)) t += '.';
  }

  return t.replace(/[ \t]{2,}/g, ' ').trim();
}

function tightenCorrect(text, medianWrongLen) {
  let t = (text || '').trim();
  if (medianWrongLen < 40) return t;
  const sentences = t.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length >= 2 && t.length > medianWrongLen * 2.2) {
    if (sentences[0].length >= medianWrongLen * 0.9) return sentences[0].trim();
    return sentences.slice(0, 2).join(' ').trim();
  }
  return t;
}

/**
 * Map raw options → balanced, shuffled A–D options + correctAnswer letter.
 * @param {Array} rawOptions options with text, isCorrect, rationale (label optional)
 * @param {string|number} seedKey stable seed (topicId + question number)
 */
function finalizeOptions(rawOptions, seedKey) {
  const rand = mulberry32(hashSeed(String(seedKey)));
  let options = rawOptions.map((o) => ({
    label: o.label,
    text: String(o.text || '').trim(),
    isCorrect: !!o.isCorrect,
    rationale: String(o.rationale || '').trim(),
  }));

  if (options.filter((o) => o.isCorrect).length !== 1) {
    throw new Error(`finalizeOptions: need exactly 1 correct (seed ${seedKey})`);
  }

  const wrongs = options.filter((o) => !o.isCorrect);
  const wrongLens = wrongs.map((o) => o.text.length).sort((a, b) => a - b);
  const medianWrong =
    wrongLens.length === 0 ? 80 : wrongLens[Math.floor(wrongLens.length / 2)];

  const correct = options.find((o) => o.isCorrect);
  correct.text = tightenCorrect(correct.text, medianWrong);

  const targetWrong = Math.max(
    70,
    Math.min(Math.floor(correct.text.length * 0.92), 220)
  );

  options = options.map((o) =>
    o.isCorrect ? o : { ...o, text: expandWrong(o.text, targetWrong, rand) }
  );

  options = shuffle(options, rand).map((o, i) => ({
    ...o,
    label: LABELS[i],
  }));

  const newCorrect = options.find((o) => o.isCorrect);
  return { options, correctAnswer: newCorrect.label };
}

module.exports = {
  finalizeOptions,
  expandWrong,
  tightenCorrect,
  hashSeed,
  LABELS,
};
