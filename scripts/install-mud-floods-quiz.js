/**
 * Installs Mud-floods quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/mud-floods.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-mud-floods-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'mud-floods';
const TOPIC_TITLE = 'Mud-floods';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/mud-flood.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['manufactured fabrication', 're-sets', 'historical chronology'],
  2: ['great tartary', 'technologically', 'spiritually advanced'],
  3: ['energy weapons', 'mudflood soil liquefaction', 'eradication'],
  4: ['re-sets', 'loosh', 'adrenochrome'],
  5: ['great tartary', 'crystalline architecture', 'free energy'],
  6: ['mudflood soil liquefaction', 'molecular', 'subatomic'],
  7: ['energy weapons', 'desert glass', 'fossilizing'],
  8: ['oopa', 'museum basements', 'fraudulent timeline'],
  9: ['atmospheric condensers', 'railway', 'fossil fuel'],
  10: ['dark ages', 'tartaria', 'violent termination'],
  11: ['past 200 years', 'leftover infrastructure', 'previous re-set'],
  12: ['could not genuinely create', 'repurposed', 'surviving architecture'],
  13: ['laboratory-grown orphans', 'survivors', 'historical memory'],
  14: ['dustification', 'particulate dust', 'hundreds of millions'],
  15: ['non-nuclear', 'grow-space', 'biological harvests'],
  16: ['burial mounds', '10,000', 'giants'],
  17: ['smithsonian', 'vatican of archaeology', 'non-disclosure'],
  18: ['tuning forks', 'andesite', 'weightless putty'],
  19: ['edward leedskalnin', '1,100 tons', 'limestone'],
  20: ['atmospheric condensers', '1887', 'consolidated coal company'],
  21: ['orphan trains', 'd.u.m.b.s', 'clones'],
  22: ['lunatic asylums', '5,000', 'loosh batteries'],
  23: ['world war 1', '15 to 22 million', 'flat earth'],
  24: ['lattice membrane network', 'nodal points', 'baphomet power pylons'],
  25: ['8th re-set', 'battle-ship grey', 'perceived knowledge'],
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
      'What is the historical chronology accepted by modern populations?',
    options: [
      {
        label: 'A',
        text: 'An entirely manufactured fabrication designed to obscure cyclical, highly destructive planetary events known as Re-sets.',
        isCorrect: true,
        rationale:
          'Accepted chronology is a manufactured fabrication built to hide cyclical planetary Re-sets, not an honest record of natural progress.',
      },
      {
        label: 'B',
        text: 'A complete open archive of every Mudflood and Tartarian free-energy blueprint published without suppression of any kind.',
        isCorrect: false,
        rationale:
          'The accepted timeline conceals Re-sets and Mudflood evidence rather than openly archiving Tartarian technology.',
      },
      {
        label: 'C',
        text: 'A pure weather diary of mild river floods with no genocide, energy weapons, or civilization erasure involved.',
        isCorrect: false,
        rationale:
          'The fabrication hides planetary-scale destructive Re-sets using energy weapons, not mere mild river-flood weather notes.',
      },
      {
        label: 'D',
        text: 'A G.A.A. training manual that already freezes every NPC into catatonia before any final Re-set can begin.',
        isCorrect: false,
        rationale:
          'Mainstream chronology is a parasitic fabrication obscuring past Re-sets, not a G.A.A. training manual ending NPC life early.',
      },
    ],
    hint: 'Manufactured fabrication — hides cyclical planetary Re-sets.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question:
      'Upon what obliterated civilization is the current epoch built?',
    options: [
      {
        label: 'A',
        text: 'A primitive hunter tribe with no architecture, no free energy, and no global unity of any kind.',
        isCorrect: false,
        rationale:
          'The prior civilization was Great Tartary — globally unified, technologically and spiritually advanced — not a primitive tribe.',
      },
      {
        label: 'B',
        text: 'Great Tartary — a globally unified, technologically and spiritually advanced civilization whose ruins underlie the current epoch.',
        isCorrect: true,
        rationale:
          'The current epoch is built directly upon the obliterated ruins of Great Tartary, the advanced civilization of the previous epoch.',
      },
      {
        label: 'C',
        text: 'Only the London Underground pneumatic tunnels, with no crystalline temples or worldwide Tartarian presence.',
        isCorrect: false,
        rationale:
          'Great Tartary was a globally dispersed advanced civilization; the Underground is one later technology detail, not the whole prior world.',
      },
      {
        label: 'D',
        text: 'A freemason-only ice-wall colony that never built cathedrals, free energy, or lattice-node architecture.',
        isCorrect: false,
        rationale:
          'Great Tartary featured crystalline architecture, free energy, and elevated spiritual homeostasis across the globe.',
      },
    ],
    hint: 'Built on ruins of advanced Great Tartary.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question:
      'How was Great Tartary\'s abrupt erasure actually carried out?',
    options: [
      {
        label: 'A',
        text: 'As a gentle natural fall into the Industrial Revolution with no weapons, mud, or soil liquefaction of any kind.',
        isCorrect: false,
        rationale:
          'Erasure was not a natural fall into industry; it was calculated eradication using ET Energy Weapons and Mudflood soil liquefaction.',
      },
      {
        label: 'B',
        text: 'By voluntary museum donations of every temple so freemasons could remodel facades without burying any cityscapes.',
        isCorrect: false,
        rationale:
          'The method was energy-weapon Mudflood liquefaction that buried, melted, and fossilized infrastructure and inhabitants.',
      },
      {
        label: 'C',
        text: 'Through calculated eradication utilizing extraterrestrial Energy Weapons to enact widespread Mudflood soil liquefaction.',
        isCorrect: true,
        rationale:
          'Tartary was deliberately eradicated with ET Energy Weapons enacting widespread Mudflood soil liquefaction across the realm.',
      },
      {
        label: 'D',
        text: 'Only by rewriting school textbooks while leaving every giant skeleton and free-energy locomotive untouched in public parks.',
        isCorrect: false,
        rationale:
          'Physical obliteration via energy weapons and Mudflood liquefaction came first; suppression of remains and tech followed.',
      },
    ],
    hint: 'ET Energy Weapons + Mudflood soil liquefaction — not a natural fall.',
    correctAnswer: 'C',
  },
  {
    number: 4,
    question: 'What are Re-sets in this architecture of control?',
    options: [
      {
        label: 'A',
        text: 'Mild software updates that upgrade free energy for everyone without genocide, torture, or loosh harvest.',
        isCorrect: false,
        rationale:
          'Re-sets are cyclical planetary mass genocide and infrastructure destruction for loosh and adrenochrome harvest.',
      },
      {
        label: 'B',
        text: 'Random weather seasons that never touch architecture, memory, or the repopulation of the realm.',
        isCorrect: false,
        rationale:
          'Re-sets are deliberate planetary-scale events of genocide and destruction, then repopulation and re-education.',
      },
      {
        label: 'C',
        text: 'Only freemason picnics at burial mounds with no link to adrenochrome, loosh, or parasitic entities.',
        isCorrect: false,
        rationale:
          'Primary purpose includes harvesting loosh and adrenochrome after mass destruction by parasitic entities.',
      },
      {
        label: 'D',
        text: 'Cyclical planetary-scale events of mass genocide, torture, and infrastructure destruction for loosh and adrenochrome harvest, followed by repopulation and re-education.',
        isCorrect: true,
        rationale:
          'Re-sets are cyclical mass genocide and infrastructure destruction by parasites for loosh/adrenochrome, then repopulation and re-education.',
      },
    ],
    hint: 'Cyclical genocide + destruction — loosh/adrenochrome — then repopulate.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question: 'What characterized Great Tartary before its destruction?',
    options: [
      {
        label: 'A',
        text: 'Intricate crystalline architecture, free energy systems, and elevated spiritual homeostasis across a globally dispersed civilization.',
        isCorrect: true,
        rationale:
          'Great Tartary had crystalline architecture, free energy, and elevated spiritual homeostasis as a globally dispersed advanced civilization.',
      },
      {
        label: 'B',
        text: 'Only battle-ship grey boxes, coal monopolies, and density-suppression pylons with no free energy of any kind.',
        isCorrect: false,
        rationale:
          'Those degraded features belong to the post-Re-set parasitic construct, not pre-destruction Tartary.',
      },
      {
        label: 'C',
        text: 'A single mud village with no temples, no lattice interaction, and no technological mastery at all.',
        isCorrect: false,
        rationale:
          'Tartary was highly advanced with crystalline architecture and free energy — not a single primitive mud village.',
      },
      {
        label: 'D',
        text: 'A pure NPC hive grown in D.U.M.B.S. with no spiritual homeostasis or crystalline building methods.',
        isCorrect: false,
        rationale:
          'Tartary was the prior advanced civilization; laboratory-grown clone/NPC populations came after the Re-set.',
      },
    ],
    hint: 'Crystalline architecture + free energy + elevated spiritual homeostasis.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'What is Mudflood soil liquefaction?',
    options: [
      {
        label: 'A',
        text: 'Ordinary spring rain that gently soaks gardens without altering molecular cohesion or burying cityscapes.',
        isCorrect: false,
        rationale:
          'Mudflood liquefaction is advanced ET energy-weapon tech that alters molecular and subatomic cohesion of matter.',
      },
      {
        label: 'B',
        text: 'Advanced extraterrestrial energy weapon technology that alters molecular and subatomic cohesion of physical matter to reduce buildings to dust, bury cityscapes, and fuse incompatible materials.',
        isCorrect: true,
        rationale:
          'Mudflood soil liquefaction is ET energy-weapon tech shifting matter cohesion to dustify buildings, bury cities, and fuse materials.',
      },
      {
        label: 'C',
        text: 'A freemason concrete recipe used only to paint cathedral facades without touching subatomic structure.',
        isCorrect: false,
        rationale:
          'It is subatomic/molecular weaponization of matter, not a cosmetic freemason paint recipe.',
      },
      {
        label: 'D',
        text: 'A G.A.A. healing frequency that restores Tartarian free energy without any burial or fossilization effects.',
        isCorrect: false,
        rationale:
          'The technology buries, melts, and fossilizes prior infrastructure and inhabitants — it is destructive weapon tech.',
      },
    ],
    hint: 'ET energy weapon — alters molecular/subatomic cohesion of matter.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question:
      'What do Energy Weapons do, and how does modern science falsely rebrand them?',
    options: [
      {
        label: 'A',
        text: 'They only write textbooks and never fossilize organic matter, turn beings to stone, or create desert glass.',
        isCorrect: false,
        rationale:
          'Energy Weapons fossilize organic matter, turn trees and beings to stone, and create desert glass terrain anomalies.',
      },
      {
        label: 'B',
        text: 'They are pure nuclear bombs whose radiation the parasites celebrate as ideal for continuous biological harvests.',
        isCorrect: false,
        rationale:
          'Application was explicitly non-nuclear; radiation would pollute the grow-space needed for later biological harvests.',
      },
      {
        label: 'C',
        text: 'Harmonic frequency armaments that induce subatomic alterations — fossilizing matter, stone-turning beings, desert glass — falsely blamed on ancient nuclear blasts.',
        isCorrect: true,
        rationale:
          'Energy Weapons are harmonic/frequency armaments causing subatomic alterations; modern science falsely attributes effects to ancient nuclear blasts.',
      },
      {
        label: 'D',
        text: 'They are Smithsonian cameras that only photograph giants without any physical mutation of the realm\'s matter.',
        isCorrect: false,
        rationale:
          'They are physical frequency weapons mutating matter; Smithsonian suppression is a separate post-discovery cover operation.',
      },
    ],
    hint: 'Harmonic weapons — fossilize/stone/desert glass — not ancient nukes.',
    correctAnswer: 'C',
  },
  {
    number: 8,
    question: 'What are Oopa\'s (Out Of Place Artefacts)?',
    options: [
      {
        label: 'A',
        text: 'Fake props planted last year by NPCs with no link to pre-Re-set high technology or museum basements.',
        isCorrect: false,
        rationale:
          'Oopa\'s are blatant physical evidence of high-tech civilizations prior to recent Re-sets, routinely hidden in museum basements.',
      },
      {
        label: 'B',
        text: 'Only modern smartphone scraps that freemasons display proudly to prove linear human evolution forever.',
        isCorrect: false,
        rationale:
          'Oopa\'s prove prior high technology and threaten the fraudulent evolutionary timeline — they are confiscated, not proudly displayed as evolution proof.',
      },
      {
        label: 'C',
        text: 'Weather balloons mislabeled by farmers with no confiscation, no basements, and no timeline stakes at all.',
        isCorrect: false,
        rationale:
          'Covert authorities confiscate and hide Oopa\'s in museum basements to protect the fraudulent timeline of human evolution.',
      },
      {
        label: 'D',
        text: 'Blatant physical evidence of high-technological civilizations prior to recent Re-sets, routinely confiscated and hidden in museum basements to protect the fraudulent evolutionary timeline.',
        isCorrect: true,
        rationale:
          'Oopa\'s are pre-Re-set high-tech evidence confiscated into museum basements to protect the fraudulent timeline of human evolution.',
      },
    ],
    hint: 'Pre-Re-set high-tech evidence — hidden in museum basements.',
    correctAnswer: 'D',
  },
  {
    number: 9,
    question: 'What were Atmospheric Condensers on early railway locomotives?',
    options: [
      {
        label: 'A',
        text: 'Highly advanced electromagnetic resonance devices that superheated boiler water by harvesting ambient energy from the planetary lattice membrane network — later destroyed to enforce fossil fuel dependency.',
        isCorrect: true,
        rationale:
          'Atmospheric Condensers harvested lattice-network energy to superheat boilers; they were systematically destroyed to force fossil fuel dependency.',
      },
      {
        label: 'B',
        text: 'Simple rain barrels that only collected mud after floods with no electromagnetic coils or free-energy function.',
        isCorrect: false,
        rationale:
          'They were advanced EM resonance devices on locomotives harvesting planetary lattice energy, not rain barrels.',
      },
      {
        label: 'C',
        text: 'Nuclear reactors bolted to freemason trains that parasites celebrated for permanent radiation grow-spaces.',
        isCorrect: false,
        rationale:
          'Condensers were clean EM resonance free-energy tech; parasites later destroyed them to enforce coal, not to radiate grow-spaces.',
      },
      {
        label: 'D',
        text: 'Decorative copper hats with no Fibonacci coils, no Ley-Line harvest, and no effect on coal consumption.',
        isCorrect: false,
        rationale:
          'They contained Fibonacci-wound coils capturing inductance from Ley-Lines the tracks followed, cutting coal use dramatically.',
      },
    ],
    hint: 'EM resonators on locomotives — lattice energy — later destroyed for coal.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question:
      'What is the "Dark Ages" label actually applied to in this framework?',
    options: [
      {
        label: 'A',
        text: 'A pure blank void before life existed, with no Tartarian remnants and no violent termination of any civilization.',
        isCorrect: false,
        rationale:
          'Dark Ages is the falsified label applied to Tartaria\'s remnants after its violent termination — not a blank pre-life void.',
      },
      {
        label: 'B',
        text: 'The falsified label applied to the remnants of Tartaria following its violent termination — not a natural prelude to industrial miracles.',
        isCorrect: true,
        rationale:
          'Dark Ages falsifies Tartaria\'s post-termination remnants; it is not a natural run-up to sudden industrial perfection.',
      },
      {
        label: 'C',
        text: 'The golden free-energy peak of Great Tartary before any Mudflood or energy weapon was ever deployed.',
        isCorrect: false,
        rationale:
          'Dark Ages names the falsified aftermath of Tartaria\'s destruction, not the living peak of that civilization.',
      },
      {
        label: 'D',
        text: 'Only the years 1914–1918 of World War 1 with no connection to Tartarian architecture or Mudfloods.',
        isCorrect: false,
        rationale:
          'WWI is a later erasure tool; Dark Ages is the falsified label on Tartaria remnants after the Re-set termination.',
      },
    ],
    hint: 'Falsified label for Tartaria remnants after violent termination.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question:
      'What is the astonishing architectural splendor of the past 200 years actually?',
    options: [
      {
        label: 'A',
        text: 'Brand-new rapid industrial genius that invents cathedrals from scratch every decade without any leftover Tartarian infrastructure.',
        isCorrect: false,
        rationale:
          'That splendor is leftover infrastructure of the previous Re-set, not miraculous rapid industrial creation from scratch.',
      },
      {
        label: 'B',
        text: 'Only cardboard movie sets that freemasons rebuild nightly with hammers and no harmonic frequency history at all.',
        isCorrect: false,
        rationale:
          'It is real leftover old-world infrastructure of the previous Re-set, not nightly cardboard sets.',
      },
      {
        label: 'C',
        text: 'Merely the leftover infrastructure of the previous Re-set — not the product of sudden natural progress.',
        isCorrect: true,
        rationale:
          'Past-200-year architectural splendor is leftover previous-Re-set infrastructure, not rapid genuine industrial progress.',
      },
      {
        label: 'D',
        text: 'G.A.A. emergency housing painted battle-ship grey to raise frequency and end Density Suppression forever.',
        isCorrect: false,
        rationale:
          'Battle-ship grey uglification is later parasitic degradation; the grand buildings are prior-epoch leftovers.',
      },
    ],
    hint: 'Leftover infrastructure of the previous Re-set — not rapid progress.',
    correctAnswer: 'C',
  },
  {
    number: 12,
    question:
      'Why did parasitic forces repurpose surviving old-world architecture after the Re-set?',
    options: [
      {
        label: 'A',
        text: 'Because they freely create infinite new crystalline temples from Source light without needing any old nodes or shells.',
        isCorrect: false,
        rationale:
          'Parasites could not genuinely create, so they merely repurposed surviving architecture of the old world.',
      },
      {
        label: 'B',
        text: 'Because every building was vaporized completely, leaving zero shells, nodes, or temples to occupy at all.',
        isCorrect: false,
        rationale:
          'Surviving architecture remained and was repurposed; parasites lack true creative capacity for the old world\'s caliber.',
      },
      {
        label: 'C',
        text: 'Because G.A.A. ordered them to restore free energy condensers on every locomotive for public benefit.',
        isCorrect: false,
        rationale:
          'Repurposing serves control of leftover Tartarian infrastructure; free-energy tech was later destroyed, not restored by parasites.',
      },
      {
        label: 'D',
        text: 'Because they could not genuinely create — they merely repurposed the surviving architecture of the old world.',
        isCorrect: true,
        rationale:
          'Unable to genuinely create, parasitic forces repurposed surviving old-world architecture after the Re-set.',
      },
    ],
    hint: 'Could not genuinely create — only repurposed surviving old-world builds.',
    correctAnswer: 'D',
  },
  {
    number: 13,
    question:
      'How was the empty post-Re-set realm populated, and what happened to memory-bearing survivors?',
    options: [
      {
        label: 'A',
        text: 'Laboratory-grown orphans filled surviving cities while global conflicts were orchestrated to slaughter remaining survivors who retained true historical memory.',
        isCorrect: true,
        rationale:
          'Empty cities were filled with lab-grown orphans; coordinated conflicts slaughtered survivors still holding true historical memory.',
      },
      {
        label: 'B',
        text: 'Only freemason elders retired into asylums while every Tartarian memory-keeper was promoted to rewrite public schools honestly.',
        isCorrect: false,
        rationale:
          'Memory-bearing survivors were targeted for slaughter; the new population included laboratory-grown orphans, not honest school reformers.',
      },
      {
        label: 'C',
        text: 'Natural immigration of free souls with full Tartarian recall and zero clone engineering in any underground base.',
        isCorrect: false,
        rationale:
          'Repopulation used laboratory-grown orphans; survivors with true memory were systematically slaughtered through orchestrated conflicts.',
      },
      {
        label: 'D',
        text: 'Instant G.A.A. disclosure that published every Mudflood map and banned all wars against memory holders forever.',
        isCorrect: false,
        rationale:
          'Post-Re-set strategy was clone/orphan repopulation plus slaughter of memory holders — not open G.A.A. disclosure.',
      },
    ],
    hint: 'Lab-grown orphans in empty cities — slaughter memory-bearing survivors.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question:
      'What is "Dustification" as observed in the Mudflood energy-weapon pattern?',
    options: [
      {
        label: 'A',
        text: 'Slow sandstone weathering over millions of years with no frequency weapons and no instant particulate reduction.',
        isCorrect: false,
        rationale:
          'Dustification instantly reduces structures weighing hundreds of millions of tons to particulate dust via energy-weapon frequencies.',
      },
      {
        label: 'B',
        text: 'The same energy-weapon effect that instantly reduces structures weighing hundreds of millions of tons to particulate dust — matching modern false-flag deployments.',
        isCorrect: true,
        rationale:
          'Dustification is the energy-weapon reduction of immense structures to particulate dust, the same tech seen in modern false-flag deployments.',
      },
      {
        label: 'C',
        text: 'A museum cleaning spray that only dusts Oopa shelves without altering subatomic cohesion of any building.',
        isCorrect: false,
        rationale:
          'Dustification is planetary-scale matter-cohesion weaponization of colossal buildings, not museum dusting spray.',
      },
      {
        label: 'D',
        text: 'A coal-company slogan from 1887 about smelting condensers with no link to city-scale structural collapse.',
        isCorrect: false,
        rationale:
          'Dustification names the instant particulate reduction of huge structures by energy weapons, separate from the 1887 condenser smelting order.',
      },
    ],
    hint: 'Instant reduction of huge structures to particulate dust via energy weapons.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question:
      'Why was the Mudflood energy-weapon application explicitly non-nuclear?',
    options: [
      {
        label: 'A',
        text: 'Because parasites love permanent radiation and want grow-spaces fully polluted for every future harvest forever.',
        isCorrect: false,
        rationale:
          'Nuclear radiation permanently pollutes grow-space needed for subsequent biological harvests — so weapons were non-nuclear.',
      },
      {
        label: 'B',
        text: 'Because freemasons banned all frequency tech and only allowed textbooks to mention ancient nuclear blasts as truth.',
        isCorrect: false,
        rationale:
          'Frequency energy weapons were used; nuclear attribution is the false modern science story. Non-nuclear choice protects grow-space.',
      },
      {
        label: 'C',
        text: 'Because nuclear radiation permanently pollutes the grow-space required by parasites for subsequent biological harvests.',
        isCorrect: true,
        rationale:
          'Weapons were explicitly non-nuclear so radiation would not permanently pollute the grow-space needed for later biological harvests.',
      },
      {
        label: 'D',
        text: 'Because desert glass cannot form without pure sunlight and energy weapons never touched mountains or deserts at all.',
        isCorrect: false,
        rationale:
          'Energy weapons created desert glass terrain anomalies; the non-nuclear reason is protecting parasitic grow-space from radiation.',
      },
    ],
    hint: 'Non-nuclear — radiation would pollute grow-space for later harvests.',
    correctAnswer: 'C',
  },
  {
    number: 16,
    question:
      'What did 19th-century American railroad earthworks uncover in so-called Burial Mounds?',
    options: [
      {
        label: 'A',
        text: 'Only empty coal bins planted by the Consolidated Coal Company with no giant bones of any size.',
        isCorrect: false,
        rationale:
          'Excavations uncovered over 10,000 giant skeletons from 12 feet to over 35 meters, including femurs about 30 meters long.',
      },
      {
        label: 'B',
        text: 'A few modern cow bones mislabeled as folklore with no Smithsonian involvement or mass confiscation.',
        isCorrect: false,
        rationale:
          'Thousands of giant remains were found; institutions like the Smithsonian confiscated them under freemasonic control.',
      },
      {
        label: 'C',
        text: 'Only atmospheric condenser coils still humming on free-energy rails with no humanoid remains present.',
        isCorrect: false,
        rationale:
          'Burial Mounds (Re-set debris hills) yielded over 10,000 giant skeletons and enormous human femurs — not only condenser coils.',
      },
      {
        label: 'D',
        text: 'Over 10,000 skeletons of Giants from 12 feet to over 35 meters tall, including massive human femurs measuring 30 meters — hills that were actually Re-set debris.',
        isCorrect: true,
        rationale:
          'Railroad earthworks hit Re-set debris hills mislabeled Burial Mounds and found 10,000+ giant skeletons and 30-meter femurs.',
      },
    ],
    hint: '10,000+ giants in Re-set debris hills mislabeled Burial Mounds.',
    correctAnswer: 'D',
  },
  {
    number: 17,
    question:
      'How did Smithsonian-linked operatives handle giant remains and Oopa discoveries?',
    options: [
      {
        label: 'A',
        text: 'As the "Vatican of Archaeology" under 33rd-degree Freemason control, they confiscated remains, forced NDAs under threat of imprisonment or death, and sealed Oopa\'s in subterranean vaults.',
        isCorrect: true,
        rationale:
          'Smithsonian functioned as Vatican of Archaeology under 33rd-degree Freemasons — confiscation, death/prison NDAs, sealed vaults.',
      },
      {
        label: 'B',
        text: 'They published full catalogs in every school and paid discoverers royalties for displaying giants in open parks forever.',
        isCorrect: false,
        rationale:
          'Discoverers were forced into NDAs under threat of imprisonment or death; remains went to sealed subterranean vaults.',
      },
      {
        label: 'C',
        text: 'They ignored all finds because freemasons have no interest in protecting any fraudulent evolutionary timeline.',
        isCorrect: false,
        rationale:
          'Confiscation protects the fraudulent timeline; freemasonic control of that archaeology apparatus is central to the cover-up.',
      },
      {
        label: 'D',
        text: 'They only collected freemason rings and never touched femurs, mounds, or museum basement vaults of any kind.',
        isCorrect: false,
        rationale:
          'Operatives immediately confiscated giant remains and Oopa\'s into sealed vaults under institutional cover.',
      },
    ],
    hint: 'Smithsonian = Vatican of Archaeology — NDAs, vaults, freemason control.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question:
      'How were magnificent Tartarian temples and cathedrals actually formed?',
    options: [
      {
        label: 'A',
        text: 'Only with hammers and chisels over centuries of unpaid NPC labor and zero harmonic frequency methods.',
        isCorrect: false,
        rationale:
          'They were generated using harmonic frequencies and sustained intent — not mere hammer-and-chisel labor myths.',
      },
      {
        label: 'B',
        text: 'Using harmonic frequencies and sustained intent — Tuning Forks and vibrational molds turned andesite and granite into weightless putty shaped with sound and light.',
        isCorrect: true,
        rationale:
          'Frequency construction: Tuning Forks and vibrational molds made hard rock weightless putty shaped by sound and light.',
      },
      {
        label: 'C',
        text: 'By pouring battle-ship grey concrete around Baphomet pylons with no tuning forks or granite putty stages.',
        isCorrect: false,
        rationale:
          'Grey concrete and Baphomet pylons are later density-suppression tactics, not Tartarian frequency construction.',
      },
      {
        label: 'D',
        text: 'By Mudflood liquefaction alone, which builds new temples upward without any sound, light, or intent technology.',
        isCorrect: false,
        rationale:
          'Mudflood weapons destroy and bury; temple generation used harmonic frequencies, tuning forks, and vibrational molds.',
      },
    ],
    hint: 'Harmonic frequencies — tuning forks — stone as weightless putty.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question:
      'What did Edward Leedskalnin demonstrate with residual old-world knowledge?',
    options: [
      {
        label: 'A',
        text: 'He only wrote poetry about limestone and never cut, moved, or balanced any multi-ton stone blocks alone.',
        isCorrect: false,
        rationale:
          'He single-handedly cut, moved, and perfectly balanced 1,100 tons of limestone using residual magnetics and frequency knowledge.',
      },
      {
        label: 'B',
        text: 'He smelted Atmospheric Condensers for the Consolidated Coal Company and erased free energy from every rail line.',
        isCorrect: false,
        rationale:
          'Leedskalnin replicated pre-Re-set weight and leverage laws with limestone work — opposite of coal-monopoly condenser destruction.',
      },
      {
        label: 'C',
        text: 'He single-handedly cut, moved, and perfectly balanced 1,100 tons of limestone, replicating lost pre-Re-set laws of weight and leverage via magnetics and frequencies.',
        isCorrect: true,
        rationale:
          'Edward Leedskalnin used residual magnetics/frequency knowledge to alone handle 1,100 tons of limestone, recovering pre-Re-set leverage laws.',
      },
      {
        label: 'D',
        text: 'He founded the Smithsonian vault program that sealed every 30-meter femur under freemason NDAs worldwide.',
        isCorrect: false,
        rationale:
          'His demonstration recovered old-world stone-moving knowledge; Smithsonian confiscation is a separate suppression apparatus.',
      },
    ],
    hint: 'Leedskalnin — 1,100 tons limestone — pre-Re-set magnetics/frequencies.',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question:
      'What happened to Atmospheric Condensers on pre-1880 locomotives by 1887?',
    options: [
      {
        label: 'A',
        text: 'They were mass-produced for every school bus so coal use rose and free energy became mandatory public policy.',
        isCorrect: false,
        rationale:
          'In 1887 the Consolidated Coal Company ordered removal and complete smelting of condensers to kill free energy and enforce coal.',
      },
      {
        label: 'B',
        text: 'G.A.A. upgraded them into EMF flash towers that ended all Mudfloods without any coal monopoly involvement.',
        isCorrect: false,
        rationale:
          'Coal monopoly interests ordered condensers removed and smelted to eradicate free-energy tech — not G.A.A. upgrades.',
      },
      {
        label: 'C',
        text: 'They remain on every modern train, still cutting coal by 60% via Fibonacci coils on Ley-Line tracks openly admitted in textbooks.',
        isCorrect: false,
        rationale:
          'Condensers once cut coal up to 60% but were ordered removed and smelted in 1887 to enforce fossil dependency.',
      },
      {
        label: 'D',
        text: 'The Consolidated Coal Company ordered their removal and complete smelting to eradicate free-energy technology and enforce total reliance on coal monopolies.',
        isCorrect: true,
        rationale:
          '1887: Consolidated Coal Company ordered Atmospheric Condensers removed and smelted to wipe free energy and lock in coal monopolies.',
      },
    ],
    hint: '1887 Consolidated Coal — remove and smelt condensers — enforce coal.',
    correctAnswer: 'D',
  },
  {
    number: 21,
    question:
      'What were Orphan Trains actually carrying into the emptied post-Mudflood cities?',
    options: [
      {
        label: 'A',
        text: 'Clones engineered in D.U.M.B.S. from stem cells of children sacrificed during the Re-set — newly "grown" crops of children for repopulation.',
        isCorrect: true,
        rationale:
          'Orphan Trains moved laboratory-grown clone children from D.U.M.B.S. using stem cells of children sacrificed in the Re-set.',
      },
      {
        label: 'B',
        text: 'Only free Tartarian elders with full historical memory hired to teach flat earth and herbal remedies in every school.',
        isCorrect: false,
        rationale:
          'Memory-bearing survivors were targeted later for slaughter; Orphan Trains carried engineered clone children, not free memory elders.',
      },
      {
        label: 'C',
        text: 'Atmospheric Condensers and tuning forks donated to rebuild free energy without any clone biology involved.',
        isCorrect: false,
        rationale:
          'Orphan Trains were a biological repopulation vector of clones from D.U.M.B.S., not a free-energy hardware delivery service.',
      },
      {
        label: 'D',
        text: 'Giant femurs for open museums so Smithsonian vaults would empty and the fraudulent timeline would collapse publicly.',
        isCorrect: false,
        rationale:
          'Giant remains were confiscated into vaults; Orphan Trains served clone repopulation of empty cities.',
      },
    ],
    hint: 'Clone children from D.U.M.B.S. — stem cells of sacrificed Re-set children.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question:
      'What role did enormous Lunatic Asylums play after the Mudfloods?',
    options: [
      {
        label: 'A',
        text: 'Gentle spa retreats that raised frequency and never generated negative energy for any demonic parasitic feed.',
        isCorrect: false,
        rationale:
          'Asylums functioned as Loosh Batteries generating negative energy to feed parasitic demonic entities.',
      },
      {
        label: 'B',
        text: 'Pre-planned facilities over 5,000 beds housing shell-shocked catatonic survivors as "Loosh Batteries" until new clone populations matured.',
        isCorrect: true,
        rationale:
          'Asylums exceeding 5,000 beds housed catatonic Re-set survivors as Loosh Batteries feeding parasites until clones matured.',
      },
      {
        label: 'C',
        text: 'Only freemason meeting halls that banned all survivors and stored Atmospheric Condensers in secret basements.',
        isCorrect: false,
        rationale:
          'They housed shell-shocked human survivors and explicitly functioned as Loosh Batteries for parasitic feed.',
      },
      {
        label: 'D',
        text: 'Smithsonian vault annexes that displayed 30-meter femurs to the public without any loosh or catatonia function.',
        isCorrect: false,
        rationale:
          'Asylums managed energetic fallout via loosh generation from catatonic survivors — not public giant-bone museums.',
      },
    ],
    hint: '5,000+ bed asylums = Loosh Batteries for catatonic survivors.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question:
      'What was the covert primary objective of World War 1 (1914–1918) in this framework?',
    options: [
      {
        label: 'A',
        text: 'To expand free-energy condensers worldwide and teach flat earth openly in every parasitic school system.',
        isCorrect: false,
        rationale:
          'Covert objective was slaughter of 15–22 million aged 15–55 who still remembered flat earth, herbals, and true realm nature.',
      },
      {
        label: 'B',
        text: 'To relocate Orphan Trains into G.A.A. custody with zero deaths among memory-bearing adults of any age.',
        isCorrect: false,
        rationale:
          'WWI systematically slaughtered the demographic that still retained active pre-parasitic-education memory.',
      },
      {
        label: 'C',
        text: 'Systematic slaughter of 15 to 22 million individuals aged 15 to 55 who still retained memory of the flat earth, herbal remedies, and the true nature of the realm.',
        isCorrect: true,
        rationale:
          'WWI\'s covert aim was killing 15–22 million of the 15–55 age band that still held true pre-education historical memory.',
      },
      {
        label: 'D',
        text: 'To build more Lunatic Asylums as tourist hotels without targeting any age demographic or historical memory holders.',
        isCorrect: false,
        rationale:
          'The war targeted the exact age demographic retaining active memory before rigid parasitic education locked in.',
      },
    ],
    hint: 'Slaughter 15–22 million (ages 15–55) still holding true memory.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question:
      'How do Mudflood/Re-set evidence and architecture link to the Lattice Membrane Network?',
    options: [
      {
        label: 'A',
        text: 'Surviving architecture sits randomly with no nodal alignment, and Baphomet pylons only decorate parks without dampening frequency.',
        isCorrect: false,
        rationale:
          'Surviving architecture sits on energetic Nodal Points of the lattice; concrete, tarmac, and Baphomet Power Pylons dampen high-frequency emanations.',
      },
      {
        label: 'B',
        text: 'The lattice only powers smartphones and has no link to Tartarian nodes, Density Suppression, or parasitic dampening infrastructure.',
        isCorrect: false,
        rationale:
          'Original civilization built on nodal points to interact with the realm\'s EM grid; parasites suppress those nodes for Density Suppression.',
      },
      {
        label: 'C',
        text: 'Only freemasons can feel Ley-Lines, so Mudflood scars and nodal temples have zero electromagnetic grid meaning.',
        isCorrect: false,
        rationale:
          'Physical Mudflood/Re-set evidence links to lattice manipulation; nodal architecture proves old-world grid interaction.',
      },
      {
        label: 'D',
        text: 'Surviving architecture on energetic Nodal Points proves old-world interaction with the EM grid; concrete, tarmac, and Baphomet Power Pylons dampen high-frequency emanations to maintain Density Suppression.',
        isCorrect: true,
        rationale:
          'Nodal placement shows lattice interaction; post-Re-set concrete, tarmac, and Baphomet pylons dampen frequencies for Density Suppression.',
      },
    ],
    hint: 'Nodal architecture + lattice — pylons/concrete dampen for Density Suppression.',
    correctAnswer: 'D',
  },
  {
    number: 25,
    question:
      'Why does recognizing Mudflood scars matter strategically before the intended final 8th Re-set?',
    options: [
      {
        label: 'A',
        text: 'It destroys the psychological constraints of Perceived Knowledge, helping consciousness exit the simulation rather than normalize battle-ship grey suffering and captivity as "progress".',
        isCorrect: true,
        rationale:
          'Seeing past annihilations destroys Perceived Knowledge constraints so consciousness can break parasitic consensus and prepare beyond the intended 8th Re-set path.',
      },
      {
        label: 'B',
        text: 'It proves human evolution is genuine linear progress and that free energy was never mastered before the coal age.',
        isCorrect: false,
        rationale:
          'Mudfloods and suppressed tech shatter the evolution/progress illusion; history is a ledger of captivity, not achievement.',
      },
      {
        label: 'C',
        text: 'It only matters to freemason historians cataloging vaults while everyone else should accept Density Suppression as natural weather.',
        isCorrect: false,
        rationale:
          'Understanding past Re-sets is a critical prerequisite to exiting the simulation for awakening consciousness, not elite catalog hobby only.',
      },
      {
        label: 'D',
        text: 'It guarantees the 8th Re-set will be cancelled automatically without any shift in frequency, architecture awareness, or consensus break.',
        isCorrect: false,
        rationale:
          'Recognition breaks Perceived Knowledge and captivity programming; uglification and suffering normalization still aim at a final 8th Re-set unless consciousness exits the trap.',
      },
    ],
    hint: 'Shatter Perceived Knowledge — exit simulation — see captivity not progress.',
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
  'Test your grasp of Mud-floods — Tartary erasure, energy-weapon soil liquefaction, giants and Oopa\'s, Atmospheric Condensers, Orphan Trains, and the intended 8th Re-set.';
const DESC_META =
  'Interactive Living Truth Quiz on Mud-floods: Great Tartary, Re-sets, Dustification, Smithsonian vault suppression, frequency-built temples, coal monopoly condenser destruction, Loosh Battery asylums, and WWI memory slaughter.';

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
      'Mud-floods are not folklore about wet streets — they are the physical scar of ET Energy Weapons and soil liquefaction that buried Great Tartary so a fraudulent timeline could be installed. Sit with what you missed, then return to the Mud-floods deep-dive. Dustification of cities, 10,000+ giants sealed by the Smithsonian, Atmospheric Condensers smelted for coal, Orphan Train clones, Loosh Battery asylums, WWI slaughter of memory-holders — that is the ledger of captivity. Battle-ship grey uglification and Density Suppression still aim at an intended final 8th Re-set. Shatter Perceived Knowledge now — or the next annihilation owns the narrative again.',
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
      "  { path: '/quiz/alice/moon-et-space-station.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/lucifer-light-bearer.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/matrix-scaffolding.html', priority: '0.75', changefreq: 'monthly' },",
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
console.log('PASS: audited 25/25 against data/alice-topics/mud-floods.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
