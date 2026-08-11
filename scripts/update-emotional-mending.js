/**
 * Updates breakdown emotional-mending topic (was placeholder under Water Domes).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields.
 *
 * Run: node scripts/update-emotional-mending.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'emotional-mending';
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

// Explicit preferred targets so PDF / infographic never collide with topic card name.
const topicImage = normalizeImage('Emotional Mending.webp', 'emotional-mending.webp');
const pdfPreview = normalizeImage(
  'The_Descent_into_Liquid_Light.webp',
  'emotional-mending-pdf-preview.webp'
);
const infographic = normalizeImage(
  'Mending_Heart_with_Liquid_Sound.webp',
  'mending-heart-with-liquid-sound.webp'
);

const REPORT = `# Emotional Mending

## Overview

Water Domes represent one of the three primary healing sanctuaries situated within the Known Lands and outer domes. These vast, shimmering, and invisible structures are specifically designed for emotional mending, providing a restorative environment for souls carrying deep emotional wounds such as grief, fear, guilt, and heartbreak. Positioned over crystalline waters, lakes, and oceans, Water Domes serve as transition portals where the heavy emotional density accumulated during cycles of 3D matrix entrapment is systematically dissolved and replaced with harmonic resonance. Within the broader cosmic system, these sanctuaries function as vital stabilizing zones, ensuring that recovering human and ET souls can safely recalibrate their frequencies before continuing their evolutionary journeys.

## Key Terminology

- **Water Domes** — Vast, shimmering, and invisible projection-based sanctuaries established over crystalline waters, specifically tuned for emotional healing, drawing out density, and restoring the heart's frequency.

- **Emotional Mending** — The heart-restoration process within Water Domes where negative emotional densities such as grief, fear, guilt, and heartbreak are dissolved and replaced by harmonic resonance.

- **Liquid Sound** — The highly superconductive vibrational state of water in the healing pools of the Water Domes, acting as a resonant frequency medium that interacts directly with the soul's energetic body.

- **Source Memory Codes** — Foundational, uncorrupted vibrational patterns held within the crystalline waters of the domes, enabling souls to bypass amnesia overlays and remember their true origins through visions and sound.

- **Saferins** — Also referred to as Saferons, these are tall, gentle, holographic light beings from the Council of 12 Suns who assist as ground healers in transition sanctuaries.

- **Emotional Density** — The heavy, discordant vibrational frequency of accumulated trauma, anxiety, and fear created by parasitic programming within the 3D matrix.

## Core Revelations

**Water as a Living Medium** — True water is not merely a physical substance but a highly advanced conductor that holds the uncorrupted memory codes of Source. Inside the Water Domes, water vibrates as liquid sound to restore the original blueprint of the soul.

**Mandatory Healing Before Transition** — Healing sanctuaries are not prisons but transition halls. Souls who are distorted or traumatized by the 3D overlay cannot immediately enter high-frequency realms without first undergoing energetic rebalancing within these specialized spaces.

**The Dissolution of Parasitic Suppression** — The parasitic construct heavily suppressed the natural water systems of the Known Lands, filling the oceans with salt and using them as conductors for aggressive sound weapons to lower collective frequency. Water Domes operate beyond this distortion, utilizing uncorrupted crystalline water to cleanse the nervous system.

**Reclamation of Sovereignty** — True emotional mending bypasses the mind entirely, releasing deep-seated blockages at a vibrational level, which automatically triggers the return of organic memory and intuitive sight.

## Detailed Mechanics and Key Elements

### Structural Composition of Water Domes

#### Crystalline Projection Technology

The domes are constructed from light, sound, and living crystal. They utilize advanced projection dome technology to bend light and sound waves, remaining completely invisible and cloaked from lower 3D senses.

#### Chromotherapeutic Architecture

The sanctuaries are projected over pure, glowing bodies of water that emit precise color frequencies of blue, aqua, silver, and pearl. These colors are not static; they are created as sound folds into light, acting as specific vibrational "ingredients" designed to pull the soul's frequency out of discordant bands.

#### Atmospheric Stabilization

Within the domes, the ambient frequency is perfectly stabilized, allowing souls to exist and recover at a higher vibration without detection or interference from external parasitic fields.

### Step-by-Step Process of Emotional Mending

#### Sanctuary Entry

Distorted or confused souls are guided to the domes by benevolent protectors.

#### Immersion

The soul, in their crystalline body self, enters the healing pools.

#### Sound-Water Floating

As the soul floats, the water—vibrating as liquid sound—interacts with the energetic field.

#### Density Extraction

The high-spin liquid sound waves draw out heavy emotional density, pulling away trauma, heartbreak, and guilt.

#### Harmonic Infusion

The uncorrupted Source codes stored in the water are transferred into the soul's grid, replacing the empty space with harmonic resonance.

#### Memory Triggering

The realignment of the heart field triggers sudden flash memories, allowing the soul to remember their lineage and home through visions and sound.

#### Emergence

The soul emerges lighter, smiling, and singing, restored to a state of peace and emotional balance.

\`[Traumatized Soul] ──> [Pool Immersion] ──> [Liquid Sound Float] ──> [Density Extraction] ──> [Vibrational Realignment] ──> [Memory Recall] ──> [Healed Soul]\`

### The Role of Ground Healers (Saferins)

#### Origin

These tall, gentle, and radiant soul beings are dispatched from the Council of 12 Suns.

#### Holographic Presence

They do not manifest in heavy physical biological forms; they operate as holographic light beings with luminous outlines.

#### Modulating Form

To eliminate shock or panic, the Saferins can shift their luminous appearance to mirror the soul's own star family, reassuring them that they are safe and home.

#### Non-Forceful Stewardship

Saferins never force or demand compliance; they stabilize the environment with pure love and tranquility, monitoring the soul until their vibration is completely stabilized.

## Broader Context and Interconnections

### The Tripartite Sanctuary System

The Water Domes are not isolated; they form the emotional tier of a three-part healing system:

- **Water Domes** mend the heart and clear emotional density.
- **Crystal Halls** (historically overlaid by cathedrals and abbeys) mend the mind, clearing mental overlays, parasitic programming, and mind control damage.
- **Star Pods** mend the soul, healing timeline trauma and reweaving fragmented aspects of the soul across multiple timelines.

Many severely fractured souls undergo a sequential transition, moving through all three sanctuaries to restore complete energetic integrity.

### Connection to the Spirit Tree and Seven Domes

All healing sanctuaries are energetically powered by the root system of the central Spirit Tree. The Spirit Tree acts as a giant trunk that feeds the Seven Domes (including the Dome of Sheol, which originally served as a recovery sanctuary) with pure Source light. The water within the domes carries the pulse of this central tree, directly linking the emotional mending process to the macro-ecosystem of the entire Cube containment.

## Strategic Implications

### Stabilization of the Collective During the Great Reset

The presence of Water Domes ensures that when the parasitic 3D overlay collapses, those who do not immediately ascend are not abandoned to panic or chaos. By routing traumatized and confused souls into cloaked water sanctuaries, the Alliance prevents mass panic, ensuring a controlled, peaceful transition environment.

### Reclamation of Evolutionary Choice

Once a soul's emotional body is fully mended and their harmonic coding is realigned, their amnesia dissolves. This restoration of memory allows them to exercise true free will:

- They may choose to ascend to higher, lighter realms.
- They may choose to return to the Known Lands in a fresh, new cycle, residing in a fully restored, unpolluted crystalline physical world free from any parasitic overlays.

### Activation Role of the Resonating Army

The Resonating Army (the already-awakened ET returners) bypasses the need for these healing sanctuaries because their frequencies are already high and stable. However, once the initial transition is complete, members of the Resonating Army have the strategic choice to enter the Water Domes and other sanctuaries to assist the ground healers, accelerating the recovery and homecoming of the souls they originally came to free.
`;

const emotionalMending = {
  id: TOPIC_ID,
  title: 'Emotional Mending',
  description:
    'Emotional Mending is the heart-restoration process within Water Domes — liquid sound dissolves grief, fear, guilt, and heartbreak, Source memory codes restore harmonic resonance, and Saferins from the Council of 12 Suns stabilize recovering souls.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1ZCptr-TctpucNS5c3NGew5uUlioniD2x/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Liquid Sound Homecoming',
      embed_url: 'https://rumble.com/embed/v7btoy6/?pub=4p0ieu',
      description:
        'Liquid Sound Homecoming — Emotional Mending within Water Domes, where liquid sound draws out emotional density and Source memory codes restore the heart field of recovering souls.'
    },
    {
      title: 'Mending your soul in Water Domes',
      embed_url: 'https://rumble.com/embed/v7btpi6/?pub=4p0ieu',
      description:
        'Mending your soul in Water Domes — Saferins (Saferons) as ground healers, the step-by-step emotional mending sequence, and the tripartite Water Domes / Crystal Halls / Star Pods sanctuary system.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...emotionalMending };
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
    emotionalMending.topic_image,
    emotionalMending.infographic_image,
    emotionalMending.pdf_preview_image
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
    id: emotionalMending.id,
    report: emotionalMending.report,
    infographic_image: emotionalMending.infographic_image,
    pdf_preview_image: emotionalMending.pdf_preview_image,
    slide_deck_pdf_url: emotionalMending.slide_deck_pdf_url,
    rumble_videos: emotionalMending.rumble_videos
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
    emotionalMending.topic_image,
    emotionalMending.infographic_image,
    emotionalMending.pdf_preview_image
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
  console.log('  topic_image:', emotionalMending.topic_image);
  console.log('  pdf_preview_image:', emotionalMending.pdf_preview_image);
  console.log('  infographic_image:', emotionalMending.infographic_image);
  console.log('  videos:', emotionalMending.rumble_videos.length);
  console.log('  PDF:', emotionalMending.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    emotionalMending.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
