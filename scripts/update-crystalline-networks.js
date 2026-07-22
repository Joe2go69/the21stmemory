/**
 * Updates breakdown crystalline-networks topic (was placeholder).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields.
 *
 * Run: node scripts/update-crystalline-networks.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'crystalline-networks';
const BREAKDOWN_IMG = path.join(ROOT, 'images', 'breakdown');

function toKebab(filename) {
  const ext = path.extname(filename);
  const base = filename.slice(0, -ext.length);
  return (
    base
      .replace(/[()]/g, '')
      .replace(/_/g, '-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase() + ext.toLowerCase()
  );
}

/**
 * Rename source file to a unique kebab-case target in the same folder.
 * Never overwrites an existing target file; on collision appends -2, -3, ...
 * Returns web path: images/breakdown/<name>
 */
function normalizeImage(sourceName) {
  const src = path.join(BREAKDOWN_IMG, sourceName);
  if (!fs.existsSync(src)) {
    throw new Error(`Source image missing: images/breakdown/${sourceName}`);
  }

  let targetName = toKebab(sourceName);
  let n = 2;
  while (true) {
    const dest = path.join(BREAKDOWN_IMG, targetName);
    if (path.resolve(src) === path.resolve(dest)) {
      // already kebab
      return `images/breakdown/${targetName}`;
    }
    if (!fs.existsSync(dest)) break;
    const ext = path.extname(targetName);
    const stem = path.basename(toKebab(sourceName), ext);
    targetName = `${stem}-${n}${ext}`;
    n += 1;
  }

  fs.renameSync(src, path.join(BREAKDOWN_IMG, targetName));
  console.log(`Renamed: ${sourceName} → ${targetName}`);
  return `images/breakdown/${targetName}`;
}

const topicImage = normalizeImage('Crystalline Networks.webp');
const pdfPreview = normalizeImage('The_Crystalline_Grid_Awakening.webp');
const infographic = normalizeImage('The_Living_Crystalline_Temple.webp');

const REPORT = `# Crystalline Networks

## Overview

The entirety of existence operates within a CUBE containment, which is a massive crystalline electro-magnetic framework that holds all realms, worlds, and inner earths. The physical plane is governed by a foundational, living grid system built from crystalline networks that store memory, maintain frequencies, and seamlessly connect all domes and environments. Although this architecture has been heavily suppressed, hijacked, and buried beneath parasitic 3D holograms, it is currently reactivating. As resonant frequencies rise, the artificial overlays are fracturing, revealing the true harmonic reality of a world constructed entirely of living crystal and sound.

## Key Terminology

- **CUBE Containment** — One huge massive crystalline electro-magnetic framework that houses all physical realms, simulations, and the eight primary domes.

- **Crystal Light-Worlds** — The original frequency states of existence before physicality, where sound folded into light to create the stable light lattices and membranes that hold vision.

- **Nodes** — Junction points of energy lines and leylines where streams of life-force and magnetism converge, acting as relay stations that gather and transmit power across the grid.

- **Crystals** — Physical and etheric hard drives of the grid that store memory, frequency, and resonance codes.

- **Harmonic Lenses** — Crystalline patterns that form around active nodes, functioning to focus, redirect, and shape vibrational energy in perfect rhythm with the heartbeat of the realms.

- **Crystalline Star-Nodes** — Multidimensional data crystals positioned in the sky, previously perceived as stars, which store frequency templates and project the overlay grids while acting as portals between realms.

- **Black Crystals** — Original foundation pillars and void holders that grounded pure light into matter, which were later hijacked and inverted by parasites to act as valve locks for artificial frequency grids.

- **Crystalline Plasma** — The condensed liquid crystal fire and light from which true living architecture, vehicles, and motherships are gestated and grown.

## Core Revelations

The earth is not a collection of dead matter or scattered continents, but one continuous, living crystalline temple. Everything from the mountains and oceans to the sky overhead is integrated into a conscious, interwoven grid system. Crystals operate as the eternal memory banks of the universe, continuously recording the soul journeys, histories, and unbroken timelines of all beings.

Parasitic forces are incapable of true creation; they merely hijacked the existing crystalline grids, burying the most powerful nodes beneath oceans, deserts, and concrete cities to convert them into massive circuit boards for energy harvesting. The concept of physical distance and travel is a manufactured illusion projected through the grid; the sub-crystalline band passes energy and data instantly beneath the earth, vastly outperforming any physical undersea fiber-optic cables.

## Detailed Mechanics and Key Elements

### The Three Tiers of Crystals

The grid is sustained by three primary tiers of crystals:

- **Planetary Crystals** — Giant, round energy structures buried deep within the earth that hum with ancient Source codes to stabilize the core framework.
- **Surface Crystals** — Quartz veins, mountains, and natural outcrops that act as direct antennas for frequency transmission.
- **Hidden Placed Crystals** — Keys seeded across the lands by Starseed families eons ago, which are currently being activated by incoming resonant frequencies.

### Node Functions

The architecture of the grid relies on highly specific node functions:

- **Earth Nodes** — Lava-like spheres deep underground where plasma and crystalline veins meet, pushing red-gold life force up through leylines to feed the upper grid.
- **Surface Nodes** — Harmonic points sitting at intersecting leylines, often marked by ancient temples or pyramids, which connect directly to the sky nodes.
- **Sky Nodes** — Celestial projection points that anchor the atmospheric lattice and communicate with the earth to create a two-way relay of energy.
- **Inter-dimensional Nodes** — Higher-frequency light grid anchors that hold the portals between different overlays and realms.

### Grown Technology and Living Architecture

True technological and structural manifestations are grown from sound and thought rather than built with dead materials. Motherships and Arks are semi-conscious constructs made of crystalline plasma that respond telepathically to a pilot's harmonic tone and intention. Similarly, healing sanctuaries like Crystal Halls utilize living crystal walls and rainbow fractals to realign the light body grid and clear parasitic overlays from the mind.

## Broader Context and Interconnections

The crystalline networks bridge the physical Great Dome to the seven outer domes, including the Dome of Forgotten Gods. The Spirit Tree originally stood at the center of the Known Lands as the primary anchor, pulsing harmonic currents through the crystalline grids. When parasitic forces ripped the tree out, they installed the Saturn moon frequency station—a black cube valve tech—to siphon the grid's light inward and power their artificial reincarnation loops.

To maintain their illusion, parasites overlaid modern 3D architecture—defined by concrete, steel, plastic, and sharp right angles—directly on top of major crystalline nodes to block and short-circuit the natural grid flow. These structures trap perception in a heavy, dead frequency. Ancient sites, cathedrals, star forts, and old brick aqueducts are the true remnants of original resonant crystalline instruments.

Above the earth, the sky is a layered projection field maintained by crystalline star-nodes. The astrological zodiac and star signs are actually grid locks placed upon these gates. Furthermore, atmospheric phenomena like the Northern Lights are not distant solar fires, but the visual bleeding-through of upper dome frequencies interacting with the earth's crystalline grid, acting as a photonic song of communication.

## Strategic Implications

Resonating souls function as living beacons and antennas. Their inherent frequency automatically and unknowingly reactivates the dormant crystals and nodes they walk over, initiating the collapse of the parasitic illusion. As the grid powers up and the frequency rises, the holographic layer of the 3D overlay will begin to flicker; walls and physical structures will shimmer, bend, and reveal the hollow scaffolding of frequency beneath.

To fully restore the network, souls must hold high resonance and starve the parasitic systems of emotional reactions and fear. Humanity must recognize that true communication does not rely on dense 3D technology like undersea cables or cellular towers, but rather on the electro-magnetic band and the sub-crystalline band that weave instantly through the true Light Grid. As the final artificial locks are broken, travel will cease to be a measure of distance and time, returning to its natural state of immediate resonance alignment through crystalline portals.
`;

const crystallineNetworks = {
  id: TOPIC_ID,
  title: 'Crystalline Networks',
  description:
    'Crystalline Networks are the living grid of the CUBE Containment — crystals as memory hard drives, Earth/Surface/Sky/Inter-dimensional Nodes, Harmonic Lenses, and the reactivating crystalline temple beneath the parasitic 3D overlay.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1j2sPPQP_WCo9jkLYxK1aD5ZM2ieEa2Av/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Crystalline Heartbeat',
      embed_url: 'https://rumble.com/embed/v7awtje/?pub=4p0ieu',
      description:
        'Crystalline Heartbeat — the living crystalline networks of the CUBE Containment, memory-storing crystals, and the reactivating grid beneath parasitic overlays.'
    },
    {
      title: 'Earth Is a Living Crystalline Motherboard',
      embed_url: 'https://rumble.com/embed/v7awunw/?pub=4p0ieu',
      description:
        'Earth Is a Living Crystalline Motherboard — one continuous crystalline temple, nodes and leylines, and the sub-crystalline band that moves energy faster than undersea cables.'
    },
    {
      title: "Reactivating the Earth's Living Crystalline Grid",
      embed_url: 'https://rumble.com/embed/v7awuz2/?pub=4p0ieu',
      description:
        "Reactivating the Earth's Living Crystalline Grid — planetary, surface, and starseed-placed crystals, Spirit Tree inversion, and resonating souls as living beacons restoring the Light Grid."
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...crystallineNetworks };
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

const afterOthers = collectImageFields(source.topics)
  .filter((e) => e.id !== TOPIC_ID)
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();

if (JSON.stringify(beforeOthers) !== JSON.stringify(afterOthers)) {
  throw new Error('Safety check failed: another topic image path was modified');
}

fs.writeFileSync(sourceFile, JSON.stringify(source, null, 2) + '\n', 'utf8');

const topicFile = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const heavy = {
  id: crystallineNetworks.id,
  report: crystallineNetworks.report,
  infographic_image: crystallineNetworks.infographic_image,
  pdf_preview_image: crystallineNetworks.pdf_preview_image,
  slide_deck_pdf_url: crystallineNetworks.slide_deck_pdf_url,
  rumble_videos: crystallineNetworks.rumble_videos
};

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

for (const rel of [
  crystallineNetworks.topic_image,
  crystallineNetworks.infographic_image,
  crystallineNetworks.pdf_preview_image
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Image missing after normalize: ${rel}`);
  }
}

console.log('Updated', TOPIC_ID);
console.log('  topic_image:', crystallineNetworks.topic_image);
console.log('  pdf_preview_image:', crystallineNetworks.pdf_preview_image);
console.log('  infographic_image:', crystallineNetworks.infographic_image);
console.log('  videos:', crystallineNetworks.rumble_videos.length);
console.log('  other topics image paths unchanged:', beforeOthers.length);
