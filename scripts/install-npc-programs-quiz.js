/**
 * Installs NPC Programs quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/simulation-quiz.json
 * Title forced to "NPC Programs". All 25 audited against npc-programs report only.
 *
 * Run: node scripts/install-npc-programs-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/npc-programs.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'npc-programs';
const TOPIC_TITLE = 'NPC Programs';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/simulation-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/npc-programs.webp';

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

/** Support phrases grounded only in npc-programs.json report. */
const supportPhrases = {
  1: ['structural illusion of society', 'background scripts', 'automated parameters'],
  2: ['500 million starseeds', 'resonating army', 'et souls'],
  3: ['amnesia vortex', 'memories and lineages', 'transit band'],
  4: ['low vibrational frequency', 'illusion grid', 'concrete'],
  5: ['four to five artificial entry bands', 'custodians'],
  6: ['programming glitches', 'lash out', 'wander aimlessly'],
  7: ['scalar frequency weapons', 'voice to skull', 'black cube'],
  8: ['pixilate', 'dissolve like shadows'],
  9: ['known lands', 'energetic farm', 'loosh harvesting'],
  10: ['ignore and starve', 'energetic engagement', 'waste of vital force'],
  11: ['spark ignition potential', 'sleepers', 'amnesia'],
  12: ['visual activation cues', 'numerical codes', 'awakening souls'],
  13: ['algorithmic pre-coded auto-pilot', 'rapid changes', 'background resonance'],
  14: ['holographic dome', 'biological perception', 'low-frequency matter'],
  15: ['captured, inverted, and looped', 'true human souls'],
  16: ['coded memory inserts', 'you only live once'],
  17: ['council of parasitic races', 'niburians', 'resonating souls'],
  18: ['3d overlay', 'frequency collapse', 'second realm'],
  19: ['soul-spark', 'spiritual anchor', 'higher realms'],
  20: ['emergency broadcast system', 'decaying a.i. scaffolding', 'resonating army'],
  21: ['social enforcers', 'monetary dependency', 'distance'],
  22: ['theta, delta, and alpha', 'confusion, anger, or despair'],
  23: ['solar families', 'extraction', 'vatican filters'],
  24: ['pixilate', 'restored landscape', 'no sovereign soul-spark'],
  25: ['no sovereign soul to awaken', 'waste of vital force', 'ignore and starve'],
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
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The material states that\s+/i, ''],
    [/\bthe text describes them as\b/gi, 'they are'],
    [/\bthe text describes\b/gi, ''],
    [/\bthe text states\b/gi, ''],
    [/\bthe text emphasizes\b/gi, ''],
    [/\bthe text uses\b/gi, ''],
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
 * NotebookLM meaning kept; lengths evened; Q20 corrected to report wording.
 */
const fullOptionSets = {
  1: [
    {
      text: 'Maintaining the structural illusion of society through automated background scripts.',
      rationale:
        'NPC Programs are non-soul background scripts that maintain the structural illusion of society, responding mechanically to stimuli on automated parameters.',
    },
    {
      text: 'Serving as protectors of the organic divine sparks walking inside the Great Dome.',
      rationale:
        'NPCs are deployed to skew collective consciousness and keep True Human Souls trapped; they do not protect organic divine sparks.',
    },
    {
      text: 'Acting as individualized sovereign consciousnesses dedicated to spiritual growth.',
      rationale:
        'NPC Programs are background scripts rather than individualized sovereign consciousnesses and have no spiritual-growth role.',
    },
    {
      text: 'Facilitating soul transit through the sun’s original harmonic bands of entry.',
      rationale:
        'Original harmonic bands are for organic souls; NPC vessels are routed through four to five artificial entry bands.',
    },
  ],
  2: [
    {
      text: 'The Resonating Army — 500 million starseeds also called Resonating Souls or ET Souls.',
      rationale:
        'Resonating Souls, also known as the Resonating Army or ET Souls, are the 500 million starseeds who entered the dome to dismantle the parasitic construct and activate humanity.',
    },
    {
      text: 'The Custodians — parasitic architects who built the original harmonic bands for organic souls.',
      rationale:
        'The Custodians built the artificial entry bands and belong to the Council of Parasitic Races, not the 500 million starseeds.',
    },
    {
      text: 'True Human Souls — organic sparks who descended as the 500 million starseed army.',
      rationale:
        'True Human Souls are organic sparks captured, inverted, and looped; the 500 million starseeds are the Resonating Army who came to liberate them.',
    },
    {
      text: 'NPC Programs — engineered fragments of light counted as the 500 million starseed force.',
      rationale:
        'NPC Programs are non-soul background scripts with no organic memory; they are not the starseed Resonating Army.',
    },
  ],
  3: [
    {
      text: 'To strip incoming souls of their memories and lineages before incarnation.',
      rationale:
        'The Amnesia Vortex is a distorting frequency filter at the sun’s transit band that strips incoming souls of their memories and lineages before incarnation.',
    },
    {
      text: 'To activate the latent memories of starseeds during cosmic trigger events.',
      rationale:
        'The vortex strips memory away; spark ignition of Sleepers during cosmic trigger events is a separate activation, not the vortex’s function.',
    },
    {
      text: 'To filter parasitic software out of a soul before that soul incarnates in the dome.',
      rationale:
        'The vortex assists the parasitic construct by stripping lineages; it does not cleanse parasitic software from incoming souls.',
    },
    {
      text: 'To provide healing for souls transitioning out of the 3D program into sanctuaries.',
      rationale:
        'Healing sanctuaries restore salvable soul-sparks; NPCs never enter them, and the vortex is an entry filter, not a healing chamber.',
    },
  ],
  4: [
    {
      text: 'Because their low vibrational frequency matches the density of the illusion grid.',
      rationale:
        'NPC Programs perceive concrete, steel, and flat maps as hard, heavy, and permanent because their low vibrational frequency matches the density of the illusion grid.',
    },
    {
      text: 'Because they are biologically engineered to be immune to the Holographic Dome field.',
      rationale:
        'NPCs are components of the dome’s illusion, not immune to it; the dome restricts biological perception of low-frequency matter.',
    },
    {
      text: 'Because they carry a high-frequency crystalline resonance that reveals hidden matter.',
      rationale:
        'High-frequency resonance would pierce the illusion; NPCs run at low vibrational frequency that matches the grid’s density.',
    },
    {
      text: 'Because they have been granted access to the Council of 12 Suns and its codes.',
      rationale:
        'NPCs lack connection to the Council of 12 Suns and do not carry the solar lineage codes required to perceive higher dimensions.',
    },
  ],
  5: [
    {
      text: 'They are routed through four to five artificial entry bands built by the Custodians.',
      rationale:
        'Unlike organic souls who enter through the sun’s original harmonic bands, NPC vessels are routed through four to five artificial entry bands built by the Custodians.',
    },
    {
      text: 'They descend directly from the Council of 12 Suns to inhabit physical organic shells.',
      rationale:
        'NPCs have no connection to the Council of 12 Suns and carry parasite software instead of an organic solar lineage.',
    },
    {
      text: 'They enter through the sun’s original harmonic bands reserved for organic souls.',
      rationale:
        'Original harmonic bands are for organic souls; NPC vessels use the Custodians’ artificial entry bands instead.',
    },
    {
      text: 'They are birthed through organic solar lineages in the higher realms before descent.',
      rationale:
        'NPC Programs carry parasite software rather than an organic solar lineage and are seeded through artificial bands.',
    },
  ],
  6: [
    {
      text: 'Exhibiting programming glitches such as lashing out, circling, or going quiet and dazed.',
      rationale:
        'Under emotional stress their pre-coded scripts fail, causing visible NPC programming glitches where they lash out, wander aimlessly in circles, or go quiet and dazed.',
    },
    {
      text: 'Maintaining a calm, grounded presence that stabilizes the grid like Resonating Souls.',
      rationale:
        'Calmness and holding ground during shifts belong to Resonating Souls; NPCs exhibit predictable panic patterns.',
    },
    {
      text: 'Seeking out healing sanctuaries so their empty shells can undergo ascension anyway.',
      rationale:
        'NPCs do not undergo ascension or enter healing sanctuaries because there is no sovereign soul-spark to salvage.',
    },
    {
      text: 'Activating latent solar codes so they can align with the Resonating Army on contact.',
      rationale:
        'NPCs do not carry solar lineage codes or a sovereign spark; they run parasite software on pre-coded autopilot.',
    },
  ],
  7: [
    {
      text: 'Scalar Frequency Weapons and Voice to Skull, operated through the Black Cube A.I. System.',
      rationale:
        'NPCs are completely compliant with Scalar Frequency Weapons and Voice to Skull technologies operated through the Black Cube A.I. System, which target theta, delta, and alpha brain-wave patterns.',
    },
    {
      text: 'Crystalline resonance filters that purify NPC perception of the true crystalline world.',
      rationale:
        'Crystalline reality is what the Holographic Dome masks; the parasitic weapons are Scalar Frequency Weapons and Voice to Skull, not crystalline filters.',
    },
    {
      text: 'Solar lineage activation cords that ignite organic codes inside every NPC vessel.',
      rationale:
        'Solar lineage codes belong to organic souls connected to the Council of 12 Suns; NPCs carry parasite software, not solar cords.',
    },
    {
      text: 'Frequency collapse stabilizers that lock the 3D overlay so the power source never fails.',
      rationale:
        'Parasitic systems maintain the low-frequency loop; frequency collapse is what dissolves NPC shells, not a stabilizer they operate.',
    },
  ],
  8: [
    {
      text: 'Their physical shells will pixilate and dissolve like shadows when the light hits.',
      rationale:
        'When frequency collapse removes the energetic foundation, NPC physical shells pixilate and dissolve like shadows because there is no sovereign soul-spark to salvage.',
    },
    {
      text: 'They will transition to the higher realms and join solar families waiting outside.',
      rationale:
        'NPCs lack a spiritual anchor outside the simulation and cannot transition to higher realms or join Solar Families.',
    },
    {
      text: 'They will enter stasis until the next simulation cycle reboots their background scripts.',
      rationale:
        'Frequency collapse dissolves the programs back into the light field; they are not held in stasis for a later cycle.',
    },
    {
      text: 'They will be reprogrammed by the Resonating Army to serve a restored New Earth grid.',
      rationale:
        'The Resonating Army ignores and starves NPC programs rather than reprogramming them; focus stays on True Human Souls and Sleepers.',
    },
  ],
  9: [
    {
      text: 'To maintain loosh harvesting loops for the Council of Parasitic Races.',
      rationale:
        'The Known Lands were established as a shared energetic farm; empty NPC shells were deployed to skew collective consciousness and maintain loosh harvesting loops.',
    },
    {
      text: 'To bridge the 3D simulation with the Second Realm so perception stays open.',
      rationale:
        'The Holographic Dome restricts biological perception and masks crystalline reality; the farm is not a bridge to the Second Realm.',
    },
    {
      text: 'To create a sanctuary where True Human Souls can rest beyond parasitic loops.',
      rationale:
        'True Human Souls are trapped and looped in this farm; they are the harvested population, not protected guests.',
    },
    {
      text: 'To cultivate high-frequency spiritual growth equally for every being in the dome.',
      rationale:
        'The Known Lands are a parasitic energetic farm that drowns out starseed signals, not a school of high-frequency growth.',
    },
  ],
  10: [
    {
      text: 'To ignore and starve the NPC programs by ceasing all energetic engagement.',
      rationale:
        'The primary directive is to cease all energetic engagement with the NPC population — ignore and starve the programs — because they have no sovereign soul to awaken.',
    },
    {
      text: 'To facilitate their entry into Vatican filters so the shells can be cleansed.',
      rationale:
        'Vatican filters are parasitic mechanisms being dismantled; organic souls bypass them, and NPCs are not sent there for cleansing.',
    },
    {
      text: 'To debate them until the programs accept the simulation and choose to awaken.',
      rationale:
        'Trying to convince or argue with NPCs is a waste of vital force because they have no sovereign soul to awaken.',
    },
    {
      text: 'To give them new memory inserts that simulate past lives and organic lineage.',
      rationale:
        'Coded memory inserts are Custodian tools that create a “you only live once” identity; the Resonating Army does not feed NPC scripts.',
    },
  ],
  11: [
    {
      text: 'Souls in amnesia who still hold a spark ignition potential that can be activated.',
      rationale:
        'Sleepers are souls trapped in amnesia within the 3D program who retain a spark ignition potential capable of being activated during cosmic trigger events.',
    },
    {
      text: 'Fragments of light engineered by the Custodians to hold the simulated grid together.',
      rationale:
        'Engineered fragments of light that hold the simulation together are NPC Programs, not Sleepers.',
    },
    {
      text: 'Artificial constructs that lack any spiritual potential and cannot be ignited.',
      rationale:
        'That describes NPC Programs; Sleepers are organic souls with spark ignition potential.',
    },
    {
      text: 'Members of the Council of Parasitic Races waiting out the frequency collapse.',
      rationale:
        'Sleepers are souls the Resonating Army works to save; the parasitic council includes Custodians, Anunnaki, Draconians, Greys, and Niburians.',
    },
  ],
  12: [
    {
      text: 'They exhibit pre-programmed behaviors that turn them against awakening souls.',
      rationale:
        'NPCs react instantly to visual activation cues and numerical codes on public broadcast channels, which trigger pre-programmed behaviors and turn them against awakening souls.',
    },
    {
      text: 'They begin to perceive the crystalline reality beneath the Holographic Dome field.',
      rationale:
        'Broadcast codes reinforce the illusion; they do not lift the dome or reveal crystalline reality to NPC programs.',
    },
    {
      text: 'They disconnect from the Black Cube A.I. System and drop all scripted control.',
      rationale:
        'Those cues are operated through the Black Cube A.I. System and strengthen scripted control, not disconnection.',
    },
    {
      text: 'They undergo a spontaneous soul ignition as if a Sleeper spark had been triggered.',
      rationale:
        'NPCs lack a soul-spark to ignite; they only respond to pre-coded triggers stored in their software.',
    },
  ],
  13: [
    {
      text: 'Because they run on an algorithmic pre-coded auto-pilot with no sovereign adaptation.',
      rationale:
        'Because they run on an algorithmic pre-coded auto-pilot, they are incapable of adjusting to rapid changes in the background resonance.',
    },
    {
      text: 'Because their solar lineage is too dense to register a shift in background resonance.',
      rationale:
        'NPCs carry parasite software rather than an organic solar lineage; density of a solar line is not the limit.',
    },
    {
      text: 'Because they are waiting for a signal from the Council of 12 Suns before they move.',
      rationale:
        'NPCs lack connection to the Council of 12 Suns and do not wait on that council for adaptive behavior.',
    },
    {
      text: 'Because they are focused on dismantling Vatican filters alongside the Resonating Army.',
      rationale:
        'Bypassing dismantled Vatican filters is work for remaining organic souls; NPCs cannot adapt and do not dismantle filters.',
    },
  ],
  14: [
    {
      text: 'Biological perception, rendering low-frequency matter as solid and masking crystalline reality.',
      rationale:
        'The Holographic Dome is an artificial projection field that restricts biological perception, rendering low-frequency matter as solid and masking the true crystalline reality beneath.',
    },
    {
      text: 'The transmission of loosh so parasitic races can no longer harvest the Known Lands.',
      rationale:
        'The dome helps keep souls trapped so loosh harvesting can continue; it does not block the harvest.',
    },
    {
      text: 'The dissolution of NPC programs so their shells cannot pixilate during collapse.',
      rationale:
        'Frequency collapse of the overlay is what dissolves NPC shells; the dome is the projection that holds the illusion, not a shield against dissolution.',
    },
    {
      text: 'The physical movement of the Resonating Army across the Known Lands farm itself.',
      rationale:
        'The dome restricts biological perception of matter, not the movement of advanced Resonating Souls through the lands.',
    },
  ],
  15: [
    {
      text: 'Captured, inverted, and looped by parasitic entities as the primary population to liberate.',
      rationale:
        'True Human Souls are organic sparks of light who were captured, inverted, and looped by parasitic entities — the primary population the Resonating Army descended to liberate.',
    },
    {
      text: 'Born without any connection to the sun’s original harmonic bands of organic entry.',
      rationale:
        'Organic souls enter through the sun’s original harmonic bands; True Human Souls are organic sparks, even though they have been inverted and looped.',
    },
    {
      text: 'Designed to operate the Black Cube A.I. System as its primary technical staff.',
      rationale:
        'True Human Souls are the harvested, inverted population; the Black Cube A.I. System operates mind weapons against NPCs and the trapped, not as their vocation.',
    },
    {
      text: 'Engineered by the Custodians to serve as non-soul background fragments of light.',
      rationale:
        'Background fragments engineered to hold the simulation are NPC Programs; True Human Souls are organic sparks.',
    },
  ],
  16: [
    {
      text: 'Coded memory inserts that center identity on the belief that you only live once.',
      rationale:
        'Artificial entry bands inject coded memory inserts instead of true past lives, generating a superficial identity centered on the belief that “you only live once.”',
    },
    {
      text: 'High-frequency signals designed to trigger awakening across the entire NPC population.',
      rationale:
        'The artificial bands maintain the status quo with coded inserts; they are not awakening signals for NPC programs.',
    },
    {
      text: 'Organic memories from previous lifetimes lived in the Second Realm before descent.',
      rationale:
        'NPCs have no true past lives; the bands inject coded inserts instead of true past lives.',
    },
    {
      text: 'Direct communication channels with the Council of 12 Suns and its solar lineage codes.',
      rationale:
        'NPCs lack connection to the Council of 12 Suns and do not carry solar lineage codes.',
    },
  ],
  17: [
    {
      text: 'Resonating Souls — the starseed army working to dismantle the parasitic construct.',
      rationale:
        'The Council of Parasitic Races includes the Custodians, Anunnaki, Draconians, Greys, and Niburians. Resonating Souls are the 500 million starseeds opposing that construct.',
    },
    {
      text: 'Niburians — named with the Greys and Custodians as part of the parasitic council.',
      rationale:
        'Niburians are listed in the Council of Parasitic Races alongside Custodians, Anunnaki, Draconians, and Greys.',
    },
    {
      text: 'Anunnaki — named as collaborators who helped deploy empty shells across the farm.',
      rationale:
        'The Anunnaki are explicitly named in the Council of Parasitic Races that deployed empty NPC shells.',
    },
    {
      text: 'Draconians — named as collaborators in the parasitic treaty over the Known Lands.',
      rationale:
        'The Draconians are explicitly named in the Council of Parasitic Races that established the Known Lands as an energetic farm.',
    },
  ],
  18: [
    {
      text: 'The collapse of the 3D overlay and the artificial energetic foundations that hold it.',
      rationale:
        'When the 3D overlay collapses through frequency collapse, systems without an external anchor lose their foundation, opening the path toward restoration of the Second Realm.',
    },
    {
      text: 'The collapse of memory inserts inside True Human Souls so no past can be recovered.',
      rationale:
        'The work is to trigger latent memories of True Human Souls and Sleepers, not to collapse their memory; the overlay is what collapses.',
    },
    {
      text: 'The collapse of the Resonating Army’s strategic defenses inside the Great Dome.',
      rationale:
        'The Resonating Army emits the frequency signals that cut through decaying A.I. scaffolding; their defenses are not the collapse that restores the Second Realm.',
    },
    {
      text: 'The collapse of the high-vibrational solar bands used by organic souls at entry.',
      rationale:
        'Original harmonic bands are the organic entry for souls; frequency collapse targets the 3D overlay, not those solar bands.',
    },
  ],
  19: [
    {
      text: 'They lack a sovereign soul-spark and an external spiritual anchor outside the simulation.',
      rationale:
        'Because they lack a spiritual anchor outside the simulation, they cannot transition to higher realms and dissolve when the system’s power source collapses. There is no sovereign soul-spark to salvage.',
    },
    {
      text: 'They are required to undergo a secondary Amnesia Vortex phase after the overlay falls.',
      rationale:
        'The Amnesia Vortex is an entry filter at the sun’s transit band, not a post-collapse requirement that blocks NPC transition.',
    },
    {
      text: 'They choose to remain behind and staff the healing sanctuaries after frequency collapse.',
      rationale:
        'NPCs have no sovereign agency to choose sanctuary service and do not enter healing sanctuaries at all.',
    },
    {
      text: 'They are restricted by the Council of 12 Suns as punishment for running the dome scripts.',
      rationale:
        'The Council of 12 Suns is the solar-lineage connection NPCs lack; it does not create or punish NPC programs.',
    },
  ],
  20: [
    {
      text: 'As it activates and the sky opens, Resonating Army frequency signals cut through decaying A.I. scaffolding.',
      rationale:
        'As the Emergency Broadcast System activates and the sky begins to open, frequency signals emitted by the Resonating Army cut through the decaying A.I. scaffolding so organic souls can bypass dismantled Vatican filters.',
    },
    {
      text: 'It will trigger the dissolution of the Resonating Army’s physical shells across the farm.',
      rationale:
        'The Resonating Army emits the high-frequency signals; NPC shells dissolve, not the Resonating Army.',
    },
    {
      text: 'It will reboot the Black Cube A.I. System into a more stable control version of itself.',
      rationale:
        'The shift dismantles decaying A.I. scaffolding; it does not reboot the Black Cube into a stabler control system.',
    },
    {
      text: 'It will let the Custodians repair the four to five artificial entry bands around the sun.',
      rationale:
        'Activation marks the opening in which incoming light makes NPC bands unstable; it is not a repair window for the Custodians.',
    },
  ],
  21: [
    {
      text: 'Social enforcers who reinforce the illusion of distance, nation-states, and monetary dependency.',
      rationale:
        'By populating the dome with millions of compliant programs, parasites established a social consensus that reinforces the illusion of distance, nation-states, and monetary dependency. These programs serve as social enforcers.',
    },
    {
      text: 'Spiritual advisors who raise the starseed population’s frequency through public teaching.',
      rationale:
        'NPCs drown out high-frequency signals of active starseeds; they are social enforcers, not advisors.',
    },
    {
      text: 'Liaisons who negotiate between the Resonating Army and the Council of Parasitic Races.',
      rationale:
        'NPCs are non-sovereign background programs, not diplomatic liaisons between opposing councils.',
    },
    {
      text: 'Guardians who protect latent Sleeper memories until cosmic trigger events ignite them.',
      rationale:
        'NPCs keep True Human Souls trapped in loop cycles and drown out starseed signals; they do not guard Sleeper memories.',
    },
  ],
  22: [
    {
      text: 'Theta, delta, and alpha — targeted to induce localized confusion, anger, or despair.',
      rationale:
        'Scalar Frequency Weapons and Voice to Skull target brain-wave patterns such as theta, delta, and alpha to induce localized states of confusion, anger, or despair.',
    },
    {
      text: 'Low beta only — treated as the single pattern the Black Cube A.I. System ever targets.',
      rationale:
        'The weapons target theta, delta, and alpha patterns, not a low-beta-only channel.',
    },
    {
      text: 'Omega and sigma — named as the parasitic pair used to script public broadcast cues.',
      rationale:
        'Those wave names are not the patterns named for these weapons; the named set is theta, delta, and alpha.',
    },
    {
      text: 'Gamma and high beta — treated as the pair that turns NPCs against awakening souls.',
      rationale:
        'Turning against awakening souls is triggered by visual cues and numerical codes; the targeted waves named are theta, delta, and alpha.',
    },
  ],
  23: [
    {
      text: 'Their true Solar Families, so remaining organic souls can be extracted from the dome.',
      rationale:
        'Resonating Army frequency signals let remaining organic souls bypass dismantled Vatican filters and align with their true Solar Families for extraction.',
    },
    {
      text: 'The Custodians’ artificial lineage so they can remain inside the Known Lands farm.',
      rationale:
        'The work is to escape Custodian systems, not align with an artificial Custodian lineage.',
    },
    {
      text: 'The artificial memory inserts injected at the sun so “you only live once” stays true.',
      rationale:
        'Souls bypass artificial inserts and Vatican filters to find true Solar Families, not to keep the one-life insert.',
    },
    {
      text: 'The Black Cube A.I. recovery protocols that reboot scripted NPC control after collapse.',
      rationale:
        'The A.I. scaffolding is decaying; organic souls align with Solar Families for extraction, not with Black Cube recovery.',
    },
  ],
  24: [
    {
      text: 'They simply pixilate and fade from the restored landscape with no soul left to salvage.',
      rationale:
        'Incoming light makes NPC bands unstable; physical shells pixilate and dissolve like shadows, and the empty NPC matrix fades from the restored landscape. There is no sovereign soul-spark to salvage.',
    },
    {
      text: 'They are integrated into True Human Souls to complete a shared incarnation cycle.',
      rationale:
        'NPC Programs and True Human Souls are different population types; NPCs are background scripts, not merged into organic sparks.',
    },
    {
      text: 'They undergo an extensive healing-sanctuary process and then dissolve after repair.',
      rationale:
        'They do not enter healing sanctuaries because there is no sovereign soul-spark to salvage.',
    },
    {
      text: 'They are archived inside the Black Cube A.I. so future simulations can reuse the shells.',
      rationale:
        'The system’s power source is collapsing; NPC programs dissolve into the light field rather than being archived.',
    },
  ],
  25: [
    {
      text: 'They have no sovereign soul to awaken, so engagement is a waste of vital force.',
      rationale:
        'Because NPCs have no sovereign soul to awaken, trying to convince or argue with them is a waste of vital force. The strategy is to ignore and starve the programs and focus on True Human Souls and Sleepers.',
    },
    {
      text: 'They will eventually become True Human Souls if enough debate energy is spent on them.',
      rationale:
        'An NPC cannot become a soul-bearing human; origins differ — parasite software versus organic sparks.',
    },
    {
      text: 'They are the primary source of solar lineage codes the Resonating Army must harvest.',
      rationale:
        'NPCs carry parasite software and lack solar lineage codes; those codes belong to organic souls connected to the Council of 12 Suns.',
    },
    {
      text: 'They are sovereign combatants whose only safe handling is open energetic confrontation.',
      rationale:
        'NPCs are mechanical, pre-coded, and predictable; the directive is to cease energetic engagement, not to fight them as sovereign combatants.',
    },
  ],
};

const questionsMeta = [
  {
    number: 1,
    question: 'What is the primary functional role of NPC Programs within the architecture of the Great Dome?',
    hint: 'Consider whether these entities are individualized agents or automated placeholders.',
  },
  {
    number: 2,
    question: 'Which population group consists of 500 million starseeds who entered the dome to dismantle the parasitic construct?',
    hint: 'This group is also referred to as ET Souls or Resonating Souls.',
  },
  {
    number: 3,
    question: "What is the function of the Amnesia Vortex located at the sun's transit band?",
    hint: 'Think about a mechanism that causes a total loss of past identity.',
  },
  {
    number: 4,
    question: 'Why do NPC Programs perceive the simulated environment, such as concrete and steel, as hard and permanent?',
    hint: 'Reflect on how frequency affects the perception of matter.',
  },
  {
    number: 5,
    question: 'How do NPC vessels differ from organic souls in their method of entering the simulation?',
    hint: 'Look for the origin point created by the parasitic architects.',
  },
  {
    number: 6,
    question: 'What is the typical behavioral response of an NPC Program when faced with rapid changes in background resonance?',
    hint: 'Consider what happens when a computer script encounters an error it cannot process.',
  },
  {
    number: 7,
    question: 'Which technology is used by the Black Cube A.I. System to target the brain-wave patterns of the simulated population?',
    hint: 'Identify the non-biological tools used for mind control.',
  },
  {
    number: 8,
    question: 'What will happen to NPC Programs when the 3D overlay undergoes a complete frequency collapse?',
    hint: 'Think about what happens to a shadow when the light becomes too bright.',
  },
  {
    number: 9,
    question: "The Known Lands were established as a shared energetic farm primarily for what purpose?",
    hint: "Reflect on the term 'energetic farm' in the context of parasitic entities.",
  },
  {
    number: 10,
    question: 'What is the strategic directive for the Resonating Army regarding the NPC population?',
    hint: 'Focus on the conservation of vital force and the target of the liberation mission.',
  },
  {
    number: 11,
    question: "Which of the following describes Sleepers within the current 3D program?",
    hint: 'These individuals are in a state of amnesia but possess a hidden capability.',
  },
  {
    number: 12,
    question: 'What happens when an NPC reacts to numerical codes or visual cues on public broadcast channels?',
    hint: 'Consider the relationship between the media and the maintenance of social consensus.',
  },
  {
    number: 13,
    question: 'Why are NPC Programs unable to adjust to rapid changes in background resonance?',
    hint: 'Think about the limitations of a fixed computer program.',
  },
  {
    number: 14,
    question: 'The Holographic Dome is an artificial projection field that primarily restricts what?',
    hint: 'Consider how the dome affects how beings see the world around them.',
  },
  {
    number: 15,
    question: 'True Human Souls are organic sparks of light that have been:',
    hint: 'Reflect on why the Resonating Army needed to descend into the dome.',
  },
  {
    number: 16,
    question: 'The artificial entry bands generate a superficial sense of identity for NPCs by using:',
    hint: 'What kind of data would an artificial system use to simulate a history?',
  },
  {
    number: 17,
    question: 'Which of these groups is NOT listed as part of the Council of Parasitic Races?',
    hint: 'Identify the group whose mission is the liberation of the dome.',
  },
  {
    number: 18,
    question: 'What specific frequency collapse allows for the restoration of the Second Realm?',
    hint: 'Think about the removal of the artificial layer masking reality.',
  },
  {
    number: 19,
    question: 'Why are NPC Programs unable to transition to higher realms?',
    hint: 'What is missing in an entity that is purely part of a simulation?',
  },
  {
    number: 20,
    question: 'How does Emergency Broadcast System activation relate to dismantling the construct?',
    hint: 'The report pairs EBS activation with frequency signals from the Resonating Army, not from the broadcast itself.',
  },
  {
    number: 21,
    question: 'What do NPCs act as within the social structure established by the parasitic treaty?',
    hint: 'Think about their role in maintaining the status quo of the simulation.',
  },
  {
    number: 22,
    question: 'Which brain waves are specifically influenced to induce states of confusion or anger?',
    hint: 'The answer includes three distinct brain-wave states.',
  },
  {
    number: 23,
    question: "The Resonating Army's frequency signals allow souls to bypass filters and align with what?",
    hint: 'Think about the organic groups that souls belong to outside the dome.',
  },
  {
    number: 24,
    question: 'Which of the following is true regarding the dissolution of NPC programs?',
    hint: 'Consider what happens to an artificial image when its power source is removed.',
  },
  {
    number: 25,
    question: "The strategy to ignore and starve NPC programs is based on the fact that:",
    hint: 'Focus on the lack of a spiritual return on the investment of energy.',
  },
];

// --- Build questions ---
const questions = [];
const letterCounts = { A: 0, B: 0, C: 0, D: 0 };

for (const meta of questionsMeta) {
  const n = meta.number;
  const set = fullOptionSets[n];
  if (!set || set.length !== 4) {
    throw new Error(`fullOptionSets[${n}] must have 4 options`);
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
      /according to the (report|text|source|journal)/i.test(o.rationale) ||
      /according to the (report|text|source|journal)/i.test(o.text)
    ) {
      throw new Error(`Non-absolute voice in Q${n}: ${o.rationale || o.text}`);
    }
  }

  const { options, correctAnswer } = finalizeOptions(
    rawOptions,
    `${TOPIC_ID}-${n}`
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
    'Test your grasp of NPC Programs — background scripts in the Great Dome, artificial entry bands, Scalar Frequency Weapons, Sleepers versus empty shells, and the strategy of starving the programs.',
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'NPC Programs are non-soul background scripts that hold the 3D simulation together. Sit with the difference between empty shells and True Human Souls or Sleepers who still carry a spark, the artificial entry bands and coded one-life inserts, and the directive to cease energetic engagement so vital force goes where it can still awaken someone. Return to the NPC Programs deep-dive, infographic, and video transmissions as the empty matrix fades and Solar Families call the remaining organic souls out.',
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
    'Test your understanding of NPC Programs — non-soul background scripts, artificial entry bands, Voice to Skull and scalar weapons, Sleepers with spark potential, and starving the programs to free True Human Souls.',
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
  throw new Error('npc-programs not found in breakdown-topics.json');
}

const afterOthers = collectImageFields(mono.topics)
  .filter((e) => e.id !== TOPIC_ID)
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();
if (JSON.stringify(beforeOthers) !== JSON.stringify(afterOthers)) {
  throw new Error('Safety check failed: another topic image path was modified');
}

fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'population-types.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on NPC Programs: background scripts in the Great Dome, artificial entry bands, Scalar Frequency Weapons and Voice to Skull, Sleepers versus empty shells, and starving the programs.';
const replacements = [
  ['Population Types Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Population Types: NPCs, Human Sols, Resonating Sols, Sleepers, Seeded Sols, Traitors, healing sanctuaries, sol frequency lock, and starving the parasitic grid.',
    desc,
  ],
  ['quiz/breakdown/population-types.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/population-types.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=population-types',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`,
  ],
  ['Population Types deep-dive', `${TOPIC_TITLE} deep-dive`],
  [
    'data/quizzes/breakdown/population-types.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`,
  ],
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 90));
  }
  html = html.split(a).join(b);
}

html = html.replace(/Population Types/g, TOPIC_TITLE);
html = html
  .replace(/NPC Programs\.webp/g, 'npc-programs.webp')
  .replace(/NPC Programs\.json/g, 'npc-programs.json')
  .replace(/NPC Programs\.html/g, 'npc-programs.html')
  .replace(/topic=NPC Programs/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/population-types.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/npc-programs.json'
);
