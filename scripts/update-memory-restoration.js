/**
 * Updates breakdown memory-restoration topic (was placeholder under Water Domes).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields.
 *
 * Run: node scripts/update-memory-restoration.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'memory-restoration';
const BREAKDOWN_IMG = path.join(ROOT, 'images', 'breakdown');

// Match optimize-images-phase3 defaults for topic cards; keep infographics sharper for zoom/readability.
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
    // Same size → treat as already done, drop source duplicate
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

/**
 * Recompress a webp in place. Infographics keep full resolution for text readability;
 * topic cards may cap long edge like the site-wide optimize pass.
 */
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

  // Keep original if recompress grew the file or barely helped (<3%)
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

// Explicit preferred targets so PDF / infographic never collide with topic card name
// or with sibling Water Domes assets (water-domes.webp, water-domes-pdf-preview.webp).
const topicImage = normalizeImage('Memory Restoration.webp', 'memory-restoration.webp');
const pdfPreview = normalizeImage(
  'The_Water_Domes.webp',
  'memory-restoration-pdf-preview.webp'
);
const infographic = normalizeImage(
  'Restoring_Original_Memory_of_Source.webp',
  'restoring-original-memory-of-source.webp'
);

const REPORT = `# Memory Restoration

## Overview

Water Domes are vast, shimmering, pearlescent healing sanctuaries projected as invisible energy fields over crystalline lakes, oceans, and pristine waters that glow in spectacular blue, aqua, and silver frequencies. Functioning as pure frequency spaces built from light, sound, and living crystal, these structures are specifically tuned to address deep emotional trauma and facilitate Memory Restoration. Within the Water Domes, memory recovery is not an intellectual retrieval process, but rather a direct vibrational consequence of heart-mending. By placing souls into state-of-the-art vibrational pools, the domes systematically strip away the dense, low-frequency blockages of grief, fear, guilt, and heartbreak, allowing their innate cosmic identity and connection to Source to safely return.

## Key Terminology

- **Water Domes** — Vast, invisible, shimmering, pearl-like translucent domes of light projected over crystalline waters, serving as emotional healing sanctuaries that mend the heart.

- **Liquid Sound** — The highly superconductive vibrational state of water within the Water Dome pools, where the water itself vibrates like sound to draw out emotional density and realign a soul's frequency.

- **Memory Codes of Source** — High-frequency informational templates embedded in pristine, uncorrupted water that restore a soul's true identity, original timelines, and past-life recollection when interacting with their consciousness.

- **Emotional Density** — The accumulated energetic weight of trauma, grief, fear, guilt, and heartbreak that suppresses a soul's harmonic frequency and causes amnesia.

- **Harmonic Resonance** — The state of vibrational alignment with Source energy that replaces distorted frequencies, bringing back natural soul-expression, clarity, and memory.

- **Ground Healers** — Tall, radiant, benevolent holographic light beings sent from the Council of 12 Suns to guide and stabilize recovering souls within the transition sanctuaries.

## Core Revelations

Memory restoration is intrinsically linked to the purging of emotional trauma. The emotional blockages of grief, fear, and guilt act as heavy, low-frequency filters that actively distort a soul's energetic matrix, maintaining state-induced amnesia and keeping them locked in looping 3D illusions. Once these dense frequencies are drawn out of the light body, the natural memory streams of the soul instantly re-emerge.

Unlike the highly corrupted and suppressed conductor waters of the artificial 3D matrix, the pristine waters under the Water Domes hold the uncorrupted memory codes of Source. Submersion in these waters acts as an information upload, triggering profound vision memory recall and ancient sound wave ignition. Souls are reminded of their original creation, their star lineages, and their pre-incarnational contracts, allowing them to realize their nature as sovereign, eternal creators.

## Detailed Mechanics and Key Elements

### The Environmental Frequency Architecture

Water Domes do not resemble physical hospitals; they are massive translucent structures of condensed light, sound, and living crystal. The blue, aqua, and silver colors radiating from the domes act as active frequency ingredients. Just as a sunny day naturally elevates human mood, these specific color notes are calculated light-sound vibrations designed to physically pull a soul's perception out of distorted, low-frequency bands—functioning like highly precise radio tuners.

### The Flotation and Sound-Extraction Process

Souls enter these sanctuaries in their crystalline body selves. The process of restoration operates through precise physics:

#### Flotation

The soul is placed into the pools, hovering and floating directly within the water.

#### Vibrational Extraction

The water within the pools is not static matter; it vibrates as liquid sound. As the soul floats, this liquid sound penetrates the energetic field, matching the resonant frequency of the soul's trauma.

#### Density Draw-Down

Through electromagnetic friction, the liquid sound actively draws out the heavy, distorted emotional density from the soul's light body.

#### Resonance Replacement

The drawn-out trauma is immediately replaced with pure harmonic resonance.

### The Activation of Visions and Sound Memories

Once the emotional density is cleared, the memory codes of Source held in the water begin to interface with the soul's consciousness. This triggers memory restoration through two sensory channels:

#### Vision Recall

The soul experiences highly detailed, cinematic memories of their home worlds, their original families, and their pre-descent history.

#### Sound Recall

Souls hear ancient harmonic tones that they had heard lifetimes ago. This auditory trigger sparks a rapid, forward-rolling recovery of their unbroken timeline.

The immediate result is that souls emerge lighter, smiling, and singing for the first time in countless lifetimes, as the world around them begins to sing in harmony with their restored vibration.

### Luminous Supervision by Ground Healers

The transition process is entirely supervised by Ground Healers, also known as Saferins or Saferons, who are tall, radiant soul beings sent from the Council of 12 Suns. Appearing as gentle, non-forceful holographic light beings with luminous outlines, they can dynamically shift their form to mirror a soul's original family. Their massive bio-fields project absolute calm, love, and tranquility. When a recovering soul arrives at a Water Dome in a state of confusion or shock, the immediate presence and touch of these healers neutralize all lingering panic, generating an instant inner realization: "I am safe. I am home."

## Broader Context and Interconnections

### Lateral Sanctuary Alignment

The Water Domes represent the vital first stage of a three-part restorative network designed to heal different types of trauma:

- **Water Domes** mend the heart from emotional wounds.
- **Crystal Halls** mend the mind, using living quartz and crystal slabs to realign the light body grid and shatter mental overlays, mind-control damage, and parasitic programming.
- **Starlight Pods** mend the soul, using floating etheric cocoons in nebulae-like spaces to reweave soul fractures and timeline trauma across multiple incarnations.

Depending on the severity of their fragmentation, some souls must sequentially pass through all three sanctuaries to stabilize their frequencies.

### Connection to the Spirit Tree and Crystalline Grids

Historically, all seven domes outside the Great Dome (including the Dome of Sheol, which originally served as a healing and recovery dome) were directly linked to the central Spirit Tree at the center of the Known Lands. The Spirit Tree acted as the core trunk, pulsing clean, continuous light and harmonic currents into the crystalline grids to feed all outer domes. Following the tree's removal by parasites, the water became suppressed. In the current restoration cycle, as the Resonating Army fractures the artificial 3D overlays, the roots of the Spirit Tree are lighting up again, restoring the Water Domes' pristine power supply.

### Co-operational Integration with Starseeds

Once members of the Resonating Army depart the physical plane through the frequency gates, they do not require healing sanctuaries themselves, as their frequencies are already highly active and stable. Instead, they return to their home realms and are granted the choice to visit the Water Domes to supervise and speed up the recovery of the very human souls they originally came to free.

## Strategic Implications

### Eradication of the Vatican Loop

By mending the heart and bringing back true memory streams, the Water Domes completely bypass and dismantle the counterfeit reincarnation cycles managed by the suppressed Vatican archive system, which historically copied and recycled soul fragments.

### Frequency Stabilization

Stabilizing a soul's vibration ensures they do not experience perception-based collapse or panic when the artificial 3D holographic overlays begin to dissolve.

### Autonomous Path Selection

Once a soul's memory is fully restored, they are finally free of external manipulation and can make an uncoerced choice to either ascend to higher realms or return to a fresh, uncorrupted, parasite-free creation cycle within the crystalline Known Lands.
`;

const memoryRestoration = {
  id: TOPIC_ID,
  title: 'Memory Restoration',
  description:
    'Memory Restoration is the vibrational recovery of a soul\'s cosmic identity within Water Domes — liquid sound clears emotional density, Source memory codes trigger vision and sound recall, and Ground Healers (Saferins/Saferons) stabilize recovering souls.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1Tsr7nV72m_v663HDwoE2WVkNwPwRKUhP/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Awakening in Liquid Light',
      embed_url: 'https://rumble.com/embed/v7bv4ga/?pub=4p0ieu',
      description:
        'Awakening in Liquid Light — Memory Restoration within Water Domes, where liquid sound clears emotional density and Source memory codes restore cosmic identity through vision and sound recall.'
    },
    {
      title: 'Liquid Sound and the Water Domes',
      embed_url: 'https://rumble.com/embed/v7bv5nk/?pub=4p0ieu',
      description:
        'Liquid Sound and the Water Domes — flotation and sound-extraction mechanics, Ground Healers (Saferins/Saferons) from the Council of 12 Suns, and the three-part Water Domes / Crystal Halls / Starlight Pods sanctuary network.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...memoryRestoration };
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
  // Compress after rename so targets match final paths
  await compressImage(topicImage, {
    maxEdge: TOPIC_MAX_EDGE,
    quality: TOPIC_QUALITY
  });
  await compressImage(pdfPreview, {
    maxEdge: null,
    quality: PDF_QUALITY
  });
  // Infographic: no max-edge downscale — text must stay readable when zoomed
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

  // Unique ownership: no other topic may share these image paths
  const ours = new Set([
    memoryRestoration.topic_image,
    memoryRestoration.infographic_image,
    memoryRestoration.pdf_preview_image
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

  fs.writeFileSync(sourceFile, JSON.stringify(source, null, 2) + '\n', 'utf8');

  const topicFile = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
  const heavy = {
    id: memoryRestoration.id,
    report: memoryRestoration.report,
    infographic_image: memoryRestoration.infographic_image,
    pdf_preview_image: memoryRestoration.pdf_preview_image,
    slide_deck_pdf_url: memoryRestoration.slide_deck_pdf_url,
    rumble_videos: memoryRestoration.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  // Verify image files exist and are kebab-case
  for (const rel of [
    memoryRestoration.topic_image,
    memoryRestoration.infographic_image,
    memoryRestoration.pdf_preview_image
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

  // Leaf topic under Water Domes — no subtopics expected
  if (updated.subtopics && updated.subtopics.length) {
    console.log('Note: subtopics present (preserved):', updated.subtopics.map((s) => s.id));
  }

  console.log('Updated', TOPIC_ID);
  console.log('  topic_image:', memoryRestoration.topic_image);
  console.log('  pdf_preview_image:', memoryRestoration.pdf_preview_image);
  console.log('  infographic_image:', memoryRestoration.infographic_image);
  console.log('  videos:', memoryRestoration.rumble_videos.length);
  console.log('  PDF:', memoryRestoration.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    memoryRestoration.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
