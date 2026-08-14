/**
 * Installs Nebulae Resting quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/starpod-quiz.json
 * Title forced to "Nebulae Resting". All 25 audited against nebulae-resting report only.
 * NotebookLM wording kept; T/F items converted to four options; hedges removed;
 * options expanded only for length balance / fidelity.
 *
 * Run: node scripts/install-nebulae-resting-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/nebulae-resting.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'nebulae-resting';
const TOPIC_TITLE = 'Nebulae Resting';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/starpod-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/nebulae-resting.webp';

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

/** Support phrases grounded only in nebulae-resting.json report. */
const supportPhrases = {
  1: ['light-frequency streams', 'soul fractures', 'etheric space'],
  2: ['soul fractures', 'deep energetic splits', 'parasitic intervention'],
  3: ['womb of light', 'high-frequency energetic field', 'surrounds a soul'],
  4: ['specialized technology', 'fragments a soul', 'loops of amnesia'],
  5: ['little bit of doubt', 'red sea', 'never abandoned'],
  6: ['resonating army', 'already awakened', 'trapped human souls'],
  7: ['water domes', 'liquid sound', 'grief'],
  8: ['crystal halls', 'mental programming', 'humming crystal slabs'],
  9: ['crystalline grids', 'etheric hard drives', 'soul journeys'],
  10: ['loosh', '3d overlay', 'original realm'],
  11: ['luminous outlines', 'holographical', 'physical forms'],
  12: ['parasitic whispers', 'safety and homecoming', 'higher memory'],
  13: ['water domes', 'crystal halls', 'starlight pods'],
  14: ['vibrational output', 'solar parents', 'locate'],
  15: ['amnesia vortex', 'hijacked sun', 'unbroken timeline'],
  16: ['freedom of choice', 'known lands', 'synthetic reincarnation'],
  17: ['cosmic nebula', 'womb of light', 'nebulae resting'],
  18: ['liquid sound', 'emotional wounds', 'heartbreak'],
  19: ['little bit of doubt', 'came to this realm to help', 'red sea'],
  20: ['cathedrals', 'crystal halls', 'overlaid'],
  21: ['loosh', 'attention and emotion', 'parasitic harvest'],
  22: ['etheric suspension', 'physical density', 'third dimension'],
  23: ['timeline trauma', 'multiple incarnations', 'historical periods'],
  24: ['known lands', 'crystalline cycle', 'parasite overlays'],
  25: ['multiple lifetimes', 'soul fractures', 'timeline trauma'],
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
    [/\baccording to the (report|source|text|core revelations|revelations|material|journal|living truth)\b/gi, ''],
    [/^The source states that\s+/i, ''],
    [/^The source states\s+/i, ''],
    [/^The source explains that\s+/i, ''],
    [/^The source explains\s+/i, ''],
    [/^The source material views\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The text suggests that\s+/i, ''],
    [/^The text suggests\s+/i, ''],
    [/^The journal describes (?:it as|this as)\s+/i, 'It is '],
    [/\bthe journal describes\b/gi, ''],
    [/\bin the journal\b/gi, ''],
    [/\bthe text explicitly lists\b/gi, ''],
    [/\bthe text describes\b/gi, ''],
    [/\bthe text states\b/gi, ''],
    [/\bthe text suggests\b/gi, ''],
    [/\bthe source explains\b/gi, ''],
    [/\bthe source identifies\b/gi, ''],
    [/\bthe source material\b/gi, ''],
    [/\bare described as\b/gi, 'are'],
    [/\bis described as\b/gi, 'is'],
    [/\bthe pods are described as\b/gi, 'the pods are'],
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
 * NotebookLM claims kept; T/F converted; expanded from nebulae-resting report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'They act as non-physical containment vessels that use light-frequency streams to heal soul fractures, timeline trauma, and karmic wounds.',
      rationale:
        'Star Pods are specialized etheric healing systems designed to mend the core soul structure and resolve deep timeline trauma using light frequencies.',
    },
    {
      text: 'They function as permanent storage units for souls waiting for reincarnation, keeping the synthetic loop running.',
      rationale:
        'These vessels are for restoration and recovery, allowing souls to escape the synthetic reincarnation loop rather than sustaining it.',
    },
    {
      text: 'They serve as physical transport vehicles for traveling between different star systems as ordinary spacecraft.',
      rationale:
        'The pods are non-physical containment vessels existing in etheric space, not physical craft.',
    },
    {
      text: 'They are used by parasitic entities to harvest emotional energy from recovering souls inside the pod.',
      rationale:
        'The pods are protected from parasitic interference so the first realizations are safety and homecoming, not harvest.',
    },
  ],
  2: [
    {
      text: "Soul Fractures — deep energetic splits or fragmentation within a soul's consciousness from repeated lifetimes of trauma and parasitic intervention.",
      rationale:
        "Soul fractures are the specific energetic fragmentations within a soul's consciousness resulting from prolonged trauma.",
    },
    {
      text: 'Amnesia Overlays — the artificial density layers that impose forgetfulness, treated here as the name of the splits themselves.',
      rationale:
        'Overlays are the artificial density layers that impose amnesia, rather than the resulting fractures themselves.',
    },
    {
      text: 'Timeline Trauma — the subconscious distress that attaches to a soul across historical periods, treated here as the split itself.',
      rationale:
        'This term specifically refers to the subconscious distress that attaches to a soul across historical periods.',
    },
    {
      text: "Karmic Loops — repeating control cycles in the overlay, treated here as the name for the soul's energetic splitting.",
      rationale:
        "While loops are a symptom of the control system, they are not the term for the energetic splitting of the soul's essence.",
    },
  ],
  3: [
    {
      text: 'To provide a high-frequency energetic field that protects and surrounds the soul during healing.',
      rationale:
        'This protective field completely surrounds a soul and simulates the serene environment of a nebula so reweaving can proceed safely.',
    },
    {
      text: 'To project holographic simulations of past lives to help the soul remember its mistakes.',
      rationale:
        'The process is about healing and reweaving rather than revisiting traumatic past-life events or mistakes.',
    },
    {
      text: 'To filter out the natural solar frequencies that cause amnesia in the third dimension.',
      rationale:
        "The amnesia vortex belongs to the hijacked sun; the womb's role is a restorative field for reweaving, not solar filtering.",
    },
    {
      text: "To act as a storage medium for the records of the soul's entire journey.",
      rationale:
        "The crystalline grids of the Earth, not the womb of light, serve as the etheric hard drives for soul records.",
    },
  ],
  4: [
    {
      text: "As a tool to intentionally fragment a soul's awareness and bind them to loops of control.",
      rationale:
        'Trauma operates as specialized technology that fragments a soul’s awareness and binds them to continuous loops of amnesia and control.',
    },
    {
      text: 'As a method for ground healers to identify which souls require the most assistance.',
      rationale:
        'While trauma necessitates healing, it is implemented by parasites for control, not by healers for identification.',
    },
    {
      text: 'As a necessary evolution point for souls to learn lessons before ascending.',
      rationale:
        'Trauma is an imposition by parasitic overlays rather than a natural learning tool.',
    },
    {
      text: 'As a byproduct of the natural friction between different soul families.',
      rationale:
        'Trauma is a deliberate application of technology under parasitic influence, not a natural occurrence between families.',
    },
  ],
  5: [
    {
      text: "A lingering 'little bit of doubt' or energetic weight that mirrors the Red Sea event.",
      rationale:
        'This internal hesitation binds the soul to the illusion, so Nebulae Resting is needed to reactivate dormant codes and restore selfhood.',
    },
    {
      text: 'A directive from the Resonating Army to stay behind and assist more humans.',
      rationale:
        'While they came to assist, the reason they become trapped is their own doubt and energetic weight.',
    },
    {
      text: 'The physical destruction of the Star Pods during the transition between ages.',
      rationale:
        'Star Pods are etheric systems and are not susceptible to physical destruction in the third dimension.',
    },
    {
      text: 'A lack of advanced technology required to penetrate the etheric space.',
      rationale:
        'The exit is hindered by energetic and consciousness factors rather than a lack of technology.',
    },
  ],
  6: [
    {
      text: 'The Resonating Army — already awakened returning extraterrestrial souls who assist the awakening and liberation of trapped human souls.',
      rationale:
        'This group consists of extraterrestrial souls who returned to this realm to support the awakening process.',
    },
    {
      text: 'The Ground Healers, treated as the named army of returning extraterrestrial souls.',
      rationale:
        'Ground healers work alongside the Resonating Army but are distinct in their specific functions and forms.',
    },
    {
      text: 'The Solar Parents, treated as the named army that came to liberate trapped human souls.',
      rationale:
        'Solar parents help locate and interface with souls once vibration increases, but they are not the named army.',
    },
    {
      text: 'The Etheric Guardians, an unofficial title used here as the official name of the returning helpers.',
      rationale:
        'The specific designation for the returning extraterrestrial helpers is the Resonating Army.',
    },
  ],
  7: [
    {
      text: 'To mend emotional wounds like grief, heartbreak, and fear through liquid sound.',
      rationale:
        "Water Domes use vibrations like liquid sound to target the emotional layer of the soul's trauma.",
    },
    {
      text: 'To provide the final stage of soul reweaving and timeline restoration.',
      rationale:
        'The final stage occurs in the Starlight Pods, whereas Water Domes are an earlier part of the sequence.',
    },
    {
      text: 'To store the records of soul journeys in a crystalline medium.',
      rationale:
        "The storage of records is the function of the Earth's crystalline grids.",
    },
    {
      text: 'To clear mental programming and mind control wounds.',
      rationale:
        'Mental programming is addressed in the Crystal Halls, not the Water Domes.',
    },
  ],
  8: [
    {
      text: 'Crystal Halls — crystalline temples, often overlaid by cathedrals or abbeys, where souls rest on humming crystal slabs to clear mental programming.',
      rationale:
        'Crystal Halls are designed to clear mental wounds and programming using humming crystal slabs.',
    },
    {
      text: 'Etheric Space, treated as the specific sanctuary that clears mental programming.',
      rationale:
        'Etheric space is the general medium where Star Pods circulate; Crystal Halls are the specific site for mental clearing.',
    },
    {
      text: 'Starlight Pods, treated as the site for mental programming rather than soul-level fractures.',
      rationale:
        'Starlight Pods focus on soul-level fractures rather than specific mental programming.',
    },
    {
      text: 'The Amnesia Vortex, treated as a healing sanctuary for mental clearing.',
      rationale:
        'The Amnesia Vortex is the cause of memory loss, not a place for healing and clearing.',
    },
  ],
  9: [
    {
      text: 'They act as etheric hard drives that preserve the records of all soul journeys.',
      rationale:
        "Even when memory is wiped, these grids ensure that a soul's unbroken timeline remains accessible to its stellar family.",
    },
    {
      text: 'They project the artificial 3D overlay that keeps souls trapped.',
      rationale:
        'The grids are benevolent structures that preserve records, whereas the overlays are parasitic in nature.',
    },
    {
      text: "They generate the 'loosh' that sustains the parasitic technology.",
      rationale:
        "Loosh is the energy harvested by parasites; the crystalline grids are part of the original realm's support system.",
    },
    {
      text: 'They serve as the physical foundation for the construction of Star Pods.',
      rationale:
        'Star Pods exist in etheric space as floating cocoons and do not require physical foundations on the grid.',
    },
  ],
  10: [
    {
      text: 'The systemic frequency collapse of the 3D overlay and the end of the loosh harvest.',
      rationale:
        'As souls heal and raise their resonance, the parasitic harvest is disrupted, accelerating the return of the original realm.',
    },
    {
      text: 'The complete deletion of all memory records from the crystalline grids.',
      rationale:
        'Records are preserved and reintegrated, not deleted, to allow for soul wholeness.',
    },
    {
      text: 'The migration of all souls to a different galaxy to avoid the parasite technology.',
      rationale:
        'Restoration leads to reclamation of the original realm or ascension, not a mass migration to avoid parasites.',
    },
    {
      text: 'The creation of a new, more advanced synthetic reincarnation loop.',
      rationale:
        'The goal is to end synthetic loops and restore sovereign choice, not to create new ones.',
    },
  ],
  11: [
    {
      text: 'As radiant, luminous outlines or holographical light structures.',
      rationale:
        'These benevolent beings do not use physical forms; they appear as luminous outlines to reassure the recovering soul.',
    },
    {
      text: 'As invisible whispers that the soul must interpret through intuition.',
      rationale:
        'The environment is free of whispers; guardians manifest visually as light structures to provide reassurance.',
    },
    {
      text: 'In dense, physical bodies that resemble their human incarnations.',
      rationale:
        'These beings do not use physical forms within the etheric restoration environment.',
    },
    {
      text: "As complex geometric patterns that represent the soul's healing progress.",
      rationale:
        'The guides specifically take on luminous outlines or holographical light structures to interface with the soul.',
    },
  ],
  12: [
    {
      text: 'The total absence of parasitic whispers or external frequency interference.',
      rationale:
        'By removing all interference, the soul can finally experience its natural state of safety and homecoming.',
    },
    {
      text: 'The immediate projection of the soul into its next chosen incarnation.',
      rationale:
        'Homecoming is an experience of safety within the pod before any choices about future cycles are made.',
    },
    {
      text: 'The use of sedative frequencies that prevent any high-level thought.',
      rationale:
        'The process aims for conscious realization and memory access, not sedation.',
    },
    {
      text: 'A specialized memory-wiping procedure that removes all traces of 3D trauma.',
      rationale:
        'The trauma is rewoven and integrated into wholeness, not simply wiped away.',
    },
  ],
  13: [
    {
      text: 'Water Domes, then Crystal Halls, ending in Starlight Pods.',
      rationale:
        'This sequential process transitions the soul from emotional healing to mental clearing and finally to soul mending.',
    },
    {
      text: 'Crystal Halls, then Water Domes, ending in Starlight Pods.',
      rationale:
        'Water Domes are the first stage for emotional wounds, followed by the Crystal Halls.',
    },
    {
      text: 'Starlight Pods, then Water Domes, ending in Crystal Halls.',
      rationale:
        'Starlight Pods are the ultimate stage of restoration, not the beginning.',
    },
    {
      text: 'Nebulae Resting, followed by the Water Domes and Crystal Halls.',
      rationale:
        'Nebulae Resting in Star Pods is the culmination of the process, not the starting point.',
    },
  ],
  14: [
    {
      text: "The stabilization and increase of the soul's vibrational output during reweaving.",
      rationale:
        "As the soul's vibration increases, solar parents, soul families, and guides can more easily locate and interface with it.",
    },
    {
      text: 'The physical coordinates of the Star Pod in the solar system.',
      rationale:
        'The pods are in etheric space and are located via vibration rather than physical coordinates.',
    },
    {
      text: "The soul's ability to send out an intentional distress signal.",
      rationale:
        'The interface is an automatic result of vibrational stabilization rather than a manual signal.',
    },
    {
      text: "The number of lifetimes the soul spent under parasitic influence.",
      rationale:
        'The actual location and interface are driven by current frequency output, not a lifetime count.',
    },
  ],
  15: [
    {
      text: "It wipes a soul's memory, even while the crystalline grids still preserve the unbroken timeline.",
      rationale:
        "The amnesia vortex of the hijacked sun wipes a soul's memory, yet the grids keep the unbroken timeline for stellar family and sanctuary recovery.",
    },
    {
      text: 'It prevents souls from entering the Water Domes for emotional healing.',
      rationale:
        'The vortex affects memory; the Water Domes remain part of the recovery sequence after leaving 3D density.',
    },
    {
      text: "It permanently deletes the soul's records from the crystalline grid.",
      rationale:
        "The records remain preserved in the grids even when the soul's active memory is wiped.",
    },
    {
      text: 'It reverses the healing progress made within the Star Pods.',
      rationale:
        "Healing in the pods occurs in an environment free from the vortex's influence and integrates amnesiac fragments permanently.",
    },
  ],
  16: [
    {
      text: 'They are granted complete sovereignty to ascend or return in a fresh crystalline cycle.',
      rationale:
        'Healed souls are no longer bound by any synthetic reincarnation loop and may ascend to higher realms or return to the Known Lands.',
    },
    {
      text: 'They must return to the 3D realm to help others heal.',
      rationale:
        "Sovereign choice means they are not bound to any specific path after restoration.",
    },
    {
      text: 'They are automatically absorbed back into the Resonating Army.',
      rationale:
        'The emphasis is on freedom of choice rather than an automatic assignment.',
    },
    {
      text: 'They must wait for the entire human collective to heal before moving on.',
      rationale:
        'Restoration provides individual sovereignty and the freedom to move to higher realms independently.',
    },
  ],
  17: [
    {
      text: 'The experience of resting inside a cosmic nebula.',
      rationale:
        'The Star Pods envelop the soul in a womb of light, simulating the serene environment of resting inside a cosmic nebula.',
    },
    {
      text: 'The battle for liberation led by the Resonating Army.',
      rationale:
        'The environment is specifically peaceful and restorative, designed to be free from conflict or battle.',
    },
    {
      text: 'The physical birth process on a new crystalline planet.',
      rationale:
        'It is a restorative state of consciousness recovery, not a simulation of physical birth.',
    },
    {
      text: 'The original creation point of the soul family.',
      rationale:
        "While families help reconnect higher memory, the state itself specifically simulates a nebula's serenity.",
    },
  ],
  18: [
    {
      text: 'By mending emotional wounds such as grief, heartbreak, and fear.',
      rationale:
        'The vibrations of liquid sound specifically target and soothe the emotional layers of trauma.',
    },
    {
      text: 'By reweaving the fragmented soul structure across timelines.',
      rationale:
        'Reweaving the soul structure is the task of the Starlight Pods.',
    },
    {
      text: 'By clearing away the mental overlays of mind control.',
      rationale:
        'Mental clearing is the role of the Crystal Halls; Water Domes focus on emotional wounds.',
    },
    {
      text: "By downloading the records of the soul's journey from the crystalline grid.",
      rationale:
        'The grids store the data, while the domes focus on the active healing of emotional distress.',
    },
  ],
  19: [
    {
      text: 'They are often those who came to help but became trapped, carrying a little bit of doubt that bound them to the illusion.',
      rationale:
        "Souls who enter Nebulae Resting often carried a 'little bit of doubt' that kept them bound, mirroring the Red Sea event.",
    },
    {
      text: 'They successfully avoided all doubt during their missions and therefore needed no restoration.',
      rationale:
        'The healing process is needed because lingering doubt prevented a seamless, instant exit from the cycle.',
    },
    {
      text: 'They were abandoned after failing to exit instantly at the end of the cycle.',
      rationale:
        'These souls are never abandoned; the nebula simulation reactivates dormant codes and restores fragmented selfhood.',
    },
    {
      text: 'They never came to assist this realm and arrived only after the overlay had already collapsed.',
      rationale:
        'They came to this realm to help, then became trapped; they did not arrive after the collapse.',
    },
  ],
  20: [
    {
      text: 'Cathedrals and abbeys often overlay the location of the etheric Crystal Halls.',
      rationale:
        'Crystal Halls are crystalline temples often overlaid by physical cathedrals or abbeys.',
    },
    {
      text: 'Cathedrals serve as the primary communication hubs for the Resonating Army.',
      rationale:
        'The Resonating Army operates etherically; cathedrals are physical overlays of the Crystal Halls, not army comms hubs.',
    },
    {
      text: 'Cathedrals were built by parasites to block access to the Water Domes.',
      rationale:
        'They overlay the Crystal Halls as a spatial camouflage, not as a blockade of the Water Domes.',
    },
    {
      text: 'Cathedrals are physical structures built to house the Star Pods.',
      rationale:
        'Star Pods are etheric and floating, not housed in physical buildings.',
    },
  ],
  21: [
    {
      text: 'The parasitic harvest of human attention and emotion.',
      rationale:
        'This energy is collected by the parasitic system and is disrupted when souls achieve full restoration.',
    },
    {
      text: 'The liquid sound that vibrates inside the Water Domes.',
      rationale:
        'The sound in the domes is for healing; loosh is a product of energy harvesting.',
    },
    {
      text: 'A specialized light frequency used to heal soul fractures.',
      rationale:
        'Loosh is the energy harvested by parasites, whereas light frequencies are used by the pods to heal.',
    },
    {
      text: 'The high-frequency field generated by a Womb of Light.',
      rationale:
        'The womb of light generates a protective field, while loosh is an emotional energy harvested for control.',
    },
  ],
  22: [
    {
      text: 'Etheric Suspension — the soul is completely detached from physical density and the heavy sensory constraints of the third dimension.',
      rationale:
        'Inside Star Pods, the soul is completely detached from physical density and the heavy sensory constraints of the third dimension.',
    },
    {
      text: 'Frequency-Driven Acceleration — the later rise in vibration that lets solar parents locate the soul after reweaving has already begun.',
      rationale:
        'This refers to the increase in vibration once reweaving has begun, not the initial detachment.',
    },
    {
      text: 'Crystalline Recording — the storage of journey records in the Earth grids, treated here as the detachment mechanic itself.',
      rationale:
        'This refers to the storage of journey records in the grid rather than the suspension of the soul.',
    },
    {
      text: 'Liquid Sound Immersion — the Water Dome process of emotional mending, treated here as the soul-level detachment.',
      rationale:
        'This occurs in the Water Domes and focuses on emotional mending rather than soul reweaving in suspension.',
    },
  ],
  23: [
    {
      text: 'Subconscious distress that attaches to a soul across multiple incarnations and historical periods.',
      rationale:
        'Timeline trauma persists beyond a single lifetime and is mended within the Star Pods.',
    },
    {
      text: 'The confusion felt when a soul first enters etheric space.',
      rationale:
        'Timeline trauma is a deep-seated distress from past experiences, not initial confusion in the afterlife.',
    },
    {
      text: "A technical error in the crystalline grid's recording system.",
      rationale:
        'It is a form of soul-level damage caused by trauma, not a recording error.',
    },
    {
      text: 'A physical illness that develops after traveling through different time zones.',
      rationale:
        'This trauma is energetic and subconscious, not a physical travel-related illness.',
    },
  ],
  24: [
    {
      text: 'A new experience in the Known Lands that is entirely free of parasite overlays.',
      rationale:
        "Fully restored souls may return to the Known Lands in a fresh, crystalline cycle entirely free of parasite overlays.",
    },
    {
      text: 'The process of being converted into light data for the crystalline grid.',
      rationale:
        'It is a cycle of life and experience, not a state of being processed as data.',
    },
    {
      text: 'A specialized training period for becoming a member of the Resonating Army.',
      rationale:
        'While souls may choose that path, the cycle itself refers to a parasite-free return to the Known Lands.',
    },
    {
      text: 'A temporary rest period before the soul must re-enter the 3D loop and resume the old harvest.',
      rationale:
        'The cycle is fresh and free, meaning the old synthetic loops are no longer a factor.',
    },
  ],
  25: [
    {
      text: 'Soul fractures, timeline trauma, and karmic wounds accumulated across multiple lifetimes.',
      rationale:
        'Star Pods specifically address timeline trauma and soul fractures accumulated across multiple lifetimes.',
    },
    {
      text: "Only trauma from the soul's current incarnation, leaving earlier lives untouched.",
      rationale:
        'The restoration process mends damage from the entire soul journey across fractured timelines.',
    },
    {
      text: 'Only the last three lives, stopping short of earlier timeline fractures.',
      rationale:
        'The work spans multiple lifetimes and fractured timelines, not a three-life cutoff.',
    },
    {
      text: 'Only physical-body injuries from this lifetime, with no soul-level work.',
      rationale:
        'The work is soul-level restoration, not limited to physical-body injuries of the current incarnation.',
    },
  ],
};

const questionsMeta = [
  {
    number: 1,
    question: 'What primary function do Star Pods serve within the etheric space?',
    hint: 'Consider the role of these vessels in mending fractures across various timelines.',
  },
  {
    number: 2,
    question:
      'Which term describes the deep energetic splits caused by repeated lifetimes of trauma and parasitic intervention?',
    hint: "Look for the term that denotes the actual fragmentation of the soul's integrity.",
  },
  {
    number: 3,
    question: "What is the specific purpose of the 'Womb of Light' during the restoration process?",
    hint: 'Think about the protective and high-frequency nature of this field.',
  },
  {
    number: 4,
    question: 'How does parasite technology utilize trauma within the third-dimensional overlay?',
    hint: 'Focus on how trauma is used to manage and limit soul awareness.',
  },
  {
    number: 5,
    question:
      'What prevents some returning extraterrestrial souls from achieving an instant exit at the end of a cycle?',
    hint: 'Identify the internal state or hesitation mentioned in the core revelations.',
  },
  {
    number: 6,
    question:
      'Which group is described as already awakened souls who assist in the liberation of trapped human souls?',
    hint: 'Look for the collective name given to the returning extraterrestrial assistants.',
  },
  {
    number: 7,
    question: 'In the healing sanctuary sequence, what is the primary function of Water Domes?',
    hint: 'Think about the healing properties traditionally associated with water and sound.',
  },
  {
    number: 8,
    question: 'Where do souls go to clear mental programming and the effects of mind control?',
    hint: 'Identify the sanctuary that utilizes crystalline temples and humming slabs.',
  },
  {
    number: 9,
    question: 'What role do the crystalline grids of the Earth play in the recovery process?',
    hint: "Consider how information is stored when a soul's memory has been wiped.",
  },
  {
    number: 10,
    question:
      'What is the ultimate strategic result of souls achieving full restoration through Nebulae Resting?',
    hint: 'Think about how the healing of individuals affects the collective parasitic system.',
  },
  {
    number: 11,
    question: 'How do guardians and guides appear to souls undergoing Nebulae Resting?',
    hint: 'Focus on the visual description of these non-physical benevolent beings.',
  },
  {
    number: 12,
    question:
      "What ensures that a soul's first conscious realizations in a Star Pod are of safety and homecoming?",
    hint: 'Think about what is missing from this environment that is present in the 3D world.',
  },
  {
    number: 13,
    question: 'Which sequence correctly describes the progression through the healing sanctuaries?',
    hint: 'Consider the order of healing from emotional to mental to the core soul structure.',
  },
  {
    number: 14,
    question: 'What determines how easily solar parents and guides can locate a soul in a Star Pod?',
    hint: 'Think about the relationship between frequency and visibility in the etheric realms.',
  },
  {
    number: 15,
    question: "What is the primary effect of the 'amnesia vortex' associated with the hijacked sun?",
    hint: "Focus on what happens to a soul's awareness of its past and identity.",
  },
  {
    number: 16,
    question: 'Once a soul is fully restored, what choice is granted to them regarding their future?',
    hint: "Look for the concept of empowered sovereignty described in the strategic implications.",
  },
  {
    number: 17,
    question: "What does the term 'Nebulae Resting' simulate for the recovering soul?",
    hint: 'The answer is found in the literal name of the restorative state.',
  },
  {
    number: 18,
    question: "How do the 'liquid sound' vibrations in Water Domes assist in healing?",
    hint: "Connect 'liquid sound' with the specific types of wounds it is designed to mend.",
  },
  {
    number: 19,
    question: 'Which statement about souls who enter Nebulae Resting is true?',
    hint: "Recall the Red Sea event analogy regarding the souls' internal state.",
  },
  {
    number: 20,
    question: 'What is the relationship between physical cathedrals and the healing sanctuaries?',
    hint: "Consider the concept of overlays as it applies to physical and etheric structures.",
  },
  {
    number: 21,
    question: "What is 'loosh' in the context of the 3D overlay?",
    hint: 'Think about what parasites take from humans to sustain their system.',
  },
  {
    number: 22,
    question:
      'Which mechanic involves the detachment of the soul from physical density and sensory constraints?',
    hint: "Look for the term that describes the soul's floating-cocoon state.",
  },
  {
    number: 23,
    question: "What is 'Timeline Trauma'?",
    hint: 'Consider the scope of time over which this particular distress persists.',
  },
  {
    number: 24,
    question: "What does a 'fresh, crystalline cycle' represent for a restored soul?",
    hint: 'Think about the condition of the Known Lands after the parasites are gone.',
  },
  {
    number: 25,
    question: 'What span of damage does Star Pod restoration address?',
    hint: "Consider the definition of Timeline Trauma and the work across fractured timelines.",
  },
];

const questions = [];
const letterCounts = { A: 0, B: 0, C: 0, D: 0 };

for (const meta of questionsMeta) {
  const n = meta.number;
  const set = fullOptionSets[n];
  if (!set || set.length !== 4) {
    throw new Error(`fullOptionSets[${n}] must have 4 options`);
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
    rationale: absoluteVoice(cleanText(o.rationale)),
  }));

  for (const o of rawOptions) {
    if (latexRe.test(o.text) || latexRe.test(o.rationale)) {
      throw new Error(`LaTeX residue in Q${n}: ${o.text}`);
    }
    if (
      /according to the (report|text|source|journal)/i.test(o.rationale) ||
      /according to the (report|text|source|journal)/i.test(o.text) ||
      /the source states/i.test(o.rationale) ||
      /the source states/i.test(o.text) ||
      /the source identifies/i.test(o.rationale) ||
      /the source material/i.test(o.rationale) ||
      /the source explicitly/i.test(o.rationale) ||
      /the source explains/i.test(o.rationale) ||
      /the text states/i.test(o.rationale) ||
      /the text describes/i.test(o.rationale) ||
      /the text suggests/i.test(o.rationale) ||
      /in the journal/i.test(o.rationale) ||
      /in the journal/i.test(o.text) ||
      /the journal describes/i.test(o.rationale) ||
      /in the text\b/i.test(o.rationale) ||
      /living truth journal/i.test(o.text) ||
      /living truth journal/i.test(o.rationale)
    ) {
      throw new Error(`Non-absolute voice in Q${n}: ${o.rationale || o.text}`);
    }
  }

  const { options, correctAnswer } = finalizeOptions(
    rawOptions,
    `${TOPIC_ID}-${n}`
  );
  letterCounts[correctAnswer] = (letterCounts[correctAnswer] || 0) + 1;

  const qText = cleanText(meta.question);
  const hText = cleanText(meta.hint);
  if (latexRe.test(qText) || latexRe.test(hText)) {
    throw new Error(`LaTeX in Q${n} question/hint`);
  }
  if (
    /in the journal/i.test(qText) ||
    /according to the/i.test(qText) ||
    /living truth journal/i.test(qText)
  ) {
    throw new Error(`Hedging in Q${n} question: ${qText}`);
  }

  questions.push({
    number: n,
    question: qText,
    options,
    hint: hText,
    correctAnswer,
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

const SUBTITLE =
  'Test your grasp of Nebulae Resting — Star Pods and the Womb of Light, soul fractures and timeline trauma, Water Domes / Crystal Halls / Starlight Pods, Red Sea doubt, loosh collapse, and sovereign choice after restoration.';

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle: SUBTITLE,
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'Nebulae Resting is the deep suspension inside Star Pods. Sit with the womb of light in etheric space, the reweaving of soul fractures across timelines, and the moment a restored consciousness chooses higher realms or a parasite-free return to the Known Lands. Return to the Nebulae Resting deep-dive, infographic, and video transmissions as you hold that sovereign rest.',
  },
  relatedTopic: {
    href: `/deep-dive.html?source=${SOURCE}&topic=${TOPIC_ID}`,
    label: `Return to ${TOPIC_TITLE} deep-dive`,
  },
  questions,
};

const quizDir = path.join(ROOT, 'data', 'quizzes', SOURCE);
fs.mkdirSync(quizDir, { recursive: true });
const quizJsonPath = path.join(quizDir, `${TOPIC_ID}.json`);
fs.writeFileSync(quizJsonPath, JSON.stringify(quiz, null, 2) + '\n', 'utf8');

const quizMeta = {
  href: `quiz/${SOURCE}/${TOPIC_ID}.html`,
  title: TOPIC_TITLE,
  totalQuestions: 25,
  description:
    'Test your understanding of Nebulae Resting — Star Pods and the Womb of Light; soul fractures, timeline trauma, and karmic wounds; Water Domes / Crystal Halls / Starlight Pods; Red Sea doubt; loosh collapse; and sovereign choice after restoration.',
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
      t.title = TOPIC_TITLE;
      if (t.topic_image && t.topic_image.includes('placeholder')) {
        t.topic_image = topicImage;
      } else if (!t.topic_image) {
        t.topic_image = topicImage;
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('nebulae-resting not found in breakdown-topics.json');
}

const afterOthers = collectImageFields(mono.topics)
  .filter((e) => e.id !== TOPIC_ID)
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();
if (JSON.stringify(beforeOthers) !== JSON.stringify(afterOthers)) {
  throw new Error('Safety check failed: another topic image path was modified');
}

fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'soul-reweaving.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Nebulae Resting: Star Pods and the Womb of Light, soul fractures and timeline trauma, Water Domes / Crystal Halls / Starlight Pods, Red Sea doubt, loosh collapse, and sovereign choice after restoration.';

html = html
  .split('Soul Reweaving Quiz')
  .join(`${TOPIC_TITLE} Quiz`)
  .split(
    'Interactive Living Truth Quiz on Soul Reweaving: star pods and the Womb of Light, soul fractures and timeline trauma, Water Domes / Crystal Halls / Star Pods, Saferons, Red Sea doubt, and sovereign choice after restoration.'
  )
  .join(desc)
  .split('quiz/breakdown/soul-reweaving.html')
  .join(`quiz/${SOURCE}/${TOPIC_ID}.html`)
  .split('images/breakdown/soul-reweaving.webp')
  .join(topicImage)
  .split('deep-dive.html?source=breakdown&amp;topic=soul-reweaving')
  .join(`deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`)
  .split('Soul Reweaving deep-dive')
  .join(`${TOPIC_TITLE} deep-dive`)
  .split('data/quizzes/breakdown/soul-reweaving.json')
  .join(`data/quizzes/${SOURCE}/${TOPIC_ID}.json`);

if (!html.includes(`${TOPIC_TITLE} Quiz`)) {
  throw new Error('HTML clone failed to set quiz title');
}
if (!html.includes(`data-quiz-src="../../data/quizzes/${SOURCE}/${TOPIC_ID}.json"`)) {
  throw new Error('HTML clone failed to set data-quiz-src');
}
if (
  html.includes('soul-reweaving.json') ||
  html.includes('images/breakdown/soul-reweaving.webp') ||
  html.includes('Soul Reweaving')
) {
  throw new Error('HTML clone still points at soul-reweaving assets');
}

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/soul-reweaving.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/nebulae-resting.json'
);
