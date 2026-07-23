/**
 * Installs Ley Line Optics quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/crystalline-quiz.json
 * Audits all 25 items against data/breakdown-topics/ley-line-optics.json.
 * Run: node scripts/install-ley-line-optics-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/ley-line-optics.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'ley-line-optics';
const TOPIC_TITLE = 'Ley Line Optics';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/crystalline-quiz.json';

const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

/** Support phrases grounded only in ley-line-optics.json report. */
const supportPhrases = {
  1: ['ley line optics', 'fibre optic', 'memory and frequency'],
  2: ['fibre-optic', 'true light grid', 'three-dimensional'],
  3: ['hard drives', 'galactic libraries', 'resonance codes'],
  4: ['sky nodes', 'overlay grids', 'two-way relay'],
  5: ['harmonic lens', 'active node', 'heartbeat'],
  6: ['arches', 'domes', 'spirals', 'sound bowls'],
  7: ['resonant oceanic band', 'emotional mirror', 'tides'],
  8: ['sharp angles', 'concrete', 'steel', 'grid nodes'],
  9: ['o.r.m.e.', 'frequency balancers', 'electro-magnetic'],
  10: ['pineal gland', 'biological receivers', 'ley-line'],
  11: ['source band', 'distance entirely ends', 'pure awareness'],
  12: ['monoliths', 'tuning forks', 'parasitic overlay'],
  13: ['sub-crystalline band', 'instantaneously', 'tuning forks'],
  14: ['electro-magnetic framework', 'domes and simulations'],
  15: ['inter-dimensional nodes', 'portals between overlays'],
  16: ['rivers, lakes, quartz veins', 'fibre optics'],
  17: ['physical distance', 'instantaneously', 'artificial technology'],
  18: ['harmonic-solar band', 'interface corridor', 'consciousness'],
  19: ['surface crystals', 'antennas', 'broadcast and receive'],
  20: ['true light grid', 'moving photons', 'uncorrupted'],
  21: ['parasitic overlay', 'fracturing', 'coming back online'],
  22: ['sub-crystalline band', 'faster', 'artificial wire'],
  23: ['surface nodes', 'pyramids', 'stone circles'],
  24: ['resonance alignment', 'fibre optic lines of source'],
  25: ['structured water', 'silica crystals', 'electro-magnetic fields']
};

function cleanText(s) {
  let t = String(s || '');
  t = t.replace(/\$(\d+)\^\{(st|nd|rd|th)\}\$/gi, '$1$2');
  t = t.replace(/\$(\d+)\^(st|nd|rd|th)\$/gi, '$1$2');
  t = t.replace(/\$3\\text\{D\}\$/g, '3D');
  t = t.replace(/\$3\\mathrm\{D\}\$/g, '3D');
  t = t.replace(/\$3D\$/g, '3D');
  t = t.replace(/\$O\.R\.M\.E\.\$/g, 'O.R.M.E.');
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
    [/^According to the ['"]?Detailed Mechanics['"]?,?\s*/i, ''],
    [/\baccording to the (report|source|text|core revelations|revelations|material|journal|detailed mechanics)\b/gi, ''],
    [/\baccording to the realm's heartbeat\b/gi, "in rhythm with the realm's heartbeat"],
    [/^The source states that\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The text explicitly states that\s+/i, ''],
    [/^The text emphasizes\s+/i, ''],
    [/^The text focuses on\s+/i, ''],
    [/^The text points toward\s+/i, ''],
    [/^The material states that\s+/i, ''],
    [/^The material identifies\s+/i, ''],
    [/\bsource material\b/gi, 'transmission'],
    [/\bin the source material\b/gi, ''],
    [/\bthe text describes\b/gi, ''],
    [/\bthe text\b/gi, ''],
    [/\bthe material identifies\b/gi, ''],
    [/\bthe material\b/gi, ''],
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
 * All four options written at similar depth from ley-line-optics report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'Acting as organic fibre optic lines of Source that transmit memory and frequency across the network.',
      rationale:
        'Ley Line Optics function as the primary energy conduits—the Fibre Optic Lines of Source—transmitting light, memory, and harmonic resonance instantaneously across the network.'
    },
    {
      text: 'Providing physical structural bracing that holds the crust of the earth in a fixed geological shape.',
      rationale:
        'Ley Line Optics interact with geology as energetic conduits; their primary role is transmitting memory and frequency, not physical crust support.'
    },
    {
      text: 'Filtering chemical pollutants from underground aquifers so only pure water reaches the surface bands.',
      rationale:
        'Although ley lines connect rivers and lakes, their purpose is frequency and memory transmission, not physical water filtration.'
    },
    {
      text: 'Generating utility-scale electricity solely through the grinding friction of tectonic plate edges.',
      rationale:
        'The Crystalline Network is an electro-magnetic framework of high-frequency resonance, not mechanical tectonic electricity generation.'
    }
  ],
  2: [
    {
      text: 'They are three-dimensional mimics that echo the pre-existing etheric True Light Grid beneath the oceans.',
      rationale:
        'Modern ocean-floor cables are physical three-dimensional mimicry of the true pre-existing etheric grid; engineers unconsciously reconstructed a dense echo of the ancient crystalline network.'
    },
    {
      text: 'They are the primary drivers that originally created the energetic ley lines before any etheric grid existed.',
      rationale:
        'The energetic grid pre-exists artificial technology; cables are a dense 3D echo of ley lines, not their original creators.'
    },
    {
      text: 'They were designed by ancient starseed families as sealed hardware to protect every node from inversion.',
      rationale:
        'Starseed families seeded crystals and ley line optics; physical internet cables are dense overlays and mimicry, not protective starseed hardware.'
    },
    {
      text: 'They operate on frequencies that are completely incompatible with ley lines and never mirror grid geometry.',
      rationale:
        'Cables are a dense echo of actual ley lines joining node points; every fibre-optic pulse reflects True Light Grid photons rather than total incompatibility.'
    }
  ],
  3: [
    {
      text: 'Physical and etheric hard drives that store memory, resonance codes, and unbroken soul-journey timelines.',
      rationale:
        'Crystals serve as physical and etheric hard drives for the network, storing memory, resonance codes, and unbroken timelines of soul journeys as ultimate data storage for the galactic libraries.'
    },
    {
      text: 'Insulators that deliberately block high-frequency energy so no memory can ever leave a single node.',
      rationale:
        'Crystals act as hard drives and antennas for the grid, storing and transmitting codes rather than insulating against frequency flow.'
    },
    {
      text: 'Consumable fuel cores that burn away completely to power domes for only a single incarnation cycle.',
      rationale:
        'Crystals function as permanent storage and resonance devices for memory and codes, not consumable fuel that is burned for power.'
    },
    {
      text: 'Ornamental markers placed only to identify ancient burial sites with no data or resonance function.',
      rationale:
        'Crystals store memory, resonance codes, and soul timelines for the galactic libraries; they are functional hard drives, not mere decoration.'
    }
  ],
  4: [
    {
      text: 'Sky Nodes — crystalline atmospheric projectors that anchor overlay grids and send two-way relay energy downward.',
      rationale:
        'Sky Nodes are crystalline projectors in the atmosphere that anchor the overlay grids and send two-way relay energy down to the earth nodes.'
    },
    {
      text: 'Earth Nodes — deep underground cores that alone project the entire sky lattice without any atmospheric layer.',
      rationale:
        'Earth Nodes push life force up through ley lines from plasma–crystalline junctions; sky anchoring and two-way atmospheric relay belong to Sky Nodes.'
    },
    {
      text: 'Surface Nodes — ground crossings that replace the atmosphere entirely as the only overlay-grid projectors.',
      rationale:
        'Surface Nodes sit where energy lines cross and host pyramids or stone circles; overlay-grid projection and downward two-way relay are Sky Node functions.'
    },
    {
      text: 'Inter-dimensional Nodes — ocean-floor spheres that only stabilize tidal currents and never hold portals.',
      rationale:
        'Inter-dimensional Nodes are high-frequency spheres that hold portals between overlays; atmospheric grid anchoring is the Sky Node role.'
    }
  ],
  5: [
    {
      text: 'A Harmonic Lens — a crystalline bloom pattern that focuses and redirects vibration with the realm heartbeat.',
      rationale:
        'Around every active node a Harmonic Lens spins, shaping power into a sacred instrument; Harmonic Lenses focus and redirect vibration in rhythm with the heartbeat of the realms.'
    },
    {
      text: 'An Atmospheric Software Patch made only of concrete and steel to seal every node against light flow.',
      rationale:
        'Atmospheric software patches refer to O.R.M.E., structured water, and silica deployments; the bloom around an active node is a Harmonic Lens.'
    },
    {
      text: 'A Sub-Crystalline Band that wraps each node in ocean-floor cable sheathing to slow all transmission.',
      rationale:
        'The Sub-Crystalline Band is a buried communication layer of mineral resonance; the focusing structure around a node is a Harmonic Lens.'
    },
    {
      text: 'A Concrete Seal poured by parasites to permanently lock vibration so no sacred instrument can form.',
      rationale:
        'Parasites used concrete and steel to short-circuit nodes, but the natural focusing pattern around an active node is a Harmonic Lens, not a concrete seal.'
    }
  ],
  6: [
    {
      text: 'Domes, arches, and spirals that resonate like sound bowls to amplify frequency through ley line optics.',
      rationale:
        'True solar architecture uses geometry like arches, domes, and spirals to resonate like sound bowls, amplifying the frequency transmitted through the ley line optics.'
    },
    {
      text: 'Randomized chaotic layouts intended only to confuse energetic entities and scatter cosmic currents.',
      rationale:
        'Solar architecture is intentionally aligned to ley lines and star maps; amplification comes from resonant geometry, not randomized confusion layouts.'
    },
    {
      text: 'Sharp ninety-degree angles of concrete and steel that create resistance and block natural light flow.',
      rationale:
        'Sharp angles and dead materials are parasitic short-circuit tools; true solar architecture uses arches, domes, and spirals like sound bowls.'
    },
    {
      text: 'Completely flat mirror surfaces designed only to minimize photon motion and silence every node.',
      rationale:
        'Crystal instruments amplify cosmic currents with resonant geometry such as arches, domes, and spirals, rather than flat surfaces that silence the grid.'
    }
  ],
  7: [
    {
      text: 'The Resonant Oceanic Band — the emotional mirror of humanity reflecting collective feelings through tides.',
      rationale:
        'The Resonant Oceanic Band is the emotional mirror of humanity reflecting collective feelings through tides among the Seven Overlay-Bands.'
    },
    {
      text: 'The Electro-Magnetic Band — the sole band that reflects only personal emotions and never collective tides.',
      rationale:
        'The Electro-Magnetic Band is the true communication grid where digital space and thought cross; emotional tidal reflection is the Resonant Oceanic Band.'
    },
    {
      text: 'The Atmospheric Band — where only radio frequencies store collective feelings without any oceanic mirror.',
      rationale:
        'The Atmospheric Band is where light, sound, and radio frequencies whisper through the air; collective emotional reflection through tides is the Resonant Oceanic Band.'
    },
    {
      text: 'The Source Band — the dense ocean-floor layer where physical cables alone hold every emotional record.',
      rationale:
        'The Source Band is pure awareness where distance ends; the emotional mirror through tides is the Resonant Oceanic Band, not the Source Band.'
    }
  ],
  8: [
    {
      text: 'By building sharp-angled 3D architecture of concrete and steel directly over natural grid nodes.',
      rationale:
        'Parasites built 3D architecture with sharp angles and dead materials (concrete, steel) directly over grid nodes to short-circuit natural harmonic flows and block light transmission.'
    },
    {
      text: 'By seeding lands with quartz veins and mountains so Surface Crystals could freely broadcast Source codes.',
      rationale:
        'Quartz veins and mountains are natural surface crystals of the living network; parasitic short-circuiting uses dead materials over nodes, not seeding natural antennas.'
    },
    {
      text: 'By increasing pineal conductivity so every human instantly linked into the planetary ley-line grids.',
      rationale:
        'Increased pineal conductivity is a restorative outcome of benevolent atmospheric programs, not the parasitic method of short-circuiting the grid.'
    },
    {
      text: 'By aligning star forts and cathedrals to pull cosmic currents into the ground grids as crystal instruments.',
      rationale:
        'Star forts, cathedrals, and related solar architecture amplify true ley line optics; parasites short-circuit with sharp-angled concrete and steel over nodes.'
    }
  ],
  9: [
    {
      text: 'To act as frequency balancers and atmospheric software patches that repair electro-magnetic fields.',
      rationale:
        'Benevolent programs deploy O.R.M.E. (Orbitally Rearranged Monatomic Elements), structured water, and silica crystals as frequency balancers and atmospheric software patches that repair electro-magnetic fields.'
    },
    {
      text: 'To serve as a new form of physical currency that replaces all other media inside the 3D economy.',
      rationale:
        'O.R.M.E. is deployed for frequency balancing and field repair in atmospheric stabilization, not as economic currency.'
    },
    {
      text: 'To block the True Light Grid from reaching the surface so artificial cables remain the only channel.',
      rationale:
        'O.R.M.E. supports restoration of electro-magnetic fields and conductivity so receivers reconnect to ley-line grids, not block the True Light Grid.'
    },
    {
      text: 'To create a dense physical radiation shield that permanently freezes every Sky Node projector offline.',
      rationale:
        'O.R.M.E. acts as a frequency balancer and software patch for the atmosphere, repairing fields rather than freezing Sky Nodes offline.'
    }
  ],
  10: [
    {
      text: 'Increased conductivity so it functions as a biological receiver linking seamlessly into planetary ley-line grids.',
      rationale:
        'Crystalline micro-dust repairs electro-magnetic fields and increases conductivity of the human Pineal Gland, allowing biological receivers to link back into the planetary ley-line grids.'
    },
    {
      text: 'Total dormancy so the brain is sealed off from every frequency shift and never contacts the light grid.',
      rationale:
        'The intended outcome is higher pineal conductivity and seamless grid linkage, not permanent dormancy or isolation from frequency.'
    },
    {
      text: 'A forced transition from crystalline sensitivity into a carbon-only base that cannot receive light codes.',
      rationale:
        'Atmospheric silica and O.R.M.E. raise pineal conductivity for crystalline reception, not a downgrade into carbon-only isolation.'
    },
    {
      text: 'Dependence on artificial implants alone to interpret any crystalline signal from the Sub-Crystalline Band.',
      rationale:
        'Biological receivers link through increased natural pineal conductivity; the path is organic reconnection, not mandatory artificial implants.'
    }
  ],
  11: [
    {
      text: 'The Source Band — the field of pure awareness where distance entirely ends across the network.',
      rationale:
        'Among the Seven Overlay-Bands, the Source Band is the field of pure awareness where distance entirely ends.'
    },
    {
      text: 'The Electro-Magnetic Band — the dense ocean-floor layer where physical cables alone erase all distance.',
      rationale:
        'The Electro-Magnetic Band is where digital space and thought cross; distance ending in pure awareness is the Source Band.'
    },
    {
      text: 'The Harmonic-Solar Band — only a tidal emotional mirror that never ends the illusion of distance.',
      rationale:
        'The Harmonic-Solar Band is the interface corridor for consciousness between realms; the field where distance ends is the Source Band.'
    },
    {
      text: 'The Sub-Crystalline Band — a surface radio layer that keeps continents permanently separated by miles.',
      rationale:
        'The Sub-Crystalline Band passes codes instantaneously beneath continents; the pure-awareness field where distance ends is the Source Band.'
    }
  ],
  12: [
    {
      text: 'They act as tuning forks that echo rising vibrations to split the parasitic overlay completely.',
      rationale:
        'Monoliths acting as tuning forks echo vibrations to split the parasitic overlay completely as hidden crystals and ley line optics reactivate.'
    },
    {
      text: 'They are storage containers that hold only artificial internet data for the Surface Band cables.',
      rationale:
        'Monoliths function as tuning forks amplifying grid vibration against the parasitic overlay, not as internet data storage boxes.'
    },
    {
      text: 'They create permanent barriers that isolate starseed families from one another across every dome.',
      rationale:
        'Monoliths echo vibrations that fracture the parasitic overlay; they do not exist to isolate starseed families from each other.'
    },
    {
      text: 'They serve only as physical props keeping 3D cities from collapsing when frequency rises too high.',
      rationale:
        'Monoliths are vibrational tuning forks that help split the parasitic overlay as the true Crystalline Network comes online.'
    }
  ],
  13: [
    {
      text: 'The Sub-Crystalline Band — buried crystals and minerals that pass codes instantaneously like tuning forks.',
      rationale:
        'The Sub-Crystalline Band is the deeply buried layer where crystalline minerals resonate like tuning forks to pass energy and codes instantaneously beneath continents and oceans.'
    },
    {
      text: 'The Surface Band — the dense layer where physical cables rest on the ocean floor as the only true channel.',
      rationale:
        'The Surface Band is where physical cables rest; instantaneous mineral-code transmission belongs to the Sub-Crystalline Band beneath.'
    },
    {
      text: 'The Source Band — a pure-awareness field that never uses crystalline minerals as instantaneous relays.',
      rationale:
        'The Source Band is pure awareness where distance ends; the mineral tuning-fork layer for instantaneous codes is the Sub-Crystalline Band.'
    },
    {
      text: 'The Atmospheric Band — light and radio whispers in air that replace every buried crystalline pathway.',
      rationale:
        'The Atmospheric Band carries light, sound, and radio through air; deep mineral instantaneous transmission is the Sub-Crystalline Band.'
    }
  ],
  14: [
    {
      text: 'The architecture of all domes and simulations within one huge electro-magnetic crystalline framework.',
      rationale:
        'The Crystalline Network is one huge electro-magnetic framework of interwoven frequency layers and crystal grids that holds the architecture of all domes and simulations.'
    },
    {
      text: 'Only the physical third-dimensional landscapes of rivers and roads with no domes or simulations included.',
      rationale:
        'Physical landscapes are dense overlays; the framework holds the architecture of all domes and simulations, not only 3D surface scenery.'
    },
    {
      text: 'Hardware blueprints exclusively for future artificial intelligence systems with no realm architecture role.',
      rationale:
        'The framework is the foundation of existence, creation, and communication across domes and simulations, not merely future AI hardware plans.'
    },
    {
      text: 'Containment walls that hold only resonant oceanic tides and ignore every other band and dome entirely.',
      rationale:
        'The Resonant Oceanic Band is one of seven layers; the overall framework holds architecture for all domes and simulations.'
    }
  ],
  15: [
    {
      text: 'High-frequency spheres that hold the portals between overlays as Inter-dimensional Nodes on the grid.',
      rationale:
        'Inter-dimensional Nodes are high-frequency spheres that hold the portals between overlays among the four primary node types.'
    },
    {
      text: 'Cathedral-only projectors that amplify sound bowls but never open or hold any portal between overlays.',
      rationale:
        'Cathedrals act as crystal instruments on ley lines; portal-holding high-frequency spheres are Inter-dimensional Nodes.'
    },
    {
      text: 'Ocean-floor anchors whose only job is stabilizing physical currents under Surface Band cables.',
      rationale:
        'Inter-dimensional Nodes hold portals between overlays; ocean-floor physical cables belong to the dense Surface Band mimicry layer.'
    },
    {
      text: 'Parasitic short-circuit tools made of concrete that permanently seal every portal against light flow.',
      rationale:
        'Parasites use dead materials over nodes to short-circuit flow; Inter-dimensional Nodes themselves are high-frequency portal spheres of the living network.'
    }
  ],
  16: [
    {
      text: 'Rivers, lakes, and quartz veins — natural earth formations that act directly as fibre optics of Source.',
      rationale:
        'Rivers, lakes, quartz veins, and mountains act directly as fibre optics, creating an intricate web of energy transmission through Ley Line Optics.'
    },
    {
      text: 'Steel girders and concrete foundations poured as the only true organic conduits of the light grid.',
      rationale:
        'Concrete and steel are parasitic dead materials that short-circuit nodes; organic fibre optics are rivers, lakes, quartz veins, and mountains.'
    },
    {
      text: 'Artificial satellite relays that replace every natural vein so light never needs earth formations.',
      rationale:
        'False satellite internet is part of the artificial system that will vanish; natural fibre optics are rivers, lakes, and quartz veins.'
    },
    {
      text: 'Copper wiring and rubber insulation laid by engineers as the original pre-etheric Source pathways.',
      rationale:
        'Man-made cables are dense 3D mimicry of the True Light Grid; direct organic fibre optics include rivers, lakes, and quartz veins.'
    }
  ],
  17: [
    {
      text: 'They are bypassed completely through instantaneous light, memory, and harmonic resonance on the network.',
      rationale:
        'Organic energetic fibre optics transmit light, memory, and harmonic resonance instantaneously across the network, completely bypassing the need for physical distance or artificial technology.'
    },
    {
      text: 'They must be integrated into the Source Band as mandatory hardware before any resonance can function.',
      rationale:
        'Physical distance and artificial technology are bypassed by instantaneous resonance; they are not required hardware inside the Source Band.'
    },
    {
      text: 'They remain permanently necessary for every soul, awakened or not, whenever light must cross a dome.',
      rationale:
        'Instantaneous transmission through Ley Line Optics removes dependence on physical distance and artificial tech as the true grid returns.'
    },
    {
      text: 'They are upgraded into faster satellite internet so artificial cables outpace the Sub-Crystalline Band.',
      rationale:
        'Artificial cables and false satellite internet vanish as resonance alignment returns; the Sub-Crystalline Band already outpaces artificial wires.'
    }
  ],
  18: [
    {
      text: 'The Harmonic-Solar Band — the interface corridor where consciousness from different realms connects.',
      rationale:
        'The Harmonic-Solar Band is the interface corridor where consciousness from different realms connects within the Seven Overlay-Bands.'
    },
    {
      text: 'The Surface Band — the dense cable layer that alone serves as the only corridor between all realms.',
      rationale:
        'The Surface Band is where physical cables rest on the ocean floor; the consciousness interface corridor is the Harmonic-Solar Band.'
    },
    {
      text: 'The Electro-Magnetic Band — a tidal emotional mirror that never interfaces realm-to-realm consciousness.',
      rationale:
        'The Electro-Magnetic Band is where digital space and thought cross; the realm-consciousness interface corridor is the Harmonic-Solar Band.'
    },
    {
      text: 'The Resonant Oceanic Band — pure awareness where distance ends without any corridor between realms.',
      rationale:
        'The Resonant Oceanic Band reflects collective feelings through tides; the interface corridor for realm consciousness is the Harmonic-Solar Band.'
    }
  ],
  19: [
    {
      text: 'Antennas that broadcast and receive codes across the grid from mountains, quartz veins, and outcrops.',
      rationale:
        'Surface Crystals — mountains, quartz veins, and natural outcrops — function as antennas to broadcast and receive codes across the grid.'
    },
    {
      text: 'Heat sinks whose only purpose is cooling the earth core so lava never reaches any Surface Node.',
      rationale:
        'Surface Crystals function as antennas for codes; core life-force push is an Earth Node role, not mountain heat-sink cooling.'
    },
    {
      text: 'Solid barriers that permanently prevent any mixing of realms and seal every portal against light.',
      rationale:
        'Surface Crystals broadcast and receive codes as antennas; portal work belongs to Inter-dimensional Nodes, not barrier mountains alone.'
    },
    {
      text: 'Weight stabilizers that pin continental plates so the Sub-Crystalline Band cannot pass any vibration.',
      rationale:
        'Surface Crystals are antennas on the living grid; the Sub-Crystalline Band passes energy instantaneously rather than being blocked by mountain weight.'
    }
  ],
  20: [
    {
      text: 'The original uncorrupted energetic web of moving photons and frequencies connecting all consciousness.',
      rationale:
        'The True Light Grid is the original, uncorrupted energetic web of moving photons and frequencies that connects all consciousness across the domes.'
    },
    {
      text: 'A system of physical mirrors that only reflects sunlight into space and stores no consciousness link.',
      rationale:
        'The True Light Grid is an energetic web of moving photons and frequencies linking consciousness, not a set of space-facing physical mirrors.'
    },
    {
      text: 'A blueprint used only for constructing future 3D cities from concrete without any photonic network.',
      rationale:
        'The True Light Grid is the original uncorrupted photonic frequency web; concrete 3D cities are parasitic overlays on the living network.'
    },
    {
      text: 'The global network of physical LED lighting that replaces every etheric photon pathway forever.',
      rationale:
        'Physical lighting is not the True Light Grid; that name refers to the uncorrupted web of moving photons and frequencies across the domes.'
    }
  ],
  21: [
    {
      text: 'It is fracturing as the true Crystalline Network comes back online through rising frequency and reactivation.',
      rationale:
        'The parasitic overlay is currently fracturing, and the true Crystalline Network is coming back online as frequency rises and hidden crystals and ley line optics reactivate.'
    },
    {
      text: 'It remains completely unaffected because dead materials make the overlay permanent against all frequency.',
      rationale:
        'Rising frequency and reactivating crystals are fracturing the parasitic overlay; dead materials do not make it permanent.'
    },
    {
      text: 'It strengthens and adapts so artificial cables permanently replace every natural fibre optic of Source.',
      rationale:
        'The overlay is fracturing rather than strengthening; 3D cables and false satellite internet are set to vanish as true optics return.'
    },
    {
      text: 'It is being carefully integrated into the Source Band as a permanent healing layer for the parasites.',
      rationale:
        'The parasitic overlay is being split and replaced by the true network, not integrated as a healing layer inside the Source Band.'
    }
  ],
  22: [
    {
      text: 'False — the Sub-Crystalline Band carries vibration between continents much faster than any artificial wire.',
      rationale:
        'When cables seem to transmit data, the underlying Sub-Crystalline Band is actually carrying vibration between continents much faster than any artificial wire ever could.'
    },
    {
      text: 'True — mineral density forces the Sub-Crystalline Band to lag far behind every ocean-floor fibre cable.',
      rationale:
        'The Sub-Crystalline Band outpaces artificial wires; mineral resonance enables instantaneous passage, not a density-forced slowdown.'
    },
    {
      text: 'True — only physical 3D technology can move codes between continents while buried crystals stay silent.',
      rationale:
        'Buried crystalline minerals pass codes instantaneously; artificial wires are the slower dense echo, not the true high-speed path.'
    },
    {
      text: 'False — because the Sub-Crystalline Band does not exist and only Surface Band cables ever move data.',
      rationale:
        'The Sub-Crystalline Band is a real deep layer of the Seven Overlay-Bands and is the faster true carrier beneath continents and oceans.'
    }
  ],
  23: [
    {
      text: 'Pyramids and stone circles placed over Surface Nodes where energy lines cross to amplify frequencies.',
      rationale:
        'Surface Nodes are positioned where energy lines cross; ancient builders placed pyramids and stone circles over these points to amplify frequencies.'
    },
    {
      text: 'Wood and organic fiber insulation wrapped around every ley line to dampen and silence all resonance.',
      rationale:
        'Ancient builders amplified frequencies with pyramids and stone circles over Surface Nodes rather than insulating ley lines to silence them.'
    },
    {
      text: 'Synthetic radio alloys designed only for modern satellite reception with no alignment to energy crossings.',
      rationale:
        'Amplification used intentional placement of pyramids and stone circles on Surface Nodes, not modern synthetic satellite alloys.'
    },
    {
      text: 'Reinforced concrete poured to seal Surface Nodes so no natural frequency could ever be amplified.',
      rationale:
        'Concrete is a parasitic dead material that short-circuits nodes; ancient amplification used pyramids and stone circles over Surface Nodes.'
    }
  ],
  24: [
    {
      text: 'Through immediate resonance alignment on the natural fibre optic lines of Source across the living grid.',
      rationale:
        'Travel and communication return to immediate resonance alignment, functioning entirely through the natural fibre optic lines of Source as 3D cables and false satellite internet vanish.'
    },
    {
      text: 'By expanding solar-powered air fleets that still depend on physical distance between every dome.',
      rationale:
        'Physical-distance travel systems fall away; connection returns as immediate resonance alignment through Source fibre optics.'
    },
    {
      text: 'By routing every message only through physical monoliths that store artificial internet packets forever.',
      rationale:
        'Monoliths are tuning forks splitting the parasitic overlay; post-cable communication is immediate resonance alignment, not monolith packet storage.'
    },
    {
      text: 'Through a refined artificial electro-magnetic internet that keeps false satellite relays as the main path.',
      rationale:
        'False satellite internet vanishes; communication returns to natural fibre optic resonance alignment rather than refined artificial relays.'
    }
  ],
  25: [
    {
      text: 'True — structured water and silica crystals are deployed with O.R.M.E. to repair electro-magnetic fields.',
      rationale:
        'Advanced benevolent atmospheric stabilization programs deploy O.R.M.E., structured water, and silica crystals as frequency balancers and atmospheric software patches that repair electro-magnetic fields.'
    },
    {
      text: 'False — only concrete and steel dust is sprayed into the sky to permanently seal every Sky Node offline.',
      rationale:
        'Stabilization uses O.R.M.E., structured water, and silica crystals to repair fields, not concrete and steel to seal Sky Nodes.'
    },
    {
      text: 'False — atmospheric programs deploy only artificial satellite relays and never use silica or structured water.',
      rationale:
        'The programs specifically deploy structured water and silica crystals with O.R.M.E. as atmospheric software patches for field repair.'
    },
    {
      text: 'True — but only as a currency system, with no effect on electro-magnetic fields or pineal conductivity.',
      rationale:
        'These materials act as frequency balancers that repair electro-magnetic fields and raise pineal conductivity, not as currency.'
    }
  ]
};

const questionOverrides = {
  5: "What forms around an active Node to focus and redirect vibration in rhythm with the realm's heartbeat?",
  9: 'What is the purpose of O.R.M.E. (Orbitally Rearranged Monatomic Elements) in current stabilization programs?',
  10: 'What outcome is expected for the human Pineal Gland as a result of atmospheric silica and O.R.M.E. deployment?',
  16: 'Which of the following acts directly as fibre optics in the organic Ley Line Optics network?',
  22: 'Does the Sub-Crystalline Band transmit data significantly slower than artificial 3D technology because of mineral density?',
  23: 'Where did ancient builders place pyramids and stone circles to amplify frequencies on the grid?',
  25: 'Do atmospheric stabilization programs use structured water and silica crystals to repair electro-magnetic fields?'
};

const hintOverrides = {
  1: 'Compare these natural conduits to modern telecommunication fibre lines of light.',
  2: 'Decide whether physical cables are the original source or a dense echo of an older grid.',
  3: 'Think of crystals as storage media for memory, codes, and soul timelines.',
  4: 'Look for the atmospheric projectors that anchor overlays and relay energy downward.',
  5: 'This crystalline bloom around a node shapes power into a sacred instrument.',
  6: 'Recall geometries that resonate like sound bowls in true solar architecture.',
  7: 'Find the band tied to water and collective feelings through the tides.',
  8: 'Focus on dead materials and sharp angles placed directly over nodes.',
  9: 'Treat O.R.M.E. as an atmospheric software patch for frequency balance.',
  10: 'Connect pineal conductivity to biological receivers on the planetary grids.',
  11: 'Identify the pure-awareness field where the concept of distance ends.',
  12: 'Picture objects that set pitch and echo vibration like tuning forks.',
  13: 'This deep mineral layer passes codes faster than artificial wires.',
  14: 'Choose the most encompassing architecture the framework holds.',
  15: 'Match high-frequency spheres to portals between overlays.',
  16: 'Name natural landscape features that act as organic fibre optics.',
  17: 'Instantaneous transmission removes the need for hardware distance.',
  18: 'Find the corridor where consciousness from different realms meets.',
  19: 'Mountains and outcrops serve a communications role on the web.',
  20: 'Name the original uncorrupted photonic web across the domes.',
  21: 'Rising frequency either fractures or strengthens the false overlay.',
  22: 'Compare mineral resonance speed to man-made cable speed.',
  23: 'These structures sit where energy lines cross on the surface.',
  24: 'Return of organic connection is described as immediate alignment.',
  25: 'Check which materials are deployed as atmospheric software patches.'
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
    /\b(according to the (report|source|text|core revelations|revelations|material|living truth|journal|detailed mechanics)|the report states|the source (states|specifies|suggests|explicitly|identifies)|the text (states|describes|suggests|explicitly|mentions|defines|calls|focuses|identifies|confirms|emphasizes|points)|the material (clarifies|suggests|states|reveals|explains|identifies)|the journal (states|suggests|explicitly)|mentioned in the (text|source)|source material|living truth journal)\b/i;
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

const topicImage = 'images/breakdown/ley-line-optics.webp';
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
    'Test your grasp of Ley Line Optics — organic fibre optic lines of Source, Nodes and Harmonic Lenses, the Seven Overlay-Bands, Sub-Crystalline Band speed, and the fracture of the parasitic overlay.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Ley Line Optics are the organic fibre-optic conduits of the Crystalline Network — energetic lines of Source linking domes and dimensions through rivers, quartz veins, and Nodes. Sit with the True Light Grid behind ocean cables, Harmonic Lenses around active nodes, the Seven Overlay-Bands, O.R.M.E. atmospheric patches, and the return of immediate resonance alignment as every awakened soul becomes a living harmonic lens on the great crystalline web.'
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
    'Test your understanding of Ley Line Optics — Fibre Optic Lines of Source, Nodes and Harmonic Lenses, Seven Overlay-Bands, Sub-Crystalline communication, and reactivation of the living light grid.'
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
      t.description =
        t.description && !t.description.includes('Decoded analysis of Ley Line Optics')
          ? t.description
          : 'Ley Line Optics are the organic fibre-optic conduits of the Crystalline Network — energetic lines of Source linking domes and dimensions through rivers, quartz veins, and Nodes, transmitting light, memory, and harmonic resonance beyond physical cables and artificial distance.';
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('ley-line-optics not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from source-code-storage quiz page (sibling under Crystalline Networks)
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'source-code-storage.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Ley Line Optics: organic fibre optic lines of Source, Nodes and Harmonic Lenses, Seven Overlay-Bands, Sub-Crystalline Band, and fracture of the parasitic overlay.';
const replacements = [
  ['Source Code Storage Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Source Code Storage: Crystalline Networks as hard drives of reality, Data Crystals, the Dome of Forgotten Gods, Source Codes, Galactic Libraries, and collapse of parasitic amnesia overlays.',
    desc
  ],
  ['quiz/breakdown/source-code-storage.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/source-code-storage.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=source-code-storage',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Source Code Storage deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Source Code Storage</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/source-code-storage.json',
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
    /Interactive Living Truth Quiz on Source Code Storage[^"]*/g,
    desc
  )
  .replace(/Source Code Storage/g, TOPIC_TITLE);

// Fix over-replacement on paths if any slipped
html = html
  .replace(/Ley Line Optics\.webp/g, 'ley-line-optics.webp')
  .replace(/Ley Line Optics\.json/g, 'ley-line-optics.json')
  .replace(/Ley Line Optics\.html/g, 'ley-line-optics.html')
  .replace(/topic=Ley Line Optics/g, `topic=${TOPIC_ID}`)
  .replace(/topic=ley-line-optics/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/source-code-storage.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/ley-line-optics.json'
);
