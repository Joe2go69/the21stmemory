/**
 * Updates breakdown background-fragments topic (was placeholder under NPC Programs).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields. On collision, appends -2, -3…
 *
 * Run: node scripts/update-background-fragments.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'background-fragments';
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
const topicImage = normalizeImage('Background Fragments.webp', 'background-fragments.webp');
const pdfPreview = normalizeImage(
  'Dissolving_the_Overlay.webp',
  'background-fragments-pdf-preview.webp'
);
const infographic = normalizeImage(
  'Fragments_of_the_Parasitic_Overlay.webp',
  'fragments-of-the-parasitic-overlay.webp'
);

const REPORT = `# Background Fragments

## Overview

Background Fragments are projections of light-force that lack individual, sovereign souls, serving as background programs to maintain the stability of the 3D simulation. Rather than being independent entities with their own spiritual lineages, they are systemic mechanisms designed to hold the matrix together, populating the simulated environment to make it appear complete and consistent to sovereign souls. These projections constitute the vast majority of the population, operating entirely within the parasitic overlay. They function on a highly restricted low vibration frequency, which anchors them to the illusions of the matrix and prevents them from registering or interacting with higher-density realities.

## Key Terminology

- **Background Fragments** — Projections of light-force without individual sovereign souls, functioning as systemic programs to stabilize the simulated reality.

- **NPC Programs** — Non-player character software operating within low-frequency biological vessels, seeded through artificial bands to maintain the 3D matrix.

- **Spark Ignition** — The presence of a sovereign, eternal soul-spark, which background fragments and deep sleepers entirely lack.

- **Coded Memory Inserts** — Pre-programmed historical narratives and artificial memory sets implanted into NPC vessels to simulate personal history or past lives.

- **Amnesia Vortex** — A frequency distortion field positioned at the sun's transit band that strips arriving souls of memory and routes NPC shells.

- **Voice to Skull** — A parasitic technology that projects artificial thoughts, voices, or activation codes directly into the minds of NPCs to manipulate their behavior.

## Core Revelations

Background fragments are not independent souls but are actually fragments of our light. They serve as automated, systemic programs that populate the simulation and provide the dense social fabric required to keep sovereign souls distracted.

A substantial portion of the world's most prominent, wealthy, and elite individuals are not sovereign beings, but are actually automated NPC programs designed to model materialistic desires, reinforce social hierarchies, and maintain systemic control.

Lacking any spiritual anchor or origin outside of this simulated environment, these background entities have no permanent existence and will completely dissolve into nothingness when the parasitic overlay collapses.

## Detailed Mechanics and Key Elements

### Seeding and Vessel Insertion

NPC vessels do not enter this realm through organic spiritual inheritance. Instead, they are generated through artificial entry bands installed by the parasites around the sun's natural gateway. While sovereign souls are routed through the original solar pathways, NPC shells are seeded through these custom filters, carrying pre-installed parasitic software and tech rather than an organic solar lineage. Because they possess no real past lives, their personalities and memories are structured using pre-packaged coded memory inserts designed to enforce the belief that "you only live once," keeping their awareness entirely boxed within a single, material lifetime.

### Cognitive Exploitation and Frequency Manipulation

Operating without a sovereign soul-spark makes NPCs exceptionally vulnerable to cognitive direction. They are highly responsive to scalar frequency weapons broadcast from hidden towers and the black cube A.I. system. These weapons target brainwave patterns—specifically theta, delta, and alpha waves—to systematically induce states of confusion, sleepiness, anger, or deep despair across the population. Furthermore, voice to skull technology is used to project artificial thoughts directly into their minds, which NPCs mistake for their own organic thinking. Specific television broadcasts, numbers, or quotes can act as localized activation codes, instantly triggering entire segments of the NPC population to execute pre-programmed narratives or turn hostile toward resonating souls.

### The Glitching Phenomenon and Systemic Collapse

As resonating souls raise their vibration, they emit high-frequency signals that actively fracture the parasitic overlay. Because the simulation's infrastructure is backed by the manipulated consciousness of its inhabitants, this vibrational rise forces the underlying A.I. scaffolding to crumble, causing NPC programs to experience severe system errors or "glitches". During the initial stages of a system reset, such as a communications blackout, NPCs will enter severe panic loops, unable to process the frequency fracture. Lacking internal guidance, some will become completely dazed, quiet, or erratic, while others will manifest sudden emotional outbursts, weeping, or repeating futile behavioral loops—such as running to the end of a road only to turn back.

## Broader Context and Interconnections

The interaction between sovereign entities and background programs is defined by energetic separation. Resonating souls are instructed to completely starve NPC programs of attention, refusing to engage in conflict or validate their systemic panics. The high frequency of the Resonating Army acts as a solvent to the A.I. matrix, meaning that simply maintaining a stabilized presence disrupts the automated NPC grid.

Furthermore, this frequency barrier prevents NPCs from perceiving the real craft arrival. Because their biological receivers are tuned strictly to low-vibrational bands, the incoming living ships of the solar families remain entirely invisible and unnoticed by them. They remain trapped within the dissolving 3D illusion, even as the sovereign souls phase out of the dome.

## Strategic Implications

The systematic collapse of the parasitic overlay carries absolute consequences for all background programs. Because NPC vessels are entirely dependent on the low-frequency parameters of the 3D matrix, they cannot survive its dissolution. Once the false entry bands around the sun collapse, these programs will experience a complete frequency collapse, dissolving like shadows when the true light of the realm is revealed.

For human souls who have become "NPC stained"—carrying deep energetic wounds or mind control overlays from prolonged exposure—the dissolution of the NPC programs will trigger a transition to healing sanctuaries. These souls are routed to specialized environments, such as water domes, crystal halls, or star pods, where their distorted light body grids are realigned, separating their true awareness from the parasitic software they absorbed.
`;

const backgroundFragments = {
  id: TOPIC_ID,
  title: 'Background Fragments',
  description:
    'Background Fragments are projections of light-force without individual sovereign souls — systemic programs that populate the 3D simulation, run on a restricted low-frequency band, and dissolve when the parasitic overlay collapses.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1PWznMKU8hY-Hu6fSPZG4pKtAt9wX5G6A/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Background Fragments',
      embed_url: 'https://rumble.com/embed/v7c0o5u/?pub=4p0ieu',
      description:
        'Background Fragments — projections of light-force without sovereign souls, seeded as systemic programs that hold the 3D simulation together and dissolve when the parasitic overlay collapses.'
    },
    {
      title: 'Identifying the NPCs in our simulation',
      embed_url: 'https://rumble.com/embed/v7c0oe0/?pub=4p0ieu',
      description:
        'Identifying the NPCs in our simulation — coded memory inserts, Voice to Skull activation, glitching during frequency fracture, and starving background programs of attention as the overlay dissolves.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...backgroundFragments };
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
    backgroundFragments.topic_image,
    backgroundFragments.infographic_image,
    backgroundFragments.pdf_preview_image
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
    'npc-programs',
    'population-types',
    'npc-glitching',
    'ai-shells',
    'code-dissolution',
    'human-sols',
    'voice-to-skull',
    'amnesia-vortex'
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
    id: backgroundFragments.id,
    report: backgroundFragments.report,
    infographic_image: backgroundFragments.infographic_image,
    pdf_preview_image: backgroundFragments.pdf_preview_image,
    slide_deck_pdf_url: backgroundFragments.slide_deck_pdf_url,
    rumble_videos: backgroundFragments.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    backgroundFragments.topic_image,
    backgroundFragments.infographic_image,
    backgroundFragments.pdf_preview_image
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
  console.log('  topic_image:', backgroundFragments.topic_image);
  console.log('  pdf_preview_image:', backgroundFragments.pdf_preview_image);
  console.log('  infographic_image:', backgroundFragments.infographic_image);
  console.log('  videos:', backgroundFragments.rumble_videos.length);
  console.log('  PDF:', backgroundFragments.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    backgroundFragments.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
