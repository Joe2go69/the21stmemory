/**
 * Installs Reptilians quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/reptilians.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-reptilians-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'reptilians';
const TOPIC_TITLE = 'Reptilians';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/reptilian.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['custodians', '12th-density', 'reptilians', 'omicron', 'alpha draco'],
  2: ['foot-soldiers', 'overlords', '4th-density', 'frequency suppression'],
  3: ['adrenochrome', 'loosh', '4th-density', 'harvesting'],
  4: ['custodians', 'inversion', 'engineered', '4th density'],
  5: ['parasites', 'custodians', 'reptilians', 'greys', 'anuk'],
  6: ['anuk', 'anunnaki', 'grand canyon', 'grey'],
  7: ['bipedal crocodiles', 'shape-shifting', 'brutalization'],
  8: ['niberians', 'black void plasma', 'children'],
  9: ['greys', 'maitrax', 'soul recycling', 'spirit tree'],
  10: ['demons', 'sold souls', 'vatican', 'loosh'],
  11: ['loosh', 'terror', 'trauma', 'suffering'],
  12: ['sold soul', 'key', '4th-density', '3rd-density'],
  13: ['not an evolutionary', 'genetic creation', 'warfare'],
  14: ['4th density', 'kill', 'survive'],
  15: ['kryptonite', 'spirit tree', 'density suppression', '14'],
  16: ['vatican', 'thirteen levels', 'omicron', 'alpha draco'],
  17: ['shape-shifting', 'light-form', 'lower-density'],
  18: ['re-sets', 'flaying', 'loosh', 'front gardens'],
  19: ['sing', 'weave', 'npc', 'replica souls'],
  20: ['amnesia vortex', 'greys', 'reincarnation'],
  21: ['moon', 'dyson-sphere', 'loosh', 'lunatic'],
  22: ['black void plasma', 'tartaria', 'freemasons', 'nodal'],
  23: ['eradicated', 'fake alien invasion', 'project bluebeam', 'holographic'],
  24: ['three strings', 'religion', 'finance', 'perceived knowledge'],
  25: ['33rd-degree', 'freemason', 'flat', 'enclosed'],
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
      'Where do Reptilians come from in the hierarchy of universal negativity?',
    options: [
      {
        label: 'A',
        text: 'Random evolution on a distant rock with no Custodian engineering and no link to other parasites.',
        isCorrect: false,
        rationale:
          'Reptilians were genetically engineered by the Custodians along with Anuk and Greys.',
      },
      {
        label: 'B',
        text: 'The Custodians — originally benevolent 12th-density caretakers who betrayed Source and genetically engineered parasitic species including the Anuk, Greys, and Reptilians (Omicron and Alpha Draco factions).',
        isCorrect: true,
        rationale:
          'Custodian betrayal produced the engineered Reptilian factions as part of the parasitic army.',
      },
      {
        label: 'C',
        text: 'The Galactic Ancestral Alliance alone, built only to free Tarans and never harvest Loosh.',
        isCorrect: false,
        rationale:
          'G.A.A. is not the origin of Reptilians; Custodians engineered them for subjugation.',
      },
      {
        label: 'D',
        text: 'Only modern film studios inventing costumes with no 4th-density operations in the real plain.',
        isCorrect: false,
        rationale:
          'Reptilians are real Custodian-engineered 4th-density parasites, not mere entertainment props.',
      },
    ],
    hint: 'Custodian-engineered — Omicron and Alpha Draco factions.',
    correctAnswer: 'B',
  },
  {
    number: 2,
    question:
      'What role do Reptilians play within the parasitic hierarchy, and what do they require to exist on the plain?',
    options: [
      {
        label: 'A',
        text: 'Gentle healers who raise frequency and need no suppression technology to walk the lands.',
        isCorrect: false,
        rationale:
          'They are brutal foot-soldiers and overlords who need immense frequency suppression to exist.',
      },
      {
        label: 'B',
        text: 'Only distant observers who never act as soldiers or overlords and need no density change.',
        isCorrect: false,
        rationale:
          'They function as brutal foot-soldiers and overlords requiring heavy frequency suppression.',
      },
      {
        label: 'C',
        text: 'Brutal foot-soldiers and overlords within the hierarchy who require immense frequency suppression to even exist within the physical plain.',
        isCorrect: true,
        rationale:
          'Reptilian role = enforcer/overlord; survival on the plain needs massive frequency suppression.',
      },
      {
        label: 'D',
        text: '12th-density caretakers who still serve Source with full high-light manifestation powers intact.',
        isCorrect: false,
        rationale:
          'They operate as low-vibration enforcers under Custodian engineering, not 12th-density caretakers.',
      },
    ],
    hint: 'Foot-soldiers and overlords — need immense frequency suppression.',
    correctAnswer: 'C',
  },
  {
    number: 3,
    question:
      'From what density do these entities operate, and what do they harvest from human souls?',
    options: [
      {
        label: 'A',
        text: 'Strictly from a 4th-density level, orchestrating continuous harvesting of human souls for Adrenochrome and Loosh.',
        isCorrect: true,
        rationale:
          '4th-density operations center on eternal Adrenochrome and Loosh harvest from humans.',
      },
      {
        label: 'B',
        text: 'From 12th density only, freely gifting healing light with no Adrenochrome or Loosh agenda.',
        isCorrect: false,
        rationale:
          'They operate at 4th density and harvest Adrenochrome and Loosh, not gift high-density healing.',
      },
      {
        label: 'C',
        text: 'From 5th density and above, where killing is no longer required for survival at all.',
        isCorrect: false,
        rationale:
          'Parasitic entities are confined to 4th density, where life must kill to survive.',
      },
      {
        label: 'D',
        text: 'From no density at all — pure metaphor with no harvest of any energetic or biological substance.',
        isCorrect: false,
        rationale:
          'They are real 4th-density harvesters of Adrenochrome and Loosh from human vessels.',
      },
    ],
    hint: '4th density — continuous Adrenochrome and Loosh harvest.',
    correctAnswer: 'A',
  },
  {
    number: 4,
    question: 'What are the Custodians relative to Reptilians and other parasites?',
    options: [
      {
        label: 'A',
        text: 'Always-loyal 12th-density servants who never inverted the realms or engineered any negative species.',
        isCorrect: false,
        rationale:
          'Custodians initiated the inversion, fell to 4th density, and engineered all other negative parasitic species.',
      },
      {
        label: 'B',
        text: 'Only modern bankers with no prior caretaker role and no genetic engineering of Reptilians.',
        isCorrect: false,
        rationale:
          'They were original 12th-density caretakers who engineered Reptilians and other parasites.',
      },
      {
        label: 'C',
        text: 'Friendly NPCs making up 97% of the population with no density fall and no invasion plot.',
        isCorrect: false,
        rationale:
          'Custodians are the fallen architect species that created the parasitic army including Reptilians.',
      },
      {
        label: 'D',
        text: 'The original 12th-density caretakers who initiated the inversion, fell to 4th density, and engineered all other negative parasitic species to aid subjugation of humanity.',
        isCorrect: true,
        rationale:
          'Custodians = fallen caretakers who engineered Reptilians and the full parasitic roster.',
      },
    ],
    hint: 'Fallen 12th-density caretakers — engineered all parasitic species.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question: 'What does the collective term Parasites name?',
    options: [
      {
        label: 'A',
        text: 'Only one Grey subspecies with no Custodians, Reptilians, or Anuk included in the word.',
        isCorrect: false,
        rationale:
          'Parasites is the overarching term for Custodians, Reptilians, Greys, Anuk, and related negative species.',
      },
      {
        label: 'B',
        text: 'A collective overarching term for all negative extraterrestrial and interdimensional species — including Custodians, Reptilians, Greys, and Anuk — who rely on human suffering for survival.',
        isCorrect: true,
        rationale:
          'Parasites = umbrella label for the whole suffering-dependent negative ET/interdimensional roster.',
      },
      {
        label: 'C',
        text: 'Only computer viruses with no interdimensional presence and no need for human suffering.',
        isCorrect: false,
        rationale:
          'It names living negative ET and interdimensional species that feed on human suffering.',
      },
      {
        label: 'D',
        text: 'Only G.A.A. rescue teams who liberate souls and never rely on terror or trauma food.',
        isCorrect: false,
        rationale:
          'Parasites rely on human suffering; they are not liberating G.A.A. forces.',
      },
    ],
    hint: 'Umbrella term — Custodians, Reptilians, Greys, Anuk — feed on suffering.',
    correctAnswer: 'B',
  },
  {
    number: 6,
    question: 'What are the Anuk (Anunnaki) relative to Greys and headquarters?',
    options: [
      {
        label: 'A',
        text: 'The last failed species with no headquarters and no role creating any Grey entities.',
        isCorrect: false,
        rationale:
          'Anuk were the first successful negative species; they set Grand Canyon HQ and engineered Greys.',
      },
      {
        label: 'B',
        text: 'Only a poetry nickname for storms with no Grand Canyon base and no Grey engineering role.',
        isCorrect: false,
        rationale:
          'Anuk established headquarters such as the Grand Canyon and engineered the Grey ETs.',
      },
      {
        label: 'C',
        text: 'The first successful negative species created by the Custodians, responsible for establishing headquarters in locations like the Grand Canyon and engineering the Grey ETs.',
        isCorrect: true,
        rationale:
          'Anuk = first successful Custodian proxy — Grand Canyon HQ and Grey creation.',
      },
      {
        label: 'D',
        text: 'Identical to Niberians who freed themselves and never built any physical headquarters.',
        isCorrect: false,
        rationale:
          'Anuk are distinct: first successful created species with bases like Grand Canyon.',
      },
    ],
    hint: 'First successful proxy — Grand Canyon HQ — engineered Greys.',
    correctAnswer: 'C',
  },
  {
    number: 7,
    question:
      'How are Reptilians (Omicron and Alpha Draco) characterized biologically and operationally?',
    options: [
      {
        label: 'A',
        text: 'Tiny insects that never shape-shift and never participate in brutalizing humanity.',
        isCorrect: false,
        rationale:
          'They are massive bipedal crocodiles who shape-shift and brutalize humanity.',
      },
      {
        label: 'B',
        text: 'Massive bipedal crocodiles created by the Custodians who utilize shape-shifting and actively participate in the brutalization of humanity.',
        isCorrect: true,
        rationale:
          'Omicron/Alpha Draco = massive bipedal crocodile form, shape-shift, active brutalization.',
      },
      {
        label: 'C',
        text: 'Pure light beings who only heal children and never take crocodile or hybrid form.',
        isCorrect: false,
        rationale:
          'They are highly negative massive bipedal crocodile species, not pure light healers.',
      },
      {
        label: 'D',
        text: 'Only stone statues in museums with no living shape-shift capability in the field.',
        isCorrect: false,
        rationale:
          'They are living Custodian-created species using shape-shifting in operations.',
      },
    ],
    hint: 'Massive bipedal crocodiles — shape-shifting — brutalization.',
    correctAnswer: 'B',
  },
  {
    number: 8,
    question:
      'How do Niberians differ from Reptilians and other active child-harvesting parasites?',
    options: [
      {
        label: 'A',
        text: 'They are the weakest Custodian slaves who never freed themselves and never touch sky tech.',
        isCorrect: false,
        rationale:
          'Niberians freed themselves from Custodian rule and supply Black Void Plasma sky tech.',
      },
      {
        label: 'B',
        text: 'They only harvest children and never use Black Void Plasma or intellectual warfare systems.',
        isCorrect: false,
        rationale:
          'They do not actively harvest children; they dominate intellectually and fake the night sky.',
      },
      {
        label: 'C',
        text: 'Identical to Omicron in every role, including open flaying of humans during Resets.',
        isCorrect: false,
        rationale:
          'Niberians are distinct: independent, plasma sky tech, not the child-harvest enforcer role.',
      },
      {
        label: 'D',
        text: 'The most powerful and intellectually dominant parasitic species who freed themselves from Custodian rule, utilize Black Void Plasma to fake the night sky, and do not actively harvest children.',
        isCorrect: true,
        rationale:
          'Niberians = independent intellectual power + Black Void Plasma; not child harvesters.',
      },
    ],
    hint: 'Independent — Black Void Plasma sky — do not actively harvest children.',
    correctAnswer: 'D',
  },
  {
    number: 9,
    question: 'What tasks are Greys (Maitrax, Orion Greys, Zetas) assigned?',
    options: [
      {
        label: 'A',
        text: 'Only gardening with no soul recycling, no abductions, no hauntings, and no Spirit Tree role.',
        isCorrect: false,
        rationale:
          'Greys handle soul recycling, abductions, hauntings, and destruction of the central Spirit Tree.',
      },
      {
        label: 'B',
        text: 'Genetically engineered entities tasked with soul recycling, abductions, hauntings, and the destruction of the central Spirit Tree.',
        isCorrect: true,
        rationale:
          'Greys = recycle, abduct, haunt, and kill the Spirit Tree as engineered operators.',
      },
      {
        label: 'C',
        text: 'Permanent rebuilders of Spirit Trees who never abduct humans or process reincarnation.',
        isCorrect: false,
        rationale:
          'They destroyed the Spirit Tree and run soul recycling and abduction systems.',
      },
      {
        label: 'D',
        text: 'Only holographic logos with no Maitrax, Orion, or Zeta operational branches in the field.',
        isCorrect: false,
        rationale:
          'Named Grey factions perform real soul and infrastructure operations for the parasites.',
      },
    ],
    hint: 'Soul recycling, abductions, hauntings, Spirit Tree destruction.',
    correctAnswer: 'B',
  },
  {
    number: 10,
    question: 'What are Demons in relation to Sold Souls and the Vatican?',
    options: [
      {
        label: 'A',
        text: 'Friendly house spirits that need no Loosh and never host in any human vessel.',
        isCorrect: false,
        rationale:
          'Demons are non-physical entities that host in top-tier sold souls and feed exclusively on Loosh.',
      },
      {
        label: 'B',
        text: 'Only movie costumes with no Vatican operations and no feeding on human terror energy.',
        isCorrect: false,
        rationale:
          'They operate heavily out of the Vatican and feed exclusively on Loosh.',
      },
      {
        label: 'C',
        text: 'Non-physical entities that host within top-tier sold souls, feed exclusively on Loosh, and operate heavily out of the Vatican.',
        isCorrect: true,
        rationale:
          'Demons = non-physical Loosh feeders in elite sold-soul hosts, Vatican-centered.',
      },
      {
        label: 'D',
        text: 'Replica Souls that power NPCs with no separate demonic hosting relationship at all.',
        isCorrect: false,
        rationale:
          'Demons are distinct non-physical hosts in sold souls, not mere NPC replica software.',
      },
    ],
    hint: 'Non-physical — sold-soul hosts — exclusive Loosh — Vatican ops.',
    correctAnswer: 'C',
  },
  {
    number: 11,
    question: 'What is Loosh?',
    options: [
      {
        label: 'A',
        text: 'An energetic food source generated through human terror, trauma, and suffering, essential for the survival of Demons and Parasites.',
        isCorrect: true,
        rationale:
          'Loosh is suffering-energy food that Demons and Parasites require to survive.',
      },
      {
        label: 'B',
        text: 'Ordinary rainwater stored in barrels for farming with no link to terror or demonic survival.',
        isCorrect: false,
        rationale:
          'Loosh is energetic food from human terror, trauma, and suffering — not rainwater.',
      },
      {
        label: 'C',
        text: 'A vitamin that raises frequency and permanently ends all parasitic feeding on humanity.',
        isCorrect: false,
        rationale:
          'Loosh is the harvest product of suffering that sustains parasites, not a liberating vitamin.',
      },
      {
        label: 'D',
        text: 'Only digital cryptocurrency with no emotional content and no role feeding Demons.',
        isCorrect: false,
        rationale:
          'It is energetic food from trauma and terror, essential to Demons and Parasites.',
      },
    ],
    hint: 'Energetic food from terror, trauma, and suffering.',
    correctAnswer: 'A',
  },
  {
    number: 12,
    question: 'What is a Sold Soul in the Reptilian/parasite entry system?',
    options: [
      {
        label: 'A',
        text: 'A free Taran who never surrendered autonomy and never serves as any inter-realm key.',
        isCorrect: false,
        rationale:
          'A Sold Soul surrendered energetic autonomy and hosts Demons as a key for parasites.',
      },
      {
        label: 'B',
        text: 'A human vessel that has surrendered its energetic autonomy, acting as a host for Demons and serving as an inter-realm key for 4th-density parasites to enter the 3rd-density simulation.',
        isCorrect: true,
        rationale:
          'Sold Soul = demon host + dimensional key from 4th density into the 3rd-density sim.',
      },
      {
        label: 'C',
        text: 'Only a bank loan contract with no demon host role and no density-boundary function.',
        isCorrect: false,
        rationale:
          'It is energetic surrender enabling demon hosting and 4th-to-3rd density entry.',
      },
      {
        label: 'D',
        text: 'An NPC that upgrades into 12th density automatically without any parasite bargain.',
        isCorrect: false,
        rationale:
          'Sold Souls enable parasite entry; they are not automatic high-density upgrades.',
      },
    ],
    hint: 'Surrendered autonomy — demon host — key for 4th density into 3rd.',
    correctAnswer: 'B',
  },
  {
    number: 13,
    question:
      'Is the existence of Reptilians an evolutionary accident?',
    options: [
      {
        label: 'A',
        text: 'Yes — random evolution produced them with no Custodian plan and no warfare design.',
        isCorrect: false,
        rationale:
          'Existence is deliberate genetic creation for warfare, genetic manipulation, and brutalization.',
      },
      {
        label: 'B',
        text: 'Yes — they appeared only after the EMF flash as friendly cultural exchange partners.',
        isCorrect: false,
        rationale:
          'They were planned for millennia as Custodian enforcers, not post-flash friends.',
      },
      {
        label: 'C',
        text: 'No — it is deliberate genetic creation designed for warfare, genetic manipulation, and the brutalization of Taran Humans; Custodians planned the inversion for millennia and created Omicron and Alpha Draco as enforcers.',
        isCorrect: true,
        rationale:
          'Not evolution: engineered enforcers for inversion warfare and Taran brutalization.',
      },
      {
        label: 'D',
        text: 'They never existed; only textbooks invented them as metaphor for bad weather.',
        isCorrect: false,
        rationale:
          'They are real Custodian-created species designed for war and brutalization.',
      },
    ],
    hint: 'Not evolution — deliberate genetic enforcers for warfare and brutalization.',
    correctAnswer: 'C',
  },
  {
    number: 14,
    question:
      'What defines the 4th density arena where all parasitic entities including Reptilians are confined?',
    options: [
      {
        label: 'A',
        text: 'An arena of pure unconditional love where no being ever kills and frequency only rises.',
        isCorrect: false,
        rationale:
          '4th density is where life must kill other life to survive.',
      },
      {
        label: 'B',
        text: 'Automatic 12th-density graduation for every parasite with no kill-or-survive rule.',
        isCorrect: false,
        rationale:
          'Parasites are confined to 4th density kill-to-survive conditions, not automatic ascent.',
      },
      {
        label: 'C',
        text: 'A density where only plants exist and no predatory or parasitic behavior is possible.',
        isCorrect: false,
        rationale:
          'It is specifically the arena where life must kill other life to survive.',
      },
      {
        label: 'D',
        text: 'An arena where life must kill other life to survive — the density band holding all parasitic entities.',
        isCorrect: true,
        rationale:
          '4th density = kill-to-survive confinement for Reptilians and the full parasitic roster.',
      },
    ],
    hint: '4th density — life must kill other life to survive.',
    correctAnswer: 'D',
  },
  {
    number: 15,
    question:
      'Why did Reptilians mandate destruction of the Spirit Tree (Mt Meru / Hyperborea)?',
    options: [
      {
        label: 'A',
        text: 'Because high vibration makes them violently ill — like a 14-foot tall bipedal crocodile reacting to Kryptonite — so they needed Density Suppression via Spirit Tree destruction to lower frequency and physically step on the lands.',
        isCorrect: true,
        rationale:
          'High frequency is Kryptonite to them; kill Spirit Tree → Density Suppression → occupation possible.',
      },
      {
        label: 'B',
        text: 'Because high frequency strengthens them, so they built extra Spirit Trees to raise density further.',
        isCorrect: false,
        rationale:
          'High vibration makes them violently ill; they destroyed the tree to lower frequency.',
      },
      {
        label: 'C',
        text: 'Because the Spirit Tree was only a wooden decoration with no effect on realm frequency at all.',
        isCorrect: false,
        rationale:
          'Destroying it drastically lowered realm frequency via Density Suppression.',
      },
      {
        label: 'D',
        text: 'Because G.A.A. ordered them to protect the tree and raise every human into 9th density.',
        isCorrect: false,
        rationale:
          'They destroyed the tree to make the plain survivable for low-vibration Reptilian forms.',
      },
    ],
    hint: 'High freq = Kryptonite — destroy Spirit Tree — Density Suppression.',
    correctAnswer: 'A',
  },
  {
    number: 16,
    question:
      'How is the Vatican complex structured for Reptilian and parasite operations?',
    options: [
      {
        label: 'A',
        text: 'A single open plaza with no underground levels, no slaughterhouse role, and no portal hub.',
        isCorrect: false,
        rationale:
          'It extends thirteen levels below ground as slaughterhouse, Adrenochrome warehouse, and portal hub.',
      },
      {
        label: 'B',
        text: 'Thirteen subterranean levels acting as luxury slaughterhouse, Adrenochrome warehouse, and interdimensional portal hub; Omicron and Alpha Draco each controlled their own specific levels within the shared headquarters.',
        isCorrect: true,
        rationale:
          'Vatican underworld = 13 levels of harvest and portals; each Reptilian faction holds dedicated levels.',
      },
      {
        label: 'C',
        text: 'Only a surface church with no shared parasitic headquarters and no faction-specific vaults.',
        isCorrect: false,
        rationale:
          'Parasites share the deep complex; Omicron and Alpha Draco each control specific levels.',
      },
      {
        label: 'D',
        text: 'A G.A.A. free clinic that reverses Adrenochrome harvest and seals every portal permanently.',
        isCorrect: false,
        rationale:
          'It is the shared parasitic HQ for slaughter, storage, and portal control — not a G.A.A. clinic.',
      },
    ],
    hint: '13 levels — slaughter / Adrenochrome / portals — Omicron and Alpha Draco floors.',
    correctAnswer: 'B',
  },
  {
    number: 17,
    question:
      'How does Reptilian Shape-Shifting differ from positive higher-density manifestation?',
    options: [
      {
        label: 'A',
        text: 'It is identical pure light-form manifestation used by 12th-density beings with no lower-density biology involved.',
        isCorrect: false,
        rationale:
          'Shape-shifting is lower-density biological manipulation, fundamentally different from pure light-form manifestation.',
      },
      {
        label: 'B',
        text: 'Reptilians cannot change form at all and only appear as fixed stone idols forever.',
        isCorrect: false,
        rationale:
          'They possess shape-shifting as a biological lower-density manipulation ability.',
      },
      {
        label: 'C',
        text: 'Shape-shifting is lower-density biological manipulation, fundamentally different from the pure light-form manifestation used by positive higher-density beings.',
        isCorrect: true,
        rationale:
          'Reptilian shift = biological low-density trick, not pure high-density light manifestation.',
      },
      {
        label: 'D',
        text: 'Only children can see shape-shifts; adults never encounter any biological form change in the field.',
        isCorrect: false,
        rationale:
          'Shape-shifting is an operational capability of Reptilians interacting with the human population.',
      },
    ],
    hint: 'Lower-density biological shape-shift ≠ pure high-density light-form.',
    correctAnswer: 'C',
  },
  {
    number: 18,
    question:
      'How did Reptilians and demonic ETs operate during historical Re-sets?',
    options: [
      {
        label: 'A',
        text: 'Only through silent paperwork with no open violence and no Loosh generation from terror.',
        isCorrect: false,
        rationale:
          'They operated openly — flaying, raping, and torturing to generate Loosh for demonic counterparts.',
      },
      {
        label: 'B',
        text: 'They stayed hidden underground forever and never appeared in human front gardens during culls.',
        isCorrect: false,
        rationale:
          'They operated openly, including flaying humans alive in front gardens.',
      },
      {
        label: 'C',
        text: 'They only healed survivors and never generated Loosh for any demonic feeding system.',
        isCorrect: false,
        rationale:
          'Open brutalization generated the Loosh needed to feed their demonic counterparts.',
      },
      {
        label: 'D',
        text: 'Openly — directly flaying humans alive in their front gardens, raping, and torturing the populace to generate the Loosh needed to feed their demonic counterparts.',
        isCorrect: true,
        rationale:
          'Re-set operations included open garden flaying and torture for demon Loosh supply.',
      },
    ],
    hint: 'Open Re-set violence — flaying in front gardens — Loosh for Demons.',
    correctAnswer: 'D',
  },
  {
    number: 19,
    question:
      'Why can Reptilians and other Parasites not create true architecture or souls, and what do they use instead?',
    options: [
      {
        label: 'A',
        text: 'Because they exist at sub-Hertz frequency and lack divine ability to create through conscious intention — they cannot sing or weave physical architecture or true souls; they rely on mechanical manufacturing, cloning, and NPCs powered by cheap hive-aligned replica souls.',
        isCorrect: true,
        rationale:
          'Sub-Hz blocks true creation; clones and Replica-Soul NPCs fake a populated society.',
      },
      {
        label: 'B',
        text: 'Because they freely weave true Source souls and never need cloning or NPC fabrication systems.',
        isCorrect: false,
        rationale:
          'They cannot sing/weave true souls; they depend on mechanical manufacture and replica souls.',
      },
      {
        label: 'C',
        text: 'Because Micro Suns gift them unlimited harmonic power so laboratories stay permanently closed.',
        isCorrect: false,
        rationale:
          'They lack divine creative ability and lean on cloning and hive-aligned replica souls.',
      },
      {
        label: 'D',
        text: 'Because they only create animals and plants and never touch human population illusion systems.',
        isCorrect: false,
        rationale:
          'NPC fabrication with replica souls maintains the illusion of a populated functioning society.',
      },
    ],
    hint: 'Cannot sing/weave — cloning and hive-aligned Replica-Soul NPCs.',
    correctAnswer: 'A',
  },
  {
    number: 20,
    question:
      'How does Reptilian survival intersect with the Amnesia Vortex?',
    options: [
      {
        label: 'A',
        text: 'The Vortex frees every soul permanently so Reptilians lose all harvest population forever.',
        isCorrect: false,
        rationale:
          'Amnesia Vortex forces consciousness back into reincarnation immediately upon death.',
      },
      {
        label: 'B',
        text: 'Their survival is linked to the Amnesia Vortex — soul-recycling technology managed by the Greys that forces human consciousness back into the reincarnation loop immediately upon death.',
        isCorrect: true,
        rationale:
          'Grey-run Amnesia Vortex recycles souls so the harvest farm never runs out of vessels.',
      },
      {
        label: 'C',
        text: 'Reptilians personally heal the Vortex and restore every past-life memory at death.',
        isCorrect: false,
        rationale:
          'The Vortex serves parasitic survival by wiping and recycling, not healing memory.',
      },
      {
        label: 'D',
        text: 'There is no link; reincarnation loops are fully natural and untouched by Greys or Reptilians.',
        isCorrect: false,
        rationale:
          'Reptilian-grid survival depends on Grey-managed forced reincarnation via the Vortex.',
      },
    ],
    hint: 'Grey-managed Amnesia Vortex — immediate reincarnation loop for harvest continuity.',
    correctAnswer: 'B',
  },
  {
    number: 21,
    question: 'What is the Moon in the negative ET infrastructure tied to this hierarchy?',
    options: [
      {
        label: 'A',
        text: 'A pure natural satellite with no station, no loosh harvest, and no frequency broadcast role.',
        isCorrect: false,
        rationale:
          'It is a holographic Dyson-sphere-like space station for loosh harvest and negative frequencies.',
      },
      {
        label: 'B',
        text: 'A G.A.A. hospital that only heals children and never beams lunatic frequencies downward.',
        isCorrect: false,
        rationale:
          'Negative ETs and blond hybrids use it to harvest Loosh and beam negative frequencies.',
      },
      {
        label: 'C',
        text: 'A holographic, Dyson-sphere-like space station used by negative ETs and blond hybrids to harvest Loosh and beam negative frequencies that drive "lunatic" behavior down to the realm.',
        isCorrect: true,
        rationale:
          'Moon station = holographic shell over loosh harvest and lunatic frequency projection.',
      },
      {
        label: 'D',
        text: 'Only a poetry metaphor with no Dyson-sphere architecture and no hybrid staff operations.',
        isCorrect: false,
        rationale:
          'It is operational negative ET infrastructure for harvest and frequency warfare.',
      },
    ],
    hint: 'Holographic Dyson-like station — loosh + lunatic frequency beams.',
    correctAnswer: 'C',
  },
  {
    number: 22,
    question:
      'How do Overlays, Niberian plasma, and Freemason building work with the Reptilian agenda?',
    options: [
      {
        label: 'A',
        text: 'They restore every Tartarian crystalline temple to full 3rd-density sight for free public use.',
        isCorrect: false,
        rationale:
          'Crystalline temples were phased out of 3rd-density sight; Freemason churches replaced them on nodes.',
      },
      {
        label: 'B',
        text: 'Niberian Black Void Plasma fakes the black night sky and hides true enclosed gateway architecture; Tartarian high-frequency crystalline temples were phased out of 3rd-density sight and replaced with crude blockwork churches by Freemasons over planetary Nodal Points to stifle Earth\'s natural electromagnetic energy.',
        isCorrect: true,
        rationale:
          'Plasma sky lie + Freemason node churches = hide gateway truth and stifle planetary energy.',
      },
      {
        label: 'C',
        text: 'Freemasons only plant gardens with no nodal churches and no link to energy stifling.',
        isCorrect: false,
        rationale:
          'They built crude churches over Nodal Points to stifle natural electromagnetic energy.',
      },
      {
        label: 'D',
        text: 'Black Void Plasma brightens the true white sky so everyone sees Tartaria without overlays.',
        isCorrect: false,
        rationale:
          'Plasma fakes black night and hides true immovable gateway architecture.',
      },
    ],
    hint: 'Black Void Plasma sky lie — Freemason churches on nodes — hide Tartaria.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question:
      'What is the current status of Reptilians, and what will the Fake Alien Invasion actually show?',
    options: [
      {
        label: 'A',
        text: 'Reptilians still rule openly; Bluebeam will feature live Omicron and Custodian landing parties.',
        isCorrect: false,
        rationale:
          'Negative entities have been completely eradicated; Bluebeam shows only holographic ET craft.',
      },
      {
        label: 'B',
        text: 'They never existed, so no holographic invasion theater is planned for any awakening sequence.',
        isCorrect: false,
        rationale:
          'They existed and are now eradicated; Fake Alien Invasion still runs as hologram theater.',
      },
      {
        label: 'C',
        text: 'They upgraded into 12th-density caretakers and will greet humanity as friends during Bluebeam.',
        isCorrect: false,
        rationale:
          'They are eradicated from the simulations; invasion craft will be holographic only.',
      },
      {
        label: 'D',
        text: 'Reptilians and the broader parasitic collective have been completely eradicated from the simulations; the impending Fake Alien Invasion via Project Bluebeam will feature strictly holographic projections of ET craft — not actual Reptilians or Custodians making contact.',
        isCorrect: true,
        rationale:
          'Reign ended; Bluebeam is hologram-only scare theater without live Reptilian contact.',
      },
    ],
    hint: 'Eradicated — Bluebeam is holographic only, not live Reptilian contact.',
    correctAnswer: 'D',
  },
  {
    number: 24,
    question:
      'What core societal programming must humanity discard to dissolve residual Reptilian control?',
    options: [
      {
        label: 'A',
        text: 'Only cooking recipes, with no link to Religion, Finance, or Perceived Knowledge systems.',
        isCorrect: false,
        rationale:
          'The Three Strings are Religion, Finance, and Perceived Knowledge (including heliocentric deception).',
      },
      {
        label: 'B',
        text: 'The Three Strings of control: Religion, Finance, and Perceived Knowledge (such as the Heliocentric globe earth deception).',
        isCorrect: true,
        rationale:
          'Discard Religion, Finance, and false Perceived Knowledge to break residual fear programming.',
      },
      {
        label: 'C',
        text: 'Pure love and free energy teaching, which were the only strings parasites ever installed.',
        isCorrect: false,
        rationale:
          'Parasites installed Religion, Finance, and Perceived Knowledge — not liberating love/energy as strings.',
      },
      {
        label: 'D',
        text: 'Nothing — residual programming dissolves automatically without discarding any paradigm.',
        isCorrect: false,
        rationale:
          'Final dissolution requires actively discarding the Three Strings of control.',
      },
    ],
    hint: 'Three Strings — Religion, Finance, Perceived Knowledge.',
    correctAnswer: 'B',
  },
  {
    number: 25,
    question:
      'Who enforced the Three Strings for the parasites, and what geographic truth frees a soul from residual fear programming?',
    options: [
      {
        label: 'A',
        text: '33rd-degree Freemason proxies enforced Religion, Finance, and Perceived Knowledge; freedom requires stripping those false paradigms and understanding the true flat nature of the enclosed physical plain.',
        isCorrect: true,
        rationale:
          'Freemason 33rd-degree proxies ran the strings; flat enclosed plain truth breaks residual Reptilian fear code.',
      },
      {
        label: 'B',
        text: 'Only random children enforced the strings; freedom requires defending the spinning globe forever.',
        isCorrect: false,
        rationale:
          '33rd-degree Freemasons enforced the strings; globe deception is part of Perceived Knowledge to discard.',
      },
      {
        label: 'C',
        text: 'Micro Suns enforced the strings to imprison Tarans; freedom requires worshipping heliocentrism harder.',
        isCorrect: false,
        rationale:
          'Parasite Freemason proxies enforced the strings; flat enclosed plain knowing is liberating.',
      },
      {
        label: 'D',
        text: 'No proxies existed; the plain is a spinning globe and Freemasons only baked bread historically.',
        isCorrect: false,
        rationale:
          'Freemason proxies enforced control strings; true geometry is flat enclosed plain, not globe.',
      },
    ],
    hint: '33rd-degree Freemasons — Three Strings — true flat enclosed plain.',
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
  'Test your grasp of Reptilians — Omicron and Alpha Draco, Custodian engineering, Vatican levels, shape-shifting, Re-set brutality, and their eradication.';
const DESC_META =
  'Interactive Living Truth Quiz on Reptilians: bipedal crocodile enforcers, Density Suppression, Spirit Tree, Sold Souls, Loosh harvest, Moon station, Three Strings, and holographic Bluebeam only.';

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
      'Reptilians are not evolution — they are Custodian-made enforcers: Omicron and Alpha Draco, massive bipedal crocodile overlords who needed the Spirit Tree dead and density crushed to walk the plain. Shape-shift is low biology, not high light. Vatican floors, garden flaying, Loosh for Demons, Greys on the Amnesia Vortex, Moon lunatic beams — that was the grid. Sit with what you missed, then return to the Reptilians deep-dive. They are eradicated. Bluebeam will be holograms only. Discard Religion, Finance, and Perceived Knowledge. Know the flat enclosed plain. Residual fear is programming — not destiny.',
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
      "  { path: '/quiz/alice/negative-entities.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/parasitic-takeover.html', priority: '0.75', changefreq: 'monthly' },",
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
console.log('PASS: audited 25/25 against data/alice-topics/reptilians.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
