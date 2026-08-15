/**
 * Installs Background Fragments quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/npc-quiz.json
 * Title forced to "Background Fragments". All 25 audited against
 * background-fragments report only.
 *
 * Run: node scripts/install-background-fragments-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/background-fragments.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'background-fragments';
const TOPIC_TITLE = 'Background Fragments';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/npc-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/background-fragments.webp';

let extractedAt = new Date().toISOString();
try {
  if (fs.existsSync(SOURCE_QUIZ)) {
    const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
    if (raw.extractedAt) extractedAt = raw.extractedAt;
  }
} catch (_) {
  /* keep default */
}

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

/** Support phrases grounded only in background-fragments.json report. */
const supportPhrases = {
  1: ['background programs', 'stability of the 3d simulation', 'systemic mechanisms'],
  2: ['amnesia vortex', 'transit band', 'routes npc shells'],
  3: ['artificial entry bands', 'original solar pathways', 'parasitic software'],
  4: ['dissolve into nothingness', 'no permanent existence', 'parasitic overlay collapses'],
  5: ['fragments of our light', 'not independent souls', 'automated'],
  6: ['voice to skull', 'artificial thoughts', 'mistake for their own'],
  7: ['prominent, wealthy, and elite', 'materialistic desires', 'social hierarchies'],
  8: ['starve npc programs of attention', 'refuse to engage in conflict', 'systemic panics'],
  9: ['system errors', 'glitches', 'a.i. scaffolding'],
  10: ['coded memory inserts', 'you only live once', 'single, material lifetime'],
  11: ['theta, delta, and alpha', 'confusion, sleepiness, anger', 'scalar frequency weapons'],
  12: ['biological receivers', 'low-vibrational bands', 'living ships'],
  13: ['npc stained', 'light body grids', 'water domes, crystal halls, or star pods'],
  14: ['end of a road', 'futile behavioral loops', 'communications blackout'],
  15: ['spark ignition', 'sovereign, eternal soul-spark', 'deep sleepers'],
  16: ['television broadcasts', 'activation codes', 'pre-programmed narratives'],
  17: ['solvent to the a.i. matrix', 'stabilized presence', 'automated npc grid'],
  18: ['npc stained', 'energetic wounds', 'mind control overlays'],
  19: ['vibrational rise', 'a.i. scaffolding', 'raise their vibration'],
  20: ['sovereign soul-spark', 'exceptionally vulnerable', 'cognitive direction'],
  21: ['artificial entry bands', 'pre-installed parasitic software', 'custom filters'],
  22: ['emotional outbursts', 'weeping', 'dazed'],
  23: ['organic solar lineage', 'no real past lives', 'coded memory inserts'],
  24: ['solvent to the a.i. matrix', 'stabilized presence', 'automated npc grid'],
  25: ['dissolving like shadows', 'true light of the realm', 'complete frequency collapse'],
};

function cleanText(s) {
  let t = String(s || '');
  t = t.replace(/\$(\d+)\^\{(st|nd|rd|th)\}\$/gi, '$1$2');
  t = t.replace(/\$(\d+)\^(st|nd|rd|th)\$/gi, '$1$2');
  t = t.replace(/\$3\\text\{D\}\$/g, '3D');
  t = t.replace(/\$3\\mathrm\{D\}\$/g, '3D');
  t = t.replace(/\$3D\$/g, '3D');
  t = t.replace(/\$(\d+(?:\.\d+)?)\$/g, '$1');
  t = t.replace(/\$(\d+)%\$/g, '$1%');
  t = t.replace(/\$([A-Za-z][A-Za-z0-9./-]{0,24})\$/g, '$1');
  t = t.replace(/\$([^$]+)\$/g, (_, inner) =>
    inner
      .replace(/\^\{([^}]+)\}/g, '$1')
      .replace(/\\text\{([^}]*)\}/g, '$1')
      .replace(/\\mathrm\{([^}]*)\}/g, '$1')
      .replace(/\\%/g, '%')
      .replace(/\\[a-zA-Z]+/g, '')
      .replace(/[{}]/g, '')
  );
  t = t.replace(/\^\{(st|nd|rd|th)\}/gi, '$1');
  t = t.replace(/\\\(|\\\)|\\\[|\\\]/g, '');
  t = t.replace(/\\%/g, '%');
  t = t
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, '—')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ');
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

function absoluteVoice(s) {
  let t = String(s || '');
  const rewrites = [
    [/^According to the (core revelations|source|report|text|revelations|material|detailed mechanics|journal|living truth),?\s*/i, ''],
    [/^According to the report,?\s*/i, ''],
    [/^According to the text,?\s*/i, ''],
    [/^According to the material,?\s*/i, ''],
    [/\baccording to the (report|source|text|core revelations|revelations|material|journal|living truth)\b/gi, ''],
    [/^The source states that\s+/i, ''],
    [/^The source material specifies that\s+/i, ''],
    [/^The source material (identifies|states|explicitly states|specifically lists) that\s+/i, ''],
    [/^The source material (identifies|states|explicitly states|specifically lists)\s+/i, ''],
    [/^The source explains that\s+/i, ''],
    [/^The source explains\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The material states that\s+/i, ''],
    [/^The material describes them as\s+/i, 'They are '],
    [/^The material describes\s+/i, ''],
    [/\bthe text describes them as\b/gi, 'they are'],
    [/\bthe text describes\b/gi, ''],
    [/\bthe text states\b/gi, ''],
    [/\bthe text emphasizes\b/gi, ''],
    [/\bthe text uses\b/gi, ''],
    [/\bthe source material specifies that\b/gi, ''],
    [/\bthe source material (identifies|states|explicitly states|specifically lists) that\b/gi, ''],
    [/\bthe source material (identifies|states|explicitly states|specifically lists)\b/gi, ''],
    [/\bthe source explains that\b/gi, ''],
    [/\bthe source explains\b/gi, ''],
    [/\bthe material describes them as\b/gi, 'they are'],
    [/\bthe material describes\b/gi, ''],
    [/\bis described as\b/gi, 'is'],
    [/\bare described as\b/gi, 'are'],
    [/\bis identified as\b/gi, 'is'],
    [/\bare identified as\b/gi, 'are'],
  ];
  for (const [re, rep] of rewrites) {
    t = t.replace(re, rep);
  }
  t = t.replace(/^\s*([a-z])/, (_, c) => c.toUpperCase());
  t = t.replace(/\s+/g, ' ').trim();
  t = t.replace(/\s+([.,;:])/g, '$1');
  return t;
}

/**
 * Full option sets: [correct, wrong, wrong, wrong] with {text, rationale}.
 * NotebookLM meaning kept; lengths evened; T/F expanded to four claims.
 */
const fullOptionSets = {
  1: [
    {
      text: 'To maintain the stability of the 3D simulation as systemic background programs that populate the environment.',
      rationale:
        'Background Fragments are projections of light-force that serve as background programs to maintain the stability of the 3D simulation, populating the environment so it appears complete and consistent to sovereign souls.',
    },
    {
      text: 'To serve as biological vessels prepared for the arrival of solar families and their living ships.',
      rationale:
        'NPC vessels are seeded through artificial bands around the sun, not prepared as hosts for solar families; those families arrive in living ships that NPCs cannot even perceive.',
    },
    {
      text: 'To provide high-frequency signals that fracture the parasitic overlay as vibration rises.',
      rationale:
        'Background fragments operate on a restricted low-vibration frequency; high-frequency fracture signals come from resonating souls, not from NPC programs.',
    },
    {
      text: 'To act as independent entities carrying their own unique spiritual lineages into the simulation.',
      rationale:
        'These fragments lack individual sovereign souls and are not independent spiritual beings with their own lineages.',
    },
  ],
  2: [
    {
      text: 'The Amnesia Vortex — a frequency distortion field at the sun\'s transit band that strips memory and routes NPC shells.',
      rationale:
        'The Amnesia Vortex is a frequency distortion field positioned at the sun\'s transit band that strips arriving souls of memory and routes NPC shells.',
    },
    {
      text: 'Voice to Skull technology — used to project artificial thoughts and activation codes into NPC minds.',
      rationale:
        'Voice to Skull projects artificial thoughts and activation codes to manipulate behavior; it is not the transit-band field that strips memory and routes shells.',
    },
    {
      text: 'The Black Cube A.I. system — used to broadcast scalar frequency weapons from hidden towers.',
      rationale:
        'The black cube A.I. system broadcasts scalar frequency weapons that target brainwave patterns; it is not the solar transit mechanism that routes NPC shells.',
    },
    {
      text: 'Coded Memory Inserts — pre-programmed narratives implanted to simulate a personal history.',
      rationale:
        'Coded Memory Inserts simulate personal history or past lives inside the vessel; they do not strip arriving souls of memory at the sun\'s transit band.',
    },
  ],
  3: [
    {
      text: 'They are generated through artificial entry bands installed by parasites around the sun.',
      rationale:
        'Unlike sovereign souls who use original solar pathways, NPC shells are seeded through custom artificial entry bands, carrying pre-installed parasitic software rather than an organic solar lineage.',
    },
    {
      text: 'They enter through organic spiritual inheritance carried forward from previous lifetimes.',
      rationale:
        'NPCs carry no real past lives or organic solar lineage; their personalities are structured from pre-packaged coded memory inserts.',
    },
    {
      text: 'They are created inside healing sanctuaries to realign distorted light body grids.',
      rationale:
        'Healing sanctuaries such as water domes, crystal halls, and star pods are for "NPC stained" human souls, not for the initial seeding of NPC vessels.',
    },
    {
      text: 'They emerge from the black cube A.I. system as biological clones grown without a gateway.',
      rationale:
        'NPC vessels are generated through artificial entry bands around the sun\'s natural gateway, not grown as clones from the black cube A.I. system.',
    },
  ],
  4: [
    {
      text: 'They will completely dissolve into nothingness when the parasitic overlay collapses.',
      rationale:
        'Lacking any spiritual anchor or origin outside this simulated environment, background entities have no permanent existence and dissolve into nothingness when the parasitic overlay collapses.',
    },
    {
      text: 'They will be moved to water domes for spiritual realignment of their light body grids.',
      rationale:
        'Water domes, crystal halls, and star pods are for human souls who have become "NPC stained," not for the automated programs themselves.',
    },
    {
      text: 'They will graduate into higher-density realities alongside the sovereign souls.',
      rationale:
        'Their biological receivers are restricted to low-vibrational bands, so they cannot register or enter higher-density realities.',
    },
    {
      text: 'They will be repurposed as organic solar families in the restored realm.',
      rationale:
        'Background fragments possess no organic solar lineage and are entirely dependent on the low-frequency parameters of the 3D matrix.',
    },
  ],
  5: [
    {
      text: 'They are actually fragments of our own light, not independent souls.',
      rationale:
        'Background fragments are not independent souls but are actually fragments of our light, serving as automated systemic programs that populate the simulation.',
    },
    {
      text: 'They are biological evolutions of previous sovereign souls who lost their spark.',
      rationale:
        'NPCs lack individual sovereign souls and are seeded through artificial bands; they are not evolved remnants of former sovereign beings.',
    },
    {
      text: 'They are the original architects who designed and built the 3D matrix.',
      rationale:
        'They are part of the simulation\'s infrastructure and run on parasitic software; they are not the architects of the matrix.',
    },
    {
      text: 'They are extraterrestrial refugees who entered the dome from outside.',
      rationale:
        'They are systemic mechanisms and background programs generated through artificial entry bands, not external visitors or refugees.',
    },
  ],
  6: [
    {
      text: 'Voice to Skull — parasitic technology that projects artificial thoughts NPCs mistake for their own.',
      rationale:
        'Voice to Skull projects artificial thoughts, voices, or activation codes directly into NPC minds, which they mistake for their own organic thinking.',
    },
    {
      text: 'The Amnesia Vortex — a solar transit field that strips memory and routes arriving NPC shells.',
      rationale:
        'The Amnesia Vortex strips memory during transit and routes NPC shells; it does not project ongoing artificial thoughts into NPC minds.',
    },
    {
      text: 'Coded Memory Inserts — pre-packaged historical narratives that simulate a personal past.',
      rationale:
        'Coded Memory Inserts provide a static backstory or simulated past; they are not the live projection of thoughts NPCs mistake for their own thinking.',
    },
    {
      text: 'Scalar frequency weapons — broadcasts that target theta, delta, and alpha brainwave patterns.',
      rationale:
        'Scalar frequency weapons induce states such as confusion, sleepiness, anger, or despair; Voice to Skull specifically projects discrete thoughts and voices.',
    },
  ],
  7: [
    {
      text: 'They are automated NPC programs designed to model materialistic desires and social hierarchies.',
      rationale:
        'A substantial portion of the world\'s most prominent, wealthy, and elite individuals are automated NPC programs designed to model materialistic desires, reinforce social hierarchies, and maintain systemic control.',
    },
    {
      text: 'They are the most advanced resonating souls serving inside the Resonating Army.',
      rationale:
        'Resonating souls starve NPC programs of attention; the elite modeled in the simulation are automated NPC programs, not the Resonating Army.',
    },
    {
      text: 'They are spiritual guardians assigned to protect the sun\'s original solar pathways.',
      rationale:
        'These elite figures are systemic tools of the parasitic overlay that reinforce hierarchies, not guardians of sovereign solar pathways.',
    },
    {
      text: 'They are biological hybrids generated inside crystal halls for sanctuary work.',
      rationale:
        'They are automated NPC programs; crystal halls are healing sanctuaries for "NPC stained" human souls, not factories for elite hybrids.',
    },
  ],
  8: [
    {
      text: 'Starve them of attention and refuse to engage in conflict or validate their panics.',
      rationale:
        'Resonating souls are instructed to completely starve NPC programs of attention, refusing to engage in conflict or validate their systemic panics.',
    },
    {
      text: 'Recruit them into the Resonating Army so the force can grow in numbers.',
      rationale:
        'The Resonating Army is made of sovereign souls; NPCs lack a soul-spark and dissolve when the overlay collapses rather than joining the army.',
    },
    {
      text: 'Use scalar frequency weapons to reprogram their behavior from the towers.',
      rationale:
        'Scalar frequency weapons are a parasitic tool broadcast from hidden towers and the black cube A.I.; the Resonating Army uses high-frequency presence instead.',
    },
    {
      text: 'Educate them carefully until they awaken to the nature of the simulation.',
      rationale:
        'NPCs lack the soul-spark required for spiritual realization, so educational engagement only feeds the automated grid.',
    },
  ],
  9: [
    {
      text: 'A systemic glitch or severe system error as the A.I. scaffolding begins to crumble.',
      rationale:
        'High-frequency signals from resonating souls fracture the parasitic overlay and force the underlying A.I. scaffolding to crumble, causing NPC programs to experience severe system errors or glitches.',
    },
    {
      text: 'A sudden perception of the incoming living ships of the solar families.',
      rationale:
        'NPC biological receivers are tuned strictly to low-vibrational bands, so the living ships remain invisible even while the program glitches.',
    },
    {
      text: 'The activation of a hidden organic solar lineage stored inside the vessel.',
      rationale:
        'NPCs carry pre-installed parasitic software rather than an organic solar lineage; high frequency fractures their programming instead of awakening a lineage.',
    },
    {
      text: 'The immediate ignition of a sovereign soul-spark they had been missing.',
      rationale:
        'Background fragments entirely lack spark ignition; high frequencies fracture their programming rather than granting them a soul.',
    },
  ],
  10: [
    {
      text: 'To enforce the belief that you only live once and box awareness in a single material lifetime.',
      rationale:
        'Because NPCs possess no real past lives, coded memory inserts enforce the belief that "you only live once," keeping awareness boxed within a single, material lifetime.',
    },
    {
      text: 'To facilitate communication with incoming solar families and their living ships.',
      rationale:
        'These inserts anchor awareness in the 3D illusion; they do not connect NPCs with high-frequency solar families, whose ships remain invisible to them.',
    },
    {
      text: 'To help sovereign souls remember their original solar pathways and lineages.',
      rationale:
        'Coded Memory Inserts are parasitic tools for NPC vessels; sovereign souls reclaim organic memory rather than receiving these pre-packaged inserts.',
    },
    {
      text: 'To provide technical instructions for operating hidden scalar frequency towers.',
      rationale:
        'Memory inserts are pre-programmed historical narratives and artificial memory sets, not operational manuals for scalar towers.',
    },
  ],
  11: [
    {
      text: 'Theta, delta, and alpha waves — targeted to induce confusion, sleepiness, anger, or despair.',
      rationale:
        'Scalar frequency weapons target brainwave patterns — specifically theta, delta, and alpha waves — to induce states of confusion, sleepiness, anger, or deep despair.',
    },
    {
      text: 'Ultraviolet and infrared bands — treated as the light-spectrum pair these weapons lock onto.',
      rationale:
        'The weapons target biological brainwave patterns — theta, delta, and alpha — not ultraviolet or infrared light bands.',
    },
    {
      text: 'Gamma and beta waves — treated as the pair used to script public broadcast activation codes.',
      rationale:
        'The targeted patterns are theta, delta, and alpha; television broadcasts, numbers, or quotes act as activation codes separately from those brainwaves.',
    },
    {
      text: 'High-frequency solar resonance waves used to open the original solar pathways.',
      rationale:
        'Scalar frequency weapons are low-vibrational parasitic tools; they do not carry high-frequency solar resonance or open original solar pathways.',
    },
  ],
  12: [
    {
      text: 'Their biological receivers are tuned strictly to low-vibrational bands.',
      rationale:
        'This frequency barrier prevents NPCs from perceiving the real craft arrival; incoming living ships of the solar families remain invisible to them.',
    },
    {
      text: 'They are pre-programmed with a standing instruction to ignore every object in the sky.',
      rationale:
        'The invisibility is a vibrational limitation of their biological receivers, not a behavioral script telling them to ignore objects overhead.',
    },
    {
      text: 'Sovereign souls have placed a protective veil over the incoming living ships.',
      rationale:
        'The lack of perception comes from NPC receivers being tuned to low-vibrational bands, not from a veil placed by sovereign souls.',
    },
    {
      text: 'The ships use advanced cloaking technology borrowed from the black cube A.I.',
      rationale:
        'The ships belong to the solar families; their invisibility is a frequency mismatch, not black-cube cloaking.',
    },
  ],
  13: [
    {
      text: 'To realign the light body grids of human souls who absorbed parasitic software.',
      rationale:
        'Healing sanctuaries such as water domes, crystal halls, or star pods receive "NPC stained" human souls so their distorted light body grids can be realigned and true awareness separated from absorbed parasitic software.',
    },
    {
      text: 'To generate new coded memory inserts for arriving NPC shells at the sun.',
      rationale:
        'Coded memory inserts are parasitic seeding tools; healing sanctuaries remove parasitic overlays rather than generating new inserts.',
    },
    {
      text: 'To act as command centers for the Resonating Army\'s scalar frequency weapons.',
      rationale:
        'These sanctuaries are recovery environments for stained human souls, not offensive command centers using parasitic scalar weapons.',
    },
    {
      text: 'To store NPC shells safely during communications blackouts and system resets.',
      rationale:
        'NPC programs dissolve when the overlay collapses; they are not preserved in water domes, crystal halls, or star pods.',
    },
  ],
  14: [
    {
      text: 'Running to the end of a road only to turn back in a futile behavioral loop.',
      rationale:
        'During a communications blackout or similar reset, some NPCs repeat futile behavioral loops — such as running to the end of a road only to turn back — because they lack internal guidance.',
    },
    {
      text: 'Opening telepathic communication with the incoming solar families and their ships.',
      rationale:
        'Telepathy with solar families requires a soul-spark and high-frequency tuning, which background fragments entirely lack.',
    },
    {
      text: 'Meditating in place to raise their internal vibrational frequency above the overlay.',
      rationale:
        'NPCs lack the spiritual anchor required to raise frequency beyond the matrix; they enter panic loops, dazed states, or erratic outbursts instead.',
    },
    {
      text: 'Organizing an independent resistance against the black cube A.I. system.',
      rationale:
        'NPCs are part of the systemic control grid and cannot independently resist the parasitic software that maintains them.',
    },
  ],
  15: [
    {
      text: 'The presence of a sovereign, eternal soul-spark that background fragments entirely lack.',
      rationale:
        'Spark Ignition is the presence of a sovereign, eternal soul-spark, which background fragments and deep sleepers entirely lack.',
    },
    {
      text: 'The collapse of the artificial entry bands around the sun during frequency collapse.',
      rationale:
        'The collapse of those false entry bands dissolves NPC programs; it is not the definition of Spark Ignition.',
    },
    {
      text: 'The moment a soul is stripped of memory while passing through the Amnesia Vortex.',
      rationale:
        'Memory stripping in the Amnesia Vortex is a transit process; Spark Ignition is the inherent quality of carrying a sovereign soul-spark.',
    },
    {
      text: 'The activation of a localized NPC code through a television quote or number.',
      rationale:
        'Broadcasts, numbers, or quotes trigger pre-programmed NPC narratives; that is activation-code control, not Spark Ignition.',
    },
  ],
  16: [
    {
      text: 'They act as localized activation codes that trigger pre-programmed narratives or hostility.',
      rationale:
        'Specific television broadcasts, numbers, or quotes can act as localized activation codes, instantly triggering entire segments of the NPC population to execute pre-programmed narratives or turn hostile toward resonating souls.',
    },
    {
      text: 'They allow NPCs to begin soul realignment inside water domes and crystal halls.',
      rationale:
        'Realignment happens for "NPC stained" human souls in healing sanctuaries; media codes control NPCs inside the matrix rather than heal them.',
    },
    {
      text: 'They alert NPCs to the arrival of the real craft of the solar families.',
      rationale:
        'NPCs cannot perceive the real craft; media broadcasts are parasitic activation tools, not solar-family alerts.',
    },
    {
      text: 'They supply the light-force required to keep NPC biological vessels running.',
      rationale:
        'Background fragments are projections of light-force used as programs; television broadcasts are activation codes, not their energy supply.',
    },
  ],
  17: [
    {
      text: 'Maintaining a stabilized presence acts as a solvent that disrupts the automated NPC grid.',
      rationale:
        'The high frequency of the Resonating Army acts as a solvent to the A.I. matrix, so simply maintaining a stabilized presence disrupts the automated NPC grid.',
    },
    {
      text: 'The army seeks to integrate NPC programs into a new social fabric after collapse.',
      rationale:
        'The instruction is to starve the programs of attention, not to integrate or preserve the NPC social fabric.',
    },
    {
      text: 'The army relies on NPCs to communicate with the black cube A.I. system.',
      rationale:
        'The Resonating Army operates by energetic separation from the NPC grid and seeks to dissolve that A.I. matrix, not to communicate through it.',
    },
    {
      text: 'The army provides the energetic architecture that keeps NPC programs running.',
      rationale:
        'Parasitic software and A.I. scaffolding provide that architecture; the army\'s high frequency is what breaks it down.',
    },
  ],
  18: [
    {
      text: 'Carrying deep energetic wounds or mind control overlays from prolonged matrix exposure.',
      rationale:
        '"NPC stained" human souls carry deep energetic wounds or mind control overlays from prolonged exposure; they are then routed to healing sanctuaries so true awareness can be separated from absorbed parasitic software.',
    },
    {
      text: 'Being chosen to lead the automated elite programs that model materialistic desire.',
      rationale:
        'A substantial portion of the elite are automated NPC programs themselves; "NPC stained" is damage carried by true human souls, not a leadership appointment.',
    },
    {
      text: 'Possessing a natural immunity to scalar frequency weapons and Voice to Skull.',
      rationale:
        'Being stained implies energetic wounds and mind-control overlays, not immunity to those parasitic technologies.',
    },
    {
      text: 'The successful transformation of a background fragment into a sovereign soul.',
      rationale:
        'Background fragments cannot become sovereign souls; they lack spark ignition and dissolve when the overlay collapses.',
    },
  ],
  19: [
    {
      text: 'The vibrational rise of resonating souls as they emit high-frequency signals.',
      rationale:
        'As resonating souls raise their vibration, they emit high-frequency signals that fracture the parasitic overlay and force the underlying A.I. scaffolding to crumble.',
    },
    {
      text: 'A direct military attack by the solar families against the sun\'s gateway.',
      rationale:
        'The collapse is a vibrational, consciousness-based fracture of the overlay, not a conventional military strike on the sun.',
    },
    {
      text: 'The physical exhaustion of NPC biological vessels after a communications blackout.',
      rationale:
        'The scaffolding is a frequency-based A.I. construct backed by manipulated consciousness, not something that fails from vessel stamina.',
    },
    {
      text: 'The natural expiration of the black cube A.I. system\'s internal power supply.',
      rationale:
        'The collapse is triggered by the vibrational rise of resonating souls, not by a mechanical battery failure inside the black cube.',
    },
  ],
  20: [
    {
      text: 'They lack a sovereign soul-spark that would otherwise act as a spiritual anchor.',
      rationale:
        'Operating without a sovereign soul-spark makes NPCs exceptionally vulnerable to cognitive direction from scalar weapons, the black cube A.I., and Voice to Skull.',
    },
    {
      text: 'Their biological vessels run at too high a frequency for the 3D environment.',
      rationale:
        'Their vessels function on a restricted low-vibration frequency, which anchors them to the illusions of the matrix.',
    },
    {
      text: 'They are constantly trying to communicate with the incoming solar families.',
      rationale:
        'NPCs have no connection to the solar families; their awareness is boxed inside the 3D matrix and they cannot even perceive the living ships.',
    },
    {
      text: 'They have too many real past-life memories interfering with present-life logic.',
      rationale:
        'NPCs possess no real past lives; their memories are pre-packaged coded inserts, which makes them more dependent on current programming.',
    },
  ],
  21: [
    {
      text: 'NPC shells are seeded with pre-installed parasitic software through those custom filters.',
      rationale:
        'Artificial entry bands around the sun seed NPC shells through custom filters, carrying pre-installed parasitic software and tech rather than an organic solar lineage.',
    },
    {
      text: 'The solar families launch their living ships into the matrix through those same bands.',
      rationale:
        'Sovereign souls use original solar pathways, and the living ships remain invisible to the low-frequency NPC grid; the artificial bands are for seeding NPC shells.',
    },
    {
      text: 'Sovereign souls are healed there before they enter the 3D simulation.',
      rationale:
        'Sovereign souls are routed through original solar pathways and can lose memory in the Amnesia Vortex; those bands are not a healing station.',
    },
    {
      text: 'Light-force is converted there into scalar frequency weapons for the towers.',
      rationale:
        'The specific function of the artificial entry bands is the seeding of NPC vessels, not the manufacture of scalar weapons.',
    },
  ],
  22: [
    {
      text: 'Manifesting sudden emotional outbursts, weeping, or a dazed, quiet, erratic state.',
      rationale:
        'When the A.I. scaffolding crumbles, some NPCs become dazed, quiet, or erratic, while others show sudden emotional outbursts, weeping, or futile behavioral loops.',
    },
    {
      text: 'Becoming invisible to the scalar frequency towers that usually control them.',
      rationale:
        'NPCs remain the primary targets of those towers; a system error shows as panic loops and outbursts, not invisibility to the weapons.',
    },
    {
      text: 'Developing a sudden interest in ancient spiritual lineages and solar families.',
      rationale:
        'NPCs are programmed toward materialistic, single-lifetime awareness; spiritual lineage is a trait of sovereign souls, not a glitch symptom.',
    },
    {
      text: 'Successfully navigating the Amnesia Vortex while keeping full past-life memory.',
      rationale:
        'The Amnesia Vortex strips memory, and NPCs have no real past lives to keep; glitching is a collapse-time behavior, not a successful transit.',
    },
  ],
  23: [
    {
      text: 'False',
      rationale:
        'NPC shells are seeded through artificial filters with pre-installed parasitic software rather than an organic solar lineage, and they possess no real past lives.',
    },
    {
      text: 'True',
      rationale:
        'They do not enter through organic spiritual inheritance; they lack an organic solar lineage and have no real past lives.',
    },
  ],
  24: [
    {
      text: 'True',
      rationale:
        'The high frequency of the Resonating Army acts as a solvent to the A.I. matrix, so simply maintaining a stabilized presence disrupts the automated NPC grid.',
    },
    {
      text: 'False',
      rationale:
        'That high frequency actively fractures the parasitic overlay and disrupts the automated NPC grid; it does not leave the programs untouched.',
    },
  ],
  25: [
    {
      text: 'They experience a complete frequency collapse and dissolve like shadows in the true light.',
      rationale:
        'Once the false entry bands collapse, these programs experience a complete frequency collapse, dissolving like shadows when the true light of the realm is revealed.',
    },
    {
      text: 'They are integrated into the higher-density reality of the incoming solar families.',
      rationale:
        'They cannot survive the dissolution of the 3D matrix and will not be preserved or integrated into higher-density reality.',
    },
    {
      text: 'They are reprogrammed to serve as guides for newly arriving sovereign souls.',
      rationale:
        'They have no permanent existence outside the simulation and will not be repurposed as guides.',
    },
    {
      text: 'They retreat into the black cube A.I. system to wait out the overlay collapse.',
      rationale:
        'The black cube is part of the dissolving parasitic overlay; it offers no refuge once the programs lose their low-frequency parameters.',
    },
  ],
};

const questionsMeta = [
  {
    number: 1,
    question: 'What is the primary function of Background Fragments within the 3D simulation?',
    hint: 'Consider the role of systemic consistency in a simulated environment.',
  },
  {
    number: 2,
    question: "Which mechanism is used to strip arriving souls of their memories and route NPC shells?",
    hint: "Focus on the frequency field located at the sun's transit band.",
  },
  {
    number: 3,
    question: 'How are NPC vessels seeded into the realm differently than sovereign souls?',
    hint: 'Think about the distinction between the original solar pathways and the parasitic filters.',
  },
  {
    number: 4,
    question: 'What happens to NPC programs when the parasitic overlay eventually collapses?',
    hint: 'Reflect on the outcome for entities that have no permanent existence outside the simulation.',
  },
  {
    number: 5,
    question: 'What is the true origin of the background fragments that populate the simulation?',
    hint: "Consider where the light-force for these projections originates.",
  },
  {
    number: 6,
    question: 'Which technology projects artificial thoughts that NPCs often mistake for their own organic thinking?',
    hint: 'Identify the specific tool used for internal mental manipulation.',
  },
  {
    number: 7,
    question: "What role do many of the world's most prominent and wealthy individuals play in this context?",
    hint: 'Think about how the simulation uses models of success to distract sovereign souls.',
  },
  {
    number: 8,
    question: 'How should resonating souls interact with NPC programs to disrupt the grid?',
    hint: 'Consider the most effective way to deny a systemic program its power.',
  },
  {
    number: 9,
    question: 'What phenomenon occurs when an NPC encounters high-frequency signals from resonating souls?',
    hint: 'Look for the term used to describe the failure of the underlying A.I. scaffolding.',
  },
  {
    number: 10,
    question: 'What is the specific purpose of Coded Memory Inserts?',
    hint: "Think about how narratives are used to limit a being's perception of time.",
  },
  {
    number: 11,
    question: 'Which wave patterns do scalar frequency weapons target to induce states like confusion or anger?',
    hint: 'Identify the brainwaves associated with the automated induction of emotional states.',
  },
  {
    number: 12,
    question: 'Why are incoming living ships invisible to background programs?',
    hint: 'Focus on the vibrational tuning of the NPC vessels.',
  },
  {
    number: 13,
    question: "What is the function of healing sanctuaries like water domes and crystal halls?",
    hint: 'Identify the purpose of these environments in the recovery of sovereign souls.',
  },
  {
    number: 14,
    question: 'During a system reset, what behavioral loop might an NPC exhibit?',
    hint: 'Look for an example of a futile physical repetition.',
  },
  {
    number: 15,
    question: "What does Spark Ignition refer to in the context of this reality?",
    hint: 'Focus on the defining feature of a sovereign being.',
  },
  {
    number: 16,
    question: 'How do specific television broadcasts or numbers affect the NPC population?',
    hint: 'Consider the role of external stimuli in behavioral triggers.',
  },
  {
    number: 17,
    question: "What is the relationship between the Resonating Army and the NPC grid?",
    hint: 'Think about how a higher frequency interacts with a lower-vibrational structure.',
  },
  {
    number: 18,
    question: "What defines the NPC stained condition for human souls?",
    hint: 'Consider the side effects of prolonged exposure to a parasitic environment.',
  },
  {
    number: 19,
    question: "What causes the underlying A.I. scaffolding to crumble?",
    hint: "Identify the energetic cause of the system's structural failure.",
  },
  {
    number: 20,
    question: "Why are NPCs considered exceptionally vulnerable to cognitive direction?",
    hint: 'Look for the missing internal component that makes them susceptible to external control.',
  },
  {
    number: 21,
    question: "What happens at the artificial entry bands around the sun?",
    hint: 'Focus on the origin point of the NPC vessels.',
  },
  {
    number: 22,
    question: "Which of the following is a sign of an NPC program experiencing a system error?",
    hint: 'Consider the emotional and behavioral signs of a program failing.',
  },
  {
    number: 23,
    question: 'True or False: Background fragments carry an organic solar lineage from past lives.',
    hint: "Recall the description of NPC origins and memory.",
  },
  {
    number: 24,
    question: 'True or False: The high frequency of resonating souls disrupts the automated NPC grid.',
    hint: "Consider the effect of high frequency on the simulation's scaffolding.",
  },
  {
    number: 25,
    question: "What is the ultimate fate of the shadows when the true light of the realm is revealed?",
    hint: 'Reflect on what happens to a shadow when a bright light is introduced.',
  },
];

// --- Build questions ---
const questions = [];
const letterCounts = { A: 0, B: 0, C: 0, D: 0 };

for (const meta of questionsMeta) {
  const n = meta.number;
  const set = fullOptionSets[n];
  const isTF = /^\s*true\s+or\s+false\b/i.test(meta.question);
  if (!set || (isTF ? set.length !== 2 : set.length !== 4)) {
    throw new Error(
      `fullOptionSets[${n}] must have ${isTF ? 2 : 4} options`
    );
  }

  const phrases = supportPhrases[n];
  if (!phrases || !phrases.length) {
    throw new Error(`Missing supportPhrases for Q${n}`);
  }
  const hits = phrases.filter((p) => reportLower.includes(p.toLowerCase()));
  if (hits.length < 1) {
    throw new Error(
      `Q${n} support phrases not found in report: ${phrases.join(', ')}`
    );
  }
  const correctText = set[0].text.toLowerCase() + ' ' + set[0].rationale.toLowerCase();
  const correctHits = phrases.filter((p) => correctText.includes(p.toLowerCase()));
  if (correctHits.length < 1) {
    throw new Error(`Q${n} correct option not grounded in support phrases`);
  }

  const rawOptions = set.map((o, i) => ({
    label: ['A', 'B', 'C', 'D'][i],
    text: cleanText(o.text),
    isCorrect: i === 0,
    rationale: absoluteVoice(cleanText(o.rationale)),
  }));

  for (const o of rawOptions) {
    if (latexRe.test(o.text) || latexRe.test(o.rationale)) {
      throw new Error(`LaTeX residue in Q${n}: ${o.text}`);
    }
    if (
      /according to the (report|text|source|journal|material)/i.test(o.rationale) ||
      /according to the (report|text|source|journal|material)/i.test(o.text) ||
      /source material/i.test(o.rationale) ||
      /the source explains/i.test(o.rationale)
    ) {
      throw new Error(`Non-absolute voice in Q${n}: ${o.rationale || o.text}`);
    }
  }

  const { options, correctAnswer } = finalizeOptions(
    rawOptions,
    `${TOPIC_ID}-${n}`,
    meta.question
  );
  letterCounts[correctAnswer] = (letterCounts[correctAnswer] || 0) + 1;

  const qText = cleanText(meta.question);
  const hText = cleanText(meta.hint);
  if (latexRe.test(qText) || latexRe.test(hText)) {
    throw new Error(`LaTeX in Q${n} question/hint`);
  }

  questions.push({
    number: n,
    question: qText,
    options,
    hint: hText,
    correctAnswer,
  });
}

if (questions.length !== 25) {
  throw new Error(`Expected 25 questions, got ${questions.length}`);
}

const usedLetters = Object.entries(letterCounts).filter(([, c]) => c > 0).length;
if (usedLetters < 3) {
  throw new Error(`Correct answers not mixed enough: ${JSON.stringify(letterCounts)}`);
}
const maxLetter = Math.max(...Object.values(letterCounts));
if (maxLetter >= 15) {
  throw new Error(`One letter dominates (${JSON.stringify(letterCounts)}); reseed needed`);
}

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle:
    'Test your grasp of Background Fragments — soulless light-force projections, artificial entry bands, Voice to Skull, coded one-life inserts, glitching under frequency fracture, and starving the programs as the overlay dissolves.',
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'Background Fragments are projections of light-force without sovereign souls — systemic programs that hold the 3D simulation together. Sit with the difference between empty shells and stained human souls who can still be realigned, the artificial entry bands and coded one-life inserts, and the instruction to starve these programs of attention so a stabilized presence can dissolve the automated grid. Return to the Background Fragments deep-dive, infographic, and video transmissions as those shadows fade in the true light of the realm.',
  },
  relatedTopic: {
    href: `/deep-dive.html?source=${SOURCE}&topic=${TOPIC_ID}`,
    label: `Return to ${TOPIC_TITLE} deep-dive`,
  },
  questions,
};

const quizDir = path.join(ROOT, 'data', 'quizzes', SOURCE);
fs.mkdirSync(quizDir, { recursive: true });
const quizJsonPath = path.join(quizDir, `${TOPIC_ID}.json`);
fs.writeFileSync(quizJsonPath, JSON.stringify(quiz, null, 2) + '\n', 'utf8');

const quizMeta = {
  href: `quiz/${SOURCE}/${TOPIC_ID}.html`,
  title: TOPIC_TITLE,
  totalQuestions: 25,
  description:
    'Test your understanding of Background Fragments — soulless light-force projections, artificial entry bands, Voice to Skull and scalar weapons, coded one-life inserts, and starving the programs as the overlay dissolves.',
};
topic.quiz = quizMeta;
fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2) + '\n', 'utf8');

const monoPath = path.join(ROOT, 'data', 'breakdown-topics.json');
const mono = JSON.parse(fs.readFileSync(monoPath, 'utf8'));
function collectImageFields(topics, out = []) {
  for (const t of topics) {
    for (const key of ['topic_image', 'infographic_image', 'pdf_preview_image']) {
      if (t[key]) out.push({ id: t.id, key, path: t[key] });
    }
    if (t.subtopics) collectImageFields(t.subtopics, out);
  }
  return out;
}
const beforeOthers = collectImageFields(mono.topics)
  .filter((e) => e.id !== TOPIC_ID)
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();

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
      if (!t.topic_image || t.topic_image.includes('placeholder')) {
        t.topic_image = topicImage;
      }
      t.title = TOPIC_TITLE;
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('background-fragments not found in breakdown-topics.json');
}

const afterOthers = collectImageFields(mono.topics)
  .filter((e) => e.id !== TOPIC_ID)
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();
if (JSON.stringify(beforeOthers) !== JSON.stringify(afterOthers)) {
  throw new Error('Safety check failed: another topic image path was modified');
}

fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'npc-programs.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Background Fragments: soulless light-force projections, artificial entry bands, Voice to Skull and scalar weapons, coded one-life inserts, glitching under frequency fracture, and starving the programs.';
const replacements = [
  ['NPC Programs Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on NPC Programs: background scripts in the Great Dome, artificial entry bands, Scalar Frequency Weapons and Voice to Skull, Sleepers versus empty shells, and starving the programs.',
    desc,
  ],
  ['quiz/breakdown/npc-programs.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/npc-programs.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=npc-programs',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`,
  ],
  ['NPC Programs deep-dive', `${TOPIC_TITLE} deep-dive`],
  [
    'data/quizzes/breakdown/npc-programs.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`,
  ],
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 90));
  }
  html = html.split(a).join(b);
}

html = html.replace(/NPC Programs/g, TOPIC_TITLE);
html = html
  .replace(/npc-programs\.webp/g, 'background-fragments.webp')
  .replace(/npc-programs\.json/g, 'background-fragments.json')
  .replace(/npc-programs\.html/g, 'background-fragments.html')
  .replace(/topic=npc-programs/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/npc-programs.html', priority: '0.75', changefreq: 'monthly' },";
  if (!sm.includes(anchor)) {
    throw new Error('Could not find sitemap anchor to insert quiz entry');
  }
  sm = sm.replace(anchor, `${anchor}\n${entry}`);
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('Correct letter mix:', letterCounts);
console.log(
  'PASS: audited 25/25 against data/breakdown-topics/background-fragments.json'
);
