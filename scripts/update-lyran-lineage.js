/**
 * Updates breakdown lyran-lineage topic (was placeholder under ET Sols).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields. On collision, appends -2, -3…
 *
 * Run: node scripts/update-lyran-lineage.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'lyran-lineage';
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
const topicImage = normalizeImage('Lyran Lineage.webp', 'lyran-lineage.webp');
const pdfPreview = normalizeImage('True_Lyran_Current.webp', 'true-lyran-current.webp');
const infographic = normalizeImage(
  'The_Primordial_Architecture_of_Courage.webp',
  'the-primordial-architecture-of-courage.webp'
);

const REPORT = `# Lyran Lineage

## Overview

The Lyran Lineage is the primordial lineage of consciousness comprising the original builders, architects, and early Custodians of physical reality. Originating billions of years ago, this lineage is responsible for establishing the cosmic systems of balance, order, and physical templates across the Great Dome. Far from representing literal feline animals, the lineage is defined by distinct qualities of consciousness—such as heart-centered courage, noble guardianship, and protective strength—which are symbolized by the mythic emblem of the lion. Within the broader matrix of ET Sols (extraterrestrial souls incarnated into physical vessels to assist in the current transition), the Lyran Lineage serves as the root frequency code that coordinates the awakening and restoration of the realm.

## Key Terminology

- **Lyran Lineage** — The primordial line of consciousness consisting of the original builders, architects, and early Custodians who established the structures of physical form and balance.

- **ET Sols** — Extraterrestrial souls who have entered physical vessels in the simulated 3D realm to assist in dismantling the parasitic overlay and awakening humanity.

- **Sefrin Councils** — The ancient assemblies established billions of years ago by the Lyran lineage to design physical life and maintain cosmic balance.

- **True Lyran Current** — The specific vibrational frequency characterized by heart-centered courage, loyal protection of life's balance, and leadership through service rather than fear.

- **Spirit Tree** — The direct link to source and the solar family, acting as the central axis of consciousness that pulses pure light and sound throughout the crystalline grid.

## Core Revelations

The primary revelation regarding the Lyran Lineage is that the lion is a mythic symbol rather than a biological species. While certain DNA manipulation projects across history have utilized feline DNA for its specific traits, the True Lyran Current refers strictly to an elite frequency of consciousness. This lineage is not confined to a single group; instead, every soul within the Great Dome carries the Lyran lineage coded within their essence, as this was the original methodology of creation. This inherent coding is the mechanism that allows both ET Sols and human souls to recognize the harmonic call of awakening. Furthermore, the original Lyran Builders-Architects worked in absolute harmony to design the blueprint of the physical plane, constructing the Spirit Tree as the central axis of consciousness before their work was hijacked by parasitic forces.

## Detailed Mechanics and Key Elements

### The Sefrin Councils and Original Design

Billions of years ago, the Lyran lineage designed and created the Sefrin Councils to govern physical form and physical life. This original design focused on preserving balance across the 178 worlds of the Great Dome. The Lyrans functioned as the primary builders and architects, folding sound vibration into light to stabilize crystalline membranes.

### The Spirit Tree in Hyperborea

The Lyran Builders-Architects planted the Spirit Tree in Hyperborea, establishing it as the central axis of consciousness and harmonic conduit for all seven gardens or domes. This structure served to pulse pure light and sound throughout the crystalline grid until it was violently removed by hijacked Custodians and their enslaved engineers.

### Seeding Across Physical Domains

In the ancient laboratories of Sirius A and Sirius B, the lion-hearted Lyran qualities were refined and seeded across the physical domains. Later, in the Hyperborean Halls near Asgard, the Lyran consciousness collaborated with Sirians, Andromedans, Arcturians, and Pleiadians to design the templates for the New Humans (the physical vessels).

### Embedded Codes and Broadcast Activation

ET Sols were embedded with specific Lyran codes by their solar parents before entering the 3D matrix. These codes lie dormant until activated by cosmic triggers, such as the harmonic tones released by the Council of 12 Suns. Once triggered, these codes act as a beacon, allowing ET Sols to transition to full broadcast mode, magnetically pulling human souls toward the truth.

## Broader Context and Interconnections

The Lyran Lineage is intricately linked to several ancient humanoid templates and environmental grids. The Pollarians, who were the first stable humanoid templates seeded in the known lands, were woven directly out of the Sirian-Lyran harmonic field. Similarly, the Giants—ancient guardians who possess massive physical bio-fields and partner with the White Hat Alliance—trace their soul consciousness directly back to the Lyran lineage.

On an environmental level, the lineage is connected to the planetary Crystals. These crystalline structures act as etheric hard drives, recording soul journeys and linking awakened Lyrans directly to galactic libraries that contain the unaltered records of physical creation. This connection is particularly strong in regions such as Canada and the eastern grid of the United Kingdom, where Lyran codes react directly with localized crystalline deposits.

## Strategic Implications

The preservation of the Lyran Lineage within ET Sols holds vital strategic importance for the success of the Great Awakening. Because the Lyran codes are embedded within the physical receivers of both ET Sols and human souls, their activation initiates the fracturing of the parasitic illusion grid. The bold, unbendable qualities of the "lion of consciousness" prevent ET Sols from being manipulated by parasitic frequencies, voice-to-skull technologies, or deceptive matrix loops. By holding high resonance, Lyrans starve the parasitic forces of the emotional loosh they require to maintain their false overlays. Ultimately, the activation of this lineage ensures that the human and ET souls can step onto the homecoming path, bypassing the corrupted reincarnation loops and returning directly to their crystalline origins.
`;

const lyranLineage = {
  id: TOPIC_ID,
  title: 'Lyran Lineage',
  description:
    'The Lyran Lineage is the primordial consciousness of original builders, architects, and early Custodians — heart-centered courage symbolized by the lion, the True Lyran Current coded in every soul, and the root frequency that coordinates awakening across the Great Dome.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1Nedtgupwi4D6EXoqNEy2YjqiBPx_BBGI/view?usp=sharing',
  rumble_videos: [
    {
      title: 'The Lyran Lineage',
      embed_url: 'https://rumble.com/embed/v7c5b9y/?pub=4p0ieu',
      description:
        'The Lyran Lineage — primordial builders and Custodians, the lion as mythic emblem of heart-centered courage, and the root frequency code coordinating the Great Dome\'s awakening.'
    },
    {
      title: 'Your Lyran DNA Shatters the Matrix',
      embed_url: 'https://rumble.com/embed/v7c5bdc/?pub=4p0ieu',
      description:
        'Your Lyran DNA Shatters the Matrix — every soul carries Lyran lineage coding; activation of the True Lyran Current fractures the parasitic overlay and magnetically pulls human souls toward the truth.'
    },
    {
      title: 'The Blueprint and The Failsafe',
      embed_url: 'https://rumble.com/embed/v7c5cee/?pub=4p0ieu',
      description:
        'The Blueprint and The Failsafe — Sefrin Councils, the Spirit Tree as central axis, and Lyran codes as the failsafe that starves parasitic loosh and opens the homecoming path.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...lyranLineage };
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
    lyranLineage.topic_image,
    lyranLineage.infographic_image,
    lyranLineage.pdf_preview_image
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
    'resonating-army',
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
    id: lyranLineage.id,
    report: lyranLineage.report,
    infographic_image: lyranLineage.infographic_image,
    pdf_preview_image: lyranLineage.pdf_preview_image,
    slide_deck_pdf_url: lyranLineage.slide_deck_pdf_url,
    rumble_videos: lyranLineage.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    lyranLineage.topic_image,
    lyranLineage.infographic_image,
    lyranLineage.pdf_preview_image
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
  console.log('  topic_image:', lyranLineage.topic_image);
  console.log('  pdf_preview_image:', lyranLineage.pdf_preview_image);
  console.log('  infographic_image:', lyranLineage.infographic_image);
  console.log('  videos:', lyranLineage.rumble_videos.length);
  console.log('  PDF:', lyranLineage.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    lyranLineage.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
