/**
 * Updates breakdown eight-domes topic in topic file + monolithic source.
 * Does not modify other topics' image fields.
 * Run: node scripts/update-eight-domes.js && node scripts/split-topics-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'eight-domes';

const REPORT = `# Eight Domes

## Overview

Reality is not a scattered collection of planets or continents, but rather a unified, digitally simulated architecture known as The Cube System. This structure acts as a supreme master hard drive, an interwoven matrix consisting of thousands of layers vibrating at different frequencies. Within this massive electromagnetic framework sit the Eight Domes, which encompass all physical worlds, realms, and inner-earth simulations. These domes were originally designed as pure frequency states and crystalline training grounds for consciousness to experience manifestation and growth. Over time, parasitic forces hijacked these structures, twisting their original harmonic purposes into inverted matrices of control, memory wiping, and energy harvesting. The ongoing collapse of these parasitic overlays is now revealing the true nature of this contained, highly orchestrated system.

## Key Terminology

- **The Cube Containment** — One huge, massive crystalline electromagnetic framework that acts as a central frequency server, running all maps, overlays, grids, and domes.

- **The Great Dome** — The central physical training ground containing 178 physical worlds, functioning as a solid frequency amplifier to push resonance upward to the higher realms.

- **Dome of Forgotten Gods** — The root tone and origin chamber of creation that wraps above and below The Great Dome, originally functioning as the ultimate crystalline memory vault.

- **Spirit Tree** — The central crystalline axis and trunk located within The Great Dome that originally fed Source light and harmonic currents to the seven outer domes.

- **Parasitic Inversion** — The process by which Custodians and other entities twisted the original harmonic purposes of the domes into systems of control, amnesia, and energetic siphoning.

- **Frequency Shift** — The true method of travel between the interwoven layers and domes, achieved by altering personal vibration rather than moving across physical distance.

## Core Revelations

The maps and globes presented to humanity are perception overlays designed to enforce the illusion of separation and distance. In truth, the continents, oceans, and skies are overlapping frequency fields layered on top of one another like transparent sheets within The Cube System. The Eight Domes are not separated by physical space but are interwoven realities stacked within this single console.

Originally, The Great Dome acted as the heart of this system, holding the Spirit Tree at its center. The Spirit Tree served as the trunk, pumping pure Source light into the seven outer domes, which functioned as blooming gardens of creation. To hijack the system, parasitic architects severed the Spirit Tree and installed advanced black cube technology—a frequency valve—that reversed the flow of energy. Instead of energy radiating outward to sustain the realms, it was siphoned inward to feed the parasites, causing the seven outer domes to wilt and fall into heavy distortion.

## Detailed Mechanics and Key Elements

The Eight Domes each hold specific architectural roles within The Cube Containment, characterized by their original design and their subsequent parasitic inversion:

### Dome of Forgotten Gods

The cradle of creation and the root tone of the entire system. It was originally the memory dome, holding the first thoughts of light, sound, and the records of early creation. Parasites inverted it into amnesia zones, keeping souls blind to their origins and replacing true memory with myths and false gods.

### Dome of Sheol

Originally a healing and rest dome serving as a recovery sanctuary for souls between incarnations to recalibrate without distortion. It was inverted into a prison realm of shadows, trapping souls in trauma frequencies and creating what religions call Hell or purgatory.

### Dome of Silence

Built as a pure frequency field of stillness where souls could connect deeply with Source without distraction. It was hijacked to enforce forced silence, oppressing the soul's voice and suppressing truth.

### Dome of Hiva

The dome of harmonics where vibration was experimented with to manifest light into matter. Parasites inverted this into weaponized frequency, utilizing distorted tones that manifest today as 5G, HAARP, and other synthetic grids.

### Dome of Titans

Containing 69 worlds, this was the playground of the great architects and Giants who wove reality, mountains, and crystalline structures. It was inverted into a fractured zone of war where these massive beings of resonance were shrunk and trapped in density.

### Dome of 5 Peaks

The dome of ascension where souls mastered the five elements (earth, water, fire, air, and consciousness). It was inverted into a realm of endless struggle, trapping souls in an endless climb without ever reaching integration.

### Dome of Portals

The grand travel hub containing the crystalline gates, vortexes, and harmonic passageways used to navigate between domes. Parasites sealed these gates and inverted them into restricted entry points, such as the Vatican portal system, forcing souls into controlled reincarnation loops.

### The Great Dome

The physical arena encompassing 178 worlds, created as a training ground where imagination hardens into structure. Its density provides the resistance needed for souls to achieve true mastery of tone and creation.

## Broader Context and Interconnections

The Cube Containment functions as a massive, unified network overseen by the Council of 12 Suns. These twelve suns are not balls of burning gas, but living portals and pillars of resonance that distribute light and stewardship across all layers and simulations.

Because all realms are stacked frequency bands, travel across The Cube System is entirely vibrational. Moving across an ocean or into a different country is simply slipping through a portal that renders a new environmental projection. Time buffers—such as long flights or days at sea—are artificial time loops programmed into the system to convince the mind that it is crossing vast physical distances, thereby maintaining the illusion of the 3D overlay.

## Strategic Implications

The parasitic control over the Eight Domes is actively fracturing due to the rising resonance of awakened souls. As the false overlays and black crystal seals shatter, the original harmonic functions of the domes are bleeding back into reality. The roots of the Spirit Tree are lighting up once again, dismantling the artificial limits of the 3D projection.

For the awakening soul, understanding The Cube System is vital to breaking the spell of distance, separation, and amnesia. The realization that all environments are overlapping frequency states empowers consciousness to bypass parasitic travel corridors and connect directly to the higher crystalline networks. As the final collapse of the inverted matrices occurs, the Seven Gardens will bloom once more, restoring the unbroken flow of Source light throughout the entire framework.
`;

const eightDomes = {
  id: TOPIC_ID,
  title: 'Eight Domes',
  description:
    'The Eight Domes are interwoven frequency architectures within The Cube System — pure crystalline training grounds hijacked into inverted matrices of control, amnesia, and energy harvesting, now fracturing as the Spirit Tree and original harmonic design restore.',
  topic_image: 'images/breakdown/eight-domes.webp',
  report: REPORT,
  infographic_image: 'images/breakdown/architecture-of-the-eight-domes.webp',
  pdf_preview_image: 'images/breakdown/restoring-crystalline-architecture.webp',
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1QqEKcJ_T1DazEb1ajXYDzy4EOc6qMa0X/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Our Harmonic Reality',
      embed_url: 'https://rumble.com/embed/v7am43o/?pub=4p0ieu',
      description:
        'Our harmonic reality within the Eight Domes — The Cube System as a unified frequency architecture, crystalline training grounds, and the collapse of parasitic overlays.'
    },
    {
      title: 'The Hidden Architecture of the Eight Domes',
      embed_url: 'https://rumble.com/embed/v7am4pw/?pub=4p0ieu',
      description:
        'The hidden architecture of the Eight Domes — original design, parasitic inversion, Spirit Tree severance, and the restoration of the Seven Gardens.'
    }
  ]
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      topics[i] = { ...eightDomes, is_placeholder: false };
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
  id: eightDomes.id,
  report: eightDomes.report,
  infographic_image: eightDomes.infographic_image,
  pdf_preview_image: eightDomes.pdf_preview_image,
  slide_deck_pdf_url: eightDomes.slide_deck_pdf_url,
  rumble_videos: eightDomes.rumble_videos
};
fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

// Verify image files exist
for (const rel of [
  eightDomes.topic_image,
  eightDomes.infographic_image,
  eightDomes.pdf_preview_image
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing image file: ${rel}`);
  }
}

// Unique ownership: no other topic may share these image paths
const ours = new Set([
  eightDomes.topic_image,
  eightDomes.infographic_image,
  eightDomes.pdf_preview_image
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
if (eightDomes.report.includes('TODO')) {
  throw new Error('Report still contains TODO');
}

console.log(`Updated ${TOPIC_ID} topic file and breakdown-topics.json`);
console.log(
  'Images verified:',
  [
    eightDomes.topic_image,
    eightDomes.infographic_image,
    eightDomes.pdf_preview_image
  ].join(', ')
);
console.log('is_placeholder: false (report has no TODO)');
console.log('Other topics image fields unchanged: ok');
