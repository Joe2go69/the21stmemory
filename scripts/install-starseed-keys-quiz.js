/**
 * Installs Starseed Keys quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/starseed-quiz.json
 * Audits all 25 items against data/breakdown-topics/starseed-keys.json.
 * Run: node scripts/install-starseed-keys-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/starseed-keys.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'starseed-keys';
const TOPIC_TITLE = 'Starseed Keys';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/starseed-quiz.json';

const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

/** Support phrases grounded only in starseed-keys.json report. */
const supportPhrases = {
  1: ['dormant activators', 'pure frequency and memory'],
  2: ['crystalline network', 'fiber optics of source', 'domes and realms'],
  3: ['harmonic resonance', 'not triggered by physical', 'vibrational'],
  4: ['monoliths', 'tuning forks', 'mirroring and echoing'],
  5: ['resonance codes', 'souls of awakened beings', 'planetary crystals'],
  6: ['parasitic overlay', 'dead stone, dirt, and concrete', 'false holographical'],
  7: ['harmonic lenses', 'illusion web', 'nodes'],
  8: ['starseed families', 'failsafe', 'off-world'],
  9: ['shimmer and bend', 'dissolving', 'glitches and fractures'],
  10: ['quartz veins', 'mountains', 'antennas'],
  11: ['lyran lineage'],
  12: ['harmonic travel', 'telepathic connection', 'illusion of distance'],
  13: ['never be permanently lost', 'failsafe', 'memory'],
  14: ['galactic libraries', 'recording every moment', 'memory banks'],
  15: ['cube containment', 'unaltered solar records'],
  16: ['physical and etheric', 'hidden crystals'],
  17: ['resonating army', 'elevated frequency', 'activated'],
  18: ['unaltered solar records', 'vatican memory archives', 'cube containment'],
  19: ['not built by humans', 'tuning forks', 'monoliths'],
  20: ['split the parasitic overlay', 'frequency wave'],
  21: ['dead concrete, dirt, or ruins', 'walk over'],
  22: ['reconnects the fractured timelines', 'continuous hum'],
  23: ['unbroken timeline of soul journeys', 'memory codes of source'],
  24: ['seamlessly transition', 'vibrant reality', 'original realm'],
  25: ['true architecture of the great dome', 'crystalline network']
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
    [/^According to the (core revelations|source|report|text|revelations|material|detailed mechanics|journal),?\s*/i, ''],
    [/^According to the report,?\s*/i, ''],
    [/^According to the text,?\s*/i, ''],
    [/^According to the material,?\s*/i, ''],
    [/\baccording to the (report|source|text|core revelations|revelations|material|journal|detailed mechanics)\b/gi, ''],
    [/^The source (material )?states that\s+/i, ''],
    [/^The text (explicitly )?states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The material (identifies|states that)\s+/i, ''],
    [/\bin the source material\b/gi, ''],
    [/\bthe source material (states|identifies)\b/gi, ''],
    [/\bthe text (explicitly )?states\b/gi, ''],
    [/\bmentioned in the (text|source|report)\b/gi, ''],
    [/\bin the context of the [Ss]ource( material)?\b/gi, ''],
    [/\bsource material\b/gi, 'transmission'],
    [/\bthe text\b/gi, ''],
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
 * All four options written at similar depth from starseed-keys report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'To serve as dormant activators holding pure frequency and memory for the Crystalline Network.',
      rationale:
        'Starseed Keys are designed to hold pure frequency and memory and act as dormant activators waiting for the precise vibrational match to trigger within the architecture of the Great Dome.'
    },
    {
      text: 'To act as permanent physical anchors that power and protect the hijacked Vatican memory archives.',
      rationale:
        'The keys bypass the hijacked Vatican memory archives and draw upload data from unaltered solar records outside the Cube Containment, rather than anchoring those archives.'
    },
    {
      text: 'To harvest solar energy exclusively for reinforcing the false 3D density construction materials.',
      rationale:
        'The keys belong to the original living crystalline architecture and help collapse 3D density constructs, not reinforce them with harvested solar energy.'
    },
    {
      text: 'To generate and maintain the holographic projection that paints the Known Lands as dead stone.',
      rationale:
        'The holographic projection is a function of the Parasitic Overlay; the Starseed Keys are intended to fracture and collapse that false field.'
    }
  ],
  2: [
    {
      text: 'The Crystalline Network — the living electro-magnetic framework linking domes like fiber optics of Source.',
      rationale:
        'The Crystalline Network is the underlying electro-magnetic framework of living light structures, crystals, and harmonic lenses that connects all domes and realms together like fiber optics of Source.'
    },
    {
      text: 'The Parasitic Overlay — a true Source lattice that openly joins every dome without any illusion layer.',
      rationale:
        'The Parasitic Overlay is a false holographical projection that masks true architecture; it does not connect domes as fiber optics of Source.'
    },
    {
      text: 'The 3D Construction Grid — concrete scaffolding that permanently replaces all living crystal pathways.',
      rationale:
        '3D construction materials are part of the dissolving illusion; the living connector is the Crystalline Network, not concrete scaffolding.'
    },
    {
      text: 'The Cube Containment — a sealed wall that forbids any light web from bridging realms or solar families.',
      rationale:
        'Cube Containment is the boundary solar records sit outside of; the connecting light web is the Crystalline Network of fiber-optic Source lines.'
    }
  ],
  3: [
    {
      text: 'Through exact harmonic resonance when soul frequency matches the codes held inside the keys.',
      rationale:
        'The keys are not triggered by physical manipulation but through exact harmonic resonance; as beings raise frequency, their Resonance Codes collaborate with the crystal keys automatically.'
    },
    {
      text: 'Through precise physical manipulation of quartz veins, mountains, and natural surface outcrops alone.',
      rationale:
        'Activation is vibrational and automatic rather than mechanical; surface crystals act as antennas, but keys themselves are not switched by physical handling.'
    },
    {
      text: 'By logging into the Vatican memory archives and issuing a command from the hijacked record system.',
      rationale:
        'Activation bypasses the hijacked Vatican memory archives and draws from unaltered solar records; it is harmonic, not archive-commanded.'
    },
    {
      text: 'Only when positive ET fleets physically enter the overlay and flip every crystal by hand.',
      rationale:
        'Positive ET fleets wait outside the overlay, but activation is internal resonance between soul codes and Starseed Keys, not manual ET switching.'
    }
  ],
  4: [
    {
      text: 'They act as tuning forks that mirror, echo, and boost the vibration of the Starseed Keys.',
      rationale:
        'Monoliths are advanced tuning-fork technologies embedded as backups to the Starseed Keys, mirroring and echoing vibration to boost crystalline-grid signals to amplitude that can split the Parasitic Overlay.'
    },
    {
      text: 'They serve as communication towers built to broadcast parasitic commands across modern cities.',
      rationale:
        'Monoliths are positive backup structures for the original crystalline grid, not parasitic command towers.'
    },
    {
      text: 'They generate the illusion that makes living crystals look like ordinary dirt and concrete.',
      rationale:
        'That perception manipulation belongs to the Parasitic Overlay; Monoliths amplify true crystal vibration rather than create the illusion.'
    },
    {
      text: 'They function as the primary hard drives that store every soul-journey memory for the realm.',
      rationale:
        'Starseed Keys serve as the central memory banks and physical-etheric hard drives; Monoliths are tuning-fork backups that boost signals.'
    }
  ],
  5: [
    {
      text: 'Within the souls of awakened beings, matching the same codes held in the planetary crystals.',
      rationale:
        'Resonance Codes are ancient harmonic frequencies embedded simultaneously within both the planetary crystals and the souls of awakened beings, ensuring an exact vibrational match for grid activation.'
    },
    {
      text: 'Only in the soil and concrete of modern cities where no conscious being ever carries a match.',
      rationale:
        'Crystals may be buried under cities, but Resonance Codes also live in awakened souls so their frequency can match the keys.'
    },
    {
      text: 'Only inside amnesia technology archives designed to preserve and freely broadcast those codes.',
      rationale:
        'Amnesia tech attempts to suppress history and knowledge the keys preserve; Resonance Codes are in crystals and awakened souls, not amnesia archives.'
    },
    {
      text: 'Exclusively inside 3D density constructs that dissolve before any code can ever activate a key.',
      rationale:
        '3D constructs are part of the illusion the codes help dissolve; the matching codes sit in planetary crystals and awakened souls.'
    }
  ],
  6: [
    {
      text: 'To mask the true living crystal architecture with a false 3D illusion of dead stone and dirt.',
      rationale:
        'The Parasitic Overlay is a false holographical projection that masks the true living crystal architecture, making the environment appear as dead stone, dirt, and concrete.'
    },
    {
      text: 'To store the unbroken timeline of soul journeys safely for the Resonating Army alone.',
      rationale:
        'Soul-journey data is stored in the Starseed Keys as memory banks; the overlay tries to hide that true architecture rather than store it.'
    },
    {
      text: 'To connect different realms using the fiber optic lines of Source across every dome.',
      rationale:
        'That connectivity is the function of the Crystalline Network and Starseed Keys, not the Parasitic Overlay.'
    },
    {
      text: 'To act as a loyal backup system for original Lyran Lineage architecture and memory codes.',
      rationale:
        'The overlay is parasitic interference; Monoliths and Starseed Keys are the Lyran-aligned backups and activators, not the overlay.'
    }
  ],
  7: [
    {
      text: 'Sacred crystalline-grid components that parasites painted over with an illusion web grid.',
      rationale:
        'Parasitic forces painted over sacred Harmonic Lenses and nodes with an illusion web grid so people walk over humming crystal architecture while only seeing dead concrete, dirt, or ruins.'
    },
    {
      text: 'Tuning forks humans built to activate Monoliths by striking them with physical tools.',
      rationale:
        'Monoliths themselves act as the tuning forks and are not built by humans; Harmonic Lenses are sacred grid components painted over by the illusion web.'
    },
    {
      text: 'Hand-held devices the Resonating Army uses only to read the Vatican memory archives.',
      rationale:
        'The Resonating Army activates keys by frequency and bypasses Vatican archives; Harmonic Lenses are part of the crystalline world, not archive readers.'
    },
    {
      text: 'Artificial satellites that alone maintain the Great Dome without any planetary crystal role.',
      rationale:
        'Harmonic Lenses belong to the organic planetary crystalline architecture buried under illusion, not to artificial satellite maintenance.'
    }
  ],
  8: [
    {
      text: 'Off-world Starseed Families who seeded the keys across the Known Lands in antiquity.',
      rationale:
        'Starseed Keys were planted as a failsafe by off-world families and seeded across the Known Lands by Starseed Families long before the current cycles of amnesia.'
    },
    {
      text: 'Modern human architects who poured concrete cities directly onto every crystal key site.',
      rationale:
        'The keys were seeded in antiquity by Starseed Families; modern cities are part of the burial and masking layer, not the planting group.'
    },
    {
      text: 'The Resonating Army of this cycle, who placed new keys after the Parasitic Overlay began.',
      rationale:
        'The Resonating Army activates keys with elevated frequency; the keys were placed by Starseed Families in antiquity as a failsafe.'
    },
    {
      text: 'The custodians of the Vatican archives, who embedded crystals to lock memory permanently.',
      rationale:
        'Vatican memory archives are hijacked systems the keys bypass; Starseed Families planted the keys so true memory could never be permanently lost.'
    }
  ],
  9: [
    {
      text: 'They glitch, shimmer, and bend, then dissolve as the Parasitic Overlay fractures and falls.',
      rationale:
        'As key frequency rises, the Parasitic Overlay glitches and fractures; the environment shimmers and bends, eventually dropping the false sky and dissolving 3D construction materials.'
    },
    {
      text: 'They are carefully absorbed into the Vatican memory archives as permanent sealed records.',
      rationale:
        '3D constructs are stripped away as illusion, not archived; keys bypass Vatican archives rather than feed them new density materials.'
    },
    {
      text: 'They are reinforced by Monolith vibrations until concrete becomes permanently unbreakable.',
      rationale:
        'Monoliths reinforce the crystalline grid and help split the Parasitic Overlay, which causes 3D materials to dissolve rather than solidify.'
    },
    {
      text: 'They become permanently solidified so the false sky and density constructs never change.',
      rationale:
        'Rising frequency causes the holographical projection to glitch and dissolve rather than permanently solidify 3D density.'
    }
  ],
  10: [
    {
      text: 'They act as massive antennas that catch and broadcast Resonance Codes across the grid.',
      rationale:
        'Surface crystals—including quartz veins, mountains, and natural outcrops—serve as massive antennas that catch and broadcast the codes interacting with Starseed Keys.'
    },
    {
      text: 'They supply raw ore so humans can forge brand-new Monoliths during the event cycles.',
      rationale:
        'Monoliths are pre-embedded advanced tech not built by humans; surface crystals function as antennas, not Monolith mining stock.'
    },
    {
      text: 'They are the primary generators of amnesia technology that erase all soul-journey memory.',
      rationale:
        'Amnesia tech tries to suppress the history crystals preserve; quartz veins and mountains serve as antennas for Resonance Codes.'
    },
    {
      text: 'They function as permanent shields that keep the Parasitic Overlay sealed forever above them.',
      rationale:
        'The overlay masks these features, but the features themselves are positive crystalline antennas of the living grid, not overlay shields.'
    }
  ],
  11: [
    {
      text: 'The Lyran Lineage — original architecture whose activation cuts straight through 3D construction.',
      rationale:
        'Because the Starseed Keys are part of the original Lyran Lineage architecture, their activation cuts straight through 3D construction and reconnects fractured timelines.'
    },
    {
      text: 'The Great Dome Foundation — a modern concrete guild that poured every crystal after amnesia.',
      rationale:
        'The keys predate current amnesia cycles and belong to Lyran Lineage architecture, not a modern concrete foundation guild.'
    },
    {
      text: 'The Solar Collective — a name for the Parasitic Overlay that built the false sky materials.',
      rationale:
        'Solar families oversee the Great Awakening outside the overlay; the specific architectural lineage of the keys is Lyran.'
    },
    {
      text: 'The Galactic Librarian Guild — archivists who store keys only as paper records, never crystals.',
      rationale:
        'Galactic Libraries receive logged existence data from the crystal memory banks; the keys themselves are Lyran crystalline architecture.'
    }
  ],
  12: [
    {
      text: 'Restoration of immediate harmonic travel and full telepathic connection with solar families.',
      rationale:
        'The activated Crystalline Network strips away the illusion of distance and separation, restoring immediate harmonic travel and full telepathic connection with the solar families overseeing the Great Awakening.'
    },
    {
      text: 'Permanent closure of every inter-dome bridge so no realm can ever exchange light again.',
      rationale:
        'Starseed Keys connect all domes, realms, and inner simulations; activation restores connection rather than closing bridges.'
    },
    {
      text: 'Creation of new slow 3D travel routes that still depend on concrete roads and false distance.',
      rationale:
        '3D travel and artificial distance dissolve with the overlay; the restored state is immediate harmonic travel, not new dense routes.'
    },
    {
      text: 'Forced reactivation of the Vatican memory archives as the only allowed communication channel.',
      rationale:
        'Activation bypasses hijacked Vatican archives and restores direct telepathic connection with solar families outside the Cube Containment.'
    }
  ],
  13: [
    {
      text: 'To guarantee that true memory and function of the Known Lands could never be permanently lost.',
      rationale:
        'The Starseed Keys were planted as a failsafe by off-world families to guarantee that the true memory and function of the Known Lands would never be permanently lost.'
    },
    {
      text: 'To act only as physical trail markers for future human cities with no memory role at all.',
      rationale:
        'They are vibrational activators and memory hard drives of the grid, not mere trail markers for 3D civilizations.'
    },
    {
      text: 'To manufacture the physical atmosphere of the Great Dome from condensed stone and dirt.',
      rationale:
        'They are physical and etheric components of the Crystalline Network architecture, not atmospheric generators made of stone.'
    },
    {
      text: 'To hand parasitic forces a complete map so absolute control of the grid would never fail.',
      rationale:
        'Starseed Families planted the keys so parasitic amnesia and control could not permanently erase true memory and function.'
    }
  ],
  14: [
    {
      text: 'They record every moment of existence and log that history into the Galactic Libraries.',
      rationale:
        'The crystals act as the central memory banks of the realm, recording every moment of existence and logging it into Galactic Libraries while preserving soul-journey memory amnesia tech tries to suppress.'
    },
    {
      text: 'They download the hijacked Vatican archives into the libraries as the only allowed history.',
      rationale:
        'The keys bypass Vatican archives and draw from unaltered solar records; they log true existence into Galactic Libraries rather than Vatican copies.'
    },
    {
      text: 'They act as solid shields that hide the Galactic Libraries so no soul can ever access them.',
      rationale:
        'The keys are data storage and transmission nodes of the grid, not shields that hide the Galactic Libraries.'
    },
    {
      text: 'They take orders from the libraries to keep the Parasitic Overlay stable and fully opaque.',
      rationale:
        'The keys work to collapse the Parasitic Overlay; Galactic Libraries receive the data the crystal memory banks record.'
    }
  ],
  15: [
    {
      text: 'The parasitic boundary outside which unaltered solar records still hold pure upload data.',
      rationale:
        'Activating keys draw direct upload data from the unaltered solar records outside the Cube Containment, bypassing hijacked Vatican memory archives.'
    },
    {
      text: 'A protective crystal shield grown only to encase each Starseed Key against all resonance.',
      rationale:
        'Cube Containment is the field solar records sit outside of; the keys help bypass containment rather than hide inside a crystal shield.'
    },
    {
      text: 'The physical cube shape of every Monolith tuning fork embedded across the Known Lands.',
      rationale:
        'Monoliths are tuning-fork backups within the realm; Cube Containment names the boundary outside which unaltered solar records remain.'
    },
    {
      text: 'The original harmonic structure of the Great Dome before any crystalline network existed.',
      rationale:
        'The original true architecture is the Crystalline Network that the keys restore; Cube Containment is the limit outside which solar records remain unaltered.'
    }
  ],
  16: [
    {
      text: 'False — they are vital physical and etheric components seeded as hidden crystals across the lands.',
      rationale:
        'Starseed Keys are ancient hidden crystals and vital physical and etheric components of the Crystalline Network, not purely etheric without physical presence.'
    },
    {
      text: 'True — they exist only as thought-forms with no crystal body anywhere in the Known Lands.',
      rationale:
        'They are hidden placed crystals with both physical and etheric presence across the Known Lands, not thought-forms alone.'
    },
    {
      text: 'True — they appear only inside Vatican archives as digital files with no landscape presence.',
      rationale:
        'The keys are seeded across the Known Lands as crystals and bypass Vatican archives; they are not archive-only digital files.'
    },
    {
      text: 'False — because they are made only of modern concrete poured after the cycles of amnesia.',
      rationale:
        'They predate current amnesia cycles as ancient crystals; concrete is part of the masking illusion, not the substance of the keys.'
    }
  ],
  17: [
    {
      text: 'Beings whose elevated frequency systematically activates the keys and collapses the overlay.',
      rationale:
        'Starseed Keys are being systematically activated by the elevated frequency and vibration of the Resonating Army, initiating total collapse of the Parasitic Overlay.'
    },
    {
      text: 'The permanent keepers who expand and defend the hijacked Vatican memory archive system.',
      rationale:
        'The Resonating Army works with key activation that bypasses Vatican archives; they are not keepers of those hijacked records.'
    },
    {
      text: 'A mechanical digging force built only to excavate every crystal and ship it off-world.',
      rationale:
        'Activation is vibrational and automatic through Resonance Codes, not a mechanical excavation crew of the Resonating Army.'
    },
    {
      text: 'The original architects of the false holographical projection field and illusion web grid.',
      rationale:
        'The Parasitic Overlay is parasitic interference; the Resonating Army’s elevated frequency activates keys to collapse that field.'
    }
  ],
  18: [
    {
      text: 'Pure Source memory the keys access outside Cube Containment, bypassing hijacked Vatican archives.',
      rationale:
        'The continuous hum of activating keys reconnects fractured timelines, bypassing hijacked Vatican memory archives and drawing direct upload data from unaltered solar records outside the Cube Containment.'
    },
    {
      text: 'Logs of amnesia cycles written only by Starseed Families and stored under modern concrete.',
      rationale:
        'Unaltered solar records are pristine Source memory outside Cube Containment, not merely amnesia-cycle logs buried under concrete.'
    },
    {
      text: 'Blueprints the parasites used to design and permanently stabilize the Parasitic Overlay field.',
      rationale:
        'The overlay is a false projection; unaltered solar records are the pure truth the keys access to restore original structure.'
    },
    {
      text: 'Paper manuals stored only inside Monolith hollows with no link to solar families or Source.',
      rationale:
        'Monoliths boost crystal signals as tuning forks; unaltered solar records sit outside Cube Containment and feed true upload data through the keys.'
    }
  ],
  19: [
    {
      text: 'False — Monoliths are advanced embedded tuning-fork tech and are not built by humans.',
      rationale:
        'To ensure required amplitude, Monoliths were embedded as advanced backup tech; these structures are not built by humans but designed as tuning forks mirroring Starseed Key vibration.'
    },
    {
      text: 'True — human engineers poured and wired every Monolith after the cycles of amnesia began.',
      rationale:
        'Monoliths are advanced backup tech embedded in the realm and not built by humans; they are tuning forks of the crystalline restoration system.'
    },
    {
      text: 'True — Monoliths are ordinary radio towers humans raised to replace all surface crystal antennas.',
      rationale:
        'Monoliths mirror and echo Starseed Key vibration as non-human backup tech; surface crystals remain the massive antennas of the grid.'
    },
    {
      text: 'False — because Monoliths do not exist and only Vatican servers amplify grid frequency waves.',
      rationale:
        'Monoliths are real embedded tuning-fork backups that boost crystal signals until the frequency wave can split the Parasitic Overlay.'
    }
  ],
  20: [
    {
      text: 'It becomes powerful enough to literally split the Parasitic Overlay across the realm.',
      rationale:
        'When the Crystalline Network reverberates, Monoliths boost crystal signals, creating a frequency wave powerful enough to literally split the Parasitic Overlay.'
    },
    {
      text: 'It solidifies 3D materials like concrete and dirt so the false sky can never drop again.',
      rationale:
        'The combined wave helps dissolve and fracture 3D construction materials rather than solidify them permanently.'
    },
    {
      text: 'It buries the Crystalline Network deeper under oceans, deserts, and modern city layers.',
      rationale:
        'The wave reveals and restores the network by splitting the overlay that masks it, not by burying crystals further.'
    },
    {
      text: 'It starts a brand-new amnesia cycle that wipes Galactic Library memory of soul journeys.',
      rationale:
        'The frequency wave ends parasitic masking and restores true memory rather than launching a new amnesia cycle.'
    }
  ],
  21: [
    {
      text: 'It makes people walk over humming keys while only seeing dead concrete, dirt, or ruins.',
      rationale:
        'The overlay manipulates human perception so individuals walk over ancient humming crystal keys daily while only seeing and feeling dead concrete, dirt, or ruins.'
    },
    {
      text: 'It highlights every key as a bright sacred shrine that no one could possibly overlook.',
      rationale:
        'Parasites bury and paint over the grid with illusion so keys look mundane and dead, not brightly highlighted shrines.'
    },
    {
      text: 'It renders every crystal completely invisible and intangible so feet never touch anything.',
      rationale:
        'Keys remain walkable as seemingly dead objects; the overlay masks their living nature as dirt, concrete, or ruins rather than full intangibility.'
    },
    {
      text: 'It displays them as advanced futuristic machines so the population worships the overlay.',
      rationale:
        'The overlay’s goal is a dead, mundane environment of stone, dirt, and concrete, not futuristic machine appearances.'
    }
  ],
  22: [
    {
      text: 'It reconnects the fractured timelines while drawing truth from unaltered solar records.',
      rationale:
        'The continuous hum of the activating keys reconnects the fractured timelines, bypassing hijacked Vatican memory archives and drawing direct upload data from unaltered solar records outside the Cube Containment.'
    },
    {
      text: 'It archives those timelines permanently inside the Vatican so no reconnection can occur.',
      rationale:
        'The keys bypass Vatican control over memory and timelines; the hum reconnects fractured timelines rather than locking them in archives.'
    },
    {
      text: 'It separates timelines further so each dome loses all shared history forever.',
      rationale:
        'Activation restores connection and memory; the continuous hum reconnects fractured timelines instead of fragmenting them further.'
    },
    {
      text: 'It deletes all timelines to free space for permanent 3D density construction materials.',
      rationale:
        'The keys dissolve 3D density constructs and restore original harmonic structure; they do not delete timelines to preserve density.'
    }
  ],
  23: [
    {
      text: 'False — they store the unbroken timeline of soul journeys and pristine Source memory codes for the realm.',
      rationale:
        'The crystals function as physical and etheric hard drives storing the unbroken timeline of soul journeys and the pristine memory codes of Source, not only Lyran individuals.'
    },
    {
      text: 'True — only Lyran-lineage individuals have any memory recorded inside any Starseed Key crystal.',
      rationale:
        'Although the architecture is Lyran Lineage, the keys store soul-journey timelines and Source memory codes for the realm’s existence, not a single-lineage-only archive.'
    },
    {
      text: 'True — non-Lyran souls are written only into Vatican archives and never into crystalline hard drives.',
      rationale:
        'Starseed Keys log existence into Galactic Libraries and hold soul-journey memory amnesia tech tries to suppress; storage is not limited to Lyran-only records.'
    },
    {
      text: 'False — because the keys store no memory at all and only amplify empty sound without data.',
      rationale:
        'They are central memory banks recording every moment of existence; they are not empty amplifiers without stored data.'
    }
  ],
  24: [
    {
      text: 'A seamless transition into the pure, vibrant reality of the original realm with frequency anchors.',
      rationale:
        'For the Resonating Army, the keys provide necessary frequency anchors to seamlessly transition into the pure, vibrant reality of the original realm as the Crystalline Network fully activates.'
    },
    {
      text: 'A forced relocation into a brand-new simulation dome that replaces the original realm forever.',
      rationale:
        'The goal is restoration of the original realm’s vibrant reality, not transfer into a new simulation dome.'
    },
    {
      text: 'The permanent loss of all form so no vibrant physical or crystalline reality remains at all.',
      rationale:
        'The transition is into pure vibrant reality of the original realm, not into non-existence or total loss of form.'
    },
    {
      text: 'A political takeover of the Vatican memory archives as the army’s final communication hub.',
      rationale:
        'The Resonating Army bypasses those archives for direct solar-family connection; the outcome is original-realm transition, not Vatican takeover.'
    }
  ],
  25: [
    {
      text: 'The Crystalline Network — the vast living framework of which the Starseed Keys are vital components.',
      rationale:
        'Starseed Keys are vital physical and etheric components of the vast Crystalline Network that forms the true architecture of the Great Dome.'
    },
    {
      text: 'Modern city foundations of concrete and steel that permanently replace every living crystal path.',
      rationale:
        'Modern cities are burial and masking layers over the crystalline world; true architecture is the Crystalline Network, not concrete foundations.'
    },
    {
      text: 'The Parasitic Overlay alone, as a false holographical field claimed to be the dome’s real bones.',
      rationale:
        'The overlay is a false holographical projection masking true living crystal architecture; the true architecture is the Crystalline Network.'
    },
    {
      text: 'The Galactic Libraries only, which store data but form no living light framework of the dome.',
      rationale:
        'Galactic Libraries receive logged existence data; the dome’s true architecture is the Crystalline Network the keys activate and restore.'
    }
  ]
};

const questionOverrides = {
  7: 'What are Harmonic Lenses in the crystalline world the Parasitic Overlay tries to hide?',
  15: 'What is Cube Containment relative to the unaltered solar records the keys access?',
  16: 'Are the Starseed Keys purely etheric with no physical presence in the Known Lands?',
  19: 'Were Monoliths constructed by humans to help the grid reach activation amplitude?',
  23: 'Do the Starseed Keys only store memory for individuals of the Lyran Lineage?',
  25: 'What constitutes the true architecture of the Great Dome?'
};

const hintOverrides = {
  1: 'Picture dormant crystals waiting for a precise vibrational match.',
  2: 'Name the living electro-magnetic web that links domes like Source fiber optics.',
  3: 'Activation is vibrational rather than mechanical or archive-commanded.',
  4: 'These backups mirror pitch like tuning forks for the main keys.',
  5: 'The same codes live in crystals and in awakened souls.',
  6: 'Focus on how living crystal is made to look dead and mundane.',
  7: 'Sacred grid components painted over by an illusion web.',
  8: 'Who seeded the failsafe long before current amnesia cycles?',
  9: 'Higher vibration hits a false lower-density projection.',
  10: 'Natural outcrops catch and transmit frequency like antennas.',
  11: 'The original architectural lineage that cuts through 3D construction.',
  12: 'What returns when distance and separation are revealed as illusion?',
  13: 'This was a strategic failsafe so memory could never be erased forever.',
  14: 'Local crystal hard drives feed a universal library of existence.',
  15: 'Solar records sit outside a parasitic boundary the keys can bypass.',
  16: 'Hidden crystals carry both physical and etheric roles.',
  17: 'This group is defined by elevated frequency interacting with the keys.',
  18: 'Pure records outside containment versus hijacked archives inside.',
  19: 'Check whether these tuning forks are human-built hardware.',
  20: 'A boosted combined wave meets a brittle holographic projection.',
  21: 'People walk over humming keys while seeing only dead matter.',
  22: 'The restorative hum acts on history and temporal integrity.',
  23: 'Memory banks cover soul journeys and Source codes for the realm.',
  24: 'Frequency anchors carry the army into original vibrant reality.',
  25: 'The vast living network of which the keys are vital components.'
};

const questions = raw.questions.map((q) => {
  const set = fullOptionSets[q.number];
  if (!set || set.length !== 4) {
    throw new Error(`Q${q.number}: missing fullOptionSets with 4 options`);
  }

  const options = set.map((o, i) => ({
    label: ['A', 'B', 'C', 'D'][i],
    text: cleanText(o.text),
    isCorrect: i === 0,
    rationale: absoluteVoice(cleanText(o.rationale))
  }));

  let question = cleanText(q.question);
  let hint = cleanText(q.hint);
  if (questionOverrides[q.number]) question = questionOverrides[q.number];
  else question = absoluteVoice(question);
  if (hintOverrides[q.number]) hint = hintOverrides[q.number];
  else hint = absoluteVoice(hint);

  const finalized = finalizeOptions(
    options.map(({ text, isCorrect, rationale }) => ({ text, isCorrect, rationale })),
    `${TOPIC_ID}-${q.number}`
  );

  const out = {
    number: q.number,
    question,
    options: finalized.options,
    hint,
    correctAnswer: finalized.correctAnswer
  };

  const blob = [
    out.question,
    out.hint,
    ...out.options.map((o) => `${o.text} ${o.rationale}`)
  ].join('\n');
  if (latexRe.test(blob) || /\$/.test(blob)) {
    throw new Error(
      `Q${q.number}: LaTeX/$ markup found: ${blob.match(/\$[^$]*\$|\$/)?.[0]}`
    );
  }
  const metaVoiceRe =
    /\b(according to the (report|source|text|core revelations|revelations|material|living truth|journal|detailed mechanics)|the report states|the source (states|specifies|suggests|explicitly|identifies)|the text (states|describes|suggests|explicitly|mentions|defines|calls|focuses|identifies|confirms|emphasizes|points)|the material (clarifies|suggests|states|reveals|explains|identifies)|the journal (states|suggests|explicitly)|mentioned in the (text|source)|source material|living truth journal)\b/i;
  if (metaVoiceRe.test(blob)) {
    throw new Error(
      `Q${q.number}: meta/report voice still present: ${blob.match(metaVoiceRe)?.[0]}`
    );
  }

  const phrases = supportPhrases[q.number] || [];
  const missing = phrases.filter((p) => !reportLower.includes(p.toLowerCase()));
  if (missing.length) {
    throw new Error(
      `Q${q.number}: report does not support phrases: ${missing.join('; ')}`
    );
  }

  const correct = out.options.find((o) => o.isCorrect);
  const claim = `${correct.text} ${correct.rationale}`.toLowerCase();
  const claimTokens = (claim.match(/[a-z0-9%]{5,}/g) || []).filter(
    (t, i, a) => a.indexOf(t) === i
  );
  const hitRate =
    claimTokens.filter((t) => reportLower.includes(t)).length /
    Math.max(claimTokens.length, 1);
  if (hitRate < 0.35) {
    throw new Error(
      `Q${q.number}: correct claim poorly grounded in report (hitRate=${hitRate.toFixed(2)})`
    );
  }

  if (out.options.length !== 4) {
    throw new Error(`Q${q.number}: need 4 options, got ${out.options.length}`);
  }
  if (out.options.filter((o) => o.isCorrect).length !== 1) {
    throw new Error(`Q${q.number}: need exactly 1 correct`);
  }
  for (const o of out.options) {
    if (!o.rationale || o.rationale.length < 20) {
      throw new Error(`Q${q.number}${o.label}: short rationale`);
    }
    if (!o.text || o.text.length < 40) {
      throw new Error(`Q${q.number}${o.label}: option text too short for length balance`);
    }
    if (/^(true|false)$/i.test(o.text.trim())) {
      throw new Error(`Q${q.number}${o.label}: bare True/False option not expanded`);
    }
  }
  return out;
});

if (questions.length !== 25) {
  throw new Error(`Expected 25 questions, got ${questions.length}`);
}

function recountLetters(qs) {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of qs) counts[q.correctAnswer] = (counts[q.correctAnswer] || 0) + 1;
  return counts;
}

function rebalanceCorrectLetters(qs) {
  const order = ['A', 'B', 'C', 'D'];
  for (let pass = 0; pass < 40; pass++) {
    const counts = recountLetters(qs);
    const minL = order.reduce((a, b) => (counts[a] <= counts[b] ? a : b));
    const maxL = order.reduce((a, b) => (counts[a] >= counts[b] ? a : b));
    if (counts[minL] >= 4 && counts[maxL] <= 9) break;
    const donor = qs.find((q) => q.correctAnswer === maxL);
    if (!donor) break;
    const from = donor.options.find((o) => o.isCorrect);
    const to = donor.options.find((o) => o.label === minL);
    if (!from || !to || from === to) break;
    const tmp = { text: from.text, rationale: from.rationale };
    from.text = to.text;
    from.rationale = to.rationale;
    from.isCorrect = false;
    to.text = tmp.text;
    to.rationale = tmp.rationale;
    to.isCorrect = true;
    donor.correctAnswer = minL;
  }
  return recountLetters(qs);
}

const letterCounts = rebalanceCorrectLetters(questions);
const maxLetter = Math.max(...Object.values(letterCounts));
const minLetter = Math.min(...Object.values(letterCounts));
if (maxLetter >= 15 || minLetter < 2) {
  throw new Error(`Correct answers too skewed: ${JSON.stringify(letterCounts)}`);
}

const topicImage = 'images/breakdown/starseed-keys.webp';
if (!fs.existsSync(path.join(ROOT, topicImage))) {
  throw new Error(`Missing topic image: ${topicImage}`);
}

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle:
    'Test your grasp of Starseed Keys — hidden crystalline activators, Resonance Codes, Monolith tuning forks, Parasitic Overlay collapse, and the Crystalline Network restoring original realm travel and telepathy.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Starseed Keys are ancient hidden crystals seeded by Starseed Families as failsafe memory hard drives of the Crystalline Network. Sit with Resonance Codes shared between planetary crystals and awakened souls, Monoliths as non-human tuning-fork backups, surface crystals as antennas, and the elevated frequency of the Resonating Army splitting the Parasitic Overlay so immediate harmonic travel and solar-family telepathy return in the original vibrant realm.'
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
  description:
    'Test your understanding of Starseed Keys — dormant crystalline activators, Resonance Codes, Monolith backups, Parasitic Overlay collapse, Lyran architecture, and transition into the original vibrant realm.'
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
      if (!t.description || t.description.includes('Decoded analysis of Starseed Keys')) {
        t.description =
          'Starseed Keys are ancient hidden crystals seeded across the Known Lands by Starseed Families — dormant activators of the Crystalline Network, triggered by Resonance Codes in awakened souls to collapse the Parasitic Overlay and restore the original harmonic realm.';
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('starseed-keys not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from ley-line-optics quiz page (sibling under Crystalline Networks)
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'ley-line-optics.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Starseed Keys: dormant crystalline activators, Resonance Codes, Monolith tuning forks, Parasitic Overlay collapse, and restoration of original-realm harmonic travel.';
const replacements = [
  ['Ley Line Optics Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Ley Line Optics: organic fibre optic lines of Source, Nodes and Harmonic Lenses, Seven Overlay-Bands, Sub-Crystalline Band, and fracture of the parasitic overlay.',
    desc
  ],
  ['quiz/breakdown/ley-line-optics.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/ley-line-optics.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=ley-line-optics',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Ley Line Optics deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Ley Line Optics</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/ley-line-optics.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`
  ]
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 90));
  }
  html = html.split(a).join(b);
}

html = html
  .replace(/Interactive Living Truth Quiz on Ley Line Optics[^"]*/g, desc)
  .replace(/Ley Line Optics/g, TOPIC_TITLE);

// Fix over-replacement on paths if any slipped
html = html
  .replace(/Starseed Keys\.webp/g, 'starseed-keys.webp')
  .replace(/Starseed Keys\.json/g, 'starseed-keys.json')
  .replace(/Starseed Keys\.html/g, 'starseed-keys.html')
  .replace(/topic=Starseed Keys/g, `topic=${TOPIC_ID}`)
  .replace(/topic=starseed-keys/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/ley-line-optics.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/starseed-keys.json'
);
