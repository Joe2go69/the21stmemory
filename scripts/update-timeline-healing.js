/**
 * Updates breakdown timeline-healing topic (was placeholder under Star Pods).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields. On collision, appends -2, -3…
 *
 * Run: node scripts/update-timeline-healing.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'timeline-healing';
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

const topicImage = normalizeImage('Timeline Healing.webp', 'timeline-healing.webp');
const pdfPreview = normalizeImage(
  'Etheric_Soul_Restoration.webp',
  'timeline-healing-pdf-preview.webp'
);
const infographic = normalizeImage(
  'Architecture_of_Soul_Sovereignty_Infographic.webp',
  'architecture-of-soul-sovereignty-infographic.webp'
);

const REPORT = `# Timeline Healing

## Overview

Timeline Healing is a profound multidimensional restorative process that occurs within specialized non-physical chambers known as Star Pods. These structures do not occupy fixed physical space but float in circulating configurations in etheric space, offering a sanctuary that resembles resting inside a nebula. The primary function of this technology is the mending of the soul, specifically addressing the deep-seated fragmentation, Soul Fractures, Timeline Trauma, and Karmic Wounds that accumulate across multiple parallel or sequential incarnations. While other structural chambers address distinct aspects of the heart and mind, these pods specifically target the eternal essence, realigning the soul's energetic blueprint with its original source frequencies.

## Key Terminology

- **Star Pods** — Floating, non-physical structures circulating in etheric space that envelop a soul to facilitate deep timeline and soul-level restoration.

- **Timeline Healing** — The multidimensional process of reweaving fragmented aspects of a soul across parallel and historical cycles.

- **Soul Fractures** — Structural energetic damage and fragmentation sustained by a soul's consciousness across various lifetimes within physical overlays.

- **Timeline Trauma** — Subconscious trauma accumulated from consecutive lifetimes, which is sustained directly at the soul level and reinforced by parasitic technologies.

- **Karmic Wounds** — Persistent energetic injuries and distortions that remain bound to a soul across different incarnations.

- **Womb of Light** — The high-frequency energetic cocoon projected by a Star Pod to envelope a soul and administer targeted restorative frequencies.

- **Crystalline Pods** — Advanced extraterrestrial technological systems capable of curing souls trapped in a temporary 3D illusion, distinct from false human-concocted medical beds.

## Core Revelations

The restoration of human and extraterrestrial souls is a systematic, multi-tiered therapeutic protocol. The Healing Sanctuaries of the Great Dome are not uniform; they are meticulously tuned to different types of trauma and frequencies. Starlight Pods specifically target the soul, completing a sequence that begins with Water Domes mending the heart and Crystal Halls realigning the mind.

Many souls requiring this advanced level of timeline integration are those who carried lingering doubt and hesitation during major planetary transition events, such as the historic Red Sea event. This energetic doubt acts as a vibrational anchor, causing souls to remain temporarily trapped within the physical illusion. Star Pods act as a vital safety net, ensuring that no genuine soul is abandoned to decay within the collapsing overlays.

Furthermore, true timeline restoration cannot be achieved through human-engineered technology. The med beds promoted by planetary truthers are a false concept; human-level technology is fundamentally incapable of repairing extraterrestrial and soul-level structures. Only high-frequency extraterrestrial technology, such as these Crystalline Pods, can interface with the light body grid to dissolve the complex energetic distortions imposed by parasitic systems.

## Detailed Mechanics and Key Elements

### The Womb of Light

Inside a Star Pod, the healing environment is characterized by absolute energetic isolation from the physical 3D matrix. A soul is suspended within a circulating cocoon of light, floating in etheric space. This cocoon functions as a Womb of Light, generating highly specialized streams of light frequency that actively scan, identify, and reweave fragmented aspects of the soul across multiple historical timelines.

### Persistent Timeline Trauma

This reweaving is necessary because timeline trauma is exceptionally persistent. When a soul undergoes experiences of intense suffering, fear, or grief within the physical overlays, the resulting trauma is not merely psychological; it damages the soul at a structural level. Under the influence of parasitic technologies, this trauma is deliberately sustained and carried over subconsciously into subsequent lifetimes, acting as an artificial anchor that keeps the soul looping within the 3D reincarnation grid. The Star Pod neutralizes these parasitic overlays and rewrites the fractured memory streams, restoring the soul to a state of absolute wholeness.

### Extraterrestrial Guidance and Supervision

Extraterrestrial guidance and supervision are central to this mechanical process. As the soul's frequency stabilizes and begins to vibrate at a higher octave, advanced spiritual guides, solar parents, and members of the Resonating Army are able to project into the etheric space of the pod. These entities do not dictate or force the process, but act as gentle, radiant supervisors and stabilizers. Their high-vibrational presence stimulates the sleeping soul codes, accelerating the return of higher memory and helping the soul reconnect with its original cosmic lineage. The soul gradually snaps out of denial, raising its frequency until it emerges entirely whole, sovereign, and free.

## Broader Context and Interconnections

Star Pods do not operate in isolation but are integrated into a vast network of Healing Sanctuaries established throughout the Great Dome. These sanctuaries are pure frequency spaces constructed of light, sound, and living crystal. They are cloaked in translucent, pearl-like invisible domes resting over oceans, valleys, and deep inner-earth cavities.

Within this planetary ecosystem, the healing process is highly organized. A fractured soul is guided sequentially through distinct sanctuaries depending on its specific trauma. Emotional wounds of grief, fear, and heartbreak are first treated in Water Domes, where souls float in liquid sound that draws out density and inserts Source memory codes. Mental overlays, mind control damage, and parasitic programming are subsequently dissolved in Crystal Halls, where souls rest upon humming crystal slabs that project rainbow fractals to realign the light body grid. Only when the heart and mind are mended is the soul prepared for the deep multidimensional integration of the Star Pods. Additionally, these pods serve as the primary transit mechanisms for all active extraterrestrial souls entering or exiting the physical dome during their planetary assistance missions.

## Strategic Implications

### Evolutionary Sovereignty

The completion of Timeline Healing has profound consequences for both individual souls and the collective structure of reality. Once a soul has been restored to wholeness within a Star Pod, it is fully emancipated from the artificial loop of karmic debt and reincarnation. Restored souls are granted absolute evolutionary sovereignty. They can choose to transition immediately to higher cosmic realms or return to initiate a completely fresh cycle within the Known Lands. If they choose to return, they do so without any parasitic overlays, completely free to grow, and equipped with the vast wealth of knowledge accumulated across their entire multi-incarnational journey.

### Collapse of the Parasitic Overlay

On a macro level, the systematic restoration of these fractured souls is the key to fracturing and collapsing the 3D parasitic overlay. The parasitic system relies entirely on harvesting the emotional density and attention—commonly known as loosh—of trapped souls to maintain its false matrix. As souls undergo timeline healing and raise their frequency, they cease to generate this low-vibrational energy. The loss of this energetic food source triggers a rapid frequency collapse of the artificial 3D matrix. Once the overlays are fully dissolved, the planet ceases to function as an energetic farm, revealing its true nature as one massive, self-sustaining crystalline temple—a collective med bed where all life exists in perfect, high-vibrational harmony.
`;

const timelineHealing = {
  id: TOPIC_ID,
  title: 'Timeline Healing',
  description:
    'Timeline Healing is a multidimensional restorative process inside etheric Star Pods — a Womb of Light that reweaves soul fractures, timeline trauma, and karmic wounds across incarnations, restoring original source frequencies and collapsing the 3D parasitic overlay.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1cUFVI2fx2UzfcbNmjp6nGz8v_bAI6s0J/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Timeline Healing in Etheric Star Pods',
      embed_url: 'https://rumble.com/embed/v7bxiqq/?pub=4p0ieu',
      description:
        'Timeline Healing in Etheric Star Pods — Star Pods circulating in etheric space envelope a soul in a Womb of Light to reweave soul fractures, timeline trauma, and karmic wounds.'
    },
    {
      title: 'Mending the Eternal Soul',
      embed_url: 'https://rumble.com/embed/v7bxiwq/?pub=4p0ieu',
      description:
        'Mending the Eternal Soul — Crystalline Pods restore the soul\'s original source frequencies, dissolve parasitic anchors, and return sovereign choice after timeline integration.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...timelineHealing };
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
    timelineHealing.topic_image,
    timelineHealing.infographic_image,
    timelineHealing.pdf_preview_image
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
    'soul-reweaving',
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
    id: timelineHealing.id,
    report: timelineHealing.report,
    infographic_image: timelineHealing.infographic_image,
    pdf_preview_image: timelineHealing.pdf_preview_image,
    slide_deck_pdf_url: timelineHealing.slide_deck_pdf_url,
    rumble_videos: timelineHealing.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    timelineHealing.topic_image,
    timelineHealing.infographic_image,
    timelineHealing.pdf_preview_image
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
  console.log('  topic_image:', timelineHealing.topic_image);
  console.log('  pdf_preview_image:', timelineHealing.pdf_preview_image);
  console.log('  infographic_image:', timelineHealing.infographic_image);
  console.log('  videos:', timelineHealing.rumble_videos.length);
  console.log('  PDF:', timelineHealing.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    timelineHealing.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
