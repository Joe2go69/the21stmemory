/**
 * Installs Emotional Mending quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/sanctuary-quiz.json
 * Title forced to "Emotional Mending". All 25 audited against emotional-mending report only.
 *
 * Run: node scripts/install-emotional-mending-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/emotional-mending.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'emotional-mending';
const TOPIC_TITLE = 'Emotional Mending';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/sanctuary-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/emotional-mending.webp';

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

/** Support phrases grounded only in emotional-mending.json report. */
const supportPhrases = {
  1: ['emotional mending', 'heart', 'grief', 'harmonic resonance'],
  2: ['liquid sound', 'superconductive', 'healing pools'],
  3: ['saferins', 'council of 12 suns', 'ground healers'],
  4: ['spirit tree', 'source light', 'seven domes'],
  5: ['mass panic', 'controlled', 'peaceful transition', 'great reset'],
  6: ['bypasses the mind', 'organic memory', 'intuitive sight', 'vibrational'],
  7: ['blue, aqua, silver, and pearl', 'chromotherapeutic', 'sound folds into light'],
  8: ['dome of sheol', 'recovery sanctuary', 'seven domes'],
  9: ['star family', 'modulating form', 'luminous', 'shock or panic'],
  10: ['emotional density', 'discordant', 'trauma', 'parasitic programming'],
  11: ['star pods', 'timeline trauma', 'reweaving'],
  12: ['salt', 'sound weapons', 'lower collective frequency'],
  13: ['mandatory healing', 'cannot immediately enter', 'energetic rebalancing'],
  14: ['projection dome technology', 'bend light and sound', 'invisible'],
  15: ['return to the known lands', 'ascend', 'free will'],
  16: ['resonating army', 'bypasses', 'already high and stable'],
  17: ['source memory codes', 'amnesia overlays', 'true origins'],
  18: ['density extraction', 'high-spin', 'trauma, heartbreak, and guilt'],
  19: ['non-forceful', 'pure love', 'stabilized'],
  20: ['liquid sound', 'sound-water floating', 'float'],
  21: ['light, sound, and living crystal', 'projection dome technology', 'living crystal'],
  22: ['harmonic infusion', 'source codes', 'harmonic resonance'],
  23: ['crystal halls', 'cathedrals and abbeys', 'mend the mind'],
  24: ['smiling', 'singing', 'peace'],
  25: ['atmospheric stabilization', 'higher vibration', 'parasitic fields'],
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
    [/^The source states\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The material states that\s+/i, ''],
    [/\bthe text describes them as\b/gi, 'they are'],
    [/\bthe text describes\b/gi, ''],
    [/\bthe text states\b/gi, ''],
    [/\bthe text emphasizes\b/gi, ''],
    [/\bthe text uses\b/gi, ''],
    [/\bthe text specifically identifies\b/gi, ''],
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
 * All four options at similar depth from the emotional-mending report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'Restoration of the heart field and systematic dissolution of emotional wounds such as grief, fear, guilt, and heartbreak.',
      rationale:
        'Water Domes are specifically designed for emotional mending: negative densities like grief, fear, guilt, and heartbreak are dissolved and replaced with harmonic resonance that restores the heart’s frequency.',
    },
    {
      text: 'Physical reconstruction of biological starseed bodies so souls can walk denser 3D landscapes without energetic support.',
      rationale:
        'Emotional mending targets the heart field and emotional density, not the physical reconstruction of biological vessels for 3D navigation.',
    },
    {
      text: 'Permanent archival storage of every soul memory gathered across 3D matrix cycles with no active healing sequence.',
      rationale:
        'Source memory codes help souls remember origins, but Water Domes function as active transition healing portals, not passive memory archives.',
    },
    {
      text: 'Deconstruction of mental overlays and parasitic mind-control programs as the sole purpose of the Water Domes.',
      rationale:
        'Mental restoration is the work of Crystal Halls; Water Domes form the emotional tier that mends the heart and clears emotional density.',
    },
  ],
  2: [
    {
      text: 'Liquid Sound — the highly superconductive vibrational state of water in the healing pools of the Water Domes.',
      rationale:
        'Liquid Sound is the highly superconductive vibrational state of water in the healing pools, acting as a resonant frequency medium that interacts directly with the soul’s energetic body.',
    },
    {
      text: 'Crystalline Fluid — ordinary mineral water stored in solid crystal tanks with no vibrational healing function.',
      rationale:
        'The healing medium is specifically Liquid Sound: water vibrating as a superconductive resonant state, not inert crystalline fluid storage.',
    },
    {
      text: 'Harmonic Ether — a free-floating atmospheric gas that replaces water entirely inside the emotional mending pools.',
      rationale:
        'The medium is water vibrating as liquid sound in the pools, not an ethereal gas that replaces water as the healing substance.',
    },
    {
      text: 'Source Plasma — a superheated energy plasma used only for mind-control clearing in Crystal Halls.',
      rationale:
        'The Water Domes healing medium is named Liquid Sound; Source Memory Codes ride in crystalline water, not a separate Source Plasma medium.',
    },
  ],
  3: [
    {
      text: 'The Council of 12 Suns, which dispatches Saferins as ground healers in transition sanctuaries.',
      rationale:
        'Saferins (also Saferons) are tall, gentle holographic light beings from the Council of 12 Suns who assist as ground healers in transition sanctuaries.',
    },
    {
      text: 'The Great Central Sun alone, operating as a solitary origin with no Council of 12 Suns involvement.',
      rationale:
        'Saferins are specifically dispatched from the Council of 12 Suns; that council is their named origin for ground-healer service.',
    },
    {
      text: 'The Resonating Army Command, which creates Saferins as permanent military officers of every Water Dome.',
      rationale:
        'The Resonating Army consists of already-awakened ET returners who may later assist; Saferins are a distinct Council-sent ground-healer order.',
    },
    {
      text: 'The Spirit Tree root system, which births Saferins as physical caretakers grown from living crystal bark.',
      rationale:
        'The Spirit Tree powers the Seven Domes with Source light; Saferins originate from the Council of 12 Suns as holographic ground healers.',
    },
  ],
  4: [
    {
      text: 'It acts as a central trunk that feeds the Seven Domes—including Water Domes—with pure Source light.',
      rationale:
        'All healing sanctuaries are energetically powered by the Spirit Tree root system; the tree acts as a giant trunk feeding the Seven Domes with pure Source light.',
    },
    {
      text: 'It serves as the only physical entrance portal for every soul arriving from the 3D matrix into Water Domes.',
      rationale:
        'Souls are guided to Water Domes by benevolent protectors; the Spirit Tree’s role is energetic power feed, not the physical entry gate.',
    },
    {
      text: 'It filters ocean salt into pure pool water so Liquid Sound can form without any Source-light feed role.',
      rationale:
        'Salt corruption is parasitic suppression of natural waters; the Spirit Tree feeds pure Source light into the domes rather than filtering salt.',
    },
    {
      text: 'It records the name of every soul that completes emotional mending as a permanent bureaucratic ledger.',
      rationale:
        'The Spirit Tree powers sanctuaries with Source light and carries the macro pulse into dome water; it is not a name-recording ledger of graduates.',
    },
  ],
  5: [
    {
      text: 'They route traumatized souls into cloaked sanctuaries so the Alliance can prevent mass panic during overlay collapse.',
      rationale:
        'When the parasitic 3D overlay collapses, Water Domes ensure those who do not immediately ascend are not abandoned to panic; routing souls into cloaked sanctuaries keeps a controlled, peaceful transition.',
    },
    {
      text: 'They extract technical blueprints of the 3D matrix from every soul so engineers can rebuild the old control grid.',
      rationale:
        'Strategic purpose is stabilization and peaceful transition for traumatized souls, not extraction of matrix blueprints for rebuilding control systems.',
    },
    {
      text: 'They train the Resonating Army for surface combat operations before any emotional mending can begin for others.',
      rationale:
        'The Resonating Army already bypasses sanctuaries due to high stable frequency; Water Domes stabilize recovering souls rather than train the Army for combat.',
    },
    {
      text: 'They serve only as defensive fortifications against sound weapons with no role in collective emotional recovery.',
      rationale:
        'Domes are cloaked emotional healing sanctuaries for collective stability during the Great Reset, not pure military fortifications against sound weapons.',
    },
  ],
  6: [
    {
      text: 'Vibrational realignment of the heart field after emotional density is dissolved, which bypasses the mind entirely.',
      rationale:
        'True emotional mending bypasses the mind entirely, releasing blockages at a vibrational level and automatically triggering return of organic memory and intuitive sight.',
    },
    {
      text: 'A direct data download from the Council of 12 Suns that rewrites memory without any heart-field vibrational realignment.',
      rationale:
        'Memory returns when the heart field realigns and density dissolves; Saferins stabilize the environment but do not replace vibrational heart mending with a council data dump.',
    },
    {
      text: 'Simple physical consumption of crystalline water as a drink, without immersion or any liquid-sound field interaction.',
      rationale:
        'The process is immersion and floating in liquid sound that extracts density and infuses Source codes, not mere drinking of water as a memory potion.',
    },
    {
      text: 'Extended psychological counseling sessions in which Saferins force souls to verbally reprocess every trauma in sequence.',
      rationale:
        'Emotional mending bypasses the mind at a vibrational level; Saferins offer non-forceful stewardship, not forced psychological reprocessing of every event.',
    },
  ],
  7: [
    {
      text: 'Blue, aqua, silver, and pearl — color frequencies created as sound folds into light over the glowing waters.',
      rationale:
        'Sanctuaries are projected over pure glowing waters that emit blue, aqua, silver, and pearl frequencies; these colors are created as sound folds into light as vibrational ingredients.',
    },
    {
      text: 'Gold, white, violet, and emerald as the only fixed palette used for mental overlays in Crystal Halls alone.',
      rationale:
        'Water Dome chromotherapy specifically names blue, aqua, silver, and pearl over crystalline waters, not a gold-violet-emerald Crystal Hall palette.',
    },
    {
      text: 'Red, orange, yellow, and green as static paint layers that never change with sound-to-light folding.',
      rationale:
        'The named Water Dome colors are blue, aqua, silver, and pearl, and they are not static paint—they form as sound folds into light.',
    },
    {
      text: 'Indigo, magenta, bronze, and copper as industrial light codes designed only for parasitic sound weapons.',
      rationale:
        'Chromotherapeutic architecture of the Water Domes uses blue, aqua, silver, and pearl to pull souls out of discordant bands, not parasitic weapon colors.',
    },
  ],
  8: [
    {
      text: 'It originally served as a recovery sanctuary within the Seven Domes system fed by the Spirit Tree.',
      rationale:
        'The Spirit Tree feeds the Seven Domes, including the Dome of Sheol, which originally served as a recovery sanctuary before later distortion of the broader system.',
    },
    {
      text: 'It functioned as the central command hub where the Resonating Army planned all liberation operations.',
      rationale:
        'Sheol’s original role in this teaching is recovery sanctuary within the Seven Domes, not Resonating Army command headquarters.',
    },
    {
      text: 'It was the primary training academy where Saferins learned holographic form-shifting techniques only.',
      rationale:
        'Saferins come from the Council of 12 Suns; Sheol’s original named purpose is recovery sanctuary, not Saferin training school.',
    },
    {
      text: 'It was a sealed vault that permanently stored uncorrupted Source Memory Codes away from all waters.',
      rationale:
        'Source Memory Codes are held in the crystalline waters of the healing domes; Sheol’s original role is recovery sanctuary, not a sealed code vault.',
    },
  ],
  9: [
    {
      text: 'They shift their luminous appearance to mirror the soul’s own star family, calming shock and panic.',
      rationale:
        'To eliminate shock or panic, Saferins can shift their luminous appearance to mirror the soul’s own star family, reassuring them they are safe and home.',
    },
    {
      text: 'They adopt a solid, heavy biological human body so they can force compliance through physical presence.',
      rationale:
        'Saferins operate as holographic light beings with luminous outlines and never force compliance; they modulate luminous form rather than dense biological bodies.',
    },
    {
      text: 'They appear only as abstract geometric grids with no humanoid outline and no star-family resemblance.',
      rationale:
        'Modulation specifically mirrors the soul’s star family with luminous outlines to create familiarity and safety, not pure abstract geometry alone.',
    },
    {
      text: 'They remain completely invisible at all times so recovering souls never perceive a guiding presence.',
      rationale:
        'Saferins present as tall, gentle holographic light beings and may mirror star family; they stabilize with presence rather than remaining always invisible.',
    },
  ],
  10: [
    {
      text: 'The heavy, discordant vibrational frequency of accumulated trauma, anxiety, and fear from parasitic programming.',
      rationale:
        'Emotional Density is the heavy, discordant vibrational frequency of accumulated trauma, anxiety, and fear created by parasitic programming within the 3D matrix.',
    },
    {
      text: 'A simple count of how many past lives a soul has completed inside the cube, scored without any trauma frequency component.',
      rationale:
        'Emotional Density is vibrational trauma weight from parasitic programming, not a numerical tally of incarnations alone.',
    },
    {
      text: 'The physical gravitational weight of the biological body measured only in dense 3D high-gravity zones with no trauma frequency.',
      rationale:
        'Emotional Density is an energetic/vibrational burden of trauma and fear, not the physical weight of a biological body.',
    },
    {
      text: 'A mild inability to manifest material desires quickly, treated as density though unrelated to grief, fear, guilt, or heartbreak.',
      rationale:
        'Emotional Density names accumulated trauma, anxiety, and fear (with emotional mending targeting grief, fear, guilt, and heartbreak), not mere manifestation delay.',
    },
  ],
  11: [
    {
      text: 'Star Pods — the soul tier that heals timeline trauma and reweaves fragmented aspects across timelines.',
      rationale:
        'Star Pods mend the soul, healing timeline trauma and reweaving fragmented aspects of the soul across multiple timelines within the tripartite sanctuary system.',
    },
    {
      text: 'Water Domes alone — dedicated only to timeline reweaving with no emotional heart-mending function.',
      rationale:
        'Water Domes mend the heart and clear emotional density; timeline trauma and soul reweaving belong to Star Pods.',
    },
    {
      text: 'Crystal Halls alone — focused only on timeline trauma while mental overlays remain completely untouched.',
      rationale:
        'Crystal Halls mend the mind by clearing mental overlays and mind-control damage; Star Pods handle timeline trauma and soul reweaving.',
    },
    {
      text: 'Spirit Trees as individual portable pods that reweave timelines without any Star Pod structure at all.',
      rationale:
        'The Spirit Tree powers the Seven Domes with Source light; the soul-and-timeline tier of healing is the Star Pods sanctuary class.',
    },
  ],
  12: [
    {
      text: 'To turn natural water systems into conductors for aggressive sound weapons that lower collective frequency.',
      rationale:
        'The parasitic construct suppressed natural water systems of the Known Lands, filling oceans with salt and using them as conductors for aggressive sound weapons to lower collective frequency.',
    },
    {
      text: 'To increase buoyancy for easier physical swimming of dense 3D bodies across open ocean routes without any weapon role.',
      rationale:
        'Salt was used to corrupt waters into sound-weapon conductors for frequency suppression, not as a buoyancy aid for ordinary travel.',
    },
    {
      text: 'To preserve biological ocean life as a conservation program completely unrelated to frequency-control sound weapons.',
      rationale:
        'The named purpose is suppression: salt and sound weapons lower collective frequency rather than protect marine biology.',
    },
    {
      text: 'To recreate original aquatic homeworld chemistry for starseeds arriving home with no weaponized frequency role at all.',
      rationale:
        'Salt filling is parasitic suppression that enables aggressive sound weapons; Water Domes use uncorrupted crystalline water beyond that distortion.',
    },
  ],
  13: [
    {
      text: 'False — distorted or traumatized souls must first rebalance energetically before entering high-frequency realms.',
      rationale:
        'Healing sanctuaries are transition halls, not optional scenery: souls distorted or traumatized by the 3D overlay cannot immediately enter high-frequency realms without first undergoing energetic rebalancing.',
    },
    {
      text: 'True — every traumatized soul may skip Water Domes and ascend instantly with no rebalancing requirement.',
      rationale:
        'Mandatory healing before transition means traumatized souls cannot immediately enter high-frequency realms without sanctuary rebalancing.',
    },
    {
      text: 'True — only Crystal Halls are required; emotional density may remain fully intact during immediate ascent.',
      rationale:
        'Emotional mending in Water Domes addresses heart density as part of safe transition; traumatized souls need energetic rebalancing, not free bypass of the heart tier.',
    },
    {
      text: 'True — Saferins issue permanent bypass certificates so any soul can enter high realms without pool immersion.',
      rationale:
        'Saferins never force, but they also do not cancel the requirement that traumatized souls rebalance before high-frequency entry; healing remains necessary for safe transition.',
    },
  ],
  14: [
    {
      text: 'Crystalline projection dome technology that bends light and sound waves, keeping domes invisible and cloaked.',
      rationale:
        'Domes are built from light, sound, and living crystal and use advanced projection dome technology to bend light and sound waves, remaining completely invisible and cloaked from lower 3D senses.',
    },
    {
      text: 'Quantum phase shifting alone, with no projection dome technology and no light-and-sound bending of the sanctuary shell.',
      rationale:
        'The named cloaking method is advanced projection dome technology that bends light and sound waves for crystalline invisibility.',
    },
    {
      text: 'Atmospheric gas masking that hides structures by fog alone without any crystalline projection system or light bending.',
      rationale:
        'Invisibility comes from projection dome technology bending light and sound, not ordinary atmospheric fog masking.',
    },
    {
      text: 'Magnetic field distorting grids that hide only the pools while full dome shells remain completely visible in lower 3D.',
      rationale:
        'Entire Water Domes remain completely invisible and cloaked from lower 3D senses via projection technology, not partial magnetic camouflage of pools alone.',
    },
  ],
  15: [
    {
      text: 'Return to the Known Lands in a fresh cycle within a restored crystalline world free of parasitic overlays.',
      rationale:
        'After amnesia dissolves, souls may choose to ascend to higher lighter realms or return to the Known Lands in a fresh cycle in a fully restored crystalline physical world free from parasitic overlays.',
    },
    {
      text: 'Mandatory enlistment in the Resonating Army to clear the remaining 3D matrix with no other path allowed.',
      rationale:
        'Restored free will offers ascent or Known Lands return; joining the Resonating Army is not a required assignment after emotional mending.',
    },
    {
      text: 'Permanent residence inside Water Domes as lifelong guides with no option to ascend or return to Known Lands.',
      rationale:
        'Sanctuaries are transition halls; once mended, souls exercise free will to ascend or return rather than remain permanent dome residents.',
    },
    {
      text: 'Automatic conversion into Saferin ground healers with no sovereign choice of ascent or Known Lands return.',
      rationale:
        'Saferins are Council-dispatched holographic healers; mended souls choose ascent or a restored Known Lands cycle, not forced Saferin conversion.',
    },
  ],
  16: [
    {
      text: 'False — the Resonating Army already holds high stable frequency and bypasses these healing sanctuaries.',
      rationale:
        'The Resonating Army (already-awakened ET returners) bypasses the need for these healing sanctuaries because their frequencies are already high and stable; they may later enter to assist ground healers.',
    },
    {
      text: 'True — every Resonating Army member must complete full emotional mending before any liberation mission.',
      rationale:
        'They bypass Water Domes because their frequencies are already high and stable; mandatory emotional mending is not required for them.',
    },
    {
      text: 'True — Saferins bar the Resonating Army from homecoming until all three sanctuary tiers are finished.',
      rationale:
        'Bypass is the default for already-stable Army frequencies; later entry is a strategic choice to assist others, not a barred prerequisite on homecoming.',
    },
    {
      text: 'True — they must finish Star Pod timeline reweaving first even when emotional density is already clear.',
      rationale:
        'Pre-awakened high frequency lets them bypass sanctuaries entirely; optional later entry is to assist ground healers, not a forced Star Pod first step.',
    },
  ],
  17: [
    {
      text: 'They enable souls to bypass amnesia overlays and remember true origins through visions and sound.',
      rationale:
        'Source Memory Codes are foundational uncorrupted vibrational patterns in the crystalline waters that enable souls to bypass amnesia overlays and remember true origins through visions and sound.',
    },
    {
      text: 'They act only as a firewall locking parasites out of pools without restoring any origin memory at all.',
      rationale:
        'Source Memory Codes restore remembrance of true origins by bypassing amnesia; they are not described as a mere anti-parasite firewall.',
    },
    {
      text: 'They track the geographic location of a soul’s abandoned 3D body as a navigation beacon system only.',
      rationale:
        'Codes are uncorrupted vibrational patterns for origin memory and amnesia bypass, not trackers of a leftover 3D body location.',
    },
    {
      text: 'They calculate a numeric score of remaining emotional density with no visionary or auditory recall role.',
      rationale:
        'Source Memory Codes trigger remembrance through visions and sound after density clears; they are not density-scoring instruments.',
    },
  ],
  18: [
    {
      text: 'High-spin liquid sound waves draw out heavy emotional density—trauma, heartbreak, and guilt—from the field.',
      rationale:
        'During Density Extraction, high-spin liquid sound waves draw out heavy emotional density, pulling away trauma, heartbreak, and guilt as the soul floats in the pools.',
    },
    {
      text: 'The soul’s entire memory bank is erased temporarily so pain cannot be felt during the rest of the sequence.',
      rationale:
        'Density Extraction removes trauma density while Source codes and later memory triggering restore origin memory; the step is not wholesale memory erasure.',
    },
    {
      text: 'The soul must mentally revisit and narrate every traumatic event before any density can leave the grid.',
      rationale:
        'Emotional mending bypasses the mind; density extraction is vibrational via liquid sound waves, not forced mental recounting of every trauma.',
    },
    {
      text: 'Saferins use dense physical tools to manually pry trauma out of the body against the soul’s will.',
      rationale:
        'Saferins never force; extraction is performed by high-spin liquid sound waves interacting with the energetic field during immersion.',
    },
  ],
  19: [
    {
      text: 'They stabilize the environment with pure love and tranquility, monitoring until vibration is fully stabilized.',
      rationale:
        'Saferins never force or demand compliance; they stabilize the environment with pure love and tranquility, monitoring the soul until vibration is completely stabilized.',
    },
    {
      text: 'They act as judges who approve or deny ascension based on a formal score of remaining emotional density.',
      rationale:
        'Stewardship is non-forceful stabilization with love and tranquility, not judicial approval or denial of ascension by score.',
    },
    {
      text: 'They enforce strict compliance protocols that demand every healing stage be completed under threat of expulsion.',
      rationale:
        'Saferins never force or demand compliance; their role is gentle environmental stabilization and monitoring until vibration settles.',
    },
    {
      text: 'They manifest as heavy physical bodies whose only comfort method is literal touch and physical embrace.',
      rationale:
        'They operate as holographic light beings with luminous outlines, not heavy biological forms relying on physical embrace.',
    },
  ],
  20: [
    {
      text: 'Sound-water floating, where liquid sound interacts with the soul’s energetic field during pool immersion.',
      rationale:
        'In the step-by-step process, after immersion the soul floats while water vibrating as liquid sound interacts with the energetic field—Sound-Water Floating / liquid sound float.',
    },
    {
      text: 'Physical detoxification of the dense 3D body through chemical baths with no liquid-sound interaction.',
      rationale:
        'The sequence centers on crystalline-body immersion and liquid-sound floating for density extraction, not chemical detox of a dense 3D body.',
    },
    {
      text: 'Mental recalibration lectures that replace immersion entirely with spoken Crystal Hall curriculum only.',
      rationale:
        'Emotional mending includes immersion and liquid-sound floating in Water Domes; mental work belongs to Crystal Halls as a separate tier.',
    },
    {
      text: 'Amnesia reinforcement so the soul forgets trauma permanently without any harmonic infusion of Source codes.',
      rationale:
        'The process extracts density and infuses Source codes to restore memory and harmonic resonance, opposite of reinforcing amnesia.',
    },
  ],
  21: [
    {
      text: 'False — Water Domes are constructed from light, sound, and living crystal using projection dome technology.',
      rationale:
        'Structural composition is crystalline projection technology: domes are built from light, sound, and living crystal, not traditional stone and mortar of the dense 3D world.',
    },
    {
      text: 'True — Water Domes are built primarily from physical stone and mortar quarried across the Known Lands.',
      rationale:
        'Domes are light, sound, and living crystal projected and cloaked structures, not stone-and-mortar buildings.',
    },
    {
      text: 'True — only the outer shell is stone while the inner pools use living crystal with no light-sound structure.',
      rationale:
        'The domes as a whole are constructed from light, sound, and living crystal via projection technology, not a stone shell hybrid.',
    },
    {
      text: 'True — cathedral masonry from Crystal Hall overlays is reused as the primary Water Dome construction material.',
      rationale:
        'Cathedral and abbey overlays historically hide Crystal Halls; Water Domes themselves are light-sound-living-crystal projection sanctuaries over waters.',
    },
  ],
  22: [
    {
      text: 'Uncorrupted Source codes transfer into the soul’s grid, filling the space left by extracted density with harmonic resonance.',
      rationale:
        'During Harmonic Infusion, uncorrupted Source codes stored in the water transfer into the soul’s grid, replacing empty space with harmonic resonance after density extraction.',
    },
    {
      text: 'Past-life trauma is encoded into a crystal archive for study while the soul remains empty of resonance.',
      rationale:
        'Harmonic Infusion fills the soul’s grid with Source codes and harmonic resonance; it does not archive trauma into crystals for later study.',
    },
    {
      text: 'Permission is granted to leave the Known Lands immediately without any Source-code transfer into the grid.',
      rationale:
        'Harmonic Infusion is an in-pool grid transfer of Source codes; sovereign choice of path comes after full mending, not as a substitute for this step.',
    },
    {
      text: 'The soul is merged with a twin flame inside the pool as the only mechanism of harmonic completion.',
      rationale:
        'The step transfers Source codes into the individual soul’s grid after density extraction; twin-flame merger is not part of Harmonic Infusion.',
    },
  ],
  23: [
    {
      text: 'True — Crystal Halls (historically overlaid by cathedrals and abbeys) mend the mind within the tripartite system.',
      rationale:
        'In the tripartite sanctuary system, Crystal Halls—historically overlaid by cathedrals and abbeys—mend the mind, clearing mental overlays, parasitic programming, and mind-control damage.',
    },
    {
      text: 'False — Crystal Halls were never overlaid by religious architecture and have no mind-mending function at all.',
      rationale:
        'Crystal Halls are explicitly the mind-mending tier and were historically overlaid by cathedrals and abbeys in the tripartite system description.',
    },
    {
      text: 'False — only Water Domes were hidden under cathedrals, while Crystal Halls stayed fully visible as open temples.',
      rationale:
        'The cathedral and abbey overlays are named for Crystal Halls (mind tier), while Water Domes are cloaked projection sanctuaries over crystalline waters.',
    },
    {
      text: 'False — Star Pods were the structures overlaid by cathedrals, and Crystal Halls only reweave timeline trauma.',
      rationale:
        'Star Pods mend the soul and timelines; Crystal Halls mend the mind and are the tier historically overlaid by cathedrals and abbeys.',
    },
  ],
  24: [
    {
      text: 'Smiling and singing, restored to peace and emotional balance after the full mending sequence.',
      rationale:
        'At Emergence, the soul emerges lighter, smiling, and singing, restored to a state of peace and emotional balance.',
    },
    {
      text: 'Falling into a deep dreamless sleep so integration of codes can occur without any joy expression.',
      rationale:
        'Emergence is described as lighter, smiling, and singing in peace—not an immediate dreamless sleep without expression.',
    },
    {
      text: 'Instantly materializing a new dense physical body before any peace or harmonic balance is restored.',
      rationale:
        'The emergence state is emotional balance expressed as smiling and singing; sovereign choice of physical return comes after mending, not as the exit gesture itself.',
    },
    {
      text: 'Questioning purpose and location in panic because Saferins withhold all orientation until later stages.',
      rationale:
        'Saferins establish safety and home; emergence is peace and joy (smiling and singing), not panic and disorientation.',
    },
  ],
  25: [
    {
      text: 'True — ambient frequency is stabilized so souls recover at higher vibration without external parasitic interference.',
      rationale:
        'Atmospheric Stabilization keeps ambient frequency perfectly stabilized, allowing souls to exist and recover at a higher vibration without detection or interference from external parasitic fields.',
    },
    {
      text: 'False — the dome atmosphere remains fully open to parasitic fields so souls must heal under constant interference.',
      rationale:
        'Stabilization specifically protects recovery from external parasitic field interference while souls hold higher vibration.',
    },
    {
      text: 'False — stabilization only cools the pools chemically and has no effect on ambient frequency or vibration.',
      rationale:
        'Atmospheric Stabilization is a frequency condition of the sanctuary environment, not a mere chemical cooling of pool water.',
    },
    {
      text: 'False — higher vibration recovery is blocked until souls leave the dome and face the open 3D overlay again.',
      rationale:
        'Recovery at higher vibration happens inside the stabilized dome environment, shielded from external parasitic interference.',
    },
  ],
};

const questionsMeta = [
  {
    number: 1,
    question:
      'What is the primary function of the Water Domes within the broader cosmic system?',
    hint: "Consider which part of the tripartite system handles the heart and emotional density.",
  },
  {
    number: 2,
    question:
      'Which term describes the highly superconductive vibrational state of water used in the healing pools?',
    hint: 'Think about the intersection of sound frequencies and the fluid medium of the pools.',
  },
  {
    number: 3,
    question: 'Where do the tall, gentle light beings known as Saferins originate from?',
    hint: 'Look for a specific governing solar council mentioned in the teaching.',
  },
  {
    number: 4,
    question: 'What role does the Spirit Tree play in the functioning of the Water Domes?',
    hint: "Focus on the energetic infrastructure and the trunk analogy for the Seven Domes.",
  },
  {
    number: 5,
    question:
      'Why is the presence of Water Domes considered strategically vital for the Great Reset?',
    hint: 'Think about management of the collective during total systemic collapse of the 3D overlay.',
  },
  {
    number: 6,
    question:
      'In the process of emotional mending, what causes the soul to regain organic memory and intuitive sight?',
    hint: "Recall how dissolution of amnesia is triggered in the soul's energetic grid.",
  },
  {
    number: 7,
    question:
      'Which colors are utilized in the chromotherapeutic architecture of the Water Domes to pull a soul out of discordant frequencies?',
    hint: 'Identify the palette associated with glowing waters and sound folding into light.',
  },
  {
    number: 8,
    question:
      'What was the original purpose of the Dome of Sheol within the Seven Domes system?',
    hint: 'Look for the connection between Sheol and recovery sanctuaries fed by the Spirit Tree.',
  },
  {
    number: 9,
    question: 'How do Saferins modify their appearance when assisting a soul in the Water Domes?',
    hint: 'Consider the method used to minimize shock or panic for a recovering soul.',
  },
  {
    number: 10,
    question: "What is Emotional Density in the context of the 3D matrix?",
    hint: 'Think about the vibrational effects of trauma and parasitic programming.',
  },
  {
    number: 11,
    question:
      'Which sanctuary tier is responsible for healing timeline trauma and reweaving fragmented aspects of the soul?',
    hint: 'Identify the component of the tripartite system that focuses on the soul and timelines.',
  },
  {
    number: 12,
    question: 'Why did the parasitic construct fill the oceans of the Known Lands with salt?',
    hint: 'Consider the relationship between salt, conductivity, and vibrational control weapons.',
  },
  {
    number: 13,
    question:
      'True or False: Souls traumatized by the 3D overlay can freely bypass healing sanctuaries and ascend immediately.',
    hint: 'Is energetic rebalancing required before entering high-frequency realms?',
  },
  {
    number: 14,
    question: 'What technology is used to keep the Water Domes hidden from lower 3D senses?',
    hint: 'Focus on the method used to bend light and sound waves for cloaking.',
  },
  {
    number: 15,
    question:
      "Once a soul's emotional body is fully mended and amnesia dissolves, what is one sovereign choice they can exercise?",
    hint: 'What are the two primary paths after heart restoration and free-will return?',
  },
  {
    number: 16,
    question:
      'True or False: The Resonating Army must undergo the same emotional mending process in the Water Domes as traumatized souls.',
    hint: "Recall the frequency status of already-awakened ET returners.",
  },
  {
    number: 17,
    question: "What is the specific role of Source Memory Codes within the water of the domes?",
    hint: "Think about what is uncorrupted and how it affects amnesia overlays.",
  },
  {
    number: 18,
    question: "What happens during the Density Extraction phase of the mending process?",
    hint: "Look for the mechanical action of high-spin liquid sound waves.",
  },
  {
    number: 19,
    question: 'How do the Saferins interact with souls during the healing process?',
    hint: "Consider the term non-forceful stewardship.",
  },
  {
    number: 20,
    question: 'Which of these is a key step in the step-by-step process of Emotional Mending?',
    hint: "Which step involves the soul interacting with superconductive water as liquid sound?",
  },
  {
    number: 21,
    question:
      'True or False: The Water Domes are constructed primarily from physical stone and mortar found in the Known Lands.',
    hint: "Check structural composition for materials of light, sound, and living crystal.",
  },
  {
    number: 22,
    question: "What is the result of the Harmonic Infusion step in the healing sequence?",
    hint: "Think about what fills the empty space after density is extracted.",
  },
  {
    number: 23,
    question:
      'True or False: In the tripartite system, the Crystal Halls were historically overlaid by cathedrals and abbeys.',
    hint: "Look at the Tripartite Sanctuary System description for historical overlays.",
  },
  {
    number: 24,
    question: "What does the soul emerge doing after the mending process is complete?",
    hint: "How is the state of peace expressed upon leaving the pool?",
  },
  {
    number: 25,
    question:
      'True or False: Atmospheric stabilization within the domes allows souls to recover at a higher vibration without interference from external parasitic fields.',
    hint: "Recall Atmospheric Stabilization in the structural composition section.",
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
    'Test your grasp of Emotional Mending — Water Domes heart restoration, liquid sound density extraction, Saferins from the Council of 12 Suns, Source memory codes, tripartite sanctuaries, and sovereign choice after amnesia dissolves.',
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'Emotional Mending is the heart-restoration path inside Water Domes. Sit with liquid sound that draws out grief, fear, guilt, and heartbreak; Saferins who stabilize without force; Source memory codes that bypass amnesia; and the Spirit Tree pulse feeding the Seven Domes. Return to the Emotional Mending deep-dive, infographic, and video transmissions as you hold the sovereign choice to ascend or return to a restored crystalline Known Lands cycle.',
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
    'Test your understanding of Emotional Mending — Water Domes heart restoration; liquid sound and density extraction; Saferins (Saferons) from the Council of 12 Suns; Source memory codes; Crystal Halls and Star Pods; Spirit Tree feed; and sovereign choice after restoration.',
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
        t.description.includes('Decoded analysis of Emotional Mending')
      ) {
        t.description =
          'Emotional Mending is the heart-restoration process within Water Domes — liquid sound dissolves grief, fear, guilt, and heartbreak, Source memory codes restore harmonic resonance, and Saferins from the Council of 12 Suns stabilize recovering souls.';
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('emotional-mending not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from water-domes quiz (sibling under Healing Sanctuaries)
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'water-domes.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Emotional Mending: Water Domes heart restoration, liquid sound density extraction, Saferins from the Council of 12 Suns, Source memory codes, tripartite sanctuaries, and sovereign choice after amnesia dissolves.';
const replacements = [
  ['Water Domes Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Water Domes: liquid sound and emotional density, Ground Healers from the Council of 12 Suns, Crystal Halls and Star Pods, Spirit Tree axis, cloaking fields, and sovereign choice after heart restoration.',
    desc,
  ],
  ['quiz/breakdown/water-domes.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/water-domes.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=water-domes',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`,
  ],
  ['Water Domes deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Water Domes</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/water-domes.json',
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
  .replace(/Interactive Living Truth Quiz on Water Domes[^"]*/g, desc)
  .replace(/Water Domes/g, TOPIC_TITLE);

// Restore intentional "Water Domes" phrasing inside the quiz blurb (not the topic title).
html = html.replace(
  /Interactive Living Truth Quiz on Emotional Mending: Emotional Mending heart restoration/g,
  'Interactive Living Truth Quiz on Emotional Mending: Water Domes heart restoration'
);

// Fix over-replacement on paths if any slipped
html = html
  .replace(/Emotional Mending\.webp/g, 'emotional-mending.webp')
  .replace(/Emotional Mending\.json/g, 'emotional-mending.json')
  .replace(/Emotional Mending\.html/g, 'emotional-mending.html')
  .replace(/topic=Emotional Mending/g, `topic=${TOPIC_ID}`)
  .replace(/topic=emotional-mending/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/water-domes.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/emotional-mending.json'
);
