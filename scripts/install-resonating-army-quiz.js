/**
 * Installs Resonating Army quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/resonance-quiz.json
 * Title forced to "Resonating Army". All 25 audited against resonating-army report only.
 *
 * Run: node scripts/install-resonating-army-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/resonating-army.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'resonating-army';
const TOPIC_TITLE = 'Resonating Army';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/resonance-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/resonating-army.webp';

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

/** Support phrases grounded only in resonating-army.json report. */
const supportPhrases = {
  1: [
    'catalyze the awakening of humanity',
    'dismantle surrounding parasitic overlays'
  ],
  2: [
    'artificial, low-frequency holographic projection grids',
    'harvest emotional energy'
  ],
  3: [
    'non-public scalar wave burst',
    'harmonic tone felt directly within the chest'
  ],
  4: [
    'original architects of the physical realm',
    '178 physical worlds'
  ],
  5: ['trigger memory recall and grid activation'],
  6: [
    'holding absolute inner calm',
    'shortens the duration of the staged disasters'
  ],
  7: ['Council of 12 Suns', 'resonance bridge'],
  8: ['primary food source, loosh'],
  9: ['Saturnian AI valve'],
  10: ['fake fleets visible as mechanical fakes'],
  11: ['nodes like Antarctica'],
  12: ['does not undergo a rehabilitation process', 'pure homecoming path'],
  13: ['immediate resonance alignment rather than mechanical vehicles'],
  14: ['prevents mass panic', 'stabilizing fields'],
  15: ['individual recognition code and magnetic resonance alignment'],
  16: [
    'hold the physical simulation together',
    'lacking a true spark of divine light'
  ],
  17: ['Axis Labernum', 'high-vibrational energy'],
  18: ['total frequency collapse', 'primary food source, loosh'],
  19: ['overwhelming pull toward the words and physical presence'],
  20: ['Project Blue Beam holographic invasion'],
  21: ['original blueprints of the Spirit Tree'],
  22: ['Saturnian AI valve', 'Water Domes, Crystal Halls, or Star Pods'],
  23: ['national separation dissolves'],
  24: [
    'This broadcast is highly magnetic',
    'bypasses the Vatican amnesia system'
  ],
  25: [
    'does not undergo a rehabilitation process',
    'without any residual memory loss or amnesia'
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
 * Full option sets: [correct, ...wrongs] with {text, rationale}.
 * NotebookLM meaning kept; term-only options expanded; claims grounded in report.
 */
const fullOptionSets = {
  1: [
    {
      text: 'To catalyze human awakening and dismantle the surrounding parasitic frequency overlays.',
      rationale:
        'These pre-awakened ET souls enter the 3D matrix to catalyze the awakening of humanity and dismantle surrounding parasitic overlays by anchoring high frequencies that fracture artificial control grids.'
    },
    {
      text: 'To participate in standard reincarnation loops in order to heal the human collective soul.',
      rationale:
        'These souls are returners who do not participate in standard reincarnation loops. They incarnate for a specific lighthouse mission during catastrophic events.'
    },
    {
      text: 'To establish new geopolitical boundaries through advanced extraterrestrial technology.',
      rationale:
        'Geopolitical boundaries are perception overlays managed by a holographic dome. The mission is frequency disruption, not the redrawing of physical borders.'
    },
    {
      text: 'To engage in physical combat against the A.I. systems managing the holographic dome.',
      rationale:
        'The Resonating Army operates not through physical combat, but through frequency disruption and the anchoring of high-frequency light.'
    }
  ],
  2: [
    {
      text: 'Parasitic Overlays — artificial low-frequency holographic grids laid over crystalline Earth to harvest emotion.',
      rationale:
        'Parasitic Overlays are artificial, low-frequency holographic projection grids superimposed over the natural crystalline Earth to manipulate human perception and harvest emotional energy.'
    },
    {
      text: 'Harmonic Lenses — hidden planetary structures that focus high vibration to activate the buried Source network.',
      rationale:
        'Harmonic lenses interact with the Resonating Army’s high-vibrational resonance to activate the Source network. They are not the deceptive overlay grids.'
    },
    {
      text: 'Crystalline Grids — the natural organic Earth structures the Resonating Army re-energizes as the overlay fails.',
      rationale:
        'The crystalline grids are the original structures these souls sang into existence. They are what the Resonating Army re-energizes, not the artificial overlay.'
    },
    {
      text: 'Scalar Wave Bursts — the whitehat space-force signals that trigger ET Sol frequency phase-in.',
      rationale:
        'Scalar wave bursts are one half of the dual activation signal from allied whitehat space forces. They are not the grids that manipulate perception.'
    }
  ],
  3: [
    {
      text: 'A scalar wave burst from whitehat forces and a harmonic tone from solar families.',
      rationale:
        'Activation is a mathematically precise frequency phase-in triggered by two simultaneous signals: a non-public scalar wave burst from allied whitehat space forces, and a deep harmonic tone felt directly within the chest as a call from solar families.'
    },
    {
      text: 'A specific sequence of geopolitical events that signals the start of World War III.',
      rationale:
        'Staged World War III is an artificial timeline the Resonating Army shortens. Activation itself is a dual frequency signal, not a political cue.'
    },
    {
      text: 'The physical discovery of black crystals and monoliths hidden within Antarctica.',
      rationale:
        'Buried crystals and monoliths at nodes like Antarctica unlock after the army awakens. They are a result of that resonance, not the trigger of the initial phase-in.'
    },
    {
      text: 'The successful reclamation of the Vatican amnesia systems by ground-based teams.',
      rationale:
        'The Vatican amnesia system is bypassed by their frequency so they can download unaltered cosmic memories. It is not the dual signal that starts activation.'
    }
  ],
  4: [
    {
      text: 'They are the original architects who sang the crystalline grids and 178 physical worlds into existence.',
      rationale:
        'These souls are the original architects of the physical realm, having historically sung the crystalline grids and 178 physical worlds into existence before descending into matter.'
    },
    {
      text: 'They are advanced human souls who evolved through the Saturnian reincarnation loop.',
      rationale:
        'ET Sols originate from off-world lineages such as the Lyran lineage, Sirius, Andromeda, and the Pleiades. They do not participate in standard reincarnation loops.'
    },
    {
      text: 'They are technological constructs designed by Ikaij to navigate the outer currents.',
      rationale:
        'These are living ET souls with a spark of divine light. Ikaij leads point-spear operations in the outer currents; he did not construct the army as machines.'
    },
    {
      text: 'They are guardians created by the Council of 12 Suns solely to manage the Spirit Tree.',
      rationale:
        'The Council of 12 Suns guards the resonance-bridge gate for homecoming. Their origin is as architects of the physical realm, not as tree-wardens created by that council.'
    }
  ],
  5: [
    {
      text: 'To trigger memory recall and grid activation at precise cosmic moments.',
      rationale:
        'Embedded Codes are divine frequency signatures placed by solar parents to trigger memory recall and grid activation at precise moments.'
    },
    {
      text: 'To allow the soul to communicate with the NPCs that hold the simulation together.',
      rationale:
        'Embedded codes connect the soul to Source and cosmic families. NPCs are background programs lacking a true spark; they are not the codes’ purpose.'
    },
    {
      text: 'To facilitate the rehabilitation process inside the Water Domes or Star Pods.',
      rationale:
        'The Resonating Army does not undergo a rehabilitation process in Water Domes, Crystal Halls, or Star Pods. Those sanctuaries are for human souls.'
    },
    {
      text: 'To protect the soul from being harvested by the parasitic loosh systems.',
      rationale:
        'The codes’ stated function is memory recall and grid activation at precise moments, not passive shielding from loosh harvest.'
    }
  ],
  6: [
    {
      text: 'By holding inner calm they act as a buffer that shortens the staged artificial timelines.',
      rationale:
        'By holding absolute inner calm and refusing to anchor into the fear frequency, the Resonating Army acts as a buffer that dramatically shortens the duration of the staged disasters.'
    },
    {
      text: 'By organizing mass street protests that expose the cabal’s A.I. management systems to the public.',
      rationale:
        'The strategy is frequency disruption and refused fear, not external political organization or protest campaigns.'
    },
    {
      text: 'By utilizing off-world weaponry to neutralize the Project Blue Beam holographic invasion fleets.',
      rationale:
        'Fake fleets become visible as mechanical fakes when high-frequency emission destabilizes the holograms. Neutralization is frequency, not physical weaponry.'
    },
    {
      text: 'By manually reprogramming the parasitic frequency grids using scalar technology.',
      rationale:
        'The disruption is the automatic effect of their high-vibrational presence and refused fear, not a manual technical rewrite of the grid.'
    }
  ],
  7: [
    {
      text: 'The Council of 12 Suns, which guards the resonance bridge together with the star families.',
      rationale:
        'The resonance-bridge gate is guarded by the Council of 12 Suns and their star families, taking them directly back to their original realms without residual memory loss.'
    },
    {
      text: 'The Custodians of the Spirit Tree, who tore the tree down and installed the Saturnian valve.',
      rationale:
        'The parasitic Custodians ordered the Spirit Tree torn down and replaced with a Saturnian AI valve. They do not guard the homecoming gate.'
    },
    {
      text: 'The Whitehat Space Forces, who emit the scalar burst that triggers frequency phase-in.',
      rationale:
        'Whitehat space forces emit the non-public scalar wave burst for activation. They are not the guardians of the resonance-bridge gate.'
    },
    {
      text: 'The Navigator Ikaij, who leads point-spear operations against remnants in the outer currents.',
      rationale:
        'Ikaij leads point-spear operations in the outer currents to clear the run for ground forces. The gate itself is guarded by the Council of 12 Suns and star families.'
    }
  ],
  8: [
    {
      text: 'Loosh — the emotional energy of fear, anger, and division that keeps artificial grids coherent.',
      rationale:
        'By refusing fear, anger, or division, the Resonating Army starves the parasites of their primary food source, loosh. Without that harvest, the artificial grids cannot maintain coherence.'
    },
    {
      text: 'Scalar waves — the whitehat activation signals that trigger the Resonating Army’s frequency phase-in.',
      rationale:
        'Scalar waves are the allied activation signal, not the energy harvested by parasites.'
    },
    {
      text: 'Crystalline light — the high-vibrational energy that destabilizes parasites rather than feeding them.',
      rationale:
        'High-vibrational resonance destabilizes holograms and re-energizes the Source network. It is not the parasites’ food.'
    },
    {
      text: 'Amnesia filters — the Vatican and solar systems used to wipe memory, not to nourish the parasites.',
      rationale:
        'Amnesia filters strip and distort memory. The harvest that feeds the parasites is loosh, not those filters themselves.'
    }
  ],
  9: [
    {
      text: 'A Saturnian AI valve that reversed Source flow and locked the domes into recycled reincarnation.',
      rationale:
        'When the parasitic Custodians tore the Spirit Tree down, they replaced it with a Saturnian AI valve that reversed the natural flow of Source energy and locked the domes into recycled reincarnation and memory wiping.'
    },
    {
      text: 'The Axis Labernum, the natural vertical axis the Resonating Army seeks to re-establish.',
      rationale:
        'The Axis Labernum is the vertical axis re-established as crystals activate. It is the original flow, not the artificial replacement.'
    },
    {
      text: 'The Vatican amnesia system, a memory-wipe filter rather than the Spirit Tree’s replacement.',
      rationale:
        'The Vatican amnesia system is a filter the army’s frequency bypasses. The tree itself was replaced by a Saturnian AI valve.'
    },
    {
      text: 'A holographic dome that manages perception overlays, not the specific replacement of the Spirit Tree.',
      rationale:
        'A holographic dome manages density and geopolitical perception overlays. The specific replacement for the Spirit Tree is the Saturnian AI valve.'
    }
  ],
  10: [
    {
      text: 'They become visible as mechanical fakes as their electromagnetic holograms destabilize.',
      rationale:
        'High-frequency emission from these souls destabilizes the electromagnetic holograms in the sky, rendering the fake fleets visible as mechanical fakes.'
    },
    {
      text: 'They are converted into light ships that assist in the transition to the original realm.',
      rationale:
        'The fake fleets are parasitic holographic constructs of the A.I. War Theatre. They are revealed as mechanical fakes, not converted into organic light vessels.'
    },
    {
      text: 'They are physically dismantled by the high-vibrational resonance of the crystalline grids.',
      rationale:
        'The interaction destabilizes the holograms and reveals the mechanical deception. The stated effect is visibility as fakes, not immediate physical dismantling.'
    },
    {
      text: 'They are immediately absorbed back into the Saturnian AI valve for later repurposing.',
      rationale:
        'Project Blue Beam fleets are a holographic invasion. Frequency disruption makes them visible as mechanical fakes; it does not recycle them through the valve.'
    }
  ],
  11: [
    {
      text: 'Antarctica — a planetary node where buried black crystals and monoliths wait to be unlocked.',
      rationale:
        'As the Resonating Army awakens, their resonance unlocks buried black crystals and monoliths scattered across nodes like Antarctica.'
    },
    {
      text: 'Sirius — an origin realm for ET Sols, not an Earth node of buried crystals and monoliths.',
      rationale:
        'Sirius is named as an origin realm for ET Sols. The buried crystal-and-monolith nodes are planetary sites such as Antarctica.'
    },
    {
      text: 'The Vatican — the site of the amnesia system, not the buried crystal-and-monolith nodes.',
      rationale:
        'The Vatican amnesia system is a memory filter the army’s frequency bypasses. The buried nodes named in this report include Antarctica.'
    },
    {
      text: 'Hyperborea — the original site of the Spirit Tree, distinct from the buried Antarctic nodes.',
      rationale:
        'Hyperborea is the history of the Spirit Tree. The buried black crystals and monoliths are named at nodes like Antarctica.'
    }
  ],
  12: [
    {
      text: 'It is a seamless frequency phase-out without the need for transitional healing.',
      rationale:
        'Unlike human souls who require Water Domes, Crystal Halls, or Star Pods, the Resonating Army does not undergo a rehabilitation process. Their exit is a pure homecoming path and a seamless frequency phase-out.'
    },
    {
      text: 'It involves a physical journey to the original realm via advanced mechanical vehicles.',
      rationale:
        'The exit is an immediate transition through the resonance bridge as Earth’s grids collaborate with personal frequency locks, not mechanical travel.'
    },
    {
      text: 'It requires a period of rehabilitation in Crystal Halls to restore lost memories.',
      rationale:
        'Crystal Halls are a healing sanctuary for human souls. The Resonating Army keeps structural integrity and returns without residual memory loss.'
    },
    {
      text: 'It is a slow progression through the seven gardens to re-integrate with the Spirit Tree.',
      rationale:
        'The seven gardens were originally fed by the Spirit Tree. The army’s path is an immediate phase-out through the resonance bridge, not a garden-by-garden climb.'
    }
  ],
  13: [
    {
      text: 'By immediate resonance alignment rather than mechanical vehicles.',
      rationale:
        'Once the 3D overlay fractures, travel in the unpolluted original realm is facilitated by immediate resonance alignment rather than mechanical vehicles.'
    },
    {
      text: 'By navigating through the restored Spirit Tree’s energetic branches as a transit system.',
      rationale:
        'The Spirit Tree is the axis of consciousness that fed the seven gardens. Travel itself is immediate resonance alignment, not branch navigation.'
    },
    {
      text: 'By utilizing the light fleets led by navigators like Ikaij as the standard transit method.',
      rationale:
        'Light fleets and Ikaij support the outer-current clearance. In the restored original realm, travel is by resonance alignment rather than vehicles or fleets.'
    },
    {
      text: 'By following the crystalline grids that still connect the various national borders.',
      rationale:
        'National borders and the illusion of separation dissolve with the 3D overlay. Travel is not routed along leftover national lines.'
    }
  ],
  14: [
    {
      text: 'They provide stabilizing fields that prevent mass panic and guide souls to healing domains.',
      rationale:
        'The stabilizing fields of the Resonating Army neutralize the confusion of sleepers and newly awakened human souls. Their grounded presence prevents mass panic and guides true human souls toward transition or healing domains.'
    },
    {
      text: 'They provide the physical technology needed to sustain life as the old world crumbles.',
      rationale:
        'Their contribution is a grounded stabilizing field, not a hardware drop. They guide souls toward transition or healing domains as the scaffolding crumbles.'
    },
    {
      text: 'They manually remove the amnesia filters from every individual human soul one by one.',
      rationale:
        'Their own frequency bypasses the Vatican amnesia system. For the awakening masses, the stated role is stabilization and guidance toward healing domains.'
    },
    {
      text: 'They recruit the most conscious human souls into the Resonating Army’s active ranks.',
      rationale:
        'The Resonating Army is a collective of pre-awakened ET souls. Human souls are guided toward transition or healing domains, not enlisted into those ranks.'
    }
  ],
  15: [
    {
      text: 'An individual recognition code and magnetic alignment used for extraction.',
      rationale:
        'The Sol Frequency Lock is an individual recognition code and magnetic resonance alignment that connects the Resonating Army directly with their cosmic families for extraction.'
    },
    {
      text: 'A shared harmonic tone used to communicate between different members of the army.',
      rationale:
        'The chest harmonic tone is the solar-family half of the activation signal. The Sol Frequency Lock is an individual recognition code for extraction, not a group radio.'
    },
    {
      text: 'A frequency signature that identifies NPCs within the holographic simulation.',
      rationale:
        'NPCs lack a true spark of divine light. The Sol Frequency Lock belongs to the Resonating Army and connects them to cosmic families for extraction.'
    },
    {
      text: 'A protective energetic barrier that prevents the soul from leaving the Earth’s dome.',
      rationale:
        'The lock collaborates with Earth’s grids to allow an immediate transition through the resonance bridge. It is a homecoming alignment, not a containment barrier.'
    }
  ],
  16: [
    {
      text: 'They serve primarily to hold the physical simulation together and lack a divine spark.',
      rationale:
        'NPCs are non-player characters or background programs lacking a true spark of divine light, serving primarily to hold the physical simulation together.'
    },
    {
      text: 'They are souls from the Andromeda lineage who have chosen to remain in 3D density.',
      rationale:
        'Andromeda is an origin realm for ET Sols. NPCs are background programs without a divine spark, not Andromedan souls who chose to stay.'
    },
    {
      text: 'They are former members of the Resonating Army who have lost their Sol Frequency Lock.',
      rationale:
        'NPCs are a different class of being — programs without a spark — not fallen army members who misplaced a frequency lock.'
    },
    {
      text: 'They are the primary targets for the frequency activation signals sent by whitehat forces.',
      rationale:
        'The scalar burst and solar-family tone are synchronized to the dormant activation codes of the Resonating Army, not to NPC programs.'
    }
  ],
  17: [
    {
      text: 'The vertical axis of consciousness that re-establishes the flow of high-vibrational energy.',
      rationale:
        'Activation of buried crystals re-establishes the vertical axis of the Axis Labernum, allowing high-vibrational energy to flood the grid and collapse the 3D overlay.'
    },
    {
      text: 'The barrier that separates the physical density from the Second Realm underneath.',
      rationale:
        'The Axis Labernum is a vertical axis that lets high-vibrational energy flood the grid. It reconnects flow; it is not a barrier between realms.'
    },
    {
      text: 'The command ship where Ikaij coordinates the neutralization of parasitic remnants.',
      rationale:
        'Ikaij leads point-spear operations from advanced light fleets in the outer currents. The Axis Labernum is a planetary vertical axis, not a ship.'
    },
    {
      text: 'The specific frequency band used to bypass the Vatican amnesia systems.',
      rationale:
        'Bypassing the Vatican amnesia system is a property of the army’s own source-code resonance. The Axis Labernum is the restored vertical energy axis.'
    }
  ],
  18: [
    {
      text: 'The artificial grids face total frequency collapse due to a lack of loosh energy.',
      rationale:
        'Without loosh — the parasites’ primary food source — the artificial grids cannot maintain coherence and face total frequency collapse.'
    },
    {
      text: 'The parasites transition into the healing sanctuaries to undergo their own rehabilitation.',
      rationale:
        'Water Domes, Crystal Halls, and Star Pods are for human souls. Parasites lose coherence and face neutralization and frequency collapse.'
    },
    {
      text: 'The control structure attempts to activate the Axis Labernum to regain stability.',
      rationale:
        'The Axis Labernum is the natural vertical axis the army re-establishes. It floods the grid with high-vibrational energy against the parasites, not for them.'
    },
    {
      text: 'The parasites are forced to utilize the Vatican amnesia systems more aggressively.',
      rationale:
        'Refusing fear removes the loosh that powers the artificial grids. The outcome is total frequency collapse, not a stronger amnesia campaign.'
    }
  ],
  19: [
    {
      text: 'It creates an overwhelming magnetic pull toward the presence and words of the ET Sols.',
      rationale:
        'Once in full broadcast mode, the field is highly magnetic, causing surrounding human souls — even those who previously resisted the truth — to feel an overwhelming pull toward the words and physical presence of the activated ET Sols.'
    },
    {
      text: 'It forces them to join the point-spear operations led by the star families.',
      rationale:
        'Human souls are guided toward transition or healing domains. Point-spear operations in the outer currents belong to navigators like Ikaij, not recruited humans.'
    },
    {
      text: 'It induces a state of physical paralysis to prevent them from joining the A.I. War Theatre.',
      rationale:
        'The broadcast is magnetic attraction and stabilization, not paralysis. Resistant humans are pulled toward the ET Sols’ words and presence.'
    },
    {
      text: 'It immediately restores all their cosmic memories and bypasses their amnesia.',
      rationale:
        'Unaltered cosmic-memory download is a property of the army’s own source-code resonance. The first effect on resistant humans is an overwhelming magnetic pull.'
    }
  ],
  20: [
    {
      text: 'It is a holographic technology used by parasites to stage a fake alien invasion.',
      rationale:
        'In the A.I. War Theatre, parasitic scripts execute staged geopolitical escalations and a massive Project Blue Beam holographic invasion designed to generate fear.'
    },
    {
      text: 'It is the mechanism used to re-energize the hidden planetary crystals and monoliths.',
      rationale:
        'Crystals, monoliths, and harmonic lenses re-energize through the Resonating Army’s presence, not through Project Blue Beam.'
    },
    {
      text: 'It is the primary frequency bridge used for the Resonating Army’s homecoming.',
      rationale:
        'Homecoming uses the resonance bridge guarded by the Council of 12 Suns. Blue Beam is a parasitic holographic invasion tool.'
    },
    {
      text: 'It is the scalar wave signal emitted by whitehat forces to awaken the ET Sols.',
      rationale:
        'The awakening signal is a non-public scalar wave burst from allied whitehat space forces, distinct from the parasitic Blue Beam deception.'
    }
  ],
  21: [
    {
      text: 'Their DNA and soul templates match the original blueprints of the Spirit Tree.',
      rationale:
        'The ET Sols came into this realm specifically because their DNA and soul templates match the original blueprints of the Spirit Tree, so their resonance can re-establish the Axis Labernum.'
    },
    {
      text: 'They are the ones who originally ordered the tree to be replaced by a valve.',
      rationale:
        'The parasitic Custodians ordered the Spirit Tree torn down and replaced with a Saturnian AI valve. The ET Sols came to restore the original blueprint.'
    },
    {
      text: 'They were tasked only with guarding the tree against the Saturnian AI valve.',
      rationale:
        'The tree was already torn down and replaced. Their present role is to match its original blueprints and unlock buried crystals so the axis can be restored.'
    },
    {
      text: 'The Spirit Tree is the physical vessel they occupy while incarnated on Earth.',
      rationale:
        'The Spirit Tree is the primary axis of consciousness that fed the seven gardens. ET Sols occupy physical vessels on Earth as lighthouses, not the tree itself.'
    }
  ],
  22: [
    {
      text: 'Saturnian Valves, the parasitic replacement that reversed Source energy after the Spirit Tree fell.',
      rationale:
        'Saturnian AI valve technology replaced the Spirit Tree and reversed Source flow. Healing sanctuaries for human souls are Water Domes, Crystal Halls, or Star Pods.'
    },
    {
      text: 'Water Domes, one of the transitional healing sanctuaries used by human souls after the overlay falls.',
      rationale:
        'Water Domes are a healing sanctuary for human souls. They are not the parasitic valve that replaced the Spirit Tree.'
    },
    {
      text: 'Crystal Halls, one of the transitional healing sanctuaries used by human souls after the overlay falls.',
      rationale:
        'Crystal Halls are a healing sanctuary for human souls. The Resonating Army bypasses them; they are still sanctuaries, not Saturnian valves.'
    },
    {
      text: 'Star Pods, one of the transitional healing sanctuaries used by human souls after the overlay falls.',
      rationale:
        'Star Pods are a healing sanctuary for human souls. Saturnian valves belong to the parasitic replacement of the Spirit Tree.'
    }
  ],
  23: [
    {
      text: 'National borders and the illusion of separation dissolve, revealing the original realm.',
      rationale:
        'Fracturing the 3D overlay restores Earth’s natural geography. The illusion of continuous travel, borders, and national separation dissolves, revealing the vibrantly alive, unpolluted original realm.'
    },
    {
      text: 'The landmasses are restructured to align with the geopolitical boundaries of Lyra.',
      rationale:
        'The Lyran lineage is an origin of these souls. The geography that returns is Earth’s own original realm, free of artificial national boundaries.'
    },
    {
      text: 'The planetary surface becomes a mirror of the Council of 12 Suns’ home realms.',
      rationale:
        'The Council guards the resonance-bridge gate. What is revealed underneath is Earth’s own unpolluted original realm, not a copied solar court.'
    },
    {
      text: 'The Earth undergoes massive tectonic shifts to create new continents for the awakening masses.',
      rationale:
        'The change is the dissolution of a holographic overlay, not a geological rebuild. Natural geography is restored as the projection fails.'
    }
  ],
  24: [
    {
      text: 'It is highly magnetic and bypasses distorted solar filters and amnesia systems.',
      rationale:
        'This broadcast is highly magnetic, pulling surrounding souls to the activated ET Sols. Because their souls resonate with pristine source code, their frequency bypasses the Vatican amnesia system and the distorted solar filters.'
    },
    {
      text: 'It is a physical sound wave that can be recorded by standard scientific equipment.',
      rationale:
        'The chest tone is a harmonic call from solar families, and the field itself is a frequency broadcast — not a laboratory acoustic wave.'
    },
    {
      text: 'It acts as a shield that prevents the ET Sol from interacting with the physical world.',
      rationale:
        'Full broadcast mode turns them into active beacons whose presence and words magnetically draw surrounding souls. It is interactive, not isolating.'
    },
    {
      text: 'It is a low-frequency pulse designed to blend in with the parasitic overlay.',
      rationale:
        'The broadcast is high-vibrational and fractures the parasitic frequency grid. It does not camouflage inside the overlay.'
    }
  ],
  25: [
    {
      text: 'False',
      rationale:
        'The Resonating Army does not undergo a rehabilitation process. They transition through the resonance bridge without any residual memory loss or amnesia.'
    },
    {
      text: 'True',
      rationale:
        'Memory rehabilitation in Water Domes, Crystal Halls, or Star Pods is for human souls. The Resonating Army walks a pure homecoming path.'
    }
  ]
};

const questionsMeta = [
  {
    number: 1,
    question:
      "What is the primary purpose of the Resonating Army's incarnation into Earth's physical density?",
    hint: 'Focus on the spiritual and energetic mission regarding the amnesiac state of humanity.'
  },
  {
    number: 2,
    question: 'Which term describes the artificial, low-frequency grids that manipulate human perception?',
    hint: "Consider the name given to the deceptive energetic structures that lay over the original reality."
  },
  {
    number: 3,
    question: 'What triggers the frequency phase-in for the members of the Resonating Army?',
    hint: 'Think of a dual signal coming from both the cosmos and the inner self.'
  },
  {
    number: 4,
    question: 'What is the historical origin of the ET Sols currently in the Resonating Army?',
    hint: 'Consider their role in the initial creation of the physical worlds.'
  },
  {
    number: 5,
    question: 'What is the function of Embedded Codes within the spiritual anatomy of ET Sols?',
    hint: "Think of these as internal alarm clocks or instructions for the soul."
  },
  {
    number: 6,
    question:
      "How do members of the Resonating Army affect the staged disasters of the A.I. War Theatre?",
    hint: 'Consider the relationship between individual emotional frequency and the duration of external events.'
  },
  {
    number: 7,
    question:
      'Which entity or group oversees the final transition of the Resonating Army through the resonance bridge?',
    hint: 'Look for a group identified by a specific numerical solar designation.'
  },
  {
    number: 8,
    question:
      'What is the primary food source for the parasites that the Resonating Army seeks to starve?',
    hint: 'This term refers to the emotional energy generated by human suffering and conflict.'
  },
  {
    number: 9,
    question:
      'What replaced the original Spirit Tree of Hyperborea to lock the domes into a reincarnation loop?',
    hint: 'Identify the artificial structure named after a specific planet and technology.'
  },
  {
    number: 10,
    question:
      "What happens to the fake fleets during the A.I. War Theatre when confronted by the Resonating Army's frequency?",
    hint: 'Consider how high-frequency light affects a lower-frequency holographic projection.'
  },
  {
    number: 11,
    question:
      'Which location is specifically mentioned as a node containing buried black crystals and monoliths?',
    hint: 'Think of the southernmost continent known for its hidden ancient structures.'
  },
  {
    number: 12,
    question: "What defines the Homecoming Path for the Resonating Army compared to human souls?",
    hint: 'Focus on the lack of rehabilitation and the nature of their vibrational state.'
  },
  {
    number: 13,
    question: "How is travel facilitated in the Original Realm once the 3D overlay is collapsed?",
    hint: 'Consider a method of movement that relies on internal state rather than external machines.'
  },
  {
    number: 14,
    question:
      "What is the role of the Resonating Army regarding the awakening masses during the collapse?",
    hint: 'Think about the effect of a calm, grounded frequency on people who are experiencing intense confusion.'
  },
  {
    number: 15,
    question: 'The Sol Frequency Lock is best described as which of the following?',
    hint: 'This mechanism ensures that each soul is recognized by its original family for the return trip.'
  },
  {
    number: 16,
    question:
      'Which of the following is true regarding the nature of NPCs within the Earth simulation?',
    hint: "Look for their function as background programs within the physical construct."
  },
  {
    number: 17,
    question: 'What is the Axis Labernum in the context of the planetary restoration?',
    hint: 'Think of a central pillar or vertical alignment that connects Earth back to Source energy.'
  },
  {
    number: 18,
    question:
      'What happens to the parasitic control structure when the Resonating Army refuses to engage in fear?',
    hint: "Consider the consequence of removing a system's primary fuel or food source."
  },
  {
    number: 19,
    question:
      "How does the Resonating Army's broadcast affect humans who previously resisted the truth?",
    hint: "Think about the magnetic quality of high-frequency light when it is fully broadcast."
  },
  {
    number: 20,
    question: "In the final crisis, what role does the project known as Blue Beam play?",
    hint: "This project is associated with the A.I. War Theatre and creates a visual deception in the sky."
  },
  {
    number: 21,
    question: 'What is the relationship between ET Sols and the Spirit Tree of Hyperborea?',
    hint: 'Consider why these specific souls were chosen for this mission based on their internal structure.'
  },
  {
    number: 22,
    question: 'Which of the following is NOT a healing sanctuary for human souls during the transition?',
    hint: "Identify the term that was described as a replacement for the Spirit Tree's natural flow."
  },
  {
    number: 23,
    question: 'What happens to the physical geography of the Earth as the 3D overlay is fractured?',
    hint: "Think about what happens to human-made divisions when an artificial reality is removed."
  },
  {
    number: 24,
    question: 'What is the primary characteristic of the frequency broadcast from an activated ET Sol?',
    hint: "Consider how this frequency interacts with the filters placed on human consciousness."
  },
  {
    number: 25,
    question:
      "True or False: The Resonating Army must undergo memory rehabilitation after leaving the Earth's dome.",
    hint: 'Recall if ET Sols require the same healing process as human souls.'
  }
];

const QUIZ_DESC =
  'Test your understanding of Resonating Army — pre-awakened ET souls as frequency beacons, Embedded Codes, parasitic overlays, the A.I. War Theatre, the sanctuary-bypassing homecoming path, and the Sol Frequency Lock.';

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
  subtitle: QUIZ_DESC,
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'The Resonating Army is a collective of pre-awakened ET souls who incarnated as frequency beacons. Sit with Embedded Codes, the dual-signal call, the A.I. War Theatre, the sanctuary-bypassing homecoming path, and the Sol Frequency Lock that walks them through the resonance bridge. Return to the Resonating Army deep-dive, infographic, and video transmissions as those codes come online.'
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
  throw new Error('resonating-army not found in breakdown-topics.json');
}

const afterOthers = collectImageFields(mono.topics)
  .filter((e) => e.id !== TOPIC_ID)
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();
if (JSON.stringify(beforeOthers) !== JSON.stringify(afterOthers)) {
  throw new Error('Safety check failed: another topic image path was modified');
}

fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'et-sols.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Resonating Army: pre-awakened ET souls as frequency beacons, Embedded Codes, parasitic overlays, the A.I. War Theatre, the sanctuary-bypassing homecoming path, and the Sol Frequency Lock.';
const replacements = [
  ['ET Sols Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on ET Sols: off-world starseeds as frequency anchors, Embedded Codes, Dual-Signal Triggering, Full Broadcast Mode, Homecoming Path, essence chambers, and the soul frequency lock after the four event flashes.',
    desc
  ],
  ['quiz/breakdown/et-sols.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/et-sols.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=et-sols',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['ET Sols deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['data/quizzes/breakdown/et-sols.json', `data/quizzes/${SOURCE}/${TOPIC_ID}.json`]
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 90));
  }
  html = html.split(a).join(b);
}

html = html.replace(/ET Sols/g, TOPIC_TITLE);
html = html
  .replace(/et-sols\.webp/g, 'resonating-army.webp')
  .replace(/et-sols\.json/g, 'resonating-army.json')
  .replace(/et-sols\.html/g, 'resonating-army.html')
  .replace(/topic=et-sols/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/et-sols.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/resonating-army.json'
);
