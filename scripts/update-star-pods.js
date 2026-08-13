/**
 * Updates breakdown star-pods topic (was placeholder under Healing Sanctuaries).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields. Preserves child subtopics.
 *
 * Run: node scripts/update-star-pods.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'star-pods';
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

// Distinct preferred targets — never reuse sibling healing-sanctuary paths.
const topicImage = normalizeImage('Star Pods.webp', 'star-pods.webp');
const pdfPreview = normalizeImage(
  'Star_Pods_Soul_Restoration.webp',
  'star-pods-pdf-preview.webp'
);
const infographic = normalizeImage(
  'Sovereign_Reweaving__Star_Pod_Journey.webp',
  'sovereign-reweaving-star-pod-journey.webp'
);

const REPORT = `# Star Pods

## Overview

Star Pods are specialized, multi-dimensional chambers designed to facilitate deep soul healing and timeline healing. These vessels float within cocoons of straight, circulating currents in etheric space, providing an environment that feels like resting inside a shimmering nebulae. Rather than addressing physical or superficial ailments, Star Pods are specifically engineered to repair soul fractures, timeline trauma, and karmic wounds that have accumulated across various incarnations. Star Pods represent the final, most profound tier of restoration within the three primary classifications of healing sanctuaries.

## Key Terminology

- **Star Pods** — Advanced multidimensional containment vessels floating in etheric space used to repair deep timeline trauma and soul fractures.

- **Timeline Trauma** — Subconscious energetic damage and scarring that accumulates within a soul as it transitions through different lifetimes and parasitic overlays.

- **Soul Fractures** — Fragmentation of a soul's energetic integrity resulting from prolonged exposure to low-frequency environments, trauma, or memory-manipulation technologies.

- **Starlight Pods** — An alternative designation for Star Pods, specifically associated with mending the core of the soul.

- **Nebulae Cocoon** — The specific atmospheric and etheric state inside a Star Pod, characterized by straight, circulating flows in etheric space.

- **Essence Chamber** — The native protection and knowledge-collecting chamber utilized by extraterrestrial souls for direct transit in and out of realms.

## Core Revelations

Star Pods operate beyond the limits of physical reality, mending the absolute core of consciousness where persistent parasitic technology has damaged souls at the energetic level. While other restoration spaces focus on clearing mental or emotional distortions, Star Pods are uniquely capable of reweaving the shattered light of human souls who have endured dense cycles of manipulation. This technology is particularly vital for souls who carried a "little bit of doubt" during historical transition points, such as the Red Sea event. This lingering trace of doubt anchored them in the 3D illusion, but the pods ensure their rapid and complete recovery.

These advanced chambers represent a purely organic, non-physical extraterrestrial technology that operates completely independently of human intervention. Conventional medical systems and the publicized "med beds" of the terrestrial truther movement are entirely incapable of curing the deep energetic damage resolved by these pods. By interacting directly with the soul's primary blueprint, Star Pods neutralize the long-term effects of the 3D matrix and prepare the consciousness for immediate integration with its cosmic origins.

## Detailed Mechanics and Key Elements

### The Womb of Light

The restoration process within a Star Pod is highly precise, relying on structured interactions of light and sound frequencies. When a fractured soul enters the chamber, the pod immediately envelopes the consciousness in a protective womb of light. Within this womb, concentrated streams of light frequency are projected in circulating patterns. These frequencies act as cosmic looms, systematically reweaving the fragmented, scattered aspects of the soul's energy signature across all past timelines and incarnations.

### Frequency Rise and Family Projection

As the reweaving process stabilizes, the soul's overall vibrational frequency begins to rise. This frequency shift opens a resonant pathway that allows solar parents, solar families, and members of the Resonating Army to actively project into the chamber. Under their supervision, the soul is gently guided out of its trauma-induced amnesia and reconnected with its higher memory. This collaboration ensures that the freed souls are both physically and energetically intact, completely erasing the subconscious trauma that historically anchored them to low-vibration loops.

### The Three-Stage Therapeutic Sequence

The Star Pod experience represents the culmination of a broader, three-stage therapeutic sequence. A heavily traumatized soul typically progresses through these distinct stages to achieve full restoration:

- **Water Domes** are utilized first to draw out dense emotional blockages, such as grief and fear, effectively mending the heart.
- **Crystal Halls** are entered second, using living crystal slabs and harmonic humming to dissolve mental overlays and mend the mind.
- **Star Pods** serve as the third and final step, directly mending the soul and restoring its sovereign wholeness.

## Broader Context and Interconnections

Star Pods operate in close alignment with crystalline pods, which are deployed to heal and stabilize those who remain temporarily caught in the 3D illusion during the collapse of the false grids. The pods are also connected to collective consciousness networks and the unbroken timeline recorded by solar families. This system utilizes planetary crystal grids as a permanent recording database, allowing solar families to track a soul's frequency and ensure its precise alignment during the healing process.

## Strategic Implications

### No Soul Abandoned

The deployment of Star Pods ensures that no true soul is abandoned or permanently trapped as the 3D overlay collapses. Even those who failed to activate on time due to dense programming are guaranteed a swift and systematic path to complete restoration. This mechanism completely neutralizes the soul-recycling and memory-harvesting loops historically operated under the Vatican amnesia systems, restoring absolute sovereignty to consciousness.

### Sovereign Choice After Restoration

Once a soul's healing in the pod is complete, it is freed from all artificial contracts and granted full autonomy. The restored soul can then make a conscious, sovereign choice regarding its next evolutionary path. It may choose to ascend directly to higher realms, or it may opt to return for a fresh, uncorrupted cycle of creation within the Known Lands. This next cycle will exist entirely in a crystalline physical world free from parasite overlays, allowing souls to live, create, and expand in absolute harmony.
`;

const starPods = {
  id: TOPIC_ID,
  title: 'Star Pods',
  description:
    'Star Pods are specialized multidimensional chambers floating in etheric nebulae cocoons — the final restoration tier that reweaves soul fractures and timeline trauma, neutralizing 3D matrix damage and restoring sovereign wholeness.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1W1dihk319yijebsTXoo6cQT2r_KJdHHe/view?usp=sharing',
  rumble_videos: [
    {
      title: 'How Star Pods Repair Your Soul Blueprint',
      embed_url: 'https://rumble.com/embed/v7bxck2/?pub=4p0ieu',
      description:
        'How Star Pods Repair Your Soul Blueprint — multidimensional chambers in etheric nebulae cocoons reweave soul fractures and timeline trauma, mending the core of consciousness beyond physical med beds.'
    },
    {
      title: 'Echoes of the Cosmos',
      embed_url: 'https://rumble.com/embed/v7bxeg2/?pub=4p0ieu',
      description:
        'Echoes of the Cosmos — the womb of light, cosmic looms of circulating frequency, solar family projection, and the three-stage Water Domes / Crystal Halls / Star Pods restoration sequence.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...starPods };
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
    starPods.topic_image,
    starPods.infographic_image,
    starPods.pdf_preview_image
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
    id: starPods.id,
    report: starPods.report,
    infographic_image: starPods.infographic_image,
    pdf_preview_image: starPods.pdf_preview_image,
    slide_deck_pdf_url: starPods.slide_deck_pdf_url,
    rumble_videos: starPods.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    starPods.topic_image,
    starPods.infographic_image,
    starPods.pdf_preview_image
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

  // Parent under Healing Sanctuaries — preserve Timeline Healing / Soul Reweaving / Nebulae Resting
  if (!updated.subtopics || updated.subtopics.length < 3) {
    throw new Error(
      'Expected Timeline Healing / Soul Reweaving / Nebulae Resting subtopics preserved'
    );
  }
  const subIds = updated.subtopics.map((s) => s.id);
  for (const id of ['timeline-healing', 'soul-reweaving', 'nebulae-resting']) {
    if (!subIds.includes(id)) {
      throw new Error(`Missing subtopic: ${id}`);
    }
  }

  console.log('Updated', TOPIC_ID);
  console.log('  topic_image:', starPods.topic_image);
  console.log('  pdf_preview_image:', starPods.pdf_preview_image);
  console.log('  infographic_image:', starPods.infographic_image);
  console.log('  videos:', starPods.rumble_videos.length);
  console.log('  PDF:', starPods.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log('  subtopics preserved:', subIds.join(', '));
  console.log(
    '  Videos:',
    starPods.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
