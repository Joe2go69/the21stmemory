/**
 * Updates breakdown liquid-sound topic (was placeholder under Water Domes).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields.
 *
 * Run: node scripts/update-liquid-sound.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'liquid-sound';
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

// Preferred targets — avoid water-domes' liquid-sound-restoration-resonance-guide.webp
const topicImage = normalizeImage('Liquid Sound.webp', 'liquid-sound.webp');
const pdfPreview = normalizeImage(
  'Luminous_Soul_Restoration.webp',
  'liquid-sound-pdf-preview.webp'
);
const infographic = normalizeImage(
  'Liquid_Sound_Frequency_Restoration_Guide.webp',
  'liquid-sound-frequency-restoration-guide.webp'
);

const REPORT = `# Liquid Sound

## Overview

Liquid Sound is an active, super-conductive vibrational state of water utilized within localized pools inside specialized healing sanctuaries to perform deep, restorative clearing of a soul's energetic blueprint. While suspended in their crystalline body self, a soul hovers in this vibrational medium to systematically release deep emotional trauma and realign with their original frequency. This active liquid functions as the core therapeutic agent inside the heart-mending facilities known as Water Domes. It operates in stark contrast to the stagnant, suppressed water of the current 3D matrix, which has been stripped of memory-retention capability and hijacked by parasitic forces.

## Key Terminology

- **Liquid Sound** — An active, super-conductive state of water that vibrates at precise frequencies to extract emotional trauma and restore the soul's divine alignment.

- **Memory codes of Source** — Sacred, high-vibrational informational sequences embedded directly within the liquid sound medium that trigger complete soul recall.

- **Emotional density** — Trapped, low-vibrational energetic weight—including grief, fear, guilt, and heart-break—that accumulates in a soul's field and must be cleared.

- **Harmonic resonance** — The balanced, high-vibrational frequency state of the original soul blueprint that replaces trauma through vibrational exposure.

- **Sound creates light** — The foundational principle where specific color frequencies function as direct structural ingredients to pull consciousness out of discordant octaves.

## Core Revelations

**Water as an Active Memory Carrier** — Liquid Sound actively holds the memory codes of Source, maintaining a pure, uncompromised connection to creation that is absent in the current 3D earthly matrix.

**Destruction of the Parasitic Conduit** — Parasitic forces rely on the conductive properties of suppressed 3D water to transmit aggressive, artificial sound frequencies across oceans. Liquid Sound actively repels these parasite technologies by maintaining an unjammed, high-vibrational state.

**Spontaneous Memory Restoration** — Exposure to Liquid Sound acts as a direct mechanical trigger for ancient remembrance, bridging the amnesia gap through sudden visions and sound recall.

## Detailed Mechanics and Key Elements

The therapeutic application of Liquid Sound involves a precise, sequential process of vibrational alchemy and frequency tuning:

### Suspension and Flotation

Distorted or traumatized souls enter the restorative pools. The soul hovers within the medium in their crystalline body self, as physical standing is unnecessary in these higher realms.

### Vibrational Friction and Extraction

The water vibrates at a precise, elevated frequency that creates friction against the soul's lower-frequency blockages. This vibrational pressure systematically draws out accumulated emotional density.

### Resonant Infusion

Once the dense, low-vibrational blocks are extracted, the Liquid Sound replaces the energetic void with harmonic resonance. The memory codes of Source are absorbed directly into the soul's light body grid.

### Color-Frequency Radio Tuning

Shimmering hues of blue, aqua, silver, pearl, and green glow throughout the environment. Under the principle of "sound creates light," these colors function as structural ingredients that operate like radio tuning dials. This luminous spectrum physically pulls the soul's awareness out of discordant frequencies and locks it into positive octaves.

### Tonal Awakening and Emergence

The interaction between the soul's coding and the liquid sound triggers spontaneous visions and ancient sound recall. Souls emerge from the pools feeling entirely light, smiling, and singing for the first time in multiple lifetimes.

## Broader Context and Interconnections

Liquid Sound is housed within Water Domes, which are vast, shimmering, and invisible translucent enclosures projected over crystalline lakes, oceans, and valleys.

The healing process is monitored and stabilized by Ground Healers, also known as Saferons, who are tall, luminous ET assistants sent from the Council of 12 Suns to provide gentle, non-forceful guidance.

While Liquid Sound specifically targets and heals emotional wounds of the heart, it works in lateral alignment with Crystal Halls (which utilize crystal slabs and hums to dissolve mental overlays and parasitic programming) and Star Pods (which use light cocoons to heal timeline trauma and soul fractures).

## Strategic Implications

### Bypassing Vatican-Archived Amnesia Loops

Restoring a soul's timeline memory through Liquid Sound completely neutralizes the Vatican-archived amnesia loops and harvesting networks.

### Stabilization for Higher Physical Realms

Raising a soul's vibration through Liquid Sound prepares them to co-exist within the high-density environment of higher physical realms without experiencing frequency shock or lag.

### Immunization Against Loosh Harvesting

Clearing the heart's density permanently shields the soul from future loosh harvesting, voice-to-skull frequency weapons, and sensory hijackings.
`;

const liquidSound = {
  id: TOPIC_ID,
  title: 'Liquid Sound',
  description:
    'Liquid Sound is the super-conductive vibrational state of water in Water Dome pools — extracting emotional density, infusing Source memory codes, and restoring harmonic resonance so traumatized souls can remember and re-align.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1yo8Y3lBYV8mHMjzk9EBrqFnmRjwvE4rN/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Trauma extraction in the Water Domes',
      embed_url: 'https://rumble.com/embed/v7bts2m/?pub=4p0ieu',
      description:
        'Trauma extraction in the Water Domes — Liquid Sound as vibrational friction that draws out emotional density and clears grief, fear, guilt, and heartbreak from the soul field.'
    },
    {
      title: 'Resonance of Remembrance',
      embed_url: 'https://rumble.com/embed/v7bts7g/?pub=4p0ieu',
      description:
        'Resonance of Remembrance — Source memory codes in liquid sound, color-frequency tuning, spontaneous visions and sound recall, and emergence into light, smiling, and singing.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...liquidSound };
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
    liquidSound.topic_image,
    liquidSound.infographic_image,
    liquidSound.pdf_preview_image
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

  // Explicitly ensure we never took water-domes' existing infographic name
  const waterDomes = findNode(source.topics, 'water-domes');
  if (
    waterDomes &&
    ours.has(waterDomes.infographic_image || '')
  ) {
    throw new Error('Collision with water-domes.infographic_image');
  }

  fs.writeFileSync(sourceFile, JSON.stringify(source, null, 2) + '\n', 'utf8');

  const topicFile = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
  const heavy = {
    id: liquidSound.id,
    report: liquidSound.report,
    infographic_image: liquidSound.infographic_image,
    pdf_preview_image: liquidSound.pdf_preview_image,
    slide_deck_pdf_url: liquidSound.slide_deck_pdf_url,
    rumble_videos: liquidSound.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    liquidSound.topic_image,
    liquidSound.infographic_image,
    liquidSound.pdf_preview_image
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

  console.log('Updated', TOPIC_ID);
  console.log('  topic_image:', liquidSound.topic_image);
  console.log('  pdf_preview_image:', liquidSound.pdf_preview_image);
  console.log('  infographic_image:', liquidSound.infographic_image);
  console.log('  videos:', liquidSound.rumble_videos.length);
  console.log('  PDF:', liquidSound.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    liquidSound.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
