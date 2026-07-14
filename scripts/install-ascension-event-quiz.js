/**
 * Installs Ascension Event quiz for Alice transmission.
 * Audits all 25 items against data/alice-topics/ascension-event.json.
 * Strips LaTeX/MathJax so all text is plain human-readable English.
 * Run: node scripts/install-ascension-event-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'ascension-event';
const TOPIC_TITLE = 'Ascension Event';
const SOURCE = 'alice';
const SOURCE_QUIZ_CANDIDATES = [
  'G:/My Drive/CH21/Website Files/New Downloads/ascension-quiz.json',
  path.join(ROOT, 'scripts', '_ascension-quiz-source.json'),
];

function loadSourceQuiz() {
  for (const p of SOURCE_QUIZ_CANDIDATES) {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  }
  throw new Error(
    'Source quiz not found. Expected ascension-quiz.json in Google Drive New Downloads or scripts/_ascension-quiz-source.json'
  );
}

const raw = loadSourceQuiz();
const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

// Each correct concept must be grounded in THIS topic's report only.
const supportPhrases = {
  1: ['30-second', 'blinding white light', '97%'],
  2: ['npc', '97%', 'no past or future lives', 'fourth density'],
  3: ['scare events', 'soul-architecture', 'hardwired'],
  4: ['emergency broadcast system', 'child sacrifices', "world's elite"],
  5: ['perceived knowledge', 'standardized education', 'fabrications'],
  6: ['dark matter field', 'bright white light', 'sky will rip open'],
  7: ['nuclear weapons', 'non-existent', 'holographic'],
  8: ['amnesia vortex', 'wipe their memories', 'new physical vessel'],
  9: ['520 million', '3 out of every 100'],
  10: ['polaris', 'melting pixelization', 'projection dome'],
  11: ['tartaria', 'tonal frequency architecture', 'pure intention'],
  12: ['all animals', 'most children', 'polluting systemic programming'],
  13: ['religion', 'deities were control mechanisms'],
  14: ['overlays', 'sky-net-1', 'crystalline architecture', 'dampen'],
  15: ['pixelated', 'bleed-thru harmonic scaffolding'],
  16: ['galactic ancestral alliance', 'projection dome', 'switch off'],
  17: ['178,000 years', 'memories', 'psychological overload'],
  18: ['project blue beam', 'peak fear', 'fake alien invasion'],
  19: ['97%', 'no future beyond the third density', 'npc'],
  20: ['devoutly religious', 'shock', 'heart failure'],
  21: ['lattice membrane networks', 'ley lines'],
  22: ['finance', 'money', 'false construct', 'extract labor'],
  23: ['flat plain', 'firmament', 'ice wall'],
  24: ['taran', 'pleiadian', 'rapidly evolve', 'upgrades'],
  25: ['dampening overlays', 'stripped away', 'ruined infrastructure'],
};

/** Plain English: no LaTeX, MathJax, Markdown math, or $...$ wrappers. */
function cleanText(s) {
  if (typeof s !== 'string') return s;
  let t = s;

  // Ordinals: $3^{rd}$ $9^{th}$ $33^{rd}$ $1^{st}$ $2^{nd}$
  t = t.replace(/\$(\d+)\^\{(st|nd|rd|th)\}\$/gi, '$1$2');
  t = t.replace(/\$(\d+)\^(st|nd|rd|th)\$/gi, '$1$2');

  // Percent: $97\%$ $97\\%$ $3\%$
  t = t.replace(/\$(\d+(?:,\d+)*)\\+%\$/g, '$1%');
  t = t.replace(/\$(\d+(?:,\d+)*)\\?\%\$/g, '$1%');

  // Bare numbers / numbers with commas: $30$ $520$ $178,000$ $1.2$ $8$ $3$ $100$ $12$
  t = t.replace(/\$(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\$/g, '$1');

  // Acronyms / short tokens: $UHF$ $EMF$ $G.A.A$
  t = t.replace(/\$([A-Za-z][A-Za-z0-9./-]{0,24})\$/g, '$1');

  // Any remaining $...$
  t = t.replace(/\$([^$]+)\$/g, (_, inner) =>
    inner
      .replace(/\^\{([^}]+)\}/g, '$1')
      .replace(/\\%/g, '%')
      .replace(/\\/g, '')
  );

  t = t.replace(/\^\{(st|nd|rd|th)\}/gi, '$1');
  t = t.replace(/\\%/g, '%');
  t = t.replace(/\\\(|\\\)|\\\[|\\\]/g, '');

  t = t
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, '—')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ')
    .replace(/\uFFFD/g, '');

  t = t.replace(/[ \t]{2,}/g, ' ').trim();
  return t;
}

function normalizeQuestion(q) {
  const options = q.options.map((o) => ({
    label: o.label,
    text: cleanText(o.text),
    isCorrect: !!o.isCorrect,
    rationale: cleanText(o.rationale),
  }));
  const correct = options.find((o) => o.isCorrect);
  if (!correct) throw new Error(`Q${q.number}: no correct option`);
  if (q.correctAnswer !== correct.label) {
    throw new Error(
      `Q${q.number}: correctAnswer ${q.correctAnswer} != isCorrect ${correct.label}`
    );
  }

  const out = {
    number: q.number,
    question: cleanText(q.question),
    options,
    hint: cleanText(q.hint),
    correctAnswer: q.correctAnswer,
  };

  const blob = [
    out.question,
    out.hint,
    ...options.map((o) => `${o.text} ${o.rationale}`),
  ].join('\n');
  if (latexRe.test(blob) || /\$/.test(blob)) {
    throw new Error(`Q${q.number}: LaTeX-like markup or $ found:\n${blob}`);
  }

  const phrases = supportPhrases[q.number] || [];
  const missing = phrases.filter((p) => !reportLower.includes(p.toLowerCase()));
  if (missing.length) {
    throw new Error(
      `Q${q.number}: report does not support phrases: ${missing.join('; ')}`
    );
  }

  if (options.length < 2) throw new Error(`Q${q.number}: need 2+ options`);
  if (options.filter((o) => o.isCorrect).length !== 1) {
    throw new Error(`Q${q.number}: need exactly 1 correct`);
  }
  for (const o of options) {
    if (!o.rationale || o.rationale.length < 8) {
      throw new Error(`Q${q.number}${o.label}: short rationale`);
    }
  }
  return out;
}

if (!raw.questions || raw.questions.length !== 25) {
  throw new Error(
    `Expected 25 source questions in ascension-quiz.json, got ${raw.questions?.length}`
  );
}

const questions = raw.questions.map(normalizeQuestion);

if (questions.length !== 25) {
  throw new Error(`Expected 25 questions, got ${questions.length}`);
}

// Spot-check cleaned numbers / percents
const mustBePlain = [
  questions[0].options.find((o) => o.isCorrect).text,
  questions[1].question,
  questions[8].options.find((o) => o.isCorrect).text,
  questions[16].options.find((o) => o.isCorrect).text,
  questions[18].question,
];
for (const s of mustBePlain) {
  if (/\$|\\frac|\^\{|\\%/.test(s)) {
    throw new Error(`Uncleaned text remains: ${s}`);
  }
}
if (mustBePlain[0] !== '30 seconds') {
  throw new Error(`Expected "30 seconds", got "${mustBePlain[0]}"`);
}
if (!mustBePlain[1].includes('97%')) {
  throw new Error(`Expected 97% in Q2 question: ${mustBePlain[1]}`);
}
if (mustBePlain[2] !== '520 million') {
  throw new Error(`Expected "520 million", got "${mustBePlain[2]}"`);
}
if (!mustBePlain[3].includes('178,000')) {
  throw new Error(`Expected 178,000 in Q17 correct: ${mustBePlain[3]}`);
}

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle:
    'Test your grasp of the Ascension Event — the EMF flash, EBS revelations, Scare Events, 97% NPC removal, 3 Strings, Sky Event mechanics, and the restoration of true souls.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      "The Ascension Event is the climax of the Great Spiritual Awakening: a 30-second EMF flash, preceded by EBS exposure and peak-fear Scare Events, that removes 97% NPC population, strips dampening overlays, and returns up to 178,000 years of memory to surviving true souls. Sit with what you missed, then return to the Ascension Event deep-dive, infographics, and video transmissions. Relinquishing Religion, Finance, and Perceived Knowledge is not optional theory — it is the baseline that keeps the mind intact when the artificial fabric of reality collapses.",
  },
  relatedTopic: {
    href: `/deep-dive.html?source=${SOURCE}&topic=${TOPIC_ID}`,
    label: `Return to ${TOPIC_TITLE} deep-dive`,
  },
  questions,
};

const quizDir = path.join(ROOT, 'data', 'quizzes', SOURCE);
fs.mkdirSync(quizDir, { recursive: true });
const quizJsonPath = path.join(quizDir, `${TOPIC_ID}.json`);
fs.writeFileSync(quizJsonPath, JSON.stringify(quiz, null, 2) + '\n', 'utf8');

const quizMeta = {
  href: `quiz/${SOURCE}/${TOPIC_ID}.html`,
  title: TOPIC_TITLE,
  totalQuestions: 25,
  description:
    'Test your understanding of the Ascension Event — EMF flash, EBS, Scare Events, 97% NPC removal, the 3 Strings, and the Sky Event that restores true souls.',
};
topic.quiz = quizMeta;
fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2) + '\n', 'utf8');

const monoPath = path.join(ROOT, 'data', 'alice-topics.json');
const mono = JSON.parse(fs.readFileSync(monoPath, 'utf8'));
function findAndPatch(topics) {
  for (const t of topics) {
    if (t.id === TOPIC_ID) {
      t.quiz = quizMeta;
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('ascension-event not found in alice-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', 'alice', 'nature-of-reality.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Nature of Reality Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Nature of Reality: the flat plain, Firmament, density suppression, and the Great Spiritual Awakening.',
    'Interactive Living Truth Quiz on Ascension Event: the EMF flash, EBS revelations, Scare Events, 97% NPC removal, 3 Strings, and the Sky Event that restores true souls.',
  ],
  ['quiz/alice/nature-of-reality.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/nature-of-reality.webp', 'images/alice/ascension-event.webp'],
  [
    'deep-dive.html?source=alice&amp;topic=nature-of-reality',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`,
  ],
  ['Nature of Reality deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Nature of Reality</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/alice/nature-of-reality.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`,
  ],
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 80));
  }
  html = html.split(a).join(b);
}

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/alice/anunnaki.html', priority: '0.75', changefreq: 'monthly' },";
  if (sm.includes(anchor)) {
    sm = sm.replace(anchor, `${anchor}\n${entry}`);
  } else {
    const fallback =
      "  { path: '/quiz/alice/antiquity-technology.html', priority: '0.75', changefreq: 'monthly' },";
    if (!sm.includes(fallback)) {
      throw new Error('Could not find sitemap anchor to insert quiz entry');
    }
    sm = sm.replace(fallback, `${fallback}\n${entry}`);
  }
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

console.log('Sample cleaned texts:');
mustBePlain.forEach((s) => console.log(' -', s));

console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log(
  'PASS: audited 25/25 against data/alice-topics/ascension-event.json'
);
