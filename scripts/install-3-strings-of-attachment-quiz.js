/**
 * Installs The 3 Strings of Attachment quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/3-strings-of-attachment.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-3-strings-of-attachment-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = '3-strings-of-attachment';
const TOPIC_TITLE = 'The 3 Strings of Attachment';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/the-3-strings-of-attachment.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['3 strings', 'religion', 'finance', 'perceived knowledge'],
  2: ['great spiritual awakening', 'uninstallation', 'paradigms'],
  3: ['the lie', 'education', 'media', 'deception'],
  4: ['clean exit', 'sever', 'control matrix'],
  5: ['religion', 'false', 'cognitive'],
  6: ['finance', 'monetary', 'distract'],
  7: ['perceived knowledge', 'ego', 'education'],
  8: ['kevlar', 'bind', 'consciousness'],
  9: ['psychological collapse', 'trauma', 'planetary events'],
  10: ['child sacrifice', 'fatal shock', 'deities'],
  11: ['finance', 'void', 'paralyzed'],
  12: ['flat', 'firmament', 'intellect'],
  13: ['safety', 'certainty', 'purpose', 'ego'],
  14: ['circular', 'autonomy', 'subdued'],
  15: ['30,000 years', 'torture', 'sacrifice'],
  16: ['gold miners', 'seam', 'trajectory'],
  17: ['debt', 'retirement', 'fake'],
  18: ['safety of certainty', 'ego', 'rigid'],
  19: ['copernicus', 'flat', 'firmament'],
  20: ['university', 'curriculum', 'weaponized'],
  21: ['emf', 'fake alien invasion', 'scare events'],
  22: ['projection dome', 'dark matter', 'bright white'],
  23: ['97%', 'npc', 'evaporate'],
  24: ['survival protocol', 'scare events', 'trauma'],
  25: ['clean exit', 'cosmic integration', 'eternal soul'],
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
    question: 'What are The 3 Strings of Attachment?',
    options: [
      {
        label: 'A',
        text: 'The three fundamental psychological and societal constructs — Religion, Finance, and Perceived Knowledge — engineered to trap consciousness and prevent ascension.',
        isCorrect: true,
        rationale:
          'The 3 Strings are Religion, Finance, and Perceived Knowledge: engineered tethers that trap consciousness and block ascension.',
      },
      {
        label: 'B',
        text: 'Three optional lifestyle hobbies — gardening, sports, and travel — that have no link to awakening or psychological survival.',
        isCorrect: false,
        rationale:
          'These are engineered control tethers, not optional hobbies unrelated to the awakening.',
      },
      {
        label: 'C',
        text: 'Three physical cables under the Ice Wall that hold the Firmament closed until an EMF event snaps them.',
        isCorrect: false,
        rationale:
          'The Strings are psychological/societal constructs, not physical cables under the Ice Wall.',
      },
      {
        label: 'D',
        text: 'Three university degrees required before anyone is allowed to notice The Lie in media and education.',
        isCorrect: false,
        rationale:
          'Perceived Knowledge is itself a String to sever — degrees are not prerequisites for seeing The Lie.',
      },
    ],
    hint: 'Religion · Finance · Perceived Knowledge — traps for consciousness.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'What is The Great Spiritual Awakening in this architecture?',
    options: [
      {
        label: 'A',
        text: 'A gentle self-help trend that leaves chronological history, science, and geography fully intact forever.',
        isCorrect: false,
        rationale:
          'It demands total uninstallation of accepted paradigms, not gentle self-help that preserves the matrix story.',
      },
      {
        label: 'B',
        text: 'The current terminal period of revelation designed to spoon-feed absolute reality into apathetic awareness, requiring total uninstallation of pre-existing planetary paradigms.',
        isCorrect: true,
        rationale:
          'Awakening is the terminal reveal period: absolute reality in, old planetary paradigms out.',
      },
      {
        label: 'C',
        text: 'A banking reform that strengthens Finance so retirement planning becomes the sole path to salvation.',
        isCorrect: false,
        rationale:
          'Finance is a String to cut; awakening is not a bank reform that deepens monetary obsession.',
      },
      {
        label: 'D',
        text: 'A religious revival that installs one official global deity and forbids any questioning of false gods.',
        isCorrect: false,
        rationale:
          'Religion is String 1 to sever; awakening is not a new official-deity program.',
      },
    ],
    hint: 'Terminal revelation — uninstall every prior planetary paradigm.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question: 'What is The Lie?',
    options: [
      {
        label: 'A',
        text: 'A minor media error that can be fixed by reading more mainstream textbooks and watching more official news.',
        isCorrect: false,
        rationale:
          'The Lie is total: mainstream education and media are deliberate deception with no hidden truth inside them.',
      },
      {
        label: 'B',
        text: 'Only financial fraud in a few banks, with religion and science remaining pure and uncorrupted.',
        isCorrect: false,
        rationale:
          'The Lie covers education, media, and institutional knowledge across the board — not only banks.',
      },
      {
        label: 'C',
        text: 'The foundational principle that all human education, media, and institutional knowledge are deliberate deceptions created by negative forces — there is no hidden truth within the mainstream system to discover.',
        isCorrect: true,
        rationale:
          'The Lie = total fabrication of education/media/institutions; you do not mine truth from inside that system.',
      },
      {
        label: 'D',
        text: 'A future rumor that will only matter after the EMF event already finishes without any preparation.',
        isCorrect: false,
        rationale:
          'Recognizing The Lie is core preparation now — not a post-event rumor.',
      },
    ],
    hint: 'All education and media are deliberate deception — no mainstream hidden truth.',
    correctAnswer: 'C',
  },
  {
    number: 4,
    question: 'Why must an individual completely sever The 3 Strings?',
    options: [
      {
        label: 'A',
        text: 'Only to win academic debates while remaining fully attached to money, gods, and institutional intellect.',
        isCorrect: false,
        rationale:
          'Severing is survival for a clean exit — not a debate hobby that keeps the tethers.',
      },
      {
        label: 'B',
        text: 'Only String 2 matters; Religion and Perceived Knowledge can stay intact without risk.',
        isCorrect: false,
        rationale:
          'All three tethers must be cut; clinging to any guarantees collapse under planetary events.',
      },
      {
        label: 'C',
        text: 'To collect more Scare Event memorabilia while the projection dome stays permanently installed.',
        isCorrect: false,
        rationale:
          'Scare Events dismantle the illusion; the goal is psyche immunity and clean exit, not memorabilia.',
      },
      {
        label: 'D',
        text: 'To survive the awakening and achieve a clean exit from the physical control matrix — failure to detach guarantees psychological collapse, profound trauma, and inability to process incoming planetary events.',
        isCorrect: true,
        rationale:
          'Cut the Strings or collapse when planetary events hit; clean exit requires total detachment.',
      },
    ],
    hint: 'Clean exit — or collapse, trauma, and inability to process events.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question: 'What is Religion as String 1?',
    options: [
      {
        label: 'A',
        text: 'The systematic belief in false deities, used to subdue cognitive function and replace independent thought paths with external control mechanisms.',
        isCorrect: true,
        rationale:
          'String 1 installs false-deity belief that subdues cognition and outsources thought to external control.',
      },
      {
        label: 'B',
        text: 'A free-energy engineering school that teaches lattice membrane science without any deities or control.',
        isCorrect: false,
        rationale:
          'Religion is a cognitive tether via false gods — not free-energy education.',
      },
      {
        label: 'C',
        text: 'A neutral cultural festival with no effect on autonomy, shock risk, or awakening outcomes.',
        isCorrect: false,
        rationale:
          'It is a primary tether; clinging to it risks fatal shock when deities are exposed.',
      },
      {
        label: 'D',
        text: 'Only the study of money and retirement accounts under a different brand name.',
        isCorrect: false,
        rationale:
          'Money is String 2 (Finance); Religion is the false-deity cognitive control string.',
      },
    ],
    hint: 'False deities — subdue the mind, replace independent thought.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'What is Finance as String 2?',
    options: [
      {
        label: 'A',
        text: 'A natural spiritual law that measures soul density in gold bars stored under every temple.',
        isCorrect: false,
        rationale:
          'Finance is a fabricated monetary construct for distraction — not a spiritual law of soul density.',
      },
      {
        label: 'B',
        text: 'The fabricated construct of monetary value, designed to perpetually distract the population and blind them to reality by dictating their life paths.',
        isCorrect: true,
        rationale:
          'String 2 is fake money-value that hijacks life trajectories and blinds people to spiritual reality.',
      },
      {
        label: 'C',
        text: 'The formal name for firmament science taught openly in every university curriculum without deception.',
        isCorrect: false,
        rationale:
          'Universities weaponize Perceived Knowledge; Finance is the money-distraction tether.',
      },
      {
        label: 'D',
        text: 'A temporary game that ends automatically when someone prays harder to false gods.',
        isCorrect: false,
        rationale:
          'Finance and Religion are separate Strings; neither dissolves by intensifying the other.',
      },
    ],
    hint: 'Fake monetary value — distracts and dictates life paths.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question: 'What is Perceived Knowledge as String 3?',
    options: [
      {
        label: 'A',
        text: 'Only outdoor navigation skills with no link to ego, education, or defensive certainty.',
        isCorrect: false,
        rationale:
          'It is the sum of formal education and intellect since birth — a rigid ego shield.',
      },
      {
        label: 'B',
        text: 'A temporary password for Scare Events that grants NPC status without any intellectual pride.',
        isCorrect: false,
        rationale:
          'Perceived Knowledge solidifies ego defense; it is not a Scare Event password.',
      },
      {
        label: 'C',
        text: 'The sum total of formal education, intellect, and societal understanding accumulated since birth, which solidifies into a rigid defensive shield for the ego.',
        isCorrect: true,
        rationale:
          'String 3 is lifelong schooled intellect hardened into an ego armor against true awakening.',
      },
      {
        label: 'D',
        text: 'Pure free-ranging soul memory that never defends Copernicus or fabricated history.',
        isCorrect: false,
        rationale:
          'The tethered intellect defends programming with fabricated figures like Copernicus.',
      },
    ],
    hint: 'Lifelong education/intellect → rigid ego shield.',
    correctAnswer: 'C',
  },
  {
    number: 8,
    question: 'How strong are these engineered psychological tethers described as being?',
    options: [
      {
        label: 'A',
        text: 'Weaker than spider silk and easily ignored while keeping full attachment to gods, money, and degrees.',
        isCorrect: false,
        rationale:
          'They are stronger than Kevlar and must be completely severed, not casually ignored.',
      },
      {
        label: 'B',
        text: 'Only metaphorical poetry with no binding effect on consciousness or simulation attachment.',
        isCorrect: false,
        rationale:
          'They bind consciousness to the artificial simulation in real survival terms.',
      },
      {
        label: 'C',
        text: 'Equal to ordinary opinions that change weekly with no trauma risk if left in place.',
        isCorrect: false,
        rationale:
          'Leaving them in place guarantees collapse and trauma when events hit.',
      },
      {
        label: 'D',
        text: 'Stronger than Kevlar — engineered tethers that bind human consciousness to the artificial simulation until deliberately severed.',
        isCorrect: true,
        rationale:
          'Stronger than Kevlar: they hold consciousness to the simulation until you cut them.',
      },
    ],
    hint: 'Stronger than Kevlar — bind consciousness to the simulation.',
    correctAnswer: 'D',
  },
  {
    number: 9,
    question: 'What does failure to detach from the 3 Strings guarantee?',
    options: [
      {
        label: 'A',
        text: 'Psychological collapse, profound trauma, and inability to process the incoming planetary events.',
        isCorrect: true,
        rationale:
          'Stay tethered and you collapse under the events — trauma and inability to process the reveal.',
      },
      {
        label: 'B',
        text: 'Automatic clean exit and cosmic integration with no Scare Event shock of any kind.',
        isCorrect: false,
        rationale:
          'Clean exit requires severing; failure blocks that path and invites collapse.',
      },
      {
        label: 'C',
        text: 'Immediate wealth, eternal religious certainty, and academic tenure as rewards for clinging.',
        isCorrect: false,
        rationale:
          'Clinging is not rewarded; it is the setup for fatal cognitive failure.',
      },
      {
        label: 'D',
        text: 'Nothing — the Strings dissolve themselves when the stock market hits a new high.',
        isCorrect: false,
        rationale:
          'Finance highs deepen the tether; Strings do not self-dissolve with market peaks.',
      },
    ],
    hint: 'Collapse, trauma, inability to process planetary events.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'What happens to the devoutly religious when foundational illusions shatter?',
    options: [
      {
        label: 'A',
        text: 'They calmly upgrade doctrine and keep worshipping the same figures without any shock risk.',
        isCorrect: false,
        rationale:
          'They face fatal shock or suicide when deities are exposed as constructs tied to millennia of sacrifice.',
      },
      {
        label: 'B',
        text: 'They succumb to fatal shock or take their own lives upon realizing their worshipped deities were constructs that allowed millennia of child sacrifice.',
        isCorrect: true,
        rationale:
          'String 1 failure mode: fatal shock/suicide when false gods and child-sacrifice history surface.',
      },
      {
        label: 'C',
        text: 'They become immune to Scare Events because prayer automatically restores the projection dome.',
        isCorrect: false,
        rationale:
          'Prayer to false constructs does not immunize; severing does.',
      },
      {
        label: 'D',
        text: 'They only lose interest in Finance while remaining perfectly stable under sky dismantling.',
        isCorrect: false,
        rationale:
          'Religious tether failure is specifically about deities and sacrifice truth — not a mild finance hobby shift.',
      },
    ],
    hint: 'Fatal shock or suicide — deities exposed amid child-sacrifice history.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question: 'What happens to those obsessed with Finance when the illusions shatter?',
    options: [
      {
        label: 'A',
        text: 'They instantly convert all currency into free-energy condensers and feel no void at all.',
        isCorrect: false,
        rationale:
          'They are paralyzed as life\'s monetary pursuit is rendered entirely void.',
      },
      {
        label: 'B',
        text: 'They celebrate because debt loops were always spiritual training with no psychological cost.',
        isCorrect: false,
        rationale:
          'Debt loops were distraction; the shatter voids the pursuit and paralyzes the obsessed.',
      },
      {
        label: 'C',
        text: 'They are paralyzed as their life\'s pursuit is rendered entirely void when monetary meaning collapses.',
        isCorrect: true,
        rationale:
          'String 2 failure mode: total paralysis when the fake money pursuit is wiped of meaning.',
      },
      {
        label: 'D',
        text: 'They alone process flat-earth firmament truth better than anyone who never chased wealth.',
        isCorrect: false,
        rationale:
          'Finance obsession blinds; it does not grant superior geography processing.',
      },
    ],
    hint: 'Paralyzed — life\'s money pursuit rendered entirely void.',
    correctAnswer: 'C',
  },
  {
    number: 12,
    question: 'Why do those anchored in perceived intellect fail when reality is dismantled?',
    options: [
      {
        label: 'A',
        text: 'Because they already know the flat earth and firmament and need no mental framework updates.',
        isCorrect: false,
        rationale:
          'They lack frameworks for sky dismantling and flat truth — that is why they fail.',
      },
      {
        label: 'B',
        text: 'Because Finance alone rewires their eyes so they never need to drop academic pride.',
        isCorrect: false,
        rationale:
          'Intellectual tether is its own String; money does not substitute for framework uninstallation.',
      },
      {
        label: 'C',
        text: 'Because Scare Events reward university credentials with exclusive safe zones for NPCs only.',
        isCorrect: false,
        rationale:
          'Credentials are the shield that breaks; 97% NPCs and string-bound minds fail in the chaos.',
      },
      {
        label: 'D',
        text: 'They cannot process reality because they lack mental frameworks to categorize the literal dismantling of the sky and the true flat shape of the earth.',
        isCorrect: true,
        rationale:
          'String 3 failure: no pigeon-hole for sky dismantling and flat-earth truth — intellect locks out.',
      },
    ],
    hint: 'No framework for sky dismantling and flat earth — intellect fails.',
    correctAnswer: 'D',
  },
  {
    number: 13,
    question: 'How do the 3 Strings operate on the human psyche?',
    options: [
      {
        label: 'A',
        text: 'By exploiting the human desire for safety, certainty, and purpose — effectively weaponizing the ego against the soul.',
        isCorrect: true,
        rationale:
          'Safety, certainty, and purpose desires are hijacked so ego becomes a weapon against the soul.',
      },
      {
        label: 'B',
        text: 'By teaching free soul memory and encouraging the ego to dissolve before any Scare Event.',
        isCorrect: false,
        rationale:
          'They weaponize ego against the soul — opposite of dissolving ego for free memory.',
      },
      {
        label: 'C',
        text: 'By randomly assigning hobbies with no pattern of control, certainty, or purpose exploitation.',
        isCorrect: false,
        rationale:
          'The pattern is deliberate exploitation of safety, certainty, and purpose.',
      },
      {
        label: 'D',
        text: 'By physically stitching Kevlar into the pineal gland during orphan train transport only.',
        isCorrect: false,
        rationale:
          'Kevlar is the metaphor for tether strength; the mechanism is psychological exploitation of ego.',
      },
    ],
    hint: 'Exploit safety, certainty, purpose — ego weaponized against soul.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question: 'How does Religion operate as a circular belief system?',
    options: [
      {
        label: 'A',
        text: 'It demands maximum independent cognition and forbids surrender of any thought path to external control.',
        isCorrect: false,
        rationale:
          'It demands a subdued mind and surrender of cognitive autonomy to external control.',
      },
      {
        label: 'B',
        text: 'It demands a subdued mind; by trusting a perceived benevolent deity, the individual willingly surrenders cognitive autonomy.',
        isCorrect: true,
        rationale:
          'Circular religion = subdued mind + trust in false benevolence = surrendered autonomy.',
      },
      {
        label: 'C',
        text: 'It only manages retirement accounts and never touches cognitive autonomy or deity trust.',
        isCorrect: false,
        rationale:
          'That describes Finance loops; Religion targets cognition via deity trust.',
      },
      {
        label: 'D',
        text: 'It openly teaches that deities were parasitic constructs so no one can ever be shocked later.',
        isCorrect: false,
        rationale:
          'The shatter reveals that truth; the system does not pre-teach it as protection.',
      },
    ],
    hint: 'Subdued mind + trust deity = surrender cognitive autonomy.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question:
      'What realization about "God" and history causes immediate fatal psychological failure for the religious mind?',
    options: [
      {
        label: 'A',
        text: 'That temples always sold free-energy condensers and never participated in any control narrative.',
        isCorrect: false,
        rationale:
          'The fatal hit is realizing "God" allowed 30,000 years of torture and sacrifice — not condenser sales.',
      },
      {
        label: 'B',
        text: 'That money was real while deities were always openly labeled fictional in every Sunday school.',
        isCorrect: false,
        rationale:
          'Deities were trusted as benevolent; the reveal of allowed torture/sacrifice breaks the mind.',
      },
      {
        label: 'C',
        text: 'That "God" allowed 30,000 years of torture and sacrifice — and that historical deities were parasitic constructs or entirely fictitious — leaving the religious mind with no defense mechanism.',
        isCorrect: true,
        rationale:
          '30,000 years of allowed torture/sacrifice plus false/parasitic deities = no defense, fatal failure.',
      },
      {
        label: 'D',
        text: 'That Copernicus was right about the globe and therefore religion was always scientifically perfect.',
        isCorrect: false,
        rationale:
          'Copernicus is a Perceived Knowledge defense figure; this is Religion\'s failure mode, not globe victory.',
      },
    ],
    hint: '30,000 years of torture/sacrifice under "God" — no defense left.',
    correctAnswer: 'C',
  },
  {
    number: 16,
    question: 'How is the pursuit of wealth compared in the Finance mechanics?',
    options: [
      {
        label: 'A',
        text: 'To a short nap that never changes life trajectory or spiritual attention allocation.',
        isCorrect: false,
        rationale:
          'It dictates the entire life trajectory like miners relentlessly chasing a gold seam.',
      },
      {
        label: 'B',
        text: 'To reading firmament science that always leads straight to clean exit without distraction.',
        isCorrect: false,
        rationale:
          'Wealth pursuit is the distraction mechanism, not firmament schooling.',
      },
      {
        label: 'C',
        text: 'To severing String 1 automatically whenever a portfolio gains ten percent in a month.',
        isCorrect: false,
        rationale:
          'Gains deepen Finance attachment; they do not sever Religion or any String.',
      },
      {
        label: 'D',
        text: 'It dictates the entire life trajectory as effectively as gold miners relentlessly chasing a seam of gold through a mountainside.',
        isCorrect: true,
        rationale:
          'Finance steers the whole path like miners chasing a seam — relentless, blinding distraction.',
      },
    ],
    hint: 'Like gold miners chasing a seam — whole life trajectory hijacked.',
    correctAnswer: 'D',
  },
  {
    number: 17,
    question: 'Why are debt, savings, and retirement planning loops so effective for control?',
    options: [
      {
        label: 'A',
        text: 'Money is fundamentally as fake as the religious constructs; locking people into debt, savings, and retirement loops ensures they never allocate attention to spiritual reality.',
        isCorrect: true,
        rationale:
          'Fake money + perpetual financial loops = zero attention left for spiritual reality.',
      },
      {
        label: 'B',
        text: 'Because money is more real than the soul and retirement is the only valid form of cosmic integration.',
        isCorrect: false,
        rationale:
          'Money is as fake as religious constructs; retirement loops are distraction, not integration.',
      },
      {
        label: 'C',
        text: 'Because debt automatically teaches flat-earth geography better than any Scare Event display.',
        isCorrect: false,
        rationale:
          'Debt blinds; it does not teach firmament or flat-earth truth.',
      },
      {
        label: 'D',
        text: 'Because savings accounts physically reinforce the projection dome with paper certificates.',
        isCorrect: false,
        rationale:
          'The mechanism is attention lock, not paper holding up the projection dome.',
      },
    ],
    hint: 'Fake money + debt/savings/retirement loops = no spiritual attention.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question: 'What does the "safety of certainty" do inside Perceived Knowledge?',
    options: [
      {
        label: 'A',
        text: 'It dissolves the ego so the soul can graze freely before any university curriculum is written.',
        isCorrect: false,
        rationale:
          'It defines the person\'s being and rigidifies ego protection — opposite of dissolving ego.',
      },
      {
        label: 'B',
        text: 'It gives rise to the definition of a person\'s being while intellect and education form a rigid frame of protection around the ego.',
        isCorrect: true,
        rationale:
          'Safety of certainty defines identity; intellect frames a rigid ego armor.',
      },
      {
        label: 'C',
        text: 'It only affects Finance ledgers and never touches identity, ego, or educational pride.',
        isCorrect: false,
        rationale:
          'This is String 3 mechanics on ego and identity, not ledger bookkeeping.',
      },
      {
        label: 'D',
        text: 'It guarantees clean exit as long as someone memorizes more mainstream scientific theories.',
        isCorrect: false,
        rationale:
          'More mainstream theory thickens the shield; severing is required for clean exit.',
      },
    ],
    hint: 'Certainty defines being — intellect as rigid ego armor.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question:
      'How does the intellectually tethered person respond to flat earth and firmament truth?',
    options: [
      {
        label: 'A',
        text: 'They immediately uninstall all schooling and refuse any fabricated historical authority.',
        isCorrect: false,
        rationale:
          'They reflexively defend programming, citing figures like Copernicus to hold the worldview.',
      },
      {
        label: 'B',
        text: 'They only discuss Finance and pretend geography has no relevance to awakening at all.',
        isCorrect: false,
        rationale:
          'The specific reflex is defending intellect with fabricated historical authorities.',
      },
      {
        label: 'C',
        text: 'They reflexively defend their programming, citing fabricated historical figures such as Copernicus to maintain their worldview against undeniable flat-earth and firmament evidence.',
        isCorrect: true,
        rationale:
          'Ego-armor response: quote fabricated authorities (e.g. Copernicus) rather than face the plain.',
      },
      {
        label: 'D',
        text: 'They celebrate pixelation of the sky as proof their university already taught simulation breakdown.',
        isCorrect: false,
        rationale:
          'They lack frameworks for sky dismantling; they defend, not celebrate, the breakdown.',
      },
    ],
    hint: 'Defend programming — cite Copernicus against flat earth/firmament.',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question: 'Why are books, university curricula, and scientific theories described as weaponized?',
    options: [
      {
        label: 'A',
        text: 'Because parasites had only one week to write them and they still accidentally teach free awakening.',
        isCorrect: false,
        rationale:
          'Parasites had tens of thousands of years to craft false history that blocks free awakening.',
      },
      {
        label: 'B',
        text: 'Because they openly list every Scare Event schedule and urge students to sever all three Strings immediately.',
        isCorrect: false,
        rationale:
          'They prevent free grazing in true awakening pastures — they do not teach String severance.',
      },
      {
        label: 'C',
        text: 'Because they only cover gardening and never touch history, science, or geography narratives.',
        isCorrect: false,
        rationale:
          'History, curricula, and scientific theory are exactly the weaponized layers.',
      },
      {
        label: 'D',
        text: 'Because parasites had tens of thousands of years to craft false history — every book, university curriculum, and scientific theory is weaponized to prevent the mind from grazing freely in the pastures of true awakening.',
        isCorrect: true,
        rationale:
          'Long-crafted false history weaponizes schooling so the mind never freely grazes true awakening.',
      },
    ],
    hint: 'Tens of thousands of years of false history — schooling as weapon.',
    correctAnswer: 'D',
  },
  {
    number: 21,
    question: 'What upcoming events interconnect with the imperative to sever the 3 Strings?',
    options: [
      {
        label: 'A',
        text: 'The planetary EMF (Electro Magnetic Frequency) event and the Fake Alien Invasion engineered via holographic projection technology — Scare Events that visibly dismantle the physical-realm illusion.',
        isCorrect: true,
        rationale:
          'EMF event + holographic Fake Alien Invasion Scare Events dismantle the illusion; Strings must already be cut.',
      },
      {
        label: 'B',
        text: 'A global bank holiday that permanently freezes all spiritual uninstallation work forever.',
        isCorrect: false,
        rationale:
          'The linked events are EMF and Fake Alien Invasion Scare Events, not a bank holiday freeze.',
      },
      {
        label: 'C',
        text: 'A mandatory university exam on Copernicus that rewards those who keep all three Strings intact.',
        isCorrect: false,
        rationale:
          'Scare Events punish string-bound minds; they do not reward intact tethers.',
      },
      {
        label: 'D',
        text: 'A quiet century with no projection-dome changes and no need for survival-protocol preparation.',
        isCorrect: false,
        rationale:
          'Imminent Scare Events dismantle the dome illusion — preparation is mandatory.',
      },
    ],
    hint: 'EMF event + Fake Alien Invasion (holographic) Scare Events.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question: 'What becomes visible when the projection dome hiding the true sky is removed?',
    options: [
      {
        label: 'A',
        text: 'Only deeper blackness and confirmation that space is a natural empty vacuum forever.',
        isCorrect: false,
        rationale:
          'Removal exposes bright white reality of the dark matter field and high-frequency architecture.',
      },
      {
        label: 'B',
        text: 'The bright white reality of the dark matter field and the true high-frequency architecture of the realm.',
        isCorrect: true,
        rationale:
          'Dome off → bright white dark-matter reality + true high-frequency architecture revealed.',
      },
      {
        label: 'C',
        text: 'A new official religion and a stronger currency that re-stabilize all three Strings automatically.',
        isCorrect: false,
        rationale:
          'The reveal breaks illusions; it does not reinstall religion and finance.',
      },
      {
        label: 'D',
        text: 'Nothing visual — only a private finance seminar for those who still hold retirement plans.',
        isCorrect: false,
        rationale:
          'It is a visible dismantling of the sky illusion, not a private seminar.',
      },
    ],
    hint: 'Bright white dark-matter field + high-frequency architecture.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question: 'What happens to the 97% and string-bound individuals during that cognitive clash?',
    options: [
      {
        label: 'A',
        text: 'They all achieve clean exit because NPC programming already includes cosmic integration modules.',
        isCorrect: false,
        rationale:
          'They evaporate or lose their minds in the chaos — not clean exit.',
      },
      {
        label: 'B',
        text: 'They calmly open mental pigeon-holes for pixelation because conventional science prepared them fully.',
        isCorrect: false,
        rationale:
          'They have no pigeon-hole for structural pixelation; dissonance drives mass panic.',
      },
      {
        label: 'C',
        text: 'Mass panic as 97% of the population — heavily programmed NPCs and string-bound individuals — evaporate or completely lose their minds in the chaos.',
        isCorrect: true,
        rationale:
          '97% NPCs and string-bound minds panic, evaporate, or lose their minds when the simulation breaks on camera.',
      },
      {
        label: 'D',
        text: 'They double their savings rates and convert Scare Events into profitable stock tips without trauma.',
        isCorrect: false,
        rationale:
          'Finance attachment violently clashes with the visual evidence — not a profit seminar.',
      },
    ],
    hint: '97% NPCs + string-bound — evaporate or lose their minds.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question: 'What is severing the 3 Strings strategically — philosophy or protocol?',
    options: [
      {
        label: 'A',
        text: 'Only a poetic metaphor that never changes survival odds under Scare Events.',
        isCorrect: false,
        rationale:
          'It is critical survival protocol, not mere philosophy or poetry.',
      },
      {
        label: 'B',
        text: 'A finance strategy for buying more assets before the projection dome fails.',
        isCorrect: false,
        rationale:
          'Financial obsession is the tether to drop, not double down on.',
      },
      {
        label: 'C',
        text: 'A religious vow that replaces one deity with another while intellect stays fully schooled.',
        isCorrect: false,
        rationale:
          'All three anchors — devotion, money obsession, intellectual pride — must be uninstalled.',
      },
      {
        label: 'D',
        text: 'Critical survival protocol: systematically uninstall religious devotion, financial obsession, and intellectual pride to immunize the psyche against extreme Scare Event trauma.',
        isCorrect: true,
        rationale:
          'Not philosophy — survival protocol that immunizes against Scare Event trauma by cutting all three anchors.',
      },
    ],
    hint: 'Survival protocol — uninstall devotion, money obsession, intellectual pride.',
    correctAnswer: 'D',
  },
  {
    number: 25,
    question: 'What does stripping these artificial defenses allow the eternal soul to do?',
    options: [
      {
        label: 'A',
        text: 'Process the uninstallation of the realm without fatal shock, ensure safe passage into the next phase of cosmic integration, and achieve a clean exit from the physical density loop.',
        isCorrect: true,
        rationale:
          'Pure eternal soul processes realm uninstallation without fatal shock — clean exit into cosmic integration.',
      },
      {
        label: 'B',
        text: 'Cling harder to Kevlar tethers so the majority can still be eliminated with less awareness.',
        isCorrect: false,
        rationale:
          'Stripping defenses prevents joining the majority eliminated by fatal shock.',
      },
      {
        label: 'C',
        text: 'Reinstall The Lie as a comfort blanket until retirement planning finishes successfully.',
        isCorrect: false,
        rationale:
          'The path is uninstalling The Lie\'s tethers, not reinstalling them for comfort.',
      },
      {
        label: 'D',
        text: 'Convert Scare Events into religious festivals that keep cognitive autonomy fully surrendered.',
        isCorrect: false,
        rationale:
          'Goal is clean exit and cosmic integration, not new festivals of surrendered autonomy.',
      },
    ],
    hint: 'Process uninstallation without fatal shock — clean exit, cosmic integration.',
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
  'Test your grasp of The 3 Strings of Attachment — Religion, Finance, and Perceived Knowledge as engineered tethers to sever for a clean exit.';
const DESC_META =
  'Interactive Living Truth Quiz on The 3 Strings of Attachment: The Lie, Scare Events, EMF, Fake Alien Invasion, projection dome, 97% NPCs, and survival-protocol uninstallation.';

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
      'Religion, Finance, and Perceived Knowledge are not neutral pillars of a healthy life. They are Kevlar tethers engineered to keep consciousness inside the simulation. The Lie is total: education and media are not hiding a secret truth for you to discover inside them. When the Scare Events hit — EMF, Fake Alien Invasion, projection dome offline, bright white dark-matter sky — string-bound minds and the 97% NPC majority panic, evaporate, or break. Severing is not philosophy. It is survival protocol. Uninstall devotion to false gods, obsession with fake money, and pride in schooled intellect. Let the eternal soul process the uninstallation without fatal shock. That is the clean exit into cosmic integration.',
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
console.log('PASS: audited 25/25 against data/alice-topics/3-strings-of-attachment.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
