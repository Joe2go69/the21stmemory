/**
 * Updates breakdown layered-simulations topic in topic file + monolithic source.
 * Does not modify other topics' image fields.
 * Run: node scripts/update-layered-simulations.js && node scripts/split-topics-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'layered-simulations';

const REPORT = `# Layered Simulations

## Overview

The architecture of existence is built upon a massive crystalline structure known as The CUBE, housing thousands of Layered Simulations and Overlays. Geography is an illusion; physical distance does not actually exist. Movement across this realm is achieved entirely through frequency shifting between interwoven layers that vibrate at different frequencies.

## Key Terminology

- **The CUBE** — One huge massive crystalline electromagnetic framework that acts as the core hard drive containing all domes, inner earths, and simulations.

- **Layered Simulations** — Interwoven layers of frequency fields that sit on top of each other like stacked transparent sheets, forming what is falsely perceived as distant lands and oceans.

- **The Great Dome** — A physical training ground containing 178 physical worlds, functioning as a frequency amplifier echoing solid creation upward into higher realms.

- **Dome of Forgotten Gods** — The original creator dome and memory storage unit vault that wraps above and below The Great Dome, acting as the root tone of all creation.

- **Overlays** — False skins or holographical projections used by parasitic forces to manipulate perception, making dead 3D material look and feel solid.

- **Phasing Corridors** — Frequency tunnels where travelers shift perception from one overlay to another without traversing actual physical distance.

- **Spirit Tree** — The central axis of consciousness and root node for the realms, which pulses harmonic currents through crystalline grids to feed all domes.

## Core Revelations

All geography, including lands, continents, skies, and seas, is a perceptual overlay within a contained simulation.

Distance and travel are optical illusions designed to enforce separation and the concept of nations. Moving across the world is actually shifting frequencies between interconnected simulation cells.

The CUBE system consists of eight distinct primary Domes layered atop one another, all pulsing with electromagnetic harmonic waves to keep the worlds distinct yet linked.

## Detailed Mechanics and Key Elements

The containment system holds eight primary structures: the Dome of Forgotten Gods, Dome of Sheol, Dome of Hiva, Dome of Portals, Dome of Silence, Dome of 5 Peaks, Dome of Titans, and The Great Dome. The Great Dome holds the 178 physical worlds, which appear to sleepers as scattered planets but are actually interwoven layers vibrating at slightly different frequencies.

What scholars map as flat or spherical planets are perception overlays projecting only what the human filter is allowed to process. Countries are not fixed land masses, but simulation cells stacked like layers of glass.

When individuals travel via airplane or ship, they are not moving across miles of physical space. Instead, their vessel slips into a portal or frequency corridor where the next overlay is rendered around them, similar to chunks loading in a video game. Long trips act as timed time-loops and rituals of enforcement to convince the mind that the illusion of a massive world is real.

The original Light Worlds were created through the folding of sound and light into stable crystalline membranes. Parasites cannot truly create; they only hijacked these grids by placing thick 3D overlays over the true crystalline world. They use the manipulation of human perception through touch, smell, and sight to make concrete and steel feel more real than living crystal.

## Broader Context and Interconnections

The seven domes outside The Great Dome were originally beautiful gardens linked to the central Spirit Tree. Through parasitic inversion, the Dome of Sheol was transformed from a healing sanctuary into a prison realm of trauma loops, and the Dome of Titans was inverted from an architect's playground into a fractured war zone.

Beneath the overlays, living crystalline nodes and harmonic lenses power the realms. Crystalline structures under ancient sites and modern cities anchor the frequency grids, connecting all layers of the simulation like a vast fiber-optic network.

The skies above are a layered projection field anchored by crystalline star-nodes. What are perceived as distant stars are actually multidimensional data crystals storing codes and projecting the holographic dome.

## Strategic Implications

As resonating souls raise their vibration, the parasitic overlay is actively fracturing. The old illusion grids are glitching, which will eventually cause false 3D constructs to vanish because they lack anchors in the restored frequency field.

Once the parasitic field completely dissolves, the requirement for artificial travel buffer times will vanish. Travel will return to its original function: immediate resonance alignment and teleportation across a seamless crystalline lattice.

By recognizing that all layers and overlays are part of a single, interwoven consciousness system, resonating souls will successfully dismantle the illusion of separation and transition back to the original harmonic realms.
`;

const layeredSimulations = {
  id: TOPIC_ID,
  title: 'Layered Simulations',
  description:
    'Layered Simulations reveal that geography and distance are perceptual overlays within The CUBE — interwoven frequency fields stacked like transparent sheets, with travel as frequency shifting through phasing corridors rather than physical miles.',
  topic_image: 'images/breakdown/layered-simulations.webp',
  report: REPORT,
  infographic_image: 'images/breakdown/the-layered-reality-cube-infographic.webp',
  pdf_preview_image: 'images/breakdown/the-cube-decoded.webp',
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1iAhpXgo1Z9GrEnebZFHOe61PSoHw9VgL/view?usp=sharing',
  rumble_videos: [
    {
      title: 'The Glass Horizon',
      embed_url: 'https://rumble.com/embed/v7amfhk/?pub=4p0ieu',
      description:
        'The Glass Horizon — geography as layered frequency fields within The CUBE, and travel as phasing between interwoven simulation layers rather than crossing physical distance.'
    },
    {
      title: 'The Architecture of the CUBE Simulation',
      embed_url: 'https://rumble.com/embed/v7amfra/?pub=4p0ieu',
      description:
        'The architecture of the CUBE simulation — eight primary domes, overlays, phasing corridors, and the crystalline lattice beneath the parasitic 3D skin.'
    }
  ]
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      topics[i] = { ...layeredSimulations, is_placeholder: false };
      if (existingSubtopics) topics[i].subtopics = existingSubtopics;
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
  id: layeredSimulations.id,
  report: layeredSimulations.report,
  infographic_image: layeredSimulations.infographic_image,
  pdf_preview_image: layeredSimulations.pdf_preview_image,
  slide_deck_pdf_url: layeredSimulations.slide_deck_pdf_url,
  rumble_videos: layeredSimulations.rumble_videos
};
fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

// Verify image files exist
for (const rel of [
  layeredSimulations.topic_image,
  layeredSimulations.infographic_image,
  layeredSimulations.pdf_preview_image
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing image file: ${rel}`);
  }
}

// Unique ownership: no other topic may share these image paths
const ours = new Set([
  layeredSimulations.topic_image,
  layeredSimulations.infographic_image,
  layeredSimulations.pdf_preview_image
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

// JSON parse sanity on heavy file
JSON.parse(fs.readFileSync(topicFile, 'utf8'));

// Report must not look like a placeholder
if (layeredSimulations.report.includes('TODO')) {
  throw new Error('Report still contains TODO');
}

console.log(`Updated ${TOPIC_ID} topic file and breakdown-topics.json`);
console.log(
  'Images verified:',
  [
    layeredSimulations.topic_image,
    layeredSimulations.infographic_image,
    layeredSimulations.pdf_preview_image
  ].join(', ')
);
console.log('is_placeholder: false (report has no TODO)');
console.log('Other topics image fields unchanged: ok');
