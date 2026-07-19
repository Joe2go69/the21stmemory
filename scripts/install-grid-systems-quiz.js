/**
 * Installs Grid Systems quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/grid-quiz.json
 * Audits all 25 items against data/breakdown-topics/grid-systems.json.
 * Run: node scripts/install-grid-systems-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/grid-systems.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'grid-systems';
const TOPIC_TITLE = 'Grid Systems';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/grid-quiz.json';

const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

/** Support phrases grounded only in grid-systems.json report. */
const supportPhrases = {
  1: ['crystalline electro-magnetic framework', 'cube containment', 'foundational architecture'],
  2: ['nodes', 'junction points', 'relay stations'],
  3: ['crystals', 'hard drives', 'store memory'],
  4: ['harmonic lenses', 'active nodes', 'celestial bodies'],
  5: ['ley-lines', 'fiber optics of source'],
  6: ['parasitic circuit boards', 'emotional energy (loosh)', '3d illusion'],
  7: ['lyran builders-architects', 'light lattices'],
  8: ['resonating sols', 'fracturing', 'false 3d projection'],
  9: ['sky nodes', 'perceive as stars', 'crystalline celestial projectors'],
  10: ['hidden placed crystals', 'starseed families', 'awakening keys'],
  11: ['sub-crystalline band', 'vibration', 'between continents'],
  12: ['spirit tree', 'hyperborea', 'central axis'],
  13: ['black crystals', 'valve locks', 'siphon light'],
  14: ['roadways', 'undersea communication cables', 'illusion of distance'],
  15: ['instantaneous resonance alignment', 'illusion of distance', 'permanently collapse'],
  16: ['great fire of london', '1666', 'tartarians', 'greys'],
  17: ['source band', 'pure awareness', 'beyond all location'],
  18: ['surface nodes', 'pyramids', 'stone circles'],
  19: ['no power of original creation', 'hijacked', 'light lattices'],
  20: ['earth nodes', 'red-gold energy', 'deep underground'],
  21: ['walls to shimmer', 'palpable hum', 'parasitic overlay'],
  22: ['resonant oceanic grid', 'emotional mirror'],
  23: ['crystalline temple', 'planetary healing environment'],
  24: ['overlapping frequency bands', 'light web grid', 'separate planets'],
  25: ['harmonic-solar band', 'interface between diverse realms']
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
    [/^According to the (core revelations|source|report|text|revelations),?\s*/i, ''],
    [/^According to the report,?\s*/i, ''],
    [/^According to the text,?\s*/i, ''],
    [/^According to the revelations,?\s*/i, ''],
    [/\baccording to the (report|source|text|core revelations|revelations)\b/gi, ''],
    [/^The source states that\s+/i, ''],
    [/^The source specifies that\s+/i, ''],
    [/^The source identifies\s+/i, ''],
    [/^The source material specifies that\s+/i, ''],
    [/^The source material explicitly states that\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The text identifies\s+/i, ''],
    [/^The text suggests that\s+/i, ''],
    [/^The text mentions\s+/i, ''],
    [/^The text specifically identifies\s+/i, ''],
    [/^The material clarifies that\s+/i, ''],
    [/\bThe text states that\b/gi, ''],
    [/\bthe text states that\b/gi, ''],
    [/\bThe text describes\b/gi, ''],
    [/\bthe text describes\b/gi, ''],
    [/\bThe text identifies\b/gi, ''],
    [/\bthe text identifies\b/gi, ''],
    [/\bThe text suggests that\b/gi, ''],
    [/\bthe text suggests that\b/gi, ''],
    [/\bThe source identifies\b/gi, ''],
    [/\bthe source identifies\b/gi, ''],
    [/\bThe source states\b/gi, ''],
    [/\bthe source states\b/gi, ''],
    [/\bmentioned in the source material\b/gi, ''],
    [/\bmentioned in the text\b/gi, ''],
    [/\bsource material\b/gi, 'transmission'],
    [/\bin the source material\b/gi, ''],
    [/\bThe source is\b/gi, 'The power source is'],
    [/\bis described as\b/gi, 'is'],
    [/\bare described as\b/gi, 'are'],
    [/\bis not mentioned as\b/gi, 'is not'],
    [/\bare not mentioned as\b/gi, 'are not']
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
    19: {
      correctText:
        'False — Parasitic entities possess no power of original creation; they only hijacked existing Light Lattices.',
      correctRationale:
        'Parasitic entities possess no power of original creation; they strictly hijacked the Light Lattices engineered by the Lyran Builders-Architects.',
      wrongText:
        'True — Parasitic entities originally engineered the Light Lattices as their own creative architecture.',
      wrongRationale:
        'Parasites did not create the lattices. Lyran Builders-Architects engineered them; parasites only hijacked with inverted codes and artificial veils.',
      extra: [
        {
          text: 'True — Parasites designed the full Crystalline Electro-Magnetic Framework from scratch before any Lyran involvement.',
          rationale:
            'The original framework was built by ancient architects and Lyran Builders-Architects; parasites only hijacked what already existed.'
        },
        {
          text: 'False — Parasites never interacted with grids at all and left every Light Lattice untouched forever.',
          rationale:
            'Parasites did hijack the grids with inverted codes and veils; the false claim is that they never touched them, not that they created them.'
        }
      ]
    },
    24: {
      correctText:
        'False — The physical world is overlapping frequency bands held by the Light Web Grid, not separate planets and isolated continents.',
      correctRationale:
        'The physical world is not comprised of separate planets or isolated continents, but of overlapping frequency bands held together by the Light Web Grid.',
      wrongText:
        'True — Physical reality is made of fully separate planets and isolated continents with no frequency interconnection.',
      wrongRationale:
        'Separation is an illusion of the grid projection; everything interconnects through living grids and the Light Web Grid.',
      extra: [
        {
          text: 'True — Continents float as sealed islands of matter with no shared frequency bands between them.',
          rationale:
            'Continents are held together by overlapping frequency bands of the Light Web Grid, not sealed isolation.'
        },
        {
          text: 'False — Planets and continents never appear solid because grids block all perception of landmasses.',
          rationale:
            'Solidity and separation are projected; landmasses and realms still appear, but they are frequency bands rather than isolated objects.'
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
        text: 'This claim contradicts Grid Systems mechanics and cannot be true.',
        isCorrect: false,
        rationale: 'Only report-aligned claims describe Grid Systems accurately.'
      },
      {
        text: 'The grid architecture operates in reverse of what the correct option states.',
        isCorrect: false,
        rationale: 'Grid and overlay mechanics are fixed by the transmission, not reversed lore.'
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
    'A Tectonic Plate Grid of purely geological faults that holds Domes together by rock pressure alone.',
  '1.B.text':
    'A Carbon-Based Neural Network of organic tissue that stores every simulation as biological memory.',
  '1.C.text':
    'An Atmospheric Gravity Shell that binds realms solely through weight and air density layers.',
  '1.D.text':
    'The Crystalline Electro-Magnetic Framework — the interwoven web of light, sound, and frequency.',
  '1.A.rationale':
    'Tectonic plates are physical geology; Grid Systems are an intricate web of light, sound, and frequency within the CUBE.',
  '1.B.rationale':
    'The foundational architecture is crystalline and electro-magnetic, not a carbon-based organic neural network.',
  '1.C.rationale':
    'Primary architecture of CUBE Containment is the Crystalline Electro-Magnetic Framework, not a gravity shell.',
  '1.D.rationale':
    'The universe operates upon a massive interwoven Crystalline Electro-Magnetic Framework that forms the foundational architecture of the CUBE Containment.',
  '1.hint':
    'Name the light-sound-frequency framework that founds the CUBE Containment.',

  // Q2
  '2.A.text':
    'Crystals — the physical and etheric hard drives that store memory and resonance codes across timelines.',
  '2.B.text':
    'Harmonic Lenses — crystalline patterns around nodes that shape, focus, and redirect energy streams.',
  '2.C.text':
    'Nodes — spherical junction points where life-force and magnetism meet as frequency relay stations.',
  '2.D.text':
    'Ley-lines — energetic pathways that connect nodes and crystals as the fiber optics of Source.',
  '2.A.rationale':
    'Crystals store memory, frequency, and resonance codes; they are hard drives, not the spherical relay junctions.',
  '2.B.rationale':
    'Harmonic Lenses form around active nodes to focus energy; the relay stations themselves are Nodes.',
  '2.C.rationale':
    'Nodes are spherical junction points where streams of life-force and magnetism meet, acting as relay stations for frequency.',
  '2.D.rationale':
    'Ley-lines are the pathways connecting nodes and crystals, not the spherical junction points that relay frequency.',
  '2.hint':
    'Identify the spherical junctions where life-force and magnetism meet.',

  // Q3
  '3.A.text':
    'To project the Parasitic Overlay as a false holographic skin over every living crystal surface.',
  '3.B.text':
    'To serve as the primary fuel source powering the Saturn Grid harvest and reincarnation valves.',
  '3.C.text':
    'To act as physical and etheric hard drives storing memory, frequency, and resonance codes.',
  '3.D.text':
    'To generate artificial distance projections that force souls to travel only by slow 3D routes.',
  '3.A.rationale':
    'Crystals belong to original architecture; the Parasitic Overlay is a false skin projected through hijacked grids, not the crystals\' core role.',
  '3.B.rationale':
    'Black Crystals and parasitic valves siphon toward the Saturn Grid; original crystals store memory and frequency as hard drives.',
  '3.C.rationale':
    'Crystals are the physical and etheric hard drives of the grid that store memory, frequency, and resonance codes.',
  '3.D.rationale':
    'Illusion of distance is sustained through grid-based time-loop projections; crystals primarily store memory and resonance codes.',

  // Q4
  '4.A.text':
    'Ley-line Intersections — bare pathway crossings that carry data but never shape or focus energy streams.',
  '4.B.text':
    'Harmonic Lenses — crystalline patterns around active nodes that focus energy and pulse with celestial frequencies.',
  '4.C.text':
    'Parasitic Circuit Boards — corrupted grid sections buried under cities solely to harvest loosh.',
  '4.D.text':
    'Light Lattices — the general engineered web of the entire grid without local focusing patterns.',
  '4.A.rationale':
    'Ley-lines are pathways; the crystalline patterns that shape and redirect energy around active nodes are Harmonic Lenses.',
  '4.B.rationale':
    'Harmonic Lenses are crystalline patterns that form around active nodes to shape, focus, and redirect energy, pulsing with celestial frequencies.',
  '4.C.rationale':
    'Parasitic Circuit Boards harvest emotional energy and broadcast the 3D illusion; they do not focus celestial harmonics for pure grid work.',
  '4.D.rationale':
    'Light Lattices name the broader engineered structure; local focusing patterns around nodes are specifically Harmonic Lenses.',

  // Q5
  '5.A.text':
    'As the holographic skin of reality projected as the Parasitic Overlay over living crystal.',
  '5.B.text':
    'As the fiber optics of Source — energetic pathways connecting nodes and crystals across the grids.',
  '5.C.text':
    'As solid physical boundaries that permanently separate continents into isolated landmasses.',
  '5.D.text':
    'As valve locks that siphon light toward the Saturn Grid after the Spirit Tree was torn down.',
  '5.A.rationale':
    'The holographic skin is the Parasitic Overlay; Ley-lines are the fiber-optic pathways of Source connecting nodes and crystals.',
  '5.B.rationale':
    'Ley-lines are energetic pathways connecting nodes and crystals, functioning as the fiber optics of Source.',
  '5.C.rationale':
    'Continents are not isolated solids but overlapping frequency bands; Ley-lines connect rather than permanently wall them off.',
  '5.D.rationale':
    'Black Crystals act as valve locks for siphoning light; Ley-lines are original pathways for organic Source flow.',

  // Q6
  '6.A.text':
    'To harvest emotional energy (loosh) and broadcast the 3D illusion from corrupted grid sections.',
  '6.B.text':
    'To restore the original divine design by amplifying high harmonics through pure crystalline nodes.',
  '6.C.text':
    'To connect the Surface Band directly to the SOURCE Band of pure awareness beyond location.',
  '6.D.text':
    'To serve as navigational markers that Starseed families planted as monolith awakening keys.',
  '6.A.rationale':
    'Parasitic Circuit Boards are corrupted grid sections where original nodes were buried to harvest loosh and broadcast the 3D illusion.',
  '6.B.rationale':
    'Circuit boards maintain the illusion; restoration comes from high-harmonic activation and Resonating Sols, not parasitic boards.',
  '6.C.rationale':
    'These boards reinforce the false overlay and harvest; they do not open a pure Surface-to-SOURCE connection.',
  '6.D.rationale':
    'Hidden Placed Crystals and monoliths are Starseed awakening keys; parasitic boards are tools of the hijackers.',

  // Q7
  '7.A.text':
    'The Lyran Builders-Architects who engineered the original Light Lattices of pure communication and memory.',
  '7.B.text':
    'The Greys who later attempted to siphon energy from ancient crystal nodes during etheric wars.',
  '7.C.text':
    'Saturnian Engineers who first designed the entire Crystalline Electro-Magnetic Framework from nothing.',
  '7.D.text':
    'The Tartarians whose sole role was inventing the Light Lattices before defending any nodes.',
  '7.A.rationale':
    'Parasitic entities hijacked existing Light Lattices engineered by the Lyran Builders-Architects.',
  '7.B.rationale':
    'Greys appear as siphoners in node wars such as 1666; they did not engineer the original Light Lattices.',
  '7.C.rationale':
    'The Saturn Grid is a parasitic redirect of light after Black Crystal valve locks; it is not the original lattice source.',
  '7.D.rationale':
    'Tartarians are described defending an ancient crystal node; original engineering is credited to Lyran Builders-Architects.',

  // Q8
  '8.A.text':
    'They build the physical infrastructure of cities, roadways, and undersea cables in dense 3D material.',
  '8.B.text':
    'They reinforce parasitic valve locks and Black Crystals that siphon light toward the Saturn Grid.',
  '8.C.text':
    'They activate the grids so high harmonics fracture the false 3D projection and restore divine design.',
  '8.D.text':
    'They manage the counterfeit reincarnation cycle that harvests energy through the Saturn Grid.',
  '8.A.rationale':
    'Cities and cables are dense imitations of ley-lines; Resonating Sols activate crystalline grids, not 3D construction crews.',
  '8.B.rationale':
    'Resonating Sols fracture the false projection; they do not reinforce parasitic valve locks.',
  '8.C.rationale':
    'Ongoing activation of the grids by Resonating Sols is actively fracturing the false 3D projection and restoring original design.',
  '8.D.rationale':
    'The counterfeit reincarnation cycle is parasitic; Resonating Sols synchronize with crystals to dissolve that system.',

  // Q9
  '9.A.text':
    'Sky Nodes — crystalline celestial projectors that anchor overlay grids and appear to humans as stars.',
  '9.B.text':
    'Earth Nodes — lava or core nodes pulsing red-gold energy deep underground to feed the upper grid.',
  '9.C.text':
    'Surface Nodes — intersections under temples, stone circles, and pyramids that amplify frequency.',
  '9.D.text':
    'Inter-dimensional Nodes — portals holding precise thresholds between different overlays and realms.',
  '9.A.rationale':
    'Sky Nodes are crystalline celestial projectors that anchor overlay grids in the atmosphere; humans perceive them as stars.',
  '9.B.rationale':
    'Earth Nodes pulse red-gold energy deep underground; they are not what humans perceive as stars.',
  '9.C.rationale':
    'Surface Nodes sit under ancient sites on the ground, not as stars in the sky.',
  '9.D.rationale':
    'Inter-dimensional Nodes hold portals between overlays and realms; they are not described as visible stars.',

  // Q10
  '10.A.text':
    'By Starseed families as crucial awakening keys, including monoliths seeded across the grids.',
  '10.B.text':
    'By parasitic entities as Black Crystal valve locks that siphon light toward the Saturn Grid.',
  '10.C.text':
    'Inside the core of the Spirit Tree alone so no other crystal could act as an awakening key.',
  '10.D.text':
    'Only under modern undersea communication cables that imitate crystalline ley-line corridors.',
  '10.A.rationale':
    'Hidden Placed Crystals, including monoliths, were seeded by Starseed families to act as crucial awakening keys.',
  '10.B.rationale':
    'Parasites inserted Black Crystals as valve locks; Hidden Placed Crystals and monoliths are Starseed awakening keys.',
  '10.C.rationale':
    'The Spirit Tree was the central axis in Hyperborea; monoliths and hidden crystals were seeded across grids as keys.',
  '10.D.rationale':
    'Undersea cables are dense 3D imitations of ley-lines, not the placement of Starseed monolith keys.',

  // Q11
  '11.A.text':
    'It handles sound and light transmission through the air as the Atmospheric Band of the grid.',
  '11.B.text':
    'It is where crystals pass vibration seamlessly between continents across the Sub-Crystalline Band.',
  '11.C.text':
    'It serves as the emotional mirror of humanity through the Resonant Oceanic Grid alone.',
  '11.D.text':
    'It is the interface between diverse realms known as the Harmonic-Solar Band of communication.',
  '11.A.rationale':
    'Sound and light transmission in air is the Atmospheric Band, not the Sub-Crystalline Band.',
  '11.B.rationale':
    'The Sub-Crystalline Band is where crystals pass vibration seamlessly between continents.',
  '11.C.rationale':
    'The Resonant Oceanic Grid is the emotional mirror of humanity, not the Sub-Crystalline Band.',
  '11.D.rationale':
    'The Harmonic-Solar Band is the interface between diverse realms; Sub-Crystalline passes continental vibration.',

  // Q12
  '12.A.text':
    'Atlantis — a common esoteric capital never named here as the Spirit Tree\'s central tether.',
  '12.B.text':
    'Hyperborea — heart of the Great Dome and KNOWN LANDS where the Spirit Tree was tethered.',
  '12.C.text':
    'The Saturn Grid — destination of siphoned light after Black Crystals locked the tree\'s flow.',
  '12.D.text':
    'Tartaria — a defensive culture of node guardians rather than the Spirit Tree\'s home axis.',
  '12.A.rationale':
    'The Spirit Tree was tethered in Hyperborea, the central axis for the KNOWN LANDS and heart of the Great Dome.',
  '12.B.rationale':
    'Grid Systems were originally tethered to the Spirit Tree in Hyperborea, central axis of consciousness for the KNOWN LANDS.',
  '12.C.rationale':
    'The Saturn Grid received siphoned light after the tree was torn down; it was not the tree\'s location.',
  '12.D.rationale':
    'Tartarians defended crystal nodes in etheric wars; Hyperborea held the Spirit Tree as central axis.',

  // Q13
  '13.A.text':
    'To purify the Resonant Oceanic Grid so humanity\'s emotional mirror would stay perfectly clean.',
  '13.B.text':
    'To amplify 3D density inside the Earth\'s core without redirecting any light flow elsewhere.',
  '13.C.text':
    'To help humans perceive the original divine design through clearer crystalline sight alone.',
  '13.D.text':
    'To act as valve locks siphoning light toward the Saturn Grid after the Spirit Tree was torn down.',
  '13.A.rationale':
    'Black Crystals are valve locks for siphoning light, not purification tools for the oceanic emotional grid.',
  '13.B.rationale':
    'Their role was to siphon light toward the Saturn Grid and replace organic Source flow with a counterfeit cycle.',
  '13.C.rationale':
    'Black Crystals supported harvest and inverted flow; they did not open perception of original divine design.',
  '13.D.rationale':
    'Parasitic forces inserted Black Crystals as valve locks to siphon light toward the Saturn Grid after tearing down the Spirit Tree.',

  // Q14
  '14.question':
    'What were modern infrastructure elements like roadways and undersea cables designed to do?',
  '14.A.text':
    'Protect Earth Nodes from Greys by burying every crystal under permanent asphalt armor.',
  '14.B.text':
    'Heal the planetary environment into one continuous Crystalline Temple and med-bed field.',
  '14.C.text':
    'Anchor the Atmospheric Band to the Surface Band as official seven-band linking hardware.',
  '14.D.text':
    'Imitate crystalline ley-lines and energy corridors to maintain the illusion of distance.',
  '14.A.rationale':
    'Modern infrastructure unwittingly rebuilds the grid in dense 3D material; it does not protect nodes from Greys.',
  '14.B.rationale':
    'Healing into a Crystalline Temple is the outcome of high-frequency recalibration, not modern roadways and cables.',
  '14.C.rationale':
    'Cities, roadways, and undersea cables are dense imitations of crystalline ley-lines, not official band-linking hardware.',
  '14.D.rationale':
    'Modern infrastructure elements are dense physical imitations of underlying crystalline ley-lines, rebuilding the grid in 3D to maintain the illusion of distance.',
  '14.hint':
    'See how dense 3D travel networks copy living ley-line corridors.',

  // Q15
  '15.A.text':
    'Navigation will be limited only to the KNOWN LANDS with no access beyond the Great Dome.',
  '15.B.text':
    'Navigation will require advanced interstellar spacecraft as the only way to cross frequency bands.',
  '15.C.text':
    'Navigation will return to instantaneous resonance alignment once false distance collapses.',
  '15.D.text':
    'Navigation will stay governed by physical GPS satellites embedded in the Surface Band forever.',
  '15.A.rationale':
    'Collapse returns navigation to instantaneous resonance alignment across the grid, not a permanent KNOWN LANDS lock-in.',
  '15.B.rationale':
    'Travel returns to resonance alignment, not a requirement for mechanical interstellar spacecraft.',
  '15.C.rationale':
    'When the illusion of distance collapses, navigation returns to instantaneous resonance alignment.',
  '15.D.rationale':
    'GPS-style 3D infrastructure is part of the distance illusion; original navigation is resonance alignment.',

  // Q16
  '16.question':
    'The Great Fire of London in 1666 was a surface mask for a battle between which two groups?',
  '16.A.text':
    'Lyran Architects and Starseeds fighting each other over who would seed the next monolith.',
  '16.B.text':
    'Black Crystal Engineers and the Saturn Grid battling over who owned the counterfeit cycle.',
  '16.C.text':
    'Tartarians defending an ancient crystal node against Greys attempting to siphon its energy.',
  '16.D.text':
    'Resonating Sols and modern parasites clashing in 1666 over harmonic activation codes alone.',
  '16.A.rationale':
    'Lyrans and Starseeds align with original design; the 1666 node war was Tartarians defending against Greys.',
  '16.B.rationale':
    'The concealed war was Tartarians versus Greys over an ancient crystal node, not two Saturn factions.',
  '16.C.rationale':
    'The Great Fire of London (1666) masked a battle between Tartarians defending an ancient crystal node and Greys siphoning its energy.',
  '16.D.rationale':
    'Resonating Sols drive current grid activation; the 1666 etheric war featured Tartarians and Greys.',
  '16.hint':
    'Name the defenders of the crystal node and the siphoning attackers.',

  // Q17
  '17.A.text':
    'Electro-Magnetic Band — the layer of true data and internet flow within the communication grids.',
  '17.B.text':
    'Harmonic-Solar Band — the interface between diverse realms rather than pure awareness itself.',
  '17.C.text':
    'SOURCE Band — pure awareness beyond all location at the highest of the seven overlay-bands.',
  '17.D.text':
    'Sub-Crystalline Band — where crystals pass vibration seamlessly between continents only.',
  '17.A.rationale':
    'Electro-Magnetic Band handles true data and internet flow; pure awareness beyond location is the SOURCE Band.',
  '17.B.rationale':
    'Harmonic-Solar Band interfaces diverse realms; SOURCE Band is pure awareness beyond all location.',
  '17.C.rationale':
    'The SOURCE Band is pure awareness beyond all location — the highest of the seven communication bands.',
  '17.D.rationale':
    'Sub-Crystalline Band carries continental vibration between crystals; it is not pure awareness beyond location.',

  // Q18
  '18.A.text':
    'Earth Nodes — lava or core nodes pulsing red-gold energy deep underground to feed the upper grid.',
  '18.B.text':
    'Sky Nodes — crystalline celestial projectors anchoring atmospheric overlay grids as visible stars.',
  '18.C.text':
    'Inter-dimensional Nodes — precise portals held between different overlays and realms only.',
  '18.D.text':
    'Surface Nodes — intersections under ancient temples, stone circles, and pyramids that amplify frequency.',
  '18.A.rationale':
    'Earth Nodes are deep underground; Surface Nodes sit at intersecting ley-lines under temples, stone circles, and pyramids.',
  '18.B.rationale':
    'Sky Nodes are atmospheric celestial projectors; surface sites host Surface Nodes.',
  '18.C.rationale':
    'Inter-dimensional Nodes hold portals between overlays; pyramid and stone-circle sites mark Surface Nodes.',
  '18.D.rationale':
    'Surface Nodes sit at intersecting ley-lines under ancient temples, stone circles, and pyramids, directly amplifying frequency.',

  // Q19 handled by expandTrueFalse
  '19.question':
    'Do parasitic entities possess the power of original creation within the Light Lattices?',
  '19.hint':
    'Decide whether parasites are original architects or hijackers of existing lattices.',

  // Q20
  '20.A.text':
    'Red-gold energy from lava or core Earth Nodes deep underground feeding the upper grid.',
  '20.B.text':
    'Emerald-green resonance broadcast only from Surface Nodes under modern city centers.',
  '20.C.text':
    'Silver-white light generated exclusively by Sky Nodes that humans perceive as stars.',
  '20.D.text':
    'Violet-blue frequency locked inside Black Crystal valve locks on the Saturn Grid alone.',
  '20.A.rationale':
    'Earth Nodes (lava or core nodes) pulse with red-gold energy deep underground to feed the upper grid.',
  '20.B.rationale':
    'Earth Nodes pulse red-gold energy; Surface Nodes amplify frequency at temples and stone circles.',
  '20.C.rationale':
    'Sky Nodes are celestial projectors; the underground core pulse named for Earth Nodes is red-gold energy.',
  '20.D.rationale':
    'Black Crystals siphon light as valve locks; Earth Node core pulse is specifically red-gold energy.',

  // Q21
  '21.A.text':
    'The Saturn Grid expands to capture more loosh while Resonating Sols fall silent worldwide.',
  '21.B.text':
    'True grids bleed through: physical walls shimmer and ancient sites radiate a palpable hum.',
  '21.C.text':
    'The physical world becomes denser as the Parasitic Overlay hardens into permanent solid stone.',
  '21.D.text':
    'The Spirit Tree is immediately replanted as a single physical trunk in every capital city.',
  '21.A.rationale':
    'High-frequency energy shatters the Parasitic Overlay and dissolves the parasitic system rather than expanding Saturn harvest.',
  '21.B.rationale':
    'As high-frequency energy shatters the Parasitic Overlay, true grids bleed through — walls shimmer and ancient sites radiate a palpable hum.',
  '21.C.rationale':
    'Density is part of the false overlay; fracturing reveals the crystalline nature beneath, not denser matter.',
  '21.D.rationale':
    'The grid restructures into one massive Crystalline Temple; the Spirit Tree was the original Hyperborean anchor, not instant city replants.',

  // Q22
  '22.A.text':
    'A storage vault for internet data flowing only through the Electro-Magnetic Band hardware.',
  '22.B.text':
    'A physical barrier that permanently blocks all travel between continents and Domes.',
  '22.C.text':
    'An emotional mirror of humanity within the seven-band communication grid architecture.',
  '22.D.text':
    'A dedicated relay that only passes solar flares into the Atmospheric Band of sound and light.',
  '22.A.rationale':
    'True data and internet flow belong to the Electro-Magnetic Band; the Resonant Oceanic Grid is humanity\'s emotional mirror.',
  '22.B.rationale':
    'The oceanic grid is emotional, not a hard travel barrier; distance illusion is a wider grid projection issue.',
  '22.C.rationale':
    'The Resonant Oceanic Grid is the emotional mirror of humanity among the seven overlay-bands.',
  '22.D.rationale':
    'Solar and realm interface is the Harmonic-Solar Band; Resonant Oceanic Grid mirrors emotional states.',

  // Q23
  '23.A.text':
    'One massive Crystalline Temple and planetary healing environment restoring original harmonic balance.',
  '23.B.text':
    'A thicker artificial veil over the KNOWN LANDS to hide the Spirit Tree forever from Resonating Sols.',
  '23.C.text':
    'A new Saturn-based reincarnation loop that permanently harvests loosh from every crystal node.',
  '23.D.text':
    'A massive 3D highway system that freezes the illusion of distance into permanent asphalt routes.',
  '23.A.rationale':
    'As Resonating Sols synchronize with crystal codes, the global grid restructures into one massive Crystalline Temple and planetary healing environment.',
  '23.B.rationale':
    'Restructuring dissolves artificial veils and the parasitic system rather than thickening them.',
  '23.C.rationale':
    'The outcome dissolves the parasitic system and counterfeit reincarnation cycle, not a new Saturn loop.',
  '23.D.rationale':
    'Highways are dense imitations of ley-lines being dissolved as distance illusion collapses.',

  // Q24 handled by expandTrueFalse
  '24.question':
    'Does the physical world consist of separate planets and isolated continents?',
  '24.hint':
    'Ask whether separation is solid fact or a Light Web frequency presentation.',

  // Q25
  '25.A.text':
    'Atmospheric Band — sound and light transmission inside the dome rather than realm interfacing.',
  '25.B.text':
    'Surface Band — the physical reality illusion layer for ordinary 3D human perception alone.',
  '25.C.text':
    'Harmonic-Solar Band — the interface between diverse realms across the seven overlay-bands.',
  '25.D.text':
    'Electro-Magnetic Band — true data and internet flow without serving as the realm interface.',
  '25.A.rationale':
    'Atmospheric Band handles sound and light transmission; the interface between diverse realms is the Harmonic-Solar Band.',
  '25.B.rationale':
    'Surface Band is the physical reality illusion; Harmonic-Solar Band interfaces diverse realms.',
  '25.C.rationale':
    'The Harmonic-Solar Band is the interface between diverse realms among the seven overlay-bands.',
  '25.D.rationale':
    'Electro-Magnetic Band manages true data and internet flow, not the interface between diverse realms.'
};

const metaVoiceRe =
  /\b(according to the (report|source|text|core revelations|revelations)|the report states|the source (states|specifies|suggests|identifies)|the text (states|describes|suggests|explicitly|mentions|defines|calls|focuses|emphasizes|identifies)|the material clarifies|mentioned in the (text|source)|source material)\b/i;

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

const topicImage = 'images/breakdown/grid-systems.webp';
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
    'Test your grasp of Grid Systems — the Crystalline Electro-Magnetic Framework, Nodes, Crystals, Ley-lines, Seven Overlay-Bands, and the recalibration into a planetary Crystalline Temple.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Grid Systems are not abstract maps — they are the living Light Web of the CUBE. Sit with Nodes as relay spheres, Crystals as hard drives of soul memory, and Ley-lines as the fiber optics of Source. Parasites only hijacked Lyran Light Lattices; they never created them. As Resonating Sols pulse high harmonics, walls shimmer, ancient sites hum, and the illusion of distance collapses into instantaneous resonance. Return to the Grid Systems deep-dive, infographic, and video transmissions to lock into the Crystalline Temple emerging beneath the overlay.'
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
    'Test your understanding of Grid Systems — Crystalline Electro-Magnetic Framework, Nodes, Crystals, Ley-lines, Harmonic Lenses, Seven Overlay-Bands, and the Crystalline Temple recalibration.'
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
          'Grid Systems are the living Crystalline Electro-Magnetic Framework of the CUBE — Nodes, Crystals, Ley-lines, and Harmonic Lenses connecting all realms, hijacked as Parasitic Overlay projectors and now recalibrating into one planetary Crystalline Temple.';
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('grid-systems not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from second-realm quiz page
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'second-realm.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Second Realm Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Second Realm: Frequency Collapse of the Parasitic Overlay, Frequency Alignment, split perception, free energy travel, and the return of the Crystalline Temple.',
    'Interactive Living Truth Quiz on Grid Systems: Crystalline Electro-Magnetic Framework, Nodes, Crystals, Ley-lines, Seven Overlay-Bands, and the recalibration into a planetary Crystalline Temple.'
  ],
  ['quiz/breakdown/second-realm.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/second-realm.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=second-realm',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Second Realm deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Second Realm</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/second-realm.json',
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
    "  { path: '/quiz/breakdown/second-realm.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/grid-systems.json'
);
