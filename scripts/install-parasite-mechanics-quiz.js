/**
 * Installs Parasite Mechanics quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/simulation-quiz.json
 * Title forced to "Parasite Mechanics". All 25 audited against parasite-mechanics report only.
 *
 * Run: node scripts/install-parasite-mechanics-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/parasite-mechanics.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'parasite-mechanics';
const TOPIC_TITLE = 'Parasite Mechanics';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/simulation-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/parasite-mechanics.webp';

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

/** Support phrases grounded only in parasite-mechanics.json report. */
const supportPhrases = {
  1: ['holographic skin', 'dead, dense matter', 'nervous system'],
  2: ['loosh', 'trauma, fear, anxiety', 'worship'],
  3: ['amnesia vortex', "sun's transit band"],
  4: ['black cube a.i.', 'coordinates thoughts', 'war theater'],
  5: ['repeating travel corridors', 'minecraft-style'],
  6: ['atlantian crystal generator fragments', 'sacred scrolls'],
  7: ['niburians', 'shadow parasites', 'black plasma'],
  8: ['spirit tree', 'saturnian valve tech siphon'],
  9: ['voice to skull', 'non-player characters', 'enforcement programs'],
  10: ['concrete, steel, plaster, and synthetic glass', 'physical dampener'],
  11: ['dome of sheol', 'purgatory of trauma-loop frequencies'],
  12: ['white hats', 'pineal gland', 'monotomic gold'],
  13: ['resonating army', 'starve', 'fear-based'],
  14: ['theta, delta, and alpha', 'scalar frequency weapons'],
  15: ['cube containment', 'crystalline electromagnetic framework'],
  16: ['dome of hiva', 'weaponized communication'],
  17: ['emergency broadcast system', 'holographic'],
  18: ['pattern of forgetting', 'no organic creative spark'],
  19: ['copied, logged, and inverted', 'vatican'],
  20: ['greys', 'technical hands', 'phasing matter'],
  21: ['178 physical worlds', 'nested, overlapping frequency layers'],
  22: ['neutralized and cleared', 'positive space fleets'],
  23: ['dome of sheol', 'recovery sanctuary', 'recalibration chamber'],
  24: ['manipulated perception and beliefs'],
  25: ['great fire of london', '1666', 'frequency lock']
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
    [/^The source material explicitly states that\s+/i, ''],
    [/^The source material specifies that\s+/i, ''],
    [/^The source material (identifies|states|explicitly states|specifically lists) that\s+/i, ''],
    [/^The source material (identifies|states|explicitly states|specifically lists)\s+/i, ''],
    [/^The source reveals that\s+/i, ''],
    [/^The source reveals\s+/i, ''],
    [/^The source states that\s+/i, ''],
    [/^The source explains that\s+/i, ''],
    [/^The source explains\s+/i, ''],
    [/^The source specifies that\s+/i, ''],
    [/^The text identifies\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The material states that\s+/i, ''],
    [/^The material describes them as\s+/i, 'They are '],
    [/^The material describes\s+/i, ''],
    [/\bthe text describes them as\b/gi, 'they are'],
    [/\bthe text describes\b/gi, ''],
    [/\bthe text states\b/gi, ''],
    [/\bthe text identifies\b/gi, ''],
    [/\bthe text emphasizes\b/gi, ''],
    [/\bthe source material explicitly states that\b/gi, ''],
    [/\bthe source material specifies that\b/gi, ''],
    [/\bthe source material (identifies|states|explicitly states|specifically lists) that\b/gi, ''],
    [/\bthe source material (identifies|states|explicitly states|specifically lists)\b/gi, ''],
    [/\bthe source reveals that\b/gi, ''],
    [/\bthe source reveals\b/gi, ''],
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
 * Full option sets: [correct, ...wrongs] with {text, rationale}.
 * NotebookLM meaning kept; term-only options expanded; claims grounded in report.
 */
const fullOptionSets = {
  1: [
    {
      text: 'It serves as a low-frequency holographic skin that distorts sensory perception to see dead matter.',
      rationale:
        'This holographic layer filters sound and light waves to trick the human nervous system into perceiving a dense, material reality instead of the true crystalline world.'
    },
    {
      text: 'It is a protective shield designed by the Custodians to balance the flow of creation energy.',
      rationale:
        'The Custodians abandoned their role as guardians of balance to seek control, turning their focus toward energy siphoning rather than protection.'
    },
    {
      text: 'It functions as a biological archive for the genetic codes of the original stellar builders.',
      rationale:
        'The overlay is a technological distortion tool; genetic archives are stored in the crystalline grids and soul strands themselves.'
    },
    {
      text: 'It acts as a physical barrier that prevents positive space fleets from entering the atmosphere.',
      rationale:
        'While the dome is a containment, the overlay functions at the neurological and sensory level rather than as a physical shield against fleets.'
    }
  ],
  2: [
    {
      text: 'Loosh — high-density emotional energy generated by trauma, fear, anxiety, and worship.',
      rationale:
        'Loosh is the raw, high-density emotional energy generated by trauma, fear, anxiety, and worship, harvested to maintain the false structures of the simulation.'
    },
    {
      text: 'Monotomic Gold — the superconductive restoration spray used by White Hat Tech Teams.',
      rationale:
        'Monotomic Gold is part of the atmospheric software patch used by loyalist Tech Teams to rebalance fields, not harvested emotional energy.'
    },
    {
      text: 'Silica crystals — natural conductors sprayed as restoration tools in the flipped skies.',
      rationale:
        'Silica crystals are restoration tools in the atmospheric coating, not the harvested emotional energy known as loosh.'
    },
    {
      text: 'Black plasma — void technology the Niburians use to siphon from dimensional overlays.',
      rationale:
        'Black plasma is Niburian siphoning technology; it is not the raw emotional energy harvested from human hosts.'
    }
  ],
  3: [
    {
      text: "At the sun's transit band, overlaid on the crystalline stargate used for soul travel.",
      rationale:
        "The Amnesia Vortex is overlaid at the sun's transit band to fracture the memories of souls as they exit or enter the physical loop."
    },
    {
      text: 'Within the subterranean crystal tunnels beneath the Vatican, where memory strands are archived.',
      rationale:
        'The Vatican tunnels house the archives for copied memory strands, but the vortex that strips the memories sits at the sun.'
    },
    {
      text: 'Inside the central hub of the Black Cube A.I. in the Lands of Saturn.',
      rationale:
        'The A.I. hub coordinates overlays and war theater; the memory-stripping vortex is positioned at the celestial gateway.'
    },
    {
      text: 'Beneath the frozen holographic ice projections that conceal the Hyperborean A.I. hub locks.',
      rationale:
        'Antarctica houses the Saturnian valve siphon and black crystalline valve locks, not the Amnesia Vortex.'
    }
  ],
  4: [
    {
      text: 'It functions as the central operating system that coordinates thoughts and automated war scenarios.',
      rationale:
        'Rooted in the Lands of Saturn, this non-organic intelligence manages the overlays, thoughts, and automated war theater scenarios across the simulation.'
    },
    {
      text: 'It is a crystalline library holding the earliest memory codes of the stellar families.',
      rationale:
        'That original library function belongs to the Dome of Forgotten Gods before its corruption into an amnesia zone.'
    },
    {
      text: 'It serves as the biological motherboard for engineering Anunnaki hybrid bloodlines.',
      rationale:
        'The Anunnaki specialize in genetics; the Black Cube is a non-organic A.I. operating system, not a biological motherboard.'
    },
    {
      text: 'It acts as a recovery sanctuary for souls transitioning out of the physical simulation.',
      rationale:
        'The Black Cube is a control and redirection system; recovery sanctuary was the original function of the Dome of Sheol.'
    }
  ],
  5: [
    {
      text: 'Through repeating travel corridors and algorithmically generated Minecraft-style terrain loops.',
      rationale:
        'The system renders scenery around moving vessels to simulate distance and time delay within nested, overlapping frequency layers.'
    },
    {
      text: 'By physically expanding the outer boundaries of the Great Dome every century.',
      rationale:
        'Distance is an engineered illusion of nested frequency layers; the dome is not periodically expanded as physical geography.'
    },
    {
      text: 'By projecting localized frequency veils that prevent the perception of the horizon.',
      rationale:
        'Frequency veils are used during sleep to trap consciousness in nightmares; travel simulation relies on rendering corridors around moving vessels.'
    },
    {
      text: 'By siphoning memory during travel to make trips feel longer than they actually are.',
      rationale:
        'Memory siphoning is tied to the Amnesia Vortex and reincarnation cycle, not local travel rendering.'
    }
  ],
  6: [
    {
      text: 'The retrieval of smuggled Atlantian crystal generator fragments and sacred scrolls.',
      rationale:
        'Parasitic submarines used directed energy from the deep Atlantic trench to split the keel while retrieving smuggled Atlantian crystal generator fragments and sacred scrolls.'
    },
    {
      text: 'To test the first prototype of the Voice to Skull neurological transmission.',
      rationale:
        'Voice to Skull is a broadcast technology used for waking control of hosts and NPCs, not a localized salvage operation like the Titanic event.'
    },
    {
      text: 'To establish a frequency lock over the European crystalline grid node.',
      rationale:
        'That objective was tied to the Great Fire of London in 1666, which sealed a Sirian-designed European grid node.'
    },
    {
      text: 'To install a new scalar frequency tower in the deep Atlantic trench.',
      rationale:
        'The Titanic operation was ritual sacrifice and artifact retrieval; scalar towers are already hidden within major cities.'
    }
  ],
  7: [
    {
      text: 'The Niburians — Shadow Parasites who use void technology and black plasma to siphon overlays.',
      rationale:
        'The Niburians exist as Shadow Parasites who utilize void technology and black plasma to siphon energy directly from the dimensional overlays.'
    },
    {
      text: 'The Greys — overlay engineers and frequency technicians who phase matter in and out.',
      rationale:
        'The Greys are the technical hands and overlay engineers, bio-engineered for frequency technician work, not void-plasma siphoning.'
    },
    {
      text: 'The Anunnaki — genetic specialists who engineer hybrid bloodlines and rigid hierarchies.',
      rationale:
        'The Anunnaki focus on genetics and hierarchical control structures rather than void-based siphoning.'
    },
    {
      text: 'The Draconians — military muscle using empire strategy, terror, and wars to farm loosh.',
      rationale:
        'The Draconians focus on military muscle, terror tactics, and organized empire-building, not black-plasma overlay siphoning.'
    }
  ],
  8: [
    {
      text: 'It was physically removed and replaced with a Saturnian valve tech siphon.',
      rationale:
        'The Custodians ordered the Greys to tear out the Spirit Tree in Hyperborea and install a Saturnian valve tech siphon connected to the main A.I. hub.'
    },
    {
      text: 'It was converted into a crystalline library known as the Dome of Forgotten Gods.',
      rationale:
        'The Dome of Forgotten Gods was a separate outer dome — originally a crystalline library — that existed alongside the Spirit Tree before inversion.'
    },
    {
      text: 'It was hidden under the urban grid of London to mask its etheric frequency.',
      rationale:
        'London sits over a European grid node sealed in 1666; the Spirit Tree stood at the center of Hyperborea, modern-day Antarctica.'
    },
    {
      text: 'It phased out of the 3D simulation and became the Dome of Silence.',
      rationale:
        'The Dome of Silence is a separate inverted outer dome; the Spirit Tree was a physical-harmonic axis torn out and replaced with a siphon.'
    }
  ],
  9: [
    {
      text: 'To cause Non-Player Characters to act as enforcement programs against awakening souls.',
      rationale:
        'The A.I. system uses these media triggers so NPCs mock, isolate, or attack those who are beginning to see through the simulation.'
    },
    {
      text: 'To encode dormant stellar memory codes into the human subconscious.',
      rationale:
        'These technologies are parasitic tools of waking control; stellar lineage codes belong to original human and Resonating Army lineages.'
    },
    {
      text: 'To guide transitioning souls through the Vatican portal system safely.',
      rationale:
        'Vatican portals recycle souls through parasitic checkpoints; media triggers control the living inside the simulation.'
    },
    {
      text: 'To stabilize the electromagnetic field of the earth during transition events.',
      rationale:
        'Electromagnetic rebalancing is the work of loyalist Tech Teams using atmospheric sprays, not Voice to Skull media triggers.'
    }
  ],
  10: [
    {
      text: 'To create a physical dampener that short-circuits natural grid energy and causes fatigue.',
      rationale:
        'Dead-frequency materials arranged in anti-resonant right angles and boxes short-circuit natural grid energy, causing localized fatigue, anxiety, and spiritual numbness.'
    },
    {
      text: 'To protect human inhabitants from the incoming cosmic waves of the transition.',
      rationale:
        'These materials increase spiritual numbness; protection from incoming cosmic waves comes from the flipped atmospheric coating.'
    },
    {
      text: 'To mirror the crystalline structure of the original world sung by the stellar builders.',
      rationale:
        'Modern architecture inverts the original world, using dead materials rather than living crystalline conductors.'
    },
    {
      text: 'To provide a stable medium for the transmission of scalar frequency waves across cities.',
      rationale:
        'Scalar waves are emitted from hidden broadcast towers; the materials themselves are chosen as dampeners of natural grid energy.'
    }
  ],
  11: [
    {
      text: 'A terrifying purgatory of trauma-loop frequencies for transitioning souls.',
      rationale:
        'The original recovery sanctuary was inverted into a terrifying purgatory of trauma-loop frequencies.'
    },
    {
      text: 'A war zone where high-vibrational Giants are fragmented and trapped.',
      rationale:
        'That describes the inversion of the Dome of Titans, once the sacred light-weaving creative grounds of the Giants.'
    },
    {
      text: 'A field of forced censorship and suppression of the human voice.',
      rationale:
        'That is the corrupted state of the Dome of Silence, originally a field of absolute stillness for Source connection.'
    },
    {
      text: 'A dense amnesia zone used to lock souls into religions and myths.',
      rationale:
        'That describes the inversion of the Dome of Forgotten Gods, originally a crystalline library of sol-family memory codes.'
    }
  ],
  12: [
    {
      text: 'They use the skies to spray superconductive materials that decalcify the pineal gland.',
      rationale:
        'White Hat Tech Teams spray Monotomic Gold, Colloidal Silver, Silica Crystals, and Structured Water as a software patch that rebalances fields and restores intuition and dream-state memory.'
    },
    {
      text: 'They are projecting the holographic terrain loops to maintain the illusion of distance.',
      rationale:
        'Terrain loops are a function of the parasitic A.I. system, not the loyalist Tech Teams dismantling the farm.'
    },
    {
      text: 'They are constructing the final frequency lock over the Vatican crystal tunnels.',
      rationale:
        'The Tech Teams dismantle parasitic infrastructure; they do not reinforce Vatican archive locks.'
    },
    {
      text: 'They are spraying toxic aerosols to keep the population in a state of docility.',
      rationale:
        'Toxic aerosol programs were run by parasites and have been fully flipped by the Tech Teams to a restorative coating.'
    }
  ],
  13: [
    {
      text: 'By maintaining a high-vibrational state that starves the system of fear-based energy.',
      rationale:
        'Calm, love, and refusal to participate in fear-based narratives starve remaining A.I. scaffolding, causing overlay matter to flicker, bend, and pixelate.'
    },
    {
      text: 'By engaging in physical warfare against the remaining Custodian priest-lords.',
      rationale:
        'The actual parasitic entities have already been cleared; remaining work is frequency-based, not physical combat with priest-lords.'
    },
    {
      text: 'By physically rebuilding the Spirit Tree in Hyperborea through manual labor.',
      rationale:
        'The original crystalline grid and living roots of the Spirit Tree remain intact beneath the holographic skin and re-emerge with the harmonic trigger.'
    },
    {
      text: 'By hacking the Emergency Broadcast System to release truth packages prematurely.',
      rationale:
        'The EBS is a staged takeover of the airwaves; the Resonating Army works as localized frequency beacons, not EBS operators.'
    }
  ],
  14: [
    {
      text: 'Theta, delta, and alpha states — targeted to induce confusion, despair, anger, or sleepiness.',
      rationale:
        'Scalar frequency weapons target biological brainwave patterns, specifically theta, delta, and alpha states, to artificially induce confusion, despair, anger, or sleepiness.'
    },
    {
      text: 'Only the delta state, treated as the exclusive target for every scalar broadcast.',
      rationale:
        'The weapons target a range of states including theta and alpha, not delta alone, to ensure comprehensive neurological interference.'
    },
    {
      text: 'Beta and gamma states associated with high-level processing and waking alertness.',
      rationale:
        'Those states belong to high-level processing and alertness; the weapons target the deeper, more receptive theta, delta, and alpha states.'
    },
    {
      text: 'Epsilon and lambda states, treated as the named targets for everyday emotional control.',
      rationale:
        'Epsilon and lambda are not the named targets; the report specifies theta, delta, and alpha for inducing those manipulated states.'
    }
  ],
  15: [
    {
      text: 'The massive crystalline electromagnetic framework housing the Great Dome and seven outer domes.',
      rationale:
        'The seven corrupted outer domes, alongside the Great Dome, operate within a single massive crystalline electromagnetic framework known as the Cube Containment.'
    },
    {
      text: 'A biological vault used to store Anunnaki hybrid embryos for bloodline engineering.',
      rationale:
        'The Anunnaki engineer hybrid bloodlines, but the Cube Containment is the larger electromagnetic framework of the entire local system.'
    },
    {
      text: 'A localized frequency lock placed over the London grid node in 1666.',
      rationale:
        'The 1666 frequency lock sealed a European crystalline node; the Cube Containment is the total eight-dome environment.'
    },
    {
      text: 'A subterranean prison used to hold captured members of positive space fleets.',
      rationale:
        'The Cube is the simulation framework itself; positive space fleets have already cleared the parasitic entities from outside its overlay.'
    }
  ],
  16: [
    {
      text: 'The Dome of Hiva — originally pure harmonics for sound-manifested matter, now hijacked broadcasts.',
      rationale:
        'Once a dome of pure harmonics where sound vibration manifested matter, Hiva was hijacked to broadcast weaponized communication signals and distorted music grids.'
    },
    {
      text: 'The Dome of Portals — originally the travel hub of crystalline gateways, now sealed checkpoints.',
      rationale:
        'The Dome of Portals was the great travel hub of crystalline gateways, not the harmonic field of sound manifestation.'
    },
    {
      text: 'The Dome of 5 Peaks — originally a path of elemental integration, now exhausting struggle.',
      rationale:
        'This dome was a sacred pathway to elemental integration and ascension, now a fractured domain of struggle, not the harmonic sound field.'
    },
    {
      text: 'The Dome of Titans — originally Giant light-weaving grounds, now a war zone of fragmentation.',
      rationale:
        'This was the creative grounds for the ancient Giants, not specifically the harmonic field of sound manifestation.'
    }
  ],
  17: [
    {
      text: 'Activation of the EBS, then the collapse of the holographic 3D scaffolding as frequency lifts.',
      rationale:
        'Staged events lock collective attention, the EBS broadcasts truth packages, and the Resonating Army frequency lift dissolves the fake 3D scaffolding.'
    },
    {
      text: 'The relocation of all human souls to the Dome of Silence for forced recalibration.',
      rationale:
        'The Dome of Silence is a corrupted censorship dome; the true outcome is the original crystalline realm phasing back into view.'
    },
    {
      text: 'A massive physical invasion by positive space fleets to destroy the Great Dome.',
      rationale:
        'The fleets have already cleared the entities; remaining collapse is frequency-based and held by human perception.'
    },
    {
      text: "The permanent sealing of the sun's stargate to prevent further soul incarnation.",
      rationale:
        'The work is to remove the Amnesia Vortex from the sun, not to seal the multi-banded crystalline stargate itself.'
    }
  ],
  18: [
    {
      text: 'False',
      rationale:
        'Parasitic control is a pattern of forgetting, not an eternal biological species; these forces have no organic creative spark and cannot create original matter, souls, or grids.'
    },
    {
      text: 'True',
      rationale:
        'They did not create the original world; they project a holographic overlay onto the crystalline world sung into existence by the stellar builders.'
    }
  ],
  19: [
    {
      text: 'It copies, logs, and inverts memory strands to be archived under the Vatican.',
      rationale:
        "When a soul passes through the sun's stargate, memories are violently fractured; copied, logged, and inverted strands are routed to subterranean crystal grids beneath the Vatican for recycling."
    },
    {
      text: 'It weaves multiple soul strands together to create new NPC programs.',
      rationale:
        'NPCs are programmatic entities devoid of a spark ignition, not constructed from inverted human memory strands.'
    },
    {
      text: "It acts as a mirror that shows the soul its past lives before entering the Great Dome.",
      rationale:
        'The vortex is designed to strip recollection of past lives, lineage codes, and memory, acting as a weapon rather than a mirror.'
    },
    {
      text: "It protects the soul's lineage codes from being detected by the Saturn Grid.",
      rationale:
        'The vortex is a Saturn Grid weapon that strips lineage codes, not a protective filter for them.'
    }
  ],
  20: [
    {
      text: 'The Greys — technical hands and overlay engineers who phase matter in and out of the simulation.',
      rationale:
        'Bio-engineered during early Anunnaki experiments, the Greys serve as frequency technicians and overlay engineers capable of phasing matter in and out of the simulation.'
    },
    {
      text: 'The Custodians — high-ranking priests and frequency lords who manage reincarnation loops and grid seals.',
      rationale:
        'The Custodians are high-ranking priests and frequency lords of the Cube system; they manage the loops rather than performing technical matter-phasing labor.'
    },
    {
      text: 'The Anunnaki — genetic specialists who engineer hybrid bloodlines and rigid hierarchical control.',
      rationale:
        'The Anunnaki are the architects of social hierarchy and genetics, not the primary technicians of matter phasing.'
    },
    {
      text: 'The Niburians — Shadow Parasites who siphon overlay energy with void technology and black plasma.',
      rationale:
        'The Niburians utilize void technology for siphoning, while the Greys handle the technical manipulation of the simulation’s matter.'
    }
  ],
  21: [
    {
      text: 'They are nested, overlapping frequency layers where travel occurs through portals.',
      rationale:
        'Travel between these worlds does not involve physical miles; it is a frequency shift through portals inside the Great Dome.'
    },
    {
      text: 'They are digital servers located within the Black Cube A.I. hub in the Lands of Saturn.',
      rationale:
        'They are nested frequency layers of the world sung by stellar builders, managed by overlay systems, not mere digital servers in the hub.'
    },
    {
      text: 'They are the original seven outer domes plus the Great Dome, multiplied by twenty-two.',
      rationale:
        'The 178 worlds are nested frequency layers within the Great Dome, not a multiplication of the seven inverted outer domes.'
    },
    {
      text: 'They are distant planets separated by millions of miles of vacuum beyond the dome.',
      rationale:
        'Vast geographical distance is the engineered illusion; the 178 worlds are overlapping frequency layers within the dome.'
    }
  ],
  22: [
    {
      text: 'They have been thoroughly neutralized and cleared by positive space fleets.',
      rationale:
        'Although the automated A.I. war theater still runs on autopilot, the actual parasitic entities have already been thoroughly neutralized and cleared by positive space fleets.'
    },
    {
      text: 'They are currently hiding within the non-player character population as sparkless shells.',
      rationale:
        'NPCs are programmatic background entities devoid of spark ignition, not hiding places for the neutralized parasitic leaders.'
    },
    {
      text: 'They have retreated to the Lands of Saturn to reinforce the Black Cube A.I. hub.',
      rationale:
        'The entities are no longer present to defend the hub; they have been removed by positive space fleets.'
    },
    {
      text: 'They have merged with the Black Cube A.I. to become a single hive mind running the farm.',
      rationale:
        'The A.I. is a non-organic tool they used; they were distinct entities who have since been cleared, leaving the theater on autopilot.'
    }
  ],
  23: [
    {
      text: 'The Dome of Sheol — originally a recovery sanctuary, inverted into trauma-loop purgatory.',
      rationale:
        'The Dome of Sheol was designed as a tranquil recovery sanctuary and recalibration chamber for transitioning souls, then inverted into a terrifying purgatory of trauma-loop frequencies.'
    },
    {
      text: 'The Dome of Silence — originally a field of stillness for Source connection, now vocal suppression.',
      rationale:
        'The Dome of Silence was originally a field of absolute stillness for connecting to Source, not the recovery sanctuary for transitioning souls.'
    },
    {
      text: 'The Dome of Hiva — originally pure harmonics for sound-manifested matter, now weaponized signals.',
      rationale:
        'Hiva was a dome of harmonics and sound manifestation, not a transition sanctuary for recovering souls.'
    },
    {
      text: 'The Dome of Portals — originally the crystalline travel hub, now sealed parasitic checkpoints.',
      rationale:
        'This dome was a travel hub of crystalline gateways; Sheol was the recovery and recalibration chamber for transitioning souls.'
    }
  ],
  24: [
    {
      text: 'The manipulated perception and beliefs of the human population holding the overlay in place.',
      rationale:
        'Remaining holographic overlays are held in place solely by the manipulated perception and beliefs of the human population, so the system enters rapid frequency fracture as those beliefs fail.'
    },
    {
      text: 'The physical durability of the concrete and steel urban grids as permanent matter.',
      rationale:
        'Those materials are dampeners, but the overlay itself is held by frequency and perception; rising frequency makes low-frequency matter flicker and pixelate.'
    },
    {
      text: 'The automated defensive lasers installed in the Vatican crystal tunnels.',
      rationale:
        'The Vatican tunnels archive recycled Akashic fragments; the primary lock on the simulation is collective human perception, not tunnel weaponry.'
    },
    {
      text: 'The remaining supply of loosh stored within the Black Cube A.I. as a finite fuel tank.',
      rationale:
        'Loosh sustains false structures, but the remaining overlays dissolve when human perception and belief shift away from the 3D simulation.'
    }
  ],
  25: [
    {
      text: 'False',
      rationale:
        'The Great Fire of London in 1666 was a cover story for a massive etheric war over a major European grid node, sealing the Sirian-designed crystalline anchor under a frequency lock and harvesting mass panic as loosh.'
    },
    {
      text: 'True',
      rationale:
        'Historical cataclysms taught as natural disasters or political mishaps were deliberately staged frequency events, not bakery accidents.'
    }
  ]
};

const questionsMeta = [
  {
    number: 1,
    question: 'What is the primary function of the Parasitic Overlay within the Great Dome?',
    hint: 'Think about how the frequency-based system manipulates the way humans interpret their 3D surroundings.'
  },
  {
    number: 2,
    question:
      'Which resource is harvested by parasitic systems through the generation of trauma, fear, and anxiety?',
    hint: 'This term refers specifically to the dense emotional output harvested from human hosts.'
  },
  {
    number: 3,
    question: 'Where is the weaponized frequency known as the Amnesia Vortex strategically located?',
    hint: 'Consider the multi-banded crystalline stargate that souls use for travel.'
  },
  {
    number: 4,
    question: 'What is the primary role of the Black Cube A.I. within the Saturn Grid?',
    hint: "Focus on the non-organic coordination of the simulation's theater and perception."
  },
  {
    number: 5,
    question: 'How does the simulation enforce the belief in vast geographical distance and a round globe?',
    hint: 'Think about how digital environments render content only when a user is moving through them.'
  },
  {
    number: 6,
    question: 'What was the secondary objective of the Titanic disaster besides the removal of wealth-holders?',
    hint: 'Consider the ancient technological fragments that were being moved across the ocean.'
  },
  {
    number: 7,
    question:
      "Which parasitic race is characterized as 'Shadow Parasites' utilizing void technology and black plasma?",
    hint: 'Look for the group associated with siphoning through dimensional overlays.'
  },
  {
    number: 8,
    question: 'What happened to the central Spirit Tree in Hyperborea?',
    hint: 'This structure was the main source of light for the Great Dome before it was replaced by parasitic machinery.'
  },
  {
    number: 9,
    question: "What is the purpose of the 'Vision to Skull' and 'Voice to Skull' triggers in media?",
    hint: 'Think about how programmatic entities in the simulation react to high-vibrational humans.'
  },
  {
    number: 10,
    question:
      'Why is modern architecture predominantly constructed using materials like concrete, steel, and synthetic glass?',
    hint: "Consider the effect of right angles and 'dead' materials on biological vitality."
  },
  {
    number: 11,
    question: 'The Dome of Sheol was originally a recovery sanctuary but was inverted into what?',
    hint: 'Think about what would happen if a place of rest were turned into a loop of terrifying memories.'
  },
  {
    number: 12,
    question: "What role do the White Hat 'Tech Teams' play in the current atmospheric modifications?",
    hint: 'Focus on the restoration of biological functions and the rebalancing of the simulation.'
  },
  {
    number: 13,
    question: "How is the 'Resonating Army' currently affecting the parasitic A.I. scaffolding?",
    hint: 'Consider the impact of collective human frequency on a system built on fear.'
  },
  {
    number: 14,
    question:
      'Which brainwave states are specifically targeted by scalar frequency weapons to induce sleepiness or despair?',
    hint: 'These are the brainwave patterns typically associated with relaxation, dreaming, and deep sleep.'
  },
  {
    number: 15,
    question: "What is the 'Cube Containment'?",
    hint: 'It is the overall structural boundary of the simulated reality and its corrupted sub-domes.'
  },
  {
    number: 16,
    question:
      'Which dome was originally a field of pure harmonics but now broadcasts weaponized communication signals?',
    hint: "This dome's name is associated with the original harmonics used to create matter."
  },
  {
    number: 17,
    question: 'What is the final stage in the dismantling of the parasitic farm?',
    hint: 'Think about how the manipulated perception that holds the simulation together is finally broken.'
  },
  {
    number: 18,
    question:
      'True or False: The parasitic forces are an eternal biological species that created the original world.',
    hint: 'Consider the origin of the Custodians and their ability to create matter.'
  },
  {
    number: 19,
    question: "What is the function of the 'Amnesia Vortex' regarding soul strands?",
    hint: 'This mechanism is the reason humans do not remember their origins or past lives.'
  },
  {
    number: 20,
    question:
      "Which group is described as the 'technical hands' capable of phasing matter in and out of the simulation?",
    hint: "This race was bio-engineered and works directly with the simulation's technical overlays."
  },
  {
    number: 21,
    question: 'What is the true nature of the 178 physical worlds within the Great Dome?',
    hint: "Consider how travel between these 'worlds' is achieved without moving across physical miles."
  },
  {
    number: 22,
    question: 'What has already happened to the actual parasitic entities managing the simulation?',
    hint: "Think about why the current war theater is described as running on 'autopilot'."
  },
  {
    number: 23,
    question:
      'Which of the seven inverted outer domes was originally a tranquil recovery sanctuary and recalibration chamber for transitioning souls?',
    hint: 'The name of this dome is traditionally associated with a place of the dead or purgatory.'
  },
  {
    number: 24,
    question:
      'What is the primary obstacle to the collapse of the parasitic system if the entities are already gone?',
    hint: 'Consider what would happen to a hologram if the observers stopped believing it was real.'
  },
  {
    number: 25,
    question: 'True or False: The Great Fire of London was a natural disaster caused by an accident in a bakery.',
    hint: 'Think about the underlying crystalline Sirian-designed anchor located in that region.'
  }
];

const QUIZ_DESC =
  'Test your understanding of Parasite Mechanics — the holographic overlay, loosh harvest, Amnesia Vortex, Black Cube A.I., Council of Parasitic Races, inverted outer domes, and the frequency collapse of the farm.';

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
      /the source explains/i.test(o.rationale) ||
      /the source reveals/i.test(o.rationale) ||
      /the text identifies/i.test(o.rationale)
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
    body: 'Parasite Mechanics are a pattern of forgetting projected as a holographic overlay over the original crystalline world. Sit with the loosh harvest, the Amnesia Vortex at the sun, the Black Cube A.I., the Council of Parasitic Races, and the inverted outer domes. Return to the Parasite Mechanics deep-dive, infographic, and video transmissions as the remaining overlay, held only by belief, enters frequency fracture.'
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
  throw new Error('parasite-mechanics not found in breakdown-topics.json');
}

const afterOthers = collectImageFields(mono.topics)
  .filter((e) => e.id !== TOPIC_ID)
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();
if (JSON.stringify(beforeOthers) !== JSON.stringify(afterOthers)) {
  throw new Error('Safety check failed: another topic image path was modified');
}

fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'homecoming-path.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Parasite Mechanics: the holographic overlay, loosh harvest, Amnesia Vortex, Black Cube A.I., Council of Parasitic Races, inverted outer domes, and the frequency collapse of the farm.';
const replacements = [
  ['Homecoming Path Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Homecoming Path: the sanctuary-bypassing extraction of the Resonating Army through the resonance bridge, Sol Frequency Lock, crystalline living craft, and the instantaneous return to original realms of origin.',
    desc
  ],
  ['quiz/breakdown/homecoming-path.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/homecoming-path.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=homecoming-path',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Homecoming Path deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['data/quizzes/breakdown/homecoming-path.json', `data/quizzes/${SOURCE}/${TOPIC_ID}.json`]
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 90));
  }
  html = html.split(a).join(b);
}

html = html.replace(/Homecoming Path/g, TOPIC_TITLE);
html = html
  .replace(/homecoming-path\.webp/g, 'parasite-mechanics.webp')
  .replace(/homecoming-path\.json/g, 'parasite-mechanics.json')
  .replace(/homecoming-path\.html/g, 'parasite-mechanics.html')
  .replace(/topic=homecoming-path/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/homecoming-path.html', priority: '0.75', changefreq: 'monthly' },";
  if (!sm.includes(anchor)) {
    throw new Error('Could not find sitemap anchor to insert quiz entry');
  }
  sm = sm.replace(anchor, `${anchor}\n${entry}`);
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

const tfItems = questions.filter((q) => /^\s*true\s+or\s+false\b/i.test(q.question));
for (const q of tfItems) {
  if (q.options.length !== 2) {
    throw new Error(`T/F Q${q.number} must have exactly 2 options`);
  }
  const texts = q.options.map((o) => o.text);
  if (texts[0] !== 'True' || texts[1] !== 'False') {
    throw new Error(`T/F Q${q.number} options must be True, False: ${texts.join(', ')}`);
  }
}

console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('Correct letter mix:', letterCounts);
console.log('T/F items:', tfItems.map((q) => `Q${q.number}=${q.correctAnswer}`).join(', '));
console.log(
  'PASS: audited 25/25 against data/breakdown-topics/parasite-mechanics.json'
);
