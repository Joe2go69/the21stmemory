/**
 * Installs The Purge Phases quiz for Mega Breakdown (breakdown) transmission.
 * All 25 items authored from data/breakdown-topics/the-purge-phases.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-the-purge-phases-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'the-purge-phases';
const TOPIC_TITLE = 'The Purge Phases';
const SOURCE = 'breakdown';
const TOPIC_IMAGE = 'images/breakdown/the-purge-phases.webp';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['great purge', 'top', 'collapse'],
  2: ['covid', 'top-down', 'parasitic'],
  3: ['parasites', 'harvest', 'trafficking'],
  4: ['clones', 'holographic', 'panic'],
  5: ['whitehats', 'g.a.a', 'space force'],
  6: ['dumbs', 'underground', 'dismantled'],
  7: ['sleepers', 'panic', 'questioning'],
  8: ['e.b.s', 'disclosure', 'false reality'],
  9: ['truth tribunals', 'confessions', 'reconstruction'],
  10: ['covid', 'neutralized', 'replaced'],
  11: ['trafficking', 'stock market', 'shipping'],
  12: ['staged', 'a.i', 'script'],
  13: ['phase one', 'child', 'apex'],
  14: ['phase two', 'ceos', 'frequency'],
  15: ['phase three', 'adreno-chrome', 'dumbs'],
  16: ['phase four', 'business as usual', 'sleepers'],
  17: ['phase five', 'edge', 'sirens'],
  18: ['phase six', 'lockdown', 'military'],
  19: ['phase seven', 'trafficking', 'election fraud'],
  20: ['phase eight', 'tribunals', 'executions'],
  21: ['blue beam', 'world war', 'overlay'],
  22: ['russia', 'china', 'iran'],
  23: ['npc', 'glitch', 'resonating'],
  24: ['stand-ins', 'time window', 'infrastructure'],
  25: ['second realm', 'real craft', 'great split'],
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
    question: 'What is the overall design of executing The Great Purge?',
    options: [
      {
        label: 'A',
        text: 'A highly orchestrated multi-tiered operation dismantling worldwide parasitic infrastructure from the top of the control pyramid downward — without triggering full-scale societal collapse — until the precise moment to shatter false reality and initiate planetary ascension.',
        isCorrect: true,
        rationale:
          'Top-down multi-phase dismantling of parasites while holding normalcy until the shatter-and-ascend window.',
      },
      {
        label: 'B',
        text: 'A random bottom-up riot that begins with street vendors and never touches global leaders or finance.',
        isCorrect: false,
        rationale:
          'The sequence begins at the apex of the power pyramid, not at random bottom-up street chaos.',
      },
      {
        label: 'C',
        text: 'An instant total collapse of every city on day one with no phases and no managed consciousness prep.',
        isCorrect: false,
        rationale:
          'Phases maintain the illusion of normalcy and carefully manage consciousness until the reveal window.',
      },
      {
        label: 'D',
        text: 'A pure finance reform with no neutralization of entities and no severing of trafficking pipelines.',
        isCorrect: false,
        rationale:
          'The purge neutralizes dangerous entities and severs financial pipelines, including trafficking lifeblood.',
      },
    ],
    hint: 'Top-down multi-tier purge — avoid full collapse until the shatter moment.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'What is The Great Purge?',
    options: [
      {
        label: 'A',
        text: 'A fashion rebrand of logos with no targeting of leaders, infrastructure, or hidden economies.',
        isCorrect: false,
        rationale:
          'It is systematic top-down removal of parasitic control structures targeting leaders, infrastructure, and hidden economies.',
      },
      {
        label: 'B',
        text: 'The systematic top-down removal of parasitic control structures, beginning during the Covid lockdowns, targeting global leaders, infrastructure, and hidden economies.',
        isCorrect: true,
        rationale:
          'Great Purge = top-down parasitic structure removal starting under Covid lockdowns.',
      },
      {
        label: 'C',
        text: 'Only a weather program managed by NPCs with no Whitehat or Space Force involvement.',
        isCorrect: false,
        rationale:
          'Whitehats, G.A.A., and Space Force execute physical dismantling and communications seizure.',
      },
      {
        label: 'D',
        text: 'A single-day E.B.S. ad with no multi-phase timeline and no clone replacements of elites.',
        isCorrect: false,
        rationale:
          'Eight sequential phases and clone/stand-in replacements are core to the operation.',
      },
    ],
    hint: 'Top-down parasitic removal — begins under Covid lockdowns.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question: 'Who are the Parasites in this architecture?',
    options: [
      {
        label: 'A',
        text: 'Benevolent Solar Family healers who never harvest energy or run underground economies.',
        isCorrect: false,
        rationale:
          'Parasites hijacked the planetary grid to harvest energy and maintain the 3D illusion.',
      },
      {
        label: 'B',
        text: 'Only surface politicians with no link to trafficking, drugs, or organ harvesting pipelines.',
        isCorrect: false,
        rationale:
          'Human trafficking and underground economies are named as their lifeblood.',
      },
      {
        label: 'C',
        text: 'The dark forces that hijacked the planetary grid to harvest energy and maintain the 3D illusion, utilizing human trafficking and underground economies as their lifeblood.',
        isCorrect: true,
        rationale:
          'Parasites = grid hijackers harvesting via trafficking and underground economies.',
      },
      {
        label: 'D',
        text: 'Sleepers who merely need more television until they wake without any control infrastructure.',
        isCorrect: false,
        rationale:
          'Sleepers are unawakened souls to manage; Parasites are the dark control infrastructure.',
      },
    ],
    hint: 'Dark forces — grid harvest — trafficking as lifeblood.',
    correctAnswer: 'C',
  },
  {
    number: 4,
    question: 'What are Clones in the purge operation?',
    options: [
      {
        label: 'A',
        text: 'True eternal souls volunteering as permanent world leaders with full free will forever.',
        isCorrect: false,
        rationale:
          'Clones are temporary replacements for neutralized elites to prevent immediate societal panic.',
      },
      {
        label: 'B',
        text: 'Only cartoon mascots with no biological, holographic, or A.I. composite technology involved.',
        isCorrect: false,
        rationale:
          'They include biological copies, stand-in actors with masks, holographics, and A.I. composites.',
      },
      {
        label: 'C',
        text: 'Permanent legal replacements who never give scripted speeches or fake meetings.',
        isCorrect: false,
        rationale:
          'Replaced leaders give scripted speeches and fake meetings under Phase Four narrative maintenance.',
      },
      {
        label: 'D',
        text: 'Biological copies, stand-in actors with masks, holographic projections, and A.I.-driven composites deployed to temporarily replace neutralized elites and prevent immediate societal panic.',
        isCorrect: true,
        rationale:
          'Clone toolkit = bio copies, mask actors, holographics, A.I. composites — buy time, avoid panic.',
      },
    ],
    hint: 'Bio copies, mask actors, holographics, A.I. composites — temporary elite stand-ins.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question: 'Who are the Whitehats in this command structure?',
    options: [
      {
        label: 'A',
        text: 'The tactical alliance forces operating alongside the G.A.A. and Space Force — executing physical dismantling of parasitic infrastructure and seizing communications.',
        isCorrect: true,
        rationale:
          'Whitehats + G.A.A. + Space Force = physical dismantling and communications seizure.',
      },
      {
        label: 'B',
        text: 'Parasitic banking heads who expand trafficking pipelines under a rebranded logo.',
        isCorrect: false,
        rationale:
          'Whitehats dismantle parasitic infrastructure; they do not expand trafficking lifeblood.',
      },
      {
        label: 'C',
        text: 'Only civilian fashion influencers with no military, Space Force, or DUMBS role.',
        isCorrect: false,
        rationale:
          'They execute physical dismantling including DUMBS and communications seizure with military allies.',
      },
      {
        label: 'D',
        text: 'Sleepers who never leave 3D perception and never touch any operational timeline.',
        isCorrect: false,
        rationale:
          'Sleepers are the unawakened public; Whitehats run the tactical alliance operation.',
      },
    ],
    hint: 'Alliance with G.A.A. and Space Force — dismantle infrastructure, seize communications.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'What are DUMBS?',
    options: [
      {
        label: 'A',
        text: 'Surface shopping malls that sell free-energy kits with no subterranean parasite function.',
        isCorrect: false,
        rationale:
          'DUMBS are Deep Underground Military Bases and subterranean cities used by dark forces.',
      },
      {
        label: 'B',
        text: 'Deep Underground Military Bases and subterranean cities utilized by the dark forces — dismantled by military and allied special forces.',
        isCorrect: true,
        rationale:
          'DUMBS = underground parasite cities; military and allied special forces dismantle them.',
      },
      {
        label: 'C',
        text: 'Only E.B.S. studios with no underground economy, adrenochrome, or organ-harvest role.',
        isCorrect: false,
        rationale:
          'Phase Three targets adrenochrome, organ harvesting, and DUMBS as parasite lifeblood infrastructure.',
      },
      {
        label: 'D',
        text: 'Public parks renamed for tourism with no dismantling operation required.',
        isCorrect: false,
        rationale:
          'They are subterranean bases dismantled as part of the underground economy collapse.',
      },
    ],
    hint: 'Deep Underground Military Bases — dismantled by military/allied forces.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question: 'Who are Sleepers in the purge design?',
    options: [
      {
        label: 'A',
        text: 'Fully awakened Resonating Sols who already see all eight phases with no management needed.',
        isCorrect: false,
        rationale:
          'Sleepers are unawakened souls trapped in 3D perception who must be carefully managed.',
      },
      {
        label: 'B',
        text: 'Only clones giving fake speeches with no public-consciousness management role.',
        isCorrect: false,
        rationale:
          'Clones maintain optics; Sleepers are the unawakened mass pushed carefully toward questioning.',
      },
      {
        label: 'C',
        text: 'Unawakened souls trapped within 3D reality perception who must be carefully managed and pushed to the edge of questioning without triggering full panic.',
        isCorrect: true,
        rationale:
          'Sleepers = unawakened 3D-trapped mass; edge of questioning, not full panic.',
      },
      {
        label: 'D',
        text: 'Whitehat commanders who design A.I. scripts for Russia, China, and Iran theater.',
        isCorrect: false,
        rationale:
          'Whitehats run operations; Sleepers are the public consciousness being managed.',
      },
    ],
    hint: 'Unawakened 3D-trapped souls — push to question, not full panic.',
    correctAnswer: 'C',
  },
  {
    number: 8,
    question: 'What is the E.B.S. in this sequence?',
    options: [
      {
        label: 'A',
        text: 'A soft weather channel that strengthens the false reality matrix without any overrides.',
        isCorrect: false,
        rationale:
          'E.B.S. is the communication override for global truth disclosures that shatter false reality.',
      },
      {
        label: 'B',
        text: 'Only a banking app update with no media seizure and no trafficking disclosures.',
        isCorrect: false,
        rationale:
          'Phase Seven seizes media and internet and releases trafficking and cult proof en masse.',
      },
      {
        label: 'C',
        text: 'A permanent blackout with no truth broadcast and no alliance communication takeover.',
        isCorrect: false,
        rationale:
          'Phase Six/Seven use lockdown and total media seizure for the truth broadcast environment.',
      },
      {
        label: 'D',
        text: 'The Emergency Broadcast System — communication override used by the alliance to deliver global truth disclosures and shatter the false reality matrix.',
        isCorrect: true,
        rationale:
          'E.B.S. = alliance communication override for mass truth that shatters false reality.',
      },
    ],
    hint: 'Emergency Broadcast System — alliance truth override.',
    correctAnswer: 'D',
  },
  {
    number: 9,
    question: 'What are Truth Tribunals?',
    options: [
      {
        label: 'A',
        text: 'Public and behind-the-scenes legal and military proceedings to extract confessions, execute justice, and secure the realm for reconstruction.',
        isCorrect: true,
        rationale:
          'Truth Tribunals = legal/military justice for confessions, justice, and reconstruction security.',
      },
      {
        label: 'B',
        text: 'Only celebrity award shows with no arrests, confessions, or executions involved.',
        isCorrect: false,
        rationale:
          'Phase Eight includes arrests, confessions, and executions of the rich, powerful, and famous.',
      },
      {
        label: 'C',
        text: 'NPC fan clubs that never process the world\'s powerful or secure any ascension path.',
        isCorrect: false,
        rationale:
          'Tribunals process the rich, powerful, and famous to secure the realm for reconstruction and ascension.',
      },
      {
        label: 'D',
        text: 'A Phase One-only tool abandoned before any infrastructure sweep begins.',
        isCorrect: false,
        rationale:
          'Truth Tribunals commence in Phase Eight Aftermath and Stabilization.',
      },
    ],
    hint: 'Legal/military proceedings — confessions, justice, reconstruction security.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'What has already happened to major world leadership under Covid cover?',
    options: [
      {
        label: 'A',
        text: 'Every major leader remains fully in power with no neutralization and no mimic technology.',
        isCorrect: false,
        rationale:
          'Every major world leader has already been neutralized and replaced; public leadership is optical.',
      },
      {
        label: 'B',
        text: 'Every major world leader — royals, prime ministers, presidents, high military brass, banking heads, Vatican hierarchy, and media moguls — has already been neutralized and replaced; perceived ongoing leadership is optical via advanced mimic technology and A.I. composites.',
        isCorrect: true,
        rationale:
          'Under Covid cover, apex leadership was neutralized; public sees only optical stand-ins and A.I. composites.',
      },
      {
        label: 'C',
        text: 'Only media moguls were replaced while royals and banking heads remain completely untouched.',
        isCorrect: false,
        rationale:
          'The list includes royals, PMs, presidents, military, banking, Vatican, and media moguls.',
      },
      {
        label: 'D',
        text: 'Leaders were promoted into Solar Family craft with no replacement optics on the ground.',
        isCorrect: false,
        rationale:
          'They were arrested/removed and replaced with stand-ins and holographic composites.',
      },
    ],
    hint: 'Major leaders already neutralized — public leadership is optical mimic/A.I.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question: 'What backed the world stock market, and what collapsed that backing?',
    options: [
      {
        label: 'A',
        text: 'Pure free-energy patents openly traded with no trafficking or organ-harvest pipelines involved.',
        isCorrect: false,
        rationale:
          'The market was backed by human trafficking, drug pipelines, and organ harvesting.',
      },
      {
        label: 'B',
        text: 'Only legitimate agriculture with no special forces seizures of shipping routes ever.',
        isCorrect: false,
        rationale:
          'Special forces seized shipping routes and dismantled subterranean networks, collapsing that backing.',
      },
      {
        label: 'C',
        text: 'Human trafficking, drug pipelines, and organ harvesting — functionally collapsed when special forces seized shipping routes and dismantled subterranean networks.',
        isCorrect: true,
        rationale:
          'Trafficking/drugs/organs backed the market; shipping seizures and subterranean dismantling killed that lifeblood.',
      },
      {
        label: 'D',
        text: 'Only Phase Eight tribunal fines with no Phase Three underground economy targeting.',
        isCorrect: false,
        rationale:
          'Phase Three specifically collapses underground economy funding; market collapse follows that lifeblood cut.',
      },
    ],
    hint: 'Trafficking/drugs/organs backed markets — shipping and DUMBS seizures collapsed it.',
    correctAnswer: 'C',
  },
  {
    number: 12,
    question: 'What are all present geopolitical tensions in this design?',
    options: [
      {
        label: 'A',
        text: 'Uncontrolled random wars with no A.I. script and no purpose for mass awakening.',
        isCorrect: false,
        rationale:
          'All present geopolitical tensions are entirely staged theatrics dictated by a unified A.I. script.',
      },
      {
        label: 'B',
        text: 'Pure organic diplomacy with no whitehat scripting of black chess pieces like Russia or China.',
        isCorrect: false,
        rationale:
          'Russia, China, and Iran are used as black chess pieces within a controlled script.',
      },
      {
        label: 'C',
        text: 'Only historical textbooks with no live cyber attacks, missile strikes, or staged chaos.',
        isCorrect: false,
        rationale:
          'Controlled script stages cyber attacks and limited missile strikes to simulate chaos.',
      },
      {
        label: 'D',
        text: 'Entirely staged theatrics dictated by a unified A.I. script to awaken the masses.',
        isCorrect: true,
        rationale:
          'Geopolitics = staged A.I.-scripted theater for mass awakening, not organic free chaos.',
      },
    ],
    hint: 'Staged geopolitics — unified A.I. script to awaken the masses.',
    correctAnswer: 'D',
  },
  {
    number: 13,
    question: 'What is Phase One of the operational timeline?',
    options: [
      {
        label: 'A',
        text: 'Target the most dangerous parasites at the apex — remove child predators and satanic operators without total societal collapse; major power players arrested or removed and instantly replaced with stand-ins and holographic composites.',
        isCorrect: true,
        rationale:
          'Phase One = apex predators out, stand-ins/holographics in, avoid total collapse.',
      },
      {
        label: 'B',
        text: 'Begin with street fashion influencers only and leave child predators completely untouched.',
        isCorrect: false,
        rationale:
          'Phase One targets the most dangerous parasites and child predators at the power apex.',
      },
      {
        label: 'C',
        text: 'Start with Truth Tribunals and executions before any elite neutralization occurs.',
        isCorrect: false,
        rationale:
          'Truth Tribunals are Phase Eight; Phase One is apex neutralization and replacement.',
      },
      {
        label: 'D',
        text: 'Only seize the internet with no arrests and no holographic composite replacements.',
        isCorrect: false,
        rationale:
          'Internet/media seizure is Phase Seven; Phase One is apex removal and optical replacement.',
      },
    ],
    hint: 'Phase One — apex parasites/child predators out, stand-ins in.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question: 'What is Phase Two: Infrastructure Sweep?',
    options: [
      {
        label: 'A',
        text: 'Only underground DUMBS work with no corporate CEOs or cultural influencers touched.',
        isCorrect: false,
        rationale:
          'Phase Two expands to corporate CEOs, entertainment and sports icons, and cultural influencers.',
      },
      {
        label: 'B',
        text: 'The sweep expands to corporate CEOs, entertainment and sports icons, and cultural influencers — stripped of real-world power in the big Whitehat takeover, cutting parasite influence over public politics, tastes, and thinking to raise Frequency Vibration Consciousness.',
        isCorrect: true,
        rationale:
          'Phase Two = CEOs/icons/influencers stripped of power to raise collective frequency consciousness.',
      },
      {
        label: 'C',
        text: 'A permanent pause that restores all influencer power and lowers Frequency Vibration Consciousness.',
        isCorrect: false,
        rationale:
          'The point is cutting parasite influence to raise Frequency Vibration Consciousness.',
      },
      {
        label: 'D',
        text: 'Only fake meetings for Sleepers with no Whitehat takeover of cultural power nodes.',
        isCorrect: false,
        rationale:
          'Fake meetings are Phase Four optics; Phase Two is the real-world power strip of influencers/CEOs.',
      },
    ],
    hint: 'Phase Two — CEOs, sports, entertainment stripped — raise frequency consciousness.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question: 'What is Phase Three: 3rd Realm Collapse focused on?',
    options: [
      {
        label: 'A',
        text: 'Only surface fashion awards with no smuggling, adrenochrome, or organ-harvest targeting.',
        isCorrect: false,
        rationale:
          'It targets underground economy: smuggling pipelines, adrenochrome, child organ harvesting.',
      },
      {
        label: 'B',
        text: 'Only E.B.S. speeches with no cargo seizures and no DUMBS dismantling.',
        isCorrect: false,
        rationale:
          'Cargoes are seized and DUMBS dismantled, permanently removing parasite money and human supply.',
      },
      {
        label: 'C',
        text: 'The underground economy funding parasite power — military targets smuggling pipelines, adrenochrome operations, and child organ harvesting; cargoes seized and DUMBS dismantled, permanently removing parasites\' lifeblood money and human supply.',
        isCorrect: true,
        rationale:
          'Phase Three = kill underground funding (smuggling, adrenochrome, organs) and dismantle DUMBS.',
      },
      {
        label: 'D',
        text: 'A narrative-only phase that leaves all subterranean networks fully operational forever.',
        isCorrect: false,
        rationale:
          'Subterranean networks and DUMBS are dismantled; lifeblood supply is permanently removed.',
      },
    ],
    hint: 'Phase Three — underground economy, adrenochrome, organs, DUMBS dismantled.',
    correctAnswer: 'C',
  },
  {
    number: 16,
    question: 'What is Phase Four: Narrative Maintenance?',
    options: [
      {
        label: 'A',
        text: 'Immediate full panic broadcasts that dump every name and face before Sleepers can stabilize.',
        isCorrect: false,
        rationale:
          'Phase Four holds Sleepers manageable until the mass reveal by continuing business as usual.',
      },
      {
        label: 'B',
        text: 'Total media seizure and E.B.S. mass disclosure as the first action of the entire purge.',
        isCorrect: false,
        rationale:
          'Mass disclosure is Phase Seven; Phase Four is optical business-as-usual maintenance.',
      },
      {
        label: 'C',
        text: 'Only Phase One arrests with no scripted speeches or fake ceremonies for replaced leaders.',
        isCorrect: false,
        rationale:
          'Replaced leaders give scripted speeches, hold fake meetings, and attend ceremonies.',
      },
      {
        label: 'D',
        text: 'Continue "business as usual" — replaced leaders give scripted speeches, hold fake meetings, and attend ceremonies to maintain the illusion and hold Sleepers in a manageable state until the mass reveal window.',
        isCorrect: true,
        rationale:
          'Phase Four = optical normalcy via scripted stand-in theater until mass reveal timing.',
      },
    ],
    hint: 'Phase Four — business as usual optics for Sleepers until reveal.',
    correctAnswer: 'D',
  },
  {
    number: 17,
    question: 'What is Phase Five: Trigger Events designed to do?',
    options: [
      {
        label: 'A',
        text: 'Deliberately stage geopolitical tensions, phased air raid sirens, and supply disruptions to push mass public consciousness to the edge — forcing Sleepers to question everything without descending into full panic.',
        isCorrect: true,
        rationale:
          'Phase Five = staged tensions/sirens/supply hits to edge of questioning, not full panic.',
      },
      {
        label: 'B',
        text: 'Cancel all geopolitical theater so Sleepers never question anything and stay fully asleep forever.',
        isCorrect: false,
        rationale:
          'The design is to push Sleepers to the edge of questioning everything.',
      },
      {
        label: 'C',
        text: 'Trigger instant total self-destruction of every city with no managed edge of questioning.',
        isCorrect: false,
        rationale:
          'Strict measured phases avoid total chaotic self-destruction; Phase Five is controlled edge pressure.',
      },
      {
        label: 'D',
        text: 'Only celebrate sports icons restored to full parasite power with no sirens or supply hits.',
        isCorrect: false,
        rationale:
          'Sports icons were stripped in Phase Two; Phase Five is staged trigger pressure on consciousness.',
      },
    ],
    hint: 'Phase Five — staged tensions/sirens/supply hits to the edge of questioning.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question: 'What is Phase Six: The Lockdown Window?',
    options: [
      {
        label: 'A',
        text: 'A return of traditional world police with no military streets presence and no E.B.S. takeover.',
        isCorrect: false,
        rationale:
          'Visible military on streets replaces traditional world police; global lockdown initiates E.B.S. takeover.',
      },
      {
        label: 'B',
        text: 'Visible military presence on the streets maintains order, replacing traditional world police; a global lockdown initiates total E.B.S. takeover with staged internet restrictions — the controlled environment for the truth broadcast.',
        isCorrect: true,
        rationale:
          'Phase Six = military streets + lockdown + staged net limits for the truth-broadcast environment.',
      },
      {
        label: 'C',
        text: 'Only private parties for elites with no lockdown and no communications seizure setup.',
        isCorrect: false,
        rationale:
          'It creates the controlled environment necessary for the truth broadcast via E.B.S. takeover.',
      },
      {
        label: 'D',
        text: 'A permanent end of all military presence so chaos fully replaces any ordered window.',
        isCorrect: false,
        rationale:
          'Visible military presence is established specifically to maintain order in the lockdown window.',
      },
    ],
    hint: 'Phase Six — military streets, lockdown, staged net limits for E.B.S.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question: 'What is Phase Seven: E.B.S. Action?',
    options: [
      {
        label: 'A',
        text: 'Soft entertainment only with no names, faces, or proof of any crimes released.',
        isCorrect: false,
        rationale:
          'Disclosures release names, faces, and proof of election fraud, trafficking, and satanic cult rituals.',
      },
      {
        label: 'B',
        text: 'Only clone ceremonies continuing business as usual with no media seizure at all.',
        isCorrect: false,
        rationale:
          'Media and internet are totally seized; mass disclosures shatter false reality in a single blow.',
      },
      {
        label: 'C',
        text: 'Media and the internet are totally seized; disclosures release names, faces, and proof of election fraud, child trafficking rings, and satanic cult rituals — designed to shatter the false reality in a single blow.',
        isCorrect: true,
        rationale:
          'Phase Seven = total media seize + mass proof dump that shatters false reality at once.',
      },
      {
        label: 'D',
        text: 'A Phase One-only preview with no connection to the later lockdown window environment.',
        isCorrect: false,
        rationale:
          'Phase Seven follows Phase Six\'s controlled environment as the truth-broadcast action phase.',
      },
    ],
    hint: 'Phase Seven — seize media, mass disclosure, shatter false reality.',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question: 'What is Phase Eight: Aftermath and Stabilization?',
    options: [
      {
        label: 'A',
        text: 'A return of all parasites to power with no tribunals and no reconstruction path.',
        isCorrect: false,
        rationale:
          'Truth Tribunals process the rich, powerful, and famous for reconstruction and ascension.',
      },
      {
        label: 'B',
        text: 'Only fashion awards restoring entertainment icons stripped in Phase Two.',
        isCorrect: false,
        rationale:
          'Phase Eight is arrests, confessions, and executions securing the realm for reconstruction.',
      },
      {
        label: 'C',
        text: 'A permanent freeze before any justice proceedings so Sleepers never see accountability.',
        isCorrect: false,
        rationale:
          'Tribunals commence specifically to process elites and secure the realm for reconstruction.',
      },
      {
        label: 'D',
        text: 'Truth Tribunals commence; the world\'s rich, powerful, and famous face arrests, confessions, and executions to secure the realm for reconstruction and the ascension processes.',
        isCorrect: true,
        rationale:
          'Phase Eight = tribunals, arrests, confessions, executions → reconstruction and ascension security.',
      },
    ],
    hint: 'Phase Eight — Truth Tribunals, justice, reconstruction for ascension.',
    correctAnswer: 'D',
  },
  {
    number: 21,
    question: 'How do the Purge Phases interconnect with Mega Breakdown frequency collapse?',
    options: [
      {
        label: 'A',
        text: 'Physical arrests and infrastructure dismantling secure the ground while staged WWIII scare and fake alien invasion (Project Blue Beam) push human consciousness to its breaking point as the Parasitic Overlay frequency collapses.',
        isCorrect: true,
        rationale:
          'Ground purge + Blue Beam/WWIII scare = consciousness edge as parasitic overlay frequency falls.',
      },
      {
        label: 'B',
        text: 'There is no frequency collapse and no Blue Beam component — only surface weather changes.',
        isCorrect: false,
        rationale:
          'Purge phases interconnect with frequency collapse of the Parasitic Overlay and Blue Beam theater.',
      },
      {
        label: 'C',
        text: 'Only tribunals matter; staged wars and fake invasions are forbidden in the design entirely.',
        isCorrect: false,
        rationale:
          'Staged WWIII and fake alien invasion are named tools to push consciousness to the breaking point.',
      },
      {
        label: 'D',
        text: 'Physical dismantling is delayed until after Second Realm arrival with no scare events first.',
        isCorrect: false,
        rationale:
          'Scare events and physical securing of ground prepare the field before Real Craft Arrival and Great Split.',
      },
    ],
    hint: 'Ground purge + WWIII/Blue Beam scare as overlay frequency collapses.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question: 'How do Whitehats use Russia, China, and Iran in the script?',
    options: [
      {
        label: 'A',
        text: 'As free uncontrolled enemies with no black-chess-piece role and no limited missile scripting.',
        isCorrect: false,
        rationale:
          'They are utilized as black chess pieces within a controlled script.',
      },
      {
        label: 'B',
        text: 'As black chess pieces within a controlled script — staging cyber attacks and limited missile strikes to simulate chaos so carefully modulated trauma forces NPCs to glitch and lets high-frequency signals of Resonating Sols pierce the static.',
        isCorrect: true,
        rationale:
          'Russia/China/Iran = scripted black pieces; cyber/missile theater glitches NPCs for Resonating Sols.',
      },
      {
        label: 'C',
        text: 'As permanent Whitehat headquarters with no adversarial theater and no chaos simulation.',
        isCorrect: false,
        rationale:
          'They are adversarial actors used as black chess pieces to simulate chaos under control.',
      },
      {
        label: 'D',
        text: 'Only as finance partners restoring trafficking-backed stock markets after Phase Three.',
        isCorrect: false,
        rationale:
          'Their role is staged cyber/missile chaos in the controlled awakening script, not market restoration.',
      },
    ],
    hint: 'Black chess pieces — staged cyber/missile chaos for NPC glitch.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question: 'What does carefully modulated trauma accomplish regarding NPCs and Resonating Sols?',
    options: [
      {
        label: 'A',
        text: 'It permanently seals Resonating Sols out of the static so only NPCs remain coherent forever.',
        isCorrect: false,
        rationale:
          'It forces NPCs to glitch, allowing high-frequency signals of Resonating Sols to pierce the static.',
      },
      {
        label: 'B',
        text: 'It cancels all frequency signals so no Sol can pierce anything during the purge phases.',
        isCorrect: false,
        rationale:
          'The design is to let Resonating Sols\' high-frequency signals pierce the static as NPCs glitch.',
      },
      {
        label: 'C',
        text: 'It forces NPCs to glitch, allowing the high-frequency signals of Resonating Sols to pierce the static.',
        isCorrect: true,
        rationale:
          'Modulated trauma → NPC glitch → Resonating Sol signals pierce static.',
      },
      {
        label: 'D',
        text: 'It only entertains Sleepers with no glitch effect and no signal-piercing purpose.',
        isCorrect: false,
        rationale:
          'NPC glitch and Sol signal pierce are the named frequency outcomes of the trauma design.',
      },
    ],
    hint: 'NPC glitch — Resonating Sol high-frequency signals pierce static.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question: 'Why use stand-ins and clones across the eight phases?',
    options: [
      {
        label: 'A',
        text: 'To permanently enthrone fake leaders as the Second Realm\'s only government forever.',
        isCorrect: false,
        rationale:
          'Stand-ins buy the vital time window needed to dismantle world infrastructure safely.',
      },
      {
        label: 'B',
        text: 'To trigger full-scale societal collapse on day one with no measured phasing at all.',
        isCorrect: false,
        rationale:
          'Measured phases and stand-ins prevent total chaotic self-destruction of the Great Awakening.',
      },
      {
        label: 'C',
        text: 'Only to entertain media moguls who were never neutralized under Covid cover.',
        isCorrect: false,
        rationale:
          'Media moguls were among those already neutralized; stand-ins maintain optical continuity.',
      },
      {
        label: 'D',
        text: 'Stand-ins and clones buy the vital time window needed to dismantle world infrastructure safely — ensuring the Great Awakening does not result in total chaotic self-destruction.',
        isCorrect: true,
        rationale:
          'Optical replacements buy safe dismantling time and prevent chaotic self-destruction.',
      },
    ],
    hint: 'Stand-ins buy time — safe infrastructure dismantling, no chaotic self-destruction.',
    correctAnswer: 'D',
  },
  {
    number: 25,
    question: 'What is the ultimate tactical goal of the eight phases?',
    options: [
      {
        label: 'A',
        text: 'Completely separate humanity from the 3D artificial matrix, clear the field for Real Craft Arrival, and as staged conflicts peak and the parasitic control grid dissolves, the Great Split brings forth the Second Realm — pure vibrant unpolluted crystalline reality where resonating souls return to true origins.',
        isCorrect: true,
        rationale:
          'Eight phases clear the matrix field for Real Craft Arrival and Great Split into the Second Realm.',
      },
      {
        label: 'B',
        text: 'Permanently lock humanity inside 3D artificial matrix theater with stronger trafficking markets.',
        isCorrect: false,
        rationale:
          'The goal is separation from the 3D artificial matrix, not permanent lock-in.',
      },
      {
        label: 'C',
        text: 'Only restore Phase Four business-as-usual forever with no Second Realm or craft arrival.',
        isCorrect: false,
        rationale:
          'Business as usual is temporary optics; the end state is Second Realm crystalline return.',
      },
      {
        label: 'D',
        text: 'Cancel Real Craft Arrival so resonating souls never leave the parasitic control grid.',
        isCorrect: false,
        rationale:
          'Clearing the field for Real Craft Arrival is the ultimate tactical goal of the eight phases.',
      },
    ],
    hint: 'Exit 3D matrix — Real Craft Arrival — Great Split into Second Realm.',
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

if (!fs.existsSync(path.join(ROOT, TOPIC_IMAGE))) {
  throw new Error(`Missing topic image: ${TOPIC_IMAGE}`);
}

const DESC_SHORT =
  'Test your grasp of The Purge Phases — eight-phase top-down dismantling of parasitic control, clones, E.B.S., and the path to the Second Realm.';
const DESC_META =
  'Interactive Living Truth Quiz on The Purge Phases: Covid cover strikes, DUMBS collapse, narrative maintenance, trigger events, Truth Tribunals, Blue Beam theater, and Real Craft Arrival.';

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
      'The purge is not chaos. It is eight measured blades from the apex down. Child predators first. Then CEOs and icons. Then the underground blood economy and DUMBS. Optics stay up so Sleepers do not shatter early. Triggers push to the edge. Lockdown and military streets open the E.B.S. window. Truth lands hard. Tribunals secure the field. Clones bought time. Blue Beam and staged war are theater. NPCs glitch. Resonating Sols cut through static. The matrix field clears. Real craft arrive. The Great Split opens the Second Realm. Crystalline. Clean. Home.',
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

const monoPath = path.join(ROOT, 'data', 'breakdown-topics.json');
const mono = JSON.parse(fs.readFileSync(monoPath, 'utf8'));
function findAndPatch(topics) {
  for (const t of topics) {
    if (t.id === TOPIC_ID) {
      t.quiz = quizMeta;
      if (topic.report) t.report = topic.report;
      if (topic.infographic_image) t.infographic_image = topic.infographic_image;
      if (topic.pdf_preview_image) t.pdf_preview_image = topic.pdf_preview_image;
      if (topic.slide_deck_pdf_url) t.slide_deck_pdf_url = topic.slide_deck_pdf_url;
      if (topic.rumble_videos) t.rumble_videos = topic.rumble_videos;
      t.is_placeholder = false;
      t.topic_image = TOPIC_IMAGE;
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error(`${TOPIC_ID} not found in breakdown-topics.json`);
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'matrix-scaffolding.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Matrix Scaffolding Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Matrix Scaffolding: the A.I. frequency framework projecting solidity, distance, and continuity, and the crystalline Second Realm beneath.',
    DESC_META,
  ],
  ['quiz/breakdown/matrix-scaffolding.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/matrix-scaffolding.webp', TOPIC_IMAGE],
  [
    'deep-dive.html?source=breakdown&amp;topic=matrix-scaffolding',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`,
  ],
  ['Matrix Scaffolding deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Matrix Scaffolding</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/matrix-scaffolding.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`,
  ],
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 80));
  }
  html = html.split(a).join(b);
}

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
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
    if (
      !inserted &&
      lines[i].includes('/quiz/breakdown/') &&
      lines[i].includes('priority')
    ) {
      const next = lines[i + 1] || '';
      const curPath = (lines[i].match(/path: '([^']+)'/) || [])[1] || '';
      const nextPath = (next.match(/path: '([^']+)'/) || [])[1] || '';
      if (
        curPath < target &&
        (nextPath > target || !nextPath.includes('/quiz/breakdown/'))
      ) {
        out.push(entry);
        inserted = true;
      }
    }
  }
  if (!inserted) {
    const anchor =
      "  { path: '/quiz/breakdown/hard-drive-framework.html', priority: '0.75', changefreq: 'monthly' },";
    sm = out.join('\n');
    if (!sm.includes(anchor)) {
      throw new Error('Could not find sitemap anchor to insert quiz entry');
    }
    sm = sm.replace(anchor, `${anchor}\n${entry}`);
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
console.log('PASS: audited 25/25 against data/breakdown-topics/the-purge-phases.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
