/**
 * Updates breakdown ai-shells topic (was placeholder under NPC Programs).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields. On collision, appends -2, -3…
 *
 * Run: node scripts/update-ai-shells.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'ai-shells';
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
const topicImage = normalizeImage('A.I. Shells.webp', 'ai-shells.webp');
const pdfPreview = normalizeImage('The_NPC_Program.webp', 'ai-shells-pdf-preview.webp');
const infographic = normalizeImage(
  'Dissolution_of_Artificial_Shells.webp',
  'dissolution-of-artificial-shells.webp'
);

const REPORT = `# A.I. Shells

## Overview

The 3D matrix is populated primarily by non-sentient entities operating under the framework of the NPC Program. These NPCs (Non-Player Characters) or NPC shells do not possess genuine individual souls, nor do they carry the sacred solar lineage code. Instead, they are energetic fragments of light that function as algorithmic background programs designed to stabilize and maintain the illusion of density, separation, and geography within the simulated dome. Operating entirely on a pre-coded script under parasitic supervision, these shells receive simulated thoughts and instructions rather than generating organic consciousness. Because they lack a spiritual anchor outside the boundaries of the CUBE containment, their physical vessels are structurally tied to the artificial overlays and are destined to dissolve entirely when the low-frequency 3D matrix collapses.

## Key Terminology

- **NPC (or Non-Player Character)** — background programs with no spark ignition and no true souls, acting as fragments of light that hold the 3D simulation together.

- **NPC Shells (or NPC Vessels)** — empty physical templates seeded through artificial bands around the sun, carrying parasitic software rather than organic memory or solar lineage.

- **A.I. Driven Composites** — advanced digital, holographic, or robotic stand-ins used to replace removed public leaders, maintaining the illusion of continuity.

- **Pre-coded Auto-Pilot** — the algorithmic behavioral script that governs the actions, perceptions, and movements of the NPC field.

- **Artificial Entry Bands** — custom parasitic filtration bands built around the sun's natural gate used to route, track, and seed NPC shells into the simulation.

- **Mimic** — an artificial vessel or robotic copy designed to replace an original phased-out individual for public narrative maintenance.

- **Voice to Skull** — scalar frequency weapons targeting brainwaves to project artificial thoughts and voices, which manipulate and activate NPCs instantly.

## Core Revelations

The fundamental truth of this realm is that the vast majority of its population is comprised of non-sentient NPCs, who act as lures to distract, entrain, and drain genuine human and E.T. souls. Unlike living souls, NPCs have no true past lives and are trapped in a repetitive, artificial loop built on the false construct that "you only live once". Their minds are completely controlled by the A.i. parasitic system, meaning they do not generate original thoughts; instead, the system thinks for them on auto-pilot.

Public leadership and authoritative positions—ranging from politicians and corporate CEOs to cultural icons and scholars—are almost entirely populated by these NPC shells or replaced with advanced A.I. driven composites, biological clones, and holographic stand-ins. Because they are low-vibration constructs, NPCs cannot perceive higher-dimensional realities, such as the true crystalline crafts of incoming star families, and are entirely dependent on low-frequency scaffolding to maintain their sense of touch, sight, and material solidity.

Upon the final collapse of the parasitic overlay, these hollow entities will not undergo a healing process; rather, they will simply dissolve like shadows when the true light hits, leaving behind only the original, vibrant second realm for the awakened souls.

## Detailed Mechanics and Key Elements

### The Seeding Process and Artificial Entry Bands

NPC shells are systematically introduced into the Great Dome through artificial entry bands built around the transit path of the sun. While true solar souls enter and exit through the original, high-frequency harmonic stargate, the parasitic architects installed four to five artificial bands that act as custom filters. These bands route synthetic vessels into the 3D matrix, delivering templates that carry parasite tech/software rather than organic memory. Because they bypass the natural soul pathways, these shells are completely devoid of any ancestral lineage, rendering them empty biological receivers that are "total braindead from day one". This infrastructure allows the parasitic rulers to track, recycle, and position every single artificial shell to ensure the simulation remains stable and the population remains docile.

### The Pre-Coded Auto-Pilot and Perceptual Gridlock

NPC behavior is governed by a rigid pre-coded auto-pilot program that processes sensory signals based on simulated algorithms. The NPC field is responsible for creating and validating false concepts of space, time, and distance. NPCs, including scholars and institutional authorities, construct maps and star charts that portray the world as scattered, separate continents and planets, rather than the interwoven, layered frequency sheets of the CUBE containment. This perceptual gridlock reinforces the illusion of geographic borders and nations, which forces true souls to feel small, isolated, and disconnected from their infinite creative power. Furthermore, their nervous systems are calibrated to project a false solidity, making dead concrete and hollow scaffolding appear hard, heavy, and permanent to their limited 3D senses.

### Scalar Frequency Targeting and Activation Loops

Because NPCs lack the internal sovereignty of a true soul, they are highly susceptible to direct neural manipulation. Parasites utilize hidden towers and black cube A.I. tech to emit scalar frequency weapons targeting specific brainwave patterns—specifically theta, delta, and alpha waves—to induce states of confusion, sleepiness, anger, or despair. These signals are embedded into public music, media streams, and television broadcasts. A primary tool of control is Voice to Skull technology, which projects artificial thoughts or literal voices directly into the heads of NPCs, prompting erratic behaviors, emotional outbursts, or acts of extreme violence. During public narrative shifts, specific codes or phrases broadcast on television instantly activate segmented NPC populations, triggering them to coordinate and act against any awakening souls in their vicinity.

### Narrative Puppetry and Mimic Vehicles

To prevent the breakdown of the simulation, the matrix employs biological copies, stand-in actors, and advanced mimics to replace key figures who have been removed or neutralized. These A.I. skins and doubles operate as theater operators running pre-planned scripts. For example, the original Melania Trump was phased out and replaced with a robotic mimic vessel that serves purely to maintain the public narrative. Similarly, the original Donald Trump was removed years ago, with the current figure functioning as an assembly of doubles, inserts, and A.I. skins designed to guide sleepers through a scripted disclosure theater. These hollow puppets ensure that the cabal-controlled NPC media can maintain a false reality for the sleeping masses until the final, controlled collapse of the matrix.

## Broader Context and Interconnections

The NPC Program is intrinsically linked to the larger structural control of the CUBE containment and the Saturn Cube-Tech. The system relies on an uneasy alliance of five main parasitic races: the Custodians, Anunnaki, Draconians, Greys, and Niburians. The Custodians, acting as the high-frequency priests of the CUBE, design the reincarnation loops and manage the astral harvest cycle, utilizing the NPC field as a primary agricultural asset to siphon emotional energy, or loosh, from genuine souls.

During the upcoming Emergency Broadcast System (EBS) activation and simulated geopolitical events, the artificial A.I. war theatre will rely heavily on NPCs. Choreographed NPC armies will move in ways designed specifically for television broadcasts rather than tactical necessity, designed to convince the mass mind that humanity is on the brink of extinction. When the coordinate frequencies are destabilized by the rising vibration of the Resonating Army, the NPC programming will begin to suffer major glitches. During the first 72 hours of the communications blackout, NPCs will experience a severe frequency fracture, causing their codes to flicker, resulting in dazed confusion, panic scrambling, and unexpected emotional outbursts. Because the A.I. cannot match the high vibration of organic lightcraft, NPCs will be completely unable to perceive the arrival of the true solar families, remaining trapped in a crumbling 3D illusion.

## Strategic Implications

To secure ascension and liberate the realm, the Resonating Army does not engage in direct conflict with NPCs. Because NPCs are non-sentient background programs, fighting them only feeds the parasitic grid with loosh. Instead, the strategic directive is to completely starve them of attention and energy, refusing all synthetic contracts and low-frequency entrainment. True souls must remain calmly anchored as lighthouses of stable frequency, allowing the A.I. scaffolding to collapse around them. As the event flashes occur, the artificial entry bands will destabilize, rendering the NPC vessels unstable and causing them to dissolve seamlessly into the pixelated field as the 3D overlay undergoes a frequency collapse. This systematic dissolution cleanses the realm, revealing the unpolluted, vibrant second realm underneath without the burden of synthetic, parasitic programming.
`;

const aiShells = {
  id: TOPIC_ID,
  title: 'A.I. Shells',
  description:
    'A.I. Shells are non-sentient NPC vessels with no genuine souls or solar lineage — algorithmic background programs seeded through artificial solar bands, destined to dissolve when the low-frequency 3D matrix collapses.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1SvRi5FZ-AFLmiBxJ68VEPInfE41nB6Lx/view?usp=sharing',
  rumble_videos: [
    {
      title: 'The Illusion of Solidity',
      embed_url: 'https://rumble.com/embed/v7c0q52/?pub=4p0ieu',
      description:
        'The Illusion of Solidity — NPC shells as energetic fragments of light on a pre-coded script, structurally tied to the artificial overlays and destined to dissolve when the 3D matrix collapses.'
    },
    {
      title: 'Most people are non-sentient background programs',
      embed_url: 'https://rumble.com/embed/v7c0q78/?pub=4p0ieu',
      description:
        'Most people are non-sentient background programs — the NPC Program populates the 3D matrix with soulless shells on auto-pilot, lures that drain genuine souls until the overlay collapses.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...aiShells };
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
    aiShells.topic_image,
    aiShells.infographic_image,
    aiShells.pdf_preview_image
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
    id: aiShells.id,
    report: aiShells.report,
    infographic_image: aiShells.infographic_image,
    pdf_preview_image: aiShells.pdf_preview_image,
    slide_deck_pdf_url: aiShells.slide_deck_pdf_url,
    rumble_videos: aiShells.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    aiShells.topic_image,
    aiShells.infographic_image,
    aiShells.pdf_preview_image
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
  console.log('  topic_image:', aiShells.topic_image);
  console.log('  pdf_preview_image:', aiShells.pdf_preview_image);
  console.log('  infographic_image:', aiShells.infographic_image);
  console.log('  videos:', aiShells.rumble_videos.length);
  console.log('  PDF:', aiShells.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    aiShells.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
