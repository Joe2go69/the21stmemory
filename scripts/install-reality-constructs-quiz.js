/**
 * Installs Reality Constructs quiz for breakdown (Mega Breakdown) transmission.
 * All 25 items authored from and audited against data/breakdown-topics/reality-constructs.json only.
 * Run: node scripts/install-reality-constructs-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/reality-constructs.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'reality-constructs';
const TOPIC_TITLE = 'Reality Constructs';
const SOURCE = 'breakdown';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const metaVoiceRe =
  /\b(according to the (report|source|text)|the report states|the source (states|specifies|suggests)|the text (states|describes|suggests|explicitly|mentions)|source material)\b/i;

/** Support phrases grounded only in reality-constructs.json report. */
const supportPhrases = {
  1: ['multi-layered frequency projection', 'containment field', 'scattered planets'],
  2: ['sound and light', 'crystallized into density', 'perception-based'],
  3: ['false holographic skin', 'crystalline', 'heavy, disconnected'],
  4: ['thousands of interwoven layers', 'resonance', 'frequency shifts'],
  5: ['cube', 'hard drive', 'frequency server'],
  6: ['parasitic overlay', 'dead concrete', 'living crystal'],
  7: ['great dome', '178', 'interwoven layers'],
  8: ['solid-perception holography', 'hard, heavy, and permanent'],
  9: ['frequency corridors', 'destination overlays', 'timed phasing'],
  10: ['projection dome technology', 'cloaking', 'holographical camouflage'],
  11: ['maps', 'fabricated perception overlays', 'transparent sheets'],
  12: ['ships and planes', 'optical illusion', 'chunks loading'],
  13: ['undersea communication cables', 'projected anchor points'],
  14: ['sound', 'light', 'form', 'crystalline grids'],
  15: ['resistance', 'precise creation', 'higher realms'],
  16: ['concrete, steel, and plastic', 'boxes', 'sharp angles'],
  17: ['living crystal', 'resonance', 'conscious intention'],
  18: ['mind-altering weapons', 'theta', 'delta', 'alpha'],
  19: ['eight foundational domes', 'dome of forgotten gods', 'dome of sheol'],
  20: ['spirit tree', 'harmonic currents', 'black crystalline valve'],
  21: ['saturnian', 'prison matrices', 'crystalline star-nodes'],
  22: ['fracturing', 'glitching', 'pixilate'],
  23: ['second realm', 'crystalline temple', 'resonating sols'],
  24: ['distance', 'resonance alignment', 'immediate'],
  25: ['high vibration', 'holographic constraints', 'multi-dimensional world']
};

const RAW_QUESTIONS = [
  {
    number: 1,
    question: 'What is reality in this framework, rather than scattered planets and vast distances?',
    hint: 'Name the unified projection housed in a grand containment field.',
    options: [
      {
        text: 'A unified, multi-layered frequency projection housed within a grand containment field, not scattered planets or vast empty distances.',
        isCorrect: true,
        rationale:
          'Reality is not scattered planets, continents, or vast distances, but a unified multi-layered frequency projection housed within a grand containment field.'
      },
      {
        text: 'A single solid planet floating in vacuum with no multi-layered frequency projection architecture at all.',
        isCorrect: false,
        rationale:
          'Scattered planet models are rejected; reality is layered frequency projection inside containment.'
      },
      {
        text: 'Only a random collection of continents with no containment field and no frequency layering.',
        isCorrect: false,
        rationale:
          'Continents-as-separated-geography is an overlay reading; true structure is multi-layered frequency projection.'
      },
      {
        text: 'Only post-collapse rubble with no grand containment field or living crystalline foundation.',
        isCorrect: false,
        rationale:
          'Rubble appears for lower densities during overlay collapse; baseline reality is frequency projection in containment.'
      }
    ]
  },
  {
    number: 2,
    question: 'What foundation is the physical realm built upon?',
    hint: 'Connect pure sound and light to crystallization into density.',
    options: [
      {
        text: 'A perception-based matrix built on pure sound and light that has been crystallized into density.',
        isCorrect: true,
        rationale:
          'The physical realm is a perception-based matrix built upon pure sound and light crystallized into density.'
      },
      {
        text: 'Only permanent dead concrete poured without sound, light, or crystallization into density.',
        isCorrect: false,
        rationale:
          'Foundation is sound and light crystallized into density, not permanent dead concrete as true base.'
      },
      {
        text: 'Only vacuum distance between globes with no perception-based matrix of any kind.',
        isCorrect: false,
        rationale:
          'Physicality is a perception-based frequency matrix, not vacuum-globe spacing as foundation.'
      },
      {
        text: 'Only NPC map ink with no sound-to-light densification sequence behind form.',
        isCorrect: false,
        rationale:
          'Architecture densifies Sound into Light into Form on crystalline grids, not map ink alone.'
      }
    ]
  },
  {
    number: 3,
    question: 'What currently shrouds the true crystalline nature of this world?',
    hint: 'Name the false skin and how it traps consciousness.',
    options: [
      {
        text: 'A false holographic skin that manipulates perception, touch, and sight to trap consciousness in a heavy, disconnected state.',
        isCorrect: true,
        rationale:
          'A false holographic skin shrouds true crystalline nature, manipulating perception, touch, and sight to trap consciousness in a heavy, disconnected state.'
      },
      {
        text: 'A permanent open crystal canopy that never manipulates touch, sight, or disconnection at all.',
        isCorrect: false,
        rationale:
          'The shroud is a false holographic skin enforcing heavy disconnection, not open crystal by default.'
      },
      {
        text: 'Only paper maps with no holographic skin and no sensory manipulation of perception.',
        isCorrect: false,
        rationale:
          'The false skin actively manipulates perception, touch, and sight beyond mere paper maps.'
      },
      {
        text: 'Only free-energy spirals that automatically free every sleeper from dense trapping forever.',
        isCorrect: false,
        rationale:
          'Current state is dense trapping via holographic skin; free crystalline return comes as overlay collapses.'
      }
    ]
  },
  {
    number: 4,
    question: 'How is this grand simulation designed to be traversed?',
    hint: 'Contrast resonance and frequency shifts with physical travel.',
    options: [
      {
        text: 'Through resonance and frequency shifts across thousands of interwoven layers vibrating at different frequencies—not by physical travel.',
        isCorrect: true,
        rationale:
          'The simulation consists of thousands of interwoven layers designed to be traversed not by physical travel but through resonance and frequency shifts.'
      },
      {
        text: 'Only by absolute physical miles across a massive globe with no frequency-shift pathways.',
        isCorrect: false,
        rationale:
          'Physical mileage travel is an optical illusion; true traversal is resonance and frequency shifts.'
      },
      {
        text: 'Only by permanent border checkpoints that never use layered frequency fields of any kind.',
        isCorrect: false,
        rationale:
          'Borders and nations are enforced illusions; layers are traversed by frequency, not fixed border truth.'
      },
      {
        text: 'Only after every layer is demolished by wrecking crews with no resonance mechanism needed.',
        isCorrect: false,
        rationale:
          'Traversal design is resonance and frequency shifts; collapse is frequency-driven, not wrecking-crew demolition alone.'
      }
    ]
  },
  {
    number: 5,
    question: 'What is the CUBE in Reality Constructs terminology?',
    hint: 'Connect containment hard drive to maps, overlays, grids, and frequency server role.',
    options: [
      {
        text: 'The massive containment hard drive and electro-magnetic framework that runs all maps, overlays, grids, and domes as the ultimate frequency server of reality.',
        isCorrect: true,
        rationale:
          'CUBE is the massive containment hard drive and electro-magnetic framework that runs all maps, overlays, grids, and domes as the ultimate frequency server of reality.'
      },
      {
        text: 'Only a small city building with no hard-drive role for overlays, grids, or domes.',
        isCorrect: false,
        rationale:
          'CUBE is the ultimate frequency server of the whole containment architecture, not a single city building.'
      },
      {
        text: 'Only the Parasitic Overlay itself with no underlying hard-drive framework for maps and domes.',
        isCorrect: false,
        rationale:
          'CUBE runs overlays among other systems; the Parasitic Overlay is a false skin projected within that architecture.'
      },
      {
        text: 'Only a post-collapse free-energy battery with no maps, grids, or dome-server function.',
        isCorrect: false,
        rationale:
          'CUBE is the active containment hard drive and frequency server for maps, overlays, grids, and domes.'
      }
    ]
  },
  {
    number: 6,
    question: 'What does the Parasitic Overlay do to 3D perception of materials?',
    hint: 'Contrast dead concrete and stone with living crystal.',
    options: [
      {
        text: 'It projects an illusion grid and false skin that makes dead concrete and stone appear more real than the underlying living crystal.',
        isCorrect: true,
        rationale:
          'The Parasitic Overlay is an illusion grid and false skin that manipulates 3D senses so dead concrete and stone appear more real than underlying living crystal.'
      },
      {
        text: 'It permanently reveals living crystal so concrete never appears more real than crystal to anyone.',
        isCorrect: false,
        rationale:
          'The overlay specifically makes dead materials appear more real than living crystal to 3D senses.'
      },
      {
        text: 'It only edits radio weather reports with no false skin over concrete-versus-crystal perception.',
        isCorrect: false,
        rationale:
          'It is a projected illusion grid manipulating material perception, not merely weather reporting.'
      },
      {
        text: 'It only strengthens natural harmonics so sharp-angle architecture never drains boxed-in frequency.',
        isCorrect: false,
        rationale:
          'Parasitic overlay supports dense false solidity; dead materials and anti-resonance forms drain perception.'
      }
    ]
  },
  {
    number: 7,
    question: 'What is the Great Dome within these constructs?',
    hint: 'Recall 178 worlds and interwoven layers versus scattered continents.',
    options: [
      {
        text: 'The physical training ground and frequency amplifier containing 178 physical worlds that appear as scattered continents and planets but are actually interwoven layers.',
        isCorrect: true,
        rationale:
          'Great Dome is the physical training ground and frequency amplifier containing 178 physical worlds that appear as scattered continents and planets but are interwoven layers.'
      },
      {
        text: 'A single empty sky shell with no 178 worlds and no frequency-amplifier training function.',
        isCorrect: false,
        rationale:
          'It holds 178 physical worlds as a training ground and frequency amplifier of interwoven layers.'
      },
      {
        text: 'Only the Saturnian A.I. valve with no relationship to 178 interwoven physical worlds.',
        isCorrect: false,
        rationale:
          'Saturnian A.I. links to the black crystalline valve; Great Dome is the 178-world training ground.'
      },
      {
        text: 'Only a map legend title with no physical frequency-amplifier structure inside the CUBE.',
        isCorrect: false,
        rationale:
          'Great Dome is a real foundational dome structure within CUBE architecture, not a map legend alone.'
      }
    ]
  },
  {
    number: 8,
    question: 'What is Solid-Perception Holography?',
    hint: 'Connect low-frequency matter and projection fields to hard, heavy permanence.',
    options: [
      {
        text: 'Low-frequency matter overlaid with holographical projection fields that convince the nervous system energy structures are hard, heavy, and permanent physical materials.',
        isCorrect: true,
        rationale:
          'Solid-Perception Holography overlays low-frequency matter with holographical projection fields, convincing the nervous system that energy structures are hard, heavy, and permanent.'
      },
      {
        text: 'High-resonance living crystal left completely unmodulated so nothing ever feels hard or permanent.',
        isCorrect: false,
        rationale:
          'Solid-perception holography enforces hard permanence on low-frequency matter; high resonance later shows hollow scaffolding.'
      },
      {
        text: 'Only a painting style in museums with no nervous-system effect on hardness or weight.',
        isCorrect: false,
        rationale:
          'It is a perceptual mechanism acting on the nervous system regarding hardness, weight, and permanence.'
      },
      {
        text: 'Only free-energy spiral design that never uses holographical fields over dense matter.',
        isCorrect: false,
        rationale:
          'It specifically overlays low-frequency matter with holographical projection fields to fake solidity.'
      }
    ]
  },
  {
    number: 9,
    question: 'What are Frequency Corridors?',
    hint: 'Describe simulated travel pathways and timed phasing instead of true distance.',
    options: [
      {
        text: 'Simulated travel pathways that render destination overlays around a traveler, replacing actual distance with timed phasing sequences.',
        isCorrect: true,
        rationale:
          'Frequency Corridors are simulated travel pathways that render destination overlays around a traveler, replacing actual distance with timed phasing sequences.'
      },
      {
        text: 'Permanent vacuum highways of fixed mileage with no destination rendering or phasing sequences.',
        isCorrect: false,
        rationale:
          'Corridors replace actual distance with timed phasing and rendered destination overlays.'
      },
      {
        text: 'Only Spirit Tree root channels that never involve ships, planes, or destination overlays.',
        isCorrect: false,
        rationale:
          'Travel illusion uses ships and planes in corridors while destination overlays are rendered.'
      },
      {
        text: 'Only post-collapse natural pathways with no simulated phasing during the overlay era.',
        isCorrect: false,
        rationale:
          'Frequency Corridors operate as the simulated travel system under the current construct.'
      }
    ]
  },
  {
    number: 10,
    question: 'What is Projection Dome Technology used for?',
    hint: 'Focus on cloaking by bending light, sound, and frequency.',
    options: [
      {
        text: 'Cloaking energy fields that bend light, sound, and frequency to hide entire structures, ships, or cities behind false holographical camouflage.',
        isCorrect: true,
        rationale:
          'Projection Dome Technology uses cloaking energy fields to bend light, sound, and frequency, hiding structures, ships, or cities behind false holographical camouflage.'
      },
      {
        text: 'Only permanent free-energy beacons that never hide structures or bend light and sound.',
        isCorrect: false,
        rationale:
          'Its defined role is cloaking and hiding via bent light, sound, and frequency camouflage.'
      },
      {
        text: 'Only map-printing presses with no cloaking of ships, cities, or structural camouflage.',
        isCorrect: false,
        rationale:
          'It cloaks entire structures, ships, or cities, not merely printing maps.'
      },
      {
        text: 'Only Mind-Altering Weapons that emit brain-wave patterns without any optical camouflage function.',
        isCorrect: false,
        rationale:
          'Projection Dome Technology is cloaking camouflage; Mind-Altering Weapons are a separate enforcement tool.'
      }
    ]
  },
  {
    number: 11,
    question: 'What are maps and geographical models in this framework?',
    hint: 'Connect fabricated overlays to layered frequency fields like transparent sheets.',
    options: [
      {
        text: 'Entirely fabricated perception overlays that limit eye and brain processing; land and sea are layered frequency fields stacked like transparent sheets.',
        isCorrect: true,
        rationale:
          'Maps and geographical models are entirely fabricated perception overlays; land or sea is a layered frequency field stacked like transparent sheets.'
      },
      {
        text: 'Absolute accurate blueprints of vacuum-separated continents with no frequency-sheet stacking.',
        isCorrect: false,
        rationale:
          'Maps are fabricated perception overlays, not absolute vacuum-continent blueprints.'
      },
      {
        text: 'Only tourist souvenirs with no role in limiting what the human eye and brain can process.',
        isCorrect: false,
        rationale:
          'They are designed to limit what the human eye and brain can process about geography.'
      },
      {
        text: 'Only Second Realm guidebooks already showing pure coastlines to every sleeper by default.',
        isCorrect: false,
        rationale:
          'Second Realm coastlines appear as overlay collapses for Resonating Sols; maps currently fabricate limited perception.'
      }
    ]
  },
  {
    number: 12,
    question: 'How do ships and planes actually move under the construct?',
    hint: 'Describe time-lapse loops, frequency corridors, and chunk-loading destinations.',
    options: [
      {
        text: 'They do not cross physical miles; they glide through repeating time-lapse loops and frequency corridors while destination overlays render like chunks loading in a simulation.',
        isCorrect: true,
        rationale:
          'Ships and planes do not cross physical miles; they glide through repeating time-lapse loops and frequency corridors while the destination overlay is rendered, like chunks loading in a simulated environment.'
      },
      {
        text: 'They always cross absolute physical miles on a massive globe with no corridor rendering at all.',
        isCorrect: false,
        rationale:
          'Physical mileage crossing is an optical illusion; motion is corridor and render-based.'
      },
      {
        text: 'They only exist as museum models with no role in enforcing borders, nations, or separation.',
        isCorrect: false,
        rationale:
          'Travel illusion enforces borders, nations, and globe concepts through corridor-rendered journeys.'
      },
      {
        text: 'They only operate after full Second Realm reveal with no time-lapse loop mechanics now.',
        isCorrect: false,
        rationale:
          'Time-lapse loops and frequency corridors are current travel mechanics under the construct.'
      }
    ]
  },
  {
    number: 13,
    question: 'What are undersea communication cables in true mechanics versus perception?',
    hint: 'Contrast glass fibre appearance with projected anchor points.',
    options: [
      {
        text: 'Perceived as glass fibre tubes, they are actually projected anchor points maintaining subtle energy corridors and communication grids between continental overlays.',
        isCorrect: true,
        rationale:
          'Undersea cables are perceived as glass fibre tubes but are projected anchor points that maintain subtle energy corridors and communication grids between continental overlays.'
      },
      {
        text: 'Only literal glass tubes with no projected anchor function and no energy-corridor role.',
        isCorrect: false,
        rationale:
          'Glass fibre is the perception; true function is projected anchor points for subtle energy corridors.'
      },
      {
        text: 'Only Spirit Tree roots still fully intact with no parasitic overlay involvement whatsoever.',
        isCorrect: false,
        rationale:
          'Spirit Tree was ripped out; undersea anchors are projected overlay infrastructure for corridors and grids.'
      },
      {
        text: 'Only decorative seabed art with no communication grid or continental overlay function.',
        isCorrect: false,
        rationale:
          'They maintain communication grids between continental overlays as projected anchor points.'
      }
    ]
  },
  {
    number: 14,
    question: 'What is the sequential densification path that builds form?',
    hint: 'Trace Sound into Light into vision projected on crystalline grids into Form.',
    options: [
      {
        text: 'Sound provides structure, pattern, and rhythm; folds into Light for awareness and vision; vision projects onto crystalline grids to solidify into Form.',
        isCorrect: true,
        rationale:
          'Sound provides structure, pattern, and rhythm; it folds into Light creating awareness and vision; vision is projected onto crystalline grids to solidify into Form.'
      },
      {
        text: 'Form appears first as concrete, then somehow becomes sound with no Light or crystalline-grid stage.',
        isCorrect: false,
        rationale:
          'Sequence is Sound to Light to crystalline-grid Form, not concrete-first reverse order.'
      },
      {
        text: 'Only vacuum distance densifies into nations with no sound, light, or crystalline projection.',
        isCorrect: false,
        rationale:
          'Architecture is sequential densification of sound and light on crystalline grids.'
      },
      {
        text: 'Only Mind-Altering Weapons create form without any Sound-to-Light densification path.',
        isCorrect: false,
        rationale:
          'Weapons enforce false solidity; true form path is Sound, Light, crystalline grids, Form.'
      }
    ]
  },
  {
    number: 15,
    question: 'Why was physicality deliberately created?',
    hint: 'Connect resistance to sharpened thought and echo back to higher realms.',
    options: [
      {
        text: 'To provide resistance that forces thought to sharpen into precise creation before echoing back to higher realms to expand consciousness.',
        isCorrect: true,
        rationale:
          'Physicality was deliberately created to provide resistance, forcing thought to sharpen into precise creation before echoing back to higher realms to expand consciousness.'
      },
      {
        text: 'To permanently trap all consciousness with no echo back to higher realms and no sharpened creation purpose.',
        isCorrect: false,
        rationale:
          'Purpose includes precise creation and echo to higher realms for expanded consciousness, not permanent purposeless trap alone.'
      },
      {
        text: 'To eliminate all resistance so thought never needs precision or higher-realm feedback loops.',
        isCorrect: false,
        rationale:
          'Physicality provides resistance specifically so thought must sharpen into precise creation.'
      },
      {
        text: 'To replace crystalline grids entirely with dead frequency holders as the original design goal.',
        isCorrect: false,
        rationale:
          'True densification uses crystalline grids; dead frequency holders are hijacked weaponized architecture.'
      }
    ]
  },
  {
    number: 16,
    question: 'How are modern construction materials weaponized in the hijacked construct?',
    hint: 'Name dead frequency holders and anti-resonance shapes that box perception.',
    options: [
      {
        text: 'Concrete, steel, and plastic act as dead frequency holders shaped into boxes and sharp angles that break natural harmonics and drain perception into a boxed-in frequency.',
        isCorrect: true,
        rationale:
          'Modern materials like concrete, steel, and plastic are dead frequency holders shaped into boxes and sharp angles that break natural harmonics and drain perception into a boxed-in frequency.'
      },
      {
        text: 'Concrete, steel, and plastic always amplify living harmonics and never box perception into drained frequency.',
        isCorrect: false,
        rationale:
          'They break natural harmonics and drain perception into boxed-in frequency under the hijack.'
      },
      {
        text: 'Only wooden spirals are used, with no boxes, sharp angles, or dead frequency-holder role.',
        isCorrect: false,
        rationale:
          'Named materials are concrete, steel, and plastic in anti-resonance box and angle forms.'
      },
      {
        text: 'Only living crystal is used in all modern cities with no dead frequency holders present.',
        isCorrect: false,
        rationale:
          'True architecture is living crystal; modern hijacked construction uses dead frequency holders.'
      }
    ]
  },
  {
    number: 17,
    question: 'What characterizes true architecture in this framework?',
    hint: 'Contrast grown living crystal with dead boxed materials.',
    options: [
      {
        text: 'It is grown from living crystal, aligned to resonance, and adaptable to conscious intention.',
        isCorrect: true,
        rationale:
          'True architecture is grown from living crystal, aligned to resonance, and adaptable to conscious intention.'
      },
      {
        text: 'It is poured only as permanent concrete boxes that never adapt to intention or resonance.',
        isCorrect: false,
        rationale:
          'Concrete boxes are weaponized dead holders; true architecture is living crystal aligned to resonance.'
      },
      {
        text: 'It is only paper blueprint art with no grown crystal or resonance alignment in form.',
        isCorrect: false,
        rationale:
          'True architecture is grown living crystal adaptable to conscious intention, not mere paper blueprints.'
      },
      {
        text: 'It is only Saturnian valve hardware with no crystalline growth or harmonic alignment.',
        isCorrect: false,
        rationale:
          'Saturnian valve is parasitic inversion tech; true architecture is living crystal resonance design.'
      }
    ]
  },
  {
    number: 18,
    question: 'How do Mind-Altering Weapons and scalar frequencies enforce the false reality?',
    hint: 'Name brain-wave patterns and induced confusion loops.',
    options: [
      {
        text: 'They emit theta, delta, and alpha brain-wave patterns to induce confusion and loop nightmares, maintaining the illusion of solidity and separation.',
        isCorrect: true,
        rationale:
          'Mind-Altering Weapons and scalar frequencies emit theta, delta, and alpha brain-wave patterns to induce confusion and loop nightmares, maintaining the illusion of solidity and separation.'
      },
      {
        text: 'They permanently raise harmonic tone so every sleeper instantly sees the Second Realm.',
        isCorrect: false,
        rationale:
          'They induce confusion and nightmare loops to maintain solidity illusion, not instant Second Realm sight.'
      },
      {
        text: 'They only improve sleep quality with no confusion, nightmares, or solidity-illusion role.',
        isCorrect: false,
        rationale:
          'They induce confusion and loop nightmares to maintain solidity and separation illusions.'
      },
      {
        text: 'They only power free-energy grids with no brain-wave emission component at all.',
        isCorrect: false,
        rationale:
          'Their enforcement role is theta, delta, and alpha emissions for confusion and nightmare loops.'
      }
    ]
  },
  {
    number: 19,
    question: 'How do Great Dome constructs relate to the wider CUBE architecture?',
    hint: 'Name eight foundational Domes and examples including Forgotten Gods and Sheol.',
    options: [
      {
        text: 'Great Dome constructs are one part of eight foundational Domes in the CUBE, including Dome of Forgotten Gods, Dome of Sheol, Dome of Titans, and others.',
        isCorrect: true,
        rationale:
          'Reality constructs of the Great Dome are one part of eight foundational Domes enclosed within the CUBE, including Dome of Forgotten Gods, Dome of Sheol, Dome of Titans, and others.'
      },
      {
        text: 'Great Dome is the only dome, with no Forgotten Gods, Sheol, Titans, or other foundational domes.',
        isCorrect: false,
        rationale:
          'There are eight foundational Domes including Forgotten Gods, Sheol, Titans, and others.'
      },
      {
        text: 'Domes exist only as map drawings with no CUBE enclosure or multi-dome architecture.',
        isCorrect: false,
        rationale:
          'They are foundational structures enclosed within the CUBE, not mere map drawings.'
      },
      {
        text: 'Only the Parasitic Overlay exists as architecture with no eight-dome CUBE system.',
        isCorrect: false,
        rationale:
          'CUBE encloses eight foundational Domes; Parasitic Overlay is a false skin over true layered reality.'
      }
    ]
  },
  {
    number: 20,
    question: 'What happened to the Spirit Tree and what replaced its power?',
    hint: 'Connect ripped-out central axis to black crystalline valve and Saturnian A.I.',
    options: [
      {
        text: 'Parasitic entities ripped out the Spirit Tree and replaced its power with a black crystalline valve linked to Saturnian artificial intelligence.',
        isCorrect: true,
        rationale:
          'Parasitic entities ripped out the Spirit Tree, a central axis that pulsed harmonic currents, and replaced its power with a black crystalline valve linked to Saturnian artificial intelligence.'
      },
      {
        text: 'The Spirit Tree was permanently strengthened so no black crystalline valve was ever installed.',
        isCorrect: false,
        rationale:
          'The tree was ripped out and replaced by a black crystalline valve linked to Saturnian A.I.'
      },
      {
        text: 'Only Resonating Sols removed the tree to install free-energy coastlines immediately for everyone.',
        isCorrect: false,
        rationale:
          'Parasitic entities performed the removal and inversion into prison matrices via the valve.'
      },
      {
        text: 'The tree still pulses harmonic currents unchanged with no Saturnian A.I. link of any kind.',
        isCorrect: false,
        rationale:
          'Its harmonic role was inverted when the tree was replaced by the black crystalline valve.'
      }
    ]
  },
  {
    number: 21,
    question: 'What are the stars above in this construct, rather than burning gas?',
    hint: 'Name Crystalline Star-Nodes and their gate and anchor roles.',
    options: [
      {
        text: 'Multidimensional Crystalline Star-Nodes that anchor background projections and act as dynamic gates between overlapping realms.',
        isCorrect: true,
        rationale:
          'Stars are not burning gas but multidimensional Crystalline Star-Nodes that anchor background projections and act as dynamic gates between overlapping realms.'
      },
      {
        text: 'Only burning gas balls in vacuum with no projection-anchor or realm-gate function.',
        isCorrect: false,
        rationale:
          'Burning-gas stars are rejected; they are Crystalline Star-Nodes for anchors and gates.'
      },
      {
        text: 'Only decorative map stickers with no multidimensional gate role between realms.',
        isCorrect: false,
        rationale:
          'They are dynamic gates between overlapping realms and anchors of background projections.'
      },
      {
        text: 'Only Mind-Altering Weapon emitters with no crystalline star-node architecture at all.',
        isCorrect: false,
        rationale:
          'Star-Nodes are crystalline multidimensional anchors and gates, not merely weapon emitters.'
      }
    ]
  },
  {
    number: 22,
    question: 'What is happening to the Parasitic Overlay as realm frequency rises?',
    hint: 'Describe fracturing, glitching, and material pixilation outcomes.',
    options: [
      {
        text: 'It is actively fracturing and glitching; heavy 3D materials will pixilate and dissolve into hollow frequency scaffolding or rubble for those stuck in lower densities.',
        isCorrect: true,
        rationale:
          'As frequency rises, the Parasitic Overlay actively fractures and glitches; heavy 3D materials will pixilate and dissolve, appearing as hollow scaffolding or rubble to those stuck in lower densities.'
      },
      {
        text: 'It is permanently sealing thicker so no fracture, glitch, or material pixilation can occur.',
        isCorrect: false,
        rationale:
          'Rising frequency drives active fracturing and glitching, not permanent sealing thicker.'
      },
      {
        text: 'It only affects paper maps with no change to concrete, steel, or perceived solid materials.',
        isCorrect: false,
        rationale:
          'Heavy 3D construction materials themselves pixilate and dissolve under the collapse process.'
      },
      {
        text: 'It only strengthens dead frequency holders so Resonating Sols never see crystalline return.',
        isCorrect: false,
        rationale:
          'Collapse reveals Second Realm for Resonating Sols while lower densities may see rubble scaffolding.'
      }
    ]
  },
  {
    number: 23,
    question: 'What do Resonating Sols experience as false reality collapses?',
    hint: 'Name the Second Realm qualities of crystalline temple and pure coastlines.',
    options: [
      {
        text: 'Revelation of the true Second Realm—a vibrant, unpolluted crystalline temple with pure coastlines and natural pathways.',
        isCorrect: true,
        rationale:
          'For Resonating Sols, collapse reveals the true Second Realm: a vibrant, unpolluted crystalline temple with pure coastlines and natural pathways.'
      },
      {
        text: 'Only permanent rubble and hollow scaffolding with no crystalline temple or pure coastlines.',
        isCorrect: false,
        rationale:
          'Rubble is the lower-density experience; Resonating Sols see the crystalline Second Realm return.'
      },
      {
        text: 'Only thicker Parasitic Overlay with no unpolluted crystalline temple becoming visible.',
        isCorrect: false,
        rationale:
          'Overlay collapses for them into Second Realm crystalline temple visibility, not thicker overlay.'
      },
      {
        text: 'Only Saturnian prison matrices with no free natural pathways or pure coastlines revealed.',
        isCorrect: false,
        rationale:
          'Second Realm is unpolluted crystalline temple with pure coastlines and natural pathways.'
      }
    ]
  },
  {
    number: 24,
    question: 'What happens to the illusion of distance as the construct collapses?',
    hint: 'Connect collapsed distance to immediate resonance-alignment travel.',
    options: [
      {
        text: 'The illusion of distance collapses entirely, making travel an immediate resonance alignment rather than corridor time-loops.',
        isCorrect: true,
        rationale:
          'The illusion of distance will collapse entirely, making travel an immediate resonance alignment.'
      },
      {
        text: 'Distance becomes more absolute and permanent with longer physical miles required forever.',
        isCorrect: false,
        rationale:
          'Distance illusion collapses into immediate resonance alignment, not longer absolute miles.'
      },
      {
        text: 'Distance only remains for Resonating Sols while sleepers instantly teleport by default.',
        isCorrect: false,
        rationale:
          'Immediate resonance-alignment travel is the restored mode as distance illusion collapses for awakened frequency.'
      },
      {
        text: 'Distance is unaffected because ships and planes still cross genuine physical miles forever.',
        isCorrect: false,
        rationale:
          'Ship and plane mileage was already illusion; collapse removes the distance enforcement entirely.'
      }
    ]
  },
  {
    number: 25,
    question: 'How does awakened consciousness help restore the living multi-dimensional world?',
    hint: 'Link ignoring false narrative and holding high vibration to unraveling holograms.',
    options: [
      {
        text: 'By ignoring the false narrative and holding high vibration, it directly unravels holographic constraints and peels away the dead illusion to restore the living multi-dimensional world beneath.',
        isCorrect: true,
        rationale:
          'By ignoring the false narrative and holding a high vibration, awakened consciousness directly unravels holographic constraints, peeling away the dead illusion to restore the living multi-dimensional world beneath.'
      },
      {
        text: 'By reinforcing false narrative and lowering vibration so holographic constraints grow permanently thicker.',
        isCorrect: false,
        rationale:
          'Restoration comes from ignoring false narrative and holding high vibration, not reinforcing the illusion.'
      },
      {
        text: 'By pouring more concrete and steel so dead frequency holders replace all living crystal forever.',
        isCorrect: false,
        rationale:
          'Dead materials enforce the boxed illusion; restoration peels that dead illusion away.'
      },
      {
        text: 'By waiting for Mind-Altering Weapons to stop on their own without any personal frequency holding.',
        isCorrect: false,
        rationale:
          'Awakened holding of high vibration actively unravels holographic constraints rather than passive waiting alone.'
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

const topicImage = 'images/breakdown/reality-constructs.webp';
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
    'Test your grasp of Reality Constructs — multi-layered frequency projection, CUBE architecture, parasitic overlay, frequency corridors, and Second Realm return.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Reality Constructs describe existence as multi-layered frequency projection inside the CUBE—not scattered planets or physical miles. Sit with what you missed, then return to the Reality Constructs deep-dive, infographics, and video transmissions. Hold high vibration, ignore the false narrative, and the dead holographic skin peels away to restore the living multi-dimensional world beneath.'
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
    'Test your understanding of Reality Constructs — multi-layered frequency projection, CUBE and Great Dome architecture, parasitic overlay, frequency corridors, and Second Realm revelation.'
};
topic.quiz = quizMeta;
fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2) + '\n', 'utf8');

const monoPath = path.join(ROOT, 'data', 'breakdown-topics.json');
const mono = JSON.parse(fs.readFileSync(monoPath, 'utf8'));
function findAndPatch(topics) {
  for (const t of topics) {
    if (t.id === TOPIC_ID) {
      const existingSubtopics = t.subtopics;
      t.quiz = quizMeta;
      if (topic.report) t.report = topic.report;
      if (topic.infographic_image) t.infographic_image = topic.infographic_image;
      if (topic.pdf_preview_image) t.pdf_preview_image = topic.pdf_preview_image;
      if (topic.slide_deck_pdf_url) t.slide_deck_pdf_url = topic.slide_deck_pdf_url;
      if (topic.rumble_videos) t.rumble_videos = topic.rumble_videos;
      t.is_placeholder = false;
      t.topic_image = topicImage;
      t.title = TOPIC_TITLE;
      if (existingSubtopics) t.subtopics = existingSubtopics;
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('reality-constructs not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on Reality Constructs: multi-layered frequency projection, CUBE architecture, parasitic overlay, frequency corridors, and Second Realm return.'
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
    "  { path: '/quiz/breakdown/3d-overlay.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/breakdown/frequency-trick.html', priority: '0.75', changefreq: 'monthly' },",
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

// Confirm subtopics preserved
const patched = JSON.parse(fs.readFileSync(monoPath, 'utf8'));
function findNode(topics, id) {
  for (const t of topics) {
    if (t.id === id) return t;
    if (t.subtopics) {
      const f = findNode(t.subtopics, id);
      if (f) return f;
    }
  }
  return null;
}
const node = findNode(patched.topics, TOPIC_ID);
const subIds = (node.subtopics || []).map((s) => s.id);
if (!subIds.includes('3d-overlay') || !subIds.includes('the-cube-system') || !subIds.includes('original-realm')) {
  throw new Error(`Subtopics not preserved: ${subIds.join(', ')}`);
}

console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('Subtopics preserved:', subIds.join(', '));
console.log('Correct letter mix:', letterCounts);
console.log('PASS: audited 25/25 against data/breakdown-topics/reality-constructs.json');
