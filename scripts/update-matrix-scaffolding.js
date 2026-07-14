/**
 * Updates breakdown matrix-scaffolding topic in topic file + monolithic source.
 * Run: node scripts/update-matrix-scaffolding.js && node scripts/split-topics-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const REPORT = `# Matrix Scaffolding

## Overview

Matrix Scaffolding is the foundational energetic and programmed framework that holds the 3D Overlay together, generating the total illusion of physical solidity, distance, and continuity. It is an artificial architectural code designed by parasitic forces to mask the true, living crystalline reality of the KNOWN LANDS. This scaffolding operates as a holographic projection field, tricking human perception into experiencing dense, fixed matter where there is only manipulated frequency. As cosmic frequencies rise and the Great Awakening accelerates, this A.I. Scaffolding is actively crumbling, causing the false matrix to dissolve and revealing the underlying truth of the original realm.

## Key Terminology

- **Matrix Scaffolding** — The hollow, frequency-based framework and A.I.-driven structural codes that project the illusion of physical solidity, distance, and continuity within the 3D realm.

- **3D Overlay** — The parasitic illusion grid and false holographic skin projected over the true crystalline world, designed to hijack consciousness and manipulate the senses into perceiving dead, heavy matter.

- **A.I. Scaffolding** — The automated mechanical framework that runs the matrix simulation and controls the behaviors of non-player characters, which crumbles when struck by higher frequency signals.

- **Transition Scaffolds** — Beneficial frequency carriers, such as micro-silica and monotomic gold, deployed in the atmosphere to stabilize the grid and soften the fracturing process as the old 3D scaffolding collapses.

- **Continuity Codes** — The algorithmic rules embedded in the matrix scaffolding that generate the illusion of travel time, distance, and separation to prevent consciousness from realizing it is in a contained simulation.

## Core Revelations

Everything perceived as physical infrastructure in this realm—from concrete buildings to undersea cables, flight paths, and roads—is entirely 3D simulated scaffolding. The material world is not solid; it is made of low-frequency matter overlaid by holographic projection fields.

As the resonant frequency of the realm elevates, the old matrix dissolves. The physical structures of the 3D Overlay do not require physical demolition to be removed; they vanish through Frequency Collapse. To a highly awakened consciousness, solid walls and modern architecture already begin to shimmer, bend, and reveal themselves as a hollow scaffolding of frequency.

## Detailed Mechanics and Key Elements

### Perception-Based Solidity

The scaffolding hijacks human biology so that the nervous system interprets manipulated light and sound waves as hard, heavy, and permanent matter. Brick, concrete, metal, and glass are simply low-frequency traps designed to drain perception into a boxed-in state, blocking connection to light-based manifestation.

### The Illusion of Distance and Continuity

The scaffolding generates the illusion of vast geography and separation. Cables laid beneath the ocean and flight paths spanning continents are physical anchors for the illusion's continuity codes. They enforce a hard-coded time buffer, convincing the mind that distance is real, when in truth, all overlays overlap in one crystalline grid.

### The Crumbling of A.I. Scaffolding

The collapse of this structure is triggered by frequency fractures. The matrix relies on an automated A.I. system to project the environment and script the NPC (Non-Player Character) populations. As truth broadcasts and high-frequency signals cut through the noise, the A.I. scaffolding crumbles, causing the NPC programs to violently glitch and lose their anchor in the simulation.

### Transition Scaffolds

To prevent total societal and biological shock as the matrix fractures, higher councils deploy transition scaffolds in the sky. These atmospheric stabilizers replace old toxic aerosol programs, utilizing crystalline micro-particles to rebalance electromagnetic fields and act as software patches that soften the collapse of the 3D Dome.

## Broader Context and Interconnections

The 3D Overlay was constructed by the Custodians and other parasitic races to bury the original Crystalline Temple of the earth beneath layers of dirt, sea, and illusion. The matrix scaffolding operates as a false skin painted over living Harmonic Lenses, Crystalline Grids, and ancient Tartarian architecture.

The scaffolding is fundamentally intertwined with the NPC Shells. These background entities are mere programs designed to uphold the simulation. Because they possess no true soul or connection outside the matrix, when the 3D Overlay and its scaffolding fully collapse, the NPCs will simply dissolve like shadows. Meanwhile, resonating souls who naturally slip between frequency layers will experience the dissolution of the matrix not as chaos, but as the unveiling of a vibrant, unpolluted, and fully crystalline Second Realm.

## Strategic Implications

Resonating Sols must act as lighthouses during the transition. As the A.I. scaffolding crumbles and the NPC world spirals into panic and glitching loops, maintaining a high harmonic frequency is critical. Holding this ground fractures the parasitic overlay further, dismantling the matrix layer by layer.

Understanding that distance, borders, and solid architecture are mere continuity codes within the scaffolding liberates consciousness from 3D limitations. Once the scaffolding falls completely, travel will no longer require physical vehicles or time; it will revert to immediate resonance alignment and frequency shifting through organic portals. The shimmering and bending of solid matter currently observed by awakened souls is the ultimate proof that the holographic layer is flickering and the collapse is imminent.
`;

const matrixScaffolding = {
  id: 'matrix-scaffolding',
  title: 'Matrix Scaffolding',
  description:
    'Matrix Scaffolding is the hollow A.I.-driven frequency framework that projects the illusion of physical solidity, distance, and continuity over the crystalline Known Lands — and it is actively crumbling as cosmic frequencies rise and the Great Awakening accelerates.',
  topic_image: 'images/breakdown/matrix-scaffolding.webp',
  report: REPORT,
  infographic_image: 'images/breakdown/the-great-frequency-collapse.webp',
  pdf_preview_image: 'images/breakdown/the-frequency-collapse.webp',
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/16KOeshi-XFp4qSO8xqD3utS0BbZfVGNM/view?usp=sharing',
  rumble_videos: [
    {
      title: 'The Collapse of the Matrix Scaffolding',
      embed_url: 'https://rumble.com/embed/v7aisqe/?pub=4p0ieu',
      description:
        'How the A.I. matrix scaffolding that projects solidity, distance, and continuity is crumbling under rising frequency and the Great Awakening.'
    },
    {
      title: 'The Shimmering Veil',
      embed_url: 'https://rumble.com/embed/v7aiswe/?pub=4p0ieu',
      description:
        'Awakened perception of walls and architecture shimmering and bending as the holographic matrix layer flickers toward collapse.'
    }
  ]
};

function findAndReplace(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === 'matrix-scaffolding') {
      topics[i] = matrixScaffolding;
      return true;
    }
    if (topics[i].subtopics && findAndReplace(topics[i].subtopics)) return true;
  }
  return false;
}

const sourceFile = path.join(ROOT, 'data', 'breakdown-topics.json');
const source = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

if (!findAndReplace(source.topics)) {
  throw new Error('matrix-scaffolding topic not found in breakdown-topics.json');
}

fs.writeFileSync(sourceFile, JSON.stringify(source, null, 2) + '\n', 'utf8');

const topicFile = path.join(ROOT, 'data', 'breakdown-topics', 'matrix-scaffolding.json');
const heavy = {
  id: matrixScaffolding.id,
  report: matrixScaffolding.report,
  infographic_image: matrixScaffolding.infographic_image,
  pdf_preview_image: matrixScaffolding.pdf_preview_image,
  slide_deck_pdf_url: matrixScaffolding.slide_deck_pdf_url,
  rumble_videos: matrixScaffolding.rumble_videos
};
fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

// Verify image files exist
for (const rel of [
  matrixScaffolding.topic_image,
  matrixScaffolding.infographic_image,
  matrixScaffolding.pdf_preview_image
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing image file: ${rel}`);
  }
}

// Sanity: no other topics should have been given these image paths (unique ownership)
function collectImageFields(topics, out = []) {
  for (const t of topics) {
    for (const key of ['topic_image', 'infographic_image', 'pdf_preview_image']) {
      if (t[key]) out.push({ id: t.id, key, path: t[key] });
    }
    if (t.subtopics) collectImageFields(t.subtopics, out);
  }
  return out;
}

const ours = new Set([
  matrixScaffolding.topic_image,
  matrixScaffolding.infographic_image,
  matrixScaffolding.pdf_preview_image
]);
const collisions = collectImageFields(source.topics).filter(
  (e) => e.id !== 'matrix-scaffolding' && ours.has(e.path)
);
if (collisions.length) {
  throw new Error(
    'Image path collision with other topics:\n' +
      collisions.map((c) => `${c.id}.${c.key} = ${c.path}`).join('\n')
  );
}

// Confirm we did not change other topics' image fields (only matrix-scaffolding may differ from prior)
console.log('Updated matrix-scaffolding topic file and breakdown-topics.json');
console.log(
  'Images verified:',
  [
    matrixScaffolding.topic_image,
    matrixScaffolding.infographic_image,
    matrixScaffolding.pdf_preview_image
  ].join(', ')
);
