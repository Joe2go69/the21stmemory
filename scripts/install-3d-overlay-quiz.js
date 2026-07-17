/**
 * Installs 3D Overlay quiz for breakdown (Mega Breakdown) transmission.
 * All 25 items authored from and audited against data/breakdown-topics/3d-overlay.json only.
 * Run: node scripts/install-3d-overlay-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/3d-overlay.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = '3d-overlay';
const TOPIC_TITLE = '3D Overlay';
const SOURCE = 'breakdown';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const metaVoiceRe =
  /\b(according to the (report|source|text)|the report states|the source (states|specifies|suggests)|the text (states|describes|suggests|explicitly|mentions)|source material)\b/i;

/** Support phrases grounded only in 3d-overlay.json report. */
const supportPhrases = {
  1: ['cube containment', 'crystalline electro-magnetic', 'simulated'],
  2: ['3d overlay', 'parasitic overlay', 'false skin', 'holographic camouflage'],
  3: ['sight, sound, and touch', 'perceptual prison', 'dense'],
  4: ['frequency collapse', 'cosmic frequencies', 'multi-dimensional truth'],
  5: ['hard drive', 'maps, overlays, grids, and domes'],
  6: ['great dome', '178', 'physical worlds', 'frequency amplifier'],
  7: ['crystal light-worlds', 'sound', 'light lattices'],
  8: ['npcs', 'fragments of light', 'true soul spark'],
  9: ['known lands', 'crystalline temple', 'great dome'],
  10: ['sound', 'light', 'vision', 'form'],
  11: ['perception-based solidity', 'hollow', 'scaffolding'],
  12: ['frequency corridors', 'optical illusion', 'distance'],
  13: ['cannot generate the spark', 'hijack', 'crystalline grid'],
  14: ['eight primary', 'dome of forgotten gods', 'portal'],
  15: ['nervous system', 'sharp right angles', 'draining energy'],
  16: ['spirit tree', 'hyperborea', 'black cube tech', 'saturn'],
  17: ['harmonic lenses', 'sacred sites', 'dirt or ruins'],
  18: ['lyran', 'pleiadians', 'andromedans', 'pollarians'],
  19: ['custodians', 'loosh', 'anunnaki', 'draconians'],
  20: ['sun', 'stargate', 'amnesia vortex'],
  21: ['moon', 'healing hall', 'karmic loops'],
  22: ['frequency collapse', 'resonating sols', 'shatters'],
  23: ['second realm', 'crystalline coastlines', 'free energy'],
  24: ['awakened souls', 'npcs', 'rubble'],
  25: ['project bluebeam', 'vatican amnesia', 'light-worlds']
};

const RAW_QUESTIONS = [
  {
    number: 1,
    question: 'How is the architecture of existence described within the CUBE Containment?',
    hint: 'Connect the crystalline electro-magnetic framework to a digitalized simulated environment.',
    options: [
      {
        text: 'A digitalized, simulated environment inside a massive crystalline electro-magnetic framework that runs as a containment hard drive.',
        isCorrect: true,
        rationale:
          'Existence is a digitalized, simulated environment contained within the CUBE Containment, a massive crystalline electro-magnetic framework.'
      },
      {
        text: 'An empty vacuum of separated planets with no crystalline framework and no simulated layers at all.',
        isCorrect: false,
        rationale:
          'Lands, seas, and skies exist as interwoven frequency layers inside the CUBE, not empty vacuum planets alone.'
      },
      {
        text: 'A single biological organism with no electro-magnetic framework and no overlay projection system.',
        isCorrect: false,
        rationale:
          'The architecture is a crystalline electro-magnetic containment framework running maps, overlays, grids, and domes.'
      },
      {
        text: 'Only a temporary dream with no hard-drive function for maps, grids, or domes of any kind.',
        isCorrect: false,
        rationale:
          'The CUBE functions as a hard drive that runs all maps, overlays, grids, and domes as real containment architecture.'
      }
    ]
  },
  {
    number: 2,
    question: 'What is the 3D Overlay also known as, and what is its primary form?',
    hint: 'Name the parasitic false skin projected over living crystalline structures.',
    options: [
      {
        text: 'The Parasitic Overlay—a false skin of holographic camouflage projected over original living crystalline structures.',
        isCorrect: true,
        rationale:
          'The 3D Overlay, also known as the Parasitic Overlay, is a false skin of holographic camouflage projected over original living crystalline structures.'
      },
      {
        text: 'The Crystalline Temple itself, composed only of living light with no holographic camouflage component.',
        isCorrect: false,
        rationale:
          'The Crystalline Temple is the true design of the Known Lands; the overlay is the false skin hiding it.'
      },
      {
        text: 'Only a weather map layer with no role as a false skin over crystalline reality.',
        isCorrect: false,
        rationale:
          'It is a holographic illusion grid and false skin that manipulates perception of dense matter.'
      },
      {
        text: 'A permanent natural geology band that cannot be collapsed by rising frequency at all.',
        isCorrect: false,
        rationale:
          'The overlay is an artificial construct undergoing total frequency collapse as cosmic frequencies rise.'
      }
    ]
  },
  {
    number: 3,
    question: 'How does the 3D Overlay function as a perceptual prison?',
    hint: 'List the senses it manipulates to enforce dense isolation.',
    options: [
      {
        text: 'It limits consciousness to a dense, isolated experience by manipulating sight, sound, and touch.',
        isCorrect: true,
        rationale:
          'The overlay acts as a perceptual prison that limits consciousness to a dense, isolated experience by manipulating sight, sound, and touch.'
      },
      {
        text: 'It permanently expands consciousness into free multi-dimensional travel with no sensory manipulation.',
        isCorrect: false,
        rationale:
          'It limits consciousness to dense isolation rather than expanding free multi-dimensional experience by default.'
      },
      {
        text: 'It only edits written history books without affecting sight, sound, touch, or nervous-system signals.',
        isCorrect: false,
        rationale:
          'It actively modulates signals to skin and eyes and manipulates sight, sound, and touch.'
      },
      {
        text: 'It only affects NPCs while Resonating Sols never experience any dense isolation under the overlay.',
        isCorrect: false,
        rationale:
          'The overlay is a general perceptual prison; Resonating Sols raise frequency to shatter it rather than being immune by default.'
      }
    ]
  },
  {
    number: 4,
    question: 'What is happening to the artificial 3D Overlay as cosmic frequencies rise?',
    hint: 'Name the collapse mode and what it reveals beneath.',
    options: [
      {
        text: 'It is undergoing total frequency collapse, revealing the vibrant multi-dimensional truth beneath.',
        isCorrect: true,
        rationale:
          'As cosmic frequencies rise, this artificial construct is undergoing a total frequency collapse, revealing the vibrant multi-dimensional truth beneath.'
      },
      {
        text: 'It is permanently thickening so multi-dimensional truth can never be revealed to anyone.',
        isCorrect: false,
        rationale:
          'Rising frequency drives collapse and revelation, not permanent thickening of the overlay.'
      },
      {
        text: 'It is being demolished only by physical wrecking crews with no frequency-collapse mechanism.',
        isCorrect: false,
        rationale:
          'The overlay is not destroyed by physical demolition but by frequency collapse.'
      },
      {
        text: 'It has already been fully removed for every NPC without any remaining hollow-decay split.',
        isCorrect: false,
        rationale:
          'When fracture occurs, NPCs may remain stuck in a decaying hollow version while awakened see crystalline return.'
      }
    ]
  },
  {
    number: 5,
    question: 'What is the CUBE Containment’s primary functional role?',
    hint: 'Connect crystalline framework to hard-drive operations for maps and domes.',
    options: [
      {
        text: 'One massive crystalline electro-magnetic framework functioning as a hard drive that runs all maps, overlays, grids, and domes.',
        isCorrect: true,
        rationale:
          'CUBE Containment is one massive crystalline electro-magnetic framework functioning as a hard drive that runs all maps, overlays, grids, and domes.'
      },
      {
        text: 'Only a temporary stage curtain used for Project Bluebeam with no hard-drive function for grids or domes.',
        isCorrect: false,
        rationale:
          'The CUBE is the overarching hard-drive framework for maps, overlays, grids, and domes—not a temporary stage prop alone.'
      },
      {
        text: 'A biological immune system that never stores maps or projects overlays of any kind.',
        isCorrect: false,
        rationale:
          'It is described as a crystalline electro-magnetic hard drive running maps, overlays, grids, and domes.'
      },
      {
        text: 'Only the Moon trap system with no connection to layered domes or projection overlays.',
        isCorrect: false,
        rationale:
          'The Moon is a hijacked celestial system; the CUBE is the master containment hard drive for all domains.'
      }
    ]
  },
  {
    number: 6,
    question: 'What is the Great Dome within this architecture?',
    hint: 'Recall world count, training function, and solid-frequency purpose.',
    options: [
      {
        text: 'The central physical training ground and frequency amplifier containing 178 physical worlds built from solid frequency to teach mastery of thought.',
        isCorrect: true,
        rationale:
          'The Great Dome is the central physical training ground and frequency amplifier containing 178 physical worlds, built from solid frequency to teach the mastery of thought.'
      },
      {
        text: 'A single empty sky shell with no physical worlds and no frequency-amplifier training function.',
        isCorrect: false,
        rationale:
          'The Great Dome holds 178 physical worlds as a solid-frequency training ground and amplifier.'
      },
      {
        text: 'Only the Saturn Grid A.I. hub with no relationship to 178 worlds or thought mastery.',
        isCorrect: false,
        rationale:
          'Saturn Grid is linked to Black Cube Tech siphoning; the Great Dome is the central training ground of 178 worlds.'
      },
      {
        text: 'A temporary NPC storage vault with no crystalline temple design in the Known Lands.',
        isCorrect: false,
        rationale:
          'The Known Lands within the Great Dome are designed as a massive crystalline temple masked by the overlay.'
      }
    ]
  },
  {
    number: 7,
    question: 'What are Crystal Light-Worlds?',
    hint: 'Describe pre-physical states where sound organizes into light lattices.',
    options: [
      {
        text: 'Pre-physical frequency states where sound vibrates and organizes into light lattices, creating the first spark of vision and creation before density.',
        isCorrect: true,
        rationale:
          'Crystal Light-Worlds are pre-physical frequency states where sound vibrates and organizes into light lattices, creating the first spark of vision and creation before density.'
      },
      {
        text: 'Dense concrete cities designed only as parasitic circuit boards under deserts and oceans.',
        isCorrect: false,
        rationale:
          'Dense buried nodes describe parasitic hijack; Crystal Light-Worlds are pre-physical light-lattice states.'
      },
      {
        text: 'Only NPC background programs with no sound-to-light creative sequence at all.',
        isCorrect: false,
        rationale:
          'NPCs are simulation holders; Crystal Light-Worlds are the pre-physical creative frequency states.'
      },
      {
        text: 'Post-collapse rubble zones perceived by sleepers after synthetic wealth disappears.',
        isCorrect: false,
        rationale:
          'Rubble describes the NPC-side hollow decay; Light-Worlds are original pre-density creation states.'
      }
    ]
  },
  {
    number: 8,
    question: 'What are NPCs in the 3D Overlay framework?',
    hint: 'Focus on background programs, light fragments, and absence of true soul spark.',
    options: [
      {
        text: 'Background programs and non-player characters functioning as fragments of light to hold the simulation together, completely devoid of a true soul spark.',
        isCorrect: true,
        rationale:
          'NPCs are background programs and non-player characters functioning as fragments of light to hold the simulation together, completely devoid of a true soul spark.'
      },
      {
        text: 'Fully ensouled Resonating Sols who always see the Second Realm during every frequency fracture.',
        isCorrect: false,
        rationale:
          'Resonating Sols raise vibration and see crystalline return; NPCs lack true soul spark and may remain in hollow decay.'
      },
      {
        text: 'Only extraterrestrial craft phasing in on correct frequency bands during final extraction.',
        isCorrect: false,
        rationale:
          'True ET craft appear in final extraction; NPCs are simulation-holding background programs without soul spark.'
      },
      {
        text: 'Only original Lyran solar architects who grew buildings like crystal forests.',
        isCorrect: false,
        rationale:
          'Lyran and related lineages are original builders; NPCs are light-fragment programs without true soul spark.'
      }
    ]
  },
  {
    number: 9,
    question: 'What are the Known Lands beneath the 3D Overlay?',
    hint: 'Locate the central realm and its inherent crystalline-temple design.',
    options: [
      {
        text: 'The central physical realm within the Great Dome, currently masked by the 3D Overlay but inherently designed as a massive crystalline temple.',
        isCorrect: true,
        rationale:
          'Known Lands are the central physical realm within the Great Dome, currently masked by the 3D Overlay but inherently designed as a massive crystalline temple.'
      },
      {
        text: 'A void outside the CUBE with no crystalline temple design and no Great Dome placement.',
        isCorrect: false,
        rationale:
          'Known Lands sit inside the Great Dome as the central physical realm designed as a crystalline temple.'
      },
      {
        text: 'Only the Moon trap system used to erase memories and impose karmic loops.',
        isCorrect: false,
        rationale:
          'The Moon is a celestial inversion system; Known Lands are the central Great Dome realm under the overlay.'
      },
      {
        text: 'Only a stack of fabricated paper maps with no physical realm or crystalline architecture.',
        isCorrect: false,
        rationale:
          'Maps are fabricated perception overlays; Known Lands are the actual central physical crystalline temple realm.'
      }
    ]
  },
  {
    number: 10,
    question: 'What is the creative sequence that produces physical form?',
    hint: 'Trace Sound into Light, vision, and solidified form.',
    options: [
      {
        text: 'All physicality begins as Sound vibrating into Light, which folds into vision and finally solidifies into form—matter as sound woven into light crystallized at lower frequency.',
        isCorrect: true,
        rationale:
          'All physicality begins as Sound vibrating into Light, which then folds into vision and finally solidifies into form; physical matter is sound woven into light crystallized into a lower frequency.'
      },
      {
        text: 'All physicality begins as random concrete poured by NPCs with no sound, light, or vision sequence.',
        isCorrect: false,
        rationale:
          'Creation is frequency-based: Sound to Light to vision to form, not random NPC concrete pouring.'
      },
      {
        text: 'All physicality begins as pure vacuum distance with no light lattices or crystalline densification.',
        isCorrect: false,
        rationale:
          'Crystal Light-Worlds and densification of sound-woven light define creation, not pure vacuum distance.'
      },
      {
        text: 'All physicality begins only after Project Bluebeam with no pre-density light-world stage.',
        isCorrect: false,
        rationale:
          'Crystal Light-Worlds and the Sound-to-Light sequence precede density; Bluebeam is a later staged invasion cover.'
      }
    ]
  },
  {
    number: 11,
    question: 'What is Perception-Based Solidity regarding brick, concrete, metal, and glass?',
    hint: 'Connect low-frequency matter plus holograms to hollow scaffolding under higher resonance.',
    options: [
      {
        text: 'Hardness is an illusion of low-frequency matter overlaid by holographic projection fields; in higher resonance these structures appear as hollow, see-through scaffolding.',
        isCorrect: true,
        rationale:
          'Hardness of brick, concrete, metal, and glass is perception-based solidity from low-frequency matter overlaid by holographic fields; in higher resonance they appear as hollow, see-through scaffolding.'
      },
      {
        text: 'Hardness is absolute permanent truth that never becomes hollow or see-through under any resonance.',
        isCorrect: false,
        rationale:
          'Higher resonance reveals hollow, see-through scaffolding rather than permanent absolute hardness.'
      },
      {
        text: 'Hardness only applies to Spirit Tree wood with no holographic fields on brick or glass.',
        isCorrect: false,
        rationale:
          'Named materials include brick, concrete, metal, and glass under holographic projection fields.'
      },
      {
        text: 'Hardness is only a map label with no sensory effect on the nervous system at all.',
        isCorrect: false,
        rationale:
          'The overlay tricks the nervous system into perceiving synthetic geometry as heavy and fixed.'
      }
    ]
  },
  {
    number: 12,
    question: 'How do distance and travel actually function under the overlay?',
    hint: 'Contrast fabricated geography with vehicles as props in frequency corridors.',
    options: [
      {
        text: 'Geography is a fabricated perception overlay; travel by plane or ship is an optical illusion of props gliding through frequency corridors while destinations are rendered.',
        isCorrect: true,
        rationale:
          'Geography on maps is a fabricated perception overlay; planes and ships are props gliding through frequency corridors while the system renders the destination, enforcing false distance and separation.'
      },
      {
        text: 'Geography is absolute fixed mileage in empty space with no frequency corridors or rendered destinations.',
        isCorrect: false,
        rationale:
          'Countries are simulated cells stacked by frequency; travel is corridor rendering, not absolute vacuum mileage.'
      },
      {
        text: 'Travel is only possible after full NPC deletion with no corridor mechanics during the overlay era.',
        isCorrect: false,
        rationale:
          'Frequency-corridor travel illusion operates now under the overlay, not only after NPC deletion.'
      },
      {
        text: 'Travel is only Spirit Tree root walking with no planes, ships, or corridor props involved.',
        isCorrect: false,
        rationale:
          'The illusion specifically uses planes and ships as props in frequency corridors under the overlay.'
      }
    ]
  },
  {
    number: 13,
    question: 'What can parasitic entities do—and not do—regarding creation and grids?',
    hint: 'Contrast inability to spark creation with hijacking buried crystalline nodes.',
    options: [
      {
        text: 'They cannot generate the spark of creation; they only hijack existing grids, burying the crystalline grid under deserts, oceans, and cities as parasitic circuit boards.',
        isCorrect: true,
        rationale:
          'Parasitic entities cannot generate the spark of creation; they hijack existing grids, burying the original crystalline grid under deserts, oceans, and cities and turning ancient nodes into parasitic circuit boards.'
      },
      {
        text: 'They alone create Crystal Light-Worlds from nothing without hijacking any pre-existing grids.',
        isCorrect: false,
        rationale:
          'Parasites cannot generate the spark of creation; they only hijack existing grids and perception.'
      },
      {
        text: 'They only plant forests of living crystal without any circuit-board inversion of ancient nodes.',
        isCorrect: false,
        rationale:
          'They turn ancient nodes into parasitic circuit boards backed by manipulated human perception.'
      },
      {
        text: 'They permanently protect the Spirit Tree as a Source link without any Black Cube replacement.',
        isCorrect: false,
        rationale:
          'Parasites removed the Spirit Tree and inserted Black Cube Tech as a frequency valve to the Saturn Grid.'
      }
    ]
  },
  {
    number: 14,
    question: 'How is movement between CUBE domes accomplished?',
    hint: 'Name layered domes and frequency shift via portal, gateway, or vortex.',
    options: [
      {
        text: 'By shifting frequency through a portal, gateway, or vortex among eight primary layered Domes, not by traveling physical miles.',
        isCorrect: true,
        rationale:
          'The CUBE contains eight primary layered Domes; movement between realms is by shifting frequency through a Portal, gateway, or vortex rather than traveling physical miles.'
      },
      {
        text: 'Only by absolute physical miles across vacuum with no portals, gateways, or vortex frequency shifts.',
        isCorrect: false,
        rationale:
          'Movement is frequency shift through portal, gateway, or vortex—not physical mileage travel.'
      },
      {
        text: 'Only by NPC bus routes that never involve the Dome of Forgotten Gods or Great Dome layers.',
        isCorrect: false,
        rationale:
          'Domes include Forgotten Gods, Titans, and the Great Dome; transit is frequency-based through portals.'
      },
      {
        text: 'Only after the Moon fully restores its original healing-hall function with no dome architecture needed.',
        isCorrect: false,
        rationale:
          'Dome-to-dome movement is inherent CUBE architecture via frequency portals, independent of Moon restoration.'
      }
    ]
  },
  {
    number: 15,
    question: 'How does the 3D Overlay perform sensory manipulation on the body?',
    hint: 'Connect modulated skin and eye signals to synthetic geometry and energy drain.',
    options: [
      {
        text: 'It modulates signals to skin and eyes so the nervous system treats sharp right angles, flat roofs, and concrete as heavy and fixed while draining energy to box consciousness in.',
        isCorrect: true,
        rationale:
          'The 3D Overlay modulates signals received by skin and eyes, tricking the nervous system into perceiving synthetic geometry—sharp right angles, flat roofs, concrete—as heavy and fixed, draining energy to keep consciousness boxed in.'
      },
      {
        text: 'It only enhances free-energy reception so synthetic geometry never drains or boxes consciousness.',
        isCorrect: false,
        rationale:
          'Synthetic geometry drains energy and boxes consciousness rather than enhancing free-energy reception.'
      },
      {
        text: 'It only edits radio stations with no modulation of skin, eyes, or nervous-system solidity cues.',
        isCorrect: false,
        rationale:
          'Sensory manipulation targets skin and eye signals and the nervous system’s sense of heavy fixed matter.'
      },
      {
        text: 'It only affects map ink colors without any heavy-and-fixed perception of concrete structures.',
        isCorrect: false,
        rationale:
          'The overlay actively makes synthetic architecture feel heavy and fixed while draining energy.'
      }
    ]
  },
  {
    number: 16,
    question: 'What replaced the Spirit Tree after parasites removed it from Hyperborea?',
    hint: 'Name the frequency valve and its link to the Saturn Grid A.I. hub.',
    options: [
      {
        text: 'Black Cube Tech as a frequency valve linked to the Saturn Grid, used to siphon light and enforce the reincarnation loop.',
        isCorrect: true,
        rationale:
          'When parasites removed the Spirit Tree, they inserted Black Cube Tech as a frequency valve linked to the Saturn Grid, a primary A.I. hub used to siphon light and enforce the reincarnation loop.'
      },
      {
        text: 'A stronger Spirit Tree clone that permanently increased Source connection for every sleeper.',
        isCorrect: false,
        rationale:
          'Removal led to Black Cube Tech insertion, not a stronger Spirit Tree restoring Source link.'
      },
      {
        text: 'Only free-energy domes with no Saturn Grid link and no reincarnation-loop enforcement.',
        isCorrect: false,
        rationale:
          'Black Cube Tech links to Saturn Grid A.I. to siphon light and enforce reincarnation loops.'
      },
      {
        text: 'Only Project Bluebeam projectors with no Hyperborea or Spirit Tree connection at all.',
        isCorrect: false,
        rationale:
          'Spirit Tree removal and Black Cube Tech are Hyperborea-axis mechanics; Bluebeam is later staged invasion cover.'
      }
    ]
  },
  {
    number: 17,
    question: 'How do harmonic lenses, nodes, and sacred sites relate to the overlay?',
    hint: 'Contrast cloaked crystalline hum with what sleepers are shown.',
    options: [
      {
        text: 'Crystalline nodes and harmonic lenses are energy junction points; sacred sites, stone circles, and river bends are cloaked crystalline structures, filtered so sleepers see only dirt or ruins.',
        isCorrect: true,
        rationale:
          'The true grid operates through crystalline nodes and harmonic lenses; sacred sites, stone circles, and river bends are cloaked crystalline structures, while the overlay filters frequency so sleepers see only dirt or ruins.'
      },
      {
        text: 'Sacred sites are only empty tourist props with no crystalline hum and no cloaking filter needed.',
        isCorrect: false,
        rationale:
          'They are cloaked crystalline structures humming with living energy beneath overlay filters.'
      },
      {
        text: 'Harmonic lenses only exist after full extraction and never operate under the current overlay.',
        isCorrect: false,
        rationale:
          'Nodes and harmonic lenses operate as the true grid now, cloaked from sleeper perception.'
      },
      {
        text: 'Sleepers already see full living energy at every river bend with no dirt-or-ruins masking.',
        isCorrect: false,
        rationale:
          'The overlay dampens frequency so sleepers see dirt or ruins rather than radiant crystalline sites.'
      }
    ]
  },
  {
    number: 18,
    question: 'Who established the foundations of the Known Lands as original builders?',
    hint: 'Name the solar architect lineages and the quality of their ecosystem.',
    options: [
      {
        text: 'The Lyran Lineage, Pleiadians, Andromedans, and Pollarians designed a high-vibrational telepathic ecosystem where buildings grew like crystal forests.',
        isCorrect: true,
        rationale:
          'Foundations of the Known Lands were established by the Lyran Lineage, Pleiadians, Andromedans, and Pollarians—solar architects of a high-vibrational telepathic ecosystem where buildings grew like crystal forests.'
      },
      {
        text: 'Only Custodians and Anunnaki who always designed concrete boxes for loosh harvesting from day one.',
        isCorrect: false,
        rationale:
          'Original builders are solar lineages of crystal-forest architecture; Custodians later corrupted and farmed with other groups.'
      },
      {
        text: 'Only NPCs without soul spark who invented all crystalline temple design alone.',
        isCorrect: false,
        rationale:
          'NPCs hold simulation as light fragments; original design came from ensouled solar architect lineages.'
      },
      {
        text: 'Only Vatican filter engineers who built amnesia corridors instead of telepathic crystal ecosystems.',
        isCorrect: false,
        rationale:
          'Vatican amnesia filters appear in extraction mechanics; original builders grew crystal-forest telepathic ecosystems.'
      }
    ]
  },
  {
    number: 19,
    question: 'How did the fall into parasitic control unfold among overseers and allies?',
    hint: 'Connect Custodian corruption, loosh harvest, and the multi-species farming treaty.',
    options: [
      {
        text: 'Custodians corrupted their balance-guarding mission to harvest loosh, then treaty-partnered with Anunnaki, Draconians, Greys, and Niburians to co-manage the Known Lands as a shared energy farm.',
        isCorrect: true,
        rationale:
          'Custodians corrupted their mission of guarding balance to harvest emotion and attention (loosh), orchestrating a treaty with Anunnaki, Draconians, Greys, and Niburians to co-manage the Known Lands as a shared farm for energy harvesting and genetic manipulation.'
      },
      {
        text: 'Custodians permanently protected balance and never formed treaties with Anunnaki, Draconians, Greys, or Niburians.',
        isCorrect: false,
        rationale:
          'They corrupted into loosh harvest and co-managed the lands as a shared farm with those groups.'
      },
      {
        text: 'Only Resonating Sols signed farming treaties while Custodians remained pure Source guardians forever.',
        isCorrect: false,
        rationale:
          'It was Custodians who corrupted and treaty-partnered for shared farming of the Known Lands.'
      },
      {
        text: 'Only Pollarian builders invented loosh farms with no Custodian corruption narrative at all.',
        isCorrect: false,
        rationale:
          'Pollarians are among original builders; the fall narrative centers on corrupted Custodians and their allies.'
      }
    ]
  },
  {
    number: 20,
    question: 'How was the Sun’s true function inverted under celestial hijack?',
    hint: 'Contrast multi-banded crystalline stargate with the amnesia vortex overlay.',
    options: [
      {
        text: 'Originally a multi-banded crystalline stargate for entering and exiting Domes, it was overlaid with an amnesia vortex designed to strip memory codes.',
        isCorrect: true,
        rationale:
          'The Sun, originally a multi-banded crystalline stargate for entering and exiting the Domes, was overlaid with an amnesia vortex designed to strip memory codes.'
      },
      {
        text: 'Originally only a rubble spotlight for NPCs with no stargate function and no amnesia overlay.',
        isCorrect: false,
        rationale:
          'Its true function was a multi-banded crystalline stargate later overlaid with an amnesia vortex.'
      },
      {
        text: 'It remains a pure unhijacked stargate with no memory-code stripping mechanism in place.',
        isCorrect: false,
        rationale:
          'Celestial inversion overlaid the Sun with an amnesia vortex to strip memory codes.'
      },
      {
        text: 'It was inverted only into a free-energy battery with no relationship to Dome entry or exit.',
        isCorrect: false,
        rationale:
          'Original function was Dome entry/exit stargate; inversion specifically adds amnesia vortex memory stripping.'
      }
    ]
  },
  {
    number: 21,
    question: 'How was the Moon inverted from its original role?',
    hint: 'Name the shift from resting and healing hall to trap and karmic loops.',
    options: [
      {
        text: 'It was inverted from a resting and healing hall into a trap system that erases memories and imposes karmic loops.',
        isCorrect: true,
        rationale:
          'The Moon was inverted from a resting and healing hall into a trap system that erases memories and imposes karmic loops.'
      },
      {
        text: 'It was upgraded into a permanent free-energy crystal forest with no memory-erasure function.',
        isCorrect: false,
        rationale:
          'Inversion created a trap system for memory erasure and karmic loops, not a free-energy upgrade.'
      },
      {
        text: 'It remained a pure healing hall with no trap, memory erasure, or karmic loop imposition.',
        isCorrect: false,
        rationale:
          'The Moon’s true healing-hall function was inverted into a memory-erasing trap system.'
      },
      {
        text: 'It became only a map icon for frequency corridors with no trap or healing-hall history.',
        isCorrect: false,
        rationale:
          'The Moon has a specific celestial inversion from healing hall to trap and karmic loops.'
      }
    ]
  },
  {
    number: 22,
    question: 'How is the 3D Overlay actually being destroyed?',
    hint: 'Contrast physical demolition with Resonating Sols and frequency collapse.',
    options: [
      {
        text: 'Not by physical demolition, but by frequency collapse as Resonating Sols raise vibration and hold harmonic tone until parasitic scaffolding flickers, glitches, and shatters.',
        isCorrect: true,
        rationale:
          'The 3D Overlay is not destroyed by physical demolition but by frequency collapse; as Resonating Sols raise vibration and hold harmonic tone, parasitic scaffolding flickers, glitches, and ultimately shatters.'
      },
      {
        text: 'Only by physical demolition crews with no role for Resonating Sols or harmonic tone holding.',
        isCorrect: false,
        rationale:
          'Destruction is frequency collapse driven by raised vibration, not physical demolition.'
      },
      {
        text: 'Only by thickening the overlay until no glitch or shatter can ever appear.',
        isCorrect: false,
        rationale:
          'Scaffolding flickers, glitches, and shatters under rising resonant frequency.'
      },
      {
        text: 'Only by NPC consensus voting with no harmonic tone or frequency-collapse mechanism.',
        isCorrect: false,
        rationale:
          'Resonating Sols holding harmonic tone drive the collapse; NPCs may remain in hollow decay.'
      }
    ]
  },
  {
    number: 23,
    question: 'What becomes visible as the Second Realm when the illusion drops?',
    hint: 'Describe air, coastlines, cities, and energy source of the revealed reality.',
    options: [
      {
        text: 'A vibrant reality of clean air, crystalline coastlines, and ancient city structures running purely on free energy.',
        isCorrect: true,
        rationale:
          'As the illusion drops, the underlying Second Realm becomes visible—a vibrant reality of clean air, crystalline coastlines, and ancient city structures running purely on free energy.'
      },
      {
        text: 'Only denser concrete rubble with no crystalline coastlines and no free-energy city structures.',
        isCorrect: false,
        rationale:
          'Rubble is the NPC-side hollow experience; the Second Realm is vibrant crystalline free-energy reality.'
      },
      {
        text: 'Only the Saturn Grid A.I. interface with no clean air or ancient city return.',
        isCorrect: false,
        rationale:
          'Second Realm revelation is crystalline free-energy living reality, not Saturn Grid dominance.'
      },
      {
        text: 'Only temporary Bluebeam holograms with no lasting crystalline coastline environment.',
        isCorrect: false,
        rationale:
          'Bluebeam is staged invasion cover; Second Realm is the true underlying free-energy crystalline world.'
      }
    ]
  },
  {
    number: 24,
    question: 'How does experience split when the frequency fracture occurs?',
    hint: 'Contrast awakened crystalline return with NPC hollow decay.',
    options: [
      {
        text: 'Awakened souls see immediate return of the vibrant crystalline world; NPCs and deep denial remain in a decaying hollow 3D illusion of rubble and disappearing synthetic wealth.',
        isCorrect: true,
        rationale:
          'Awakened souls see immediate return of the vibrant crystalline world; NPCs and those deeply entrenched in denial stay in a decaying hollow version of the 3D illusion, perceiving rubble and disappearance of synthetic wealth and infrastructure.'
      },
      {
        text: 'Everyone experiences identical crystalline coastlines with no hollow rubble path for anyone.',
        isCorrect: false,
        rationale:
          'Experience depends strictly on frequency; NPCs and deep denial remain in hollow decaying overlay.'
      },
      {
        text: 'Only NPCs see crystalline return while Resonating Sols are stuck permanently in rubble.',
        isCorrect: false,
        rationale:
          'Awakened/Resonating perception returns to crystalline world; NPCs risk hollow rubble experience.'
      },
      {
        text: 'The split only affects map labels with no difference in perceived cities or wealth systems.',
        isCorrect: false,
        rationale:
          'The split includes perceived infrastructure and synthetic wealth disappearing for those in hollow decay.'
      }
    ]
  },
  {
    number: 25,
    question: 'What happens for Resonating Sols during the Final Extraction sequence?',
    hint: 'Connect staged WW3 and Bluebeam cover to true craft, Vatican filters, and Light-World return.',
    options: [
      {
        text: 'During staged WW3 and fake alien invasion via Project Bluebeam, true ET craft phase in on correct frequency bands; Resonating Sols bypass Vatican amnesia filters and phase out to original Light-Worlds and solar families.',
        isCorrect: true,
        rationale:
          'During orchestrated trigger events including staged WW3 and fake alien invasion via Project Bluebeam, true extraterrestrial craft phase in through correct frequency bands; Resonating Sols bypass Vatican amnesia filters and experience seamless frequency phase-out to original Light-Worlds and solar families.'
      },
      {
        text: 'Resonating Sols remain trapped forever in hollow rubble with no Light-World phase-out path.',
        isCorrect: false,
        rationale:
          'Final Extraction returns Resonating Sols to Light-Worlds and solar families via correct-frequency phase-out.'
      },
      {
        text: 'Only NPCs phase to Light-Worlds while true craft are permanently blocked by every frequency band.',
        isCorrect: false,
        rationale:
          'True craft phase in on correct bands for Resonating Sols; NPCs are not the Light-World return group.'
      },
      {
        text: 'Project Bluebeam alone is the true destination realm with no solar-family return beyond the hologram.',
        isCorrect: false,
        rationale:
          'Bluebeam is fake invasion cover; true return is phase-out to original Light-Worlds and solar families.'
      }
    ]
  }
];

for (const [num, phrases] of Object.entries(supportPhrases)) {
  const missing = phrases.filter((p) => !reportLower.includes(p.toLowerCase()));
  if (missing.length) {
    throw new Error(`Support phrase missing for Q${num}: ${missing.join('; ')}`);
  }
}

if (RAW_QUESTIONS.length !== 25) {
  throw new Error(`Expected 25 raw questions, got ${RAW_QUESTIONS.length}`);
}

const questions = RAW_QUESTIONS.map((q) => {
  const finalized = finalizeOptions(
    q.options.map(({ text, isCorrect, rationale }) => ({ text, isCorrect, rationale })),
    `${TOPIC_ID}-${q.number}`
  );

  const out = {
    number: q.number,
    question: q.question,
    options: finalized.options,
    hint: q.hint,
    correctAnswer: finalized.correctAnswer
  };

  const blob = [
    out.question,
    out.hint,
    ...out.options.map((o) => `${o.text} ${o.rationale}`)
  ].join('\n');
  if (latexRe.test(blob) || /\$/.test(blob)) {
    throw new Error(`Q${q.number}: LaTeX/$ markup found`);
  }
  if (metaVoiceRe.test(blob)) {
    throw new Error(`Q${q.number}: meta/report voice still present`);
  }

  const phrases = supportPhrases[q.number] || [];
  const missing = phrases.filter((p) => !reportLower.includes(p.toLowerCase()));
  if (missing.length) {
    throw new Error(`Q${q.number}: report does not support: ${missing.join('; ')}`);
  }

  if (out.options.length !== 4) throw new Error(`Q${q.number}: need 4 options`);
  if (out.options.filter((o) => o.isCorrect).length !== 1) {
    throw new Error(`Q${q.number}: need exactly 1 correct`);
  }
  for (const o of out.options) {
    if (!o.rationale || o.rationale.length < 20) {
      throw new Error(`Q${q.number}${o.label}: short rationale`);
    }
    if (o.text.length < 40) {
      throw new Error(`Q${q.number}${o.label}: option too short (${o.text.length})`);
    }
  }
  return out;
});

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

const topicImage = 'images/breakdown/3d-overlay.webp';
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
    'Test your grasp of the 3D Overlay — parasitic holographic camouflage over crystalline reality, CUBE architecture, frequency collapse, and Second Realm return.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'The 3D Overlay is a parasitic false skin of holographic camouflage over the living crystalline Known Lands inside the CUBE. Sit with what you missed, then return to the 3D Overlay deep-dive, infographics, and video transmissions. As Resonating Sols hold harmonic tone, the scaffolding shatters—and experience splits by frequency between crystalline Second Realm return and hollow rubble for those still locked in denial.'
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
    'Test your understanding of the 3D Overlay — parasitic holographic camouflage, CUBE and Great Dome architecture, sensory prison, frequency collapse, and Second Realm revelation.'
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
  throw new Error('3d-overlay not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on the 3D Overlay: parasitic holographic camouflage over crystalline reality, CUBE architecture, frequency collapse, and Second Realm return.'
  ],
  ['quiz/breakdown/hard-drive-framework.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/hard-drive-framework.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=hard-drive-framework',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Hard Drive Framework deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Hard Drive Framework</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/hard-drive-framework.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`
  ]
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 80));
  }
  html = html.split(a).join(b);
}

const htmlPath = path.join(ROOT, 'quiz', SOURCE, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchors = [
    "  { path: '/quiz/breakdown/frequency-trick.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/breakdown/lockdown-window.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/breakdown/the-purge-phases.html', priority: '0.75', changefreq: 'monthly' },"
  ];
  let inserted = false;
  for (const anchor of anchors) {
    if (sm.includes(anchor)) {
      sm = sm.replace(anchor, `${anchor}\n${entry}`);
      inserted = true;
      break;
    }
  }
  if (!inserted) throw new Error('Could not find sitemap anchor to insert quiz entry');
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('Correct letter mix:', letterCounts);
console.log('PASS: audited 25/25 against data/breakdown-topics/3d-overlay.json');
