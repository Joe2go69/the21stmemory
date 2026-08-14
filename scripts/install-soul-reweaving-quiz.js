/**
 * Installs Soul Reweaving quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/reweaving-quiz.json
 * Title forced to "Soul Reweaving". All 25 audited against soul-reweaving report only.
 * NotebookLM wording kept; options expanded only for length balance / fidelity.
 *
 * Run: node scripts/install-soul-reweaving-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/soul-reweaving.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'soul-reweaving';
const TOPIC_TITLE = 'Soul Reweaving';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/reweaving-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/soul-reweaving.webp';

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

/** Support phrases grounded only in soul-reweaving.json report. */
const supportPhrases = {
  1: ['energetic splits', 'fragmented aspects', 'multiple timelines'],
  2: ['etheric space', 'shimmering nebulae', 'deep quiet'],
  3: ['timeline trauma', 'subconscious energetic damage', 'lifetimes and overlays'],
  4: ['womb of light', 'protective field', 'isolate'],
  5: ['saferons', 'safarin', 'council of 12 suns'],
  6: ['crystal halls', 'second stage', 'mental overlays'],
  7: ['higher memory', 'solar parents', 'identity codes'],
  8: ['red sea', 'came to assist', 'doubt'],
  9: ['great dome', 'collective frequency', 'false 3d overlay'],
  10: ['frequency infusion', 'uncorrupted template', 'light frequency'],
  11: ['second realm', 'known lands', 'crystalline civilizations'],
  12: ['soul fractures', 'parasitic interference', 'successive'],
  13: ['pearl-like', 'oceans', 'valleys'],
  14: ['crystal grids', 'planetary hard drives', 'lineage'],
  15: ['vibrational stabilization', 'residual doubt', 'core vibration'],
  16: ['parasite technology', 'energetic vulnerabilities', 'submissive'],
  17: ['reweave', 'energetic blueprint', 'continuity'],
  18: ['shimmering nebulae', 'etheric space', 'isolate'],
  19: ['water domes', 'emotional wounds', 'grief'],
  20: ['without force', 'stabilizing their frequency', 'ground healers'],
  21: ['resonating army', 'identity codes', 'memory reconnection'],
  22: ['parasitic matrix', 'energetic anchor', 'crystalline temple'],
  23: ['clarity', 'sovereignty', 'parasitic programming'],
  24: ['false 3d overlay', 'low-frequency', 'parasitic'],
  25: ['terminal stage', 'soul reweaving', 'star pods'],
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
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The journal describes (?:it as|this as)\s+/i, 'It is '],
    [/\bthe journal describes\b/gi, ''],
    [/\bin the journal\b/gi, ''],
    [/\bthe text explicitly lists\b/gi, ''],
    [/\bthe text describes\b/gi, ''],
    [/\bthe text states\b/gi, ''],
    [/\btheir specified role in the text\b/gi, 'their specified role'],
    [/\bthe source explains\b/gi, ''],
    [/\bthe source identifies\b/gi, ''],
    [/\bis described as\b/gi, 'is'],
    [/\bare described as\b/gi, 'are'],
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
 * NotebookLM claims kept; expanded to similar depth from the soul-reweaving report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'Mending deep energetic splits and integrating fragmented aspects of a soul across multiple timelines.',
      rationale:
        'Soul reweaving is specifically designed to unify scattered parts of the self and repair structural fractures in the soul\'s architecture.',
    },
    {
      text: 'Clearing mental overlays and protecting the consciousness from parasitic whispers.',
      rationale:
        'Mental clearing is part of the broader healing sequence, but it is assigned to the Crystal Halls rather than the star pods.',
    },
    {
      text: 'Washing away emotional wounds such as grief and heartbreak through sound-vibrational pools.',
      rationale:
        'The purification of emotional trauma occurs during the first stage of healing in the Water Domes.',
    },
    {
      text: 'Stabilizing the physical body\'s frequency to prepare it for 3D navigation.',
      rationale:
        'Reweaving operates outside of standard density and focuses on the soul\'s eternal structure rather than 3D physical stabilization.',
    },
  ],
  2: [
    {
      text: 'In the deep quiet of etheric space, resembling a shimmering nebulae.',
      rationale:
        'Etheric space provides a non-physical, isolated environment that protects the soul from the distorted frequencies of the 3D plane.',
    },
    {
      text: 'Inside the planetary hard drives where memory codes are stored.',
      rationale:
        'Planetary hard drives record the journey but do not serve as the actual site for the reweaving procedure.',
    },
    {
      text: 'On humming crystal slabs located in the subterranean healing sanctuaries.',
      rationale:
        'Crystal slabs are the primary mechanism for the second stage of healing within the Crystal Halls.',
    },
    {
      text: 'Within the translucent pearl-like domes resting over the oceans.',
      rationale:
        'The pearl-like sanctuary domes house the sequential healing stages, while the pods themselves occupy the subtle environment of etheric space.',
    },
  ],
  3: [
    {
      text: 'Subconscious energetic damage that persists across different lifetimes and overlays.',
      rationale:
        'This trauma adheres to the soul\'s structure and is often exploited by parasitic technologies to maintain submission.',
    },
    {
      text: 'The psychological stress resulting from transitioning between different historical eras.',
      rationale:
        'Timeline trauma is a persistent structural infection at the soul level, not merely a psychological condition.',
    },
    {
      text: 'The physical degradation of the biological body caused by temporal shifts.',
      rationale:
        'The process addresses the soul\'s energetic blueprint rather than biological or physical decay.',
    },
    {
      text: 'A temporary state of confusion experienced by souls arriving from the second realm.',
      rationale:
        'Timeline trauma is a deep-seated structural issue caused by negative experiences and technological manipulations over many cycles.',
    },
  ],
  4: [
    {
      text: 'It projects a localized protective field of high-frequency light to isolate the soul from interference.',
      rationale:
        'This containment shield prevents external low-frequency distortions and psychic draining during restoration.',
    },
    {
      text: 'It acts as a library for retrieving ancient identity codes from the solar family.',
      rationale:
        'Identity retrieval is a separate phase of memory reconnection, though it happens within the protected environment.',
    },
    {
      text: 'It functions as a sound-vibrational pool to dissolve emotional blockages.',
      rationale:
        'Vibrational pools are characteristic of the Water Domes, the first step in the three-part healing sequence.',
    },
    {
      text: 'It serves as a communication link between the Council of 12 Suns and the ground healers.',
      rationale:
        'The field is primarily a protective container for the individual soul, not a diplomatic communication tool.',
    },
  ],
  5: [
    {
      text: 'Saferons, also known as Safarin — tall, luminous light beings sent from the Council of 12 Suns.',
      rationale:
        'Saferons are tall, luminous light beings sent from the Council of 12 Suns to guide souls through the healing process without force.',
    },
    {
      text: 'Solar parents and solar families, who retrieve ancient identity codes during memory reconnection.',
      rationale:
        'Solar families assist in memory reconnection inside the pod, but sanctuary supervision belongs to specialized light beings.',
    },
    {
      text: 'The resonating army of the Council, present only to retrieve identity codes inside the star pod.',
      rationale:
        'The resonating army supports the retrieval of identity codes but does not serve as the primary ground healers.',
    },
    {
      text: 'Ground-based therapists from the second realm, working as ordinary clinical healers in the sanctuaries.',
      rationale:
        'The supervisors are luminous light beings rather than standard human or realm-based therapists.',
    },
  ],
  6: [
    {
      text: 'The second stage where souls clear mental overlays and mind control damage.',
      rationale:
        'Crystal Halls utilize humming crystal slabs to remove the effects of parasitic whispers and mental interference.',
    },
    {
      text: 'A temporary resting place for souls waiting to return to the known lands.',
      rationale:
        'The halls serve a specific functional purpose in clearing the mind, rather than just being a waiting area.',
    },
    {
      text: 'The final stage where timeline fractures are permanently sealed.',
      rationale:
        'The star pods, not the Crystal Halls, represent the final stage of the restorative sequence.',
    },
    {
      text: 'The initial stage focused on clearing grief and fear from the heart.',
      rationale:
        'The initial stage involves Water Domes and sound-vibrational pools for emotional healing.',
    },
  ],
  7: [
    {
      text: 'Higher memory returns, supported by solar parents and the retrieval of identity codes.',
      rationale:
        'External guides assist the soul in reclaiming its ancient identity and cosmic lineage within the high-frequency environment.',
    },
    {
      text: 'The soul communicates with the Council of 12 Suns to receive new mission parameters.',
      rationale:
        'The phase is focused on the retrieval of the soul\'s own original identity and codes.',
    },
    {
      text: 'The planetary hard drive deletes all memories of the 3D physical illusion.',
      rationale:
        'The goal is to integrate the soul\'s history and restore continuity, not to delete its experiences.',
    },
    {
      text: 'The soul is forced to relive traumatic events to build mental resilience.',
      rationale:
        'The process is restorative and benevolent, not based on re-traumatization or forced endurance.',
    },
  ],
  8: [
    {
      text: 'Souls who came to assist but developed lingering doubt or frequency imbalances.',
      rationale:
        'These individuals survived initial transitions but were hindered by subconscious hesitation, requiring reweaving to fully heal.',
    },
    {
      text: 'The original architects who built the crystalline temples of the known lands.',
      rationale:
        'The architects are distinct from the souls who fell into cycles of doubt during the transition.',
    },
    {
      text: 'Those who successfully avoided the cycle of physical incarnation altogether.',
      rationale:
        'The event refers to souls who entered the physical plane to assist but were affected by the density.',
    },
    {
      text: 'Parasitic entities that were captured during the planetary transition window.',
      rationale:
        'The Red Sea reference applies to those needing rehabilitation, not the parasites exploiting them.',
    },
  ],
  9: [
    {
      text: 'It accelerates the collapse of the false 3D overlay by raising the collective frequency.',
      rationale:
        'As souls are restored and their trauma is removed, the dark matrix loses the energetic anchors required to maintain the illusion.',
    },
    {
      text: 'It forces all souls to transition immediately to the second realm.',
      rationale:
        'Healed souls are granted a choice in their evolutionary cycle; they are not forced to transition.',
    },
    {
      text: 'It enables the Council of 12 Suns to take direct physical control of the known lands.',
      rationale:
        'The consequence is the restoration of sovereign beings and the emergence of crystalline civilization, not external control.',
    },
    {
      text: 'It allows the 3D overlay to be upgraded into a more efficient 4D matrix.',
      rationale:
        'The goal is the collapse of the false overlay, not its upgrade or continuation.',
    },
  ],
  10: [
    {
      text: 'Precise light frequencies are released to match the soul\'s original, uncorrupted template.',
      rationale:
        'These calibrated light streams provide the necessary energetic blueprint to begin the integration of fragmented pieces.',
    },
    {
      text: 'The soul is infused with the collective memories of the resonating army.',
      rationale:
        'The infusion is based on the soul\'s own original, uncorrupted template, not the memories of others.',
    },
    {
      text: 'Low-frequency loops are mirrored back to the soul to encourage self-reflection.',
      rationale:
        'The environment is strictly high-frequency and isolated from low-frequency distortions.',
    },
    {
      text: 'The pod emits sound waves to vibrate the physical body\'s cells into alignment.',
      rationale:
        'Frequency infusion uses light streams calibrated to the soul\'s original template, not physical sound waves.',
    },
  ],
  11: [
    {
      text: 'They may transition to the second realm or return to the known lands to build crystalline civilizations.',
      rationale:
        'Healed souls possess ultimate sovereignty and can choose to advance to higher realms or assist in grounding new physical cycles.',
    },
    {
      text: 'They must remain in the etheric space to serve as guides for others still entering the pods.',
      rationale:
        'While some might choose to assist, the primary choices involve their next evolutionary cycle.',
    },
    {
      text: 'They must enter a new cycle of karmic testing to prove their vibrational stability after restoration.',
      rationale:
        'The soul is already liberated and stable; further testing is part of the old parasitic illusion.',
    },
    {
      text: 'They are required to return to the Council of 12 Suns for permanent reassignment after healing.',
      rationale:
        'The process concludes in absolute freedom and sovereignty, not mandatory reassignment.',
    },
  ],
  12: [
    {
      text: 'Trauma and parasitic interference across successive lifetimes.',
      rationale:
        'These deep-seated splits in the soul\'s core structure result from the density and manipulation encountered in the physical illusion.',
    },
    {
      text: 'Natural evolution within the high-vibrational crystalline temple.',
      rationale:
        'Fractures are energetic breaks caused by trauma and interference, not natural evolution.',
    },
    {
      text: 'The cooling process of the etheric space during pod circulation.',
      rationale:
        'Etheric space is a therapeutic environment, not a source of soul damage.',
    },
    {
      text: 'The intentional decision of the solar parents to divide the soul.',
      rationale:
        'Solar parents assist in healing; they do not cause the fragmentation of the soul.',
    },
  ],
  13: [
    {
      text: 'They are vast, translucent, pearl-like domes resting over oceans and valleys.',
      rationale:
        'These light structures house the sequential stages of soul restoration and are supervised by Safarin.',
    },
    {
      text: 'They are portable units carried by the resonating army from realm to realm.',
      rationale:
        'The sanctuaries are vast, situated domes of light rather than portable units.',
    },
    {
      text: 'They are subterranean laboratories hidden beneath major 3D cities.',
      rationale:
        'The sanctuaries are high-vibrational domes of light, not hidden laboratories.',
    },
    {
      text: 'They are metallic orbital stations circulating the known lands.',
      rationale:
        'The healing infrastructure is composed of light frequencies and translucent materials, not metallic industrial parts.',
    },
  ],
  14: [
    {
      text: 'They record every step of the journey to ensure solar families never lose track of their lineage.',
      rationale:
        'This archival system maintains the continuity of the recovery process and soul lineage.',
    },
    {
      text: 'They generate the low-frequency interference needed to test soul stability during restoration.',
      rationale:
        'These tools are benevolent and used for tracking, not for generating interference.',
    },
    {
      text: 'They store the emotional grief extracted during the Water Dome phase for later review.',
      rationale:
        'Emotional debris is dissolved or mended, not stored in the grids for later.',
    },
    {
      text: 'They power the star pods using energy harvested from the distorted 3D plane.',
      rationale:
        'The pods operate in etheric space using light frequencies, not energy harvested from the distorted 3D plane.',
    },
  ],
  15: [
    {
      text: 'The core vibration of the soul completely stabilizes, dissolving residual doubt or distortion.',
      rationale:
        'This marks the completion of the healing, where the soul reaches absolute clarity and frequency alignment.',
    },
    {
      text: 'The Council of 12 Suns grants the soul a new frequency signature after the pod work.',
      rationale:
        'The process restores the soul\'s original signature rather than providing a new one.',
    },
    {
      text: 'The soul is gradually exposed back to the heavy frequencies of the 3D plane.',
      rationale:
        'Stabilization aims to dissolve distortions, not re-expose the soul to heavy frequencies prematurely.',
    },
    {
      text: 'The soul is bonded to a new physical avatar for immediate return to the known lands.',
      rationale:
        'Vibrational stabilization is an energetic state of the soul itself, not a physical bonding process.',
    },
  ],
  16: [
    {
      text: 'It actively exploits energetic vulnerabilities to keep souls trapped in low-frequency loops.',
      rationale:
        'This technology carries trauma forward through different lifetimes to ensure the soul remains submissive.',
    },
    {
      text: 'It provides the structural architecture that the star pods use for restoration.',
      rationale:
        'Star pods are high-vibrational healing tools, the opposite of parasitic technology.',
    },
    {
      text: 'It is a necessary evolutionary tool used by the Safarin ground healers.',
      rationale:
        'The Safarin are benevolent guides and do not use parasitic technology.',
    },
    {
      text: 'It helps the soul remember its past lives through forced overlays and memory dumps.',
      rationale:
        'Parasite technology is malicious and designed to keep souls submissive, not to aid memory.',
    },
  ],
  17: [
    {
      text: 'They are rewoven into the energetic blueprint to restore continuity.',
      rationale:
        'This phase brings back the scattered pieces of the soul\'s history into a unified alignment.',
    },
    {
      text: 'They are analyzed by the Council of 12 Suns to determine the soul\'s next cycle.',
      rationale:
        'Integration is a mechanical restorative step focused on healing the soul\'s architecture.',
    },
    {
      text: 'They are discarded if they contain any memory of 3D trauma.',
      rationale:
        'The goal is integration and healing of fragments, not discarding pieces of the soul\'s history.',
    },
    {
      text: 'They are transferred into the crystal grids for temporary storage.',
      rationale:
        'Integration happens within the soul\'s own structure in the star pod, not in external storage.',
    },
  ],
  18: [
    {
      text: 'Resting inside a shimmering nebulae, isolated from the heavy frequencies of the 3D plane.',
      rationale:
        'The pod environment simulates a shimmering nebulae, providing a serene and quiet restorative experience.',
    },
    {
      text: 'A feeling of rapid movement through a vacuum rather than deep quiet.',
      rationale:
        'The environment is characterized by deep quiet rather than rapid movement.',
    },
    {
      text: 'Lying on a hard crystal surface surrounded by humming sounds.',
      rationale:
        'This description refers to the Crystal Halls, not the star pods in etheric space.',
    },
    {
      text: 'Submerging in sound-vibrational pools within a pearl dome.',
      rationale:
        'This describes the experience within the Water Domes.',
    },
  ],
  19: [
    {
      text: 'Mending emotional wounds and drawing out grief and fear.',
      rationale:
        'The Water Domes use sound-vibrational pools to address the emotional layer of healing first.',
    },
    {
      text: 'Stabilizing the core soul frequency before final reweaving.',
      rationale:
        'Water Domes are the initial, not final, stage of the therapeutic sequence.',
    },
    {
      text: 'Dismantling mind control damage and mental overlays.',
      rationale:
        'Mental clearing is the focus of the second stage, the Crystal Halls.',
    },
    {
      text: 'Integrating timeline fractures across successive lives.',
      rationale:
        'This is the primary function of the third stage, the star pods.',
    },
  ],
  20: [
    {
      text: 'They guide souls without force and stabilize their frequency.',
      rationale:
        'The benevolent nature of the Safarin ensures that the transition and healing are gentle and voluntary.',
    },
    {
      text: 'They operate remotely via the planetary hard drive as unseen operators.',
      rationale:
        'The Safarin are tall, luminous light beings who guide recovering souls through the sanctuaries. Planetary hard drives record lineage; they are not a remote-control channel for the healers.',
    },
    {
      text: 'They use frequency-based force to ensure compliance during restoration.',
      rationale:
        'The process is non-coercive and the guides do not use force.',
    },
    {
      text: 'They serve as judges to determine if a soul is worthy of reweaving.',
      rationale:
        'Their role is one of guidance and stabilization, not judgment or selection.',
    },
  ],
  21: [
    {
      text: 'They supervise the retrieval of ancient identity codes during memory reconnection.',
      rationale:
        'Along with solar parents, the resonating army assists in the return of higher memory.',
    },
    {
      text: 'They oversee the collapse of the false 3D overlay from inside the pod.',
      rationale:
        'The collapse of the overlay is a strategic consequence of the healing, not a task managed directly by the army in the pods.',
    },
    {
      text: 'They manage the sound-vibrational pools in the Water Domes.',
      rationale:
        'Their role is specifically highlighted during the memory reconnection phase in the pods.',
    },
    {
      text: 'They provide security for the etheric space against parasitic invasion.',
      rationale:
        'Their specified role is supervising the retrieval of ancient identity codes during memory reconnection, not defending etheric space.',
    },
  ],
  22: [
    {
      text: 'The dark, parasitic matrix loses its final energetic anchor.',
      rationale:
        'By repairing the light web and restoring fragmented souls, the matrix is no longer able to anchor itself.',
    },
    {
      text: 'The planetary hard drives are fully synchronized with the star pods.',
      rationale:
        'Synchronization is a record-keeping function, not the catalyst for the final transition.',
    },
    {
      text: 'All souls choose to transition directly to the second realm.',
      rationale:
        'The temple is part of the physical plane\'s transition, which also involves souls returning to build new civilizations.',
    },
    {
      text: 'The Council of 12 Suns descends into the 3D plane as a governing body.',
      rationale:
        'The transition depends on the healing and frequency rise of the souls, not a descent of the Council.',
    },
  ],
  23: [
    {
      text: 'Total clarity, sovereignty, and absolute freedom from parasitic programming.',
      rationale:
        'The healed soul emerges completely whole and liberated from the loops and traps of the physical illusion.',
    },
    {
      text: 'A temporary period of recovery before the next trauma cycle begins again.',
      rationale:
        'Reweaving aims for permanent healing and liberation from trauma cycles.',
    },
    {
      text: 'The loss of all individual identity to join a collective hive mind.',
      rationale:
        'The process restores ancient identity codes and individual sovereignty, not a hive mind.',
    },
    {
      text: 'A state of eternal submission to the Council of 12 Suns.',
      rationale:
        'The process is designed to achieve sovereignty and freedom, not submission.',
    },
  ],
  24: [
    {
      text: 'A false, low-frequency loop maintained by parasitic technology.',
      rationale:
        'The 3D overlay is a dense physical illusion and a low-frequency loop imposed by parasite technology to keep souls submissive through the illusion of separation.',
    },
    {
      text: 'A protective field maintained by the Council of 12 Suns around the known lands.',
      rationale:
        'The Council works to liberate souls from the overlay, which is parasitic in nature.',
    },
    {
      text: 'A necessary training ground for evolving souls through successive incarnations.',
      rationale:
        'It is a dense physical illusion and an artificial trap, rather than a necessary training ground.',
    },
    {
      text: 'The original uncorrupted architecture of the physical realm itself.',
      rationale:
        'The crystalline temple is the uncorrupted state; the 3D overlay is the distortion that must collapse.',
    },
  ],
  25: [
    {
      text: 'Soul reweaving within the star pods, the terminal restoration stage.',
      rationale:
        'Soul reweaving represents the final phase of restoration for souls caught within dense physical illusions.',
    },
    {
      text: 'Recording the soul\'s lineage in the planetary hard drive.',
      rationale:
        'Recording is a supportive function that occurs throughout, rather than the terminal healing stage itself.',
    },
    {
      text: 'The integration of emotional wounds in the Water Domes.',
      rationale:
        'This is the first stage of the healing sequence.',
    },
    {
      text: 'Resting on humming crystal slabs in the Crystal Halls.',
      rationale:
        'This is the second stage, focusing on mental healing, not the final stage.',
    },
  ],
};

const questionsMeta = [
  {
    number: 1,
    question: 'What is the primary function of soul reweaving within the star pod environment?',
    hint: 'Consider the specific restorative mechanism used to address damage across different temporal sequences.',
  },
  {
    number: 2,
    question: 'Where are the floating star pods situated during the restorative process?',
    hint: 'Think about the subtle, non-physical environment that sits outside of standard density.',
  },
  {
    number: 3,
    question: "What does the term 'Timeline Trauma' specifically describe?",
    hint: 'This concept refers to a persistent infection that follows a soul through various incarnations.',
  },
  {
    number: 4,
    question: "How does the 'Womb of Light' facilitate the soul's recovery?",
    hint: "Focus on the protective and isolation-focused qualities of the pod's light projection.",
  },
  {
    number: 5,
    question: "Which beings are responsible for supervising the healing sanctuaries and stabilizing the souls' frequencies?",
    hint: 'These luminous guides are sent specifically from the Council of 12 Suns.',
  },
  {
    number: 6,
    question: 'In the three-part therapeutic progression, what is the role of the Crystal Halls?',
    hint: 'This stage occurs after the emotional clearing of the Water Domes but before the soul reweaving of the star pods.',
  },
  {
    number: 7,
    question: "What occurs during the 'Memory Reconnection' phase of soul reweaving?",
    hint: 'External guides like solar families play a critical role in this specific part of the process.',
  },
  {
    number: 8,
    question: "The historical 'Red Sea event' is mentioned to illustrate which group of souls?",
    hint: 'This group consists of helpers who were caught in cycles of doubt and imbalance.',
  },
  {
    number: 9,
    question: "What is the strategic consequence of completing the soul reweaving process for the 'Great Dome'?",
    hint: 'Consider how individual healing impacts the overall vibrational state of the realm.',
  },
  {
    number: 10,
    question: "What happens during the 'Frequency Infusion' step within a star pod?",
    hint: "This step involves matching the soul back to its primary, non-distorted blueprint.",
  },
  {
    number: 11,
    question: 'What choice is granted to a soul once it has emerged from the star pod and its reweaving is complete?',
    hint: 'The outcome involves a decision between higher-realm transition and planet-side reconstruction.',
  },
  {
    number: 12,
    question: "What are 'Soul Fractures' specifically caused by?",
    hint: 'Look for the external negative influences that disrupt the core structure of consciousness.',
  },
  {
    number: 13,
    question: 'In the context of the healing sanctuaries, what is the appearance and location of these structures?',
    hint: 'These structures are defined by their translucent, dome-like appearance in nature.',
  },
  {
    number: 14,
    question: "What is the function of the 'Crystal Grids' and 'Planetary Hard Drives' during the healing process?",
    hint: 'Focus on the role of information preservation and lineage tracking.',
  },
  {
    number: 15,
    question: "What defines the final 'Vibrational Stabilization' phase of soul reweaving?",
    hint: 'This phase is about reaching a state of total energetic balance and clarity.',
  },
  {
    number: 16,
    question: "Why is 'Parasite Technology' a concern for souls prior to reweaving?",
    hint: "Consider the negative impact of these mechanisms on a soul's freedom and submission.",
  },
  {
    number: 17,
    question: "During the 'Synthesis and Integration' phase, what specifically happens to the soul fragments?",
    hint: "Focus on the restoration of the soul's energetic blueprint through the unification of its pieces.",
  },
  {
    number: 18,
    question: 'What is the experiential sensation of resting inside a star pod?',
    hint: 'Consider the visual and environmental description associated with the deep quiet of etheric space.',
  },
  {
    number: 19,
    question: 'What is the primary objective of the Water Domes?',
    hint: 'Think about the first layer of trauma addressed in the sequence: the emotional layer.',
  },
  {
    number: 20,
    question: 'How are the ground healers (Safarin) described in terms of their method of guidance?',
    hint: 'Their approach is benevolent and focuses on stabilization rather than coercion.',
  },
  {
    number: 21,
    question: "What role does the 'Resonating Army' play in the star pod process?",
    hint: "Focus on their contribution to the retrieval of a soul's original identity.",
  },
  {
    number: 22,
    question: "The transition of the physical plane into a 'unified crystalline temple' is completed when:",
    hint: 'Think about what happens when the parasitic matrix no longer has fragmented souls to exploit.',
  },
  {
    number: 23,
    question: 'What is the ultimate state achieved by a soul after emerging from the restorative process?',
    hint: "The goal is a profound return to the soul's original, uncorrupted state.",
  },
  {
    number: 24,
    question: 'How is the 3D overlay characterized?',
    hint: 'Consider its relationship to parasitic technology and the illusion of separation.',
  },
  {
    number: 25,
    question: 'What is the terminal stage of the comprehensive rehabilitation process for souls?',
    hint: 'Think about the final step in the three-part healing sequence.',
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
      /the text states/i.test(o.rationale) ||
      /the text describes/i.test(o.rationale) ||
      /in the journal/i.test(o.rationale) ||
      /in the journal/i.test(o.text) ||
      /the journal describes/i.test(o.rationale) ||
      /in the text\b/i.test(o.rationale)
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
  if (/in the journal/i.test(qText)) {
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
  'Test your grasp of Soul Reweaving — star pods and the Womb of Light, soul fractures and timeline trauma, Water Domes / Crystal Halls / Star Pods, Saferons, Red Sea doubt, and sovereign choice after restoration.';

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
    body: 'Soul Reweaving is the terminal restoration inside star pods. Sit with the Womb of Light isolating a fractured soul, the light frequencies matching the original template, and the moment a rewoven consciousness chooses the second realm or a parasite-free return to the known lands. Return to the Soul Reweaving deep-dive, infographic, and video transmissions as you hold that sovereign architecture.',
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
    'Test your understanding of Soul Reweaving — star pods and the Womb of Light; soul fractures, timeline trauma, and karmic wounds; Water Domes / Crystal Halls / Star Pods; Saferons; Red Sea doubt; and sovereign choice after restoration.',
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
  throw new Error('soul-reweaving not found in breakdown-topics.json');
}

const afterOthers = collectImageFields(mono.topics)
  .filter((e) => e.id !== TOPIC_ID)
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();
if (JSON.stringify(beforeOthers) !== JSON.stringify(afterOthers)) {
  throw new Error('Safety check failed: another topic image path was modified');
}

fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'timeline-healing.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Soul Reweaving: star pods and the Womb of Light, soul fractures and timeline trauma, Water Domes / Crystal Halls / Star Pods, Saferons, Red Sea doubt, and sovereign choice after restoration.';

html = html
  .split('Timeline Healing Quiz').join(`${TOPIC_TITLE} Quiz`)
  .split('Interactive Living Truth Quiz on Timeline Healing: etheric Star Pods and the Womb of Light, soul fractures and karmic wounds, Water Domes / Crystal Halls / Star Pods, Red Sea doubt, loosh collapse, and sovereign return to the Known Lands.')
  .join(desc)
  .split('quiz/breakdown/timeline-healing.html').join(`quiz/${SOURCE}/${TOPIC_ID}.html`)
  .split('images/breakdown/timeline-healing.webp').join(topicImage)
  .split('deep-dive.html?source=breakdown&amp;topic=timeline-healing')
  .join(`deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`)
  .split('Timeline Healing deep-dive').join(`${TOPIC_TITLE} deep-dive`)
  .split('data/quizzes/breakdown/timeline-healing.json')
  .join(`data/quizzes/${SOURCE}/${TOPIC_ID}.json`)
  .split('topic=timeline-healing').join(`topic=${TOPIC_ID}`)
  .split('timeline-healing.webp').join('soul-reweaving.webp')
  .split('timeline-healing.json').join('soul-reweaving.json')
  .split('timeline-healing.html').join('soul-reweaving.html');

if (!html.includes(`${TOPIC_TITLE} Quiz`)) {
  throw new Error('HTML clone failed to set quiz title');
}
if (!html.includes(`data-quiz-src="../../data/quizzes/${SOURCE}/${TOPIC_ID}.json"`)) {
  throw new Error('HTML clone failed to set data-quiz-src');
}
if (
  html.includes('timeline-healing.json') ||
  html.includes('images/breakdown/timeline-healing.webp')
) {
  throw new Error('HTML clone still points at timeline-healing assets');
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
    "  { path: '/quiz/breakdown/timeline-healing.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/soul-reweaving.json'
);
