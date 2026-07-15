/**
 * Installs Antiquity Technology quiz for Alice transmission.
 * Audits all 25 items against data/alice-topics/antiquity-technology.json.
 * Strips LaTeX/MathJax so all text is plain human-readable English.
 * Run: node scripts/install-antiquity-technology-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'antiquity-technology';
const TOPIC_TITLE = 'Antiquity Technology';
const SOURCE = 'alice';
const SOURCE_QUIZ_CANDIDATES = [
  'G:/My Drive/CH21/Website Files/New Downloads/tartaria-quiz.json',
  path.join(ROOT, 'scripts', '_tartaria-quiz-source.json'),
];

function loadSourceQuiz() {
  for (const p of SOURCE_QUIZ_CANDIDATES) {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  }
  throw new Error(
    'Source quiz not found. Expected tartaria-quiz.json in Google Drive New Downloads or scripts/_tartaria-quiz-source.json'
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
  1: ['lattice membrane network', 'ley lines', 'nodes', 'positive electromagnetic'],
  2: ['harmonic architecture', 'weaving and singing', 'higher light realms'],
  3: ['tuning forks', 'putty', 'andesite'],
  4: ['industrial revolution', 'termination of great tartary', 'antiquity technology'],
  5: ['atmospheric condenser', 'locomotive 34', 'lattice membrane network'],
  6: ['gold', 'silver', 'stabilize and power', 'electromagnetic functions'],
  7: ['fibonacci-series', 'golden ratio'],
  8: ["oopa's", 'smithsonian', 'out of place'],
  9: ['radium', 'non-depleting', 'soft green luminescence'],
  10: ['leedskalnin', 'magnetic frequency masonry', '1,100 tons'],
  11: ['dustification', 'energetic weaponry', 'subatomic cohesion'],
  12: ['consolidated coal company', '1887', 'mined coal'],
  13: ['nodes', 'junction points', 'crystalline temples'],
  14: ['london underground', 'pneumatic', 'dangerous electricity'],
  15: ['battle-ship grey', 'resplendent public boulevards'],
  16: ['20 mph', 'magnetic fields', 'ley lines'],
  17: ['pineal gland', 'aether', 'sustained intent'],
  18: ['density suppression', 'lower the planetary density', 'suppress human consciousness'],
  19: ['wheels, combustion', 'vibration, frequency, and consciousness'],
  20: ['crystalline temples', 'structurally amplified', 'nodes'],
  21: ['copper', 'dome', 'fibonacci'],
  22: ['capped with stone', 'alters', 'concrete', 'tarmac'],
  23: ['fossilize', 'books and hats', 'petrify'],
  24: ['aether', 'simulation software'],
  25: ['8th re-set', 'systemic dependency', 'financial and energetic slavery'],
};

/** Plain English: no LaTeX, MathJax, Markdown math, or $...$ wrappers. */
function cleanText(s) {
  if (typeof s !== 'string') return s;
  let t = s;

  // Ordinals: $3^{rd}$ $9^{th}$ $8^{th}$ $1^{st}$ $2^{nd}$
  t = t.replace(/\$(\d+)\^\{(st|nd|rd|th)\}\$/gi, '$1$2');
  t = t.replace(/\$(\d+)\^(st|nd|rd|th)\$/gi, '$1$2');

  // Percent: $97\%$ or $97\\%$
  t = t.replace(/\$(\d+(?:,\d+)*)\\+%\$/g, '$1%');
  t = t.replace(/\$(\d+(?:,\d+)*)\\?\%\$/g, '$1%');

  // Bare numbers / numbers with commas: $34$ $1,100$ $1887$ $20$
  t = t.replace(/\$(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\$/g, '$1');

  // Acronyms / words: $Andesite$ $UHF$ $EMF$
  t = t.replace(/\$([A-Za-z][A-Za-z0-9./'-]{0,40})\$/g, '$1');

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

const questions = raw.questions.map((q) => {
  const mapped = q.options.map((o) => ({
    label: o.label,
    text: cleanText(o.text),
    isCorrect: !!o.isCorrect,
    rationale: cleanText(o.rationale),
  }));
  const finalized = finalizeOptions(
    mapped,
    `${typeof TOPIC_ID !== 'undefined' ? TOPIC_ID : 'quiz'}::${q.number}`
  );
  const options = finalized.options;
  const correct = options.find((o) => o.isCorrect);
  if (!correct) throw new Error(`Q${q.number}: no correct option`);
  /* correct letter assigned by finalizeOptions shuffle */

  const out = {
    number: q.number,
    question: cleanText(q.question),
    options,
    hint: cleanText(q.hint),
    correctAnswer: finalized.correctAnswer,
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
    'Test your grasp of Antiquity Technology — Great Tartary, harmonic architecture, free-energy locomotives, and the engineered fall into industrial dependency.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      "Antiquity Technology is the lost harmonic paradigm of Great Tartary — lattice energy, tuning-fork masonry, pneumatic transit, and free-energy systems stripped away to enforce scarcity. Sit with what you missed, then return to the Antiquity Technology deep-dive, infographics, and video transmissions. Remembering that true technology runs on vibration, frequency, and consciousness is how you see through the fabricated Industrial Revolution narrative.",
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
    'Test your understanding of Antiquity Technology — Great Tartary, harmonic construction, free energy, and the engineered Industrial Revolution cover story.',
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
  throw new Error('antiquity-technology not found in alice-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', 'alice', 'nature-of-reality.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Nature of Reality Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Nature of Reality: the flat plain, Firmament, density suppression, and the Great Spiritual Awakening.',
    'Interactive Living Truth Quiz on Antiquity Technology: Great Tartary, harmonic architecture, free-energy systems, and the engineered fall into industrial dependency.',
  ],
  ['quiz/alice/nature-of-reality.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/nature-of-reality.webp', 'images/alice/antiquity-tech.webp'],
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
    "  { path: '/quiz/alice/amnesia-vortex.html', priority: '0.75', changefreq: 'monthly' },";
  if (!sm.includes(anchor)) {
    // fallback to last known alice quiz entry
    const fallback =
      "  { path: '/quiz/alice/adrenochrome-trade.html', priority: '0.75', changefreq: 'monthly' },";
    if (!sm.includes(fallback)) {
      throw new Error('Could not find sitemap anchor to insert quiz entry');
    }
    sm = sm.replace(fallback, `${fallback}\n${entry}`);
  } else {
    sm = sm.replace(anchor, `${anchor}\n${entry}`);
  }
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

const samples = [
  questions[2].options.find((o) => o.isCorrect).rationale,
  questions[4].question,
  questions[9].options.find((o) => o.isCorrect).rationale,
  questions[11].question,
  questions[15].options.find((o) => o.isCorrect).text,
];
console.log('Sample cleaned texts:');
samples.forEach((s) => console.log(' -', s));

console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log(
  'PASS: audited 25/25 against data/alice-topics/antiquity-technology.json'
);
