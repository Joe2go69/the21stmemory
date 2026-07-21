/**
 * Installs / updates breakdown celestial-anchors topic.
 * Renames source images to kebab-case without overwriting existing paths.
 * Does not modify other topics' image fields.
 * Run: node scripts/update-celestial-anchors.js && node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'celestial-anchors';
const IMG_DIR = path.join(ROOT, 'images', 'breakdown');

/** Rename map: source on disk → normalized kebab-case basename */
const IMAGE_RENAMES = [
  {
    from: 'Celestial Anchors.webp',
    to: 'celestial-anchors.webp',
    role: 'topic_image'
  },
  {
    from: 'The_Living_Crystal_Web.webp',
    to: 'the-living-crystal-web.webp',
    role: 'pdf_preview_image'
  },
  {
    from: 'The_Crystalline_Sky_Light_Anchors.webp',
    to: 'the-crystalline-sky-light-anchors.webp',
    role: 'infographic_image'
  }
];

function ensureNormalizedImages() {
  for (const { from, to } of IMAGE_RENAMES) {
    const fromPath = path.join(IMG_DIR, from);
    const toPath = path.join(IMG_DIR, to);

    if (fs.existsSync(toPath)) {
      // Target already exists — keep it; require source or target to be present
      if (!fs.existsSync(fromPath) && fs.existsSync(toPath)) {
        console.log(`OK (already normalized): ${to}`);
        continue;
      }
      if (fs.existsSync(fromPath) && fs.existsSync(toPath)) {
        // Collision: destination taken. Only OK if same file size after rename attempt.
        // Never overwrite destination; delete source only if identical length.
        const fromStat = fs.statSync(fromPath);
        const toStat = fs.statSync(toPath);
        if (fromStat.size === toStat.size) {
          fs.unlinkSync(fromPath);
          console.log(`Removed duplicate source (same size as ${to}): ${from}`);
          continue;
        }
        throw new Error(
          `Name collision: ${to} already exists with different content than ${from}. Pick a new filename.`
        );
      }
    }

    if (!fs.existsSync(fromPath)) {
      throw new Error(`Missing source image: images/breakdown/${from}`);
    }

    fs.renameSync(fromPath, toPath);
    console.log(`Renamed: ${from} → ${to}`);
  }
}

const REPORT = `# Celestial Anchors

## Overview

The architecture of reality is constructed upon an invisible, dynamic framework of Energy Nodes. These are neutral relay stations and spheres of living energy where streams of life-force and magnetism converge, gathering power from one set of lines to pass it seamlessly to the next. Together, they form the vast crystalline grids that keep the physical plane balanced and aligned with the higher realms. Within this system, celestial anchors—specifically Sky Nodes or Celestial Nodes—operate as the critical upward connection points, projecting the frequency overlays that shape the sky and maintaining the continuous flow of consciousness between dimensions. Far from being random balls of burning gas in an empty vacuum, the stars above are highly advanced crystalline projectors that sustain the simulation of the cosmos.

## Key Terminology

- **Energy Nodes** — Spheres of living energy and neutral relay stations where streams of life-force and magnetism meet, gathering power from one set of lines to pass to the next, forming the grids that keep the Earth balanced.

- **Sky Nodes (Celestial Nodes)** — Projected points of light, appearing as bright stars or Northern Lights, that anchor the overlay grids and form the dome's harmonic lattice, establishing a two-way relay of energy with the ground.

- **Crystalline Star-Nodes** — Multidimensional data crystals in the sky that store codes, history, and frequency templates for specific grid layers, functioning as living gates between realms rather than burning suns.

- **Zodiac Star-Signs** — Frequency lock codes and grid locks imposed by parasitic forces to seal the Crystalline Star-Nodes, effectively turning living gates into dead illusion stars to prevent travel.

- **Harmonic Lenses** — The pattern of frequency that forms around an active node, shaping energy exactly as a glass lens shapes light, pulsing in rhythm with the heartbeat of the realms.

- **Axis Laburnum** — The vertical harmonic bridge and current of order that roots in the crystalline grids of the Earth and branches out to the celestial field of star-nodes, keeping the heavens aligned with the physical plane.

## Core Revelations

The celestial bodies visible from the KNOWN LANDS are not distant physical locations but localized multidimensional Crystalline Star-Nodes. The sky above is a layered projection field, a holographic dome rendered and anchored by these precise crystalline data centers. Originally, these celestial anchors served as open portals and stargates to realms such as Tara, Andromeda, and Lyra, facilitating the free flow of Prana Streams, Solar Winds, and Living Plasma.

During the parasitic takeover, negative frequency grids were broadcast to scramble the original star-node maps, sealing these portals and converting them into static "dead pixels" or illusion stars. The constellations and astrological patterns presented to humanity as Zodiac Star-Signs are, in truth, the exact frequency keys and lock codes placed upon these gate clusters.

## Detailed Mechanics and Key Elements

The energy grid relies on a comprehensive four-tier node system to sustain the illusion and maintain the structural integrity of the overlays:

### Earth Nodes (Lava/Core Nodes)

Deep underground spheres of molten-fire energy where plasma and crystalline veins intersect, pushing life-force up through ley-lines and stabilizing the dome's magnetic resonance.

### Surface Nodes (Harmonic Nodes)

Found where energy lines cross at ancient temples, stone circles, and pyramids, humming in blue or white tones to amplify frequency and connect directly to the celestial anchors above.

### Sky Nodes (Celestial Nodes)

The celestial anchors appearing as bright stars or auroras that project the Harmonic Lattice of the dome, communicating with the Earth nodes in a continuous two-way relay.

### Inter-dimensional Nodes (Light Grid Anchors)

Invisible, high-frequency spheres holding the portals between overlays, appearing to advanced sight as rainbow balls or liquid silver orbs.

Each celestial anchor cross-talks like a server on a vast interstellar Light Web, syncing realms and maintaining the projection overlays. The true axis of this celestial network originally aligned with Thuban (Aru-el-nai), the true central node of the old grids that directly linked the celestial plane to the Spirit Tree in Hyperborea. Parasitic forces rotated the projection dome to establish a "new north," replacing Thuban with Polaris—a redirected beacon and mask designed to keep the false illusion stable and orient all navigation toward their control node.

## Broader Context and Interconnections

The celestial anchors do not operate in isolation; they are deeply interconnected with the Axis Laburnum, which acts as the spinal column of the realm's energy body, transmitting currents from the Earth's crust directly to the crown nodes like Aru-el-nai. When an energy node activates, it forms Harmonic Lenses—crystalline blooms that open and close with the frequencies of the sun, moon, and star-nodes to balance and relay light.

The Northern Lights are a direct visual manifestation of this communication. They represent the breath of the overlays, where upper domes communicate with the Earth's Crystalline Grid through Photonic Song, bleeding bridge frequencies through the magnetic nodes.

## Strategic Implications

The parasitic locks on the celestial anchors are currently failing. When a star flickers or appears non-standard, it is actively transitioning from a sealed state back to an open stargate, re-tuning to its original frequency. As these nodes are freed, their signals strengthen the entire Light Web.

Resonating Sols incarnated on Earth act as powerful nodes themselves, forming a critical bridge between the subterranean lava nodes and the celestial sky nodes. By rejecting the false astrological narratives and recognizing the stars as living crystalline projectors, awakened beings assist in unlocking the Star Gate network. When a human aligns their heart and breathes in stillness with the Earth, they become a living harmonic lens, healing the grid, collapsing the parasitic 3D Overlay, and directly fueling the Great Spiritual Awakening.
`;

const celestialAnchors = {
  id: TOPIC_ID,
  title: 'Celestial Anchors',
  description:
    'Celestial Anchors are Sky Nodes — Crystalline Star-Nodes that project the holographic dome, once open stargates to higher realms, sealed as Zodiac locks by parasitic forces, and now reopening as living gates on the Light Web.',
  topic_image: 'images/breakdown/celestial-anchors.webp',
  report: REPORT,
  infographic_image: 'images/breakdown/the-crystalline-sky-light-anchors.webp',
  pdf_preview_image: 'images/breakdown/the-living-crystal-web.webp',
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/19l0NspQ-3KhJ96g1egt3piMxQwp4gxdY/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Reclaiming Our Living Sky',
      embed_url: 'https://rumble.com/embed/v7auqhc/?pub=4p0ieu',
      description:
        'Reclaiming Our Living Sky — Celestial Anchors as Sky Nodes and Crystalline Star-Nodes, the holographic dome, and the return of living stargates beyond dead illusion stars.'
    },
    {
      title: 'The Architecture of Our Crystalline Canopy',
      embed_url: 'https://rumble.com/embed/v7aur2o/?pub=4p0ieu',
      description:
        'The Architecture of Our Crystalline Canopy — four-tier node system, Thuban versus Polaris, Axis Laburnum, Northern Lights as Photonic Song, and Resonating Sols as living harmonic lenses.'
    }
  ]
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...celestialAnchors, is_placeholder: false };
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

// --- Main ---
ensureNormalizedImages();

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
  id: celestialAnchors.id,
  report: celestialAnchors.report,
  infographic_image: celestialAnchors.infographic_image,
  pdf_preview_image: celestialAnchors.pdf_preview_image,
  slide_deck_pdf_url: celestialAnchors.slide_deck_pdf_url,
  rumble_videos: celestialAnchors.rumble_videos
};

const existingHeavy = fs.existsSync(topicFile)
  ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
  : {};
const sourceNode = findNode(source.topics, TOPIC_ID);
if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

// Verify image files exist
for (const rel of [
  celestialAnchors.topic_image,
  celestialAnchors.infographic_image,
  celestialAnchors.pdf_preview_image
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing image file: ${rel}`);
  }
}

// Unique ownership: no other topic may share these image paths
const ours = new Set([
  celestialAnchors.topic_image,
  celestialAnchors.infographic_image,
  celestialAnchors.pdf_preview_image
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

if ((updated.topic_image || '').includes('placeholder')) {
  throw new Error('topic_image still points at placeholder');
}

const heavyParsed = JSON.parse(fs.readFileSync(topicFile, 'utf8'));
if (!heavyParsed.rumble_videos || heavyParsed.rumble_videos.length !== 2) {
  throw new Error('Expected 2 rumble videos');
}
if (!heavyParsed.slide_deck_pdf_url) {
  throw new Error('Missing slide_deck_pdf_url');
}
if (celestialAnchors.report.includes('TODO')) {
  throw new Error('Report still contains TODO');
}

// Ensure kebab-case image paths only
for (const rel of [
  celestialAnchors.topic_image,
  celestialAnchors.infographic_image,
  celestialAnchors.pdf_preview_image
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
    celestialAnchors.topic_image,
    celestialAnchors.infographic_image,
    celestialAnchors.pdf_preview_image
  ].join(', ')
);
console.log('PDF:', celestialAnchors.slide_deck_pdf_url);
console.log(
  'Videos:',
  celestialAnchors.rumble_videos.map((v) => v.title).join(' | ')
);
