/**
 * Installs Healing Sanctuaries quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/soul-quiz.json
 * Title forced to "Healing Sanctuaries". All 25 audited against healing-sanctuaries report only.
 *
 * Run: node scripts/install-healing-sanctuaries-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/healing-sanctuaries.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'healing-sanctuaries';
const TOPIC_TITLE = 'Healing Sanctuaries';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/soul-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/healing-sanctuaries.webp';

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

/** Support phrases grounded only in healing-sanctuaries.json report. */
const supportPhrases = {
  1: ['transition hubs', 'stabilize', 'energetic damage'],
  2: ['water domes', 'emotional', 'liquid sound'],
  3: ['saferons', 'council of 12 suns', 'holographical'],
  4: ['cathedrals', 'crystal temples', 'overlays'],
  5: ['star pods', 'timeline trauma', 'soul fractures'],
  6: ['crystal halls', 'crystal prisms', 'mental overlays'],
  7: ['projection dome', 'invisible', 'bends'],
  8: ['transition halls', 'vibration stabilizes', 'not permanent'],
  9: ['spirit tree', 'unfiltered light', 'root system'],
  10: ['vatican', 'amnesia loops', 'anchored'],
  11: ['free energy', 'tarmac', 'med bed'],
  12: ['etheric hard drives', 'planetary crystals', 'soul'],
  13: ['saferon', 'bio-fields', 'original family'],
  14: ['no soul is abandoned', 'specialized sanctuaries', 'guided'],
  15: ['lifting of weight', 'joy', 'singing'],
  16: ['resonating army', 'starseeds', 'bypass'],
  17: ['timeline trauma', 'karmic wounds', 'incarnations'],
  18: ['10–12 feet', 'gentleness', 'saferons'],
  19: ['light body grid', 'source', 'structural frequency'],
  20: ['breathe like lungs', 'columns of light', 'crystal halls'],
  21: ['parasitic overlay', 'electromagnetic', 'hijack'],
  22: ['return to these sanctuaries', 'guides', 'resonating army'],
  23: ['liquid sound', 'crystalline water', 'memory codes'],
  24: ['cube containment', 'dome of sheol', 'integrated'],
  25: ['sovereign choice', 'ascend', 'known lands'],
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
 * All four options at similar depth from the healing-sanctuaries report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'They serve as transition hubs where fractured souls stabilize vibrations and clear energetic damage.',
      rationale:
        'Healing Sanctuaries are specialized frequency chambers of light, sound, and living crystal that stabilize soul vibration, clean fields of energetic damage, and prepare souls for higher evolutionary paths.',
    },
    {
      text: 'They function as military outposts where the Resonating Army plans its permanent occupation of the Known Lands.',
      rationale:
        'The Resonating Army bypasses the healing phases entirely for a direct homecoming path; sanctuaries restore traumatized human souls, not military planning bases.',
    },
    {
      text: 'They are advanced 3D hospitals designed solely to upgrade manipulated biology with conventional medical hardware.',
      rationale:
        'Modern hospitals are empty constructs addressing manipulated biology; true healing occurs at frequency where the physical vessel is recognized as an avatar template.',
    },
    {
      text: 'They are permanent residential colonies for souls who can never leave the Great Dome or choose another path.',
      rationale:
        'Sanctuaries are strictly transition halls, not permanent residences; a soul stays only until its vibration stabilizes, then receives a sovereign choice.',
    },
  ],
  2: [
    {
      text: 'Water Domes over crystalline waters, where liquid sound draws out grief, fear, guilt, and heartbreak.',
      rationale:
        'Water Domes specialize in heart restoration: souls float in pools vibrating as liquid sound that extract emotional density and replace it with pure harmonic resonance.',
    },
    {
      text: 'Star Pods suspended in nebula-like space, reserved only for severe timeline fractures and soul reweaving.',
      rationale:
        'Star Pods reweave soul fragments and timeline trauma; emotional density extraction through liquid sound belongs to Water Domes.',
    },
    {
      text: 'Crystal Halls with rainbow fractals, where light prisms dissolve mind-control implants and mental overlays.',
      rationale:
        'Crystal Halls perform mind restoration and silence parasite whispers; liquid-sound emotional extraction is the Water Dome specialty.',
    },
    {
      text: 'The Spirit Tree alone at the center of the Known Lands, used as the sole chamber for every emotional wound.',
      rationale:
        'The Spirit Tree feeds pure unfiltered light into the healing environments through crystal grids; it is not itself the emotional extraction chamber.',
    },
  ],
  3: [
    {
      text: 'Tall, radiant holographical light beings from the Council of 12 Suns who serve as gentle ground healers.',
      rationale:
        'Saferons are non-physical, towering holographical light beings dispatched from the Council of 12 Suns; they operate with absolute gentleness as ground healers.',
    },
    {
      text: 'Ancient human ancestors who achieved physical immortality and still staff 3D hospitals as primary healers.',
      rationale:
        'Saferons are non-physical holographical beings from the Council of 12 Suns, not immortal human ancestors running 3D medical systems.',
    },
    {
      text: 'Physical survivors of the Resonating Army who remained behind as permanent sanctuary wardens only.',
      rationale:
        'The Resonating Army may later return as guides, but Saferons are the primary non-physical ground healers from the Council of 12 Suns.',
    },
    {
      text: 'Reformed custodians who inverted back to light and now command every sanctuary with strict force.',
      rationale:
        'Saferons are radiant Council of 12 Suns beings who never force or command; they are not reformed custodians of the parasitic system.',
    },
  ],
  4: [
    {
      text: 'Physical overlays built on top of active, suppressed crystal temples designed for human rejuvenation.',
      rationale:
        'Cathedrals, churches, and abbeys are physical overlays on living crystalline temples; beneath the heavy stone lie structures designed for human rejuvenation.',
    },
    {
      text: 'Access points into the parasitic overlay control center where custodians store only inverted harvest codes.',
      rationale:
        'The underlying nature of these sites is healing and crystalline for rejuvenation, not a parasitic control center as their true function.',
    },
    {
      text: 'Empty historical shells with no energetic significance beyond ordinary stone architecture and tourism.',
      rationale:
        'These locations sit atop active, suppressed crystal temples and are highly significant as cloaked rejuvenation architecture.',
    },
    {
      text: 'Monuments whose only real purpose was religious devotion with no living crystal structure underneath.',
      rationale:
        'Religious monument perception is the 3D illusion; the true function is suppressed living crystalline rejuvenation temples.',
    },
  ],
  5: [
    {
      text: 'Star Pods — floating etheric cocoons in nebula-like space for soul fractures and timeline trauma.',
      rationale:
        'Star Pods wrap the soul in a secure womb of light and reweave scattered fragments of history across timelines for severe soul and timeline trauma.',
    },
    {
      text: 'Water Domes alone — pearlescent domes over aqua-silver waters used only for timeline reweaving.',
      rationale:
        'Water Domes specialize in heart and emotional restoration through liquid sound, not severe timeline fracture reweaving.',
    },
    {
      text: 'Crystal Halls alone — rainbow fractal temples used only as the exclusive site of soul-fragment reweaving.',
      rationale:
        'Crystal Halls realign mind and light body grid, dissolving mental overlays; timeline soul reweaving is the Star Pod pillar.',
    },
    {
      text: 'The Dome of Sheol alone — treated as the only pillar of restoration for every timeline wound.',
      rationale:
        'Sheol is an outer dome originally a recovery sanctuary connected to the Cube system; the three pillars of restoration are Water Domes, Crystal Halls, and Star Pods.',
    },
  ],
  6: [
    {
      text: 'Light filtered through crystal prisms dissolves mental overlays, mind control damage, and energetic implants.',
      rationale:
        'In Crystal Halls, prism-filtered light dissolves mental overlays, parasitic programming, and implants, realigning the light body grid and silencing parasite whispers.',
    },
    {
      text: 'The soul vibration is deliberately lowered to match dense stone so parasite whispers grow permanently louder.',
      rationale:
        'Healing raises and stabilizes frequency; Crystal Halls clear damage and silence parasite whispers rather than locking souls into dense stone vibration.',
    },
    {
      text: 'Solar parents erase every organic memory so the soul forgets Source and the entire light body grid.',
      rationale:
        'Solar parents assist in Star Pods reclaiming higher memories; Crystal Halls dissolve artificial overlays, not organic Source memory.',
    },
    {
      text: 'Souls are immersed in liquid sound pools that wash thoughts while leaving all mind-control implants intact.',
      rationale:
        'Liquid sound is the Water Dome medium for emotional density; Crystal Halls use living crystal, harmonic keys, and prism light for mind restoration.',
    },
  ],
  7: [
    {
      text: 'Projection dome technology bends incoming light and sound around their structures so 3D senses miss them.',
      rationale:
        'Sanctuaries are currently active but invisible to 3D senses, hidden by projection dome technology that bends incoming light and sound around their structures.',
    },
    {
      text: 'They are purely mental fantasies with no objective structure of light, sound, or living crystal at all.',
      rationale:
        'They are vast organic structures of light, sound, and living crystal — real transition hubs, not mere mental fantasies.',
    },
    {
      text: 'They exist only outside the Great Dome among foreign world cells never linked to the Cube system.',
      rationale:
        'Healing Sanctuaries are fully integrated into the Cube containment system and connected to outer domes such as Sheol and Forgotten Gods.',
    },
    {
      text: 'They only appear for a few seconds during Great Awakening flashes and then permanently dematerialize.',
      rationale:
        'Sanctuaries are already active and continuously cloaked; they are not brief flash-only apparitions that dematerialize forever.',
    },
  ],
  8: [
    {
      text: 'False — a soul stays only until its vibration stabilizes; sanctuaries are transition halls, not prisons.',
      rationale:
        'Sanctuaries are strictly transition halls, not permanent residences; a soul stays only until its vibration stabilizes, then receives a sovereign choice.',
    },
    {
      text: 'True — every soul is locked inside until the entire Mega Breakdown calendar ends with no earlier exit.',
      rationale:
        'Duration is based on vibrational stability, not a fixed external Mega Breakdown calendar that forces permanent confinement.',
    },
    {
      text: 'True — sanctuaries convert into permanent residential prisons once the parasitic overlay fully collapses.',
      rationale:
        'They remain transition halls for stabilization and choice, never permanent prisons or residential colonies after collapse.',
    },
    {
      text: 'True — only Resonating Army starseeds may leave early; all other souls remain confined indefinitely.',
      rationale:
        'Every stabilized soul receives a sovereign choice to ascend or return; stay length is vibration-based for all true human sparks, not indefinite confinement.',
    },
  ],
  9: [
    {
      text: 'The Spirit Tree pulse as it lights its ancient root system, feeding pure unfiltered light into the grids.',
      rationale:
        'As the Spirit Tree at the center of the Known Lands pulses and lights its root system, it feeds these healing environments with pure, unfiltered light through crystal grids and harmonic lenses.',
    },
    {
      text: 'Solar panels on projection domes that convert ordinary sunlight into the only energy the sanctuaries use.',
      rationale:
        'Projection domes cloak sanctuaries by bending light and sound; foundational feeding light comes from the Spirit Tree through restored grids.',
    },
    {
      text: 'Free energy harvested from tarmac, cars, and parasitic city infrastructure still running in the overlay.',
      rationale:
        'Tarmac and cars are parasitic infrastructure that will be gone in the restored realm; Spirit Tree light feeds the sanctuaries now.',
    },
    {
      text: 'Only the combined psychic effort of the Resonating Army with no central Spirit Tree contribution at all.',
      rationale:
        'The Resonating Army assists later as guides; the primary feed of pure unfiltered light into sanctuaries is the Spirit Tree root pulse.',
    },
  ],
  10: [
    {
      text: 'Beneath the Vatican, where artificial amnesia loops once anchored souls into recycled forgetfulness.',
      rationale:
        'Planetary crystal records downloaded in sanctuaries help souls bypass artificial amnesia loops once anchored beneath the Vatican.',
    },
    {
      text: 'Inside the Star Pods, which were designed to generate amnesia rather than reclaim higher memories.',
      rationale:
        'Star Pods reweave soul history and assist reclaiming higher memories; they are healing cocoons, not amnesia generators.',
    },
    {
      text: 'Within the Council of 12 Suns, which installed amnesia loops as Saferon training modules for all souls.',
      rationale:
        'The Council of 12 Suns dispatches Saferon healers; amnesia loops were parasitic anchors beneath the Vatican, not Council training tools.',
    },
    {
      text: 'Only in the Dome of Sheol, which was never a recovery sanctuary and solely generated amnesia cycles.',
      rationale:
        'Sheol was originally a recovery sanctuary connected to the system; amnesia loops were anchored beneath the Vatican.',
    },
  ],
  11: [
    {
      text: 'A crystalline physical realm free of tarmac and cars, running on free energy as one massive med bed.',
      rationale:
        'Souls returning to the Known Lands inhabit a restored crystalline physical realm free from parasitic infrastructure, tarmac, or cars, powered by free energy from the electromagnetic field — the entire realm becomes one massive med bed.',
    },
    {
      text: 'A completely non-physical void where biology, choice, and any crystalline physical cycle permanently end.',
      rationale:
        'Return means a fresh free physical cycle in a crystalline physical realm, not the end of physicality or sovereign choice.',
    },
    {
      text: 'A realm where the parasitic overlay remains fully intact under permanent Council of 12 Suns management.',
      rationale:
        'Restoration follows collapse of the parasitic overlay; returning souls inhabit a realm free of parasitic infrastructure, not a managed overlay farm.',
    },
    {
      text: 'A world of upgraded 3D hospitals only, with tarmac, cars, and parasitic infrastructure left completely unchanged.',
      rationale:
        '3D hospitals are empty constructs; the entire restored realm becomes free-energy med-bed landscape without parasitic tarmac and cars.',
    },
  ],
  12: [
    {
      text: 'They act as etheric hard drives holding unbroken records of each soul journey for memory reconstruction.',
      rationale:
        'Planetary crystals hold unbroken records of each soul journey; those records are downloaded during sanctuary process to reconstruct shattered memory timelines.',
    },
    {
      text: 'They generate projection cloaking alone and store no soul records, memory codes, or timeline data at all.',
      rationale:
        'Cloaking uses projection dome technology; planetary crystals store soul journey records as etheric hard drives for sanctuary download.',
    },
    {
      text: 'They form only the solid outer walls of Water Domes and never hold any informational soul records.',
      rationale:
        'Water Domes are translucent pearlescent structures over crystalline water; planetary crystals function as informational etheric hard drives.',
    },
    {
      text: 'They serve as currency souls must spend to buy entry into higher realms after stabilization is complete.',
      rationale:
        'Access after healing is a sovereign frequency choice to ascend or return, not a crystal-currency transaction.',
    },
  ],
  13: [
    {
      text: 'A Saferon whose massive bio-field mirrors the soul original family and instantly neutralizes fear.',
      rationale:
        'Saferons project a soothing mirror reflection of the soul original family, neutralizing fear and confusion upon arrival with overwhelming safety and homecoming.',
    },
    {
      text: 'A Solar Parent only, who greets every arrival at the outer gate before any Saferon ever appears.',
      rationale:
        'Solar parents assist inside Star Pods reclaiming higher memories; Saferons are the ground healers who meet arrivals with family-mirror bio-fields.',
    },
    {
      text: 'A Spirit Tree guardian only, who forces commands and never mirrors the soul original family field.',
      rationale:
        'The Spirit Tree feeds light through roots and grids; Saferons are the gentle ground healers who mirror original family without forcing or commanding.',
    },
    {
      text: 'Only a Resonating Army starseed, with no Saferon involvement at the moment of sanctuary arrival.',
      rationale:
        'Resonating Army members may later return as guides; Saferons are the specialized ground healers who neutralize fear upon arrival.',
    },
  ],
  14: [
    {
      text: 'True — human sparks who fail to fully resonate are systematically guided into specialized sanctuaries.',
      rationale:
        'No soul is abandoned: human sparks who fail to fully resonate during initial Great Awakening flashes are systematically guided into specialized sanctuaries by degree of trauma.',
    },
    {
      text: 'False — any soul that misses the first resonance flash is permanently abandoned with no sanctuary path.',
      rationale:
        'The restoration system ensures true human sparks are guided into Water Domes, Crystal Halls, or Star Pods rather than abandoned.',
    },
    {
      text: 'False — only Resonating Army starseeds receive help; all other human sparks are left in the overlay.',
      rationale:
        'The Resonating Army bypasses healing for homecoming, while millions of traumatized true human souls are precisely the ones guided into sanctuaries.',
    },
    {
      text: 'False — sanctuaries accept only NPCs, and every true human spark must heal alone without any guidance.',
      rationale:
        'True human souls traumatized by parasite systems are guided into sanctuaries; the design is systematic care, not solitary abandonment.',
    },
  ],
  15: [
    {
      text: 'A profound lifting of weight that leads to spontaneous joy, smiling, and singing in the field.',
      rationale:
        'After liquid sound draws out low-frequency trauma and inserts pure harmonic resonance, the immediate effect is a profound lifting of weight leading to spontaneous joy, smiling, and singing.',
    },
    {
      text: 'A forced deep sleep used only for timeline reweaving inside nebula cocoons rather than heart pools.',
      rationale:
        'Timeline reweaving is the Star Pod function; Water Dome liquid sound produces emotional uplift, joy, and singing, not forced timeline sleep.',
    },
    {
      text: 'Total erasure of every experience so the soul forgets both trauma and its true Source memory codes.',
      rationale:
        'Liquid sound draws out emotional density and inserts Source memory codes; the goal is healing and reclamation, not total experiential erasure.',
    },
    {
      text: 'Hardening of the light body into a dense shell that permanently blocks all harmonic resonance and joy.',
      rationale:
        'The process cleans and stabilizes the field with harmonic resonance that lifts weight into joy, not a densifying shell that blocks feeling.',
    },
  ],
  16: [
    {
      text: 'Already-awakened starseeds who bypass healing phases for a direct homecoming path out of the Known Lands.',
      rationale:
        'The Resonating Army is the already-awakened starseeds who bypass healing phases to embark on a direct homecoming path out of the Known Lands.',
    },
    {
      text: 'Holographical Saferon healers from the Council of 12 Suns who never leave sanctuary grounds as starseeds.',
      rationale:
        'Saferons are Council of 12 Suns ground healers; the Resonating Army is the already-awakened starseed liberation force that exits first.',
    },
    {
      text: 'Cleared custodians who once ran the parasitic overlay and now form the only homecoming army allowed.',
      rationale:
        'The Resonating Army consists of already-awakened starseeds, not reformed custodians of the parasitic system.',
    },
    {
      text: 'Human souls who just finished Crystal Halls and are immediately renamed as the Resonating Army.',
      rationale:
        'Healed human souls receive sovereign choice after stabilization; the Resonating Army is already prepared and exits first, later optionally returning as guides.',
    },
  ],
  17: [
    {
      text: 'Subconscious fractures and karmic wounds accumulated across multiple distorted 3D incarnations.',
      rationale:
        'Timeline Trauma is defined as subconscious fractures and karmic wounds accumulated by a soul across multiple distorted 3D incarnations.',
    },
    {
      text: 'Only the short confusion of the overlay collapse itself, with no multi-incarnation karmic wound history.',
      rationale:
        'Collapse triggers healing pathways; Timeline Trauma is accumulated multi-incarnation damage that Star Pods reweave, not collapse confusion alone.',
    },
    {
      text: 'Only physical injuries from a single Mega Breakdown day with no subconscious or karmic dimension.',
      rationale:
        'Timeline Trauma is deep energetic and subconscious fracture across lifetimes, not a single-day physical injury category.',
    },
    {
      text: 'A temporary glitch in projection dome hardware that never touches the soul field or incarnation history.',
      rationale:
        'Timeline Trauma is internal soul and karmic history damage; projection dome tech is the cloaking system hiding sanctuaries.',
    },
  ],
  18: [
    {
      text: 'Tall (10–12 feet), radiant holographical light beings who operate with absolute gentleness.',
      rationale:
        'Saferons are non-physical, towering 10–12 feet holographical light beings who operate with absolute gentleness, never forcing or commanding.',
    },
    {
      text: 'Fierce Resonating Army warriors who guard Known Lands gates and never act as gentle ground healers.',
      rationale:
        'Saferons are gentle ground healers from the Council of 12 Suns, not warrior guards of the Resonating Army.',
    },
    {
      text: 'Biological engineers who build only 3D med-bed hardware and never project family-mirror bio-fields.',
      rationale:
        'Saferons are non-physical light beings whose massive bio-fields mirror original family; they are not 3D biological engineers.',
    },
    {
      text: 'Small dense crystalline entities that crawl slowly through Water Domes and never stand taller than humans.',
      rationale:
        'Saferons are tall radiant holographical beings (10–12 feet), not small dense crystalline crawlers.',
    },
  ],
  19: [
    {
      text: 'Its structural frequency and direct energetic connection to Source through the light body template.',
      rationale:
        'The Light Body Grid is the energetic template of the soul that dictates structural frequency and connects it to Source; realignment restores that link.',
    },
    {
      text: 'Only its original 3D social status and material wealth inside the still-intact parasitic overlay economy.',
      rationale:
        '3D status and wealth are overlay illusion cleared in healing; light body realignment restores Source frequency connection.',
    },
    {
      text: 'Permanent access to the parasitic overlay database so parasite whispers can continue without silence.',
      rationale:
        'Crystal Hall realignment silences parasite whispers and clears programming; it does not grant deeper access to the overlay database.',
    },
    {
      text: 'A new physical body issued only by empty 3D hospitals with no change to frequency or Source link.',
      rationale:
        'The light body is an energetic template; 3D medicine is an empty construct, and true healing restores frequency connection to Source.',
    },
  ],
  20: [
    {
      text: 'Walls of living crystal glow with rainbow fractals while columns of light breathe like lungs to clear fields.',
      rationale:
        'Crystal Halls feature walls of living crystal with shifting rainbow fractals; columns of light literally breathe like lungs to clear the energy field.',
    },
    {
      text: 'They emit only high-decibel sirens meant to shatter ego with no harmonic keys or fractal light at all.',
      rationale:
        'Halls use harmonic keys, crystal slabs, rainbow fractals, and prism light — not disruptive high-decibel sirens as the healing method.',
    },
    {
      text: 'They act only as solid barriers blocking souls from Water Domes with no breathing light or cleansing role.',
      rationale:
        'The three pillars are integrated restoration environments; Crystal Hall structures organically cleanse fields rather than merely wall souls off.',
    },
    {
      text: 'They only record thoughts for future judgment and never clear implants, overlays, or parasite whispers.',
      rationale:
        'Sanctuaries restore and realign; Crystal Halls dissolve mental overlays and implants rather than surveil for judgment.',
    },
  ],
  21: [
    {
      text: 'An artificial low-frequency electromagnetic illusion projected by custodians to hijack human perception.',
      rationale:
        'The Parasitic Overlay is the artificial low-frequency electromagnetic illusion projected by custodians to hijack human perception.',
    },
    {
      text: 'A specialized training program the Resonating Army runs to keep starseeds asleep inside the Known Lands.',
      rationale:
        'The Resonating Army liberates and exits; the overlay is the custodial illusion they and others are freeing souls from, not their training program.',
    },
    {
      text: 'A natural biological stage of human evolution that every soul must keep forever without any collapse.',
      rationale:
        'The overlay is artificial and projected; Mega Breakdown collapse of that illusion enables sanctuary restoration and crystalline return.',
    },
    {
      text: 'The outer wall of the Great Dome that permanently blocks all 178 world cells from any contact with light.',
      rationale:
        'Known Lands are 178 world cells within the Great Dome; the parasitic overlay is the perception hijack inside the realm, not the Dome outer wall itself.',
    },
  ],
  22: [
    {
      text: 'They may return to sanctuaries as guides to speed recovery of loved ones and human souls they came to free.',
      rationale:
        'Starseeds who exit first eventually have the opportunity to return to these sanctuaries as guides, speeding recovery of loved ones and human souls they came to liberate.',
    },
    {
      text: 'They remain forever in higher realms and never return to assist any sanctuary recovery process at all.',
      rationale:
        'They will eventually have the opportunity to return as guides; homecoming first does not mean permanent absence from sanctuary service.',
    },
    {
      text: 'They replace the Council of 12 Suns entirely and dissolve every Saferon from ground-healer service.',
      rationale:
        'Their later role is guiding recovery in sanctuaries, not replacing the Council of 12 Suns or dissolving Saferon ground healers.',
    },
    {
      text: 'They dismantle all sanctuaries immediately so traumatized souls receive no Water Domes or Star Pods.',
      rationale:
        'Sanctuaries remain necessary transition halls; the Resonating Army supports recovery as guides rather than dismantling healing spaces.',
    },
  ],
  23: [
    {
      text: 'Crystalline water vibrating at high harmonic frequencies to draw out density and insert memory codes.',
      rationale:
        'Liquid Sound is crystalline water that vibrates at high harmonic frequencies to draw out emotional density and insert memory codes within Water Domes.',
    },
    {
      text: 'A chemical solvent that dissolves the physical avatar body so no light body grid can ever realign.',
      rationale:
        'Liquid Sound is crystalline water for emotional healing and Source memory codes, not a chemical that dissolves the avatar.',
    },
    {
      text: 'Only the noise of the parasitic overlay collapsing, with no role as a healing medium inside Water Domes.',
      rationale:
        'Liquid Sound is a specific Water Dome healing medium of vibrating crystalline water, not collapse noise of the overlay.',
    },
    {
      text: 'Fuel used by Saferons to travel between suns, unrelated to heart restoration or memory insertion.',
      rationale:
        'Saferons are non-physical light beings; Liquid Sound is the environmental healing medium for emotional restoration in Water Domes.',
    },
  ],
  24: [
    {
      text: 'True — they are fully integrated into the Cube system and linked to outer domes such as Sheol.',
      rationale:
        'Healing Sanctuaries are fully integrated into the vast Cube containment system and connect directly to outer domes such as the Dome of Sheol and the Dome of Forgotten Gods.',
    },
    {
      text: 'False — they float in total isolation with no Cube links, outer domes, or Spirit Tree light feed.',
      rationale:
        'They do not operate in isolation; they connect to outer domes and rely on Spirit Tree light through crystal grids and harmonic lenses.',
    },
    {
      text: 'False — they connect only to modern 3D hospitals and never to Sheol, Forgotten Gods, or Cube structure.',
      rationale:
        'Integration is with the Cube containment and outer recovery/origin domes, not with empty 3D hospital constructs.',
    },
    {
      text: 'False — only Star Pods sit inside the Cube while Water Domes and Crystal Halls remain fully external.',
      rationale:
        'All three pillars of the Healing Sanctuaries are part of the integrated Cube-linked restoration system, not split inside/outside arbitrarily.',
    },
  ],
  25: [
    {
      text: 'The soul is granted sovereign choice to ascend into higher Great Dome realms or return to Known Lands.',
      rationale:
        'Once healed and stabilized, every soul is granted a sovereign choice: ascend into higher realms of the Great Dome or return to the Known Lands in a fresh free physical cycle.',
    },
    {
      text: 'The soul loses all individuality and is forced to merge permanently into the Spirit Tree trunk alone.',
      rationale:
        'Restoration realigns the individual light body grid; the outcome is sovereign choice, not forced loss of individuality into the tree.',
    },
    {
      text: 'The soul is required to join the Council of 12 Suns as a Saferon with no other path permitted.',
      rationale:
        'The path after stabilization is open sovereign choice, not a mandated Saferon assignment on the Council of 12 Suns.',
    },
    {
      text: 'The soul is automatically forced into the next amnesia-loop incarnation with no choice and no exit.',
      rationale:
        'Sanctuary restoration helps bypass artificial amnesia loops and grants sovereign choice rather than automatic reincarnation trapping.',
    },
  ],
};

const questionsMeta = [
  {
    number: 1,
    question:
      'What is the primary function of the Healing Sanctuaries during the era of the Mega Breakdown?',
    hint: 'Consider whether these structures are permanent homes or a temporary stage for vibrational recovery.',
  },
  {
    number: 2,
    question:
      'Which environment extracts emotional density like grief and fear through liquid sound?',
    hint: 'Think of pearlescent domes over glowing crystalline waters specialized for the heart.',
  },
  {
    number: 3,
    question: 'What are the Saferons, the ground healers who assist souls upon arrival?',
    hint: 'Their origin is a celestial council and their nature is non-physical and radiant.',
  },
  {
    number: 4,
    question:
      'How are majestic stone cathedrals and abbeys perceived in their true unsuppressed form?',
    hint: 'Relate the heavy stone eyes see to living crystal structures hidden beneath.',
  },
  {
    number: 5,
    question:
      'Which pillar of restoration serves souls with severe soul fractures and timeline trauma?',
    hint: 'This environment resembles a colorful nebula and wraps the soul in a womb of light.',
  },
  {
    number: 6,
    question:
      "What occurs in the Crystal Halls to silence parasite whispers and clear mind control?",
    hint: 'Consider light moving through crystal prisms onto hovering souls above harmonic slabs.',
  },
  {
    number: 7,
    question: 'Why are Healing Sanctuaries currently invisible to average 3D human senses?',
    hint: 'Advanced technology can bend light and sound around active structures.',
  },
  {
    number: 8,
    question:
      'Must a soul remain in a Healing Sanctuary until the entire Mega Breakdown calendar ends?',
    hint: 'Ask whether stay length is a fixed timeline or based on vibrational stability.',
  },
  {
    number: 9,
    question: 'What primary source feeds pure light into these healing environments?',
    hint: 'Look for the central organic axis that lights its ancient root system in the Known Lands.',
  },
  {
    number: 10,
    question: 'Where were the artificial amnesia loops that trapped human souls originally anchored?',
    hint: 'A physical 3D power site long associated with deep historical spiritual control.',
  },
  {
    number: 11,
    question:
      'What defines the Known Lands landscape after full restoration to a crystalline physical realm?',
    hint: 'Focus on absence of industrial parasitic materials and the nature of free energy.',
  },
  {
    number: 12,
    question: 'What role do planetary crystals play in the soul restoration process?',
    hint: 'Treat them as memory-keepers that download unbroken journey records.',
  },
  {
    number: 13,
    question:
      'Which being is most likely encountered first to ensure safety when arriving at a sanctuary?',
    hint: 'Exceptionally tall, non-physical, holographically radiant ground healers.',
  },
  {
    number: 14,
    question:
      'Are human souls abandoned if they fail to fully resonate during initial Great Awakening flashes?',
    hint: 'Reflect on whether traumatized sparks still receive specialized sanctuary guidance.',
  },
  {
    number: 15,
    question: "What is the immediate effect of liquid sound in the Water Domes on a soul's field?",
    hint: 'Imagine removing a heavy emotional burden from the heart field.',
  },
  {
    number: 16,
    question: 'Who composes the Resonating Army in relation to the healing phases?',
    hint: 'This group does not need sanctuaries first and exits on a direct homecoming path.',
  },
  {
    number: 17,
    question: 'What is Timeline Trauma in the context of soul restoration?',
    hint: 'Long-term multi-incarnation damage under distorted 3D loops, not a single bruise.',
  },
  {
    number: 18,
    question: 'Which description matches the appearance and nature of the Saferons?',
    hint: 'Height around 10–12 feet, radiant holography, absolute gentleness.',
  },
  {
    number: 19,
    question: "What does a soul reclaim when its light body grid is realigned in a sanctuary?",
    hint: 'The template that sets structural frequency and links the soul to Source.',
  },
  {
    number: 20,
    question: 'In the Crystal Halls, how do walls and columns assist the healing process?',
    hint: 'An organic rhythmic process of living light clearing the energy field.',
  },
  {
    number: 21,
    question: 'What is the Parasitic Overlay that Healing Sanctuaries help souls overcome?',
    hint: 'A manufactured low-frequency electromagnetic environment used for control.',
  },
  {
    number: 22,
    question:
      'What role can the Resonating Army take after initially exiting the Known Lands?',
    hint: 'Think of a round trip that includes returning to help others recover.',
  },
  {
    number: 23,
    question: 'What does Liquid Sound refer to in the Water Domes?',
    hint: 'A fluid medium that carries frequency and Source memory into the heart field.',
  },
  {
    number: 24,
    question: 'Are the Healing Sanctuaries integrated with the Cube containment system?',
    hint: 'Consider links to outer domes such as Sheol and Forgotten Gods.',
  },
  {
    number: 25,
    question: "Which outcome follows a soul's successful restoration in a sanctuary?",
    hint: 'The outcome centers on freedom to choose the next evolutionary path.',
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
    'Test your grasp of Healing Sanctuaries — Water Domes, Crystal Halls, and Star Pods; Saferons from the Council of 12 Suns; projection cloaking; Spirit Tree light feed; planetary crystal memory; and sovereign choice after stabilization.',
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'Healing Sanctuaries are pure frequency chambers of light, sound, and living crystal — transition halls, not prisons — where traumatized true human souls stabilize after the Mega Breakdown. Sit with Water Domes and liquid sound, Crystal Halls that breathe light, Star Pods that reweave timeline trauma, Saferons who mirror original family, and the Spirit Tree that feeds unfiltered light through the grids. Return to the Healing Sanctuaries deep-dive, infographic, and video transmissions as you hold the sovereign choice to ascend or return to a free-energy crystalline Known Lands.',
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
    'Test your understanding of Healing Sanctuaries — transition hubs of light, sound, and living crystal; Water Domes, Crystal Halls, Star Pods; Saferons; projection cloaking; Spirit Tree feed; planetary crystal records; and sovereign choice after restoration.',
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
      if (
        !t.description ||
        t.description.includes('Water Domes, Crystal Halls, and Star Pods for restoration')
      ) {
        t.description =
          'Healing Sanctuaries are pure frequency chambers of light, sound, and living crystal — Water Domes, Crystal Halls, and Star Pods — where traumatized true human souls stabilize, clear energetic damage, and prepare for higher evolutionary paths after the Mega Breakdown.';
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('healing-sanctuaries not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from hyperborean-heart quiz (recent sibling install)
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hyperborean-heart.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Healing Sanctuaries: Water Domes, Crystal Halls, Star Pods, Saferons from the Council of 12 Suns, projection cloaking, Spirit Tree light feed, planetary crystal memory, and sovereign choice after stabilization.';
const replacements = [
  ['Hyperborean Heart Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Hyperborean Heart: Antarctica ice mask, Spirit Tree and Lyran builders, Black Cube valve hijack, lunar/Saturn siphon, Aru-el-nai versus Polaris, living roots, SEED codes, and garden restoration.',
    desc,
  ],
  ['quiz/breakdown/hyperborean-heart.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/hyperborean-heart.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=hyperborean-heart',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`,
  ],
  ['Hyperborean Heart deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Hyperborean Heart</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/hyperborean-heart.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`,
  ],
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 90));
  }
  html = html.split(a).join(b);
}

html = html
  .replace(/Interactive Living Truth Quiz on Hyperborean Heart[^"]*/g, desc)
  .replace(/Hyperborean Heart/g, TOPIC_TITLE);

// Fix over-replacement on paths if any slipped
html = html
  .replace(/Healing Sanctuaries\.webp/g, 'healing-sanctuaries.webp')
  .replace(/Healing Sanctuaries\.json/g, 'healing-sanctuaries.json')
  .replace(/Healing Sanctuaries\.html/g, 'healing-sanctuaries.html')
  .replace(/topic=Healing Sanctuaries/g, `topic=${TOPIC_ID}`)
  .replace(/topic=healing-sanctuaries/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/hyperborean-heart.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/healing-sanctuaries.json'
);
