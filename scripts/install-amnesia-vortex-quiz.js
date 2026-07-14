/**
 * Installs Amnesia Vortex quiz for Alice transmission.
 * Audits all 25 items against data/alice-topics/amnesia-vortex.json.
 * Strips LaTeX/MathJax so all text is plain human-readable English.
 * Run: node scripts/install-amnesia-vortex-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'amnesia-vortex';
const TOPIC_TITLE = 'Amnesia Vortex';
const SOURCE = 'alice';
const SOURCE_QUIZ_CANDIDATES = [
  'G:/My Drive/CH21/Website Files/New Downloads/matrix-quiz.json',
  path.join(ROOT, 'scripts', '_matrix-quiz-source.json'),
];

function loadSourceQuiz() {
  for (const p of SOURCE_QUIZ_CANDIDATES) {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  }
  throw new Error(
    'Source quiz not found. Expected matrix-quiz.json in Google Drive New Downloads or scripts/_matrix-quiz-source.json'
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
  1: ['bright light', 'sun', 'etheric portal', 'amnesia vortex', 'memory'],
  2: ['vatican', '13', 'subterranean'],
  3: ['density suppression', '9th density', '3rd density'],
  4: ['deactivated in 2019', 'children', 'past-life'],
  5: ['moon', 'space station', 'frequency control'],
  6: ['venus', 'holographic generator', 'bright morning star'],
  7: ['religion', 'finance', 'perceived knowledge'],
  8: ['black void plasma', 'bright white'],
  9: ['frequency fences', 'sleep'],
  10: ['1,000 years', 'loosh', 'adrenochrome'],
  11: ['orphan trains', 'laboratory-grown clones'],
  12: ['lunatic asylums', '5,000-bed', 'loosh batteries'],
  13: ['97%', 'npc'],
  14: ['projection dome', 'pixelate', 'emf'],
  15: ['nickel', 'lead', 'chromium', 'pineal'],
  16: ['33rd-degree freemasons', 'perceived knowledge', 'tartaria'],
  17: ['project bluebeam', 'fake alien invasion'],
  18: ['overlays', 'crystalline temples'],
  19: ['15 to 20 minutes', 'twin flames'],
  20: ['galactic ancestral alliance', 'g.a.a'],
  21: ['internal monologues', 'self-awareness', 'npc'],
  22: ['deactivated in 2019'],
  23: ['projection dome', 'fake space debris'],
  24: ['black void plasma', 'bright white'],
  25: ['emf', 'genuine souls', 'restored realm'],
};

/** Plain English: no LaTeX, MathJax, Markdown math, or $...$ wrappers. */
function cleanText(s) {
  if (typeof s !== 'string') return s;
  let t = s;

  // Ordinals: $3^{rd}$ $9^{th}$ $33^{rd}$ $1^{st}$ $2^{nd}$
  t = t.replace(/\$(\d+)\^\{(st|nd|rd|th)\}\$/gi, '$1$2');
  t = t.replace(/\$(\d+)\^(st|nd|rd|th)\$/gi, '$1$2');

  // Percent: $97\%$ or $97\\%$ (raw file may have either)
  t = t.replace(/\$(\d+(?:,\d+)*)\\+%\$/g, '$1%');
  t = t.replace(/\$(\d+(?:,\d+)*)\\?\%\$/g, '$1%');

  // Bare numbers / numbers with commas: $13$ $2019$ $1,000$ $5,000$ $15$ $20$ $30$
  t = t.replace(/\$(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\$/g, '$1');

  // Acronyms / short tokens: $UHF$ $EMF$ $G.A.A$
  t = t.replace(/\$([A-Za-z][A-Za-z0-9./-]{0,24})\$/g, '$1');

  // Any remaining $...$ — strip dollars, flatten ^{x}
  t = t.replace(/\$([^$]+)\$/g, (_, inner) =>
    inner
      .replace(/\^\{([^}]+)\}/g, '$1')
      .replace(/\\%/g, '%')
      .replace(/\\/g, '')
  );

  // Leftover latex fragments outside dollars
  t = t.replace(/\^\{(st|nd|rd|th)\}/gi, '$1');
  t = t.replace(/\\%/g, '%');
  t = t.replace(/\\\(|\\\)|\\\[|\\\]/g, '');

  // Normalize fancy punctuation
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

const questions = raw.questions.map((q) => {
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
});

if (questions.length !== 25) {
  throw new Error(`Expected 25 questions, got ${questions.length}`);
}

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle:
    'Test your grasp of the Amnesia Vortex — the soul-recycling Bright Light, density suppression, control grid layers, and the 2019 deactivation that broke generational amnesia.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      "The Amnesia Vortex is the central cognitive and spiritual erasure tool of the control grid — the deceptive Bright Light, the forced 15-to-20-minute recycle, and the multi-layered environmental and psychological suppressants that kept souls blind for millennia. Every correct answer maps back to this topic's report alone. Sit with what you missed, then return to the Amnesia Vortex deep-dive, infographics, and video transmissions. Because the vortex was deactivated in 2019, the generational cycle of ignorance is permanently broken — holding that knowing is part of the Great Remembering.",
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
    'Test your understanding of the Amnesia Vortex — soul recycling, the Bright Light portal, control mechanisms, and the 2019 deactivation.',
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
  throw new Error('amnesia-vortex not found in alice-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', 'alice', 'nature-of-reality.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Nature of Reality Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Nature of Reality: the flat plain, Firmament, density suppression, and the Great Spiritual Awakening.',
    'Interactive Living Truth Quiz on Amnesia Vortex: the Bright Light soul portal, density suppression, control grid layers, and the 2019 deactivation that broke generational amnesia.',
  ],
  ['quiz/alice/nature-of-reality.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/nature-of-reality.webp', 'images/alice/amnesia.webp'],
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
    "  { path: '/quiz/alice/adrenochrome-trade.html', priority: '0.75', changefreq: 'monthly' },";
  if (!sm.includes(anchor)) {
    throw new Error('Could not find sitemap anchor to insert quiz entry');
  }
  sm = sm.replace(anchor, `${anchor}\n${entry}`);
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

// Spot-check a few cleaned strings
const samples = [
  questions[2].options.find((o) => o.isCorrect).text,
  questions[12].options.find((o) => o.isCorrect).text,
  questions[15].options.find((o) => o.isCorrect).text,
  questions[18].question,
];
console.log('Sample cleaned correct texts:');
samples.forEach((s) => console.log(' -', s));

console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log(
  'PASS: audited 25/25 against data/alice-topics/amnesia-vortex.json'
);
