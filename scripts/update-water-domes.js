/**
 * Updates breakdown water-domes topic (was placeholder under Healing Sanctuaries).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields.
 *
 * Run: node scripts/update-water-domes.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'water-domes';
const BREAKDOWN_IMG = path.join(ROOT, 'images', 'breakdown');

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

// Explicit preferred targets so PDF / infographic never collide with topic card name.
const topicImage = normalizeImage('Water Domes.webp', 'water-domes.webp');
const pdfPreview = normalizeImage(
  'Harmonic_Soul_Restoration.webp',
  'water-domes-pdf-preview.webp'
);
const infographic = normalizeImage(
  'Liquid_Sound_Restoration_Resonance_Guide.webp',
  'liquid-sound-restoration-resonance-guide.webp'
);

const REPORT = `# Water Domes

## Overview

Healing Sanctuaries are pure frequency spaces constructed not as physical hospitals, but from light, sound, and living crystal. They manifest as vast, shimmering, translucent pearl domes projected over oceans, valleys, and etheric airspace, cloaked in crystalline invisibility to remain undetected by the lower 3D senses. Within this network, Water Domes serve as the specialized sanctuary environments dedicated to emotional healing. They are designed to extract emotional density and restore harmonic resonance to true human souls carrying deep energetic wounds from lifetimes under parasitic programming.

## Key Terminology

- **Healing Sanctuaries** — Pure frequency spaces constructed from light, sound, and living crystal, functioning as transition halls to stabilize soul vibrations.

- **Water Domes** — Vast, invisible, shimmering emotional healing sanctuaries projected over crystalline waters that glow with specific light-sound frequencies.

- **Ground Healers** — Gentle, radiant, non-forceful holographic light beings (also known as Saferins, Saferons, or Salania) sent from the Council of 12 Suns to support and stabilize souls in the sanctuaries.

- **Liquid Sound** — Crystalline water vibrating with harmonic resonance that holds memory codes of Source, used to draw out emotional density.

- **Emotional Density** — Accumulated trauma, grief, fear, guilt, and heartbreak carried subconsciously by a soul across lifetimes of density.

- **Harmonic Resonance** — The original, balanced vibration of the soul that aligns it with Source and enables memory recall.

- **Crystal Halls** — Mental and energetic healing temples of living crystal designed to clear parasitic programming and realign the light body grid.

- **Star Pods** — Soul and timeline healing structures floating in etheric space, designed to reweave soul fractures and timeline trauma.

## Core Revelations

The healing sanctuaries are fully operational, pre-established simulations hidden from ordinary 3D perception by advanced cloaking fields.

No true human soul is abandoned during the fracture and collapse of the 3D overlay; those not fully resonating are automatically guided to these safe frequency domains.

Water within the Water Domes contains Source memory codes, behaving as a super-conductive medium that bypasses normal physical limitations to trigger instant, visual soul remembrance.

The healing process is entirely voluntary and benevolent, completely mending heart, mind, and soul to ensure a seamless transition out of the parasitic matrix.

## Detailed Mechanics and Key Elements

The restorative process within the Water Domes operates through a precise sequence of vibrational interactions:

### Vessel Alignment

Souls enter the Water Domes in their crystalline body selves, hovering within the high-frequency environment rather than standing.

### Immersion in Liquid Sound

The soul enters pools of crystalline water that glows with blue, aqua, silver, pearl, and green light-sound frequencies. The water vibrates as liquid sound.

### Vibrational Extraction

As the soul floats, the vibrating water draws out dense energetic blockages—such as grief, fear, guilt, and heartbreak.

### Source Code Infusion

The water, holding the original memory codes of Source, replaces the extracted density with harmonic resonance.

### Visions and Auditory Recall

The interaction of Source codes with the soul's energetic blueprint triggers deep, visual and auditory memory recall of their true cosmic origin.

### Emerge and Galactic Reunion

Souls emerge from the pools lighter and singing, met instantly by their waiting galactic families and solar parents.

### Ground Healers

The environment is stabilized and managed by specialized Ground Healers:

These tall, radiant holographic light beings are sent from the Council of 12 Suns to provide gentle, non-forceful assistance.

They can shift their appearance to reflect the soul's family, using luminous outlines to establish absolute safety and eliminate fear.

They utilize precise vibrational and frequency powers to maintain tranquility and guide the transition.

## Broader Context and Interconnections

The Water Domes represent the emotional phase of a comprehensive, three-tiered healing system:

- **Water Domes** mend the heart.
- **Crystal Halls** mend the mind, utilizing crystal slabs humming with harmonic frequency to dissolve mental overlays and mind control damage.
- **Star Pods** mend the soul, leveraging floating cocoons in etheric space to reweave soul fractures and timeline trauma.

This three-part structure is supported by the Spirit Tree at the center of the Known Lands, which serves as the central axis of consciousness, sending roots and branches to feed all seven gardens or outer domes. Following the collapse of the parasitic 3D overlay, the entire realm returns to its original state as one vast, unified crystalline temple, operating as a singular med bed for collective restoration.

This stands in sharp contrast to the current, manipulated 3D reality, where parasites exploit natural oceans as conductive mediums for aggressive sound weapons to suppress coastal grids and block access to these hidden sanctuaries.

## Strategic Implications

### Dissolution of Reincarnation Loops

By mending the heart, mind, and soul, the sanctuaries systematically dismantle the counterfeit cycle of forced reincarnation and memory-wiping run under the Vatican and Saturnian systems.

### Sovereign Choice

Stabilized souls are returned to a state of absolute sovereignty, allowing them to freely choose whether to ascend to higher realms or return to a fresh, pristine creation cycle in the Known Lands.

### The Resonating Army's Mission

While the Resonating Army bypasses the healing sanctuaries entirely due to their pre-awakened, high-frequency state, they are granted the strategic option to enter these sanctuaries after their own homecoming path is complete, actively assisting and accelerating the recovery of the souls they came to liberate.
`;

const waterDomes = {
  id: TOPIC_ID,
  title: 'Water Domes',
  description:
    'Water Domes are specialized emotional healing sanctuaries within the Healing Sanctuaries network — vast, cloaked pearl domes over crystalline waters where liquid sound extracts emotional density and restores harmonic resonance to true human souls.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1Wmb_PX7mee4olYvVvOc7OCdHuNgydjwk/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Healing Sanctuaries',
      embed_url: 'https://rumble.com/embed/v7bseee/?pub=4p0ieu',
      description:
        'Healing Sanctuaries — pure frequency spaces of light, sound, and living crystal; Water Domes as cloaked pearl sanctuaries for emotional healing and the extraction of density from lifetimes under parasitic programming.'
    },
    {
      title: 'Your Sanctuary Awaits',
      embed_url: 'https://rumble.com/embed/v7bseh8/?pub=4p0ieu',
      description:
        'Your Sanctuary Awaits — vessel alignment, immersion in liquid sound, vibrational extraction, Source code infusion, and galactic reunion within the Water Domes healing sequence.'
    },
    {
      title: 'Soul Restoration in the Pearl Domes',
      embed_url: 'https://rumble.com/embed/v7bseu2/?pub=4p0ieu',
      description:
        'Soul Restoration in the Pearl Domes — Ground Healers from the Council of 12 Suns, the three-tiered Water Domes / Crystal Halls / Star Pods system, Spirit Tree feed, and sovereign choice after heart restoration.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...waterDomes };
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

// --- Main ---
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
  waterDomes.topic_image,
  waterDomes.infographic_image,
  waterDomes.pdf_preview_image
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
  id: waterDomes.id,
  report: waterDomes.report,
  infographic_image: waterDomes.infographic_image,
  pdf_preview_image: waterDomes.pdf_preview_image,
  slide_deck_pdf_url: waterDomes.slide_deck_pdf_url,
  rumble_videos: waterDomes.rumble_videos
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
  waterDomes.topic_image,
  waterDomes.infographic_image,
  waterDomes.pdf_preview_image
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

// Subtopics tree preserved
if (!updated.subtopics || updated.subtopics.length < 3) {
  throw new Error(
    'Expected Emotional Mending / Liquid Sound / Memory Restoration subtopics preserved'
  );
}
const subIds = updated.subtopics.map((s) => s.id);
for (const id of ['emotional-mending', 'liquid-sound', 'memory-restoration']) {
  if (!subIds.includes(id)) {
    throw new Error(`Missing subtopic: ${id}`);
  }
}

console.log('Updated', TOPIC_ID);
console.log('  topic_image:', waterDomes.topic_image);
console.log('  pdf_preview_image:', waterDomes.pdf_preview_image);
console.log('  infographic_image:', waterDomes.infographic_image);
console.log('  videos:', waterDomes.rumble_videos.length);
console.log('  PDF:', waterDomes.slide_deck_pdf_url);
console.log('  other topics image paths unchanged:', beforeOthers.length);
console.log(
  '  Videos:',
  waterDomes.rumble_videos.map((v) => v.title).join(' | ')
);
