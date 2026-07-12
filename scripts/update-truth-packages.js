/**
 * Updates breakdown truth-packages topic in topic file + monolithic source.
 * Run: node scripts/update-truth-packages.js && node scripts/split-topics-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const REPORT = `# Truth Packages

## Overview

The E.B.S. (Emergency Broadcast System) operation is a synchronized global event designed to shatter the false reality of humanity in one decisive blow. A core component of this planetary intervention is the dissemination of Truth Packages over a 72+ hour period, broadcast directly to the masses after military forces seize control of all media and internet channels. This phase functions as the ultimate catalyst for the Great Awakening, forcing the collective to confront the suppressed reality of the parasitic overlay and the crimes of the elite.

## Key Terminology

- **E.B.S. (Emergency Broadcast System)** — The worldwide communication takeover mechanism deployed by the Whitehats and military to broadcast disclosures and shatter the false reality.

- **Truth Packages** — Concentrated, 72+ hour data releases broadcast via the EBS containing irrefutable proof of global corruption, bloodlines, and parasite control.

- **Sleepers** — Individuals entirely unaware of the parasitic overlay and false reality, who will experience shock and mental breakdowns upon exposure to the Truth Packages.

- **Whitehats** — The Earth-based alliance forces, military, and Galactic Alliance assets executing the takedown of the parasite system and managing the EBS broadcast.

## Core Revelations

The EBS Broadcasts act as "The Flood Gates," delivering 72+ hours of Truth Packages that will cause mental breakdowns among the unprepared public. Information is strategically structured to manage the psychological impact: first delivering "soft truths" for reassurance, escalating into "harder truths" detailing corruption, human trafficking, and hidden bloodlines.

Bloodline exposure evidence will explicitly reveal that world leaders, including royal families, popes, and presidents, were not human, but operated under Draco-Grey influence. Furthermore, the broadcasts will expose the truth regarding medical interventions, providing hard, serious evidence of poison-toxic injections (such as MMR and Covid vaccines) and deliberate depopulation plans. The release of this information will cause mass outrage, which acts as the catalyst for a mass awakening.

## Detailed Mechanics and Key Elements

### Military Takeover and Media Seizure

The media and internet will be totally taken over by Whitehats, ensuring the Parasite System cannot twist the narrative. One military emergency channel will remain online to deliver the Truth Packages, preventing the Cabal-controlled NPC media from interfering with the disclosure.

### Phased Disclosure Strategy

To prevent total societal collapse from trauma, disclosures are softened in the first wave. Initial messages reassure the public, stating, "Stay calm you are safe, military control active to protect you," before progressing into harder evidence. The broadcasts will ultimately reveal election fraud, child trafficking rings, Satanic cults, and the rituals of replaced elites, complete with names, faces, and proof of crimes.

### Lockdowns During EBS

During the broadcast, military forces will implement stabilization lockdowns to protect civilians. Unlike parasite-driven lockdowns, this operation keeps chaos low, allowing the population to sit still, watch, think, and hit the reset and pause button on their reality.

## Broader Context and Interconnections

The release of Truth Packages occurs sequentially as Stage 2 of the final event flow, immediately following Stage 1 (the WW3 and Alien Invasion scare events) which fractures the illusion and forces the public to ask what is really happening. If the EBS were run without these scare events, Sleepers would simply switch off the broadcasts and fail to pay attention.

The EBS Operation acts as a frequency fracture, allowing the Resonating Sols (awakened souls) to act as lighthouses and help guide humanity as the NPC code flickers and the A.I. scaffolding crumbles. The broadcast bridges the gap between the chaotic collapse of the 3D Illusion and the eventual opening of the sky, where motherships will uncloak and the true higher-density reality bleeds through.

## Strategic Implications

The ultimate purpose of the EBS and Truth Packages is to entirely shatter the Sleepers' false reality. The resulting mass outrage and trauma breaks the energetic hold of the parasites. This operation immediately paves the way for Truth Tribunals, arrests, and executions of the replaced elites, securing the realm for the reconstruction and ascension processes.
`;

const truthPackages = {
  id: 'truth-packages',
  title: 'Truth Packages',
  description:
    'The E.B.S. operation disseminates Truth Packages over a 72+ hour period after military forces seize all media channels — the ultimate catalyst for the Great Awakening that forces the collective to confront the parasitic overlay and elite crimes.',
  topic_image: 'images/breakdown/truth-packages.webp',
  report: REPORT,
  infographic_image: 'images/breakdown/the-catalyst-72-hours-truth.webp',
  pdf_preview_image: 'images/breakdown/transmitting-living-truth.webp',
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/1hr7etdBi1NdG9rSla2obGZudLoES40rA/view?usp=sharing',
  rumble_videos: [
    {
      title: 'The 72 hour global EBS disclosure',
      embed_url: 'https://rumble.com/embed/v7af0tq/?pub=4p0ieu',
      description:
        'How the 72+ hour EBS Truth Packages flood the public with soft-then-hard disclosures after military media takeover.'
    },
    {
      title: 'Our Real Awakening',
      embed_url: 'https://rumble.com/embed/v7af15k/?pub=4p0ieu',
      description:
        'The mass awakening catalyzed by Truth Packages — bloodline exposure, medical truths, and the shatter of the Sleepers false reality.'
    }
  ]
};

function findAndReplace(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === 'truth-packages') {
      topics[i] = truthPackages;
      return true;
    }
    if (topics[i].subtopics && findAndReplace(topics[i].subtopics)) return true;
  }
  return false;
}

const sourceFile = path.join(ROOT, 'data', 'breakdown-topics.json');
const source = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

if (!findAndReplace(source.topics)) {
  throw new Error('truth-packages topic not found in breakdown-topics.json');
}

fs.writeFileSync(sourceFile, JSON.stringify(source, null, 2) + '\n', 'utf8');

const topicFile = path.join(ROOT, 'data', 'breakdown-topics', 'truth-packages.json');
const heavy = {
  id: truthPackages.id,
  report: truthPackages.report,
  infographic_image: truthPackages.infographic_image,
  pdf_preview_image: truthPackages.pdf_preview_image,
  slide_deck_pdf_url: truthPackages.slide_deck_pdf_url,
  rumble_videos: truthPackages.rumble_videos
};
fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

// Verify image files exist
for (const rel of [
  truthPackages.topic_image,
  truthPackages.infographic_image,
  truthPackages.pdf_preview_image
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
  truthPackages.topic_image,
  truthPackages.infographic_image,
  truthPackages.pdf_preview_image
]);
const collisions = collectImageFields(source.topics).filter(
  (e) => e.id !== 'truth-packages' && ours.has(e.path)
);
if (collisions.length) {
  throw new Error(
    'Image path collision with other topics:\n' +
      collisions.map((c) => `${c.id}.${c.key} = ${c.path}`).join('\n')
  );
}

console.log('Updated truth-packages topic file and breakdown-topics.json');
console.log(
  'Images verified:',
  [
    truthPackages.topic_image,
    truthPackages.infographic_image,
    truthPackages.pdf_preview_image
  ].join(', ')
);
