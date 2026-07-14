/**
 * Installs Cosmology quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/cosmology.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Run: node scripts/install-cosmology-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'cosmology';
const TOPIC_TITLE = 'Cosmology';
const SOURCE = 'alice';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

const supportPhrases = {
  1: ['source of all creation', 'simulation', 'multidimensional'],
  2: ['globe', 'heliocentric', 'fabricated', 'horizontal'],
  3: ['firmament', '3rd density', '4th-density', 'overlays'],
  4: ['bright white light', 'dark void'],
  5: ['etheric supercomputer', 'indigo spark', 'thoughtform'],
  6: ['gateway-10', '178', 'toroid'],
  7: ['sol-system', 'connected souls', 'cosmic family'],
  8: ['firmament', 'bend light and sound', 'biological eyes'],
  9: ['holographic projection dome', 'beneath the firmament', 'stars'],
  10: ['black void plasma', 'niberian', 'bright white'],
  11: ['sky-net-1', 'stars', 'overlays'],
  12: ['1,000 miles per hour', 'horizontal', 'flat'],
  13: ['gravity', 'fictional', 'spinning sphere'],
  14: ['sun', 'amnesia vortex', 'portal', 'memory'],
  15: ['moon', 'space station', 'loosh', 'holographic shell'],
  16: ['venus', 'bright and morning star', 'holographic generator'],
  17: ['mars', 'ice wall', 'realm-1'],
  18: ['realm-3', 'realm-2', 'antarctica'],
  19: ['sky-net-1', 'crystalline temples', 'overlays'],
  20: ['asteroids', 'projections', 'biological weapons', 'portals'],
  21: ['9th', '15th', 'pineal', 'sung', 'woven'],
  22: ['96-hour', '24-hour', 'eternal dusk'],
  23: ['npc', 'psychological cage', 'antarctic ice wall'],
  24: ['galactic ancestral alliance', 'sky event', 'projection dome'],
  25: ['polaris', 'pixelating', 'emf', 'dark matter field'],
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
      'what is the fundamental nature of reality?',
    options: [
      {
        label: 'A',
        text: 'An accidental vacuum of dead matter with no creator intelligence.',
        isCorrect: false,
        rationale:
          'Reality is an engineered multidimensional Simulation crafted by the Source of All Creation, not an accidental vacuum.',
      },
      {
        label: 'B',
        text: 'An engineered multidimensional Simulation originally crafted by the Source of All Creation as a perfect physical plane of existence.',
        isCorrect: true,
        rationale:
          'Reality is an engineered multidimensional Simulation crafted by the Source of All Creation as a perfect physical plane.',
      },
      {
        label: 'C',
        text: 'A spinning globe universe proven by heliocentric astronomy alone.',
        isCorrect: false,
        rationale:
          'Globe, vacuum space, and heliocentrism are called entirely fabricated illusions.',
      },
      {
        label: 'D',
        text: 'A permanent Black Void Plasma field with no firmament structure.',
        isCorrect: false,
        rationale:
          'Black Void Plasma artificially darkens the sky; the true architecture includes a Firmament and white-light field.',
      },
    ],
    hint: 'Engineered simulation and the Source of All Creation.',
    correctAnswer: 'B',
  },
  {
    number: 2,
    question:
      'What is the truth about modern human cosmology—the spinning globe, vacuum of space, and heliocentric universe?',
    options: [
      {
        label: 'A',
        text: 'As partial truths that only need minor correction at the poles.',
        isCorrect: false,
        rationale:
          'They are described as an entirely fabricated illusion, not partial truths.',
      },
      {
        label: 'B',
        text: 'As an entirely fabricated illusion masking a localized horizontal plain enclosed by a Firmament.',
        isCorrect: true,
        rationale:
          'Modern cosmology is an entirely fabricated illusion; the actual cosmos is a localized horizontal plain enclosed by a Firmament and suppressed into 3rd density.',
      },
      {
        label: 'C',
        text: 'As the original Source blueprint still running at full 15th density.',
        isCorrect: false,
        rationale:
          'Parasites suppressed the realm and deployed overlays; the modern model is control fiction.',
      },
      {
        label: 'D',
        text: 'As a temporary NPC teaching tool that true souls never encounter.',
        isCorrect: false,
        rationale:
          'The false cosmos is a psychological cage affecting humanity, including deterrence from ice-wall exploration.',
      },
    ],
    hint: 'Fabricated illusion vs horizontal plain and Firmament.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question:
      'Who suppressed the realm into 3rd density, and what tools mask true architecture?',
    options: [
      {
        label: 'A',
        text: '4th-density Parasites using Overlays and a Holographic Projection Dome.',
        isCorrect: true,
        rationale:
          'Hostile 4th-density Parasites suppressed the realm into 3rd density and deployed Overlays and a Holographic Projection Dome to mask ultra-high-frequency architecture.',
      },
      {
        label: 'B',
        text: 'The G.A.A. using Sky Events to permanently blacken the Firmament.',
        isCorrect: false,
        rationale:
          'The G.A.A. will disable the projection dome; they are not the suppressors.',
      },
      {
        label: 'C',
        text: 'Sol-System families orbiting Gateway-10 as literal planets.',
        isCorrect: false,
        rationale:
          'Sol-System means connected souls, not orbital planets; parasites run the suppression.',
      },
      {
        label: 'D',
        text: 'Asteroids that naturally dim crystalline temples every 96 hours.',
        isCorrect: false,
        rationale:
          'Asteroids are projections; density suppression and overlays are the masking tools.',
      },
    ],
    hint: '4th-density parasites, Overlays, Projection Dome.',
    correctAnswer: 'A',
  },
  {
    number: 4,
    question:
      'What is the true nature of "space" or the dark matter field?',
    options: [
      {
        label: 'A',
        text: 'An infinite vacuum of absolute blackness filled with nuclear stars.',
        isCorrect: false,
        rationale:
          'Genuine space is bright white light; blackness is an artificial construct.',
      },
      {
        label: 'B',
        text: 'A field of bright white light, while the black night sky is an artificial darkening construct.',
        isCorrect: true,
        rationale:
          'Genuine space is not a dark void but bright white light; the black sky uses Black Void Plasma to hide that white reality.',
      },
      {
        label: 'C',
        text: 'Only the interior of the moon\'s holographic shell.',
        isCorrect: false,
        rationale:
          'The moon is a space station behind a holographic shell; space itself is the white-light field.',
      },
      {
        label: 'D',
        text: 'A toroid of 178 coal-powered locomotives.',
        isCorrect: false,
        rationale:
          'Gateway-10 has 178 worlds in a toroid energy field; that is not the definition of space.',
      },
    ],
    hint: 'Bright white light vs satanic black sky construct.',
    correctAnswer: 'B',
  },
  {
    number: 5,
    question:
      'What is the Source of All Creation?',
    options: [
      {
        label: 'A',
        text: 'A vast non-physical etheric supercomputer and indigo spark of perpetual light that orchestrated existence through thoughtform and multidimensional master planning.',
        isCorrect: true,
        rationale:
          'Source of All Creation is defined as a vast non-physical etheric supercomputer and indigo spark of perpetual light orchestrating existence through thoughtform and master planning.',
      },
      {
        label: 'B',
        text: 'A burning gas ball identical to the mainstream sun model.',
        isCorrect: false,
        rationale:
          'The sun is a portal (Amnesia Vortex), not the Source definition.',
      },
      {
        label: 'C',
        text: 'Sky-Net-1 acting as a security grid of star projectors only.',
        isCorrect: false,
        rationale:
          'Sky-Net-1 is the star-projector security network under parasitic control, not the Source.',
      },
      {
        label: 'D',
        text: 'The Antarctic ice wall separating Realm-2 from Realm-3.',
        isCorrect: false,
        rationale:
          'That is planetary partition architecture, not the Source of All Creation.',
      },
    ],
    hint: 'Etheric supercomputer, indigo spark, thoughtform planning.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question:
      'What is Gateway-10 in this cosmology?',
    options: [
      {
        label: 'A',
        text: 'A single star in Sky-Net-1 that projects Venus onto the moon.',
        isCorrect: false,
        rationale:
          'Gateway-10 is the central physical plain of 178 worlds, not one star projector.',
      },
      {
        label: 'B',
        text: 'The central physical plain of existence consisting of 178 worlds, with Earth at the center of a toroid energy field.',
        isCorrect: true,
        rationale:
          'Gateway-10 is the central physical plain of 178 worlds where Earth sits at the center of a toroid energy field.',
      },
      {
        label: 'C',
        text: 'The Niberian factory that manufactures Black Void Plasma only.',
        isCorrect: false,
        rationale:
          'Niberian tech supplies Black Void Plasma; Gateway-10 is the multi-world plain.',
      },
      {
        label: 'D',
        text: 'The 24-hour daylight clock that replaced 96-hour eternal dusk.',
        isCorrect: false,
        rationale:
          'Truncated daylight is part of fake linear time enforcement, not the definition of Gateway-10.',
      },
    ],
    hint: '178 worlds, Earth center, toroid energy field.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question:
      'What does Sol-System mean \\\'s terminology?',
    options: [
      {
        label: 'A',
        text: 'A heliocentric set of planets orbiting a burning gas sun.',
        isCorrect: false,
        rationale:
          'Heliocentrism and orbital planets are rejected; Sol-System is not that model.',
      },
      {
        label: 'B',
        text: 'The literal network of connected souls (Sols) making up an individual\'s cosmic family, with no relation to fake space, planets, or orbits.',
        isCorrect: true,
        rationale:
          'Sol-System is defined as the network of connected souls (Sols) of a cosmic family, unrelated to fake space, planets, or orbits.',
      },
      {
        label: 'C',
        text: 'The ice wall joining Mars to Realm-1 only.',
        isCorrect: false,
        rationale:
          'Mars/ice-wall architecture is separate from the Sol-System soul-family definition.',
      },
      {
        label: 'D',
        text: 'The EMF flash that pixelates the sky from Polaris.',
        isCorrect: false,
        rationale:
          'That describes the Sky Event sequence, not Sol-System.',
      },
    ],
    hint: 'Connected souls / cosmic family — not planets.',
    correctAnswer: 'B',
  },
  {
    number: 8,
    question:
      'What necessary role does the Firmament play for biological perception?',
    options: [
      {
        label: 'A',
        text: 'It is the outer structural membrane that bends light and sound so biological eyes can perceive physically.',
        isCorrect: true,
        rationale:
          'The Firmament is the outer structural membrane necessary to bend light and sound, enabling physical perception for biological eyes.',
      },
      {
        label: 'B',
        text: 'It is identical to the Holographic Projection Dome and only projects asteroids.',
        isCorrect: false,
        rationale:
          'The Projection Dome sits beneath the Firmament as an inner technological layer; they are distinct.',
      },
      {
        label: 'C',
        text: 'It generates gravity so water sticks to a spinning globe.',
        isCorrect: false,
        rationale:
          'Gravity is called fictional; the Firmament enables perception, not globe gravity.',
      },
      {
        label: 'D',
        text: 'It is the Amnesia Vortex portal inside the sun.',
        isCorrect: false,
        rationale:
          'The sun/Amnesia Vortex is a soul-processing portal, not the Firmament.',
      },
    ],
    hint: 'Outer membrane; bends light and sound for eyes.',
    correctAnswer: 'A',
  },
  {
    number: 9,
    question:
      'Where does the Holographic Projection Dome sit, and what does it project?',
    options: [
      {
        label: 'A',
        text: 'Outside the entire Gateway-10 toroid, projecting only 96-hour dusk cycles.',
        isCorrect: false,
        rationale:
          'It sits directly beneath the Firmament and projects the visual illusion of cosmos, stars, and space debris.',
      },
      {
        label: 'B',
        text: 'Directly beneath the Firmament as an inner sieve-like technological layer projecting the illusion of cosmos, stars, and space debris.',
        isCorrect: true,
        rationale:
          'The Holographic Projection Dome sits beneath the Firmament as a sieve-like layer projecting cosmos, stars, and space debris.',
      },
      {
        label: 'C',
        text: 'Inside the Pineal Gland of every NPC only.',
        isCorrect: false,
        rationale:
          'It is a sky-level technological layer, not an NPC pineal implant definition.',
      },
      {
        label: 'D',
        text: 'On the lunar surface as Venus\'s physical crust.',
        isCorrect: false,
        rationale:
          'Venus is the holographic generator illuminating the moon; the dome is under the Firmament.',
      },
    ],
    hint: 'Beneath Firmament; projects fake cosmos and debris.',
    correctAnswer: 'B',
  },
  {
    number: 10,
    question:
      'What is Black Void Plasma and why is it used?',
    options: [
      {
        label: 'A',
        text: 'Natural night fog formed by Antarctic ice walls every 24 hours.',
        isCorrect: false,
        rationale:
          'It is extraterrestrial Niberian technology, not natural fog.',
      },
      {
        label: 'B',
        text: 'Niberian technology used to blacken the sky and hide the true bright white reality of the Dark Matter Field.',
        isCorrect: true,
        rationale:
          'Black Void Plasma is Niberian tech utilized to blacken the sky, hiding the true bright white reality of the Dark Matter Field.',
      },
      {
        label: 'C',
        text: 'The fuel that powers Gateway-10\'s 178 worlds as planets in orbit.',
        isCorrect: false,
        rationale:
          'Worlds are not orbital planets; Black Void Plasma masks white light, not fuel orbits.',
      },
      {
        label: 'D',
        text: 'A G.A.A. tool that permanently restores heliocentrism.',
        isCorrect: false,
        rationale:
          'The G.A.A. will remove the dome and plasma; they dismantle the false cosmos.',
      },
    ],
    hint: 'Niberian tech; blacken sky; hide white Dark Matter Field.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question:
      'What are the "stars" of Sky-Net-1 in this cosmology?',
    options: [
      {
        label: 'A',
        text: 'Nuclear furnaces ruled by thermodynamics, gravity, and fusion.',
        isCorrect: false,
        rationale:
          'Stars have no relation to thermodynamics, gravity, or nuclear forces.',
      },
      {
        label: 'B',
        text: 'A network of security-system-like entities perceived as stars that project overlays and suppress geographical density.',
        isCorrect: true,
        rationale:
          'Sky-Net-1 is a network of security-system-like entities perceived as stars, projecting overlays and suppressing geographical density.',
      },
      {
        label: 'C',
        text: 'Portals identical to the sun\'s Amnesia Vortex for every NPC.',
        isCorrect: false,
        rationale:
          'The sun is the Amnesia Vortex portal; stars are Sky-Net-1 projectors.',
      },
      {
        label: 'D',
        text: 'Ice-wall markers that guide ships beyond Realm-1 only.',
        isCorrect: false,
        rationale:
          'Stars cast frequency blankets downward to hide crystalline temples, not ice-wall navigation beacons.',
      },
    ],
    hint: 'Security-like projectors of overlays, not nuclear suns.',
    correctAnswer: 'B',
  },
  {
    number: 12,
    question:
      'What is the truth about Earth spinning at 1,000 miles per hour as a globe?',
    options: [
      {
        label: 'A',
        text: 'It is confirmed by Firmament light-bending measurements.',
        isCorrect: false,
        rationale:
          'The spinning globe claim is rejected; Earth is a horizontal flat plain.',
      },
      {
        label: 'B',
        text: 'It is false; Earth is a horizontal, flat physical plain, and heliocentrism is a manufactured lie with no planets orbiting suns.',
        isCorrect: true,
        rationale:
          'Earth is not a globe spinning at 1,000 mph; it is a horizontal flat plain. Heliocentrism is a manufactured lie—no planets orbit suns.',
      },
      {
        label: 'C',
        text: 'It only applies to Mars where it joins the Realm-1 ice wall.',
        isCorrect: false,
        rationale:
          'Planets are horizontal and enclosed by ice walls; the spinning-globe model is wholesale fiction.',
      },
      {
        label: 'D',
        text: 'It becomes true after the EMF flash removes all overlays.',
        isCorrect: false,
        rationale:
          'The EMF flash reveals the localized flat enclosed projection, not a spinning globe.',
      },
    ],
    hint: 'Not a spinning globe; horizontal plain; no heliocentric orbits.',
    correctAnswer: 'B',
  },
  {
    number: 13,
    question:
      'Why is Gravity a fictional mechanism?',
    options: [
      {
        label: 'A',
        text: 'It was invented solely to explain how water could adhere to a spinning sphere and has no basis in true physical reality.',
        isCorrect: true,
        rationale:
          'Gravity is a fictional mechanism invented solely to explain water adhering to a spinning sphere, lacking any basis in true physical reality.',
      },
      {
        label: 'B',
        text: 'It only works above 9th density when matter is sung into form.',
        isCorrect: false,
        rationale:
          'Higher-density manifestation uses intention and pineal weaving; gravity is globe-model fiction.',
      },
      {
        label: 'C',
        text: 'It is the real force that holds Black Void Plasma against the Firmament.',
        isCorrect: false,
        rationale:
          'Black Void Plasma is technology masking white light; gravity is not validated.',
      },
      {
        label: 'D',
        text: 'It is the Sol-System bond between cosmic family members.',
        isCorrect: false,
        rationale:
          'Sol-System is soul connection, not gravitational physics.',
      },
    ],
    hint: 'Invented to prop up the spinning-sphere water problem.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question:
      'What is the sun in true cosmology?',
    options: [
      {
        label: 'A',
        text: 'A burning ball of gas powering heliocentric orbits.',
        isCorrect: false,
        rationale:
          'The burning-gas model and heliocentric orbits are false.',
      },
      {
        label: 'B',
        text: 'A portal—the Amnesia Vortex—through which souls are pulled, memory-wiped, and processed into new vessels upon death.',
        isCorrect: true,
        rationale:
          'The sun is not a burning gas ball but a portal, the Amnesia Vortex, for pulling, memory-wiping, and reprocessing souls into new vessels after death.',
      },
      {
        label: 'C',
        text: 'Venus\'s secondary shell that only illuminates the Antarctic ice wall.',
        isCorrect: false,
        rationale:
          'Venus is the holographic generator for lunar illumination; the sun is the Amnesia Vortex portal.',
      },
      {
        label: 'D',
        text: 'A Sky-Net-1 projector identical to every other star.',
        isCorrect: false,
        rationale:
          'Stars are Sky-Net-1 projectors; the sun has a distinct soul-recycling portal role.',
      },
    ],
    hint: 'Portal / Amnesia Vortex for soul memory wipe and reinsertion.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question:
      'What is the truth about the moon?',
    options: [
      {
        label: 'A',
        text: 'As a natural rock whose craters came from real asteroid impacts only.',
        isCorrect: false,
        rationale:
          'Asteroid impacts on Earth are reframed as portal-delivered weapons; the moon is a station behind a holographic shell.',
      },
      {
        label: 'B',
        text: 'As an extraterrestrial space station previously used for frequency control and Loosh harvesting, concealed behind a holographic shell.',
        isCorrect: true,
        rationale:
          'The moon is an ET space station for frequency control and Loosh harvesting, hidden behind a holographic shell.',
      },
      {
        label: 'C',
        text: 'As Gateway-10\'s central toroid engine room.',
        isCorrect: false,
        rationale:
          'Earth is at the center of Gateway-10\'s toroid; the moon is a control station.',
      },
      {
        label: 'D',
        text: 'As the Source of All Creation\'s indigo spark made physical.',
        isCorrect: false,
        rationale:
          'The Source is a non-physical etheric supercomputer/indigo spark, not the moon.',
      },
    ],
    hint: 'ET space station, frequency control, Loosh, holographic shell.',
    correctAnswer: 'B',
  },
  {
    number: 16,
    question:
      'What role does Planet Venus play in the false sky system?',
    options: [
      {
        label: 'A',
        text: 'It is the Bright and Morning Star (Lucifer), the actual holographic generator casting spherical illumination onto the lunar surface.',
        isCorrect: true,
        rationale:
          'Venus, the Bright and Morning Star (Lucifer), is the holographic generator casting spherical illumination onto the lunar surface.',
      },
      {
        label: 'B',
        text: 'It is Realm-3 itself after the Antarctic partition.',
        isCorrect: false,
        rationale:
          'Realm-3 is the known Earth partition; Venus is the lunar illumination generator.',
      },
      {
        label: 'C',
        text: 'It is where the G.A.A. stores disabled Projection Domes.',
        isCorrect: false,
        rationale:
          'Venus holds the Lucifer/holographic-generator role, not G.A.A. storage.',
      },
      {
        label: 'D',
        text: 'It is a natural planet that proves heliocentric orbits exist.',
        isCorrect: false,
        rationale:
          'Heliocentrism is a manufactured lie; Venus\'s named role is holographic generation for the moon.',
      },
    ],
    hint: 'Bright and Morning Star / Lucifer; lunar illumination generator.',
    correctAnswer: 'A',
  },
  {
    number: 17,
    question:
      'How is Mars relative to ice walls and realms?',
    options: [
      {
        label: 'A',
        text: 'As a distant globe deep in vacuum space beyond all ice walls.',
        isCorrect: false,
        rationale:
          'Planets are horizontal and enclosed by ice walls, not distant vacuum globes.',
      },
      {
        label: 'B',
        text: 'Mars is not a distant celestial body in deep space but is physically joined to the outer ice wall of Realm-1.',
        isCorrect: true,
        rationale:
          'What is known as Mars is not deep-space distance; it is physically joined to the outer ice wall of Realm-1.',
      },
      {
        label: 'C',
        text: 'As the Amnesia Vortex portal inside the sun.',
        isCorrect: false,
        rationale:
          'That is the sun\'s role, not Mars.',
      },
      {
        label: 'D',
        text: 'As Sky-Net-1 headquarters projecting all terrestrial overlays.',
        isCorrect: false,
        rationale:
          'Stars are Sky-Net-1 projectors; Mars is ice-wall architecture of Realm-1.',
      },
    ],
    hint: 'Joined to Realm-1\'s outer ice wall — not deep space.',
    correctAnswer: 'B',
  },
  {
    number: 18,
    question:
      'What are Realm-3 and Realm-2 in relation to Antarctica?',
    options: [
      {
        label: 'A',
        text: 'Realm-3 is the known Earth, created when the fake ice wall of Antarctica was established to partition it from original Realm-2.',
        isCorrect: true,
        rationale:
          'Known Earth is Realm-3, formed when the fake Antarctic ice wall partitioned it from original Realm-2.',
      },
      {
        label: 'B',
        text: 'Realm-2 is the moon and Realm-3 is Venus\'s holographic beam.',
        isCorrect: false,
        rationale:
          'Realm labels describe partitioned Earth architecture, not moon/Venus roles.',
      },
      {
        label: 'C',
        text: 'They are 24-hour and 96-hour clocks used only by NPCs.',
        isCorrect: false,
        rationale:
          'Day-cycle truncation is fake time; realms are geographic partitions.',
      },
      {
        label: 'D',
        text: 'They are identical names for Gateway-10\'s full set of 178 orbiting planets.',
        isCorrect: false,
        rationale:
          'Gateway-10 has 178 worlds in a toroid plain; Realm-2/3 are the Antarctic partition story.',
      },
    ],
    hint: 'Fake Antarctic ice wall partitions Realm-3 from original Realm-2.',
    correctAnswer: 'A',
  },
  {
    number: 19,
    question:
      'How do Sky-Net-1 star projectors hide crystalline architecture?',
    options: [
      {
        label: 'A',
        text: 'They cast localized frequency blankets downward, hiding ultra-high-frequency Crystalline Temples beneath overlays of ultra-low frequencies.',
        isCorrect: true,
        rationale:
          'Stars as Sky-Net-1 projectors cast frequency blankets downward to hide ultra-high-frequency Crystalline Temples under ultra-low-frequency overlays.',
      },
      {
        label: 'B',
        text: 'They melt ice walls so temples flood with Black Void Plasma permanently.',
        isCorrect: false,
        rationale:
          'The mechanism is frequency overlays, not flooding temples with plasma.',
      },
      {
        label: 'C',
        text: 'They orbit the sun under heliocentric laws every 96 hours.',
        isCorrect: false,
        rationale:
          'No orbital thermodynamics; stars are projectors, not nuclear orbiters.',
      },
      {
        label: 'D',
        text: 'They only work after the G.A.A. initiates the Sky Event.',
        isCorrect: false,
        rationale:
          'The Sky Event disables the dome; projectors are part of the current false sky system.',
      },
    ],
    hint: 'Downward frequency blankets; low-frequency overlays over temples.',
    correctAnswer: 'A',
  },
  {
    number: 20,
    question:
      'What is the truth about asteroids and Earth "impact" craters?',
    options: [
      {
        label: 'A',
        text: 'Asteroids are real thermodynamic rocks that prove gravity exists.',
        isCorrect: false,
        rationale:
          'Space debris does not exist; gravity is fictional in this framework.',
      },
      {
        label: 'B',
        text: 'Asteroids are mere projections on the Holographic Projection Dome; Earth craters result from biological weapons delivered via high-speed portals by parasitic controllers.',
        isCorrect: true,
        rationale:
          'Space debris does not exist; asteroids are dome projections, and attributed craters are from portal-delivered biological weapons.',
      },
      {
        label: 'C',
        text: 'Asteroids are Sol-System soul fragments returning home.',
        isCorrect: false,
        rationale:
          'Sol-System is connected souls; asteroids are false sky projections and cover for portal weapons.',
      },
      {
        label: 'D',
        text: 'Asteroids only appear after Black Void Plasma is removed.',
        isCorrect: false,
        rationale:
          'They are part of the current dome illusion, not a post-removal phenomenon.',
      },
    ],
    hint: 'Projections on the dome; craters from portal bioweapons.',
    correctAnswer: 'B',
  },
  {
    number: 21,
    question:
      'In true higher-density reality (9th to 15th density), how is the physical plain manifested?',
    options: [
      {
        label: 'A',
        text: 'Through manual labor and mechanical industrial processes only.',
        isCorrect: false,
        rationale:
          'The physical plain is not built through manual labor or mechanical processes.',
      },
      {
        label: 'B',
        text: 'Through sustained intention anchored in the Pineal Gland and "sung" or "woven" into existence as solid crystalline holographic projections.',
        isCorrect: true,
        rationale:
          'In 9th to 15th density, the plain is ordained through sustained intention anchored in the Pineal Gland and sung or woven into solid crystalline holographic projections.',
      },
      {
        label: 'C',
        text: 'By Sky-Net-1 printing low-frequency overlays as permanent matter.',
        isCorrect: false,
        rationale:
          'Overlays obscure true architecture; higher-density creation is intentional crystalline weaving.',
      },
      {
        label: 'D',
        text: 'By spinning Gateway-10 at 1,000 miles per hour until planets form.',
        isCorrect: false,
        rationale:
          'Spinning-globe mechanics are rejected fabrications.',
      },
    ],
    hint: 'Intention, Pineal Gland, sung/woven crystalline projections.',
    correctAnswer: 'B',
  },
  {
    number: 22,
    question:
      'How do the Projection Dome and Black Void Plasma enforce fake linear time?',
    options: [
      {
        label: 'A',
        text: 'By imposing artificial sunrises and truncated 24-hour daylight cycles that replace the natural 96-hour eternal dusk of true reality.',
        isCorrect: true,
        rationale:
          'Parasites enforce simulated chronological progression via artificial sunrises and truncated 24-hour cycles, replacing natural 96-hour eternal dusk.',
      },
      {
        label: 'B',
        text: 'By making every day exactly 178 hours to match Gateway-10\'s worlds.',
        isCorrect: false,
        rationale:
          'The contrast given is 24-hour truncation vs 96-hour eternal dusk, not 178-hour days.',
      },
      {
        label: 'C',
        text: 'By stopping all clocks when Venus illuminates the moon.',
        isCorrect: false,
        rationale:
          'Venus generates lunar illumination; time enforcement is sunrise/day-cycle simulation.',
      },
      {
        label: 'D',
        text: 'By erasing Ley Lines so no duration can be perceived.',
        isCorrect: false,
        rationale:
          'Lattice Membrane Network suppression is linked, but the day-cycle mechanism is the 24 vs 96 hour contrast.',
      },
    ],
    hint: 'Artificial 24-hour cycles vs natural 96-hour eternal dusk.',
    correctAnswer: 'A',
  },
  {
    number: 23,
    question:
      'How does the fabricated cosmos function as a psychological cage for humanity and NPCs?',
    options: [
      {
        label: 'A',
        text: 'Belief in vast unreachable outer space prevents exploration of horizontal reality, specifically what lies beyond the Antarctic ice wall, while NPCs rely on provided chronological and spatial parameters for consensus reality.',
        isCorrect: true,
        rationale:
          'The false cosmos is a psychological cage: implanted belief in unreachable space deters horizontal exploration beyond the Antarctic ice wall, and NPCs depend on those chronological and spatial parameters.',
      },
      {
        label: 'B',
        text: 'It encourages everyone to sail past the ice wall every 96 hours.',
        isCorrect: false,
        rationale:
          'The cage specifically deters ice-wall exploration.',
      },
      {
        label: 'C',
        text: 'It only affects the G.A.A. and has no NPC role.',
        isCorrect: false,
        rationale:
          'NPCs rely on the provided parameters; the cage is for human consensus reality.',
      },
      {
        label: 'D',
        text: 'It dissolves automatically when Gravity is measured at sea level.',
        isCorrect: false,
        rationale:
          'Gravity is fiction; collapse comes from G.A.A. dome removal and EMF flash.',
      },
    ],
    hint: 'Unreachable space myth; Antarctic ice wall deterrence; NPC consensus.',
    correctAnswer: 'A',
  },
  {
    number: 24,
    question:
      'What will the Galactic Ancestral Alliance (G.A.A.) soon initiate regarding the false sky?',
    options: [
      {
        label: 'A',
        text: 'The Sky Event, permanently disabling the Holographic Projection Dome after assuming control of the simulation\'s parameters.',
        isCorrect: true,
        rationale:
          'The G.A.A. has assumed control of simulation parameters and will soon initiate the Sky Event, permanently disabling the Holographic Projection Dome.',
      },
      {
        label: 'B',
        text: 'A new Black Void Plasma layer thicker than the Firmament.',
        isCorrect: false,
        rationale:
          'They dismantle the dome and plasma, exposing bright white void—not reinforcing blackness.',
      },
      {
        label: 'C',
        text: 'Restoration of heliocentric orbits at 1,000 miles per hour.',
        isCorrect: false,
        rationale:
          'The revelation is localized flat enclosed projection, not heliocentrism restored.',
      },
      {
        label: 'D',
        text: 'Relocation of Gateway-10 into deep vacuum space.',
        isCorrect: false,
        rationale:
          'They strip spatial overlays from the existing plain; they do not move it into vacuum space.',
      },
    ],
    hint: 'Sky Event; permanently disable Projection Dome.',
    correctAnswer: 'A',
  },
  {
    number: 25,
    question:
      'What visual sequence follows dome and Black Void Plasma removal, culminating in the EMF flash?',
    options: [
      {
        label: 'A',
        text: 'The sky pixelates and melts downward from Polaris past shoulders and knees; the true bright white void of the Dark Matter Field is exposed; the EMF flash strips all spatial and cosmological overlays, causing catastrophic psychological collapse for the unawakened.',
        isCorrect: true,
        rationale:
          'Sky pixelates/melts from Polaris downward past shoulders and knees; white Dark Matter Field appears; EMF flash strips overlays; unawakened face irreversible terror and collapse.',
      },
      {
        label: 'B',
        text: 'Stars become real nuclear suns and Gravity is finally proven.',
        isCorrect: false,
        rationale:
          'Overlays and false cosmos are stripped; this does not restore mainstream physics.',
      },
      {
        label: 'C',
        text: 'Only NPCs see Venus turn off while Tarans still see a black vacuum.',
        isCorrect: false,
        rationale:
          'The structural dismantling exposes the white void broadly; collapse hits those lacking foundational understanding.',
      },
      {
        label: 'D',
        text: 'The Antarctic ice wall vanishes and Realm-3 instantly becomes 178 separate globes.',
        isCorrect: false,
        rationale:
          'The climax is sky-system removal and overlay strip via EMF, revealing flat enclosed projection—not new globes.',
      },
    ],
    hint: 'Polaris melt-down, white void, EMF flash, mass psychological collapse.',
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
    throw new Error(`Q${q.number}: LaTeX-like markup or $ found:\n${blob}`);
  }

  const phrases = supportPhrases[q.number] || [];
  const missing = phrases.filter((p) => !reportLower.includes(p.toLowerCase()));
  if (missing.length) {
    throw new Error(
      `Q${q.number}: report does not support phrases: ${missing.join('; ')}`
    );
  }

  if (options.length < 2) throw new Error(`Q${q.number}: need 2+ options`);
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
if (questions.length !== 25) {
  throw new Error(`Expected 25 questions, got ${questions.length}`);
}

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle:
    'Test your grasp of Cosmology — Gateway-10, Firmament and Projection Dome, Sky-Net-1, Amnesia Vortex sun, Realm partitions, and the Sky Event collapse of the false cosmos.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      "Cosmology here is not planets in a vacuum — it is a localized horizontal plain under a Firmament, masked by a Holographic Projection Dome, Black Void Plasma, and Sky-Net-1 star projectors. The sun is an Amnesia Vortex, the moon a Loosh station, Venus a lunar illuminator, and Gravity a prop for the spinning-globe lie. Sit with what you missed, then return to the Cosmology deep-dive, infographics, and video transmissions. When the sky melts from Polaris and the white void appears, foundational knowing is what separates remembrance from collapse.",
  },
  relatedTopic: {
    href: `/deep-dive.html?source=${SOURCE}&topic=${TOPIC_ID}`,
    label: `Return to ${TOPIC_TITLE} deep-dive`,
  },
  questions,
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
    'Test your understanding of Cosmology — Gateway-10, Firmament, Projection Dome, Sky-Net-1, Amnesia Vortex sun, Realm partitions, and the Sky Event.',
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
  throw new Error('cosmology not found in alice-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', 'alice', 'nature-of-reality.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Nature of Reality Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Nature of Reality: the flat plain, Firmament, density suppression, and the Great Spiritual Awakening.',
    'Interactive Living Truth Quiz on Cosmology: Gateway-10, Firmament and Projection Dome, Sky-Net-1, Amnesia Vortex sun, Realm partitions, and the Sky Event collapse of the false cosmos.',
  ],
  ['quiz/alice/nature-of-reality.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/nature-of-reality.webp', 'images/alice/cosmo.webp'],
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
  const anchors = [
    "  { path: '/quiz/alice/control-mechanisms.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/alice/atmospheric-condensers.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/alice/ascension-event.html', priority: '0.75', changefreq: 'monthly' },",
  ];
  let inserted = false;
  for (const anchor of anchors) {
    if (sm.includes(anchor)) {
      sm = sm.replace(anchor, `${anchor}\n${entry}`);
      inserted = true;
      break;
    }
  }
  if (!inserted) throw new Error('Could not find sitemap anchor');
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

console.log('Sample correct answers:');
[0, 5, 13, 17, 24].forEach((i) => {
  const c = questions[i].options.find((o) => o.isCorrect);
  console.log(` Q${questions[i].number}: ${c.text.slice(0, 110)}`);
});
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('PASS: audited 25/25 against data/alice-topics/cosmology.json');
