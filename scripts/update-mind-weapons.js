/**
 * Updates breakdown mind-weapons topic (was placeholder under Parasite Mechanics).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields. On collision, appends -2, -3…
 *
 * Run: node scripts/update-mind-weapons.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'mind-weapons';
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
const topicImage = normalizeImage('Mind Weapons.webp', 'mind-weapons.webp');
const pdfPreview = normalizeImage(
  'Illuminated_Mechanics.webp',
  'illuminated-mechanics.webp'
);
const infographic = normalizeImage(
  'The_Mechanics_of_Frequency_Enslavement.webp',
  'the-mechanics-of-frequency-enslavement.webp'
);

const REPORT = `# Mind Weapons

## Overview

Mind weapons are specialized instruments of frequency manipulation and neurological interference deployed by parasitic entities to control human consciousness within the 3D overlay. Unlike conventional physical armaments, these assets utilize highly advanced, non-physical mechanics to target brain-wave patterns, degrade cognitive autonomy, and systematically harvest human emotional energy, or loosh. By enforcing a state of perpetual cognitive distortion, these technologies block access to organic multi-dimensional memory, keeping the population docile and trapped within a pre-programmed reality.

## Key Terminology

- **Scalar Frequency Weapons** — Advanced wave-generation devices targeting human brain-wave states (theta, delta, alpha) to induce sleepiness, confusion, anger, or despair.

- **Voice to Skull** — A localized transmission technology used to project artificial thoughts, instructions, or synthetic voices directly into the subject's mind.

- **Vision to Skull** — A visual activation methodology delivered through standard media screens to trigger pre-programmed behaviors in non-player character shells.

- **Black Cube A.I. Tech** — The overarching digital command framework, often referred to as black satellite tech, that orchestrates thought control and reality overlays.

- **Low-Frequency Grids** — Energy barriers projected around sleeping individuals to restrict consciousness, prevent astral travel, and enforce artificial nightmare loops.

- **Amnesia Vortex** — A distorting frequency filter positioned at the Sun's transit band designed to strip incoming souls of their memories before reincarnation.

## Core Revelations

The parasitic control grid operates with relentless consistency, running 24/7 to project artificial thoughts and manipulate natural behaviors.

Parasitic mechanics are strictly non-creative; they possess no ability to generate the first spark of life or creation and must entirely rely on hijacking organic, pre-existing light and sound grids.

Sleep states are actively militarized; the system deploys veils over individuals during rest to block natural multi-dimensional exploration and keep souls looping in localized trauma.

Media broadcasts contain coded triggers—numbers or specific phrases—that awaken aggressive compliance programs in non-player characters (NPCs) to suppress awakening human or ET souls.

## Detailed Mechanics and Key Elements

### Brain-Wave Hijacking and Glitch Matrices

Parasitic mind weapons work by generating precise scalar frequencies that target the body's natural brain frequencies, specifically theta, delta, and alpha waves. By destabilizing these neural baselines, the weapons cause immediate shifts in emotional states, manifesting as sudden fatigue, disorientation, anger, or deep despair. To maximize dissemination, these disruptive wave patterns are secretly embedded, or "glitched," into everyday commercial audio, including relaxing or healing music. This ensures that even the wellness and recovery modalities within the 3D overlay are co-opted to maintain low-vibrational control.

### Voice and Vision to Skull Transmission

This localized transmission system projects synthetic commands directly into the human skull. For NPCs, this works as a direct behavioral override, allowing the system to direct their thoughts and trigger specific actions. It is highly effective at creating severe mental fractures, extreme anxiety, and self-destructive loops (such as suicide or violence) by mimicking a person's inner monologue. On media networks, specific localized graphics, symbols, or alphanumeric combinations serve as activation codes. When displayed, these prompts immediately coordinate NPC populations, causing them to go on the attack and work against conscious souls.

### Nocturnal Locking and Dream Manipulation

Sleep is the natural state where the human vessel rests and the soul is designed to astral travel to reunite with soul families and higher dimensions. To prevent this liberation, the parasitic system broadcasts shimmer-waves during sleep hours. These emissions establish localized electromagnetic grids or veils around individual sleeping bodies, trapping the consciousness inside the physical vessel. The waves manipulate memory recall and dream structures, forcing souls into endless looping nightmares that keep their frequency locked to a low vibration.

### Metropolitan Circuit Board Architecture

Cities are not merely residential centers; they are designed as massive, dense parasitic circuit boards built directly over organic crystalline nodes. High-density populations act as loosh collectors. Hidden towers and black cube systems scattered throughout metropolitan centers broadcast continuous, low-frequency electromagnetic fields. This keeps the urban population in a constant state of subconscious anxiety, draining their vital energy to power the overlay.

## Broader Context and Interconnections

The deployment of mind weapons is a collaborative operation managed by the Council of Parasitic Races, consisting of Custodians, Anunnaki, Draconians, Greys, and Niburuans. Each group plays a specific role in maintaining the shared farm of human energy. The Custodians serve as the high-frequency priests who oversee the reincarnation and amnesia loops. The Greys act as the core frequency engineers and technicians responsible for installing the black crystalline valve locks.

This system of mind weapon control is structurally anchored to the Vatican Hidden Libraries, where stolen Akashic fragments and copied memory strands are logged and recycled to keep human vessels docile and bound to the loop. This false architecture was constructed by destroying the central Spirit Tree in Hyperborea, which originally distributed pure Source light across the domes.

## Strategic Implications

As the planetary frequency rises, the mechanical nature of these mind-altering weapons is becoming visible. The Resonating Army of ET and human souls is actively fracturing the 3D overlay simply by holding high-frequency states, making it increasingly difficult for the low-frequency Black Cube A.I. to maintain its hold.

In response to the breakdown of the old, toxic heavy-metal chemtrail spraying programs, positive non-human fleets (such as Sirian, Arcturian, and Polarian alliances) have hijacked atmospheric delivery systems since 2015-2016. They now disperse counter-agents, including Monatomic Gold (ORMEs), Colloidal Silver, and Silica Crystals. This advanced atmospheric software patch actively decalcifies the pineal gland, repairs damaged DNA, strengthens the human auric field, and blocks the low-frequency signals of parasitic mind weapons.
`;

const mindWeapons = {
  id: TOPIC_ID,
  title: 'Mind Weapons',
  description:
    'Mind Weapons are specialized instruments of frequency manipulation and neurological interference — scalar weapons, Voice to Skull, Vision to Skull, and Black Cube A.I. tech that hijack brain-wave patterns, harvest loosh, and block organic multi-dimensional memory.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1eOX7W51AXAz2oz64L2QYHYUCuzyrgLmH/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Defeating the Parasitic Frequency Mind Weapons',
      embed_url: 'https://rumble.com/embed/v7c725q/?pub=4p0ieu',
      description:
        'Defeating the Parasitic Frequency Mind Weapons — scalar frequency weapons, Voice to Skull, Vision to Skull, and Black Cube A.I. tech that hijack brain-wave states and harvest loosh to keep the population trapped in the 3D overlay.'
    },
    {
      title: 'The Artificial Dream',
      embed_url: 'https://rumble.com/embed/v7c72cc/?pub=4p0ieu',
      description:
        'The Artificial Dream — nocturnal locking, shimmer-waves, and low-frequency grids that trap consciousness during sleep, block astral travel, and force looping nightmares that keep frequency locked low.'
    },
    {
      title: 'The Diagnostic Revelation',
      embed_url: 'https://rumble.com/embed/v7c72gc/?pub=4p0ieu',
      description:
        'The Diagnostic Revelation — metropolitan circuit boards, coded media triggers, the Amnesia Vortex, and the counter-agents now fracturing Black Cube A.I. as the Resonating Army holds high-frequency states.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...mindWeapons };
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
    mindWeapons.topic_image,
    mindWeapons.infographic_image,
    mindWeapons.pdf_preview_image
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
    'parasite-mechanics',
    'voice-to-skull',
    'scalar-frequencies',
    'amnesia-vortex',
    'control-tech',
    'vatican-archive',
    'saturn-cube',
    'lunar-inversion',
    'historic-resets',
    'titanic-op',
    '1666-node-war',
    'tartarian-erasure'
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
    id: mindWeapons.id,
    report: mindWeapons.report,
    infographic_image: mindWeapons.infographic_image,
    pdf_preview_image: mindWeapons.pdf_preview_image,
    slide_deck_pdf_url: mindWeapons.slide_deck_pdf_url,
    rumble_videos: mindWeapons.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    mindWeapons.topic_image,
    mindWeapons.infographic_image,
    mindWeapons.pdf_preview_image
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

  if (!updated.subtopics || updated.subtopics.length < 3) {
    throw new Error('Expected Voice to Skull / Scalar Frequencies / Amnesia Vortex subtopics preserved');
  }
  const subIds = updated.subtopics.map((s) => s.id);
  for (const id of ['voice-to-skull', 'scalar-frequencies', 'amnesia-vortex']) {
    if (!subIds.includes(id)) {
      throw new Error(`Missing subtopic: ${id}`);
    }
  }

  JSON.parse(JSON.stringify(heavyParsed));

  console.log('Updated', TOPIC_ID);
  console.log('  topic_image:', mindWeapons.topic_image);
  console.log('  pdf_preview_image:', mindWeapons.pdf_preview_image);
  console.log('  infographic_image:', mindWeapons.infographic_image);
  console.log('  videos:', mindWeapons.rumble_videos.length);
  console.log('  PDF:', mindWeapons.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    mindWeapons.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
