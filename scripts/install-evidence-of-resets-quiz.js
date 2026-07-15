/**
 * Installs Evidence of Resets quiz for Alice transmission.
 * All 25 items from data/alice-topics/evidence-of-resets.json only.
 * Plain English; absolute Living Truth voice.
 * Run: node scripts/install-evidence-of-resets-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'evidence-of-resets';
const TOPIC_TITLE = 'Evidence of Resets';
const SOURCE = 'alice';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['rise and fall', 're-sets', 'fabricated'],
  2: ['loosh', 'adrenochrome', 'seventh', 'eighth'],
  3: ['thousand years', 'historical memory', 'regress'],
  4: ["oopa's", 'museum basements', 'historical timeline'],
  5: ['tartaria', 'free energy', 'dark ages'],
  6: ['mud-floods', 'soil liquefaction', 'energy weapon'],
  7: ['d.u.m.b.s', 'cloned', 'stem cells'],
  8: ['5,000-bed', 'loosh batteries', 'lunatic asylums'],
  9: ['density suppression', 'concrete', 'crystalline'],
  10: ['ley lines', 'nodes', 'electromagnetic'],
  11: ['97%', 'npc', 'conformity'],
  12: ['33rd degree freemasons', 'evolution', 'backward'],
  13: ['30,000 years', 'festivals of death', 'thousand years'],
  14: ['15-22 million', 'fighting age', 'flat earth', 'herbal'],
  15: ['orphan trains', 'orphans', 'tartarian cities'],
  16: ['10,000', 'giant skeletons', '12 feet', '35 meters', 'smithsonian'],
  17: ['fossilised hats', 'desert glass', 'energy weapons', 'cold fusion'],
  18: ['atmospheric condensers', '1887', 'fibonacci', 'ley lines'],
  19: ['sung', 'woven', 'tuning forks', 'harmonic'],
  20: ['loosh batteries', 'shell-shocked', 'demonic'],
  21: ['non-disclosure', 'imprisonment', "oopa's"],
  22: ['andrew carnegie', 'libraries', 'fake historical'],
  23: ['heliocentrism', 'firmament', 'ice wall', 'flat plane'],
  24: ['religion', 'finance', 'perceived knowledge'],
  25: ['emf', '97%', '178,000-year', 'galactic ancestral alliance'],
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
      'What is the "Rise and Fall" of civilisations in true history?',
    options: [
      {
        label: 'A',
        text: 'A natural evolutionary curve with no external planners.',
        isCorrect: false,
        rationale:
          'Evolution via natural selection is a Freemasonic cover; Rise and Fall conceals planned Re-sets.',
      },
      {
        label: 'B',
        text: 'A fabricated cover story hiding cyclical Re-sets — abrupt Falls of advanced societies to maintain parasitic control.',
        isCorrect: true,
        rationale:
          'The accepted Rise and Fall narrative is fabricated cover for Re-sets: abrupt Falls of civilisations orchestrated to maintain control over the physical plain.',
      },
      {
        label: 'C',
        text: 'Only a description of NPC career ladders in film and TV.',
        isCorrect: false,
        rationale:
          'It masks planetary-scale annihilation and repopulation, not entertainment careers.',
      },
      {
        label: 'D',
        text: 'Proof that free-energy Tartaria still rules openly today.',
        isCorrect: false,
        rationale:
          'Tartaria was destroyed to initiate the current Dark Ages narrative.',
      },
    ],
    hint: 'Fabricated cover for planned cyclical Falls — Re-sets.',
    correctAnswer: 'B',
  },
  {
    number: 2,
    question:
      'What do Re-sets harvest, and where is the current era in the cycle?',
    options: [
      {
        label: 'A',
        text: 'Planetary annihilation harvests Loosh and Adrenochrome; this is the seventh iteration, with an eighth Re-set narrowly averted.',
        isCorrect: true,
        rationale:
          'Re-sets annihilate populations to harvest Loosh and Adrenochrome; the current era is the seventh iteration, and an eighth was narrowly averted.',
      },
      {
        label: 'B',
        text: 'Only rainwater collection every ten years forever.',
        isCorrect: false,
        rationale:
          'Harvest targets are Loosh and Adrenochrome through death and torture festivals.',
      },
      {
        label: 'C',
        text: 'This is the first Re-set ever, with no prior Tartaria.',
        isCorrect: false,
        rationale:
          'Tartaria and prior iterations leave physical evidence; this is the seventh cycle.',
      },
      {
        label: 'D',
        text: 'Eighth Re-set already completed and locked in permanently.',
        isCorrect: false,
        rationale:
          'The eighth was narrowly averted; evidence of the cover-up is now being exposed.',
      },
    ],
    hint: 'Loosh/Adrenochrome; seventh cycle; eighth averted.',
    correctAnswer: 'A',
  },
  {
    number: 3,
    question:
      'How often do Re-sets run, and what are they designed to do?',
    options: [
      {
        label: 'A',
        text: 'Approximately every thousand years — destroy and harvest population, erase historical memory, gather energy, and regress societal advancement.',
        isCorrect: true,
        rationale:
          'Re-sets are systematic planetary destruction and harvesting about every thousand years to erase memory, gather energy, and regress advancement.',
      },
      {
        label: 'B',
        text: 'Every weekend only for library book sales.',
        isCorrect: false,
        rationale:
          'Scale is millennial planetary harvest, not weekend events.',
      },
      {
        label: 'C',
        text: 'Never on a schedule — purely random asteroid hits.',
        isCorrect: false,
        rationale:
          'They are engineered festivals of death, not natural accidents.',
      },
      {
        label: 'D',
        text: 'Once only in 1887 when condensers were melted.',
        isCorrect: false,
        rationale:
          '1887 is free-energy suppression within a broader thousand-year Re-set pattern.',
      },
    ],
    hint: 'About every thousand years; erase, harvest, regress.',
    correctAnswer: 'A',
  },
  {
    number: 4,
    question:
      "What are Oopa's (Out Of Place Artefacts)?",
    options: [
      {
        label: 'A',
        text: 'Blatant physical evidence of prior high-tech civilisations, hidden in museum basements because they contradict the established timeline.',
        isCorrect: true,
        rationale:
          "Oopa's are blatant physical evidence of high-technological civilisations before this era, deliberately hidden in museum basements for contradicting the official timeline.",
      },
      {
        label: 'B',
        text: 'Only modern smartphone accessories sold after each Re-set.',
        isCorrect: false,
        rationale:
          'They are suppressed high-tech relics of prior ages, not consumer gadgets.',
      },
      {
        label: 'C',
        text: 'NPC identity chips with no physical form.',
        isCorrect: false,
        rationale:
          'They are physical artefacts museums hide from the public.',
      },
      {
        label: 'D',
        text: 'Freemason library cards required for Carnegie reading rooms.',
        isCorrect: false,
        rationale:
          'Libraries distribute fake history; Oopa\'s are physical proof of the real past.',
      },
    ],
    hint: 'Out-of-place high-tech proof — basemented by museums.',
    correctAnswer: 'A',
  },
  {
    number: 5,
    question:
      'What was Tartaria?',
    options: [
      {
        label: 'A',
        text: 'A previously global, highly advanced civilisation of excellence with resplendent architecture, free energy, and harmony with planetary frequencies, destroyed to initiate the current Dark Ages narrative.',
        isCorrect: true,
        rationale:
          'Tartaria was a global advanced civilisation of excellence — architecture, free energy, harmonic frequencies — abruptly destroyed to start the current Dark Ages story.',
      },
      {
        label: 'B',
        text: 'A minor village invented by Carnegie librarians in 1920.',
        isCorrect: false,
        rationale:
          'It was global and highly advanced; libraries worked to erase it from public knowing.',
      },
      {
        label: 'C',
        text: 'Only the name of the Smithsonian\'s giant-bone wing.',
        isCorrect: false,
        rationale:
          'Smithsonian confiscated giant remains; Tartaria is the prior civilisation itself.',
      },
      {
        label: 'D',
        text: 'An NPC-only theme park under Density Suppression.',
        isCorrect: false,
        rationale:
          'It was real high-excellence civilisation, not a theme park for synthetics.',
      },
    ],
    hint: 'Global free-energy excellence — destroyed for Dark Ages cover.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question:
      'What are Mud-floods in Re-set mechanics?',
    options: [
      {
        label: 'A',
        text: 'Advanced energy-weapon soil liquefaction used to bury and destroy old-world infrastructure during a Re-set.',
        isCorrect: true,
        rationale:
          'Mud-floods are advanced energy weapon technology using soil liquefaction to bury and destroy old-world infrastructure in a Re-set.',
      },
      {
        label: 'B',
        text: 'Natural spring rains with no weapon component.',
        isCorrect: false,
        rationale:
          'They are weaponized liquefaction, not ordinary weather.',
      },
      {
        label: 'C',
        text: 'Only decorative landscaping around Ley Line pylons.',
        isCorrect: false,
        rationale:
          'Purpose is burying and destroying prior infrastructure at Re-set scale.',
      },
      {
        label: 'D',
        text: 'A library catalog term for wet books after floods.',
        isCorrect: false,
        rationale:
          'They are planetary Re-set weapons, not catalog jargon.',
      },
    ],
    hint: 'Energy weapons + soil liquefaction = buried old world.',
    correctAnswer: 'A',
  },
  {
    number: 7,
    question:
      'What are D.U.M.B.S. used for after a Re-set?',
    options: [
      {
        label: 'A',
        text: 'Underground facilities where cloned populations are grown from harvested stem cells to repopulate the surface.',
        isCorrect: true,
        rationale:
          'D.U.M.B.S. are Deep Underground Military Bases where clones are grown from harvested stem cells to repopulate the surface after a Re-set.',
      },
      {
        label: 'B',
        text: 'Surface farms growing only free-energy copper for locomotives.',
        isCorrect: false,
        rationale:
          'They are underground clone-growth facilities, not surface copper farms.',
      },
      {
        label: 'C',
        text: 'Public museums displaying giant skeletons honestly.',
        isCorrect: false,
        rationale:
          'Giants were confiscated by Smithsonian; D.U.M.B.S. grow replacement populations.',
      },
      {
        label: 'D',
        text: 'Only temporary shelters for 5,000-bed asylum staff.',
        isCorrect: false,
        rationale:
          'Primary named function is cloned surface repopulation.',
      },
    ],
    hint: 'Underground stem-cell clones for surface repopulation.',
    correctAnswer: 'A',
  },
  {
    number: 8,
    question:
      'What are Loosh Batteries masquerading as Lunatic Asylums?',
    options: [
      {
        label: 'A',
        text: '5,000-bed facilities storing traumatized Re-set survivors to continuously harvest negative emotional energy for demonic consumption.',
        isCorrect: true,
        rationale:
          'Loosh Batteries are 5,000-bed facilities disguised as Lunatic Asylums, storing traumatized survivors to harvest negative emotional energy for demons between cycles.',
      },
      {
        label: 'B',
        text: 'Free herbal hospitals restoring flat-earth teaching.',
        isCorrect: false,
        rationale:
          'They harvest trauma energy, not restore old-world knowledge.',
      },
      {
        label: 'C',
        text: 'NPC-only hotels with no energy function.',
        isCorrect: false,
        rationale:
          'They are continuous Loosh harvest infrastructure for demonic food.',
      },
      {
        label: 'D',
        text: 'Carnegie reading rooms with 2,500 chairs each.',
        isCorrect: false,
        rationale:
          'Libraries distribute fake history; asylums are Loosh batteries.',
      },
    ],
    hint: '5,000-bed trauma farms for demonic Loosh.',
    correctAnswer: 'A',
  },
  {
    number: 9,
    question:
      'How does Density Suppression hide high-density crystalline structures?',
    options: [
      {
        label: 'A',
        text: 'By dampening ultra-high frequencies with overlays and physical materials like concrete and tarmac so structures become invisible to lower-density perception.',
        isCorrect: true,
        rationale:
          'Density Suppression technologically dampens ultra-high frequencies using overlays and materials such as concrete and tarmac, rendering high-density crystalline structures invisible to lower-density eyes.',
      },
      {
        label: 'B',
        text: 'By permanently deleting temples into outer space vacuum.',
        isCorrect: false,
        rationale:
          'Structures remain present but unperceived; they are not vacuum-deleted.',
      },
      {
        label: 'C',
        text: 'By singing them louder into 15th density for everyone.',
        isCorrect: false,
        rationale:
          'Harmonic singing built them; suppression hides them from 3rd-density view.',
      },
      {
        label: 'D',
        text: 'By converting them all into Atmospheric Condensers in 1887.',
        isCorrect: false,
        rationale:
          'Condensers were locomotive free-energy devices melted by coal monopolies.',
      },
    ],
    hint: 'Overlays + concrete/tarmac dim UHF architecture from view.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question:
      'What are Ley Lines in old-world technology?',
    options: [
      {
        label: 'A',
        text: 'Crystalline lattice membrane networks connecting planetary Nodes, emitting highly positive electromagnetic energy used by old-world tech.',
        isCorrect: true,
        rationale:
          'Ley Lines are crystalline lattice membrane networks linking Nodes and emitting highly positive EM energy utilized by old-world technology.',
      },
      {
        label: 'B',
        text: 'Only modern highway painted stripes with no energy.',
        isCorrect: false,
        rationale:
          'They are energetic planetary grids under free-energy systems, not paint.',
      },
      {
        label: 'C',
        text: 'NPC social media follower graphs.',
        isCorrect: false,
        rationale:
          'Physical-crystalline energy networks, not social graphs.',
      },
      {
        label: 'D',
        text: 'Smithsonian filing cabinets for giant bones only.',
        isCorrect: false,
        rationale:
          'Smithsonian hides giants; Ley Lines power old-world tech.',
      },
    ],
    hint: 'Lattice membrane Nodes — positive EM for free-energy tech.',
    correctAnswer: 'A',
  },
  {
    number: 11,
    question:
      'What role do NPCs play after a Re-set?',
    options: [
      {
        label: 'A',
        text: 'Artificially created souls without past lives or higher-density potential — 97% of population — enforcing conformity and the matrix narrative.',
        isCorrect: true,
        rationale:
          'NPCs are artificially created souls lacking past lives or higher-density potential, 97% of the population, used to enforce conformity and maintain matrix narrative after a Re-set.',
      },
      {
        label: 'B',
        text: 'The only beings who remember Tartaria and teach it openly.',
        isCorrect: false,
        rationale:
          'They enforce the matrix narrative, not restore Tartarian truth.',
      },
      {
        label: 'C',
        text: 'Giant skeleton excavators who leaked Smithsonian files.',
        isCorrect: false,
        rationale:
          'Giant finds were suppressed; NPCs maintain cover stories.',
      },
      {
        label: 'D',
        text: 'Pure 12th-density caretakers of the Spirit Tree.',
        isCorrect: false,
        rationale:
          'They lack higher-density potential by design.',
      },
    ],
    hint: '97% synthetic enforcers of post-Re-set narrative.',
    correctAnswer: 'A',
  },
  {
    number: 12,
    question:
      'Who concocted "Evolution via natural selection," and what direction has society actually moved?',
    options: [
      {
        label: 'A',
        text: '33rd degree Freemasons invented it to hide human origins and prior high-density existences; society deliberately moved backward from perfection and free energy into austerity, disease, and synthetic reliance.',
        isCorrect: true,
        rationale:
          '33rd degree Freemasons concocted evolution-via-natural-selection to hide origins and prior high-density life; trajectory moved backward from perfection/free energy into austerity, disease, and synthetics.',
      },
      {
        label: 'B',
        text: 'Tartarian free-energy engineers published it as progress doctrine.',
        isCorrect: false,
        rationale:
          'It is cover for regression from Tartarian excellence, not Tartarian teaching.',
      },
      {
        label: 'C',
        text: 'G.A.A. authored it to prepare for the EMF flash.',
        isCorrect: false,
        rationale:
          'G.A.A. hardwires anti-compliance trauma at revelation; evolution myth is Freemasonic cover.',
      },
      {
        label: 'D',
        text: 'Nobody — evolution is the literal Re-set schedule.',
        isCorrect: false,
        rationale:
          'Re-sets are harvest cycles; evolution story hides them.',
      },
    ],
    hint: 'Freemason cover myth; deliberate civilizational regression.',
    correctAnswer: 'A',
  },
  {
    number: 13,
    question:
      'How long have the most severe Re-set operations run within the elite harvest schedule?',
    options: [
      {
        label: 'A',
        text: 'Elites orchestrate Re-sets every thousand years, with the most severe operations running for approximately 30,000 years.',
        isCorrect: true,
        rationale:
          'Re-sets are planetary festivals of death engineered for Adrenochrome and Loosh every thousand years; the most severe operations have run about 30,000 years.',
      },
      {
        label: 'B',
        text: 'Only one weekend in 1914 with no longer pattern.',
        isCorrect: false,
        rationale:
          'WW1 is one weaponized conflict inside a multi-millennial harvest pattern.',
      },
      {
        label: 'C',
        text: 'Exactly 1887 days matching condenser melt orders.',
        isCorrect: false,
        rationale:
          '1887 is free-energy suppression; severe operations span ~30,000 years.',
      },
      {
        label: 'D',
        text: 'Never longer than a single mud-flood afternoon.',
        isCorrect: false,
        rationale:
          'Mud-floods are tools; the severe operational window is ~30,000 years.',
      },
    ],
    hint: 'Every ~1,000 years; severe ops ~30,000 years.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question:
      'Why was World War 1 (1914-1918) orchestrated as Re-set cleanup?',
    options: [
      {
        label: 'A',
        text: 'To eradicate 15-22 million fighting-age adults who still knew flat earth, herbal medicine, and the old world from before the last Re-set.',
        isCorrect: true,
        rationale:
          'WW1 was not political assassination drama; it was orchestrated to eradicate 15-22 million fighting-age adults retaining true flat-earth, herbal, and old-world knowledge from before the last Re-set.',
      },
      {
        label: 'B',
        text: 'To protect Atmospheric Condensers from coal monopolies.',
        isCorrect: false,
        rationale:
          'Condensers were melted in 1887; WW1 purged living memory-holders.',
      },
      {
        label: 'C',
        text: 'To open Smithsonian giant exhibits to the public.',
        isCorrect: false,
        rationale:
          'Smithsonian confiscated giants; WW1 killed knowledge transmitters.',
      },
      {
        label: 'D',
        text: 'To install free-energy railways worldwide.',
        isCorrect: false,
        rationale:
          'Free-energy tech was suppressed; the war deleted people who remembered truth.',
      },
    ],
    hint: '15-22 million fighting-age truth-holders erased.',
    correctAnswer: 'A',
  },
  {
    number: 15,
    question:
      'How is the realm repopulated after a Re-set?',
    options: [
      {
        label: 'A',
        text: 'With heavily programmed adult survivors and cloned children presented as orphans, moved by Orphan Trains into emptied, repurposed Tartarian cities.',
        isCorrect: true,
        rationale:
          'Repopulation uses programmed adult survivors and cloned "orphan" children transported via Orphan Trains into emptied, repurposed Tartarian cities.',
      },
      {
        label: 'B',
        text: 'Only with pure giant skeletons reanimated by the Smithsonian.',
        isCorrect: false,
        rationale:
          'Giants were confiscated and hidden; repopulation is clones and programmed survivors.',
      },
      {
        label: 'C',
        text: 'By waiting for natural NPC evolution over 178,000 years only.',
        isCorrect: false,
        rationale:
          'Orphan Trains and D.U.M.B.S. clones are deliberate, rapid repopulation tools.',
      },
      {
        label: 'D',
        text: 'Surface left empty with no orphan logistics.',
        isCorrect: false,
        rationale:
          'Orphan Trains fill emptied Tartarian cities on purpose.',
      },
    ],
    hint: 'Programmed survivors + clone orphans + Orphan Trains.',
    correctAnswer: 'A',
  },
  {
    number: 16,
    question:
      'What giant-skeleton evidence was uncovered during American railway expansion?',
    options: [
      {
        label: 'A',
        text: 'Excavated "hills" were burial mounds holding over 10,000 giant skeletons from 12 feet to over 35 meters tall; Smithsonian (Freemason "Vatican of Archaeology") confiscated them.',
        isCorrect: true,
        rationale:
          'Post-Re-set railway expansion found burial-mound hills with 10,000+ giants (12 feet to over 35 meters); Smithsonian Institute, Freemason-founded "Vatican of Archaeology," confiscated remains to block public realization.',
      },
      {
        label: 'B',
        text: 'Exactly three chicken bones labeled as dinosaurs only.',
        isCorrect: false,
        rationale:
          'Scale is over 10,000 giant humanoid skeletons in a suppressed range of sizes.',
      },
      {
        label: 'C',
        text: 'Giants were displayed permanently in every town square.',
        isCorrect: false,
        rationale:
          'Immediate confiscation prevented public knowing of biblical and historical truth.',
      },
      {
        label: 'D',
        text: 'No skeletons — only mud with no bones ever found.',
        isCorrect: false,
        rationale:
          'Massive skeletal finds are core physical evidence of Re-sets.',
      },
    ],
    hint: '10,000+ giants; 12 ft–35 m; Smithsonian confiscation.',
    correctAnswer: 'A',
  },
  {
    number: 17,
    question:
      'What do fossilised hats, books, and Desert glass prove?',
    options: [
      {
        label: 'A',
        text: 'Ancient Energy Weapons altered subatomic cohesion — fusing sand to glass or turning matter to stone via frequency tech akin to cold fusion.',
        isCorrect: true,
        rationale:
          'Fossilised hats, books, and Desert glass evidence ancient Energy Weapons that altered subatomic cohesion, fusing sand to glass or petrifying matter with cold-fusion-like frequency technology.',
      },
      {
        label: 'B',
        text: 'Only slow natural weathering over peaceful centuries.',
        isCorrect: false,
        rationale:
          'Instant fusion and petrification point to weaponized frequency, not gentle weather.',
      },
      {
        label: 'C',
        text: 'Carnegie library printing errors only.',
        isCorrect: false,
        rationale:
          'These are physical battlefield/weapon residues of Re-sets.',
      },
      {
        label: 'D',
        text: 'NPC fashion trends from 1920s catalogs.',
        isCorrect: false,
        rationale:
          'Fossilised anomalies are energy-weapon signatures, not fashion.',
      },
    ],
    hint: 'Energy weapons; sand-to-glass; stone matter; cold-fusion-like frequency.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question:
      'What free-energy train evidence was suppressed in 1887?',
    options: [
      {
        label: 'A',
        text: 'Atmospheric Condensers — domed copper Fibonacci resonators using Electromagnetic Induction from Ley Lines under tracks — were ordered melted by coal monopolies to force fossil-fuel dependency.',
        isCorrect: true,
        rationale:
          'Post-Re-set steam trains had Atmospheric Condensers (copper Fibonacci domes) pulling free Ley Line energy to superheat boilers without coal; in 1887 coal monopolies ordered them melted to enforce fossil dependency.',
      },
      {
        label: 'B',
        text: 'All trains were upgraded to free-energy permanently by law.',
        isCorrect: false,
        rationale:
          'Devices were destroyed to lock fuel monopoly, not legalized forever.',
      },
      {
        label: 'C',
        text: 'Condensers only cooled asylum Loosh batteries.',
        isCorrect: false,
        rationale:
          'They were locomotive free-energy systems on Ley Line tracks.',
      },
      {
        label: 'D',
        text: 'No such devices existed before nuclear submarines.',
        isCorrect: false,
        rationale:
          'Early post-Re-set locomotives carried them until 1887 melt orders.',
      },
    ],
    hint: 'Copper Fibonacci condensers; Ley Lines; 1887 melt-down.',
    correctAnswer: 'A',
  },
  {
    number: 19,
    question:
      'How were majestic Tartarian structures actually created?',
    options: [
      {
        label: 'A',
        text: 'Sung and woven into existence with harmonic tonal frequencies, sustained intent, and advanced tuning forks — not primitive chisels; modern system claimed them after dampening ambient frequencies.',
        isCorrect: true,
        rationale:
          'Cathedrals and grand buildings were sung and woven via harmonic frequencies, intent, and tuning forks; after frequency dampening, the modern system simply claimed them.',
      },
      {
        label: 'B',
        text: 'Only with primitive chisels and hammers over millions of years.',
        isCorrect: false,
        rationale:
          'Primitive hand-tool myth is cover; harmonic manifestation is the true method.',
      },
      {
        label: 'C',
        text: 'Printed overnight by Carnegie library presses.',
        isCorrect: false,
        rationale:
          'Libraries pushed fake history; architecture was high-harmonic creation.',
      },
      {
        label: 'D',
        text: 'Grown solely as NPC holograms with no physical presence.',
        isCorrect: false,
        rationale:
          'They are real physical structures later frequency-dampened and occupied.',
      },
    ],
    hint: 'Sung/woven harmonic creation; later claimed after dampening.',
    correctAnswer: 'A',
  },
  {
    number: 20,
    question:
      'Why were massive Victorian Lunatic Asylums pre-planned?',
    options: [
      {
        label: 'A',
        text: 'To house catatonic, shell-shocked survivors of Re-set torture and slaughter as continuous Loosh batteries between repopulation cycles.',
        isCorrect: true,
        rationale:
          'Asylums were pre-planned for shell-shocked Re-set witnesses; demons needed continuous food between cycles, so facilities functioned as massive Loosh batteries.',
      },
      {
        label: 'B',
        text: 'To teach free-energy condenser design to the public.',
        isCorrect: false,
        rationale:
          'They harvest trauma energy, not teach free energy.',
      },
      {
        label: 'C',
        text: 'To store giant skeletons for Smithsonian tours.',
        isCorrect: false,
        rationale:
          'Giants were confiscated elsewhere; asylums hold living trauma batteries.',
      },
      {
        label: 'D',
        text: 'Only as temporary hotels for Orphan Train conductors.',
        isCorrect: false,
        rationale:
          'Primary design is continuous Loosh harvest from Re-set witnesses.',
      },
    ],
    hint: 'Shell-shocked survivors = continuous demonic Loosh supply.',
    correctAnswer: 'A',
  },
  {
    number: 21,
    question:
      "How are giant remains and Oopa's discoveries suppressed on contact?",
    options: [
      {
        label: 'A',
        text: 'Via Non-Disclosure Agreements enforced by state agents, threatening imprisonment or worse.',
        isCorrect: true,
        rationale:
          "Discoveries of giants or Oopa's are aggressively suppressed through NDAs enforced by state agents, with threats of imprisonment or worse.",
      },
      {
        label: 'B',
        text: 'By free worldwide press conferences within 24 hours.',
        isCorrect: false,
        rationale:
          'Suppression is the rule, not open press celebration.',
      },
      {
        label: 'C',
        text: 'By automatically uploading full scans to every Carnegie library.',
        isCorrect: false,
        rationale:
          'Libraries cement fake paradigms; finds are silenced by NDA threat systems.',
      },
      {
        label: 'D',
        text: 'No suppression — all finds become national holidays.',
        isCorrect: false,
        rationale:
          'NDA and threat systems aggressively hide contradicting evidence.',
      },
    ],
    hint: 'NDAs + state threats against discoverers.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question:
      'Why did Andrew Carnegie establish thousands of libraries after Re-sets?',
    options: [
      {
        label: 'A',
        text: 'Not for enlightenment, but to rapidly distribute the new fake history and scientific paradigms into public consciousness.',
        isCorrect: true,
        rationale:
          'Carnegie\'s thousands of libraries were not public enlightenment projects but rapid distribution systems for post-Re-set fake historical and scientific paradigms.',
      },
      {
        label: 'B',
        text: 'To archive only Oopa\'s and giant bone catalogs honestly.',
        isCorrect: false,
        rationale:
          'Purpose is cementing fake paradigms, not honest anomaly catalogs.',
      },
      {
        label: 'C',
        text: 'To rebuild Atmospheric Condensers from Fibonacci blueprints.',
        isCorrect: false,
        rationale:
          'Free-energy tech was melted; libraries pushed cover narratives.',
      },
      {
        label: 'D',
        text: 'To house 5,000-bed Loosh battery patients exclusively.',
        isCorrect: false,
        rationale:
          'Asylums are Loosh batteries; libraries are narrative distribution.',
      },
    ],
    hint: 'Mass fake-history distribution, not enlightenment.',
    correctAnswer: 'A',
  },
  {
    number: 23,
    question:
      'How does Heliocentrism protect the Re-set cover-up?',
    options: [
      {
        label: 'A',
        text: 'False belief in a spinning globe in outer space hides firmament, flat plane, and outer ice wall — so enslavement boundaries stay invisible.',
        isCorrect: true,
        rationale:
          'Hidden History suppression relies on Heliocentrism; if people knew firmament, flat plane, and ice wall, enslavement boundaries would be obvious.',
      },
      {
        label: 'B',
        text: 'It proves Tartaria still runs free-energy trains openly.',
        isCorrect: false,
        rationale:
          'It shrinks perception of the true plain and hides cage boundaries.',
      },
      {
        label: 'C',
        text: 'It only affects NPC weather apps with no psyche role.',
        isCorrect: false,
        rationale:
          'Cosmological deception is core to post-Re-set psyche control.',
      },
      {
        label: 'D',
        text: 'It is identical to Ley Line free-energy physics.',
        isCorrect: false,
        rationale:
          'Ley Lines are true lattice energy; Heliocentrism is false cosmos cover.',
      },
    ],
    hint: 'Globe myth hides firmament, flat plane, ice wall cage.',
    correctAnswer: 'A',
  },
  {
    number: 24,
    question:
      'What three Strings maintain psyche control after a Re-set?',
    options: [
      {
        label: 'A',
        text: 'Religion (false gods/subdued cognition), Finance (debt and scarcity illusion), and Perceived Knowledge (defending programmed academic lies).',
        isCorrect: true,
        rationale:
          'Post-Re-set psyche control uses three Strings: Religion, Finance, and Perceived Knowledge — false gods, debt/scarcity distraction, and rigid academic lies.',
      },
      {
        label: 'B',
        text: 'Only railway tickets, coal prices, and museum hours.',
        isCorrect: false,
        rationale:
          'The named triad is Religion, Finance, and Perceived Knowledge.',
      },
      {
        label: 'C',
        text: 'Only mud-floods, NDAs, and giant bones.',
        isCorrect: false,
        rationale:
          'Those are physical evidence and cover tools; Strings are psychological tethers.',
      },
      {
        label: 'D',
        text: 'No strings — Great Spiritual Awakening already uninstalled them for everyone.',
        isCorrect: false,
        rationale:
          'Awakening requires complete uninstallation of these thoughtforms; they still define the matrix for the unready.',
      },
    ],
    hint: 'Religion · Finance · Perceived Knowledge.',
    correctAnswer: 'A',
  },
  {
    number: 25,
    question:
      'What happens when the EMF flash and projection-dome removal expose the Re-set matrix?',
    options: [
      {
        label: 'A',
        text: '97% (NPCs and sleepers) evaporate; trusted institutions\' genocidal child-sacrificing nature triggers mass shock; G.A.A. hardwires anti-compliance trauma; 178,000-year occupation collapses so true souls reclaim manifestation and cosmic heritage.',
        isCorrect: true,
        rationale:
          'EMF plus dome removal evaporates 97% NPCs/sleepers; revelation of trusted institutions as genocidal child-sacrificing matrix causes catatonic shock; G.A.A. hardwires that horror into survivor soul architecture; 178,000-year occupation ends and true souls reclaim manifestation and heritage.',
      },
      {
        label: 'B',
        text: 'Nothing changes except library late fees.',
        isCorrect: false,
        rationale:
          'Population removal, mass psychological collapse, and occupation end are the scale of the event.',
      },
      {
        label: 'C',
        text: 'Eighth Re-set locks in under stronger Freemason rule forever.',
        isCorrect: false,
        rationale:
          'Eighth was averted; exposure ends the long occupation, not crowns it.',
      },
      {
        label: 'D',
        text: 'Only animals evaporate while all NPCs stay as kings.',
        isCorrect: false,
        rationale:
          'NPCs and sleepers are the 97% that vanish from the simulation.',
      },
    ],
    hint: '97% gone; institutional shock; G.A.A. soul hardwire; 178,000-year end.',
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
    'Test your grasp of Evidence of Resets — Oopa\'s, giants, mud-floods, Tartaria, free-energy condensers, Loosh asylums, orphan repopulation, and the shatter of the 178,000-year cover-up.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Rise and Fall is cover copy for Re-sets: thousand-year harvest festivals of Loosh and Adrenochrome, seven iterations deep, eighth averted. Giants in railway mounds, fossilised hats and Desert glass, Fibonacci condensers melted in 1887, sung temples under concrete, 5,000-bed Loosh batteries, Orphan Trains into Tartarian shells, Carnegie libraries of new bullshit — that is the evidence trail. Sit with what you missed, then return to the Evidence of Resets deep-dive. When the dome peels and 97% pixelate, trusted institutions\' genocidal mask falls — and true souls reclaim manifestation and cosmic heritage.',
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
    'Test your understanding of Evidence of Resets — Oopa\'s, giant skeletons, mud-floods, Tartaria, free-energy condensers, Loosh asylums, and the 178,000-year occupation collapse.',
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
  throw new Error('evidence-of-resets not found in alice-topics.json');
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
    'Interactive Living Truth Quiz on Evidence of Resets: Oopa\'s, giants, mud-floods, Tartaria, free-energy condensers, Loosh asylums, and the 178,000-year cover-up collapse.',
  ],
  ['quiz/alice/nature-of-reality.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/nature-of-reality.webp', 'images/alice/evidence.webp'],
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
  if (!html.includes(a)) console.warn('Template string not found:', a.slice(0, 80));
  html = html.split(a).join(b);
}
const htmlPath = path.join(ROOT, 'quiz', SOURCE, `${TOPIC_ID}.html`);
fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchors = [
    "  { path: '/quiz/alice/eliminating-old-knowledge.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/alice/ebs-disclosure.html', priority: '0.75', changefreq: 'monthly' },",
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
[0, 5, 15, 17, 24].forEach((i) => {
  const c = questions[i].options.find((o) => o.isCorrect);
  console.log(` Q${questions[i].number}: ${c.text.slice(0, 110)}`);
});
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('PASS: audited 25/25 against data/alice-topics/evidence-of-resets.json');
