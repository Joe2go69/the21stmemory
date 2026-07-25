/**
 * Installs / updates breakdown central-axis topic.
 * Renames source images to kebab-case without overwriting existing paths.
 * Does not modify other topics' image fields.
 * Run: node scripts/update-central-axis.js && node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'central-axis';
const IMG_DIR = path.join(ROOT, 'images', 'breakdown');

/** Rename map: source on disk → normalized kebab-case basename */
const IMAGE_RENAMES = [
  {
    from: 'Central Axis.webp',
    to: 'central-axis.webp',
    role: 'topic_image'
  },
  {
    from: 'Axis_Labernum.webp',
    to: 'axis-labernum.webp',
    role: 'pdf_preview_image'
  },
  {
    from: 'Axis_Labernum_Spirit_Tree_Awakening.webp',
    to: 'axis-labernum-spirit-tree-awakening.webp',
    role: 'infographic_image'
  }
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

const REPORT = `# Central Axis

## Overview

The Spirit Tree stands as the main Axis of consciousness for the KNOWN LANDS and the central anchor of Source. It operates as the foundational heart of the entire CUBE System, pulsing harmonic currents through crystalline grids to maintain the structural and energetic integrity of the Great Dome. Operating as a vertical current of order, this Central Axis ensures the heavens remain aligned with the earth, acting as a living harmonic bridge between realms. Although the physical manifestation of the tree was forcefully removed and replaced with parasitic technology, its roots remain alive, forming the interconnected web of nodes and lenses that are currently being reactivated by resonating sols.

## Key Terminology

- **The Spirit Tree** — The central node and main axis of consciousness of the Great Dome, acting as a trunk that feeds Source Light to all other domes through its roots and branches.

- **Axis Labernum** — The true harmonic bridge and vertical current of light that roots in the crystalline grids of the KNOWN LANDS and branches out to the field of star-nodes.

- **Hyperborea** — The living resonance field and heart of the CUBE System where the Spirit Tree originally stood.

- **Aru-el-nai** — The multi-dimensional name for the original North Star (Thuban), serving as a crystalline node that aligns with the central axis of all 178 physical domes.

- **Valve** — The advanced Black Cube Tech machinery inserted into the planetary wound after the Spirit Tree was removed, designed to siphon light and invert it into a false lunar grid.

## Core Revelations

The Spirit Tree was originally planted and built by LYRAN BUILDERS-ARCHITECTS as a creation of the Dome of Forgotten Gods. Its purpose was to generate a continuous, pure flow of bright light created by sound and vibration. This central trunk connected directly to the Seven Domes outside the Great Dome, acting as the primary feeder of Source Light.

When parasitic forces, specifically the Custodians utilizing Greys for their advanced multi-dimensional engineering skills, ordered the removal of the tree, they severed this direct link to Source and the Solar Family. In its place, they installed the Valve, connecting the system to the Lands of Saturn and creating a counterfeit cycle of reincarnation and energy harvest.

## Detailed Mechanics and Key Elements

The functionality of the Central Axis and the Spirit Tree operates through three primary mechanisms:

### Central Node of the Great Dome

The tree acts as the heartbeat of the realm, pulsing harmonic currents through the crystalline grids.

### Bridge to Other Domes

Functioning as the trunk, the tree feeds the Seven Domes (the gardens) with Source Light through an extensive network of roots and branches.

### Power Amplifier

The density of the physical Great Dome acts as a harmonic amplifier, fueling the resonance that spreads back outward to the higher light worlds.

The vertical alignment of this system is anchored by Aru-el-nai (Thuban). This crystalline node connects directly to the root node of Hyperborea and holds the vertical axis for the overlay grids, linking the earth grids to the upper realms. Thuban represents the spinal column of this realm's energy body, establishing the fixed line of balance that early builders aligned all their temples and pyramids toward.

## Broader Context and Interconnections

The concept of the Central Axis is echoed across human cultures as the world tree, the pillar of light, Yggdrasil, the Djed, the Tree of Life, or the Axis Mundi. In the true framework, this is the Axis Labernum. The roots of the Spirit Tree extend deeply into the realms, forming the Light Grids, Harmonic Lenses, and Crystals that cover the earth.

When the Custodians twisted the fields, they realigned the sky map and rotated the projection dome to establish a new parasitic north, utilizing Polaris to mask the true axis. However, Thuban continues to quietly hum its original frequency behind the distortion. The Black Crystals currently found in Antarctica are fragments of the Foundation Pillars that once provided stability between the domes, inverted by the parasites to function as frequency locks.

## Strategic Implications

The reawakening of the Axis Labernum does not require a physical repair, but rather a realignment of thought, compassion, and cooperation with the vertical current. Because the essence and root system of the Spirit Tree were never fully destroyed, positive E.T. fleets and resonating sols can reactivate these grids. Thalon carries the Seed Codes of the Spirit Tree, which recognize the embedded codes within human and E.T. sols. As the false overlays and frequency grids fracture, the tree roots light up again, and the seven outside gardens return to their true, harmonious design.
`;

const centralAxis = {
  id: TOPIC_ID,
  title: 'Central Axis',
  description:
    'The Central Axis is the Spirit Tree as the main axis of consciousness for the KNOWN LANDS — Axis Labernum, Hyperborea, Thuban (Aru-el-nai), the Valve hijack, and the reawakening of the living root web.',
  topic_image: 'images/breakdown/central-axis.webp',
  report: REPORT,
  infographic_image: 'images/breakdown/axis-labernum-spirit-tree-awakening.webp',
  pdf_preview_image: 'images/breakdown/axis-labernum.webp',
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1o6s15WLMzS8s5vT_3rNpf4wHNi4Z8Cf9/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Reclaiming the Spirit Tree and Thuban',
      embed_url: 'https://rumble.com/embed/v7b1ulq/?pub=4p0ieu',
      description:
        'Reclaiming the Spirit Tree and Thuban — Central Axis as the main axis of consciousness, Axis Labernum, Hyperborea, and the original North Star alignment.'
    },
    {
      title: 'Heartbeat of the Realm',
      embed_url: 'https://rumble.com/embed/v7b1uvk/?pub=4p0ieu',
      description:
        'Heartbeat of the Realm — Valve hijack, crystalline root web, Seed Codes, and the reawakening of the Spirit Tree as the vertical current of order returns.'
    }
  ]
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...centralAxis, is_placeholder: false };
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
  id: centralAxis.id,
  report: centralAxis.report,
  infographic_image: centralAxis.infographic_image,
  pdf_preview_image: centralAxis.pdf_preview_image,
  slide_deck_pdf_url: centralAxis.slide_deck_pdf_url,
  rumble_videos: centralAxis.rumble_videos
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
  centralAxis.topic_image,
  centralAxis.infographic_image,
  centralAxis.pdf_preview_image
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing image file: ${rel}`);
  }
}

// Unique ownership: no other topic may share these image paths
const ours = new Set([
  centralAxis.topic_image,
  centralAxis.infographic_image,
  centralAxis.pdf_preview_image
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
if (centralAxis.report.includes('TODO')) {
  throw new Error('Report still contains TODO');
}

// Ensure kebab-case image paths only
for (const rel of [
  centralAxis.topic_image,
  centralAxis.infographic_image,
  centralAxis.pdf_preview_image
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
    centralAxis.topic_image,
    centralAxis.infographic_image,
    centralAxis.pdf_preview_image
  ].join(', ')
);
console.log('PDF:', centralAxis.slide_deck_pdf_url);
console.log(
  'Videos:',
  centralAxis.rumble_videos.map((v) => v.title).join(' | ')
);
