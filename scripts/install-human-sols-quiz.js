/**
 * Installs Human Sols quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/sols-quiz.json
 * Title forced to "Human Sols". All 25 audited against human-sols report only.
 *
 * Run: node scripts/install-human-sols-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/human-sols.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'human-sols';
const TOPIC_TITLE = 'Human Sols';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/sols-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/human-sols.webp';

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

/** Support phrases grounded only in human-sols.json report. */
const supportPhrases = {
  1: [
    'genuine individual consciousness',
    'sovereign spiritual lineage',
    'true spiritual sparks'
  ],
  2: [
    'pre-fall 5d+ templated world of tara',
    'taran sols',
    'galan matrix'
  ],
  3: [
    'amnesia vortex that strips their memory',
    'portal of the sun'
  ],
  4: [
    'akashic fragments',
    'inverted beneath the vatican'
  ],
  5: [
    'ringing in the ears, deep tiredness, and heart-rate spikes',
    'awakening cracks'
  ],
  6: [
    'second flash triggers heart synchronization',
    'activates dormant codes'
  ],
  7: [
    'mending the heart',
    'liquid sound',
    'emotional density'
  ],
  8: [
    'ground healers (or saferins)',
    'council of 12 suns',
    'tall, radiant holographic'
  ],
  9: ['niburians siphon void plasma'],
  10: ['frequency collapse and pixelate into rubble'],
  11: [
    'orme (orbitally rearranged monotomic elements)',
    'pineal glands'
  ],
  12: [
    'dissolving mental overlays, mind control damage',
    'crystal halls'
  ],
  13: [
    'remain unconscious of the simulated reality',
    'relying on external authority'
  ],
  14: ['full broadcast frequency', 'magnetic pull is generated'],
  15: [
    'transition into higher dimensions',
    'return to the known lands'
  ],
  16: [
    'planetary hard drives',
    'unbroken timeline is preserved galactically'
  ],
  17: ['soft truths', 'harder truths', 'emergency broadcast system'],
  18: ['critical anchors for the upcoming restoration'],
  19: ['custodians harvest ritual astral energy'],
  20: ['star pods', 'floating etheric cocoons'],
  21: [
    'hollow background programs',
    'genuine individual consciousness'
  ],
  22: ['automatic activation key', 'presence of awakened starseeds'],
  23: ['seal breaker', 'central tree pulse', 'crystalline gateways'],
  24: ['realign their light body grids', 'vibrating slabs'],
  25: [
    'true spiritual sparks containing the infinite',
    'caught and inverted'
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
 * NotebookLM meaning kept; lengths evened; claims grounded in the Human Sols report.
 */
const fullOptionSets = {
  1: [
    {
      text: 'Human Sols possess a genuine individual consciousness and a sovereign spiritual lineage.',
      rationale:
        'Human Sols are true spiritual sparks with an eternal link to Source, whereas NPCs are hollow background programs and fragments of light designed to hold the 3D simulation together.'
    },
    {
      text: 'Human Sols are artificial fragments of light designed to hold the 3D simulation together.',
      rationale:
        'That description belongs to NPCs, which are soulless fragments of light and automated background programs that stabilize the holographic environment.'
    },
    {
      text: 'Human Sols are generated via artificial entry bands located around the sun.',
      rationale:
        'NPCs are generated via artificial entry bands around the sun. Human Sols descend from true solar lineages and enter through the sun\'s original harmonic pathways.'
    },
    {
      text: 'Human Sols lack a core blueprint and rely entirely on external coded memory inserts.',
      rationale:
        'Human Sols carry a highly sophisticated energetic blueprint and latent codes naturally embedded by their solar parents. Coded memory inserts belong to NPC vessels.'
    }
  ],
  2: [
    {
      text: 'Taran Sols are the ancient human-soul lineage from the pre-fall 5D+ templated world of Tara.',
      rationale:
        'Taran Sols are a highly ancient lineage of human souls originating from the pre-fall 5D+ templated world of Tara in the Galan Matrix.'
    },
    {
      text: 'Galan Sols are the named lineage that originated on Tara and later seeded the Known Lands.',
      rationale:
        'Galan refers to the Matrix where Tara was located. The lineage itself is named Taran Sols, not Galan Sols.'
    },
    {
      text: 'Resonating Sols are the ancient Taran caretakers who carried refined DNA into the Known Lands.',
      rationale:
        'The Resonating Army is the awakened ET Sol rescue force. The ancient lineage from Tara is specifically named Taran Sols.'
    },
    {
      text: 'Solar Parents are the ancient Taran lineage that originated from the pre-fall world of Tara.',
      rationale:
        'Solar parents seeded natural codes into the soul matrix. They are not the named lineage that originated from Tara.'
    }
  ],
  3: [
    {
      text: 'They are intercepted by an Amnesia Vortex that strips their memory.',
      rationale:
        'When a true human soul passes through the portal of the sun, they are intercepted by an Amnesia Vortex that strips their memory so the parasites can keep incarnating vessels docile.'
    },
    {
      text: 'They receive high-frequency activation keys from ET Sols at the solar gate.',
      rationale:
        'ET Sols act as later catalysts through presence and broadcast frequency. They do not meet incoming souls at the solar entry trap.'
    },
    {
      text: 'They are immediately integrated into the 5D+ Taran template upon transit.',
      rationale:
        'The current system is inverted and parasitic. Incoming Human Sols are stripped of memory rather than restored to the Taran template.'
    },
    {
      text: 'They automatically synchronize with Earth\'s crystalline leylines as they enter.',
      rationale:
        'Embedded codes can later react with leylines, mountains, and nodes. The specific intervention at solar entry is the Amnesia Vortex.'
    }
  ],
  4: [
    {
      text: 'Extracted Akashic fragments are copied, archived, and inverted beneath the Vatican.',
      rationale:
        'Extracted memory strands known as Akashic fragments are copied, archived, and inverted beneath the Vatican to keep incarnating vessels docile and trapped in recurring loops.'
    },
    {
      text: 'They are stored inside the artificial entry bands around the sun that seed NPC vessels.',
      rationale:
        'Artificial entry bands generate NPC vessels as empty shells with coded memory inserts. They do not archive stolen Human Sol memory.'
    },
    {
      text: 'They are held in the Star Pods of the Healing Sanctuaries until the soul is restored.',
      rationale:
        'Star Pods reweave soul fractures, timeline trauma, and karmic wounds. They are not parasitic storage for stolen memories.'
    },
    {
      text: 'They are logged only in mountain crystalline grids as the parasites\' official archive.',
      rationale:
        'Earth\'s natural surface and hidden crystals independently log experience as planetary hard drives. The parasitic archive of inverted fragments sits beneath the Vatican.'
    }
  ],
  5: [
    {
      text: 'Ringing in the ears, deep tiredness, and heart-rate spikes.',
      rationale:
        'During the first 72 hours of the simulated World War III and communications blackout, a sudden drop in atmospheric pressure and frequency fractures causes ringing in the ears, deep tiredness, and heart-rate spikes.'
    },
    {
      text: 'Loss of all sensory perception and complete motor-control failure.',
      rationale:
        'The Awakening Cracks are ringing in the ears, deep tiredness, and heart-rate spikes, not a total shutdown of sensation or movement.'
    },
    {
      text: 'Instantaneous physical transformation, levitation, and light-body exit.',
      rationale:
        'The first 72 hours produce physiological disturbances from frequency fracture, not immediate levitation or a completed light-body exit.'
    },
    {
      text: 'Total amnesia and the sudden loss of the ability to communicate.',
      rationale:
        'Amnesia is the existing parasitic trap at the solar portal. The Awakening Cracks move sleepers and Human Sols toward awakening, not further memory wipe.'
    }
  ],
  6: [
    {
      text: 'It triggers heart synchronization and activates dormant codes in Human Sols and starseeds.',
      rationale:
        'The second flash triggers heart synchronization and activates dormant codes in Human Sols and starseeds.'
    },
    {
      text: 'It completely fractures false timelines and parasitic overlays in a single strike.',
      rationale:
        'The third flash completely fractures false timelines and overlays. That is not the work of the second pulse.'
    },
    {
      text: 'It acts as a seal breaker and connects the central tree pulse to open the gateways.',
      rationale:
        'The fourth flash is the seal breaker that connects the central tree pulse and opens the crystalline gateways.'
    },
    {
      text: 'It glitches the perception of NPCs and clears leftover energetic residue, which is the work of the first flash.',
      rationale:
        'The first flash glitches the perception of NPCs and clears energetic residue. The second flash moves to heart synchronization.'
    }
  ],
  7: [
    {
      text: 'To mend the heart by drawing out emotional density through liquid sound.',
      rationale:
        'Phase 1 Water Domes mend the heart. Souls float in pools of liquid sound so emotional density is drawn out and replaced with Source memory codes, healing grief, fear, and heartbreak.'
    },
    {
      text: 'To provide physical nourishment for newly awakened biological vessels.',
      rationale:
        'Healing Sanctuaries are not physical hospitals. They are pure frequency environments of light, sound, and living crystal.'
    },
    {
      text: 'To reweave fragmented soul aspects across multiple timelines and karma.',
      rationale:
        'That Phase 3 work belongs to Star Pods, which mend soul fractures, timeline trauma, and karmic wounds with light frequency streams.'
    },
    {
      text: 'To dissolve mind-control damage and mental overlays with crystal prisms.',
      rationale:
        'Mending the mind occurs in the Crystal Halls, where living crystal walls and humming slabs dissolve mental overlays and parasitic programming.'
    }
  ],
  8: [
    {
      text: 'Tall, radiant holographic light beings who serve as Ground Healers from the Council of 12 Suns.',
      rationale:
        'Saferins are Ground Healers: tall, radiant holographic light beings sent from the Council of 12 Suns to project an aura of absolute safety and love.'
    },
    {
      text: 'A parasitic faction that harvests ritual astral energy from incarnating Human Sols.',
      rationale:
        'The Custodians harvest ritual astral energy. Saferins are benevolent Ground Healers, not a parasitic harvest faction.'
    },
    {
      text: 'A group of awakened sleepers who operate the Emergency Broadcast System on the ground.',
      rationale:
        'Saferins are holographic light beings from the Council of 12 Suns, not former human sleepers running the EBS.'
    },
    {
      text: 'Ancient Taran souls who carried refined DNA templates into the Known Lands and now oversee the sanctuaries.',
      rationale:
        'Those are the Taran Sols, who now serve as critical anchors for restoration. They are not the holographic beings overseeing the sanctuaries.'
    }
  ],
  9: [
    {
      text: 'The Niburians siphon void plasma from the human soul\'s energy.',
      rationale:
        'Each parasitic faction siphons a different element. The Niburians siphon void plasma.'
    },
    {
      text: 'The Greys siphon void plasma as their assigned harvest from Human Sols.',
      rationale:
        'The Greys extract genetic material. Void plasma is the Niburian siphon.'
    },
    {
      text: 'The Draconians siphon void plasma rather than feeding on fear.',
      rationale:
        'The Draconians feed on fear. Void plasma is assigned to the Niburians.'
    },
    {
      text: 'The Anunaki siphon void plasma while they also manage bloodlines.',
      rationale:
        'The Anunaki manage bloodlines. They are not the faction assigned to void plasma.'
    }
  ],
  10: [
    {
      text: 'They undergo frequency collapse and pixelate into rubble.',
      rationale:
        'Corporate buildings, financial systems, and governments have no anchor in a high-frequency field, so they undergo frequency collapse and pixelate into rubble as Human Sols raise their frequency.'
    },
    {
      text: 'They are moved into the Vatican archives for long-term parasitic preservation.',
      rationale:
        'The Vatican archives store inverted Akashic fragments, not physical corporate or governmental infrastructure.'
    },
    {
      text: 'They are automatically upgraded with free-energy systems and kept standing.',
      rationale:
        'Free energy belongs to the fresh cycle after graduation. Existing 3D structures have no high-frequency anchor and collapse first.'
    },
    {
      text: 'They are repurposed into Healing Sanctuaries by the Ground Healers.',
      rationale:
        'Sanctuaries are frequency environments of light, sound, and living crystal, not converted 3D corporate buildings.'
    }
  ],
  11: [
    {
      text: 'It enhances the pineal gland, making it superconductive to incoming cosmic and solar signals.',
      rationale:
        'Atmospheric deployment of ORME (Orbitally Rearranged Monotomic Elements), plant enzymes, and micro-silica quartz enhances the pineal glands of human souls, making them superconductive and highly receptive to incoming cosmic and solar signals.'
    },
    {
      text: 'It provides a protective shield that blocks Human Sols from the solar pulses instead of opening them to those signals.',
      rationale:
        'The solar pulses are meant to activate dormant codes. ORME assists receptivity of the pineal gland; it does not shield souls from the flashes.'
    },
    {
      text: 'It acts as a fuel source for the Resonating Army\'s incoming spacecraft rather than enhancing pineal receptivity.',
      rationale:
        'ORME is used for atmospheric stabilization and pineal enhancement, not as a propellant for rescue craft.'
    },
    {
      text: 'It is the holographic tool Saferins use to project the Water Domes over crystalline water bodies.',
      rationale:
        'Water Domes are frequency environments projected over crystalline water bodies. ORME is an atmospheric component that enhances the pineal gland.'
    }
  ],
  12: [
    {
      text: 'The dissolution of mental overlays, mind-control damage, and parasitic programming.',
      rationale:
        'In the Crystal Halls, living crystal walls glowing with rainbow fractals project light through crystal prisms, dissolving mental overlays, mind control damage, and parasitic programming.'
    },
    {
      text: 'The restoration of soul fractures, timeline trauma, and karmic wounds.',
      rationale:
        'That Phase 3 work belongs to Star Pods, where light streams reweave fragmented soul aspects across multiple timelines.'
    },
    {
      text: 'The presentation of the choice to join galactic families or return home.',
      rationale:
        'That sovereign choice is presented after graduating from all three sanctuary phases, not inside the Crystal Halls themselves.'
    },
    {
      text: 'The immersion in liquid sound to heal grief, fear, and heartbreak inside the Water Domes.',
      rationale:
        'Emotional mending through liquid sound is Phase 1 in the Water Domes, not the Crystal Halls.'
    }
  ],
  13: [
    {
      text: 'Sleepers are Human Sols who remain unconscious of the simulated reality and rely on external authority.',
      rationale:
        'Sleepers are Human Sols who remain unconscious of the simulated reality and their true origins, relying on external authority.'
    },
    {
      text: 'NPCs are human souls who remain unconscious of the simulation and wait for authority to wake them.',
      rationale:
        'NPCs are soulless fragments of light and automated background programs. They are not unconscious Human Sols waiting to awaken.'
    },
    {
      text: 'Saferins are the unconscious Human Sols who still rely on external authority inside the matrix.',
      rationale:
        'Saferins are tall, radiant holographic Ground Healers from the Council of 12 Suns, not trapped sleepers.'
    },
    {
      text: 'ET Sols are Human Sols who remain unconscious of the simulated reality until the rescue begins.',
      rationale:
        'ET Sols of the Resonating Army are the awakened catalysts of the rescue, not unconscious souls relying on external authority.'
    }
  ],
  14: [
    {
      text: 'When ET Sols emit their full broadcast frequency, a magnetic pull lets Human Sols drop ego and recognize the truth.',
      rationale:
        'When ET Sols emit their full broadcast frequency, a magnetic pull is generated, allowing human souls to quickly bypass intellectual resistance, drop their egos, and recognize the truth.'
    },
    {
      text: 'They manage the Vatican database so stolen Akashic fragments can be restored on demand to incoming souls.',
      rationale:
        'The Vatican database is the parasitic archive of inverted memory. ET Sols catalyze awakening through frequency, not by administering that archive.'
    },
    {
      text: 'They supply the genetic material that the Greys later extract from Human Sols.',
      rationale:
        'ET Sols are the catalysts for liberation. The Greys extract genetic material as a parasitic siphon, not as an ET Sol gift.'
    },
    {
      text: 'They generate the holographic simulation so Human Sols can stay protected inside it.',
      rationale:
        'The 3D simulation is a parasitic inversion. ET Sols of the Resonating Army lead the multi-dimensional rescue out of it.'
    }
  ],
  15: [
    {
      text: 'To transition into higher dimensions with galactic families, or return to a freer Known Lands cycle.',
      rationale:
        'Upon graduating from the healing sanctuaries, Human Sols can transition into higher dimensions to join their galactic families, or return to the Known Lands for a fresh, freer evolutionary cycle free of parasitic overlays.'
    },
    {
      text: 'To enter the Amnesia Vortex again so they can help other sleepers awaken from inside it.',
      rationale:
        'The Amnesia Vortex is a parasitic trap that strips incoming memory. It is not a tool graduates re-enter to help others.'
    },
    {
      text: 'To reset the 3D matrix and become the new architects of a milder simulation for the remaining sleepers.',
      rationale:
        'Graduation restores spiritual sovereignty and offers exit or a freer Known Lands cycle. The goal is liberation from the overlay, not a redesigned simulation.'
    },
    {
      text: 'To remain in the sanctuaries permanently as Ground Healers and Saferins for later arrivals.',
      rationale:
        'Saferins are holographic beings sent from the Council of 12 Suns. Graduated Human Sols choose higher dimensions or a return to the Known Lands.'
    }
  ],
  16: [
    {
      text: 'Earth\'s natural surface and hidden crystals act as planetary hard drives that log every movement.',
      rationale:
        'Earth\'s natural surface and hidden crystals act as planetary hard drives that record and log every movement and experience of Human Sols, preserving the unbroken timeline galactically and bypassing Vatican memory wipes.'
    },
    {
      text: 'Backup servers beneath the Vatican keep a clean copy of each soul\'s true timeline for later galactic retrieval.',
      rationale:
        'The Vatican archive copies, inverts, and uses Akashic fragments to keep vessels docile. It is not galactic preservation of the unbroken timeline.'
    },
    {
      text: 'Memory inserts issued by the Council of Parasitic Races store the original solar record.',
      rationale:
        'Coded memory inserts belong to NPC vessels. They do not preserve a Human Sol\'s unbroken timeline.'
    },
    {
      text: 'The automated background programs of the NPC network log every Human Sol experience.',
      rationale:
        'NPCs are hollow fragments of light that stabilize the simulation. They do not preserve Human Sol timelines.'
    }
  ],
  17: [
    {
      text: 'Soft truths followed by harder truths about geopolitical deception, depopulation, and parasitic control.',
      rationale:
        'As the Emergency Broadcast System takes over, the release of soft truths followed by harder truths regarding geopolitical deception, depopulation programs, and parasitic control shatters the false reality and activates millions of Human Sols.'
    },
    {
      text: 'New coded memory inserts meant to replace the stolen Akashic fragments with a cleaner overlay.',
      rationale:
        'The EBS reveals truth that shatters false reality. It does not issue more artificial memory inserts.'
    },
    {
      text: 'A sequence of tones that is what first triggers the 72-hour communications blackout and Awakening Cracks.',
      rationale:
        'The first 72 hours of simulated World War III and communications blackout produce the Awakening Cracks. The EBS then releases soft truths followed by harder truths.'
    },
    {
      text: 'Instructions telling souls to re-enter the sun\'s artificial entry bands for extraction from the simulation.',
      rationale:
        'Artificial entry bands seed NPC vessels. The EBS is part of the awakening sequence that shatters false reality, not a return to those bands.'
    }
  ],
  18: [
    {
      text: 'They serve as the critical anchors for the upcoming restoration of the falling matrix.',
      rationale:
        'When Tara fractured, Taran Sols carried highly refined DNA templates into the Known Lands to stabilize the falling matrix. They now serve as the critical anchors for the upcoming restoration.'
    },
    {
      text: 'They serve as the primary source of genetic material extracted by the Greys.',
      rationale:
        'The Greys extract genetic material as a parasitic siphon. That is not the intended role of Taran Sols, who stabilize the falling matrix as restoration anchors.'
    },
    {
      text: 'They operate the Amnesia Vortex and archive inverted memory strands beneath the Vatican.',
      rationale:
        'The Amnesia Vortex and Vatican archive are parasitic operations. Taran Sols are caretakers who now anchor restoration.'
    },
    {
      text: 'They manage the financial systems and corporate infrastructure of the 3D overlay.',
      rationale:
        'Those structures have no high-frequency anchor and will pixelate into rubble. Taran Sols are restoration anchors, not operators of the collapsing overlay.'
    }
  ],
  19: [
    {
      text: 'The Custodians harvest ritual astral energy from human souls.',
      rationale:
        'Each parasitic faction siphons a different element. The Custodians harvest ritual astral energy.'
    },
    {
      text: 'The Niburians harvest ritual astral energy rather than siphoning void plasma.',
      rationale:
        'The Niburians siphon void plasma. Ritual astral energy is the Custodians\' harvest.'
    },
    {
      text: 'The Anunaki harvest ritual astral energy as their primary siphon from Human Sols.',
      rationale:
        'The Anunaki manage bloodlines. Ritual astral energy belongs to the Custodians.'
    },
    {
      text: 'The Draconians harvest ritual astral energy instead of feeding on fear.',
      rationale:
        'The Draconians feed on fear. Ritual astral energy is harvested by the Custodians.'
    }
  ],
  20: [
    {
      text: 'Star Pods are the floating etheric cocoons that reweave soul fractures across multiple timelines.',
      rationale:
        'Star Pods are floating etheric cocoons that heal soul fractures, timeline trauma, and karma across multiple timelines using light frequency streams. They are Phase 3 of the sanctuaries.'
    },
    {
      text: 'Water Domes are the floating etheric cocoons used in Phase 3 to reweave soul fractures.',
      rationale:
        'Water Domes are Phase 1 environments for emotional healing, where souls float in liquid sound. They are not the Phase 3 cocoons.'
    },
    {
      text: 'Amnesia Pods are the floating etheric cocoons used in Phase 3 of the Healing Sanctuaries.',
      rationale:
        'The sanctuaries restore memory and integrity. There are no Amnesia Pods in the rehabilitation process. Phase 3 uses Star Pods.'
    },
    {
      text: 'Crystal slabs are the floating etheric cocoons used in Phase 3 to mend soul fractures and karmic wounds.',
      rationale:
        'Crystal slabs sit in the Crystal Halls during Phase 2 to realign light-body grids. The Phase 3 cocoons are Star Pods.'
    }
  ],
  21: [
    {
      text: 'False',
      rationale:
        'Only Human Sols possess a genuine individual consciousness and a sovereign spiritual lineage. NPCs are hollow background programs and soulless fragments of light designed to hold the 3D simulation together. The multi-dimensional rescue is led for Human Sols, not for NPCs.'
    },
    {
      text: 'True',
      rationale:
        'NPCs do not carry a sovereign spiritual lineage. They are automated background programs, and they are not the primary subjects of the Resonating Army rescue.'
    }
  ],
  22: [
    {
      text: 'The presence of awakened ET Sols, whose matching frequencies act as an automatic activation key.',
      rationale:
        'Human Sol harmonic codes match the frequencies carried by incoming ET Sols, so the presence of awakened starseeds acts as an automatic activation key.'
    },
    {
      text: 'The consumption of genetic material by the Greys, which forces the codes to ignite under extraction.',
      rationale:
        'The Greys extract genetic material as a parasitic siphon. That extraction does not activate the natural harmonic codes.'
    },
    {
      text: 'The stabilization of the 3D matrix by NPC programs running in the background as a holding field.',
      rationale:
        'NPCs hold the 3D simulation together and suppress awakening. They do not trigger the activation of Human Sol harmonic codes.'
    },
    {
      text: 'Passing through the Amnesia Vortex at the sun, which switches the embedded codes on instead of stripping memory.',
      rationale:
        'The Amnesia Vortex strips memory at solar entry. It does not activate the natural harmonic codes seeded by solar parents.'
    }
  ],
  23: [
    {
      text: 'It connects the central tree pulse and opens the crystalline gateways.',
      rationale:
        'The fourth flash acts as a seal breaker, connecting the central tree pulse and opening the crystalline gateways.'
    },
    {
      text: 'It archives the remaining Akashic fragments in the Vatican database.',
      rationale:
        'The solar pulses destabilize parasitic overlays. They do not assist the Vatican archive.'
    },
    {
      text: 'It triggers the initial communications blackout and the simulated World War III.',
      rationale:
        'The first 72 hours of simulated World War III and communications blackout come first as the Awakening Cracks. The fourth pulse is later, as the seal breaker.'
    },
    {
      text: 'It clears leftover residue from the first three pulses and glitches NPC perception.',
      rationale:
        'Clearing energetic residue and glitching NPC perception belong to the first flash. The fourth flash is the seal breaker that opens the crystalline gateways.'
    }
  ],
  24: [
    {
      text: 'To realign light-body grids and dissolve mental programming.',
      rationale:
        'Crystal Halls are crystalline temples where souls rest on vibrating slabs to realign their light body grids and dissolve mental programming. Souls hover over slabs that hum at precise frequencies while living crystal walls dissolve mental overlays.'
    },
    {
      text: 'To generate the holographic image of the Saferins for each arriving soul.',
      rationale:
        'Saferins are beings sent from the Council of 12 Suns. They are not generated by the crystal slabs.'
    },
    {
      text: 'To extract genetic material for the Council of Parasitic Races.',
      rationale:
        'The sanctuaries are benevolent frequency environments overseen by Ground Healers. They do not extract genetic material.'
    },
    {
      text: 'To float souls in liquid sound so grief and heartbreak can leave the heart.',
      rationale:
        'Floating in liquid sound is the Phase 1 Water Dome mechanism. Crystal slabs belong to Phase 2, mending the mind.'
    }
  ],
  25: [
    {
      text: 'Human Sols are true spiritual sparks containing the infinite, eternal essence of Source, now inverted in the physical domain.',
      rationale:
        'Human Sols are true spiritual sparks containing the infinite, eternal essence of Source, currently caught and inverted by parasitic operations within the physical domain.'
    },
    {
      text: 'Galan Fragments are the name for inverted souls carrying eternal Source essence inside the physical domain of the Known Lands.',
      rationale:
        'Galan names the Matrix where Tara was located. The souls caught and inverted in the physical domain are called Human Sols.'
    },
    {
      text: 'NPCs are inverted souls that still contain the infinite, eternal essence of Source.',
      rationale:
        'NPCs are hollow background programs and soulless fragments of light. They do not contain the eternal essence of Source.'
    },
    {
      text: 'Vatican Strands are the inverted souls themselves rather than the stolen memory fragments.',
      rationale:
        'Akashic fragments archived beneath the Vatican are extracted memory strands. The inverted souls themselves are Human Sols.'
    }
  ]
};

const questionsMeta = [
  {
    number: 1,
    question:
      'What is the primary defining characteristic that distinguishes Human Sols from Non-Player Characters (NPCs)?',
    hint: 'Consider which group possesses an eternal connection to Source and which is an automated program.'
  },
  {
    number: 2,
    question:
      'Which ancient lineage of souls originated from the pre-fall 5D+ templated world known as Tara?',
    hint: 'The name of this lineage is directly derived from their world of origin.'
  },
  {
    number: 3,
    question:
      'What occurs when a true human soul passes through the portal of the sun in the current inverted system?',
    hint: 'Focus on the mechanism that causes the loss of origin memory.'
  },
  {
    number: 4,
    question:
      'Where are the extracted memory strands, known as Akashic fragments, stored by parasitic forces?',
    hint: 'Identify the physical location on Earth where these spiritual records are inverted and kept.'
  },
  {
    number: 5,
    question:
      "During the first 72 hours of the simulated conflict and blackout, what physical symptoms mark the 'Awakening Cracks'?",
    hint: 'Think about the common physiological signs associated with sudden frequency shifts.'
  },
  {
    number: 6,
    question:
      'What is the specific function of the second cosmic flash among the four solar pulses?',
    hint: 'The second pulse focuses on internal activation and the core organ of resonance.'
  },
  {
    number: 7,
    question:
      'In the Healing Sanctuaries, what is the primary purpose of the Water Domes?',
    hint: 'Consider which phase focuses on mending the emotional body through immersion.'
  },
  {
    number: 8,
    question:
      "Who are the 'Saferins' within the context of the rehabilitation process?",
    hint: 'These entities are the benevolent overseers of the high-frequency healing environments.'
  },
  {
    number: 9,
    question:
      'Which parasitic faction is specifically associated with the siphoning of void plasma?',
    hint: "Look for the group mentioned alongside 'void plasma' in the siphoning list."
  },
  {
    number: 10,
    question:
      'What happens to physical structures like corporate buildings and financial systems as Human Sols raise their frequency?',
    hint: 'Consider the effect of a mismatch between low-frequency matter and a high-frequency environment.'
  },
  {
    number: 11,
    question:
      'What role does ORME (Orbitally Rearranged Monotomic Elements) play in the awakening process?',
    hint: "Look for how these elements interact with the human brain's spiritual antenna."
  },
  {
    number: 12,
    question:
      'What is the primary work performed in the Crystal Halls of the Healing Sanctuaries?',
    hint: 'The Crystal Halls are specifically dedicated to mending the mental aspects of the soul.'
  },
  {
    number: 13,
    question:
      "Which group of souls remains unconscious of the simulated reality and relies on external authority?",
    hint: 'This term refers to human souls who have not yet awakened to the truth of their situation.'
  },
  {
    number: 14,
    question: 'How do ET Sols influence the awakening of Human Sols?',
    hint: 'Consider what happens when ET Sols emit their full broadcast frequency.'
  },
  {
    number: 15,
    question:
      'What choice is presented to Human Sols upon their graduation from the healing sanctuaries?',
    hint: 'The choice involves either leaving the local system or staying in a liberated version of it.'
  },
  {
    number: 16,
    question:
      "What ensures that a Human Sol's unbroken timeline is preserved despite artificial memory wipes?",
    hint: 'Look for a natural, planetary recording mechanism that bypasses human-made databases.'
  },
  {
    number: 17,
    question:
      'The Emergency Broadcast System (EBS) activates souls by releasing which of the following?',
    hint: 'Think about the progression of information used to dismantle a false perception of reality.'
  },
  {
    number: 18,
    question: "What is the primary role of the Taran Sols in the Known Lands today?",
    hint: 'Their ancient DNA templates are essential for the stability of the world\'s transition.'
  },
  {
    number: 19,
    question:
      'Which parasitic group harvests ritual astral energy from human souls?',
    hint: "This group's harvest is ritual astral energy, not fear, bloodlines, genetics, or void plasma."
  },
  {
    number: 20,
    question:
      'In Phase 3 of the Healing Sanctuaries, what are the floating etheric cocoons called?',
    hint: 'These pods use light frequency streams to mend deep soul fractures.'
  },
  {
    number: 21,
    question:
      'True or False: NPCs (Non-Player Characters) carry a sovereign spiritual lineage and are subjects of the multi-dimensional rescue operation.',
    hint: "Differentiate between 'true spiritual sparks' and 'automated background programs'."
  },
  {
    number: 22,
    question:
      'What triggers the automatic activation of natural harmonic codes within a Human Sol?',
    hint: 'Think about the interaction between starseeds and human soul matrices.'
  },
  {
    number: 23,
    question:
      "The fourth solar pulse is described as a 'seal breaker' because it specifically does what?",
    hint: 'This final pulse completes the connection to the planetary and galactic crystalline architecture.'
  },
  {
    number: 24,
    question:
      'What is the primary function of the vibrating slabs in the Crystal Halls?',
    hint: "These slabs are part of the 'Mending the Mind' phase of rehabilitation."
  },
  {
    number: 25,
    question:
      'Which term describes human souls who are caught and inverted by parasitic operations but contain an eternal essence?',
    hint: 'This is the primary term used to describe the subjects of the rescue operation.'
  }
];

const QUIZ_DESC =
  'Test your understanding of Human Sols — true spiritual sparks inverted by parasites, Taran lineage, the Amnesia Vortex and Vatican archive, solar pulses, Water Domes, Crystal Halls, Star Pods, and the sovereign choice after restoration.';

// --- Build questions ---
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
    'Test your grasp of Human Sols — true spiritual sparks inverted by parasites, Taran lineage, the Amnesia Vortex and Vatican archive, solar pulses, Water Domes, Crystal Halls, Star Pods, and the sovereign choice after restoration.',
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'Human Sols are true spiritual sparks of Source, inverted through the Amnesia Vortex and Vatican-archived memory strands, then awakened through EBS, solar pulses, and the three Healing Sanctuaries. Sit with the Taran anchors, the ET Sol activation key, and the sovereign choice after graduation: higher dimensions with galactic family, or a freer Known Lands cycle. Return to the Human Sols deep-dive, infographic, and video transmissions as those codes come online.'
  },
  relatedTopic: {
    href: `/deep-dive.html?source=${SOURCE}&topic=${TOPIC_ID}`,
    label: `Return to ${TOPIC_TITLE} deep-dive`
  },
  questions
};

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
  throw new Error('human-sols not found in breakdown-topics.json');
}

const afterOthers = collectImageFields(mono.topics)
  .filter((e) => e.id !== TOPIC_ID)
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();
if (JSON.stringify(beforeOthers) !== JSON.stringify(afterOthers)) {
  throw new Error('Safety check failed: another topic image path was modified');
}

fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'code-dissolution.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Human Sols: true spiritual sparks inverted by parasites, Taran lineage, the Amnesia Vortex and Vatican archive, solar pulses, Water Domes, Crystal Halls, Star Pods, and the sovereign choice after restoration.';
const replacements = [
  ['Code Dissolution Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Code Dissolution: NPC programs as soulless background fragments, frequency-fracture stages, dissolving loops, perception-based solidity, and starving the parasitic grid as the overlay collapses.',
    desc
  ],
  ['quiz/breakdown/code-dissolution.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/code-dissolution.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=code-dissolution',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Code Dissolution deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['data/quizzes/breakdown/code-dissolution.json', `data/quizzes/${SOURCE}/${TOPIC_ID}.json`]
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 90));
  }
  html = html.split(a).join(b);
}

html = html.replace(/Code Dissolution/g, TOPIC_TITLE);
html = html
  .replace(/code-dissolution\.webp/g, 'human-sols.webp')
  .replace(/code-dissolution\.json/g, 'human-sols.json')
  .replace(/code-dissolution\.html/g, 'human-sols.html')
  .replace(/topic=code-dissolution/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/code-dissolution.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/human-sols.json'
);
