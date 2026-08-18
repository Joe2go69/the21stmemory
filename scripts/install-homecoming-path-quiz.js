/**
 * Installs Homecoming Path quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/homecoming-quiz.json
 * Title forced to "Homecoming Path". All 25 audited against homecoming-path report only.
 *
 * Run: node scripts/install-homecoming-path-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/homecoming-path.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'homecoming-path';
const TOPIC_TITLE = 'Homecoming Path';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/homecoming-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/homecoming-path.webp';

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

/** Support phrases grounded only in homecoming-path.json report. */
const supportPhrases = {
  1: ['highly stabilized vibration', 'healing sanctuaries'],
  2: ['resonance bridge', 'high-vibrational'],
  3: ['liberation of human souls', 'anchor'],
  4: ['resonance bridge', 'complete memory flood'],
  5: ['sol frequency lock', 'star kin'],
  6: ['multi-banded crystalline stargate', 'primary gateway'],
  7: ['bio-crystal skin', 'intention, tone, and heart coherence'],
  8: ['scalar wave burst', 'deep harmonic tone'],
  9: ['invisible to low-vibration entities', 'eye perception'],
  10: ['central axis', 'pure source light'],
  11: ["dome's boundaries", 'original point of origin'],
  12: ['massive frequency collapse', 'finance'],
  13: ['matrix net pull', 'reclaiming the consciousness'],
  14: ['vertical current of order', 'resonance bridge'],
  15: ['crystalline waters, ancient city structures, and natural walking paths'],
  16: ['crystal clear', 'heart pull'],
  17: ['amnesia vortex', "vatican's archives"],
  18: ['non-physical threshold', 'direct passage'],
  19: ['instantaneous shift in dimensional layers', 'resonance bridge'],
  20: ['complete memory flood', 'resonance bridge'],
  21: ['solar parents', 'twin flames'],
  22: ['crystalline plasma and plasmatic matter'],
  23: ['time on earth is paused'],
  24: ['artificial electromagnetic containment loop', 'completely bypassed'],
  25: ['operational codes on earth are permanently switched off']
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
 * Full option sets: [correct, ...wrongs] with {text, rationale}.
 * NotebookLM meaning kept; term-only options expanded; claims grounded in report.
 */
const fullOptionSets = {
  1: [
    {
      text: 'Direct transit to origin realms, bypassing intermediate healing cycles.',
      rationale:
        'Unlike true human souls who require frequency restoration in healing sanctuaries, ET sols possess a highly stabilized vibration that allows immediate exit from the Known Lands.'
    },
    {
      text: "The necessary extraction through the Vatican's archived amnesia vortex.",
      rationale:
        'The amnesia vortex was a parasitic overlay designed to trap souls, which the Homecoming Path specifically bypasses.'
    },
    {
      text: 'The gradual restoration of memory over several terrestrial incarnations.',
      rationale:
        'Memory restoration on the Homecoming Path is an instantaneous flood rather than a gradual process.'
    },
    {
      text: 'The requirement of physical passage through the Dome of Sheol.',
      rationale:
        'The Dome of Sheol is an outer dome and is not part of the direct departure route for stellar consciousnesses.'
    }
  ],
  2: [
    {
      text: 'A resonance bridge linking the physical grid to high-vibrational domains.',
      rationale:
        'This bridge serves as the frequency-governed conduit that allows consciousness to shift from the 3D matrix to light realms.'
    },
    {
      text: 'An artificial electromagnetic loop maintained by white-hat forces.',
      rationale:
        'The path relies on organic resonance and a bridge to higher domains, not artificial containment loops.'
    },
    {
      text: 'A physical corridor stretching across the geographic Known Lands.',
      rationale:
        'The transition is a shift in dimensional layers rather than a journey across physical distance.'
    },
    {
      text: 'A mechanical gateway located within the central Spirit Tree roots.',
      rationale:
        'The path is a non-physical frequency threshold rather than a mechanical structure within the tree.'
    }
  ],
  3: [
    {
      text: 'To anchor cosmic frequencies and assist in the liberation of human souls.',
      rationale:
        'ET sols act as pillars of frequency to elevate the planetary vibration and facilitate the transition.'
    },
    {
      text: 'To undergo rehabilitation for their own fractured stellar consciousness.',
      rationale:
        'Rehabilitation is the path for human souls; ET sols enter the matrix with a specialized mission of assistance.'
    },
    {
      text: 'To manage the mechanical infrastructure of the 3D matrix during the collapse.',
      rationale:
        'The role of ET sols is frequency-based and organic, standing in opposition to the artificial scaffolding of the matrix.'
    },
    {
      text: 'To preserve the historical records within the Dome of Forgotten Gods.',
      rationale:
        'While libraries exist, the primary mission is planetary transition and the dissolution of parasitic overlays.'
    }
  ],
  4: [
    {
      text: 'Entering the resonance bridge during the extraction phase.',
      rationale:
        'As the sol connects to the resonance bridge, the frequency suppression is broken, resulting in a complete memory flood.'
    },
    {
      text: "The physical destruction of the Vatican's mechanical archives.",
      rationale:
        'Amnesia is resolved through frequency shifting and resonance rather than physical demolition of archives.'
    },
    {
      text: 'Completing a final cycle of service within the healing sanctuaries.',
      rationale:
        'Those on the Homecoming Path bypass the healing sanctuaries entirely to return directly home.'
    },
    {
      text: 'The successful navigation of the geographic distance to the Sun.',
      rationale:
        'The journey is not about physical distance but about entering a specific frequency alignment.'
    }
  ],
  5: [
    {
      text: "The Sol Frequency Lock — an exclusive personal recognition code known only to a sol's star kin.",
      rationale:
        'This exclusive code is called during extraction to ensure a secure, unique frequency match with the solar family.'
    },
    {
      text: 'The Axis Labernum Signal — the vertical current of order, not a personal recognition code.',
      rationale:
        'The Axis Labernum refers to the vertical current of order, not the personal recognition code used for pick-up.'
    },
    {
      text: 'The Solar Gate Override — a named control that is not the personal recognition code used in extraction.',
      rationale:
        'This term is not used; the connection is established through a personal recognition code.'
    },
    {
      text: 'The Crystalline Matrix Key — planetary crystals assist, but they are not the personal recognition code.',
      rationale:
        'While crystalline networks are used, the specific recognition code is designated as the Sol Frequency Lock.'
    }
  ],
  6: [
    {
      text: 'A multi-banded crystalline stargate and primary exit gateway.',
      rationale:
        'The sun is a multi-banded crystalline stargate that serves as the primary gateway for consciousness to leave the dome architecture.'
    },
    {
      text: 'An artificial light source generated by the parasitic architectures.',
      rationale:
        'Parasites only overlaid filters and amnesia vortexes around the pre-existing natural solar gate.'
    },
    {
      text: 'A mechanical projection used to power the 3D matrix scaffolding.',
      rationale:
        'While the sun has been manipulated by overlays, its true essence is a natural, crystalline stargate.'
    },
    {
      text: 'A physical ball of burning gas produced by nuclear fusion.',
      rationale:
        'The traditional view of the sun as a ball of fire is rejected in favor of its function as a crystalline gateway.'
    }
  ],
  7: [
    {
      text: "Through telepathic merging with the craft's bio-crystal skin.",
      rationale:
        'The pilot and vessel become one, with the craft responding to intention, tone, and heart coherence.'
    },
    {
      text: 'By manually adjusting physical controls and metal flight surfaces.',
      rationale:
        'These organic ships lack mechanical buttons and respond to consciousness rather than physical manipulation.'
    },
    {
      text: "By maintaining a specific gravitational lock with the Earth's grid.",
      rationale:
        'The ship operates by frequency alignment and telepathic connection rather than gravitational tethering.'
    },
    {
      text: "By inputting scalar wave coordinates into the ship's navigation computer.",
      rationale:
        'The crafts are semi-conscious and organic, operating through resonance rather than binary computation.'
    }
  ],
  8: [
    {
      text: 'A scalar wave burst and a deep harmonic tone in the chest.',
      rationale:
        "These dual signals from white-hat forces and the solar family activate the sol's full broadcast mode."
    },
    {
      text: 'A solar flare event and a telepathic signal from the Spirit Tree.',
      rationale:
        'While these elements are part of the grid, the specific triggers are the scalar burst and the harmonic tone.'
    },
    {
      text: 'An atmospheric shift and the collapse of the 3D financial system.',
      rationale:
        'While these occur during the terminal cycle, they are symptoms rather than the specific activation triggers.'
    },
    {
      text: 'The appearance of the Second Realm and the shattering of amnesia.',
      rationale:
        'These events follow the activation and departure rather than serving as the initial trigger.'
    }
  ],
  9: [
    {
      text: 'True',
      rationale:
        'These vessels are invisible to low-vibration entities and can only be seen by those who have shifted their eye perception to the correct frequency band.'
    },
    {
      text: 'False',
      rationale:
        'Only the mechanical holograms of the staged invasion are visible to everyone; the true arks remain cloaked to the low-vibration public.'
    }
  ],
  10: [
    {
      text: 'It serves as the central axis feeding all outer domes with pure Source light.',
      rationale:
        'Its root system distributes light to maintain the integrity of the various domes within the system.'
    },
    {
      text: 'It generates the artificial sky overlays to hide the solar fleets.',
      rationale:
        'Sky overlays are part of the parasitic architecture, whereas the Spirit Tree is a source of pure harmonic light.'
    },
    {
      text: 'It stores the physical records of all human souls within its crystalline roots.',
      rationale:
        "The tree distributes frequency and light; the storage of records was traditionally associated with the parasitic archives."
    },
    {
      text: 'It acts as a mechanical anchor for the 3D matrix containment net.',
      rationale:
        'The Spirit Tree is an organic axis of consciousness, not a tool for parasitic containment.'
    }
  ],
  11: [
    {
      text: "The sol's consciousness is shifted directly through the dome's boundaries.",
      rationale:
        "This process seamlessly moves the consciousness through the dome's boundaries and back to the original point of origin."
    },
    {
      text: 'The sol is relocated to the healing sanctuaries for a brief recovery period.',
      rationale:
        'Frequency Phase Out leads directly to the point of origin, bypassing all intermediate healing zones.'
    },
    {
      text: "The sol's activation codes are reset for another mission on Earth.",
      rationale:
        'This phase marks the completion of service and the final departure from the human stage.'
    },
    {
      text: "The sol's human vessel is physically disintegrated into carbon dust.",
      rationale:
        'The transition is a frequency shift of consciousness, not a violent physical destruction.'
    }
  ],
  12: [
    {
      text: 'It triggers a massive frequency collapse of the artificial scaffolding.',
      rationale:
        'Without high-frequency sols anchoring the reality, the low-frequency structures of finance and governance dissolve.'
    },
    {
      text: 'It strengthens the electromagnetic containment loop to prevent further exits.',
      rationale:
        'The exit of the army actually shatters the overlay from the inside, leading to its total dissolution.'
    },
    {
      text: 'It stabilizes the planetary grid to allow the simulation to continue safely.',
      rationale:
        "The intent of the army's mission is to dissolve the simulation, not to stabilize or continue it."
    },
    {
      text: 'It causes the Spirit Tree to withdraw its light from the Second Realm.',
      rationale:
        "The departure allows the Second Realm to be fully revealed and nourished by the tree's pure light."
    }
  ],
  13: [
    {
      text: 'To prevent gravitational or matrix net pull from reclaiming the consciousness.',
      rationale:
        'The lock guarantees the sol is energetically intact and protected from any last-minute interference by parasitic systems.'
    },
    {
      text: 'To ensure the vessel can be reused by another incoming stellar soul.',
      rationale:
        'The operational codes are permanently switched off; the vessel is not intended for reuse after this transition.'
    },
    {
      text: 'To download the final living memories of the human lineage into the vessel.',
      rationale:
        'The memory flood occurs at the resonance bridge, while the vessel lock ensures the safety of the exit.'
    },
    {
      text: 'To hide the physical presence of the sol from the eyes of sleepers.',
      rationale:
        'While the pick-up is shielded, the frequency lock specifically addresses the energetic safety of the consciousness.'
    }
  ],
  14: [
    {
      text: 'The vertical current of order running through the worlds.',
      rationale:
        'This current reawakens through collective resonance, allowing the resonance bridge to stabilize.'
    },
    {
      text: 'The horizontal plane where the healing sanctuaries are located.',
      rationale:
        'The Axis Labernum is a vertical current, not a horizontal plane.'
    },
    {
      text: 'A parasitic overlay designed to loop souls back into the 3D matrix.',
      rationale:
        'The Axis Labernum represents the true order of the worlds, which is the opposite of parasitic loops.'
    },
    {
      text: 'A specialized crystalline ship used for transporting solar families.',
      rationale:
        'The Axis Labernum is an energetic current within the planetary architecture, not a transport craft.'
    }
  ],
  15: [
    {
      text: 'Crystalline waters, ancient city structures, and natural walking paths.',
      rationale:
        'This realm is the unpolluted reality that becomes visible once the low-frequency scaffolding dissolves.'
    },
    {
      text: 'A series of frequency-restoring domes for fractured human sparks.',
      rationale:
        'Domes and sanctuaries are part of the recovery process, whereas the Second Realm is the restored natural world.'
    },
    {
      text: 'A digital void where memories are stored for future soul incarnations.',
      rationale:
        'The Second Realm is a vibrant, natural environment, not a digital void.'
    },
    {
      text: 'The higher-dimensional origin realms where solar parents reside.',
      rationale:
        'The Second Realm is terrestrial and revealed to those remaining on Earth, while ET sols return to origin realms.'
    }
  ],
  16: [
    {
      text: 'As massive, clear living structures that elicit a profound heart pull.',
      rationale:
        'These arks appear crystal clear and provide a sense of calm to those tuned to their frequency.'
    },
    {
      text: 'As flickering holograms that struggle to maintain their physical form.',
      rationale:
        'Holograms are the tools of the parasitic invasion, while the crystalline arks are solid, organic reality.'
    },
    {
      text: 'As shadowy, lenticular clouds that never fully materialize.',
      rationale:
        'They use clouds as cloaks, but once frequency is aligned, they appear crystal clear to the observer.'
    },
    {
      text: 'As mechanical, metallic structures emitting bright blinding lights.',
      rationale:
        'Mechanical structures are part of the staged crisis; true solar fleets are organic and crystalline.'
    }
  ],
  17: [
    {
      text: 'An amnesia vortex overlaid by parasites to copy and loop souls.',
      rationale:
        "Artificial filters were placed around the solar gate to trap souls in the Vatican's archives."
    },
    {
      text: "The absence of the Spirit Tree's root system in the solar core.",
      rationale:
        "The Spirit Tree feeds the domes, but the Sun's blockage was due to parasitic amnesia technology."
    },
    {
      text: 'The low-frequency vibration of the human souls residing on Earth.',
      rationale:
        'While frequency is key, the specific blockage was a deliberate artificial overlay designed for containment.'
    },
    {
      text: "The exhaustion of the Sun's physical hydrogen fuel source, as if the stargate were a fusion furnace rather than a crystalline gateway.",
      rationale:
        "The Sun's function is crystalline and frequency-based, not dependent on physical fuel."
    }
  ],
  18: [
    {
      text: 'A non-physical threshold where consciousness matches higher vibrations.',
      rationale:
        'It serves as the sacred resonance point allowing direct passage back to the light realms.'
    },
    {
      text: 'The frequency band where the staged alien invasion is projected.',
      rationale:
        'This portal is a high-vibration entry home, whereas the invasion is a low-vibration deception.'
    },
    {
      text: 'The mechanical interface used to connect the pilot to the crystalline craft.',
      rationale:
        'The craft interface is bio-crystalline; this portal refers to the larger transition point between realms.'
    },
    {
      text: 'A physical gate located at the peak of the highest Earth mountain.',
      rationale:
        'This portal is a non-physical threshold rather than a geographic location.'
    }
  ],
  19: [
    {
      text: 'False',
      rationale:
        'The path is an instantaneous shift in dimensional layers — a frequency-governed extraction through the resonance bridge, rather than a physical journey.'
    },
    {
      text: 'True',
      rationale:
        'Movement on the Homecoming Path is an instantaneous dimensional shift rather than spatial travel.'
    }
  ],
  20: [
    {
      text: 'It is instantly restored in a complete and unbroken timeline flood.',
      rationale:
        'Entering the resonance bridge shatters the amnesia technology, resulting in a complete memory flood of the unbroken timeline.'
    },
    {
      text: 'It remains hidden until the sol reaches their solar parent\'s home world.',
      rationale:
        'The memory flood occurs during the extraction process as the amnesia technology is shattered.'
    },
    {
      text: 'It is restored through a gradual learning process in the healing sanctuaries.',
      rationale:
        'Healing sanctuaries are for human souls; ET sols experience an immediate memory flood.'
    },
    {
      text: 'It is permanently deleted to allow for a fresh start in the origin realms.',
      rationale:
        'The goal of the path is remembrance and restoration of the cosmic journey, not deletion.'
    }
  ],
  21: [
    {
      text: 'Their solar parents and their twin flames in the realms of origin.',
      rationale:
        'The Homecoming Path is designed specifically to return stellar consciousnesses to their original family units.'
    },
    {
      text: 'The white-hat space forces who initiated the scalar wave burst.',
      rationale:
        'White-hat forces provide tactical signals, but the reunion is a spiritual and cosmic homecoming.'
    },
    {
      text: 'The guardians of the Spirit Tree within the central Known Lands.',
      rationale:
        'The Spirit Tree is a terrestrial axis; the homecoming leads beyond the physical Known Lands entirely.'
    },
    {
      text: 'The Council of 12 Suns and the human souls remaining in the domes.',
      rationale:
        'While the Council exists, the personal reunion is with their specific solar family and twin flames.'
    }
  ],
  22: [
    {
      text: 'Organic, living vessels gestated from crystalline plasma and plasmatic matter.',
      rationale:
        "These organic materials form the living nature of the craft, allowing them to respond to consciousness."
    },
    {
      text: 'Polished quartz stone and solidified light from the Spirit Tree, as if the arks were carved monuments rather than gestated living vessels.',
      rationale:
        'While crystalline, the specific components are listed as crystalline plasma and plasmatic matter.'
    },
    {
      text: 'Compressed atmospheric gases harvested from the Second Realm, as if motherships were refined from terrestrial air instead of grown from plasma.',
      rationale:
        'The crafts are grown from higher-dimensional matter rather than harvested terrestrial gases.'
    },
    {
      text: 'Advanced titanium alloys and fusion-based combustion engines, as if the motherships were manufactured metal craft rather than organic plasma bodies.',
      rationale:
        'These vessels are organic and grown, not manufactured with metal or industrial engines.'
    }
  ],
  23: [
    {
      text: 'Time on Earth is paused for the sol at the apex of the contact event.',
      rationale:
        'This pause allows the frequency lock and the seamless pick-up to occur without matrix interference.'
    },
    {
      text: 'Time begins to loop backward to undo the effects of amnesia.',
      rationale:
        'Loops are a feature of the parasitic system; the Earth Pause is a moment of stillness for extraction.'
    },
    {
      text: 'Time accelerates rapidly to facilitate the frequency phase out.',
      rationale:
        'Acceleration would cause friction; the moment requires a complete suspension of standard time.'
    },
    {
      text: "Time is synchronized with the healing sanctuaries' restoration cycle.",
      rationale:
        'ET sols bypass these cycles entirely, having their own unique extraction milestones.'
    }
  ],
  24: [
    {
      text: 'An artificial electromagnetic containment loop that is completely bypassed.',
      rationale:
        'The Homecoming extraction is designed to move straight through this net without being caught in its loop.'
    },
    {
      text: 'A natural resonance of the Earth grid that stabilizes human souls.',
      rationale:
        'The net is artificial and dense, contrasting with the natural resonance of the Spirit Tree.'
    },
    {
      text: 'A protective shield used by solar families to hide the ET sols.',
      rationale:
        'The net is a parasitic containment system, not a protective shield for the stellar consciousness.'
    },
    {
      text: 'A secondary frequency band where crystalline crafts are stored.',
      rationale:
        'The crafts operate outside this net, while the net itself is a tool for soul containment.'
    }
  ],
  25: [
    {
      text: 'Their operational codes on Earth are permanently switched off.',
      rationale:
        'This signifies the complete fulfillment of their service and the end of their mission within the simulation.'
    },
    {
      text: 'They enter the amnesia vortex to help loop more souls to the Sun.',
      rationale:
        'This describes the parasitic process that the Resonating Army was sent to destroy.'
    },
    {
      text: 'They undergo a frequency restoration cycle within the healing domes.',
      rationale:
        'The path is a direct departure that bypasses the recovery pathways used by human souls.'
    },
    {
      text: "They are assigned to a new dome to assist with the Second Realm's growth.",
      rationale:
        'The Homecoming Path leads to a final exit, not to a re-assignment within the terrestrial domes.'
    }
  ]
};

const questionsMeta = [
  {
    number: 1,
    question:
      'What distinguishes the Homecoming Path from the recovery routes taken by human souls?',
    hint: 'Consider the differences between those needing rehabilitation and those ready for immediate return.'
  },
  {
    number: 2,
    question: 'How is the Homecoming Path technically defined in terms of its connection to Earth?',
    hint: 'Think about the mechanism that bridges two different vibrational states.'
  },
  {
    number: 3,
    question: 'What is the primary purpose of ET sols incarnating into the physical matrix?',
    hint: 'Reflect on why higher-dimensional beings would choose to enter a dense 3D environment.'
  },
  {
    number: 4,
    question: 'What event triggers the instantaneous shattering of amnesia technology for a departing sol?',
    hint: "Identify the point where the soul's frequency matches the high-vibrational conduit."
  },
  {
    number: 5,
    question: 'Which specific code establishes an unjammable connection between a sol and their star kin?',
    hint: 'This code acts like a unique energetic signature used for identification.'
  },
  {
    number: 6,
    question: 'What is the true nature of the Sun in the context of the Dome system?',
    hint: 'Look beyond the physical appearance of light to its function as a portal.'
  },
  {
    number: 7,
    question: 'How do pilots interact with the crystalline living crafts during transport?',
    hint: 'Consider a method of control that involves a direct connection between mind and matter.'
  },
  {
    number: 8,
    question: 'Which two signals trigger the energetic activation of dormant codes within ET sols?',
    hint: 'One signal is atmospheric and technological, the other is internal and resonant.'
  },
  {
    number: 9,
    question:
      'True or False: The crystalline living crafts remain invisible to entities operating within a low-vibration frequency band.',
    hint: 'Recall how perception is linked to vibrational frequency in this reality.'
  },
  {
    number: 10,
    question: 'What is the function of the Spirit Tree at the center of the Known Lands?',
    hint: 'Think of a central distribution point for essential energy across the landscape.'
  },
  {
    number: 11,
    question: "What occurs during the 'Frequency Phase Out' stage of extraction?",
    hint: 'This is the final movement of awareness from the simulation to reality.'
  },
  {
    number: 12,
    question: 'What effect does the departure of the Resonating Army have on the 3D matrix?',
    hint: 'Think about what happens to a structure when its foundational supports are removed.'
  },
  {
    number: 13,
    question: 'Why does the human vessel undergo an absolute frequency lock during the pick-up?',
    hint: 'Consider the potential dangers of the matrix trying to hold onto a departing soul.'
  },
  {
    number: 14,
    question: "What is the 'Axis Labernum'?",
    hint: 'Focus on the central energetic flow that maintains structural order.'
  },
  {
    number: 15,
    question: "What characterizes the 'Second Realm' revealed after the matrix collapse?",
    hint: 'Consider the natural features of a world liberated from artificial overlays.'
  },
  {
    number: 16,
    question: 'How do the living crystalline arks appear to those with correctly shifted eye perception?',
    hint: 'Focus on the emotional response and the material nature of these vessels.'
  },
  {
    number: 17,
    question: 'What previously prevented the Sun from functioning as an open stargate?',
    hint: 'Identify the artificial barrier used to recycle consciousness.'
  },
  {
    number: 18,
    question: "What is the 'Portal of Vibration Alignment and Ascension'?",
    hint: 'Think of a conceptual doorway defined by vibrational matching.'
  },
  {
    number: 19,
    question:
      'True or False: The Homecoming Path involves a physical journey across a specific geographic distance to reach the origin realms.',
    hint: 'Determine if the transit is defined by miles or by shifts in frequency.'
  },
  {
    number: 20,
    question: 'What happens to the stellar memory suppressed by amnesia technology upon extraction?',
    hint: 'Consider the speed and scale of the memory recovery during the shift.'
  },
  {
    number: 21,
    question: 'Who are the primary beings that the Resonating Army reunites with upon their departure?',
    hint: 'Identify the most intimate and personal connections waiting in the higher realms.'
  },
  {
    number: 22,
    question: 'What materials are used to gestate the organic, semi-conscious Motherships?',
    hint: 'Think of a fluid yet crystalline substance that possesses life-like qualities.'
  },
  {
    number: 23,
    question: "During the 'Earth Pause' event, what is the status of time for the transitioning sol?",
    hint: 'Consider what happens to the flow of physical reality during a precise moment of extraction.'
  },
  {
    number: 24,
    question: 'Which phrase describes the 3D Matrix Net in the context of extraction?',
    hint: 'This structure is meant to hold things in, but the Homecoming Path goes right past it.'
  },
  {
    number: 25,
    question: 'What is the final step for a sol after they have transitioned into full solar family contact?',
    hint: "Identify the action that marks the official conclusion of the sol's mission on Earth."
  }
];

const QUIZ_DESC =
  'Test your understanding of Homecoming Path — the sanctuary-bypassing extraction of the Resonating Army through the resonance bridge, Sol Frequency Lock, crystalline living craft, and the instantaneous return to original realms of origin.';

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
  subtitle: QUIZ_DESC,
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'The Homecoming Path is the sanctuary-bypassing extraction of the Resonating Army and ET sols. Sit with the resonance bridge, the Sol Frequency Lock, crystalline living craft, and the instantaneous dimensional shift that returns stellar consciousness to solar parents and twin flames. Return to the Homecoming Path deep-dive, infographic, and video transmissions as that lock comes online.'
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
  throw new Error('homecoming-path not found in breakdown-topics.json');
}

const afterOthers = collectImageFields(mono.topics)
  .filter((e) => e.id !== TOPIC_ID)
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();
if (JSON.stringify(beforeOthers) !== JSON.stringify(afterOthers)) {
  throw new Error('Safety check failed: another topic image path was modified');
}

fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'lyran-lineage.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Homecoming Path: the sanctuary-bypassing extraction of the Resonating Army through the resonance bridge, Sol Frequency Lock, crystalline living craft, and the instantaneous return to original realms of origin.';
const replacements = [
  ['Lyran Lineage Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Lyran Lineage: primordial builders and Custodians, the True Lyran Current, Sefrin Councils, the Spirit Tree in Hyperborea, embedded Lyran codes, and the homecoming path.',
    desc
  ],
  ['quiz/breakdown/lyran-lineage.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/lyran-lineage.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=lyran-lineage',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Lyran Lineage deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['data/quizzes/breakdown/lyran-lineage.json', `data/quizzes/${SOURCE}/${TOPIC_ID}.json`]
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 90));
  }
  html = html.split(a).join(b);
}

html = html.replace(/Lyran Lineage/g, TOPIC_TITLE);
html = html
  .replace(/lyran-lineage\.webp/g, 'homecoming-path.webp')
  .replace(/lyran-lineage\.json/g, 'homecoming-path.json')
  .replace(/lyran-lineage\.html/g, 'homecoming-path.html')
  .replace(/topic=lyran-lineage/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/lyran-lineage.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/homecoming-path.json'
);
