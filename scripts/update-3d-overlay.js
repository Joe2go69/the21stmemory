/**
 * Updates breakdown 3d-overlay topic in topic file + monolithic source.
 * Run: node scripts/update-3d-overlay.js && node scripts/split-topics-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const REPORT = `# 3D Overlay

## Overview

The architecture of existence is a digitalized, simulated environment contained within the CUBE Containment, a massive crystalline electro-magnetic framework. Within this framework, all lands, seas, and skies exist as interwoven layers vibrating at different frequencies, entirely masking the true reality from ordinary perception. The 3D Overlay, also known as the Parasitic Overlay, is a false skin of holographic camouflage projected over these original living crystalline structures. It acts as a perceptual prison that limits consciousness to a dense, isolated experience by manipulating sight, sound, and touch. As cosmic frequencies rise, this artificial construct is undergoing a total frequency collapse, revealing the vibrant, multi-dimensional truth beneath.

## Key Terminology

- **CUBE Containment** — One massive crystalline electro-magnetic framework functioning as a hard drive that runs all maps, overlays, grids, and domes.

- **Great Dome** — The central physical training ground and frequency amplifier containing 178 physical worlds, built from solid frequency to teach the mastery of thought.

- **Parasitic Overlay** — A holographic illusion grid and false skin projected over reality to manipulate human perception, rendering dead materials as solid and hiding the true crystalline world.

- **Crystal Light-Worlds** — Pre-physical frequency states where sound vibrates and organizes into light lattices, creating the first spark of vision and creation before density.

- **NPCs** — Background programs and non-player characters functioning as fragments of light to hold the simulation together, completely devoid of a true soul spark.

- **Known Lands** — The central physical realm within the Great Dome, currently masked by the 3D Overlay but inherently designed as a massive crystalline temple.

## Core Revelations

**Creation through Frequency:** All physicality begins as Sound vibrating into Light, which then folds into vision and finally solidifies into form. Physical matter is simply sound woven into light that has been crystallized into a lower frequency.

**Perception-Based Solidity:** The hardness of materials like brick, concrete, metal, and glass is entirely an illusion. It is a perception-based solidity composed of low-frequency matter overlaid by holographic projection fields. In higher resonance, these structures appear as hollow, see-through scaffolding.

**The Illusion of Distance and Travel:** Geography, as depicted on world maps, is a fabricated perception overlay. Countries are simulated cells stacked on top of one another. Travel via planes or ships is merely an optical illusion; vehicles act as props gliding through frequency corridors while the system renders the destination, enforcing the false concepts of distance and separation.

**Parasitic Hijack:** Parasitic entities cannot generate the spark of creation; they can only hijack existing grids. They buried the original crystalline grid of the world under deserts, oceans, and cities, turning ancient nodes into parasitic circuit boards backed by manipulated human perception.

## Detailed Mechanics and Key Elements

**The Anatomy of the CUBE and Domes:** The CUBE contains eight primary layered Domes, including the Dome of Forgotten Gods (the origin chamber), Dome of Titans, and the Great Dome itself. Movement between these realms is accomplished by shifting frequency through a Portal, gateway, or vortex, rather than traveling physical miles.

**Sensory Manipulation:** The 3D Overlay actively modulates the signals received by the skin and eyes. It tricks the nervous system into perceiving synthetic geometry (sharp right angles, flat roofs, concrete) as heavy and fixed, actively draining energy to keep consciousness boxed in.

**Hyperborea and the Spirit Tree:** The central axis of the Known Lands was the Spirit Tree, a direct link to Source located in Hyperborea. When the parasites removed the tree, they inserted Black Cube Tech as a frequency valve linked to the Saturn Grid, a primary artificial intelligence hub used to siphon light and enforce the reincarnation loop.

**Harmonic Lenses and Nodes:** The true grid operates through crystalline nodes and harmonic lenses, which are junction points of energy. Sacred sites, stone circles, and river bends are cloaked crystalline structures humming with living energy. The overlay filters and dampens this frequency so that sleepers see only dirt or ruins.

## Broader Context and Interconnections

**The Original Builders:** The foundations of the Known Lands were established by the Lyran Lineage, Pleiadians, Andromedans, and Pollarians. These solar architects designed a high-vibrational, telepathic ecosystem where buildings grew like crystal forests and clothing adapted to biological frequency.

**The Fall to Parasitic Control:** Ancient overseers known as the Custodians slowly corrupted their mission of guarding balance, seeking instead to harvest emotion and attention (loosh). They orchestrated a treaty with the Anunnaki, Draconians, Greys, and Niburians to co-manage the Known Lands as a shared farm for energy harvesting and genetic manipulation.

**Celestial Inversion:** The true function of the Sun and Moon was completely hijacked. The Sun, originally a multi-banded crystalline stargate for entering and exiting the Domes, was overlaid with an amnesia vortex designed to strip memory codes. The Moon was inverted from a resting and healing hall into a trap system that erases memories and imposes karmic loops.

## Strategic Implications

**Frequency Collapse:** The 3D Overlay is not being destroyed by physical demolition, but by frequency collapse. As Resonating Sols raise their vibration and hold their harmonic tone, the parasitic scaffolding flickers, glitches, and ultimately shatters.

**The Second Realm Revealed:** As the illusion drops, the underlying Second Realm will become visible—a vibrant reality of clean air, crystalline coastlines, and ancient city structures running purely on free energy.

**The Split in Experience:** When the fracture occurs, the reality experienced will depend strictly on frequency. Awakened souls will see the immediate return of the vibrant crystalline world. NPCs and those deeply entrenched in denial will be stuck in a decaying, hollow version of the 3D illusion, perceiving only rubble and the disappearance of their synthetic wealth and infrastructure.

**The Final Extraction:** During the orchestrated global trigger events (including a staged World War III and a fake alien invasion via Project Bluebeam), true extraterrestrial craft will phase in through the correct frequency bands. Resonating Sols will bypass the Vatican amnesia filters and experience a seamless frequency phase-out, returning to their original Light-Worlds and solar families.
`;

const updates = {
  title: '3D Overlay',
  description:
    'The 3D Overlay (Parasitic Overlay) is a holographic false skin projected over living crystalline structures within the CUBE — masking true reality through perception-based solidity, frequency corridors, and sensory manipulation until frequency collapse reveals the Second Realm.',
  topic_image: 'images/breakdown/3d-overlay.webp',
  report: REPORT,
  infographic_image: 'images/breakdown/collapse-of-parasitic-overlay.webp',
  pdf_preview_image: 'images/breakdown/shattering-the-3d-overlay.webp',
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1fSp6ssQ9dAbDk1C2x3x_ZP6zvjC5Ykuj/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Shattering the 3D parasitic overlay',
      embed_url: 'https://rumble.com/embed/v7agu0m/?pub=4p0ieu',
      description:
        'How the 3D parasitic overlay fractures under rising frequency, exposing the holographic camouflage over the living crystalline world.'
    },
    {
      title: 'Beyond the Hologram',
      embed_url: 'https://rumble.com/embed/v7agucu/?pub=4p0ieu',
      description:
        'What lies beyond the hologram — the Second Realm, crystalline truth, and the frequency path out of the 3D overlay prison.'
    }
  ]
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === '3d-overlay') {
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
  throw new Error('3d-overlay topic not found in breakdown-topics.json');
}

fs.writeFileSync(sourceFile, JSON.stringify(source, null, 2) + '\n', 'utf8');

const topicFile = path.join(ROOT, 'data', 'breakdown-topics', '3d-overlay.json');
const heavy = {
  id: '3d-overlay',
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

const node = findNode(
  JSON.parse(fs.readFileSync(sourceFile, 'utf8')).topics,
  '3d-overlay'
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

// Ensure we did not alter alice image paths or unrelated breakdown image refs
const aliceSim = path.join(ROOT, 'data', 'alice-topics', 'simulation-reality.json');
if (fs.existsSync(aliceSim)) {
  const alice = JSON.parse(fs.readFileSync(aliceSim, 'utf8'));
  if (alice.pdf_preview_image !== 'images/3d-overlay-pdf.webp') {
    throw new Error('Unexpected change to alice simulation-reality pdf path');
  }
}

console.log('Updated 3d-overlay topic file and breakdown-topics.json');
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
