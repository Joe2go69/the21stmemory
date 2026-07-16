/**
 * Installs Layered Simulations quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/cube-quiz.json
 * Audits all 25 items against data/breakdown-topics/layered-simulations.json.
 * Run: node scripts/install-layered-simulations-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/layered-simulations.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'layered-simulations';
const TOPIC_TITLE = 'Layered Simulations';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/cube-quiz.json';

const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

/** Support phrases grounded only in layered-simulations.json report. */
const supportPhrases = {
  1: ['the cube', 'core hard drive', 'domes', 'simulations'],
  2: ['frequency shifting', 'interwoven layers', 'physical distance'],
  3: ['dome of forgotten gods', 'root tone', 'memory storage'],
  4: ['178 physical worlds', 'interwoven layers', 'great dome'],
  5: ['phasing corridors', 'perception', 'overlay', 'physical distance'],
  6: ['dome of sheol', 'healing sanctuary', 'trauma loops'],
  7: ['spirit tree', 'harmonic currents', 'crystalline grids'],
  8: ['long trips', 'rituals of enforcement', 'massive'],
  9: ['distant stars', 'data crystals', 'holographic dome'],
  10: ['overlays', 'touch, smell, and sight', '3d'],
  11: ['great dome', 'frequency amplifier', 'solid creation'],
  12: ['vanish', 'lack anchors', 'restored frequency field'],
  13: ['beautiful gardens', 'spirit tree', 'seven domes'],
  14: ['teleportation', 'resonance alignment', 'crystalline lattice'],
  15: ['sound and light', 'crystalline membranes'],
  16: ["architect's playground", 'dome of titans', 'war zone'],
  17: ['star-nodes', 'data crystals', 'holographic dome'],
  18: ['phasing corridors', 'frequency tunnels', 'overlay'],
  19: ['simulation cells', 'layers of glass', 'countries'],
  20: ['dome of 5 peaks', 'dome of sheol', 'the great dome'],
  21: ['ancient sites', 'modern cities', 'frequency grids'],
  22: ['human filter', 'perception overlays', 'process'],
  23: ['video game', 'frequency corridor', 'overlay'],
  24: ['cannot truly create', 'hijacked', 'overlays'],
  25: ['distinct yet linked', 'electromagnetic harmonic waves', 'eight']
};

function cleanText(s) {
  let t = String(s || '');
  t = t.replace(/\$3\\text\{D\}\$/g, '3D');
  t = t.replace(/\$3\\mathrm\{D\}\$/g, '3D');
  t = t.replace(/\$3D\$/g, '3D');
  t = t.replace(/\$(\d+(?:\.\d+)?)\$/g, '$1');
  t = t.replace(/\$(\d+)%\$/g, '$1%');
  t = t.replace(/\$([^$]+)\$/g, (_, inner) =>
    inner
      .replace(/\\text\{([^}]*)\}/g, '$1')
      .replace(/\\mathrm\{([^}]*)\}/g, '$1')
      .replace(/\\[a-zA-Z]+/g, '')
      .replace(/[{}]/g, '')
  );
  t = t.replace(/\\\(|\\\)|\\\[|\\\]/g, '');
  t = t.replace(/\\text\{([^}]*)\}/g, '$1');
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

function absoluteVoice(s) {
  let t = String(s || '');
  const rewrites = [
    [/^According to the source,?\s*/i, ''],
    [/^According to the report,?\s*/i, ''],
    [/^According to the text,?\s*/i, ''],
    [/^According to the Living Truth Journal,?\s*/i, ''],
    [/\baccording to the Living Truth Journal\b/gi, ''],
    [/\baccording to the Strategic Implications\b/gi, ''],
    [/\baccording to the (report|source|text)\b/gi, ''],
    [/^The source states that\s+/i, ''],
    [/^The source specifies that\s+/i, ''],
    [/^The source suggests that\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The text suggests that\s+/i, ''],
    [/^The text mentions\s+/i, ''],
    [/^The text focuses on\s+/i, ''],
    [/^The text explicitly states that\s+/i, ''],
    [/^The material clarifies that\s+/i, ''],
    [/^The strategic implications state that\s+/i, ''],
    [/\bThe strategic implications state that\b/gi, ''],
    [/\bThe source explicitly states that\b/gi, ''],
    [/\bthe source explicitly states that\b/gi, ''],
    [/\bThe text explicitly states\b/gi, ''],
    [/\bthe text explicitly states\b/gi, ''],
    [/\bmentioned in the source material\b/gi, ''],
    [/\bmentioned in the text\b/gi, ''],
    [/\bsource material\b/gi, 'transmission'],
    [/\bin the source material\b/gi, ''],
    [/\bthe source specifies that\b/gi, ''],
    [/\bWhile physical manipulation exists, the source emphasizes\b/gi, ''],
    [
      /Focus on the storage and structural containment aspect of the architecture\./i,
      'Focus on The CUBE as the core hard drive housing every dome and simulation.'
    ],
    [
      /Look for the dome associated with deep inversion and trauma\./i,
      'Recall which inverted dome became a prison realm of trauma loops.'
    ],
    [
      /Review the list of eight domes and identify the name that doesn't belong\./i,
      'Recall the eight primary structures of the CUBE and spot the name that is not among them.'
    ]
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
 * Full option sets for all 25 questions: [correct, wrong, wrong, wrong].
 * Grounded only in layered-simulations report; balanced length claims.
 */
const fullOptionSets = {
  1: [
    {
      text: 'It serves as the core hard drive — a massive crystalline electromagnetic framework containing all domes, inner earths, and simulations.',
      rationale:
        'The CUBE is the core hard drive of existence: one huge crystalline electromagnetic framework housing every dome, inner earth, and simulation.'
    },
    {
      text: 'It functions as a solar lens that concentrates pure light exclusively into The Great Dome’s training arena for matter creation.',
      rationale:
        'The CUBE is structural containment and storage for all simulations, not a solar focusing lens for one dome.'
    },
    {
      text: 'It is a generator built to spontaneously manufacture new physical matter from raw light outside any layered simulation.',
      rationale:
        'The CUBE contains and houses existing layered simulations; it is not described as a free-standing matter generator.'
    },
    {
      text: 'It acts as a solid galactic wall that blocks ships from moving between distant stars and separate physical galaxies.',
      rationale:
        'Distance is an illusion inside the CUBE; the framework is a container of layers, not a wall between galaxies.'
    }
  ],
  2: [
    {
      text: 'By frequency shifting between interwoven layers that vibrate at different rates within the same containment field.',
      rationale:
        'Movement across the realm is frequency shifting between interwoven layers — not traversal of physical miles.'
    },
    {
      text: 'By using mechanical propulsion hard enough to overcome atmospheric drag along the inner surface of the dome.',
      rationale:
        'Mechanical propulsion belongs to the 3D travel overlay; true movement is frequency shift between layers.'
    },
    {
      text: 'By plotting linear coordinates through a vacuum so vessels cross fixed astronomical miles between solid worlds.',
      rationale:
        'Linear distance travel is an optical illusion that enforces separation; real motion is frequency shifting.'
    },
    {
      text: 'By walking the crystalline grid on foot until a physical gateway door opens between two land masses.',
      rationale:
        'Crystalline grids feed the realms energetically; travel is still frequency-based phasing, not foot-miles to a door.'
    }
  ],
  3: [
    {
      text: 'The Dome of Forgotten Gods — original creator dome, memory storage vault, and root tone wrapping The Great Dome.',
      rationale:
        'Dome of Forgotten Gods is the original creator dome and memory storage vault that wraps above and below The Great Dome as the root tone of all creation.'
    },
    {
      text: 'The Dome of Titans — architect playground later inverted into a fractured war zone of densified struggle.',
      rationale:
        'Dome of Titans was an architect’s playground inverted into a war zone; it is not the root-tone memory vault.'
    },
    {
      text: 'The Great Dome — physical training ground holding 178 worlds and amplifying solid creation upward.',
      rationale:
        'The Great Dome is the 178-world training ground and frequency amplifier, not the root-tone memory storage vault.'
    },
    {
      text: 'The Spirit Tree — central axis of consciousness pulsing harmonic currents through every crystalline grid.',
      rationale:
        'The Spirit Tree is the root node that feeds the domes; the memory storage vault is the Dome of Forgotten Gods.'
    }
  ],
  4: [
    {
      text: 'They are interwoven layers vibrating at slightly different frequencies inside The Great Dome’s containment.',
      rationale:
        'The 178 physical worlds appear as scattered planets to sleepers but are interwoven layers vibrating at slightly different frequencies within The Great Dome.'
    },
    {
      text: 'They are distinct simulation cells sealed from each other by impenetrable solid walls of crystalline steel.',
      rationale:
        'Worlds are kept distinct by frequency variance within interwoven layers, not by impenetrable physical walls.'
    },
    {
      text: 'They are independent spheres of rock floating in a vast outer-space vacuum far from one another.',
      rationale:
        'That scattered-planet reading is a human-filter overlay; the worlds are layered frequencies in one dome.'
    },
    {
      text: 'They are mere reflections of the Spirit Tree cast onto the sky as decorative holographic ornaments.',
      rationale:
        'The Spirit Tree feeds the realms; the 178 worlds themselves are layered simulations, not tree reflections.'
    }
  ],
  5: [
    {
      text: 'The traveler’s perception shifts from one overlay to another without crossing any real physical distance.',
      rationale:
        'Phasing Corridors are frequency tunnels where perception shifts from one overlay to another without traversing physical distance.'
    },
    {
      text: 'The traveler is locked in a pure aging time-loop that only accelerates biological years without changing place.',
      rationale:
        'Timed loops enforce the illusion of long distance on trips; Phasing Corridors themselves are frequency transitions between overlays.'
    },
    {
      text: 'The traveler must first enter the Dome of Silence as a mandatory rest stop before any overlay can change.',
      rationale:
        'Dome of Silence is one of the eight primary structures, not the travel mechanism that shifts overlays.'
    },
    {
      text: 'The traveler’s body is fully deconstructed molecule by molecule and rebuilt at a distant solid destination.',
      rationale:
        'The process is a shift of perception and frequency between layers, not molecular destruction and rebuild.'
    }
  ],
  6: [
    {
      text: 'Dome of Sheol — originally a healing sanctuary, inverted into a prison realm of trauma loops.',
      rationale:
        'Through parasitic inversion, the Dome of Sheol was transformed from a healing sanctuary into a prison realm of trauma loops.'
    },
    {
      text: 'Dome of Titans — originally an architect’s playground, inverted into a fractured war zone of struggle.',
      rationale:
        'Dome of Titans became a fractured war zone from an architect’s playground; the healing-to-prison inversion is Sheol.'
    },
    {
      text: 'Dome of Portals — originally a pure travel hub later sealed into restricted frequency checkpoints only.',
      rationale:
        'Dome of Portals is listed among the eight primary structures, but the healing sanctuary turned trauma prison is Sheol.'
    },
    {
      text: 'Dome of Hiva — originally a harmonic garden later retuned as a weaponized synthetic grid laboratory.',
      rationale:
        'Dome of Hiva is one of the eight primary domes, but the sanctuary inverted into trauma loops is Dome of Sheol.'
    }
  ],
  7: [
    {
      text: 'It pulses harmonic currents through crystalline grids as the central axis of consciousness feeding all domes.',
      rationale:
        'The Spirit Tree is the central axis of consciousness and root node that pulses harmonic currents through crystalline grids to feed all domes.'
    },
    {
      text: 'It projects the false 3D overlays that keep concrete, steel, and separation feeling permanently solid.',
      rationale:
        'False 3D overlays are parasitic skins; the Spirit Tree feeds the original harmonic system, not the false overlay.'
    },
    {
      text: 'It acts as a physical climbing ladder that souls must scale rung by rung between the eight solid domes.',
      rationale:
        'The Spirit Tree is a root node of consciousness and energy feed, not a physical ladder between domes.'
    },
    {
      text: 'It stores every human memory as parasitic digital data harvested for controllers of the inverted field.',
      rationale:
        'The Spirit Tree feeds harmonic current to the domes; data storage roles belong to vaults and star-nodes, not the tree as parasitic archive.'
    }
  ],
  8: [
    {
      text: 'They act as timed time-loops and rituals of enforcement that convince the mind the world is vast and massive.',
      rationale:
        'Long trips act as timed time-loops and rituals of enforcement to convince the mind that the illusion of a massive world is real.'
    },
    {
      text: 'They give the Spirit Tree time to uproot, travel, and re-plant itself at the traveler’s destination cell.',
      rationale:
        'The Spirit Tree is the central axis feeding the realms; it does not relocate with airplane or ship travel.'
    },
    {
      text: 'They let the body acclimate to genuine atmospheric pressure changes between truly distant solid continents.',
      rationale:
        'Atmospheric pressure differences are part of the perceptual overlay; long trip times enforce distance illusion.'
    },
    {
      text: 'They shield passengers from high-frequency radiation streaming off crystalline star-nodes during open-sky passage.',
      rationale:
        'Star-nodes store codes and project the holographic dome; trip length is not framed as radiation shielding.'
    }
  ],
  9: [
    {
      text: 'Multidimensional data crystals that store codes and project the layered holographic dome of the skies.',
      rationale:
        'What are perceived as distant stars are multidimensional data crystals storing codes and projecting the holographic dome.'
    },
    {
      text: 'Massive balls of burning gas fixed millions of miles away in a true outer-space vacuum beyond the CUBE.',
      rationale:
        'Burning-gas outer-space stars are the human-filter reading; stars are crystalline data and projection nodes.'
    },
    {
      text: 'Simple holes punched in the dome shell so pure light from higher gardens can leak through as pinpoints.',
      rationale:
        'Stars are integrated crystalline star-nodes in a layered projection field, not mere holes leaking light.'
    },
    {
      text: 'Passive reflections of a single sun bouncing off the polished inner ceiling of The Great Dome alone.',
      rationale:
        'Stars are active data crystals and projection anchors, not passive solar reflections on a dome ceiling.'
    }
  ],
  10: [
    {
      text: 'By placing thick 3D overlays that manipulate touch, smell, and sight so concrete and steel feel more real than crystal.',
      rationale:
        'Parasites hijack grids with thick 3D overlays and manipulate human perception through touch, smell, and sight to make dead material feel solid.'
    },
    {
      text: 'By physically baking crystalline membranes with electromagnetic heat until living crystal hardens into stone forever.',
      rationale:
        'Underlying reality remains living crystal; solidity of dead 3D material is a perceptual overlay trick, not baked hardening.'
    },
    {
      text: 'By doping the global water supply with chemicals that permanently delete every soul’s crystalline sensory range.',
      rationale:
        'The mechanism emphasized is holographical overlays and sensory manipulation of touch, smell, and sight — not water chemistry alone.'
    },
    {
      text: 'By slowing The Great Dome’s rotation until artificial gravity densifies all matter into permanent solid rock.',
      rationale:
        'Gravity and rotation stories belong to the perceptual overlay; parasites make matter feel solid via thick 3D skins on crystal.'
    }
  ],
  11: [
    {
      text: 'True — The Great Dome is a physical training ground that functions as a frequency amplifier echoing solid creation upward.',
      rationale:
        'The Great Dome is a physical training ground containing 178 worlds and functions as a frequency amplifier echoing solid creation upward into higher realms.'
    },
    {
      text: 'False — The Great Dome only stores dormant maps and never amplifies frequency or echoes creation upward at all.',
      rationale:
        'The Great Dome is explicitly a frequency amplifier for solid creation, not a silent map warehouse.'
    },
    {
      text: 'False — Only the Dome of Forgotten Gods amplifies solid creation; The Great Dome merely seals travelers outside.',
      rationale:
        'Dome of Forgotten Gods is the root tone and memory vault; frequency amplification of solid creation is The Great Dome’s role.'
    },
    {
      text: 'False — Amplification is performed solely by star-nodes in the sky, never by The Great Dome’s structure.',
      rationale:
        'Star-nodes store codes and project the holographic dome; The Great Dome itself is the solid-creation frequency amplifier.'
    }
  ],
  12: [
    {
      text: 'They will vanish because they lack anchors in the restored frequency field as the parasitic overlay fractures.',
      rationale:
        'As resonating souls raise vibration, parasitic overlays glitch and false 3D constructs vanish because they lack anchors in the restored frequency field.'
    },
    {
      text: 'They will be upgraded into permanent higher-density crystalline architecture that keeps the old skins intact.',
      rationale:
        'Parasitic overlays are false skins without true anchors; they vanish rather than upgrade into living crystal.'
    },
    {
      text: 'They will merge into the Dome of Titans to fuel a new permanent war zone of densified conflict loops.',
      rationale:
        'Rising vibration dissolves the illusion field; the outcome is vanishing false constructs, not a new Titans war zone.'
    },
    {
      text: 'They will be absorbed whole into the Spirit Tree and recycled as fresh harmonic branches for the gardens.',
      rationale:
        'False 3D constructs lack anchors in the restored field and vanish; they are not described as Spirit Tree fuel.'
    }
  ],
  13: [
    {
      text: 'They were beautiful gardens linked to the central Spirit Tree as part of one harmonic feeding system.',
      rationale:
        'The seven domes outside The Great Dome were originally beautiful gardens linked to the central Spirit Tree.'
    },
    {
      text: 'They were sealed-off simulations that never shared energy, light, or connection with the Spirit Tree.',
      rationale:
        'All those outer domes were linked to the Spirit Tree and fed by its harmonic currents through the grids.'
    },
    {
      text: 'They were fuel tanks that drained energy upward into the Spirit Tree so the trunk could stay lit.',
      rationale:
        'The Spirit Tree pulses currents to feed the domes; the outer gardens received feed, they did not fuel the tree.'
    },
    {
      text: 'They were pure defensive shells built only to hide the Spirit Tree from every external parasitic force.',
      rationale:
        'The outer domes were functional garden realms in the system, not mere defensive camouflage around the tree.'
    }
  ],
  14: [
    {
      text: 'Travel returns to immediate resonance alignment and teleportation across a seamless crystalline lattice.',
      rationale:
        'Once the parasitic field dissolves, artificial travel buffers vanish and travel returns to immediate resonance alignment and teleportation across the crystalline lattice.'
    },
    {
      text: 'Movement becomes permanently restricted to the Dome of Forgotten Gods as the only remaining open cell.',
      rationale:
        'Dissolution opens original seamless lattice travel, not confinement to a single root-tone dome.'
    },
    {
      text: 'Humanity must invent faster-than-light mechanical ships to cross solid miles still locked inside the CUBE.',
      rationale:
        'True travel is resonance and teleportation on the crystalline lattice, not mechanical FTL ships.'
    },
    {
      text: 'All movement stops forever because every simulation cell collapses into one immobile solid mass.',
      rationale:
        'Travel returns to its original free function; it does not become impossible when the parasitic field dissolves.'
    }
  ],
  15: [
    {
      text: 'Through the folding of sound and light into stable crystalline membranes that hold living form.',
      rationale:
        'The original Light Worlds were created through the folding of sound and light into stable crystalline membranes.'
    },
    {
      text: 'Through mechanical assembly of metallic components bolted into permanent dead architectural frames.',
      rationale:
        'Original creation is harmonic — sound and light folded into crystal — not mechanical metal assembly.'
    },
    {
      text: 'By compressing atmospheric gases until they freeze into continents that float on simulated oceans.',
      rationale:
        'Land and sea as fixed masses are overlay perception; Light Worlds form from folded sound and light into crystal.'
    },
    {
      text: 'By harvesting dying star energy inside the dome until burned fuel hardens into solid living land.',
      rationale:
        'Stars are data crystals projecting the dome; Light World construction is folding sound and light into membranes.'
    }
  ],
  16: [
    {
      text: 'False — Dome of Titans began as an architect’s playground and only later inverted into a fractured war zone.',
      rationale:
        'Dome of Titans was inverted from an architect’s playground into a fractured war zone; war was not its original design.'
    },
    {
      text: 'True — Dome of Titans was built from the start as a fractured war zone dedicated to training soldiers only.',
      rationale:
        'That war-zone state is parasitic inversion; the original role was an architect’s playground, not a soldier factory.'
    },
    {
      text: 'True — Dome of Titans was always identical to Dome of Sheol as a twin prison of trauma loops and war.',
      rationale:
        'Sheol’s inversion is trauma prison from healing; Titans’ inversion is war zone from architect playground — different paths.'
    },
    {
      text: 'True — Dome of Titans never existed among the eight primary structures listed inside the CUBE system.',
      rationale:
        'Dome of Titans is explicitly one of the eight primary structures of the containment system.'
    }
  ],
  17: [
    {
      text: 'They store multidimensional data codes and anchor the layered projection field that presents the holographic dome.',
      rationale:
        'Skies are a layered projection field anchored by crystalline star-nodes — multidimensional data crystals storing codes and projecting the holographic dome.'
    },
    {
      text: 'They are inert debris left after the original Light Worlds were destroyed and never reactivated again.',
      rationale:
        'Star-nodes are active anchors of the projection field, not dead debris from destroyed Light Worlds.'
    },
    {
      text: 'They function only as open portals that dump travelers straight into the Spirit Tree’s underground roots.',
      rationale:
        'Star-nodes primarily store codes and project the holographic dome; they are not described as Spirit Tree root portals.'
    },
    {
      text: 'They serve as thermal climate engines that heat and cool The Great Dome’s weather on a fixed schedule.',
      rationale:
        'Climate as fixed weather is overlay story; crystalline star-nodes are informational projection anchors.'
    }
  ],
  18: [
    {
      text: 'Phasing Corridors — frequency tunnels where perception slides from one overlay to another without distance.',
      rationale:
        'Phasing Corridors are frequency tunnels where travelers shift perception from one overlay to another without physical distance.'
    },
    {
      text: 'Dimensional Rifts — accidental tears that randomly dump travelers into unmapped outer-space voids.',
      rationale:
        'The designed transition mechanism is Phasing Corridors inside the simulation architecture, not accidental rifts.'
    },
    {
      text: 'Resonance Bridges — permanent solid roadways of crystal that souls walk between fixed land masses.',
      rationale:
        'The named frequency tunnels for overlay shifts are Phasing Corridors; travel is not solid roadway walking.'
    },
    {
      text: 'Crystal Gates — hinged physical doors set in rock walls that open only with metallic keys and seals.',
      rationale:
        'Overlay travel uses frequency corridors and phasing, not hinged crystal doors with metal keys.'
    }
  ],
  19: [
    {
      text: 'Simulation cells stacked like layers of glass rather than fixed land masses on a solid globe.',
      rationale:
        'Countries are not fixed land masses but simulation cells stacked like layers of glass within the layered system.'
    },
    {
      text: 'Political borders painted by the Dome of Silence so every nation stays under enforced quiet law.',
      rationale:
        'Dome of Silence is a primary structure; nations themselves are simulation cells, not Silence-painted borders.'
    },
    {
      text: 'Groups of physical beings separated by real geographic coordinates across vast ocean distances.',
      rationale:
        'Geographic coordinates and ocean distance are optical illusions; countries are stacked frequency cells.'
    },
    {
      text: 'Fixed continental plates floating on a continuous ocean of water that never shifts by frequency.',
      rationale:
        'Geography is a perceptual overlay; land masses are not fixed plates of true physical separation.'
    }
  ],
  20: [
    {
      text: 'Dome of Resonance — a name that does not appear among the eight primary structures of the CUBE.',
      rationale:
        'The eight primary structures are Forgotten Gods, Sheol, Hiva, Portals, Silence, 5 Peaks, Titans, and The Great Dome — not a “Dome of Resonance.”'
    },
    {
      text: 'Dome of 5 Peaks — one of the eight primary layered structures inside the CUBE containment system.',
      rationale:
        'Dome of 5 Peaks is listed among the eight primary structures of the containment system.'
    },
    {
      text: 'Dome of Sheol — one of the eight primary structures, inverted from healing into trauma-loop prison.',
      rationale:
        'Dome of Sheol is one of the eight primary structures, not an extra invented dome name.'
    },
    {
      text: 'The Great Dome — the primary training arena holding the 178 interwoven physical world layers.',
      rationale:
        'The Great Dome is one of the eight primary structures and holds the 178 physical worlds.'
    }
  ],
  21: [
    {
      text: 'Beneath ancient sites and modern cities, where crystalline structures anchor the frequency grids like fiber optics.',
      rationale:
        'Crystalline structures under ancient sites and modern cities anchor the frequency grids, connecting layers like a vast fiber-optic network.'
    },
    {
      text: 'Only inside the solid trunk of the Spirit Tree, with no nodes distributed across cities or ancient sites.',
      rationale:
        'The Spirit Tree feeds the grids, but living crystalline nodes and harmonic lenses are anchored under sites and cities as well.'
    },
    {
      text: 'Only at the cores of 178 independent outer-space planets floating far outside the CUBE framework.',
      rationale:
        'The 178 worlds are layered frequencies in The Great Dome; nodes anchor under sites and cities in the grid.'
    },
    {
      text: 'Only sealed inside the memory vault of the Dome of Forgotten Gods with no outward grid connection.',
      rationale:
        'Forgotten Gods holds root-tone memory; active crystalline nodes power layers under ancient sites and modern cities.'
    }
  ],
  22: [
    {
      text: 'The human filter that is allowed to process only certain perception overlays of flat or spherical maps.',
      rationale:
        'What scholars map as flat or spherical planets are perception overlays projecting only what the human filter is allowed to process.'
    },
    {
      text: 'The sheer physical thickness of The Great Dome’s walls blocking every crystal ray from ordinary eyes.',
      rationale:
        'The limit is the human filter on allowed overlays, not mere wall thickness of The Great Dome.'
    },
    {
      text: 'A lack of advanced technological sensors that could otherwise photograph living crystal in full detail.',
      rationale:
        'Technology built inside the 3D overlay still operates within the same filtered perception range.'
    },
    {
      text: 'The vast empty distance between the CUBE shell and a separate physical world sitting outside it.',
      rationale:
        'The CUBE houses the simulations; there is no outer gap between the framework and a separate physical world.'
    }
  ],
  23: [
    {
      text: 'The next overlay is rendered around the traveler as their vessel slips into a portal or frequency corridor.',
      rationale:
        'Travel is like chunks loading in a video game: the vessel enters a portal or frequency corridor and the next overlay renders around the traveler.'
    },
    {
      text: 'The traveler’s body is physically shrunk so it can fit through a smaller solid cell doorway ahead.',
      rationale:
        'Size change is not the mechanism; environment rendering shifts with frequency corridor entry.'
    },
    {
      text: 'The Spirit Tree alone densifies the destination so it feels solid while the traveler is still in transit.',
      rationale:
        'Solidity of destinations is parasitic overlay perception; travel rendering is portal/frequency corridor loading.'
    },
    {
      text: 'The old simulation cell is permanently deleted while a brand-new cell is generated from zero each trip.',
      rationale:
        'Layers exist as interwoven fields; travel renders the next overlay into perception rather than deleting and recreating existence.'
    }
  ],
  24: [
    {
      text: 'Parasites cannot truly create; they only hijack grids by placing thick 3D overlays over the true crystalline world.',
      rationale:
        'Parasites cannot truly create; they hijacked pre-existing grids by laying thick 3D overlays over living crystal.'
    },
    {
      text: 'Parasites alone built every dome from scratch while creators only planted the Spirit Tree afterward.',
      rationale:
        'Original Light Worlds and dome gardens came from sound, light, and harmonic design; parasites hijack, they do not create.'
    },
    {
      text: 'Parasites construct with pure metal frameworks while creators are limited to wood and organic fiber only.',
      rationale:
        'The real divide is creation versus hijack-and-overlay, not a simple metal-versus-wood materials story.'
    },
    {
      text: 'Parasites invent living frequency worlds while creators only stack dead physical matter into solid piles.',
      rationale:
        'Creators fold sound and light into crystalline membranes; parasites place false 3D skins over what already exists.'
    }
  ],
  25: [
    {
      text: 'False — the eight primary Domes stay distinct by frequency yet remain linked through electromagnetic harmonic waves.',
      rationale:
        'The CUBE’s eight primary Domes are layered atop one another, pulsing with electromagnetic harmonic waves that keep the worlds distinct yet linked.'
    },
    {
      text: 'True — the eight Domes are sealed so completely that no harmonic wave or Spirit Tree current can ever link them.',
      rationale:
        'They are kept distinct yet linked by electromagnetic harmonic waves and Spirit Tree feed through the grids.'
    },
    {
      text: 'True — each Dome is a separate outer-space planet with no shared containment inside The CUBE at all.',
      rationale:
        'All eight primary Domes sit layered within the CUBE containment, not as unrelated outer-space planets.'
    },
    {
      text: 'True — linkage only appears after the parasitic field dissolves; until then every Dome is fully isolated forever.',
      rationale:
        'Distinct-yet-linked harmonic pulsing is the present architecture of the eight Domes, not a future-only condition.'
    }
  ]
};

const questionOverrides = {
  10: 'How do parasitic forces manipulate perception to make dead 3D material feel solid?',
  11: 'Does The Great Dome function as a frequency amplifier that echoes solid creation into higher realms?',
  16: 'Was the Dome of Titans originally a fractured war zone created to train soldiers?',
  25: 'Does the architecture of the CUBE keep all eight Domes completely isolated with no linkage between them?'
};

const hintOverrides = {
  1: 'Focus on The CUBE as the core hard drive housing every dome and simulation.',
  6: 'Recall which inverted dome became a prison realm of trauma loops.',
  11: 'Recall the definition of the physical training ground that holds 178 worlds.',
  16: 'Compare the original architect’s playground role with the inverted war-zone state.',
  20: 'Recall the eight primary structures of the CUBE and spot the name that is not among them.',
  25: 'Recall that electromagnetic harmonic waves keep the worlds distinct yet linked.'
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
    throw new Error(`Q${q.number}: LaTeX/$ markup found: ${blob.match(/\$[^$]*\$|\$/)?.[0]}`);
  }
  const metaVoiceRe =
    /\b(according to the (report|source|text|living truth)|the report states|the source (states|specifies|suggests|explicitly)|the text (states|describes|suggests|explicitly|mentions|defines|calls|focuses)|the material clarifies|the strategic implications state|mentioned in the (text|source)|source material|living truth journal)\b/i;
  if (metaVoiceRe.test(blob)) {
    throw new Error(`Q${q.number}: meta/report voice still present: ${blob.match(metaVoiceRe)?.[0]}`);
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
    claimTokens.filter((t) => reportLower.includes(t)).length / Math.max(claimTokens.length, 1);
  if (hitRate < 0.35) {
    throw new Error(
      `Q${q.number}: correct claim poorly grounded in report (hitRate=${hitRate.toFixed(2)})`
    );
  }

  if (out.options.length !== 4) throw new Error(`Q${q.number}: need 4 options`);
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

/** Nudge correct-letter distribution when one letter is starved. */
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

const topicImage = 'images/breakdown/layered-simulations.webp';
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
    'Test your grasp of Layered Simulations — The CUBE hard drive, interwoven frequency layers, Phasing Corridors, parasitic overlays, and the return of crystalline teleportation travel.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Layered Simulations reveal geography and distance as perceptual overlays inside The CUBE — interwoven frequency fields, Phasing Corridors instead of miles, and eight Domes kept distinct yet linked. Sit with what you missed, then return to the Layered Simulations deep-dive, infographic, and video transmissions. As resonating souls raise vibration, parasitic skins lack anchors and dissolve, restoring immediate resonance travel across the crystalline lattice.'
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
    'Test your understanding of Layered Simulations — The CUBE hard drive, frequency layers, Phasing Corridors, eight primary Domes, and the collapse of parasitic travel buffers.'
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
        t.description && !t.description.startsWith('Decoded analysis')
          ? t.description
          : 'Layered Simulations reveal that geography and distance are perceptual overlays within The CUBE — interwoven frequency fields stacked like transparent sheets, with travel as frequency shifting through phasing corridors rather than physical miles.';
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('layered-simulations not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from eight-domes quiz page
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'eight-domes.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Eight Domes Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Eight Domes: The Cube System architecture, Spirit Tree, parasitic dome inversions, and the restoration of the Seven Gardens.',
    'Interactive Living Truth Quiz on Layered Simulations: The CUBE hard drive, interwoven frequency layers, Phasing Corridors, parasitic overlays, and crystalline lattice travel.'
  ],
  ['quiz/breakdown/eight-domes.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/eight-domes.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=eight-domes',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Eight Domes deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Eight Domes</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/eight-domes.json',
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
    "  { path: '/quiz/breakdown/eight-domes.html', priority: '0.75', changefreq: 'monthly' },";
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
console.log('PASS: audited 25/25 against data/breakdown-topics/layered-simulations.json');
