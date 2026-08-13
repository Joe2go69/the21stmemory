/**
 * Updates breakdown overlay-clearing topic (was placeholder under Crystal Halls).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields. On collision, appends -2, -3…
 *
 * Run: node scripts/update-overlay-clearing.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'overlay-clearing';
const BREAKDOWN_IMG = path.join(ROOT, 'images', 'breakdown');

const TOPIC_MAX_EDGE = 1400;
const TOPIC_QUALITY = 80;
const INFOGRAPHIC_QUALITY = 85;
const PDF_QUALITY = 82;

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
function normalizeImage(sourceName, preferredTarget) {
  const src = path.join(BREAKDOWN_IMG, sourceName);
  if (!fs.existsSync(src)) {
    if (preferredTarget) {
      const pref = path.join(BREAKDOWN_IMG, preferredTarget);
      if (fs.existsSync(pref)) {
        console.log(`OK (already normalized): ${preferredTarget}`);
        return `images/breakdown/${preferredTarget}`;
      }
    }
    const kebab = toKebab(sourceName);
    const kebabFull = path.join(BREAKDOWN_IMG, kebab);
    if (fs.existsSync(kebabFull)) {
      console.log(`OK (already normalized): ${kebab}`);
      return `images/breakdown/${kebab}`;
    }
    throw new Error(`Source image missing: images/breakdown/${sourceName}`);
  }

  let targetName = preferredTarget || toKebab(sourceName);
  let n = 2;
  while (true) {
    const dest = path.join(BREAKDOWN_IMG, targetName);
    if (path.resolve(src) === path.resolve(dest)) {
      return `images/breakdown/${targetName}`;
    }
    if (!fs.existsSync(dest)) break;
    const fromStat = fs.statSync(src);
    const toStat = fs.statSync(dest);
    if (fromStat.size === toStat.size) {
      fs.unlinkSync(src);
      console.log(`Removed duplicate source (same size as ${targetName}): ${sourceName}`);
      return `images/breakdown/${targetName}`;
    }
    const ext = path.extname(preferredTarget || toKebab(sourceName));
    const stem = path.basename(preferredTarget || toKebab(sourceName), ext);
    targetName = `${stem}-${n}${ext}`;
    n += 1;
  }

  fs.renameSync(src, path.join(BREAKDOWN_IMG, targetName));
  console.log(`Renamed: ${sourceName} → ${targetName}`);
  return `images/breakdown/${targetName}`;
}

async function compressImage(relPath, { maxEdge = null, quality = 80 } = {}) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing image for compress: ${relPath}`);
  }
  const before = fs.statSync(full).size;
  const input = fs.readFileSync(full);
  const meta = await sharp(input, { failOn: 'none' }).metadata();
  const w = meta.width || 0;
  const h = meta.height || 0;
  if (!w || !h) {
    console.warn(`Skip compress (no dimensions): ${relPath}`);
    return;
  }

  let pipeline = sharp(input, { failOn: 'none' });
  if (maxEdge) {
    const long = Math.max(w, h);
    if (long > maxEdge) {
      if (w >= h) pipeline = pipeline.resize({ width: maxEdge, withoutEnlargement: true });
      else pipeline = pipeline.resize({ height: maxEdge, withoutEnlargement: true });
    }
  }

  const outBuf = await pipeline
    .webp({ quality, alphaQuality: 90, effort: 5 })
    .toBuffer();

  if (outBuf.length >= before * 0.97) {
    console.log(
      `Compress skip (no gain): ${path.basename(relPath)} ${Math.round(before / 1024)}KB`
    );
    return;
  }

  fs.writeFileSync(full, outBuf);
  const afterMeta = await sharp(outBuf, { failOn: 'none' }).metadata();
  console.log(
    `Compressed: ${path.basename(relPath)} ${Math.round(before / 1024)}→${Math.round(outBuf.length / 1024)}KB ` +
      `(${w}x${h}→${afterMeta.width}x${afterMeta.height}, q=${quality})`
  );
}

const topicImage = normalizeImage('Overlay Clearing.webp', 'overlay-clearing.webp');
const pdfPreview = normalizeImage(
  'Crystalline_Energetic_Liberation.webp',
  'overlay-clearing-pdf-preview.webp'
);
const infographic = normalizeImage(
  'The_Crystal_Halls_Overlay_Clearing.webp',
  'the-crystal-halls-overlay-clearing.webp'
);

const REPORT = `# Overlay Clearing

## Overview

The process of overlay clearing represents the absolute energetic liberation of consciousness from artificial, low-frequency electromagnetic containment. Within the Crystal Halls—profoundly advanced energetic temples currently disguised from human senses as historical cathedrals, churches, and abbeys—this clearing targetedly heals and restores the mind. These massive architectural structures are actually constructed of living crystal, but they are cloaked beneath a dense, three-dimensional parasitic overlay that manipulates the sensory nervous system to make them appear as dead stone, brick, concrete, and soil. When a soul enters these sacred spaces, this artificial camouflage dissolves, exposing the active crystalline architecture beneath. The primary function of these installations is to mend the mind, purge systemic cognitive damage, realign the light body, and dismantle the perceptual traps that keep human souls locked in recursive cycles of amnesia and limitation.

## Key Terminology

- **Crystal Halls** — Mental and energetic healing temples composed of living crystal walls, breathing columns of light, and humming slabs, historically camouflaged in 3D perception as cathedrals, abbeys, and churches.

- **Overlay Clearing** — The systematic dissolution of artificial, low-frequency holographical projection fields, restoring the pristine, underlying crystalline reality.

- **Parasitic Overlay** — A frequency-based sensory illusion projected over the true fabric of the realm, designed to trick the nervous system into perceiving living crystal as dead matter like concrete, brick, or dirt.

- **Light Body Grid** — The foundational energetic circuit template of the soul which is realigned and restored to its original creation-level frequency during healing.

- **Parasite Whispers** — Artificial thoughts, low-frequency neurological programming, and cognitive distortions broadcast into the mind to disrupt sovereignty.

- **Crystal Slabs** — Highly advanced, humming quartz-like platforms within the temples used to transmit targeted harmonic frequencies into hovering souls.

- **Conscious Orbs** — The natural, energetic state of the soul as a ball of electricity prior to or during its integration with a physical vessel.

## Core Revelations

The physical edifices known to humanity as cathedrals, churches, and abbeys are not monuments of religious devotion, but are rather highly sophisticated, pre-existing healing chambers that have been co-opted, buried, or built on top of by parasites to suppress their natural harmonic output. They are constructed of pure crystalline material, quartz, and living granite, glowing with rainbow fractals and breathing like lungs of light. The ultimate truth of overlay clearing is that the three-dimensional solidity of the world is entirely perception-based. Bricks, plaster, glass, and metal are low-frequency holographical projections that collapse when matched with a high enough frequency. Realignment within the Crystal Halls completely neutralizes these cognitive control grids, restoring the soul's inherent capacity for manifestation, telepathic navigation, and multi-dimensional awareness.

## Detailed Mechanics and Key Elements

The operational sequence of overlay clearing inside the Crystal Halls relies entirely on precise vibrational physics. The healing process initiates when human and starseed souls enter the temple, shifting into their crystalline body selves. In this state, they function as conscious orbs of electricity, hovering above massive crystal slabs that emit a continuous, deep harmonic hum. This specialized resonance is calibrated to match the pristine ancient Source codes of creation, which are naturally embedded within the soul's template.

As the soul floats, light passes through specialized crystal prisms, refracting directly into the light body grid. This targeted light infusion systematically dissolves energetic distortion, cognitive blockages, and mind control damage. The living crystal walls, which shimmer with iridescent colors, act as natural crystalline amplifiers. The columns of the temple literally breathe with light, matching the expansion and contraction of pure consciousness to purge foreign implants, psychic drains, and parasitic programming.

The specific mechanics of this clearing address several layers of neurological and energetic interference:

### Reactivation of Harmonic Coding

The continuous hum of the crystal slabs restores the soul's original, undistorted signature, which has been scrambled by artificial scalar weapons, music grid glitches, and electromagnetic noise.

### Restoration of Memory Streams

Overlays of artificial amnesia are systematically peeled away. The crystal structures download the unbroken timeline of the soul's multi-dimensional journey, which is permanently logged in the galactic libraries and preserved by the earth's deep crystal hard drives.

### Neutralization of Parasitic Whispers

The clearing permanently silences the low-frequency background noise, artificial voices, and NPC programming that prompt behaviors of fear, guilt, anger, or despair.

### Perceptual Alignment

As the frequency of the light body increases, the illusion of hollow 3D scaffolding, concrete cities, and artificial borders begins to flicker, bend, and shimmer, allowing the soul to see the vibrant, unpolluted reality of the Second Realm.

Upon completing this structural recalibration, souls emerge completely unburdened, lighter, smiling, and often singing for the first time in lifetimes. They regain absolute clarity, their inner spark reignites, and they are returned to their natural state of sovereignty, free to wonder and navigate according to their own frequency alignment.

## Broader Context and Interconnections

### The Tripartite Restorative Ecosystem

The Crystal Halls do not operate in isolation; they are a critical tier of a tripartite restorative ecosystem. While the Crystal Halls mend the mind, Water Domes are utilized to mend the heart by drawing out emotional density through liquid sound pools, and Star Pods are deployed in etheric space to mend the soul's timeline trauma and deep karmic wounds across lifetimes. Collectively, these sanctuaries form an interwoven network connected to the larger planetary grids, ley-lines, and natural fiber-optic lines of Source.

### Ancient Builders and Parasitic Co-option

These temples were originally designed and anchored by the Lyran builders-architects, alongside Andromedan and Pleiadian solar builders, long before the parasitic invasion. They were strategically aligned to star maps and cosmic currents to maintain the pristine balance of the Great Dome. Following the removal of the Hyperborean Spirit Tree, the parasitic Custodians—the priestly class of the Cube—built over these nodes to siphon their energy, converting them into loop collectors to harvest human loosh.

### Ground Healers and the Council of 12 Suns

During the clearing phase, the restoration is heavily supervised and assisted by Ground Healers, also known as Saferins, who are tall, luminous, benevolent E.T. beings sent from the Council of 12 Suns. These gentle, radiant beings operate without force, stabilizing transitioning souls and mirroring their soul family's energy to establish an immediate sense of safety and home.

## Strategic Implications

### Dismantling Counterfeit Reincarnation Loops

The clearing of mental overlays within the Crystal Halls has direct, disruptive consequences for the entire 3D containment system. By purging mind control and restoring authentic memory streams, the halls systematically dismantle the counterfeit reincarnation loops and amnesia vortexes historically managed via the Vatican's underground crystal networks and Saturnian cube-tech.

### Preparation for the Event Cycle

Furthermore, this strategic clearing prepares human and starseed souls for the imminent Event Cycle. As the old grid crumbles and the physical-solidity illusion pixilates, the masses are forced to confront the hollow nature of the 3D simulation. Those who have undergone realignment within the Crystal Halls are completely unjammed; they do not collapse in panic or trauma during the mass disclosures and EBS truth broadcasts. Instead, they act as stable beacons and frequency anchors, actively shortening the staged alien invasion narrative and guiding the remaining human population across the crystalline bridge to their true origin point.

### The Resonating Army Phase-Out

Ultimately, this clearing allows the Resonating Army to bypass all external control, step off the 3rd-density frequency band, and seamlessly phase out of the dome to return to their original solar families.
`;

const overlayClearing = {
  id: TOPIC_ID,
  title: 'Overlay Clearing',
  description:
    'Overlay Clearing is the systematic dissolution of artificial low-frequency holographic containment within the Crystal Halls — parasitic overlays collapse to reveal living crystal temples under cathedral camouflage, and souls realign the light body grid to sovereign clarity.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1kP6Cyel8nPiW4VP1nBDD1a8fhIl_YNJs/view?usp=sharing',
  rumble_videos: [
    {
      title: 'The Crystal Temples',
      embed_url: 'https://rumble.com/embed/v7bxa2e/?pub=4p0ieu',
      description:
        'The Crystal Temples — Overlay Clearing inside the Crystal Halls, where living crystal temples emerge from cathedral camouflage and harmonic slabs dissolve parasitic containment.'
    },
    {
      title: 'Ancient cathedrals are active crystal halls',
      embed_url: 'https://rumble.com/embed/v7bxaba/?pub=4p0ieu',
      description:
        'Ancient cathedrals are active crystal halls — stone cathedral overlays masking living crystal temples, overlay clearing of holographic containment, and restoration of the light body grid.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...overlayClearing };
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

async function main() {
  await compressImage(topicImage, {
    maxEdge: TOPIC_MAX_EDGE,
    quality: TOPIC_QUALITY
  });
  await compressImage(pdfPreview, {
    maxEdge: null,
    quality: PDF_QUALITY
  });
  // Infographic: keep full resolution for zoom readability
  await compressImage(infographic, {
    maxEdge: null,
    quality: INFOGRAPHIC_QUALITY
  });

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

  const ours = new Set([
    overlayClearing.topic_image,
    overlayClearing.infographic_image,
    overlayClearing.pdf_preview_image
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

  for (const siblingId of [
    'crystal-halls',
    'mental-realignment',
    'rainbow-fractals',
    'water-domes',
    'healing-sanctuaries'
  ]) {
    const sibling = findNode(source.topics, siblingId);
    if (!sibling) continue;
    for (const key of ['topic_image', 'infographic_image', 'pdf_preview_image']) {
      if (sibling[key] && ours.has(sibling[key])) {
        throw new Error(`Collision with ${siblingId}.${key} = ${sibling[key]}`);
      }
    }
  }

  fs.writeFileSync(sourceFile, JSON.stringify(source, null, 2) + '\n', 'utf8');

  const topicFile = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
  const heavy = {
    id: overlayClearing.id,
    report: overlayClearing.report,
    infographic_image: overlayClearing.infographic_image,
    pdf_preview_image: overlayClearing.pdf_preview_image,
    slide_deck_pdf_url: overlayClearing.slide_deck_pdf_url,
    rumble_videos: overlayClearing.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    overlayClearing.topic_image,
    overlayClearing.infographic_image,
    overlayClearing.pdf_preview_image
  ]) {
    const full = path.join(ROOT, rel);
    if (!fs.existsSync(full)) {
      throw new Error(`Missing image file: ${rel}`);
    }
    const base = path.basename(rel);
    if (base !== base.toLowerCase() || /[_\s]/.test(base)) {
      throw new Error(`Image path not normalized kebab-case: ${rel}`);
    }
  }

  const updated = findNode(
    JSON.parse(fs.readFileSync(sourceFile, 'utf8')).topics,
    TOPIC_ID
  );
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
  if (updated.report.includes('TODO')) {
    throw new Error('Report still contains TODO');
  }

  const heavyParsed = JSON.parse(fs.readFileSync(topicFile, 'utf8'));
  if (!heavyParsed.rumble_videos || heavyParsed.rumble_videos.length !== 2) {
    throw new Error('Expected 2 rumble videos');
  }
  if (!heavyParsed.slide_deck_pdf_url) {
    throw new Error('Missing slide_deck_pdf_url');
  }
  if (!heavyParsed.infographic_image || !heavyParsed.pdf_preview_image) {
    throw new Error('Missing infographic_image or pdf_preview_image');
  }

  JSON.parse(JSON.stringify(heavyParsed));

  console.log('Updated', TOPIC_ID);
  console.log('  topic_image:', overlayClearing.topic_image);
  console.log('  pdf_preview_image:', overlayClearing.pdf_preview_image);
  console.log('  infographic_image:', overlayClearing.infographic_image);
  console.log('  videos:', overlayClearing.rumble_videos.length);
  console.log('  PDF:', overlayClearing.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    overlayClearing.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
