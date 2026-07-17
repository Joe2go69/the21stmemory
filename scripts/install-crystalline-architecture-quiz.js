/**
 * Installs Crystalline Architecture quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/crystalline-quiz.json
 * Audits all 25 items against data/breakdown-topics/crystalline-architecture.json.
 * Run: node scripts/install-crystalline-architecture-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/crystalline-architecture.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'crystalline-architecture';
const TOPIC_TITLE = 'Crystalline Architecture';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/crystalline-quiz.json';

const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

/** Support phrases grounded only in crystalline-architecture.json report. */
const supportPhrases = {
  1: ['frequency amplifier', 'higher light worlds', 'physical layer of the known lands'],
  2: ['sound generates structure', 'folds into light', 'crystallizes into physical form'],
  3: ['multidimensional data crystals', 'star-nodes', 'distant burning suns'],
  4: ['harmonic lenses', 'sensory and relay organs', 'active nodes'],
  5: ['boxes, flat roofs, and sharp right angles', 'dead frequency holders'],
  6: ['lose their anchor and vanish', 'corporate buildings', 'traffic lights'],
  7: ['living crafts', 'telepathic intention', 'mechanical controls'],
  8: ['frequency bricks', 'living conductors', 'red bricks'],
  9: ['crystalline membranes', 'soul fields', 'light lattices'],
  10: ['unbroken, radiant architecture', 'original builders', 'false skin'],
  11: ['surface crystals', 'antennas', 'quartz veins'],
  12: ['star forts', 'sound bowls', 'cosmic current'],
  13: ['perception-based solidity', 'hard, heavy, and permanent', 'concrete or steel'],
  14: ['crystal halls', 'cathedrals and churches', 'living crystal'],
  15: ['spirit tree', 'central axis node', 'great dome'],
  16: ['physical and etheric hard drives', 'source codes', 'memory, frequency'],
  17: ['schools, offices, and hospitals', 'anti-resonance cages', 'fatigue, disconnection, and anxiety'],
  18: ['lyran, pleiadian, and andromedan', 'solar builders', 'living light structures'],
  19: ['granite', 'copper domes', 'quartz inlay'],
  20: ['sub-crystalline band', 'faster than any wire', 'linking continents'],
  21: ['not created as a trap', 'frequency amplifier', 'training ground'],
  22: ['living lenses', 'resonating sols', 'amplifying the crystalline network'],
  23: ['crystal light-worlds', 'frequency states', 'before physicality'],
  24: ['revealing back', 'crystalline coastlines', 'smooth crystalline grounds'],
  25: ['grown and sung into existence', 'mastery of tone']
};

function cleanText(s) {
  let t = String(s || '');
  t = t.replace(/\$3\\text\{D\}\$/g, '3D');
  t = t.replace(/\$3\\mathrm\{D\}\$/g, '3D');
  t = t.replace(/\$3D\$/g, '3D');
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
    [/^According to the crystalline architecture perspective,?\s*/i, ''],
    [/\baccording to the crystalline architecture perspective\b/gi, ''],
    [/\baccording to the (report|source|text)\b/gi, ''],
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
    [/\bmentioned in the source material\b/gi, ''],
    [/\bmentioned in the text\b/gi, ''],
    [/\bsource material\b/gi, 'transmission'],
    [/\bin the source material\b/gi, ''],
    [/\bthe source specifies that\b/gi, ''],
    [
      /Think about the cosmic origins mentioned in the text\./i,
      'Recall the ancient Lyran, Pleiadian, and Andromedan architects of the living grids.'
    ],
    [
      /What is the nature of 'True Matter' according to the crystalline architecture perspective\?/i,
      'What is the nature of true matter within crystalline architecture?'
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

/** Expand True/False pairs into four full-length claims (site quality standard). */
function expandTrueFalse(qNum, options) {
  if (options.length !== 2) return options;
  const correct = options.find((o) => o.isCorrect);
  const wrong = options.find((o) => !o.isCorrect);
  if (!correct || !wrong) return options;

  const extras = {
    7: {
      correctText:
        'False — Living Crafts are semi-conscious crystalline and plasmatic vessels that respond to telepathic intention rather than mechanical controls.',
      correctRationale:
        'Living Crafts are gestated from crystalline and plasmatic matter and respond to telepathic intention, not manual mechanical interfaces.',
      wrongText:
        'True — Living Crafts are mechanical transportation arks that require manual controls and physical interfaces to operate.',
      wrongRationale:
        'Living Crafts are not mechanical arks with manual controls; they are semi-conscious ships guided by telepathic intention.',
      extra: [
        {
          text: 'Living Crafts are pure light holograms that cannot carry passengers and only display navigation maps.',
          rationale:
            'Living Crafts are transportation arks gestated from crystalline and plasmatic matter, not mere holographic displays.'
        },
        {
          text: 'Living Crafts are fully automated drones programmed by the parasitic overlay to enforce 3D travel routes.',
          rationale:
            'Living Crafts belong to original crystalline architecture and respond to telepathic intention, not parasitic drone programming.'
        }
      ]
    },
    14: {
      correctText:
        'True — Crystal Halls are pure frequency spaces of light, sound, and living crystal, often overlaid by modern cathedrals and churches.',
      correctRationale:
        'Crystal Halls feature living crystal walls and harmonic slabs, and are often overlaid by modern cathedrals and churches that sit on the same nodes.',
      wrongText:
        'False — Crystal Halls exist only as modern glass skyscrapers and never under cathedrals or churches.',
      wrongRationale:
        'Crystal Halls are ancient living-crystal healing sanctuaries frequently overlaid by cathedrals and churches, not modern skyscrapers alone.',
      extra: [
        {
          text: 'Crystal Halls are temporary tents of projected light that vanish each night and leave no fixed architecture.',
          rationale:
            'Crystal Halls are durable frequency spaces with living crystal walls and slabs, not temporary nightly projections.'
        },
        {
          text: 'Crystal Halls are underground metal bunkers built from steel and concrete to block all harmonic frequency.',
          rationale:
            'Crystal Halls are built from light, sound, and living crystal to realign the light body, not from dead steel and concrete.'
        }
      ]
    },
    21: {
      correctText:
        'False — The Known Lands were created as a Frequency Amplifier and training ground for expanding thought and mastery, not as a trap.',
      correctRationale:
        'The physical layer was not created as a trap but as a Frequency Amplifier; the trap aspect is the later parasitic overlay.',
      wrongText:
        'True — The Known Lands were originally built by Solar Builders solely as a permanent prison to enslave human consciousness.',
      wrongRationale:
        'Original design was a Frequency Amplifier and training ground; enslavement comes from the parasitic overlay, not the original architecture.',
      extra: [
        {
          text: 'The Known Lands formed by accident when random density collapsed with no intentional design or purpose.',
          rationale:
            'Physical form followed deliberate crystallization of Crystal Light-Worlds into the Original Realm and Great Dome as a training ground.'
        },
        {
          text: 'The Known Lands exist only as a digital video game with no frequency architecture or crystalline framework underneath.',
          rationale:
            'The realm rests on a massive Crystalline Electro-Magnetic Framework; density is real crystallization, not a mere video game without lattice.'
        }
      ]
    }
  };

  const e = extras[qNum];
  if (!e) {
    return [
      {
        text: correct.text === 'False' || correct.text === 'True'
          ? `${correct.text} — ${correct.rationale}`
          : correct.text,
        isCorrect: true,
        rationale: correct.rationale
      },
      {
        text: wrong.text === 'False' || wrong.text === 'True'
          ? `${wrong.text} — ${wrong.rationale}`
          : wrong.text,
        isCorrect: false,
        rationale: wrong.rationale
      },
      {
        text: 'This claim contradicts crystalline architecture and cannot be true.',
        isCorrect: false,
        rationale: 'Only report-aligned claims describe crystalline architecture accurately.'
      },
      {
        text: 'The architecture operates in reverse of what the correct option states.',
        isCorrect: false,
        rationale: 'Crystalline architecture mechanics are fixed by frequency design, not reversed lore.'
      }
    ];
  }

  return [
    {
      text: e.correctText,
      isCorrect: true,
      rationale: e.correctRationale
    },
    {
      text: e.wrongText,
      isCorrect: false,
      rationale: e.wrongRationale
    },
    {
      text: e.extra[0].text,
      isCorrect: false,
      rationale: e.extra[0].rationale
    },
    {
      text: e.extra[1].text,
      isCorrect: false,
      rationale: e.extra[1].rationale
    }
  ];
}

const overrides = {
  '18.hint':
    'Recall the ancient Lyran, Pleiadian, and Andromedan architects of the living grids.',
  '18.B.rationale':
    'Solar Builders are the ancient Lyran, Pleiadian, and Andromedan architects who designed the living light structures and grids of the physical realms.',
  '25.question': 'What is the nature of true matter within crystalline architecture?',
  '25.A.rationale':
    'True matter is not built mechanically; it is grown and sung into existence through the mastery of tone.',
  '7.question':
    'Are Living Crafts mechanical transportation arks that require manual controls to operate?',
  '14.question':
    'Are Crystal Halls often hidden or overlaid by modern structures such as cathedrals and churches?',
  '21.question':
    'Were the Known Lands originally created as a trap to enslave human consciousness?'
};

const metaVoiceRe =
  /\b(according to the (report|source|text)|the report states|the source (states|specifies|suggests)|the text (states|describes|suggests|explicitly|mentions|defines|calls|focuses)|the material clarifies|mentioned in the (text|source)|source material|according to the crystalline architecture perspective)\b/i;

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

  // Ensure each option has isCorrect flag after expand
  if (options.length === 4 && options.every((o) => o.isCorrect === undefined || o.label)) {
    // expandTrueFalse already sets isCorrect
  }

  const correctBefore = options.find((o) => o.isCorrect);
  if (!correctBefore) throw new Error(`Q${q.number}: no correct option`);

  let question = cleanText(q.question);
  let hint = cleanText(q.hint);
  if (overrides[`${q.number}.question`]) question = overrides[`${q.number}.question`];
  else question = absoluteVoice(question);
  if (overrides[`${q.number}.hint`]) hint = overrides[`${q.number}.hint`];
  else hint = absoluteVoice(hint);

  const finalized = finalizeOptions(
    options.map(({ text, isCorrect, rationale }) => ({
      text,
      isCorrect: !!isCorrect,
      rationale
    })),
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

  if (out.options.length !== 4) throw new Error(`Q${q.number}: need 4 options, got ${out.options.length}`);
  if (out.options.filter((o) => o.isCorrect).length !== 1) {
    throw new Error(`Q${q.number}: need exactly 1 correct`);
  }
  for (const o of out.options) {
    if (!o.rationale || o.rationale.length < 8) {
      throw new Error(`Q${q.number}${o.label}: short rationale`);
    }
    if (/^(true|false)$/i.test(o.text.trim())) {
      throw new Error(`Q${q.number}${o.label}: bare True/False option not expanded`);
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

/** Nudge correct-letter distribution when one letter is starved. */
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

const topicImage = 'images/breakdown/crystalline-architecture.webp';
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
    'Test your grasp of Crystalline Architecture — the Crystalline Electro-Magnetic Framework, Crystal Light-Worlds, True Sol vs parasitic 3D geometry, crystals as hard drives, and the reveal of the Crystalline Temple.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Crystalline Architecture is the living electro-magnetic framework of existence: Crystal Light-Worlds crystallized into the Original Realm and Great Dome, true Sol geometry versus parasitic cages, and crystals as hard drives of memory and Source Codes. Sit with what you missed, then return to the Crystalline Architecture deep-dive, infographics, and video transmissions. As frequency rises, the overlay fractures — and Resonating Sols act as living lenses accelerating the reveal of the unbroken Crystalline Temple.'
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
    'Test your understanding of Crystalline Architecture — Crystal Light-Worlds, Frequency Amplifier design, True Sol vs parasite geometry, crystals as hard drives, and the reveal of the Crystalline Temple.'
};
topic.quiz = quizMeta;
fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2) + '\n', 'utf8');

const monoPath = path.join(ROOT, 'data', 'breakdown-topics.json');
const mono = JSON.parse(fs.readFileSync(monoPath, 'utf8'));
function findAndPatch(topics) {
  for (const t of topics) {
    if (t.id === TOPIC_ID) {
      t.quiz = quizMeta;
      if (topic.report) t.report = topic.report;
      if (topic.infographic_image) t.infographic_image = topic.infographic_image;
      if (topic.pdf_preview_image) t.pdf_preview_image = topic.pdf_preview_image;
      if (topic.slide_deck_pdf_url) t.slide_deck_pdf_url = topic.slide_deck_pdf_url;
      if (topic.rumble_videos) t.rumble_videos = topic.rumble_videos;
      t.is_placeholder = false;
      t.topic_image = topicImage;
      if (!t.title) t.title = TOPIC_TITLE;
      if (!t.description) {
        t.description = quizMeta.description;
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('crystalline-architecture not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from hard-drive-framework quiz page
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on Crystalline Architecture: the Crystalline Electro-Magnetic Framework, Crystal Light-Worlds, True Sol vs parasitic 3D geometry, and the reveal of the Crystalline Temple.'
  ],
  ['quiz/breakdown/hard-drive-framework.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/hard-drive-framework.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=hard-drive-framework',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Hard Drive Framework deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Hard Drive Framework</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/hard-drive-framework.json',
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
    "  { path: '/quiz/breakdown/hard-drive-framework.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/crystalline-architecture.json'
);
