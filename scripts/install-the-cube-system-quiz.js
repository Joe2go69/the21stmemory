/**
 * Installs The Cube System quiz for breakdown (Mega Breakdown) transmission.
 * Audits all 25 items against data/breakdown-topics/the-cube-system.json.
 * Run: node scripts/install-the-cube-system-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'the-cube-system';
const TOPIC_TITLE = 'The Cube System';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/cube-quiz.json';

const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

// Ground each item in the topic report (distinctive phrases from the-cube-system.json).
const supportPhrases = {
  1: ['master frequency server', 'crystalline electromagnetic framework', 'hard drive'],
  2: ['frequency shift', 'portal, gateway, or vortex', 'simulated layer'],
  3: ['178 physical worlds', 'training ground', 'imagination hardens into structure'],
  4: ['black crystalline valve locks', 'false saturn grid', 'spirit tree'],
  5: ['perception-based solidity', 'holographical projection fields', 'brick, concrete, and glass'],
  6: ['dome of sheol', 'healing and rest', 'recalibration between incarnations'],
  7: ['original harmonic tone', 'destabilizing the holographic projections', 'electromagnetic field'],
  8: ['dome of titans', 'playground of creation', 'great architects'],
  9: ['slowing down these vibrations', 'thought resistance', 'energy and choice to manifest'],
  10: ['solar architecture', 'crystal, copper, and frequency bricks', 'dead frequency holders'],
  11: ['dome of forgotten gods', 'root tone', 'wraps around all other domes'],
  12: ['parasitic forces did not create', 'first spark of creation', 'hijacked the pre-existing'],
  13: ['crystal light-worlds', 'sound vibrated', 'first sparks of light'],
  14: ['sound dictates structure', 'light generates vision', 'vision solidifies into form'],
  15: ['dome of 5 peaks', 'endless climbing', 'without reaching integration'],
  16: ['not occur through physical demolition', 'frequency collapse'],
  17: ['spirit tree', 'primary power amplifier', 'harmonic currents'],
  18: ['dome of hiva', 'weaponized frequency'],
  19: ['crystal, copper, and frequency bricks', 'concrete', 'dead frequency holders'],
  20: ['dome of portals', 'crystalline gates', 'harmonic passages'],
  21: ['sharp angles', 'drain perception', 'heavy, fixed state'],
  22: ['separated planets', 'centralized, digitalized console', 'layered frequency fields'],
  23: ['crystalline ecosystem of the known lands', 'correct resonance'],
  24: ['hard drive', 'the cube containment', 'frequency server'],
  25: ['black crystalline valve locks', 'reversing the outward flow', 'false saturn grid']
};

/** Strip LaTeX / MathJax wrappers; keep plain ordinals and terms. */
function cleanText(s) {
  let t = String(s || '');
  // $3\text{D}$ / $3\mathrm{D}$ → 3D (after JSON parse, \\ becomes \)
  t = t.replace(/\$3\\text\{D\}\$/g, '3D');
  t = t.replace(/\$3\\mathrm\{D\}\$/g, '3D');
  t = t.replace(/\$3\\text\{D\}\$/g, '3D');
  // Bare $178$, $5$, etc.
  t = t.replace(/\$(\d+)\$/g, '$1');
  // Generic $...$ with optional latex commands inside
  t = t.replace(/\$([^$]+)\$/g, (_, inner) =>
    inner
      .replace(/\\text\{([^}]*)\}/g, '$1')
      .replace(/\\mathrm\{([^}]*)\}/g, '$1')
      .replace(/\\[a-zA-Z]+/g, '')
      .replace(/[{}]/g, '')
  );
  t = t.replace(/\\\(|\\\)|\\\[|\\\]/g, '');
  t = t.replace(/\\text\{([^}]*)\}/g, '$1');
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

/** Remove report-meta phrasing; state facts in absolute truth voice. */
function absoluteVoice(s) {
  let t = String(s || '');
  const rewrites = [
    [
      /^The material clarifies that\s+/i,
      ''
    ],
    [
      /^The source states that\s+/i,
      ''
    ],
    [
      /^The source specifies that\s+/i,
      ''
    ],
    [
      /^The source suggests that\s+/i,
      ''
    ],
    [
      /^The text describes\s+/i,
      ''
    ],
    [
      /^The text suggests that\s+/i,
      ''
    ],
    [
      /^The text explicitly states that\s+/i,
      ''
    ],
    [
      /^The text states that\s+/i,
      ''
    ],
    [
      /^The text explicitly denies this,\s*describing it instead as\s+/i,
      'Reality is '
    ],
    [
      /^The text points toward\s+/i,
      ''
    ],
    [
      /mentioned in the source material\.?$/i,
      'in the true creative sequence.'
    ],
    [
      /\bmentioned in the text\b/gi,
      ''
    ],
    [
      /^Does the text suggest the solution is\s+/i,
      'Is the solution '
    ],
    [
      /This reverses the logical progression of frequency mentioned in the source material\.?/i,
      'This reverses the true creative sequence of frequency.'
    ],
    [
      /While it houses realities, its primary description is that of a crystalline electromagnetic framework and frequency server for the entire system\./i,
      'While it houses realities, it is the crystalline electromagnetic framework and frequency server for the entire system — not a temporary soul storage unit.'
    ],
    [
      /Check the Overview section for how the 'universe' is fundamentally structured\./i,
      'Recall how the universe is fundamentally structured inside The Cube.'
    ]
  ];
  for (const [re, rep] of rewrites) {
    t = t.replace(re, rep);
  }
  // Capitalize after stripping leading meta phrase
  t = t.replace(/^\s*([a-z])/, (_, c) => c.toUpperCase());
  t = t.replace(/\s+/g, ' ').trim();
  // Fix double spaces / awkward remnants
  t = t.replace(/\s+([.,;:])/g, '$1');
  return t;
}

// Targeted absolute-voice overrides (question number → field path → text)
const overrides = {
  '1.C.rationale':
    'The universe is a contained, layered simulation rather than an expanse of outer space with separated planets.',
  '1.A.rationale':
    'While it houses realities, it is the crystalline electromagnetic framework and frequency server for the entire system — not a temporary soul storage unit.',
  '2.A.rationale':
    'Movement does not involve crossing physical distance; it is a frequency shift between simulated layers.',
  '2.B.rationale':
    'Reality is a centralized console of layered frequency fields rather than a spherical planet.',
  '7.D.rationale':
    'Individual remembrance increases the frequency of the field, causing the false scaffolding of the 3D construct to fracture.',
  '9.D.rationale':
    'Physicality was deliberately created for structured experience and thought resistance, not as a safety measure for the light worlds.',
  '12.B.rationale':
    'Parasitic forces did not create any of these worlds; they are incapable of generating the first spark of creation and only hijacked pre-existing grids.',
  '14.A.rationale':
    'This reverses the true creative sequence: sound dictates structure, light generates vision, and vision solidifies into form.',
  '16.A.rationale':
    'The collapse is a frequency-based event, not a result of physical demolition.',
  '16.B.rationale':
    'The collapse occurs through a frequency collapse, where the holographic projections drop entirely as resonance rises.',
  '16.hint': 'Is the solution a physical action or a change in vibration?',
  '22.B.rationale':
    'Reality is a centralized, digitalized console of layered frequency fields — not separated planets in outer space.',
  '23.B.rationale':
    'What is restored is the original harmony of The Cube, not a new artificial training cycle.',
  '23.C.rationale':
    'A true crystalline reality exists beneath the overlay, not an empty void.',
  '25.question': 'What is the function of the black crystalline valve locks?'
};

const metaVoiceRe =
  /\b(according to the report|the report states|the source (states|specifies|suggests)|the text (states|describes|suggests|explicitly)|the material clarifies|mentioned in the (text|source))\b/i;

const questions = raw.questions.map((q) => {
  const options = q.options.map((o) => {
    let text = cleanText(o.text);
    let rationale = cleanText(o.rationale);
    const tKey = `${q.number}.${o.label}.text`;
    const rKey = `${q.number}.${o.label}.rationale`;
    if (overrides[tKey]) text = overrides[tKey];
    if (overrides[rKey]) rationale = overrides[rKey];
    else rationale = absoluteVoice(rationale);
    return {
      label: o.label,
      text,
      isCorrect: !!o.isCorrect,
      rationale
    };
  });
  const correct = options.find((o) => o.isCorrect);
  if (!correct) throw new Error(`Q${q.number}: no correct option`);
  if (q.correctAnswer !== correct.label) {
    throw new Error(
      `Q${q.number}: correctAnswer ${q.correctAnswer} != isCorrect ${correct.label}`
    );
  }

  let question = cleanText(q.question);
  let hint = cleanText(q.hint);
  if (overrides[`${q.number}.question`]) question = overrides[`${q.number}.question`];
  if (overrides[`${q.number}.hint`]) hint = overrides[`${q.number}.hint`];
  else {
    question = absoluteVoice(question);
    hint = absoluteVoice(hint);
  }

  const out = {
    number: q.number,
    question,
    options,
    hint,
    correctAnswer: q.correctAnswer
  };

  const blob = [
    out.question,
    out.hint,
    ...options.map((o) => `${o.text} ${o.rationale}`)
  ].join('\n');
  if (latexRe.test(blob)) {
    throw new Error(`Q${q.number}: LaTeX-like markup found: ${blob.match(latexRe)?.[0]}`);
  }
  if (metaVoiceRe.test(blob)) {
    throw new Error(`Q${q.number}: meta/report voice still present`);
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

// Confirm topic image for HTML OG tags
const topicImage = 'images/breakdown/the-cube-system.webp';
if (!fs.existsSync(path.join(ROOT, topicImage))) {
  throw new Error(`Missing topic image: ${topicImage}`);
}

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle:
    'Test your grasp of The Cube System — the master frequency server, eight primary domes, Spirit Tree wound, and frequency collapse that restores the crystalline Known Lands.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'The Cube System is the master frequency server and crystalline hard drive housing all maps, overlays, grids, and domes. Sit with what you missed, then return to The Cube System deep-dive, infographics, and video transmissions. Every time a resonating soul remembers their original harmonic tone, the parasitic overlay fractures further — and the true crystalline ecosystem of the Known Lands comes closer to full reveal.'
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
    'Test your understanding of The Cube System — the master frequency server, eight primary domes, parasitic overlay, and crystalline Known Lands beneath.'
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
  throw new Error('the-cube-system not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from matrix-scaffolding quiz page
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'matrix-scaffolding.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Matrix Scaffolding Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Matrix Scaffolding: the A.I. frequency framework projecting solidity, distance, and continuity, and the crystalline Second Realm beneath.',
    'Interactive Living Truth Quiz on The Cube System: the master frequency server, eight primary domes, Spirit Tree wound, and crystalline Known Lands beneath the parasitic overlay.'
  ],
  ['quiz/breakdown/matrix-scaffolding.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/matrix-scaffolding.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=matrix-scaffolding',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Matrix Scaffolding deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Matrix Scaffolding</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/matrix-scaffolding.json',
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
    "  { path: '/quiz/breakdown/matrix-scaffolding.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/the-cube-system.json'
);
