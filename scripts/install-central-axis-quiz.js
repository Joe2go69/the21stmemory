/**
 * Installs Central Axis quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/spirit-tree-quiz.json
 * Audits all 25 items against data/breakdown-topics/central-axis.json.
 * Brand-footer items (source Q14/15/19) rewritten from the Central Axis report only.
 * Run: node scripts/install-central-axis-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/central-axis.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'central-axis';
const TOPIC_TITLE = 'Central Axis';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/spirit-tree-quiz.json';

const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

/** Support phrases grounded only in central-axis.json report. */
const supportPhrases = {
  1: ['foundational heart', 'harmonic currents', 'crystalline grids'],
  2: ['hyperborea', 'living resonance field', 'spirit tree originally stood'],
  3: ['axis labernum', 'harmonic bridge', 'vertical current'],
  4: ['lyran builders-architects', 'dome of forgotten gods'],
  5: ['valve', 'siphon light', 'false lunar grid'],
  6: ['178 physical domes', 'aru-el-nai'],
  7: ['harmonic amplifier', 'density', 'higher light worlds'],
  8: ['polaris', 'parasitic north', 'true axis'],
  9: ['foundation pillars', 'black crystals', 'antarctica'],
  10: ['thought, compassion, and cooperation', 'vertical current'],
  11: ['thalon', 'seed codes'],
  12: ['roots remain alive', 'never fully destroyed'],
  13: ['yggdrasil', 'djed', 'axis mundi'],
  14: ['sound and vibration', 'bright light', 'dome of forgotten gods'],
  15: ['custodians', 'greys', 'multi-dimensional engineering'],
  16: ['spinal column', 'thuban', 'energy body'],
  17: ['seven domes', 'roots and branches', 'source light'],
  18: ['severed', 'solar family', 'source'],
  19: ['light grids', 'harmonic lenses', 'crystals'],
  20: ['does not require a physical repair', 'root system'],
  21: ['178 physical domes', 'aru-el-nai', 'central axis'],
  22: ['the gardens', 'seven domes'],
  23: ['harmonic amplifier', 'higher light worlds'],
  24: ['polaris', 'projection dome', 'thuban'],
  25: ['thalon', 'seed codes', 'human and e.t. sols']
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
 * All four options at similar depth from the central-axis report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'It serves as the central anchor and heartbeat, pulsing harmonic currents through crystalline grids of the CUBE System.',
      rationale:
        'The Spirit Tree stands as the main Axis of consciousness for the KNOWN LANDS and foundational heart of the entire CUBE System, pulsing harmonic currents through crystalline grids to maintain the structural and energetic integrity of the Great Dome.'
    },
    {
      text: 'It regulates only the physical temperature and climate of the KNOWN LANDS without any harmonic grid role.',
      rationale:
        'The tree\'s primary influence is harmonic and energetic alignment as the foundational heart of consciousness, not mere meteorological climate control.'
    },
    {
      text: 'It functions only as a sealed archive of Lyran Builder historical records with no active pulse of energy.',
      rationale:
        'The tree is an active energy generator and axis of consciousness, not primarily a static repository for historical records alone.'
    },
    {
      text: 'It acts only as a solid physical barrier wall protecting the Great Dome from all external craft interference.',
      rationale:
        'While the tree supports structural and energetic integrity, its defined role is as energetic heart and distribution hub, not a simple defensive wall.'
    }
  ],
  2: [
    {
      text: 'Hyperborea — the living resonance field and heart of the CUBE System where the Spirit Tree originally stood.',
      rationale:
        'Hyperborea is the living resonance field and heart of the CUBE System where the Spirit Tree originally stood as the central anchor of Source.'
    },
    {
      text: 'Thuban alone — the sole terrestrial field where the Spirit Tree trunk was rooted in solid stone.',
      rationale:
        'Thuban (Aru-el-nai) is a crystalline node in the sky that aligns with the axis, not the terrestrial resonance field where the tree was rooted.'
    },
    {
      text: 'Antarctica as the original organic home of the Spirit Tree before any parasitic inversion occurred.',
      rationale:
        'Antarctica currently holds inverted black crystals from Foundation Pillars; Hyperborea is the living field where the Spirit Tree originally stood.'
    },
    {
      text: 'The Seven Domes alone — the exclusive central trunk site of the Spirit Tree before the Valve was installed.',
      rationale:
        'The Seven Domes are peripheral gardens fed by the tree\'s roots and branches, not the central Hyperborean field of the trunk.'
    }
  ],
  3: [
    {
      text: 'Axis Labernum — the true harmonic bridge and vertical current of light from earth grids to star-nodes.',
      rationale:
        'Axis Labernum is the true harmonic bridge and vertical current of light that roots in the crystalline grids of the KNOWN LANDS and branches out to the field of star-nodes.'
    },
    {
      text: 'The CUBE Grid alone — a horizontal containment lattice that never forms any vertical bridge of light.',
      rationale:
        'The CUBE System is the wider architecture; the specific vertical bridge of light is named Axis Labernum, not a generic horizontal grid label.'
    },
    {
      text: 'Aru-el-nai alone — the full name of the vertical bridge rather than a sky node on the axis.',
      rationale:
        'Aru-el-nai is the multi-dimensional name for the original North Star (Thuban), which aligns with the bridge rather than being the bridge itself.'
    },
    {
      text: 'The Great Dome alone — the exclusive technical name for the vertical current connecting star-nodes.',
      rationale:
        'The Great Dome is the overall structure maintained by the axis; the vertical harmonic bridge is specifically called Axis Labernum.'
    }
  ],
  4: [
    {
      text: 'Lyran Builders-Architects, who planted and built it as a creation of the Dome of Forgotten Gods.',
      rationale:
        'The Spirit Tree was originally planted and built by Lyran Builders-Architects as a creation of the Dome of Forgotten Gods to generate pure bright light through sound and vibration.'
    },
    {
      text: 'The Greys, who alone designed the original Spirit Tree as their primary multi-dimensional control node.',
      rationale:
        'Greys later provided multi-dimensional engineering skills used by Custodians to remove the tree and install the Valve; they did not plant the original tree.'
    },
    {
      text: 'The Custodians, who constructed the tree from the start as a siphon for Source Light harvest.',
      rationale:
        'Custodians ordered the removal and inversion of the tree and installed the Valve; they were not the original Lyran architects who planted it.'
    },
    {
      text: 'The Solar Family alone, who built the trunk without Lyran architects or the Dome of Forgotten Gods.',
      rationale:
        'The tree connected the system to Source and the Solar Family as a feeder of light, but the specific architects were the Lyran Builders-Architects.'
    }
  ],
  5: [
    {
      text: 'To siphon light and invert it into a false lunar grid connected to the Lands of Saturn.',
      rationale:
        'The Valve is advanced Black Cube Tech machinery inserted into the planetary wound after the Spirit Tree was removed, designed to siphon light and invert it into a false lunar grid, connecting the system to the Lands of Saturn.'
    },
    {
      text: 'To expand the Great Dome permanently into the Lands of Saturn as a beneficial enlargement of space.',
      rationale:
        'Connection to the Lands of Saturn is part of the parasitic inversion and energy harvest, not a beneficial expansion of the Great Dome.'
    },
    {
      text: 'To stabilize the crystalline grids after removal and restore healthy outward Source Light flow.',
      rationale:
        'The Valve was not meant to stabilize organic flow; it siphons light and inverts energy into a false lunar grid for parasitic harvest.'
    },
    {
      text: 'To act as an open communication relay that strengthens contact with the higher light worlds.',
      rationale:
        'The Valve severs the direct link to Source and the Solar Family rather than facilitating communication with higher light worlds.'
    }
  ],
  6: [
    {
      text: '178 physical domes align with Aru-el-nai as the crystalline node of the central axis.',
      rationale:
        'Aru-el-nai is the multi-dimensional name for the original North Star (Thuban), serving as a crystalline node that aligns with the central axis of all 178 physical domes.'
    },
    {
      text: 'Only 7 physical domes exist in total, and none of them align with Aru-el-nai or Thuban.',
      rationale:
        'There are seven domes outside the Great Dome fed as gardens, but Aru-el-nai aligns with the central axis of all 178 physical domes.'
    },
    {
      text: 'Exactly 21 physical domes form the full set, each locked only to Polaris as true north.',
      rationale:
        'The count given for physical domes aligned with Aru-el-nai is 178; Polaris is the parasitic north that masks the true axis, not the alignment node of that count.'
    },
    {
      text: 'Only 12 physical domes align with Aru-el-nai as a zodiac-style map of the known lands.',
      rationale:
        'A twelve-fold count is not the figure given; Aru-el-nai aligns with the central axis of all 178 physical domes.'
    }
  ],
  7: [
    {
      text: 'It serves as a harmonic amplifier, fueling resonance that spreads outward to the higher light worlds.',
      rationale:
        'The density of the physical Great Dome acts as a harmonic amplifier, fueling the resonance that spreads back outward to the higher light worlds.'
    },
    {
      text: 'It only reflects light back into the false lunar grid so the Valve can harvest more efficiently.',
      rationale:
        'The Valve handles parasitic inversion and siphoning; the dome\'s density amplifies natural resonance outward to higher light worlds.'
    },
    {
      text: 'It provides only a biological root chamber for a solid wood trunk with no amplifying role at all.',
      rationale:
        'The specific role of the Great Dome\'s density is harmonic amplification of resonance, not a biological wood-root chamber.'
    },
    {
      text: 'It acts only as a passive filter that permanently removes every parasitic frequency on contact.',
      rationale:
        'The dome\'s density is a functional amplifier in the power cycle of the Central Axis, not a passive filter that alone clears all parasites.'
    }
  ],
  8: [
    {
      text: 'Polaris — established as a parasitic north after the projection dome was rotated to mask the true axis.',
      rationale:
        'When the Custodians twisted the fields, they realigned the sky map and rotated the projection dome to establish a new parasitic north, utilizing Polaris to mask the true axis of Thuban.'
    },
    {
      text: 'Thuban — installed by parasites as the only modern north star after Hyperborea was sealed in ice.',
      rationale:
        'Thuban is the true axis node (Aru-el-nai) that continues to hum its original frequency behind the distortion; Polaris is the parasitic mask.'
    },
    {
      text: 'Alpha Centauri — named as the exclusive false north used to rotate every projection dome overlay.',
      rationale:
        'Polaris is the star utilized as the new parasitic north; Alpha Centauri is not named in the sky-map realignment of the Central Axis.'
    },
    {
      text: 'Sirius — identified as the sole replacement north that permanently erased Thuban\'s frequency forever.',
      rationale:
        'Polaris is the parasitic north; Thuban continues to quietly hum its original frequency behind the distortion rather than being permanently erased by Sirius.'
    }
  ],
  9: [
    {
      text: 'The Foundation Pillars — fragments inverted by parasites to function as frequency locks between domes.',
      rationale:
        'The black crystals currently found in Antarctica are fragments of the Foundation Pillars that once provided stability between the domes, inverted by the parasites to function as frequency locks.'
    },
    {
      text: 'The Seven Domes themselves — solid garden walls that always appeared as Antarctic black crystals.',
      rationale:
        'The crystals provided stability between the domes as Foundation Pillars; they are not described as the peripheral gardens themselves.'
    },
    {
      text: 'The Valve machinery alone — original Black Cube hardware that was never part of any pillar system.',
      rationale:
        'The crystals were original Foundation Pillar fragments later inverted as frequency locks, not original components of the Valve machinery itself.'
    },
    {
      text: 'The Spirit Tree\'s physical trunk alone — solid wood pieces that drifted to Antarctica after uprooting.',
      rationale:
        'The physical tree was removed, but Antarctic black crystals are inverted fragments of Foundation Pillars, not pieces of the Spirit Tree trunk.'
    }
  ],
  10: [
    {
      text: 'A realignment of thought, compassion, and cooperation with the vertical current of the Axis Labernum.',
      rationale:
        'The reawakening of the Axis Labernum does not require a physical repair, but rather a realignment of thought, compassion, and cooperation with the vertical current, reactivating living roots through resonating sols and positive E.T. fleets.'
    },
    {
      text: 'Only the physical destruction of every Antarctic black crystal by force before any grid can wake.',
      rationale:
        'Reawakening is framed as realignment of consciousness and cooperation with the vertical current, not as a mandatory physical destruction campaign against the crystals.'
    },
    {
      text: 'Waiting indefinitely for Lyran Builders to return and rebuild the entire trunk from raw matter.',
      rationale:
        'Positive E.T. fleets and resonating sols can reactivate the grids because the root system was never fully destroyed; a total physical rebuild is not required.'
    },
    {
      text: 'Physical restoration of a solid Spirit Tree trunk as the only path before any root can light up.',
      rationale:
        'Reawakening does not require physical repair of the trunk because the essence and root system of the Spirit Tree were never fully destroyed.'
    }
  ],
  11: [
    {
      text: 'Thalon carries the Seed Codes of the Spirit Tree that recognize codes within human and E.T. sols.',
      rationale:
        'Thalon carries the Seed Codes of the Spirit Tree, which recognize the embedded codes within human and E.T. sols as the false overlays and frequency grids fracture.'
    },
    {
      text: 'The Custodians alone carry Seed Codes so only parasite priests can awaken the Spirit Tree roots.',
      rationale:
        'Custodians are parasitic forces who ordered the tree\'s removal; Thalon carries the Seed Codes of the Spirit Tree for recognition in human and E.T. sols.'
    },
    {
      text: 'Aru-el-nai alone stores Seed Codes as a star node with no role for Thalon or resonating sols.',
      rationale:
        'Aru-el-nai is a crystalline node and original North Star alignment; Seed Codes for sols are carried by Thalon of the Spirit Tree lineage.'
    },
    {
      text: 'The Greys alone hold Seed Codes as payment for multi-dimensional engineering of the Valve tech.',
      rationale:
        'Greys provided multi-dimensional engineering skills for the parasitic removal and Valve install; Seed Codes of the Spirit Tree are carried by Thalon.'
    }
  ],
  12: [
    {
      text: 'False — the roots remain alive as an interconnected web of nodes and lenses still being reactivated.',
      rationale:
        'Although the physical manifestation of the tree was forcefully removed, its roots remain alive, forming the interconnected web of nodes and lenses currently being reactivated by resonating sols; the essence and root system were never fully destroyed.'
    },
    {
      text: 'True — parasitic removal completely destroyed every root, node, and light-grid connection forever.',
      rationale:
        'Removal was forceful, yet the roots remain alive and the essence was never fully destroyed; reactivation of the living root web is underway.'
    },
    {
      text: 'True — only the Valve survived, and no Spirit Tree root, node, or lens remains under any overlay.',
      rationale:
        'The Valve was installed into the wound, but the Spirit Tree roots remain alive as a web of nodes and lenses rather than being fully annihilated.'
    },
    {
      text: 'False — the roots died completely, yet new artificial roots were grown from pure Valve Black Cube Tech.',
      rationale:
        'The living root system of the Spirit Tree was never fully destroyed; reactivation restores original roots rather than replacing them with Valve-grown artificial roots.'
    }
  ],
  13: [
    {
      text: 'The Great Dome — the overall container structure rather than a cultural name for the Central Axis itself.',
      rationale:
        'The Central Axis is echoed as the world tree, pillar of light, Yggdrasil, the Djed, the Tree of Life, or the Axis Mundi; the Great Dome is the structure containing the realm, not a cultural name for the axis.'
    },
    {
      text: 'Axis Mundi — listed among the cultural echoes of the true Central Axis framework across human cultures.',
      rationale:
        'Axis Mundi is explicitly named as a cultural echo of the Central Axis, which in the true framework is the Axis Labernum.'
    },
    {
      text: 'The Djed — named as a historical cultural representation of the pillar of light and Central Axis idea.',
      rationale:
        'The Djed is listed among cultural names for the Central Axis concept, alongside Yggdrasil, the Tree of Life, and Axis Mundi.'
    },
    {
      text: 'Yggdrasil — specifically named as a cultural echo of the Spirit Tree and Central Axis across cultures.',
      rationale:
        'Yggdrasil is named as a cultural echo of the Central Axis concept, which in the true framework is the Axis Labernum.'
    }
  ],
  14: [
    {
      text: 'A continuous pure flow of bright light created by sound and vibration from the Dome of Forgotten Gods design.',
      rationale:
        'The Spirit Tree was planted and built by Lyran Builders-Architects as a creation of the Dome of Forgotten Gods to generate a continuous, pure flow of bright light created by sound and vibration.'
    },
    {
      text: 'A permanent siphon of lunar grid energy built only to feed the Lands of Saturn from the first day.',
      rationale:
        'Siphoning into the false lunar grid is the later Valve inversion; original purpose was pure bright light from sound and vibration as a Source Light feeder.'
    },
    {
      text: 'A sealed archive chamber for storing only Lyran physical remains under Hyperborea\'s ice mask forever.',
      rationale:
        'The tree generates bright light through sound and vibration and feeds Source Light; it is not described as a sealed archive of physical remains.'
    },
    {
      text: 'A Polaris-linked projection beam designed only to lock every dome to the parasitic north star map.',
      rationale:
        'Polaris is the later parasitic north mask; the original tree purpose was generating pure light through sound and vibration for Source Light distribution.'
    }
  ],
  15: [
    {
      text: 'Custodians ordered removal, utilizing Greys for advanced multi-dimensional engineering skills they lacked.',
      rationale:
        'Parasitic forces, specifically the Custodians utilizing Greys for their advanced multi-dimensional engineering skills, ordered the removal of the tree and installed the Valve in its place.'
    },
    {
      text: 'Lyran Builders-Architects ordered the Greys to uproot their own tree and install the Valve for harvest.',
      rationale:
        'Lyran Builders-Architects planted the tree; Custodians ordered its removal and used Grey multi-dimensional engineering to execute the strike and Valve install.'
    },
    {
      text: 'Thalon alone hired the Greys to remove the trunk so Seed Codes could never match human sols again.',
      rationale:
        'Thalon carries Seed Codes for reactivation; Custodians using Greys ordered the parasitic removal, not Thalon as the remover.'
    },
    {
      text: 'The Solar Family alone engineered the Valve with Greys so Source Light would flow only through Saturn.',
      rationale:
        'Removal severed the direct link to Source and the Solar Family; Custodians utilizing Greys ordered the strike and Valve connection to the Lands of Saturn.'
    }
  ],
  16: [
    {
      text: 'The spinal column of the realm\'s energy body — the fixed line of balance early builders oriented toward.',
      rationale:
        'Thuban represents the spinal column of this realm\'s energy body, establishing the fixed line of balance that early builders aligned all their temples and pyramids toward.'
    },
    {
      text: 'Only the crown center of a single human-style chakra map with no spinal line of temple alignment.',
      rationale:
        'Thuban is specifically the spinal column and fixed line of balance of the realm\'s energy body, not only a crown-chakra metaphor without temple alignment.'
    },
    {
      text: 'Only the root node of Hyperborea itself, replacing any need for a vertical sky alignment at all.',
      rationale:
        'Hyperborea holds the root node of the Spirit Tree; Thuban holds the vertical axis and spinal column linking earth grids to upper realms.'
    },
    {
      text: 'Only the heartbeat of the Spirit Tree trunk with no role as a fixed vertical line of balance.',
      rationale:
        'The Spirit Tree acts as the heartbeat of the realm; Thuban specifically represents the spinal column and fixed line of balance of the energy body.'
    }
  ],
  17: [
    {
      text: 'The Spirit Tree feeds Source Light to the Seven Domes through an extensive network of roots and branches.',
      rationale:
        'Functioning as the trunk, the tree feeds the Seven Domes (the gardens) with Source Light through an extensive network of roots and branches, acting as the primary feeder of Source Light.'
    },
    {
      text: 'The Spirit Tree was built only as a shield to hide the Seven Domes from the Lyran Builders forever.',
      rationale:
        'The tree was built by the Lyrans to connect and feed the Seven Domes with Source Light, not to hide the gardens from their own architects.'
    },
    {
      text: 'The Seven Domes are rival systems built later by Custodians with no original link to the Spirit Tree.',
      rationale:
        'The Seven Domes are part of the original design as gardens fed by the tree\'s roots and branches, not Custodian rival additions.'
    },
    {
      text: 'The Seven Domes alone generate the sound and vibration that create all of the tree\'s bright light.',
      rationale:
        'Bright light is generated by the tree\'s own sound and vibration design; that light then feeds outward into the Seven Domes as gardens.'
    }
  ],
  18: [
    {
      text: 'It severed the direct link to Source and the Solar Family and enabled a counterfeit reincarnation harvest.',
      rationale:
        'When parasitic forces ordered the removal of the tree, they severed this direct link to Source and the Solar Family; the Valve connected the system to the Lands of Saturn and created a counterfeit cycle of reincarnation and energy harvest.'
    },
    {
      text: 'It shifted the connection to the Lands of Saturn as a beneficial upgrade for Source Light amplification.',
      rationale:
        'Connection to the Lands of Saturn is part of the parasitic inversion and energy harvest, not a beneficial upgrade of the Solar Family link.'
    },
    {
      text: 'It had no effect on the Solar Family because living roots fully preserved the direct Source trunk link.',
      rationale:
        'Roots remain alive for later reactivation, yet the direct link provided by the central trunk to Source and the Solar Family was severed by removal.'
    },
    {
      text: 'It strengthened the Solar Family link by forcing every human to look only inward for Source Light.',
      rationale:
        'Removal severed the direct link to Source and the Solar Family; any later reactivation is not framed as an intentional strengthening via the removal itself.'
    }
  ],
  19: [
    {
      text: 'Light Grids, Harmonic Lenses, and Crystals covering the earth as the living extension of Spirit Tree roots.',
      rationale:
        'The roots of the Spirit Tree extend deeply into the realms, forming the Light Grids, Harmonic Lenses, and Crystals that cover the earth as the interconnected web of the Central Axis.'
    },
    {
      text: 'Only solid undersea fiber cables with no Light Grids, Harmonic Lenses, or crystalline web at all.',
      rationale:
        'Spirit Tree roots form Light Grids, Harmonic Lenses, and Crystals across the earth; the living web is not reduced to ordinary cables alone.'
    },
    {
      text: 'Only Polaris beam projectors that permanently replace every crystal and lens under parasitic north.',
      rationale:
        'Polaris is the parasitic north mask; the organic root web forms Light Grids, Harmonic Lenses, and Crystals rather than Polaris projectors alone.'
    },
    {
      text: 'Only Valve Black Cube modules that grow artificial roots without any harmonic lens or light grid.',
      rationale:
        'The living root system forms Light Grids, Harmonic Lenses, and Crystals; the Valve siphons and inverts light rather than creating that organic web.'
    }
  ],
  20: [
    {
      text: 'False — reactivation is energetic realignment of living roots and lenses, not physical trunk regrowth.',
      rationale:
        'The reawakening of the Axis Labernum does not require a physical repair; because the essence and root system were never fully destroyed, resonating sols can reactivate these grids as tree roots light up again.'
    },
    {
      text: 'True — every reactivated node proves a solid physical trunk is already growing back in Hyperborea.',
      rationale:
        'Reactivation involves realigning thought and activating the existing root system; physical trunk repair is not required for the roots to light up again.'
    },
    {
      text: 'True — grids only wake after a full solid wood trunk is rebuilt by Lyran Builders on the surface.',
      rationale:
        'Physical repair is not required; the living root system and essence remain and can be reactivated through resonance and cooperation with the vertical current.'
    },
    {
      text: 'False — roots died completely, so any "reactivation" is only a metaphor with no real grid effect.',
      rationale:
        'Roots remain alive as an interconnected web; as false overlays fracture, the tree roots light up again in a real energetic reactivation.'
    }
  ],
  21: [
    {
      text: 'To align with the central axis of all 178 physical domes as a crystalline node of true north.',
      rationale:
        'Aru-el-nai is the multi-dimensional name for the original North Star (Thuban), serving as a crystalline node that aligns with the central axis of all 178 physical domes and holds the vertical axis for overlay grids.'
    },
    {
      text: 'To siphon light from the Great Dome into the false lunar grid as the primary harvest engine.',
      rationale:
        'Siphoning light into the false lunar grid is the role of the Valve; Aru-el-nai is a point of alignment for the central axis of the domes.'
    },
    {
      text: 'To act as the physical trunk of the Spirit Tree standing in Hyperborea as solid crystalline wood.',
      rationale:
        'Aru-el-nai is the star node that aligns with the axis; the Spirit Tree trunk is the central feeder rooted in Hyperborea, not the star itself.'
    },
    {
      text: 'To create the false lunar grid alone by rotating Polaris out of the sky without any dome alignment.',
      rationale:
        'The false lunar grid is tied to Valve inversion and parasitic sky rotation to Polaris; Aru-el-nai aligns the true central axis of the 178 physical domes.'
    }
  ],
  22: [
    {
      text: 'The gardens — the seven outside domes fed by the Spirit Tree as the primary feeder of Source Light.',
      rationale:
        'The tree feeds the Seven Domes (the gardens) with Source Light through roots and branches; as reactivation proceeds, the seven outside gardens return to their true, harmonious design.'
    },
    {
      text: 'The Harmonic Lenses alone — treating the seven outside domes as lens blooms without garden naming.',
      rationale:
        'Harmonic Lenses form part of the root web of nodes and crystals; the Seven Domes outside the Great Dome are referred to as the gardens.'
    },
    {
      text: 'The Foundation Pillars alone — renaming the seven outside domes as pillar fragments in Antarctica.',
      rationale:
        'Foundation Pillars provided stability between domes and appear as inverted black crystals; the seven outside domes are called the gardens.'
    },
    {
      text: 'The Higher Light Worlds alone — equating the seven outside domes only with distant light realms above.',
      rationale:
        'Higher light worlds receive outward amplified resonance; the specific term for the seven outside domes is the gardens.'
    }
  ],
  23: [
    {
      text: 'It acts as a harmonic amplifier, fueling resonance that spreads back outward to the higher light worlds.',
      rationale:
        'The density of the physical Great Dome acts as a harmonic amplifier, fueling the resonance that spreads back outward to the higher light worlds as one of three primary mechanisms of the Central Axis.'
    },
    {
      text: 'It traps light inside so none of the 178 physical domes can ever receive Source Light from the trunk.',
      rationale:
        'The purpose of density is to fuel resonance outward to higher light worlds, not to trap light away from the domes and gardens.'
    },
    {
      text: 'It blocks out every siphoning effect of the Valve automatically without any need for resonating sols.',
      rationale:
        'Density amplifies resonance in the organic power cycle; it is not described as an automatic block of the Valve that removes the need for reactivation.'
    },
    {
      text: 'It only slows Source Light into dense matter with no amplifying role toward higher light worlds.',
      rationale:
        'The primary role named for Great Dome density is harmonic amplification that fuels resonance outward to higher light worlds.'
    }
  ],
  24: [
    {
      text: 'They realigned the sky map and rotated the projection dome to establish Polaris as parasitic north.',
      rationale:
        'When the Custodians twisted the fields, they realigned the sky map and rotated the projection dome to establish a new parasitic north, utilizing Polaris to mask the true axis while Thuban continues to hum behind the distortion.'
    },
    {
      text: 'They successfully destroyed the frequency of Thuban so it no longer hums behind any distortion.',
      rationale:
        'Thuban continues to quietly hum its original frequency behind the distortion; Polaris masks the true axis rather than destroying Thuban entirely.'
    },
    {
      text: 'They removed every star from the projection dome so no north marker remains for any alignment.',
      rationale:
        'Stars were not removed; the sky map was realigned and the projection rotated so Polaris masks the true axis of Thuban.'
    },
    {
      text: 'They used Thuban alone to power the false lunar grid without installing any Valve or Polaris mask.',
      rationale:
        'The Valve siphons light into the false lunar grid; sky-map distortion uses Polaris as parasitic north while Thuban remains the masked true axis.'
    }
  ],
  25: [
    {
      text: 'Thalon carries the Seed Codes of the Spirit Tree that recognize embedded codes in human and E.T. sols.',
      rationale:
        'Thalon carries the Seed Codes of the Spirit Tree, which recognize the embedded codes within human and E.T. sols; as false overlays fracture, the tree roots light up again.'
    },
    {
      text: 'Thalon is only a physical fragment of the tree located in Antarctica as a black Foundation crystal.',
      rationale:
        'Antarctic black crystals are inverted Foundation Pillar fragments; Thalon is the carrier of Seed Codes that recognize codes in human and E.T. sols.'
    },
    {
      text: 'Thalon is the engineer who alone built the Spirit Tree without any Lyran Builders-Architects involved.',
      rationale:
        'Lyran Builders-Architects planted and built the tree; Thalon\'s role is carrying Seed Codes for recognition and reactivation within sols.'
    },
    {
      text: 'Thalon is the parasite who ordered the Greys to remove the Spirit Tree and install the Valve system.',
      rationale:
        'Custodians utilizing Greys ordered removal and Valve install; Thalon is associated with Seed Codes and positive reactivation of the Spirit Tree roots.'
    }
  ]
};

const questionOverrides = {
  1: 'What is the primary function of the Spirit Tree within the CUBE System?',
  12: 'Did parasitic removal of the Spirit Tree fully destroy its root system and light-grid connection?',
  13: 'Which of the following is NOT one of the cultural names used for the Central Axis concept?',
  14: 'What pure flow was the Spirit Tree designed to generate as a creation of the Dome of Forgotten Gods?',
  15: 'How did parasitic forces accomplish the removal of the Spirit Tree?',
  19: 'What do the roots of the Spirit Tree form as they extend deeply into the realms?',
  20: 'Does reactivation of the grids mean the physical trunk of the Spirit Tree is growing back?',
  23: 'What is the result of the density of the physical Great Dome in the Central Axis system?'
};

const hintOverrides = {
  1: 'Focus on the foundational heart and the pulsing of harmonic currents through crystalline grids.',
  2: 'Name the living resonance field at the heart of the CUBE System where the tree stood.',
  3: 'The term names a vertical pillar-like current of light between earth grids and star-nodes.',
  4: 'Identify the ancient architects linked to the Dome of Forgotten Gods.',
  5: 'Think about Black Cube Tech that siphons light into a false lunar harvest system.',
  6: 'Find the triple-digit count of physical domes aligned with Aru-el-nai.',
  7: 'Look for the term that increases the strength of resonance outward.',
  8: 'Consider which star modern sky maps treat as the North Star after the rotation.',
  9: 'Recall the architectural supports that once stabilized space between the domes.',
  10: 'Reawakening is internal alignment with the vertical current, not only physical rebuild.',
  11: 'Name the carrier of Seed Codes that recognize codes in human and E.T. sols.',
  12: 'The physical trunk was removed, yet something foundational still lives and reactivates.',
  13: 'Separate the container of the realm from cultural names for the central pillar.',
  14: 'Original design generates bright light through sound and vibration.',
  15: 'Custodians ordered the strike; Greys supplied multi-dimensional engineering skill.',
  16: 'Think of the structural line of balance that temples and pyramids were aligned toward.',
  17: 'Use the trunk-and-branches metaphor for feeding the outer gardens.',
  18: 'Find the outcome for Source and the Solar Family when the trunk was removed.',
  19: 'Roots form grids, lenses, and crystals across the earth.',
  20: 'Physical repair is not required because the root essence remains.',
  21: 'Focus on alignment of the full set of physical domes to the true north node.',
  22: 'A botanical term names the seven outside domes fed by the tree.',
  23: 'Density fuels resonance that spreads outward rather than trapping light.',
  24: 'Picture rotating a projection so a false north hides the true axis.',
  25: 'Focus on Seed Codes in the strategic implications of reactivation.'
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

const topicImage = 'images/breakdown/central-axis.webp';
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
    'Test your grasp of Central Axis — Spirit Tree as main axis of consciousness, Axis Labernum, Hyperborea, Thuban (Aru-el-nai), Valve hijack, Seed Codes, and root-web reawakening.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'The Central Axis is the Spirit Tree as the main axis of consciousness for the Known Lands — foundational heart of the CUBE System, Axis Labernum as vertical current, Hyperborea as living resonance field, and Thuban (Aru-el-nai) as spinal column of the realm\'s energy body. Sit with the Valve wound and false lunar harvest, Foundation Pillars inverted as Antarctic frequency locks, and Thalon\'s Seed Codes waking roots that were never fully destroyed. Realignment of thought, compassion, and cooperation with the vertical current lights the grids again as the seven outside gardens return to harmonious design.'
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
    'Test your understanding of Central Axis — Spirit Tree as main axis of consciousness, Axis Labernum, Hyperborea, Thuban (Aru-el-nai), Valve inversion, Seed Codes, and reawakening of the living root web.'
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
      if (!t.description || t.description.includes('Decoded analysis of Central Axis')) {
        t.description =
          'The Central Axis is the Spirit Tree as the main axis of consciousness for the KNOWN LANDS — Axis Labernum, Hyperborea, Thuban (Aru-el-nai), the Valve hijack, and the reawakening of the living root web.';
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('central-axis not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from celestial-anchors quiz (recent sibling install)
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'celestial-anchors.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Central Axis: Spirit Tree as main axis of consciousness, Axis Labernum, Hyperborea, Thuban (Aru-el-nai), Valve hijack, Seed Codes, and root-web reawakening.';
const replacements = [
  ['Celestial Anchors Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Celestial Anchors: Sky Nodes, Crystalline Star-Nodes, Zodiac locks, Axis Laburnum, Thuban versus Polaris, four-tier nodes, Photonic Song, and Resonating Sols as living harmonic lenses.',
    desc
  ],
  ['quiz/breakdown/celestial-anchors.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/celestial-anchors.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=celestial-anchors',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Celestial Anchors deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Celestial Anchors</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/celestial-anchors.json',
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
  .replace(/Interactive Living Truth Quiz on Celestial Anchors[^"]*/g, desc)
  .replace(/Celestial Anchors/g, TOPIC_TITLE);

// Fix over-replacement on paths if any slipped
html = html
  .replace(/Central Axis\.webp/g, 'central-axis.webp')
  .replace(/Central Axis\.json/g, 'central-axis.json')
  .replace(/Central Axis\.html/g, 'central-axis.html')
  .replace(/topic=Central Axis/g, `topic=${TOPIC_ID}`)
  .replace(/topic=central-axis/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/celestial-anchors.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/central-axis.json'
);
