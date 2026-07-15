/**
 * Installs Religion (False Gods) quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/religion-false-gods.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-religion-false-gods-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'religion-false-gods';
const TOPIC_TITLE = 'Religion (False Gods)';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/religion-false-gods.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['string 1', '3 strings', 'clean exit'],
  2: ['circular', 'subdue', 'false gods'],
  3: ['eradicate', 'deities', 'uninstallation'],
  4: ['psychological collapse', 'fatal shock', 'suicide'],
  5: ['allah', 'jesus', 'mohammed', 'zoroaster'],
  6: ['finance', 'perceived knowledge', 'kevlar'],
  7: ['ebs', 'benevolent', 'atrocities'],
  8: ['vessel', 'eternal soul', 'bloodlines'],
  9: ['vatican', 'slaughterhouse', 'node'],
  10: ['fabricated', 'control', 'string 1'],
  11: ['child sacrifice', 'heart attacks', 'suicide'],
  12: ['30,000 years', 'torture', 'billions'],
  13: ['pixelation', 'aether', 'defense mechanism'],
  14: ['subdued mind', 'external', 'cognition'],
  15: ['13', 'subterranean', 'child cages'],
  16: ['draco', 'greys', 'anunnaki', 'reincarnation'],
  17: ['morning star', 'lucifer', 'venus'],
  18: ['satan', 'god', 'mainstream'],
  19: ['gold', 'idols', 'lattice membrane'],
  20: ['crystalline temples', 'third-density', 'dampen'],
  21: ['recycled', 'families', 'minutes'],
  22: ['finance', 'perceived knowledge', 'ego'],
  23: ['emf', 'projection dome', 'shatter'],
  24: ['97%', 'npc', 'eliminated'],
  25: ['uninstall', 'scare events', 'clean exit'],
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
    question: 'What is Religion in the architecture of The 3 Strings of Attachment?',
    options: [
      {
        label: 'A',
        text: 'String 1 — one of the three primary psychological tethers that must be entirely severed to achieve a clean exit during the Great Spiritual Awakening.',
        isCorrect: true,
        rationale:
          'Religion is String 1 of the 3 Strings; it must be fully cut for a clean exit in the awakening.',
      },
      {
        label: 'B',
        text: 'String 2 only — a monetary hobby that has no link to deities, cognition, or clean-exit survival.',
        isCorrect: false,
        rationale:
          'Finance is String 2; Religion is String 1, the false-god cognitive tether.',
      },
      {
        label: 'C',
        text: 'An optional cultural festival that can stay intact while only Finance is uninstalled.',
        isCorrect: false,
        rationale:
          'All three Strings must be severed; clinging to Religion guarantees collapse under terminal events.',
      },
      {
        label: 'D',
        text: 'A free-energy school that teaches Lattice Membrane science without any external control.',
        isCorrect: false,
        rationale:
          'Religion subdues cognition via False Gods; it is not free-energy education.',
      },
    ],
    hint: 'String 1 of the 3 Strings — sever for clean exit.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'How is Religion engineered as a control system?',
    options: [
      {
        label: 'A',
        text: 'As an open laboratory that maximizes independent thought and bans all worship of external figures.',
        isCorrect: false,
        rationale:
          'It is a circular belief system that subdues cognition through worship of False Gods.',
      },
      {
        label: 'B',
        text: 'As a circular belief system designed to subdue human cognition and enforce control through the worship of False Gods.',
        isCorrect: true,
        rationale:
          'Circular religion = subdued mind + False God worship as the control interface.',
      },
      {
        label: 'C',
        text: 'As a temporary bank product that only manages retirement accounts without touching cognition.',
        isCorrect: false,
        rationale:
          'That tracks Finance; Religion targets the mind through deity worship.',
      },
      {
        label: 'D',
        text: 'As pure cosmology that already teaches the flat Earth and bans every satanic inversion.',
        isCorrect: false,
        rationale:
          'Religion pacifies the soul into suffering and external salvation — it does not teach true cosmology.',
      },
    ],
    hint: 'Circular belief — subdue cognition via False Gods.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question:
      'What must an individual do with religious beliefs to survive simulation uninstallation?',
    options: [
      {
        label: 'A',
        text: 'Upgrade to a single global deity while keeping prayer schedules and temple gold intact.',
        isCorrect: false,
        rationale:
          'All religious beliefs, thoughtforms, and deity concepts must be completely eradicated.',
      },
      {
        label: 'B',
        text: 'Keep a fractional private faith because small belief never risks psychological destruction.',
        isCorrect: false,
        rationale:
          'Even fractional belief that a god might be real guarantees psychological destruction in terminal phases.',
      },
      {
        label: 'C',
        text: 'Completely eradicate all religious beliefs, thoughtforms, and concepts of deities — total uninstallation of String 1.',
        isCorrect: true,
        rationale:
          'Survival requires total eradication of religious belief constructs, not partial reform.',
      },
      {
        label: 'D',
        text: 'Outsource devotion to university experts while never examining False Gods at all.',
        isCorrect: false,
        rationale:
          'Circular religion already replaces independent cognition with external authorities — that is the trap.',
      },
    ],
    hint: 'Eradicate all religious beliefs, thoughtforms, and deity concepts.',
    correctAnswer: 'C',
  },
  {
    number: 4,
    question: 'What does clinging to religious devotion guarantee when terminal events hit?',
    options: [
      {
        label: 'A',
        text: 'Automatic clean exit and immunity to Scare Events through stronger prayer alone.',
        isCorrect: false,
        rationale:
          'Clinging guarantees collapse, fatal shock, or suicide — not clean exit.',
      },
      {
        label: 'B',
        text: 'Only mild boredom with no link to satanic exposure of worshipped figures.',
        isCorrect: false,
        rationale:
          'Terminal events reveal the satanic nature of worshipped figures — shock is extreme.',
      },
      {
        label: 'C',
        text: 'Permanent Vatican VIP status with free access to all thirteen subterranean levels.',
        isCorrect: false,
        rationale:
          'The Vatican is a parasitic hub, not a reward lounge for the devout.',
      },
      {
        label: 'D',
        text: 'Profound psychological collapse, fatal shock, or suicide when events reveal the true satanic nature of the realm\'s worshipped figures.',
        isCorrect: true,
        rationale:
          'Devotion left intact ends in collapse, fatal shock, or suicide at the reveal.',
      },
    ],
    hint: 'Collapse, fatal shock, or suicide — satanic nature of worshipped figures.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question: 'What are False Gods in this architecture?',
    options: [
      {
        label: 'A',
        text: 'Fictional or parasitic constructs worshipped across planetary religions — including God, Allah, Jesus, Mohammed, and Zoroaster — serving as mechanisms for societal subjugation and satanic idolatry.',
        isCorrect: true,
        rationale:
          'False Gods span the major named deities and function as subjugation and satanic idolatry tools.',
      },
      {
        label: 'B',
        text: 'Only obscure local spirits with no presence in mainstream named religions or global control.',
        isCorrect: false,
        rationale:
          'They include the mainline named figures used worldwide for control.',
      },
      {
        label: 'C',
        text: 'Literal free-energy engineers who openly taught Lattice Membrane science in every temple.',
        isCorrect: false,
        rationale:
          'They are control constructs and satanic idolatry mechanisms, not free-energy teachers.',
      },
      {
        label: 'D',
        text: 'Neutral finance mascots that never touch cognition, sacrifice history, or soul recycling.',
        isCorrect: false,
        rationale:
          'False Gods drive religious subjugation; Finance is a separate String.',
      },
    ],
    hint: 'God, Allah, Jesus, Mohammed, Zoroaster — control and satanic idolatry.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'What are The 3 Strings of Attachment, and how strong are they?',
    options: [
      {
        label: 'A',
        text: 'Three optional hobbies thinner than silk that dissolve if you change the channel once.',
        isCorrect: false,
        rationale:
          'They are stronger than Kevlar and must be severed to avoid psychological dissolution.',
      },
      {
        label: 'B',
        text: 'Religion, Finance, and Perceived Knowledge — psychological anchors stronger than Kevlar that bind consciousness to the artificial realm and must be severed to avoid psychological dissolution.',
        isCorrect: true,
        rationale:
          'Three Kevlar-strong anchors: Religion, Finance, Perceived Knowledge — cut them or dissolve.',
      },
      {
        label: 'C',
        text: 'Only Vatican architecture, gold mines, and university libraries with no ego or consciousness effect.',
        isCorrect: false,
        rationale:
          'The Strings are psychological anchors on consciousness, not mere building categories.',
      },
      {
        label: 'D',
        text: 'EBS, EMF, and the Projection Dome as physical cables under the Ice Wall alone.',
        isCorrect: false,
        rationale:
          'Those are reveal mechanisms; the Strings are Religion, Finance, and Perceived Knowledge.',
      },
    ],
    hint: 'Religion · Finance · Perceived Knowledge — stronger than Kevlar.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question: 'What will the Emergency Broadcast System (EBS) do regarding religion?',
    options: [
      {
        label: 'A',
        text: 'Crown a new official global deity and order intensified worship for the next thousand years.',
        isCorrect: false,
        rationale:
          'EBS proves the non-existence of benevolent religious deities by exposing suppressed atrocities.',
      },
      {
        label: 'B',
        text: 'Only announce stock prices and never mention child sacrifice or false benevolence.',
        isCorrect: false,
        rationale:
          'EBS forces confrontation with millennia of atrocities incompatible with a loving God.',
      },
      {
        label: 'C',
        text: 'Undeniably prove the non-existence of benevolent religious deities by exposing millennia of suppressed atrocities.',
        isCorrect: true,
        rationale:
          'EBS is the orchestrated broadcast that shatters benevolent-deity fiction with atrocity truth.',
      },
      {
        label: 'D',
        text: 'Quietly restore the projection dome so religious programming never faces visual challenge.',
        isCorrect: false,
        rationale:
          'EBS and related terminal events dismantle illusions; they do not restore the dome for comfort.',
      },
    ],
    hint: 'EBS exposes atrocities — no benevolent deities left standing.',
    correctAnswer: 'C',
  },
  {
    number: 8,
    question: 'What is the Vessel relative to religious bloodline doctrine?',
    options: [
      {
        label: 'A',
        text: 'The eternal self that reincarnates only inside one genetic family forever by divine law.',
        isCorrect: false,
        rationale:
          'The vessel is a temporary suit; the eternal soul is the true self, routinely recycled into new families.',
      },
      {
        label: 'B',
        text: 'A permanent golden idol that must stay worshipped to stabilize third-density loops forever.',
        isCorrect: false,
        rationale:
          'The vessel is the mortal physical suit; idolatry of bloodlines is the trap.',
      },
      {
        label: 'C',
        text: 'A finance ledger that measures soul density in currency units after death.',
        isCorrect: false,
        rationale:
          'Vessel = temporary physical suit driven by the eternal soul — not a money ledger.',
      },
      {
        label: 'D',
        text: 'The mortal, singular-use physical "suit" driven by the eternal soul — religious bloodline emphasis tethers people to third-density loops while the true self is not the family body.',
        isCorrect: true,
        rationale:
          'Body is a temporary suit; religious bloodline worship tethers souls into density loops.',
      },
    ],
    hint: 'Temporary physical suit — eternal soul is the true self.',
    correctAnswer: 'D',
  },
  {
    number: 9,
    question: 'What is the Vatican in this control architecture?',
    options: [
      {
        label: 'A',
        text: 'The subterranean headquarters for parasitic entities — a luxury slaughterhouse and soul-redistribution hub on a major planetary node.',
        isCorrect: true,
        rationale:
          'Vatican = parasitic HQ, luxury slaughterhouse, soul-redistribution hub on a major node.',
      },
      {
        label: 'B',
        text: 'A transparent public library that free-releases every suppressed atrocity file without portals or cages.',
        isCorrect: false,
        rationale:
          'Beneath it: slaughterhouses, child cages, and soul-intercept portals — not open atrocity libraries.',
      },
      {
        label: 'C',
        text: 'Only a tourist museum of free-energy condensers with no subterranean levels at all.',
        isCorrect: false,
        rationale:
          'Thirteen subterranean levels host parasitic infrastructure, not condenser museums.',
      },
      {
        label: 'D',
        text: 'The exclusive clean-exit gate reserved for those who intensify prayer to False Gods.',
        isCorrect: false,
        rationale:
          'It enforces reincarnation loops; clean exit requires severing Religion, not deepening it.',
      },
    ],
    hint: 'Parasitic HQ — slaughterhouse and soul hub on a major node.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'What is the foundational truth about all worshipped deities?',
    options: [
      {
        label: 'A',
        text: 'Half are real benevolent creators and half are myths, so partial worship remains safe.',
        isCorrect: false,
        rationale:
          'All worshipped deities are entirely fabricated constructs designed for control.',
      },
      {
        label: 'B',
        text: 'All worshipped deities are entirely fabricated constructs designed for control — believing in false gods is explicitly String 1 of the 3 Strings of Attachment.',
        isCorrect: true,
        rationale:
          'Total fabrication for control = String 1; there is no safe half-real pantheon.',
      },
      {
        label: 'C',
        text: 'They only exist as finance logos and never function as cognitive control systems.',
        isCorrect: false,
        rationale:
          'They are religious control constructs; Finance is a separate String.',
      },
      {
        label: 'D',
        text: 'They personally dismantle the projection dome for anyone who donates enough gold idols.',
        isCorrect: false,
        rationale:
          'Gold idols dampen frequencies; deities do not dismantle the dome for donors.',
      },
    ],
    hint: 'All deities fabricated for control — that is String 1.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question:
      'What psychological peril do the devout face when belief systems are exposed as masks for planetary-scale child sacrifice?',
    options: [
      {
        label: 'A',
        text: 'Mild curiosity followed by effortless conversion to free true cosmology with no bodily risk.',
        isCorrect: false,
        rationale:
          'Shock induces fatal heart attacks or drives them to suicide — severe peril.',
      },
      {
        label: 'B',
        text: 'Instant promotion to EBS anchors who calmly narrate atrocities without personal collapse.',
        isCorrect: false,
        rationale:
          'They collapse under the shock; they are not calmly promoted as anchors.',
      },
      {
        label: 'C',
        text: 'The shock will induce fatal heart attacks or drive them to suicide when lies manufactured to mask planetary-scale child sacrifice surface.',
        isCorrect: true,
        rationale:
          'Devout minds hit fatal cardiac shock or suicide when the child-sacrifice mask falls.',
      },
      {
        label: 'D',
        text: 'Nothing — religious programming already includes full child-sacrifice disclosure as core liturgy.',
        isCorrect: false,
        rationale:
          'Belief systems masked the sacrifice; disclosure is the killing blow to the program.',
      },
    ],
    hint: 'Fatal heart attacks or suicide when child-sacrifice lies surface.',
    correctAnswer: 'C',
  },
  {
    number: 12,
    question: 'What confrontation will the EBS force about a supposedly loving "God"?',
    options: [
      {
        label: 'A',
        text: 'How that figure invented free energy and banned all sacrifice for 30,000 peaceful years.',
        isCorrect: false,
        rationale:
          'EBS confronts how a loving God could permit torture, rape, and sacrifice of billions of children over 30,000 years.',
      },
      {
        label: 'B',
        text: 'How finance alone caused every atrocity while religious figures remained fully benevolent.',
        isCorrect: false,
        rationale:
          'The confrontation targets the benevolent-God story against child atrocity history.',
      },
      {
        label: 'C',
        text: 'How the flat Earth was always in every official textbook so no cognitive clash can occur.',
        isCorrect: false,
        rationale:
          'EBS and dome removal shatter frameworks; textbooks were weaponized, not honest.',
      },
      {
        label: 'D',
        text: 'How a supposedly loving "God" could permit the torture, rape, and sacrifice of billions of children over 30,000 years — a history incompatible with benevolent deity claims.',
        isCorrect: true,
        rationale:
          '30,000 years of child torture, rape, and sacrifice under "God" collapses the loving-deity story.',
      },
    ],
    hint: '30,000 years — torture, rape, sacrifice of billions of children.',
    correctAnswer: 'D',
  },
  {
    number: 13,
    question: 'What happens to religious individuals who have no defense mechanism for that deception?',
    options: [
      {
        label: 'A',
        text: 'They mentally collapse or evaporate into the aether as pixelation dust.',
        isCorrect: true,
        rationale:
          'No defense mechanism → mental collapse or evaporation into aether as pixelation dust.',
      },
      {
        label: 'B',
        text: 'They automatically receive clean exit because collapse is counted as devotion.',
        isCorrect: false,
        rationale:
          'Collapse and pixelation are elimination modes, not clean exit.',
      },
      {
        label: 'C',
        text: 'They are relocated to crystalline temples as permanent high-frequency caretakers.',
        isCorrect: false,
        rationale:
          'They join the eliminated majority; temples were hidden by idol dampening, not gifted as prizes.',
      },
      {
        label: 'D',
        text: 'They rewrite EBS content live and restore full belief in benevolent deities worldwide.',
        isCorrect: false,
        rationale:
          'EBS forces the confrontation; the unbound mind does not get to rewrite it away.',
      },
    ],
    hint: 'Collapse or evaporate as pixelation dust — no defense left.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question: 'How does the circular belief system subjugate natural cognition?',
    options: [
      {
        label: 'A',
        text: 'By training everyone to distrust experts and graze freely in true awakening pastures only.',
        isCorrect: false,
        rationale:
          'It replaces independent thought with dictates of external authorities or "experts".',
      },
      {
        label: 'B',
        text: 'It requires a subdued mind so natural cognition and independent thought paths are easily replaced by the dictates of external authorities or "experts".',
        isCorrect: true,
        rationale:
          'Subdued mind → independent paths overwritten by external religious authorities.',
      },
      {
        label: 'C',
        text: 'By publishing full Vatican subterranean maps and inviting public audits of every portal.',
        isCorrect: false,
        rationale:
          'Circular religion hides and controls; it does not open parasitic infrastructure to audit.',
      },
      {
        label: 'D',
        text: 'By making money illegal so only pure soul memory can dictate life paths.',
        isCorrect: false,
        rationale:
          'Finance remains another String; Religion\'s mechanic is cognitive subjugation via belief.',
      },
    ],
    hint: 'Subdued mind — replace independent thought with external "experts".',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question: 'What lies beneath the Vatican\'s thirteen subterranean levels?',
    options: [
      {
        label: 'A',
        text: 'Only empty tourist storage with no cages, portals, or slaughter infrastructure.',
        isCorrect: false,
        rationale:
          'Levels hold luxury slaughterhouses, child cages, and portals for negative entities.',
      },
      {
        label: 'B',
        text: 'Public free-energy museums celebrating crystalline temples without any soul interception.',
        isCorrect: false,
        rationale:
          'Infrastructure intercepts and redistributes souls — opposite of free public free-energy museums.',
      },
      {
        label: 'C',
        text: 'Luxury slaughterhouses, child cages, and portals used by negative entities to intercept and redistribute souls immediately after death.',
        isCorrect: true,
        rationale:
          '13 levels: slaughterhouses, child cages, portals for post-death soul interception and redistribution.',
      },
      {
        label: 'D',
        text: 'Retirement vaults for Finance String leaders with no demonic or ET traffic of any kind.',
        isCorrect: false,
        rationale:
          'Demons, Draco, Greys, and Anunnaki use those portals — not mere retirement vaults.',
      },
    ],
    hint: '13 levels — slaughterhouses, child cages, soul portals.',
    correctAnswer: 'C',
  },
  {
    number: 16,
    question: 'Which negative entities use Vatican portals, and to what end?',
    options: [
      {
        label: 'A',
        text: 'Only friendly librarians who delete reincarnation so every soul exits density permanently.',
        isCorrect: false,
        rationale:
          'Demons, Draco, Greys, and Anunnaki intercept souls to enforce continuous reincarnation.',
      },
      {
        label: 'B',
        text: 'Solely human accountants who never touch soul traffic after death.',
        isCorrect: false,
        rationale:
          'Named negative entities run post-death intercept and redistribution.',
      },
      {
        label: 'C',
        text: 'Galactic free-energy engineers restoring Lattice Membrane Networks with donated temple gold.',
        isCorrect: false,
        rationale:
          'Gold idols dampen frequencies; portals enforce reincarnation loops for parasites.',
      },
      {
        label: 'D',
        text: 'Demons, Draco, Greys, and Anunnaki intercept and redistribute souls immediately after death, enforcing continuous reincarnation.',
        isCorrect: true,
        rationale:
          'Those parasitic species run death-portal intercept to keep reincarnation continuous.',
      },
    ],
    hint: 'Demons, Draco, Greys, Anunnaki — intercept souls, force reincarnation.',
    correctAnswer: 'D',
  },
  {
    number: 17,
    question:
      'What satanic inversion appears in plain sight via "Bright and Morning Star" language?',
    options: [
      {
        label: 'A',
        text: 'Biblical scripture (Revelation 22:16) attributes "Bright and Morning Star" to Jesus — a title synonymous with Lucifer (the Light Bearer) and Planet Venus, a holographic generator casting light onto the moon harvesting station.',
        isCorrect: true,
        rationale:
          'Morning Star title links Jesus language to Lucifer/Venus holographic light cast on the moon harvest station.',
      },
      {
        label: 'B',
        text: 'The phrase only describes atmospheric condensers and never appears in religious texts.',
        isCorrect: false,
        rationale:
          'It is cited from biblical scripture as a plain-sight satanic inversion.',
      },
      {
        label: 'C',
        text: 'It proves Jesus and Lucifer are opposite beings with no shared titles in any text.',
        isCorrect: false,
        rationale:
          'The shared Morning Star title is the inversion hiding Lucifer identity in plain sight.',
      },
      {
        label: 'D',
        text: 'Venus is a solid free-energy planet that powers crystalline temples without holography.',
        isCorrect: false,
        rationale:
          'Planet Venus here is a holographic generator lighting the moon parasitic station.',
      },
    ],
    hint: 'Revelation 22:16 Morning Star = Lucifer / Venus holographic link.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question: 'What is the "God" of mainstream religion identified as in this inversion?',
    options: [
      {
        label: 'A',
        text: 'A neutral librarian who never participates in satanic idolatry or frequency dampening.',
        isCorrect: false,
        rationale:
          'Mainstream "God" is identified as actually Satan in this inversion.',
      },
      {
        label: 'B',
        text: 'Actually Satan — the mainstream religious deity identity collapses into the satanic inversion hidden in plain sight.',
        isCorrect: true,
        rationale:
          'Plain-sight inversion conclusion: the deity called "God" in mainstream religion is actually Satan.',
      },
      {
        label: 'C',
        text: 'Strictly Finance String software with no spiritual or satanic dimension at all.',
        isCorrect: false,
        rationale:
          'This is Religion String inversion, not a finance-only software label.',
      },
      {
        label: 'D',
        text: 'The eternal soul of every human, which makes external worship unnecessary and always taught.',
        isCorrect: false,
        rationale:
          'Religion externalizes salvation to False Gods; it does not teach pure eternal-soul autonomy.',
      },
    ],
    hint: 'Mainstream "God" = actually Satan under the inversion.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question: 'How does religious idolatry using extracted gold serve a physical control purpose?',
    options: [
      {
        label: 'A',
        text: 'Gold in idols amplifies ultra-high frequencies so crystalline temples become more visible to everyone.',
        isCorrect: false,
        rationale:
          'Gold idols dampen and suppress ultra-high frequencies near temples, hiding them.',
      },
      {
        label: 'B',
        text: 'Gold must leave the ground forever because Lattice Membrane Networks run better on empty soil.',
        isCorrect: false,
        rationale:
          'Gold naturally belongs in the ground to stabilize Lattice Membrane Networks.',
      },
      {
        label: 'C',
        text: 'Extracted gold that belongs in the ground to stabilize Lattice Membrane Networks is repurposed into statues and idols to dampen and suppress ultra-high frequencies near genuine crystalline temples.',
        isCorrect: true,
        rationale:
          'Idolatry steals grounding gold into idols that dampen UHF and hide crystalline temples.',
      },
      {
        label: 'D',
        text: 'Gold idols only decorate banks and never interact with planetary frequency architecture.',
        isCorrect: false,
        rationale:
          'They are functional frequency dampeners in the religious control stack.',
      },
    ],
    hint: 'Ground gold → idols that dampen UHF near crystalline temples.',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question: 'What does gold-idol dampening hide from third-density perception?',
    options: [
      {
        label: 'A',
        text: 'Only stock tickers and retirement forecasts with no temple or frequency dimension.',
        isCorrect: false,
        rationale:
          'It hides genuine crystalline temples by suppressing ultra-high frequencies near them.',
      },
      {
        label: 'B',
        text: 'The EBS schedule so no one can prepare for atrocity disclosure in advance.',
        isCorrect: false,
        rationale:
          'The stated functional target is crystalline temples hidden from third-density perception.',
      },
      {
        label: 'C',
        text: 'Nothing — third-density eyes always see full high-frequency temple architecture without overlays.',
        isCorrect: false,
        rationale:
          'Dampening hides temples from third-density perception by design.',
      },
      {
        label: 'D',
        text: 'Genuine crystalline temples — ultra-high frequencies near them are suppressed so third-density perception cannot register the true architecture.',
        isCorrect: true,
        rationale:
          'Idol dampening hides crystalline temples from third-density sight.',
      },
    ],
    hint: 'Hides crystalline temples from third-density perception.',
    correctAnswer: 'D',
  },
  {
    number: 21,
    question: 'Why is religiously sanctioned family bloodline worship obsolete?',
    options: [
      {
        label: 'A',
        text: 'The physical body is a temporary vehicle; the true self is the eternal soul, routinely recycled into entirely new families and countries within minutes of death.',
        isCorrect: true,
        rationale:
          'Soul recycling into new families within minutes makes bloodline worship a trap, not truth.',
      },
      {
        label: 'B',
        text: 'Because every soul stays in one genetic line forever by unbreakable cosmic law.',
        isCorrect: false,
        rationale:
          'Souls are routinely recycled into new families and countries — the opposite of fixed bloodlines.',
      },
      {
        label: 'C',
        text: 'Because Finance already replaced all family bonds with stock portfolios exclusively.',
        isCorrect: false,
        rationale:
          'Religion uses nostalgic vessel bloodline bonds specifically; soul recycling breaks that tether.',
      },
      {
        label: 'D',
        text: 'Because the Vatican bans all family contact above the thirteenth subterranean level only.',
        isCorrect: false,
        rationale:
          'Obsolescence comes from eternal-soul identity and rapid post-death reassignment, not a visitor policy.',
      },
    ],
    hint: 'Temporary vessel — soul recycled into new families within minutes.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question: 'How does Religion work with Finance and Perceived Knowledge?',
    options: [
      {
        label: 'A',
        text: 'Each String cancels the others so keeping Religion alone is always safe.',
        isCorrect: false,
        rationale:
          'Together they form an almost impenetrable ego shield trapping consciousness in the density loop.',
      },
      {
        label: 'B',
        text: 'Together the three constructs form an almost impenetrable shield around the human ego, trapping it within the physical density loop — Religion pacifies the soul into continuous suffering and external salvation while Finance distracts and Perceived Knowledge defends false cosmology.',
        isCorrect: true,
        rationale:
          'Three-String stack: Religion pacifies, Finance distracts, Perceived Knowledge armors ego — density loop trap.',
      },
      {
        label: 'C',
        text: 'They only operate on NPCs and never affect anyone with a genuine eternal soul.',
        isCorrect: false,
        rationale:
          'Genuine souls must sever them; string-bound humans join NPC elimination in the clash.',
      },
      {
        label: 'D',
        text: 'They exclusively teach flat unmoving Earth so no intellectual defense against true cosmology remains.',
        isCorrect: false,
        rationale:
          'Perceived Knowledge defends against true cosmology; Religion pacifies rather than teaches flat-Earth truth.',
      },
    ],
    hint: 'Three-String ego shield — pacify, distract, intellectually defend.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question: 'What simultaneous shatter hits all three Strings during terminal events?',
    options: [
      {
        label: 'A',
        text: 'A gentle bank holiday that leaves the Projection Dome and religious programming fully intact.',
        isCorrect: false,
        rationale:
          'EMF strike plus Projection Dome removal visibly shatters the illusion and all three Strings.',
      },
      {
        label: 'B',
        text: 'Only a university exam on Copernicus that strengthens Perceived Knowledge without sky changes.',
        isCorrect: false,
        rationale:
          'Visible cosmic reality and dome removal clash with savior attachment — not a school exam.',
      },
      {
        label: 'C',
        text: 'When the planetary EMF event strikes and the holographic Projection Dome obscuring the true sky is removed, visible reality shatters all three Strings simultaneously.',
        isCorrect: true,
        rationale:
          'EMF + dome removal = simultaneous String shatter under undeniable visual simulation breakdown.',
      },
      {
        label: 'D',
        text: 'A private Vatican sermon that reinstalls False Gods more deeply than before the events.',
        isCorrect: false,
        rationale:
          'Events dismantle programming; they do not reinstall deeper False God devotion as safety.',
      },
    ],
    hint: 'EMF event + Projection Dome removed — all three Strings shatter.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question:
      'What happens to those heavily bound by religious programming when cosmic reality has no mental pigeon-hole?',
    options: [
      {
        label: 'A',
        text: 'They calmly invent new doctrines and remain on the physical plane without any elimination risk.',
        isCorrect: false,
        rationale:
          'Attachment to an invisible savior clashes with visual evidence; they join the 97% NPC elimination.',
      },
      {
        label: 'B',
        text: 'They alone receive clean exit because clash intensity is mistaken for devotion strength.',
        isCorrect: false,
        rationale:
          'Clash ensures elimination with the 97% NPC population, not clean exit.',
      },
      {
        label: 'C',
        text: 'They convert the Projection Dome back on using prayer gold and cancel the EMF event entirely.',
        isCorrect: false,
        rationale:
          'They possess no framework for the display; prayer gold does not reverse terminal mechanics.',
      },
      {
        label: 'D',
        text: 'Their attachment to an invisible savior violently clashes with simulation breakdown evidence, ensuring they join the 97% NPC population eliminated from the physical plane.',
        isCorrect: true,
        rationale:
          'No pigeon-hole + savior attachment = join 97% NPC elimination off the physical plane.',
      },
    ],
    hint: 'Savior clash → join 97% NPC elimination.',
    correctAnswer: 'D',
  },
  {
    number: 25,
    question: 'What is the strategic imperative for anyone attempting to ascend?',
    options: [
      {
        label: 'A',
        text: 'Immediate total uninstallation of all religious beliefs — press pause on all devotion to external deities, completely sever String 1, strip false matrix comfort, survive Scare Event trauma, and secure a clean exit from the current physical simulation.',
        isCorrect: true,
        rationale:
          'Total uninstall of Religion now: sever String 1, drop false comfort, survive Scare Events, clean exit.',
      },
      {
        label: 'B',
        text: 'Maintain a fractional belief that a god might be real as a backup comfort during Scare Events.',
        isCorrect: false,
        rationale:
          'Even fractional belief guarantees psychological destruction during terminal awakening phases.',
      },
      {
        label: 'C',
        text: 'Intensify idol gold extraction so crystalline temples stay hidden and third-density remains comfortable.',
        isCorrect: false,
        rationale:
          'Idolatry is satanic frequency dampening to strip away, not intensify.',
      },
      {
        label: 'D',
        text: 'Outsource salvation entirely to Vatican portals so continuous reincarnation becomes the ascension path.',
        isCorrect: false,
        rationale:
          'Vatican portals enforce reincarnation loops; ascension requires severing that religious tether.',
      },
    ],
    hint: 'Total uninstall String 1 — survive Scare Events, clean exit.',
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
  'Test your grasp of Religion (False Gods) — String 1, circular belief, Vatican infrastructure, satanic inversion, and total uninstallation for a clean exit.';
const DESC_META =
  'Interactive Living Truth Quiz on Religion (False Gods): False Gods, EBS, 30,000 years of child sacrifice, Morning Star inversion, gold idol dampening, and severing String 1.';

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
      'Religion is String 1 — a circular belief system that subdues the mind through False Gods. God, Allah, Jesus, Mohammed, Zoroaster: control constructs and satanic idolatry, not benevolence. The Vatican is a parasitic slaughterhouse and soul hub on a major node. Gold that belongs in the Lattice is cast into idols that hide crystalline temples. Morning Star language paints Lucifer in plain sight; mainstream "God" collapses into Satan. EBS will force 30,000 years of child torture into the open. Those who keep even a fraction of devotion face fatal shock, pixelation, or elimination with the 97%. Press pause on every external deity. Sever String 1. Survive the Scare Events. Take the clean exit.',
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
console.log('PASS: audited 25/25 against data/alice-topics/religion-false-gods.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
