/**
 * Installs NPC Population quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/npc-population.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-npc-population-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'npc-population';
const TOPIC_TITLE = 'NPC Population';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/npc-population.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['97%', 'npc', 'clones'],
  2: ['parasitic', 'ascension', 'control'],
  3: ['eternal consciousness', 'programming', 'conditioning'],
  4: ['consensus reality', 'low-frequency', 'tethered'],
  5: ['permanently removed', 'simulation', 'true'],
  6: ['true soul', 'internal monologue', 'past lives'],
  7: ['30-second', 'pixelate', 'erase'],
  8: ['4th density', 'replica souls', 'laboratories'],
  9: ['religion', 'finance', 'perceived knowledge'],
  10: ['tartaria', 'resets', 'narrative'],
  11: ['recycled', '5th density', 'impossible'],
  12: ['aether', '520 million', 'true souls'],
  13: ['mainstream narrative', 'derail', 'spiritual'],
  14: ['firmware', 'conformity', 'ostracization'],
  15: ['self-awareness', 'sports', 'mainstream news'],
  16: ['television', 'radio', 'educational'],
  17: ['mimic', 'slogans', 'television'],
  18: ['grand theft auto', 'background', 'roles'],
  19: ['taxis', 'teachers', 'family members'],
  20: ['re-sets', 'orphan trains', 'clones'],
  21: ['china', 'manufacturing', 'conformity'],
  22: ['children', 'detect', 'finance'],
  23: ['100', '97', '3 survivors'],
  24: ['grief', 'cosmic memory', 'synthetic'],
  25: ['isolation', 'validation', 'terror'],
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
    question: 'What does the Great Spiritual Awakening reveal about Earth\'s population composition?',
    options: [
      {
        label: 'A',
        text: 'That 97% consists of NPCs (Non-Player Characters), clones, inserts, and synthetics — not true-soul majority demographics.',
        isCorrect: true,
        rationale:
          '97% of the population is NPCs, clones, inserts, and synthetics revealed in the awakening.',
      },
      {
        label: 'B',
        text: 'That 97% are ancient Taran elders with full cosmic memory already online in every household.',
        isCorrect: false,
        rationale:
          'The 97% are synthetic constructs without eternal consciousness, not memory-intact elders.',
      },
      {
        label: 'C',
        text: 'That every human is an identical true soul with no synthetic buffer population at all.',
        isCorrect: false,
        rationale:
          'Only a small fraction are true human and extraterrestrial souls; 97% are NPC-class entities.',
      },
      {
        label: 'D',
        text: 'That population math is irrelevant and no percentage of synthetic beings exists in the plain.',
        isCorrect: false,
        rationale:
          'The named composition is explicit: 97% NPCs, clones, inserts, and synthetics.',
      },
    ],
    hint: '97% — NPCs, clones, inserts, synthetics.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'Why were these entities created by negative parasitic forces?',
    options: [
      {
        label: 'A',
        text: 'To teach free ascension and dissolve all consensus reality as a public service.',
        isCorrect: false,
        rationale:
          'They maintain societal control and suppress spiritual ascension of true souls.',
      },
      {
        label: 'B',
        text: 'To maintain societal control and suppress the spiritual ascension of true souls trapped within the physical plain.',
        isCorrect: true,
        rationale:
          'Parasites built the NPC majority as control and anti-ascension enforcement.',
      },
      {
        label: 'C',
        text: 'Only to staff Tartarian temples as free-energy engineers with no control mandate.',
        isCorrect: false,
        rationale:
          'NPC narrative hides Tartaria; their role is matrix enforcement, not free-energy temple staff.',
      },
      {
        label: 'D',
        text: 'To replace the Flash so no planetary removal event is ever required again.',
        isCorrect: false,
        rationale:
          'The entire NPC population is scheduled for permanent removal during the Flash.',
      },
    ],
    hint: 'Societal control — suppress true-soul ascension.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question: 'How do NPCs exist relative to consciousness and programming?',
    options: [
      {
        label: 'A',
        text: 'With full eternal consciousness roaming freely outside every mainstream boundary.',
        isCorrect: false,
        rationale:
          'They operate without eternal consciousness, entirely within mainstream programming and conditioning.',
      },
      {
        label: 'B',
        text: 'Only as pure light beings who never interact with television, radio, or schools.',
        isCorrect: false,
        rationale:
          'Their reality is built and maintained by TV, radio, literature, and educational institutions.',
      },
      {
        label: 'C',
        text: 'Without an eternal consciousness — existing entirely within the boundaries of mainstream programming and societal conditioning.',
        isCorrect: true,
        rationale:
          'No eternal consciousness; full enclosure inside mainstream program and social conditioning.',
      },
      {
        label: 'D',
        text: 'As reincarnated Micro Suns who temporarily forgot Source for a single school year.',
        isCorrect: false,
        rationale:
          'NPCs are not reincarnated; they are recycled constructs with no past lives.',
      },
    ],
    hint: 'No eternal consciousness — only mainstream program and conditioning.',
    correctAnswer: 'C',
  },
  {
    number: 4,
    question: 'What role do NPCs play regarding consensus reality?',
    options: [
      {
        label: 'A',
        text: 'They dismantle consensus reality daily so every true soul ascends without resistance.',
        isCorrect: false,
        rationale:
          'They enforce consensus reality designed to keep humanity tethered to low-frequency existence.',
      },
      {
        label: 'B',
        text: 'They only manage weather apps with no enforcement function over narrative or frequency.',
        isCorrect: false,
        rationale:
          'They are the enforcement mechanism for consensus reality and low-frequency tethering.',
      },
      {
        label: 'C',
        text: 'They voluntarily leave the simulation so true souls never face herd pressure again.',
        isCorrect: false,
        rationale:
          'They remain as enforcement until the Flash permanently removes them.',
      },
      {
        label: 'D',
        text: 'They serve as the enforcement mechanism for a consensus reality designed to keep humanity tethered to a low-frequency existence.',
        isCorrect: true,
        rationale:
          'NPCs enforce consensus reality that tethers people to low-frequency matrix life.',
      },
    ],
    hint: 'Enforcement mechanism — consensus reality, low-frequency tether.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question: 'What is the ultimate future of the entire NPC population?',
    options: [
      {
        label: 'A',
        text: 'They have no future — scheduled to be permanently removed from the simulation during an impending planetary event, leaving only a small fraction of true human and extraterrestrial souls.',
        isCorrect: true,
        rationale:
          'NPCs are permanently removed at the planetary event; only a small true-soul fraction remains.',
      },
      {
        label: 'B',
        text: 'They ascend as the primary 97% remnant while true souls are deleted as obsolete.',
        isCorrect: false,
        rationale:
          'Opposite: NPCs are erased; true human and ET souls remain as the small fraction.',
      },
      {
        label: 'C',
        text: 'They reincarnate endlessly with full past-life libraries into 5th density as a bloc.',
        isCorrect: false,
        rationale:
          'They cannot ascend to 5th density; they are recycled constructs without past lives.',
      },
      {
        label: 'D',
        text: 'They become permanent Tartarian temple caretakers with no removal event planned.',
        isCorrect: false,
        rationale:
          'Removal is scheduled; Tartaria is hidden by the NPC-driven narrative, not staffed by them as caretakers of truth.',
      },
    ],
    hint: 'No future — permanent removal; small true-soul fraction remains.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'What is an NPC (Non-Player Character) by definition?',
    options: [
      {
        label: 'A',
        text: 'A true soul with rich internal monologue, eternal continuity, and full past-life memory online.',
        isCorrect: false,
        rationale:
          'NPCs lack a true soul, internal monologue, and past lives.',
      },
      {
        label: 'B',
        text: 'A synthetic being, clone, or insert comprising 97% of the global population — lacking a true soul, internal monologue, or past lives.',
        isCorrect: true,
        rationale:
          'NPC = synthetic/clone/insert majority without soul, monologue, or past lives.',
      },
      {
        label: 'C',
        text: 'Only a video-game joke with no real population percentage or spiritual implication.',
        isCorrect: false,
        rationale:
          'They are 97% of the living population with concrete removal and control functions.',
      },
      {
        label: 'D',
        text: 'A 5th density elder volunteering as a taxi driver to teach free-energy physics.',
        isCorrect: false,
        rationale:
          'It is biologically and spiritually impossible for an NPC to ascend to 5th density.',
      },
    ],
    hint: 'Synthetic majority — no true soul, monologue, or past lives.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question: 'What is The Flash / EMF relative to the NPC population?',
    options: [
      {
        label: 'A',
        text: 'A multi-year dimming that gently reprograms NPCs into true souls without erasure.',
        isCorrect: false,
        rationale:
          'It is a 30-second planetary light event that instantly pixelates and erases the entire NPC population.',
      },
      {
        label: 'B',
        text: 'Only a banking outage that freezes Finance String accounts with no pixelation effect.',
        isCorrect: false,
        rationale:
          'Flash pixelates and erases NPCs from existence — not a bank outage.',
      },
      {
        label: 'C',
        text: 'A 30-second planetary light event that will instantly pixelate and erase the entire NPC population from existence.',
        isCorrect: true,
        rationale:
          'EMF Flash = 30 seconds of light; NPCs pixelate and vanish entirely.',
      },
      {
        label: 'D',
        text: 'A private meditation only true souls notice while NPCs remain fully embodied forever.',
        isCorrect: false,
        rationale:
          'The entire NPC populace disappears into the aether at the culminating Flash.',
      },
    ],
    hint: '30-second light — pixelate and erase all NPCs.',
    correctAnswer: 'C',
  },
  {
    number: 8,
    question: 'Where were replica souls used to power NPCs manufactured?',
    options: [
      {
        label: 'A',
        text: 'In free public schools on the ice wall with full Source Creation oversight and no parasites.',
        isCorrect: false,
        rationale:
          'Manufactured in 4th density laboratories by parasitic entities as cheap knock-off replica souls.',
      },
      {
        label: 'B',
        text: 'Only in Tartarian crystalline temples as legitimate eternal-soul births for every taxi driver.',
        isCorrect: false,
        rationale:
          '4th density labs produce replica souls; Tartaria\'s true history is hidden by NPC narrative.',
      },
      {
        label: 'C',
        text: 'Inside every true soul\'s pineal gland during sleep with no external lab process required.',
        isCorrect: false,
        rationale:
          'Replica souls are lab-made in 4th density by lower-vibrational parasitic beings.',
      },
      {
        label: 'D',
        text: 'In 4th density laboratories — parasitic entities manufactured replica souls (cheap knock-offs) used to power NPCs.',
        isCorrect: true,
        rationale:
          '4th density labs = origin of NPC replica-soul power source under parasitic manufacture.',
      },
    ],
    hint: '4th density labs — replica souls / cheap knock-offs.',
    correctAnswer: 'D',
  },
  {
    number: 9,
    question: 'What are The 3 Strings holding minds in the matrix?',
    options: [
      {
        label: 'A',
        text: 'Religion, Finance, and Perceived Knowledge — the primary psychological control mechanisms.',
        isCorrect: true,
        rationale:
          'The 3 Strings are Religion, Finance, and Perceived Knowledge.',
      },
      {
        label: 'B',
        text: 'Sports, weather, and cooking shows as the only allowed conversation topics forever.',
        isCorrect: false,
        rationale:
          'Those are NPC conversation boundaries; the Strings are Religion, Finance, Perceived Knowledge.',
      },
      {
        label: 'C',
        text: 'Only television, radio, and taxis with no religious or financial tether function.',
        isCorrect: false,
        rationale:
          'TV/radio are programming outlets; the named Strings are Religion, Finance, Perceived Knowledge.',
      },
      {
        label: 'D',
        text: 'Orphan Trains, China factories, and Grand Theft Auto maps as literal physical cables.',
        isCorrect: false,
        rationale:
          'Those are related deployment examples; the Strings are the three psychological control mechanisms.',
      },
    ],
    hint: 'Religion · Finance · Perceived Knowledge.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'How does Tartaria relate to the NPC-driven societal narrative?',
    options: [
      {
        label: 'A',
        text: 'Tartaria is openly taught by every NPC teacher as mandatory free-energy core curriculum.',
        isCorrect: false,
        rationale:
          'Tartaria\'s true history is hidden by the current NPC-driven societal narrative.',
      },
      {
        label: 'B',
        text: 'Tartaria was a highly advanced ancient civilization of excellence destroyed in past resets — its true history hidden by the current NPC-driven societal narrative.',
        isCorrect: true,
        rationale:
          'Advanced Tartaria was reset-destroyed; NPC narrative keeps that truth buried.',
      },
      {
        label: 'C',
        text: 'Tartaria never existed and was invented only by true souls as a recreational myth.',
        isCorrect: false,
        rationale:
          'It was real advanced excellence destroyed in resets; narrative hides it.',
      },
      {
        label: 'D',
        text: 'Tartaria is exclusively a 4th density lab brand for printing replica souls today.',
        isCorrect: false,
        rationale:
          'Tartaria is the prior advanced civilization; NPC manufacture is separate 4th density lab work.',
      },
    ],
    hint: 'Advanced Tartaria reset-destroyed — hidden by NPC narrative.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question: 'Why can NPCs neither reincarnate as true beings nor ascend to 5th density?',
    options: [
      {
        label: 'A',
        text: 'Because they refuse free will classes while still holding eternal souls and full past lives.',
        isCorrect: false,
        rationale:
          'They are recycled constructs with no past lives; 4th-density origin makes 5th-density ascent impossible.',
      },
      {
        label: 'B',
        text: 'Because Micro Suns banned all ascent until every taxi driver finishes a finance degree.',
        isCorrect: false,
        rationale:
          'Impossibility is biological and spiritual from 4th-density manufacture, not a degree requirement.',
      },
      {
        label: 'C',
        text: 'They are simply recycled constructs with no past lives and no capacity to evolve or ascend — created in 4th density by lower-vibrational beings, making ascent to 5th density biologically and spiritually impossible.',
        isCorrect: true,
        rationale:
          'Recycled, not reincarnated; 4th-density manufacture blocks any 5th-density path.',
      },
      {
        label: 'D',
        text: 'Because the Flash upgrades all NPCs into 5th density elders automatically as a bloc.',
        isCorrect: false,
        rationale:
          'The Flash erases NPCs into the aether; it does not upgrade them to 5th density.',
      },
    ],
    hint: 'Recycled constructs — 4th-density origin blocks 5th-density ascent.',
    correctAnswer: 'C',
  },
  {
    number: 12,
    question: 'What happens to the NPC populace at the EMF flash, and what population remains?',
    options: [
      {
        label: 'A',
        text: 'NPCs double in number while true souls are limited to under one million worldwide.',
        isCorrect: false,
        rationale:
          'NPCs disappear into the aether; population reduces to a maximum of 520 million true souls.',
      },
      {
        label: 'B',
        text: 'Only half of NPCs leave while the rest inherit Tartaria as permanent caretakers.',
        isCorrect: false,
        rationale:
          'The entire NPC populace vanishes; up to 520 million true souls remain.',
      },
      {
        label: 'C',
        text: 'NPCs stay embodied to enforce narrative while only overlays are stripped with no disappearances.',
        isCorrect: false,
        rationale:
          'Flash coincides with overlay/dome stripping and 97-of-100 vanishings of NPCs.',
      },
      {
        label: 'D',
        text: 'The entire NPC populace instantly disappears into the aether — reducing planetary population to a maximum of 520 million true souls.',
        isCorrect: true,
        rationale:
          'Full NPC aether-erase; max ~520 million true souls remain.',
      },
    ],
    hint: 'NPCs into the aether — max ~520 million true souls left.',
    correctAnswer: 'D',
  },
  {
    number: 13,
    question: 'Why is the presence of NPCs essential matrix machinery?',
    options: [
      {
        label: 'A',
        text: 'They seamlessly enforce the mainstream narrative and unknowingly derail the spiritual prospects of those around them.',
        isCorrect: true,
        rationale:
          'NPC essential function: enforce mainstream narrative and derail nearby spiritual progress.',
      },
      {
        label: 'B',
        text: 'They openly teach free Twin Flame reunion maps and dissolve every control String daily.',
        isCorrect: false,
        rationale:
          'They enforce mainstream narrative and punish non-conformity; they do not liberate.',
      },
      {
        label: 'C',
        text: 'They only decorate empty cities after resets with no effect on living true souls.',
        isCorrect: false,
        rationale:
          'They fill roles everywhere — including as family — to keep the simulation cohesive and restrictive.',
      },
      {
        label: 'D',
        text: 'They store cosmic memory for true souls and release it gently before any Flash.',
        isCorrect: false,
        rationale:
          'True souls retrieve cosmic memory at the Flash; NPCs derail awakening until then.',
      },
    ],
    hint: 'Enforce mainstream narrative — derail spiritual prospects nearby.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question: 'What governs NPC behavioral firmware and conformity?',
    options: [
      {
        label: 'A',
        text: 'Fearless free thought and celebration of every non-conformist as a social hero.',
        isCorrect: false,
        rationale:
          'They fear stepping outside conformity — herd-betrayal, ostracization, ego, and pride govern them.',
      },
      {
        label: 'B',
        text: 'Social firmware mandating strict obedience to the accepted societal narrative — deeply afraid of stepping outside conformity, governed by intrusive thoughts of herd-betrayal, ostracization, ego, and pride.',
        isCorrect: true,
        rationale:
          'Firmware = obedience to narrative; fear of herd-betrayal, ostracization, ego, pride.',
      },
      {
        label: 'C',
        text: 'Only crystalline lattice harmonics with no social fear or pride mechanisms involved.',
        isCorrect: false,
        rationale:
          'NPC firmware is social conformity programming, not lattice harmonic free will.',
      },
      {
        label: 'D',
        text: 'Complete indifference to peer pressure so ostracization never influences their choices.',
        isCorrect: false,
        rationale:
          'Ostracization and herd-betrayal fears are named drivers of their conformity.',
      },
    ],
    hint: 'Social firmware — fear of herd-betrayal, ostracization, ego, pride.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question: 'What defines NPC psychological profiling and conversation boundaries?',
    options: [
      {
        label: 'A',
        text: 'Deep continuous internal monologues and rigorous critique of every mainstream assumption.',
        isCorrect: false,
        rationale:
          'Vast majority lack self-awareness, deep thought, and internal monologues.',
      },
      {
        label: 'B',
        text: 'Only cosmic geometry lectures and open Tartaria free-energy workshops in every taxi.',
        isCorrect: false,
        rationale:
          'Boundaries stick to mainstream news, sports, and designated hobbies.',
      },
      {
        label: 'C',
        text: 'Lack of self-awareness, deep thought, and internal monologues — conversational boundaries rigidly confined to consensus topics such as mainstream news, sports, and designated hobbies, avoiding deep-level critical analysis.',
        isCorrect: true,
        rationale:
          'No monologue/deep thought; talk stays on news, sports, hobbies — no deep critical analysis.',
      },
      {
        label: 'D',
        text: 'Permanent silence with zero speech about sports, news, or any hobby topics ever.',
        isCorrect: false,
        rationale:
          'They do speak — but only within rigid consensus topic boundaries.',
      },
    ],
    hint: 'No monologue — news, sports, hobbies only; no deep critique.',
    correctAnswer: 'C',
  },
  {
    number: 16,
    question: 'What external outlets construct and maintain an NPC\'s reality boundaries?',
    options: [
      {
        label: 'A',
        text: 'Only direct downloads from Source Creation with no media or school involvement.',
        isCorrect: false,
        rationale:
          'Boundaries are built by television, radio, literature, and educational institutions.',
      },
      {
        label: 'B',
        text: 'Solely private meditation retreats that ban all mainstream slogans and mimicry.',
        isCorrect: false,
        rationale:
          'They mimic TV characters and blurt mainstream slogans as if they were knowledge.',
      },
      {
        label: 'C',
        text: 'Only Orphan Train schedules with no television, radio, or educational programming role.',
        isCorrect: false,
        rationale:
          'TV, radio, literature, and education are the named programming mechanisms.',
      },
      {
        label: 'D',
        text: 'Television, radio, literature, and educational institutions — the external programming mechanisms that construct and maintain NPC reality boundaries.',
        isCorrect: true,
        rationale:
          'TV, radio, literature, schools = the programming stack that builds NPC reality walls.',
      },
    ],
    hint: 'TV, radio, literature, educational institutions.',
    correctAnswer: 'D',
  },
  {
    number: 17,
    question: 'How do NPCs perform knowledge they do not actually possess?',
    options: [
      {
        label: 'A',
        text: 'They mimic characters from television shows and blurt out mainstream slogans as if they possess actual knowledge.',
        isCorrect: true,
        rationale:
          'Mimicry of TV characters and slogan blurts substitute for real knowledge.',
      },
      {
        label: 'B',
        text: 'They channel 178,000 years of cosmic memory with perfect precision in every sentence.',
        isCorrect: false,
        rationale:
          'True souls retrieve cosmic memory at the Flash; NPCs mimic media, not cosmic archives.',
      },
      {
        label: 'C',
        text: 'They refuse all slogans and only speak original lattice mathematics never heard on TV.',
        isCorrect: false,
        rationale:
          'Slogan blurts and TV mimicry are named NPC speech patterns.',
      },
      {
        label: 'D',
        text: 'They never speak and only enforce conformity through complete silence forever.',
        isCorrect: false,
        rationale:
          'They speak consensus content and slogans; silence is not their enforcement mode.',
      },
    ],
    hint: 'Mimic TV characters — blurt mainstream slogans as knowledge.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question: 'How is static reality placement of NPCs described?',
    options: [
      {
        label: 'A',
        text: 'Like free-roaming Micro Suns with no fixed role and no environmental tether at all.',
        isCorrect: false,
        rationale:
          'Like background characters in games such as Grand Theft Auto — tethered to environments and roles.',
      },
      {
        label: 'B',
        text: 'Much like background characters in computer games (such as Grand Theft Auto) — tethered to specific environments and societal roles so the simulation stays cohesive and restrictive.',
        isCorrect: true,
        rationale:
          'GTA-style background placement: fixed environments/roles keep the sim cohesive and restrictive.',
      },
      {
        label: 'C',
        text: 'Only as temporary weather effects that never fill jobs like teaching or driving.',
        isCorrect: false,
        rationale:
          'They are placed everywhere serving food, driving taxis, teaching, and living as family.',
      },
      {
        label: 'D',
        text: 'As permanent 5th density guides who choose new cities freely each morning without scripts.',
        isCorrect: false,
        rationale:
          'They cannot reach 5th density; they are scripted static-role constructs in 3rd density sim.',
      },
    ],
    hint: 'GTA-style background characters — tethered roles and environments.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question: 'Where are NPCs placed to keep the simulation cohesive and restrictive?',
    options: [
      {
        label: 'A',
        text: 'Only beyond the ice wall with zero presence as teachers, drivers, or family members.',
        isCorrect: false,
        rationale:
          'They are placed everywhere — serving food, driving taxis, acting as teachers, living as close family.',
      },
      {
        label: 'B',
        text: 'Only inside sealed museum basements as static mannequins with no living social roles.',
        isCorrect: false,
        rationale:
          'Living placement across everyday social and labor roles is the point of static reality design.',
      },
      {
        label: 'C',
        text: 'Everywhere — serving food, driving taxis, acting as teachers, and living as close family members — ensuring the simulation remains cohesive and restrictive.',
        isCorrect: true,
        rationale:
          'Food service, taxis, teachers, family — ubiquitous placement for cohesive restriction.',
      },
      {
        label: 'D',
        text: 'Only as remote radio announcers who never share households with true souls.',
        isCorrect: false,
        rationale:
          'They also live as close family members, not only as remote media voices.',
      },
    ],
    hint: 'Everywhere — food, taxis, teachers, close family.',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question: 'How has NPC deployment worked after historical re-sets?',
    options: [
      {
        label: 'A',
        text: 'Earth was left empty with no clones or orphans introduced after any destruction event.',
        isCorrect: false,
        rationale:
          'After violent destruction, Earth was repopulated with newly grown clones and NPC orphans via Orphan Trains.',
      },
      {
        label: 'B',
        text: 'Only true souls were imported while all synthetic manufacture was permanently banned.',
        isCorrect: false,
        rationale:
          'Parasites consistently repopulated with clones and NPC orphans after resets.',
      },
      {
        label: 'C',
        text: 'Orphan Trains only moved free-energy engineers who openly taught Tartaria to every city.',
        isCorrect: false,
        rationale:
          'Orphan Trains distributed NPC orphans; Tartaria truth stayed hidden under NPC narrative.',
      },
      {
        label: 'D',
        text: 'A consistent post-reset tactic — when previous civilizations were violently destroyed, Earth was repopulated with newly grown clones and NPC orphans distributed via the Orphan Trains.',
        isCorrect: true,
        rationale:
          'Re-sets → clone/NPC orphan repopulation via Orphan Trains as standard parasite tactic.',
      },
    ],
    hint: 'After re-sets — clones and NPC orphans via Orphan Trains.',
    correctAnswer: 'D',
  },
  {
    number: 21,
    question: 'What example is given regarding the modern population of China?',
    options: [
      {
        label: 'A',
        text: 'Primarily an NPC workforce introduced after the last reset — programmed for industrial manufacturing, obedience, and high-level conformity.',
        isCorrect: true,
        rationale:
          'China example: post-reset NPC workforce tuned for manufacturing, obedience, conformity.',
      },
      {
        label: 'B',
        text: 'Entirely free true-soul elders who banned all manufacturing and conformity programming forever.',
        isCorrect: false,
        rationale:
          'The example is NPC workforce programming toward industrial manufacturing and obedience.',
      },
      {
        label: 'C',
        text: 'Only a Finance String case study with no NPC, reset, or conformity dimension at all.',
        isCorrect: false,
        rationale:
          'It is explicitly an NPC workforce deployment example after the last reset.',
      },
      {
        label: 'D',
        text: 'A Pleiadian colony that never experienced any reset or synthetic population insertion.',
        isCorrect: false,
        rationale:
          'Described as primarily NPC workforce after reset, not a free Pleiadian colony.',
      },
    ],
    hint: 'Post-reset NPC workforce — manufacturing, obedience, conformity.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question: 'Why is synthetic nature harder to detect in many children?',
    options: [
      {
        label: 'A',
        text: 'Because all children are true souls with full finance and religion pride already formed.',
        isCorrect: false,
        rationale:
          'Many children are NPCs; detection is harder before rigid adult opinions fully form.',
      },
      {
        label: 'B',
        text: 'Because they have not yet fully formed the rigid opinions surrounding finance, religion, or societal pride that define adult NPCs.',
        isCorrect: true,
        rationale:
          'Child NPCs lack fully formed adult String/pride rigidity that makes adult NPCs easier to spot.',
      },
      {
        label: 'C',
        text: 'Because children never appear as NPCs under any reset or programming model whatsoever.',
        isCorrect: false,
        rationale:
          'Many children are NPCs; detection difficulty is the named point, not absence of child NPCs.',
      },
      {
        label: 'D',
        text: 'Because every child already blurts adult mainstream slogans with full ego armor installed.',
        isCorrect: false,
        rationale:
          'Rigid finance/religion/pride opinions define adult NPCs and are not fully formed yet in children.',
      },
    ],
    hint: 'Child NPCs — adult finance/religion/pride rigidity not fully formed yet.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question: 'What ratio vanishes when the holographic alien invasion and 30-second EMF flash hit?',
    options: [
      {
        label: 'A',
        text: 'Three of every hundred vanish while ninety-seven remain as permanent herd enforcers.',
        isCorrect: false,
        rationale:
          'For every 100 people, 97 instantly vanish, leaving only 3 survivors.',
      },
      {
        label: 'B',
        text: 'No one vanishes — only the projection dome brightens with zero demographic change.',
        isCorrect: false,
        rationale:
          '97 of 100 vanish; removal coincides with stripping overlays and the fake projection dome.',
      },
      {
        label: 'C',
        text: 'For every 100 people present in any given location, 97 will instantly vanish, leaving only 3 survivors — during staged holographic alien invasion timing with the 30-second EMF flash.',
        isCorrect: true,
        rationale:
          'Staged holographic invasion + 30s Flash → 97 vanish, 3 remain per 100.',
      },
      {
        label: 'D',
        text: 'All 100 ascend as NPCs while true souls are relocated under the Vatican permanently.',
        isCorrect: false,
        rationale:
          'NPCs vanish; true-soul survivors remain at roughly 3 per 100 in location counts.',
      },
    ],
    hint: '97 of 100 vanish — 3 survivors — invasion scare + 30s Flash.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question: 'How should awakened individuals prepare emotionally for the 97% disappearance?',
    options: [
      {
        label: 'A',
        text: 'By deepening lifelong grief contracts with every NPC relative as if they were eternal souls.',
        isCorrect: false,
        rationale:
          'True souls will not experience sorrow or grief — recognizing NPCs as temporary synthetic constructs.',
      },
      {
        label: 'B',
        text: 'By refusing all cosmic memory so the Flash produces maximum unresolved mourning by design.',
        isCorrect: false,
        rationale:
          'True souls instantly retrieve millions of years of cosmic memory and do not grieve NPCs.',
      },
      {
        label: 'C',
        text: 'By trying to awaken every hardwired NPC so none disappear and attachment never needs release.',
        isCorrect: false,
        rationale:
          'Attempting to awaken hardwired matrix beings is futile; release of attachment is required.',
      },
      {
        label: 'D',
        text: 'Release emotional attachment — friends, colleagues, and close family among the 97% will vanish; true souls retrieve millions of years of cosmic memory at the Flash and will not grieve, recognizing NPCs as temporary synthetic constructs.',
        isCorrect: true,
        rationale:
          'Prepare to release attachment; cosmic memory return prevents grief over synthetic disappearances.',
      },
    ],
    hint: 'Release attachment — no grief; NPCs recognized as temporary synthetics.',
    correctAnswer: 'D',
  },
  {
    number: 25,
    question: 'What strategic stance must true souls take toward the NPC herd and the final events?',
    options: [
      {
        label: 'A',
        text: 'Completely detach from the 3 Strings; do not let NPC herd mentality dictate reality; isolation is protection — seeking validation or awakening hardwired NPCs is futile; stay calm and anchored on hidden knowledge when the programmed world descends into sheer terror.',
        isCorrect: true,
        rationale:
          'Sever Strings, refuse herd validation games, stop converting NPCs, stay anchored when terror hits.',
      },
      {
        label: 'B',
        text: 'Double down on Religion, Finance, and Perceived Knowledge so the herd accepts you as leader forever.',
        isCorrect: false,
        rationale:
          'Allowing NPC herd mentality to dictate reality produces psychological collapse as the old world dissolves.',
      },
      {
        label: 'C',
        text: 'Spend the final phase only converting NPCs on television so none need to be erased at the Flash.',
        isCorrect: false,
        rationale:
          'Awakening hardwired NPCs is futile; they are designed to derail awakening and punish non-conformity.',
      },
      {
        label: 'D',
        text: 'Join the sheer terror fully so you blend with the programmed world during final events.',
        isCorrect: false,
        rationale:
          'True souls must remain calm and anchored on hidden knowledge while the programmed world panics.',
      },
    ],
    hint: 'Detach from 3 Strings — isolation as protection — stay calm in the terror.',
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
  'Test your grasp of NPC Population — 97% synthetics, social firmware, Flash erasure, and navigating the herd without attachment.';
const DESC_META =
  'Interactive Living Truth Quiz on NPC Population: 4th-density replica souls, Orphan Trains, China workforce example, 3 of 100 survivors, and severing the 3 Strings.';

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
      'Ninety-seven percent. Clones, inserts, synthetics. No eternal soul. No monologue. No past lives. Firmware of conformity. News, sports, slogans. Taxis, teachers, family seats filled so the sim feels real. After resets, Orphan Trains restocked the board. They cannot rise to 5th density. The Flash pixelates them into the aether. Three of a hundred remain. You will not grieve them as eternal kin — cosmic memory will show what they were. Drop Religion, Finance, Perceived Knowledge. Stop seeking their validation. Stay calm when their world hits sheer terror.',
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
console.log('PASS: audited 25/25 against data/alice-topics/npc-population.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
