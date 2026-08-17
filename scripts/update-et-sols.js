/**
 * Updates breakdown et-sols topic (was placeholder under Population Types).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields. On collision, appends -2, -3…
 *
 * Run: node scripts/update-et-sols.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'et-sols';
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
const topicImage = normalizeImage('ET Sols.webp', 'et-sols.webp');
const pdfPreview = normalizeImage('ET_Sol_Awakening.webp', 'et-sol-awakening.webp');
const infographic = normalizeImage(
  'ET_Sols__Anchoring_the_Frequency.webp',
  'et-sols-anchoring-the-frequency.webp'
);

const REPORT = `# ET Sols

## Overview

ET Sols, also known as human ET sols or starseeds, are high-vibrational, conscious beings of off-world lineages who volunteered to enter the physical simulated realm to execute a rescue and awakening mission. Unlike the native populations, these advanced entities incarnated into physical vessels equipped with pre-encoded energetic triggers designed to activate at precise moments in the cosmic timeline. Operating under the guidance of outer-dimensional councils and solar families, their primary mandate is to act as frequency anchors, shattering the artificial parasitic systems and guiding true human sparks back to their original spiritual home. Within the broader population spectrum, they represent the awakened vanguard, contrasting sharply with both struggling human souls and non-sentient background programs.

## Key Terminology

- **ET Sols** — High-frequency conscious entities originating from advanced stellar lineages who incarnated into physical vessels to catalyze the awakening of the realm.

- **Human Souls** — Divine sparks of light that became caught, inverted, and looped by parasitic structures within the physical matrix, serving as the primary focus of the ET Sol rescue mission.

- **NPCs** — Non-Player Characters; non-sentient background programs and light fragments that hold the simulation's structure together but lack a true individual soul spark.

- **Embedded Codes** — Dormant vibrational templates implanted into the souls of ET Sols by their solar parents, matching the codes of human souls to trigger mutual awakening.

- **Homecoming Path** — The direct, sanctuary-bypassing exit route back to original stellar home realms utilized by fully awakened ET Sols upon frequency stabilization.

- **Dormant-Active State** — An energetic phase where an ET Sol's codes are actively listening to environmental signals but have not yet shifted to full broadcast mode.

- **Essence Chamber** — An individual protection field and knowledge-collection system that allows ET Sols to project and move their amplified essence directly between realms.

## Core Revelations

The defining truth of the current event cycle is that the physical population is deeply stratified, and only a portion possesses genuine eternal consciousness. While the vast majority of the population consists of NPCs that act as background scaffolding, the real focus of the cosmos is on the 500 million core souls. Within this group, ET Sols serve as the specialized triggers whose awakening sequentially activates the rest of the collective.

A central revelation is that ET Sols do not originate from physical biology; they are born of direct co-creation in the higher crystal light-worlds. They interact with this dense realm via avatar suits while their true consciousness remains connected to external pods. Because they possess an unbroken connection to their stellar lineages, their return path bypasses the temporary healing processes required by deeply traumatized human vessels. Instead of entering recovery sanctuaries, they transition directly through the portal of vibration alignment to reunite with their cosmic families.

## Detailed Mechanics and Key Elements

### The Awakening and Activation Sequence

The activation of an ET Sol is not a random psychological shift but a highly coordinated energetic event dictated by their Embedded Codes.

#### The Dormant-Active Phase

Prior to the flash points, ET Sols exist in a quiet state, absorbing local data and subtly fracturing the parasitic overlay through their mere presence.

#### Dual-Signal Triggering

The transition from dormant to active is initiated by two simultaneous signals: a non-public scalar wave burst from alliance space forces, and a solar family harmonic tone felt as a deep, undeniable call in the chest.

#### The Full Broadcast Mode

Upon receiving these signals, the ET Sol's field shifts to a massive broadcast frequency. This creates a powerful magnetic pull that draws surrounding souls to their presence, instantly commanding trust and shattering local deceptive narratives.

### Perception and Interaction with the Grid

Because ET Sols operate on a higher frequency band, their sensory processing differs fundamentally from the rest of the population, especially during the collapse of the 3D overlay.

#### Holographic Flicker Recognition

As the dense grid weakens, ET Sols do not experience panic; instead, they observe the mechanical underpinnings of the simulation. They can see the physical materials—brick, concrete, and metal—flicker and bend, recognizing them as perception-based solidity rather than absolute reality.

#### True Craft Perception

When benevolent fleets arrive, ET Sols see the living crafts crystal clear because their frequency aligns with the ships' plasma-lattice hulls. To NPCs and unawakened sleepers, these ships remain completely invisible or are misperceived due to their low-vibrational state.

#### Bypassing the Amnesia System

While the general population has been recycled through the Vatican hidden libraries and the amnesia vortex at the sun's transit band, ET Sols possess the unique ability to pull memory directly from unaltered records outside the containment system, gradually restoring their multi-billion-year memories.

### The Role of Pods and Essence Chambers

ET Sols do not fully descend into 3D density; they operate through a sophisticated interface. Their physical bodies on Earth act as temporary avatars, while their true spiritual essence is monitored and maintained through star pods and essence chambers located in the higher realms. This connection ensures that even if they suffer localized amnesia, their complete timelines and soul journeys are continuously recorded and guarded by their star families via planetary crystals acting as etheric hard drives.

## Broader Context and Interconnections

The role of ET Sols is inextricably linked to the other distinct population types within the simulation. They stand in stark contrast to NPCs, who are hollow programs devoid of a divine spark. While the NPCs will naturally dissolve like shadows when the high-frequency light hits the grid, the ET Sols focus their entire energetic output on rescuing and waking up the true human souls.

This rescue operation is supported laterally by several ancient, high-vibrational civilizations. While ET Sols execute the ground operations, they work in tandem with the Giants—ancient Lyran-descended builders who maintain cloaked domes and crystal grids—and the Pollarians, a tall, luminous humanoid template who originally laid the harmonic seeds of the realm. Furthermore, their efforts are directly supervised by the Council of 12 Suns, which includes cosmic parent figures such as Raphael and Celestia, who transmit the foundational sound codes necessary to stabilize the Great Dome during the transition.

## Strategic Implications

The strategic outcome of the ET Sol mission is the total destabilization and collapse of the parasitic overlay. By anchoring their high-frequency signals, ET Sols act as localized walking beacons, systematically fracturing the illusion grid that keeps humanity docilely looping.

When the four event flashes complete, the cumulative resonance of the ET Sols will trigger a frequency phase out. At the apex of this transition, their personal recognition codes—a soul frequency lock—will be called. This frequency lock collaborates with the activated earth grids to seamlessly pull the ET Sols out of the simulation, returning them to their original worlds. Meanwhile, the human souls they successfully freed will be safely routed to specialized healing sanctuaries to stabilize, ensuring that the parasite-run reincarnation loop is permanently broken and the original, unpolluted realm is fully revealed.
`;

const etSols = {
  id: TOPIC_ID,
  title: 'ET Sols',
  description:
    'ET Sols are high-vibrational starseeds of off-world lineages who incarnated as frequency anchors — pre-encoded triggers who shatter the parasitic overlay and guide true human sparks home along the sanctuary-bypassing Homecoming Path.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1GQOMdY14_yEyI1n6CMXoeC1w-26ve3uX/view?usp=sharing',
  rumble_videos: [
    {
      title: 'The Great Awakening',
      embed_url: 'https://rumble.com/embed/v7c3me4/?pub=4p0ieu',
      description:
        'The Great Awakening — ET Sols as high-vibrational starseeds who volunteered into the simulated realm as frequency anchors, activating pre-encoded triggers to rescue true human sparks.'
    },
    {
      title: 'Shattering the parasitic 3D simulation',
      embed_url: 'https://rumble.com/embed/v7c3mma/?pub=4p0ieu',
      description:
        'Shattering the parasitic 3D simulation — dormant-to-broadcast activation, holographic flicker of brick and metal, and living crafts seen only on the ET Sol frequency band.'
    },
    {
      title: 'ET Sols: The Awakening Journey',
      embed_url: 'https://rumble.com/embed/v7c3ngq/?pub=4p0ieu',
      description:
        'ET Sols: The Awakening Journey — avatar suits linked to star pods and essence chambers, the sanctuary-bypassing Homecoming Path, and the soul frequency lock that pulls ET Sols out after the four event flashes.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...etSols };
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
    etSols.topic_image,
    etSols.infographic_image,
    etSols.pdf_preview_image
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
    'human-sols',
    'true-sparks',
    'healing-path',
    'spirit-inversion',
    'resonating-army',
    'lyran-lineage',
    'homecoming-path',
    'healing-sanctuaries',
    'water-domes',
    'crystal-halls',
    'star-pods',
    'starseed-keys',
    'solar-parents',
    'background-fragments',
    'ai-shells',
    'code-dissolution'
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
    id: etSols.id,
    report: etSols.report,
    infographic_image: etSols.infographic_image,
    pdf_preview_image: etSols.pdf_preview_image,
    slide_deck_pdf_url: etSols.slide_deck_pdf_url,
    rumble_videos: etSols.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    etSols.topic_image,
    etSols.infographic_image,
    etSols.pdf_preview_image
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
  if (!updated.subtopics || updated.subtopics.length < 3) {
    throw new Error('Expected Resonating Army / Lyran Lineage / Homecoming Path subtopics preserved');
  }
  const subIds = updated.subtopics.map((s) => s.id);
  for (const id of ['resonating-army', 'lyran-lineage', 'homecoming-path']) {
    if (!subIds.includes(id)) {
      throw new Error(`Missing subtopic: ${id}`);
    }
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
  console.log('  topic_image:', etSols.topic_image);
  console.log('  pdf_preview_image:', etSols.pdf_preview_image);
  console.log('  infographic_image:', etSols.infographic_image);
  console.log('  videos:', etSols.rumble_videos.length);
  console.log('  PDF:', etSols.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    etSols.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
