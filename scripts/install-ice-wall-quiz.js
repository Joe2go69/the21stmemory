/**
 * Installs Ice Wall quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/ice-wall.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-ice-wall-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'ice-wall';
const TOPIC_TITLE = 'Ice Wall';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/icewall.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['ice wall', 'partition', 'flat'],
  2: ['gateway-10', 'horizontal', 'spherical'],
  3: ['4th-density', 'artificial', 'adjacent realms'],
  4: ['antarctica', 'realm-3', 'realm-2'],
  5: ['globe earth', 'conceal', 'ice wall'],
  6: ['firmament', 'spherical', 'horizontal'],
  7: ['curiosity', 'explore', 'beyond'],
  8: ['psychological cage', 'globe model', 'perimeter'],
  9: ['known lands', 'quarantining', 'antarctica'],
  10: ['mars', 'realm-1', 'physically'],
  11: ['178', 'gateway-10', 'horizontal worlds'],
  12: ['mt meru', 'north pole', 'holographic'],
  13: ['inside the ice wall', 'projecting', 'partitioned'],
  14: ['outside', 'fundamentally different', 'enclosure'],
  15: ['freemasons', 'flat', 'century'],
  16: ['177', 'compartmentalized', 'ignorant'],
  17: ['north pole', 'emerald palace', 'dampening'],
  18: ['military industrial', '3rd density', 'prison'],
  19: ['prerequisite', 'great spiritual awakening', 'globe'],
  20: ['soul families', 'geographical deception', 'dismantled'],
  21: ['npcs', 'cognitive failure', 'flat cosmology'],
  22: ['perceived scientific', 'unlearning', 'enclosure'],
  23: ['gateway-10', 'placement', 'exit the matrix'],
  24: ['simulation', 'low-density prison', 'manifestation'],
  25: ['physical and psychological', 'perimeter', 'trapped'],
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
    question: 'What is the Ice Wall?',
    options: [
      {
        label: 'A',
        text: 'A physical horizontal boundary built by parasitic controllers to partition the known lands from the rest of the flat adjacent cosmic plains.',
        isCorrect: true,
        rationale:
          'The Ice Wall is a controller-built horizontal partition between known lands and the wider flat cosmic plains.',
      },
      {
        label: 'B',
        text: 'A natural ring of empty vacuum that proves Earth is a spinning sphere with no adjacent realms beyond space.',
        isCorrect: false,
        rationale:
          'Globe vacuum is the manufactured lie; the wall is solid partition on a flat plain, not empty space proof.',
      },
      {
        label: 'C',
        text: 'Only a freemason map legend with no physical existence, drawn solely for library textbooks and tourism ads.',
        isCorrect: false,
        rationale:
          'It is a physical boundary; freemasons hide flat enclosure rather than invent a purely fictional map symbol.',
      },
      {
        label: 'D',
        text: 'A temporary cloud bank over the North Pole that dissolves every summer without partitioning any realm.',
        isCorrect: false,
        rationale:
          'Antarctic partition and realm quarantine are structural; this is not a seasonal cloud bank.',
      },
    ],
    hint: 'Physical horizontal partition of flat adjacent plains.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question:
      'Where does humanity actually sit relative to Gateway-10 and the globe myth?',
    options: [
      {
        label: 'A',
        text: 'On a spherical planet spinning in vacuum at the edge of Gateway-10 with 178 orbiting moons and no ice barriers.',
        isCorrect: false,
        rationale:
          'Humanity is on a suppressed horizontal flat plain at Gateway-10\'s center — not a spinning vacuum sphere.',
      },
      {
        label: 'B',
        text: 'On a highly suppressed horizontal flat plain at the center of Gateway-10 — not a spherical planet spinning in a vacuum.',
        isCorrect: true,
        rationale:
          'True layout is a suppressed flat plain centered in Gateway-10; the spinning globe vacuum model is false.',
      },
      {
        label: 'C',
        text: 'Only inside the Amnesia Vortex under the Vatican with no geographical plain or Gateway placement at all.',
        isCorrect: false,
        rationale:
          'Gateway-10 is the central physical plain of 178 worlds; Ice Wall geography is terrestrial flat architecture.',
      },
      {
        label: 'D',
        text: 'Floating freely beyond all ice walls as pure consciousness with no partitioned Realm-3 enclosure.',
        isCorrect: false,
        rationale:
          'Humanity is quarantined in Realm-3 behind the Antarctic partition, not free beyond all walls.',
      },
    ],
    hint: 'Suppressed flat plain at Gateway-10 center — not a globe.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question: 'Why did 4th-density controllers erect the Ice Wall boundaries?',
    options: [
      {
        label: 'A',
        text: 'To help humanity freely migrate into all 178 worlds with open curiosity and no quarantine of the Known Lands.',
        isCorrect: false,
        rationale:
          'Walls prevent expansion and exploration of adjacent realms — they quarantine, not liberate.',
      },
      {
        label: 'B',
        text: 'To create seasonal ski tourism that funds free crystalline temples at every Node without suppression.',
        isCorrect: false,
        rationale:
          'The wall is a control perimeter; North Pole ice also dampens UHF structures like the Emerald Palace.',
      },
      {
        label: 'C',
        text: 'To stop human consciousness from expanding and physically exploring the vast adjacent realms of existence on the flat plain.',
        isCorrect: true,
        rationale:
          'Artificial ice boundaries block consciousness expansion and physical exploration of adjacent flat realms.',
      },
      {
        label: 'D',
        text: 'To prove heliocentrism by fencing off only the equator while leaving poles fully open for globe navigation.',
        isCorrect: false,
        rationale:
          'The globe lie hides the wall; Antarctica partitions Realm-3 rather than proving orbital spheres.',
      },
    ],
    hint: 'Block expansion and exploration of adjacent flat realms.',
    correctAnswer: 'C',
  },
  {
    number: 4,
    question: 'What is Antarctica in this framework?',
    options: [
      {
        label: 'A',
        text: 'A natural continent of ordinary wildlife with no role in partitioning Realm-2 from Realm-3 or fencing Gateway-10.',
        isCorrect: false,
        rationale:
          'Antarctica is the engineered fake ice wall that severs human reality and creates Realm-3 quarantine.',
      },
      {
        label: 'B',
        text: 'Only the outer ice boundary of Realm-1 that freemasons openly label as Mars for schoolchildren.',
        isCorrect: false,
        rationale:
          'Mars is joined to Realm-1\'s outer ice wall; Antarctica is the fake wall carving Realm-3 from Realm-2.',
      },
      {
        label: 'C',
        text: 'A Project Bluebeam hologram with no physical ice, used only for UFO theater at the South Pole.',
        isCorrect: false,
        rationale:
          'Antarctica is a physical engineered partition, not mere Bluebeam sky theater.',
      },
      {
        label: 'D',
        text: 'The specific fake ice wall engineered to sever human reality from the broader plain, artificially creating Realm-3 (the Known Lands).',
        isCorrect: true,
        rationale:
          'Antarctica is the engineered fake ice wall that carves quarantined Realm-3 out of original Realm-2.',
      },
    ],
    hint: 'Fake ice wall — severs human reality, creates Realm-3.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question: 'Why was the entire globe Earth lie engineered?',
    options: [
      {
        label: 'A',
        text: 'Specifically to conceal the Ice Wall so humanity stays intellectually and physically trapped inside the designated enclosure.',
        isCorrect: true,
        rationale:
          'The globe model exists to hide the Ice Wall and keep humanity trapped in the enclosure without curiosity to cross it.',
      },
      {
        label: 'B',
        text: 'To encourage mass expeditions beyond Antarctica with freemason funding and open Gateway-10 maps for all NPCs.',
        isCorrect: false,
        rationale:
          'The globe neutralizes curiosity about what lies beyond the wall rather than funding exploration.',
      },
      {
        label: 'C',
        text: 'To restore Realm-2 as public housing while deleting all ice barriers from the flat plain forever.',
        isCorrect: false,
        rationale:
          'Realm-3 quarantine via Antarctica is the control state; globe myth protects that partition.',
      },
      {
        label: 'D',
        text: 'To teach honest Cosmology of 178 horizontal worlds in every university physics course without compartmentalization.',
        isCorrect: false,
        rationale:
          'Even freemasons stay partly ignorant of full Gateway-10; globe science hides flat enclosure basics.',
      },
    ],
    hint: 'Globe lie hides the Ice Wall — traps minds and bodies.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question:
      'How does the Ice Wall dismantle the globe-Earth scientific model?',
    options: [
      {
        label: 'A',
        text: 'It proves spheres can support a Firmament with endless vacuum oceans and no need for flat architecture at all.',
        isCorrect: false,
        rationale:
          'A sphere cannot sustain life or support the light-bending Firmament; planets are horizontal situations.',
      },
      {
        label: 'B',
        text: 'Physical planets operate as a horizontal situation; a spherical planet is a structural impossibility that could neither sustain life nor support the necessary light-bending Firmament.',
        isCorrect: true,
        rationale:
          'Ice Wall cosmology is flat/horizontal; globes fail life support and Firmament mechanics.',
      },
      {
        label: 'C',
        text: 'It only rearranges textbook footnotes while leaving spinning-globe physics completely valid for navigation.',
        isCorrect: false,
        rationale:
          'The wall thoroughly dismantles globe deception as foundational Cosmology, not a footnote tweak.',
      },
      {
        label: 'D',
        text: 'It shows Mars is a distant thermodynamic sun powering all ice barriers with gravity alone.',
        isCorrect: false,
        rationale:
          'Mars is adjacent flat landmass joined to Realm-1\'s outer ice wall — not a distant sun.',
      },
    ],
    hint: 'Horizontal planets — sphere cannot hold Firmament or life.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question:
      'What would happen if the population knew an ice wall surrounded them instead of empty space?',
    options: [
      {
        label: 'A',
        text: 'Nothing — curiosity would die immediately and everyone would prefer the globe model forever without exploration drive.',
        isCorrect: false,
        rationale:
          'Knowing the wall would incite mass curiosity and unstoppable drive to explore beyond it.',
      },
      {
        label: 'B',
        text: 'Only freemasons would care, while NPCs automatically forget ice within fifteen minutes of any briefing.',
        isCorrect: false,
        rationale:
          'The controllers fear population-wide curiosity and exploration, not freemason-only interest.',
      },
      {
        label: 'C',
        text: 'It would naturally incite mass curiosity and an unstoppable drive to explore what lies beyond that boundary.',
        isCorrect: true,
        rationale:
          'Ice-wall awareness sparks mass curiosity and drive to explore beyond — exactly why the globe myth is forced.',
      },
      {
        label: 'D',
        text: 'Everyone would instantly relocate to the Emerald Palace without needing to unlearn any scientific pillars.',
        isCorrect: false,
        rationale:
          'Emerald Palace is dampened/hidden at the North Pole; awakening still requires unlearning globe science.',
      },
    ],
    hint: 'Mass curiosity + unstoppable drive to explore beyond.',
    correctAnswer: 'C',
  },
  {
    number: 8,
    question: 'How does the globe model function as a cage around the Ice Wall?',
    options: [
      {
        label: 'A',
        text: 'It advertises the wall as a public park boundary with free tickets beyond Antarctica for every tourist.',
        isCorrect: false,
        rationale:
          'The globe neutralizes curiosity, turning the physical perimeter into an unquestioned psychological cage.',
      },
      {
        label: 'B',
        text: 'It only confuses railroad schedules without affecting intellectual or physical exploration of adjacent plains.',
        isCorrect: false,
        rationale:
          'The globe keeps humanity intellectually and physically trapped in the designated enclosure.',
      },
      {
        label: 'C',
        text: 'It strengthens Twin Flame navigation so souls automatically walk through ice into Realm-1 each night.',
        isCorrect: false,
        rationale:
          'The model kills curiosity about beyond-wall exploration rather than enabling night walks into Realm-1.',
      },
      {
        label: 'D',
        text: 'It neutralizes curiosity about the perimeter, transforming the physical Ice Wall into an unquestioned psychological cage.',
        isCorrect: true,
        rationale:
          'Globe myth kills the urge to question or cross the wall — physical perimeter becomes psychological cage.',
      },
    ],
    hint: 'Globe kills curiosity — wall becomes unquestioned mental cage.',
    correctAnswer: 'D',
  },
  {
    number: 9,
    question: 'How were the Known Lands partitioned into Realm-3?',
    options: [
      {
        label: 'A',
        text: 'Realm-3 was forcefully carved from original Realm-2 by creating the fake ice wall of Antarctica, quarantining the human population.',
        isCorrect: true,
        rationale:
          'Known Lands (Realm-3) were cut out of Realm-2 via Antarctica\'s fake ice wall, quarantining humanity.',
      },
      {
        label: 'B',
        text: 'Realm-3 formed naturally when 178 globes collided and left Antarctica as leftover vacuum frost only.',
        isCorrect: false,
        rationale:
          'Partition is engineered quarantine on a flat plain, not colliding-globe leftover frost.',
      },
      {
        label: 'C',
        text: 'Realm-3 is the entire Gateway-10 plain with no Antarctic cut and no separate Realm-2 history.',
        isCorrect: false,
        rationale:
          'Realm-3 is the localized inhabited segment; Realm-2 was the wider original center plane.',
      },
      {
        label: 'D',
        text: 'Realm-3 is only the Moon shell, partitioned by Venus holography with no Earth ice wall involved.',
        isCorrect: false,
        rationale:
          'Realm-3 is the Known Lands of the flat Earth, carved by Antarctic ice partition.',
      },
    ],
    hint: 'Carved from Realm-2 by fake Antarctic ice — quarantine.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'Where is Mars relative to the Ice Wall layout?',
    options: [
      {
        label: 'A',
        text: 'A celestial sphere millions of miles away in vacuum, unrelated to any ice boundary or adjacent flat realm.',
        isCorrect: false,
        rationale:
          'Mars is not a distant sky sphere; it is landmass attached to Realm-1\'s outer Ice Wall.',
      },
      {
        label: 'B',
        text: 'Not a distant sky planet — it is physically attached to the outer Ice Wall of Realm-1 on the horizontal plain.',
        isCorrect: true,
        rationale:
          'Because cosmos is horizontal adjacency, Mars is joined to Realm-1\'s outer ice wall, not millions of miles in space.',
      },
      {
        label: 'C',
        text: 'Only a freemason code word for Antarctica used in Military Industrial briefings with no landmass.',
        isCorrect: false,
        rationale:
          'Antarctica partitions Realm-3; Mars is the mislabeled landmass on Realm-1\'s outer wall.',
      },
      {
        label: 'D',
        text: 'The Emerald Palace renamed for tourism after North Pole ice was fully melted by Source.',
        isCorrect: false,
        rationale:
          'Emerald Palace is a UHF structure dampened by North Pole ice; Mars is Realm-1 adjacency geography.',
      },
    ],
    hint: 'Attached to Realm-1 outer Ice Wall — not distant space.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question: 'What is Gateway-10 in Ice Wall Cosmology?',
    options: [
      {
        label: 'A',
        text: 'A single spinning globe with no interconnected worlds and no ice barriers of any kind between regions.',
        isCorrect: false,
        rationale:
          'Gateway-10 is 178 interconnected horizontal worlds on the central physical plain.',
      },
      {
        label: 'B',
        text: 'Only the Antarctic tourist visa office that freemasons run without any multi-world architecture.',
        isCorrect: false,
        rationale:
          'Gateway-10 is the central plain of 178 flat worlds; ice walls separate adjacent realms within it.',
      },
      {
        label: 'C',
        text: 'The central physical plain of existence comprising 178 interconnected horizontal worlds.',
        isCorrect: true,
        rationale:
          'Gateway-10 is the central plain of 178 ice-separated horizontal worlds; humanity\'s realm is one partitioned piece.',
      },
      {
        label: 'D',
        text: 'A Simulation app that deletes ice walls whenever NPCs pass a globe-Earth quiz online.',
        isCorrect: false,
        rationale:
          'Simulation is the inverted prison matrix; Gateway-10 is real multi-world flat architecture.',
      },
    ],
    hint: 'Central plain — 178 interconnected horizontal worlds.',
    correctAnswer: 'C',
  },
  {
    number: 12,
    question:
      'What holographic capability sits at the true North Pole relative to the ice wall?',
    options: [
      {
        label: 'A',
        text: 'Only Project Bluebeam UFO projectors that cannot reach beyond a single city block inside Realm-3.',
        isCorrect: false,
        rationale:
          'Benevolent allies at Mt Meru/Hyperborea can project universally across the partitioned realm inside the ice wall.',
      },
      {
        label: 'B',
        text: 'A freemason coal condenser that blacks the Dark Matter Field without any North Pole central valve.',
        isCorrect: false,
        rationale:
          'The central valve at true North Pole (Mt Meru/Hyperborea) holds advanced benevolent holography.',
      },
      {
        label: 'C',
        text: 'Nothing — the North Pole is empty vacuum identical to the globe model\'s empty space story.',
        isCorrect: false,
        rationale:
          'True North Pole hosts Mt Meru/Hyperborea holography and dampened UHF structures under ice.',
      },
      {
        label: 'D',
        text: 'Benevolent ET allies at Mt Meru / Hyperborea with advanced holography that can project universal visuals across the entire partitioned realm inside the ice wall.',
        isCorrect: true,
        rationale:
          'From the North Pole central valve, benevolent holography covers the whole ice-walled partitioned realm.',
      },
    ],
    hint: 'Mt Meru/Hyperborea — project across realm inside the wall.',
    correctAnswer: 'D',
  },
  {
    number: 13,
    question:
      'What is the limit of that North Pole holographic projection relative to the wall?',
    options: [
      {
        label: 'A',
        text: 'It projects across the entire partitioned realm located inside the ice wall from the central valve.',
        isCorrect: true,
        rationale:
          'Benevolent holography from the central valve covers the partitioned realm inside the ice wall.',
      },
      {
        label: 'B',
        text: 'It only works outside all ice walls and cannot display anything within Realm-3 quarantine.',
        isCorrect: false,
        rationale:
          'Projection is specified across the partitioned realm inside the ice wall.',
      },
      {
        label: 'C',
        text: 'It replaces Antarctica with open ocean every night so Realm-2 merges without awakening work.',
        isCorrect: false,
        rationale:
          'Ice wall partition remains the control geography; holography projects visuals inside that enclosure.',
      },
      {
        label: 'D',
        text: 'It is identical to Black Void Plasma and only paints pitch-black night with no universal visuals.',
        isCorrect: false,
        rationale:
          'This is advanced benevolent holography for universal visuals, not night-blackening plasma.',
      },
    ],
    hint: 'Universal visuals across the realm inside the ice wall.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question: 'How does reality outside the ice wall compare to inside?',
    options: [
      {
        label: 'A',
        text: 'Outside is identical to the human enclosure in every way, with the same suppression and no fundamental difference.',
        isCorrect: false,
        rationale:
          'Existence outside is fundamentally different from the heavily suppressed reality within the enclosure.',
      },
      {
        label: 'B',
        text: 'Outside is fundamentally different from the heavily suppressed reality within; living beyond the barrier is absolutely nothing like living inside the human enclosure.',
        isCorrect: true,
        rationale:
          'Beyond the wall is a stark contrast — nothing like the suppressed enclosure humanity inhabits.',
      },
      {
        label: 'C',
        text: 'Outside is only more globe vacuum with spinning planets and no flat plains or ice-adjacent realms.',
        isCorrect: false,
        rationale:
          'Cosmos is horizontal adjacent realms; outside differs from suppressed enclosure, not as more globe vacuum.',
      },
      {
        label: 'D',
        text: 'Outside does not exist because freemasons deleted the other 177 worlds after one century of secrecy.',
        isCorrect: false,
        rationale:
          '177 other worlds exist beyond ice walls; freemasons are kept ignorant of that full scope.',
      },
    ],
    hint: 'Fundamentally different outside — nothing like the enclosure.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question: 'What have 33rd-degree Freemasons known about the world\'s shape?',
    options: [
      {
        label: 'A',
        text: 'Nothing at all — they fully believe the globe and have never heard of flat enclosure for any length of time.',
        isCorrect: false,
        rationale:
          'They have known the true flat shape for over a century while fiercely guarding the secret.',
      },
      {
        label: 'B',
        text: 'Every detail of all 178 Gateway-10 worlds, taught openly in every Military Industrial classroom.',
        isCorrect: false,
        rationale:
          'Even high-ranking agents often know only flat enclosure, remaining blind to the other 177 worlds.',
      },
      {
        label: 'C',
        text: 'The true flat shape of the world for over a century — a compartmentalized secret fiercely guarded within the control structure.',
        isCorrect: true,
        rationale:
          '33rd-degree freemasons have known flat Earth for over a century and guard that compartmentalized secret.',
      },
      {
        label: 'D',
        text: 'Only that Antarctica is a Bluebeam movie set with no physical ice and no Realm-3 quarantine role.',
        isCorrect: false,
        rationale:
          'They know flat enclosed world; Antarctica is real engineered partition, not a movie-set-only claim.',
      },
    ],
    hint: 'Flat shape known 100+ years — fiercely guarded secret.',
    correctAnswer: 'C',
  },
  {
    number: 16,
    question:
      'How deep does freemason knowledge go regarding Gateway-10 beyond the ice walls?',
    options: [
      {
        label: 'A',
        text: 'Full multidimensional maps of all 177 other worlds posted in every lodge lobby without restriction.',
        isCorrect: false,
        rationale:
          'High-ranking agents often remain blind to the other 177 worlds beyond the ice walls.',
      },
      {
        label: 'B',
        text: 'They only know coal schedules and never touch Cosmology, flat shape, or enclosure topics at all.',
        isCorrect: false,
        rationale:
          'They know flat enclosed world; compartmentalization blocks full Gateway-10 multi-world truth.',
      },
      {
        label: 'C',
        text: 'They personally built all 178 worlds and therefore need no secrecy about ice partitions or Realm-3.',
        isCorrect: false,
        rationale:
          'Secrecy is fierce; compartmentalization keeps even elites partly ignorant of full multi-world scope.',
      },
      {
        label: 'D',
        text: 'Even high-ranking terrestrial agents often know only that the world is flat and enclosed, remaining blind to the other 177 worlds of Gateway-10 beyond the ice walls.',
        isCorrect: true,
        rationale:
          'Compartmentalization: flat enclosure yes; full 177 adjacent worlds beyond ice walls usually no.',
      },
    ],
    hint: 'Flat enclosure known — blind to other 177 worlds beyond.',
    correctAnswer: 'D',
  },
  {
    number: 17,
    question:
      'How is ice used at the North Pole beyond the Antarctic perimeter story?',
    options: [
      {
        label: 'A',
        text: 'Deep cold ice dampens and hides ultra-high-frequency structures such as the Emerald Palace so humans cannot locate true energetic centers.',
        isCorrect: true,
        rationale:
          'North Pole ice acts as dampening cover for UHF structures like the Emerald Palace, hiding true energetic centers.',
      },
      {
        label: 'B',
        text: 'North Pole ice only refrigerates freemason food stores with no link to Nodes, temples, or frequency dampening.',
        isCorrect: false,
        rationale:
          'Ice is used as a dampening agent on high-frequency structures and energetic centers.',
      },
      {
        label: 'C',
        text: 'North Pole ice permanently destroys Mt Meru holography so no projection inside the wall is ever possible.',
        isCorrect: false,
        rationale:
          'Benevolent holography still operates from the North Pole central valve across the partitioned realm.',
      },
      {
        label: 'D',
        text: 'North Pole ice is identical to Antarctica\'s role as Realm-3\'s sole partition with no separate dampening function.',
        isCorrect: false,
        rationale:
          'Antarctica partitions Realm-3; North Pole ice separately dampens UHF structures like the Emerald Palace.',
      },
    ],
    hint: 'North Pole ice dampens UHF structures (e.g. Emerald Palace).',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question:
      'What terrestrial power structures are linked to concealing the Ice Wall?',
    options: [
      {
        label: 'A',
        text: 'Only independent weather bloggers with no Military Industrial or freemason compartmentalization involved.',
        isCorrect: false,
        rationale:
          'Concealment links to the Military Industrial Complex and terrestrial management of the 3rd Density prison.',
      },
      {
        label: 'B',
        text: 'The highest levels of the Military Industrial Complex and terrestrial management of the 3rd Density prison matrix, including 33rd-degree freemason secrecy.',
        isCorrect: true,
        rationale:
          'Ice Wall concealment is bound to Military Industrial power and freemason-managed 3rd Density prison secrecy.',
      },
      {
        label: 'C',
        text: 'Only G.A.A. press offices that openly publish ice-wall maps for every NPC household weekly.',
        isCorrect: false,
        rationale:
          'The wall is concealed by control structures; freemasons guard flat secrecy rather than open NPC maps.',
      },
      {
        label: 'D',
        text: 'Only Soul Family reunion committees that use ice as a metaphor with no physical perimeter at all.',
        isCorrect: false,
        rationale:
          'Ice Wall is physical and psychological perimeter; soul-family work comes after globe deception falls.',
      },
    ],
    hint: 'Military Industrial Complex + freemason 3rd Density prison secrecy.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question:
      'Why is comprehending the Ice Wall the absolute prerequisite for the Great Spiritual Awakening?',
    options: [
      {
        label: 'A',
        text: 'Because ice chemistry alone activates pineal glands without any need to drop the globe deception or face enclosure truth.',
        isCorrect: false,
        rationale:
          'The prerequisite is dismantling geographical globe deception — not ice chemistry as a pineal trick.',
      },
      {
        label: 'B',
        text: 'Because freemasons require ice-wall essays before issuing 33rd-degree ranks to every awakened soul.',
        isCorrect: false,
        rationale:
          'Freemason secrecy hides the wall; awakening requires seeing past that cage, not joining it.',
      },
      {
        label: 'C',
        text: 'Because the geographical deception of the globe must be dismantled in the mind before deeper awakening architecture can land.',
        isCorrect: true,
        rationale:
          'Ice Wall comprehension is the absolute prerequisite; globe geographical deception must fall first.',
      },
      {
        label: 'D',
        text: 'Because NPCs already accept flat Cosmology and only need ice tourism visas to complete the awakening automatically.',
        isCorrect: false,
        rationale:
          'NPCs face cognitive failure at flat/Ice Wall exposure; awakening is not automatic tourism.',
      },
    ],
    hint: 'Dismantle globe geographical deception first — absolute prerequisite.',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question:
      'What advanced topics are pointless until the globe geographical deception falls?',
    options: [
      {
        label: 'A',
        text: 'Only railroad timetables and coal prices, with soul families already fully accessible under globe belief.',
        isCorrect: false,
        rationale:
          'Soul families, multidimensional existence, and crystalline architecture are pointless until globe deception falls.',
      },
      {
        label: 'B',
        text: 'Only freemason handshakes, while crystalline architecture thrives under heliocentrism textbooks.',
        isCorrect: false,
        rationale:
          'Crystalline architecture contemplation is listed among topics that wait on geographical truth.',
      },
      {
        label: 'C',
        text: 'Only Mars tourism ads, because Realm-1 adjacency is already taught honestly in schools worldwide.',
        isCorrect: false,
        rationale:
          'Mars-as-distant-planet is the lie; adjacency truth comes with flat Ice Wall Cosmology.',
      },
      {
        label: 'D',
        text: 'Soul families, multidimensional existences, and crystalline architecture — there is no point contemplating them until the globe deception is dismantled.',
        isCorrect: true,
        rationale:
          'Without killing the globe geographical lie first, advanced spiritual/architectural topics have no solid ground.',
      },
    ],
    hint: 'Soul families, multidimensional life, crystalline architecture — after globe falls.',
    correctAnswer: 'D',
  },
  {
    number: 21,
    question:
      'What happens to most of the population — especially NPCs — when Ice Wall and flat Cosmology are exposed?',
    options: [
      {
        label: 'A',
        text: 'Total cognitive failure — the vast majority, particularly NPCs, cannot process the exposure of Ice Wall and flat cosmology.',
        isCorrect: true,
        rationale:
          'NPCs and the vast majority meet total cognitive failure when Ice Wall and flat Cosmology are exposed.',
      },
      {
        label: 'B',
        text: 'Instant calm mastery of Gateway-10 maps with no psychological shock of any kind.',
        isCorrect: false,
        rationale:
          'Exposure produces total cognitive failure for the unprepared majority, not calm mastery.',
      },
      {
        label: 'C',
        text: 'Only mild boredom because globe textbooks already included ice walls as optional chapters.',
        isCorrect: false,
        rationale:
          'Globe model hides the wall; exposure is catastrophic for NPC cognition, not mild boredom.',
      },
      {
        label: 'D',
        text: 'Automatic promotion into Military Industrial leadership for every NPC who sees Antarctica once.',
        isCorrect: false,
        rationale:
          'Military Industrial structures conceal the wall; NPCs collapse cognitively rather than get promoted.',
      },
    ],
    hint: 'Total cognitive failure — especially NPCs.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question:
      'What does accepting the Ice Wall demand of perceived scientific knowledge?',
    options: [
      {
        label: 'A',
        text: 'Keeping all heliocentric pillars intact while adding ice as a decorative South Pole footnote only.',
        isCorrect: false,
        rationale:
          'Acceptance requires unlearning foundational pillars of perceived scientific knowledge.',
      },
      {
        label: 'B',
        text: 'Unlearning foundational pillars of perceived scientific knowledge and facing that humanity is fenced into a localized enclosure by hostile forces.',
        isCorrect: true,
        rationale:
          'Ice Wall acceptance means unlearning fake science pillars and realizing hostile fencing into a local enclosure.',
      },
      {
        label: 'C',
        text: 'Memorizing more freemason library volumes that strengthen the globe model without enclosure realization.',
        isCorrect: false,
        rationale:
          'The demand is unflinching realization of enclosure by hostile forces — not more globe reinforcement.',
      },
      {
        label: 'D',
        text: 'Ignoring Gateway-10 placement entirely while focusing only on coal and steam progress narratives.',
        isCorrect: false,
        rationale:
          'Acknowledging the boundary enables understanding true Gateway-10 placement and matrix exit prep.',
      },
    ],
    hint: 'Unlearn fake science pillars — face hostile enclosure fencing.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question:
      'What becomes possible only after acknowledging the Ice Wall boundary?',
    options: [
      {
        label: 'A',
        text: 'Stronger belief in empty space so exploration drive dies and enclosure feels permanent forever.',
        isCorrect: false,
        rationale:
          'Acknowledging the boundary opens true Gateway-10 placement understanding and matrix exit preparation.',
      },
      {
        label: 'B',
        text: 'Automatic freemason 33rd-degree status without any unlearning of scientific deception.',
        isCorrect: false,
        rationale:
          'Freemason secrecy is part of the cage; awakening path is enclosure truth and Gateway-10 placement, not joining the secret.',
      },
      {
        label: 'C',
        text: 'A soul can begin to understand its true placement within Gateway-10 and prepare to exit the matrix.',
        isCorrect: true,
        rationale:
          'Only by acknowledging the Ice Wall can a soul grasp Gateway-10 placement and prepare matrix exit.',
      },
      {
        label: 'D',
        text: 'Deletion of Realm-1 and Mars adjacency so only Realm-3 remains as the whole of existence.',
        isCorrect: false,
        rationale:
          'Truth expands awareness toward multi-world Gateway-10, not deletion of adjacent realms.',
      },
    ],
    hint: 'True Gateway-10 placement + prepare to exit the matrix.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question: 'What is the Simulation in this Ice Wall Cosmology?',
    options: [
      {
        label: 'A',
        text: 'A harmless weather app that draws ice walls for fun with no prison matrix or manifestation history.',
        isCorrect: false,
        rationale:
          'Simulation is the etheric supercomputer and physical matrix inverted into a low-density prison.',
      },
      {
        label: 'B',
        text: 'Only Antarctica\'s tourist brochure with no etheric supercomputer component or inverted purpose.',
        isCorrect: false,
        rationale:
          'Simulation is the broader inverted matrix; Ice Wall is a perimeter inside that prison Cosmology.',
      },
      {
        label: 'C',
        text: 'A freemason invention from last century with no original design for soul manifestation at all.',
        isCorrect: false,
        rationale:
          'Originally designed for manifestation, now inverted into low-density prison — not a recent freemason toy.',
      },
      {
        label: 'D',
        text: 'The etheric supercomputer and physical matrix originally designed for manifestation, now inverted into a low-density prison.',
        isCorrect: true,
        rationale:
          'Simulation was manifestation architecture; inversion made it a low-density prison holding the ice-walled enclosure.',
      },
    ],
    hint: 'Manifestation matrix inverted into low-density prison.',
    correctAnswer: 'D',
  },
  {
    number: 25,
    question:
      'Why is the Ice Wall both a physical and psychological perimeter?',
    options: [
      {
        label: 'A',
        text: 'It is a solid partition of the flat plain and, via the globe lie, an unquestioned mental cage that keeps humanity intellectually and physically trapped in the enclosure.',
        isCorrect: true,
        rationale:
          'Physically it partitions realms; psychologically the globe myth makes that perimeter an unquestioned cage trapping mind and body.',
      },
      {
        label: 'B',
        text: 'It is only psychological metaphor with no physical ice, Antarctica, or Realm-3 quarantine on the ground.',
        isCorrect: false,
        rationale:
          'It is a physical horizontal boundary and engineered Antarctic partition — plus psychological cage effects.',
      },
      {
        label: 'C',
        text: 'It is only physical ice with no link to curiosity, globe deception, or intellectual trapping of consciousness.',
        isCorrect: false,
        rationale:
          'Controllers engineered globe myth specifically so the physical wall becomes a psychological cage.',
      },
      {
        label: 'D',
        text: 'It is neither physical nor psychological — merely a Simulation loading screen that NPCs can skip freely.',
        isCorrect: false,
        rationale:
          'Ice Wall is critical physical and psychological perimeter of the multidimensional Simulation prison.',
      },
    ],
    hint: 'Physical partition + globe-made mental cage — trapped enclosure.',
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
  'Test your grasp of the Ice Wall — Antarctic Realm-3 partition, Mars adjacency, freemason flat secrecy, Emerald Palace ice dampening, and globe-cage psychology.';
const DESC_META =
  'Interactive Living Truth Quiz on the Ice Wall: Gateway-10 flat perimeter, Antarctica as fake wall, Realm-1/2/3, Freemason compartmentalization, North Pole holography, and awakening prerequisite.';

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
      'The Ice Wall is not a polar trivia card — it is the physical and psychological fence of Gateway-10. Antarctica carves Realm-3 out of Realm-2; Mars sits on Realm-1\'s outer ice; the globe myth exists to kill curiosity about what lies beyond. Sit with what you missed, then return to the Ice Wall deep-dive. Freemasons have known flat enclosure for over a century and still do not see all 177 worlds. North Pole ice hides the Emerald Palace while Mt Meru holography covers the partitioned realm. Until the geographical globe lie falls, soul families and crystalline architecture are noise. Acknowledge the wall — or NPC-level cognitive failure owns the reveal.',
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
      "  { path: '/quiz/alice/holographic-projection-dome.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/grey-ets.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/giant-skeletons.html', priority: '0.75', changefreq: 'monthly' },",
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
console.log('PASS: audited 25/25 against data/alice-topics/ice-wall.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
