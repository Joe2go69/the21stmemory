/**
 * Updates breakdown soul-reweaving topic (was placeholder under Star Pods).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields. On collision, appends -2, -3…
 *
 * Run: node scripts/update-soul-reweaving.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'soul-reweaving';
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

const topicImage = normalizeImage('Soul Reweaving.webp', 'soul-reweaving.webp');
const pdfPreview = normalizeImage(
  'Luminescent_Soul_Reweaving.webp',
  'soul-reweaving-pdf-preview.webp'
);
const infographic = normalizeImage(
  'Soul_Reweaving_Architecture_Guide.webp',
  'soul-reweaving-architecture-guide.webp'
);

const REPORT = `# Soul Reweaving

## Overview

Soul reweaving is a precise restorative process designed to mend the deepest energetic splits within a consciousness. Operating within specialized star pods (also referred to as starlight pods), this mechanism addresses multidimensional damage. It targets souls carrying profound soul fractures, timeline trauma, and karmic wounds that have accumulated across various lifetimes. Unlike physical or mental therapies, soul reweaving works directly at the soul level, utilizing targeted frequencies to unify fragmented parts of the self that have been scattered across different temporal sequences. By enveloping the damaged soul in a protective container of light, the process systematically reconstructs the original, uncorrupted architecture of the consciousness.

## Key Terminology

- **Soul Reweaving** — The process of using specialized streams of light frequency to integrate and heal fragmented aspects of a soul across multiple timelines.

- **Star Pods** — Floating therapeutic containers circulating in etheric space, designed specifically to facilitate timeline and soul healing.

- **Soul Fractures** — Deep-seated splits and energetic breaks in a soul's core structure caused by trauma and parasitic interference across successive lives.

- **Timeline Trauma** — Subconscious energetic damage that sticks with a soul across different lifetimes and overlays due to negative experiences and technological manipulations.

- **Womb of Light** — The localized protective field of high-frequency light projected by a star pod to envelop and isolate a soul during its restoration.

- **Etheric Space** — The subtle, non-physical environment resembling a nebula where star pods float and operate outside of standard density.

## Core Revelations

Soul reweaving represents the terminal stage of a comprehensive rehabilitation process for souls caught within dense physical illusions. Many of the souls requiring this restoration are those who came to assist but fell into cycles of doubt, similar to the historical Red Sea event. These individuals survived the initial planetary transitions but harbored lingering frequency imbalances or subconscious hesitation.

The primary revelation of this mechanism is that timeline trauma is not merely psychological; it is a persistent, structural infection at the soul level. Parasite technology actively exploits these energetic vulnerabilities, carrying trauma forward through different lives in the overlays to keep souls submissive. Soul reweaving systematically dismantles these artificial traps, allowing the consciousness to transcend the low-frequency loops imposed upon them. Once reweaving is complete, the soul is fully liberated from the illusion of separation and reclaimed as an eternal, sovereign being.

## Detailed Mechanics and Key Elements

### The Star Pod Environment

The reweaving process takes place within floating star pods situated in the deep quiet of etheric space, giving the inhabitant the experience of resting inside a shimmering nebulae. This non-physical setting isolates the soul from the heavy, distorted frequencies of the 3D plane, ensuring that the healing energy is entirely uncorrupted.

### The Restorative Process

The mechanical steps of soul reweaving unfold through a sequence of high-vibrational interactions:

- **Isolation and Envelopment:** The soul is placed inside the floating pod, which projects a protective womb of light around it. This containment shield prevents any external low-frequency interference or psychic draining.

- **Frequency Infusion:** The pod releases precise, circulating streams of light frequency. These light frequencies are carefully calibrated to match the soul's original, uncorrupted template.

- **Synthesis and Integration:** As the light streams flow, they actively reweave the fragmented pieces of the soul that have been scattered across different timelines. This restores the continuity of the soul's energetic blueprint.

- **Memory Reconnection:** The high-frequency environment triggers the return of higher memory. This phase is heavily supported by external guides, including solar parents, solar families, and members of the resonating army who step in to supervise the retrieval of ancient identity codes.

- **Vibrational Stabilization:** The process continues until the soul's core vibration completely stabilizes, dissolving any residual doubt or energetic distortion.

### Soul Transformation and Emergence

Through these steps, the rewoven soul undergoes a complete transmutation. The shattered pieces of their history are brought back into alignment, purging the subconscious blockages that previously limited their expansion. The healed soul emerges from the pod entirely whole, experiencing a profound return of clarity, sovereignty, and absolute freedom from parasitic programming.

## Broader Context and Interconnections

Soul reweaving exists as the final phase of a three-part therapeutic progression across distinct healing sanctuaries. These sanctuaries are not structured like earthly hospitals but are vast, translucent, pearl-like domes of light resting over oceans, valleys, and airspace.

The complete healing sequence operates as follows:

- **Water Domes** are the initial step, utilizing sound-vibrational pools to mend emotional wounds, drawing out grief, fear, and heartbreak.

- **Crystal Halls** represent the second stage, where souls rest on humming crystal slabs to clear mental overlays, mind control damage, and parasitic whispers.

- **Star Pods** complete the sequence, focusing specifically on mending the soul and healing timeline fractures.

This healing infrastructure is supervised by ground healers (identified as Saferons or Safarin), who are tall, luminous light beings sent from the Council of 12 Suns. These benevolent beings guide recovering souls through the sanctuaries without force, stabilizing their frequency until they are ready to transition. Additionally, the crystal grids and planetary hard drives record every step of the soul's journey, ensuring that the solar families never lose track of their lineage during the recovery process.

## Strategic Implications

The completion of the soul reweaving process carries massive strategic consequences for the liberation of the Great Dome. By restoring the fragmented souls, the overall collective frequency of the realm rises, which directly accelerates the collapse of the false 3D overlay. As healed souls step out of their trauma, they are granted the ultimate choice of their next evolutionary cycle: they may choose to transition directly into the higher, unpolluted realms of the second realm, or they can return to the known lands in a fresh, parasite-free physical cycle to build new crystalline civilizations.

Furthermore, this restoration allows the resonating ET souls to reunite with their original cosmic lineages. By repairing the breaks in the collective light web, soul reweaving ensures that the dark, parasitic matrix loses its final energetic anchor, completing the transition of the physical plane into a unified, high-vibrational crystalline temple.
`;

const soulReweaving = {
  id: TOPIC_ID,
  title: 'Soul Reweaving',
  description:
    'Soul Reweaving is a precise restorative process inside specialized star pods — a Womb of Light that mends soul fractures, timeline trauma, and karmic wounds, reconstructing the original uncorrupted architecture of consciousness.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1Yem3F4fBQKUS-4wrvhfo7XSLE0ZuU92Q/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Soul Reweaving',
      embed_url: 'https://rumble.com/embed/v7byyks/?pub=4p0ieu',
      description:
        'Soul Reweaving — specialized star pods project targeted light frequencies to unify fragmented soul parts scattered across temporal sequences.'
    },
    {
      title: 'Healing Timeline Trauma in Star Pods',
      embed_url: 'https://rumble.com/embed/v7byyr2/?pub=4p0ieu',
      description:
        'Healing Timeline Trauma in Star Pods — floating therapeutic containers in etheric space envelop a soul in a womb of light to dissolve persistent timeline trauma.'
    },
    {
      title: 'Soul Reweaving for Timeline Trauma',
      embed_url: 'https://rumble.com/embed/v7byyui/?pub=4p0ieu',
      description:
        'Soul Reweaving for Timeline Trauma — the terminal restoration stage that dismantles parasitic trauma traps and reclaims the soul as an eternal, sovereign being.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...soulReweaving };
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
    soulReweaving.topic_image,
    soulReweaving.infographic_image,
    soulReweaving.pdf_preview_image
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
    'nebulae-resting',
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
    id: soulReweaving.id,
    report: soulReweaving.report,
    infographic_image: soulReweaving.infographic_image,
    pdf_preview_image: soulReweaving.pdf_preview_image,
    slide_deck_pdf_url: soulReweaving.slide_deck_pdf_url,
    rumble_videos: soulReweaving.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    soulReweaving.topic_image,
    soulReweaving.infographic_image,
    soulReweaving.pdf_preview_image
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
  if (!heavyParsed.rumble_videos || heavyParsed.rumble_videos.length !== 3) {
    throw new Error('Expected 3 rumble videos');
  }
  if (!heavyParsed.slide_deck_pdf_url) {
    throw new Error('Missing slide_deck_pdf_url');
  }
  if (!heavyParsed.infographic_image || !heavyParsed.pdf_preview_image) {
    throw new Error('Missing infographic_image or pdf_preview_image');
  }

  JSON.parse(JSON.stringify(heavyParsed));

  console.log('Updated', TOPIC_ID);
  console.log('  topic_image:', soulReweaving.topic_image);
  console.log('  pdf_preview_image:', soulReweaving.pdf_preview_image);
  console.log('  infographic_image:', soulReweaving.infographic_image);
  console.log('  videos:', soulReweaving.rumble_videos.length);
  console.log('  PDF:', soulReweaving.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    soulReweaving.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
