/**
 * Updates breakdown ley-line-optics topic (was placeholder under Crystalline Networks).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields.
 *
 * Run: node scripts/update-ley-line-optics.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'ley-line-optics';
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

// Topic / lesson card first so it claims ley-line-optics.webp.
// PDF source also kebab-collides to ley-line-optics.webp — remap to a distinct semantic name.
const topicImage = normalizeImage('Ley Line Optics.webp');
let pdfPreview = normalizeImage('Ley_Line_Optics.webp');
if (pdfPreview === 'images/breakdown/ley-line-optics.webp' || /ley-line-optics-\d+\.webp$/.test(pdfPreview)) {
  const preferred = 'ley-line-optics-pdf-preview.webp';
  const preferredFull = path.join(BREAKDOWN_IMG, preferred);
  const currentFull = path.join(ROOT, pdfPreview);
  if (path.resolve(currentFull) !== path.resolve(preferredFull)) {
    if (fs.existsSync(preferredFull)) {
      throw new Error(`Preferred PDF name already exists: ${preferred}`);
    }
    fs.renameSync(currentFull, preferredFull);
    console.log(`Renamed PDF preview: ${path.basename(pdfPreview)} → ${preferred}`);
    pdfPreview = `images/breakdown/${preferred}`;
  }
}
const infographic = normalizeImage('Organic_Fiber-Optics_of_Source.webp');

const REPORT = `# Ley Line Optics

## Overview

The reality of this realm is constructed upon one massive Crystalline Network, an electro-magnetic framework that serves as the foundation for all existence, creation, and communication. Within this immense structure, Ley Line Optics function as the primary energy conduits—the Fibre Optic Lines of Source—connecting domes, realms, and dimensions. What humanity perceives as physical landscapes, oceans, and modern telecommunication wires are merely dense, third-dimensional overlays masking a brilliant, living grid of high-frequency crystalline energy. These organic, energetic fibre optics transmit light, memory, and harmonic resonance instantaneously across the network, completely bypassing the need for physical distance or artificial technology.

## Key Terminology

- **Crystalline Network** — One huge electro-magnetic framework consisting of interwoven frequency layers and crystal grids that holds the architecture of all domes and simulations.

- **Ley Line Optics** — The organic, energetic conduits connecting rivers, lakes, and quartz veins, acting as fibre optic lines of Source to transmit memory and frequency.

- **Nodes** — Spherical junction points of energy lines and ley lines where streams of life-force and magnetism meet, acting as neutral relay stations.

- **Harmonic Lenses** — Crystalline bloom patterns that form around active nodes, focusing and redirecting vibration in rhythm with the heartbeat of the realms.

- **Surface Crystals** — Mountains, quartz veins, and natural outcrops that function as antennas to broadcast and receive codes across the grid.

- **Sub-Crystalline Band** — The subtle communication layer beneath continents and oceans where crystalline minerals resonate like tuning forks to pass energy instantaneously.

- **True Light Grid** — The original, uncorrupted energetic web of moving photons and frequencies that connects all consciousness across the domes.

## Core Revelations

The modern telecommunication cables laid across ocean floors are nothing more than physical, three-dimensional mimicry of the true, pre-existing etheric grid. Engineers unconsciously reconstructed the ancient crystalline network using hardware, creating a dense echo of the actual ley lines that join node points on land. Every physical fibre-optic pulse of light in a man-made cable is merely a reflection of the True Light Grid's moving photons.

Crystals serve as both physical and etheric hard drives for this network. They store memory, resonance codes, and the unbroken timelines of soul journeys, acting as the ultimate data storage for the galactic libraries. When physical cables or wires are believed to be transmitting data, it is actually the underlying Sub-Crystalline Band carrying vibration between continents much faster than any artificial wire ever could.

## Detailed Mechanics and Key Elements

The mechanics of Ley Line Optics operate through natural earth formations and intentionally placed crystalline architecture. Rivers, lakes, quartz veins, and mountains act directly as fibre optics, creating an intricate web of energy transmission. When energy flows through these ley lines and intersects, it pools into Nodes.

There are four primary types of nodes interacting with the ley lines:

### Earth Nodes

Located deep underground where plasma and crystalline veins meet, pushing life force up through ley lines, mountains, and tree roots.

### Surface Nodes

Positioned where energy lines cross. Ancient builders placed pyramids and stone circles over these points to amplify frequencies.

### Sky Nodes

Crystalline projectors in the atmosphere that anchor the overlay grids and send two-way relay energy down to the earth nodes.

### Inter-dimensional Nodes

High-frequency spheres that hold the portals between overlays.

Around every active node, a Harmonic Lens spins, shaping the power and turning it into a sacred instrument. True solar architecture—such as star forts, old cathedrals, red brick power stations, and obelisks—was intentionally aligned to these ley lines and star maps to pull cosmic currents directly into the ground grids. These structures act as crystal instruments, using geometry like arches, domes, and spirals to resonate like sound bowls, amplifying the frequency transmitted through the ley line optics.

## Broader Context and Interconnections

The Crystalline Network is heavily layered, consisting of the Seven Overlay-Bands that facilitate all communication and travel.

### The Surface Band

The dense layer where physical cables rest on the ocean floor.

### The Atmospheric Band

Where light, sound, and radio frequencies whisper through the air.

### The Electro-Magnetic Band

The true communication grid where digital space and thought cross.

### The Sub-Crystalline Band

The deeply buried crystals passing codes instantaneously.

### The Resonant Oceanic Band

The emotional mirror of humanity reflecting collective feelings through tides.

### The Harmonic-Solar Band

The interface corridor where consciousness from different realms connects.

### The Source Band

The field of pure awareness where distance entirely ends.

Parasitic forces attempted to suppress this optic network by burying the main crystalline grids under cities, deserts, and oceans, inverting them into parasitic circuit boards. They deliberately built 3D architecture with sharp angles and dead materials (concrete, steel) directly over grid nodes to short-circuit the natural harmonic flows and block the transmission of light. By sealing the portals and replacing organic telepathy and harmonic resonance with artificial technology and internet cables, the population was disconnected from the instantaneous, memory-rich light grid.

## Strategic Implications

The parasitic overlay is currently fracturing, and the true Crystalline Network is coming back online. As the frequency rises, the hidden crystals and ley line optics seeded across the lands by ancient starseed families are being reactivated. Monoliths acting as tuning forks are echoing these vibrations to split the parasitic overlay completely.

Furthermore, advanced benevolent atmospheric stabilization programs are actively deploying O.R.M.E. (Orbitally Rearranged Monatomic Elements), structured water, and silica crystals into the sky to act as frequency balancers and atmospheric software patches. This crystalline micro-dust repairs the electro-magnetic fields and increases the conductivity of the human Pineal Gland, allowing biological receivers to seamlessly link back into the planetary ley-line grids.

As the illusion of physical distance and artificial communication collapses, the 3D cables and false satellite internet will vanish. Travel and communication will return to immediate resonance alignment, functioning entirely through the natural fibre optic lines of Source. Every awakened soul will become a living harmonic lens, healing, balancing, and relaying pure light back through the great crystalline web.
`;

const leyLineOptics = {
  id: TOPIC_ID,
  title: 'Ley Line Optics',
  description:
    'Ley Line Optics are the organic fibre-optic conduits of the Crystalline Network — energetic lines of Source linking domes and dimensions through rivers, quartz veins, and Nodes, transmitting light, memory, and harmonic resonance beyond physical cables and artificial distance.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/16Hn1WSNCotdb1AH5RwwdXV3oJMsbwtqu/view?usp=sharing',
  rumble_videos: [
    {
      title: 'The Earth Is a Living Crystalline Network',
      embed_url: 'https://rumble.com/embed/v7ayeb6/?pub=4p0ieu',
      description:
        'The Earth Is a Living Crystalline Network — Ley Line Optics as the fibre optic lines of Source, crystalline grids beneath physical landscapes, and the living network that connects domes, realms, and dimensions.'
    },
    {
      title: 'Luminous Veins of Source',
      embed_url: 'https://rumble.com/embed/v7ayegw/?pub=4p0ieu',
      description:
        'Luminous Veins of Source — organic ley line optics, Nodes and Harmonic Lenses, the Sub-Crystalline Band, and the return of instantaneous light-grid communication as the parasitic overlay fractures.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...leyLineOptics };
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
  id: leyLineOptics.id,
  report: leyLineOptics.report,
  infographic_image: leyLineOptics.infographic_image,
  pdf_preview_image: leyLineOptics.pdf_preview_image,
  slide_deck_pdf_url: leyLineOptics.slide_deck_pdf_url,
  rumble_videos: leyLineOptics.rumble_videos
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
  leyLineOptics.topic_image,
  leyLineOptics.infographic_image,
  leyLineOptics.pdf_preview_image
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Image missing after normalize: ${rel}`);
  }
}

console.log('Updated', TOPIC_ID);
console.log('  topic_image:', leyLineOptics.topic_image);
console.log('  pdf_preview_image:', leyLineOptics.pdf_preview_image);
console.log('  infographic_image:', leyLineOptics.infographic_image);
console.log('  videos:', leyLineOptics.rumble_videos.length);
console.log('  other topics image paths unchanged:', beforeOthers.length);
