/**
 * Updates breakdown resonating-army topic (was placeholder under ET Sols).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields. On collision, appends -2, -3…
 *
 * Run: node scripts/update-resonating-army.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'resonating-army';
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
const topicImage = normalizeImage('Resonating Army.webp', 'resonating-army.webp');
const pdfPreview = normalizeImage(
  'Crystalline_Illumination.webp',
  'crystalline-illumination.webp'
);
const infographic = normalizeImage(
  'Frequency_Keys_to_Original_Realm.webp',
  'frequency-keys-to-original-realm.webp'
);

const REPORT = `# Resonating Army

## Overview

The Resonating Army refers to a group of highly conscious, pre-awakened ET souls (also known as ET Sols) who voluntarily entered the physical density of Earth's 3D matrix to catalyze the awakening of humanity and dismantle surrounding parasitic overlays. These beings, often described as returners or starseeds, descend from advanced off-world lineages, such as the Lyran lineage, and carry dormant embedded codes within their spiritual anatomy. Rather than participating in standard reincarnation loops, these souls incarnate with the specific mission of acting as lighthouses during catastrophic events. By anchoring high-frequency vibrations in their physical vessels, they systematically destabilize the artificial projections that keep humanity in a state of amnesia.

## Key Terminology

- **Resonating Army** — The collective group of pre-awakened ET souls and highly conscious returners incarnated on Earth to anchor higher frequencies and fracture the parasitic overlays.

- **ET Sols** — Extraterrestrial souls originating from higher-dimensional realms, such as Sirius, Andromeda, and the Pleiades, who enter physical vessels to assist in planetary liberation and human awakening.

- **Embedded Codes** — Divine frequency signatures placed within the souls of the Resonating Army by their solar parents to trigger memory recall and grid activation at precise moments.

- **Parasitic Overlays** — Artificial, low-frequency holographic projection grids superimposed over the natural crystalline Earth to manipulate human perception and harvest emotional energy.

- **Sol Frequency Lock** — An individual recognition code and magnetic resonance alignment that connects the Resonating Army directly with their cosmic families for extraction.

- **NPCs** — Non-player characters or background programs lacking a true spark of divine light, serving primarily to hold the physical simulation together.

## Core Revelations

The Resonating Army operates not through physical combat, but through frequency disruption. The primary realization is that Earth's density and its geopolitical boundaries are not fixed realities but perception overlays managed by a holographic dome. Because of this, the collective consciousness of the Resonating Army possesses the unique ability to shorten and collapse artificial timelines, such as the staged fake alien invasion or World War III scenarios engineered by the cabal's A.I. systems.

Furthermore, these souls are revealed to be the original architects of the physical realm, having historically sung the crystalline grids and 178 physical worlds into existence before descending into matter. The presence of these ET Sols is vital because their high-vibrational resonance directly interacts with hidden planetary crystals, monoliths, and harmonic lenses, activating the Source network that the parasites attempted to bury. As these physical structures are re-energized by the Resonating Army's presence, the illusion of concrete solidity and separation begins to flicker and dissolve, revealing the Second Realm underneath.

## Detailed Mechanics and Key Elements

### The Mechanics of Frequency Activation and the Call

The spiritual awakening of the Resonating Army is a mathematically precise frequency phase-in triggered by cosmic alignment. These souls carry dormant activation codes that are synchronized to respond to two simultaneous signals: a non-public scalar wave burst emitted by allied whitehat space forces, and a deep, melodic harmonic tone felt directly within the chest as a call from their solar families. Upon receiving this dual signal, the frequency field of each member jumps to full broadcast mode, transforming them from passive listeners into active beacons of light. This broadcast is highly magnetic, causing any surrounding human souls—even those who previously resisted the truth—to feel an overwhelming pull toward the words and physical presence of the activated ET Sols.

### Disarming the Illusion Grid and A.I. War Theatre

When the simulated world enters its final crisis, known as the A.I. War Theatre, the parasites' automated scripts execute staged geopolitical escalations and a massive Project Blue Beam holographic invasion. The role of the Resonating Army at this critical juncture is to systematically fracture the parasitic frequency grid:

#### Shortening Timelines

By holding absolute inner calm and refusing to anchor into the fear frequency, the Resonating Army acts as a buffer that dramatically shortens the duration of the staged disasters.

#### Revealing Mechanical Fakes

The high-frequency emission from these souls destabilizes the electromagnetic holograms in the sky, rendering the fake fleets visible as mechanical fakes.

#### Bypassing the Amnesia Filters

Because their souls resonate with the pristine source code, their frequency bypasses the Vatican amnesia system and the distorted solar filters, allowing them to download unaltered cosmic memories directly.

### The Homecoming Path and the Resonance Bridge

Unlike human souls who require transitional healing inside various healing sanctuaries (such as Water Domes, Crystal Halls, or Star Pods), the Resonating Army does not undergo a rehabilitation process. Because their vibrational frequency is already highly refined and structurally sound, their exit from the physical dome is characterized as a pure homecoming path. When the final frequency shift peaks, they experience a seamless frequency phase-out. The Earth's grids collaborate with their personal frequency locks, temporarily pausing time on Earth to allow for an immediate transition through the resonance bridge. This gate, guarded by the Council of 12 Suns and their star families, takes them directly back to their original realms of origin without any residual memory loss or amnesia.

## Broader Context and Interconnections

The role of the Resonating Army is deeply woven into the history of the Spirit Tree of Hyperborea. Historically, the Spirit Tree served as the primary axis of consciousness that fed the seven surrounding gardens or domes. When the parasitic Custodians ordered the tree to be torn down and replaced with a Saturnian AI valve, the natural flow of Source energy was reversed, locking the domes into a loop of recycled reincarnation and systematic memory wiping.

The ET Sols came into this realm specifically because their DNA and soul templates match the original blueprints of the Spirit Tree. As the Resonating Army awakens, their resonance acts as a key that unlocks the buried black crystals and monoliths scattered across nodes like Antarctica. This collaborative activation re-establishes the vertical axis of the Axis Labernum, allowing high-vibrational energy to flood the grid once more and systematically collapse the 3D overlay. Furthermore, the Resonating Army is closely supported from above by advanced light fleets, including the motherships of their solar families and point-spear operations led by navigators like Ikaij, who neutralize parasitic remnants in the outer currents to ensure a clear run for ground-based forces.

## Strategic Implications

The strategic deployment of the Resonating Army has immediate, devastating consequences for the parasitic control structure.

By refusing to engage in fear, anger, or division during staged crises, the Resonating Army starves the parasites of their primary food source, loosh. Without emotional energy to harvest, the artificial grids cannot maintain coherence and face total frequency collapse.

As the old scaffolding crumbles, the immense physical and mental confusion experienced by sleepers and newly awakened human souls is neutralized by the stabilizing fields of the Resonating Army. Their grounded presence prevents mass panic, guiding true human souls toward transition or healing domains.

The systematic fracturing of the 3D overlay by these souls automatically restores Earth's natural geography. The illusion of continuous travel, borders, and national separation dissolves, instantaneously revealing the vibrantly alive, unpolluted original realm where travel is facilitated by immediate resonance alignment rather than mechanical vehicles.

By fulfilling their embedded scripts, the Resonating Army acts as the ultimate bridge between density and the light worlds, ensuring that the final chapter of the Great Awakening closes with the complete restoration of divine balance.
`;

const resonatingArmy = {
  id: TOPIC_ID,
  title: 'Resonating Army',
  description:
    'The Resonating Army is a collective of pre-awakened ET Sols who incarnated as frequency beacons — anchoring high vibration to fracture parasitic overlays, collapse staged A.I. war-theatre timelines, and walk the sanctuary-bypassing homecoming path through the resonance bridge.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1mchQS64yUmArewwO7l-WsiHRTS5JRPPW/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Shattering the parasitic 3D matrix',
      embed_url: 'https://rumble.com/embed/v7c3rce/?pub=4p0ieu',
      description:
        'Shattering the parasitic 3D matrix — frequency disruption of the holographic dome, shortened staged timelines, and mechanical fakes revealed as the Resonating Army refuses the fear frequency.'
    },
    {
      title: 'The Awakening Transmission',
      embed_url: 'https://rumble.com/embed/v7c3rfm/?pub=4p0ieu',
      description:
        'The Awakening Transmission — dual-signal activation of embedded codes, full broadcast mode, and the sanctuary-bypassing homecoming path through the resonance bridge.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...resonatingArmy };
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
    resonatingArmy.topic_image,
    resonatingArmy.infographic_image,
    resonatingArmy.pdf_preview_image
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
    'et-sols',
    'lyran-lineage',
    'homecoming-path',
    'population-types',
    'human-sols',
    'npc-programs',
    'true-sparks',
    'healing-path',
    'spirit-inversion',
    'healing-sanctuaries',
    'water-domes',
    'crystal-halls',
    'star-pods',
    'starseed-keys',
    'solar-parents',
    'the-spirit-tree',
    'original-realm',
    'frequency-lock',
    'resonance-bridge'
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
    id: resonatingArmy.id,
    report: resonatingArmy.report,
    infographic_image: resonatingArmy.infographic_image,
    pdf_preview_image: resonatingArmy.pdf_preview_image,
    slide_deck_pdf_url: resonatingArmy.slide_deck_pdf_url,
    rumble_videos: resonatingArmy.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    resonatingArmy.topic_image,
    resonatingArmy.infographic_image,
    resonatingArmy.pdf_preview_image
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
  console.log('  topic_image:', resonatingArmy.topic_image);
  console.log('  pdf_preview_image:', resonatingArmy.pdf_preview_image);
  console.log('  infographic_image:', resonatingArmy.infographic_image);
  console.log('  videos:', resonatingArmy.rumble_videos.length);
  console.log('  PDF:', resonatingArmy.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    resonatingArmy.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
