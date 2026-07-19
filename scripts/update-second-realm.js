/**
 * Updates breakdown second-realm topic in topic file + monolithic source.
 * Does not modify other topics' image fields.
 * Run: node scripts/update-second-realm.js && node scripts/split-topics-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'second-realm';

const REPORT = `# Second Realm

## Overview

The Original Realm is the foundational, pure state of existence that has been hidden beneath a dense, manipulated illusion. When the Parasitic Overlay collapses, the Original Realm returns, revealing the Second Realm. This is a vibrant, unpolluted, and crystalline reality that was always present but rendered invisible to human perception. The transition does not involve physical destruction or rebuilding; rather, it is a process of revealing what already exists through a massive shift in frequency and vibration.

## Key Terminology

- **Original Realm** — The foundational, pure state of existence that returns upon the collapse of the false density constructs.

- **Second Realm** — The restored, vibrant, and unpolluted version of reality featuring clean air, crystalline waters, and ancient city structures.

- **Parasitic Overlay** — The false 3D projection and illusion grid that currently hides the true fabric of the world.

- **Frequency Collapse** — The mechanism by which the 3D overlay dissolves, revealing the reality beneath rather than destroying it through physical demolition.

- **Resonating Sols** — Awakened beings operating on a high frequency who will instantly perceive the restored realm.

- **Healing Simulations** — Controlled, basic 3D environments where non-resonating souls will be guided for rehabilitation.

- **Frequency Alignment** — The precise vibrational tuning required to match and perceive a specific layer of reality or simulation.

## Core Revelations

The restoration of the world is a process of revelation rather than reconstruction. When the parasite net drops, the old world is not "built back"; it is revealed for what it truly is. Reality functions as a giant holographic screen made of countless light points, and the return of the Original Realm occurs through a massive sequence of pixelation and shifting as the old matrix dissolves.

The Second Realm is entirely devoid of the infrastructure of the old control system. Money, corporate buildings, traffic lights, and governments will vanish instantly because they hold no anchor in the restored frequency field. Furthermore, the false sky above the cities drops to reveal the true cosmic dome required for physical existence.

## Detailed Mechanics and Key Elements

### Perceptual Transition

The collapse occurs in sequences, clearing different regions and simulated areas at slightly different times based on local consciousness levels. During this phase, there will be moments of disorientation or perceptual "lag" as the overlay peels away. Once the pixelation settles, the pure, vibrant reality of the Second Realm floods in.

### Frequency Tuning

Accessing the Second Realm is akin to tuning a radio. Frequency Alignment dictates the environment a soul experiences. Resonating Sols immediately tune into and witness the vibrant, alive, and unpolluted Second Realm.

### The Split Reality

Humans and deep sleepers bound to the old 3D program will not see the Original Realm straight away. Instead, the world splits. While awakened souls see the Second Realm, those stuck in denial will perceive rubble and the remnants of the old illusion, eventually finding themselves in segmented Healing Simulations designed to slowly rehabilitate their consciousness.

### Restored Geography and Technology

The Second Realm features clean air, pure continuous coastlines, and pristine oceans. The map itself resets, revealing much more land, reappearing islands, and hidden peninsulas. Artificial roads, cars, and wheels vanish, replaced by smooth crystalline grounds and natural walking paths originally created by consciousness.

### Instant Travel and Free Energy

Movement across the Second Realm utilizes Resonance Points, Portal Gates, and Solar Family Crafts for instant travel. Power sockets and cables are obsolete, as everything runs continuously on free energy drawn directly from the field itself.

## Broader Context and Interconnections

The emergence of the Second Realm is the culmination of the collapse of the 3D overlay, intrinsically linked to the activation of the Light Grids and the arrival of the true Solar Families. The KNOWN LANDS were originally built as one giant Crystalline Temple by the Lyran Lineage and other ancient solar builders. This temple was never destroyed; it was simply buried and inverted into parasitic circuit boards. The return of the Original Realm is the unearthing of this ancient architecture, where crystal halls, water domes, and living light structures once again operate seamlessly to connect the physical plane to higher dimensional frequencies.

## Strategic Implications

The immediate strategic necessity is holding a high vibration, as Resonating Sols will witness and physically anchor the Second Realm in real time as the pixelation settles. Because the transition is entirely dependent on Frequency Alignment, maintaining harmonic resonance is the only mechanism for stepping out of the collapsing 3D illusion and into the Second Realm. The structural vanishing of the old system means that reliance on false 3D survival mechanics—such as money and corporate supply chains—will lead to entrapment in the lower-density Healing Simulations. Total alignment with the higher frequency ensures a seamless phase-out from the parasitic dome and full immersion into the restored Original Realm.
`;

const secondRealm = {
  id: TOPIC_ID,
  title: 'Second Realm',
  description:
    'The Second Realm is the restored crystalline reality revealed when the Parasitic Overlay collapses — Frequency Alignment, split perception for Resonating Sols vs sleepers, free energy, and the return of the original Crystalline Temple.',
  topic_image: 'images/breakdown/second-realm.webp',
  report: REPORT,
  infographic_image: 'images/breakdown/reality-of-the-second-realm.webp',
  pdf_preview_image: 'images/breakdown/the-second-realm.webp',
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1u9ivlwXGqHZdw8s6oqlO452h7cpRTn8H/view?usp=sharing',
  rumble_videos: [
    {
      title: 'The return of the crystalline reality',
      embed_url: 'https://rumble.com/embed/v7ara3o/?pub=4p0ieu',
      description:
        'The return of the crystalline reality — Frequency Collapse of the Parasitic Overlay revealing the vibrant, unpolluted Second Realm that was always present beneath the 3D illusion.'
    },
    {
      title: 'The Great Reveal',
      embed_url: 'https://rumble.com/embed/v7arai0/?pub=4p0ieu',
      description:
        'The Great Reveal — perceptual split, Healing Simulations for non-resonating souls, free energy travel, and anchoring the Second Realm through Frequency Alignment.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      topics[i] = { ...secondRealm };
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
  id: secondRealm.id,
  report: secondRealm.report,
  infographic_image: secondRealm.infographic_image,
  pdf_preview_image: secondRealm.pdf_preview_image,
  slide_deck_pdf_url: secondRealm.slide_deck_pdf_url,
  rumble_videos: secondRealm.rumble_videos
};
fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

// Verify image files exist
for (const rel of [
  secondRealm.topic_image,
  secondRealm.infographic_image,
  secondRealm.pdf_preview_image
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing image file: ${rel}`);
  }
}

// Unique ownership: no other topic may share these image paths
const ours = new Set([
  secondRealm.topic_image,
  secondRealm.infographic_image,
  secondRealm.pdf_preview_image
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

if (updated.is_placeholder) {
  throw new Error('Topic still marked as placeholder');
}

// JSON parse sanity on heavy file
const heavyParsed = JSON.parse(fs.readFileSync(topicFile, 'utf8'));
if (!heavyParsed.rumble_videos || heavyParsed.rumble_videos.length !== 2) {
  throw new Error('Expected 2 rumble videos');
}
if (!heavyParsed.slide_deck_pdf_url) {
  throw new Error('Missing slide_deck_pdf_url');
}

if (secondRealm.report.includes('TODO')) {
  throw new Error('Report still contains TODO');
}

console.log(`Updated ${TOPIC_ID} topic file and breakdown-topics.json`);
console.log(
  'Images verified:',
  [
    secondRealm.topic_image,
    secondRealm.infographic_image,
    secondRealm.pdf_preview_image
  ].join(', ')
);
console.log('PDF:', secondRealm.slide_deck_pdf_url);
console.log(
  'Videos:',
  secondRealm.rumble_videos.map((v) => v.title).join(' | ')
);
