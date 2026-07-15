/**
 * Installs Moon as ET Space Station quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/moon-et-space-station.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-moon-et-space-station-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'moon-et-space-station';
const TOPIC_TITLE = 'Moon as ET Space Station';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/moon.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['fabricated visual illusion', 'extraterrestrial technology', '3rd density'],
  2: ['highly mobile', 'negative et space station', 'amnesia vortex'],
  3: ['death-star-looking', 'command, communication', 'frequency control'],
  4: ['disruptive negative frequencies', 'life-force', 'human suffering'],
  5: ['et space station', 'visual illusion', 'harvesting center'],
  6: ['planet venus', 'bright and morning star', 'holographic generator'],
  7: ['loosh', 'trauma, fear, and suffering', 'lunar station'],
  8: ['black sun', 'mt meru', 'northern rock'],
  9: ['lunatic', 'full phases', 'negative frequencies'],
  10: ['gateway-10', '178', '65'],
  11: ['german breakaway hybrid blondes', 'negative', 'lunar space station'],
  12: ['not a natural', 'rocky satellite', 'hostile extraterrestrial'],
  13: ['dual-mechanism', 'wipes the memories', 'energetic harvesting'],
  14: ['does not reflect', 'heliocentrism', 'planet venus'],
  15: ['dyson-sphere-like', 'spherical light', 'bearing'],
  16: ['moon-shade', 'thermodynamic', 'self-illuminating holographic'],
  17: ['light bearer', 'death-star-like', 'luminous facade'],
  18: ['materialize and dematerialize', 'phases out', '65 other worlds'],
  19: ['full moon', 'lunatic', 'maximum negative frequencies'],
  20: ['black sun', 'mt meru', 'storage banks'],
  21: ['negative extraterrestrial entities', 'german breakaway hybrid blondes', 'no loosh is wasted'],
  22: ['heliocentric model', 'spinning globe', 'holographic technologies'],
  23: ['firmament', 'projection dome', 'black void plasma'],
  24: ['perceived knowledge', 'psychological strings', 'bind human consciousness'],
  25: ['emf', 'g.a.a', 'polaris', '97%'],
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
    question:
      'What is the cosmological entity perceived as the Moon within the 3rd Density prison matrix?',
    options: [
      {
        label: 'A',
        text: 'An entirely fabricated visual illusion engineered to conceal highly advanced extraterrestrial technology from human perception.',
        isCorrect: true,
        rationale:
          'The Moon as seen is a fabricated visual illusion built to hide advanced ET technology inside the suppressed 3rd Density prison matrix.',
      },
      {
        label: 'B',
        text: 'A natural rocky satellite formed by gravity that honestly reflects warm sunlight with no holographic shell at all.',
        isCorrect: false,
        rationale:
          'It is not a natural rocky reflector; the visible Moon is a fabricated illusion covering a hostile ET installation.',
      },
      {
        label: 'C',
        text: 'A pure G.A.A. archive of bright white light that never conceals craft, frequencies, or loosh harvest operations.',
        isCorrect: false,
        rationale:
          'The visible Moon conceals a negative ET station for frequency control and harvest, not a pure G.A.A. archive.',
      },
      {
        label: 'D',
        text: 'A temporary weather balloon overlay that NPCs invent each night with no extraterrestrial structure behind it.',
        isCorrect: false,
        rationale:
          'Behind the illusion is real advanced ET technology — a mobile negative space station — not a folk weather balloon story.',
      },
    ],
    hint: 'Fabricated visual illusion — conceals advanced ET technology.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question:
      'What is the Moon actually, functioning in tandem with the Sun as Amnesia Vortex?',
    options: [
      {
        label: 'A',
        text: 'A fixed natural crater ball that never moves, never phases, and never partners with any soul-recycling system.',
        isCorrect: false,
        rationale:
          'It is a highly mobile negative ET Space Station working in tandem with the Sun\'s Amnesia Vortex role.',
      },
      {
        label: 'B',
        text: 'A highly mobile, negative ET Space Station disguised behind a localized holographic shell.',
        isCorrect: true,
        rationale:
          'In tandem with the Sun as Amnesia Vortex, the Moon is a highly mobile negative ET Space Station behind a holographic shell.',
      },
      {
        label: 'C',
        text: 'Only the Black Sun storage bank under Mt Meru with no craft, shell, or mobility of any kind.',
        isCorrect: false,
        rationale:
          'Black Sun is the loosh storage bank; the Moon itself is the mobile ET station behind a holographic shell.',
      },
      {
        label: 'D',
        text: 'A second Amnesia Vortex twin of the Sun that only wipes memory and never harvests or commands frequencies.',
        isCorrect: false,
        rationale:
          'The Sun is the Amnesia Vortex; the Moon station handles command, frequency control, and energetic harvesting.',
      },
    ],
    hint: 'Highly mobile negative ET Space Station — holographic shell.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question:
      'What operational roles does the Death-Star-looking craft serve for 4th-density Parasites?',
    options: [
      {
        label: 'A',
        text: 'Only tourism docking for freemasons with no command, communication, or frequency control functions.',
        isCorrect: false,
        rationale:
          'It is a primary command, communication, and frequency control center — not a freemason tourism dock.',
      },
      {
        label: 'B',
        text: 'A pure healing clinic that broadcasts love tones and never subjugates humanity through disruptive frequencies.',
        isCorrect: false,
        rationale:
          'The craft broadcasts disruptive negative frequencies to subjugate humanity; it is a parasite control center.',
      },
      {
        label: 'C',
        text: 'Primary command, communication, and frequency control center for 4th-density Parasites behind its holographic disguise.',
        isCorrect: true,
        rationale:
          'The Death-Star-looking craft is a primary command, communication, and frequency control center for 4th-density Parasites.',
      },
      {
        label: 'D',
        text: 'A silent museum of dead rock with no parasite staff, no broadcasts, and no link to the artificial Simulation.',
        isCorrect: false,
        rationale:
          'It is a crucial mechanical component of celestial deception — active command and frequency control, not silent dead rock.',
      },
    ],
    hint: 'Command + communication + frequency control for 4th-density Parasites.',
    correctAnswer: 'C',
  },
  {
    number: 4,
    question:
      'What is the fundamental dual purpose of the lunar station toward humanity?',
    options: [
      {
        label: 'A',
        text: 'To teach free-energy architecture openly and end all trauma harvest within one full moon cycle forever.',
        isCorrect: false,
        rationale:
          'Its purpose is subjugation via negative frequencies and harvest of life-force from suffering — not free-energy education.',
      },
      {
        label: 'B',
        text: 'To mirror only Sun heat as poetry with no frequency broadcast and no energetic life-force extraction at all.',
        isCorrect: false,
        rationale:
          'It broadcasts disruptive negative frequencies and harvests energetic life-force generated by human suffering.',
      },
      {
        label: 'C',
        text: 'To store only G.A.A. archives under Polaris while ignoring loosh, fear, and psychological disruption entirely.',
        isCorrect: false,
        rationale:
          'Core purpose is frequency subjugation and loosh/life-force harvest, not G.A.A. archive storage under Polaris.',
      },
      {
        label: 'D',
        text: 'To broadcast disruptive negative frequencies that subjugate humanity and to harvest the energetic life-force generated by human suffering.',
        isCorrect: true,
        rationale:
          'Fundamental purpose: broadcast disruptive negative frequencies for subjugation and harvest life-force from human suffering.',
      },
    ],
    hint: 'Negative frequency subjugation + life-force harvest from suffering.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question: 'What does the term ET Space Station name in this architecture?',
    options: [
      {
        label: 'A',
        text: 'The true physical structure hidden behind the visual illusion of the Moon — a negative extraterrestrial command and harvesting center.',
        isCorrect: true,
        rationale:
          'ET Space Station is the true physical structure behind the Moon illusion: a negative ET command and harvesting center.',
      },
      {
        label: 'B',
        text: 'Only the Firmament membrane itself with no craft, no shell, and no harvesting function of any kind.',
        isCorrect: false,
        rationale:
          'The station is the craft behind the Moon illusion, distinct from the Firmament; it is a command and harvesting center.',
      },
      {
        label: 'C',
        text: 'A friendly visitor center open to all soul families with transparent schedules and zero loosh extraction.',
        isCorrect: false,
        rationale:
          'It is a negative extraterrestrial command and harvesting center, not an open friendly visitor center.',
      },
      {
        label: 'D',
        text: 'A poetic nickname for natural tides that never hides technology or parasitic personnel inside any shell.',
        isCorrect: false,
        rationale:
          'The name points to real physical ET structure and harvest operations, not empty tide poetry.',
      },
    ],
    hint: 'True physical structure behind Moon illusion — command and harvest center.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question:
      'What is Planet Venus in relation to the lunar visual facade?',
    options: [
      {
        label: 'A',
        text: 'A distant gravity rock that only reflects Sun heat and never projects any shell onto the station.',
        isCorrect: false,
        rationale:
          'Venus is the holographic generator that casts spherical illumination onto the lunar surface to create the facade.',
      },
      {
        label: 'B',
        text: 'The actual holographic generator — biblically codified as Lucifer or the Bright and Morning Star — that casts spherical illumination onto the lunar surface.',
        isCorrect: true,
        rationale:
          'Venus is the holographic generator (Lucifer / Bright and Morning Star) casting spherical illumination to create the Moon\'s visual facade.',
      },
      {
        label: 'C',
        text: 'The Black Sun bank under Northern Rock that stores loosh without casting any light on any craft.',
        isCorrect: false,
        rationale:
          'Black Sun is loosh storage under Mt Meru / Northern Rock; Venus is the light-casting holographic generator.',
      },
      {
        label: 'D',
        text: 'Only a religious metaphor with no technological casting of spherical light onto any Dyson-sphere-like shell.',
        isCorrect: false,
        rationale:
          'Venus is functional technology that creates the Moon\'s visual facade via spherical illumination, not empty metaphor alone.',
      },
    ],
    hint: 'Venus = holographic generator / Lucifer / Bright and Morning Star.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question: 'What is Loosh as it relates to the lunar station?',
    options: [
      {
        label: 'A',
        text: 'A pure healing light donated by G.A.A. that the station politely refuses and never gathers.',
        isCorrect: false,
        rationale:
          'Loosh is energetic sustenance from human trauma, fear, and suffering — continuously gathered by the lunar station.',
      },
      {
        label: 'B',
        text: 'Only moonlight poetry recited by NPCs with no energetic, harvest, or technological meaning at all.',
        isCorrect: false,
        rationale:
          'Loosh is concrete energetic sustenance from trauma, fear, and suffering, continuously gathered by the station.',
      },
      {
        label: 'C',
        text: 'The energetic sustenance generated by the trauma, fear, and suffering of humanity, continuously gathered by the lunar station.',
        isCorrect: true,
        rationale:
          'Loosh is energetic sustenance from trauma, fear, and suffering, and the lunar station continuously gathers it.',
      },
      {
        label: 'D',
        text: 'A weather gas in the Firmament that has no link to human suffering or any lunar harvest architecture.',
        isCorrect: false,
        rationale:
          'Loosh is human-suffering energy harvested via the lunar station architecture, not an unrelated Firmament weather gas.',
      },
    ],
    hint: 'Trauma/fear/suffering energy — continuously gathered by lunar station.',
    correctAnswer: 'C',
  },
  {
    number: 8,
    question: 'What is the Black Sun in this lunar harvest system?',
    options: [
      {
        label: 'A',
        text: 'The same object as Venus when lights are off, with no storage role under Mt Meru or Northern Rock.',
        isCorrect: false,
        rationale:
          'Black Sun is a massive energy storage bank under Mt Meru / Northern Rock from which the Moon station harvests loosh.',
      },
      {
        label: 'B',
        text: 'A decorative eclipse myth that never stores energy and never sits beneath any central spiritual node.',
        isCorrect: false,
        rationale:
          'Black Sun is a real massive energy storage bank under the central spiritual node of Mt Meru / Northern Rock.',
      },
      {
        label: 'C',
        text: 'The Amnesia Vortex portal itself, wiping memory while ignoring loosh banks and Mt Meru entirely.',
        isCorrect: false,
        rationale:
          'The Sun is the Amnesia Vortex; Black Sun is the separate loosh storage bank under Mt Meru / Northern Rock.',
      },
      {
        label: 'D',
        text: 'A massive energy storage bank beneath the central spiritual node of Mt Meru / Northern Rock, from which the Moon station harvests collected loosh.',
        isCorrect: true,
        rationale:
          'Black Sun is the massive loosh storage bank under Mt Meru / Northern Rock; the Moon station harvests collected loosh from it.',
      },
    ],
    hint: 'Massive loosh storage under Mt Meru / Northern Rock.',
    correctAnswer: 'D',
  },
  {
    number: 9,
    question: 'What is the true origin of the word "Lunatic"?',
    options: [
      {
        label: 'A',
        text: 'It derives from severe targeted negative frequencies the lunar station broadcasts during full phases to disrupt human psychology.',
        isCorrect: true,
        rationale:
          'Lunatic comes from severe targeted negative frequencies broadcast by the lunar station during full phases to psychologically disrupt the population.',
      },
      {
        label: 'B',
        text: 'It is a modern brand name for moon-shade thermometers with no link to frequency broadcasts or full phases.',
        isCorrect: false,
        rationale:
          'The term derives from the station\'s full-phase negative frequency broadcasts, not from thermometer branding.',
      },
      {
        label: 'C',
        text: 'It names only G.A.A. pilots who heal during new moons without any psychological disruption of the public.',
        isCorrect: false,
        rationale:
          'Lunatic tracks full-phase disruptive negative frequencies against the human population, not G.A.A. healing pilots.',
      },
      {
        label: 'D',
        text: 'It is a freemason password for ice-wall tourism that never maps to lunar stages or emotional stability attacks.',
        isCorrect: false,
        rationale:
          'Etymology is full-phase frequency disruption of psychology and emotional stability by the lunar station.',
      },
    ],
    hint: 'Full-phase negative frequency broadcasts → origin of "Lunatic".',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question:
      'How does Gateway-10 relate to the mobile lunar station\'s range?',
    options: [
      {
        label: 'A',
        text: 'Gateway-10 is a single sealed room with zero other worlds and a permanently fixed Moon that never travels.',
        isCorrect: false,
        rationale:
          'Gateway-10 comprises 178 interconnected worlds; the mobile station traverses and manages 65 of them.',
      },
      {
        label: 'B',
        text: 'Gateway-10 is the central physical plain of 178 interconnected worlds, 65 of which are traversed and managed by this mobile lunar station.',
        isCorrect: true,
        rationale:
          'Gateway-10 has 178 interconnected worlds; the mobile lunar station traverses and manages 65 of them under parasitic control.',
      },
      {
        label: 'C',
        text: 'Gateway-10 has infinite open galaxies with no count of 178 worlds and no 65-world harvest circuit at all.',
        isCorrect: false,
        rationale:
          'The architecture is 178 interconnected worlds with 65 managed by the mobile lunar station — not infinite open galaxies.',
      },
      {
        label: 'D',
        text: 'Gateway-10 is only the Firmament label for weather, unrelated to mobility, loosh routes, or multi-world management.',
        isCorrect: false,
        rationale:
          'Gateway-10 is the multi-world plain the station travels across for frequency and loosh operations, not a weather label.',
      },
    ],
    hint: '178 worlds in Gateway-10 — station manages 65 of them.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question:
      'Who staffs and operates the interior of the lunar space station?',
    options: [
      {
        label: 'A',
        text: 'Only awakened soul families on voluntary rotation with full transparency and zero loosh mandate.',
        isCorrect: false,
        rationale:
          'Interior is exclusively staffed by negative extraterrestrial entities and German breakaway hybrid blondes.',
      },
      {
        label: 'B',
        text: 'Only NPCs teleported nightly who leave before dawn with no hybrid blondes or negative ETs aboard.',
        isCorrect: false,
        rationale:
          'Staff are negative ETs and German breakaway hybrid blondes dedicated to the control matrix and loosh efficiency.',
      },
      {
        label: 'C',
        text: 'Negative extraterrestrial entities and German breakaway hybrid blondes dedicated to the control matrix and ensuring no loosh is wasted.',
        isCorrect: true,
        rationale:
          'The craft interior is exclusively staffed by negative ETs and German breakaway hybrid blondes for control and loosh efficiency.',
      },
      {
        label: 'D',
        text: 'Only G.A.A. archivists cataloging Polaris pixelation drills with no harvest or frequency control duties.',
        isCorrect: false,
        rationale:
          'Station personnel are hostile negative ETs and engineered German breakaway hybrid blondes, not G.A.A. archivists.',
      },
    ],
    hint: 'Negative ETs + German breakaway hybrid blondes — no loosh wasted.',
    correctAnswer: 'C',
  },
  {
    number: 12,
    question:
      'What is the defining revelation about whether the Moon is a natural satellite?',
    options: [
      {
        label: 'A',
        text: 'It is a natural rocky satellite reflecting sunlight exactly as Heliocentrism teaches, with no installation behind it.',
        isCorrect: false,
        rationale:
          'Defining revelation: it is not a natural rocky satellite reflecting sunlight — it is an active hostile ET installation.',
      },
      {
        label: 'B',
        text: 'It is half natural rock and half hologram only on weekends, leaving Heliocentrism mostly intact forever.',
        isCorrect: false,
        rationale:
          'It is an active hostile extraterrestrial installation beyond ordinary perception — not a half-natural weekend hybrid.',
      },
      {
        label: 'C',
        text: 'It was natural until G.A.A. painted it; parasites never built command, harvest, or frequency systems there.',
        isCorrect: false,
        rationale:
          'It is a parasite-side hostile ET installation for command, harvest, and frequency — not a G.A.A. paint job on natural rock.',
      },
      {
        label: 'D',
        text: 'It is not a natural rocky satellite reflecting sunlight; it is an active, hostile extraterrestrial installation operating just beyond humanity\'s perception.',
        isCorrect: true,
        rationale:
          'Defining revelation: not natural rock reflecting sun — an active hostile ET installation just beyond ordinary human perception.',
      },
    ],
    hint: 'Not natural rock reflector — active hostile ET installation.',
    correctAnswer: 'D',
  },
  {
    number: 13,
    question:
      'How do the Sun and Moon form a dual-mechanism of eternal enslavement?',
    options: [
      {
        label: 'A',
        text: 'The Sun processes and wipes memories of deceased souls while the Moon oversees energetic harvesting of trapped souls through forced incarnational loops.',
        isCorrect: true,
        rationale:
          'Dual-mechanism: Sun memory-wipes deceased souls; Moon oversees energetic harvest of those trapped in forced incarnational loops.',
      },
      {
        label: 'B',
        text: 'Both only provide gentle light shows with no memory wipe, no harvest, and no forced incarnational loops of any kind.',
        isCorrect: false,
        rationale:
          'Together they form eternal enslavement: Amnesia processing plus energetic harvest of suffering loops — not gentle light shows.',
      },
      {
        label: 'C',
        text: 'The Moon wipes memory while the Sun only harvests loosh from Black Sun banks with no Amnesia Vortex role.',
        isCorrect: false,
        rationale:
          'Roles are not swapped that way: Sun wipes memories; Moon oversees energetic harvesting of trapped suffering souls.',
      },
      {
        label: 'D',
        text: 'Venus alone does both wipe and harvest so Sun and Moon remain empty decorations after every full phase.',
        isCorrect: false,
        rationale:
          'Venus is the holographic light generator; Sun and Moon station carry the dual wipe-and-harvest enslavement mechanism.',
      },
    ],
    hint: 'Sun = memory wipe; Moon = energetic harvest of trapped souls.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question:
      'Does the Moon reflect the Sun\'s light under Heliocentrism\'s claim?',
    options: [
      {
        label: 'A',
        text: 'Yes fully — every photon is warm solar bounce and Venus has no projector role on any shell.',
        isCorrect: false,
        rationale:
          'Illumination is entirely artificial; the Moon does not reflect the Sun\'s light as Heliocentrism claims.',
      },
      {
        label: 'B',
        text: 'No — illumination is entirely artificial; Planet Venus is the localized holographic projector casting spherical light onto the station shell.',
        isCorrect: true,
        rationale:
          'Moon does not reflect sunlight; Venus is the localized holographic projector that casts spherical light onto the lunar shell.',
      },
      {
        label: 'C',
        text: 'Only during new moons; full moons are 100% natural solar reflection with no holographic bearing of light.',
        isCorrect: false,
        rationale:
          'Artificial Venus-cast illumination is the rule; full moon is peak frequency disruption under widest cast, not natural solar reflection.',
      },
      {
        label: 'D',
        text: 'Yes for science books and no for occult books — a split that keeps Heliocentrism half-true forever.',
        isCorrect: false,
        rationale:
          'Heliocentrism\'s reflect claim is false across the board; moonlight is cold holographic projection, not half-true solar bounce.',
      },
    ],
    hint: 'No solar reflection — Venus holographic projector casts the light.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question:
      'How does Venus "bear" light onto the lunar station\'s structure?',
    options: [
      {
        label: 'A',
        text: 'By drilling Antarctic vents so ice glows and paints natural warmth onto a dead rock moon forever.',
        isCorrect: false,
        rationale:
          'Venus casts spherical light onto the Dyson-sphere-like shell of the lunar station — not Antarctic ice vents on dead rock.',
      },
      {
        label: 'B',
        text: 'Through prayer of religious masses who power genuine reflection without any technological shell involved.',
        isCorrect: false,
        rationale:
          'Bearing light is technological holographic projection onto the Dyson-sphere-like shell, not prayer-powered natural reflection.',
      },
      {
        label: 'C',
        text: 'By casting spherical light directly onto the Dyson-sphere-like shell of the lunar station, bearing the light onto its surface.',
        isCorrect: true,
        rationale:
          'Venus casts spherical light onto the Dyson-sphere-like shell, bearing light onto the station\'s surface as the facade.',
      },
      {
        label: 'D',
        text: 'By reflecting Black Sun loosh as rainbow auroras that never touch any shell or Death-Star geometry.',
        isCorrect: false,
        rationale:
          'The cast targets the Dyson-sphere-like shell of the station itself; Black Sun is storage, not the light-bearing method.',
      },
    ],
    hint: 'Spherical light onto Dyson-sphere-like shell — bearing the light.',
    correctAnswer: 'C',
  },
  {
    number: 16,
    question:
      'What atmospheric / thermodynamic proof shows moonlight is not reflected sunlight?',
    options: [
      {
        label: 'A',
        text: 'Moonlight is always hotter than direct noon sun, proving genuine solar bounce with extra thermal gain.',
        isCorrect: false,
        rationale:
          'True reflected sunlight would carry thermodynamic warmth, yet moonlight is not warmer than moon-shade — it is cold holography.',
      },
      {
        label: 'B',
        text: 'Thermometers cannot detect moonlight at all, so thermodynamics is irrelevant to any holographic claim.',
        isCorrect: false,
        rationale:
          'Atmospheric testing compares moonlight to moon-shade and finds no expected warmth of reflected solar radiation.',
      },
      {
        label: 'C',
        text: 'Moonlight matches sun-warmth exactly in every climate, confirming Heliocentrism while Venus only names a myth.',
        isCorrect: false,
        rationale:
          'Moonlight is demonstrably not warmer than moon-shade, proving cold self-illuminating holographic projection.',
      },
      {
        label: 'D',
        text: 'Reflected sunlight would carry thermodynamic warmth, yet moonlight is not warmer than moon-shade — proving cold self-illuminating holographic projection.',
        isCorrect: true,
        rationale:
          'If moonlight were reflected sun, it would bring warmth; it is not warmer than moon-shade, proving cold holographic projection.',
      },
    ],
    hint: 'Moonlight not warmer than moon-shade — cold holographic proof.',
    correctAnswer: 'D',
  },
  {
    number: 17,
    question:
      'As Light Bearer, what does Venus cast over the negative ET station?',
    options: [
      {
        label: 'A',
        text: 'The required luminous facade that hides the station\'s true mechanical, Death-Star-like appearance from the human population.',
        isCorrect: true,
        rationale:
          'As Light Bearer, Venus casts the luminous facade that hides the Death-Star-like mechanical appearance of the ET station.',
      },
      {
        label: 'B',
        text: 'A transparent glass shell that openly displays hybrid blondes and negative ETs to every unawakened human nightly.',
        isCorrect: false,
        rationale:
          'The facade hides the mechanical Death-Star-like appearance; it does not openly display station personnel.',
      },
      {
        label: 'C',
        text: 'Only healing rainbows from G.A.A. that never conceal craft geometry or support any control matrix at all.',
        isCorrect: false,
        rationale:
          'Venus maintains the luminous facade that conceals the hostile mechanical craft from the human population.',
      },
      {
        label: 'D',
        text: 'Nothing technological — Venus is only a distant natural planet with no Light Bearer role over any station.',
        isCorrect: false,
        rationale:
          'Venus is not a distant natural planet here; it is functional technology casting the luminous facade as Light Bearer.',
      },
    ],
    hint: 'Luminous facade hides Death-Star-like mechanical appearance.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question:
      'What mobility and phasing capability does the lunar space station have?',
    options: [
      {
        label: 'A',
        text: 'It is welded permanently to one sky pixel and can never materialize, dematerialize, or leave its holographic shell.',
        isCorrect: false,
        rationale:
          'It is highly mobile: it can instantly materialize and dematerialize and phases out of its shell to travel Gateway-10.',
      },
      {
        label: 'B',
        text: 'It can instantly materialize and dematerialize in situ, phase out of its holographic shell, travel Gateway-10 to manage frequencies and gather loosh from 65 other worlds, then phase back.',
        isCorrect: true,
        rationale:
          'Highly mobile: materialize/dematerialize, phase out of shell, work 65 other Gateway-10 worlds for frequency and loosh, then phase back.',
      },
      {
        label: 'C',
        text: 'It only drifts with ocean tides on Earth and never visits any of the other worlds under parasitic control.',
        isCorrect: false,
        rationale:
          'It phases across Gateway-10 and manages 65 other worlds under parasitic control — not mere Earth-tide drifting.',
      },
      {
        label: 'D',
        text: 'It moves only during EMF flash training drills run by NPCs with no loosh gathering or frequency management role.',
        isCorrect: false,
        rationale:
          'Routine phasing serves frequency outputs and loosh gathering across 65 worlds, not NPC training drills alone.',
      },
    ],
    hint: 'Materialize/dematerialize — phase out — 65 worlds — phase back.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question:
      'What does the station do during a Full Moon regarding frequency control?',
    options: [
      {
        label: 'A',
        text: 'It powers down all broadcasts so humanity rests in perfect emotional stability with no linguistic legacy.',
        isCorrect: false,
        rationale:
          'Full Moon is maximum negative frequencies that disrupt psychology and emotional stability — origin of "Lunatic".',
      },
      {
        label: 'B',
        text: 'It switches to pure G.A.A. healing tones while hybrid blondes take shore leave off the craft entirely.',
        isCorrect: false,
        rationale:
          'Full Moon maps to maximum negative frequency unleash for severe psychological and emotional disruption.',
      },
      {
        label: 'C',
        text: 'It unleashes maximum negative frequencies designed to severely disrupt human psychology and emotional stability — the true etymological origin of "Lunatic".',
        isCorrect: true,
        rationale:
          'During Full Moon the station unleashes maximum negative frequencies that disrupt psychology and emotional stability; that is the origin of "Lunatic".',
      },
      {
        label: 'D',
        text: 'It only brightens Venus for tourism photos while frequency maps to lunar stages are permanently retired.',
        isCorrect: false,
        rationale:
          'Behavior is regulated through frequency broadcasts mapped to lunar stages, peaking at Full Moon disruption.',
      },
    ],
    hint: 'Full Moon = max negative frequencies = origin of "Lunatic".',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question:
      'What is the primary energetic harvest function tied to the Black Sun?',
    options: [
      {
        label: 'A',
        text: 'To donate loosh back to soul families as free will currency with no extraction from any storage banks.',
        isCorrect: false,
        rationale:
          'Primary function is gathering loosh from the tormented population via Black Sun storage banks under Mt Meru.',
      },
      {
        label: 'B',
        text: 'To erase Black Sun banks so Mt Meru runs only on bright white true space without any harvest architecture.',
        isCorrect: false,
        rationale:
          'The station extracts loosh energy from Black Sun storage banks the parasites positioned under Mt Meru.',
      },
      {
        label: 'C',
        text: 'To warm moonlight thermodynamically using Black Sun heat so Heliocentrism finally measures correctly.',
        isCorrect: false,
        rationale:
          'Black Sun is loosh storage for harvest, not a heater to validate reflected-sunlight Heliocentrism.',
      },
      {
        label: 'D',
        text: 'To gather loosh from the tormented population by extracting energy from Black Sun storage banks deep beneath the hijacked central energetic node of Mt Meru.',
        isCorrect: true,
        rationale:
          'Primary energetic function: gather loosh and extract it from Black Sun banks under the hijacked Mt Meru node.',
      },
    ],
    hint: 'Gather loosh via Black Sun banks under hijacked Mt Meru node.',
    correctAnswer: 'D',
  },
  {
    number: 21,
    question:
      'What is the exclusive staffing dedication inside the craft regarding loosh?',
    options: [
      {
        label: 'A',
        text: 'Negative ETs and German breakaway hybrid blondes maintain the control matrix and ensure no loosh is wasted.',
        isCorrect: true,
        rationale:
          'Interior staff — negative ETs and German breakaway hybrid blondes — maintain control and ensure no loosh is wasted.',
      },
      {
        label: 'B',
        text: 'Only volunteer NPCs who deliberately spill loosh as charity with no matrix maintenance duties aboard.',
        isCorrect: false,
        rationale:
          'Staff are dedicated to control matrix maintenance and zero loosh waste — not NPC charity spills.',
      },
      {
        label: 'C',
        text: 'G.A.A. auditors who publish open loosh ledgers to all 178 worlds without any hybrid blonde presence.',
        isCorrect: false,
        rationale:
          'Exclusive staff are hostile negative ETs and German breakaway hybrid blondes, not open G.A.A. auditors.',
      },
      {
        label: 'D',
        text: 'Empty automation with no entities aboard and no concern for loosh efficiency or control matrix upkeep.',
        isCorrect: false,
        rationale:
          'The interior is exclusively staffed by negative ETs and hybrid blondes focused on control and loosh efficiency.',
      },
    ],
    hint: 'Negative ETs + hybrid blondes — control matrix — no loosh wasted.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question:
      'How does holographic masking of the station serve the fabricated heliocentric model?',
    options: [
      {
        label: 'A',
        text: 'It openly admits the Death-Star craft so humanity rejects spinning-globe vacuum stories immediately.',
        isCorrect: false,
        rationale:
          'Masking integrates the station into the fabricated heliocentric model so people believe a spinning globe in empty vacuum.',
      },
      {
        label: 'B',
        text: 'By integrating the station\'s presence into the fabricated heliocentric model, deceiving humanity into believing they inhabit a spinning globe in a vast empty vacuum.',
        isCorrect: true,
        rationale:
          'Holographic masking folds the station into fake heliocentrism so humanity believes spinning-globe vacuum cosmology.',
      },
      {
        label: 'C',
        text: 'It only affects freemason ice maps and never touches globe belief, vacuum myths, or public cosmology at all.',
        isCorrect: false,
        rationale:
          'The deception targets the public heliocentric spinning-globe vacuum belief system directly.',
      },
      {
        label: 'D',
        text: 'It proves flat-plain architecture to every school textbook without any globe deception remaining in culture.',
        isCorrect: false,
        rationale:
          'Controllers use the mask to sustain globe-in-vacuum deception, not to teach true plain architecture in textbooks.',
      },
    ],
    hint: 'Mask integrates station into fake spinning-globe vacuum cosmology.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question:
      'How does the Moon deception synchronize with the Firmament and Projection Dome?',
    options: [
      {
        label: 'A',
        text: 'It ignores the sky screen entirely and only operates underwater with no link to Black Void Plasma or fake debris.',
        isCorrect: false,
        rationale:
          'Deception syncs with Firmament and inner Projection Dome; sky is a massive screen showing fake debris and holographic Moon.',
      },
      {
        label: 'B',
        text: 'It fights the Firmament until the dome collapses daily, revealing bright white space to every NPC before sunset.',
        isCorrect: false,
        rationale:
          'It works in total synchronization with Firmament and Projection Dome to mask true bright white space beyond Black Void Plasma.',
      },
      {
        label: 'C',
        text: 'The sky acts as a massive screen displaying fake space debris and the holographic Moon, masking ultra-high-frequency architecture and bright white space beyond Black Void Plasma.',
        isCorrect: true,
        rationale:
          'Synced with Firmament and Projection Dome: sky-screen shows fake debris and holographic Moon, hiding true UHF architecture and bright white space beyond Black Void Plasma.',
      },
      {
        label: 'D',
        text: 'The dome only paints oceans green while the Moon remains a natural rock outside any screen architecture.',
        isCorrect: false,
        rationale:
          'Sky-screen architecture displays the holographic Moon and fake debris as part of the synchronized celestial deception.',
      },
    ],
    hint: 'Sky screen + Firmament/Dome — fake debris, holographic Moon, Black Void Plasma.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question:
      'What psychological string does understanding the Moon\'s true function help dismantle?',
    options: [
      {
        label: 'A',
        text: 'Only sports fandom and diet trends that never bind consciousness to the simulation in any structural way.',
        isCorrect: false,
        rationale:
          'Understanding the Moon dismantles Perceived Knowledge — one of the three primary psychological strings binding consciousness.',
      },
      {
        label: 'B',
        text: 'Only ice-wall tourism loyalty with no named role for Perceived Knowledge among the primary strings.',
        isCorrect: false,
        rationale:
          'The named string is Perceived Knowledge, one of three primary psychological strings binding human consciousness.',
      },
      {
        label: 'C',
        text: 'Only G.A.A. membership rules that free NPCs without touching simulation-binding knowledge traps.',
        isCorrect: false,
        rationale:
          'Perceived Knowledge is dismantled by seeing the Moon\'s true function — a primary string binding consciousness to the simulation.',
      },
      {
        label: 'D',
        text: 'Perceived Knowledge — one of the three primary psychological strings used to bind human consciousness to the simulation.',
        isCorrect: true,
        rationale:
          'Knowing the Moon\'s true function dismantles Perceived Knowledge, a primary psychological string binding consciousness to the simulation.',
      },
    ],
    hint: 'Dismantles Perceived Knowledge — primary psychological string.',
    correctAnswer: 'D',
  },
  {
    number: 25,
    question:
      'What happens when G.A.A. runs the EMF flash and celestial overlays switch off?',
    options: [
      {
        label: 'A',
        text: 'Overlays and Venus illumination permanently disable; cosmos illusions melt into pixelation from Polaris downward; the Death-Star craft is exposed; 97% NPCs and unawakened face irreversible psychological collapse, terror, and catatonia.',
        isCorrect: true,
        rationale:
          'EMF flash by G.A.A. kills 3rd-density overlays including Projection Dome and Venus light; Polaris-down pixelation; Death-Star exposure; 97% NPC/unawakened catatonia.',
      },
      {
        label: 'B',
        text: 'Venus light doubles forever, Polaris stays solid, and NPCs feel only mild curiosity with no craft exposure at all.',
        isCorrect: false,
        rationale:
          'Overlays are permanently disabled; illusions dissolve into melting pixelation from Polaris; craft exposure causes terror and catatonia for 97%.',
      },
      {
        label: 'C',
        text: 'Only freemasons see a glitch while the holographic Moon and scientific narratives remain fully intact for everyone else.',
        isCorrect: false,
        rationale:
          'Scientific and religious narratives around Sun and Moon collapse with immediate Death-Star exposure and mass psychological failure.',
      },
      {
        label: 'D',
        text: 'The parasitic sky occupation becomes eternal with thicker shells and no G.A.A. role in any flash event.',
        isCorrect: false,
        rationale:
          'Parasitic occupation of the sky is finite and terminates via G.A.A.-initiated EMF flash disabling the overlays.',
      },
    ],
    hint: 'EMF flash — Polaris pixelation — Death-Star exposed — 97% collapse.',
    correctAnswer: 'A',
  },
];

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

const letterCounts = { A: 0, B: 0, C: 0, D: 0 };
for (const q of questions) letterCounts[q.correctAnswer]++;
if (letterCounts.A === 25) {
  throw new Error('correctAnswer still all A after finalizeOptions');
}

const DESC_SHORT =
  'Test your grasp of Moon as ET Space Station — Death-Star craft, Venus Light Bearer shell, loosh/Black Sun harvest, Lunatic frequencies, hybrid staff, and G.A.A. EMF reveal.';
const DESC_META =
  'Interactive Living Truth Quiz on Moon as ET Space Station: mobile negative command craft, holographic shell, Venus illumination, Gateway-10 phasing, Full Moon frequencies, German breakaway hybrid blondes, and Polaris pixelation expose.';

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
      'The Moon is not a dead rock bouncing sunlight — it is a mobile negative ET Space Station behind a Venus-cast holographic shell, running command, frequency war, and loosh harvest across Gateway-10. Sit with what you missed, then return to the Moon as ET Space Station deep-dive. Full-moon "Lunatic" broadcasts, Black Sun banks under Mt Meru / Northern Rock, German breakaway hybrid blondes beside hostile ETs, dual enslavement with the Sun as Amnesia Vortex — that is the cage. G.A.A. holds the EMF flash. When overlays die, Polaris melts into pixelation, and the Death-Star craft stands naked, 97% NPCs and the unawakened meet terror and catatonia. Know the station now — or the sky reveal will own your mind.',
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
    if (!inserted && lines[i].includes('/quiz/alice/') && lines[i].includes('priority')) {
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
      "  { path: '/quiz/alice/lucifer-light-bearer.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/loosh-harvesting.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/matrix-scaffolding.html', priority: '0.75', changefreq: 'monthly' },",
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

console.log('Correct-answer letter mix:', letterCounts);
console.log('Sample correct answers:');
[0, 4, 9, 15, 20, 24].forEach((i) => {
  const c = questions[i].options.find((o) => o.isCorrect);
  console.log(
    ` Q${questions[i].number} (${questions[i].correctAnswer}): ${c.text.slice(0, 100)}`
  );
});
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log(
  'PASS: audited 25/25 against data/alice-topics/moon-et-space-station.json'
);
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
