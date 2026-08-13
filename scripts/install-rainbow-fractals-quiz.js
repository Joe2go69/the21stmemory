/**
 * Installs Rainbow Fractals quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/fractal-quiz.json
 * Title forced to "Rainbow Fractals". All 25 audited against rainbow-fractals report only.
 *
 * Run: node scripts/install-rainbow-fractals-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/rainbow-fractals.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'rainbow-fractals';
const TOPIC_TITLE = 'Rainbow Fractals';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/fractal-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/rainbow-fractals.webp';

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

/** Support phrases grounded only in rainbow-fractals.json report. */
const supportPhrases = {
  1: ['conscious', 'multi-dimensional', 'frequency mirrors', 'light structures'],
  2: ['sound serves as the organizing tool', 'folded into light'],
  3: ['living crystal walls', 'crystal halls'],
  4: ['alignment between layers', 'frequency mirrors'],
  5: ['blue for the father frequency', 'father frequency'],
  6: ['pineal gland', 'decalcify'],
  7: ['first creation proper'],
  8: ['lungs of light', 'breathing'],
  9: ['crystal prisms', 'dissolving distortion', 'parasitic overlays'],
  10: ['shimmering blues, aquas, silvers, pearls, and greens', 'draw out heavy'],
  11: ['crystalline grids', 'ley-lines', 'broadcast', 'curative'],
  12: ['northern lights', 'color-frequency codes'],
  13: ['black crystals', 'void holders', 'antarctica'],
  14: ['air (breath and vibration)', 'breath and vibration'],
  15: ['flash memory recall', 'sleeping orbs', 'great awakening'],
  16: ['project blue beam', 'mechanical holograms', 'fake alien invasion'],
  17: ['thought and tone', 'manifest'],
  18: ['transition from sound to light', 'sound serves as the organizing'],
  19: ['conscious wavelengths', 'communicate directly with the soul'],
  20: ['vatican', 'reincarnation loop', 'karmic contracts'],
  21: ['violet for transition gateways', 'transition gateways'],
  22: ['photon-photon resonance', 'exists first as a tone'],
  23: ['fire (will and ignition)', 'will and ignition'],
  24: ['memory stream', 'unbroken historical timeline'],
  25: ['parasite whispers', 'high-octave resonance'],
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
    [/\bthe text explicitly lists\b/gi, ''],
    [/\bthe text describes\b/gi, ''],
    [/\bthe text states\b/gi, ''],
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
 * All four options at similar depth from the rainbow-fractals report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'They are conscious, multi-dimensional light structures and frequency mirrors that bridge vibrational octaves.',
      rationale:
        'Rainbow fractals are conscious, multi-dimensional light structures and frequency mirrors that act as dynamic interfaces between vibrational octaves and layers of reality.',
    },
    {
      text: 'They are reflections of artificial light generated by the parasitic overlay to keep souls locked in 3D.',
      rationale:
        'Fractals reveal true alignment between layers; parasitic overlays generate the artificial distortions the fractals expose.',
    },
    {
      text: 'They are mechanical projectors the Lyran lineage uses to monitor and police 3D timelines from afar.',
      rationale:
        'These are living light structures, not mechanical monitoring devices operated by the Lyran lineage.',
    },
    {
      text: 'They are static geometric decorations added to stabilize the physical density of the current realm.',
      rationale:
        'Fractals are dynamic interfaces that crystallize sound harmonics, not static decorations for physical density.',
    },
  ],
  2: [
    {
      text: 'Sound — the organizing tool that vibrates and resonates creation before it is folded into light.',
      rationale:
        'Sound serves as the organizing tool that vibrates, resonates, and organizes creation, which is then folded into light awareness as the first spark of vision.',
    },
    {
      text: 'Electricity — the first spark that builds the geometric blueprint before any vibrational organizing begins.',
      rationale:
        'Electricity is not named as the first organizer; sound organizes creation before it is folded into light.',
    },
    {
      text: 'Gravity — the density force that pulls matter into form before any sound or light can appear at all.',
      rationale:
        'Gravity is not the primary organizing tool; the architecture begins with sound vibration folded into light.',
    },
    {
      text: 'Magnetism — the field that first lays the map of creation before sound or light can take any shape.',
      rationale:
        'Magnetism is not the named foundation; sound organizes creation and is then folded into light awareness.',
    },
  ],
  3: [
    {
      text: 'On the living crystal walls of Crystal Halls, the mental-energetic healing temples.',
      rationale:
        'These vibrant structures manifest on the living crystal walls of Crystal Halls, organic membranes that emit, amplify, and sustain their frequency.',
    },
    {
      text: 'Inside the core of Antarctic black-crystal monoliths that store void rather than project light.',
      rationale:
        'Black crystals ground the opposite spectrum as void holders; they are not the screen where rainbow fractals appear.',
    },
    {
      text: 'Across the surfaces of ordinary 3D concrete constructions that hide the living crystal underneath.',
      rationale:
        '3D concrete is the holographic overlay that flickers as frequency rises; fractals appear on living crystal walls, not concrete.',
    },
    {
      text: 'Directly inside the physical eyes of the transitioning soul, with no external temple surface involved.',
      rationale:
        'Fractals project from living crystal walls into the observer’s field; they are not generated inside the physical eyes.',
    },
  ],
  4: [
    {
      text: 'Alignment between different layers of realities, proving overlay divisions are artificial.',
      rationale:
        'Frequency mirrors such as rainbows reveal alignment between layers of realities, showing that parasitic overlay divisions and distances are artificial.',
    },
    {
      text: 'The permanence of the parasitic reincarnation loop, locking souls into Vatican amnesia cycles.',
      rationale:
        'Mirrors reveal truth that bypasses the loop; they do not confirm the permanence of Vatican reincarnation systems.',
    },
    {
      text: 'The inherent stability of the 3D sensory field, proving density cannot be crossed or dissolved.',
      rationale:
        'Light bending through overlay bands shows the 3D field is a projected construct, not an inherent stable reality.',
    },
    {
      text: 'Absolute separation between the soul and the galactic libraries of the Lyran lineage forever.',
      rationale:
        'Mirrors reveal connection and alignment; interacting with fractals tunes consciousness to those galactic libraries.',
    },
  ],
  5: [
    {
      text: 'Blue — the specialized wavelength that carries the father frequency to the soul.',
      rationale:
        'Each color is a conscious wavelength with a specific emotional-spiritual key; blue corresponds to the father frequency.',
    },
    {
      text: 'Violet — the gateway tone that would stand in for the father frequency in every temple.',
      rationale:
        'Violet corresponds to transition gateways, not the father frequency carried by blue.',
    },
    {
      text: 'Aqua — the density-clearing hue that replaces the father frequency as the primary soul key.',
      rationale:
        'Aqua belongs with the shimmering blues, silvers, pearls, and greens that draw out density; it is not the father-frequency key.',
    },
    {
      text: 'Green — the organic heart frequency that the report names as the father frequency instead of blue.',
      rationale:
        'Green corresponds to organic heart frequencies; the father frequency is blue.',
    },
  ],
  6: [
    {
      text: 'They decalcify and stimulate the pineal gland, expanding intuitive recall and dream-state memory.',
      rationale:
        'These color-codes act as bio-electric software patches that decalcify and stimulate the pineal gland, expanding intuitive recall and restoring dream-state memory.',
    },
    {
      text: 'They solidify mental-energetic damage so mind-control overlays become permanently locked in place.',
      rationale:
        'Exposure dissolves mental overlays, mind-control damage, and parasitic programming; it does not solidify that damage.',
    },
    {
      text: 'They suppress intuitive recall so the observer cannot reach the galactic libraries of the Lyran lineage.',
      rationale:
        'Fractals expand intuitive recall and tune consciousness to those galactic libraries; they do not suppress it.',
    },
    {
      text: 'They freeze the light body grid so no further alignment or restoration of memory streams can occur.',
      rationale:
        'Color-codes realign the light body grid and restore memory streams; they do not prevent that expansion.',
    },
  ],
  7: [
    {
      text: 'The consciousness is restored back to its first creation proper through uncorrupted harmonic codes.',
      rationale:
        'Exposure to pure, uncorrupted harmonic codes through color and light restores the consciousness back to its first creation proper.',
    },
    {
      text: 'The soul becomes more susceptible to parasite whispers and mind-control patterns than before exposure.',
      rationale:
        'High-octave resonance silences parasite whispers and mind-control patterns; it does not increase susceptibility.',
    },
    {
      text: 'The soul’s historical timeline is permanently erased so no lineage codes can ever return.',
      rationale:
        'Fractals restore fragmented memory streams and original lineage codes; they do not erase the historical timeline.',
    },
    {
      text: '3D reincarnation contracts are stabilized so Vatican amnesia systems can keep recycling souls.',
      rationale:
        'Exposure dismantles the counterfeit reincarnation loop and Vatican karmic contracts; it does not stabilize them.',
    },
  ],
  8: [
    {
      text: 'They act as lungs of light, breathing in synchronization with the vibrational pulse of the room.',
      rationale:
        'The architecture is dynamic; structural columns act as lungs of light, breathing in sync with the vibrational pulse of the room.',
    },
    {
      text: 'They absorb every color so only raw sound harmonics remain, with no light breathing through the hall.',
      rationale:
        'Columns breathe light in sync with the room; they amplify living light rather than absorbing color away.',
    },
    {
      text: 'They emit a static, unchanging tone that pins the soul permanently into the dense physical plane.',
      rationale:
        'Columns breathe with the room’s pulse to support multi-dimensional healing, not to lock a soul into 3D density.',
    },
    {
      text: 'They stay rigid and non-responsive, behaving like ordinary stone pillars that ignore the hall’s frequency.',
      rationale:
        'The halls are living crystal architecture; the columns respond dynamically as lungs of light.',
    },
  ],
  9: [
    {
      text: 'They refract multi-dimensional light into the soul’s field, dissolving distortion and clearing parasitic overlays.',
      rationale:
        'Crystal prisms refract light into the energy fields of transitioning souls, dissolving distortion and clearing parasitic overlays.',
    },
    {
      text: 'They store the electrical charge of hovering orbs so the soul cannot complete its transition out of density.',
      rationale:
        'Prisms facilitate clearing and transition; they do not store orb charge to prevent movement.',
    },
    {
      text: 'They hide Lyran lineage codes from the observer so galactic libraries stay sealed during the session.',
      rationale:
        'Prisms reveal and activate codes through precise refraction; they do not hide Lyran lineage codes.',
    },
    {
      text: 'They magnify 3D density so the soul can ground more firmly into the holographic overlay instead of clearing it.',
      rationale:
        'Prisms introduce high-frequency light that reduces distortion; they do not magnify 3D density.',
    },
  ],
  10: [
    {
      text: 'Shimmering blues, aquas, silvers, pearls, and greens — sound-created light that draws out heavy density.',
      rationale:
        'Shimmering blues, aquas, silvers, pearls, and greens are sound-created light designed to draw out heavy emotional and mental density and replace it with harmonic resonance.',
    },
    {
      text: 'Deep blacks and void tones that ground the opposite spectrum instead of lifting emotional and mental density.',
      rationale:
        'Void-holding belongs to Antarctic black crystals; density extraction uses the shimmering blue-to-green spectrum.',
    },
    {
      text: 'Localized red and orange heat frequencies that burn density out of the field without any blue-green spectrum.',
      rationale:
        'The named functional ingredients for drawing out density are shimmering blues, aquas, silvers, pearls, and greens.',
    },
    {
      text: 'A single fixed white-light signature that treats every density layer the same, with no color-specific tuning.',
      rationale:
        'Specific color frequencies tune the soul like a radio receiver; targeted clearing is not a single fixed white light.',
    },
  ],
  11: [
    {
      text: 'They draw from the grids and ley-lines to broadcast their curative frequency into the field.',
      rationale:
        'Fractals connect laterally to planetary crystalline grids and ley-lines — the realm’s hard drives — and draw from them to broadcast their curative frequency.',
    },
    {
      text: 'They act as a shield that blocks all access to the grids so no soul journey memory can be read.',
      rationale:
        'Fractals draw from the grids to broadcast healing; they do not seal the grids against access.',
    },
    {
      text: 'They are the source of the Vatican amnesia systems stored inside the grids and ley-line hard drives.',
      rationale:
        'Fractals dismantle amnesia systems and restore memory; they do not generate those systems inside the grids.',
    },
    {
      text: 'They disrupt ley-lines so communication with Lyran, Pleiadian, and Andromedan builders is cut off.',
      rationale:
        'The grids store those builders’ memory; fractals draw from that store to broadcast healing, not to cut communication.',
    },
  ],
  12: [
    {
      text: 'Both use the same color-frequency codes to communicate across the domes at different scales.',
      rationale:
        'Northern Lights and rainbow fractals share a lateral relationship: both use the same color-frequency codes across the domes — macroscopic sky mirrors of the temple’s microscopic healing grids.',
    },
    {
      text: 'Rainbow fractals are the sole cause of every sky display, with no shared code or parallel manifestation.',
      rationale:
        'They are parallel manifestations of the same codes, not a one-way cause of the Northern Lights.',
    },
    {
      text: 'There is no functional or frequency relationship between temple fractals and the lights in the sky.',
      rationale:
        'Both are frequency mirrors in the same architecture, communicating across overlays with shared color-frequency codes.',
    },
    {
      text: 'The Northern Lights are a counterfeit overlay designed to imitate temple fractals and mislead observers.',
      rationale:
        'The Northern Lights are organic dome frequencies bleeding through higher overlays, not a counterfeit of the fractals.',
    },
  ],
  13: [
    {
      text: 'They ground the opposite spectrum as void holders so harmony is maintained beside the active light.',
      rationale:
        'Antarctic black crystals ground the opposite spectrum as void holders to maintain harmony, while rainbow fractals amplify and project the active multi-dimensional light spectrum.',
    },
    {
      text: 'They emit the light that rainbow fractals then refract, acting as the only source lamp for the temples.',
      rationale:
        'Fractals arise as sound is folded into light through living crystal prisms; black crystals hold void, they do not emit that light.',
    },
    {
      text: 'They are the primary source of the parasitic overlays that rainbow fractals are then asked to dissolve.',
      rationale:
        'In this architecture the black crystals are organic void holders for balance, not parasitic overlay generators.',
    },
    {
      text: 'They are the main storage vaults for Lyran lineage codes instead of the crystalline grids and libraries.',
      rationale:
        'Lineage memory is stored in the planetary crystalline grids and libraries; black crystals hold the void spectrum.',
    },
  ],
  14: [
    {
      text: 'Air — the element of breath and vibration needed for sound to condense into crystalline light.',
      rationale:
        'Among the elements of consciousness, air is breath and vibration, a necessary part of condensing sound into crystalline structures so light can refract.',
    },
    {
      text: 'Earth — form and stability alone, with no role assigned to breath or vibration in the fractal synthesis.',
      rationale:
        'Earth is form and stability; breath and vibration belong to air in the synthesis that produces the fractals.',
    },
    {
      text: 'Fire — will and ignition only, standing in for breath and vibration rather than sparking the process.',
      rationale:
        'Fire is will and ignition; the breath-and-vibration key is air.',
    },
    {
      text: 'Water — memory and flow, treated as if it were the breath-and-vibration element of the synthesis.',
      rationale:
        'Water is memory and flow; air is the element tied to breath and vibration.',
    },
  ],
  15: [
    {
      text: 'They trigger instant flash memory recall in sleeping orbs and accelerate the Great Awakening.',
      rationale:
        'Recognition of these fractals is a massive catalyst that triggers instant flash memory recall in sleeping orbs and accelerates the Great Awakening.',
    },
    {
      text: 'They help the Vatican re-establish karmic contracts so the reincarnation loop can keep running.',
      rationale:
        'Fractals dismantle Vatican amnesia systems and counterfeit karmic contracts; they do not restore them.',
    },
    {
      text: 'They strengthen holographic 3D concrete so the living crystal underneath stays permanently hidden.',
      rationale:
        'As frequency rises, 3D concrete flickers and bends, revealing living crystal; fractals do not strengthen that overlay.',
    },
    {
      text: 'They prolong the amnesia cycle for souls who are not yet ready to leave the 3D density overlay.',
      rationale:
        'These fractals break amnesia and trigger flash recall; they are not designed to prolong the sleep cycle.',
    },
  ],
  16: [
    {
      text: 'It destabilizes the mechanical holograms used in parasite and White Hat theater, including Project Blue Beam.',
      rationale:
        'High-frequency fractal projection destabilizes mechanical holograms used in parasite and White Hat theater events such as Project Blue Beam and the fake alien invasion.',
    },
    {
      text: 'It supplies the power source that keeps fake-alien-invasion holograms running at full intensity.',
      rationale:
        'Fractal resonance is incompatible with those mechanical holograms; it destabilizes them rather than powering them.',
    },
    {
      text: 'It validates the fear-based White Hat narratives so the staged invasion can finish its full cycle.',
      rationale:
        'High-resonance frequency shortens the fear cycle and lets true contact be accepted rather than feared.',
    },
    {
      text: 'It hides true contact behind a thicker overlay so people remain in fear of the staged invasion theater.',
      rationale:
        'The frequency clarifies perception, shortens fear, and allows true contact to be accepted.',
    },
  ],
  17: [
    {
      text: 'Manifestation through thought and tone is restored, making heavy labor and fake-money control obsolete.',
      rationale:
        'Realigning to the fractals’ geometric logic restores creation through thought and tone; buildings, clothing, and transport respond to intention, rendering heavy physical labor and parasitic financial control obsolete.',
    },
    {
      text: 'The soul becomes more dependent on parasitic financial systems to create anything in the physical field.',
      rationale:
        'Direct manifestation through thought and tone makes parasitic financial control completely obsolete.',
    },
    {
      text: 'Heavier fixed physical labor is required to hold form, because intention no longer shapes buildings or transport.',
      rationale:
        'The opposite occurs: form responds to intention again, so heavy fixed labor is no longer required.',
    },
    {
      text: 'All soul memory and historical context are permanently lost once geometric logic returns to the field.',
      rationale:
        'Restoring geometric logic recovers memory streams and original lineage; it does not wipe historical context.',
    },
  ],
  18: [
    {
      text: 'The physical manifestation of the primordial transition from sound into light awareness.',
      rationale:
        'Rainbow fractals are the physical manifestation of the primordial transition from sound to light — sound organizes creation, then is folded into light awareness as the first spark of vision.',
    },
    {
      text: 'The physical manifestation of light collapsing backward into sound after the first spark of vision is lost.',
      rationale:
        'The sequence is sound organizing creation and then folding into light, not light collapsing back into sound.',
    },
    {
      text: 'A purely electrical discharge that never passes through sound harmonics or light-awareness at all.',
      rationale:
        'Fractals capture active harmonics of the first crystal light-worlds as sound is folded into light, not a soundless electrical discharge.',
    },
    {
      text: 'A gravity-first collapse of matter that produces color without any sound-to-light organizing sequence.',
      rationale:
        'The named sequence is sound as organizer folded into light; gravity-first color without that sequence is not the architecture.',
    },
  ],
  19: [
    {
      text: 'They are specialized, conscious wavelengths designed to communicate directly with the soul.',
      rationale:
        'The colors are not static or merely aesthetic; they are highly specialized, conscious wavelengths designed to communicate directly with the soul.',
    },
    {
      text: 'They are only decorative shimmer with no wavelength, tone, or communication role for the soul at all.',
      rationale:
        'The colors are functional, conscious wavelengths and bio-electric software patches, not mere decoration.',
    },
    {
      text: 'They are leftover glare from 3D lighting rigs that carry no emotional-spiritual key or pineal effect.',
      rationale:
        'Each color is a specific tone or emotional-spiritual key that decalcifies the pineal and restores dream-state memory.',
    },
    {
      text: 'They are random static noise that the living crystal walls emit without any translation of vibrational signatures.',
      rationale:
        'Iridescent colors translate vibrational signatures; they are not random noise without meaning.',
    },
  ],
  20: [
    {
      text: 'The counterfeit reincarnation loop and Vatican karmic contracts are permanently dismantled.',
      rationale:
        'By dissolving parasitic overlays and restoring original memory streams, exposure permanently dismantles the counterfeit reincarnation loop and karmic contracts imposed by the Vatican amnesia systems.',
    },
    {
      text: 'The Vatican amnesia systems are reinforced so sols stay locked in the same recycling contracts.',
      rationale:
        'Exposure ends those amnesia-based contracts and frees sols for higher realms or a free Known Lands cycle.',
    },
    {
      text: 'Karmic contracts are rewritten by the overlay so the soul must re-enter the same loop under a new name.',
      rationale:
        'The contracts are dismantled, not rewritten; sols are set free rather than re-enrolled.',
    },
    {
      text: 'Only the physical body is released while the soul remains bound to Vatican memory-wipe systems forever.',
      rationale:
        'Memory restoration and overlay dissolution free the soul itself from the counterfeit loop, not merely the body.',
    },
  ],
  21: [
    {
      text: 'Transition gateways — the emotional-spiritual key carried by the violet wavelength.',
      rationale:
        'Each color is a specific tone or key; violet corresponds to transition gateways.',
    },
    {
      text: 'The stability of the earth element, treated as if violet were the form-and-stability marker.',
      rationale:
        'Earth is form and stability among the elements; violet is the color-code for transition gateways.',
    },
    {
      text: 'Father frequencies, as if violet rather than blue carried that specialized soul key.',
      rationale:
        'Blue is the father frequency; violet is the transition-gateway key.',
    },
    {
      text: 'Organic heart frequencies, as if violet rather than green opened that emotional-spiritual channel.',
      rationale:
        'Green corresponds to organic heart frequencies; violet is for transition gateways.',
    },
  ],
  22: [
    {
      text: 'The fabric of light-sound where every color exists first as a tone or vibrational frequency wave.',
      rationale:
        'Photon-Photon Resonance is the underlying fabric of light-sound where every color exists first as a tone or vibrational frequency wave before consciousness translates it.',
    },
    {
      text: 'The process by which the parasitic overlay consumes light and turns it into loosh for harvest.',
      rationale:
        'Photon-Photon Resonance is an organic feature of creation, not a parasitic consumption process.',
    },
    {
      text: 'The method of refracting ordinary 3D physical glass, with no multi-dimensional tone preceding the color.',
      rationale:
        'This resonance is the multi-dimensional fabric where color is first a tone, not a 3D glass-refraction trick.',
    },
    {
      text: 'A collision of light particles that only produces heat in the physical plane, with no harmonic meaning.',
      rationale:
        'Resonance here is harmonic alignment of light-sound, not mere physical heat from particle collision.',
    },
  ],
  23: [
    {
      text: 'Fire — will and ignition, one of the elements synthesized when sound condenses into crystalline light.',
      rationale:
        'Fire is will and ignition among the elements of consciousness that the fractals synthesize as sound condenses into crystalline structures.',
    },
    {
      text: 'Air — treated as if will and ignition belonged to breath and vibration rather than to fire.',
      rationale:
        'Air is breath and vibration; will and ignition belong to fire.',
    },
    {
      text: 'Earth — treated as if the spark of ignition were the same as form and structural stability.',
      rationale:
        'Earth is form and stability; the spark of will and ignition is fire.',
    },
    {
      text: 'Water — treated as if memory and flow were the ignition element that starts the fractal field.',
      rationale:
        'Water is memory and flow; ignition and will are fire.',
    },
  ],
  24: [
    {
      text: 'It turns and restores fragmented memory streams, reconnecting the soul to its unbroken timeline and lineage.',
      rationale:
        'After distortion clears, fractals turn and restore fragmented memory streams, reconnecting the soul to its unbroken historical timeline and original lineage codes.',
    },
    {
      text: 'It deletes traumatic memories so the transition feels easier, leaving no historical timeline to recover.',
      rationale:
        'The step restores truth and lineage; it does not delete experience to ease the passage.',
    },
    {
      text: 'It uploads only the soul’s current 3D experiences to the grid, with no retrieval of original lineage codes.',
      rationale:
        'Activation retrieves original codes and the unbroken timeline from the grids; it is not a 3D-data upload.',
    },
    {
      text: 'It synchronizes the soul’s memory with the parasitic overlay so the 3D script stays the master record.',
      rationale:
        'Activation decouples the soul from parasitic overlays and restores the original historical timeline.',
    },
  ],
  25: [
    {
      text: 'Their high-octave resonance completely silences parasite whispers and mind-control patterns.',
      rationale:
        'The high-octave resonance of the shimmering light completely silences parasite whispers and mind-control patterns, returning the mind to absolute clarity and relief.',
    },
    {
      text: 'They leave mental patterns untouched, so parasite whispers continue at the same volume after the session.',
      rationale:
        'The fractals have a profound clearing effect; high-octave light eradicates those whispers rather than leaving them intact.',
    },
    {
      text: 'They record the whispers for later analysis in the Crystal Halls instead of ending the intrusion.',
      rationale:
        'The purpose is eradication and relief, not archival collection of parasite whispers.',
    },
    {
      text: 'They amplify the whispers so the soul must confront them at full volume before any relief can begin.',
      rationale:
        'Fractals provide relief by silencing those intrusions; they do not amplify them for confrontation.',
    },
  ],
};

const questionsMeta = [
  {
    number: 1,
    question:
      'What primary function do rainbow fractals serve as they appear in the sacred geometry of the living universe?',
    hint: 'Think of them as dynamic interfaces that bridge different vibrational octaves.',
  },
  {
    number: 2,
    question:
      'In the true architecture of the universe, what organizes creation before it is folded into light?',
    hint: 'Vibration precedes the first spark of vision.',
  },
  {
    number: 3,
    question: 'Where do these vibrant structures manifest inside the mental-energetic healing temples?',
    hint: 'The temples are Crystal Halls, and the surfaces are living membranes.',
  },
  {
    number: 4,
    question:
      'When light bends through different dome and overlay frequency bands, what does a frequency mirror reveal?',
    hint: 'These mirrors prove that projected distances and divisions are artificial.',
  },
  {
    number: 5,
    question: 'Which color-code in the fractals corresponds to the father frequency?',
    hint: 'Each color is a specific emotional-spiritual key.',
  },
  {
    number: 6,
    question: 'What biological effect do these color-coded fractal patterns have on the observer?',
    hint: 'They act as bio-electric software patches that restore dream-state memory.',
  },
  {
    number: 7,
    question: 'What is the result of exposing the soul to the pure harmonic codes of the fractals?',
    hint: 'The light body grid realigns and deep-seated overlays dissolve.',
  },
  {
    number: 8,
    question: 'During the therapeutic process, how do the structural columns of the Crystal Halls behave?',
    hint: 'The architecture itself is dynamic and synchronized with the room.',
  },
  {
    number: 9,
    question: 'What is the primary role of crystal prisms in the therapeutic mechanism?',
    hint: 'These geometric structures process the light before it reaches the soul’s bio-field.',
  },
  {
    number: 10,
    question: 'Which specific color frequencies are used to draw out heavy emotional and mental density?',
    hint: 'These functional ingredients tune the soul like a radio receiver.',
  },
  {
    number: 11,
    question: 'How are rainbow fractals connected to the planetary crystalline grids?',
    hint: 'The grids act as the realm’s hard drives, holding the memory of soul journeys.',
  },
  {
    number: 12,
    question: 'What relationship do rainbow fractals share with the Northern Lights?',
    hint: 'Think of the Northern Lights as a sky-scale version of the temple grids.',
  },
  {
    number: 13,
    question: 'In Antarctica, what do black crystals do in relation to rainbow fractals?',
    hint: 'Harmony is held by balancing active light with its opposite spectrum.',
  },
  {
    number: 14,
    question: 'Which element of consciousness is associated with the breath and vibration the fractals need?',
    hint: 'Rainbow fractals synthesize the elements of consciousness.',
  },
  {
    number: 15,
    question: 'What strategic impact does recognizing these fractals have on the Great Awakening?',
    hint: 'As the realm’s frequency rises, holographic constructions become less stable.',
  },
  {
    number: 16,
    question: 'How does the high-resonance frequency of fractals affect staged invasions like Project Blue Beam?',
    hint: 'High frequency shortens the fear cycle and clarifies perception.',
  },
  {
    number: 17,
    question: 'What is restored when the soul realigns with the geometric logic of the fractals?',
    hint: 'Think about how buildings, clothing, and transport respond to consciousness.',
  },
  {
    number: 18,
    question: 'What primordial transition do rainbow fractals physically manifest?',
    hint: 'Sound organizes first, then folds into the first spark of vision.',
  },
  {
    number: 19,
    question: 'What are the shimmering colors displayed inside the fractals?',
    hint: 'These colors are functional, not merely aesthetic.',
  },
  {
    number: 20,
    question:
      'What happens to the Vatican amnesia reincarnation loop when a soul is exposed to rainbow fractals?',
    hint: 'Overlays dissolve and original memory streams return.',
  },
  {
    number: 21,
    question: 'What specific frequency key does the color violet carry?',
    hint: 'This color is associated with movement between realms.',
  },
  {
    number: 22,
    question: 'What is Photon-Photon Resonance in the context of rainbow fractals?',
    hint: 'This is the relationship between light and sound before color is seen.',
  },
  {
    number: 23,
    question: 'Which element of consciousness is associated with ignition and will in generating these fractals?',
    hint: 'This element provides the spark of creation.',
  },
  {
    number: 24,
    question: 'In the therapeutic sequence, what does Memory Stream Activation do?',
    hint: 'This step follows the clearing of energetic distortion.',
  },
  {
    number: 25,
    question: 'How do rainbow fractals interact with parasite whispers?',
    hint: 'The result is absolute clarity and relief for the mind.',
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
    'Test your grasp of Rainbow Fractals — living crystal walls, frequency mirrors, color-codes and pineal restoration, lungs of light, crystal prisms, Northern Lights, Vatican loop dismantling, and manifestation through thought and tone.',
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'Rainbow Fractals are the living light on Crystal Hall walls — frequency mirrors that fold sound into color, restore memory streams, and silence parasite whispers. Sit with the iridescent codes, the lungs of light, and the geometric logic that returns manifestation through thought and tone. Return to the Rainbow Fractals deep-dive, infographic, and video transmissions as you hold first-creation clarity.',
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
    'Test your understanding of Rainbow Fractals — conscious light structures on living crystal walls; frequency mirrors and sound-to-light; color-codes and pineal restoration; lungs of light and crystal prisms; Northern Lights and Antarctic void holders; and dismantling of the Vatican reincarnation loop.',
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
        t.description.includes('Decoded analysis of Rainbow Fractals')
      ) {
        t.description =
          'Rainbow Fractals are conscious multi-dimensional light structures on living crystal walls — frequency mirrors that crystallize sound harmonics, restore soul memory, and dissolve parasitic overlays through iridescent color-codes.';
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('rainbow-fractals not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'mental-realignment.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Rainbow Fractals: living crystal walls, frequency mirrors, sound folded into light, color-codes and pineal restoration, lungs of light, crystal prisms, Northern Lights, Vatican loop dismantling, and manifestation through thought and tone.';

html = html
  .replace(/Mental Realignment Quiz/g, `${TOPIC_TITLE} Quiz`)
  .replace(/Interactive Living Truth Quiz on Mental Realignment:[^"]*/g, desc)
  .replace(/quiz\/breakdown\/mental-realignment\.html/g, `quiz/${SOURCE}/${TOPIC_ID}.html`)
  .replace(/images\/breakdown\/mental-realignment\.webp/g, topicImage)
  .replace(/topic=mental-realignment/g, `topic=${TOPIC_ID}`)
  .replace(/Mental Realignment deep-dive/g, `${TOPIC_TITLE} deep-dive`)
  .replace(/data\/quizzes\/breakdown\/mental-realignment\.json/g, `data/quizzes/${SOURCE}/${TOPIC_ID}.json`)
  .replace(/mental-realignment\.json/g, `${TOPIC_ID}.json`)
  .replace(/mental-realignment\.html/g, `${TOPIC_ID}.html`)
  .replace(/mental-realignment\.webp/g, 'rainbow-fractals.webp');

if (!html.includes(`${TOPIC_TITLE} Quiz`)) {
  throw new Error('HTML clone failed to set quiz title');
}
if (!html.includes(`data-quiz-src="../../data/quizzes/${SOURCE}/${TOPIC_ID}.json"`)) {
  throw new Error('HTML clone failed to set data-quiz-src');
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
    "  { path: '/quiz/breakdown/mental-realignment.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/rainbow-fractals.json'
);
