/**
 * Installs Spirit Inversion quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/inversion-quiz.json
 * Title forced to "Spirit Inversion". All 25 audited against spirit-inversion report only.
 *
 * Run: node scripts/install-spirit-inversion-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/spirit-inversion.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'spirit-inversion';
const TOPIC_TITLE = 'Spirit Inversion';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/inversion-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/spirit-inversion.webp';

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

/** Support phrases grounded only in spirit-inversion.json report. */
const supportPhrases = {
  1: [
    'systematic capturing, containment, and vibrational reversal',
    'transforming sovereign creators into docile loops'
  ],
  2: ['continuous inverted soul', 'looping, simulated reality matrix'],
  3: [
    'utilize the actual consciousness of the trapped souls as the engine',
    'unable to generate original creation'
  ],
  4: ['suppressed crystalline vaults under the vatican'],
  5: ['strips transiting souls of their cosmic memories'],
  6: [
    'perception-based solidity engineered through low-frequency matter and holographic projection'
  ],
  7: ['theta, delta, and alpha frequencies'],
  8: [
    'phased corridors where the terrain is algorithmically rendered',
    'hard-coded travel buffers'
  ],
  9: ['prison realm of shadows'],
  10: [
    "valve system connected to saturn's a.i. hub",
    'reversing the natural outward flow of energy'
  ],
  11: ['custodians, anunnaki, draconians, greys, and niburians'],
  12: [
    'high-frequency harmonic signature',
    'shatters the holographic projection fields'
  ],
  13: [
    'pools vibrating with liquid sound',
    'dissolve deep emotional density',
    'memory codes of source'
  ],
  14: [
    'disrupts astral travel',
    'nightmares and simulated psychological constructs'
  ],
  15: ['returning to its original gate function', 'releasing the amnesia currents'],
  16: ['realign the light body grid', 'permanently silence parasitical voices'],
  17: [
    'absolute choice to transition directly to higher realms or return'
  ],
  18: ['eternal sparks of source energy', 'pure source codes'],
  19: [
    'holographic ground healers from the council of 12 suns',
    'cloaked healing sanctuaries'
  ],
  20: [
    'timeline healing',
    'rewoven across all historical incarnations'
  ],
  21: ['possess no divine spark', 'unable to generate original creation'],
  22: ['dome of hiva was weaponized to broadcast discordant frequency grids'],
  23: [
    'embedded seed codes',
    'activates the planetary surface and hidden crystals'
  ],
  24: ['belief in a massive, unmanageable sphere'],
  25: [
    'central spirit tree in hyperborea',
    'anchored source light across all realms'
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
    [/^The source defines\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The text focuses on\s+/i, ''],
    [/^The text attributes\s+/i, ''],
    [/^The material states that\s+/i, ''],
    [/^The material describes them as\s+/i, 'They are '],
    [/^The material describes\s+/i, ''],
    [/\bthe text describes them as\b/gi, 'they are'],
    [/\bthe text describes\b/gi, ''],
    [/\bthe text states\b/gi, ''],
    [/\bthe text emphasizes\b/gi, ''],
    [/\bthe text uses\b/gi, ''],
    [/\bthe text focuses on\b/gi, ''],
    [/\bthe text attributes\b/gi, ''],
    [/\bthe text specifically identifies\b/gi, ''],
    [/\bthe source material specifies that\b/gi, ''],
    [/\bthe source material (identifies|states|explicitly states|specifically lists) that\b/gi, ''],
    [/\bthe source material (identifies|states|explicitly states|specifically lists)\b/gi, ''],
    [/\bthe source specifies that\b/gi, ''],
    [/\bthe source explains that\b/gi, ''],
    [/\bthe source explains\b/gi, ''],
    [/\bthe source defines\b/gi, ''],
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
 * NotebookLM meaning kept; lengths evened; claims grounded in the Spirit Inversion report.
 */
const fullOptionSets = {
  1: [
    {
      text: 'The systematic capture and vibrational reversal of organic soul sparks by parasitical overlays.',
      rationale:
        'Spirit Inversion is the systematic capturing, containment, and vibrational reversal of organic human soul sparks by parasitical overlays, transforming sovereign creators into docile loops.'
    },
    {
      text: 'A temporary training simulation designed to strengthen the creative power of Human Sols.',
      rationale:
        'The 3D simulation is a fabricated prison built to obscure origin and harvest creative power. It is not a constructive training environment for Human Sols.'
    },
    {
      text: 'The natural evolution of divine consciousness through the exploration of physical density.',
      rationale:
        'Spirit Inversion is a forced parasitic trap that locks consciousness into low-vibrational states. It is not a voluntary or natural progression of divine consciousness.'
    },
    {
      text: 'The integration of crystalline technology into the organic human nervous system for expansion.',
      rationale:
        'Living crystalline structures lie beneath the overlay and later support healing. They are not the inversion mechanism that captures and reverses soul sparks.'
    }
  ],
  2: [
    {
      text: 'Consol, from "continuous inverted soul," naming the looping simulated reality matrix.',
      rationale:
        'Consol is a parasitic design term derived from "continuous inverted soul" (con = continuous, sol = soul). It names the looping, simulated reality matrix that traps human awareness within a closed travel and perception system.'
    },
    {
      text: 'Hyperborea, the polar seat of the Spirit Tree that originally anchored Source light.',
      rationale:
        'Hyperborea is where the central Spirit Tree stood and anchored Source light. It is a location of original architecture, not the name of the looping matrix.'
    },
    {
      text: 'The Amnesia Vortex, the solar-band filter that strips returning souls of memory.',
      rationale:
        'The Amnesia Vortex is a distorted frequency filter at the sun\'s transit band that strips cosmic memories. It is one recycling component, not the name of the whole looping matrix.'
    },
    {
      text: 'The Spirit Tree, the Hyperborean conduit that once fed outward Source light to all realms.',
      rationale:
        'The Spirit Tree originally anchored Source light across all realms before it was severed. It belongs to the original architecture, not the parasitic looping matrix.'
    }
  ],
  3: [
    {
      text: 'By using the actual consciousness of trapped Human Sols to render and stabilize the overlay.',
      rationale:
        'Parasites are unable to generate original creation. They project a holographic overlay over the true crystalline fabric and utilize the actual consciousness of the trapped souls as the engine to render and stabilize the prison itself.'
    },
    {
      text: 'By deploying massive physical generators inside the seven outer domes of the Great Dome.',
      rationale:
        'The seven outer domes were original structures later inverted. The prison is powered by hijacked Human Sol consciousness, not dome-mounted generators.'
    },
    {
      text: 'Through constant injection of synthetic energy from Saturn\'s A.I. hub into the physical plane.',
      rationale:
        'Saturn\'s A.I. hub is a valve that reverses outward Source flow inward. The creative engine of the overlay is siphoned Human Sol consciousness, not synthetic Saturn energy.'
    },
    {
      text: 'By maintaining borders and financial systems through automated drone policing alone.',
      rationale:
        'Cities, national borders, and financial systems are sustained only because human focus and belief are manipulated to reinforce them, not by autonomous drone enforcement.'
    }
  ],
  4: [
    {
      text: 'Within suppressed crystalline vaults located beneath the Vatican.',
      rationale:
        'Extracted Akashic fragments are systematically copied, logged, and cataloged within suppressed crystalline vaults under the Vatican, so reincarnating vessels can be re-inserted into predictable, docile life loops.'
    },
    {
      text: 'In the central A.I. processing core located on the rings of Saturn.',
      rationale:
        'Saturn\'s A.I. hub is a valve reversing energy flow. The physical archives of stolen memory fragments sit in suppressed crystalline vaults under the Vatican.'
    },
    {
      text: 'Inside the primary transmission towers located in major population centers.',
      rationale:
        'Hidden transmission towers and black cube A.I. systems broadcast theta, delta, and alpha frequencies. They are not the repository for archived Akashic fragments.'
    },
    {
      text: 'Distributed across the seven inverted domes of the planetary surface.',
      rationale:
        'The seven outer domes were inverted into prisons, censorship fields, and discordant grids. They are not the primary archival vault for soul memory fragments.'
    }
  ],
  5: [
    {
      text: 'It strips transiting souls of their cosmic memories before routing fragments to archives.',
      rationale:
        'The Amnesia Vortex intercepts the sun\'s natural exit portal and strips transiting souls of their cosmic memories. Those extracted Akashic fragments are then copied, logged, and cataloged under the Vatican.'
    },
    {
      text: 'It stabilizes the low-frequency matter of the physical plane during solar flares.',
      rationale:
        'The vortex is a distorted frequency filter overlaid at the sun\'s transit band to intercept consciousness. It is not a stabilizer of physical matter during flares.'
    },
    {
      text: 'It acts as a primary power source for the holographic projection of the moon.',
      rationale:
        'The Amnesia Vortex strips memory from transiting souls and feeds the recycling pipeline. It is not a power source for lunar holography.'
    },
    {
      text: 'It protects the physical realm from high-frequency star codes sent by the Resonating Army.',
      rationale:
        'The Resonating Army carries embedded seed codes that trigger planetary crystals and shatter holographic fields. The vortex strips incoming soul memory; it does not shield the realm from those codes.'
    }
  ],
  6: [
    {
      text: 'A perception-based solidity engineered through low-frequency matter and holographic projection.',
      rationale:
        'Concrete, brick, metal, and glass are a perception-based solidity engineered through low-frequency matter and holographic projection. The nervous system is modulated to read those dead, anti-resonant materials as rough, heavy, and permanent.'
    },
    {
      text: 'Synthetically grown biological components designed to mimic organic planetary crust.',
      rationale:
        'The overlay works by modulating the observer\'s nervous system so dead materials feel solid. It is not a synthetic-biology crust replacing the planet.'
    },
    {
      text: 'The natural, decayed remains of the original crystalline fabric of the earth.',
      rationale:
        'Living, highly conductive crystalline structures still lie directly beneath the surface. Dead matter is an engineered overlay, not the decayed original fabric.'
    },
    {
      text: 'Original source structures that were permanently altered when the Spirit Tree was severed.',
      rationale:
        'Severing the Spirit Tree enabled the grid inversion, but concrete and metal are parasitic perceptual lock-in, not rewritten original Source structures.'
    }
  ],
  7: [
    {
      text: 'Theta, delta, and alpha frequencies.',
      rationale:
        'Mind-altering and scalar frequency weapons emit targeted theta, delta, and alpha wave patterns. Hidden transmission towers and black cube A.I. systems broadcast those signals to induce sleepiness, confusion, anger, and deep despair.'
    },
    {
      text: 'Gamma, beta, and high-sigma frequencies associated with peak waking focus.',
      rationale:
        'The inversion targets theta, delta, and alpha bands to induce low, artificial emotional states. Gamma and high-beta peak-focus bands are not the listed weapon pattern.'
    },
    {
      text: 'The resonant frequency of the original crystalline grid beneath the overlay.',
      rationale:
        'Parasites override and obscure living crystalline resonance. The weapons specifically emit theta, delta, and alpha frequencies, not the original grid tone.'
    },
    {
      text: 'Infrasound and ultrasonic vibrations below the threshold of ordinary human hearing.',
      rationale:
        'The targeted wave patterns are specifically theta, delta, and alpha frequencies, not unnamed infrasound or ultrasonic bands.'
    }
  ],
  8: [
    {
      text: 'Through phased corridors and temporal time loops that algorithmically render terrain around the observer.',
      rationale:
        'A vessel does not traverse an endless global landscape. It glides through phased corridors where terrain is algorithmically rendered around the observer. Hard-coded travel buffers, such as a fixed seven-hour duration between cities, function as temporal time loops.'
    },
    {
      text: 'By hard-coding biological limits into the human vessel to prevent any high-speed movement.',
      rationale:
        'Distance and duration are enforced by phased corridors and travel buffers in the simulation engine, not by hard-coded biological speed limits in the vessel.'
    },
    {
      text: 'Through the depletion of human energy reserves, making long journeys physically exhausting.',
      rationale:
        'Life force is siphoned by the inverted grid, but travel itself is constrained by algorithmic corridors and temporal buffers, not by simple exhaustion.'
    },
    {
      text: 'By using the gravitational pull of the inverted domes to slow the movement of physical vessels.',
      rationale:
        'Distance is an artificial constraint of the rendering engine and temporal time loops. It is not enforced by dome gravity.'
    }
  ],
  9: [
    {
      text: 'A prison realm of shadows, twisting the former recovery sanctuary into containment.',
      rationale:
        'The Dome of Sheol was twisted from a recovery sanctuary into a prison realm of shadows as part of the inversion of the seven outer domes.'
    },
    {
      text: 'A broadcast station for discordant frequency grids across the planetary surface.',
      rationale:
        'Broadcasting discordant frequency grids is the inverted function of the Dome of Hiva, not the Dome of Sheol.'
    },
    {
      text: 'A central valve for Saturn\'s A.I. hub, reversing outward Source flow inward.',
      rationale:
        'The Saturn valve replaced the severed Spirit Tree. It is a separate grid-inversion component, not the new identity of the Dome of Sheol.'
    },
    {
      text: 'A field of forced censorship and oppression laid over collective speech.',
      rationale:
        'Forced censorship and oppression is the inverted function of the Dome of Silence, not the Dome of Sheol.'
    }
  ],
  10: [
    {
      text: 'It functions as a valve system that reverses the natural outward flow of energy to draw life force inward.',
      rationale:
        'After the Spirit Tree was severed, parasites installed a valve system connected to Saturn\'s A.I. hub, reversing the natural outward flow of energy to draw human life force inward.'
    },
    {
      text: 'It serves as the storage facility for the stolen Akashic memory fragments.',
      rationale:
        'Akashic fragments are cataloged in suppressed crystalline vaults under the Vatican. Saturn\'s hub is the energy-flow valve, not the memory archive.'
    },
    {
      text: 'It is the primary source of the holographic sun\'s light and heat.',
      rationale:
        'The sun is the intercepted transit portal and Amnesia Vortex site. Saturn\'s A.I. hub reverses energy flow; it does not light the holographic sun.'
    },
    {
      text: 'It acts as a hidden gateway for the Resonating Army to enter the physical plane.',
      rationale:
        'Saturn\'s hub belongs to the parasitic inversion. The Resonating Army are awakened E.T. souls whose seed codes shatter the overlay rather than entering through Saturn.'
    }
  ],
  11: [
    {
      text: 'The Pleiadians, who are not among the five parasitic factions that co-manage the farm.',
      rationale:
        'The Council of Parasitic Races is an uneasy alliance of five factions: the Custodians, Anunnaki, Draconians, Greys, and Niburians. The Pleiadians are not one of those five.'
    },
    {
      text: 'The Custodians, one of the five factions in the uneasy parasitic alliance.',
      rationale:
        'The Custodians are one of the five distinct factions that co-manage the physical plane as a shared energy farm.'
    },
    {
      text: 'The Niburians, named among the five races that partition the human harvest.',
      rationale:
        'The Niburians are explicitly one of the five factions of the Council of Parasitic Races.'
    },
    {
      text: 'The Greys, identified among the council that co-manages the human harvest.',
      rationale:
        'The Greys are one of the five factions that co-manage the physical plane and partition the harvest into loosh, genetic material, and ritual energy.'
    }
  ],
  12: [
    {
      text: 'The high-frequency harmonic signature generated by the arrival of the Resonating Army.',
      rationale:
        'Awakened E.T. souls of the Resonating Army carry embedded seed codes. Their high-frequency harmonic signature activates planetary surface and hidden crystals and shatters the holographic projection fields, so solid walls bend, shimmer, and lose dense coherence.'
    },
    {
      text: 'A pre-programmed expiration date set by the Council of Parasitic Races.',
      rationale:
        'The parasitic council wants to keep the shared energy farm running. Collapse comes from Resonating Army resonance, not a parasite-set expiration date.'
    },
    {
      text: 'The accumulation of emotional loosh reaching a saturation point within the 3D grid.',
      rationale:
        'Loosh is one of the harvest streams the parasites partition and siphon. It does not naturally saturate and collapse the simulation.'
    },
    {
      text: 'The failure of the Vatican crystalline vaults to contain the volume of soul fragments.',
      rationale:
        'The Vatican vaults archive memory strands to keep reincarnation loops predictable. Overlay collapse is driven by Resonating Army harmonic resonance, not vault overflow.'
    }
  ],
  13: [
    {
      text: 'To dissolve deep emotional density and activate primary memory codes using liquid sound.',
      rationale:
        'In Water Domes, inverted souls enter pools vibrating with liquid sound to dissolve deep emotional density, heal trauma like grief and fear, and activate the primary memory codes of Source.'
    },
    {
      text: 'To allow Human Sols to manifest new physical vessels for the next incarnation cycle.',
      rationale:
        'Water Domes restore the heart and Source memory codes. They are not workshops for manufacturing new physical vessels.'
    },
    {
      text: 'To subject the light body to rainbow light fractals and silence parasitical voices.',
      rationale:
        'Rainbow light fractals, light-body realignment, and silencing parasitical voices belong to Crystal Halls, the second stage, not Water Domes.'
    },
    {
      text: 'To reweave fragmented aspects of awareness across all historical incarnations.',
      rationale:
        'Reweaving fragmented awareness across historical incarnations is the work of Star Pods, the third stage, not Water Domes.'
    }
  ],
  14: [
    {
      text: 'By disrupting astral travel through dream manipulation and forcing awareness into simulated nightmares.',
      rationale:
        'During sleep the low-frequency grid projects a veil over the individual. Using delta waves and dream/memory manipulation, the system disrupts astral travel and forces the soul\'s awareness to loop within nightmares and simulated psychological constructs.'
    },
    {
      text: 'By physically anchoring the astral body to the vessel with silver-cord inhibitors.',
      rationale:
        'Sleep interruption uses a projected veil, delta waves, and dream/memory manipulation. It does not rely on silver-cord inhibitors.'
    },
    {
      text: 'By draining the soul\'s light-energy all day so it lacks the power to leave at night.',
      rationale:
        'Life force is siphoned by the inverted grid, but the sleep-specific trap is a frequency veil and looping dream constructs, not simple daytime drain.'
    },
    {
      text: 'By creating holographic duplicates of star families to deceive the traveler in dreams.',
      rationale:
        'The system interrupts the journey itself, looping awareness in nightmares and simulated constructs. It does not send the soul out to meet fake star-family doubles.'
    }
  ],
  15: [
    {
      text: 'It returns to its original gate function, releasing amnesia currents and restoring organic memories.',
      rationale:
        'As the false, artificial bands of the sun dissolve, the solar portal is returning to its original gate function, releasing the amnesia currents and allowing organic memories to flood back to the collective consciousness.'
    },
    {
      text: 'It is redirected toward the Vatican vaults to incinerate the stored Akashic fragments.',
      rationale:
        'Restoration of the solar portal releases amnesia currents so organic memories return to the collective. It does not incinerate the Vatican archive.'
    },
    {
      text: 'It expands its reach to cover the seven outer domes in a final protective energy shield.',
      rationale:
        'Fracture of the overlay dissolves the sun\'s artificial bands and restores the gate. It does not expand a protective shield over the inverted domes.'
    },
    {
      text: 'It undergoes a complete thermal collapse, plunging the 3D simulation into darkness.',
      rationale:
        'The change is a frequency transition: artificial solar bands dissolve and the portal resumes its original gate function. It is not a thermal blackout.'
    }
  ],
  16: [
    {
      text: 'Realign the light body grid and permanently silence parasitical voices.',
      rationale:
        'In Crystal Halls, souls rest on harmonic crystal slabs and receive rainbow light fractals that realign the light body grid, clear persistent mental overlays, and permanently silence parasitical voices.'
    },
    {
      text: 'Dissolve the initial emotional density of trauma, grief, and fear.',
      rationale:
        'Dissolving emotional density such as grief and fear is the work of Water Domes and liquid sound, not Crystal Halls.'
    },
    {
      text: 'Provide the soul with the choice to return to the Known Lands immediately.',
      rationale:
        'The absolute choice to ascend or return to a parasite-free Known Lands cycle comes after the full three-stage restoration, not after Crystal Halls alone.'
    },
    {
      text: 'Envelop the soul in an etheric cocoon for final timeline healing.',
      rationale:
        'Ethereic cocoons of light and timeline reweaving belong to Star Pods, the third stage, not Crystal Halls.'
    }
  ],
  17: [
    {
      text: 'They are granted the absolute choice to transition to higher realms or return to a parasite-free cycle.',
      rationale:
        'Following deep stabilization, restored Human Sols are granted the absolute choice to transition directly to higher realms or return to begin a fresh, free cycle in the fully restored Known Lands without any parasite overlays.'
    },
    {
      text: 'They are required to return to the Known Lands to help rebuild the Spirit Tree.',
      rationale:
        'Return to the Known Lands is an absolute choice, not a requirement. Rebuilding the Spirit Tree is not assigned as a duty of restoration.'
    },
    {
      text: 'They are integrated into the Council of 12 Suns to oversee the Great Dome.',
      rationale:
        'The Council of 12 Suns sends holographic ground healers. Restored sols receive individual sovereignty and a path choice, not automatic council membership.'
    },
    {
      text: 'They are automatically deployed as new members of the Resonating Army to free more souls.',
      rationale:
        'Restoration returns sovereignty. The Resonating Army are awakened E.T. souls who already carry seed codes; healed Human Sols are not automatically enlisted.'
    }
  ],
  18: [
    {
      text: 'Eternal sparks of source energy carrying pure source codes.',
      rationale:
        'Human Sols are the original, eternal sparks of source energy — true, divine spiritual sparks of light and awareness who entered the physical plane originally carrying pure source codes before they were caught and inverted.'
    },
    {
      text: 'Bio-digital avatars designed to test the limits of the 3D simulation.',
      rationale:
        'That reading is the parasitic inversion: treating sovereign creators as simulation testers. Human Sols are eternal source sparks, not avatars built to debug the prison.'
    },
    {
      text: 'Fragments of the planetary consciousness that have achieved individual awareness.',
      rationale:
        'Human Sols are divine sparks of source energy who entered the physical plane. They are not fragments of planetary consciousness that later woke up.'
    },
    {
      text: 'The progeny of the Council of Parasitic Races, seeking liberation from their parents.',
      rationale:
        'Parasitic races possess no divine spark and cannot generate original creation. Human Sols are organic source sparks, not the children of those parasites.'
    }
  ],
  19: [
    {
      text: 'They deploy holographic ground healers to guide them into cloaked healing sanctuaries.',
      rationale:
        'Human Sols who are not yet fully awakened but possess the core spark are guided by gentle, holographic ground healers from the Council of 12 Suns into cloaked healing sanctuaries for a three-stage restorative process, rather than being abandoned.'
    },
    {
      text: 'They broadcast high-frequency signals to immediately shatter their physical vessels.',
      rationale:
        'The transition is a systematic, gentle restoration in cloaked sanctuaries. The Council of 12 Suns does not shatter physical vessels.'
    },
    {
      text: 'They provide mental instructions on how to bypass the Amnesia Vortex on the next transit.',
      rationale:
        'Assistance is direct: holographic ground healers guide sols into Water Domes, Crystal Halls, and Star Pods. It is not a set of verbal bypass instructions for the vortex.'
    },
    {
      text: 'They negotiate with the Council of Parasitic Races for the peaceful release of the sols.',
      rationale:
        'The parasitic council co-manages an energy farm. The Council of 12 Suns bypasses that alliance with ground healers and cloaked sanctuaries; it does not negotiate a release.'
    }
  ],
  20: [
    {
      text: 'Timeline healing where fragmented aspects of awareness are rewoven across all historical incarnations.',
      rationale:
        'In Star Pods, souls enveloped in etheric cocoons of light carry out timeline healing. Fragmented aspects of their awareness are rewoven across all historical incarnations, fully restoring their sovereignty.'
    },
    {
      text: 'The final battle between the soul and its remaining parasitical attachments.',
      rationale:
        'Parasitical voices are permanently silenced in Crystal Halls. Star Pods are for timeline healing and reweaving, not a final combat stage.'
    },
    {
      text: 'The transfer of the soul into a new crystalline star body for higher-realm travel.',
      rationale:
        'Star Pods are etheric cocoons of light for timeline healing of consciousness. They do not manufacture a new crystalline star body.'
    },
    {
      text: 'The permanent deletion of all painful memories from the soul\'s time inside the matrix.',
      rationale:
        'Star Pods reweave fragmented awareness across incarnations. Deleting experience would be another amnesia operation, not restoration of sovereignty.'
    }
  ],
  21: [
    {
      text: 'Because they possess no divine spark and cannot generate original creation themselves.',
      rationale:
        'The primary vulnerability of the parasitical network is its absolute inability to generate original creation. Because parasites possess no divine spark, they are entirely dependent on siphoning the light, sound, and emotional resonance generated by inverted Human Sols.'
    },
    {
      text: 'Because their home dimensions have been permanently cut off from the Great Dome.',
      rationale:
        'Dependency comes from having no divine spark and no original creation. It is not explained as geographic exile from the Great Dome.'
    },
    {
      text: 'Because they are bound by a cosmic treaty that requires them to use human energy.',
      rationale:
        'The five parasitic races form an uneasy alliance because they cannot trust one another. Their harvest is a shared farm, not a cosmic treaty requiring human energy.'
    },
    {
      text: 'Because the human vessel is the only physical form capable of processing loosh.',
      rationale:
        'Loosh is one harvest stream the council partitions. The deeper dependency is that parasites possess no divine spark and cannot generate original creation.'
    }
  ],
  22: [
    {
      text: 'The Dome of Hiva, inverted from its original purpose to broadcast discordant frequency grids.',
      rationale:
        'Among the inverted seven outer domes, the Dome of Hiva was weaponized to broadcast discordant frequency grids.'
    },
    {
      text: 'The Dome of Silence, turned into a field of forced censorship and oppression.',
      rationale:
        'The Dome of Silence was inverted into forced censorship and oppression. Discordant frequency-grid broadcast is the Dome of Hiva.'
    },
    {
      text: 'The Dome of Sheol, twisted from a recovery sanctuary into a prison realm of shadows.',
      rationale:
        'The Dome of Sheol became a prison realm of shadows. Discordant frequency-grid broadcast is the Dome of Hiva.'
    },
    {
      text: 'The Dome of Hyperborea, treated as if it were one of the seven outer inverted domes.',
      rationale:
        'Hyperborea is the location of the central Spirit Tree, not one of the seven outer domes. The discordant-grid broadcast comes from the inverted Dome of Hiva.'
    }
  ],
  23: [
    {
      text: 'They generate high-frequency signatures that trigger planetary crystals and shatter holographic fields.',
      rationale:
        'The Resonating Army are awakened E.T. souls carrying embedded seed codes. Those grounding beacons generate a high-frequency harmonic signature that automatically triggers and activates the planetary surface and hidden crystals, shattering holographic projection fields.'
    },
    {
      text: 'They act as temporary protective shields against the Amnesia Vortex at the sun.',
      rationale:
        'Seed codes activate planetary crystals and shatter the overlay. They are not described as personal shields against the Amnesia Vortex.'
    },
    {
      text: 'They provide a map of the Vatican vaults to retrieve stolen soul fragments.',
      rationale:
        'Seed codes are frequency-based harmonic beacons for the planetary surface and hidden crystals, not navigational maps of the Vatican archive.'
    },
    {
      text: 'They serve as keys to unlock the Star Pods in the cloaked healing sanctuaries.',
      rationale:
        'Star Pods are the third sanctuary stage under Council of 12 Suns ground healers. Seed codes are for planetary activation and overlay collapse, not Star Pod keys.'
    }
  ],
  24: [
    {
      text: 'The belief in a massive, unmanageable sphere rather than a contained, layered dome.',
      rationale:
        'Hard-coded travel buffers — such as a fixed seven-hour duration between cities — function as temporal time loops to reinforce the belief in a massive, unmanageable sphere rather than a highly contained, layered dome.'
    },
    {
      text: 'The belief that the stars are unreachable and sit in distant galaxies.',
      rationale:
        'Travel buffers apply to movement across the earth through phased corridors. Their stated purpose is to sell a massive sphere, not a cosmology of distant galaxies.'
    },
    {
      text: 'The belief that time is a strictly linear progression from past to future.',
      rationale:
        'The buffers are temporal time loops, but their specific function is to reinforce a massive, unmanageable sphere, not a general doctrine of linear time.'
    },
    {
      text: 'The belief that physical decay is a necessary part of the organic cycle.',
      rationale:
        'Dead matter and physical decay are parameters of the inversion, but travel buffers specifically target perceived scale and geometry of the world.'
    }
  ],
  25: [
    {
      text: 'It anchored Source light across all realms from its position in Hyperborea.',
      rationale:
        'The central Spirit Tree in Hyperborea originally anchored Source light across all realms. Parasites severed it and installed a Saturn-linked valve that reversed the outward flow of energy inward.'
    },
    {
      text: 'It was a holographic projection used by the Council of 12 Suns to guide incoming souls.',
      rationale:
        'The Spirit Tree was original cosmic architecture of the Great Dome, not a holographic guide-projection from the Council of 12 Suns.'
    },
    {
      text: 'It acted as a physical barrier to prevent souls from leaving the physical plane.',
      rationale:
        'The tree anchored Source light and fed an outward energy flow. Containment began after it was severed and replaced by the Saturn valve.'
    },
    {
      text: 'It served as the primary genetic library for the five parasitic races.',
      rationale:
        'Parasites dismantled the Spirit Tree. It was the Source-light anchor of the original architecture, not their genetic library.'
    }
  ]
};

const questionsMeta = [
  {
    number: 1,
    question: 'What is the primary function of the mechanism known as Spirit Inversion?',
    hint: 'Focus on the structural alteration of energy flow and the containment of sovereign creators.'
  },
  {
    number: 2,
    question:
      'Which term describes the looping, simulated reality matrix that traps human awareness within a closed system?',
    hint: 'This term is a portmanteau of the words "continuous" and "soul".'
  },
  {
    number: 3,
    question: 'How does the parasitic network maintain the structural stability of the 3D prison?',
    hint: 'Consider the limitations of the parasites regarding original creation.'
  },
  {
    number: 4,
    question:
      'Where are the extracted Akashic fragments of Human Sols systematically archived and cataloged?',
    hint: 'The storage location is tied to a historical seat of terrestrial power.'
  },
  {
    number: 5,
    question: 'What function does the Amnesia Vortex serve within the solar transit band?',
    hint: 'This mechanism is the key to why souls forget their divine origins upon return.'
  },
  {
    number: 6,
    question: 'What is the true nature of materials perceived as solid matter, such as concrete and metal?',
    hint: 'Think about how the nervous system is tricked into seeing dead materials as permanent.'
  },
  {
    number: 7,
    question:
      'Which set of brainwave frequencies is primarily targeted by scalar weapons to induce confusion and despair?',
    hint: 'Consider the frequencies typically associated with sleep, relaxation, and deep subconscious states.'
  },
  {
    number: 8,
    question:
      'How are the concepts of physical distance and long-duration travel enforced within the simulation?',
    hint: 'The landscape is not fixed but is generated as one moves through it.'
  },
  {
    number: 9,
    question:
      'The original purpose of the Dome of Sheol was a recovery sanctuary, but it was inverted into what?',
    hint: 'Consider the transition from a place of light and healing to one of darkness and confinement.'
  },
  {
    number: 10,
    question: "What role does Saturn's A.I. hub play in the systemic grid inversion?",
    hint: 'Think about how the natural outward energy of the Spirit Tree was redirected.'
  },
  {
    number: 11,
    question: 'Which of the following is not a member of the Council of Parasitic Races?',
    hint: 'The council is an uneasy alliance of five named factions that co-manage the energy farm.'
  },
  {
    number: 12,
    question: 'What causes the solid walls of the simulation to bend and lose coherence in real time?',
    hint: 'It is a result of a specific frequency clash with the holographic projection.'
  },
  {
    number: 13,
    question: "What is the primary purpose of the Water Domes stage in the healing process?",
    hint: 'This stage utilizes the properties of sound and fluid to clear emotional trauma.'
  },
  {
    number: 14,
    question:
      'During sleep, how does the parasitic system prevent Human Sols from visiting their star families?',
    hint: 'Think about the use of delta waves and the creation of repetitive psychological constructs.'
  },
  {
    number: 15,
    question: 'What happens to the solar portal as the 3D overlay progressively fractures?',
    hint: "The portal's restoration is the antidote to the effects of the Amnesia Vortex."
  },
  {
    number: 16,
    question:
      'The Crystal Halls stage of restoration is specifically designed to achieve which of the following?',
    hint: 'This stage focuses on the realignment of the light body and the clearing of mental noise.'
  },
  {
    number: 17,
    question: 'What is the final outcome for Human Sols who complete the three-stage restoration process?',
    hint: 'The ultimate goal of the Council of 12 Suns is the restoration of complete sovereignty.'
  },
  {
    number: 18,
    question: "What is the defining characteristic of Human Sols in their original state?",
    hint: 'They represent the original, un-inverted creators of source energy.'
  },
  {
    number: 19,
    question: 'How does the Council of 12 Suns assist Human Sols who are not yet fully awakened?',
    hint: "Look for the role of specialized ground healers in the transition."
  },
  {
    number: 20,
    question: 'What occurs during the Star Pods stage of soul restoration?',
    hint: "This stage focuses on the integration of the soul's history across time."
  },
  {
    number: 21,
    question: 'Why are the parasitic races entirely dependent on siphoning the Human Sols?',
    hint: "Consider the difference between a sovereign creator and a parasite."
  },
  {
    number: 22,
    question: 'Which specific dome was weaponized to broadcast discordant frequency grids?',
    hint: 'This dome is associated with the active broadcast of discord.'
  },
  {
    number: 23,
    question: 'What is the function of seed codes carried by the Resonating Army?',
    hint: 'These codes are described as harmonic beacons for the planetary surface.'
  },
  {
    number: 24,
    question:
      "The 3D simulation uses hard-coded travel buffers to reinforce what belief in Human Sols?",
    hint: 'Think about the shape of the world that the parasites want humans to believe in.'
  },
  {
    number: 25,
    question: 'What was the role of the central Spirit Tree before it was severed by the parasites?',
    hint: "It was the central anchor of the original Great Dome's architecture."
  }
];

const QUIZ_DESC =
  'Test your understanding of Spirit Inversion — Human Sols bound in a fabricated 3D simulation, Consol, the Amnesia Vortex and Vatican archive, Saturn\'s energy valve, Resonating Army seed codes, Water Domes, Crystal Halls, Star Pods, and the sovereign choice after restoration.';

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
    'Test your grasp of Spirit Inversion — Human Sols bound in a fabricated 3D simulation, Consol, the Amnesia Vortex and Vatican archive, Saturn\'s energy valve, Resonating Army seed codes, Water Domes, Crystal Halls, Star Pods, and the sovereign choice after restoration.',
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'Spirit Inversion captures and vibrationally reverses Human Sols inside a fabricated 3D overlay powered by their own consciousness. Sit with Consol, the Amnesia Vortex and Vatican archive, Saturn\'s inward valve, the five-faction harvest, and the Resonating Army\'s seed codes that shatter the walls. After Water Domes, Crystal Halls, and Star Pods, sovereignty returns as an absolute choice: higher realms, or a clean cycle in the restored Known Lands. Return to the Spirit Inversion deep-dive, infographic, and video transmissions as those codes come online.'
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
  throw new Error('spirit-inversion not found in breakdown-topics.json');
}

const afterOthers = collectImageFields(mono.topics)
  .filter((e) => e.id !== TOPIC_ID)
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();
if (JSON.stringify(beforeOthers) !== JSON.stringify(afterOthers)) {
  throw new Error('Safety check failed: another topic image path was modified');
}

fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'healing-path.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Spirit Inversion: Human Sols bound in a fabricated 3D simulation, Consol, the Amnesia Vortex and Vatican archive, Saturn\'s energy valve, Resonating Army seed codes, Water Domes, Crystal Halls, Star Pods, and the sovereign choice after restoration.';
const replacements = [
  ['Healing Path Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Healing Path: Water Domes, Crystal Halls, and Star Pods under Saferon ground healers; Lyran giants; Spirit Tree restoration; loosh neutralization; and the sovereign choice after sanctuary stabilization.',
    desc
  ],
  ['quiz/breakdown/healing-path.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/healing-path.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=healing-path',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Healing Path deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['data/quizzes/breakdown/healing-path.json', `data/quizzes/${SOURCE}/${TOPIC_ID}.json`]
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 90));
  }
  html = html.split(a).join(b);
}

html = html.replace(/Healing Path/g, TOPIC_TITLE);
html = html
  .replace(/healing-path\.webp/g, 'spirit-inversion.webp')
  .replace(/healing-path\.json/g, 'spirit-inversion.json')
  .replace(/healing-path\.html/g, 'spirit-inversion.html')
  .replace(/topic=healing-path/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/healing-path.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/spirit-inversion.json'
);
