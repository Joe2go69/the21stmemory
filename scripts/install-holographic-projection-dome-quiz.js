/**
 * Installs Holographic Projection Dome quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/holographic-projection-dome.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-holographic-projection-dome-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'holographic-projection-dome';
const TOPIC_TITLE = 'Holographic Projection Dome';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/holo.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['holographic projection dome', 'firmament', 'projection screen'],
  2: ['4th-density', '3rd density', 'simulation'],
  3: ['sieve', 'colander', 'firmament'],
  4: ['firmament', 'light and sound', 'perception'],
  5: ['stars', 'space', 'projected illusion'],
  6: ['asteroids', 'projection', 'portals'],
  7: ['moon', 'space station', 'holographic shell'],
  8: ['venus', 'bright and morning star', 'lunar'],
  9: ['two colanders', 'sieves', 'dual'],
  10: ['outer layer', 'firmament', 'physical sight'],
  11: ['inner layer', 'beneath', 'celestial imagery'],
  12: ['sky-net-1', 'stars', 'thermodynamics'],
  13: ['crystalline temples', 'overlays', 'low-density'],
  14: ['project bluebeam', 'ufos', 'abductions'],
  15: ['black rock', 'mt meru', 'north pole'],
  16: ['crystalline temples', 'above and below', 'mask'],
  17: ['black void plasma', 'night', 'bright white'],
  18: ['dark matter field', 'pitch black', 'satanic'],
  19: ['sky event', 'g.a.a', 'switched off'],
  20: ['polaris', 'pixelation', 'knees'],
  21: ['black void plasma', 'bright white', 'true space'],
  22: ['npcs', 'catatonia', 'unawakened'],
  23: ['overlays', 'consensus', 'fabricated enclosure'],
  24: ['simulation', 'source creation', 'hijacked'],
  25: ['finite', 'sky event', 'celestial illusion'],
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
    question: 'What is the Holographic Projection Dome?',
    options: [
      {
        label: 'A',
        text: 'The inner technological layer, structurally like a sieve or colander, positioned directly inside the Firmament to project the simulated visual cosmos to human eyes.',
        isCorrect: true,
        rationale:
          'The dome is the inner sieve-like tech layer inside the Firmament that projects fake celestial visuals onto human perception.',
      },
      {
        label: 'B',
        text: 'The outer structural membrane alone that bends light and sound without any inner projection screen or simulated cosmos.',
        isCorrect: false,
        rationale:
          'That outer membrane is the Firmament; the Projection Dome is the separate inner screen beneath it.',
      },
      {
        label: 'C',
        text: 'A natural cloud deck formed by thermodynamics that creates real distant suns and gravity-bound planets.',
        isCorrect: false,
        rationale:
          'Stars are not thermodynamic suns; the dome projects a fake cosmos rather than hosting natural stellar physics.',
      },
      {
        label: 'D',
        text: 'Only the Black Void Plasma coat on the ground that paints every temple pure white forever.',
        isCorrect: false,
        rationale:
          'Black Void Plasma blacks the night sky; the dome is the sky projection screen for stars, space, and debris.',
      },
    ],
    hint: 'Inner sieve inside the Firmament — projects fake cosmos.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question:
      'In what kind of system does the Holographic Projection Dome operate?',
    options: [
      {
        label: 'A',
        text: 'A free 12th-density classroom run by Source with no parasites and no density suppression of any kind.',
        isCorrect: false,
        rationale:
          'Humanity sits in a parasite-controlled low-density simulation; the dome enforces that false consensus reality.',
      },
      {
        label: 'B',
        text: 'A highly manipulated Simulation controlled by 4th-density parasites inside a deeply suppressed 3rd Density enclosure.',
        isCorrect: true,
        rationale:
          'The dome is a vital barrier inside a 4th-density-parasite Simulation that keeps consciousness in suppressed 3rd Density.',
      },
      {
        label: 'C',
        text: 'A voluntary VR theme park that NPCs can exit whenever they finish a Project Bluebeam ride.',
        isCorrect: false,
        rationale:
          'The dome traps consensus reality; Bluebeam is staged sky theater within the prison, not an exit booth.',
      },
      {
        label: 'D',
        text: 'An open ice-wall tourism network that shows every crystalline temple without overlays or darkness.',
        isCorrect: false,
        rationale:
          'Overlays and the dome hide crystalline architecture; temples are masked, not openly toured.',
      },
    ],
    hint: 'Parasite Simulation — suppressed 3rd Density barrier tech.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question:
      'How does the dome work with Overlays to control perception?',
    options: [
      {
        label: 'A',
        text: 'It only records dreams for later playback and never interacts with terrestrial Overlays or architecture.',
        isCorrect: false,
        rationale:
          'The dome projects cosmos illusion and works with Overlays to obscure unmovable true architecture.',
      },
      {
        label: 'B',
        text: 'It permanently reveals all Nodes so humanity can rebuild Tartarian free energy overnight.',
        isCorrect: false,
        rationale:
          'Sky-Net-1 and overlays hide UHF crystalline temples under low-density frequency blankets.',
      },
      {
        label: 'C',
        text: 'It casts the illusion of cosmos (stars, debris, darkness) while terrestrial Overlays help obscure true unmovable architecture and trap consciousness in a fabricated enclosure.',
        isCorrect: true,
        rationale:
          'Dome plus Overlays enforce false consensus reality — fake sky above, masked architecture, trapped consciousness.',
      },
      {
        label: 'D',
        text: 'It only lights Loosh factories under the Vatican with no sky role at all.',
        isCorrect: false,
        rationale:
          'The dome is a sky projection screen inside the Firmament, not a subterranean lighting plan.',
      },
    ],
    hint: 'Fake cosmos + Overlays = hide true architecture, trap minds.',
    correctAnswer: 'C',
  },
  {
    number: 4,
    question: 'What does the Firmament do that the Projection Dome does not replace?',
    options: [
      {
        label: 'A',
        text: 'It only displays fake UFOs for Project Bluebeam rehearsals without bending light or sound.',
        isCorrect: false,
        rationale:
          'Bluebeam is competing holographic theater; the Firmament bends light and sound for physical sight itself.',
      },
      {
        label: 'B',
        text: 'It is optional decoration that can be removed while physical perception continues unchanged.',
        isCorrect: false,
        rationale:
          'Without the Firmament bending light and sound, perception in this physical reality would be impossible.',
      },
      {
        label: 'C',
        text: 'It solely generates Venus as a natural planet with its own thermodynamics and gravity.',
        isCorrect: false,
        rationale:
          'Venus as Bright and Morning Star is the holographic generator for the Moon shell — not Firmament physics.',
      },
      {
        label: 'D',
        text: 'It is the outer structural membrane that bends light and sound — an absolute necessity for granting physical eyes their perception of the world.',
        isCorrect: true,
        rationale:
          'Firmament is outer membrane for light/sound bending and physical sight; the dome is the inner projection layer.',
      },
    ],
    hint: 'Outer membrane — bend light/sound so eyes can see.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question: 'What is the truth about the visual cosmos and depths of space?',
    options: [
      {
        label: 'A',
        text: 'They are entirely fake — a projected illusion displayed on the Holographic Projection Dome, not a vast universe of real planets and distant suns.',
        isCorrect: true,
        rationale:
          'Visual cosmos and deep space are fake projections on the dome, not genuine planetary vastness.',
      },
      {
        label: 'B',
        text: 'They are fully real vacuum realms that freemasons map honestly in every school textbook without any dome screen.',
        isCorrect: false,
        rationale:
          'Heliocentric vastness is the enforced illusion; the dome is the screen casting that lie.',
      },
      {
        label: 'C',
        text: 'They exist only under Antarctica as liquid sound oceans with no sky technology involved.',
        isCorrect: false,
        rationale:
          'The sky dual-layer system (Firmament + dome) is the mechanism of the celestial fraud.',
      },
      {
        label: 'D',
        text: 'They become real only after Black Void Plasma freezes into permanent true stars each winter.',
        isCorrect: false,
        rationale:
          'Black Void Plasma hides bright white true space; it does not create real distant stars.',
      },
    ],
    hint: 'Entirely fake — projected illusion on the dome screen.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'What is the truth about asteroids and Earth craters?',
    options: [
      {
        label: 'A',
        text: 'Random natural asteroids constantly punch both sky layers, proving deep-space vacuum physics every century.',
        isCorrect: false,
        rationale:
          'Genuine celestial asteroid threats are myth; asteroid visuals are dome projections.',
      },
      {
        label: 'B',
        text: 'Asteroid visuals are merely projections on the dome, while real physical craters come from biological weapons delivered into the realm via portals.',
        isCorrect: true,
        rationale:
          'Asteroids as threats are fake sky projections; craters are portal-delivered biological weapons, not space rocks.',
      },
      {
        label: 'C',
        text: 'All craters are painted by Sky-Net-1 for tourism and have no weapon or projection history.',
        isCorrect: false,
        rationale:
          'Craters are physical weapon results; asteroid look is dome theater, not tourism paint.',
      },
      {
        label: 'D',
        text: 'Asteroids are solid ice walls that migrate from Antarctica to Venus each full moon.',
        isCorrect: false,
        rationale:
          'Ice walls partition flat realms; asteroid myth is dome projection, not migrating ice walls.',
      },
    ],
    hint: 'Asteroids = dome projections; craters = portal weapons.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question: 'What is the Moon in this framework?',
    options: [
      {
        label: 'A',
        text: 'A natural satellite formed by thermodynamics and gravity with no loosh role and no holographic shell.',
        isCorrect: false,
        rationale:
          'The Moon is a negative ET space station for loosh harvest and frequency control inside a holographic shell.',
      },
      {
        label: 'B',
        text: 'Only a Project Bluebeam UFO that lands weekly for public admissions and free healing.',
        isCorrect: false,
        rationale:
          'Bluebeam stages fake UFOs; the Moon is a concealed ET station, not a friendly landing clinic.',
      },
      {
        label: 'C',
        text: 'A negative ET space station used for loosh harvesting and frequency control, concealed entirely within a holographic shell.',
        isCorrect: true,
        rationale:
          'Moon = negative ET station for loosh and frequency control, fully hidden in a holographic shell.',
      },
      {
        label: 'D',
        text: 'The Firmament itself folded into a ball so physical eyes can practice bending sound only at night.',
        isCorrect: false,
        rationale:
          'Firmament is the outer membrane; the Moon is a separate holographically shelled station.',
      },
    ],
    hint: 'ET space station — loosh + frequency control in a holographic shell.',
    correctAnswer: 'C',
  },
  {
    number: 8,
    question:
      'What is Venus, the "Bright and Morning Star," actually doing?',
    options: [
      {
        label: 'A',
        text: 'It is a natural thermodynamic sun that powers all Sky-Net-1 projectors with pure free energy for temples.',
        isCorrect: false,
        rationale:
          'Venus-as-seen is the holographic generator for lunar spherical illumination, not a free-energy temple sun.',
      },
      {
        label: 'B',
        text: 'It is only a freemason library lamp with no link to the Moon or any holographic generator.',
        isCorrect: false,
        rationale:
          'It is the holographic generator casting spherical illumination onto the lunar surface.',
      },
      {
        label: 'C',
        text: 'It is the Amnesia Vortex portal under the Vatican with no sky appearance at all.',
        isCorrect: false,
        rationale:
          'Venus role here is sky holography for the Moon shell, not the death-memory Sun portal system.',
      },
      {
        label: 'D',
        text: 'It is the holographic generator casting spherical illumination onto the lunar surface — not a natural planet as taught.',
        isCorrect: true,
        rationale:
          'Bright and Morning Star Venus is the generator painting the Moon\'s spherical look, not a genuine planet story.',
      },
    ],
    hint: 'Holographic generator lighting the lunar shell.',
    correctAnswer: 'D',
  },
  {
    number: 9,
    question: 'How is the dual-layer sky structured?',
    options: [
      {
        label: 'A',
        text: 'Like two colanders or sieves sitting one on top of the other — outer Firmament and inner Projection Dome.',
        isCorrect: true,
        rationale:
          'Sky mechanics are dual colanders/sieves: outer Firmament, inner dome stacked together.',
      },
      {
        label: 'B',
        text: 'Like a single solid iron shell with no permeability, projections, or layered roles at all.',
        isCorrect: false,
        rationale:
          'It is dual and sieve-like: outer for perception physics, inner for projected imagery.',
      },
      {
        label: 'C',
        text: 'Like 178 spinning globes nested inside Black Void Plasma with no Firmament membrane.',
        isCorrect: false,
        rationale:
          'Architecture is horizontal dual-layer sky over the realm, not nested spinning globes.',
      },
      {
        label: 'D',
        text: 'Like only Project Bluebeam projectors bolted to ice walls without any colander metaphor.',
        isCorrect: false,
        rationale:
          'Bluebeam is competing sky holography; the base structure is dual colander layers of Firmament and dome.',
      },
    ],
    hint: 'Two colanders/sieves — Firmament outer, dome inner.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'What is the outer layer\'s essential job?',
    options: [
      {
        label: 'A',
        text: 'Only projecting fake stars while the inner layer alone bends light and sound for sight.',
        isCorrect: false,
        rationale:
          'Outer Firmament bends light and sound for sight; inner dome projects celestial imagery.',
      },
      {
        label: 'B',
        text: 'The Firmament must bend light and sound to enable physical sight — without it, perception in this physical reality would be impossible.',
        isCorrect: true,
        rationale:
          'Outer Firmament is mandatory for light/sound bending and physical perception itself.',
      },
      {
        label: 'C',
        text: 'Melting from Polaris every ordinary night as entertainment for NPCs only.',
        isCorrect: false,
        rationale:
          'Polaris pixelation cascade is the impending Sky Event dome shutdown, not nightly outer-layer melt.',
      },
      {
        label: 'D',
        text: 'Generating Black Void Plasma so the Dark Matter Field stays pitch black forever by nature.',
        isCorrect: false,
        rationale:
          'Black Void Plasma is Niberian tech hiding bright white true space; Firmament is light/sound membrane.',
      },
    ],
    hint: 'Outer Firmament — bend light/sound or no physical sight.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question: 'What is the inner layer responsible for?',
    options: [
      {
        label: 'A',
        text: 'Holding atmospheric containment alone with zero celestial imagery or projection duty.',
        isCorrect: false,
        rationale:
          'Inner dome projects celestial imagery; outer Firmament handles the light/sound perception foundation.',
      },
      {
        label: 'B',
        text: 'Only mining gold under Nodes so lattice lines can power freemason trains.',
        isCorrect: false,
        rationale:
          'The inner layer is sky projection tech beneath the Firmament, not subterranean mining.',
      },
      {
        label: 'C',
        text: 'Sitting directly beneath the Firmament and projecting the celestial imagery of the fake cosmos.',
        isCorrect: true,
        rationale:
          'Inner Projection Dome sits under the Firmament and projects the celestial fake-sky imagery.',
      },
      {
        label: 'D',
        text: 'Rebuilding Mt Meru crystalline temples in full public view without any overlay blanket.',
        isCorrect: false,
        rationale:
          'Stars/Sky-Net-1 cast overlays that hide crystalline temples rather than reveal them.',
      },
    ],
    hint: 'Inner dome under Firmament — project celestial imagery.',
    correctAnswer: 'C',
  },
  {
    number: 12,
    question: 'What are stars in this sky system?',
    options: [
      {
        label: 'A',
        text: 'Distant thermodynamic suns operating on gravity that slowly cool into ice walls each millennium.',
        isCorrect: false,
        rationale:
          'Stars are not distant thermodynamic suns; they are Sky-Net-1 projectors.',
      },
      {
        label: 'B',
        text: 'Holes in the Firmament where bright white Dark Matter Field light leaks through naturally without tech.',
        isCorrect: false,
        rationale:
          'True bright white space is hidden by Black Void Plasma; stars are Sky-Net-1 projector entities.',
      },
      {
        label: 'C',
        text: 'Only freemason lighthouse bulbs wired to coal plants after the Industrial Revolution.',
        isCorrect: false,
        rationale:
          'Stars are security-system-like Sky-Net-1 projectors casting overlays and suppressing density.',
      },
      {
        label: 'D',
        text: 'Sky-Net-1 projectors — not distant suns on thermodynamics or gravity — casting overlays and suppressing geographic density.',
        isCorrect: true,
        rationale:
          'Perceived stars are Sky-Net-1 projectors that cast overlays and suppress geographic density.',
      },
    ],
    hint: 'Sky-Net-1 projectors — overlays and density suppression.',
    correctAnswer: 'D',
  },
  {
    number: 13,
    question:
      'How do star projectors hide ultra-high-frequency crystalline temples?',
    options: [
      {
        label: 'A',
        text: 'They cast localized overlays onto the Earth, blanketing those temples under low-density frequencies so they stay invisible in 3rd Density perception.',
        isCorrect: true,
        rationale:
          'Sky-Net-1 projectors cast localized low-density overlays that hide UHF crystalline temples from 3rd Density eyes.',
      },
      {
        label: 'B',
        text: 'They spotlight every temple in bright white light so tourists can map free-energy Nodes weekly.',
        isCorrect: false,
        rationale:
          'The function is concealment under low-density frequency blankets, not open spotlight tourism.',
      },
      {
        label: 'C',
        text: 'They only affect the Moon shell and never touch Earth architecture or Nodes.',
        isCorrect: false,
        rationale:
          'Overlays are cast onto the Earth to hide crystalline temples on the ground plane.',
      },
      {
        label: 'D',
        text: 'They dissolve Project Bluebeam so only natural asteroids remain as threats.',
        isCorrect: false,
        rationale:
          'Asteroids are dome myths; star projectors hide temples via overlays, separate from Bluebeam UFO theater.',
      },
    ],
    hint: 'Localized low-density overlays hide UHF crystalline temples.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question: 'What is Project Bluebeam in relation to the sky dome system?',
    options: [
      {
        label: 'A',
        text: 'A G.A.A. program that permanently switches off the Projection Dome every solstice for free education.',
        isCorrect: false,
        rationale:
          'G.A.A. initiates the Sky Event dome shutdown; Bluebeam is parasitic fake-UFO holography.',
      },
      {
        label: 'B',
        text: '3rd-density holographic technology used by controllers to project fake UFOs and stage false alien invasion and mass-abduction theater in the sky.',
        isCorrect: true,
        rationale:
          'Project Bluebeam is parasite 3rd-density holography for fake UFOs, invasion staging, and abduction theater.',
      },
      {
        label: 'C',
        text: 'Benevolent true holography from Black Rock that only heals pineal glands with soft green light.',
        isCorrect: false,
        rationale:
          'Benevolent superior holography sits at Black Rock/Mt Meru North Pole; Bluebeam is the parasitic fake-UFO stack.',
      },
      {
        label: 'D',
        text: 'Black Void Plasma rebranded as a charity that restores pitch-black night as a natural mercy.',
        isCorrect: false,
        rationale:
          'Black Void Plasma hides bright white true space; Bluebeam is separate UFO/invasion holographic staging.',
      },
    ],
    hint: 'Parasite 3rd-density holography — fake UFOs and invasion theater.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question:
      'Where is benevolent, superior true holographic technology situated?',
    options: [
      {
        label: 'A',
        text: 'Only inside freemason coal condensers with no North Pole or ice-wall relevance.',
        isCorrect: false,
        rationale:
          'Benevolent holography is at Black Rock (Mt Meru) at the North Pole, projecting across the realm inside the ice wall.',
      },
      {
        label: 'B',
        text: 'Exclusively on Project Bluebeam towers that stage abductions for Loosh harvest only.',
        isCorrect: false,
        rationale:
          'Bluebeam is parasitic; superior true holography is the benevolent Black Rock/Mt Meru system.',
      },
      {
        label: 'C',
        text: 'In the central valve at Black Rock (Mt Meru) at the North Pole, capable of projecting universally across the entire realm inside the ice wall.',
        isCorrect: true,
        rationale:
          'Benevolent ETs hold vastly superior holography at Black Rock/Mt Meru North Pole for realm-wide projection inside the ice wall.',
      },
      {
        label: 'D',
        text: 'Floating freely as ghost orbs that replace the Firmament after each Sky Event rehearsal.',
        isCorrect: false,
        rationale:
          'Ghost/orb theater is separate control content; named benevolent tech is Black Rock/Mt Meru.',
      },
    ],
    hint: 'Black Rock / Mt Meru North Pole — realm-wide inside ice wall.',
    correctAnswer: 'C',
  },
  {
    number: 16,
    question:
      'Why did controllers need projections from above and below after high-frequency crystalline reality?',
    options: [
      {
        label: 'A',
        text: 'To celebrate indestructible temples by making them brighter than the Dark Matter Field for every NPC.',
        isCorrect: false,
        rationale:
          'Controllers project false realities to mask high-frequency crystalline truth, not to celebrate it.',
      },
      {
        label: 'B',
        text: 'To teach Source Creation courses on how to build more Firmaments without any suppression.',
        isCorrect: false,
        rationale:
          'The Simulation is hijacked into a low-density prison; projections mask truth rather than teach Source building.',
      },
      {
        label: 'C',
        text: 'Only to cool Venus so the Moon can become a natural satellite again.',
        isCorrect: false,
        rationale:
          'Venus/Moon holography serves concealment and control; the broader need is masking crystalline high-frequency architecture.',
      },
      {
        label: 'D',
        text: 'Original existence was high-frequency with indestructible crystalline temples, so false realities had to be projected from above and below to mask that truth.',
        isCorrect: true,
        rationale:
          'High-frequency crystalline original reality required dual masking projections so the suppressed simulation could hold.',
      },
    ],
    hint: 'Mask high-frequency crystalline temples — project false realities.',
    correctAnswer: 'D',
  },
  {
    number: 17,
    question: 'What creates the illusion of nighttime blackness?',
    options: [
      {
        label: 'A',
        text: 'Black Void Plasma — Niberian technology blackening the sky to hide the bright white reality of the dark matter field behind a simulated dark void.',
        isCorrect: true,
        rationale:
          'Night blackness is Black Void Plasma simulation hiding bright white dark-matter-field truth beyond the Firmament.',
      },
      {
        label: 'B',
        text: 'Natural empty vacuum beyond the ice wall that has always been pitch black without any technology.',
        isCorrect: false,
        rationale:
          'Pitch black is artificial; true Dark Matter Field is bright white light.',
      },
      {
        label: 'C',
        text: 'Only melting pixelation from Polaris that paints temporary night for Sky Event rehearsals.',
        isCorrect: false,
        rationale:
          'Polaris pixelation is the dome shutdown visual at the Sky Event; night blackness is plasma tech ongoing.',
      },
      {
        label: 'D',
        text: 'Sky-Net-1 projectors switching off so crystalline temples glow as the only light source each evening.',
        isCorrect: false,
        rationale:
          'Sky-Net-1 casts overlays; night blackness is specifically Black Void Plasma concealment of bright white space.',
      },
    ],
    hint: 'Black Void Plasma — fake dark void over bright white truth.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question:
      'What is the Dark Matter Field beyond the Firmament, and what is pitch black?',
    options: [
      {
        label: 'A',
        text: 'Dark Matter Field is empty black vacuum; pitch black is the only honest color of true space forever.',
        isCorrect: false,
        rationale:
          'Dark Matter Field is bright white light; pitch black is a satanic artificial construct.',
      },
      {
        label: 'B',
        text: 'Beyond the Firmament the Dark Matter Field is entirely bright white light; pitch-black darkness is an inherently satanic artificial construct.',
        isCorrect: true,
        rationale:
          'True space beyond is bright white; pitch black night is artificial satanic simulation via plasma concealment.',
      },
      {
        label: 'C',
        text: 'Dark Matter Field is only under the Vatican; pitch black is free energy for Atmospheric Condensers.',
        isCorrect: false,
        rationale:
          'Dark Matter Field is the bright expanse beyond the Firmament, not Vatican basement fuel.',
      },
      {
        label: 'D',
        text: 'Both are Project Bluebeam filters that turn UFOs green during mass abductions only.',
        isCorrect: false,
        rationale:
          'Bluebeam is UFO/invasion holography; bright white field vs artificial black is plasma/Firmament cosmology.',
      },
    ],
    hint: 'Bright white beyond Firmament — pitch black is artificial/satanic.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question: 'What is the Sky Event regarding the Projection Dome?',
    options: [
      {
        label: 'A',
        text: 'A freemason holiday that turns the dome brighter so Bluebeam UFOs look more real forever.',
        isCorrect: false,
        rationale:
          'Sky Event is G.A.A.-driven permanent switch-off of the inner dome, ending the celestial illusion.',
      },
      {
        label: 'B',
        text: 'A voluntary NPC vote to keep Black Void Plasma as a comfort blanket after the flash.',
        isCorrect: false,
        rationale:
          'Plasma is stripped as part of the reveal sequence; NPCs face psychological collapse, not a comfort vote.',
      },
      {
        label: 'C',
        text: 'The impending moment when the G.A.A. permanently switches off the inner Holographic Projection Dome, dismantling the celestial illusion.',
        isCorrect: true,
        rationale:
          'Sky Event = G.A.A. permanently kills the inner dome so the celestial illusion ends.',
      },
      {
        label: 'D',
        text: 'The night Venus stops generating Moon light so asteroids become real space rocks again.',
        isCorrect: false,
        rationale:
          'Asteroids stay myth projections until the dome system fails; Sky Event is dome switch-off, not asteroid legitimization.',
      },
    ],
    hint: 'G.A.A. permanently switches off the inner dome.',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question:
      'What does the structural failure of the dome look like to the observer?',
    options: [
      {
        label: 'A',
        text: 'A gentle fade to natural black vacuum with no pixelation and no cascade from any star.',
        isCorrect: false,
        rationale:
          'Visual is melting pixelation cascading from Polaris downward past shoulders and knees.',
      },
      {
        label: 'B',
        text: 'Only Antarctica flashing once while the rest of the sky stays fully intact forever.',
        isCorrect: false,
        rationale:
          'The cascade is a full sky structural failure from Polaris downward through the observer\'s field.',
      },
      {
        label: 'C',
        text: 'Stars brightening into thermodynamic suns while the dome thickens for another 178,000 years.',
        isCorrect: false,
        rationale:
          'The dome is switched off; stars-as-projectors fail with melting pixelation, not a long thickening.',
      },
      {
        label: 'D',
        text: 'Melting pixelation cascading downwards from the star Polaris, moving past the observer\'s shoulders and knees.',
        isCorrect: true,
        rationale:
          'Dome failure appears as Polaris-origin melting pixelation falling past shoulders and knees.',
      },
    ],
    hint: 'Polaris melting pixelation — past shoulders and knees.',
    correctAnswer: 'D',
  },
  {
    number: 21,
    question:
      'What is exposed after the dome fails and Black Void Plasma is removed?',
    options: [
      {
        label: 'A',
        text: 'The bright white void of true space — the shocking white cosmos that was hidden behind simulated darkness.',
        isCorrect: true,
        rationale:
          'Plasma removal after dome failure exposes bright white true space beyond the fake dark void.',
      },
      {
        label: 'B',
        text: 'Only more pitch-black vacuum with denser fake asteroids and permanent Bluebeam UFOs.',
        isCorrect: false,
        rationale:
          'The sequence exposes bright white true space, not thicker black vacuum theater.',
      },
      {
        label: 'C',
        text: 'A second stronger Projection Dome installed by NPCs during mass catatonia.',
        isCorrect: false,
        rationale:
          'Inner dome is permanently switched off; NPCs collapse rather than rebuild the screen.',
      },
      {
        label: 'D',
        text: 'Natural spinning globes that finally prove heliocentrism to every freemason school.',
        isCorrect: false,
        rationale:
          'Reveal is white true space and sky-screen collapse — not vindication of the globe model.',
      },
    ],
    hint: 'Bright white true space after plasma strip.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question:
      'What hits NPCs and unawakened masses when the sky screen collapses?',
    options: [
      {
        label: 'A',
        text: 'Mild curiosity and a gentle desire to read more freemason astronomy textbooks.',
        isCorrect: false,
        rationale:
          'They face total psychological collapse, sheer terror, and mass catatonia.',
      },
      {
        label: 'B',
        text: 'Total psychological collapse, sheer terror, and mass catatonia — because they lack foundational understanding to process the end of the simulation.',
        isCorrect: true,
        rationale:
          'NPCs and unawakened masses cannot process dome failure, pixelation, and white cosmos — terror and catatonia follow.',
      },
      {
        label: 'C',
        text: 'Instant promotion to Sky-Net-1 projector operators with free Bluebeam licenses.',
        isCorrect: false,
        rationale:
          'They collapse psychologically; they are not promoted into control hardware roles.',
      },
      {
        label: 'D',
        text: 'Automatic Twin Flame reunion on the Moon station with no fear response.',
        isCorrect: false,
        rationale:
          'The named outcome is terror and catatonia for NPCs/unawakened, not automatic lunar reunions.',
      },
    ],
    hint: 'Psychological collapse, terror, mass catatonia.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question:
      'What primary purpose does the dome serve for human consciousness?',
    options: [
      {
        label: 'A',
        text: 'To free every mind into adjacent ice-wall realms with full crystalline temple maps in hand.',
        isCorrect: false,
        rationale:
          'The dome enforces false consensus reality and keeps consciousness trapped in a fabricated enclosure.',
      },
      {
        label: 'B',
        text: 'To archive Source Creation blueprints so parasites can return to 12th density caretaking.',
        isCorrect: false,
        rationale:
          'The Simulation is hijacked into a prison matrix; the dome maintains the trap, not Source restoration.',
      },
      {
        label: 'C',
        text: 'To enforce a false consensus-based physical reality and keep human consciousness trapped within a fabricated enclosure.',
        isCorrect: true,
        rationale:
          'The dome is a vital barrier that enforces fake consensus reality and traps consciousness in the fabricated enclosure.',
      },
      {
        label: 'D',
        text: 'To train NPCs for organic manifestation above all parasitic density limits without any sky screen.',
        isCorrect: false,
        rationale:
          'NPCs and unawakened are the ones crushed when the screen ends; the dome\'s job is trapping, not liberating training.',
      },
    ],
    hint: 'False consensus reality — trap consciousness in the enclosure.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question: 'What is the Simulation in this cosmology?',
    options: [
      {
        label: 'A',
        text: 'A temporary school play written only by freemasons with no etheric or physical plane component.',
        isCorrect: false,
        rationale:
          'It is the multidimensional etheric supercomputer and physical plane of existence — hijacked into prison.',
      },
      {
        label: 'B',
        text: 'Only Black Void Plasma weather that never needed Source Creation or any hijack history.',
        isCorrect: false,
        rationale:
          'Simulation is Source-crafted then parasite-hijacked; plasma is one concealment layer inside it.',
      },
      {
        label: 'C',
        text: 'A Project Bluebeam subscription service that expires when Venus stops lighting the Moon.',
        isCorrect: false,
        rationale:
          'Bluebeam is staged sky holography inside the larger hijacked Simulation architecture.',
      },
      {
        label: 'D',
        text: 'The multidimensional etheric supercomputer and physical plane originally crafted by Source Creation, hijacked into a low-density prison matrix.',
        isCorrect: true,
        rationale:
          'Simulation = Source-made etheric supercomputer/physical plane, now a parasite low-density prison.',
      },
    ],
    hint: 'Source-crafted plane — hijacked into low-density prison.',
    correctAnswer: 'D',
  },
  {
    number: 25,
    question:
      'What is the strategic status of the projected dome\'s integrity?',
    options: [
      {
        label: 'A',
        text: 'It is finite and ending — G.A.A. control leads to the Sky Event that permanently switches the inner dome off and dismantles the celestial illusion.',
        isCorrect: true,
        rationale:
          'Dome integrity is finite; G.A.A. runs the Sky Event that permanently kills the inner dome and ends the celestial lie.',
      },
      {
        label: 'B',
        text: 'It is eternal and strengthening, with thicker plasma and more Bluebeam UFOs after every NPC census.',
        isCorrect: false,
        rationale:
          'Operation will soon end under G.A.A. Sky Event switch-off — not eternal thickening.',
      },
      {
        label: 'C',
        text: 'It already ended in secret with no Polaris pixelation and no white-space reveal planned.',
        isCorrect: false,
        rationale:
          'Impending Sky Event includes Polaris cascade pixelation and bright white exposure after plasma removal.',
      },
      {
        label: 'D',
        text: 'It only fails for freemasons while NPCs keep a private dome for comfort forever.',
        isCorrect: false,
        rationale:
          'Inner dome is permanently switched off for the sky system; NPCs face mass catatonia at the reveal.',
      },
    ],
    hint: 'Finite dome — G.A.A. Sky Event permanent switch-off.',
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
  'Test your grasp of the Holographic Projection Dome — Firmament dual sky, Sky-Net-1 stars, Moon shell, Bluebeam, Black Void Plasma, and the G.A.A. Sky Event.';
const DESC_META =
  'Interactive Living Truth Quiz on the Holographic Projection Dome: inner sieve under the Firmament, fake cosmos, asteroid myths, Venus-Moon holography, Project Bluebeam, Polaris pixelation, and bright white true space.';

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
      'The Holographic Projection Dome is not poetry about the night sky — it is the inner sieve under the Firmament that paints fake stars, space, and debris while Overlays and Sky-Net-1 bury crystalline temples under low-density fog. Moon as loosh station, Venus as lunar light generator, Bluebeam UFO theater, Black Void Plasma hiding bright white true space: that is the cage. Sit with what you missed, then return to the Holographic Projection Dome deep-dive. G.A.A. runs the Sky Event. When Polaris melts into pixelation past your shoulders and knees and the white cosmos hits, NPCs and the unawakened meet terror and catatonia. Know the screen now — or the end of the simulation will own your mind.',
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
      "  { path: '/quiz/alice/grey-ets.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/giant-skeletons.html', priority: '0.75', changefreq: 'monthly' },",
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
console.log(
  'PASS: audited 25/25 against data/alice-topics/holographic-projection-dome.json'
);
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
