/**
 * Installs Liquid Sound quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/sound-quiz.json
 * Title forced to "Liquid Sound". All 25 audited against liquid-sound report only.
 *
 * Run: node scripts/install-liquid-sound-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/liquid-sound.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'liquid-sound';
const TOPIC_TITLE = 'Liquid Sound';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/sound-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/liquid-sound.webp';

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

/** Support phrases grounded only in liquid-sound.json report. */
const supportPhrases = {
  1: ['emotional trauma', 'original frequency', 'restorative', 'liquid sound'],
  2: ['stagnant', 'suppressed', 'memory-retention', '3d matrix'],
  3: ['memory codes of source', 'soul recall', 'remembrance'],
  4: ['sound creates light', 'radio tuning', 'discordant'],
  5: ['crystalline body', 'hovers', 'suspension'],
  6: ['vibrational', 'friction', 'lower-frequency', 'blockages'],
  7: ['water domes', 'invisible', 'translucent', 'projected'],
  8: ['saferons', 'ground healers', 'council of 12 suns'],
  9: ['harmonic resonance', 'memory codes', 'resonant infusion'],
  10: ['vatican-archived amnesia', 'timeline memory', 'neutralizes'],
  11: ['crystal halls', 'mental overlays', 'parasitic programming'],
  12: ['blue, aqua, silver, pearl, and green', 'color'],
  13: ['loosh harvesting', 'voice-to-skull', 'immunization'],
  14: ['frequency shock', 'higher physical realms', 'high-density'],
  15: ['sound recall', 'tonal awakening', 'visions'],
  16: ['grief', 'fear', 'guilt', 'emotional density'],
  17: ['sound creates light', 'color frequencies'],
  18: ['council of 12 suns', 'saferons'],
  19: ['therapeutic agent', 'water domes', 'liquid sound'],
  20: ['smiling', 'singing', 'light'],
  21: ['mechanical trigger', 'ancient remembrance', 'amnesia'],
  22: ['harmonic resonance', 'original', 'blueprint'],
  23: ['artificial sound frequencies', 'oceans', 'parasitic'],
  24: ['light body grid', 'resonant infusion', 'absorbed'],
  25: ['star pods', 'timeline trauma', 'emotional wounds'],
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
 * All four options at similar depth from the liquid-sound report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'To systematically release deep emotional trauma and realign the soul with its original frequency.',
      rationale:
        'Liquid Sound performs deep restorative clearing so souls release emotional trauma and realign with their original frequency inside Water Dome pools.',
    },
    {
      text: 'To generate artificial planetary sound frequencies used only for long-range 3D matrix communication grids.',
      rationale:
        'Liquid Sound is a healing medium that extracts trauma and restores alignment; it is not a tool for generating artificial planetary communications.',
    },
    {
      text: 'To archive memory sequences for the Council of 12 Suns without any trauma extraction or realignment role.',
      rationale:
        'Memory codes of Source trigger soul recall within the liquid; the primary function is restorative clearing, not council archival storage.',
    },
    {
      text: 'To provide a dense physical exercise medium so souls can rebuild 3D muscle through forced swimming drills.',
      rationale:
        'Souls hover in crystalline body form; Liquid Sound is vibrational therapy, not a physical-exercise medium for 3D bodies.',
    },
  ],
  2: [
    {
      text: '3D matrix water is stagnant, suppressed, stripped of memory-retention, and hijacked by parasitic forces.',
      rationale:
        'Current 3D water is stagnant and suppressed, stripped of memory-retention capability and hijacked by parasitic forces, unlike active Liquid Sound.',
    },
    {
      text: '3D matrix water vibrates at a frequency too high for any crystalline body to enter or survive immersion.',
      rationale:
        '3D water is described as stagnant and suppressed, not as a dangerously high-frequency crystalline-body medium.',
    },
    {
      text: '3D matrix water holds too many Source memory codes, causing permanent cognitive overload for every soul.',
      rationale:
        '3D water is stripped of memory-retention capability; excess Source codes are not its problem—suppression and parasitic hijack are.',
    },
    {
      text: '3D matrix water is already pure Liquid Sound and needs no healing distinction from Water Dome pools.',
      rationale:
        'Liquid Sound stands in stark contrast to stagnant, suppressed 3D water that parasites have compromised.',
    },
  ],
  3: [
    {
      text: 'They trigger complete soul recall and ancient remembrance embedded in the liquid medium.',
      rationale:
        'Memory codes of Source are sacred high-vibrational sequences in Liquid Sound that trigger complete soul recall and spontaneous remembrance.',
    },
    {
      text: 'They act only as chemical stabilizers that hold Water Dome walls together without any recall function.',
      rationale:
        'Memory codes trigger soul recall and remembrance; they are informational sequences in the liquid, not chemical wall stabilizers.',
    },
    {
      text: 'They function as new mental overlays that replace traumatic memories with blank synthetic scripts.',
      rationale:
        'Codes restore original remembrance rather than install mental overlays; Crystal Halls address mental overlays separately.',
    },
    {
      text: 'They serve only as navigation coordinates for crafts traveling between the Council of 12 Suns.',
      rationale:
        'Within Liquid Sound, Source memory codes restore soul recall in the light body, not spacecraft navigation between suns.',
    },
  ],
  4: [
    {
      text: 'As structural radio-tuning ingredients that pull awareness out of discordant octaves into positive ones.',
      rationale:
        'Under “sound creates light,” color frequencies act like radio tuning dials that pull awareness out of discordant frequencies into positive octaves.',
    },
    {
      text: 'Only to mask vibrational friction so souls never feel extraction pressure during density clearing.',
      rationale:
        'Colors are structural tuning ingredients for octave alignment, not camouflage for the extraction phase.',
    },
    {
      text: 'Only as decorative department markers with no effect on consciousness or frequency locking.',
      rationale:
        'The luminous spectrum physically pulls awareness and locks it into positive octaves; colors are not mere decoration.',
    },
    {
      text: 'Only to build solid armor shells that block all sound recall and vision triggers permanently.',
      rationale:
        'Color-frequency tuning enables positive octave lock and supports awakening; it does not build armor that blocks recall.',
    },
  ],
  5: [
    {
      text: 'The soul hovers in the medium in its crystalline body self; physical standing is unnecessary.',
      rationale:
        'During Suspension and Flotation, the soul hovers within the medium in crystalline body form because physical standing is unnecessary in these higher realms.',
    },
    {
      text: 'The soul is bolted to pool floors with crystal slabs so it cannot float or leave during extraction.',
      rationale:
        'The process is hovering flotation in crystalline form, not floor-anchoring with crystal slabs (slabs belong to Crystal Halls).',
    },
    {
      text: 'The soul is sealed only in a Star Pod light cocoon with no pool immersion or liquid medium at all.',
      rationale:
        'Liquid Sound work is immersion and flotation in Water Dome pools; light cocoons are the Star Pod modality.',
    },
    {
      text: 'The soul’s light body grid is fully disconnected first so no crystalline form can hover in the pools.',
      rationale:
        'Souls enter and hover in crystalline body selves; the grid later absorbs Source codes during infusion rather than being disconnected first.',
    },
  ],
  6: [
    {
      text: 'Elevated liquid frequency creates friction against lower-frequency blockages, drawing density out.',
      rationale:
        'Vibrational Friction and Extraction: water vibrates at a precise elevated frequency that creates friction against lower-frequency blockages and draws out emotional density.',
    },
    {
      text: 'Council of 12 Suns voice-to-skull broadcasts alone scrape density without any liquid friction role.',
      rationale:
        'Extraction is mechanical friction between high-vibrational water and low-frequency blocks, not council voice-to-skull scraping.',
    },
    {
      text: 'Saferons walking through pools create the only pressure that removes density from the field.',
      rationale:
        'Saferons guide gently; density extraction is vibrational pressure from the liquid’s elevated frequency against blockages.',
    },
    {
      text: 'Mental overlays rub against crystal slabs until emotional density falls out without liquid sound.',
      rationale:
        'Mental overlays are Crystal Hall work; Liquid Sound extraction is water vibrating against emotional density blockages.',
    },
  ],
  7: [
    {
      text: 'False — Water Domes are vast shimmering invisible translucent enclosures projected over crystalline waters.',
      rationale:
        'Water Domes are vast, shimmering, invisible translucent enclosures projected over crystalline lakes, oceans, and valleys—not solid visible lake-built structures.',
    },
    {
      text: 'True — Water Domes are solid visible buildings stacked from lake crystal blocks with opaque walls only.',
      rationale:
        'Domes are projected translucent and often invisible enclosures, not solid opaque buildings of lake crystal.',
    },
    {
      text: 'True — Water Domes exist only as underground bunkers with no projection over lakes or oceans at all.',
      rationale:
        'They are projected over crystalline lakes, oceans, and valleys as shimmering translucent enclosures.',
    },
    {
      text: 'True — Water Domes are purely mental visualizations with no energetic enclosure around any water body.',
      rationale:
        'They are real projected sanctuaries housing Liquid Sound pools, described as vast translucent enclosures over waters.',
    },
  ],
  8: [
    {
      text: 'Ground Healers known as Saferons—tall luminous ET assistants from the Council of 12 Suns.',
      rationale:
        'Healing is monitored and stabilized by Ground Healers (Saferons), tall luminous ET assistants from the Council of 12 Suns offering gentle non-forceful guidance.',
    },
    {
      text: 'Parasitic forces that reclaim ocean conduits while souls float, offering no stabilizing guidance role.',
      rationale:
        'Saferons stabilize healing; parasites are opposed by Liquid Sound’s high-vibrational unjammed state, not put in charge of pools.',
    },
    {
      text: 'Only Crystal Hall staff who never enter Water Domes and never monitor liquid-sound immersion.',
      rationale:
        'Water Dome monitoring is assigned to Saferon Ground Healers; Crystal Halls work laterally on mental overlays.',
    },
    {
      text: 'Archived Vatican-loop souls forced to supervise every pool as permanent prison wardens forever.',
      rationale:
        'Liquid Sound neutralizes Vatican amnesia loops; monitoring is by Council-sent Saferons, not archived prison wardens.',
    },
  ],
  9: [
    {
      text: 'Harmonic resonance and Source memory codes infused into the cleared energetic space.',
      rationale:
        'During Resonant Infusion, Liquid Sound replaces the energetic void with harmonic resonance and Source memory codes absorbed into the light body grid.',
    },
    {
      text: 'A temporary Saferon sound shield that leaves the void empty of any original soul frequency.',
      rationale:
        'Infusion fills the void with harmonic resonance and Source codes, not an empty temporary shield.',
    },
    {
      text: 'Neutral stagnant 3D matrix water poured back in to keep density from returning immediately.',
      rationale:
        '3D stagnant water is the compromised opposite of Liquid Sound; infusion uses harmonic resonance, not stagnant refill.',
    },
    {
      text: 'A new protective mental overlay installed so the heart never feels again after extraction.',
      rationale:
        'Infusion restores original harmonic resonance and Source codes; mental overlays are cleared in Crystal Halls, not installed here.',
    },
  ],
  10: [
    {
      text: 'By restoring timeline memory and original frequency, neutralizing those amnesia harvesting networks.',
      rationale:
        'Restoring a soul’s timeline memory through Liquid Sound completely neutralizes Vatican-archived amnesia loops and harvesting networks.',
    },
    {
      text: 'By skipping Liquid Sound entirely and using only Star Pods for every amnesia case forever.',
      rationale:
        'Liquid Sound itself restores timeline memory that neutralizes Vatican amnesia loops; Star Pods address timeline trauma laterally.',
    },
    {
      text: 'By deleting all past experience so the soul has no timeline left for any loop to reference.',
      rationale:
        'The path is memory restoration and frequency realignment, not deletion of the soul’s past.',
    },
    {
      text: 'By jamming only surface radio stations while leaving Vatican amnesia architecture fully intact.',
      rationale:
        'Neutralization comes from restored timeline memory and original frequency, not partial surface jamming that leaves loops intact.',
    },
  ],
  11: [
    {
      text: 'Mental overlays and parasitic programming dissolved with crystal slabs and harmonic hums.',
      rationale:
        'Crystal Halls use crystal slabs and hums to dissolve mental overlays and parasitic programming, working laterally with Liquid Sound’s heart focus.',
    },
    {
      text: 'Only emotional heart wounds using liquid sound pools as their sole and exclusive modality.',
      rationale:
        'Emotional heart healing is Liquid Sound / Water Domes; Crystal Halls target mental overlays and programming.',
    },
    {
      text: 'Only physical reconstruction of the entire 3D matrix infrastructure with no mental clearing role.',
      rationale:
        'Crystal Halls clear mental overlays and parasitic programming; they are not matrix reconstruction yards.',
    },
    {
      text: 'Only timeline trauma and soul fractures treated exclusively with floating light cocoons.',
      rationale:
        'Timeline trauma and soul fractures are Star Pod work; Crystal Halls address mental overlays with slabs and hums.',
    },
  ],
  12: [
    {
      text: 'Crimson — the named tuning hues are blue, aqua, silver, pearl, and green only.',
      rationale:
        'Color-frequency tuning names blue, aqua, silver, pearl, and green; crimson is not part of that luminous spectrum.',
    },
    {
      text: 'Aqua — which is excluded from the spectrum and never used as a tuning color at all.',
      rationale:
        'Aqua is explicitly included among the shimmering hues used for radio-style frequency tuning.',
    },
    {
      text: 'Pearl — listed as forbidden because pearl light always reinstalls emotional density immediately.',
      rationale:
        'Pearl is one of the named healing spectrum colors used for positive octave locking.',
    },
    {
      text: 'Silver — treated only as waste light with no structural tuning role in the pools.',
      rationale:
        'Silver is named among the structural color ingredients that pull awareness into positive octaves.',
    },
  ],
  13: [
    {
      text: 'Permanent shielding from loosh harvesting, voice-to-skull weapons, and sensory hijackings.',
      rationale:
        'Clearing the heart’s density permanently shields the soul from future loosh harvesting, voice-to-skull frequency weapons, and sensory hijackings.',
    },
    {
      text: 'The power to operate parasitic ocean sound weapons against other recovering souls at will.',
      rationale:
        'Clearing density immunizes against parasitic weapons; it does not grant control of those weapons.',
    },
    {
      text: 'Immediate automatic seating on the Council of 12 Suns with no further healing path remaining.',
      rationale:
        'Benefits include immunization and higher-realm readiness; council appointment is not the stated outcome.',
    },
    {
      text: 'The duty to convert all 3D oceans into Liquid Sound single-handedly without any Water Dome support.',
      rationale:
        'Immunization is personal field protection after heart density clears, not a mandate to re-engineer all oceans alone.',
    },
  ],
  14: [
    {
      text: 'Raised vibration prevents frequency shock or lag when co-existing in high-density higher realms.',
      rationale:
        'Raising vibration through Liquid Sound prepares souls to co-exist in higher physical realms without frequency shock or lag.',
    },
    {
      text: 'Stabilization hides the soul from Saferons so no guidance can ever reach the recovering field.',
      rationale:
        'Saferons stabilize healing supportively; the purpose of raised vibration is higher-realm readiness, not hiding from healers.',
    },
    {
      text: 'Stabilization is only so souls can breathe underwater in lakes without any frequency change at all.',
      rationale:
        'The stated need is frequency readiness for high-density realms, not underwater breathing technique.',
    },
    {
      text: 'Stabilization keeps souls tightly locked to 3D matrix communication so they never leave density.',
      rationale:
        'Liquid Sound raises vibration for higher realms and memory restoration, opposite of locking souls into 3D communication.',
    },
  ],
  15: [
    {
      text: 'True — soul coding interacting with Liquid Sound triggers spontaneous visions and ancient sound recall.',
      rationale:
        'Tonal Awakening: interaction between the soul’s coding and liquid sound triggers spontaneous visions and ancient sound recall.',
    },
    {
      text: 'False — sound recall only happens after Crystal Hall slabs erase every vibrational code from the field.',
      rationale:
        'Sound recall is triggered by interaction with Liquid Sound itself during tonal awakening, not by code erasure in Crystal Halls.',
    },
    {
      text: 'False — Saferons must manually inject synthetic memories because liquid never triggers recall alone.',
      rationale:
        'Exposure and coding–liquid interaction mechanically trigger remembrance; Saferons guide without forcing synthetic memory injection.',
    },
    {
      text: 'False — ancient sound recall is impossible until the soul leaves Water Domes and re-enters 3D oceans.',
      rationale:
        'Recall is triggered inside the pools during interaction with Liquid Sound, not after return to suppressed 3D oceans.',
    },
  ],
  16: [
    {
      text: 'Trapped low-vibrational weight including grief, fear, guilt, and heart-break in the soul’s field.',
      rationale:
        'Emotional density is trapped low-vibrational energetic weight—including grief, fear, guilt, and heart-break—accumulated in the soul’s field.',
    },
    {
      text: 'Only stagnant 3D water molecules with no grief, fear, guilt, or heart-break component named.',
      rationale:
        'Emotional density is energetic trauma weight (grief, fear, guilt, heart-break), not a count of stagnant water molecules.',
    },
    {
      text: 'Only suppressed Source memory codes that should be deleted rather than density extracted by friction.',
      rationale:
        'Source memory codes are restorative; emotional density is the low-vibrational trauma weight that must be cleared.',
    },
    {
      text: 'Only broken physical bones from 3D bodies with no vibrational or emotional field component at all.',
      rationale:
        'Density is energetic/vibrational emotional weight in the soul field, not physical skeletal injury.',
    },
  ],
  17: [
    {
      text: 'Sound creates light — color frequencies act as structural ingredients for consciousness tuning.',
      rationale:
        'The foundational principle “sound creates light” explains why specific color frequencies function as direct structural ingredients to pull consciousness out of discordant octaves.',
    },
    {
      text: 'Light creates sound — colors are effects only and never act as structural tuning ingredients.',
      rationale:
        'The named principle is sound creates light, with colors as structural ingredients for octave tuning.',
    },
    {
      text: 'Color creates memory alone, with no sound-to-light principle involved in pool environments.',
      rationale:
        'Memory codes and sound-creates-light color tuning work together; the foundational named principle is sound creates light.',
    },
    {
      text: 'Vibration creates mass only, so colors never pull awareness out of discordant octaves.',
      rationale:
        'Color-frequency tuning under sound-creates-light pulls awareness out of discordant octaves into positive ones.',
    },
  ],
  18: [
    {
      text: 'The Council of 12 Suns, which sends Saferons as gentle non-forceful Ground Healers.',
      rationale:
        'Saferons are tall luminous ET assistants sent from the Council of 12 Suns to provide gentle, non-forceful guidance.',
    },
    {
      text: 'The 3D matrix oceans alone, where Saferons form as salt crystals with no council origin.',
      rationale:
        'Saferons originate from the Council of 12 Suns, not as products of suppressed 3D ocean salt.',
    },
    {
      text: 'The Crystal Halls alone, which manufacture Saferons as permanent slab-maintenance robots.',
      rationale:
        'Saferons are Council-sent Ground Healers for Water Dome stabilization, not Crystal Hall robots.',
    },
    {
      text: 'Vatican-archived libraries that print Saferons as paper overseers of amnesia loops forever.',
      rationale:
        'Liquid Sound neutralizes Vatican amnesia loops; Saferons come from the Council of 12 Suns as luminous guides.',
    },
  ],
  19: [
    {
      text: 'Liquid Sound — the active super-conductive vibrational water that performs restorative clearing.',
      rationale:
        'Liquid Sound is the core therapeutic agent inside heart-mending Water Domes, an active super-conductive vibrational state of water.',
    },
    {
      text: 'Saferon light cocoons used only as Star Pod substitutes with no liquid medium in Water Domes.',
      rationale:
        'Light cocoons are Star Pod tools; Water Dome therapy centers on Liquid Sound pools.',
    },
    {
      text: 'Solar frequencies from the 12 Suns alone with no water medium required for heart mending.',
      rationale:
        'The primary therapeutic agent named for Water Domes is Liquid Sound water, not free-floating solar frequencies alone.',
    },
    {
      text: 'Crystalline slabs from Crystal Halls submerged as the only heart-mending agent in every dome.',
      rationale:
        'Crystal slabs serve mental clearing in Crystal Halls; heart-mending Water Domes use Liquid Sound as the therapeutic agent.',
    },
  ],
  20: [
    {
      text: 'Entirely light, smiling, and singing—often for the first time in multiple lifetimes.',
      rationale:
        'At emergence, souls feel entirely light, smiling, and singing for the first time in multiple lifetimes after density clears and memory returns.',
    },
    {
      text: 'Exhausted and forced into deep sleep with no joy, smile, or song after the pool sequence.',
      rationale:
        'Emergence is light, smiling, and singing—not exhaustion and silence.',
    },
    {
      text: 'Confused by new mental overlays installed to replace every vision and sound recall trigger.',
      rationale:
        'The process restores original memory and harmonic resonance; it does not install confusing mental overlays at exit.',
    },
    {
      text: 'Heavy and locked into denser 3D bodies with more grief than when they entered the pools.',
      rationale:
        'Extraction removes density so souls emerge light and joyful, opposite of heavier grief-locked 3D embodiment.',
    },
  ],
  21: [
    {
      text: 'True — exposure acts as a direct mechanical trigger for ancient remembrance and amnesia bridging.',
      rationale:
        'Spontaneous Memory Restoration: exposure to Liquid Sound is a direct mechanical trigger for ancient remembrance, bridging the amnesia gap through visions and sound recall.',
    },
    {
      text: 'False — Liquid Sound never triggers remembrance; only Crystal Hall lectures can restore any memory.',
      rationale:
        'Liquid Sound itself is the mechanical trigger for ancient remembrance and amnesia bridging.',
    },
    {
      text: 'False — remembrance requires parasites to approve each vision before any code can activate.',
      rationale:
        'Liquid Sound repels parasitic technologies and triggers remembrance directly; parasite approval is not part of the process.',
    },
    {
      text: 'False — mechanical triggers are forbidden; Saferons must rewrite memory by force after every pool.',
      rationale:
        'Saferons offer non-forceful guidance; the medium itself mechanically triggers remembrance without forced rewrites.',
    },
  ],
  22: [
    {
      text: 'The balanced high-vibrational original soul-blueprint state that replaces trauma after extraction.',
      rationale:
        'Harmonic resonance is the balanced high-vibrational frequency state of the original soul blueprint that replaces trauma through vibrational exposure.',
    },
    {
      text: 'Only a Saferon radio channel used for pool logistics with no effect on the soul blueprint.',
      rationale:
        'Harmonic resonance is the soul’s restored original frequency state, not a logistics radio channel.',
    },
    {
      text: 'An artificial mask tone that hides trauma while leaving density fully intact in the field.',
      rationale:
        'Resonance replaces trauma after density extraction; it is restorative original frequency, not a trauma-hiding mask.',
    },
    {
      text: 'The sound of the 3D matrix collapsing, unrelated to soul blueprint restoration in the pools.',
      rationale:
        'In this context harmonic resonance means the original soul blueprint frequency restored via Liquid Sound exposure.',
    },
  ],
  23: [
    {
      text: 'As conductors transmitting aggressive artificial sound frequencies across oceans to suppress.',
      rationale:
        'Parasitic forces rely on suppressed 3D water’s conductivity to transmit aggressive artificial sound frequencies across oceans; Liquid Sound repels that by staying high-vibrational and unjammed.',
    },
    {
      text: 'As pure vaults that store Source memory codes for free distribution to every recovering soul.',
      rationale:
        '3D water is stripped of memory-retention and hijacked; parasites use it for aggressive sound transmission, not Source-code charity.',
    },
    {
      text: 'As materials to build their own invisible healing domes identical to Water Domes for true mending.',
      rationale:
        'Parasites exploit suppressed water as a frequency weapon conduit, not as a platform for benevolent Water Dome equivalents.',
    },
    {
      text: 'Only to gently stabilize souls so loosh harvesting becomes impossible in every coastal region.',
      rationale:
        'Suppressed water enables parasitic frequency transmission; clearing density immunizes against loosh harvesting rather than parasites stabilizing souls.',
    },
  ],
  24: [
    {
      text: 'Directly into the soul’s light body grid during Resonant Infusion after density is extracted.',
      rationale:
        'During Resonant Infusion, memory codes of Source are absorbed directly into the soul’s light body grid as harmonic resonance fills the cleared space.',
    },
    {
      text: 'Only into Crystal Hall slabs for later study, never into the soul’s own light body grid.',
      rationale:
        'Codes absorb into the soul’s light body grid in the liquid process, not into external slabs as the primary infusion target.',
    },
    {
      text: 'Only into Saferon devices for remote playback, leaving the soul’s grid empty of Source codes.',
      rationale:
        'Infusion integrates Source codes into the soul’s light body grid; Saferons monitor, they do not hoard the codes as device playback.',
    },
    {
      text: 'Only into the dense 3D physical brain left outside the dome with no grid absorption at all.',
      rationale:
        'Absorption is into the light body grid of the crystalline self in the pools, not a parked 3D brain outside the sanctuary.',
    },
  ],
  25: [
    {
      text: 'Water Domes / Liquid Sound mend emotional heart wounds; Star Pods heal timeline trauma and soul fractures.',
      rationale:
        'Liquid Sound targets emotional heart wounds in Water Domes; Star Pods use light cocoons for timeline trauma and soul fractures in lateral alignment.',
    },
    {
      text: 'Water Domes use only light cocoons while Star Pods use only liquid sound for heart extraction.',
      rationale:
        'That assignment is inverted: Liquid Sound is Water Domes; light cocoons are Star Pods.',
    },
    {
      text: 'Water Domes clear only mental overlays while Star Pods exclusively clear emotional heart density.',
      rationale:
        'Mental overlays are Crystal Halls; emotional heart work is Water Domes / Liquid Sound; Star Pods handle timeline trauma.',
    },
    {
      text: 'Water Domes are purely physical stone while Star Pods are the only vibrational healing structures.',
      rationale:
        'Water Domes are projected translucent frequency sanctuaries housing Liquid Sound; both systems are vibrational healing environments with different targets.',
    },
  ],
};

const questionsMeta = [
  {
    number: 1,
    question: 'What is the primary function of Liquid Sound within the healing sanctuaries?',
    hint: 'Think about trauma release and realignment of the soul’s original frequency.',
  },
  {
    number: 2,
    question: 'How does the water in the current 3D matrix differ from Liquid Sound?',
    hint: 'Contrast stagnant suppressed 3D water with active memory-holding liquid.',
  },
  {
    number: 3,
    question: "What role do the Memory codes of Source play in the healing process?",
    hint: 'Focus on soul recall and ancient remembrance.',
  },
  {
    number: 4,
    question: "Under the principle of 'sound creates light,' how are color frequencies utilized?",
    hint: 'Recall radio-tuning dials and discordant versus positive octaves.',
  },
  {
    number: 5,
    question: "Which of the following describes the state of a soul during Suspension and Flotation?",
    hint: 'Crystalline body self and hovering—not standing.',
  },
  {
    number: 6,
    question: "What is the mechanical cause of Vibrational Friction during trauma extraction?",
    hint: 'High-frequency liquid meeting lower-frequency blockages.',
  },
  {
    number: 7,
    question: 'True or False: Water Domes are visible, solid structures built from crystalline lakes.',
    hint: 'Invisible translucent projected enclosures over waters.',
  },
  {
    number: 8,
    question: 'Which beings monitor and stabilize the healing process?',
    hint: 'Ground Healers from the Council of 12 Suns.',
  },
  {
    number: 9,
    question: 'What replaces the energetic void once emotional density is extracted?',
    hint: 'Resonant Infusion fills the cleared space.',
  },
  {
    number: 10,
    question: "How does Liquid Sound neutralize Vatican-archived amnesia loops?",
    hint: 'Timeline memory restoration and original frequency.',
  },
  {
    number: 11,
    question: 'What is the primary target of the healing provided by Crystal Halls?',
    hint: 'Mental overlays and parasitic programming with slabs and hums.',
  },
  {
    number: 12,
    question: 'Which color is NOT part of the luminous spectrum used for radio tuning?',
    hint: 'Named hues: blue, aqua, silver, pearl, and green.',
  },
  {
    number: 13,
    question: "What long-term benefit does clearing the heart's density provide?",
    hint: 'Immunization against loosh harvesting and frequency weapons.',
  },
  {
    number: 14,
    question: 'Why is stabilization through Liquid Sound necessary for higher physical realms?',
    hint: 'Frequency shock or lag in high-density environments.',
  },
  {
    number: 15,
    question:
      "True or False: Interaction between the soul's coding and Liquid Sound is the primary trigger for ancient sound recall.",
    hint: 'Tonal Awakening and spontaneous visions.',
  },
  {
    number: 16,
    question: "In the context of Liquid Sound, what is Emotional Density primarily composed of?",
    hint: 'Grief, fear, guilt, and heart-break as low-vibrational weight.',
  },
  {
    number: 17,
    question: 'What is the foundational principle behind the use of color for soul alignment?',
    hint: 'The sound-creates-light principle.',
  },
  {
    number: 18,
    question: 'Where are the Saferons sent from?',
    hint: 'A high solar council that dispatches Ground Healers.',
  },
  {
    number: 19,
    question: 'What is the primary therapeutic agent inside the heart-mending Water Domes?',
    hint: 'The active super-conductive vibrational water medium.',
  },
  {
    number: 20,
    question: 'How do souls typically feel when they emerge from the restorative pools?',
    hint: 'Light, smiling, and singing across lifetimes of density.',
  },
  {
    number: 21,
    question: 'True or False: Liquid Sound acts as a mechanical trigger for ancient remembrance.',
    hint: 'Direct trigger bridging the amnesia gap.',
  },
  {
    number: 22,
    question: "What is Harmonic Resonance in the context of the soul blueprint?",
    hint: 'Balanced high-vibrational original state replacing trauma.',
  },
  {
    number: 23,
    question: 'How do parasitic forces utilize the suppressed water of the 3D matrix?',
    hint: 'Aggressive artificial sound frequencies across oceans.',
  },
  {
    number: 24,
    question: "During Resonant Infusion, where are the memory codes of Source absorbed?",
    hint: 'The soul’s light body grid.',
  },
  {
    number: 25,
    question: 'What is the primary difference between Water Domes and Star Pods?',
    hint: 'Emotional heart wounds versus timeline trauma and soul fractures.',
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
    'Test your grasp of Liquid Sound — super-conductive vibrational water, emotional density extraction, Source memory codes, color-frequency tuning, Saferons, and immunization after heart restoration.',
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'Liquid Sound is the active therapeutic medium of Water Domes. Sit with vibrational friction that draws out grief and fear, resonant infusion of Source memory codes, color frequencies that lock positive octaves, and emergence into light, smiling, and singing. Return to the Liquid Sound deep-dive, infographic, and video transmissions as you hold immunity from loosh harvesting and readiness for higher physical realms.',
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
    'Test your understanding of Liquid Sound — vibrational trauma extraction; Source memory codes; harmonic resonance; color-frequency radio tuning; Saferons from the Council of 12 Suns; Crystal Halls and Star Pods; and immunization against loosh harvesting.',
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
        t.description.includes('Decoded analysis of Liquid Sound')
      ) {
        t.description =
          'Liquid Sound is the super-conductive vibrational state of water in Water Dome pools — extracting emotional density, infusing Source memory codes, and restoring harmonic resonance so traumatized souls can remember and re-align.';
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('liquid-sound not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from emotional-mending quiz (sibling under Water Domes)
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'emotional-mending.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Liquid Sound: vibrational trauma extraction, Source memory codes, color-frequency tuning, Saferons, harmonic resonance, and immunization after heart restoration.';
const replacements = [
  ['Emotional Mending Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Emotional Mending: Water Domes heart restoration, liquid sound density extraction, Saferins from the Council of 12 Suns, Source memory codes, tripartite sanctuaries, and sovereign choice after amnesia dissolves.',
    desc,
  ],
  ['quiz/breakdown/emotional-mending.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/emotional-mending.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=emotional-mending',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`,
  ],
  ['Emotional Mending deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Emotional Mending</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/emotional-mending.json',
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
  .replace(/Interactive Living Truth Quiz on Emotional Mending[^"]*/g, desc)
  .replace(/Emotional Mending/g, TOPIC_TITLE);

// Fix over-replacement on paths
html = html
  .replace(/Liquid Sound\.webp/g, 'liquid-sound.webp')
  .replace(/Liquid Sound\.json/g, 'liquid-sound.json')
  .replace(/Liquid Sound\.html/g, 'liquid-sound.html')
  .replace(/topic=Liquid Sound/g, `topic=${TOPIC_ID}`)
  .replace(/topic=liquid-sound/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/emotional-mending.html', priority: '0.75', changefreq: 'monthly' },";
  if (!sm.includes(anchor)) {
    // fallback anchor
    const alt =
      "  { path: '/quiz/breakdown/water-domes.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/liquid-sound.json'
);
