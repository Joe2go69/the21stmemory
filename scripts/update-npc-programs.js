/**
 * Updates breakdown npc-programs topic (was placeholder under Population Types).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields.
 *
 * Run: node scripts/update-npc-programs.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'npc-programs';
const BREAKDOWN_IMG = path.join(ROOT, 'images', 'breakdown');

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
    // Same size → treat as already done, drop source duplicate
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

// Explicit preferred targets so PDF / infographic never collide with topic card name.
const topicImage = normalizeImage('NPC Programs.webp', 'npc-programs.webp');
const pdfPreview = normalizeImage(
  'Frequency_Collapse_Activation.webp',
  'npc-programs-pdf-preview.webp'
);
const infographic = normalizeImage(
  'The_Architecture_of_Population_Programs.webp',
  'the-architecture-of-population-programs.webp'
);

const REPORT = `# NPC Programs

## Overview

The populated world within the 3D simulation is divided into distinct Population Types characterized by their energetic origin, spiritual density, and functional roles in the architecture of the Great Dome. While the realm is occupied by Resonating Souls and True Human Souls who carry organic divine sparks, the majority of the current population consists of NPC Programs, which are background scripts rather than individualized sovereign consciousnesses. These non-soul entities maintain the structural illusion of society, responding mechanically to external stimuli and running on automated parameters. Understanding the division between these population classes is critical to navigating the impending frequency collapse and the restoration of the Second Realm.

## Key Terminology

- **NPC Programs** — Non-soul background programs and fragments of light engineered to hold the simulated reality together, running on pre-coded autopilot with no organic memory or external anchor.

- **Resonating Souls** — Also known as the Resonating Army or ET Souls, these are the 500 million starseeds and advanced consciousnesses who entered the dome system to dismantle the parasitic construct and activate humanity.

- **True Human Souls** — Organic sparks of light who were captured, inverted, and looped by parasitic entities, representing the primary population the Resonating Army descended to liberate.

- **Sleepers** — Souls currently trapped in a state of amnesia within the 3D program who retain a spark ignition potential capable of being activated during cosmic trigger events.

- **Amnesia Vortex** — A distorting frequency filter positioned at the transit band of the sun that strips incoming souls of their memories and lineages before incarnation.

- **Holographic Dome** — The artificial projection field that restricts biological perception, rendering low-frequency matter as solid and masking the true crystalline reality beneath.

## Core Revelations

The foundational truth of the dome population is that most active bodies are not individualized spiritual agents but rather artificial constructs seeded through specialized artificial entry bands around the sun. These programs carry parasite software instead of an organic solar lineage, making them fundamentally empty of sovereign consciousness. They perceive the simulated architecture—such as concrete, steel, and flat maps—as hard, heavy, and permanent because their low vibrational frequency matches the density of the illusion grid.

Because they lack a spiritual anchor outside the simulation, they cannot transition to the higher realms and are destined to dissolve back into the light field once the system's power source collapses.

## Detailed Mechanics and Key Elements

### Artificial Seeding and Entry Bands

Unlike organic souls who enter through the sun's original harmonic bands, NPC vessels are routed through four to five artificial entry bands built by the Custodians. These bands inject coded memory inserts instead of true past lives, generating a superficial sense of identity centered around the belief that "you only live once". Because they lack connection to the Council of 12 Suns, they do not carry the solar lineage codes required to perceive the higher dimensions.

### Susceptibility to Mind-Altering Weapons

NPCs are completely compliant with Scalar Frequency Weapons and Voice to Skull technologies operated through the Black Cube A.I. System. These systems target brain-wave patterns—such as theta, delta, and alpha—to induce localized states of confusion, anger, or despair. NPCs react instantly to visual activation cues and numerical codes displayed on public broadcast channels, which trigger pre-programmed behaviors and turn them against awakening souls.

### Behavioral Profiles and Glitching

While Resonating Souls remain calm and hold their ground during shifts, NPCs exhibit predictable panic patterns. Under emotional stress, their pre-coded scripts fail, causing visible NPC programming glitches where they lash out, wander aimlessly in circles, or go quiet and dazed. Because they run on an algorithmic pre-coded auto-pilot, they are incapable of adjusting to rapid changes in the background resonance.

### Dissolution Mechanics

When the 3D overlay collapses through frequency collapse, all systems lacking an external anchor lose their energetic foundation. Because the NPC bands are being made unstable by the incoming light forces, their physical shells will simply pixilate and dissolve like shadows when the light hits. They do not undergo ascension or enter the healing sanctuaries because there is no sovereign soul-spark to salvage.

## Broader Context and Interconnections

The presence of NPC Programs is directly tied to the parasitic treaty and the establishment of the central Known Lands as a shared energetic farm. The Council of Parasitic Races—including the Custodians, Anunnaki, Draconians, Greys, and Niburians—collaborated to deploy these empty shells to skew the collective consciousness and maintain the loosh harvesting loops.

By populating the dome with millions of compliant programs, the parasites established a social consensus that reinforces the illusion of distance, nation-states, and monetary dependency. These programs serve as social enforcers, drowning out the high-frequency signals of the active starseeds and keeping True Human Souls trapped in loop cycles.

## Strategic Implications

The primary directive for the Resonating Army is to cease all energetic engagement with the NPC population. Because NPCs have no sovereign soul to awaken, trying to convince or argue with them is a waste of vital force. Instead, the strategy relies on ignoring and starving the NPC programs while focusing entirely on triggering the latent memories of the True Human Souls and Sleepers who can still be saved.

As the Emergency Broadcast System activates and the sky begins to open, the frequency signals emitted by the Resonating Army will cut through the decaying A.I. scaffolding. This will allow the remaining organic souls to bypass the dismantled Vatican filters and align with their true Solar Families for extraction, while the empty NPC matrix quietly fades from the restored landscape.
`;

const npcPrograms = {
  id: TOPIC_ID,
  title: 'NPC Programs',
  description:
    'NPC Programs are non-soul background scripts that hold the 3D simulation together — empty of sovereign consciousness, seeded through artificial solar bands, and destined to dissolve when frequency collapse removes the system’s power source.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1i-okVVLLAAaeJBF-NB7VprOSEuTHk2Vg/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Waking Up Together',
      embed_url: 'https://rumble.com/embed/v7bzf66/?pub=4p0ieu',
      description:
        'Waking Up Together — Population Types inside the Great Dome: Resonating Souls and True Human Souls who carry organic sparks, versus NPC Programs that maintain the structural illusion of society on automated parameters.'
    },
    {
      title: 'Soulless NPCs in the Great Dome simulation',
      embed_url: 'https://rumble.com/embed/v7bzfl0/?pub=4p0ieu',
      description:
        'Soulless NPCs in the Great Dome simulation — artificial entry bands, parasite software instead of solar lineage, and NPC shells that dissolve like shadows when the system’s power source collapses.'
    },
    {
      title: 'The Discernment Journey',
      embed_url: 'https://rumble.com/embed/v7bzfsu/?pub=4p0ieu',
      description:
        'The Discernment Journey — cease energetic engagement with NPCs, starve the programs, and focus vital force on triggering True Human Souls and Sleepers who can still be saved.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...npcPrograms };
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

// --- Main ---
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

// Unique ownership: no other topic may share these image paths
const ours = new Set([
  npcPrograms.topic_image,
  npcPrograms.infographic_image,
  npcPrograms.pdf_preview_image
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
  id: npcPrograms.id,
  report: npcPrograms.report,
  infographic_image: npcPrograms.infographic_image,
  pdf_preview_image: npcPrograms.pdf_preview_image,
  slide_deck_pdf_url: npcPrograms.slide_deck_pdf_url,
  rumble_videos: npcPrograms.rumble_videos
};

const existingHeavy = fs.existsSync(topicFile)
  ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
  : {};
const sourceNode = findNode(source.topics, TOPIC_ID);
if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

// Verify image files exist and are kebab-case
for (const rel of [
  npcPrograms.topic_image,
  npcPrograms.infographic_image,
  npcPrograms.pdf_preview_image
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

// Subtopics tree preserved
if (!updated.subtopics || updated.subtopics.length < 3) {
  throw new Error(
    'Expected Background Fragments / A.I. Shells / Code Dissolution subtopics preserved'
  );
}
const subIds = updated.subtopics.map((s) => s.id);
for (const id of ['background-fragments', 'ai-shells', 'code-dissolution']) {
  if (!subIds.includes(id)) {
    throw new Error(`Missing subtopic: ${id}`);
  }
}

console.log('Updated', TOPIC_ID);
console.log('  topic_image:', npcPrograms.topic_image);
console.log('  pdf_preview_image:', npcPrograms.pdf_preview_image);
console.log('  infographic_image:', npcPrograms.infographic_image);
console.log('  videos:', npcPrograms.rumble_videos.length);
console.log('  PDF:', npcPrograms.slide_deck_pdf_url);
console.log('  other topics image paths unchanged:', beforeOthers.length);
console.log(
  '  Videos:',
  npcPrograms.rumble_videos.map((v) => v.title).join(' | ')
);
