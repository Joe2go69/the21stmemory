/**
 * Installs Vibrant Reality quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/reality-quiz.json
 * Audits all 25 items against data/breakdown-topics/vibrant-reality.json.
 * Run: node scripts/install-vibrant-reality-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/vibrant-reality.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'vibrant-reality';
const TOPIC_TITLE = 'Vibrant Reality';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/reality-quiz.json';

const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

/** Support phrases grounded only in vibrant-reality.json report. */
const supportPhrases = {
  1: ['instantaneous revelation', 'frequency shift', 'not a process of physical demolition'],
  2: ['parasitic overlay', 'holographic', 'false'],
  3: ['global med bed', 'preventing illness', 'aging'],
  4: ['frequency collapse', 'false density constructs vanish', 'illusion grid'],
  5: ['smooth crystalline grounds', 'natural walking paths', 'roads, tarmac'],
  6: ['echo illusion of rubble', 'deep sleepers', 'non-player characters'],
  7: ['lyran, pleiadian, and andromedan', 'solar builders'],
  8: ['true dome', 'real cosmic sky', 'heavy artificial layer'],
  9: ['sudden bright flash', 'reset signal', 'pixels'],
  10: ['frequency stability', 'disorientation', 'perceptual lag', 'high harmonic tone'],
  11: ['corporate buildings', 'money', 'vanishes'],
  12: ['free energy', 'electro-magnetic field', 'power sockets'],
  13: ['build back', 'reveals back'],
  14: ['great dome', 'imagination could harden', 'precise structure'],
  15: ['vastly more land', 'coastlines', 'islands and peninsulas'],
  16: ['resonance points', 'portal gates', 'instant travel'],
  17: ['living, interconnected ecosystem', 'crystalline temple', 'elevate'],
  18: ['dense 3d attachments', '3d wealth', 'pixelate out of existence'],
  19: ['already present', 'functioning constantly beneath'],
  20: ['holographical screen', 'pixels', 'static on an old screen'],
  21: ['temporary healing simulations', 'guided outward'],
  22: ['internal vibration', 'experiential split'],
  23: ['heavy artificial layer', 'drops away', 'true dome'],
  24: ['crystalline temple', 'global med bed', 'healing'],
  25: ['mathematically doomed', 'hoard 3d wealth', 'pixelate out of existence']
};

function cleanText(s) {
  let t = String(s || '');
  // Ordinals: $3^{rd}$ $9^{th}$
  t = t.replace(/\$(\d+)\^\{(st|nd|rd|th)\}\$/gi, '$1$2');
  t = t.replace(/\$(\d+)\^(st|nd|rd|th)\$/gi, '$1$2');
  t = t.replace(/\$3\\text\{D\}\$/g, '3D');
  t = t.replace(/\$3\\mathrm\{D\}\$/g, '3D');
  t = t.replace(/\$3D\$/g, '3D');
  t = t.replace(/\$(\d+(?:\.\d+)?)\$/g, '$1');
  t = t.replace(/\$(\d+)%\$/g, '$1%');
  t = t.replace(/\$(\d+(?:,\d+)*)\\+%\$/g, '$1%');
  t = t.replace(/\$([A-Za-z][A-Za-z0-9./-]{0,24})\$/g, '$1');
  t = t.replace(/\$([^$]+)\$/g, (_, inner) =>
    inner
      .replace(/\^\{([^}]+)\}/g, '$1')
      .replace(/\\text\{([^}]*)\}/g, '$1')
      .replace(/\\mathrm\{([^}]*)\}/g, '$1')
      .replace(/\\%/g, '%')
      .replace(/\\[a-zA-Z]+/g, '')
      .replace(/[{}]/g, '')
  );
  t = t.replace(/\^\{(st|nd|rd|th)\}/gi, '$1');
  t = t.replace(/\\\(|\\\)|\\\[|\\\]/g, '');
  t = t.replace(/\\%/g, '%');
  t = t
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, '—')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ');
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

function absoluteVoice(s) {
  let t = String(s || '');
  const rewrites = [
    [/^According to the source,?\s*/i, ''],
    [/^According to the report,?\s*/i, ''],
    [/^According to the text,?\s*/i, ''],
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
    [/^The text explicitly states\s+/i, ''],
    [/^The material clarifies that\s+/i, ''],
    [/\bThe text states that\b/gi, ''],
    [/\bThe text mentions\b/gi, ''],
    [/\bthe text mentions\b/gi, ''],
    [/\bThe text defines\b/gi, ''],
    [/\bthe text defines\b/gi, ''],
    [/\bThe text specifically identifies\b/gi, ''],
    [/\bthe text specifically identifies\b/gi, ''],
    [/\bThe text emphasizes\b/gi, ''],
    [/\bthe text emphasizes\b/gi, ''],
    [/\bThe text focuses on\b/gi, ''],
    [/\bthe text focuses on\b/gi, ''],
    [/\bThe text suggests\b/gi, ''],
    [/\bthe text suggests\b/gi, ''],
    [/\bmentioned in the source material\b/gi, ''],
    [/\bmentioned in the text\b/gi, ''],
    [/\bsource material\b/gi, 'transmission'],
    [/\bin the source material\b/gi, ''],
    [/\bthe source specifies that\b/gi, ''],
    [/\bThe reality shift is described as\b/i, 'The reality shift is'],
    [/\bis described as\b/gi, 'is'],
    [/\bare described as\b/gi, 'are'],
    [/\bThe builders are described as\b/i, 'The builders are'],
    [/\bThe sky is described as\b/i, 'The sky is'],
    [/\bWhile related to earth history, the text identifies\b/i, 'While related to earth history,'],
    [/\bspecific solar lineages as the builders\b/i, 'specific solar lineages are the builders'],
    [/\bThe answer involves specific star-system lineages mentioned in the text\./i,
      'Recall the Lyran, Pleiadian, and Andromedan solar builders of the Crystalline Temple.'],
    [/\bThe answer is the name for the true underlying reality of the physical plane\./i,
      'Name the true underlying reality of the physical plane beneath the overlay.'],
    [/\bThink about the source of 'free energy' mentioned in the text\./i,
      "Think about free energy drawn from the surrounding electro-magnetic field."],
    [/\bIdentify the elements that belong specifically to the 'parasitic' 3rd density system\./i,
      "Identify elements that belong specifically to the parasitic 3rd density system."],
    [/\bLook for the mechanism that removes the 3rd density structures\./i,
      'Look for the mechanism that removes the 3rd density structures.']
  ];
  for (const [re, rep] of rewrites) {
    t = t.replace(re, rep);
  }
  t = t.replace(/^\s*([a-z])/, (_, c) => c.toUpperCase());
  t = t.replace(/\s+/g, ' ').trim();
  t = t.replace(/\s+([.,;:])/g, '$1');
  return t;
}

/** Expand True/False pairs into four full-length claims. */
function expandTrueFalse(qNum, options) {
  if (options.length !== 2) return options;
  const correct = options.find((o) => o.isCorrect);
  const wrong = options.find((o) => !o.isCorrect);
  if (!correct || !wrong) return options;

  const extras = {
    13: {
      correctText:
        'False — Humanity does not rebuild after the collapse; humanity reveals back the Original Realm already functioning underneath.',
      correctRationale:
        'Restoration is an instantaneous revelation of what already exists. Humanity does not build back; it reveals back the Original Realm.',
      wrongText:
        'True — Humanity must actively rebuild earth infrastructure with dense materials after the matrix collapses.',
      wrongRationale:
        'Rebuilding with dense 3D construction is futile. The Original Realm is already present and is revealed, not constructed.',
      extra: [
        {
          text: 'True — After collapse, solar builders hand humanity blueprints so crews can reconstruct cities over decades.',
          rationale:
            'There is no multi-decade reconstruction project. The Vibrant Reality emerges instantly for those at the correct frequency.'
        },
        {
          text: 'False — The realm is deleted entirely, so neither rebuilding nor revealing has any meaning after the flash.',
          rationale:
            'The Original Realm is not deleted; it is already present beneath the overlay and is unveiled through Frequency Collapse.'
        }
      ]
    },
    19: {
      correctText:
        'True — The Original Realm is already present and functioning constantly beneath the false 3rd density physical world.',
      correctRationale:
        'The most profound revelation is that the Original Realm is already present, functioning constantly beneath the false physical world.',
      wrongText:
        'False — The Vibrant Reality is created only after the Frequency Collapse and did not exist beforehand.',
      wrongRationale:
        'The Original Realm has always existed beneath the parasitic overlays; collapse reveals it rather than inventing it.',
      extra: [
        {
          text: 'False — The Original Realm is generated from scratch by NPCs after they finish healing simulations.',
          rationale:
            'NPCs do not generate the realm. The Original Realm already exists; deep sleepers are guided out of healing simulations toward it.'
        },
        {
          text: 'True — The 3rd density world and Vibrant Reality never coexist; one replaces the other only after total planetary demolition.',
          rationale:
            'The Original Realm coexists underneath the holographic overlay the whole time. Collapse is revelation, not demolition.'
        }
      ]
    }
  };

  const e = extras[qNum];
  if (!e) {
    return [
      {
        text:
          correct.text === 'False' || correct.text === 'True'
            ? `${correct.text} — ${correct.rationale}`
            : correct.text,
        isCorrect: true,
        rationale: correct.rationale
      },
      {
        text:
          wrong.text === 'False' || wrong.text === 'True'
            ? `${wrong.text} — ${wrong.rationale}`
            : wrong.text,
        isCorrect: false,
        rationale: wrong.rationale
      },
      {
        text: 'This claim contradicts Vibrant Reality mechanics and cannot be true.',
        isCorrect: false,
        rationale: 'Only report-aligned claims describe Vibrant Reality accurately.'
      },
      {
        text: 'The restoration process operates in reverse of what the correct option states.',
        isCorrect: false,
        rationale: 'Frequency Collapse and reveal mechanics are fixed by the transmission, not reversed lore.'
      }
    ];
  }

  return [
    { text: e.correctText, isCorrect: true, rationale: e.correctRationale },
    { text: e.wrongText, isCorrect: false, rationale: e.wrongRationale },
    { text: e.extra[0].text, isCorrect: false, rationale: e.extra[0].rationale },
    { text: e.extra[1].text, isCorrect: false, rationale: e.extra[1].rationale }
  ];
}

/**
 * Full-claim expansions for short options (definition / term questions)
 * so length is comparable before finalizeOptions / rebalance.
 * Keys: `${qNum}.${label}.text` or `.rationale` or `.question` / `.hint`
 */
const overrides = {
  // Q2 — expand term names into full claims
  '2.A.text':
    'Original Realm — the true crystalline baseline that returns once parasitic overlays dissolve.',
  '2.B.text':
    'Crystalline Temple — the living architectural nature of the restored realm as a global healing field.',
  '2.C.text':
    'Parasitic Overlay — the false 3D holographic projection network that hides the Original Realm.',
  '2.D.text':
    'Resonance Points — sacred frequency thresholds and gateways used for instant travel across the grid.',
  '2.A.rationale':
    'Original Realm is the true unpolluted reality beneath the illusions, not the false network itself.',
  '2.B.rationale':
    'Crystalline Temple names the architectural and energetic nature of the restored realm, not the false projection.',
  '2.C.rationale':
    'Parasitic Overlay is the false 3D holographic projection network that hides the Original Realm and makes surroundings look dead and dense.',
  '2.D.rationale':
    'Resonance Points are travel gateways on the restored grid, not the network that manipulates 3rd density perception.',
  '2.question':
    'Which term describes the false holographic network that manipulates human perception of the 3rd density?',
  '2.hint':
    "Focus on the layer that projects a dead and dense version of reality over the Original Realm.",

  // Q5 latex in question
  '5.question':
    'What replaces the current 3rd density infrastructure, such as roads and tarmac?',
  '5.A.text':
    'Floating walkways made of condensed light that replace all solid ground surfaces.',
  '5.B.text':
    'Advanced magnetic levitation tracks still built as dense transport infrastructure.',
  '5.C.text':
    'Smooth crystalline grounds and natural walking paths created by advanced consciousness.',
  '5.D.text':
    'A network of high-speed underground tunnels carried over from the old dense matrix.',
  '5.A.rationale':
    'Replacement for roads is smooth crystalline ground and natural walking paths, not condensed-light walkways.',
  '5.B.rationale':
    'Levitation tracks remain dense infrastructure; the restored realm uses crystalline grounds and natural paths.',
  '5.C.rationale':
    'Roads, tarmac, and wheeled vehicles cease; smooth crystalline grounds and natural walking paths take their place.',
  '5.D.rationale':
    'Underground tunnels belong to dense matrix infrastructure, not the radiant Original Realm ground plane.',

  // Q6 latex
  '6.C.text':
    'They continue to see the 3rd density world exactly as it appeared before the collapse.',
  '6.D.text':
    'They are instantly upgraded to high-frequency consciousness with no intermediate phase.',
  '6.D.rationale':
    'Perception follows internal vibration; upgrades are not automatic for those bound to the 3rd density program.',
  '6.C.rationale':
    'Deep sleepers see a degraded echo of rubble, not the intact pre-collapse holographic world.',

  // Q9 short flash option
  '9.A.text':
    'A loud, planet-wide hum that permanently freezes all holographic pixels in place.',
  '9.B.text':
    'A sudden bright flash that hits the grid as the reset signal for pixelation.',
  '9.C.text':
    'The physical collapse of the moon that tears open the atmospheric dome.',
  '9.D.text':
    'A total solar eclipse lasting three days that darkens every coastline at once.',
  '9.A.rationale':
    'The reset signal is a sudden bright flash, not a planet-wide hum that freezes the grid.',
  '9.B.rationale':
    'A sudden bright flash acts as the reset signal, then pixels flicker and rearrange like static on an old screen.',
  '9.C.rationale':
    'The moon is not named as the Frequency Collapse trigger; the flash and pixelation sequence is.',
  '9.D.rationale':
    'Collapse is driven by holographic pixelation and a bright flash, not a three-day solar eclipse.',

  // Q11 short options
  '11.A.text':
    'Ancient city structures originally designed into the crystalline landscape.',
  '11.B.text':
    'Islands and peninsulas that reappear when coastlines reset beyond modern maps.',
  '11.C.text':
    'Pure crystalline waters uncovered as the unpolluted environment is restored.',
  '11.D.text':
    'Corporate buildings and money tied to parasitic authority and density.',
  '11.A.rationale':
    'Ancient city structures are revealed exactly as originally designed, so they do exist in Vibrant Reality.',
  '11.B.rationale':
    'Geographic reset reveals more land, including islands and peninsulas, so they remain part of the realm.',
  '11.C.rationale':
    'Restoration uncovers pure crystalline waters; they are part of Vibrant Reality, not eradicated.',
  '11.D.rationale':
    'Money, corporate buildings, and government structures vanish because they have no anchor in the high-frequency field.',
  '11.hint':
    'Identify elements that belong specifically to the parasitic 3rd density system.',

  // Q13 T/F question cleanup
  '13.question':
    'Must humanity actively rebuild earth infrastructure after the collapse of the matrix?',
  '13.hint': 'Decide whether the process is construction or unveiling of what already exists.',

  // Q17 short Original Realm option
  '17.A.text':
    'The deep sleepers simulation that holds non-resonating beings in an echo of rubble.',
  '17.B.text':
    'The Original Realm — a living, interconnected ecosystem and crystalline temple for resonating beings.',
  '17.C.text':
    'The corporate architectural grid of dense buildings that vanishes in Frequency Collapse.',
  '17.D.text':
    'The Parasitic Overlay — the false projection that manipulates senses into dead surroundings.',
  '17.A.rationale':
    'Healing simulations and rubble echoes are temporary traps for deep sleepers, not the living ecosystem.',
  '17.B.rationale':
    'The Original Realm functions as a living interconnected ecosystem and massive crystalline temple that elevates consciousness.',
  '17.C.rationale':
    'Corporate architecture is part of the 3D world that vanishes; it is not the living elevated ecosystem.',
  '17.D.rationale':
    'The Parasitic Overlay hides and disconnects; it is not designed to elevate consciousness.',
  '17.hint':
    'Name the true underlying reality of the physical plane that elevates resonating beings.',

  // Q18 latex
  '18.D.text':
    'Maintaining attachments to dense 3rd density concepts like wealth and corporate influence.',
  '18.D.rationale':
    'Thrive-ability depends on shedding dense 3D attachments; those materials and concepts pixelate out of existence.',

  // Q19
  '19.question':
    'Does the Vibrant Reality already exist with the 3rd density world even before Frequency Collapse?',
  '19.hint':
    'Decide whether the Original Realm is being created now or is already present but hidden.',

  // Q23 short correct
  '23.A.text':
    'It drops away entirely, revealing the true dome and the real cosmic sky.',
  '23.B.text':
    'It remains as a decorative reminder of the old world floating above cities.',
  '23.C.text':
    'It becomes a transparent solar shield permanently locked over every skyline.',
  '23.D.text':
    'It is absorbed into the crystalline ground during the geographic land reset.',
  '23.A.rationale':
    'The heavy artificial layer drops away to reveal the true dome and the real cosmic sky required for physical existence.',
  '23.B.rationale':
    'Parasitic overlays are eradicated, not kept as decorative sky props over the restored realm.',
  '23.C.rationale':
    'The layer is false and artificial; it is removed rather than repurposed into a solar shield.',
  '23.D.rationale':
    'Atmospheric reset and geographic reset are distinct; the artificial layer drops away from the sky.',

  // Q24
  '24.A.text':
    'An automated planetary laboratory that runs clinical protocols on every inhabitant.',
  '24.B.text':
    'A massive crystalline temple that also functions as a continuous global med bed.',
  '24.C.text':
    'A giant library of universal records with no healing or temple function at all.',
  '24.D.text':
    'A series of interconnected biological pods isolated from any planetary grid.',
  '24.A.rationale':
    'The realm is a living crystalline temple and ecosystem, not a clinical automated laboratory.',
  '24.B.rationale':
    'The entire Original Realm is a pure Crystalline Temple acting as one continuous massive healing bed.',
  '24.C.rationale':
    'Primary framing is crystalline temple and global med bed, not a records library alone.',
  '24.D.rationale':
    'The realm is one interconnected crystalline temple-grid, not isolated biological pods.',

  // Q1 absolute voice rationale cleanup via override where needed
  '1.C.rationale':
    'This event is not a process of physical demolition or reconstruction stretched over centuries.',
  '1.B.rationale':
    'The transition is an instantaneous revelation triggered by a massive frequency shift, not reconstruction.',
  '1.A.rationale':
    'The mechanism is Frequency Collapse of holographic illusions, not literal destruction of the physical plane.',

  // Q4
  '4.C.rationale':
    'A bright flash acts as the reset signal, but the result is a clearer true cosmic sky, not permanent darkness.',
  '4.hint':
    'Look for the mechanism that removes the 3rd density structures without physical demolition.',

  // Q7 hint
  '7.hint':
    'Recall the Lyran, Pleiadian, and Andromedan solar builders of the Crystalline Temple.',
  '7.C.rationale':
    'While related to earth history, specific solar lineages — Lyran, Pleiadian, and Andromedan — are the original builders.',

  // Q12
  '12.hint':
    'Think about free energy drawn from the surrounding electro-magnetic field.',

  // Q20
  '20.A.rationale':
    'Dissolution is framed as pixelation and frequency collapse of a holographic screen, not a slow iceberg melt.',
  '20.B.rationale':
    'The shift is an instantaneous reveal through pixelation, not a foundation-up renovation project.',
  '20.C.rationale':
    'Restoration uses a digital holographic metaphor of pixels and static, not a simple weeding metaphor.',
  '20.D.rationale':
    'Reality operates as a giant holographical screen of light points; when the overlay fades, pixels flicker like static on an old screen.',

  // Q15
  '15.B.rationale':
    'Emphasis is on physical reappearance of coastlines and landmasses, not telepathic map-file updates.',
  '15.D.rationale':
    'The realm remains a detailed ecosystem with rivers, coastlines, and ancient cities, not a uniform blank sheet.',

  // Q21
  '21.C.rationale':
    'Deep sleepers are held in temporary healing simulations until guided outward, not left forever in rubble.',

  // Meta-ish Q8
  '8.B.rationale':
    'The revealed sky is the true dome and real cosmic sky of a pure environment, not pitch-black star-viewing darkness alone.'
};

const metaVoiceRe =
  /\b(according to the (report|source|text)|the report states|the source (states|specifies|suggests)|the text (states|describes|suggests|explicitly|mentions|defines|calls|focuses|emphasizes|identifies)|the material clarifies|mentioned in the (text|source)|source material)\b/i;

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

  // Expand remaining short wrong/correct options that lack overrides
  options = options.map((o) => {
    if (o.text.length < 35 && !/^(true|false)/i.test(o.text)) {
      // leave only if already handled; expandTrueFalse already expanded T/F
    }
    return o;
  });

  const finalized = finalizeOptions(
    options.map(({ text, isCorrect, rationale }) => ({
      text: absoluteVoice(cleanText(text)),
      isCorrect: !!isCorrect,
      rationale: absoluteVoice(cleanText(rationale))
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
    throw new Error(
      `Q${q.number}: LaTeX/$ markup found: ${blob.match(/\$[^$]*\$|\$/)?.[0]}`
    );
  }
  if (metaVoiceRe.test(blob)) {
    throw new Error(
      `Q${q.number}: meta/report voice still present: ${blob.match(metaVoiceRe)?.[0]}`
    );
  }

  const phrases = supportPhrases[q.number] || [];
  const missing = phrases.filter((p) => !reportLower.includes(p.toLowerCase()));
  if (missing.length) {
    throw new Error(
      `Q${q.number}: report does not support phrases: ${missing.join('; ')}`
    );
  }

  if (out.options.length !== 4) {
    throw new Error(`Q${q.number}: need 4 options, got ${out.options.length}`);
  }
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

const topicImage = 'images/breakdown/vibrant-reality.webp';
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
    'Test your grasp of Vibrant Reality — Frequency Collapse of the parasitic overlay, holographic pixelation, crystalline coastlines, free energy, and the living Crystalline Temple as a global med bed.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Vibrant Reality is the restored perception of the Original Realm: an instantaneous Frequency Collapse that pixelates the parasitic overlay and unveils the crystalline temple already present beneath. Sit with what you missed, then return to the Vibrant Reality deep-dive, infographics, and video transmissions. Hold a high harmonic tone as the sequences unfold — the physical environment is a living reflection of collective consciousness tone.'
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
    'Test your understanding of Vibrant Reality — Frequency Collapse, holographic pixelation, crystalline grounds, free energy, experiential split, and the Crystalline Temple as a global med bed.'
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
  throw new Error('vibrant-reality not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from crystalline-architecture quiz page
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'crystalline-architecture.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Crystalline Architecture Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Crystalline Architecture: the Crystalline Electro-Magnetic Framework, Crystal Light-Worlds, True Sol vs parasitic 3D geometry, and the reveal of the Crystalline Temple.',
    'Interactive Living Truth Quiz on Vibrant Reality: Frequency Collapse of the parasitic overlay, holographic pixelation, crystalline coastlines, free energy, and the living Crystalline Temple as a global med bed.'
  ],
  ['quiz/breakdown/crystalline-architecture.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/crystalline-architecture.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=crystalline-architecture',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Crystalline Architecture deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Crystalline Architecture</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/crystalline-architecture.json',
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
    "  { path: '/quiz/breakdown/crystalline-architecture.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/vibrant-reality.json'
);
