/**
 * Updates breakdown nebulae-resting topic (was placeholder under Star Pods).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields. On collision, appends -2, -3…
 *
 * Run: node scripts/update-nebulae-resting.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'nebulae-resting';
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

const topicImage = normalizeImage('Nebulae Resting.webp', 'nebulae-resting.webp');
const pdfPreview = normalizeImage(
  'Sovereign_Soul_Restoration.webp',
  'nebulae-resting-pdf-preview.webp'
);
const infographic = normalizeImage(
  'Restoration_Within_Light_Womb.webp',
  'restoration-within-light-womb.webp'
);

const REPORT = `# Nebulae Resting

## Overview

Nebulae Resting is a profound state of consciousness recovery and restoration achieved within Star Pods, which are specialized etheric healing systems designed to mend the soul. Suspended in etheric space, these floating pods envelop the soul in a womb of light, simulating the serene environment of resting inside a cosmic nebula. This restorative state specifically targets souls that have suffered soul fractures, timeline trauma, or karmic wounds accumulated across multiple lifetimes under the influence of parasite technology. By entering this state of deep suspension, the fragmented aspects of a soul are systematically rewoven, allowing them to transcend the amnesia and damage imposed by artificial density overlays.

## Key Terminology

- **Nebulae Resting** — The highly restorative state of suspension within a womb of light in etheric space, simulating a nebula, where a soul undergoes timeline and soul-level healing.

- **Star Pods** — Floating, non-physical containment vessels that circulate in etheric space and utilize light-frequency streams to heal soul fractures, timeline trauma, and karmic wounds across timelines.

- **Soul Fractures** — Deep energetic splits or fragmentation within a soul's consciousness, often caused by repeated lifetimes of trauma and parasitic intervention.

- **Timeline Trauma** — Subconscious damage and distress that attaches to a soul and persists across multiple incarnations and historical periods.

- **Womb of Light** — The protective, high-frequency energetic field generated by a Star Pod that completely surrounds a soul during its restoration process.

- **Starlight Pods** — An alternative designation for Star Pods, emphasizing their specific role in mending the core soul structure.

- **Resonating Army** — A group of already awakened returning extraterrestrial souls who came to this realm to assist in the awakening and liberation of trapped human souls.

## Core Revelations

The experience of Nebulae Resting reveals that trauma is not merely psychological or physical but operates at a deep soul level. Under the influence of parasitic overlays, trauma acts as a form of specialized technology that intentionally fragments a soul's awareness, binding them to continuous loops of amnesia and control across different lives.

A critical revelation is that souls who enter Nebulae Resting are often those who came to this realm to help but became trapped, carrying a "little bit of doubt" that kept them bound within the illusion. This hesitation and energetic weight mirror historical events such as the Red Sea event. Despite this lingering doubt preventing a seamless, instant exit at the end of the cycle, these souls are never abandoned. Through the high-frequency environment of the nebula simulation, their dormant codes are safely reactivated, and their fragmented selfhood is put back together.

## Detailed Mechanics and Key Elements

### Etheric Suspension

The Star Pods exist as floating cocoons of straight circulating energy in etheric space. Within this medium, the soul is completely detached from physical density and the heavy sensory constraints of the third dimension.

### Reweaving of Soul Aspects

While the soul is enveloped in the protective womb of light, specialized streams of light frequency are projected through the pod. These frequencies actively reweave the fragmented aspects of the soul's consciousness, restoring structural integrity across fractured timelines.

### Frequency-Driven Acceleration

As the reweaving occurs, the soul's vibration naturally stabilizes and increases. A higher vibrational output allows solar parents, soul families, and guides to easily locate and interface with the resting soul, accelerating the recovery process.

### Guardian and Ally Support

Ground healers and extraterrestrial guides, including the Resonating Army, supervise the Star Pods. These benevolent beings do not use physical forms; instead, they appear as radiant, luminous outlines or holographical light structures to reassure the recovering soul.

### Reunion and Memory Access

The environment is entirely free of parasitic whispers or external frequency interference, ensuring that the first conscious realizations are of complete safety and homecoming. Here, families and guides help reconnect the soul with its higher memory.

## Broader Context and Interconnections

Nebulae Resting represents the final stage of a larger healing process spanning three distinct types of healing sanctuaries. While some souls may recover directly in Star Pods, many must transition through a sequential process resembling an energetic spa:

- **Water Domes** — Shimmering, invisible structures projected over crystalline bodies of water that vibrate like liquid sound to mend emotional wounds, such as grief, heartbreak, and fear.

- **Crystal Halls** — Crystalline temples (often overlaid by physical cathedrals or abbeys) where souls rest on humming crystal slabs to clear mental programming, mind control, and energetic wounds.

- **Starlight pods** — The ultimate stage where starlight pods mend the soul itself, resolving deep timeline fractures.

This entire process of healing is supported by the crystalline grids of the Earth, which act as etheric hard drives. These crystals store the complete records of all soul journeys. This ensures that even when a soul's memory is wiped by the amnesia vortex of the hijacked sun, its unbroken timeline remains preserved by its stellar family and is fully accessible to assist during the healing sanctuaries' recovery sequence.

## Strategic Implications

### Complete Soul Reclamation

Once the healing process is complete, souls awaken as entirely whole, sovereign, and free, with all amnesiac fragments permanently integrated.

### Empowered Sovereignty of Choice

Fully restored souls are granted complete freedom of choice. They are no longer bound to any synthetic reincarnation loop. They may choose to ascend directly to higher realms or return to the Known Lands in a fresh, crystalline cycle entirely free of parasite overlays.

### Systemic Frequency Collapse

The presence of fully healed human and extraterrestrial souls permanently disrupts the parasitic harvest of attention and emotion, also known as loosh. As more souls achieve full restoration and raise their resonance, the remaining density of the 3D overlay fractures and collapses, accelerating the complete return of the original realm.
`;

const nebulaeResting = {
  id: TOPIC_ID,
  title: 'Nebulae Resting',
  description:
    'Nebulae Resting is a profound consciousness recovery state inside Star Pods — a womb of light in etheric space that reweaves soul fractures, timeline trauma, and karmic wounds, restoring sovereign wholeness beyond parasite overlays.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/13fayD51AWZla4NdoDJ712OvNNFFn5l09/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Mending soul fractures in Star Pods',
      embed_url: 'https://rumble.com/embed/v7bz3fw/?pub=4p0ieu',
      description:
        'Mending soul fractures in Star Pods — etheric Star Pods envelop a soul in a womb of light, simulating nebula rest while light-frequency streams reweave fractures, timeline trauma, and karmic wounds.'
    },
    {
      title: 'The Great Reweaving',
      embed_url: 'https://rumble.com/embed/v7bz3kw/?pub=4p0ieu',
      description:
        'The Great Reweaving — dormant codes reactivate inside the nebula simulation as fragmented selfhood is put back together, restoring sovereign choice and collapsing the parasitic loosh harvest.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...nebulaeResting };
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
    nebulaeResting.topic_image,
    nebulaeResting.infographic_image,
    nebulaeResting.pdf_preview_image
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
    'star-pods',
    'timeline-healing',
    'soul-reweaving',
    'healing-sanctuaries',
    'water-domes',
    'crystal-halls'
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
    id: nebulaeResting.id,
    report: nebulaeResting.report,
    infographic_image: nebulaeResting.infographic_image,
    pdf_preview_image: nebulaeResting.pdf_preview_image,
    slide_deck_pdf_url: nebulaeResting.slide_deck_pdf_url,
    rumble_videos: nebulaeResting.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    nebulaeResting.topic_image,
    nebulaeResting.infographic_image,
    nebulaeResting.pdf_preview_image
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
  console.log('  topic_image:', nebulaeResting.topic_image);
  console.log('  pdf_preview_image:', nebulaeResting.pdf_preview_image);
  console.log('  infographic_image:', nebulaeResting.infographic_image);
  console.log('  videos:', nebulaeResting.rumble_videos.length);
  console.log('  PDF:', nebulaeResting.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    nebulaeResting.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
