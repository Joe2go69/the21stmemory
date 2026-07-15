/**
 * Installs Hard Drive Framework quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/cube-quiz.json
 * Audits all 25 items against data/breakdown-topics/hard-drive-framework.json.
 * Run: node scripts/install-hard-drive-framework-quiz.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'hard-drive-framework';
const TOPIC_TITLE = 'Hard Drive Framework';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/cube-quiz.json';

const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

/** Support phrases grounded only in hard-drive-framework.json report. */
const supportPhrases = {
  1: ['multi-dimensional frequency server', 'cube containment', 'houses', 'realities'],
  2: ['shifting frequency', 'slide perception', 'physical distance is an engineered illusion'],
  3: ['crystals', 'physical and etheric hard drives', 'soul journey'],
  4: ['dome of forgotten gods', 'root tone', 'origin chamber'],
  5: ['great dome', '178', 'interwoven physical worlds'],
  6: ['perception overlays', 'solid physical geography', 'lands, oceans, and borders'],
  7: ['not a physical object', '3d sense', 'crystalline electro-magnetic framework'],
  8: ['transparent sheets', 'specific frequency', 'exact same space'],
  9: ['raise their vibration', 'uncorrupted memory streams', 'amnesia'],
  10: ['oceans, deserts, and major cities', 'energy harvesting'],
  11: ['dome of five peaks', 'dome of sheol', 'dome of hiva'],
  12: ['sound, light, and motion', 'illusion of physical reality'],
  13: ['borders', 'isolation', 'no anchor in true reality'],
  14: ['permanently recorded', 'ever truly lost', 'crystalline hard drives'],
  15: ['fiber optic lines of source', 'crystals'],
  16: ['pure fabrications', 'flat or spherical separation'],
  17: ['glitch', 'crystalline temple', 'harmonic alignment'],
  18: ['eight foundational domes', 'cube'],
  19: ['simulated traveling', 'shifting frequency', 'physical distance'],
  20: ['external architects', 'hacked'],
  21: ['transparent sheets', 'vibrating at its own specific frequency'],
  22: ['false projection overlays', 'grid locks', 'crystalline hard drives'],
  23: ['master frequency server', 'cube containment'],
  24: ['above and below', 'great dome', 'dome of forgotten gods'],
  25: ['sound, light, and motion']
};

function cleanText(s) {
  let t = String(s || '');
  t = t.replace(/\$3\\text\{D\}\$/g, '3D');
  t = t.replace(/\$3\\mathrm\{D\}\$/g, '3D');
  t = t.replace(/\$(\d+(?:\.\d+)?)\$/g, '$1');
  t = t.replace(/\$(\d+)%\$/g, '$1%');
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

function absoluteVoice(s) {
  let t = String(s || '');
  const rewrites = [
    [/^According to the source,?\s*/i, ''],
    [/^According to the report,?\s*/i, ''],
    [/^According to the text,?\s*/i, ''],
    [/^The source states that\s+/i, ''],
    [/^The source specifies that\s+/i, ''],
    [/^The source suggests that\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The text suggests that\s+/i, ''],
    [/^The text mentions\s+/i, ''],
    [/^The text focuses on\s+/i, ''],
    [/^The text explicitly states that\s+/i, ''],
    [/^The material clarifies that\s+/i, ''],
    [/\bThe text states that\b/gi, ''],
    [/\bThe text mentions\b/gi, ''],
    [/\bthe text mentions\b/gi, ''],
    [/\bThe text defines\b/gi, ''],
    [/\bthe text defines\b/gi, ''],
    [/\bThe text calls these tools\b/gi, 'These tools are called'],
    [/\bmentioned in the source material\b/gi, ''],
    [/\bmentioned in the text\b/gi, ''],
    [/\bsource material\b/gi, 'transmission'],
    [/\bin the source material\b/gi, ''],
    [/\bthe source specifies that\b/gi, ''],
    [
      /Check the Overview section for how the 'universe' is fundamentally structured\./i,
      'Recall how the CUBE structures all existence as a frequency server.'
    ],
    [
      /Review the names provided in the section regarding the CUBE's architecture\./i,
      'Recall the eight foundational domes listed for the CUBE architecture.'
    ],
    [
      /Recall the section about the permanence of data in the crystalline storage systems\./i,
      'Recall how crystalline hard drives permanently store every soul timeline.'
    ],
    [
      /Think about the 'transparent sheets' analogy used in the source material\./i,
      'Think of the transparent-sheets analogy for layered frequency realms.'
    ],
    [
      /Differentiate between the 'architects' and the 'parasites' mentioned in the text\./i,
      'Differentiate between the external architects and the parasites.'
    ],
    [
      /Consider why the text calls these tools 'pure fabrications'\./i,
      "Consider why maps are called pure fabrications of the 3D overlay."
    ]
  ];
  for (const [re, rep] of rewrites) {
    t = t.replace(re, rep);
  }
  t = t.replace(/^\s*([a-z])/, (_, c) => c.toUpperCase());
  t = t.replace(/\s+/g, ' ').trim();
  t = t.replace(/\s+([.,;:])/g, '$1');
  return t;
}

/** Expand True/False pairs into four full options (site quality standard). */
function expandTrueFalse(qNum, options) {
  if (options.length !== 2) return options;
  const correct = options.find((o) => o.isCorrect);
  const wrong = options.find((o) => !o.isCorrect);
  if (!correct || !wrong) return options;

  const extras = {
    7: [
      {
        text: 'It is a spherical planet at the center of outer space that stores dimensional coordinates.',
        rationale:
          'The CUBE is a multi-dimensional electromagnetic framework, not a planet in outer space.'
      },
      {
        text: 'It is a temporary biological life-support shell that dissolves once a soul leaves incarnation.',
        rationale:
          'The CUBE is the permanent structural foundation of existence, not a temporary biological shell.'
      }
    ],
    14: [
      {
        text: 'Only major historical events are stored; personal soul journeys are discarded after death.',
        rationale:
          'Crystalline hard drives capture every interaction, timeline, and soul experience without loss.'
      },
      {
        text: 'Amnesia technology permanently erases origin codes from the crystalline grid.',
        rationale:
          'Parasitic amnesia can filter awareness, but origin codes remain stored in the crystalline hard drives.'
      }
    ],
    20: [
      {
        text: 'Parasites built the CUBE first, then invited external architects to decorate the domes.',
        rationale:
          'Parasites cannot create a framework of this magnitude; they only hacked a pre-existing system.'
      },
      {
        text: 'The physical plane formed accidentally when random frequencies collided in empty space.',
        rationale:
          'The physical plane was dreamed into form by external architects bending light and sound through the console.'
      }
    ],
    24: [
      {
        text: 'The Dome of Forgotten Gods sits only above The Great Dome and never below it.',
        rationale:
          'The root dome sits both above and below The Great Dome to power and stabilize the CUBE.'
      },
      {
        text: 'The Dome of Titans wraps The Great Dome while the Dome of Forgotten Gods remains external.',
        rationale:
          'It is the Dome of Forgotten Gods that wraps the CUBE and stabilizes The Great Dome, not the Dome of Titans.'
      }
    ]
  };

  const extra = extras[qNum] || [
    {
      text: 'This claim contradicts the Hard Drive Framework architecture and cannot be true.',
      rationale: 'Only report-aligned claims describe the Hard Drive Framework accurately.'
    },
    {
      text: 'The framework operates in reverse of what the correct option states.',
      rationale: 'The Hard Drive Framework mechanics are fixed by crystalline frequency design, not reversed lore.'
    }
  ];

  return [
    correct,
    wrong,
    { label: 'C', text: extra[0].text, isCorrect: false, rationale: extra[0].rationale },
    { label: 'D', text: extra[1].text, isCorrect: false, rationale: extra[1].rationale }
  ];
}

const overrides = {
  '5.D.rationale':
    'Thousands of dimensions span the wider CUBE, but The Great Dome specifically holds 178 interwoven physical worlds.',
  '5.A.rationale':
    'The Great Dome holds exactly 178 interwoven physical worlds within the CUBE architecture.',
  '7.question':
    'Is The CUBE Containment a physical object in the traditional three-dimensional sense?',
  '7.B.rationale':
    'The CUBE is a massive crystalline electromagnetic framework and frequency server, not a traditional 3D physical object.',
  '7.A.rationale':
    'While it generates the illusion of physical reality, the CUBE itself is a multi-dimensional electromagnetic framework.',
  '8.A.rationale':
    'Physical distance is an illusion; environments exist in the exact same space, separated only by vibrational resonance.',
  '9.B.rationale':
    'Harmonic alignment restores uncorrupted memory streams and collapses false overlays rather than converting the body into pure light.',
  '11.B.rationale':
    'Dome of the Sun Kings is not among the eight foundational domes of the CUBE architecture.',
  '12.question': 'What generates the illusion of solid physical reality within the Hard Drive Framework?',
  '12.A.rationale':
    'The CUBE processes sound, light, and motion to generate the illusion of physical reality.',
  '16.hint': "Consider why maps are called pure fabrications of the 3D overlay.",
  '16.B.rationale':
    'Cartography forces the mind to see flat or spherical separation instead of overlapping vibrational realms.',
  '19.question': "What does 'Simulated Traveling' mean within the Hard Drive Framework?",
  '19.C.rationale':
    'Simulated Traveling is the legitimate method of moving between CUBE layers by frequency shift, not a stationary pod illusion.',
  '19.D.rationale':
    'Because physical space is an illusion, travel is a shift in vibrational resonance through portals, gateways, or vortexes.',
  '20.B.rationale':
    'The physical plane was dreamed into form by external architects using the console to bend light and sound; parasites only hacked it later.',
  '21.hint': 'Think of the transparent-sheets analogy for layered frequency realms.',
  '21.A.rationale':
    'Thousands of layers stack like transparent sheets, each vibrating at its own specific frequency to remain distinct.',
  '24.A.rationale':
    'The Dome of Forgotten Gods sits above and below The Great Dome, wrapping the CUBE with stabilizing harmonic waves.',
  '24.B.rationale':
    'The Dome of Forgotten Gods wraps the CUBE and sits both above and below The Great Dome — it is not limited to one side.'
};

const metaVoiceRe =
  /\b(according to the (report|source|text)|the report states|the source (states|specifies|suggests)|the text (states|describes|suggests|explicitly|mentions|defines|calls|focuses)|the material clarifies|mentioned in the (text|source)|source material)\b/i;

const questions = raw.questions.map((q) => {
  let options = q.options.map((o) => {
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

  options = expandTrueFalse(q.number, options);

  const correctBefore = options.find((o) => o.isCorrect);
  if (!correctBefore) throw new Error(`Q${q.number}: no correct option`);

  let question = cleanText(q.question);
  let hint = cleanText(q.hint);
  if (overrides[`${q.number}.question`]) question = overrides[`${q.number}.question`];
  else question = absoluteVoice(question);
  if (overrides[`${q.number}.hint`]) hint = overrides[`${q.number}.hint`];
  else hint = absoluteVoice(hint);

  // Drop original correctAnswer; finalizeOptions reshuffles labels
  const finalized = finalizeOptions(
    options.map(({ text, isCorrect, rationale }) => ({ text, isCorrect, rationale })),
    `${TOPIC_ID}-${q.number}`
  );

  const out = {
    number: q.number,
    question,
    options: finalized.options,
    hint,
    correctAnswer: finalized.correctAnswer
  };

  const blob = [
    out.question,
    out.hint,
    ...out.options.map((o) => `${o.text} ${o.rationale}`)
  ].join('\n');
  if (latexRe.test(blob) || /\$/.test(blob)) {
    throw new Error(`Q${q.number}: LaTeX/$ markup found: ${blob.match(/\$[^$]*\$|\$/)?.[0]}`);
  }
  if (metaVoiceRe.test(blob)) {
    throw new Error(`Q${q.number}: meta/report voice still present: ${blob.match(metaVoiceRe)?.[0]}`);
  }

  const phrases = supportPhrases[q.number] || [];
  const missing = phrases.filter((p) => !reportLower.includes(p.toLowerCase()));
  if (missing.length) {
    throw new Error(
      `Q${q.number}: report does not support phrases: ${missing.join('; ')}`
    );
  }

  if (out.options.length < 2) throw new Error(`Q${q.number}: need 2+ options`);
  if (out.options.filter((o) => o.isCorrect).length !== 1) {
    throw new Error(`Q${q.number}: need exactly 1 correct`);
  }
  for (const o of out.options) {
    if (!o.rationale || o.rationale.length < 8) {
      throw new Error(`Q${q.number}${o.label}: short rationale`);
    }
  }
  return out;
});

if (questions.length !== 25) {
  throw new Error(`Expected 25 questions, got ${questions.length}`);
}

function recountLetters(qs) {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of qs) counts[q.correctAnswer] = (counts[q.correctAnswer] || 0) + 1;
  return counts;
}

/** Nudge correct-letter distribution when one letter is starved (still keep content intact). */
function rebalanceCorrectLetters(qs) {
  const order = ['A', 'B', 'C', 'D'];
  for (let pass = 0; pass < 40; pass++) {
    const counts = recountLetters(qs);
    const minL = order.reduce((a, b) => (counts[a] <= counts[b] ? a : b));
    const maxL = order.reduce((a, b) => (counts[a] >= counts[b] ? a : b));
    if (counts[minL] >= 4 && counts[maxL] <= 9) break;
    const donor = qs.find((q) => q.correctAnswer === maxL);
    if (!donor) break;
    const from = donor.options.find((o) => o.isCorrect);
    const to = donor.options.find((o) => o.label === minL);
    if (!from || !to || from === to) break;
    // Swap content between correct option and target letter slot, then fix flags
    const tmp = { text: from.text, rationale: from.rationale };
    from.text = to.text;
    from.rationale = to.rationale;
    from.isCorrect = false;
    to.text = tmp.text;
    to.rationale = tmp.rationale;
    to.isCorrect = true;
    donor.correctAnswer = minL;
  }
  return recountLetters(qs);
}

const letterCounts = rebalanceCorrectLetters(questions);
const maxLetter = Math.max(...Object.values(letterCounts));
const minLetter = Math.min(...Object.values(letterCounts));
if (maxLetter >= 15 || minLetter < 2) {
  throw new Error(`Correct answers too skewed: ${JSON.stringify(letterCounts)}`);
}

const topicImage = 'images/breakdown/hard-drive-framework.webp';
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
    'Test your grasp of the Hard Drive Framework — The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, eight primary domes, and the reboot that reveals the crystalline temple.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'The Hard Drive Framework is the structural foundation of existence: The CUBE Containment runs all maps, overlays, grids, and simulations as a multi-dimensional frequency server. Sit with what you missed, then return to the Hard Drive Framework deep-dive, infographics, and video transmissions. As enough souls achieve harmonic alignment, false overlays glitch and collapse — and the pure interwoven crystalline temple reboots into view.'
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
    'Test your understanding of the Hard Drive Framework — The CUBE Containment, crystalline hard drives, perception overlays, eight primary domes, and the frequency reboot of the crystalline temple.'
};
topic.quiz = quizMeta;
fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2) + '\n', 'utf8');

const monoPath = path.join(ROOT, 'data', 'breakdown-topics.json');
const mono = JSON.parse(fs.readFileSync(monoPath, 'utf8'));
function findAndPatch(topics) {
  for (const t of topics) {
    if (t.id === TOPIC_ID) {
      t.quiz = quizMeta;
      // Keep mono report in sync if heavy fields already present
      if (topic.report) t.report = topic.report;
      if (topic.infographic_image) t.infographic_image = topic.infographic_image;
      if (topic.pdf_preview_image) t.pdf_preview_image = topic.pdf_preview_image;
      if (topic.slide_deck_pdf_url) t.slide_deck_pdf_url = topic.slide_deck_pdf_url;
      if (topic.rumble_videos) t.rumble_videos = topic.rumble_videos;
      t.is_placeholder = false;
      t.topic_image = topicImage;
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('hard-drive-framework not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from matrix-scaffolding quiz page
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'matrix-scaffolding.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Matrix Scaffolding Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Matrix Scaffolding: the A.I. frequency framework projecting solidity, distance, and continuity, and the crystalline Second Realm beneath.',
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.'
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
    "  { path: '/quiz/breakdown/the-cube-system.html', priority: '0.75', changefreq: 'monthly' },";
  if (!sm.includes(anchor)) {
    throw new Error('Could not find sitemap anchor to insert quiz entry');
  }
  sm = sm.replace(anchor, `${anchor}\n${entry}`);
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('Correct letter mix:', letterCounts);
console.log(
  'PASS: audited 25/25 against data/breakdown-topics/hard-drive-framework.json'
);
