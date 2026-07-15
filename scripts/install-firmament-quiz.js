/**
 * Installs Firmament quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/firmament.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Run: node scripts/install-firmament-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'firmament';
const TOPIC_TITLE = 'Firmament';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/firm.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['outer structural membrane', 'bends light and sound', 'physical perception'],
  2: ['flat', 'horizontal', 'spinning sphere'],
  3: ['globe', 'pillars', 'impractical'],
  4: ['holographic projection dome', '3rd density', 'parasites'],
  5: ['simulation', 'etheric supercomputer', 'source of all creation'],
  6: ['4th-density', 'hijacked', 'trapping human souls'],
  7: ['heliocentrism', 'spherical planets', 'orbit'],
  8: ['black void plasma', 'bright white', 'true space'],
  9: ['dark matter field', 'bright white light', 'beyond the firmament'],
  10: ['gateway-10', '178', 'flat realms'],
  11: ['realm-3', 'realm-2', 'ice'],
  12: ['ice wall', 'antarctica', 'partition'],
  13: ['freemasons', '33rd', 'globe'],
  14: ['spinning globe', 'physical impossibility'],
  15: ['dyson sphere', 'hundreds of miles', 'pillars'],
  16: ['physical sight', 'bending light and sound'],
  17: ['two colanders', 'sieves', 'dual'],
  18: ['outer layer', 'atmospheric containment', 'sensory perception'],
  19: ['inner layer', 'fake stars', 'true boundary'],
  20: ['breached', 'sold soul', 'energetic key'],
  21: ['asteroids', 'projections', 'portals'],
  22: ['1,000 miles per hour', 'orbit suns', 'horizontal plain'],
  23: ['sky event', 'galactic ancestral alliance', 'switch off'],
  24: ['polaris', 'pixelation', 'knees'],
  25: ['npcs', 'catatonia', 'great spiritual awakening'],
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
    question: 'What is the Firmament?',
    options: [
      {
        label: 'A',
        text: 'The outer structural membrane enclosing the physical plain that bends light and sound, an absolute requirement for granting physical eyes their perception.',
        isCorrect: true,
        rationale:
          'The Firmament is the outer structural membrane of the realm. Its primary job is bending light and sound so biological eyes can have physical perception.',
      },
      {
        label: 'B',
        text: 'A decorative cloud layer painted by Freemasons for aesthetic reasons only.',
        isCorrect: false,
        rationale:
          'Freemasons enforce the globe lie to hide the Firmament; the membrane itself is functional necessity, not decoration.',
      },
      {
        label: 'C',
        text: 'The inner Holographic Projection Dome that alone creates all of physical sight.',
        isCorrect: false,
        rationale:
          'The dome is the inner technological layer beneath the Firmament; perception depends on the outer membrane bending light and sound.',
      },
      {
        label: 'D',
        text: 'Empty vacuum beyond the Dark Matter Field where planets orbit suns.',
        isCorrect: false,
        rationale:
          'True space beyond the Firmament is the bright-white Dark Matter Field; Heliocentrism is the fake model.',
      },
    ],
    hint: 'Outer membrane — bends light and sound for sight.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'What is the true physical layout enclosed by the Firmament?',
    options: [
      {
        label: 'A',
        text: 'A flat, horizontal physical plain — not a spinning sphere in a vacuum.',
        isCorrect: true,
        rationale:
          'True cosmology is a flat horizontal plain. The spinning-sphere-in-vacuum model is manufactured illusion.',
      },
      {
        label: 'B',
        text: 'A spinning globe that rotates nearly 1,000 miles per hour under a Dyson Sphere.',
        isCorrect: false,
        rationale:
          'Globe spin at nearly 1,000 mph is dismantled as false; a globe could never support a Firmament.',
      },
      {
        label: 'C',
        text: 'Only a Holographic Projection Dome with no outer structural membrane.',
        isCorrect: false,
        rationale:
          'The sky is dual-layered: outer Firmament plus inner projection dome.',
      },
      {
        label: 'D',
        text: '178 disconnected globes floating in black vacuum with no Ice Wall partitions.',
        isCorrect: false,
        rationale:
          'Gateway-10 is 178 interconnected worlds on flat realms enclosed by the Firmament and partitioned by Ice Walls.',
      },
    ],
    hint: 'Flat horizontal plain — not a spinning sphere.',
    correctAnswer: 'A',
  },
  {
    number: 3,
    question: 'Why can a globe Earth never support a Firmament?',
    options: [
      {
        label: 'A',
        text: 'Enclosing a globe would require an impractical network of massive pillars — in a Dyson Sphere style, giant pillars raising hundreds of miles into the sky.',
        isCorrect: true,
        rationale:
          'A sphere cannot sustain the structure. A globe-style enclosure would need impractical giant pillars hundreds of miles high.',
      },
      {
        label: 'B',
        text: 'Globes already have perfect Firmaments made of Black Void Plasma alone.',
        isCorrect: false,
        rationale:
          'Black Void Plasma blackens the sky illusion; it does not make a globe-compatible Firmament viable.',
      },
      {
        label: 'C',
        text: 'Because Ice Walls automatically form spherical membranes every century.',
        isCorrect: false,
        rationale:
          'Ice Walls are horizontal partitions of the flat plain, not globe-supporting pillars.',
      },
      {
        label: 'D',
        text: 'Because the G.A.A. forbids any membrane on flat ground only.',
        isCorrect: false,
        rationale:
          'The Firmament is designed strictly for a horizontal flat layout; the impossibility is mechanical, not a G.A.A. ban on flat membranes.',
      },
    ],
    hint: 'Impractical pillars / Dyson Sphere-style hundreds of miles.',
    correctAnswer: 'A',
  },
  {
    number: 4,
    question:
      'How does the Firmament operate inside the inverted Simulation?',
    options: [
      {
        label: 'A',
        text: 'In tandem with inner technological layers such as the Holographic Projection Dome to lock humanity into a heavily suppressed 3rd Density illusion under 4th-density Parasites.',
        isCorrect: true,
        rationale:
          'Within the parasite-controlled Simulation, the Firmament works with the inner Holographic Projection Dome to hold a suppressed 3rd Density illusion.',
      },
      {
        label: 'B',
        text: 'Alone, with no dome, so every NPC already sees the bright white Dark Matter Field.',
        isCorrect: false,
        rationale:
          'The dome and Black Void Plasma still mask true space; unawakened masses have not yet seen the exposure.',
      },
      {
        label: 'C',
        text: 'Only as a Freemason classroom model with no physical function.',
        isCorrect: false,
        rationale:
          'It is absolute functional necessity for perception and atmospheric containment, not a classroom prop.',
      },
      {
        label: 'D',
        text: 'As a temporary Ice Wall that melts every night at Polaris.',
        isCorrect: false,
        rationale:
          'Ice Walls partition realms; the Sky Event peels dome and plasma, not nightly ice melt.',
      },
    ],
    hint: 'Firmament + Projection Dome = 3rd Density lock.',
    correctAnswer: 'A',
  },
  {
    number: 5,
    question: 'What is the Simulation in this cosmology?',
    options: [
      {
        label: 'A',
        text: 'The multidimensional etheric supercomputer and physical plain of existence, originally created by the Source of All Creation, now functioning as an inverted matrix.',
        isCorrect: true,
        rationale:
          'The Simulation is the etheric supercomputer and physical plain made by the Source, now inverted into a matrix under parasitic control.',
      },
      {
        label: 'B',
        text: 'Only the Freemason school textbooks with no physical plain.',
        isCorrect: false,
        rationale:
          'It is the actual multidimensional physical plain of existence, not merely textbooks.',
      },
      {
        label: 'C',
        text: 'A natural spinning vacuum that never needed a Firmament.',
        isCorrect: false,
        rationale:
          'The Firmament is absolute necessity for physical existence and perception inside true mechanics.',
      },
      {
        label: 'D',
        text: 'Realm-3 only, permanently disconnected from Gateway-10.',
        isCorrect: false,
        rationale:
          'Realm-3 is one partitioned segment of Gateway-10\'s broader flat architecture.',
      },
    ],
    hint: 'Ethereic supercomputer / plain from Source — now inverted.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'Who are the Parasites relative to the Firmament realm?',
    options: [
      {
        label: 'A',
        text: 'Hostile 4th-density entities who hijacked the physical plain, orchestrating inversion of reality and trapping human souls.',
        isCorrect: true,
        rationale:
          'Parasites are hostile 4th-density entities that hijacked the plain, inverted reality, and trap human souls.',
      },
      {
        label: 'B',
        text: 'Benevolent 33rd-degree Freemasons restoring Heliocentrism for the Source.',
        isCorrect: false,
        rationale:
          'Freemasons are terrestrial agents under parasitic control enforcing globe lies, not Source restorers.',
      },
      {
        label: 'C',
        text: 'NPCs who built the Ice Wall without any craft breach capability.',
        isCorrect: false,
        rationale:
          'Hostile ETs and parasites breach the membrane in crafts; NPCs are the unawakened population facing psychological failure at exposure.',
      },
      {
        label: 'D',
        text: 'Only asteroid fragments that bounce harmlessly off the outer membrane.',
        isCorrect: false,
        rationale:
          'Real space debris does not exist; parasites open portals and deliver weapons — asteroids are dome projections.',
      },
    ],
    hint: 'Hostile 4th-density hijackers of the plain.',
    correctAnswer: 'A',
  },
  {
    number: 7,
    question: 'What is Heliocentrism in this framework?',
    options: [
      {
        label: 'A',
        text: 'The manufactured fake cosmological model designed to convince humanity that spherical planets orbit suns.',
        isCorrect: true,
        rationale:
          'Heliocentrism is manufactured deception — spherical planets orbiting suns — fully dismantled by true Firmament architecture.',
      },
      {
        label: 'B',
        text: 'The true layout of Gateway-10\'s 178 interconnected flat worlds.',
        isCorrect: false,
        rationale:
          'Gateway-10 is a connected horizontal plain; planets do not orbit suns in true cosmology.',
      },
      {
        label: 'C',
        text: 'The G.A.A. Sky Event procedure for switching off the dome.',
        isCorrect: false,
        rationale:
          'The Sky Event ends the dome illusion; Heliocentrism is the false model being ended.',
      },
      {
        label: 'D',
        text: 'Black Void Plasma\'s natural color when Dark Matter is absent.',
        isCorrect: false,
        rationale:
          'Black Void Plasma is technology that blackens the sky; Dark Matter Field is bright white beyond the Firmament.',
      },
    ],
    hint: 'Fake model — spheres orbiting suns.',
    correctAnswer: 'A',
  },
  {
    number: 8,
    question: 'What is Black Void Plasma used for?',
    options: [
      {
        label: 'A',
        text: 'Custodian and Niberian technology deployed to artificially blacken the firmament and hide the bright white reality of true space.',
        isCorrect: true,
        rationale:
          'Black Void Plasma is Custodian/Niberian tech that paints the night sky black so the bright white true space stays hidden.',
      },
      {
        label: 'B',
        text: 'Natural starlight from real asteroids piercing the outer membrane.',
        isCorrect: false,
        rationale:
          'Real asteroid debris does not penetrate; black night sky is technological illusion, not natural star vacuum.',
      },
      {
        label: 'C',
        text: 'The permanent material of the Ice Wall around Antarctica.',
        isCorrect: false,
        rationale:
          'Ice Walls are physical horizontal boundaries; Black Void Plasma blackens the firmament sky illusion.',
      },
      {
        label: 'D',
        text: 'Fuel for Sold Soul vessels so parasites can leave the realm forever.',
        isCorrect: false,
        rationale:
          'Sold Souls act as energetic keys for entry under high ambient frequencies; plasma hides true bright space.',
      },
    ],
    hint: 'Artificial blackening — hides bright white true space.',
    correctAnswer: 'A',
  },
  {
    number: 9,
    question: 'What is the Dark Matter Field beyond the Firmament?',
    options: [
      {
        label: 'A',
        text: 'The vast true expanse beyond the firmament, entirely composed of bright white light rather than a dark empty void.',
        isCorrect: true,
        rationale:
          'Beyond the Firmament the Dark Matter Field is filled with bright white light — not empty black vacuum.',
      },
      {
        label: 'B',
        text: 'Pitch-black vacuum where spherical planets orbit at 1,000 miles per hour.',
        isCorrect: false,
        rationale:
          'Pitch-black night is Black Void Plasma illusion; globe spin and orbital Heliocentrism are false.',
      },
      {
        label: 'C',
        text: 'Only the Holographic Projection Dome\'s inner sieve holes.',
        isCorrect: false,
        rationale:
          'The dome is inside, beneath the Firmament; the Dark Matter Field is the true expanse beyond.',
      },
      {
        label: 'D',
        text: 'Realm-3 farmland between Ice Walls with no light at all.',
        isCorrect: false,
        rationale:
          'Realm-3 is the inhabited partitioned segment of the flat Earth, not the bright-white beyond-firmament field.',
      },
    ],
    hint: 'Beyond the membrane — bright white light, not black void.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'What is Gateway-10 in relation to the Firmament?',
    options: [
      {
        label: 'A',
        text: 'The central physical plain of existence comprising 178 interconnected worlds, where the firmament encloses the known flat realms.',
        isCorrect: true,
        rationale:
          'Gateway-10 is the central plain of 178 interconnected worlds; the Firmament encloses the known flat realms there.',
      },
      {
        label: 'B',
        text: 'A single spinning globe with no interconnected worlds.',
        isCorrect: false,
        rationale:
          'It is flat interconnected worlds under firmament enclosure, not one spinning globe.',
      },
      {
        label: 'C',
        text: 'The name of the inner dome that projects fake asteroids only.',
        isCorrect: false,
        rationale:
          'Gateway-10 is the plain of worlds; the inner dome is the Holographic Projection Dome.',
      },
      {
        label: 'D',
        text: 'A Freemason code for Heliocentrism textbooks.',
        isCorrect: false,
        rationale:
          'It is the actual central physical plain architecture, not a textbook code name.',
      },
    ],
    hint: '178 interconnected worlds — firmament encloses flat realms.',
    correctAnswer: 'A',
  },
  {
    number: 11,
    question: 'What is Realm-3?',
    options: [
      {
        label: 'A',
        text: 'The currently inhabited segment of the flat Earth, artificially partitioned from the original Realm-2 by fake ice boundaries.',
        isCorrect: true,
        rationale:
          'Realm-3 is the inhabited flat-Earth segment, cut off from original Realm-2 by fake ice boundaries.',
      },
      {
        label: 'B',
        text: 'The Dark Matter Field of pure bright white light beyond all membranes.',
        isCorrect: false,
        rationale:
          'Dark Matter Field is beyond the Firmament; Realm-3 is the inhabited partitioned segment inside the known lands.',
      },
      {
        label: 'C',
        text: 'A 4th-density parasite home world with no Firmament.',
        isCorrect: false,
        rationale:
          'Parasites breached into this firmament-enclosed realm; Realm-3 names the inhabited flat segment.',
      },
      {
        label: 'D',
        text: 'The outer structural membrane that bends light and sound.',
        isCorrect: false,
        rationale:
          'That membrane is the Firmament itself, not Realm-3.',
      },
    ],
    hint: 'Inhabited flat segment — partitioned from Realm-2 by fake ice.',
    correctAnswer: 'A',
  },
  {
    number: 12,
    question: 'What is the Ice Wall?',
    options: [
      {
        label: 'A',
        text: 'The physical horizontal boundaries (such as Antarctica) that partition the known lands from the rest of the flat cosmic plains.',
        isCorrect: true,
        rationale:
          'Ice Walls are physical horizontal boundaries — Antarctica among them — splitting known lands from the wider flat cosmic plains.',
      },
      {
        label: 'B',
        text: 'Black Void Plasma frozen into a sphere around the globe.',
        isCorrect: false,
        rationale:
          'Ice Walls are flat-domain partitions; plasma blackens the sky illusion, not a spherical ice shell.',
      },
      {
        label: 'C',
        text: 'The G.A.A. pixelation cascade starting at Polaris.',
        isCorrect: false,
        rationale:
          'Polaris pixelation is the Sky Event dome shutdown visual, not the Ice Wall.',
      },
      {
        label: 'D',
        text: 'A myth projected only on the inner dome with no physical role.',
        isCorrect: false,
        rationale:
          'Ice Walls are physical boundaries that hide what lies beyond the known lands and kill curiosity about the wider plain.',
      },
    ],
    hint: 'Horizontal partitions (e.g. Antarctica) of the flat plains.',
    correctAnswer: 'A',
  },
  {
    number: 13,
    question: 'What role do Freemasons play regarding the Firmament?',
    options: [
      {
        label: 'A',
        text: '33rd-degree terrestrial agents under parasitic control, tasked with enforcing the cosmological lies of the globe and hiding the firmament.',
        isCorrect: true,
        rationale:
          '33rd-degree Freemasons serve parasitic control by enforcing globe lies and hiding the Firmament through fake educational models.',
      },
      {
        label: 'B',
        text: 'Builders of the true dual-layered sky for the Source of All Creation.',
        isCorrect: false,
        rationale:
          'They hide and suppress true cosmology; they do not construct the Source-level architecture for liberation.',
      },
      {
        label: 'C',
        text: 'NPC farmers who alone open portals for asteroid weapons.',
        isCorrect: false,
        rationale:
          'Parasites open portals and deliver weapons; Freemasons enforce the globe educational lie.',
      },
      {
        label: 'D',
        text: 'Operators who will switch off the Projection Dome during the Sky Event.',
        isCorrect: false,
        rationale:
          'The Galactic Ancestral Alliance permanently switches off the inner dome at the Sky Event.',
      },
    ],
    hint: '33rd-degree agents — enforce globe, hide Firmament.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question:
      'Why is the spinning globe scientific model a physical impossibility?',
    options: [
      {
        label: 'A',
        text: 'A spherical planet could never sustain life nor support a Firmament within true creation mechanics.',
        isCorrect: true,
        rationale:
          'Within true creation mechanics a spinning globe cannot sustain life or hold a Firmament — the accepted model is impossible.',
      },
      {
        label: 'B',
        text: 'Because spheres spin too slowly to need any Ice Wall partitions.',
        isCorrect: false,
        rationale:
          'The failure is structural and life-support impossibility, not spin-rate versus ice.',
      },
      {
        label: 'C',
        text: 'Because Black Void Plasma only sticks to flat glass classroom models.',
        isCorrect: false,
        rationale:
          'Plasma blackens the firmament sky; the globe model fails because spheres cannot support the Firmament or life as claimed.',
      },
      {
        label: 'D',
        text: 'Because Polaris forbids globes after the Sky Event only, not before.',
        isCorrect: false,
        rationale:
          'The impossibility is present mechanics of creation, not a post-Sky-Event rule.',
      },
    ],
    hint: 'Sphere cannot sustain life or a Firmament.',
    correctAnswer: 'A',
  },
  {
    number: 15,
    question:
      'What would a globe-style "Dyson Sphere" firmament attempt require?',
    options: [
      {
        label: 'A',
        text: 'Giant pillars raising hundreds of miles into the sky to support the structure — an impractical network.',
        isCorrect: true,
        rationale:
          'Trying to enclose a globe like a Dyson Sphere firmament would need giant pillars hundreds of miles high — impractical and wrong for true flat design.',
      },
      {
        label: 'B',
        text: 'Only a thin coat of Black Void Plasma with no supports.',
        isCorrect: false,
        rationale:
          'The globe problem is structural support of a membrane on a sphere, described as massive pillars, not a plasma coat.',
      },
      {
        label: 'C',
        text: '178 small Ice Walls glued to the equator alone.',
        isCorrect: false,
        rationale:
          'Ice Walls partition flat plains; the Dyson-style critique is about sky-high pillars on a globe.',
      },
      {
        label: 'D',
        text: 'A single Sold Soul contract renewable every night.',
        isCorrect: false,
        rationale:
          'Sold Souls were energetic keys for parasite entry under high frequencies, not globe firmament pillars.',
      },
    ],
    hint: 'Giant pillars hundreds of miles — impractical.',
    correctAnswer: 'A',
  },
  {
    number: 16,
    question:
      'What happens to physical sight without the Firmament membrane?',
    options: [
      {
        label: 'A',
        text: 'Physical sight would not exist — the membrane must bend light and sound for biological eyes to have perception.',
        isCorrect: true,
        rationale:
          'Without the Firmament bending light and sound, physical sight does not exist. The membrane is mandatory for perception.',
      },
      {
        label: 'B',
        text: 'Eyes would automatically see the Dark Matter Field without any technology.',
        isCorrect: false,
        rationale:
          'The membrane itself is required for perception; dome and plasma further control what is shown or hidden.',
      },
      {
        label: 'C',
        text: 'Heliocentrism would become true and planets would start orbiting.',
        isCorrect: false,
        rationale:
          'Removing the membrane does not validate fake orbital models; it would remove the basis of physical sight.',
      },
      {
        label: 'D',
        text: 'Only NPCs would go blind while true souls keep vacuum vision.',
        isCorrect: false,
        rationale:
          'The Firmament is general requirement for physical eyes\' perception in the plain.',
      },
    ],
    hint: 'No membrane bend of light/sound — no physical sight.',
    correctAnswer: 'A',
  },
  {
    number: 17,
    question: 'How is the dual-layered sky structured?',
    options: [
      {
        label: 'A',
        text: 'Like two colanders or sieves sitting one inside the other on a table — outer true Firmament, inner Holographic Projection Dome.',
        isCorrect: true,
        rationale:
          'Celestial structure is dual: two colander/sieve layers, outer Firmament and inner Projection Dome one inside the other.',
      },
      {
        label: 'B',
        text: 'As a single solid iron shell with no permeability or projections.',
        isCorrect: false,
        rationale:
          'It is dual, sieve-like, permeable enough for craft breach, with an inner projecting layer.',
      },
      {
        label: 'C',
        text: 'As 178 stacked globes rotating inside Black Void Plasma only.',
        isCorrect: false,
        rationale:
          'Architecture is flat dual-layer sky over horizontal plains, not stacked spinning globes.',
      },
      {
        label: 'D',
        text: 'As classroom freemason maps with no technological barrier at all.',
        isCorrect: false,
        rationale:
          'It is a highly advanced multi-layered technological barrier, not mere maps.',
      },
    ],
    hint: 'Two colanders/sieves — outer Firmament, inner dome.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question: 'What is the outer layer\'s essential function?',
    options: [
      {
        label: 'A',
        text: 'The true Firmament — essential for atmospheric containment and sensory perception.',
        isCorrect: true,
        rationale:
          'The outer layer is the true Firmament, required for atmospheric containment and sensory perception.',
      },
      {
        label: 'B',
        text: 'Only projecting fake stars while the inner layer holds the atmosphere.',
        isCorrect: false,
        rationale:
          'Fake star projection is the inner Holographic Projection Dome\'s job; outer holds containment and perception.',
      },
      {
        label: 'C',
        text: 'Melting from Polaris during every ordinary night.',
        isCorrect: false,
        rationale:
          'Polaris pixelation cascade is the impending Sky Event dome shutdown, not nightly outer-layer melt.',
      },
      {
        label: 'D',
        text: 'Enforcing Heliocentrism so spheres can orbit safely.',
        isCorrect: false,
        rationale:
          'The outer Firmament dismantles Heliocentrism by belonging to flat enclosure mechanics.',
      },
    ],
    hint: 'Outer = atmosphere + sensory perception.',
    correctAnswer: 'A',
  },
  {
    number: 19,
    question: 'What does the inner Holographic Projection Dome do?',
    options: [
      {
        label: 'A',
        text: 'Sits directly beneath the firmament and functions like a sieve to project the visual illusion of the cosmos, including fake stars, masking the true boundary.',
        isCorrect: true,
        rationale:
          'The inner dome sits under the Firmament as a sieve projecting fake cosmos and stars, masking the true boundary.',
      },
      {
        label: 'B',
        text: 'Creates the bright white Dark Matter Field permanently outside.',
        isCorrect: false,
        rationale:
          'Dark Matter Field is true bright expanse beyond the Firmament; the dome projects fake sky illusions inside.',
      },
      {
        label: 'C',
        text: 'Is the Ice Wall that partitions Realm-2 from Realm-3.',
        isCorrect: false,
        rationale:
          'Ice Walls are horizontal land/realm partitions; the dome is the inner sky technology layer.',
      },
      {
        label: 'D',
        text: 'Is switched on permanently by the G.A.A. at the Sky Event.',
        isCorrect: false,
        rationale:
          'At the Sky Event the G.A.A. permanently switches the inner dome off.',
      },
    ],
    hint: 'Inner sieve — fake stars, masks true boundary.',
    correctAnswer: 'A',
  },
  {
    number: 20,
    question:
      'How did hostile extraterrestrials first handle entry through the Firmament?',
    options: [
      {
        label: 'A',
        text: 'They breached the membrane in crafts, but ambient frequencies inside were too high for 4th-density beings to disembark without a compromised human vessel (a "Sold Soul") as an energetic key.',
        isCorrect: true,
        rationale:
          'Crafts can breach the protective membrane, yet early on 4th-density parasites needed a Sold Soul human vessel as an energetic key to disembark under high ambient frequencies.',
      },
      {
        label: 'B',
        text: 'They walked through Ice Walls as tourists with no craft or vessel.',
        isCorrect: false,
        rationale:
          'Entry is described as craft breach of the membrane plus Sold Soul keys for physical disembarking.',
      },
      {
        label: 'C',
        text: 'Asteroids carried them in as real space debris through open holes.',
        isCorrect: false,
        rationale:
          'Real space debris does not exist or penetrate; asteroid visuals are dome projections.',
      },
      {
        label: 'D',
        text: 'Freemasons opened the Dark Matter Field gate every full moon only.',
        isCorrect: false,
        rationale:
          'Parasites breached with crafts and Sold Soul keys; Freemasons enforce globe lies on the ground.',
      },
    ],
    hint: 'Craft breach + Sold Soul energetic key under high frequency.',
    correctAnswer: 'A',
  },
  {
    number: 21,
    question: 'What is the truth about asteroids and Earth craters?',
    options: [
      {
        label: 'A',
        text: 'Real space debris does not exist or penetrate the Firmament; asteroid visuals are projections on the inner dome, while physical craters come from biological or energetic weapons delivered via portals opened by parasites from outside.',
        isCorrect: true,
        rationale:
          'Asteroids are myth projections on the dome. Real craters are weapon strikes through parasite portals from outside the Firmament.',
      },
      {
        label: 'B',
        text: 'Random natural asteroids constantly punch clean holes in both sky layers.',
        isCorrect: false,
        rationale:
          'Random asteroid strikes are myth; the Firmament is not perforated by real space debris.',
      },
      {
        label: 'C',
        text: 'All craters are painted by Freemason libraries for education.',
        isCorrect: false,
        rationale:
          'Craters are physical results of weapons via portals, not library art projects.',
      },
      {
        label: 'D',
        text: 'Craters form only when Black Void Plasma freezes into Ice Walls.',
        isCorrect: false,
        rationale:
          'Plasma blackens the sky; Ice Walls partition lands; crater cause is portal-delivered weapons.',
      },
    ],
    hint: 'Asteroids = dome projections; craters = portal weapons.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question:
      'How does true Firmament architecture dismantle Heliocentrism and globe spin?',
    options: [
      {
        label: 'A',
        text: 'Planets do not orbit suns, and Earth does not rotate at nearly 1,000 miles per hour; the cosmos is a vast connected horizontal plain on Gateway-10.',
        isCorrect: true,
        rationale:
          'No orbital suns, no nearly 1,000 mph globe spin — cosmology is a connected horizontal plain on Gateway-10 under Firmament enclosure.',
      },
      {
        label: 'B',
        text: 'Earth spins faster than 1,000 miles per hour so the Firmament can stay attached.',
        isCorrect: false,
        rationale:
          'The claim of near-1,000 mph rotation is rejected; flat horizontal layout replaces spin models.',
      },
      {
        label: 'C',
        text: 'Only Realm-3 orbits Polaris while Realm-2 remains a vacuum globe.',
        isCorrect: false,
        rationale:
          'Realm-3 is a partitioned flat segment; Polaris figures in Sky Event pixelation, not orbital truth.',
      },
      {
        label: 'D',
        text: 'Heliocentrism remains true but uses Ice Walls as planetary rings.',
        isCorrect: false,
        rationale:
          'Heliocentrism is completely dismantled; Ice Walls partition flat plains.',
      },
    ],
    hint: 'No sun orbits, no 1,000 mph spin — horizontal Gateway-10 plain.',
    correctAnswer: 'A',
  },
  {
    number: 23,
    question: 'What happens during the impending Sky Event?',
    options: [
      {
        label: 'A',
        text: 'The Galactic Ancestral Alliance (G.A.A.) permanently switches off the inner Holographic Projection Dome.',
        isCorrect: true,
        rationale:
          'At the Sky Event the G.A.A. permanently shuts off the inner Holographic Projection Dome — terminal dismantling of the sky deception.',
      },
      {
        label: 'B',
        text: 'Freemasons permanently switch the dome to brighter fake stars.',
        isCorrect: false,
        rationale:
          'G.A.A. turns the dome off; Freemasons were enforcers of the globe lie, not Sky Event operators.',
      },
      {
        label: 'C',
        text: 'Parasites rebuild a Dyson Sphere with pillars hundreds of miles high.',
        isCorrect: false,
        rationale:
          'The event exposes truth by removing dome and plasma, not building globe pillars.',
      },
      {
        label: 'D',
        text: 'Ice Walls melt so Realm-3 becomes a spinning sphere again.',
        isCorrect: false,
        rationale:
          'The architecture is flat; the Sky Event peels projection and plasma to reveal bright true space.',
      },
    ],
    hint: 'G.A.A. permanently switches off the inner dome.',
    correctAnswer: 'A',
  },
  {
    number: 24,
    question:
      'What will the structural dismantling look like, and what is exposed afterward?',
    options: [
      {
        label: 'A',
        text: 'Melting pixelation cascading from the star Polaris all the way downwards past the observer\'s knees; with Black Void Plasma stripped away, the bright white light of the Dark Matter Field behind the firmament is shockingly exposed.',
        isCorrect: true,
        rationale:
          'Dome shutdown appears as Polaris-origin melting pixelation falling past the knees; plasma removal exposes bright white Dark Matter Field behind the Firmament.',
      },
      {
        label: 'B',
        text: 'A gentle fade to black vacuum with no pixelation and no white light.',
        isCorrect: false,
        rationale:
          'The visual is cascading pixelation from Polaris, then shocking bright white exposure — not a fade to empty black.',
      },
      {
        label: 'C',
        text: 'Only Antarctica\'s Ice Wall flashing once with no sky change.',
        isCorrect: false,
        rationale:
          'The cascade is a full sky structural dismantling from Polaris downward past the knees.',
      },
      {
        label: 'D',
        text: 'Fake stars brighten while Black Void Plasma thickens forever.',
        isCorrect: false,
        rationale:
          'Plasma is stripped away and the dome is switched off — concealment ends.',
      },
    ],
    hint: 'Polaris pixelation past the knees — then bright white exposure.',
    correctAnswer: 'A',
  },
  {
    number: 25,
    question:
      'What hits unawakened masses at true Firmament exposure, and why does knowing this matter now?',
    options: [
      {
        label: 'A',
        text: 'Catastrophic psychological failure, sheer terror, and mass catatonia — especially for NPCs and devout followers of perceived scientific knowledge; understanding the true Earth shape and Firmament is the mandatory first step to comprehend the Great Spiritual Awakening.',
        isCorrect: true,
        rationale:
          'Unawakened masses, NPCs, and science-devout minds face terror and catatonia when the globe illusion collapses. Grasping flat Earth and the Firmament is the absolute first step into the Great Spiritual Awakening.',
      },
      {
        label: 'B',
        text: 'Mild curiosity only, because Heliocentrism remains intact after the Sky Event.',
        isCorrect: false,
        rationale:
          'Globe illusion collapses completely; psychological failure is catastrophic, not mild curiosity.',
      },
      {
        label: 'C',
        text: 'Instant promotion to 33rd-degree Freemason for every NPC.',
        isCorrect: false,
        rationale:
          'NPCs face catatonia and terror; Freemason ranks enforced the lie, not a reward path at exposure.',
      },
      {
        label: 'D',
        text: 'Nothing — Firmament knowledge is optional trivia after the awakening ends.',
        isCorrect: false,
        rationale:
          'Acknowledging the Firmament is the mandatory first step for any soul seeking to comprehend the Great Spiritual Awakening.',
      },
    ],
    hint: 'NPC/science-devout catatonia — Firmament is first awakening step.',
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

const DESC_SHORT =
  'Test your grasp of the Firmament — flat enclosure, dual-layer sky, Black Void Plasma, Dark Matter Field, Ice Walls, Freemason globe lies, and the G.A.A. Sky Event exposure.';
const DESC_META =
  'Interactive Living Truth Quiz on the Firmament: outer membrane of the flat plain, Holographic Projection Dome, Black Void Plasma, bright white Dark Matter Field, Gateway-10, Ice Walls, and Polaris pixelation at the Sky Event.';

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
      'The Firmament is not myth decoration — it is the outer structural membrane that bends light and sound so physical eyes can see, fitted only to a flat horizontal plain. Globe spin, Heliocentrism, black vacuum, and random asteroids are prison software: dual sieves, Black Void Plasma, fake stars on the inner dome, Ice Walls, and 33rd-degree enforcement keep curiosity dead beyond Antarctica. Sit with what you missed, then return to the Firmament deep-dive. When the G.A.A. kills the Projection Dome, Polaris melts into pixelation past your knees and bright white Dark Matter Field light hits — NPCs and science-devout minds meet catatonia. Knowing the Firmament now is the mandatory first step into the Great Spiritual Awakening.',
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
      "  { path: '/quiz/alice/finance-fake-money.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/false-history.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/fake-linear-time.html', priority: '0.75', changefreq: 'monthly' },",
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
[0, 7, 16, 20, 23, 24].forEach((i) => {
  const c = questions[i].options.find((o) => o.isCorrect);
  console.log(` Q${questions[i].number}: ${c.text.slice(0, 110)}`);
});
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('PASS: audited 25/25 against data/alice-topics/firmament.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
