/**
 * Installs Overlay Clearing quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/overlay-quiz.json
 * Title forced to "Overlay Clearing". All 25 audited against overlay-clearing report only.
 *
 * Run: node scripts/install-overlay-clearing-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/overlay-clearing.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'overlay-clearing';
const TOPIC_TITLE = 'Overlay Clearing';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/overlay-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/overlay-clearing.webp';

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

/** Support phrases grounded only in overlay-clearing.json report. */
const supportPhrases = {
  1: ['living granite', 'pure crystalline material', 'quartz'],
  2: ['sensory nervous system', 'holographical projection', 'dead stone'],
  3: ['conscious orbs of electricity', 'crystalline body selves', 'hovering above'],
  4: ['targeted harmonic frequencies', 'crystal slabs', 'source codes of creation'],
  5: ['saferins', 'council of 12 suns', 'ground healers'],
  6: ['water domes', 'mend the heart', 'liquid sound'],
  7: ['flicker, bend, and shimmer', 'second realm', 'concrete cities'],
  8: ['lyran builders-architects', 'andromedan and pleiadian', 'solar builders'],
  9: ['light body grid', 'energetic circuit template'],
  10: ['loop collectors', 'harvest human loosh', 'custodians'],
  11: ['star pods', 'timeline trauma', 'karmic wounds'],
  12: ['parasite whispers', 'artificial thoughts', 'neurological programming'],
  13: ['harmonic coding', 'undistorted signature', 'scalar weapons'],
  14: ['stable beacons', 'frequency anchors', 'ebs truth broadcasts'],
  15: ['second realm', 'unpolluted reality', 'vibrant'],
  16: ['artificial amnesia', 'peeled away', 'galactic libraries'],
  17: ['resonating army', '3rd-density frequency band', 'solar families'],
  18: ['breathe with light', 'living crystal walls', 'crystalline amplifiers'],
  19: ['crystal prisms', 'light body grid', 'cognitive blockages'],
  20: ['manifestation', 'telepathic navigation', 'multi-dimensional awareness'],
  21: ['hyperborean spirit tree', 'loop collectors', 'custodians'],
  22: ['singing for the first time', 'inner spark', 'unburdened'],
  23: ['andromedan and pleiadian', 'lyran builders-architects'],
  24: ['mend the mind', 'systemic cognitive damage', 'perceptual traps'],
  25: ['perception-based', 'holographical projections', 'bricks, plaster, glass'],
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
    [/\baccording to the (report|source|text|core revelations|revelations|material|journal|living truth)\b/gi, ''],
    [/^The source states that\s+/i, ''],
    [/^The source states\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/\bthe text explicitly lists\b/gi, ''],
    [/\bthe text describes\b/gi, ''],
    [/\bthe text states\b/gi, ''],
    [/\bthe source explains\b/gi, ''],
    [/\bthe source identifies\b/gi, ''],
    [/\bis described as\b/gi, 'is'],
    [/\bare described as\b/gi, 'are'],
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
 * All four options at similar depth from the overlay-clearing report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'Living crystal, quartz, and living granite that glow with rainbow fractals and breathe like lungs of light.',
      rationale:
        'Cathedrals, churches, and abbeys are pre-existing healing chambers of pure crystalline material, quartz, and living granite, glowing with rainbow fractals and breathing like lungs of light.',
    },
    {
      text: 'Reinforced concrete halls poured as ordinary civic monuments and then painted with a thin holographic skin.',
      rationale:
        'Concrete is a low-frequency holographical projection of the overlay, not the true foundation of the Crystal Halls.',
    },
    {
      text: 'Dead stone and soil harvested from the Second Realm and stacked into inert religious monuments for worship.',
      rationale:
        'The Second Realm is the vibrant unpolluted reality underneath. Dead stone is the overlay disguise, not material taken from that realm.',
    },
    {
      text: 'Ancient limestone and fossilized organic matter built as conventional houses of worship and nothing more.',
      rationale:
        'The dead-stone appearance is the parasitic overlay tricking the nervous system. The true architecture is living crystal.',
    },
  ],
  2: [
    {
      text: 'It projects a low-frequency holographical field that tricks the sensory nervous system into seeing dead matter.',
      rationale:
        'The parasitic overlay is a frequency-based sensory illusion projected over the true fabric of the realm, designed to trick the nervous system into perceiving living crystal as dead stone, brick, concrete, or dirt.',
    },
    {
      text: 'It raises a psychic barrier that only ordained religious practitioners are allowed to pass through at all.',
      rationale:
        'These are pre-existing healing chambers. Religious devotion is a later co-option narrative, not a gatekeeping requirement for entry.',
    },
    {
      text: 'It forces every nearby soul into deep sleep so no one can physically walk into the temple grounds.',
      rationale:
        'The overlay does not block entry. Souls enter the halls; the camouflage hides the living crystal until the clearing begins.',
    },
    {
      text: 'It uses physical cloaking hardware to bury the entire structure underground and keep it out of sight.',
      rationale:
        'The halls stand in plain view as cathedrals and abbeys. The cloak is sensory, not a physical burial of the building.',
    },
  ],
  3: [
    {
      text: 'A conscious orb of electricity hovering above the slab in the crystalline body self.',
      rationale:
        'Human and starseed souls shift into their crystalline body selves and function as conscious orbs of electricity, hovering above massive crystal slabs.',
    },
    {
      text: 'A translucent physical vessel standing upright on the slab while the flesh body stays fully engaged.',
      rationale:
        'The soul shifts out of the physical vessel into the crystalline body self. It does not remain as standing flesh on the slab.',
    },
    {
      text: 'A stream of liquid sound flowing through the heart, the same medium used in Water Dome pools.',
      rationale:
        'Liquid sound belongs to Water Dome pools that mend the heart. On the slabs the soul is a hovering conscious orb of electricity.',
    },
    {
      text: 'A flat geometric pattern of light pressed into the floor so the slab can scan it like a static diagram.',
      rationale:
        'The light body grid has circuit structure, but the soul itself is a conscious orb of electricity hovering above the slab.',
    },
  ],
  4: [
    {
      text: 'To transmit targeted harmonic frequencies calibrated to the soul’s original Source codes of creation.',
      rationale:
        'Crystal slabs are humming quartz-like platforms that transmit targeted harmonic frequencies. That deep hum is calibrated to the pristine ancient Source codes of creation embedded in the soul’s template.',
    },
    {
      text: 'To siphon emotional density out of the heart and send it onward as fuel for the Second Realm.',
      rationale:
        'Drawing out emotional density is the work of Water Dome liquid-sound pools. Crystal slabs restore harmonic coding and mental frequency.',
    },
    {
      text: 'To physically pin the soul in place so it cannot leave until every overlay layer has been processed.',
      rationale:
        'The soul hovers above the slabs. The platforms transmit frequency; they do not restrain or bind the orb.',
    },
    {
      text: 'To record the current lifetime as a new file and store it only inside the Vatican crystal networks.',
      rationale:
        'The slabs transmit healing frequencies. Memory streams are already logged in galactic libraries and earth’s deep crystal hard drives.',
    },
  ],
  5: [
    {
      text: 'Saferins — Ground Healers from the Council of 12 Suns who stabilize souls without using force.',
      rationale:
        'Clearing is supervised by Ground Healers, also known as Saferins — tall, luminous, benevolent E.T. beings from the Council of 12 Suns. They operate without force, stabilizing souls and mirroring soul-family energy.',
    },
    {
      text: 'Lyran architect-builders who still occupy the halls and personally run every live clearing session.',
      rationale:
        'Lyran builders-architects originally designed and anchored the temples. The beings who stabilize souls during the current clearing are Saferins.',
    },
    {
      text: 'Custodians from the priestly class of the Cube, now recast as gentle attendants inside the temples.',
      rationale:
        'Custodians are the parasitic priestly class of the Cube who built over the nodes to siphon energy, not benevolent healers.',
    },
    {
      text: 'The Resonating Army, already cleared, acting as the primary supervisors of every Crystal Hall session.',
      rationale:
        'The Resonating Army are cleared souls who later act as frequency anchors. Saferins from the Council of 12 Suns supervise the halls.',
    },
  ],
  6: [
    {
      text: 'They mend the heart by drawing out emotional density through pools of liquid sound.',
      rationale:
        'In the tripartite restorative ecosystem, Water Domes mend the heart by drawing out emotional density through liquid sound pools, while Crystal Halls mend the mind.',
    },
    {
      text: 'They log every soul journey into the earth’s deep crystal hard drives as the official memory archive.',
      rationale:
        'Crystal structures download unbroken timelines from galactic libraries and earth’s deep crystal hard drives. That is not the Water Dome role.',
    },
    {
      text: 'They restore the physical 3D body’s genetic sequence so the flesh vessel can stay permanently intact.',
      rationale:
        'Water Domes address the heart and emotional density. They are not a genetic repair bay for the 3D vessel.',
    },
    {
      text: 'They purge parasite whispers from the mind by broadcasting the same slab hum used in Crystal Halls.',
      rationale:
        'Silencing parasite whispers is a Crystal Hall function. Water Domes work through liquid sound on the heart, not mental overlays.',
    },
  ],
  7: [
    {
      text: 'The hollow 3D scaffolding, concrete cities, and artificial borders begin to flicker, bend, and shimmer.',
      rationale:
        'As the light body’s frequency rises, the illusion of hollow 3D scaffolding, concrete cities, and artificial borders begins to flicker, bend, and shimmer, revealing the vibrant unpolluted reality of the Second Realm.',
    },
    {
      text: 'Every city and border is instantly replaced by a featureless void of pure white light with no landscape.',
      rationale:
        'What appears is the vibrant, unpolluted reality of the Second Realm, not a blank white void.',
    },
    {
      text: 'The soul loses all visual perception of the world and must navigate by sound alone until the Event Cycle.',
      rationale:
        'Perception is realigned, not erased. The soul sees the true crystalline reality underneath the overlay.',
    },
    {
      text: 'Brick, glass, and metal grow denser and more permanent as the light body locks into the 3D band.',
      rationale:
        'Higher frequency dissolves the illusion of solidity. Bricks, plaster, glass, and metal collapse as holographical projections.',
    },
  ],
  8: [
    {
      text: 'Lyran builders-architects, working with Andromedan and Pleiadian solar builders before the invasion.',
      rationale:
        'The temples were originally designed and anchored by the Lyran builders-architects, alongside Andromedan and Pleiadian solar builders, long before the parasitic invasion.',
    },
    {
      text: 'The Vatican, which poured the halls as loosh-harvest temples and then disguised them as cathedrals.',
      rationale:
        'Parasitic Custodians later built over the nodes to siphon energy. They did not design or anchor the original Crystal Halls.',
    },
    {
      text: 'Saturnian cube technicians who first laid the slabs as broadcast towers for the 3rd-density containment.',
      rationale:
        'Saturnian cube-tech later managed amnesia vortexes and reincarnation loops. The original builders were Lyran, Andromedan, and Pleiadian.',
    },
    {
      text: 'Saferins from the Council of 12 Suns, who constructed the halls during the current clearing phase.',
      rationale:
        'Saferins supervise and stabilize souls during clearing. They did not originally design or anchor the temples.',
    },
  ],
  9: [
    {
      text: 'The foundational energetic circuit template of the soul, restored to creation-level frequency in healing.',
      rationale:
        'The Light Body Grid is the foundational energetic circuit template of the soul, realigned and restored to its original creation-level frequency during healing.',
    },
    {
      text: 'A holographic copy of the physical nervous system projected over the body as a temporary medical map.',
      rationale:
        'The grid is the soul’s own energetic circuit template, not a projection of 3D nerves drawn for medical display.',
    },
    {
      text: 'A planetary network of fiber-optic Source lines running under the earth and independent of the soul.',
      rationale:
        'Planetary grids, ley-lines, and fiber-optic lines of Source interconnect the sanctuaries. The Light Body Grid is internal to the soul.',
    },
    {
      text: 'An artificial implant used to track conscious orbs and keep them locked inside the 3D overlay.',
      rationale:
        'The Light Body Grid is a natural creation-level template. Foreign implants are what the clearing purges, not the grid itself.',
    },
  ],
  10: [
    {
      text: 'To siphon their energy and convert the nodes into loop collectors that harvest human loosh.',
      rationale:
        'After the Hyperborean Spirit Tree was removed, parasitic Custodians — the priestly class of the Cube — built over these nodes to siphon their energy, converting them into loop collectors to harvest human loosh.',
    },
    {
      text: 'To archive authentic memory streams in Vatican underground crystal networks for public disclosure later.',
      rationale:
        'Vatican underground crystal networks later managed counterfeit reincarnation loops and amnesia vortexes. Building over the nodes was done to siphon energy.',
    },
    {
      text: 'To shield the temples from the coming collapse of the 3D grid and keep their harmonic output intact.',
      rationale:
        'Custodians built over the nodes to suppress natural harmonic output and siphon energy, not to protect the halls.',
    },
    {
      text: 'To raise a crystalline bridge so the Council of 12 Suns could walk the remaining population home.',
      rationale:
        'The Council of 12 Suns sends Saferins as healers. Custodians used the nodes as loop collectors for loosh, not as a homecoming bridge.',
    },
  ],
  11: [
    {
      text: 'Timeline trauma and deep karmic wounds across lifetimes, mended in etheric-space Star Pods.',
      rationale:
        'Star Pods are deployed in etheric space to mend the soul’s timeline trauma and deep karmic wounds across lifetimes, while Crystal Halls mend the mind.',
    },
    {
      text: 'Neurological programming and mind-control damage, which the Crystal Halls actually leave untouched.',
      rationale:
        'Mind-control damage, cognitive blockages, and parasite whispers are cleared in the Crystal Halls, not in the Star Pods.',
    },
    {
      text: 'Low-frequency background noise of the simulation, silenced only after the Star Pods finish their work.',
      rationale:
        'Neutralizing parasite whispers — the low-frequency background noise and artificial voices — is a Crystal Hall function.',
    },
    {
      text: 'Restoration of the physical 3D vessel’s nervous system so the flesh body can remain the main vehicle.',
      rationale:
        'The restorative ecosystem mends heart, mind, and soul. Star Pods address timeline and karmic wounds, not 3D nerve tissue.',
    },
  ],
  12: [
    {
      text: 'Artificial thoughts, low-frequency neurological programming, and cognitive distortions broadcast into the mind.',
      rationale:
        'Parasite Whispers are artificial thoughts, low-frequency neurological programming, and cognitive distortions broadcast into the mind to disrupt sovereignty. Clearing silences that noise and the NPC programming that prompts fear, guilt, anger, or despair.',
    },
    {
      text: 'The deep healing hum of the crystal slabs, mistaken for parasitic interference because that continuous tone never stops.',
      rationale:
        'The slab hum restores the original undistorted signature. Parasite whispers are artificial broadcasts, not the temple’s healing tone.',
    },
    {
      text: 'Telepathic guidance from the Lyran architect-builders, sent as a quiet stream that steers every clearing session.',
      rationale:
        'Lyran builders anchored the temples long before the invasion. Parasite whispers are low-frequency control noise, not builder guidance.',
    },
    {
      text: 'The collective memory of humanity as it floods back during the Event Cycle and the later EBS truth broadcasts.',
      rationale:
        'Whispers are artificial and disruptive. Authentic memory streams are restored from galactic libraries, not from parasitic broadcasts.',
    },
  ],
  13: [
    {
      text: 'The slab’s continuous hum restores the soul’s original signature, scrambled by scalar weapons and grid noise.',
      rationale:
        'The continuous hum of the crystal slabs restores the soul’s original, undistorted signature, which has been scrambled by artificial scalar weapons, music grid glitches, and electromagnetic noise.',
    },
    {
      text: 'The soul is issued a brand-new identity so it can survive the 3D collapse without its original codes.',
      rationale:
        'The process restores the original, undistorted signature. It does not replace the soul with a new artificial identity.',
    },
    {
      text: 'The soul’s memory is wiped clean so the transition into the Second Realm can start from a blank slate.',
      rationale:
        'Overlays of artificial amnesia are peeled away and authentic memory streams are restored, not wiped.',
    },
    {
      text: 'The Light Body Grid is cut away from planetary ley-lines so the soul can no longer feel the earth.',
      rationale:
        'The sanctuaries are interwoven with planetary grids, ley-lines, and fiber-optic lines of Source. Realignment reconnects, it does not sever.',
    },
  ],
  14: [
    {
      text: 'They stand as stable beacons and frequency anchors, unjammed through disclosures and EBS broadcasts.',
      rationale:
        'Realigned souls are completely unjammed. They do not collapse in panic during mass disclosures and EBS truth broadcasts. They act as stable beacons and frequency anchors, shortening the staged alien-invasion narrative and guiding others across the crystalline bridge.',
    },
    {
      text: 'They lead a physical ground war against Custodian forces once the old grid finally pixilates away.',
      rationale:
        'Their role is frequency-based: beacons and anchors who shorten the staged invasion narrative, not a physical army against Custodians.',
    },
    {
      text: 'They take over the Vatican’s underground crystal networks and personally run the EBS truth broadcasts.',
      rationale:
        'Cleared souls hold frequency for the masses. The Vatican networks are the old amnesia machinery being dismantled, not their new control booth.',
    },
    {
      text: 'They teleport at once to their original solar families and leave the remaining population behind.',
      rationale:
        'During the Event Cycle they stay as anchors and guides. The later phase-out of the Resonating Army happens after that anchoring work.',
    },
  ],
  15: [
    {
      text: 'The vibrant, unpolluted reality that appears as the 3D illusion flickers, bends, and shimmers away.',
      rationale:
        'As frequency rises, hollow 3D scaffolding begins to flicker, bend, and shimmer, allowing the soul to see the vibrant, unpolluted reality of the Second Realm.',
    },
    {
      text: 'A distant galaxy where the Council of 12 Suns lives, reachable only after leaving this solar system.',
      rationale:
        'The Second Realm is the underlying local reality revealed when the 3D overlay fails, not a far-off council homeworld.',
    },
    {
      text: 'A replacement digital simulation built by the Lyrans to stand in for the crumbling old grid.',
      rationale:
        'The Second Realm is unpolluted reality under the overlay, not another simulation authored as a substitute grid.',
    },
    {
      text: 'The etheric staging zone where Star Pods wait, separate from the world the overlay is hiding.',
      rationale:
        'Star Pods operate in etheric space to mend timeline trauma. The Second Realm is the broader pristine reality under the 3D disguise.',
    },
  ],
  16: [
    {
      text: 'It is systematically peeled away as the unbroken timeline downloads from galactic libraries and crystal drives.',
      rationale:
        'Overlays of artificial amnesia are systematically peeled away. The crystal structures download the unbroken timeline of the soul’s multi-dimensional journey, permanently logged in the galactic libraries and preserved by the earth’s deep crystal hard drives.',
    },
    {
      text: 'It stays locked in place until the soul has fully left the Great Dome and the Event Cycle is over.',
      rationale:
        'Memory restoration happens inside the Crystal Halls during overlay clearing, not after departure from the dome.',
    },
    {
      text: 'It is converted into a storage drive that holds Event Cycle instructions and staged-invasion briefing files.',
      rationale:
        'Amnesia is removed and authentic memory is restored. It is not recycled into another control mechanism.',
    },
    {
      text: 'It is thickened on purpose so past-life trauma cannot flood the soul before the EBS broadcast begins.',
      rationale:
        'Clearing restores memory and clarity. It does not reinforce amnesia as a protective buffer.',
    },
  ],
  17: [
    {
      text: 'The 3rd-density frequency band, so they can phase out of the dome and return to their solar families.',
      rationale:
        'This clearing lets the Resonating Army bypass all external control, step off the 3rd-density frequency band, and seamlessly phase out of the dome to return to their original solar families.',
    },
    {
      text: 'The 5th-dimensional solar current, which they must abandon before any return home can begin.',
      rationale:
        'They step off the lower 3rd-density band to align with higher currents and return to solar families, not off a 5th-dimensional stream.',
    },
    {
      text: 'The Saturnian cube-tech loop alone, treated as the only band that ever held them in the overlay.',
      rationale:
        'Saturnian cube-tech managed amnesia vortexes, but the named step-off is the 3rd-density frequency band itself.',
    },
    {
      text: 'The Lyran builder harmonic stream, leaving behind the very current that first anchored the temples.',
      rationale:
        'The Lyran stream is part of the original design they return toward. They step off the 3rd-density containment band, not the builder current.',
    },
  ],
  18: [
    {
      text: 'Living crystal walls shimmer as amplifiers, and columns breathe with light in time with consciousness.',
      rationale:
        'Living crystal walls shimmer with iridescent colors and act as natural crystalline amplifiers. The columns literally breathe with light, matching the expansion and contraction of pure consciousness.',
    },
    {
      text: 'The walls stay stationary and solid like high-grade marble, holding a fixed 3D shape at every frequency.',
      rationale:
        'Marble is the dead-stone overlay. The true walls are living, shimmering crystal, and the columns breathe like lungs of light.',
    },
    {
      text: 'The surfaces freeze into black void-stone so no light can move through the hall during a session.',
      rationale:
        'The halls glow with rainbow fractals. Light passes through crystal prisms into the light body grid; the architecture is active, not void-frozen.',
    },
    {
      text: 'The columns lock rigid as ordinary stone pillars and ignore the expansion and contraction of consciousness.',
      rationale:
        'The columns breathe with light and match the expansion and contraction of pure consciousness. They are not inert stone supports.',
    },
  ],
  19: [
    {
      text: 'They refract specialized light directly into the light body grid, dissolving distortion and mind-control damage.',
      rationale:
        'As the soul floats, light passes through specialized crystal prisms and refracts directly into the light body grid. That targeted infusion dissolves energetic distortion, cognitive blockages, and mind-control damage.',
    },
    {
      text: 'They act as surveillance lenses so the Council of 12 Suns can watch every orb throughout the session.',
      rationale:
        'Prisms are healing optics for light infusion. Saferins stabilize souls without force; the prisms are not monitoring devices.',
    },
    {
      text: 'They focus liquid sound into the heart center, copying the Water Dome method inside the Crystal Halls.',
      rationale:
        'Liquid sound belongs to Water Dome pools. Crystal Hall prisms refract light into the light body grid.',
    },
    {
      text: 'They generate parasite whispers on purpose to test whether the soul can refuse the broadcast and stay clear.',
      rationale:
        'Whispers are artificial low-frequency programming. The prisms dissolve those distortions; they do not produce them as a test.',
    },
  ],
  20: [
    {
      text: 'The soul’s capacity for manifestation, telepathic navigation, and multi-dimensional awareness is restored.',
      rationale:
        'Realignment within the Crystal Halls completely neutralizes cognitive control grids, restoring the soul’s inherent capacity for manifestation, telepathic navigation, and multi-dimensional awareness.',
    },
    {
      text: 'Every stone cathedral on earth is physically demolished so no overlay disguise can ever stand again.',
      rationale:
        'The stone appearance collapses as a sensory overlay. The living crystal architecture is revealed, not dynamited as masonry.',
    },
    {
      text: 'The parasitic Custodians immediately leave the solar system the moment one soul finishes a session.',
      rationale:
        'Clearing dismantles control grids in the soul and prepares the Event Cycle. It does not claim an instant Custodian evacuation.',
    },
    {
      text: 'The soul is permanently locked to a single timeline so multi-dimensional travel can never resume.',
      rationale:
        'Neutralizing those grids restores multi-dimensional awareness. It is the opposite of locking a soul to one timeline.',
    },
  ],
  21: [
    {
      text: 'Parasitic Custodians could build over the nodes, siphon their energy, and turn them into loosh loop collectors.',
      rationale:
        'Following the removal of the Hyperborean Spirit Tree, the parasitic Custodians — the priestly class of the Cube — built over these nodes to siphon their energy, converting them into loop collectors to harvest human loosh.',
    },
    {
      text: 'The Second Realm was permanently cut away from this world, leaving no crystalline reality underneath the overlay.',
      rationale:
        'The Second Realm remains the underlying unpolluted reality. Overlays hide it; the Spirit Tree’s removal did not erase it.',
    },
    {
      text: 'The Council of 12 Suns lost all contact with the Great Dome and could no longer send Saferins to the halls.',
      rationale:
        'Saferins from the Council of 12 Suns still supervise the clearing. The tree’s removal opened the nodes to parasitic co-option.',
    },
    {
      text: 'The Crystal Halls had to abandon the earth nodes and relocate entirely into etheric Star Pod space after the tree fell.',
      rationale:
        'The halls remained on the nodes. They were covered and converted into loop collectors, not moved into etheric space.',
    },
  ],
  22: [
    {
      text: 'They emerge unburdened, lighter, smiling, and often singing for the first time in lifetimes.',
      rationale:
        'Upon completing this structural recalibration, souls emerge completely unburdened, lighter, smiling, and often singing for the first time in lifetimes. Absolute clarity returns and the inner spark reignites.',
    },
    {
      text: 'They leave exhausted from the vibrational physics of the slabs, too drained to hold any frequency at all.',
      rationale:
        'The process is restorative. Souls emerge lighter and unburdened, with the inner spark reignited, not depleted.',
    },
    {
      text: 'They become solemn and heavy, crushed by the full weight of galactic history now sitting on the mind.',
      rationale:
        'Restoring memory unburdens the soul. Clarity and joy return; the work does not load the mind with extra weight.',
    },
    {
      text: 'They stay confused and panicked as the simulation collapses, no more stable than anyone still inside 3D.',
      rationale:
        'Cleared souls are unjammed. They do not collapse in panic or trauma during mass disclosures and EBS broadcasts.',
    },
  ],
  23: [
    {
      text: 'Andromedan and Pleiadian solar builders, who helped align the temples to star maps and cosmic currents.',
      rationale:
        'The temples were designed and anchored by the Lyran builders-architects, alongside Andromedan and Pleiadian solar builders, strategically aligned to star maps and cosmic currents to maintain the balance of the Great Dome.',
    },
    {
      text: 'Sirian and Arcturian ground healers, named as the only solar builders who ever touched the temple nodes.',
      rationale:
        'The named collaborators are Andromedan and Pleiadian solar builders working with the Lyrans, not Sirian or Arcturian crews.',
    },
    {
      text: 'The Resonating Army and the Saferins, who poured the original halls during the current Event Cycle.',
      rationale:
        'Saferins supervise today’s clearing. The Resonating Army are cleared human and starseed souls, not the original builders.',
    },
    {
      text: 'The Custodians and the Council of 12 Suns, working together as a single construction order from the start.',
      rationale:
        'Custodians are the later parasitic invaders. The Council of 12 Suns sends Saferins as healers, not as original temple builders.',
    },
  ],
  24: [
    {
      text: 'Systemic cognitive damage and the perceptual traps that lock souls in amnesia and limitation.',
      rationale:
        'The primary function of these installations is to mend the mind, purge systemic cognitive damage, realign the light body, and dismantle the perceptual traps that keep human souls locked in recursive cycles of amnesia and limitation.',
    },
    {
      text: 'The living connection between the soul and the Council of 12 Suns, which the halls then have to rebuild.',
      rationale:
        'The halls clear overlays that block perception. They do not treat the Council connection itself as the damaged target.',
    },
    {
      text: 'The physical 3D brain and its neurons, treated as the only tissue the Crystal Halls ever work on.',
      rationale:
        'Healing targets the mind and light body grid through frequency and light, not a surgical repair of 3D brain tissue.',
    },
    {
      text: 'The soul’s capacity to feel grief or fear, which Water Domes actually address through liquid sound.',
      rationale:
        'Emotional density is drawn out in Water Domes. Crystal Halls mend the mind and dissolve cognitive control grids.',
    },
  ],
  25: [
    {
      text: 'It is entirely perception-based: bricks, plaster, glass, and metal are low-frequency holographical projections.',
      rationale:
        'The three-dimensional solidity of the world is entirely perception-based. Bricks, plaster, glass, and metal are low-frequency holographical projections that collapse when matched with a high enough frequency.',
    },
    {
      text: 'It is fixed physical law: those materials stay solid at every frequency and never collapse or shimmer.',
      rationale:
        'Those materials collapse when matched with a high enough frequency. Solidity is a holographical projection, not fixed law.',
    },
    {
      text: 'It is a Second Realm building code, so brick and plaster are the true substance of the crystalline world.',
      rationale:
        'The Second Realm is vibrant unpolluted reality. Brick and plaster are overlay projections hiding living crystal.',
    },
    {
      text: 'It is created by Saferins as a temporary training set so souls can practice walking before they leave.',
      rationale:
        'Saferins stabilize transitioning souls. They do not generate the 3D solidity overlay; that overlay is parasitic.',
    },
  ],
};

const questionsMeta = [
  {
    number: 1,
    question:
      'What is the true composition of the structures humans perceive as historical cathedrals, churches, and abbeys?',
    hint: 'Look past the dead-stone disguise and name the living materials of the halls.',
  },
  {
    number: 2,
    question: 'How does the parasitic overlay manipulate human perception of the Crystal Halls?',
    hint: 'The mechanism targets the sensory nervous system, not a physical burial of the building.',
  },
  {
    number: 3,
    question: 'In what form does a soul exist while undergoing clearing on the crystal slabs?',
    hint: 'Think of a hovering ball of electricity in the crystalline body self.',
  },
  {
    number: 4,
    question: 'What is the specific function of the humming crystal slabs within the temples?',
    hint: 'The platform transmits a tone matched to the soul’s original Source codes.',
  },
  {
    number: 5,
    question:
      'Which beings stabilize souls and offer a sense of safety during the clearing?',
    hint: 'Look for the Ground Healers sent from the Council of 12 Suns.',
  },
  {
    number: 6,
    question: 'Within the restorative ecosystem, what is the specific role of Water Domes?',
    hint: 'Heart, emotional density, and liquid sound — not the mental overlay work.',
  },
  {
    number: 7,
    question:
      'What happens to the 3D perception of cities and borders as a soul’s frequency rises during clearing?',
    hint: 'Watch how a holographical projection behaves when the observer’s frequency no longer matches it.',
  },
  {
    number: 8,
    question: 'Who originally designed and anchored the Crystal Halls?',
    hint: 'Separate the ancient solar builders from the later parasitic Custodians.',
  },
  {
    number: 9,
    question: 'What is the Light Body Grid in the context of overlay clearing?',
    hint: 'It is the soul’s own energetic circuit template, restored to creation-level frequency.',
  },
  {
    number: 10,
    question:
      'Why did the parasitic Custodians build over the sacred nodes of the Crystal Halls?',
    hint: 'Think of siphoning, loop collectors, and the harvest of human loosh.',
  },
  {
    number: 11,
    question: 'Which layer of healing do the Star Pods handle?',
    hint: 'This sanctuary works in etheric space across lifetimes, not on the present mind overlay.',
  },
  {
    number: 12,
    question: 'What are Parasite Whispers?',
    hint: 'They are broadcast noise meant to disrupt sovereignty, not the slab’s healing hum.',
  },
  {
    number: 13,
    question: 'What occurs during the Reactivation of Harmonic Coding in the Crystal Halls?',
    hint: 'The slab’s hum returns the original signature after scalar weapons and grid noise.',
  },
  {
    number: 14,
    question:
      'What is the strategic role of souls who have completed their clearing during the Event Cycle?',
    hint: 'Unjammed people do not panic. They hold frequency for everyone still inside the overlay.',
  },
  {
    number: 15,
    question: 'How is the Second Realm related to ordinary 3D perception?',
    hint: 'It is what becomes visible when the hollow simulation starts to flicker.',
  },
  {
    number: 16,
    question:
      'What happens to the artificial amnesia that typically plagues human souls during the clearing?',
    hint: 'Amnesia is peeled away as the unbroken timeline downloads from the libraries.',
  },
  {
    number: 17,
    question:
      'The Resonating Army bypasses external control by stepping off which frequency band?',
    hint: 'Name the density band of the current containment, not a higher solar current.',
  },
  {
    number: 18,
    question: 'How do the walls and columns of the Crystal Halls actually behave?',
    hint: 'They are living amplifiers and lungs of light, not stationary marble.',
  },
  {
    number: 19,
    question: 'What role do crystal prisms play during the clearing of the light body grid?',
    hint: 'Follow the path of light as it refracts into the energetic circuit.',
  },
  {
    number: 20,
    question:
      'What is a direct result of neutralizing the cognitive control grids?',
    hint: 'Think of the inherent capacities a sovereign soul already has once the traps fall.',
  },
  {
    number: 21,
    question: 'What followed the removal of the Hyperborean Spirit Tree?',
    hint: 'Connect that removal to Custodians, nodes, and loosh.',
  },
  {
    number: 22,
    question:
      'How do souls typically emerge after the structural recalibration in the Crystal Halls?',
    hint: 'The inner spark returns, and the mood is light rather than exhausted or panicked.',
  },
  {
    number: 23,
    question: 'Which ancient races collaborated with the Lyrans to anchor the healing temples?',
    hint: 'Two solar-builder groups are named alongside the Lyran architects.',
  },
  {
    number: 24,
    question:
      'What is the primary mental damage the Crystal Halls are built to mend?',
    hint: 'Stay with mind, cognition, and perceptual traps — not heart density or 3D brain surgery.',
  },
  {
    number: 25,
    question:
      'What is the true nature of 3D solidity in objects like bricks, plaster, glass, and metal?',
    hint: 'Solidity is a low-frequency projection that collapses when the matching frequency rises.',
  },
];

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
      /according to the (report|text|source|journal)/i.test(o.text) ||
      /the source states/i.test(o.rationale) ||
      /the source states/i.test(o.text) ||
      /the text explicitly/i.test(o.rationale)
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
    'Test your grasp of Overlay Clearing — Crystal Halls under cathedral camouflage, parasitic overlays, humming slabs and conscious orbs, Saferins, Water Domes and Star Pods, memory restoration, and the Resonating Army stepping off the 3rd-density band.',
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'Overlay Clearing is the liberation of consciousness from low-frequency electromagnetic containment. Sit with the living crystal under the cathedral disguise, the hovering orb above the humming slab, and the moment the 3D city begins to shimmer. Return to the Overlay Clearing deep-dive, infographic, and video transmissions as you hold that unjammed clarity.',
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
    'Test your understanding of Overlay Clearing — Crystal Halls under cathedral camouflage; parasitic overlays and light body grid; humming slabs and conscious orbs; Saferins from the Council of 12 Suns; Water Domes / Crystal Halls / Star Pods; and the Resonating Army stepping off the 3rd-density band.',
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
      t.topic_image = topicImage;
      t.title = TOPIC_TITLE;
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('overlay-clearing not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'rainbow-fractals.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Overlay Clearing: Crystal Halls under cathedral camouflage, parasitic overlays, humming slabs and conscious orbs, Saferins, Water Domes and Star Pods, memory restoration, and the Resonating Army stepping off the 3rd-density band.';

html = html
  .replace(/Rainbow Fractals Quiz/g, `${TOPIC_TITLE} Quiz`)
  .replace(/Interactive Living Truth Quiz on Rainbow Fractals:[^"]*/g, desc)
  .replace(/quiz\/breakdown\/rainbow-fractals\.html/g, `quiz/${SOURCE}/${TOPIC_ID}.html`)
  .replace(/images\/breakdown\/rainbow-fractals\.webp/g, topicImage)
  .replace(/topic=rainbow-fractals/g, `topic=${TOPIC_ID}`)
  .replace(/Rainbow Fractals deep-dive/g, `${TOPIC_TITLE} deep-dive`)
  .replace(/data\/quizzes\/breakdown\/rainbow-fractals\.json/g, `data/quizzes/${SOURCE}/${TOPIC_ID}.json`)
  .replace(/rainbow-fractals\.json/g, `${TOPIC_ID}.json`)
  .replace(/rainbow-fractals\.html/g, `${TOPIC_ID}.html`)
  .replace(/rainbow-fractals\.webp/g, 'overlay-clearing.webp');

if (!html.includes(`${TOPIC_TITLE} Quiz`)) {
  throw new Error('HTML clone failed to set quiz title');
}
if (!html.includes(`data-quiz-src="../../data/quizzes/${SOURCE}/${TOPIC_ID}.json"`)) {
  throw new Error('HTML clone failed to set data-quiz-src');
}

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/rainbow-fractals.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/overlay-clearing.json'
);
