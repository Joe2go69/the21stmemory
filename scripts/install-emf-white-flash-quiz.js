/**
 * Installs EMF White Flash quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/emf-white-flash.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-emf-white-flash-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'emf-white-flash';
const TOPIC_TITLE = 'EMF White Flash';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/emf-white-flash.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['emf', 'white flash', 'ascension'],
  2: ['30-second', 'bright white', '97%'],
  3: ['97%', 'population', 'veils'],
  4: ['178,000', 'memories', 'cosmic'],
  5: ['ascension event', 'memories', 'cosmic family'],
  6: ['g.a.a', 'galactic ancestral', 'overlays'],
  7: ['overlays', 'parasitic', 'architecture'],
  8: ['npc', '4th density', '97%'],
  9: ['ebs', 'precedes', 'atrocities'],
  10: ['bluebeam', 'fake alien', 'scare'],
  11: ['100', 'three', '3'],
  12: ['520 million', 'maximum', 'population'],
  13: ['clones', 'inserts', '4th density'],
  14: ['178,000', 'singularly', 'memories'],
  15: ['children', 'animals', 'ascend'],
  16: ['ebs', 'bluebeam', 'locked down'],
  17: ['terror', 'abduction', 'invasion'],
  18: ['precisely 30', '30 seconds', 'white light'],
  19: ['g.a.a', 'overlays', '30 seconds'],
  20: ['3%', 'pixelated', 'scaffolding'],
  21: ['nuclear', 'energy weapon', 'survivors'],
  22: ['178,000', 'custodians', 'anuk'],
  23: ['scare events', 'soul-architecture', 'hardwired'],
  24: ['lattice membrane', 'ley lines', 'tartarian'],
  25: ['religion', 'finance', 'perceived knowledge'],
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
    question: 'What is the EMF White Flash in the architecture of the awakening?',
    options: [
      {
        label: 'A',
        text: 'The culminating catalyst of the Great Spiritual Awakening and the planetary Ascension Event — a purge of the false reality matrix during intense global psychological trauma.',
        isCorrect: true,
        rationale:
          'EMF White Flash is the climax catalyst of awakening and Ascension, purging the false matrix under peak trauma.',
      },
      {
        label: 'B',
        text: 'A minor weather phenomenon that only dims streetlights with no demographic or overlay effect.',
        isCorrect: false,
        rationale:
          'It radically alters physical and demographic structure and strips perceptual veils.',
      },
      {
        label: 'C',
        text: 'Only a bank holiday that freezes Finance String accounts without any white light or population change.',
        isCorrect: false,
        rationale:
          'It is an Electro Magnetic Frequency white-light event that removes 97% and liberates true souls.',
      },
      {
        label: 'D',
        text: 'A permanent Amnesia Vortex upgrade that seals 178,000 years of memory forever after the flash.',
        isCorrect: false,
        rationale:
          'The Flash returns ancient memories to survivors; it does not seal them away.',
      },
    ],
    hint: 'Culminating catalyst of awakening and Ascension — matrix purge.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'What is the EMF / The Flash as a defined event?',
    options: [
      {
        label: 'A',
        text: 'A multi-year dimming of the sky with no timed duration and no population removal.',
        isCorrect: false,
        rationale:
          'It is a 30-second bright white light that instantly removes 97% of the planetary population.',
      },
      {
        label: 'B',
        text: 'A 30-second event of bright white light that radically alters the physical realm and instantly removes 97% of the planetary population.',
        isCorrect: true,
        rationale:
          'Flash = precisely 30 seconds of bright white light; realm altered; 97% removed.',
      },
      {
        label: 'C',
        text: 'A private meditation only NPCs notice while true souls remain fully unaffected.',
        isCorrect: false,
        rationale:
          'NPCs are deleted; true souls remain and receive memory restoration and liberation.',
      },
      {
        label: 'D',
        text: 'Only Project Bluebeam holography with no Electro Magnetic Frequency component at all.',
        isCorrect: false,
        rationale:
          'Bluebeam is the precursor scare; the Flash itself is the 30-second EMF white light.',
      },
    ],
    hint: '30-second bright white light — removes 97%.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question: 'What happens to global population and perception during this brief window?',
    options: [
      {
        label: 'A',
        text: 'Population doubles and every overlay becomes twice as opaque with no veil removal.',
        isCorrect: false,
        rationale:
          '97% disappear instantly and perceptual veils hiding the true realm are removed.',
      },
      {
        label: 'B',
        text: 'Only fashion trends change while demographic structure and veils stay fully intact.',
        isCorrect: false,
        rationale:
          'Physical and demographic structure is radically altered; veils come down.',
      },
      {
        label: 'C',
        text: 'Instant disappearance of 97% of the global population and removal of the perceptual veils hiding the true nature of the realm.',
        isCorrect: true,
        rationale:
          '97% gone + veils removed = radical demographic and perceptual shift in the 30-second window.',
      },
      {
        label: 'D',
        text: 'Only animals vanish while every adult NPC remains embodied with full herd pressure intact.',
        isCorrect: false,
        rationale:
          'NPCs are the 97% deleted; children and animals automatically ascend with the true-soul remnant track.',
      },
    ],
    hint: '97% disappear — perceptual veils come down.',
    correctAnswer: 'C',
  },
  {
    number: 4,
    question: 'What does the event do for the remaining true souls?',
    options: [
      {
        label: 'A',
        text: 'Permanently seals all memory so cosmic families stay unknown for another 178,000 years.',
        isCorrect: false,
        rationale:
          'It liberates them, returns ancient memories, and reunites them with cosmic families after 178,000 years.',
      },
      {
        label: 'B',
        text: 'Converts them into NPCs so herd pressure can continue under a new brand of overlay.',
        isCorrect: false,
        rationale:
          'NPCs are deleted; true souls are liberated and restored.',
      },
      {
        label: 'C',
        text: 'Only updates Finance String balances with no memory return or family reunification.',
        isCorrect: false,
        rationale:
          'Liberation includes memory return and cosmic family reunion after the long subjugation.',
      },
      {
        label: 'D',
        text: 'Liberates them — returning their ancient memories and reuniting them with their cosmic families after 178,000 years of subjugation.',
        isCorrect: true,
        rationale:
          'Surviving true souls get memory back and cosmic family reunion after 178,000 years.',
      },
    ],
    hint: 'Liberate true souls — memory + cosmic family after 178,000 years.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question: 'What is the Ascension Event relative to the Flash?',
    options: [
      {
        label: 'A',
        text: 'A simultaneous, species-wide evolutionary leap where original memories are restored and individuals reunite with their true cosmic family.',
        isCorrect: true,
        rationale:
          'Ascension Event = species-wide leap: memories restored, cosmic family reunion — timed with the Flash climax.',
      },
      {
        label: 'B',
        text: 'A slow individual hobby of reading textbooks with no species-wide or memory-restoration component.',
        isCorrect: false,
        rationale:
          'It is simultaneous and species-wide, not a solitary textbook hobby.',
      },
      {
        label: 'C',
        text: 'Only the Fake Alien Invasion with no evolutionary leap or memory restoration involved.',
        isCorrect: false,
        rationale:
          'Bluebeam is a precursor scare; Ascension is the memory-and-family leap with the Flash.',
      },
      {
        label: 'D',
        text: 'A permanent lockdown under EBS that never ends and never restores any cosmic identity.',
        isCorrect: false,
        rationale:
          'EBS precedes the Flash; Ascension restores memories and cosmic family bonds.',
      },
    ],
    hint: 'Species-wide leap — memories restored, cosmic family reunion.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'What is the G.A.A. (Galactic Ancestral Alliance) role in the Flash?',
    options: [
      {
        label: 'A',
        text: 'A parasitic bank consortium that only manages debt products during the white light.',
        isCorrect: false,
        rationale:
          'G.A.A. is the benevolent ET alliance that initiates the EMF and strips false layers of reality.',
      },
      {
        label: 'B',
        text: 'The benevolent extraterrestrial alliance responsible for initiating the EMF and stripping away the false layers of reality.',
        isCorrect: true,
        rationale:
          'G.A.A. initiates the Flash and strips overlays/false layers during those 30 seconds.',
      },
      {
        label: 'C',
        text: 'Only the Grey manufacturing wing that rebuilds NPCs immediately after the light fades.',
        isCorrect: false,
        rationale:
          'NPCs are permanently deleted; G.A.A. is benevolent liberation architecture, not Grey rebuild.',
      },
      {
        label: 'D',
        text: 'A terrestrial news network that never touches overlays or planetary frequency events.',
        isCorrect: false,
        rationale:
          'G.A.A. actively initiates EMF and strips false reality layers.',
      },
    ],
    hint: 'Benevolent alliance — initiates EMF and strips false layers.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question: 'What are Overlays in this architecture?',
    options: [
      {
        label: 'A',
        text: 'Natural cloud cover with no parasitic purpose and no link to hidden architecture.',
        isCorrect: false,
        rationale:
          'Overlays are projected frequencies used by parasites to augment perception and hide true layout.',
      },
      {
        label: 'B',
        text: 'Only paper posters in museums that never affect matter perception or realm layout.',
        isCorrect: false,
        rationale:
          'They are projected frequency layers blanketing the realm until dismantled in the Flash.',
      },
      {
        label: 'C',
        text: 'Projected frequencies used by parasitic entities to augment perception of matter, obscure original architecture, and hide the true layout of the realm — dismantled during the Flash.',
        isCorrect: true,
        rationale:
          'Overlays = parasitic projected frequencies hiding true architecture until G.A.A. strips them.',
      },
      {
        label: 'D',
        text: 'Permanent crystal coatings that protect Tartarian temples from ever becoming visible.',
        isCorrect: false,
        rationale:
          'Flash unveils Tartarian Crystalline Temples once overlays and dampening are removed.',
      },
    ],
    hint: 'Parasitic projected frequencies — hide true layout until the Flash.',
    correctAnswer: 'C',
  },
  {
    number: 8,
    question: 'What are NPCs relative to the EMF outcome?',
    options: [
      {
        label: 'A',
        text: 'The only beings who ascend with full cosmic family reunion as the 3% remnant.',
        isCorrect: false,
        rationale:
          'NPCs are 97% permanently deleted; they lack capacity to ascend beyond 4th density.',
      },
      {
        label: 'B',
        text: 'True Taran souls who always survive the Flash with automatic nuclear-blast immunity.',
        isCorrect: false,
        rationale:
          'Surviving 3% are often true Taran souls; NPCs are synthetic replicas that vanish.',
      },
      {
        label: 'C',
        text: 'Only animals and children who automatically ascend without any deletion risk.',
        isCorrect: false,
        rationale:
          'Children and animals ascend; NPCs are the synthetic 97% permanently deleted.',
      },
      {
        label: 'D',
        text: 'Synthetic, hive-aligned replica souls created in the 4th density who make up 97% of the population and will be permanently deleted during the EMF.',
        isCorrect: true,
        rationale:
          'NPCs = 97% 4th-density synthetic replicas — permanently deleted in the Flash.',
      },
    ],
    hint: '97% 4th-density synthetics — permanently deleted in the Flash.',
    correctAnswer: 'D',
  },
  {
    number: 9,
    question: 'What is the EBS relative to the timing of the EMF?',
    options: [
      {
        label: 'A',
        text: 'A global lockdown and information broadcast phase detailing historical atrocities, which immediately precedes the EMF.',
        isCorrect: true,
        rationale:
          'EBS is the atrocity-broadcast lockdown phase that hits immediately before the Flash.',
      },
      {
        label: 'B',
        text: 'A soft weather report that follows the Flash by several years with no lockdown component.',
        isCorrect: false,
        rationale:
          'EBS precedes the EMF while the world is locked down under that broadcast phase.',
      },
      {
        label: 'C',
        text: 'Only a banking reform that replaces all atrocity disclosure with debt-forgiveness ads.',
        isCorrect: false,
        rationale:
          'EBS details historical atrocities; it is not a debt-ad campaign.',
      },
      {
        label: 'D',
        text: 'The name of the Overlay software that G.A.A. installs permanently after the light fades.',
        isCorrect: false,
        rationale:
          'Overlays are stripped during the Flash; EBS is the precursor broadcast lockdown.',
      },
    ],
    hint: 'Atrocity broadcast lockdown — immediately precedes the EMF.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'What is Project Bluebeam in the sequence before the Flash?',
    options: [
      {
        label: 'A',
        text: 'A gentle meditation app that lowers fear so no scare event is needed before the light.',
        isCorrect: false,
        rationale:
          'Bluebeam projects a Fake Alien Invasion as a scare event right before the Flash.',
      },
      {
        label: 'B',
        text: 'Advanced holographic technology utilized to project a Fake Alien Invasion in the sky, serving as a scare event right before the Flash occurs.',
        isCorrect: true,
        rationale:
          'Project Bluebeam = holographic Fake Alien Invasion scare immediately before the EMF.',
      },
      {
        label: 'C',
        text: 'The permanent deletion software that only removes children and animals during the light.',
        isCorrect: false,
        rationale:
          'Children and animals ascend; Bluebeam is the fake invasion precursor, not deletion of the uncorrupted.',
      },
      {
        label: 'D',
        text: 'A Lattice Membrane upgrade that already reveals Tartarian temples before any flash.',
        isCorrect: false,
        rationale:
          'Temple and lattice unveil comes from stripping overlays during the Flash, not Bluebeam holography.',
      },
    ],
    hint: 'Holographic Fake Alien Invasion — scare event right before the Flash.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question: 'What is the survival ratio after the light dissipates?',
    options: [
      {
        label: 'A',
        text: 'Ninety-seven of every hundred remain while only three vanish as a minor correction.',
        isCorrect: false,
        rationale:
          'For every 100 people before the Flash, only three remain after the light dissipates.',
      },
      {
        label: 'B',
        text: 'Exactly half remain with no special meaning for the 97% synthetic demographic.',
        isCorrect: false,
        rationale:
          'Only three of one hundred remain; the 97% erased are NPCs/clones/inserts.',
      },
      {
        label: 'C',
        text: 'For every 100 people present before the Flash, only three will remain after the light dissipates.',
        isCorrect: true,
        rationale:
          '3 of 100 remain — the concrete ratio of the 97% eradication.',
      },
      {
        label: 'D',
        text: 'All 100 remain embodied while only buildings pixelate with no human disappearance.',
        isCorrect: false,
        rationale:
          'Human demographic structure is radically altered: 97% disappear instantly.',
      },
    ],
    hint: '3 of every 100 remain after the light.',
    correctAnswer: 'C',
  },
  {
    number: 12,
    question: 'What maximum global population remains after the Flash?',
    options: [
      {
        label: 'A',
        text: 'Billions more than today as NPCs are mass-printed during the white light.',
        isCorrect: false,
        rationale:
          'Population reduces to a maximum of 520 million people.',
      },
      {
        label: 'B',
        text: 'Exactly zero true souls with only Greys left managing empty cities forever.',
        isCorrect: false,
        rationale:
          'Up to 520 million survivors remain — true souls liberated, not zero.',
      },
      {
        label: 'C',
        text: 'An unlimited count because the Flash permanently multiplies every Taran vessel.',
        isCorrect: false,
        rationale:
          'The named maximum remnant is 520 million people.',
      },
      {
        label: 'D',
        text: 'A maximum of 520 million people after the 97% disappearance.',
        isCorrect: true,
        rationale:
          'Global population caps at about 520 million once the 97% are gone.',
      },
    ],
    hint: 'Maximum about 520 million survivors.',
    correctAnswer: 'D',
  },
  {
    number: 13,
    question: 'Who are the 97% who disappear, and why can they not ascend?',
    options: [
      {
        label: 'A',
        text: 'Not true souls — clones, inserts, and NPCs manufactured by parasitic overlords who lack the capacity to ascend beyond the 4th density.',
        isCorrect: true,
        rationale:
          '97% = manufactured clones/inserts/NPCs; capped at 4th density; permanently deleted.',
      },
      {
        label: 'B',
        text: 'True cosmic family elders who volunteer to leave so NPCs can inherit the planet.',
        isCorrect: false,
        rationale:
          'True souls remain; synthetic 97% are erased as non-ascending constructs.',
      },
      {
        label: 'C',
        text: 'Only animals that failed a loyalty test with full true-soul status otherwise intact.',
        isCorrect: false,
        rationale:
          'Animals automatically ascend; the deleted 97% are synthetic human-appearing constructs.',
      },
      {
        label: 'D',
        text: 'Survivors of nuclear blasts who only appear gone due to temporary overlay glitches.',
        isCorrect: false,
        rationale:
          'Disappearance is permanent deletion of non-true-soul population, not a glitch or nuke myth.',
      },
    ],
    hint: 'Clones, inserts, NPCs — cannot ascend beyond 4th density.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question: 'How are 178,000 years of missing memories returned to survivors?',
    options: [
      {
        label: 'A',
        text: 'Never — all memory stays sealed so psychological trauma remains zero forever.',
        isCorrect: false,
        rationale:
          'Memories return in one block but are accessed singularly as needed to prevent overwhelm.',
      },
      {
        label: 'B',
        text: 'Returned in one block but accessed singularly as needed — preventing overwhelming psychological trauma while restoring the full missing span.',
        isCorrect: true,
        rationale:
          'One-block return, singular access as needed — full 178,000 years without fatal overwhelm.',
      },
      {
        label: 'C',
        text: 'Only via university night classes graded by pre-Flash experts still defending the globe.',
        isCorrect: false,
        rationale:
          'Return is instant event-driven restoration to true souls, not schooled re-indoctrination.',
      },
      {
        label: 'D',
        text: 'Dumped all at once with mandatory fatal overload as the intentional design outcome.',
        isCorrect: false,
        rationale:
          'Access is singular as needed specifically to prevent overwhelming trauma.',
      },
    ],
    hint: 'One block returned — accessed singularly as needed.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question: 'What happens to all children and animals during this event?',
    options: [
      {
        label: 'A',
        text: 'They are permanently deleted with the 97% because they carry the deepest false beliefs.',
        isCorrect: false,
        rationale:
          'They automatically ascend — uncorrupted by societal programming, without inherent guilt or false beliefs.',
      },
      {
        label: 'B',
        text: 'They remain as NPC herd enforcers while only adult Tarans may leave the matrix.',
        isCorrect: false,
        rationale:
          'Children and animals ascend automatically; they are not left as herd enforcers.',
      },
      {
        label: 'C',
        text: 'They automatically ascend — uncorrupted by societal programming and carrying no inherent guilt or false beliefs.',
        isCorrect: true,
        rationale:
          'Uncorrupted children and animals auto-ascend in the event.',
      },
      {
        label: 'D',
        text: 'They are frozen in EBS lockdown forever with no path into the Ascension Event.',
        isCorrect: false,
        rationale:
          'Ascension includes their automatic rise; EBS is only the precursor phase.',
      },
    ],
    hint: 'Children and animals automatically ascend — uncorrupted.',
    correctAnswer: 'C',
  },
  {
    number: 16,
    question: 'What is the strictly orchestrated precursor sequence before the 30-second flash?',
    options: [
      {
        label: 'A',
        text: 'A quiet decade of free-energy classes with no lockdown, no holography, and no terror design.',
        isCorrect: false,
        rationale:
          'EMF strikes under EBS lockdown after a highly realistic Fake Alien Invasion via Project Bluebeam.',
      },
      {
        label: 'B',
        text: 'Only a stock market holiday that never involves sky battles or atrocity broadcasts.',
        isCorrect: false,
        rationale:
          'Sequence is EBS lockdown plus Bluebeam fake invasion scare, then the Flash.',
      },
      {
        label: 'C',
        text: 'Immediate pineal upgrades for NPCs with no Scare Event trauma required at all.',
        isCorrect: false,
        rationale:
          'Scare Events are required trauma; NPC deletion is the Flash outcome, not NPC upgrades.',
      },
      {
        label: 'D',
        text: 'World locked down under the EBS, then a highly realistic fake holographic sky battle — the Fake Alien Invasion via Project Bluebeam — then the EMF strikes.',
        isCorrect: true,
        rationale:
          'EBS lockdown → Bluebeam fake invasion → 30-second EMF Flash.',
      },
    ],
    hint: 'EBS lockdown → Bluebeam invasion scare → Flash.',
    correctAnswer: 'D',
  },
  {
    number: 17,
    question: 'What psychological state is the population in when the Flash hits?',
    options: [
      {
        label: 'A',
        text: 'Sheer terror — fleeing from perceived extraterrestrial abduction during the fake invasion scare.',
        isCorrect: true,
        rationale:
          'Peak terror from the holographic abduction scare is the designed state when EMF hits.',
      },
      {
        label: 'B',
        text: 'Calm academic curiosity with no fear and no fleeing from any perceived craft.',
        isCorrect: false,
        rationale:
          'Population is already in sheer terror from the Fake Alien Invasion sequence.',
      },
      {
        label: 'C',
        text: 'Celebratory Finance rallies celebrating debt forgiveness as the only global focus.',
        isCorrect: false,
        rationale:
          'Scare Events drive terror and trauma hardwiring, not finance celebrations.',
      },
      {
        label: 'D',
        text: 'Deep sleep under Amnesia Vortex with no conscious perception of sky events at all.',
        isCorrect: false,
        rationale:
          'They are conscious, terrified, and fleeing perceived abduction when the light hits.',
      },
    ],
    hint: 'Sheer terror — fleeing perceived ET abduction.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question: 'How long does the bright white EMF light last?',
    options: [
      {
        label: 'A',
        text: 'Approximately three days of continuous dusk with no precise second count.',
        isCorrect: false,
        rationale:
          'The EMF itself is a bright white light that lasts for precisely 30 seconds.',
      },
      {
        label: 'B',
        text: 'Precisely 30 seconds — the defined duration of the bright white Flash.',
        isCorrect: true,
        rationale:
          'Duration is exactly 30 seconds of bright white light.',
      },
      {
        label: 'C',
        text: 'Thirty years of soft glow while overlays slowly peel with no sudden purge.',
        isCorrect: false,
        rationale:
          'It is a brief 30-second window of radical alteration, not a multi-decade glow.',
      },
      {
        label: 'D',
        text: 'Only one camera flash lasting under a single second with no realm-wide effect.',
        isCorrect: false,
        rationale:
          'Thirty full seconds of planetary bright white light alter realm and demographics.',
      },
    ],
    hint: 'Precisely 30 seconds of bright white light.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question: 'What does the G.A.A. do during those 30 seconds?',
    options: [
      {
        label: 'A',
        text: 'Installs thicker Overlays so Tartarian temples stay hidden another 178,000 years.',
        isCorrect: false,
        rationale:
          'G.A.A. strips the layers of Overlays that have blanketed the realm.',
      },
      {
        label: 'B',
        text: 'Rebuilds every NPC factory so the 97% return before the light fully fades.',
        isCorrect: false,
        rationale:
          'NPCs are permanently deleted; G.A.A. strips overlays rather than rebuilding synthetics.',
      },
      {
        label: 'C',
        text: 'Strips the layers of Overlays that have blanketed the realm throughout the 30-second window.',
        isCorrect: true,
        rationale:
          'During the Flash, G.A.A. dismantles the overlay blanket on the realm.',
      },
      {
        label: 'D',
        text: 'Only broadcasts stock tickers with no frequency or overlay work of any kind.',
        isCorrect: false,
        rationale:
          'Core action is stripping overlays that obscured true architecture and layout.',
      },
    ],
    hint: 'G.A.A. strips Overlays during the 30 seconds.',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question: 'What do the remaining 3% survivors see when the light fades?',
    options: [
      {
        label: 'A',
        text: 'A perfectly unchanged cityscape with every NPC still present and no pixelation at all.',
        isCorrect: false,
        rationale:
          'They stand in a dramatically altered environment with bleed-thru scaffolding and semi-pixelated buildings.',
      },
      {
        label: 'B',
        text: 'Only a restored Amnesia Vortex tunnel with no environmental change on the ground.',
        isCorrect: false,
        rationale:
          'Aftermath is altered environment, scaffolding bleed-thru, and semi-pixelated infrastructure.',
      },
      {
        label: 'C',
        text: 'A full return of pre-occupation Tartaria with zero ruined infrastructure visible anywhere.',
        isCorrect: false,
        rationale:
          'They first see devastation and ruined infrastructure exposed by overlay removal.',
      },
      {
        label: 'D',
        text: 'A dramatically altered environment — bleed-thru scaffolding and semi-pixelated buildings — often true Taran souls standing in the remnant 3%.',
        isCorrect: true,
        rationale:
          '3% (often Tarans) face altered realm with scaffolding bleed-thru and semi-pixelated builds.',
      },
    ],
    hint: 'Altered realm — scaffolding bleed-thru, semi-pixelated buildings.',
    correctAnswer: 'D',
  },
  {
    number: 21,
    question: 'What will survivors initially assume caused the devastation?',
    options: [
      {
        label: 'A',
        text: 'That they survived a nuclear blast or extraterrestrial energy weapon attack — misreading overlay removal as conventional or ET munitions devastation.',
        isCorrect: true,
        rationale:
          'Intense ruined infrastructure after overlays fall is first read as nuke or ET energy-weapon aftermath.',
      },
      {
        label: 'B',
        text: 'That nothing happened and every building is fully intact with no need for any explanation.',
        isCorrect: false,
        rationale:
          'They witness dramatic alteration and assume catastrophic attack explanations first.',
      },
      {
        label: 'C',
        text: 'That Finance String reforms alone rearranged every skyline without any flash involved.',
        isCorrect: false,
        rationale:
          'Assumption tracks nuclear or ET energy-weapon frames, not banking reforms.',
      },
      {
        label: 'D',
        text: 'That children painted the pixelation as art while NPCs staged a harmless drill.',
        isCorrect: false,
        rationale:
          'Devastation reading is severe trauma misinterpretation of true overlay strip aftermath.',
      },
    ],
    hint: 'First assumption — nuclear blast or ET energy weapon.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question: 'What long occupation cycle does the EMF White Flash finally end?',
    options: [
      {
        label: 'A',
        text: 'A ten-year media cycle about sports with no link to Custodians or parasitic species.',
        isCorrect: false,
        rationale:
          'It ends a 178,000-year period of aberration and enslavement by Custodians, Anuk/Anunnaki, and Greys.',
      },
      {
        label: 'B',
        text: 'A 178,000-year period of aberration and enslavement initiated by the Custodians and other negative parasitic species such as the Anuk (Anunnaki) and Greys.',
        isCorrect: true,
        rationale:
          'Flash ends the 178,000-year Custodian/Anuk/Grey enslavement aberration.',
      },
      {
        label: 'C',
        text: 'Only the EBS week with no connection to longer parasitic occupation history.',
        isCorrect: false,
        rationale:
          'EBS is a precursor; the Flash terminates the multi-millennial occupation cycle.',
      },
      {
        label: 'D',
        text: 'The voluntary vacation of all true souls who left before any Custodian inversion began.',
        isCorrect: false,
        rationale:
          'True souls were subjugated 178,000 years; the Flash liberates the remnant after that span.',
      },
    ],
    hint: 'Ends 178,000 years of Custodian/Anuk/Grey enslavement.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question: 'Why must surviving humans undergo severe Scare Event trauma?',
    options: [
      {
        label: 'A',
        text: 'So they forget the occupation completely and remain open to a future inversion offer.',
        isCorrect: false,
        rationale:
          'Trauma hardwires the horrific memory into soul-architecture so such inversion never happens again.',
      },
      {
        label: 'B',
        text: 'Only to entertain NPCs who remain after the Flash as the permanent majority.',
        isCorrect: false,
        rationale:
          'NPCs are deleted; trauma is for surviving true souls\' eternal soul-architecture branding.',
      },
      {
        label: 'C',
        text: 'So the horrific memory of parasitic subjugation is hardwired into their soul-architecture — guaranteeing such an inversion of the physical plain never happens again.',
        isCorrect: true,
        rationale:
          'Scare Events brand anti-inversion memory into soul-architecture for eternity.',
      },
      {
        label: 'D',
        text: 'Because pineal manifestation only works if survivors refuse to remember any subjugation.',
        isCorrect: false,
        rationale:
          'Memory of subjugation is intentionally hardwired; healing still restores higher abilities afterward.',
      },
    ],
    hint: 'Hardwire parasitic-subjugation memory into soul-architecture forever.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question: 'What true architecture does removing the Overlays unveil?',
    options: [
      {
        label: 'A',
        text: 'Only deeper blackness confirming infinite vacuum with no lattice, ley lines, or temples.',
        isCorrect: false,
        rationale:
          'It unveils Lattice Membrane Network, Ley Lines, and remnants of Tartarian Crystalline Temples.',
      },
      {
        label: 'B',
        text: 'A permanent Finance dashboard with no Firmament, no stationary plain, and no temple remnants.',
        isCorrect: false,
        rationale:
          'Survivors can then shed linear time, gravity, and space illusions toward stationary plain under Firmament.',
      },
      {
        label: 'C',
        text: 'Only NPC factories rebuilt underground with no energetic grid visibility of any kind.',
        isCorrect: false,
        rationale:
          'Overlay removal reveals lattice, ley lines, and indestructible Tartarian temple remnants.',
      },
      {
        label: 'D',
        text: 'The true Lattice Membrane Network, energetic Ley Lines, and remnants of indestructible Tartarian Crystalline Temples — paving the way to shed illusions of linear time, gravity, and space and comprehend a stationary physical plane beneath a Firmament.',
        isCorrect: true,
        rationale:
          'Lattice, ley lines, Tartarian temples unveiled → path to true stationary plain under Firmament.',
      },
    ],
    hint: 'Lattice, Ley Lines, Tartarian temples — true plain under Firmament.',
    correctAnswer: 'D',
  },
  {
    number: 25,
    question: 'What control stack does the Flash neutralize, and what opens for the ~520 million survivors?',
    options: [
      {
        label: 'A',
        text: 'Neutralizes the three strings — Religion, Finance, and Perceived Knowledge — erases 97% herd pressure, and initiates profound healing with restoration of higher-density abilities such as generating physical matter through sustained intention and harmony via the Pineal Gland.',
        isCorrect: true,
        rationale:
          'Three Strings + NPC herd pressure fall; survivors heal into pineal manifestation and original benevolent state.',
      },
      {
        label: 'B',
        text: 'Strengthens all three strings so survivors must double down on church, banks, and textbooks forever.',
        isCorrect: false,
        rationale:
          'Flash effectively neutralizes Religion, Finance, and Perceived Knowledge as control mechanisms.',
      },
      {
        label: 'C',
        text: 'Only removes animals while leaving full deep-state herd conformity pressure intact for adults.',
        isCorrect: false,
        rationale:
          'Erasure of 97% NPCs removes the societal herd pressure that forced conformity.',
      },
      {
        label: 'D',
        text: 'Locks pineal function offline permanently so no survivor can ever generate matter by intention.',
        isCorrect: false,
        rationale:
          'Parasitic influence removal restores natural higher-density abilities including pineal manifestation.',
      },
    ],
    hint: 'Three Strings down — herd pressure gone — pineal higher abilities restored.',
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
  'Test your grasp of EMF White Flash — 30-second purge, 97% NPC deletion, G.A.A. overlay strip, and liberation of true souls.';
const DESC_META =
  'Interactive Living Truth Quiz on EMF White Flash: EBS and Bluebeam precursors, 520 million survivors, memory return, Scare Events, Lattice unveiling, and Three Strings neutralization.';

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
      'Thirty seconds of bright white light. That is the Flash. EBS locks the world. Bluebeam fakes the invasion. Terror peaks. Then the light. Ninety-seven of every hundred are gone — clones, inserts, NPCs who could not rise past 4th density. About 520 million true souls remain. Overlays fall. Scaffolding bleeds through. Buildings look half-pixelated. You will think nuke or ET weapon first. Then memory returns — 178,000 years, one block, accessed as you can bear it. Children and animals already rose. Lattice, ley lines, Tartarian temples show. Religion, Finance, and Perceived Knowledge lose their herd. Pineal harmony comes back. The occupation ends.',
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
console.log('PASS: audited 25/25 against data/alice-topics/emf-white-flash.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
