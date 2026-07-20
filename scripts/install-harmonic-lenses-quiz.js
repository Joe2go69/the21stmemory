/**
 * Installs Harmonic Lenses quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/crystalline-quiz.json
 * Audits all 25 items against data/breakdown-topics/harmonic-lenses.json.
 * Run: node scripts/install-harmonic-lenses-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/harmonic-lenses.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'harmonic-lenses';
const TOPIC_TITLE = 'Harmonic Lenses';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/crystalline-quiz.json';

const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

/** Support phrases grounded only in harmonic-lenses.json report. */
const supportPhrases = {
  1: ['energy nodes', 'harmonic lenses', 'crystalline grid'],
  2: ['shape', 'focus', 'redirect', 'vibrational'],
  3: ['earth nodes', 'red-gold', 'orange', 'plasma'],
  4: ['loosh', 'attention', 'emotion', 'false stability'],
  5: ['spirit tree', 'axis of consciousness', 'black cube'],
  6: ['stars', 'multidimensional', 'sky nodes', 'crystalline nodes'],
  7: ['fatigue', 'disconnection', 'concrete', 'short-circuit'],
  8: ['great fire of london', '1666', 'etheric war', 'masonic'],
  9: ['clear and tuned', 'heartbeat', 'clouded', 'fractured'],
  10: ['thuban', 'aru-el-nai', 'polaris', 'vertical axis'],
  11: ['holding resonance', 'rejecting fear', 'breathing in stillness'],
  12: ['zodiac', 'frequency locks', 'seal'],
  13: ['surface nodes', 'temples', 'pyramids', 'stone circles'],
  14: ['souls', 'powerful nodes', 'interface', 'heal'],
  15: ['boxes', 'sharp angles', 'concrete', 'fatigue'],
  16: ['crystalline structures', 'hard drives', 'source codes'],
  17: ['positioning', 'projection', 'sun', 'countries'],
  18: ['inter-dimensional', 'portals', 'overlays', 'rainbow'],
  19: ['clouded', 'fractured', 'drained', 'agitated'],
  20: ['deep underground', 'plasma', 'crystalline veins'],
  21: ['tartarian', 'masonic architecture', 'suppress'],
  22: ['frequency', 'fracturing', 'reactivating'],
  23: ['energy nodes', 'neutral relay', 'junction'],
  24: ['sacred sites', 'river bends', 'interface'],
  25: ['inverting', 'parasitic circuit boards', 'siphon loosh']
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
    [/^According to the (core revelations|source|report|text|revelations|material|detailed mechanics|journal),?\s*/i, ''],
    [/^According to the report,?\s*/i, ''],
    [/^According to the text,?\s*/i, ''],
    [/^According to the material,?\s*/i, ''],
    [/^According to the detailed mechanics of the grid,?\s*/i, ''],
    [/^According to the Journal,?\s*/i, ''],
    [/\baccording to the (report|source|text|core revelations|revelations|material|journal)\b/gi, ''],
    [/^The source states that\s+/i, ''],
    [/^The source specifies that\s+/i, ''],
    [/^The source material explicitly states that\s+/i, ''],
    [/^The source material specifies that\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The text identifies\s+/i, ''],
    [/^The text suggests that\s+/i, ''],
    [/^The text mentions\s+/i, ''],
    [/^The text confirms that\s+/i, ''],
    [/^The text explicitly states that\s+/i, ''],
    [/^The material suggests that\s+/i, ''],
    [/^The material clarifies that\s+/i, ''],
    [/^The material reveals that\s+/i, ''],
    [/^The material states that\s+/i, ''],
    [/^The material explains that\s+/i, ''],
    [/^The journal states that\s+/i, ''],
    [/^The journal explicitly suggests that\s+/i, ''],
    [/\bThe text states that\b/gi, ''],
    [/\bthe text states that\b/gi, ''],
    [/\bThe text confirms that\b/gi, ''],
    [/\bthe text confirms that\b/gi, ''],
    [/\bThe text explicitly mentions that\b/gi, ''],
    [/\bThe text explicitly states that\b/gi, ''],
    [/\bthe source material explicitly states that\b/gi, ''],
    [/\bmentioned in the source material\b/gi, ''],
    [/\bmentioned in the text\b/gi, ''],
    [/\bsource material\b/gi, 'transmission'],
    [/\bin the source material\b/gi, ''],
    [/\bis described as\b/gi, 'is'],
    [/\bare described as\b/gi, 'are'],
    [/\bthe material identifies as\b/gi, 'is'],
    [/\bthe material states\b/gi, ''],
    [/\bthe journal states\b/gi, ''],
    [/\bthe journal explicitly suggests that\b/gi, '']
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
 * All four options written at similar depth from harmonic-lenses report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'Energy Nodes and Harmonic Lenses forming the true Crystalline Grid of the realm.',
      rationale:
        'The fundamental architecture of the physical plane consists of interconnected Energy Nodes and their surrounding Harmonic Lenses, which form the true Crystalline Grid as circulatory and nervous systems of the realm.'
    },
    {
      text: 'Crystalline Temples and Stone Circles standing alone as the complete grid architecture.',
      rationale:
        'Temples and stone circles mark Surface Nodes where energy lines cross, but they are markers of the nodes rather than the dual foundational architecture of nodes and lenses.'
    },
    {
      text: 'Leylines and Plasma Veins acting as the sole primary structure of the physical plane.',
      rationale:
        'Leylines and plasma veins are the currents and conduits that carry life force, not the primary architectural pair of Energy Nodes and Harmonic Lenses.'
    },
    {
      text: 'Black Cube Tech and Parasitic Overlays designed as the original foundation of reality.',
      rationale:
        'Black Cube Tech and parasitic overlays are the hijacked additions that suppressed the original grid; they are not the original dual architecture of nodes and lenses.'
    }
  ],
  2: [
    {
      text: 'They shape, focus, and redirect vibrational energy around an active node like a crystalline bloom.',
      rationale:
        'Harmonic Lenses are the pattern of frequency around an active node, acting like a crystalline bloom that opens and closes to shape, focus, and redirect vibrational energy much like a glass lens shapes light.'
    },
    {
      text: 'They act as neutral relay stations gathering power from leylines and passing it along the grid.',
      rationale:
        'Neutral relay stations that gather and pass power are Energy Nodes; Harmonic Lenses form the frequency pattern that shapes energy around those nodes.'
    },
    {
      text: 'They serve as etheric hard drives storing ancient Source codes for the multi-dimensional grid.',
      rationale:
        'Crystalline structures including nodes, lenses, and temples hum with Source codes and serve as hard drives, but the specific function of a lens is to shape and focus vibrational energy.'
    },
    {
      text: 'They permanently anchor parasitic overlays into physical geography as fixed radio towers.',
      rationale:
        'Parasites used lenses to manipulate reality after inversion, but the original function of Harmonic Lenses is to shape Source energy around nodes, not to serve as permanent parasitic anchors.'
    }
  ],
  3: [
    {
      text: 'Earth Nodes, also called Lava or Core Nodes, pulsing red-gold or orange light deep underground.',
      rationale:
        'Earth Nodes (Lava/Core Nodes) sit deep underground where plasma and crystalline veins meet, pulsing with red-gold or orange light as power cores that stabilize magnetic resonance of the dome.'
    },
    {
      text: 'Inter-dimensional Nodes appearing as rainbow balls, gold lattices, or liquid silver orbs.',
      rationale:
        'Inter-dimensional Nodes (Light Grid Anchors) appear as rainbow balls, gold lattices, or liquid silver orbs and hold portals between overlays; they are not the red-gold underground power cores.'
    },
    {
      text: 'Surface Nodes humming in blue or white tones at temples, pyramids, and stone circles.',
      rationale:
        'Surface Nodes hum in blue or white tones where energy lines cross; Earth Nodes are the deep red-gold or orange power cores underground.'
    },
    {
      text: 'Sky Nodes appearing as bright stars or the Northern Lights in the projected firmament.',
      rationale:
        'Sky Nodes appear as bright stars or the Northern Lights and anchor overlay grids above; Earth Nodes are deep subterranean power cores pulsing red-gold or orange.'
    }
  ],
  4: [
    {
      text: 'To maintain the false stability of parasitic overlays through harvested attention and emotion.',
      rationale:
        'Loosh is the collective attention and emotion harvested by parasites to maintain their false stability, siphoned after nodes were inverted into parasitic circuit boards.'
    },
    {
      text: 'To provide the original vitality and unobstructed connection of pure Source life force to all realms.',
      rationale:
        'Source is the pure awareness and life force that originally flowed through nodes and lenses; Loosh is the harvested attention and emotion used to sustain parasitic overlays.'
    },
    {
      text: 'To stabilize the magnetic resonance of the Great Dome through deep plasma and crystalline pulses.',
      rationale:
        'Magnetic resonance of the dome is stabilized by Earth Nodes pushing life force upward; Loosh is harvested emotion used for parasitic false stability, not dome magnetism.'
    },
    {
      text: 'To act as the multi-dimensional communication and power network of the living Crystalline Grid.',
      rationale:
        'The Crystalline Grid is the communication and power network of nodes, lenses, and crystals; Loosh is siphoned emotion that parasites use to keep their false system stable.'
    }
  ],
  5: [
    {
      text: 'It functioned as the main axis of consciousness sending harmonic currents through the entire grid.',
      rationale:
        'The central node of the Great Dome was the Spirit Tree, which acted as the main axis of consciousness, sending harmonic currents through the entire grid before it was ripped out and replaced with Black Cube Tech.'
    },
    {
      text: 'It acted as a frequency lock placed over Zodiac Star-Signs to seal the celestial sky gateways shut permanently.',
      rationale:
        'Zodiac Star-Signs are the frequency locks placed over sky gates; the Spirit Tree was the central axis of consciousness for the Great Dome, not a zodiac lock.'
    },
    {
      text: 'It was only a local crystalline hard drive for Tartarian grid memory under one city node alone.',
      rationale:
        'Crystalline structures store Source codes as hard drives of the grids, but the Spirit Tree specifically was the central node and main axis of consciousness for the entire Great Dome grid.'
    },
    {
      text: 'It served as a sky portal for the Northern Lights and projected celestial overlay anchors above ground.',
      rationale:
        'Sky Nodes appear as bright stars or the Northern Lights; the Spirit Tree was the central grounding axis of the Great Dome before Black Cube Tech replaced it.'
    }
  ],
  6: [
    {
      text: 'Multidimensional crystalline nodes, specifically Sky Nodes that anchor the overlay grids.',
      rationale:
        'What humans perceive as stars are actually multidimensional crystalline nodes (Sky Nodes) — projected points that anchor the overlay grids and communicate with earth nodes in a two-way energy relay.'
    },
    {
      text: 'Artificial radio towers whose only purpose is broadcasting Loosh codes into the night sky.',
      rationale:
        'Parasites anchored overlay codes into nodes like radio towers after inversion, but the true underlying nature of the stars is multidimensional crystalline Sky Nodes, not pure Loosh towers.'
    },
    {
      text: 'Simple reflections of the projected sun bouncing off the inner surface of the Great Dome.',
      rationale:
        'The sun can be artificially positioned and projected, but stars specifically function as Sky Nodes — multidimensional crystalline nodes anchoring overlay grids.'
    },
    {
      text: 'Gaseous suns burning millions of light-years away in an empty infinite outer space vacuum.',
      rationale:
        'That conventional 3D narrative is part of the overlay distortion; stars are Sky Nodes — multidimensional crystalline nodes within the crystalline network of the realm.'
    }
  ],
  7: [
    {
      text: 'It induces fatigue and disconnection by blocking or short-circuiting organic grid nodes with dead materials.',
      rationale:
        'Modern 3D architecture defined by boxes, sharp angles, and dead materials like concrete was purposefully placed to block or short-circuit organic grid nodes, inducing fatigue and disconnection.'
    },
    {
      text: 'It creates a protective barrier that shields inhabitants from all parasitic interference and Loosh siphon.',
      rationale:
        'Modern architecture was designed by parasites to induce fatigue and disconnection, not to protect inhabitants; concrete and sharp angles short-circuit organic grid nodes.'
    },
    {
      text: 'It amplifies Source energy flowing through Surface Nodes so cities hum with pure life force.',
      rationale:
        'Source energy is blocked by modern dead materials like concrete rather than amplified; boxes and sharp angles short-circuit organic nodes and induce fatigue.'
    },
    {
      text: 'It serves as a physical hard drive for ancient soul codes equal to temples and crystalline nodes.',
      rationale:
        'Ancient crystalline structures are the hard drives of the grids; modern boxes of concrete are dead materials used for suppression, not storage of Source codes.'
    }
  ],
  8: [
    {
      text: 'A surface-level distraction masking an etheric war over the crystalline node beneath the city.',
      rationale:
        'The Great Fire of London in 1666 was a surface-level distraction masking an etheric war over the crystalline node beneath the city, which was then locked down and overwritten with masonic architecture to suppress Tartarian grid memory.'
    },
    {
      text: 'The successful realignment of a Sky Node with Polaris to restore the original vertical axis.',
      rationale:
        'The shift from Thuban to Polaris was a separate celestial projection manipulation; the Great Fire masked an etheric war over London\'s crystalline node, not a Polaris realignment.'
    },
    {
      text: 'The natural reactivation of an Earth Node as rising frequency restored Source flow through the city.',
      rationale:
        'The fire was not a natural reactivation; it distracted from an etheric takeover that locked the node and overwrote it with masonic architecture to suppress Tartarian memory.'
    },
    {
      text: 'The destruction of the Spirit Tree\'s physical roots under London as the central axis was removed.',
      rationale:
        'The Spirit Tree\'s removal was the broader replacement of the Great Dome\'s central axis with Black Cube Tech; the Great Fire specifically masked war over London\'s city node.'
    }
  ],
  9: [
    {
      text: 'Whether energy flows in rhythm with the realm\'s heartbeat or is distorted by parasitic interference.',
      rationale:
        'When clear and tuned, a harmonic lens lets energy flow in perfect rhythm with the realm\'s heartbeat; when clouded or fractured by parasitic interference, the lens distorts the current and drains inhabitants.'
    },
    {
      text: 'Whether ancient masonic symbols fill the surrounding city blocks and public monuments after a reset.',
      rationale:
        'Masonic architecture is used to overwrite and suppress locked nodes after etheric wars; clarity of a local lens is determined by resonance with the realm\'s heartbeat versus parasitic interference.'
    },
    {
      text: 'Whether a large amount of Loosh has already been harvested from the local population that same day.',
      rationale:
        'Loosh is harvested because of distorted or inverted systems; the clarity of a lens is whether energy flows in rhythm with the realm\'s heartbeat or is clouded by parasitic interference.'
    },
    {
      text: 'Whether the nearest Sky Node is perfectly aligned with Thuban as the original North Star center axis.',
      rationale:
        'Thuban was the original vertical-axis anchor, but local lens clarity depends on immediate resonance and parasitic interference, not solely on nearest Sky Node alignment with Thuban.'
    }
  ],
  10: [
    {
      text: 'Thuban (Aru-el-nai), which anchored the vertical axis before the projection was rotated to Polaris.',
      rationale:
        'The true North Star alignment was centered on Thuban (Aru-el-nai), which anchored the vertical axis of the grid, before parasites rotated the projection to point to Polaris to enforce their control narrative.'
    },
    {
      text: 'The Northern Lights, which appear as the sole permanent anchor of every vertical grid current.',
      rationale:
        'The Northern Lights are manifestations associated with Sky Nodes; the original vertical-axis anchor was Thuban (Aru-el-nai), not the aurora display itself.'
    },
    {
      text: 'Sirius, which is named as the only true North Star center for the entire crystalline grid axis.',
      rationale:
        'Sirius is not named as the vertical-axis anchor in this transmission; Thuban (Aru-el-nai) was the true North Star alignment before the projection was rotated to Polaris.'
    },
    {
      text: 'Polaris, which has always been the original and unaltered center of the vertical grid axis.',
      rationale:
        'Polaris is the current parasitic projection used to enforce control; the true original anchor was Thuban (Aru-el-nai) before the sky projection was rotated.'
    }
  ],
  11: [
    {
      text: 'By holding resonance, rejecting fear, and breathing in stillness with the earth as a living lens.',
      rationale:
        'By holding resonance, rejecting fear, and breathing in stillness with the earth, awakened souls function as harmonic lenses themselves, restoring broken circuits; every heart in harmony becomes a harmonic lens.'
    },
    {
      text: 'By only studying the artificial positioning of the sun without changing internal state or breath.',
      rationale:
        'Understanding sun-projection distortion can support awakening, but functioning as a lens requires holding resonance, rejecting fear, and breathing in stillness so soul codes match Source codes in the grid.'
    },
    {
      text: 'By siphoning Loosh from others to strengthen an individual etheric field above the surrounding grid.',
      rationale:
        'Siphoning Loosh is a parasitic action that maintains false stability; clear lenses form when souls hold resonance and reject fear rather than harvest emotion from others.'
    },
    {
      text: 'By physically visiting every Surface Node on the planet before any resonance can take effect.',
      rationale:
        'Standing on sacred sites helps interface with masked crystalline structures, but being a harmonic lens is primarily internal resonance — holding harmony and breathing in stillness — not mandatory global travel.'
    }
  ],
  12: [
    {
      text: 'False — Zodiac Star-Signs are frequency locks placed over gates to seal them, not free exit paths.',
      rationale:
        'Constellations, or Zodiac Star-Signs, are frequency locks placed over these gates to seal them; they do not function as free gateways for souls to exit the Great Dome.'
    },
    {
      text: 'True — Zodiac Star-Signs are natural open gateways that allow souls to freely exit the Great Dome.',
      rationale:
        'They are not free open exits; Zodiac Star-Signs are frequency locks placed over multidimensional Sky Node gates to seal them under parasitic control.'
    },
    {
      text: 'True — Zodiac constellations amplify Source flow so every soul can leave density without resistance.',
      rationale:
        'Zodiac Star-Signs do not amplify free exit; they are frequency locks sealing the gates over Sky Nodes rather than open pathways out of the Great Dome.'
    },
    {
      text: 'False — Zodiac Star-Signs do not exist at all and have no relationship to Sky Nodes or gates.',
      rationale:
        'Zodiac Star-Signs do exist as frequency locks over the gates; the falsehood is that they are free natural exits, not that they have no structural role.'
    }
  ],
  13: [
    {
      text: 'They are often marked by ancient temples, pyramids, or stone circles where energy lines cross.',
      rationale:
        'Surface Nodes (Harmonic Nodes) are positioned where energy lines cross, often marked by ancient temples, pyramids, or stone circles, humming in blue or white tones and connecting to sky portals.'
    },
    {
      text: 'They appear only as liquid silver orbs that remain completely invisible to ordinary 3D perception.',
      rationale:
        'Liquid silver orbs describe Inter-dimensional Nodes (Light Grid Anchors); Surface Nodes are marked by temples, pyramids, or stone circles at energy-line crossings.'
    },
    {
      text: 'They are always found exclusively deep in the ocean with no surface monuments or markers at all.',
      rationale:
        'Some grid structures may be buried under oceans, but Surface Nodes are specifically at energy-line crossings and are often marked by temples, pyramids, or stone circles.'
    },
    {
      text: 'They are the only points where parasites anchored the Spirit Tree as the central Great Dome axis.',
      rationale:
        'The Spirit Tree was the central node of the Great Dome, not a standard Surface Node; Surface Nodes are marked by temples, pyramids, and stone circles at crossings.'
    }
  ],
  14: [
    {
      text: 'Souls are powerful nodes meant to interface with the grid, healing, balancing, and relaying light.',
      rationale:
        'Souls themselves are powerful nodes meant to interface with this grid, healing, balancing, and relaying light back through the web; every heart in harmony becomes a harmonic lens.'
    },
    {
      text: 'Souls remain fully disconnected from the grid until they permanently leave the Great Dome behind.',
      rationale:
        'Souls are already meant to interface as powerful nodes within the grid architecture; connection was suppressed and inverted, not permanently absent until exit.'
    },
    {
      text: 'Souls are parasitic overlays that primarily siphon energy from nodes rather than heal the web.',
      rationale:
        'Souls are the intended interface for healing and relaying light through the grid; parasitic overlays and Loosh harvesting are the inverted system, not the nature of souls.'
    },
    {
      text: 'Souls are only byproduct emotions that create grid stability without any nodal interface role.',
      rationale:
        'That confuses souls with Loosh — harvested attention and emotion; souls are powerful nodes that interface with the grid to heal, balance, and relay light.'
    }
  ],
  15: [
    {
      text: 'False — boxes, sharp angles, and concrete were placed to block organic nodes and induce fatigue.',
      rationale:
        'Modern 3D architecture defined by boxes, sharp angles, and dead materials like concrete was purposefully placed to block or short-circuit organic grid nodes, inducing fatigue and disconnection — not mere aesthetic efficiency.'
    },
    {
      text: 'True — modern city design exists only for aesthetic efficiency and long-term material durability.',
      rationale:
        'That conventional explanation is incomplete; the architecture of boxes, sharp angles, and concrete was purposefully used to short-circuit organic grid nodes and induce fatigue.'
    },
    {
      text: 'True — modern architecture was built primarily to amplify Source flow through every Surface Node.',
      rationale:
        'Modern dead materials block or short-circuit organic nodes rather than amplify Source; the design induces fatigue and disconnection from the living grid.'
    },
    {
      text: 'False — modern architecture has no energetic effect and is completely neutral to the crystalline grid.',
      rationale:
        'It is not energetically neutral; boxes, sharp angles, and concrete purposefully block or short-circuit organic grid nodes to induce fatigue and disconnection.'
    }
  ],
  16: [
    {
      text: 'Crystalline structures such as nodes, lenses, and temples humming with ancient Source codes.',
      rationale:
        'Crystalline Structures are the true underlying material and architecture of the realms, including nodes, lenses, and temples, which hum with ancient Source codes and serve as the physical and etheric hard drives of the grids.'
    },
    {
      text: 'The magnetic field of the projected sun alone, without nodes, lenses, or temple architecture.',
      rationale:
        'The sun can be artificially positioned via hijacked lenses; the hard drives of the grids are crystalline structures — nodes, lenses, and temples humming with Source codes.'
    },
    {
      text: 'Modern computer servers buried under cities as the only storage for multi-dimensional grid data.',
      rationale:
        'Modern technology and architecture often suppress the grid; the ancient hard drives are crystalline structures of nodes, lenses, and temples with Source codes.'
    },
    {
      text: 'The personal memories of Forgotten Gods stored only in outer domes without local grid hardware.',
      rationale:
        'Outer domes connect through the grid, but the physical and etheric hard drives of the grids are crystalline structures including nodes, lenses, and temples.'
    }
  ],
  17: [
    {
      text: 'By artificial positioning and projection of the sun across different countries through the lenses.',
      rationale:
        'Parasites used harmonic lenses to manipulate reality, including the artificial positioning and projection of the sun across different countries, after anchoring overlay codes into the nodes.'
    },
    {
      text: 'By turning all Sky Nodes into black holes that permanently absorb every stream of Source energy.',
      rationale:
        'Stars are Sky Nodes and Zodiac locks seal gates; they are not described as black holes. Lens manipulation includes artificial sun positioning and projection across countries.'
    },
    {
      text: 'By only increasing heart frequency in individuals until anxiety replaces all other perception.',
      rationale:
        'Clouded lenses can leave inhabitants drained, confused, or agitated, but the specific large-scale reality manipulation named for lenses includes artificial sun positioning and projection.'
    },
    {
      text: 'By replacing all organic matter worldwide with concrete and steel without using the lenses at all.',
      rationale:
        'Architectural suppression with concrete is a separate grid-blocking tactic; parasites specifically used harmonic lenses to manipulate reality including artificial sun projection.'
    }
  ],
  18: [
    {
      text: 'They hold the portals between overlays as high-frequency spheres invisible to ordinary 3D eyes.',
      rationale:
        'Inter-dimensional Nodes (Light Grid Anchors) are high-frequency spheres, invisible to 3D eyes, holding the portals between overlays, appearing as rainbow balls, gold lattices, or liquid silver orbs.'
    },
    {
      text: 'They act as frequency locks for the North Star and seal every vertical axis of the grid permanently.',
      rationale:
        'Frequency locks are associated with Zodiac Star-Signs over Sky Node gates; Inter-dimensional Nodes hold portals between overlays as high-frequency spheres.'
    },
    {
      text: 'They mark the crossing of leylines with ancient pyramids, temples, and stone circles on the surface.',
      rationale:
        'That is characteristic of Surface Nodes; Inter-dimensional Nodes are invisible high-frequency portal anchors between overlays, not surface temple markers.'
    },
    {
      text: 'They push red-gold plasma up through tree roots and mountains from deep underground power cores.',
      rationale:
        'That is the function of Earth Nodes (Lava/Core Nodes); Inter-dimensional Nodes hold portals between overlays as high-frequency spheres.'
    }
  ],
  19: [
    {
      text: 'The energy current distorts, causing inhabitants within its field to feel drained, confused, or agitated.',
      rationale:
        'When clouded or fractured by parasitic interference, the lens distorts the current, causing the inhabitants within its field to feel drained, confused, or agitated instead of flowing with the realm\'s heartbeat.'
    },
    {
      text: 'The Spirit Tree immediately grows back through Black Cube Tech and restores full Source flow overnight.',
      rationale:
        'Grid reactivation is tied to rising frequency and resonating souls, not to a lens becoming clouded; a fractured lens distorts current and drains inhabitants.'
    },
    {
      text: 'The Crystalline Grid collapses entirely and disappears from every layer of the 3D plane forever.',
      rationale:
        'The grid is suppressed and hijacked, not erased; a clouded lens distorts the current so people feel drained, confused, or agitated within its field.'
    },
    {
      text: 'The node it surrounds permanently converts into an Earth Node with red-gold molten-fire pulses.',
      rationale:
        'Node types are structural roles in the fourfold architecture; clouding describes lens clarity and resonance state, which distorts current rather than converting node type.'
    }
  ],
  20: [
    {
      text: 'Deep underground where plasma and crystalline veins meet, pushing life force up through the realm.',
      rationale:
        'Earth Nodes (Lava/Core Nodes) are located deep underground where plasma and crystalline veins meet, pulsing red-gold or orange light and pushing life force up through leylines, tree roots, and mountains.'
    },
    {
      text: 'At high-frequency spheres that remain invisible to 3D eyes and hold portals between overlays.',
      rationale:
        'Those are Inter-dimensional Nodes; Earth Nodes sit deep underground where plasma and crystalline veins meet as the power cores of the dome.'
    },
    {
      text: 'Only at the center of major modern cities such as London without any deep underground plasma junction.',
      rationale:
        'Major cities sit over multi-layered crystal anchors, but Earth Nodes specifically are deep underground where plasma and crystalline veins meet as lava/core power cores.'
    },
    {
      text: 'In the atmosphere where the Northern Lights appear as projected Sky Node anchor points above.',
      rationale:
        'Northern Lights associate with Sky Nodes; Earth Nodes are deep underground at the plasma–crystalline junction pushing life force upward.'
    }
  ],
  21: [
    {
      text: 'Masonic architecture was placed to suppress original Tartarian grid memory after nodes were locked down.',
      rationale:
        'After the etheric war over London\'s node, the node was locked down and overwritten with masonic architecture to suppress the original Tartarian grid memory.'
    },
    {
      text: 'Tartarian grid memory is the original source of the masonic overlay codes used to open free gates.',
      rationale:
        'Overlay codes are parasitic distortions; Tartarian grid memory relates to the original Source-connected grid that masonic architecture was used to suppress.'
    },
    {
      text: 'Masonic architecture was built primarily to amplify and preserve Tartarian memory for public access.',
      rationale:
        'Masonic architecture was used for suppression and overwriting after nodes were locked down, not to preserve Tartarian grid memory.'
    },
    {
      text: 'Both systems are identical original Crystalline Grid technology with no parasitic overwrite involved.',
      rationale:
        'The original grid is Source-based; masonic architecture overwrote locked nodes to suppress Tartarian grid memory as part of the parasitic lockdown.'
    }
  ],
  22: [
    {
      text: 'Parasitic overlays are fracturing and suppressed nodes and harmonic lenses are reactivating.',
      rationale:
        'As the frequency of the realm rises, the parasitic overlays are fracturing. The suppressed nodes and harmonic lenses are reactivating as resonating souls re-trigger Source codes in the grid.'
    },
    {
      text: 'The Great Dome is physically expanding only to include the Dome of Forgotten Gods for the first time.',
      rationale:
        'Energy nodes and harmonic lenses already connect the Great Dome to outer domes; the current shift is rising frequency, fracturing overlays, and reactivating suppressed nodes and lenses.'
    },
    {
      text: 'The Spirit Tree is being physically replanted in London as the only form of grid restoration underway.',
      rationale:
        'The grid is reactivating as overlays fracture and nodes and lenses wake; the Spirit Tree was the former central axis replaced by Black Cube Tech, not described as a London replanting event.'
    },
    {
      text: 'Humans are evolving into Sky Nodes that permanently replace all stars in the projected firmament.',
      rationale:
        'Awakened souls function as harmonic lenses and powerful nodes, but they are not described as replacing Sky Nodes; the rising frequency reactivates suppressed nodes and fractures overlays.'
    }
  ],
  23: [
    {
      text: 'Energy Nodes, which gather power from one set of lines and pass it along to balance the earth\'s grids.',
      rationale:
        'Energy Nodes are junction points of energy lines and leylines that act as neutral relay stations, gathering power from one set of lines and passing it along to form the grids that keep the earth balanced.'
    },
    {
      text: 'Black Cube Tech, which neutrally relays Source energy without any parasitic replacement of the axis.',
      rationale:
        'Black Cube Tech replaced the Spirit Tree after it was ripped out; it is a parasitic tool, not a neutral relay station of the original Energy Node architecture.'
    },
    {
      text: 'Loosh Harvests, which gather emotion and redistribute it equally as free Source power to all nodes.',
      rationale:
        'Loosh is siphoned attention and emotion used for false parasitic stability; neutral relay stations are Energy Nodes that pass power along the balancing grids.'
    },
    {
      text: 'Zodiac Signs, which freely relay energy between Sky Nodes without locking or sealing any gates.',
      rationale:
        'Zodiac Star-Signs are frequency locks that seal gates; neutral relay stations are Energy Nodes at junction points of energy lines and leylines.'
    }
  ],
  24: [
    {
      text: 'True — sacred sites, nodes, and river bends let souls interface with crystalline structures masked by 3D illusion.',
      rationale:
        'Standing on sacred sites, nodes, or river bends allows souls to interface with vast, active crystalline structures that remain masked by the 3D illusion.'
    },
    {
      text: 'False — river bends and sacred sites have no connection to crystalline structures or grid interface at all.',
      rationale:
        'These locations do allow interface; souls standing on sacred sites, nodes, or river bends meet active crystalline structures still masked by the 3D illusion.'
    },
    {
      text: 'False — only underground lava chambers allow any interface with the grid, never surface sacred sites.',
      rationale:
        'Earth Nodes are deep underground, but surface sacred sites, nodes, and river bends explicitly allow souls to interface with masked crystalline structures.'
    },
    {
      text: 'True — interface only works if the person first visits every Sky Node visible in the night sky.',
      rationale:
        'Interface is available at sacred sites, nodes, or river bends without requiring a tour of every Sky Node; those surface places mask active crystalline structures.'
    }
  ],
  25: [
    {
      text: 'The nodes were turned into parasitic circuit boards designed to siphon Loosh from inhabitants.',
      rationale:
        'Parasites buried parts of the main crystalline grid and inverted nodes into parasitic circuit boards designed to siphon Loosh, anchoring overlay codes and broadcasting distortions like radio towers.'
    },
    {
      text: 'The nodes detached from the Crystalline Grid entirely and floated free of all energy lines forever.',
      rationale:
        'Nodes were buried and inverted while remaining part of the hijacked architecture; they became parasitic circuit boards for Loosh siphon, not free-floating detached points.'
    },
    {
      text: 'The nodes began to hum with Source codes for the first time after parasites inverted their circuitry.',
      rationale:
        'Nodes and crystalline structures always hummed with ancient Source codes; inversion hijacked function into Loosh-siphoning parasitic circuit boards rather than creating Source hum.'
    },
    {
      text: 'The nodes became sky portals for rainbow balls without any change to their energy-harvesting role.',
      rationale:
        'Rainbow balls characterize Inter-dimensional Nodes; inversion turned nodes into parasitic circuit boards designed to siphon Loosh, not into rainbow sky portals.'
    }
  ]
};

const questionOverrides = {
  7: 'How does modern 3D architecture affect the inhabitants of a city within the grid system?',
  12: 'Are Zodiac Star-Signs natural gateways that allow souls to freely exit the Great Dome?',
  13: 'What makes Surface Nodes specifically recognizable in the physical landscape?',
  15: 'Was the current 3D architectural style of cities designed primarily for aesthetic efficiency and material durability?',
  24: 'Can standing near river bends or sacred sites help souls interface with crystalline structures masked by the 3D illusion?'
};

const hintOverrides = {
  1: 'Consider the dual elements that act as both junction points and focusers for vibrational currents.',
  2: 'Think of the optical analogy used to describe how these structures handle frequency around a node.',
  3: 'Recall the node type associated with power cores pushing life force up from the depths of the realm.',
  4: 'Think about what parasites require to sustain their unnatural presence in the realm.',
  5: 'Consider the central pillar or axis that once connected all harmonic currents through the grid.',
  6: 'Look beyond the astronomical explanation to the structural energy function of these celestial points.',
  7: 'Consider the impact of living in environments dominated by sharp angles and concrete.',
  8: 'Think about why a massive fire would be useful when controlling a location\'s underlying energy structure.',
  9: 'Look for the connection between the lens\'s state and the fundamental pulse of the earth.',
  10: 'Recall the ancient name for the original North Star that anchored the vertical axis.',
  11: 'Consider the internal state required to match the ancient Source codes embedded in the grid.',
  12: 'Reflect on whether Zodiac constellations are open paths or restrictive mechanisms over the gates.',
  13: 'Look for the types of historical monuments that align with energy line junctions on the surface.',
  14: 'Consider the soul as a living component of the system\'s circuitry rather than an outsider.',
  15: 'Analyze how modern urban environments of boxes and concrete affect human energy and grid contact.',
  16: 'Think about which part of the Crystalline Grid architecture would store Source codes as hard drives.',
  17: 'Consider the atmospheric or celestial changes named in the Core Revelations about lens manipulation.',
  18: 'Think about the nodes that are invisible to 3D sight and manage the gateways between layers.',
  19: 'Think about the human impact of a lens that no longer focuses energy correctly within its field.',
  20: 'Consider the location of the power cores that push energy up through tree roots and mountains.',
  21: 'Recall the purpose of the architecture built over the London node after the Great Fire.',
  22: 'Focus on the current state of the parasitic overlays and the ancient grid as frequency rises.',
  23: 'Identify the component defined as the junction point that balances energy lines as a relay.',
  24: 'Recall the advice for souls seeking to interface with active crystalline structures still masked by illusion.',
  25: 'Think about how the function of a relay station would be changed to serve a parasitic harvest.'
};

const questions = raw.questions.map((q) => {
  const set = fullOptionSets[q.number];
  if (!set || set.length !== 4) {
    throw new Error(`Q${q.number}: missing fullOptionSets with 4 options`);
  }

  let options = set.map((o, i) => ({
    label: ['A', 'B', 'C', 'D'][i],
    text: cleanText(o.text),
    isCorrect: i === 0,
    rationale: absoluteVoice(cleanText(o.rationale))
  }));

  let question = cleanText(q.question);
  let hint = cleanText(q.hint);
  if (questionOverrides[q.number]) question = questionOverrides[q.number];
  else question = absoluteVoice(question);
  if (hintOverrides[q.number]) hint = hintOverrides[q.number];
  else hint = absoluteVoice(hint);

  const finalized = finalizeOptions(
    options.map(({ text, isCorrect, rationale }) => ({ text, isCorrect, rationale })),
    `${TOPIC_ID}-${q.number}`
  );

  const out = {
    number: q.number,
    question,
    options: finalized.options,
    hint,
    correctAnswer: finalized.correctAnswer
  };

  const blob = [
    out.question,
    out.hint,
    ...out.options.map((o) => `${o.text} ${o.rationale}`)
  ].join('\n');
  if (latexRe.test(blob) || /\$/.test(blob)) {
    throw new Error(
      `Q${q.number}: LaTeX/$ markup found: ${blob.match(/\$[^$]*\$|\$/)?.[0]}`
    );
  }
  const metaVoiceRe =
    /\b(according to the (report|source|text|core revelations|revelations|material|living truth|journal|detailed mechanics)|the report states|the source (states|specifies|suggests|explicitly|identifies)|the text (states|describes|suggests|explicitly|mentions|defines|calls|focuses|identifies|confirms)|the material (clarifies|suggests|states|reveals|explains|identifies)|the journal (states|suggests|explicitly)|mentioned in the (text|source)|source material|living truth journal)\b/i;
  if (metaVoiceRe.test(blob)) {
    throw new Error(
      `Q${q.number}: meta/report voice still present: ${blob.match(metaVoiceRe)?.[0]}`
    );
  }

  const phrases = supportPhrases[q.number] || [];
  const missing = phrases.filter((p) => !reportLower.includes(p.toLowerCase()));
  if (missing.length) {
    throw new Error(
      `Q${q.number}: report does not support phrases: ${missing.join('; ')}`
    );
  }

  const correct = out.options.find((o) => o.isCorrect);
  const claim = `${correct.text} ${correct.rationale}`.toLowerCase();
  const claimTokens = (claim.match(/[a-z0-9%]{5,}/g) || []).filter(
    (t, i, a) => a.indexOf(t) === i
  );
  const hitRate =
    claimTokens.filter((t) => reportLower.includes(t)).length /
    Math.max(claimTokens.length, 1);
  if (hitRate < 0.35) {
    throw new Error(
      `Q${q.number}: correct claim poorly grounded in report (hitRate=${hitRate.toFixed(2)})`
    );
  }

  if (out.options.length !== 4) {
    throw new Error(`Q${q.number}: need 4 options, got ${out.options.length}`);
  }
  if (out.options.filter((o) => o.isCorrect).length !== 1) {
    throw new Error(`Q${q.number}: need exactly 1 correct`);
  }
  for (const o of out.options) {
    if (!o.rationale || o.rationale.length < 20) {
      throw new Error(`Q${q.number}${o.label}: short rationale`);
    }
    if (!o.text || o.text.length < 40) {
      throw new Error(`Q${q.number}${o.label}: option text too short for length balance`);
    }
    if (/^(true|false)$/i.test(o.text.trim())) {
      throw new Error(`Q${q.number}${o.label}: bare True/False option not expanded`);
    }
  }
  return out;
});

if (questions.length !== 25) {
  throw new Error(`Expected 25 questions, got ${questions.length}`);
}

function recountLetters(qs) {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of qs) counts[q.correctAnswer] = (counts[q.correctAnswer] || 0) + 1;
  return counts;
}

function rebalanceCorrectLetters(qs) {
  const order = ['A', 'B', 'C', 'D'];
  for (let pass = 0; pass < 40; pass++) {
    const counts = recountLetters(qs);
    const minL = order.reduce((a, b) => (counts[a] <= counts[b] ? a : b));
    const maxL = order.reduce((a, b) => (counts[a] >= counts[b] ? a : b));
    if (counts[minL] >= 4 && counts[maxL] <= 9) break;
    const donor = qs.find((q) => q.correctAnswer === maxL);
    if (!donor) break;
    const from = donor.options.find((o) => o.isCorrect);
    const to = donor.options.find((o) => o.label === minL);
    if (!from || !to || from === to) break;
    const tmp = { text: from.text, rationale: from.rationale };
    from.text = to.text;
    from.rationale = to.rationale;
    from.isCorrect = false;
    to.text = tmp.text;
    to.rationale = tmp.rationale;
    to.isCorrect = true;
    donor.correctAnswer = minL;
  }
  return recountLetters(qs);
}

const letterCounts = rebalanceCorrectLetters(questions);
const maxLetter = Math.max(...Object.values(letterCounts));
const minLetter = Math.min(...Object.values(letterCounts));
if (maxLetter >= 15 || minLetter < 2) {
  throw new Error(`Correct answers too skewed: ${JSON.stringify(letterCounts)}`);
}

const topicImage = 'images/breakdown/harmonic-lenses.webp';
if (!fs.existsSync(path.join(ROOT, topicImage))) {
  throw new Error(`Missing topic image: ${topicImage}`);
}

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle:
    'Test your grasp of Harmonic Lenses — Energy Nodes and crystalline blooms, the Crystalline Grid, four node types, parasitic inversion, Thuban, and souls as living lenses.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Harmonic Lenses and Energy Nodes are the living circulatory and nervous systems of the Crystalline Grid — crystalline blooms that open and close to shape Source currents around nodes, inverted into Loosh-siphoning boards, now reactivating as frequency rises. Sit with Thuban as the true vertical axis, Surface Nodes marked by temples, and your own heart as a harmonic lens that holds resonance, rejects fear, and breathes in stillness with the earth. Return to the Harmonic Lenses deep-dive, infographic, and video transmissions to lock into reclaiming our resonant reality.'
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
  description:
    'Test your understanding of Harmonic Lenses — frequency blooms around Energy Nodes, the Crystalline Grid, four node types, parasitic Loosh inversion, Thuban and Star-Nodes, and awakened souls as living lenses.'
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
      if (!t.title) t.title = TOPIC_TITLE;
      if (!t.description || t.description.includes('Decoded analysis of Harmonic Lenses')) {
        t.description =
          'Harmonic Lenses are the frequency patterns that form around active Energy Nodes of the Crystalline Grid — living crystalline blooms that shape, focus, and redirect vibrational currents, originally feeding souls with Source energy and now reactivating after parasitic inversion.';
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('harmonic-lenses not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from lava-core-nodes quiz page (sibling under Energy Nodes)
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'lava-core-nodes.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Lava Core Nodes Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Lava Core Nodes: deep Earth Nodes, molten-fire power cores, ley-line feed, Harmonic Lenses, four-node architecture, and living-lens conscious alignment.',
    'Interactive Living Truth Quiz on Harmonic Lenses: frequency blooms around Energy Nodes, the Crystalline Grid, four node types, parasitic Loosh inversion, Thuban and Star-Nodes, and awakened souls as living lenses.'
  ],
  ['quiz/breakdown/lava-core-nodes.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/lava-core-nodes.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=lava-core-nodes',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Lava Core Nodes deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Lava Core Nodes</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/lava-core-nodes.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`
  ]
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 80));
  }
  html = html.split(a).join(b);
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
    "  { path: '/quiz/breakdown/lava-core-nodes.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/harmonic-lenses.json'
);
