/**
 * Installs Lyran Lineage quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/lyran-quiz.json
 * Title forced to "Lyran Lineage". All 25 audited against lyran-lineage report only.
 *
 * Run: node scripts/install-lyran-lineage-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/lyran-lineage.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'lyran-lineage';
const TOPIC_TITLE = 'Lyran Lineage';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/lyran-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/lyran-lineage.webp';

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

/** Support phrases grounded only in lyran-lineage.json report. */
const supportPhrases = {
  1: [
    'original builders, architects, and early Custodians',
    'systems of balance, order, and physical templates'
  ],
  2: [
    'heart-centered courage',
    'leadership through service rather than fear'
  ],
  3: [
    'mythic symbol rather than a biological species',
    'mythic emblem of the lion'
  ],
  4: [
    'extraterrestrial souls who have entered physical vessels',
    'dismantling the parasitic overlay'
  ],
  5: [
    'govern physical form and physical life',
    '178 worlds of the Great Dome'
  ],
  6: [
    'folding sound vibration into light',
    'stabilize crystalline membranes'
  ],
  7: [
    'central axis of consciousness',
    'pulse pure light and sound'
  ],
  8: [
    'planted the Spirit Tree in Hyperborea',
    'harmonic conduit for all seven gardens'
  ],
  9: [
    'Sirians, Andromedans, Arcturians, and Pleiadians',
    'templates for the New Humans'
  ],
  10: [
    'Council of 12 Suns',
    'lie dormant until activated'
  ],
  11: [
    'full broadcast mode',
    'magnetically pulling human souls toward the truth'
  ],
  12: [
    'first stable humanoid templates',
    'Sirian-Lyran harmonic field'
  ],
  13: [
    'massive physical bio-fields',
    'White Hat Alliance'
  ],
  14: [
    'etheric hard drives',
    'recording soul journeys'
  ],
  15: [
    'fracturing of the parasitic illusion grid',
    'vital strategic importance'
  ],
  16: [
    'lion of consciousness',
    'voice-to-skull technologies',
    'deceptive matrix loops'
  ],
  17: ['emotional loosh', 'holding high resonance'],
  18: ['homecoming path', 'crystalline origins'],
  19: ['Canada and the eastern grid of the United Kingdom'],
  20: [
    'original methodology of creation',
    'every soul within the Great Dome'
  ],
  21: ['root frequency code', 'incarnated into physical vessels'],
  22: [
    'laboratories of Sirius A and Sirius B',
    'lion-hearted Lyran qualities'
  ],
  23: [
    'not confined to a single group',
    'every soul within the Great Dome'
  ],
  24: ['violently removed', 'harmonic conduit'],
  25: ['178 worlds of the Great Dome']
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
    [/\bthe text defines them as\b/gi, 'they are'],
    [/\bthe text defines\b/gi, ''],
    [/\bthe text specifically highlights\b/gi, ''],
    [/\bmentioned in the text\b/gi, 'named here'],
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
 * NotebookLM meaning kept; lengths evened; claims grounded in the Lyran Lineage report.
 */
const fullOptionSets = {
  1: [
    {
      text: 'They act as the primordial builders and architects who established the systems of balance.',
      rationale:
        'The Lyran Lineage is the primordial line of original builders, architects, and early Custodians who established the cosmic systems of balance, order, and physical templates across the Great Dome.'
    },
    {
      text: 'They are the parasitic forces that hijacked the crystalline grid to implement a 3D matrix.',
      rationale:
        'The Lyrans are the original builders whose work was later hijacked by parasitic forces, not the hijackers themselves.'
    },
    {
      text: 'They serve as genetic engineers who focused exclusively on creating biological feline species.',
      rationale:
        'The feline connection is a mythic emblem of consciousness rather than a literal biological species or exclusive engineering focus.'
    },
    {
      text: 'They function as a specialized military force designed to protect the outer edges of the realm.',
      rationale:
        'While the lineage carries protective strength, its core identity is building and architectural custody, not specialized warfare.'
    }
  ],
  2: [
    {
      text: 'A frequency characterized by heart-centered courage and leadership through dedicated service.',
      rationale:
        'The True Lyran Current is the vibrational frequency of heart-centered courage, loyal protection of life\'s balance, and leadership through service rather than fear.'
    },
    {
      text: 'A state of existence that requires the suppression of emotions to maintain cosmic order.',
      rationale:
        'Lyran consciousness is heart-centered. Emotional depth is integrated through courage and service, not suppressed to keep order.'
    },
    {
      text: 'A vibration defined by intellectual superiority and the mastery of logical technological systems.',
      rationale:
        'The lineage is characterized by heart-centered courage and noble guardianship, not cold intellectual or technological mastery.'
    },
    {
      text: 'A methodology of control that uses fear and intimidation to enforce laws across the 178 worlds.',
      rationale:
        'The True Lyran Current rejects fear-based leadership in favor of service and loyal protection of life\'s balance.'
    }
  ],
  3: [
    {
      text: 'The lion is a mythic symbol used to represent specific qualities of protective consciousness.',
      rationale:
        'The lion is a mythic symbol rather than a biological species. Heart-centered courage, noble guardianship, and protective strength are represented by that mythic emblem of the lion.'
    },
    {
      text: 'The lion is the literal biological ancestor from which all Lyran souls originally evolved.',
      rationale:
        'The lineage is defined by qualities of consciousness, not a literal biological descent from feline animals.'
    },
    {
      text: 'The lion serves as a deceptive tool used by parasitic forces to mimic the Lyran architects.',
      rationale:
        'The emblem is a valid representation of the true lineage\'s internal frequency and protective strength, not a parasitic mimic.'
    },
    {
      text: 'The lion is a physical mask worn by the architects when they interact with human populations.',
      rationale:
        'The lion is a mythic emblem of consciousness, not a physical mask worn by architects among human populations.'
    }
  ],
  4: [
    {
      text: 'They are extraterrestrial souls in physical vessels here to dismantle the parasitic overlay.',
      rationale:
        'ET Sols are extraterrestrial souls who have entered physical vessels in the simulated 3D realm to assist in dismantling the parasitic overlay and awakening humanity.'
    },
    {
      text: 'They are artificial intelligences created by the Sefrin Councils to monitor the Great Dome.',
      rationale:
        'ET Sols are extraterrestrial souls who entered physical vessels, not artificial intelligences created by the Sefrin Councils.'
    },
    {
      text: 'They are humans who have been genetically modified by modern technology to gain superpowers.',
      rationale:
        'These are extraterrestrial souls in physical vessels, not Earth-born humans modified by modern technology.'
    },
    {
      text: 'They are the original hijacked Custodians who are seeking redemption for their past actions.',
      rationale:
        'ET Sols carry embedded Lyran codes for awakening. Hijacked Custodians and their enslaved engineers removed the Spirit Tree; they are not the ET Sols.'
    }
  ],
  5: [
    {
      text: 'To govern physical life and maintain cosmic balance across the 178 worlds of the Dome.',
      rationale:
        'The Lyran lineage designed the Sefrin Councils to govern physical form and physical life, preserving balance across the 178 worlds of the Great Dome.'
    },
    {
      text: 'To oversee the construction of the parasitic illusion grid using enslaved human engineers.',
      rationale:
        'The Sefrin Councils were the original assemblies for physical life and cosmic balance, predating the parasitic hijack.'
    },
    {
      text: 'To harvest emotional energy from the seven gardens to power the crystalline membranes.',
      rationale:
        'Harvesting emotional loosh is a parasitic requirement. The councils were established to design physical life and maintain balance.'
    },
    {
      text: 'To develop advanced weapon systems to combat the early parasitic forces in Sirius.',
      rationale:
        'The original design of the councils was focused on governing physical form and maintaining cosmic balance, not warfare.'
    }
  ],
  6: [
    {
      text: 'They folded sound vibration into light to create the necessary structural stability.',
      rationale:
        'The Lyrans functioned as the primary builders and architects, folding sound vibration into light to stabilize crystalline membranes.'
    },
    {
      text: 'They projected holographic images of the Spirit Tree onto the surface of the Great Dome.',
      rationale:
        'The Spirit Tree was the central axis planted in Hyperborea. Membrane stability came from folding sound vibration into light.'
    },
    {
      text: 'They utilized physical anchors made of heavy metals to ground the membranes in 3D space.',
      rationale:
        'Stabilization was vibrational: folding sound vibration into light, not heavy-metal hardware in 3D space.'
    },
    {
      text: 'They synchronized the brainwaves of the Pollarians to create a collective mental shield.',
      rationale:
        'Pollarians were later woven from the Sirian-Lyran harmonic field. Membrane stability came from folding sound into light.'
    }
  ],
  7: [
    {
      text: 'It acted as the central axis of consciousness, pulsing pure light and sound through the grid.',
      rationale:
        'The Spirit Tree is the central axis of consciousness and harmonic conduit that pulses pure light and sound throughout the crystalline grid, linking all seven gardens to source.'
    },
    {
      text: 'It served as a biological laboratory where the first feline DNA sequences were synthesized.',
      rationale:
        'The Spirit Tree was a conduit for consciousness and light, not a genetic laboratory for feline DNA.'
    },
    {
      text: 'It was a giant receiver designed to capture signals from the Council of 12 Suns for storage.',
      rationale:
        'The tree pulsed light and sound as the grid\'s central axis. The Council of 12 Suns later releases harmonic tones that activate dormant Lyran codes.'
    },
    {
      text: 'It functioned as a defensive barrier that prevented parasitic entities from entering Asgard.',
      rationale:
        'The tree provided a harmonic pulse through the crystalline grid rather than acting as a military wall around Asgard.'
    }
  ],
  8: [
    {
      text: 'In Hyperborea, serving as the harmonic conduit for all seven gardens of the Great Dome.',
      rationale:
        'The Lyran Builders-Architects planted the Spirit Tree in Hyperborea as the central axis of consciousness and harmonic conduit for all seven gardens or domes.'
    },
    {
      text: 'In the eastern grid of the United Kingdom to connect with localized crystalline deposits.',
      rationale:
        'Canada and the eastern grid of the United Kingdom are later reaction zones. The central axis itself was planted in Hyperborea.'
    },
    {
      text: 'Within the crystalline membranes of the 178 worlds to stabilize their outer edges.',
      rationale:
        'The tree was the central axis in Hyperborea. Crystalline membranes were stabilized by folding sound vibration into light.'
    },
    {
      text: 'In the ancient laboratories of Sirius A to oversee the refining of Lyran qualities.',
      rationale:
        'Sirius A and Sirius B were refinement laboratories for lion-hearted qualities, not the planting site of the Spirit Tree.'
    }
  ],
  9: [
    {
      text: 'The Lyran consciousness worked with Sirians, Andromedans, Arcturians, and Pleiadians.',
      rationale:
        'In the Hyperborean Halls near Asgard, the Lyran consciousness collaborated with Sirians, Andromedans, Arcturians, and Pleiadians to design the templates for the New Humans.'
    },
    {
      text: 'The enslaved engineers and hijacked Custodians created the templates in the Sirius labs.',
      rationale:
        'Hijacked Custodians and enslaved engineers later removed the Spirit Tree. The New Human templates were designed by the uncorrupted lineages in the Hyperborean Halls.'
    },
    {
      text: 'The Sefrin Councils worked exclusively with the Pollarians to develop the first templates.',
      rationale:
        'Pollarians were woven out of the Sirian-Lyran harmonic field as the first stable humanoid templates. New Human vessel design was a later multi-lineage collaboration.'
    },
    {
      text: 'The White Hat Alliance and the Giants designed the templates to resist parasitic forces.',
      rationale:
        'Giants partner with the White Hat Alliance now. The New Human templates were designed in the Hyperborean Halls by Lyran, Sirian, Andromedan, Arcturian, and Pleiadian consciousness.'
    }
  ],
  10: [
    {
      text: 'They are activated by cosmic triggers, such as harmonic tones from the Council of 12 Suns.',
      rationale:
        'The codes lie dormant until activated by cosmic triggers, such as the harmonic tones released by the Council of 12 Suns.'
    },
    {
      text: 'They are triggered by biological maturity once an ET Sol reaches a specific physical age.',
      rationale:
        'Activation is a cosmic vibrational trigger, not a biological-age milestone inside the vessel.'
    },
    {
      text: 'They are triggered by the consumption of specific crystalline deposits found in Canada.',
      rationale:
        'Canada\'s deposits react with Lyran codes. The primary activation trigger is the harmonic tones of the Council of 12 Suns.'
    },
    {
      text: 'They are manually unlocked by the White Hat Alliance using advanced satellite technology.',
      rationale:
        'The Giants partner with the White Hat Alliance as guardians. Code activation is a cosmic trigger, not a satellite unlock.'
    }
  ],
  11: [
    {
      text: 'They act as a beacon that magnetically pulls human souls toward the truth of the realm.',
      rationale:
        'Once triggered, the codes act as a beacon, allowing ET Sols to transition to full broadcast mode, magnetically pulling human souls toward the truth.'
    },
    {
      text: 'They gain the ability to physically transform into the mythic lion form to protect life.',
      rationale:
        'The lion is a mythic emblem. Full broadcast mode is the radiance of activated Lyran codes, not a physical shapeshift.'
    },
    {
      text: 'They become invisible to the parasitic forces by lowering their vibrational frequency.',
      rationale:
        'Broadcast mode holds high resonance and becomes a magnetic beacon. It does not hide the ET Sol by lowering frequency.'
    },
    {
      text: 'They begin to transmit high-frequency radio waves that interfere with local internet grids.',
      rationale:
        'Broadcast mode is a spiritual and magnetic frequency that pulls souls toward the truth, not a technical radio signal.'
    }
  ],
  12: [
    {
      text: 'The Pollarians, who were the first stable humanoid templates seeded in the realm.',
      rationale:
        'The Pollarians, the first stable humanoid templates seeded in the known lands, were woven directly out of the Sirian-Lyran harmonic field.'
    },
    {
      text: 'The New Humans, who were designed specifically to survive within the parasitic matrix.',
      rationale:
        'New Humans were a later Hyperborean Halls collaboration for physical vessels. The first stable humanoid templates were the Pollarians.'
    },
    {
      text: 'The Giants, who served as the first stable humanoid templates in the known lands.',
      rationale:
        'Giants are ancient guardians with massive bio-fields who trace soul consciousness to the Lyrans. The first stable humanoid templates were the Pollarians.'
    },
    {
      text: 'The enslaved engineers who were responsible for the removal of the Spirit Tree.',
      rationale:
        'Enslaved engineers helped hijacked Custodians remove the Spirit Tree. They were not woven from the original Sirian-Lyran harmonic field.'
    }
  ],
  13: [
    {
      text: 'The Giants possess massive physical bio-fields and trace their soul consciousness to Lyrans.',
      rationale:
        'The Giants are ancient guardians who possess massive physical bio-fields and partner with the White Hat Alliance, tracing their soul consciousness directly back to the Lyran lineage.'
    },
    {
      text: 'The Giants are the physical enemies of the Lyran lineage and the White Hat Alliance.',
      rationale:
        'The Giants partner with the White Hat Alliance and trace their soul consciousness to the Lyrans; they are allies, not enemies.'
    },
    {
      text: 'The Giants are the biological parents of the ET Sols who entered the simulated realm.',
      rationale:
        'ET Sols were embedded with Lyran codes by their solar parents. Giants are a related guardian line, not those solar parents.'
    },
    {
      text: 'The Giants were created by parasitic forces to guard the hijacked crystalline membranes.',
      rationale:
        'The Giants are partners with the White Hat Alliance and trace their lineage back to the original Lyran builders, not to parasitic construction.'
    }
  ],
  14: [
    {
      text: 'They record the soul journeys and link awakened Lyrans to unaltered galactic records.',
      rationale:
        'Planetary Crystals act as etheric hard drives, recording soul journeys and linking awakened Lyrans to galactic libraries that hold the unaltered records of physical creation.'
    },
    {
      text: 'They generate the electricity required to power the parasitic voice-to-skull technologies.',
      rationale:
        'Crystals hold unaltered records of creation. Voice-to-skull is a parasitic manipulation that the lion of consciousness resists.'
    },
    {
      text: 'They physically store the DNA samples of every human soul currently in the 3D matrix.',
      rationale:
        'Their function is etheric and informational — recording soul journeys — not biological DNA warehousing.'
    },
    {
      text: 'They act as remote controls that allow the Sefrin Councils to adjust the 3D simulation.',
      rationale:
        'The crystals are records and library links rather than active remote-control tools for the Sefrin Councils.'
    }
  ],
  15: [
    {
      text: 'Because the activation of Lyran codes initiates the fracturing of the parasitic illusion grid.',
      rationale:
        'Preservation of the Lyran Lineage within ET Sols holds vital strategic importance: activation of the embedded codes initiates the fracturing of the parasitic illusion grid.'
    },
    {
      text: 'Because Lyran DNA is required to physically rebuild the removed Spirit Tree in Asgard.',
      rationale:
        'The awakening turns on internal activation of Lyran codes, not a physical reconstruction of the Spirit Tree in Asgard.'
    },
    {
      text: 'Because the Lyrans are the only beings capable of operating the Council of 12 Suns.',
      rationale:
        'The Council of 12 Suns releases the harmonic trigger. The Lyran role inside the grid is holding the codes that fracture the illusion.'
    },
    {
      text: 'Because the parasitic forces cannot survive without the presence of Lyran soul consciousness.',
      rationale:
        'Parasitic forces require emotional loosh. Lyrans starve them by holding high resonance, not by being a food they cannot live without.'
    }
  ],
  16: [
    {
      text: 'Its bold, unbendable qualities prevent manipulation by parasitic frequencies and deceptive matrix loops.',
      rationale:
        'The bold, unbendable qualities of the lion of consciousness prevent ET Sols from being manipulated by parasitic frequencies, voice-to-skull technologies, or deceptive matrix loops.'
    },
    {
      text: 'It lowers the soul\'s visibility so that parasitic frequencies cannot locate the individual.',
      rationale:
        'The lion quality is about holding high resonance and unbendable strength, not hiding or lowering frequency.'
    },
    {
      text: 'It provides a physical shield that reflects all incoming voice-to-skull transmissions.',
      rationale:
        'Protection is the unbendable inner quality of the lion of consciousness, not a literal physical reflector of voice-to-skull signals.'
    },
    {
      text: 'It allows the ET Sol to mimic the frequency of parasitic forces to evade their detection.',
      rationale:
        'Lyrans maintain a high, distinct resonance that is the opposite of parasitic frequencies, not a camouflage mimic.'
    }
  ],
  17: [
    {
      text: 'They hold a high resonance that denies the parasitic forces the emotional loosh they need.',
      rationale:
        'By holding high resonance, Lyrans starve the parasitic forces of the emotional loosh they require to maintain their false overlays.'
    },
    {
      text: 'They use the Spirit Tree to drain all energy from the seven gardens simultaneously.',
      rationale:
        'The Spirit Tree pulses light and sound through the grid. Starving parasites is done by holding high resonance, not by draining the gardens.'
    },
    {
      text: 'They physically destroy the energy plants that distribute power to the illusion grid.',
      rationale:
        'The struggle is vibrational: holding high resonance cuts off emotional loosh. It is not physical sabotage of power plants.'
    },
    {
      text: 'They hide within the crystalline deposits of Canada to avoid being harvested for energy.',
      rationale:
        'Canada\'s deposits react with Lyran codes. Starving parasites is active high-resonance holding, not hiding from harvest.'
    }
  ],
  18: [
    {
      text: 'To step onto the homecoming path and return directly to their crystalline origins.',
      rationale:
        'Activation of this lineage lets human and ET souls step onto the homecoming path, bypassing the corrupted reincarnation loops and returning directly to their crystalline origins.'
    },
    {
      text: 'To transition into biological feline beings and live within the gardens of Hyperborea.',
      rationale:
        'The return is to crystalline origins along the homecoming path, not a biological change into feline form.'
    },
    {
      text: 'To become the new architects who will design a second Great Dome in the Sirius system.',
      rationale:
        'Sirius A and Sirius B were refinement laboratories. The goal of activation is the homecoming path back to crystalline origins.'
    },
    {
      text: 'To remain within the 3D matrix to eventually take over the role of the Custodians.',
      rationale:
        'The goal is to bypass the corrupted reincarnation loops of the matrix, not to remain inside it as replacement Custodians.'
    }
  ],
  19: [
    {
      text: 'Canada and the eastern grid of the United Kingdom, where Lyran codes react with crystalline deposits.',
      rationale:
        'The connection is particularly strong in Canada and the eastern grid of the United Kingdom, where Lyran codes react directly with localized crystalline deposits.'
    },
    {
      text: 'The central plains of the United States and the northern regions of Russia, treated as the named reaction zones.',
      rationale:
        'Those interiors are not the named sites. The strong reaction is in Canada and the eastern grid of the United Kingdom.'
    },
    {
      text: 'The deserts of Northern Africa and the mountains of the Asian continent, treated as the named reaction zones.',
      rationale:
        'Those ranges are not the named sites. The strong reaction is in Canada and the eastern grid of the United Kingdom.'
    },
    {
      text: 'The southern tips of South America and the islands of the Pacific Ocean, treated as the named reaction zones.',
      rationale:
        'Those coasts are not the named sites. The strong reaction is in Canada and the eastern grid of the United Kingdom.'
    }
  ],
  20: [
    {
      text: 'It was the original methodology used by the builders to code the essence of creation.',
      rationale:
        'Every soul within the Great Dome carries the Lyran lineage coded within their essence, as this was the original methodology of creation.'
    },
    {
      text: 'The Sefrin Councils mandated that every soul must be part Lyran to ensure total control.',
      rationale:
        'The coding was the original methodology of creation so souls can recognize the harmonic call of awakening, not a control mandate.'
    },
    {
      text: 'The parasitic forces accidentally copied Lyran DNA into all human vessels during the hijacking.',
      rationale:
        'The coding is part of the original, intentional methodology of creation by the builders, not an accident of the hijack.'
    },
    {
      text: 'ET Sols share their codes with human souls through physical contact and interaction.',
      rationale:
        'The coding is already inherent in every soul within the Great Dome. ET Sols carry additional mission codes from their solar parents.'
    }
  ],
  21: [
    {
      text: 'The Lyran lineage is the root frequency code, while ET Sols are the souls incarnated to assist.',
      rationale:
        'Within the broader matrix of ET Sols — extraterrestrial souls incarnated into physical vessels — the Lyran Lineage serves as the root frequency code that coordinates awakening and restoration.'
    },
    {
      text: 'Lyran souls created the 3D matrix, whereas ET Sols are trying to escape from it.',
      rationale:
        'The Lyrans designed the original blueprint of the physical plane. Parasitic forces later hijacked that work and built the overlay ET Sols came to dismantle.'
    },
    {
      text: 'There is no difference; all ET Sols are by definition the only beings with Lyran lineage.',
      rationale:
        'Every soul within the Great Dome carries the Lyran lineage. ET Sols are the specific incarnated helpers carrying additional mission codes.'
    },
    {
      text: 'Lyran souls are purely energetic, while ET Sols are purely biological humans.',
      rationale:
        'ET Sols are extraterrestrial souls in physical vessels. The Lyran lineage is the root frequency coded in essence, not a split between energy-only and biology-only beings.'
    }
  ],
  22: [
    {
      text: 'The ancient laboratories of Sirius A and Sirius B, where lion-hearted Lyran qualities were refined.',
      rationale:
        'In the ancient laboratories of Sirius A and Sirius B, the lion-hearted Lyran qualities were refined and seeded across the physical domains.'
    },
    {
      text: 'The crystalline membranes that surround the 178 worlds, treated as the refinement labs rather than as structure.',
      rationale:
        'The membranes were stabilized by folding sound vibration into light. Refinement of lion-hearted qualities happened in the Sirius A and Sirius B laboratories.'
    },
    {
      text: 'The Hyperborean Halls near Asgard, where New Human templates were designed rather than first refined.',
      rationale:
        'The Hyperborean Halls were the later collaboration site for New Human templates. The refinement laboratories were Sirius A and Sirius B.'
    },
    {
      text: 'The solar centers governed by the Council of 12 Suns, which release harmonic tones rather than refine traits.',
      rationale:
        'The Council of 12 Suns releases the harmonic tones that activate dormant codes. The refinement laboratories were Sirius A and Sirius B.'
    }
  ],
  23: [
    {
      text: 'False',
      rationale:
        'The lineage is not confined to a single group; every soul within the Great Dome carries the Lyran lineage coded within their essence.'
    },
    {
      text: 'True',
      rationale:
        'The lineage is not confined to one elite group of ET Sols. Every soul within the Great Dome carries that coding as the original methodology of creation.'
    }
  ],
  24: [
    {
      text: 'The central axis of consciousness and harmonic conduit for the gardens was lost.',
      rationale:
        'The Spirit Tree served as the central axis and harmonic conduit that pulsed light and sound through the grid until it was violently removed by hijacked Custodians and their enslaved engineers.'
    },
    {
      text: 'The seven gardens were immediately destroyed and the Great Dome collapsed.',
      rationale:
        'The gardens and dome remained. What was lost was the central axis and harmonic conduit that pulsed light and sound through the grid.'
    },
    {
      text: 'The parasitic forces were able to install their own artificial central axis in its place.',
      rationale:
        'The report names violent removal by hijacked Custodians, not the installation of a replacement axis. The loss is the original harmonic conduit.'
    },
    {
      text: 'The Lyrans were forced to retreat to Sirius B to rebuild their laboratories.',
      rationale:
        'Sirius B was a refinement laboratory. The named result of removal is the loss of the grid\'s central harmonic conduit, not a retreat to rebuild labs.'
    }
  ],
  25: [
    {
      text: 'The Great Dome contains 178 worlds that were balanced by the Sefrin Councils.',
      rationale:
        'The original Sefrin Council design focused on preserving balance across the 178 worlds of the Great Dome.'
    },
    {
      text: 'The realm consists of only 3 worlds: Sirius A, Sirius B, and Hyperborea.',
      rationale:
        'Sirius A, Sirius B, and Hyperborea are sites inside a much larger structure: the 178 worlds of the Great Dome.'
    },
    {
      text: 'There are exactly 12 worlds, each governed by a different sun in the council.',
      rationale:
        'The Council of 12 Suns releases harmonic activation tones. The worlds themselves number 178.'
    },
    {
      text: 'There are 7 gardens, which each represent one of the 7 main worlds of the dome.',
      rationale:
        'The seven gardens or domes were fed by the Spirit Tree. The total number of worlds under Sefrin balance is 178.'
    }
  ]
};

const questionsMeta = [
  {
    number: 1,
    question:
      'What is the primary role of the Lyran Lineage in the creation of the Great Dome?',
    hint: 'Consider the foundational work required to establish the physical templates of a realm.'
  },
  {
    number: 2,
    question: 'Which quality best defines the True Lyran Current of consciousness?',
    hint: 'Think of the traits associated with the noble emblem that represents this lineage.'
  },
  {
    number: 3,
    question: 'What is the relationship between the Lyran Lineage and the lion emblem?',
    hint: 'Distinguish between a literal biological species and a symbolic representation of spirit.'
  },
  {
    number: 4,
    question: 'Who are the ET Sols currently residing within the physical realm?',
    hint: 'Focus on the origin and the restorative mission of these specific individuals.'
  },
  {
    number: 5,
    question: 'What was the primary function of the Sefrin Councils when they were established?',
    hint: 'Look for the purpose related to governance and the maintenance of order.'
  },
  {
    number: 6,
    question: 'How did the Lyran Builders-Architects stabilize the crystalline membranes?',
    hint: 'Identify the two fundamental elements of consciousness used to create form.'
  },
  {
    number: 7,
    question: 'What role did the Spirit Tree play before it was removed by hijacked forces?',
    hint: 'Consider its function as a central point for energy distribution.'
  },
  {
    number: 8,
    question: 'Where was the Spirit Tree originally planted by the Lyran Builders?',
    hint: 'Identify the legendary northern location that serves as the center of the gardens.'
  },
  {
    number: 9,
    question:
      'Which groups collaborated in the Hyperborean Halls to design the templates for New Humans?',
    hint: 'Recall the multiple star lineages that joined the Lyrans in this project.'
  },
  {
    number: 10,
    question: 'How are Lyran codes activated within the physical vessels of ET Sols?',
    hint: 'Think of an external signal that resonates with the internal dormant coding.'
  },
  {
    number: 11,
    question: "What occurs when an ET Sol enters 'full broadcast mode'?",
    hint: 'Focus on the effect this state has on the souls surrounding the ET Sol.'
  },
  {
    number: 12,
    question: 'Which ancient group was woven directly out of the Sirian-Lyran harmonic field?',
    hint: 'Identify the very first humanoid template mentioned in the history of the lands.'
  },
  {
    number: 13,
    question: 'What is the relationship between the Giants and the Lyran Lineage?',
    hint: 'Consider the size of their energy fields and their historical soul origin.'
  },
  {
    number: 14,
    question: "In what way do planetary Crystals act as 'etheric hard drives'?",
    hint: 'Think about the preservation of history and the connection to universal knowledge.'
  },
  {
    number: 15,
    question:
      'Why is the preservation of the Lyran Lineage strategically vital for the Great Awakening?',
    hint: 'Consider the effect that high-frequency consciousness has on a deceptive structure.'
  },
  {
    number: 16,
    question: "How does the 'lion of consciousness' protect ET Sols from manipulation?",
    hint: 'Focus on the inner strength and unyielding nature of this specific frequency.'
  },
  {
    number: 17,
    question: "What is the primary method used by Lyrans to 'starve' parasitic forces?",
    hint: 'Identify the emotional fuel that parasitic entities require to survive.'
  },
  {
    number: 18,
    question: 'What is the ultimate goal for souls who activate their Lyran coding?',
    hint: 'Think about the journey away from the corrupted loops of the current simulation.'
  },
  {
    number: 19,
    question:
      'Which regions are noted for having Lyran codes that react with localized crystalline deposits?',
    hint: 'Recall the two regions where Lyran codes react with localized crystalline deposits.'
  },
  {
    number: 20,
    question: 'Every soul within the Great Dome carries the Lyran lineage because:',
    hint: 'Consider the universal nature of the original blueprint for life.'
  },
  {
    number: 21,
    question: 'What is the primary difference between a Lyran soul and an ET Sol?',
    hint: 'Distinguish between the foundational frequency and the individuals carrying it out.'
  },
  {
    number: 22,
    question: 'Which celestial laboratory was used to refine the lion-hearted Lyran qualities?',
    hint: 'Identify the binary star system associated with the refinement of these traits.'
  },
  {
    number: 23,
    question: 'True or False: The Lyran Lineage is confined to a single elite group of ET Sols.',
    hint: 'Consider the reach of the original methodology of creation.'
  },
  {
    number: 24,
    question: 'What was the result of the violent removal of the Spirit Tree?',
    hint: 'Think about the effect of taking away a central power and communication source.'
  },
  {
    number: 25,
    question: 'How many worlds exist within the structure of the Great Dome?',
    hint: "Recall the specific figure used to describe the extent of the Sefrin Councils' governance."
  }
];

const QUIZ_DESC =
  'Test your understanding of Lyran Lineage — primordial builders and Custodians, the True Lyran Current, Sefrin Councils, the Spirit Tree in Hyperborea, embedded Lyran codes, and the homecoming path.';

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
  subtitle: QUIZ_DESC,
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'The Lyran Lineage is the primordial consciousness of original builders and Custodians. Sit with the True Lyran Current, the Sefrin Councils, the Spirit Tree in Hyperborea, the embedded Lyran codes that move ET Sols into full broadcast, and the homecoming path back to crystalline origins. Return to the Lyran Lineage deep-dive, infographic, and video transmissions as those codes come online.'
  },
  relatedTopic: {
    href: `/deep-dive.html?source=${SOURCE}&topic=${TOPIC_ID}`,
    label: `Return to ${TOPIC_TITLE} deep-dive`
  },
  questions
};

if (quiz.title !== TOPIC_TITLE) {
  throw new Error(`Quiz title must be exactly "${TOPIC_TITLE}"`);
}

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
  throw new Error('lyran-lineage not found in breakdown-topics.json');
}

const afterOthers = collectImageFields(mono.topics)
  .filter((e) => e.id !== TOPIC_ID)
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();
if (JSON.stringify(beforeOthers) !== JSON.stringify(afterOthers)) {
  throw new Error('Safety check failed: another topic image path was modified');
}

fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'resonating-army.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Lyran Lineage: primordial builders and Custodians, the True Lyran Current, Sefrin Councils, the Spirit Tree in Hyperborea, embedded Lyran codes, and the homecoming path.';
const replacements = [
  ['Resonating Army Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Resonating Army: pre-awakened ET souls as frequency beacons, Embedded Codes, parasitic overlays, the A.I. War Theatre, the sanctuary-bypassing homecoming path, and the Sol Frequency Lock.',
    desc
  ],
  ['quiz/breakdown/resonating-army.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/resonating-army.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=resonating-army',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Resonating Army deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['data/quizzes/breakdown/resonating-army.json', `data/quizzes/${SOURCE}/${TOPIC_ID}.json`]
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 90));
  }
  html = html.split(a).join(b);
}

html = html.replace(/Resonating Army/g, TOPIC_TITLE);
html = html
  .replace(/resonating-army\.webp/g, 'lyran-lineage.webp')
  .replace(/resonating-army\.json/g, 'lyran-lineage.json')
  .replace(/resonating-army\.html/g, 'lyran-lineage.html')
  .replace(/topic=resonating-army/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/resonating-army.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/lyran-lineage.json'
);
