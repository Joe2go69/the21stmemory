/**
 * Updates breakdown homecoming-path topic (was placeholder under ET Sols).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields. On collision, appends -2, -3…
 *
 * Run: node scripts/update-homecoming-path.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'homecoming-path';
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
const topicImage = normalizeImage('Homecoming Path.webp', 'homecoming-path.webp');
const pdfPreview = normalizeImage(
  'The_Resonating_Homecoming.webp',
  'the-resonating-homecoming.webp'
);
const infographic = normalizeImage(
  'Homecoming_Path__Return_to_Origin.webp',
  'homecoming-path-return-to-origin.webp'
);

const REPORT = `# Homecoming Path

## Overview

The Homecoming Path is the specialized, resonance-based route of direct departure reserved for the Resonating Army and ET sols who incarnated into the physical matrix to assist with the planetary transition. Unlike true human souls who require rehabilitation through various healing sanctuaries upon the collapse of the 3D matrix, those on the Homecoming Path bypass these sanctuaries entirely. The path is a direct transit from the physical stage of the Known Lands back to the higher original realms of origin. It operates as a precise, frequency-governed extraction that reunites returned stellar consciousnesses with their solar parents and twin flames. This direct transition is facilitated through the resonance bridge, which connects the physical Earth grid directly to the high-vibrational light domains. Rather than being a physical journey spanning geographic distance, it is an instantaneous shift in dimensional layers. The path resolves all earthly amnesia, restoring the complete and unbroken timeline of the sol's cosmic journey.

## Key Terminology

- **Homecoming Path** — The direct, resonance-governed departure route through which awakened ET sols and returners exit the Known Lands directly to their original realms of origin without undergoing intermediate healing cycles.

- **Resonating Army** — The collective force of awakened ET souls and returners who descended into Earth's density with pre-embedded activation codes to hear the call, elevate the planetary frequency, and dissolve the parasitic overlays.

- **ET Sols** — Stellar-originated souls from various higher-dimensional worlds who temporarily entered human vessels to act as anchors of cosmic frequency and assist in the liberation of human souls.

- **Sol Frequency Lock** — An exclusive personal recognition code known only to a sol's specific star kin, called during the extraction phase to establish an unjammable frequency connection.

- **Frequency Phase Out** — The seamless process of shifting a sol's consciousness out of the physical dome's frequency band to return them to their original point of origin.

- **Portal of Vibration Alignment and Ascension** — A non-physical frequency threshold and sacred resonance point where a sol's consciousness matches the high vibrations of the higher light realms, allowing direct passage home.

- **3D Matrix Net** — The dense, artificial electromagnetic containment loop deployed by parasitic architectures on Earth, which is completely bypassed during the final homecoming extraction.

## Core Revelations

The primary revelation of the Homecoming Path is that it is a journey of pure remembrance and immediate transit, completely separate from the recovery pathways of healing realms. While fractured human souls must spend time in frequency-restoring domes to process lifetimes of trauma, the Resonating Army possesses a highly stabilized vibration that allows them to exit the Known Lands directly. Upon entering the resonance bridge, the amnesia technology that has suppressed stellar memory for cycles is instantly shattered, resulting in a complete memory flood.

Furthermore, the true vehicles of extraction are organic, living ships grown from crystalline plasma and plasmatic matter. These crafts do not exist in the same visual layer as the artificial, mechanical projections utilized in the staged alien invasion; they are invisible to low-vibration entities and can only be seen by those who have successfully shifted their eye perception to the correct frequency band. The final extraction is a highly guarded, private event that occurs completely out of the public view of sleepers and background programs.

## Detailed Mechanics and Key Elements

### The Multi-Stage Extraction Process

The transition along the Homecoming Path unfolds through a precise sequence of energetic and physical milestones. This sequence ensures that the departing ET sols are protected from the chaotic terminal collapse of the 3D overlay.

#### Energetic Activation

The process initiates during the geopolitical and atmospheric chaos of the terminal 3D cycle, where dormant codes within the ET sols are triggered by two simultaneous signals: a non-public scalar wave burst from white-hat space forces and a deep harmonic tone felt directly in the chest from the solar family. This trigger immediately shifts the sol's frequency field to a full broadcast mode, enabling them to act as magnetic beacons of truth and calm for surrounding souls.

#### The Inversion and Visual Shift

As the false, projected sky overlays and mechanical holograms of the staged crisis begin to collapse, the real fleets of the solar families break through their designated frequency bands. To those tuned to the right frequency, these massive living crystalline arks appear crystal clear, eliciting an intense heart pull of profound calm rather than the terror experienced by the general public.

#### Frequency Lock and Earth Pause

At the apex of this contact event, a personal recognition code—the Sol Frequency Lock—is called. This code collaborates with the electromagnetic grids generated by the crystal and Earth networks to isolate the departing vessel. In this precise moment, time on Earth is paused for the transitioning sol.

#### The Seamless Pick-Up

The craft executes a seamless frequency phase-out, shifting the sol's consciousness directly through the dome's boundaries to their original point of origin. This pick-up is shielded from low-vibration public sight to prevent energetic interference.

#### Final Vessel Lock

To guarantee that the sol is physically and energetically intact during departure, the human vessel undergoes an absolute frequency lock. This lock prevents any last-minute gravitational or matrix net pull from reclaiming the consciousness.

#### Code Deactivation

Once the sol has successfully stepped out of the human stage and transitioned into full solar family contact, their operational codes on Earth are permanently switched off as their service is complete.

### The Role of Crystalline Living Craft

The actual transport of ET sols back through the solar gate network is executed by organic, semi-conscious Motherships and smaller transportation crafts. These vessels are not manufactured with metal or combustion engines but are gestated and grown from crystalline plasma. The pilot does not utilize physical buttons, instead merging telepathically with the craft's bio-crystal skin, which responds entirely to intention, tone, and heart coherence. These arks carry internal ecosystems and act as mobile libraries containing the living memories of entire stellar lineages. During extraction, these ships operate slightly phased out of the physical dome's overlay, bending light to remain cloaked as lenticular clouds or massive storm banks until the moment of frequency alignment.

## Broader Context and Interconnections

The Homecoming Path is intrinsically tied to the grand architecture of the Cube Containment and the Council of 12 Suns. The sun itself is not a physical ball of fire, but a multi-banded crystalline stargate that serves as the primary gateway for exiting the Dome system. While parasites historically overlaid an amnesia vortex around the sun to copy and loop souls into the Vatican's archives, the dismantling of these artificial filters allows the original solar gate network to return to its true function.

The path also depends directly on the reactivation of the Spirit Tree at the center of the Known Lands. The Spirit Tree acts as the central axis of consciousness, feeding all seven outer domes, such as the Dome of Forgotten Gods and the Dome of Sheol, with pure Source light through its extensive root system. As ET sols and grid workers elevate their vibration, they unknowingly activate the hidden crystalline monoliths, surface quartz veins, and planetary crystals that mirror this central harmonic. This collective resonance reawakens the Axis Labernum—the vertical current of order running through the worlds—allowing the resonance bridge of the Homecoming Path to stabilize and receive the departing army.

## Strategic Implications

The completion of the Homecoming Path has immediate, irreversible effects on the terrestrial simulation. Because the physical reality of the 3D matrix is a perception-based solidity maintained by the manipulated awareness of the souls within it, the exit of the Resonating Army triggers a massive frequency collapse. Without the high-frequency presence of the ET sols anchoring and fracturing the overlay, the artificial low-frequency scaffolding of modern infrastructure, finance, and governance completely dissolves.

This collapse reveals the vibrant, unpolluted Second Realm—characterized by crystalline waters, ancient city structures, and natural walking paths—to the remaining human souls who have finally snapped out of denial. The strategic exit of the stellar returners thus marks the successful fulfillment of their cosmic mission: they have shattered the parasitic overlay from the inside, leaving the remaining human sparks safe, healed, and free to grow in a restored, crystalline environment.
`;

const homecomingPath = {
  id: TOPIC_ID,
  title: 'Homecoming Path',
  description:
    'The Homecoming Path is the resonance-governed direct-departure route reserved for the Resonating Army and ET sols — bypassing healing sanctuaries via the resonance bridge, Sol Frequency Lock, and crystalline living craft that return stellar consciousness to original realms of origin.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1cbsxsSne4DUw5vlNfUDkb-uDwXdzvrM7/view?usp=sharing',
  rumble_videos: [
    {
      title: 'The Direct Homecoming',
      embed_url: 'https://rumble.com/embed/v7c5i22/?pub=4p0ieu',
      description:
        'The Direct Homecoming — the sanctuary-bypassing extraction of the Resonating Army through the resonance bridge, Sol Frequency Lock, and an instantaneous dimensional shift back to original realms of origin.'
    },
    {
      title: 'Direct extraction of the resonating army',
      embed_url: 'https://rumble.com/embed/v7c5i7q/?pub=4p0ieu',
      description:
        'Direct extraction of the resonating army — crystalline living craft, frequency phase-out through the 3D matrix net, and the private pickup that reunites returned sols with solar parents and twin flames.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...homecomingPath };
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
    homecomingPath.topic_image,
    homecomingPath.infographic_image,
    homecomingPath.pdf_preview_image
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
    'resonating-army',
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
    'resonance-bridge',
    'the-homecoming',
    'living-crafts',
    'crystalline-arks'
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
    id: homecomingPath.id,
    report: homecomingPath.report,
    infographic_image: homecomingPath.infographic_image,
    pdf_preview_image: homecomingPath.pdf_preview_image,
    slide_deck_pdf_url: homecomingPath.slide_deck_pdf_url,
    rumble_videos: homecomingPath.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    homecomingPath.topic_image,
    homecomingPath.infographic_image,
    homecomingPath.pdf_preview_image
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
  console.log('  topic_image:', homecomingPath.topic_image);
  console.log('  pdf_preview_image:', homecomingPath.pdf_preview_image);
  console.log('  infographic_image:', homecomingPath.infographic_image);
  console.log('  videos:', homecomingPath.rumble_videos.length);
  console.log('  PDF:', homecomingPath.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    homecomingPath.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
