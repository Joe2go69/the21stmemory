/**
 * Installs Recycled Souls quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/recycled-souls.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-recycled-souls-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'recycled-souls';
const TOPIC_TITLE = 'Recycled Souls';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/recycled-souls.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['97%', 'recycled souls', 'npc'],
  2: ['compliant workforce', 'control mechanism', 'parasitic'],
  3: ['past lives', 'ascension', 'reincarnation'],
  4: ['firmware', 'hardware', 'conformity'],
  5: ['4th density', 'replica', 'hive-aligned'],
  6: ['d.u.m.b', 'vats', 'cloned'],
  7: ['30-second', 'pixelation dust', 'emf'],
  8: ['stem cells', 'orphans', 'reset'],
  9: ['woven', 'sung', 'harmonic'],
  10: ['knock-off', 'parasites', 'frequency'],
  11: ['recycled', 'not reincarnated', 'temporary'],
  12: ['television', 'radio', 'education'],
  13: ['internal monologue', 'hive mind', 'scripted'],
  14: ['taxis', 'teachers', 'restaurants'],
  15: ['density suppression', 'herd', 'synthetic foods'],
  16: ['15 to 30 minutes', 'ghost', 'grey'],
  17: ['orbs', 'phasing', 'religious'],
  18: ['tartary', 'cloned', 'infrastructure'],
  19: ['china', '500 million', '1.4 billion'],
  20: ['one-child', 'industrial', 'impossibility'],
  21: ['buffering', 'taran', 'star seeds'],
  22: ['religion', 'finance', 'perceived knowledge'],
  23: ['firmament', 'ostracizing', 'prison'],
  24: ['520 million', 'deleted', '4th-density'],
  25: ['never truly alive', 'cosmic families', 'control grid'],
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
    question: 'What powers the 97% of the global population that is not eternal organically incarnated beings?',
    options: [
      {
        label: 'A',
        text: 'Recycled Souls — artificial entities among NPCs, inserts, Clones, and synthetics making up exactly 97% of the population.',
        isCorrect: true,
        rationale:
          '97% are NPCs, inserts, Clones, and synthetics powered by Recycled Souls — not eternal organic beings.',
      },
      {
        label: 'B',
        text: 'Only pure Source sparks woven in higher light realms with full past-life libraries in every vessel.',
        isCorrect: false,
        rationale:
          'True souls are woven and sung in higher realms; the 97% run on lab-engineered Recycled Souls.',
      },
      {
        label: 'C',
        text: 'Nothing — the 97% figure is symbolic and no artificial soul technology exists in the plain.',
        isCorrect: false,
        rationale:
          'Exactly 97% are powered by Recycled Souls as manufactured biological hardware.',
      },
      {
        label: 'D',
        text: 'Only Twin Flame partners who reincarnate together with full free-will cosmic continuity.',
        isCorrect: false,
        rationale:
          'Recycled Souls power the artificial majority; they lack authentic spiritual origins and past lives.',
      },
    ],
    hint: '97% — NPCs powered by Recycled Souls.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'What function do these artificial entities serve for parasitic overlords?',
    options: [
      {
        label: 'A',
        text: 'They dismantle all control grids daily and teach free dimensional ascension as public service.',
        isCorrect: false,
        rationale:
          'They function as a compliant workforce and societal control mechanism.',
      },
      {
        label: 'B',
        text: 'A compliant workforce and a societal control mechanism designed by parasitic overlords.',
        isCorrect: true,
        rationale:
          'Recycled-Soul NPCs = compliant workforce + control mechanism for parasites.',
      },
      {
        label: 'C',
        text: 'Only temporary weather effects with no workforce, conformity, or infrastructure role.',
        isCorrect: false,
        rationale:
          'They manage infrastructure of the current epoch and enforce conformity across the realm.',
      },
      {
        label: 'D',
        text: 'Exclusive guardians of Tartarian free-energy temples with no herd-enforcement mandate.',
        isCorrect: false,
        rationale:
          'After Tartary fell, cloned NPCs restocked empty infrastructure; they police norms, not free-energy truth.',
      },
    ],
    hint: 'Compliant workforce — societal control mechanism.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question: 'Why are NPC souls disconnected from natural reincarnation laws?',
    options: [
      {
        label: 'A',
        text: 'Because they hold too many past lives and refuse further incarnation by free choice only.',
        isCorrect: false,
        rationale:
          'They lack authentic spiritual origins — neither past lives nor capacity for future dimensional ascension.',
      },
      {
        label: 'B',
        text: 'Because Micro Suns banned reincarnation for everyone including true organic souls forever.',
        isCorrect: false,
        rationale:
          'True souls still process and reincarnate; NPC Recycled Souls are outside natural reincarnation laws.',
      },
      {
        label: 'C',
        text: 'They lack authentic spiritual origins — possessing neither past lives nor the capacity for future dimensional ascension.',
        isCorrect: true,
        rationale:
          'No authentic origin = no past lives, no future ascension path — outside natural reincarnation.',
      },
      {
        label: 'D',
        text: 'Because they ascend to 5th density automatically every time a vessel dies on the surface.',
        isCorrect: false,
        rationale:
          'They cannot ascend; they are recycled back into the simulation within the current matrix.',
      },
    ],
    hint: 'No authentic origin — no past lives, no future ascension.',
    correctAnswer: 'C',
  },
  {
    number: 4,
    question: 'How are Recycled-Soul NPCs described as manufactured systems?',
    options: [
      {
        label: 'A',
        text: 'As free-roaming eternal spirits with no firmware and no strategic distribution plan.',
        isCorrect: false,
        rationale:
          'They are manufactured biological hardware driven by lab-engineered firmware.',
      },
      {
        label: 'B',
        text: 'As pure light without bodies, never placed in restaurants, taxis, or teaching roles.',
        isCorrect: false,
        rationale:
          'They are biological vessels strategically distributed to enforce conformity and manage infrastructure.',
      },
      {
        label: 'C',
        text: 'As accidental weather noise with no lab engineering or epoch-management purpose.',
        isCorrect: false,
        rationale:
          'Lab-engineered firmware drives hardware placed to manage the infrastructure of the current epoch.',
      },
      {
        label: 'D',
        text: 'Manufactured biological hardware driven by lab-engineered firmware — strategically distributed across the realm to enforce conformity and manage infrastructure of the current epoch.',
        isCorrect: true,
        rationale:
          'Hardware + lab firmware + strategic placement = conformity enforcement and epoch infrastructure.',
      },
    ],
    hint: 'Biological hardware + lab firmware — enforce conformity, run infrastructure.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question: 'What are Recycled Souls by definition?',
    options: [
      {
        label: 'A',
        text: 'Artificial, replica souls engineered in 4th density laboratories to act as a hive-aligned power source for NPC vessels.',
        isCorrect: true,
        rationale:
          'Recycled Souls = 4th density lab replica souls powering NPC vessels as hive-aligned juice.',
      },
      {
        label: 'B',
        text: 'Eternal organic souls woven in higher light realms with full free harmonic intention.',
        isCorrect: false,
        rationale:
          'True souls are woven and sung in higher realms; Recycled Souls are artificial lab replicas.',
      },
      {
        label: 'C',
        text: 'Only paperwork labels with no laboratory manufacture or vessel-power function.',
        isCorrect: false,
        rationale:
          'They are engineered in 4th density labs as the power source animating NPC vessels.',
      },
      {
        label: 'D',
        text: 'Temporary weather spirits that never enter biological vessels or hive structures.',
        isCorrect: false,
        rationale:
          'They are hive-aligned power sources for biological NPC vessels, not weather spirits.',
      },
    ],
    hint: '4th density lab replicas — hive-aligned power for NPC vessels.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'What are D.U.M.B.S in this architecture?',
    options: [
      {
        label: 'A',
        text: 'Surface schools that only teach free-energy physics with no underground clone production.',
        isCorrect: false,
        rationale:
          'Deep Underground Military Bases grow cloned NPC children in vats after planetary resets.',
      },
      {
        label: 'B',
        text: 'Subterranean facilities where cloned NPC children are grown in vats to serve as the new biological crop following planetary resets.',
        isCorrect: true,
        rationale:
          'D.U.M.B.S. = underground vat farms for post-reset cloned NPC biological crops.',
      },
      {
        label: 'C',
        text: 'Pleiadian embassies above the firmament with no role in orphan distribution logistics.',
        isCorrect: false,
        rationale:
          'They are subterranean military bases for clone growth, not celestial embassies.',
      },
      {
        label: 'D',
        text: 'Only libraries that archive Tartarian history without any stem-cell or vat technology.',
        isCorrect: false,
        rationale:
          'Stem cells and underground labs grow replacement orphans; that is the D.U.M.B.S. function.',
      },
    ],
    hint: 'Deep Underground Military Bases — clone children grown in vats after resets.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question: 'What does the EMF Flash do to the entire NPC population?',
    options: [
      {
        label: 'A',
        text: 'Gently upgrades every Recycled Soul into a true higher-light organic soul overnight.',
        isCorrect: false,
        rationale:
          'It instantly eradicates the entire NPC population, reducing them to pixelation dust.',
      },
      {
        label: 'B',
        text: 'Only freezes Finance String accounts with no effect on biological vessels or replica souls.',
        isCorrect: false,
        rationale:
          'All biological entities on 4th-density replica souls are permanently deleted and evaporate.',
      },
      {
        label: 'C',
        text: 'An impending 30-second cosmic event that will instantly eradicate the entire NPC population, reducing them to pixelation dust.',
        isCorrect: true,
        rationale:
          'EMF Flash = 30 seconds; full NPC eradication into pixelation dust.',
      },
      {
        label: 'D',
        text: 'A private meditation only true souls notice while NPCs remain embodied forever.',
        isCorrect: false,
        rationale:
          'The purge leaves a maximum of 520 million authentic souls; NPCs are gone.',
      },
    ],
    hint: '30-second EMF — NPCs eradicated as pixelation dust.',
    correctAnswer: 'C',
  },
  {
    number: 8,
    question: 'How do parasitic overlords replace a surface population after a planetary reset?',
    options: [
      {
        label: 'A',
        text: 'They invite free true souls only and permanently ban all stem-cell and underground lab work.',
        isCorrect: false,
        rationale:
          'They annihilate the surface, extract stem cells from sacrificed children, grow orphans underground, then distribute them.',
      },
      {
        label: 'B',
        text: 'They leave cities empty forever with no replacement crop and no orphan distribution system.',
        isCorrect: false,
        rationale:
          'Newly grown crops are distributed across the planet to populate repurposed cities.',
      },
      {
        label: 'C',
        text: 'They only rebrand existing true souls without any sacrifice, stem cells, or vat growth involved.',
        isCorrect: false,
        rationale:
          'Stem cells from sacrificed children and underground lab growth are the replacement pipeline.',
      },
      {
        label: 'D',
        text: 'Annihilate the surface population, extract stem cells from sacrificed children, grow a replacement population of orphans in underground laboratories, then distribute that newly grown crop to populate repurposed cities.',
        isCorrect: true,
        rationale:
          'Reset pipeline: annihilation → stem cells → underground orphan crop → city restock.',
      },
    ],
    hint: 'Kill surface → stem cells → underground orphans → restock cities.',
    correctAnswer: 'D',
  },
  {
    number: 9,
    question: 'How are true souls created compared with Recycled Souls?',
    options: [
      {
        label: 'A',
        text: 'True souls are woven and sung into existence in higher light realms through sustained harmonic intention — parasites cannot do this, so they manufacture cheap knock-off replica souls in 4th density labs.',
        isCorrect: true,
        rationale:
          'Organic: woven/sung with harmonic intention. Parasite path: 4th density cheap knock-off replicas.',
      },
      {
        label: 'B',
        text: 'True souls and Recycled Souls are identical products from the same 4th density factory line.',
        isCorrect: false,
        rationale:
          'Parasites lack the spiritual frequency to create organic life; knock-offs are not true souls.',
      },
      {
        label: 'C',
        text: 'True souls are only grown in D.U.M.B.S. vats while Recycled Souls come from higher light realms.',
        isCorrect: false,
        rationale:
          'Opposite: higher-light weaving for true souls; underground/4th density manufacture for recycled replicas.',
      },
      {
        label: 'D',
        text: 'Neither true nor recycled souls exist; only empty vessels operate without any animating source.',
        isCorrect: false,
        rationale:
          'NPC vessels are animated by Recycled Souls; true souls have authentic higher-realm origins.',
      },
    ],
    hint: 'True souls woven/sung in higher light — parasites make 4th density knock-offs.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'Why do parasites rely on manufacturing cheap knock-off replica souls?',
    options: [
      {
        label: 'A',
        text: 'Because they prefer organic higher-light singing and can already create full eternal souls freely.',
        isCorrect: false,
        rationale:
          'Parasites lack the spiritual frequency to create organic life.',
      },
      {
        label: 'B',
        text: 'Because parasites lack the spiritual frequency to create organic life — so they rely on manufacturing cheap knock-off replica souls in 4th density laboratories.',
        isCorrect: true,
        rationale:
          'No spiritual frequency for organic creation → 4th density knock-off replica soul industry.',
      },
      {
        label: 'C',
        text: 'Because true souls request to be demoted into hive-aligned firmware every reset voluntarily.',
        isCorrect: false,
        rationale:
          'Replica manufacture is parasitic necessity, not voluntary true-soul demotion.',
      },
      {
        label: 'D',
        text: 'Because Micro Suns outsourced all soul creation to Grey ET weather departments only.',
        isCorrect: false,
        rationale:
          'The limit is parasitic frequency deficiency, not Micro Sun outsourcing to weather desks.',
      },
    ],
    hint: 'Parasites lack frequency for organic life — hence knock-off labs.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question: 'What happens to NPCs upon death instead of true reincarnation into new family lines?',
    options: [
      {
        label: 'A',
        text: 'They ascend to 5th density with full cosmic family reunion and permanent free will.',
        isCorrect: false,
        rationale:
          'They are simply recycled back into the simulation — temporary existence locked in the current matrix.',
      },
      {
        label: 'B',
        text: 'They reincarnate into the same genetic bloodline with full past-life memory every time.',
        isCorrect: false,
        rationale:
          'NPCs are not reincarnated into new family lines; they are recycled back into the simulation.',
      },
      {
        label: 'C',
        text: 'They are simply recycled back into the simulation — existence entirely temporary and firmly locked within the confines of the current dimensional matrix.',
        isCorrect: true,
        rationale:
          'Recycled into the sim, not reincarnated into families — temporary, matrix-locked existence.',
      },
      {
        label: 'D',
        text: 'They permanently leave the planet and never return as any form of vessel or firmware.',
        isCorrect: false,
        rationale:
          'They recycle back into the simulation until the EMF purge deletes them entirely.',
      },
    ],
    hint: 'Recycled into the sim — not reincarnated into family lines.',
    correctAnswer: 'C',
  },
  {
    number: 12,
    question: 'How are NPCs hard-wired to mainstream narratives?',
    options: [
      {
        label: 'A',
        text: 'Through pure Source harmonic intention with no media or peer programming involved.',
        isCorrect: false,
        rationale:
          'Hard-wired via television, radio, education systems, and peer interactions.',
      },
      {
        label: 'B',
        text: 'Only through one banned underground book that never appears on television or radio.',
        isCorrect: false,
        rationale:
          'Distribution is mainstream: TV, radio, education, and peer interactions.',
      },
      {
        label: 'C',
        text: 'They invent all narratives independently with full critical free thought each morning.',
        isCorrect: false,
        rationale:
          'They lack self-awareness and think in uniform scripted non-cognitive chains.',
      },
      {
        label: 'D',
        text: 'Hard-wired directly to mainstream narratives distributed through television, radio, education systems, and peer interactions.',
        isCorrect: true,
        rationale:
          'TV, radio, schools, peers = hard-wire pipes into mainstream narrative firmware.',
      },
    ],
    hint: 'TV, radio, education, peer interactions — hard-wired narratives.',
    correctAnswer: 'D',
  },
  {
    number: 13,
    question: 'What defines NPC behavioral programming and hive-mind thought?',
    options: [
      {
        label: 'A',
        text: 'They lack self-awareness, depth of conviction, and an internal monologue — operating as a collective hive mind in uniform, scripted, non-cognitive chains to avoid societal castigation for challenging authority.',
        isCorrect: true,
        rationale:
          'No monologue or conviction depth; hive-scripted chains avoid castigation for challenging authority.',
      },
      {
        label: 'B',
        text: 'They hold rich internal monologues and bravely challenge every authority as independent thinkers.',
        isCorrect: false,
        rationale:
          'They lack monologue and avoid challenging authority to escape societal castigation.',
      },
      {
        label: 'C',
        text: 'They refuse all scripting and only think in pure non-uniform chaos without hive alignment.',
        isCorrect: false,
        rationale:
          'Thought is uniform, scripted, non-cognitive hive chains by design.',
      },
      {
        label: 'D',
        text: 'They only think critically when alone and never participate in any collective mind pattern.',
        isCorrect: false,
        rationale:
          'Collective hive mind operation is the named behavioral mechanic.',
      },
    ],
    hint: 'No monologue — hive-scripted chains — avoid challenging authority.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question: 'How are societal roles filled by engineered NPCs?',
    options: [
      {
        label: 'A',
        text: 'Only one NPC template exists, limited to silent museum mannequins with no labor roles.',
        isCorrect: false,
        rationale:
          'An NPC is engineered for every possible societal role and subculture, including operational jobs.',
      },
      {
        label: 'B',
        text: 'There is an NPC specifically engineered for every possible societal role and subculture — populating restaurants, taxis, teaching, and manufacturing sectors.',
        isCorrect: true,
        rationale:
          'Role-engineered NPCs fill food service, taxis, teaching, manufacturing, and every subculture niche.',
      },
      {
        label: 'C',
        text: 'NPCs never work; they only float as invisible frequency with no restaurant or taxi presence.',
        isCorrect: false,
        rationale:
          'They populate essential operational positions across service and industry.',
      },
      {
        label: 'D',
        text: 'Only true souls fill taxis and teaching while NPCs are banned from all public jobs forever.',
        isCorrect: false,
        rationale:
          'NPCs are placed in those essential operational positions by design.',
      },
    ],
    hint: 'NPC for every role — restaurants, taxis, teachers, manufacturing.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question: 'How do Control Frequencies and herd safety shape NPC behavior?',
    options: [
      {
        label: 'A',
        text: 'They reject Density Suppression, eat only pure crystalline food, and never enforce tyrannical rules.',
        isCorrect: false,
        rationale:
          'They are highly susceptible to Density Suppression and eagerly enforce tyrannical rules on authentic souls.',
      },
      {
        label: 'B',
        text: 'They only seek solitude outside the herd with no interest in safety or social compliance.',
        isCorrect: false,
        rationale:
          'Primary directive is to seek the safety of the herd.',
      },
      {
        label: 'C',
        text: 'Highly susceptible to Density Suppression and societal programming — they willingly immerse in toxic environments, consume synthetic foods, and eagerly enforce tyrannical rules upon authentic souls because their primary directive is herd safety.',
        isCorrect: true,
        rationale:
          'Density Suppression + toxic immersion + rule enforcement = herd-safety directive in action.',
      },
      {
        label: 'D',
        text: 'They dismantle all tyrannical rules so authentic souls never face any herd enforcement.',
        isCorrect: false,
        rationale:
          'They eagerly enforce tyrannical rules upon authentic souls.',
      },
    ],
    hint: 'Density Suppression — toxic immersion — enforce rules for herd safety.',
    correctAnswer: 'C',
  },
  {
    number: 16,
    question: 'What is the Ghost Illusion relative to soul processing times?',
    options: [
      {
        label: 'A',
        text: 'Proof that authentic souls linger for centuries as hauntings with no reincarnation clock at all.',
        isCorrect: false,
        rationale:
          'Authentic souls are processed into new infants within 15 to 30 minutes; lingering ghosts are fabricated.',
      },
      {
        label: 'B',
        text: 'Evidence that Recycled Souls never recycle and stay as free floating spirits forever.',
        isCorrect: false,
        rationale:
          'NPC souls are immediately recycled; ghost sightings are orchestrated deceptions.',
      },
      {
        label: 'C',
        text: 'A Finance String product sold as insurance for haunted houses with no ET technology involved.',
        isCorrect: false,
        rationale:
          'Hauntings are generated by Grey ET Orbs and advanced phasing technology.',
      },
      {
        label: 'D',
        text: 'Because NPC souls recycle immediately and authentic souls reincarnate into new infants within 15 to 30 minutes of death, lingering spirits are a total fabrication — hauntings are Grey ET Orbs and phasing tech reinforcing fear-based religious paradigms.',
        isCorrect: true,
        rationale:
          'Fast recycle/reincarnate clocks kill the ghost myth; Grey Orbs/phasing fake hauntings for fear-religion.',
      },
    ],
    hint: '15–30 minute re-entry — ghosts are Grey Orb/phasing deceptions.',
    correctAnswer: 'D',
  },
  {
    number: 17,
    question: 'What generates supposed hauntings and ghost sightings?',
    options: [
      {
        label: 'A',
        text: 'Orchestrated deceptions generated by Grey ET Orbs and advanced phasing technology — designed to reinforce fear-based religious paradigms.',
        isCorrect: true,
        rationale:
          'Grey Orbs + phasing tech fake ghosts to feed fear-based religion.',
      },
      {
        label: 'B',
        text: 'Genuine eternal souls who refuse reincarnation and stay visible for centuries by free will.',
        isCorrect: false,
        rationale:
          'Authentic souls re-enter new infants within 15–30 minutes; lingering is fabricated.',
      },
      {
        label: 'C',
        text: 'Only natural weather lights with no religious programming purpose whatsoever.',
        isCorrect: false,
        rationale:
          'Purpose is reinforcing fear-based religious paradigms via orchestrated deception.',
      },
      {
        label: 'D',
        text: 'Recycled Souls on vacation who choose to appear as ghosts instead of powering NPC vessels.',
        isCorrect: false,
        rationale:
          'Recycled Souls power NPC vessels and recycle immediately; ghost shows are Grey tech theater.',
      },
    ],
    hint: 'Grey ET Orbs and phasing tech — fear-based religious reinforcement.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question: 'How did Recycled-Soul NPCs connect to the fall of Great Tartary?',
    options: [
      {
        label: 'A',
        text: 'Tartary was restocked only with free true souls who banned all cloning after the destruction.',
        isCorrect: false,
        rationale:
          'Massive influxes of cloned NPCs restocked empty, pre-built infrastructure after Tartary\'s destruction.',
      },
      {
        label: 'B',
        text: 'Following destruction of Great Tartary, massive influxes of cloned NPCs were utilized to restock the empty, pre-built infrastructure — population explosions tied to NPC mass-production.',
        isCorrect: true,
        rationale:
          'Post-Tartary: cloned NPC influx restocks empty infrastructure; mass-production drives population surges.',
      },
      {
        label: 'C',
        text: 'Tartary never fell and never required any NPC restock of cities or infrastructure.',
        isCorrect: false,
        rationale:
          'Destruction of Great Tartary and NPC restock of empty infrastructure is explicit.',
      },
      {
        label: 'D',
        text: 'Only Finance String reforms rebuilt Tartary without any cloned workforce introduction.',
        isCorrect: false,
        rationale:
          'Cloned NPC influx is the named restock method after Tartary\'s fall.',
      },
    ],
    hint: 'After Tartary fell — cloned NPC influx restocked empty infrastructure.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question: 'What China population figures illustrate NPC mass-production?',
    options: [
      {
        label: 'A',
        text: 'A natural decline from 1.4 billion to 500 million under free true-soul demography only.',
        isCorrect: false,
        rationale:
          'Surge from 500 million to 1.4 billion despite one-child policy is the named impossibility.',
      },
      {
        label: 'B',
        text: 'No change at all, proving no NPC workforce was ever introduced after any reset.',
        isCorrect: false,
        rationale:
          'Drastic surge is directly attributable to NPC mass-production and covert workforce introduction.',
      },
      {
        label: 'C',
        text: 'A drastic surge from 500 million to 1.4 billion despite a strict decades-long one-child policy — a mathematical impossibility achieved only through covert introduction of newly manufactured NPC workforces designed for rapid industrial compliance.',
        isCorrect: true,
        rationale:
          '500M → 1.4B against one-child policy = lab NPC workforce for industrial compliance.',
      },
      {
        label: 'D',
        text: 'Exactly one million true souls with zero industrial NPC programming of any kind.',
        isCorrect: false,
        rationale:
          'The example is mass-produced NPC industrial workforce expansion, not a tiny true-soul count.',
      },
    ],
    hint: 'China 500M → 1.4B despite one-child policy — NPC workforce.',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question: 'What does the China one-child policy contradiction reveal?',
    options: [
      {
        label: 'A',
        text: 'That natural birth alone always outruns policy with no lab-grown workforce required.',
        isCorrect: false,
        rationale:
          'The surge is a mathematical impossibility without covert manufactured NPC workforces.',
      },
      {
        label: 'B',
        text: 'That population math is irrelevant and industrial compliance never used synthetic people.',
        isCorrect: false,
        rationale:
          'NPC workforces were designed for rapid industrial compliance via covert introduction.',
      },
      {
        label: 'C',
        text: 'That one-child policy never existed and no population figures can be discussed.',
        isCorrect: false,
        rationale:
          'Decades-long one-child policy is cited against the impossible surge numbers.',
      },
      {
        label: 'D',
        text: 'That the surge is a mathematical impossibility achieved only through covert introduction of newly manufactured NPC workforces designed for rapid industrial compliance.',
        isCorrect: true,
        rationale:
          'Impossible natural growth under one-child rules = covert NPC industrial workforce insertion.',
      },
    ],
    hint: 'Mathematical impossibility — covert NPC industrial workforce.',
    correctAnswer: 'D',
  },
  {
    number: 21,
    question: 'How does the NPC collective act as a biological buffering field?',
    options: [
      {
        label: 'A',
        text: 'Weaponized to derail the spiritual awakening of genuine Taran Humans and Star Seeds by enforcing the Three Strings of the matrix.',
        isCorrect: true,
        rationale:
          'Buffering field = weaponized derailment of Tarans/Star Seeds via Religion, Finance, Perceived Knowledge.',
      },
      {
        label: 'B',
        text: 'As a free protective shield that accelerates every Taran and Star Seed into 5th density instantly.',
        isCorrect: false,
        rationale:
          'They derail spiritual awakening rather than accelerate it.',
      },
      {
        label: 'C',
        text: 'Only as silent scenery that never polices norms or questions about the firmament.',
        isCorrect: false,
        rationale:
          'They aggressively police societal norms and ostracize those who question firmament or history.',
      },
      {
        label: 'D',
        text: 'As permanent cosmic family members who never enforce any matrix String whatsoever.',
        isCorrect: false,
        rationale:
          'They enforce the Three Strings; authentic beings reunite with true cosmic families after the purge.',
      },
    ],
    hint: 'Buffer field — derail Tarans/Star Seeds via Three Strings.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question: 'What are the Three Strings NPCs enforce against genuine souls?',
    options: [
      {
        label: 'A',
        text: 'Sports, weather, and cooking as the only spiritual control mechanisms in the matrix.',
        isCorrect: false,
        rationale:
          'The Three Strings are Religion, Finance, and Perceived Knowledge.',
      },
      {
        label: 'B',
        text: 'Religion, Finance, and Perceived Knowledge — the matrix strings NPCs enforce by policing norms and ostracizing firmament/history questioners.',
        isCorrect: true,
        rationale:
          'Religion · Finance · Perceived Knowledge — enforced via norm police and ostracization.',
      },
      {
        label: 'C',
        text: 'Only Density Suppression hardware with no religious, financial, or knowledge dimension.',
        isCorrect: false,
        rationale:
          'Density Suppression is separate; Three Strings are the named psychological prison pillars.',
      },
      {
        label: 'D',
        text: 'D.U.M.B.S., Orphan Trains, and China factories as the only control strings listed.',
        isCorrect: false,
        rationale:
          'Those are deployment logistics; the Strings are Religion, Finance, Perceived Knowledge.',
      },
    ],
    hint: 'Religion · Finance · Perceived Knowledge.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question: 'How do NPCs maintain the parasites\' psychological prison regarding firmament and history?',
    options: [
      {
        label: 'A',
        text: 'By openly teaching firmament science and free historical resets in every classroom daily.',
        isCorrect: false,
        rationale:
          'They ostracize those who question the nature of the firmament or historical narratives.',
      },
      {
        label: 'B',
        text: 'By remaining silent forever with no policing of societal norms whatsoever.',
        isCorrect: false,
        rationale:
          'They aggressively police societal norms as active maintenance of the psychological prison.',
      },
      {
        label: 'C',
        text: 'By aggressively policing societal norms and ostracizing those who question the nature of the firmament or historical narratives — actively maintaining the integrity of the parasites\' psychological prison.',
        isCorrect: true,
        rationale:
          'Norm police + ostracize firmament/history questioners = maintain parasitic psychological prison.',
      },
      {
        label: 'D',
        text: 'By deleting the firmament itself so no one can ever ask questions about it again.',
        isCorrect: false,
        rationale:
          'They police and ostracize questioners; they do not delete the firmament architecture.',
      },
    ],
    hint: 'Police norms — ostracize firmament/history questioners.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question: 'What happens when the EMF Flash strikes regarding 4th-density replica souls?',
    options: [
      {
        label: 'A',
        text: 'All 4th-density replica-soul entities upgrade into organic eternal souls and remain embodied.',
        isCorrect: false,
        rationale:
          'All biological entities on 4th-density replica souls are permanently deleted, evaporating instantly.',
      },
      {
        label: 'B',
        text: 'Only true souls vanish while Recycled Soul NPCs inherit the planet as permanent rulers.',
        isCorrect: false,
        rationale:
          'NPCs are deleted; maximum 520 million authentic souls remain.',
      },
      {
        label: 'C',
        text: 'Nothing changes demographically — only streetlights flicker for thirty seconds.',
        isCorrect: false,
        rationale:
          'The purge removes 97% and leaves at most 520 million authentic souls.',
      },
      {
        label: 'D',
        text: 'All biological entities operating on 4th-density replica souls are permanently deleted from the simulation, evaporating instantly — leaving a maximum of 520 million authentic souls.',
        isCorrect: true,
        rationale:
          'Replica-soul biology deleted at Flash; ≤520 million authentic souls remain.',
      },
    ],
    hint: '4th-density replica souls deleted — max ~520 million authentic remain.',
    correctAnswer: 'D',
  },
  {
    number: 25,
    question: 'How must genuine souls reframe the disappearance of 97% — including friends, colleagues, and family roles?',
    options: [
      {
        label: 'A',
        text: 'Not a tragedy — these entities were never truly alive; deletion marks collapse of the artificial control grid; authentic beings instantly reunite with true ancient cosmic families, rendering memory of recycled counterparts obsolete.',
        isCorrect: true,
        rationale:
          'Never truly alive; grid collapses; cosmic family reunion makes recycled counterparts obsolete.',
      },
      {
        label: 'B',
        text: 'As mandatory eternal grief because every vanished vessel was an organic eternal soul.',
        isCorrect: false,
        rationale:
          'They were never truly alive; mourning them as eternal kin is the attachment to drop.',
      },
      {
        label: 'C',
        text: 'As proof the Flash failed because recycled counterparts remain the primary cosmic family forever.',
        isCorrect: false,
        rationale:
          'Authentic beings reunite with true ancient cosmic families; recycled counterparts become obsolete.',
      },
      {
        label: 'D',
        text: 'As a reason to reinstall Religion, Finance, and Perceived Knowledge stronger than before.',
        isCorrect: false,
        rationale:
          'NPCs enforced those Strings; their deletion ends the artificial control grid, not rebuilds it.',
      },
    ],
    hint: 'Never truly alive — grid collapses — true cosmic family reunion.',
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
  'Test your grasp of Recycled Souls — 4th density replica power, reset orphan crops, ghost illusions, and the EMF purge of the artificial majority.';
const DESC_META =
  'Interactive Living Truth Quiz on Recycled Souls: woven true souls vs lab knock-offs, D.U.M.B.S. vats, Grey hauntings, Tartary restock, China 500M to 1.4B, and cosmic family reunion.';

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
      'Ninety-seven percent run on Recycled Souls — lab knock-offs from 4th density, not woven-and-sung life from higher light. Parasites cannot create organically, so they grow orphans from stem cells in D.U.M.B.S., restock empty Tartarian shells, and hard-wire hive firmware through media and schools. Ghosts are Grey theater. China\'s impossible surge is the tell. The buffer derails Tarans and Star Seeds through Religion, Finance, and Perceived Knowledge. When the Flash hits, replica-soul biology becomes dust. About 520 million authentic souls remain. They were never truly alive. Your real family is cosmic. The grid falls with them.',
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
console.log('PASS: audited 25/25 against data/alice-topics/recycled-souls.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
