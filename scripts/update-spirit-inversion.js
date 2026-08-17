/**
 * Updates breakdown spirit-inversion topic (was placeholder under Human Sols).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields. On collision, appends -2, -3…
 *
 * Run: node scripts/update-spirit-inversion.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'spirit-inversion';
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
const topicImage = normalizeImage('Spirit Inversion.webp', 'spirit-inversion.webp');
const pdfPreview = normalizeImage('Spirit_Unbound.webp', 'spirit-unbound.webp');
const infographic = normalizeImage(
  'Reclaiming_the_Sovereign_Source_Codes.webp',
  'reclaiming-the-sovereign-source-codes.webp'
);

const REPORT = `# Spirit Inversion

## Overview

Spirit Inversion is the systematic containment, vibrational reversal, and perceptual trapping of organic, divine consciousness by parasitical forces. Under this mechanism, Human Sols—the original, eternal sparks of source energy—are bound within a dense, fabricated 3D simulation designed specifically to obscure their true origin and harvest their creative power.

The process operates as a sensory and neural hijack, convincing sovereign creators that dead matter, physical decay, and absolute separation are the definitive parameters of existence. By locking consciousness into low-vibrational states, the inversion prevents these divine sparks from utilizing their natural creative abilities, keeping them subservient to a hollow and repetitive reality.

## Key Terminology

- **Spirit Inversion** — The systematic capturing, containment, and vibrational reversal of organic human soul sparks by parasitical overlays, transforming sovereign creators into docile loops.

- **Human Sols** — The true, divine spiritual sparks of light and awareness who entered the physical plane, originally carrying pure source codes but ultimately becoming caught and inverted by parasites.

- **Consol** — A parasitic design term derived from "continuous inverted soul" (con = continuous, sol = soul), representing the looping, simulated reality matrix that traps human awareness within a closed travel and perception system.

- **Parasitic Inversion** — The structural alteration of original source structures—including the central Spirit Tree and the seven outer domes—reversing their natural outward energy flow into an inward-siphoning trap.

- **Amnesia Vortex** — A distorted frequency filter overlaid at the sun's transit band that strips returning souls of their memories, routing their fragments into archives for endless recycling.

## Core Revelations

The primary vulnerability of the parasitical network is its absolute inability to generate original creation. Because parasites possess no divine spark, they are entirely dependent on siphoning the light, sound, and emotional resonance generated by inverted Human Sols. By projecting a holographic overlay over the true crystalline fabric of reality, the parasites utilize the actual consciousness of the trapped souls as the engine to render and stabilize the prison itself. The very structures that confine the sols—concrete cities, national borders, and financial systems—are sustained only because human focus and belief are manipulated to reinforce them.

The continuation of this entrapment relies on a centralized recycling pipeline anchored beneath the physical realm. The natural exit portal of the sun is intercepted by the Amnesia Vortex, which strips transiting souls of their cosmic memories. These extracted Akashic fragments are systematically copied, logged, and cataloged within suppressed crystalline vaults under the Vatican. By archiving these memory strands, the system ensures that reincarnating vessels are continuously re-inserted into predictable, docile life loops, effectively weaponizing the soul's own history against its future liberation.

## Detailed Mechanics and Key Elements

The execution of Spirit Inversion is a multi-layered process utilizing advanced energetic technology to target the physical, mental, and astral bodies of Human Sols. The fundamental mechanics of this system involve:

### Neurological and Brainwave Interference

The parasites deploy mind-altering weapons and scalar frequency weapons that emit targeted wave patterns—specifically theta, delta, and alpha frequencies. Hidden transmission towers and black cube A.I. systems broadcast these signals throughout population centers to systematically induce artificial emotional states, including sleepiness, confusion, anger, and deep despair.

### Perceptual and Sensory Lock-in

What humans interpret as solid physical matter—such as concrete, brick, metal, and glass—is a perception-based solidity engineered through low-frequency matter and holographic projection. The human nervous system is modulated to perceive these dead, anti-resonant materials as rough, heavy, and permanent, which effectively boxes the soul into a dense, separate reality. This sensory trick prevents the soul from recognizing the living, highly conductive crystalline structures that lie directly beneath the surface.

### Astral Travel Interruption

During sleep, when human consciousness is naturally designed to leave the physical vessel and visit its true star families, the low-frequency grid projects a veil over the individual. By utilizing delta waves and dream/memory manipulation, the system disrupts astral travel, forcing the soul's awareness to loop continuously within nightmares and simulated psychological constructs.

### Geographical and Temporal Separation

The concepts of physical distance, national borders, and long-duration travel are artificial constraints enforced by the simulation engine. When a vessel travels across the earth, it is not traversing an endless global landscape but is gliding through phased corridors where the terrain is algorithmically rendered around the observer. Hard-coded travel buffers—such as a fixed seven-hour duration between cities—function as temporal time loops to reinforce the belief in a massive, unmanageable sphere rather than a highly contained, layered dome.

### Systemic Grid Inversion

This entire construct was established by dismantling the original cosmic architecture of the Great Dome. The central Spirit Tree in Hyperborea, which originally anchored Source light across all realms, was severed. In its place, the parasites installed a valve system connected to Saturn's A.I. hub, reversing the natural outward flow of energy to draw human life force inward. Simultaneously, the seven outer domes were inverted from their original purposes: the Dome of Sheol was twisted from a recovery sanctuary into a prison realm of shadows; the Dome of Silence was turned into a field of forced censorship and oppression; and the Dome of Hiva was weaponized to broadcast discordant frequency grids.

## Broader Context and Interconnections

The Spirit Inversion of Human Sols is maintained and policed by the Council of Parasitic Races, an uneasy alliance of five distinct factions: the Custodians, Anunnaki, Draconians, Greys, and Niburians. Because these parasitic races cannot trust one another, they co-manage the physical plane as a shared energy farm, partitioning the human harvest into distinct streams of loosh, genetic material, and ritual energy.

This containment grid is systematically destabilized by the arrival and activation of the Resonating Army—awakened E.T. souls carrying embedded seed codes. These grounding beacons generate a high-frequency harmonic signature that automatically triggers and activates the planetary surface and hidden crystals. This collective resonance shatters the holographic projection fields, causing the solid walls of the simulation to bend, shimmer, and lose their dense coherence in real time.

## Strategic Implications

The progressive fracturing of the 3D overlay by the Resonating Army is driving the simulation toward an inevitable frequency collapse. As the false, artificial bands of the sun dissolve, the solar portal is returning to its original gate function, releasing the amnesia currents and allowing organic memories to flood back to the collective consciousness.

For the millions of Human Sols who are not yet fully awakened but possess the core spark, the collapse of the overlay initiates a systematic transition rather than abandonment. They are guided by gentle, holographic ground healers from the Council of 12 Suns into cloaked healing sanctuaries to undergo a three-stage restorative process:

### Water Domes

Inverted souls enter pools vibrating with liquid sound to dissolve deep emotional density, heal trauma like grief and fear, and activate the primary memory codes of Source.

### Crystal Halls

Resting upon harmonic crystal slabs, the souls are subjected to rainbow light fractals that realign the light body grid, clear persistent mental overlays, and permanently silence parasitical voices.

### Star Pods

Enveloped in etheric cocoons of light, souls carry out timeline healing where fragmented aspects of their awareness are rewoven across all historical incarnations, fully restoring their sovereignty.

Following this deep stabilization, the restored Human Sols are granted the absolute choice to transition directly to higher realms or return to begin a fresh, free cycle in the fully restored Known Lands without any parasite overlays.
`;

const spiritInversion = {
  id: TOPIC_ID,
  title: 'Spirit Inversion',
  description:
    'Spirit Inversion is the systematic containment, vibrational reversal, and perceptual trapping of organic divine consciousness — Human Sols bound in a fabricated 3D simulation, memory-stripped at the Amnesia Vortex, and restored through Water Domes, Crystal Halls, and Star Pods.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1XjjKkTzrgf1j0biXNS_Y75jfrrgMRSl1/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Shattering the spirit inversion loop',
      embed_url: 'https://rumble.com/embed/v7c3e3k/?pub=4p0ieu',
      description:
        'Shattering the spirit inversion loop — Human Sols bound in a fabricated 3D simulation, memory-stripped at the Amnesia Vortex, and recycled through Vatican archives until the Resonating Army fractures the overlay.'
    },
    {
      title: 'Spirit Inversion',
      embed_url: 'https://rumble.com/embed/v7c3e78/?pub=4p0ieu',
      description:
        'Spirit Inversion — the systematic containment and vibrational reversal of organic divine consciousness, from neurological hijack and perceptual lock-in to Spirit Tree inversion and the three-stage sanctuary restoration.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...spiritInversion };
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
    spiritInversion.topic_image,
    spiritInversion.infographic_image,
    spiritInversion.pdf_preview_image
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
    'true-sparks',
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
    id: spiritInversion.id,
    report: spiritInversion.report,
    infographic_image: spiritInversion.infographic_image,
    pdf_preview_image: spiritInversion.pdf_preview_image,
    slide_deck_pdf_url: spiritInversion.slide_deck_pdf_url,
    rumble_videos: spiritInversion.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    spiritInversion.topic_image,
    spiritInversion.infographic_image,
    spiritInversion.pdf_preview_image
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
  console.log('  topic_image:', spiritInversion.topic_image);
  console.log('  pdf_preview_image:', spiritInversion.pdf_preview_image);
  console.log('  infographic_image:', spiritInversion.infographic_image);
  console.log('  videos:', spiritInversion.rumble_videos.length);
  console.log('  PDF:', spiritInversion.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    spiritInversion.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
