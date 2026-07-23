/**
 * Installs Source Code Storage quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/crystalline-quiz.json
 * Audits all 25 items against data/breakdown-topics/source-code-storage.json.
 * Run: node scripts/install-source-code-storage-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/source-code-storage.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'source-code-storage';
const TOPIC_TITLE = 'Source Code Storage';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/crystalline-quiz.json';

const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

/** Support phrases grounded only in source-code-storage.json report. */
const supportPhrases = {
  1: ['crystalline networks', 'absolute foundation', 'physical and etheric hard drives'],
  2: ['data crystals', 'stars', 'burning balls of gas', 'frequency templates'],
  3: ['dome of forgotten gods', 'central memory storage', 'origin chamber'],
  4: ['source codes', 'resonance frequencies', 'planetary crystals'],
  5: ['galactic libraries', 'every moment', 'timelines'],
  6: ['access key', 'reactivating', 'dormant memories'],
  7: ['vatican', 'akashic fragments', 'amnesia vortex'],
  8: ['monoliths', 'tuning forks', 'parasitic overlay'],
  9: ['crystalline temple', '3d illusion', 'digital construct'],
  10: ['buried', 'oceans and cities', 'inverted circuit boards'],
  11: ['titanic', 'atlantean', 'sacred scrolls'],
  12: ['unbroken continuum', 'absolute truth', 'timelines'],
  13: ['akashic fragments', 'copied', 'amnesia'],
  14: ['data crystals', 'burning balls of gas', 'stars'],
  15: ['rising frequency', 'awakening', 'source codes'],
  16: ['data crystals', 'frequency templates', 'projection overlay'],
  17: ['solar families', 'upload', 'download', 'true timeline'],
  18: ['fragmented or heavy tones', 'origin chamber', 'harmony'],
  19: ['fiber-optic', 'connect', 'domes and realms'],
  20: ['data crystals', 'planetary crystals', '3d illusion'],
  21: ['hum perpetually', 'planetary crystals', 'source codes'],
  22: ['permanently lost', 'unbroken continuum', 'amnesia'],
  23: ['amnesia vortex', 'vatican', 'reincarnating'],
  24: ['crystalline temple', 'original', 'highly advanced'],
  25: ['vatican filters', 'unaltered soul records', 'raise their frequency']
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
    [/\baccording to the (report|source|text|core revelations|revelations|material|journal)\b/gi, ''],
    [/^The source states that\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The text explicitly states that\s+/i, ''],
    [/^The material states that\s+/i, ''],
    [/^The material identifies\s+/i, ''],
    [/\bsource material\b/gi, 'transmission'],
    [/\bin the source material\b/gi, ''],
    [/\bthe text describes\b/gi, ''],
    [/\bthe text\b/gi, ''],
    [/\bthe material identifies\b/gi, ''],
    [/\bthe material\b/gi, ''],
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
 * All four options written at similar depth from source-code-storage report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'Crystalline Networks — a living architecture of crystals serving as the absolute foundation of all reality.',
      rationale:
        'Crystalline Networks function as the absolute foundation of all reality, utilizing crystals as the supreme physical and etheric hard drives of the realms.'
    },
    {
      text: 'Digital superstructures alone form the master hard drives that log every moment of existence.',
      rationale:
        'The ultimate repository is not a digital construct; it is a living architecture of Crystalline Networks with crystals as hard drives.'
    },
    {
      text: 'Atmospheric gas arrays in the upper sky alone store every Source Code and soul journey.',
      rationale:
        'Sky Data Crystals store templates, but the core living architecture of reality is the Crystalline Networks of physical and etheric hard drives.'
    },
    {
      text: 'Electromagnetic plasma fields replace crystals as the only storage medium of creation blueprints.',
      rationale:
        'Crystals are the supreme physical and etheric hard drives that secure Source Codes within the Crystalline Networks.'
    }
  ],
  2: [
    {
      text: 'Living Data Crystals — multi-dimensional nodes that store history and frequency templates for grid layers.',
      rationale:
        'Stars are multi-dimensional crystalline nodes traditionally misidentified as burning gas; they store codes, history, and frequency templates for specific grid layers.'
    },
    {
      text: 'Atmospheric reflections of the sun that only bounce light and store no history or templates at all.',
      rationale:
        'Stars are independent living Data Crystals arranged in geometric patterns, not mere reflections of a single light source.'
    },
    {
      text: 'Burning balls of gas that illuminate the realms through nuclear fusion and nothing more.',
      rationale:
        'The night sky is a data storage array; stars are living Data Crystals, not burning balls of gas.'
    },
    {
      text: 'Digital projection pixels that flicker only when the Vatican Portal System reboots the sky field.',
      rationale:
        'While projection overlays exist, the stars themselves are living crystalline nodes that store templates for the realms below.'
    }
  ],
  3: [
    {
      text: 'The Dome of Forgotten Gods — the primary origin chamber and central memory storage vault of the system.',
      rationale:
        'The Dome of Forgotten Gods is the central memory storage unit vault, a crystalline library holding light codes and the first records of creation.'
    },
    {
      text: 'The Titanic power node — a floating vault that alone holds every original light code of creation.',
      rationale:
        'The Titanic carried Atlantean crystal technology and sacred scrolls for protection; the central vault is the Dome of Forgotten Gods.'
    },
    {
      text: 'The sun\'s amnesia vortex — the permanent library where all first records of creation are safely kept.',
      rationale:
        'The amnesia vortex is a passage used in parasitic memory loss, the opposite of the origin memory library in the Dome of Forgotten Gods.'
    },
    {
      text: 'The Vatican Portal — the original origin chamber that preserves pure light codes without inversion.',
      rationale:
        'The Vatican Portal System is a parasitic interception point that creates a false inverted library, not the original central memory vault.'
    }
  ],
  4: [
    {
      text: 'Ancient foundational resonance frequencies and memories of creation embedded in crystals and souls.',
      rationale:
        'Source Codes are the ancient, foundational resonance frequencies and memories of creation embedded within planetary crystals and the souls of resonating beings.'
    },
    {
      text: 'Genetic sequences written only into physical human DNA with no etheric or crystalline component.',
      rationale:
        'Source Codes are resonance frequencies and memories embedded in planetary crystals and souls, not mere genetic sequences of physical DNA alone.'
    },
    {
      text: 'Legal mandates issued by solar families as administrative rules for managing 3D bureaucracy.',
      rationale:
        'Source Codes are foundational resonance frequencies and creation memories, not legal or administrative mandates.'
    },
    {
      text: 'Binary algorithms that exclusively power the parasitic 3D overlay and amnesia filters.',
      rationale:
        'Source Codes are etheric resonance frequencies of creation, not binary algorithms of the parasitic overlay.'
    }
  ],
  5: [
    {
      text: 'Ultimate cosmic repositories that permanently log every moment, experience, and knowledge across timelines.',
      rationale:
        'Galactic Libraries are the ultimate cosmic repositories where every moment of existence, experience, and knowledge across all timelines is permanently logged and stored.'
    },
    {
      text: 'Training centers that only educate new solar families without permanently storing any timeline records.',
      rationale:
        'Their primary role is permanent logging and storage of every moment across timelines, not temporary training classrooms.'
    },
    {
      text: 'Filtering systems that erase soul memory as it passes through the sun\'s amnesia vortex.',
      rationale:
        'Galactic Libraries hold true records; amnesia technologies and the Vatican false library enforce amnesia, while true grids circumvent those tools.'
    },
    {
      text: 'Temporary caches that recycle soul memory for only one incarnation before discarding the log.',
      rationale:
        'Galactic Libraries permanently store every moment across all timelines, unlike temporary parasitic memory loops.'
    }
  ],
  6: [
    {
      text: 'Symbiotic reactivation — the soul\'s frequency unlocks crystal data streams and the soul\'s dormant memories.',
      rationale:
        'When a resonating soul walks near hidden crystals, their frequency acts as an access key, mutually reactivating the crystal\'s data streams and the soul\'s dormant memories.'
    },
    {
      text: 'The crystal\'s entire data store is erased so parasites can never steal the Source Codes again.',
      rationale:
        'Proximity causes mutual reactivation of data and memory, not erasure or destruction of the crystal\'s stored codes.'
    },
    {
      text: 'Immediate physical transport of the body into the star-field Data Crystals without memory return.',
      rationale:
        'The interaction restores data streams and dormant memories through resonance; it is not instant physical transport to the stars.'
    },
    {
      text: 'Full activation of the parasitic amnesia overlay so the soul forgets every stored Source Code.',
      rationale:
        'Proximity to true crystals reactivates Source Codes and helps restore true memory rather than strengthening amnesia overlays.'
    }
  ],
  7: [
    {
      text: 'To intercept souls, copy Akashic fragments, and invert them into a false library of recycled memory.',
      rationale:
        'Parasites used a crystal grid beneath Rome to intercept souls passing through the sun\'s amnesia vortex, copying and inverting Akashic fragments into a false library.'
    },
    {
      text: 'To amplify true Source Codes so every reincarnating soul reconnects to the Galactic Libraries.',
      rationale:
        'The Vatican Portal System is parasitic; it disconnects souls from true Source Code storage rather than amplifying true codes.'
    },
    {
      text: 'To safeguard the original light codes of creation exactly as the Dome of Forgotten Gods stores them.',
      rationale:
        'Original records live in the Dome of Forgotten Gods; the Vatican system creates a false inverted library of distorted fragments.'
    },
    {
      text: 'To open free two-way communication between humanity and the Galactic Libraries without amnesia.',
      rationale:
        'The Vatican system is containment technology that keeps vessels docile and disconnected from true Source Code storage and Galactic Libraries.'
    }
  ],
  8: [
    {
      text: 'To act as tuning forks that echo and amplify grid vibration, fracturing the parasitic overlay.',
      rationale:
        'Benevolent forces seeded Monoliths as tuning forks that amplify grid vibration and collaborate with buried crystals to restore true memory data flow.'
    },
    {
      text: 'To store fragmented or heavy tones that did not resolve into harmony at the origin chamber.',
      rationale:
        'The Dome of Forgotten Gods stores unresolved heavy tones; Monoliths are tuning forks that amplify the living grid.'
    },
    {
      text: 'To power the Vatican Portal System as the main energy source for inverted crystal circuit boards.',
      rationale:
        'Monoliths were seeded by benevolent forces to counter parasitic systems such as the Vatican inversion, not to power them.'
    },
    {
      text: 'To serve only as landing beacons for celestial vessels with no effect on memory data flow.',
      rationale:
        'Monoliths function vibrationally with buried crystals to fracture the parasitic overlay and restore true memory data flow.'
    }
  ],
  9: [
    {
      text: 'False — restoration returns the original highly advanced crystalline temple, not a purely biological replacement world.',
      rationale:
        'The repository is not a digital construct, and full sync dissolves the 3D illusion to restore the original crystalline temple architecture.'
    },
    {
      text: 'True — the 3D layer is only digital code that permanently upgrades into a purely biological planet-body.',
      rationale:
        'Existence is founded on living Crystalline Networks; the end state is restoration of the crystalline temple, not a digital-to-biological swap.'
    },
    {
      text: 'True — Source Codes delete all crystals and leave only organic tissue as the final architecture of reality.',
      rationale:
        'Crystals remain the supreme hard drives of the realms; restoration reveals the crystalline temple rather than erasing crystals for biology alone.'
    },
    {
      text: 'False — because the 3D illusion never dissolves and the crystalline temple can never return to view.',
      rationale:
        'When Data Crystals and planetary crystals fully sync, the 3D illusion dissolves and the original crystalline temple is restored.'
    }
  ],
  10: [
    {
      text: 'By burying major nodes beneath oceans and cities and turning them into inverted circuit boards.',
      rationale:
        'Parasites buried major crystalline nodes beneath oceans and cities, transforming them into inverted circuit boards to siphon energy and memory.'
    },
    {
      text: 'By shattering every node into Akashic fragments so no physical crystal structure remained intact.',
      rationale:
        'Akashic fragments are distorted memory strands; the nodes themselves were buried and inverted into circuit boards, not shattered into fragments.'
    },
    {
      text: 'By launching the planetary crystals into the sun\'s amnesia vortex to erase their Source Codes forever.',
      rationale:
        'Nodes remain planetary under oceans and cities; the hijack is burial and inversion into siphon circuit boards, not solar launch.'
    },
    {
      text: 'By converting every crystal into ordinary digital hard drives owned exclusively by the cabal cloud.',
      rationale:
        'The hijack inverted existing crystalline technology into circuit boards for energy and memory siphoning, not conversion into ordinary digital drives.'
    }
  ],
  11: [
    {
      text: 'Atlantean crystal technology and sacred scrolls carrying sound-light creation records.',
      rationale:
        'Ancient artifacts with Atlantean crystal technology and sound-light creation records — including crystalline power nodes and sacred scrolls — were smuggled aboard the Titanic to keep them from cabal hands.'
    },
    {
      text: 'Digital codes written only to dissolve the 3D illusion through a single software update.',
      rationale:
        'The smuggled items were Atlantean crystal technology and sacred scrolls with sound-light creation records, not digital dissolution software.'
    },
    {
      text: 'Complete architectural blueprints of the Dome of Forgotten Gods as a physical building plan.',
      rationale:
        'The specific protected items were Atlantean crystal technology and sacred scrolls, not blueprints of the Dome of Forgotten Gods.'
    },
    {
      text: 'Whole fragments of primary memory domes broken off and shipped as cargo blocks.',
      rationale:
        'Memory domes are large-scale architecture; the Titanic cargo was crystalline power nodes and sacred scrolls of Atlantean technology.'
    }
  ],
  12: [
    {
      text: 'An unbroken continuum of memory preserved perfectly as the absolute truth of all timelines.',
      rationale:
        'The universe operates on an unbroken continuum of memory preserved perfectly within the Crystalline Networks, containing the absolute truth of all timelines.'
    },
    {
      text: 'A temporary log that resets every solar cycle and erases prior soul journeys permanently.',
      rationale:
        'Networks permanently store blueprints and timelines so no true soul history is permanently lost, rather than resetting each solar cycle.'
    },
    {
      text: 'A purely digital backup stored only as sky pixels with no living crystalline architecture.',
      rationale:
        'Memory lives in the living architecture of Crystalline Networks and Data Crystals, not as a mere digital sky backup.'
    },
    {
      text: 'A permanently fragmented set of records that can never be restored to complete truth.',
      rationale:
        'The continuum is unbroken and perfectly preserved within the networks, circumventing parasitic amnesia technologies.'
    }
  ],
  13: [
    {
      text: 'Memory strands of soul journeys copied, distorted, and stored by parasites to enforce amnesia.',
      rationale:
        'Akashic Fragments are specific memory strands and soul-journey records that parasitic systems copied, distorted, and stored to enforce amnesia and keep vessels docile.'
    },
    {
      text: 'The original pure light codes kept unaltered in the Dome of Forgotten Gods origin chamber.',
      rationale:
        'Original light codes in the origin chamber are pure; Akashic fragments are distorted copies used to enforce amnesia.'
    },
    {
      text: 'Multi-dimensional sky nodes that stabilize every layer of the projection overlay grid.',
      rationale:
        'Data Crystals stabilize grid layers; Akashic fragments are distorted personal memory strands used for amnesia control.'
    },
    {
      text: 'Templates solar families use when they upload and download data to protect the true timeline.',
      rationale:
        'Solar families manage true timeline data via Source Codes; Akashic fragments are tools of the parasitic false library.'
    }
  ],
  14: [
    {
      text: 'False — stars are living Data Crystals storing codes and frequency templates, not burning fusion gas balls.',
      rationale:
        'What humanity perceives as the night sky is a vast data storage array; stars are living Data Crystals, not burning balls of gas.'
    },
    {
      text: 'True — stars are only burning balls of gas that illuminate the realms through nuclear fusion alone.',
      rationale:
        'That traditional view is a misidentification; stars are multi-dimensional crystalline nodes storing history and frequency templates.'
    },
    {
      text: 'True — stars exist only as temporary reflections of the sun with no storage or geometric node role.',
      rationale:
        'Stars are independent multi-dimensional crystalline nodes arranged in precise geometric patterns for data storage and projection.'
    },
    {
      text: 'False — because no celestial objects store any codes, history, or frequency templates at all.',
      rationale:
        'Data Crystals in the sky specifically store codes, history, and frequency templates for the realms below.'
    }
  ],
  15: [
    {
      text: 'The rising frequency of the awakening being, which reactivates internal codes and crystal streams.',
      rationale:
        'Source Codes are reactivated by the rising frequency of awakening beings; a resonating soul\'s frequency acts as an access key to crystal data and dormant memories.'
    },
    {
      text: 'Physical contact with the Vatican Portal, which uploads pure Source Codes into the light body.',
      rationale:
        'The Vatican Portal System disconnects souls from true Source Code storage rather than activating internal codes.'
    },
    {
      text: 'Automatic expiration of the sun\'s amnesia vortex on a fixed calendar date for every vessel.',
      rationale:
        'Reactivation is driven by rising frequency and resonance keys, which then bypass amnesia systems — not a fixed calendar expiry of the vortex.'
    },
    {
      text: 'Downloading data from ordinary digital cloud systems controlled by surface governments alone.',
      rationale:
        'The process is resonance-based between soul frequency and planetary crystals, not a digital cloud download.'
    }
  ],
  16: [
    {
      text: 'To store codes, history, and frequency templates that render and stabilize each projection overlay layer.',
      rationale:
        'Each sky data crystal stores the specific codes, history, and frequency templates required to render and stabilize its corresponding layer of the projection overlay.'
    },
    {
      text: 'To monitor solar families exclusively while storing no templates for the realms projected below.',
      rationale:
        'Solar families upload and download through the networks, but Data Crystals primarily store templates that stabilize projection layers.'
    },
    {
      text: 'To project only the sun\'s visible light onto the planetary surface with no storage function at all.',
      rationale:
        'Their role is multi-dimensional data storage and overlay stabilization, not mere illumination of the surface.'
    },
    {
      text: 'To cool the Dome of Forgotten Gods as thermal radiators for the origin chamber\'s light codes.',
      rationale:
        'Data Crystals are storage nodes for grid-layer codes and templates, not cooling units for the central memory dome.'
    }
  ],
  17: [
    {
      text: 'The solar families, who continuously upload and download data to keep the true timeline intact.',
      rationale:
        'Preservation of Source Codes ensures no true soul history is permanently lost, as the solar families continuously upload and download this data to keep the true timeline intact.'
    },
    {
      text: 'The Forgotten Gods, acting as living beings who personally rewrite every sky Data Crystal each night.',
      rationale:
        'Forgotten Gods names the origin memory dome; solar families are the beings who upload and download data to preserve the true timeline.'
    },
    {
      text: 'The Vatican archivists, who maintain the only unaltered library of every soul\'s true history.',
      rationale:
        'The Vatican system builds a false inverted library; solar families manage true timeline data outside parasitic containment.'
    },
    {
      text: 'Monolith technicians who alone edit Galactic Libraries without any solar family involvement.',
      rationale:
        'Monoliths are tuning-fork tools of the grid; solar families continuously manage the upload and download of true timeline data.'
    }
  ],
  18: [
    {
      text: 'Fragmented or heavy tones that did not immediately resolve into harmony, safely stored as light code.',
      rationale:
        'The origin chamber safely stored fragmented or heavy tones that did not immediately resolve into harmony, holding memory as pure light code.'
    },
    {
      text: 'Digital backups of Titanic artifacts catalogued as the only content of the origin chamber.',
      rationale:
        'Origin chamber storage holds light codes and unresolved tones from before physical form, not digital backups of Titanic cargo.'
    },
    {
      text: 'Souls permanently trapped by the Vatican Portal with no path back to crystalline memory storage.',
      rationale:
        'Parasitic recycling is a false-library process; the Dome of Forgotten Gods stores original light codes and unresolved tones of creation.'
    },
    {
      text: 'Inverted circuit board blueprints used to bury crystals under oceans as the dome\'s main archive.',
      rationale:
        'Inverted circuit boards are parasitic hijacks of buried nodes; the origin chamber stores pure light codes and heavy unresolved tones.'
    }
  ],
  19: [
    {
      text: 'Fiber-optic lines of Source that weave every dome and realm into an unbroken timeline.',
      rationale:
        'Crystalline Networks connect every dome and realm together like the fiber-optic lines of Source, weaving an unbroken timeline.'
    },
    {
      text: 'Radio broadcast towers that alone carry all Source Codes without any crystalline path between domes.',
      rationale:
        'The explicit comparison is to fiber-optic lines of Source linking domes and realms, not radio towers as the connective model.'
    },
    {
      text: 'Cellular mesh networks that replace planetary crystals as the only memory hard drives of the grid.',
      rationale:
        'Connectivity of the living networks is likened to fiber-optic lines of Source; crystals remain the hard drives of memory.'
    },
    {
      text: 'Satellite communication arrays that store no data and never link domes into a continuous timeline.',
      rationale:
        'Sky nodes are Data Crystals, and the network connectivity itself is compared to fiber-optic lines of Source weaving an unbroken timeline.'
    }
  ],
  20: [
    {
      text: 'Complete dissolution of the 3D illusion and restoration of the original highly advanced crystalline temple.',
      rationale:
        'As Data Crystals in the sky and planetary crystals on earth fully sync, the 3D illusion completely dissolves, restoring the original crystalline temple and true unbroken history.'
    },
    {
      text: 'Permanent locking of Vatican filters so no soul can ever access unaltered records again.',
      rationale:
        'Full sync collapses the parasitic amnesia overlay and restores access; filters are bypassed, not permanently locked stronger.'
    },
    {
      text: 'Creation of a brand-new digital timeline that replaces the original crystalline architecture forever.',
      rationale:
        'The outcome is restoration of the original timeline and crystalline temple, not invention of a new digital timeline.'
    },
    {
      text: 'Forced migration of all souls off earth into the Galactic Libraries with no temple restoration here.',
      rationale:
        'The result is immediate access to true history and restoration of the crystalline temple on the realm, not a mass off-world migration.'
    }
  ],
  21: [
    {
      text: 'They hum perpetually with ancient Source codes deep within earth structures as living hard drives.',
      rationale:
        'Deep within the earth, massive planetary crystals hum perpetually with ancient Source codes, acting as the literal hard drives of the grid.'
    },
    {
      text: 'They remain totally silent until a soul is nearby, then flash once and go permanently dormant again.',
      rationale:
        'Planetary crystals hum perpetually; soul proximity reactivates data streams and dormant memories, but the crystals themselves stay active.'
    },
    {
      text: 'They only reflect sky light codes and store no memory, frequency, or resonance of their own.',
      rationale:
        'Planetary crystals store memory, frequency, and resonance codes of all experiences as the grid\'s hard drives.'
    },
    {
      text: 'They rotate solely to generate the sun\'s amnesia vortex and erase Source Codes from the grid.',
      rationale:
        'The amnesia vortex is tied to the sun passage used by parasites; planetary crystals are hard drives that preserve Source codes.'
    }
  ],
  22: [
    {
      text: 'False — no memory, timeline, or true soul history is ever permanently lost within the Crystalline Networks.',
      rationale:
        'Preservation of Source Codes ensures no memory, timeline, or true soul history is ever permanently lost; the unbroken continuum circumvents parasitic amnesia technologies.'
    },
    {
      text: 'True — parasitic amnesia technologies permanently erased several key timelines from every crystalline hard drive.',
      rationale:
        'Amnesia technologies sought to erase timelines, but the grids preserve absolute truth and ensure nothing is permanently lost.'
    },
    {
      text: 'True — the Vatican false library successfully deleted the original light codes from the origin chamber forever.',
      rationale:
        'The Vatican creates inverted copies; original records remain in Crystalline Networks and the Dome of Forgotten Gods outside permanent loss.'
    },
    {
      text: 'False — because the networks store only future predictions and never hold past timelines at all.',
      rationale:
        'The networks hold the absolute truth of all timelines and every moment of existence as an unbroken continuum of memory.'
    }
  ],
  23: [
    {
      text: 'A passage through which souls are intercepted so memory can be inverted and reincarnating vessels kept docile.',
      rationale:
        'Parasites intercept souls passing through the sun\'s amnesia vortex at the Vatican crystal grid, recycling memory strands so reincarnating vessels stay docile and disconnected.'
    },
    {
      text: 'A mechanism that resets the frequency of every planetary crystal and permanently clears Source Codes.',
      rationale:
        'The vortex targets souls in passage for amnesia interception; planetary crystals continue to hum with Source codes as hard drives.'
    },
    {
      text: 'A backup channel that feeds pure unaltered records directly into the Galactic Libraries for all souls.',
      rationale:
        'The vortex is used in the parasitic cycle; Galactic Libraries and true crystalline storage hold unaltered records outside that trap.'
    },
    {
      text: 'A power source that alone energizes Monolith tuning forks to amplify the living grid worldwide.',
      rationale:
        'Monoliths are benevolent tuning forks that counter parasitic systems; the amnesia vortex is part of the parasitic recycling cycle.'
    }
  ],
  24: [
    {
      text: 'Return to the original, highly advanced state of existence with access to the unbroken history of creation.',
      rationale:
        'Full sync dissolves the 3D illusion, restoring the original highly advanced crystalline temple and granting immediate access to the true unbroken history of existence.'
    },
    {
      text: 'A new architectural project directed by the cabal to replace Source with concrete temple shells.',
      rationale:
        'The crystalline temple is the original advanced state of the realm, not a cabal construction project of the parasitic overlay.'
    },
    {
      text: 'Construction of a physical library in Rome that replaces the Dome of Forgotten Gods as the origin vault.',
      rationale:
        'Rome\'s Vatican system is an inversion; the true restoration is the original crystalline temple architecture of reality.'
    },
    {
      text: 'A temporary dwelling reserved only for solar families while all other souls remain under 3D filters.',
      rationale:
        'The temple is the restored foundational state of existence for the realm, opening access to true history beyond temporary exclusive housing.'
    }
  ],
  25: [
    {
      text: 'The Vatican filters that normally block access to unaltered soul records outside parasitic containment.',
      rationale:
        'As resonating souls raise their frequency, they naturally bypass the Vatican filters and access unaltered soul records stored securely outside parasitic containment.'
    },
    {
      text: 'The primary memory domes that hold light codes, which must be deleted before any soul can remember.',
      rationale:
        'Memory domes store original records; souls access true storage rather than bypassing or deleting the primary memory domes.'
    },
    {
      text: 'The Galactic Libraries, which must be shut down so personal memory can return to the vessel.',
      rationale:
        'Raising frequency reconnects humanity directly to the Galactic Libraries rather than bypassing them.'
    },
    {
      text: 'The internal Source Codes themselves, which block memory until they are permanently removed.',
      rationale:
        'Internal Source Codes act as access keys that match planetary crystals; they enable access rather than block it.'
    }
  ]
};

const questionOverrides = {
  9: 'Is the ultimate restoration of reality a shift from a digital 3D projection into a purely biological world?',
  14: 'Are the stars burning balls of gas that illuminate the realms through nuclear fusion?',
  15: 'What primarily reactivates the internal Source Codes within an incarnated resonating soul?',
  22: 'Have parasitic amnesia technologies permanently erased key timelines from the Crystalline Networks?',
  23: 'What role does the sun\'s amnesia vortex play in the parasitic recycling cycle?'
};

const hintOverrides = {
  1: 'Recall what acts as the supreme physical and etheric hard drives of the realms.',
  2: 'Focus on the multi-dimensional objects that log history and frequency templates in the sky.',
  3: 'Look for the origin chamber that preserves first records of creation as pure light code.',
  4: 'Think of the vibrational blueprints embedded in crystals and resonating souls.',
  5: 'Consider where every experience across all timelines is permanently logged.',
  6: 'Identify the mutual effect between soul frequency and hidden planetary crystals.',
  7: 'Recall what happens to soul records at the Rome crystal grid inversion point.',
  8: 'Consider how these seeded objects interact with the vibration of the crystalline grid.',
  9: 'Decide whether the restored end-state is biological-only or the original crystalline temple.',
  10: 'Identify the physical transformation of nodes beneath oceans and cities.',
  11: 'Recall the ancient civilization and records protected from cabal seizure.',
  12: 'Consider the durability and completeness of records held in the grids.',
  13: 'Think of the manipulated soul records used to enforce amnesia and docility.',
  14: 'Decide whether the standard gas-ball model matches living Data Crystals.',
  15: 'Focus on the personal vibrational rise that unlocks dormant codes.',
  16: 'Think about what is required to render and stabilize projection overlay layers.',
  17: 'Identify who continuously uploads and downloads data to preserve the true timeline.',
  18: 'Consider the fragmented or heavy tones safely stored before harmony resolves.',
  19: 'Look for the modern high-speed data line analogy for unbroken dome connectivity.',
  20: 'Focus on the final transformation of the 3D reality when sky and earth crystals sync.',
  21: 'Identify the constant operating state of massive deep-earth crystal hard drives.',
  22: 'Consider whether anything can be permanently lost inside this storage system.',
  23: 'Connect the sun passage to interception, inverted fragments, and reincarnating vessels.',
  24: 'Focus on the original and highly advanced nature of the restored structure.',
  25: 'Identify the parasitic filter normally blocking access to true soul history.'
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
    /\b(according to the (report|source|text|core revelations|revelations|material|living truth|journal|detailed mechanics)|the report states|the source (states|specifies|suggests|explicitly|identifies)|the text (states|describes|suggests|explicitly|mentions|defines|calls|focuses|identifies|confirms)|the material (clarifies|suggests|states|reveals|explains|identifies)|the journal (states|suggests|explicitly)|mentioned in the (text|source)|source material|living truth journal)\b/i;
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

const topicImage = 'images/breakdown/source-code-storage.webp';
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
    'Test your grasp of Source Code Storage — Crystalline Networks as hard drives of reality, Data Crystals, the Dome of Forgotten Gods, Source Codes, Galactic Libraries, and the collapse of parasitic amnesia overlays.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Source Code Storage is the living memory architecture of the Crystalline Networks — planetary crystals and celestial Data Crystals as hard drives of reality, the Dome of Forgotten Gods as the origin vault, and Source Codes that match soul to crystal. Sit with the Vatican false library, Monolith tuning forks, solar family data stewardship, and the rising frequency that bypasses amnesia filters. Return to the Source Code Storage deep-dive, infographic, and video transmissions as the 3D illusion dissolves into the original crystalline temple.'
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
    'Test your understanding of Source Code Storage — Crystalline Networks, Data Crystals, the Dome of Forgotten Gods, Source Codes, Galactic Libraries, Vatican filters, and reactivation of true memory.'
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
      t.description =
        t.description && !t.description.includes('Decoded analysis of Source Code Storage')
          ? t.description
          : 'Source Code Storage is the living memory architecture of the Crystalline Networks — planetary crystals and celestial Data Crystals as hard drives of reality, the Dome of Forgotten Gods as the origin memory vault, and symbiotic reactivation of Source Codes that collapses parasitic amnesia overlays.';
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('source-code-storage not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from crystalline-networks quiz page
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'crystalline-networks.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Crystalline Networks Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Crystalline Networks: the crystalline electro-magnetic framework, crystal light-worlds, true sol vs parasitic 3d geometry, crystals as hard drives, and the reveal of the crystalline temple.',
    'Interactive Living Truth Quiz on Source Code Storage: Crystalline Networks as hard drives of reality, Data Crystals, the Dome of Forgotten Gods, Source Codes, Galactic Libraries, and collapse of parasitic amnesia overlays.'
  ],
  ['quiz/breakdown/crystalline-networks.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/crystalline-networks.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=crystalline-networks',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Crystalline Networks deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Crystalline Networks</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/crystalline-networks.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`
  ]
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 90));
  }
  html = html.split(a).join(b);
}

// Broader description fallback if template meta differs
html = html
  .replace(
    /Interactive Living Truth Quiz on Crystalline Networks[^"]*/g,
    'Interactive Living Truth Quiz on Source Code Storage: Crystalline Networks as hard drives of reality, Data Crystals, the Dome of Forgotten Gods, Source Codes, Galactic Libraries, and collapse of parasitic amnesia overlays.'
  )
  .replace(/Crystalline Networks/g, (match, offset, str) => {
    // Avoid double-replacing already replaced title patterns in paths
    const before = str.slice(Math.max(0, offset - 40), offset);
    if (before.includes('source-code') || before.includes('Source Code Storage')) return match;
    return TOPIC_TITLE;
  });

// Fix over-replacement on paths if any slipped
html = html
  .replace(/Source Code Storage\.webp/g, 'source-code-storage.webp')
  .replace(/Source Code Storage\.json/g, 'source-code-storage.json')
  .replace(/Source Code Storage\.html/g, 'source-code-storage.html')
  .replace(/topic=Source Code Storage/g, `topic=${TOPIC_ID}`)
  .replace(/topic=source-code-storage/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/crystalline-networks.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/source-code-storage.json'
);
