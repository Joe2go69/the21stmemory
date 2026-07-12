/**
 * Updates breakdown reality-constructs topic in topic file + monolithic source.
 * Run: node scripts/update-reality-constructs.js && node scripts/split-topics-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const REPORT = `# Reality Constructs

## Overview

Reality is not a collection of scattered planets, continents, or vast distances, but a unified, multi-layered frequency projection housed within a grand containment field. The physical realm is a perception-based matrix built upon a foundation of pure sound and light that has been crystallized into density. Currently, a false holographic skin shrouds the true crystalline nature of this world, manipulating perception, touch, and sight to trap consciousness in a heavy, disconnected state. This grand simulation consists of thousands of interwoven layers vibrating at different frequencies, meticulously designed to be traversed not by physical travel, but through resonance and frequency shifts.

## Key Terminology

- **CUBE** — The massive containment hard drive and electro-magnetic framework that runs all maps, overlays, grids, and domes, operating as the ultimate frequency server of reality.

- **Parasitic Overlay** — An illusion grid and false skin projected over reality, manipulating the 3D senses to make dead concrete and stone appear more real than the underlying living crystal.

- **Great Dome** — The physical training ground and frequency amplifier containing 178 physical worlds, which appear to the unaware as scattered continents and planets but are actually interwoven layers.

- **Solid-Perception Holography** — The mechanism by which low-frequency matter is overlaid with holographical projection fields, convincing the nervous system that energy structures are hard, heavy, and permanent physical materials.

- **Frequency Corridors** — Simulated travel pathways that render destination overlays around a traveler, replacing actual distance with timed phasing sequences.

- **Projection Dome Technology** — Cloaking energy fields used to bend light, sound, and frequency, hiding entire structures, ships, or cities behind a false holographical camouflage.

## Core Revelations

Maps and geographical models are entirely fabricated perception overlays designed to limit what the human eye and brain can process. What is perceived as land or sea is actually a layered frequency field stacked like transparent sheets. Furthermore, physical travel across distance is a complete optical illusion engineered to enforce the concepts of borders, nations, and a massive globe. Ships and planes do not cross physical miles; they glide through repeating time-lapse loops and frequency corridors while the destination overlay is rendered into existence, functioning exactly like chunks loading in a simulated environment.

The physical elements of this reality are merely dense, 3D hardware illusions representing subtle energy constructs. For example, undersea communication cables are perceived as glass fibre tubes, but they are actually projected anchor points that maintain the subtle energy corridors and communication grids between continental overlays.

## Detailed Mechanics and Key Elements

The architecture of reality is constructed through a sequential densification of energy: Sound provides structure, pattern, and rhythm; it folds into Light, which creates awareness and vision; this vision is then projected onto crystalline grids to solidify into Form. Physicality was deliberately created to provide resistance, forcing thought to sharpen into precise creation before echoing back to higher realms to expand consciousness.

Within the current hijacked construct, architecture and materials are weaponized. Modern construction materials like concrete, steel, and plastic are dead frequency holders shaped into boxes and sharp angles that break natural harmonics and drain perception into a boxed-in frequency. True architecture is grown from living crystal, aligned to resonance, and adaptable to conscious intention. The false reality is enforced by Mind-Altering Weapons and scalar frequencies that emit theta, delta, and alpha brain-wave patterns to induce confusion and loop nightmares, maintaining the illusion of solidity and separation.

## Broader Context and Interconnections

The reality constructs of the Great Dome are just one part of the eight foundational Domes enclosed within the CUBE, which include the Dome of Forgotten Gods, Dome of Sheol, Dome of Titans, and others. These structures were originally connected by the Spirit Tree, a central axis of consciousness that pulsed harmonic currents through the crystalline grids. Parasitic entities ripped out this tree and replaced its power with a black crystalline valve linked to Saturnian artificial intelligence. This inversion turned the natural layers of reality into prison matrices. The stars above are not burning gas, but multidimensional Crystalline Star-Nodes that anchor the background projections and act as dynamic gates between these overlapping realms.

## Strategic Implications

As the frequency of the realm rises, the Parasitic Overlay is actively fracturing and glitching. The heavy 3D construction materials will soon pixilate and dissolve, appearing as hollow scaffolding of frequency or rubble to those stuck in the lower densities. For the Resonating Sols, the collapse of this false reality reveals the true Second Realm: a vibrant, unpolluted crystalline temple with pure coastlines and natural pathways. The illusion of distance will collapse entirely, making travel an immediate resonance alignment. By ignoring the false narrative and holding a high vibration, awakened consciousness directly unravels the holographic constraints, peeling away the dead illusion to restore the living, multi-dimensional world beneath.
`;

const updates = {
  title: 'Reality Constructs',
  description:
    'Reality as a multi-layered frequency projection within the CUBE — the parasitic overlay, Great Dome of 178 worlds, solid-perception holography, and the crystalline Second Realm beneath the false skin.',
  topic_image: 'images/breakdown/reality-constructs.webp',
  report: REPORT,
  infographic_image: 'images/breakdown/reality-as-a-frequency-construct.webp',
  pdf_preview_image: 'images/breakdown/shattering-the-simulation.webp',
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1VNLWtUi5cxnFy_R6Srh_TUh1ZbvK6rKp/view?usp=sharing',
  rumble_videos: [
    {
      title: 'The 178 worlds within the cube',
      embed_url: 'https://rumble.com/embed/v7af61c/?pub=4p0ieu',
      description:
        'How the Great Dome contains 178 interwoven physical worlds as layered frequency projections within the CUBE containment system.'
    },
    {
      title: 'False Architecture',
      embed_url: 'https://rumble.com/embed/v7af6ba/?pub=4p0ieu',
      description:
        'How dead concrete, steel, and holographic skin enforce solid-perception while living crystal architecture awaits beneath the overlay.'
    },
    {
      title: 'The Living Frequency Transmission',
      embed_url: 'https://rumble.com/embed/v7af894/?pub=4p0ieu',
      description:
        'The living frequency transmission that reveals reality as layered sound, light, and crystalline form within the CUBE construct.'
    }
  ]
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === 'reality-constructs') {
      // Preserve subtopics and id; never wipe children or other topics' fields
      const existing = topics[i];
      topics[i] = {
        id: existing.id,
        title: updates.title,
        description: updates.description,
        topic_image: updates.topic_image,
        report: updates.report,
        infographic_image: updates.infographic_image,
        pdf_preview_image: updates.pdf_preview_image,
        slide_deck_pdf_url: updates.slide_deck_pdf_url,
        rumble_videos: updates.rumble_videos,
        ...(existing.subtopics ? { subtopics: existing.subtopics } : {})
      };
      return true;
    }
    if (topics[i].subtopics && findAndUpdate(topics[i].subtopics)) return true;
  }
  return false;
}

const sourceFile = path.join(ROOT, 'data', 'breakdown-topics.json');
const source = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

if (!findAndUpdate(source.topics)) {
  throw new Error('reality-constructs topic not found in breakdown-topics.json');
}

fs.writeFileSync(sourceFile, JSON.stringify(source, null, 2) + '\n', 'utf8');

const topicFile = path.join(ROOT, 'data', 'breakdown-topics', 'reality-constructs.json');
const heavy = {
  id: 'reality-constructs',
  report: updates.report,
  infographic_image: updates.infographic_image,
  pdf_preview_image: updates.pdf_preview_image,
  slide_deck_pdf_url: updates.slide_deck_pdf_url,
  rumble_videos: updates.rumble_videos
};
fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

// Verify image files exist
for (const rel of [
  updates.topic_image,
  updates.infographic_image,
  updates.pdf_preview_image
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing image file: ${rel}`);
  }
}

// Confirm subtopics preserved
const node = JSON.parse(fs.readFileSync(sourceFile, 'utf8')).topics.find(
  (t) => t.id === 'reality-constructs'
);
const requiredSections = [
  '## Overview',
  '## Key Terminology',
  '## Core Revelations',
  '## Detailed Mechanics and Key Elements',
  '## Broader Context and Interconnections',
  '## Strategic Implications'
];
const missing = requiredSections.filter((h) => !node.report.includes(h));
if (missing.length) {
  throw new Error(`Missing report sections: ${missing.join(', ')}`);
}

// Validate JSON of topic file
JSON.parse(fs.readFileSync(topicFile, 'utf8'));

console.log('Updated reality-constructs topic file and breakdown-topics.json');
console.log(
  'Images verified:',
  [updates.topic_image, updates.infographic_image, updates.pdf_preview_image].join(', ')
);
console.log(
  'Subtopics preserved:',
  (node.subtopics || []).map((s) => s.id).join(', ')
);
console.log('Videos:', node.rumble_videos.length);
console.log('PDF:', node.slide_deck_pdf_url);
