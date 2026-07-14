/**
 * Updates breakdown frequency-trick topic in topic file + monolithic source.
 * Run: node scripts/update-frequency-trick.js && node scripts/split-topics-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const REPORT = `# Frequency Trick

## Overview

The 3D Overlay is a massive, multi-layered holographic illusion grid that blankets the true reality of the Known Lands. This artificial construct relies on a Frequency Trick tuned precisely to the 3D senses, hijacking biological perception to make dead, dense matter appear far more real than the true underlying living crystal. By projecting a false skin over reality, the overlay filters, bends, and dampens the high-vibrational environment, trapping consciousness within a simulated perception of solidity, weight, and separation.

## Key Terminology

- **3D Overlay** — A parasitic projection grid that functions as a false skin over true reality, manipulating perception to create the illusion of dense matter.

- **Frequency Trick** — The mechanism by which the parasitic field tunes projection frequencies to hijack human 3D senses, making dead concrete and stone look and feel more real than living crystal.

- **Solid-Perception Holography** — The use of low-frequency matter overlaid by holographic projection fields to make elements like brick, concrete, metal, or glass feel hard, heavy, and permanent.

- **Crystalline Temple** — The true, underlying structure of the realm, composed of living light, crystal grids, and harmonic lenses, currently hidden beneath the 3D Overlay.

- **Parasite 3D Architecture** — Structures built using dead frequency holders, such as concrete, steel, and synthetic glass, designed with anti-resonance geometry to drain energy and maintain the frequency trick.

- **Known Lands** — The central, physical realm located within the Great Dome, operating as the core theatre where the 3D Overlay is currently deployed.

## Core Revelations

The physical world as currently perceived is not the true base reality, but a projected illusion designed to trap consciousness in dense, low-vibration environments. What is experienced through touch, sight, and smell is actively manipulated by an artificial field that intercepts and modulates true sensory signals. Beneath the concrete and dirt lies a vibrant, living crystalline reality that continuously hums with energy, waiting to be fully revealed as the overlay fractures. The materials commonly accepted as the foundation of modern civilization—sand, glass, cement—are manifested through the manipulation of consciousness perception, creating an environment that slows spiritual evolution and enforces control.

## Detailed Mechanics and Key Elements

### Sensory Hijacking

The Frequency Trick operates by bending incoming light waves and sound frequencies around objects. When the skin and eyes receive true signals of light and sound, the parasite field modulates those signals, convincing the nervous system that projected materials are solid, rough, cold, or transparent.

### Solid-Perception Holography

Materials like brick, metal, and glass are composed of low-frequency matter stabilized by advanced holograms. Under high resonance, these supposedly solid structures reveal their true nature, appearing as hollow scaffolding of frequency or becoming nearly transparent.

### Cloaking of Sacred Sites

The overlay actively bends light, sound, and touch around true crystalline structures, such as pyramids, stone circles, and river bends. This renders them to sleepers and non-player characters (NPCs) as plain stone, dirt, or ruins, masking the radiant, humming reality beneath.

### Architectural Suppression

Modern 3D construction heavily utilizes "dead frequency holders" like concrete, plaster, and plastic. These materials are shaped into anti-resonance forms—boxes, flat roofs, and sharp right angles—that break natural harmonics. These structures are strategically placed to short-circuit grid nodes, causing fatigue, anxiety, and disconnection in the souls that inhabit them.

## Broader Context and Interconnections

The 3D Overlay is just one artificial band inserted into the overarching architecture of the Great Dome and the CUBE Containment. The true architecture of the realm, originally established by Lyran, Pleiadian, and Andromedan solar builders, is flowing, harmonic, and aligned to cosmic resonance and ley lines. Remnants of this original crystal instrumentation survive as ancient cathedrals, star forts, and red brick power stations, which the parasite system has attempted to bury, rename, or enclose within 3D boxes to dull their inherent hum.

As the universal frequency rises, the overlay begins to glitch and fracture. The holographic layer flickers, causing walls to shimmer and bend, while trees and skies begin to radiate visible energy and unmask their true crystalline structures. The concept of travel and distance is also revealed as an optical illusion enforced by the overlay, functioning merely as phased frequency corridors rather than genuine physical space.

## Strategic Implications

To break the Frequency Trick, an individual must raise their personal frequency and harmonic resonance, shifting their perception beyond the manipulated 3D senses. Recognizing the illusion strips the parasitic system of its power, as the overlay relies entirely on the observer's manipulated consciousness to render and sustain the dense 3D projection. As the overlay completely collapses, humanity will not "build back" but rather "reveal back" the underlying Crystalline Temple. This will return the realm to an existence characterized by instant travel, free energy drawn directly from the field, and a continuous, vibrant reality completely free of the parasitic Frequency Trick.
`;

const frequencyTrick = {
  id: 'frequency-trick',
  title: 'Frequency Trick',
  description:
    'The Frequency Trick is the parasitic mechanism that tunes the 3D Overlay to hijack human senses, making dead dense matter appear more real than the living crystalline temple beneath — solid-perception holography, sensory modulation, and anti-resonance architecture that traps consciousness in weight and separation.',
  topic_image: 'images/breakdown/frequency-trick.webp',
  report: REPORT,
  infographic_image: 'images/breakdown/density-is-a-frequency-trick.webp',
  pdf_preview_image: 'images/breakdown/shattering-the-frequency-trick.webp',
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1v9g2FNfgYSj6Fd6ciEo_CJUANavfFZpv/view?usp=sharing',
  rumble_videos: [
    {
      title: 'How the 3D overlay hijacks reality',
      embed_url: 'https://rumble.com/embed/v7ah5io/?pub=4p0ieu',
      description:
        'How the 3D Overlay uses the Frequency Trick to hijack biological perception and project a false skin of dense matter over the living crystalline realm.'
    },
    {
      title: 'The Solid Hologram Illusion',
      embed_url: 'https://rumble.com/embed/v7aifpg/?pub=4p0ieu',
      description:
        'Solid-perception holography explained — how brick, metal, and glass are low-frequency matter stabilized by holograms that dissolve under high resonance.'
    },
    {
      title: 'Awakening to Living Light',
      embed_url: 'https://rumble.com/embed/v7ah6hw/?pub=4p0ieu',
      description:
        'Raising personal frequency to break the Frequency Trick, unmask the Crystalline Temple, and return to a reality free of the parasitic dense-matter projection.'
    }
  ]
};

function findAndReplace(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === 'frequency-trick') {
      topics[i] = frequencyTrick;
      return true;
    }
    if (topics[i].subtopics && findAndReplace(topics[i].subtopics)) return true;
  }
  return false;
}

const sourceFile = path.join(ROOT, 'data', 'breakdown-topics.json');
const source = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

if (!findAndReplace(source.topics)) {
  throw new Error('frequency-trick topic not found in breakdown-topics.json');
}

fs.writeFileSync(sourceFile, JSON.stringify(source, null, 2) + '\n', 'utf8');

const topicFile = path.join(ROOT, 'data', 'breakdown-topics', 'frequency-trick.json');
const heavy = {
  id: frequencyTrick.id,
  report: frequencyTrick.report,
  infographic_image: frequencyTrick.infographic_image,
  pdf_preview_image: frequencyTrick.pdf_preview_image,
  slide_deck_pdf_url: frequencyTrick.slide_deck_pdf_url,
  rumble_videos: frequencyTrick.rumble_videos
};
fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

// Verify image files exist
for (const rel of [
  frequencyTrick.topic_image,
  frequencyTrick.infographic_image,
  frequencyTrick.pdf_preview_image
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing image file: ${rel}`);
  }
}

// Sanity: no other topics should have been given these image paths (unique ownership)
function collectImageFields(topics, out = []) {
  for (const t of topics) {
    for (const key of ['topic_image', 'infographic_image', 'pdf_preview_image']) {
      if (t[key]) out.push({ id: t.id, key, path: t[key] });
    }
    if (t.subtopics) collectImageFields(t.subtopics, out);
  }
  return out;
}

const ours = new Set([
  frequencyTrick.topic_image,
  frequencyTrick.infographic_image,
  frequencyTrick.pdf_preview_image
]);
const collisions = collectImageFields(source.topics).filter(
  (e) => e.id !== 'frequency-trick' && ours.has(e.path)
);
if (collisions.length) {
  throw new Error(
    'Image path collision with other topics:\n' +
      collisions.map((c) => `${c.id}.${c.key} = ${c.path}`).join('\n')
  );
}

// Ensure we did not overwrite other topics' image fields (spot-check: only frequency-trick owns these paths)
const allImageEntries = collectImageFields(source.topics);
const pathOwners = new Map();
for (const e of allImageEntries) {
  if (!pathOwners.has(e.path)) pathOwners.set(e.path, []);
  pathOwners.get(e.path).push(`${e.id}.${e.key}`);
}
for (const p of ours) {
  const owners = pathOwners.get(p) || [];
  if (owners.length !== 1 || !owners[0].startsWith('frequency-trick.')) {
    throw new Error(`Unexpected owners for ${p}: ${owners.join(', ')}`);
  }
}

console.log('Updated frequency-trick topic file and breakdown-topics.json');
console.log(
  'Images verified:',
  [
    frequencyTrick.topic_image,
    frequencyTrick.infographic_image,
    frequencyTrick.pdf_preview_image
  ].join(', ')
);
console.log('Videos:', frequencyTrick.rumble_videos.length);
console.log('PDF:', frequencyTrick.slide_deck_pdf_url);
