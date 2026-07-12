/**
 * Updates breakdown mass-reveal topic in topic file + monolithic source.
 * Run: node scripts/update-mass-reveal.js && node scripts/split-topics-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const REPORT = `# Mass Reveal

## Overview

The Mass Reveal is the critical juncture within the Great Awakening, executed via the EBS Operation (Emergency Broadcast System). It is a highly coordinated, multi-stage military and multidimensional intervention designed to systematically dismantle the parasitic system and shatter the false reality of humanity. By seizing global communications, the operation broadcasts undeniable Truth Packages to the public, breaking through layers of amnesia, deception, and the parasitic overlay without triggering a total societal collapse.

## Key Terminology

- **Mass Reveal Window** — The calculated timeframe when undeniable truths about the parasitic system and the replaced elites are broadcast to the public, designed to purposefully fracture the collective illusion.

- **E.B.S. (Emergency Broadcast System)** — The military-controlled communication override used by Whitehats to hijack media and internet channels, delivering continuous truth broadcasts.

- **Whitehats** — The allied military, G.A.A. (Galactic Alliance Association), and Space Force operatives coordinating the strategic dismantling of the 3D overlay.

- **Sleepers** — Human and E.T. sols who have not yet awakened and are still operating under the influence of the parasitic reality.

- **Truth Packages** — Concentrated streams of evidence and disclosure broadcast during the EBS phase, spanning 72+ hours, designed to initiate mass awakening.

- **NPC (Non-Player Character)** — Background programs holding the simulation together; vessels without true sols that will glitch and dissolve when the overlay collapses.

- **Frequency Fracture** — The breaking of the artificial 3D matrix caused by high-resonance awakening, triggering glitches in NPC code and the environment.

## Core Revelations

The Mass Reveal is orchestrated to expose the true nature of the world's power structures. Prior to the EBS taking over, a period of Narrative Maintenance is required, utilizing clones, stand-ins, digital composites, and advanced mimic tech to replace neutralized elites (royals, politicians, corporate giants, and religious leaders) and maintain the illusion until the exact Mass Reveal Window.

When the EBS Operation executes, the disclosures released will systematically shatter the 3D illusion. The broadcasts provide irrefutable proof of election fraud, human and child trafficking rings, child organ harvesting, and satanic cult rituals, complete with names, faces, and evidence of crimes committed by the former elites. The reveal also explicitly exposes Bloodline Exposure Evidence, proving that royal families, popes, and presidents were not operating independently, but were controlled by non-human Draco-Grey influence. Furthermore, Medical and Vaccine Truth is released, showing hard evidence of deliberate depopulation plans through toxic injections, which will cause mass outrage and simultaneous mass awakening.

## Detailed Mechanics and Key Elements

The EBS Operation unfolds in a strictly controlled sequence to prevent mass terror and ensure the psychological integration of the Truth Packages.

### Phase 5: Trigger Events

Geopolitical tensions, air raid sirens, and staged supply disruptions are deployed to push the public to the edge of questioning everything, initiating the awakening process without inciting full panic.

### Phase 6: The Lockdown Window

The military becomes visible in the streets to maintain order, replacing the world police. A global communications blackout occurs as main internet cables are severed. This creates a controlled environment for the truth broadcast.

### The 72-Hour Fracture Timeline

- **The Cut (Hour 0–12):** Internet and communications go dark. Mainstream channels flood with panic and blame narratives (Russia, China, Iran).

- **The Wave (Hour 12–36):** Crowd surges occur at supermarkets and fuel stations. NPC programming begins to severely glitch, with some lashing out and others going dazed.

- **Opening Hour (Hour 36–72):** The false flag narratives wobble and fall. Truth begins to leak, causing a physical Frequency Fracture. The environment will experience static buildup, ringing ears, and electronics flickering as the A.I. Scaffolding crumbles.

### Phase 7: EBS — The Flood Gates

The military takes total control of the airwaves, beginning a 72+ hour broadcast cycle. The sequence is specifically calibrated:

- **Immediate Reassurance:** Soft truths are presented first to avoid immediate trauma. The initial message is: "STAY CALM YOU ARE SAFE, MILITARY CONTROL ACTIVE TO PROTECT YOU".

- **Hard Truths:** The broadcast shifts to expose corruption, the Federal Reserve scam, vaccines, trafficking, and bloodlines.

- **Seeded Sols Revelation:** The broadcast reveals that key figures (like Diana, Barron, and JFK Jr.) were highly evolved sols seeded directly into the bloodlines to fracture the parasitic system from the inside.

## Broader Context and Interconnections

The Mass Reveal must occur in a precise order: Scare Events, followed by Communications Cut, then EBS, then Lockdowns, and finally The Revelation. If the sky were to open before the EBS conditioned the public, the masses would interpret it as an alien invasion and collapse into fear. If the EBS played without the preceding WW3 Scare or Project BlueBeam illusions, the Sleepers would simply ignore the broadcasts.

This operation works in tandem with the energetic collapse of the parasitic overlay. As the truth is broadcast, the Frequency Fracture intensifies. The environment will physically respond to this shift: skies will look mutated, the air will feel thicker, and the false density constructs will begin to vanish through Frequency Collapse rather than physical demolition.

## Strategic Implications

By shattering the false reality in one blow, the EBS forces the global population into an ultimate choice of alignment. This triggers Phase 8: Aftermath and Stabilization, resulting in both public and behind-the-scenes Truth Tribunals, arrests, and confessions of the world's most trusted figures.

The successful execution of the Mass Reveal sets the stage for Stage 3: The Revelation. Once the truth is absorbed and the veil thins, the sky opens. Motherships and Crystalline Arks will uncloak as the higher density reality bleeds through the shattered overlay. It is at this peak moment that the Resonating Army—the awakened sols—step fully into their power, using their harmonic tone to guide the masses from shock into absolute resonance and return home.
`;

const massReveal = {
  id: 'mass-reveal',
  title: 'Mass Reveal',
  description:
    'The Mass Reveal is the critical juncture within the Great Awakening, executed via the EBS Operation to systematically dismantle the parasitic system and shatter the false reality of humanity.',
  topic_image: 'images/breakdown/mass-reveal.webp',
  report: REPORT,
  infographic_image: 'images/breakdown/the-shattering-reality-reclaimed-now.webp',
  pdf_preview_image: 'images/breakdown/the-mass-reveal.webp',
  slide_deck_pdf_url:
    'https://drive.google.com/file/d/19mDTIAjqep7NDYZtobYM1XbkqtZQkCI0/view?usp=sharing',
  rumble_videos: [
    {
      title: 'The 72 Hour Global Blackout and Reveal',
      embed_url: 'https://rumble.com/embed/v7aexc8/?pub=4p0ieu',
      description:
        'How the 72-hour global blackout and EBS Mass Reveal shatter the parasitic illusion and force collective awakening.'
    },
    {
      title: 'The Awakening Protocol',
      embed_url: 'https://rumble.com/embed/v7aexl4/?pub=4p0ieu',
      description:
        'The calibrated awakening protocol — soft reassurance, hard truths, and seeded sols revelation during the Mass Reveal window.'
    }
  ]
};

function findAndReplace(topics) {
  for (let i = 0; i < topics.length; i++) {
    if (topics[i].id === 'mass-reveal') {
      topics[i] = massReveal;
      return true;
    }
    if (topics[i].subtopics && findAndReplace(topics[i].subtopics)) return true;
  }
  return false;
}

const sourceFile = path.join(ROOT, 'data', 'breakdown-topics.json');
const source = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

if (!findAndReplace(source.topics)) {
  throw new Error('mass-reveal topic not found in breakdown-topics.json');
}

fs.writeFileSync(sourceFile, JSON.stringify(source, null, 2) + '\n', 'utf8');

const topicFile = path.join(ROOT, 'data', 'breakdown-topics', 'mass-reveal.json');
const heavy = {
  id: massReveal.id,
  report: massReveal.report,
  infographic_image: massReveal.infographic_image,
  pdf_preview_image: massReveal.pdf_preview_image,
  slide_deck_pdf_url: massReveal.slide_deck_pdf_url,
  rumble_videos: massReveal.rumble_videos
};
fs.writeFileSync(topicFile, JSON.stringify(heavy, null, 2) + '\n', 'utf8');

// Verify image files exist
for (const rel of [
  massReveal.topic_image,
  massReveal.infographic_image,
  massReveal.pdf_preview_image
]) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing image file: ${rel}`);
  }
}

console.log('Updated mass-reveal topic file and breakdown-topics.json');
console.log('Images verified:', [
  massReveal.topic_image,
  massReveal.infographic_image,
  massReveal.pdf_preview_image
].join(', '));
