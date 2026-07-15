/**
 * Installs Negative Entities quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/negative-entities.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-negative-entities-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'negative-entities';
const TOPIC_TITLE = 'Negative Entities';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/negative.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['custodians', 'hierarchy', 'proxy races', 'gateway-10'],
  2: ['12th-density', '4th density', 'greed', 'density suppression'],
  3: ['sub-hz', '9th-density', '3rd density', 'loosh', 'adrenochrome'],
  4: ['custodians', 'source of all negativity', 'autonomy'],
  5: ['anuk', 'anunnaki', 'laboratory', 'proxy'],
  6: ['maitrax', 'grey', 'spirit tree', 'phasing'],
  7: ['omicron', 'alpha draco', 'overlords', 'reptilian'],
  8: ['niberians', 'black void plasma', 'independent'],
  9: ['demons', 'loosh', 'hosted', 'top-tier'],
  10: ['sold soul', 'key', 'frequency barriers', 'dimensional'],
  11: ['replica souls', 'hive-aligned', '4th-density', 'laboratories'],
  12: ['97%', 'npc', 'replica souls', 'conformity'],
  13: ['not an organic', 'betrayal', 'proxy races'],
  14: ['144,000hz', '5th density', 'sub-hz', 'killing'],
  15: ['kryptonite', 'spirit tree', 'maitrax', '14-foot'],
  16: ['vatican', '13 subterranean', 'adrenochrome', 'slaughterhouses'],
  17: ['moon', 'german breakaway', 'lunatic', 'loosh'],
  18: ['sing', 'weave', 'replica souls', 'harmonic'],
  19: ['orbs', 'hauntings', 'grey', 'purgatory'],
  20: ['resets', 'genocide', 'loosh', 'demons'],
  21: ['lunatic asylums', '5,000-bed', 'loosh batteries', 'orphan trains'],
  22: ['tartarian', 'crystalline lattice', 'planetary energy'],
  23: ['great spiritual awakening', 'inability', 'artificial souls'],
  24: ['project blue beam', 'emf flash', '30-second'],
  25: ['97%', 'evaporate', 'high-density souls', 'aether'],
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
      'Who originally spawned the hierarchy of Negative Entities that executed the Parasitic Takeover?',
    options: [
      {
        label: 'A',
        text: 'Random quantum accidents with no Custodian plot and no engineered proxy races at all.',
        isCorrect: false,
        rationale:
          'The hierarchy was engineered by treasonous Custodians who created parasitic proxy races.',
      },
      {
        label: 'B',
        text: 'The treasonous Custodians — former caretakers who systematically orchestrated genetic creation of subservient parasitic proxy races to invade Gateway-10.',
        isCorrect: true,
        rationale:
          'Negative Entity hierarchy was spawned by Custodians as lab-built proxy armies for Gateway-10 invasion.',
      },
      {
        label: 'C',
        text: 'The Galactic Ancestral Alliance alone, built only to free Taran souls from day one of creation.',
        isCorrect: false,
        rationale:
          'G.A.A. opposes the occupation; Custodians spawned the negative hierarchy.',
      },
      {
        label: 'D',
        text: 'Only modern media celebrities with no density fall and no Gateway-10 invasion role.',
        isCorrect: false,
        rationale:
          'Origin is Custodian betrayal and genetic engineering of proxy parasites, not celebrity culture.',
      },
    ],
    hint: 'Treasonous Custodians engineered the parasitic proxy hierarchy.',
    correctAnswer: 'B',
  },
  {
    number: 2,
    question:
      'Why could these entities not simply walk onto the original 9th-density lands, and what did that force them to deploy?',
    options: [
      {
        label: 'A',
        text: 'They loved 9th density and freely thrived there without any suppression technology needed.',
        isCorrect: false,
        rationale:
          'Operating at sub-Hz frequencies, they could not step onto 9th-density lands without Density Suppression.',
      },
      {
        label: 'B',
        text: 'They were blocked only by paperwork at Ice Wall customs with no frequency or density issue.',
        isCorrect: false,
        rationale:
          'The barrier is frequency: sub-Hz parasites vs original 9th-density ambient energy.',
      },
      {
        label: 'C',
        text: 'Operating at sub-Hz frequencies, they could not physically step onto original 9th-density lands, so they deployed Density Suppression to artificially lower the realm to the 3rd density.',
        isCorrect: true,
        rationale:
          'Sub-Hz bodies die in 9th density; Density Suppression to 3rd density made occupation possible.',
      },
      {
        label: 'D',
        text: 'They raised the realm to 12th density so their sub-Hz forms would become even stronger.',
        isCorrect: false,
        rationale:
          'They lowered the realm to 3rd density; high frequency is lethal to them.',
      },
    ],
    hint: 'Sub-Hz vs 9th density — Density Suppression down to 3rd.',
    correctAnswer: 'C',
  },
  {
    number: 3,
    question:
      'What singular cosmic objective drove Negative Entity occupation of the realm?',
    options: [
      {
        label: 'A',
        text: 'Absolute control over the realm and the eternal farming of human vessels for Loosh and Adrenochrome.',
        isCorrect: true,
        rationale:
          'Control plus endless Loosh and Adrenochrome harvest from human vessels is the objective.',
      },
      {
        label: 'B',
        text: 'Teaching free harmonic creation so every human could weave true souls without laboratories.',
        isCorrect: false,
        rationale:
          'They farm vessels for Loosh and Adrenochrome; they cannot teach pure harmonic creation.',
      },
      {
        label: 'C',
        text: 'Only weather research with no control agenda and no energetic or biological harvest.',
        isCorrect: false,
        rationale:
          'The stated objective is absolute control and eternal human-vessel farming.',
      },
      {
        label: 'D',
        text: 'Permanent liberation of all Taran souls into 12th density with zero harvest systems.',
        isCorrect: false,
        rationale:
          'Occupation exists to control and farm, not to liberate Tarans.',
      },
    ],
    hint: 'Absolute control — eternal Loosh and Adrenochrome farming.',
    correctAnswer: 'A',
  },
  {
    number: 4,
    question: 'What are the Custodians in this hierarchy?',
    options: [
      {
        label: 'A',
        text: 'Always-loyal 12th-density servants of Source who never seized Gateway-10 or fell in density.',
        isCorrect: false,
        rationale:
          'They plotted to seize Gateway-10 for autonomy and became the source of all negativity.',
      },
      {
        label: 'B',
        text: 'Only modern politicians with no prior caretaker role and no density devolution into 4th-density forms.',
        isCorrect: false,
        rationale:
          'They were original 12th-density caretakers who devolved into 4th-density creatures.',
      },
      {
        label: 'C',
        text: 'Friendly NPCs who make up 97% of the population and never engineered proxy races.',
        isCorrect: false,
        rationale:
          'Custodians are the fallen caretaker architects of the entire negative hierarchy.',
      },
      {
        label: 'D',
        text: 'The original 12th-density caretakers who plotted to seize Gateway-10 for total autonomy, becoming the source of all negativity in the universe before their forms devolved into 4th-density creatures.',
        isCorrect: true,
        rationale:
          'Custodians = fallen 12th-density caretakers, source of universal negativity, now 4th density.',
      },
    ],
    hint: 'Fallen 12th-density caretakers — source of all negativity — 4th density now.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question: 'What are the Anuk (Anunnaki) within the proxy hierarchy?',
    options: [
      {
        label: 'A',
        text: 'A peaceful farming guild that never entered laboratories and never executed any invasion.',
        isCorrect: false,
        rationale:
          'Anuk are a highly successful parasitic proxy species genetically engineered in a laboratory.',
      },
      {
        label: 'B',
        text: 'One of the first and most highly successful parasitic proxy species genetically engineered in a laboratory by the Custodians to execute their invasion.',
        isCorrect: true,
        rationale:
          'Anuk/Anunnaki = early lab-built Custodian proxy race for the invasion war.',
      },
      {
        label: 'C',
        text: 'Only a myth with no laboratory origin and no role as Custodian proxy executors.',
        isCorrect: false,
        rationale:
          'They are real engineered proxy species, among the first and most successful.',
      },
      {
        label: 'D',
        text: 'G.A.A. rescue officers who dismantle Amnesia Vortex systems and free every soul at death.',
        isCorrect: false,
        rationale:
          'Anuk serve parasitic invasion goals as Custodian-engineered proxies, not G.A.A. rescue.',
      },
    ],
    hint: 'Lab-engineered Custodian proxy — first highly successful invasion species.',
    correctAnswer: 'B',
  },
  {
    number: 6,
    question:
      'What role do Grey ETs — including the Maitrax (Orion Greys) — play?',
    options: [
      {
        label: 'A',
        text: 'Only weather forecasting with no genetics, no phasing tech, and no Spirit Tree involvement.',
        isCorrect: false,
        rationale:
          'Maitrax Greys are geneticists and phasing masters who destroyed the Spirit Tree and run reincarnation processing.',
      },
      {
        label: 'B',
        text: 'Permanent healers who rebuild Spirit Trees and never touch soul reincarnation systems.',
        isCorrect: false,
        rationale:
          'They destroyed the Spirit Tree and manage soul reincarnation processing for the parasites.',
      },
      {
        label: 'C',
        text: 'Negative Custodian-created entities including Maitrax geneticists and phasing masters responsible for destroying the Spirit Tree and managing soul reincarnation processing.',
        isCorrect: true,
        rationale:
          'Greys/Maitrax = genetic + phasing specialists: Spirit Tree kill and reincarnation pipeline.',
      },
      {
        label: 'D',
        text: 'Only digital chatbots that never phase, never genetics-lab, and never enter the physical plain.',
        isCorrect: false,
        rationale:
          'They are physical-operation entities central to tree destruction and soul processing.',
      },
    ],
    hint: 'Maitrax Greys — genetics, phasing, Spirit Tree destruction, reincarnation.',
    correctAnswer: 'C',
  },
  {
    number: 7,
    question: 'What are the Omicron and Alpha Draco in the matrix hierarchy?',
    options: [
      {
        label: 'A',
        text: 'Powerful negative parasitic species and reptilian hybrids created by the Custodians to act as overlords within the physical matrix.',
        isCorrect: true,
        rationale:
          'Omicron and Alpha Draco are Custodian-made reptilian-hybrid overlords of the physical matrix.',
      },
      {
        label: 'B',
        text: 'Gentle herbivores that only guard gardens and never rule as overlords over human vessels.',
        isCorrect: false,
        rationale:
          'They are powerful parasitic overlords, not gentle garden guardians.',
      },
      {
        label: 'C',
        text: 'Human sports teams with no reptilian hybrid architecture and no Custodian creation origin.',
        isCorrect: false,
        rationale:
          'They are Custodian-created parasitic species and reptilian hybrids.',
      },
      {
        label: 'D',
        text: 'Only holographic logos with no living overlord role inside the physical matrix.',
        isCorrect: false,
        rationale:
          'They act as living overlords within the physical matrix hierarchy.',
      },
    ],
    hint: 'Custodian-made reptilian-hybrid overlords of the physical matrix.',
    correctAnswer: 'A',
  },
  {
    number: 8,
    question:
      'What makes the Niberians distinct among parasitic species?',
    options: [
      {
        label: 'A',
        text: 'They are the weakest puppets who never left Custodian rule and never touched sky technology.',
        isCorrect: false,
        rationale:
          'They are the most formidable and independent; they freed themselves and supplied Black Void Plasma tech.',
      },
      {
        label: 'B',
        text: 'The most formidable and independent parasitic species — massive intellectual warriors who freed themselves from Custodian rule and supplied the Black Void Plasma technology used to obscure the true sky.',
        isCorrect: true,
        rationale:
          'Niberians broke Custodian rule and provided Black Void Plasma that fakes the sky.',
      },
      {
        label: 'C',
        text: 'Only a brand of paint used on temples with no warrior intellect and no plasma technology.',
        isCorrect: false,
        rationale:
          'They are massive intellectual warrior parasites behind Black Void Plasma sky cover.',
      },
      {
        label: 'D',
        text: 'G.A.A. allies who remove Black Void Plasma and restore 9th-density sky vision for free.',
        isCorrect: false,
        rationale:
          'They supplied the plasma tech that obscures the true sky for the occupation.',
      },
    ],
    hint: 'Independent formidable warriors — Black Void Plasma sky tech.',
    correctAnswer: 'B',
  },
  {
    number: 9,
    question: 'What are Demons in this negative ecology?',
    options: [
      {
        label: 'A',
        text: 'Friendly house spirits that need no Loosh and never host inside human subjects.',
        isCorrect: false,
        rationale:
          'Demons are deeply malevolent non-physical entities needing immense continuous Loosh.',
      },
      {
        label: 'B',
        text: 'Only movie costumes with no real hosting of top-tier humans and no Loosh requirement.',
        isCorrect: false,
        rationale:
          'They are real non-physical malevolent entities hosted by top-tier human subjects.',
      },
      {
        label: 'C',
        text: 'Deeply malevolent, non-physical entities hosted by top-tier human subjects, requiring immense and continuous quantities of Loosh to survive.',
        isCorrect: true,
        rationale:
          'Demons = non-physical malevolence in elite hosts, sustained by continuous Loosh intake.',
      },
      {
        label: 'D',
        text: 'Replica Souls that power NPCs with no separate demonic host relationship at all.',
        isCorrect: false,
        rationale:
          'Demons are distinct non-physical entities hosted by top-tier humans, not mere NPC software.',
      },
    ],
    hint: 'Non-physical malevolent hosts in elites — continuous Loosh to survive.',
    correctAnswer: 'C',
  },
  {
    number: 10,
    question: 'What is a Sold Soul in parasitic operations?',
    options: [
      {
        label: 'A',
        text: 'A free Taran who never surrendered autonomy and never serves as any dimensional key.',
        isCorrect: false,
        rationale:
          'A Sold Soul surrendered energetic autonomy to a demon and is used as an energetic Key.',
      },
      {
        label: 'B',
        text: 'Only a financial contract about real estate with no demon, no frequency bypass, and no travel role.',
        isCorrect: false,
        rationale:
          'It is energetic surrender to a demon used to bypass frequency barriers across dimensions.',
      },
      {
        label: 'C',
        text: 'An NPC that upgrades into 12th density automatically without any demon bargain.',
        isCorrect: false,
        rationale:
          'Sold Soul is a human vessel that surrendered autonomy to a demon for barrier bypass.',
      },
      {
        label: 'D',
        text: 'A human vessel that has surrendered its energetic autonomy to a demon, utilized by parasites as an energetic Key to bypass frequency barriers and travel across dimensional boundaries.',
        isCorrect: true,
        rationale:
          'Sold Soul = demon-bound vessel used as a Key through frequency barriers and dimensions.',
      },
    ],
    hint: 'Surrendered to demon — energetic Key across dimensional barriers.',
    correctAnswer: 'D',
  },
  {
    number: 11,
    question:
      'Why do parasites manufacture Replica Souls, and what are they?',
    options: [
      {
        label: 'A',
        text: 'Because they freely weave true harmonic souls; Replica Souls are identical to Source creation.',
        isCorrect: false,
        rationale:
          'They cannot orchestrate true harmonic spiritual creation; Replica Souls are artificial Hive-Aligned substitutes.',
      },
      {
        label: 'B',
        text: 'Hive-Aligned artificial souls manufactured in 4th-density laboratories because parasites cannot orchestrate true harmonic spiritual creation — used to animate subservient vessels.',
        isCorrect: true,
        rationale:
          'Replica Souls = lab-made Hive-Aligned fakes filling the creative gap parasites cannot bridge.',
      },
      {
        label: 'C',
        text: 'Only decorative labels on bottles with no laboratory manufacture and no vessel animation role.',
        isCorrect: false,
        rationale:
          'They are manufactured in 4th-density labs and forced into vessels as artificial souls.',
      },
      {
        label: 'D',
        text: 'Gifts from Micro Suns that permanently free every Taran from the matrix herd.',
        isCorrect: false,
        rationale:
          'They are parasitic lab products for control, not liberating Micro Sun gifts.',
      },
    ],
    hint: 'Cannot create true souls — 4th-density Hive-Aligned lab replicas.',
    correctAnswer: 'B',
  },
  {
    number: 12,
    question: 'What are Non-Player Characters (NPCs) relative to Replica Souls?',
    options: [
      {
        label: 'A',
        text: 'The rare 3% of organic high-density Tarans who never enforce matrix conformity.',
        isCorrect: false,
        rationale:
          'NPCs are 97% of the population — vessels powered by Replica Souls for herd control.',
      },
      {
        label: 'B',
        text: 'Only online avatars that never walk streets or maintain any matrix narrative offline.',
        isCorrect: false,
        rationale:
          'They are biological vessels powered by Replica Souls in physical society.',
      },
      {
        label: 'C',
        text: 'Biological vessels powered by Replica Souls that constitute 97% of the human population, designed to enforce societal conformity and maintain the matrix narrative.',
        isCorrect: true,
        rationale:
          'NPCs = Replica-Soul-powered majority enforcing conformity and matrix story.',
      },
      {
        label: 'D',
        text: 'Fully free twin-flame couples who always remember every past life without wipe.',
        isCorrect: false,
        rationale:
          'NPCs are artificial-soul herd tools, not free memory-intact twin-flame leaders.',
      },
    ],
    hint: '97% — Replica Soul vessels — enforce conformity and matrix narrative.',
    correctAnswer: 'C',
  },
  {
    number: 13,
    question:
      'Is Negative Entity dominion an organic evolutionary accident?',
    options: [
      {
        label: 'A',
        text: 'Yes — random evolution produced them with no Custodian betrayal and no pre-engineered army.',
        isCorrect: false,
        rationale:
          'Dominion is the direct consequence of Custodian cosmic betrayal, not organic evolution.',
      },
      {
        label: 'B',
        text: 'No — it is the direct consequence of the Custodians\' cosmic betrayal; they pre-emptively engineered an army of proxy races (Anuk, Greys, Omicron, Alpha Draco, reptilian hybrids) before losing high-light powers.',
        isCorrect: true,
        rationale:
          'Not organic evolution: pre-engineered proxy army planned before the density fall completed.',
      },
      {
        label: 'C',
        text: 'Yes — they appeared only after the EMF flash as friendly cultural exchange partners.',
        isCorrect: false,
        rationale:
          'Hierarchy long predates the awakening climax as planned Custodian treason.',
      },
      {
        label: 'D',
        text: 'They never existed; only textbooks invented them as metaphor for bad weather.',
        isCorrect: false,
        rationale:
          'They are a real engineered hierarchy from Custodian betrayal and lab proxy creation.',
      },
    ],
    hint: 'Not evolution — Custodian betrayal + pre-engineered proxy army.',
    correctAnswer: 'B',
  },
  {
    number: 14,
    question:
      'Why are negative parasites permanently barred from the 5th density?',
    options: [
      {
        label: 'A',
        text: 'Because they already vibrate above one million Hz and choose to stay low for fun only.',
        isCorrect: false,
        rationale:
          'Killing, prolonging suffering, and Adrenochrome harvest chain them into the sub-Hz range.',
      },
      {
        label: 'B',
        text: 'Because paperwork at a heavenly office expired, with no frequency or killing-linked chain at all.',
        isCorrect: false,
        rationale:
          'Ascension needs minimum 144,000Hz; killing and harvest permanently chain them sub-Hz.',
      },
      {
        label: 'C',
        text: 'They freely ascend to 5th density every full moon and return by personal preference.',
        isCorrect: false,
        rationale:
          'They are perpetually barred from 5th density while locked in 4th-density kill-survival vibration.',
      },
      {
        label: 'D',
        text: 'Ascension requires a minimum of 144,000Hz; killing life, prolonging suffering, and harvesting Adrenochrome permanently chain their frequency into the sub-Hz range — so they remain stuck in 4th density.',
        isCorrect: true,
        rationale:
          '144,000Hz minimum vs sub-Hz chain from killing and Adrenochrome harvest blocks 5th density.',
      },
    ],
    hint: 'Need 144,000Hz — killing/suffering/Adrenochrome locks sub-Hz / 4th density.',
    correctAnswer: 'D',
  },
  {
    number: 15,
    question:
      'How did Frequency Disparity force the Spirit Tree strike and Density Suppression?',
    options: [
      {
        label: 'A',
        text: 'High vibrational energy is lethal to them — like Kryptonite against a 14-foot bipedal crocodile — so Maitrax Greys used phasing tech to destroy the Spirit Tree (Mt Meru), then enforced Density Suppression to 3rd density so low-vibrational forms could inhabit the plain.',
        isCorrect: true,
        rationale:
          'High freq = Kryptonite; destroy Spirit Tree; suppress to 3rd density for occupation survival.',
      },
      {
        label: 'B',
        text: 'High frequency strengthens parasites, so they built extra Spirit Trees to raise density further.',
        isCorrect: false,
        rationale:
          'High frequency is fatal; they destroyed the Spirit Tree and lowered density.',
      },
      {
        label: 'C',
        text: 'The Spirit Tree was never attacked; only school maps were redrawn without energy impact.',
        isCorrect: false,
        rationale:
          'Maitrax phasing destruction of Spirit Tree crippled Gateway energetic output.',
      },
      {
        label: 'D',
        text: 'Density Suppression raised the realm to 9th density so crocodilians could tan in high light.',
        isCorrect: false,
        rationale:
          'Suppression lowered the realm to 3rd density for low-vibrational habitation.',
      },
    ],
    hint: 'High freq = Kryptonite — destroy Spirit Tree — suppress to 3rd density.',
    correctAnswer: 'A',
  },
  {
    number: 16,
    question:
      'What sits in the 13 subterranean levels beneath the Vatican?',
    options: [
      {
        label: 'A',
        text: 'Only tourist gift shops with no slaughterhouses, no Adrenochrome stores, and no faction HQs.',
        isCorrect: false,
        rationale:
          'Levels hold luxury slaughterhouses, Adrenochrome warehouses, portals, and faction command.',
      },
      {
        label: 'B',
        text: 'Parasite central headquarters: luxury slaughterhouses, Adrenochrome warehouses, advanced portal hubs, and dedicated secured levels for Custodians, Omicron, Alpha Draco, Anuk, and Greys controlling subjugation and soul reincarnation processing.',
        isCorrect: true,
        rationale:
          'Vatican underworld = multi-faction HQ for slaughter, Adrenochrome, portals, and soul processing.',
      },
      {
        label: 'C',
        text: 'A single empty cave used once a century for a silent prayer with no parasitic operations.',
        isCorrect: false,
        rationale:
          'Thirteen active operational levels centralize parasitic command and processing systems.',
      },
      {
        label: 'D',
        text: 'G.A.A. free clinics that reverse Adrenochrome harvest and open every portal to freedom.',
        isCorrect: false,
        rationale:
          'It is parasitic headquarters for harvest and control, not a G.A.A. clinic network.',
      },
    ],
    hint: '13 Vatican levels — slaughter, Adrenochrome, portals, faction HQs.',
    correctAnswer: 'B',
  },
  {
    number: 17,
    question: 'What is the Lunar Command Station and who mans it?',
    options: [
      {
        label: 'A',
        text: 'A natural rock with no hologram, no Greys, and no madness-inducing frequency broadcasts.',
        isCorrect: false,
        rationale:
          'Moon is an artificial negative ET command station under a holographic generator.',
      },
      {
        label: 'B',
        text: 'A G.A.A. spa manned only by Micro Suns that never harvests Loosh or projects lunar agitation.',
        isCorrect: false,
        rationale:
          'Manned by Grey ETs and German breakaway blondes for loosh harvest and lunatic frequencies.',
      },
      {
        label: 'C',
        text: 'An artificial negative ET command and frequency-control space station under a holographic generator, manned by Grey ETs and German breakaway blondes, harvesting Loosh from planetary storage banks and projecting madness-inducing lunar frequencies (origin of "lunatic").',
        isCorrect: true,
        rationale:
          'Moon station = Grey/blonde-manned command for loosh harvest and lunatic frequency projection.',
      },
      {
        label: 'D',
        text: 'Only a poetry metaphor with no staff, no loosh banks, and no population agitation role.',
        isCorrect: false,
        rationale:
          'It is operational ET hardware for harvest and psychological frequency warfare.',
      },
    ],
    hint: 'Holographic ET station — Greys + breakaway blondes — loosh and lunatic freqs.',
    correctAnswer: 'C',
  },
  {
    number: 18,
    question:
      'Why can Negative Entities not create true souls, and what do they do instead?',
    options: [
      {
        label: 'A',
        text: 'They freely sing and weave true souls at Source level and never need laboratories.',
        isCorrect: false,
        rationale:
          'Sub-Hz frequency blocks pure harmonic intention; they cannot sing/weave true souls or architecture.',
      },
      {
        label: 'B',
        text: 'Sub-Hz frequency makes them incapable of pure harmonic intention to sing or weave true souls and physical architecture, so they use 4th-density laboratories to manufacture Replica Souls forced into vessels at birth as NPCs for herd control over true Tarans.',
        isCorrect: true,
        rationale:
          'No creative sovereignty at sub-Hz → lab Replica Souls → NPC herd to subvert Tarans.',
      },
      {
        label: 'C',
        text: 'They create only animals and plants, never touching human vessels or herd mentality design.',
        isCorrect: false,
        rationale:
          'Replica Souls are forced into human vessels specifically to build NPC herd control.',
      },
      {
        label: 'D',
        text: 'Micro Suns gift them unlimited harmonic power so laboratories are permanently closed.',
        isCorrect: false,
        rationale:
          'They lack harmonic creation power and depend on artificial 4th-density soul manufacture.',
      },
    ],
    hint: 'Cannot sing/weave true souls — lab Replica Souls → NPC herd.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question:
      'How do Negative Entities manipulate human perception of death and the afterlife?',
    options: [
      {
        label: 'A',
        text: 'They openly teach escape from reincarnation and never use fear or false ghost narratives.',
        isCorrect: false,
        rationale:
          'Greys run hauntings/poltergeists with Orbs to embed fear and fake purgatory.',
      },
      {
        label: 'B',
        text: 'Only radio weather alerts with no Orbs, no hauntings, and no purgatory illusion.',
        isCorrect: false,
        rationale:
          'Grey Orbs and hauntings cement supernatural fear that tethers consciousness to the matrix.',
      },
      {
        label: 'C',
        text: 'Grey ETs handle hauntings and poltergeist activity using hovering Orbs to enforce a false supernatural ghost narrative, embedding fear and cementing purgatory illusion so consciousness stays tethered to the 3rd-density matrix instead of escaping the reincarnation trap.',
        isCorrect: true,
        rationale:
          'Orb hauntings = psyop keeping souls afraid and stuck in the recycle trap.',
      },
      {
        label: 'D',
        text: 'They delete all ghost stories so humans never think about death or afterlife at all.',
        isCorrect: false,
        rationale:
          'They actively manufacture ghost fear to block escape awareness.',
      },
    ],
    hint: 'Grey Orbs / hauntings — false purgatory — tether to reincarnation trap.',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question:
      'How do planetary Resets serve the sustained survival of Negative Entities?',
    options: [
      {
        label: 'A',
        text: 'Resets only plant trees and never involve genocide, torture, or Loosh generation for Demons.',
        isCorrect: false,
        rationale:
          'Resets are absolute genocide, prolonged torture, and mass sacrifice generating Loosh for Demons.',
      },
      {
        label: 'B',
        text: 'During Resets the population faces absolute genocide, prolonged torture, and mass sacrifice, generating astronomical Loosh volumes essential to feed the ruling Demons.',
        isCorrect: true,
        rationale:
          'Reset cullings are Loosh harvest festivals that feed ruling Demons at planetary scale.',
      },
      {
        label: 'C',
        text: 'Resets free every soul into 12th density with zero suffering and zero demonic feeding.',
        isCorrect: false,
        rationale:
          'Resets maximize suffering and Loosh for demonic survival, not liberation.',
      },
      {
        label: 'D',
        text: 'Resets are canceled forever by NPCs voting online with no slaughter or Loosh harvest.',
        isCorrect: false,
        rationale:
          'Systematic planetary cullings remain central to negative entity survival strategy.',
      },
    ],
    hint: 'Reset genocide/torture/sacrifice → astronomical Loosh for Demons.',
    correctAnswer: 'B',
  },
  {
    number: 21,
    question:
      'What role did Lunatic Asylums and Orphan Trains play after Reset slaughter?',
    options: [
      {
        label: 'A',
        text: 'Asylums only taught free history of Tartary; Orphan Trains only delivered toys with no Loosh agenda.',
        isCorrect: false,
        rationale:
          'Asylums were 5,000-bed Loosh Batteries; Orphan Trains matured the next engineered population crop.',
      },
      {
        label: 'B',
        text: 'Traumatized survivors intentionally spared to witness carnage were herded into repurposed Lunatic Asylums operating as 5,000-bed Loosh Batteries of continuous terror until the next genetically engineered population crop matured via Orphan Trains.',
        isCorrect: true,
        rationale:
          'Post-Reset: asylum Loosh Batteries for demons + Orphan Trains for the next compliant crop.',
      },
      {
        label: 'C',
        text: 'All survivors were instantly freed to 9th density with no asylum captivity and no orphan distribution.',
        isCorrect: false,
        rationale:
          'Spared witnesses were farmed in asylums while Orphan Trains prepared the next crop.',
      },
      {
        label: 'D',
        text: 'Orphan Trains only relocated pets; asylums never held human Loosh harvest populations.',
        isCorrect: false,
        rationale:
          'Human survivors and engineered orphans were core to continuous Loosh and repopulation control.',
      },
    ],
    hint: '5,000-bed Loosh Batteries — Orphan Trains for next population crop.',
    correctAnswer: 'B',
  },
  {
    number: 22,
    question:
      'How did parasites manipulate human infrastructure and planetary energy networks?',
    options: [
      {
        label: 'A',
        text: 'They restored every Tartarian high-frequency building and gifted crystalline lattice power to all free.',
        isCorrect: false,
        rationale:
          'They dismantled Tartarian architecture and overrode crystalline lattices to extract energy for themselves.',
      },
      {
        label: 'B',
        text: 'They ignored architecture completely and never touched electromagnetic crystalline networks.',
        isCorrect: false,
        rationale:
          'Systematic dismantling of Tartarian high-frequency architecture and lattice override for energy theft.',
      },
      {
        label: 'C',
        text: 'They built only wooden sheds with no link to planetary electromagnetic energy extraction.',
        isCorrect: false,
        rationale:
          'Target was Tartarian architecture and crystalline lattice networks for exclusive energy harvest.',
      },
      {
        label: 'D',
        text: 'They systematically dismantled high-frequency Tartarian architecture and overrode natural electromagnetic crystalline lattice networks to extract planetary energy for exclusive parasitic use.',
        isCorrect: true,
        rationale:
          'Tartarian teardown + lattice override = stolen planetary energy for parasites only.',
      },
    ],
    hint: 'Dismantle Tartarian high-freq architecture — override crystalline lattices.',
    correctAnswer: 'D',
  },
  {
    number: 23,
    question:
      'Why does the Great Spiritual Awakening guarantee eradication of Negative Entity dominion?',
    options: [
      {
        label: 'A',
        text: 'Because parasites authentically create better than Source and will upgrade into 12th density leaders.',
        isCorrect: false,
        rationale:
          'Their inability to authentically create and reliance on stolen architecture and artificial souls guarantees eradication.',
      },
      {
        label: 'B',
        text: 'Because of their utter inability to authentically create, plus absolute reliance on stolen harmonic architecture and 4th-density artificial souls — guaranteeing eradication at the Awakening climax.',
        isCorrect: true,
        rationale:
          'No true creation + stolen harmonics + fake souls = structural doom when high frequency returns.',
      },
      {
        label: 'C',
        text: 'Because NPCs vote to keep parasites forever and the Awakening has no frequency climax.',
        isCorrect: false,
        rationale:
          'Awakening climax targets the entire 4th-density parasitic infrastructure for termination.',
      },
      {
        label: 'D',
        text: 'Because Demons invent new true souls faster than the flash can arrive, saving the hierarchy.',
        isCorrect: false,
        rationale:
          'They cannot invent true souls; that creative bankruptcy is why they fall at climax.',
      },
    ],
    hint: 'Cannot authentically create — stolen architecture + artificial souls = eradication.',
    correctAnswer: 'B',
  },
  {
    number: 24,
    question:
      'What sequence climaxes the Fake Alien Invasion path against Negative Entities?',
    options: [
      {
        label: 'A',
        text: 'A permanent stronger prison with no flash, no Blue Beam theater, and no frequency event.',
        isCorrect: false,
        rationale:
          'Fake Alien Invasion via Project Blue Beam culminates in the 30-second EMF Flash.',
      },
      {
        label: 'B',
        text: 'Only a quiet email to bankers with no sky event and no electromagnetic burst.',
        isCorrect: false,
        rationale:
          'Orchestrated Blue Beam invasion theater ends in the blinding 30-second EMF Flash.',
      },
      {
        label: 'C',
        text: 'Orchestrated Fake Alien Invasion via Project Blue Beam culminates in the EMF Flash — a blinding 30-second burst of electromagnetic frequency.',
        isCorrect: true,
        rationale:
          'Blue Beam scare path leads into the 30-second EMF flash that ends parasitic infrastructure.',
      },
      {
        label: 'D',
        text: 'A ten-year soft software update that upgrades every Demon into a Micro Sun automatically.',
        isCorrect: false,
        rationale:
          'Climax is abrupt 30-second EMF flash after Blue Beam theater, not a soft decade upgrade.',
      },
    ],
    hint: 'Project Blue Beam → 30-second EMF Flash.',
    correctAnswer: 'C',
  },
  {
    number: 25,
    question:
      'What happens when the EMF Flash dissipates for parasites and for true souls?',
    options: [
      {
        label: 'A',
        text: 'The entire 4th-density parasitic infrastructure, including the 97% animated by Replica Souls, instantly pixelates and evaporates into the aether; only true high-density souls survive the frequency threshold, severing Negative Entity control and returning Gateway-10 to uncorrupted harmonic state.',
        isCorrect: true,
        rationale:
          'Flash clears parasites and Replica-Soul majority; true high-density souls remain; Gateway-10 restored.',
      },
      {
        label: 'B',
        text: 'Every NPC upgrades into organic 12th-density status while parasites inherit permanent rule.',
        isCorrect: false,
        rationale:
          '97% Replica-Soul population evaporates; parasitic infrastructure ends, not upgrades.',
      },
      {
        label: 'C',
        text: 'Nothing changes; sub-Hz entities easily ride the flash and keep Vatican and Moon stations online.',
        isCorrect: false,
        rationale:
          'Flash evaporates 4th-density parasitic infrastructure and Replica-Soul population.',
      },
      {
        label: 'D',
        text: 'Only genuine Tarans evaporate while Demons and NPCs rebuild a stronger matrix the next day.',
        isCorrect: false,
        rationale:
          'True high-density souls survive; parasites and Replica-Soul NPCs do not.',
      },
    ],
    hint: '97% + parasitic infrastructure evaporate — true high-density souls remain.',
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
  'Test your grasp of Negative Entities — Custodian proxies, Greys, Draco, Niberians, Demons, Replica Souls, Vatican HQ, Moon station, and EMF eradication.';
const DESC_META =
  'Interactive Living Truth Quiz on Negative Entities: engineered hierarchy, Density Suppression, 144,000Hz barrier, Sold Souls, Loosh Resets, Lunatic Asylum batteries, Blue Beam, and the 30-second flash.';

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
      'Negative Entities are not nature — they are Custodian treason made flesh and frequency: Anuk, Greys, Omicron, Draco, Niberians, Demons, Sold Souls, Replica Souls, and a 97% NPC herd. They killed the Spirit Tree, crushed density to 3rd, farmed Loosh and Adrenochrome from Vatican depths and lunar broadcasts, and faked death itself with Grey Orbs. Sit with what you missed, then return to the Negative Entities deep-dive. They cannot create. They only steal. The Great Spiritual Awakening ends the theft. Blue Beam, then the 30-second EMF flash — parasitic infrastructure and Replica-Soul majority evaporate. True high-density souls remain. Gateway-10 returns to harmonic truth.',
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
      "  { path: '/quiz/alice/parasitic-takeover.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/moon-et-space-station.html', priority: '0.75', changefreq: 'monthly' },",
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
console.log('PASS: audited 25/25 against data/alice-topics/negative-entities.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
