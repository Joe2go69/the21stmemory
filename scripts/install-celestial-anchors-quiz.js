/**
 * Installs Celestial Anchors quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/node-quiz.json
 * Audits all 25 items against data/breakdown-topics/celestial-anchors.json.
 * Run: node scripts/install-celestial-anchors-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/celestial-anchors.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'celestial-anchors';
const TOPIC_TITLE = 'Celestial Anchors';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/node-quiz.json';

const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

/** Support phrases grounded only in celestial-anchors.json report. */
const supportPhrases = {
  1: ['energy nodes', 'neutral relay', 'crystalline grids'],
  2: ['crystalline star-nodes', 'holographic dome', 'data crystals'],
  3: ['zodiac star-signs', 'frequency', 'lock', 'seal'],
  4: ['axis laburnum', 'vertical', 'heavens'],
  5: ['earth nodes', 'deep underground', 'plasma', 'crystalline veins'],
  6: ['inter-dimensional', 'rainbow', 'liquid silver'],
  7: ['thuban', 'aru-el-nai', 'spirit tree', 'hyperborea'],
  8: ['harmonic lenses', 'glass lens', 'shape'],
  9: ['northern lights', 'photonic song', 'breath of the overlays'],
  10: ['resonating sols', 'heart', 'stillness', 'living harmonic lens'],
  11: ['flicker', 'open stargate', 'parasitic locks'],
  12: ['tara', 'andromeda', 'lyra'],
  13: ['polaris', 'redirected beacon', 'false illusion'],
  14: ['dead pixels', 'illusion stars', 'sealed'],
  15: ['northern lights', 'photonic song', 'crystalline grid'],
  16: ['resonating sols', 'lava nodes', 'sky nodes'],
  17: ['surface nodes', 'temples', 'pyramids', 'stone circles'],
  18: ['store', 'codes', 'history', 'frequency templates'],
  19: ['harmonic lenses', 'heartbeat of the realms'],
  20: ['spirit tree', 'hyperborea', 'thuban'],
  21: ['light web', 'strengthen', 'freed'],
  22: ['four', 'earth', 'surface', 'sky', 'inter-dimensional'],
  23: ['energy nodes', 'architecture of reality', 'invisible'],
  24: ['earth nodes', 'ley-lines', 'magnetic resonance'],
  25: ['burning gas', 'crystalline projectors', 'vacuum']
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
    [/^According to the living truth,?\s*/i, ''],
    [/\baccording to the (report|source|text|core revelations|revelations|material|journal|living truth)\b/gi, ''],
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
    [/^The text focuses on\s+/i, ''],
    [/^The material suggests that\s+/i, ''],
    [/^The material clarifies that\s+/i, ''],
    [/^The material reveals that\s+/i, ''],
    [/^The material states that\s+/i, ''],
    [/^The material explains that\s+/i, ''],
    [/^The journal states that\s+/i, ''],
    [/^The journal clarifies that\s+/i, ''],
    [/^The journal attributes\s+/i, ''],
    [/^The journal frames\s+/i, ''],
    [/^The journal explicitly states that\s+/i, ''],
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
    [/\bthe journal states\b/gi, ''],
    [/\bthe journal clarifies that\b/gi, ''],
    [/\bthe journal explicitly states that\b/gi, ''],
    [/\bwhich the source material identifies as\b/gi, 'which is'],
    [/\bwhich the source material identifies\b/gi, 'which is'],
    [/\bThe journal attributes star behavior to\b/gi, 'Star behavior reflects'],
    [/\bThe journal frames Polaris as\b/gi, 'Polaris is'],
    [/\bThis is the core premise of the 'Celestial Anchors' overview\.\b/gi, 'Energy Nodes form the invisible framework of crystalline grids.'],
    [/\bThis is the foundational definition of nodes provided in the text\.\b/gi, 'Energy Nodes form that invisible relay framework.']
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
 * Grounded only in celestial-anchors report. All four at similar depth.
 */
const fullOptionSets = {
  1: [
    {
      text: 'They serve as neutral relay stations that balance the physical plane with higher realms through crystalline grids.',
      rationale:
        'Energy Nodes are neutral relay stations and spheres of living energy where life-force and magnetism converge, forming crystalline grids that keep the physical plane balanced and aligned with higher realms.'
    },
    {
      text: 'They act only as physical heat reservoirs that maintain atmospheric temperature across the entire planet.',
      rationale:
        'Earth Nodes involve molten-fire energy, but the primary function of Energy Nodes is grid balance and dimensional alignment through relay of life-force and magnetism, not simple temperature control.'
    },
    {
      text: 'They function as storage vaults for the physical mass of distant suns burning in an empty vacuum.',
      rationale:
        'Stars are crystalline projectors and data nodes rather than physical mass warehouses; Energy Nodes relay life-force and magnetism through the grids rather than storing stellar mass.'
    },
    {
      text: 'They are biological sensors designed only to track the movement of living beings across the surface.',
      rationale:
        'Energy Nodes are energetic and crystalline relay stations of life-force and magnetism, not biological tracking sensors for surface populations.'
    }
  ],
  2: [
    {
      text: 'Localized multidimensional Crystalline Star-Nodes that project and anchor the holographic dome.',
      rationale:
        'Celestial bodies visible from the Known Lands are localized multidimensional Crystalline Star-Nodes — data crystals that store codes, history, and frequency templates and anchor the holographic sky dome.'
    },
    {
      text: 'Distant physical suns composed of burning gas floating in an empty infinite vacuum of space.',
      rationale:
        'Stars are not random balls of burning gas in a vacuum; they are highly advanced crystalline projectors and multidimensional data centers sustaining the simulated cosmos.'
    },
    {
      text: 'Electromagnetic sparks generated solely by friction along the Axis Laburnum spinal bridge alone.',
      rationale:
        'The Axis Laburnum transmits order between earth grids and star-nodes, but the stars themselves are Crystalline Star-Nodes and living gates, not mere friction sparks.'
    },
    {
      text: 'Passive reflections of the sun bouncing off an icy firmament without any data or gate function.',
      rationale:
        'The sky is a layered projection field, yet stars are active data centers and living gates — Crystalline Star-Nodes — not merely passive reflections of sunlight.'
    }
  ],
  3: [
    {
      text: 'They are frequency keys and lock codes that seal Crystalline Star-Nodes into dead illusion stars.',
      rationale:
        'Zodiac Star-Signs are frequency lock codes and grid locks imposed by parasitic forces to seal Crystalline Star-Nodes, turning living gates into dead illusion stars to prevent travel.'
    },
    {
      text: 'They serve as free navigational markers that open stargates for all inter-dimensional travelers.',
      rationale:
        'Original celestial anchors served as open portals, but Zodiac Star-Signs themselves are the locks that seal those nodes rather than free navigational openers for travelers.'
    },
    {
      text: 'They provide only a benign map of spiritual evolution and personality traits for human growth.',
      rationale:
        'That is the false narrative presented to humanity; Zodiac Star-Signs are the exact frequency keys and lock codes placed upon sealed gate clusters.'
    },
    {
      text: 'They coordinate only seasonal agricultural cycles of the physical plane without energetic effect.',
      rationale:
        'Zodiac Star-Signs function as parasitic frequency locks on star-node gates, not as mere agricultural calendars without energetic control purpose.'
    }
  ],
  4: [
    {
      text: 'Axis Laburnum — the vertical harmonic bridge rooting in earth grids and branching to star-nodes.',
      rationale:
        'Axis Laburnum is the vertical harmonic bridge and current of order that roots in the crystalline grids of the Earth and branches to the celestial field of star-nodes, acting as the spinal column of the realm\'s energy body.'
    },
    {
      text: 'Harmonic Lattice — only the surface pattern of auroras without any vertical bridge to the stars.',
      rationale:
        'Sky Nodes project the Harmonic Lattice of the dome; Axis Laburnum is the specific vertical bridge connecting earth grids to the celestial field of star-nodes.'
    },
    {
      text: 'Prana Stream — free energy flow through portals without forming a vertical spinal bridge structure.',
      rationale:
        'Prana Streams flowed freely through open celestial portals; Axis Laburnum is the named vertical harmonic bridge keeping heavens aligned with the physical plane.'
    },
    {
      text: 'Solar Wind — surface atmospheric current that replaces the need for any crystalline vertical axis.',
      rationale:
        'Solar Winds were part of free energy flow through open stargates; the vertical bridge structure is Axis Laburnum, not solar wind alone.'
    }
  ],
  5: [
    {
      text: 'Deep underground where plasma and crystalline veins intersect as molten-fire Earth Nodes.',
      rationale:
        'Earth Nodes (Lava/Core Nodes) are deep underground spheres of molten-fire energy where plasma and crystalline veins intersect, pushing life-force up through ley-lines and stabilizing the dome\'s magnetic resonance.'
    },
    {
      text: 'At the highest peaks of mountain ranges where surface temples alone house all core fire energy.',
      rationale:
        'Mountain and temple sites more often host Surface Nodes; Earth Nodes are specifically deep underground at the plasma–crystalline junction.'
    },
    {
      text: 'In the upper atmosphere where magnetic resonance meets the dome as bright projected stars only.',
      rationale:
        'That region relates to Sky Nodes and the Harmonic Lattice; Earth Nodes sit deep underground where plasma and crystalline veins meet.'
    },
    {
      text: 'In the center of stone circles and pyramids as the only sites of molten subterranean power.',
      rationale:
        'Stone circles and pyramids mark Surface Nodes where energy lines cross; Earth Nodes are deep underground molten-fire cores, not surface monument centers alone.'
    }
  ],
  6: [
    {
      text: 'Rainbow balls or liquid silver orbs holding portals between overlays as high-frequency spheres.',
      rationale:
        'Inter-dimensional Nodes (Light Grid Anchors) are invisible high-frequency spheres holding portals between overlays, appearing to advanced sight as rainbow balls or liquid silver orbs.'
    },
    {
      text: 'Blue or white humming tones found only at ancient temples, pyramids, and stone circle sites.',
      rationale:
        'Blue or white humming tones characterize Surface (Harmonic) Nodes; Inter-dimensional Nodes appear as rainbow balls or liquid silver orbs to advanced sight.'
    },
    {
      text: 'Bright flickering stars fixed only in the constellation of Lyra as ordinary sky projectors.',
      rationale:
        'Bright stars are Sky Nodes (Celestial Anchors); Inter-dimensional Nodes are typically invisible high-frequency portal spheres appearing as rainbow or silver orbs.'
    },
    {
      text: 'Glowing veins of molten plasma running only beneath the crust as Earth Node fire channels.',
      rationale:
        'Molten plasma–crystalline junctions describe Earth Nodes; Inter-dimensional Nodes are high-frequency portal spheres that appear as rainbow balls or liquid silver orbs.'
    }
  ],
  7: [
    {
      text: 'Thuban (Aru-el-nai), the true central node linking the celestial plane to the Spirit Tree in Hyperborea.',
      rationale:
        'The true axis of the celestial network originally aligned with Thuban (Aru-el-nai), the true central node of the old grids that linked the celestial plane to the Spirit Tree in Hyperborea before parasites rotated the dome to Polaris.'
    },
    {
      text: 'Andromeda alone, named only as a physical planet that replaced every central grid alignment node.',
      rationale:
        'Andromeda is a realm once reachable through open stargates; the true central alignment node of the old grids was Thuban (Aru-el-nai), not Andromeda as a replacement north.'
    },
    {
      text: 'Polaris, which has always been the original unaltered north and Spirit Tree link of the old grids.',
      rationale:
        'Polaris is the parasitic "new north" — a redirected beacon and mask; the original central node was Thuban (Aru-el-nai) linked to the Spirit Tree in Hyperborea.'
    },
    {
      text: 'The Sun, which alone served as the sole central alignment node for all crystalline sky grids forever.',
      rationale:
        'Sun, moon, and star-node frequencies balance Harmonic Lenses; the true central celestial alignment node of the old grids was Thuban (Aru-el-nai).'
    }
  ],
  8: [
    {
      text: 'They form frequency patterns around active nodes that shape energy as a glass lens shapes light.',
      rationale:
        'Harmonic Lenses are the pattern of frequency that forms around an active node, shaping energy exactly as a glass lens shapes light, pulsing with the heartbeat of the realms as crystalline blooms that open and close.'
    },
    {
      text: 'They permanently block all solar winds so no energy can enter the physical plane from the sky.',
      rationale:
        'Harmonic Lenses shape, balance, and relay light with sun, moon, and star-node frequencies; they do not exist to permanently block solar winds from the plane.'
    },
    {
      text: 'They act only as fixed mirrors that bounce the 3D Overlay downward without shaping living energy.',
      rationale:
        'While the dome projects overlays, Harmonic Lenses specifically form around active nodes to shape and relay energy like a glass lens, not as passive overlay mirrors alone.'
    },
    {
      text: 'They are buried physical glass lenses at ley-line crossings with no frequency pattern function.',
      rationale:
        'Harmonic Lenses are patterns of frequency around active nodes — crystalline blooms — not physical buried glass objects at crossings.'
    }
  ],
  9: [
    {
      text: 'The Northern Lights — breath of the overlays and Photonic Song through magnetic nodes.',
      rationale:
        'The Northern Lights are a direct visual manifestation of upper domes communicating with Earth\'s Crystalline Grid through Photonic Song, bleeding bridge frequencies through magnetic nodes as the breath of the overlays.'
    },
    {
      text: 'Tectonic plate shifts that move crustal plates without any photonic or overlay communication role.',
      rationale:
        'Tectonic shifts are physical crustal motion; the breath of the overlays is Photonic Song visible as the Northern Lights communicating through magnetic nodes.'
    },
    {
      text: 'Solar flares alone that heat the atmosphere without bridging upper domes to the crystalline grid.',
      rationale:
        'The breath of the overlays is specifically the Northern Lights as Photonic Song between upper domes and Earth\'s Crystalline Grid, not solar flares alone.'
    },
    {
      text: 'The rising of the moon each night as the sole visual of bridge frequencies through magnetic nodes.',
      rationale:
        'Moon frequencies participate in Harmonic Lens rhythm, but the named visual of Photonic Song and the breath of the overlays is the Northern Lights.'
    }
  ],
  10: [
    {
      text: 'By aligning their heart and breathing in stillness with the Earth as a living harmonic lens.',
      rationale:
        'When a human aligns their heart and breathes in stillness with the Earth, they become a living harmonic lens, healing the grid, collapsing the parasitic 3D Overlay, and unlocking the Star Gate network as Resonating Sols bridge lava and sky nodes.'
    },
    {
      text: 'By traveling only to physical portals at the North Pole without any heart or breath alignment.',
      rationale:
        'Unlocking is an energetic process of becoming a living harmonic lens through heart alignment and stillness with Earth, not mere physical travel to polar coordinates.'
    },
    {
      text: 'By calculating exact astronomical coordinates of constellations as if they were free open maps.',
      rationale:
        'Constellations as Zodiac Star-Signs are frequency locks; awakening works through heart alignment and stillness, not astronomical coordinate calculation of the false map.'
    },
    {
      text: 'By studying traditional personality meanings of Zodiac Star-Signs as if they open free travel.',
      rationale:
        'Zodiac Star-Signs are parasitic locks on star-nodes; Resonating Sols unlock gates by rejecting false astrological narratives and aligning heart and breath with Earth.'
    }
  ],
  11: [
    {
      text: 'It is transitioning from a sealed state back to an open stargate as parasitic locks fail.',
      rationale:
        'When a star flickers or appears non-standard, it is actively transitioning from a sealed state back to an open stargate, re-tuning to its original frequency as parasitic locks fail and the Light Web strengthens.'
    },
    {
      text: 'The star is dying as hydrogen fuel runs out in a distant physical sun of burning gas.',
      rationale:
        'Stars are not burning-gas suns losing hydrogen; flickering marks re-tuning from sealed illusion stars back toward open stargate function.'
    },
    {
      text: 'It is only obscured by physical debris in the upper atmosphere with no frequency transition.',
      rationale:
        'Star behavior is attributed to frequency and grid state — failing parasitic locks and reopening stargates — not mere physical atmospheric debris.'
    },
    {
      text: 'The entire projection dome is suffering permanent irreversible hardware failure with no re-tuning.',
      rationale:
        'Flickering is a transition and re-tuning of individual nodes back to open stargate frequency, not permanent dome-wide hardware failure without restoration.'
    }
  ],
  12: [
    {
      text: 'Tara, Andromeda, and Lyra through open celestial portals and stargates.',
      rationale:
        'Originally, celestial anchors served as open portals and stargates to realms such as Tara, Andromeda, and Lyra, facilitating free flow of Prana Streams, Solar Winds, and Living Plasma.'
    },
    {
      text: 'Only the Inner Earth and Agartha with no link to sky-node stargates or higher realms.',
      rationale:
        'Celestial anchors specifically linked sky-side portals to higher realms such as Tara, Andromeda, and Lyra; those named realms are the original stargate destinations in this transmission.'
    },
    {
      text: 'Mars, Venus, and Jupiter as ordinary planetary destinations of the localized solar system only.',
      rationale:
        'Original open portals led to higher realms such as Tara, Andromeda, and Lyra rather than ordinary planetary destinations of a conventional solar-system map.'
    },
    {
      text: 'Only the Astral Plane and the Void without named crystalline realm destinations or stargates.',
      rationale:
        'Gates are crystalline multidimensional connections to specific realms including Tara, Andromeda, and Lyra, not only vague planes like the Void.'
    }
  ],
  13: [
    {
      text: 'A redirected beacon and mask designed to stabilize the false illusion and orient navigation to control.',
      rationale:
        'Parasitic forces rotated the projection dome to establish a "new north," replacing Thuban with Polaris — a redirected beacon and mask designed to keep the false illusion stable and orient all navigation toward their control node.'
    },
    {
      text: 'The natural result of the Earth\'s axial precession without any parasitic rotation of the dome.',
      rationale:
        'The shift to Polaris is a deliberate parasitic rotation of the projection dome, not a natural physical axial precession of a spinning globe earth.'
    },
    {
      text: 'The primary source of Prana Streams feeding the Spirit Tree in place of Thuban forever.',
      rationale:
        'The Spirit Tree in Hyperborea was linked through Thuban (Aru-el-nai); Polaris is a control mask, not the primary Prana source for the Spirit Tree.'
    },
    {
      text: 'The ultimate free destination for all spiritual souls seeking exit from the Known Lands.',
      rationale:
        'Polaris is framed as a parasitic control beacon and mask for the false illusion, not a free spiritual destination for liberated souls.'
    }
  ],
  14: [
    {
      text: 'Illusion stars sealed and converted into static points after parasitic frequency grids scrambled the maps.',
      rationale:
        'During the parasitic takeover, negative frequency grids scrambled original star-node maps, sealing portals and converting them into static "dead pixels" or illusion stars.'
    },
    {
      text: 'Shadows cast by the moon on the holographic lattice without sealing any star-node portals.',
      rationale:
        'Dead pixels refer to sealed star-nodes converted into static illusion stars, not mere lunar shadows on the lattice.'
    },
    {
      text: 'Physical meteors that entered the atmosphere and permanently replaced every crystalline star-node.',
      rationale:
        'Dead pixels describe the sealed state of Crystalline Star-Nodes under parasitic lock, not physical meteors replacing nodes.'
    },
    {
      text: 'Empty sky regions where no stars appear and no node data or lock history exists at all.',
      rationale:
        'Dead pixels refer to the sealed state of the nodes themselves — static illusion stars — not empty starless regions of the sky.'
    }
  ],
  15: [
    {
      text: 'False — they are Photonic Song and the breath of the overlays communicating with Earth\'s Crystalline Grid.',
      rationale:
        'The Northern Lights are not mere solar radiation on a physical magnetic sphere; they are Photonic Song and the breath of the overlays where upper domes communicate with Earth\'s Crystalline Grid through magnetic nodes.'
    },
    {
      text: 'True — they are only solar radiation striking a physical spherical planet\'s magnetic field with no photonic grid role.',
      rationale:
        'That is the conventional materialist explanation; the auroras are Photonic Song and the breath of the overlays communicating with the Crystalline Grid.'
    },
    {
      text: 'True — they are permanent hardware failures of the projection dome with no communication function.',
      rationale:
        'Northern Lights are intentional visual communication — Photonic Song between upper domes and the Crystalline Grid — not permanent hardware failures of the dome.'
    },
    {
      text: 'False — they are only reflections of city lights with no magnetic nodes or crystalline grid contact.',
      rationale:
        'They are not city-light reflections; they are Photonic Song and the breath of the overlays bleeding bridge frequencies through magnetic nodes into the Crystalline Grid.'
    }
  ],
  16: [
    {
      text: 'True — Resonating Sols act as powerful nodes bridging subterranean lava nodes and celestial sky nodes.',
      rationale:
        'Resonating Sols incarnated on Earth act as powerful nodes themselves, forming a critical bridge between subterranean lava nodes and celestial sky nodes, becoming living harmonic lenses when aligned in stillness.'
    },
    {
      text: 'False — Resonating Sols remain fully disconnected from lava and sky nodes until they leave the body.',
      rationale:
        'Incarnated Resonating Sols already act as powerful nodes bridging lava and sky nodes; connection is active in embodiment through heart alignment and stillness.'
    },
    {
      text: 'False — only Sky Nodes can bridge tiers; human consciousness has no nodal role in the Light Web.',
      rationale:
        'Humans as Resonating Sols are powerful nodes bridging subterranean lava nodes and celestial sky nodes; consciousness is central to unlocking the Star Gate network.'
    },
    {
      text: 'True — Resonating Sols only store history in star-nodes and never bridge subterranean and celestial tiers.',
      rationale:
        'Crystalline Star-Nodes store codes and history; Resonating Sols specifically bridge lava nodes and sky nodes as living nodes and harmonic lenses.'
    }
  ],
  17: [
    {
      text: 'Where energy lines cross at ancient temples, stone circles, and pyramids humming blue or white.',
      rationale:
        'Surface Nodes (Harmonic Nodes) are found where energy lines cross at ancient temples, stone circles, and pyramids, humming in blue or white tones to amplify frequency and connect to celestial anchors above.'
    },
    {
      text: 'Only in the center of modern urban megacities with no ancient temples or stone circle markers.',
      rationale:
        'Surface Nodes are specifically identified at ancient temples, stone circles, and pyramids where energy lines cross, not exclusively at modern megacity centers.'
    },
    {
      text: 'Floating only in the upper atmosphere beside Sky Nodes with no ground-level energy-line crossings.',
      rationale:
        'Surface Nodes sit on the ground where energy lines cross; Sky Nodes are the atmospheric celestial anchors, not the surface harmonic sites.'
    },
    {
      text: 'Only inside volcanic ocean-floor chambers as the exclusive sites of all surface harmonic humming.',
      rationale:
        'Volcanic deep chambers relate to Earth (Lava) Nodes; Surface Nodes are at energy-line crossings marked by temples, pyramids, and stone circles.'
    }
  ],
  18: [
    {
      text: 'They store codes, history, and frequency templates for specific grid layers as living data crystals.',
      rationale:
        'Crystalline Star-Nodes are multidimensional data crystals in the sky that store codes, history, and frequency templates for specific grid layers, functioning as living gates between realms.'
    },
    {
      text: 'Their history is irrelevant because pure holograms never store codes, templates, or living gate data.',
      rationale:
        'Even as projectors of the holographic dome, Crystalline Star-Nodes are data crystals that store codes, history, and frequency templates for grid layers.'
    },
    {
      text: 'They are only physical ruins of past civilizations without multidimensional data or frequency templates.',
      rationale:
        'They are multidimensional data crystals and living gates, not physical ruins; they store codes, history, and frequency templates for grid layers.'
    },
    {
      text: 'They only record surface pedestrian traffic to predict future events without grid-layer templates.',
      rationale:
        'Star-nodes hold codes, history, and frequency templates for grid layers as living data crystals, not simple pedestrian surveillance logs.'
    }
  ],
  19: [
    {
      text: 'It forms Harmonic Lenses — crystalline blooms that open and close with sun, moon, and star-node frequencies.',
      rationale:
        'When an energy node activates, it forms Harmonic Lenses — crystalline blooms that open and close with the frequencies of the sun, moon, and star-nodes to balance and relay light, pulsing with the heartbeat of the realms.'
    },
    {
      text: 'It collapses local physical matter into a black hole without forming any harmonic frequency pattern.',
      rationale:
        'Node activation is a harmonic balancing process that forms Harmonic Lenses, not a destructive collapse of local matter into a black hole.'
    },
    {
      text: 'It causes the immediate physical manifestation of the Spirit Tree without any lens formation at all.',
      rationale:
        'The Spirit Tree is linked through Thuban and Hyperborea in the wider architecture; node activation primarily forms Harmonic Lenses that balance and relay light.'
    },
    {
      text: 'It permanently shuts down the parasitic 3D Overlay in that area without forming crystalline blooms.',
      rationale:
        'Living harmonic alignment helps collapse the parasitic 3D Overlay over time; the immediate described result of node activation is formation of Harmonic Lenses as crystalline blooms.'
    }
  ],
  20: [
    {
      text: 'Hyperborea, where the Spirit Tree linked the celestial plane through the true central node Thuban.',
      rationale:
        'Thuban (Aru-el-nai) directly linked the celestial plane to the Spirit Tree in Hyperborea as the true central node of the old grids before the dome was rotated to Polaris.'
    },
    {
      text: 'The Garden of Eden, named as the only realm holding the Spirit Tree and central sky alignment node.',
      rationale:
        'The named location of the Spirit Tree linked through Thuban is Hyperborea, not the Garden of Eden as a substitute label in this transmission.'
    },
    {
      text: 'Lemuria, described as the exclusive home of the Spirit Tree and Aru-el-nai central node link.',
      rationale:
        'Lemuria is not named regarding the Spirit Tree or central node; the Spirit Tree link through Thuban is placed in Hyperborea.'
    },
    {
      text: 'Atlantis, identified as the sole legendary realm of the Spirit Tree and original north alignment.',
      rationale:
        'Atlantis is not named as the Spirit Tree location; the Spirit Tree linked via Thuban (Aru-el-nai) is in Hyperborea.'
    }
  ],
  21: [
    {
      text: 'Their signals strengthen the entire Light Web as each freed node re-tunes to original frequency.',
      rationale:
        'As celestial nodes are freed from parasitic locks, their signals strengthen the entire Light Web while each re-tunes to its original frequency as stargates reopen.'
    },
    {
      text: 'They create only a temporary blackout in the projection dome with no strengthening of the network.',
      rationale:
        'Flickering can mark transition, but the overall result of freeing nodes is strengthened Light Web signals, not a mere temporary blackout without network gain.'
    },
    {
      text: 'They are redirected only into the Earth\'s core for permanent storage without network broadcast.',
      rationale:
        'Freed nodes strengthen the Light Web through clearer signals across the interstellar network, not one-way storage into the core alone.'
    },
    {
      text: 'They become scrambled further to hide from parasites instead of re-tuning to original frequency.',
      rationale:
        'The process is re-tuning to original frequency and strengthening the Light Web, not further scrambling of node signals for concealment.'
    }
  ],
  22: [
    {
      text: 'Four tiers: Earth (Lava/Core), Surface (Harmonic), Sky (Celestial), and Inter-dimensional Light Grid Anchors.',
      rationale:
        'The energy grid relies on a comprehensive four-tier node system: Earth Nodes (Lava/Core), Surface Nodes (Harmonic), Sky Nodes (Celestial Anchors), and Inter-dimensional Nodes (Light Grid Anchors).'
    },
    {
      text: 'Seven tiers corresponding only to a human chakra map without earth, surface, sky, or portal nodes.',
      rationale:
        'The grid structure is a four-tier node system of Earth, Surface, Sky, and Inter-dimensional nodes, not a seven-tier chakra-only scheme.'
    },
    {
      text: 'Three tiers labeled Ground, Sky, and Space without Inter-dimensional Light Grid Anchor spheres.',
      rationale:
        'Four distinct tiers are named, including Inter-dimensional Nodes (Light Grid Anchors), not a three-tier Ground–Sky–Space reduction.'
    },
    {
      text: 'Two tiers only — Physical and Celestial — with no surface harmonic or inter-dimensional portal nodes.',
      rationale:
        'The system includes four specialized tiers: Earth, Surface, Sky, and Inter-dimensional, not a simple two-tier physical/celestial split.'
    }
  ],
  23: [
    {
      text: 'True — reality is built on an invisible framework of Energy Nodes as neutral relay stations of living energy.',
      rationale:
        'The architecture of reality is constructed upon an invisible, dynamic framework of Energy Nodes — neutral relay stations and spheres of living energy forming crystalline grids that balance the physical plane with higher realms.'
    },
    {
      text: 'False — reality has no Energy Node framework and runs only on random physical particles without relays.',
      rationale:
        'Reality is constructed on Energy Nodes as the invisible relay framework of crystalline grids; the claim that no such framework exists is false.'
    },
    {
      text: 'False — Energy Nodes exist only as metaphors and never function as actual neutral relay stations.',
      rationale:
        'Energy Nodes are actual spheres of living energy and neutral relay stations where life-force and magnetism converge in the crystalline grids.'
    },
    {
      text: 'True — the architecture uses only Polaris as a single physical beam with no multi-node relay network.',
      rationale:
        'Polaris is a redirected parasitic beacon; the architecture is a multi-node Energy Node framework of crystalline grids, not a single Polaris beam system.'
    }
  ],
  24: [
    {
      text: 'Core Earth Nodes push life-force through ley-lines to stabilize the dome\'s magnetic resonance.',
      rationale:
        'Earth Nodes (Lava/Core Nodes) push life-force up through ley-lines and stabilize the dome\'s magnetic resonance from deep underground plasma–crystalline junctions.'
    },
    {
      text: 'Core nodes only pull magnetic energy away from the dome to maintain gravity without upward push.',
      rationale:
        'Earth Nodes push life-force upward through ley-lines to stabilize magnetic resonance; they do not only pull magnetism away for gravity.'
    },
    {
      text: 'Core nodes are unrelated to the dome and manage only rock chemistry of a physical planet crust.',
      rationale:
        'All four node tiers interconnect to maintain structural integrity of overlays; Earth Nodes specifically stabilize the dome\'s magnetic resonance via upward life-force flow.'
    },
    {
      text: 'The dome alone fuels the molten cores without any upward life-force push through ley-lines.',
      rationale:
        'Earth Nodes are described as pushing life-force up through ley-lines to stabilize magnetic resonance; the flow is not only dome-to-core fueling without that upward push.'
    }
  ],
  25: [
    {
      text: 'False — stars are highly advanced crystalline projectors and data centers, not burning gas in a vacuum.',
      rationale:
        'Far from being random balls of burning gas in an empty vacuum, the stars are highly advanced crystalline projectors that sustain the simulation of the cosmos as multidimensional Crystalline Star-Nodes.'
    },
    {
      text: 'True — stars are burning balls of gas in an empty vacuum with no crystalline projector function.',
      rationale:
        'That conventional model is rejected; stars are crystalline projectors and multidimensional data crystals anchoring the holographic dome.'
    },
    {
      text: 'True — stars are only icy firmament reflections with no codes, gates, or projector architecture.',
      rationale:
        'Stars are active Crystalline Star-Nodes and projectors storing codes and templates, not mere icy reflections without gate function.'
    },
    {
      text: 'False — stars do not exist at all and every night sky point is only a random empty-space glitch.',
      rationale:
        'Stars exist as Crystalline Star-Nodes and projectors; the falsehood is the burning-gas vacuum model, not the non-existence of celestial anchors.'
    }
  ]
};

const questionOverrides = {
  2: 'What are the stars visible in the night sky?',
  7: 'Which celestial alignment served as the true central node before the parasitic rotation of the dome?',
  15: 'Are the Northern Lights only solar radiation hitting the magnetic field of a physical sphere?',
  16: 'Do Resonating Sols act as nodes that bridge subterranean lava nodes and celestial sky nodes?',
  18: 'What is the relationship between star-nodes and history in the Crystalline Star-Node architecture?',
  23: 'Is the architecture of reality constructed upon an invisible framework of Energy Nodes as neutral relay stations?',
  25: 'Are the stars burning balls of gas in an empty vacuum?'
};

const hintOverrides = {
  1: 'Consider their role in the crystalline framework that connects different planes of existence.',
  2: 'Think of them as advanced projectors and data centers within a multidimensional simulation.',
  3: 'Focus on how parasitic forces used these patterns to control the star-nodes.',
  4: 'Look for the term that acts as the spinal column of the realm\'s energy body.',
  5: 'Think about where molten-fire energy and crystalline veins would logically meet.',
  6: 'These nodes hold the portals between different overlays of reality.',
  7: 'This star is also known as Aru-el-nai and linked the sky to the Spirit Tree.',
  8: 'Think of the behavior of a glass lens applied to living energy around a node.',
  9: 'This is a direct visual manifestation of Photonic Song.',
  10: 'The solution involves the human body acting as a living harmonic lens.',
  11: 'Think about the failing state of the parasitic locks on star-nodes.',
  12: 'These are multidimensional realms beyond the localized projection.',
  13: 'It acts as a substitute for the original central node to maintain control.',
  14: 'Consider the effect of frequency locks on active portals.',
  15: 'Contrast materialist auroras with Photonic Song and the breath of the overlays.',
  16: 'Think about the role of human consciousness as a bridge in the grid system.',
  17: 'These nodes bridge subterranean currents to the celestial field at ancient sites.',
  18: 'Think of them as hard drives for codes, history, and frequency templates.',
  19: 'Activation involves a rhythmic, light-shaping crystalline bloom.',
  20: 'This realm was directly linked to the celestial plane via Thuban.',
  21: 'Consider the collective effect of individual nodes opening on the Light Web.',
  22: 'Include subterranean, surface, atmospheric, and invisible portal nodes.',
  23: 'This is the foundational definition of nodes in the Overview.',
  24: 'Think about the direction of energy flow from the molten-fire centers.',
  25: 'The transmission offers a crystalline projector explanation for celestial bodies.'
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
    /\b(according to the (report|source|text|core revelations|revelations|material|living truth|journal|detailed mechanics)|the report states|the source (states|specifies|suggests|explicitly|identifies)|the text (states|describes|suggests|explicitly|mentions|defines|calls|focuses|identifies|confirms)|the material (clarifies|suggests|states|reveals|explains|identifies)|the journal (states|suggests|explicitly|clarifies|attributes|frames)|mentioned in the (text|source)|source material|living truth journal)\b/i;
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

const topicImage = 'images/breakdown/celestial-anchors.webp';
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
    'Test your grasp of Celestial Anchors — Sky Nodes and Crystalline Star-Nodes, Zodiac locks, Axis Laburnum, Thuban versus Polaris, four-tier nodes, and Resonating Sols as living lenses.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Celestial Anchors are Sky Nodes — Crystalline Star-Nodes that project the holographic dome, once open stargates to Tara, Andromeda, and Lyra, sealed as Zodiac locks, and now flickering back toward open gates on the Light Web. Sit with Thuban as the true north, Polaris as the redirected mask, Axis Laburnum as the spinal bridge, and your heart as a living harmonic lens bridging lava nodes and sky nodes. Return to the Celestial Anchors deep-dive, infographic, and video transmissions to lock into reclaiming the living sky.'
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
    'Test your understanding of Celestial Anchors — Sky Nodes, Crystalline Star-Nodes, Zodiac locks, Axis Laburnum, Thuban versus Polaris, four-tier node architecture, Photonic Song, and Resonating Sols as living harmonic lenses.'
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
      if (!t.description || t.description.includes('Decoded analysis of Celestial Anchors')) {
        t.description =
          'Celestial Anchors are Sky Nodes — Crystalline Star-Nodes that project the holographic dome, once open stargates to higher realms, sealed as Zodiac locks by parasitic forces, and now reopening as living gates on the Light Web.';
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('celestial-anchors not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'harmonic-lenses.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Harmonic Lenses Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Harmonic Lenses: frequency blooms around Energy Nodes, the Crystalline Grid, four node types, parasitic Loosh inversion, Thuban and Star-Nodes, and awakened souls as living lenses.',
    'Interactive Living Truth Quiz on Celestial Anchors: Sky Nodes, Crystalline Star-Nodes, Zodiac locks, Axis Laburnum, Thuban versus Polaris, four-tier nodes, Photonic Song, and Resonating Sols as living harmonic lenses.'
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
  'PASS: audited 25/25 against data/breakdown-topics/celestial-anchors.json'
);
