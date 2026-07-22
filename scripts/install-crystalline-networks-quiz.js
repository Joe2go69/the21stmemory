/**
 * Installs Crystalline Networks quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/grid-quiz.json
 * Audits all 25 items against data/breakdown-topics/crystalline-networks.json.
 * Run: node scripts/install-crystalline-networks-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/crystalline-networks.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'crystalline-networks';
const TOPIC_TITLE = 'Crystalline Networks';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/grid-quiz.json';

const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

/** Support phrases grounded only in crystalline-networks.json report. */
const supportPhrases = {
  1: ['cube containment', 'crystalline electro-magnetic', 'eight primary domes'],
  2: ['sound folded into light', 'crystal light-worlds', 'lattices'],
  3: ['nodes', 'relay stations', 'leylines'],
  4: ['crystalline star-nodes', 'frequency templates', 'overlay grids'],
  5: ['black crystals', 'foundation pillars', 'grounded pure light'],
  6: ['planetary crystals', 'source codes', 'deep within'],
  7: ['crystalline plasma', 'motherships', 'arks'],
  8: ['spirit tree', 'saturn moon', 'reincarnation'],
  9: ['earth nodes', 'plasma', 'crystalline veins', 'red-gold'],
  10: ['zodiac', 'grid locks', 'star signs'],
  11: ['resonant frequencies', 'flicker', 'scaffolding'],
  12: ['distance', 'manufactured illusion', 'sub-crystalline band'],
  13: ['harmonic lenses', 'focus', 'redirect', 'vibrational'],
  14: ['resonating souls', 'living beacons', 'antennas'],
  15: ['crystal halls', 'light body', 'rainbow fractals'],
  16: ['concrete', 'steel', 'short-circuit', 'right angles'],
  17: ['star forts', 'cathedrals', 'crystalline instruments'],
  18: ['northern lights', 'photonic song', 'solar fires'],
  19: ['sub-crystalline band', 'instantly', 'fiber-optic'],
  20: ['inter-dimensional', 'portals', 'overlays'],
  21: ['high resonance', 'starve', 'fear'],
  22: ['crystals', 'hard drives', 'memory'],
  23: ['dome of forgotten gods', 'seven outer domes'],
  24: ['great dome', 'crystalline', 'connect'],
  25: ['harmonic tone', 'telepathically', 'intention', 'motherships']
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
    [/^According to the Journal,?\s*/i, ''],
    [/\baccording to the (report|source|text|core revelations|revelations|material|journal)\b/gi, ''],
    [/^The source states that\s+/i, ''],
    [/^The source specifies that\s+/i, ''],
    [/^The source material explicitly states that\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The material states that\s+/i, ''],
    [/^The material clarifies that\s+/i, ''],
    [/\bsource material\b/gi, 'transmission'],
    [/\bin the source material\b/gi, ''],
    [/\bis described as\b/gi, 'is'],
    [/\bare described as\b/gi, 'are'],
    [/\bdescribed in the text\b/gi, ''],
    [/\bthe text\b/gi, 'this transmission']
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
 * All four options written at similar depth from crystalline-networks report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'A massive crystalline electro-magnetic framework that houses all physical realms and the eight primary domes.',
      rationale:
        'CUBE Containment is one huge massive crystalline electro-magnetic framework that houses all physical realms, simulations, and the eight primary domes.'
    },
    {
      text: 'A vacuum of dead matter and scattered continents floating freely without any crystalline framework at all.',
      rationale:
        'Earth is one continuous living crystalline temple, not a vacuum of dead matter; the CUBE is a crystalline electro-magnetic containment framework.'
    },
    {
      text: 'A network of undersea fiber-optic cables that alone form the only structural skeleton of every realm.',
      rationale:
        'Fiber-optic cables are dense 3D technology that underperforms the sub-crystalline band; the CUBE is the crystalline electro-magnetic framework of all realms.'
    },
    {
      text: 'An artificial simulation powered only by distant solar fire with no crystalline electro-magnetic structure.',
      rationale:
        'Solar fire is a misunderstanding of phenomena like the Northern Lights; containment is the massive crystalline electro-magnetic CUBE framework.'
    }
  ],
  2: [
    {
      text: 'Sound folded into light, weaving the stable light lattices and membranes that hold vision.',
      rationale:
        'Crystal Light-Worlds are the original frequency states before physicality, where sound folded into light to create the stable light lattices and membranes that hold vision.'
    },
    {
      text: 'Plasma condensed into solid rock as the sole origin of every lattice and membrane in creation.',
      rationale:
        'Crystalline plasma is the medium for growing living architecture and motherships; Light-World lattices formed when sound folded into light before physicality.'
    },
    {
      text: 'Physical matter was compressed by gravity into lattices long before any vibrational tone existed.',
      rationale:
        'These frequency states existed before physicality, so gravity on physical matter was not the creative mechanism; sound folded into light formed the lattices.'
    },
    {
      text: 'Light was filtered only through black cube valves installed as the original creative engines of vision.',
      rationale:
        'Black cube valve tech is parasitic siphon technology installed after the Spirit Tree was removed; original lattices formed when sound folded into light.'
    }
  ],
  3: [
    {
      text: 'They act as relay stations where leylines meet to gather and transmit power across the grid.',
      rationale:
        'Nodes are junction points of energy lines and leylines where life-force and magnetism converge, acting as relay stations that gather and transmit power across the grid.'
    },
    {
      text: 'They exist only as storage vaults for parasitic 3D holograms with no power-relay function at all.',
      rationale:
        'Holograms suppress and bury nodes; the natural function of nodes is to gather and transmit power as relay stations on the grid.'
    },
    {
      text: 'They serve as the primary hardware of the artificial reincarnation loop under the Saturn moon station.',
      rationale:
        'The Saturn moon frequency station powers artificial reincarnation loops after the Spirit Tree was removed; natural nodes are power-relay stations of the living grid.'
    },
    {
      text: 'They function only as valve locks that permanently stop all energy flow through every leyline.',
      rationale:
        'Parasites inverted some crystals into valve locks; the inherent role of nodes is to gather and transmit power as relay stations, not to stop all flow.'
    }
  ],
  4: [
    {
      text: 'They store frequency templates, project overlay grids, and act as portals between realms.',
      rationale:
        'Crystalline Star-Nodes are multidimensional data crystals in the sky that store frequency templates and project overlay grids while acting as portals between realms.'
    },
    {
      text: 'They burn only as distant gas suns with no template storage or portal function in the sky lattice.',
      rationale:
        'What were perceived as stars are Crystalline Star-Nodes that store frequency templates, project overlays, and serve as portals — not mere distant burning suns.'
    },
    {
      text: 'They exist solely as decorative lights with no role in atmospheric projection or inter-realm travel.',
      rationale:
        'Star-nodes maintain the layered projection field of the sky and act as portals; they are not decorative lights without data or projection function.'
    },
    {
      text: 'They only harvest Loosh from cities and never store templates or project any overlay grid structure.',
      rationale:
        'Energy harvesting is a parasitic inversion of the grid; Crystalline Star-Nodes specifically store frequency templates, project overlays, and serve as portals.'
    }
  ],
  5: [
    {
      text: 'They were foundation pillars and void holders that grounded pure light into matter.',
      rationale:
        'Black Crystals were original foundation pillars and void holders that grounded pure light into matter before parasites hijacked and inverted them into valve locks for artificial frequency grids.'
    },
    {
      text: 'They were always only parasitic valve locks with no original foundation or light-grounding purpose.',
      rationale:
        'Valve-lock use is the later hijack; originally Black Crystals grounded pure light into matter as foundation pillars and void holders.'
    },
    {
      text: 'They served only as surface quartz antennas for frequency transmission across mountain outcrops.',
      rationale:
        'Surface Crystals act as antennas; Black Crystals specifically began as foundation pillars that grounded pure light into matter.'
    },
    {
      text: 'They were only decorative sky ornaments projecting zodiac locks without grounding light into matter.',
      rationale:
        'Zodiac locks sit on star-node gates; Black Crystals originally grounded pure light into matter as foundation pillars before parasitic inversion.'
    }
  ],
  6: [
    {
      text: 'Planetary Crystals — giant round structures deep in the earth that hum with ancient Source codes.',
      rationale:
        'Planetary Crystals are giant, round energy structures buried deep within the earth that hum with ancient Source codes to stabilize the core framework of the grid.'
    },
    {
      text: 'Surface Crystals — quartz veins and mountains that alone stabilize the entire planetary core framework.',
      rationale:
        'Surface Crystals act as antennas for frequency transmission; stabilizing the core framework with Source codes is the role of Planetary Crystals deep in the earth.'
    },
    {
      text: 'Hidden Placed Crystals — starseed keys that replace planetary cores as the only Source-code stabilizers.',
      rationale:
        'Hidden Placed Crystals are activation keys seeded by Starseed families; core-framework stability via Source codes belongs to deep Planetary Crystals.'
    },
    {
      text: 'Black Crystals alone after inversion, which stabilize Source codes without any planetary tier at all.',
      rationale:
        'After hijack, Black Crystals act as valve locks for artificial grids; the tier that stabilizes the core with Source codes is Planetary Crystals.'
    }
  ],
  7: [
    {
      text: 'They are gestated and grown from crystalline plasma that responds to harmonic tone and intention.',
      rationale:
        'True architecture is grown from sound and thought; Motherships and Arks are semi-conscious constructs of crystalline plasma that respond telepathically to a pilot\'s harmonic tone and intention.'
    },
    {
      text: 'They are assembled only from concrete, steel, and plastic like ordinary modern 3D construction projects.',
      rationale:
        'Concrete, steel, and plastic are dead materials used to block the grid; true crafts are grown from crystalline plasma, not built as dead construction.'
    },
    {
      text: 'They are mined as solid stone blocks and bolted together without plasma, sound, or living intention.',
      rationale:
        'True technological manifestations are grown from sound and thought through crystalline plasma rather than bolted from dead materials.'
    },
    {
      text: 'They are projected solely as holograms with no crystalline plasma body that can carry living pilots.',
      rationale:
        'Motherships and Arks are semi-conscious crystalline-plasma constructs, not empty holograms without living plasmatic architecture.'
    }
  ],
  8: [
    {
      text: 'The Saturn moon frequency station was installed as black cube valve tech to siphon the grid\'s light.',
      rationale:
        'When parasites ripped out the Spirit Tree, they installed the Saturn moon frequency station — black cube valve tech — to siphon the grid\'s light inward and power artificial reincarnation loops.'
    },
    {
      text: 'The Spirit Tree was immediately replanted stronger so the grid needed no replacement anchor at all.',
      rationale:
        'The Spirit Tree was ripped out and replaced by the Saturn moon frequency station; it was not left as a stronger replanted central anchor.'
    },
    {
      text: 'Only Surface Nodes were upgraded into temples while the central axis of the Known Lands stayed intact.',
      rationale:
        'Temples mark Surface Nodes, but removing the Spirit Tree specifically replaced the primary central anchor with Saturn moon black cube valve tech.'
    },
    {
      text: 'The Northern Lights were turned off permanently as the only consequence of losing the Spirit Tree.',
      rationale:
        'Northern Lights are photonic communication of upper dome frequencies with the grid; the Spirit Tree\'s removal brought Saturn moon valve tech for light siphon and reincarnation loops.'
    }
  ],
  9: [
    {
      text: 'Earth Nodes — lava-like spheres where plasma and crystalline veins meet, pushing red-gold life force upward.',
      rationale:
        'Earth Nodes are lava-like spheres deep underground where plasma and crystalline veins meet, pushing red-gold life force up through leylines to feed the upper grid.'
    },
    {
      text: 'Surface Nodes — harmonic points at temples and pyramids with no deep plasma–crystalline junction role.',
      rationale:
        'Surface Nodes sit at intersecting leylines marked by temples or pyramids; the deep plasma–crystalline lava-like spheres are Earth Nodes.'
    },
    {
      text: 'Sky Nodes — celestial projection points that alone form the underground red-gold life-force cores.',
      rationale:
        'Sky Nodes anchor the atmospheric lattice above; underground lava-like spheres of red-gold life force are Earth Nodes.'
    },
    {
      text: 'Inter-dimensional Nodes — higher-frequency portal anchors that replace all deep underground earth cores.',
      rationale:
        'Inter-dimensional Nodes hold portals between overlays; deep underground plasma–crystalline spheres pushing red-gold life force are Earth Nodes.'
    }
  ],
  10: [
    {
      text: 'Grid locks placed upon celestial gates maintained by crystalline star-nodes in the sky projection field.',
      rationale:
        'The sky is a layered projection field maintained by crystalline star-nodes, and the astrological zodiac and star signs are actually grid locks placed upon these gates.'
    },
    {
      text: 'Free open portals that permanently unlock every sky gate for unrestricted inter-realm travel by all souls.',
      rationale:
        'Zodiac and star signs are grid locks on celestial gates, not free openers; star-nodes themselves can act as portals when unlocked.'
    },
    {
      text: 'Simple personality maps with no energetic lock function on the atmospheric projection lattice at all.',
      rationale:
        'Zodiac and star signs function as grid locks on celestial gates of the sky projection field, not as mere personality charts.'
    },
    {
      text: 'Only agricultural calendars that never interact with star-nodes or the layered sky projection field.',
      rationale:
        'They are grid locks on celestial gates within the layered projection field of crystalline star-nodes, not mere seasonal calendars.'
    }
  ],
  11: [
    {
      text: 'The rise of resonant frequencies as the crystalline grid powers up and the 3D overlay begins to fail.',
      rationale:
        'As the grid powers up and frequency rises, the holographic layer of the 3D overlay begins to flicker; walls shimmer, bend, and reveal the hollow scaffolding of frequency beneath.'
    },
    {
      text: 'A permanent shutdown of all Planetary Crystals that freezes every structure into denser concrete forever.',
      rationale:
        'Rising resonance reactivates crystals and collapses illusion; flickering reveals hollow scaffolding as frequency rises, not a freeze into denser concrete.'
    },
    {
      text: 'Only local weather storms that have no connection to grid reactivation or holographic overlay failure.',
      rationale:
        'Flicker and hollow scaffolding are effects of rising resonant frequencies in the reactivating crystalline grid, not ordinary weather alone.'
    },
    {
      text: 'The installation of more fiber-optic cables that strengthen the 3D overlay against any frequency rise.',
      rationale:
        'Dense 3D tech like fiber-optics is inferior to the Light Grid; overlay flicker comes from rising resonant frequencies as the crystalline grid powers up.'
    }
  ],
  12: [
    {
      text: 'False — physical distance and travel are manufactured illusions; the sub-crystalline band moves energy and data instantly.',
      rationale:
        'Physical distance and travel are a manufactured illusion projected through the grid; the sub-crystalline band passes energy and data instantly beneath the earth, outperforming undersea fiber-optic cables.'
    },
    {
      text: 'True — distance is an unchangeable natural law that no crystalline band or portal can ever bypass.',
      rationale:
        'Distance is a manufactured illusion; natural travel returns to immediate resonance alignment through crystalline portals as artificial locks break.'
    },
    {
      text: 'True — only undersea fiber-optic cables can ever move information, and they always outrank the grid.',
      rationale:
        'The sub-crystalline band vastly outperforms physical undersea fiber-optic cables; dense 3D tech is not the superior path of true communication.'
    },
    {
      text: 'False — because space travel between planets is the only real way energy ever moves in the CUBE.',
      rationale:
        'The CUBE houses layered realms and grids, not infinite outer-space travel as the primary transfer path; the sub-crystalline band moves energy instantly beneath the earth.'
    }
  ],
  13: [
    {
      text: 'To focus, redirect, and shape vibrational energy in perfect rhythm with the heartbeat of the realms.',
      rationale:
        'Harmonic Lenses are crystalline patterns around active nodes that focus, redirect, and shape vibrational energy in perfect rhythm with the heartbeat of the realms.'
    },
    {
      text: 'To store all soul journeys as the only eternal memory banks of the universe without shaping energy.',
      rationale:
        'Crystals store memory, frequency, and resonance codes; Harmonic Lenses specifically shape and redirect vibrational energy around nodes.'
    },
    {
      text: 'To permanently seal zodiac gates so no vibrational current can ever flow through the sky lattice.',
      rationale:
        'Zodiac locks seal star-node gates; Harmonic Lenses open the shaping of vibrational energy around active nodes with the realm\'s heartbeat.'
    },
    {
      text: 'To replace Earth Nodes as the only deep underground sources of red-gold plasma life force.',
      rationale:
        'Earth Nodes push red-gold life force from deep plasma–crystalline junctions; Harmonic Lenses form around nodes to focus and redirect vibrational energy.'
    }
  ],
  14: [
    {
      text: 'They act as living beacons and antennas whose frequency reactivates dormant crystals and nodes they walk over.',
      rationale:
        'Resonating souls function as living beacons and antennas; their inherent frequency automatically reactivates the dormant crystals and nodes they walk over, initiating collapse of the parasitic illusion.'
    },
    {
      text: 'They must first install fiber-optic networks under every city before any crystal can ever reactivate.',
      rationale:
        'True communication uses electro-magnetic and sub-crystalline bands, not dense 3D fiber; souls reactivate nodes simply by frequency and presence.'
    },
    {
      text: 'They permanently destroy every Planetary Crystal so the grid can never hum with Source codes again.',
      rationale:
        'Resonating souls reactivate dormant crystals and nodes; they do not destroy Planetary Crystals that stabilize the core with Source codes.'
    },
    {
      text: 'They only harvest Loosh for parasites whenever they walk across a major crystalline node site.',
      rationale:
        'Souls must starve parasites of fear and emotional reaction; their high frequency reactivates the grid rather than serving as Loosh harvesters.'
    }
  ],
  15: [
    {
      text: 'To realign the light body grid and clear parasitic overlays using living crystal walls and rainbow fractals.',
      rationale:
        'Healing sanctuaries like Crystal Halls utilize living crystal walls and rainbow fractals to realign the light body grid and clear parasitic overlays from the mind.'
    },
    {
      text: 'To store black cube valve tech that siphons Spirit Tree light into artificial reincarnation hardware only.',
      rationale:
        'Black cube valve tech is the Saturn moon station after Spirit Tree removal; Crystal Halls heal by realigning the light body and clearing parasitic overlays.'
    },
    {
      text: 'To block leylines with concrete walls so no harmonic current can enter a healing sanctuary space.',
      rationale:
        'Concrete blocks natural grid flow in parasitic architecture; Crystal Halls use living crystal and rainbow fractals for light-body realignment and clearing.'
    },
    {
      text: 'To project zodiac personality charts without any effect on the light body or parasitic mind overlays.',
      rationale:
        'Crystal Halls clear parasitic overlays and realign the light body grid; they are not mere projection of personality charts.'
    }
  ],
  16: [
    {
      text: 'To block and short-circuit natural grid flow over major crystalline nodes and trap perception in dead frequency.',
      rationale:
        'Parasites overlaid modern 3D architecture — concrete, steel, plastic, and sharp right angles — directly on major crystalline nodes to block and short-circuit natural grid flow, trapping perception in a heavy, dead frequency.'
    },
    {
      text: 'To amplify Source codes through Planetary Crystals so cities hum with free life force for all inhabitants.',
      rationale:
        'Modern dead materials suppress the grid rather than amplify Source; they short-circuit nodes and trap perception in heavy, dead frequency.'
    },
    {
      text: 'To grow motherships from crystalline plasma using concrete frames as the preferred living architecture medium.',
      rationale:
        'Motherships are grown from crystalline plasma; concrete and steel are anti-resonance materials used to block grid flow, not living craft mediums.'
    },
    {
      text: 'To mark Surface Nodes with temples and pyramids so leylines can be found and restored more easily.',
      rationale:
        'Ancient temples and pyramids mark Surface Nodes as original resonant instruments; modern concrete and right angles are parasitic short-circuits over nodes.'
    }
  ],
  17: [
    {
      text: 'Remnants of original resonant crystalline instruments of the living grid architecture.',
      rationale:
        'Ancient sites, cathedrals, star forts, and old brick aqueducts are the true remnants of original resonant crystalline instruments, not mere dead historical scenery.'
    },
    {
      text: 'Purely decorative monuments with no energetic function in the crystalline network of the realm.',
      rationale:
        'These structures are functional remnants of resonant crystalline instruments within the original grid architecture.'
    },
    {
      text: 'Modern parasitic cages of concrete and steel designed only to drain inhabitants of all resonance.',
      rationale:
        'Concrete and steel cages are the modern overlay; cathedrals, star forts, and aqueducts are original resonant crystalline instruments.'
    },
    {
      text: 'Empty shells that never interacted with nodes, leylines, or harmonic currents in any era.',
      rationale:
        'They sit within the original resonant architecture of the grid as crystalline instruments, not as empty non-energetic shells.'
    }
  ],
  18: [
    {
      text: 'False — they are upper dome frequencies bleeding through as a photonic song with the earth\'s crystalline grid.',
      rationale:
        'Northern Lights are not distant solar fires; they are the visual bleeding-through of upper dome frequencies interacting with the earth\'s crystalline grid, a photonic song of communication.'
    },
    {
      text: 'True — they are only distant solar fires from the sun\'s radiation with no grid or dome communication role.',
      rationale:
        'That is the false explanation; Northern Lights are upper dome frequencies interacting with the crystalline grid as photonic song.'
    },
    {
      text: 'True — they prove that infinite outer space alone generates all atmospheric light without crystalline grids.',
      rationale:
        'The sky is a layered projection field of star-nodes within the CUBE; Northern Lights are photonic communication with the earth\'s crystalline grid.'
    },
    {
      text: 'False — because Northern Lights are only street lamps reflected off low clouds in modern cities.',
      rationale:
        'They are atmospheric phenomena of upper dome frequencies meeting the crystalline grid, not urban light reflection.'
    }
  ],
  19: [
    {
      text: 'To pass energy and data instantly beneath the earth, vastly outperforming undersea fiber-optic cables.',
      rationale:
        'The sub-crystalline band passes energy and data instantly beneath the earth, vastly outperforming any physical undersea fiber-optic cables of dense 3D technology.'
    },
    {
      text: 'To replace all Planetary Crystals so Source codes no longer stabilize the deep core framework at all.',
      rationale:
        'Planetary Crystals still stabilize the core; the sub-crystalline band is the instant energy and data path beneath the earth, not a crystal replacement.'
    },
    {
      text: 'To power only cellular towers and fiber networks as the superior path of true Light Grid communication.',
      rationale:
        'True communication uses electro-magnetic and sub-crystalline bands, not dense cellular towers or fiber; the band outperforms fiber-optics.'
    },
    {
      text: 'To lock zodiac gates permanently so no data can move between sky nodes and earth nodes ever again.',
      rationale:
        'Zodiac locks restrict celestial gates; the sub-crystalline band\'s role is instant energy and data transfer beneath the earth.'
    }
  ],
  20: [
    {
      text: 'They hold the portals between different overlays and realms as higher-frequency light grid anchors.',
      rationale:
        'Inter-dimensional Nodes are higher-frequency light grid anchors that hold the portals between different overlays and realms, unlike Surface Nodes that connect earth to sky at leyline crossings.'
    },
    {
      text: 'They sit only at temples and pyramids as surface harmonic points with no portal function between overlays.',
      rationale:
        'That describes Surface Nodes; Inter-dimensional Nodes specifically hold portals between overlays and realms.'
    },
    {
      text: 'They push red-gold life force from deep lava-like spheres and never manage inter-realm portal gates.',
      rationale:
        'Earth Nodes push red-gold life force from deep plasma–crystalline spheres; Inter-dimensional Nodes hold portals between overlays.'
    },
    {
      text: 'They only project the sun\'s path across countries without anchoring any inter-dimensional portal lattice.',
      rationale:
        'Sky and star-node projection relates to atmospheric lattice and overlays; Inter-dimensional Nodes are the portal anchors between overlays and realms.'
    }
  ],
  21: [
    {
      text: 'To hold high resonance and starve parasitic systems of emotional reactions and fear.',
      rationale:
        'To fully restore the network, souls must hold high resonance and starve the parasitic systems of emotional reactions and fear while recognizing true Light Grid communication.'
    },
    {
      text: 'To build more concrete cities over every major node so parasites lose interest in the crystalline grid.',
      rationale:
        'Concrete over nodes blocks the grid; restoration requires high resonance and starving parasites of fear, not more dead architecture.'
    },
    {
      text: 'To rely only on undersea cables and cellular towers as the official path of Light Grid restoration.',
      rationale:
        'True communication uses electro-magnetic and sub-crystalline bands, not dense 3D cables and towers; souls restore by holding high resonance.'
    },
    {
      text: 'To increase Loosh output through fear so the Saturn moon station can power healthier reincarnation loops.',
      rationale:
        'Souls must starve parasites of fear and emotional reaction; the Saturn moon station siphons grid light for artificial reincarnation loops, which is not a restoration goal.'
    }
  ],
  22: [
    {
      text: 'Crystals — physical and etheric hard drives that store memory, frequency, and resonance codes.',
      rationale:
        'Crystals are physical and etheric hard drives of the grid that store memory, frequency, and resonance codes, and they operate as eternal memory banks recording soul journeys and unbroken timelines.'
    },
    {
      text: 'Fiber-optic cables — the only hard drives capable of storing soul journeys across unbroken timelines.',
      rationale:
        'Fiber-optics underperform the sub-crystalline band; crystals are the hard drives that store memory, frequency, and resonance codes.'
    },
    {
      text: 'Sharp right-angle steel frames — modern architecture that alone records every soul history forever.',
      rationale:
        'Steel and right angles block grid flow; crystals store memory and resonance codes as the grid\'s hard drives.'
    },
    {
      text: 'Zodiac star signs — personality locks that replace crystals as the universe\'s only memory banks.',
      rationale:
        'Zodiac signs are grid locks on celestial gates; crystals are the hard drives and memory banks of the living grid.'
    }
  ],
  23: [
    {
      text: 'It is one of the seven outer domes bridged to the Great Dome by the crystalline networks.',
      rationale:
        'Crystalline networks bridge the physical Great Dome to the seven outer domes, including the Dome of Forgotten Gods.'
    },
    {
      text: 'It is the only dome in existence and has no connection through any crystalline network at all.',
      rationale:
        'It is named among the seven outer domes connected by crystalline networks to the Great Dome, not a solitary disconnected dome.'
    },
    {
      text: 'It is a modern concrete city built solely to short-circuit Earth Nodes under a single nation-state.',
      rationale:
        'The Dome of Forgotten Gods is an outer dome in the multi-dome architecture, not a modern concrete city block over Earth Nodes.'
    },
    {
      text: 'It replaces the CUBE Containment entirely so no eight-primary-dome framework remains in use.',
      rationale:
        'The CUBE houses all realms and the eight primary domes; the Dome of Forgotten Gods is one of the outer domes linked by crystalline networks.'
    }
  ],
  24: [
    {
      text: 'The crystalline grid seamlessly connects the Great Dome to other domes, worlds, and environments.',
      rationale:
        'Crystalline networks store memory, maintain frequencies, and seamlessly connect all domes and environments, bridging the Great Dome to the seven outer domes within the CUBE.'
    },
    {
      text: 'The Great Dome stands fully isolated with no crystalline link to any outer dome or environment.',
      rationale:
        'The grid bridges the Great Dome to outer domes and connects all environments; isolation is not the architecture of the crystalline networks.'
    },
    {
      text: 'The Great Dome is powered only by fiber-optic rings that ignore crystals, nodes, and leylines entirely.',
      rationale:
        'The living grid of crystals, nodes, and leylines is the connective architecture; fiber-optics are inferior dense 3D technology.'
    },
    {
      text: 'The Great Dome exists outside the CUBE so crystalline networks never touch its structure at all.',
      rationale:
        'Everything operates within CUBE containment; crystalline networks connect the Great Dome and outer domes inside that framework.'
    }
  ],
  25: [
    {
      text: 'Through harmonic tone and telepathic intention that the crystalline-plasma craft responds to as a living system.',
      rationale:
        'Motherships and Arks are semi-conscious crystalline-plasma constructs that respond telepathically to a pilot\'s harmonic tone and intention rather than dead mechanical controls.'
    },
    {
      text: 'Through steel levers and plastic buttons identical to ordinary 3D aircraft with no harmonic response at all.',
      rationale:
        'True craft respond to harmonic tone and telepathic intention; they are not operated like dead mechanical 3D vehicles.'
    },
    {
      text: 'Through fiber-optic remote control from undersea cables that override any pilot resonance or tone.',
      rationale:
        'Pilots interface via harmonic tone and intention with living crystalline plasma; dense 3D remote systems are not the true control method.'
    },
    {
      text: 'Through fear-based Loosh spikes that force the craft to obey regardless of the pilot\'s internal resonance.',
      rationale:
        'Craft respond to harmonic tone and telepathic intention; souls restore the network by starving fear, not by fueling Loosh control of living vehicles.'
    }
  ]
};

const questionOverrides = {
  10: 'What do the astrological zodiac and star signs actually represent in the sky projection field?',
  12: 'Are physical distance and ordinary travel natural constants that the crystalline grid cannot bypass?',
  15: 'What is the purpose of Crystal Halls within the living crystalline architecture?',
  18: 'Are the Northern Lights distant solar fires caused only by the sun\'s radiation?'
};

const hintOverrides = {
  1: 'Consider the architectural composition that holds all eight primary domes together.',
  2: 'Reflect on the interaction between vibrational tones and visual manifestation before physicality.',
  3: 'Think about what happens when multiple leylines and energy streams meet at a single point.',
  4: 'These were previously perceived simply as stars, but they serve a complex data-driven purpose.',
  5: 'Look for their original role in bringing high-frequency energy down into physical density.',
  6: 'These are the giant, round structures located deep within the earth\'s interior.',
  7: 'The process is organic and involves condensed liquid crystal fire and light.',
  8: 'Consider what replaced the tree as the central anchor for energy harvesting.',
  9: 'These nodes are lava-like spheres that feed the upper grid with red-gold life force.',
  10: 'Think about how these celestial patterns restrict or anchor gates in the atmospheric lattice.',
  11: 'This occurs as true harmonic reality begins to override parasitic interference.',
  12: 'Consider the role of the sub-crystalline band in transmitting data and energy.',
  13: 'Think of how a lens focuses light, applied here to vibrational rhythm around nodes.',
  14: 'Consider how a person\'s frequency alone can impact the crystals under their feet.',
  15: 'These sanctuaries use living crystal walls and rainbow fractals for purification and alignment.',
  16: 'Consider the effect of these materials when placed directly over major crystalline nodes.',
  17: 'These buildings served a functional energetic purpose within the original grid architecture.',
  18: 'Think about the photonic song of communication between upper domes and the earth\'s grid.',
  19: 'It is described as a high-performance alternative to undersea fiber-optic cables.',
  20: 'Focus on the inter-dimensional aspect and portals between different states of existence.',
  21: 'The strategy involves an internal frequency shift rather than denser external technology.',
  22: 'These components appear in both physical form and the etheric layer of the grid.',
  23: 'This dome is named among the broader system of multiple outer domes.',
  24: 'Think of the grid as the connective tissue for the entire dome complex.',
  25: 'The interaction is based on sound and thought rather than physical manipulation.'
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

const topicImage = 'images/breakdown/crystalline-networks.webp';
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
    'Test your grasp of Crystalline Networks — CUBE Containment, crystals as hard drives, Earth/Surface/Sky/Inter-dimensional Nodes, Harmonic Lenses, Spirit Tree inversion, and resonating souls as living beacons.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Crystalline Networks are the living circuitry of the CUBE — crystals as memory hard drives, nodes as power relays, Harmonic Lenses shaping the realm\'s heartbeat, and star-nodes holding the sky projection field. Sit with the Spirit Tree\'s removal and Saturn moon valve tech, the sub-crystalline band that outruns fiber, and your own frequency as a living beacon that reactivates dormant nodes. Return to the Crystalline Networks deep-dive, infographic, and video transmissions to lock into the living crystalline temple beneath the overlay.'
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
    'Test your understanding of Crystalline Networks — CUBE Containment, crystals as hard drives, node tiers, Harmonic Lenses, Spirit Tree inversion, sub-crystalline communication, and resonating souls as living beacons.'
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
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('crystalline-networks not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'harmonic-lenses.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Harmonic Lenses Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Harmonic Lenses: frequency blooms around Energy Nodes, the Crystalline Grid, four node types, parasitic Loosh inversion, Thuban and Star-Nodes, and awakened souls as living lenses.',
    'Interactive Living Truth Quiz on Crystalline Networks: CUBE Containment, crystals as hard drives, Earth/Surface/Sky/Inter-dimensional Nodes, Harmonic Lenses, Spirit Tree inversion, and resonating souls as living beacons.'
  ],
  ['quiz/breakdown/harmonic-lenses.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/harmonic-lenses.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=harmonic-lenses',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Harmonic Lenses deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Harmonic Lenses</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/harmonic-lenses.json',
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
    "  { path: '/quiz/breakdown/harmonic-lenses.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/crystalline-networks.json'
);
