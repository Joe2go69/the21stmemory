/**
 * Installs Frequency Trick quiz for breakdown (Mega Breakdown) transmission.
 * All 25 items authored from and audited against data/breakdown-topics/frequency-trick.json only.
 * Run: node scripts/install-frequency-trick-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/frequency-trick.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'frequency-trick';
const TOPIC_TITLE = 'Frequency Trick';
const SOURCE = 'breakdown';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const metaVoiceRe =
  /\b(according to the (report|source|text)|the report states|the source (states|specifies|suggests)|the text (states|describes|suggests|explicitly|mentions)|source material)\b/i;

/** Support phrases grounded only in frequency-trick.json report. */
const supportPhrases = {
  1: ['3d overlay', 'holographic illusion', 'known lands'],
  2: ['frequency trick', '3d senses', 'living crystal'],
  3: ['false skin', 'solidity', 'separation'],
  4: ['parasitic projection grid', 'dense matter'],
  5: ['solid-perception holography', 'brick', 'concrete', 'permanent'],
  6: ['crystalline temple', 'living light', 'harmonic lenses'],
  7: ['dead frequency holders', 'anti-resonance', 'concrete', 'steel'],
  8: ['known lands', 'great dome', '3d overlay'],
  9: ['not the true base reality', 'projected illusion', 'low-vibration'],
  10: ['touch, sight, and smell', 'artificial field', 'sensory signals'],
  11: ['living crystalline reality', 'concrete and dirt', 'overlay fractures'],
  12: ['sand, glass, cement', 'consciousness perception', 'spiritual evolution'],
  13: ['light waves', 'sound frequencies', 'nervous system'],
  14: ['hollow scaffolding', 'high resonance', 'nearly transparent'],
  15: ['pyramids', 'stone circles', 'river bends'],
  16: ['sleepers', 'npcs', 'plain stone', 'ruins'],
  17: ['boxes', 'flat roofs', 'sharp right angles'],
  18: ['grid nodes', 'fatigue', 'anxiety', 'disconnection'],
  19: ['great dome', 'cube containment', 'artificial band'],
  20: ['lyran', 'pleiadian', 'andromedan', 'ley lines'],
  21: ['cathedrals', 'star forts', 'red brick power stations'],
  22: ['glitch', 'fracture', 'walls to shimmer'],
  23: ['travel and distance', 'optical illusion', 'frequency corridors'],
  24: ['personal frequency', 'harmonic resonance', '3d senses'],
  25: ['reveal back', 'crystalline temple', 'free energy', 'instant travel']
};

const RAW_QUESTIONS = [
  {
    number: 1,
    question: 'What is the 3D Overlay in this framework?',
    hint: 'Connect the multi-layered holographic grid to the Known Lands.',
    options: [
      {
        text: 'A massive, multi-layered holographic illusion grid that blankets the true reality of the Known Lands.',
        isCorrect: true,
        rationale:
          'The 3D Overlay is a massive, multi-layered holographic illusion grid that blankets the true reality of the Known Lands.'
      },
      {
        text: 'A permanent natural geology layer with no holographic projection and no link to the Known Lands.',
        isCorrect: false,
        rationale:
          'The overlay is an artificial holographic construct over the Known Lands, not permanent natural geology alone.'
      },
      {
        text: 'Only a single camera filter used by media with no effect on biological perception or density.',
        isCorrect: false,
        rationale:
          'The overlay hijacks biological perception through a Frequency Trick tuned to 3D senses across the realm.'
      },
      {
        text: 'The true Crystalline Temple itself, composed only of living light without any false projection skin.',
        isCorrect: false,
        rationale:
          'The Crystalline Temple is the true structure hidden beneath the 3D Overlay, not the overlay itself.'
      }
    ]
  },
  {
    number: 2,
    question: 'What is the Frequency Trick?',
    hint: 'Focus on how projection frequencies hijack 3D senses regarding matter versus crystal.',
    options: [
      {
        text: 'The mechanism that tunes projection frequencies to hijack human 3D senses so dead concrete and stone look and feel more real than living crystal.',
        isCorrect: true,
        rationale:
          'The Frequency Trick tunes projection frequencies to hijack human 3D senses, making dead concrete and stone look and feel more real than living crystal.'
      },
      {
        text: 'A natural vision upgrade that automatically reveals living crystal without any parasitic projection field.',
        isCorrect: false,
        rationale:
          'The Frequency Trick is a parasitic field mechanism, not a natural upgrade that reveals crystal by default.'
      },
      {
        text: 'Only a construction code for building free-energy spirals with no sensory hijacking component.',
        isCorrect: false,
        rationale:
          'The trick specifically hijacks 3D senses so dense dead matter appears more real than living crystal.'
      },
      {
        text: 'A travel passport system that measures miles between cities without modulating light or sound signals.',
        isCorrect: false,
        rationale:
          'Distance is later revealed as an optical illusion of the overlay; the Frequency Trick is sensory hijacking of matter perception.'
      }
    ]
  },
  {
    number: 3,
    question: 'How does the overlay trap consciousness?',
    hint: 'Name the false skin effect and the simulated qualities it enforces.',
    options: [
      {
        text: 'By projecting a false skin that filters, bends, and dampens the high-vibrational environment into simulated solidity, weight, and separation.',
        isCorrect: true,
        rationale:
          'By projecting a false skin over reality, the overlay filters, bends, and dampens the high-vibrational environment, trapping consciousness in simulated solidity, weight, and separation.'
      },
      {
        text: 'By permanently revealing living crystal so no one experiences solidity, weight, or separation at all.',
        isCorrect: false,
        rationale:
          'The overlay conceals living crystal and enforces simulated solidity rather than revealing true crystal by default.'
      },
      {
        text: 'By removing all sensory input so consciousness has no perception of any environment whatsoever.',
        isCorrect: false,
        rationale:
          'The overlay manipulates perception of dense matter; it does not erase all sensory experience.'
      },
      {
        text: 'By only affecting digital screens with no impact on biological eyes, skin, or nervous systems.',
        isCorrect: false,
        rationale:
          'The Frequency Trick hijacks biological 3D senses and modulates signals reaching the nervous system.'
      }
    ]
  },
  {
    number: 4,
    question: 'How is the 3D Overlay defined as a projection system?',
    hint: 'Recall the parasitic grid role as a false skin over true reality.',
    options: [
      {
        text: 'A parasitic projection grid that functions as a false skin over true reality, manipulating perception to create the illusion of dense matter.',
        isCorrect: true,
        rationale:
          'The 3D Overlay is a parasitic projection grid that functions as a false skin over true reality, manipulating perception to create the illusion of dense matter.'
      },
      {
        text: 'A benevolent teaching tool built by solar builders to permanently display living crystal without illusion.',
        isCorrect: false,
        rationale:
          'The overlay is parasitic and conceals living crystal; solar builders established the true harmonic architecture beneath.'
      },
      {
        text: 'Only a weather map layer with no function as a false skin over dense-matter perception.',
        isCorrect: false,
        rationale:
          'It is defined as a parasitic projection grid creating the illusion of dense matter across reality.'
      },
      {
        text: 'A single underground tunnel system with no multi-layered holographic projection component.',
        isCorrect: false,
        rationale:
          'The overlay is a massive multi-layered holographic illusion grid, not merely an underground tunnel network.'
      }
    ]
  },
  {
    number: 5,
    question: 'What is Solid-Perception Holography?',
    hint: 'Connect low-frequency matter and holographic fields to hard, heavy permanence.',
    options: [
      {
        text: 'Low-frequency matter overlaid by holographic projection fields so brick, concrete, metal, or glass feel hard, heavy, and permanent.',
        isCorrect: true,
        rationale:
          'Solid-Perception Holography uses low-frequency matter overlaid by holographic projection fields so brick, concrete, metal, or glass feel hard, heavy, and permanent.'
      },
      {
        text: 'High-frequency living crystal left completely unmodulated so materials never feel solid to 3D senses.',
        isCorrect: false,
        rationale:
          'Solid-perception holography stabilizes low-frequency matter to feel solid; high resonance later reveals hollow scaffolding.'
      },
      {
        text: 'Only a painting technique used in museums with no effect on touch, weight, or permanence of materials.',
        isCorrect: false,
        rationale:
          'It is a perceptual mechanism that makes materials feel hard, heavy, and permanent to the senses.'
      },
      {
        text: 'A free-energy generator design using only spirals and domes without any holographic density illusion.',
        isCorrect: false,
        rationale:
          'Solid-perception holography specifically overlays low-frequency matter with holograms to enforce dense solidity.'
      }
    ]
  },
  {
    number: 6,
    question: 'What is the Crystalline Temple?',
    hint: 'Name the true underlying structure hidden beneath the overlay.',
    options: [
      {
        text: 'The true underlying structure of the realm composed of living light, crystal grids, and harmonic lenses hidden beneath the 3D Overlay.',
        isCorrect: true,
        rationale:
          'The Crystalline Temple is the true underlying structure of the realm, composed of living light, crystal grids, and harmonic lenses, currently hidden beneath the 3D Overlay.'
      },
      {
        text: 'A modern concrete plaza designed as a dead frequency holder to drain grid nodes permanently.',
        isCorrect: false,
        rationale:
          'Dead frequency holders are parasite 3D architecture; the Crystalline Temple is living light and crystal grids.'
      },
      {
        text: 'Only the 3D Overlay renamed, with no living light or harmonic lenses beneath dense matter.',
        isCorrect: false,
        rationale:
          'The Crystalline Temple is the true structure beneath the overlay, not another name for the overlay itself.'
      },
      {
        text: 'A temporary stage set used only during travel simulations with no continuous underlying reality.',
        isCorrect: false,
        rationale:
          'It is the continuous true underlying structure waiting to be revealed as the overlay fractures.'
      }
    ]
  },
  {
    number: 7,
    question: 'What characterizes Parasite 3D Architecture?',
    hint: 'Focus on materials and anti-resonance geometry that maintain the trick.',
    options: [
      {
        text: 'Structures built from dead frequency holders such as concrete, steel, and synthetic glass with anti-resonance geometry that drains energy and maintains the Frequency Trick.',
        isCorrect: true,
        rationale:
          'Parasite 3D Architecture uses dead frequency holders like concrete, steel, and synthetic glass with anti-resonance geometry to drain energy and maintain the Frequency Trick.'
      },
      {
        text: 'Structures grown only as living crystal grids aligned to ley lines with no dead materials or anti-resonance forms.',
        isCorrect: false,
        rationale:
          'Living harmonic architecture is the true solar-builder design; parasite architecture uses dead frequency holders.'
      },
      {
        text: 'Only wooden freestanding sculptures that amplify cosmic resonance without draining grid nodes.',
        isCorrect: false,
        rationale:
          'Named materials are concrete, steel, and synthetic glass shaped to break natural harmonics.'
      },
      {
        text: 'Only underground crystal halls with no surface boxes, flat roofs, or sharp right angles.',
        isCorrect: false,
        rationale:
          'Modern construction uses boxes, flat roofs, and sharp right angles as anti-resonance forms on the surface environment.'
      }
    ]
  },
  {
    number: 8,
    question: 'What are the Known Lands in this framework?',
    hint: 'Locate the central physical realm and its role as overlay theatre.',
    options: [
      {
        text: 'The central physical realm within the Great Dome, operating as the core theatre where the 3D Overlay is currently deployed.',
        isCorrect: true,
        rationale:
          'The Known Lands are the central physical realm located within the Great Dome, operating as the core theatre where the 3D Overlay is currently deployed.'
      },
      {
        text: 'A distant empty void outside the Great Dome with no overlay deployment and no physical theatre role.',
        isCorrect: false,
        rationale:
          'The Known Lands are the central physical realm inside the Great Dome where the overlay is deployed.'
      },
      {
        text: 'Only the CUBE Containment hard drive itself with no central physical realm or dome theatre.',
        isCorrect: false,
        rationale:
          'The Known Lands sit within the Great Dome as the physical theatre; the CUBE is the wider containment architecture.'
      },
      {
        text: 'A temporary dream layer that vanishes whenever anyone raises personal frequency slightly.',
        isCorrect: false,
        rationale:
          'The Known Lands are the central physical realm; the overlay over them fractures as frequency rises, but the realm itself is the theatre of deployment.'
      }
    ]
  },
  {
    number: 9,
    question: 'What is the currently perceived physical world relative to true base reality?',
    hint: 'Contrast projected illusion with dense low-vibration trapping.',
    options: [
      {
        text: 'It is not the true base reality, but a projected illusion designed to trap consciousness in dense, low-vibration environments.',
        isCorrect: true,
        rationale:
          'The physical world as currently perceived is not the true base reality, but a projected illusion designed to trap consciousness in dense, low-vibration environments.'
      },
      {
        text: 'It is the permanent true base reality with no projection layer and no dense-vibration trap mechanism.',
        isCorrect: false,
        rationale:
          'Perceived physicality is a projected illusion; living crystalline reality lies beneath the overlay.'
      },
      {
        text: 'It is only a future reconstruction plan with no present-day sensory manipulation at all.',
        isCorrect: false,
        rationale:
          'Sensory manipulation and dense-matter illusion are active present mechanisms of the Frequency Trick.'
      },
      {
        text: 'It is identical to the fully revealed Crystalline Temple with free energy and instant travel already online for everyone.',
        isCorrect: false,
        rationale:
          'Those qualities return as the overlay collapses and the Crystalline Temple is revealed back, not as the current default perception.'
      }
    ]
  },
  {
    number: 10,
    question: 'How are touch, sight, and smell being handled under the Frequency Trick?',
    hint: 'Describe artificial-field interception of true sensory signals.',
    options: [
      {
        text: 'They are actively manipulated by an artificial field that intercepts and modulates true sensory signals.',
        isCorrect: true,
        rationale:
          'What is experienced through touch, sight, and smell is actively manipulated by an artificial field that intercepts and modulates true sensory signals.'
      },
      {
        text: 'They receive only pure unmodulated living-crystal signals with no artificial field interference.',
        isCorrect: false,
        rationale:
          'The parasite field modulates true signals so projected materials feel solid, rough, cold, or transparent.'
      },
      {
        text: 'They are permanently disabled so no one can sense either dense matter or living crystal.',
        isCorrect: false,
        rationale:
          'Senses are hijacked and modulated, not disabled; the nervous system is convinced of solid projections.'
      },
      {
        text: 'They only function after the overlay fully collapses and never operate during the Frequency Trick.',
        isCorrect: false,
        rationale:
          'Sensory hijacking is how the Frequency Trick operates now, bending and modulating light and sound signals.'
      }
    ]
  },
  {
    number: 11,
    question: 'What lies beneath the concrete and dirt of the overlay?',
    hint: 'Name the living reality waiting as the overlay fractures.',
    options: [
      {
        text: 'A vibrant, living crystalline reality that continuously hums with energy, waiting to be fully revealed as the overlay fractures.',
        isCorrect: true,
        rationale:
          'Beneath the concrete and dirt lies a vibrant, living crystalline reality that continuously hums with energy, waiting to be fully revealed as the overlay fractures.'
      },
      {
        text: 'Only empty vacuum with no crystalline structure, hum, or energy field of any kind.',
        isCorrect: false,
        rationale:
          'The underlying reality is living crystalline structure humming with energy, not empty vacuum.'
      },
      {
        text: 'Only more layers of permanent concrete that can never fracture or reveal anything beneath.',
        isCorrect: false,
        rationale:
          'Concrete is part of the projected dense illusion; living crystal waits beneath as the overlay fractures.'
      },
      {
        text: 'Only digital code with no continuous humming crystalline environment under the surface.',
        isCorrect: false,
        rationale:
          'The underlying realm is described as living crystalline reality, not mere digital code without crystal hum.'
      }
    ]
  },
  {
    number: 12,
    question: 'How are materials like sand, glass, and cement manifested in modern civilization?',
    hint: 'Link consciousness-perception manipulation to slowed spiritual evolution.',
    options: [
      {
        text: 'Through manipulation of consciousness perception, creating an environment that slows spiritual evolution and enforces control.',
        isCorrect: true,
        rationale:
          'Materials commonly accepted as civilization foundations—sand, glass, cement—are manifested through manipulation of consciousness perception, creating an environment that slows spiritual evolution and enforces control.'
      },
      {
        text: 'Through pure unassisted crystal growth that accelerates spiritual evolution for every sleeper automatically.',
        isCorrect: false,
        rationale:
          'These materials are perception-manipulated foundations that slow spiritual evolution and enforce control.'
      },
      {
        text: 'Through free-energy field drawing alone with no dense-matter illusion or control function.',
        isCorrect: false,
        rationale:
          'Free energy appears after overlay collapse; sand, glass, and cement are dense-perception control materials now.'
      },
      {
        text: 'Through permanent solar-builder harmonic design identical to flowing ley-line crystal instrumentation.',
        isCorrect: false,
        rationale:
          'Solar builders created flowing harmonic architecture; sand, glass, and cement serve the dense parasitic environment.'
      }
    ]
  },
  {
    number: 13,
    question: 'How does Sensory Hijacking operate mechanically?',
    hint: 'Describe bending light and sound and modulating signals to the nervous system.',
    options: [
      {
        text: 'It bends incoming light waves and sound frequencies around objects and modulates those signals so the nervous system accepts projected materials as solid, rough, cold, or transparent.',
        isCorrect: true,
        rationale:
          'The Frequency Trick bends incoming light waves and sound frequencies around objects; the parasite field modulates true signals, convincing the nervous system that projected materials are solid, rough, cold, or transparent.'
      },
      {
        text: 'It only changes written labels on maps without bending light or sound or touching the nervous system.',
        isCorrect: false,
        rationale:
          'Sensory hijacking directly bends light and sound and modulates signals received by skin and eyes.'
      },
      {
        text: 'It permanently deletes all light and sound so no material qualities can be perceived at all.',
        isCorrect: false,
        rationale:
          'Signals are modulated into false solidity qualities, not deleted entirely from perception.'
      },
      {
        text: 'It only enhances natural crystal vision without any parasite-field modulation of sensory input.',
        isCorrect: false,
        rationale:
          'The parasite field modulates true light and sound signals to enforce solid-perception illusions.'
      }
    ]
  },
  {
    number: 14,
    question: 'What happens to supposedly solid structures under high resonance?',
    hint: 'Recall hollow scaffolding and transparency of brick, metal, and glass projections.',
    options: [
      {
        text: 'They reveal their true nature as hollow scaffolding of frequency or become nearly transparent.',
        isCorrect: true,
        rationale:
          'Under high resonance, supposedly solid structures of low-frequency matter stabilized by holograms appear as hollow scaffolding of frequency or become nearly transparent.'
      },
      {
        text: 'They become permanently denser and more opaque so no one can ever see through the Frequency Trick.',
        isCorrect: false,
        rationale:
          'High resonance unmasks hollowness and near-transparency rather than locking density forever.'
      },
      {
        text: 'They convert automatically into free-energy power plants with no change in perceived solidity.',
        isCorrect: false,
        rationale:
          'The named high-resonance effect is hollow frequency scaffolding or near-transparency of the projected solids.'
      },
      {
        text: 'They disappear from maps only, with no change in how brick, metal, or glass appear to the senses.',
        isCorrect: false,
        rationale:
          'The change is sensory and structural appearance under high resonance, not merely cartographic deletion.'
      }
    ]
  },
  {
    number: 15,
    question: 'Which true crystalline structures does the overlay actively cloak?',
    hint: 'Name site types where light, sound, and touch are bent around living crystal.',
    options: [
      {
        text: 'True crystalline structures such as pyramids, stone circles, and river bends.',
        isCorrect: true,
        rationale:
          'The overlay actively bends light, sound, and touch around true crystalline structures such as pyramids, stone circles, and river bends.'
      },
      {
        text: 'Only modern plastic warehouses with no pyramids, stone circles, or river-bend crystalline sites.',
        isCorrect: false,
        rationale:
          'Cloaking targets true crystalline sites like pyramids, stone circles, and river bends.'
      },
      {
        text: 'Only temporary festival stages built from synthetic glass with no sacred-site cloaking role.',
        isCorrect: false,
        rationale:
          'Sacred-site cloaking specifically masks radiant crystalline structures, not temporary festival stages alone.'
      },
      {
        text: 'Only digital billboards that never involve light, sound, or touch bending around living structures.',
        isCorrect: false,
        rationale:
          'Cloaking bends light, sound, and touch around physical crystalline sites in the landscape.'
      }
    ]
  },
  {
    number: 16,
    question: 'How do sleepers and NPCs perceive cloaked sacred sites?',
    hint: 'Contrast plain surface appearance with the radiant humming reality beneath.',
    options: [
      {
        text: 'As plain stone, dirt, or ruins, masking the radiant, humming reality beneath.',
        isCorrect: true,
        rationale:
          'Cloaking renders true crystalline structures to sleepers and NPCs as plain stone, dirt, or ruins, masking the radiant, humming reality beneath.'
      },
      {
        text: 'As fully revealed living light temples with no masking of radiant humming crystal.',
        isCorrect: false,
        rationale:
          'Sleepers and NPCs see plain stone, dirt, or ruins rather than the radiant humming reality.'
      },
      {
        text: 'As invisible voids that cannot be walked near or described in any surface form.',
        isCorrect: false,
        rationale:
          'They appear as ordinary stone, dirt, or ruins—not as inaccessible invisible voids.'
      },
      {
        text: 'As glowing free-energy stations openly teaching instant travel to every passerby.',
        isCorrect: false,
        rationale:
          'The overlay masks radiant reality as plain ruins; free energy and instant travel return after collapse.'
      }
    ]
  },
  {
    number: 17,
    question: 'What anti-resonance forms define modern 3D construction under Architectural Suppression?',
    hint: 'List shapes that break natural harmonics.',
    options: [
      {
        text: 'Boxes, flat roofs, and sharp right angles built from dead frequency holders like concrete, plaster, and plastic.',
        isCorrect: true,
        rationale:
          'Modern 3D construction uses dead frequency holders shaped into anti-resonance forms—boxes, flat roofs, and sharp right angles—that break natural harmonics.'
      },
      {
        text: 'Only flowing domes, spirals, and arches grown as living crystal along ley lines.',
        isCorrect: false,
        rationale:
          'Flowing harmonic forms belong to true solar architecture; modern suppression uses boxes and right angles.'
      },
      {
        text: 'Only circular star forts left completely unaltered as pure free-energy amplifiers.',
        isCorrect: false,
        rationale:
          'Star forts are remnants of original crystal instrumentation; modern suppression uses anti-resonance boxes and angles.'
      },
      {
        text: 'Only temporary fabric tents with no concrete, plaster, plastic, or right-angle geometry.',
        isCorrect: false,
        rationale:
          'Named materials include concrete, plaster, and plastic shaped into boxes, flat roofs, and sharp right angles.'
      }
    ]
  },
  {
    number: 18,
    question: 'What effects do anti-resonance structures produce when placed on grid nodes?',
    hint: 'Connect short-circuiting nodes to soul-level symptoms.',
    options: [
      {
        text: 'They short-circuit grid nodes, causing fatigue, anxiety, and disconnection in the souls that inhabit them.',
        isCorrect: true,
        rationale:
          'These structures are strategically placed to short-circuit grid nodes, causing fatigue, anxiety, and disconnection in the souls that inhabit them.'
      },
      {
        text: 'They permanently raise harmonic resonance so every inhabitant instantly sees living crystal.',
        isCorrect: false,
        rationale:
          'Anti-resonance placement drains energy and causes fatigue, anxiety, and disconnection rather than instant crystal sight.'
      },
      {
        text: 'They only improve physical fitness with no effect on grid nodes or soul disconnection.',
        isCorrect: false,
        rationale:
          'Strategic placement short-circuits grid nodes and produces fatigue, anxiety, and disconnection.'
      },
      {
        text: 'They automatically convert into Crystalline Temple halls without any parasitic drain effect.',
        isCorrect: false,
        rationale:
          'These dead-frequency structures maintain the Frequency Trick by draining energy at grid nodes.'
      }
    ]
  },
  {
    number: 19,
    question: 'Where does the 3D Overlay sit in the larger architecture?',
    hint: 'Name the artificial band inside the Great Dome and CUBE Containment.',
    options: [
      {
        text: 'It is one artificial band inserted into the overarching architecture of the Great Dome and the CUBE Containment.',
        isCorrect: true,
        rationale:
          'The 3D Overlay is just one artificial band inserted into the overarching architecture of the Great Dome and the CUBE Containment.'
      },
      {
        text: 'It is the entire CUBE Containment itself with no smaller artificial band and no Great Dome context.',
        isCorrect: false,
        rationale:
          'The overlay is one artificial band within the wider Great Dome and CUBE architecture, not the whole containment.'
      },
      {
        text: 'It exists only outside all domes as a free-floating cloud with no connection to the Known Lands theatre.',
        isCorrect: false,
        rationale:
          'The Known Lands inside the Great Dome are the core theatre where the overlay is deployed.'
      },
      {
        text: 'It replaced the CUBE entirely so no multi-layered containment architecture remains at all.',
        isCorrect: false,
        rationale:
          'The overlay is inserted into the existing Great Dome and CUBE architecture rather than replacing it entirely.'
      }
    ]
  },
  {
    number: 20,
    question: 'Who originally established the true architecture of the realm?',
    hint: 'Name the solar-builder lineages and the quality of their design.',
    options: [
      {
        text: 'Lyran, Pleiadian, and Andromedan solar builders created flowing, harmonic architecture aligned to cosmic resonance and ley lines.',
        isCorrect: true,
        rationale:
          'The true architecture was originally established by Lyran, Pleiadian, and Andromedan solar builders as flowing, harmonic, and aligned to cosmic resonance and ley lines.'
      },
      {
        text: 'Only modern parasite architects using concrete boxes with no ley-line alignment or harmonic flow.',
        isCorrect: false,
        rationale:
          'Parasite 3D architecture suppresses; true architecture comes from Lyran, Pleiadian, and Andromedan solar builders.'
      },
      {
        text: 'Only anonymous NPCs building flat-roof suburbs without cosmic resonance or crystal instrumentation.',
        isCorrect: false,
        rationale:
          'Solar builders established flowing harmonic design; NPC-facing plain ruins are cloaked perceptions, not the original builders.'
      },
      {
        text: 'Only post-collapse free-energy committees formed after the overlay fully ended worldwide.',
        isCorrect: false,
        rationale:
          'Original true architecture predates the overlay; solar builders established it as the realm baseline.'
      }
    ]
  },
  {
    number: 21,
    question: 'What remnants of original crystal instrumentation still survive?',
    hint: 'List structures the parasite system tries to bury, rename, or enclose.',
    options: [
      {
        text: 'Ancient cathedrals, star forts, and red brick power stations that the parasite system buries, renames, or encloses within 3D boxes to dull their hum.',
        isCorrect: true,
        rationale:
          'Remnants survive as ancient cathedrals, star forts, and red brick power stations, which the parasite system attempts to bury, rename, or enclose within 3D boxes to dull their inherent hum.'
      },
      {
        text: 'Only brand-new plastic towers with no cathedral, star fort, or red brick power-station lineage.',
        isCorrect: false,
        rationale:
          'Surviving remnants are ancient cathedrals, star forts, and red brick power stations from original instrumentation.'
      },
      {
        text: 'Only digital apps that never involve physical structures the parasite can enclose or rename.',
        isCorrect: false,
        rationale:
          'Remnants are physical crystal-instrumentation structures targeted for burial, renaming, or enclosure.'
      },
      {
        text: 'Only temporary overlay scaffolding with no inherent hum the parasite would need to dull.',
        isCorrect: false,
        rationale:
          'These remnants carry inherent hum that the parasite system tries to dull by enclosure and renaming.'
      }
    ]
  },
  {
    number: 22,
    question: 'What happens as the universal frequency rises and the overlay glitches?',
    hint: 'Describe flickering holography and unmasking of crystalline nature.',
    options: [
      {
        text: 'The holographic layer flickers, walls shimmer and bend, and trees and skies radiate visible energy while unmasking true crystalline structures.',
        isCorrect: true,
        rationale:
          'As universal frequency rises, the overlay glitches and fractures; the holographic layer flickers, walls shimmer and bend, and trees and skies radiate visible energy while unmasking true crystalline structures.'
      },
      {
        text: 'The overlay becomes permanently thicker so no shimmer, radiance, or crystalline unmasking can occur.',
        isCorrect: false,
        rationale:
          'Rising frequency causes glitch and fracture of the overlay, not permanent thickening without unmasking.'
      },
      {
        text: 'Only market prices change with no sensory glitches in walls, trees, or skies at all.',
        isCorrect: false,
        rationale:
          'Named signs include shimmering walls and radiating trees and skies as crystalline structures unmask.'
      },
      {
        text: 'Only sleepers see brighter concrete with no flicker of the holographic layer for anyone.',
        isCorrect: false,
        rationale:
          'The holographic layer flickers and true crystalline structures unmask as frequency rises.'
      }
    ]
  },
  {
    number: 23,
    question: 'What is travel and distance under the overlay?',
    hint: 'Contrast optical illusion with phased frequency corridors.',
    options: [
      {
        text: 'An optical illusion enforced by the overlay, functioning as phased frequency corridors rather than genuine physical space.',
        isCorrect: true,
        rationale:
          'Travel and distance are revealed as an optical illusion enforced by the overlay, functioning merely as phased frequency corridors rather than genuine physical space.'
      },
      {
        text: 'Absolute fixed mileage in empty vacuum with no frequency-corridor mechanism of any kind.',
        isCorrect: false,
        rationale:
          'Distance is an overlay optical illusion of phased frequency corridors, not absolute vacuum mileage.'
      },
      {
        text: 'Only post-collapse instant teleportation already active for every sleeper with no corridor illusion remaining.',
        isCorrect: false,
        rationale:
          'Instant travel returns as the Crystalline Temple is revealed; under the overlay, distance is still enforced as illusion corridors.'
      },
      {
        text: 'A permanent map printed on concrete that cannot be revealed as frequency-based at all.',
        isCorrect: false,
        rationale:
          'Travel is a frequency-corridor illusion of the overlay, not a permanent non-frequency concrete map truth.'
      }
    ]
  },
  {
    number: 24,
    question: 'How does an individual break the Frequency Trick?',
    hint: 'Connect personal frequency, harmonic resonance, and perception beyond manipulated 3D senses.',
    options: [
      {
        text: 'By raising personal frequency and harmonic resonance, shifting perception beyond the manipulated 3D senses.',
        isCorrect: true,
        rationale:
          'To break the Frequency Trick, an individual must raise personal frequency and harmonic resonance, shifting perception beyond the manipulated 3D senses.'
      },
      {
        text: 'By pouring more concrete and steel to strengthen dead frequency holders around every grid node.',
        isCorrect: false,
        rationale:
          'Dead frequency holders maintain the trick; breaking it requires raising personal frequency and resonance.'
      },
      {
        text: 'By trusting only sleeper and NPC surface readings of plain stone without any resonance shift.',
        isCorrect: false,
        rationale:
          'Breaking the trick means shifting beyond manipulated 3D senses, not remaining in sleeper surface perception.'
      },
      {
        text: 'By waiting for permanent overlay thickening so no recognition of the illusion is ever needed.',
        isCorrect: false,
        rationale:
          'Recognizing the illusion strips parasitic power; the path is raising frequency, not waiting for denser overlay.'
      }
    ]
  },
  {
    number: 25,
    question: 'What replaces “build back” when the overlay completely collapses?',
    hint: 'Name the reveal of the Crystalline Temple and the qualities of the freed realm.',
    options: [
      {
        text: 'Humanity will reveal back the underlying Crystalline Temple—returning instant travel, free energy from the field, and vibrant reality free of the parasitic Frequency Trick.',
        isCorrect: true,
        rationale:
          'As the overlay collapses, humanity will not build back but reveal back the Crystalline Temple, returning instant travel, free energy drawn from the field, and vibrant reality free of the Frequency Trick.'
      },
      {
        text: 'Humanity will only rebuild denser concrete boxes so the Frequency Trick becomes permanent forever.',
        isCorrect: false,
        rationale:
          'Collapse reveals the Crystalline Temple rather than rebuilding denser parasitic architecture.'
      },
      {
        text: 'Humanity will permanently freeze distance illusions with no free energy or instant travel returning.',
        isCorrect: false,
        rationale:
          'Reveal-back returns instant travel and free energy from the field, free of the parasitic Frequency Trick.'
      },
      {
        text: 'Humanity will restore only sand, glass, and cement as the final spiritual foundation of the realm.',
        isCorrect: false,
        rationale:
          'Those materials are dense-perception control foundations; collapse reveals living crystalline reality instead.'
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

const topicImage = 'images/breakdown/frequency-trick.webp';
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
    'Test your grasp of the Frequency Trick — 3D Overlay sensory hijacking, solid-perception holography, parasite architecture, and revealing the Crystalline Temple.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'The Frequency Trick tunes projection frequencies so dead dense matter feels more real than living crystal, sustaining the 3D Overlay over the Known Lands. Sit with what you missed, then return to the Frequency Trick deep-dive, infographics, and video transmissions. Raise personal frequency, recognize the illusion, and the path is not build back—but reveal back the Crystalline Temple of free energy and instant travel.'
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
    'Test your understanding of the Frequency Trick — 3D Overlay, solid-perception holography, sensory hijacking, parasite architecture, and revealing the Crystalline Temple.'
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
  throw new Error('frequency-trick not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on the Frequency Trick: 3D Overlay sensory hijacking, solid-perception holography, parasite architecture, and revealing the Crystalline Temple.'
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
    "  { path: '/quiz/breakdown/lockdown-window.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/breakdown/trigger-events.html', priority: '0.75', changefreq: 'monthly' },",
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
console.log('PASS: audited 25/25 against data/breakdown-topics/frequency-trick.json');
