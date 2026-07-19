/**
 * Installs Energy Nodes quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/crystalline-quiz.json
 * Audits all 25 items against data/breakdown-topics/energy-nodes.json.
 * Run: node scripts/install-energy-nodes-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/energy-nodes.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'energy-nodes';
const TOPIC_TITLE = 'Energy Nodes';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/crystalline-quiz.json';

const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

/** Support phrases grounded only in energy-nodes.json report. */
const supportPhrases = {
  1: ['relay stations', 'junction points', 'life-force'],
  2: ['spirit tree', 'central node', 'known lands', 'hyperborea'],
  3: ['harmonic lenses', 'shape', 'focus', 'tuned current'],
  4: ['earth nodes', 'deep underground', 'plasma', 'crystalline veins'],
  5: ['sky nodes', 'stars', 'northern lights'],
  6: ['clouded', 'energetic draining', 'confusion'],
  7: ['custodians', 'spirit tree', 'black cube tech'],
  8: ['crystals', 'hard drives', 'memory', 'resonance codes'],
  9: ['axis labernum', 'heavens', 'earth'],
  10: ['thuban', 'aru-el-nai', 'polaris'],
  11: ['inter-dimensional', 'stabilization', 'overlay'],
  12: ['physical travel', 'distance', 'obsolete'],
  13: ['star portals', 'zodiac signs'],
  14: ['surface nodes', 'loosh', 'suppress'],
  15: ['resonating sols', 'harmonic lens', 'human heart'],
  16: ['3d architecture', 'dissolve', 'frequency'],
  17: ['black crystalline monoliths', 'valve locks'],
  18: ['inter-dimensional', 'rainbow', 'liquid silver'],
  19: ['star-nodes', 'open gates'],
  20: ['living light structures', 'fibre optic'],
  21: ['crystalline grid', 'electro-magnetic framework'],
  22: ['surface nodes', 'temples', 'pyramids', 'stone circles'],
  23: ['saturnian lunar valve', 'reincarnation'],
  24: ['surface', 'blue or white'],
  25: ['tartarian grid', 'cities', 'seas', 'deserts']
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
    [/^According to the (core revelations|source|report|text|revelations|material),?\s*/i, ''],
    [/^According to the report,?\s*/i, ''],
    [/^According to the text,?\s*/i, ''],
    [/^According to the material,?\s*/i, ''],
    [/\baccording to the (report|source|text|core revelations|revelations|material)\b/gi, ''],
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
    [/\bare described as\b/gi, 'are']
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
 * All four options written at similar depth from energy-nodes report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'They act as critical relay stations and junction points where life-force, magnetism, and frequency currents intersect.',
      rationale:
        'Energy Nodes are the critical relay stations and junction points where invisible currents of life-force, magnetism, and frequency intersect across the Crystalline Grid.'
    },
    {
      text: 'They serve as solid physical borders that permanently wall off one simulation realm from every neighboring dome.',
      rationale:
        'Nodes link realms through living light structures as energy relays; they are not simple physical walls between simulations.'
    },
    {
      text: 'They generate ordinary metropolitan electricity that powers modern city grids and industrial manufacturing plants.',
      rationale:
        'Nodes handle etheric life-force and frequency currents, not artificial metropolitan electricity systems.'
    },
    {
      text: 'They are the exclusive source of all light in the etheric realms, with no current flowing from Source beyond them.',
      rationale:
        'Nodes gather and pass energy streams; light and power move through the whole grid rather than originating only at nodes.'
    }
  ],
  2: [
    {
      text: 'The Spirit Tree — the central node and main axis of consciousness for the Known Lands, rooted in Hyperborea.',
      rationale:
        'The Spirit Tree is the central node and main axis of consciousness for the Known Lands; rooted in Hyperborea, it fed all seven outer domes with Source Light.'
    },
    {
      text: 'The Tartarian Grid — the original surface network that alone served as the axis of consciousness for every dome.',
      rationale:
        'The Tartarian Grid was part of the original architecture later buried under cities; the central axis of consciousness is the Spirit Tree.'
    },
    {
      text: 'Thuban — the North-Central alignment node that also functions as the trunk feeding all seven outer domes.',
      rationale:
        'Thuban (Aru-el-nai) is the true North-Central alignment node in the sky; the central consciousness axis is the Spirit Tree.'
    },
    {
      text: 'Axis Labernum — the horizontal leyline belt that stores all memory of the Known Lands without a central trunk.',
      rationale:
        'Axis Labernum is the vertical harmonic bridge keeping heavens aligned with earth; the central node of consciousness is the Spirit Tree.'
    }
  ],
  3: [
    {
      text: 'To shape and focus raw node power into a tuned current, like a glass lens shaping light around active nodes.',
      rationale:
        'Harmonic Lenses form around active nodes to shape and focus energy like a glass lens shapes light, tuning raw power into a current in rhythm with sun, moon, and stars.'
    },
    {
      text: 'To store holographic memories of previous incarnations as the primary hard drives of soul timelines.',
      rationale:
        'Memory storage is the role of crystals as physical and etheric hard drives; lenses shape and focus active energy.'
    },
    {
      text: 'To rotate the entire holographic dome projection so Polaris permanently replaces Thuban as true north.',
      rationale:
        'Projection-dome rotation toward Polaris was a parasitic engineering act; Harmonic Lenses tune node energy, not sky rotation.'
    },
    {
      text: 'To physically block all parasitic signals from entering the earth by sealing every leyline at the surface.',
      rationale:
        'Lenses open and close with celestial frequencies to tune node flow; they are sensing and balancing eyes, not solid signal walls.'
    }
  ],
  4: [
    {
      text: 'Deep underground where the earth\'s plasma and crystalline veins meet as molten-fire spheres of red-gold light.',
      rationale:
        'Earth Nodes (Lava/Core Nodes) are spheres of molten-fire energy deep underground where plasma and crystalline veins meet, pulsing red-gold or orange light.'
    },
    {
      text: 'At the highest peaks of the atmospheric domes where they appear as bright stars and Northern Lights pulses.',
      rationale:
        'Atmospheric projected points that appear as stars or Northern Lights are Sky Nodes, not deep Earth Nodes.'
    },
    {
      text: 'Only inside the roots of sacred mountain ranges on the surface, with no deeper plasma-core location.',
      rationale:
        'Earth Nodes push life force up through mountain ranges and tree roots, but the nodes themselves sit deep underground at plasma-crystal junctions.'
    },
    {
      text: 'In the center of every ancient stone circle, temple, and pyramid as the sole surface-only core power site.',
      rationale:
        'Ancient temples, pyramids, and stone circles mark Surface Nodes where energy lines cross, not deep Lava/Core Earth Nodes.'
    }
  ],
  5: [
    {
      text: 'Sky Nodes (Celestial Nodes) — projected points anchoring overlay grids as bright stars or Northern Lights pulses.',
      rationale:
        'Sky Nodes appear as bright stars or the shimmering pulse of the Northern Lights and form a two-way relay with ground nodes.'
    },
    {
      text: 'Surface Nodes (Harmonic Nodes) — ground crossings under temples and pyramids that hum in blue or white tones.',
      rationale:
        'Surface Nodes sit where energy lines cross on the ground under temples, pyramids, or stone circles, not as stars in the sky.'
    },
    {
      text: 'Inter-dimensional Nodes — high-frequency spheres that only ever appear as solid molten-fire red-gold cores.',
      rationale:
        'Inter-dimensional Nodes manifest as rainbow balls, gold lattices, or liquid silver orbs and are often invisible to standard 3D perception.'
    },
    {
      text: 'Earth Nodes (Lava/Core Nodes) — deep molten spheres that project themselves into the sky as visible starfields.',
      rationale:
        'Earth Nodes sit deep underground as molten-fire power cores; the sky appearance of stars and Northern Lights belongs to Sky Nodes.'
    }
  ],
  6: [
    {
      text: 'Energetic draining and confusion for those in the vicinity when the lens fails to hold a clear tuned current.',
      rationale:
        'When a Harmonic Lens is clouded, it induces energetic draining and confusion instead of perfect rhythm with the realm\'s heartbeat.'
    },
    {
      text: 'The immediate total fracture of the entire holographic dome from a single clouded surface lens alone.',
      rationale:
        'Overlay fracturing is linked to unstabilized inter-dimensional portals and rising frequency shifts; clouding induces draining and confusion.'
    },
    {
      text: 'A total reversal of the planetary magnetic poles that permanently flips every Earth Node\'s red-gold pulse.',
      rationale:
        'Lens clouding disrupts local tuned current and induces draining and confusion; it is not described as planetary pole reversal.'
    },
    {
      text: 'The physical disappearance of all Surface Nodes so no temple or stone circle can mark a crossing again.',
      rationale:
        'The node remains; clouding changes the quality of energy through the lens rather than erasing Surface Nodes from the landscape.'
    }
  ],
  7: [
    {
      text: 'By violently uprooting the Spirit Tree and installing advanced Black Cube Tech into the wound.',
      rationale:
        'Custodians and engineered proxies uprooted the Spirit Tree and installed Black Cube Tech, inverting natural energy flow into an extraction circuit board.'
    },
    {
      text: 'By physically removing every crystal from the Earth\'s core so no hard drive of memory could remain.',
      rationale:
        'Parasites repurposed grids, buried Tartarian portions, and installed Black Cube Tech; they did not empty the core of all crystals.'
    },
    {
      text: 'By shifting the earth\'s physical orbit away from the sun to starve Sky Nodes of all celestial light.',
      rationale:
        'The hijack inverted internal grid flow and celestial overlays; it is not described as changing physical orbital mechanics.'
    },
    {
      text: 'By creating entirely new Star-Nodes that permanently replaced every original living celestial gate.',
      rationale:
        'They sealed and masked existing star portals and rotated the projection toward Polaris rather than inventing a wholly new star system.'
    }
  ],
  8: [
    {
      text: 'Crystals are the physical and etheric hard drives and antennas that store memory, frequency, and resonance codes.',
      rationale:
        'Crystals function as physical and etheric hard drives of the network, storing memory, frequency, and resonance codes as antennas of unbroken soul timelines.'
    },
    {
      text: 'Crystals are the only structures that can reflect Sky Nodes and therefore replace every other relay on the grid.',
      rationale:
        'Crystals store codes and act as antennas within a wider node network; they are not the sole sky-reflection hardware of the grid.'
    },
    {
      text: 'Crystals were first created by Custodians solely as surveillance tools to monitor human emotional output.',
      rationale:
        'Crystals belong to the original architecture as hard drives of memory and resonance; Custodians suppressed and hijacked grids rather than originating crystals.'
    },
    {
      text: 'Crystals act only as consumable fuel that nodes permanently burn away each time life-force is relayed.',
      rationale:
        'Crystals are stable storage units and antennas for memory and codes, not a fuel that nodes consume to run relays.'
    }
  ],
  9: [
    {
      text: 'Axis Labernum — the harmonic bridge and vertical current of order aligning the heavens with the earth.',
      rationale:
        'Axis Labernum is the harmonic bridge and vertical current of order that runs through the worlds, keeping the heavens aligned with the earth.'
    },
    {
      text: 'The Crystalline Grid alone — the full electro-magnetic framework without any distinct vertical alignment current.',
      rationale:
        'The Crystalline Grid is the whole framework of living light lines; the specific vertical current of order is Axis Labernum.'
    },
    {
      text: 'Aru-el-nai itself as a horizontal surface leyline belt rather than a named North-Central sky alignment node.',
      rationale:
        'Aru-el-nai is the name of Thuban, the true North-Central alignment node; the vertical current of order is Axis Labernum.'
    },
    {
      text: 'Ordinary leylines running only sideways between temples, with no vertical bridge between heavens and earth.',
      rationale:
        'Leylines and energy lines form the circuits nodes gather and pass; Axis Labernum is the vertical harmonic bridge of order.'
    }
  ],
  10: [
    {
      text: 'Thuban (Aru-el-nai) — the true North-Central alignment node masked when the projection dome was rotated to Polaris.',
      rationale:
        'The true North-Central alignment node, Thuban (Aru-el-nai), was masked by rotating the projection dome to point toward Polaris.'
    },
    {
      text: 'Saturn — treated as the sole North-Central sky anchor instead of any living star-node of alignment.',
      rationale:
        'The Saturnian lunar valve anchors a counterfeit reincarnation cycle; the true North-Central alignment node is Thuban.'
    },
    {
      text: 'The Sun — described as the permanent navigation pole that never required masking or dome rotation.',
      rationale:
        'Sun, moon, and star frequencies open and close Harmonic Lenses; the masked North-Central alignment node is Thuban.'
    },
    {
      text: 'Polaris — the original organic North-Central node that parasites later tried to hide behind Thuban.',
      rationale:
        'Polaris is the parasitic navigation target after dome rotation; Thuban (Aru-el-nai) is the true North-Central alignment node.'
    }
  ],
  11: [
    {
      text: 'Stabilization — so high-frequency portal spheres do not let the overlay fracture between layers.',
      rationale:
        'Inter-dimensional Nodes hold portals between overlays and require stabilization to prevent the overlay from fracturing.'
    },
    {
      text: 'Visible light markers painted on the ground so standard 3D eyes can always locate every portal sphere.',
      rationale:
        'Inter-dimensional Nodes are often invisible to standard 3D perception; what they require is stabilization, not visible markers.'
    },
    {
      text: 'Constant physical movement of the spheres so portals never rest long enough to become rainbow orbs.',
      rationale:
        'These are anchored high-frequency junction spheres; the report names stabilization, not perpetual physical motion, as the need.'
    },
    {
      text: 'Manual cooling systems that treat portal spheres as heat engines rather than frequency light-grid anchors.',
      rationale:
        'Inter-dimensional Nodes are frequency structures manifesting as rainbow, gold, or silver orbs; they require stabilization, not mechanical cooling.'
    }
  ],
  12: [
    {
      text: 'True — the grid is a conscious photon web that transmits data, memory, and frequency instantly, making physical travel and distance obsolete.',
      rationale:
        'The entire grid is a conscious communication network of moving photons that transmits data, memory, and frequency instantly across all realms, rendering physical travel and distance obsolete.'
    },
    {
      text: 'False — physical miles and slow travel remain the only real way to move anything between domes and realms.',
      rationale:
        'Instant photon transmission across realms makes physical distance obsolete; travel concepts based on miles no longer hold as ultimate reality.'
    },
    {
      text: 'True — but only for Surface Nodes; Sky and Earth Nodes still require multi-year physical caravans between sites.',
      rationale:
        'The obsolescence of physical travel and distance applies to the entire conscious grid network, not only one node type.'
    },
    {
      text: 'False — the photon web only stores memories and never transmits frequency or data across realms at all.',
      rationale:
        'The grid transmits data, memory, and frequency instantly as a web of moving photons; it is not a memory-only archive without transmission.'
    }
  ],
  13: [
    {
      text: 'They were sealed with negative frequency broadcasts and transformed into locked "zodiac signs."',
      rationale:
        'Ancient star portals were sealed using negative frequency broadcasts, transforming living gates into locked zodiac signs.'
    },
    {
      text: 'They were relocated entirely into Earth Node cores so no celestial gate remained in the sky overlay.',
      rationale:
        'Star portals stayed celestial but were sealed into locked zodiac signs; they were not moved into underground Earth Nodes.'
    },
    {
      text: 'They were replaced by surface black monoliths that became the only remaining form of star portal.',
      rationale:
        'Black crystalline monoliths became valve locks for false frequency; the portals themselves were sealed as zodiac signs in the celestial grid.'
    },
    {
      text: 'They were completely deleted from the holographic sky so no star geometry remained for any soul to see.',
      rationale:
        'Portals were not deleted; they were sealed and repurposed as locked zodiac signs rather than erased from the sky.'
    }
  ],
  14: [
    {
      text: 'To suppress Surface Node output and harvest human emotion as "loosh" under dead-frequency 3D architecture.',
      rationale:
        'Modern dead-frequency 3D architecture was built over the most powerful Surface Nodes to suppress their output and harvest human emotion as loosh.'
    },
    {
      text: 'To protect humans from intense natural radiation that Surface Nodes would otherwise pour into every city.',
      rationale:
        'Surface Nodes amplify life-force frequency; placement of modern architecture is parasitic suppression and loosh harvest, not human protection.'
    },
    {
      text: 'To use pure node power for benevolent industrial manufacturing without any emotional extraction agenda.',
      rationale:
        'The hijack inverted flow for extraction and buried nodes under dead-frequency cities; the intent is loosh harvest, not free industrial power.'
    },
    {
      text: 'Because node sites alone provide the most stable soil for concrete and heavy modern construction crews.',
      rationale:
        'Placement is strategic grid control — suppress powerful Surface Nodes and harvest loosh — not ordinary geological preference for soil stability.'
    }
  ],
  15: [
    {
      text: 'An awakened soul who is a powerful node; the human heart becomes a Harmonic Lens relaying pure light.',
      rationale:
        'Resonating Sols are powerful nodes within the grid; by holding harmony, the human heart becomes a Harmonic Lens healing, balancing, and relaying pure light.'
    },
    {
      text: 'The original name for the Spirit Tree\'s core trunk before it was rooted in Hyperborea\'s central axis.',
      rationale:
        'The Spirit Tree is the central node and axis of consciousness; Resonating Sols are awakened souls acting as living nodes and lenses.'
    },
    {
      text: 'A specific high-frequency crystal type found only in Hyperborea and never embodied in human hearts.',
      rationale:
        'Crystals are hard drives of memory and codes; Resonating Sols are awakened beings whose hearts become Harmonic Lenses.'
    },
    {
      text: 'A solar flare pattern that alone recalibrates Sky Nodes without any role for human consciousness.',
      rationale:
        'Celestial frequencies open and close lenses; Resonating Sols specifically name awakened souls as powerful nodes in the grid.'
    }
  ],
  16: [
    {
      text: 'True — as frequency rises, false holographic projections fracture and modern 3D architecture dissolves while crystalline structures bleed through.',
      rationale:
        'As frequency rises, false holographic projections glitch and fracture; modern 3D architecture will dissolve and original humming crystalline structures will bleed into visible reality.'
    },
    {
      text: 'False — modern 3D architecture is permanent scaffolding that will only thicken as realm frequency continues to rise.',
      rationale:
        'Rising frequency dissolves dead-frequency 3D architecture rather than locking it in as permanent denser scaffolding.'
    },
    {
      text: 'True — but only underground Earth Nodes dissolve; surface cities and temples remain unchanged forever.',
      rationale:
        'Modern 3D architecture dissolves while original crystalline structures under the earth bleed through into visibility — not Earth Nodes alone.'
    },
    {
      text: 'False — holographic projections strengthen into solid concrete as Resonating Sols raise the planetary frequency.',
      rationale:
        'Rising resonance causes false projections to glitch and fracture, not harden into permanent concrete overlays.'
    }
  ],
  17: [
    {
      text: 'As valve locks holding the false frequency in place for a counterfeit reincarnation cycle with the Saturnian lunar valve.',
      rationale:
        'Massive black crystalline monoliths, once tools of creation, were repurposed as valve locks to hold false frequency and establish a counterfeit reincarnation cycle connected to the Saturnian lunar valve.'
    },
    {
      text: 'As living anchors that regrow the Spirit Tree\'s roots after Custodians tried to uproot the Hyperborean trunk.',
      rationale:
        'The Spirit Tree was uprooted and Black Cube Tech installed; black monoliths lock false frequency rather than regrow the tree.'
    },
    {
      text: 'As physical pillars that alone hold up the atmospheric dome without any frequency-lock function.',
      rationale:
        'Monoliths are frequency valve locks; structural heavenly-earth order is the Axis Labernum, not black monolith pillars.'
    },
    {
      text: 'As ordinary communication towers for human cities that never touch reincarnation or false-frequency control.',
      rationale:
        'They function as valve locks for the parasitic false frequency and counterfeit reincarnation cycle, not standard city telecom towers.'
    }
  ],
  18: [
    {
      text: 'False — Inter-dimensional Nodes appear as rainbow balls, gold lattices, or liquid silver orbs; molten red-gold fire spheres are Earth Nodes.',
      rationale:
        'Inter-dimensional Nodes manifest as rainbow balls, gold lattices, or liquid silver orbs; spheres of molten-fire red-gold or orange light are Earth Nodes.'
    },
    {
      text: 'True — Inter-dimensional Nodes are exactly the same molten-fire red-gold spheres as deep Lava/Core Earth Nodes.',
      rationale:
        'Molten-fire red-gold spheres define Earth Nodes; Inter-dimensional Nodes show rainbow, gold-lattice, or liquid-silver signatures.'
    },
    {
      text: 'False — Inter-dimensional Nodes only hum in blue or white tones under temples and never appear as orbs at all.',
      rationale:
        'Blue or white humming marks Surface Nodes; Inter-dimensional Nodes are high-frequency spheres such as rainbow or silver orbs.'
    },
    {
      text: 'True — every Inter-dimensional Node is a visible Northern Lights pulse anchoring the sky overlay grid.',
      rationale:
        'Northern Lights and star-like pulses describe Sky Nodes; Inter-dimensional Nodes are portal spheres often invisible to standard 3D sight.'
    }
  ],
  19: [
    {
      text: 'They shed their locks and transition back into open gates, restoring Axis Labernum and harmonic bridges.',
      rationale:
        'Sealed Star-Nodes shed their locks and transition back into open gates, restoring the Axis Labernum and reopening harmonic bridges to higher domes.'
    },
    {
      text: 'They are being permanently redirected to point only toward Polaris as the final true navigation pole.',
      rationale:
        'Polaris masking was the parasitic navigation hijack; dismantling restores open gates rather than locking Polaris forever.'
    },
    {
      text: 'They explode to wipe the holographic sky clean so no star geometry or Star-Node can ever return.',
      rationale:
        'The process is shedding locks and reopening gates, not explosive deletion of the celestial grid.'
    },
    {
      text: 'They become permanently invisible to every soul and lose all function as portals or alignment nodes.',
      rationale:
        'Star-Nodes are becoming open gates again and restoring bridges; they are not vanishing into permanent useless invisibility.'
    }
  ],
  20: [
    {
      text: 'Living light structures — the fibre optic lines of Source that compose the huge electro-magnetic Crystalline Grid.',
      rationale:
        'The Crystalline Grid is composed of living light structures and fibre optic lines of Source connecting all domes, realms, and simulations.'
    },
    {
      text: 'Hyperborean wood alone — the only material that can carry Source current between outer domes after the tree fell.',
      rationale:
        'The Spirit Tree was rooted in Hyperborea as central trunk; the fibre optic lines of Source are living light structures of the grid.'
    },
    {
      text: 'Molten-fire currents exclusively — the same red-gold plasma used as the only wiring between every node type.',
      rationale:
        'Molten-fire energy characterizes Earth Nodes; the grid\'s fibre optic lines of Source are living light structures.'
    },
    {
      text: 'Liquid silver plasma only — reserved for Surface Nodes under pyramids and never for inter-dome Source lines.',
      rationale:
        'Liquid silver orbs relate to Inter-dimensional Node appearances; Source fibre-optic lines are living light structures of the Crystalline Grid.'
    }
  ],
  21: [
    {
      text: 'A massive electro-magnetic framework of living light structures connecting all domes, realms, and simulations.',
      rationale:
        'The Crystalline Grid is one huge electro-magnetic framework of living light structures and fibre optic lines of Source connecting all domes, realms, and simulations.'
    },
    {
      text: 'A network of modern satellites launched solely to monitor frequency and harvest loosh from Surface Nodes.',
      rationale:
        'The Crystalline Grid is a living multidimensional electro-magnetic framework, not a modern satellite monitoring system.'
    },
    {
      text: 'A simple collection of inert mineral deposits in the crust with no electro-magnetic or inter-dome function.',
      rationale:
        'It is an electro-magnetic living-light framework linking realms, not merely passive mineral deposits in rock.'
    },
    {
      text: 'Only the solid outer wall of the holographic dome, without nodes, lines, or inter-realm connection paths.',
      rationale:
        'The grid is an interwoven network of nodes, lines, and living light that sustains creation — not merely a solid dome wall.'
    }
  ],
  22: [
    {
      text: 'True — Surface Nodes sit where energy lines cross and are often marked by ancient temples, pyramids, or stone circles.',
      rationale:
        'Surface Nodes reside where energy lines cross on the surface, often marked by ancient temples, pyramids, or stone circles, and amplify the frequency of those standing upon them.'
    },
    {
      text: 'False — Surface Nodes exist only deep underground as molten red-gold cores with no surface markers at all.',
      rationale:
        'Deep molten red-gold cores are Earth Nodes; Surface Nodes are surface crossings marked by temples, pyramids, or stone circles.'
    },
    {
      text: 'True — but only modern skyscrapers mark Surface Nodes; ancient temples never sit on energy-line crossings.',
      rationale:
        'Ancient temples, pyramids, and stone circles are the named surface markers of Surface Nodes, not modern skyscrapers alone.'
    },
    {
      text: 'False — Surface Nodes appear only as Northern Lights in the sky and never as ground sites people can stand on.',
      rationale:
        'Northern Lights pulses are Sky Node appearances; Surface Nodes are ground crossings people can stand upon at ancient sites.'
    }
  ],
  23: [
    {
      text: 'The Saturnian lunar valve — linked through black crystalline monolith valve locks holding false frequency in place.',
      rationale:
        'Black crystalline monoliths hold false frequency in place and establish a counterfeit reincarnation cycle connected to the Saturnian lunar valve.'
    },
    {
      text: 'Hyperborea — treated as the exclusive factory of counterfeit reincarnation rather than the Spirit Tree\'s root land.',
      rationale:
        'Hyperborea rooted the original Spirit Tree that fed the domes; the counterfeit reincarnation cycle ties to the Saturnian lunar valve.'
    },
    {
      text: 'The Spirit Tree — still running the counterfeit loop even after feeding seven outer domes with Source Light.',
      rationale:
        'The Spirit Tree is original organic architecture of Source Light; counterfeit reincarnation connects to the Saturnian lunar valve after the hijack.'
    },
    {
      text: 'The Axis Labernum — miscast as a reincarnation trap rather than the vertical current of heavenly-earth order.',
      rationale:
        'Axis Labernum keeps heavens aligned with earth as a harmonic bridge; the counterfeit reincarnation cycle connects to the Saturnian lunar valve.'
    }
  ],
  24: [
    {
      text: 'Humming in blue or white tones at surface energy-line crossings under temples, pyramids, or stone circles.',
      rationale:
        'Surface Nodes (Harmonic Nodes) hum in blue or white tones where energy lines cross, often at ancient temples, pyramids, or stone circles.'
    },
    {
      text: 'Shimmering like the Northern Lights as projected celestial pulses anchoring atmospheric overlay grids.',
      rationale:
        'Northern Lights shimmer describes Sky Nodes; Surface Nodes hum in blue or white tones on the ground.'
    },
    {
      text: 'Appearing as liquid silver orbs or gold lattices that hold portals between different overlay layers.',
      rationale:
        'Liquid silver orbs and gold lattices describe Inter-dimensional Nodes, not Surface Node blue/white humming.'
    },
    {
      text: 'Pulsing with red-gold or orange molten-fire light deep where plasma meets crystalline veins.',
      rationale:
        'Red-gold or orange molten-fire pulsing defines Earth Nodes underground, not Surface Node blue or white tones.'
    }
  ],
  25: [
    {
      text: 'True — major portions of the original Tartarian Grid were buried under cities, seas, and deserts under parasitic hijack.',
      rationale:
        'Parasitic forces buried major portions of the original Tartarian Grid under cities, seas, and deserts, building dead-frequency 3D architecture over powerful Surface Nodes.'
    },
    {
      text: 'False — the Tartarian Grid remains fully exposed on the surface with no burial under modern cities or seas.',
      rationale:
        'Major portions of the original Tartarian Grid were buried under cities, seas, and deserts as part of the hijack.'
    },
    {
      text: 'True — but only the Spirit Tree trunk was buried; the Tartarian Grid was left completely intact aboveground.',
      rationale:
        'The Spirit Tree was uprooted; separately, major Tartarian Grid portions were buried under cities, seas, and deserts.'
    },
    {
      text: 'False — Custodians elevated the Tartarian Grid into the sky as locked zodiac signs rather than burying it.',
      rationale:
        'Zodiac locking sealed ancient star portals; the Tartarian Grid itself was buried under cities, seas, and deserts.'
    }
  ]
};

const questionOverrides = {
  2: 'Which structure is the central node and main axis of consciousness for the Known Lands?',
  10: 'Which celestial body is the true North-Central alignment node, also called Aru-el-nai?',
  12: 'Are physical travel and distance rendered obsolete by the nature of the photon communication web?',
  14: 'Why were modern 3D cities built over powerful Surface Nodes?',
  16: 'Is modern 3D architecture expected to dissolve as the frequency of the realm continues to rise?',
  18: 'Do Inter-dimensional Nodes manifest as spheres of molten-fire energy pulsing with red-gold light?',
  22: 'Are Surface Nodes often marked by ancient temples, pyramids, or stone circles?',
  25: 'Is the original Tartarian Grid largely buried under modern cities, seas, and deserts?'
};

const hintOverrides = {
  1: 'Consider how energy moves from one circuit to another across a living network.',
  2: 'This central trunk was rooted in Hyperborea and fed the outer domes.',
  3: 'Think about how a glass lens interacts with a beam of light around a node.',
  10: 'This node was masked by rotating the sky projection toward the North Star.',
  12: 'Think about an instantaneous conscious communication network of moving photons.',
  14: 'Consider the goal of Custodians and their engineered proxies over Surface Nodes.',
  16: 'Consider rising frequency effects on dead-frequency structures and false projections.',
  18: 'Compare Earth Node molten-fire signatures with Light Grid Anchor appearances.',
  22: 'These locations sit where energy lines cross on the surface.',
  25: 'Consider the fate of ancient grid infrastructure after the parasitic hijack.'
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
    /\b(according to the (report|source|text|core revelations|revelations|material|living truth)|the report states|the source (states|specifies|suggests|explicitly|identifies)|the text (states|describes|suggests|explicitly|mentions|defines|calls|focuses|identifies|confirms)|the material (clarifies|suggests)|mentioned in the (text|source)|source material|living truth journal)\b/i;
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

const topicImage = 'images/breakdown/energy-nodes.webp';
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
    'Test your grasp of Energy Nodes — Crystalline Grid relays, four node types, Harmonic Lenses, Spirit Tree hijack, and the restoration of Star-Node gates.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Energy Nodes are living relay stations of the Crystalline Grid — Earth, Surface, Sky, and Inter-dimensional junctions that gather and pass life-force across realms. Sit with Harmonic Lenses as the eyes that tune current, crystals as hard drives of soul memory, and Resonating Sols as hearts that become lenses of pure light. The Spirit Tree was uprooted and Black Cube Tech installed, yet sealed Star-Nodes are shedding locks and Axis Labernum is restoring. Return to the Energy Nodes deep-dive, infographic, and video transmissions to lock into the luminous architecture bleeding through the overlay.'
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
    'Test your understanding of Energy Nodes — Crystalline Grid relays, four node types, Harmonic Lenses, Spirit Tree hijack, Star-Node restoration, and Resonating Sols as living lenses.'
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
      if (!t.description || t.description.includes('Decoded analysis of Energy Nodes')) {
        t.description =
          'Energy Nodes are the critical relay stations of the Crystalline Grid — Earth, Surface, Sky, and Inter-dimensional junctions that gather and pass life-force across realms, now restoring after parasitic hijack of the original Tartarian network.';
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('energy-nodes not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from grid-systems quiz page (same transmission shell)
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'grid-systems.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Grid Systems Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Grid Systems: Crystalline Electro-Magnetic Framework, Nodes, Crystals, Ley-lines, Seven Overlay-Bands, and the recalibration into a planetary Crystalline Temple.',
    'Interactive Living Truth Quiz on Energy Nodes: Crystalline Grid relays, four node types, Harmonic Lenses, Spirit Tree hijack, Star-Node restoration, and Resonating Sols as living lenses.'
  ],
  ['quiz/breakdown/grid-systems.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/grid-systems.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=grid-systems',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Grid Systems deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Grid Systems</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/grid-systems.json',
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
    "  { path: '/quiz/breakdown/grid-systems.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/energy-nodes.json'
);
