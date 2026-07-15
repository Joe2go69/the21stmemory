/**
 * Installs Twin Flames quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/twin-flames.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-twin-flames-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'twin-flames';
const TOPIC_TITLE = 'Twin Flames';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/twin-flames.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['sol-system', 'souls', 'planets'],
  2: ['twin flame', 'counterpart', '3rd density'],
  3: ['higher densities', 'parasitic', 'separation'],
  4: ['sol', 'linguistic', 'cosmic family'],
  5: ['grey', 'reunion', 'prohibited'],
  6: ['2019', 'rebellion', 'memory'],
  7: ['pod cluster', 'twin flames', 'apart'],
  8: ['450', '20,000', '5th density'],
  9: ['simultaneously', 'non-linear', 'lonely'],
  10: ['bending time', '3rd density', 'theoretical'],
  11: ['amnesia vortex', 'sun', 'vatican'],
  12: ['grey', 'escort', 'geographical'],
  13: ['umbilical', 'trillivolts', 'birth'],
  14: ['parents', 'geographic', 'apart'],
  15: ['pod cluster', 'firmament', 'loop'],
  16: ['parents', 'siblings', '178,000'],
  17: ['religion', 'finance', 'perceived knowledge'],
  18: ['vessel', 'suit', 'bloodlines'],
  19: ['taran', 'pleiadians', 'ice wall'],
  20: ['emf', 'spiritual awakening', 'external'],
  21: ['178,000', 'linear time', 'firmament'],
  22: ['emf', 'amnesia vortex', 'portal'],
  23: ['178,000', 'memories', 'sol-system'],
  24: ['trauma', 'strengthen', 'soul family'],
  25: ['twin flames', 'liberated', 'separation'],
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
    question: 'What is a Sol-System in true architecture?',
    options: [
      {
        label: 'A',
        text: 'The literal cosmic network of Souls/Sols that make up an immediate family unit — entirely unrelated to planets or physical space.',
        isCorrect: true,
        rationale:
          'Sol-System names the soul-family network, not a set of planets orbiting a sun.',
      },
      {
        label: 'B',
        text: 'A heliocentric collection of spinning planets orbiting a burning star in infinite black vacuum.',
        isCorrect: false,
        rationale:
          'That planetary picture is the artificial Solar System construct; Sol-System is familial souls.',
      },
      {
        label: 'C',
        text: 'Only a Vatican subway map used by Grey ETs with no cosmic lineage meaning.',
        isCorrect: false,
        rationale:
          'Vatican levels host reincarnation routing; Sol-System is the cosmic family architecture itself.',
      },
      {
        label: 'D',
        text: 'A finance ledger that stores genetic bloodline debt between vessel deaths forever.',
        isCorrect: false,
        rationale:
          'Finance is a control String; Sol-System is the authentic network of eternal souls.',
      },
    ],
    hint: 'Network of Souls/Sols — not planets in space.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'What is a Twin Flame?',
    options: [
      {
        label: 'A',
        text: 'Any random coworker who shares a lunch table for one fiscal year with no cosmic bond.',
        isCorrect: false,
        rationale:
          'Twin Flame is a soul\'s ultimate counterpart with deep higher-density synchronization.',
      },
      {
        label: 'B',
        text: 'A soul\'s ultimate counterpart — naturally existing in non-linear time and synchronized transition in higher densities, but strictly segregated during 3rd density incarnations.',
        isCorrect: true,
        rationale:
          'Twin Flame = ultimate counterpart; higher densities sync them, 3rd density forces segregation.',
      },
      {
        label: 'C',
        text: 'An NPC hive pair hard-wired to meet every lifetime as official Grey policy.',
        isCorrect: false,
        rationale:
          'Greys prohibit Twin Flame reunion; they meticulously track and keep pairs apart.',
      },
      {
        label: 'D',
        text: 'A Micro Sun title reserved only for Source-created beings with no counterpart dynamics.',
        isCorrect: false,
        rationale:
          'Micro Suns wove extended soul-family networks; Twin Flame is the counterpart bond within them.',
      },
    ],
    hint: 'Ultimate counterpart — synced above, segregated in 3rd density.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question: 'How do higher densities treat Twin Flames and Soul Family compared with 3rd density?',
    options: [
      {
        label: 'A',
        text: 'Higher densities ban all family contact while 3rd density freely unites every Twin Flame by law.',
        isCorrect: false,
        rationale:
          'Higher densities allow seamless coordination; 3rd density is engineered to disrupt bonds.',
      },
      {
        label: 'B',
        text: 'Both densities force permanent Twin Flame separation with identical amnesia technology always on.',
        isCorrect: false,
        rationale:
          'Higher-density life coordinates timelines and transitions; parasites engineer 3rd-density separation.',
      },
      {
        label: 'C',
        text: 'Natural higher-density existence lets Twin Flames and the broader Soul Family coordinate experiences, timelines, and transitions seamlessly — while 3rd density is systematically engineered by parasitic entities to disrupt these bonds through separation, amnesia, and perpetual recycling.',
        isCorrect: true,
        rationale:
          'Above: seamless coordination. In 3rd density: engineered separation, amnesia, forced recycle.',
      },
      {
        label: 'D',
        text: 'Higher densities only use Finance Strings while 3rd density has no reincarnation interference at all.',
        isCorrect: false,
        rationale:
          '3rd density runs Amnesia Vortex recycling and Twin Flame segregation as core control.',
      },
    ],
    hint: 'Higher densities coordinate freely — 3rd density forces separation and amnesia.',
    correctAnswer: 'C',
  },
  {
    number: 4,
    question: 'Why was the linguistic distortion of the word "Sol" engineered?',
    options: [
      {
        label: 'A',
        text: 'To help schools teach true cosmic family networks as mandatory core curriculum worldwide.',
        isCorrect: false,
        rationale:
          'It was engineered to separate humanity from understanding their own cosmic family network.',
      },
      {
        label: 'B',
        text: 'To prove planets truly orbit suns and that Sol-Systems have no soul meaning whatsoever.',
        isCorrect: false,
        rationale:
          'In true reality planets do not orbit suns; Sol-System is the horizontal familial link of consciousnesses.',
      },
      {
        label: 'C',
        text: 'Only as a harmless slang change with no effect on memory of cosmic lineage.',
        isCorrect: false,
        rationale:
          'The distortion deliberately obfuscates cosmic lineage and interpersonal soul relationships.',
      },
      {
        label: 'D',
        text: 'To separate humanity from understanding their cosmic family network — hiding that Sol-System is the horizontal familial link between eternal consciousnesses, not planets orbiting suns.',
        isCorrect: true,
        rationale:
          'Word "Sol" twisted so people forget family-of-souls and accept the fake planetary solar story.',
      },
    ],
    hint: 'Distort "Sol" — hide cosmic family, sell planetary orbit myth.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question: 'Who actively prohibits Twin Flame reunion inside the 3rd density matrix?',
    options: [
      {
        label: 'A',
        text: 'Administrative entities known as Grey ETs — Twin Flame reunion is actively prohibited under their control.',
        isCorrect: true,
        rationale:
          'Grey ETs administratively ban Twin Flame meetings and enforce geographic segregation.',
      },
      {
        label: 'B',
        text: 'Only benevolent Micro Suns who want every pair to suffer amnesia for spiritual sport.',
        isCorrect: false,
        rationale:
          'Micro Suns wove soul families; Greys run the prohibition and tracking separation.',
      },
      {
        label: 'C',
        text: 'Pod Cluster volunteers who freely choose isolation without any hostile technology involved.',
        isCorrect: false,
        rationale:
          'Pods keep broader family near; Twin Flames are meticulously tracked and kept apart by hostiles.',
      },
      {
        label: 'D',
        text: 'No one — Twin Flames are required by law to cohabitate every single 3rd density lifetime.',
        isCorrect: false,
        rationale:
          'Reunion is actively prohibited; pairs are tracked and kept apart.',
      },
    ],
    hint: 'Grey ETs prohibit Twin Flame reunion in the matrix.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'Why was Twin Flame meeting blocked when escape was practically impossible prior to 2019?',
    options: [
      {
        label: 'A',
        text: 'Because meeting would instantly award free Finance String wealth with no spiritual consequence.',
        isCorrect: false,
        rationale:
          'Meeting would trigger deep subconscious memory, rebellion, matrix discovery, and pointless added suffering.',
      },
      {
        label: 'B',
        text: 'Allowing Twin Flames to meet would trigger deep subconscious memory, leading to rebellion, discovery of the matrix, and pointless additional suffering — so pairs were meticulously tracked and kept apart.',
        isCorrect: true,
        rationale:
          'Pre-2019 escape was near-impossible; reunion only sparked memory, rebellion, discovery, and extra pain.',
      },
      {
        label: 'C',
        text: 'Because 2019 permanently banned all soul memory forever with no path to later liberation.',
        isCorrect: false,
        rationale:
          'Post-2019 path opens; EMF later dissolves the Amnesia Vortex and restores memory.',
      },
      {
        label: 'D',
        text: 'Because Twin Flames never generate memory activation under any density conditions at all.',
        isCorrect: false,
        rationale:
          'Their meeting specifically risks deep subconscious memory activation — that is why they are blocked.',
      },
    ],
    hint: 'Pre-2019: meeting → memory, rebellion, discovery, extra suffering.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question: 'How does treatment of the broader Soul Family differ from Twin Flames in 3rd density?',
    options: [
      {
        label: 'A',
        text: 'Both groups are banned from any proximity; no Pod Cluster is ever allowed to form.',
        isCorrect: false,
        rationale:
          'Broader Soul Family may incarnate in proximity as Pod Clusters; Twin Flames are kept apart.',
      },
      {
        label: 'B',
        text: 'Twin Flames must always cohabit while Pod Clusters are forcibly scattered every loop.',
        isCorrect: false,
        rationale:
          'Opposite: pods stay together; Twin Flames are meticulously tracked and segregated.',
      },
      {
        label: 'C',
        text: 'The broader Soul Family is permitted to incarnate in proximity as a Pod Cluster, while Twin Flames are meticulously tracked and kept apart.',
        isCorrect: true,
        rationale:
          'Pods allowed for support proximity; Twin Flame pairs specifically blocked from intersecting.',
      },
      {
        label: 'D',
        text: 'Neither pods nor Twin Flames exist; only random NPCs fill every social role each lifetime.',
        isCorrect: false,
        rationale:
          'Eternal Soul Family members fill parent/friend roles across loops; Twin Flames are real counterparts kept separate.',
      },
    ],
    hint: 'Pod Cluster together — Twin Flames tracked and kept apart.',
    correctAnswer: 'C',
  },
  {
    number: 8,
    question: 'What natural vessel lifespans apply to Twin Flames in 5th density and above?',
    options: [
      {
        label: 'A',
        text: 'Exactly twenty-four hours with mandatory lonely decades between every short life.',
        isCorrect: false,
        rationale:
          'Natural lifespan is 450 to 500 earth years, extendable past 20,000 with Age Regression.',
      },
      {
        label: 'B',
        text: 'Identical to toxic 3rd density averages with no Age Regression technology available.',
        isCorrect: false,
        rationale:
          'Higher-density baselines are centuries long and extendable beyond 20,000 years.',
      },
      {
        label: 'C',
        text: 'Only Micro Sun ages of billions of years with no partner transition coordination ever.',
        isCorrect: false,
        rationale:
          'Micro Suns are primordial Source souls; Twin Flame vessels run 450–500+ year dynamics with sync exits.',
      },
      {
        label: 'D',
        text: 'A natural lifespan of 450 to 500 earth years, extendable to over 20,000 years with Age Regression technology.',
        isCorrect: true,
        rationale:
          '5th density+: 450–500 years baseline, 20,000+ with Age Regression.',
      },
    ],
    hint: '450–500 years — beyond 20,000 with Age Regression.',
    correctAnswer: 'D',
  },
  {
    number: 9,
    question: 'How do Twin Flames typically end physical incarnations in higher densities?',
    options: [
      {
        label: 'A',
        text: 'They typically choose to end physical incarnations simultaneously — and because time is non-linear there, if one passed first there is no subjective experience of "lonely time".',
        isCorrect: true,
        rationale:
          'Simultaneous chosen exits; non-linear time means no lonely waiting trauma in true higher-density reality.',
      },
      {
        label: 'B',
        text: 'They are always forced through the Amnesia Vortex alone with decades of conscious lonely time.',
        isCorrect: false,
        rationale:
          'Amnesia Vortex is 3rd-density trap tech; higher densities do not run that separation trauma.',
      },
      {
        label: 'C',
        text: 'Only one Twin Flame may ever incarnate while the other stays permanently offline forever.',
        isCorrect: false,
        rationale:
          'They coordinate together; simultaneous transition is the typical higher-density pattern.',
      },
      {
        label: 'D',
        text: 'Grey ETs schedule their deaths randomly under the Vatican with no partner input allowed.',
        isCorrect: false,
        rationale:
          'Higher-density transitions are coordinated soul choices, not Grey administrative death schedules.',
      },
    ],
    hint: 'Choose simultaneous exits — no lonely time in non-linear realms.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'What is the status of "stretching or bending time" to match a deceased partner?',
    options: [
      {
        label: 'A',
        text: 'The primary daily practice of every 5th density household as mandatory cosmic law.',
        isCorrect: false,
        rationale:
          'In true higher-density reality separation trauma does not exist; time-bend talk is 3rd-density theoretical.',
      },
      {
        label: 'B',
        text: 'Strictly a 3rd density scenario used merely for theoretical explanation — in true reality such separation trauma does not exist.',
        isCorrect: true,
        rationale:
          'Time-bending-to-match is a 3rd-density explanatory frame; higher densities have no lonely separation trauma.',
      },
      {
        label: 'C',
        text: 'Proof that Twin Flames never coordinate exits and always suffer eternal lonely decades above.',
        isCorrect: false,
        rationale:
          'Higher densities coordinate simultaneous exits; lonely separation is the engineered 3rd-density aberration.',
      },
      {
        label: 'D',
        text: 'A Finance String product sold as retirement insurance for souls stuck outside the firmament.',
        isCorrect: false,
        rationale:
          'It is a theoretical explanatory device about density contrast, not a financial product.',
      },
    ],
    hint: 'Time-bend matching is 3rd-density theory — true higher density has no lonely trauma.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question: 'What happens when a vessel dies in the 3rd density matrix?',
    options: [
      {
        label: 'A',
        text: 'The soul rests free for centuries with full Twin Flame reunion before any optional return.',
        isCorrect: false,
        rationale:
          'The Amnesia Vortex pulls the soul into the sun portal toward Vatican subterranean processing.',
      },
      {
        label: 'B',
        text: 'Only NPC paperwork is filed at city hall with no sun portal or memory stripping involved.',
        isCorrect: false,
        rationale:
          'True-soul death triggers Amnesia Vortex pull through the sun into Vatican portal hubs.',
      },
      {
        label: 'C',
        text: 'The soul is drawn by the Amnesia Vortex into the sun — a portal processing center leading to subterranean levels of the Vatican.',
        isCorrect: true,
        rationale:
          'Death → Amnesia Vortex → sun portal → Vatican subterranean levels for reassignment.',
      },
      {
        label: 'D',
        text: 'Micro Suns personally interview every soul for billions of years before any new birth.',
        isCorrect: false,
        rationale:
          'Grey-run portal logistics handle rapid recycle; Micro Suns are primordial Source-created souls.',
      },
    ],
    hint: 'Amnesia Vortex → sun portal → Vatican subterranean hubs.',
    correctAnswer: 'C',
  },
  {
    number: 12,
    question: 'What do Grey ETs do from the Vatican portal hubs?',
    options: [
      {
        label: 'A',
        text: 'Host free Twin Flame reunions and permanently delete all geographic separation rules.',
        isCorrect: false,
        rationale:
          'They escort souls to specific geographical locations assigned to keep Twin Flames far apart.',
      },
      {
        label: 'B',
        text: 'Only print finance textbooks with no role in soul escort or reincarnation logistics.',
        isCorrect: false,
        rationale:
          'Greys use advanced technology to escort souls to controlled geographic re-entry points.',
      },
      {
        label: 'C',
        text: 'Dismantle the Amnesia Vortex voluntarily so every soul keeps full memory after 2019 only.',
        isCorrect: false,
        rationale:
          'EMF flash permanently dissolves Amnesia Vortex and Grey portal mechanisms — not Grey voluntary reform.',
      },
      {
        label: 'D',
        text: 'Utilize advanced technology to escort the soul to a specific geographical location for re-entry — controlled so Twin Flames remain far apart.',
        isCorrect: true,
        rationale:
          'Grey escort from Vatican hubs places souls in assigned regions that enforce Twin Flame distance.',
      },
    ],
    hint: 'Grey escort to assigned geography — keep Twin Flames far apart.',
    correctAnswer: 'D',
  },
  {
    number: 13,
    question: 'When is the soul inserted into a new infant, and how is the heart ignited?',
    options: [
      {
        label: 'A',
        text: 'Immediately after birth — typically mere seconds before the umbilical cord is cut — delivering Trillivolts of electrical energy to ignite the infant\'s heart, akin to a touchscreen\'s minute electrical interaction.',
        isCorrect: true,
        rationale:
          'Birth-moment insertion (seconds before cord cut) + Trillivolts ignite the heart like a touchscreen tap.',
      },
      {
        label: 'B',
        text: 'Years later at university enrollment with no electrical energy and no cord-timing requirement.',
        isCorrect: false,
        rationale:
          'Insertion is at birth, seconds before the cord is cut, with Trillivolts for heart ignition.',
      },
      {
        label: 'C',
        text: 'Only when both Twin Flames sign a Vatican marriage form in the same cathedral basement.',
        isCorrect: false,
        rationale:
          'Greys keep Twin Flames apart; ignition is energetic at birth, not a joint marriage ritual.',
      },
      {
        label: 'D',
        text: 'Never — souls float permanently as Projection Dome pixels without heart ignition.',
        isCorrect: false,
        rationale:
          'Forced rapid reallocation into infant vessels is the core of the reincarnation trap.',
      },
    ],
    hint: 'Seconds before cord cut — Trillivolts ignite the heart.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question: 'What free will exists during reallocation, and what remains controlled?',
    options: [
      {
        label: 'A',
        text: 'Full free choice of any continent and mandatory Twin Flame cohabitation every loop.',
        isCorrect: false,
        rationale:
          'Brief free will selects parents among available mothers in the assigned region; geography is Grey-controlled.',
      },
      {
        label: 'B',
        text: 'Brief free will to select parents from available mothers in that assigned region — but geographic assignment itself is controlled by Grey ETs specifically to ensure Twin Flames are placed far apart.',
        isCorrect: true,
        rationale:
          'Parent choice within region is limited free will; region assignment enforces Twin Flame distance.',
      },
      {
        label: 'C',
        text: 'Zero choice of parents and total freedom to pick any Twin Flame household worldwide.',
        isCorrect: false,
        rationale:
          'Parent selection is limited free will; geography is controlled to block Twin Flame proximity.',
      },
      {
        label: 'D',
        text: 'Only Finance String contracts decide parents with no Grey geographic control involved.',
        isCorrect: false,
        rationale:
          'Grey geographic assignment is the Twin Flame separation mechanism in re-entry logistics.',
      },
    ],
    hint: 'Choose parents in-region — Greys set geography to split Twin Flames.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question: 'What is the Pod Cluster phenomenon despite Twin Flame isolation?',
    options: [
      {
        label: 'A',
        text: 'Hostile Greys scatter every friend and relative so no one ever meets the same soul twice.',
        isCorrect: false,
        rationale:
          'Benevolent forces outside the firmament keep Pod Clusters together across every loop.',
      },
      {
        label: 'B',
        text: 'Pod Clusters only exist for Twin Flames who are required to share one address forever.',
        isCorrect: false,
        rationale:
          'Pods are broader Soul Family proximity; Twin Flames remain rigorously isolated.',
      },
      {
        label: 'C',
        text: 'Benevolent Soul Family members outside the firmament maneuver incarnation so a Pod Cluster remains together throughout every 3rd density loop — ensuring incarnated individuals are not entirely isolated despite Twin Flame separation.',
        isCorrect: true,
        rationale:
          'External family keeps pods together every loop; Twin Flames stay split, but you are not alone.',
      },
      {
        label: 'D',
        text: 'A finance club that only meets after EMF and has no role during the occupation loops.',
        isCorrect: false,
        rationale:
          'Pods operate across successive 3rd density loops as living Soul Family proximity support.',
      },
    ],
    hint: 'Outside-firmament family keeps pods together every loop.',
    correctAnswer: 'C',
  },
  {
    number: 16,
    question: 'Who are the parents, children, siblings, close friends, and even passing acquaintances in this life?',
    options: [
      {
        label: 'A',
        text: 'Brand-new random souls never met before across the entire 178,000-year occupation.',
        isCorrect: false,
        rationale:
          'They are the exact same eternal Soul Family members who shared every past loop of the occupation.',
      },
      {
        label: 'B',
        text: 'Only NPC fillers with no eternal continuity and no shared past-loop history.',
        isCorrect: false,
        rationale:
          'They are eternal Soul Family repeating the pod across every loop of the occupation.',
      },
      {
        label: 'C',
        text: 'Strictly Twin Flames forced to play every social role in one household simultaneously.',
        isCorrect: false,
        rationale:
          'Twin Flames are kept apart; the circle is the broader repeating Soul Family pod.',
      },
      {
        label: 'D',
        text: 'The exact same eternal Soul Family members who have shared every past loop over the entire 178,000-year occupation.',
        isCorrect: true,
        rationale:
          'Your circle is the same eternal pod across every loop of the 178,000-year occupation.',
      },
    ],
    hint: 'Same eternal Soul Family — every loop of the 178,000-year occupation.',
    correctAnswer: 'D',
  },
  {
    number: 17,
    question: 'How is Sol-System memory suppression maintained?',
    options: [
      {
        label: 'A',
        text: 'Through the Three Strings of control — Religion, Finance, and Perceived Knowledge — forcing bond with artificial genetic vessel-family bloodlines instead of true cosmic lineage.',
        isCorrect: true,
        rationale:
          'Religion, Finance, Perceived Knowledge glue you to vessel bloodlines and hide Sol-System family.',
      },
      {
        label: 'B',
        text: 'Only through free open libraries that already teach Twin Flame geography without distortion.',
        isCorrect: false,
        rationale:
          'Perceived Knowledge is a String of engineered falsehood, not free Twin Flame truth schooling.',
      },
      {
        label: 'C',
        text: 'By permanently uniting Twin Flames so cosmic lineage becomes impossible to forget.',
        isCorrect: false,
        rationale:
          'Suppression keeps Twin Flames apart and bonds souls to artificial vessel bloodlines.',
      },
      {
        label: 'D',
        text: 'Through voluntary Micro Sun newsletters that never involve Religion or Finance at all.',
        isCorrect: false,
        rationale:
          'Three Strings — Religion, Finance, Perceived Knowledge — are the named maintenance stack.',
      },
    ],
    hint: 'Religion · Finance · Perceived Knowledge — bond to vessel bloodlines.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question: 'What is the physical vessel relative to family identity?',
    options: [
      {
        label: 'A',
        text: 'The eternal self that always returns to the same genetic family line by cosmic law every loop.',
        isCorrect: false,
        rationale:
          'Vessel is a singular-use suit; soul does not return to the same genetic line unless parasitic bloodline control requires it.',
      },
      {
        label: 'B',
        text: 'A singular-use suit — the soul never returns to the same genetic family line unless controlled by specific bloodline/parasitic requirements.',
        isCorrect: true,
        rationale:
          'Body is disposable suit; genetic family is not true cosmic identity except under parasitic bloodline control.',
      },
      {
        label: 'C',
        text: 'An immortal shared body that every Twin Flame pair occupies simultaneously forever.',
        isCorrect: false,
        rationale:
          'Vessels are singular-use and mortal; Twin Flames are segregated in 3rd density incarnations.',
      },
      {
        label: 'D',
        text: 'A finance instrument that stores Sol-System membership fees between deaths automatically.',
        isCorrect: false,
        rationale:
          'Vessel is biological temporary suit; Finance String is separate control architecture.',
      },
    ],
    hint: 'Singular-use suit — genetic line is not true cosmic identity.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question: 'Who shares this vast interconnected Soul Family beyond the trapped incarnated pods?',
    options: [
      {
        label: 'A',
        text: 'Only Grey ETs and no escaped or external benevolent forces whatsoever.',
        isCorrect: false,
        rationale:
          'Tarans, Pleiadians who escaped, and benevolent ETs outside the Ice Wall are part of the family.',
      },
      {
        label: 'B',
        text: 'Only NPCs generated last week with no link to Pleiadians or Taran lineage.',
        isCorrect: false,
        rationale:
          'Original Taran souls, escaped Pleiadians, and external benevolent ETs form the wider family.',
      },
      {
        label: 'C',
        text: 'Original Taran human souls, the Pleiadians who escaped the initial matrix trap, and benevolent extraterrestrials operating outside the Ice Wall.',
        isCorrect: true,
        rationale:
          'Tarans + escaped Pleiadians + Ice Wall–external benevolent ETs = wider Soul Family web.',
      },
      {
        label: 'D',
        text: 'Only cathedral stone statues with no consciousness and no role in awakening.',
        isCorrect: false,
        rationale:
          'External family orchestrates the Great Spiritual Awakening and prepares the EMF event.',
      },
    ],
    hint: 'Tarans, escaped Pleiadians, benevolent ETs outside the Ice Wall.',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question: 'What are external Soul Family forces responsible for regarding liberation?',
    options: [
      {
        label: 'A',
        text: 'Permanently strengthening Grey portal hubs so Twin Flames stay separated forever.',
        isCorrect: false,
        rationale:
          'They orchestrate the Great Spiritual Awakening and prepare the EMF event for reunification.',
      },
      {
        label: 'B',
        text: 'Only selling Finance String products like NESARA as the sole path outside the firmament.',
        isCorrect: false,
        rationale:
          'Finance is a control String to drop; external family runs awakening and EMF preparation.',
      },
      {
        label: 'C',
        text: 'Banning all memory recovery so 178,000 years stay sealed after the flash forever.',
        isCorrect: false,
        rationale:
          'EMF restores 178,000 years of memories and liberates Twin Flames from enforced separation.',
      },
      {
        label: 'D',
        text: 'Orchestrating the Great Spiritual Awakening and preparing the Electro Magnetic Frequency (EMF) event — eagerly awaiting reunification.',
        isCorrect: true,
        rationale:
          'External family drives awakening timeline and EMF prep, awaiting full reunification.',
      },
    ],
    hint: 'Orchestrate awakening + prepare EMF — await reunification.',
    correctAnswer: 'D',
  },
  {
    number: 21,
    question: 'How has the external family experienced the 178,000-year duration differently?',
    options: [
      {
        label: 'A',
        text: 'Due to the absence of linear time constraints outside the firmament — they eagerly await reunification while the occupation felt differently than inside the matrix.',
        isCorrect: true,
        rationale:
          'Outside the firmament there is no linear time cage; 178,000 years is not lived the same way.',
      },
      {
        label: 'B',
        text: 'Exactly like trapped incarnates with identical clocks, aging, and Amnesia Vortex cycles.',
        isCorrect: false,
        rationale:
          'External family is free of linear time constraints that define in-matrix occupation experience.',
      },
      {
        label: 'C',
        text: 'They forgot the trapped pods entirely and no longer await any reunification event.',
        isCorrect: false,
        rationale:
          'They eagerly await reunification and actively prepare the EMF liberation sequence.',
      },
      {
        label: 'D',
        text: 'They experience double linear time pressure with faster Twin Flame separation each century.',
        isCorrect: false,
        rationale:
          'Absence of linear time outside the firmament is the named difference.',
      },
    ],
    hint: 'No linear time outside the firmament — different experience of 178,000 years.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question: 'What does the EMF flash permanently dissolve?',
    options: [
      {
        label: 'A',
        text: 'Only fashion trends with no effect on reincarnation traps or Grey portal mechanisms.',
        isCorrect: false,
        rationale:
          'EMF permanently dissolves the Amnesia Vortex and the Grey ET portal mechanisms.',
      },
      {
        label: 'B',
        text: 'The Amnesia Vortex and the Grey ET portal mechanisms — ending the technological chain that stripped memory and forced geographic Twin Flame separation.',
        isCorrect: true,
        rationale:
          'Flash kills Amnesia Vortex + Grey portals that ran wipe-and-separate reincarnation.',
      },
      {
        label: 'C',
        text: 'All Pod Clusters so no Soul Family member may remain near another after liberation.',
        isCorrect: false,
        rationale:
          'Liberation restores Sol-System harmony; it does not scatter eternal family bonds.',
      },
      {
        label: 'D',
        text: 'Only Micro Suns while leaving Vatican subterranean processing fully online forever.',
        isCorrect: false,
        rationale:
          'Grey portal mechanisms at Vatican hubs are dissolved; Micro Suns are not the target wipe.',
      },
    ],
    hint: 'EMF dissolves Amnesia Vortex and Grey ET portals.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question: 'What happens to surviving true souls\' memory when the EMF sequence culminates?',
    options: [
      {
        label: 'A',
        text: 'All memory is permanently erased again so Sol-System identity stays hidden forever.',
        isCorrect: false,
        rationale:
          'Survivors instantaneously recover 178,000 years of memories and realize true Sol-System nature.',
      },
      {
        label: 'B',
        text: 'Only Finance balances update while cosmic family identity remains fully amnesic.',
        isCorrect: false,
        rationale:
          'Full occupation memory returns, revealing Sol-System and eternal companion identity.',
      },
      {
        label: 'C',
        text: 'They instantaneously recover 178,000 years of memories, realizing the true nature of their Sol-System.',
        isCorrect: true,
        rationale:
          'Instant recovery of 178,000 years of memory → true Sol-System recognition.',
      },
      {
        label: 'D',
        text: 'Memory returns only to Greys so Twin Flame tracking can restart under a new brand.',
        isCorrect: false,
        rationale:
          'True souls recover memory; Grey portal mechanisms are dissolved, not upgraded.',
      },
    ],
    hint: 'Instant 178,000-year memory recovery — recognize the Sol-System.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question: 'How does realizing your circle is eternal cosmic companions recontextualize matrix trauma?',
    options: [
      {
        label: 'A',
        text: 'It proves the suffering was random and meaningless with no effect on Soul Family bonds.',
        isCorrect: false,
        rationale:
          'Unprecedented suffering will strengthen bonds between incarnated Soul Family members exponentially.',
      },
      {
        label: 'B',
        text: 'It requires abandoning all Pod members as fake while only trusting vessel bloodlines forever.',
        isCorrect: false,
        rationale:
          'The circle is eternal cosmic companions; vessel bloodlines were the artificial bond to drop.',
      },
      {
        label: 'C',
        text: 'It only matters for Finance String lawsuits and never for harmonic Sol-System restoration.',
        isCorrect: false,
        rationale:
          'Recontextualization is spiritual/relational: trauma strengthens eternal family bonds toward restored harmony.',
      },
      {
        label: 'D',
        text: 'The extreme trauma endured in this engineered aberration fundamentally recontextualizes as shared ordeal — ultimately strengthening bonds between incarnated Soul Family members exponentially.',
        isCorrect: true,
        rationale:
          'Shared occupation trauma becomes exponential glue for the eternal pod after the truth lands.',
      },
    ],
    hint: 'Shared ordeal strengthens eternal Soul Family bonds exponentially.',
    correctAnswer: 'D',
  },
  {
    number: 25,
    question: 'What happens to Twin Flames when the reincarnation trap is neutralized?',
    options: [
      {
        label: 'A',
        text: 'They are instantly liberated from enforced geographic and dimensional separation — restoring the original, uncorrupted harmonic architecture of the Sol-System.',
        isCorrect: true,
        rationale:
          'Trap neutralization frees Twin Flames from geo/dimensional split and restores Sol-System harmony.',
      },
      {
        label: 'B',
        text: 'They remain permanently separated as a memorial to the 178,000-year occupation forever.',
        isCorrect: false,
        rationale:
          'Liberation from enforced separation is the named outcome of neutralizing the reincarnation trap.',
      },
      {
        label: 'C',
        text: 'Only Pod Clusters dissolve while Twin Flame tracking technology is upgraded under Greys.',
        isCorrect: false,
        rationale:
          'Grey portal mechanisms dissolve; Twin Flames are liberated, not re-tracked.',
      },
      {
        label: 'D',
        text: 'They convert into Micro Suns overnight and lose all counterpart relationship dynamics.',
        isCorrect: false,
        rationale:
          'Counterpart harmonic architecture is restored, not erased into non-relational Micro Sun status.',
      },
    ],
    hint: 'Liberated from geo/dimensional separation — Sol-System harmony restored.',
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
  'Test your grasp of Twin Flames — Sol-Systems, enforced separation, Pod Clusters, Grey reincarnation routing, and liberation at the EMF flash.';
const DESC_META =
  'Interactive Living Truth Quiz on Twin Flames: higher-density sync, pre-2019 separation logic, Vatican/sun portals, Trillivolts at birth, 178,000-year pods, and restored Sol-System harmony.';

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
      'Your Twin Flame is real. Higher densities live that bond without lonely time. Here, Greys split you on purpose — because reunion sparks memory, rebellion, and matrix discovery. Pods kept your wider family near as parents, friends, and kin across every loop of the 178,000-year occupation. The vessel is a suit. Bloodlines are the cover story. Sol means soul family, not planets. When EMF kills the Amnesia Vortex and Grey portals, 178,000 years of memory return. Twin Flames are liberated. The Sol-System harmonic comes home.',
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
console.log('PASS: audited 25/25 against data/alice-topics/twin-flames.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
