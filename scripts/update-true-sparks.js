/**
 * Updates breakdown true-sparks topic (was placeholder under Human Sols).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields. On collision, appends -2, -3…
 *
 * Run: node scripts/update-true-sparks.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'true-sparks';
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

// Explicit preferred targets so PDF / infographic never collide with topic card name.
const topicImage = normalizeImage('True Sparks.webp', 'true-sparks.webp');
const pdfPreview = normalizeImage(
  'Crystalline_Soul_Awakening.webp',
  'true-sparks-pdf-preview.webp'
);
const infographic = normalizeImage(
  'True_Sparks__Sovereign_Soul_Awakening.webp',
  'true-sparks-sovereign-soul-awakening.webp'
);

const REPORT = `# True Sparks

## Overview

True Sparks (also referred to as true human souls or human sols) represent the authentic divine essence caught, inverted, and manipulated within the parasitic simulation. Unlike the non-player characters (NPCs), who are soulless background programs and mere fragments of light, True Sparks are the eternal consciousness units that the Resonating Army and ET alliances descended to liberate. They carry inherent, natural connections to Source that have been suppressed and obscured by the layered, artificial frequencies of the parasitic overlay.

## Key Terminology

- **True Sparks** — The genuine human souls and sols that carry the eternal spark of Source, currently caught and inverted by parasites within the simulation.

- **Spark Ignition** — The critical activation of divine consciousness that separates true souls from hollow sleepers, allowing them to perceive the reality of the simulation and escape the overlay.

- **Human Sols** — Authentic soul consciousness units seeded into physical humanoid vessels to experience creation and currently undergoing a process of mass awakening.

- **Deep Sleepers** — True human souls who remain unawakened and lack active spark ignition, causing them to temporarily remain trapped in the hollow echo of the three-dimensional illusion.

- **Embedded Codes** — Divine, high-frequency energetic signatures naturally implanted within the souls of True Sparks and ET allies by solar parents prior to entering the physical realms.

## Core Revelations

True Sparks were originally created to collaborate and connect with everything in their world, which naturally elevated their frequency and spirituality. However, they were targeted, captured, and systematically inverted by parasites to serve as the energetic foundation of the artificial three-dimensional world.

Every True Spark carries the unbroken lineage of Source. While parasites can distort voices and manipulate the nervous system to render concrete and modern materials as solid, they cannot generate the first spark of creation or own a soul. The authentic connection to Source remains intact beneath the amnesia.

Awakening is not an intellectual process but a frequency-based recognition. The codes embedded within the ET souls of the Resonating Army are specifically designed to match and trigger the latent codes within the True Sparks. This harmonic resonance creates an overwhelming feeling of trust and a flood of memory, breaking the parasitic spell.

## Detailed Mechanics and Key Elements

### The Mechanism of Parasitic Capture and the Amnesia Loop

The core of the parasitic control system relies on intercepting True Sparks during their transition through the Sun, which originally functioned as a crystalline transit portal. Parasites constructed artificial entry bands around the sun's natural gate, establishing an amnesia vortex. When a True Spark passes through this vortex, their memory is stripped, and their Akashic fragments are copied, logged, and inverted within a massive database under the Vatican. This archive is used to track, recycle, and reincarnate souls into repetitive, docile loops of three-dimensional existence to continuously harvest emotional energy or loosh.

### The Role of Embedded Codes and Activation

Before the introduction of the parasite overlay, True Sparks were naturally embedded with codes designed to interact with the crystalline structures of their world. ET sols who entered the realm to assist were embedded with matching harmonic signatures. When the ET sols emit their frequency, True Sparks do not immediately jump to the higher frequency but recognize it as familiar, triggering a gradual process of questioning, calming, and final awakening. This activation occurs in stages triggered by physical and energetic cosmic events, such as the white hat broadcasts and solar pulses.

### The Spark Ignition and the Separation of Frequencies

When the final event cycle completes and the parasitic overlay collapses through frequency collapse, a stark division occurs based on vibration. Sols who have achieved spark ignition will immediately perceive the vibrant, unpolluted reality of the Second Realm (the original crystalline world). Those who remain as deep sleepers without active spark ignition do not transition immediately; instead, they are held in a hollow, three-dimensional "echo illusion" characterized by ruins, rubble, and severe shortages, but free of parasite domination. Soulless NPCs, who never possessed a spark, simply dissolve like shadows when the light hits.

### The Pathways of Restoration and Healing Sanctuaries

Because True Sparks who do not fully resonate at the moment of the fracture are not abandoned, they are systematically guided to one of three specialized healing sanctuaries to stabilize their vibration:

#### Water Domes

Shimmering, invisible domes projected over crystalline lakes, oceans, and waters that glow blue-aqua-silver colours. Floating in these pools mends the heart by drawing out emotional density (grief, fear, guilt, and heartbreak) and replacing it with harmonic resonance and memory codes of Source.

#### Crystal Halls

Mental and energetic healing temples (overlaid in 3D perception as cathedrals and churches) containing crystal slabs that hum with harmonic frequency. These realign the light body grid, clear parasitic programming and mental overlays, and dissolve energetic wounds, allowing cognitive clarity to return.

#### Star Pods

Floating pods in cocoons of circulating light floating in etheric space resembling a nebula. These specialize in soul and timeline healing, reweaving fragmented aspects of the soul damaged by timeline trauma or karmic wounds across multiple incarnations.

## Broader Context and Interconnections

True Sparks share a profound structural relationship with the crystalline grids, nodes, and harmonic lenses of the realm. Because the entire physical plane is actually a singular, giant crystalline temple, the resonance of awakened True Sparks directly interacts with and activates these dormant structures. Furthermore, the Council of 12 Suns provides the overarching stewardship that guides the return of True Sparks, utilizing gentle, non-forceful holographic light beings known as ground healers (or Saferons) to oversee their transition and stabilization within the healing domains.

## Strategic Implications

As True Sparks awaken and raise their vibrational frequency, they actively fracture the parasitic overlay. The collective elevation of soul frequency acts as a destabilizing force against the low-frequency holographic projections, forcing the physical structures of the control grid to pixelate, shimmer, and dissolve.

Upon undergoing complete restoration within the healing sanctuaries, True Sparks are granted absolute sovereignty to choose their next evolutionary path. They may choose to ascend directly to higher dimensional realms or return to a fresh, clean incarnation cycle within the Known Lands that is entirely free of parasite overlays, money, and artificial control systems.

The awakening of True Sparks completely invalidates the artificial 3D systems of commerce, government, and societal status. Since true wealth is defined solely by resonance and shared abundance, the restored sparks transition into a reality governed by conscious creation, free energy drawn directly from the electromagnetic field, and immediate telepathic transportation.
`;

const trueSparks = {
  id: TOPIC_ID,
  title: 'True Sparks',
  description:
    'True Sparks are authentic divine souls — also called true human souls or human sols — carrying the eternal spark of Source, inverted by the parasitic overlay, intercepted at the sun’s amnesia vortex, and awakened through spark ignition and the three healing sanctuaries.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1NjzWr5sab23lRwaBgESXzATB-qrp02vS/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Sovereign Remembrance',
      embed_url: 'https://rumble.com/embed/v7c21xu/?pub=4p0ieu',
      description:
        'Sovereign Remembrance — True Sparks as authentic Source souls inverted in the simulation, carrying an unjammable divine connection and awakening through frequency-based remembrance.'
    },
    {
      title: 'Shattering the parasitic amnesia vortex',
      embed_url: 'https://rumble.com/embed/v7c22l4/?pub=4p0ieu',
      description:
        'Shattering the parasitic amnesia vortex — True Sparks intercepted at the sun’s artificial entry bands, memory stripped and archived beneath the Vatican, then restored through spark ignition and the three healing sanctuaries.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...trueSparks };
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
    trueSparks.topic_image,
    trueSparks.infographic_image,
    trueSparks.pdf_preview_image
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
    'human-sols',
    'population-types',
    'npc-programs',
    'background-fragments',
    'ai-shells',
    'code-dissolution',
    'healing-path',
    'spirit-inversion',
    'et-sols',
    'healing-sanctuaries',
    'water-domes',
    'crystal-halls',
    'star-pods',
    'amnesia-vortex',
    'vatican-archive'
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
    id: trueSparks.id,
    report: trueSparks.report,
    infographic_image: trueSparks.infographic_image,
    pdf_preview_image: trueSparks.pdf_preview_image,
    slide_deck_pdf_url: trueSparks.slide_deck_pdf_url,
    rumble_videos: trueSparks.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    trueSparks.topic_image,
    trueSparks.infographic_image,
    trueSparks.pdf_preview_image
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
  console.log('  topic_image:', trueSparks.topic_image);
  console.log('  pdf_preview_image:', trueSparks.pdf_preview_image);
  console.log('  infographic_image:', trueSparks.infographic_image);
  console.log('  videos:', trueSparks.rumble_videos.length);
  console.log('  PDF:', trueSparks.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    trueSparks.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
