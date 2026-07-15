/**
 * Installs False History quiz for Alice transmission.
 * All 25 items from data/alice-topics/false-history.json only.
 * Plain English; absolute Living Truth voice.
 * Run: node scripts/install-false-history-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'false-history';
const TOPIC_TITLE = 'False History';
const SOURCE = 'alice';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['fabricated', 'prison planet', 'inversion tactics'],
  2: ['33rd degree freemasons', 'ruling bloodlines', 'cyclic destruction'],
  3: ['re-sets', 'thousand years', 'cloning'],
  4: ['tartaria', 'industrial revolution', 'dark ages'],
  5: ['density suppression', '9th density', '3rd density', 'crystalline'],
  6: ["oopa's", 'museum basements', 'fabricated timeline'],
  7: ['npc', '97%', '4th density'],
  8: ['evolution via natural selection', 'freemasons', 'monkeys'],
  9: ['9th density', 'laboratories', 'instantaneous'],
  10: ['rise and fall', 'backward', 'free energy'],
  11: ['dark ages', 'tartary', 'child labor'],
  12: ['victors', 'parasitic entities', 'sold-soul'],
  13: ['mud-floods', 'soil liquefaction', 'desert glass'],
  14: ['ice age', '9th density', 'vessels'],
  15: ['world war 1', '15-22 million', '15 and 55', 'big pharma'],
  16: ['titanic', 'federal reserve', 'atlantis', 'tuning fork'],
  17: ['orphan trains', 'd.u.m.b.s', 'stem cells'],
  18: ['lunatic asylums', '5,000-bed', 'loosh batteries'],
  19: ['smithsonian', '10,000', 'giant', '35 meters'],
  20: ['andrew carnegie', '2,500', 'libraries'],
  21: ['custodians', 'anuk', 'spirit tree', 'gateway-10'],
  22: ['flat plane', 'firmament', 'black void plasma', 'bright white'],
  23: ['sol', 'soul', 'solar system'],
  24: ['bright and morning star', 'lucifer', 'venus', 'moon'],
  25: ['perceived knowledge', 'ebs', 'emf', '178,000 years'],
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
      'What is False History in the matrix framework?',
    options: [
      {
        label: 'A',
        text: 'A complete fabrication of the human chronological timeline, engineered as a primary Inversion Tactic to conceal the prison planet and trap Taran humans in amnesiac subjugation.',
        isCorrect: true,
        rationale:
          'False History is not academic error but a primary weapon of Inversion Tactics: a fabricated timeline that erases true reality so parasites can reboot society and keep Tarans amnesiac and controlled.',
      },
      {
        label: 'B',
        text: 'A harmless collection of honest academic typos with no control purpose.',
        isCorrect: false,
        rationale:
          'It is deliberate weaponized narrative, not innocent scholarly error.',
      },
      {
        label: 'C',
        text: 'Only the official listing of free-energy patents still in use.',
        isCorrect: false,
        rationale:
          'False History hides free energy and advanced past tech, not preserves them openly.',
      },
      {
        label: 'D',
        text: 'A G.A.A. archive of 178,000 years already restored to every NPC.',
        isCorrect: false,
        rationale:
          'Memory return comes after projection-dome removal for true souls; False History blocks that knowing now.',
      },
    ],
    hint: 'Fabricated timeline weapon — not honest mistakes.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question:
      'Who meticulously concocted False History?',
    options: [
      {
        label: 'A',
        text: '33rd degree Freemasons and ruling bloodlines, to conceal true origins, high-frequency past, and continuous cyclic destruction of humanity.',
        isCorrect: true,
        rationale:
          'False History was meticulously concocted by 33rd degree Freemasons and ruling bloodlines to hide true origins, high-frequency past, and continuous cyclic destruction.',
      },
      {
        label: 'B',
        text: 'Benevolent ET soul families in 9th density laboratories only.',
        isCorrect: false,
        rationale:
          'Those labs perform instantaneous species upgrades; they did not invent the Freemasonic false timeline.',
      },
      {
        label: 'C',
        text: 'Only random medieval scribes with no bloodline role.',
        isCorrect: false,
        rationale:
          'Ruling bloodlines and 33rd degree Freemasons engineer the narrative.',
      },
      {
        label: 'D',
        text: 'NPCs writing their own free cosmic biographies.',
        isCorrect: false,
        rationale:
          'NPCs parrot the mainstream narrative; they do not author the control history.',
      },
    ],
    hint: '33rd degree Freemasons + ruling bloodlines.',
    correctAnswer: 'A',
  },
  {
    number: 3,
    question:
      'What are Re-sets in this system?',
    options: [
      {
        label: 'A',
        text: 'Orchestrated catastrophic planetary eradication roughly every thousand years — mass slaughter, child sacrifice, genetic extraction for cloning, and physical restructuring to hide legacy tech.',
        isCorrect: true,
        rationale:
          'Re-sets are orchestrated planetary eradications about every thousand years involving slaughter, child sacrifice, cloning material extraction, and restructuring to hide legacy technology.',
      },
      {
        label: 'B',
        text: 'Natural peaceful evolutions with no slaughter component.',
        isCorrect: false,
        rationale:
          'They are catastrophic orchestrated culls, not peaceful progress.',
      },
      {
        label: 'C',
        text: 'Only library renovations every century.',
        isCorrect: false,
        rationale:
          'Scale is planetary eradication and memory wipe, not renovations.',
      },
      {
        label: 'D',
        text: 'Voluntary holidays celebrating Tartaria openly.',
        isCorrect: false,
        rationale:
          'Tartaria was destroyed and relabeled; Re-sets erase it from public knowing.',
      },
    ],
    hint: 'Thousand-year orchestrated cull + hide legacy tech.',
    correctAnswer: 'A',
  },
  {
    number: 4,
    question:
      'How was Tartaria (Great Tartary) buried inside False History?',
    options: [
      {
        label: 'A',
        text: 'Its destruction was deceitfully relabeled as the Industrial Revolution, with preceding periods sold as the Dark Ages.',
        isCorrect: true,
        rationale:
          'Tartaria was a global civilization of excellence destroyed; False History relabeled that destruction as the Industrial Revolution and prior eras as the Dark Ages.',
      },
      {
        label: 'B',
        text: 'It was left intact as the official school curriculum worldwide.',
        isCorrect: false,
        rationale:
          'It was destroyed and mislabeled to hide abrupt erasure of advanced civilization.',
      },
      {
        label: 'C',
        text: 'It only ever existed as an NPC video game map.',
        isCorrect: false,
        rationale:
          'It was a real global high-architecture civilization preceding this era.',
      },
      {
        label: 'D',
        text: 'It is identical to the Federal Reserve founding story only.',
        isCorrect: false,
        rationale:
          'Titanic/Federal Reserve ops are separate mechanics; Tartaria is the destroyed advanced civilization.',
      },
    ],
    hint: 'Destroyed excellence → Dark Ages / Industrial Revolution labels.',
    correctAnswer: 'A',
  },
  {
    number: 5,
    question:
      'What does Density Suppression do to advanced architecture?',
    options: [
      {
        label: 'A',
        text: 'Lowers the realm from highly vibrating 9th density to a suppressed 3rd density simulation so indestructible crystalline architecture becomes invisible to the human eye.',
        isCorrect: true,
        rationale:
          'Density Suppression drops energetic frequency from 9th density reality into a 3rd density simulation, making advanced indestructible crystalline architecture invisible.',
      },
      {
        label: 'B',
        text: 'Raises all museums to 12th density for full public viewing of Oopa\'s.',
        isCorrect: false,
        rationale:
          'Oopa\'s are hidden in basements; suppression hides high-frequency architecture from ordinary sight.',
      },
      {
        label: 'C',
        text: 'Only changes school textbook fonts with no frequency role.',
        isCorrect: false,
        rationale:
          'It is a technological frequency mechanism of the prison.',
      },
      {
        label: 'D',
        text: 'Permanently destroys every crystalline temple into dust only.',
        isCorrect: false,
        rationale:
          'Much architecture is hidden by density drop rather than fully erased from existence.',
      },
    ],
    hint: '9th → 3rd density; crystalline structures vanish from sight.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question:
      "What are Oopa's (Out Of Place Artefacts)?",
    options: [
      {
        label: 'A',
        text: 'Blatant physical evidence of high-tech civilizations before the current reset, hidden in museum basements because they contradict False History.',
        isCorrect: true,
        rationale:
          "Oopa's are blatant physical evidence of pre-reset high technology that contradicts False History and is deliberately hidden in museum basements to protect the fabricated timeline.",
      },
      {
        label: 'B',
        text: 'Official required reading in every Carnegie library wing.',
        isCorrect: false,
        rationale:
          'Libraries spread hyper-bullshit narrative; Oopa\'s are suppressed, not celebrated.',
      },
      {
        label: 'C',
        text: 'Only NPC toys with no historical meaning.',
        isCorrect: false,
        rationale:
          'They are real contradicting physical evidence of prior tech ages.',
      },
      {
        label: 'D',
        text: 'Tuning forks still sold freely for stone masonry classes.',
        isCorrect: false,
        rationale:
          'Advanced Tartarian tuning-fork tech was targeted cargo; Oopa\'s are broader suppressed artefacts.',
      },
    ],
    hint: 'Pre-reset high-tech proof — basements, not display.',
    correctAnswer: 'A',
  },
  {
    number: 7,
    question:
      'What are NPCs in relation to False History?',
    options: [
      {
        label: 'A',
        text: 'Artificially created hive-aligned synthetics — 97% of population — made in 4th density labs to enforce conformity and parrot the mainstream historical narrative.',
        isCorrect: true,
        rationale:
          'NPCs are artificial hive-aligned synthetics comprising 97% of the population, designed in 4th density laboratories to enforce conformity and mindlessly parrot mainstream history.',
      },
      {
        label: 'B',
        text: 'The only beings who remember Tartaria and teach it openly.',
        isCorrect: false,
        rationale:
          'They enforce and parrot False History, not restore Tartarian truth.',
      },
      {
        label: 'C',
        text: '12th density Custodians who never fell.',
        isCorrect: false,
        rationale:
          'Custodians were caretakers who betrayed; NPCs are lab-made narrative enforcers.',
      },
      {
        label: 'D',
        text: 'Giant skeletons reanimated by the Smithsonian.',
        isCorrect: false,
        rationale:
          'Smithsonian hides giant remains; NPCs are living synthetic population majority.',
      },
    ],
    hint: '97% lab synthetics parroting the false timeline.',
    correctAnswer: 'A',
  },
  {
    number: 8,
    question:
      'What is fraudulent about "Evolution via Natural Selection"?',
    options: [
      {
        label: 'A',
        text: 'Freemasons concocted it as a false origin story of ocean-to-ape upright walking; humans did not evolve from monkeys and dinosaurs were not cleared by asteroid for mammals in that mythic sense.',
        isCorrect: true,
        rationale:
          'Evolution via Natural Selection is a Freemasonic false origin story. Humans did not evolve from monkeys; the asteroid-to-mammal dominance tale is not true reality here.',
      },
      {
        label: 'B',
        text: 'It accurately describes 9th density laboratory upgrades.',
        isCorrect: false,
        rationale:
          'True upgrades are instantaneous species-wide lab events by benevolent ET soul families — not slow natural selection.',
      },
      {
        label: 'C',
        text: 'It is the official G.A.A. curriculum for Ascension.',
        isCorrect: false,
        rationale:
          'It is parasitic false origin cover, not Ascension teaching.',
      },
      {
        label: 'D',
        text: 'It only applies to NPC hardware version numbers.',
        isCorrect: false,
        rationale:
          'It is the mainstream false human origin narrative for the whole population.',
      },
    ],
    hint: 'Freemason false origin — not monkey lineage myth.',
    correctAnswer: 'A',
  },
  {
    number: 9,
    question:
      'How does true evolution actually occur?',
    options: [
      {
        label: 'A',
        text: 'As an instantaneous, species-wide upgrade in advanced 9th density physical laboratories by benevolent ET soul families.',
        isCorrect: true,
        rationale:
          'True evolution is instantaneous species-wide upgrade conducted in advanced 9th density physical laboratories by benevolent extraterrestrial soul families.',
      },
      {
        label: 'B',
        text: 'As millions of years of random mutation without intelligence.',
        isCorrect: false,
        rationale:
          'That gradual random model is the fraudulent cover story.',
      },
      {
        label: 'C',
        text: 'As Carnegie library reading programs alone.',
        isCorrect: false,
        rationale:
          'Libraries disseminate fabricated history, not true lab upgrades.',
      },
      {
        label: 'D',
        text: 'As slow ape posture training in Dark Ages monasteries.',
        isCorrect: false,
        rationale:
          'Dark Ages framing is False History; true upgrade is instant lab-based.',
      },
    ],
    hint: 'Instant species-wide upgrade in 9th density ET labs.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question:
      'Do civilizations naturally "Rise and Fall"?',
    options: [
      {
        label: 'A',
        text: 'No — progress has moved backward; free energy, atmospheric condensers, and pneumatic railways of the past were systematically downgraded or destroyed.',
        isCorrect: true,
        rationale:
          'Civilizations do not naturally Rise and Fall. Progress moved backward; advanced past tech (free energy, atmospheric condensers, pneumatic underground railways) was systematically downgraded or destroyed.',
      },
      {
        label: 'B',
        text: 'Yes — every society slowly invents free energy then forgets it organically.',
        isCorrect: false,
        rationale:
          'Downgrade and destruction were systematic, not organic forgetfulness.',
      },
      {
        label: 'C',
        text: 'Yes — always upward from Dark Ages into harmonic Tartaria next.',
        isCorrect: false,
        rationale:
          'Tartaria was the advanced past destroyed; the narrative pretends primitive-to-modern progress.',
      },
      {
        label: 'D',
        text: 'Only NPCs rise; true souls always fall.',
        isCorrect: false,
        rationale:
          'The point is engineered backward progress hiding destroyed excellence.',
      },
    ],
    hint: 'No natural rise/fall — deliberate technological regression.',
    correctAnswer: 'A',
  },
  {
    number: 11,
    question:
      'Why is "Dark Ages into automated textile mills with child labor" a logical impossibility in the cover story?',
    options: [
      {
        label: 'A',
        text: 'It hides the abrupt destruction of Great Tartary by faking a leap from primitive Dark Ages into complex automated manufacturing.',
        isCorrect: true,
        rationale:
          'The claim that humanity jumped from Dark Ages into highly complex automated textile manufacturing with child labor is a logical impossibility engineered to hide abrupt destruction of Great Tartary.',
      },
      {
        label: 'B',
        text: 'Because child labor never existed in any cover narrative.',
        isCorrect: false,
        rationale:
          'Child labor is part of the false industrial story used to mask Tartaria\'s destruction.',
      },
      {
        label: 'C',
        text: 'Because textiles were always free-energy sung by tuning forks in public schools.',
        isCorrect: false,
        rationale:
          'The industrial leap story is the cover; advanced past tech was hidden, not openly taught.',
      },
      {
        label: 'D',
        text: 'Because the Titanic never carried any technology.',
        isCorrect: false,
        rationale:
          'Titanic is a separate multi-layered op; this point is the Dark Ages-to-industry impossibility.',
      },
    ],
    hint: 'Impossible leap covers Tartaria\'s sudden erasure.',
    correctAnswer: 'A',
  },
  {
    number: 12,
    question:
      'What does "History is recorded by the victors" strictly mean here?',
    options: [
      {
        label: 'A',
        text: 'History was written exclusively by parasitic entities and their sold-soul proxies.',
        isCorrect: true,
        rationale:
          'The phrase strictly means history was written exclusively by parasitic entities and their sold-soul proxies.',
      },
      {
        label: 'B',
        text: 'History was written only by fair neutral academics worldwide.',
        isCorrect: false,
        rationale:
          'Victors here are parasites and sold-soul proxies, not neutral scholarship.',
      },
      {
        label: 'C',
        text: 'History was written by benevolent ET soul families in plain sight.',
        isCorrect: false,
        rationale:
          'Parasites and proxies author the false record.',
      },
      {
        label: 'D',
        text: 'History was never written at all after each Re-set.',
        isCorrect: false,
        rationale:
          'A fabricated past is continuously rebooted and written by the controllers.',
      },
    ],
    hint: 'Parasites + sold-soul proxies write the record.',
    correctAnswer: 'A',
  },
  {
    number: 13,
    question:
      'How do Mud-floods erase infrastructure during Re-sets?',
    options: [
      {
        label: 'A',
        text: 'Advanced ET energy weapons cause soil liquefaction; they change subatomic cohesion, dustifying structures or fossilizing matter into stone and desert glass.',
        isCorrect: true,
        rationale:
          'Parasites use advanced ET energy weapons for soil liquefaction (Mud-floods), changing subatomic cohesion to turn structures into particulate dust or fossilize matter into stone and desert glass.',
      },
      {
        label: 'B',
        text: 'Gentle seasonal rain with no weapon component.',
        isCorrect: false,
        rationale:
          'Mud-floods are weaponized liquefaction and subatomic destruction, not weather.',
      },
      {
        label: 'C',
        text: 'Only library floods ruining paper books.',
        isCorrect: false,
        rationale:
          'Scale is planetary infrastructure and biological fossilization.',
      },
      {
        label: 'D',
        text: 'Smithsonian mopping procedures after giant digs.',
        isCorrect: false,
        rationale:
          'Smithsonian hides finds; Mud-floods are Re-set energy-weapon events.',
      },
    ],
    hint: 'Energy weapons + liquefaction + dust/fossil glass.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question:
      'Why was an immediate ice age imposed in Re-set mechanics?',
    options: [
      {
        label: 'A',
        text: 'To freeze and kill off highly durable 9th density human vessels.',
        isCorrect: true,
        rationale:
          'The planet was subjected to an immediate ice age to freeze and kill off the highly durable 9th density human vessels.',
      },
      {
        label: 'B',
        text: 'To preserve free-energy locomotives in perfect ice museums.',
        isCorrect: false,
        rationale:
          'Ice age targeted durable 9th density vessels, not preservation of free-energy transit.',
      },
      {
        label: 'C',
        text: 'To cool atmospheric condensers for better efficiency.',
        isCorrect: false,
        rationale:
          'Condensers are free-energy train tech of the advanced past; ice age is a cull tool.',
      },
      {
        label: 'D',
        text: 'To make Black Void Plasma look more realistic only.',
        isCorrect: false,
        rationale:
          'Black Void Plasma is sky inversion tech; ice age kills high-density vessels.',
      },
    ],
    hint: 'Freeze-kill durable 9th density humans.',
    correctAnswer: 'A',
  },
  {
    number: 15,
    question:
      'What was World War 1 (1914-1918) actually for?',
    options: [
      {
        label: 'A',
        text: 'A targeted culling of 15-22 million people ages 15-55 who survived the previous reset, held flat-earth and herbal knowledge, and threatened Big Pharma rollout.',
        isCorrect: true,
        rationale:
          'WW1 was not about political assassinations; it culled 15-22 million aged 15-55 with old-world knowledge, true flat earth, and herbal remedies that threatened Big Pharma.',
      },
      {
        label: 'B',
        text: 'A pure dispute over one Archduke with no knowledge-purge goal.',
        isCorrect: false,
        rationale:
          'Assassination story is cover for demographic knowledge erasure.',
      },
      {
        label: 'C',
        text: 'A program to teach Tartarian tuning forks in every school.',
        isCorrect: false,
        rationale:
          'It erased knowledge holders; it did not restore Tartarian tech education.',
      },
      {
        label: 'D',
        text: 'A mission to free all Oopa\'s from museum basements.',
        isCorrect: false,
        rationale:
          'Gatekeeping institutions hide evidence; the war purged living memory.',
      },
    ],
    hint: '15-22 million ages 15-55 — flat earth, herbs, anti-Pharma threat.',
    correctAnswer: 'A',
  },
  {
    number: 16,
    question:
      'What multi-layered role did the Titanic sinking play?',
    options: [
      {
        label: 'A',
        text: 'Killed Federal Reserve opposition (Guggenheim, Astor, Strauss) and sank Tartarian cargo — a massive Atlantis energy crystal and an advanced tuning fork for harmonic multi-ton stone work.',
        isCorrect: true,
        rationale:
          'Beyond killing Federal Reserve opposition (Benjamin Guggenheim, John Jacob Astor, Isador Strauss), the Titanic carried Tartarian tech: a massive Atlantis energy-emitting crystal and an advanced tuning fork for harmonic stone cutting and molding.',
      },
      {
        label: 'B',
        text: 'Only a weather accident with no cargo or elite targets.',
        isCorrect: false,
        rationale:
          'It was multi-layered: elite opposition kill plus sensitive tech disposal.',
      },
      {
        label: 'C',
        text: 'A rescue of Giant skeletons from the Smithsonian.',
        isCorrect: false,
        rationale:
          'Smithsonian seizes giants; Titanic ops target people and Tartarian tech.',
      },
      {
        label: 'D',
        text: 'A publicity stunt to advertise Orphan Trains.',
        isCorrect: false,
        rationale:
          'Orphan Trains repopulate after slaughter; Titanic is a separate multi-layer op.',
      },
    ],
    hint: 'Fed Reserve opponents + Atlantis crystal + tuning fork cargo.',
    correctAnswer: 'A',
  },
  {
    number: 17,
    question:
      'How are cities repopulated after total consumption in a reset?',
    options: [
      {
        label: 'A',
        text: 'Stem cells grown into clones in D.U.M.B.S., distributed worldwide via Orphan Trains into empty cities.',
        isCorrect: true,
        rationale:
          'After mass slaughter and consumption, parasites extract stem cells, grow clones in D.U.M.B.S., and distribute them via Orphan Trains to repopulate empty cities.',
      },
      {
        label: 'B',
        text: 'Only voluntary immigration of freemason tourists.',
        isCorrect: false,
        rationale:
          'Core logistics are underground cloning and Orphan Train distribution.',
      },
      {
        label: 'C',
        text: 'Surface left empty with no clone logistics.',
        isCorrect: false,
        rationale:
          'Orphan Trains deliberately refill emptied cities.',
      },
      {
        label: 'D',
        text: 'Giants reanimated from burial mounds as the new population.',
        isCorrect: false,
        rationale:
          'Giant remains are confiscated and hidden, not used as open repopulation.',
      },
    ],
    hint: 'D.U.M.B.S. clones + Orphan Trains.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question:
      'What were massive Lunatic Asylums actually for after a reset?',
    options: [
      {
        label: 'A',
        text: '5,000-bed Loosh Batteries housing shell-shocked catatonic witnesses so demons hosting sold-soul elites could feed on trauma until the new clone population matured for harvest.',
        isCorrect: true,
        rationale:
          'Shell-shocked survivors were housed in massive Lunatic Asylums as 5,000-bed Loosh Batteries, sustaining demons of the sold-soul elite with trauma energy until the grown population was harvest-ready.',
      },
      {
        label: 'B',
        text: 'Free herbal universities teaching flat-earth openly.',
        isCorrect: false,
        rationale:
          'They stored trauma for demonic Loosh, not public truth education.',
      },
      {
        label: 'C',
        text: 'Carnegie library annexes for 2,500 history books only.',
        isCorrect: false,
        rationale:
          'Libraries push fake narrative; asylums are Loosh batteries.',
      },
      {
        label: 'D',
        text: 'Temporary hotels for Titanic survivors only.',
        isCorrect: false,
        rationale:
          'They hold reset atrocity witnesses as continuous demonic food sources.',
      },
    ],
    hint: '5,000-bed Loosh Batteries for demons between harvest crops.',
    correctAnswer: 'A',
  },
  {
    number: 19,
    question:
      'How does the Smithsonian act as the "Vatican of Archaeology"?',
    options: [
      {
        label: 'A',
        text: 'It confiscates contradicting evidence — e.g. railroad mounds with 10,000+ Giant skeletons 12 to over 35 meters tall — seizing finds and forcing NDAs under threat of imprisonment or death.',
        isCorrect: true,
        rationale:
          'As "Vatican of Archaeology," the Smithsonian hides contradicting evidence. When railroads unearthed 10,000+ Giants (12 to over 35 meters), it seized them and forced NDAs under threat of prison or death.',
      },
      {
        label: 'B',
        text: 'It permanently displays all Giants and Oopa\'s with full honesty.',
        isCorrect: false,
        rationale:
          'It deliberately confiscates and hides that evidence.',
      },
      {
        label: 'C',
        text: 'It only catalogs bird bones for schools.',
        isCorrect: false,
        rationale:
          'Its gatekeeping role targets massive giant and high-tech contradicting finds.',
      },
      {
        label: 'D',
        text: 'It builds free-energy locomotives from seized crystals.',
        isCorrect: false,
        rationale:
          'Function is concealment of False History contradictions, not free-energy revival.',
      },
    ],
    hint: '10,000+ giants seized; NDAs under threat.',
    correctAnswer: 'A',
  },
  {
    number: 20,
    question:
      'What was Andrew Carnegie\'s institutional role in False History?',
    options: [
      {
        label: 'A',
        text: 'Fund over 2,500 public libraries worldwide to disseminate newly fabricated "hyper-bullshit" historical narrative under institutional prestige.',
        isCorrect: true,
        rationale:
          'Carnegie funded over 2,500 public libraries worldwide, using institutional prestige to disseminate the newly fabricated hyper-bullshit historical narrative to the masses.',
      },
      {
        label: 'B',
        text: 'Rescue Tartarian tuning forks for free public classes.',
        isCorrect: false,
        rationale:
          'His deployment spreads fabricated history, not Tartarian tech restoration.',
      },
      {
        label: 'C',
        text: 'Expose Smithsonian giant NDAs in every branch.',
        isCorrect: false,
        rationale:
          'Libraries cement False History; they do not bust archaeological cover-ups.',
      },
      {
        label: 'D',
        text: 'Grow clones in D.U.M.B.S. personally.',
        isCorrect: false,
        rationale:
          'Cloning is D.U.M.B.S. logistics; Carnegie\'s named role is mass narrative libraries.',
      },
    ],
    hint: '2,500+ libraries of fabricated history.',
    correctAnswer: 'A',
  },
  {
    number: 21,
    question:
      'How did the Custodians begin the inversion that False History serves?',
    options: [
      {
        label: 'A',
        text: 'Originally 12th density caretakers, they betrayed Source, allied with Anuk, Niberians, Omicron, and Alpha Draco, seized Realm-2 (Known Lands), and removed the Spirit Tree (Mt Meru / Black Rock) at the North Pole, dampening Gateway-10.',
        isCorrect: true,
        rationale:
          'Custodians betrayed Source, allied with created parasites (Anuk, Niberians, Omicron, Alpha Draco), seized Realm-2, and removed the Spirit Tree at the North Pole, instantly dampening Gateway-10 energy.',
      },
      {
        label: 'B',
        text: 'They never fell and still openly run free-energy Tartaria.',
        isCorrect: false,
        rationale:
          'They betrayed and inverted the realm; Tartaria was later destroyed under the system they enabled.',
      },
      {
        label: 'C',
        text: 'They only wrote children\'s fairy tales with no physical inversion.',
        isCorrect: false,
        rationale:
          'They inverted fabric of reality and energy architecture, not mere stories.',
      },
      {
        label: 'D',
        text: 'They founded Carnegie libraries before any betrayal.',
        isCorrect: false,
        rationale:
          'Carnegie is later institutional gatekeeping; Custodian inversion is the root cosmic betrayal.',
      },
    ],
    hint: 'Fallen caretakers + parasite allies + Spirit Tree cut.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question:
      'How was science inverted regarding Earth and space?',
    options: [
      {
        label: 'A',
        text: 'Taught spinning globe in dark space under gravity/thermodynamics myths; truth is flat plane under a Firmament, bright white space, and night sky as Custodian Black Void Plasma projection.',
        isCorrect: true,
        rationale:
          'Parasites taught spinning globe in dark space with fictional gravity and thermodynamics. Reality: flat plane under Firmament, bright white space, night sky as Black Void Plasma projection.',
      },
      {
        label: 'B',
        text: 'Taught only flat earth and left Black Void Plasma unused.',
        isCorrect: false,
        rationale:
          'False science teaches globe/dark space; plasma creates fake black night.',
      },
      {
        label: 'C',
        text: 'Abolished all sky stories so nobody looks up.',
        isCorrect: false,
        rationale:
          'They inverted cosmology into a full false globe-and-vacuum model.',
      },
      {
        label: 'D',
        text: 'Proved Firmament publicly in every textbook.',
        isCorrect: false,
        rationale:
          'Firmament truth is suppressed under False History science.',
      },
    ],
    hint: 'Globe/dark vacuum lies vs flat Firmament + white space + plasma night.',
    correctAnswer: 'A',
  },
  {
    number: 23,
    question:
      'How was language inverted around Sol and Soul?',
    options: [
      {
        label: 'A',
        text: 'Corrupting Sun ("Sol") to conflate with human "Soul," hiding that a "Solar System" is a network of cosmic familial souls — not planets orbiting a star.',
        isCorrect: true,
        rationale:
          'They inverted language by corrupting Sol/Soul so "Solar System" is misread as planets around a star instead of a network of cosmic familial souls.',
      },
      {
        label: 'B',
        text: 'Making Sol mean only Bitcoin addresses.',
        isCorrect: false,
        rationale:
          'Inversion hides soul-family cosmology, not crypto branding.',
      },
      {
        label: 'C',
        text: 'Banning the word soul in all languages forever.',
        isCorrect: false,
        rationale:
          'They conflated Sol and Soul to misdirect meaning, not erase the word.',
      },
      {
        label: 'D',
        text: 'Teaching Solar System as Twin Flame only with no deception.',
        isCorrect: false,
        rationale:
          'The teaching of orbiting planets is the deceptive inversion.',
      },
    ],
    hint: 'Sol/Soul conflation hides soul-family "Solar System."',
    correctAnswer: 'A',
  },
  {
    number: 24,
    question:
      'How was spirituality inverted via Jesus as "Bright and Morning Star"?',
    options: [
      {
        label: 'A',
        text: 'Religions force unwitting worship of Satan; Jesus named Bright and Morning Star (Lucifer / Planet Venus) — the holographic generator lighting the Death-Star-like negative ET Moon station.',
        isCorrect: true,
        rationale:
          'Spirituality was inverted into religions of unwitting Satan worship. Jesus as Bright and Morning Star (Lucifer/Venus) marks Venus as the holographic generator illuminating the Moon, a Death-Star-like negative ET space station.',
      },
      {
        label: 'B',
        text: 'It openly banned all religious control systems forever.',
        isCorrect: false,
        rationale:
          'Religion is a control string; naming encodes Luciferian inversion in plain sight.',
      },
      {
        label: 'C',
        text: 'It only describes free-energy train headlights.',
        isCorrect: false,
        rationale:
          'It is spiritual inversion tied to Venus hologram and Moon station.',
      },
      {
        label: 'D',
        text: 'It proves the Moon is a benevolent soul family hotel.',
        isCorrect: false,
        rationale:
          'The Moon is framed as a negative ET Death-Star-like station.',
      },
    ],
    hint: 'Bright and Morning Star = Lucifer/Venus generator for Moon station.',
    correctAnswer: 'A',
  },
  {
    number: 25,
    question:
      'Why must False History be dismantled before the EBS, Fake Alien Invasion, and EMF Flash?',
    options: [
      {
        label: 'A',
        text: 'Perceived Knowledge (with Religion and Finance) is a String that blocks truth; sleepers who cannot exit False History programming face collapse, heart attacks, and suicides — while exposure prepares true souls for 178,000 years of returned memory when the projection dome falls.',
        isCorrect: true,
        rationale:
          'False History hardens Perceived Knowledge, one of three Strings with Religion and Finance. Final sequences (EBS, Bluebeam invasion, EMF Flash) crush those still inside that programming. Dismantling evolution, progress, and institutional lies frees the mind for 178,000 years of memory after dome removal.',
      },
      {
        label: 'B',
        text: 'Because NPCs will rewrite True History for free after the flash anyway.',
        isCorrect: false,
        rationale:
          'NPCs enforce conformity now; flash returns memory to prepared true souls, not NPC authorship.',
      },
      {
        label: 'C',
        text: 'Because Carnegie libraries will auto-correct during Project Bluebeam.',
        isCorrect: false,
        rationale:
          'Individual uncoupling from artificial boundaries is required; libraries spread the lies.',
      },
      {
        label: 'D',
        text: 'It is optional — False History strengthens at EMF.',
        isCorrect: false,
        rationale:
          'Exposure of False History is strategic preparation for surviving the final sequences intact.',
      },
    ],
    hint: 'Perceived Knowledge string; collapse risk; 178,000-year memory prep.',
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

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle:
    'Test your grasp of False History — Re-sets, Tartaria cover stories, Freemason evolution myth, WW1 culling, Titanic cargo, Smithsonian giants, and the inversion of science and spirit.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'False History is not a pile of honest mistakes — it is the Freemasonic reboot disk of the prison. Re-sets, mud-floods, ice-age vessel kills, WW1 knowledge culls, Titanic tech sinks, Orphan Trains, Loosh asylums, Smithsonian giant seizures, Carnegie libraries of hyper-bullshit: that is how Tartaria becomes Dark Ages and free energy becomes "progress." Sit with what you missed, then return to the False History deep-dive. Uninstall evolution, rise-and-fall, and institutional authority before EBS, Bluebeam, and the EMF flash — or Perceived Knowledge will break the mind instead of free it for 178,000 years of returned memory.',
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
  description:
    'Test your understanding of False History — Re-sets, Tartaria cover, Freemason evolution myth, WW1 culling, Titanic, Smithsonian giants, and inverted science and spirit.',
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
  throw new Error('false-history not found in alice-topics.json');
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
    'Interactive Living Truth Quiz on False History: Re-sets, Tartaria cover stories, Freemason evolution myth, WW1 culling, Titanic cargo, Smithsonian giants, and inverted science and spirit.',
  ],
  ['quiz/alice/nature-of-reality.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/nature-of-reality.webp', 'images/alice/false.webp'],
  // nature-of-reality may already use images/faketime or similar; also handle if path is images/alice
  ['images/faketime.webp', 'images/alice/false.webp'],
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
// Ensure og image points to false.webp if still on nature image
if (html.includes('images/nature-of-reality.webp')) {
  html = html.split('images/nature-of-reality.webp').join('images/alice/false.webp');
}
const htmlPath = path.join(ROOT, 'quiz', SOURCE, `${TOPIC_ID}.html`);
fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchors = [
    "  { path: '/quiz/alice/fake-linear-time.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/alice/fake-alien-invasion.html', priority: '0.75', changefreq: 'monthly' },",
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
[0, 3, 14, 15, 24].forEach((i) => {
  const c = questions[i].options.find((o) => o.isCorrect);
  console.log(` Q${questions[i].number}: ${c.text.slice(0, 110)}`);
});
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('PASS: audited 25/25 against data/alice-topics/false-history.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
