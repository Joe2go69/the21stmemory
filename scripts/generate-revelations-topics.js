/**
 * Generates data/revelations-topics.json from the Revelations Parts 1–6 mind-map skeleton.
 * Run: node scripts/generate-revelations-topics.js
 * Then: node scripts/split-topics-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PLACEHOLDER_IMAGE = 'images/revelations/placeholder.webp';

const DESCRIPTION = `This transmission is the six-part brief synopsis of Christian21's revelations for the Great Spiritual Awakening — next-level intel on soul architecture, the simulation field, and the parasitic farm built around the fifteen human attributes. It maps how intelligence preceded physicality, how the 12 Proximal Sols and 4,000 Taran vessels were created, and how overlays, digital inserts, MK-Ultra, legal capture, and reset harvest keep the inner illusion running.

Essential for anyone who wants to understand Sovereign Accord, Custodian control systems, Tartarian memory, the organic circuitboard of this realm, and why the original writings on Christian21 remain the place to sit with the source documents.`;

const ESSENCE_REPORT = `# Essence of the Transmission

## Overview
${DESCRIPTION}

## Key Themes

- **Soul Architecture** — Intelligence first, the 12 Proximal Sols, Taran vessels, the fifteen attributes, Arc Pod protocol, and homecoming reunion.
- **Simulation Field** — Overlay geography, digital inserts and holographic sleeves, the inner illusion, and the quantum interface through pineal crossover and five brainwaves.
- **Sovereign Accord** — Field law of this sealed realm, manufactured wants, MK-Ultra craft, GAT programs, and the subtle help of ayahuasca and pineal DMT.
- **Custodian Control** — Legal capture through birth bonds and usury, occult orders, counterfeit systems, medical harvest, and bone vaults.
- **Reset Harvest** — Reset sequence and story stages, harvest toll, clone genetics, DUMB repopulation, and the Roswell checkmate.
- **Tartarian Memory** — The Square Mile, harmonic architecture, Moorish metropolis, Lemurian tongue, and TPC mirrors.
- **Organic Circuitboard** — Axis mundi and the Spirit Tree, mineral components, the living garden, and the plane of worlds — the Cube, density stack, and terrarium seal.

## Status
TODO: Full essence report, infographics, and video transmissions will be added as content is decoded.
`;

const MIND_MAP = [
  {
    id: 'soul-architecture',
    title: 'Soul Architecture',
    description: 'The 12 Proximal Sols, Taran vessels, intelligence-first creation, the fifteen attributes, Arc Pod protocol, and homecoming reunion.',
    children: [
      { id: 'proximal-sols', title: 'Proximal Sols', description: 'The original 12 beings — six pairs created by Source as the first proximal sols.' },
      {
        id: 'taran-vessels',
        title: 'Taran Vessels',
        description: 'The original hominid vessels of this realm, designed after intelligence already existed.',
        children: [
          { id: 'intelligence-first', title: 'Intelligence First', description: 'Intelligence preceded physicality — physical life began in the ocean; intellect did not.' },
          { id: 'fifteen-attributes', title: 'Fifteen Attributes', description: 'The fifteen human firmware traits the parasites could not delete, so they weaponized them.' }
        ]
      },
      {
        id: 'arc-pod-protocol',
        title: 'Arc Pod Protocol',
        description: 'How sols were inserted into the farm without knowing the mission they signed up for.',
        children: [
          { id: 'clueless-protocol', title: 'Clueless Protocol', description: 'Incarnation with the mission memory stripped so the work can be done from inside the overlay.' },
          { id: 'mission-insertion', title: 'Mission Insertion', description: 'The insertion of mission-bearing sols into Taran vessels for the awakening window.' }
        ]
      },
      { id: 'homecoming-reunion', title: 'Homecoming Reunion', description: 'The return path for sols who remember — reunion with the original soul architecture.' }
    ]
  },
  {
    id: 'simulation-field',
    title: 'Simulation Field',
    description: 'Overlay geography, digital inserts and holographic sleeves, the inner illusion, and the quantum interface through pineal crossover and five brainwaves.',
    children: [
      { id: 'overlay-geography', title: 'Overlay Geography', description: 'Continuous-scrolling overlays that blend the inner illusion into seamless spatial geography.' },
      {
        id: 'digital-inserts',
        title: 'Digital Inserts',
        description: 'Holographic people, sleeves, and digital inserts used to populate and steer the farm.',
        children: [
          { id: 'npc-ratio', title: 'NPC Ratio', description: 'The proportion of true sols versus inserted characters maintaining the simulation.' },
          { id: 'holographic-sleeves', title: 'Holographic Sleeves', description: 'Projected sleeves and holographic people walking the overlay as if they were solid.' }
        ]
      },
      { id: 'inner-illusion', title: 'Inner Illusion', description: 'How the fabric of reality and the inner illusion are generated and maintained.' },
      {
        id: 'quantum-interface',
        title: 'Quantum Interface',
        description: 'The pineal-brainwave interface through which consciousness powers the simulation.',
        children: [
          { id: 'pineal-crossover', title: 'Pineal Crossover', description: 'The pineal as the crossover point between denser overlay perception and higher signal.' },
          { id: 'five-brainwaves', title: 'Five Brainwaves', description: 'The five brainwave bands used as the organic interface into the simulation field.' }
        ]
      }
    ]
  },
  {
    id: 'sovereign-accord',
    title: 'Sovereign Accord',
    description: 'Field law of this sealed realm, manufactured wants, MK-Ultra craft, GAT programs, and the subtle help of ayahuasca and pineal DMT.',
    children: [
      { id: 'field-law', title: 'Field Law', description: 'The Sovereign Accord — the law this world is sealed in, prior to manufactured choice.' },
      {
        id: 'manufactured-wants',
        title: 'Manufactured Wants',
        description: 'You can choose what you want, but your wants are chosen for you.',
        children: [
          { id: 'choice-architecture', title: 'Choice Architecture', description: 'Endless options inside options — shampoo, cities, careers — as the farm\'s control surface.' },
          { id: 'fifteen-minute-cities', title: 'Fifteen-Minute Cities', description: 'The 15-minute city pitch as public-safety theater for a tighter farm enclosure.' }
        ]
      },
      {
        id: 'mk-ultra-craft',
        title: 'MK-Ultra Craft',
        description: 'Emotional scoring and GAT programs as the craft of mind control inside the overlay.',
        children: [
          { id: 'emotional-scoring', title: 'Emotional Scoring', description: 'How empathy and emotion are scored, redirected, and used as MK-Ultra payload.' },
          { id: 'gat-programs', title: 'GAT Programs', description: 'Gifted and Talented programs launched after Sputnik to harvest and steer high-capacity minds.' }
        ]
      },
      {
        id: 'subtle-help',
        title: 'Subtle Help',
        description: 'Plant teachers and endogenous DMT as remaining organic help inside the farm.',
        children: [
          { id: 'ayahuasca-vine', title: 'Ayahuasca Vine', description: 'The ayahuasca vine as a remaining organic teacher the overlay never fully captured.' },
          { id: 'pineal-dmt', title: 'Pineal DMT', description: 'Endogenous pineal DMT as the vessel\'s own crossover chemistry.' }
        ]
      }
    ]
  },
  {
    id: 'custodian-control',
    title: 'Custodian Control',
    description: 'Legal capture through birth bonds and usury, occult orders, counterfeit systems, medical harvest, and bone vaults.',
    children: [
      {
        id: 'legal-capture',
        title: 'Legal Capture',
        description: 'Birth certificates, Cestui Que Vie bonds, and the usury trap as legal ownership of the vessel.',
        children: [
          { id: 'birth-bond', title: 'Birth Bond', description: 'The birth-certificate scam and Cestui Que Vie bonding of the living into a legal dead estate.' },
          { id: 'usury-trap', title: 'Usury Trap', description: 'Finance as fake current — interest and debt as the farm\'s leash.' }
        ]
      },
      {
        id: 'occult-orders',
        title: 'Occult Orders',
        description: 'Freemasonic gatekeepers and the owl current behind public institutions.',
        children: [
          { id: 'freemasonic-orders', title: 'Freemasonic Orders', description: 'Freemasonry as the public-facing order that gates science, media, history, and travel.' },
          { id: 'owl-current', title: 'Owl Current', description: 'The owl current — 322, Skull & Bones, and the occult layer above the lodge.' }
        ]
      },
      {
        id: 'counterfeit-systems',
        title: 'Counterfeit Systems',
        description: 'Religion, the world wide web, and academic distortion as replacement operating systems.',
        children: [
          { id: 're-legion', title: 'Re-Legion', description: 'Religion as re-legion — a counterfeit spiritual operating system installed after the reset.' },
          { id: 'world-wide-web', title: 'World Wide Web', description: 'The web as a counterfeit nervous system for the overlay, not a free library.' },
          { id: 'academic-distortion', title: 'Academic Distortion', description: 'Education and perceived knowledge as the third string — a curriculum of fabricated dots.' }
        ]
      },
      {
        id: 'medical-harvest',
        title: 'Medical Harvest',
        description: 'Iatrogenic death and Human 2.0 as the medical arm of the harvest.',
        children: [
          { id: 'iatrogenic-death', title: 'Iatrogenic Death', description: 'Medicine as harvest — a patient cured is a customer lost.' },
          { id: 'human-2-0', title: 'Human 2.0', description: 'The Human 2.0 upgrade path as a DNA war on the original Taran vessel.' }
        ]
      },
      { id: 'bone-vaults', title: 'Bone Vaults', description: 'Cathedrals of the dead — vaulted rooms of human bone as monuments to the harvest.' }
    ]
  },
  {
    id: 'reset-harvest',
    title: 'Reset Harvest',
    description: 'Reset sequence and story stages, harvest toll, clone genetics, DUMB repopulation, and the Roswell checkmate.',
    children: [
      {
        id: 'reset-sequence',
        title: 'Reset Sequence',
        description: 'How a reset is staged: stone-age restart, then narrative installation in three story stages.',
        children: [
          { id: 'stone-age-restart', title: 'Stone Age Restart', description: 'The post-reset restart that dumps survivors into a primitive cover story.' },
          { id: 'story-stages', title: 'Story Stages', description: 'Stagecoach to spaghetti western — the three-stage rewrite of American and world history.' }
        ]
      },
      { id: 'harvest-toll', title: 'Harvest Toll', description: 'The human cost of each reset — loosh, adrenochrome, and the body count the farm requires.' },
      {
        id: 'clone-genetics',
        title: 'Clone Genetics',
        description: 'Clones, orphans, and weaponized species used to refill emptied cities.',
        children: [
          { id: 'dumb-repopulation', title: 'DUMB Repopulation', description: 'Deep-underground production and orphan-train style refill of the surface after a reset.' },
          { id: 'weaponized-species', title: 'Weaponized Species', description: 'Giant panda, sasquatch, and other engineered species as tools, not accidents of evolution.' }
        ]
      },
      {
        id: 'roswell-checkmate',
        title: 'Roswell Checkmate',
        description: 'The 1947 H1 Orion incident as the quintessential checkmate of the overlay story.',
        children: [
          { id: 'anukim-strike', title: 'Anukim Strike', description: 'Anakim giants bringing down the crafts over Roswell — the event the weather-balloon story buried.' },
          { id: 'transistor-leak', title: 'Transistor Leak', description: 'The point-contact transistor as recovered tech that collapsed the cost of computing.' },
          { id: 'invasion-script', title: 'Invasion Script', description: 'War of the Worlds to Bluebeam — the long invasion script installed in public consciousness.' }
        ]
      }
    ]
  },
  {
    id: 'tartarian-memory',
    title: 'Tartarian Memory',
    description: 'The Square Mile, harmonic architecture, Moorish metropolis, Lemurian tongue, and TPC mirrors.',
    children: [
      {
        id: 'square-mile',
        title: 'Square Mile',
        description: 'London\'s Square Mile as the current-control node of the farm.',
        children: [
          { id: 'population-math', title: 'Population Math', description: 'The numbers that do not add up — population, cities, and the scale of the last refill.' },
          { id: 'banks-as-current', title: 'Banks as Current', description: 'Banks as current, not money — the Square Mile as a frequency and claim node.' }
        ]
      },
      {
        id: 'harmonic-architecture',
        title: 'Harmonic Architecture',
        description: 'Buildings grown and sung into existence as living fabric, not piled stone.',
        children: [
          { id: 'living-fabric', title: 'Living Fabric', description: 'Harmonically grown buildings as living fabric of the original Tartarian world.' },
          { id: 'sound-masonry', title: 'Sound Masonry', description: 'Sound as the masonry — frequency used to raise and tune the original cities.' }
        ]
      },
      { id: 'moorish-metropolis', title: 'Moorish Metropolis', description: 'The Moorish layer of the true cities, overwritten by the post-reset story.' },
      { id: 'lemurian-tongue', title: 'Lemurian Tongue', description: 'The Lemurian language current still sitting under the overlay\'s languages.' },
      { id: 'tpc-mirrors', title: 'TPC Mirrors', description: 'TPC mirrors as remaining Tartarian memory devices in the public landscape.' }
    ]
  },
  {
    id: 'organic-circuitboard',
    title: 'Organic Circuitboard',
    description: 'Axis mundi and the Spirit Tree, mineral components, the living garden, and the plane of worlds — the Cube, density stack, and terrarium seal.',
    children: [
      {
        id: 'axis-mundi',
        title: 'Axis Mundi',
        description: 'The Spirit Tree as the central axis, with Cain at the periphery of the original garden.',
        children: [
          { id: 'spirit-tree', title: 'Spirit Tree', description: 'The Spirit Tree as the organic axis of this realm\'s circuitboard.' },
          { id: 'cain-periphery', title: 'Cain Periphery', description: 'Cain and Abel as a periphery story of the original garden, not a desert morality tale.' }
        ]
      },
      { id: 'mineral-components', title: 'Mineral Components', description: 'The mineral layer of the organic circuitboard — crystals, metals, and ground current.' },
      {
        id: 'living-garden',
        title: 'Living Garden',
        description: 'Miracle soil and impossible trees as leftover original-garden technology.',
        children: [
          { id: 'miracle-soil', title: 'Miracle Soil', description: 'Amazonian soil and other miracle grounds that should not exist under the overlay story.' },
          { id: 'impossible-trees', title: 'Impossible Trees', description: 'Brazil nut, peach palm, and other trees that do not fit the accepted botanical narrative.' }
        ]
      },
      {
        id: 'plane-of-worlds',
        title: 'Plane of Worlds',
        description: 'The Cube, the density stack, and the terrarium seal of this enclosed plane.',
        children: [
          { id: 'the-cube', title: 'The Cube', description: 'The Cube as a structural principle of the enclosed plane, not a distant space object.' },
          { id: 'density-stack', title: 'Density Stack', description: 'The stacked densities of this plane — from the 3rd overlay up through the original Taran world.' },
          { id: 'terrarium-seal', title: 'Terrarium Seal', description: 'The sealed terrarium of this realm — firmament, ice, and the law that holds the farm in.' }
        ]
      }
    ]
  }
];

function slugToDescription(title) {
  return `Exploration of ${title.charAt(0).toLowerCase()}${title.slice(1)}.`;
}

function placeholderReport(title) {
  return `# ${title}\n\n## Overview\n\nTODO: Full breakdown coming soon.\n`;
}

function buildNode(node) {
  const item = {
    id: node.id,
    title: node.title,
    description: node.description || slugToDescription(node.title),
    topic_image: PLACEHOLDER_IMAGE,
    report: placeholderReport(node.title)
  };
  if (node.children?.length) {
    item.subtopics = node.children.map(buildNode);
  }
  return item;
}

function countTopics(topics) {
  let total = 0;
  const walk = (items) => {
    for (const item of items || []) {
      total++;
      if (item.subtopics?.length) walk(item.subtopics);
    }
  };
  walk(topics);
  return total;
}

const topics = [
  {
    id: 'essence-of-the-transmission',
    title: 'Essence of the Transmission',
    description: 'The cornerstone summary of the Revelations synopsis — soul architecture, the simulation field, Custodian control, reset harvest, and the organic circuitboard of this realm.',
    // Art: images/revelations/essence-of-the-transmission.webp (from eot.jpg — not the Codex card)
    topic_image: 'images/revelations/essence-of-the-transmission.webp',
    is_main_root: true,
    report: ESSENCE_REPORT
  },
  ...MIND_MAP.map(buildNode)
];

const payload = {
  id: 'revelations',
  title: 'A Brief Synopsis of Revelations',
  subtitle: 'Parts 1–6',
  image: 'images/revelations.webp',
  pdf_url: 'https://drive.google.com/file/d/1-odKLFuMW9cM8fibGzenSXSQKfF0T2yG/view?usp=sharing',
  source_url: 'https://christian21.com/revelations-part-1/',
  source_url_label: 'Read Part 1 on Christian21 →',
  playlist_url: 'https://rumble.com/playlists/XW8d4WbTAko',
  description: DESCRIPTION,
  total_topics: countTopics(topics),
  topics
};

const outPath = path.join(ROOT, 'data', 'revelations-topics.json');
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
console.log(`Wrote ${path.relative(ROOT, outPath)} (${payload.total_topics} topics)`);
