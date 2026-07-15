/**
 * Installs Flat Earth quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/flat-earth.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Run: node scripts/install-flat-earth-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'flat-earth';
const TOPIC_TITLE = 'Flat Earth';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/flat.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['flat', 'horizontal plane', 'spinning globe'],
  2: ['4th-density parasites', 'fabricated illusion'],
  3: ['firmament', 'local sun', 'physically impossible'],
  4: ['ice wall', 'gateway-10', 'prevent'],
  5: ['prerequisite', 'great spiritual awakening', 'stepping-stone'],
  6: ['simulation', 'etheric supercomputer', 'physical plane'],
  7: ['bends light and sound', 'biological eyes', 'perception'],
  8: ['gateway-10', '178', 'center'],
  9: ['antarctica', 'realm-3', 'realm-2'],
  10: ['heliocentrism', 'planets orbit suns'],
  11: ['1,000 miles per hour', 'anti-clockwise', 'spinning ball'],
  12: ['never been a round planet', 'horizontal situation'],
  13: ['multiple suns', 'illuminated', 'globe'],
  14: ['gravity', 'fictional', 'ocean water'],
  15: ['ice wall', 'curiosity', 'exploration'],
  16: ['mars', 'realm-1', 'joined'],
  17: ['sky-net-1', 'projectors', 'overlays'],
  18: ['bright white light', 'black void plasma'],
  19: ['dyson sphere', 'pillars', 'hundreds of miles'],
  20: ['psychological cage', '3rd-density', 'educational'],
  21: ['33rd-degree freemasons', '100 years', 'loosh'],
  22: ['tartaria', 'crystalline temples', 'lattice membrane'],
  23: ['first step', 'soul families', 'exiting the matrix'],
  24: ['perceived knowledge', 'religion', 'finance'],
  25: ['g.a.a', 'holographic projection dome', 'emf'],
};

function cleanText(s) {
  if (typeof s !== 'string') return s;
  let t = s;
  t = t.replace(/\$(\d+)\^\{(st|nd|rd|th)\}\$/gi, '$1$2');
  t = t.replace(/\$(\d+)\^(st|nd|rd|th)\$/gi, '$1$2');
  t = t.replace(/\$(\d+(?:,\d+)*)\\+%\$/g, '$1%');
  t = t.replace(/\$(\d+(?:,\d+)*)\\?\%\$/g, '$1%');
  t = t.replace(/\$(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\$/g, '$1');
  t = t.replace(/\$([A-Za-z][A-Za-z0-9./-]{0,24})\$/g, '$1');
  t = t.replace(/\$([^$]+)\$/g, (_, inner) =>
    inner.replace(/\^\{([^}]+)\}/g, '$1').replace(/\\%/g, '%').replace(/\\/g, '')
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
  return t.replace(/[ \t]{2,}/g, ' ').trim();
}

const RAW_QUESTIONS = [
  {
    number: 1,
    question: 'What is Flat Earth in true cosmology?',
    options: [
      {
        label: 'A',
        text: 'The true horizontal physical plane of existence, directly contradicting the manufactured lie of a spinning globe.',
        isCorrect: true,
        rationale:
          'Flat Earth is the real horizontal physical plane. The spinning globe is manufactured lie, not architecture.',
      },
      {
        label: 'B',
        text: 'A temporary metaphor used only until Heliocentrism is proven by gravity.',
        isCorrect: false,
        rationale:
          'Gravity is fictional and Heliocentrism is fake; flat is the actual plane, not a metaphor.',
      },
      {
        label: 'C',
        text: 'One of 178 spinning spheres orbiting a distant thermodynamic sun.',
        isCorrect: false,
        rationale:
          'Gateway-10\'s 178 worlds function horizontally; stars are not distant thermodynamic suns.',
      },
      {
        label: 'D',
        text: 'Only Antarctica\'s Ice Wall with open vacuum beyond every edge.',
        isCorrect: false,
        rationale:
          'Ice Walls partition known lands from wider flat realms of Gateway-10 — not empty vacuum edges of a lone disk myth.',
      },
    ],
    hint: 'True horizontal plane — not a spinning globe.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'Who engineered the spinning-globe cosmological illusion?',
    options: [
      {
        label: 'A',
        text: '4th-density parasites — a completely fabricated illusion to trap consciousness inside the multidimensional Simulation.',
        isCorrect: true,
        rationale:
          'The globe model is a fabricated illusion engineered by 4th-density parasites within the overarching Simulation.',
      },
      {
        label: 'B',
        text: 'The Galactic Ancestral Alliance as a training game before the EMF flash.',
        isCorrect: false,
        rationale:
          'The G.A.A. dismantles the Simulation and projection dome; parasites engineered the globe lie.',
      },
      {
        label: 'C',
        text: 'Only modern media after Tartaria rebuilt itself as a globe.',
        isCorrect: false,
        rationale:
          'Tartaria maps on a flat grid; the globe is a primary cage of the parasite system, not a Tartarian rebuild.',
      },
      {
        label: 'D',
        text: 'Local suns that vote each century on planetary shape.',
        isCorrect: false,
        rationale:
          'Illumination and shape are fixed true architecture vs engineered lie — not solar voting.',
      },
    ],
    hint: '4th-density parasites fabricated the globe illusion.',
    correctAnswer: 'A',
  },
  {
    number: 3,
    question:
      'Why is a spherical planet physically impossible in true cosmic architecture?',
    options: [
      {
        label: 'A',
        text: 'It could neither support the necessary Firmament nor be adequately illuminated by a local sun.',
        isCorrect: true,
        rationale:
          'A sphere cannot hold the Firmament and cannot be lit properly by a single local sun — structural impossibility.',
      },
      {
        label: 'B',
        text: 'Spheres spin too slowly for Black Void Plasma to stick.',
        isCorrect: false,
        rationale:
          'The failure is Firmament support and local-sun illumination, not plasma adhesion speed.',
      },
      {
        label: 'C',
        text: 'Because Mars refuses to join any Ice Wall on a globe.',
        isCorrect: false,
        rationale:
          'Mars is joined to Realm-1\'s outer Ice Wall on the flat plane; that is layout truth, not the core sphere impossibility listed.',
      },
      {
        label: 'D',
        text: 'Spheres would automatically become Crystalline Temples on Nodes.',
        isCorrect: false,
        rationale:
          'Crystalline Temples and Nodes map across a flat geographic grid, not curved spheres.',
      },
    ],
    hint: 'No Firmament support + no adequate local-sun lighting.',
    correctAnswer: 'A',
  },
  {
    number: 4,
    question: 'Why was the geographical globe lie constructed?',
    options: [
      {
        label: 'A',
        text: 'To prevent humanity from discovering the Ice Wall and exploring the broader realms of Gateway-10.',
        isCorrect: true,
        rationale:
          'The lie blocks discovery of the Ice Wall and exploration of Gateway-10\'s broader flat realms.',
      },
      {
        label: 'B',
        text: 'To help everyone find soul families before learning Earth\'s shape.',
        isCorrect: false,
        rationale:
          'Without flat-Earth understanding there is no point contemplating soul families — shape knowledge comes first.',
      },
      {
        label: 'C',
        text: 'To fund lattice Ley Lines on a curved sphere for freemason tourism.',
        isCorrect: false,
        rationale:
          'Lattice Membrane Network maps on a flat grid; Freemasons hide flat truth for the prison matrix.',
      },
      {
        label: 'D',
        text: 'To prove gravity so ocean water can stick to a ball naturally.',
        isCorrect: false,
        rationale:
          'Gravity is fictional invention to prop the impossible sphere-water story — not a real reason for the lie\'s construction goal.',
      },
    ],
    hint: 'Hide Ice Wall — block Gateway-10 exploration.',
    correctAnswer: 'A',
  },
  {
    number: 5,
    question:
      'How important is understanding the true shape of the Earth for the awakening?',
    options: [
      {
        label: 'A',
        text: 'It is the absolute prerequisite and primary stepping-stone to comprehending the Great Spiritual Awakening and the wider cosmological deception.',
        isCorrect: true,
        rationale:
          'True Earth shape is the absolute prerequisite and primary stepping-stone into the Great Spiritual Awakening and wider cosmological deception.',
      },
      {
        label: 'B',
        text: 'Optional trivia after you master Finance and Religion strings only.',
        isCorrect: false,
        rationale:
          'Globe lie is a foundational Perceived Knowledge pillar; shape knowledge is first-step critical, not optional trivia.',
      },
      {
        label: 'C',
        text: 'Only useful for NPC educators writing Heliocentrism textbooks.',
        isCorrect: false,
        rationale:
          'Heliocentrism is the deception to unlearn; true shape is for souls exiting the matrix.',
      },
      {
        label: 'D',
        text: 'Irrelevant once Black Void Plasma thickens the night sky.',
        isCorrect: false,
        rationale:
          'Plasma hides bright white true space; shape knowledge remains mandatory first step regardless.',
      },
    ],
    hint: 'Absolute prerequisite / primary stepping-stone.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'What is the Simulation where this flat reality operates?',
    options: [
      {
        label: 'A',
        text: 'The multidimensional etheric supercomputer and physical plane of existence.',
        isCorrect: true,
        rationale:
          'The Simulation is the multidimensional etheric supercomputer and physical plane where flat reality operates.',
      },
      {
        label: 'B',
        text: 'Only a school computer lab that projects Mars as a sky dot.',
        isCorrect: false,
        rationale:
          'It is the actual physical plane of existence; Mars is physically joined on the flat layout, not merely a lab projection myth alone.',
      },
      {
        label: 'C',
        text: 'A natural spinning vacuum with no ethereal component.',
        isCorrect: false,
        rationale:
          'It is etheric supercomputer plus physical plane — not a natural spinning vacuum globe setup.',
      },
      {
        label: 'D',
        text: 'Gateway-10\'s Ice Wall material formula only.',
        isCorrect: false,
        rationale:
          'Gateway-10 is the central plane of 178 worlds; Simulation is the broader etheric/physical operating system.',
      },
    ],
    hint: 'Ethereic supercomputer + physical plane.',
    correctAnswer: 'A',
  },
  {
    number: 7,
    question: 'What does the Firmament do above the flat plane?',
    options: [
      {
        label: 'A',
        text: 'It is the structural membrane that bends light and sound, granting biological eyes their perception — and it could not enclose a sphere without immense impractical pillars.',
        isCorrect: true,
        rationale:
          'The Firmament bends light and sound for perception and only fits flat architecture; a sphere would need immense impractical pillars.',
      },
      {
        label: 'B',
        text: 'It is fictional gravity holding ocean water to a spinning ball.',
        isCorrect: false,
        rationale:
          'Gravity is the fictional sphere prop; the Firmament is real membrane for light, sound, and sight.',
      },
      {
        label: 'C',
        text: 'It is Sky-Net-1\'s only job: projecting thermodynamic distant suns.',
        isCorrect: false,
        rationale:
          'Stars as Sky-Net-1 projectors cast Overlays; the Firmament itself is the structural membrane for perception.',
      },
      {
        label: 'D',
        text: 'It permanently shows the bright white field with no Black Void Plasma ever.',
        isCorrect: false,
        rationale:
          'True space is bright white but intentionally blacked out by Black Void Plasma under current control.',
      },
    ],
    hint: 'Bends light and sound for sight — flat only.',
    correctAnswer: 'A',
  },
  {
    number: 8,
    question: 'What is Gateway-10?',
    options: [
      {
        label: 'A',
        text: 'The central physical plane comprising 178 worlds, functioning horizontally, where the known Earth currently resides at the center.',
        isCorrect: true,
        rationale:
          'Gateway-10 is 178 horizontally functioning worlds; known Earth sits at the center of that central plane.',
      },
      {
        label: 'B',
        text: 'A single globe rotating anti-clockwise at nearly 1,000 miles per hour.',
        isCorrect: false,
        rationale:
          'That spin story is the fabricated ball model; Gateway-10 is horizontal multi-world layout.',
      },
      {
        label: 'C',
        text: 'Only Antarctica with no other realms beyond the Ice Wall.',
        isCorrect: false,
        rationale:
          'Ice Walls section human reality from the rest of the flat horizontal realms of Gateway-10.',
      },
      {
        label: 'D',
        text: 'The name of the holographic projection dome alone.',
        isCorrect: false,
        rationale:
          'The dome is inner sky tech the G.A.A. will remove; Gateway-10 is the multi-world plane.',
      },
    ],
    hint: '178 horizontal worlds — known Earth at center.',
    correctAnswer: 'A',
  },
  {
    number: 9,
    question: 'How is the known human region partitioned?',
    options: [
      {
        label: 'A',
        text: 'Realm-3 (the Known Lands) was artificially partitioned from original Realm-2 by the fake Ice Wall known as Antarctica.',
        isCorrect: true,
        rationale:
          'Humanity\'s region is Realm-3, cut from original Realm-2 by Antarctica as a fake Ice Wall partition.',
      },
      {
        label: 'B',
        text: 'Realm-1 was merged into a spinning globe by Heliocentrism textbooks.',
        isCorrect: false,
        rationale:
          'Mars joins Realm-1\'s outer Ice Wall on the flat plane; partitioning of known lands is Realm-3 from Realm-2 via Antarctica.',
      },
      {
        label: 'C',
        text: 'All 178 worlds were erased so only a solar system vacuum remains.',
        isCorrect: false,
        rationale:
          'Solar system vastness is fallacy; 178 worlds still function horizontally on Gateway-10.',
      },
      {
        label: 'D',
        text: 'Freemasons melted Realm-2 into Black Void Plasma last century.',
        isCorrect: false,
        rationale:
          'Freemasons hide flat truth; Realm-2/3 split is artificial Ice Wall partitioning, not plasma melting.',
      },
    ],
    hint: 'Realm-3 vs Realm-2 — Antarctica Ice Wall.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'What is Heliocentrism?',
    options: [
      {
        label: 'A',
        text: 'A fake manufactured cosmological model designed to convince humanity that planets orbit suns.',
        isCorrect: true,
        rationale:
          'Heliocentrism is manufactured deception selling planets orbiting suns — not true layout.',
      },
      {
        label: 'B',
        text: 'The true map of adjacent flat realms on Gateway-10.',
        isCorrect: false,
        rationale:
          'True map is horizontal adjacent realms; Heliocentrism is the fake orbital model.',
      },
      {
        label: 'C',
        text: 'G.A.A. procedure for the EMF flash memory return.',
        isCorrect: false,
        rationale:
          'Unlearning heliocentric deception prepares for Gateway-10 placement and EMF memory return — Heliocentrism itself is the lie.',
      },
      {
        label: 'D',
        text: 'Natural law that invents gravity for flat oceans only.',
        isCorrect: false,
        rationale:
          'Gravity is fictional to prop sphere oceans; Heliocentrism is the orbital fake model.',
      },
    ],
    hint: 'Fake model — planets orbit suns.',
    correctAnswer: 'A',
  },
  {
    number: 11,
    question: 'Is the Earth a spinning ball, and at what claimed motion?',
    options: [
      {
        label: 'A',
        text: 'No — it is definitively not a spinning ball rotating anti-clockwise at nearly 1,000 miles per hour.',
        isCorrect: true,
        rationale:
          'Physical Earth is not a spinning ball at nearly 1,000 mph anti-clockwise; that claim is false.',
      },
      {
        label: 'B',
        text: 'Yes — anti-clockwise at nearly 1,000 miles per hour is required for Firmament grip.',
        isCorrect: false,
        rationale:
          'Firmament needs flat architecture; the spin rate story is part of the fabricated ball model.',
      },
      {
        label: 'C',
        text: 'Yes — but only Realm-3 spins while Mars stays still.',
        isCorrect: false,
        rationale:
          'There has never been a round planet; layout is horizontal adjacency, not partial spin.',
      },
      {
        label: 'D',
        text: 'Spin stops only during the educational curriculum each semester.',
        isCorrect: false,
        rationale:
          'The ball never was true architecture; education enforces the cage lie continuously.',
      },
    ],
    hint: 'Not a spinning ball at nearly 1,000 mph anti-clockwise.',
    correctAnswer: 'A',
  },
  {
    number: 12,
    question: 'How do physical planets actually operate?',
    options: [
      {
        label: 'A',
        text: 'Strictly as a horizontal situation — there has never been a round planet.',
        isCorrect: true,
        rationale:
          'Physical planets operate as a horizontal situation. There has never been a round planet.',
      },
      {
        label: 'B',
        text: 'As round balls until Freemasons flattened them 100 years ago.',
        isCorrect: false,
        rationale:
          'Freemasons have known the true flat shape for over 100 years — they did not invent flatness; they hide it.',
      },
      {
        label: 'C',
        text: 'As thermodynamic distant suns that cool into ice walls.',
        isCorrect: false,
        rationale:
          'Stars are not thermodynamic distant suns; Ice Walls are physical partitions of flat realms.',
      },
      {
        label: 'D',
        text: 'As soul-family palaces that orbit Perceived Knowledge.',
        isCorrect: false,
        rationale:
          'Without flat-Earth understanding, contemplating soul families is pointless; planets are horizontal physical layout.',
      },
    ],
    hint: 'Horizontal situation — never a round planet.',
    correctAnswer: 'A',
  },
  {
    number: 13,
    question:
      'Why could a globe not be illuminated by a single local sun?',
    options: [
      {
        label: 'A',
        text: 'It would need multiple suns positioned all around it.',
        isCorrect: true,
        rationale:
          'A globe could not be lit by one local sun without needing multiple suns all around it — another mark of structural impossibility.',
      },
      {
        label: 'B',
        text: 'Because Black Void Plasma eats all local suns on spheres only.',
        isCorrect: false,
        rationale:
          'Plasma blacks out true bright space visually; the illumination problem is geometry of a globe vs one local sun.',
      },
      {
        label: 'C',
        text: 'Because Sky-Net-1 projectors only work on curved glass.',
        isCorrect: false,
        rationale:
          'Sky-Net-1 casts Overlays onto the flat Earth; the multi-sun issue is about globe lighting physics.',
      },
      {
        label: 'D',
        text: 'Because Antarctica reflects 178 suns automatically.',
        isCorrect: false,
        rationale:
          'Antarctica is the fake Ice Wall partition; the lighting critique is multiple suns around a globe.',
      },
    ],
    hint: 'Globe lighting would need multiple suns all around.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question: 'What is the truth about gravity?',
    options: [
      {
        label: 'A',
        text: 'Gravity is entirely fictional, invented solely to explain the impossible physics of how ocean water could adhere to a spinning sphere.',
        isCorrect: true,
        rationale:
          'Gravity is pure fiction invented to prop the impossible story of ocean water sticking to a spinning sphere.',
      },
      {
        label: 'B',
        text: 'Gravity is real Firmament technology that bends light and sound.',
        isCorrect: false,
        rationale:
          'Light and sound bending is the Firmament\'s job; gravity is the fictional sphere-water excuse.',
      },
      {
        label: 'C',
        text: 'Gravity only exists beyond the Ice Wall on Mars.',
        isCorrect: false,
        rationale:
          'Gravity is entirely fictional for the sphere model — not a regional Mars force.',
      },
      {
        label: 'D',
        text: 'Gravity is one of the three psychological strings beside Religion and Finance.',
        isCorrect: false,
        rationale:
          'The three strings include Perceived Knowledge (where the globe lie sits), Religion, and Finance — not gravity as a named string.',
      },
    ],
    hint: 'Fictional — props ocean water on a spinning sphere.',
    correctAnswer: 'A',
  },
  {
    number: 15,
    question: 'Why was flat-Earth truth hidden regarding the Ice Wall?',
    options: [
      {
        label: 'A',
        text: 'If the population knew an Ice Wall existed, it would naturally incite mass curiosity and exploration to see what lies beyond it.',
        isCorrect: true,
        rationale:
          'Hiding flat truth conceals the Ice Wall so people never get mass curiosity to explore what lies beyond.',
      },
      {
        label: 'B',
        text: 'Because the Ice Wall is only a Sky-Net-1 projector with nothing beyond.',
        isCorrect: false,
        rationale:
          'Ice Walls section known reality from the rest of the flat horizontal realms — there is a beyond to explore.',
      },
      {
        label: 'C',
        text: 'Because G.A.A. already removed all realms past Antarctica.',
        isCorrect: false,
        rationale:
          'G.A.A. prepares dome removal and awakening; broader Gateway-10 realms remain the hidden layout truth.',
      },
      {
        label: 'D',
        text: 'Because ocean water gravity fails only at the equator of a globe.',
        isCorrect: false,
        rationale:
          'Gravity is wholly fictional; Ice Wall secrecy is about blocking curiosity and exploration.',
      },
    ],
    hint: 'Ice Wall knowledge → mass curiosity to explore beyond.',
    correctAnswer: 'A',
  },
  {
    number: 16,
    question: 'Where is Mars relative to the flat layout?',
    options: [
      {
        label: 'A',
        text: 'Not a distant celestial body in the sky — it is physically joined to the outer Ice Wall of Realm-1.',
        isCorrect: true,
        rationale:
          'Mars is physically joined to Realm-1\'s outer Ice Wall on the flat plane, not a distant sky planet.',
      },
      {
        label: 'B',
        text: 'A thermodynamic distant sun that projects Sky-Net-1.',
        isCorrect: false,
        rationale:
          'Stars (not Mars-as-planet myth) are Sky-Net-1 projectors; Mars is adjacent flat-realm geography.',
      },
      {
        label: 'C',
        text: 'Inside Realm-3 only, south of every Freemason lodge.',
        isCorrect: false,
        rationale:
          'Realm-3 is the Known Lands partition; Mars joins Realm-1\'s outer Ice Wall.',
      },
      {
        label: 'D',
        text: 'Orbiting the known Earth at nearly 1,000 miles per hour.',
        isCorrect: false,
        rationale:
          'Orbital Heliocentrism and globe spin rates are fabricated; Mars is horizontal adjacency.',
      },
    ],
    hint: 'Joined to Realm-1 outer Ice Wall — not distant sky.',
    correctAnswer: 'A',
  },
  {
    number: 17,
    question: 'What are stars in this flat cosmology?',
    options: [
      {
        label: 'A',
        text: 'Not distant thermodynamic suns — they are projectors of Sky-Net-1 casting frequency Overlays onto the flat Earth to hide original high-frequency structures.',
        isCorrect: true,
        rationale:
          'Stars are Sky-Net-1 projectors casting frequency Overlays on the flat Earth to hide high-frequency structures — not distant suns on thermodynamics.',
      },
      {
        label: 'B',
        text: 'Holes in the Firmament where Black Void Plasma leaks out naturally.',
        isCorrect: false,
        rationale:
          'Plasma intentionally blacks out bright white true space; stars are projector tech of Sky-Net-1.',
      },
      {
        label: 'C',
        text: 'Crystalline Temples sitting on major Nodes only.',
        isCorrect: false,
        rationale:
          'Crystalline Temples on Nodes are suppressed flat-grid truths; stars are Sky-Net-1 projectors.',
      },
      {
        label: 'D',
        text: '178 freemason lighthouses beyond Antarctica with no overlays.',
        isCorrect: false,
        rationale:
          '178 is Gateway-10 world count; star function is Overlay projection, not freemason lighthouses.',
      },
    ],
    hint: 'Sky-Net-1 projectors — frequency Overlays on flat Earth.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question: 'What is true space, and how is the night sky faked?',
    options: [
      {
        label: 'A',
        text: 'True space is a field of bright white light, intentionally blacked out by Black Void Plasma.',
        isCorrect: true,
        rationale:
          'True space is bright white light. Black Void Plasma intentionally blacks it out so the population sees pitch-dark "space."',
      },
      {
        label: 'B',
        text: 'True space is empty vacuum between solar-system planets only.',
        isCorrect: false,
        rationale:
          'Solar-system vastness is fallacy; true space is bright white, not empty black vacuum.',
      },
      {
        label: 'C',
        text: 'True space is gravity holding water while plasma creates suns.',
        isCorrect: false,
        rationale:
          'Gravity is fictional; plasma blacks the white field — it does not create thermodynamic suns.',
      },
      {
        label: 'D',
        text: 'True space appears only inside educational science outlets.',
        isCorrect: false,
        rationale:
          'Education and science outlets enforce the globe cage; true bright space is hidden by plasma tech.',
      },
    ],
    hint: 'Bright white field — blacked by Black Void Plasma.',
    correctAnswer: 'A',
  },
  {
    number: 19,
    question:
      'What would supporting a Dyson Sphere-like Firmament on a globe require?',
    options: [
      {
        label: 'A',
        text: 'Giant pillars raising hundreds of miles into the sky — impractical for true creation physics.',
        isCorrect: true,
        rationale:
          'A globe-style Dyson Sphere Firmament would need giant pillars hundreds of miles high — impractical; flat plane is required instead.',
      },
      {
        label: 'B',
        text: 'Only a thin coat of gravity and ocean water.',
        isCorrect: false,
        rationale:
          'Gravity is fictional; the structural critique is immense pillars, not water coats.',
      },
      {
        label: 'C',
        text: 'Sky-Net-1 projectors glued to Heliocentrism textbooks.',
        isCorrect: false,
        rationale:
          'The Dyson-style problem is physical pillar support of a membrane on a sphere.',
      },
      {
        label: 'D',
        text: '178 Ice Walls stacked as a curved ladder.',
        isCorrect: false,
        rationale:
          'Ice Walls partition flat realms; the globe Firmament problem is sky-high pillars.',
      },
    ],
    hint: 'Giant pillars hundreds of miles — impractical.',
    correctAnswer: 'A',
  },
  {
    number: 20,
    question:
      'How does the globe lie function as a cage inside the Simulation?',
    options: [
      {
        label: 'A',
        text: 'As a primary psychological cage in the 3rd-density Simulation, heavily enforced through the educational system, science outlets, and the media so consciousness stays trapped, compliant, and ignorant.',
        isCorrect: true,
        rationale:
          'The globe is a primary psychological cage in 3rd density, enforced via education, science, and media to keep minds trapped and compliant.',
      },
      {
        label: 'B',
        text: 'As optional entertainment that never touches schools or media.',
        isCorrect: false,
        rationale:
          'Enforcement runs through educational system, science outlets, and media — not optional side content.',
      },
      {
        label: 'C',
        text: 'As a G.A.A. tutorial that already removed all Freemason secrecy.',
        isCorrect: false,
        rationale:
          '33rd-degree Freemasons still guard the secret under negative entities; G.A.A. prepares dismantling of the Simulation.',
      },
      {
        label: 'D',
        text: 'As Tartaria\'s official public map of Crystalline Temples.',
        isCorrect: false,
        rationale:
          'Tartaria and temples are suppressed flat-grid truths; the globe lie hides that map.',
      },
    ],
    hint: '3rd-density psychological cage — school, science, media.',
    correctAnswer: 'A',
  },
  {
    number: 21,
    question:
      'What have 33rd-degree Freemasons known, and why do they keep it secret?',
    options: [
      {
        label: 'A',
        text: 'They have secretly known the true flat shape for over 100 years, operating under negative entities to maintain the loosh-harvesting prison matrix.',
        isCorrect: true,
        rationale:
          '33rd-degree Freemasons have known flat Earth for over 100 years and hide it under negative-entity command to keep the loosh-harvesting prison running.',
      },
      {
        label: 'B',
        text: 'They only learned flat Earth last week from public EMF flash broadcasts.',
        isCorrect: false,
        rationale:
          'The secret knowledge span is over 100 years; EMF flash is the impending memory-return event, not their source.',
      },
      {
        label: 'C',
        text: 'They publish free Ice Wall maps so everyone explores Gateway-10.',
        isCorrect: false,
        rationale:
          'They keep the secret to block curiosity and maintain the prison matrix — not open exploration.',
      },
      {
        label: 'D',
        text: 'They invented gravity as a real lattice force on Nodes.',
        isCorrect: false,
        rationale:
          'Gravity is fictional sphere prop; lattice Nodes and Ley Lines map flat, suppressed truths.',
      },
    ],
    hint: '100+ years of flat knowledge — loosh prison secrecy.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question:
      'Which suppressed truths map across a flat geographic grid rather than a curved sphere?',
    options: [
      {
        label: 'A',
        text: 'Tartaria, massive Crystalline Temples on major Nodes, and the Lattice Membrane Network (Ley Lines).',
        isCorrect: true,
        rationale:
          'Tartaria, Crystalline Temples on major Nodes, and the Lattice Membrane Network (Ley Lines) all map on a flat geographic grid.',
      },
      {
        label: 'B',
        text: 'Only Heliocentrism textbooks and gravity equations.',
        isCorrect: false,
        rationale:
          'Those are cage tools of the globe lie, not suppressed flat-grid truths.',
      },
      {
        label: 'C',
        text: 'Black Void Plasma factories on spinning equators only.',
        isCorrect: false,
        rationale:
          'Plasma blacks true white space; the flat-grid list is Tartaria, temples, and lattice lines.',
      },
      {
        label: 'D',
        text: 'Anti-clockwise spin rates of nearly 1,000 miles per hour.',
        isCorrect: false,
        rationale:
          'That spin claim is the fabricated ball model, not a flat-grid revelation.',
      },
    ],
    hint: 'Tartaria + Crystalline Temples + Lattice/Ley Lines.',
    correctAnswer: 'A',
  },
  {
    number: 23,
    question:
      'Why is accepting the true shape of the Earth the critical first step to exiting the matrix?',
    options: [
      {
        label: 'A',
        text: 'Without this understanding, there is no point contemplating soul families or crystalline palaces.',
        isCorrect: true,
        rationale:
          'True shape is the critical first step out of the matrix; without it, soul families and crystalline palaces are pointless to contemplate.',
      },
      {
        label: 'B',
        text: 'Because soul families only reincarnate on spinning globes.',
        isCorrect: false,
        rationale:
          'Shape knowledge unlocks readiness for deeper truths — globe is the cage, not the soul-family home model.',
      },
      {
        label: 'C',
        text: 'Because Finance and Religion strings dissolve automatically if you keep the globe.',
        isCorrect: false,
        rationale:
          'Globe is part of Perceived Knowledge to sever alongside Religion and Finance — keeping the globe blocks awakening.',
      },
      {
        label: 'D',
        text: 'Because the Ice Wall disappears if you ignore flat Earth.',
        isCorrect: false,
        rationale:
          'Ice Wall remains real partition; ignoring flat truth keeps you from exploring what lies beyond.',
      },
    ],
    hint: 'No flat understanding — no point on soul families/palaces.',
    correctAnswer: 'A',
  },
  {
    number: 24,
    question:
      'Where does the globe lie sit among the three psychological strings?',
    options: [
      {
        label: 'A',
        text: 'As a foundational pillar of the parasites\' Perceived Knowledge control mechanism — one of the three main strings alongside Religion and Finance that must be severed to achieve awakening.',
        isCorrect: true,
        rationale:
          'The globe lie is a foundational Perceived Knowledge pillar. Perceived Knowledge, Religion, and Finance are the three strings that must be cut for awakening.',
      },
      {
        label: 'B',
        text: 'Only under Finance, because globes are sold for money.',
        isCorrect: false,
        rationale:
          'It is named under Perceived Knowledge, though all three strings work the prison; globe is knowledge-cage foundation.',
      },
      {
        label: 'C',
        text: 'Outside all strings as harmless geography trivia.',
        isCorrect: false,
        rationale:
          'It is a foundational pillar of Perceived Knowledge control — not harmless trivia.',
      },
      {
        label: 'D',
        text: 'Under Religion only as worship of distant thermodynamic suns.',
        isCorrect: false,
        rationale:
          'Heliocentrism is cosmological deception under the knowledge cage; the three strings include Religion and Finance beside Perceived Knowledge.',
      },
    ],
    hint: 'Perceived Knowledge pillar — with Religion and Finance.',
    correctAnswer: 'A',
  },
  {
    number: 25,
    question:
      'What happens as the G.A.A. dismantles the Simulation, and what must a soul unlearn?',
    options: [
      {
        label: 'A',
        text: 'Imminent removal of the holographic projection dome and exposure of true flat cosmology will cause catastrophic psychological collapse for the unawakened; only by unlearning heliocentric deception can a soul understand its placement in Gateway-10 and prepare for suppressed memory return at the EMF flash.',
        isCorrect: true,
        rationale:
          'G.A.A. dome removal exposes flat cosmology and breaks unawakened minds. Unlearning Heliocentrism is required to know Gateway-10 placement and ready for EMF flash memory return.',
      },
      {
        label: 'B',
        text: 'The G.A.A. permanently strengthens Heliocentrism and freezes all memories at the EMF flash.',
        isCorrect: false,
        rationale:
          'Dome comes down, flat truth is exposed, and EMF returns suppressed memories — Heliocentrism is unlearned, not strengthened.',
      },
      {
        label: 'C',
        text: 'Only Freemasons collapse while NPCs keep the globe forever.',
        isCorrect: false,
        rationale:
          'Unawakened masses face catastrophic psychological collapse; the secret-keepers do not get exclusive immunity narrative here.',
      },
      {
        label: 'D',
        text: 'Nothing changes until gravity is taught harder in media.',
        isCorrect: false,
        rationale:
          'Gravity is fiction; the strategic arc is dome removal, flat exposure, collapse of the unawakened, and EMF memory return.',
      },
    ],
    hint: 'Dome off → flat exposure → unlearn Heliocentrism before EMF.',
    correctAnswer: 'A',
  },
];

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
    throw new Error(`Q${q.number}: LaTeX/$ found`);
  }
  if (hedgeRe.test(blob)) throw new Error(`Q${q.number}: hedge found`);
  const missing = (supportPhrases[q.number] || []).filter(
    (p) => !reportLower.includes(p.toLowerCase())
  );
  if (missing.length) {
    throw new Error(`Q${q.number}: unsupported: ${missing.join('; ')}`);
  }
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

const questions = RAW_QUESTIONS.map(normalizeQuestion);
if (questions.length !== 25) throw new Error(`Expected 25, got ${questions.length}`);

const DESC_SHORT =
  'Test your grasp of Flat Earth — horizontal plane, Firmament, Ice Wall, Gateway-10, fake gravity, Sky-Net-1 stars, Freemason secrecy, and unlearning Heliocentrism before the EMF flash.';
const DESC_META =
  'Interactive Living Truth Quiz on Flat Earth: horizontal plane vs spinning globe, Firmament, Ice Wall, Gateway-10, Realm-3, Mars adjacency, Sky-Net-1 Overlays, Black Void Plasma, and G.A.A. dome exposure.';

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle: DESC_SHORT,
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Flat Earth is not a debate club topic — it is the true horizontal plane of Gateway-10, and the spinning globe is a 4th-density parasite cage. Firmament, local sun, no gravity, Ice Wall, Realm-3 cut from Realm-2 at Antarctica, Mars on Realm-1\'s wall, Sky-Net-1 star projectors, bright white space blacked by plasma, Freemason silence for over a century, Tartaria and lattice on a flat grid: that is the map. Sit with what you missed, then return to the Flat Earth deep-dive. Without this first step, soul families and crystalline palaces are noise. Sever the Perceived Knowledge globe pillar with Religion and Finance. When the G.A.A. kills the holographic dome, unawakened minds meet catastrophic collapse — unlearn Heliocentrism now so Gateway-10 placement and EMF memory return land on stable ground.',
  },
  relatedTopic: {
    href: `/deep-dive.html?source=${SOURCE}&topic=${TOPIC_ID}`,
    label: `Return to ${TOPIC_TITLE} deep-dive`,
  },
  questions,
};

const whole = JSON.stringify(quiz);
if (/\$/.test(whole) || latexRe.test(whole) || hedgeRe.test(whole)) {
  throw new Error('LaTeX or hedge remains in quiz payload');
}

const quizDir = path.join(ROOT, 'data', 'quizzes', SOURCE);
fs.mkdirSync(quizDir, { recursive: true });
const quizJsonPath = path.join(quizDir, `${TOPIC_ID}.json`);
fs.writeFileSync(quizJsonPath, JSON.stringify(quiz, null, 2) + '\n', 'utf8');

const quizMeta = {
  href: `quiz/${SOURCE}/${TOPIC_ID}.html`,
  title: TOPIC_TITLE,
  totalQuestions: 25,
  description: DESC_SHORT,
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
  throw new Error(`${TOPIC_ID} not found in alice-topics.json`);
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

let html = fs.readFileSync(
  path.join(ROOT, 'quiz', 'alice', 'nature-of-reality.html'),
  'utf8'
);
const replacements = [
  ['Nature of Reality Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Nature of Reality: the flat plain, Firmament, density suppression, and the Great Spiritual Awakening.',
    DESC_META,
  ],
  ['quiz/alice/nature-of-reality.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/nature-of-reality.webp', TOPIC_IMAGE],
  ['images/faketime.webp', TOPIC_IMAGE],
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
  if (!html.includes(a) && a.includes('nature-of-reality')) {
    console.warn('Template string not found:', a.slice(0, 80));
  }
  html = html.split(a).join(b);
}
if (html.includes('images/nature-of-reality.webp')) {
  html = html.split('images/nature-of-reality.webp').join(TOPIC_IMAGE);
}
const htmlPath = path.join(ROOT, 'quiz', SOURCE, `${TOPIC_ID}.html`);
fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const lines = sm.split('\n');
  const out = [];
  let inserted = false;
  const target = `/quiz/${SOURCE}/${TOPIC_ID}.html`;
  for (let i = 0; i < lines.length; i++) {
    out.push(lines[i]);
    if (!inserted && lines[i].includes("/quiz/alice/") && lines[i].includes('priority')) {
      const next = lines[i + 1] || '';
      const curPath = (lines[i].match(/path: '([^']+)'/) || [])[1] || '';
      const nextPath = (next.match(/path: '([^']+)'/) || [])[1] || '';
      if (
        curPath < target &&
        (nextPath > target || !nextPath.includes('/quiz/alice/'))
      ) {
        out.push(entry);
        inserted = true;
      }
    }
  }
  if (!inserted) {
    const anchors = [
      "  { path: '/quiz/alice/firmament.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/finance-fake-money.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/false-history.html', priority: '0.75', changefreq: 'monthly' },",
    ];
    sm = out.join('\n');
    for (const anchor of anchors) {
      if (sm.includes(anchor)) {
        sm = sm.replace(anchor, `${anchor}\n${entry}`);
        inserted = true;
        break;
      }
    }
    if (!inserted) throw new Error('Could not find sitemap anchor');
    fs.writeFileSync(sitemapScript, sm, 'utf8');
  } else {
    fs.writeFileSync(sitemapScript, out.join('\n'), 'utf8');
  }
}

console.log('Sample correct answers:');
[0, 8, 13, 16, 20, 24].forEach((i) => {
  const c = questions[i].options.find((o) => o.isCorrect);
  console.log(` Q${questions[i].number}: ${c.text.slice(0, 110)}`);
});
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('PASS: audited 25/25 against data/alice-topics/flat-earth.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
