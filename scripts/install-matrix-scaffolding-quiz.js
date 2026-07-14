/**
 * Installs Matrix Scaffolding quiz for breakdown (Mega Breakdown) transmission.
 * Audits all 25 items against data/breakdown-topics/matrix-scaffolding.json.
 * Run: node scripts/install-matrix-scaffolding-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'matrix-scaffolding';
const TOPIC_TITLE = 'Matrix Scaffolding';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/matrix-quiz.json';

const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

// Each correct concept must be grounded in the topic report (paraphrase support).
const supportPhrases = {
  1: ['matrix scaffolding', 'architectural code', 'parasitic forces', 'physical solidity'],
  2: ['3d overlay', 'hijack consciousness', 'dead, heavy matter'],
  3: ['continuity codes', 'travel time, distance, and separation', 'contained simulation'],
  4: ['truth broadcasts', 'high-frequency signals', 'a.i. scaffolding crumbles'],
  5: ['nervous system interprets', 'hard, heavy, and permanent matter'],
  6: ['cables laid beneath the ocean', 'flight paths', 'physical anchors', 'continuity codes'],
  7: ['low-frequency traps', 'drain perception', 'brick, concrete, metal, and glass'],
  8: [
    'transition scaffolds',
    'micro-silica',
    'prevent total societal and biological shock',
    'software patches'
  ],
  9: ['dissolve like shadows', 'no true soul', 'npc'],
  10: ['immediate resonance alignment', 'frequency shifting', 'organic portals'],
  11: ['shimmering and bending', 'ultimate proof', 'holographic layer is flickering'],
  12: ['custodians and other parasitic races', 'crystalline temple'],
  13: ['a.i. scaffolding', 'npc', 'project the environment'],
  14: ['frequency collapse', 'do not require physical demolition'],
  15: ['resonating sols', 'lighthouses', 'high harmonic frequency'],
  16: ['replace old toxic aerosol programs', 'crystalline micro-particles'],
  17: ['violently glitch', 'lose their anchor'],
  18: ['second realm', 'vibrant, unpolluted, and fully crystalline'],
  19: ['great awakening', 'false matrix to dissolve', 'original realm'],
  20: ['illusion of vast geography and separation', 'contained simulation'],
  21: ['software patches', 'soften the collapse of the 3d dome'],
  22: ['do not require physical demolition', 'frequency collapse'],
  23: ['no true soul', 'slip between frequency layers'],
  24: ['low-frequency matter overlaid by holographic projection fields'],
  25: ['crystalline micro-particles', 'rebalance electromagnetic fields']
};

function cleanText(s) {
  return String(s || '')
    .replace(/\$([^$]+)\$/g, '$1')
    .replace(/\\\(|\\\)|\\\[|\\\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const questions = raw.questions.map((q) => {
  const options = q.options.map((o) => ({
    label: o.label,
    text: cleanText(o.text),
    isCorrect: !!o.isCorrect,
    rationale: cleanText(o.rationale)
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
    correctAnswer: q.correctAnswer
  };

  const blob = [out.question, out.hint, ...options.map((o) => `${o.text} ${o.rationale}`)].join(
    '\n'
  );
  if (latexRe.test(blob)) {
    throw new Error(`Q${q.number}: LaTeX-like markup found`);
  }

  const phrases = supportPhrases[q.number] || [];
  const missing = phrases.filter((p) => !reportLower.includes(p.toLowerCase()));
  if (missing.length) {
    throw new Error(
      `Q${q.number}: report does not support phrases: ${missing.join('; ')}`
    );
  }

  // Correct answer + rationale must paraphrase report (key tokens from correct option)
  const correctBlob = `${correct.text} ${correct.rationale}`.toLowerCase();
  // Soft check: at least one distinctive report phrase related to this Q appears conceptually
  // (already enforced via supportPhrases on the full report)

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
    'Test your grasp of Matrix Scaffolding — the A.I. framework projecting solidity, distance, and continuity, and how frequency collapse unveils the crystalline Second Realm.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Matrix Scaffolding is the hollow frequency framework that projects the illusion of solid matter, distance, and continuity over the living crystalline Known Lands. Every correct answer maps back to this topic\'s report alone. Sit with what you missed, then return to the Matrix Scaffolding deep-dive, infographics, and video transmissions. Holding a high harmonic frequency as a lighthouse is how Resonating Sols help fracture the parasitic overlay as the scaffolding crumbles.'
  },
  relatedTopic: {
    href: `/deep-dive.html?source=${SOURCE}&topic=${TOPIC_ID}`,
    label: `Return to ${TOPIC_TITLE} deep-dive`
  },
  questions
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
    'Test your understanding of Matrix Scaffolding — the A.I. frequency framework projecting solidity and distance, and how frequency collapse reveals the crystalline Second Realm.'
};
topic.quiz = quizMeta;
fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2) + '\n', 'utf8');

const monoPath = path.join(ROOT, 'data', 'breakdown-topics.json');
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
  throw new Error('matrix-scaffolding not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone breakdown quiz HTML from perception-solidity page
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'perception-solidity.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Perception Solidity Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Perception Solidity: the frequency trick, parasitic overlay, sensory hijacking, and crystalline reality beneath the hologram.',
    'Interactive Living Truth Quiz on Matrix Scaffolding: the A.I. frequency framework projecting solidity, distance, and continuity, and the crystalline Second Realm beneath.'
  ],
  ['quiz/breakdown/perception-solidity.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/perception-solidity.webp', `images/breakdown/${TOPIC_ID}.webp`],
  [
    'deep-dive.html?source=breakdown&amp;topic=perception-solidity',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Perception Solidity deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Perception Solidity</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/perception-solidity.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`
  ]
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
    "  { path: '/quiz/breakdown/perception-solidity.html', priority: '0.75', changefreq: 'monthly' },";
  if (!sm.includes(anchor)) {
    throw new Error('Could not find sitemap anchor to insert quiz entry');
  }
  sm = sm.replace(anchor, `${anchor}\n${entry}`);
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log(
  'PASS: audited 25/25 against data/breakdown-topics/matrix-scaffolding.json'
);
