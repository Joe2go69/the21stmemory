/**
 * Updates breakdown mental-realignment topic (was placeholder under Crystal Halls).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields.
 *
 * Run: node scripts/update-mental-realignment.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'mental-realignment';
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
const topicImage = normalizeImage('Mental Realignment.webp', 'mental-realignment.webp');
const pdfPreview = normalizeImage(
  'Crystalline_Mental_Realignment.webp',
  'mental-realignment-pdf-preview.webp'
);
const infographic = normalizeImage(
  'Restoring_Sovereign_Light_Body_Grid.webp',
  'restoring-sovereign-light-body-grid.webp'
);

const REPORT = `# Mental Realignment

## Overview

Mental Realignment is the profound process of mending the mind and restoring the light body grid of a soul. This precise energetic healing takes place within the Crystal Halls, which are ancient crystal temples that have been overlaid and masked by 3D human perception as cathedrals, churches, and abbeys. The core purpose of this realignment is to dissolve and clear mental overlays, mind control damage, parasitic programming, and severe energetic wounds. By resting upon advanced crystal slabs that hum with restorative harmonic frequencies, souls systematically shed artificial distortions, allowing their harmonic coding and memory streams to be reactivated and returned. This realignment lifts cognitive confusion, silences low-frequency parasite whispers, and restores the soul's natural capacity to navigate reality with sovereignty and clarity.

## Key Terminology

- **Mental Realignment** — The advanced energetic process of mending the mind and light body grid, clearing parasitic overlays, and dissolving mind-control distortions using harmonic frequencies.

- **Crystal Halls** — Multi-dimensional healing temples constructed of living crystal and breathing columns of light, which are disguised in the 3D realm as cathedrals, churches, and abbeys.

- **Crystal Slabs** — Crystalline platforms inside the Crystal Halls that hum with specific harmonic frequencies to reactivate damaged or distorted harmonic coding in visiting souls.

- **Light Body Grid** — The foundational energetic blueprint of a soul that is realigned by crystal structures to purge parasitic programming and restore historical memory streams.

- **Parasitic Overlays** — Artificial, low-frequency electromagnetic fields and holographic projections overlaid by parasites to hijack human perception and lock souls into a heavy 3D matrix.

- **Rainbow Fractals** — Iridescent, shifting patterns of light emitted by the living crystal walls of the temples when struck by light at varying angles, functioning to dissolve cognitive distortion.

- **Lungs of Light** — Breathing crystalline columns within the Crystal Halls that emit pulsed light to systematically align a soul back to its original creation state.

## Core Revelations

Mental Realignment exposes the massive deception surrounding historical architecture, revealing that modern stone cathedrals and abbeys are actually living, highly advanced crystal temples hidden in plain sight. It reveals that the severe psychological fatigue, anxiety, and confusion experienced in the 3D world are not natural states, but the direct result of artificial low-frequency grids and parasitic programming designed to disrupt the human mind. Furthermore, true healing cannot be accomplished through human medical science, but requires the energetic realignment of the light body grid using precise sound and light frequencies. Once these blockages are dissolved, a soul's cognitive denial instantly cracks, triggering a massive influx of suppressed memories and restoring their connection to the wider multi-dimensional universe.

## Detailed Mechanics and Key Elements

The process of Mental Realignment within the Crystal Halls relies on a sequence of sophisticated crystalline technologies:

### Resonance Coupling on Crystal Slabs

Souls enter the Crystal Halls and hover as conscious balls of electricity over large crystal slabs. These slabs hum with precise harmonic frequencies that interact with the soul's distorted energy, reactivating its dormant and damaged harmonic coding.

### Photonic Prism Purification

Restorative light is focused and directed through advanced crystal prisms, penetrating deep into the soul's energy field. This light operates as a diagnostic and corrective laser, systematically dissolving all energetic distortion, mental overlays, and mind control damage.

### Breathing Column Alignment

The massive columns of the halls, acting as lungs of light, pulse with a systematic, breathing motion. This rhythmic emission of pure light aligns the soul's entire energetic structure back to its original creation state.

### Iridescent Light Bathing

The living crystal walls, composed of vibrant quartz and other natural crystalline conductors, emit glowing rainbow fractals. As light strikes these walls at varying angles, it shimmers in iridescent colors that function as frequency ingredients, pulling the soul's awareness out of distorted bands.

### Deconstruction of Parasitic Whispers

The realignment breaks down low-frequency mind control frameworks, such as voice to skull systems and low-frequency grids designed to manipulate dreams and memories. As these artificial whispers dissolve, the heavy cognitive confusion instantly lifts, replaced by a profound sense of safety, tranquility, and relief.

### Retrieval of Unbroken Timelines

The realigned light body grid allows returning memory streams to flow freely. The soul is re-connected to its historical record, allowing them to fully remember their cosmic lineage, past co-creations, and true home.

## Broader Context and Interconnections

Mental Realignment within the Crystal Halls is the crucial mental phase of a larger, three-fold restoration process designed by higher councils to heal humanity:

### The Tri-Sanctuary Healing Cycle

- **Water Domes** initiate the healing cycle by using sound-vibrating water to mend the heart, drawing out emotional density, grief, and fear.
- **Crystal Halls** execute the mental phase, performing Mental Realignment to mend the mind, clear mind control, and dissolve parasitic overlays.
- **Star Pods** conclude the cycle by mending the soul, using light frequency cocoons to reweave timeline fractures and heal deep karmic wounds across timelines.

### Suppression and Overlay of Grid Nodes

The Crystal Halls are built directly upon active earth nodes, which are powerful junction points of energy lines and leylines. Parasites attempted to suppress these nodes by building physical stone abbeys and churches over them, using heavy masonry slabs to dampen the natural frequencies.

### Interstellar Hard Drive Networks

The crystals within the halls function as physical and etheric hard drives. They connect directly to the larger interstellar light web and the unbroken timeline maintained by solar families, serving as download portals for cosmic history.

## Strategic Implications

The completion of Mental Realignment yields immediate and far-reaching strategic consequences:

### Immunization Against Parasitic Control

Once the mind is realigned, parasitic whispers lose their anchoring point, making the individual completely immune to low-frequency implants, dream manipulation, or media-driven fear loops.

### Reinstatement of Sovereign Sleep Dynamics

Realigned souls regain their natural ability to safely astral travel during sleep. They are no longer trapped in looping nightmares or blocked by low-frequency net structures.

### Preparation for Co-Creation and Materialization

Realignment shifts the soul's perception away from the artificial, perception-based solidity of dead concrete and metal, preparing them to interact with organic, light-based architecture that responds dynamically to thought and frequency.

### Accelerating the Overthrow of the Overlay

Realigned souls function as highly active beacons of frequency. Their restored resonance automatically activates surrounding planetary crystals, fracturing and dismantling the parasitic overlay, and accelerating the physical return of the original crystalline realm.
`;

const mentalRealignment = {
  id: TOPIC_ID,
  title: 'Mental Realignment',
  description:
    'Mental Realignment is the mind-mending process within Crystal Halls — harmonic crystal slabs restore the light body grid, rainbow fractals and lungs of light dissolve parasitic overlays and mind control, and memory streams reconnect souls to sovereign clarity.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1QsOUil-SXf59eA4Dl3qRR-AVrQhHsKBL/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Radiant Sanctuaries',
      embed_url: 'https://rumble.com/embed/v7bvegs/?pub=4p0ieu',
      description:
        'Radiant Sanctuaries — Mental Realignment within Crystal Halls, where harmonic crystal slabs mend the mind, dissolve parasitic overlays, and restore the light body grid.'
    },
    {
      title: 'Ancient Cathedrals are Living Crystal Halls',
      embed_url: 'https://rumble.com/embed/v7bvf62/?pub=4p0ieu',
      description:
        'Ancient Cathedrals are Living Crystal Halls — stone cathedral overlays masking living crystal temples, lungs of light, rainbow fractals, and the mental phase of the tri-sanctuary healing cycle.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...mentalRealignment };
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
    mentalRealignment.topic_image,
    mentalRealignment.infographic_image,
    mentalRealignment.pdf_preview_image
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
    id: mentalRealignment.id,
    report: mentalRealignment.report,
    infographic_image: mentalRealignment.infographic_image,
    pdf_preview_image: mentalRealignment.pdf_preview_image,
    slide_deck_pdf_url: mentalRealignment.slide_deck_pdf_url,
    rumble_videos: mentalRealignment.rumble_videos
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
    mentalRealignment.topic_image,
    mentalRealignment.infographic_image,
    mentalRealignment.pdf_preview_image
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

  // Leaf topic under Crystal Halls — no subtopics expected
  if (updated.subtopics && updated.subtopics.length) {
    console.log('Note: subtopics present (preserved):', updated.subtopics.map((s) => s.id));
  }

  // Parent Crystal Halls should still list this leaf
  const parent = findNode(source.topics, 'crystal-halls');
  if (!parent?.subtopics?.some((s) => s.id === TOPIC_ID)) {
    throw new Error('mental-realignment missing from crystal-halls.subtopics after update');
  }

  console.log('Updated', TOPIC_ID);
  console.log('  topic_image:', mentalRealignment.topic_image);
  console.log('  pdf_preview_image:', mentalRealignment.pdf_preview_image);
  console.log('  infographic_image:', mentalRealignment.infographic_image);
  console.log('  videos:', mentalRealignment.rumble_videos.length);
  console.log('  PDF:', mentalRealignment.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    mentalRealignment.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
