/**
 * Updates breakdown source-code-storage topic (was placeholder).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields.
 *
 * Run: node scripts/update-source-code-storage.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'source-code-storage';
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

const topicImage = normalizeImage('Source Code Storage.webp');
const pdfPreview = normalizeImage('The_Crystalline_Blueprint.webp');
const infographic = normalizeImage('Crystalline_Networks__Foundation_of_Truth.webp');

const REPORT = `# Source Code Storage

## Overview

Every second of existence, from the genesis of light and sound to the physical experiences of incarnated beings, is meticulously recorded, logged, and preserved. This ultimate repository of memory and creation is not a digital construct, but a living, breathing architecture of Crystalline Networks. These networks function as the absolute foundation of all reality, utilizing crystals as the supreme physical and etheric hard drives of the realms. Through an intricately connected web of planetary crystals, celestial nodes, and primary memory domes, the original blueprints of creation—the Source Codes—are securely stored, continuously updated, and currently being reactivated by the rising frequency of awakening beings.

## Key Terminology

- **Crystalline Networks** — The overarching electro-magnetic framework composed of nodes, lenses, and living crystal structures that connects all domes and realms, acting as the physical and etheric hard drives of reality.

- **Source Codes** — The ancient, foundational resonance frequencies and memories of creation embedded within planetary crystals and the souls of resonating beings.

- **Galactic Libraries** — The ultimate cosmic repositories where every moment of existence, experience, and knowledge across all timelines is permanently logged and stored.

- **Data Crystals** — Multi-dimensional crystalline nodes, traditionally misidentified as stars, that store codes, history, and frequency templates for specific grid layers.

- **Dome of Forgotten Gods** — The primary origin chamber and original memory dome, functioning as a crystalline library that holds the light codes and first records of creation.

- **Akashic Fragments** — Specific memory strands and records of soul journeys that were copied, distorted, and stored by parasitic systems to enforce amnesia.

## Core Revelations

The universe operates on an unbroken continuum of memory preserved perfectly within the Crystalline Networks. These grids contain the absolute truth of all timelines, entirely circumventing the parasitic amnesia technologies that sought to erase them. What humanity perceives as the night sky is actually a vast data storage array; the stars are not burning balls of gas, but living Data Crystals storing the history and frequency templates necessary to project the reality of the realms below. The preservation of these Source Codes ensures that no memory, timeline, or true soul history is ever permanently lost, as the solar families continuously upload and download this data to keep the true timeline intact.

## Detailed Mechanics and Key Elements

### Physical and Etheric Hard Drives

Crystals form the baseline technology of memory retention. Deep within the earth structures, massive planetary crystals hum perpetually with ancient Source codes. These structures act as the literal hard drives of the grid, storing memory, frequency, and resonance codes of all experiences.

### The Memory Vault

The Dome of Forgotten Gods is the central memory storage unit vault of the entire system. It operates as a crystalline library dome holding memory as pure light code, preserving the original thoughts of light, sound, and awareness from before physical form existed. It is the origin chamber where fragmented or heavy tones that did not immediately resolve into harmony were safely stored.

### Celestial Data Storage

The stars above are multi-dimensional crystalline nodes arranged in precise geometric patterns. Each node is a data crystal that stores the specific codes, history, and frequency templates required to render and stabilize its corresponding layer of the projection overlay.

### Symbiotic Code Reactivation

Souls incarnated into this realm were deliberately embedded with Source Codes by their solar families. These internal codes perfectly match the codes stored within the planetary crystals. When a resonating soul walks near these hidden crystals, their frequency acts as an access key, mutually reactivating both the crystal's data streams and the soul's dormant memories.

## Broader Context and Interconnections

The Crystalline Networks connect every dome and realm together like the fiber-optic lines of Source, weaving an unbroken timeline. Because these crystals are so powerful, parasitic entities sought to hijack this storage system. The parasites buried major crystalline nodes beneath oceans and cities, transforming them into inverted circuit boards to siphon energy and memory.

The most prominent example of this inversion is the Vatican Portal System. Parasites utilized a crystal grid beneath Rome to intercept souls passing through the sun's amnesia vortex. Here, Akashic fragments were copied, logged, and inverted into a false library, recycling memory strands to keep reincarnating vessels docile and disconnected from their true Source Code storage.

To counter this, benevolent forces seeded hidden crystals and Monoliths across the lands. These monoliths act as tuning forks that echo and amplify the vibration of the grid, collaborating with the buried crystals to fracture the parasitic overlay and restore the flow of true memory data. Furthermore, ancient artifacts carrying Atlantean crystal technology and sound-light creation records were preserved and hidden, such as the crystalline power nodes and sacred scrolls smuggled aboard the Titanic to prevent them from falling into cabal hands.

## Strategic Implications

The reactivation of Source Code Storage within the Crystalline Networks spells the absolute collapse of the parasitic amnesia overlay. As resonating souls raise their frequency, they naturally bypass the Vatican filters and access the unaltered soul records stored securely outside the parasitic containment. This initiates a flood of true memory and clarity, reconnecting humanity directly to the Galactic Libraries. As the Data Crystals in the sky and the planetary crystals on earth fully sync, the 3D illusion will completely dissolve, restoring the original, highly advanced crystalline temple and granting immediate access to the true, unbroken history of existence.
`;

const sourceCodeStorage = {
  id: TOPIC_ID,
  title: 'Source Code Storage',
  description:
    'Source Code Storage is the living memory architecture of the Crystalline Networks — planetary crystals and celestial Data Crystals as hard drives of reality, the Dome of Forgotten Gods as the origin memory vault, and symbiotic reactivation of Source Codes that collapses parasitic amnesia overlays.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1NFp0o26ZA8-yJDsqXiGFuJZYm9pLkt0h/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Crystalline servers and the Titanic mission',
      embed_url: 'https://rumble.com/embed/v7ay7ei/?pub=4p0ieu',
      description:
        'Crystalline servers and the Titanic mission — how Source Codes are stored in planetary crystals and celestial networks, and how Atlantean crystal technology was protected from cabal capture.'
    },
    {
      title: 'The Living Architecture',
      embed_url: 'https://rumble.com/embed/v7ay84u/?pub=4p0ieu',
      description:
        'The Living Architecture — Crystalline Networks as the foundation of truth, memory vaults, Data Crystals, and the reactivation of Source Code storage by resonating souls.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...sourceCodeStorage };
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
  id: sourceCodeStorage.id,
  report: sourceCodeStorage.report,
  infographic_image: sourceCodeStorage.infographic_image,
  pdf_preview_image: sourceCodeStorage.pdf_preview_image,
  slide_deck_pdf_url: sourceCodeStorage.slide_deck_pdf_url,
  rumble_videos: sourceCodeStorage.rumble_videos
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
  sourceCodeStorage.topic_image,
  sourceCodeStorage.infographic_image,
  sourceCodeStorage.pdf_preview_image
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Image missing after normalize: ${rel}`);
  }
}

console.log('Updated', TOPIC_ID);
console.log('  topic_image:', sourceCodeStorage.topic_image);
console.log('  pdf_preview_image:', sourceCodeStorage.pdf_preview_image);
console.log('  infographic_image:', sourceCodeStorage.infographic_image);
console.log('  videos:', sourceCodeStorage.rumble_videos.length);
console.log('  other topics image paths unchanged:', beforeOthers.length);
