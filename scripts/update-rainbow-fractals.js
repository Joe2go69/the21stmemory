/**
 * Updates breakdown rainbow-fractals topic (was placeholder under Crystal Halls).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields.
 *
 * Run: node scripts/update-rainbow-fractals.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'rainbow-fractals';
const BREAKDOWN_IMG = path.join(ROOT, 'images', 'breakdown');

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

const topicImage = normalizeImage('Rainbow Fractals.webp', 'rainbow-fractals.webp');
const pdfPreview = normalizeImage(
  'Crystalline_Harmonics.webp',
  'rainbow-fractals-pdf-preview.webp'
);
const infographic = normalizeImage(
  'Rainbow_Fractals_Restoration_Guide.webp',
  'rainbow-fractals-restoration-guide.webp'
);

const REPORT = `# Rainbow Fractals

## Overview

Rainbow fractals are conscious, multi-dimensional light structures and frequency mirrors that manifest as shimmering, iridescent colors of bending light. They represent the visible, localized crystallization of sound harmonics, acting as dynamic interfaces that bridge different vibrational octaves and layers of reality. Within the sacred geometry of the living universe, these fractals emerge when light passes through crystalline structures, projecting a spectrum of color that translates complex data codes and structural memory into the sensory field of conscious observers. These vibrant structures manifest on the living crystal walls of the mental-energetic healing temples known as Crystal Halls.

## Key Terminology

- **Rainbow Fractals** — Multi-dimensional geometric patterns of iridescent light that project from living crystal walls, representing the visual crystallization of sound and harmonic codes.

- **Frequency Mirrors** — Visual resonance patterns, such as rainbows, that occur when light bends through different dome and overlay frequency bands, revealing alignment between layers of realities.

- **Iridescent Colors** — The shimmering, multi-colored light signatures produced when light hits living crystals at different angles, functioning as a translation of vibrational signatures.

- **Photon-Photon Resonance** — The underlying fabric of light-sound where every color exists first as a tone or vibrational frequency wave before being translated by consciousness.

- **Living Crystal Walls** — Breathing, organic structural membranes within sacred temples that emit, amplify, and sustain the frequency of rainbow fractals.

- **Crystal Prisms** — Geometric structures that refract light into the energy fields of transitioning souls, dissolving distortion and clearing parasitic overlays.

## Core Revelations

Rainbow fractals represent the physical manifestation of the primordial transition from sound to light. In the true architecture of the universe, sound serves as the organizing tool that vibrates, resonates, and organizes creation, which is then folded into light awareness to create the first spark of vision. Rainbow fractals are the visual proof of this co-creation, capturing the active harmonics of the first crystal light-worlds. When observed, they act as frequency mirrors that reveal the alignment between layers of reality, proving that the divisions and distances projected by the parasitic overlay are artificial.

The colors displayed within these fractals are not static; they are highly specialized, conscious wavelengths designed to communicate directly with the soul. Each color corresponds to a specific tone or emotional-spiritual key, such as blue for the father frequency, green for organic heart frequencies, and violet for transition gateways. These color-codes act as bio-electric software patches that decalcify and stimulate the pineal gland, expanding the observer's intuitive recall and restoring dream-state memory. By interacting with these fractals, the consciousness bypasses 3D sensory limitations and tunes directly to the galactic libraries of the Lyran lineage.

Exposure to these fractals triggers a process of profound restoration, realigning the light body grid and dissolving deep-seated mental overlays, mind-control damage, and parasitic programming. By exposing the soul to pure, uncorrupted harmonic codes through color and light, they restore the consciousness back to its first creation proper.

## Detailed Mechanics and Key Elements

The generation of rainbow fractals begins when multi-dimensional light passes through living crystal prisms, refracting at precise angles to create a shifting spectrum of iridescent colors. This light is projected onto living crystal walls which hum with a specific harmonic frequency. The architecture itself is dynamic; the structural columns act as lungs of light, breathing in synchronization with the vibrational pulse of the room. Transitioning souls, existing as conscious orbs or balls of electricity, hover over pristine crystal slabs within this field, allowing the refracted light-sound waves to envelope their energy fields.

The therapeutic mechanism of these fractals works through the following sequential elements:

### Distortion Dissolution

As light filters through the crystal prisms, it directly penetrates the soul's bio-field, neutralizing and dissolving localized energetic distortions.

### Light Body Alignment

The specific vibrational geometry of the fractals interacts with the compromised light body grid, realigning the energetic pathways and clearing embedded parasitic overlays.

### Memory Stream Activation

By clearing the distortion, the fractals act to "turn" and restore fragmented memory streams, reconnecting the soul to its unbroken historical timeline and original lineage codes.

### Eradication of Parasitic Programming

The high-octave resonance of the shimmering light completely silences parasite whispers and mind-control patterns, returning the mind to absolute clarity and relief.

### Color-Frequency Tuning

The colors of the fractals are not merely aesthetic; they are functional ingredients that tune the soul's frequency like a radio receiver. Shimmering blues, aquas, silvers, pearls, and greens represent sound-created light designed to draw out heavy emotional and mental density, replacing it with balanced harmonic resonance. This interaction raises the superconductivity of the nervous system and pineal gland, decalcifying the biological receivers and preparing the consciousness to safely exit the 3D density.

## Broader Context and Interconnections

Rainbow fractals are deeply interconnected with the prime elements of creation. They are directly dependent on the interaction of the five elements of consciousness, namely water (memory and flow), air (breath and vibration), fire (will and ignition), and earth (form and stability). The fractals represent the perfect synthesis of these elements, where sound vibration is condensed into crystalline structures, allowing light to refract through water and air currents.

Furthermore, these fractals connect laterally to the planetary crystalline grids and ley-lines. These grids act as the hard drives of the realm, recording every second of soul journeys and storing the memory of the Lyran, Pleiadian, and Andromedan builders. The fractals draw from these grids to broadcast their curative frequency.

They also share a direct lateral relationship with the Northern Lights, which represent dome frequencies bleeding through the higher overlays. Both phenomena utilize the same color-frequency codes to communicate across the domes, acting as macroscopic mirrors of the microscopic healing grids within the temples.

On a structural level, the fractals are connected to the ancient crystalline monoliths and black crystals of Antarctica. While the black crystals ground the opposite spectrum as void holders to maintain harmony, the rainbow fractals amplify and project the active, multi-dimensional light spectrum.

## Strategic Implications

### Eradication of the Reincarnation Loop

By dissolving parasitic overlays and restoring original memory streams, exposure to rainbow fractals permanently dismantles the counterfeit reincarnation loop and karmic contracts imposed by the Vatican amnesia systems. Sols are set free to either transition to higher realms or return in a free cycle within the Known Lands.

### Acceleration of the Great Awakening

As the frequency of the realm rises, the holographic 3D concrete constructions begin to flicker and bend, revealing the living, shimmering crystal underneath. The appearance and recognition of these fractals act as a massive catalyst, triggering instant flash memory recall in sleeping orbs and accelerating the Great Awakening.

### De-escalation of the Staged Invasions

The activation of the light grids, characterized by the projection of these high-frequency fractals, directly destabilizes the mechanical holograms used in the parasite and White Hat theater events, such as Project Blue Beam and the fake alien invasion. The high-resonance frequency shortens the fear cycle and allows true contact to be accepted rather than feared.

### Restoration of Manifestation and Free Energy

Realigning the consciousness to the geometric logic of the fractals restores the soul's ability to create and manifest through thought and tone. Buildings, clothing, and transport will once again respond directly to intention, rendering heavy, fixed physical labor and parasitic financial control completely obsolete.
`;

const rainbowFractals = {
  id: TOPIC_ID,
  title: 'Rainbow Fractals',
  description:
    'Rainbow Fractals are conscious multi-dimensional light structures on living crystal walls — frequency mirrors that crystallize sound harmonics, restore soul memory, and dissolve parasitic overlays through iridescent color-codes.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1Ld6IV--1ahw9r4i9qulUvrq9WMVJlmpj/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Echoes of Light',
      embed_url: 'https://rumble.com/embed/v7bx2q0/?pub=4p0ieu',
      description:
        'Echoes of Light — Rainbow Fractals as conscious light structures on living crystal walls, frequency mirrors that crystallize sound harmonics and reveal alignment between layers of reality.'
    },
    {
      title: 'How Rainbow Fractals Restore Soul Memories',
      embed_url: 'https://rumble.com/embed/v7bx3v6/?pub=4p0ieu',
      description:
        'How Rainbow Fractals Restore Soul Memories — iridescent color-codes that realign the light body grid, restore fragmented memory streams, and dissolve parasitic programming.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...rainbowFractals };
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
    rainbowFractals.topic_image,
    rainbowFractals.infographic_image,
    rainbowFractals.pdf_preview_image
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

  const crystalHalls = findNode(source.topics, 'crystal-halls');
  if (crystalHalls && ours.has(crystalHalls.infographic_image || '')) {
    throw new Error('Collision with crystal-halls.infographic_image');
  }
  if (crystalHalls && ours.has(crystalHalls.topic_image || '')) {
    throw new Error('Collision with crystal-halls.topic_image');
  }

  fs.writeFileSync(sourceFile, JSON.stringify(source, null, 2) + '\n', 'utf8');

  const topicFile = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
  const heavy = {
    id: rainbowFractals.id,
    report: rainbowFractals.report,
    infographic_image: rainbowFractals.infographic_image,
    pdf_preview_image: rainbowFractals.pdf_preview_image,
    slide_deck_pdf_url: rainbowFractals.slide_deck_pdf_url,
    rumble_videos: rainbowFractals.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    rainbowFractals.topic_image,
    rainbowFractals.infographic_image,
    rainbowFractals.pdf_preview_image
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
  if (!heavyParsed.rumble_videos || heavyParsed.rumble_videos.length !== 2) {
    throw new Error('Expected 2 rumble videos');
  }
  if (!heavyParsed.slide_deck_pdf_url) {
    throw new Error('Missing slide_deck_pdf_url');
  }
  if (!heavyParsed.infographic_image || !heavyParsed.pdf_preview_image) {
    throw new Error('Missing infographic_image or pdf_preview_image');
  }

  console.log('Updated', TOPIC_ID);
  console.log('  topic_image:', rainbowFractals.topic_image);
  console.log('  pdf_preview_image:', rainbowFractals.pdf_preview_image);
  console.log('  infographic_image:', rainbowFractals.infographic_image);
  console.log('  videos:', rainbowFractals.rumble_videos.length);
  console.log('  PDF:', rainbowFractals.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    rainbowFractals.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
