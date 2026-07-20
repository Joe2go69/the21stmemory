/**
 * Installs Lava Core Nodes quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/node-quiz.json
 * Audits all 25 items against data/breakdown-topics/lava-core-nodes.json.
 * Run: node scripts/install-lava-core-nodes-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/lava-core-nodes.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'lava-core-nodes';
const TOPIC_TITLE = 'Lava Core Nodes';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/node-quiz.json';

const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

/** Support phrases grounded only in lava-core-nodes.json report. */
const supportPhrases = {
  1: ['foundational engines', 'power cores', 'fiery base'],
  2: ['red-gold', 'orange', 'molten'],
  3: ['harmonic lenses', 'shape', 'glass lens'],
  4: ['plasma', 'crystalline veins', 'deep'],
  5: ['ley-lines', 'life-force', 'mountains'],
  6: ['sky nodes', 'overlay', 'anchor'],
  7: ['blockage', 'stumble', 'imbalance'],
  8: ['temples', 'stone circles', 'pyramids'],
  9: ['living lenses', 'stillness', 'blockages'],
  10: ['inter-dimensional', 'invisible', 'portals'],
  11: ['push', 'upward', 'upper grid'],
  12: ['heart or brain', 'crystalline web', 'circuits'],
  13: ['fiery heart below', 'crystalline mind above', 'harmonic spirit'],
  14: ['neutral relay', 'gathering power', 'passing'],
  15: ['blue or white', 'surface nodes', 'humming'],
  16: ['raw transmission power', 'surface nodes', 'sky nodes'],
  17: ['air feel lighter', 'thoughts become calm'],
  18: ['earth nodes', 'surface nodes', 'sky nodes', 'inter-dimensional'],
  19: ['pattern of frequency', 'harmonic lenses', 'heartbeat'],
  20: ['plasma', 'crystalline veins', 'earth nodes'],
  21: ['interconnected nodes', 'energy lines', 'balances the earth'],
  22: ['conscious alignment', 'heals', 'harmony'],
  23: ['harmonic lenses', 'rhythm', 'heartbeat'],
  24: ['ley-lines', 'tree-roots', 'rivers'],
  25: ['inter-dimensional', 'invisible', 'high-frequency']
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
 * All four options written at similar depth from lava-core-nodes report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'They act as the foundational engines and molten-fire power cores that sustain the entire realm.',
      rationale:
        'Lava/Core Nodes are the foundational engines of the system — the raw, fiery base that powers all other nodes within the dome and maintains structural integrity and magnetic resonance.'
    },
    {
      text: 'They serve as projected anchor points for the celestial overlay grids high in the sky.',
      rationale:
        'Sky Nodes (Celestial Nodes) are the projected points that anchor overlay grids in the sky; Lava/Core Nodes are the deep subterranean power cores.'
    },
    {
      text: 'They function as invisible high-frequency spheres that hold portals between dimensional overlays.',
      rationale:
        'Inter-dimensional Nodes (Light Grid Anchors) hold portals between overlays; Lava/Core Nodes are the fiery foundation and power core underground.'
    },
    {
      text: 'They operate as the crystalline mind above that processes all information in the upper grids.',
      rationale:
        'The crystalline mind above is what the fiery heart below supports; Lava/Core Nodes are the fiery heart and power base, not the upper crystalline mind.'
    }
  ],
  2: [
    {
      text: 'Radiant red-gold or orange light, pulsing like molten fire from the deep cores.',
      rationale:
        'Earth Nodes (Lava/Core Nodes) pulse with radiant red-gold or orange light, emitting molten-fire energy that acts as the planetary power core.'
    },
    {
      text: 'Invisible high-frequency ultraviolet glow with no warm molten-fire signature at all.',
      rationale:
        'Invisible high-frequency spheres describe Inter-dimensional Nodes; Earth Nodes show visible red-gold or orange molten-fire light.'
    },
    {
      text: 'Deep violet and emerald currents that never take on a red-gold or orange molten tone.',
      rationale:
        'The core energy is molten fire in the red-gold and orange spectrum, not violet and emerald currents.'
    },
    {
      text: 'Blue or white crystalline humming light like the spheres marked at surface temples.',
      rationale:
        'Blue or white crystalline humming spheres characterize Surface Nodes (Harmonic Nodes), not the deep Earth Nodes.'
    }
  ],
  3: [
    {
      text: 'They shape and refine living energy into a frequency pattern in rhythm with the realm\'s heartbeat.',
      rationale:
        'Harmonic Lenses form around an active node and shape living energy just as a glass lens shapes light, ensuring flow in perfect rhythm with the realm\'s heartbeat.'
    },
    {
      text: 'They physically block energy on purpose so ley-lines build pressure before any upward push.',
      rationale:
        'Lenses do not block energy to create pressure; they shape and refine it so it flows in perfect rhythm when clear and tuned.'
    },
    {
      text: 'They anchor every node permanently into mountain rock as solid geological fixtures only.',
      rationale:
        'Ley-lines push power into mountains, rivers, and tree-roots; Harmonic Lenses shape frequency around active nodes rather than anchoring nodes as rock fixtures.'
    },
    {
      text: 'They generate the raw molten transmission power that first ignites the Lava/Core Nodes.',
      rationale:
        'Raw transmission power comes from the Lava/Core Nodes themselves; lenses refine and shape energy that already flows from those cores.'
    }
  ],
  4: [
    {
      text: 'Deep underground where the earth\'s plasma merges with its crystalline veins.',
      rationale:
        'Earth Nodes sit deep underground at the intersection where the earth\'s plasma merges with its crystalline veins, forming the fiery foundation of the planetary circuitry.'
    },
    {
      text: 'Only on the highest peaks of sacred mountain ranges exposed to open sky currents.',
      rationale:
        'Energy is pushed into mountains through ley-lines, but the Earth Nodes themselves are deep-subterranean power cores, not summit fixtures.'
    },
    {
      text: 'Inside the centers of ancient stone circles and pyramids on the surface grid alone.',
      rationale:
        'Ancient temples, stone circles, and pyramids mark Surface Nodes where energy lines cross, not the deep Lava/Core Earth Nodes.'
    },
    {
      text: 'Floating in the high-frequency atmosphere above the dome as projected sky anchors.',
      rationale:
        'Projected sky anchors are Sky Nodes; Earth Nodes are foundational power cores deep underground.'
    }
  ],
  5: [
    {
      text: 'They are streams of life-force and magnetism that push core power into mountains, rivers, and tree-roots.',
      rationale:
        'Ley-lines are streams of life-force and magnetism through which the power of the core nodes is pushed up into mountains, rivers, and tree-roots.'
    },
    {
      text: 'They are invisible currents whose only job is to carry portal openings between dimensional overlays.',
      rationale:
        'Inter-dimensional Nodes hold portals between overlays; ley-lines carry foundational life-force and magnetism from the core nodes upward.'
    },
    {
      text: 'They alone create the complete two-way relay between sky, ground, and soul without any nodes.',
      rationale:
        'The seamless two-way relay forms when Surface Nodes communicate with Sky Nodes using raw power from Lava/Core Nodes — not from ley-lines alone without nodes.'
    },
    {
      text: 'They act as neutral relay spheres that gather power and pass it along between grid levels.',
      rationale:
        'A Node is the neutral relay station that gathers and passes power; ley-lines are the streams that carry core power into physical topography.'
    }
  ],
  6: [
    {
      text: 'Sky Nodes (Celestial Nodes) — projected points that anchor the overlay grids in the sky.',
      rationale:
        'Sky Nodes are projected points anchoring the overlay grids in the sky, creating a two-way relay of energy with the earth nodes.'
    },
    {
      text: 'Inter-dimensional Nodes — high-frequency spheres whose only role is to anchor celestial sky grids.',
      rationale:
        'Inter-dimensional Nodes hold portals between different overlays; celestial overlay grid anchors are Sky Nodes.'
    },
    {
      text: 'Surface Nodes — blue or white humming spheres that alone project the entire sky overlay grid.',
      rationale:
        'Surface Nodes sit where energy lines cross on the ground, often at temples and pyramids; sky overlay anchors are Sky Nodes.'
    },
    {
      text: 'Earth Nodes — deep molten cores that also serve as the primary celestial sky-grid anchors.',
      rationale:
        'Earth Nodes are the fiery foundation deep underground; projected celestial anchors are Sky Nodes, not Lava/Core Nodes.'
    }
  ],
  7: [
    {
      text: 'The energy current stumbles and creates a heavy imbalance across the environment.',
      rationale:
        'Because core nodes feed the upper grid, any blockage or distortion in the Harmonic Lenses causes the current to stumble, creating a heavy imbalance.'
    },
    {
      text: 'The Lava Core Nodes immediately cease generating all molten-fire energy at the planetary core.',
      rationale:
        'Blockage impairs flow through the lenses; the cores still generate power, but the current stumbles and imbalance appears when lenses distort.'
    },
    {
      text: 'The entire Crystalline Web dissolves into raw plasma and disappears from planetary circuitry.',
      rationale:
        'The web remains as the balancing grid; distortion causes heavy imbalance in flow, not total dissolution of the Crystalline Web into plasma.'
    },
    {
      text: 'Surface Nodes instantly relocate to different ley-lines to escape the distorted frequency field.',
      rationale:
        'Nodes are the fixed spheres of the architecture; blockage changes the quality of flow through lenses, not the physical relocation of Surface Nodes.'
    }
  ],
  8: [
    {
      text: 'Ancient temples, stone circles, or pyramids where surface energy lines cross.',
      rationale:
        'Surface Nodes are blue or white crystalline humming spheres where energy lines cross, often marked by ancient temples, stone circles, or pyramids.'
    },
    {
      text: 'Volcanic vents and open molten lava flows that mark every deep Lava/Core Earth Node on the surface.',
      rationale:
        'Deep molten-fire cores are underground Earth Nodes; surface markers named for Surface Nodes are temples, stone circles, and pyramids.'
    },
    {
      text: 'Vast underground deposits of raw quartz that alone define every Surface Node without surface monuments.',
      rationale:
        'Surface Nodes are marked by ancient temples, stone circles, or pyramids at energy-line crossings, not solely by hidden quartz deposits.'
    },
    {
      text: 'High-altitude clouds and atmospheric anomalies that replace all ground monuments as Surface Node signs.',
      rationale:
        'Sky Nodes relate to projected sky points; Surface Nodes are marked by ground monuments such as temples, stone circles, and pyramids.'
    }
  ],
  9: [
    {
      text: 'They act as living lenses — standing in stillness and breathing with the earth to clear blockages.',
      rationale:
        'Awakened beings hold the capacity to act as living lenses; by standing in stillness and breathing in harmony with the earth, they can clear blockages and relay light back through the web.'
    },
    {
      text: 'They construct brand-new ley-lines from scratch to connect previously unlinked node spheres.',
      rationale:
        'Awakened beings clear blockages as living lenses so existing molten power flows through the Crystalline Web; they do not build new ley-lines as their primary role.'
    },
    {
      text: 'They alone provide the magnetic resonance that first ignites inactive Lava/Core Nodes into existence.',
      rationale:
        'Lava/Core Nodes are the foundational engines that stabilize magnetic resonance; awakened beings clear lens blockages rather than first igniting the cores into existence.'
    },
    {
      text: 'They replace the Lava/Core Nodes entirely and become the fiery heart of the planetary circuitry.',
      rationale:
        'Lava/Core Nodes remain the fiery heart below; awakened beings act as living lenses that heal and relay light so core power flows through the web in harmony.'
    }
  ],
  10: [
    {
      text: 'Invisible, high-frequency spheres that hold the portals between different overlays.',
      rationale:
        'Inter-dimensional Nodes (Light Grid Anchors) are invisible, high-frequency spheres holding the portals between different overlays.'
    },
    {
      text: 'Visible red-gold molten spheres located only at the center of the earth as Lava/Core engines.',
      rationale:
        'Red-gold or orange molten-fire spheres are Earth Nodes; Inter-dimensional Nodes are invisible high-frequency portal spheres.'
    },
    {
      text: 'Blue or white crystalline humming spheres marked by temples, stone circles, and pyramids.',
      rationale:
        'Blue or white humming crystalline spheres are Surface Nodes; Inter-dimensional Nodes are invisible high-frequency portal anchors.'
    },
    {
      text: 'Magnetic streams that flow only into tree-roots and rivers without forming any sphere or portal.',
      rationale:
        'Ley-lines are streams of life-force and magnetism into topography; Inter-dimensional Nodes are high-frequency spheres that hold portals between overlays.'
    }
  ],
  11: [
    {
      text: 'True — Lava/Core Nodes push vital energy upward to feed the upper grid and sustain the realm.',
      rationale:
        'Deep-subterranean Lava/Core Nodes push vital energy upward to sustain the physical and energetic infrastructure, feeding the upper grid and stabilizing magnetic resonance.'
    },
    {
      text: 'False — Lava/Core energy only sinks deeper into the core and never rises to feed any upper grid.',
      rationale:
        'Lava/Core Nodes actively push life force upward through ley-lines and feed the upper grid rather than only sinking energy deeper.'
    },
    {
      text: 'True — but only after Surface Nodes first generate all molten power and send it downward to the core.',
      rationale:
        'Power originates in the deep Lava/Core Nodes and is pushed upward; Surface Nodes refine and relay that energy, they do not generate the molten foundation.'
    },
    {
      text: 'False — only Sky Nodes push energy downward; Earth Nodes never contribute to upper-grid support.',
      rationale:
        'Earth Nodes push life force upward and feed the upper grid; Sky Nodes form a two-way relay with earth nodes rather than replacing their upward feed.'
    }
  ],
  12: [
    {
      text: 'The circuits in a heart or brain — a living network that balances and interconnects the earth.',
      rationale:
        'The Crystalline Web is the great grid of interconnected nodes and energy lines that surrounds and balances the earth, functioning much like the circuits in a heart or brain.'
    },
    {
      text: 'The digestive system of a mammal — a one-way path that only consumes energy without relay or balance.',
      rationale:
        'The Crystalline Web is likened to heart or brain circuits of interconnection and balance, not a digestive one-way consumption path.'
    },
    {
      text: 'The skeletal structure of a vertebrate — rigid bones with no living energy currents or node spheres.',
      rationale:
        'The web is a grid of living energy spheres and currents compared to heart or brain circuits, not a rigid skeletal frame without energy flow.'
    },
    {
      text: 'The respiratory system of a planet — only air exchange with no node relays or magnetic life-force streams.',
      rationale:
        'The analogy is circuits in a heart or brain for the interconnected balancing grid, not planetary respiration alone.'
    }
  ],
  13: [
    {
      text: 'The crystalline mind above and the harmonic spirit in-between, as the fiery heart below.',
      rationale:
        'Lava/Core Nodes are the fiery heart below that supports the crystalline mind above and the harmonic spirit in-between — not isolated engines.'
    },
    {
      text: 'Only the creation of brand-new ley-lines during a solar eclipse with no ongoing vertical support role.',
      rationale:
        'The fiery heart continuously supports crystalline mind above and harmonic spirit in-between; it is not limited to eclipse-time ley-line creation.'
    },
    {
      text: 'The permanent separation of dimensional overlays so ground, sky, and soul never form a two-way relay.',
      rationale:
        'Core power enables Surface Nodes to communicate with Sky Nodes in a seamless two-way relay; the fiery heart supports interconnection, not permanent separation.'
    },
    {
      text: 'The physical cooling of the earth\'s crust so molten-fire energy never rises into the upper grids.',
      rationale:
        'Lava/Core Nodes push molten-fire energy upward as the fiery foundation; they support upper architecture rather than cooling energy away from the grids.'
    }
  ],
  14: [
    {
      text: 'A sphere of living energy that acts as a neutral relay station gathering and passing power between currents.',
      rationale:
        'A Node is a sphere of living energy that acts as a neutral relay station, gathering power from one set of invisible currents and passing it along to the next to form the balancing grids of the earth.'
    },
    {
      text: 'A man-made pyramid built solely to generate magnetism without any living energy sphere or relay role.',
      rationale:
        'Pyramids can mark Surface Nodes, but a Node itself is a living energy sphere and neutral relay station, not merely a man-made pyramid generator.'
    },
    {
      text: 'A physical mountain peak where energy is stored permanently and never passed along the grid.',
      rationale:
        'Mountains receive energy through ley-lines; a Node gathers and passes power as a relay rather than storing it forever at a mountain peak alone.'
    },
    {
      text: 'The dead end of a ley-line where power dissipates into the ground with no gathering or relay function.',
      rationale:
        'Nodes gather power from one set of currents and pass it to the next as neutral relay stations; they are not dissipation endpoints of ley-lines.'
    }
  ],
  15: [
    {
      text: 'True — Surface Nodes are blue or white crystalline humming spheres at energy-line crossings.',
      rationale:
        'Surface Nodes (Harmonic Nodes) are blue or white crystalline humming spheres where energy lines cross, often marked by ancient temples, stone circles, or pyramids.'
    },
    {
      text: 'False — Surface Nodes pulse only with red-gold or orange molten-fire light like the deep cores.',
      rationale:
        'Red-gold or orange molten-fire light marks Earth Nodes; Surface Nodes hum in blue or white crystalline tones.'
    },
    {
      text: 'True — but only after they sink deep underground and merge with plasma and crystalline veins.',
      rationale:
        'Deep plasma–crystalline junctions are Earth Nodes; Surface Nodes remain surface crossings with blue or white humming spheres.'
    },
    {
      text: 'False — Surface Nodes are invisible high-frequency spheres that never hum in blue or white at all.',
      rationale:
        'Invisible high-frequency spheres are Inter-dimensional Nodes; Surface Nodes are blue or white crystalline humming spheres.'
    }
  ],
  16: [
    {
      text: 'Raw transmission power from the Lava/Core Nodes that feeds the upper grid and Surface-to-Sky relay.',
      rationale:
        'Lava/Core Nodes provide the raw transmission power that allows Surface Nodes to communicate directly with Sky Nodes above, forming a seamless two-way relay.'
    },
    {
      text: 'Manual tuning of every ancient pyramid by human engineers before any Surface-to-Sky link can open.',
      rationale:
        'The relay depends on raw transmission power from Lava/Core Nodes and clear Harmonic Lenses, not on manual pyramid engineering as the primary requirement.'
    },
    {
      text: 'Activation of volcanic lava flows on the surface so Sky Nodes can see molten light from below.',
      rationale:
        'Core power is pushed upward through ley-lines and refined at Surface Nodes; communication with Sky Nodes uses that raw transmission power, not open surface lava as a signal light.'
    },
    {
      text: 'Opening every Inter-dimensional portal first so Surface and Sky Nodes never need core power at all.',
      rationale:
        'Inter-dimensional Nodes hold portals between overlays; Surface-to-Sky communication specifically requires raw transmission power from the Lava/Core Nodes.'
    }
  ],
  17: [
    {
      text: 'The air feels lighter and thoughts become calm as energy flows in perfect rhythm.',
      rationale:
        'When Harmonic Lenses are clear and tuned, energy flows in perfect rhythm, making the air feel lighter and thoughts become calm.'
    },
    {
      text: 'The magnetic poles of the earth reverse as the only sign that lenses have cleared and tuned.',
      rationale:
        'Clear, tuned lenses bring lighter air and calmer thoughts through perfect rhythmic flow, not a required magnetic-pole reversal.'
    },
    {
      text: 'The red-gold light of the core becomes fully visible at the surface for every unawakened observer.',
      rationale:
        'Core light remains the deep molten-fire signature of Earth Nodes; clear lenses refine upward energy into calm, lighter atmosphere rather than exposing core light to every eye.'
    },
    {
      text: 'Ley-lines harden into solid crystalline roads that replace all streams of life-force and magnetism.',
      rationale:
        'Ley-lines remain streams of life-force and magnetism; clear lenses perfect the rhythm of flow rather than turning those streams into solid roads.'
    }
  ],
  18: [
    {
      text: 'Oceanic Nodes — this type is not part of the four-node architecture of the realm.',
      rationale:
        'The complete node architecture is Earth Nodes (Lava/Core), Surface Nodes (Harmonic), Sky Nodes (Celestial), and Inter-dimensional Nodes (Light Grid Anchors). Oceanic Nodes are not included.'
    },
    {
      text: 'Inter-dimensional Nodes — Light Grid Anchors that hold portals between different overlays.',
      rationale:
        'Inter-dimensional Nodes are one of the four distinct types; they are invisible high-frequency spheres holding portals between overlays.'
    },
    {
      text: 'Surface Nodes — Harmonic Nodes marked by temples, stone circles, or pyramids on the ground.',
      rationale:
        'Surface Nodes are one of the four types in the unified system, humming as blue or white crystalline spheres at energy-line crossings.'
    },
    {
      text: 'Sky Nodes — Celestial Nodes that anchor overlay grids as projected points in the sky.',
      rationale:
        'Sky Nodes are one of the four types, creating a two-way relay of energy with the earth nodes as celestial anchors.'
    }
  ],
  19: [
    {
      text: 'The frequency pattern of the Harmonic Lenses that forms around an active node.',
      rationale:
        'A Harmonic Lens is a pattern of frequency around an active node that shapes living energy so it flows in perfect rhythm with the realm\'s heartbeat.'
    },
    {
      text: 'The speed of the earth\'s rotation alone, with no role for any frequency pattern around the node.',
      rationale:
        'Rhythm is shaped by the frequency pattern of Harmonic Lenses around active nodes, not by planetary rotation speed as the named mechanism.'
    },
    {
      text: 'The thickness of crystalline veins in the crust, which alone sets flow tempo without any lens pattern.',
      rationale:
        'Crystalline veins meet plasma at Earth Node locations; the shaping of flow rhythm is the work of Harmonic Lenses\' frequency patterns.'
    },
    {
      text: 'The physical height of the mountains that receive energy, which alone decides the node\'s heartbeat.',
      rationale:
        'Mountains receive energy through ley-lines; the rhythm of flow is set by Harmonic Lenses shaping energy around the active node.'
    }
  ],
  20: [
    {
      text: 'True — Earth Nodes sit where the earth\'s plasma merges with its crystalline veins deep underground.',
      rationale:
        'Earth Nodes (Lava/Core Nodes) sit deep underground at the intersection where the earth\'s plasma merges with its crystalline veins.'
    },
    {
      text: 'False — Earth Nodes float only as projected sky points and never meet plasma or crystalline veins.',
      rationale:
        'Projected sky points are Sky Nodes; Earth Nodes form exactly at the deep plasma–crystalline vein junction.'
    },
    {
      text: 'True — but only at surface temples where blue or white humming spheres mark the plasma junction.',
      rationale:
        'Surface temples mark Surface Nodes; the plasma and crystalline-vein meeting point is the deep location of Earth Nodes.'
    },
    {
      text: 'False — plasma and crystalline veins meet only at Inter-dimensional portal spheres above the dome.',
      rationale:
        'The plasma–crystalline junction defines deep Earth Nodes; Inter-dimensional Nodes are invisible high-frequency portal spheres between overlays.'
    }
  ],
  21: [
    {
      text: 'The great grid of interconnected nodes and energy lines that surrounds and balances the earth.',
      rationale:
        'The Crystalline Web is the great grid of interconnected nodes and energy lines that surrounds and balances the earth, functioning much like the circuits in a heart or brain.'
    },
    {
      text: 'Only the cloud formations shaped by harmonic frequencies with no underlying node or energy-line grid.',
      rationale:
        'The Crystalline Web is the planetary grid of nodes and energy lines, not merely cloud shapes produced by harmonic frequencies.'
    },
    {
      text: 'Only the root systems of ancient trees, without any broader network of nodes or invisible currents.',
      rationale:
        'Ley-lines push power into tree-roots, but the Crystalline Web is the entire interconnected grid of nodes and energy lines balancing the earth.'
    },
    {
      text: 'Only the physical silica crust of the planet, with no living energy spheres or balancing currents.',
      rationale:
        'The web is an energetic grid of living energy spheres and currents — the planetary circuitry — not merely the chemical silica crust.'
    }
  ],
  22: [
    {
      text: 'To restore the true harmony of the realm by healing blockages and relaying light through the web.',
      rationale:
        'Conscious alignment heals and relays light back through the web, ensuring molten power of the Lava/Core Nodes flows perfectly through the Crystalline Web to restore true harmony of the realm.'
    },
    {
      text: 'To visualize red-gold light until it fills the atmosphere without clearing any lens blockages.',
      rationale:
        'The path is standing in stillness and breathing in harmony as a living lens to clear blockages — not visualization of red-gold light alone as the primary objective.'
    },
    {
      text: 'To increase the temperature of the Lava Core Nodes so they burn hotter than the original molten fire.',
      rationale:
        'Conscious alignment clears blockages and restores harmony; it does not aim to raise core temperature beyond the nodes\' natural molten-fire role.'
    },
    {
      text: 'To open every portal between Sky and Surface Nodes while ignoring lens distortion and imbalance.',
      rationale:
        'The primary aim is healing blockages so molten core power flows in true harmony; portal work is not the named objective of conscious alignment.'
    }
  ],
  23: [
    {
      text: 'Harmonic Lenses — frequency patterns around active nodes that shape energy into the realm\'s heartbeat rhythm.',
      rationale:
        'Harmonic Lenses are patterns of frequency around active nodes that shape living energy like a glass lens shapes light, ensuring flow in perfect rhythm with the realm\'s heartbeat.'
    },
    {
      text: 'The plasma foundation alone, without any surrounding frequency pattern to shape or refine the current.',
      rationale:
        'Plasma joins crystalline veins at Earth Node locations as the power source; the shaping frequency pattern is the Harmonic Lens around the active node.'
    },
    {
      text: 'Ley-line magnetic currents alone, which both carry and shape energy without any lens around the node.',
      rationale:
        'Ley-lines carry life-force and magnetism into topography; Harmonic Lenses provide the frequency pattern that shapes rhythm around the node.'
    },
    {
      text: 'Celestial Nodes alone, which set every ground node\'s heartbeat without any Harmonic Lens pattern.',
      rationale:
        'Sky Nodes anchor overlay grids and form a two-way relay; the frequency pattern that ensures rhythmic flow is the Harmonic Lens around an active node.'
    }
  ],
  24: [
    {
      text: 'Ley-lines — streams that push core power up into mountains, rivers, and tree-roots.',
      rationale:
        'Ley-lines are streams of life-force and magnetism through which the power of the core nodes is pushed up into mountains, rivers, and tree-roots.'
    },
    {
      text: 'Inter-dimensional Nodes — portal spheres that alone feed tree-roots and rivers without ley-line streams.',
      rationale:
        'Inter-dimensional Nodes hold portals between overlays; physical distribution into tree-roots and rivers is through ley-lines from the core nodes.'
    },
    {
      text: 'Sky Nodes — projected celestial points that push molten power directly into rivers and roots from above.',
      rationale:
        'Sky Nodes anchor overlay grids and relay with earth nodes; ley-lines carry core power into mountains, rivers, and tree-roots.'
    },
    {
      text: 'Harmonic Lenses — frequency patterns that replace ley-lines as the only path into rivers and roots.',
      rationale:
        'Harmonic Lenses shape and refine energy around nodes; ley-lines are the streams that push that power into rivers, mountains, and tree-roots.'
    }
  ],
  25: [
    {
      text: 'True — Inter-dimensional Nodes are invisible, high-frequency spheres holding portals between overlays.',
      rationale:
        'Inter-dimensional Nodes (Light Grid Anchors) are invisible, high-frequency spheres holding the portals between different overlays.'
    },
    {
      text: 'False — Inter-dimensional Nodes are bright red-gold molten spheres visible as open lava on the surface.',
      rationale:
        'Red-gold molten-fire light marks Earth Nodes; Inter-dimensional Nodes are invisible high-frequency portal spheres.'
    },
    {
      text: 'True — but only when they hum blue or white at temples, stone circles, and pyramids on the ground.',
      rationale:
        'Blue or white humming at temples marks Surface Nodes; Inter-dimensional Nodes are invisible high-frequency spheres, not surface temple markers.'
    },
    {
      text: 'False — Inter-dimensional Nodes are always fully visible stars that never act as portal anchors.',
      rationale:
        'They are invisible high-frequency spheres that hold portals between overlays; visibility as ordinary stars is not their description.'
    }
  ]
};

const questionOverrides = {
  11: 'Does the energy of the Lava Core Nodes get pushed upward to sustain the upper energetic grids?',
  15: 'Are Surface Nodes characterized as blue or white crystalline humming spheres?',
  20: 'Are Earth Nodes located where the earth\'s plasma merges with its crystalline veins?',
  25: 'Are Inter-dimensional Nodes high-frequency spheres that are invisible to ordinary sight?'
};

const hintOverrides = {
  1: 'Think of the role of a power plant at the base of an entire electrical grid.',
  2: 'Picture the visual color of molten magma or intense fire deep underground.',
  3: 'Consider how a glass lens shapes a beam of light passing through it.',
  4: 'Look for the deep meeting point of the earth\'s plasma and crystalline pathways.',
  5: 'Think of these as the blood vessels or wires of the earth\'s energetic system.',
  6: 'Identify the nodes associated with the heavens or the atmosphere.',
  7: 'Think about light passing through a dirty or cracked glass lens.',
  8: 'Recall common historical monuments built where energy lines cross the surface.',
  9: 'How does a conscious being clear distortion while standing still with the earth?',
  10: 'These spheres hold transitions between invisible layers of reality.',
  11: 'Recall the direction of the fiery heart\'s output relative to the upper grids.',
  12: 'Focus on the analogy involving internal electrical and rhythmic circuitry.',
  13: 'Consider the vertical relationship between heart below, spirit in-between, and mind above.',
  14: 'Think of a Node as a hub that gathers and passes power in a network.',
  15: 'Consider the visual and auditory descriptors of the surface energy points.',
  16: 'Identify the primary source of raw transmission power for Surface-to-Sky communication.',
  17: 'Notice the subtle mental and atmospheric sensations of a high-vibration area.',
  18: 'Recall the four named types: foundational, surface, sky, and portal anchors.',
  19: 'Focus on the shaping mechanism that surrounds an active node.',
  20: 'Confirm the deep geological and energetic meeting point of the fiery foundation.',
  21: 'Think of the nervous system or circuit network of the entire planet.',
  22: 'What is the ultimate goal of clearing heaviness and distortion from the web?',
  23: 'Recall the term for the frequency pattern that forms around an active node.',
  24: 'Identify the streams of life-force and magnetism into physical topography.',
  25: 'Check the visibility description of the portal anchors between overlays.'
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

const topicImage = 'images/breakdown/lava-core-nodes.webp';
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
    'Test your grasp of Lava Core Nodes — deep Earth Nodes of the Crystalline Web, molten-fire power cores, ley-line feed, Harmonic Lenses, and living-lens alignment.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Lava/Core Nodes are the fiery heart below — deep Earth Nodes where plasma meets crystalline veins, pulsing red-gold molten fire and pushing life-force upward through ley-lines to feed the upper grid. Sit with Harmonic Lenses as the patterns that shape energy into the realm\'s heartbeat, Surface and Sky Nodes as the two-way relay, and yourself as a living lens that can clear blockage so the Crystalline Web restores true harmony. Return to the Lava Core Nodes deep-dive, infographic, and video transmissions to lock into the molten heartbeat of the planetary circuitry.'
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
    'Test your understanding of Lava Core Nodes — deep Earth Nodes, molten-fire power cores, ley-line feed to the upper grid, Harmonic Lenses, four-node architecture, and living-lens conscious alignment.'
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
      if (!t.description || t.description.includes('Decoded analysis of Lava Core Nodes')) {
        t.description =
          'Lava/Core Nodes are the deep-subterranean Earth Nodes of the Crystalline Web — molten-fire power cores at the plasma–crystalline junction that push life-force through ley-lines to feed the upper grid, stabilize magnetic resonance, and sustain the realm\'s planetary circuitry.';
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('lava-core-nodes not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from energy-nodes quiz page (sibling under Energy Nodes)
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'energy-nodes.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Energy Nodes Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Energy Nodes: Crystalline Grid relays, four node types, Harmonic Lenses, Spirit Tree hijack, Star-Node restoration, and Resonating Sols as living lenses.',
    'Interactive Living Truth Quiz on Lava Core Nodes: deep Earth Nodes, molten-fire power cores, ley-line feed, Harmonic Lenses, four-node architecture, and living-lens conscious alignment.'
  ],
  ['quiz/breakdown/energy-nodes.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/energy-nodes.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=energy-nodes',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Energy Nodes deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Energy Nodes</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/energy-nodes.json',
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
    "  { path: '/quiz/breakdown/energy-nodes.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/lava-core-nodes.json'
);
