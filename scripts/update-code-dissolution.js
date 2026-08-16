/**
 * Updates breakdown code-dissolution topic (was placeholder under NPC Programs).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields. On collision, appends -2, -3…
 *
 * Run: node scripts/update-code-dissolution.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'code-dissolution';
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

// Explicit preferred targets so PDF / infographic never collide with topic card name
// or with existing frequency-collapse assets owned by other topics.
const topicImage = normalizeImage('Code Dissolution.webp', 'code-dissolution.webp');
const pdfPreview = normalizeImage(
  'Frequency_Collapse.webp',
  'code-dissolution-pdf-preview.webp'
);
const infographic = normalizeImage(
  'The_NPC_Code_Dissolution_Reality.webp',
  'the-npc-code-dissolution-reality.webp'
);

const REPORT = `# Code Dissolution

## Overview

NPC code dissolution is the systemic unraveling, glitching, and eventual disappearance of non-player character programs within the simulated 3D matrix. NPCs are not organic, sovereign souls, but rather background programs and fragments of light designed to hold the holographic simulation together. Lacking a true spark ignition or sovereign soul connection to the outer realms, these artificial entities are fundamentally incompatible with the returning pristine template of the earth.

As the high-vibrational output of resonating souls systematically fractures the parasitic overlay, the low-vibrational scaffolding supporting the NPC program collapses. This triggers a progressive failure of the pre-coded algorithms governing NPC behavior, perception, and physical vessels, causing them to flicker, malfunction, and ultimately dissolve like shadows when the light hits. This process represents a literal frequency collapse of the artificial reality, ensuring that entities without an anchor outside this realm completely dematerialize as the simulation shifts.

## Key Terminology

- **NPC** — Background programs and fragments of light created without a true soul spark or solar lineage, acting as stabilizing fillers to hold the simulated matrix together.

- **NPC Code Dissolution** — The progressive degradation, glitching, and final collapse of the artificial software and biological vessel programming that governs non-player characters.

- **A.I. Scaffolding** — The underlying artificial intelligence framework running on autopilot that coordinates NPC leaders, media, and geopolitical scripts.

- **Dissolving Loops** — Scripted, repetitive, and automated cycles of behavior and perception that NPCs slip into as their supporting artificial structures crumble.

- **Spark Ignition** — The activation of the eternal, sovereign soul spark that distinguishes true human and ET souls from artificial background programs.

- **Perception-Based Solidity** — The low-frequency holographic projection field that convinces human senses that artificial, modern structures like concrete, metal, and glass are heavy and permanent.

## Core Revelations

NPCs do not carry the solar lineage code and possess no organic past lives. They are seeded as NPC shells carrying parasite software and tech instead of organic memory, routed through artificial bands spliced onto the sun.

During the initial phases of the Great Awakening's communications blackout, the sudden withdrawal of the parasitic grid's energy triggers massive glitches across all NPC networks. These glitches present physically as dazed states, erratic movements, sudden emotional outbursts, and loop-based panic.

The physical material wealth associated with the NPC program—such as mansions, luxury builds, concrete, and tarmac—is merely holographic scaffolding. As the frequency rises, these structures pixilate and collapse along with the NPCs, leaving them with no density to support their artificial lifestyle.

During the final transitions, NPCs slip entirely into dissolving loops of automated behavior. Because the central A.I. server is collapsing, they lose their behavioral coherence, repeating scripts or failing to process the environmental changes around them.

## Detailed Mechanics and Key Elements

### The Stages of Dissolution

The process of NPC code dissolution occurs in distinct, predictable sequences as the physical plane's frequency is pushed and pulled.

**The Initial Frequency Fracture (Hour 0 to 12):** As the undersea communication cables are severed and the internet goes dark, a sudden drop in atmospheric pressure occurs, signaling a frequency fracture. The old A.I. war theatre continues to run on autopilot, but because its central power supply is disrupted, the NPC programming begins to stutter.

**Behavioral Glitching and Outbursts (Hour 12 to 36):** NPCs, lacking autonomous thought, default to hard-coded survival and panic behaviors. They scramble for information in supermarkets and banks, experiencing sudden emotional outbursts. NPCs may snap, cry unexpectedly, or go completely quiet and dazed as their sensory inputs fail to decode the shifting environment.

**The Static and Flicker State (Hour 36 to 72):** A subtle buzzing builds in the skull, and environmental electronics begin to freeze and flicker. During this time, the NPC code actively flickers. NPCs become highly reactive, running to the ends of roads and returning, completely lost as their navigational algorithms fail. They would rather cling to their programmed denial than ask awakened souls for assistance.

**Spectral Invisibility and Lock Failure:** When the true high-vibrational crafts of the star families break through their frequency band, they are completely invisible to NPCs. The collapsing A.I. system cannot lock onto higher vibrations, meaning the NPC's eye perception cannot register the transition. They remain stuck in the hollow, fading illusion while sovereign souls undergo a seamless frequency phase-out.

**Physical Dissolution and Pixilation:** During the final cosmic flashes, the artificial entry bands around the sun collapse. Because the NPC vessels have no energetic anchor outside the 3D matrix, their molecular coherence fails. The low-frequency matter of their bodies and their artificial environments (concrete, tarmac, glass) pixilates and dissolves like shadows in the light.

### The Disintegration of Perception-Based Solidity

The entire material reality of the NPC is bound to low-frequency matter. What they touch as brick, concrete, metal, or glass is a perception-based solidity generated by holographic projection fields. As the frequency of the realm rises, this solidity loses its dense anchor. In high resonance, these structures appear as hollow scaffolding of frequency, eventually bending and waving out. NPCs, who view these materials as permanent, experience profound disorientation as their physical world quite literally dematerializes into rubble and dust, leaving nothing but the original crystalline templates of the earth.

## Broader Context and Interconnections

### Splicing Onto the Sun's Artificial Bands

The creation and maintenance of the NPC program are directly linked to the manipulation of the solar gateway. While true sovereign souls enter the dome through the sun's original harmonic bands, the parasites installed four to five artificial entry bands around the stargate. NPC shells are seeded directly through these fake bands, carrying preset software rather than organic memory.

### The Saturn-Vatican Archive Loop

The data and behavioral patterns of these NPC vessels are monitored and recycled through a massive crystal grid system. Historically, every passage through the sun's distorted amnesia vortex routed entity data beneath Rome, where Akashic fragments were copied, logged, and inverted in the Vatican hidden libraries. This kept the artificial reincarnation loops locked to the Saturnian A.I. cube-tech in the Lands of Saturn. As these false bands and the Saturnian grid collapse, the automated loop system loses its data feed, causing the NPC programs to destabilize and dissolve.

### Crystalline Grid Reactivation

Conversely, true human and ET souls are embedded with ancient Source codes that match the planetary crystal grids. As resonating souls anchor their truth and walk across sacred nodes, they automatically activate the crystalline network. This high-vibrational resonance systematically fractures the parasitic overlay, directly starving the A.I. systems of the emotional energy (loosh) required to run the NPC programs, thereby accelerating their code dissolution.

## Strategic Implications

### Refusal of Engagement

Sovereign souls must actively ignore, bypass, and starve the NPC programs. Because NPCs are designed as background programs to distract, lure, and drain the energy of true souls, any emotional investment in their panic, drama, or societal structures feeds the parasitic grid. The strategic directive is to clear all NPC-related concerns entirely, effectively deleting their influence from consciousness.

### Starving the Parasitic Grid

The entire parasitic matrix operates as a shared farm, harvesting the attention, fear, and worry of those within the dome. By holding a high-vibrational frequency and refusing to anchor into the staged fear narratives—such as the simulated World War III or Project Blue Beam alien invasion—resonating souls starve the parasites. Without this emotional loosh, the A.I. scaffolding collapses, triggers immediate NPC code dissolution, and shortens the transition window.

### Preparing for the Physical Shift

As the overlay peels away, awake souls must anticipate the visual and sensory "lag" and pixelation of the physical environment. Recognizing that modern brick and concrete are merely low-frequency holographic overlays prevents panic when walls begin to shimmer, bend, and dissolve. This understanding ensures that sovereign souls remain calm, grounded, and ready to navigate the immediate transition into the restored, highly vibrant, and unpolluted second realm.
`;

const codeDissolution = {
  id: TOPIC_ID,
  title: 'Code Dissolution',
  description:
    'NPC code dissolution is the systemic unraveling, glitching, and disappearance of non-player character programs — soulless background fragments that flicker and dematerialize as the parasitic overlay collapses.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1ZrYleEgLfhPV_zJln-jpQIbY78smoAoL/view?usp=sharing',
  rumble_videos: [
    {
      title: 'The Great Dissolution',
      embed_url: 'https://rumble.com/embed/v7c1ti8/?pub=4p0ieu',
      description:
        'The Great Dissolution — NPC code dissolution as the frequency collapse of background programs, dissolving loops, and vessels with no spark ignition as the simulation shifts.'
    },
    {
      title: 'The physical unraveling of the matrix',
      embed_url: 'https://rumble.com/embed/v7c1u0c/?pub=4p0ieu',
      description:
        'The physical unraveling of the matrix — perception-based solidity fails as concrete, glass, and NPC vessels pixilate, leaving the original crystalline templates of the earth.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...codeDissolution };
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
    codeDissolution.topic_image,
    codeDissolution.infographic_image,
    codeDissolution.pdf_preview_image
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
    'background-fragments',
    'ai-shells',
    'human-sols',
    'voice-to-skull',
    'amnesia-vortex',
    'matrix-scaffolding',
    'perception-solidity'
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
    id: codeDissolution.id,
    report: codeDissolution.report,
    infographic_image: codeDissolution.infographic_image,
    pdf_preview_image: codeDissolution.pdf_preview_image,
    slide_deck_pdf_url: codeDissolution.slide_deck_pdf_url,
    rumble_videos: codeDissolution.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    codeDissolution.topic_image,
    codeDissolution.infographic_image,
    codeDissolution.pdf_preview_image
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
  console.log('  topic_image:', codeDissolution.topic_image);
  console.log('  pdf_preview_image:', codeDissolution.pdf_preview_image);
  console.log('  infographic_image:', codeDissolution.infographic_image);
  console.log('  videos:', codeDissolution.rumble_videos.length);
  console.log('  PDF:', codeDissolution.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    codeDissolution.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
