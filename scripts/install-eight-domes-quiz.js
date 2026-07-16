/**
 * Installs Eight Domes quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/cube-system-quiz.json
 * Audits all 25 items against data/breakdown-topics/eight-domes.json.
 * Run: node scripts/install-eight-domes-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/eight-domes.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'eight-domes';
const TOPIC_TITLE = 'Eight Domes';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/cube-system-quiz.json';

const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

/** Support phrases grounded only in eight-domes.json report. */
const supportPhrases = {
  1: ['cube system', 'digitally simulated', 'master hard drive'],
  2: ['spirit tree', 'source light', 'seven outer domes'],
  3: ['frequency shift', 'personal vibration', 'physical distance'],
  4: ['dome of sheol', 'healing and rest', 'recalibrate'],
  5: ['black cube technology', 'frequency valve', 'siphoned inward'],
  6: ['maps and globes', 'perception overlays', 'illusion of separation'],
  7: ['great dome', '178', 'training ground'],
  8: ['12 suns', 'living portals', 'pillars of resonance'],
  9: ['dome of hiva', '5g', 'haarp', 'weaponized frequency'],
  10: ['time buffers', 'long flights', 'physical distances'],
  11: ['dome of 5 peaks', 'five elements', 'earth, water, fire, air'],
  12: ['dome of titans', 'fractured zone of war', '69 worlds'],
  13: ['crystalline networks', 'bypass parasitic travel corridors'],
  14: ['dome of forgotten gods', 'root tone', 'origin chamber'],
  15: ['dome of portals', 'reincarnation loops', 'vatican portal'],
  16: ['rising resonance', 'awakened souls', 'fracturing'],
  17: ['density', 'resistance', 'mastery of tone'],
  18: ['dome of silence', 'stillness', 'source without distraction'],
  19: ['not separated by physical space', 'interwoven', 'single console'],
  20: ['seven gardens', 'seven outer domes', 'blooming'],
  21: ['council of 12 suns', 'distribute light', 'stewardship'],
  22: ['myths and false gods', 'amnesia zones', 'true memory'],
  23: ['imagination hardens into structure', 'great dome'],
  24: ['spirit tree', 'lighting up', '3d projection'],
  25: ['cube containment', 'frequency server', 'maps, overlays, grids']
};

function cleanText(s) {
  let t = String(s || '');
  t = t.replace(/\$3\\text\{D\}\$/g, '3D');
  t = t.replace(/\$3\\mathrm\{D\}\$/g, '3D');
  t = t.replace(/\$(\d+(?:\.\d+)?)\$/g, '$1');
  t = t.replace(/\$(\d+)%\$/g, '$1%');
  t = t.replace(/\$([^$]+)\$/g, (_, inner) =>
    inner
      .replace(/\\text\{([^}]*)\}/g, '$1')
      .replace(/\\mathrm\{([^}]*)\}/g, '$1')
      .replace(/\\[a-zA-Z]+/g, '')
      .replace(/[{}]/g, '')
  );
  t = t.replace(/\\\(|\\\)|\\\[|\\\]/g, '');
  t = t.replace(/\\text\{([^}]*)\}/g, '$1');
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

function absoluteVoice(s) {
  let t = String(s || '');
  const rewrites = [
    [/^According to the source,?\s*/i, ''],
    [/^According to the report,?\s*/i, ''],
    [/^According to the text,?\s*/i, ''],
    [/^According to the Living Truth Journal,?\s*/i, ''],
    [/\baccording to the Living Truth Journal\b/gi, ''],
    [/\baccording to the Strategic Implications\b/gi, ''],
    [/\baccording to the (report|source|text)\b/gi, ''],
    [/^The source states that\s+/i, ''],
    [/^The source specifies that\s+/i, ''],
    [/^The source suggests that\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The text suggests that\s+/i, ''],
    [/^The text mentions\s+/i, ''],
    [/^The text focuses on\s+/i, ''],
    [/^The text explicitly states that\s+/i, ''],
    [/^The material clarifies that\s+/i, ''],
    [/^The strategic implications state that\s+/i, ''],
    [/\bThe strategic implications state that\b/gi, ''],
    [/\bThe source explicitly states that\b/gi, ''],
    [/\bthe source explicitly states that\b/gi, ''],
    [/\bmentioned in the source material\b/gi, ''],
    [/\bmentioned in the text\b/gi, ''],
    [/\bsource material\b/gi, 'transmission'],
    [/\bin the source material\b/gi, ''],
    [/\bthe source specifies that\b/gi, ''],
    [
      /Recall the transparent sheet analogy mentioned in the core revelations\./i,
      'Recall that the domes stack like transparent frequency sheets within one console.'
    ],
    [
      /Look at the status of the Spirit Tree's roots in the final section\./i,
      'Recall that the roots of the Spirit Tree are lighting up once again.'
    ],
    [
      /Consider if the current visual models of the world support or hide the 'Cube System' truth\./i,
      'Consider whether maps hide the Cube System by enforcing separation and distance.'
    ]
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
 * Full option sets for questions that need rewrite: short labels, T/F pairs,
 * or wording not tightly grounded in the Eight Domes report.
 * Each entry is [correct, wrong, wrong, wrong] with {text, rationale}.
 */
const fullOptionSets = {
  1: [
    {
      text: 'The Cube System: a unified digitally simulated architecture acting as a master hard drive of layered frequencies.',
      rationale:
        'Reality is not scattered planets but The Cube System — a supreme master hard drive and interwoven matrix of thousands of frequency layers.'
    },
    {
      text: 'A void containing 178 separate physical dimensions floating independently in empty outer space.',
      rationale:
        'The 178 worlds sit inside The Great Dome within The Cube System; they are not the architecture of all reality itself.'
    },
    {
      text: 'A series of independent biological ecosystems with no shared electromagnetic framework linking them.',
      rationale:
        'Biological life exists inside the domes, but the underlying architecture is a crystalline electromagnetic Cube framework.'
    },
    {
      text: 'A scattered collection of physical planets and stars separated by vast astronomical distances.',
      rationale:
        'Reality is not a scattered collection of planets or continents; it is a unified simulated architecture inside The Cube System.'
    }
  ],
  2: [
    {
      text: 'The Spirit Tree — the central crystalline axis and trunk that fed Source light into the seven outer domes.',
      rationale:
        'The Spirit Tree at the center of The Great Dome pumped pure Source light and harmonic currents into the seven outer domes.'
    },
    {
      text: 'The Dome of 5 Peaks — the ascension arena where the five elements were mastered into living structure.',
      rationale:
        'Dome of 5 Peaks trained elemental mastery and ascension; it was not the central trunk feeding the outer domes.'
    },
    {
      text: 'The Council of 12 Suns — living portals that distribute stewardship light across every simulation layer.',
      rationale:
        'The twelve suns are living portals and pillars of resonance, not the crystalline trunk that fed the outer domes.'
    },
    {
      text: 'The Vatican portal system — restricted entry points installed to manage reincarnation and inter-dome travel.',
      rationale:
        'Vatican portals are inverted restricted entry points from the hijacked Dome of Portals, not the original light trunk.'
    }
  ],
  3: [
    {
      text: 'Frequency Shift — altering personal vibration so a new environmental projection renders without physical distance.',
      rationale:
        'Realms are stacked frequency bands; travel is Frequency Shift by changing vibration, not crossing physical distance.'
    },
    {
      text: 'Navigating through 5G synthetic grids that open fixed corridors between continents and inner-earth layers.',
      rationale:
        '5G and synthetic grids are parasitic inversions of Dome of Hiva harmonics used for control, not true Cube travel.'
    },
    {
      text: 'Traversing vast physical distances with high-speed transport across oceans, continents, and dome borders.',
      rationale:
        'Physical distance is an illusion of the 3D overlay; true movement between layers is vibrational, not spatial.'
    },
    {
      text: 'Utilizing artificial time loops on long flights and sea voyages to physically cross the globe step by step.',
      rationale:
        'Time buffers are programmed loops that convince the mind of distance; they are not the true method of travel.'
    }
  ],
  4: [
    {
      text: 'A healing and rest sanctuary where souls recalibrated between incarnations without distortion.',
      rationale:
        'Dome of Sheol was originally a healing and rest dome — a recovery sanctuary for recalibration between incarnations.'
    },
    {
      text: 'A grand travel hub of crystalline gates and vortexes for navigating between different dome worlds.',
      rationale:
        'That travel-hub role belongs to the Dome of Portals, not to Sheol’s original healing function.'
    },
    {
      text: 'A prison realm of shadows that trapped souls in trauma frequencies labeled as Hell or purgatory.',
      rationale:
        'The prison of trauma frequencies is the parasitic inversion of Sheol, not its original purpose.'
    },
    {
      text: 'A memory vault holding the first thoughts of light, sound, and the records of early creation.',
      rationale:
        'That memory-vault role belongs to the Dome of Forgotten Gods, not to the original Dome of Sheol.'
    }
  ],
  5: [
    {
      text: 'Advanced black cube technology installed as a frequency valve that reversed and siphoned the energy flow.',
      rationale:
        'Parasitic architects severed the Spirit Tree and installed black cube technology — a frequency valve siphoning energy inward.'
    },
    {
      text: 'The crystalline electromagnetic framework of The Cube Containment itself rewired to favor outer-dome bloom.',
      rationale:
        'The Cube Containment is the master framework; the reverse-flow hijack used black cube valve technology, not the Cube itself.'
    },
    {
      text: 'The creation of The Great Dome as a denser arena that automatically pulled light away from the outer gardens.',
      rationale:
        'The Great Dome was the original heart holding the Spirit Tree; inversion came from black cube technology, not dome creation.'
    },
    {
      text: 'The activation of the Council of 12 Suns to reassign stewardship light away from the Spirit Tree trunk.',
      rationale:
        'The twelve suns distribute light and stewardship; they are not the mechanism that reversed Spirit Tree flow.'
    }
  ],
  6: [
    {
      text: 'Maps and globes are perception overlays that enforce the illusion of separation and distance, not accurate physical models.',
      rationale:
        'Maps and globes are perception overlays; continents, oceans, and skies are overlapping frequency fields, not true separated geography.'
    },
    {
      text: 'Maps and globes accurately chart solid continents and oceans as permanent physical geography across real distance.',
      rationale:
        'Those charts enforce separation and distance; true environments are layered frequency fields within The Cube System.'
    },
    {
      text: 'Maps are pure crystalline blueprints that reveal every dome gate and Spirit Tree root to ordinary human sight.',
      rationale:
        'Human maps hide the Cube architecture; they do not reveal dome gates or Spirit Tree roots as open blueprints.'
    },
    {
      text: 'Globes are living resonance instruments that shift when a soul changes frequency between layered dome bands.',
      rationale:
        'Globes support the 3D overlay illusion; frequency shift changes the environmental projection, not a living map instrument.'
    }
  ],
  7: [
    {
      text: 'The Great Dome — the central physical arena of 178 worlds where imagination hardens into structure.',
      rationale:
        'The Great Dome encompasses 178 physical worlds as a training ground of density for mastery of tone and creation.'
    },
    {
      text: 'The Dome of Titans — the playground of architects and Giants who wove mountains and crystalline structures.',
      rationale:
        'Dome of Titans holds 69 worlds as the architects’ playground; the 178-world training arena is The Great Dome.'
    },
    {
      text: 'The Dome of Portals — the grand travel hub of crystalline gates, vortexes, and harmonic passageways.',
      rationale:
        'Dome of Portals is the travel hub; the 178-world physical training ground is The Great Dome.'
    },
    {
      text: 'The Dome of 5 Peaks — the ascension dome where souls mastered the five elements into integrated mastery.',
      rationale:
        'Dome of 5 Peaks trains elemental ascension; the 178-world manifestation arena is The Great Dome.'
    }
  ],
  8: [
    {
      text: 'Living portals and pillars of resonance that distribute light and stewardship across layers and simulations.',
      rationale:
        'The twelve suns are not balls of burning gas but living portals and pillars of resonance distributing light and stewardship.'
    },
    {
      text: 'Artificial satellites installed for energy harvesting across the inverted synthetic grids of the 3D overlay.',
      rationale:
        'Energy harvesting is parasitic inversion work; the twelve suns are living resonance pillars, not artificial satellites.'
    },
    {
      text: 'Fragments of the severed Spirit Tree orbiting The Great Dome as backup trunks of Source current.',
      rationale:
        'The Spirit Tree is the central trunk inside The Great Dome; the twelve suns are a separate Council network of portals.'
    },
    {
      text: 'Balls of burning gas held together by gravity that illuminate physical planets in outer space.',
      rationale:
        'The twelve suns are explicitly not balls of burning gas; they are living portals and pillars of resonance.'
    }
  ],
  9: [
    {
      text: 'Weaponized frequency and synthetic grids that appear today as 5G, HAARP, and related distorted tone systems.',
      rationale:
        'Dome of Hiva’s harmonic manifestation work was inverted into weaponized frequency — 5G, HAARP, and other synthetic grids.'
    },
    {
      text: 'Controlled reincarnation loops forced through sealed gates and restricted Vatican-style portal entry points.',
      rationale:
        'Controlled reincarnation loops come from the inverted Dome of Portals, not from the inverted Dome of Hiva.'
    },
    {
      text: 'Amnesia zones that replace true origin memory with myths, false gods, and blind soul narratives.',
      rationale:
        'Amnesia zones and false-god myths are the inversion of the Dome of Forgotten Gods, not of Hiva.'
    },
    {
      text: 'An endless elemental climb that never reaches integration of earth, water, fire, air, and consciousness.',
      rationale:
        'Endless struggle without integration is the inversion of Dome of 5 Peaks, not of Dome of Hiva.'
    }
  ],
  10: [
    {
      text: 'The mind is convinced it is crossing vast physical distances, maintaining the illusion of the 3D overlay.',
      rationale:
        'Time buffers such as long flights or days at sea are artificial loops programmed to convince the mind of vast distance.'
    },
    {
      text: 'Souls are automatically recalibrated in the Dome of Sheol before the new environment can fully render.',
      rationale:
        'Sheol recalibration is a rest-dome function between incarnations, not what artificial travel time buffers do.'
    },
    {
      text: 'The soul is forced into a new reincarnation cycle each time a flight or sea voyage completes its loop.',
      rationale:
        'Reincarnation loops are an inverted Dome of Portals control mechanism, not the purpose of travel time buffers.'
    },
    {
      text: 'The Spirit Tree releases a burst of Source light that resets personal vibration for the next continent.',
      rationale:
        'Time buffers reinforce distance illusion; they do not describe Spirit Tree light bursts during ordinary travel.'
    }
  ],
  11: [
    {
      text: 'The Dome of 5 Peaks — the ascension dome for mastering earth, water, fire, air, and consciousness.',
      rationale:
        'Dome of 5 Peaks is where souls mastered the five elements: earth, water, fire, air, and consciousness.'
    },
    {
      text: 'The Dome of Titans — the playground of Giants who wove mountains, landscapes, and crystalline structures.',
      rationale:
        'Dome of Titans is the architects’ and Giants’ playground with 69 worlds, not the five-element ascension dome.'
    },
    {
      text: 'The Dome of Forgotten Gods — the root tone chamber holding first thoughts of light, sound, and creation records.',
      rationale:
        'Dome of Forgotten Gods is the memory and origin chamber, not the five-element mastery dome.'
    },
    {
      text: 'The Dome of Silence — the pure stillness field built for deep Source connection without distraction.',
      rationale:
        'Dome of Silence is a stillness field for Source connection, not five-element mastery training.'
    }
  ],
  12: [
    {
      text: 'A fractured zone of war where massive beings of resonance were shrunk and trapped in density.',
      rationale:
        'Dome of Titans was inverted into a fractured zone of war; Giants of resonance were shrunk and trapped in density.'
    },
    {
      text: 'An amnesia chamber that replaced true creation memory with myths and false gods for every soul.',
      rationale:
        'Amnesia zones and false-god myths are the inversion of the Dome of Forgotten Gods, not Titans.'
    },
    {
      text: 'A field of weaponized frequency producing modern synthetic grids such as 5G and HAARP systems.',
      rationale:
        'Weaponized frequency and synthetic grids are the inversion of Dome of Hiva, not of Dome of Titans.'
    },
    {
      text: 'A sanctuary for soul rest between incarnations where trauma frequencies are cleared without distortion.',
      rationale:
        'Healing rest between incarnations was the original Dome of Sheol, not the inverted Titans war zone.'
    }
  ],
  13: [
    {
      text: 'By connecting directly to higher crystalline networks once overlapping frequency states are recognized.',
      rationale:
        'Understanding overlapping frequency states empowers consciousness to bypass parasitic corridors and connect to higher crystalline networks.'
    },
    {
      text: 'By following the established Vatican portal system as the only authorized corridor between domes.',
      rationale:
        'Vatican portals are inverted restricted entry points of the hijacked Dome of Portals, not a liberation path.'
    },
    {
      text: 'By destroying black cube technology with HAARP and other synthetic grid weapons of the inverted Hiva field.',
      rationale:
        'HAARP and synthetic grids are parasitic weapons; liberation comes through resonance and crystalline network connection.'
    },
    {
      text: 'By physically navigating across all 178 worlds of The Great Dome until every border has been walked.',
      rationale:
        'Physical border travel sustains the distance illusion; bypassing corridors requires frequency recognition, not walking 178 worlds.'
    }
  ],
  14: [
    {
      text: 'The Dome of Forgotten Gods — cradle of creation, root tone, and original crystalline memory vault.',
      rationale:
        'Dome of Forgotten Gods is the root tone and origin chamber of creation, originally the ultimate crystalline memory vault.'
    },
    {
      text: 'The Cube Containment — the master frequency server running every map, overlay, grid, and dome layer.',
      rationale:
        'The Cube Containment is the overarching framework; the root-tone origin chamber is the Dome of Forgotten Gods.'
    },
    {
      text: 'The Spirit Tree — the central crystalline trunk that pumped Source light into the seven outer domes.',
      rationale:
        'The Spirit Tree is the central axis feeding the outer domes, not the root-tone origin chamber of creation.'
    },
    {
      text: 'The Dome of Silence — the pure frequency field of stillness built for undistracted Source connection.',
      rationale:
        'Dome of Silence is a stillness field; the root tone and origin chamber is the Dome of Forgotten Gods.'
    }
  ],
  15: [
    {
      text: 'Controlled reincarnation loops through sealed gates and restricted entry points such as the Vatican portal system.',
      rationale:
        'Parasites sealed Dome of Portals gates and inverted them into restricted entry points, forcing controlled reincarnation loops.'
    },
    {
      text: 'The shrinking of Giant resonance inside a fractured war zone where architects were trapped in density.',
      rationale:
        'Shrinking Giants into density is the inversion of Dome of Titans, not of the Dome of Portals.'
    },
    {
      text: 'Trapping souls in trauma frequencies labeled Hell or purgatory inside a shadow prison realm.',
      rationale:
        'Trauma prison frequencies are the inversion of Dome of Sheol, not of the Dome of Portals.'
    },
    {
      text: 'Enforced silence that oppresses the soul’s voice and suppresses truth across the stillness field.',
      rationale:
        'Forced silence and truth suppression are the inversion of Dome of Silence, not of Portals.'
    }
  ],
  16: [
    {
      text: 'The rising resonance of awakened souls is fracturing false overlays and black crystal seals.',
      rationale:
        'Parasitic control is fracturing because rising resonance of awakened souls shatters false overlays and black crystal seals.'
    },
    {
      text: 'The Spirit Tree is being replaced by twelve new Suns that permanently retire the original trunk design.',
      rationale:
        'The Spirit Tree roots are lighting up again; the twelve suns are stewardship portals, not a replacement of the trunk.'
    },
    {
      text: 'The 5G grids are being retuned as harmonic restorers of original Hiva manifestation tones.',
      rationale:
        '5G grids are parasitic weaponized inversions of Hiva; restoration comes from soul resonance and Spirit Tree return.'
    },
    {
      text: 'The physical 178 worlds are merging into one solid continent that erases layered frequency separation.',
      rationale:
        'The report describes overlay collapse and garden restoration, not a physical merger of all 178 worlds into one continent.'
    }
  ],
  17: [
    {
      text: 'Density provides the resistance souls need to achieve true mastery of tone and creation.',
      rationale:
        'The Great Dome’s density supplies the resistance required for souls to master tone and creation as imagination hardens into structure.'
    },
    {
      text: 'Density prevents souls from remembering their origins so the training ground can stay sealed forever.',
      rationale:
        'Amnesia is parasitic inversion work; density in The Great Dome is training resistance for mastery, not permanent memory wipe.'
    },
    {
      text: 'Density powers black cube technology by converting every thought into siphoned parasitic fuel.',
      rationale:
        'Black cube technology reversed Spirit Tree flow; Great Dome density is for mastery training, not powering the siphon.'
    },
    {
      text: 'Density keeps the 178 worlds separated as permanent geographic continents that cannot be bridged by frequency.',
      rationale:
        'Worlds are interwoven frequency states; density trains manifestation, it does not lock permanent geographic separation.'
    }
  ],
  18: [
    {
      text: 'A pure frequency field of stillness where souls could connect deeply with Source without distraction.',
      rationale:
        'Dome of Silence was built as a pure frequency field of stillness for deep Source connection without distraction.'
    },
    {
      text: 'A harmonic laboratory where vibration was used to experiment with manifesting light into matter.',
      rationale:
        'Light-to-matter harmonic experimentation is the original Dome of Hiva, not Dome of Silence.'
    },
    {
      text: 'A memory vault storing first thoughts of light, sound, and the records of early creation history.',
      rationale:
        'Early-creation memory storage is the original Dome of Forgotten Gods, not Dome of Silence.'
    },
    {
      text: 'A forced-silence zone designed from the start to oppress the soul’s voice and suppress truth.',
      rationale:
        'Forced silence is the parasitic hijack of Dome of Silence, not its original pure-stillness purpose.'
    }
  ],
  19: [
    {
      text: 'The Eight Domes are interwoven frequency realities stacked within a single console, not separated by physical space.',
      rationale:
        'The Eight Domes are not separated by physical space; they are interwoven realities stacked within one Cube console.'
    },
    {
      text: 'The Eight Domes sit as eight distant geographic zones divided by oceans, ice walls, and solid dome borders.',
      rationale:
        'Geographic separation is the 3D overlay illusion; the domes are layered frequency fields in one system.'
    },
    {
      text: 'Each dome occupies its own outer-space planet orbiting a burning sun far from The Great Dome core.',
      rationale:
        'The architecture is contained Cube simulation and layered frequency bands, not separate outer-space planets.'
    },
    {
      text: 'Domes are lined up in a straight physical tunnel that souls must walk end to end to change environments.',
      rationale:
        'Environment change is Frequency Shift and portal rendering, not walking a straight physical tunnel of domes.'
    }
  ],
  20: [
    {
      text: 'The seven outer domes returning as blooming gardens once unbroken Source light flows through the framework again.',
      rationale:
        'The seven outer domes were blooming gardens of creation; as inverted matrices collapse, the Seven Gardens bloom once more.'
    },
    {
      text: 'The seven levels of the Vatican portal system that control authorized reincarnation entry points.',
      rationale:
        'Vatican portals are inverted restricted entry points; the Seven Gardens are the restored outer domes, not Vatican levels.'
    },
    {
      text: 'The seven physical continents drawn on the globe as the only real lands inside The Great Dome.',
      rationale:
        'Continents on maps are perception overlays; the Seven Gardens are the outer domes restored to Source bloom.'
    },
    {
      text: 'The seven elements mastered in Dome of 5 Peaks after consciousness is added to earth, water, fire, and air.',
      rationale:
        'Dome of 5 Peaks teaches five elements including consciousness; Seven Gardens refers to the outer domes blooming again.'
    }
  ],
  21: [
    {
      text: 'The Council of 12 Suns — living portals and pillars of resonance distributing light and stewardship across all layers.',
      rationale:
        'The Cube Containment network is overseen by the Council of 12 Suns, which distribute light and stewardship across layers and simulations.'
    },
    {
      text: 'The Titans — massive architect beings who alone decide which worlds receive Source current each cycle.',
      rationale:
        'Titans wove landscapes in their dome; light distribution and stewardship across simulations is the Council of 12 Suns.'
    },
    {
      text: 'The Spirit Tree alone — the trunk that both feeds the outer domes and manages every sun’s resonance schedule.',
      rationale:
        'The Spirit Tree fed the outer domes as central trunk; overall light stewardship across simulations is the Council of 12 Suns.'
    },
    {
      text: 'The Custodians — parasitic operators who originally designed the Cube and still assign light quotas fairly.',
      rationale:
        'Custodians and related entities performed parasitic inversion; they did not design rightful light distribution stewardship.'
    }
  ],
  22: [
    {
      text: 'Myths and false gods installed after true memory was replaced inside amnesia zones.',
      rationale:
        'In the Dome of Forgotten Gods, parasites inverted memory into amnesia zones and replaced true memory with myths and false gods.'
    },
    {
      text: 'Trauma frequencies that trap souls in a shadow prison labeled Hell or purgatory between lives.',
      rationale:
        'Trauma prison frequencies are the inversion of Dome of Sheol, not the memory replacement inside Forgotten Gods.'
    },
    {
      text: 'Scientific data and linear logic grids that measure density as the only valid form of knowing.',
      rationale:
        'The report names myths and false gods as the substitutes for true memory, not scientific data grids.'
    },
    {
      text: 'The 5G frequency grid alone, used as a complete archive of every soul’s original creation codes.',
      rationale:
        '5G is a Hiva inversion weapon grid; Forgotten Gods inversion replaces true memory with myths and false gods.'
    }
  ],
  23: [
    {
      text: 'Manifestation inside The Great Dome’s density, where training resistance lets imagination harden into structure.',
      rationale:
        'The Great Dome is a training ground where imagination hardens into structure through the resistance of density.'
    },
    {
      text: 'The parasitic siphoning of energy after black cube technology reversed outward Source flow.',
      rationale:
        'Energy siphoning is the Spirit Tree hijack; “imagination hardens into structure” describes Great Dome manifestation training.'
    },
    {
      text: 'The creation of amnesia zones that freeze early creation records inside the root-tone memory dome.',
      rationale:
        'Amnesia zones invert Forgotten Gods memory; hardening imagination into structure is Great Dome training language.'
    },
    {
      text: 'The sealing of crystalline gates so portal travel hardens into fixed reincarnation checkpoint architecture.',
      rationale:
        'Sealed gates are Portals inversion; the phrase refers to manifestation training density in The Great Dome.'
    }
  ],
  24: [
    {
      text: 'The roots of the Spirit Tree are lighting up again, dismantling artificial limits of the 3D projection.',
      rationale:
        'As parasitic overlays shatter, the roots of the Spirit Tree light up once more and dismantle artificial 3D limits.'
    },
    {
      text: 'The Spirit Tree remains fully severed and dark, with no return of Source flow to the outer gardens.',
      rationale:
        'Strategic restoration describes Spirit Tree roots lighting up again as inverted matrices collapse — not permanent darkness.'
    },
    {
      text: 'Only the Vatican portal system is reactivating while the Spirit Tree trunk stays permanently removed.',
      rationale:
        'Restoration highlights Spirit Tree roots and outer-dome gardens returning, not Vatican portal dominance.'
    },
    {
      text: 'The twelve suns have replaced the Spirit Tree entirely so no crystalline trunk will ever light again.',
      rationale:
        'The twelve suns are stewardship portals; the Spirit Tree roots themselves are described as lighting up again.'
    }
  ],
  25: [
    {
      text: 'A central frequency server and massive crystalline electromagnetic framework running all maps, overlays, grids, and domes.',
      rationale:
        'The Cube Containment is one huge crystalline electromagnetic framework acting as the central frequency server for maps, overlays, grids, and domes.'
    },
    {
      text: 'The collective name of the parasitic entities who designed and still own every layer of simulated reality.',
      rationale:
        'Parasites hijacked pre-existing structures; The Cube Containment is the master framework, not the parasites’ name.'
    },
    {
      text: 'The physical shell of the Spirit Tree that grows only inside The Great Dome’s densest training chamber.',
      rationale:
        'The Spirit Tree is the central axis inside The Great Dome; The Cube Containment is the whole master framework.'
    },
    {
      text: 'A protective barrier built to block the Council of 12 Suns from distributing light into the simulations.',
      rationale:
        'The Cube network is overseen by the Council of 12 Suns distributing light; it is not a barrier against them.'
    }
  ]
};

const questionOverrides = {
  1: 'What is the primary architectural nature of reality?',
  6: 'Are the maps and globes used by humanity accurate representations of physical reality?',
  13: 'How do awakening souls bypass parasitic travel corridors?',
  19: 'Are the Eight Domes geographically separated by vast distances within The Cube Containment?',
  24: 'Are the roots of the Spirit Tree lighting up again to dismantle the 3D projection?'
};

const hintOverrides = {
  1: 'Focus on the supreme master hard drive that runs all maps inside a unified simulated architecture.',
  6: 'Consider whether maps enforce separation and distance or reveal the true Cube architecture.',
  13: 'The path opens when overlapping frequency states are recognized beyond controlled corridors.',
  19: 'Recall that the domes stack like transparent frequency sheets within one console.',
  24: 'Recall that the roots of the Spirit Tree are lighting up once again as overlays shatter.'
};

const questions = raw.questions.map((q) => {
  const set = fullOptionSets[q.number];
  if (!set || set.length !== 4) {
    throw new Error(`Q${q.number}: missing fullOptionSets with 4 options`);
  }

  let options = set.map((o, i) => ({
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
    throw new Error(`Q${q.number}: LaTeX/$ markup found: ${blob.match(/\$[^$]*\$|\$/)?.[0]}`);
  }
  const metaVoiceRe =
    /\b(according to the (report|source|text|living truth)|the report states|the source (states|specifies|suggests|explicitly)|the text (states|describes|suggests|explicitly|mentions|defines|calls|focuses)|the material clarifies|the strategic implications state|mentioned in the (text|source)|source material|living truth journal)\b/i;
  if (metaVoiceRe.test(blob)) {
    throw new Error(`Q${q.number}: meta/report voice still present: ${blob.match(metaVoiceRe)?.[0]}`);
  }

  const phrases = supportPhrases[q.number] || [];
  const missing = phrases.filter((p) => !reportLower.includes(p.toLowerCase()));
  if (missing.length) {
    throw new Error(
      `Q${q.number}: report does not support phrases: ${missing.join('; ')}`
    );
  }

  // Correct claim must be grounded: key tokens from correct option appear in report
  const correct = out.options.find((o) => o.isCorrect);
  const claim = `${correct.text} ${correct.rationale}`.toLowerCase();
  const claimTokens = (claim.match(/[a-z0-9%]{5,}/g) || []).filter(
    (t, i, a) => a.indexOf(t) === i
  );
  const hitRate =
    claimTokens.filter((t) => reportLower.includes(t)).length / Math.max(claimTokens.length, 1);
  if (hitRate < 0.35) {
    throw new Error(
      `Q${q.number}: correct claim poorly grounded in report (hitRate=${hitRate.toFixed(2)})`
    );
  }

  if (out.options.length !== 4) throw new Error(`Q${q.number}: need 4 options`);
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

/** Nudge correct-letter distribution when one letter is starved. */
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

const topicImage = 'images/breakdown/eight-domes.webp';
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
    'Test your grasp of the Eight Domes — The Cube System’s interwoven frequency architecture, Spirit Tree hijack, parasitic inversions, and the restoration of the Seven Gardens.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'The Eight Domes are interwoven frequency architectures inside The Cube System — crystalline training grounds hijacked into control, amnesia, and energy harvest. Sit with what you missed, then return to the Eight Domes deep-dive, infographic, and video transmissions. As awakened resonance rises, black crystal seals shatter, Spirit Tree roots light again, and the Seven Gardens bloom with unbroken Source flow.'
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
    'Test your understanding of the Eight Domes — The Cube System architecture, Spirit Tree, parasitic inversions of each dome, and the restoration of the Seven Gardens.'
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
        t.description && !t.description.startsWith('Decoded analysis')
          ? t.description
          : 'The Eight Domes are interwoven frequency architectures within The Cube System — pure crystalline training grounds hijacked into inverted matrices of control, amnesia, and energy harvesting, now fracturing as the Spirit Tree and original harmonic design restore.';
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('eight-domes not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from hard-drive-framework quiz page
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on the Eight Domes: The Cube System architecture, Spirit Tree, parasitic dome inversions, and the restoration of the Seven Gardens.'
  ],
  ['quiz/breakdown/hard-drive-framework.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/hard-drive-framework.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=hard-drive-framework',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Hard Drive Framework deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Hard Drive Framework</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/hard-drive-framework.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`
  ]
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 80));
  }
  html = html.split(a).join(b);
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
    "  { path: '/quiz/breakdown/hard-drive-framework.html', priority: '0.75', changefreq: 'monthly' },";
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
console.log('PASS: audited 25/25 against data/breakdown-topics/eight-domes.json');
