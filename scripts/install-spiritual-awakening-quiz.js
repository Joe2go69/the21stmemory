/**
 * Installs Spiritual Awakening quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/spiritual-awakening.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-spiritual-awakening-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'spiritual-awakening';
const TOPIC_TITLE = 'Spiritual Awakening';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/spiritual-awakening.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['great spiritual awakening', '3rd density', 'med-beds'],
  2: ['178,000-year', 'satanism', 'child sacrifice'],
  3: ['religion', 'finance', 'perceived knowledge'],
  4: ['97%', 'npc', '4th density'],
  5: ['g.a.a', 'galactic ancestral', 'overlays'],
  6: ['project bluebeam', 'holographic', 'alien invasion'],
  7: ['ebs', 'satanic crimes', 'dark ages'],
  8: ['30-second', 'emf', '97%'],
  9: ['amnesia vortex', '2019', 'reincarnation'],
  10: ['flat', 'ice wall', 'firmament'],
  11: ['tartaria', 'fabricated', 'history'],
  12: ['evolution', 'genetic', 'higher densities'],
  13: ['custodians', 'anuk', 'loosh'],
  14: ['healthcare', 'empty hospitals', 'pandemic'],
  15: ['religion', 'child sacrifice', 'collapse'],
  16: ['finance', 'wealth', 'monetary'],
  17: ['perceived knowledge', 'egoic', 'falsehood'],
  18: ['wi-fi', 'social media', 'mainstream'],
  19: ['scare events', 'ebs', 'bluebeam'],
  20: ['520 million', '30 seconds', 'npc'],
  21: ['projection dome', 'bright white', 'dark matter'],
  22: ['taran', '4,000', 'nodes'],
  23: ['hardwire', 'soul-architecture', 'eternity'],
  24: ['sequentially', 'memory', 'overload'],
  25: ['soul families', 'manifestation', 'telepathic'],
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
    question: 'What is The Great Spiritual Awakening — and what is it not?',
    options: [
      {
        label: 'A',
        text: 'A definitive high-velocity period of revelation that dismantles the artificial 3rd density simulation — not a political, financial, or med-bed / debt-forgiveness / geopolitical leadership event.',
        isCorrect: true,
        rationale:
          'Awakening uninstalls fabricated history, science, and space-understanding; it is not politics, med-beds, or debt theater.',
      },
      {
        label: 'B',
        text: 'Primarily a bank reform and med-bed rollout managed by mainstream political parties without any holographic or energetic phase.',
        isCorrect: false,
        rationale:
          'It is explicitly not political, financial, or med-bed focused; those are matrix distractions.',
      },
      {
        label: 'C',
        text: 'A slow hobby of reading old textbooks while leaving the 3rd density simulation fully intact forever.',
        isCorrect: false,
        rationale:
          'It is high-velocity uninstallation of the artificial 3rd density simulation, not gentle textbook hobby time.',
      },
      {
        label: 'D',
        text: 'Only a new religion that installs one official savior deity for the whole planet without severing any Strings.',
        isCorrect: false,
        rationale:
          'Religion is a String to uninstall; awakening is liberation from savior constructs, not a new official deity.',
      },
    ],
    hint: 'Dismantle 3rd density simulation — not politics, med-beds, or debt theater.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'What cycle does this period culminate, and what does it expose?',
    options: [
      {
        label: 'A',
        text: 'A ten-year media cycle about sports scores with no link to sacrifice or occupation.',
        isCorrect: false,
        rationale:
          'It ends a 178,000-year subjugation cycle and exposes planetary satanism, child sacrifice, and parasitic occupation.',
      },
      {
        label: 'B',
        text: 'The end of a 178,000-year cycle of planetary subjugation — systematic exposure of planetary satanism, child sacrifice, and the parasitic occupation.',
        isCorrect: true,
        rationale:
          '178,000-year occupation ends here; satanism, child sacrifice, and parasites are forced into the open.',
      },
      {
        label: 'C',
        text: 'The start of a new 178,000-year sleep cycle that reinstalls the Amnesia Vortex permanently.',
        isCorrect: false,
        rationale:
          'The Amnesia Vortex was dismantled in 2019; this is liberation, not a new sleep cycle.',
      },
      {
        label: 'D',
        text: 'Only the invention of Wi-Fi with no connection to history uninstallation or Scare Events.',
        isCorrect: false,
        rationale:
          'Wi-Fi aided truth spread; the core is cycle-end exposure and planetary liberation events.',
      },
    ],
    hint: '178,000-year cycle ends — satanism, sacrifice, parasitic occupation exposed.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question: 'What are the Three Strings that must be consciously severed?',
    options: [
      {
        label: 'A',
        text: 'Gravity, Evolution, and Wi-Fi as physical cables under the Ice Wall only.',
        isCorrect: false,
        rationale:
          'The Three Strings are Religion, Finance, and Perceived Knowledge — psychological tethers to the matrix.',
      },
      {
        label: 'B',
        text: 'Only EBS, Bluebeam, and the EMF Flash as optional entertainment channels.',
        isCorrect: false,
        rationale:
          'Those are Scare Event sequence stages; the Strings are Religion, Finance, and Perceived Knowledge.',
      },
      {
        label: 'C',
        text: 'Religion, Finance, and Perceived Knowledge — the primary psychological and societal tethers that bind human cognition to the control matrix.',
        isCorrect: true,
        rationale:
          'Three Strings = Religion, Finance, Perceived Knowledge; sever them to unbind cognition.',
      },
      {
        label: 'D',
        text: 'Med-beds, debt forgiveness, and geopolitical leadership as the only true liberation path.',
        isCorrect: false,
        rationale:
          'Those are named as what the awakening is not; Strings are the real untether work.',
      },
    ],
    hint: 'Religion · Finance · Perceived Knowledge.',
    correctAnswer: 'C',
  },
  {
    number: 4,
    question: 'What are NPCs (Non-Player Characters) in this architecture?',
    options: [
      {
        label: 'A',
        text: 'The entire 3% remnant of Taran souls who alone can ascend after the Flash.',
        isCorrect: false,
        rationale:
          'NPCs are 97% of the population; genuine souls are the minority who can ascend.',
      },
      {
        label: 'B',
        text: 'Only ancient stone statues with no link to 4th density or herd-consensus narratives.',
        isCorrect: false,
        rationale:
          'NPCs are synthetically generated hive-aligned replica souls from 4th density parasites.',
      },
      {
        label: 'C',
        text: 'G.A.A. field agents who switch off the Projection Dome for free without any population removal.',
        isCorrect: false,
        rationale:
          'G.A.A. manages liberation; NPCs are the 97% removed at the Flash.',
      },
      {
        label: 'D',
        text: 'Synthetically generated, hive-aligned replica souls created in 4th density by parasitic entities — 97% of the global population — lacking capacity for ascension and locked to herd-consensus narratives.',
        isCorrect: true,
        rationale:
          'NPCs = 97% synthetic 4th-density replica souls; no ascension path; herd-consensus only.',
      },
    ],
    hint: '97% — 4th-density replica souls, no ascension, herd consensus.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question: 'What is the G.A.A. (Galactic Ancestral Alliance)?',
    options: [
      {
        label: 'A',
        text: 'The benevolent coalition of highly advanced extraterrestrial and ancestral soul families orchestrating controlled demolition of parasitic overlays and managing the awakening timeline.',
        isCorrect: true,
        rationale:
          'G.A.A. = benevolent ancestral/ET coalition running overlay demolition and awakening timing.',
      },
      {
        label: 'B',
        text: 'A terrestrial bank consortium that only manages debt forgiveness and med-bed patents.',
        isCorrect: false,
        rationale:
          'Awakening is not bank theater; G.A.A. handles parasitic overlay demolition, not debt products.',
      },
      {
        label: 'C',
        text: 'The parasitic Custodians rebranded as heroes who keep the Amnesia Vortex running forever.',
        isCorrect: false,
        rationale:
          'Custodians inverted the realm; G.A.A. is the benevolent counter-coalition.',
      },
      {
        label: 'D',
        text: 'A mainstream news network that never broadcasts EBS content or satanic crime files.',
        isCorrect: false,
        rationale:
          'EBS is a forthcoming planetary broadcast of crimes; G.A.A. is not a compromised news brand.',
      },
    ],
    hint: 'Benevolent ET/ancestral coalition — overlay demolition, timeline management.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'What is Project Bluebeam in the awakening sequence?',
    options: [
      {
        label: 'A',
        text: 'A gentle meditation app that lowers fear without any holographic craft or abduction imagery.',
        isCorrect: false,
        rationale:
          'Bluebeam is advanced holographic software simulating a hyper-realistic global alien invasion.',
      },
      {
        label: 'B',
        text: 'Advanced holographic projection software used to simulate a globally visible, hyper-realistic alien invasion during the awakening.',
        isCorrect: true,
        rationale:
          'Project Bluebeam = holographic Fake Alien Invasion software for mass panic and trauma hardwiring.',
      },
      {
        label: 'C',
        text: 'The name of the Amnesia Vortex after it was strengthened in 2019.',
        isCorrect: false,
        rationale:
          'The Amnesia Vortex was dismantled in 2019; Bluebeam is a separate Scare Event tool.',
      },
      {
        label: 'D',
        text: 'A free-energy locomotive standard restored by Tartaria without any invasion simulation.',
        isCorrect: false,
        rationale:
          'Bluebeam is invasion holography in the Scare Event sequence, not Tartarian rail tech.',
      },
    ],
    hint: 'Holographic hyper-realistic fake alien invasion software.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question: 'What will the EBS (Emergency Broadcast System) unequivocally detail?',
    options: [
      {
        label: 'A',
        text: 'Only sports scores and weather with no mention of sacrifice or institutional complicity.',
        isCorrect: false,
        rationale:
          'EBS details satanic crimes, child sacrifices, and complicity of historical, political, and cultural figures.',
      },
      {
        label: 'B',
        text: 'A soft apology that restores full trust in Dark Ages institutions without any crime files.',
        isCorrect: false,
        rationale:
          'It renders religious and political institutions obsolete by exposing global satanism.',
      },
      {
        label: 'C',
        text: 'Satanic crimes, child sacrifices, and the complicity of all historical, political, and cultural figures since the Dark Ages — an unmitigated planetary broadcast.',
        isCorrect: true,
        rationale:
          'EBS = full planetary dump of satanic crime and elite complicity since the Dark Ages.',
      },
      {
        label: 'D',
        text: 'Instructions to double savings and pray harder to external savior deities before the Flash.',
        isCorrect: false,
        rationale:
          'EBS shatters Religion and political legitimacy; it does not deepen Finance or savior worship.',
      },
    ],
    hint: 'Planetary broadcast — satanic crimes, child sacrifice, elite complicity.',
    correctAnswer: 'C',
  },
  {
    number: 8,
    question: 'What is the EMF / The Flash?',
    options: [
      {
        label: 'A',
        text: 'A multi-year dimming of streetlights with no population removal or overlay stripping.',
        isCorrect: false,
        rationale:
          'It is a 30-second planetary blinding white light that strips overlays and removes 97%.',
      },
      {
        label: 'B',
        text: 'A private meditation only genuine souls notice, leaving NPCs fully in place forever.',
        isCorrect: false,
        rationale:
          'It permanently removes 97% of the population (NPCs) in thirty seconds of white light.',
      },
      {
        label: 'C',
        text: 'A banking outage that freezes Finance String accounts without any dimensional effect.',
        isCorrect: false,
        rationale:
          'EMF is dimensional overlay stripping and population removal — not a bank outage.',
      },
      {
        label: 'D',
        text: 'A 30-second planetary event of blinding white light that instantly strips dimensional overlays and permanently removes 97% of the population.',
        isCorrect: true,
        rationale:
          'Flash = 30 seconds white light; overlays stripped; 97% permanently removed.',
      },
    ],
    hint: '30-second white light — strip overlays, remove 97%.',
    correctAnswer: 'D',
  },
  {
    number: 9,
    question: 'What was the Amnesia Vortex, and what happened to it in 2019?',
    options: [
      {
        label: 'A',
        text: 'The technological frequency fence and reincarnation trap that wiped soul memories between vessels — dismantled in 2019.',
        isCorrect: true,
        rationale:
          'Amnesia Vortex wiped memory between lives; dismantled in 2019 so awakening memory can return.',
      },
      {
        label: 'B',
        text: 'A new stronger fence installed in 2019 to guarantee another 178,000 years of full amnesia.',
        isCorrect: false,
        rationale:
          'It was dismantled in 2019, not strengthened for a new occupation cycle.',
      },
      {
        label: 'C',
        text: 'Only a Wi-Fi brand name with no link to reincarnation or soul memory wiping.',
        isCorrect: false,
        rationale:
          'It is a frequency fence / reincarnation trap technology, not a consumer Wi-Fi brand.',
      },
      {
        label: 'D',
        text: 'The Projection Dome itself, permanently fused to the firmament with no possible shutdown.',
        isCorrect: false,
        rationale:
          'The Projection Dome is switched off by G.A.A. at the climax; Amnesia Vortex is the separate 2019-dismantled trap.',
      },
    ],
    hint: 'Memory-wipe reincarnation trap — dismantled in 2019.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'What is the first critical stepping-stone of awakening regarding Earth\'s shape?',
    options: [
      {
        label: 'A',
        text: 'Accepting the spinning globe in a vacuum as final science before any soul-family study.',
        isCorrect: false,
        rationale:
          'The mandatory baseline is flat stationary plain, ice wall, Firmament — not a spinning globe.',
      },
      {
        label: 'B',
        text: 'Understanding Earth is a flat, stationary plain surrounded by an ice wall, covered by a Firmament — not a spinning globe in a vacuum — a mandatory prerequisite before soul families, crystalline architecture, or ascension mechanics.',
        isCorrect: true,
        rationale:
          'Flat plain + ice wall + Firmament is the required first step; globe vacuum blocks all further awakening.',
      },
      {
        label: 'C',
        text: 'Ignoring geography entirely and only studying med-beds and debt forgiveness as liberation.',
        isCorrect: false,
        rationale:
          'Without the flat-Earth baseline, progression into deeper mechanics is impossible.',
      },
      {
        label: 'D',
        text: 'Believing ice walls are myths while keeping every university cosmology textbook intact.',
        isCorrect: false,
        rationale:
          'Ice wall and Firmament are part of the mandatory true-shape realization.',
      },
    ],
    hint: 'Flat plain, ice wall, Firmament — mandatory first step.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question: 'What must awakening individuals comprehend about history and Tartaria?',
    options: [
      {
        label: 'A',
        text: 'That mainstream timelines already celebrate Tartaria as required curriculum in every school.',
        isCorrect: false,
        rationale:
          'All perceived history is fabricated to obscure the advanced predecessor civilization Tartaria.',
      },
      {
        label: 'B',
        text: 'That Tartaria never existed and Evolution fully explains every advanced structure without resets.',
        isCorrect: false,
        rationale:
          'Tartaria is the obscured high-tech predecessor; Evolution is a manufactured lie.',
      },
      {
        label: 'C',
        text: 'All perceived history is a fabricated narrative designed to obscure a highly advanced predecessor civilization known as Tartaria.',
        isCorrect: true,
        rationale:
          'History is cover story; Tartaria is the hidden advanced predecessor civilization.',
      },
      {
        label: 'D',
        text: 'That only Finance records are false while every scientific and spatial doctrine remains pure.',
        isCorrect: false,
        rationale:
          'Awakening uninstalls fabricated history, chronology, science, and spatial understanding together.',
      },
    ],
    hint: 'Fabricated history obscures advanced Tartaria.',
    correctAnswer: 'C',
  },
  {
    number: 12,
    question: 'What is the truth about human evolution via natural selection?',
    options: [
      {
        label: 'A',
        text: 'It is the only accurate account of vessel origin with no laboratory involvement ever.',
        isCorrect: false,
        rationale:
          'Evolution is a manufactured lie; vessels are engineered and upgraded via genetic synthesis in higher densities.',
      },
      {
        label: 'B',
        text: 'It only applies to NPCs while Taran souls evolve randomly from oceanic mud over eons.',
        isCorrect: false,
        rationale:
          'Biological vessels are engineered in higher-density labs — not random mutation for anyone.',
      },
      {
        label: 'C',
        text: 'It is restored as law after the Flash when the Projection Dome reinstalls black-sky cosmology.',
        isCorrect: false,
        rationale:
          'The Flash removes overlays and NPCs; it does not reinstall Evolution as law.',
      },
      {
        label: 'D',
        text: 'It is a manufactured lie — biological vessels are engineered and upgraded via genetic synthesis in higher densities, not through random mutation.',
        isCorrect: true,
        rationale:
          'No natural-selection climb; vessels are lab-engineered and upgraded in higher densities.',
      },
    ],
    hint: 'Evolution is a lie — lab genetic synthesis upgrades vessels.',
    correctAnswer: 'D',
  },
  {
    number: 13,
    question: 'Who are the Custodians in this revelation, and what did they do?',
    options: [
      {
        label: 'A',
        text: 'Once-benevolent 12th-density caretakers who inverted the realm, engineered predatory proxy species (Anuk, Omicron, Grey ET), and established a global loosh-harvesting matrix.',
        isCorrect: true,
        rationale:
          'Custodians fell from 12th-density caretaking into inversion, proxy species, and loosh harvest.',
      },
      {
        label: 'B',
        text: 'The G.A.A. under another name, already switching off every overlay since the Dark Ages.',
        isCorrect: false,
        rationale:
          'G.A.A. is the benevolent coalition; Custodians are the inverters of the realm.',
      },
      {
        label: 'C',
        text: 'Only human librarians who never engineered proxy species or harvested loosh.',
        isCorrect: false,
        rationale:
          'They engineered predatory proxies and built the loosh-harvesting matrix at planetary scale.',
      },
      {
        label: 'D',
        text: 'NPC factory workers with no density ranking and no role in occupation architecture.',
        isCorrect: false,
        rationale:
          'They were 12th-density caretakers who inverted the occupation architecture.',
      },
    ],
    hint: 'Fallen 12th-density caretakers — inversion, proxies, loosh matrix.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question: 'What does the healthcare-system revelation expose about pandemic protocols?',
    options: [
      {
        label: 'A',
        text: 'That empty hospitals never existed and all staff refused lethal protocols under pure ethics.',
        isCorrect: false,
        rationale:
          'Medical staff universally participated in lethal pandemic protocols within empty hospitals.',
      },
      {
        label: 'B',
        text: 'Genocidal compliance — medical staff universally participated in lethal pandemic protocols within empty hospitals, suppressing cognitive dissonance for public applause and financial gain.',
        isCorrect: true,
        rationale:
          'Healthcare genocidal compliance: empty hospitals, lethal protocols, applause-and-pay silence.',
      },
      {
        label: 'C',
        text: 'That the EBS will praise healthcare leaders as the sole heroes of the 178,000-year cycle.',
        isCorrect: false,
        rationale:
          'EBS details satanic crimes and institutional complicity — not hero medals for genocidal compliance.',
      },
      {
        label: 'D',
        text: 'That hospitals already taught flat-Earth firmament science as mandatory staff training.',
        isCorrect: false,
        rationale:
          'The exposure is genocidal protocol compliance, not secret firmament curriculum.',
      },
    ],
    hint: 'Empty hospitals — lethal protocols for applause and money.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question: 'Why must belief in external savior deities be entirely uninstalled?',
    options: [
      {
        label: 'A',
        text: 'Because savior deities already banned all child sacrifice and need only minor brand updates.',
        isCorrect: false,
        rationale:
          'Those constructs subdued cognition; devout face collapse when deities are tied to millennia of child sacrifice.',
      },
      {
        label: 'B',
        text: 'Because Finance alone requires prayer to stabilize savings during the Fake Alien Invasion.',
        isCorrect: false,
        rationale:
          'Religion is its own String; savior belief is the cognitive subservience trap to cut.',
      },
      {
        label: 'C',
        text: 'Constructs designed to subdue cognition and enforce energetic subservience — devout followers face extreme psychological collapse upon learning their deities authorized millennia of child sacrifice.',
        isCorrect: true,
        rationale:
          'Uninstall Religion: savior constructs subdue the mind; sacrifice truth triggers collapse if still attached.',
      },
      {
        label: 'D',
        text: 'Because the G.A.A. will appoint one official planet-wide deity after the Flash as law.',
        isCorrect: false,
        rationale:
          'Liberation removes external savior dependence; it does not install a new official deity.',
      },
    ],
    hint: 'Savior constructs subdue cognition — collapse when sacrifice truth hits.',
    correctAnswer: 'C',
  },
  {
    number: 16,
    question: 'How does the Finance String bind consciousness?',
    options: [
      {
        label: 'A',
        text: 'By teaching free manifestation so no one needs savings or synthetic survival planning.',
        isCorrect: false,
        rationale:
          'Pursuit of wealth and savings binds consciousness to a synthetic survival mechanism.',
      },
      {
        label: 'B',
        text: 'By permanently deleting money before any Scare Event so no distraction can exist.',
        isCorrect: false,
        rationale:
          'The bind is active pursuit of wealth/savings distracting from imminent monetary-system collapse.',
      },
      {
        label: 'C',
        text: 'By funding only G.A.A. membership fees as the single allowed financial thoughtform.',
        isCorrect: false,
        rationale:
          'Finance is a matrix tether to sever, not a G.A.A. dues system.',
      },
      {
        label: 'D',
        text: 'Pursuit of wealth and savings binds consciousness to a synthetic survival mechanism, distracting from the imminent collapse of the monetary control system.',
        isCorrect: true,
        rationale:
          'Finance String = wealth/savings obsession as distraction from monetary control collapse.',
      },
    ],
    hint: 'Wealth/savings bind — distract from monetary control collapse.',
    correctAnswer: 'D',
  },
  {
    number: 17,
    question: 'What must happen to Perceived Knowledge during the awakening?',
    options: [
      {
        label: 'A',
        text: 'The entire spectrum of learned intellect — from academia to mainstream disclosure movements — is an egoic shield; awakening demands humility to accept that every established truth is a deliberate falsehood.',
        isCorrect: true,
        rationale:
          'Perceived Knowledge is ego armor; humility means admitting every established truth was deliberate falsehood.',
      },
      {
        label: 'B',
        text: 'Mainstream disclosure movements alone are kept intact as the only trustworthy intellectual source.',
        isCorrect: false,
        rationale:
          'Even mainstream disclosure is named inside the egoic shield of learned intellect to release.',
      },
      {
        label: 'C',
        text: 'University degrees become the ticket to survive the Flash while NPC removal skips all graduates.',
        isCorrect: false,
        rationale:
          'Intellectual pride is the trap; Flash removal targets the 97% NPC matrix, not a degree hierarchy of safety.',
      },
      {
        label: 'D',
        text: 'Copernicus must be cited more loudly so the spinning globe can survive dome removal.',
        isCorrect: false,
        rationale:
          'True shape baseline rejects the globe; Perceived Knowledge defending it is the shield to drop.',
      },
    ],
    hint: 'Egoic intellect shield — every established truth is deliberate falsehood.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question: 'What technology fundamentally allowed unrestricted free access to awakening truth?',
    options: [
      {
        label: 'A',
        text: 'Only sealed museum basements with no digital path outside compromised mainstream channels.',
        isCorrect: false,
        rationale:
          'Global Wi-Fi and social media allowed unrestricted free access outside compromised mainstream channels.',
      },
      {
        label: 'B',
        text: 'The advent of global Wi-Fi and social media — unrestricted free access to truth outside compromised mainstream channels.',
        isCorrect: true,
        rationale:
          'Wi-Fi + social media = the dissemination path for awakening intelligence beyond mainstream capture.',
      },
      {
        label: 'C',
        text: 'Exclusive EBS rehearsals on cable news that never mentioned satanic crimes or sacrifice.',
        isCorrect: false,
        rationale:
          'EBS is forthcoming unmitigated crime broadcast; pre-awakening truth spread via Wi-Fi/social media.',
      },
      {
        label: 'D',
        text: 'Paper-only Dark Ages curricula reissued by Custodians as the sole allowed medium.',
        isCorrect: false,
        rationale:
          'Compromised mainstream/old curricula are what Wi-Fi routes around.',
      },
    ],
    hint: 'Global Wi-Fi and social media — truth outside mainstream capture.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question: 'How does the Scare Event sequence begin and escalate before the Flash?',
    options: [
      {
        label: 'A',
        text: 'It begins with free med-beds for all NPCs and ends with debt forgiveness parties only.',
        isCorrect: false,
        rationale:
          'Sequence: EBS of global satanism, then Fake Alien Invasion (Bluebeam), peak-fear to peak-fear.',
      },
      {
        label: 'B',
        text: 'It skips EBS entirely and only runs a quiet firmament seminar with no panic design.',
        isCorrect: false,
        rationale:
          'Scare Events are highly traumatic by design — EBS then Bluebeam mass panic.',
      },
      {
        label: 'C',
        text: 'Initiates with EBS broadcasting undeniable global satanism (rendering religious and political institutions obsolete), then Fake Alien Invasion via Project Bluebeam — craft levitating and abducting civilians, triggering bleed-through memories of ancient reset trauma.',
        isCorrect: true,
        rationale:
          'EBS → Bluebeam invasion panic and reset-trauma bleed-through → toward the EMF climax.',
      },
      {
        label: 'D',
        text: 'It only reinstalls the Amnesia Vortex so no one remembers EBS or Bluebeam afterward.',
        isCorrect: false,
        rationale:
          'Amnesia Vortex is already dismantled; Scare Events hardwire memory into soul-architecture.',
      },
    ],
    hint: 'EBS satanism reveal → Bluebeam invasion panic → toward Flash.',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question: 'What population outcome does the 30-second EMF Flash produce?',
    options: [
      {
        label: 'A',
        text: 'All 8 billion remain embodied with NPCs promoted to G.A.A. leadership overnight.',
        isCorrect: false,
        rationale:
          'Over 30 seconds, 97% (NPCs) permanently disintegrate; about 520 million genuine souls remain.',
      },
      {
        label: 'B',
        text: 'Only 3% leave and 97% genuine souls stay to manage empty hospitals forever.',
        isCorrect: false,
        rationale:
          '97% NPCs are removed; ~520 million genuine souls remain — not the reverse.',
      },
      {
        label: 'C',
        text: 'No population change — only television sets pixelate while bodies stay untouched.',
        isCorrect: false,
        rationale:
          'The Flash permanently disintegrates 97% of the planetary population.',
      },
      {
        label: 'D',
        text: 'Permanently disintegrates 97% of the planetary population (NPCs), leaving only approximately 520 million genuine souls.',
        isCorrect: true,
        rationale:
          '30-second Flash: 97% NPCs gone; ~520 million genuine souls remain.',
      },
    ],
    hint: '97% NPCs disintegrate — ~520 million genuine souls remain.',
    correctAnswer: 'D',
  },
  {
    number: 21,
    question: 'What does the G.A.A. do to the sky at the climax alongside the Flash?',
    options: [
      {
        label: 'A',
        text: 'Switches off the Projection Dome inside the firmament — fabricated black sky pixelates and dissolves, revealing the bright white reality of the true dark matter field.',
        isCorrect: true,
        rationale:
          'Dome off inside firmament → black sky pixelates → bright white dark-matter field revealed.',
      },
      {
        label: 'B',
        text: 'Paints the dome darker so the spinning globe model becomes visually mandatory forever.',
        isCorrect: false,
        rationale:
          'The dome is switched off; black-sky fabrication dissolves, not deepens.',
      },
      {
        label: 'C',
        text: 'Leaves the dome on and only reboots cable news without any pixelation of the sky.',
        isCorrect: false,
        rationale:
          'Sky dissolution and pixelation are core climax mechanics with the Flash.',
      },
      {
        label: 'D',
        text: 'Replaces the firmament with open vacuum so ice walls become irrelevant overnight.',
        isCorrect: false,
        rationale:
          'The firmament remains; the Projection Dome inside it is what shuts off.',
      },
    ],
    hint: 'Projection Dome off — black sky pixelates, bright white dark matter shows.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question: 'Who are Taran Souls and the 4,000 Ancient Souls in this extraction?',
    options: [
      {
        label: 'A',
        text: 'NPCs rebranded after the Flash with no prior incarnation trauma or node work.',
        isCorrect: false,
        rationale:
          'Taran souls endured hundreds of trauma/amnesia/sacrifice cycles; 4,000 Ancients anchor frequencies at Nodes.',
      },
      {
        label: 'B',
        text: 'Genuine humans (Taran Souls) who endured hundreds of life cycles of trauma, amnesia, and sacrifice; aided by 4,000 Ancient Souls who incarnated to anchor harmonic frequencies at major planetary Nodes and resist authority.',
        isCorrect: true,
        rationale:
          'Taran = multi-cycle genuine humans; 4,000 Ancients = node frequency anchors and authority resistance.',
      },
      {
        label: 'C',
        text: 'Only Custodian proxies such as Anuk and Greys tasked with keeping loosh flowing after liberation.',
        isCorrect: false,
        rationale:
          'Those are predatory proxies of the inversion; Tarans and Ancients are on the extraction side.',
      },
      {
        label: 'D',
        text: 'Finance String accountants who never incarnated near Nodes or harmonic work.',
        isCorrect: false,
        rationale:
          'This is soul-family extraction architecture, not accounting roles.',
      },
    ],
    hint: 'Taran multi-cycle humans + 4,000 Ancients anchoring Nodes.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question: 'Why is the severe trauma of Scare Events a calculated essential mechanism?',
    options: [
      {
        label: 'A',
        text: 'To entertain NPCs so they stay embodied after the Flash without any soul-architecture change.',
        isCorrect: false,
        rationale:
          'Trauma hardwires deception-memory into surviving soul-architecture so it never happens again.',
      },
      {
        label: 'B',
        text: 'To reinstall the Amnesia Vortex so eternity can begin with full forgetfulness again.',
        isCorrect: false,
        rationale:
          'Opposite: hardwire permanent memory of the deception across the remainder of eternity.',
      },
      {
        label: 'C',
        text: 'Shock and terror of EBS, Bluebeam, and sky dissolution hardwire the memory of this deception permanently into soul-architecture of survivors — so throughout eternity they never again succumb to deceit, sell soul architecture, or allow parasitic inversion.',
        isCorrect: true,
        rationale:
          'Calculated branding: survivors never forget, never sell soul architecture, never allow another inversion.',
      },
      {
        label: 'D',
        text: 'To prove med-beds and debt forgiveness were the real point of the 178,000-year cycle.',
        isCorrect: false,
        rationale:
          'Scare Events serve eternal anti-deception hardwiring, not med-bed/debt narratives.',
      },
    ],
    hint: 'Hardwire deception-memory into soul-architecture for eternity.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question: 'How will the 178,000 years of accumulated soul memory be restored after the Flash?',
    options: [
      {
        label: 'A',
        text: 'All at once in a single second to maximize fatal neurological overload by design.',
        isCorrect: false,
        rationale:
          'Accessed sequentially rather than instantaneously to prevent fatal neurological or psychological overload.',
      },
      {
        label: 'B',
        text: 'Never — survivors remain under full amnesia with the Vortex rebuilt by Custodians.',
        isCorrect: false,
        rationale:
          'Memory restoration occurs; the Vortex is already dismantled and the hierarchy is gone.',
      },
      {
        label: 'C',
        text: 'Only through university night classes graded by pre-Flash experts still citing the globe.',
        isCorrect: false,
        rationale:
          'Restoration is soul-memory access for survivors free of the NPC matrix — not schooled globe dogma.',
      },
      {
        label: 'D',
        text: 'Sequentially rather than instantaneously — preventing fatal neurological or psychological overload while survivors are free of the NPC matrix, amnesia vortex, and parasitic hierarchy.',
        isCorrect: true,
        rationale:
          'Sequential memory return protects the psyche; 3% remain free of NPC/amnesia/parasite stack.',
      },
    ],
    hint: 'Memory returns sequentially — avoid fatal overload.',
    correctAnswer: 'D',
  },
  {
    number: 25,
    question: 'What does the awakening ultimately restore for surviving Taran humans?',
    options: [
      {
        label: 'A',
        text: 'Unification with true cosmic Soul Families outside the ice wall — instantaneous manifestation, telepathic communication, and rightful place in higher densities with time dilation, scarcity, and artificial density suppression removed.',
        isCorrect: true,
        rationale:
          'Soul Families, manifestation, telepathy, higher-density standing — free of time dilation, scarcity, density suppression.',
      },
      {
        label: 'B',
        text: 'Permanent return to peak-fear Scare Events with no Soul Family contact ever allowed.',
        isCorrect: false,
        rationale:
          'Scare Events end in liberation and Soul Family reunion, not endless peak-fear loops.',
      },
      {
        label: 'C',
        text: 'Only stronger Finance and Religion Strings under a new official global savior bank.',
        isCorrect: false,
        rationale:
          'Strings are severed; survivors ascend beyond monetary and savior control systems.',
      },
      {
        label: 'D',
        text: 'Exclusive NPC status with herd-consensus narratives as the highest density available.',
        isCorrect: false,
        rationale:
          'NPCs are removed; survivors are genuine Taran souls reclaiming higher-density capacities.',
      },
    ],
    hint: 'Soul Families · manifestation · telepathy · higher densities restored.',
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
  'Test your grasp of Spiritual Awakening — Three Strings, Scare Events, EMF Flash, G.A.A., and the end of the 178,000-year occupation.';
const DESC_META =
  'Interactive Living Truth Quiz on Spiritual Awakening: flat Earth baseline, Tartaria, Custodians, EBS, Project Bluebeam, 520 million survivors, and Soul Family restoration.';

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
      'The Great Spiritual Awakening is not med-beds, debt theater, or party politics. It is the high-velocity uninstallation of a 178,000-year occupation. Sever Religion, Finance, and Perceived Knowledge. Take the flat plain, ice wall, and Firmament as the first step. See Tartaria under the fake timeline. Watch healthcare genocidal compliance without flinching. Wi-Fi opened the pipe; EBS, Bluebeam, and the 30-second Flash close the matrix. Ninety-seven percent NPC density ends. About 520 million genuine souls remain. The Projection Dome dies; bright white dark matter shows. Memory returns in sequence. Soul Families wait beyond the ice wall. Hardwire this so eternity never buys the lie again.',
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
console.log('PASS: audited 25/25 against data/alice-topics/spiritual-awakening.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
