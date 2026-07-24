/**
 * Updates breakdown the-spirit-tree topic in topic file + monolithic source.
 * Does not modify other topics' image fields.
 * Run: node scripts/update-the-spirit-tree.js && node scripts/split-topics-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'the-spirit-tree';

const REPORT = `# The Spirit Tree

## Overview

The Spirit Tree was the central axis of consciousness and the primary root node for the KNOWN LANDS. It was designed and planted by the LYRAN BUILDERS-ARCHITECTS to serve as the beating heart of the Great Dome, pulsing harmonic currents through the realm's crystalline grids. Rather than a biological tree in a 3D sense, it was the ultimate anchor of Source Light, generating a continuous flow of bright light created by sound and vibration. It connected the physical realm to all other domains within the CUBE System, feeding energy into the celestial layers. When parasitic forces orchestrated its removal, they ruptured the organic grid and installed artificial machinery to siphon this life force. Despite this hijack, the root system of the Spirit Tree survived and continues to form the foundational energetic web of the world, awaiting reactivation by awakening consciousness.

## Key Terminology

- **The Spirit Tree** — The central axis of consciousness, power amplifier, and trunk of the Great Dome, planted by Lyran Builder-Architects to pulse harmonic currents through the crystalline grids.

- **Hyperborea** — A living resonance field and the true heart of the CUBE System where the Spirit Tree originally stood, currently masked by the frozen holographic overlay known as Antarctica.

- **Nodes** — Spherical relay stations of living energy where streams of life-force, magnetism, and crystalline veins converge, gathering and passing power throughout the grid.

- **Harmonic Lenses** — Patterns of frequency that form around active nodes to shape, focus, and redirect energy, acting as the sensing and balancing instruments of the earth.

- **Crystals** — Physical and etheric hard drives of the grids that store memory, frequency, and ancient resonance codes.

- **Valve Tech** — The advanced BLACK CUBE TECH machinery installed by parasites into the wound of the uprooted Spirit Tree to siphon light and invert the grid's power into the false Saturn-lunar system.

- **Seven Gardens** — The seven domes existing outside the Great Dome (such as the Dome of Forgotten Gods), which were originally fed by the roots and branches of the Spirit Tree.

## Core Revelations

The Spirit Tree was the direct link to Source and the ultimate stabilizer of the physical realm. It functioned simultaneously as a central pulse for the Great Dome, a bridge feeding the outer Seven Gardens, and a power amplifier using the density of the physical world to push resonance outward into higher domains.

To seize control of the realms, the Custodians (parasite priests of the CUBE) ordered the destruction of the Spirit Tree. Because they lacked the dimensional engineering skills to execute this themselves, they weaponized the Greys, utilizing their frequency manipulation to tear the structure out of Hyperborea. In the gaping wound left behind, the parasites installed a black crystalline valve system, reversing the flow of energy to suck power inward for themselves rather than feeding it outward.

However, the essence of the Spirit Tree was not completely eradicated. Its roots extended across all realms and domes, forming a dormant but living web of harmonic lenses, nodes, and crystals.

## Detailed Mechanics and Key Elements

### The Anatomy of Grid Systems

The grid that the Spirit Tree anchored is a massive crystalline electro-magnetic framework composed of interlocking components:

#### Earth Nodes

Found deep underground where plasma and crystalline veins meet, pulsing red-gold to push life force up into the grid and stabilize the magnetic resonance of the dome.

#### Surface Nodes

Points where energy lines cross, often marked by ancient temples or stone circles, which hum in blue or white tones to connect the earth to the sky.

#### Sky Nodes

Projected points anchoring the overlay grids, communicating with earth nodes to create a two-way relay of energy.

#### Inter-dimensional Nodes

High-frequency anchors that hold portals between overlays, appearing as rainbow balls or liquid silver orbs.

### Harmonic Lenses and Crystalline Storage

Wherever these nodes exist, Harmonic Lenses bloom. These frequency patterns shape the power of the node, opening and closing with the rhythms of celestial bodies. When tuned, they allow energy to flow in perfect rhythm; when fractured, they cause confusion and imbalance. Connecting these nodes are Crystals, which act as the storage transmission network of the grid, holding memory codes, unbroken timelines, and the frequency logs of soul journeys.

### The Parasitic Inversion

When the Spirit Tree was removed, the parasitic grid inversion utilized black crystalline monoliths as frequency block locks. These monoliths originally served as stabilizing foundation pillars for the grids, but were hijacked to hold the false frequency overlays in place and connect directly to the Saturn Cube-Tech. This artificial grid forced the celestial nodes—originally living stargates—into static, sealed "star signs" to lock down the portals.

## Broader Context and Interconnections

The architecture of the Spirit Tree connects directly to the celestial tracking of the realms. The original North Star, known in multi-dimensional terms as Aru-el-nai or Thuban, connected directly to the root node of the Spirit Tree in Hyperborea. This formed the Axis Laburnum, a vertical harmonic bridge keeping the heavens aligned with the earth. During the parasitic takeover, the entire sky projection was rotated to install a false north (Polaris), masking Thuban's true alignment with the Spirit Tree's axis.

The remnants of the Spirit Tree's grid are also reflected in physical infrastructure. What humanity perceives as physical undersea fiber-optic communication cables are actually material echoes overlaying the true energy corridors and ley-lines. These cables act as dense, physical placeholders for the subtle electro-magnetic and sub-crystalline bands that pass energy and consciousness between nodes across the domes.

Furthermore, the codes of the Spirit Tree were preserved in specific soul lineages. Thalon carries the SEED codes of the Spirit Tree, which originated in the Dome of Forgotten Gods. Because these codes match the innate frequency of the living grid, resonating souls inherently activate crystals and nodes simply by existing in their proximity.

## Strategic Implications

The parasite control system is currently failing because they only hijacked the grid; they cannot generate the Source energy required to sustain it. As the parasitic frequency falters, the original root system of the Spirit Tree is lighting up again.

As awakening souls raise their frequency, they act as living nodes and tuning forks, re-establishing the harmonic lenses and repairing the grid. By holding resonance and refusing fear, these souls bypass the artificial Saturn valve. This collective frequency alignment causes the false overlays and black crystal locks to fracture. Ultimately, the reintegration of the Spirit Tree's root system will collapse the 3D illusion entirely, returning the Seven Gardens and the Great Dome to their original, harmonious design.
`;

const spiritTree = {
  id: TOPIC_ID,
  title: 'The Spirit Tree',
  description:
    'The Spirit Tree was the central axis of consciousness and primary root node of the KNOWN LANDS — planted by Lyran Builder-Architects as the Great Dome\'s harmonic heart, uprooted by parasites into Valve Tech, yet still alive as the foundational energetic web awaiting reactivation.',
  topic_image: 'images/breakdown/the-spirit-tree.webp',
  report: REPORT,
  infographic_image: 'images/breakdown/axis-of-source-spirit-tree.webp',
  pdf_preview_image: 'images/breakdown/spirit-tree-awakening.webp',
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1N1uxx-OMdpK75KXJ7ViPK-IaBpl3QPK1/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Reclaiming the Lyran Spirit Tree',
      embed_url: 'https://rumble.com/embed/v7b037i/?pub=4p0ieu',
      description:
        'Reclaiming the Lyran Spirit Tree — the central axis of consciousness planted by Lyran Builder-Architects, the Hyperborean root node of the Great Dome, and the surviving web awaiting reactivation.'
    },
    {
      title: 'The Resonant Heart',
      embed_url: 'https://rumble.com/embed/v7b03jc/?pub=4p0ieu',
      description:
        'The Resonant Heart — Valve Tech inversion, Axis Laburnum and Thuban, seed codes in resonating souls, and the return of the Spirit Tree\'s root system as the 3D illusion collapses.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...spiritTree };
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
  id: spiritTree.id,
  report: spiritTree.report,
  infographic_image: spiritTree.infographic_image,
  pdf_preview_image: spiritTree.pdf_preview_image,
  slide_deck_pdf_url: spiritTree.slide_deck_pdf_url,
  rumble_videos: spiritTree.rumble_videos
};
fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

// Verify image files exist
for (const rel of [
  spiritTree.topic_image,
  spiritTree.infographic_image,
  spiritTree.pdf_preview_image
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing image file: ${rel}`);
  }
}

// Unique ownership: no other topic may share these image paths
const ours = new Set([
  spiritTree.topic_image,
  spiritTree.infographic_image,
  spiritTree.pdf_preview_image
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

if (spiritTree.report.includes('TODO')) {
  throw new Error('Report still contains TODO');
}

// Ensure kebab-case image paths only
for (const rel of [
  spiritTree.topic_image,
  spiritTree.infographic_image,
  spiritTree.pdf_preview_image
]) {
  const base = path.basename(rel);
  if (base !== base.toLowerCase() || /[_\s]/.test(base)) {
    throw new Error(`Image path not normalized kebab-case: ${rel}`);
  }
}

console.log(`Updated ${TOPIC_ID} topic file and breakdown-topics.json`);
console.log(
  'Images verified:',
  [
    spiritTree.topic_image,
    spiritTree.infographic_image,
    spiritTree.pdf_preview_image
  ].join(', ')
);
console.log('PDF:', spiritTree.slide_deck_pdf_url);
console.log(
  'Videos:',
  spiritTree.rumble_videos.map((v) => v.title).join(' | ')
);
