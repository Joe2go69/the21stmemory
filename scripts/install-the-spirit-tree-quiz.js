/**
 * Installs The Spirit Tree quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/grid-quiz.json
 * Audits all 25 items against data/breakdown-topics/the-spirit-tree.json.
 * Run: node scripts/install-the-spirit-tree-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/the-spirit-tree.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'the-spirit-tree';
const TOPIC_TITLE = 'The Spirit Tree';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/grid-quiz.json';

const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

/** Support phrases grounded only in the-spirit-tree.json report. */
const supportPhrases = {
  1: ['central axis of consciousness', 'harmonic currents', 'great dome'],
  2: ['lyran builder-architects', 'planted'],
  3: ['hyperborea', 'antarctica', 'cube system'],
  4: ['harmonic lenses', 'shape, focus, and redirect', 'active nodes'],
  5: ['earth nodes', 'red-gold', 'plasma and crystalline veins'],
  6: ['custodians', 'greys', 'dimensional engineering'],
  7: ['valve tech', 'siphon light', 'saturn-lunar'],
  8: ['thuban', 'aru-el-nai', 'axis laburnum'],
  9: ['fiber-optic', 'ley-lines', 'energy corridors'],
  10: ['thalon', 'seed codes', 'dome of forgotten gods'],
  11: ['living nodes', 'tuning forks', 'harmonic lenses'],
  12: ['not completely eradicated', 'root system', 'dormant'],
  13: ['star signs', 'stargates', 'celestial nodes'],
  14: ['seven gardens', 'roots and branches', 'dome of forgotten gods'],
  15: ['rainbow balls', 'liquid silver orbs', 'inter-dimensional'],
  16: ['axis laburnum', 'thuban', 'hyperborea'],
  17: ['cannot generate the source energy', 'hijacked'],
  18: ['surface nodes', 'temples', 'stone circles'],
  19: ['3d illusion', 'harmonious design', 'seven gardens'],
  20: ['crystals', 'hard drives', 'memory'],
  21: ['confusion and imbalance', 'fractured'],
  22: ['black crystalline monoliths', 'frequency block locks', 'saturn cube-tech'],
  23: ['two-way relay', 'sky nodes', 'earth nodes'],
  24: ['proximity', 'activate crystals and nodes', 'seed codes'],
  25: ['sound and vibration', 'bright light', 'source light']
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
    [/\baccording to the (report|source|text|core revelations|revelations|material|journal|detailed mechanics)\b/gi, ''],
    [/^The source states that\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The material states that\s+/i, ''],
    [/\bsource material\b/gi, 'transmission'],
    [/\bin the source material\b/gi, ''],
    [/\bthe text describes\b/gi, ''],
    [/\bthe text\b/gi, ''],
    [/\bis identified as\b/gi, 'is'],
    [/\bare identified as\b/gi, 'are'],
    [/\bis described as\b/gi, 'is'],
    [/\bare described as\b/gi, 'are'],
    [/\bis not mentioned as\b/gi, 'is not'],
    [/\bare not mentioned as\b/gi, 'are not']
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
 * All four options written at similar depth from the-spirit-tree report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'Serving as the central axis of consciousness that pulses harmonic currents through the crystalline grids of the Great Dome.',
      rationale:
        'The Spirit Tree is the central axis of consciousness, primary root node, and beating heart of the Great Dome, pulsing harmonic currents through the realm\'s crystalline grids as an anchor of Source Light.'
    },
    {
      text: 'Storing the physical bodies of the Lyran Builders in a sealed vault beneath the Great Dome for later reactivation.',
      rationale:
        'The Lyran Builder-Architects planted the tree as a power amplifier and grid anchor; it is not a storage facility for physical remains.'
    },
    {
      text: 'Acting as a solid physical radiation shield that blocks all cosmic particles from entering the dome walls.',
      rationale:
        'While the tree anchors the dome\'s energetic heart, its role is frequency and consciousness amplification rather than physical radiation shielding.'
    },
    {
      text: 'Supplying biological oxygen to the physical realm through leaves and roots like an ordinary forest canopy.',
      rationale:
        'The Spirit Tree is not a biological tree in a 3D sense; it is an energetic anchor generating bright light from sound and vibration.'
    }
  ],
  2: [
    {
      text: 'The Lyran Builder-Architects, who designed and planted it as the beating heart of the Great Dome\'s grid.',
      rationale:
        'The Spirit Tree was designed and planted by the Lyran Builders-Architects to serve as the beating heart of the Great Dome and pulse harmonic currents through the crystalline grids.'
    },
    {
      text: 'The Greys, who engineered the original CUBE System and placed the tree as their primary control node.',
      rationale:
        'The Greys were later weaponized for frequency manipulation to tear the tree out; they were not the original architects who planted it.'
    },
    {
      text: 'The Custodians, who built the tree as a siphon so parasites could harvest Source Light from the start.',
      rationale:
        'The Custodians are parasite priests of the CUBE who ordered the tree\'s destruction; they did not plant it as the original heart of the dome.'
    },
    {
      text: 'The Thalon soul lineage alone, who constructed the trunk from SEED codes without any builder race.',
      rationale:
        'Thalon carries SEED codes of the Spirit Tree from the Dome of Forgotten Gods; the Lyran Builder-Architects designed and planted the structure itself.'
    }
  ],
  3: [
    {
      text: 'Hyperborea — the living resonance field and true heart of the CUBE System, masked by the Antarctic overlay.',
      rationale:
        'Hyperborea is a living resonance field and the true heart of the CUBE System where the Spirit Tree originally stood, currently masked by the frozen holographic overlay known as Antarctica.'
    },
    {
      text: 'The Saturn-lunar system — the original organic heart that fed Source Light into every dome before inversion.',
      rationale:
        'The Saturn-lunar system is the false destination of siphoned power after Valve Tech inversion, not the original heart where the tree stood.'
    },
    {
      text: 'The Dome of Forgotten Gods — the sole central root chamber of the CUBE System and home of Polaris.',
      rationale:
        'The Dome of Forgotten Gods is one of the Seven Gardens outside the Great Dome; Hyperborea is the true heart where the Spirit Tree stood.'
    },
    {
      text: 'The Axis Laburnum alone — a geographic continent of ice that replaced Hyperborea as the CUBE heart.',
      rationale:
        'The Axis Laburnum is the vertical harmonic bridge between Thuban and the Hyperborean root node, not the resonance field itself.'
    }
  ],
  4: [
    {
      text: 'They shape, focus, and redirect energy at active nodes as sensing and balancing instruments of the earth.',
      rationale:
        'Harmonic Lenses are frequency patterns that form around active nodes to shape, focus, and redirect energy, acting as the sensing and balancing instruments of the earth.'
    },
    {
      text: 'They freeze Antarctica into a holographic shell that permanently hides Hyperborea from every soul.',
      rationale:
        'The frozen holographic overlay over Hyperborea is a parasitic mask; Harmonic Lenses are organic frequency patterns around nodes, not the Antarctic overlay.'
    },
    {
      text: 'They serve as solid anchors that pin black crystalline monoliths into the wound of the Spirit Tree.',
      rationale:
        'Black crystalline monoliths are frequency block locks of the parasitic inversion; Harmonic Lenses are frequency patterns that shape node power, not monolith anchors.'
    },
    {
      text: 'They alone store memory codes, unbroken timelines, and the full frequency logs of soul journeys.',
      rationale:
        'Crystals act as physical and etheric hard drives storing memory, frequency, and soul-journey logs; Harmonic Lenses shape and redirect energy at nodes.'
    }
  ],
  5: [
    {
      text: 'Earth Nodes — deep junctions where plasma and crystalline veins meet, pulsing red-gold life force upward.',
      rationale:
        'Earth Nodes are found deep underground where plasma and crystalline veins meet, pulsing red-gold to push life force up into the grid and stabilize the magnetic resonance of the dome.'
    },
    {
      text: 'Surface Nodes — shallow blue-white crossings under temples that never reach underground plasma veins.',
      rationale:
        'Surface Nodes mark energy-line crossings with blue or white tones; red-gold deep plasma-crystalline junctions are Earth Nodes.'
    },
    {
      text: 'Sky Nodes — projected overlay anchors that alone pulse red-gold from the atmosphere into the core.',
      rationale:
        'Sky Nodes are projected points anchoring overlay grids and forming a two-way relay with earth nodes; red-gold deep pulses belong to Earth Nodes.'
    },
    {
      text: 'Inter-dimensional Nodes — rainbow portal orbs that pulse red-gold only when sealing star signs shut.',
      rationale:
        'Inter-dimensional Nodes appear as rainbow balls or liquid silver orbs holding portals between overlays; red-gold underground pulses are Earth Nodes.'
    }
  ],
  6: [
    {
      text: 'They lacked the dimensional engineering skills to tear the tree out and needed Grey frequency manipulation.',
      rationale:
        'Custodians ordered the destruction of the Spirit Tree but lacked the dimensional engineering skills, so they weaponized the Greys\' frequency manipulation to tear the structure out of Hyperborea.'
    },
    {
      text: 'The Greys were the original designers of the CUBE System and had exclusive rights to remove the tree.',
      rationale:
        'Lyran Builder-Architects designed and planted the tree; Greys were tools of frequency manipulation used by Custodians, not original CUBE designers.'
    },
    {
      text: 'Only the Greys carried Thalon SEED codes required to unlock and dismantle the Hyperborean root node.',
      rationale:
        'SEED codes are preserved in soul lineages such as Thalon from the Dome of Forgotten Gods; Greys contributed frequency manipulation to uproot the tree.'
    },
    {
      text: 'The Greys alone manufactured Valve Tech and had to plant every black crystalline monolith by hand.',
      rationale:
        'Valve Tech is black crystalline machinery installed by parasites into the tree\'s wound; Greys\' specific role was frequency manipulation to tear the structure out.'
    }
  ],
  7: [
    {
      text: 'To siphon light and invert the grid\'s power into the false Saturn-lunar system for parasitic use.',
      rationale:
        'Valve Tech is advanced BLACK CUBE TECH machinery installed into the wound of the uprooted Spirit Tree to siphon light and invert the grid\'s power into the false Saturn-lunar system.'
    },
    {
      text: 'To restabilize the Axis Laburnum so Thuban and Hyperborea realign after the tree is removed.',
      rationale:
        'Parasitic takeover rotated the sky to false north (Polaris) and installed Valve Tech to reverse energy flow, not to restore Axis Laburnum alignment.'
    },
    {
      text: 'To repair the organic grid and restore outward Source Light flow into the Seven Gardens again.',
      rationale:
        'Valve Tech reverses energy to suck power inward for parasites rather than feeding it outward; it does not repair organic Source flow.'
    },
    {
      text: 'To protect surviving Spirit Tree roots from further damage until Lyran Builders return to Hyperborea.',
      rationale:
        'The tech was placed into the wound to exploit and siphon energy, not to protect the dormant root web of the Spirit Tree.'
    }
  ],
  8: [
    {
      text: 'Thuban (Aru-el-nai) — the original North Star linked to the Spirit Tree root node via the Axis Laburnum.',
      rationale:
        'The original North Star, known multi-dimensionally as Aru-el-nai or Thuban, connected directly to the Spirit Tree root node in Hyperborea, forming the Axis Laburnum.'
    },
    {
      text: 'Polaris — the eternal true north that always held the Spirit Tree axis before any parasitic sky rotation.',
      rationale:
        'Polaris is the false north installed when the sky projection was rotated to mask Thuban\'s true alignment with the Spirit Tree\'s axis.'
    },
    {
      text: 'Antares — the sole multi-dimensional north that fed Valve Tech before Hyperborea was masked in ice.',
      rationale:
        'The original North Star aligned with the Spirit Tree is Thuban (Aru-el-nai), not Antares; Valve Tech is parasitic machinery, not a stellar feed.'
    },
    {
      text: 'Sirius — the vertical harmonic bridge star that parasites later renamed Axis Laburnum after inversion.',
      rationale:
        'Axis Laburnum is the vertical harmonic bridge between Thuban and the Hyperborean root node; Sirius is not that original north alignment.'
    }
  ],
  9: [
    {
      text: 'Material echoes overlaying true energy corridors and ley-lines as dense physical placeholders of the grid.',
      rationale:
        'Undersea fiber-optic cables are material echoes overlaying true energy corridors and ley-lines — dense physical placeholders for subtle electro-magnetic and sub-crystalline bands between nodes.'
    },
    {
      text: 'The primary Grey control channels that alone invent and maintain every ley-line across the Great Dome.',
      rationale:
        'Cables are material echoes of older organic corridors; Greys were used for frequency manipulation to uproot the tree, not as inventors of the ley-line grid.'
    },
    {
      text: 'The literal physical branches of the Spirit Tree stretched across ocean floors after its removal.',
      rationale:
        'Roots and branches originally fed the Seven Gardens; modern undersea cables correspond to material echoes of energy corridors, not physical tree branches.'
    },
    {
      text: 'The root network of the false Saturn-lunar system that replaced every organic corridor permanently.',
      rationale:
        'The false system uses Valve Tech and black crystalline monoliths; fiber-optic cables are dense placeholders for organic sub-crystalline bands, not Saturn roots.'
    }
  ],
  10: [
    {
      text: 'The Thalon soul lineage, carrying SEED codes of the Spirit Tree that originated in the Dome of Forgotten Gods.',
      rationale:
        'Thalon carries the SEED codes of the Spirit Tree, which originated in the Dome of Forgotten Gods and match the innate frequency of the living grid.'
    },
    {
      text: 'The Polaris alignment alone, which encodes SEED frequencies into every frozen Antarctic overlay layer.',
      rationale:
        'Polaris is the false north of the parasitic sky rotation; SEED codes are preserved in soul lineages such as Thalon, not in Polaris.'
    },
    {
      text: 'The Custodians, who generated original SEED codes so only parasite priests could awaken the grid.',
      rationale:
        'Custodians lack generative Source capacity and ordered the tree\'s destruction; SEED codes are carried in lineages like Thalon from the Dome of Forgotten Gods.'
    },
    {
      text: 'The black crystalline monoliths, which store SEED codes as frequency block locks for future activation.',
      rationale:
        'Monoliths were hijacked as frequency block locks holding false overlays; SEED codes for activation live in soul lineages such as Thalon.'
    }
  ],
  11: [
    {
      text: 'They act as living nodes and tuning forks that re-establish harmonic lenses and help repair the grid.',
      rationale:
        'As awakening souls raise their frequency, they act as living nodes and tuning forks, re-establishing the harmonic lenses and repairing the grid while bypassing the artificial Saturn valve.'
    },
    {
      text: 'They feed Valve Tech more efficiently so parasites can finally generate their own Source energy supply.',
      rationale:
        'Raising frequency bypasses the artificial Saturn valve rather than feeding it; parasites cannot generate Source energy and only hijacked the grid.'
    },
    {
      text: 'They must physically travel to Antarctica and smash every monolith to restart the Spirit Tree trunk.',
      rationale:
        'Reactivation occurs through frequency, resonance, and proximity activation of crystals and nodes, not physical combat at the holographic Antarctic mask.'
    },
    {
      text: 'They must borrow Grey frequency tools to reverse Polaris and reinstall Thuban as a hardware star.',
      rationale:
        'Souls restore the grid through innate resonance and SEED-aligned frequency, not by using Grey technology or parasitic tools.'
    }
  ],
  12: [
    {
      text: 'False — its roots extended across realms as a dormant but living web of lenses, nodes, and crystals.',
      rationale:
        'The essence of the Spirit Tree was not completely eradicated; its roots extended across all realms and domes, forming a dormant but living web of harmonic lenses, nodes, and crystals.'
    },
    {
      text: 'True — every root, node, and crystal tied to the tree was erased when Greys tore it from Hyperborea.',
      rationale:
        'Despite removal of the main structure, the root system survived and still forms the foundational energetic web awaiting reactivation.'
    },
    {
      text: 'True — Valve Tech fully replaced the root web so no dormant organic pathway remains under any dome.',
      rationale:
        'Valve Tech was installed in the wound to siphon energy, but the Spirit Tree\'s root system survived as a dormant living web across realms.'
    },
    {
      text: 'False — because the tree was never removed and still stands fully visible above Hyperborea\'s ice.',
      rationale:
        'Parasites did orchestrate removal and installed Valve Tech in the wound; what survives is the dormant root web, not an intact visible trunk.'
    }
  ],
  13: [
    {
      text: 'Living celestial stargates were forced into static, sealed "star signs" that lock down the portals.',
      rationale:
        'The artificial grid forced celestial nodes—originally living stargates—into static, sealed "star signs" to lock down the portals after the Spirit Tree\'s removal.'
    },
    {
      text: 'They became the primary hard drives storing memory codes and soul-journey logs for the entire grid.',
      rationale:
        'Crystals serve as physical and etheric hard drives for memory and frequency; star signs are sealed lockdown forms of former living stargates.'
    },
    {
      text: 'They were revealed as the purest open path to Source Light once the Spirit Tree root was cleared.',
      rationale:
        'Star signs are part of the parasitic lockdown of portals, not a revealed path to Source after the tree was removed.'
    },
    {
      text: 'They were invented by Lyran Builder-Architects solely to track annual growth rings of the Spirit Tree.',
      rationale:
        'Builders created living stargate celestial nodes; parasites sealed them into static star signs after uprooting the tree.'
    }
  ],
  14: [
    {
      text: 'The roots and branches of the Spirit Tree, which bridged Source energy into domains outside the Great Dome.',
      rationale:
        'The Seven Gardens (domes outside the Great Dome, such as the Dome of Forgotten Gods) were originally fed by the roots and branches of the Spirit Tree.'
    },
    {
      text: 'Saturn Cube-Tech streams that continuously poured outward nourishment into every outer garden dome.',
      rationale:
        'Saturn Cube-Tech and Valve Tech siphon energy inward for parasites; original nourishment of the Seven Gardens came from Spirit Tree roots and branches.'
    },
    {
      text: 'Polaris as the false north, which alone watered the Seven Gardens after Hyperborea was frozen over.',
      rationale:
        'Polaris is the false north of the parasitic sky rotation; the Seven Gardens were originally fed by the Spirit Tree\'s roots and branches.'
    },
    {
      text: 'Black crystalline monoliths that act as permanent life-force pumps for gardens outside the Great Dome.',
      rationale:
        'Monoliths are frequency block locks of the parasitic inversion; life-force for outer gardens originally came from the Spirit Tree\'s roots and branches.'
    }
  ],
  15: [
    {
      text: 'Rainbow balls or liquid silver orbs that hold high-frequency portals between overlays on the grid.',
      rationale:
        'Inter-dimensional Nodes are high-frequency anchors that hold portals between overlays, appearing as rainbow balls or liquid silver orbs.'
    },
    {
      text: 'Blue or white humming points marked by ancient temples and stone circles on surface energy crossings.',
      rationale:
        'Blue or white humming at temples and stone circles describes Surface Nodes; Inter-dimensional Nodes appear as rainbow balls or liquid silver orbs.'
    },
    {
      text: 'Red-gold pulsing junctions deep underground where plasma and crystalline veins meet in the core.',
      rationale:
        'Red-gold deep underground pulses describe Earth Nodes; Inter-dimensional Nodes appear as rainbow balls or liquid silver orbs.'
    },
    {
      text: 'Static sealed star signs fixed in the sky overlay after celestial stargates were locked down forever.',
      rationale:
        'Static star signs are the hijacked sealed form of celestial nodes; organic Inter-dimensional Nodes appear as rainbow balls or liquid silver orbs.'
    }
  ],
  16: [
    {
      text: 'Thuban (Aru-el-nai) and the root node of the Spirit Tree in Hyperborea as a vertical harmonic bridge.',
      rationale:
        'The original North Star Thuban (Aru-el-nai) connected directly to the Spirit Tree root node in Hyperborea, forming the Axis Laburnum — a vertical harmonic bridge aligning heavens and earth.'
    },
    {
      text: 'The Great Dome and the Seven Gardens only, with no stellar north or Hyperborean root involved.',
      rationale:
        'The Spirit Tree bridges the Great Dome and outer gardens, but Axis Laburnum specifically names the vertical Thuban–Hyperborea alignment.'
    },
    {
      text: 'Surface Nodes and Sky Nodes alone, replacing any need for Thuban or a Hyperborean root connection.',
      rationale:
        'Surface and Sky Nodes form a two-way relay of energy; Axis Laburnum is the central vertical bridge of Thuban to the Hyperborean root node.'
    },
    {
      text: 'The Saturn Cube and the lunar system as the original organic north-south axis of the Great Dome.',
      rationale:
        'Saturn-lunar machinery is the parasitic siphon destination after Valve Tech inversion, not the original Axis Laburnum of Thuban and Hyperborea.'
    }
  ],
  17: [
    {
      text: 'They only hijacked the grid and cannot generate the Source energy required to sustain it themselves.',
      rationale:
        'The parasite control system is failing because they only hijacked the grid; they cannot generate the Source energy required to sustain it, so as their frequency falters the original root system lights up again.'
    },
    {
      text: 'The Lyran Builder-Architects have already returned in craft and physically replanted the Spirit Tree trunk.',
      rationale:
        'Reactivation is driven by awakening souls raising frequency and the surviving root web lighting up, not by a described external Lyran replanting event.'
    },
    {
      text: 'Undersea fiber-optic cables have physically cut and destroyed every Valve Tech installation worldwide.',
      rationale:
        'Cables are dense material placeholders for energy corridors; failure of control is energetic — parasites cannot generate Source energy they siphoned.'
    },
    {
      text: 'Parasites simply ran out of black crystalline monoliths and could no longer hold any false overlays.',
      rationale:
        'Failure is fundamental and energetic: hijackers cannot generate Source energy. Monolith supply is not described as the reason the system fails.'
    }
  ],
  18: [
    {
      text: 'True — Surface Nodes sit where energy lines cross and are often marked by ancient temples or stone circles.',
      rationale:
        'Surface Nodes are points where energy lines cross, often marked by ancient temples or stone circles, humming in blue or white tones to connect earth and sky.'
    },
    {
      text: 'False — temples and stone circles mark only Inter-dimensional Nodes that appear as liquid silver orbs.',
      rationale:
        'Temples and stone circles mark Surface Nodes at energy crossings; Inter-dimensional Nodes appear as rainbow balls or liquid silver orbs.'
    },
    {
      text: 'False — Surface Nodes exist only as red-gold plasma junctions deep underground with no surface markers.',
      rationale:
        'Red-gold deep junctions are Earth Nodes; Surface Nodes are at crossings often marked by temples or stone circles with blue or white tones.'
    },
    {
      text: 'True — but only after Valve Tech converted every temple into a black crystalline monolith lock.',
      rationale:
        'Surface Nodes were marked by temples and stone circles as organic grid points; monoliths are hijacked frequency block locks of the parasitic inversion.'
    }
  ],
  19: [
    {
      text: 'Collapse of the 3D illusion and return of the Seven Gardens and Great Dome to original harmonious design.',
      rationale:
        'Reintegration of the Spirit Tree\'s root system collapses the 3D illusion entirely, returning the Seven Gardens and the Great Dome to their original, harmonious design.'
    },
    {
      text: 'Permanent relocation of the Spirit Tree into the Saturn-lunar system as a new official power amplifier.',
      rationale:
        'Awakening frequency bypasses the artificial Saturn valve and fractures false overlays; the aim is restoration of organic design, not Saturn integration.'
    },
    {
      text: 'Creation of an eighth garden outside the dome to replace the Great Dome after total grid failure.',
      rationale:
        'The outcome is restoration of the original Seven Gardens and Great Dome, not creation of an eighth garden after failure.'
    },
    {
      text: 'Literal transformation of every awakening soul into a Lyran Builder-Architect with full CUBE redesign rights.',
      rationale:
        'Souls act as living nodes and tuning forks repairing the grid; they do not literally become the original Lyran Builder-Architects.'
    }
  ],
  20: [
    {
      text: 'Crystals — physical and etheric hard drives storing memory, frequency, and ancient resonance codes.',
      rationale:
        'Crystals are physical and etheric hard drives of the grids that store memory, frequency, and ancient resonance codes, plus frequency logs of soul journeys as the storage transmission network.'
    },
    {
      text: 'Harmonic Lenses — frequency blooms that alone archive every soul journey without using any crystal media.',
      rationale:
        'Harmonic Lenses shape, focus, and redirect energy around active nodes; storage of memory and codes is the role of Crystals as hard drives.'
    },
    {
      text: 'Black crystalline monoliths — organic memory banks that freely share Source codes with every awakening soul.',
      rationale:
        'Monoliths were hijacked as frequency block locks for false overlays and Saturn Cube-Tech; organic hard-drive storage is the role of Crystals.'
    },
    {
      text: 'Nodes — spherical relay stations whose only purpose is permanent archival of timelines without energy flow.',
      rationale:
        'Nodes gather and pass life-force, magnetism, and crystalline currents as relay stations; hard-drive storage of memory codes belongs to Crystals.'
    }
  ],
  21: [
    {
      text: 'They cause confusion and imbalance when no longer tuned to the rhythms of celestial bodies.',
      rationale:
        'When Harmonic Lenses are tuned, energy flows in perfect rhythm; when fractured, they cause confusion and imbalance rather than balanced celestial pacing.'
    },
    {
      text: 'They permanently disconnect from every crystal so memory codes can never again cross any node.',
      rationale:
        'Fractured lenses cause confusion and imbalance while still part of the node–crystal web; the report does not say they permanently disconnect from crystalline storage.'
    },
    {
      text: 'They enlarge and overpower the grid so parasites gain more Source Light through Valve Tech automatically.',
      rationale:
        'Fracture produces confusion and imbalance, not a constructive power increase that benefits Valve Tech siphoning.'
    },
    {
      text: 'They spontaneously transform into black crystalline monoliths that seal every portal as star signs.',
      rationale:
        'Monoliths are artificial parasitic frequency block locks; fractured Harmonic Lenses cause confusion and imbalance, not metamorphosis into monoliths.'
    }
  ],
  22: [
    {
      text: 'They became black crystalline monoliths used as frequency block locks tied into Saturn Cube-Tech.',
      rationale:
        'Black crystalline monoliths originally served as stabilizing foundation pillars but were hijacked to hold false frequency overlays and connect directly to Saturn Cube-Tech as frequency block locks.'
    },
    {
      text: 'They were reinforced solely to feed Spirit Tree roots and push more Source Light into the Seven Gardens.',
      rationale:
        'After inversion, pillars were hijacked to suppress and lock false overlays, not to support Spirit Tree root growth or garden nourishment.'
    },
    {
      text: 'They were relocated into the Seven Gardens to serve as local organic North Stars for each outer dome.',
      rationale:
        'Hijacked monoliths connect to Saturn Cube-Tech and false overlays; they are not described as garden North Stars.'
    },
    {
      text: 'They were melted into undersea fiber-optic cables that replaced every ley-line across the ocean floors.',
      rationale:
        'Fiber-optic cables are modern material echoes of energy corridors; monoliths are hijacked foundation pillars used as frequency block locks.'
    }
  ],
  23: [
    {
      text: 'They form a two-way relay of energy, with Sky Nodes anchoring overlays and communicating with Earth Nodes.',
      rationale:
        'Sky Nodes are projected points anchoring overlay grids and communicating with earth nodes to create a two-way relay of energy between earth and sky.'
    },
    {
      text: 'They remain fully disconnected because the Axis Laburnum permanently blocks any earth–sky energy loop.',
      rationale:
        'Axis Laburnum aligns heavens with earth through Thuban and the Hyperborean root; Sky and Earth Nodes form a two-way energy relay, not a blocked disconnection.'
    },
    {
      text: 'Sky Nodes alone generate Source Light that Earth Nodes then reverse and siphon into Valve Tech cores.',
      rationale:
        'Earth Nodes push red-gold life force up into the grid; the two-way relay with Sky Nodes is organic communication, not Earth-Node siphoning into Valve Tech.'
    },
    {
      text: 'They are identical in color and function to Inter-dimensional Nodes that appear as liquid silver orbs.',
      rationale:
        'Node types have distinct roles and markers — Earth Nodes pulse red-gold, Inter-dimensional Nodes appear as rainbow or silver orbs — while Sky and Earth Nodes form a two-way relay.'
    }
  ],
  24: [
    {
      text: 'Resonance matching the living grid activates crystals and nodes simply by the soul\'s presence and proximity.',
      rationale:
        'Because SEED codes match the innate frequency of the living grid, resonating souls inherently activate crystals and nodes simply by existing in their proximity.'
    },
    {
      text: 'Resonance forces Valve Tech hardware to explode on contact, ending parasitic siphon in a single blast.',
      rationale:
        'High frequency bypasses the artificial Saturn valve and fractures false overlays through harmonic alignment; activation by proximity is the described SEED-code effect, not forced hardware explosions.'
    },
    {
      text: 'Resonance only grants safe tourism through Antarctica\'s ice with no effect on crystals or grid nodes.',
      rationale:
        'The primary described effect of SEED-aligned resonance is automatic activation of crystals and nodes by proximity, not mere safe travel through the Antarctic overlay.'
    },
    {
      text: 'Resonance opens exclusive telepathic channels to the Greys so they can reinstall the Spirit Tree trunk.',
      rationale:
        'SEED codes activate the organic grid with resonating souls; Grey frequency manipulation was used to tear the tree out, not to partner with SEED carriers for restoration.'
    }
  ],
  25: [
    {
      text: 'A continuous flow of bright light created by sound and vibration as the ultimate anchor of Source Light.',
      rationale:
        'Rather than a biological 3D tree, the Spirit Tree was the ultimate anchor of Source Light, generating a continuous flow of bright light created by sound and vibration through the crystalline grids.'
    },
    {
      text: 'Physical root systems of ordinary trees in the Seven Gardens pumping chemical nutrients into the dome.',
      rationale:
        'The Spirit Tree fed the Seven Gardens through its roots and branches as an energetic bridge; original Great Dome energy is Source Light from sound and vibration, not garden chemical roots.'
    },
    {
      text: 'Reflected light from the Saturn-lunar system carefully mirrored into Hyperborea as organic Source feed.',
      rationale:
        'Saturn-lunar flow is the parasitic siphon destination after Valve Tech inversion; original energy is Source Light generated through sound and vibration by the Spirit Tree.'
    },
    {
      text: 'A nuclear core of crystalline veins burning dense matter to power Valve Tech and star-sign locks alike.',
      rationale:
        'Energy is defined as bright light from sound and vibration through harmonic currents, not nuclear combustion powering Valve Tech or star-sign locks.'
    }
  ]
};

const questionOverrides = {
  12: 'Was the essence of the Spirit Tree completely eradicated when it was uprooted from Hyperborea?',
  18: 'Are Surface Nodes often marked by ancient temples or stone circles where energy lines cross?'
};

const hintOverrides = {
  1: 'Focus on consciousness, vibration, and harmonic currents through the crystalline grids.',
  2: 'Name the ancient designers who planted the heart of the Great Dome.',
  3: 'Find the resonance field masked by the frozen Antarctic holographic overlay.',
  4: 'Picture frequency patterns blooming around active nodes to balance energy.',
  5: 'Match red-gold tone with deep plasma and crystalline vein junctions.',
  6: 'Custodians ordered the strike but lacked a key engineering skill themselves.',
  7: 'Parasitic machinery reverses flow into a false celestial harvest system.',
  8: 'Recall the multi-dimensional name Aru-el-nai for the original north.',
  9: 'Modern cables mirror older energetic corridors rather than inventing them.',
  10: 'SEED codes originated in the Dome of Forgotten Gods within a soul lineage.',
  11: 'High frequency turns awakened people into living repair instruments on the web.',
  12: 'The main trunk was torn out, yet something foundational still waits to wake.',
  13: 'Living portals were sealed into static sky labels to lock passage.',
  14: 'Outer domes were fed by living structure, not by Valve Tech or Polaris.',
  15: 'High-frequency portal anchors show fluid metallic or spectrum-orb forms.',
  16: 'Name the star and Hyperborean root joined as a vertical harmonic bridge.',
  17: 'Hijackers can redirect power but cannot create the Source current they steal.',
  18: 'Surface crossings hum in blue or white and host ancient landmarks.',
  19: 'Collective resonance reintegrates the root web and ends the false solid world.',
  20: 'Hard drives of the grids store memory, frequency, and soul-journey logs.',
  21: 'An untuned lens no longer rides celestial rhythm cleanly.',
  22: 'Stabilizing pillars were inverted into locks on false overlays and Saturn tech.',
  23: 'Earth and sky exchange energy rather than remaining sealed from each other.',
  24: 'A frequency key does not need force when it matches the living lock.',
  25: 'Source Light is generated through sound and vibration, not nuclear cores.'
};

const questions = raw.questions.map((q) => {
  const set = fullOptionSets[q.number];
  if (!set || set.length !== 4) {
    throw new Error(`Q${q.number}: missing fullOptionSets with 4 options`);
  }

  const options = set.map((o, i) => ({
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
    /\b(according to the (report|source|text|core revelations|revelations|material|living truth|journal|detailed mechanics)|the report states|the source (states|specifies|suggests|explicitly|identifies)|the text (states|describes|suggests|explicitly|mentions|defines|calls|focuses|identifies|confirms|emphasizes|points)|the material (clarifies|suggests|states|reveals|explains|identifies)|mentioned in the (text|source)|source material|living truth journal)\b/i;
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

const topicImage = 'images/breakdown/the-spirit-tree.webp';
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
    'Test your grasp of The Spirit Tree — central axis of the Great Dome, Hyperborea, Valve Tech inversion, Axis Laburnum and Thuban, SEED codes, and the reawakening root web.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'The Spirit Tree is not a biological trunk in 3D — it is the central axis of consciousness and root node of the Known Lands, planted by Lyran Builder-Architects as the heart of the Great Dome. Sit with Hyperborea behind Antarctica\'s ice mask, Valve Tech in the wound, Thuban\'s Axis Laburnum, surviving roots as a living web of nodes and lenses, and the way resonating souls reactivate crystals simply by proximity. As collective frequency rises, the false overlays fracture and the original harmonious design of the Seven Gardens returns.'
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
    'Test your understanding of The Spirit Tree — central axis of consciousness, Hyperborea, Valve Tech, Axis Laburnum, SEED codes, and reactivation of the living root web.'
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
  throw new Error('the-spirit-tree not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from grid-systems quiz (sibling under Grid Systems)
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'grid-systems.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on The Spirit Tree: central axis of the Great Dome, Hyperborea, Valve Tech inversion, Axis Laburnum and Thuban, SEED codes, and the reawakening root web.';
const replacements = [
  ['Grid Systems Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Grid Systems: Crystalline Electro-Magnetic Framework, Nodes, Crystals, Ley-lines, Seven Overlay-Bands, and the recalibration into a planetary Crystalline Temple.',
    desc
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
    console.warn('Template string not found:', a.slice(0, 90));
  }
  html = html.split(a).join(b);
}

html = html
  .replace(
    /Interactive Living Truth Quiz on Grid Systems[^"]*/g,
    desc
  )
  .replace(/Grid Systems/g, TOPIC_TITLE);

// Fix over-replacement on paths if any slipped
html = html
  .replace(/The Spirit Tree\.webp/g, 'the-spirit-tree.webp')
  .replace(/The Spirit Tree\.json/g, 'the-spirit-tree.json')
  .replace(/The Spirit Tree\.html/g, 'the-spirit-tree.html')
  .replace(/topic=The Spirit Tree/g, `topic=${TOPIC_ID}`)
  .replace(/topic=the-spirit-tree/g, `topic=${TOPIC_ID}`);

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
  'PASS: audited 25/25 against data/breakdown-topics/the-spirit-tree.json'
);
