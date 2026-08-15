/**
 * Installs A.I. Shells quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/npc-quiz.json
 * Title forced to "A.I. Shells". All 25 audited against ai-shells report only.
 *
 * Run: node scripts/install-ai-shells-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/ai-shells.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'ai-shells';
const TOPIC_TITLE = 'A.I. Shells';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/npc-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/ai-shells.webp';

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

/** Support phrases grounded only in ai-shells.json report. */
const supportPhrases = {
  1: ['illusion of density, separation, and geography', 'algorithmic background programs', 'stabilize and maintain'],
  2: ['artificial entry bands built around', 'route synthetic vessels', 'parasite tech/software'],
  3: ['rigid pre-coded auto-pilot', 'simulated algorithms', 'sensory signals'],
  4: ['voice to skull', 'artificial thoughts', 'manipulate and activate'],
  5: ['a.i. driven composites', 'illusion of continuity', 'replace removed public leaders'],
  6: ['dissolve like shadows', 'will not undergo a healing process', 'true light hits'],
  7: ['high-frequency priests of the cube', 'custodians', 'reincarnation loops'],
  8: ['scattered, separate continents', 'perceptual gridlock', 'layered frequency sheets'],
  9: ['starve them of attention and energy', 'fighting them only feeds', 'loosh'],
  10: ['coordinate frequencies are destabilized', 'rising vibration of the resonating army', 'major glitches'],
  11: ['nervous systems are calibrated', 'false solidity', 'dead concrete and hollow scaffolding'],
  12: ['theta, delta, and alpha', 'confusion, sleepiness, anger, or despair', 'scalar frequency weapons'],
  13: ['replace an original phased-out individual', 'public narrative maintenance', 'mimic'],
  14: ['emotional energy, or loosh', 'agricultural asset', 'genuine souls'],
  15: ['cannot match the high vibration of organic lightcraft', 'unable to perceive the arrival', 'true solar families'],
  16: ['no true past lives', 'you only live once', 'repetitive, artificial loop'],
  17: ['lures to distract, entrain, and drain', 'genuine human and e.t. souls', 'vast majority of its population'],
  18: ['unpolluted, vibrant second realm', 'synthetic, parasitic programming', 'underneath'],
  19: ['choreographed npc armies', 'television broadcasts rather than tactical', 'brink of extinction'],
  20: ['event flashes occur', 'artificial entry bands will destabilize', 'npc vessels unstable'],
  21: ['thinks for them on auto-pilot', 'do not generate original thoughts', 'a.i. parasitic system'],
  22: ['sacred solar lineage code', 'genuine individual souls', 'spiritual anchor'],
  23: ['illusion of continuity', 'holographic, or robotic stand-ins', 'public leaders'],
  24: ['dazed confusion, panic scrambling', 'communications blackout', 'codes to flicker'],
  25: ['secure ascension and liberate', 'lighthouses of stable frequency', 'vibrant second realm'],
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
 * NotebookLM meaning kept; lengths evened; claims grounded in the A.I. Shells report.
 */
const fullOptionSets = {
  1: [
    {
      text: 'Stabilizing and maintaining the illusion of density, separation, and geography inside the simulated dome.',
      rationale:
        'NPC shells are energetic fragments of light that function as algorithmic background programs designed to stabilize and maintain the illusion of density, separation, and geography within the simulated dome.',
    },
    {
      text: 'Protecting the second realm from parasitic interference as a defensive layer around awakened souls.',
      rationale:
        'NPC shells are themselves constructs of the parasitic overlay. They have no role in protecting the second realm.',
    },
    {
      text: 'Acting as biological anchors that hold incoming solar lineages inside the 3D matrix.',
      rationale:
        'NPCs do not carry the sacred solar lineage code and cannot serve as anchors for organic consciousness.',
    },
    {
      text: 'Generating organic consciousness that fuels and powers the 3D matrix from within.',
      rationale:
        'NPCs operate on a pre-coded script and receive simulated thoughts. They do not generate organic consciousness.',
    },
  ],
  2: [
    {
      text: 'Artificial entry bands built around the sun that route synthetic vessels into the 3D matrix.',
      rationale:
        'NPC shells are introduced through artificial entry bands built around the transit path of the sun. Those custom filters route synthetic vessels that carry parasite tech/software rather than organic memory.',
    },
    {
      text: 'Frequency gates hidden within the Earth\'s core that open a separate incarnation pathway.',
      rationale:
        'True solar souls enter and exit through the original high-frequency harmonic stargate. NPC shells are routed through artificial bands around the sun, not through planetary core gates.',
    },
    {
      text: 'Subliminal media broadcasts targeting expectant parents to seed new physical templates.',
      rationale:
        'Media streams carry scalar signals and activation codes that manipulate existing NPC shells. They are not the mechanism that seeds the physical templates.',
    },
    {
      text: 'Lunar transmission towers on the dark side of the moon that inject vessels into the dome.',
      rationale:
        'The seeding of NPC templates happens through artificial entry bands built around the sun\'s natural gate, not through lunar towers.',
    },
  ],
  3: [
    {
      text: 'A rigid pre-coded auto-pilot algorithmic script that processes sensory signals.',
      rationale:
        'NPC behavior is governed by a rigid pre-coded auto-pilot program that processes sensory signals based on simulated algorithms rather than soul-driven choice.',
    },
    {
      text: 'Individualized karma gathered over many past lives that shapes each new incarnation.',
      rationale:
        'NPCs have no true past lives. They are trapped in a repetitive artificial loop built on the false construct that you only live once.',
    },
    {
      text: 'The subconscious processing of ancestral memories carried through an organic lineage.',
      rationale:
        'Because they bypass the natural soul pathways, NPC shells are completely devoid of ancestral lineage and organic memory.',
    },
    {
      text: 'A collective consensus formed by sentient human interaction inside the simulation.',
      rationale:
        'NPC actions, perceptions, and movements are governed by the pre-coded auto-pilot under parasitic supervision, not by human consensus.',
    },
  ],
  4: [
    {
      text: 'Projecting artificial thoughts and voices into NPC heads to manipulate and activate them instantly.',
      rationale:
        'Voice to Skull is a scalar frequency weapon that projects artificial thoughts or literal voices into NPC heads, manipulating and activating them instantly.',
    },
    {
      text: 'Restoring telepathic communication for the Resonating Army as they hold frequency.',
      rationale:
        'Voice to Skull is a parasitic control tool used on NPCs. It is not a restoration of organic telepathy for the Resonating Army.',
    },
    {
      text: 'Transmitting harmonic healing frequencies to the 3D population to stabilize the overlay.',
      rationale:
        'Voice to Skull prompts erratic behaviors, emotional outbursts, or acts of extreme violence. It is not a healing transmission.',
    },
    {
      text: 'Scanning soul signatures of individuals in order to detect and catalog star seeds.',
      rationale:
        'Voice to Skull projects signals into the mind. It does not scan for soul signatures or catalog star seeds.',
    },
  ],
  5: [
    {
      text: 'They are replaced with A.I. driven composites, biological clones, and holographic stand-ins.',
      rationale:
        'Removed public leaders are replaced with A.I. driven composites, biological clones, and holographic stand-ins so the illusion of continuity is maintained.',
    },
    {
      text: 'They are granted retirement in the unpolluted Second Realm once their public role ends.',
      rationale:
        'The second realm is the original vibrant reality revealed after the overlay collapses. It is not a retirement home for matrix puppets.',
    },
    {
      text: 'They are immediately de-atomized so their remaining energy can feed a lunar harvest.',
      rationale:
        'The matrix keeps their apparent presence on stage with mimics and A.I. skins. Removed figures are not simply erased from the public narrative.',
    },
    {
      text: 'They are transformed into solar priests assigned to guard the original harmonic stargates.',
      rationale:
        'Removed icons become theater operators and artificial stand-ins. They are not elevated to sacred roles at the original stargate.',
    },
  ],
  6: [
    {
      text: 'They will dissolve entirely like shadows when the true light hits, with no healing process.',
      rationale:
        'Hollow NPC entities will not undergo a healing process. They dissolve like shadows when the true light hits, leaving the original vibrant second realm.',
    },
    {
      text: 'They will be integrated into the Resonating Army as newly ignited background allies.',
      rationale:
        'The Resonating Army is made of true souls. Non-sentient background programs cannot join that organic frequency.',
    },
    {
      text: 'They will undergo a healing process that grants them original souls for the next cycle.',
      rationale:
        'NPCs will not undergo a healing process. They lack a spiritual anchor and simply dissolve when the overlay collapses.',
    },
    {
      text: 'They will be moved to a different 3D planet to continue a scripted evolutionary path.',
      rationale:
        'There is no evolutionary path for these shells. They are structurally tied to the artificial overlays and dissolve when those overlays fall.',
    },
  ],
  7: [
    {
      text: 'The Custodians, the high-frequency priests of the CUBE who design reincarnation loops and manage the astral harvest.',
      rationale:
        'The Custodians act as the high-frequency priests of the CUBE. They design the reincarnation loops and manage the astral harvest cycle.',
    },
    {
      text: 'The Draconians, who act as the high-frequency priests of the CUBE and design the reincarnation loops.',
      rationale:
        'The Draconians are one of the five parasitic races in the alliance. The high-frequency priests of the CUBE are the Custodians.',
    },
    {
      text: 'The Anunnaki, who act as the high-frequency priests of the CUBE and manage the astral harvest cycle.',
      rationale:
        'The Anunnaki belong to the parasitic alliance. The priestly management of reincarnation loops and the harvest cycle belongs to the Custodians.',
    },
    {
      text: 'The Niburians, who act as the high-frequency priests of the CUBE and siphon loosh from genuine souls.',
      rationale:
        'The Niburians are members of the five main parasitic races. The high-frequency priests of the CUBE are the Custodians.',
    },
  ],
  8: [
    {
      text: 'As scattered, separate continents and planets drawn on maps and star charts.',
      rationale:
        'NPCs, including scholars and institutional authorities, construct maps and star charts that portray the world as scattered, separate continents and planets. That perceptual gridlock reinforces the illusion of borders and nations.',
    },
    {
      text: 'As interwoven, layered frequency sheets that make up the true CUBE containment.',
      rationale:
        'Interwoven, layered frequency sheets are the true structure of the CUBE containment. NPCs are programmed not to perceive that.',
    },
    {
      text: 'As a single, unified landmass without borders, nations, or geographic isolation.',
      rationale:
        'The simulation uses geographic borders and nations to force true souls to feel small, isolated, and disconnected.',
    },
    {
      text: 'As a hollow sphere with civilizations living on the interior surface of the world.',
      rationale:
        'NPC maps and star charts portray scattered, separate continents and planets, not a hollow-sphere interior civilization.',
    },
  ],
  9: [
    {
      text: 'Completely starve them of attention and energy, refusing synthetic contracts and low-frequency entrainment.',
      rationale:
        'The Resonating Army does not engage in direct conflict with NPCs. Fighting them feeds the parasitic grid with loosh. The directive is to starve them of attention and energy.',
    },
    {
      text: 'Infiltrate their institutions in order to rewrite the pre-coded auto-pilot script from within.',
      rationale:
        'The strategy is to remain calmly anchored as lighthouses and let the A.I. scaffolding collapse. Infiltration keeps souls entangled in the low-frequency overlay.',
    },
    {
      text: 'Engage them in debate so their latent soul sparks can be awakened through argument.',
      rationale:
        'NPCs have no spark ignition and no true souls. They cannot be awakened through debate.',
    },
    {
      text: 'Organize physical protests that demand the public removal of NPC shells and mimics.',
      rationale:
        'Direct conflict only feeds the parasitic grid with loosh. The directive is refusal of synthetic contracts and low-frequency entrainment.',
    },
  ],
  10: [
    {
      text: 'Destabilization of coordinate frequencies by the rising vibration of the Resonating Army.',
      rationale:
        'When coordinate frequencies are destabilized by the rising vibration of the Resonating Army, NPC programming suffers major glitches. During the first 72 hours of the communications blackout, NPCs experience a severe frequency fracture.',
    },
    {
      text: 'A simple lack of electrical power reaching the physical vessels during the blackout.',
      rationale:
        'The fracture is a frequency mismatch inside the NPC codes and grid, not a conventional electrical failure.',
    },
    {
      text: 'An overload of information arriving from the true solar families and their lightcraft.',
      rationale:
        'NPCs cannot perceive the arrival of the true solar families at all. The fracture is internal to their own programming.',
    },
    {
      text: 'A deliberate shutdown ordered by the parasitic architects to reset the simulation.',
      rationale:
        'The fracture happens because the A.I. cannot match the high vibration of organic lightcraft, not because the architects planned a shutdown.',
    },
  ],
  11: [
    {
      text: 'Their nervous systems are calibrated to project a false solidity onto dead concrete and hollow scaffolding.',
      rationale:
        'NPC nervous systems are calibrated to project a false solidity, making dead concrete and hollow scaffolding appear hard, heavy, and permanent to their limited 3D senses.',
    },
    {
      text: 'They lack the tactile receptors needed to feel true organic texture in the second realm.',
      rationale:
        'The hardness is an active calibration that projects false solidity. It is not merely a missing receptor for organic texture.',
    },
    {
      text: 'The materials are infused with high-frequency crystalline light that hardens under contact.',
      rationale:
        'Dead concrete and hollow scaffolding are low-frequency constructs of the overlay, the opposite of crystalline light.',
    },
    {
      text: 'The 3D matrix has achieved perfect physical density that no frequency can dissolve.',
      rationale:
        'Solidity is an illusion maintained by low-frequency scaffolding. The overlay is destined to collapse, not to become permanent density.',
    },
  ],
  12: [
    {
      text: 'Theta, delta, and alpha waves, used to induce confusion, sleepiness, anger, or despair.',
      rationale:
        'Scalar frequency weapons target theta, delta, and alpha waves to induce states of confusion, sleepiness, anger, or despair.',
    },
    {
      text: 'Epsilon and lambda frequencies, used to lock NPC vessels into a permanent waking state.',
      rationale:
        'The targeted patterns are theta, delta, and alpha waves, not epsilon or lambda frequencies.',
    },
    {
      text: 'Only the frequencies associated with high-level logic, used to erase emotional response.',
      rationale:
        'The weapons induce emotional and instinctual states such as confusion, anger, or despair, not a purely logical wipe.',
    },
    {
      text: 'Gamma and beta waves exclusively, used to force constant high-alert problem solving.',
      rationale:
        'The weapons specifically target theta, delta, and alpha waves rather than gamma and beta exclusively.',
    },
  ],
  13: [
    {
      text: 'They replace removed or phased-out original individuals to keep the public narrative from breaking.',
      rationale:
        'A mimic is an artificial vessel or robotic copy designed to replace an original phased-out individual for public narrative maintenance.',
    },
    {
      text: 'They act as guides who lead genuine souls through incoming crystalline crafts.',
      rationale:
        'Mimics are parasitic theater operators. They have no connection to incoming crystalline crafts or solar families.',
    },
    {
      text: 'They serve as protectors stationed at the original high-frequency harmonic stargates.',
      rationale:
        'Mimics operate inside the dome as narrative stand-ins. They do not guard the original harmonic stargate.',
    },
    {
      text: 'They are the original inhabitants of the unpolluted, vibrant Second Realm.',
      rationale:
        'Mimics are artificial vessels and robotic copies. The second realm is the unpolluted organic reality underneath the overlay.',
    },
  ],
  14: [
    {
      text: 'Emotional energy siphoned from genuine souls, harvested through the NPC field as an agricultural asset.',
      rationale:
        'The Custodians utilize the NPC field as a primary agricultural asset to siphon emotional energy, or loosh, from genuine souls.',
    },
    {
      text: 'The liquid crystal substance used to manufacture empty NPC templates around the sun.',
      rationale:
        'NPC shells are energetic fragments of light and empty physical templates carrying parasitic software. Loosh is harvested emotional energy, not a manufacturing fluid.',
    },
    {
      text: 'A specialized code used to unlock the original high-frequency harmonic stargate.',
      rationale:
        'Loosh is emotional energy siphoned from genuine souls. It is a harvest product, not a key for the original stargate.',
    },
    {
      text: 'The high-vibration fuel used by incoming organic lightcraft of the solar families.',
      rationale:
        'Organic lightcraft operate beyond the A.I.\'s low-frequency range. Loosh is a low-frequency parasitic harvest, not lightcraft fuel.',
    },
  ],
  15: [
    {
      text: 'The A.I. cannot match the high vibration of organic lightcraft, so NPCs remain trapped in the crumbling 3D illusion.',
      rationale:
        'Because the A.I. cannot match the high vibration of organic lightcraft, NPCs are completely unable to perceive the arrival of the true solar families and remain trapped in a crumbling 3D illusion.',
    },
    {
      text: 'The NPC script simply forbids any acknowledgment of extra-terrestrial life in public speech.',
      rationale:
        'The barrier is structural. NPCs are low-vibration constructs that cannot perceive higher-dimensional realities such as the true crystalline crafts.',
    },
    {
      text: 'The solar families are entering only the Second Realm and never appear near the 3D dome.',
      rationale:
        'Even when the true solar families arrive, NPCs cannot perceive them because their receivers stay locked to the low-frequency overlay.',
    },
    {
      text: 'The lightcraft use advanced holographic cloaking that hides them from every observer.',
      rationale:
        'The invisibility is a frequency limitation of the NPC field, not a cloaking device used by the lightcraft.',
    },
  ],
  16: [
    {
      text: 'NPCs have no true past lives and are trapped in a repetitive, artificial loop built on "you only live once."',
      rationale:
        'Unlike living souls, NPCs have no true past lives and are trapped in a repetitive, artificial loop built on the false construct that you only live once.',
    },
    {
      text: 'NPCs carry the karmic debt of multiple previous iterations stored in their vessels.',
      rationale:
        'NPCs have no spark ignition and no true souls, so they do not carry karmic debt from previous lives.',
    },
    {
      text: 'NPCs are souls who chose to forget their history in order to play a one-life game.',
      rationale:
        'NPCs are non-sentient background programs. They never had a soul history to forget.',
    },
    {
      text: 'NPCs represent the first stage of soul evolution before they take a first true life.',
      rationale:
        'NPC shells are empty physical templates carrying parasitic software. They are not a stage in organic soul evolution.',
    },
  ],
  17: [
    {
      text: 'Acting as lures to distract, entrain, and drain genuine human and E.T. souls.',
      rationale:
        'The vast majority of the population is comprised of non-sentient NPCs who act as lures to distract, entrain, and drain genuine human and E.T. souls.',
    },
    {
      text: 'Balancing the frequency of the dome so the overlay cannot collapse ahead of schedule.',
      rationale:
        'NPC shells stabilize the illusion of density and geography, but their role toward genuine souls is to distract, entrain, and drain them.',
    },
    {
      text: 'Serving as a biological database that preserves human genetic diversity for later use.',
      rationale:
        'NPC vessels are empty physical templates carrying parasitic software rather than organic memory or solar lineage.',
    },
    {
      text: 'Providing the workforce that will construct the unpolluted Second Realm after collapse.',
      rationale:
        'NPCs are tied to the collapsing 3D overlay and dissolve with it. They do not build the second realm.',
    },
  ],
  18: [
    {
      text: 'The unpolluted, vibrant second realm that remains after synthetic parasitic programming is gone.',
      rationale:
        'Dissolution of the NPC vessels cleanses the realm and reveals the unpolluted, vibrant second realm underneath without synthetic, parasitic programming.',
    },
    {
      text: 'The central processing hub of the Black Cube A.I. that survives the overlay collapse.',
      rationale:
        'Black cube A.I. tech belongs to the parasitic overlay that collapses. What remains underneath is the original vibrant second realm.',
    },
    {
      text: 'A void of complete nothingness left behind when the pixelated field dissolves.',
      rationale:
        'What remains is the original, unpolluted, vibrant second realm, not a void.',
    },
    {
      text: 'A mirror image of the 3D simulation rebuilt with the same maps and borders.',
      rationale:
        'The second realm is the original organic reality underneath the overlay, not a rebuilt copy of the 3D simulation.',
    },
  ],
  19: [
    {
      text: 'They will move in choreographed ways designed for television broadcasts rather than tactical necessity.',
      rationale:
        'Choreographed NPC armies will move in ways designed specifically for television broadcasts rather than tactical necessity, to convince the mass mind that humanity is on the brink of extinction.',
    },
    {
      text: 'They will display highly tactical and unpredictable combat strategies in genuine warfare.',
      rationale:
        'NPC armies run on pre-coded scripts. Their movements are theater for broadcast, not genuine tactical warfare.',
    },
    {
      text: 'They will protect civilians from the five parasitic races during the staged events.',
      rationale:
        'NPC armies are tools of the artificial A.I. war theatre. They are used to instill a false extinction narrative, not to protect civilians.',
    },
    {
      text: 'They will immediately defect and join the Resonating Army as soon as the EBS begins.',
      rationale:
        'NPCs are non-sentient background programs. They cannot change allegiance to an organic cause.',
    },
  ],
  20: [
    {
      text: 'They will destabilize, rendering NPC vessels unstable so the shells dissolve into the pixelated field.',
      rationale:
        'As the event flashes occur, the artificial entry bands will destabilize, rendering the NPC vessels unstable and causing them to dissolve into the pixelated field.',
    },
    {
      text: 'They will be repurposed by star families as rescue corridors for remaining NPC shells.',
      rationale:
        'The bands are parasitic infrastructure. They destabilize and take the NPC vessels with them rather than being reused as rescue corridors.',
    },
    {
      text: 'They will become the primary gateway used by true souls to enter the Second Realm.',
      rationale:
        'True solar souls use the original high-frequency harmonic stargate. The second realm is revealed by removing the artificial layers, not by using the parasitic bands.',
    },
    {
      text: 'They will expand to cover the entire solar system as a last-ditch containment net.',
      rationale:
        'The event flashes destabilize the artificial entry bands. The overlay collapses rather than expanding.',
    },
  ],
  21: [
    {
      text: 'It thinks for them on auto-pilot, because they do not generate original thoughts.',
      rationale:
        'NPC minds are completely controlled by the A.I. parasitic system. They do not generate original thoughts; the system thinks for them on auto-pilot.',
    },
    {
      text: 'It allows them to generate limited creative energy that they can spend as they choose.',
      rationale:
        'NPCs receive simulated thoughts and instructions. They do not generate original thoughts or creative energy of their own.',
    },
    {
      text: 'It provides them with a simulated soul-evolution path toward eventual spark ignition.',
      rationale:
        'NPCs have no spark ignition and no true souls. They are static background programs, not souls on an evolution path.',
    },
    {
      text: 'It protects them from the influence of the Resonating Army so their codes stay stable.',
      rationale:
        'The rising vibration of the Resonating Army destabilizes NPC codes. The system uses NPCs as tools; it does not shield them from that frequency.',
    },
  ],
  22: [
    {
      text: 'The presence of the sacred solar lineage code and a spiritual anchor outside the CUBE.',
      rationale:
        'NPCs do not possess genuine individual souls and do not carry the sacred solar lineage code. They also lack a spiritual anchor outside the CUBE containment.',
    },
    {
      text: 'Their level of education and social standing inside the public leadership structure.',
      rationale:
        'Public leadership and authoritative positions are almost entirely populated by NPC shells or A.I. driven composites. Status is not the differentiator.',
    },
    {
      text: 'Their ability to perform well and succeed within the rules of the 3D matrix.',
      rationale:
        'The matrix is built for NPC shells on auto-pilot. Performing well inside it does not prove a soul is present.',
    },
    {
      text: 'The complexity of their emotional outbursts when scalar frequencies strike the field.',
      rationale:
        'NPC emotional outbursts are often triggered by Voice to Skull and scalar weapons. Complexity of reaction is not a soul marker.',
    },
  ],
  23: [
    {
      text: 'To maintain the illusion of continuity in public leadership after original figures are removed.',
      rationale:
        'A.I. driven composites — digital, holographic, or robotic stand-ins — replace removed public leaders so the illusion of continuity is maintained.',
    },
    {
      text: 'To allow high-frequency star families to walk among humans in borrowed bodies.',
      rationale:
        'These stand-ins are parasitic theater operators. They are not vessels for incoming solar families.',
    },
    {
      text: 'To test the resolution of the pixelated field before the overlay is allowed to collapse.',
      rationale:
        'Biological copies, stand-in actors, and advanced mimics exist to keep the public narrative from breaking, not to test field resolution.',
    },
    {
      text: 'To provide more vessels that incoming solar souls can occupy after the event flashes.',
      rationale:
        'These artificial vessels carry parasitic software and cannot house organic solar souls.',
    },
  ],
  24: [
    {
      text: 'They will experience dazed confusion, panic scrambling, and unexpected emotional outbursts.',
      rationale:
        'During the first 72 hours of the communications blackout, NPCs experience a severe frequency fracture. Their codes flicker, resulting in dazed confusion, panic scrambling, and unexpected emotional outbursts.',
    },
    {
      text: 'They will regain the ability to generate original thoughts once the central script drops.',
      rationale:
        'NPCs cannot generate original thoughts. The blackout fractures their pre-coded stability; it does not grant them a mind of their own.',
    },
    {
      text: 'They will begin to act in unison to rebuild the matrix during the first 72 hours.',
      rationale:
        'The frequency fracture makes their codes flicker. The result is confusion and panic, not a unified rebuild.',
    },
    {
      text: 'They will become completely silent and enter a long hibernation until the overlay returns.',
      rationale:
        'The blackout produces dazed confusion, panic scrambling, and unexpected emotional outbursts, not silent hibernation.',
    },
  ],
  25: [
    {
      text: 'Ascension and liberation of the realm, remaining as lighthouses until the vibrant second realm is revealed.',
      rationale:
        'To secure ascension and liberate the realm, true souls remain calmly anchored as lighthouses of stable frequency. The overlay collapses and the unpolluted, vibrant second realm is revealed.',
    },
    {
      text: 'Transitioning into robotic vessels so they can keep an eternal physical life in the dome.',
      rationale:
        'Robotic vessels and A.I. skins are parasitic mimics. The Resonating Army is oriented toward organic solar light, not robotic permanence.',
    },
    {
      text: 'Becoming the new custodians of the CUBE containment after the parasitic races depart.',
      rationale:
        'The goal is liberation from the CUBE containment, not taking over its management.',
    },
    {
      text: 'Re-entering the reincarnation loop so they can help remaining NPCs ignite soul sparks.',
      rationale:
        'The reincarnation loop is a parasitic harvest cycle. NPCs have no spark ignition, and the army does not re-enter that loop to convert them.',
    },
  ],
};

const questionsMeta = [
  {
    number: 1,
    question: 'What is the primary function of NPC shells within the 3D matrix?',
    hint: 'Consider the role of background programs in a simulation.',
  },
  {
    number: 2,
    question: 'Which mechanism is used to seed synthetic vessels into the 3D matrix while bypassing natural stargates?',
    hint: 'Think about the celestial transit path used for entering and exiting this realm.',
  },
  {
    number: 3,
    question: 'What defines the behavioral governance of an NPC?',
    hint: 'Think about how software dictates the movements of a character in a game.',
  },
  {
    number: 4,
    question: "What is the intended purpose of Voice to Skull technology?",
    hint: 'Consider how external signals can be used to override internal thought processes.',
  },
  {
    number: 5,
    question: 'How are public leaders and cultural icons typically managed within the matrix once removed?',
    hint: 'Consider the need for continuity in a scripted public reality.',
  },
  {
    number: 6,
    question: 'What will happen to NPC shells when the 3D matrix finally collapses?',
    hint: 'Reflect on what happens to a shadow when the source of artificial light is removed.',
  },
  {
    number: 7,
    question: 'Which parasitic race acts as the high-frequency priests of the CUBE containment?',
    hint: 'This group oversees the structural management of the harvest cycle.',
  },
  {
    number: 8,
    question: 'How do NPCs perceive the geography of the world within the CUBE containment?',
    hint: 'Consider how borders and maps contribute to a sense of isolation.',
  },
  {
    number: 9,
    question: 'What is the strategic directive for the Resonating Army regarding NPCs?',
    hint: 'Focus on the flow of energy and attention.',
  },
  {
    number: 10,
    question: 'What causes the frequency fracture NPCs will experience during a communications blackout?',
    hint: 'Think about what happens when a low-frequency system is hit by high-frequency input.',
  },
  {
    number: 11,
    question: 'Why do NPCs perceive dead concrete and hollow scaffolding as hard and permanent?',
    hint: 'Consider how a simulation might convince a user that a virtual object is solid.',
  },
  {
    number: 12,
    question: 'Which brainwave patterns are specifically targeted by scalar frequency weapons for NPC manipulation?',
    hint: 'These waves are typically associated with relaxation, sleep, and suggestibility.',
  },
  {
    number: 13,
    question: "What is the role of Mimics in maintaining the simulation?",
    hint: 'Think about how a production replaces an actor without the audience noticing.',
  },
  {
    number: 14,
    question: 'What is loosh within the context of the CUBE containment?',
    hint: 'Think of it as a form of energy currency extracted through suffering.',
  },
  {
    number: 15,
    question: 'Why can NPCs not perceive the arrival of true solar families or their lightcraft?',
    hint: 'Consider the limitations of a sensor designed only for low-frequency signals.',
  },
  {
    number: 16,
    question: 'Which of the following describes the relationship between NPCs and past lives?',
    hint: 'Consider the construct that you only live once.',
  },
  {
    number: 17,
    question: "What role does the NPC field play in the 3D simulation?",
    hint: 'Think of them as interactive distractions within a controlled environment.',
  },
  {
    number: 18,
    question: 'What is the true nature of the realm hidden underneath the 3D overlay?',
    hint: 'Consider what remains when the shadows and pixelated field dissolve.',
  },
  {
    number: 19,
    question: 'How will NPC armies behave during the simulated geopolitical events?',
    hint: 'Think about the concept of theatre in a scripted disclosure event.',
  },
  {
    number: 20,
    question: 'What happens to the artificial entry bands during the final event flashes?',
    hint: 'Consider the impact of a total system failure on its infrastructure.',
  },
  {
    number: 21,
    question: 'What does the A.I. parasitic system do for NPCs?',
    hint: 'Think about who generates thoughts in an entity that is total braindead from day one.',
  },
  {
    number: 22,
    question: 'What determines whether an entity is an NPC shell or a genuine soul?',
    hint: 'Look for the specific spark or code mentioned as the differentiator.',
  },
  {
    number: 23,
    question: 'What is the purpose of using biological clones and holographic stand-ins?',
    hint: 'Consider why someone would want to keep a famous face around after the original person is gone.',
  },
  {
    number: 24,
    question: 'How will the communications blackout affect the behavior of NPCs?',
    hint: 'Think of the reaction of a program that has lost its central server connection.',
  },
  {
    number: 25,
    question: "What is the long-term destination of the Resonating Army?",
    hint: 'It involves the cleaning of the realm and the reveal of what lies beneath the pixelated field.',
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
  if (/according to the (report|text|source|journal|material)/i.test(qText)) {
    throw new Error(`Non-absolute voice in Q${n} stem: ${qText}`);
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
    'Test your grasp of A.I. Shells — non-sentient NPC vessels, artificial entry bands, Voice to Skull and scalar weapons, mimics and A.I. composites, and starving the programs as the overlay dissolves.',
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'A.I. Shells are non-sentient NPC vessels with no genuine souls or solar lineage — algorithmic background programs that hold the 3D illusion together. Sit with the difference between empty shells and genuine souls who carry the sacred solar lineage code, the artificial entry bands and Voice to Skull activation, and the instruction to starve these programs of attention so a stabilized lighthouse frequency can dissolve the automated grid. Return to the A.I. Shells deep-dive, infographic, and video transmissions as those shadows fade in the true light of the realm.',
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
    'Test your understanding of A.I. Shells — non-sentient NPC vessels, artificial entry bands, Voice to Skull and scalar weapons, mimics and A.I. composites, and starving the programs as the overlay dissolves.',
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
  throw new Error('ai-shells not found in breakdown-topics.json');
}

const afterOthers = collectImageFields(mono.topics)
  .filter((e) => e.id !== TOPIC_ID)
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();
if (JSON.stringify(beforeOthers) !== JSON.stringify(afterOthers)) {
  throw new Error('Safety check failed: another topic image path was modified');
}

fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'background-fragments.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on A.I. Shells: non-sentient NPC vessels, artificial entry bands, Voice to Skull and scalar weapons, mimics and A.I. composites, and starving the programs as the overlay dissolves.';
const replacements = [
  ['Background Fragments Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Background Fragments: soulless light-force projections, artificial entry bands, Voice to Skull and scalar weapons, coded one-life inserts, glitching under frequency fracture, and starving the programs.',
    desc,
  ],
  ['quiz/breakdown/background-fragments.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/background-fragments.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=background-fragments',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`,
  ],
  ['Background Fragments deep-dive', `${TOPIC_TITLE} deep-dive`],
  [
    'data/quizzes/breakdown/background-fragments.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`,
  ],
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 90));
  }
  html = html.split(a).join(b);
}

html = html.replace(/Background Fragments/g, TOPIC_TITLE);
html = html
  .replace(/background-fragments\.webp/g, 'ai-shells.webp')
  .replace(/background-fragments\.json/g, 'ai-shells.json')
  .replace(/background-fragments\.html/g, 'ai-shells.html')
  .replace(/topic=background-fragments/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/background-fragments.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/ai-shells.json'
);
