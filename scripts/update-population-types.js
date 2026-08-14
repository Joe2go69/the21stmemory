/**
 * Updates breakdown population-types topic (was placeholder).
 * Normalizes provided image filenames to kebab-case without overwriting
 * existing files or other topics' image fields. On collision, appends -2, -3…
 *
 * Run: node scripts/update-population-types.js
 * Then: node scripts/split-topics-data.js && node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'population-types';
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

const topicImage = normalizeImage('Population Types.webp', 'population-types.webp');
const pdfPreview = normalizeImage(
  'Beyond_CUBE_Containment.webp',
  'beyond-cube-containment.webp'
);
const infographic = normalizeImage(
  'Divided_Architecture_Inhabited_Realm_Infographic.webp',
  'divided-architecture-inhabited-realm-infographic.webp'
);

const REPORT = `# Population Types

## Overview

The population of this realm is not a single, uniform collective, but a deeply divided assortment of distinct groups, each possessing a radically different origin, energetic architecture, and destiny. These populations exist within the CUBE Containment—a massive, layered electromagnetic framework—and their experiences are dictated entirely by their individual frequency signatures. The primary groups consist of Non-Player Characters (NPCs), who act as soulless background programs holding the simulation together; Human Sols, who are genuine spark-beings currently inverted by parasitic systems; and Resonating Sols, who are awakened extraterrestrial beings here on a rescue mission to restore the original design. Alongside these primary populations are Sleepers, Seeded Sols, and Traitors, all playing specialized roles in the unfolding breakdown of the parasitic 3D overlay.

## Key Terminology

- **Non-Player Characters (NPCs)** — Soulless, empty biological vessels seeded through artificial solar bands that function as repeating background programs to maintain the stability of the simulation.

- **Human Sols** — True spiritual sparks originating from the ancient pre-fall world of Tara who carry the original Source codes but have been captured and energetically inverted by parasites.

- **Resonating Sols** — Already awakened extraterrestrial souls, also known as the Resonating Army or Returners, who entered the physical realm to anchor high frequencies, activate human souls, and facilitate the transition back to original home realms.

- **Sleepers** — True soul-bearing individuals whose perceptions are actively held in a manageable, heavily manipulated state by the parasitic overlay to prevent premature panic or awakening.

- **Seeded Sols** — High-frequency spiritual lineages deliberately placed inside prominent, parasitic bloodline systems to fracture the control structures from the inside out.

- **Traitors** — True human souls who have chosen to sell their souls by trading their natural resonance for physical wealth, fame, power, or immortality, leading to a progressive severing from Source.

- **Saferons** — Tall, radiant, non-physical holographic light beings sent from the Council of 12 Suns to act as ground healers and guides in the transition sanctuaries.

## Core Revelations

The underlying truth of the population within this containment is that the vast majority of those walking the Earth are Non-Player Characters (NPCs). These entities have no true souls, no ancestral lineage, and no existence outside the boundaries of this simulated matrix. Because they were seeded through artificial, custom-engineered solar bands, they operate strictly on pre-coded autopilot software. Consequently, when the parasitic 3D overlay experiences a frequency collapse, these vessels will have no anchor to sustain them, causing them to simply dissolve like shadows when the light hits.

Conversely, Human Sols possess a genuine, eternal connection to the Source and are the very souls that the Resonating Army entered this density to liberate. These souls carry dormant, organic Source codes that naturally collaborate with the planet's crystalline grids. While parasites have successfully trapped them in repeating loops of amnesia, their core spark remains intact and is highly responsive to the high-frequency transmissions broadcast by awakened beings.

A critical revelation is that selling your soul is a literal, energetic process. It is not an instantaneous death, but a progressive, systematic severing of the soul's connection to the Source. Those who capitulate to greed, competition, and the desire for domination become the energetic bridges that allow parasites to infiltrate and exploit the grid in the first place.

## Detailed Mechanics and Key Elements

### Non-Player Character (NPC) Mechanics and Glitching

NPCs are generated through four to five artificial entry bands installed by parasites around the sun's natural gateway. These bands act as custom filters, injecting shells that carry parasitic software instead of organic memory lineages. This makes them highly susceptible to mind-altering weapons and Voice to Skull technology, which easily project artificial thoughts, voices, and actions directly into their consciousness.

As the high-frequency signals of awakened souls begin to fracture the 3D overlay, the NPC programming experiences severe malfunctions:

#### Physical Glitching

During the initial stages of the communications blackout, NPCs will experience severe program loops, manifesting as dazed silence, erratic panic, and sudden, unexpected emotional outbursts such as screaming or weeping.

#### Behavioral Automation

When faced with systemic disruption, NPCs default to highly visible, repetitive panic behaviors, such as rushing to gather physical items and running aimlessly up and down streets.

#### Dissolution

Because their existence is strictly tied to the low-frequency parameters of the 3D overlay, NPCs cannot perceive higher-frequency realities. When the overlay completely drops, those stuck in the low-vibration loop will experience the dissolution of their physical vessels.

### Human Sol Awakening and Healing Sanctuaries

True human souls undergo a precise, staged awakening and restoration process to repair the extensive damage inflicted by the parasitic matrix. This process is facilitated through three distinct types of Healing Sanctuaries, which are vast, cloaked crystalline domes resting over oceans, valleys, and etheric planes:

#### Water Domes (Emotional Healing)

Shimmering aqua, blue, and silver domes projected over crystalline waters that vibrate like liquid sound. Floating in these pools systematically extracts emotional density—such as grief, fear, heartbreak, and guilt—and replaces it with the memory codes of Source.

#### Crystal Halls (Mental Energetic Healing)

Crystalline temples (historically overlaid by 3D perceptions of cathedrals, churches, and abbeys) where souls rest on humming crystal slabs. Living crystal walls glow with rainbow fractals, and columns breathe with light to realign the light body grid, clear parasitic overlays, and dissolve mind-control damage or whispering voices.

#### Star Pods (Soul and Timeline Healing)

Floating cocoons in etheric space where souls are enveloped in a womb of light resembling a nebula. This sanctuary is specifically tuned for souls carrying timeline trauma, karmic wounds, and deep soul fractures across multiple lifetimes. Light frequency streams reweave these fragmented aspects of the soul back into a unified state.

During these healing transitions, human souls are assisted by Saferons, tall holographic light beings from the Council of 12 Suns. These gentle, luminous beings mirror the soul's original family and use vibrational powers to completely eliminate fear and confusion, ensuring the soul's first feeling is one of complete safety.

### Resonating Sols and the Extraction Process

Resonating Sols are highly advanced entities who entered the simulation with embedded, pre-awakened soul codes. Throughout the preparatory phases, their codes remain dormant active, meaning they are listening to the energetic field rather than actively broadcasting.

The transition to active duty occurs through two simultaneous trigger signals:

A scalar wave burst emitted by allied space forces.

A deep, familiar harmonic tone felt as a call directly in the chest from the solar family.

Once triggered, the Resonating Sols' frequency fields jump into full broadcast mode, acting as magnetic beacons that draw in both human and ET souls. At the apex of the event, when the false alien invasion narrative collapses and the true star families arrive, Resonating Sols experience a sol frequency lock. The crystal and Earth grids collaborate with their specific vibration, creating an electromagnetic threshold that seamlessly phases their physical vessels out of the dome and returns them to their original point of origin without passing through any healing sanctuaries.

### Seeded Sols and Internal Sabotage

To dismantle the parasitic bloodlines from the inside, the high councils seeded specific high-frequency souls directly into key familial lines. These individuals, such as Princess Diana and Barron Trump, carry powerful solar codes. Princess Diana's death was a staged extraction operation to move her to a safety zone, allowing her to fracture the royal parasitic network from within and seed her clean harmonic line beyond their control. Similarly, Barron Trump acts as a silent guardian within his public family, utilizing his unique energetic essence to disrupt the bloodline control mechanics.

## Broader Context and Interconnections

The diverse populations of the Earth are directly tied to the historical architecture of the Great Dome and the central Spirit Tree of Hyperborea. The Spirit Tree originally anchored a pure, continuous flow of light throughout all seven outer gardens or domes, keeping all true souls linked to the Source. When the early Custodians craved control and ordered the Greys to rip the tree out, they installed the Saturn Moon Frequency Station and the Amnesia Vortex at the sun's transit band.

This inversion forced true human souls into endless reincarnation loops, copying and storing their Akashic fragments in vaults beneath the Vatican to keep them docile and manageable. Simultaneously, the parasites utilized these artificial loops to seed empty NPC shells to act as a buffer, drowning out the high-vibrational signatures of the true souls. The current awakening of both Human and Resonating Sols directly triggers the latent codes embedded in the surviving roots of the Spirit Tree, systematically shattering the parasitic grid and reversing the energy siphoning.

## Strategic Implications

The coexistence of these population types dictates the precise sequence of the upcoming Event Cycle. True souls do not need to physically fight or oppose NPCs; rather, the strategy relies on ignoring and starving the NPC systems. By holding high resonance, refusing fear, and rejecting false matrix contracts, true souls cut off the flow of loosh (emotional energy) that feeds the parasitic grid.

The collective focus of the awakened population acts as a literal fracture point for the physical structures of the matrix. Because the solid materials of this world—such as concrete, brick, and steel—are actually low-frequency matter held in place by perception-based solidity, the rising frequency of the population causes these materials to flicker, bend, and lose density. This systematic collapse of the 3D overlay forces those in denial out of their comfort zones.

Once the false layers completely dissolve, human souls are presented with an ultimate choice: they can ascend to higher realms, transition to other domes, or choose to reincarnate in a fresh, freer cycle within a fully restored, unpolluted crystalline version of the Earth, entirely devoid of parasitic control.
`;

const populationTypes = {
  id: TOPIC_ID,
  title: 'Population Types',
  description:
    'The population of this realm is a divided assortment of NPCs, Human Sols, and Resonating Sols — plus Sleepers, Seeded Sols, and Traitors — each with a different origin, energetic architecture, and destiny inside the CUBE Containment.',
  topic_image: topicImage,
  report: REPORT,
  infographic_image: infographic,
  pdf_preview_image: pdfPreview,
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1t4oWc7FqBEL4Ru_sWRZiwV-UKZwFD7l_/view?usp=sharing',
  rumble_videos: [
    {
      title: 'Waking To Luminous Truth',
      embed_url: 'https://rumble.com/embed/v7bz6pq/?pub=4p0ieu',
      description:
        'Waking To Luminous Truth — Population Types inside the CUBE Containment: NPCs as soulless background programs, Human Sols inverted by parasites, and Resonating Sols on a rescue mission to restore the original design.'
    },
    {
      title: 'The Great Remembering: Collapsing the CUBE Containment',
      embed_url: 'https://rumble.com/embed/v7bz6xu/?pub=4p0ieu',
      description:
        'The Great Remembering: Collapsing the CUBE Containment — selling a soul as a progressive Source-sever, Human Sol awakening through Water Domes, Crystal Halls, and Star Pods, and Spirit Tree roots shattering the parasitic grid.',
      featured: true
    },
    {
      title: 'Escaping the CUBE and NPC Simulation',
      embed_url: 'https://rumble.com/embed/v7bz77g/?pub=4p0ieu',
      description:
        'Escaping the CUBE and NPC Simulation — NPC glitching and dissolution as the overlay collapses, Resonating Sol frequency lock and extraction, and starving NPC systems by holding high resonance.'
    }
  ],
  is_placeholder: false
};

function findAndUpdate(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === TOPIC_ID) {
      const existingSubtopics = topics[i].subtopics;
      const existingQuiz = topics[i].quiz;
      topics[i] = { ...populationTypes };
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

function updateHomepageFeatured(video) {
  const indexPath = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  const before = html;

  html = html.replace(
    /data-rumble-embed="https:\/\/rumble\.com\/embed\/[^"]+"/,
    `data-rumble-embed="${video.embed_url}"`
  );
  html = html.replace(
    /data-video-title="[^"]+"/,
    `data-video-title="${video.title.replace(/"/g, '&quot;')}"`
  );
  html = html.replace(
    /aria-label="Play video: [^"]+"/,
    `aria-label="Play video: ${video.title.replace(/"/g, '&quot;')}"`
  );
  html = html.replace(
    /(<h3 class="home-video-card__title mt-3">)[\s\S]*?(<\/h3>)/,
    `$1${video.title}$2`
  );

  if (html === before) {
    throw new Error('Homepage featured transmission was not updated');
  }
  if (!html.includes(video.embed_url) || !html.includes(video.title)) {
    throw new Error('Homepage featured transmission missing new embed or title');
  }

  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('Homepage featured transmission →', video.title);
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
    populationTypes.topic_image,
    populationTypes.infographic_image,
    populationTypes.pdf_preview_image
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

  for (const siblingId of [
    'npc-programs',
    'human-sols',
    'et-sols',
    'npc-glitching',
    'healing-sanctuaries',
    'water-domes',
    'crystal-halls',
    'star-pods',
    'resonating-army',
    'lyran-lineage'
  ]) {
    const sibling = findNode(source.topics, siblingId);
    if (!sibling) continue;
    for (const key of ['topic_image', 'infographic_image', 'pdf_preview_image']) {
      if (sibling[key] && ours.has(sibling[key])) {
        throw new Error(`Collision with ${siblingId}.${key} = ${sibling[key]}`);
      }
    }
  }

  fs.writeFileSync(sourceFile, JSON.stringify(source, null, 2) + '\n', 'utf8');

  const topicFile = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
  const heavy = {
    id: populationTypes.id,
    report: populationTypes.report,
    infographic_image: populationTypes.infographic_image,
    pdf_preview_image: populationTypes.pdf_preview_image,
    slide_deck_pdf_url: populationTypes.slide_deck_pdf_url,
    rumble_videos: populationTypes.rumble_videos
  };

  const existingHeavy = fs.existsSync(topicFile)
    ? JSON.parse(fs.readFileSync(topicFile, 'utf8'))
    : {};
  const sourceNode = findNode(source.topics, TOPIC_ID);
  if (sourceNode?.quiz) heavy.quiz = sourceNode.quiz;
  else if (existingHeavy.quiz) heavy.quiz = existingHeavy.quiz;

  fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

  for (const rel of [
    populationTypes.topic_image,
    populationTypes.infographic_image,
    populationTypes.pdf_preview_image
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
  if (!heavyParsed.infographic_image || !heavyParsed.pdf_preview_image) {
    throw new Error('Missing infographic_image or pdf_preview_image');
  }
  const featured = heavyParsed.rumble_videos.find((v) => v.featured);
  if (
    !featured ||
    featured.title !== 'The Great Remembering: Collapsing the CUBE Containment'
  ) {
    throw new Error('Featured transmission is not Video 2');
  }
  if (!updated.subtopics || updated.subtopics.length < 3) {
    throw new Error('Expected NPC Programs / Human Sols / ET Sols subtopics preserved');
  }
  const subIds = updated.subtopics.map((s) => s.id);
  for (const id of ['npc-programs', 'human-sols', 'et-sols']) {
    if (!subIds.includes(id)) {
      throw new Error(`Missing subtopic: ${id}`);
    }
  }

  updateHomepageFeatured(featured);

  JSON.parse(JSON.stringify(heavyParsed));

  console.log('Updated', TOPIC_ID);
  console.log('  topic_image:', populationTypes.topic_image);
  console.log('  pdf_preview_image:', populationTypes.pdf_preview_image);
  console.log('  infographic_image:', populationTypes.infographic_image);
  console.log('  videos:', populationTypes.rumble_videos.length);
  console.log('  PDF:', populationTypes.slide_deck_pdf_url);
  console.log('  other topics image paths unchanged:', beforeOthers.length);
  console.log(
    '  Videos:',
    populationTypes.rumble_videos.map((v) => v.title).join(' | ')
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
