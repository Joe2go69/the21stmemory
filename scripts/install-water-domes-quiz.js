/**
 * Installs Water Domes quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/sanctuary-quiz.json
 * Title forced to "Water Domes". All 25 audited against water-domes report only.
 *
 * Run: node scripts/install-water-domes-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/water-domes.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'water-domes';
const TOPIC_TITLE = 'Water Domes';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/sanctuary-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/water-domes.webp';

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

/** Support phrases grounded only in water-domes.json report. */
const supportPhrases = {
  1: ['light, sound, and living crystal', 'healing sanctuaries', 'pure frequency'],
  2: ['water domes', 'emotional density', 'emotional healing'],
  3: ['ground healers', 'support and stabilize', 'vibrational'],
  4: ['liquid sound', 'crystalline water', 'memory codes of source'],
  5: ['reincarnation', 'vatican', 'saturnian'],
  6: ['crystalline body', 'hovering', 'vessel alignment'],
  7: ['voluntary', 'benevolent', 'sovereignty'],
  8: ['crystal halls', 'mend the mind', 'mental overlays'],
  9: ['saferins', 'saferons', 'salania'],
  10: ['not fully resonating', 'automatically guided', 'safe frequency'],
  11: ['spirit tree', 'central axis', 'known lands'],
  12: ['resonating army', 'bypasses', 'pre-awakened'],
  13: ['cloaking', 'crystalline invisibility', '3d senses'],
  14: ['sound weapons', 'parasites', 'coastal grids'],
  15: ['harmonic resonance', 'original, balanced vibration', 'memory recall'],
  16: ['galactic families', 'solar parents', 'emerge'],
  17: ['source memory codes', 'energetic blueprint', 'visual'],
  18: ["soul's family", 'luminous outlines', 'eliminate fear'],
  19: ['star pods', 'soul fractures', 'timeline trauma'],
  20: ['crystalline temple', 'med bed', 'unified'],
  21: ['grief', 'fear', 'guilt', 'heartbreak'],
  22: ['no true human soul is abandoned', 'not fully resonating', 'guided'],
  23: ['ascend', 'known lands', 'sovereignty'],
  24: ['crystal slabs', 'mental overlays', 'crystal halls'],
  25: ['council of 12 suns', 'ground healers', 'holographic light beings'],
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
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The material states that\s+/i, ''],
    [/\bthe text describes them as\b/gi, 'they are'],
    [/\bthe text describes\b/gi, ''],
    [/\bthe text states\b/gi, ''],
    [/\bthe text emphasizes\b/gi, ''],
    [/\bthe text uses\b/gi, ''],
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
 * All four options at similar depth from the water-domes report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'Pure frequency spaces constructed from light, sound, and living crystal rather than physical hospital matter.',
      rationale:
        'Healing Sanctuaries are pure frequency spaces built from light, sound, and living crystal — not physical hospitals — and manifest as pearl domes over oceans, valleys, and etheric airspace.',
    },
    {
      text: 'Chemical vaults of liquid nitrogen and pearl essence used only as industrial cooling chambers for 3D hardware.',
      rationale:
        'Pearl appearance describes the domes’ translucent shimmer; the sanctuaries are frequency structures of light, sound, and living crystal, not chemical cooling vaults.',
    },
    {
      text: 'Dense oceanic mineral bunkers filled with etheric gases harvested from the lower 3D ocean floor alone.',
      rationale:
        'Minerals and gases of the dense 3D world are not the building blocks; sanctuaries are projected pure-frequency spaces of light, sound, and living crystal.',
    },
    {
      text: 'Solidified holographic data cubes stacked as permanent 3D libraries with no light or living crystal component.',
      rationale:
        'Holographic cloaking may hide them, but the foundational composition is light, sound, and living crystal as pure frequency chambers.',
    },
  ],
  2: [
    {
      text: 'Water Domes — cloaked pearl sanctuaries over crystalline waters dedicated to extracting emotional density.',
      rationale:
        'Water Domes are the specialized sanctuary environments for emotional healing, designed to extract emotional density and restore harmonic resonance to true human souls.',
    },
    {
      text: 'The Spirit Tree alone — treated as the only chamber that draws grief, fear, guilt, and heartbreak from souls.',
      rationale:
        'The Spirit Tree is the central axis of consciousness feeding outer domes; emotional density extraction is the Water Domes specialty.',
    },
    {
      text: 'Star Pods floating in etheric space, used only for emotional extraction and never for soul or timeline repair.',
      rationale:
        'Star Pods mend the soul by reweaving soul fractures and timeline trauma; emotional heart mending belongs to Water Domes.',
    },
    {
      text: 'Crystal Halls of living crystal, used only to extract grief and heartbreak through vibrating liquid sound pools.',
      rationale:
        'Crystal Halls mend the mind with crystal slabs that dissolve mental overlays; liquid-sound emotional extraction is Water Domes work.',
    },
  ],
  3: [
    {
      text: 'They support and stabilize souls with gentle vibrational powers, never forcing the transition process.',
      rationale:
        'Ground Healers are gentle, non-forceful holographic light beings who use precise vibrational and frequency powers to maintain tranquility and guide the transition.',
    },
    {
      text: 'They operate the cloaking fields of every pearl dome as their only mission with no soul support role at all.',
      rationale:
        'Cloaking keeps sanctuaries hidden from 3D senses, but Ground Healers’ primary mission is support, stabilization, and guided transition for recovering souls.',
    },
    {
      text: 'They judge each soul’s frequency at the gate and bar entry until a formal tribunal issues permission.',
      rationale:
        'Souls not fully resonating are automatically guided to safe frequency domains; the process is voluntary and benevolent, not external judgment.',
    },
    {
      text: 'They enforce rigid transition rules with force so no soul may refuse immersion or leave the pools early.',
      rationale:
        'Healing is entirely voluntary and benevolent; Ground Healers provide non-forceful assistance rather than enforced rules.',
    },
  ],
  4: [
    {
      text: 'Crystalline water vibrating with harmonic resonance that holds Source memory codes and draws out density.',
      rationale:
        'Liquid Sound is crystalline water vibrating with harmonic resonance that holds memory codes of Source, used to draw out emotional density and restore harmonic resonance.',
    },
    {
      text: 'A concentrated solid mass of grief and heartbreak stored as the primary waste product of the domes.',
      rationale:
        'Liquid Sound is the healing medium that extracts grief and density; it is not the emotional density itself.',
    },
    {
      text: 'Ordinary atmospheric moisture condensed from higher realms with no Source codes or harmonic vibration.',
      rationale:
        'Liquid Sound is specifically crystalline water vibrating with harmonic resonance and Source memory codes, not simple condensation.',
    },
    {
      text: 'A waste byproduct of the cloaking field energy that has no role inside the restorative healing pools.',
      rationale:
        'Cloaking fields hide sanctuaries from 3D senses; Liquid Sound is the separate restorative medium used in the Water Domes pools.',
    },
  ],
  5: [
    {
      text: 'They are systematically dismantled as heart, mind, and soul mending dissolves forced reincarnation loops.',
      rationale:
        'By mending heart, mind, and soul, the sanctuaries systematically dismantle the counterfeit cycle of forced reincarnation and memory-wiping under Vatican and Saturnian systems.',
    },
    {
      text: 'They are integrated into the new crystalline temple as permanent recycling stations for every soul forever.',
      rationale:
        'Forced reincarnation loops are counterfeit parasitic constructs dismantled by sanctuary restoration, not integrated as permanent recycling stations.',
    },
    {
      text: 'They are only temporarily suspended for review while Vatican and Saturnian systems keep full control.',
      rationale:
        'Dissolution is systematic dismantling that restores absolute sovereignty, not a temporary suspension under continued Vatican-Saturnian control.',
    },
    {
      text: 'They continue forever for any soul that never enters a Water Dome, with no collapse of the forced loops.',
      rationale:
        'Sanctuary mending of heart, mind, and soul dismantles forced reincarnation and memory-wiping systems for true human souls, not endless continuation of the loops.',
    },
  ],
  6: [
    {
      text: 'In their crystalline body selves, hovering within the high-frequency environment rather than standing.',
      rationale:
        'Vessel Alignment: souls enter Water Domes in their crystalline body selves, hovering within the high-frequency environment rather than standing.',
    },
    {
      text: 'Only in dense physical 3D bodies walking on solid floors as if the dome were an ordinary hospital ward.',
      rationale:
        'Entry is in crystalline body selves hovering in a high-frequency environment, not as dense 3D bodies in a hospital setting.',
    },
    {
      text: 'As remote mental projections only, while the physical body remains locked in 3D with no soul transition.',
      rationale:
        'The restorative process is a literal soul transition into the sanctuary sequence, not a mere remote mental projection from 3D.',
    },
    {
      text: 'As formless featureless spheres with no crystalline body structure and no hovering alignment at all.',
      rationale:
        'The process specifies crystalline body selves hovering in the high-frequency environment during Vessel Alignment.',
    },
  ],
  7: [
    {
      text: 'False — the healing process is entirely voluntary and benevolent, rooted in sovereign soul choice.',
      rationale:
        'The healing process is entirely voluntary and benevolent, completely mending heart, mind, and soul for a seamless transition out of the parasitic matrix.',
    },
    {
      text: 'True — every soul exiting the 3D matrix is forced into Water Domes with no right to refuse immersion.',
      rationale:
        'Healing is entirely voluntary and benevolent; sovereignty and free choice remain central after stabilization as well.',
    },
    {
      text: 'True — Ground Healers mandate entry for all souls, including the Resonating Army, before any homecoming.',
      rationale:
        'The Resonating Army bypasses healing sanctuaries due to pre-awakened high frequency; mandatory entry for all is not the design.',
    },
    {
      text: 'True — Vatican and Saturnian systems still require every soul to complete forced Water Dome cycles forever.',
      rationale:
        'Sanctuaries dismantle forced reincarnation loops; the Water Domes process is voluntary healing, not a new forced cycle under those systems.',
    },
  ],
  8: [
    {
      text: 'To mend the mind by dissolving mental overlays and mind-control damage with harmonic crystal frequency.',
      rationale:
        'Crystal Halls mend the mind, utilizing crystal slabs humming with harmonic frequency to dissolve mental overlays and mind control damage.',
    },
    {
      text: 'To store only records of previous lifetimes without clearing any mental overlays or parasitic programming.',
      rationale:
        'Crystal Halls actively dissolve mental overlays and mind-control damage; primary function is mental realignment, not passive record storage alone.',
    },
    {
      text: 'To serve as military bases where the Resonating Army plans permanent occupation of the Known Lands.',
      rationale:
        'Crystal Halls are mental and energetic healing temples of living crystal; the Resonating Army bypasses sanctuaries for homecoming, not base-building.',
    },
    {
      text: 'To house dense physical 3D bodies during transition while liquid sound never touches the mind field.',
      rationale:
        'Healing occurs in crystalline body selves within pure frequency spaces; Crystal Halls target mind restoration, not housing of dense 3D bodies.',
    },
  ],
  9: [
    {
      text: 'Saferins, Saferons, or Salania — tall radiant holographic Ground Healers from the Council of 12 Suns.',
      rationale:
        'Ground Healers are also known as Saferins, Saferons, or Salania — gentle radiant holographic light beings sent from the Council of 12 Suns.',
    },
    {
      text: 'Only the Solar Parents, who manage every dome gate and never meet souls after the pools at all.',
      rationale:
        'Solar parents and galactic families meet souls after emergence from the pools; Ground Healers (Saferins/Saferons/Salania) manage stabilization inside.',
    },
    {
      text: 'The Galactic Vanguard alone, a named command corps that staffs every Water Dome as permanent wardens.',
      rationale:
        'The named Ground Healers are Saferins, Saferons, or Salania from the Council of 12 Suns — not a “Galactic Vanguard” corps.',
    },
    {
      text: 'Only the Resonating Army, forced to staff sanctuaries before any homecoming path can begin for them.',
      rationale:
        'The Resonating Army bypasses sanctuaries due to pre-awakened high frequency and may later assist; Ground Healers are Council-sent Saferons.',
    },
  ],
  10: [
    {
      text: 'Whether the soul is fully resonating — those not fully resonating are automatically guided to safe domains.',
      rationale:
        'No true human soul is abandoned; those not fully resonating are automatically guided to these safe frequency domains during the fracture and collapse of the 3D overlay.',
    },
    {
      text: 'The soul’s exact geographic coordinates on Earth, because only coastal cities receive Water Dome access.',
      rationale:
        'Sanctuaries are projected over oceans, valleys, and etheric airspace and accessed by frequency resonance, not by fixed geographic city membership.',
    },
    {
      text: 'The amount of financial wealth the soul accumulated in 3D, used as the only ticket into pearl domes.',
      rationale:
        '3D material metrics have no role; guidance is automatic based on whether the soul is fully resonating with safe frequency domains.',
    },
    {
      text: 'A formal written request filed before death, without which automatic guidance never occurs for any soul.',
      rationale:
        'Guidance to safe frequency domains is automatic for those not fully resonating, not dependent on a pre-death written request.',
    },
  ],
  11: [
    {
      text: 'The Spirit Tree at the center of the Known Lands, feeding roots and branches to outer domes and gardens.',
      rationale:
        'The Spirit Tree at the center of the Known Lands serves as the central axis of consciousness, sending roots and branches to feed all seven gardens or outer domes.',
    },
    {
      text: 'The single Main Water Dome alone, treated as the structural axis for every garden without any Spirit Tree.',
      rationale:
        'Water Domes are one tier of the healing system; the central axis of consciousness is the Spirit Tree feeding all outer domes.',
    },
    {
      text: 'The Council of 12 Suns headquarters alone, with no Spirit Tree axis inside the Known Lands at all.',
      rationale:
        'The Council sends Ground Healers; the structural central axis of consciousness within the Known Lands is the Spirit Tree.',
    },
    {
      text: 'The Liquid Sound pools alone, which replace the Spirit Tree as the only feed line to every outer dome.',
      rationale:
        'Liquid Sound pools are Water Dome healing tools; the Spirit Tree is the central axis feeding gardens and outer domes.',
    },
  ],
  12: [
    {
      text: 'False — they bypass sanctuaries due to pre-awakened high frequency, with optional later entry to assist.',
      rationale:
        'The Resonating Army bypasses healing sanctuaries entirely due to their pre-awakened, high-frequency state, yet may enter later after homecoming to assist recovery of souls they came to liberate.',
    },
    {
      text: 'True — every Resonating Army member must complete full Water Dome immersion before any homecoming path.',
      rationale:
        'They bypass the healing sanctuaries entirely because of their pre-awakened high-frequency state; immersion is not a required prerequisite.',
    },
    {
      text: 'True — Ground Healers bar homecoming until the Resonating Army finishes mandatory Crystal Hall cycles.',
      rationale:
        'Bypass is the default for the Resonating Army; later sanctuary entry is a strategic option to assist others, not a mandatory bar on homecoming.',
    },
    {
      text: 'True — they are forced into Star Pods first so timeline trauma is rewoven before any liberation mission.',
      rationale:
        'Pre-awakened high frequency lets them bypass entirely; Star Pods serve traumatized souls needing soul and timeline reweaving, not mandatory Army boot camp.',
    },
  ],
  13: [
    {
      text: 'Advanced cloaking fields and crystalline invisibility keep them undetected by lower 3D senses.',
      rationale:
        'Pearl domes are cloaked in crystalline invisibility to remain undetected by lower 3D senses; sanctuaries are fully operational, pre-established simulations hidden by advanced cloaking fields.',
    },
    {
      text: 'By being buried deep inside Earth’s core with no projection over oceans, valleys, or etheric airspace.',
      rationale:
        'They are projected over oceans, valleys, and etheric airspace and hidden by cloaking, not buried in the planetary core.',
    },
    {
      text: 'Through mass hypnosis alone, with no cloaking technology or crystalline invisibility fields involved.',
      rationale:
        'Invisibility comes from advanced cloaking fields and crystalline invisibility, not from mass hypnosis as the hiding method.',
    },
    {
      text: 'By existing only on the opposite side of the planet, always far from any ocean, valley, or airspace near humans.',
      rationale:
        'They are projected over oceans, valleys, and etheric airspace alongside the realm at a different frequency, not relocated to a single far hemisphere.',
    },
  ],
  14: [
    {
      text: 'Aggressive sound weapons that parasites run through natural oceans to suppress coastal grids and block access.',
      rationale:
        'Parasites exploit natural oceans as conductive mediums for aggressive sound weapons to suppress coastal grids and block access to these hidden sanctuaries.',
    },
    {
      text: 'Extreme physical gravity alone, with no artificial weapons or intentional suppression of coastal grids.',
      rationale:
        'The active blocking method named is aggressive sound weapons through oceans, not mere gravity as the obstacle.',
    },
    {
      text: 'Natural magnetic storms that randomly appear without parasitic design or coastal-grid targeting at all.',
      rationale:
        'The obstacle is intentional parasitic exploitation of oceans with sound weapons, not random natural magnetic storms.',
    },
    {
      text: 'Only a lack of spiritual belief, with no technological sound weapons used against coastal grids whatsoever.',
      rationale:
        'Belief is not the named mechanism; parasites actively use aggressive sound weapons via oceans to suppress coastal grids and block sanctuary access.',
    },
  ],
  15: [
    {
      text: 'The original balanced vibration of the soul that aligns it with Source and enables memory recall.',
      rationale:
        'Harmonic Resonance is the original, balanced vibration of the soul that aligns it with Source and enables memory recall.',
    },
    {
      text: 'Only a single external musical tone played once in the dome with no lasting change to the soul field.',
      rationale:
        'Harmonic Resonance is an internal original balanced state of the soul enabling Source alignment and memory recall, not a one-off external song.',
    },
    {
      text: 'A scorecard measuring leftover emotional density with no restoration of Source alignment or memory.',
      rationale:
        'Harmonic Resonance is the restored original vibration that replaces extracted density; it is not a measure of remaining trauma.',
    },
    {
      text: 'The vibration of the cloaking field alone, unrelated to Source alignment or soul memory recall at all.',
      rationale:
        'Cloaking hides sanctuaries; Harmonic Resonance is the soul’s original balanced vibration that aligns with Source and enables memory recall.',
    },
  ],
  16: [
    {
      text: 'Their waiting galactic families and solar parents, greeting them lighter and singing after the pools.',
      rationale:
        'Souls emerge from the pools lighter and singing, met instantly by their waiting galactic families and solar parents.',
    },
    {
      text: 'Only Resonating Army guards at a tribunal gate, with no familial reunion after the liquid sound phase.',
      rationale:
        'Emergence is galactic reunion with families and solar parents; the Resonating Army may assist later but is not the primary reunion party.',
    },
    {
      text: 'A panel of judges from the Council of 12 Suns who score each soul before any family may approach.',
      rationale:
        'The process is voluntary and benevolent without judgment panels; emergence is immediate reunion with galactic families and solar parents.',
    },
    {
      text: 'Only Ground Healers for another mandatory immersion round with no galactic family or solar parent meeting.',
      rationale:
        'Ground Healers stabilize during the process; emergence marks completion of the phase and instant reunion with families and solar parents.',
    },
  ],
  17: [
    {
      text: 'Source memory codes in the water interact with the soul’s energetic blueprint to trigger visual and auditory recall.',
      rationale:
        'Interaction of Source codes with the soul’s energetic blueprint triggers deep visual and auditory memory recall of true cosmic origin; water holds Source memory codes as a super-conductive medium.',
    },
    {
      text: 'Holographic movies projected only onto dome walls, with no interaction between water codes and the soul blueprint.',
      rationale:
        'Recall is internal, triggered when Source memory codes in liquid sound meet the soul’s energetic blueprint, not external dome movies alone.',
    },
    {
      text: 'Telepathic lectures from Ground Healers alone, with the water carrying no Source codes or blueprint interaction.',
      rationale:
        'Ground Healers guide and stabilize; the remembrance trigger is Source codes in the water interacting with the soul’s energetic blueprint.',
    },
    {
      text: 'Stimulation of the dense 3D pineal gland only, while the crystalline body never receives Source code infusion.',
      rationale:
        'The sequence acts on the crystalline body and soul blueprint through liquid sound and Source codes, bypassing ordinary physical limitations.',
    },
  ],
  18: [
    {
      text: 'By shifting appearance to reflect the soul’s family with luminous outlines that establish absolute safety.',
      rationale:
        'Ground Healers can shift their appearance to reflect the soul’s family, using luminous outlines to establish absolute safety and eliminate fear.',
    },
    {
      text: 'By keeping their true forms completely hidden so souls never see luminous outlines or family-like presence.',
      rationale:
        'They present adaptable luminous outlines that reflect family familiarity rather than remaining fully hidden without comfort presence.',
    },
    {
      text: 'By using sedative frequencies that numb awareness so the soul cannot feel fear or remember its origin.',
      rationale:
        'The goal is restoration, memory recall, and safety through familiar appearance — not sedation that blocks awareness or remembrance.',
    },
    {
      text: 'By reading long technical manuals about dome hardware until the intellect alone removes all fear responses.',
      rationale:
        'Safety is established vibrationally and visually through family-reflective luminous outlines, not through technical lectures.',
    },
  ],
  19: [
    {
      text: 'To reweave soul fractures and timeline trauma as the soul-mending tier of the three-part healing system.',
      rationale:
        'Star Pods mend the soul, leveraging floating cocoons in etheric space to reweave soul fractures and timeline trauma.',
    },
    {
      text: 'To serve only as passive observation decks for watching the 3D collapse with no reweaving function at all.',
      rationale:
        'Star Pods are active soul and timeline healing structures, not passive observation posts.',
    },
    {
      text: 'To act as the final military defense line against parasites while emotional healing is left entirely undone.',
      rationale:
        'Star Pods are restorative soul-healing cocoons; strategic liberation missions belong to groups like the Resonating Army, not Star Pod design.',
    },
    {
      text: 'To transport every soul to distant galaxies immediately without any fracture reweaving or timeline repair.',
      rationale:
        'Star Pods are healing structures in etheric space for reweaving fractures and timeline trauma, not intergalactic transport vehicles.',
    },
  ],
  20: [
    {
      text: 'One vast unified crystalline temple operating as a singular med bed for collective restoration.',
      rationale:
        'Following collapse of the parasitic 3D overlay, the entire realm returns to its original state as one vast, unified crystalline temple, operating as a singular med bed for collective restoration.',
    },
    {
      text: 'A chaotic void of unformed energy with no crystalline temple structure and no collective med-bed function.',
      rationale:
        'The realm returns to a structured original crystalline temple state for collective restoration, not formless chaos.',
    },
    {
      text: 'A new physical earth identical to the old 3D world with tarmac, sound weapons, and parasitic oceans intact.',
      rationale:
        'The restored state is a unified crystalline temple and med bed, sharply contrasting the manipulated 3D reality of parasitic sound weapons and suppression.',
    },
    {
      text: 'A network of fully independent colonies with no unified temple and no Spirit Tree feed across outer domes.',
      rationale:
        'The description emphasizes a singular unified crystalline temple fed by the Spirit Tree axis, not fragmented independent colonies.',
    },
  ],
  21: [
    {
      text: 'Grief, fear, guilt, and heartbreak drawn out as dense energetic blockages while the soul floats in the water.',
      rationale:
        'As the soul floats, vibrating water draws out dense energetic blockages such as grief, fear, guilt, and heartbreak — the emotional density carried across lifetimes.',
    },
    {
      text: 'Only mild confusion, apathy, and boredom, with no grief, fear, guilt, or heartbreak named as extracted density.',
      rationale:
        'The named blockages extracted by vibrating water are grief, fear, guilt, and heartbreak as deep emotional density.',
    },
    {
      text: 'Only future anxiety and past regret under other labels, never grief, fear, guilt, or heartbreak as stated densities.',
      rationale:
        'Vibrational extraction specifically names grief, fear, guilt, and heartbreak as the dense blockages drawn from the floating soul.',
    },
    {
      text: 'Only anger, jealousy, and greed as the exclusive density list with no grief, fear, guilt, or heartbreak included.',
      rationale:
        'The restorative sequence names grief, fear, guilt, and heartbreak as the dense energetic blockages extracted in the Water Domes.',
    },
  ],
  22: [
    {
      text: 'True — no true human soul is abandoned; those not fully resonating are automatically guided to safety.',
      rationale:
        'No true human soul is abandoned during the fracture and collapse of the 3D overlay; those not fully resonating are automatically guided to these safe frequency domains.',
    },
    {
      text: 'False — any soul that misses full resonance is permanently abandoned with no sanctuary guidance path at all.',
      rationale:
        'Core revelation is that no true human soul is abandoned; non-resonating souls are automatically guided to safe frequency domains.',
    },
    {
      text: 'False — only Resonating Army members receive help, while all other true human souls are left in the overlay.',
      rationale:
        'The Resonating Army bypasses because already awakened; traumatized true human souls are precisely those guided into sanctuaries rather than abandoned.',
    },
    {
      text: 'False — sanctuaries accept only artificial programs, and every true human spark must heal alone without guidance.',
      rationale:
        'True human souls carrying emotional density are guided into Water Domes and related sanctuaries; no true human soul is abandoned.',
    },
  ],
  23: [
    {
      text: 'Freely choose to ascend to higher realms or return to a fresh pristine creation cycle in the Known Lands.',
      rationale:
        'Stabilized souls return to absolute sovereignty and may freely choose whether to ascend to higher realms or return to a fresh, pristine creation cycle in the Known Lands.',
    },
    {
      text: 'They must join the Resonating Army as permanent soldiers with no other sovereign path available afterward.',
      rationale:
        'Sovereignty allows free choice of ascent or Known Lands return; joining the Resonating Army is not a required assignment after stabilization.',
    },
    {
      text: 'They are assigned a fixed new identity and mission by the Council with no free choice of path remaining.',
      rationale:
        'Absolute sovereignty means free choice of the next path — ascent or return — not a fixed assigned identity without choice.',
    },
    {
      text: 'They must remain inside Water Domes forever as permanent residents with no exit into higher realms or Known Lands.',
      rationale:
        'Stabilization is transitional; sovereign souls choose ascent or a fresh Known Lands cycle rather than permanent dome residence.',
    },
  ],
  24: [
    {
      text: 'Crystal Halls use crystal slabs humming with harmonic frequency to dissolve mental overlays and mind-control damage.',
      rationale:
        'Crystal Halls mend the mind with crystal slabs humming with harmonic frequency to dissolve mental overlays and mind control damage, while Water Domes mend the heart through liquid sound.',
    },
    {
      text: 'Crystal Halls are dense physical stone only, while Water Domes alone use pure frequency with no living crystal role.',
      rationale:
        'Both are pure frequency healing environments; Crystal Halls are temples of living crystal, and Water Domes are cloaked pearl sanctuaries over crystalline waters.',
    },
    {
      text: 'Water Domes use crystal slabs for mind repair while Crystal Halls use liquid sound pools for heart extraction only.',
      rationale:
        'The assignment is inverted: Water Domes use liquid sound for heart/emotional healing; Crystal Halls use humming crystal slabs for mental overlays.',
    },
    {
      text: 'Water Domes serve only the Resonating Army while Crystal Halls serve only NPCs, with no heart-versus-mind split.',
      rationale:
        'Water Domes serve true human souls carrying emotional density; the three-tier split is heart (Water Domes), mind (Crystal Halls), and soul (Star Pods).',
    },
  ],
  25: [
    {
      text: 'Ground Healers are holographic light beings sent from the Council of 12 Suns to stabilize sanctuary souls.',
      rationale:
        'Tall radiant holographic light beings (Ground Healers / Saferins, Saferons, or Salania) are sent from the Council of 12 Suns to support and stabilize souls in the sanctuaries.',
    },
    {
      text: 'They are opposing factions forever at war, with Ground Healers refusing every directive from the Council of 12 Suns.',
      rationale:
        'Ground Healers are sent from the Council to assist the transition; the relationship is origin and mission alignment, not opposition.',
    },
    {
      text: 'The Council are students of the Ground Healers, who created the Council after finishing Water Dome construction.',
      rationale:
        'Ground Healers are emissaries sent from the Council of 12 Suns; the Council is the originating authority, not the students of the healers.',
    },
    {
      text: 'Ground Healers created the Council of 12 Suns as a subordinate board with no sending authority over healers.',
      rationale:
        'Healers are sent from the Council of 12 Suns, indicating the Council as source authority for these specialized holographic ground healers.',
    },
  ],
};

const questionsMeta = [
  {
    number: 1,
    question: 'What is the primary composition of the Healing Sanctuaries?',
    hint: 'Consider the foundational elements that define high-frequency, non-physical structures.',
  },
  {
    number: 2,
    question:
      'Which specific sanctuary environment is dedicated to the extraction of emotional density?',
    hint: "Identify which of the three-tiered systems focuses on the heart and emotional body.",
  },
  {
    number: 3,
    question: 'What is the role of the Ground Healers within the sanctuaries?',
    hint: 'Think about the supportive and non-forceful nature of these holographic light beings.',
  },
  {
    number: 4,
    question: "How is Liquid Sound defined in the context of the Water Domes?",
    hint: 'Consider the relationship between water, vibration, and Source memory.',
  },
  {
    number: 5,
    question:
      'What happens to the reincarnation cycles established under the Vatican and Saturnian systems?',
    hint: 'Think about the strategic impact of restoring soul sovereignty and memory.',
  },
  {
    number: 6,
    question:
      'In what state do souls enter the Water Domes to begin the restorative process?',
    hint: "Recall the term used for the soul's high-frequency vehicle during this transition.",
  },
  {
    number: 7,
    question:
      'Is the healing process within the Water Domes mandatory for all souls exiting the 3D matrix?',
    hint: "Does the system respect the soul's individual will and freedom of choice?",
  },
  {
    number: 8,
    question: 'What is the primary function of the Crystal Halls?',
    hint: "Focus on the specific aspect of the three-tiered system that addresses mental damage.",
  },
  {
    number: 9,
    question: 'Which beings are sent from the Council of 12 Suns to manage the sanctuaries?',
    hint: 'Look for the specific names assigned to the Ground Healers.',
  },
  {
    number: 10,
    question:
      'What determines whether a soul is guided to safe frequency domains during the 3D collapse?',
    hint: 'Reflect on how frequency and resonance act as a guiding mechanism.',
  },
  {
    number: 11,
    question:
      "What serves as the central axis of consciousness for the entire sanctuary system?",
    hint: 'Identify the organic, central structure located at the heart of the Known Lands.',
  },
  {
    number: 12,
    question:
      'Is the Resonating Army required to spend time in the Water Domes before their homecoming?',
    hint: 'Consider the state of awakening and frequency characteristic of this specific group.',
  },
  {
    number: 13,
    question: "How are the Water Domes hidden from the lower 3D senses?",
    hint: 'Look for the term used to describe why these vast structures remain undetected.',
  },
  {
    number: 14,
    question:
      'What is the primary obstacle in 3D reality that blocks access to these sanctuaries?',
    hint: 'Identify the artificial disruption mentioned as being deployed in 3D oceans.',
  },
  {
    number: 15,
    question: "What defines Harmonic Resonance in the context of soul restoration?",
    hint: "Think about the soul's natural state and how it relates to its origin.",
  },
  {
    number: 16,
    question: 'Upon emerging from the Liquid Sound pools, who are the souls instantly met by?',
    hint: "Identify the familial groups mentioned in the Galactic Reunion phase.",
  },
  {
    number: 17,
    question: 'What mechanism does Liquid Sound use to trigger visual soul remembrance?',
    hint: "Consider how the water's specific Source codes interact with the soul.",
  },
  {
    number: 18,
    question: 'How do Ground Healers eliminate fear and establish safety for recovering souls?',
    hint: 'Focus on the visual adaptation technique used by these holographic beings.',
  },
  {
    number: 19,
    question: "What is the purpose of the Star Pods in the three-tiered healing system?",
    hint: "Identify the third component of the healing system that targets fractures and timelines.",
  },
  {
    number: 20,
    question:
      'What describes the collective state of the realm following the collapse of the 3D overlay?',
    hint: 'Think about the unified and medicinal nature of the restored realm.',
  },
  {
    number: 21,
    question:
      'What specific emotional blockages are mentioned as being extracted by the vibrating water?',
    hint: "Look for the specific list of heavy emotions that Liquid Sound targets.",
  },
  {
    number: 22,
    question:
      'Is any true human soul abandoned during the fracture and collapse of the 3D overlay?',
    hint: 'Does the system allow for any true human souls to be forgotten or lost during the transition?',
  },
  {
    number: 23,
    question:
      'What choice is granted to souls once they are stabilized and returned to absolute sovereignty?',
    hint: 'Consider the two primary paths mentioned for a restored, sovereign soul.',
  },
  {
    number: 24,
    question: 'How do the Crystal Halls differ from the Water Domes in their healing technique?',
    hint: 'Focus on the specific tool (slabs) and the target (mental overlays) of the Crystal Halls.',
  },
  {
    number: 25,
    question: 'What is the relationship between the Council of 12 Suns and the Ground Healers?',
    hint: 'Think about the source and origin of the tall, radiant beings in the sanctuaries.',
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
      /according to the (report|text|source|journal)/i.test(o.text)
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
    'Test your grasp of Water Domes — liquid sound and emotional density extraction, Ground Healers from the Council of 12 Suns, Crystal Halls and Star Pods, Spirit Tree axis, cloaking fields, and sovereign choice after heart restoration.',
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'Water Domes are specialized emotional healing sanctuaries within the pure-frequency network of light, sound, and living crystal. Sit with liquid sound that holds Source memory codes, the sequence from vessel alignment through galactic reunion, Ground Healers who mirror family safety, and the three-tiered path of heart, mind, and soul. Return to the Water Domes deep-dive, infographic, and video transmissions as you hold the sovereign choice to ascend or return to a pristine Known Lands cycle.',
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
    'Test your understanding of Water Domes — emotional healing sanctuaries of liquid sound; Ground Healers (Saferins/Saferons/Salania); Crystal Halls and Star Pods; Spirit Tree feed; cloaking fields; and sovereign choice after restoration.',
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
        t.description.includes('Decoded analysis of Water Domes')
      ) {
        t.description =
          'Water Domes are specialized emotional healing sanctuaries within the Healing Sanctuaries network — vast, cloaked pearl domes over crystalline waters where liquid sound extracts emotional density and restores harmonic resonance to true human souls.';
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('water-domes not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from healing-sanctuaries quiz (parent sibling)
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'healing-sanctuaries.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Water Domes: liquid sound and emotional density, Ground Healers from the Council of 12 Suns, Crystal Halls and Star Pods, Spirit Tree axis, cloaking fields, and sovereign choice after heart restoration.';
const replacements = [
  ['Healing Sanctuaries Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Healing Sanctuaries: Water Domes, Crystal Halls, Star Pods, Saferons from the Council of 12 Suns, projection cloaking, Spirit Tree light feed, planetary crystal memory, and sovereign choice after stabilization.',
    desc,
  ],
  ['quiz/breakdown/healing-sanctuaries.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/healing-sanctuaries.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=healing-sanctuaries',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`,
  ],
  ['Healing Sanctuaries deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Healing Sanctuaries</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/healing-sanctuaries.json',
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
  .replace(/Interactive Living Truth Quiz on Healing Sanctuaries[^"]*/g, desc)
  .replace(/Healing Sanctuaries/g, TOPIC_TITLE);

// Fix over-replacement on paths if any slipped
html = html
  .replace(/Water Domes\.webp/g, 'water-domes.webp')
  .replace(/Water Domes\.json/g, 'water-domes.json')
  .replace(/Water Domes\.html/g, 'water-domes.html')
  .replace(/topic=Water Domes/g, `topic=${TOPIC_ID}`)
  .replace(/topic=water-domes/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/healing-sanctuaries.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/water-domes.json'
);
