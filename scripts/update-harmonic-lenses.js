/**
 * Updates breakdown harmonic-lenses topic in topic file + monolithic source.
 * Does not modify other topics' image fields.
 * Run: node scripts/update-harmonic-lenses.js && node scripts/split-topics-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'harmonic-lenses';

const REPORT = `# Harmonic Lenses

## Overview

The fundamental architecture of the physical plane consists of interconnected Energy Nodes and their surrounding Harmonic Lenses. These structures form the true Crystalline Grid, functioning as the circulatory and nervous systems of the realm. Nodes act as junction points for energy lines, while harmonic lenses shape and focus the vibrational currents. Originally designed to feed souls with Source energy and maintain connections between realms, this vast electro-magnetic framework was suppressed and hijacked by parasitic overlays. It is currently returning to its original resonant function, realigning the frequencies of the realm.

## Key Terminology

- **Energy Nodes** — Junction points of energy lines and leylines that act as neutral relay stations, gathering power from one set of lines and passing it along to form the grids that keep the earth balanced.

- **Harmonic Lenses** — The pattern of frequency that forms around an active node, acting like a crystalline bloom that opens and closes to shape, focus, and redirect vibrational energy, much like a glass lens shapes light.

- **The Crystalline Grid** — The massive interconnected web of nodes, harmonic lenses, and crystals that forms a multi-dimensional communication and power network, acting as the living bones of the realm.

- **Crystalline Structures** — The true underlying material and architecture of the realms, including nodes, lenses, and temples, which hum with ancient Source codes and serve as the physical and etheric hard drives of the grids.

- **Source** — The pure awareness and life force that originally flowed unobstructed through the nodes and lenses, providing vitality and connection to all physical realms.

- **Loosh** — The collective attention and emotion harvested by parasites to maintain their false stability.

## Core Revelations

Harmonic lenses and nodes are not inanimate geography; they are living light structures. They act as the eyes of the earth, sensing, balancing, and sending signals between realms. The true function of these nodes was inverted. Parasites anchored overlay codes into the nodes, broadcasting distortions like a radio tower, and used harmonic lenses to manipulate reality, including the artificial positioning and projection of the sun across different countries. Every heart in harmony becomes a harmonic lens. Souls themselves are powerful nodes meant to interface with this grid, healing, balancing, and relaying light back through the web.

## Detailed Mechanics and Key Elements

### The Anatomy of a Harmonic Lens

A harmonic lens forms the geometric pattern around an active node. When clear and tuned, the energy flows in perfect rhythm with the realm's heartbeat. When clouded or fractured by parasitic interference, the lens distorts the current, causing the inhabitants within its field to feel drained, confused, or agitated.

### The Four Types of Energy Nodes

#### Earth Nodes (Lava/Core Nodes)

Located deep underground where plasma and crystalline veins meet. Pulsing with red-gold or orange light, these are the power cores that push life force up through leylines, tree roots, and mountains, stabilizing the magnetic resonance of the dome.

#### Surface Nodes (Harmonic Nodes)

Positioned where energy lines cross, often marked by ancient temples, pyramids, or stone circles. They hum in blue or white tones, amplifying frequency and connecting directly to sky portals.

#### Sky Nodes (Celestial Nodes)

Appearing as bright stars or the Northern Lights. These are projected points that anchor the overlay grids, communicating with earth nodes in a two-way relay of energy.

#### Inter-dimensional Nodes (Light Grid Anchors)

High-frequency spheres, invisible to 3D eyes, holding the portals between overlays. They appear as rainbow balls, gold lattices, or liquid silver orbs.

### Parasitic Inversion and Grid Hijacking

To control the realm, parasites buried parts of the main crystalline grid under cities, oceans, and soil, inverting nodes into parasitic circuit boards designed to siphon Loosh. Modern 3D architecture—defined by boxes, sharp angles, and dead materials like concrete—was purposefully placed to block or short-circuit these organic grid nodes, inducing fatigue and disconnection.

## Broader Context and Interconnections

### The Cosmic Architecture

The energy nodes and harmonic lenses connect the Great Dome to the seven outer domes, such as the Dome of Forgotten Gods and the Dome of Titans. The central node of the Great Dome was the Spirit Tree, which acted as the main axis of consciousness, sending harmonic currents through the entire grid before it was ripped out and replaced with Black Cube Tech.

### Star-Nodes and the Night Sky

What humans perceive as stars are actually multidimensional crystalline nodes (Sky Nodes). Constellations, or Zodiac Star-Signs, are actually frequency locks placed over these gates to seal them. The true North Star alignment was centered on Thuban (Aru-el-nai), which anchored the vertical axis of the grid, before parasites rotated the projection to point to Polaris to enforce their control narrative.

### City Layouts and Historical Resets

Major cities sit directly over multi-layered crystal anchors. For example, the Great Fire of London in 1666 was a surface-level distraction masking an etheric war over the crystalline node beneath the city. The node was ultimately locked down and overwritten with masonic architecture to suppress the original Tartarian grid memory.

## Strategic Implications

As the frequency of the realm rises, the parasitic overlays are fracturing. The suppressed nodes and harmonic lenses are reactivating. Resonating souls are unknowingly re-triggering these structures because their embedded soul codes perfectly match the ancient Source codes within the grid.

Standing on sacred sites, nodes, or river bends allows souls to interface with vast, active crystalline structures that remain masked by the 3D illusion. Humanity must realize that they are the grid. By holding resonance, rejecting fear, and breathing in stillness with the earth, awakened souls function as harmonic lenses themselves, restoring the broken circuits and collapsing the false parasitic network.
`;

const harmonicLenses = {
  id: TOPIC_ID,
  title: 'Harmonic Lenses',
  description:
    'Harmonic Lenses are the frequency patterns that form around active Energy Nodes of the Crystalline Grid — living crystalline blooms that shape, focus, and redirect vibrational currents, originally feeding souls with Source energy and now reactivating after parasitic inversion.',
  topic_image: 'images/breakdown/harmonic-lenses.webp',
  report: REPORT,
  infographic_image: 'images/breakdown/reclaiming-our-resonant-reality.webp',
  pdf_preview_image: 'images/breakdown/awakening-the-crystalline-grid.webp',
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1SJEAfyc92OPD3Xoo_rSeziI75fpE1rwv/view?usp=sharing',
  rumble_videos: [
    {
      title: 'The Crystalline Grid Beneath Our Feet',
      embed_url: 'https://rumble.com/embed/v7au9ei/?pub=4p0ieu',
      description:
        'The Crystalline Grid Beneath Our Feet — Energy Nodes and Harmonic Lenses as the circulatory and nervous systems of the realm, living light structures, and the return of the original resonant grid.'
    },
    {
      title: 'Breathing Architecture',
      embed_url: 'https://rumble.com/embed/v7au9t4/?pub=4p0ieu',
      description:
        'Breathing Architecture — Harmonic Lenses as crystalline blooms that open and close around nodes, parasitic inversion of the grid, and awakened souls functioning as living lenses to restore Source flow.'
    }
  ]
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...harmonicLenses, is_placeholder: false };
      if (existingSubtopics) topics[i].subtopics = existingSubtopics;
      if (existingQuiz) topics[i].quiz = existingQuiz;
      return true;
    }
    if (topics[i].subtopics && findAndUpdate(topics[i].subtopics)) return true;
  }
  return false;
}

function collectImageFields(topics, out = []) {
  for (const t of topics) {
    for (const key of ['topic_image', 'infographic_image', 'pdf_preview_image']) {
      if (t[key]) out.push({ id: t.id, key, path: t[key] });
    }
    if (t.subtopics) collectImageFields(t.subtopics, out);
  }
  return out;
}

const sourceFile = path.join(ROOT, 'data', 'breakdown-topics.json');
const source = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

const beforeOthers = collectImageFields(source.topics)
  .filter((e) => e.id !== TOPIC_ID)
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();

if (!findAndUpdate(source.topics)) {
  throw new Error(`${TOPIC_ID} topic not found in breakdown-topics.json`);
}

fs.writeFileSync(sourceFile, JSON.stringify(source, null, 2) + '\n', 'utf8');

const topicFile = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const heavy = {
  id: harmonicLenses.id,
  report: harmonicLenses.report,
  infographic_image: harmonicLenses.infographic_image,
  pdf_preview_image: harmonicLenses.pdf_preview_image,
  slide_deck_pdf_url: harmonicLenses.slide_deck_pdf_url,
  rumble_videos: harmonicLenses.rumble_videos
};
// Preserve quiz if present on disk or in source
const existingHeavy = fs.existsSync(topicFile)
  ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
  : {};
const sourceNode = (() => {
  function findNode(topics, id) {
    for (const t of topics) {
      if (t.id === id) return t;
      if (t.subtopics) {
        const found = findNode(t.subtopics, id);
        if (found) return found;
      }
    }
    return null;
  }
  return findNode(source.topics, TOPIC_ID);
})();
if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

// Verify image files exist
for (const rel of [
  harmonicLenses.topic_image,
  harmonicLenses.infographic_image,
  harmonicLenses.pdf_preview_image
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing image file: ${rel}`);
  }
}

// Unique ownership: no other topic may share these image paths
const ours = new Set([
  harmonicLenses.topic_image,
  harmonicLenses.infographic_image,
  harmonicLenses.pdf_preview_image
]);
const collisions = collectImageFields(source.topics).filter(
  (e) => e.id !== TOPIC_ID && ours.has(e.path)
);
if (collisions.length) {
  throw new Error(
    'Image path collision with other topics:\n' +
      collisions.map((c) => `${c.id}.${c.key} = ${c.path}`).join('\n')
  );
}

// Confirm we did not change other topics' image fields
const afterOthers = collectImageFields(source.topics)
  .filter((e) => e.id !== TOPIC_ID)
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();
if (JSON.stringify(beforeOthers) !== JSON.stringify(afterOthers)) {
  throw new Error('Other topics image fields were modified — abort');
}

const node = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
function findNode(topics, id) {
  for (const t of topics) {
    if (t.id === id) return t;
    if (t.subtopics) {
      const found = findNode(t.subtopics, id);
      if (found) return found;
    }
  }
  return null;
}
const updated = findNode(node.topics, TOPIC_ID);
const requiredSections = [
  '## Overview',
  '## Key Terminology',
  '## Core Revelations',
  '## Detailed Mechanics and Key Elements',
  '## Broader Context and Interconnections',
  '## Strategic Implications'
];
const missing = requiredSections.filter((h) => !updated.report.includes(h));
if (missing.length) {
  throw new Error(`Missing report sections: ${missing.join(', ')}`);
}

if (updated.is_placeholder) {
  throw new Error('Topic still marked as placeholder');
}

// JSON parse sanity on heavy file
const heavyParsed = JSON.parse(fs.readFileSync(topicFile, 'utf8'));
if (!heavyParsed.rumble_videos || heavyParsed.rumble_videos.length !== 2) {
  throw new Error('Expected 2 rumble videos');
}
if (!heavyParsed.slide_deck_pdf_url) {
  throw new Error('Missing slide_deck_pdf_url');
}

if (harmonicLenses.report.includes('TODO')) {
  throw new Error('Report still contains TODO');
}

// Ensure kebab-case image paths only
for (const rel of [
  harmonicLenses.topic_image,
  harmonicLenses.infographic_image,
  harmonicLenses.pdf_preview_image
]) {
  const base = path.basename(rel);
  if (base !== base.toLowerCase() || /[_\s]/.test(base)) {
    throw new Error(`Image path not normalized kebab-case: ${rel}`);
  }
}

// Confirm parent chain still has energy-nodes siblings intact
const energyNodes = findNode(node.topics, 'energy-nodes');
if (!energyNodes) {
  throw new Error('Parent energy-nodes not found');
}
const expectedSiblings = ['lava-core-nodes', 'harmonic-lenses', 'celestial-anchors'];
const gotSiblings = (energyNodes.subtopics || []).map((s) => s.id);
for (const id of expectedSiblings) {
  if (!gotSiblings.includes(id)) {
    throw new Error(`Missing sibling/self under energy-nodes: ${id}`);
  }
}

console.log(`Updated ${TOPIC_ID} topic file and breakdown-topics.json`);
console.log(
  'Images verified:',
  [
    harmonicLenses.topic_image,
    harmonicLenses.infographic_image,
    harmonicLenses.pdf_preview_image
  ].join(', ')
);
console.log('PDF:', harmonicLenses.slide_deck_pdf_url);
console.log(
  'Videos:',
  harmonicLenses.rumble_videos.map((v) => v.title).join(' | ')
);
console.log('Siblings under energy-nodes:', gotSiblings.join(', '));
console.log('is_placeholder: false (report has no TODO)');
console.log('Other topics image fields unchanged: ok');
