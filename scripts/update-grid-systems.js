/**
 * Updates breakdown grid-systems topic in topic file + monolithic source.
 * Does not modify other topics' image fields.
 * Run: node scripts/update-grid-systems.js && node scripts/split-topics-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'grid-systems';

const REPORT = `# Grid Systems

## Overview

The universe operates upon a massive, interwoven Crystalline Electro-Magnetic Framework. The Grid Systems serve as the foundational architecture of the CUBE Containment, forming an intricate web of light, sound, and frequency that connects all simulations, realms, and Domes. Originally constructed by ancient architects as pure communication, power, and memory networks, these grids were hijacked to project a false reality upon consciousness. Through the deliberate amplification of high harmonics, the grids are now undergoing rapid recalibration, fracturing the false overlays and restoring the original divine design.

## Key Terminology

- **Nodes** — spherical junction points where streams of life-force and magnetism meet, acting as relay stations for frequency across the grids.

- **Crystals** — the physical and etheric hard drives of the grid that store memory, frequency, and resonance codes.

- **Harmonic Lenses** — crystalline patterns that form around active nodes to shape, focus, and redirect energy, pulsing with the frequencies of celestial bodies.

- **Ley-lines** — energetic pathways connecting nodes and crystals, functioning as the fiber optics of Source.

- **Parasitic Circuit Boards** — corrupted grid sections where original crystalline nodes were buried under cities or deserts to harvest emotional energy (loosh) and broadcast the 3D illusion.

- **Parasitic Overlay** — a false, holographic skin projected over reality through hijacked grids, manipulating human senses into perceiving solid 3D density rather than living crystal.

## Core Revelations

Everything in physical existence is interconnected through living, breathing grids. The physical world is not comprised of separate planets or isolated continents, but of overlapping frequency bands held together by the Light Web Grid. Parasitic entities possess no power of original creation; they strictly hijacked the existing Light Lattices engineered by the Lyran Builders-Architects, deploying inverted codes and artificial veils to blind humanity. The ongoing activation of the grids by Resonating Sols is actively fracturing this false 3D projection, revealing the true crystalline nature of reality lying just beneath the surface.

## Detailed Mechanics and Key Elements

### Crystal Anchors

Acting as the primary storage and transmission centers, crystals operate as vast memory banks that maintain the unbroken timeline of soul journeys across existence. Planetary Crystals hum deep within the earth's structures, Surface Crystals (such as quartz veins and mountains) act as environmental antennas, and Hidden Placed Crystals (including monoliths) were seeded by Starseed families to act as crucial awakening keys.

### Node Types

The grid infrastructure relies on a four-tier node system. Earth Nodes (lava or core nodes) pulse with red-gold energy deep underground to feed the upper grid. Surface Nodes sit at intersecting ley-lines under ancient temples, stone circles, and pyramids, directly amplifying frequency. Sky Nodes (what humans perceive as stars) are crystalline celestial projectors that anchor the overlay grids in the atmosphere. Inter-dimensional Nodes hold the precise portals between different overlays and realms.

### The Seven Overlay-Bands

The communication grids operate simultaneously across seven distinct frequencies: the Surface Band (physical reality illusion), Atmospheric Band (sound/light transmission), Electro-Magnetic Band (true data and internet flow), Sub-Crystalline Band (where crystals pass vibration seamlessly between continents), Resonant Oceanic Grid (the emotional mirror of humanity), Harmonic-Solar Band (the interface between diverse realms), and the SOURCE Band (pure awareness beyond all location).

## Broader Context and Interconnections

The Grid Systems were originally tethered to the Spirit Tree in Hyperborea, the central axis of consciousness for the KNOWN LANDS and the heart of the Great Dome. When parasitic forces tore down the tree, they inserted Black Crystals as valve locks to siphon light toward the Saturn Grid, replacing the organic flow of Source energy with a counterfeit cycle of reincarnation and energy harvest.

Historically, grid nodes have been the sites of massive, concealed etheric wars. The Great Fire of London (1666) was a surface distraction masking an intense battle between Tartarians defending an ancient crystal node and Greys attempting to siphon its energy. Modern infrastructure, including cities, roadways, and undersea communication cables, are merely dense, physical imitations of the true underlying crystalline ley-lines and energy corridors, unwittingly rebuilding the grid in 3D material to maintain the illusion of distance.

## Strategic Implications

As high-frequency energy continues to shatter the Parasitic Overlay, the true grids are bleeding through into human perception, causing physical walls to shimmer and ancient sites to radiate a palpable hum. The illusion of distance and travel—artificially sustained through grid-based time-loop projections to enforce a false sense of separation—will permanently collapse, returning navigation to instantaneous resonance alignment. As Resonating Sols synchronize their harmonic tones with the embedded codes in the crystals, the entire global grid will restructure into one massive Crystalline Temple and planetary healing environment, fundamentally dissolving the parasitic system and restoring original harmonic balance.
`;

const gridSystems = {
  id: TOPIC_ID,
  title: 'Grid Systems',
  description:
    'Grid Systems are the living Crystalline Electro-Magnetic Framework of the CUBE — Nodes, Crystals, Ley-lines, and Harmonic Lenses connecting all realms, hijacked as Parasitic Overlay projectors and now recalibrating into one planetary Crystalline Temple.',
  topic_image: 'images/breakdown/grid-systems.webp',
  report: REPORT,
  infographic_image: 'images/breakdown/crystalline-electro-magnetic-framework-diagram.webp',
  pdf_preview_image: 'images/breakdown/the-crystalline-temple.webp',
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1R6X2NpzQghCqPlneQfNF7oeeLOia1oFF/view?usp=sharing',
  rumble_videos: [
    {
      title: 'The Architecture of the Crystalline Grid',
      embed_url: 'https://rumble.com/embed/v7arime/?pub=4p0ieu',
      description:
        'The Architecture of the Crystalline Grid — the living Light Web of Nodes, Crystals, Ley-lines, and Harmonic Lenses that form the foundational CUBE architecture connecting all simulations and Domes.'
    },
    {
      title: 'The Crystalline Pulse',
      embed_url: 'https://rumble.com/embed/v7arik4/?pub=4p0ieu',
      description:
        'The Crystalline Pulse — four-tier node systems, Crystal Anchors as memory banks, and the Seven Overlay-Bands through which frequency and data move across the planetary grid.'
    },
    {
      title: 'The Living Crystalline Supercomputer Beneath Us',
      embed_url: 'https://rumble.com/embed/v7arj1u/?pub=4p0ieu',
      description:
        'The Living Crystalline Supercomputer Beneath Us — Spirit Tree tether, Black Crystal valve locks, etheric node wars, and the recalibration that dissolves the Parasitic Overlay into a Crystalline Temple.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...gridSystems };
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
  id: gridSystems.id,
  report: gridSystems.report,
  infographic_image: gridSystems.infographic_image,
  pdf_preview_image: gridSystems.pdf_preview_image,
  slide_deck_pdf_url: gridSystems.slide_deck_pdf_url,
  rumble_videos: gridSystems.rumble_videos
};
fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

// Verify image files exist
for (const rel of [
  gridSystems.topic_image,
  gridSystems.infographic_image,
  gridSystems.pdf_preview_image
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing image file: ${rel}`);
  }
}

// Unique ownership: no other topic may share these image paths
const ours = new Set([
  gridSystems.topic_image,
  gridSystems.infographic_image,
  gridSystems.pdf_preview_image
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
if (!heavyParsed.rumble_videos || heavyParsed.rumble_videos.length !== 3) {
  throw new Error('Expected 3 rumble videos');
}
if (!heavyParsed.slide_deck_pdf_url) {
  throw new Error('Missing slide_deck_pdf_url');
}

if (gridSystems.report.includes('TODO')) {
  throw new Error('Report still contains TODO');
}

// Ensure kebab-case image paths only
for (const rel of [
  gridSystems.topic_image,
  gridSystems.infographic_image,
  gridSystems.pdf_preview_image
]) {
  const base = path.basename(rel);
  if (base !== base.toLowerCase() || /[_\s]/.test(base)) {
    throw new Error(`Image path not normalized kebab-case: ${rel}`);
  }
}

console.log(`Updated ${TOPIC_ID} topic file and breakdown-topics.json`);
console.log(
  'Images verified:',
  [
    gridSystems.topic_image,
    gridSystems.infographic_image,
    gridSystems.pdf_preview_image
  ].join(', ')
);
console.log('PDF:', gridSystems.slide_deck_pdf_url);
console.log(
  'Videos:',
  gridSystems.rumble_videos.map((v) => v.title).join(' | ')
);
