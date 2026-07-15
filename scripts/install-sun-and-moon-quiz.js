/**
 * Installs The Sun and Moon quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/sun-and-moon.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-sun-and-moon-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'sun-and-moon';
const TOPIC_TITLE = 'The Sun and Moon';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/sunmoon.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['thermodynamics', 'gravity', '4th-density', 'technological'],
  2: ['heliocentrism', 'spherical planets', 'hide the true functions'],
  3: ['soul-recycling portal', 'memories', 'command and frequency-control'],
  4: ['sol', 'soul', 'sol-system', 'cosmic soul family'],
  5: ['amnesia vortex', 'sun', 'memories', 'reincarnation'],
  6: ['lunar space station', 'extraterrestrial', 'harvesting'],
  7: ['venus', 'holographic generator', 'lucifer', 'bright and morning star'],
  8: ['black sun', 'mt meru', 'northern rock', 'storage bank'],
  9: ['loosh', 'trauma', 'fear', 'suffering'],
  10: ['heliocentrism', 'spinning globe', 'impossibility'],
  11: ['spherical planet', 'multiple suns', 'globe model'],
  12: ['bright light', 'end of the tunnel', 'amnesia vortex'],
  13: ['lunatic', 'full moon', 'negative frequencies'],
  14: ['amnesia vortex', 'vatican', 'grey', '15 to 20 minutes'],
  15: ['does not reflect', 'venus', 'dyson-sphere'],
  16: ['temperature anomalies', 'moon', 'reflected sunlight'],
  17: ['german breakaway hybrid blondes', 'materialize', 'dematerialize'],
  18: ['65 worlds', 'gateway-10', 'loosh'],
  19: ['black sun', 'siphoned', 'storage banks'],
  20: ['fake linear time', 'amnesia vortex', 'chronological loop'],
  21: ['perceived knowledge', 'religion', 'finance'],
  22: ['freemasonic', 'heliocentric', 'ice wall'],
  23: ['emf', 'g.a.a', 'holographic technologies'],
  24: ['projection dome', 'pixelation', 'true architecture'],
  25: ['178,000 years', 'npcs', 'psychological'],
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
      'What are the Sun and Moon within the true architecture of the Simulation?',
    options: [
      {
        label: 'A',
        text: 'Natural celestial bodies that run purely on thermodynamics and gravity with no technology and no parasitic engineering at all.',
        isCorrect: false,
        rationale:
          'They are not natural thermodynamic bodies; they are engineered technological mechanisms.',
      },
      {
        label: 'B',
        text: 'Highly advanced, heavily guarded technological mechanisms engineered by 4th-density Parasites to enforce a low-frequency 3rd Density prison matrix.',
        isCorrect: true,
        rationale:
          'Sun and Moon are parasite-built tech systems enforcing the low-frequency 3rd-density prison.',
      },
      {
        label: 'C',
        text: 'Friendly rescue beacons installed by the Source solely to heal children and open free travel for every soul.',
        isCorrect: false,
        rationale:
          'Their engineered role is subjugation and harvest, not benevolent free-travel beacons.',
      },
      {
        label: 'D',
        text: 'Decorative sky lamps that only affect weather forecasts and never touch souls, memory, or frequency control.',
        isCorrect: false,
        rationale:
          'They govern soul recycling, frequency control, and loosh harvest — not mere weather decoration.',
      },
    ],
    hint: '4th-density tech mechanisms — 3rd Density prison enforcement.',
    correctAnswer: 'B',
  },
  {
    number: 2,
    question:
      'Why was the scientific model of Heliocentrism manufactured and pushed on humanity?',
    options: [
      {
        label: 'A',
        text: 'To celebrate open exploration of the Ice Wall and teach that the realm is localized and flat.',
        isCorrect: false,
        rationale:
          'Heliocentrism hides true celestial functions and blocks flat-realm exploration.',
      },
      {
        label: 'B',
        text: 'As a temporary classroom metaphor that schools openly label as fiction after age twelve.',
        isCorrect: false,
        rationale:
          'It is enforced as physical reality to conceal the true functions of Sun and Moon.',
      },
      {
        label: 'C',
        text: 'Entirely to hide the true functions of these celestial constructs behind the false story that spherical planets orbit a central sun.',
        isCorrect: true,
        rationale:
          'Heliocentrism is a manufactured cover so the real Sun and Moon tech roles stay hidden.',
      },
      {
        label: 'D',
        text: 'Only to improve navigation for ships, with no connection to soul portals or lunar stations.',
        isCorrect: false,
        rationale:
          'Its core purpose is cosmological deception about Sun and Moon technology, not mere navigation aid.',
      },
    ],
    hint: 'Manufactured cover — hide true Sun and Moon functions.',
    correctAnswer: 'C',
  },
  {
    number: 3,
    question:
      'In reality, what is the Sun designed to do, and what is the Moon designed to do?',
    options: [
      {
        label: 'A',
        text: 'The Sun is a soul-recycling portal that wipes human memories upon death; the Moon is a disguised extraterrestrial command and frequency-control station that harvests the energetic life-force generated by human suffering.',
        isCorrect: true,
        rationale:
          'Sun recycles and memory-wipes; Moon commands frequencies and harvests life-force from suffering.',
      },
      {
        label: 'B',
        text: 'The Sun only grows crops by chemistry, and the Moon only creates romantic poetry with no harvest role.',
        isCorrect: false,
        rationale:
          'Both are technological prison tools for recycling and loosh harvest, not mere crop and poetry devices.',
      },
      {
        label: 'C',
        text: 'The Sun stores bank records and the Moon prints paper money for central banks exclusively.',
        isCorrect: false,
        rationale:
          'Their functions are soul recycling and frequency/harvest command, not banking paperwork.',
      },
      {
        label: 'D',
        text: 'Both are empty holograms with zero interaction with souls, memory, or energetic harvesting systems.',
        isCorrect: false,
        rationale:
          'They actively process souls and harvest life-force; they are not inert empty pictures.',
      },
    ],
    hint: 'Sun = soul recycle / wipe; Moon = ET command / harvest station.',
    correctAnswer: 'A',
  },
  {
    number: 4,
    question:
      'What is the true relationship between the words Sol and Soul, and what is a true Sol-System?',
    options: [
      {
        label: 'A',
        text: 'Sol always meant a nuclear fusion ball, and a Sol-System is only a list of rocky planets with no soul meaning.',
        isCorrect: false,
        rationale:
          'Sol and Soul are synonymous; parasites inverted Sol to mean Sun after the last reset.',
      },
      {
        label: 'B',
        text: 'Sol and Soul are functionally synonymous; parasites manipulated "Sol" after the last reset to mean "Sun," hiding that a true Sol-System is a network of cosmic soul family members, not planets orbiting a star.',
        isCorrect: true,
        rationale:
          'Sol = Soul; a Sol-System is a cosmic soul family network, not a planetary orbit chart.',
      },
      {
        label: 'C',
        text: 'Sol is a brand name for sunglasses, and Soul is only a music genre with no cosmological link.',
        isCorrect: false,
        rationale:
          'The linguistic inversion is deliberate cosmological warfare over soul-family meaning.',
      },
      {
        label: 'D',
        text: 'Sol-System refers only to corporate solar panels, never to cosmic soul family members.',
        isCorrect: false,
        rationale:
          'True Sol-System names the network of connected souls, obscured by the Sun-word inversion.',
      },
    ],
    hint: 'Sol = Soul; Sol-System = cosmic soul family network.',
    correctAnswer: 'B',
  },
  {
    number: 5,
    question: 'What is the Amnesia Vortex and where is it located?',
    options: [
      {
        label: 'A',
        text: 'A weather cyclone in the southern oceans that only sinks ships and never touches deceased souls.',
        isCorrect: false,
        rationale:
          'It is a technological soul portal inside the Sun, not a maritime storm.',
      },
      {
        label: 'B',
        text: 'A gentle museum of past lives that restores every memory before free voluntary rebirth.',
        isCorrect: false,
        rationale:
          'It forcibly wipes memories before rapid reincarnation; it does not restore free archives.',
      },
      {
        label: 'C',
        text: 'A library under the Ice Wall that only stores maps and never pulls souls after death.',
        isCorrect: false,
        rationale:
          'The vortex sits in the Sun and pulls recently deceased souls for memory wipe.',
      },
      {
        label: 'D',
        text: 'The technological portal located within the Sun that forcefully pulls in recently deceased souls to wipe their memories before rapid physical reincarnation.',
        isCorrect: true,
        rationale:
          'Amnesia Vortex is the Sun-based portal that memory-wipes souls for rapid reincarnation.',
      },
    ],
    hint: 'Inside the Sun — force-pull deceased souls — memory wipe.',
    correctAnswer: 'D',
  },
  {
    number: 6,
    question: 'What is the Lunar Space Station behind the Moon\'s visual illusion?',
    options: [
      {
        label: 'A',
        text: 'A peaceful tourist hotel run by the G.A.A. that only heals visitors and never harvests energy.',
        isCorrect: false,
        rationale:
          'It is a negative ET command, communication, and harvesting center.',
      },
      {
        label: 'B',
        text: 'The true physical structure behind the Moon\'s visual illusion — a negative extraterrestrial command, communication, and harvesting center.',
        isCorrect: true,
        rationale:
          'Lunar Space Station is the real hostile ET installation masked by the Moon illusion.',
      },
      {
        label: 'C',
        text: 'An abandoned rock with no staff, no frequencies, and no role in human behavior control.',
        isCorrect: false,
        rationale:
          'It commands frequencies and harvests; it is not an inert abandoned rock.',
      },
      {
        label: 'D',
        text: 'A pure water reservoir that only controls tides through chemistry with no extraterrestrial presence.',
        isCorrect: false,
        rationale:
          'Behind the illusion is a negative ET command and harvest station, not a water tank.',
      },
    ],
    hint: 'Negative ET command / communication / harvesting center.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question:
      'What is Planet Venus in this celestial deception, and how is it codified biblically?',
    options: [
      {
        label: 'A',
        text: 'A distant rocky world that only reflects sunlight like a mirror and has no holographic role.',
        isCorrect: false,
        rationale:
          'Venus is a localized holographic generator casting lunar illumination, not a distant mirror rock.',
      },
      {
        label: 'B',
        text: 'The holographic generator that casts spherical illumination onto the Moon\'s surface, biblically codified as Lucifer or the Bright and Morning Star.',
        isCorrect: true,
        rationale:
          'Venus generates the Moon\'s false light and is named Lucifer / Bright and Morning Star.',
      },
      {
        label: 'C',
        text: 'A bank vault under Rome that stores paper contracts with no sky projection function.',
        isCorrect: false,
        rationale:
          'Venus operates as sky-level holographic illumination technology for the lunar shell.',
      },
      {
        label: 'D',
        text: 'Only a poetic nickname for love with zero connection to lunar light or parasitic systems.',
        isCorrect: false,
        rationale:
          'It is a functional holographic generator in the lunar illumination system.',
      },
    ],
    hint: 'Holographic lunar light generator — Lucifer / Bright and Morning Star.',
    correctAnswer: 'B',
  },
  {
    number: 8,
    question: 'What is the Black Sun and where is it situated?',
    options: [
      {
        label: 'A',
        text: 'A second nuclear star above the Projection Dome that only powers street lamps in cities.',
        isCorrect: false,
        rationale:
          'Black Sun is a massive underground storage bank for harvested energy, not a second sky star.',
      },
      {
        label: 'B',
        text: 'A festival costume worn once a year with no storage, harvest, or Mt Meru connection.',
        isCorrect: false,
        rationale:
          'It is infrastructure for stored harvested energy under Mt Meru / Northern Rock.',
      },
      {
        label: 'C',
        text: 'A massive storage bank for harvested energy situated directly beneath the central spiritual node of Mt Meru / Northern Rock.',
        isCorrect: true,
        rationale:
          'Black Sun stores harvested energy under Mt Meru / Northern Rock, the central spiritual node.',
      },
      {
        label: 'D',
        text: 'The Amnesia Vortex itself, located only inside the Sun with no underground node at all.',
        isCorrect: false,
        rationale:
          'Black Sun is the underground storage bank; the Amnesia Vortex is the Sun portal.',
      },
    ],
    hint: 'Harvest storage bank under Mt Meru / Northern Rock.',
    correctAnswer: 'C',
  },
  {
    number: 9,
    question: 'What is Loosh in the harvest architecture of Sun and Moon systems?',
    options: [
      {
        label: 'A',
        text: 'Ordinary rainwater collected in barrels for farming with no trauma or demonic harvest link.',
        isCorrect: false,
        rationale:
          'Loosh is energetic food from trauma, fear, and suffering, harvested by parasites.',
      },
      {
        label: 'B',
        text: 'The energetic food generated by the trauma, fear, and suffering of humanity, continuously harvested by demons and parasites.',
        isCorrect: true,
        rationale:
          'Loosh is life-force food from human suffering, continuously taken by demonic/parasitic forces.',
      },
      {
        label: 'C',
        text: 'A brand of healthy vitamins that raises frequency and stops all parasitic feeding forever.',
        isCorrect: false,
        rationale:
          'Loosh is the harvest product of suffering, not a liberating vitamin brand.',
      },
      {
        label: 'D',
        text: 'Only digital cryptocurrency mined by computers with no connection to human emotion or energy.',
        isCorrect: false,
        rationale:
          'Loosh is energetic food from human trauma and fear, not computer-mined currency.',
      },
    ],
    hint: 'Energetic food from trauma, fear, and suffering.',
    correctAnswer: 'B',
  },
  {
    number: 10,
    question: 'What is Heliocentrism designed to convince humanity of?',
    options: [
      {
        label: 'A',
        text: 'That they live on a spinning globe orbiting a sun — a structural and physical impossibility used as fabricated cosmology.',
        isCorrect: true,
        rationale:
          'Heliocentrism sells the impossible spinning-globe-orbit model to hide true celestial tech.',
      },
      {
        label: 'B',
        text: 'That the realm is flat, localized, and open for exploration beyond the Ice Wall without restriction.',
        isCorrect: false,
        rationale:
          'Heliocentrism blocks that truth; Freemasonic education enforces the globe lie instead.',
      },
      {
        label: 'C',
        text: 'That Sun and Moon are openly admitted soul machines taught in every primary school textbook.',
        isCorrect: false,
        rationale:
          'Heliocentrism conceals those functions behind fake orbital astronomy.',
      },
      {
        label: 'D',
        text: 'That gravity is optional and planets can be any shape chosen by majority vote each year.',
        isCorrect: false,
        rationale:
          'The model specifically locks belief in a spinning globe orbiting a sun.',
      },
    ],
    hint: 'Fabricated spinning globe orbit — physical impossibility.',
    correctAnswer: 'A',
  },
  {
    number: 11,
    question:
      'Why does a single "local sun" fail as proof of the spherical globe model?',
    options: [
      {
        label: 'A',
        text: 'Because textbooks already admit the model is false and require no further physical argument.',
        isCorrect: false,
        rationale:
          'The model is still enforced; the illumination math itself proves the impossibility.',
      },
      {
        label: 'B',
        text: 'A spherical planet could never be adequately illuminated by a single local sun without requiring multiple suns positioned entirely around it — further proving the globe model is a physical impossibility.',
        isCorrect: true,
        rationale:
          'One local sun cannot light a full sphere evenly; the globe model fails that physical test.',
      },
      {
        label: 'C',
        text: 'Because the Sun is too dim to light even a small room, so no celestial model matters.',
        isCorrect: false,
        rationale:
          'The issue is geometry of illuminating a sphere with one local sun, not simple dimness.',
      },
      {
        label: 'D',
        text: 'Because moons always provide all light and suns never illuminate land at all.',
        isCorrect: false,
        rationale:
          'The argument is about inadequate single-sun lighting of a claimed sphere.',
      },
    ],
    hint: 'One local sun cannot adequately light a full sphere.',
    correctAnswer: 'B',
  },
  {
    number: 12,
    question:
      'What is the Sun if it is not a burning ball of gas providing natural life to a solar system?',
    options: [
      {
        label: 'A',
        text: 'A pure decorative hologram that never interacts with dying souls or memory systems.',
        isCorrect: false,
        rationale:
          'It is the bright light at death and the entry portal for the Amnesia Vortex.',
      },
      {
        label: 'B',
        text: 'Only a heating coil for ocean currents with no role in reincarnation or amnesia.',
        isCorrect: false,
        rationale:
          'Its core role is soul processing through the Amnesia Vortex at death.',
      },
      {
        label: 'C',
        text: 'The bright light at the end of the tunnel that humans see when they die — the entry portal for the Amnesia Vortex that memory-wipes and re-inserts souls into the simulation.',
        isCorrect: true,
        rationale:
          'Death\'s bright light is the Sun portal feeding the Amnesia Vortex recycle loop.',
      },
      {
        label: 'D',
        text: 'A freemason meeting hall on Earth that never appears in the sky or at death.',
        isCorrect: false,
        rationale:
          'It is the sky-level soul portal perceived as the death tunnel light.',
      },
    ],
    hint: 'Bright light at death — Amnesia Vortex entry portal.',
    correctAnswer: 'C',
  },
  {
    number: 13,
    question:
      'How does the Moon station control human behavior, and where does the word "Lunatic" come from?',
    options: [
      {
        label: 'A',
        text: 'Only through gentle lullabies that raise courage and never disrupt psychology.',
        isCorrect: false,
        rationale:
          'Full-moon broadcasts are severe negative frequencies that psychologically disrupt the population.',
      },
      {
        label: 'B',
        text: 'Through frequency manipulation, especially in full phases; "Lunatic" derives from the severe negative frequencies the Moon station broadcasts during a full moon to disrupt the population.',
        isCorrect: true,
        rationale:
          'Full-moon frequency attacks from the station birthed the "lunatic" concept of lunar disruption.',
      },
      {
        label: 'C',
        text: 'By mailing paper notices once a year with no frequency field and no full-moon effect.',
        isCorrect: false,
        rationale:
          'Control is frequency-based, peaking at full moon, not postal notices.',
      },
      {
        label: 'D',
        text: 'The Moon has zero behavioral effect; "Lunatic" is only a modern brand name for candy.',
        isCorrect: false,
        rationale:
          'The station\'s full-moon negative frequencies are the etymological and operational root.',
      },
    ],
    hint: 'Full-moon negative frequencies — origin of "lunatic".',
    correctAnswer: 'B',
  },
  {
    number: 14,
    question:
      'Trace the soul-processor path after a vessel perishes — from the Sun to a new body.',
    options: [
      {
        label: 'A',
        text: 'The soul freely ascends to a benevolent afterlife with full memory and never returns to a body.',
        isCorrect: false,
        rationale:
          'Souls are drawn into the Sun\'s Amnesia Vortex for wipe and forced re-insertion, not free ascent.',
      },
      {
        label: 'B',
        text: 'Drawn into the Sun via the Amnesia Vortex, re-formatted and memory-wiped, channeled through portals beneath the Vatican, then Grey ETs escort the wiped soul into a newborn vessel within 15 to 20 minutes.',
        isCorrect: true,
        rationale:
          'Sun vortex wipe → Vatican portals → Grey escort → newborn re-insert in 15–20 minutes.',
      },
      {
        label: 'C',
        text: 'The soul sleeps under the Ice Wall for one thousand years with no Vatican, Grey, or newborn path.',
        isCorrect: false,
        rationale:
          'Recycling is rapid: wipe and re-insert within 15 to 20 minutes via Vatican and Greys.',
      },
      {
        label: 'D',
        text: 'Only NPCs recycle; genuine souls permanently exit and never pass the Amnesia Vortex.',
        isCorrect: false,
        rationale:
          'The Sun processor path is the closed reincarnation trap for souls in the prison matrix.',
      },
    ],
    hint: 'Amnesia Vortex → Vatican portals → Greys → newborn in 15–20 minutes.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question:
      'Does the Moon reflect the Sun\'s light, and what actually illuminates the lunar surface?',
    options: [
      {
        label: 'A',
        text: 'Yes — the Moon is a perfect natural mirror of solar light with no Venus involvement.',
        isCorrect: false,
        rationale:
          'The Moon does not reflect the Sun; Venus generates the artificial lunar illumination.',
      },
      {
        label: 'B',
        text: 'No natural reflection; illumination is artificially generated by Planet Venus, a localized holographic generator casting a spherical projection onto the Dyson-sphere-like shell of the lunar station.',
        isCorrect: true,
        rationale:
          'Venus paints false light onto the lunar station\'s Dyson-sphere-like shell.',
      },
      {
        label: 'C',
        text: 'Only city streetlights bounce upward and paint the entire Moon each night.',
        isCorrect: false,
        rationale:
          'Illumination is Venus holographic generation on the station shell, not city lights.',
      },
      {
        label: 'D',
        text: 'The Moon is always completely dark and never shows any illuminated face to human eyes.',
        isCorrect: false,
        rationale:
          'It shows artificial Venus-cast illumination on the holographic shell.',
      },
    ],
    hint: 'No solar reflection — Venus holographic light on Dyson-like shell.',
    correctAnswer: 'B',
  },
  {
    number: 16,
    question:
      'How can the artificial nature of moonlight be verified against true reflected sunlight?',
    options: [
      {
        label: 'A',
        text: 'Only by majority vote on social media with no physical measurement involved.',
        isCorrect: false,
        rationale:
          'Verification includes temperature anomalies of moonlight versus true reflected sunlight.',
      },
      {
        label: 'B',
        text: 'It cannot be verified at all because all instruments automatically confirm natural reflection.',
        isCorrect: false,
        rationale:
          'Temperature anomalies show moonlight behaves unnaturally versus true reflected sunlight.',
      },
      {
        label: 'C',
        text: 'Through temperature anomalies — the light cast by the Moon behaves unnaturally compared to true reflected sunlight.',
        isCorrect: true,
        rationale:
          'Moonlight\'s temperature behavior fails the test of genuine reflected solar light.',
      },
      {
        label: 'D',
        text: 'Only by waiting for the G.A.A. EMF flash; no pre-flash physical clue exists.',
        isCorrect: false,
        rationale:
          'Temperature anomalies already mark the light as artificial before the flash.',
      },
    ],
    hint: 'Temperature anomalies — unnatural versus true reflected sunlight.',
    correctAnswer: 'C',
  },
  {
    number: 17,
    question:
      'Who staffed the mobile lunar station, and what mobility technology did it use?',
    options: [
      {
        label: 'A',
        text: 'Only friendly children on field trips, with no ability to leave human visual range.',
        isCorrect: false,
        rationale:
          'Staffed by hostile entities and German breakaway hybrid blondes; it could materialize and dematerialize.',
      },
      {
        label: 'B',
        text: 'Hostile entities and German breakaway hybrid blondes; the station could materialize and dematerialize instantly, phasing out of the human realm.',
        isCorrect: true,
        rationale:
          'Hostile staff plus hybrid blondes ran a station that phases in and out of human view.',
      },
      {
        label: 'C',
        text: 'Only automatic robots that never moved the station from a fixed bolt over one city.',
        isCorrect: false,
        rationale:
          'It was highly mobile across realms, not a fixed city bolt with mute robots only.',
      },
      {
        label: 'D',
        text: 'Unpaid interns from Earth universities who paddled the station like a boat on water.',
        isCorrect: false,
        rationale:
          'Staffing and tech are hostile ET / hybrid and instant materialize-dematerialize systems.',
      },
    ],
    hint: 'Hostile entities + German breakaway hybrid blondes — instant phase mobility.',
    correctAnswer: 'B',
  },
  {
    number: 18,
    question:
      'Where could the lunar station travel when it phased out of the human realm?',
    options: [
      {
        label: 'A',
        text: 'Only to the nearest supermarket parking lot and never beyond the Ice Wall or other worlds.',
        isCorrect: false,
        rationale:
          'It traveled to any of the other 65 worlds across Gateway-10 under parasite control.',
      },
      {
        label: 'B',
        text: 'Nowhere — once phased out it permanently dissolved and never gathered loosh again.',
        isCorrect: false,
        rationale:
          'It remained operational across Gateway-10 worlds for loosh and frequency management.',
      },
      {
        label: 'C',
        text: 'To any of the other 65 worlds across Gateway-10 that the parasites also controlled, gathering loosh and managing frequency outputs across multiple realms.',
        isCorrect: true,
        rationale:
          'Gateway-10 multi-world travel for loosh collection and multi-realm frequency control.',
      },
      {
        label: 'D',
        text: 'Only into human dreams as a symbol, with no physical travel to other controlled worlds.',
        isCorrect: false,
        rationale:
          'Physical multi-realm station travel across 65 Gateway-10 worlds is the stated operation.',
      },
    ],
    hint: '65 worlds across Gateway-10 — loosh and frequency management.',
    correctAnswer: 'C',
  },
  {
    number: 19,
    question:
      'What was the Moon station\'s primary function regarding loosh, and where was that energy held?',
    options: [
      {
        label: 'A',
        text: 'To destroy all loosh on contact so parasites would starve and leave the realm immediately.',
        isCorrect: false,
        rationale:
          'Primary function was collecting loosh, then holding it in Black Sun storage banks.',
      },
      {
        label: 'B',
        text: 'To collect loosh from the human population; harvested energy was siphoned into the massive storage banks of the Black Sun deep below the central energetic node of the physical plane.',
        isCorrect: true,
        rationale:
          'Moon station collects loosh; Black Sun under the central node stores the harvested energy.',
      },
      {
        label: 'C',
        text: 'To convert loosh into free public electricity for every city with transparent meters.',
        isCorrect: false,
        rationale:
          'Harvested energy feeds parasitic storage (Black Sun), not free public power.',
      },
      {
        label: 'D',
        text: 'To ignore human emotion entirely and only measure star temperatures for academic papers.',
        isCorrect: false,
        rationale:
          'Loosh collection from human trauma is the station\'s primary harvest function.',
      },
    ],
    hint: 'Collect loosh → Black Sun storage under the central node.',
    correctAnswer: 'B',
  },
  {
    number: 20,
    question:
      'How do Sun and Moon operations lock souls into Fake Linear Time?',
    options: [
      {
        label: 'A',
        text: 'By teaching free non-linear time travel courses in every school after death.',
        isCorrect: false,
        rationale:
          'Amnesia Vortex recycling blocks higher-density non-linear time and forces a birth-suffer-death loop.',
      },
      {
        label: 'B',
        text: 'By forcing souls through the Sun\'s Amnesia Vortex immediately after death, preventing natural non-linear time of higher densities and trapping souls in a continuous chronological loop of birth, suffering, and death.',
        isCorrect: true,
        rationale:
          'Immediate post-death amnesia recycle erases past lives and enforces the linear prison loop.',
      },
      {
        label: 'C',
        text: 'By stopping all clocks so that no chronological experience exists for anyone.',
        isCorrect: false,
        rationale:
          'They enforce continuous chronological looping, not the abolition of all time experience.',
      },
      {
        label: 'D',
        text: 'Linear time is fully natural and untouched by Sun portals or lunar stations.',
        isCorrect: false,
        rationale:
          'Fake Linear Time is enforced through Amnesia Vortex recycling and past-life erasure.',
      },
    ],
    hint: 'Amnesia Vortex after death → chronological birth-suffer-death loop.',
    correctAnswer: 'B',
  },
  {
    number: 21,
    question:
      'How does false Sun-and-Moon cosmology serve the three psychological control strings?',
    options: [
      {
        label: 'A',
        text: 'It is the foundational pillar for Perceived Knowledge — one of the three main psychological strings alongside Religion and Finance used to control humanity.',
        isCorrect: true,
        rationale:
          'False celestial "knowledge" anchors Perceived Knowledge next to Religion and Finance.',
      },
      {
        label: 'B',
        text: 'It only affects sports scores and never touches Religion, Finance, or Perceived Knowledge.',
        isCorrect: false,
        rationale:
          'It is foundational to Perceived Knowledge within the three-string control system.',
      },
      {
        label: 'C',
        text: 'It replaces Religion and Finance entirely so those two strings no longer operate.',
        isCorrect: false,
        rationale:
          'All three strings operate together; false Sun/Moon belief feeds Perceived Knowledge.',
      },
      {
        label: 'D',
        text: 'It liberates the population from all three strings by revealing Ice Wall truth in schools.',
        isCorrect: false,
        rationale:
          'Enforced heliocentric lies keep people on the strings, not free of them.',
      },
    ],
    hint: 'Perceived Knowledge pillar — with Religion and Finance.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question:
      'How do Freemasonic controllers use the heliocentric lie in education, and what exploration does that block?',
    options: [
      {
        label: 'A',
        text: 'They fund open Ice Wall expeditions and teach that the realm is localized and flat from kindergarten.',
        isCorrect: false,
        rationale:
          'They enforce the heliocentric lie so people stay oblivious to the flat, localized realm.',
      },
      {
        label: 'B',
        text: 'They ignore schools completely and only control banking with no cosmology curriculum.',
        isCorrect: false,
        rationale:
          'Education is a primary channel for the heliocentric deception.',
      },
      {
        label: 'C',
        text: 'By enforcing the heliocentric lie through the education system so the population remains oblivious to the localized, flat nature of the realm, preventing exploration beyond the Ice Wall.',
        isCorrect: true,
        rationale:
          'School heliocentrism blinds people to flat-realm truth and blocks Ice Wall exploration.',
      },
      {
        label: 'D',
        text: 'They require every student to map the 65 Gateway-10 worlds before graduation.',
        isCorrect: false,
        rationale:
          'Curriculum hides multi-realm and flat-realm truth behind the globe-orbit story.',
      },
    ],
    hint: 'Education enforces heliocentrism — blocks Ice Wall / flat-realm knowing.',
    correctAnswer: 'C',
  },
  {
    number: 23,
    question:
      'What will the G.A.A. EMF flash do to 3rd-density visual overlays and holographic technologies?',
    options: [
      {
        label: 'A',
        text: 'Upgrade them into permanent stronger cages that never fail again for any density.',
        isCorrect: false,
        rationale:
          'The flash permanently disables 3rd-density visual overlays and holographic technologies.',
      },
      {
        label: 'B',
        text: 'Only dim streetlights for one night while Sun and Moon holograms stay fully online.',
        isCorrect: false,
        rationale:
          'All 3rd-density visual overlays and holographics are permanently disabled.',
      },
      {
        label: 'C',
        text: 'Permanently disable all 3rd-density visual overlays and holographic technologies during the impending Electro Magnetic Frequency flash orchestrated by the Galactic Ancestral Alliance.',
        isCorrect: true,
        rationale:
          'G.A.A. EMF flash ends the overlay and holographic sky systems permanently.',
      },
      {
        label: 'D',
        text: 'Convert NPCs into G.A.A. officers while leaving every hologram exactly as programmed.',
        isCorrect: false,
        rationale:
          'The flash targets and disables holographic and overlay tech, not NPC officer promotions.',
      },
    ],
    hint: 'G.A.A. EMF flash — permanent disable of overlays and holographics.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question:
      'What happens when the celestial Projection Dome is switched off?',
    options: [
      {
        label: 'A',
        text: 'Nothing visible changes; textbooks instantly rewrite themselves and the sky looks identical.',
        isCorrect: false,
        rationale:
          'Cosmos illusions dissolve into melting pixelation, exposing true sky architecture.',
      },
      {
        label: 'B',
        text: 'Visual illusions of the cosmos dissolve into melting pixelation, exposing the true architecture of the sky.',
        isCorrect: true,
        rationale:
          'Dome off = pixelation melt of fake cosmos and exposure of true sky architecture.',
      },
      {
        label: 'C',
        text: 'A second fake dome installs automatically so pixelation never appears to human eyes.',
        isCorrect: false,
        rationale:
          'Illusions dissolve into melting pixelation; true architecture is exposed.',
      },
      {
        label: 'D',
        text: 'Only the ocean colors change while stars, Sun, and Moon remain perfectly convincing forever.',
        isCorrect: false,
        rationale:
          'Celestial illusions themselves melt into pixelation when the dome dies.',
      },
    ],
    hint: 'Projection Dome off — melting pixelation — true sky architecture.',
    correctAnswer: 'B',
  },
  {
    number: 25,
    question:
      'What combination drives total psychological collapse for NPCs and the unawakened when the celestial lie ends?',
    options: [
      {
        label: 'A',
        text: 'Mild curiosity about a new star chart with no memory return and no emotional shock.',
        isCorrect: false,
        rationale:
          'Collapse comes from seeing Sun/Moon as prison tech plus 178,000 years of suppressed memories returning.',
      },
      {
        label: 'B',
        text: 'Only a short power outage in one city with no link to memories or celestial instruments.',
        isCorrect: false,
        rationale:
          'The shock is global celestial exposure plus massive memory return for the unawakened.',
      },
      {
        label: 'C',
        text: 'Instant enlightenment that feels pleasant for every NPC with zero cognitive failure.',
        isCorrect: false,
        rationale:
          'NPCs and unawakened masses face total psychological and cognitive collapse.',
      },
      {
        label: 'D',
        text: 'Realizing the Sun and Moon were technological instruments of imprisonment, combined with the sudden return of 178,000 years of suppressed memories — total psychological and cognitive collapse for NPCs and unawakened masses who trusted scientific and religious narratives.',
        isCorrect: true,
        rationale:
          'Prison-tech exposure plus 178,000 years of memories returning shatters NPC and herd cognition.',
      },
    ],
    hint: 'Sun/Moon as prison tech + 178,000 years of memories → NPC collapse.',
    correctAnswer: 'D',
  },
];

function normalizeQuestion(q) {
  const mapped = q.options.map((o) => ({
    label: o.label,
    text: cleanText(o.text),
    isCorrect: !!o.isCorrect,
    rationale: cleanText(o.rationale),
  }));
  // Rotate draft order so finalizeOptions shuffle does not cluster on one letter
  const rot = ((q.number * 5) + 2) % 4;
  const ordered = mapped.slice(rot).concat(mapped.slice(0, rot));
  const finalized = finalizeOptions(
    ordered,
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
const dominant = Math.max(...Object.values(letterCounts));
if (dominant >= 15) {
  console.warn('Warning: one letter has >= 15 corrects:', letterCounts);
}

const DESC_SHORT =
  'Test your grasp of The Sun and Moon — Amnesia Vortex, lunar ET station, Venus illumination, Black Sun loosh banks, heliocentrism, and the G.A.A. reveal.';
const DESC_META =
  'Interactive Living Truth Quiz on The Sun and Moon: soul-recycling portal, lunar command station, Venus as Lucifer light generator, full-moon frequencies, Vatican-Grey recycle path, Gateway-10 mobility, and EMF pixelation of the sky.';

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
      'The Sun and Moon are not thermodynamics and gravity — they are 4th-density prison machinery. The Sun is the death-tunnel Amnesia Vortex that wipes and recycles; the Moon is a mobile negative station that frequency-controls and harvests loosh into the Black Sun under Mt Meru. Venus paints the lunar shell; "lunatic" names the full-moon broadcast; Heliocentrism is the school lie that seals the Ice Wall. Sit with what you missed, then return to The Sun and Moon deep-dive. When the G.A.A. EMF flash kills the Projection Dome, pixelation eats the fake cosmos and 178,000 years of memory return. NPCs who trusted science and religion will not hold. Know the instruments now.',
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
      "  { path: '/quiz/alice/simulation-reality.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/grey-ets.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/gateway-10-system.html', priority: '0.75', changefreq: 'monthly' },",
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
[0, 6, 11, 18, 20, 24].forEach((i) => {
  const c = questions[i].options.find((o) => o.isCorrect);
  console.log(
    ` Q${questions[i].number} (${questions[i].correctAnswer}): ${c.text.slice(0, 100)}`
  );
});
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('PASS: audited 25/25 against data/alice-topics/sun-and-moon.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
