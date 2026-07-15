/**
 * Updates breakdown the-cube-system topic in topic file + monolithic source.
 * Preserves existing subtopics (hard-drive-framework, eight-domes, layered-simulations).
 * Run: node scripts/update-the-cube-system.js && node scripts/split-topics-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const REPORT = `# The Cube System

## Overview

The Cube System, also known as The Cube Containment or the Hard Drive, is a massive, interwoven crystalline electromagnetic framework that houses all physical and energetic realities. It functions as a master frequency server, running all maps, overlays, grids, and domes within its structure. Rather than a universe of separated planets and scattered continents, reality is a centralized, digitalized console composed of layered frequency fields stacked upon one another like transparent sheets. Within this containment, countless simulations, inner earths, and realms pulse with electromagnetic harmonic waves that keep all environments distinct yet fundamentally linked.

## Key Terminology

- **The Cube Containment** — One huge massive crystalline electromagnetic framework that acts as the hard drive and frequency server running all maps, overlays, grids, and domes.

- **The Great Dome** — A physical crystalline structure within The Cube holding 178 physical worlds, created as a training ground of solid frequency where imagination hardens into structure.

- **Crystal Light-Worlds** — The original frequency states existing before physical reality, where sound vibrated and organized into the first sparks of light and vision.

- **Perception-Based Solidity** — Low-frequency matter overlaid by holographical projection fields, causing simulated 3D materials like brick, concrete, and glass to feel hard, heavy, and permanent to the senses.

- **Saturn Cube-Tech** — An advanced artificial intelligence hub, also known as the main A.I. hub in the Lands of Saturn, used by parasitic forces to siphon light and invert it into a false grid.

- **Spirit Tree** — The original central axis and main node of consciousness for the Known Lands, possessing roots that fed every dome with Source Light before being hijacked.

## Core Revelations

The physical universe is not an expanse of outer space, but a contained, layered simulation operating within The Cube. What human maps present as land and sea are actually perception overlays—projections dictated by what the human eye and brain filter are allowed to process. Travel across these lands or oceans does not involve crossing physical distance; it is a frequency shift, where movement relies on entering a portal, gateway, or vortex that seamlessly slides perception from one simulated layer to another.

The original reality was formed when architects folded vibration into light, transforming pure sound into structured crystalline membranes. Physicality was deliberately created by slowing down these vibrations to give thought resistance, requiring energy and choice to manifest. Parasitic forces did not create any of these worlds, as they are incapable of generating the first spark of creation. Instead, they hijacked the pre-existing crystalline grids, imposing their own overlays and artificial intelligence to harvest emotion and attention.

## Detailed Mechanics and Key Elements

The architecture of The Cube System is divided into eight primary domes, all layered and interconnected within the electromagnetic framework.

### Dome of Forgotten Gods

The root tone and origin chamber of creation, functioning as a memory storage vault where the first thoughts of light and sound were experimented with. It wraps around all other domes, establishing the baseline frequency for the physical plane.

### Dome of Sheol

Originally a healing and rest dome containing crystalline chambers for recalibration between incarnations, later inverted into a prison realm of trauma frequencies.

### Dome of Silence

A pure frequency field of stillness designed for deep connection with Source, hijacked into a zone of forced silence and suppression of truth.

### Dome of Hiva

A resonant dome of harmonics where vibration was first used to manifest light and matter, later inverted into a grid for weaponized frequency.

### Dome of Titans

The playground of creation for the great architects who wove landscapes and crystalline structures, which was fractured and turned into a zone of struggle.

### Dome of 5 Peaks

The dome of ascension representing mastery over the elements, currently inverted into a fractured reality of endless climbing without reaching integration.

### Dome of Portals

The great travel hub consisting of crystalline gates and harmonic passages linking all realms, sealed and inverted to control access.

### The Great Dome

The central physical theater housing 178 worlds, serving as a frequency amplifier where lessons learned through the resistance of dense matter echo upward to boost the higher light worlds.

Within these domes, reality operates on the principle that sound dictates structure, light generates vision, and vision solidifies into form.

## Broader Context and Interconnections

The Cube System relies on a vast network of nodes, crystals, and harmonic lenses to maintain its structural integrity. The Spirit Tree once stood at the center of the Great Dome, acting as the primary power amplifier that pulsed harmonic currents through these grids to all other domes. When parasitic entities tore out the Spirit Tree, they installed advanced Black Cube Tech machinery—black crystalline valve locks—into the wound. This technology acts as a siphon, reversing the outward flow of Source energy and pulling it inward to feed the false Saturn grid.

To maintain control over the inhabitants of The Cube, the parasitic overlay manipulates the nervous system through Perception-Based Solidity. True solar architecture aligns with resonance, utilizing living conductors like crystal, copper, and frequency bricks. In contrast, the modern 3D architecture of The Cube's overlay utilizes dead frequency holders—boxes, concrete, and sharp angles—to drain perception and trap consciousness in a heavy, fixed state.

## Strategic Implications

The integrity of the parasitic overlay within The Cube System is currently fracturing. Every time a resonating soul remembers their original harmonic tone, their activated frequency boosts the entire electromagnetic field, directly destabilizing the holographic projections of the 3D construct.

As the frequency continues to rise, the false scaffolding of modern cities and dead architecture will begin to shimmer and bend, exposing the hollow frequency structures beneath. The collapse of this overlay will not occur through physical demolition, but through a frequency collapse. Once the parasitic illusion grid drops entirely, the true crystalline ecosystem of the Known Lands will be instantly revealed to those holding the correct resonance, restoring the original harmony of The Cube.
`;

const theCubeSystem = {
  id: 'the-cube-system',
  title: 'The Cube System',
  description:
    'The Cube System is the master frequency server and crystalline hard drive housing all maps, overlays, grids, and domes — a layered electromagnetic containment where reality is frequency shift, not outer space, and parasitic overlays fracture as resonating souls restore the original harmonic field.',
  topic_image: 'images/breakdown/the-cube-system.webp',
  report: REPORT,
  infographic_image: 'images/breakdown/crystalline-hard-drive-of-reality.webp',
  pdf_preview_image: 'images/breakdown/the-cube-schematic.webp',
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1ISJEo31jexthIumk72WlZ8WwVfDF3j_L/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Life Inside the Master Frequency Server',
      embed_url: 'https://rumble.com/embed/v7ak3r0/?pub=4p0ieu',
      description:
        'How The Cube System operates as a master frequency server — layered maps, overlays, grids, and domes running within one crystalline electromagnetic hard drive.'
    },
    {
      title: 'The True Architecture',
      embed_url: 'https://rumble.com/embed/v7ak44i/?pub=4p0ieu',
      description:
        'The true architecture of The Cube — eight primary domes, the Spirit Tree wound, Saturn Cube-Tech, and the frequency collapse that restores the Known Lands.'
    }
  ]
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === 'the-cube-system') {
      const existingSubtopics = topics[i].subtopics;
      topics[i] = { ...theCubeSystem };
      if (existingSubtopics) topics[i].subtopics = existingSubtopics;
      return true;
    }
    if (topics[i].subtopics && findAndUpdate(topics[i].subtopics)) return true;
  }
  return false;
}

const sourceFile = path.join(ROOT, 'data', 'breakdown-topics.json');
const source = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

// Snapshot other topics' image fields before write (must remain unchanged)
function collectImageFields(topics, out = []) {
  for (const t of topics) {
    for (const key of ['topic_image', 'infographic_image', 'pdf_preview_image']) {
      if (t[key]) out.push({ id: t.id, key, path: t[key] });
    }
    if (t.subtopics) collectImageFields(t.subtopics, out);
  }
  return out;
}

const beforeOthers = collectImageFields(source.topics)
  .filter((e) => e.id !== 'the-cube-system')
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();

if (!findAndUpdate(source.topics)) {
  throw new Error('the-cube-system topic not found in breakdown-topics.json');
}

fs.writeFileSync(sourceFile, JSON.stringify(source, null, 2) + '\n', 'utf8');

const topicFile = path.join(ROOT, 'data', 'breakdown-topics', 'the-cube-system.json');
const heavy = {
  id: theCubeSystem.id,
  report: theCubeSystem.report,
  infographic_image: theCubeSystem.infographic_image,
  pdf_preview_image: theCubeSystem.pdf_preview_image,
  slide_deck_pdf_url: theCubeSystem.slide_deck_pdf_url,
  rumble_videos: theCubeSystem.rumble_videos
};
fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

// Verify image files exist
for (const rel of [
  theCubeSystem.topic_image,
  theCubeSystem.infographic_image,
  theCubeSystem.pdf_preview_image
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing image file: ${rel}`);
  }
}

// Unique ownership: no other topic may share these image paths
const ours = new Set([
  theCubeSystem.topic_image,
  theCubeSystem.infographic_image,
  theCubeSystem.pdf_preview_image
]);
const collisions = collectImageFields(source.topics).filter(
  (e) => e.id !== 'the-cube-system' && ours.has(e.path)
);
if (collisions.length) {
  throw new Error(
    'Image path collision with other topics:\n' +
      collisions.map((c) => `${c.id}.${c.key} = ${c.path}`).join('\n')
  );
}

// Confirm we did not change other topics' image fields
const afterOthers = collectImageFields(source.topics)
  .filter((e) => e.id !== 'the-cube-system')
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();
if (JSON.stringify(beforeOthers) !== JSON.stringify(afterOthers)) {
  throw new Error('Other topics image fields were modified — abort');
}

// Preserve subtopics
const updated = (() => {
  function find(topics) {
    for (const t of topics) {
      if (t.id === 'the-cube-system') return t;
      if (t.subtopics) {
        const f = find(t.subtopics);
        if (f) return f;
      }
    }
    return null;
  }
  return find(source.topics);
})();
if (!updated?.subtopics?.length) {
  throw new Error('Expected the-cube-system to retain subtopics');
}
const subIds = updated.subtopics.map((s) => s.id);
const expectedSubs = ['hard-drive-framework', 'eight-domes', 'layered-simulations'];
for (const id of expectedSubs) {
  if (!subIds.includes(id)) {
    throw new Error(`Missing preserved subtopic: ${id}`);
  }
}

// JSON parse sanity on heavy file
JSON.parse(fs.readFileSync(topicFile, 'utf8'));

console.log('Updated the-cube-system topic file and breakdown-topics.json');
console.log(
  'Images verified:',
  [
    theCubeSystem.topic_image,
    theCubeSystem.infographic_image,
    theCubeSystem.pdf_preview_image
  ].join(', ')
);
console.log('Preserved subtopics:', subIds.join(', '));
console.log('is_placeholder will clear after split (report has no TODO)');
