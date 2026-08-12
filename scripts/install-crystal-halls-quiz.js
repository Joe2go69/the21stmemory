/**
 * Installs Crystal Halls quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/crystal-quiz.json
 * Title forced to "Crystal Halls". All 25 audited against crystal-halls report only.
 *
 * Run: node scripts/install-crystal-halls-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/crystal-halls.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'crystal-halls';
const TOPIC_TITLE = 'Crystal Halls';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/crystal-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/crystal-halls.webp';

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

/** Support phrases grounded only in crystal-halls.json report. */
const supportPhrases = {
  1: ['mend the mind', 'parasitic programming', 'cognitive'],
  2: ['cathedrals', 'abbeys', 'churches', 'stone'],
  3: ['conscious orbs', 'crystalline body', 'electricity'],
  4: ['lungs of light', 'original creation', 'columns'],
  5: ['rainbow fractals', 'crystal prisms', 'light passes'],
  6: ['crystal slabs', 'harmonic', 'tuning fork', 'hover'],
  7: ['parasite whispers', 'npc broadcasts', 'despair'],
  8: ['giants', 'crystalline amplifiers', 'cloaked'],
  9: ['flicker', 'shimmer', 'crystalline scaffolding'],
  10: ['saferons', 'ground healers', 'council of 12 suns'],
  11: ['water domes', 'crystal halls', 'star pods'],
  12: ['vatican', 'reincarnation', 'memory streams'],
  13: ['gobekli tepe', 'hagia sophia', 'abbeys'],
  14: ['council of 12 suns', 'saferons', 'ground healers'],
  15: ['shock', 'disorientation', 'solar gate'],
  16: ['lyran', 'pleiadian', 'andromedan'],
  17: ['hover', 'do not stand', 'orbs'],
  18: ['harmonic frequency', 'sings a soul', 'realities'],
  19: ['light body grid', 'memory streams', 'clarity'],
  20: ['blue-aqua-silver', 'liquid sound', 'water domes'],
  21: ['star pods', 'timeline', 'karmic'],
  22: ['parasitic overlays', 'low-frequency', 'projections'],
  23: ['ascend', 'known lands', 'fresh'],
  24: ['electro-magnetic', 'crystalline grid', 'grid'],
  25: ['crystal prisms', 'mental overlays', 'mind control'],
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
    [/^The source material identifies\s+/i, ''],
    [/^The source identifies\s+/i, ''],
    [/^The source explicitly names\s+/i, ''],
    [/^The source presents them as\s+/i, ''],
    [/\bthe source material identifies\b/gi, ''],
    [/\bthe source identifies\b/gi, ''],
    [/\bthe source explicitly names\b/gi, ''],
    [/\bthe source presents them as\b/gi, 'they are'],
    [/\bthe source presents\b/gi, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/\bthe text links them specifically to\b/gi, 'they are linked to'],
    [/\bthe text states\b/gi, ''],
    [/\bthe text describes\b/gi, ''],
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
 * All four options at similar depth from the crystal-halls report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'Mending the mind, dissolving cognitive distortions, and dismantling deep-seated parasitic programming.',
      rationale:
        'Crystal Halls are uniquely calibrated to mend the mind, dissolve cognitive distortions, and dismantle deep-seated parasitic programming within the triad of healing sanctuaries.',
    },
    {
      text: 'Emotional trauma release through liquid-sound immersion in blue-aqua-silver vibrational pools only.',
      rationale:
        'Emotional trauma and liquid-sound immersion belong to Water Domes; Crystal Halls focus on mental and energetic mind mending.',
    },
    {
      text: 'Physical body detoxification and structural realignment of dense 3D flesh vessels in surgical halls.',
      rationale:
        'Healing is non-physical in crystalline body selves or conscious orbs—not physical detox of 3D flesh vessels.',
    },
    {
      text: 'Soul restoration and resolution of timeline or karmic fractures inside etheric light cocoons alone.',
      rationale:
        'Star Pods mend the soul and resolve timeline or karmic fractures; Crystal Halls repair the mind and programming.',
    },
  ],
  2: [
    {
      text: 'Ancient stone cathedrals, churches, and medieval abbeys projected as low-frequency sacred architecture.',
      rationale:
        'To ordinary human perception, living crystal structures appear as physical stone cathedrals, churches, and abbeys via parasitic overlays.',
    },
    {
      text: 'Modern scientific laboratories and medical centers with clinical white corridors and machine arrays.',
      rationale:
        'Overlays use ancient sacred stone architecture—cathedrals, churches, abbeys—not modern laboratory aesthetics.',
    },
    {
      text: 'Natural mountain ranges and empty subterranean caverns with no religious architecture overlay at all.',
      rationale:
        'While halls sit on grid nodes, the visual overlay is specifically stone cathedrals, churches, and abbeys.',
    },
    {
      text: 'Vibrant open gardens and marketplaces that replace all cathedral and abbey stone imagery completely.',
      rationale:
        'Parasitic overlays project low-frequency images of physical stone sacred structures, not garden marketplaces.',
    },
  ],
  3: [
    {
      text: 'Conscious orbs of electricity or high-frequency crystalline body selves hovering for direct healing.',
      rationale:
        'Souls do not stand on feet but hover as conscious orbs of electricity or exist in crystalline body selves so energetic structure absorbs frequencies without 3D toxins.',
    },
    {
      text: 'Etheric shadows waiting passively for reincarnation with no active absorption of harmonic frequencies.',
      rationale:
        'Healing empowers active crystalline or orb forms absorbing slab frequencies—not passive reincarnation shadows.',
    },
    {
      text: 'Physical vessels of flesh and bone standing upright on solid stone floors throughout the temple.',
      rationale:
        'The 3D vessel is a toxic limitation; healing occurs in crystalline body selves or conscious orbs, not flesh standing on floors.',
    },
    {
      text: 'Static holographic projections of human faces fixed in place with no hover or crystalline body form.',
      rationale:
        'Souls are conscious orbs or crystalline body selves hovering over slabs—not static face holograms.',
    },
  ],
  4: [
    {
      text: 'Breathing columns that circulate high-frequency currents to realign souls to their creation template.',
      rationale:
        'Lungs of Light are breathing columns of energy that expand and contract, circulating high-frequency currents to align the soul back to its original creation template.',
    },
    {
      text: 'Static stone pillars whose only job is to hold the cathedral ceiling against ordinary gravity loads forever.',
      rationale:
        'Columns are active energetic conduits that breathe like lungs of light, not mere static physical supports.',
    },
    {
      text: 'Oxygen filters for visitors who remain in dense physical form and still require atmospheric air to breathe.',
      rationale:
        'Souls heal as orbs or crystalline body selves; Lungs of Light circulate energy currents, not physical oxygen for flesh visitors.',
    },
    {
      text: 'Memory vaults that archive every visitor’s full history without circulating energy through the hall space.',
      rationale:
        'These columns are conduits for energetic circulation and creation-template alignment, not passive visitor memory archives.',
    },
  ],
  5: [
    {
      text: 'Light passing through complex crystal prisms in living walls, producing multi-colored shimmer.',
      rationale:
        'Rainbow Fractals are multi-colored shimmering patterns emitted when light passes through crystal prisms in living crystal walls.',
    },
    {
      text: 'Artificial neon lighting systems hidden in stone walls with no living crystal or prism light interaction.',
      rationale:
        'Fractals are organic effects of light through living crystal prisms, not electronic neon systems.',
    },
    {
      text: 'Movement of Giants walking the domes, casting colored shadows that replace all prism-born wall light.',
      rationale:
        'Giants use crystalline amplifiers for dome stability; rainbow fractals come from light through crystal prisms in the walls.',
    },
    {
      text: 'Emotional release alone in Water Dome pools with no architectural light-prism role inside Crystal Halls.',
      rationale:
        'Rainbow fractals are Crystal Hall wall architecture from light and prisms, not Water Dome emotional release effects.',
    },
  ],
  6: [
    {
      text: 'The slab hums targeted harmonic frequencies like a tuning fork, realigning the soul’s distorted matrix.',
      rationale:
        'Massive crystal slabs hum continuously with targeted harmonic frequencies; the hum acts as a tuning fork realigning the shattered or distorted harmonic matrix as souls hover over the slabs.',
    },
    {
      text: 'The soul is instantly teleported to another galaxy with no harmonic realignment on the slab surface.',
      rationale:
        'Slabs stabilize and realign harmonic matrices for healing; later extraction uses the solar gate network, not instant galaxy teleport from the slab.',
    },
    {
      text: 'The soul enters forced deep sleep that wipes all previous memories into permanent amnesia loops.',
      rationale:
        'Slabs restore natural memory streams and realign harmonics; they do not wipe memories into amnesia.',
    },
    {
      text: 'Physical surgery removes implants while the soul remains locked in a dense 3D flesh body on the slab.',
      rationale:
        'Healing is purely energetic in crystalline body selves hovering over humming slabs—not physical surgery on flesh.',
    },
  ],
  7: [
    {
      text: 'Low-frequency NPC broadcasts and artificial thoughts designed to cause despair, confusion, and suppression.',
      rationale:
        'Parasite whispers are low-frequency NPC broadcasts and artificial thoughts designed to cause despair or confusion; Crystal Halls neutralize these fields.',
    },
    {
      text: 'The natural sound of the earth’s electromagnetic grid shifting during ordinary planetary weather cycles.',
      rationale:
        'Grid integration is natural infrastructure; parasite whispers are targeted artificial NPC broadcasts, not weather grid sounds.',
    },
    {
      text: 'Healthy natural intuition that warns of physical danger and guides sovereign soul navigation safely.',
      rationale:
        'Intuition is a restored soul capacity; parasite whispers are artificial destructive programming, not healthy intuition.',
    },
    {
      text: 'Secret councils of ancient Lyran builders trading construction plans inside the living crystal walls.',
      rationale:
        'Lyrans were benevolent original builders; parasite whispers are NPC broadcasts from parasitic programming, not Lyran secrets.',
    },
  ],
  8: [
    {
      text: 'The Giants, who use natural crystalline amplifiers to keep cloaked domes stable against interference.',
      rationale:
        'Giants use natural crystalline amplifiers to keep cloaked domes stable and protect them from parasitic interference.',
    },
    {
      text: 'The Vatican clergy, who run memory-wiping reincarnation loops as the halls’ primary technical staff.',
      rationale:
        'Vatican-anchored loops are what Crystal Halls help neutralize; Giants stabilize cloaked domes with amplifiers.',
    },
    {
      text: 'The Council of 12 Suns alone, who operate amplifiers without any Giant role in dome stability work.',
      rationale:
        'The Council provides Saferons as Ground Healers; Giants specifically handle crystalline amplifiers and cloaked-dome stability.',
    },
    {
      text: 'Pleiadians alone as the only race managing present-day amplifiers with no Giant stabilization role.',
      rationale:
        'Pleiadians helped original design; Giants currently support stability with crystalline amplifiers against parasitic interference.',
    },
  ],
  9: [
    {
      text: 'They flicker, shimmer, and bend, revealing the underlying crystalline scaffolding of the true temples.',
      rationale:
        'As collective frequency rises, holographic 3D structures of concrete, brick, and steel flicker, shimmer, and bend, revealing underlying crystalline scaffolding.',
    },
    {
      text: 'They are instantly replaced by Star Pods that erase all cathedral overlays without any flicker phase.',
      rationale:
        'Star Pods are separate soul-timeline sanctuaries; rising frequency makes 3D overlays flicker to reveal Crystal Halls, not replace them with Star Pods.',
    },
    {
      text: 'They become permanently solidified and impossible to dissolve no matter how high frequency rises.',
      rationale:
        'Rising frequency destabilizes parasitic overlays rather than permanently solidifying low-frequency holographic matter.',
    },
    {
      text: 'They turn entirely into water and evaporate, leaving no crystalline scaffolding visible underneath.',
      rationale:
        'Structures shimmer and reveal crystalline scaffolding; they do not evaporate into water as the described transition.',
    },
  ],
  10: [
    {
      text: 'True — Saferons (Ground Healers) from the Council of 12 Suns meet and stabilize arriving souls.',
      rationale:
        'Confused souls are met by Ground Healers—also known as Saferons—tall, gentle holographic light beings from the Council of 12 Suns who radiate love and safety.',
    },
    {
      text: 'False — no Ground Healers exist; souls arrive alone with zero holographic stabilization support.',
      rationale:
        'Saferons from the Council of 12 Suns greet and stabilize incoming souls with unconditional love and safety.',
    },
    {
      text: 'False — only Giants greet souls, and Saferons never appear as holographic light beings at all.',
      rationale:
        'Giants stabilize cloaked domes with amplifiers; Saferons are the Ground Healers who meet and stabilize arriving souls.',
    },
    {
      text: 'False — Saferons are parasites who impose cathedral overlays rather than stabilize recovering souls.',
      rationale:
        'Saferons are benevolent Council-sent holographic healers; parasitic overlays hide halls, they do not staff the healers.',
    },
  ],
  11: [
    {
      text: 'Water Domes first, then Crystal Halls, then Star Pods for multi-layered sequential rehabilitation.',
      rationale:
        'Sequential order is Water Domes (emotional), then Crystal Halls (mind), then Star Pods (soul and timeline/karmic fractures).',
    },
    {
      text: 'Star Pods first, then Crystal Halls, then Water Domes as the only permitted recovery sequence.',
      rationale:
        'Star Pods are the final triad stage; Water Domes precede Crystal Halls, which precede Star Pods.',
    },
    {
      text: 'Crystal Halls first, then Water Domes, then Star Pods with emotion healed only after mind work.',
      rationale:
        'Emotional healing in Water Domes precedes mental mending in Crystal Halls before Star Pod soul work.',
    },
    {
      text: 'Water Domes, then Star Pods, then Crystal Halls with mind repair deferred until after soul cocooning.',
      rationale:
        'Crystal Halls mental repair comes before Star Pod cocooning; order is Water Domes → Crystal Halls → Star Pods.',
    },
  ],
  12: [
    {
      text: 'They neutralize artificial reincarnation loops by restoring memory streams and soul sovereignty.',
      rationale:
        'Clearing parasitic programming and restoring original memory streams neutralizes artificial reincarnation loops and memory-wiping systems historically anchored beneath the Vatican.',
    },
    {
      text: 'They act as backup storage for Vatican memory-wiping data used to recycle fragments forever.',
      rationale:
        'Halls dismantle and neutralize Vatican-anchored loops; they do not store memory-wiping data for recycling.',
    },
    {
      text: 'They bypass loops by forcing souls straight back into amnesic 3D bodies without memory restoration.',
      rationale:
        'Restored memory and sovereignty free souls from continuous amnesia loops—not forced return into amnesic 3D bodies.',
    },
    {
      text: 'They power the loops through grid nodes so Vatican systems can keep wiping memory indefinitely.',
      rationale:
        'Crystal Halls clear programming and neutralize Vatican-anchored reincarnation traps; they do not power those loops.',
    },
  ],
  13: [
    {
      text: 'Mount Sinai — not listed among cathedral, abbey, Hagia Sophia, or Gobekli Tepe overlay sites.',
      rationale:
        'Named sites include cathedrals, abbeys, Hagia Sophia, and Gobekli Tepe; Mount Sinai is not listed as a Crystal Hall overlay site in this report.',
    },
    {
      text: 'Gobekli Tepe — never associated with grid nodes or Crystal Hall structures in this teaching.',
      rationale:
        'Gobekli Tepe is explicitly named among ancient sites built on major grid nodes hiding Crystal Hall structures.',
    },
    {
      text: 'Ancient medieval abbeys — never used as overlays for living crystal temples of mental healing.',
      rationale:
        'Abbeys are explicitly named among parasitic stone overlays hiding Crystal Halls.',
    },
    {
      text: 'Hagia Sophia — never listed as a site where crystal temple structure lies beneath an overlay.',
      rationale:
        'Hagia Sophia is specifically listed with cathedrals, abbeys, and Gobekli Tepe as sites over Crystal Halls.',
    },
  ],
  14: [
    {
      text: 'They provide Ground Healers (Saferons) who radiate unconditional love and stabilize arriving souls.',
      rationale:
        'Ground Healers known as Saferons are tall, gentle holographic light beings from the Council of 12 Suns who radiate unconditional love and safety.',
    },
    {
      text: 'They are the parasites Crystal Halls dissolve when slabs hum and prisms clear mental overlays.',
      rationale:
        'The Council of 12 Suns is benevolent and sends Saferons; parasites impose overlays the halls clear.',
    },
    {
      text: 'They exclusively run the solar gate extraction network with no Saferon or Ground Healer role.',
      rationale:
        'In this report the Council’s named sanctuary role is providing Saferons for stabilization; solar gates are extraction pathways for later transition.',
    },
    {
      text: 'They built physical cathedrals as protective shells over living crystal to hide halls from souls.',
      rationale:
        'Cathedrals and abbeys are parasitic overlays, not Council-built protective shells for the halls.',
    },
  ],
  15: [
    {
      text: 'Realigning harmonic codes so souls can phase out of the 3D matrix without shock or disorientation.',
      rationale:
        'Rehabilitation is vital for souls too fragmented for immediate solar-gate extraction; realigning harmonic codes ensures safe phase-out without shock or disorientation.',
    },
    {
      text: 'Paying karmic debt tolls required by Cube containment before any soul may leave the realm.',
      rationale:
        'The process restores harmonic codes and sovereignty for safe transition—not payment of karmic debt tolls.',
    },
    {
      text: 'Training dense physical bodies to survive vacuum of space on rockets outside the Great Dome.',
      rationale:
        'Extraction is phased energetic transition after harmonic realignment, not physical rocket survival training.',
    },
    {
      text: 'Teaching every soul to construct new Crystal Halls as builders before any homecoming is allowed.',
      rationale:
        'Focus is rehabilitation and safe phase-out or Known Lands choice—not mandatory builder training for new halls.',
    },
  ],
  16: [
    {
      text: 'Ancient Lyran, Pleiadian, and Andromedan builders who designed and positioned the structures.',
      rationale:
        'Crystalline structures were originally designed and positioned by ancient Lyran, Pleiadian, and Andromedan builders.',
    },
    {
      text: 'Saferons and the Council of 12 Suns alone as the only designers of the original crystal temples.',
      rationale:
        'Saferons stabilize arriving souls; original design and positioning are credited to Lyran, Pleiadian, and Andromedan builders.',
    },
    {
      text: 'Modern architectural engineers who poured concrete cathedrals as the true living crystal form.',
      rationale:
        'Human stone perception is overlay; living crystal temples are ancient advanced structures, not modern concrete engineering.',
    },
    {
      text: 'The Giants alone as original designers with no Lyran, Pleiadian, or Andromedan design role.',
      rationale:
        'Giants currently stabilize cloaked domes with amplifiers; original design belongs to Lyran, Pleiadian, and Andromedan builders.',
    },
  ],
  17: [
    {
      text: 'False — souls hover as conscious orbs or crystalline body selves and do not stand or kneel.',
      rationale:
        'Souls do not stand on their feet; they hover as conscious orbs of electricity or crystalline body selves over the slabs.',
    },
    {
      text: 'True — every soul must stand or kneel on stone floors so harmonic frequencies can enter through feet.',
      rationale:
        'Healing is non-physical; souls hover over slabs rather than stand or kneel on floors.',
    },
    {
      text: 'True — kneeling in cathedral pews is required before any crystal slab hum can begin realignment.',
      rationale:
        'Cathedral pews are overlay imagery; true process is hovering over humming crystal slabs in crystalline form.',
    },
    {
      text: 'True — physical feet must touch the slab surface or the tuning-fork hum cannot realign the matrix.',
      rationale:
        'Souls hover directly over slabs as orbs or crystalline body selves; physical standing is not required.',
    },
  ],
  18: [
    {
      text: 'The fundamental vibratory resonance that sings a soul in and out of realities, reactivated on slabs.',
      rationale:
        'Harmonic Frequency is the fundamental vibratory resonance that sings a soul in and out of realities, reactivated on crystal slabs.',
    },
    {
      text: 'Only the noise of parasitic overlays failing when concrete and brick flicker during frequency rise.',
      rationale:
        'Overlay flicker is a strategic symptom of rising frequency; Harmonic Frequency is the soul’s fundamental vibratory resonance on slabs.',
    },
    {
      text: 'A numeric password used solely to unlock Vatican archive doors with no soul-resonance meaning.',
      rationale:
        'Harmonic Frequency is the soul’s vibratory signature reactivated on slabs—not a Vatican door password.',
    },
    {
      text: 'The limited human musical scale sung in cathedrals with no role in singing souls across realities.',
      rationale:
        'Human cathedral music is overlay culture; Harmonic Frequency is the fundamental resonance that sings souls in and out of realities.',
    },
  ],
  19: [
    {
      text: 'Natural memory streams restore, mental clarity returns, and the inner spark reignites for navigation.',
      rationale:
        'Realigning the light body grid restores natural memory streams; confusion lifts, mental clarity returns, and the inner spark reignites for independent soul journeys.',
    },
    {
      text: 'The entire 3D matrix is destroyed instantly for everyone the moment one soul’s grid realigns fully.',
      rationale:
        'Individual grid realignment restores personal memory and clarity; collective overlay flicker is a broader frequency process.',
    },
    {
      text: 'The soul is forced back into continuous amnesic reincarnation as the only permitted post-healing path.',
      rationale:
        'Light body realignment restores memory streams and helps neutralize forced reincarnation loops, not re-impose them.',
    },
    {
      text: 'The soul becomes invisible to Giants so guardians can no longer protect cloaked dome environments.',
      rationale:
        'Giants protect domes with amplifiers; grid realignment restores memory and clarity—it is not about vanishing from Giants.',
    },
  ],
  20: [
    {
      text: 'Blue-aqua-silver water vibrating like liquid sound that draws out emotional density in Water Domes.',
      rationale:
        'Water Domes address emotional trauma with pools of blue-aqua-silver water that vibrates like liquid sound, drawing out emotional density.',
    },
    {
      text: 'Pure living crystal walls glowing with rainbow fractals as the primary Water Dome environment only.',
      rationale:
        'Living crystal walls and rainbow fractals characterize Crystal Halls, not Water Dome liquid-sound pools.',
    },
    {
      text: 'A womb of light in etheric space used solely for timeline fractures inside Star Pod cocoons only.',
      rationale:
        'Womb-of-light cocoons in etheric space describe Star Pods; Water Domes use liquid-sound blue-aqua-silver pools.',
    },
    {
      text: 'Physical stone cathedrals that hide secret liquid pools as the true Water Dome healing chamber.',
      rationale:
        'Stone cathedrals are Crystal Hall overlays; Water Domes use blue-aqua-silver liquid sound pools for emotional density.',
    },
  ],
  21: [
    {
      text: 'Star Pods — cocooning the soul in a womb of light to resolve timeline and karmic fractures.',
      rationale:
        'Star Pods mend the soul and resolve timeline or karmic fractures by cocooning the soul in a womb of light in etheric space.',
    },
    {
      text: 'Crystal Halls — exclusive focus on timeline and karmic fractures with no mind-mending role at all.',
      rationale:
        'Crystal Halls mend the mind and clear mental overlays; Star Pods handle timeline and karmic soul fractures.',
    },
    {
      text: 'Solar Gates — counted as the third specialized healing sanctuary for karmic fracture cocooning.',
      rationale:
        'Solar gates are extraction pathways; the three sanctuaries are Water Domes, Crystal Halls, and Star Pods.',
    },
    {
      text: 'Water Domes — dedicated only to timeline mending with no emotional liquid-sound density work.',
      rationale:
        'Water Domes release emotional density via liquid sound; Star Pods resolve timeline and karmic fractures.',
    },
  ],
  22: [
    {
      text: 'Artificial low-frequency projections imposed by parasites to hide crystalline structures and hijack perception.',
      rationale:
        'Parasitic Overlays are artificial low-frequency projections imposed by parasites to hide real crystalline structures and hijack human perception.',
    },
    {
      text: 'Combined pure imagination of the collective that invents cathedrals with no parasitic imposition.',
      rationale:
        'Overlays are parasitic impositions hijacking perception—not merely collective imagination without parasites.',
    },
    {
      text: 'The natural magnetic field of Earth alone, which accidentally looks like stone cathedrals everywhere.',
      rationale:
        'Overlays are artificial low-frequency projections for deception; natural grid nodes host halls but are not the deceptive overlays.',
    },
    {
      text: 'The Council of 12 Suns projecting overlays to hide halls from souls who need healing the most.',
      rationale:
        'The Council sends Saferons to stabilize souls; parasites impose the deceptive low-frequency overlays.',
    },
  ],
  23: [
    {
      text: 'Ascend to higher realms or reincarnate into a fresh, unpolluted cycle within the Known Lands.',
      rationale:
        'Once stabilized, souls can choose to ascend to higher realms or reincarnate into a fresh, unpolluted cycle within the Known Lands.',
    },
    {
      text: 'Mandatory merge with Giants to protect amplifiers with no ascent or Known Lands option allowed.',
      rationale:
        'Stabilized souls choose ascent or a fresh Known Lands cycle and may align with star families—not forced Giant merger.',
    },
    {
      text: 'Required permanent return to the 3D matrix as the only allowed mission after harmonic realignment.',
      rationale:
        'Path choice includes ascent or fresh Known Lands cycle; forced permanent 3D return is not required.',
    },
    {
      text: 'Forced lifelong service as Ground Healers replacing Saferons inside every Crystal Hall forever.',
      rationale:
        'Ground Healers are Saferons from the Council; rehabilitated souls regain sovereignty for their own path choice.',
    },
  ],
  24: [
    {
      text: 'Fully integrated into the earth’s electro-magnetic crystalline grid and linked to outer Cube domes.',
      rationale:
        'Sanctuaries are fully integrated into the earth’s electro-magnetic crystalline grid and connected to the other seven outer domes of the Cube containment.',
    },
    {
      text: 'Isolated pods floating only in atmosphere with zero connection to planetary grid nodes or domes.',
      rationale:
        'Halls integrate into the planetary crystalline grid and outer Cube domes—not isolated atmospheric float pods.',
    },
    {
      text: 'Existing only as private mental images inside awakened minds with no objective crystal structure.',
      rationale:
        'Crystal Halls are living crystal structures on grid nodes under overlays—objective sanctuaries, not mere mental images.',
    },
    {
      text: 'Anchored solely in the molten core with no surface grid nodes, cathedrals, or outer dome links.',
      rationale:
        'Halls associate with surface sacred-site grid nodes and outer Cube domes, not solely a molten-core anchorage.',
    },
  ],
  25: [
    {
      text: 'It dissolves deep distortions, mental overlays, and mind-control damage in the soul’s energy field.',
      rationale:
        'Crystal prisms project targeted light through the soul’s energy field to dissolve deep distortions, mental overlays, and mind control damage.',
    },
    {
      text: 'It only blinds parasites externally with no internal dissolving of mental overlays or programming.',
      rationale:
        'Primary effect is dissolving distortions and mind-control damage inside the soul’s field—not merely blinding parasites.',
    },
    {
      text: 'It supplies physical heat so crystalline body selves stay warm like dense 3D biological organisms.',
      rationale:
        'Crystalline healing needs frequency alignment and light projection, not physical heat for biological warmth.',
    },
    {
      text: 'It manufactures the stone cathedral walls that hide living crystal from all ordinary human sight.',
      rationale:
        'Stone cathedrals are parasitic overlays; prism light dissolves internal distortions and reveals crystalline truth, not builds stone walls.',
    },
  ],
};

const questionsMeta = [
  {
    number: 1,
    question: 'What is the primary purpose of the Crystal Halls within the triad of healing sanctuaries?',
    hint: 'Consider which part of the human experience involves cognitive distortions and mind control.',
  },
  {
    number: 2,
    question: 'How do Crystal Halls appear to ordinary human perception due to parasitic overlays?',
    hint: 'Think of traditional religious structures found in the physical 3D world.',
  },
  {
    number: 3,
    question: 'In what form do souls exist while undergoing healing within a Crystal Hall?',
    hint: 'Focus on the high-frequency energetic state required to interact with living crystals.',
  },
  {
    number: 4,
    question: "What is the function of the Lungs of Light within the temple architecture?",
    hint: "Reflect on the name lungs and what that implies about movement and energy.",
  },
  {
    number: 5,
    question: 'How are the rainbow fractals within the Crystal Halls produced?',
    hint: 'Consider the relationship between light and prisms.',
  },
  {
    number: 6,
    question: 'What occurs when a soul rests upon a crystal slab?',
    hint: 'Think about the vibrational nature of a tuning fork.',
  },
  {
    number: 7,
    question: "What are parasite whispers within the context of mental distortions?",
    hint: 'Identify the source of thoughts that lead to confusion and a lack of clarity.',
  },
  {
    number: 8,
    question: 'Which beings are responsible for stabilizing the cloaked domes and using crystalline amplifiers?',
    hint: 'Think of the protectors who manage the natural crystalline amplifiers.',
  },
  {
    number: 9,
    question: 'What happens to the holographic 3D structures as the collective frequency of the realm rises?',
    hint: 'Consider what happens to an illusion when its power source becomes unstable.',
  },
  {
    number: 10,
    question: 'True or False: Souls arriving at the sanctuaries are met by Ground Healers called Saferons.',
    hint: 'Recall the name of the beings from the Council of 12 Suns.',
  },
  {
    number: 11,
    question: 'What is the specific order of healing if a soul requires sequential rehabilitation?',
    hint: 'The process moves from emotional to mental to soul-level restoration.',
  },
  {
    number: 12,
    question: 'How do Crystal Halls interact with the artificial reincarnation loops anchored beneath the Vatican?',
    hint: 'Think about what happens to a trap when the victim regains their memory and awareness.',
  },
  {
    number: 13,
    question: 'Which of the following sites is NOT mentioned as having a Crystal Hall structure beneath it?',
    hint: 'Look for the location that is not explicitly named as an overlay site in the teaching.',
  },
  {
    number: 14,
    question: 'What is the primary role of the Council of 12 Suns in relation to the sanctuaries?',
    hint: 'Think about the source of the tall, gentle light beings.',
  },
  {
    number: 15,
    question: 'Why is the healing process in Crystal Halls considered vital before extraction?',
    hint: 'Consider the impact of leaving a low-frequency system when the soul is still fragmented.',
  },
  {
    number: 16,
    question: 'Which groups are credited with the original design and positioning of the crystalline structures?',
    hint: 'Look for the names of the ancient star-based builder races.',
  },
  {
    number: 17,
    question: 'True or False: Souls in the Crystal Halls are required to stand or kneel during frequency alignment.',
    hint: 'Recall the non-physical form that souls take within the healing temples.',
  },
  {
    number: 18,
    question: "What is Harmonic Frequency as defined in the context of the Crystal Halls?",
    hint: "Think of the resonance that serves as a soul's signature across different dimensions.",
  },
  {
    number: 19,
    question: "What is the ultimate result of realigning the light body grid?",
    hint: 'Consider what happens when the confusion caused by parasite whispers is removed.',
  },
  {
    number: 20,
    question: 'What characterizes the environment of the Water Domes?',
    hint: 'Focus on the sensory description specifically associated with emotional healing.',
  },
  {
    number: 21,
    question: 'In the triad of recovery, which sanctuary focuses on karmic fractures and timeline mending?',
    hint: "Identify the third environment that cocoons the soul in a womb of light.",
  },
  {
    number: 22,
    question: 'What creates the parasitic overlays used to hide the Crystal Halls?',
    hint: 'Consider the source of the low-frequency interference that obscures reality.',
  },
  {
    number: 23,
    question: 'Once a soul is stabilized in the Crystal Halls, what choice are they free to make?',
    hint: 'Focus on the options available to a soul that has regained its sovereignty.',
  },
  {
    number: 24,
    question: 'How are the Crystal Halls integrated into the planet?',
    hint: 'Think about the system of energy lines and nodes that span the planet.',
  },
  {
    number: 25,
    question: 'What is the primary effect of targeted light projected through crystal prisms?',
    hint: "Recall how prisms and rainbow fractals interact with the soul's energy field.",
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
      /according to the (report|text|source|journal)/i.test(o.text) ||
      /the source states/i.test(o.rationale) ||
      /the source states/i.test(o.text) ||
      /the source identifies/i.test(o.rationale) ||
      /the source material/i.test(o.rationale) ||
      /the source explicitly/i.test(o.rationale) ||
      /the text states/i.test(o.rationale) ||
      /the text describes/i.test(o.rationale)
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
    'Test your grasp of Crystal Halls — cathedral overlays hiding living crystal temples, humming slabs, rainbow fractals, Lungs of Light, Saferons, Giants, and the Water Domes / Crystal Halls / Star Pods triad.',
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'Crystal Halls mend the mind beneath stone cathedral overlays. Sit with crystal slabs that hum like tuning forks, rainbow fractals from living prisms, Lungs of Light that breathe creation templates back online, and Saferons who greet fragmented souls with safety. Return to the Crystal Halls deep-dive, infographic, and video transmissions as you hold the choice to ascend or enter a fresh Known Lands cycle free of Vatican amnesia loops.',
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
    'Test your understanding of Crystal Halls — mind-mending living crystal temples under cathedral overlays; humming harmonic slabs; rainbow fractals and Lungs of Light; Saferons and Giants; Water Domes / Crystal Halls / Star Pods order; and sovereignty after memory restoration.',
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
        t.description.includes('Decoded analysis of Crystal Halls')
      ) {
        t.description =
          'Crystal Halls are living crystal temples of mental and energetic healing hidden beneath cathedral and abbey overlays — crystal slabs hum harmonic frequencies, rainbow fractals dissolve mind-control damage, and Saferons stabilize souls in their crystalline body selves.';
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('crystal-halls not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from memory-restoration (has critical paint + quiz chrome)
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'memory-restoration.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Crystal Halls: mind-mending living crystal temples under cathedral overlays, humming harmonic slabs, rainbow fractals, Lungs of Light, Saferons, Giants, and the Water Domes / Crystal Halls / Star Pods triad.';

// Order matters: longer/more specific first
const replacements = [
  ['Memory Restoration Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Memory Restoration: Water Domes heart-mending, Liquid Sound density extraction, Memory Codes of Source, Ground Healers (Saferins/Saferons), vision and sound recall, and sovereign path selection after true memory returns.',
    desc,
  ],
  ['quiz/breakdown/memory-restoration.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/memory-restoration.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=memory-restoration',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`,
  ],
  ['Memory Restoration deep-dive', `${TOPIC_TITLE} deep-dive`],
  [
    'data/quizzes/breakdown/memory-restoration.json',
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
  .replace(/Interactive Living Truth Quiz on Memory Restoration[^"]*/g, desc)
  .replace(/<title>Memory Restoration Quiz/g, `<title>${TOPIC_TITLE} Quiz`)
  .replace(/Memory Restoration Quiz \|/g, `${TOPIC_TITLE} Quiz |`)
  .replace(/Memory Restoration deep-dive/g, `${TOPIC_TITLE} deep-dive`)
  .replace(/topic=memory-restoration/g, `topic=${TOPIC_ID}`)
  .replace(/memory-restoration\.webp/g, 'crystal-halls.webp')
  .replace(/memory-restoration\.json/g, 'crystal-halls.json')
  .replace(/memory-restoration\.html/g, 'crystal-halls.html');

// Ensure critical paint remains
if (!html.includes('html,body{background-color:#0F0A1F}')) {
  html = html.replace(
    '    <link rel="preload"',
    `    <!-- Critical paint: solid vault color before main.css (prevents white flash) -->
    <style>html,body{background-color:#0F0A1F}</style>
    <link rel="preload"`
  );
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
    "  { path: '/quiz/breakdown/memory-restoration.html', priority: '0.75', changefreq: 'monthly' },";
  if (!sm.includes(anchor)) {
    const alt =
      "  { path: '/quiz/breakdown/liquid-sound.html', priority: '0.75', changefreq: 'monthly' },";
    if (!sm.includes(alt)) {
      throw new Error('Could not find sitemap anchor to insert quiz entry');
    }
    sm = sm.replace(alt, `${alt}\n${entry}`);
  } else {
    sm = sm.replace(anchor, `${anchor}\n${entry}`);
  }
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('Correct letter mix:', letterCounts);
console.log(
  'PASS: audited 25/25 against data/breakdown-topics/crystal-halls.json'
);
