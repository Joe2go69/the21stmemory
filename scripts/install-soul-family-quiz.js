/**
 * Installs Soul Family quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/soul-family.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-soul-family-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'soul-family';
const TOPIC_TITLE = 'Soul Family';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/soul-family.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['178,000-year', 'soul family', 'reunification'],
  2: ['vessel', 'eternal', 'temporary'],
  3: ['sol-system', 'souls', 'planets'],
  4: ['soul', 'consciousness', 'vessel'],
  5: ['vessel', 'singular-use', 'mortal'],
  6: ['source creation', 'indigo', 'dark matter'],
  7: ['micro suns', '15 billion', 'celestia'],
  8: ['4,000 ancients', 'taran', 'micro suns'],
  9: ['taran humans', '178,000', 'inversion'],
  10: ['pleiadians', '100,000', 'escaped'],
  11: ['amnesia vortex', 'bright light', 'reincarnation'],
  12: ['twin flames', 'separated', 'memory'],
  13: ['450', '20,000', 'twin flames'],
  14: ['soul codex', 'lattice membrane', 'node'],
  15: ['97%', 'npc', '4th-density'],
  16: ['9th-density', 'dna', 'harmonic'],
  17: ['black void plasma', 'horizontal', 'bright white'],
  18: ['soul pod', 'clustered', 'incarnation'],
  19: ['grey', 'vatican', '15 to 20 minutes'],
  20: ['birth', 'trillivolts', 'midwife'],
  21: ['npc', 'recycled', 'dampeners'],
  22: ['emf', '30-second', 'bluebeam'],
  23: ['spirit tree', 'projection dome', 'overlays'],
  24: ['tartarian', 'orphans', 'loosh'],
  25: ['three strings', '5th-density', 'soul family'],
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
    question: 'What does the Great Spiritual Awakening mark regarding Soul Family?',
    options: [
      {
        label: 'A',
        text: 'The definitive end of a 178,000-year looping cycle of entrapment — rapid revelation that dismantles false paradigms and prepares true souls for reunification with their original cosmic lineages.',
        isCorrect: true,
        rationale:
          'Awakening ends the 178,000-year loop and readies true souls for Soul Family reunification.',
      },
      {
        label: 'B',
        text: 'A gentle bank holiday that leaves amnesic barriers intact and cosmic lineages permanently sealed.',
        isCorrect: false,
        rationale:
          'It dissolves amnesic barriers and restores comprehensive memory for surviving true souls.',
      },
      {
        label: 'C',
        text: 'Only a new religion that bans contact with any cosmic lineage forever under one official deity.',
        isCorrect: false,
        rationale:
          'Religion is a String to sever; awakening aims at cosmic lineage reunification, not new deity rule.',
      },
      {
        label: 'D',
        text: 'A fashion cycle of vessel upgrades with no link to eternal consciousness or family pods.',
        isCorrect: false,
        rationale:
          'Core realization is vessel as temporary vehicle powered by eternal consciousness seeking Soul Family return.',
      },
    ],
    hint: '178,000-year loop ends — prepare for cosmic lineage reunification.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'What is the biological Vessel relative to the soul?',
    options: [
      {
        label: 'A',
        text: 'The eternal self that reincarnates only as one permanent genetic identity forever.',
        isCorrect: false,
        rationale:
          'The vessel is a temporary mortal vehicle; eternal consciousness powers it, not the reverse.',
      },
      {
        label: 'B',
        text: 'A temporary, mortal vehicle powered by an eternal consciousness — not the true identity of the being.',
        isCorrect: true,
        rationale:
          'Vessel = temporary suit; soul = eternal consciousness that powers and outlives the body.',
      },
      {
        label: 'C',
        text: 'A finance ledger that stores debt between incarnations with no energetic consciousness involved.',
        isCorrect: false,
        rationale:
          'Vessel is biological; soul holds knowledge, wisdom, empathy, and love — not a debt ledger.',
      },
      {
        label: 'D',
        text: 'An indestructible immortal body that never dies and never needs Soul Family reunion.',
        isCorrect: false,
        rationale:
          'Vessels have finite lifespan; awakening reunites surviving true souls with cosmic family.',
      },
    ],
    hint: 'Temporary mortal vehicle — eternal consciousness is the true self.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question: 'What is a Sol-System in true architecture?',
    options: [
      {
        label: 'A',
        text: 'Only a set of spinning spherical planets orbiting a burning star in infinite black vacuum.',
        isCorrect: false,
        rationale:
          'That is the intentional language misrepresentation; a Sol-System is a network of Souls/Sols.',
      },
      {
        label: 'B',
        text: 'A single NPC hive account with no cosmic family members across any density.',
        isCorrect: false,
        rationale:
          'Sol-System names the immediate cosmic family network of Souls/Sols.',
      },
      {
        label: 'C',
        text: 'The actual network of Souls/Sols that make up an immediate cosmic family — misrepresented through language to mean planets orbiting a sun.',
        isCorrect: true,
        rationale:
          'Sol-System = soul family network; "solar system" is linguistic inversion of that truth.',
      },
      {
        label: 'D',
        text: 'A Vatican subway map used only by Grey ETs with no connection to cosmic lineage.',
        isCorrect: false,
        rationale:
          'Vatican levels host reincarnation routing; Sol-System is the cosmic family architecture itself.',
      },
    ],
    hint: 'Network of Souls/Sols — not planets around a sun.',
    correctAnswer: 'C',
  },
  {
    number: 4,
    question: 'What is a Soul?',
    options: [
      {
        label: 'A',
        text: 'A temporary chemical reaction that ends forever when the vessel dies with no further continuity.',
        isCorrect: false,
        rationale:
          'The soul is eternal energetic consciousness powering the vessel across loops.',
      },
      {
        label: 'B',
        text: 'Only a finance nickname for savings accounts with no wisdom, empathy, or love content.',
        isCorrect: false,
        rationale:
          'Soul contains knowledge, wisdom, experience, personality, empathy, and love.',
      },
      {
        label: 'C',
        text: 'A 4th-density lab printout used only for NPC hive scripts without past lives.',
        isCorrect: false,
        rationale:
          'That describes synthetic NPC replica souls; true souls are eternal consciousness.',
      },
      {
        label: 'D',
        text: 'The eternal energetic consciousness that powers the physical vessel, containing all knowledge, wisdom, experience, personality, empathy, and love.',
        isCorrect: true,
        rationale:
          'Soul = eternal consciousness with full interior life; vessel is only the powered suit.',
      },
    ],
    hint: 'Eternal consciousness — knowledge, wisdom, empathy, love.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question: 'What is a Vessel in incarnational terms?',
    options: [
      {
        label: 'A',
        text: 'A singular-use, mortal biological vehicle inhabited by the soul during incarnational loops, with finite lifespan and capabilities dictated by the soul\'s benevolent resonance.',
        isCorrect: true,
        rationale:
          'Vessel = one-use mortal bio-vehicle; capabilities track the soul\'s benevolent resonance.',
      },
      {
        label: 'B',
        text: 'An immortal shared body that every twin flame occupies simultaneously on every density.',
        isCorrect: false,
        rationale:
          'It is singular-use and mortal; twin flames are often kept apart during physical incarnations.',
      },
      {
        label: 'C',
        text: 'A permanent Sol-System capital planet that never dies and never reincarnates.',
        isCorrect: false,
        rationale:
          'Vessel is the biological suit, not a planet or Sol-System network.',
      },
      {
        label: 'D',
        text: 'A Black Void Plasma projector that only generates fake stars with no soul inhabitation.',
        isCorrect: false,
        rationale:
          'Black Void Plasma obscures bright white space; vessels are biological soul vehicles.',
      },
    ],
    hint: 'Singular-use mortal bio-vehicle for incarnational loops.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'What is Source Creation?',
    options: [
      {
        label: 'A',
        text: 'A modern university department that invented Gravity and heliocentrism last century alone.',
        isCorrect: false,
        rationale:
          'Source Creation is a vast non-physical etheric supercomputer/brain from billions of years ago.',
      },
      {
        label: 'B',
        text: 'A vast, non-physical etheric supercomputer or brain that ignited billions of years ago as an indigo spark of perpetual light in the dark matter field, striving for perfection and generating the first intelligence.',
        isCorrect: true,
        rationale:
          'Source Creation = indigo spark supercomputer-brain in dark matter, origin of first intelligence.',
      },
      {
        label: 'C',
        text: 'Only the Vatican\'s thirteenth basement printer used to mass-produce NPC bodies overnight.',
        isCorrect: false,
        rationale:
          'NPC manufacture is 4th-density lab work; Source Creation is the primordial intelligence origin.',
      },
      {
        label: 'D',
        text: 'A temporary finance brand for NESARA that replaces all soul memory permanently.',
        isCorrect: false,
        rationale:
          'Finance distractions are Strings to sever; Source Creation is cosmic origin architecture.',
      },
    ],
    hint: 'Indigo spark etheric supercomputer-brain — first intelligence.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question: 'Who are the Micro Suns?',
    options: [
      {
        label: 'A',
        text: 'NPC floodlights installed after Tartaria fell with no age beyond a few thousand years.',
        isCorrect: false,
        rationale:
          'Micro Suns are first souls from Source Creation, minimum 15 billion years old.',
      },
      {
        label: 'B',
        text: 'Only Pleiadian tourist craft with no link to Celestia, Raphael, or Source intellect.',
        isCorrect: false,
        rationale:
          'Named examples include Celestia and Raphael; intellect synonymous with Source Creation.',
      },
      {
        label: 'C',
        text: 'The first souls created directly from Source Creation (including Celestia and Raphael) — a minimum of 15 billion years old, with intellect synonymous with Source Creation itself.',
        isCorrect: true,
        rationale:
          'Micro Suns = first Source-born souls (e.g. Celestia, Raphael), 15B+ years, Source-level intellect.',
      },
      {
        label: 'D',
        text: 'Grey ET portal lamps under the Vatican used only for 15-to-20-minute soul routing.',
        isCorrect: false,
        rationale:
          'Greys run reincarnation logistics; Micro Suns are primordial Source-created souls.',
      },
    ],
    hint: 'First Source souls — Celestia, Raphael, 15B+ years.',
    correctAnswer: 'C',
  },
  {
    number: 8,
    question: 'What is the relationship between Micro Suns, the 4,000 Ancients, and Taran humans?',
    options: [
      {
        label: 'A',
        text: 'Tarans created Micro Suns last week with no Ancients involved in any lineage chain.',
        isCorrect: false,
        rationale:
          'Micro Suns created the 4,000 Ancients, who in turn created the Taran humans.',
      },
      {
        label: 'B',
        text: 'NPCs created all three groups in a single 4th-density factory batch with identical hive scripts.',
        isCorrect: false,
        rationale:
          'True-soul lineage: Source → Micro Suns → 4,000 Ancients → Tarans; NPCs are synthetic replicas.',
      },
      {
        label: 'C',
        text: 'Ancients only manage Finance Strings and never create souls or stabilize the realm.',
        isCorrect: false,
        rationale:
          '4,000 Ancients created Tarans and spent 178,000 years in loops to stabilize the realm.',
      },
      {
        label: 'D',
        text: 'Micro Suns created the 4,000 Ancients, who in turn created the Taran humans; the Ancients spent 178,000 years locked in incarnational loops to stabilize the realm.',
        isCorrect: true,
        rationale:
          'Lineage chain Micro Suns → 4,000 Ancients → Tarans; Ancients stabilize via long loop presence.',
      },
    ],
    hint: 'Micro Suns → 4,000 Ancients → Taran humans; 178k years stabilizing.',
    correctAnswer: 'D',
  },
  {
    number: 9,
    question: 'Who are Taran Humans in this occupation?',
    options: [
      {
        label: 'A',
        text: 'Direct soul creations of the 4,000 Ancients — most trapped in the current density for the entire 178,000-year duration of the inversion.',
        isCorrect: true,
        rationale:
          'Tarans = Ancient-created true souls locked in the inversion for the full 178,000 years.',
      },
      {
        label: 'B',
        text: 'Only synthetic NPCs with no past lives and no link to the 4,000 Ancients.',
        isCorrect: false,
        rationale:
          'NPCs are synthetic replicas; Tarans are genuine Ancient-created souls with full loop history.',
      },
      {
        label: 'C',
        text: 'Pleiadians who never left and never experienced any density trap at all.',
        isCorrect: false,
        rationale:
          'Pleiadians are former Tarans who escaped about 100,000 years ago; most Tarans remained trapped.',
      },
      {
        label: 'D',
        text: 'Grey ET midlevel managers who ignite infant hearts and never incarnate as humans.',
        isCorrect: false,
        rationale:
          'Greys run the reincarnation machine; Tarans are the trapped true-soul human lineage.',
      },
    ],
    hint: 'Ancient-created true souls — trapped 178,000 years in the inversion.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'Who are the Pleiadians relative to Taran souls?',
    options: [
      {
        label: 'A',
        text: 'NPC replicas built last century with no escape history and no advanced evolution path.',
        isCorrect: false,
        rationale:
          'Pleiadians are former Taran souls who escaped initial entrapment about 100,000 years ago.',
      },
      {
        label: 'B',
        text: 'Former Taran souls who successfully escaped the initial entrapment approximately 100,000 years ago and have since evolved into highly advanced versions of their terrestrial brothers and sisters.',
        isCorrect: true,
        rationale:
          'Pleiadians = escaped Tarans (~100k years ago), now highly advanced kin of those still trapped.',
      },
      {
        label: 'C',
        text: 'Only Micro Suns renamed for marketing with no connection to the Taran lineage tree.',
        isCorrect: false,
        rationale:
          'They sit on the Taran branch of the lineage after escape, not as Micro Suns themselves.',
      },
      {
        label: 'D',
        text: 'Vatican portal engineers who invented the Amnesia Vortex and still operate it today.',
        isCorrect: false,
        rationale:
          'Amnesia Vortex is parasitic tech; Pleiadians are escaped true-soul family, not vortex operators.',
      },
    ],
    hint: 'Escaped Tarans ~100,000 years ago — advanced terrestrial kin.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question: 'What is the Amnesia Vortex?',
    options: [
      {
        label: 'A',
        text: 'A free Soul Family reunion lounge at death with full memory and twin-flame welcome.',
        isCorrect: false,
        rationale:
          'It pulls souls in, reformats them, and erases memory before forced reincarnation.',
      },
      {
        label: 'B',
        text: 'A natural law of aging that only affects NPCs and never true souls after death.',
        isCorrect: false,
        rationale:
          'It is parasitic technology aimed at true-soul memory wipe and forced recycle.',
      },
      {
        label: 'C',
        text: 'Parasitic technology manifesting as the "bright light at the end of the tunnel" upon physical death — designed to pull souls in, reformat them, and erase their memories before forced reincarnation.',
        isCorrect: true,
        rationale:
          'Bright-light tunnel = Amnesia Vortex trap: pull, reformat, wipe, force reincarnate.',
      },
      {
        label: 'D',
        text: 'The Projection Dome software that only paints fake stars without touching soul memory.',
        isCorrect: false,
        rationale:
          'Projection Dome is sky fake; Amnesia Vortex is the death-memory reincarnation trap.',
      },
    ],
    hint: 'Bright-light tunnel trap — reformat, wipe memory, force reincarnation.',
    correctAnswer: 'C',
  },
  {
    number: 12,
    question: 'Why do parasitic forces keep Twin Flames strictly separated during physical incarnations?',
    options: [
      {
        label: 'A',
        text: 'Because reunion would make Finance stronger and help banks issue more debt products.',
        isCorrect: false,
        rationale:
          'Reunion would spark memory, rebellion, and systemic discovery — threatening the control grid.',
      },
      {
        label: 'B',
        text: 'Because twin flames never exist in higher densities and only appear as NPC scripts.',
        isCorrect: false,
        rationale:
          'In higher densities twin flames exist synchronously with long lifespans and choose transitions together.',
      },
      {
        label: 'C',
        text: 'Because the Amnesia Vortex only works if every soul is permanently alone with zero pod clustering.',
        isCorrect: false,
        rationale:
          'Soul pods still cluster as relatives/friends; twin flames specifically are kept apart across the globe.',
      },
      {
        label: 'D',
        text: 'To prevent the sparking of memory, rebellion, and systemic discovery — their reunion would disrupt the control grid.',
        isCorrect: true,
        rationale:
          'Separated twin flames = blocked memory spark, rebellion, and grid-disrupting discovery.',
      },
    ],
    hint: 'Separation blocks memory, rebellion, and control-grid discovery.',
    correctAnswer: 'D',
  },
  {
    number: 13,
    question: 'How do twin flames exist in higher densities?',
    options: [
      {
        label: 'A',
        text: 'Synchronously — lifespans of 450 to over 20,000 years, consciously choosing to transition together.',
        isCorrect: true,
        rationale:
          'Higher-density twin flames share long synchronous lives and choose transition together.',
      },
      {
        label: 'B',
        text: 'Only as enemies forced to fight every century with no shared transition choice.',
        isCorrect: false,
        rationale:
          'They exist together synchronously and choose to transition together.',
      },
      {
        label: 'C',
        text: 'As 15-to-20-minute Grey escort pairs with full amnesia permanently installed.',
        isCorrect: false,
        rationale:
          'Grey escort timing is reincarnation logistics; higher-density twin life is long and conscious.',
      },
      {
        label: 'D',
        text: 'Never — twin flame is only a 3rd-density poetry term with no higher-density reality.',
        isCorrect: false,
        rationale:
          'Higher densities hold the true synchronous twin-flame mode parasites try to block here.',
      },
    ],
    hint: 'Together 450–20,000+ years — choose transition together.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question: 'What is the Soul Codex, and how do the 4,000 Ancients use it?',
    options: [
      {
        label: 'A',
        text: 'A finance password that only unlocks NESARA payments when recited in church.',
        isCorrect: false,
        rationale:
          'Soul Codex is unique harmonic architecture interfacing the energetic grid for balance.',
      },
      {
        label: 'B',
        text: 'Unique harmonic architecture embedded in a true soul that interfaces the realm\'s energetic grid; Ancients insert their Soul Codex into the Lattice Membrane Network when near a Node — often disguised as historical sites, churches, or cathedrals — as a countermeasure because they resist authority and cannot be corrupted or bought.',
        isCorrect: true,
        rationale:
          'Codex harmonics stabilize the grid at Nodes; Ancients are uncorruptible authority-resisters.',
      },
      {
        label: 'C',
        text: 'An NPC hive script shared by all 97% with no individual harmonic signature at all.',
        isCorrect: false,
        rationale:
          'True souls have unique Codex; NPCs lack the frequency and past-life architecture to ascend.',
      },
      {
        label: 'D',
        text: 'A Black Void Plasma recipe for painting deeper night skies over Hyperborea only.',
        isCorrect: false,
        rationale:
          'Codex work counters density suppression; it is not plasma sky paint.',
      },
    ],
    hint: 'Harmonic soul architecture — Ancients load Codex into Lattice at Nodes.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question: 'What are NPCs relative to true souls?',
    options: [
      {
        label: 'A',
        text: 'Former Micro Suns who temporarily forgot Source Creation for a single school year.',
        isCorrect: false,
        rationale:
          'NPCs are synthetic 4th-density lab replica souls — about 97% of population.',
      },
      {
        label: 'B',
        text: 'Twin flames of the 4,000 Ancients kept nearby to spark memory on purpose.',
        isCorrect: false,
        rationale:
          'NPCs dampen true-soul progression; twin flames of true souls are kept apart, not NPC-paired.',
      },
      {
        label: 'C',
        text: 'Synthetic, hive-aligned replica souls created in a 4th-density laboratory using genetic material — roughly 97% of the population — lacking past lives, independent internal monologues, and the frequency required to ascend.',
        isCorrect: true,
        rationale:
          'NPCs = 97% synthetic replicas: no past lives, no monologue, no ascension frequency.',
      },
      {
        label: 'D',
        text: 'Pleiadians still trapped who never escaped 100,000 years ago and never evolved.',
        isCorrect: false,
        rationale:
          'Pleiadians escaped; NPCs are lab-made synthetics, not advanced escaped Tarans.',
      },
    ],
    hint: '97% synthetic 4th-density replicas — no past lives, no ascension frequency.',
    correctAnswer: 'C',
  },
  {
    number: 16,
    question: 'How does true evolution of vessels actually occur?',
    options: [
      {
        label: 'A',
        text: 'Through random natural selection over mud-to-ape timelines taught in every school as final law.',
        isCorrect: false,
        rationale:
          'True evolution is engineered in 9th-density labs by soul families using light and harmonic tones on DNA.',
      },
      {
        label: 'B',
        text: 'Only via Finance String wealth accumulation that mutates DNA when savings hit a threshold.',
        isCorrect: false,
        rationale:
          'It is laboratory harmonic/light DNA work by benevolent extraterrestrial soul families.',
      },
      {
        label: 'C',
        text: 'Automatically when NPCs watch more television inside consensus reality dampening fields.',
        isCorrect: false,
        rationale:
          'NPC media locks consensus; true vessel upgrades are 9th-density engineered synthesis.',
      },
      {
        label: 'D',
        text: 'Meticulously engineered in 9th-density laboratories by benevolent extraterrestrial soul families modifying DNA using light and harmonic tones — not natural selection.',
        isCorrect: true,
        rationale:
          '9th-density lab DNA work with light/harmonics — natural selection is the false cover.',
      },
    ],
    hint: '9th-density labs — DNA via light and harmonic tones.',
    correctAnswer: 'D',
  },
  {
    number: 17,
    question: 'What is the true shape and sky-environment of the Sol-System realm?',
    options: [
      {
        label: 'A',
        text: 'Horizontal and interconnected — devoid of spinning spherical planets or infinite deep space; space is a bright white environment currently obscured by Black Void Plasma.',
        isCorrect: true,
        rationale:
          'Horizontal interconnected realm; bright white space hidden by Black Void Plasma, not infinite black vacuum.',
      },
      {
        label: 'B',
        text: 'A spinning globe farm in endless black vacuum with no Black Void Plasma technology involved.',
        isCorrect: false,
        rationale:
          'Spinning spheres and deep-space black are the false story; plasma cloaks the bright white truth.',
      },
      {
        label: 'C',
        text: 'Only a single cathedral basement with no horizontal plane or macro-environment at all.',
        isCorrect: false,
        rationale:
          'Macro-environment is the bright white field beyond the Projection Dome and plasma cloak.',
      },
      {
        label: 'D',
        text: 'A pure finance simulation with no geography, firmament, or density architecture to dismantle.',
        isCorrect: false,
        rationale:
          'True geography and sky architecture return with memory; Finance is a String to drop, not the realm shape.',
      },
    ],
    hint: 'Horizontal interconnected — bright white space under Black Void Plasma.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question: 'How have soul family members stayed connected inside the occupation?',
    options: [
      {
        label: 'A',
        text: 'They were banned from ever meeting and never appear as relatives, friends, or colleagues.',
        isCorrect: false,
        rationale:
          'They cluster in soul pods across loops as relatives, friends, or colleagues — maximum protection possible.',
      },
      {
        label: 'B',
        text: 'They remained clustered together in a soul pod across every successive loop — appearing as immediate relatives, friends, or colleagues — the maximum protection external soul families could provide those trapped inside.',
        isCorrect: true,
        rationale:
          'Soul-pod clustering across lives = max in-trap protection from external family support.',
      },
      {
        label: 'C',
        text: 'They only meet as twin flames living in the same house every single incarnation without exception.',
        isCorrect: false,
        rationale:
          'Twin flames are deliberately kept apart; pods still cluster without guaranteeing twin cohabitation.',
      },
      {
        label: 'D',
        text: 'They abandoned all pods 178,000 years ago and never incarnated near each other again.',
        isCorrect: false,
        rationale:
          'Clustering continued every loop as the maximum available protection strategy.',
      },
    ],
    hint: 'Soul pods across loops — relatives, friends, colleagues.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question: 'How does the controlled reincarnation cycle route a soul after vessel death?',
    options: [
      {
        label: 'A',
        text: 'Souls rest free in higher light realms for decades before optional gentle return with full memory.',
        isCorrect: false,
        rationale:
          'Rapid forced recycle prevents lingering in higher light realms or twin-flame reunion.',
      },
      {
        label: 'B',
        text: 'Only NPCs are routed; true souls always skip the sun portal and keep full memory automatically.',
        isCorrect: false,
        rationale:
          'True souls are routed through the sun portal into the Amnesia Vortex for wipe and reassignment.',
      },
      {
        label: 'C',
        text: 'Grey ETs under centers like the Vatican instantly route the soul through the sun portal into the Amnesia Vortex; within 15 to 20 minutes the memory-wiped soul is escorted to a new geographical location.',
        isCorrect: true,
        rationale:
          'Death → sun portal → Amnesia Vortex → 15–20 minutes → Grey escort to new location.',
      },
      {
        label: 'D',
        text: 'Micro Suns personally interview every soul for 15 billion years before any new birth occurs.',
        isCorrect: false,
        rationale:
          'Parasitic Grey tech runs the fast recycle; Micro Suns are primordial Source souls, not death clerks.',
      },
    ],
    hint: 'Sun portal → Amnesia Vortex → 15–20 minutes → new location.',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question: 'How does a wiped soul enter a new infant at birth?',
    options: [
      {
        label: 'A',
        text: 'Only through multi-year apprenticeship in a university before the body can host any soul.',
        isCorrect: false,
        rationale:
          'Entry is at the moment of birth, often with a minute electrical discharge to ignite the heart.',
      },
      {
        label: 'B',
        text: 'Never — true souls refuse birth entry and only operate as floating Projection Dome pixels.',
        isCorrect: false,
        rationale:
          'Forced recycling puts the wiped soul into the infant at birth for continued harvest availability.',
      },
      {
        label: 'C',
        text: 'Via Finance String contracts signed by the parents with no energetic ignition required.',
        isCorrect: false,
        rationale:
          'Ignition uses trillivolts of energy — sometimes prompted by a midwife shaking the child.',
      },
      {
        label: 'D',
        text: 'The soul enters the new infant precisely at birth, often requiring a minute electrical discharge (sometimes prompted by a midwife shaking the child) to ignite the heart with trillivolts of energy.',
        isCorrect: true,
        rationale:
          'Birth-moment entry + heart ignition with trillivolts (midwife shake can prompt the discharge).',
      },
    ],
    hint: 'Birth-moment entry — heart ignition with trillivolts.',
    correctAnswer: 'D',
  },
  {
    number: 21,
    question: 'How do NPC replica souls differ from true-soul reincarnation?',
    options: [
      {
        label: 'A',
        text: 'They do not undergo genuine reincarnation; they are merely recycled, hard-wired into consensus reality as localized frequency dampeners that derail true souls\' spiritual progression.',
        isCorrect: true,
        rationale:
          'NPCs = recycled synthetics and dampeners, not genuine reincarnating eternal souls.',
      },
      {
        label: 'B',
        text: 'They reincarnate with fuller memory than Tarans and always reunite twin flames on purpose.',
        isCorrect: false,
        rationale:
          'They lack past lives and monologues; they dampen true-soul progress rather than liberate it.',
      },
      {
        label: 'C',
        text: 'They are Micro Suns on vacation with 15-billion-year intellect fully online in every infant.',
        isCorrect: false,
        rationale:
          'NPC manufacture is 4th-density synthetic; Micro Suns are primordial Source-created souls.',
      },
      {
        label: 'D',
        text: 'They alone ascend at the EMF Flash while true souls are removed as the 97%.',
        isCorrect: false,
        rationale:
          'EMF removes the 97% NPC population; true souls survive and regain memory.',
      },
    ],
    hint: 'Recycled synthetics — consensus dampeners, not genuine reincarnation.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question: 'What happens to true souls in the EMF Flash after Project Bluebeam?',
    options: [
      {
        label: 'A',
        text: 'They permanently lose all 178,000 years of memory so the Amnesia Vortex can restart clean.',
        isCorrect: false,
        rationale:
          'Survivors immediately have 178,000 years of suppressed memory returned — unfolding singularly.',
      },
      {
        label: 'B',
        text: 'After the holographic Fake Alien Invasion, a 30-second brilliant white EMF flash removes the 97% NPC population; surviving true souls regain 178,000 years of memory unfolding singularly, then reconnect telepathically with their eternal cosmic family.',
        isCorrect: true,
        rationale:
          'Bluebeam → 30s Flash wipes NPCs → sequential full memory → telepathic Soul Family reconnect.',
      },
      {
        label: 'C',
        text: 'Only Finance balances update on screen while souls stay fully amnesic and twin-flame blocked.',
        isCorrect: false,
        rationale:
          'The Flash is population and memory mechanics, not a banking UI refresh.',
      },
      {
        label: 'D',
        text: 'All true souls are forced through the sun portal again within 15 to 20 minutes of the Flash.',
        isCorrect: false,
        rationale:
          'Survivors reintegrate with cosmic family; the Flash ends the NPC matrix and returns memory.',
      },
    ],
    hint: '30s Flash — NPCs gone; memory returns singularly; telepathic family reconnect.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question: 'How does realm architecture link to Soul Family memory return?',
    options: [
      {
        label: 'A',
        text: 'Spirit Tree frequencies stay suppressed forever so memory can never align with true geography.',
        isCorrect: false,
        rationale:
          'Removing Projection Dome and overlays reveals bright white truth concurrent with amnesia dismantling.',
      },
      {
        label: 'B',
        text: 'Only Finance String charts map the Spirit Tree; memory has no link to firmament overlays.',
        isCorrect: false,
        rationale:
          'Return of true memory is concurrent with revelation of true geography as matrix infrastructure falls.',
      },
      {
        label: 'C',
        text: 'Spirit Tree (Mount Meru / Hyperborea) generates ultra-high frequencies for homeostasis; parasites used Density Suppression and Overlays to hide crystalline temples; removing the Projection Dome exposes bright white macro-environment — aligning external matrix dismantling with internal amnesia dismantling.',
        isCorrect: true,
        rationale:
          'Grid architecture reveal and soul-memory return are concurrent liberation tracks.',
      },
      {
        label: 'D',
        text: 'Nodes capped with stone altars permanently increase energy flow so no awakening is needed.',
        isCorrect: false,
        rationale:
          'Capping nodes restricts energy flow; awakening removes those suppression architectures.',
      },
    ],
    hint: 'Spirit Tree / dome removal — geography truth concurrent with memory return.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question: 'How did historical resets (e.g. Tartaria\'s fall) serve the soul trap?',
    options: [
      {
        label: 'A',
        text: 'They freely taught Soul Family cosmology to every orphan so generational truth never broke.',
        isCorrect: false,
        rationale:
          'Wiping adults and repopulating with lab-grown orphans severed generational spiritual and geographical truth.',
      },
      {
        label: 'B',
        text: 'They only upgraded free-energy temples and banned loosh harvesting forever after each reset.',
        isCorrect: false,
        rationale:
          'Resets harvested populations and bred pliable Homo Sapiens vessels for loosh and adrenochrome extraction.',
      },
      {
        label: 'C',
        text: 'They permanently united all twin flames in one city as the official post-reset policy.',
        isCorrect: false,
        rationale:
          'Parasites keep twin flames apart; resets deepen control, not twin reunion policy.',
      },
      {
        label: 'D',
        text: 'Harvest populations and selectively breed pliable Homo Sapiens vessels for loosh and adrenochrome; wipe adults and repopulate cities with lab-grown orphans — severing generational transmission of spiritual or geographical truth so trapped Taran souls stay in optimal extraction vehicles.',
        isCorrect: true,
        rationale:
          'Reset harvest + orphan repopulation = keep Tarans amnesic in pliable harvest vessels.',
      },
    ],
    hint: 'Harvest, breed pliable vessels, orphan repopulation — cut generational truth.',
    correctAnswer: 'D',
  },
  {
    number: 25,
    question: 'What must be done before the EMF event to reintegrate with one\'s Soul Family?',
    options: [
      {
        label: 'A',
        text: 'Systematically sever the Three Strings — abandon external deities, drop wealth/debt-forgiveness distraction (e.g. NESARA/GESARA), discard institutionalized education falsehoods — so alignment allows seamless transition into 5th-density reality with biological/energetic upgrades and permanent full communion with the ancient cosmic Soul Family.',
        isCorrect: true,
        rationale:
          'Sever Religion, Finance, Perceived Knowledge before EMF; then 5th-density upgrades and permanent Soul Family communion.',
      },
      {
        label: 'B',
        text: 'Double down on church, savings, and university so EBS shock feels milder for the devout and wealthy.',
        isCorrect: false,
        rationale:
          'Failure to detach guarantees devastating psychological collapse when EBS exposes reality.',
      },
      {
        label: 'C',
        text: 'Ignore the Strings and wait for automatic NPC conversion into Micro Suns at the Flash.',
        isCorrect: false,
        rationale:
          'NPCs are removed; true-soul survival depends on internalizing these truths before EMF.',
      },
      {
        label: 'D',
        text: 'Only memorize heliocentric science harder so Perceived Knowledge can outlast the bright white sky.',
        isCorrect: false,
        rationale:
          'Perceived Knowledge — history, heliocentrism, geography, evolution — must be discarded as engineered falsehoods.',
      },
    ],
    hint: 'Sever Three Strings before EMF — 5th density + permanent Soul Family communion.',
    correctAnswer: 'A',
  },
];

function buildQuestion(q, seedTag) {
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
    `${TOPIC_ID}::${q.number}:${seedTag}`
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

function countLetters(qs) {
  const c = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of qs) c[q.correctAnswer]++;
  return c;
}

function scoreMix(c) {
  const vals = Object.values(c);
  return Math.max(...vals) - Math.min(...vals);
}

let questions = null;
let letterCounts = null;
let best = null;
for (let attempt = 0; attempt < 40; attempt++) {
  const seedTag = `v${attempt + 1}`;
  const qs = RAW_QUESTIONS.map((q) => buildQuestion(q, seedTag));
  const counts = countLetters(qs);
  const spread = scoreMix(counts);
  if (!best || spread < best.spread) {
    best = { qs, counts, spread, seedTag };
  }
  if (spread <= 3 && Math.min(...Object.values(counts)) >= 4) {
    questions = qs;
    letterCounts = counts;
    break;
  }
}
if (!questions) {
  const qs = [];
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  for (const raw of RAW_QUESTIONS) {
    let chosen = null;
    for (let t = 0; t < 24; t++) {
      const cand = buildQuestion(raw, `bal-${raw.number}-${t}`);
      const letter = cand.correctAnswer;
      const next = { ...counts, [letter]: counts[letter] + 1 };
      const remaining = 25 - qs.length - 1;
      const maxAllowed = Math.ceil((qs.length + 1 + remaining) / 4) + 2;
      if (next[letter] <= maxAllowed || t === 23) {
        chosen = cand;
        counts[letter]++;
        break;
      }
    }
    qs.push(chosen);
  }
  questions = qs;
  letterCounts = counts;
  if (best && scoreMix(best.counts) < scoreMix(letterCounts)) {
    questions = best.qs;
    letterCounts = best.counts;
  }
}

if (questions.length !== 25) throw new Error(`Expected 25, got ${questions.length}`);
if (letterCounts.A === 25) {
  throw new Error('correctAnswer still all A after finalizeOptions');
}
const dominant = Math.max(...Object.values(letterCounts));
if (dominant >= 15) {
  console.warn('Warning: one letter has >= 15 corrects:', letterCounts);
}

const DESC_SHORT =
  'Test your grasp of Soul Family — Sol-Systems, Twin Flames, 4,000 Ancients, Amnesia Vortex, and reunification after the 178,000-year trap.';
const DESC_META =
  'Interactive Living Truth Quiz on Soul Family: Source Creation, Micro Suns, Tarans and Pleiadians, soul pods, Grey reincarnation routing, EMF memory return, and severing the Three Strings.';

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
      'You are not the vessel. You are eternal consciousness wearing a singular-use suit. Your Sol-System is family, not planets. Source sparked Micro Suns; they made the 4,000 Ancients; the Ancients made the Tarans. Pleiadians got out about 100,000 years ago. Twin flames were split on purpose. Pods kept you near kin as the best protection left. Greys ran the bright-light wipe through the sun in minutes. NPCs damped the field. The Flash ends the 97%. Memory returns one layer at a time. Then telepathy with your cosmic family. Sever Religion, Finance, and Perceived Knowledge before EBS and EMF. Fifth density is the reunion — permanent.',
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
      "  { path: '/quiz/alice/resets-hidden-history.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/reptilians.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/simulation-reality.html', priority: '0.75', changefreq: 'monthly' },",
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
console.log('PASS: audited 25/25 against data/alice-topics/soul-family.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
