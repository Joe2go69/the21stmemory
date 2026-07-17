/**
 * Updates breakdown crystalline-architecture topic in topic file + monolithic source.
 * Does not modify other topics' image fields.
 * Run: node scripts/update-crystalline-architecture.js && node scripts/split-topics-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'crystalline-architecture';

const REPORT = `# Crystalline Architecture

## Overview

The foundation of all existence and physical reality operates upon a massive, interwoven Crystalline Electro-Magnetic Framework. Before the descent into physical density, creation existed purely as frequency states known as the Crystal Light-Worlds, where sound vibrated and organized into the very first structures of reality. Through the deliberate lowering of vibration, these light structures crystallized to form the Original Realm and the Great Dome, providing a physical training ground to expand thought and mastery. What is currently perceived as a dense, fragmented, and concrete world is entirely an illusion; the true environment is a single, vast Crystalline Temple obscured by a holographic Parasitic Overlay.

## Key Terminology

- **Crystal Light-Worlds** — The original frequency states existing before physicality, where sound vibrated and organized into the first structures of creation.

- **Crystalline Membranes** — The foundational grids formed when soul fields resonated together, weaving light lattices to hold the vision of creation stable.

- **Perception-Based Solidity** — A low-frequency holographic projection field that tricks the human nervous system into perceiving dead matter, such as concrete or steel, as hard, heavy, and permanent.

- **Solar Builders** — The ancient Lyran, Pleiadian, and Andromedan architects who designed the living light structures and grids of the physical realms.

- **Harmonic Lenses** — Crystalline patterns that form around active nodes, functioning as the sensory and relay organs of the earth to shape, balance, and transmit energy between realms.

- **Living Crafts** — Semi-conscious ships and transportation arks gestated from crystalline and plasmatic matter, which respond to telepathic intention rather than mechanical controls.

## Core Revelations

The physical layer of the Known Lands was not created as a trap, but as a Frequency Amplifier. Its crystalline architecture hums at specific octaves, echoing learned resonance upwards to feed and expand the higher light worlds. True matter is not built; it is grown and sung into existence through the mastery of tone. The modern 3D world is a hijacked projection where dead construction materials are utilized as anti-resonance anchors to drain consciousness. In moments of high resonance, these modern structures reveal their true nature as hollow, nearly transparent scaffolding of frequency. Beneath this false skin lies the unbroken, radiant architecture of the original builders, waiting to be fully revealed.

## Detailed Mechanics and Key Elements

### The Genesis of Form

Creation follows a precise mechanical pathway: Sound generates structure, which folds into Light to create vision, which finally crystallizes into physical form.

### True Sol Architecture

Also known as Atlantian or Tartarian architecture, true building relies on flowing, harmonic geometry perfectly aligned to planetary resonance. Real construction materials are living conductors: Stone, Crystal, Granite, Frequency Bricks (red bricks), Copper Domes, and Quartz Inlay. Geometric shapes such as arches, domes, spirals, and Star Forts act as massive sound bowls that pull cosmic current into the ground grids and amplify frequency.

### Parasite 3D Architecture

The parasitic construct utilizes boxes, flat roofs, and sharp right angles to deliberately break natural harmonics. Materials like concrete, steel, plastic, and synthetic glass act as dead frequency holders. Structures like schools, offices, and hospitals are strategically built as anti-resonance cages to cause fatigue, disconnection, and anxiety.

### Crystals as Universal Hard Drives

Crystals function as both physical and etheric hard drives for the entire grid network. They store memory, frequency, and ancient Source Codes. Planetary Crystals hum deep within the earth's core, while Surface Crystals (quartz veins, mountains, and rivers) act as antennas. Hidden Placed Crystals were seeded across the lands by Starseed Families to serve as activation keys.

### Healing Sanctuaries

Advanced healing occurs within pure frequency spaces built from light, sound, and living crystal. Crystal Halls (often overlaid by modern cathedrals and churches) feature living crystal walls, glowing Rainbow Fractals, and crystal slabs that hum with harmonic frequency to realign the light body grid and dissolve parasitic mind control.

## Broader Context and Interconnections

The crystalline architecture extends far beyond the surface terrain. The heavens themselves are part of this living lattice. Star-Nodes—what the unawakened view as distant burning suns—are actually multidimensional data crystals storing codes and frequency templates for the projection overlays. These celestial nodes anchor the background projections and act as literal gates and portals between realms like Tara, Andromeda, and Lyra.

Below the surface, the Sub-Crystalline Band passes energy faster than any wire, linking continents that are in reality just layered frequency fields within the Cube Containment. The entire ecosystem is connected to the Spirit Tree, the central axis node of the Great Dome, whose root system forms the web of harmonic lenses and crystals that power the seven outer domes.

## Strategic Implications

As the frequency of the realm continues to rise, the parasitic projection grid is actively fracturing. The removal of this overlay will not result in humanity "building back," but rather "revealing back". The true original realm will be uncovered: smooth crystalline grounds, natural walking paths, and pristine Crystalline Coastlines. Structures unaligned with the restored frequency—such as corporate buildings, traffic lights, and tarmac—will lose their anchor and vanish.

Resonating Sols must recognize that they are constantly walking across a living, humming architecture. By touching ancient sites, feeling the pulse of the grids, and holding their internal resonance, awakened beings act as living lenses themselves, amplifying the crystalline network and accelerating the total frequency collapse of the 3D density construct.
`;

const crystallineArchitecture = {
  id: TOPIC_ID,
  title: 'Crystalline Architecture',
  description:
    'Crystalline Architecture is the living electro-magnetic framework of reality — Crystal Light-Worlds crystallized into the Original Realm and Great Dome, true Sol (Atlantian/Tartarian) geometry versus parasitic 3D cages, crystals as hard drives, and the reveal of the Crystalline Temple beneath the holographic overlay.',
  topic_image: 'images/breakdown/crystalline-architecture.webp',
  report: REPORT,
  infographic_image: 'images/breakdown/the-crystalline-blueprint-of-reality.webp',
  pdf_preview_image: 'images/breakdown/awakening-the-crystal-light-worlds.webp',
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1KeltmeK1prTb8ZvOfgmbKTGytVVOAYSd/view?usp=sharing',
  rumble_videos: [
    {
      title: 'The Living Crystalline Matrix Beneath Us',
      embed_url: 'https://rumble.com/embed/v7ao300/?pub=4p0ieu',
      description:
        'The living crystalline matrix beneath us — how the Crystalline Electro-Magnetic Framework, Crystal Light-Worlds, and Frequency Amplifier design structure physical reality under the parasitic overlay.'
    },
    {
      title: 'The Living Lattice',
      embed_url: 'https://rumble.com/embed/v7ao3hi/?pub=4p0ieu',
      description:
        'The Living Lattice — true Sol architecture, crystals as universal hard drives, Star-Nodes, Sub-Crystalline Band, and the reveal of the Crystalline Temple as the overlay fractures.'
    }
  ]
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...crystallineArchitecture, is_placeholder: false };
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
  id: crystallineArchitecture.id,
  report: crystallineArchitecture.report,
  infographic_image: crystallineArchitecture.infographic_image,
  pdf_preview_image: crystallineArchitecture.pdf_preview_image,
  slide_deck_pdf_url: crystallineArchitecture.slide_deck_pdf_url,
  rumble_videos: crystallineArchitecture.rumble_videos
};
fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

// Verify image files exist
for (const rel of [
  crystallineArchitecture.topic_image,
  crystallineArchitecture.infographic_image,
  crystallineArchitecture.pdf_preview_image
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing image file: ${rel}`);
  }
}

// Unique ownership: no other topic may share these image paths
const ours = new Set([
  crystallineArchitecture.topic_image,
  crystallineArchitecture.infographic_image,
  crystallineArchitecture.pdf_preview_image
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

// JSON parse sanity on heavy file
JSON.parse(fs.readFileSync(topicFile, 'utf8'));

// Report must not look like a placeholder
if (crystallineArchitecture.report.includes('TODO')) {
  throw new Error('Report still contains TODO');
}

console.log(`Updated ${TOPIC_ID} topic file and breakdown-topics.json`);
console.log(
  'Images verified:',
  [
    crystallineArchitecture.topic_image,
    crystallineArchitecture.infographic_image,
    crystallineArchitecture.pdf_preview_image
  ].join(', ')
);
console.log('is_placeholder: false (report has no TODO)');
console.log('Other topics image fields unchanged: ok');
