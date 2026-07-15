/**
 * Installs Free Energy Architecture quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/free-energy-architecture.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Run: node scripts/install-free-energy-architecture-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'free-energy-architecture';
const TOPIC_TITLE = 'Free Energy Architecture';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/free-energy.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['tartarian', 'great tartary', 'free energy'],
  2: ['re-sets', 'hidden', 'downgraded'],
  3: ['resonators', 'aether', 'electromagnetic'],
  4: ['dark ages', 'industrial revolution', 'fossil-fuel'],
  5: ['nodes', 'lattice membrane', 'positive electromagnetic'],
  6: ['ley lines', 'conduits', 'homeostasis'],
  7: ['crystalline palaces', 'healing temples', 'churches', 'cathedrals'],
  8: ['tuning forks', 'weightless', 'putty'],
  9: ['atmospheric condensers', 'fibonacci', 'golden ratio'],
  10: ['density suppression', '9th density', '3rd density'],
  11: ['taj mahal', 'angkor wat', 'great pyramids', 'religious worship'],
  12: ['freemasons', 'replicas', 'footings'],
  13: ['gold', 'silver', 'mined', 'ley lines'],
  14: ['sung', 'andesite', 'granite'],
  15: ['many tons', 'push of a finger', 'mass'],
  16: ['leedskalnin', '1,100 tons', 'copper wire'],
  17: ['london underground', 'pneumatic', 'free energy'],
  18: ['20 mph', '60%', 'ley lines', 'copper dome'],
  19: ['radium', 'kryptonite', 'green luminescence'],
  20: ['alters', 'concrete', 'tarmac', 'artificial ice'],
  21: ['mud-floods', 'soil liquefaction', 'subatomic'],
  22: ['1887', 'consolidated coal company', 'smelting'],
  23: ['baphomet power pylons', 'siphon', 'loosh'],
  24: ['scarcity', 'austerity', 'concrete'],
  25: ['perceived knowledge', 'tartaria', 'control matrix'],
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
    question: 'What is Free Energy Architecture?',
    options: [
      {
        label: 'A',
        text: 'The highly advanced legacy infrastructure of the Tartarian Civilization (Great Tartary) — global architectural and technological excellence built around free energy.',
        isCorrect: true,
        rationale:
          'Free Energy Architecture is Tartaria\'s advanced legacy infrastructure: worldwide architectural and technological excellence grounded in free energy.',
      },
      {
        label: 'B',
        text: 'Only modern solar panels invented after the Industrial Revolution.',
        isCorrect: false,
        rationale:
          'The Industrial Revolution was engineered regression into fossil-fuel dependency after Tartaria was destroyed — not the origin of free energy architecture.',
      },
      {
        label: 'C',
        text: 'Freemason stone replicas built solely as religious worship halls.',
        isCorrect: false,
        rationale:
          'Freemason replicas capped invisible crystalline temples; original structures were free-energy centers, not worship houses.',
      },
      {
        label: 'D',
        text: 'Baphomet Power Pylons that gift free electricity to every Node.',
        isCorrect: false,
        rationale:
          'Baphomet Power Pylons siphon and harvest backed-up Ley-line energy and Loosh — they are suppression tech, not Tartarian free-energy gifts.',
      },
    ],
    hint: 'Tartarian / Great Tartary free-energy infrastructure.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'What happened to Tartarian civilization and its technology?',
    options: [
      {
        label: 'A',
        text: 'It was systematically eradicated through planned cyclical planetary re-sets, and its sophisticated technology was deliberately hidden, downgraded, or destroyed.',
        isCorrect: true,
        rationale:
          'Tartaria was wiped through planned re-sets; free-energy tech was hidden, downgraded, or destroyed on purpose.',
      },
      {
        label: 'B',
        text: 'It voluntarily sold every condenser to the Consolidated Coal Company for museum display.',
        isCorrect: false,
        rationale:
          'In 1887 condensers were ordered removed and smelted to enforce coal reliance — not voluntary museum sales by Tartaria.',
      },
      {
        label: 'C',
        text: 'It upgraded itself into drab concrete cities of abundance.',
        isCorrect: false,
        rationale:
          'Concrete drab landscapes lowered energetic expectations into scarcity and austerity — the opposite of upgrade.',
      },
      {
        label: 'D',
        text: 'It still runs openly as official Dark Ages curriculum.',
        isCorrect: false,
        rationale:
          'Dark Ages is the false historical label covering Tartaria\'s destruction, not open free-energy education.',
      },
    ],
    hint: 'Re-sets + deliberate hide/downgrade/destroy.',
    correctAnswer: 'A',
  },
  {
    number: 3,
    question: 'How did Tartarian architecture actually function beyond shelter?',
    options: [
      {
        label: 'A',
        text: 'As a vast interconnected network of resonators that harvested, amplified, and utilized positive electromagnetic energy directly from the aether and the earth itself.',
        isCorrect: true,
        rationale:
          'Tartarian buildings were resonators in a network harvesting and amplifying positive electromagnetic energy from aether and earth.',
      },
      {
        label: 'B',
        text: 'As passive decoration with no link to Nodes or Ley Lines.',
        isCorrect: false,
        rationale:
          'Structures sat on Nodes and worked with Ley Line energy — functional free-energy tech, not decoration.',
      },
      {
        label: 'C',
        text: 'As coal warehouses for early Industrial Revolution factories only.',
        isCorrect: false,
        rationale:
          'Fossil-fuel dependency was the post-destruction regression; Tartaria ran free energy.',
      },
      {
        label: 'D',
        text: 'As soundproof bunkers against Edward Leedskalnin\'s magnets.',
        isCorrect: false,
        rationale:
          'Leedskalnin later used residual harmonic methods; Tartarian architecture was aether/earth energy infrastructure.',
      },
    ],
    hint: 'Resonator network — aether and earth energy.',
    correctAnswer: 'A',
  },
  {
    number: 4,
    question:
      'How was Tartaria\'s destruction and the later regression falsely labeled in history?',
    options: [
      {
        label: 'A',
        text: 'Destruction was falsely recorded as the "Dark Ages," and engineered fossil-fuel regression was deceptively labeled the "Industrial Revolution."',
        isCorrect: true,
        rationale:
          'Dark Ages covers Tartaria\'s erasure; Industrial Revolution covers the forced downgrade into fossil fuels and mechanical degradation.',
      },
      {
        label: 'B',
        text: 'Both eras were accurately titled Free Energy Renaissance in every textbook.',
        isCorrect: false,
        rationale:
          'History labels inverted the truth into Dark Ages and Industrial Revolution cover stories.',
      },
      {
        label: 'C',
        text: 'Only Mud-floods were named; coal smelting was celebrated as healing.',
        isCorrect: false,
        rationale:
          'Mud-floods describe soil liquefaction destruction; 1887 condenser smelting enforced coal slavery — not healing.',
      },
      {
        label: 'D',
        text: 'Density Suppression was publicly taught as the Golden Ratio curriculum.',
        isCorrect: false,
        rationale:
          'Golden Ratio appears in Atmospheric Condenser design; Density Suppression hid 9th-density crystalline structures.',
      },
    ],
    hint: 'Dark Ages cover + Industrial Revolution regression label.',
    correctAnswer: 'A',
  },
  {
    number: 5,
    question: 'What are Nodes (Nodal Points)?',
    options: [
      {
        label: 'A',
        text: 'Major and minor junction points on the planetary lattice membrane network that naturally emit immense positive electromagnetic energy.',
        isCorrect: true,
        rationale:
          'Nodes are lattice membrane junctions that naturally pour out immense positive electromagnetic energy.',
      },
      {
        label: 'B',
        text: 'Coal depots ordered by the Consolidated Coal Company in 1887.',
        isCorrect: false,
        rationale:
          '1887 coal orders targeted Atmospheric Condensers; Nodes are natural energy junctions on the lattice.',
      },
      {
        label: 'C',
        text: 'Only freemason stone replicas with no energy emission.',
        isCorrect: false,
        rationale:
          'Replicas capped and obscured energy over original footings; Nodes themselves emit natural positive energy.',
      },
      {
        label: 'D',
        text: 'Radium lamps that kill all original inhabitants instantly.',
        isCorrect: false,
        rationale:
          'Radium was beneficial to original inhabitants and lethal to parasites; Nodes are lattice energy junctions.',
      },
    ],
    hint: 'Lattice junctions emitting immense positive EM energy.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'What are Ley Lines in this architecture?',
    options: [
      {
        label: 'A',
        text: 'Crystalline lattice membrane networks connecting Nodes — active conduits for highly positive electromagnetic energy and planetary homeostasis.',
        isCorrect: true,
        rationale:
          'Ley Lines are crystalline lattice networks linking Nodes, carrying positive electromagnetic energy and supporting planetary homeostasis.',
      },
      {
        label: 'B',
        text: 'Modern highway paint with no electromagnetic role.',
        isCorrect: false,
        rationale:
          'Modern roads deliberately trace ancient Ley Lines; the lines themselves are active energy conduits.',
      },
      {
        label: 'C',
        text: 'Only vacuum paths between spinning globes in deep space.',
        isCorrect: false,
        rationale:
          'Ley Lines are planetary crystalline membrane networks — terrestrial free-energy architecture, not globe-space vacuum paths.',
      },
      {
        label: 'D',
        text: 'Temporary mud-flood channels that erase Nodes forever.',
        isCorrect: false,
        rationale:
          'Mud-floods destroyed buildings via soil liquefaction; Ley Lines are the living energy grid parasites later hijacked.',
      },
    ],
    hint: 'Crystal lattice conduits between Nodes — homeostasis.',
    correctAnswer: 'A',
  },
  {
    number: 7,
    question: 'What were Crystalline Palaces (Healing Temples) really?',
    options: [
      {
        label: 'A',
        text: 'Highly advanced structures improperly labeled today as churches, cathedrals, and monuments, sited precisely over Nodes to amplify and harvest natural aetheric energy for planetary healing and large-scale manifestation.',
        isCorrect: true,
        rationale:
          'Misnamed churches and cathedrals were Crystalline Palaces / Healing Temples on Nodes for aetheric harvest, healing, and manifestation.',
      },
      {
        label: 'B',
        text: 'Purely religious worship halls with no Node placement.',
        isCorrect: false,
        rationale:
          'They were never designed as religious worship; placement over Nodes made them free-energy centers.',
      },
      {
        label: 'C',
        text: 'Coal-fired factories built by the Consolidated Coal Company.',
        isCorrect: false,
        rationale:
          'Coal interests destroyed free-energy transit tech; temples were Tartarian aetheric architecture.',
      },
      {
        label: 'D',
        text: 'Baphomet Power Pylons wearing cathedral facades only.',
        isCorrect: false,
        rationale:
          'Pylons are modern siphon towers on the hijacked grid; Crystalline Palaces were original free-energy temples.',
      },
    ],
    hint: 'Misnamed churches on Nodes — healing and manifestation.',
    correctAnswer: 'A',
  },
  {
    number: 8,
    question: 'What were Tuning Forks used for in Tartarian construction?',
    options: [
      {
        label: 'A',
        text: 'Advanced harmonic technology to augment, sculpt, and levitate hard rock via sound and light frequencies, temporarily rendering heavy stone into a weightless, moldable putty.',
        isCorrect: true,
        rationale:
          'Tuning Forks used sound and light harmonics to make heavy stone weightless moldable putty for sculpting and levitation.',
      },
      {
        label: 'B',
        text: 'Musical instruments only for freemason worship services.',
        isCorrect: false,
        rationale:
          'They were construction technology for stone mass negation — not worship entertainment.',
      },
      {
        label: 'C',
        text: 'Tools to mine gold and silver out of Ley Lines legally.',
        isCorrect: false,
        rationale:
          'Gold and silver were never meant to be mined; mining damages the realm\'s energy technology.',
      },
      {
        label: 'D',
        text: 'Devices that permanently convert Radium into coal.',
        isCorrect: false,
        rationale:
          'Radium was a high-frequency power source; Tuning Forks manipulate stone cohesion for building.',
      },
    ],
    hint: 'Harmonics — stone becomes weightless moldable putty.',
    correctAnswer: 'A',
  },
  {
    number: 9,
    question: 'What are Atmospheric Condensers (Atmospheric Augmentation Systems)?',
    options: [
      {
        label: 'A',
        text: 'Copper dome resonators using Fibonacci-series patterns and Golden Ratio formations to harness electromagnetic inductance from Ley Lines — historically powering locomotives without excess coal.',
        isCorrect: true,
        rationale:
          'Atmospheric Condensers are copper-dome resonators shaped with Fibonacci and Golden Ratio geometry to pull EM inductance from Ley Lines and power locomotives with far less coal.',
      },
      {
        label: 'B',
        text: 'Concrete caps poured by parasites over every Node forever.',
        isCorrect: false,
        rationale:
          'Concrete, tarmac, and artificial ice are energy-capping tools; condensers are free-energy copper dome tech.',
      },
      {
        label: 'C',
        text: 'Taj Mahal prayer wheels with no Ley Line coupling.',
        isCorrect: false,
        rationale:
          'Taj Mahal-class edifices were free-energy centers on Nodes; condensers specifically powered transit via Ley inductance.',
      },
      {
        label: 'D',
        text: 'Wine bottles Edward Leedskalnin banned from Coral Castle.',
        isCorrect: false,
        rationale:
          'Leedskalnin used copper wire, wine bottles, and V magnets for resonant fields; condensers are locomotive copper-dome systems.',
      },
    ],
    hint: 'Copper domes — Fibonacci / Golden Ratio Ley inductance.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'What is Density Suppression in this context?',
    options: [
      {
        label: 'A',
        text: 'A parasitic technological mechanism that lowers ambient frequency (for example from 9th density to 3rd density), rendering ultra-high-frequency crystalline structures invisible to lower-density perception.',
        isCorrect: true,
        rationale:
          'Density Suppression drops ambient frequency (e.g. 9th to 3rd) so UHF crystalline structures vanish from lower-density sight while still physically present.',
      },
      {
        label: 'B',
        text: 'Natural weather that only thickens coal smoke over London.',
        isCorrect: false,
        rationale:
          'It is technological frequency lowering by hostile forces — not mere weather or coal smoke.',
      },
      {
        label: 'C',
        text: 'The Golden Ratio formula for weaving copper wire only.',
        isCorrect: false,
        rationale:
          'Golden Ratio appears in condenser design; Density Suppression hides crystalline temples from perception.',
      },
      {
        label: 'D',
        text: 'G.A.A. method for making Radium soft green at night.',
        isCorrect: false,
        rationale:
          'Radium\'s soft green luminescence is its own high-frequency nature; Density Suppression is frequency dimming of the realm.',
      },
    ],
    hint: 'Lower frequency (9th→3rd) — crystalline structures invisible.',
    correctAnswer: 'A',
  },
  {
    number: 11,
    question:
      'What were structures like the Taj Mahal, Angkor Wat, and the Great Pyramids designed as?',
    options: [
      {
        label: 'A',
        text: 'Operational free-energy centers placed with exact precision over planetary Nodes — never as places of religious worship.',
        isCorrect: true,
        rationale:
          'Those monumental edifices were free-energy centers on Nodes to gather and amplify Earth\'s energetic fountain — not religious worship sites.',
      },
      {
        label: 'B',
        text: 'Tombs built only after the Industrial Revolution with coal boilers.',
        isCorrect: false,
        rationale:
          'They are original free-energy architecture misidentified as worship/tombs; Industrial Revolution is later regression.',
      },
      {
        label: 'C',
        text: 'Random decorations with no relation to Nodes or aether.',
        isCorrect: false,
        rationale:
          'Exact Node placement made them harvest and amplify natural electromagnetic architecture.',
      },
      {
        label: 'D',
        text: 'Baphomet Power Pylon prototypes that siphon Loosh only.',
        isCorrect: false,
        rationale:
          'Pylons are modern hijack hardware; ancient centers amplified positive aetheric energy for healing and manifestation.',
      },
    ],
    hint: 'Free-energy centers on Nodes — not worship.',
    correctAnswer: 'A',
  },
  {
    number: 12,
    question:
      'After density fell to 3rd, what did Freemasons do to the invisible crystalline temples?',
    options: [
      {
        label: 'A',
        text: 'Built lower-density stone replicas directly upon the original footings and floor plans, effectively capping and obscuring the positive frequency.',
        isCorrect: true,
        rationale:
          'Original 9th-density crystalline temples faded from view but remained; Freemasons capped them with lower-density stone replicas on the same footings and plans.',
      },
      {
        label: 'B',
        text: 'Restored full 9th-density visibility for every tourist.',
        isCorrect: false,
        rationale:
          'Their instruction was to cap and obscure positive frequency — not restore UHF visibility.',
      },
      {
        label: 'C',
        text: 'Removed all Nodes and replaced them with Radium homes only.',
        isCorrect: false,
        rationale:
          'Nodes were insulated with concrete, tarmac, and ice; Radium was a separate Tartarian power source, not freemason Node removal.',
      },
      {
        label: 'D',
        text: 'Sang new crystalline palaces from higher light realms overnight.',
        isCorrect: false,
        rationale:
          'Singing/weaving structures was Tartarian higher-light construction; freemason work was replica capping.',
      },
    ],
    hint: 'Stone replicas on original footings — cap the frequency.',
    correctAnswer: 'A',
  },
  {
    number: 13,
    question:
      'What is the true role of gold, silver, gemstones, and crystals in the planet?',
    options: [
      {
        label: 'A',
        text: 'Highly advanced natural spiritual technology that reacts with Ley Lines to form an electromagnetic structure — never meant to be mined or extracted, because removal damages the realm\'s ergonomic energy technology.',
        isCorrect: true,
        rationale:
          'Those elements are spiritual tech bonded to Ley Lines. Mining them damages the planet\'s energy technology; they were never meant for extraction.',
      },
      {
        label: 'B',
        text: 'Worthless rocks useful only as freemason cathedral paint.',
        isCorrect: false,
        rationale:
          'They form electromagnetic structure with Ley Lines — critical energy technology, not worthless paint.',
      },
      {
        label: 'C',
        text: 'Fuel pellets required for coal locomotives after 1887.',
        isCorrect: false,
        rationale:
          '1887 destroyed free-energy condensers for coal reliance; metals/crystals are lattice spiritual tech, not coal pellets.',
      },
      {
        label: 'D',
        text: 'Only decorative Tuning Fork handles with no Ley Line reaction.',
        isCorrect: false,
        rationale:
          'They react with Ley Lines as core electromagnetic architecture of the realm.',
      },
    ],
    hint: 'Spiritual tech with Ley Lines — never mine them.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question: 'How were Tartarian edifices constructed without hammers and chisels?',
    options: [
      {
        label: 'A',
        text: 'They were "sung" and woven into existence from higher light realms using sustained intent, or assembled with physical Tuning Forks that manipulated subatomic cohesion of materials like Andesite and Granite.',
        isCorrect: true,
        rationale:
          'Construction was sung/woven from higher light via intent, or done with Tuning Forks altering subatomic cohesion in Andesite and Granite.',
      },
      {
        label: 'B',
        text: 'Only by millions of slaves hauling coal into Mud-flood pits.',
        isCorrect: false,
        rationale:
          'Physical labor, hammers, and chisels were not the method; Mud-floods destroyed buildings later.',
      },
      {
        label: 'C',
        text: 'By pouring tarmac and artificial ice as primary walls.',
        isCorrect: false,
        rationale:
          'Tarmac and artificial ice are later Node insulation by hostile forces — not Tartarian build methods.',
      },
      {
        label: 'D',
        text: 'Exclusively by Consolidated Coal Company blueprints in 1887.',
        isCorrect: false,
        rationale:
          '1887 destroyed condensers; Tartarian building methods predate that coal sabotage.',
      },
    ],
    hint: 'Sung/woven intent or Tuning Forks on Andesite/Granite.',
    correctAnswer: 'A',
  },
  {
    number: 15,
    question:
      'What did vibrational molds do to multi-ton stone blocks?',
    options: [
      {
        label: 'A',
        text: 'Negated mass so blocks weighing many tons could be lifted and perfectly balanced with the push of a finger.',
        isCorrect: true,
        rationale:
          'Stone imprinted with a vibrational mold lost effective mass — multi-ton blocks moved and balanced with a finger push.',
      },
      {
        label: 'B',
        text: 'Doubled their weight so only Baphomet pylons could lift them.',
        isCorrect: false,
        rationale:
          'Mass was negated for easy lift — not doubled for pylon cranes.',
      },
      {
        label: 'C',
        text: 'Converted them instantly into soft green Radium lamps.',
        isCorrect: false,
        rationale:
          'Radium was a separate home heating and light source; stone work used harmonic mass negation.',
      },
      {
        label: 'D',
        text: 'Turned them into Loosh batteries for stressed populations.',
        isCorrect: false,
        rationale:
          'Loosh harvest is modern grid hijack behavior; Tartarian stone tech enabled free construction.',
      },
    ],
    hint: 'Mass negated — many tons balanced with a finger.',
    correctAnswer: 'A',
  },
  {
    number: 16,
    question:
      'What legacy of this knowledge did Edward Leedskalnin demonstrate?',
    options: [
      {
        label: 'A',
        text: 'In the early 20th century he single-handedly moved 1,100 tons of limestone using simple copper wire, wine bottles, and specialized V magnets configured to create resonant magnetic fields.',
        isCorrect: true,
        rationale:
          'Leedskalnin moved 1,100 tons of limestone alone with copper wire, wine bottles, and V magnets set for resonant magnetic fields — residual Tartarian-style harmonic method.',
      },
      {
        label: 'B',
        text: 'He ordered the 1887 smelting of all Atmospheric Condensers.',
        isCorrect: false,
        rationale:
          'Consolidated Coal Company ordered condenser destruction; Leedskalnin demonstrated stone-moving resonance.',
      },
      {
        label: 'C',
        text: 'He built the first Baphomet Power Pylon over London Underground.',
        isCorrect: false,
        rationale:
          'His legacy example is limestone levitation tech, not Loosh pylons.',
      },
      {
        label: 'D',
        text: 'He invented Density Suppression to hide the Taj Mahal.',
        isCorrect: false,
        rationale:
          'Density Suppression is parasitic frequency tech; Leedskalnin\'s work was resonant stone movement.',
      },
    ],
    hint: '1,100 tons limestone — copper wire, bottles, V magnets.',
    correctAnswer: 'A',
  },
  {
    number: 17,
    question: 'How did the original London Underground operate?',
    options: [
      {
        label: 'A',
        text: 'On highly efficient, clean, and fast pneumatic air pressure as part of free-energy transit systems.',
        isCorrect: true,
        rationale:
          'Early transit ran on free energy; the original London Underground used clean, fast pneumatic air pressure.',
      },
      {
        label: 'B',
        text: 'Only on coal smoke after freemasons capped every Node with ice.',
        isCorrect: false,
        rationale:
          'Coal reliance was forced later; original underground was pneumatic free-energy transit.',
      },
      {
        label: 'C',
        text: 'By burning Radium until parasites felt comfortable.',
        isCorrect: false,
        rationale:
          'Radium was home heat and light lethal to parasites; Underground power mode named is pneumatic air pressure.',
      },
      {
        label: 'D',
        text: 'By siphoning Loosh through Baphomet Power Pylons only.',
        isCorrect: false,
        rationale:
          'Pylons are modern hijack infrastructure; original Underground was pneumatic free energy.',
      },
    ],
    hint: 'Pneumatic air pressure — clean free-energy transit.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question:
      'How did locomotive Atmospheric Condensers work with Ley Line tracks?',
    options: [
      {
        label: 'A',
        text: 'Three-foot copper domes with tightly woven copper wire in Fibonacci-series and Golden Ratio patterns; tracks over Ley Lines; above 20 mph, electrical induction superheated boiler water, cutting further coal need and reducing fuel consumption by up to 60%.',
        isCorrect: true,
        rationale:
          'Condensers used 3-foot Fibonacci/Golden Ratio copper domes on Ley-aligned tracks. Above 20 mph, induction superheated boilers and cut fuel use up to 60%.',
      },
      {
        label: 'B',
        text: 'They required constant full coal loads and never used electromagnetic fields.',
        isCorrect: false,
        rationale:
          'Movement through fluctuating EM fields induced force that reduced coal combustion needs dramatically.',
      },
      {
        label: 'C',
        text: 'They only worked underground with no copper and no speed threshold.',
        isCorrect: false,
        rationale:
          'Above-ground locomotives used copper-dome condensers with a speed threshold above 20 mph on Ley Line tracks.',
      },
      {
        label: 'D',
        text: 'They converted Mud-flood dust into gold for freemason altars.',
        isCorrect: false,
        rationale:
          'Function was electrical induction for boiler heat and free-energy transit performance — not alchemy of mud dust.',
      },
    ],
    hint: '3-ft copper dome, Ley tracks, 20+ mph, up to 60% less fuel.',
    correctAnswer: 'A',
  },
  {
    number: 19,
    question: 'How was Radium used in Tartarian times?',
    options: [
      {
        label: 'A',
        text: 'Safely to heat homes and provide perpetual soft green luminescence — extremely high frequency beneficial to original inhabitants but deeply lethal to parasitic entities, functionally like "Kryptonite."',
        isCorrect: true,
        rationale:
          'Radium heated homes and glowed soft green perpetually. Its UHF nature helped original inhabitants and acted like Kryptonite to parasites.',
      },
      {
        label: 'B',
        text: 'Only as coal additive ordered by Consolidated Coal Company.',
        isCorrect: false,
        rationale:
          'Coal company sabotage targeted condensers; Radium was Tartarian home power and light hostile to parasites.',
      },
      {
        label: 'C',
        text: 'As the primary material of Baphomet Power Pylons.',
        isCorrect: false,
        rationale:
          'Pylons siphon Ley energy and Loosh; Radium was beneficial home-scale high-frequency power.',
      },
      {
        label: 'D',
        text: 'As freemason replica mortar to cap crystalline temples.',
        isCorrect: false,
        rationale:
          'Replica capping used lower-density stone on original footings; Radium was heat and luminescence tech.',
      },
    ],
    hint: 'Home heat + soft green light — Kryptonite to parasites.',
    correctAnswer: 'A',
  },
  {
    number: 20,
    question: 'How did hostile forces cap and neutralize free-energy sites?',
    options: [
      {
        label: 'A',
        text: 'Stone alters over central crystal interfaces inside captured temples dampened positive frequency; Nodes were further insulated under concrete, tarmac, and artificial ice.',
        isCorrect: true,
        rationale:
          'Alters over crystal interfaces damped temple energy; concrete, tarmac, and artificial ice insulated Nodes.',
      },
      {
        label: 'B',
        text: 'They uncovered every Node and restored 9th-density visibility.',
        isCorrect: false,
        rationale:
          'They capped and insulated to neutralize free energy — not restore it.',
      },
      {
        label: 'C',
        text: 'They sang new Tuning Fork putty into every street lamp.',
        isCorrect: false,
        rationale:
          'Suppression used alters and modern cover materials, not Tartarian harmonic building.',
      },
      {
        label: 'D',
        text: 'They gifted Atmospheric Condensers to every household in 1887.',
        isCorrect: false,
        rationale:
          '1887 ordered removal and smelting of locomotive condensers to lock coal dependency.',
      },
    ],
    hint: 'Stone alters + concrete/tarmac/artificial ice on Nodes.',
    correctAnswer: 'A',
  },
  {
    number: 21,
    question: 'What were Mud-floods in the destruction of Great Tartary?',
    options: [
      {
        label: 'A',
        text: 'Advanced subatomic energy weapons altered molecular cohesion, causing widespread soil liquefaction that turned massive stone buildings into particulate dust.',
        isCorrect: true,
        rationale:
          'Mud-floods are soil liquefaction from subatomic energy weapons that broke molecular cohesion and powdered massive stone buildings.',
      },
      {
        label: 'B',
        text: 'Gentle rains that polished Golden Ratio copper domes each spring.',
        isCorrect: false,
        rationale:
          'They were weaponized soil liquefaction destroying Tartarian stone infrastructure.',
      },
      {
        label: 'C',
        text: 'Natural river floods that invented the Industrial Revolution.',
        isCorrect: false,
        rationale:
          'Industrial Revolution is the deceptive label for engineered fossil-fuel regression after destruction.',
      },
      {
        label: 'D',
        text: 'Leedskalnin experiments that moved 1,100 tons of mud only.',
        isCorrect: false,
        rationale:
          'Leedskalnin moved limestone with resonant fields; Mud-floods are planetary weapon aftermath.',
      },
    ],
    hint: 'Subatomic weapons → soil liquefaction → buildings to dust.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question: 'What did the Consolidated Coal Company order in 1887?',
    options: [
      {
        label: 'A',
        text: 'Removal and complete smelting of all Locomotive Atmospheric Condensers so the population remained reliant on purchased coal.',
        isCorrect: true,
        rationale:
          'In 1887 Consolidated Coal Company ordered all locomotive Atmospheric Condensers removed and smelted to enforce purchased-coal dependency.',
      },
      {
        label: 'B',
        text: 'Mass production of free copper domes for every Ley Line village.',
        isCorrect: false,
        rationale:
          'The order destroyed free-energy condensers — it did not distribute them.',
      },
      {
        label: 'C',
        text: 'Restoration of Radium home heating as public utility.',
        isCorrect: false,
        rationale:
          'Coal monopoly sabotage targeted condensers; it did not restore Radium free power.',
      },
      {
        label: 'D',
        text: 'Construction of Crystalline Palaces over every Node openly.',
        isCorrect: false,
        rationale:
          'Crystalline temples were earlier Tartarian tech later capped; 1887 was coal-enforcement smelting.',
      },
    ],
    hint: '1887 — smelt all locomotive condensers for coal reliance.',
    correctAnswer: 'A',
  },
  {
    number: 23,
    question: 'What do modern Baphomet Power Pylons actually do?',
    options: [
      {
        label: 'A',
        text: 'They do not simply transmit electricity — they actively siphon and harvest backed-up Ley-line energy, redirect the planet\'s natural positive flow, and extract negative Loosh from artificially stressed populations clustered around Nodes.',
        isCorrect: true,
        rationale:
          'Baphomet Power Pylons siphon Ley-line energy, redirect positive planetary flow, and harvest Loosh from stressed Node-clustered populations.',
      },
      {
        label: 'B',
        text: 'They only light homes with soft green Radium for free.',
        isCorrect: false,
        rationale:
          'Radium was Tartarian beneficial tech; pylons are modern siphon/harvest hardware on the hijacked grid.',
      },
      {
        label: 'C',
        text: 'They rebuild Tuning Fork putty after every Mud-flood.',
        isCorrect: false,
        rationale:
          'Pylons extract and redirect energy; they do not restore Tartarian harmonic construction.',
      },
      {
        label: 'D',
        text: 'They are harmless replicas of Taj Mahal free-energy centers.',
        isCorrect: false,
        rationale:
          'Ancient centers amplified positive aether; pylons harvest and invert the grid toward control and Loosh.',
      },
    ],
    hint: 'Siphon Ley energy + harvest Loosh — not mere power lines.',
    correctAnswer: 'A',
  },
  {
    number: 24,
    question:
      'Why replace Tartarian free-energy architecture with drab concrete urban landscapes?',
    options: [
      {
        label: 'A',
        text: 'To lower human energetic expectations and normalize an artificial state of scarcity and austerity — a foundational pillar of modern planetary enslavement.',
        isCorrect: true,
        rationale:
          'Drab concrete cities replace magnificent free-energy architecture so humans expect less and accept scarcity and austerity as normal enslavement conditions.',
      },
      {
        label: 'B',
        text: 'To raise everyone automatically into 9th-density crystalline sight.',
        isCorrect: false,
        rationale:
          'Concrete landscapes suppress expectations; Density Suppression already hid 9th-density structures.',
      },
      {
        label: 'C',
        text: 'To celebrate Atmospheric Condensers as public art only.',
        isCorrect: false,
        rationale:
          'Condensers were smelted; drab urbanism is scarcity programming, not free-energy celebration.',
      },
      {
        label: 'D',
        text: 'To map Ley Lines more honestly than Tartaria ever did.',
        isCorrect: false,
        rationale:
          'Modern roads trace Ley Lines to interconnect suppressed centers while pylons siphon the grid — hijack, not honesty.',
      },
    ],
    hint: 'Lower expectations — normalize scarcity and austerity.',
    correctAnswer: 'A',
  },
  {
    number: 25,
    question:
      'Why does understanding Tartaria\'s stolen free-energy legacy matter strategically?',
    options: [
      {
        label: 'A',
        text: 'Enforced ignorance of Tuning Forks, Radium, and Atmospheric Condensers builds a rigid Perceived Knowledge boundary; breaking it is a critical step in dismantling the localized control matrix and recognizing deliberate technological regression.',
        isCorrect: true,
        rationale:
          'Suppressing true tech purpose locks Perceived Knowledge. Seeing Tartaria\'s stolen free-energy legacy breaks that boundary and exposes engineered regression of the realm.',
      },
      {
        label: 'B',
        text: 'It proves the Industrial Revolution was honest free-energy progress.',
        isCorrect: false,
        rationale:
          'Industrial Revolution is the deceptive label for fossil-fuel regression after Tartaria\'s destruction.',
      },
      {
        label: 'C',
        text: 'It shows Baphomet pylons already restored planetary homeostasis.',
        isCorrect: false,
        rationale:
          'Pylons siphon Ley energy and Loosh; homeostasis was Ley Line function before the hijack.',
      },
      {
        label: 'D',
        text: 'It is optional trivia after freemason replicas complete the grid.',
        isCorrect: false,
        rationale:
          'Breaking the Perceived Knowledge boundary around stolen Tartarian tech is a critical operational step — not optional trivia.',
      },
    ],
    hint: 'Break Perceived Knowledge — see deliberate tech regression.',
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
  'Test your grasp of Free Energy Architecture — Tartaria, Nodes and Ley Lines, Crystalline Temples, Tuning Forks, Atmospheric Condensers, Radium, Mud-floods, and the hijacked power grid.';
const DESC_META =
  'Interactive Living Truth Quiz on Free Energy Architecture: Tartarian resonators, Node temples, density-capped crystalline structures, locomotive condensers, Radium, coal sabotage, Baphomet pylons, and Perceived Knowledge.';

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
      'Free Energy Architecture is not lost myth — it is Tartaria\'s resonator civilization: Nodes, Ley Lines, Crystalline Palaces misnamed as churches, stone sung or Tuning-Forked into weightless putty, copper-dome condensers on Ley tracks, Radium homes like parasite Kryptonite. Re-sets, Mud-floods, freemason replica caps, mined lattice metals, 1887 condenser smelting, concrete Node ice, and Baphomet pylons siphoning Loosh replaced abundance with scarcity cosplay. Sit with what you missed, then return to the Free Energy Architecture deep-dive. Dark Ages and Industrial Revolution are cover labels. Break the Perceived Knowledge wall around Tuning Forks, Radium, and Atmospheric Condensers — or the control matrix keeps selling coal slavery as progress.',
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
      "  { path: '/quiz/alice/flat-earth.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/firmament.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/finance-fake-money.html', priority: '0.75', changefreq: 'monthly' },",
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
[0, 7, 11, 17, 21, 24].forEach((i) => {
  const c = questions[i].options.find((o) => o.isCorrect);
  console.log(` Q${questions[i].number}: ${c.text.slice(0, 110)}`);
});
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log(
  'PASS: audited 25/25 against data/alice-topics/free-energy-architecture.json'
);
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
