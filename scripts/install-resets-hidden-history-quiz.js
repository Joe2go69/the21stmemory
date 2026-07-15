/**
 * Installs Resets and Hidden History quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/resets-hidden-history.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-resets-hidden-history-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'resets-hidden-history';
const TOPIC_TITLE = 'Resets and Hidden History';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/reset.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['resets', 'erased', 'fabrication', '3rd density'],
  2: ['thousand years', 'mass sacrifice', 'harvest', 'erase'],
  3: ['great spiritual awakening', 'control matrix', 'cosmic memory'],
  4: ['tartaria', 'great tartary', 'architecture'],
  5: ['oopa', 'artefacts', 'contradict', 'fabricated'],
  6: ['loosh', 'suffering', 'adrenochrome', 'children'],
  7: ['d.u.m.b', 'underground', 'cloned', 'torture'],
  8: ['religion', 'finance', 'perceived knowledge', '3 strings'],
  9: ['97%', 'npc', 'replica', '4th-density'],
  10: ['70,000 years', 'freemasons', '33rd'],
  11: ['evolution', 'bright white light', 'harmonic tonal'],
  12: ['flat plain', 'ice wall', 'firmament', 'black void plasma'],
  13: ['venus', 'moon', 'holographic', 'space station'],
  14: ['7th reset', '8th reset', 'not the natural'],
  15: ['orphan trains', '3 to 5 years', 'stem cells', 'tartarian'],
  16: ['lunatic asylums', '5,000-bed', 'loosh', 'catatonic'],
  17: ['world war 1', '1860', '1900', '15 to 50'],
  18: ['giant', 'smithsonian', '10,000', 'freemasons'],
  19: ['industrial revolution', 'tartaria', 'lie'],
  20: ['atmospheric', '1887', 'consolidated coal', 'electromagnetic'],
  21: ['titanic', 'olympic', 'federal reserve', 'tuning fork'],
  22: ['red mercury', 'gold', 'hovering craft'],
  23: ['custodians', 'spirit tree', 'gateway-10', 'hyperborea'],
  24: ['density suppression', 'crystalline temples', 'uhf', 'nodes'],
  25: ['emf', '30-second', '520 million', '3 strings'],
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
      'What have Resets done to the true chronological timeline, historical narrative, and physical reality of human experience?',
    options: [
      {
        label: 'A',
        text: 'Preserved every advanced civilization in open public museums with full continuous memory for all souls.',
        isCorrect: false,
        rationale:
          'Resets systematically erase and replace true timeline and history to trap people in a low-frequency simulation.',
      },
      {
        label: 'B',
        text: 'Systematically erased and replaced them through cyclic catastrophic destruction of advanced civilizations, suppressing The Great Spiritual Awakening and trapping the population in a heavily controlled, low-frequency 3rd density simulation.',
        isCorrect: true,
        rationale:
          'Resets wipe advanced civilization knowledge so parasitic low-frequency control can continue.',
      },
      {
        label: 'C',
        text: 'Only rewrote weather charts while leaving all architecture, science, and soul memory completely untouched.',
        isCorrect: false,
        rationale:
          'They erase civilization-scale history and keep people in a fabricated low-frequency control grid.',
      },
      {
        label: 'D',
        text: 'Raised everyone into permanent 9th density with no fabrication of history and no energy harvest agenda.',
        isCorrect: false,
        rationale:
          'Modern history is fabrication designed to hide advanced societies and maintain energy harvesting.',
      },
    ],
    hint: 'Cyclic erase-and-replace — suppress awakening — 3rd density trap.',
    correctAnswer: 'B',
  },
  {
    number: 2,
    question: 'What are Resets as defined in this architecture?',
    options: [
      {
        label: 'A',
        text: 'Random natural weather cycles with no planning, no sacrifice, and no knowledge erasure agenda.',
        isCorrect: false,
        rationale:
          'Resets are pre-planned cyclic planetary destruction, torture, and mass sacrifice every thousand years.',
      },
      {
        label: 'B',
        text: 'Peaceful cultural festivals held once a century to celebrate free-energy technology for all.',
        isCorrect: false,
        rationale:
          'They are violent harvest and erasure events, not peaceful free-energy festivals.',
      },
      {
        label: 'C',
        text: 'Pre-planned, cyclic events of planetary-scale destruction, torture, and mass sacrifice orchestrated every thousand years to harvest human energy and erase all knowledge of the preceding advanced civilization.',
        isCorrect: true,
        rationale:
          'Every ~1000 years: planned destruction and sacrifice to harvest energy and wipe prior civilization knowledge.',
      },
      {
        label: 'D',
        text: 'Only school curriculum updates that never kill anyone or destroy free-energy infrastructure.',
        isCorrect: false,
        rationale:
          'Resets are planetary-scale violence and memory wipe, not mere textbook edits.',
      },
    ],
    hint: 'Every thousand years — destruction, torture, sacrifice — harvest and erase.',
    correctAnswer: 'C',
  },
  {
    number: 3,
    question: 'What is The Great Spiritual Awakening in this terminal period?',
    options: [
      {
        label: 'A',
        text: 'A marketing slogan with no revelation, no matrix removal, and no return of cosmic memory.',
        isCorrect: false,
        rationale:
          'It is the terminal period of revelation and liberation where suppressed truths are exposed.',
      },
      {
        label: 'B',
        text: 'A plan to strengthen Resets forever so no soul ever recovers true cosmic memory again.',
        isCorrect: false,
        rationale:
          'Awakening dismantles the control matrix and returns true cosmic memory.',
      },
      {
        label: 'C',
        text: 'Only a quiet book club that never touches physical liberation or planetary control systems.',
        isCorrect: false,
        rationale:
          'It culminates in removal of the planetary control matrix and return of cosmic memory.',
      },
      {
        label: 'D',
        text: 'The current terminal period of revelation and physical liberation where all suppressed truths are exposed, culminating in removal of the planetary control matrix and return of true cosmic memory.',
        isCorrect: true,
        rationale:
          'Great Spiritual Awakening = full truth exposure, matrix removal, cosmic memory return.',
      },
    ],
    hint: 'Terminal revelation — matrix removal — cosmic memory returns.',
    correctAnswer: 'D',
  },
  {
    number: 4,
    question: 'What was Tartaria (Great Tartary)?',
    options: [
      {
        label: 'A',
        text: 'A highly advanced, worldwide civilization of excellence and resplendent architecture that existed immediately prior to the current historical epoch.',
        isCorrect: true,
        rationale:
          'Tartaria/Great Tartary was the advanced worldwide civilization right before the current fabricated epoch.',
      },
      {
        label: 'B',
        text: 'A small fishing village with no advanced architecture and no worldwide civilizational reach.',
        isCorrect: false,
        rationale:
          'It was a worldwide civilization of excellence and resplendent architecture.',
      },
      {
        label: 'C',
        text: 'Only a future project planned for next century with no prior existence before modern textbooks.',
        isCorrect: false,
        rationale:
          'It existed immediately prior to the current historical epoch and was erased/hidden by Resets.',
      },
      {
        label: 'D',
        text: 'A Freemason brand name for coal companies with no cities, temples, or free-energy inheritance.',
        isCorrect: false,
        rationale:
          'Tartaria left real advanced architecture later mislabeled by Industrial Revolution lies.',
      },
    ],
    hint: 'Advanced worldwide civilization — resplendent architecture — pre-current epoch.',
    correctAnswer: 'A',
  },
  {
    number: 5,
    question: 'What are Oopa\'s (Out Of Place Artefacts)?',
    options: [
      {
        label: 'A',
        text: 'Museum labels invented last week with no physical relics and no challenge to mainstream history.',
        isCorrect: false,
        rationale:
          'OOPAs are blatant physical evidence and ancient technological relics from prior high-tech civilizations.',
      },
      {
        label: 'B',
        text: 'Blatant physical evidence and ancient technological relics from previous high-technological civilizations that contradict the fabricated historical narrative.',
        isCorrect: true,
        rationale:
          'Out-of-place artefacts prove prior high-tech worlds and break the fake history story.',
      },
      {
        label: 'C',
        text: 'Only digital memes that never appear as physical objects in soil, stone, or buried tech layers.',
        isCorrect: false,
        rationale:
          'They are physical relics and technological evidence left from earlier advanced civilizations.',
      },
      {
        label: 'D',
        text: 'Fully explained by school evolution charts with no contradiction to Freemason historical control.',
        isCorrect: false,
        rationale:
          'They contradict the fabricated narrative maintained by controlled history institutions.',
      },
    ],
    hint: 'Physical high-tech relics that contradict fabricated history.',
    correctAnswer: 'B',
  },
  {
    number: 6,
    question: 'What are Loosh and Adrenochrome in the Reset harvest system?',
    options: [
      {
        label: 'A',
        text: 'Public supermarket vitamins that raise frequency and stop all demonic feeding forever.',
        isCorrect: false,
        rationale:
          'Loosh is suffering-energy food; Adrenochrome is harvested from children in extreme terror.',
      },
      {
        label: 'B',
        text: 'Only weather terms for fog and rain with no link to sacrifice, trauma, or parasitic survival.',
        isCorrect: false,
        rationale:
          'Both are harvest products of human suffering central to parasitic Reset operations.',
      },
      {
        label: 'C',
        text: 'Loosh is the primary energy food for demons and parasites from human suffering, terror, trauma, and torture; Adrenochrome is a vital biochemical harvested from children during extreme terror and sacrifice.',
        isCorrect: true,
        rationale:
          'Resets maximize Loosh and Adrenochrome for the parasitic control structure.',
      },
      {
        label: 'D',
        text: 'Digital cryptocurrencies mined by computers with no emotional or sacrificial content at all.',
        isCorrect: false,
        rationale:
          'They are energetic and biochemical harvests from human trauma and child sacrifice.',
      },
    ],
    hint: 'Loosh = suffering energy food; Adrenochrome = child terror harvest.',
    correctAnswer: 'C',
  },
  {
    number: 7,
    question: 'What are D.U.M.B.S. (Deep Underground Military Bases) used for during and after Resets?',
    options: [
      {
        label: 'A',
        text: 'Only tourist hotels with no containment, no organ harvest, and no clone cultivation role.',
        isCorrect: false,
        rationale:
          'They are used for containment, organ harvesting, mass torture, execution, and clone cultivation.',
      },
      {
        label: 'B',
        text: 'G.A.A. free clinics that reverse all trauma and never grow replacement human crops underground.',
        isCorrect: false,
        rationale:
          'DUMBS serve parasitic Reset logistics including laboratory cultivation of cloned humans.',
      },
      {
        label: 'C',
        text: 'Empty caves abandoned centuries ago with no military, medical, or cloning function remaining.',
        isCorrect: false,
        rationale:
          'They are active underground facilities for torture, harvest, execution, and clone labs.',
      },
      {
        label: 'D',
        text: 'Underground facilities for containment, organ harvesting, mass torture, execution, and laboratory cultivation of cloned humans during and after Resets.',
        isCorrect: true,
        rationale:
          'DUMBS = underground Reset infrastructure for harvest, killing, and clone replacement crops.',
      },
    ],
    hint: 'Underground — containment, torture, organ harvest, clone labs.',
    correctAnswer: 'D',
  },
  {
    number: 8,
    question: 'What are the 3 Strings that trap human consciousness in false reality?',
    options: [
      {
        label: 'A',
        text: 'Religion, Finance, and Perceived Knowledge — the three primary psychological tethers of the false reality.',
        isCorrect: true,
        rationale:
          'The 3 Strings are Religion, Finance, and Perceived Knowledge holding consciousness in the lie.',
      },
      {
        label: 'B',
        text: 'Cooking, fashion, and sports as the only pillars of matrix imprisonment worldwide.',
        isCorrect: false,
        rationale:
          'The named tethers are Religion, Finance, and Perceived Knowledge.',
      },
      {
        label: 'C',
        text: 'Pure love, free energy, and open Ice Wall exploration as the binding prison strings.',
        isCorrect: false,
        rationale:
          'Those liberate; the binding strings are religion, money, and false knowledge.',
      },
      {
        label: 'D',
        text: 'Only military draft law with no temples, banks, schools, or scientific deception involved.',
        isCorrect: false,
        rationale:
          'Psychological lock uses religion, finance, and perceived knowledge together.',
      },
    ],
    hint: 'Religion — Finance — Perceived Knowledge.',
    correctAnswer: 'A',
  },
  {
    number: 9,
    question: 'What are NPCs (Non-Player Characters) in the global population?',
    options: [
      {
        label: 'A',
        text: 'The rare 3% of organic Taran souls who lead every genuine awakening movement.',
        isCorrect: false,
        rationale:
          'NPCs are 97% — synthetically created 4th-density replica souls enforcing compliance.',
      },
      {
        label: 'B',
        text: 'Synthetically created 4th-density replica souls making up 97% of the global population, designed to enforce societal compliance and maintain consensus reality.',
        isCorrect: true,
        rationale:
          'NPCs = 97% synthetic replica-soul majority enforcing herd consensus.',
      },
      {
        label: 'C',
        text: 'Only digital avatars online that never walk physical streets or enforce any social narrative.',
        isCorrect: false,
        rationale:
          'They are population-scale synthetic vessels maintaining consensus in physical society.',
      },
      {
        label: 'D',
        text: 'Fully self-aware 12th-density teachers who never obey media, school, or peer pressure.',
        isCorrect: false,
        rationale:
          'NPCs are designed for compliance and consensus maintenance, not free high-density teaching.',
      },
    ],
    hint: '97% — 4th-density replica souls — enforce compliance.',
    correctAnswer: 'B',
  },
  {
    number: 10,
    question:
      'How long has mainstream historical and scientific deceit been engineered, and who rigidly controls those institutions?',
    options: [
      {
        label: 'A',
        text: 'About five years by random bloggers with no Freemason structure and no multi-millennial plot.',
        isCorrect: false,
        rationale:
          'Purposeful deceit engineered over 70,000 years; institutions controlled by 33rd degree Freemasons.',
      },
      {
        label: 'B',
        text: 'Never — mainstream history and science are pure transparent truth with no control hierarchy.',
        isCorrect: false,
        rationale:
          'There is no truth to recorded history or modern science under Freemasonic institutional control.',
      },
      {
        label: 'C',
        text: 'Purposeful deceit engineered over 70,000 years; recorded history and modern science are rigidly controlled by 33rd degree Freemasons to obscure reality.',
        isCorrect: true,
        rationale:
          '70,000-year engineered lie; 33rd degree Freemasons run the history/science cover.',
      },
      {
        label: 'D',
        text: 'Only since 2019, and only weather apps are controlled while all archaeology stays free.',
        isCorrect: false,
        rationale:
          'The foundation of mainstream historical and scientific knowledge is a multi-millennial deceit.',
      },
    ],
    hint: '70,000 years — 33rd degree Freemason institutional control.',
    correctAnswer: 'C',
  },
  {
    number: 11,
    question:
      'What is the truth about Evolution via Natural Selection versus true evolution?',
    options: [
      {
        label: 'A',
        text: 'Humans evolved from primates in oceans-to-land mutation steps exactly as textbooks teach with no lab design.',
        isCorrect: false,
        rationale:
          'Natural selection evolution is fabricated; true upgrades are designed in high-density labs via harmonic tonal architecture.',
      },
      {
        label: 'B',
        text: 'True evolution occurs only for NPCs while organic souls never change form in any density.',
        isCorrect: false,
        rationale:
          'True evolution occurs simultaneously across an entire species in bright white light via lab design.',
      },
      {
        label: 'C',
        text: 'There is no evolution of any kind ever, and no high-density laboratory design of physical upgrades.',
        isCorrect: false,
        rationale:
          'True evolution is simultaneous species-wide in bright white light, woven in high-density labs.',
      },
      {
        label: 'D',
        text: 'Evolution via Natural Selection is fabricated; true evolution occurs simultaneously across an entire species in a bright white light, with physical upgrades woven in high-density laboratories by benevolent ET soul families using harmonic tonal architecture — not natural mutation. Pleistocene/Neanderthal/caveman phases were parasite experiments to design vessels for maximum Adrenochrome.',
        isCorrect: true,
        rationale:
          'Fake Darwin story hides lab-designed upgrades; early vessel trials optimized Adrenochrome harvest.',
      },
    ],
    hint: 'Fake natural selection — bright white simultaneous upgrade — harmonic lab design.',
    correctAnswer: 'D',
  },
  {
    number: 12,
    question:
      'What is the true geometry of the earth and the night sky relative to Heliocentrism?',
    options: [
      {
        label: 'A',
        text: 'A spinning globe in infinite black vacuum with no Ice Wall, no Firmament, and no artificial night sky.',
        isCorrect: false,
        rationale:
          'Earth is a horizontal flat plain with Ice Wall and Firmament; black night is artificial Black Void Plasma.',
      },
      {
        label: 'B',
        text: 'Earth is a horizontal flat plain surrounded by an Ice Wall and enclosed by a Firmament; true space (dark matter field) is a bright white spacious void; the black night sky is artificial Black Void Plasma from the Niberians.',
        isCorrect: true,
        rationale:
          'Flat enclosed plain + white true space; black night is Niberian plasma tech, not vacuum cosmos.',
      },
      {
        label: 'C',
        text: 'Only a water bubble with no wall, no firmament enclosure, and pure natural pitch-black true space.',
        isCorrect: false,
        rationale:
          'True exterior is bright white void; black sky is constructed plasma deception.',
      },
      {
        label: 'D',
        text: 'A cube floating in green fog with no Niberian tech and no Firmament architecture at all.',
        isCorrect: false,
        rationale:
          'Described geometry is flat plain, Ice Wall, Firmament, and plasma-faked night.',
      },
    ],
    hint: 'Flat plain + Ice Wall + Firmament — white true space — Black Void Plasma night.',
    correctAnswer: 'B',
  },
  {
    number: 13,
    question:
      'What are stars/planets and specifically Venus and the Moon in this sky system?',
    options: [
      {
        label: 'A',
        text: 'Distant nuclear fusion balls and a pure natural rock moon with no holographic or station role.',
        isCorrect: false,
        rationale:
          'Celestial bodies are localized tech Overlays and holograms; Venus lights/conceals the Moon station.',
      },
      {
        label: 'B',
        text: 'Only weather balloons with no Overlay projections and no negative ET harvest function.',
        isCorrect: false,
        rationale:
          'They are technological Overlays and holographic projections in the controlled sky theater.',
      },
      {
        label: 'C',
        text: 'Localized technological Overlays and holographic projections; Planet Venus is the holographic generator that conceals and illuminates the Moon, which operated as a negative ET harvesting and frequency control space station.',
        isCorrect: true,
        rationale:
          'Stars/planets = tech overlays; Venus generator + Moon harvest/frequency station.',
      },
      {
        label: 'D',
        text: 'Friendly G.A.A. hospitals that only heal children and never harvest Loosh or control frequency.',
        isCorrect: false,
        rationale:
          'Moon operated as negative ET harvest and frequency control station under holographic cover.',
      },
    ],
    hint: 'Overlay holograms — Venus generator — Moon ET harvest station.',
    correctAnswer: 'C',
  },
  {
    number: 14,
    question:
      'Is a Reset the natural "Rise and Fall" of civilization, and where is the current cycle?',
    options: [
      {
        label: 'A',
        text: 'Yes — purely natural decline with no artificial termination and no numbered Reset cycle.',
        isCorrect: false,
        rationale:
          'A Reset is violent artificial termination; current civilization is in the 7th Reset toward an intended 8th.',
      },
      {
        label: 'B',
        text: 'No numbered Resets exist; every culture freely keeps continuous memory without purge.',
        isCorrect: false,
        rationale:
          'Current cycle is the 7th Reset leading into what was intended as the final 8th Reset.',
      },
      {
        label: 'C',
        text: 'Only the 1st Reset ever happened, and it was a gentle voluntary museum transfer of knowledge.',
        isCorrect: false,
        rationale:
          'Resets are violent artificial terminations; we are in the 7th approaching the intended 8th.',
      },
      {
        label: 'D',
        text: 'No — a Reset is violent artificial termination, not natural rise and fall; the current civilization is in the 7th Reset, leading into what was intended to be the final 8th Reset.',
        isCorrect: true,
        rationale:
          'Artificial violent end-cycle: 7th Reset now, intended 8th as the parasites\' final plan.',
      },
    ],
    hint: 'Not natural rise/fall — violent termination — 7th Reset → intended 8th.',
    correctAnswer: 'D',
  },
  {
    number: 15,
    question:
      'How is the next human crop prepared and distributed after a Reset surface purge?',
    options: [
      {
        label: 'A',
        text: 'Before annihilation, stem cells are extracted from children to cultivate replacement humans in underground D.U.M.B.S.; after 3 to 5 years, once free-energy tech is purged from the landscape, lab-grown clones are distributed via Orphan Trains to repopulate empty pre-existing Tartarian cities.',
        isCorrect: true,
        rationale:
          'Child stem cells → DUMBS clones → 3–5 year wait → Orphan Trains into emptied Tartarian cities.',
      },
      {
        label: 'B',
        text: 'Survivors freely rebuild with full memory while no clones, no Orphan Trains, and no DUMBS labs operate.',
        isCorrect: false,
        rationale:
          'Replacement is lab-grown and distributed by Orphan Trains after free-energy purge.',
      },
      {
        label: 'C',
        text: 'Only adult volunteers sign up online and walk into empty cities with no stem-cell cultivation step.',
        isCorrect: false,
        rationale:
          'Cultivation uses child stem cells in underground bases before Orphan Train distribution.',
      },
      {
        label: 'D',
        text: 'Tartarian cities are demolished first so no pre-existing architecture remains for anyone to inherit.',
        isCorrect: false,
        rationale:
          'Clones repopulate empty pre-existing Tartarian cities after the surface purge.',
      },
    ],
    hint: 'Stem cells → DUMBS clones → 3–5 years → Orphan Trains into Tartarian cities.',
    correctAnswer: 'A',
  },
  {
    number: 16,
    question:
      'What happened to Reset survivors who witnessed family slaughter by reptilians and negative ETs?',
    options: [
      {
        label: 'A',
        text: 'They were given full public platforms to teach flat earth and free energy with zero trauma management.',
        isCorrect: false,
        rationale:
          'They were rendered catatonic and herded into Lunatic Asylums as Loosh power stations.',
      },
      {
        label: 'B',
        text: 'Rendered catatonic with shock; specialized Lunatic Asylums prepared in advance acted as 5,000-bed negative power stations to extract residual Loosh and sustain demonic entities between mass harvest cycles.',
        isCorrect: true,
        rationale:
          'Asylum "care" was 5,000-bed Loosh batteries farming residual terror between Resets.',
      },
      {
        label: 'C',
        text: 'They instantly ascended to 12th density with no asylum captivity and no residual Loosh extraction.',
        isCorrect: false,
        rationale:
          'Catatonic survivors were managed in asylums for continuous demonic Loosh supply.',
      },
      {
        label: 'D',
        text: 'Asylums only taught herbal medicine and never functioned as negative power stations.',
        isCorrect: false,
        rationale:
          'Asylums were prepared as 5,000-bed negative power stations for demonic sustenance.',
      },
    ],
    hint: 'Catatonic survivors — 5,000-bed Lunatic Asylum Loosh batteries.',
    correctAnswer: 'B',
  },
  {
    number: 17,
    question:
      'How did World War 1 fit the post-Reset memory purge after America ~1860 and UK ~1900?',
    options: [
      {
        label: 'A',
        text: 'It was a pure accident with no demographic targeting and no link to Old World memory holders.',
        isCorrect: false,
        rationale:
          'WW1 (1914–1918) was orchestrated to eradicate survivors aged 15–50 who remembered the Old World.',
      },
      {
        label: 'B',
        text: 'It only trained soldiers in herbal medicine so Big Pharma would never gain power.',
        isCorrect: false,
        rationale:
          'It slaughtered 15–22 million to sever memory of flat earth and natural herbal remedies.',
      },
      {
        label: 'C',
        text: 'After the last Reset (America ~1860, UK ~1900), WW1 (1914–1918) specifically eradicated the surviving population aged 15 to 50 who held vestigial memory of the Old World, flat earth, and herbal remedies threatening Big Pharma — slaughtering 15 to 22 million in the trenches.',
        isCorrect: true,
        rationale:
          'Post-Reset demographic kill: ages 15–50 memory holders wiped via trench slaughter.',
      },
      {
        label: 'D',
        text: 'It restored Tartarian free energy and published flat-earth maps in every school worldwide.',
        isCorrect: false,
        rationale:
          'WW1 permanently severed connection to Old World memory that threatened the new control grid.',
      },
    ],
    hint: 'Post-1860/1900 Reset — WW1 kills ages 15–50 Old World memory holders.',
    correctAnswer: 'C',
  },
  {
    number: 18,
    question:
      'What happened to Giant Skeletons found during post-Reset American railroad expansion?',
    options: [
      {
        label: 'A',
        text: 'They were displayed in every town square as official proof of Tartarian and giant human lineages.',
        isCorrect: false,
        rationale:
          'Over 10,000 giant remains were confiscated and hidden by the Smithsonian.',
      },
      {
        label: 'B',
        text: 'No giants were ever found; railroad crews only discovered modern tools from 1950 factories.',
        isCorrect: false,
        rationale:
          'Over 10,000 giant remains from 12 feet to 35 meters tall were unearthed then suppressed.',
      },
      {
        label: 'C',
        text: 'The Smithsonian openly published full catalogs so schools would teach giant history accurately.',
        isCorrect: false,
        rationale:
          'Smithsonian was founded by Freemasons as a sealed vault for suppressed archaeology.',
      },
      {
        label: 'D',
        text: 'Over 10,000 remains of Giants (12 feet to 35 meters) were unearthed, then immediately confiscated and hidden by the Smithsonian Institution — founded by Freemasons specifically as the sealed vault for suppressed archaeology.',
        isCorrect: true,
        rationale:
          'Railroad digs exposed giants; Freemason Smithsonian vaulted the evidence out of public view.',
      },
    ],
    hint: '10,000+ giant remains — Smithsonian Freemason sealed vault.',
    correctAnswer: 'D',
  },
  {
    number: 19,
    question:
      'What was the Industrial Revolution relative to Tartarian inheritance?',
    options: [
      {
        label: 'A',
        text: 'A lie used to explain the sudden existence of highly complex textile looms, pneumatic underground railways, and grand architectural infrastructure actually inherited from Tartaria.',
        isCorrect: true,
        rationale:
          'Industrial Revolution narrative covers inheritance of Tartarian tech and architecture already present.',
      },
      {
        label: 'B',
        text: 'A pure organic invention wave that built every Tartarian city from empty dirt with no prior civilization.',
        isCorrect: false,
        rationale:
          'Complex infrastructure was inherited from Tartaria, not spontaneously invented from nothing.',
      },
      {
        label: 'C',
        text: 'A G.A.A. gift program that openly credited Tartaria in every factory plaque worldwide.',
        isCorrect: false,
        rationale:
          'The Revolution story was a cover lie, not open credit to Tartarian excellence.',
      },
      {
        label: 'D',
        text: 'Only a fashion trend in hats with no link to looms, railways, or grand architecture.',
        isCorrect: false,
        rationale:
          'It specifically rebranded Tartarian looms, pneumatic railways, and grand architecture.',
      },
    ],
    hint: 'Industrial Revolution = lie covering Tartarian inherited infrastructure.',
    correctAnswer: 'A',
  },
  {
    number: 20,
    question:
      'How did early steam locomotives really draw power, and what happened in 1887?',
    options: [
      {
        label: 'A',
        text: 'They always needed massive coal only; no copper domes, no inductance, and no coal-company sabotage.',
        isCorrect: false,
        rationale:
          'Domed copper Atmospheric Augmentation Systems used Electromagnetic Inductance with the natural energy grid.',
      },
      {
        label: 'B',
        text: 'Early locomotives used domed copper Atmospheric Augmentation Systems that superheated boiler water via Electromagnetic Inductance interacting with the natural energy grid; in 1887 the Consolidated Coal Company ordered these devices removed and melted down to force fossil-fuel reliance.',
        isCorrect: true,
        rationale:
          'Atmospheric condensers tapped the grid; 1887 coal order destroyed them to lock in mined fuel dependence.',
      },
      {
        label: 'C',
        text: 'Consolidated Coal funded free public installation of more atmospheric domes in every nation.',
        isCorrect: false,
        rationale:
          'They ordered the devices removed and melted down to force coal reliance.',
      },
      {
        label: 'D',
        text: 'Locomotives ran only on prayer with no metal hardware and no interaction with energy grids.',
        isCorrect: false,
        rationale:
          'Hardware was copper atmospheric systems using electromagnetic inductance on the natural grid.',
      },
    ],
    hint: 'Copper atmospheric inductance systems — 1887 coal company melt-down order.',
    correctAnswer: 'B',
  },
  {
    number: 21,
    question: 'What was the Titanic event in the suppression architecture?',
    options: [
      {
        label: 'A',
        text: 'A pure navigation accident with no vessel swap, no Federal Reserve link, and no crystal destruction.',
        isCorrect: false,
        rationale:
          'It was an orchestrated sacrifice using the swapped vessel Olympic for control and tech destruction.',
      },
      {
        label: 'B',
        text: 'A charity cruise that delivered free Tuning Forks to every school to teach megalithic harmonic stone craft.',
        isCorrect: false,
        rationale:
          'It destroyed an ancient crystal and Old World Tuning Fork used for harmonic megalithic work.',
      },
      {
        label: 'C',
        text: 'An orchestrated sacrifice utilizing the swapped vessel Olympic — executed to eliminate opposition to the Federal Reserve and to destroy a massive highly energetic ancient crystal and an Old World Tuning Fork used to sculpt megalithic stone via harmonic frequencies.',
        isCorrect: true,
        rationale:
          'Olympic swap sacrifice: kill Fed opposition + destroy harmonic megalith tech (crystal and Tuning Fork).',
      },
      {
        label: 'D',
        text: 'A Freemason parade float that never sank and never carried any energetic technology aboard.',
        isCorrect: false,
        rationale:
          'Sinking was real orchestrated sacrifice targeting politics and Old World harmonic devices.',
      },
    ],
    hint: 'Olympic swap — Fed opposition kill — crystal and Tuning Fork destroyed.',
    correctAnswer: 'C',
  },
  {
    number: 22,
    question: 'What is Red Mercury technology used for?',
    options: [
      {
        label: 'A',
        text: 'Only painting barns red with no gold extraction and no hovering craft involvement.',
        isCorrect: false,
        rationale:
          'Red Mercury extraction tech on hovering craft silently extracts gold seams via directed liquidation frequencies.',
      },
      {
        label: 'B',
        text: 'A children\'s toy brand with no mountain holes and no remote range mining signature.',
        isCorrect: false,
        rationale:
          'It leaves anomalous uniform holes in remote mountain ranges from silent gold extraction.',
      },
      {
        label: 'C',
        text: 'Open pit mining with dynamite only, never silent frequency liquidation from hovering craft.',
        isCorrect: false,
        rationale:
          'Hovering craft use directed liquidation frequencies for silent gold-seam extraction.',
      },
      {
        label: 'D',
        text: 'Highly advanced extraction technology used by hovering craft to silently extract gold seams via directed liquidation frequencies, leaving anomalous uniform holes in remote mountain ranges.',
        isCorrect: true,
        rationale:
          'Red Mercury = silent aerial gold liquidation leaving uniform mountain holes.',
      },
    ],
    hint: 'Hovering craft — silent gold liquidation frequencies — uniform mountain holes.',
    correctAnswer: 'D',
  },
  {
    number: 23,
    question:
      'How did Custodians and Greys cripple Gateway-10 to enable the occupation behind Resets?',
    options: [
      {
        label: 'A',
        text: 'Custodians (fallen 12th-density betrayers) engineered parasites including Anunnaki, Omicron, Alpha Draco, and Greys; Realm-2/Known Lands sit at the center of Gateway-10 (178 worlds); Greys destroyed the central Spirit Tree at Hyperborea (North Pole / Mt Meru / Black Rock), crippling the energy grid across the Gateway.',
        isCorrect: true,
        rationale:
          'Custodian betrayal + proxy races + Spirit Tree kill at Hyperborea crippled Gateway-10\'s grid.',
      },
      {
        label: 'B',
        text: 'Custodians planted more Spirit Trees so Gateway-10 energy overflowed into permanent 12th density for all.',
        isCorrect: false,
        rationale:
          'Greys destroyed the central Spirit Tree, critically crippling Gateway energy output.',
      },
      {
        label: 'C',
        text: 'Gateway-10 has only one world and no Hyperborea node, so no spirit tree strike was possible.',
        isCorrect: false,
        rationale:
          'Gateway-10 comprises 178 worlds; Hyperborea/Mt Meru was the central power strike target.',
      },
      {
        label: 'D',
        text: 'Only modern mayors rewrote maps with no Custodian betrayal and no Grey ET spirit tree attack.',
        isCorrect: false,
        rationale:
          'History obfuscation ties to Custodian inversion and Grey destruction of the Spirit Tree.',
      },
    ],
    hint: 'Custodian proxies — Gateway-10 center — Spirit Tree destroyed at Hyperborea.',
    correctAnswer: 'A',
  },
  {
    number: 24,
    question:
      'How does Density Suppression hide Crystalline Temples under modern structures?',
    options: [
      {
        label: 'A',
        text: 'Parasites raise density to 9th so every tourist sees UHF temples without any concrete cap.',
        isCorrect: false,
        rationale:
          'They suppress vibration by building heavy 3rd-density structures over Nodes, Ley Lines, and Lattice networks.',
      },
      {
        label: 'B',
        text: 'Heavy concrete and tarmac 3rd-density structures built precisely over footings of energetic Nodes, Ley Lines, and Lattice Membrane Networks suppress vibrational output; beneath churches, cathedrals, and monuments lie indestructible Crystalline Temples at Ultra High Frequency (UHF), invisible to 3rd-density perception. Gold, silver, and crystals regulate electromagnetic Ley Lines — they were never meant to be mined.',
        isCorrect: true,
        rationale:
          'Density Suppression caps nodes with heavy builds; UHF temples remain under footings; mining steals grid tech.',
      },
      {
        label: 'C',
        text: 'Crystalline Temples never existed; only Freemason stone was original architecture of the plain.',
        isCorrect: false,
        rationale:
          'Indestructible UHF Crystalline Temples sit beneath modern monuments, hidden from 3rd-density sight.',
      },
      {
        label: 'D',
        text: 'Mining gold and silver was always spiritual best practice taught by high-density soul families.',
        isCorrect: false,
        rationale:
          'Gold, silver, and crystals were never meant to be mined — they regulate Ley Line electromagnetics.',
      },
    ],
    hint: 'Heavy builds over nodes — UHF temples hidden — resources are grid tech not ore.',
    correctAnswer: 'B',
  },
  {
    number: 25,
    question:
      'What is the awakening climax sequence, and who remains after the EMF Flash?',
    options: [
      {
        label: 'A',
        text: 'Only a gentle parade with no Bluebeam, no EBS, no flash, and every NPC upgraded into organic soul status.',
        isCorrect: false,
        rationale:
          'Scare events include Bluebeam, EBS, and 30-second EMF Flash that vaporizes synthetic NPCs.',
      },
      {
        label: 'B',
        text: 'Project Bluebeam Fake Alien Invasion, EBS exposing satanic control and child sacrifice, then a 30-second EMF Flash; G.A.A. peels Overlays and shuts the Projection Dome so the realm pixelates to true architecture; 97% NPCs vaporize into the ether; maximum 520 million original Tarans, Star Seeds, and 4,000 Ancient Souls remain — survivors must discard the 3 Strings: Religion, Finance, and Perceived Knowledge.',
        isCorrect: true,
        rationale:
          'Bluebeam + EBS + EMF flash clear the matrix majority; ~520 million true souls remain if strings are cut.',
      },
      {
        label: 'C',
        text: 'EBS only plays music videos while the Projection Dome stays on and no one ever pixelates or vaporizes.',
        isCorrect: false,
        rationale:
          'EBS reveals satanic depths; EMF flash and dome shutdown produce pixelation and NPC vaporization.',
      },
      {
        label: 'D',
        text: 'All 8 billion remain equally; discarding Religion, Finance, and Perceived Knowledge is unnecessary.',
        isCorrect: false,
        rationale:
          '97% synthetic NPCs vaporize; survivors must discard the 3 Strings to hold the psychological collapse.',
      },
    ],
    hint: 'Bluebeam → EBS → 30-sec EMF — 97% gone — max 520 million — discard 3 Strings.',
    correctAnswer: 'B',
  },
];

function normalizeQuestion(q) {
  const mapped = q.options.map((o) => ({
    label: o.label,
    text: cleanText(o.text),
    isCorrect: !!o.isCorrect,
    rationale: cleanText(o.rationale),
  }));
  const rot = ((q.number * 11) + 5) % 4;
  const ordered = mapped.slice(rot).concat(mapped.slice(0, rot));
  const finalized = finalizeOptions(
    ordered,
    `${typeof TOPIC_ID !== 'undefined' ? TOPIC_ID : 'quiz'}::${q.number}:v3`
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
  'Test your grasp of Resets and Hidden History — thousand-year cullings, Tartaria, Orphan Trains, WW1 memory purge, OOPAs, and the G.A.A. climax.';
const DESC_META =
  'Interactive Living Truth Quiz on Resets and Hidden History: 7th Reset, DUMBS clones, Lunatic Asylum Loosh batteries, Giant skeletons, Atmospheric Condensers, Titanic, Density Suppression, Bluebeam, EBS, and the 30-second EMF flash.';

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
      'Resets are not natural rise and fall — they are planned thousand-year harvests: Loosh, Adrenochrome, DUMBS clones, Orphan Trains into emptied Tartarian cities, asylum batteries, and WW1 murder of memory holders. Giants vaulted by the Smithsonian. Free-energy condensers melted for coal. Titanic sacrifice. Custodian inversion and Spirit Tree kill. Sit with what you missed, then return to the Resets and Hidden History deep-dive. The Great Spiritual Awakening ends the 178,000-year occupation. Bluebeam, EBS, 30-second EMF flash — 97% NPCs vaporize. Up to 520 million true souls remain. Discard Religion, Finance, and Perceived Knowledge. Remember.',
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
      "  { path: '/quiz/alice/reptilians.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/negative-entities.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/parasitic-takeover.html', priority: '0.75', changefreq: 'monthly' },",
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
console.log('PASS: audited 25/25 against data/alice-topics/resets-hidden-history.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
