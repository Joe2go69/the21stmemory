/**
 * Installs Mind Weapons quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/mind-control-quiz.json
 * Title forced to "Mind Weapons". All 25 audited against mind-weapons report only.
 *
 * Run: node scripts/install-mind-weapons-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/mind-weapons.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'mind-weapons';
const TOPIC_TITLE = 'Mind Weapons';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/mind-control-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/mind-weapons.webp';

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

/** Support phrases grounded only in mind-weapons.json report. */
const supportPhrases = {
  1: ['brain-wave patterns', 'loosh', 'docile'],
  2: ['theta, delta, and alpha', 'sleepiness, confusion, anger'],
  3: ['localized transmission', 'inner monologue'],
  4: ["sun's transit band", 'incoming souls', 'reincarnation'],
  5: ['first spark of life', 'light and sound grids'],
  6: ['aggressive compliance programs', 'non-player character'],
  7: ['commercial audio', 'glitched'],
  8: ['parasitic circuit boards', 'loosh collectors'],
  9: ['core frequency engineers', 'black crystalline valve locks'],
  10: ['spirit tree', 'hyperborea', 'false architecture'],
  11: ['shimmer-waves', 'nightmare'],
  12: ['2015-2016', 'monatomic gold'],
  13: ['pineal gland', 'damaged dna'],
  14: ['resonating army', 'high-frequency states'],
  15: ['akashic fragments', 'copied memory strands'],
  16: ['24/7', 'sleep'],
  17: ['black cube a.i.', 'black satellite tech'],
  18: ['standard media screens', 'visual activation'],
  19: ['emotional energy', 'loosh'],
  20: ['high-frequency priests', 'reincarnation and amnesia loops'],
  21: ['auric field', 'low-frequency signals'],
  22: ['non-physical', 'conventional physical armaments'],
  23: ['aggressive compliance programs', 'conscious souls'],
  24: ['silica crystals', 'colloidal silver'],
  25: ['astral travel', 'restrict consciousness']
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
 * NotebookLM meaning kept; short term-only options expanded; claims grounded in report.
 */
const fullOptionSets = {
  1: [
    {
      text: 'To manipulate frequencies and neurological patterns for consciousness control and loosh harvesting.',
      rationale:
        'Mind weapons specifically target brain-wave patterns to maintain a docile population and extract emotional energy.'
    },
    {
      text: 'To record the collective history of the human race for preservation in the Akashic fragments.',
      rationale:
        'The Vatican logs stolen Akashic fragments, but mind weapons are active tools of interference rather than passive recording devices.'
    },
    {
      text: 'To enhance human cognitive capacity through non-physical scalar wave technological integration.',
      rationale:
        'Mind weapons are used to degrade cognitive autonomy and block multi-dimensional access, not to enhance it.'
    },
    {
      text: 'To stabilize the physical environment and prevent the collapse of the material plane.',
      rationale:
        'The system is designed for interference and harvesting rather than the preservation of physical stability.'
    }
  ],
  2: [
    {
      text: 'Theta, delta, and alpha states, the neural baselines scalar weapons destabilize to induce sleepiness, confusion, anger, or despair.',
      rationale:
        'Destabilizing these specific neural baselines allows the technology to trigger sudden emotional shifts and disorientation.'
    },
    {
      text: 'Beta, gamma, and lambda states associated with high-level processing and waking focus rather than fatigue or despair.',
      rationale:
        'These states are associated with high-level processing and focus, which are not the primary targets for inducing fatigue or disorientation.'
    },
    {
      text: 'Epsilon, high-beta, and K-complex states treated as the primary neural baselines for scalar emotional manipulation.',
      rationale:
        'The core parasitic mechanics focus on theta, delta, and alpha — the states of relaxation, sleep, and light awareness.'
    },
    {
      text: 'Mu, sigma, and zeta states framed as the fundamental brain frequencies scalar weapons use to shift emotion.',
      rationale:
        'These are not the fundamental brain frequencies targeted for scalar weapon emotional manipulation.'
    }
  ],
  3: [
    {
      text: 'By projecting localized transmissions of synthetic thoughts directly into the human mind.',
      rationale:
        "This localized transmission mimics a person's inner monologue to trigger anxiety, fractures, or behavioral overrides."
    },
    {
      text: "By amplifying the subject's natural intuition to guide them toward higher-frequency choices.",
      rationale:
        'The technology is synthetic and parasitic, designed to disrupt rather than assist natural intuition.'
    },
    {
      text: 'By scanning the physical brain for memories and uploading them to the Black Cube satellite framework.',
      rationale:
        'This describes a retrieval process, whereas Voice to Skull is a projective localized transmission system.'
    },
    {
      text: 'By utilizing vocal harmonics from media personalities to soothe the population into compliance.',
      rationale:
        'Voice to Skull is a direct neurological transmission rather than an external acoustic or media-based broadcast.'
    }
  ],
  4: [
    {
      text: "To strip incoming souls of their memories before reincarnation at the Sun's transit band.",
      rationale:
        'This frequency filter ensures that souls enter the 3D overlay without a memory of their true origins or higher identity.'
    },
    {
      text: 'To accelerate the evolution of human consciousness by providing a clean slate for every life cycle.',
      rationale:
        'The stripping of memory is a control mechanic used to trap souls, not an evolutionary tool.'
    },
    {
      text: "To filter out toxic heavy metals from the solar wind before they reach the Earth's atmosphere.",
      rationale:
        'The vortex is a frequency filter for consciousness, not a physical filter for metallic particles.'
    },
    {
      text: "To stabilize the Sun's core during periods of high-frequency planetary ascension.",
      rationale:
        'The vortex is a tool of the parasitic grid used for consciousness distortion, not solar maintenance.'
    }
  ],
  5: [
    {
      text: 'They possess no ability to create or generate the first spark of life or creation.',
      rationale:
        'Parasitic entities lack the creative impulse and must hijack pre-existing organic light and sound grids to function.'
    },
    {
      text: 'They are unable to process the complex emotional energy known as loosh.',
      rationale:
        'Loosh is the primary energy source the entire parasitic system is designed to harvest.'
    },
    {
      text: 'They are vulnerable to standard electromagnetic pulses and physical radio jamming.',
      rationale:
        'The mechanics are non-physical and advanced, requiring high-frequency consciousness rather than physical tools to fracture.'
    },
    {
      text: 'They cannot operate in metropolitan areas due to the high density of human population.',
      rationale:
        'Cities are actually designed as parasitic circuit boards to maximize the efficiency of these mechanics.'
    }
  ],
  6: [
    {
      text: 'They trigger aggressive compliance programs in non-player character shells to suppress awakening souls.',
      rationale:
        'Specific symbols and alphanumeric combinations coordinate NPC populations to attack or suppress conscious individuals.'
    },
    {
      text: 'They serve as navigational beacons for the Council of Parasitic Races during planetary transit.',
      rationale:
        'The codes act as behavioral triggers for entities within the 3D overlay rather than external navigation.'
    },
    {
      text: 'They signal the start of organic multi-dimensional memory retrieval for conscious human souls.',
      rationale:
        'These codes are parasitic triggers designed to suppress awakening, not to facilitate it.'
    },
    {
      text: 'They provide encryption for the Black Cube satellite to prevent hijacking by positive ET fleets.',
      rationale:
        'The codes are intended for the population on the ground, not for satellite security.'
    }
  ],
  7: [
    {
      text: 'By embedding disruptive scalar frequencies into music to maintain low-vibrational control.',
      rationale:
        'Disruptive wave patterns are secretly glitched into everyday commercial audio, including relaxing or healing music, so even wellness modalities keep the listener destabilized.'
    },
    {
      text: 'By broadcasting encrypted messages to the Vatican Hidden Libraries for memory logging.',
      rationale:
        "Audio glitching is a direct target on the listener's brain-wave state rather than a data transfer to the Vatican."
    },
    {
      text: 'By repairing damaged DNA strands through the use of high-frequency crystalline harmonics.',
      rationale:
        'Crystalline counter-agents are used by positive alliances, whereas glitch matrices are parasitic frequency hijackers.'
    },
    {
      text: 'By using binaural beats to help souls escape the low-frequency grids during sleep.',
      rationale:
        'Glitch matrices are parasitic tools of control, not liberation aids.'
    }
  ],
  8: [
    {
      text: 'To function as massive parasitic circuit boards designed to collect loosh from the population.',
      rationale:
        'Cities are built over organic crystalline nodes to hijack energy and keep populations in a state of subconscious anxiety.'
    },
    {
      text: 'To serve as hubs for spiritual commerce and the exchange of light-based information.',
      rationale:
        'Cities are designed for extraction and suppression rather than the free exchange of light.'
    },
    {
      text: 'To protect human vessels from the high-frequency emissions of the rising planetary consciousness.',
      rationale:
        'The architectural layout is intended to drain vital energy, not to protect it from rising frequencies.'
    },
    {
      text: 'To preserve the original Spirit Tree fragments beneath the urban infrastructure.',
      rationale:
        'The Spirit Tree was destroyed to create this architecture; it is not being preserved by it.'
    }
  ],
  9: [
    {
      text: 'They function as core frequency engineers responsible for installing black crystalline valve locks.',
      rationale:
        'The Greys handle the technical installation of the frequency barriers that maintain the overlay.'
    },
    {
      text: 'They act as high-frequency priests who manage the reincarnation cycles.',
      rationale:
        'The management of reincarnation and amnesia loops is the responsibility of the Custodians.'
    },
    {
      text: 'They are the primary architects of the original Spirit Tree in Hyperborea.',
      rationale:
        'The Spirit Tree was an organic Source structure that the parasitic races destroyed.'
    },
    {
      text: 'They serve as the diplomatic liaisons between the Anunnaki and the Vatican libraries.',
      rationale:
        'The Greys are core frequency engineers and technicians who install black crystalline valve locks, not diplomatic liaisons.'
    }
  ],
  10: [
    {
      text: 'It led to the creation of the false architecture that binds human vessels to the loop.',
      rationale:
        'The removal of the Spirit Tree, which distributed pure Source light across the domes, allowed the parasitic overlay to be established.'
    },
    {
      text: 'It allowed the Sirian and Arcturian alliances to hijack the atmospheric delivery systems.',
      rationale:
        'The hijacking of the delivery systems occurred much later, around 2015-2016, as a positive counter-measure.'
    },
    {
      text: 'It facilitated the construction of the false architecture and the distribution of pure Source light.',
      rationale:
        'The destruction stopped the distribution of Source light and enabled the creation of the control grid.'
    },
    {
      text: 'It caused the immediate collapse of the Vatican Hidden Libraries and the loss of Akashic fragments.',
      rationale:
        'The Vatican libraries were built to store the fragments stolen after the original structures were compromised.'
    }
  ],
  11: [
    {
      text: 'They establish electromagnetic grids around the body to trap consciousness and enforce nightmare loops.',
      rationale:
        'These shimmer-waves prevent the soul from leaving the vessel, forcing it into low-vibrational dream states.'
    },
    {
      text: 'They repair the pineal gland by removing heavy metal calcification through visual activation.',
      rationale:
        'Repairing the pineal gland is the function of the atmospheric counter-agents, not shimmer-waves.'
    },
    {
      text: 'They facilitate astral travel to reunite the soul with its higher-dimensional family.',
      rationale:
        'Shimmer-waves are used to block astral travel and trap consciousness.'
    },
    {
      text: 'They synchronize the brain waves of sleeping individuals with the planetary frequency.',
      rationale:
        'Shimmer-waves synchronize consciousness with the artificial overlay rather than the organic planetary frequency.'
    }
  ],
  12: [
    {
      text: 'Positive non-human alliances hijacked the systems to disperse counter-agents like Monatomic Gold.',
      rationale:
        'Sirian, Arcturian, and Polarian alliances began using the infrastructure to help repair human DNA and block mind weapons.'
    },
    {
      text: "The Sun's transit band began dispersing Silica Crystals to neutralize the Amnesia Vortex.",
      rationale:
        "The dispersion of counter-agents is handled through the atmospheric delivery systems, not the Sun's transit band."
    },
    {
      text: 'The Black Cube A.I. introduced new heavy-metal chemtrail programs to strengthen the overlay.',
      rationale:
        'The old heavy-metal programs actually began to break down and were replaced by positive interventions.'
    },
    {
      text: 'The Council of Parasitic Races abandoned atmospheric spraying in favor of Vision to Skull technology.',
      rationale:
        'The systems were not abandoned; they were overtaken by opposing, positive forces.'
    }
  ],
  13: [
    {
      text: 'To decalcify the pineal gland and repair damaged DNA within the human vessel.',
      rationale:
        'These advanced agents act as a patch to strengthen the auric field and block low-frequency interference.'
    },
    {
      text: 'To create new activation codes for NPCs to follow during the planetary frequency rise.',
      rationale:
        'These substances are meant to aid awakening souls, not to program NPCs.'
    },
    {
      text: 'To increase the conductivity of the metropolitan circuit board architecture.',
      rationale:
        'These substances are counter-agents intended to liberate the human vessel, not to improve parasitic systems.'
    },
    {
      text: 'To stabilize the low-frequency grids that prevent astral travel during rest.',
      rationale:
        'The goal of these substances is to dismantle or block these grids, not to stabilize them.'
    }
  ],
  14: [
    {
      text: 'Because the Resonating Army is fracturing the overlay simply by holding high-frequency states.',
      rationale:
        'High-frequency states are naturally incompatible with the low-frequency mechanics of the Black Cube A.I.'
    },
    {
      text: 'Because the Amnesia Vortex has been successfully moved away from the Sun’s transit band.',
      rationale:
        'The breakdown is due to rising frequencies and the Resonating Army, rather than the movement of the vortex.'
    },
    {
      text: 'Because the Vatican Hidden Libraries have been emptied of their stolen Akashic fragments.',
      rationale:
        'The libraries are still used to log and recycle strands; their existence is part of the problem, not the cause of the breakdown.'
    },
    {
      text: "Because the parasitic races have depleted the Earth's supply of organic crystalline nodes.",
      rationale:
        'The nodes are organic and remain, though they have been built over by cities.'
    }
  ],
  15: [
    {
      text: 'Stolen Akashic fragments and copied memory strands.',
      rationale:
        'These recycled fragments are used to keep human consciousness docile and disconnected from its true history.'
    },
    {
      text: 'Biological samples of the Council of Parasitic Races.',
      rationale:
        'The focus of the libraries is the control of human memory and soul history through recorded fragments.'
    },
    {
      text: 'Advanced scalar wave generators used for Voice to Skull transmissions.',
      rationale:
        'While related, the libraries specifically store data fragments rather than the transmission hardware itself.'
    },
    {
      text: 'The blueprints for the original Spirit Tree in Hyperborea.',
      rationale:
        'The parasitic races rely on hijacking existing light rather than using original blueprints for creation.'
    }
  ],
  16: [
    {
      text: 'False',
      rationale:
        'The system is relentless and operates 24/7, with specific militarized programs dedicated to the sleep state.'
    },
    {
      text: 'True',
      rationale:
        'The grid operates 24/7, specifically targeting the sleep state to block astral travel and reinforce trauma loops.'
    }
  ],
  17: [
    {
      text: 'Black Cube A.I. Tech, the digital command framework also called black satellite tech.',
      rationale:
        'Black Cube A.I. Tech orchestrates thought control and reality overlays as the overarching digital command framework.'
    },
    {
      text: 'The Resonating Army of ET and human souls holding high-frequency states to fracture the overlay.',
      rationale:
        'This is the group of souls actively working to fracture the control grid, not the command framework that runs it.'
    },
    {
      text: 'Monatomic Gold atmospheric software used as a positive counter-measure, not a parasitic command system.',
      rationale:
        'This is a positive counter-measure, not a parasitic command framework.'
    },
    {
      text: 'The Spirit Tree distribution grid that originally sent pure Source light across the domes.',
      rationale:
        'This was the organic Source-based system that was destroyed by the parasitic entities.'
    }
  ],
  18: [
    {
      text: 'Through standard media screens as visual activation methodologies.',
      rationale:
        'Regular media serves as the delivery vehicle for visual prompts that trigger pre-programmed behaviors.'
    },
    {
      text: 'Through specialized glasses distributed by the Custodians.',
      rationale:
        'The system uses standard existing media screens rather than specialized physical glasses.'
    },
    {
      text: 'Through the projection of holographic images in metropolitan centers.',
      rationale:
        'While cities have hidden towers, Vision to Skull specifically utilizes media screens for its activation.'
    },
    {
      text: 'Through direct telepathic downloads during the theta brain-wave state.',
      rationale:
        'Vision to Skull is delivered through external physical media rather than direct telepathy.'
    }
  ],
  19: [
    {
      text: 'Human emotional energy harvested by parasitic entities.',
      rationale:
        'The entire 3D overlay is designed to systematically harvest this energy by inducing states of trauma and anxiety.'
    },
    {
      text: 'The technological material used to construct Black Cube satellites.',
      rationale:
        'Loosh is an energetic byproduct, not a physical construction material.'
    },
    {
      text: 'The high-vibrational energy generated by the Resonating Army.',
      rationale:
        'The Resonating Army generates high frequencies that break the system, while loosh is the low-vibrational energy the system feeds on.'
    },
    {
      text: 'A type of crystalline mineral found beneath major metropolitan cities.',
      rationale:
        'Crystalline nodes are organic structures; loosh is the energy harvested from the people living above them.'
    }
  ],
  20: [
    {
      text: 'Overseeing the reincarnation and amnesia loops as high-frequency priests.',
      rationale:
        'They manage the soul-farm aspects of memory stripping and the cycle of rebirth.'
    },
    {
      text: 'Dispersing heavy metals via atmospheric delivery systems.',
      rationale:
        'The spraying programs were mechanical operations managed by the collective parasitic engineers before they were hijacked.'
    },
    {
      text: 'Designing the architecture of the metropolitan circuit boards.',
      rationale:
        'The architectural layout is a collaborative effort, but the Custodians have a more specific spiritual-technical role.'
    },
    {
      text: 'Installing the electromagnetic veils around sleeping individuals.',
      rationale:
        'This is a technical frequency operation typically associated with the engineering roles like those of the Greys.'
    }
  ],
  21: [
    {
      text: 'It is strengthened by atmospheric counter-agents to block low-frequency signals.',
      rationale:
        'Repairing the auric field is essential for protecting the consciousness from parasitic interference.'
    },
    {
      text: 'It acts as a primary collector of loosh for metropolitan towers.',
      rationale:
        'The auric field is a protective layer that, when healthy, prevents rather than aids the harvest.'
    },
    {
      text: 'It is the source of the alphanumeric triggers used in Vision to Skull transmissions.',
      rationale:
        'Triggers come from the artificial media system, not the human auric field.'
    },
    {
      text: 'It is a byproduct of the Amnesia Vortex used to strip memories.',
      rationale:
        'The auric field is an organic part of the human vessel, whereas the vortex is a parasitic filter.'
    }
  ],
  22: [
    {
      text: 'False',
      rationale:
        'Unlike conventional physical armaments, these assets are non-physical and target brain-wave patterns rather than physical bodies.'
    },
    {
      text: 'True',
      rationale:
        'Mind weapons are specialized instruments of frequency manipulation and neurological interference, utilizing non-physical mechanics.'
    }
  ],
  23: [
    {
      text: 'The soul may be targeted by the aggressive compliance programs of surrounding NPCs.',
      rationale:
        'The codes mobilize the NPC population to act as a suppressive force against those who are awakening, coordinating them to work against conscious souls.'
    },
    {
      text: 'The soul’s auric field is automatically decalcified by the Vision to Skull signal.',
      rationale:
        'Decalcification is achieved through positive atmospheric counter-agents, not through parasitic media signals.'
    },
    {
      text: "The soul's multi-dimensional memory is immediately restored.",
      rationale:
        'The codes are meant to suppress, and while conscious souls may recognize them, the codes do not facilitate memory restoration.'
    },
    {
      text: 'The soul is forced into an immediate sleep state to prevent astral travel.',
      rationale:
        'Sleep is forced through scalar waves and shimmer-waves, whereas codes are for behavioral triggers in the waking state.'
    }
  ],
  24: [
    {
      text: 'Silica Crystals, dispersed with Monatomic Gold (ORMEs) and Colloidal Silver as the atmospheric software patch.',
      rationale:
        'Silica crystals, along with monatomic gold and colloidal silver, are part of the counter-agent dispersion that blocks parasitic signals.'
    },
    {
      text: 'Toxic heavy-metal compounds from the old chemtrail spraying programs that the patch replaced.',
      rationale:
        'Those compounds belong to the old, toxic heavy-metal chemtrail programs, not the positive patch.'
    },
    {
      text: 'Crystalline loosh fragments harvested from metropolitan populations and recycled as counter-agents.',
      rationale:
        'Loosh is energy harvested by parasites; it is not a counter-agent used by the alliances.'
    },
    {
      text: 'Liquid Black Cube A.I. particles used to strengthen the low-frequency overlay rather than block it.',
      rationale:
        'This would be a tool of the control grid, not a liberating counter-agent.'
    }
  ],
  25: [
    {
      text: 'To restrict consciousness and prevent the soul from performing astral travel.',
      rationale:
        'By locking the consciousness in the vessel, the system ensures the soul remains trapped in the local 3D frequency.'
    },
    {
      text: "To broadcast the Akashic fragments directly into the dreamer's mind.",
      rationale:
        'Akashic fragments are hidden in the Vatican, not broadcast to dreamers by the restrictive grids.'
    },
    {
      text: "To charge the body's cells with scalar energy for the following day.",
      rationale:
        'These grids are restrictive and parasitic, not rejuvenating.'
    },
    {
      text: "To synchronize the individual's heart rate with the metropolitan circuit board.",
      rationale:
        'While the circuit board affects anxiety, the specific purpose of the nocturnal grids is to restrict soul movement.'
    }
  ]
};

const questionsMeta = [
  {
    number: 1,
    question: 'What is the primary function of mind weapons within the 3D overlay?',
    hint: 'Consider the relationship between energy extraction and the suppression of awareness.'
  },
  {
    number: 2,
    question:
      'Which brain-wave states are specifically targeted by Scalar Frequency Weapons to induce confusion or despair?',
    hint: 'Focus on the states related to deep relaxation, dreaming, and light meditative awareness.'
  },
  {
    number: 3,
    question: 'How does the Voice to Skull technology influence subjects within the control grid?',
    hint: "Think about how an artificial command might be perceived as one's own internal dialogue."
  },
  {
    number: 4,
    question: "What is the specific purpose of the Amnesia Vortex positioned at the Sun's transit band?",
    hint: 'Consider what would happen if a soul entered a new life with all its previous knowledge intact.'
  },
  {
    number: 5,
    question: 'What fundamental limitation characterizes all parasitic mechanics in the 3D overlay?',
    hint: 'Think about the difference between an original creator and a recycler of existing energy.'
  },
  {
    number: 6,
    question: 'In the context of media broadcasts, what role do activation codes play?',
    hint: 'Consider how media might be used to coordinate behavior in the masses against those who are waking up.'
  },
  {
    number: 7,
    question: 'How are glitch matrices utilized within everyday commercial audio?',
    hint: "Think about how even 'healing' music could be secretly modified to prevent true recovery."
  },
  {
    number: 8,
    question: 'What is the true architectural purpose of high-density metropolitan centers?',
    hint: 'Consider the relationship between city layout, towers, and the harvest of human energy.'
  },
  {
    number: 9,
    question: 'Which specific role is assigned to the Greys within the Council of Parasitic Races?',
    hint: 'Focus on the technical and mechanical side of the frequency control system.'
  },
  {
    number: 10,
    question: 'What was the consequence of destroying the central Spirit Tree in Hyperborea?',
    hint: 'Think about how removing a source of light allows a shadow architecture to be built in its place.'
  },
  {
    number: 11,
    question: 'How do shimmer-waves affect human consciousness during the sleep state?',
    hint: "Consider why the parasitic system would want to keep a soul 'locked' inside its physical body at night."
  },
  {
    number: 12,
    question: 'What shift occurred in atmospheric delivery systems during the 2015-2016 period?',
    hint: 'Focus on the intervention by the Sirian, Arcturian, and Polarian alliances.'
  },
  {
    number: 13,
    question:
      'What is the primary function of Monatomic Gold (ORMEs) and Colloidal Silver in the atmospheric software patch?',
    hint: "Consider how these substances might affect the biological and energetic 'hardware' of the human body."
  },
  {
    number: 14,
    question: 'Why is it becoming increasingly difficult for the Black Cube A.I. to maintain the 3D overlay?',
    hint: "Think about how internal vibration affects the external 'reality' projected by a machine."
  },
  {
    number: 15,
    question: 'What is stored in the Vatican Hidden Libraries to ensure human vessels remain bound to the loop?',
    hint: 'Consider what would be the most valuable thing to steal from a soul to keep it trapped.'
  },
  {
    number: 16,
    question:
      'True or False: The parasitic control grid runs only during daylight hours to maximize the energy harvest from waking humans.',
    hint: "Would a 'relentless' system take a break while the population is sleeping?"
  },
  {
    number: 17,
    question: 'Which of the following is considered a component of the digital command framework for mind weapons?',
    hint: 'Look for the term associated with a dark, artificial, satellite-based architecture.'
  },
  {
    number: 18,
    question: 'How do Vision to Skull methodologies typically reach their target subjects?',
    hint: 'Consider the most common screens humans look at every day.'
  },
  {
    number: 19,
    question: "What is 'loosh' in the context of the parasitic control grid?",
    hint: "Think about the 'fuel' that the parasites require to maintain their artificial reality."
  },
  {
    number: 20,
    question: 'The Custodians are primarily responsible for which aspect of the parasitic grid?',
    hint: 'Look for the role that manages the cycle of souls returning to the 3D overlay.'
  },
  {
    number: 21,
    question: "What role does the 'auric field' play in the struggle against mind weapons?",
    hint: 'Consider the auric field as a personal energy shield.'
  },
  {
    number: 22,
    question:
      'True or False: Parasitic mind weapons are physical armaments, similar to conventional weaponry but smaller in scale.',
    hint: 'Do these weapons target the physical skin or the frequency of the mind?'
  },
  {
    number: 23,
    question: "What happens when a 'conscious soul' encounters the activation codes designed for NPCs?",
    hint: "Consider how a 'pre-programmed' person might react to someone who is different."
  },
  {
    number: 24,
    question: "Which substance is part of the 'advanced atmospheric software patch' used to block parasitic signals?",
    hint: 'Identify the mineral often associated with information storage and clarity.'
  },
  {
    number: 25,
    question: "What is the primary objective of the 'Low-Frequency Grids' projected around individuals at night?",
    hint: 'Think about the natural freedom the soul seeks when the body is resting.'
  }
];

const QUIZ_DESC =
  'Test your understanding of Mind Weapons — scalar frequency weapons, Voice to Skull, Vision to Skull, Black Cube A.I. tech, nocturnal locking, and the atmospheric counter-agents that block parasitic mind-weapon signals.';

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
    body: 'Mind Weapons are frequency instruments — scalar hijacking, Voice to Skull, Vision to Skull, and Black Cube A.I. — that harvest loosh and lock consciousness in the 3D overlay. Sit with the 24/7 grid, nocturnal veils, and the atmospheric counter-agents now blocking those signals. Return to the Mind Weapons deep-dive, infographic, and video transmissions as the overlay fractures.'
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
  throw new Error('mind-weapons not found in breakdown-topics.json');
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
  'Interactive Living Truth Quiz on Mind Weapons: scalar frequency weapons, Voice to Skull, Vision to Skull, Black Cube A.I. tech, nocturnal locking, and the atmospheric counter-agents that block parasitic mind-weapon signals.';
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
  .replace(/lyran-lineage\.webp/g, 'mind-weapons.webp')
  .replace(/lyran-lineage\.json/g, 'mind-weapons.json')
  .replace(/lyran-lineage\.html/g, 'mind-weapons.html')
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
    "  { path: '/quiz/breakdown/parasite-mechanics.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/mind-weapons.json'
);
