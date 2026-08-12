/**
 * Installs Mental Realignment quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/realignment-quiz.json
 * Title forced to "Mental Realignment". All 25 audited against mental-realignment report only.
 *
 * Run: node scripts/install-mental-realignment-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/mental-realignment.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'mental-realignment';
const TOPIC_TITLE = 'Mental Realignment';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/realignment-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/mental-realignment.webp';

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

/** Support phrases grounded only in mental-realignment.json report. */
const supportPhrases = {
  1: ['living', 'crystal temples', 'cathedrals', 'abbeys', '3d'],
  2: ['lungs of light', 'original creation', 'pulsed light', 'breathing'],
  3: ['crystal slabs', 'harmonic coding', 'harmonic frequencies', 'reactivat'],
  4: ['conscious balls of electricity', 'hover', 'crystal slabs'],
  5: ['clear mind control', 'parasitic overlays', 'mend the mind', 'mental phase'],
  6: ['beacons', 'planetary crystals', 'restored resonance', 'parasitic overlay'],
  7: ['rainbow fractals', 'cognitive distortion', 'frequency ingredients', 'distorted bands'],
  8: ['medical science', 'sound and light frequencies', 'light body grid'],
  9: ['parasitic overlays', 'electromagnetic', 'hijack human perception', 'holographic'],
  10: ['cognitive denial', 'suppressed memories', 'multi-dimensional'],
  11: ['stone abbeys', 'churches', 'masonry', 'dampen'],
  12: ['astral travel', 'sovereign sleep', 'nightmares', 'low-frequency net'],
  13: ['photonic prism', 'diagnostic and corrective laser', 'crystal prisms'],
  14: ['anchoring point', 'parasitic whispers', 'immune'],
  15: ['hard drives', 'interstellar light web', 'download portals', 'cosmic history'],
  16: ['water domes', 'mend the heart', 'crystal halls', 'mend the mind'],
  17: ['psychological fatigue', 'anxiety', 'low-frequency grids', 'parasitic programming'],
  18: ['dead concrete', 'light-based architecture', 'organic', 'thought and frequency'],
  19: ['vibrant quartz', 'crystalline conductors', 'living crystal walls'],
  20: ['breathing motion', 'lungs of light', 'rhythmic emission'],
  21: ['mending the mind', 'light body grid', 'mental realignment'],
  22: ['immune', 'media-driven fear', 'fear loops', 'parasitic control'],
  23: ['star pods', 'timeline fractures', 'karmic wounds', 'light frequency cocoons'],
  24: ['voice to skull', 'mind control frameworks', 'cognitive confusion'],
  25: ['cosmic lineage', 'past co-creations', 'true home', 'historical record'],
};

function cleanText(s) {
  let t = String(s || '');
  t = t.replace(/\$(\d+)\^\{(st|nd|rd|th)\}\$/gi, '$1$2');
  t = t.replace(/\$(\d+)\^(st|nd|rd|th)\$/gi, '$1$2');
  t = t.replace(/\$3\\text\{D\}\$/g, '3D');
  t = t.replace(/\$3\\mathrm\{D\}\$/g, '3D');
  t = t.replace(/\$3D\$/g, '3D');
  t = t.replace(/\$4D\$/g, '4D');
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
    [/^The source states\s+/i, ''],
    [/^The source material (clarifies|identifies|states) that\s+/i, ''],
    [/^The source material identifies\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The material states that\s+/i, ''],
    [/\bthe text describes them as\b/gi, 'they are'],
    [/\bthe text describes\b/gi, ''],
    [/\bthe text states\b/gi, ''],
    [/\bthe text emphasizes\b/gi, ''],
    [/\bthe source material clarifies that\b/gi, ''],
    [/\bthe source identifies\b/gi, ''],
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
 * All four options at similar depth from the mental-realignment report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'Advanced living crystal temples disguised by 3D perception as stone cathedrals, churches, and abbeys.',
      rationale:
        'Modern stone cathedrals and abbeys are living, highly advanced crystal temples hidden in plain sight, overlaid and masked by 3D human perception as cathedrals, churches, and abbeys.',
    },
    {
      text: 'Decommissioned industrial power plants converted into religious monuments without any multi-dimensional healing role.',
      rationale:
        'These sites are multi-dimensional Crystal Halls for Mental Realignment, not decommissioned industrial plants rebranded as monuments.',
    },
    {
      text: 'Monuments built only by ancient humans to honor religious deities with no living crystal architecture underneath.',
      rationale:
        'The standard historical narrative hides the revealed reality: living crystal temples overlaid as stone religious architecture for mental healing.',
    },
    {
      text: 'Purely parasitic power anchors whose core crystal interiors were never restorative temples of mind mending.',
      rationale:
        'Parasites built stone overlays over the sites, but the core structures are restorative Crystal Halls, not purely parasitic anchors.',
    },
  ],
  2: [
    {
      text: 'Lungs of Light — breathing crystalline columns that emit pulsed light to realign the soul to its original creation state.',
      rationale:
        'Lungs of Light are breathing crystalline columns within the Crystal Halls that emit pulsed light to systematically align a soul back to its original creation state.',
    },
    {
      text: 'Rainbow Fractals — iridescent wall patterns that only decorate the halls without any pulsed creation-state alignment role.',
      rationale:
        'Rainbow Fractals dissolve cognitive distortion as frequency ingredients; systematic creation-state alignment is the work of the Lungs of Light columns.',
    },
    {
      text: 'Crystal Slabs — platforms that hum harmonics for coding reactivation but do not emit rhythmic pulsed light from columns.',
      rationale:
        'Crystal Slabs perform resonance coupling for harmonic coding; the breathing pulsed-light columns are specifically the Lungs of Light.',
    },
    {
      text: 'Photonic Prisms — diagnostic light tools that only map damage without breathing-column alignment of the creation template.',
      rationale:
        'Photonic prisms focus restorative light as diagnostic and corrective lasers; rhythmic pulsed alignment to original creation is the Lungs of Light.',
    },
  ],
  3: [
    {
      text: 'They hum with harmonic frequencies that reactivate dormant or damaged harmonic coding in visiting souls.',
      rationale:
        'Crystal Slabs are crystalline platforms that hum with specific harmonic frequencies to reactivate damaged or distorted harmonic coding as souls hover over them.',
    },
    {
      text: 'They serve only as physical beds for dense human bodies during ordinary nighttime sleep in the 3D world.',
      rationale:
        'Souls enter as conscious balls of electricity and hover over the slabs; the process is energetic realignment, not physical-body sleep beds.',
    },
    {
      text: 'They function solely as visitor name-archives that store records without reactivating any harmonic coding at all.',
      rationale:
        'While crystals also serve hard-drive roles elsewhere in the halls, the slabs’ specific function is frequency reactivation of the soul’s coding.',
    },
    {
      text: 'They alone shield the entire temple from 3D interference without any harmonic coding or resonance coupling role.',
      rationale:
        'The slabs’ named function is resonance coupling and coding reactivation; multi-dimensional hall nature is not reduced to slab-only shielding.',
    },
  ],
  4: [
    {
      text: 'As a conscious ball of electricity hovering over crystal slabs for frequency-based Mental Realignment.',
      rationale:
        'Souls enter the Crystal Halls and hover as conscious balls of electricity over large crystal slabs that hum with restorative harmonic frequencies.',
    },
    {
      text: 'As a dense physical human body seated in meditation while remaining fully locked into ordinary 3D density.',
      rationale:
        'Realignment occurs with the soul hovering as a conscious ball of electricity, not as a seated physical body locked in 3D density.',
    },
    {
      text: 'As a stream of digital data uploaded from earth nodes with no living conscious presence over the slabs.',
      rationale:
        'The soul appears as a living conscious ball of electricity, not as uploaded digital data transferred from earth nodes.',
    },
    {
      text: 'As a holographic projection generated by the 3D matrix rather than the soul’s own conscious energetic form.',
      rationale:
        'The soul is the actual conscious essence hovering for healing, not a holographic projection produced by the matrix it is leaving.',
    },
  ],
  5: [
    {
      text: 'Clearing mind control and dissolving parasitic overlays while mending the mind in Crystal Halls.',
      rationale:
        'Crystal Halls execute the mental phase of the Tri-Sanctuary cycle, performing Mental Realignment to mend the mind, clear mind control, and dissolve parasitic overlays.',
    },
    {
      text: 'Reweaving timeline fractures and healing deep karmic wounds across timelines inside light cocoons only.',
      rationale:
        'Timeline fractures and karmic wounds are the Star Pods’ concluding soul phase, not the Crystal Halls mental phase.',
    },
    {
      text: 'Mending the heart and drawing out emotional density, grief, and fear with sound-vibrating water alone.',
      rationale:
        'Heart mending and emotional density extraction belong to Water Domes, which initiate the cycle before the mental Crystal Halls phase.',
    },
    {
      text: 'Establishing political control over earth leylines through councils that replace individual soul healing entirely.',
      rationale:
        'The Tri-Sanctuary cycle heals heart, mind, and soul of individuals; the mental phase is not planetary political control of leylines.',
    },
  ],
  6: [
    {
      text: 'They act as high-frequency beacons whose restored resonance automatically activates surrounding planetary crystals.',
      rationale:
        'Realigned souls function as highly active beacons of frequency; their restored resonance automatically activates surrounding planetary crystals, fracturing the parasitic overlay.',
    },
    {
      text: 'They erase all memory of 3D lives so they cannot re-contaminate planetary crystals after leaving the halls.',
      rationale:
        'Realignment restores memory streams and historical record; it does not erase 3D life memory to protect planetary crystals.',
    },
    {
      text: 'They remain permanently inside the temples as fixed guardians and never return as active frequency beacons outside.',
      rationale:
        'Strategic impact comes from realigned souls acting as beacons that activate surrounding planetary crystals, not permanent temple confinement.',
    },
    {
      text: 'They become invisible to every 3D inhabitant without activating any surrounding planetary crystal network at all.',
      rationale:
        'The stated planetary effect is beacon-like activation of surrounding crystals and overlay dismantling, not automatic invisibility without crystal activation.',
    },
  ],
  7: [
    {
      text: 'They function as frequency ingredients that dissolve cognitive distortion and pull awareness out of distorted bands.',
      rationale:
        'Rainbow Fractals are iridescent light patterns from living crystal walls that dissolve cognitive distortion and pull the soul’s awareness out of distorted bands as frequency ingredients.',
    },
    {
      text: 'They provide only artificial illumination for 3D tourists with no medicinal frequency effect on cognitive distortion.',
      rationale:
        'The light is functional frequency medicine that dissolves cognitive distortion, not mere decorative illumination for visitors.',
    },
    {
      text: 'They operate solely as a parasite security fence with no role in bathing souls for cognitive clarity.',
      rationale:
        'Primary function is internal healing through iridescent light bathing that clears distortion, not an external security fence system.',
    },
    {
      text: 'They encode brand-new false memories into the light body instead of dissolving existing cognitive distortion bands.',
      rationale:
        'Fractals dissolve distortion so memory streams can return; they do not encode new false memories into the light body grid.',
    },
  ],
  8: [
    {
      text: 'False — true healing needs light-body realignment with precise sound and light frequencies, not medical science alone.',
      rationale:
        'True healing cannot be accomplished through human medical science; it requires energetic realignment of the light body grid using precise sound and light frequencies.',
    },
    {
      text: 'True — modern medical science alone is the most effective path to fully mend the multi-dimensional light body grid without crystal halls.',
      rationale:
        'Medical science cannot accomplish true light-body realignment; sound and light frequency work in Crystal Halls is required.',
    },
    {
      text: 'True — pharmaceutical protocols alone restore harmonic coding without any crystal slab, photonic prism, or frequency work.',
      rationale:
        'Harmonic coding reactivation uses humming crystal slabs and photonic prism purification, not pharmaceutical medical protocols alone.',
    },
    {
      text: 'True — surgery on the physical brain fully replaces Mental Realignment of the light body grid inside Crystal Halls entirely.',
      rationale:
        'Mental Realignment mends mind and light body grid through crystal frequencies, not physical brain surgery as a substitute.',
    },
  ],
  9: [
    {
      text: 'Artificial low-frequency electromagnetic fields and holographic projections that hijack perception into a heavy 3D matrix.',
      rationale:
        'Parasitic Overlays are artificial low-frequency electromagnetic fields and holographic projections overlaid by parasites to hijack human perception and lock souls into a heavy 3D matrix.',
    },
    {
      text: 'Natural weather systems altered only by industrial pollution with no electromagnetic fields or holographic mind-control role at all.',
      rationale:
        'Overlays are artificial energetic mind-control structures, not natural weather patterns altered by pollution.',
    },
    {
      text: 'Physical dust layers on ancient crystal surfaces with no frequency-based hijacking of human perception or matrix lock-in.',
      rationale:
        'The overlay is frequency-based electromagnetic and holographic manipulation, not physical grime on crystal surfaces.',
    },
    {
      text: 'Biological viruses that infect only the nervous system without electromagnetic fields, holographic projections, or mind-control grids.',
      rationale:
        'The definition centers on artificial electromagnetic fields and holographic projections, not biological viruses as the overlay mechanism.',
    },
  ],
  10: [
    {
      text: 'A massive influx of suppressed memories and restored connection to the wider multi-dimensional universe.',
      rationale:
        'Once blockages dissolve, cognitive denial cracks, triggering a massive influx of suppressed memories and restoring connection to the wider multi-dimensional universe.',
    },
    {
      text: 'Total permanent erasure of all 3D trauma memory so the soul cannot recall what the matrix imposed.',
      rationale:
        'Realignment restores memory streams and unbroken timelines, including understanding of what was overcome, rather than erasing 3D history.',
    },
    {
      text: 'Permanent disconnection of the light body grid from earth nodes so planetary crystals can never be activated.',
      rationale:
        'Realigned souls better activate surrounding planetary crystals; cognitive cracking restores memory, not node disconnection.',
    },
    {
      text: 'Immediate teleportation of the physical body to another planet with no memory-stream restoration phase.',
      rationale:
        'The cracking of cognitive denial brings suppressed memories and multi-dimensional reconnection, not instant planetary teleportation.',
    },
  ],
  11: [
    {
      text: 'By building physical stone abbeys and churches with heavy masonry slabs to dampen the natural frequencies.',
      rationale:
        'Parasites suppressed active earth nodes by building physical stone abbeys and churches over them, using heavy masonry slabs to dampen natural frequencies.',
    },
    {
      text: 'By poisoning surrounding soil alone so node frequencies would collapse without any masonry overlay architecture.',
      rationale:
        'Suppression used stone abbey and church masonry overlays to dampen frequencies, not soil poisoning as the named method.',
    },
    {
      text: 'By draining leylines into underground batteries instead of masking nodes with cathedral and abbey masonry.',
      rationale:
        'The method is architectural masking and dampening with heavy masonry, not drainage of lines into underground batteries.',
    },
    {
      text: 'By permanently relocating every leyline into dense urban centers without building over the original node sites.',
      rationale:
        'Suppression was localized by building stone structures over the node points, not wholesale relocation of leylines into cities.',
    },
  ],
  12: [
    {
      text: 'Restoration of safe astral travel during sleep free of looping nightmares and low-frequency net blocks.',
      rationale:
        'Reinstatement of Sovereign Sleep Dynamics lets realigned souls safely astral travel during sleep, no longer trapped in looping nightmares or blocked by low-frequency net structures.',
    },
    {
      text: 'Complete elimination of all need for sleep so the soul never leaves ordinary waking 3D consciousness again.',
      rationale:
        'Sleep dynamics are restored as sovereign astral travel capacity, not removed by eliminating sleep entirely.',
    },
    {
      text: 'Permanent nighttime grounding that traps the soul inside the dense body with no astral travel allowed at all.',
      rationale:
        'Realignment restores safe astral travel during sleep; it is the opposite of permanent dense-body trapping at night.',
    },
    {
      text: "Authority to hijack and rewrite other people's dreams as a tool of residual parasitic whisper control forever.",
      rationale:
        "The benefit is personal sovereign sleep safety and astral freedom, not control or manipulation of others' dreams.",
    },
  ],
  13: [
    {
      text: 'Photonic Prism Purification — restorative light through crystal prisms acting as a diagnostic and corrective laser.',
      rationale:
        'Restorative light focused through advanced crystal prisms operates as a diagnostic and corrective laser, dissolving energetic distortion, mental overlays, and mind control damage.',
    },
    {
      text: 'Living Crystal Walls alone — fractal light bathing without any focused prism diagnostic laser into the energy field.',
      rationale:
        'Walls emit rainbow fractals for iridescent light bathing; the diagnostic and corrective laser function is photonic prism purification.',
    },
    {
      text: 'Lungs of Light alone — rhythmic breathing pulses without prism-focused diagnostic correction of distortion layers at depth.',
      rationale:
        'Lungs of Light pulse for creation-state alignment; precision dissolving of distortion as a corrective laser is photonic prisms.',
    },
    {
      text: 'Crystal Slabs alone — harmonic hums for coding without directing prism light as a corrective diagnostic laser beam.',
      rationale:
        'Slabs hum for resonance coupling and coding reactivation; focused prism light as diagnostic laser is a distinct step.',
    },
  ],
  14: [
    {
      text: 'They lose their anchoring point and dissolve, leaving immunity to low-frequency mind-control whispers.',
      rationale:
        'Once the mind is realigned, parasitic whispers lose their anchoring point, making the individual completely immune to low-frequency implants, dream manipulation, or media-driven fear loops.',
    },
    {
      text: 'They convert into permanent helpful guides that the soul must keep as primary navigation for daily choices forever.',
      rationale:
        'Parasitic programming and whispers are cleared and lose their anchor; they are not converted into trusted guidance systems.',
    },
    {
      text: 'They grow loud enough for physical ears while the light body grid remains fully open to mind-control frameworks ongoing.',
      rationale:
        'Realignment silences low-frequency parasite whispers and breaks mind-control frameworks; it does not amplify them to physical hearing.',
    },
    {
      text: 'They are simply reassigned to nearby unaligned souls without any loss of anchoring in the realigned mind at all.',
      rationale:
        'Whispers lose their anchoring point in the realigned individual; neutralization is personal immunization, not mere reassignment.',
    },
  ],
  15: [
    {
      text: 'True — hall crystals act as physical and etheric hard drives on the interstellar light web for cosmic history.',
      rationale:
        'Crystals function as physical and etheric hard drives connected to the interstellar light web and unbroken timeline of solar families, serving as download portals for cosmic history.',
    },
    {
      text: 'False — the halls never store cosmic history and have no hard-drive, solar-family, or interstellar light-web connection at all.',
      rationale:
        'The halls are explicitly physical and etheric hard drives linked to the interstellar light web as cosmic-history download portals.',
    },
    {
      text: 'False — crystals only decorate interiors and never connect to solar-family unbroken timelines or cosmic-history download portals.',
      rationale:
        'Crystals connect to the unbroken timeline maintained by solar families and serve as download portals, not mere decoration.',
    },
    {
      text: 'False — only Water Domes hold hard-drive networks while Crystal Halls remain empty of interstellar memory storage entirely.',
      rationale:
        'Interstellar hard-drive networks are described for crystals within the Crystal Halls during Mental Realignment context, not as Water Dome-only storage.',
    },
  ],
  16: [
    {
      text: 'Water Domes mend the heart first; Crystal Halls then perform the mental phase of Mental Realignment.',
      rationale:
        'The Tri-Sanctuary cycle begins with Water Domes mending the heart with sound-vibrating water, then Crystal Halls execute the mental phase of Mental Realignment.',
    },
    {
      text: 'Crystal Halls must power Water Domes energetically before any heart mending can begin in the cycle.',
      rationale:
        'Both sanctuaries are sequential healing phases for the soul; Crystal Halls do not function as power plants for Water Domes.',
    },
    {
      text: 'Crystal Halls must be completed first so the mind can prepare for later heart work in the Water Domes.',
      rationale:
        'The cycle initiates with Water Domes (heart) and then moves to Crystal Halls (mind), not the reverse order.',
    },
    {
      text: 'Water Domes are merely the dense physical shell of the same etheric Crystal Halls with identical functions.',
      rationale:
        'Water Domes and Crystal Halls are distinct sanctuaries with different purposes—heart versus mind—in a three-fold cycle.',
    },
  ],
  17: [
    {
      text: 'Artificial low-frequency grids and parasitic programming designed to disrupt the human mind.',
      rationale:
        'Severe psychological fatigue, anxiety, and confusion in the 3D world are not natural states but the direct result of artificial low-frequency grids and parasitic programming.',
    },
    {
      text: 'An overwhelming excess of pure cosmic light flooding the planet with no parasitic grid involvement.',
      rationale:
        'Cosmic light and realignment are restorative; fatigue and anxiety are blamed on artificial low-frequency grids, not excess cosmic light.',
    },
    {
      text: 'The natural aging process of the human brain as an unavoidable biological decline with no artificial cause.',
      rationale:
        'These states are artificial results of low-frequency grids and parasitic programming, not natural brain aging.',
    },
    {
      text: 'Only poor diet and lack of exercise with no low-frequency grid or parasitic programming root at all.',
      rationale:
        'The root cause named for psychological fatigue and confusion is artificial low-frequency grids and parasitic programming, not lifestyle alone.',
    },
  ],
  18: [
    {
      text: 'Perception shifts from dead concrete and metal solidity toward organic light-based architecture responsive to thought and frequency.',
      rationale:
        'Realignment shifts perception away from artificial perception-based solidity of dead concrete and metal, preparing interaction with organic light-based architecture that responds to thought and frequency.',
    },
    {
      text: 'Training only in insulating modern buildings against electromagnetic fields without any light-architecture perception shift.',
      rationale:
        'The shift is toward organic light-based architecture, not techniques for insulating conventional buildings against EMF.',
    },
    {
      text: 'Learning to construct more stone churches and cathedrals as the highest form of co-creative architecture.',
      rationale:
        'Realignment reveals cathedrals as overlays on living crystal temples and prepares for light-based architecture, not more stone church building.',
    },
    {
      text: 'Gaining X-ray vision through solid walls into a 4D realm without changing how architecture is perceived as dead or living.',
      rationale:
        'The stated shift is recognizing dead concrete versus organic light-responsive architecture, not generic X-ray vision through walls.',
    },
  ],
  19: [
    {
      text: 'Vibrant quartz and other natural crystalline conductors that emit glowing rainbow fractals when light strikes them.',
      rationale:
        'Living crystal walls are composed of vibrant quartz and other natural crystalline conductors that emit glowing rainbow fractals as light strikes at varying angles.',
    },
    {
      text: 'Polished wood from interstellar forests with no quartz, crystalline conductors, or rainbow-fractal light emission at all.',
      rationale:
        'Walls are crystalline quartz conductors emitting fractals, not polished interstellar wood architecture.',
    },
    {
      text: 'Reinforced concrete and limestone from earth quarries that form the true living temple rather than a mere 3D mask layer.',
      rationale:
        'Concrete and limestone characterize the 3D masonry mask; the true walls are living quartz and crystalline conductors.',
    },
    {
      text: 'Metallic alloys designed only for signal reflection with no natural crystalline conductor, quartz, or fractal light role.',
      rationale:
        'Composition is vibrant quartz and natural crystalline conductors for frequency emission, not artificial metal alloys.',
    },
  ],
  20: [
    {
      text: 'A systematic breathing motion — rhythmic emission of pure light from columns acting as lungs of light.',
      rationale:
        'Massive columns acting as lungs of light pulse with a systematic breathing motion; this rhythmic emission of pure light aligns the soul to original creation state.',
    },
    {
      text: 'Incoherent radiation scattered without rhythm, structure, or any lungs-of-light alignment purpose.',
      rationale:
        'The emission is systematic, rhythmic, and restorative through breathing-column motion, not incoherent radiation.',
    },
    {
      text: 'Static unchanging illumination that never pulses and never acts as a breathing alignment of the soul field.',
      rationale:
        'Light from the columns is dynamic and pulsed in a breathing motion, not static unchanging illumination.',
    },
    {
      text: 'Chaotic flickering distortion meant to scramble awareness rather than align the energetic structure.',
      rationale:
        'The motion is systematic and purposeful for alignment, opposite of chaotic flickering distortion.',
    },
  ],
  21: [
    {
      text: 'The process of mending the mind and restoring the light body grid while clearing parasitic mind-control distortions.',
      rationale:
        'Mental Realignment is the advanced energetic process of mending the mind and light body grid, clearing parasitic overlays, and dissolving mind-control distortions using harmonic frequencies.',
    },
    {
      text: 'Physical reconstruction of brain neural pathways alone without any light body grid, harmonic coding, or frequency work.',
      rationale:
        'It operates on mind and light body grid via harmonic frequencies in Crystal Halls, not physical neural reconstruction alone.',
    },
    {
      text: 'A frequency immersion course for learning new 3D languages with no healing of mind, light body grid, or memory streams.',
      rationale:
        'Purpose is healing, coding reactivation, and memory restoration, not acquiring new 3D language skills.',
    },
    {
      text: 'A talk-therapy session that processes trauma only through conversation without crystal frequencies, slabs, or prisms.',
      rationale:
        'This is an energetic frequency process on crystal slabs with prisms and lungs of light, not traditional conversational therapy.',
    },
  ],
  22: [
    {
      text: 'False — realignment immunizes against parasitic control so media-driven fear loops lose their anchoring point.',
      rationale:
        'Once the mind is realigned, parasitic whispers lose their anchoring point, making the individual completely immune to low-frequency implants, dream manipulation, or media-driven fear loops.',
    },
    {
      text: 'True — a realigned mind remains fully open to media-driven fear loops and low-frequency implants without immunity.',
      rationale:
        'Strategic immunization against parasitic control is a primary result; realigned minds are not left open to fear loops.',
    },
    {
      text: 'True — immunity covers only physical implants while media fear loops continue to dominate the realigned mind.',
      rationale:
        'Immunity explicitly includes media-driven fear loops as well as implants and dream manipulation after realignment.',
    },
    {
      text: 'True — realignment strengthens fear-loop susceptibility so the soul can practice resisting whispers indefinitely.',
      rationale:
        'Whispers lose their anchoring point; the outcome is immunity, not strengthened susceptibility for endless practice.',
    },
  ],
  23: [
    {
      text: 'Star Pods — concluding the cycle by mending the soul with light frequency cocoons for timeline and karmic wounds.',
      rationale:
        'Star Pods conclude the Tri-Sanctuary cycle by mending the soul, using light frequency cocoons to reweave timeline fractures and heal deep karmic wounds across timelines.',
    },
    {
      text: 'Leyline Stations — a fourth sanctuary tier outside the named three-fold Water Domes, Crystal Halls, and Star Pods cycle.',
      rationale:
        'The three-fold cycle is Water Domes, Crystal Halls, and Star Pods; leyline stations are not the named final sanctuary for karmic timeline work.',
    },
    {
      text: 'Crystal Halls alone — mental realignment that also fully reweaves every timeline fracture without Star Pod cocoons.',
      rationale:
        'Crystal Halls handle the mental phase; timeline fractures and karmic wounds across timelines are Star Pods’ concluding work.',
    },
    {
      text: 'Water Domes alone — heart mending that replaces Star Pod light cocoons for multi-timeline karmic reweaving.',
      rationale:
        'Water Domes mend the heart and emotional density; Star Pods mend the soul across timelines with light frequency cocoons.',
    },
  ],
  24: [
    {
      text: 'Low-frequency mind control frameworks such as voice to skull systems that manipulate dreams and memories.',
      rationale:
        'Realignment breaks down low-frequency mind control frameworks such as voice to skull systems and low-frequency grids designed to manipulate dreams and memories, lifting heavy cognitive confusion.',
    },
    {
      text: 'Information overload from the modern internet alone with no voice to skull or low-frequency mind-control frameworks.',
      rationale:
        'Cognitive confusion is tied to artificial mind-control frameworks and parasite whispers, not mere internet data volume.',
    },
    {
      text: 'A simple lack of childhood spiritual education without any artificial energetic grids or whisper systems involved.',
      rationale:
        'Artificial low-frequency grids, voice to skull frameworks, and parasitic programming are the named drivers of confusion.',
    },
    {
      text: 'Natural complexity of multi-dimensional travel that every healthy soul must suffer without parasitic interference.',
      rationale:
        'Confusion is artificial and parasitic; after whispers dissolve it is replaced by safety, tranquility, and relief—not natural multi-dimensional strain.',
    },
  ],
  25: [
    {
      text: "The soul's memory of its cosmic lineage, past co-creations, and true home through flowing historical record streams.",
      rationale:
        'Retrieval of Unbroken Timelines reconnects the soul to its historical record so it can fully remember cosmic lineage, past co-creations, and true home.',
    },
    {
      text: "Unlimited access to other souls' private memory banks as the primary purpose of unbroken timeline retrieval work.",
      rationale:
        "The process restores the individual soul's own historical record and lineage, not open access to others' private memories.",
    },
    {
      text: 'A predictive catalog of every future matrix event with no restoration of cosmic lineage, past co-creations, or home.',
      rationale:
        'Focus is historical memory, cosmic lineage, and true home—not fortune-telling of all future matrix events.',
    },
    {
      text: 'A physical map of current 3D political borders that replaces cosmic lineage memory entirely after realignment ends.',
      rationale:
        'Timelines restored are cosmic and historical lineage streams, not contemporary 3D political border maps.',
    },
  ],
};

const questionsMeta = [
  {
    number: 1,
    question:
      'What is the true nature of modern stone cathedrals and abbeys in the revelations of Mental Realignment?',
    hint: 'Consider that historical architecture serves a higher energetic purpose than history books suggest.',
  },
  {
    number: 2,
    question:
      'Which component of the Crystal Halls systematically aligns a soul back to its original creation state through pulsed light?',
    hint: 'Focus on the structures described as breathing columns within the hall.',
  },
  {
    number: 3,
    question: 'What is the specific function of the Crystal Slabs located within the Crystal Halls?',
    hint: 'Think about how harmonic frequencies are reintroduced to a distorted energy field.',
  },
  {
    number: 4,
    question: 'In what form does a soul enter the Crystal Halls to undergo the realignment process?',
    hint: "The soul's appearance reflects its nature as a pure energy source.",
  },
  {
    number: 5,
    question: 'What is the primary objective of the mental phase of the Tri-Sanctuary Healing Cycle?',
    hint: 'Recall which part of the three-fold process addresses cognitive confusion and artificial whispers.',
  },
  {
    number: 6,
    question: 'How do realigned souls impact the planetary environment after Mental Realignment?',
    hint: 'Consider the ripple effect a high-frequency individual has on surrounding crystals.',
  },
  {
    number: 7,
    question: 'What role do Rainbow Fractals play in the healing process within the crystal temples?',
    hint: 'The light emitted from the walls has a specific medicinal effect on the mind.',
  },
  {
    number: 8,
    question:
      'True or False: Modern human medical science is the most effective way to mend the light body grid.',
    hint: 'Consider whether physical medical tools can repair non-physical, frequency-based blueprints.',
  },
  {
    number: 9,
    question: "What are Parasitic Overlays in the context of Mental Realignment?",
    hint: 'Focus on the artificial energetic barriers that trap the mind in a heavy 3D matrix.',
  },
  {
    number: 10,
    question: "What immediate change occurs once a soul's cognitive denial is cracked during realignment?",
    hint: "Think about the contents of the unbroken timelines that return to the soul.",
  },
  {
    number: 11,
    question: 'How did parasites attempt to suppress the active earth nodes located at Crystal Hall sites?',
    hint: "Look for the physical method used to mask the temples in plain sight.",
  },
  {
    number: 12,
    question: 'What is the strategic benefit of realignment regarding an individual’s sleep?',
    hint: "Recall Sovereign Sleep Dynamics and what it entails for the soul.",
  },
  {
    number: 13,
    question:
      "Which crystalline technology acts as a diagnostic and corrective laser to dissolve energetic distortion?",
    hint: 'This tool uses focused light specifically to penetrate and purify the energy field.',
  },
  {
    number: 14,
    question: 'What happens to parasite whispers once Mental Realignment is complete?',
    hint: 'Consider the result of breaking the framework that allows these whispers to exist.',
  },
  {
    number: 15,
    question:
      'True or False: The Crystal Halls function as physical and etheric hard drives connected to an interstellar light web.',
    hint: 'Think about how these temples preserve cosmic history across the universe.',
  },
  {
    number: 16,
    question: "What is the relationship between Water Domes and Crystal Halls in the healing cycle?",
    hint: 'Identify the correct order of the three-fold healing process.',
  },
  {
    number: 17,
    question:
      'What causes the severe psychological fatigue and anxiety often felt in the 3D world?',
    hint: 'Focus on the external energetic factors that disrupt mental well-being.',
  },
  {
    number: 18,
    question:
      'What shift in perception occurs as a result of Mental Realignment regarding architecture?',
    hint: "Consider the transition from artificial dead materials to living light-based structures.",
  },
  {
    number: 19,
    question: 'What characterizes the composition of the living crystal walls within the temples?',
    hint: 'Think about the specific minerals known for their conductive and vibrational properties.',
  },
  {
    number: 20,
    question: "Which phrase describes the rhythmic emission of pure light from the temple's columns?",
    hint: 'Look for a biological analogy used to describe the movement of the light columns.',
  },
  {
    number: 21,
    question: "What is Mental Realignment in the context of the light body grid?",
    hint: "Consider the deeper energetic meaning of mending beyond just the physical brain.",
  },
  {
    number: 22,
    question:
      'True or False: Once a mind is realigned, it remains susceptible to media-driven fear loops.',
    hint: "Think about the strategic consequence of no longer having an anchoring point for parasitic whispers.",
  },
  {
    number: 23,
    question: 'Which sanctuary is responsible for mending deeper karmic wounds and timeline fractures?',
    hint: 'Identify the final phase of the three-fold restoration process.',
  },
  {
    number: 24,
    question: 'What is the primary cause of the cognitive confusion that lifts after Mental Realignment?',
    hint: 'Look for the specific artificial systems designed to manipulate dreams and memories.',
  },
  {
    number: 25,
    question: "What is restored through the Retrieval of Unbroken Timelines?",
    hint: "Consider what is lost when a soul's memory stream is broken by parasitic programming.",
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
      /the source states/i.test(o.text)
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
    'Test your grasp of Mental Realignment — Crystal Halls mind mending, harmonic crystal slabs, Lungs of Light, rainbow fractals, photonic prisms, light body grid restoration, and the Water Domes / Crystal Halls / Star Pods cycle.',
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'Mental Realignment is the mind-mending path inside Crystal Halls. Sit with harmonic slabs that reactivate coding, photonic prisms that clear distortion, Lungs of Light that breathe creation templates online, and rainbow fractals that dissolve cognitive fog. Return to the Mental Realignment deep-dive, infographic, and video transmissions as you hold sovereign sleep, memory streams, and beacon-level resonance that activates planetary crystals.',
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
    'Test your understanding of Mental Realignment — Crystal Halls mind mending; harmonic slabs and light body grid; Lungs of Light and rainbow fractals; photonic prism purification; voice-to-skull clearing; Water Domes / Crystal Halls / Star Pods order; and sovereign immunity after realignment.',
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
        t.description.includes('Decoded analysis of Mental Realignment')
      ) {
        t.description =
          'Mental Realignment is the mind-mending process within Crystal Halls — harmonic crystal slabs restore the light body grid, rainbow fractals and lungs of light dissolve parasitic overlays and mind control, and memory streams reconnect souls to sovereign clarity.';
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('mental-realignment not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from crystal-halls (parent under Healing Sanctuaries; has critical paint + quiz chrome)
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'crystal-halls.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Mental Realignment: Crystal Halls mind mending, harmonic crystal slabs, Lungs of Light, rainbow fractals, photonic prisms, light body grid restoration, and the Water Domes / Crystal Halls / Star Pods cycle.';

const replacements = [
  ['Crystal Halls Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Crystal Halls: mind-mending living crystal temples under cathedral overlays, humming harmonic slabs, rainbow fractals, Lungs of Light, Saferons, Giants, and the Water Domes / Crystal Halls / Star Pods triad.',
    desc,
  ],
  ['quiz/breakdown/crystal-halls.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/crystal-halls.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=crystal-halls',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`,
  ],
  ['Crystal Halls deep-dive', `${TOPIC_TITLE} deep-dive`],
  [
    'data/quizzes/breakdown/crystal-halls.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`,
  ],
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 90));
  }
  html = html.split(a).join(b);
}

html = html
  .replace(/Interactive Living Truth Quiz on Crystal Halls[^"]*/g, desc)
  .replace(/<title>Crystal Halls Quiz/g, `<title>${TOPIC_TITLE} Quiz`)
  .replace(/Crystal Halls Quiz \|/g, `${TOPIC_TITLE} Quiz |`)
  .replace(/Crystal Halls deep-dive/g, `${TOPIC_TITLE} deep-dive`)
  .replace(/topic=crystal-halls/g, `topic=${TOPIC_ID}`)
  .replace(/crystal-halls\.webp/g, 'mental-realignment.webp')
  .replace(/crystal-halls\.json/g, 'mental-realignment.json')
  .replace(/crystal-halls\.html/g, 'mental-realignment.html');

// Fix any leftover title-only display that still says Crystal Halls as the quiz brand
html = html.replace(
  />(Crystal Halls)</g,
  (match, _g, offset, full) => {
    // Only replace standalone brand/title chips near quiz header if still present
    const window = full.slice(Math.max(0, offset - 80), offset + 40);
    if (/quiz-title|quiz-hero|breadcrumb|h1|h2/i.test(window)) {
      return `>${TOPIC_TITLE}<`;
    }
    return match;
  }
);

if (!html.includes('html,body{background-color:#0F0A1F}')) {
  html = html.replace(
    '    <link rel="preload"',
    `    <!-- Critical paint: solid vault color before main.css (prevents white flash) -->
    <style>html,body{background-color:#0F0A1F}</style>
    <link rel="preload"`
  );
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
    "  { path: '/quiz/breakdown/crystal-halls.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/mental-realignment.json'
);
