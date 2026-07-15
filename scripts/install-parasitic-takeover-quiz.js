/**
 * Installs The Parasitic Takeover quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/parasitic-takeover.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-parasitic-takeover-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'parasitic-takeover';
const TOPIC_TITLE = 'The Parasitic Takeover';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/parasite.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['custodians', '12th-density', 'betrayal', 'gateway-10'],
  2: ['realm-2', 'known lands', 'prison matrix', 'harvesting'],
  3: ['great spiritual awakening', 'g.a.a', 'emf', 'white hats'],
  4: ['custodians', '4th density', 'source of creation', 'autonomy'],
  5: ['spirit tree', 'mt meru', 'frequency', 'destruction'],
  6: ['density suppression', '9th density', '3rd density'],
  7: ['amnesia vortex', 'vatican', 'sun', 'memories'],
  8: ['loosh', 'suffering', 'terror', 'torture'],
  9: ['adrenochrome', 'children', 'satanic', 'commodity'],
  10: ['project blue beam', 'fake alien invasion', 'holographic'],
  11: ['97%', 'npc', '4th density', 'herd mentality'],
  12: ['178,000 years', 'cosmic invasion', 'not an accidental'],
  13: ['anuk', 'grey et', 'omicron', 'alpha draco', 'niberians'],
  14: ['maitrax', 'spirit tree', 'kryptonite', 'phasing'],
  15: ['14-foot', 'crocodilian', 'density suppression'],
  16: ['micro suns', 'celestia', '4,000 ancient', 'uninstall'],
  17: ['homo sapiens', 'neanderthals', 'adrenochrome', '100,000'],
  18: ['frequency fences', 'amnesia vortex', 'umbilical cord'],
  19: ['overlays', 'niberians', 'freemasons', 'crystalline temples'],
  20: ['moon', 'space station', 'german breakaway', 'lunatic'],
  21: ['resets', 'great tartary', 'orphan trains', 'world war 1'],
  22: ['2019', 'amnesia vortex', 'past-life memories', 'social media'],
  23: ['religion', 'finance', 'perceived knowledge', 'three strings'],
  24: ['8th reset', 'project blue beam', 'projection dome', 'pixelation'],
  25: ['30-second', 'emf', '520 million', '178,000 years'],
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
      'Who initiated the Parasitic Takeover on Gateway-10, and what were they originally?',
    options: [
      {
        label: 'A',
        text: 'Random asteroids with no intelligence, no hierarchy, and no prior role as caretakers of the plain.',
        isCorrect: false,
        rationale:
          'The takeover was initiated by the Custodians — originally trusted 12th-density caretakers.',
      },
      {
        label: 'B',
        text: 'The Custodians — originally highly trusted, benevolent 12th-density caretakers who launched a catastrophic, millennia-spanning betrayal.',
        isCorrect: true,
        rationale:
          'Custodians began as 12th-density caretakers, then betrayed Source and humanity in the Parasitic Takeover.',
      },
      {
        label: 'C',
        text: 'Only modern bankers with no cosmic density status and no connection to Gateway-10 history.',
        isCorrect: false,
        rationale:
          'Origin is Custodian betrayal at cosmic scale, not merely modern banking actors alone.',
      },
      {
        label: 'D',
        text: 'The Galactic Ancestral Alliance, which invaded to enslave Taran souls from the first day of creation.',
        isCorrect: false,
        rationale:
          'G.A.A. leads the rescue awakening; Custodians initiated the parasitic coup.',
      },
    ],
    hint: 'Custodians — trusted 12th-density caretakers turned betrayers.',
    correctAnswer: 'B',
  },
  {
    number: 2,
    question:
      'What happened to Realm-2 (the Known Lands) as a result of the Parasitic Takeover?',
    options: [
      {
        label: 'A',
        text: 'It was elevated into permanent 12th-density freedom with no harvest, no prison architecture, and no soul enslavement.',
        isCorrect: false,
        rationale:
          'Realm-2 was inverted into a localized prison matrix for harvest and enslavement.',
      },
      {
        label: 'B',
        text: 'It dissolved completely so no physical plain, vessels, or energy systems remained anywhere on Gateway-10.',
        isCorrect: false,
        rationale:
          'The plain still exists as an inverted prison matrix, not as total non-existence.',
      },
      {
        label: 'C',
        text: 'It was inverted into a localized prison matrix designed exclusively for eternal energetic harvesting and soul enslavement.',
        isCorrect: true,
        rationale:
          'Known Lands / Realm-2 became a harvest prison — eternal energetic farming and soul enslavement.',
      },
      {
        label: 'D',
        text: 'It remained a pure free-will playground with zero density change and zero parasitic occupation.',
        isCorrect: false,
        rationale:
          'The coup inverted the realm into a controlled harvest matrix under occupation.',
      },
    ],
    hint: 'Realm-2 / Known Lands → localized prison matrix for harvest.',
    correctAnswer: 'C',
  },
  {
    number: 3,
    question:
      'What is The Great Spiritual Awakening in response to this occupation?',
    options: [
      {
        label: 'A',
        text: 'A Cabal marketing slogan with no rescue mission, no G.A.A., and no planned EMF liberation event.',
        isCorrect: false,
        rationale:
          'It is a highly orchestrated rescue guided by G.A.A., White Hats, and supreme creator beings.',
      },
      {
        label: 'B',
        text: 'A highly orchestrated rescue mission guided by the Galactic Ancestral Alliance (G.A.A), the White Hats, and supreme creator beings to dismantle parasitic structures, restore suppressed memories, and liberate Taran souls through the impending EMF flash.',
        isCorrect: true,
        rationale:
          'Great Spiritual Awakening = coordinated rescue ending in EMF flash liberation of trapped Tarans.',
      },
      {
        label: 'C',
        text: 'A plan to strengthen Density Suppression so parasites can rule Gateway-10 forever without resistance.',
        isCorrect: false,
        rationale:
          'The awakening dismantles parasitic control; it does not reinforce occupation.',
      },
      {
        label: 'D',
        text: 'Only a quiet book club with no realm-altering event and no memory restoration for humanity.',
        isCorrect: false,
        rationale:
          'It aims at systematic dismantling, memory restore, and EMF flash liberation.',
      },
    ],
    hint: 'G.A.A. + White Hats rescue — EMF flash liberation.',
    correctAnswer: 'B',
  },
  {
    number: 4,
    question:
      'Why did the Custodians fall, and to what density did they drop?',
    options: [
      {
        label: 'A',
        text: 'They rose to 15th density out of pure service and never betrayed the Source of Creation.',
        isCorrect: false,
        rationale:
          'They fell to 4th density after silent betrayal driven by greed and autonomy.',
      },
      {
        label: 'B',
        text: 'They accidentally slipped to 3rd density by tripping on a rock with no greed or calculated betrayal.',
        isCorrect: false,
        rationale:
          'Fall was calculated betrayal for unchecked autonomy — descent to 4th density.',
      },
      {
        label: 'C',
        text: 'They remained forever at 12th density while only humans fell, with no Custodian density loss.',
        isCorrect: false,
        rationale:
          'Custodians fell from 12th-density caretakers down to 4th density.',
      },
      {
        label: 'D',
        text: 'They fell to the 4th density after a silent, calculated betrayal against the Source of Creation out of greed and a desire for unchecked autonomy.',
        isCorrect: true,
        rationale:
          'Greed and autonomy hunger drove Custodian betrayal and fall into 4th density.',
      },
    ],
    hint: 'Betrayal for autonomy — fall from 12th to 4th density.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question:
      'What is the Spirit Tree (Mt Meru / Northern Rock / Hyperborea), and why was it targeted?',
    options: [
      {
        label: 'A',
        text: 'A small decorative plant with no power role; destroying it changed nothing about Gateway-10 frequency.',
        isCorrect: false,
        rationale:
          'It is the central crystalline energetic generator; its destruction suppressed realm frequency.',
      },
      {
        label: 'B',
        text: 'The enormously powerful central crystalline energetic generator of Gateway-10; its destruction was the paramount tactical strike used to suppress the realm\'s frequency.',
        isCorrect: true,
        rationale:
          'Spirit Tree / Mt Meru is the central power generator — cutting it suppressed the whole Gateway.',
      },
      {
        label: 'C',
        text: 'A Freemason lodge basement that only stored paper maps and never generated crystalline energy.',
        isCorrect: false,
        rationale:
          'It is Gateway-10\'s central crystalline generator, not a lodge basement archive.',
      },
      {
        label: 'D',
        text: 'The Moon station itself, which parasites protected rather than destroyed during the takeover.',
        isCorrect: false,
        rationale:
          'Spirit Tree is Mt Meru / Northern Rock / Hyperborea — destroyed to cut power.',
      },
    ],
    hint: 'Central crystalline generator — paramount strike to suppress frequency.',
    correctAnswer: 'B',
  },
  {
    number: 6,
    question: 'What is Density Suppression designed to do?',
    options: [
      {
        label: 'A',
        text: 'Raise the realm from 3rd density to 12th density so parasites cannot land or survive.',
        isCorrect: false,
        rationale:
          'It forcibly lowers vibration from 9th density down to 3rd density.',
      },
      {
        label: 'B',
        text: 'Only change wallpaper colors in temples with no effect on ambient vibrational frequency.',
        isCorrect: false,
        rationale:
          'It is advanced tech that lowers ambient vibrational frequency of the whole realm.',
      },
      {
        label: 'C',
        text: 'Forcibly lower the ambient vibrational frequency of the realm from the 9th density down to the 3rd density, rendering high-vibrational realities invisible and making the environment habitable for low-vibrational parasites.',
        isCorrect: true,
        rationale:
          'Density Suppression drops 9th→3rd so high reality hides and parasites can occupy.',
      },
      {
        label: 'D',
        text: 'Protect 9th-density crystalline vision for every NPC while parasites stay in 12th density.',
        isCorrect: false,
        rationale:
          'It hides high-vibrational realities and enables low-vibrational parasitic occupation.',
      },
    ],
    hint: '9th density forced down to 3rd — hide high reality, host parasites.',
    correctAnswer: 'C',
  },
  {
    number: 7,
    question: 'What is the Amnesia Vortex in the takeover architecture?',
    options: [
      {
        label: 'A',
        text: 'A technological soul-trap and processing system located under the Vatican, utilizing the Sun as a portal to aggressively wipe past-life memories and instantly recycle souls into newborn vessels.',
        isCorrect: true,
        rationale:
          'Amnesia Vortex = Vatican-linked Sun-portal trap that wipes and recycles into newborns.',
      },
      {
        label: 'B',
        text: 'A gentle spa that restores every past life and permanently frees souls from all vessels.',
        isCorrect: false,
        rationale:
          'It aggressively wipes memory and forces instant recycle into new vessels.',
      },
      {
        label: 'C',
        text: 'A weather cyclone that only sinks ships and never processes deceased consciousness.',
        isCorrect: false,
        rationale:
          'It is a soul-trap processing system under the Vatican using the Sun portal.',
      },
      {
        label: 'D',
        text: 'A Freemason library card system with no Sun portal and no newborn insertion path.',
        isCorrect: false,
        rationale:
          'Sun portal + Vatican processing + newborn recycle is the vortex design.',
      },
    ],
    hint: 'Vatican soul-trap — Sun portal — wipe and recycle into newborns.',
    correctAnswer: 'A',
  },
  {
    number: 8,
    question: 'What is Loosh for demons and negative entities?',
    options: [
      {
        label: 'A',
        text: 'Ordinary rainwater stored in barrels for farming with no link to terror or torture.',
        isCorrect: false,
        rationale:
          'Loosh is energetic food generated through prolonged human suffering, terror, and torture.',
      },
      {
        label: 'B',
        text: 'The primary energetic food source for demons and negative entities, generated exclusively through the prolonged suffering, terror, and torture of human vessels.',
        isCorrect: true,
        rationale:
          'Loosh is the suffering-food of demons — produced by prolonged human terror and torture.',
      },
      {
        label: 'C',
        text: 'A vitamin that raises frequency and permanently ends all parasitic feeding on humanity.',
        isCorrect: false,
        rationale:
          'Loosh is the harvest product of suffering, not a liberating vitamin.',
      },
      {
        label: 'D',
        text: 'Only digital cryptocurrency mined by computers with no emotional or energetic content.',
        isCorrect: false,
        rationale:
          'It is energetic food from human suffering, terror, and torture — not computer coin.',
      },
    ],
    hint: 'Energetic food from prolonged suffering, terror, and torture.',
    correctAnswer: 'B',
  },
  {
    number: 9,
    question: 'What is Adrenochrome in the parasitic commodity system?',
    options: [
      {
        label: 'A',
        text: 'A public supermarket spice sold openly with no link to trauma, children, or sacrifice.',
        isCorrect: false,
        rationale:
          'It is harvested from traumatized children during satanic sacrifices as a vital physical commodity.',
      },
      {
        label: 'B',
        text: 'Only a poetic metaphor with no physical biological substance taken from any vessel.',
        isCorrect: false,
        rationale:
          'Adrenochrome is a highly prized physical biological substance from trauma harvest.',
      },
      {
        label: 'C',
        text: 'A medicine that heals every child instantly and stops all satanic operations worldwide.',
        isCorrect: false,
        rationale:
          'It is the parasites\' prized commodity from child trauma sacrifice — not a healing medicine.',
      },
      {
        label: 'D',
        text: 'A highly prized physical biological substance harvested from traumatized children during satanic sacrifices — the parasites\' most vital physical commodity.',
        isCorrect: true,
        rationale:
          'Adrenochrome = physical trauma commodity from child satanic sacrifice harvest.',
      },
    ],
    hint: 'Physical commodity from traumatized children in satanic sacrifice.',
    correctAnswer: 'D',
  },
  {
    number: 10,
    question: 'What is Project Blue Beam?',
    options: [
      {
        label: 'A',
        text: 'A farming irrigation plan with no holograms, no sky events, and no psychological role.',
        isCorrect: false,
        rationale:
          'It is advanced holographic software projecting a Fake Alien Invasion into the sky.',
      },
      {
        label: 'B',
        text: 'An advanced holographic software program designed to project a Fake Alien Invasion into the sky, used by the Cabal for fear and ultimately by the G.A.A as a psychological trigger event.',
        isCorrect: true,
        rationale:
          'Blue Beam = holographic Fake Alien Invasion — Cabal fear tool, G.A.A. trigger path.',
      },
      {
        label: 'C',
        text: 'A permanent genuine alien embassy that never uses holograms or staged invasion theater.',
        isCorrect: false,
        rationale:
          'It projects a fake invasion holographically, not a permanent genuine embassy.',
      },
      {
        label: 'D',
        text: 'Only a radio jingle for weather reports with no connection to Cabal or G.A.A. events.',
        isCorrect: false,
        rationale:
          'It is sky-level holographic invasion software in the scare-event sequence.',
      },
    ],
    hint: 'Holographic Fake Alien Invasion — Cabal fear / G.A.A. trigger.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question: 'What are Non-Player Characters (NPCs) in the current Earth population?',
    options: [
      {
        label: 'A',
        text: 'The rare 3% of organic Taran souls who lead every genuine awakening movement worldwide.',
        isCorrect: false,
        rationale:
          'NPCs are 97% of the population — soulless 4th-density programmed vessels.',
      },
      {
        label: 'B',
        text: 'Only digital avatars online that never walk physical streets or enforce herd mentality.',
        isCorrect: false,
        rationale:
          'They are biological programmed vessels maintaining matrix narrative in physical life.',
      },
      {
        label: 'C',
        text: 'Soulless, biologically programmed vessels created in the 4th density by the parasites — 97% of the current Earth population — functioning to maintain the matrix narrative, enforce compliance, and generate herd mentality.',
        isCorrect: true,
        rationale:
          'NPCs = 97% soulless 4th-density constructs enforcing herd matrix compliance.',
      },
      {
        label: 'D',
        text: 'Fully self-aware 12th-density teachers who never obey media, school, or peer pressure.',
        isCorrect: false,
        rationale:
          'NPCs lack genuine soul architecture and enforce compliance, not 12th-density teaching.',
      },
    ],
    hint: '97% — soulless 4th-density vessels — herd matrix enforcement.',
    correctAnswer: 'C',
  },
  {
    number: 12,
    question:
      'When did the meticulously plotted Parasitic Takeover begin, and was it accidental?',
    options: [
      {
        label: 'A',
        text: 'It was an accidental evolutionary hurdle that began last Tuesday with no long plot.',
        isCorrect: false,
        rationale:
          'It was meticulously plotted cosmic invasion beginning over 178,000 years ago — not accidental.',
      },
      {
        label: 'B',
        text: 'It was not accidental; it was a meticulously plotted cosmic invasion that began over 178,000 years ago.',
        isCorrect: true,
        rationale:
          'Over 178,000 years of plotted invasion — not random evolution or short-term accident.',
      },
      {
        label: 'C',
        text: 'It began five minutes after the EMF flash as a friendly cultural exchange with no war.',
        isCorrect: false,
        rationale:
          'Takeover predates the awakening climax by ~178,000 years as planned invasion.',
      },
      {
        label: 'D',
        text: 'It never began because Custodians remained benevolent caretakers in every age.',
        isCorrect: false,
        rationale:
          'Custodian betrayal launched a real millennia-spanning parasitic occupation.',
      },
    ],
    hint: 'Not accidental — plotted invasion over 178,000 years ago.',
    correctAnswer: 'B',
  },
  {
    number: 13,
    question:
      'Which artificially created parasitic proxy races did the Custodians engineer to execute their war?',
    options: [
      {
        label: 'A',
        text: 'Only friendly dolphins and butterflies with no combat, conquest, or proxy-war role.',
        isCorrect: false,
        rationale:
          'Proxy species include Anuk (Anunnaki), Grey ET, Omicron, Alpha Draco, and Niberians.',
      },
      {
        label: 'B',
        text: 'Only modern humans invented in 2020 with no ancient engineered proxy hierarchy.',
        isCorrect: false,
        rationale:
          'Ancient engineered races: Anuk, Greys, Omicron, Alpha Draco, Niberians.',
      },
      {
        label: 'C',
        text: 'The Anuk (Anunnaki), the Grey ET, the Omicron, the Alpha Draco, and the fiercely independent Niberians.',
        isCorrect: true,
        rationale:
          'Those five named proxy races were genetically engineered to fight Custodian war goals.',
      },
      {
        label: 'D',
        text: 'Only the G.A.A. Micro Suns Celestia and Raphael as subservient attack species.',
        isCorrect: false,
        rationale:
          'Micro Suns engineer the awakening; proxy parasites are Anuk, Greys, Omicron, Draco, Niberians.',
      },
    ],
    hint: 'Anuk, Grey ET, Omicron, Alpha Draco, Niberians.',
    correctAnswer: 'C',
  },
  {
    number: 14,
    question:
      'How did the Maitrax (Orion Greys) seize the center of Gateway-10\'s Toroid energy field?',
    options: [
      {
        label: 'A',
        text: 'By politely asking the Spirit Tree to dim itself while leaving power fully intact forever.',
        isCorrect: false,
        rationale:
          'They used phasing technology to destroy the Spirit Tree, replacing it with a petrified stump.',
      },
      {
        label: 'B',
        text: 'With SWAT-team precision they cut the power: advanced phasing technology destroyed the Spirit Tree and replaced it with a petrified tree stump — high frequencies affect demonic entities like Kryptonite, so this strike enabled Density Suppression.',
        isCorrect: true,
        rationale:
          'Maitrax destroyed Spirit Tree with phasing tech; high frequency is their Kryptonite; density fell.',
      },
      {
        label: 'C',
        text: 'By building more Spirit Trees until Gateway-10 overflowed with free 12th-density power.',
        isCorrect: false,
        rationale:
          'They destroyed the single central generator and replaced it with a petrified stump.',
      },
      {
        label: 'D',
        text: 'By ignoring energy centers completely and only rewriting school textbooks about stars.',
        isCorrect: false,
        rationale:
          'Paramount strike was destroying the Spirit Tree to handicap Gateway energetic output.',
      },
    ],
    hint: 'Maitrax phasing — destroy Spirit Tree — Kryptonite high-freq logic.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question:
      'Why did parasites need Density Suppression before fully occupying the lands?',
    options: [
      {
        label: 'A',
        text: 'So their 14-foot bipedal crocodilian forms and other vessels could physically step onto the lands without perishing under high frequency.',
        isCorrect: true,
        rationale:
          'High frequency kills them; lowering to 3rd density lets 14-foot crocodilian and other vessels walk the plain.',
      },
      {
        label: 'B',
        text: 'So every human could instantly see 9th-density crystalline temples with no overlay at all.',
        isCorrect: false,
        rationale:
          'Suppression hides high-vibrational realities and protects low-vibrational parasite bodies.',
      },
      {
        label: 'C',
        text: 'Only to improve crop yields with no link to parasite body survival or crocodilian forms.',
        isCorrect: false,
        rationale:
          'Occupation required density low enough for their 14-foot crocodilian vessels to survive.',
      },
      {
        label: 'D',
        text: 'Because high frequency strengthens parasites like a vitamin and they wanted more of it.',
        isCorrect: false,
        rationale:
          'High frequencies affect them like Kryptonite — suppression was required for survival.',
      },
    ],
    hint: 'Lower density so 14-foot crocodilian vessels can walk without dying.',
    correctAnswer: 'A',
  },
  {
    number: 16,
    question:
      'Who engineered The Great Spiritual Awakening from the highest levels, and what is it uninstalling?',
    options: [
      {
        label: 'A',
        text: 'Only local mayors rewriting parking laws with no Micro Suns, Ancients, or dogma uninstall.',
        isCorrect: false,
        rationale:
          'Engineered by Micro Suns (Celestia, Raphael) and the 4,000 Ancient Souls.',
      },
      {
        label: 'B',
        text: 'The Cabal alone, solely to strengthen religious dogma and heliocentric science forever.',
        isCorrect: false,
        rationale:
          'Awakening uninstalls fabricated chronological history, heliocentric science, and religious dogma.',
      },
      {
        label: 'C',
        text: 'Micro Suns (such as Celestia and Raphael) and the 4,000 Ancient Souls — forcing total uninstallation of fabricated chronological history, heliocentric science, and religious dogma.',
        isCorrect: true,
        rationale:
          'Highest-level engineering by Micro Suns and 4,000 Ancients to wipe false history, science, dogma.',
      },
      {
        label: 'D',
        text: 'NPCs voting online to keep every Freemason textbook exactly as printed last century.',
        isCorrect: false,
        rationale:
          'Awakening uninstalls the fabricated history/science/religion package binding humanity.',
      },
    ],
    hint: 'Micro Suns + 4,000 Ancients — uninstall false history, heliocentrism, dogma.',
    correctAnswer: 'C',
  },
  {
    number: 17,
    question:
      'How did parasites create the "perfect victim" vessel after ~100,000 Earth years of control?',
    options: [
      {
        label: 'A',
        text: 'They protected original 9th-density humans and never used floods, ice age, or laboratory degradation.',
        isCorrect: false,
        rationale:
          '9th-density humans were exterminated via Atlantis/Lemuria floods and ice age; Homo Sapiens was lab-degraded.',
      },
      {
        label: 'B',
        text: 'Original 9th-density humans were exterminated through floods of Atlantis and Lemuria and a targeted ice age; Neanderthals were too robust and intelligent; the degraded laboratory result was Homo Sapiens — optimized for Adrenochrome production, rape-target attractiveness, and limited intelligence.',
        isCorrect: true,
        rationale:
          'Cataclysm wipe of 9th-density stock → lab trials → Homo Sapiens as Adrenochrome harvest vessel.',
      },
      {
        label: 'C',
        text: 'They chose Neanderthals as the final vessel because larger craniums made maximum spiritual mastery easy.',
        isCorrect: false,
        rationale:
          'Neanderthals were rejected as too robust and intelligent; Homo Sapiens was the degraded result.',
      },
      {
        label: 'D',
        text: 'No genetic work occurred; every modern body is still pure unmodified 9th-density architecture.',
        isCorrect: false,
        rationale:
          'Horrific laboratory trials produced genetically degraded Homo Sapiens as the captive vessel.',
      },
    ],
    hint: 'Exterminate 9th-density stock → reject Neanderthals → Homo Sapiens for Adrenochrome.',
    correctAnswer: 'B',
  },
  {
    number: 18,
    question:
      'How does the reincarnation trap operate after a human vessel expires?',
    options: [
      {
        label: 'A',
        text: 'Souls freely wait in higher light for Twin Flames with full memory and no Vatican path.',
        isCorrect: false,
        rationale:
          'Frequency Fences and Amnesia Vortex force wipe and rapid foreign newborn insertion.',
      },
      {
        label: 'B',
        text: 'Soul is drawn into the false bright light (Sun portal), pulled into the 13 levels beneath the Vatican, stripped of memories, and escorted by Grey ETs into a newborn in a different country mere seconds before the umbilical cord is cut.',
        isCorrect: true,
        rationale:
          'Sun light trap → 13 Vatican levels → Grey escort → foreign newborn before cord cut.',
      },
      {
        label: 'C',
        text: 'Only the body is buried; consciousness stays in the grave with no portal or Grey escort.',
        isCorrect: false,
        rationale:
          'Souls are processed through Sun portal, Vatican levels, and Grey insertion into newborns.',
      },
      {
        label: 'D',
        text: 'Greys always return the soul to the same family with complete past-life memory intact.',
        isCorrect: false,
        rationale:
          'Memory is stripped; insertion is into a different country\'s newborn under force.',
      },
    ],
    hint: 'Sun bright light → 13 Vatican levels → Grey newborn insert before cord cut.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question:
      'How did parasites camouflage crystalline temples and harvest node energy?',
    options: [
      {
        label: 'A',
        text: 'They published temple maps in every school and banned all stone construction over ley lines.',
        isCorrect: false,
        rationale:
          'Overlays hid temples; Freemasons built heavy stone over temple footprints to cap and harvest energy.',
      },
      {
        label: 'B',
        text: 'Only weather fog hid temples; no Niberian tech, no Freemasons, and no energy capping occurred.',
        isCorrect: false,
        rationale:
          'Overlays from fake stars in Black Void Plasma (Niberian tech) plus Freemason capping structures.',
      },
      {
        label: 'C',
        text: 'Overlays from fake stars in the Black Void Plasma firmament (Niberian tech) hid ultra-high-frequency crystalline temples; Freemasons built drab heavy stone over the temple footprints to cap and harvest electromagnetic energy from Ley Lines and crystalline lattice networks.',
        isCorrect: true,
        rationale:
          'Niberian overlay tech hides temples; Freemason stone caps harvest node/ley energy.',
      },
      {
        label: 'D',
        text: 'Crystalline temples were never real; only Freemason stone was original architecture of the plain.',
        isCorrect: false,
        rationale:
          'Indestructible crystalline temples on Earth\'s Nodes were obscured and capped, not nonexistent.',
      },
    ],
    hint: 'Niberian overlays hide temples; Freemason stone caps ley/crystalline energy.',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question: 'What is the Moon system in the parasitic architecture?',
    options: [
      {
        label: 'A',
        text: 'A pure natural satellite with no station, no loosh harvest, and no frequency broadcast role.',
        isCorrect: false,
        rationale:
          'It is a holographic cover over a negative ET command and control space station.',
      },
      {
        label: 'B',
        text: 'A localized holographic generator covering a negative ET command and control space station, manned by Grey ETs and German breakaway blondes, phasing in and out to harvest Loosh, monitor Black Sun banks beneath Mt Meru, and project madness-inducing lunar frequencies (origin of "lunatic").',
        isCorrect: true,
        rationale:
          'Moon = holographic shell over mobile ET station for loosh, Black Sun watch, and lunatic frequencies.',
      },
      {
        label: 'C',
        text: 'Only a romantic light for poetry with no Grey staff and no connection to Mt Meru storage.',
        isCorrect: false,
        rationale:
          'Operational station harvests loosh, monitors Black Sun, and broadcasts disruptive frequencies.',
      },
      {
        label: 'D',
        text: 'A G.A.A. hospital that only heals children and never phases out of the human realm.',
        isCorrect: false,
        rationale:
          'It is a negative command station with Greys and breakaway blondes, not a G.A.A. hospital.',
      },
    ],
    hint: 'Holographic ET station — Greys/blondes — loosh, Black Sun, lunatic frequencies.',
    correctAnswer: 'B',
  },
  {
    number: 21,
    question:
      'How did cyclical Resets and the last reset maintain parasitic control into the modern age?',
    options: [
      {
        label: 'A',
        text: 'Resets never happened; Great Tartary still openly rules with full flat-earth public knowledge.',
        isCorrect: false,
        rationale:
          'Cyclical cullings farm population; latest reset ended late 19th century with Tartary\'s destruction.',
      },
      {
        label: 'B',
        text: 'Only peaceful elections repopulated Earth with no WW1, no orphans, and no memory wipe of the old world.',
        isCorrect: false,
        rationale:
          'WW1 exterminated memory-holders; Orphan Trains seeded compliant NPC-heavy society.',
      },
      {
        label: 'C',
        text: 'Planetary cullings (Resets) farm population and erase progress; latest reset ended late 19th century with destruction of Great Tartary; WW1 killed survivors who remembered flat earth and herbal truth; repopulation used genetically modified clones and orphans via Orphan Trains for a compliant NPC-heavy society.',
        isCorrect: true,
        rationale:
          'Resets + Tartary fall + WW1 memory purge + Orphan Trains = modern compliant NPC matrix.',
      },
      {
        label: 'D',
        text: 'Orphan Trains only delivered free education about Spirit Tree power with no cloning agenda.',
        isCorrect: false,
        rationale:
          'Orphan Trains distributed clones/orphans to seed deep compliance after the reset cullings.',
      },
    ],
    hint: 'Resets → Tartary destroyed → WW1 memory kill → Orphan Trains / clones.',
    correctAnswer: 'C',
  },
  {
    number: 22,
    question:
      'What 2019 breakthrough and media twist mark the Awakening counter-offensive?',
    options: [
      {
        label: 'A',
        text: 'The Amnesia Vortex was strengthened so children never remember missions or sacrificial trauma.',
        isCorrect: false,
        rationale:
          'Amnesia Vortex was dismantled in 2019; children retain past-life memories and mission recall.',
      },
      {
        label: 'B',
        text: 'Social media stayed 100% Cabal-owned with zero G.A.A. truth distribution worldwide.',
        isCorrect: false,
        rationale:
          'Social media, built as Cabal control, was co-opted by G.A.A. for global truth dissemination.',
      },
      {
        label: 'C',
        text: 'Nothing changed in 2019; no child retains past-life memory and no vortex was dismantled.',
        isCorrect: false,
        rationale:
          '2019 vortex dismantling explains children\'s past-life memory and "monster nightmare" recall.',
      },
      {
        label: 'D',
        text: 'Social media was co-opted by the G.A.A. for global truth; the Amnesia Vortex was dismantled in 2019 so children retain past-life memories of missions and parasitic sacrifice traumas ("monster nightmares").',
        isCorrect: true,
        rationale:
          'G.A.A. hijacked social media for truth; 2019 vortex removal lets children remember.',
      },
    ],
    hint: 'G.A.A. co-opts social media; 2019 Amnesia Vortex dismantled.',
    correctAnswer: 'D',
  },
  {
    number: 23,
    question:
      'What are the Three Strings the Awakening demands individuals sever?',
    options: [
      {
        label: 'A',
        text: 'Cooking, fashion, and sports as the only pillars of matrix imprisonment.',
        isCorrect: false,
        rationale:
          'The three strings are Religion, Finance, and Perceived Knowledge.',
      },
      {
        label: 'B',
        text: 'Religion (worshipping false parasitic deities/Satan), Finance (chasing fabricated monetary value), and Perceived Knowledge (defending Freemason-engineered academic and scientific lies).',
        isCorrect: true,
        rationale:
          'Religion, Finance, and Perceived Knowledge are the three matrix strings to sever.',
      },
      {
        label: 'C',
        text: 'Only military draft law, with no temples, banks, schools, or Freemason science involved.',
        isCorrect: false,
        rationale:
          'Psychological lock uses religion, fake money, and false academic/scientific knowledge.',
      },
      {
        label: 'D',
        text: 'Pure love, free energy, and open Ice Wall exploration as the binding prison strings.',
        isCorrect: false,
        rationale:
          'Those liberate; the binding strings are religion, finance, and perceived knowledge.',
      },
    ],
    hint: 'Religion — Finance — Perceived Knowledge.',
    correctAnswer: 'B',
  },
  {
    number: 24,
    question:
      'What happens to the parasites\' 8th Reset agenda, and what does the G.A.A. run instead?',
    options: [
      {
        label: 'A',
        text: 'The 8th Reset fully succeeds with 15-minute cities, social credit, forced vaccinations, and FEMA slaughter unopposed forever.',
        isCorrect: false,
        rationale:
          'That agenda has been intercepted and neutralized; G.A.A. runs Blue Beam invasion theater instead.',
      },
      {
        label: 'B',
        text: 'Nothing sky-related occurs; the projection dome stays on and no pixelation ever appears.',
        isCorrect: false,
        rationale:
          'Fake Alien Invasion via Blue Beam; dome switched off; bright white void and pixelation exposed.',
      },
      {
        label: 'C',
        text: '8th Reset (15-minute cities, social credit, forced vaccinations, FEMA slaughter) is intercepted and neutralized; G.A.A. executes Fake Alien Invasion via Project Blue Beam, switches off the false projection dome, exposes the bright white void, and causes immense pixelation of the simulated environment.',
        isCorrect: true,
        rationale:
          'Parasite 8th Reset blocked; G.A.A. Blue Beam + dome death + white void pixelation sequence runs.',
      },
      {
        label: 'D',
        text: 'G.A.A. installs a stronger 8th Reset so NPCs inherit the Earth without any flash or dome event.',
        isCorrect: false,
        rationale:
          'G.A.A. neutralizes the 8th Reset and runs Blue Beam / dome-off reveal instead.',
      },
    ],
    hint: '8th Reset neutralized — Blue Beam — dome off — white void pixelation.',
    correctAnswer: 'C',
  },
  {
    number: 25,
    question:
      'What does the 30-second EMF Flash do to the population, and who remains?',
    options: [
      {
        label: 'A',
        text: 'Upgrades every NPC into full organic 12th-density status automatically with no evaporation.',
        isCorrect: false,
        rationale:
          '97% NPCs, clones, and synthetics instantly evaporate into the aether after the flash.',
      },
      {
        label: 'B',
        text: 'A blinding 30-second electromagnetic burst; 97% NPCs, clones, and synthetics evaporate into the aether; religious devout and 3rd-density-tethered may perish from shock; maximum of only 520 million genuine Taran and ET souls remain with 178,000 years of memories returned, ready to rebuild with cosmic soul families.',
        isCorrect: true,
        rationale:
          'EMF flash clears synthetics; ~520 million genuine souls remain with full memory return.',
      },
      {
        label: 'C',
        text: 'Only turns off streetlights for one night while billions of NPCs remain in place forever.',
        isCorrect: false,
        rationale:
          'Flash evaporates the synthetic 97% and returns 178,000 years of memory to survivors.',
      },
      {
        label: 'D',
        text: 'Kills only genuine Tarans and leaves every NPC to rule the pixelated plain alone.',
        isCorrect: false,
        rationale:
          'Genuine Taran and ET souls remain; NPCs/clones/synthetics evaporate.',
      },
    ],
    hint: '30-second EMF — 97% evaporate — max 520 million remain — 178,000 years return.',
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
  const rot = ((q.number * 7) + 3) % 4;
  const ordered = mapped.slice(rot).concat(mapped.slice(0, rot));
  const finalized = finalizeOptions(
    ordered,
    `${typeof TOPIC_ID !== 'undefined' ? TOPIC_ID : 'quiz'}::${q.number}:v2`
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
  'Test your grasp of The Parasitic Takeover — Custodian betrayal, Spirit Tree strike, Density Suppression, proxy races, Homo Sapiens vessel, Resets, and the G.A.A. EMF liberation.';
const DESC_META =
  'Interactive Living Truth Quiz on The Parasitic Takeover: 178,000-year invasion, Maitrax Spirit Tree destruction, Amnesia Vortex, Loosh and Adrenochrome, NPCs, Orphan Trains, Three Strings, Blue Beam, and the 30-second EMF flash.';

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
      'The Parasitic Takeover is not evolution — it is Custodian betrayal: Spirit Tree cut, density crushed to 3rd, proxy races unleashed, and Homo Sapiens built as a loosh and Adrenochrome farm. Frequency Fences, Amnesia Vortex, Moon station, Resets, Tartary\'s fall, Orphan Trains — that is the occupation. Sit with what you missed, then return to The Parasitic Takeover deep-dive. The Great Spiritual Awakening is the uninstall. Sever Religion, Finance, and Perceived Knowledge. The 8th Reset is already dead. Blue Beam, dome death, white void, 30-second EMF flash — synthetics evaporate, up to 520 million genuine souls remain, and 178,000 years come home. Hold as a Taran. The prison ends.',
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
      "  { path: '/quiz/alice/sol-soul-portal.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/sun-and-moon.html', priority: '0.75', changefreq: 'monthly' },",
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
console.log('PASS: audited 25/25 against data/alice-topics/parasitic-takeover.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
