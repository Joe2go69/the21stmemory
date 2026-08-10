/**
 * Updates breakdown healing-sanctuaries topic (was placeholder).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields.
 *
 * Run: node scripts/update-healing-sanctuaries.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'healing-sanctuaries';
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
    // Already normalized to preferred or kebab form?
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
const topicImage = normalizeImage(
  'Healing Sanctuaries.webp',
  'healing-sanctuaries.webp'
);
const pdfPreview = normalizeImage(
  'The_Crystalline_Transition.webp',
  'healing-sanctuaries-pdf-preview.webp'
);
const infographic = normalizeImage(
  'Healing_Sanctuaries__Divine_Reclamation.webp',
  'healing-sanctuaries-divine-reclamation.webp'
);

const REPORT = `# Healing Sanctuaries

## Overview

During the epoch of the Mega Breakdown, the collapse of the parasitic overlay triggers a massive restructuring of reality. While the Resonating Army—the already-awakened starseeds—will bypass the healing phases to embark on a direct homecoming path out of the Known Lands, millions of true human souls who have been caught, inverted, and traumatized by parasite systems require deep restoration. Healing Sanctuaries are the sacred, highly specialized frequency chambers designed to facilitate this transition. Far from the sterile, heavy hospitals of the 3D illusion, these sanctuaries are vast, organic structures of light, sound, and living crystal. They exist as transition hubs where fractured or mind-controlled souls stabilize their vibrations, clean their fields of energetic damage, and prepare to step onto higher evolutionary paths.

## Key Terminology

- **Healing Sanctuaries** — Pure frequency spaces constructed from light, sound, and living crystal, functioning as transition halls to stabilize soul vibration.

- **Water Domes** — Vast, translucent, pearlescent domes projected over crystalline water bodies, designed for deep emotional healing.

- **Liquid Sound** — Crystalline water that vibrates at high harmonic frequencies to draw out emotional density and insert memory codes.

- **Crystal Halls** — Crystalline temples, often overlaid in 3D perception as cathedrals or abbeys, designed for mental and energetic realignment.

- **Star Pods** — Floating etheric cocoons suspended in nebula-like space, specifically calibrated for soul and timeline healing.

- **Saferons** — Tall, radiant, holographical light beings from the Council of 12 Suns who serve as gentle ground healers.

- **Light Body Grid** — The energetic template of the soul that dictates its structural frequency and connects it to Source.

- **Timeline Trauma** — Subconscious fractures and karmic wounds accumulated by a soul across multiple distorted 3D incarnations.

- **Known Lands** — The physical realm of 178 world cells contained within the Great Dome.

- **Parasitic Overlay** — The artificial, low-frequency electromagnetic illusion projected by custodians to hijack human perception.

## Core Revelations

The Illusion of 3D Medicine: Modern human hospitals and medical systems are empty constructs designed to address a manipulated biology. True healing occurs at the level of frequency, where the physical vessel is recognized as an avatar template.

Cathedrals as Suppressed Temples: The majestic stone structures known as cathedrals, churches, and abbeys are not historical religious monuments. They are physical overlays built directly on top of active, suppressed crystal temples. Beneath the heavy stone lies living, breathing crystalline structures designed for human rejuvenation.

No Soul is Abandoned: Human sparks who fail to fully resonate during the initial flashes of the Great Awakening are not left behind. They are systematically guided into specialized sanctuaries depending on their specific degree of trauma.

Projection Cloaking: These sanctuaries are currently active but completely invisible to 3D senses, hidden by projection dome technology which bends incoming light and sound around their structures.

## Detailed Mechanics and Key Elements

### The Three Pillars of Restoration

#### Water Domes (Heart Restoration)

Built over pristine, glowing blue-aqua-silver waters, these shimmering domes specialize in extracting emotional density like grief, fear, guilt, and heartbreak. Souls float in pools of water vibrating as liquid sound. This water acts as a container of Source memory codes, drawing out low-frequency trauma and replacing it with pure harmonic resonance. The immediate effect is a profound lifting of weight, leading to spontaneous joy, smiling, and singing.

#### Crystal Halls (Mind Restoration)

These temples feature walls of living crystal that glow with shifting rainbow fractals. Columns of light literally breathe like lungs to clear the energy field. Souls hover above crystal slabs humming with precise harmonic keys. Light filtered through crystal prisms dissolves mental overlays, mind control damage, parasitic programming, and energetic implants. This realigns the light body grid and silences all parasite whispers.

#### Star Pods (Soul Restoration)

Suspended inside etheric space mimicking a colorful nebulae, these cocoons are reserved for severe soul fractures and timeline trauma. The pod wraps the soul in a secure womb of light. High-frequency energy streams reweave the scattered fragments of the soul's history across various timelines. Solar parents and members of the Resonating Army act as guides here, assisting in reclaiming higher memories.

### The Safe-Conduct of the Saferons

The ground healers, known as Saferons, are non-physical, towering (10–12 feet) holographical light beings dispatched from the Council of 12 Suns. They operate with absolute gentleness, never forcing or commanding. Their bio-fields are massive and project a soothing mirror reflection of the soul's original family. This instantly neutralizes any fear or confusion upon arrival, imparting an overwhelming sensation of safety and homecoming.

## Broader Context and Interconnections

The Healing Sanctuaries are fully integrated into the vast Cube containment system. They do not operate in isolation but are connected directly to the other outer domes—such as the Dome of Sheol (originally a recovery sanctuary) and the Dome of Forgotten Gods (the origin chamber of the root tone).

These sanctuaries rely heavily on the restoration of the crystal grids and harmonic lenses that act as the fiber-optic lines of Source. As the Spirit Tree at the center of the Known Lands begins to pulse and light up its ancient root system, it feeds these healing environments with pure, unfiltered light. Furthermore, planetary crystals act as etheric hard drives, holding the unbroken records of each soul's journey. These records are downloaded during the sanctuary process to reconstruct shattered memory timelines, helping souls bypass the artificial amnesia loops once anchored beneath the Vatican.

## Strategic Implications

Transition over Confinement: Sanctuaries are strictly transition halls, not permanent residences or prisons. A soul stays only until its vibration stabilizes.

The Ultimate Choice: Once healed and stabilized, every soul is granted a sovereign choice. They can either ascend into the higher realms of the Great Dome or choose to return to the Known Lands in a fresh, free physical cycle.

A World Without Overlays: Any soul returning to the Known Lands will inhabit a fully restored, crystalline physical realm. The new landscape will be free from parasitic infrastructure, tarmac, or cars, running entirely on free energy drawn from the electromagnetic field, turning the entire realm into one massive med bed.

The Role of the Resonating Army: Starseeds who exit the Known Lands first will eventually have the opportunity to return to these sanctuaries, acting as guides to help speed up the recovery of the loved ones and human souls they originally came to liberate.
`;

const healingSanctuaries = {
  id: TOPIC_ID,
  title: 'Healing Sanctuaries',
  description:
    'Healing Sanctuaries are pure frequency chambers of light, sound, and living crystal — Water Domes, Crystal Halls, and Star Pods — where traumatized true human souls stabilize, clear energetic damage, and prepare for higher evolutionary paths after the Mega Breakdown.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1znHUQHTq9FxwuDfkKugMgBFtUDqITPNu/view?usp=sharing',
  rumble_videos: [
    {
      title: 'The Sanctuaries of Homecoming',
      embed_url: 'https://rumble.com/embed/v7brzbm/?pub=4p0ieu',
      description:
        'The Sanctuaries of Homecoming — Healing Sanctuaries as transition hubs of light, sound, and living crystal where fractured souls stabilize vibration and prepare for higher evolutionary paths after the Mega Breakdown.'
    },
    {
      title: 'Sanctuaries of Awakening',
      embed_url: 'https://rumble.com/embed/v7brzik/?pub=4p0ieu',
      description:
        'Sanctuaries of Awakening — Water Domes, Crystal Halls, and Star Pods for heart, mind, and soul restoration, with Saferons from the Council of 12 Suns guiding traumatized true human souls with absolute gentleness.'
    },
    {
      title: 'Sovereign Soul Restoration in Crystalline Sanctuaries',
      embed_url: 'https://rumble.com/embed/v7bs050/?pub=4p0ieu',
      description:
        'Sovereign Soul Restoration in Crystalline Sanctuaries — Cube-integrated healing halls, Spirit Tree light feed, planetary crystal memory download, and the sovereign choice to ascend or return to a restored crystalline Known Lands.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...healingSanctuaries };
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
  healingSanctuaries.topic_image,
  healingSanctuaries.infographic_image,
  healingSanctuaries.pdf_preview_image
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
  id: healingSanctuaries.id,
  report: healingSanctuaries.report,
  infographic_image: healingSanctuaries.infographic_image,
  pdf_preview_image: healingSanctuaries.pdf_preview_image,
  slide_deck_pdf_url: healingSanctuaries.slide_deck_pdf_url,
  rumble_videos: healingSanctuaries.rumble_videos
};

const existingHeavy = fs.existsSync(topicFile)
  ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
  : {};
const sourceNode = findNode(source.topics, TOPIC_ID);
if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

// Verify image files exist
for (const rel of [
  healingSanctuaries.topic_image,
  healingSanctuaries.infographic_image,
  healingSanctuaries.pdf_preview_image
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
  throw new Error('Expected Water Domes / Crystal Halls / Star Pods subtopics preserved');
}
const subIds = updated.subtopics.map((s) => s.id);
for (const id of ['water-domes', 'crystal-halls', 'star-pods']) {
  if (!subIds.includes(id)) {
    throw new Error(`Missing subtopic: ${id}`);
  }
}

console.log('Updated', TOPIC_ID);
console.log('  topic_image:', healingSanctuaries.topic_image);
console.log('  pdf_preview_image:', healingSanctuaries.pdf_preview_image);
console.log('  infographic_image:', healingSanctuaries.infographic_image);
console.log('  videos:', healingSanctuaries.rumble_videos.length);
console.log('  PDF:', healingSanctuaries.slide_deck_pdf_url);
console.log('  other topics image paths unchanged:', beforeOthers.length);
console.log(
  '  Videos:',
  healingSanctuaries.rumble_videos.map((v) => v.title).join(' | ')
);
