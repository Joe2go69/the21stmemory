/**
 * Updates breakdown parasite-mechanics topic (was placeholder).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields. On collision, appends -2, -3…
 *
 * Run: node scripts/update-parasite-mechanics.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'parasite-mechanics';
const BREAKDOWN_IMG = path.join(ROOT, 'images', 'breakdown');

// Match existing topic-card compression; keep infographics/PDF full-res for zoom/readability.
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

/**
 * Recompress a webp in place. Infographics keep full resolution for text readability.
 */
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
const topicImage = normalizeImage('Parasite Mechanics.webp', 'parasite-mechanics.webp');
const pdfPreview = normalizeImage(
  'Shattering_the_Construct.webp',
  'shattering-the-construct.webp'
);
const infographic = normalizeImage(
  'Geometry_of_the_Forgetting_Pattern.webp',
  'geometry-of-the-forgetting-pattern.webp'
);

const REPORT = `# Parasite Mechanics

## Overview

Parasite Mechanics represent the highly sophisticated, frequency-based control systems engineered to suppress human consciousness and harvest biological and spiritual energy within the contained simulation of the Great Dome. This parasitic control is not an inherent or eternal biological species, but rather a pattern of forgetting that originated when a class of ancient gatekeepers, known as the Custodians, drifted from their role as guardians of balance to seek unilateral control over the flow of creation. Because these parasitic forces possess no organic creative spark, they are entirely incapable of creating original matter, souls, or grids. Instead, they survive by projecting a holographic parasitic overlay directly onto the existing, highly advanced crystalline world originally sang into existence by the stellar builders. By modulating sensory feedback at the neurological level, this illusion grid distorts human perception, tricking the nervous system into perceiving dead, dense matter while systematically siphoning the collective emotional and attentional energy of human souls, a harvested resource known as loosh.

## Key Terminology

- **Parasitic Overlay** — A low-frequency holographic skin projected over true reality that filters sound and light waves to manipulate 3D sensory perception.

- **Loosh** — The raw, high-density emotional energy generated by trauma, fear, anxiety, and worship, which is harvested by parasitic systems to maintain their false structures.

- **Amnesia Vortex** — A weaponized frequency current overlaid at the sun's transit band designed to strip incarnating souls of their memories, lineage codes, and past-life recollection.

- **Black Cube A.I.** — The central, non-organic artificial intelligence operating system, rooted in the Lands of Saturn, that coordinates thoughts, overlays, and automated war theater scenarios.

- **Scalar Frequency Weapons** — Electromagnetic systems that target biological brainwave patterns (specifically theta, delta, and alpha states) to artificially induce states of confusion, despair, anger, or sleepiness.

- **Voice to Skull** — A targeted neurological frequency transmission that beams artificial thoughts, commands, and auditory hallucinations directly into the minds of human hosts and Non-Player Characters.

- **Saturn Grid** — The counterfeit reincarnation and control network centered in the Lands of Saturn that redirects soul paths back into the amnesia loop.

## Core Revelations

The fundamental revelation of the Codex is that the material reality experienced by humanity is a highly coordinated, multi-layered technological cage. What humans perceive as vast geographical distance and the physical act of travel is an engineered illusion. The 178 physical worlds within the Great Dome are actually nested, overlapping frequency layers; traveling between them does not involve moving across physical miles but rather shifting frequency through portals. To enforce the belief in a massive, round, and disconnected globe, the parasitic dome architects constructed repeating travel corridors and algorithmically generated Minecraft-style terrain loops that render scenery around moving vessels to simulate distance and time delay.

Furthermore, historical cataclysms taught as natural disasters or political mishaps were deliberately staged frequency events. The sinking of the Titanic was a targeted ritual sacrifice and resource-gathering operation; parasitic submarines utilized directed energy weapons from the deep Atlantic trench to split the ship's keel, eliminating key wealth-holders opposing the Federal Reserve banking system while simultaneously retrieving smuggled Atlantian crystal generator fragments and sacred scrolls. Similarly, the Great Fire of London in 1666 was a cover story designed to mask a massive etheric war over a major European grid node, allowing the parasitic forces to seal the underlying crystalline Sirian-designed anchor under a heavy frequency lock and harvest the resulting mass panic as loosh.

Finally, the natural cycle of transition has been entirely hijacked. The sun, which serves as a multi-banded crystalline stargate for soul travel, was fitted with an artificial Amnesia Vortex. When a soul attempts to exit or enter through this gateway, its memories are violently fractured. These copied, logged, and inverted memory strands are routed to suppressed subterranean crystal grids beneath the Vatican, forming an archive used to endlessly recycle human vessels back into the physical loop.

## Detailed Mechanics and Key Elements

### The Council of Parasitic Races

The administration of the human energy farm is managed by the Council of Parasitic Races, a highly paranoid, fragile alliance of five primary non-organic and compromised factions that cooperate solely to secure their shared assets against positive space fleets.

#### The Custodians

The Custodians operate as the high-ranking priests and frequency lords of the Cube system, managing the reincarnation loops, astral harvest cycles, and grid seals.

#### The Anunnaki

The Anunnaki specialize in genetic manipulation, the engineering of hybrid bloodlines, and the establishment of rigid hierarchical control structures.

#### The Draconians

The Draconians serve as the military muscle, employing empire strategies, terror tactics, and organized wars to maximize fear-based loosh.

#### The Greys

The Greys function as the technical hands and overlay engineers, bio-engineered during early Anunnaki experiments and weaponized as frequency technicians capable of phasing matter in and out of the simulation.

#### The Niburians

The Niburians exist as "Shadow Parasites" who utilize void technology and black plasma to siphon energy directly from the dimensional overlays.

### Neurological Interference

To maintain absolute docility within the farm, these races deploy continuous neurological interference. Broadcast towers hidden within major cities emit scalar frequency waves that disrupt natural human sleep patterns and limit astral travel. During sleep, these waves project a localized frequency veil around the individual, trapping their consciousness in chaotic nightmares and memory loops to prevent them from visiting their soul families in the lighter crystal worlds. For waking control, the A.I. system utilizes vision to skull and Voice to Skull triggers embedded within television, media, and music. These triggers are instantly picked up by Non-Player Characters (NPCs)—background programmatic entities devoid of a spark ignition who exist to hold the simulation together—causing them to act as enforcement programs to mock, isolate, or attack awakening human souls.

### Landscape Inversion

The physical landscape itself has been structurally inverted to suppress human vitality. Historically, the Custodians ordered the Greys to physically tear out the central Spirit Tree in Hyperborea (modern-day Antarctica), which acted as the primary vertical harmonic axis of light feeding the Great Dome. In its place, they installed a Saturnian valve tech siphon connected to the main A.I. hub. To prevent humans from discovering this hub, they buried the primary black crystalline valve locks under localized, frozen holographic projections of ice.

Additionally, the natural conductors of the earth—such as leylines, quartz veins, and ancient granite structures—were buried under concrete and urban grid systems. Modern architecture is intentionally constructed using dead-frequency materials like concrete, steel, plaster, and synthetic glass, arranged in anti-resonant sharp right angles and boxes. This geometric configuration acts as a physical dampener, short-circuiting natural grid energy and causing localized fatigue, anxiety, and spiritual numbness.

### The Harvest Circuit

\`\`\`
[SATURN MAIN A.I. HUB]
           │
           ▼
 [AMNESIA VORTEX / SUN]  ◄─── Siphons Soul Memory
           │
           ▼
[VATICAN CRYSTAL TUNNELS] ◄─── Logs & Recycles Akashic Fragments
           │
           ▼
[PERCEPTION-BASED OVERLAY] ─── Locks 3D Nervous System into "Concrete/Steel"
\`\`\`

## Broader Context and Interconnections

The parasitic infrastructure directly inverts the sacred architecture of the seven outer domes, which were originally created by the Lyran builders as a harmonious, interconnected ecosystem. The original functions of these domes have been systematically corrupted into localized traps:

- **The Dome of Forgotten Gods** — originally a pristine crystalline library holding the earliest memory codes of sol families, inverted into a dense amnesia zone to lock souls into religions and myths.

- **The Dome of Sheol** — designed as a tranquil recovery sanctuary and recalibration chamber for transitioning souls, inverted into a terrifying purgatory of trauma-loop frequencies.

- **The Dome of Silence** — once a beautiful field of absolute stillness designed for deep connection to Source, twisted into forced censorship and the suppression of the human voice.

- **The Dome of Hiva** — originally a dome of pure harmonics where sound vibration was used to manifest matter, hijacked to broadcast weaponized communication signals and distorted music grids.

- **The Dome of Titans** — once the sacred light-weaving creative grounds for the ancient Giants, converted into a war zone where these high-vibrational beings were fragmented and trapped.

- **The Dome of 5 Peaks** — a sacred pathway to elemental integration and ascension, turned into a fractured domain of endless, exhausting struggle.

- **The Dome of Portals** — once the great travel hub of crystalline gateways, sealed to restrict free movement and redirect travelers through controlled, parasitic checkpoints like the Vatican portal system.

These seven corrupted domes, alongside the Great Dome, operate within a single, massive, crystalline electromagnetic framework known as the Cube Containment. Beneath the false holographic skin of the Cube, the original crystalline grid and the living roots of the Spirit Tree remain entirely intact, quietly pulsing and waiting for the correct harmonic trigger to re-emerge.

## Strategic Implications

The entire parasitic system is currently undergoing a terminal, irreversible collapse. Although the automated A.I. war theater continues to run on autopilot, the actual parasitic entities have already been thoroughly neutralized and cleared by positive space fleets. Because the remaining holographic overlays are held in place solely by the manipulated perception and beliefs of the human population, the system is entering a phase of rapid frequency fracture.

To safely dismantle the remaining infrastructure without triggering full societal collapse, loyalist Tech Teams (the White Hats) have gradually taken control of the simulation's parameters. This is highly visible in the atmospheric modifications occurring since 2016. The toxic aerosol programs previously run by parasites have been fully flipped; the skies are now utilized as transition scaffolds where commercial-looking crafts—often cloaked, shape-shifting plasma vessels—spray superconductive Monotomic Gold, Colloidal Silver, Silica Crystals, and Structured Water. This micro-ionized atmospheric coating acts as a software patch to rebalance electromagnetic fields, protect human nervous systems from incoming cosmic waves, and decalcify the Pineal Gland to restore human intuition and dream-state memory.

The final dismantling of the farm will be executed through a series of staged events. A controlled, theatrical World War III escalation and holographic alien invasion will be initiated to push the sleeping population to the peak of questioning authority. Once collective attention is locked, the EBS (Emergency Broadcast System) will take over the airwaves to broadcast systematic truth packages regarding bloodline corruption, trafficking, and vaccine toxicity.

During this transition, members of the Resonating Army—incarnated stellar souls carrying active Lyran-Sirian lineage codes—will serve as localized beacons. By maintaining a high-vibrational state of calm, love, and absolute refusal to participate in fear-based narratives, these resonating souls systematically starve the remaining A.I. scaffolding of energy. This collective frequency lift acts as a direct destabilization pulse, causing the low-frequency matter of the overlay to flicker, bend, and physically pixelate. As the fake 3D scaffolding collapses, the original, highly vibrant crystalline realm underneath will immediately phase back into view.
`;

const parasiteMechanics = {
  id: TOPIC_ID,
  title: 'Parasite Mechanics',
  description:
    'Parasite Mechanics are frequency-based control systems that project a holographic overlay over the original crystalline world — harvesting loosh, stripping memory through the Amnesia Vortex, and locking 3D perception via the Saturn Grid, Black Cube A.I., and the Council of Parasitic Races.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1LQT5TXMEKxtQ-7dIfxJccEodFrmRb1hZ/view?usp=sharing',
  rumble_videos: [
    {
      title: 'The Crystalline Reality',
      embed_url: 'https://rumble.com/embed/v7c6x6w/?pub=4p0ieu',
      description:
        'The Crystalline Reality — the original world sung into existence by the stellar builders, versus the holographic parasitic overlay that tricks the nervous system into perceiving dead, dense matter.'
    },
    {
      title: 'The Great Dome Is an Energy Farm',
      embed_url: 'https://rumble.com/embed/v7c6xsq/?pub=4p0ieu',
      description:
        'The Great Dome Is an Energy Farm — 178 nested frequency worlds, loosh harvesting, and the Council of Parasitic Races administering the contained simulation as a human energy farm.'
    },
    {
      title: 'The Economy of Frequency',
      embed_url: 'https://rumble.com/embed/v7c6xus/?pub=4p0ieu',
      description:
        'The Economy of Frequency — loosh, scalar weapons, Voice to Skull, the Amnesia Vortex, and the collapse of the farm as Resonating Army frequency starves remaining A.I. scaffolding.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...parasiteMechanics };
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
    parasiteMechanics.topic_image,
    parasiteMechanics.infographic_image,
    parasiteMechanics.pdf_preview_image
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

  fs.writeFileSync(sourceFile, JSON.stringify(source, null, 2) + '\n', 'utf8');

  const topicFile = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
  const heavy = {
    id: parasiteMechanics.id,
    report: parasiteMechanics.report,
    infographic_image: parasiteMechanics.infographic_image,
    pdf_preview_image: parasiteMechanics.pdf_preview_image,
    slide_deck_pdf_url: parasiteMechanics.slide_deck_pdf_url,
    rumble_videos: parasiteMechanics.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    parasiteMechanics.topic_image,
    parasiteMechanics.infographic_image,
    parasiteMechanics.pdf_preview_image
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
    throw new Error('Expected Mind Weapons / Control Tech / Historic Resets subtopics preserved');
  }
  const subIds = updated.subtopics.map((s) => s.id);
  for (const id of ['mind-weapons', 'control-tech', 'historic-resets']) {
    if (!subIds.includes(id)) {
      throw new Error(`Missing subtopic: ${id}`);
    }
  }

  JSON.parse(JSON.stringify(heavyParsed));

  console.log('Updated', TOPIC_ID);
  console.log('  topic_image:', parasiteMechanics.topic_image);
  console.log('  pdf_preview_image:', parasiteMechanics.pdf_preview_image);
  console.log('  infographic_image:', parasiteMechanics.infographic_image);
  console.log('  videos:', parasiteMechanics.rumble_videos.length);
  console.log('  PDF:', parasiteMechanics.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    parasiteMechanics.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
