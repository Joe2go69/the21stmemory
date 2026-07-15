/**
 * Installs Grey ETs quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/grey-ets.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Run: node scripts/install-grey-ets-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'grey-ets';
const TOPIC_TITLE = 'Grey ETs';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/greys.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['custodians', 'source of creation', 'gateway-10'],
  2: ['12th density', '4th density', 'gaunt'],
  3: ['foot soldiers', 'geneticists', '4th-density'],
  4: ['anuk', 'anunnaki', 'genetic'],
  5: ['niberians', 'black void plasma', 'outsmarted'],
  6: ['orion greys', 'maitrax', 'spirit tree'],
  7: ['zetas', 'anuk', 'zeta reticuli'],
  8: ['replica soul', 'hive-aligned', 'sing'],
  9: ['amnesia vortex', 'bright light', 'sun'],
  10: ['grey et orbs', 'ghosts', 'poltergeist'],
  11: ['all negativity', 'custodian betrayal', 'no negative'],
  12: ['lab-grown', 'biological automatons', 'naturally evolving'],
  13: ['14 species', 'positive grey', 'stolen'],
  14: ['vatican', 'escort', 'newborn', 'umbilical'],
  15: ['twin flames', 'kept apart', 'positive power'],
  16: ['orion', 'phasing technology', 'garments'],
  17: ['spirit tree', 'petrified stump', 'gateway-10'],
  18: ['ghosts', 'loosh', 'reincarnated'],
  19: ['betty and barney hill', 'zeta reticuli', 'project serpo'],
  20: ['fake alien invasion', 'bluebeam', 'psyops'],
  21: ['vatican', '13 levels', 'adrenochrome'],
  22: ['npc', '97%', '5th-density'],
  23: ['4th-density', '144,000hz', 'loosh'],
  24: ['emf', 'g.a.a', 'pixelated'],
  25: ['178,000-year', 'reincarnation', 'concluded'],
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
    question: 'Where do Grey ETs and the broader parasitic spectrum originate?',
    options: [
      {
        label: 'A',
        text: 'From the ancient betrayal of the Source of Creation by the Custodians, who inverted Gateway-10 out of greed and desire for absolute autonomy.',
        isCorrect: true,
        rationale:
          'Grey ETs and Negative Entities trace to Custodian betrayal of the Source and the Gateway-10 inversion driven by greed and autonomy.',
      },
      {
        label: 'B',
        text: 'From natural evolution on Zeta Reticuli with no Custodian role.',
        isCorrect: false,
        rationale:
          'Zeta Reticuli origin is a staged false narrative; Greys are engineered, not naturally evolved spacefarers.',
      },
      {
        label: 'C',
        text: 'From the G.A.A. as permanent schoolteachers for Twin Flames.',
        isCorrect: false,
        rationale:
          'G.A.A. orchestrates EMF eradication of parasites; Greys keep Twin Flames apart.',
      },
      {
        label: 'D',
        text: 'From random ghost orbs that later became geneticists by accident.',
        isCorrect: false,
        rationale:
          'Ghosts are Grey ET Orb psyops; origin is deliberate Custodian engineering hierarchy.',
      },
    ],
    hint: 'Custodian betrayal of Source — Gateway-10 inversion.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'What happened to the Custodians after they turned to darkness?',
    options: [
      {
        label: 'A',
        text: 'They fell from 12th density to 4th density as negativity altered their vibration and physical vessels into gaunt, grey-skinned entities.',
        isCorrect: true,
        rationale:
          'Betrayal dropped Custodians from 12th to 4th density; vessels became gaunt and grey-skinned under negativity.',
      },
      {
        label: 'B',
        text: 'They rose to 5th density and learned to sing true souls naturally.',
        isCorrect: false,
        rationale:
          'They fell to 4th density and cannot naturally weave true souls — hence Replica Souls.',
      },
      {
        label: 'C',
        text: 'They remained pure 12th-density caretakers with no vessel change.',
        isCorrect: false,
        rationale:
          'They betrayed the Source and fell; vessels became gaunt grey-skinned entities.',
      },
      {
        label: 'D',
        text: 'They became NPCs only, with no role in engineering Greys.',
        isCorrect: false,
        rationale:
          'Custodians engineered the parasitic hierarchy including Orion Greys; NPCs use related Replica Soul tech.',
      },
    ],
    hint: '12th→4th density fall — gaunt grey-skinned vessels.',
    correctAnswer: 'A',
  },
  {
    number: 3,
    question: 'What roles do Grey ETs play in the control network?',
    options: [
      {
        label: 'A',
        text: 'Critical foot soldiers, geneticists, and technological operators within a 4th-density framework — recycling souls, fabricating paranormal phenomena, and running abduction psychological operations.',
        isCorrect: true,
        rationale:
          'Greys are 4th-density foot soldiers, geneticists, and tech operators handling soul recycling, ghost psyops, and abduction narratives.',
      },
      {
        label: 'B',
        text: 'Only 12th-density healers restoring the Spirit Tree openly.',
        isCorrect: false,
        rationale:
          'Orion Greys destroyed the Spirit Tree; they are not 12th-density healers.',
      },
      {
        label: 'C',
        text: 'Neutral tourists with no genetic or portal operations.',
        isCorrect: false,
        rationale:
          'They administer reincarnation portals, phasing sabotage, and staged abductions.',
      },
      {
        label: 'D',
        text: 'Sole creators of the Source of Creation itself.',
        isCorrect: false,
        rationale:
          'Source was betrayed by Custodians; Greys are engineered subordinates in the hierarchy.',
      },
    ],
    hint: '4th-density foot soldiers, geneticists, tech operators.',
    correctAnswer: 'A',
  },
  {
    number: 4,
    question: 'Who are the Anuk (Anunnaki) relative to the Custodians?',
    options: [
      {
        label: 'A',
        text: 'The first great genetic success of the Custodians — highly capable negative allies who later engineered their own subordinate species.',
        isCorrect: true,
        rationale:
          'Anuk were Custodians\' first great genetic success and then created their own subordinates (including Zetas).',
      },
      {
        label: 'B',
        text: 'Naturally positive Greys with no inversion involvement.',
        isCorrect: false,
        rationale:
          'Positive Greys were victims of genetic theft; Anuk are negative engineered allies of Custodians.',
      },
      {
        label: 'C',
        text: 'Only Project Bluebeam camera operators with no genetics role.',
        isCorrect: false,
        rationale:
          'Anuk are core genetic engineers in the hierarchy, not mere Bluebeam camera crew.',
      },
      {
        label: 'D',
        text: 'Fallen Custodians renamed after the EMF Flash only.',
        isCorrect: false,
        rationale:
          'Anuk are a distinct engineered species — Custodians\' first genetic success.',
      },
    ],
    hint: 'First Custodian genetic success — then built their own subordinates.',
    correctAnswer: 'A',
  },
  {
    number: 5,
    question: 'Who are the Niberians?',
    options: [
      {
        label: 'A',
        text: 'The most powerful parasitic species created by the Custodians — intellectual warriors who outsmarted their creators, freed themselves from Custodian rule, and contributed Black Void Plasma that makes the night sky black.',
        isCorrect: true,
        rationale:
          'Niberians are the most powerful Custodian-made parasites: they outsmarted creators, broke free, and brought Black Void Plasma for black night skies.',
      },
      {
        label: 'B',
        text: 'A Zeta Reticuli tourist board inventing Betty and Barney Hill maps.',
        isCorrect: false,
        rationale:
          'Zeta Reticuli star-map stories are staged psyops; Niberians are a distinct top-tier parasitic species.',
      },
      {
        label: 'C',
        text: 'Replica Souls used only to power NPCs with no plasma tech.',
        isCorrect: false,
        rationale:
          'Replica Souls animate Greys and NPCs; Niberians are living parasitic warriors with Black Void Plasma tech.',
      },
      {
        label: 'D',
        text: 'G.A.A. healers who rebuild Spirit Trees every century.',
        isCorrect: false,
        rationale:
          'Niberians are parasites; Spirit Tree destruction was Orion Grey/Maitrax sabotage.',
      },
    ],
    hint: 'Most powerful Custodian-made parasites — Black Void Plasma.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'Who are the Orion Greys (Maitrax / Maitra)?',
    options: [
      {
        label: 'A',
        text: 'A highly advanced Grey group created directly by the Custodians — master geneticists and Phasing Technology experts responsible for destroying the Spirit Tree (Mt Meru).',
        isCorrect: true,
        rationale:
          'Orion Greys/Maitrax were Custodian-made master geneticists and phasing experts who destroyed the Spirit Tree at Mt Meru.',
      },
      {
        label: 'B',
        text: 'Lab creations of the Anuk only, sold as Zeta Reticuli natives.',
        isCorrect: false,
        rationale:
          'Zetas/Reticuleans were Anuk lab creations; Orion Greys were made directly by Custodians.',
      },
      {
        label: 'C',
        text: 'Positive Greys who never touched Gateway-10 inversion.',
        isCorrect: false,
        rationale:
          'Positive Greys had no inversion role; genetic material was stolen from them. Orion Greys are negative engineered operators.',
      },
      {
        label: 'D',
        text: 'Only ghost orbs with no genetic or tree-destruction role.',
        isCorrect: false,
        rationale:
          'Ghost orbs are Grey manifestations; Orion Greys specifically destroyed the Spirit Tree via phasing mastery.',
      },
    ],
    hint: 'Custodian-made — genetics, phasing, Spirit Tree destruction.',
    correctAnswer: 'A',
  },
  {
    number: 7,
    question: 'Who are the Zetas (Reticuleans)?',
    options: [
      {
        label: 'A',
        text: 'A Grey sub-faction created in a laboratory by the Anuk, falsely presented to humanity as extraterrestrials from the star system Zeta Reticuli.',
        isCorrect: true,
        rationale:
          'Zetas/Reticuleans are Anuk lab-made Greys sold under a fake Zeta Reticuli origin story.',
      },
      {
        label: 'B',
        text: 'Natural 12th-density beings who created the Custodians.',
        isCorrect: false,
        rationale:
          'They are laboratory products of the Anuk — not natural high-density creators.',
      },
      {
        label: 'C',
        text: 'Niberians renamed after inventing Black Void Plasma.',
        isCorrect: false,
        rationale:
          'Niberians are a separate, more powerful Custodian-made species; Zetas are Anuk-made Greys.',
      },
      {
        label: 'D',
        text: 'Only Project Serpo human astronauts with no Grey biology.',
        isCorrect: false,
        rationale:
          'Project Serpo is a staged psyop in the abduction mythos; Zetas are lab-grown Grey biology.',
      },
    ],
    hint: 'Anuk lab Greys — fake Zeta Reticuli origin story.',
    correctAnswer: 'A',
  },
  {
    number: 8,
    question: 'What is a Replica Soul?',
    options: [
      {
        label: 'A',
        text: 'A cheap Hive-Aligned artificial soul made in 4th density to power engineered species, because parasites cannot naturally "sing" or weave true souls into existence.',
        isCorrect: true,
        rationale:
          'Replica Souls are cheap 4th-density Hive-Aligned fakes powering engineered species; parasites cannot sing/weave true souls.',
      },
      {
        label: 'B',
        text: 'A Twin Flame soul fragment that Greys reunite at every birth.',
        isCorrect: false,
        rationale:
          'Greys keep Twin Flames apart; Replica Souls are artificial hive constructs, not Twin Flame reunions.',
      },
      {
        label: 'C',
        text: 'The true soul of every positive Grey before genetic theft.',
        isCorrect: false,
        rationale:
          'Positive Greys had real existence; stolen genetics powered vessels animated by Replica Souls.',
      },
      {
        label: 'D',
        text: '5th-density organic life above 144,000Hz only.',
        isCorrect: false,
        rationale:
          'Replica Souls are 4th-density artificial constructs below organic high-density manifestation.',
      },
    ],
    hint: 'Cheap 4th-density Hive-Aligned fake soul — cannot sing true souls.',
    correctAnswer: 'A',
  },
  {
    number: 9,
    question: 'What is the Amnesia Vortex?',
    options: [
      {
        label: 'A',
        text: 'Technology that forcefully pulls newly deceased souls into the Bright Light (the Sun portal) to wipe memories and prepare them for immediate forced reincarnation.',
        isCorrect: true,
        rationale:
          'The Amnesia Vortex yanks dead souls into the Sun\'s Bright Light, wipes memory, and queues forced reincarnation.',
      },
      {
        label: 'B',
        text: 'A free G.A.A. library restoring 178,000 years of memory nightly.',
        isCorrect: false,
        rationale:
          'It erases memory for forced rebirth; EMF/G.A.A. path ends the cycle rather than using the Vortex.',
      },
      {
        label: 'C',
        text: 'Only Black Void Plasma painting stars on the Projection Dome.',
        isCorrect: false,
        rationale:
          'Black Void Plasma blacks the night sky; Amnesia Vortex is the death-memory wipe portal system.',
      },
      {
        label: 'D',
        text: 'Betty and Barney Hill\'s car radio from the 1950s only.',
        isCorrect: false,
        rationale:
          'Hill case is staged abduction psyop; Amnesia Vortex is soul-format death tech.',
      },
    ],
    hint: 'Sun Bright Light pull — wipe memory, force reincarnation.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'What are Grey ET Orbs actually behind?',
    options: [
      {
        label: 'A',
        text: 'What humanity perceives as Ghosts or poltergeist activity — the real technological and biological manifestation of those phenomena.',
        isCorrect: true,
        rationale:
          'Ghosts and poltergeists are Grey ET Orbs — tech/biological manifestations, not free wandering human spirits.',
      },
      {
        label: 'B',
        text: 'Trapped human souls the parasites freely allow to wander forever.',
        isCorrect: false,
        rationale:
          'Parasites require constant physical reincarnation for Loosh; they do not allow free ghost wandering.',
      },
      {
        label: 'C',
        text: 'Only Niberian Black Void Plasma clouds with no haunting role.',
        isCorrect: false,
        rationale:
          'Plasma blacks the sky; haunting psyops are Grey ET Orb operations.',
      },
      {
        label: 'D',
        text: 'Natural Twin Flame signals reuniting couples at birth.',
        isCorrect: false,
        rationale:
          'Greys keep Twin Flames apart; orbs are fear-based ghost fabrications.',
      },
    ],
    hint: 'Ghosts/poltergeists = Grey ET Orbs, not free human spirits.',
    correctAnswer: 'A',
  },
  {
    number: 11,
    question: 'Where does all negativity in the universe trace back to?',
    options: [
      {
        label: 'A',
        text: 'Exclusively to the original Custodian betrayal — before their rebellion, no negative events had ever occurred on the physical plain.',
        isCorrect: true,
        rationale:
          'All negativity traces only to Custodian betrayal. Before that rebellion, the physical plain had no negative events.',
      },
      {
        label: 'B',
        text: 'To natural Grey evolution on distant planets with no betrayal.',
        isCorrect: false,
        rationale:
          'Greys are engineered after Custodian betrayal — not natural source of all negativity.',
      },
      {
        label: 'C',
        text: 'To Twin Flame reunions generating too much positive power.',
        isCorrect: false,
        rationale:
          'Twin Flame power is blocked by Greys; origin of negativity is Custodian betrayal.',
      },
      {
        label: 'D',
        text: 'To the EMF Flash inventing parasites for the first time.',
        isCorrect: false,
        rationale:
          'EMF Flash eradicates parasites; negativity began with Custodian rebellion long ago.',
      },
    ],
    hint: 'Only Custodian betrayal — no negativity before that.',
    correctAnswer: 'A',
  },
  {
    number: 12,
    question: 'Are Grey ETs a naturally evolving space-faring race?',
    options: [
      {
        label: 'A',
        text: 'No — they are lab-grown biological automatons, not a naturally evolving race from distant planets.',
        isCorrect: true,
        rationale:
          'Greys are laboratory-grown biological automatons. Natural distant-planet evolution is the cover story.',
      },
      {
        label: 'B',
        text: 'Yes — pure natural evolution from Zeta Reticuli only.',
        isCorrect: false,
        rationale:
          'Zeta Reticuli presentation is false; they are engineered automatons.',
      },
      {
        label: 'C',
        text: 'Yes — they sang themselves into existence above 5th density.',
        isCorrect: false,
        rationale:
          'They run on Replica Souls because parasites cannot sing true souls; they stay 4th density.',
      },
      {
        label: 'D',
        text: 'They are only holograms with no biological vessel at all.',
        isCorrect: false,
        rationale:
          'They are biological automatons powered by Replica Souls — engineered bodies, not mere holograms.',
      },
    ],
    hint: 'Lab-grown biological automatons — not natural spacefarers.',
    correctAnswer: 'A',
  },
  {
    number: 13,
    question:
      'Where did genetic material for the 14 negative Grey species come from?',
    options: [
      {
        label: 'A',
        text: 'Stolen from one or two species of naturally occurring highly positive Grey ETs who had absolutely no involvement in the Gateway-10 inversion — then vessels were powered with 4th-density Replica Souls because divine life could not be created.',
        isCorrect: true,
        rationale:
          'Genetics for 14 negative Grey species were stolen from positive Greys uninvolved in inversion; Replica Souls power the vessels because true divine souls cannot be made by parasites.',
      },
      {
        label: 'B',
        text: 'Voluntarily donated by positive Greys who led the inversion.',
        isCorrect: false,
        rationale:
          'Positive Greys had no inversion involvement; material was stolen.',
      },
      {
        label: 'C',
        text: 'Grown only from Red Mercury without any living Grey source.',
        isCorrect: false,
        rationale:
          'Red Mercury is mentioned for gold harvest by parasites; Grey genetics came from stolen positive Grey species.',
      },
      {
        label: 'D',
        text: 'Copied from Betty and Barney Hill\'s star map drawings only.',
        isCorrect: false,
        rationale:
          'Hill star map is staged psyop content; genetics theft predates that narrative fabrication.',
      },
    ],
    hint: 'Stolen from positive Greys + Replica Soul animation.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question:
      'How do Grey ETs administer the reincarnation trap after death?',
    options: [
      {
        label: 'A',
        text: 'Soul hits Amnesia Vortex, processes through portals in the 13 levels below the Vatican; Greys take custody, escort it to a country, and insert it into a newborn at birth — typically before the umbilical cord is cut — using minute Trillivolts to ignite the infant\'s heart.',
        isCorrect: true,
        rationale:
          'After Vortex formatting via Vatican subterranean portals, Greys escort and insert the soul into a newborn before cord cut, sparking the heart with Trillivolts.',
      },
      {
        label: 'B',
        text: 'Souls freely choose any lifetime with no Grey escort ever.',
        isCorrect: false,
        rationale:
          'Strict Grey oversight runs forced reincarnation — not free choice.',
      },
      {
        label: 'C',
        text: 'Only Niberians handle births using Black Void Plasma.',
        isCorrect: false,
        rationale:
          'Grey ETs are primary administrators of the reincarnation system and newborn insertion.',
      },
      {
        label: 'D',
        text: 'G.A.A. runs the Vatican portals to reunite Twin Flames daily.',
        isCorrect: false,
        rationale:
          'Vatican portals serve parasitic factions; Greys keep Twin Flames apart.',
      },
    ],
    hint: 'Vortex → Vatican 13 levels → Grey escort → newborn before cord cut.',
    correctAnswer: 'A',
  },
  {
    number: 15,
    question: 'Why do Greys keep Twin Flames deliberately apart?',
    options: [
      {
        label: 'A',
        text: 'To prevent the generation of positive power that would come from Twin Flame connection under their strict reincarnation oversight.',
        isCorrect: true,
        rationale:
          'Grey oversight of rebirth deliberately separates Twin Flames so they cannot generate positive power together.',
      },
      {
        label: 'B',
        text: 'To help them ascend above 144,000Hz as a couple faster.',
        isCorrect: false,
        rationale:
          'Separation blocks positive power; it is anti-ascension control, not help.',
      },
      {
        label: 'C',
        text: 'Because Replica Souls automatically fuse Twin Flames at birth.',
        isCorrect: false,
        rationale:
          'Replica Souls power Greys/NPCs; Twin Flames of true souls are kept apart on purpose.',
      },
      {
        label: 'D',
        text: 'Only during Project Serpo filming schedules.',
        isCorrect: false,
        rationale:
          'Separation is structural reincarnation policy, not a film-schedule quirk.',
      },
    ],
    hint: 'Block positive power from Twin Flame reunion.',
    correctAnswer: 'A',
  },
  {
    number: 16,
    question: 'What is Phasing Technology as used by Orion Greys/Maitrax?',
    options: [
      {
        label: 'A',
        text: 'Mastery that manipulates matter seamlessly — described as removing a person\'s garments without their awareness — used with Orion constellation portals to travel and sabotage.',
        isCorrect: true,
        rationale:
          'Phasing Technology lets Orion Greys manipulate matter seamlessly (even stripping garments unnoticed) and travel via Orion portals for sabotage ops.',
      },
      {
        label: 'B',
        text: 'Only a ghost-hunting TV camera filter with no real effect.',
        isCorrect: false,
        rationale:
          'It is real matter-manipulation tech used to destroy the Spirit Tree — not a TV filter.',
      },
      {
        label: 'C',
        text: 'A Twin Flame reunion ritual taught in every school.',
        isCorrect: false,
        rationale:
          'Phasing is Grey sabotage capability; Twin Flames are kept apart.',
      },
      {
        label: 'D',
        text: 'Black Void Plasma that only paints stars white.',
        isCorrect: false,
        rationale:
          'Black Void Plasma blacks the night; phasing is matter manipulation by Orion Greys.',
      },
    ],
    hint: 'Seamless matter control — e.g. garments off unnoticed; Orion travel.',
    correctAnswer: 'A',
  },
  {
    number: 17,
    question:
      'What did Maitrax destruction of the Spirit Tree do to Gateway-10?',
    options: [
      {
        label: 'A',
        text: 'Replaced it with a petrified stump, instantly dampening frequencies across all of Gateway-10 so 4th-density parasites could inhabit an environment that would otherwise make them severely ill from high natural vibration.',
        isCorrect: true,
        rationale:
          'Spirit Tree → petrified stump dropped Gateway-10 frequencies so 4th-density parasites could live where high vibe once sickened them.',
      },
      {
        label: 'B',
        text: 'Raised all worlds above 5th density for free Loosh production.',
        isCorrect: false,
        rationale:
          'It dampened frequencies for occupation — opposite of raising density.',
      },
      {
        label: 'C',
        text: 'Only affected Zeta Reticuli textbooks with no physical stump.',
        isCorrect: false,
        rationale:
          'Physical destruction at realm center with system-wide frequency drop is the act.',
      },
      {
        label: 'D',
        text: 'Restored Mt Meru so Custodians could return to 12th density.',
        isCorrect: false,
        rationale:
          'Tree was destroyed for occupation; Custodians had already fallen to 4th density.',
      },
    ],
    hint: 'Petrified stump — frequency drop so 4th-density can occupy.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question: 'Why are Ghosts and hauntings a Grey-managed psyop?',
    options: [
      {
        label: 'A',
        text: 'Paranormal shows and abandoned-location scares are Grey ET Orbs; parasites need every human soul constantly reincarnated in a physical vessel to generate Loosh and do not allow free wandering apparitions.',
        isCorrect: true,
        rationale:
          'Hauntings are Grey Orb theater. Souls must stay in physical vessels generating Loosh — free ghost wandering is not allowed.',
      },
      {
        label: 'B',
        text: 'Because human souls freely roam as ghosts for centuries by design.',
        isCorrect: false,
        rationale:
          'Design forbids free apparitions; constant forced reincarnation feeds Loosh harvest.',
      },
      {
        label: 'C',
        text: 'Because Niberians only film ghosts for entertainment royalties.',
        isCorrect: false,
        rationale:
          'Grey ETs manage the ghost deception entirely as fear-based psychological operation.',
      },
      {
        label: 'D',
        text: 'Because Amnesia Vortex turns all memories into friendly house spirits.',
        isCorrect: false,
        rationale:
          'Vortex wipes memory for rebirth; ghost sightings are Orb fabrications, not house-spirit afterlives.',
      },
    ],
    hint: 'Orbs fake ghosts — souls must stay embodied for Loosh.',
    correctAnswer: 'A',
  },
  {
    number: 19,
    question:
      'What were the Betty and Barney Hill case and Project Serpo in this framework?',
    options: [
      {
        label: 'A',
        text: 'Completely staged psyops — Hill\'s 1950s case introduced the fake Zeta Reticuli star map; Serpo and related events built false chronological foundations for later disclosure theater.',
        isCorrect: true,
        rationale:
          'Hill abduction and Project Serpo are staged psyops installing fake Zeta Reticuli chronology for the broader abduction/UFO mythos.',
      },
      {
        label: 'B',
        text: 'Honest free contact proving natural Grey evolution from Zeta Reticuli.',
        isCorrect: false,
        rationale:
          'Zeta origin is false presentation; Greys are lab-grown automatons under staged narratives.',
      },
      {
        label: 'C',
        text: 'G.A.A. training films for EMF Flash survivors only.',
        isCorrect: false,
        rationale:
          'These are parasitic Grey-ordered fabrications, not G.A.A. training.',
      },
      {
        label: 'D',
        text: 'Proof Twin Flames always reincarnate together after Vatican processing.',
        isCorrect: false,
        rationale:
          'Greys keep Twin Flames apart; Hill/Serpo are abduction mythos psyops.',
      },
    ],
    hint: 'Staged psyops — fake Zeta Reticuli map and Serpo theater.',
    correctAnswer: 'A',
  },
  {
    number: 20,
    question:
      'Why did parasites have Greys build the modern UFO/abduction narrative decades early?',
    options: [
      {
        label: 'A',
        text: 'To establish a deep-seated chronological foundation for the upcoming Fake Alien Invasion (Project Bluebeam).',
        isCorrect: true,
        rationale:
          'Greys abducted selected humans and fed false narratives to prime the population for Project Bluebeam\'s Fake Alien Invasion.',
      },
      {
        label: 'B',
        text: 'To cancel Bluebeam and restore the Spirit Tree publicly.',
        isCorrect: false,
        rationale:
          'Narrative prep serves Bluebeam invasion theater — not Spirit Tree restoration.',
      },
      {
        label: 'C',
        text: 'To teach organic manifestation above 144,000Hz to all NPCs.',
        isCorrect: false,
        rationale:
          'NPCs and Greys cannot ascend that way; abduction mythos is control psyop.',
      },
      {
        label: 'D',
        text: 'To free all souls from the Amnesia Vortex in the 1950s.',
        isCorrect: false,
        rationale:
          '1950s cases deepened the reincarnation/abduction cage narrative, not liberation.',
      },
    ],
    hint: 'Prime the public for Fake Alien Invasion / Project Bluebeam.',
    correctAnswer: 'A',
  },
  {
    number: 21,
    question: 'What is the Vatican\'s role for Greys and other parasites?',
    options: [
      {
        label: 'A',
        text: 'Joint headquarters for all parasitic factions — Omicron, Alpha Draco, Custodians, Anuk, and Greys each govern a dedicated subterranean level among 13 levels operating as luxury slaughterhouses, Adrenochrome harvesting centers, and primary portal hubs.',
        isCorrect: true,
        rationale:
          'Vatican hosts 13 subterranean levels as joint parasitic HQ: faction floors, slaughter/Adrenochrome harvest, and portal access for the realm.',
      },
      {
        label: 'B',
        text: 'A G.A.A. spa that bans all Greys and closes every portal.',
        isCorrect: false,
        rationale:
          'It is parasitic joint HQ with active portal hubs — not a G.A.A. ban zone.',
      },
      {
        label: 'C',
        text: 'Only a library of Project Serpo novels with no subterranean levels.',
        isCorrect: false,
        rationale:
          'Thirteen dedicated subterranean levels are operational control infrastructure.',
      },
      {
        label: 'D',
        text: 'A Twin Flame matchmaking center run by positive Greys.',
        isCorrect: false,
        rationale:
          'Greys separate Twin Flames; Vatican levels harvest and process souls for the trap.',
      },
    ],
    hint: '13 subterranean levels — faction HQ, Adrenochrome, portals.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question:
      'How does Replica Soul tech link Grey ETs to human NPCs?',
    options: [
      {
        label: 'A',
        text: 'The same 4th-density Hive-Aligned Replica Soul tech powers Greys and mass-produces NPC souls — so like Greys, the 97% NPC population has no capacity to ascend into 5th density or beyond.',
        isCorrect: true,
        rationale:
          'Identical 4th-density Replica Soul tech animates Greys and human NPCs; 97% NPCs cannot ascend to 5th density or higher.',
      },
      {
        label: 'B',
        text: 'NPCs use true sung souls while Greys use only sunlight.',
        isCorrect: false,
        rationale:
          'Both Greys and NPCs run on artificial Hive-Aligned Replica Souls.',
      },
      {
        label: 'C',
        text: 'Only 3% of NPCs share Grey tech; 97% are 12th density.',
        isCorrect: false,
        rationale:
          '97% are NPCs on Replica Souls with no 5th-density ascent capacity.',
      },
      {
        label: 'D',
        text: 'Replica Souls automatically upgrade all NPCs at Bluebeam.',
        isCorrect: false,
        rationale:
          'Bluebeam is invasion theater; Replica-Soul beings are removed at EMF restoration, not upgraded.',
      },
    ],
    hint: 'Same Hive Replica Souls — Greys and 97% NPCs cannot ascend 5th+.',
    correctAnswer: 'A',
  },
  {
    number: 23,
    question:
      'Why are parasites permanently constrained by 4th-density origins?',
    options: [
      {
        label: 'A',
        text: 'No negative parasite except fallen Custodians ever existed above 4th density, where survival requires killing and consumption; below 144,000Hz needed for 5th density they cannot organically manifest and rely on mechanical extraction, Red Mercury gold harvest, human sweat equity, and Loosh.',
        isCorrect: true,
        rationale:
          'Parasites (save fallen Custodians\' origin story) max at 4th density kill/consume survival, cannot hit 5th-density 144,000Hz organic manifestation, and depend on Loosh and mechanical harvest methods.',
      },
      {
        label: 'B',
        text: 'They freely live above 5th density singing true souls daily.',
        isCorrect: false,
        rationale:
          'They cannot organically manifest or weave true souls; Replica Souls and harvest define them.',
      },
      {
        label: 'C',
        text: 'They only need ghost orbs and never harvest Loosh or gold.',
        isCorrect: false,
        rationale:
          'Loosh, sweat equity, and Red Mercury gold extraction are named survival methods.',
      },
      {
        label: 'D',
        text: 'They already operate at 144,000Hz as standard factory setting.',
        isCorrect: false,
        rationale:
          'They operate well below the 144,000Hz required for 5th-density existence.',
      },
    ],
    hint: 'Stuck ≤4th density — below 144,000Hz; Loosh and mechanical harvest.',
    correctAnswer: 'A',
  },
  {
    number: 24,
    question:
      'What happens to Grey ETs and parasitic/NPC extensions at the EMF Flash?',
    options: [
      {
        label: 'A',
        text: 'Created in 4th density, they are instantly pixelated and removed from the simulation when higher dimensional architecture is restored under G.A.A. orchestration of the EMF Flash.',
        isCorrect: true,
        rationale:
          'EMF Flash under G.A.A. restores higher architecture; 4th-density Greys, masters, and NPC extensions pixelate out of the simulation instantly.',
      },
      {
        label: 'B',
        text: 'They ascend to 12th density as permanent caretakers again.',
        isCorrect: false,
        rationale:
          'Eradication is assured — pixelated removal, not reinstatement as caretakers.',
      },
      {
        label: 'C',
        text: 'They hide forever as friendly ghosts in abandoned buildings.',
        isCorrect: false,
        rationale:
          'Ghost act was their psyop; EMF removes them rather than immortalizing the act.',
      },
      {
        label: 'D',
        text: 'Only Project Serpo films survive while Greys keep reincarnating humans.',
        isCorrect: false,
        rationale:
          'Forced reincarnation cycle ends with total parasite removal from simulations.',
      },
    ],
    hint: 'EMF Flash — 4th-density Greys/NPCs pixelated out.',
    correctAnswer: 'A',
  },
  {
    number: 25,
    question:
      'What ends when parasites are totally removed from all simulations?',
    options: [
      {
        label: 'A',
        text: 'The 178,000-year cycle of forced reincarnation and torture is permanently concluded.',
        isCorrect: true,
        rationale:
          'Total parasite removal permanently ends the 178,000-year forced reincarnation and torture cycle.',
      },
      {
        label: 'B',
        text: 'A new 178,000-year Bluebeam tour begins under Grey management.',
        isCorrect: false,
        rationale:
          'Bluebeam is part of the dying control script; the cycle concludes, not renews under Greys.',
      },
      {
        label: 'C',
        text: 'Only Twin Flame separation becomes permanent law forever.',
        isCorrect: false,
        rationale:
          'Grey separation apparatus ends with their eradication — the torture reincarnation cycle concludes.',
      },
      {
        label: 'D',
        text: 'Replica Souls become the only legal souls above 5th density.',
        isCorrect: false,
        rationale:
          'Replica-Soul constructs are removed with the 4th-density grid; true cycle of forced rebirth ends.',
      },
    ],
    hint: '178,000-year forced reincarnation and torture — permanently over.',
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
  'Test your grasp of Grey ETs — Custodian engineering, Orion Greys and Zetas, Replica Souls, Amnesia Vortex rebirth, ghost orbs, Spirit Tree sabotage, and EMF pixelation.';
const DESC_META =
  'Interactive Living Truth Quiz on Grey ETs: Custodian betrayal, Niberians, Maitrax phasing, Vatican portals, Twin Flame separation, abduction psyops, Project Bluebeam prep, NPC Replica Souls, and G.A.A. EMF eradication.';

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
      'Grey ETs are not curious neighbors from Zeta Reticuli — they are lab-grown 4th-density automatons from Custodian betrayal, powered by cheap Hive Replica Souls stolen from positive Grey genetics. Orion Maitrax phased the Spirit Tree into a stump; Greys run Sun-portal amnesia, Vatican escort rebirth, Twin Flame separation, ghost-orb theater, and staged abductions for Bluebeam. Sit with what you missed, then return to the Grey ETs deep-dive. Same Replica Soul tech drives 97% NPCs. Parasites cannot sing life or live above their kill-consume band. At the G.A.A. EMF Flash they pixelate out — and 178,000 years of forced reincarnation torture ends for good.',
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
      "  { path: '/quiz/alice/giant-skeletons.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/gateway-10-system.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/frequency-fences.html', priority: '0.75', changefreq: 'monthly' },",
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
[0, 5, 12, 16, 20, 24].forEach((i) => {
  const c = questions[i].options.find((o) => o.isCorrect);
  console.log(` Q${questions[i].number}: ${c.text.slice(0, 110)}`);
});
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('PASS: audited 25/25 against data/alice-topics/grey-ets.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
