/**
 * Installs Healing Path quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/restoration-quiz.json
 * Title forced to "Healing Path". All 25 audited against healing-path report only.
 *
 * Run: node scripts/install-healing-path-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/healing-path.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'healing-path';
const TOPIC_TITLE = 'Healing Path';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/restoration-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/healing-path.webp';

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

/** Support phrases grounded only in healing-path.json report. */
const supportPhrases = {
  1: [
    'bypass these restorative states to travel the homecoming path',
    'human sols require specialized care'
  ],
  2: ['pure frequency environments constructed from light, sound, and living crystal'],
  3: [
    'liquid sound frequencies draw out emotional density and mend the heart',
    'memory codes of source'
  ],
  4: ['masked by 3d perception as cathedrals, churches, and abbeys'],
  5: [
    'project luminous outlines',
    'mirror the soul families',
    'absolute safety and trust'
  ],
  6: [
    'reweave the fragmented, shattered aspects of the soul across all timelines',
    'deep soul fractures'
  ],
  7: ['ancient lyran lineage', 'massive biological electromagnetic fields'],
  8: [
    'illusion of solidity designed to trap perception',
    'low-frequency matter'
  ],
  9: ['recovery sanctuary for recalibrating resonance', 'prison of shadows'],
  10: [
    'ripped out by the greys under the orders of the custodians',
    'frequency-siphoning valve'
  ],
  11: [
    'permanently starves the parasitic systems',
    'negative emotional energy, or loosh'
  ],
  12: ['decalcification of the pineal gland', 'monotomic gold'],
  13: ['dissolve like npc background programs', 'true human sparks'],
  14: [
    'dome of forgotten gods',
    'origin chamber and memory storage unit vault'
  ],
  15: [
    'ascend to higher multi-dimensional realms',
    'fresh, unpolluted, and fully crystalline incarnation'
  ],
  16: [
    'keep the cloaking fields of these domes stable',
    'natural crystalline amplifiers'
  ],
  17: ['grief, fear, heartbreak, and guilt', 'memory codes of source'],
  18: [
    'three distinct mechanical stages',
    'emotional, mental, and spiritual calibration'
  ],
  19: [
    'astral travel during sleep states',
    'manifest its own reality through pure consciousness'
  ],
  20: [
    'focused through crystal prisms',
    'dissolving mental overlays, mind control damage, and parasitic programming'
  ],
  21: [
    'one massive, unified healing environment',
    'planet-wide med bed'
  ],
  22: [
    'never use force or commands',
    'overwhelming sense of absolute safety and homecoming',
    'removing all residual panic'
  ],
  23: [
    'human sols require specialized care',
    'gently transitioned into these sanctuaries'
  ],
  24: [
    'strategic option to return to these sanctuaries',
    'completed their homecoming path'
  ],
  25: [
    'copying their akashic fragments under the vatican',
    'enforce continuous reincarnation loops'
  ]
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
    [/^The source specifies that\s+/i, ''],
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
    [/\bthe source specifies that\b/gi, ''],
    [/\bthe source explains that\b/gi, ''],
    [/\bthe source explains\b/gi, ''],
    [/\bthe material describes them as\b/gi, 'they are'],
    [/\bthe material describes\b/gi, ''],
    [/\bis described as\b/gi, 'is'],
    [/\bare described as\b/gi, 'are'],
    [/\bis identified as\b/gi, 'is'],
    [/\bare identified as\b/gi, 'are']
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
 * NotebookLM meaning kept; lengths evened; claims grounded in the Healing Path report.
 */
const fullOptionSets = {
  1: [
    {
      text: 'The healing path calibrates human sols who need restoration, while the Resonating Army takes the homecoming path straight to origin.',
      rationale:
        'Human sols require specialized care to reverse trauma, mind control, and fragmentation. Already awakened members of the Resonating Army bypass those restorative states and travel the homecoming path directly to their realms of origin.'
    },
    {
      text: 'The homecoming path is reserved for beings who were never captured, while the healing path is assigned to every entity in the Great Dome.',
      rationale:
        'The Resonating Army is already awakened and bypasses restoration. The healing path is designed specifically for fragmented human sols, not for every entity in the Great Dome.'
    },
    {
      text: 'The healing path repairs the biological body in physical hospitals, while the homecoming path uploads consciousness as a digital file.',
      rationale:
        'The sanctuaries are not physical hospitals. Healing works on the light body grid and the harmonic coding of the soul, not biological tissue or a digital upload.'
    },
    {
      text: 'The healing path is only a sleep-cycle meditation, while the homecoming path is a physical relocation into 3D medical facilities.',
      rationale:
        'The healing path is a structured multi-dimensional sequence in frequency environments of light, sound, and living crystal, not a hospital stay or a simple meditation.'
    }
  ],
  2: [
    {
      text: 'They are pure frequency environments constructed from light, sound, and living crystal rather than physical hospitals.',
      rationale:
        'Healing sanctuaries are not physical hospitals. They are pure frequency environments constructed from light, sound, and living crystal, projected as shimmering cloaked domes over mountains, valleys, oceans, and etheric planes.'
    },
    {
      text: 'They are artificial intelligence simulations designed to mirror the natural world and calm newly awakened minds.',
      rationale:
        'The sanctuaries are living frequency environments of light, sound, and living crystal, not AI simulations built to soothe the newly awakened.'
    },
    {
      text: 'They are solid stone bunkers built deep underground to shield human sols from the atmospheric dome collapse.',
      rationale:
        'The sanctuaries are shimmering cloaked domes of light, sound, and living crystal, not subterranean stone installations.'
    },
    {
      text: 'They are temporary shelters assembled from salvaged 3D materials left in the ruins of the parasitic network.',
      rationale:
        'The sanctuaries bypass 3D material constraints entirely. They are projected frequency environments, not salvage-built 3D shelters.'
    }
  ],
  3: [
    {
      text: 'They use liquid sound frequencies to draw out emotional density and replace it with harmonic Source memory codes.',
      rationale:
        'Water Domes mend the heart. Liquid sound extracts grief, fear, heartbreak, and guilt, then replaces that density with a harmonic resonance encoded with the memory codes of Source.'
    },
    {
      text: 'They serve as hydration centers where human sols ingest mineral-rich fluids to rebuild physical cellular structure.',
      rationale:
        'Water Domes work through liquid sound on the emotional body and the heart, not through physical hydration or cellular repair.'
    },
    {
      text: 'They drown out the Vatican amnesia loop by forcing souls through heavy pressurized water immersion.',
      rationale:
        'The waters vibrate as liquid sound and extract density through harmonic resonance. They do not use pressurized force against the Vatican loop.'
    },
    {
      text: 'They create a sensory-deprivation void that forces the soul to confront internal shadows with no outside signal.',
      rationale:
        'The pools stimulate internal visions and auditory recollections. Souls emerge lighter, smiling, and singing rather than sitting in deprivation.'
    }
  ],
  4: [
    {
      text: 'They are masked by 3D perception as cathedrals, churches, and abbeys hiding multi-layered crystalline temples.',
      rationale:
        'Crystal Halls are multi-layered crystalline temples currently masked by 3D perception as cathedrals, churches, and abbeys. In those halls, souls hover over harmonic crystal slabs while prisms dissolve mental overlays.'
    },
    {
      text: 'They stay completely invisible to everyone except those who have already finished the homecoming path.',
      rationale:
        'Crystal Halls are masked, not invisible. 3D perception still sees them, but as cathedrals, churches, and abbeys rather than living crystal temples.'
    },
    {
      text: 'They appear as modern medical facilities and research laboratories to match human expectations of clinical healing.',
      rationale:
        'The 3D mask is historical religious architecture — cathedrals, churches, and abbeys — not modern clinics or laboratories.'
    },
    {
      text: 'They are perceived only as natural mountain ranges and rock formations so remaining parasites cannot detect them.',
      rationale:
        'Healing sanctuaries can be projected over mountains, but Crystal Halls specifically appear as cathedrals, churches, and abbeys in 3D perception.'
    }
  ],
  5: [
    {
      text: 'They project luminous outlines that mirror the soul families of recovering human sols, creating absolute safety and trust.',
      rationale:
        'Saferons are tall, benevolent ground healers. They project luminous outlines that shift to reflect a soul\'s own star family, fostering absolute safety and trust and removing residual panic. They never use force or commands.'
    },
    {
      text: 'They record the Akashic history of every recovering soul so remaining karmic debts can be balanced in the halls.',
      rationale:
        'Saferons stabilize confused souls and foster trust. Karmic wounds are mended in Star Pods, and karmic-debt accounting belongs to the old parasitic loop being dismantled.'
    },
    {
      text: 'They act as security guards who block unauthorized entities from crossing into the high-frequency sanctuary domes.',
      rationale:
        'Saferons are gentle, non-physical holographic light beings from the Council of 12 Suns. They never use force or commands; they are not enforcers.'
    },
    {
      text: 'They physically construct and maintain the crystal slabs and prisms used inside the Crystal Halls.',
      rationale:
        'Saferons provide vibrational guidance and safety. Giants of Lyran lineage keep the cloaking fields of the domes stable with crystalline amplifiers.'
    }
  ],
  6: [
    {
      text: 'The pod reweaves fragmented soul aspects across all timelines, repairing deep soul fractures and karmic wounds.',
      rationale:
        'Star Pods are floating cocoons of circulating light in nebulae-like etheric space. High-frequency light reweaves shattered soul aspects across timelines and repairs trauma locked in by parasitic reincarnation tech.'
    },
    {
      text: 'The pod uses high-intensity lasers to burn parasitic neural lace off the brain before the next sanctuary stage.',
      rationale:
        'Star Pods use streams of high-frequency light to reweave the soul. They are not surgical laser chambers for physical neural hardware.'
    },
    {
      text: 'The pod is a transport vessel that carries human sols from physical Earth to distant solar systems in other galaxies.',
      rationale:
        'The pods are healing cocoons in etheric space for timeline and soul integration, not interstellar transport craft.'
    },
    {
      text: 'The soul is placed into a deep sleep so its memory can be wiped clean for a fresh start in the new realm.',
      rationale:
        'Star Pods restore and reweave fragmented memory and soul aspects. They do not wipe memory; the path returns pure memory streams.'
    }
  ],
  7: [
    {
      text: 'The Lyran lineage, known for massive biological electromagnetic fields and knowledge of natural crystalline amplifiers.',
      rationale:
        'The giants who supervise the sanctuaries are of ancient Lyran lineage. Their massive biological electromagnetic fields and knowledge of crystalline amplifiers keep the cloaking fields of the domes stable.'
    },
    {
      text: 'The Sirian lineage, assigned to create the Water Domes and manage the liquid-sound frequencies inside them.',
      rationale:
        'The giants who anchor the sanctuaries are of ancient Lyran lineage. Water Domes operate through liquid sound; that is not a Sirian-giant assignment in this path.'
    },
    {
      text: 'The Anunnaki lineage, returning to reclaim an original post as guardians of the Great Dome architecture.',
      rationale:
        'The giants belong to the ancient Lyran lineage. The report does not place Anunnaki as sanctuary supervisors.'
    },
    {
      text: 'The Pleiadian lineage, supplying both the ground healers and the technology that builds the Star Pods.',
      rationale:
        'Giants are Lyran. Ground healers, or Saferons, are sent from the Council of 12 Suns, not supplied as Pleiadian dome engineers.'
    }
  ],
  8: [
    {
      text: 'The perception that matter is concrete stone, when it is actually low-frequency matter designed to trap perception.',
      rationale:
        'Physical reality is an illusion of solidity designed to trap perception. Concrete stone and physical illness are merely low-frequency matter. True healing works on the light body grid and the soul\'s harmonic coding.'
    },
    {
      text: 'A psychological state of denial in which a human sol refuses to accept that the healing sanctuaries exist.',
      rationale:
        'The illusion of solidity is a property of low-frequency 3D matter, not a personal refusal to believe in the sanctuaries.'
    },
    {
      text: 'The belief that a soul can exist without a physical body, used by parasites as a lie to steal energy.',
      rationale:
        'The soul and light body are the reality. Physical matter is the illusion. Parasites trap perception in solidity; they do not prove the body is required.'
    },
    {
      text: 'A holographic screen the Resonating Army projects so the Greys cannot locate the cloaked healing sanctuaries.',
      rationale:
        'The illusion of solidity is the 3D perception of matter itself. Cloaking of the domes is a separate function held stable by Lyran giants.'
    }
  ],
  9: [
    {
      text: 'It was a recovery sanctuary designed for recalibrating a soul\'s resonance before inversion turned it into a prison of shadows.',
      rationale:
        'The Dome of Sheol was originally a recovery sanctuary for recalibrating resonance. Parasitic inversion later turned it into a prison of shadows.'
    },
    {
      text: 'It was the central command hub for the Resonating Army\'s first strike against the Greys inside the Great Dome.',
      rationale:
        'The Dome of Sheol belongs to the seven outer domes of the crystalline architecture. It was a recovery sanctuary, not a military command post.'
    },
    {
      text: 'It was a waste-disposal chamber that burned the emotional density extracted from human sols in the Water Domes.',
      rationale:
        'Density extraction happens in Water Domes through liquid sound. The Dome of Sheol was a recalibration sanctuary, later inverted into a prison of shadows.'
    },
    {
      text: 'It was the primary storage vault for monotomic gold used to feed the sun\'s transit band and the Saturn grid.',
      rationale:
        'Memory storage belongs to the Dome of Forgotten Gods, the origin chamber and memory vault. The Dome of Sheol was a recovery sanctuary.'
    }
  ],
  10: [
    {
      text: 'The Greys, under Custodian orders, ripped out the Spirit Tree, the central axis of consciousness in Hyperborea.',
      rationale:
        'The Spirit Tree stood as the central axis of consciousness in Hyperborea and fed the seven domes with pure light. The Greys ripped it out under Custodian orders, letting parasites insert a frequency-siphoning valve connected to the Saturn grid.'
    },
    {
      text: 'A massive earthquake shattered the original crystalline band and let the Vatican seize the sun\'s transit portal.',
      rationale:
        'The disruption was the removal of the Spirit Tree by the Greys under Custodian orders, not an earthquake that handed the transit band to the Vatican.'
    },
    {
      text: 'The Council of 12 Suns abandoned the Known Lands and left the parasitic overlay to run the seven outer domes.',
      rationale:
        'Saferons are sent from the Council of 12 Suns to stabilize souls. The Council did not abandon the realm; the Greys and Custodians ripped out the Spirit Tree.'
    },
    {
      text: 'Human sols failed to hold their own vibrations during the first solar transition and collapsed the dome flow themselves.',
      rationale:
        'The hijack was an external intervention. Greys acting under Custodian orders removed the Spirit Tree so a Saturn-grid siphon could be installed.'
    }
  ],
  11: [
    {
      text: 'It permanently starves parasitic systems of loosh by mending the heart, mind, and soul of human sols.',
      rationale:
        'By systematically mending heart, mind, and soul, the healing path permanently starves parasitic systems of the negative emotional energy, or loosh, they need to maintain their artificial overlays.'
    },
    {
      text: 'It redirects harvested loosh back into the Vatican archives so the amnesia vortex overloads and burns out.',
      rationale:
        'The path does not weaponize loosh. It removes the grief, fear, and confusion that produce that energy, starving the harvest at the source.'
    },
    {
      text: 'It lets human sols harvest their own loosh as fuel for personal ascent through the Star Pods.',
      rationale:
        'Loosh is negative emotional energy parasites require. Healing extracts that density; human sols do not run on loosh to enter Star Pods.'
    },
    {
      text: 'It converts leftover loosh into high-frequency crystal energy the Resonating Army uses to power homecoming.',
      rationale:
        'The process stops loosh production entirely. The Resonating Army travels the homecoming path by already being awakened, not by converting harvested suffering.'
    }
  ],
  12: [
    {
      text: 'It stimulates decalcification of the pineal gland, helping sols break Vatican tracking and recycling systems.',
      rationale:
        'Reweaving soul fragments and pineal decalcification — stimulated by restored atmospheric elements like monotomic gold — breaks the Vatican\'s artificial tracking and recycling systems so sols can bypass custom filters.'
    },
    {
      text: 'It functions as a physical currency that human sols spend to buy passage into higher multi-dimensional realms.',
      rationale:
        'Transition is a sovereign frequency choice after stabilization, not a commercial purchase. Monotomic gold is a restored atmospheric element that helps decalcify the pineal gland.'
    },
    {
      text: 'It is a Grey tracking metal that must be stripped from the light body before a soul can enter the Crystal Halls.',
      rationale:
        'Monotomic gold is a beneficial restored atmospheric element. It assists pineal decalcification; it is not a parasitic tracker to be removed.'
    },
    {
      text: 'It is painted onto Crystal Hall walls so the sanctuary frequency stays stable and remains cloaked from parasites.',
      rationale:
        'Cloaking and stability come from Lyran giants and natural crystalline amplifiers. Monotomic gold works in the atmosphere on the pineal gland.'
    }
  ],
  13: [
    {
      text: 'They dissolve, because they are background programs rather than true human sparks moved into the sanctuaries.',
      rationale:
        'No true human sol is abandoned. Human sols who are not yet fully resonating are transitioned into sanctuaries rather than being left to dissolve like NPC background programs.'
    },
    {
      text: 'They are upgraded into human sols through the frequency work performed on crystal slabs in the Crystal Halls.',
      rationale:
        'Crystal Halls realign the light body grid of human sols. NPC background programs dissolve; they are not upgraded into true human sparks.'
    },
    {
      text: 'They are stored in the Dome of Forgotten Gods as historical records of the collapsed 3D matrix.',
      rationale:
        'The Dome of Forgotten Gods is the origin chamber and memory storage vault. NPC background programs dissolve; only true human sols receive sanctuary care.'
    },
    {
      text: 'They become the new ground healers, because their lack of trauma makes them ideal stabilizers for confused souls.',
      rationale:
        'Ground healers, or Saferons, are holographic light beings sent from the Council of 12 Suns. They are not repurposed NPC programs.'
    }
  ],
  14: [
    {
      text: 'The Dome of Forgotten Gods, the origin chamber and memory storage unit vault among the seven outer domes.',
      rationale:
        'The seven outer domes include the Dome of Forgotten Gods, which is the origin chamber and memory storage unit vault, and it is connected to the healing sanctuaries.'
    },
    {
      text: 'The Crystal Hall of Records, a standalone mental-realignment vault built only to store recovered 3D memories.',
      rationale:
        'Crystal Halls mend the mind and realign the light body grid. The origin chamber and memory storage vault is the Dome of Forgotten Gods.'
    },
    {
      text: 'The Vatican Archive, treated as the original sovereign memory vault of the crystalline architecture itself.',
      rationale:
        'The Vatican holds a parasitic copy of Akashic fragments used to enforce reincarnation loops. The original vault is the Dome of Forgotten Gods.'
    },
    {
      text: 'The Star Pod Nexus, an etheric hub that stores origin memory while cocoons reweave fractured timelines.',
      rationale:
        'Star Pods reweave soul fragments and timeline trauma. Origin-chamber memory storage belongs to the Dome of Forgotten Gods.'
    }
  ],
  15: [
    {
      text: 'They may ascend to higher multi-dimensional realms or return to a fresh, unpolluted crystalline incarnation cycle.',
      rationale:
        'Once vibrations stabilize in the transition halls, human sols are restored as infinite creators. They may ascend to higher multi-dimensional realms or return to a fresh, unpolluted, fully crystalline incarnation cycle in the restored Known Lands, free of parasitic intervention.'
    },
    {
      text: 'They must join the Resonating Army and help liberate remaining sectors of the Great Dome before they may rest.',
      rationale:
        'Assisting others is a strategic option for the Resonating Army after homecoming. Human sols are granted a sovereign choice, not a mandated enlistment.'
    },
    {
      text: 'They must dissolve their individual consciousness into Source so parasites can never capture them again.',
      rationale:
        'Restoration returns sols to status as infinite creators. The choice is ascent or a fresh crystalline incarnation, not dissolution of the individual.'
    },
    {
      text: 'They are required to remain inside Star Pods until the Spirit Tree has fully regrown throughout Hyperborea.',
      rationale:
        'Star Pods are the soul-and-timeline stage of healing, not a permanent holding cell. After stabilization, sols choose their next evolutionary cycle.'
    }
  ],
  16: [
    {
      text: 'By using their massive biological electromagnetic fields and knowledge of natural crystalline amplifiers.',
      rationale:
        'Lyran giants possess massive biological electromagnetic fields. They use their knowledge of natural crystalline amplifiers to keep the cloaking fields of the healing-sanctuary domes stable.'
    },
    {
      text: 'By singing harmonic codes that lock to the liquid sound circulating inside the Water Domes.',
      rationale:
        'Liquid sound belongs to the Water Domes. Giants stabilize cloaking fields through biological electromagnetic fields and crystalline amplifiers.'
    },
    {
      text: 'By manually tuning scalar-wave frequencies from control rooms hidden beneath the sanctuary mountains.',
      rationale:
        'Giants work through biological electromagnetic fields and crystalline amplifiers. Scalar frequency weapons are what parasites run through distorted 3D oceans.'
    },
    {
      text: 'By standing guard over Spirit Tree roots so light keeps feeding the sub-crystalline band without interruption.',
      rationale:
        'Spirit Tree roots are lighting up again as the Resonating Army fractures the overlay. The giants\' described task is keeping the cloaking fields of the domes stable.'
    }
  ],
  17: [
    {
      text: 'It extracts dense emotional patterns such as grief, fear, heartbreak, and guilt, then replaces them with Source memory codes.',
      rationale:
        'As a recovering soul floats in the pools, liquid sound extracts grief, fear, heartbreak, and guilt and replaces that density with a harmonic resonance encoded with the memory codes of Source. Souls emerge lighter, smiling, and singing.'
    },
    {
      text: 'It dissolves the physical body entirely so that only the light body remains for the Crystal Halls stage.',
      rationale:
        'Water Domes mend the heart through liquid sound. They do not dissolve the physical body as a required step before mental realignment.'
    },
    {
      text: 'It functions as a communication channel that lets human sols speak with solar parents waiting in the Star Pods.',
      rationale:
        'Liquid sound is a restorative frequency that extracts emotional density and restores Source memory codes. Solar parents guide the later Star Pod stage.'
    },
    {
      text: 'It numbs the soul\'s capacity to feel pain so Crystal Hall realignment can proceed without any remaining trauma.',
      rationale:
        'The exchange is extraction and replacement, not numbing. Density leaves and harmonic Source memory codes take its place.'
    }
  ],
  18: [
    {
      text: 'It targets the emotional, mental, and spiritual layers of the soul through three specialized sanctuary environments.',
      rationale:
        'The path is a structured, multi-dimensional restorative sequence. Three mechanical stages — Water Domes, Crystal Halls, and Star Pods — provide emotional, mental, and spiritual calibration, each targeting a specific layer of trauma.'
    },
    {
      text: 'It uses future technology sent backward in time into the present-day Known Lands to override the overlay.',
      rationale:
        'The path runs through ancient crystalline architecture, living crystal, and natural resonance — not time-travel hardware imported from the future.'
    },
    {
      text: 'The human sol is physically split into several pieces that are healed at once in distant parts of the universe.',
      rationale:
        'The path repairs, realigns, and reunites fragmented human sols. It does not split them further across the universe for simultaneous treatment.'
    },
    {
      text: 'The soul must travel through twelve separate dimensions before it can stand before the Council of 12 Suns.',
      rationale:
        'Saferons are sent from the Council of 12 Suns, but the sequence itself is the three sanctuary stages that mend heart, mind, and soul — not a twelve-dimension itinerary.'
    }
  ],
  19: [
    {
      text: 'It restores the soul\'s natural ability to astral travel during sleep and to manifest reality through pure consciousness.',
      rationale:
        'Working on the light body grid and the soul\'s harmonic coding restores the natural ability to astral travel during sleep states and to manifest reality through pure consciousness, unlocking memory streams intercepted under the Vatican\'s amnesia loop.'
    },
    {
      text: 'It enables the soul to physically materialize solid 3D objects that can be handed to people still trapped in the overlay.',
      rationale:
        'Restoration returns astral travel in sleep and manifestation through pure consciousness. It is not a protocol for fabricating solid 3D objects as aid packages.'
    },
    {
      text: 'It forces the soul to remain inside the sanctuary domes until the sun\'s transit band has been fully cleared.',
      rationale:
        'Restored abilities mean more sovereign movement, not confinement. After stabilization, sols choose ascent or a fresh crystalline incarnation.'
    },
    {
      text: 'It lets the sol spy on remaining parasitic forces from the sleep state without any risk of detection.',
      rationale:
        'The restored sleep-state gift is astral travel and conscious manifestation, plus unlocked memory streams — not an espionage assignment.'
    }
  ],
  20: [
    {
      text: 'They focus light into the soul\'s energy field to dissolve mental overlays, mind control damage, and parasitic programming.',
      rationale:
        'In Crystal Halls, light is focused through crystal prisms into the soul\'s energy field, dissolving mental overlays, mind control damage, and parasitic programming and clearing the parasitic whispers of old 3D code.'
    },
    {
      text: 'They absorb leftover emotional energy from the Water Domes so that density cannot leak back into the halls.',
      rationale:
        'Emotional density is extracted in Water Domes. Crystal prisms in the halls focus light to dissolve mental overlays, not to store leftover emotion.'
    },
    {
      text: 'They act as navigational beacons that guide recovering sols from the Water Domes onward into the Star Pods.',
      rationale:
        'The mechanical function of the prisms is focused light that dissolves mental overlays and parasitic programming, not waypoint navigation between stages.'
    },
    {
      text: 'They create a mirror that shows the soul every past mistake so traditional karmic clearing can finally complete.',
      rationale:
        'The halls dissolve mental overlays and return pure memory streams. Karmic wounds across timelines are rewoven in Star Pods, not replayed as a guilt mirror.'
    }
  ],
  21: [
    {
      text: 'The entire restored realm becomes one massive, unified healing environment — a planet-wide med bed.',
      rationale:
        'As Resonating Army signals fracture the overlay, Spirit Tree roots light up, the sub-crystalline band re-energizes, and surface nodes activate. The restored Known Lands become one massive, unified healing environment — a single planet-wide med bed.'
    },
    {
      text: 'The Known Lands are abandoned because every soul chooses ascent into higher multi-dimensional realms.',
      rationale:
        'One sovereign option is a fresh crystalline incarnation cycle inside the restored Known Lands. The realm is restored as a healing environment, not emptied.'
    },
    {
      text: 'The Known Lands stay in chaos until machinery can physically dismantle every node of the Saturn grid.',
      rationale:
        'The overlay fractures through high-frequency signals and the Spirit Tree lighting up again, not through mechanical demolition of the Saturn grid.'
    },
    {
      text: 'The realm is carved into seven governed sectors, each assigned to one of the Council of 12 Suns.',
      rationale:
        'The restored realm becomes unified — one planet-wide healing environment — rather than a divided set of separately governed sectors.'
    }
  ],
  22: [
    {
      text: 'By applying precise vibrational and frequency powers that instill an overwhelming sense of safety and homecoming.',
      rationale:
        'Saferons never use force or commands. They apply precise vibrational and frequency powers to instill an immediate, overwhelming sense of absolute safety and homecoming, removing all residual panic from the transition.'
    },
    {
      text: 'By explaining the complex history of the Great Dome in logical detail until the mind finally calms down.',
      rationale:
        'The method is vibrational and frequency-based. Saferons do not talk a soul out of panic with a historical briefing.'
    },
    {
      text: 'By broadcasting memory-erasing frequencies that delete the trauma of the transition itself.',
      rationale:
        'Saferons foster safety and trust. The path returns pure memory streams; it does not erase the transition or the soul\'s history.'
    },
    {
      text: 'By issuing clear commands and orders that give the confused soul structure, ranks, and a next assignment.',
      rationale:
        'Saferons never use force or commands. They shift luminous outlines to mirror star family and apply frequency to create safety.'
    }
  ],
  23: [
    {
      text: 'False',
      rationale:
        'Human sols require specialized care after lifetimes of inversion and fragmentation. Those not yet fully resonating are gently transitioned into the sanctuaries as the parasitic overlay collapses. Returning to the matrix is not offered; the overlay itself is fracturing.'
    },
    {
      text: 'True',
      rationale:
        'The healing path is the structured restorative sequence designed specifically for human sols. It is not an optional side trip for whoever feels like it, and the collapsing overlay is not a matrix they can simply re-enter.'
    }
  ],
  24: [
    {
      text: 'They have the strategic option to return to the sanctuaries and accelerate healing for the souls they came to rescue.',
      rationale:
        'Members of the Resonating Army, once they have completed their homecoming path, have the strategic option to return to these sanctuaries to assist, supervise, and accelerate the healing of the souls they originally came to rescue, cementing a collective homecoming.'
    },
    {
      text: 'They merge into a single collective consciousness that no longer requires individual identities or personal choice.',
      rationale:
        'The path restores sovereign choice and collaborative reunion. It does not dissolve the Resonating Army into a hive mind without identities.'
    },
    {
      text: 'They must leave the Great Dome forever so their high frequencies cannot overwhelm recovering human sols.',
      rationale:
        'Their high-frequency signals are what fracture the overlay. After homecoming they may return to assist in the sanctuaries; they are not banished.'
    },
    {
      text: 'They become the new Custodians of the Saturn grid so that siphon can never be used for parasitic harvest again.',
      rationale:
        'The Saturn grid was a frequency-siphoning valve inserted after the Spirit Tree was ripped out. The aim is restoration of the Spirit Tree flow, not a new army of Custodians running that siphon.'
    }
  ],
  25: [
    {
      text: 'To enforce continuous reincarnation loops by tracking and recycling human sols through copied Akashic fragments.',
      rationale:
        'After the Spirit Tree was ripped out, parasites looped human sols through an artificial amnesia vortex at the sun\'s transit band and copied their Akashic fragments under the Vatican to enforce continuous reincarnation loops.'
    },
    {
      text: 'To keep a benevolent backup of each soul so it could be restored if the physical body died too early.',
      rationale:
        'The Vatican copy was a control archive for reincarnation loops and loosh harvest, not a health backup for premature physical death.'
    },
    {
      text: 'To preserve human history in case the Spirit Tree was ever destroyed and the seven domes lost their light.',
      rationale:
        'The Greys ripped out the Spirit Tree so the siphon and Vatican copy could be installed. The archive enforced reincarnation loops; it did not preserve history for restoration.'
    },
    {
      text: 'To supply the Council of 12 Suns with data on how effectively the amnesia loop was performing.',
      rationale:
        'The Vatican copy served the parasitic construct under Greys and Custodians. The Council of 12 Suns sends Saferons to stabilize recovering sols, not to audit the loop.'
    }
  ]
};

const questionsMeta = [
  {
    number: 1,
    question:
      'What distinguishes the healing path from the homecoming path within the restorative sequence?',
    hint: 'Consider which group requires specialized care to reverse fragmentation versus those who are already fully awakened.'
  },
  {
    number: 2,
    question:
      'How are the healing sanctuaries described in terms of their composition and structure?',
    hint: 'Think about the energetic components that replace physical bricks and mortar in these restorative spaces.'
  },
  {
    number: 3,
    question:
      'What is the primary function of the Water Domes during the emotional restoration phase?',
    hint: 'Focus on the interaction between liquid sound and the emotional weight carried by the soul.'
  },
  {
    number: 4,
    question:
      'How do Crystal Halls appear to those perceiving reality through a limited 3D lens?',
    hint: 'Consider common 3D structures that might actually be concealing high-frequency crystal architecture.'
  },
  {
    number: 5,
    question: "What specific role do the Saferons play in the healing sanctuaries?",
    hint: 'Look for how these beings establish trust with souls coming out of the amnesia loop.'
  },
  {
    number: 6,
    question: 'What occurs within the floating cocoons known as Star Pods?',
    hint: 'Think about the repair of damage that spans more than just a single lifetime.'
  },
  {
    number: 7,
    question:
      'Which ancient lineage do the giants who supervise the healing sanctuaries belong to?',
    hint: "The answer relates to the specific star system associated with the giants' electromagnetic power."
  },
  {
    number: 8,
    question: "What is the illusion of solidity?",
    hint: 'Think about how 3D matter is described in relation to the light body grid.'
  },
  {
    number: 9,
    question:
      'What was the original purpose of the Dome of Sheol before it was inverted by parasitic forces?',
    hint: 'Recall the natural flow of the seven outer domes before the Spirit Tree was removed.'
  },
  {
    number: 10,
    question:
      'What significant event allowed parasites to insert a frequency-siphoning valve and create the amnesia loop?',
    hint: "Look for the central axis whose destruction led to the hijacking of the domes."
  },
  {
    number: 11,
    question: "How does the restoration of the healing path affect loosh harvesting?",
    hint: 'Consider the relationship between healed emotions and the energy parasites feed upon.'
  },
  {
    number: 12,
    question:
      'What is the strategic role of monotomic gold in the restoration of the human soul?',
    hint: 'Think about the specific gland in the human brain that relates to perception and sovereign connection.'
  },
  {
    number: 13,
    question:
      "What happens to the NPC background programs when the parasitic overlay collapses?",
    hint: "Differentiate between entities with a spark and those that are purely part of the artificial construct."
  },
  {
    number: 14,
    question:
      'Which structure serves as the origin chamber and memory storage unit vault in the crystalline architecture?',
    hint: "The name of this dome suggests it holds what has been lost or forgotten during the amnesia loops."
  },
  {
    number: 15,
    question:
      'Upon stabilization within the transition halls, what sovereign choice is granted to human sols?',
    hint: 'Consider the two primary evolutionary options mentioned for a soul once it is no longer trapped.'
  },
  {
    number: 16,
    question:
      'How do the giants maintain the stability of the healing sanctuary domes?',
    hint: 'The answer involves the physical-energetic properties of the giants themselves.'
  },
  {
    number: 17,
    question: "What is the effect of the liquid sound found within the Water Domes?",
    hint: 'Think of it as a vibrational exchange where negative weight is traded for source memory.'
  },
  {
    number: 18,
    question:
      "Why is the healing path described as a multi-dimensional restorative sequence?",
    hint: 'Look for the different layers of the human experience that are mended by the three types of sanctuaries.'
  },
  {
    number: 19,
    question:
      "What does the restoration of the light body grid allow a human sol to do during sleep states?",
    hint: "Consider the abilities that were systematically intercepted by the Vatican's amnesia loop systems."
  },
  {
    number: 20,
    question: 'What is the function of the crystal prisms used in the Crystal Halls?',
    hint: 'Think about how focused light interacts with artificial mental structures.'
  },
  {
    number: 21,
    question:
      'What happens to the Known Lands as the Resonating Army fractures the parasitic overlay?',
    hint: 'Consider the broader transformation of the environment as the crystalline architecture reactivates.'
  },
  {
    number: 22,
    question:
      'How are the Saferons able to ensure that no residual panic remains in a soul during transition?',
    hint: 'Look for a non-verbal, energetic method used by these ground healers.'
  },
  {
    number: 23,
    question:
      'True or False: The healing path is an optional journey for human sols who feel they need it, while others can return to the matrix.',
    hint: 'Consider whether the 3D matrix still exists as a viable option after the overlay fractures.'
  },
  {
    number: 24,
    question:
      'What is the role of the Resonating Army after they have completed their own homecoming path?',
    hint: 'Think about the relationship between those who are already awake and those still recovering.'
  },
  {
    number: 25,
    question:
      'What was the purpose of the Vatican copying Akashic fragments in the old parasitic construct?',
    hint: 'Consider how the parasites used information to keep souls trapped in a cycle.'
  }
];

const QUIZ_DESC =
  'Test your understanding of the Healing Path — Water Domes, Crystal Halls, and Star Pods under Saferon ground healers; Lyran giants; Spirit Tree restoration; loosh neutralization; and the sovereign choice after sanctuary stabilization.';

const questions = [];
const letterCounts = { A: 0, B: 0, C: 0, D: 0 };

for (const meta of questionsMeta) {
  const n = meta.number;
  const set = fullOptionSets[n];
  const isTF = /^\s*true\s+or\s+false\b/i.test(meta.question);
  const tfByOptions =
    set &&
    set.length === 2 &&
    set.every((o) => /^(true|false)(\s*[—–\-:].*)?$/i.test(String(o.text || '').trim()));
  if (!set || (isTF || tfByOptions ? set.length !== 2 : set.length !== 4)) {
    throw new Error(
      `fullOptionSets[${n}] must have ${isTF || tfByOptions ? 2 : 4} options`
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
    rationale: absoluteVoice(cleanText(o.rationale))
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
    correctAnswer
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
    'Test your grasp of the Healing Path — Water Domes, Crystal Halls, and Star Pods under Saferon ground healers; Lyran giants; Spirit Tree restoration; loosh neutralization; and the sovereign choice after sanctuary stabilization.',
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'The Healing Path is the restorative sequence for fragmented human sols: Water Domes mend the heart with liquid sound, Crystal Halls realign the mind, and Star Pods reweave soul and timeline fractures under Saferons and Lyran giants. Sit with the Spirit Tree lighting again, the starving of loosh, the break of Vatican reincarnation loops, and the sovereign choice after stabilization — higher realms, or a fresh crystalline incarnation in the Known Lands. Return to the Healing Path deep-dive, infographic, and video transmissions as those sanctuaries come into view.'
  },
  relatedTopic: {
    href: `/deep-dive.html?source=${SOURCE}&topic=${TOPIC_ID}`,
    label: `Return to ${TOPIC_TITLE} deep-dive`
  },
  questions
};

const quizDir = path.join(ROOT, 'data', 'quizzes', SOURCE);
fs.mkdirSync(quizDir, { recursive: true });
const quizJsonPath = path.join(quizDir, `${TOPIC_ID}.json`);
fs.writeFileSync(quizJsonPath, JSON.stringify(quiz, null, 2) + '\n', 'utf8');

const quizMeta = {
  href: `quiz/${SOURCE}/${TOPIC_ID}.html`,
  title: TOPIC_TITLE,
  totalQuestions: 25,
  description: QUIZ_DESC
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
  throw new Error('healing-path not found in breakdown-topics.json');
}

const afterOthers = collectImageFields(mono.topics)
  .filter((e) => e.id !== TOPIC_ID)
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();
if (JSON.stringify(beforeOthers) !== JSON.stringify(afterOthers)) {
  throw new Error('Safety check failed: another topic image path was modified');
}

fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'true-sparks.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on the Healing Path: Water Domes, Crystal Halls, and Star Pods under Saferon ground healers; Lyran giants; Spirit Tree restoration; loosh neutralization; and the sovereign choice after sanctuary stabilization.';
const replacements = [
  ['True Sparks Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on True Sparks: authentic Source souls inverted in the simulation, spark ignition, the amnesia vortex and Vatican archive, Embedded Codes, Water Domes, Crystal Halls, Star Pods, and the sovereign choice after restoration.',
    desc
  ],
  ['quiz/breakdown/true-sparks.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/true-sparks.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=true-sparks',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['True Sparks deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['data/quizzes/breakdown/true-sparks.json', `data/quizzes/${SOURCE}/${TOPIC_ID}.json`]
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 90));
  }
  html = html.split(a).join(b);
}

html = html.replace(/True Sparks/g, TOPIC_TITLE);
html = html
  .replace(/true-sparks\.webp/g, 'healing-path.webp')
  .replace(/true-sparks\.json/g, 'healing-path.json')
  .replace(/true-sparks\.html/g, 'healing-path.html')
  .replace(/topic=true-sparks/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/true-sparks.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/healing-path.json'
);
