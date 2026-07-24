/**
 * Updates breakdown starseed-keys topic (was placeholder under Crystalline Networks).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields.
 *
 * Run: node scripts/update-starseed-keys.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'starseed-keys';
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

// Topic / lesson card first so it claims starseed-keys.webp.
const topicImage = normalizeImage('Starseed Keys.webp');
const pdfPreview = normalizeImage('Activating_the_Crystalline_Grid.webp');
const infographic = normalizeImage('Resonance_Codes_of_Starseed_Keys.webp');

const REPORT = `# Starseed Keys

## Overview

Starseed Keys are ancient, hidden crystals seeded across the Known Lands by Starseed Families long before the current cycles of amnesia. These keys serve as vital physical and etheric components of the vast Crystalline Network that forms the true architecture of the Great Dome. Designed to hold pure frequency and memory, these keys act as dormant activators waiting for the precise vibrational match to trigger. They are now being systematically activated by the elevated frequency and vibration of the Resonating Army, initiating the total collapse of the Parasitic Overlay and restoring the original harmonic structure of reality.

## Key Terminology

- **Starseed Keys** — Hidden placed crystals seeded across the Known Lands in antiquity by Starseed families, designed to store memory and activate the planetary grid when met with the correct frequency.

- **Crystalline Network** — The underlying electro-magnetic framework of living light structures, crystals, and harmonic lenses that connects all domes and realms together like fiber optics of Source.

- **Resonance Codes** — Ancient harmonic frequencies embedded simultaneously within both the planetary crystals and the souls of awakened beings, ensuring an exact vibrational match for grid activation.

- **Monoliths** — Advanced tuning-fork technologies embedded in the realm to act as backups to the Starseed Keys, mirroring and echoing vibration to boost the crystalline grid.

- **Parasitic Overlay** — A false holographical projection field and illusion grid that masks the true living crystal architecture of the realm, manipulating 3D perception to make the environment appear as dead stone, dirt, and concrete.

## Core Revelations

The Starseed Keys were planted as a failsafe mechanism by off-world families to guarantee that the true memory and function of the Known Lands would never be permanently lost. These crystals function as physical and etheric hard drives of the grid, storing the unbroken timeline of soul journeys and the pristine memory codes of Source.

The keys are not triggered by physical manipulation but through exact harmonic resonance. Sols incarnating into this realm were embedded with the exact same Resonance Codes held by the Starseed Keys. As these beings raise their frequency, their internal codes automatically collaborate with the crystal keys, initiating a massive grid activation that the parasitic systems cannot stop.

## Detailed Mechanics and Key Elements

### Data Storage and Transmission

The crystals act as the central memory banks of the realm, recording every moment of existence and logging it into Galactic Libraries. They hold the memory of soul journeys, preserving the history and knowledge that amnesia tech attempts to suppress.

### Activation and Resonance

Activation is an automatic, vibrational process. The frequency emitted by resonating souls unknowingly and continuously interacts with the Starseed Keys. Surface crystals, including quartz veins, mountains, and natural outcrops, serve as massive antennas that catch and broadcast these codes.

### Monolith Support Structures

To ensure the grid reaches the required amplitude during the event cycles, Monoliths were embedded as advanced backup tech. These structures are not built by humans; they are tuning forks designed to mirror and echo the vibration of the Starseed Keys. When the Crystalline Network reverberates, the Monoliths boost the crystal signals, creating a frequency wave powerful enough to literally split the Parasitic Overlay.

### Grid Connectivity

The Starseed Keys connect all domes, realms, and inner simulations together. They function as the fiber optic lines of Source, weaving a continuous web of light that bridges the physical plane directly to the solar families and positive ET fleets waiting outside the immediate overlay.

## Broader Context and Interconnections

The entire physical plane is a singular, massive crystalline temple. To maintain control, parasitic forces buried the main grid of the crystalline world—including the Starseed Keys—under oceans, deserts, soil, and modern cities. They painted over these sacred Harmonic Lenses and nodes with an illusion web grid, manipulating human perception so that individuals walk over ancient, humming crystal keys daily while only seeing and feeling dead concrete, dirt, or ruins.

Because the Starseed Keys are part of the original Lyran Lineage architecture, their activation cuts straight through this 3D construction. The continuous hum of the activating keys reconnects the fractured timelines, bypassing the hijacked Vatican memory archives and drawing direct upload data from the unaltered solar records outside the Cube Containment.

## Strategic Implications

The activation of the Starseed Keys initiates the final collapse of the 3D density constructs. As the frequency of the keys rises, the holographical projection of the Parasitic Overlay glitches and fractures. This will cause the environment to shimmer and bend, eventually dropping the false sky and dissolving the 3D construction materials.

For the Resonating Army, the keys provide the necessary frequency anchors to seamlessly transition into the pure, vibrant reality of the original realm. The activated Crystalline Network will strip away the illusion of distance and separation, restoring immediate harmonic travel and full telepathic connection with the solar families overseeing the Great Awakening.
`;

const starseedKeys = {
  id: TOPIC_ID,
  title: 'Starseed Keys',
  description:
    'Starseed Keys are ancient hidden crystals seeded across the Known Lands by Starseed Families — dormant activators of the Crystalline Network, triggered by Resonance Codes in awakened souls to collapse the Parasitic Overlay and restore the original harmonic realm.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1HpA068-DL8xOuJOps6xrrTJGV6t1BMr4/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Starseed Keys Are Activating the Crystalline Network',
      embed_url: 'https://rumble.com/embed/v7azuqs/?pub=4p0ieu',
      description:
        'Starseed Keys Are Activating the Crystalline Network — ancient hidden crystals as failsafe memory hard drives, Resonance Codes shared with resonating sols, and systematic activation collapsing the Parasitic Overlay.'
    },
    {
      title: 'Echoes of the Living Grid',
      embed_url: 'https://rumble.com/embed/v7azv44/?pub=4p0ieu',
      description:
        'Echoes of the Living Grid — Monoliths as tuning-fork backups, surface crystals as antennas, fiber-optic connectivity across domes, and the Resonating Army anchoring transition into the original crystalline realm.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...starseedKeys };
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
  id: starseedKeys.id,
  report: starseedKeys.report,
  infographic_image: starseedKeys.infographic_image,
  pdf_preview_image: starseedKeys.pdf_preview_image,
  slide_deck_pdf_url: starseedKeys.slide_deck_pdf_url,
  rumble_videos: starseedKeys.rumble_videos
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
  starseedKeys.topic_image,
  starseedKeys.infographic_image,
  starseedKeys.pdf_preview_image
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Image missing after normalize: ${rel}`);
  }
}

console.log('Updated', TOPIC_ID);
console.log('  topic_image:', starseedKeys.topic_image);
console.log('  pdf_preview_image:', starseedKeys.pdf_preview_image);
console.log('  infographic_image:', starseedKeys.infographic_image);
console.log('  videos:', starseedKeys.rumble_videos.length);
console.log('  other topics image paths unchanged:', beforeOthers.length);
