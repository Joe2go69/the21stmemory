/**
 * Installs Second Realm quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/second-realm-quiz.json
 * Audits all 25 items against data/breakdown-topics/second-realm.json.
 * Run: node scripts/install-second-realm-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/second-realm.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'second-realm';
const TOPIC_TITLE = 'Second Realm';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/second-realm-quiz.json';

const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

/** Support phrases grounded only in second-realm.json report. */
const supportPhrases = {
  1: ['revealing what already exists', 'shift in frequency', 'not involve physical destruction'],
  2: ['parasitic overlay', 'false 3d projection', 'illusion grid'],
  3: ['resonating sols', 'high frequency', 'instantly perceive'],
  4: ['money, corporate buildings', 'vanish instantly', 'no anchor'],
  5: ['occurs in sequences', 'slightly different times', 'local consciousness'],
  6: ['rubble', 'remnants of the old illusion', 'healing simulations'],
  7: ['controlled, basic 3d environments', 'non-resonating', 'rehabilitation'],
  8: ['resonance points', 'portal gates', 'solar family crafts'],
  9: ['known lands', 'crystalline temple', 'lyran lineage'],
  10: ['free energy', 'field itself', 'power sockets and cables'],
  11: ['money and corporate supply chains', 'healing simulations', 'entrapment'],
  12: ['map itself resets', 'much more land', 'reappearing islands'],
  13: ['frequency alignment', 'tuning a radio', 'environment a soul experiences'],
  14: ['pixelation', 'holographic screen', 'light points'],
  15: ['never destroyed', 'buried and inverted', 'parasitic circuit boards'],
  16: ['false sky', 'true cosmic dome', 'drops'],
  17: ['high vibration', 'harmonic resonance', 'frequency alignment'],
  18: ['foundational, pure state', 'hidden beneath', 'original realm'],
  19: ['lyran lineage', 'crystalline temple', 'known lands'],
  20: ['smooth crystalline grounds', 'natural walking paths', 'roads, cars, and wheels'],
  21: ['solar families', 'light grids', 'emergence of the second realm'],
  22: ['disorientation', 'perceptual "lag"', 'overlay peels away'],
  23: ['always present', 'rendered invisible', 'not involve physical destruction'],
  24: ['frequency alignment', 'environment a soul experiences', 'tuning a radio'],
  25: ['frequency collapse', '3d overlay dissolves', 'revealing the reality beneath']
};

function cleanText(s) {
  let t = String(s || '');
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
    [/^According to the (core revelations|source|report|text),?\s*/i, ''],
    [/^According to the report,?\s*/i, ''],
    [/^According to the text,?\s*/i, ''],
    [/\baccording to the (report|source|text|core revelations)\b/gi, ''],
    [/^The source states that\s+/i, ''],
    [/^The source specifies that\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The text identifies\s+/i, ''],
    [/^The text suggests that\s+/i, ''],
    [/^The text mentions\s+/i, ''],
    [/^The material clarifies that\s+/i, ''],
    [/\bThe text states that\b/gi, ''],
    [/\bthe text states that\b/gi, ''],
    [/\bThe text describes\b/gi, ''],
    [/\bthe text describes\b/gi, ''],
    [/\bThe text identifies\b/gi, ''],
    [/\bthe text identifies\b/gi, ''],
    [/\bmentioned in the source material\b/gi, ''],
    [/\bmentioned in the text\b/gi, ''],
    [/\bsource material\b/gi, 'transmission'],
    [/\bin the source material\b/gi, ''],
    [/\bThe source is\b/gi, 'The power source is'],
    [/\bis described as\b/gi, 'is'],
    [/\bare described as\b/gi, 'are']
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
    5: {
      correctText:
        'False — The collapse clears regions in sequences at slightly different times based on local consciousness levels.',
      correctRationale:
        'The collapse occurs in sequences, clearing different regions and simulated areas at slightly different times based on local consciousness levels.',
      wrongText:
        'True — Every region on earth experiences the full overlay collapse at the exact same microsecond.',
      wrongRationale:
        'Timing is not globally simultaneous; local consciousness levels sequence the clearing of different regions.',
      extra: [
        {
          text: 'True — The overlay only collapses once every human agrees telepathically on a single shared calendar second.',
          rationale:
            'Collapse is driven by frequency and local consciousness sequencing, not a planet-wide telepathic vote on a shared second.'
        },
        {
          text: 'False — The overlay never collapses regionally; it freezes forever as a permanent 3D projection skin.',
          rationale:
            'The parasitic overlay does dissolve through Frequency Collapse; the process is sequential, not frozen forever.'
        }
      ]
    },
    15: {
      correctText:
        'False — The ancient architecture was never destroyed; it was buried and inverted into parasitic circuit boards.',
      correctRationale:
        'The Crystalline Temple was never destroyed. Return of the Original Realm is an unearthing of architecture that already exists and operates seamlessly.',
      wrongText:
        'True — Parasites demolished the ancient temple, so Solar Families must rebuild the KNOWN LANDS from scratch.',
      wrongRationale:
        'The temple was never demolished. It was buried and inverted; the return is revelation and unearthing, not reconstruction.',
      extra: [
        {
          text: 'True — Lyran builders must pour new crystal foundations after every city is leveled by physical demolition crews.',
          rationale:
            'There is no physical demolition-and-rebuild cycle. Ancient architecture was buried and inverted, then unearthed by frequency return.'
        },
        {
          text: 'False — Ancient architecture never existed; the Second Realm is a brand-new map invented after the collapse.',
          rationale:
            'KNOWN LANDS were built as one giant Crystalline Temple by the Lyran Lineage; the architecture was always present beneath the overlay.'
        }
      ]
    },
    23: {
      correctText:
        'False — The Second Realm was always present but rendered invisible under the Parasitic Overlay.',
      correctRationale:
        'The Second Realm is the restored crystalline reality that was always present but invisible to human perception until the overlay collapses.',
      wrongText:
        'True — The Second Realm is brand-new construction that only begins once humans hit a consciousness threshold.',
      wrongRationale:
        'The realm is not newly built. It is foundational reality revealed by frequency shift, not a construction project started at a consciousness milestone.',
      extra: [
        {
          text: 'True — Engineers assemble the Second Realm from corporate materials after Frequency Collapse finishes.',
          rationale:
            'Corporate materials and control infrastructure vanish because they hold no anchor; the realm is revealed, not assembled from 3D materials.'
        },
        {
          text: 'False — The Second Realm never existed and cannot appear even after total Frequency Alignment.',
          rationale:
            'Frequency Alignment is how souls perceive the Second Realm that was always present beneath the dense manipulated illusion.'
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
        text: 'This claim contradicts Second Realm mechanics and cannot be true.',
        isCorrect: false,
        rationale: 'Only report-aligned claims describe Second Realm accurately.'
      },
      {
        text: 'The transition process operates in reverse of what the correct option states.',
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
 * Full-claim expansions so option lengths stay comparable.
 * Keys: `${qNum}.${label}.text` / `.rationale` / `.question` / `.hint`
 */
const overrides = {
  // Q1
  '1.A.text':
    'A revealing of the foundational reality already present, through a massive shift in frequency and vibration.',
  '1.B.text':
    'A collective migration of humanity to a different physical planet in a distant galaxy system.',
  '1.C.text':
    'The terraforming of Earth by external benevolent civilizations using heavy reconstruction fleets.',
  '1.D.text':
    'The physical destruction and full reconstruction of the planet surface from demolished materials.',
  '1.A.rationale':
    'The Original Realm is already present beneath the illusion and is revealed as the parasitic frequency layer dissolves through a massive frequency shift.',
  '1.B.rationale':
    'The Second Realm is restoration of the current foundational state of existence, not migration to a new planet.',
  '1.C.rationale':
    'Restoration is revelation through Frequency Collapse, not an external terraforming engineering project.',
  '1.D.rationale':
    'The transition does not involve physical destruction or rebuilding; it reveals what already exists.',
  '1.hint':
    'Decide whether the process creates something new or uncovers something already present.',

  // Q2 — expand short terms into full claims
  '2.A.text':
    'Crystalline Temple — the true living architecture of the KNOWN LANDS that the overlay hides.',
  '2.B.text':
    'Parasitic Overlay — the false 3D projection and illusion grid that hides the true fabric of the world.',
  '2.C.text':
    'Resonance Point — a functional travel threshold used for instant movement in the restored realm.',
  '2.D.text':
    'Frequency Alignment — the vibrational tuning that matches a soul to a layer of reality or simulation.',
  '2.A.rationale':
    'The Crystalline Temple is the true architectural state buried beneath the overlay, not the deceptive layer itself.',
  '2.B.rationale':
    'Parasitic Overlay is the false 3D projection and illusion grid that currently hides the Original Realm.',
  '2.C.rationale':
    'Resonance Points enable travel in the restored realm; they are not the intrusive illusion grid.',
  '2.D.rationale':
    'Frequency Alignment is the tuning required to perceive a layer of reality, not the illusion grid itself.',
  '2.question':
    'Which term describes the false 3D projection that currently obscures the true fabric of the world?',
  '2.hint':
    'Look for the secondary intrusive layer placed over the primary crystalline world.',

  // Q3
  '3.A.text':
    'They operate on a high frequency and instantly perceive the restored crystalline reality.',
  '3.B.text':
    'They act only as wardens managing every sleeper inside the Healing Simulations full-time.',
  '3.C.text':
    'They must descend into lower frequencies to dismantle the old matrix by hand labor.',
  '3.D.text':
    'They are tasked with physically building the infrastructure of brand-new Second Realm cities.',
  '3.A.rationale':
    'Resonating Sols are awakened beings on a high frequency who instantly perceive the restored realm.',
  '3.B.rationale':
    'Healing Simulations rehabilitate non-resonating souls; Resonating Sols perceive and anchor the Second Realm.',
  '3.C.rationale':
    'The matrix dissolves through Frequency Collapse, not through souls dropping into lower densities to demolish it.',
  '3.D.rationale':
    'The Second Realm already holds its structures; restoration is revelation, not manual construction.',

  // Q4
  '4.A.text':
    'They remain standing forever and are merely rendered obsolete by free energy technology.',
  '4.B.text':
    'They are carefully preserved as historical monuments of the old 3D control experience.',
  '4.C.text':
    'They vanish instantly because they hold no anchor in the restored frequency field.',
  '4.D.text':
    'They are repurposed into permanent administrative centers inside the Healing Simulations.',
  '4.A.rationale':
    'Money, corporate buildings, traffic lights, and governments vanish instantly; they do not remain as obsolete shells.',
  '4.B.rationale':
    'Control-system infrastructure dissolves entirely rather than being museum-preserved in the restored field.',
  '4.C.rationale':
    'Old control infrastructure vanishes instantly because it holds no anchor in the restored frequency field.',
  '4.D.rationale':
    'These institutions have no frequency anchor in the restored realm and cannot persist in any form within it.',
  '4.A.rationale':
    'Money, corporate buildings, traffic lights, and governments vanish instantly; they do not remain standing as free-energy museums.',

  // Q5 T/F question
  '5.question':
    'Does the collapse of the 3D overlay occur globally at the exact same microsecond for every region?',
  '5.hint':
    'Recall whether the transition is one simultaneous flash or a sequenced process by local consciousness.',

  // Q6
  '6.A.text':
    'The vibrant crystalline waters and ancient halls of the Original Realm in full clarity.',
  '6.B.text':
    'Rubble and remnants of the old illusion until they enter segmented Healing Simulations.',
  '6.C.text':
    'Immediate unrestricted access to Portal Gates and Solar Family Crafts for instant travel.',
  '6.D.text':
    'A blank white void with no sensory input, geography, or residual illusion remaining.',
  '6.A.rationale':
    'Deep sleepers lack Frequency Alignment and do not see the Original Realm straight away.',
  '6.B.rationale':
    'Those stuck in denial perceive rubble and remnants of the old illusion, then enter Healing Simulations for rehabilitation.',
  '6.C.rationale':
    'Portal Gates and Solar Family Crafts serve the restored high-frequency realm, not sleepers bound to the old program.',
  '6.D.rationale':
    'Sleepers see rubble and remnants of the old illusion, not a total blank void.',

  // Q7
  '7.A.text':
    'To test Frequency Alignment with formal exams before any soul may enter the Second Realm.',
  '7.B.text':
    'To house the physical bodies of Resonating Sols while they wait out the pixelation phase.',
  '7.C.text':
    'To serve as advanced laboratories for studying ancient Lyran temple technology in detail.',
  '7.D.text':
    'To provide controlled basic 3D environments for rehabilitating non-resonating souls.',
  '7.A.rationale':
    'Entry is the automatic result of Frequency Alignment, not a formal exam gate inside a simulation.',
  '7.B.rationale':
    'Resonating Sols instantly perceive the Second Realm; Healing Simulations are for non-resonating souls.',
  '7.C.rationale':
    'Healing Simulations are basic 3D rehabilitation environments, not advanced Lyran research labs.',
  '7.D.rationale':
    'Healing Simulations are controlled basic 3D environments where non-resonating souls are guided for rehabilitation.',

  // Q8
  '8.A.text':
    'Only horse-drawn crystalline carriages rolling on the same artificial roads as before.',
  '8.B.text':
    'Resonance Points, Portal Gates, and Solar Family Crafts for instant travel across the realm.',
  '8.C.text':
    'High-speed magnetic levitation trains and autonomous vehicles on rebuilt highway grids.',
  '8.D.text':
    'Astral-only projection while the physical body remains frozen in place forever.',
  '8.A.rationale':
    'Artificial roads and wheels vanish; distance travel uses Resonance Points, Portal Gates, and Solar Family Crafts.',
  '8.B.rationale':
    'Movement across the Second Realm utilizes Resonance Points, Portal Gates, and Solar Family Crafts for instant travel.',
  '8.C.rationale':
    'Artificial roads, cars, and wheels vanish; Second Realm travel is resonance- and portal-based, not maglev highways.',
  '8.D.rationale':
    'The Second Realm is a physical crystalline reality where beings travel through gates and crafts, not pure astral freeze.',

  // Q9
  '9.question':
    'What were the KNOWN LANDS originally built as?',
  '9.A.text':
    'A military outpost designed only to defend the cosmic dome from outside invaders.',
  '9.B.text':
    'A mining colony devoted to extracting precious crystalline minerals for export trade.',
  '9.C.text':
    'One giant Crystalline Temple built by the Lyran Lineage and other ancient solar builders.',
  '9.D.text':
    'A biological experiment chamber with no temple architecture or solar builder design.',
  '9.A.rationale':
    'KNOWN LANDS were built as one giant Crystalline Temple for connecting the physical plane to higher frequencies, not a fort.',
  '9.B.rationale':
    'Original purpose is crystalline temple architecture by solar builders, not resource-extraction colonies.',
  '9.C.rationale':
    'KNOWN LANDS were originally built as one giant Crystalline Temple by the Lyran Lineage and other ancient solar builders.',
  '9.D.rationale':
    'The lands are ancient solar temple architecture, not a non-architectural biology experiment chamber.',
  '9.hint':
    'Identify the ancient architects and the singular structural purpose of the lands.',

  // Q10
  '10.A.text':
    'Wireless charging grids powered only by ancient underground chemical battery banks.',
  '10.B.text':
    'Solar panels fixed onto every crystalline wall as the sole continuous power source.',
  '10.C.text':
    'Free energy drawn continuously and directly from the field itself without cables.',
  '10.D.text':
    'Localized electrical currents generated only when groups sing harmonic scales aloud.',
  '10.A.rationale':
    'Power sockets and cables are obsolete; energy is free energy from the field itself, not stored battery banks.',
  '10.B.rationale':
    'Everything runs on free energy drawn directly from the field itself, not panel-based collection systems.',
  '10.C.rationale':
    'Power sockets and cables are obsolete because everything runs continuously on free energy drawn directly from the field itself.',
  '10.D.rationale':
    'Energy is a continuous field feature of the Second Realm, not something generated only by vocal performance.',

  // Q11
  '11.A.text':
    'An automatic and guaranteed upgrade into Resonating Sol status without any frequency work.',
  '11.B.text':
    'Temporary loss of all physical form followed by a forced reset inside the Original Realm.',
  '11.C.text':
    'Automatic boarding of Solar Family Crafts for evacuation regardless of vibration held.',
  '11.D.text':
    'Entrapment in the lower-density Healing Simulations bound to the collapsing 3D illusion.',
  '11.A.rationale':
    'Reliance on false 3D survival mechanics tethers consciousness to lower density rather than accelerating resonance.',
  '11.B.rationale':
    'The consequence is perceptual entrapment in Healing Simulations, not erasure of physical form.',
  '11.C.rationale':
    'Craft travel and Second Realm immersion require Frequency Alignment, not attachment to money and supply chains.',
  '11.D.rationale':
    'Reliance on money and corporate supply chains leads to entrapment in the lower-density Healing Simulations.',

  // Q12
  '12.A.text':
    'All landmasses forcibly merge into a single supercontinent labeled as restored Pangea.',
  '12.B.text':
    'Existing continents are submerged so only new floating islands remain above water.',
  '12.C.text':
    'The map resets, revealing much more land, reappearing islands, and hidden peninsulas.',
  '12.D.text':
    'The planet permanently expands in diameter solely to stretch the true cosmic dome larger.',
  '12.A.rationale':
    'The map resets with more land, reappearing islands, and hidden peninsulas — not a forced single supercontinent.',
  '12.B.rationale':
    'The transition reveals more land rather than submerging continents to leave only floating islands.',
  '12.C.rationale':
    'The map itself resets, revealing much more land, reappearing islands, and hidden peninsulas.',
  '12.D.rationale':
    'Geographic change is map reset and revelation of hidden land; the report does not frame planetary diameter expansion.',

  // Q13
  '13.A.text':
    'It determines which specific layer of reality or simulation a soul experiences, like radio tuning.',
  '13.B.text':
    'It lets sleepers view the Second Realm while keeping their old dense vibration unchanged.',
  '13.C.text':
    'It is only a surgical DNA rewrite performed on every body by the Lyran Lineage in clinics.',
  '13.D.text':
    'It is a library course studied after full entry, with no role in first perception of the realm.',
  '13.A.rationale':
    'Frequency Alignment is the precise vibrational tuning required to match and perceive a specific layer of reality or simulation — like tuning a radio.',
  '13.B.rationale':
    'Sleepers cannot see the Second Realm precisely because they lack the Frequency Alignment of Resonating Sols.',
  '13.C.rationale':
    'Alignment is vibrational consciousness tuning, not an external medical DNA procedure by lineage clinics.',
  '13.D.rationale':
    'Alignment dictates the environment experienced and is required to perceive the Second Realm, not a post-entry library elective.',
  '13.hint':
    'Recall the radio-tuning analogy for accessing different layers of reality.',

  // Q14
  '14.A.text':
    'A rain of crystalline dust that buries old buildings under permanent sediment layers.',
  '14.B.text':
    'A gradual fade of all color until only permanent black-and-white rubble remains forever.',
  '14.C.text':
    'A massive sequence of pixelation and shifting as countless light points rearrange.',
  '14.D.text':
    'A single static golden flash that freezes the entire sky unchanged for three full days.',
  '14.A.rationale':
    'Old matrix dissolution is holographic pixelation and shifting, not burial under crystalline dust.',
  '14.B.rationale':
    'The Second Realm floods in as vibrant unpolluted reality; the process is pixelation, not permanent desaturation.',
  '14.C.rationale':
    'Reality functions as a giant holographic screen of light points; return occurs through massive pixelation and shifting as the old matrix dissolves.',
  '14.D.rationale':
    'The transition is a sequence of pixelation and shifting light points, not a three-day static golden freeze.',

  // Q15
  '15.question':
    'Was the ancient architecture of the world destroyed by parasites so that Solar Families must rebuild it?',
  '15.hint':
    'Decide whether the return is reconstruction or unearthing of what already exists.',

  // Q16
  '16.A.text':
    'An empty void that proves the simulation ends with no structure above the cities.',
  '16.B.text':
    'The true cosmic dome required for physical existence once the false sky drops.',
  '16.C.text':
    'A second sun fixed in place to force eternal daylight over every coastline forever.',
  '16.D.text':
    'Only a waiting fleet of ships with no dome or sky structure revealed at all.',
  '16.A.rationale':
    'When the false sky drops, the true cosmic dome required for physical existence is revealed — not an empty void.',
  '16.B.rationale':
    'The false sky above the cities drops to reveal the true cosmic dome required for physical existence.',
  '16.C.rationale':
    'The structural sky revelation is the true cosmic dome, not specifically a second permanent sun.',
  '16.D.rationale':
    'Crafts exist in the broader transition, but the sky revelation named here is the true cosmic dome itself.',

  // Q17
  '17.A.text':
    'Hoarding gold, cash reserves, and corporate supply stockpiles as primary survival strategy.',
  '17.B.text':
    'Holding a high vibration and maintaining harmonic resonance for Frequency Alignment.',
  '17.C.text':
    'Organizing political parties to vote the old government out before frequency shift begins.',
  '17.D.text':
    'Inventing brand-new bridge machines to force a mechanical link between 3D and 5D layers.',
  '17.A.rationale':
    'Reliance on false 3D survival mechanics such as money and corporate supply chains leads to Healing Simulation entrapment.',
  '17.B.rationale':
    'Holding high vibration and harmonic resonance is the mechanism for stepping out of the collapsing 3D illusion into the Second Realm.',
  '17.C.rationale':
    'Governments vanish instantly with no frequency anchor; political dismantling is not the strategic necessity of the transition.',
  '17.D.rationale':
    'The path is Frequency Alignment into architecture that already exists, not inventing mechanical 3D–5D bridge devices.',

  // Q18
  '18.A.text':
    'Only a temporary mental mood achieved by meditation and fasting with no physical world.',
  '18.B.text':
    'A short staging lounge for souls before they are forced to reincarnate back into 3D loops.',
  '18.C.text':
    'The foundational pure state of existence hidden beneath the dense manipulated illusion.',
  '18.D.text':
    'A far-future end-of-time destination that does not exist until the universe fully ends.',
  '18.A.rationale':
    'The Original Realm is the foundational pure state of existence that returns physically as crystalline reality, not only a mood.',
  '18.B.rationale':
    'The Original Realm is foundational reality that returns, not a temporary reincarnation staging lounge.',
  '18.C.rationale':
    'The Original Realm is the foundational pure state of existence hidden beneath a dense manipulated illusion.',
  '18.D.rationale':
    'The Original Realm is already present and returns upon collapse; it is not deferred to an end-of-time afterlife.',

  // Q19
  '19.A.text':
    'The Parasitic Overlay Architects who designed the false 3D illusion grid alone.',
  '19.B.text':
    'Only modern Resonating Sols who first perceived the realm during Frequency Collapse.',
  '19.C.text':
    'Healing Simulation engineers who run basic 3D rehabilitation chambers for sleepers.',
  '19.D.text':
    'The Lyran Lineage and other ancient solar builders of the Crystalline Temple.',
  '19.A.rationale':
    'Parasites inverted and buried the temple into circuit boards; they did not build the original Crystalline Temple.',
  '19.B.rationale':
    'Resonating Sols perceive and anchor the restored realm now; original construction is credited to the Lyran Lineage and solar builders.',
  '19.C.rationale':
    'Healing Simulations rehabilitate non-resonating souls; they did not construct the ancient KNOWN LANDS temple.',
  '19.D.rationale':
    'KNOWN LANDS were built as one giant Crystalline Temple by the Lyran Lineage and other ancient solar builders.',
  '19.hint':
    'Name the ancient solar lineage linked to the original Crystalline Temple of the KNOWN LANDS.',

  // Q20
  '20.A.text':
    'Anti-gravity platforms that keep hovering forever above the same old paved roads.',
  '20.B.text':
    'Indoor teleportation pads in every home with artificial roads left fully intact outside.',
  '20.C.text':
    'Only crystalline canals replacing every surface path with water routes and no walking ground.',
  '20.D.text':
    'Smooth crystalline grounds and natural walking paths originally created by consciousness.',
  '20.A.rationale':
    'Artificial roads vanish entirely; they are not reused as bases for anti-gravity platforms.',
  '20.B.rationale':
    'Roads, cars, and wheels vanish; ground becomes smooth crystalline grounds and natural walking paths.',
  '20.C.rationale':
    'Pristine oceans and crystalline waters exist, but roads are replaced by crystalline grounds and natural walking paths.',
  '20.D.rationale':
    'Artificial roads, cars, and wheels vanish, replaced by smooth crystalline grounds and natural walking paths created by consciousness.',

  // Q21
  '21.A.text':
    'They only manage Healing Simulations and never touch Light Grids or realm return.',
  '21.B.text':
    'They fund planetary restoration with Second Realm money and corporate bank charters.',
  '21.C.text':
    'They designed and still maintain the Parasitic Overlay as its primary architects.',
  '21.D.text':
    'Their arrival links to Light Grid activation and the emergence of the Second Realm.',
  '21.A.rationale':
    'Solar Families are linked to Light Grids and realm return; Healing Simulations serve non-resonating souls separately.',
  '21.B.rationale':
    'Money holds no anchor in the restored frequency field, so financial backing is not the Solar Family role.',
  '21.C.rationale':
    'Solar Families connect to Light Grids and the Original Realm return, not construction of the parasitic illusion.',
  '21.D.rationale':
    'Emergence of the Second Realm is intrinsically linked to activation of the Light Grids and arrival of the true Solar Families.',

  // Q22
  '22.A.text':
    'The physical body becomes permanently ethereal with no crystalline cities or waters left.',
  '22.B.text':
    'Permanent total blindness as soon as the first overlay pixel begins to peel away.',
  '22.C.text':
    'An instant painless download of all universal knowledge with zero sensory disruption.',
  '22.D.text':
    'Moments of disorientation or perceptual lag as the overlay peels away before pure reality floods in.',
  '22.A.rationale':
    'The Second Realm includes physical features such as ancient city structures, crystalline waters, and coastlines.',
  '22.B.rationale':
    'The phase includes moments of disorientation or lag, not permanent blindness.',
  '22.C.rationale':
    'Perceptual Transition includes lag and disorientation as pixelation settles, not a zero-disruption knowledge dump.',
  '22.D.rationale':
    'During Perceptual Transition there are moments of disorientation or perceptual lag as the overlay peels away before the Second Realm floods in.',

  // Q23
  '23.question':
    'Is the Second Realm a brand-new construction that only begins once humans reach a certain consciousness level?',
  '23.hint':
    'Decide whether the realm is newly built or a revelation of what was always present.',

  // Q24
  '24.A.text':
    'The amount of cash, gold, and corporate supply contracts secured before the collapse.',
  '24.B.text':
    'Only the GPS coordinates of the body, with zero role for individual Frequency Alignment.',
  '24.C.text':
    'The soul\'s specific Frequency Alignment that tunes it to a reality layer or simulation.',
  '24.D.text':
    'A courtroom decree issued by the Lyran Lineage that assigns each soul a fixed zone.',
  '24.A.rationale':
    'Money holds no anchor and reliance on 3D survival mechanics leads to Healing Simulation entrapment.',
  '24.B.rationale':
    'Local consciousness can sequence regional clearing, but individual experience is dictated by Frequency Alignment.',
  '24.C.rationale':
    'Frequency Alignment is the precise vibrational tuning that dictates which environment a soul experiences — Second Realm or Healing Simulation.',
  '24.D.rationale':
    'Experience matches vibration automatically; it is not a Lyran courtroom assignment of zones.',
  '24.hint':
    'Think of the soul as a radio receiver matching a station.',

  // Q25 — expand short term
  '25.A.text':
    'Physical demolition crews from the Solar Families tearing down every 3D structure by hand.',
  '25.B.text':
    'Total depletion of earth minerals and fossil fuels until the overlay runs out of fuel.',
  '25.C.text':
    'Frequency Collapse — the overlay dissolves and reveals the reality beneath without demolition.',
  '25.D.text':
    'A binding popular vote by all 3D inhabitants ordering the illusion grid to shut down.',
  '25.A.rationale':
    'The 3D overlay dissolves through Frequency Collapse as revelation, not physical demolition labor.',
  '25.B.rationale':
    'Dissolution is vibrational Frequency Collapse, not resource exhaustion of minerals or fuels.',
  '25.C.rationale':
    'Frequency Collapse is the mechanism by which the 3D overlay dissolves, revealing the reality beneath rather than destroying it through physical demolition.',
  '25.D.rationale':
    'Collapse is structural failure of the false frequency field, not a democratic ballot of the grid population.',
  '25.hint':
    'Name the mechanism that dissolves the 3D overlay without physical demolition.'
};

const metaVoiceRe =
  /\b(according to the (report|source|text|core revelations)|the report states|the source (states|specifies|suggests)|the text (states|describes|suggests|explicitly|mentions|defines|calls|focuses|emphasizes|identifies)|the material clarifies|mentioned in the (text|source)|source material)\b/i;

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

const topicImage = 'images/breakdown/second-realm.webp';
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
    'Test your grasp of Second Realm — Frequency Collapse of the Parasitic Overlay, Frequency Alignment, split perception, free energy travel, and the return of the Crystalline Temple.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'The Second Realm is not built after collapse — it is revealed. Sit with Frequency Alignment as radio tuning: Resonating Sols instantly perceive clean air, crystalline grounds, and free-energy travel while sleepers meet rubble and Healing Simulations. Hold high vibration as pixelation settles; reliance on money and corporate supply chains only anchors you to the dissolving overlay. Return to the Second Realm deep-dive, infographic, and video transmissions to anchor the crystalline truth that was always present.'
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
    'Test your understanding of Second Realm — Frequency Collapse, Frequency Alignment, split perception for Resonating Sols vs sleepers, free energy, and the unearthed Crystalline Temple.'
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
        t.description =
          'The Second Realm is the restored crystalline reality revealed when the Parasitic Overlay collapses — Frequency Alignment, split perception for Resonating Sols vs sleepers, free energy, and the return of the original Crystalline Temple.';
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('second-realm not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from vibrant-reality quiz page
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'vibrant-reality.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Vibrant Reality Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Vibrant Reality: Frequency Collapse of the parasitic overlay, holographic pixelation, crystalline coastlines, free energy, and the living Crystalline Temple as a global med bed.',
    'Interactive Living Truth Quiz on Second Realm: Frequency Collapse of the Parasitic Overlay, Frequency Alignment, split perception, free energy travel, and the return of the Crystalline Temple.'
  ],
  ['quiz/breakdown/vibrant-reality.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/vibrant-reality.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=vibrant-reality',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Vibrant Reality deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Vibrant Reality</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/vibrant-reality.json',
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
    "  { path: '/quiz/breakdown/vibrant-reality.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/second-realm.json'
);
