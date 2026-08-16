/**
 * Installs True Sparks quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/spark-quiz.json
 * Title forced to "True Sparks". All 25 audited against true-sparks report only.
 *
 * Run: node scripts/install-true-sparks-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/true-sparks.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'true-sparks';
const TOPIC_TITLE = 'True Sparks';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/spark-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/true-sparks.webp';

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

/** Support phrases grounded only in true-sparks.json report. */
const supportPhrases = {
  1: ['eternal consciousness units', 'authentic divine essence'],
  2: [
    'perceive the reality of the simulation and escape the overlay',
    'spark ignition'
  ],
  3: ['soulless background programs and mere fragments of light'],
  4: ['amnesia vortex', "artificial entry bands around the sun's natural gate"],
  5: ['track, recycle, and reincarnate souls'],
  6: [
    'remain unawakened and lack active spark ignition',
    'hollow echo of the three-dimensional illusion'
  ],
  7: ['frequency-based recognition', 'breaking the parasitic spell'],
  8: ['vibrant, unpolluted reality of the second realm'],
  9: ['mends the heart by drawing out emotional density'],
  10: ['mental and energetic healing temples', 'realign the light body grid'],
  11: ['soul and timeline healing', 'reweaving fragmented aspects'],
  12: ['holographic light beings', 'ground healers', 'saferons', 'transition and stabilization'],
  13: ['original crystalline world', 'second realm'],
  14: ['dissolve like shadows when the light hits'],
  15: ['physical structures of the control grid to pixelate, shimmer, and dissolve'],
  16: ['true wealth is defined solely by resonance and shared abundance'],
  17: [
    'seeded into physical humanoid vessels to experience creation',
    'collaborate and connect'
  ],
  18: ['ruins, rubble, and severe shortages, but free of parasite domination'],
  19: ['not an intellectual process but a frequency-based recognition'],
  20: ['overarching stewardship that guides the return'],
  21: ['energetic foundation of the artificial three-dimensional world'],
  22: ['absolute sovereignty to choose their next evolutionary path'],
  23: ['unbroken lineage of source', 'remains intact beneath the amnesia'],
  24: ['immediate telepathic transportation'],
  25: ['resonating army and et alliances descended to liberate']
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
 * NotebookLM meaning kept; lengths evened; claims grounded in the True Sparks report.
 */
const fullOptionSets = {
  1: [
    {
      text: 'Eternal consciousness units carrying the authentic divine essence of Source.',
      rationale:
        'True Sparks represent the authentic divine essence caught in the parasitic simulation. They are the eternal consciousness units the Resonating Army and ET alliances descended to liberate, and they carry inherent connections to Source.'
    },
    {
      text: 'Artificial constructs generated by the parasitic overlay to mimic living humanity.',
      rationale:
        'Parasites cannot generate the first spark of creation or own a soul. They capture and invert existing True Sparks rather than manufacturing authentic souls.'
    },
    {
      text: 'Fragmented light units that lack any inherent connection back to a soul creator.',
      rationale:
        'True Sparks carry an unbroken lineage of Source. Soulless fragments of light describe NPCs, not eternal consciousness units.'
    },
    {
      text: 'Advanced background programs designed to stabilize the holographic grid itself.',
      rationale:
        'Background programs and mere fragments of light describe NPCs. True Sparks are authentic souls, not grid-stabilizing software.'
    }
  ],
  2: [
    {
      text: 'Perceive the reality of the simulation and escape the parasitic overlay.',
      rationale:
        'Spark Ignition is the critical activation of divine consciousness that separates true souls from hollow sleepers, allowing them to perceive the reality of the simulation and escape the overlay.'
    },
    {
      text: 'Modify the solid molecular structure of modern materials through applied technology.',
      rationale:
        'Parasites manipulate the nervous system to make concrete and modern materials appear solid. Spark Ignition is a frequency activation of consciousness, not a technological rewrite of matter.'
    },
    {
      text: 'Merge with non-player characters so the collective frequency can rise as one field.',
      rationale:
        'NPCs are soulless fragments of light that dissolve when the light hits. Spark Ignition separates true souls from hollow sleepers; it does not merge them with NPCs.'
    },
    {
      text: 'Download the entire inverted Akashic record stored in the Vatican soul archive.',
      rationale:
        'The Vatican archive copies, logs, and inverts Akashic fragments to recycle souls. Ignition is perception and escape, not retrieval of that parasitic database.'
    }
  ],
  3: [
    {
      text: 'They are soulless background programs and mere fragments of light.',
      rationale:
        'NPCs are soulless background programs and mere fragments of light. True Sparks are eternal consciousness units with an authentic connection to Source.'
    },
    {
      text: 'They are currently trapped in the amnesia vortex and waiting for solar pulses.',
      rationale:
        'The amnesia vortex intercepts True Sparks passing through the Sun. NPCs never possessed a spark, so they are not souls waiting in that vortex.'
    },
    {
      text: 'They carry high-frequency energetic signatures from the Council of 12 Suns.',
      rationale:
        'Embedded codes sit in True Sparks and ET allies. The Council of 12 Suns guides restoration through Saferons. NPCs are hollow background programs, not coded ET allies.'
    },
    {
      text: 'They have already achieved spark ignition but remain in a deep-sleeper state.',
      rationale:
        'Deep Sleepers are True Sparks who remain unawakened and lack active spark ignition. NPCs never possessed a spark at all.'
    }
  ],
  4: [
    {
      text: 'An amnesia vortex established around the natural gate of the Sun.',
      rationale:
        'The Sun originally functioned as a crystalline transit portal. Parasites built artificial entry bands around that natural gate and established an amnesia vortex that strips memory from passing True Sparks.'
    },
    {
      text: 'The creation of ground healers assigned to oversee the three-dimensional realm.',
      rationale:
        'Ground healers, or Saferons, are holographic light beings who oversee transition and stabilization in the healing domains. They are not the capture mechanism.'
    },
    {
      text: 'Direct physical takeover of the crystalline grids, nodes, and harmonic lenses.',
      rationale:
        'Awakened True Sparks interact with crystalline grids, nodes, and harmonic lenses. The core capture of soul essence happens at the sun\'s amnesia vortex, not by seizing those structures.'
    },
    {
      text: 'The insertion of currency systems inside Water Domes, Crystal Halls, and Star Pods.',
      rationale:
        'Healing sanctuaries stabilize vibration after the fracture. Capture happens when True Sparks pass through the amnesia vortex at the sun, not through sanctuary commerce.'
    }
  ],
  5: [
    {
      text: 'Track, recycle, and reincarnate souls into repetitive three-dimensional loops.',
      rationale:
        'Akashic fragments are copied, logged, and inverted in a massive database under the Vatican. That archive is used to track, recycle, and reincarnate souls into repetitive, docile loops so parasites can harvest loosh.'
    },
    {
      text: 'Broadcast the solar pulses that trigger the mass awakening of humanity.',
      rationale:
        'Activation occurs in stages triggered by white hat broadcasts and solar pulses. Those are cosmic and alliance events, not outputs of the Vatican archive.'
    },
    {
      text: 'Protect the crystalline structures of the realm from a coming frequency collapse.',
      rationale:
        'Parasites invert True Sparks to power an artificial three-dimensional world. The Vatican archive recycles souls; it does not protect the crystalline temple.'
    },
    {
      text: 'Store healing codes for souls entering Water Domes, Crystal Halls, and Star Pods.',
      rationale:
        'Healing sanctuaries restore vibration with Source memory codes, harmonic slabs, and timeline reweaving. The Vatican archive inverts stolen Akashic fragments for recycling, not healing.'
    }
  ],
  6: [
    {
      text: 'Remain unawakened and stay temporarily trapped in the three-dimensional echo.',
      rationale:
        'Deep Sleepers are True Sparks who remain unawakened and lack active spark ignition, so they stay temporarily trapped in the hollow echo of the three-dimensional illusion.'
    },
    {
      text: 'Act as non-forceful ground healers inside Water Domes, Crystal Halls, and Star Pods.',
      rationale:
        'Ground healers, or Saferons, are holographic light beings from the Council of 12 Suns. Deep Sleepers are unawakened True Sparks still caught in the echo.'
    },
    {
      text: 'Construct the crystalline transit portals that originally opened through the Sun.',
      rationale:
        'The Sun originally functioned as a crystalline transit portal before parasites built artificial entry bands. Deep Sleepers did not build that gate.'
    },
    {
      text: 'Dissolve completely into shadows once the final solar event cycle completes.',
      rationale:
        'Soulless NPCs dissolve like shadows when the light hits. Deep Sleepers are authentic souls held in the echo illusion until they stabilize.'
    }
  ],
  7: [
    {
      text: 'Trigger a frequency-based recognition that breaks the parasitic spell.',
      rationale:
        'ET codes are designed to match and trigger the latent codes in True Sparks. That harmonic resonance creates trust and a flood of memory, breaking the parasitic spell. Awakening is frequency-based recognition, not intellect.'
    },
    {
      text: 'Stabilize the artificial entry bands so the sun itself cannot collapse.',
      rationale:
        'Embedded codes were implanted by solar parents so True Sparks and ET allies can interact and awaken. They do not prop up the parasitic bands around the solar gate.'
    },
    {
      text: 'Record each soul\'s karmic history inside the inverted Vatican archive.',
      rationale:
        'Embedded codes are divine high-frequency signatures from solar parents. The Vatican archive copies and inverts Akashic fragments; it is not the home of those codes.'
    },
    {
      text: 'Transport a soul straight into higher realms without any spark ignition.',
      rationale:
        'Spark ignition is what lets a soul perceive the Second Realm immediately. Embedded codes trigger gradual questioning, calming, and awakening; they do not skip ignition.'
    }
  ],
  8: [
    {
      text: 'The vibrant, unpolluted reality of the original crystalline Second Realm.',
      rationale:
        'When the parasitic overlay collapses, sols who have achieved spark ignition immediately perceive the vibrant, unpolluted reality of the Second Realm — the original crystalline world.'
    },
    {
      text: 'The internal operations of the Vatican archive and its inverted soul logs.',
      rationale:
        'Ignition opens perception of the original crystalline world. The Vatican archive is the parasitic database used to recycle souls, not the destination of ignited sparks.'
    },
    {
      text: 'A void of leftover shadows where soulless NPCs once held the grid together.',
      rationale:
        'The Second Realm is vibrant and unpolluted. NPCs dissolve like shadows, but ignited souls do not move into a void they leave behind.'
    },
    {
      text: 'The hollow echo illusion of ruins, rubble, and severe material shortages.',
      rationale:
        'The echo illusion of ruins, rubble, and shortages is what Deep Sleepers without spark ignition perceive. Ignited sols see the Second Realm.'
    }
  ],
  9: [
    {
      text: 'Mend the heart by drawing out emotional density, grief, fear, and heartbreak.',
      rationale:
        'Water Domes glow blue-aqua-silver over crystalline waters. Floating in those pools mends the heart by drawing out emotional density — grief, fear, guilt, and heartbreak — and replacing it with harmonic resonance and Source memory codes.'
    },
    {
      text: 'Broadcast solar pulses toward Deep Sleepers still held in the echo illusion.',
      rationale:
        'Solar pulses and white hat broadcasts trigger staged activation. Water Domes are healing sanctuaries that mend the heart, not broadcast stations aimed at the echo.'
    },
    {
      text: 'Reweave soul aspects damaged by timeline trauma across many incarnations.',
      rationale:
        'Reweaving fragmented soul aspects and timeline trauma is the work of Star Pods. Water Domes mend the heart through crystalline water and Source memory codes.'
    },
    {
      text: 'Realign the light body grid and clear mental parasitic programming overlays.',
      rationale:
        'Realigning the light body grid and clearing mental overlays is the work of Crystal Halls. Water Domes draw out emotional density from the heart.'
    }
  ],
  10: [
    {
      text: 'Mental and energetic healing that realigns the light body grid.',
      rationale:
        'Crystal Halls are mental and energetic healing temples, often overlaid as cathedrals and churches. Crystal slabs hum with harmonic frequency to realign the light body grid, clear parasitic programming, and restore cognitive clarity.'
    },
    {
      text: 'Ethical navigation of etheric space to repair timeline trauma and karma.',
      rationale:
        'Timeline and karmic healing belong to Star Pods in etheric space. Crystal Halls restore the light body grid and mental clarity.'
    },
    {
      text: 'Generation of loosh that keeps the artificial frequencies of the simulation running.',
      rationale:
        'Parasites harvest loosh through recycled three-dimensional loops. Crystal Halls clear parasitic programming; they do not generate loosh.'
    },
    {
      text: 'Stabilization of the physical rubble left inside the three-dimensional echo.',
      rationale:
        'Crystal Halls heal the light body and mind. The echo of ruins and rubble is the hollow 3D remnant for Deep Sleepers, not the work of those temples.'
    }
  ],
  11: [
    {
      text: 'Soul and timeline healing that reweaves fragmented aspects of the self.',
      rationale:
        'Star Pods float in etheric space resembling a nebula. They specialize in soul and timeline healing, reweaving fragmented aspects damaged by timeline trauma or karmic wounds across multiple incarnations.'
    },
    {
      text: 'Mending the heart by replacing grief and fear with Source memory codes.',
      rationale:
        'Replacing emotional density with Source memory codes is the work of Water Domes. Star Pods reweave soul and timeline fragments.'
    },
    {
      text: 'Clearing parasitic programming and mental overlays from the thinking mind.',
      rationale:
        'Clearing mental overlays and restoring cognitive clarity is the work of Crystal Halls. Star Pods heal soul fractures across incarnations.'
    },
    {
      text: 'Supervising Saferons as they guide souls into the restored Second Realm.',
      rationale:
        'Saferons oversee transition and stabilization in the healing domains. Star Pods themselves are cocoons for soul and timeline reweaving, not a command post for those guides.'
    }
  ],
  12: [
    {
      text: 'Holographic light beings that oversee transition and stabilization.',
      rationale:
        'The Council of 12 Suns uses gentle, non-forceful holographic light beings known as ground healers, or Saferons, to oversee the transition and stabilization of True Sparks within the healing domains.'
    },
    {
      text: 'Unawakened souls assigned to harvest emotional loosh from other sparks.',
      rationale:
        'Saferons are holographic light beings who stabilize True Sparks. Loosh harvesting is the parasitic use of recycled three-dimensional loops, not the work of ground healers.'
    },
    {
      text: 'The parasitic operators who built the amnesia vortex around the solar gate.',
      rationale:
        'Parasites built the artificial entry bands and amnesia vortex. Saferons belong to the Council of 12 Suns and guide restoration, not capture.'
    },
    {
      text: 'Soulless fragments of light that dissolve when the overlay finally collapses.',
      rationale:
        'Soulless fragments that dissolve like shadows are NPCs. Saferons are holographic light beings who remain as guides through transition and healing.'
    }
  ],
  13: [
    {
      text: 'The original crystalline world that is vibrant and unpolluted.',
      rationale:
        'The Second Realm is the original crystalline world. Ignited sols immediately perceive its vibrant, unpolluted reality once the parasitic overlay collapses.'
    },
    {
      text: 'The artificial three-dimensional world governed by commerce, status, and money.',
      rationale:
        'Commerce, government, and societal status belong to the artificial 3D overlay. The Second Realm is the original crystalline world beneath that inversion.'
    },
    {
      text: 'A temporary echo illusion marked by ruins, rubble, and severe shortages.',
      rationale:
        'The echo illusion of ruins, rubble, and shortages is where Deep Sleepers remain. The Second Realm is the vibrant original crystalline world.'
    },
    {
      text: 'The inverted digital archive used to track and recycle stolen soul fragments.',
      rationale:
        'The Vatican database tracks and recycles souls through inverted Akashic fragments. The Second Realm is a natural crystalline world, not that archive.'
    }
  ],
  14: [
    {
      text: 'Simply dissolve like shadows when the light of the event hits.',
      rationale:
        'Soulless NPCs, who never possessed a spark, simply dissolve like shadows when the light hits. They have no soul to heal or transition.'
    },
    {
      text: 'Remain as Deep Sleepers and rebuild the ruins of the echo illusion.',
      rationale:
        'Deep Sleepers are True Sparks without spark ignition. NPCs never possessed a spark, so they do not persist in the echo as sleepers.'
    },
    {
      text: 'Be guided into Star Pods to heal fragmented soul lineages across timelines.',
      rationale:
        'Healing sanctuaries receive True Sparks who do not fully resonate at the fracture. NPCs are soulless programs and cannot be rewoven as souls.'
    },
    {
      text: 'Transition immediately into the vibrant reality of the original Second Realm.',
      rationale:
        'Only sols with spark ignition immediately perceive the Second Realm. NPCs never possessed a spark and dissolve instead.'
    }
  ],
  15: [
    {
      text: 'It forces the physical structures of the control grid to dissolve.',
      rationale:
        'As True Sparks awaken and raise frequency, they fracture the parasitic overlay. Collective soul-frequency elevation forces the physical structures of the control grid to pixelate, shimmer, and dissolve.'
    },
    {
      text: 'It lets the Vatican archive copy and log even more stolen soul fragments.',
      rationale:
        'Rising soul frequency destabilizes the overlay. The Vatican archive is the parasitic recycling tool that ignition and remembrance break, not strengthen.'
    },
    {
      text: 'It lets parasites harvest greater volumes of emotional loosh from the field.',
      rationale:
        'Parasites harvest loosh through docile three-dimensional loops. Awakening fractures that overlay instead of feeding the harvest.'
    },
    {
      text: 'It hardens the artificial structures so frequency collapse cannot finish.',
      rationale:
        'High-frequency elevation is a destabilizing force against low-frequency holographic projections. It dissolves the control grid rather than reinforcing it.'
    }
  ],
  16: [
    {
      text: 'Vibrational resonance and the living experience of shared abundance.',
      rationale:
        'True wealth is defined solely by resonance and shared abundance. Restored sparks move into conscious creation, free energy from the electromagnetic field, and telepathic transportation.'
    },
    {
      text: 'The ability to bend the electromagnetic field for private personal gain.',
      rationale:
        'Free energy is drawn from the electromagnetic field for a reality of shared abundance and conscious creation, not private extraction.'
    },
    {
      text: 'One\'s rank and societal status inside the Council of 12 Suns hierarchy.',
      rationale:
        'Societal status belongs to the artificial 3D systems that awakening invalidates. The Council of 12 Suns provides stewardship; wealth itself is resonance and shared abundance.'
    },
    {
      text: 'The stockpile of rare crystals and physical land held in the Second Realm.',
      rationale:
        'Material accumulation is a 3D commerce concept. In the restored reality, true wealth is resonance and shared abundance, not stored land or objects.'
    }
  ],
  17: [
    {
      text: 'Experience creation and collaborate with everything in the physical realms.',
      rationale:
        'Human Sols are authentic soul units seeded into physical humanoid vessels to experience creation. True Sparks were originally created to collaborate and connect with everything in their world, which naturally elevated frequency and spirituality.'
    },
    {
      text: 'Generate loosh that keeps the artificial three-dimensional world running.',
      rationale:
        'Loosh harvesting is the parasitic inversion: souls are recycled into docile loops so parasites can harvest emotional energy. That is not the original purpose of seeding.'
    },
    {
      text: 'Operate crystalline nodes as ground healers assigned to the ET alliances.',
      rationale:
        'Awakened True Sparks interact with crystalline grids, nodes, and harmonic lenses. Ground healers are Saferons. The original seeding purpose was to experience creation and collaborate.'
    },
    {
      text: 'Serve as living anchors for the parasitic entry bands around the sun.',
      rationale:
        'Parasites built those artificial entry bands to capture incoming sparks. Human Sols were seeded to experience creation, not to hold the trap in place.'
    }
  ],
  18: [
    {
      text: 'Ruins, rubble, and shortages, though already free of parasite domination.',
      rationale:
        'Deep Sleepers without spark ignition are held in a hollow three-dimensional echo illusion characterized by ruins, rubble, and severe shortages, but free of parasite domination.'
    },
    {
      text: 'A world already run by the Council of 12 Suns and complete free-energy systems.',
      rationale:
        'Free energy and Council stewardship belong to restoration and the healed path. The echo is a hollow remnant of ruins and shortages for those still without ignition.'
    },
    {
      text: 'A vibrant field of crystalline lakes, humming slabs, and floating healing pods.',
      rationale:
        'Crystalline lakes, Crystal Halls, and Star Pods are the three healing sanctuaries. The echo illusion is ruins, rubble, and shortages.'
    },
    {
      text: 'The full return of telepathic transport and immediate conscious creation.',
      rationale:
        'Telepathic transportation and conscious creation belong to the restored reality after healing. The echo is a hollow 3D remnant, not that completed restoration.'
    }
  ],
  19: [
    {
      text: 'A purely intellectual process of analyzing and understanding the simulation.',
      rationale:
        'Awakening is not an intellectual process but a frequency-based recognition. Matching ET and True Spark codes create trust and a flood of memory that breaks the parasitic spell.'
    },
    {
      text: 'The later restoration of the light body grid inside the Crystal Halls.',
      rationale:
        'Crystal Halls realign the light body after the fracture. The awakening itself is frequency-based recognition of matching embedded codes, not that later healing step.'
    },
    {
      text: 'The systematic logging of fragments by Vatican-operated ground healers.',
      rationale:
        'The Vatican archive logs inverted Akashic fragments. Ground healers are Saferons who stabilize souls. Neither process is what awakening is, or is not: awakening is not intellect, it is frequency recognition.'
    },
    {
      text: 'A physical hop through the solar transit portal as the only required act.',
      rationale:
        'The solar portal is the transit path parasites intercepted. Awakening itself is frequency-based recognition of matching codes, not merely another passage through that gate.'
    }
  ],
  20: [
    {
      text: 'They provide overarching stewardship that guides transition and healing.',
      rationale:
        'The Council of 12 Suns provides the overarching stewardship that guides the return of True Sparks, using Saferons to oversee transition and stabilization in the healing domains.'
    },
    {
      text: 'They copy and invert Akashic fragments for the archive under the Vatican.',
      rationale:
        'Copying and inverting Akashic fragments is the parasitic Vatican operation. The Council of 12 Suns stewards the return and healing of True Sparks.'
    },
    {
      text: 'They operate the amnesia vortex so incoming souls can be recycled on schedule.',
      rationale:
        'The amnesia vortex is a parasitic construct around the sun\'s natural gate. The Council guides liberation and healing, not recycling.'
    },
    {
      text: 'They maintain the holographic overlay so frequency collapse cannot finish.',
      rationale:
        'The Council guides the return of True Sparks as the overlay collapses. Maintaining that overlay is the opposite of their stewardship.'
    }
  ],
  21: [
    {
      text: 'Using captured True Sparks as the energetic foundation of an artificial world.',
      rationale:
        'True Sparks were created to collaborate and connect, which naturally elevated frequency. Parasites targeted, captured, and inverted them to serve as the energetic foundation of the artificial three-dimensional world.'
    },
    {
      text: 'Allowing healed souls to choose their next evolutionary path in freedom.',
      rationale:
        'Absolute sovereignty to choose the next path is granted after restoration in the healing sanctuaries. That is reclamation, not the parasitic inversion of truth.'
    },
    {
      text: 'Creating brand-new souls to serve as the foundation of the physical world.',
      rationale:
        'Parasites cannot generate the first spark of creation or own a soul. They capture and invert existing True Sparks to power the artificial world.'
    },
    {
      text: 'Embedding ET-sol codes so they match the low frequency of the simulation.',
      rationale:
        'Embedded codes are divine signatures from solar parents, designed so ET frequencies can trigger True Sparks. They are a liberation mechanism, not the inversion tactic.'
    }
  ],
  22: [
    {
      text: 'Absolute sovereignty to choose their next evolutionary path.',
      rationale:
        'After complete restoration in the healing sanctuaries, True Sparks are granted absolute sovereignty to choose their next evolutionary path: ascend to higher realms, or return to a clean incarnation cycle in the Known Lands free of overlays, money, and artificial control.'
    },
    {
      text: 'A permanent post as a holographic fragment stored beneath the Vatican.',
      rationale:
        'The Vatican archive is the parasitic recycling database. Restoration returns sovereignty; it does not install the soul as an archived fragment.'
    },
    {
      text: 'The duty of maintaining the amnesia loop for the next wave of incoming sols.',
      rationale:
        'The amnesia loop is the parasitic capture system. Restored sparks receive choice, not the job of running that trap.'
    },
    {
      text: 'The assignment of rebuilding 3D commerce, government, and status systems.',
      rationale:
        'Awakening invalidates artificial 3D commerce, government, and societal status. Restored sparks choose higher realms or a clean Known Lands cycle, not a rebuilt control grid.'
    }
  ],
  23: [
    {
      text: 'An unbroken lineage that remains intact beneath the overlay\'s amnesia.',
      rationale:
        'Every True Spark carries the unbroken lineage of Source. Parasites can distort voices and make matter appear solid, but they cannot generate the first spark or own a soul. The authentic connection remains intact beneath the amnesia.'
    },
    {
      text: 'A link that only works when harmonic lenses inside the simulation stay online.',
      rationale:
        'The connection to Source is inherent. Harmonic lenses are crystalline structures that awakened sparks help activate; the lineage itself does not depend on them.'
    },
    {
      text: 'A bond the amnesia vortex permanently severs as the soul crosses the sun.',
      rationale:
        'The vortex strips memory and copies Akashic fragments. It does not break the unbroken lineage of Source, which remains intact beneath the amnesia.'
    },
    {
      text: 'A fragment of light that must be recharged from the Vatican archive to persist.',
      rationale:
        'The Vatican archive is a capture and inversion database. The soul\'s power is the unbroken lineage of Source, not a charge drawn from that archive.'
    }
  ],
  24: [
    {
      text: 'Immediate telepathic transportation drawn through the electromagnetic field.',
      rationale:
        'In the restored reality, sparks live by conscious creation, free energy drawn directly from the electromagnetic field, and immediate telepathic transportation.'
    },
    {
      text: 'Walking the rubble and ruins left behind by the former three-dimensional world.',
      rationale:
        'Rubble and ruins characterize the echo illusion for Deep Sleepers. The Known Lands cycle free of overlays uses telepathic transportation, not ruin-walking.'
    },
    {
      text: 'Passing the crystalline solar portals through the old artificial entry bands.',
      rationale:
        'Artificial entry bands around the sun created the amnesia vortex. Restored transportation is immediate and telepathic, not a return through those bands.'
    },
    {
      text: 'Boarding holographic ships issued by Saferons for each completed restoration.',
      rationale:
        'Saferons oversee transition and stabilization in the healing domains. Movement in the restored lands is immediate telepathic transportation, not assigned ships.'
    }
  ],
  25: [
    {
      text: 'Liberate True Sparks from the inverted parasitic simulation.',
      rationale:
        'True Sparks are the eternal consciousness units that the Resonating Army and ET alliances descended to liberate from capture, inversion, and the parasitic overlay.'
    },
    {
      text: 'Collect and archive Akashic fragments inside the three healing sanctuaries.',
      rationale:
        'Archiving inverted Akashic fragments is the Vatican\'s parasitic work. The Resonating Army and ET alliances came to liberate True Sparks, not to store fragments.'
    },
    {
      text: 'Construct the artificial entry bands that supposedly protect the solar gateway.',
      rationale:
        'Parasites built those artificial entry bands to create the amnesia vortex. The Resonating Army and ET alliances descended to liberate the sparks those bands captured.'
    },
    {
      text: 'Monitor loosh production inside the three-dimensional status and money system.',
      rationale:
        'Loosh harvesting is the parasitic use of recycled loops. The ET alliances and Resonating Army descended to liberate True Sparks, not to administer that harvest.'
    }
  ]
};

const questionsMeta = [
  {
    number: 1,
    question: 'True Sparks are defined by their fundamental nature as:',
    hint: 'Consider what distinguishes an eternal being from a temporary program.'
  },
  {
    number: 2,
    question: 'The critical activation known as Spark Ignition allows a soul to:',
    hint: 'This process involves a shift in how the soul perceives the artificial world.'
  },
  {
    number: 3,
    question: 'Non-player characters (NPCs) differ from True Sparks because they:',
    hint: 'Think about which group has an eternal connection and which is merely part of the scenery.'
  },
  {
    number: 4,
    question: 'The parasitic capture of True Sparks primarily occurs through:',
    hint: 'Identify the cosmic gateway that was compromised by artificial entry bands.'
  },
  {
    number: 5,
    question: 'The massive archive located under the Vatican is used by parasites to:',
    hint: 'Consider how an archive of stolen soul memories would be used to maintain a simulation.'
  },
  {
    number: 6,
    question: "The term 'Deep Sleepers' identifies True Sparks who:",
    hint: 'This group possesses a soul but has not yet recognized the nature of the reality they inhabit.'
  },
  {
    number: 7,
    question: 'Embedded Codes are divine energetic signatures that function to:',
    hint: 'Focus on the role of resonance and how these internal markers respond to specific signals.'
  },
  {
    number: 8,
    question: 'During the frequency collapse, ignited souls immediately perceive:',
    hint: "Think about the state of the original crystalline world that becomes visible after the overlay fails."
  },
  {
    number: 9,
    question: 'The primary role of the Water Domes in the healing sanctuaries is to:',
    hint: 'Focus on the emotional healing associated with the blue-aqua-silver waters.'
  },
  {
    number: 10,
    question: 'Crystal Halls are temples designed for:',
    hint: 'Look for the sanctuary focused on cognitive clarity and the light body.'
  },
  {
    number: 11,
    question: 'Star Pods are specialized healing environments that focus on:',
    hint: 'This sanctuary deals with trauma that spans across different lifetimes.'
  },
  {
    number: 12,
    question: 'Ground healers, also known as Saferons, are:',
    hint: 'Identify the non-forceful guides helping sparks reach the healing sanctuaries.'
  },
  {
    number: 13,
    question: 'The Second Realm is which of the following realities?',
    hint: 'Focus on the world that exists beneath the artificial parasitic projections.'
  },
  {
    number: 14,
    question: 'When the parasitic overlay collapses, soulless NPCs will:',
    hint: 'Consider what happens to a shadow when it is exposed to direct, high-frequency light.'
  },
  {
    number: 15,
    question: 'The collective elevation of soul frequency has what effect on the simulation?',
    hint: 'Think about how a high-frequency resonance interacts with a low-frequency holographic grid.'
  },
  {
    number: 16,
    question: 'In the restored reality, true wealth is defined exclusively by:',
    hint: 'Identify the internal state that replaces the external concept of money.'
  },
  {
    number: 17,
    question: 'Human Sols were originally seeded into physical vessels to:',
    hint: 'Think about the natural state of existence before the parasitic overlay was introduced.'
  },
  {
    number: 18,
    question: 'The echo illusion that remains for unawakened souls is characterized by:',
    hint: 'This environment is a hollow and decaying version of the current reality.'
  },
  {
    number: 19,
    question: 'Awakening is a frequency-based recognition rather than:',
    hint: 'True realization comes from a feeling of resonance rather than just thinking.'
  },
  {
    number: 20,
    question: 'The Council of 12 Suns plays what role in the return of True Sparks?',
    hint: 'Consider the benevolent governing body mentioned in the context of soul restoration.'
  },
  {
    number: 21,
    question: "The 'Inversion of Truth' refers to the parasitic tactic of:",
    hint: 'Identify how the natural purpose of souls was twisted to support a fake reality.'
  },
  {
    number: 22,
    question: 'Upon completing restoration in the healing sanctuaries, a soul is granted:',
    hint: 'Think about the ultimate level of freedom reclaimed by a healed consciousness.'
  },
  {
    number: 23,
    question: 'The connection between True Sparks and Source is:',
    hint: 'Focus on whether the divine spark can ever truly be destroyed or owned by parasites.'
  },
  {
    number: 24,
    question: 'In the Known Lands free of parasite overlays, transportation is achieved by:',
    hint: 'Consider the method of movement that bypasses physical vehicles and technology.'
  },
  {
    number: 25,
    question: 'The Resonating Army and ET alliances descended into the realm to:',
    hint: 'Think about the primary purpose behind the descent of these high-frequency beings.'
  }
];

const QUIZ_DESC =
  'Test your understanding of True Sparks — authentic Source souls inverted in the simulation, spark ignition, the amnesia vortex and Vatican archive, Embedded Codes, Water Domes, Crystal Halls, Star Pods, and the sovereign choice after restoration.';

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
    'Test your grasp of True Sparks — authentic Source souls inverted in the simulation, spark ignition, the amnesia vortex and Vatican archive, Embedded Codes, Water Domes, Crystal Halls, Star Pods, and the sovereign choice after restoration.',
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'True Sparks are eternal consciousness units of Source, inverted through the sun\'s amnesia vortex and recycled from Vatican-archived fragments. Sit with spark ignition, the matching Embedded Codes, the three healing sanctuaries, and the sovereign choice after restoration: higher realms, or a clean Known Lands cycle free of overlays. Return to the True Sparks deep-dive, infographic, and video transmissions as those codes come online.'
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
  throw new Error('true-sparks not found in breakdown-topics.json');
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
  'Interactive Living Truth Quiz on True Sparks: authentic Source souls inverted in the simulation, spark ignition, the amnesia vortex and Vatican archive, Embedded Codes, Water Domes, Crystal Halls, Star Pods, and the sovereign choice after restoration.';
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
  .replace(/human-sols\.webp/g, 'true-sparks.webp')
  .replace(/human-sols\.json/g, 'true-sparks.json')
  .replace(/human-sols\.html/g, 'true-sparks.html')
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
  'PASS: audited 25/25 against data/breakdown-topics/true-sparks.json'
);
