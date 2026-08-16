/**
 * Updates breakdown human-sols topic (was placeholder under Population Types).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields. On collision, appends -2, -3…
 *
 * Run: node scripts/update-human-sols.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'human-sols';
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
const topicImage = normalizeImage('Human Sols.webp', 'human-sols.webp');
const pdfPreview = normalizeImage(
  'Sovereign_Human_Sols.webp',
  'sovereign-human-sols.webp'
);
const infographic = normalizeImage(
  'The_Sovereign_Awakening_Process.webp',
  'the-sovereign-awakening-process.webp'
);

const REPORT = `# Human Sols

## Overview

Human Sols are true spiritual sparks containing the infinite, eternal essence of Source, currently caught and inverted by parasitic operations within the physical domain. Unlike other Population Types such as NPCs (or Non-Player Characters), which are hollow background programs and mere fragments of light designed to hold the 3D simulation together, Human Sols possess a genuine individual consciousness and a sovereign spiritual lineage. They carry a highly sophisticated energetic blueprint and latent codes naturally embedded into their soul matrix by their solar parents before any parasitic intervention occurred. Originally designed to collaborate, connect, and raise their frequency in tandem with the crystalline framework of their environment, Human Sols are the primary subjects of a multi-dimensional rescue operation led by awakened ET Sols of the Resonating Army.

## Key Terminology

- **Human Sols** — True spiritual sparks and individual souls possessing an eternal link to Source, who have been caught, inverted, and recycled through parasitic amnesia systems.

- **Taran Sols** — A highly ancient lineage of human souls originating from the pre-fall 5D+ templated world of Tara.

- **NPCs** — Non-player characters who are soulless fragments of light and automated background programs designed to stabilize the 3D holographic simulation.

- **Sleepers** — Human souls who remain unconscious of the simulated reality and their true origins, relying on external authority.

- **Healing Sanctuaries** — Specialized, high-frequency multidimensional environments built of light, sound, and living crystal to rehabilitate traumatized human souls.

- **Water Domes** — Shimmering, invisible dome environments designed for emotional healing, where souls float in liquid sound to draw out emotional density.

- **Crystal Halls** — Crystalline temples, often overlaid by physical cathedrals, where souls rest on vibrating slabs to realign their light body grids and dissolve mental programming.

- **Star Pods** — Floating etheric cocoons that heal soul fractures, timeline trauma, and karma across multiple timelines using light frequency streams.

## Core Revelations

The fundamental truth of Human Sols is their distinct spiritual origin, which separates them from the artificial constructs of the simulated 3D matrix. While NPCs are generated via artificial entry bands around the sun to populate the physical plane as empty vessels with coded memory inserts, Human Sols descend from true solar lineages and enter through the sun's original harmonic pathways. This authentic lineage has been heavily suppressed by a sophisticated loop of manipulation. When a true human soul passes through the portal of the sun, they are intercepted by an Amnesia Vortex that strips their memory. These extracted memory strands—known as Akashic fragments—are copied, archived, and inverted beneath the Vatican, enabling the parasites to keep the incarnating vessels docile and trapped in recurring loops.

A profound revelation is the existence of the Taran Sols, who are highly ancient caretakers of world consciousness originating from the 5D+ template of Tara in the Galan Matrix. When Tara fractured, these souls carried their highly refined DNA templates into the physical fragment of the Known Lands to stabilize the falling matrix. They now serve as the critical anchors for the upcoming restoration.

## Detailed Mechanics and Key Elements

### The Core Blueprint and Embedded Codes

Before the parasitic invasion, human souls were seeded with natural harmonic codes that react directly with the crystalline grids of the earth, such as leylines, mountains, and nodes. This energetic alignment automatically raises their frequency and spiritual connection. Because these codes match the frequencies carried by incoming ET Sols, the presence of awakened starseeds acts as an automatic activation key.

### The Activation and Awakening Process

The awakening of Human Sols occurs in sequential stages triggered by specific events:

#### The Awakening Cracks

During the first 72 hours of the simulated World War III and communications blackout, the sudden drop in atmospheric pressure and frequency fractures will cause sleepers and human souls to experience physical changes, such as ringing in the ears, deep tiredness, and heart-rate spikes.

#### Exposure and EBS Broadcasts

As the Emergency Broadcast System (EBS) takes over, the release of "soft truths" followed by "harder truths" regarding geopolitical deception, depopulation programs, and parasitic control will shatter their false reality, activating millions of human souls.

#### The Three-to-Four Solar Pulses

A series of cosmic flashes systematically destabilizes the parasitic overlays: the first flash glitches the perception of NPCs and clears energetic residue; the second flash triggers heart synchronization and activates dormant codes in Human Sols and starseeds; the third flash completely fractures false timelines and overlays; and the fourth flash acts as a seal breaker, connecting the central tree pulse and opening the crystalline gateways.

### The Rehabilitation Process inside the Healing Sanctuaries

Following the frequency collapse of the 3D overlay, human souls who are not yet fully stabilized on higher vibrational bands will transition into specialized Healing Sanctuaries. These spaces are not physical hospitals but pure frequency environments constructed from light, sound, and living crystal. They are overseen by benevolent Ground Healers (or Saferins), who are tall, radiant holographic light beings sent from the Council of 12 Suns to project an aura of absolute safety and love. The rehabilitation follows a three-stage restorative process:

#### Phase 1: Water Domes (Mending the Heart)

Souls enter shimmering domes projected over crystalline water bodies. By floating in pools of liquid sound, their emotional density is drawn out and replaced with Source memory codes, healing wounds of grief, fear, and heartbreak.

#### Phase 2: Crystal Halls (Mending the Mind)

Souls in their crystalline bodies hover over active crystal slabs that hum at precise frequencies. Living crystal walls glowing with rainbow fractals project light through crystal prisms, dissolving mental overlays, mind control damage, and parasitic programming.

#### Phase 3: Star Pods (Mending the Soul)

In this phase, souls are enveloped in floating cocoons of circulating light within etheric space. High-frequency light streams reweave fragmented soul aspects across multiple timelines, mending Soul Fractures, Timeline Trauma, and Karmic Wounds.

## Broader Context and Interconnections

Human Sols maintain direct lateral relationships with ET Sols, who act as the catalysts for their awakening. When the ET sols emit their full broadcast frequency, a magnetic pull is generated, allowing human souls to quickly bypass intellectual resistance, drop their egos, and recognize the truth.

Historically, human souls have been the primary target of the Council of Parasitic Races. Each parasitic faction siphons different elements of the human soul's energy: the Anunaki manage bloodlines, the Custodians harvest ritual astral energy, the Draconians feed on fear, the Greys extract genetic material, and the Niburians siphon void plasma.

Furthermore, earth's natural surface and hidden crystals act as planetary hard drives that record and log every movement and experience of Human Sols. This ensures their unbroken timeline is preserved galactically by their stellar families, bypassing the artificial memory wipes of the Vatican database.

## Strategic Implications

As human souls awaken and raise their frequency, they systematically fracture the parasitic overlay. Since the physical infrastructure of the 3D matrix (including corporate buildings, financial systems, and governments) has no anchor in a high-frequency field, these structures will simply undergo frequency collapse and pixelate into rubble.

Upon graduating from the healing sanctuaries, Human Sols regain complete spiritual sovereignty. They are presented with a definitive, conscious choice: they can transition into higher dimensions to join their galactic families, or they can choose to return to the Known Lands to start a fresh, freer evolutionary cycle completely free of parasitic overlays, where all technology runs on free energy and transportation occurs via resonance alignment.

Additionally, the atmospheric stabilization efforts, including the deployment of ORME (Orbitally Rearranged Monotomic Elements), plant enzymes, and micro-silica quartz in the skies, directly enhance the pineal glands of human souls, making them superconductive and highly receptive to incoming cosmic and solar signals.
`;

const humanSols = {
  id: TOPIC_ID,
  title: 'Human Sols',
  description:
    'Human Sols are true spiritual sparks containing the infinite, eternal essence of Source — sovereign individual souls inverted by parasitic operations, intercepted at the sun’s Amnesia Vortex, and restored through Water Domes, Crystal Halls, and Star Pods.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1NwzB6QhuXlrjhABch_A5I8t8NxZb8a2l/view?usp=sharing',
  rumble_videos: [
    {
      title: 'The Sovereign Journey: Awakening from the Illusion',
      embed_url: 'https://rumble.com/embed/v7c1wb2/?pub=4p0ieu',
      description:
        'The Sovereign Journey: Awakening from the Illusion — Human Sol awakening in stages through the 72-hour frequency fracture, EBS soft-then-hard truths, and three-to-four solar pulses that crack the 3D overlay.'
    },
    {
      title: 'The True Spiritual Spark',
      embed_url: 'https://rumble.com/embed/v7c1wfk/?pub=4p0ieu',
      description:
        'The True Spiritual Spark — Human Sols as eternal Source sparks with solar-parent codes, distinct from NPC fragments of light, including the ancient Taran lineage that anchors restoration of the Known Lands.'
    },
    {
      title: 'Your Stolen Sol Memories Beneath the Vatican',
      embed_url: 'https://rumble.com/embed/v7c1wjg/?pub=4p0ieu',
      description:
        'Your Stolen Sol Memories Beneath the Vatican — the Amnesia Vortex strips incoming Human Sol memory; Akashic fragments are copied, archived, and inverted beneath the Vatican to keep incarnating vessels docile.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...humanSols };
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
    humanSols.topic_image,
    humanSols.infographic_image,
    humanSols.pdf_preview_image
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
    'et-sols',
    'true-sparks',
    'healing-path',
    'spirit-inversion',
    'healing-sanctuaries',
    'water-domes',
    'crystal-halls',
    'star-pods',
    'amnesia-vortex',
    'vatican-archive',
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
    id: humanSols.id,
    report: humanSols.report,
    infographic_image: humanSols.infographic_image,
    pdf_preview_image: humanSols.pdf_preview_image,
    slide_deck_pdf_url: humanSols.slide_deck_pdf_url,
    rumble_videos: humanSols.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    humanSols.topic_image,
    humanSols.infographic_image,
    humanSols.pdf_preview_image
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
    throw new Error('Expected True Sparks / Healing Path / Spirit Inversion subtopics preserved');
  }
  const subIds = updated.subtopics.map((s) => s.id);
  for (const id of ['true-sparks', 'healing-path', 'spirit-inversion']) {
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
  console.log('  topic_image:', humanSols.topic_image);
  console.log('  pdf_preview_image:', humanSols.pdf_preview_image);
  console.log('  infographic_image:', humanSols.infographic_image);
  console.log('  videos:', humanSols.rumble_videos.length);
  console.log('  PDF:', humanSols.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    humanSols.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
