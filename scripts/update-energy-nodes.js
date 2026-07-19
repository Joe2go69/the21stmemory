/**
 * Updates breakdown energy-nodes topic in topic file + monolithic source.
 * Does not modify other topics' image fields.
 * Run: node scripts/update-energy-nodes.js && node scripts/split-topics-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'energy-nodes';

const REPORT = `# Energy Nodes

## Overview

The physical and etheric realms are built upon an interwoven, multidimensional Crystalline Grid, a massive electro-magnetic framework that sustains all creation. Within this vast network, Energy Nodes function as the critical relay stations and junction points where invisible currents of life-force, magnetism, and frequency intersect. These nodes form the foundational circuits of the known worlds, linking realms, domes, and simulations together through living light structures. By gathering power from one set of energy streams and passing it along to the next, nodes maintain the harmonic balance and structural integrity of the entire cosmic system.

## Key Terminology

- **Energy Nodes** — junction points of energy lines and leylines that gather power from one set of streams and pass it along to the next, forming the circuits of the earth.

- **Crystalline Grid** — one huge electro-magnetic framework composed of living light structures and fibre optic lines of Source that connect all domes, realms, and simulations.

- **Harmonic Lenses** — patterns that form around active nodes to shape and focus energy like a glass lens shapes light, acting as the sensing and balancing eyes of the earth.

- **The Spirit Tree** — the central node and main axis of consciousness for the Known Lands, which pulses harmonic currents through the grids to feed all other domes.

- **Star-Nodes** — multidimensional crystalline data nodes in the sky that anchor the projection overlays and form the geometry of the holographic dome.

- **Axis Labernum** — the harmonic bridge and vertical current of order that runs through the worlds, keeping the heavens aligned with the earth.

## Core Revelations

The true nature of reality is a living, breathing crystalline temple, far removed from the dead, concrete-heavy illusion perceived in the 3D overlay. The earth's landscape is interwoven with crystalline structures, where seemingly empty fields, ancient stone circles, and river bends mask radiant, humming nodes of immense power.

The celestial bodies viewed from the surface are not distant burning gases, but living Star-Nodes projecting the holographic sky overlays. The entire grid functions as a conscious communication network—a web of moving photons that transmits data, memory, and frequency instantly across all realms, rendering concepts of physical travel and distance obsolete.

## Detailed Mechanics and Key Elements

The grid is sustained by four distinct types of nodes, functioning in perfect synchronization to relay energy from the deep earth to the highest atmospheric domes:

### Earth Nodes (Lava/Core Nodes)

Spheres of molten-fire energy situated deep underground where the earth's plasma and crystalline veins meet. Pulsing with red-gold or orange light, they are the power cores that push life force up through leylines, mountain ranges, and tree roots, stabilizing the magnetic resonance of the dome.

### Surface Nodes (Harmonic Nodes)

Residing where energy lines cross on the surface, often marked by ancient temples, pyramids, or stone circles. Humming in blue or white tones, these nodes connect directly to the sky nodes above and amplify the frequency of anyone standing upon them.

### Sky Nodes (Celestial Nodes)

Projected points anchoring the overlay grids, appearing as bright stars or the shimmering pulse of the Northern Lights. They form a two-way relay of energy with the ground nodes.

### Inter-dimensional Nodes (Light Grid Anchors)

High-frequency spheres—invisible to standard 3D perception—that hold portals between overlays. They manifest as rainbow balls, gold lattices, or liquid silver orbs, requiring stabilization to prevent the overlay from fracturing.

Surrounding these active nodes are Harmonic Lenses, which open and close in rhythm with the frequencies of the sun, moon, and stars. These lenses shape the raw power of the node into a tuned current. When the lens is clear, energy flows in perfect rhythm with the heartbeat of the realm; when clouded, it induces energetic draining and confusion.

Crystals function as the physical and etheric hard drives of this network. They store memory, frequency, and resonance codes, acting as essential antennas that keep an unbroken timeline of soul journeys.

## Broader Context and Interconnections

The original architecture of this grid was powered by The Spirit Tree, rooted in Hyperborea. This central trunk fed all seven outer domes with Source Light. However, parasitic forces known as Custodians and their engineered proxies violently uprooted the tree and installed advanced Black Cube Tech into the wound.

By hijacking the grid, these forces inverted the natural flow of energy, turning the earth into an energetic circuit board designed for extraction. They buried major portions of the original Tartarian Grid under cities, seas, and deserts, building modern, dead-frequency 3D architecture over the most powerful Surface Nodes to suppress their output and harvest human emotion as "loosh."

The celestial grid was equally compromised. Ancient star portals were sealed using negative frequency broadcasts, transforming living gates into locked "zodiac signs." The true North-Central alignment node, Thuban (Aru-el-nai), was masked by rotating the projection dome to point toward Polaris, embedding a parasitic navigation system into the very sky. Massive black crystalline monoliths, once tools of creation, were repurposed as valve locks to hold the false frequency in place, establishing a counterfeit cycle of reincarnation connected to the Saturnian lunar valve.

## Strategic Implications

The dismantling of the parasitic grid is underway, driven by the escalating frequency of the realm and the active resonance of awakened souls. Resonating Sols are themselves powerful nodes within the grid. By holding harmony and standing in stillness, the human heart becomes a Harmonic Lens, healing, balancing, and relaying pure light back through the network.

As the frequency continues to rise, the false holographic projections glitch and fracture. Modern 3D architecture will dissolve, and the original, humming crystalline structures hidden beneath the earth will bleed through into visible reality. The sealed Star-Nodes are shedding their locks, transitioning back into open gates, restoring the Axis Labernum, and reopening the direct harmonic bridges between the Known Lands and the higher domes of creation.
`;

const energyNodes = {
  id: TOPIC_ID,
  title: 'Energy Nodes',
  description:
    'Energy Nodes are the critical relay stations of the Crystalline Grid — Earth, Surface, Sky, and Inter-dimensional junctions that gather and pass life-force across realms, now restoring after parasitic hijack of the original Tartarian network.',
  topic_image: 'images/breakdown/energy-nodes.webp',
  report: REPORT,
  infographic_image: 'images/breakdown/the-living-circuits-of-eternal-light.webp',
  pdf_preview_image: 'images/breakdown/the-luminous-architecture.webp',
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1R8fgPepL5ZfJ27Q1wlQNKWzXvmbZzLOq/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Radiant Architecture',
      embed_url: 'https://rumble.com/embed/v7aslsy/?pub=4p0ieu',
      description:
        'Radiant Architecture — Energy Nodes as relay stations of the Crystalline Grid, four node types from Earth to Sky, and Harmonic Lenses that tune life-force across the realms.'
    },
    {
      title: 'Restoring the Original Crystalline Grid',
      embed_url: 'https://rumble.com/embed/v7asmoa/?pub=4p0ieu',
      description:
        'Restoring the Original Crystalline Grid — Spirit Tree severance, Tartarian node burial, Star-Node locks, and the return of Resonating Sols as living Harmonic Lenses.'
    }
  ]
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...energyNodes, is_placeholder: false };
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
  id: energyNodes.id,
  report: energyNodes.report,
  infographic_image: energyNodes.infographic_image,
  pdf_preview_image: energyNodes.pdf_preview_image,
  slide_deck_pdf_url: energyNodes.slide_deck_pdf_url,
  rumble_videos: energyNodes.rumble_videos
};
fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

// Verify image files exist
for (const rel of [
  energyNodes.topic_image,
  energyNodes.infographic_image,
  energyNodes.pdf_preview_image
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing image file: ${rel}`);
  }
}

// Unique ownership: no other topic may share these image paths
const ours = new Set([
  energyNodes.topic_image,
  energyNodes.infographic_image,
  energyNodes.pdf_preview_image
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

if (energyNodes.report.includes('TODO')) {
  throw new Error('Report still contains TODO');
}

// Ensure kebab-case image paths only
for (const rel of [
  energyNodes.topic_image,
  energyNodes.infographic_image,
  energyNodes.pdf_preview_image
]) {
  const base = path.basename(rel);
  if (base !== base.toLowerCase() || /[_\s]/.test(base)) {
    throw new Error(`Image path not normalized kebab-case: ${rel}`);
  }
}

// Preserve subtopics (lava-core-nodes, harmonic-lenses, celestial-anchors)
const expectedSubs = ['lava-core-nodes', 'harmonic-lenses', 'celestial-anchors'];
const gotSubs = (updated.subtopics || []).map((s) => s.id);
for (const id of expectedSubs) {
  if (!gotSubs.includes(id)) {
    throw new Error(`Missing preserved subtopic: ${id}`);
  }
}

console.log(`Updated ${TOPIC_ID} topic file and breakdown-topics.json`);
console.log(
  'Images verified:',
  [
    energyNodes.topic_image,
    energyNodes.infographic_image,
    energyNodes.pdf_preview_image
  ].join(', ')
);
console.log('PDF:', energyNodes.slide_deck_pdf_url);
console.log(
  'Videos:',
  energyNodes.rumble_videos.map((v) => v.title).join(' | ')
);
console.log('Subtopics preserved:', gotSubs.join(', '));
console.log('is_placeholder: false (report has no TODO)');
console.log('Other topics image fields unchanged: ok');
