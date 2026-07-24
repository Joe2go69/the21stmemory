/**
 * Generates data/breakdown-topics.json from the Mega Breakdown mind-map skeleton.
 * Run: node scripts/generate-breakdown-topics.js
 * Then: node scripts/split-topics-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PLACEHOLDER_IMAGE = 'images/breakdown/placeholder.webp';

const DESCRIPTION = `This transmission lays out the full mechanics of the final stages of the Great Awakening: the phased Great Purge and infrastructure sweep, the controlled 3rd realm collapse, the EBS lockdown window, and the final A.I. theatre of staged WW3 and fake alien invasion events. It reveals the real craft arrival on the correct frequency band, the extraction protocol and homecoming for resonating souls, the three healing sanctuaries (Water Domes, Crystal Halls, and Star Pods), projection dome technology, the living crystalline grid system with its nodes and harmonic lenses, the hidden history of the Lyran lineage and early Custodians, the removal of the Spirit Tree, and the precise sequence of the overlay collapse that returns the original second realm.

Essential for anyone who wants to understand frequency and vibration as the true key to perception, choice, and liberation, and what it means to hold steady as a resonating soul through the final window.`;

const ESSENCE_REPORT = `# Essence of the Transmission

## Overview
${DESCRIPTION}

## Key Themes

- **The Great Purge** — Phased dismantling of parasitic infrastructure, narrative maintenance, and the EBS lockdown window leading to truth disclosure and stabilization.
- **Blackout Timeline** — The first 72 hours of comms blackout, NPC glitching, frequency fracture, and the EBS mass reveal operation.
- **Reality Constructs** — The 3D overlay, cube system, and the original crystalline second realm beneath the simulation.
- **Grid Systems** — Energy nodes, crystalline networks, and the Spirit Tree as the central axis of the realm.
- **Healing Sanctuaries** — Water Domes, Crystal Halls, and Star Pods for emotional, mental, and timeline restoration.
- **Population Types** — NPC programs, human Sols, and ET Sols on their respective paths through the final window.
- **Parasite Mechanics** — Mind weapons, control technology, and historic resets that maintained the inverted matrix.
- **The Homecoming** — Ascension event, reunion mechanics, and living crafts for resonating souls.

## Status
TODO: Full essence report, infographics, and video transmissions will be added as content is decoded.
`;

const MIND_MAP = [
  {
    id: 'the-purge-phases',
    title: 'The Purge Phases',
    description: 'The phased Great Purge — from parasite targeting through truth disclosure and stabilization.',
    sections: [
      {
        id: 'phase-one-three',
        title: 'Phase One-Three',
        leaves: [
          { id: 'targeting-parasites', title: 'Targeting Parasites' },
          { id: 'infrastructure-sweep', title: 'Infrastructure Sweep' },
          { id: 'underground-dismantling', title: 'Underground Dismantling' }
        ]
      },
      {
        id: 'phase-four-six',
        title: 'Phase Four-Six',
        leaves: [
          { id: 'narrative-maintenance', title: 'Narrative Maintenance' },
          { id: 'trigger-events', title: 'Trigger Events' },
          { id: 'lockdown-window', title: 'Lockdown Window' }
        ]
      },
      {
        id: 'phase-seven-eight',
        title: 'Phase Seven-Eight',
        leaves: [
          { id: 'truth-disclosure', title: 'Truth Disclosure' },
          { id: 'stabilization-process', title: 'Stabilization Process' }
        ]
      }
    ]
  },
  {
    id: 'blackout-timeline',
    title: 'Blackout Timeline',
    description: 'The EBS lockdown window — comms blackout, physical indicators, and mass reveal operations.',
    sections: [
      {
        id: 'the-first-72-hours',
        title: 'The First 72 Hours',
        leaves: [
          { id: 'comms-blackout', title: 'Comms Blackout' },
          { id: 'npc-glitching', title: 'NPC Glitching' },
          { id: 'frequency-fracture', title: 'Frequency Fracture' }
        ]
      },
      {
        id: 'physical-indicators',
        title: 'Physical Indicators',
        leaves: [
          { id: 'skull-buzzing', title: 'Skull Buzzing' },
          { id: 'muted-environment', title: 'Muted Environment' },
          { id: 'atmospheric-pop', title: 'Atmospheric Pop' }
        ]
      },
      {
        id: 'ebs-operation',
        title: 'EBS Operation',
        leaves: [
          { id: 'military-broadcasts', title: 'Military Broadcasts' },
          { id: 'mass-reveal', title: 'Mass Reveal' },
          { id: 'truth-packages', title: 'Truth Packages' }
        ]
      }
    ]
  },
  {
    id: 'reality-constructs',
    title: 'Reality Constructs',
    description: 'The 3D overlay, cube system, and the original second realm beneath the simulation.',
    sections: [
      {
        id: '3d-overlay',
        title: '3D Overlay',
        leaves: [
          { id: 'frequency-trick', title: 'Frequency Trick' },
          { id: 'perception-solidity', title: 'Perception Solidity' },
          { id: 'matrix-scaffolding', title: 'Matrix Scaffolding' }
        ]
      },
      {
        id: 'the-cube-system',
        title: 'The Cube System',
        leaves: [
          { id: 'hard-drive-framework', title: 'Hard Drive Framework' },
          { id: 'eight-domes', title: 'Eight Domes' },
          { id: 'layered-simulations', title: 'Layered Simulations' }
        ]
      },
      {
        id: 'original-realm',
        title: 'Original Realm',
        leaves: [
          { id: 'crystalline-architecture', title: 'Crystalline Architecture' },
          { id: 'vibrant-reality', title: 'Vibrant Reality' },
          { id: 'second-realm', title: 'Second Realm' }
        ]
      }
    ]
  },
  {
    id: 'grid-systems',
    title: 'Grid Systems',
    description: 'Energy nodes, crystalline networks, and the Spirit Tree at the heart of the realm.',
    sections: [
      {
        id: 'energy-nodes',
        title: 'Energy Nodes',
        leaves: [
          { id: 'lava-core-nodes', title: 'Lava Core Nodes' },
          { id: 'harmonic-lenses', title: 'Harmonic Lenses' },
          { id: 'celestial-anchors', title: 'Celestial Anchors' }
        ]
      },
      {
        id: 'crystalline-networks',
        title: 'Crystalline Networks',
        leaves: [
          { id: 'source-code-storage', title: 'Source Code Storage' },
          { id: 'ley-line-optics', title: 'Ley Line Optics' },
          { id: 'starseed-keys', title: 'Starseed Keys' }
        ]
      },
      {
        id: 'the-spirit-tree',
        title: 'The Spirit Tree',
        leaves: [
          { id: 'central-axis', title: 'Central Axis' },
          { id: 'hyperborean-heart', title: 'Hyperborean Heart' },
          { id: 'source-bridge', title: 'Source Bridge' }
        ]
      }
    ]
  },
  {
    id: 'healing-sanctuaries',
    title: 'Healing Sanctuaries',
    description: 'Water Domes, Crystal Halls, and Star Pods for restoration through the final transition.',
    sections: [
      {
        id: 'water-domes',
        title: 'Water Domes',
        leaves: [
          { id: 'emotional-mending', title: 'Emotional Mending' },
          { id: 'liquid-sound', title: 'Liquid Sound' },
          { id: 'memory-restoration', title: 'Memory Restoration' }
        ]
      },
      {
        id: 'crystal-halls',
        title: 'Crystal Halls',
        leaves: [
          { id: 'mental-realignment', title: 'Mental Realignment' },
          { id: 'rainbow-fractals', title: 'Rainbow Fractals' },
          { id: 'overlay-clearing', title: 'Overlay Clearing' }
        ]
      },
      {
        id: 'star-pods',
        title: 'Star Pods',
        leaves: [
          { id: 'timeline-healing', title: 'Timeline Healing' },
          { id: 'soul-reweaving', title: 'Soul Reweaving' },
          { id: 'nebulae-resting', title: 'Nebulae Resting' }
        ]
      }
    ]
  },
  {
    id: 'population-types',
    title: 'Population Types',
    description: 'NPC programs, human Sols, and ET Sols — who remains and who dissolves through the final window.',
    sections: [
      {
        id: 'npc-programs',
        title: 'NPC Programs',
        leaves: [
          { id: 'background-fragments', title: 'Background Fragments' },
          { id: 'ai-shells', title: 'A.I. Shells' },
          { id: 'code-dissolution', title: 'Code Dissolution' }
        ]
      },
      {
        id: 'human-sols',
        title: 'Human Sols',
        leaves: [
          { id: 'true-sparks', title: 'True Sparks' },
          { id: 'healing-path', title: 'Healing Path' },
          { id: 'spirit-inversion', title: 'Spirit Inversion' }
        ]
      },
      {
        id: 'et-sols',
        title: 'ET Sols',
        leaves: [
          { id: 'resonating-army', title: 'Resonating Army' },
          { id: 'lyran-lineage', title: 'Lyran Lineage' },
          { id: 'homecoming-path', title: 'Homecoming Path' }
        ]
      }
    ]
  },
  {
    id: 'parasite-mechanics',
    title: 'Parasite Mechanics',
    description: 'Mind weapons, control technology, and historic resets that maintained the inverted matrix.',
    sections: [
      {
        id: 'mind-weapons',
        title: 'Mind Weapons',
        leaves: [
          { id: 'voice-to-skull', title: 'Voice to Skull' },
          { id: 'scalar-frequencies', title: 'Scalar Frequencies' },
          { id: 'amnesia-vortex', title: 'Amnesia Vortex' }
        ]
      },
      {
        id: 'control-tech',
        title: 'Control Tech',
        leaves: [
          { id: 'vatican-archive', title: 'Vatican Archive' },
          { id: 'saturn-cube', title: 'Saturn Cube' },
          { id: 'lunar-inversion', title: 'Lunar Inversion' }
        ]
      },
      {
        id: 'historic-resets',
        title: 'Historic Resets',
        leaves: [
          { id: 'titanic-op', title: 'Titanic Op' },
          { id: '1666-node-war', title: '1666 Node War' },
          { id: 'tartarian-erasure', title: 'Tartarian Erasure' }
        ]
      }
    ]
  },
  {
    id: 'the-homecoming',
    title: 'The Homecoming',
    description: 'Ascension event, reunion mechanics, and living crafts for resonating souls.',
    sections: [
      {
        id: 'ascension-event',
        title: 'Ascension Event',
        leaves: [
          { id: 'frequency-lock', title: 'Frequency Lock' },
          { id: 'solar-gate', title: 'Solar Gate' },
          { id: 'resonance-bridge', title: 'Resonance Bridge' }
        ]
      },
      {
        id: 'reunion-mechanics',
        title: 'Reunion Mechanics',
        leaves: [
          { id: 'solar-parents', title: 'Solar Parents' },
          { id: 'origin-point', title: 'Origin Point' },
          { id: 'memory-flood', title: 'Memory Flood' }
        ]
      },
      {
        id: 'living-crafts',
        title: 'Living Crafts',
        leaves: [
          { id: 'crystalline-arks', title: 'Crystalline Arks' },
          { id: 'pilot-bonding', title: 'Pilot Bonding' },
          { id: 'plasma-membranes', title: 'Plasma Membranes' }
        ]
      }
    ]
  }
];

function slugToDescription(title) {
  return `Exploration of ${title.charAt(0).toLowerCase()}${title.slice(1)}.`;
}

function placeholderReport(title) {
  return `# ${title}\n\n## Overview\n\nTODO: Full breakdown coming soon.\n`;
}

function topicImage(id) {
  return `images/breakdown/${id}.webp`;
}

function buildLeaf(leaf) {
  return {
    id: leaf.id,
    title: leaf.title,
    description: slugToDescription(leaf.title),
    topic_image: PLACEHOLDER_IMAGE,
    report: placeholderReport(leaf.title)
  };
}

function buildSection(section) {
  return {
    id: section.id,
    title: section.title,
    description: slugToDescription(section.title),
    topic_image: PLACEHOLDER_IMAGE,
    report: placeholderReport(section.title),
    subtopics: section.leaves.map(buildLeaf)
  };
}

function buildCategory(category) {
  return {
    id: category.id,
    title: category.title,
    description: category.description,
    topic_image: PLACEHOLDER_IMAGE,
    report: placeholderReport(category.title),
    subtopics: category.sections.map(buildSection)
  };
}

function countTopics(topics) {
  let total = 0;
  const walk = (items) => {
    for (const item of items || []) {
      total++;
      if (item.subtopics?.length) walk(item.subtopics);
    }
  };
  walk(topics);
  return total;
}

const topics = [
  {
    id: 'essence-of-the-transmission',
    title: 'Essence of the Transmission',
    description: 'The cornerstone summary of the Mega Breakdown transmission — the final stages of the Great Awakening, the Great Purge, and the path home for resonating souls.',
    topic_image: 'images/breakdown/breakdown.webp',
    is_main_root: true,
    report: ESSENCE_REPORT
  },
  ...MIND_MAP.map(buildCategory)
];

const payload = {
  id: 'breakdown',
  title: 'Mega Breakdown Board Notes & Highlights',
  subtitle: 'Great Awakening Final Stages',
  image: 'images/breakdown/breakdown.webp',
  pdf_url: '',
  description: DESCRIPTION,
  total_topics: countTopics(topics),
  topics
};

const outPath = path.join(ROOT, 'data', 'breakdown-topics.json');
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
console.log(`Wrote ${path.relative(ROOT, outPath)} (${payload.total_topics} topics)`);