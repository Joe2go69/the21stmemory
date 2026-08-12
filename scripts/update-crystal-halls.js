/**
 * Updates breakdown crystal-halls topic (was placeholder under Healing Sanctuaries).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields. Preserves child subtopics.
 *
 * Run: node scripts/update-crystal-halls.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'crystal-halls';
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

// Distinct preferred targets — never reuse water-domes / crystalline-* sibling paths.
const topicImage = normalizeImage('Crystal Halls.webp', 'crystal-halls.webp');
const pdfPreview = normalizeImage(
  'Crystalline_Soul_Restoration.webp',
  'crystal-halls-pdf-preview.webp'
);
const infographic = normalizeImage(
  'Crystal_Halls_Healing_Architecture_Guide.webp',
  'crystal-halls-healing-architecture-guide.webp'
);

const REPORT = `# Crystal Halls

## Overview

Crystal Halls are magnificent, high-frequency temples of mental and energetic healing that are currently hidden from human sight by three-dimensional parasitic overlays. To ordinary human perception, these living crystal structures appear as physical stone cathedrals, churches, and abbeys. Within the broader framework of healing sanctuaries, Crystal Halls represent the second of three specialized environments designed to rehabilitate souls who have suffered trauma, amnesia, and energetic degradation within the simulated system. While Water Domes are dedicated to emotional healing and Star Pods focus on soul and timeline restoration, Crystal Halls are uniquely calibrated to mend the mind, dissolve cognitive distortions, and dismantle deep-seated parasitic programming.

## Key Terminology

- **Crystal Halls** — Crystalline temples of mental and energetic healing that are overlaid by 3D human perception as cathedrals, churches, or abbeys.

- **Crystalline Body Self** — The high-frequency energetic form in which a soul experiences healing within the sanctuaries.

- **Harmonic Frequency** — The fundamental vibratory resonance that sings a soul in and out of realities, reactivated on crystal slabs.

- **Lungs of Light** — Breathing columns of energy within Crystal Halls that align the soul back to its original creation template.

- **Rainbow Fractals** — Multi-colored shimmering light patterns emitted by living crystal walls when light passes through crystal prisms.

- **Parasitic Overlays** — Artificial low-frequency projections imposed by parasites to hide real crystalline structures and hijack human perception.

## Core Revelations

The true nature of human sacred architecture represents a profound deception, as physical stone cathedrals and medieval abbeys are merely low-frequency sensory overlays hiding highly advanced, living crystal temples. Within these halls, the healing process is entirely non-physical; souls do not stand on their feet but instead hover as conscious orbs of electricity or exist in their crystalline body selves. By targeting the soul's energetic structure directly, the crystals run powerful harmonic waves that dissolve deeply embedded parasitic programming and mind control, reactivating the soul's original, uncorrupted harmonic coding. Furthermore, the architectural design of these halls is organic and conscious, featuring columns that expand and contract like breathing lungs of light, systematically circulating energy to realign the soul to its first state of creation.

## Detailed Mechanics and Key Elements

### Crystalline Architecture and Overlay Suppression

The true structures of Crystal Halls lie beneath ancient sites, including cathedrals, abbeys, Hagia Sophia, and Gobekli Tepe. These sites were built on top of major grid nodes to suppress their natural emission. The underlying structures are constructed of pure, living crystal. Within these temples, the walls are made of living crystal that constantly glows with vibrant rainbow fractals. This iridescent shimmer is produced as light passes through complex crystal prisms directly into the environment. The columns of these halls are not static supports, but active energetic conduits that breathe like lungs of light, circulating high-frequency currents through the space to systematically align the occupant's energy field back to its original state of creation.

### The Healing Process on Crystal Slabs

When entering a Crystal Hall, souls rest upon massive crystal slabs that hum continuously with targeted harmonic frequencies. Because souls exist as conscious orbs—essentially spheres of pure electricity—they do not stand or sit; instead, they hover directly over these slabs. Healing occurs in the crystalline body self, allowing the energetic structure to absorb the frequencies without the limitations or toxins of the physical 3D vessel. The slab's hum acts as a tuning fork, realigning the soul's shattered or distorted harmonic matrix.

### Dissolving Distortions and Restoring Memory

The key function of the crystal prisms is to project targeted light through the soul's energy field to dissolve deep distortions, mental overlays, and mind control damage. Souls carrying heavy energetic wounds, parasitic programming, or "parasite whispers"—which are low-frequency NPC broadcasts and artificial thoughts designed to cause despair or confusion—experience immediate relief as these fields are neutralized. This process realigns the light body grid and restores the soul's natural memory streams. As the confusion lifts, souls experience profound mental clarity, their inner spark is reignited, and they recover the awareness needed to navigate their soul journeys independently.

## Broader Context and Interconnections

### The Triad of Healing Sanctuaries

Crystal Halls are part of a three-fold recovery system deployed across the healing realms. If a soul carries multi-layered trauma, they are guided sequentially through all three sanctuaries. First, Water Domes address emotional trauma by allowing souls to float in pools of blue-aqua-silver water that vibrates like liquid sound, drawing out emotional density. Second, Crystal Halls repair the mind, clearing mental overlays. Finally, Star Pods mend the soul and resolve timeline or karmic fractures by cocooning the soul in a womb of light in etheric space.

### Grid Integration and Ancient Builders

These sanctuaries are not isolated constructs; they are fully integrated into the earth's electro-magnetic crystalline grid and connected to the other seven outer domes of the Cube containment. The crystalline structures were originally designed and positioned by ancient Lyran, Pleiadian, and Andromedan builders. Today, they are supported by the Giants, who use natural crystalline amplifiers to keep the cloaked domes stable and protect them from parasitic interference. Confused souls arriving at the sanctuaries are met by Ground Healers—also known as Saferons—tall, gentle holographic light beings from the Council of 12 Suns who radiate unconditional love and safety, helping to stabilize their vibration.

## Strategic Implications

### The Flicker of the Holographic Layer

As the collective frequency of the realm rises, the parasitic overlays are losing their stability. This frequency uptick causes the holographic 3D structures (concrete, brick, and steel) to flicker, shimmer, and bend, revealing the underlying crystalline scaffolding. Awakening souls will naturally begin to perceive the living crystal of the ancient temples bleeding through the artificial 3D matrix.

### Preparing for Ascension and Homecoming

The rehabilitation occurring in the Crystal Halls is vital for souls who are too fragmented or traumatized to undergo immediate extraction through the solar gate network. Realigning their harmonic codes ensures they can safely phase out of the 3D matrix without suffering shock or disorientation. Once stabilized, these souls can choose to ascend to higher realms or reincarnate into a fresh, unpolluted cycle within the Known Lands.

### Eradicating Reincarnation Traps

By clearing parasitic programming and restoring the soul's original memory streams, the Crystal Halls effectively neutralize the artificial reincarnation loops and memory-wiping systems historically anchored beneath the Vatican. Rather than being recycled into continuous amnesia loops, souls regain their sovereignty and are free to align with their true star families.
`;

const crystalHalls = {
  id: TOPIC_ID,
  title: 'Crystal Halls',
  description:
    'Crystal Halls are living crystal temples of mental and energetic healing hidden beneath cathedral and abbey overlays — crystal slabs hum harmonic frequencies, rainbow fractals dissolve mind-control damage, and Saferons stabilize souls in their crystalline body selves.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1dutfHWoO5bqv4S-aCr1wkDRHp3O9lBDM/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Beyond the Stone',
      embed_url: 'https://rumble.com/embed/v7bv83m/?pub=4p0ieu',
      description:
        'Beyond the Stone — Crystal Halls as living crystal temples hidden under cathedral and abbey overlays, where harmonic slabs mend the mind and dissolve parasitic programming.'
    },
    {
      title: 'The Crystal Halls beneath our feet',
      embed_url: 'https://rumble.com/embed/v7bv91m/?pub=4p0ieu',
      description:
        'The Crystal Halls beneath our feet — rainbow fractals, lungs of light, crystalline body healing on humming slabs, and the triad of Water Domes / Crystal Halls / Star Pods.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...crystalHalls };
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
    crystalHalls.topic_image,
    crystalHalls.infographic_image,
    crystalHalls.pdf_preview_image
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
    id: crystalHalls.id,
    report: crystalHalls.report,
    infographic_image: crystalHalls.infographic_image,
    pdf_preview_image: crystalHalls.pdf_preview_image,
    slide_deck_pdf_url: crystalHalls.slide_deck_pdf_url,
    rumble_videos: crystalHalls.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    crystalHalls.topic_image,
    crystalHalls.infographic_image,
    crystalHalls.pdf_preview_image
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

  // Parent under Healing Sanctuaries — preserve Mental Realignment / Rainbow Fractals / Overlay Clearing
  if (!updated.subtopics || updated.subtopics.length < 3) {
    throw new Error(
      'Expected Mental Realignment / Rainbow Fractals / Overlay Clearing subtopics preserved'
    );
  }
  const subIds = updated.subtopics.map((s) => s.id);
  for (const id of ['mental-realignment', 'rainbow-fractals', 'overlay-clearing']) {
    if (!subIds.includes(id)) {
      throw new Error(`Missing subtopic: ${id}`);
    }
  }

  console.log('Updated', TOPIC_ID);
  console.log('  topic_image:', crystalHalls.topic_image);
  console.log('  pdf_preview_image:', crystalHalls.pdf_preview_image);
  console.log('  infographic_image:', crystalHalls.infographic_image);
  console.log('  videos:', crystalHalls.rumble_videos.length);
  console.log('  PDF:', crystalHalls.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log('  subtopics preserved:', subIds.join(', '));
  console.log(
    '  Videos:',
    crystalHalls.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
