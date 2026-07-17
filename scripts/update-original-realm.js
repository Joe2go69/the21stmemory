/**
 * Updates breakdown original-realm topic in topic file + monolithic source.
 * Preserves existing subtopics. Does not modify other topics' image fields.
 * Run: node scripts/update-original-realm.js && node scripts/split-topics-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'original-realm';

const REPORT = `# Original Realm

## Overview

The Original Realm, often referred to as the Second Realm or Tara, is the true, underlying 5D+ baseline of existence beneath the current 3D parasitic overlays. It is a vast, interconnected Crystalline Temple composed of pure sound woven into light. Within the greater Reality Constructs of the Cube Containment, the Original Realm serves as the central anchor of the Known Lands, originally structured to hold the balance of all creation before its fragmentation and hijacking. The restoration of this realm requires no physical reconstruction; it is revealed instantly upon the frequency collapse of the false matrices.

## Key Terminology

- **Cube Containment** — One massive, interwoven crystalline electro-magnetic framework functioning as the master hard drive for all domes, realms, and simulations.

- **Great Dome** — The central physical layer within the Cube Containment holding 178 physical worlds, functioning as a frequency amplifier to solidify thought into dense structure.

- **Parasitic Overlay** — A false 3D holographical projection skin or illusion grid masking the true crystalline nature of reality, tricking the senses into perceiving concrete, steel, and distance.

- **Spirit Tree** — The original central node and axis of consciousness in Hyperborea that pulsed harmonic currents across the Great Dome before being ripped out and replaced by parasitic valve technology.

- **Sols of Tara** — The first stewards and caretakers of the Original Realm, carrying pre-fall 5D codes and responsible for seeding organic life, oceans, and garden eco-systems.

- **Council of 12 Suns** — The original solar stewardship that oversees the entire Cube system, acting as the keepers of balance and guiding creation without force.

## Core Revelations

Existence does not consist of floating planets or globes in a vacuum; it is a layered series of Frequency States operating within the Cube Containment. Reality begins as pure sound, which vibrates and folds into light, generating the first spark of Vision. This vision is then solidified into physical matter via stable Crystalline Membranes.

The Original Realm was never destroyed, nor was it overwritten. It remains perfectly intact but is actively cloaked by an Illusion Grid tuned to manipulate 3D senses, making dead concrete and stone look more real than living crystal. When the parasitic net drops, the true reality is exposed: an environment with clean air, pure continuous crystalline coastlines, and ancient city structures. There are no roads or vehicles; natural walking paths are formed by consciousness, and all systems operate on free energy drawn directly from the field.

## Detailed Mechanics and Key Elements

### The Architecture of Reality Constructs

Reality operates through an immensely complex Simulated Scaffolding. The central Known Lands are surrounded and supported by seven external domes, originally known as the Seven Gardens, fed directly by the Spirit Tree. These include the Dome of Forgotten Gods (memory and creation), Dome of Sheol (healing and sanctuary), Dome of Silence (pure frequency connection to Source), Dome of Hiva (harmonics and sound), Dome of Titans (builder realms), Dome of 5 Peaks (ascension), and Dome of Portals (the travel hub).

### The Foundation of the Original Realm

The Original Realm was first birthed in Lemuria and designed in the Hyperborean Halls near Asgard by the 5 Solar Masters of the Elements: Consciousness, Water, Fire, Air, and Earth. The foundational element, Consciousness, provides the awareness that brings form from nothing via friction, frequency, and sound. All environments within this realm are grown from Crystalline Plasma rather than built with dead materials.

### The Fall and the Parasitic Inversion

The pristine 5D+ template of Tara was subjected to a great fracture when parasitic collectives began siphoning its energy. This caused the original grid to shatter into multiple, lower-density overlays. The Custodians, initially placed as neutral overseers of the gateways, drifted into a desire for control and began feeding on the balance. They inverted the domes into prisons, removed the Spirit Tree, and installed Black Cube Tech—a frequency siphon and valve system linked to the Saturn Moon matrix—to continuously harvest emotional energy and lock souls into reincarnation loops.

### Mechanics of the True Material World

True solar architecture, built by Atlantean and Tartarian lines, features living geometric conductors—arches, domes, and spirals—that amplify frequency and connect directly to ley-lines. Modern 3D architecture relies on squares, sharp right angles, and dead frequency holders designed to act as anti-resonance forms, deliberately draining perception into a boxed-in frequency.

## Broader Context and Interconnections

### The Illusion of Distance and Travel

Travel across the earth is an optical illusion enforced by Frequency Corridors and time loops. Oceans and skies act as rendered filler between simulations. In the Original Realm, movement is achieved through instant resonance alignment, folding spacetime around a consciousness rather than moving through it.

### Crystalline Star Nodes

The stars in the sky are actually multidimensional Crystalline Nodes anchoring the projection overlays. Originally, these were open portals streaming living plasma between realms like Tara, Andromeda, and Lyra before being sealed by the parasite grid.

### The Pleiadian Lineage

The Pleiadians are direct descendants of the original Sols of Tara. When Tara fractured, they migrated to the Lands of Pleiades to preserve the codes, perfecting the highly successful, high-frequency telepathic humanoid vessel.

## Strategic Implications

The return of the Original Realm relies entirely on frequency collapse. As awakened souls hold their harmonic resonance, the Light Lattices of the parasitic overlay glitch and shatter. This process reveals the true environment hidden in plain sight. For those bound to the 3D program, the collapse will initially look like hollow rubble, as they lack the frequency to anchor into the restored dimension. Awakened souls will instantly transition their perception to the vibrant, living crystal reality, seamlessly returning the Known Lands to their unpolluted, harmonious origin.
`;

const originalRealm = {
  id: TOPIC_ID,
  title: 'Original Realm',
  description:
    'The Original Realm (Second Realm / Tara) is the true 5D+ crystalline baseline beneath the 3D parasitic overlay — Cube Containment architecture, Spirit Tree inversion, and frequency collapse that reveals the living temple.',
  topic_image: 'images/breakdown/original-realm.webp',
  report: REPORT,
  infographic_image: 'images/breakdown/the-living-truth-of-tara.webp',
  pdf_preview_image: 'images/breakdown/crystalline-restoration.webp',
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1ftvay1TAs14o5fzIEK2zrRNzNNBAGWh8/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Echoes of Tara',
      embed_url: 'https://rumble.com/embed/v7anww0/?pub=4p0ieu',
      description:
        'Echoes of Tara — the Original Realm as the living crystalline baseline beneath the 3D parasitic overlay within Cube Containment.'
    },
    {
      title: 'Reclaiming the Original Crystalline Realm Tara',
      embed_url: 'https://rumble.com/embed/v7any8c/?pub=4p0ieu',
      description:
        'Reclaiming the Original Crystalline Realm Tara — frequency collapse of the illusion grid and restoration of the Second Realm.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      topics[i] = { ...originalRealm };
      if (existingSubtopics) topics[i].subtopics = existingSubtopics;
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

const sourceFile = path.join(ROOT, 'data', 'breakdown-topics.json');
const source = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

const beforeOthers = collectImageFields(source.topics)
  .filter((e) => e.id !== TOPIC_ID)
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();

if (!findAndUpdate(source.topics)) {
  throw new Error(`${TOPIC_ID} topic not found in breakdown-topics.json`);
}

fs.writeFileSync(sourceFile, JSON.stringify(source, null, 2) + '\n', 'utf8');

const topicFile = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const heavy = {
  id: originalRealm.id,
  report: originalRealm.report,
  infographic_image: originalRealm.infographic_image,
  pdf_preview_image: originalRealm.pdf_preview_image,
  slide_deck_pdf_url: originalRealm.slide_deck_pdf_url,
  rumble_videos: originalRealm.rumble_videos
};
fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

// Verify image files exist
for (const rel of [
  originalRealm.topic_image,
  originalRealm.infographic_image,
  originalRealm.pdf_preview_image
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing image file: ${rel}`);
  }
}

// Unique ownership: no other topic may share these image paths
const ours = new Set([
  originalRealm.topic_image,
  originalRealm.infographic_image,
  originalRealm.pdf_preview_image
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

// Confirm we did not change other topics' image fields
const afterOthers = collectImageFields(source.topics)
  .filter((e) => e.id !== TOPIC_ID)
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();
if (JSON.stringify(beforeOthers) !== JSON.stringify(afterOthers)) {
  throw new Error('Other topics image fields were modified — abort');
}

// Confirm subtopics preserved
const node = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
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
const updated = findNode(node.topics, TOPIC_ID);
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

if (!updated.subtopics || updated.subtopics.length < 3) {
  throw new Error('Subtopics were not preserved');
}

// JSON parse sanity on heavy file
JSON.parse(fs.readFileSync(topicFile, 'utf8'));

if (originalRealm.report.includes('TODO')) {
  throw new Error('Report still contains TODO');
}

console.log(`Updated ${TOPIC_ID} topic file and breakdown-topics.json`);
console.log(
  'Images verified:',
  [
    originalRealm.topic_image,
    originalRealm.infographic_image,
    originalRealm.pdf_preview_image
  ].join(', ')
);
console.log(
  'Subtopics preserved:',
  updated.subtopics.map((s) => s.id).join(', ')
);
console.log('Videos:', updated.rumble_videos.length);
console.log('PDF:', updated.slide_deck_pdf_url);
console.log('is_placeholder: false (report has no TODO)');
console.log('Other topics image fields unchanged: ok');
