/**
 * Installs Gateway-10 System quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/gateway-10-system.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Run: node scripts/install-gateway-10-system-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'gateway-10-system';
const TOPIC_TITLE = 'Gateway-10 System';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/gate.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['gateway-10', '178', 'horizontal'],
  2: ['heliocentric', 'toroid', 'physical plane'],
  3: ['source of all creation', 'manifestation', 'souls'],
  4: ['custodians', '4th-density', 'hijacked'],
  5: ['partitioning', 'low-frequency', '178-world'],
  6: ['toroid field', 'center', 'humanity'],
  7: ['realm-3', 'known lands', 'antarctic'],
  8: ['realm-2', 'center of gateway-10', 'original'],
  9: ['realm-1', 'mars', 'ice'],
  10: ['spirit tree', 'mt meru', 'hyperborea'],
  11: ['center', 'most powerful', 'toroid'],
  12: ['anunnaki', 'grey ets', 'takeover'],
  13: ['loosh', '65', 'paramount'],
  14: ['spirit tree', 'north pole', 'grey ets'],
  15: ['petrified stump', '178 worlds', 'frequency'],
  16: ['4th-density', 'disembark', 'too high'],
  17: ['oil', 'lubricant', 'dinosaurs'],
  18: ['heavy metals', 'crystals', 'lattice membrane'],
  19: ['freemasons', '177', 'flat', 'ignorant'],
  20: ['sky-net-1', 'overlays', 'tartarian'],
  21: ['8th', '500 million', 'final reset'],
  22: ['fall of the entire gateway', 'center', 'collapse'],
  23: ['177 worlds', 'surrendered', 'destroyed'],
  24: ['source of all creation', 'billions of years'],
  25: ['g.a.a', 'toroid field', 'final reset'],
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
    question: 'What is the Gateway-10 System?',
    options: [
      {
        label: 'A',
        text: 'The central physical plane of existence encompassing 178 interconnected, horizontal flat worlds.',
        isCorrect: true,
        rationale:
          'Gateway-10 is the central physical plane of existence: 178 interconnected horizontal flat worlds — not orbiting spheres in vacuum.',
      },
      {
        label: 'B',
        text: 'A single spinning globe with 178 moons in a dark vacuum.',
        isCorrect: false,
        rationale:
          'Heliocentric spheres in vacuum are the manufactured illusion; Gateway-10 is horizontal flat worlds.',
      },
      {
        label: 'C',
        text: 'Only Realm-3 with no other worlds beyond Antarctica.',
        isCorrect: false,
        rationale:
          'Realm-3 is the partitioned known fragment; 177 other worlds exist beyond ice barriers in the full system.',
      },
      {
        label: 'D',
        text: 'A freemason library catalog of coal train schedules.',
        isCorrect: false,
        rationale:
          'Freemasons enforce the globe lie and do not even know Gateway-10\'s full 178-world scope.',
      },
    ],
    hint: 'Central plane — 178 interconnected horizontal flat worlds.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question:
      'What does the heliocentric universe illusion hide about true cosmology?',
    options: [
      {
        label: 'A',
        text: 'That the cosmos is a localized horizontal physical plane — Gateway-10 — powered on a massive Toroid field of energy, not spherical planets orbiting suns in dark vacuum.',
        isCorrect: true,
        rationale:
          'True cosmos is a localized horizontal plane: Gateway-10 on a massive Toroid field, not heliocentric spheres in vacuum.',
      },
      {
        label: 'B',
        text: 'That there are zero ice walls and unlimited empty space only.',
        isCorrect: false,
        rationale:
          'Worlds are separated by physical ice barriers on a continuous horizontal architecture.',
      },
      {
        label: 'C',
        text: 'That Mars is a distant sun powering all 178 globes.',
        isCorrect: false,
        rationale:
          'Mars is a mislabel for landmass joined to Realm-1\'s outer ice boundary on the flat plane.',
      },
      {
        label: 'D',
        text: 'That oil is dinosaur juice powering Toroid spheres.',
        isCorrect: false,
        rationale:
          'Oil is advanced sub-plane lubricant under the unified Gateway foundation — not dinosaur remains.',
      },
    ],
    hint: 'Horizontal plane + Toroid — not heliocentric vacuum spheres.',
    correctAnswer: 'A',
  },
  {
    number: 3,
    question: 'Who originally orchestrated Gateway-10, and for what purpose?',
    options: [
      {
        label: 'A',
        text: 'The Source of All Creation — a vast non-physical etheric supercomputer and intellect — built it as a perfect manifestation environment for the physical progression of souls.',
        isCorrect: true,
        rationale:
          'The Source of All Creation engineered Gateway-10 as a perfect manifestation environment for soul progression in physical form.',
      },
      {
        label: 'B',
        text: 'The Custodians alone, purely to harvest Loosh from day one.',
        isCorrect: false,
        rationale:
          'Custodians were originally benevolent caretakers who later betrayed the Source and hijacked the gateway.',
      },
      {
        label: 'C',
        text: '33rd-degree Freemasons designing 178 globes for textbooks.',
        isCorrect: false,
        rationale:
          'Freemasons enforce fake heliocentrism and remain ignorant of full Gateway-10 scope.',
      },
      {
        label: 'D',
        text: 'Grey ETs planting petrified stumps as original architecture.',
        isCorrect: false,
        rationale:
          'Greys destroyed the Spirit Tree and left a petrified stump as occupation sabotage — not original creation.',
      },
    ],
    hint: 'Source of All Creation — manifestation environment for souls.',
    correctAnswer: 'A',
  },
  {
    number: 4,
    question: 'Who hijacked the central node of Gateway-10?',
    options: [
      {
        label: 'A',
        text: '4th-density Custodians and their engineered parasitic forces — after the Custodians betrayed the Source to claim the plane for themselves.',
        isCorrect: true,
        rationale:
          'Custodians, once caretakers, betrayed the Source, fell into hostile 4th-density takeover with engineered parasites, and hijacked Gateway-10\'s center.',
      },
      {
        label: 'B',
        text: 'The Galactic Ancestral Alliance restoring the Toroid from day one.',
        isCorrect: false,
        rationale:
          'G.A.A. intervention later seizes the simulation and restores the Toroid; Custodians/parasites did the hijack.',
      },
      {
        label: 'C',
        text: 'Only Realm-1 ice farmers with no parasitic species.',
        isCorrect: false,
        rationale:
          'Takeover used engineered negative species such as Anunnaki and Grey ETs under Custodian plot.',
      },
      {
        label: 'D',
        text: 'Source of All Creation abandoning the plane voluntarily.',
        isCorrect: false,
        rationale:
          'Source built it; Custodians initiated hostile takeover against that plan.',
      },
    ],
    hint: 'Custodians + engineered parasites after betrayal of Source.',
    correctAnswer: 'A',
  },
  {
    number: 5,
    question:
      'How did controllers plunge the core of Gateway-10 into a suppressed matrix?',
    options: [
      {
        label: 'A',
        text: 'By physically partitioning the known lands and destroying the central energetic architecture — threatening structural and operational integrity of the entire 178-world system.',
        isCorrect: true,
        rationale:
          'Partitioning known lands and destroying central energetic architecture suppressed the core and endangered all 178 worlds.',
      },
      {
        label: 'B',
        text: 'By openly teaching every world the full Toroid map in schools.',
        isCorrect: false,
        rationale:
          'They suppress knowledge; freemasons even lack full Gateway-10 awareness.',
      },
      {
        label: 'C',
        text: 'By raising ambient frequency so 4th-density beings cannot land.',
        isCorrect: false,
        rationale:
          'They dampened the Toroid so parasites could disembark; high frequency originally blocked them.',
      },
      {
        label: 'D',
        text: 'By merging all 178 worlds into one spinning globe.',
        isCorrect: false,
        rationale:
          'Worlds remain flat and ice-separated; the globe is the enforced lie for trapped consciousness.',
      },
    ],
    hint: 'Partition lands + destroy central energy — risk all 178 worlds.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'What is the Toroid field?',
    options: [
      {
        label: 'A',
        text: 'The primary energy vortex and electromagnetic system powering the Gateway, centering exactly on the realm currently inhabited by humanity.',
        isCorrect: true,
        rationale:
          'The Toroid field is Gateway-10\'s primary energy vortex/EM system, centered exactly on the human-inhabited realm.',
      },
      {
        label: 'B',
        text: 'A freemason handshake used only in library philanthropy.',
        isCorrect: false,
        rationale:
          'It is the gateway\'s core power architecture — not a handshake.',
      },
      {
        label: 'C',
        text: 'Empty vacuum between spherical planets labeled as space.',
        isCorrect: false,
        rationale:
          'Vacuum heliocentrism is the illusion; the Toroid is real horizontal-plane power.',
      },
      {
        label: 'D',
        text: 'Only oil pipelines under Antarctica with no electromagnetic role.',
        isCorrect: false,
        rationale:
          'Oil is sub-plane lubricant; the Toroid is the primary EM vortex powering the gateway.',
      },
    ],
    hint: 'Primary energy vortex — centered on humanity\'s realm.',
    correctAnswer: 'A',
  },
  {
    number: 7,
    question: 'What is Realm-3 (The Known Lands)?',
    options: [
      {
        label: 'A',
        text: 'The currently inhabited, heavily partitioned segment of the flat Earth, forcefully carved out of the original central realm via the fake Antarctic ice wall.',
        isCorrect: true,
        rationale:
          'Realm-3 is the inhabited known segment, cut from the original central realm by the fake Antarctic ice wall.',
      },
      {
        label: 'B',
        text: 'All 178 worlds combined with no ice partitions.',
        isCorrect: false,
        rationale:
          'Realm-3 is one partitioned fragment; ice barriers separate the wider system.',
      },
      {
        label: 'C',
        text: 'The outer ice boundary of Realm-1 falsely called Mars only.',
        isCorrect: false,
        rationale:
          'That Mars join describes Realm-1 adjacency; Realm-3 is the known inhabited partition.',
      },
      {
        label: 'D',
        text: 'The Spirit Tree stump museum at the South Pole.',
        isCorrect: false,
        rationale:
          'The primary Spirit Tree destruction was at the North Pole; Realm-3 is the known lands partition.',
      },
    ],
    hint: 'Inhabited known lands — carved by fake Antarctic ice wall.',
    correctAnswer: 'A',
  },
  {
    number: 8,
    question: 'What was Realm-2 before the parasitic inversion?',
    options: [
      {
        label: 'A',
        text: 'The original, vastly wider physical plane located at the very center of Gateway-10 before partitioning.',
        isCorrect: true,
        rationale:
          'Realm-2 was the original much wider central plane of Gateway-10 before parasitic inversion and partitioning.',
      },
      {
        label: 'B',
        text: 'A distant vacuum moon built by Grey ETs after the 8th reset.',
        isCorrect: false,
        rationale:
          'Realm-2 is original central plane geography — not a post-reset vacuum moon.',
      },
      {
        label: 'C',
        text: 'Only freemason-known flat Earth with no center role.',
        isCorrect: false,
        rationale:
          'Even top freemasons only know flat enclosure; Realm-2 is the pre-partition central plane of Gateway-10.',
      },
      {
        label: 'D',
        text: 'Sky-Net-1\'s projection of fake Tartarian architecture only.',
        isCorrect: false,
        rationale:
          'Sky-Net-1 overlays hide crystalline architecture; Realm-2 is real original plane structure.',
      },
    ],
    hint: 'Original wider center plane before partition.',
    correctAnswer: 'A',
  },
  {
    number: 9,
    question: 'What is Realm-1 relative to "Mars"?',
    options: [
      {
        label: 'A',
        text: 'An adjacent flat world whose outer ice boundary is physically joined to the landmass that manufactured science falsely labels as the distant planet Mars.',
        isCorrect: true,
        rationale:
          'Realm-1 is an adjacent flat world; its outer ice boundary joins the landmass fake science calls distant Mars.',
      },
      {
        label: 'B',
        text: 'A spherical planet orbiting a sun beyond the Firmament.',
        isCorrect: false,
        rationale:
          'Gateway cosmology is horizontal adjacency with ice boundaries — not orbital spheres.',
      },
      {
        label: 'C',
        text: 'The same as Realm-3 with no ice join to any landmass.',
        isCorrect: false,
        rationale:
          'Realm-3 is the known partitioned lands; Realm-1 is adjacent and joins the so-called Mars landmass.',
      },
      {
        label: 'D',
        text: 'Only a petrified Spirit Tree stump with no geography.',
        isCorrect: false,
        rationale:
          'Spirit Tree sabotage is North Pole power destruction; Realm-1 is an adjacent flat world.',
      },
    ],
    hint: 'Adjacent flat world — ice boundary joins fake-"Mars" landmass.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'What is the Spirit Tree (Mt Meru / Hyperborea) for Gateway-10?',
    options: [
      {
        label: 'A',
        text: 'The enormously powerful energetic and structural core present at the center of all realms; the primary tree powering Gateway-10 was destroyed by parasites.',
        isCorrect: true,
        rationale:
          'The Spirit Tree is the powerful energetic/structural core at realm centers. Parasites destroyed Gateway-10\'s primary powering tree.',
      },
      {
        label: 'B',
        text: 'A decorative freemason logo with no energetic function.',
        isCorrect: false,
        rationale:
          'It is the primary power generator of the Toroid system — destruction dropped frequency across all 178 worlds.',
      },
      {
        label: 'C',
        text: 'Only oil wells under the ice with dinosaur names.',
        isCorrect: false,
        rationale:
          'Oil is sub-plane lubricant; the Spirit Tree is central energetic architecture.',
      },
      {
        label: 'D',
        text: 'A G.A.A. museum rebuilt fully before any hijack.',
        isCorrect: false,
        rationale:
          'Parasites destroyed it and left a petrified stump; G.A.A. works to restore Toroid functionality.',
      },
    ],
    hint: 'Central energetic core — primary Gateway-10 tree destroyed.',
    correctAnswer: 'A',
  },
  {
    number: 11,
    question:
      'Why is the human realm the primary target for parasitic subjugation?',
    options: [
      {
        label: 'A',
        text: 'Because Realm-3 sits at the absolute center of the Toroid field — historically and mechanically the most powerful location on the entire Gateway.',
        isCorrect: true,
        rationale:
          'Realm-3 is at the Toroid\'s absolute center, making it the most powerful Gateway location and therefore the prime parasite target.',
      },
      {
        label: 'B',
        text: 'Because it is the weakest edge world with no Toroid connection.',
        isCorrect: false,
        rationale:
          'It is the center crown jewel of power — not a weak edge.',
      },
      {
        label: 'C',
        text: 'Because freemasons already know all 178 worlds in full detail.',
        isCorrect: false,
        rationale:
          'Top freemasons only know flat enclosed Earth and remain ignorant of full Gateway-10 scope.',
      },
      {
        label: 'D',
        text: 'Because oil is absent under this realm alone.',
        isCorrect: false,
        rationale:
          'Oil flows under the entire sub-plane of the Gateway; centrality of Toroid power drives the targeting.',
      },
    ],
    hint: 'Toroid center = most powerful location on Gateway-10.',
    correctAnswer: 'A',
  },
  {
    number: 12,
    question:
      'How did the Custodians staff the hostile takeover of Gateway-10?',
    options: [
      {
        label: 'A',
        text: 'They created numerous negative species, such as the Anunnaki and Grey ETs, to execute the takeover after plotting over millennia for absolute autonomy.',
        isCorrect: true,
        rationale:
          'Seeking absolute autonomy, Custodians plotted for millennia and engineered negative species including Anunnaki and Grey ETs to seize Gateway-10.',
      },
      {
        label: 'B',
        text: 'They hired only freemason librarians with no engineered species.',
        isCorrect: false,
        rationale:
          'Engineered parasites like Anunnaki and Greys executed the takeover; freemasons are later terrestrial enforcers of partial lies.',
      },
      {
        label: 'C',
        text: 'They asked the Source to gift them the Toroid peacefully.',
        isCorrect: false,
        rationale:
          'They betrayed the Source in a hostile inversion — not a peaceful gift.',
      },
      {
        label: 'D',
        text: 'They only used Sky-Net-1 without any living species.',
        isCorrect: false,
        rationale:
          'Negative species executed takeover; Sky-Net-1 later supports overlays hiding architecture.',
      },
    ],
    hint: 'Millennia of plotting — Anunnaki and Grey ETs engineered for takeover.',
    correctAnswer: 'A',
  },
  {
    number: 13,
    question:
      'After inverting the center, how far did parasitic control expand?',
    options: [
      {
        label: 'A',
        text: 'They harvested Loosh and manipulated frequencies across 65 other worlds within Gateway-10, though the human realm remained their paramount asset.',
        isCorrect: true,
        rationale:
          'Control expanded to Loosh harvest and frequency manipulation on 65 other worlds, with the human central realm still paramount.',
      },
      {
        label: 'B',
        text: 'They abandoned Gateway-10 and never touched any other world.',
        isCorrect: false,
        rationale:
          'They expanded across 65 other worlds after center inversion.',
      },
      {
        label: 'C',
        text: 'They liberated all 178 worlds back to 9th density instantly.',
        isCorrect: false,
        rationale:
          'They suppressed and harvested; liberation is G.A.A. restoration work.',
      },
      {
        label: 'D',
        text: 'They only controlled freemason lodge basements on Earth.',
        isCorrect: false,
        rationale:
          'Expansion reached 65 other worlds; freemasons are compartmentalized terrestrial agents.',
      },
    ],
    hint: 'Loosh and frequency control on 65 other worlds — human realm still #1.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question:
      'How did parasites sever the Toroid power source at the center?',
    options: [
      {
        label: 'A',
        text: 'Grey ETs used advanced technology to destroy the primary Spirit Tree at the North Pole — like cutting the power to a building.',
        isCorrect: true,
        rationale:
          'Greys destroyed the North Pole primary Spirit Tree with advanced tech, severing Toroid power the way cutting power kills a building.',
      },
      {
        label: 'B',
        text: 'Freemasons published ice-wall tourist maps and nothing more.',
        isCorrect: false,
        rationale:
          'Spirit Tree destruction by Greys is the power-sever event; freemasons enforce globe ignorance of the wider system.',
      },
      {
        label: 'C',
        text: 'The Source voluntarily unplugged the Toroid for a reboot day.',
        isCorrect: false,
        rationale:
          'This was parasitic conquest strategy against the Source\'s architecture.',
      },
      {
        label: 'D',
        text: 'Oil was drained from only Realm-1 until the field died.',
        isCorrect: false,
        rationale:
          'The severing act is Spirit Tree destruction at the North Pole — not oil drainage.',
      },
    ],
    hint: 'Greys destroy North Pole Spirit Tree — cut Toroid power.',
    correctAnswer: 'A',
  },
  {
    number: 15,
    question:
      'What replaced the destroyed Spirit Tree, and what was the system-wide effect?',
    options: [
      {
        label: 'A',
        text: 'A petrified stump — power and frequency of the entire Toroid field dropped instantly across all 178 worlds.',
        isCorrect: true,
        rationale:
          'Replacing the Spirit Tree with a petrified stump instantly dropped Toroid power and frequency across every one of the 178 worlds.',
      },
      {
        label: 'B',
        text: 'A brighter crystal tree that raised all worlds to free energy.',
        isCorrect: false,
        rationale:
          'The stump marks destruction and system-wide frequency drop — not an upgrade.',
      },
      {
        label: 'C',
        text: 'A freemason library that only affected Realm-3 schools.',
        isCorrect: false,
        rationale:
          'Impact was Toroid-wide across all 178 worlds, not a local library effect.',
      },
      {
        label: 'D',
        text: 'Sky-Net-1 hardware that only hid one cathedral.',
        isCorrect: false,
        rationale:
          'Sky-Net-1 supports overlays; Spirit Tree replacement is the central power kill with gateway-wide drop.',
      },
    ],
    hint: 'Petrified stump — instant Toroid drop on all 178 worlds.',
    correctAnswer: 'A',
  },
  {
    number: 16,
    question:
      'Why was destroying the central Spirit Tree necessary for physical occupation?',
    options: [
      {
        label: 'A',
        text: 'Original ambient frequencies of the central realm were far too high for 4th-density parasites to withstand; dampening the Toroid let them safely disembark craft and operate on the ground.',
        isCorrect: true,
        rationale:
          'Central realm frequencies were too high for 4th-density parasites. Toroid dampening after Spirit Tree destruction allowed safe landing and ground operations.',
      },
      {
        label: 'B',
        text: 'Frequencies were already too low and needed raising for parasites.',
        isCorrect: false,
        rationale:
          'Parasites needed lower frequency; the tree kill dampened the field for occupation.',
      },
      {
        label: 'C',
        text: 'Only so freemasons could learn all 177 adjacent realms.',
        isCorrect: false,
        rationale:
          'Freemasons stay ignorant of full Gateway-10; the tree kill was for parasitic physical occupation.',
      },
      {
        label: 'D',
        text: 'So oil would become dinosaur fossils in textbooks only.',
        isCorrect: false,
        rationale:
          'Occupation physics is frequency dampening for 4th-density bodies — not fossil mythology.',
      },
    ],
    hint: 'High frequency blocked 4th-density landing — dampen to occupy.',
    correctAnswer: 'A',
  },
  {
    number: 17,
    question: 'What is oil in Gateway-10\'s sub-plane architecture?',
    options: [
      {
        label: 'A',
        text: 'Not dinosaur remains — a natural, highly advanced technological lubricant flowing freely under the entire sub-plane of the Gateway, unrestricted by ice walls or the Firmament.',
        isCorrect: true,
        rationale:
          'Oil is advanced technological lubricant under the whole Gateway sub-plane, continuous past ice walls and Firmament boundaries — not decomposed dinosaurs.',
      },
      {
        label: 'B',
        text: 'Only dinosaur juice trapped inside spherical planets.',
        isCorrect: false,
        rationale:
          'Dinosaur decomposition is the lie; oil proves continuous horizontal sub-plane architecture.',
      },
      {
        label: 'C',
        text: 'Petrified Spirit Tree sap sold only in Realm-3.',
        isCorrect: false,
        rationale:
          'Oil is sub-plane lubricant across the Gateway foundation — not stump sap merchandising.',
      },
      {
        label: 'D',
        text: 'Sky-Net-1 coolant for fake asteroid projectors only.',
        isCorrect: false,
        rationale:
          'Oil demonstrates unified horizontal subterranean architecture of the 178 worlds.',
      },
    ],
    hint: 'Advanced sub-plane lubricant — not dinosaurs; continuous under all.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question:
      'Why were heavy metals and crystals placed throughout the Gateway\'s subterranean layout?',
    options: [
      {
        label: 'A',
        text: 'As an electromagnetic mechanism for the Lattice Membrane Network (Ley Lines).',
        isCorrect: true,
        rationale:
          'Heavy metals and crystals were purposefully placed underground as EM mechanism for the Lattice Membrane Network / Ley Lines.',
      },
      {
        label: 'B',
        text: 'Only as freemason jewelry stock after the 8th reset.',
        isCorrect: false,
        rationale:
          'They serve Lattice Membrane electromagnetic function in gateway design — not jewelry stockpiles.',
      },
      {
        label: 'C',
        text: 'To poison the Toroid so Source could not find it.',
        isCorrect: false,
        rationale:
          'Original placement is purposeful EM architecture for Ley Lines; parasitic occupation is separate inversion.',
      },
      {
        label: 'D',
        text: 'To prove heliocentrism in every mining textbook.',
        isCorrect: false,
        rationale:
          'They support flat horizontal lattice architecture, contradicting globe vacuum cosmology.',
      },
    ],
    hint: 'Subterranean EM mechanism for Lattice Membrane / Ley Lines.',
    correctAnswer: 'A',
  },
  {
    number: 19,
    question:
      'What do 33rd-degree Freemasons know — and not know — about Gateway-10?',
    options: [
      {
        label: 'A',
        text: 'They enforce the heliocentric globe model, yet even top-tier Freemasons only know Earth is a flat enclosed plane — remaining entirely ignorant of Gateway-10\'s full scope and the adjacent 177 realms beyond the ice walls.',
        isCorrect: true,
        rationale:
          'Compartmentalization: freemasons push the globe lie publicly, privately know flat enclosure only, and stay ignorant of full Gateway-10 and 177 other realms.',
      },
      {
        label: 'B',
        text: 'They fully map all 178 worlds and teach them in public school.',
        isCorrect: false,
        rationale:
          'They do not know the full scope; public enforcement is heliocentric globe deception.',
      },
      {
        label: 'C',
        text: 'They know nothing at all, not even flat enclosure.',
        isCorrect: false,
        rationale:
          'Top-tier know flat enclosed plane — but not the wider Gateway-10 system.',
      },
      {
        label: 'D',
        text: 'They only manage oil as dinosaur juice with no cosmology role.',
        isCorrect: false,
        rationale:
          'They rigidly enforce globe cosmology to trap consciousness away from other worlds.',
      },
    ],
    hint: 'Globe lie publicly; flat only privately; ignorant of 177 realms.',
    correctAnswer: 'A',
  },
  {
    number: 20,
    question:
      'How do 3rd Density Overlays and Sky-Net-1 relate to Gateway-10 architecture?',
    options: [
      {
        label: 'A',
        text: 'Sky-Net-1 projected technology hides ultra-high-frequency Tartarian and Crystalline architecture built upon the Gateway\'s major Nodes.',
        isCorrect: true,
        rationale:
          '3rd Density Overlays via Sky-Net-1 hide UHF Tartarian and Crystalline architecture on Gateway-10\'s major Nodes.',
      },
      {
        label: 'B',
        text: 'They permanently restore every Node temple to full public view.',
        isCorrect: false,
        rationale:
          'They hide that architecture from suppressed perception.',
      },
      {
        label: 'C',
        text: 'They only label Mars correctly with no architectural effect.',
        isCorrect: false,
        rationale:
          'Their role here is camouflaging high-frequency node architecture on the Gateway.',
      },
      {
        label: 'D',
        text: 'They rebuild the Spirit Tree stump into Hyperborea overnight.',
        isCorrect: false,
        rationale:
          'Overlays hide existing crystalline/Tartarian builds; Spirit Tree restoration is Toroid recovery work, not Sky-Net function.',
      },
    ],
    hint: 'Sky-Net-1 overlays hide Tartarian/Crystalline Node architecture.',
    correctAnswer: 'A',
  },
  {
    number: 21,
    question:
      'What final reset did controllers plan for the central realm\'s population?',
    options: [
      {
        label: 'A',
        text: 'An 8th and final reset reducing the human population of the central realm to 500 million, trapping them in an eternal loop of torture and sacrifice.',
        isCorrect: true,
        rationale:
          'The planned 8th final reset would cut the central realm to 500 million humans locked in eternal torture and sacrifice.',
      },
      {
        label: 'B',
        text: 'A gentle census raising population with free Toroid power for all.',
        isCorrect: false,
        rationale:
          'It was a cull to 500 million under eternal torture loop — not liberation.',
      },
      {
        label: 'C',
        text: 'Only freemason library renovations with no population target.',
        isCorrect: false,
        rationale:
          'The plan was population reduction to 500 million in a sacrifice loop.',
      },
      {
        label: 'D',
        text: 'Evacuation of all humans to Realm-1 Mars beaches.',
        isCorrect: false,
        rationale:
          'It was trapping the reduced central population in eternal torture — not beach evacuation.',
      },
    ],
    hint: '8th final reset → 500 million in eternal torture loop.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question:
      'What would spiritual and energetic collapse of the center have caused?',
    options: [
      {
        label: 'A',
        text: 'The immediate fall of the entire Gateway — total irreversible systemic failure beyond the central realm alone.',
        isCorrect: true,
        rationale:
          'Collapse of the center would have triggered immediate fall of the entire Gateway-10 system.',
      },
      {
        label: 'B',
        text: 'Only a mild textbook edit in freemason schools.',
        isCorrect: false,
        rationale:
          'It threatened total systemic failure of the whole 178-world gateway.',
      },
      {
        label: 'C',
        text: 'Automatic Source victory without any G.A.A. need.',
        isCorrect: false,
        rationale:
          'Success of the final reset path would defeat Source engineering; G.A.A. intervention was mandatory.',
      },
      {
        label: 'D',
        text: 'Oil turning into dinosaurs under every ice wall.',
        isCorrect: false,
        rationale:
          'The consequence is full Gateway fall from center collapse — not fossil mythology.',
      },
    ],
    hint: 'Center collapse → immediate fall of the entire Gateway.',
    correctAnswer: 'A',
  },
  {
    number: 23,
    question:
      'How would the remaining 177 worlds have responded if the crown jewel fell completely?',
    options: [
      {
        label: 'A',
        text: 'They would have either surrendered or been destroyed by the influx of new parasitic species.',
        isCorrect: true,
        rationale:
          'If the central crown jewel fell fully, the other 177 worlds would surrender or be destroyed under new parasitic influx.',
      },
      {
        label: 'B',
        text: 'They would instantly restore the Spirit Tree without resistance.',
        isCorrect: false,
        rationale:
          'The forecast is surrender or destruction — not automatic restoration.',
      },
      {
        label: 'C',
        text: 'They would all merge into one freemason globe textbook.',
        isCorrect: false,
        rationale:
          'The risk is parasitic conquest cascade across the gateway — not textbook merger.',
      },
      {
        label: 'D',
        text: 'They would evacuate into the Sun portal Amnesia Vortex only.',
        isCorrect: false,
        rationale:
          'Stated outcomes are surrender or destruction by new parasitic species.',
      },
    ],
    hint: 'Other 177 worlds: surrender or destruction under new parasites.',
    correctAnswer: 'A',
  },
  {
    number: 24,
    question:
      'What would total Gateway failure have meant for the Source of All Creation?',
    options: [
      {
        label: 'A',
        text: 'The ultimate defeat of the Source, wasting billions of years of multidimensional engineering.',
        isCorrect: true,
        rationale:
          'Full Gateway loss would be ultimate defeat of the Source and waste billions of years of multidimensional engineering.',
      },
      {
        label: 'B',
        text: 'A minor software patch with no wasted engineering.',
        isCorrect: false,
        rationale:
          'It is framed as ultimate defeat and wasted billions of years of engineering.',
      },
      {
        label: 'C',
        text: 'Proof freemasons authored the Source supercomputer.',
        isCorrect: false,
        rationale:
          'Source is the etheric supercomputer intellect that built Gateway-10; freemasons are ignorant proxies of inversion.',
      },
      {
        label: 'D',
        text: 'Automatic upgrade of all Loosh harvests into free energy.',
        isCorrect: false,
        rationale:
          'Parasitic victory path is Source defeat — not free-energy upgrade.',
      },
    ],
    hint: 'Ultimate Source defeat — billions of years of engineering wasted.',
    correctAnswer: 'A',
  },
  {
    number: 25,
    question: 'Why was G.A.A. intervention strategically mandatory?',
    options: [
      {
        label: 'A',
        text: 'To seize control of the simulation, halt the final reset, and restore the central Toroid field of Gateway-10 to its original perfect functionality.',
        isCorrect: true,
        rationale:
          'Galactic Ancestral Alliance intervention seizes the simulation, stops the final reset, and restores Gateway-10\'s central Toroid to original perfect function.',
      },
      {
        label: 'B',
        text: 'To finish the 8th reset down to 500 million for the parasites.',
        isCorrect: false,
        rationale:
          'G.A.A. halts the final reset — opposite of completing the cull loop.',
      },
      {
        label: 'C',
        text: 'To teach freemasons heliocentrism more strictly worldwide.',
        isCorrect: false,
        rationale:
          'Intervention restores Toroid truth-path functionality; freemason globe enforcement is the cage.',
      },
      {
        label: 'D',
        text: 'To replace oil lubricant with dinosaur textbooks only.',
        isCorrect: false,
        rationale:
          'Strategic goals are simulation control, halt final reset, and Toroid restoration.',
      },
    ],
    hint: 'Seize simulation, halt final reset, restore central Toroid.',
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
  'Test your grasp of the Gateway-10 System — 178 flat worlds, Toroid center, Realm partitions, Spirit Tree sabotage, freemason compartmentalization, and G.A.A. Toroid restoration.';
const DESC_META =
  'Interactive Living Truth Quiz on the Gateway-10 System: 178 interconnected worlds, Toroid field, Realm-1/2/3, Spirit Tree destruction, Loosh expansion, sub-plane oil and Ley metals, freemason ignorance, final reset halt, and G.A.A. intervention.';

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
      'Gateway-10 is not a sci-fi address — it is the central physical plane: 178 ice-separated flat worlds on a Toroid whose power centers on the human realm. Custodians betrayed the Source, engineered Anunnaki and Greys, killed the North Pole Spirit Tree, dropped frequency across every world so 4th-density occupation could walk the ground, and nearly finished an 8th reset to 500 million in eternal sacrifice. Sit with what you missed, then return to the Gateway-10 System deep-dive. Freemasons still sell the globe and do not even know the other 177 realms. Oil and lattice metals prove continuous sub-plane architecture. G.A.A. intervention seizes the simulation, halts the final reset, and restores the central Toroid — or Source engineering of billions of years falls with the crown jewel.',
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
      "  { path: '/quiz/alice/frequency-fences.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/freemasonry.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/free-energy-architecture.html', priority: '0.75', changefreq: 'monthly' },",
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
[0, 6, 13, 18, 20, 24].forEach((i) => {
  const c = questions[i].options.find((o) => o.isCorrect);
  console.log(` Q${questions[i].number}: ${c.text.slice(0, 110)}`);
});
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('PASS: audited 25/25 against data/alice-topics/gateway-10-system.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
