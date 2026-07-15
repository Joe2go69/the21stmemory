/**
 * Installs Anunnaki quiz for Alice transmission.
 * Audits all 25 items against data/alice-topics/anunnaki.json.
 * Strips LaTeX/MathJax so all text is plain human-readable English.
 * Source has 15 items; 10 additional report-only items expand to the site standard of 25.
 * Run: node scripts/install-anunnaki-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'anunnaki';
const TOPIC_TITLE = 'Anunnaki';
const SOURCE = 'alice';
const SOURCE_QUIZ_CANDIDATES = [
  'G:/My Drive/CH21/Website Files/New Downloads/anuk-quiz.json',
  path.join(ROOT, 'scripts', '_anuk-quiz-source.json'),
];

function loadSourceQuiz() {
  for (const p of SOURCE_QUIZ_CANDIDATES) {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  }
  throw new Error(
    'Source quiz not found. Expected anuk-quiz.json in Google Drive New Downloads or scripts/_anuk-quiz-source.json'
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
  1: ['foundational architects', 'enslaved physical gateway', 'proxy overlords'],
  2: ['12th density', 'caretakers', 'council of 12'],
  3: ['zep tepi', 'first time', 'physically lived alongside'],
  4: ['grand canyon', 'head quarters', 'egypt'],
  5: ['zetas', 'reticuleans', 'physical labs', 'lab-grown'],
  6: ['bio-engineering', 'high-frequency harmonic intention', '4th density'],
  7: ['13 subterranean', 'vatican', 'adrenochrome', 'portals'],
  8: ['royal families', 'priestly class', 'sold-soul', 'bloodlines'],
  9: ['smithsonian', 'giants', "oopa", '12 to 35 meters'],
  10: ['hive-aligned', 'npc souls', 'replicated'],
  11: ['artificially generated', 'laboratories', 'not natural evolutionary'],
  12: ['incapable of pure creation', 'scavenge and manufacture'],
  13: ['amnesia vortex', 'recycling of human souls', 'vatican'],
  14: ['white hats', 'density suppression', 'galactic ancestral alliance'],
  15: ['sold-soul', '33rd-degree freemasons', 'human proxies'],
  16: ['betty and barney hill', 'project serpo', 'c.i.a', 'psyops'],
  17: ['isis', 'osiris', 'horus', 'grand canyon', 'freemasons', 'smithsonian'],
  18: ['beneath the custodians', '4th-density'],
  19: ['thousand-year', 're-sets', 'loosh', 'adrenochrome'],
  20: ['known lands', 'realm-3', 'extraction of human energy'],
  21: ['distrusted one another', 'centralize', 'vatican'],
  22: ['satanic child sacrifice', 'druids', 'freemasons'],
  23: ['predatory consumption', '4th density', 'biological and vibrational ceiling'],
  24: ['long before the realm', 'artificially generated', 'laboratories'],
  25: ['omicron', 'alpha draco', 'greys', 'demons', 'dedicated tier'],
};

/** Plain English: no LaTeX, MathJax, Markdown math, or $...$ wrappers. */
function cleanText(s) {
  if (typeof s !== 'string') return s;
  let t = s;

  // Ordinals: $3^{rd}$ $9^{th}$ $33^{rd}$ $1^{st}$ $2^{nd}$ $12^{th}$ $5^{th}$ $4^{th}$
  t = t.replace(/\$(\d+)\^\{(st|nd|rd|th)\}\$/gi, '$1$2');
  t = t.replace(/\$(\d+)\^(st|nd|rd|th)\$/gi, '$1$2');

  // Percent: $97\%$ or $97\\%$
  t = t.replace(/\$(\d+(?:,\d+)*)\\+%\$/g, '$1%');
  t = t.replace(/\$(\d+(?:,\d+)*)\\?\%\$/g, '$1%');

  // Bare numbers / numbers with commas
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
}

// 10 additional items — every correct answer + rationale paraphrased only from anunnaki.json
const EXTRA_QUESTIONS = [
  {
    number: 16,
    question:
      'What is the truth about the Betty and Barney Hill case and Project Serpo?',
    options: [
      {
        label: 'A',
        text: 'They are verified contact events with star-system Greys from Zeta Reticuli.',
        isCorrect: false,
        rationale:
          'Distant-star origins for the Greys are false cover narratives.',
      },
      {
        label: 'B',
        text: 'They are long-term C.I.A. psyops designed to hide that the Greys were lab-grown earthly tools of the Anuk.',
        isCorrect: true,
        rationale:
          'Betty and Barney Hill lore and Project Serpo as C.I.A. psyops masking the Zetas as Anuk-made laboratory tools, not cosmic visitors.',
      },
      {
        label: 'C',
        text: 'They document White Hat rescue missions against the Anuk hierarchy.',
        isCorrect: false,
        rationale:
          'White Hat intervention is described as dismantling the prison later, not as the content of those abduction narratives.',
      },
      {
        label: 'D',
        text: 'They preserve original Anuk temple records from the Grand Canyon headquarters.',
        isCorrect: false,
        rationale:
          'Grand Canyon name cover-ups are a separate historical obscuration, not the Hill case or Project Serpo.',
      },
    ],
    hint: 'Connect mainstream UFO abduction lore to the lab-grown origin of the Zetas.',
    correctAnswer: 'B',
  },
  {
    number: 17,
    question:
      'Why do Grand Canyon landmarks carry names such as the Isis, Osiris, and Horus Temples?',
    options: [
      {
        label: 'A',
        text: 'Egyptian explorers founded temples there after migrating from the Nile valley.',
        isCorrect: false,
        rationale:
          'The Anuk did not primarily operate out of Egypt and that the Egyptian framing is a deliberate obscuration.',
      },
      {
        label: 'B',
        text: 'They are modern park service inventions with no link to the Anuk period.',
        isCorrect: false,
        rationale:
          'The names are original Anuk names later misattributed, not empty modern inventions.',
      },
      {
        label: 'C',
        text: 'They are original Anuk names later misattributed by Freemason and Smithsonian cover-ups.',
        isCorrect: true,
        rationale:
          'Those Grand Canyon landmarks are original Anuk names, misattributed through Freemason and Smithsonian historical and geological cover-ups.',
      },
      {
        label: 'D',
        text: 'They mark White Hat outposts built during the Great Spiritual Awakening.',
        isCorrect: false,
        rationale:
          'White Hats appear in the collapse of Anuk control, not as builders of those named canyon landmarks.',
      },
    ],
    hint: 'Separate the true Anuk headquarters from the Egyptian cover story.',
    correctAnswer: 'C',
  },
  {
    number: 18,
    question:
      'Where do the Anuk sit within the larger parasitic hierarchy?',
    options: [
      {
        label: 'A',
        text: 'Above the Custodians as the original source of all negativity.',
        isCorrect: false,
        rationale:
          'The Custodians initiated the rebellion and engineered the Anuk; the Anuk do not outrank them.',
      },
      {
        label: 'B',
        text: 'Directly beneath the Custodians, sharing 4th-density limitations.',
        isCorrect: true,
        rationale:
          'The Anuk sit directly beneath the Custodians and they share 4th-density limitations as manufactured parasites.',
      },
      {
        label: 'C',
        text: 'Equal partners with the Council of 12 in managing Gateway-10.',
        isCorrect: false,
        rationale:
          'The Custodians betrayed the Council of 12; the Anuk are instruments of that betrayal, not Council partners.',
      },
      {
        label: 'D',
        text: 'Outside the hierarchy as independent 12th-density caretakers.',
        isCorrect: false,
        rationale:
          '12th density describes the Custodians before their fall, not the manufactured Anuk.',
      },
    ],
    hint: 'Recall who engineered the Anuk and what density ceiling they share.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question:
      'How is the existence of the Anuk tied to the cyclical thousand-year Re-sets?',
    options: [
      {
        label: 'A',
        text: 'Re-sets were natural disasters the Anuk tried to prevent for humanity.',
        isCorrect: false,
        rationale:
          'Re-sets are part of the parasitic harvest system, not as disasters the Anuk opposed.',
      },
      {
        label: 'B',
        text: 'During Re-sets, humanity is mass-harvested for Loosh and Adrenochrome that sustain the Anuk power grid.',
        isCorrect: true,
        rationale:
          'Anuk power is tied to cyclical thousand-year Re-sets in which humanity is mass-harvested for Loosh and Adrenochrome.',
      },
      {
        label: 'C',
        text: 'Re-sets open permanent 5th-density pathways for the Anuk to ascend.',
        isCorrect: false,
        rationale:
          'The Anuk cannot ascend to 5th density; Re-sets feed the harvest, not their elevation.',
      },
      {
        label: 'D',
        text: 'Each Re-set restores the Council of 12 to open rule over the Known Lands.',
        isCorrect: false,
        rationale:
          'Re-sets maintain the parasitic farm; they do not reinstate the Council of 12 over the realm.',
      },
    ],
    hint: 'Link the thousand-year cycle to Loosh, Adrenochrome, and the power grid.',
    correctAnswer: 'B',
  },
  {
    number: 20,
    question:
      "What was the Anuk's survival strictly tethered to within their 4th-density framework?",
    options: [
      {
        label: 'A',
        text: 'Successful suppression of the Known Lands (Realm-3) and continuous extraction of human energy.',
        isCorrect: true,
        rationale:
          'Anuk survival was strictly tethered to suppressing the Known Lands (Realm-3) and continuously extracting human energy.',
      },
      {
        label: 'B',
        text: 'Open alliance with the Galactic Ancestral Alliance and White Hats.',
        isCorrect: false,
        rationale:
          'Those forces intervene against the parasites; they are not Anuk survival partners.',
      },
      {
        label: 'C',
        text: 'Voluntary worship from humanity without any density suppression.',
        isCorrect: false,
        rationale:
          'Their framework depends on density suppression and forced harvest, not free worship.',
      },
      {
        label: 'D',
        text: 'Natural evolution into pure 12th-density caretakers of the plain.',
        isCorrect: false,
        rationale:
          'They face a hard 4th-density ceiling and cannot become high-density caretakers.',
      },
    ],
    hint: 'Think about Realm-3 suppression and energy extraction, not ascension.',
    correctAnswer: 'A',
  },
  {
    number: 21,
    question:
      'Why did the Custodians force parasitic factions to centralize operations beneath the Vatican?',
    options: [
      {
        label: 'A',
        text: 'Because the factions inherently distrusted one another and needed a forced shared nexus of control.',
        isCorrect: true,
        rationale:
          'The parasitic factions inherently distrusted one another, so the Custodians forced them to centralize under the Vatican nexus.',
      },
      {
        label: 'B',
        text: 'Because the Council of 12 ordered a joint diplomatic embassy there.',
        isCorrect: false,
        rationale:
          'The Vatican complex serves the negative agenda after the Custodians betrayed the Council of 12.',
      },
      {
        label: 'C',
        text: 'Because the Grand Canyon headquarters was permanently destroyed during Zep Tepi.',
        isCorrect: false,
        rationale:
          'The Grand Canyon was the Zep Tepi Anuk headquarters; Vatican centralization is a later multi-faction control nexus.',
      },
      {
        label: 'D',
        text: 'Because White Hats required a single surrender site for negotiations.',
        isCorrect: false,
        rationale:
          'The subterranean levels house portals, caged children, and Adrenochrome centers for the parasites, not White Hat diplomacy.',
      },
    ],
    hint: 'Focus on distrust among the parasitic factions and who forced centralization.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question:
      'How were human proxies from ancient Druids to modern 33rd-degree Freemasons bound to manage the realm for the Anuk?',
    options: [
      {
        label: 'A',
        text: 'By open democratic election among the free population.',
        isCorrect: false,
        rationale:
          'Secret sect and priestly systems, not free public elections.',
      },
      {
        label: 'B',
        text: 'By satanic child sacrifice that bound them as administrators of the Anuk agenda.',
        isCorrect: true,
        rationale:
          'Those human proxies were bound by satanic child sacrifice to manage the realm on behalf of their Anuk masters.',
      },
      {
        label: 'C',
        text: 'By pure harmonic intention shared with the Source of Creation.',
        isCorrect: false,
        rationale:
          'Harmonic high-frequency creation is what the manufactured parasites lack; proxies are bound by ritual crime, not Source harmony.',
      },
      {
        label: 'D',
        text: 'By voluntary service as 12th-density caretakers of Gateway-10.',
        isCorrect: false,
        rationale:
          '12th density describes the pre-fall Custodians, not human proxy bloodlines under Anuk control.',
      },
    ],
    hint: 'Connect Secret Sect and Priestly Class systems to the binding ritual named here.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question:
      'What is the truth about 4th density as the ceiling for manufactured parasitic entities?',
    options: [
      {
        label: 'A',
        text: 'As a temporary training band before automatic ascension to 9th density.',
        isCorrect: false,
        rationale:
          'The ceiling is absolute for manufactured parasites; they cannot attain higher harmonic frequencies.',
      },
      {
        label: 'B',
        text: 'As a biological and vibrational ceiling marked by predatory consumption and inability to reach higher harmonics.',
        isCorrect: true,
        rationale:
          '4th density is the biological and vibrational ceiling for manufactured parasites, with predatory consumption and no access to higher harmonic frequencies.',
      },
      {
        label: 'C',
        text: 'As the original density of the pure Custodians before any rebellion.',
        isCorrect: false,
        rationale:
          'The Custodians were formerly pure 12th density caretakers before their fall into the parasitic hierarchy.',
      },
      {
        label: 'D',
        text: 'As the density of the restored realm after the White Hats finish their work.',
        isCorrect: false,
        rationale:
          'The collapse of Anuk control ends the parasitic framework; 4th density is their limitation, not the restored outcome.',
      },
    ],
    hint: 'Recall the definition of 4th density.',
    correctAnswer: 'B',
  },
  {
    number: 24,
    question:
      'When were the Anuk artificially generated relative to the inversion of the realm?',
    options: [
      {
        label: 'A',
        text: 'Long before the realm inversion, as laboratory products of the Custodians.',
        isCorrect: true,
        rationale:
          'The Anuk were artificially generated in laboratories by the Custodians long before the realm inversion.',
      },
      {
        label: 'B',
        text: 'Only after the White Hats began purging the Vatican subterranean levels.',
        isCorrect: false,
        rationale:
          'Anuk manufacture predates the modern dismantling of the prison; it enabled the inversion itself.',
      },
      {
        label: 'C',
        text: 'During the final thousand-year Re-set as a last-ditch survival species.',
        isCorrect: false,
        rationale:
          'They were created early as primary proxy allies so the Custodians would not execute the betrayal alone.',
      },
      {
        label: 'D',
        text: 'After Project Serpo established peaceful contact with Zeta Reticuli.',
        isCorrect: false,
        rationale:
          'Project Serpo is named as a psyop covering lab-grown Greys, not as the birth event of the Anuk.',
      },
    ],
    hint: 'Place Anuk laboratory creation before the inversion, not after modern events.',
    correctAnswer: 'A',
  },
  {
    number: 25,
    question:
      'Which groups operated alongside the Anuk on their dedicated tier within the Vatican complex?',
    options: [
      {
        label: 'A',
        text: 'Only human Smithsonian researchers cataloging Grand Canyon temples.',
        isCorrect: false,
        rationale:
          'The Smithsonian is tied to evidence cover-ups, not as co-occupants of the Anuk subterranean tier.',
      },
      {
        label: 'B',
        text: 'The Custodians, Omicron, Alpha Draco, Greys, and Demons.',
        isCorrect: true,
        rationale:
          'The Anuk held a dedicated tier operating directly alongside the Custodians, Omicron, Alpha Draco, Greys, and Demons.',
      },
      {
        label: 'C',
        text: 'The Council of 12 and the Galactic Ancestral Alliance as equal partners.',
        isCorrect: false,
        rationale:
          'Those are not the co-located parasitic operators of the Vatican negative-control nexus.',
      },
      {
        label: 'D',
        text: 'Solely the Zetas, with no other species allowed underground.',
        isCorrect: false,
        rationale:
          'Multiple parasitic factions share the complex; the Anuk are one dedicated tier among several.',
      },
    ],
    hint: 'List the co-located factions named for the 13 subterranean levels.',
    correctAnswer: 'B',
  },
];

if (!raw.questions || raw.questions.length !== 15) {
  throw new Error(
    `Expected 15 source questions in anuk-quiz.json, got ${raw.questions?.length}`
  );
}

const questions = [
  ...raw.questions.map(normalizeQuestion),
  ...EXTRA_QUESTIONS.map(normalizeQuestion),
];

if (questions.length !== 25) {
  throw new Error(`Expected 25 questions, got ${questions.length}`);
}

// Spot-check ordinals cleaned
const densitySamples = questions
  .flatMap((q) => [
    q.question,
    ...q.options.map((o) => o.text),
    ...q.options.map((o) => o.rationale),
  ])
  .filter((t) => /\d+(st|nd|rd|th)\s+density/i.test(t));
for (const s of densitySamples) {
  if (/\$|\\frac|\^\{/.test(s)) {
    throw new Error(`Uncleaned density text: ${s}`);
  }
}

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle:
    'Test your grasp of the Anunnaki — Custodian-engineered proxy overlords, Zep Tepi and Grand Canyon headquarters, lab-grown Zetas, 4th-density limits, Vatican control, and the collapse of their prison.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      "The Anuk (Anunnaki) were never star-born gods — they were the Custodians' first great genetic success, lab-made proxy overlords used to invert the realm, seed sold-soul bloodlines, manufacture Grey foot soldiers, and feed a thousand-year harvest through Vatican portals and the amnesia vortex. Sit with what you missed, then return to the Anunnaki deep-dive, infographics, and video transmissions. As density suppression fails under Galactic Ancestral Alliance and White Hat pressure, their 4th-density ceiling becomes a trap with no exit — holding that knowing is part of the Great Remembering.",
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
    'Test your understanding of the Anunnaki — Custodian-engineered Anuk proxy overlords, Zep Tepi, Grand Canyon headquarters, lab-grown Zetas, 4th-density limits, and the collapse of their control.',
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
  throw new Error('anunnaki not found in alice-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', 'alice', 'nature-of-reality.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Nature of Reality Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Nature of Reality: the flat plain, Firmament, density suppression, and the Great Spiritual Awakening.',
    'Interactive Living Truth Quiz on Anunnaki: Custodian-engineered Anuk proxy overlords, Zep Tepi, Grand Canyon headquarters, lab-grown Zetas, 4th-density limits, and the collapse of their control.',
  ],
  ['quiz/alice/nature-of-reality.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/nature-of-reality.webp', 'images/alice/anuk.webp'],
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
    "  { path: '/quiz/alice/antiquity-technology.html', priority: '0.75', changefreq: 'monthly' },";
  if (!sm.includes(anchor)) {
    throw new Error('Could not find sitemap anchor to insert quiz entry');
  }
  sm = sm.replace(anchor, `${anchor}\n${entry}`);
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

// Spot-check cleaned strings
const samples = [
  questions[1].options.find((o) => o.isCorrect).text,
  questions[5].question,
  questions[11].question,
  questions[15].options.find((o) => o.isCorrect).text,
];
console.log('Sample cleaned texts:');
samples.forEach((s) => console.log(' -', s));

console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log(
  'PASS: audited 25/25 against data/alice-topics/anunnaki.json'
);
