/**
 * Updates breakdown healing-path topic (was placeholder under Human Sols).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields. On collision, appends -2, -3…
 *
 * Run: node scripts/update-healing-path.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'healing-path';
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
const topicImage = normalizeImage('Healing Path.webp', 'healing-path.webp');
const pdfPreview = normalizeImage(
  'Shimmering_Sanctuary.webp',
  'shimmering-sanctuary.webp'
);
const infographic = normalizeImage(
  'Sovereign_Soul_Restoration_Overview.webp',
  'sovereign-soul-restoration-overview.webp'
);

const REPORT = `# Healing Path

## Overview

The healing path is a structured, multi-dimensional restorative sequence designed specifically for human sols—the true human sparks who were caught, inverted, and fragmented by parasitic networks. While the already awakened members of the Resonating Army bypass these restorative states to travel the homecoming path directly to their realms of origin, human sols require specialized care to reverse lifetimes of trauma, mind control, and energetic damage. This path is realized through a series of healing sanctuaries situated within dedicated healing realms. These spaces are not physical hospitals but pure frequency environments constructed from light, sound, and living crystal. Here, human sols undergo deep emotional, mental, and spiritual calibration under the supervision of benevolent entities, allowing their vibrations to stabilize so they may ultimately choose their next evolutionary cycle.

## Key Terminology

- **Healing Path** — The restorative, frequency-based evolutionary journey designed to repair, realign, and reunite fragmented human sols after the collapse of the parasitic overlay.

- **Human Sols** — The true human sparks or souls originally created to connect with the natural world, who were subsequently captured, inverted, and subjected to amnesia loops by parasitic forces.

- **Healing Sanctuaries** — Shimmering, cloaked domes of light, sound, and living crystal projected over mountains, valleys, oceans, and etheric planes where souls undergo vibrational rehabilitation.

- **Water Domes** — Shimmering, emotional-healing sanctuaries projected over crystalline waters where liquid sound frequencies draw out emotional density and mend the heart.

- **Crystal Halls** — Mental energetic sanctuaries housed within real crystal temples (overlaid in 3D perception as cathedrals and churches) where harmonic crystal slabs and prisms dissolve mental distortions and mend the mind.

- **Star Pods** — Floating, etheric cocoons suspended in nebulae-like spaces designed for timeline and soul healing, mending deep soul fractures and karmic wounds across past lives.

- **Ground Healers** — Gentle, radiant, non-physical holographic light beings sent from the Council of 12 Suns to guide and stabilize confused souls within the healing sanctuaries.

- **Saferons** — The specific name of the tall, benevolent ground healers who project luminous outlines and mirror the soul families of recovering human sols to foster absolute safety and trust.

## Core Revelations

The fundamental revelation of the healing path is that no true human sol is ever abandoned, regardless of their level of denial or prior resistance to the truth. When the parasitic overlay fractures and collapses through the high-frequency vibrations of awakened beings, human sols who are not yet fully resonating are gently transitioned into these sanctuaries rather than being left to dissolve like NPC background programs.

Furthermore, the healing path reveals that physical reality is an illusion of solidity designed to trap perception. What humans perceive as concrete stone or physical illness is merely low-frequency matter. True healing involves bypassing physical medicine and working directly on the light body grid and the harmonic coding of the soul. This process restores the soul's natural ability to astral travel during sleep states and manifest its own reality through pure consciousness, unlocking the ancient memory streams that were systematically intercepted and archived under the Vatican's amnesia loop systems.

## Detailed Mechanics and Key Elements

The healing path operates through three distinct mechanical stages of sanctuary restoration, each targeting a specific layer of trauma:

### Emotional Restoration in Water Domes

The first stage of rehabilitation occurs within vast, invisible Water Domes projected over crystalline, glowing blue-aqua-silver waters. These domes utilize the superconductive nature of pure, unsuppressed water to mend the heart. Unlike heavily distorted 3D oceans, which parasites use as conductors for destructive scalar frequency weapons, the waters of these sanctuaries vibrate as liquid sound. As a recovering soul floats in these pools, the liquid sound extracts dense emotional density such as grief, fear, heartbreak, and guilt. This density is replaced with a harmonic resonance encoded with the memory codes of Source. This process stimulates profound internal visions and auditory recollections, allowing souls to emerge lighter, smiling, and singing.

### Mental Realignment in Crystal Halls

The second stage mends the mind within Crystal Halls, which are multi-layered crystalline temples currently masked by 3D perception as cathedrals, churches, and abbeys. In these sanctuaries, human sols in their crystalline body selves hover above or rest upon crystal slabs that hum with continuous harmonic frequencies. Light is focused through crystal prisms into the soul's energy field, actively dissolving mental overlays, mind control damage, and parasitic programming. The living crystal walls, glowing with rainbow fractals, and breathing columns of light systematically realign the light body grid. This mechanical realignment clears the persistent "parasitic whispers" of the old 3D programming, replacing confusion with absolute mental clarity and returning pure memory streams.

### Soul and Timeline Integration in Star Pods

The final and most complex stage of healing is conducted within Star Pods, floating cocoons of circulating light suspended in etheric space resembling a nebulae. These pods are specifically engineered for souls carrying deep soul fractures, timeline trauma, or severe karmic wounds accumulated across multiple cyclical loops of the 3D matrix. Under the guidance of solar parents and members of the Resonating Army, the pod envelopes the soul in a protective womb of light. Streams of high-frequency light physically reweave the fragmented, shattered aspects of the soul across all timelines. This reweaving repairs the subconscious trauma that was repeatedly locked into the soul level by parasitic reincarnation tech.

### The Role of Ground Healers and Giants

The healing sanctuaries are anchored and supervised by the giants and the Saferons. The giants, who are of ancient Lyran lineage and possess massive biological electromagnetic fields, utilize their knowledge of natural crystalline amplifiers to keep the cloaking fields of these domes stable. Meanwhile, the Saferons, acting as gentle ground healers, project luminous outlines that shift to reflect the soul's own star family. They never use force or commands. Instead, they apply precise vibrational and frequency powers to instill an immediate, overwhelming sense of absolute safety and homecoming, removing all residual panic from the transition.

## Broader Context and Interconnections

The healing path is intrinsically linked to the broader crystalline architecture of the Great Dome and the Cube containment. The seven outer domes—including the Dome of Sheol (originally a recovery sanctuary for recalibrating resonance, later inverted into a prison of shadows) and the Dome of Forgotten Gods (the origin chamber and memory storage unit vault)—are all connected to these healing sanctuaries.

Under the old parasitic construct, the natural flow of these domes was hijacked. The Spirit Tree, which stood as the central axis of consciousness in Hyperborea and fed the seven domes with pure light, was ripped out by the Greys under the orders of the Custodians. This allowed the parasites to insert a frequency-siphoning valve connected to the Saturn grid, looping human sols through an artificial amnesia vortex at the sun's transit band and copying their Akashic fragments under the Vatican to enforce continuous reincarnation loops.

As the Resonating Army fractures this parasitic overlay through their high-frequency signals, the roots of the Spirit Tree are lighting up again. This re-energizes the sub-crystalline band and activates the surface nodes, turning the entire restored realm of the Known Lands into one massive, unified healing environment—essentially a single, planet-wide med bed.

## Strategic Implications

The operational restoration of the healing path carries significant strategic implications for the culmination of the Great Awakening:

### Neutralization of Loosh Harvesting

By systematically mending the heart, mind, and soul of human sols, the healing path permanently starves the parasitic systems of the negative emotional energy, or loosh, required to maintain their artificial overlays.

### Dismantling of the Reincarnation Loop

The reweaving of soul fragments and the decalcification of the pineal gland—stimulated by restored atmospheric elements like monotomic gold—completely breaks the Vatican's artificial tracking and recycling systems, allowing sols to bypass custom filters entirely.

### Collaborative Soul Reunion

Members of the Resonating Army, once they have completed their homecoming path, have the strategic option to return to these sanctuaries to assist, supervise, and accelerate the healing of the souls they originally came to rescue, cementing a collective homecoming.

### Sovereign Choice of Creation

Upon the stabilization of their vibrations within the transition halls, human sols are restored to their status as infinite creators. They are granted the ultimate sovereign choice to either ascend to higher multi-dimensional realms or return to step into a fresh, unpolluted, and fully crystalline incarnation cycle within the restored Known Lands, free from any parasitic intervention.
`;

const healingPath = {
  id: TOPIC_ID,
  title: 'Healing Path',
  description:
    'The Healing Path is a structured, multi-dimensional restorative sequence for human sols — Water Domes, Crystal Halls, and Star Pods under Saferon ground healers — that mends heart, mind, and soul after the parasitic overlay collapses.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1qbdTjv9JjZ1gwtt1kamrZkqCulwhFdWM/view?usp=sharing',
  rumble_videos: [
    {
      title: 'The mechanics of the planetary soul rescue',
      embed_url: 'https://rumble.com/embed/v7c25h0/?pub=4p0ieu',
      description:
        'The mechanics of the planetary soul rescue — the Healing Path as a three-stage sanctuary sequence for fragmented human sols, bypassed by the Resonating Army, and supervised by Saferons after the parasitic overlay collapses.'
    },
    {
      title: 'The Healing Path',
      embed_url: 'https://rumble.com/embed/v7c24fk/?pub=4p0ieu',
      description:
        'The Healing Path — Water Domes, Crystal Halls, and Star Pods as frequency environments of light, sound, and living crystal that mend heart, mind, and soul without physical medicine.'
    },
    {
      title: 'The Healing Path',
      embed_url: 'https://rumble.com/embed/v7c25k2/?pub=4p0ieu',
      description:
        'The Healing Path — Ground Healers and giants anchoring cloaked sanctuaries, Spirit Tree restoration, and the sovereign choice to ascend or return to a crystalline incarnation in the Known Lands.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...healingPath };
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
    healingPath.topic_image,
    healingPath.infographic_image,
    healingPath.pdf_preview_image
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
    'true-sparks',
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
    id: healingPath.id,
    report: healingPath.report,
    infographic_image: healingPath.infographic_image,
    pdf_preview_image: healingPath.pdf_preview_image,
    slide_deck_pdf_url: healingPath.slide_deck_pdf_url,
    rumble_videos: healingPath.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    healingPath.topic_image,
    healingPath.infographic_image,
    healingPath.pdf_preview_image
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
  console.log('  topic_image:', healingPath.topic_image);
  console.log('  pdf_preview_image:', healingPath.pdf_preview_image);
  console.log('  infographic_image:', healingPath.infographic_image);
  console.log('  videos:', healingPath.rumble_videos.length);
  console.log('  PDF:', healingPath.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    healingPath.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
