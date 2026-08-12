/**
 * Installs Memory Restoration quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/restoration-quiz.json
 * Title forced to "Memory Restoration". All 25 audited against memory-restoration report only.
 *
 * Run: node scripts/install-memory-restoration-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/memory-restoration.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'memory-restoration';
const TOPIC_TITLE = 'Memory Restoration';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/restoration-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/memory-restoration.webp';

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

/** Support phrases grounded only in memory-restoration.json report. */
const supportPhrases = {
  1: ['water domes', 'heart', 'emotional trauma', 'memory restoration'],
  2: ['blue, aqua, and silver', 'frequency ingredients', 'color'],
  3: ['liquid sound', 'resonant frequency', 'emotional density', 'extract'],
  4: ['ground healers', 'saferins', 'saferons', 'council of 12 suns'],
  5: ['bio-fields', 'calm', 'love', 'i am safe'],
  6: ['memory codes of source', 'vision', 'consciousness'],
  7: ['harmonic resonance', 'density', 'replaced'],
  8: ['resonating army', 'do not require', 'healing sanctuaries'],
  9: ['vatican', 'reincarnation', 'memory streams'],
  10: ['starlight pods', 'soul fractures', 'timeline trauma'],
  11: ['spirit tree', 'parasites', 'suppressed'],
  12: ['sound recall', 'harmonic tones', 'timeline'],
  13: ['intellectual', 'vibrational consequence', 'heart-mending'],
  14: ['i am safe', 'i am home', 'presence and touch'],
  15: ['low-frequency filter', 'emotional density', 'amnesia'],
  16: ['vibrational extraction', 'flotation', 'liquid sound'],
  17: ['perception-based collapse', 'panic', 'stabiliz'],
  18: ['memory codes of source', 'pristine', 'uncorrupted water'],
  19: ['uncoerced', 'ascend', 'known lands'],
  20: ['pearlescent', 'translucent', 'shimmering'],
  21: ['holographic', 'shift', 'original family'],
  22: ['dome of sheol', 'healing and recovery', 'seven domes'],
  23: ['lighter', 'smiling', 'singing'],
  24: ['harmonic resonance', 'vibrational alignment', 'source energy'],
  25: ['spirit tree', 'roots', 'resonating army', 'lighting up'],
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
    [/^The source identifies\s+/i, ''],
    [/^The source notes that\s+/i, ''],
    [/^The source notes\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/\bthe source identifies these beings specifically as\b/gi, 'these beings are'],
    [/\bthe source notes that\b/gi, ''],
    [/\bthe text states they\b/gi, 'they'],
    [/\bthe text states\b/gi, ''],
    [/\bthe text describes\b/gi, ''],
    [/\bthe text explicitly\b/gi, ''],
    [/\bis described as\b/gi, 'is'],
    [/\bare described as\b/gi, 'are'],
    [/\bis identified as\b/gi, 'is'],
    [/\bare identified as\b/gi, 'are'],
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
 * All four options at similar depth from the memory-restoration report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'Mending the heart and clearing emotional trauma so Memory Restoration can unfold as a vibrational consequence of heart-mending.',
      rationale:
        'Water Domes are specifically tuned to address deep emotional trauma and facilitate Memory Restoration; they are the heart-mending first stage of the restorative network.',
    },
    {
      text: 'Reweaving soul fractures and timeline trauma across multiple incarnations inside floating etheric cocoons.',
      rationale:
        'Soul fractures and timeline trauma are mended in Starlight Pods, not as the primary function of the Water Domes heart tier.',
    },
    {
      text: 'Realigning the light body grid with living quartz and crystal slabs to shatter mental overlays only.',
      rationale:
        'Grid realignment with quartz slabs is Crystal Halls work for the mind; Water Domes mend the heart and clear emotional trauma.',
    },
    {
      text: 'Shattering mental overlays and parasitic programming as the sole purpose of the Water Dome pools.',
      rationale:
        'Mental overlays and parasitic programming are the focus of Crystal Halls; Water Domes target emotional wounds and heart mending.',
    },
  ],
  2: [
    {
      text: 'Blue, aqua, and silver light-sound frequencies that act as calculated radio-tuner notes for the soul.',
      rationale:
        'Blue, aqua, and silver colors radiating from the domes act as active frequency ingredients—calculated light-sound vibrations that pull perception out of low-frequency bands.',
    },
    {
      text: 'Indigo, teal, and crystalline white notes used only for Crystal Hall mental realignment sequences.',
      rationale:
        'The Water Dome signature palette is blue, aqua, and silver; indigo-teal-white is not named as the dome frequency ingredients.',
    },
    {
      text: 'Gold, white, and violet beams that power Starlight Pods without any Water Dome color role.',
      rationale:
        'Water Domes use blue, aqua, and silver as active frequency ingredients; gold-white-violet is not the named Water Dome palette.',
    },
    {
      text: 'Emerald, sapphire, and rose tones reserved for Vatican archive recycling of soul fragments.',
      rationale:
        'Dome architecture uses blue, aqua, and silver light-sound frequencies for healing, not emerald-sapphire-rose tones for archive recycling.',
    },
  ],
  3: [
    {
      text: 'It matches trauma’s resonant frequency and draws out emotional density via electromagnetic friction.',
      rationale:
        'Liquid Sound penetrates the energetic field, matches the resonant frequency of the soul’s trauma, and draws out heavy distorted emotional density through electromagnetic friction.',
    },
    {
      text: 'It provides only a physical lubricant so the crystalline body can slide through solid pool walls without vibration.',
      rationale:
        'The process is vibrational and electromagnetic density extraction, not mechanical lubrication of a crystalline body.',
    },
    {
      text: 'It acts solely as a soundproofing barrier that blocks all Source memory codes from entering the soul’s field.',
      rationale:
        'Liquid Sound is a superconductive medium for extraction and resonance replacement, not a barrier that blocks Source memory codes.',
    },
    {
      text: 'It serves as the exclusive power plant that runs the Council of 12 Suns instead of healing recovering souls.',
      rationale:
        'The Council of 12 Suns sends Ground Healers; Liquid Sound is the Water Dome tool for trauma extraction and soul realignment, not the Council’s power plant.',
    },
  ],
  4: [
    {
      text: 'Benevolent holographic light beings known as Saferins or Saferons from the Council of 12 Suns.',
      rationale:
        'Ground Healers, also called Saferins or Saferons, are tall radiant holographic light beings sent from the Council of 12 Suns to guide and stabilize recovering souls.',
    },
    {
      text: 'Physical members of the Resonating Army who must first complete full density extraction themselves.',
      rationale:
        'The Resonating Army may later choose to supervise; primary Ground Healers are Council-sent holographic Saferins/Saferons, and Army members already hold stable frequencies.',
    },
    {
      text: 'Ascended Masters permanently stationed inside the Great Dome with no Council of 12 Suns origin.',
      rationale:
        'Ground Healers are Saferins/Saferons from the Council of 12 Suns, not Great Dome–stationed ascended masters as the named supervising class.',
    },
    {
      text: 'Crystalline entities that grow only from Spirit Tree roots and never take holographic light form.',
      rationale:
        'Healers are holographic light beings from the Council of 12 Suns; the Spirit Tree supplies dome power through crystalline grids, not by spawning the healers themselves.',
    },
  ],
  5: [
    {
      text: 'Massive bio-fields projecting absolute calm, love, and tranquility through presence and touch.',
      rationale:
        'Ground Healers’ massive bio-fields project absolute calm, love, and tranquility; their presence and touch neutralize lingering panic so the soul realizes it is safe and home.',
    },
    {
      text: 'Immediate forced submersion alone, with no bio-field calm, love, or gentle healer touch at arrival.',
      rationale:
        'Submersion is part of the pool sequence, but initial panic neutralization comes from healer bio-fields, presence, and touch—not forced dunking alone.',
    },
    {
      text: 'High-frequency liquid light sedatives administered chemically to overwrite fear without any field contact.',
      rationale:
        'Supervision is non-forceful and frequency-based through luminous bio-fields, not chemical or medicinal sedatives.',
    },
    {
      text: 'Mental command overwrites that forcibly erase fear responses before any calm bio-field contact can occur.',
      rationale:
        'Healers use resonance, calm, and love—not forceful mental overwrites—to neutralize panic in recovering souls.',
    },
  ],
  6: [
    {
      text: 'Memory Codes of Source in the water interface with consciousness after emotional density is cleared.',
      rationale:
        'Once density is cleared, Memory Codes of Source held in the water interface with the soul’s consciousness, triggering detailed cinematic vision recall of home worlds and pre-descent history.',
    },
    {
      text: 'Mandatory viewing of holographic records stored only inside Crystal Halls with no Water Dome role.',
      rationale:
        'Vision recall is triggered inside Water Domes when Source memory codes in the water meet consciousness after density clears—not by Crystal Hall record playback.',
    },
    {
      text: 'Mechanical reconstruction of every pre-incarnational contract by hand before any water immersion.',
      rationale:
        'Memory restoration is a vibrational consequence of heart-mending and code interface, not mechanical hand-reconstruction of contracts.',
    },
    {
      text: 'Ground Healers alone project home-world movies while the water remains inert and code-free.',
      rationale:
        'Healers may shift form to mirror family for comfort; vision recall itself is triggered by Memory Codes of Source in the water interfacing with consciousness.',
    },
  ],
  7: [
    {
      text: 'It is immediately replaced with pure harmonic resonance as part of resonance replacement.',
      rationale:
        'After density draw-down, drawn-out trauma is immediately replaced with pure harmonic resonance—the vibrational alignment that restores natural soul-expression and memory.',
    },
    {
      text: 'It stays void until Crystal Halls later inject density back as a required second-stage void state.',
      rationale:
        'Resonance replacement happens in the Water Dome pool sequence once density is extracted; the field is not left void for Crystal Halls to refill with density.',
    },
    {
      text: 'It drops into denser 3D frequency so the soul can re-enter looping matrix illusions on purpose.',
      rationale:
        'The process pulls souls out of distorted low-frequency bands and into harmonic resonance, not back into denser 3D looping frequencies.',
    },
    {
      text: 'It is locked by Great Dome parasitic programming so amnesia filters permanently remain in place.',
      rationale:
        'Restoration clears density and restores harmonic resonance; it dismantles amnesia filters rather than locking them with parasitic programming.',
    },
  ],
  8: [
    {
      text: 'False — Resonating Army members already hold highly active, stable frequencies and do not require healing sanctuaries.',
      rationale:
        'Once they depart through frequency gates, Resonating Army members do not require healing sanctuaries; they may visit Water Domes to supervise and speed recovery of human souls they came to free.',
    },
    {
      text: 'True — every Resonating Army member must complete full Water Dome density extraction before any further mission.',
      rationale:
        'They do not require healing sanctuaries because their frequencies are already highly active and stable; mandatory Water Dome healing is not their path.',
    },
    {
      text: 'True — Saferins bar the Resonating Army from home realms until Starlight Pods finish every timeline reweave.',
      rationale:
        'Army members return to home realms with stable frequencies; optional Water Dome visits are to supervise others, not a barred prerequisite of Starlight Pod completion.',
    },
    {
      text: 'True — they must first re-enter the Vatican loop to recycle fragments before any dome supervision role.',
      rationale:
        'Water Domes help dismantle the Vatican loop for recovering souls; the Resonating Army does not need that loop and is not required to re-enter it.',
    },
  ],
  9: [
    {
      text: 'They bypass and dismantle counterfeit reincarnation cycles that copied and recycled soul fragments.',
      rationale:
        'By mending the heart and restoring true memory streams, Water Domes completely bypass and dismantle counterfeit reincarnation cycles managed by the suppressed Vatican archive system.',
    },
    {
      text: 'They store temporary copies of Vatican-suppressed data as the primary archive backup facility.',
      rationale:
        'Domes are healing and restoration sanctuaries that dismantle the Vatican loop, not temporary storage vaults for the suppressor archives.',
    },
    {
      text: 'They draw harmonic power exclusively from Vatican currents to run recovery pools and Ground Healers.',
      rationale:
        'Dome power historically and now ties to the Spirit Tree and crystalline grids, not to Vatican harmonic currents.',
    },
    {
      text: 'They serve as infiltration gateways so confused souls can re-enter the Vatican 3D matrix on purpose.',
      rationale:
        'Domes stabilize and free souls from matrix manipulation; they are not gateways designed to push souls back into the Vatican 3D system.',
    },
  ],
  10: [
    {
      text: 'Starlight Pods — floating etheric cocoons in nebulae-like spaces that reweave soul fractures and timeline trauma.',
      rationale:
        'Starlight Pods mend the soul using floating etheric cocoons in nebulae-like spaces to reweave soul fractures and timeline trauma across multiple incarnations.',
    },
    {
      text: 'Crystal Halls — living quartz and crystal slabs that exclusively reweave soul fractures across incarnations.',
      rationale:
        'Crystal Halls mend the mind and light body grid, shattering mental overlays and parasitic programming; soul-fracture reweaving is Starlight Pods.',
    },
    {
      text: 'The Dome of Sheol alone — now the only named site that reweaves timeline trauma in the three-part network.',
      rationale:
        'Sheol was originally a healing and recovery dome among the seven, but the third stage of the restorative network for soul fractures is Starlight Pods.',
    },
    {
      text: 'Water Domes — liquid sound pools whose only purpose is reweaving multi-incarnation soul fractures.',
      rationale:
        'Water Domes mend the heart from emotional wounds; soul-fracture and timeline reweaving belongs to Starlight Pods.',
    },
  ],
  11: [
    {
      text: 'Removal of the Spirit Tree by parasites, which cut the clean light and harmonic feed into the outer domes.',
      rationale:
        'The Spirit Tree pulsed clean continuous light and harmonic currents into crystalline grids feeding outer domes; after parasites removed the tree, the water became suppressed.',
    },
    {
      text: 'Over-extraction of Liquid Sound by the Council of 12 Suns for use as their exclusive power supply.',
      rationale:
        'The Council sends Ground Healers; suppression came from parasitic removal of the Spirit Tree, not Council over-extraction of Liquid Sound.',
    },
    {
      text: 'A purely natural drift of crystalline grids with no parasitic intervention or Spirit Tree removal.',
      rationale:
        'Suppression followed parasitic removal of the Spirit Tree, not a spontaneous natural grid drift without intervention.',
    },
    {
      text: 'Corruption of Memory Codes by the Resonating Army during early liberation campaigns.',
      rationale:
        'The Resonating Army fractures artificial 3D overlays so Spirit Tree roots light up again; they restore, rather than corrupt, dome power and codes.',
    },
  ],
  12: [
    {
      text: 'Hearing ancient harmonic tones from lifetimes ago that spark rapid forward-rolling timeline recovery.',
      rationale:
        'Sound Recall is the auditory channel: souls hear ancient harmonic tones heard lifetimes ago, triggering rapid forward-rolling recovery of their unbroken timeline.',
    },
    {
      text: 'A permanent telepathic hard-line between each healer and soul that replaces all harmonic tone memory.',
      rationale:
        'Sound Recall is a specific sensory memory channel via ancient harmonic tones, not a permanent telepathic hard-line that replaces tone-triggered recall.',
    },
    {
      text: 'Instant fluency in a Council of 12 Suns spoken language with no timeline recovery component.',
      rationale:
        'Sound Recall concerns ancient harmonic tones and unbroken timeline recovery, not acquisition of a Council administrative language.',
    },
    {
      text: 'Recording a spoken confession of guilt so archives can clear density without any pool extraction.',
      rationale:
        'Guilt density is drawn out vibrationally by Liquid Sound in the pools; Sound Recall is auditory memory ignition, not confession recording.',
    },
  ],
  13: [
    {
      text: 'False — recovery is a vibrational consequence of heart-mending, not intellectual fact retrieval.',
      rationale:
        'Within Water Domes, memory recovery is not an intellectual retrieval process but a direct vibrational consequence of heart-mending after emotional density clears.',
    },
    {
      text: 'True — restoration is primarily an intellectual quiz of facts with no vibrational heart-mending required at all.',
      rationale:
        'The process is explicitly vibrational heart-mending and density clearing, not primary intellectual fact retrieval.',
    },
    {
      text: 'True — only Crystal Halls use vibration; Water Domes restore memory solely through written pre-incarnational contracts.',
      rationale:
        'Water Domes restore memory through liquid sound, density extraction, and Source codes—vibrational heart-mending—not written-contract study alone.',
    },
    {
      text: 'True — Ground Healers lecture each soul on timelines until intellectual mastery alone triggers full recall.',
      rationale:
        'Healers stabilize with bio-fields and calm; memory streams re-emerge when density clears and codes interface—not via intellectual lecture mastery.',
    },
  ],
  14: [
    {
      text: 'The inner realization “I am safe. I am home.” as panic neutralizes under healer presence and touch.',
      rationale:
        'When a recovering soul arrives confused or shocked, the presence and touch of Ground Healers neutralize panic, generating the instant inner realization: “I am safe. I am home.”',
    },
    {
      text: 'The conviction “My memories are permanently lost” as the bio-field confirms irreversible amnesia.',
      rationale:
        'Healer presence signals safety and the start of restoration; it produces “I am safe. I am home,” not permanent-memory-loss conviction.',
    },
    {
      text: 'The identity claim “I am a fragment of the Great Dome” with no sovereign creator remembrance.',
      rationale:
        'Restored souls realize nature as sovereign eternal creators; healer contact yields safety and homecoming, not Great Dome fragment identity.',
    },
    {
      text: 'The urgent command “I must return to the 3D matrix now” while still in shock and confusion.',
      rationale:
        'Restoration frees souls from matrix looping and panic; the immediate healer-triggered realization is safety and home, not forced return into 3D confusion.',
    },
  ],
  15: [
    {
      text: 'A heavy low-frequency filter of trauma, grief, fear, guilt, and heartbreak that maintains amnesia.',
      rationale:
        'Emotional density is accumulated energetic weight of trauma, grief, fear, guilt, and heartbreak; as a low-frequency filter it distorts the energetic matrix and maintains state-induced amnesia.',
    },
    {
      text: 'The natural high-frequency state of a soul before any Known Lands embodiment or trauma accumulation.',
      rationale:
        'Density is accumulated trauma weight that suppresses harmonic frequency; it is a distortion, not the natural pre-trauma high state.',
    },
    {
      text: 'A pure physical ballast that stops flotation so souls cannot enter Water Dome pools at all.',
      rationale:
        'Density is energetic weight in the light body; souls still float in pools while liquid sound draws density out—it does not prevent flotation entry.',
    },
    {
      text: 'Only an external shadow cast by overlays with no filter effect inside the soul’s own energetic matrix.',
      rationale:
        'Density acts as a heavy low-frequency filter within the soul’s energetic matrix that maintains amnesia, not merely an external overlay shadow.',
    },
  ],
  16: [
    {
      text: 'Vibrational Extraction — liquid sound penetrates the field and matches trauma’s resonant frequency.',
      rationale:
        'After Flotation, Vibrational Extraction is next: water vibrating as liquid sound penetrates the energetic field and matches the resonant frequency of the soul’s trauma.',
    },
    {
      text: 'Vision Recall — cinematic home-world memories before any density has been matched or drawn out of the field.',
      rationale:
        'Vision Recall activates after emotional density is cleared and Memory Codes interface; it is not the second pool step after flotation.',
    },
    {
      text: 'Density Draw-Down — electromagnetic friction pull that happens before liquid sound matches trauma frequency.',
      rationale:
        'Density Draw-Down follows Vibrational Extraction; the second named step after flotation is Vibrational Extraction itself.',
    },
    {
      text: 'Resonance Replacement — pure harmonic fill that occurs before trauma frequency is matched by liquid sound.',
      rationale:
        'Resonance Replacement is the later step that fills space after density is drawn out; second after flotation is Vibrational Extraction.',
    },
  ],
  17: [
    {
      text: 'It prevents perception-based collapse or panic when artificial 3D holographic overlays dissolve.',
      rationale:
        'Frequency stabilization ensures souls do not experience perception-based collapse or panic when artificial 3D holographic overlays begin to dissolve.',
    },
    {
      text: 'It locks the soul into permanent 3D physical form so overlays can never dissolve around them.',
      rationale:
        'Stabilization supports calm perception during overlay dissolution, not permanent locking into 3D physical form.',
    },
    {
      text: 'It automatically drafts every recovered soul into Resonating Army combat without recovery rest.',
      rationale:
        'Dome stabilization is for recovery and peaceful transition; primary strategic benefit is avoiding panic as overlays dissolve, not forced combat enlistment.',
    },
    {
      text: 'It forces a single path of ascension with no autonomous choice of Known Lands return afterward.',
      rationale:
        'Stabilization enables uncoerced autonomous path selection later; it does not force ascension as the only allowed outcome.',
    },
  ],
  18: [
    {
      text: 'Embedded in the pristine, uncorrupted water under the Water Domes as high-frequency informational templates.',
      rationale:
        'Memory Codes of Source are high-frequency informational templates embedded in pristine uncorrupted water that restore true identity, original timelines, and past-life recollection.',
    },
    {
      text: 'Only inside suppressed conductor waters of the artificial 3D matrix that lack uncorrupted templates.',
      rationale:
        '3D matrix conductor waters are highly corrupted and suppressed; pristine Water Dome waters hold the uncorrupted Memory Codes of Source.',
    },
    {
      text: 'Exclusively inside living quartz slabs of Crystal Halls with no presence in Water Dome pools.',
      rationale:
        'Codes are embedded in pristine Water Dome water; Crystal Halls use living quartz for mind and grid realignment, not as the named code reservoir here.',
    },
    {
      text: 'Stored only in Council of 12 Suns private memory with no environmental interface for recovering souls.',
      rationale:
        'Codes are embedded in dome water for direct interface with soul consciousness during restoration, not locked solely in Council private memory.',
    },
  ],
  19: [
    {
      text: 'Uncoerced autonomous path selection—to ascend to higher realms or return to a fresh parasite-free Known Lands cycle.',
      rationale:
        'Once memory is fully restored, the soul is free of external manipulation and can choose uncoerced to ascend to higher realms or return to a fresh uncorrupted creation cycle in the crystalline Known Lands.',
    },
    {
      text: 'Automatic forced return to an original home-world family with no choice of ascent or Known Lands path.',
      rationale:
        'Freedom is autonomous path selection between ascent and a fresh Known Lands cycle—not automatic forced relocation without choice.',
    },
    {
      text: 'Immediate promotion to the Council of 12 Suns as a mandatory next administrative rank.',
      rationale:
        'Restored freedom is sovereign path choice; souls are not automatically promoted into the Council of 12 Suns.',
    },
    {
      text: 'Power to personally dismantle Vatican archives as the only allowed post-restoration mission.',
      rationale:
        'Primary freedom is uncoerced path selection; while the Vatican loop is bypassed systemically, souls are not limited to a single archive-dismantling assignment.',
    },
  ],
  20: [
    {
      text: 'Vast shimmering pearlescent translucent domes of light projected as invisible energy fields over crystalline waters.',
      rationale:
        'Water Domes are vast, shimmering, pearlescent healing sanctuaries—pearl-like translucent domes of light projected as invisible energy fields over crystalline lakes, oceans, and pristine waters.',
    },
    {
      text: 'Metallic capsules floating only in the upper atmosphere with no projection over lakes or oceans.',
      rationale:
        'Domes are projected over crystalline lakes, oceans, and pristine waters as light-sound-crystal sanctuaries, not metallic upper-atmosphere capsules.',
    },
    {
      text: 'Solid obsidian buildings of ancient stone with no translucent light-based shell at all.',
      rationale:
        'Domes are translucent condensed light, sound, and living crystal—not solid obsidian stone hospitals.',
    },
    {
      text: 'Green and gold energy spheres stationed only inside the Great Dome with no blue-aqua-silver notes.',
      rationale:
        'Appearance and color notes are pearlescent light with blue, aqua, and silver frequencies over pristine waters, not green-gold Great Dome spheres.',
    },
  ],
  21: [
    {
      text: 'By dynamically shifting their holographic form to mirror a soul’s original family appearance.',
      rationale:
        'As gentle non-forceful holographic light beings with luminous outlines, Ground Healers can dynamically shift their form to mirror a soul’s original family.',
    },
    {
      text: 'By building dense physical clones from the soul’s memories with no holographic shift capability.',
      rationale:
        'Healers are holographic light beings who shift form; they do not build dense physical clones.',
    },
    {
      text: 'By projecting only silent telepathic images while their visible form never changes for the soul.',
      rationale:
        'They dynamically shift their actual holographic form to mirror family, not merely silent telepathic images with a static outer form.',
    },
    {
      text: 'By escorting every soul to Starlight Pods first so family reunion replaces any form-shifting at the pools.',
      rationale:
        'Form-shifting for comfort happens at Water Domes under healer supervision; family-mirroring is not deferred solely to Starlight Pods.',
    },
  ],
  22: [
    {
      text: 'True — the Dome of Sheol originally served as a healing and recovery dome among the seven outer domes.',
      rationale:
        'All seven domes outside the Great Dome, including the Dome of Sheol which originally served as a healing and recovery dome, were linked to the central Spirit Tree.',
    },
    {
      text: 'False — Sheol was never a healing or recovery dome and had no link to the seven-dome Spirit Tree feed.',
      rationale:
        'Sheol is named as originally a healing and recovery dome among the seven outer domes fed by the Spirit Tree.',
    },
    {
      text: 'False — only Water Domes ever healed; Sheol was built solely as a Vatican fragment recycling chamber.',
      rationale:
        'Sheol’s original role is healing and recovery within the seven-dome network, not a Vatican recycling chamber designation.',
    },
    {
      text: 'False — Sheol was a Starlight Pod factory and never part of the outer dome healing network at all.',
      rationale:
        'Sheol is listed among the seven outer domes as an original healing and recovery dome, not as a Starlight Pod factory outside that network.',
    },
  ],
  23: [
    {
      text: 'Lighter, smiling, and singing as the world sings in harmony with their restored vibration.',
      rationale:
        'Souls emerge lighter, smiling, and singing for the first time in countless lifetimes as the world around them begins to sing in harmony with their restored vibration.',
    },
    {
      text: 'Confused about star lineage because vision and sound recall are deliberately withheld at pool exit.',
      rationale:
        'Emergence follows restored memory streams and harmonic resonance; souls leave lighter and joyful, not more confused about lineage.',
    },
    {
      text: 'Exhausted and forced into deep sleep with no smile, song, or lighter field after leaving the pools.',
      rationale:
        'The immediate result is lighter, smiling, and singing—not exhaustion and silent deep sleep.',
    },
    {
      text: 'Anxious to re-enter 3D matrix missions while still carrying uncleared grief, fear, guilt, and heartbreak.',
      rationale:
        'Emergence is stabilized, lighter, and harmonious after density clearing—not anxious re-entry into 3D with uncleared emotional density.',
    },
  ],
  24: [
    {
      text: 'Harmonic Resonance is vibrational alignment with Source energy that restores clarity and memory.',
      rationale:
        'Harmonic Resonance is vibrational alignment with Source energy that replaces distorted frequencies and brings back natural soul-expression, clarity, and memory.',
    },
    {
      text: 'Harmonic Resonance is only the noise made when Source energy is suppressed into denser amnesia filters permanently.',
      rationale:
        'Resonance is restorative alignment with Source after density clears; suppression and density cause amnesia, not harmonic resonance.',
    },
    {
      text: 'Harmonic Resonance and Source energy are opposing forces that cancel each other inside every Water Dome pool.',
      rationale:
        'Resonance is alignment with Source energy, not an opposing force that cancels Source inside the pools.',
    },
    {
      text: 'Source energy is merely a waste byproduct created after resonance with no true alignment relationship at all.',
      rationale:
        'Harmonic Resonance is defined as vibrational alignment with Source energy—not a process that treats Source as waste byproduct.',
    },
  ],
  25: [
    {
      text: 'The pristine power supply from Spirit Tree roots lighting up again to feed the Water Domes.',
      rationale:
        'As the Resonating Army fractures artificial 3D overlays, the roots of the Spirit Tree are lighting up again, restoring the Water Domes’ pristine power supply.',
    },
    {
      text: 'The artificial reincarnation loop managed by the Vatican archive for continued fragment recycling.',
      rationale:
        'Army action and heart-memory restoration dismantle the Vatican loop; what lights up again is Spirit Tree root power for the domes.',
    },
    {
      text: 'The dense low-frequency bands of the 3D energetic matrix as the preferred permanent soul habitat.',
      rationale:
        '3D overlays are being fractured; restoration re-lights Spirit Tree roots and dome power, not denser 3D habitat bands.',
    },
    {
      text: 'Parasitic programming of the Great Dome so suppression of waters can continue indefinitely.',
      rationale:
        'Liberation fractures overlays and restores Spirit Tree–fed dome power; it does not restore parasitic Great Dome programming.',
    },
  ],
};

const questionsMeta = [
  {
    number: 1,
    question: 'What is the primary function of the Water Domes within the restoration network?',
    hint: 'Consider which part of the human experience acts as the seat of grief and fear.',
  },
  {
    number: 2,
    question:
      'Which specific colors serve as active frequency ingredients in the architecture of a Water Dome?',
    hint: 'Think of the shimmering, pearlescent hues typically associated with pristine crystalline waters.',
  },
  {
    number: 3,
    question: "What is the role of Liquid Sound in the restoration process?",
    hint: 'Focus on how a superconductive vibrational state interacts with energetic blockages.',
  },
  {
    number: 4,
    question: 'Who are the Ground Healers responsible for supervising the transition of recovering souls?',
    hint: 'These beings are also referred to as Saferons.',
  },
  {
    number: 5,
    question: "What allows Ground Healers to neutralize a soul's lingering panic or shock instantly?",
    hint: 'Consider the effect of a radiant, gentle holographic presence on an agitated consciousness.',
  },
  {
    number: 6,
    question: 'How is Vision Recall triggered during the restoration process?',
    hint: 'Look for the role of the uncorrupted information templates held within the water.',
  },
  {
    number: 7,
    question: "What happens to a soul's frequency once Emotional Density is drawn out?",
    hint: 'Think about what naturally fills the space once a heavy filter is removed.',
  },
  {
    number: 8,
    question:
      'True or False: Members of the Resonating Army require the Water Domes to stabilize their frequencies after departing the physical plane.',
    hint: 'Consider the state of those who come to liberate versus those who are being freed.',
  },
  {
    number: 9,
    question: "What is the strategic significance of the Water Domes in relation to the Vatican Loop?",
    hint: 'Recall how restoring true memory affects a system based on amnesia and soul-recycling.',
  },
  {
    number: 10,
    question: 'Which sanctuary is specifically designed to reweave soul fractures and timeline trauma?',
    hint: 'This sanctuary is the third stage in the restorative network.',
  },
  {
    number: 11,
    question: 'What historical event caused the suppression of the waters in the Water Domes?',
    hint: 'Focus on the primary power source that was lost.',
  },
  {
    number: 12,
    question: 'What is Sound Recall in the context of memory restoration?',
    hint: 'This sensory channel involves auditory triggers from lifetimes ago.',
  },
  {
    number: 13,
    question:
      'True or False: The memory restoration process is primarily an intellectual retrieval of facts.',
    hint: "Consider whether the domes focus on the mind or the heart.",
  },
  {
    number: 14,
    question: 'What does the soul realize upon the immediate presence and touch of a Ground Healer?',
    hint: 'This phrase signifies the return to a state of tranquility and belonging.',
  },
  {
    number: 15,
    question: "In Water Dome physics, what is Emotional Density compared to?",
    hint: 'Think about how trauma functions as an energetic weight or obstruction.',
  },
  {
    number: 16,
    question: 'Which of these is the second step in the restoration process inside the pools?',
    hint: "This step involves the liquid sound matching the frequency of the soul's trauma.",
  },
  {
    number: 17,
    question: 'What strategic benefit does frequency stabilization provide as the 3D overlays dissolve?',
    hint: 'Think about the emotional state of a soul seeing their reality change rapidly.',
  },
  {
    number: 18,
    question: 'Where are the Memory Codes of Source found?',
    hint: 'This high-frequency information is contained within a liquid medium.',
  },
  {
    number: 19,
    question: 'Once memory is fully restored, what freedom is granted to the soul?',
    hint: "Consider the difference between being recycled by a system and choosing one's own destiny.",
  },
  {
    number: 20,
    question: 'What is the physical appearance of the Water Domes?',
    hint: 'Think of an invisible energy field that glows with spectacular blue and silver frequencies.',
  },
  {
    number: 21,
    question: "How do Ground Healers mirror a soul's original family?",
    hint: 'Recall their nature as gentle, non-forceful holographic light beings.',
  },
  {
    number: 22,
    question:
      'True or False: The Dome of Sheol was originally intended as a healing and recovery dome.',
    hint: 'Consider the original purpose of the seven domes before the parasitic intervention.',
  },
  {
    number: 23,
    question: 'What describes the state of a soul immediately after leaving the restoration pools?',
    hint: 'The world around them begins to sing in harmony with their restored vibration.',
  },
  {
    number: 24,
    question: "What is the relationship between Harmonic Resonance and Source energy?",
    hint: "Think of resonance as a state of being in sync with the ultimate origin.",
  },
  {
    number: 25,
    question:
      "Which system is currently being restored as the Resonating Army fractures 3D overlays?",
    hint: "Focus on what was historically suppressed but is now lighting up again.",
  },
];

// --- Build questions ---
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
      /the source notes/i.test(o.rationale) ||
      /the text states/i.test(o.rationale) ||
      /the text explicitly/i.test(o.rationale)
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

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle:
    'Test your grasp of Memory Restoration — Water Domes heart-mending, Liquid Sound density extraction, Memory Codes of Source, Ground Healers (Saferins/Saferons), vision and sound recall, and sovereign path selection after true memory returns.',
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'Memory Restoration is the vibrational recovery of cosmic identity inside Water Domes. Sit with liquid sound that draws out grief, fear, guilt, and heartbreak; Memory Codes of Source that trigger vision and sound recall; Ground Healers whose bio-fields say you are safe and home; and the Spirit Tree roots lighting again as overlays fracture. Return to the Memory Restoration deep-dive, infographic, and video transmissions as you hold the uncoerced choice to ascend or return to a fresh crystalline Known Lands cycle.',
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
    'Test your understanding of Memory Restoration — Water Domes heart-mending; Liquid Sound density extraction; Memory Codes of Source; Ground Healers (Saferins/Saferons) from the Council of 12 Suns; vision and sound recall; Vatican loop bypass; and autonomous path selection after restoration.',
};
topic.quiz = quizMeta;
fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2) + '\n', 'utf8');

const monoPath = path.join(ROOT, 'data', 'breakdown-topics.json');
const mono = JSON.parse(fs.readFileSync(monoPath, 'utf8'));
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
      t.topic_image = topicImage;
      t.title = TOPIC_TITLE;
      if (
        !t.description ||
        t.description.includes('Decoded analysis of Memory Restoration')
      ) {
        t.description =
          "Memory Restoration is the vibrational recovery of a soul's cosmic identity within Water Domes — liquid sound clears emotional density, Source memory codes trigger vision and sound recall, and Ground Healers (Saferins/Saferons) stabilize recovering souls.";
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('memory-restoration not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from liquid-sound quiz (sibling under Water Domes)
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'liquid-sound.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Memory Restoration: Water Domes heart-mending, Liquid Sound density extraction, Memory Codes of Source, Ground Healers (Saferins/Saferons), vision and sound recall, and sovereign path selection after true memory returns.';
const replacements = [
  ['Liquid Sound Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Liquid Sound: vibrational trauma extraction, Source memory codes, color-frequency tuning, Saferons, harmonic resonance, and immunization after heart restoration.',
    desc,
  ],
  ['quiz/breakdown/liquid-sound.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/liquid-sound.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=liquid-sound',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`,
  ],
  ['Liquid Sound deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Liquid Sound</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/liquid-sound.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`,
  ],
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 90));
  }
  html = html.split(a).join(b);
}

// Targeted title/path fixes only — do not blanket-replace "Liquid Sound" in body copy.
html = html
  .replace(/Interactive Living Truth Quiz on Liquid Sound[^"]*/g, desc)
  .replace(/<title>Liquid Sound Quiz/g, `<title>${TOPIC_TITLE} Quiz`)
  .replace(/Liquid Sound Quiz \|/g, `${TOPIC_TITLE} Quiz |`)
  .replace(/Liquid Sound deep-dive/g, `${TOPIC_TITLE} deep-dive`)
  .replace(/topic=liquid-sound/g, `topic=${TOPIC_ID}`)
  .replace(/liquid-sound\.webp/g, 'memory-restoration.webp')
  .replace(/liquid-sound\.json/g, 'memory-restoration.json')
  .replace(/liquid-sound\.html/g, 'memory-restoration.html');

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/liquid-sound.html', priority: '0.75', changefreq: 'monthly' },";
  if (!sm.includes(anchor)) {
    const alt =
      "  { path: '/quiz/breakdown/emotional-mending.html', priority: '0.75', changefreq: 'monthly' },";
    if (!sm.includes(alt)) {
      throw new Error('Could not find sitemap anchor to insert quiz entry');
    }
    sm = sm.replace(alt, `${alt}\n${entry}`);
  } else {
    sm = sm.replace(anchor, `${anchor}\n${entry}`);
  }
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('Correct letter mix:', letterCounts);
console.log(
  'PASS: audited 25/25 against data/breakdown-topics/memory-restoration.json'
);
