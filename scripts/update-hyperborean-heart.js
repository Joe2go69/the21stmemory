/**
 * Installs / updates breakdown hyperborean-heart topic.
 * Renames source images to kebab-case without overwriting existing paths.
 * Does not modify other topics' image fields.
 * Run: node scripts/update-hyperborean-heart.js && node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'hyperborean-heart';
const IMG_DIR = path.join(ROOT, 'images', 'breakdown');

/**
 * Rename map: source on disk → normalized kebab-case basename.
 * PDF preview source collides with existing spirit-tree-awakening.webp (different file) —
 * use a distinct name so we never overwrite other topics' assets.
 */
const IMAGE_RENAMES = [
  {
    from: 'Hyperborean Heart.webp',
    to: 'hyperborean-heart.webp',
    role: 'topic_image',
  },
  {
    from: 'Spirit_Tree_Awakening.webp',
    to: 'hyperborean-heart-pdf-preview.webp',
    role: 'pdf_preview_image',
  },
  {
    from: 'Living_Pulse_of_Hyperborean_Heart.webp',
    to: 'living-pulse-of-hyperborean-heart.webp',
    role: 'infographic_image',
  },
];

function ensureNormalizedImages() {
  for (const { from, to } of IMAGE_RENAMES) {
    const fromPath = path.join(IMG_DIR, from);
    const toPath = path.join(IMG_DIR, to);

    if (fs.existsSync(toPath)) {
      if (!fs.existsSync(fromPath) && fs.existsSync(toPath)) {
        console.log(`OK (already normalized): ${to}`);
        continue;
      }
      if (fs.existsSync(fromPath) && fs.existsSync(toPath)) {
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

const REPORT = `# Hyperborean Heart

## Overview

Hyperborea is the true living resonance field and the beating heart of the entire CUBE SYSTEM, currently hidden beneath the holographic illusion that humanity perceives as the frozen wasteland of Antarctica. At the exact center of this great circular land once stood the Spirit Tree, the supreme central node and axis of consciousness for the KNOWN LANDS. Planted by the LYRAN BUILDERS-ARCHITECTS, this monumental structure generated a continuous, pure flow of bright light through sound and vibration. Before its orchestrated removal by parasitic forces, the Spirit Tree served as the primary anchor to SOURCE, pumping harmonic currents throughout all physical realms and interlinking the central plane with the higher dimensional spheres.

## Key Terminology

- **Hyperborea** — The living resonance field and central heartbeat of the 178 physical worlds and 8 domes, heavily cloaked beneath the false, projected ice of Antarctica.

- **Spirit Tree** — The central axis of consciousness, serving as the main trunk that bridges the physical domains to the higher realms, feeding them with Source energy.

- **Custodians** — The parasitic priests and frequency lords of the cube who commanded the destruction of the central tree to seize control of the realm's energy flow.

- **Greys** — The bio-engineered, multi-dimensional technicians and demolition engineers weaponized by the Custodians to physically uproot the tree and install the dark technology in its place.

- **VALVE/FILTER** — The advanced machinery inserted into the wound left by the Spirit Tree, designed to siphon pure light and invert it into a false, parasitic matrix.

- **lunar/SATURN GRID** — The primary artificial intelligence hub and counterfeit reincarnation system that receives the hijacked energy from the Hyperborean valve.

- **Aru-el-nai** — The true multi-dimensional North Star (Thuban) that connects directly to the root node of the Spirit Tree, serving as the authentic crystalline axis for all grid alignments.

## Core Revelations

The frozen continent of Antarctica is a severe distortion; it is actually Hyperborea, the central anchor of the GREAT DOME. The Spirit Tree once stood there as a direct, physical link to the SOLAR FAMILY and Source. Because the parasitic entities could not sever the connection to Source directly, they were forced to physically remove the tree and hijack the energy pathways. The tree was uprooted and replaced with BLACK CUBE TECH, which reversed the outward-flowing life force into an inward-sucking vacuum that feeds the parasitic overlays. Despite this devastating extraction, the essence of the tree was not fully destroyed; its vast, multi-dimensional root system remains alive beneath the surface, waiting for the correct resonant codes to reignite.

## Detailed Mechanics and Key Elements

The Spirit Tree functioned simultaneously as three distinct architectural mechanisms within the realm:

### Central Node of the Great Dome

It pulsed harmonic currents through the crystalline grids, maintaining the foundational heartbeat of the physical domain.

### The Bridge to the Seven Domes

The tree acted as the central trunk, with its roots and branches feeding Source Light directly into the seven outer domes (the "Gardens"), which include the DOME OF FORGOTTEN GODS, Sheol, Silence, Hiva, Titans, Portals, and Five Peaks.

### Power Amplifier

Because the Great Dome was designed with physical density, this density acted as a massive harmonic amplifier that fueled the other higher-frequency domes through the tree's transmission.

To execute the hijack, the Custodians utilized the Greys to tear the Spirit Tree out of Hyperborea. They installed black crystalline valve locks—ancient stabilizers that were inverted to seal the false frequencies into place. The valve machinery siphons the planetary light and routes it to the lunar/Saturn moon frequency station, creating a closed-loop system of energy harvesting and amnesia.

## Broader Context and Interconnections

The health of the entire multi-dimensional ecosystem relies on the Spirit Tree. The Great Dome operates as the trunk, while the seven outer domes serve as the gardens. When the parasites hijacked the trunk, all seven outer gardens wilted and became inverted prisons.

The tree's architecture is also directly tied to the stars. The true North Star, Aru-el-nai, connects straight into the root node of Hyperborea and the central axis of all 178 domes. When the tree was compromised, the parasitic forces physically rotated the projection of the sky, placing Polaris as the new false North Star to blind navigators and lock the grid into their control.

Beneath the physical overlays, the Spirit Tree's surviving roots continue to form the hidden webs, harmonic lenses, nodes, and crystals of the planetary grid. These grids retain the original codes of creation and are actively synchronizing with the E.T. Sols who have incarnated into human vessels.

## Strategic Implications

The parasitic structure is actively fracturing. Positive fleets have relentlessly targeted the Antarctic valve technology, cracking the holographic ice overlays to reveal glimpses of the true Hyperborean land, ancient rivers, and the shadow of the original tree.

Because the root system is alive, it instantly recognizes the harmonic vibration of resonating souls who carry the matching codes. The core SEED codes of the Spirit Tree are carried directly by Thalon, guiding the awakening process and serving as the blueprint for restoration. As the false overlays shatter, the tree's roots light up, restoring the flow of energy outward, starving the artificial Saturn systems, and causing the seven wilting gardens to bloom in harmony once again.
`;

const hyperboreanHeart = {
  id: TOPIC_ID,
  title: 'Hyperborean Heart',
  description:
    'Hyperborea is the living resonance field and beating heart of the CUBE SYSTEM — cloaked as Antarctic ice — where the Spirit Tree once anchored Source Light, was uprooted into valve tech by Custodians and Greys, and still waits as a living root system for resonant reactivation.',
  topic_image: 'images/breakdown/hyperborean-heart.webp',
  is_placeholder: false,
  report: REPORT,
  infographic_image: 'images/breakdown/living-pulse-of-hyperborean-heart.webp',
  pdf_preview_image: 'images/breakdown/hyperborean-heart-pdf-preview.webp',
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1pBnTbXu9T-pHO0nA3clSU3LIoLtPIiG2/view?usp=sharing',
  rumble_videos: [
    {
      title: 'The Spirit Tree Awakens',
      embed_url: 'https://rumble.com/embed/v7b4ota/?pub=4p0ieu',
      description:
        'The Spirit Tree Awakens — Hyperborea as the living heart of the CUBE SYSTEM, the Lyran-planted central axis, and the surviving multi-dimensional root web awaiting resonant codes.',
    },
    {
      title: 'Hyperborea behind the Antarctic ice hologram',
      embed_url: 'https://rumble.com/embed/v7b4p2g/?pub=4p0ieu',
      description:
        'Hyperborea behind the Antarctic ice hologram — valve/filter hijack, lunar-Saturn grid siphon, Aru-el-nai versus Polaris, and the fracturing of parasitic ice overlays over the living land.',
    },
  ],
};

function collectImageFields(topics, out = []) {
  for (const t of topics || []) {
    for (const key of [
      'topic_image',
      'infographic_image',
      'pdf_preview_image',
    ]) {
      if (t[key]) out.push({ id: t.id, key, path: t[key] });
    }
    if (t.subtopics) collectImageFields(t.subtopics, out);
  }
  return out;
}

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const prev = topics[i];
      topics[i] = {
        ...prev,
        title: hyperboreanHeart.title,
        description: hyperboreanHeart.description,
        topic_image: hyperboreanHeart.topic_image,
        is_placeholder: false,
        report: hyperboreanHeart.report,
        infographic_image: hyperboreanHeart.infographic_image,
        pdf_preview_image: hyperboreanHeart.pdf_preview_image,
        slide_deck_pdf_url: hyperboreanHeart.slide_deck_pdf_url,
        rumble_videos: hyperboreanHeart.rumble_videos,
      };
      // Preserve quiz if present
      if (prev.quiz) topics[i].quiz = prev.quiz;
      // Do not leave stale is_placeholder true
      delete topics[i].is_placeholder;
      topics[i].is_placeholder = false;
      return true;
    }
    if (topics[i].subtopics && findAndUpdate(topics[i].subtopics)) {
      return true;
    }
  }
  return false;
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
  id: hyperboreanHeart.id,
  report: hyperboreanHeart.report,
  infographic_image: hyperboreanHeart.infographic_image,
  pdf_preview_image: hyperboreanHeart.pdf_preview_image,
  slide_deck_pdf_url: hyperboreanHeart.slide_deck_pdf_url,
  rumble_videos: hyperboreanHeart.rumble_videos,
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
  hyperboreanHeart.topic_image,
  hyperboreanHeart.infographic_image,
  hyperboreanHeart.pdf_preview_image,
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing image file: ${rel}`);
  }
}

// Unique ownership: no other topic may share these image paths
const ours = new Set([
  hyperboreanHeart.topic_image,
  hyperboreanHeart.infographic_image,
  hyperboreanHeart.pdf_preview_image,
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
  '## Strategic Implications',
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
if (hyperboreanHeart.report.includes('TODO')) {
  throw new Error('Report still contains TODO');
}

// Ensure kebab-case image paths only
for (const rel of [
  hyperboreanHeart.topic_image,
  hyperboreanHeart.infographic_image,
  hyperboreanHeart.pdf_preview_image,
]) {
  const base = path.basename(rel);
  if (base !== base.toLowerCase() || /[_\s]/.test(base)) {
    throw new Error(`Image path not normalized kebab-case: ${rel}`);
  }
}

// Confirm parent chain still has spirit-tree siblings intact
const spiritTree = findNode(node.topics, 'the-spirit-tree');
if (!spiritTree) {
  throw new Error('Parent the-spirit-tree not found');
}
const expectedSiblings = ['central-axis', 'hyperborean-heart', 'source-bridge'];
const gotSiblings = (spiritTree.subtopics || []).map((s) => s.id);
for (const id of expectedSiblings) {
  if (!gotSiblings.includes(id)) {
    throw new Error(`Missing sibling/self under the-spirit-tree: ${id}`);
  }
}

console.log(`Updated ${TOPIC_ID} topic file and breakdown-topics.json`);
console.log(
  'Images verified:',
  [
    hyperboreanHeart.topic_image,
    hyperboreanHeart.infographic_image,
    hyperboreanHeart.pdf_preview_image,
  ].join(', ')
);
console.log('PDF:', hyperboreanHeart.slide_deck_pdf_url);
console.log(
  'Videos:',
  hyperboreanHeart.rumble_videos.map((v) => v.title).join(' | ')
);
