/**
 * Installs ET Sols quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/sol-quiz.json
 * Title forced to "ET Sols". All 25 audited against et-sols report only.
 *
 * Run: node scripts/install-et-sols-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/et-sols.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'et-sols';
const TOPIC_TITLE = 'ET Sols';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/sol-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/et-sols.webp';

let extractedAt = new Date().toISOString();
try {
  if (fs.existsSync(SOURCE_QUIZ)) {
    const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
    if (raw.extractedAt) extractedAt = raw.extractedAt;
  }
} catch (_) {
  /* keep default */
}

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

/** Support phrases grounded only in et-sols.json report. */
const supportPhrases = {
  1: [
    'act as frequency anchors, shattering the artificial parasitic systems',
    'guiding true human sparks back to their original spiritual home'
  ],
  2: [
    'originating from advanced stellar lineages',
    'pre-encoded energetic triggers'
  ],
  3: [
    'non-sentient background programs and light fragments',
    'lack a true individual soul spark'
  ],
  4: [
    'non-public scalar wave burst from alliance space forces',
    'solar family harmonic tone'
  ],
  5: [
    'dormant vibrational templates',
    'matching the codes of human souls to trigger mutual awakening'
  ],
  6: [
    'star pods and essence chambers located in the higher realms',
    'true consciousness remains connected to external pods'
  ],
  7: [
    'plasma-lattice hulls',
    'see the living crafts crystal clear'
  ],
  8: [
    'sanctuary-bypassing exit route',
    'instead of entering recovery sanctuaries'
  ],
  9: [
    'laid the harmonic seeds of the realm',
    'pollarians, a tall, luminous humanoid template'
  ],
  10: [
    'perception-based solidity rather than absolute reality',
    'brick, concrete, and metal'
  ],
  11: [
    'planetary crystals acting as etheric hard drives',
    'complete timelines and soul journeys'
  ],
  12: [
    'raphael and celestia',
    'foundational sound codes necessary to stabilize the great dome'
  ],
  13: [
    'dissolve like shadows when the high-frequency light hits the grid',
    'hollow programs devoid of a divine spark'
  ],
  14: ['500 million core souls'],
  15: [
    'soul frequency lock',
    'collaborates with the activated earth grids'
  ],
  16: [
    'absorbing local data and subtly fracturing the parasitic overlay',
    'have not yet shifted to full broadcast mode'
  ],
  17: [
    'ancient lyran-descended builders who maintain cloaked domes',
    'the giants'
  ],
  18: [
    'pull memory directly from unaltered records outside the containment system',
    'vatican hidden libraries and the amnesia vortex'
  ],
  19: [
    'powerful magnetic pull that draws surrounding souls',
    'commanding trust and shattering local deceptive narratives'
  ],
  20: [
    'total destabilization and collapse of the parasitic overlay',
    'localized walking beacons'
  ],
  21: [
    'individual protection field and knowledge-collection system',
    'project and move their amplified essence directly between realms'
  ],
  22: [
    'guarded by their star families via planetary crystals',
    'continuously recorded and guarded'
  ],
  23: [
    'specialized healing sanctuaries to stabilize',
    'deeply traumatized human vessels'
  ],
  24: [
    'born of direct co-creation in the higher crystal light-worlds',
    'do not originate from physical biology'
  ],
  25: [
    'when the four event flashes complete',
    'trigger a frequency phase out'
  ]
};

function cleanText(s) {
  let t = String(s || '');
  t = t.replace(/\$(\d+)\^\{(st|nd|rd|th)\}\$/gi, '$1$2');
  t = t.replace(/\$(\d+)\^(st|nd|rd|th)\$/gi, '$1$2');
  t = t.replace(/\$3\\text\{D\}\$/g, '3D');
  t = t.replace(/\$3\\mathrm\{D\}\$/g, '3D');
  t = t.replace(/\$3D\$/g, '3D');
  t = t.replace(/\$(\d+(?:\.\d+)?)\$/g, '$1');
  t = t.replace(/\$(\d+)%\$/g, '$1%');
  t = t.replace(/\$([A-Za-z][A-Za-z0-9./-]{0,24})\$/g, '$1');
  t = t.replace(/\$([^$]+)\$/g, (_, inner) =>
    inner
      .replace(/\^\{([^}]+)\}/g, '$1')
      .replace(/\\text\{([^}]*)\}/g, '$1')
      .replace(/\\mathrm\{([^}]*)\}/g, '$1')
      .replace(/\\%/g, '%')
      .replace(/\\[a-zA-Z]+/g, '')
      .replace(/[{}]/g, '')
  );
  t = t.replace(/\^\{(st|nd|rd|th)\}/gi, '$1');
  t = t.replace(/\\\(|\\\)|\\\[|\\\]/g, '');
  t = t.replace(/\\%/g, '%');
  t = t
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, '—')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ');
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

function absoluteVoice(s) {
  let t = String(s || '');
  const rewrites = [
    [/^According to the (core revelations|source|report|text|revelations|material|detailed mechanics|journal|living truth),?\s*/i, ''],
    [/^According to the report,?\s*/i, ''],
    [/^According to the text,?\s*/i, ''],
    [/^According to the material,?\s*/i, ''],
    [/\baccording to the (report|source|text|core revelations|revelations|material|journal|living truth)\b/gi, ''],
    [/^The source states that\s+/i, ''],
    [/^The source material specifies that\s+/i, ''],
    [/^The source material (identifies|states|explicitly states|specifically lists) that\s+/i, ''],
    [/^The source material (identifies|states|explicitly states|specifically lists)\s+/i, ''],
    [/^The source explains that\s+/i, ''],
    [/^The source explains\s+/i, ''],
    [/^The source specifies that\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The material states that\s+/i, ''],
    [/^The material describes them as\s+/i, 'They are '],
    [/^The material describes\s+/i, ''],
    [/\bthe text describes them as\b/gi, 'they are'],
    [/\bthe text describes\b/gi, ''],
    [/\bthe text states\b/gi, ''],
    [/\bthe text emphasizes\b/gi, ''],
    [/\bthe text uses\b/gi, ''],
    [/\bthe source material specifies that\b/gi, ''],
    [/\bthe source material (identifies|states|explicitly states|specifically lists) that\b/gi, ''],
    [/\bthe source material (identifies|states|explicitly states|specifically lists)\b/gi, ''],
    [/\bthe source specifies that\b/gi, ''],
    [/\bthe source explains that\b/gi, ''],
    [/\bthe source explains\b/gi, ''],
    [/\bthe material describes them as\b/gi, 'they are'],
    [/\bthe material describes\b/gi, ''],
    [/\bis described as\b/gi, 'is'],
    [/\bare described as\b/gi, 'are'],
    [/\bis identified as\b/gi, 'is'],
    [/\bare identified as\b/gi, 'are']
  ];
  for (const [re, rep] of rewrites) {
    t = t.replace(re, rep);
  }
  t = t.replace(/^\s*([a-z])/, (_, c) => c.toUpperCase());
  t = t.replace(/\s+/g, ' ').trim();
  t = t.replace(/\s+([.,;:])/g, '$1');
  return t;
}

/**
 * Full option sets: [correct, wrong, wrong, wrong] with {text, rationale}.
 * NotebookLM meaning kept; lengths evened; claims grounded in the ET Sols report.
 */
const fullOptionSets = {
  1: [
    {
      text: 'To act as frequency anchors that shatter parasitic systems and guide human sparks home.',
      rationale:
        'ET Sols volunteer as frequency anchors, shattering the artificial parasitic systems and guiding true human sparks back to their original spiritual home.'
    },
    {
      text: 'To gather experimental data on the evolution of biological vessels in high-density environments.',
      rationale:
        'The incarnation is a rescue and awakening mission, not a passive scientific observation of biological evolution.'
    },
    {
      text: 'To repair the structural integrity of the simulation and prevent the dissolution of the grid.',
      rationale:
        'The mandate is rescue and awakening, not preserving or repairing the artificial simulated environment.'
    },
    {
      text: 'To provide emotional support and healing to the non-sentient background programs.',
      rationale:
        'NPCs are non-sentient scaffolding without individual soul sparks. The rescue focuses on true human souls, not NPC programs.'
    }
  ],
  2: [
    {
      text: 'They originate from advanced stellar lineages and possess pre-encoded energetic triggers.',
      rationale:
        'ET Sols are high-frequency beings of advanced stellar lineages who incarnated with pre-encoded energetic triggers, whereas human souls are divine sparks caught, inverted, and looped by the matrix.'
    },
    {
      text: 'They possess physical immortality within the 3D vessels they currently inhabit.',
      rationale:
        'They interact through temporary avatar suits. Physical immortality of the 3D vessel is not their distinguishing trait.'
    },
    {
      text: 'They have entirely bypassed the experience of amnesia since their initial arrival.',
      rationale:
        'ET Sols may suffer localized amnesia in 3D. Their distinction is the ability to pull memory from unaltered records outside the containment system.'
    },
    {
      text: 'They are the original architects of the simulation who entered to perform routine maintenance.',
      rationale:
        'ET Sols are volunteers from off-world lineages executing a rescue, not the creators of the parasitic structures holding human souls.'
    }
  ],
  3: [
    {
      text: 'They are non-sentient background programs that hold the simulation\'s structure together.',
      rationale:
        'NPCs are non-sentient background programs and light fragments that hold the simulation\'s structure together but lack a true individual soul spark.'
    },
    {
      text: 'They are the primary targets for the healing sanctuaries after the final event flash.',
      rationale:
        'Healing sanctuaries stabilize traumatized human souls. NPCs dissolve like shadows when high-frequency light hits the grid.'
    },
    {
      text: 'They are biological clones created by the ET Sols to assist in the rescue operation.',
      rationale:
        'NPCs are internal scaffolding of the simulation, not tools created by off-world rescue teams.'
    },
    {
      text: 'They are younger souls who have not yet reached the frequency required for ET status.',
      rationale:
        'NPCs lack a true individual soul spark entirely. They are not undeveloped souls waiting to become ET Sols.'
    }
  ],
  4: [
    {
      text: 'A simultaneous scalar wave burst from alliance space and a solar family harmonic tone.',
      rationale:
        'Dual-signal triggering uses two simultaneous signals: a non-public scalar wave burst from alliance space forces, and a solar family harmonic tone felt as a deep call in the chest.'
    },
    {
      text: 'The direct physical contact with a member of the Council of 12 Suns rather than a remote scalar-and-tone trigger.',
      rationale:
        'The Council supervises and transmits sound codes. The shift itself is a remote dual-signal: scalar burst plus solar-family tone.'
    },
    {
      text: 'The successful completion of a specific number of biological incarnations in the 3D grid.',
      rationale:
        'Activation is a coordinated energetic event dictated by Embedded Codes and the cosmic timeline, not a lifetime count.'
    },
    {
      text: 'The achievement of total psychological integration of the local human persona.',
      rationale:
        'The shift to broadcast mode is not a psychological milestone. It is initiated by the two simultaneous external signals.'
    }
  ],
  5: [
    {
      text: 'They act as vibrational templates that trigger mutual awakening in human souls.',
      rationale:
        'Embedded Codes are dormant vibrational templates implanted by solar parents, matching the codes of human souls to trigger mutual awakening.'
    },
    {
      text: 'They provide a protective cloak that makes the ET Sol invisible to parasitic entities.',
      rationale:
        'The codes are for activation and resonance. Protection and transit are handled by the essence chamber, not by a cloak of invisibility.'
    },
    {
      text: 'They serve as a GPS system to locate the physical location of the hidden Vatican libraries.',
      rationale:
        'ET Sols pull memory from unaltered records outside the containment system. The codes themselves are mutual-awakening templates, not a Vatican locator.'
    },
    {
      text: 'They record the biological history of the host family for later stellar analysis.',
      rationale:
        'The codes are forward-looking triggers for awakening, not passive genetic data-collection tools.'
    }
  ],
  6: [
    {
      text: 'In external star pods and essence chambers located in the higher realms.',
      rationale:
        'True spiritual essence is monitored and maintained through star pods and essence chambers located in the higher realms, while the Earth body is a temporary avatar.'
    },
    {
      text: 'Within the heart center of the physical biological vessel on Earth.',
      rationale:
        'The physical vessel is a temporary avatar suit. The true consciousness remains connected to external pods, not locked in the Earth heart center.'
    },
    {
      text: 'In the hidden crystal grids maintained by the Lyran-descended Giants.',
      rationale:
        'Giants maintain cloaked domes and crystal grids as lateral support. The ET Sol\'s personal essence is housed in star pods and essence chambers.'
    },
    {
      text: 'Compressed into a single light fragment located within the sun\'s transit band.',
      rationale:
        'The sun\'s transit band holds the amnesia vortex. ET Sol essence is guarded in higher-realm pods, not compressed into that trap.'
    }
  ],
  7: [
    {
      text: 'Their internal frequency aligns with the plasma-lattice hulls of the ships.',
      rationale:
        'ET Sols see living crafts crystal clear because their frequency aligns with the ships\' plasma-lattice hulls. NPCs and unawakened sleepers cannot see them.'
    },
    {
      text: 'They receive a telepathic notification from the Council of 12 Suns beforehand.',
      rationale:
        'Craft perception is immediate sensory resonance with plasma-lattice hulls, not a prior Council message.'
    },
    {
      text: 'The ships display geometric light patterns that are visible only to unawakened human souls.',
      rationale:
        'The ships stay invisible or misperceived to NPCs and unawakened sleepers. Visibility belongs to the aligned ET Sol frequency band.'
    },
    {
      text: 'They are provided with specialized ocular implants during the Dormant-Active phase.',
      rationale:
        'Seeing through the 3D overlay is inherent frequency alignment, not an implant installed during the dormant-active phase.'
    }
  ],
  8: [
    {
      text: 'It is a direct route that bypasses recovery sanctuaries and returns to stellar homes.',
      rationale:
        'The Homecoming Path is the direct, sanctuary-bypassing exit route back to original stellar home realms. ET Sols skip the healing required by traumatized human vessels.'
    },
    {
      text: 'It requires the ET Sol to remain in the simulation until the last NPC is dissolved.',
      rationale:
        'Exit is triggered by the soul frequency lock after the four event flashes, not by waiting for every NPC to dissolve.'
    },
    {
      text: 'It involves a transition through the healing sanctuaries to clear leftover 3D density.',
      rationale:
        'Recovery sanctuaries are for human souls. ET Sols transition directly through the portal of vibration alignment.'
    },
    {
      text: 'It is a path that necessitates recycling the soul through the sun\'s transit band.',
      rationale:
        'The sun\'s transit band is part of the amnesia system. The Homecoming Path bypasses sanctuary recovery and does not recycle through that vortex.'
    }
  ],
  9: [
    {
      text: 'The Pollarians, a tall, luminous humanoid template who laid the harmonic seeds of the realm.',
      rationale:
        'The Pollarians are a tall, luminous humanoid template who originally laid the harmonic seeds of the realm.'
    },
    {
      text: 'The Alliance Space Forces, who deliver the non-public scalar wave burst that starts Dual-Signal Triggering.',
      rationale:
        'Alliance space forces send the scalar wave burst for activation. They are not the ancient originators of the realm\'s harmonics.'
    },
    {
      text: 'The Giants, ancient Lyran-descended builders who maintain cloaked domes and crystal grids.',
      rationale:
        'The Giants maintain cloaked domes and crystal grids. They are distinct from the Pollarians who laid the harmonic seeds.'
    },
    {
      text: 'The Council of 12 Suns, who supervise the mission and transmit foundational sound codes.',
      rationale:
        'The Council supervises and transmits sound codes to stabilize the Great Dome. The Pollarians laid the original harmonic seeds.'
    }
  ],
  10: [
    {
      text: 'They perceive physical materials like brick and metal flickering as perception-based solidity.',
      rationale:
        'ET Sols see brick, concrete, and metal flicker and bend, recognizing them as perception-based solidity rather than absolute reality, and they do not panic.'
    },
    {
      text: 'They witness the immediate transformation of concrete into living crystal structures.',
      rationale:
        'The observation is flicker and bend that reveals mechanical underpinnings, not an instant conversion of concrete into crystal.'
    },
    {
      text: 'They lose the ability to see physical objects entirely and enter a void state instead of seeing materials flicker.',
      rationale:
        'They do not lose perception. Their perception shifts to see materials as perception-based solidity rather than absolute reality.'
    },
    {
      text: 'They experience intense physical panic and a complete loss of sensory orientation.',
      rationale:
        'Because they operate on a higher frequency band, ET Sols do not experience panic; they observe the mechanical underpinnings calmly.'
    }
  ],
  11: [
    {
      text: 'They act as etheric hard drives that record and guard timelines and soul journeys.',
      rationale:
        'Star families guard complete timelines and soul journeys via planetary crystals acting as etheric hard drives, even if localized amnesia occurs.'
    },
    {
      text: 'They serve as physical anchors that hold the ET Sol inside 3D density.',
      rationale:
        'Crystals are etheric hard drives for timeline records. ET Sols are not physically tethered in density by those crystals.'
    },
    {
      text: 'They transmit the deceptive narratives used to keep the NPC programs functioning.',
      rationale:
        'Planetary crystals support ET Sols as benevolent storage. They are not part of the parasitic deception system.'
    },
    {
      text: 'They generate the energy needed to power the avatar suit\'s biological functions.',
      rationale:
        'The crystals store and guard timelines. They are not the power source for the temporary Earth avatar.'
    }
  ],
  12: [
    {
      text: 'They are cosmic parents who transmit the foundational sound codes for the Great Dome.',
      rationale:
        'Raphael and Celestia are cosmic parent figures on the Council of 12 Suns who transmit the foundational sound codes needed to stabilize the Great Dome during the transition.'
    },
    {
      text: 'They are the primary healers waiting in the recovery sanctuaries for human souls.',
      rationale:
        'Their named function is transmitting foundational sound codes to stabilize the Great Dome, not staffing the healing sanctuaries.'
    },
    {
      text: 'They are the entities responsible for managing the sun\'s amnesia vortex.',
      rationale:
        'The amnesia vortex is a parasitic filter. Raphael and Celestia stabilize the Great Dome; they do not run that trap.'
    },
    {
      text: 'They are the commanders of the ground operations for the Alliance Space Forces.',
      rationale:
        'They supervise from the Council and transmit sound codes. Ground operations belong to ET Sols, with Giants and Pollarians in lateral support.'
    }
  ],
  13: [
    {
      text: 'They naturally dissolve like shadows as the high-frequency light hits the grid.',
      rationale:
        'NPCs are hollow programs devoid of a divine spark, so they naturally dissolve like shadows when high-frequency light hits the grid.'
    },
    {
      text: 'They are recycled into the next iteration of the physical simulation.',
      rationale:
        'The mission permanently breaks the parasite-run reincarnation loop. NPCs dissolve; they are not recycled into a next iteration.'
    },
    {
      text: 'They are moved to specialized sanctuaries for code reconfiguration.',
      rationale:
        'Sanctuaries stabilize traumatized human souls. NPCs are non-sentient programs that dissolve rather than get reconfigured.'
    },
    {
      text: 'They are upgraded into human souls through the frequency phase-out.',
      rationale:
        'NPCs lack a true individual soul spark. They cannot be upgraded into conscious human souls.'
    }
  ],
  14: [
    {
      text: '500 million core souls.',
      rationale:
        'The real focus of the cosmos is on the 500 million core souls. Within that group, ET Sols are the specialized triggers who sequentially activate the rest.'
    },
    {
      text: '144,000 core souls.',
      rationale:
        'The focus of the cosmos is the 500 million core souls, not a 144,000-person set.'
    },
    {
      text: '1.2 billion core souls.',
      rationale:
        'The rescue focus is the 500 million core souls, not a 1.2 billion count.'
    },
    {
      text: '8 billion core souls.',
      rationale:
        'The vast majority of the population are NPCs used as scaffolding. The rescue focus is the 500 million core souls, not the full population count.'
    }
  ],
  15: [
    {
      text: 'To collaborate with activated earth grids to pull ET Sols out of the simulation.',
      rationale:
        'The soul frequency lock is a personal recognition code that collaborates with the activated earth grids to pull ET Sols out of the simulation and back to their original worlds.'
    },
    {
      text: 'To prevent human souls from accidentally exiting through the ET portal.',
      rationale:
        'The lock retrieves ET Sols. Freed human souls are routed to healing sanctuaries; the lock is not a barrier against them.'
    },
    {
      text: 'To store the multi-billion-year memories recovered from outside the system.',
      rationale:
        'Memory storage is handled by planetary crystals as etheric hard drives. The frequency lock is the extraction mechanism.'
    },
    {
      text: 'To keep the ET Sol\'s avatar suit from deteriorating during the flash events.',
      rationale:
        'The lock is for the soul\'s exit after the four event flashes, not for preserving the temporary physical vessel.'
    }
  ],
  16: [
    {
      text: 'They absorb local data and subtly fracture the parasitic overlay while awaiting activation signals.',
      rationale:
        'Prior to the flash points, ET Sols exist in a quiet dormant-active state, absorbing local data and subtly fracturing the parasitic overlay through their mere presence while codes listen but have not yet shifted to full broadcast.'
    },
    {
      text: 'They are physically located in star pods while projecting a hologram to Earth instead of inhabiting a physical avatar.',
      rationale:
        'The Earth body is a physical avatar. Dormant-active names the energetic phase of that vessel\'s field, not a hologram projected from a pod.'
    },
    {
      text: 'They are completely unaware of their off-world origins and live as standard humans whose codes are not listening.',
      rationale:
        'Even dormant-active, their codes are actively listening, and their mere presence already fractures the overlay. They are not simply unaware humans.'
    },
    {
      text: 'They are undergoing intense training in the Lyran-descended cloaked domes instead of absorbing data among the general population.',
      rationale:
        'This phase happens in the general population as they absorb local data. Giants maintain cloaked domes; that is not the dormant-active definition.'
    }
  ],
  17: [
    {
      text: 'The Giants, ancient Lyran-descended builders who maintain cloaked domes and crystal grids.',
      rationale:
        'The Giants are ancient Lyran-descended builders who maintain cloaked domes and crystal grids, working in tandem with ET Sols on the ground.'
    },
    {
      text: 'The ET Sols, who execute the ground operations as walking frequency anchors rather than as cloaked-dome builders.',
      rationale:
        'ET Sols run the ground operations. The ancient Lyran-descended builders of cloaked domes are the Giants.'
    },
    {
      text: 'The Pollarians, a tall, luminous humanoid template who laid the harmonic seeds.',
      rationale:
        'Pollarians laid the harmonic seeds of the realm. The cloaked-dome builders are the Giants.'
    },
    {
      text: 'The Council of 12 Suns, who supervise from the higher realms and transmit sound codes.',
      rationale:
        'The Council is a supervisory body that transmits sound codes. The terrestrial-adjacent builders of cloaked domes are the Giants.'
    }
  ],
  18: [
    {
      text: 'They pull memory directly from unaltered records outside the containment system.',
      rationale:
        'While the general population is recycled through Vatican hidden libraries and the amnesia vortex at the sun\'s transit band, ET Sols pull memory directly from unaltered records outside the containment system.'
    },
    {
      text: 'They never enter the sun\'s transit band during their incarnation cycle.',
      rationale:
        'The bypass is access to unaltered records outside the containment system, not a claim that they never pass the sun\'s transit band.'
    },
    {
      text: 'They possess a biological brain structure that is immune to scalar frequency waves.',
      rationale:
        'The bypass is a soul-level ability to pull memory from unaltered records, not a unique Earth-brain immunity to scalar waves.'
    },
    {
      text: 'They are given a special serum by the Alliance Space Forces to restore memory.',
      rationale:
        'Memory restoration is the ability to pull unaltered records outside the containment system, not a chemical serum from alliance forces.'
    }
  ],
  19: [
    {
      text: 'It creates a magnetic pull that commands trust and shatters local deceptive narratives.',
      rationale:
        'Full Broadcast Mode shifts the field to a massive broadcast frequency, creating a magnetic pull that draws surrounding souls, instantly commanding trust and shattering local deceptive narratives.'
    },
    {
      text: 'It renders the ET Sol invisible to everyone except other activated starseeds.',
      rationale:
        'Broadcast mode makes the ET Sol a magnetic focal point that draws souls in, not an invisibility field.'
    },
    {
      text: 'It triggers an immediate physical transformation of the nearby human biological vessel.',
      rationale:
        'The effect is energetic: magnetic pull, commanded trust, and shattered local narratives, not an instant body transformation.'
    },
    {
      text: 'It causes the NPCs to attack the ET Sol to protect the simulation\'s integrity.',
      rationale:
        'NPCs are non-sentient scaffolding that later dissolve like shadows. Broadcast mode targets the rescue of true souls, not an NPC assault.'
    }
  ],
  20: [
    {
      text: 'The total destabilization and collapse of the parasitic overlay.',
      rationale:
        'By anchoring high-frequency signals as walking beacons, ET Sols produce the total destabilization and collapse of the parasitic overlay that keeps humanity looping.'
    },
    {
      text: 'The creation of a permanent 5D colony inside the current physical simulation.',
      rationale:
        'The mission is rescue, awakening, and exit via the Homecoming Path, not a permanent colony inside the simulation.'
    },
    {
      text: 'The conversion of the NPCs into sentient beings through frequency resonance.',
      rationale:
        'NPCs lack a divine spark and dissolve like shadows. They are not converted into sentient beings.'
    },
    {
      text: 'The gradual integration of the parasitic system into a more benevolent structure.',
      rationale:
        'The outcome is collapse of the parasitic overlay and the breaking of the reincarnation loop, not a reformed parasite system.'
    }
  ],
  21: [
    {
      text: 'An individual protection field and knowledge-collection system used during transit.',
      rationale:
        'An Essence Chamber is an individual protection field and knowledge-collection system that lets ET Sols project and move their amplified essence directly between realms.'
    },
    {
      text: 'A physical room within the Vatican hidden libraries used for soul recycling.',
      rationale:
        'The Vatican hidden libraries are part of the parasitic amnesia system. Essence chambers sit in the higher realms as protection and knowledge-collection fields.'
    },
    {
      text: 'The internal organ within the avatar that stores the Embedded Codes rather than a higher-realm protection field.',
      rationale:
        'Embedded Codes sit in the soul. The essence chamber is an external higher-realm interface, not a biological organ.'
    },
    {
      text: 'A medical facility on Earth where ET Sols go to repair their avatar suits.',
      rationale:
        'Essence chambers are energetic systems in the higher realms, not Earth medical facilities for avatar repair.'
    }
  ],
  22: [
    {
      text: 'Their star families via planetary crystals acting as etheric hard drives.',
      rationale:
        'Complete timelines and soul journeys are continuously recorded and guarded by their star families via planetary crystals acting as etheric hard drives.'
    },
    {
      text: 'The Alliance Space Forces via scalar technology used for Dual-Signal Triggering.',
      rationale:
        'Alliance space forces send the scalar wave burst that starts activation. Personal timeline monitoring belongs to star families via planetary crystals.'
    },
    {
      text: 'The human souls they have successfully awakened and routed to healing sanctuaries.',
      rationale:
        'Freed human souls go to healing sanctuaries to stabilize. They do not monitor ET Sol timelines.'
    },
    {
      text: 'The Council of 12 Suns exclusively through direct transmission of sound codes.',
      rationale:
        'The Council supervises and transmits sound codes to stabilize the Great Dome. Individual journey records are guarded by star families via crystals.'
    }
  ],
  23: [
    {
      text: 'To stabilize and recover human souls from the trauma of the parasitic loop.',
      rationale:
        'Freed human souls are routed to specialized healing sanctuaries to stabilize. Deeply traumatized human vessels need that recovery; ET Sols bypass it.'
    },
    {
      text: 'To protect the Vatican records from being destroyed during the final flash.',
      rationale:
        'Sanctuaries recover human souls. They are not vaults for the parasitic Vatican libraries.'
    },
    {
      text: 'To serve as a processing center for NPCs before they are dissolved.',
      rationale:
        'NPCs dissolve like shadows and do not enter sanctuaries. Those spaces are for traumatized human souls.'
    },
    {
      text: 'To provide a place for ET Sols to rest before their next incarnation.',
      rationale:
        'ET Sols bypass recovery sanctuaries and take the Homecoming Path directly through the portal of vibration alignment.'
    }
  ],
  24: [
    {
      text: 'They are born of direct co-creation in the higher crystal light-worlds.',
      rationale:
        'ET Sols do not originate from physical biology; they are born of direct co-creation in the higher crystal light-worlds and interact here through avatar suits.'
    },
    {
      text: 'They are digital constructs created by the Alliance to simulate consciousness.',
      rationale:
        'ET Sols are genuine high-frequency conscious beings. Digital constructs describe NPC programs, not ET Sols.'
    },
    {
      text: 'They are human souls who achieved enlightenment through the amnesia vortex.',
      rationale:
        'The amnesia vortex is a parasitic trap. ET Sols come from stellar lineages outside this system, born in the crystal light-worlds.'
    },
    {
      text: 'They are the result of millions of years of biological evolution on Earth.',
      rationale:
        'They do not originate from physical biology. They are off-world volunteers born of co-creation in the higher crystal light-worlds.'
    }
  ],
  25: [
    {
      text: 'The completion of the four event flashes and the frequency phase-out.',
      rationale:
        'When the four event flashes complete, the cumulative resonance of the ET Sols triggers a frequency phase out, and their soul frequency lock is called for extraction.'
    },
    {
      text: 'The total physical destruction of the 3D Earth planet as a burned-out husk.',
      rationale:
        'The transition reveals the original, unpolluted realm. It is not defined as the total destruction of the physical plane.'
    },
    {
      text: 'The successful conversion of all NPCs into sentient human souls.',
      rationale:
        'NPCs dissolve like shadows. The final phase is the four event flashes and frequency phase-out, not NPC conversion.'
    },
    {
      text: 'The arrival of the physical ships from the Lyran-descended builders.',
      rationale:
        'Living crafts can be seen earlier by aligned ET Sols. The final extraction is driven by the four event flashes and the frequency phase-out.'
    }
  ]
};

const questionsMeta = [
  {
    number: 1,
    question:
      'What is the primary mandate of ET Sols during their incarnation in the physical simulated realm?',
    hint: 'Consider the distinction between maintaining the current system and executing a rescue mission for true consciousness.'
  },
  {
    number: 2,
    question:
      'How do ET Sols differ from the native human souls caught within the physical matrix?',
    hint: 'Focus on the specific origin and the specialized equipment they carry within their energetic fields.'
  },
  {
    number: 3,
    question: 'What is the true nature of the NPC population within the simulation?',
    hint: 'Think about whether these entities possess a genuine eternal consciousness or serve a mechanical function.'
  },
  {
    number: 4,
    question:
      'Which mechanism initiates the transition of an ET Sol from the Dormant-Active state to Full Broadcast Mode?',
    hint: 'Look for the external and internal signals that occur concurrently during the activation sequence.'
  },
  {
    number: 5,
    question: "What is the function of the Embedded Codes within an ET Sol's vessel?",
    hint: 'Think about how the ET Sols interact with the human souls they are here to rescue.'
  },
  {
    number: 6,
    question:
      'Where does the true consciousness of an ET Sol remain while they inhabit an avatar suit?',
    hint: 'Reflect on the higher-dimensional technology used to ensure the safety and continuity of the ET Sol\'s timeline.'
  },
  {
    number: 7,
    question:
      'What allows an ET Sol to recognize benevolence in the arrival of living crafts?',
    hint: 'Consider the relationship between an entity\'s frequency and their ability to perceive reality beyond the 3D overlay.'
  },
  {
    number: 8,
    question: "What is the defining characteristic of the Homecoming Path for an ET Sol?",
    hint: 'Think about why an advanced being with an unbroken lineage would have a different exit experience than a traumatized human soul.'
  },
  {
    number: 9,
    question:
      'Which ancient civilization is responsible for laying the original harmonic seeds of the realm?',
    hint: 'Identify the tall, luminous humanoid group mentioned as the architects of the realm\'s internal resonance.'
  },
  {
    number: 10,
    question:
      "What phenomenon characterizes an ET Sol's observation of the simulation as the 3D grid weakens?",
    hint: 'Think about the difference between something being absolutely solid and something being a perception-based illusion.'
  },
  {
    number: 11,
    question: "How do planetary crystals assist in the maintenance of an ET Sol's journey?",
    hint: 'Focus on the role these crystals play in preserving information and memory across different realms.'
  },
  {
    number: 12,
    question: "What is the role of Raphael and Celestia within the mission's structure?",
    hint: 'Look for their connection to the Council of 12 Suns and their contribution to the transition\'s stability.'
  },
  {
    number: 13,
    question:
      'What happens to the NPC population when high-frequency light fully interacts with the grid?',
    hint: 'Consider what happens to a shadow when a bright light is introduced into a space.'
  },
  {
    number: 14,
    question: 'How many core souls are the primary focus of the current rescue mission?',
    hint: 'Identify the specific number given for the core souls within the total population.'
  },
  {
    number: 15,
    question: "What is the soul frequency lock used for during the transition?",
    hint: 'Think about how an individual\'s unique signature might interact with the planet\'s grid to facilitate a departure.'
  },
  {
    number: 16,
    question: "What defines the Dormant-Active phase of an ET Sol's experience?",
    hint: 'Consider the subtle influence an ET Sol has even before their main triggers are pulled.'
  },
  {
    number: 17,
    question:
      "Which group is described as ancient Lyran-descended builders who maintain cloaked domes?",
    hint: 'Look for the specific term used to describe the large, ancient builders involved in grid maintenance.'
  },
  {
    number: 18,
    question:
      'How do ET Sols bypass the amnesia system that recycles the general population?',
    hint: 'Consider where the unaltered records of history and soul journeys are actually kept.'
  },
  {
    number: 19,
    question: "What effect does Full Broadcast Mode have on surrounding human souls?",
    hint: 'Think about how a very high-frequency field might affect the perceptions of those who are confused or trapped.'
  },
  {
    number: 20,
    question:
      'What is the strategic outcome of anchoring high-frequency signals in the grid?',
    hint: 'Consider the ultimate fate of the artificial structures that have been looping human consciousness.'
  },
  {
    number: 21,
    question: 'What is an Essence Chamber in the context of the ET Sol mission?',
    hint: 'Think about the specialized field or system that allows a high-frequency being to move between different densities.'
  },
  {
    number: 22,
    question:
      "Who is primarily responsible for monitoring the ET Sols' timelines and soul journeys?",
    hint: 'Identify the specific group that shares an unbroken connection with the ET Sol.'
  },
  {
    number: 23,
    question: 'What is the purpose of the Healing Sanctuaries in this mission?',
    hint: 'Think about which group has been deeply traumatized and looped by the matrix.'
  },
  {
    number: 24,
    question: 'Which of the following describes the origin of ET Sols?',
    hint: 'Look for a description that emphasizes a co-creative process in a light-based environment.'
  },
  {
    number: 25,
    question: 'What signals the final phase of the transition for an ET Sol?',
    hint: 'Identify the series of cosmic events that lead to the final frequency lock call.'
  }
];

const QUIZ_DESC =
  'Test your understanding of ET Sols — off-world starseeds as frequency anchors, Embedded Codes, Dual-Signal Triggering, Full Broadcast Mode, Homecoming Path, essence chambers, and the soul frequency lock after the four event flashes.';

const questions = [];
const letterCounts = { A: 0, B: 0, C: 0, D: 0 };

for (const meta of questionsMeta) {
  const n = meta.number;
  const set = fullOptionSets[n];
  const isTF = /^\s*true\s+or\s+false\b/i.test(meta.question);
  const tfByOptions =
    set &&
    set.length === 2 &&
    set.every((o) => /^(true|false)(\s*[—–\-:].*)?$/i.test(String(o.text || '').trim()));
  if (!set || (isTF || tfByOptions ? set.length !== 2 : set.length !== 4)) {
    throw new Error(
      `fullOptionSets[${n}] must have ${isTF || tfByOptions ? 2 : 4} options`
    );
  }

  const phrases = supportPhrases[n];
  if (!phrases || !phrases.length) {
    throw new Error(`Missing supportPhrases for Q${n}`);
  }
  const hits = phrases.filter((p) => reportLower.includes(p.toLowerCase()));
  if (hits.length < 1) {
    throw new Error(
      `Q${n} support phrases not found in report: ${phrases.join(', ')}`
    );
  }
  const correctText = set[0].text.toLowerCase() + ' ' + set[0].rationale.toLowerCase();
  const correctHits = phrases.filter((p) => correctText.includes(p.toLowerCase()));
  if (correctHits.length < 1) {
    throw new Error(`Q${n} correct option not grounded in support phrases`);
  }

  const rawOptions = set.map((o, i) => ({
    label: ['A', 'B', 'C', 'D'][i],
    text: cleanText(o.text),
    isCorrect: i === 0,
    rationale: absoluteVoice(cleanText(o.rationale))
  }));

  for (const o of rawOptions) {
    if (latexRe.test(o.text) || latexRe.test(o.rationale)) {
      throw new Error(`LaTeX residue in Q${n}: ${o.text}`);
    }
    if (
      /according to the (report|text|source|journal|material)/i.test(o.rationale) ||
      /according to the (report|text|source|journal|material)/i.test(o.text) ||
      /source material/i.test(o.rationale) ||
      /the source explains/i.test(o.rationale)
    ) {
      throw new Error(`Non-absolute voice in Q${n}: ${o.rationale || o.text}`);
    }
  }

  const { options, correctAnswer } = finalizeOptions(
    rawOptions,
    `${TOPIC_ID}-${n}`,
    meta.question
  );
  letterCounts[correctAnswer] = (letterCounts[correctAnswer] || 0) + 1;

  const qText = cleanText(meta.question);
  const hText = cleanText(meta.hint);
  if (latexRe.test(qText) || latexRe.test(hText)) {
    throw new Error(`LaTeX in Q${n} question/hint`);
  }
  if (/according to the (report|text|source|journal|material)/i.test(qText)) {
    throw new Error(`Non-absolute voice in Q${n} stem: ${qText}`);
  }

  questions.push({
    number: n,
    question: qText,
    options,
    hint: hText,
    correctAnswer
  });
}

if (questions.length !== 25) {
  throw new Error(`Expected 25 questions, got ${questions.length}`);
}

const usedLetters = Object.entries(letterCounts).filter(([, c]) => c > 0).length;
if (usedLetters < 3) {
  throw new Error(`Correct answers not mixed enough: ${JSON.stringify(letterCounts)}`);
}
const maxLetter = Math.max(...Object.values(letterCounts));
if (maxLetter >= 15) {
  throw new Error(`One letter dominates (${JSON.stringify(letterCounts)}); reseed needed`);
}

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle:
    'Test your grasp of ET Sols — off-world starseeds as frequency anchors, Embedded Codes, Dual-Signal Triggering, Full Broadcast Mode, Homecoming Path, essence chambers, and the soul frequency lock after the four event flashes.',
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'ET Sols are high-vibrational starseeds who volunteered as frequency anchors, carrying Embedded Codes that wake human sparks. Sit with Dual-Signal Triggering, Full Broadcast Mode, the sanctuary-bypassing Homecoming Path, and the soul frequency lock that pulls them out after the four event flashes. Return to the ET Sols deep-dive, infographic, and video transmissions as those codes come online.'
  },
  relatedTopic: {
    href: `/deep-dive.html?source=${SOURCE}&topic=${TOPIC_ID}`,
    label: `Return to ${TOPIC_TITLE} deep-dive`
  },
  questions
};

if (quiz.title !== TOPIC_TITLE) {
  throw new Error(`Quiz title must be exactly "${TOPIC_TITLE}"`);
}

const quizDir = path.join(ROOT, 'data', 'quizzes', SOURCE);
fs.mkdirSync(quizDir, { recursive: true });
const quizJsonPath = path.join(quizDir, `${TOPIC_ID}.json`);
fs.writeFileSync(quizJsonPath, JSON.stringify(quiz, null, 2) + '\n', 'utf8');

const quizMeta = {
  href: `quiz/${SOURCE}/${TOPIC_ID}.html`,
  title: TOPIC_TITLE,
  totalQuestions: 25,
  description: QUIZ_DESC
};
topic.quiz = quizMeta;
fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2) + '\n', 'utf8');

const monoPath = path.join(ROOT, 'data', 'breakdown-topics.json');
const mono = JSON.parse(fs.readFileSync(monoPath, 'utf8'));
function collectImageFields(topics, out = []) {
  for (const t of topics) {
    for (const key of ['topic_image', 'infographic_image', 'pdf_preview_image']) {
      if (t[key]) out.push({ id: t.id, key, path: t[key] });
    }
    if (t.subtopics) collectImageFields(t.subtopics, out);
  }
  return out;
}
const beforeOthers = collectImageFields(mono.topics)
  .filter((e) => e.id !== TOPIC_ID)
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();

function findAndPatch(topics) {
  for (const t of topics) {
    if (t.id === TOPIC_ID) {
      t.quiz = quizMeta;
      if (topic.report) t.report = topic.report;
      if (topic.infographic_image) t.infographic_image = topic.infographic_image;
      if (topic.pdf_preview_image) t.pdf_preview_image = topic.pdf_preview_image;
      if (topic.slide_deck_pdf_url) t.slide_deck_pdf_url = topic.slide_deck_pdf_url;
      if (topic.rumble_videos) t.rumble_videos = topic.rumble_videos;
      t.is_placeholder = false;
      if (!t.topic_image || t.topic_image.includes('placeholder')) {
        t.topic_image = topicImage;
      }
      t.title = TOPIC_TITLE;
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('et-sols not found in breakdown-topics.json');
}

const afterOthers = collectImageFields(mono.topics)
  .filter((e) => e.id !== TOPIC_ID)
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();
if (JSON.stringify(beforeOthers) !== JSON.stringify(afterOthers)) {
  throw new Error('Safety check failed: another topic image path was modified');
}

fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'human-sols.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on ET Sols: off-world starseeds as frequency anchors, Embedded Codes, Dual-Signal Triggering, Full Broadcast Mode, Homecoming Path, essence chambers, and the soul frequency lock after the four event flashes.';
const replacements = [
  ['Human Sols Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Human Sols: true spiritual sparks inverted by parasites, Taran lineage, the Amnesia Vortex and Vatican archive, solar pulses, Water Domes, Crystal Halls, Star Pods, and the sovereign choice after restoration.',
    desc
  ],
  ['quiz/breakdown/human-sols.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/human-sols.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=human-sols',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Human Sols deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['data/quizzes/breakdown/human-sols.json', `data/quizzes/${SOURCE}/${TOPIC_ID}.json`]
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 90));
  }
  html = html.split(a).join(b);
}

html = html.replace(/Human Sols/g, TOPIC_TITLE);
html = html
  .replace(/human-sols\.webp/g, 'et-sols.webp')
  .replace(/human-sols\.json/g, 'et-sols.json')
  .replace(/human-sols\.html/g, 'et-sols.html')
  .replace(/topic=human-sols/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/human-sols.html', priority: '0.75', changefreq: 'monthly' },";
  if (!sm.includes(anchor)) {
    throw new Error('Could not find sitemap anchor to insert quiz entry');
  }
  sm = sm.replace(anchor, `${anchor}\n${entry}`);
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('Correct letter mix:', letterCounts);
console.log(
  'PASS: audited 25/25 against data/breakdown-topics/et-sols.json'
);
