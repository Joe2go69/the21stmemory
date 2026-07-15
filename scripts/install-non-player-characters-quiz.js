/**
 * Installs Non-Player Characters quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/non-player-characters.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-non-player-characters-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'non-player-characters';
const TOPIC_TITLE = 'Non-Player Characters';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/non-player-characters.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['97%', 'npc', 'true humans'],
  2: ['consensus reality', 'conformity', 'derail'],
  3: ['eradication', 'containment', 'cosmic events'],
  4: ['eternal soul', 'inserts', 'synthetics'],
  5: ['replica souls', '4th density', 'hive-aligned'],
  6: ['30-second', 'pixelation dust', 'aether'],
  7: ['mind camp', 'conformity', 'boundaries'],
  8: ['d.u.m.b', 'cloned', 'orphan'],
  9: ['religion', 'finance', 'perceived knowledge'],
  10: ['520 million', 'true souls', '97%'],
  11: ['5th density', '4th density', 'ascension'],
  12: ['recycled', 'past lives', 'future'],
  13: ['3 survivors', '100 people', 'evaporate'],
  14: ['mainstream narrative', 'television', 'internet'],
  15: ['computer game', 'assigned roles', 'static'],
  16: ['internal monologue', 'self-awareness', 'slogans'],
  17: ['ostracization', 'ridicule', 'mind camp'],
  18: ['sport', 'fishing', 'awake'],
  19: ['child', 'financial', 'religious pride'],
  20: ['resets', 'stem cells', 'orphan trains'],
  21: ['china', '1.4 billion', 'one-child'],
  22: ['three strings', 'social credit', 'nudges'],
  23: ['97%', 'marginalized', 'ridiculed'],
  24: ['biological software', 'emotional attachments', 'pre-programmed'],
  25: ['mourn', 'never truly alive', 'simulated program'],
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
    question: 'What does the vast majority of the current global population actually consist of?',
    options: [
      {
        label: 'A',
        text: 'Not true humans or eternal spirits, but Non-Player Characters (NPCs), inserts, clones, and synthetics — exactly 97% of the masses.',
        isCorrect: true,
        rationale:
          '97% are artificial NPCs, inserts, clones, and synthetics — not true humans or eternal spirits.',
      },
      {
        label: 'B',
        text: 'Entirely true eternal spirits with full cosmic memory already active in every household.',
        isCorrect: false,
        rationale:
          'Only a maximum of 520 million true souls exist; 97% are artificial constructs.',
      },
      {
        label: 'C',
        text: 'Only animals and plants with no human-looking synthetic demographic at all.',
        isCorrect: false,
        rationale:
          'The 97% are human-looking artificial biological entities, not a non-human flora/fauna majority.',
      },
      {
        label: 'D',
        text: 'A 50/50 mix of true souls and Micro Suns with no clone or insert category present.',
        isCorrect: false,
        rationale:
          'The named split is exact: 97% artificial NPC-class mass, small true-soul remainder.',
      },
    ],
    hint: '97% — NPCs, inserts, clones, synthetics — not true humans.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'Why are these artificial constructs placed in the physical realm?',
    options: [
      {
        label: 'A',
        text: 'To teach free ascension and dissolve every consensus narrative as a public gift.',
        isCorrect: false,
        rationale:
          'They sway consensus reality, ensure total conformity, and derail true-soul spiritual progression.',
      },
      {
        label: 'B',
        text: 'To artificially sway consensus reality, ensure total conformity, and unwittingly derail the spiritual progression of true souls.',
        isCorrect: true,
        rationale:
          'Placement purpose: fake consensus, force conformity, derail true-soul progress.',
      },
      {
        label: 'C',
        text: 'Only to staff free D.U.M.B.S. tours with no role in social pressure or narrative control.',
        isCorrect: false,
        rationale:
          'D.U.M.B.S. grow clone orphans; NPCs themselves enforce consensus and conformity in society.',
      },
      {
        label: 'D',
        text: 'To permanently replace the Flash so no cosmic eradication event is ever required.',
        isCorrect: false,
        rationale:
          'NPCs are destined for total eradication during upcoming cosmic events, including the Flash.',
      },
    ],
    hint: 'Sway consensus — force conformity — derail true souls.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question: 'How are NPCs limited relative to genuine souls, and what is their destiny?',
    options: [
      {
        label: 'A',
        text: 'They are unlimited eternal spirits scheduled to rule 5th density after the Flash as a bloc.',
        isCorrect: false,
        rationale:
          'They are biologically and spiritually limited, programmed for containment, and destined for total eradication.',
      },
      {
        label: 'B',
        text: 'They reincarnate with full past-life libraries while true souls are the ones deleted at the EMF.',
        isCorrect: false,
        rationale:
          'NPCs are recycled, not reincarnated; they evaporate at the Flash while true souls remain.',
      },
      {
        label: 'C',
        text: 'Unlike genuine souls, NPCs are biologically and spiritually limited, programmed specifically for containment, and destined for total eradication during upcoming cosmic events.',
        isCorrect: true,
        rationale:
          'Limited constructs for containment — scheduled for total eradication in cosmic events.',
      },
      {
        label: 'D',
        text: 'They freely leave Mind Camp daily and rewrite the Mainstream Narrative at will.',
        isCorrect: false,
        rationale:
          'They are hard-wired into the Mainstream Narrative and permanently trapped in Mind Camp.',
      },
    ],
    hint: 'Limited for containment — destined for total eradication.',
    correctAnswer: 'C',
  },
  {
    number: 4,
    question: 'What are Non-Player Characters (NPCs) by definition?',
    options: [
      {
        label: 'A',
        text: 'True humans with eternal souls who simply prefer sports and fishing as hobbies.',
        isCorrect: false,
        rationale:
          'NPCs are artificial biological entities that possess no eternal soul.',
      },
      {
        label: 'B',
        text: 'Only digital avatars on screens with no physical body or population percentage.',
        isCorrect: false,
        rationale:
          'They are physical inserts/clones/synthetics constituting 97% of the global population.',
      },
      {
        label: 'C',
        text: '5th density elders volunteering as empty vessels to tutor Twin Flames full-time.',
        isCorrect: false,
        rationale:
          'They cannot ascend into 5th Density; they are trapped lower-frequency manufactures.',
      },
      {
        label: 'D',
        text: 'Artificial biological entities, inserts, clones, and synthetics that constitute 97% of the global population and possess no eternal soul.',
        isCorrect: true,
        rationale:
          'NPC = artificial bio-entity majority without an eternal soul.',
      },
    ],
    hint: 'Artificial majority — no eternal soul — 97%.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question: 'What are Replica Souls?',
    options: [
      {
        label: 'A',
        text: 'Cheap, hive-aligned imitations of true souls, manufactured in 4th density laboratories to animate newly created parasitic species and NPCs.',
        isCorrect: true,
        rationale:
          'Replica Souls = cheap hive knock-offs from 4th density labs powering NPCs and parasitic species.',
      },
      {
        label: 'B',
        text: 'Eternal Source sparks older than Micro Suns with full independent cosmic free will.',
        isCorrect: false,
        rationale:
          'They are cheap imitations woven for hive-aligned purpose, not primordial free Source sparks.',
      },
      {
        label: 'C',
        text: 'Only paperwork titles given to true souls who finish university with no lab manufacture.',
        isCorrect: false,
        rationale:
          'They are manufactured in 4th density laboratories using 4th density technology.',
      },
      {
        label: 'D',
        text: 'Temporary aliases used by Pleiadians who never animate any synthetic body.',
        isCorrect: false,
        rationale:
          'Replica Souls animate NPCs and newly created parasitic species — synthetic animation tech.',
      },
    ],
    hint: '4th density lab knock-offs — hive-aligned — animate NPCs.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'What is The Flash (EMF) relative to NPCs?',
    options: [
      {
        label: 'A',
        text: 'A multi-year soft glow that gently upgrades NPCs into true souls without deletion.',
        isCorrect: false,
        rationale:
          'It is a 30-second EMF event that instantly evaporates all NPCs into aether as pixelation dust.',
      },
      {
        label: 'B',
        text: 'A 30-second Electro Magnetic Frequency event that will instantly cause all NPCs to evaporate into the aether as pixelation dust.',
        isCorrect: true,
        rationale:
          'Flash = 30 seconds EMF; NPCs become pixelation dust in the aether instantly.',
      },
      {
        label: 'C',
        text: 'Only a banking outage that freezes Finance String accounts with no pixelation effect.',
        isCorrect: false,
        rationale:
          'The Flash evaporates NPCs as pixelation dust — not a bank outage.',
      },
      {
        label: 'D',
        text: 'A private meditation only true souls notice while NPCs remain embodied forever.',
        isCorrect: false,
        rationale:
          'The massive fake population evaporates; only ~3 of 100 remain in any location.',
      },
    ],
    hint: '30-second EMF — NPCs evaporate as pixelation dust.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question: 'What is Mind Camp?',
    options: [
      {
        label: 'A',
        text: 'A free-thinking academy that rewards dissent and dissolves every herd slogan on arrival.',
        isCorrect: false,
        rationale:
          'Mind Camp is restrictive social-conformity-driven cerebral boundaries for rigid NPC thought.',
      },
      {
        label: 'B',
        text: 'Only a sports stadium brand with no link to thought patterns or ostracization fear.',
        isCorrect: false,
        rationale:
          'It dictates rigid thought patterns and behaviors; fear of ostracization keeps them trapped in it.',
      },
      {
        label: 'C',
        text: 'The restrictive, social-conformity-driven cerebral boundaries that dictate the rigid thought patterns and behaviors of NPCs.',
        isCorrect: true,
        rationale:
          'Mind Camp = conformity-bound thought perimeter locking NPC behavior and cognition.',
      },
      {
        label: 'D',
        text: 'A D.U.M.B.S. grow-lab wing that only produces bodies with no mental boundary function.',
        isCorrect: false,
        rationale:
          'D.U.M.B.S. grow clone orphans; Mind Camp is the mental conformity prison for living NPCs.',
      },
    ],
    hint: 'Restrictive conformity boundaries for rigid NPC thought.',
    correctAnswer: 'C',
  },
  {
    number: 8,
    question: 'What are D.U.M.B.S. in this architecture?',
    options: [
      {
        label: 'A',
        text: 'Surface shopping malls that sell free-energy kits with no underground clone production.',
        isCorrect: false,
        rationale:
          'Deep Underground Military Bases grow new crops of cloned NPC orphans for post-reset repopulation.',
      },
      {
        label: 'B',
        text: 'Only libraries that teach true Sol-System cosmology without any clone or orphan function.',
        isCorrect: false,
        rationale:
          'They are underground bases for growing cloned NPC orphans after systemic resets.',
      },
      {
        label: 'C',
        text: 'Pleiadian embassies above the firmament with no role in Earth repopulation logistics.',
        isCorrect: false,
        rationale:
          'D.U.M.B.S. are deep underground military bases for clone orphan crops, not Pleiadian embassies.',
      },
      {
        label: 'D',
        text: 'Deep Underground Military Bases where new crops of cloned NPC orphans are grown to repopulate the realm following a systemic reset.',
        isCorrect: true,
        rationale:
          'D.U.M.B.S. = underground clone-orphan factories for post-reset repopulation.',
      },
    ],
    hint: 'Deep Underground Military Bases — grow cloned NPC orphans after resets.',
    correctAnswer: 'D',
  },
  {
    number: 9,
    question: 'What are the Three Strings?',
    options: [
      {
        label: 'A',
        text: 'Religion, Finance, and Perceived Knowledge — the primary control mechanisms that bind and define the awareness of the populace.',
        isCorrect: true,
        rationale:
          'Three Strings = Religion, Finance, Perceived Knowledge binding populace awareness.',
      },
      {
        label: 'B',
        text: 'Sports, fishing, and motor racing as the only allowed NPC interest categories forever.',
        isCorrect: false,
        rationale:
          'Those are example NPC interest types; the Strings are Religion, Finance, Perceived Knowledge.',
      },
      {
        label: 'C',
        text: 'Only television, radio, and magazines with no religious or financial control dimension.',
        isCorrect: false,
        rationale:
          'Media are programming pipes; the named control mechanisms are the Three Strings.',
      },
      {
        label: 'D',
        text: 'D.U.M.B.S., Orphan Trains, and China as literal physical cables under the ice wall.',
        isCorrect: false,
        rationale:
          'Those are deployment examples; Three Strings are psychological control mechanisms.',
      },
    ],
    hint: 'Religion · Finance · Perceived Knowledge.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'How many true souls exist versus the artificial majority?',
    options: [
      {
        label: 'A',
        text: 'Billions of true souls with only a few thousand NPCs as optional decoration.',
        isCorrect: false,
        rationale:
          'Maximum 520 million true souls; remaining 97% are entirely artificial NPCs.',
      },
      {
        label: 'B',
        text: 'Only a maximum of 520 million true souls exist on the planet; the remaining 97% of the population are entirely artificial NPCs.',
        isCorrect: true,
        rationale:
          '≤520 million true souls; everyone else in the 97% is artificial NPC mass.',
      },
      {
        label: 'C',
        text: 'Exactly equal true souls and NPCs with no 97% figure and no 520 million cap.',
        isCorrect: false,
        rationale:
          'Named figures: max 520 million true souls; 97% artificial remainder.',
      },
      {
        label: 'D',
        text: 'Zero true souls left — only Replica Souls and hive software remain worldwide.',
        isCorrect: false,
        rationale:
          'True souls remain as the small remnant; NPCs are the 97% fake majority.',
      },
    ],
    hint: 'Max ~520 million true souls — 97% artificial NPCs.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question: 'Why are NPCs absolutely incapable of ascending into 5th Density or higher?',
    options: [
      {
        label: 'A',
        text: 'Because they refuse free university seats while still holding eternal souls and past lives.',
        isCorrect: false,
        rationale:
          'Manufactured in 4th Density by 4th density parasites — trapped in lower frequencies without ascension architecture.',
      },
      {
        label: 'B',
        text: 'Because the Flash upgrades them all to 5th Density automatically as a permanent gift.',
        isCorrect: false,
        rationale:
          'The Flash evaporates them as pixelation dust; it does not ascend them.',
      },
      {
        label: 'C',
        text: 'Because they were manufactured in 4th Density by 4th density parasites — trapped in lower frequencies and lacking the spiritual architecture required for ascension.',
        isCorrect: true,
        rationale:
          '4th-density manufacture by parasites = no spiritual architecture for 5th+ ascent.',
      },
      {
        label: 'D',
        text: 'Because Mind Camp teachers ban ascent while NPCs secretly hold full Source-level intellect.',
        isCorrect: false,
        rationale:
          'Limitation is structural from 4th-density origin, not a classroom ban on secret Source intellect.',
      },
    ],
    hint: '4th-density manufacture — no architecture for 5th+ ascension.',
    correctAnswer: 'C',
  },
  {
    number: 12,
    question: 'Are NPCs reincarnated beings with past lives and a future beyond this epoch?',
    options: [
      {
        label: 'A',
        text: 'Yes — they reincarnate endlessly with full past-life libraries into every density freely.',
        isCorrect: false,
        rationale:
          'They are not reincarnated; they are merely recycled, with no past lives and no future beyond this epoch.',
      },
      {
        label: 'B',
        text: 'They reincarnate only as Twin Flames with guaranteed higher-density partner lives.',
        isCorrect: false,
        rationale:
          'NPCs have no past lives and no future beyond the current epoch — recycled only.',
      },
      {
        label: 'C',
        text: 'They hold more past lives than true souls and outlast the Flash as permanent rulers.',
        isCorrect: false,
        rationale:
          'They possess no past lives; the Flash deletes the massive fake population entirely.',
      },
      {
        label: 'D',
        text: 'No — they are merely recycled into the system, possessing no past lives and absolutely no future beyond the current epoch.',
        isCorrect: true,
        rationale:
          'Recycled, not reincarnated — no past lives, no future past this epoch.',
      },
    ],
    hint: 'Recycled only — no past lives, no future beyond this epoch.',
    correctAnswer: 'D',
  },
  {
    number: 13,
    question: 'What survival ratio remains after NPCs evaporate in the EMF event?',
    options: [
      {
        label: 'A',
        text: 'Only 3 survivors for every 100 people — the massive fake population evaporates into pixelation dust.',
        isCorrect: true,
        rationale:
          '3 of 100 remain; 97% fake population becomes pixelation dust in the aether.',
      },
      {
        label: 'B',
        text: 'Ninety-seven of every hundred remain while only three NPCs leave as a minor correction.',
        isCorrect: false,
        rationale:
          'Opposite ratio: 3 survivors per 100 after the fake majority evaporates.',
      },
      {
        label: 'C',
        text: 'All 100 remain embodied while only buildings pixelate with no human disappearance.',
        isCorrect: false,
        rationale:
          'Human demographic structure changes: the massive fake population evaporates.',
      },
      {
        label: 'D',
        text: 'Zero survivors worldwide because true souls are deleted alongside every NPC.',
        isCorrect: false,
        rationale:
          'True souls remain at about 3 per 100; NPCs are the ones erased.',
      },
    ],
    hint: '3 survivors per 100 — fake majority becomes pixelation dust.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question: 'How are NPCs hard-wired into the Mainstream Narrative?',
    options: [
      {
        label: 'A',
        text: 'Through pure Source downloads with no media, school, or social interaction involved.',
        isCorrect: false,
        rationale:
          'Programming arrives via television, radio, books, magazines, internet, and daily social interactions.',
      },
      {
        label: 'B',
        text: 'They receive programming through television, radio, books, magazines, the internet, and daily social interactions — hard-wired directly into the Mainstream Narrative.',
        isCorrect: true,
        rationale:
          'Media + social pipes hard-wire NPCs into the Mainstream Narrative hive feed.',
      },
      {
        label: 'C',
        text: 'Only through one secret book banned from all radio and television forever.',
        isCorrect: false,
        rationale:
          'The list is broad: TV, radio, books, magazines, internet, and daily social interactions.',
      },
      {
        label: 'D',
        text: 'They invent the Mainstream Narrative independently with full critical free thought each morning.',
        isCorrect: false,
        rationale:
          'They receive programming; they do not critically invent narrative outside assigned avenues.',
      },
    ],
    hint: 'TV, radio, books, magazines, internet, social interactions.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question: 'How do NPCs function like static computer-game characters?',
    options: [
      {
        label: 'A',
        text: 'They freely rewrite every assigned role nightly and teleport across all environments at will.',
        isCorrect: false,
        rationale:
          'They cannot deviate from assigned roles or environments — strictly defined thought avenues and boundaries.',
      },
      {
        label: 'B',
        text: 'They only exist as menu icons with no body, no slogan speech, and no social placement.',
        isCorrect: false,
        rationale:
          'They are physical entities filling every conceivable scenario while stuck in role/environment bounds.',
      },
      {
        label: 'C',
        text: 'They operate within strictly defined thought avenues and boundaries — functioning exactly like static characters in a computer game who cannot deviate from their assigned roles or environments.',
        isCorrect: true,
        rationale:
          'Game-static: fixed roles/environments and thought avenues with no true deviation.',
      },
      {
        label: 'D',
        text: 'They are the game developers rewriting the simulation code with full free creative authority.',
        isCorrect: false,
        rationale:
          'They are the static background cast, not authors of the simulation architecture.',
      },
    ],
    hint: 'Static game characters — cannot leave assigned roles or environments.',
    correctAnswer: 'C',
  },
  {
    number: 16,
    question: 'What do NPCs lack internally, and what do they rely on instead of critical thought?',
    options: [
      {
        label: 'A',
        text: 'They have rich monologues and courage in conviction, never using slogans or herd scripts.',
        isCorrect: false,
        rationale:
          'They have no internal monologue, no self-awareness, and no courage in their convictions.',
      },
      {
        label: 'B',
        text: 'They lack only sports knowledge while holding full philosophical depth in every sentence.',
        isCorrect: false,
        rationale:
          'They lack monologue and self-awareness; they rely on herd-accepted slogans instead of critical thought.',
      },
      {
        label: 'C',
        text: 'They refuse all slogans and only speak original non-cognitive silence forever.',
        isCorrect: false,
        rationale:
          'They rely on herd-accepted slogans and non-cognitive chains of predetermined coherence.',
      },
      {
        label: 'D',
        text: 'No internal monologue, no self-awareness, and no courage in their convictions — they rely on herd-accepted slogans and non-cognitive chains of predetermined coherence instead of thinking critically.',
        isCorrect: true,
        rationale:
          'Empty interior + slogan/herd coherence chains replace critical independent thought.',
      },
    ],
    hint: 'No monologue or self-awareness — herd slogans and predetermined coherence.',
    correctAnswer: 'D',
  },
  {
    number: 17,
    question: 'What psychological anchor keeps NPCs permanently trapped within the Mind Camp?',
    options: [
      {
        label: 'A',
        text: 'A profound fear of ostracization and peer ridicule — psychology anchored so they never leave the Mind Camp.',
        isCorrect: true,
        rationale:
          'Fear of ostracization and peer ridicule locks NPCs inside Mind Camp permanently.',
      },
      {
        label: 'B',
        text: 'Fearless love of ridicule that makes them celebrate every non-conformist as a hero.',
        isCorrect: false,
        rationale:
          'They fear ostracization and ridicule; that fear is the trap, not celebration of dissent.',
      },
      {
        label: 'C',
        text: 'Only financial greed with no social peer-pressure or ridicule dimension involved.',
        isCorrect: false,
        rationale:
          'Named anchor is ostracization and peer ridicule, not finance alone.',
      },
      {
        label: 'D',
        text: 'Complete indifference to peers so Mind Camp boundaries never influence behavior.',
        isCorrect: false,
        rationale:
          'Peer ridicule fear is precisely what keeps them inside Mind Camp.',
      },
    ],
    hint: 'Fear of ostracization and peer ridicule — Mind Camp lock.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question: 'What range of NPC types fills society, including truth-community mimics?',
    options: [
      {
        label: 'A',
        text: 'Only one universal NPC template with no sport, fishing, or alternative-community variants.',
        isCorrect: false,
        rationale:
          'There is an NPC for every conceivable scenario and interest, including "awake" mimics.',
      },
      {
        label: 'B',
        text: 'Society is filled with sport NPCs, motor racing NPCs, fishing NPCs, and even "awake" NPCs who mimic alternative truth communities — an NPC designed for every conceivable scenario and interest.',
        isCorrect: true,
        rationale:
          'Full spectrum of interest NPCs, including fake-awake mimics of truth communities.',
      },
      {
        label: 'C',
        text: 'Only "awake" NPCs exist, and they never appear in sports or fishing contexts.',
        isCorrect: false,
        rationale:
          'Sport, motor racing, fishing, and awake-mimic types are all listed as present.',
      },
      {
        label: 'D',
        text: 'No interest-specialized NPCs exist; every synthetic refuses all hobbies and slogans.',
        isCorrect: false,
        rationale:
          'Interest specialization is explicit — every conceivable scenario has a designed NPC.',
      },
    ],
    hint: 'Sport, racing, fishing, and even "awake" mimic NPCs.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question: 'Why is identifying Child NPCs particularly difficult?',
    options: [
      {
        label: 'A',
        text: 'Because no children are ever NPCs under any reset or manufacturing model.',
        isCorrect: false,
        rationale:
          'Child NPCs exist; detection is hard because adult markers have not formed yet.',
      },
      {
        label: 'B',
        text: 'Because children already hold full adult religious pride and financial programming from birth.',
        isCorrect: false,
        rationale:
          'Children have not yet adopted rigid opinions, financial programming, or religious pride that expose adults.',
      },
      {
        label: 'C',
        text: 'Because children have not yet adopted the rigid opinions, financial programming, or religious pride that expose adult NPCs.',
        isCorrect: true,
        rationale:
          'Adult String/pride rigidity is not yet installed — child NPCs are harder to spot.',
      },
      {
        label: 'D',
        text: 'Because every child already blurts herd slogans with full Mind Camp armor from day one.',
        isCorrect: false,
        rationale:
          'Rigid adult markers are what expose NPCs; children lack those fully formed markers.',
      },
    ],
    hint: 'Child NPCs — adult finance/religion/pride rigidity not formed yet.',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question: 'How were NPCs mass-integrated after historical resets annihilated true population?',
    options: [
      {
        label: 'A',
        text: 'Earth was left empty with no clone children, no D.U.M.B.S., and no Orphan Trains used.',
        isCorrect: false,
        rationale:
          'Stem cells grew millions of clone children in D.U.M.B.S., distributed on Orphan Trains.',
      },
      {
        label: 'B',
        text: 'Only true souls were imported while all synthetic manufacture was permanently banned forever.',
        isCorrect: false,
        rationale:
          'Mass integration used lab-grown clones distributed worldwide to rebuild obedient empty generations.',
      },
      {
        label: 'C',
        text: 'Orphan Trains only moved free-energy engineers who openly taught cosmic family truth.',
        isCorrect: false,
        rationale:
          'Orphan Trains distributed clone NPC children to rebuild society as obedient and empty.',
      },
      {
        label: 'D',
        text: 'Stem cells grew millions of clone children in D.U.M.B.S., then Orphan Trains distributed them worldwide to rebuild society — ensuring new generations were fundamentally obedient and empty.',
        isCorrect: true,
        rationale:
          'Post-reset: D.U.M.B.S. clone crops + Orphan Trains = obedient empty NPC generations.',
      },
    ],
    hint: 'Stem cells in D.U.M.B.S. → Orphan Trains → obedient empty rebuild.',
    correctAnswer: 'D',
  },
  {
    number: 21,
    question: 'How does modern China exemplify the NPC phenomenon?',
    options: [
      {
        label: 'A',
        text: 'Largely created after the most recent reset as a highly efficient NPC workforce for modern industry — programmed for absolute obedience, conformity, and educational success, rapidly expanding to 1.4 billion despite a long-standing one-child policy, revealing artificial lab-grown origins.',
        isCorrect: true,
        rationale:
          'Post-reset NPC industrial workforce; 1.4B despite one-child policy exposes lab-grown artificiality.',
      },
      {
        label: 'B',
        text: 'Entirely free true-soul elders who banned manufacturing and all conformity programming forever.',
        isCorrect: false,
        rationale:
          'Example is obedience/conformity/educational-success programming for industry workforce.',
      },
      {
        label: 'C',
        text: 'A Pleiadian colony that never experienced any reset and never used synthetic population insertion.',
        isCorrect: false,
        rationale:
          'Described as largely created after the most recent reset as NPC workforce.',
      },
      {
        label: 'D',
        text: 'Proof that one-child policy alone always shrinks population with no lab-origin implications.',
        isCorrect: false,
        rationale:
          'Expansion to 1.4 billion despite one-child policy reveals artificial lab-grown origins.',
      },
    ],
    hint: 'Post-reset NPC workforce — 1.4B despite one-child policy.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question: 'How do NPCs enforce the Three Strings through sheer numbers?',
    options: [
      {
        label: 'A',
        text: 'By dissolving all schooling and medical norms so true souls never face social pressure.',
        isCorrect: false,
        rationale:
          'Vast numbers establish behavioral nudges forcing conformity on schooling, medical interventions, and norms.',
      },
      {
        label: 'B',
        text: 'By simply existing in vast numbers they establish a social credit system of behavioral nudges, forcing true souls into conformity regarding schooling, medical interventions, and societal norms — primary vector for Three Strings enforcement.',
        isCorrect: true,
        rationale:
          'Majority presence = social-credit-style nudges enforcing Strings via school, medical, and norm pressure.',
      },
      {
        label: 'C',
        text: 'Only through underground D.U.M.B.S. memos that never touch surface social life.',
        isCorrect: false,
        rationale:
          'Enforcement is surface social: friends, family, colleagues, and everyday norm pressure.',
      },
      {
        label: 'D',
        text: 'By teaching free Religion, Finance, and Perceived Knowledge exit classes in every school.',
        isCorrect: false,
        rationale:
          'They enforce those Strings; they do not teach exit from them.',
      },
    ],
    hint: 'Vast numbers = social-credit nudges on school, medical, norms.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question: 'Why is the 97% majority a deliberate mathematical strategy?',
    options: [
      {
        label: 'A',
        text: 'To guarantee every true soul is celebrated as a hero for questioning reality in public.',
        isCorrect: false,
        rationale:
          'It guarantees true souls who question reality are marginalized, ridiculed, and pressured into compliance.',
      },
      {
        label: 'B',
        text: 'Only to fill sports stadiums with no effect on dissent, family pressure, or compliance.',
        isCorrect: false,
        rationale:
          'Strategy crushes dissent via friends, family, and colleagues enforcing compliance.',
      },
      {
        label: 'C',
        text: 'A 97% majority guarantees that any true soul attempting to question the nature of reality will be immediately marginalized, ridiculed, and pressured into compliance by their own friends, family, and colleagues.',
        isCorrect: true,
        rationale:
          'Math of 97% crushes dissent: ridicule and compliance pressure from the intimate circle.',
      },
      {
        label: 'D',
        text: 'To ensure NPCs always lose every social argument so true souls never need isolation.',
        isCorrect: false,
        rationale:
          'Majority pressure is designed to win against the questioning true soul, not lose.',
      },
    ],
    hint: '97% math — marginalize and ridicule anyone who questions reality.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question: 'How must true spiritual entities reframe interactions with most human-looking vessels?',
    options: [
      {
        label: 'A',
        text: 'As engagements with eternal cosmic elders who always deserve full emotional fusion and dependency.',
        isCorrect: false,
        rationale:
          'Most are empty pre-programmed biological software; recognizing that severs holding attachments.',
      },
      {
        label: 'B',
        text: 'As proof that every vessel is a true soul and emotional attachment should never be released.',
        isCorrect: false,
        rationale:
          'Recognition that most are empty software severs emotional attachments holding true souls back.',
      },
      {
        label: 'C',
        text: 'As optional game NPCs only on screens, never as living family, friends, or colleagues in the field.',
        isCorrect: false,
        rationale:
          'They appear as close family and colleagues; the reframe is that those vessels are still empty software.',
      },
      {
        label: 'D',
        text: 'As engagements with empty, pre-programmed biological software — recognizing this severs the emotional attachments that hold true souls back.',
        isCorrect: true,
        rationale:
          'Human-looking vessels often = empty pre-programmed software; that recognition cuts false attachments.',
      },
    ],
    hint: 'Empty pre-programmed biological software — sever false emotional attachments.',
    correctAnswer: 'D',
  },
  {
    number: 25,
    question: 'Why will there be no reason to mourn NPC disappearance at the EMF flash — even close family roles?',
    options: [
      {
        label: 'A',
        text: 'Because they were never truly alive — their sudden deletion simply marks the end of a simulated program, even when they acted as close family members.',
        isCorrect: true,
        rationale:
          'Never truly alive; deletion ends simulated program — no true mourning basis for synthetic roles.',
      },
      {
        label: 'B',
        text: 'Because true souls will be forced to mourn forever as a mandatory post-Flash ritual of guilt.',
        isCorrect: false,
        rationale:
          'There will be no reason to mourn; recognition removes the basis for grief.',
      },
      {
        label: 'C',
        text: 'Because NPCs reincarnate the next day as the same family members with full continuity.',
        isCorrect: false,
        rationale:
          'They have no future beyond this epoch; deletion is the end of the program, not reincarnation.',
      },
      {
        label: 'D',
        text: 'Because the Flash does not delete anyone and every NPC remains embodied permanently.',
        isCorrect: false,
        rationale:
          'The Flash evaporates the fake population; mourning is unnecessary because they were never truly alive.',
      },
    ],
    hint: 'Never truly alive — deletion ends a simulated program.',
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
  'Test your grasp of Non-Player Characters — 97% artificial mass, Replica Souls, Mind Camp, D.U.M.B.S., and deletion at the Flash.';
const DESC_META =
  'Interactive Living Truth Quiz on Non-Player Characters: 520 million true souls, static game roles, awake-mimic NPCs, China 1.4B, social-credit nudges, and no mourning for empty software.';

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
      'Ninety-seven percent are not eternal spirits. They are inserts, clones, synthetics with Replica Souls from 4th density labs. No monologue. No past lives. No future past this epoch. Mind Camp locks them with fear of ridicule. Media feeds the Mainstream Narrative. Static roles like game background cast. Even "awake" mimics. After resets, D.U.M.B.S. and Orphan Trains restocked obedience. China\'s 1.4 billion against a one-child policy is a tell. The 97% majority is math to crush your dissent through friends and family. At the Flash they become pixelation dust. Three of a hundred remain. They were never truly alive. The program ends. Do not mourn the software.',
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
console.log('PASS: audited 25/25 against data/alice-topics/non-player-characters.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
