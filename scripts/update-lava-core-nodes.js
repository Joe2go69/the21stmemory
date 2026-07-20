/**
 * Updates breakdown lava-core-nodes topic in topic file + monolithic source.
 * Does not modify other topics' image fields.
 * Run: node scripts/update-lava-core-nodes.js && node scripts/split-topics-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'lava-core-nodes';

const REPORT = `# Lava Core Nodes

## Overview

Beneath the surface of the realm exists a vast, interconnected Crystalline Web, a grid of invisible currents carrying life-force and magnetism. Where these powerful streams intersect, the energy curls into a concentrated sphere known as a Node. At the very foundation of this planetary circuitry are the Earth Nodes, also identified as Lava/Core Nodes. These deep-subterranean power cores act as the fiery heart of the world, pushing vital energy upward to sustain the entire physical and energetic infrastructure of the realm.

## Key Terminology

- **Node** — A sphere of living energy that acts as a neutral relay station, gathering power from one set of invisible currents and passing it along to the next to form the balancing grids of the earth.

- **Earth Nodes (Lava/Core Nodes)** — The deep-underground power cores of the earth, pulsing with red-gold or orange light like molten fire, located where the earth's plasma and crystalline veins meet.

- **Harmonic Lenses** — A pattern of frequency that forms around an active node, shaping the living energy just as a glass lens shapes light, ensuring it flows in perfect rhythm with the realm's heartbeat.

- **Crystalline Web** — The great grid of interconnected nodes and energy lines that surrounds and balances the earth, functioning much like the circuits in a heart or brain.

- **Ley-lines** — Streams of life-force and magnetism through which the power of the core nodes is pushed up into mountains, rivers, and tree-roots.

## Core Revelations

The reality of this realm is sustained by a continuous flow of power managed by a sophisticated network of living energy spheres. The Lava/Core Nodes are the foundational engines of this system, serving as the raw, fiery base that powers all other nodes within the dome. Without this molten-fire foundation, the upper grids and harmonic relays would lack the vital force necessary to maintain the structural integrity and magnetic resonance of the environment.

## Detailed Mechanics and Key Elements

The world operates through four distinct types of nodes, functioning together as a unified system. The Earth Nodes (Lava/Core Nodes) sit deep underground, right at the intersection where the earth's plasma merges with its crystalline veins. They pulse with a radiant red-gold or orange light, emitting a molten-fire energy that acts as the planetary power core.

From these deep locations, the Lava/Core Nodes actively push life force upward, directing it through ley-lines into the physical topography of the world, including mountains, rivers, and tree-roots. They are directly responsible for feeding the upper grid and providing the necessary power to stabilize the magnetic resonance of the entire dome.

The complete node architecture consists of:

### Earth Nodes (Lava/Core Nodes)

The fiery foundation and power core.

### Surface Nodes (Harmonic Nodes)

Blue or white crystalline humming spheres where energy lines cross, often marked by ancient temples, stone circles, or pyramids.

### Sky Nodes (Celestial Nodes)

Projected points anchoring the overlay grids in the sky, creating a two-way relay of energy with the earth nodes.

### Inter-dimensional Nodes (Light Grid Anchors)

Invisible, high-frequency spheres holding the portals between different overlays.

## Broader Context and Interconnections

The Lava/Core Nodes do not operate in isolation; they are the "fiery heart below" that supports the "crystalline mind above" and the "harmonic spirit in-between". The energy they generate is pushed up to the Surface Nodes, where it is shaped and refined by Harmonic Lenses. When these lenses are clear and tuned, the energy flows in perfect rhythm, making the air feel lighter and thoughts become calm. The Lava/Core Nodes provide the raw transmission power that allows the Surface Nodes to communicate directly with the Sky Nodes above, forming a seamless, two-way relay between the ground, the sky, and the soul.

## Strategic Implications

Understanding the function of the Lava/Core Nodes is critical for interacting with the true architecture of the realm. Because these core nodes feed the upper grid, any blockage or distortion in the Harmonic Lenses causes the current to stumble, creating a heavy imbalance. Awakened beings hold the capacity to act as living lenses; by standing in stillness and breathing in harmony with the earth, they can clear these blockages. This conscious alignment heals and relays light back through the web, ensuring the molten power of the Lava/Core Nodes flows perfectly through the Crystalline Web to restore the true harmony of the realm.
`;

const lavaCoreNodes = {
  id: TOPIC_ID,
  title: 'Lava Core Nodes',
  description:
    'Lava/Core Nodes are the deep-subterranean Earth Nodes of the Crystalline Web — molten-fire power cores at the plasma–crystalline junction that push life-force through ley-lines to feed the upper grid, stabilize magnetic resonance, and sustain the realm\'s planetary circuitry.',
  topic_image: 'images/breakdown/lava-core-nodes.webp',
  report: REPORT,
  infographic_image: 'images/breakdown/lava-core-world-engine-infographic.webp',
  pdf_preview_image: 'images/breakdown/the-crystalline-web.webp',
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1ZwebmRhTrIL8xLsV6HhltOtWam_QNuNz/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Balancing the earth as a living lens',
      embed_url: 'https://rumble.com/embed/v7at6js/?pub=4p0ieu',
      description:
        'Balancing the earth as a living lens — Lava/Core Nodes as the fiery foundation of the Crystalline Web, ley-line transmission upward, and awakened beings as living Harmonic Lenses.'
    },
    {
      title: 'The Molten Heartbeat',
      embed_url: 'https://rumble.com/embed/v7at770/?pub=4p0ieu',
      description:
        'The Molten Heartbeat — Earth Nodes pulsing red-gold at the plasma–crystalline junction, feeding Surface and Sky Nodes, and restoring magnetic resonance through the planetary node architecture.'
    }
  ]
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...lavaCoreNodes, is_placeholder: false };
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
  id: lavaCoreNodes.id,
  report: lavaCoreNodes.report,
  infographic_image: lavaCoreNodes.infographic_image,
  pdf_preview_image: lavaCoreNodes.pdf_preview_image,
  slide_deck_pdf_url: lavaCoreNodes.slide_deck_pdf_url,
  rumble_videos: lavaCoreNodes.rumble_videos
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
  lavaCoreNodes.topic_image,
  lavaCoreNodes.infographic_image,
  lavaCoreNodes.pdf_preview_image
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing image file: ${rel}`);
  }
}

// Unique ownership: no other topic may share these image paths
const ours = new Set([
  lavaCoreNodes.topic_image,
  lavaCoreNodes.infographic_image,
  lavaCoreNodes.pdf_preview_image
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

if (lavaCoreNodes.report.includes('TODO')) {
  throw new Error('Report still contains TODO');
}

// Ensure kebab-case image paths only
for (const rel of [
  lavaCoreNodes.topic_image,
  lavaCoreNodes.infographic_image,
  lavaCoreNodes.pdf_preview_image
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
    lavaCoreNodes.topic_image,
    lavaCoreNodes.infographic_image,
    lavaCoreNodes.pdf_preview_image
  ].join(', ')
);
console.log('PDF:', lavaCoreNodes.slide_deck_pdf_url);
console.log(
  'Videos:',
  lavaCoreNodes.rumble_videos.map((v) => v.title).join(' | ')
);
console.log('Siblings under energy-nodes:', gotSiblings.join(', '));
console.log('is_placeholder: false (report has no TODO)');
console.log('Other topics image fields unchanged: ok');
