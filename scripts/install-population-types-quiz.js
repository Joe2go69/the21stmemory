/**
 * Installs Population Types quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/sol-quiz.json
 * Title forced to "Population Types". All 25 audited against population-types report only.
 *
 * Run: node scripts/install-population-types-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/population-types.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'population-types';
const TOPIC_TITLE = 'Population Types';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/sol-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/population-types.webp';

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

/** Support phrases grounded only in population-types.json report. */
const supportPhrases = {
  1: ['background programs', 'stability of the simulation', 'soulless'],
  2: ['human sols', 'genuine spark', 'inverted'],
  3: ['selling your soul', 'progressive', 'severing'],
  4: ['artificial entry bands', 'solar bands', "sun's natural gateway"],
  5: ['water domes', 'emotional density', 'memory codes of source'],
  6: ['resonating army', 'returners', 'awakened extraterrestrial'],
  7: ['dazed silence', 'erratic panic', 'communications blackout'],
  8: ['seeded sols', 'princess diana', 'barron trump'],
  9: ['sol frequency lock', 'original point of origin', 'healing sanctuaries'],
  10: ['star pods', 'timeline trauma', 'karmic wounds'],
  11: ['dormant active', 'listening to the energetic field', 'broadcasting'],
  12: ['saferons', 'council of 12 suns', 'holographic light beings'],
  13: ['scalar wave', 'harmonic tone', 'chest'],
  14: ['flicker', 'perception-based solidity', 'lose density'],
  15: ['vatican', 'akashic fragments', 'reincarnation loops'],
  16: ['sleepers', 'perceptions', 'premature panic'],
  17: ['spirit tree', 'greys', 'custodians'],
  18: ['crystal halls', 'rainbow fractals', 'mind-control'],
  19: ['loosh', 'emotional energy', 'parasitic grid'],
  20: ['ignoring', 'starving', 'high resonance'],
  21: ['dissolution', 'physical vessels', '3d overlay'],
  22: ['voice to skull', 'artificial thoughts', 'consciousness'],
  23: ['staged extraction', 'safety zone', 'princess diana'],
  24: ['staged awakening', 'healing sanctuaries', 'resonating sols'],
  25: ['ascend to higher realms', 'other domes', 'crystalline version'],
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
    [/\bis described as\b/gi, 'is'],
    [/\bare described as\b/gi, 'are'],
    [/\bis identified as\b/gi, 'is'],
    [/\bare identified as\b/gi, 'are'],
    [/\bthe process is described as\b/gi, 'the process is'],
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
 * NotebookLM content kept; rewritten only for fidelity, length, and voice.
 * All four options at similar depth from the population-types report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'They act as soulless background programs that hold the simulation together and keep the matrix structure functional.',
      rationale:
        'NPCs are soulless, empty biological vessels that function as repeating background programs to maintain the stability of the simulation.',
    },
    {
      text: 'They serve as energetic anchors for the crystalline grid, holding high-frequency fields stable during every frequency shift.',
      rationale:
        'NPCs have no organic memory lineage and no crystalline-grid anchor; when high frequencies collapse the overlay, they dissolve rather than stabilize the grid.',
    },
    {
      text: 'They are early-stage human souls waiting for their first activation codes before they can carry organic Source memory.',
      rationale:
        'NPCs have no true souls, no ancestral lineage, and no existence outside this simulated matrix; they are not developing human spirits.',
    },
    {
      text: 'They are extraterrestrial observers who entered with a mission and then forgot their original home realms.',
      rationale:
        'Mission-based awakened beings are Resonating Sols; NPCs are locally generated artificial shells seeded through solar bands.',
    },
  ],
  2: [
    {
      text: 'Human Sols — genuine spark-beings from the pre-fall world of Tara, captured and energetically inverted by parasites.',
      rationale:
        'Human Sols are true spiritual sparks from Tara who carry original Source codes but have been captured and energetically inverted by parasites.',
    },
    {
      text: 'Seeded Sols — high-frequency lineages placed inside parasitic bloodlines to fracture control, not the general inverted population.',
      rationale:
        'Seeded Sols are a specialized placement inside prominent bloodline systems; they are not the general captive Human Sol population.',
    },
    {
      text: 'Resonating Sols — already awakened extraterrestrial souls who entered as a rescue army rather than inverted captives.',
      rationale:
        'Resonating Sols are already awakened Returners here to liberate Human Sols; they are not the inverted captive sparks.',
    },
    {
      text: 'Saferons — tall holographic light beings from the Council of 12 Suns who guide sanctuary transitions, not inverted human sparks.',
      rationale:
        'Saferons are non-physical holographic light beings from the Council of 12 Suns, not inverted human spirits.',
    },
  ],
  3: [
    {
      text: 'A systematic, progressive severing of the soul\'s connection to Source as resonance is traded for wealth, fame, or power.',
      rationale:
        'Selling your soul is a literal energetic process: a progressive, systematic severing of the soul\'s connection to Source, not an instant death.',
    },
    {
      text: 'The replacement of a human spark with an NPC autopilot program injected through the artificial solar bands.',
      rationale:
        'NPC shells are seeded through artificial solar bands; selling a soul is a true human soul choosing to sever its own Source connection.',
    },
    {
      text: 'A temporary loss of memory that is automatically restored during the next solar cycle without lasting fracture.',
      rationale:
        'Selling a soul is a progressive Source-sever, not a temporary memory wipe restored on the next solar cycle.',
    },
    {
      text: 'An instantaneous physical death followed by a forced reincarnation into a new vessel in the same overlay.',
      rationale:
        'Selling a soul is not an instantaneous death; it is a progressive, systematic severing of the soul\'s connection to Source.',
    },
  ],
  4: [
    {
      text: 'Through four to five artificial entry bands installed around the sun\'s natural gateway as custom parasitic filters.',
      rationale:
        'NPCs are generated through four to five artificial entry bands around the sun\'s natural gateway; those bands inject shells carrying parasitic software instead of organic memory lineages.',
    },
    {
      text: 'Through the organic reincarnation cycles of the Spirit Tree, which still feeds every true soul into a new body.',
      rationale:
        'The Spirit Tree originally linked true souls to Source; parasites ripped it out and seeded NPC shells through artificial solar bands, not organic Spirit Tree cycles.',
    },
    {
      text: 'By manifesting directly from the thoughts of the human collective whenever enough people imagine a new extra body.',
      rationale:
        'NPCs are deliberately seeded by parasites through technical hardware at the sun\'s gateway, not thought-form manifestations of the human collective.',
    },
    {
      text: 'By hitchhiking on the frequency fields of Resonating Sols as those beings enter the dome to begin their mission.',
      rationale:
        'Resonating Sols carry high-frequency codes that fracture the overlay and make NPC software malfunction; they are not an entry vehicle for NPC shells.',
    },
  ],
  5: [
    {
      text: 'To extract emotional density such as grief, fear, and guilt, and replace it with the memory codes of Source.',
      rationale:
        'Water Domes vibrate like liquid sound; floating in those pools extracts emotional density and replaces it with the memory codes of Source.',
    },
    {
      text: 'To provide physical hydration to souls who have completed their mission and now need ordinary biological water.',
      rationale:
        'Water Domes are cloaked crystalline sanctuaries for etheric and emotional restoration, not biological hydration stations.',
    },
    {
      text: 'To store the Akashic fragments taken from the Vatican vaults so parasites can keep recycling those records.',
      rationale:
        'Vatican vaults are parasitic storage for copied Akashic fragments; Water Domes are liberation chambers that insert Source memory codes.',
    },
    {
      text: 'To shield the physical body from the scalar-wave burst that triggers Resonating Sols into broadcast mode.',
      rationale:
        'Water Domes repair emotional density through liquid sound; the scalar wave burst is a trigger signal for Resonating Sols, not a Water Dome function.',
    },
  ],
  6: [
    {
      text: 'Already awakened extraterrestrial souls who entered this density to restore the original design and liberate Human Sols.',
      rationale:
        'Resonating Sols are already awakened extraterrestrial souls, also known as the Resonating Army or Returners, here to anchor high frequencies and activate human souls.',
    },
    {
      text: 'The early Custodians who ordered the Greys to rip out the Spirit Tree and install the Amnesia Vortex.',
      rationale:
        'The early Custodians craved control and ordered the Greys to rip the Spirit Tree out; they are not the Resonating Army rescue force.',
    },
    {
      text: 'Human Sols who have successfully resisted every parasitic contract and now lead the extraction of their own kind.',
      rationale:
        'Human Sols are the inverted sparks the Resonating Army came to liberate; they are not the primary pre-awakened rescue force.',
    },
    {
      text: 'NPCs that the Council of 12 Suns reprogrammed into a spiritual army once the overlay began to fracture.',
      rationale:
        'NPCs are soulless programs with no spark to awaken; they cannot be turned into a Resonating Army.',
    },
  ],
  7: [
    {
      text: 'Dazed silence, erratic panic, and sudden emotional outbursts such as screaming or weeping as their software loops.',
      rationale:
        'During the initial communications blackout, NPCs experience severe program loops that manifest as dazed silence, erratic panic, and sudden screaming or weeping.',
    },
    {
      text: 'Forming organized groups to protect 3D structures and coordinate a strategic defense of the overlay.',
      rationale:
        'NPCs default to highly visible, repetitive panic behaviors, not coordinated strategic defense of 3D structures.',
    },
    {
      text: 'Immediately ascending onto the high-frequency crystalline grid as soon as the blackout begins.',
      rationale:
        'NPCs have no frequency anchor outside the low-frequency overlay; they dissolve rather than ascend when that overlay fails.',
    },
    {
      text: 'Gaining the ability to communicate telepathically with Human Sols as their programs attempt a last upgrade.',
      rationale:
        'Telepathic soul connection requires a spark NPCs do not have; glitching is program-loop panic, not a new communication gift.',
    },
  ],
  8: [
    {
      text: 'To fracture parasitic bloodline control structures from the inside by carrying solar codes inside those families.',
      rationale:
        'High councils seeded high-frequency souls such as Princess Diana and Barron Trump into key familial lines to fracture parasitic bloodlines from the inside.',
    },
    {
      text: 'To act as hosts for the return of the early Custodians so those controllers can reclaim the Spirit Tree wound.',
      rationale:
        'Seeded Sols are high-frequency souls placed to sabotage control mechanics, not hosts for returning Custodians.',
    },
    {
      text: 'To collect the Akashic fragments of the human population and deliver them into the Vatican vaults.',
      rationale:
        'Copying Akashic fragments into Vatican vaults is a parasitic tactic; Seeded Sols work to fracture those bloodline systems.',
    },
    {
      text: 'To lead the public political transition of the 3D matrix and keep the overlay\'s official story intact.',
      rationale:
        'Their roles are energetic and disruptive — Diana\'s staged extraction and Barron as a silent guardian — not public political maintenance of the matrix.',
    },
  ],
  9: [
    {
      text: 'Their physical vessels phase out of the dome and return to their original point of origin, skipping the sanctuaries.',
      rationale:
        'At sol frequency lock, crystal and Earth grids create an electromagnetic threshold that phases Resonating Sols out of the dome to their origin without passing through healing sanctuaries.',
    },
    {
      text: 'They are sent to Crystal Halls to begin a staged healing process before they are allowed to leave the dome.',
      rationale:
        'Resonating Sols already carry pre-awakened codes and return home without passing through any healing sanctuaries.',
    },
    {
      text: 'They are permanently merged with the physical vessels of NPCs so those shells can survive the overlay collapse.',
      rationale:
        'The frequency gap between a Resonating Sol and an NPC shell is not bridged by merging; NPCs dissolve when the overlay drops.',
    },
    {
      text: 'They lose their individual forms and become part of the Spirit Tree\'s surviving roots as a single planetary field.',
      rationale:
        'They return to their original point of origin as individual beings; they are not absorbed into the Spirit Tree roots.',
    },
  ],
  10: [
    {
      text: 'Star Pods — floating cocoons in etheric space that reweave timeline trauma, karmic wounds, and soul fractures.',
      rationale:
        'Star Pods are specifically tuned for souls carrying timeline trauma, karmic wounds, and deep soul fractures across multiple lifetimes.',
    },
    {
      text: 'Water Domes — aqua, blue, and silver sanctuaries that extract grief, fear, and guilt through liquid sound.',
      rationale:
        'Water Domes specialize in emotional-density extraction, not timeline and soul-fracture reweaving.',
    },
    {
      text: 'Crystal Halls — humming crystal temples that clear mind-control damage and realign the light body grid.',
      rationale:
        'Crystal Halls focus on mental energetic healing and overlay clearing, not multi-lifetime soul-fracture reweaving.',
    },
    {
      text: 'The Amnesia Vortex — the parasitic station at the sun\'s transit band designed to fragment memory, not restore it.',
      rationale:
        'The Amnesia Vortex is a parasitic installation that forced reincarnation loops; it does not heal timeline trauma.',
    },
  ],
  11: [
    {
      text: 'The soul is listening to the energetic field rather than actively broadcasting, waiting for the trigger signals.',
      rationale:
        'Throughout the preparatory phases, Resonating Sol codes remain dormant active: listening to the energetic field rather than actively broadcasting.',
    },
    {
      text: 'The soul is asleep and unaware of its extraterrestrial origin, locked in the same amnesia as Sleepers.',
      rationale:
        'Resonating Sols entered with embedded, pre-awakened soul codes; they are not asleep Sleepers caught in the overlay.',
    },
    {
      text: 'The codes are already broadcasting high-frequency signals into NPC shells to convert them into allies.',
      rationale:
        'Broadcasting begins only after the trigger signals; NPCs cannot receive those codes as organic allies.',
    },
    {
      text: 'The codes are temporarily disabled by the Saturn Moon Frequency Station until the overlay fully collapses.',
      rationale:
        'Dormant-active status is a preparatory listening phase, not a parasitic disable by the Saturn Moon Frequency Station.',
    },
  ],
  12: [
    {
      text: 'Tall holographic light beings from the Council of 12 Suns who act as ground healers and guides in the sanctuaries.',
      rationale:
        'Saferons are tall, radiant, non-physical holographic light beings sent from the Council of 12 Suns to act as ground healers and guides in the transition sanctuaries.',
    },
    {
      text: 'Parasitic guards who maintain the Amnesia Vortex at the sun\'s transit band and keep souls looping.',
      rationale:
        'Saferons are benevolent sanctuary healers; they are not the parasitic guards of the Amnesia Vortex.',
    },
    {
      text: 'A specialized group of NPCs designed to look like light beings so the overlay can fake a homecoming.',
      rationale:
        'NPCs have no capacity for holographic light work or vibrational healing; Saferons are Council of 12 Suns beings.',
    },
    {
      text: 'The original human inhabitants of the Spirit Tree gardens before the Greys ripped the tree out.',
      rationale:
        'Pre-fall humans are Human Sols from Tara; Saferons are non-physical guides from the Council of 12 Suns.',
    },
  ],
  13: [
    {
      text: 'A scalar wave burst from allied space forces and a deep harmonic tone felt as a call in the chest.',
      rationale:
        'The transition to active duty occurs through two simultaneous triggers: a scalar wave burst from allied space forces and a deep, familiar harmonic tone felt in the chest from the solar family.',
    },
    {
      text: 'A massive protest by the majority of the NPC population as their programs begin to loop in the streets.',
      rationale:
        'NPCs operate on pre-coded autopilot and cannot trigger spiritual activation; the call is a scalar burst plus a chest harmonic.',
    },
    {
      text: 'The physical destruction of the Vatican\'s underground vaults where Akashic fragments were copied and stored.',
      rationale:
        'Activation is frequency-based — scalar burst and chest harmonic — not dependent on destroying the Vatican vaults.',
    },
    {
      text: 'The completion of the healing process inside Star Pods after timeline trauma has been fully rewoven.',
      rationale:
        'Star Pods restore Human Sols after the event; Resonating Sols are triggered into broadcast before they exit, and they skip the sanctuaries.',
    },
  ],
  14: [
    {
      text: 'These materials flicker, bend, and lose their perceived density as perception-based solidity fails.',
      rationale:
        'Concrete, brick, and steel are low-frequency matter held by perception-based solidity; rising population frequency makes them flicker, bend, and lose density.',
    },
    {
      text: 'There is no effect on physical matter because the entire transition is spiritual and leaves streets untouched.',
      rationale:
        'The 3D overlay is an electromagnetic framework; physical matter is held by perception-based solidity and is directly affected as frequency rises.',
    },
    {
      text: 'It turns every artificial structure into a permanent crystalline healing center that remains standing in place.',
      rationale:
        'Low-frequency materials flicker, bend, and lose density; they do not convert into standing crystalline healing centers.',
    },
    {
      text: 'It reinforces their density, locking the matrix in place and making the overlay harder than ever to leave.',
      rationale:
        'Rising frequency breaks perception-based solidity; it does not reinforce the density of concrete, brick, and steel.',
    },
  ],
  15: [
    {
      text: 'In vaults beneath the Vatican, where copied Akashic fragments kept human souls docile in reincarnation loops.',
      rationale:
        'Parasites copied and stored Akashic fragments in vaults beneath the Vatican to keep true human souls docile and manageable in reincarnation loops.',
    },
    {
      text: 'Inside the artificial solar bands surrounding the sun, where NPC shells are injected into the physical realm.',
      rationale:
        'Those bands seed empty NPC shells; they are not the storage vaults for human Akashic fragments.',
    },
    {
      text: 'Within the heart of the Resonating Army, which carries every human fragment as part of the rescue payload.',
      rationale:
        'The Resonating Army carries its own pre-awakened codes and came to liberate Human Sols; parasitic storage is under the Vatican.',
    },
    {
      text: 'In the surviving roots of the Spirit Tree in Hyperborea, used as a prison for siphoned soul records.',
      rationale:
        'The Spirit Tree originally anchored a pure flow of light for true souls; Vatican vaults, not the tree roots, stored copied Akashic fragments.',
    },
  ],
  16: [
    {
      text: 'They are true soul-bearing individuals whose perceptions are held in a heavily manipulated, manageable state.',
      rationale:
        'Sleepers are true soul-bearing individuals whose perceptions are actively held in a manageable, heavily manipulated state to prevent premature panic or awakening.',
    },
    {
      text: 'They are beings from the Council of 12 Suns currently held in stasis until the sanctuaries open.',
      rationale:
        'Council of 12 Suns beings in this report are the Saferons, active ground healers, not manipulated Sleepers.',
    },
    {
      text: 'They are humans who have sold their souls for physical wealth, fame, power, or immortality.',
      rationale:
        'Souls who trade natural resonance for wealth, fame, power, or immortality are Traitors, not Sleepers.',
    },
    {
      text: 'They are soulless vessels that only simulate human sleep patterns to pad the background of the overlay.',
      rationale:
        'Sleepers possess true souls; soulless background vessels are NPCs.',
    },
  ],
  17: [
    {
      text: 'It was ripped out by the Greys under orders from the early Custodians who craved control of the light flow.',
      rationale:
        'When the early Custodians craved control, they ordered the Greys to rip the Spirit Tree out and installed the Saturn Moon Frequency Station and Amnesia Vortex.',
    },
    {
      text: 'It was transformed into the Saturn Moon Frequency Station so the same tree could keep broadcasting Source light.',
      rationale:
        'The Saturn Moon Frequency Station was an artificial installation that replaced the tree\'s organic function; the tree was ripped out, not transformed into the station.',
    },
    {
      text: 'It grew into the crystalline Water Domes now projected over oceans as the primary emotional healing halls.',
      rationale:
        'Water Domes are cloaked crystalline sanctuaries of the liberation path; the Spirit Tree was the original central light anchor that parasites ripped out.',
    },
    {
      text: 'It was moved intact into the Vatican vaults to power the Amnesia Vortex with its original Source current.',
      rationale:
        'The Vatican vaults store copied Akashic fragments; the tree was ripped from Hyperborea, not relocated into those vaults.',
    },
  ],
  18: [
    {
      text: 'Crystal Halls — crystalline temples with rainbow-fractal walls and breathing columns that clear mind-control damage.',
      rationale:
        'In Crystal Halls, living crystal walls glow with rainbow fractals and columns breathe with light to realign the light body grid, clear parasitic overlays, and dissolve mind-control damage.',
    },
    {
      text: 'The Hyperborean Gardens — the original seven outer gardens fed by the Spirit Tree before the fall.',
      rationale:
        'Those gardens were the original Spirit Tree architecture; current mental-energetic clearing happens in Crystal Halls.',
    },
    {
      text: 'Star Pods — etheric cocoons that reweave karmic wounds and timeline trauma across multiple lifetimes.',
      rationale:
        'Star Pods mend soul fractures and timeline trauma; rainbow-fractal mental clearing belongs to Crystal Halls.',
    },
    {
      text: 'Water Domes — liquid-sound pools that extract grief, fear, heartbreak, and guilt from the emotional field.',
      rationale:
        'Water Domes extract emotional density through liquid sound; they do not use rainbow-fractal crystal walls for mind-control clearing.',
    },
  ],
  19: [
    {
      text: 'Emotional energy siphoned from true souls that feeds the parasitic grid and keeps the overlay running.',
      rationale:
        'By holding high resonance and refusing fear, true souls cut off the flow of loosh — emotional energy — that feeds the parasitic grid.',
    },
    {
      text: 'The biological software used to generate new NPC shells through the artificial solar bands.',
      rationale:
        'NPC shells are seeded through artificial solar bands; loosh is the emotional energy harvested from true souls.',
    },
    {
      text: 'The scalar-wave frequency used by allied space forces to extract Resonating Sols from the dome.',
      rationale:
        'The scalar wave burst is a liberation trigger for Resonating Sols; loosh is the dense emotional harvest that feeds parasites.',
    },
    {
      text: 'The high-frequency light originally emitted by the Spirit Tree through the seven outer gardens.',
      rationale:
        'The Spirit Tree anchored a pure flow of Source light; loosh is the dense emotional energy siphoned by the parasitic grid.',
    },
  ],
  20: [
    {
      text: 'By ignoring and starving the NPC systems, holding high resonance, and rejecting false matrix contracts.',
      rationale:
        'True souls do not need to fight NPCs; the strategy is to ignore and starve those systems by holding high resonance, refusing fear, and rejecting false matrix contracts, cutting off loosh.',
    },
    {
      text: 'By attempting to teach NPCs how to connect to Source so those vessels can awaken and join the rescue.',
      rationale:
        'NPCs have no soul spark and no existence outside the overlay; teaching them to connect to Source cannot work.',
    },
    {
      text: 'By engaging in physical combat with NPCs to reclaim streets, buildings, and the visible 3D grid.',
      rationale:
        'Physical opposition is not the strategy; fighting feeds loosh, while holding high resonance starves the parasitic grid.',
    },
    {
      text: 'By destroying the artificial solar bands through mental intention so no new NPC shells can be injected.',
      rationale:
        'The emphasized strategy is personal resonance, refusing fear, and starving the loosh feed — not a mental assault on the solar bands.',
    },
  ],
  21: [
    {
      text: 'They experience the dissolution of their physical vessels, like shadows when the light hits.',
      rationale:
        'When the parasitic 3D overlay collapses, NPCs have no anchor to sustain them and simply dissolve like shadows when the light hits.',
    },
    {
      text: 'They are relocated to a new dome for further programming so the background population can continue.',
      rationale:
        'NPC existence is tied to the low-frequency 3D overlay; when that overlay drops, those vessels dissolve rather than relocate.',
    },
    {
      text: 'They become the new healers in the Water Domes, replacing Saferons as the overlay ends.',
      rationale:
        'Healing is performed by Saferons and resonant beings; soulless autopilot vessels dissolve when the overlay drops.',
    },
    {
      text: 'They are upgraded with soul codes by the Council of 12 Suns so they can survive in higher-frequency realms.',
      rationale:
        'NPCs are strictly tied to the low-frequency overlay and have no capacity for higher-frequency existence; they dissolve.',
    },
  ],
  22: [
    {
      text: 'Voice to Skull technology, which projects artificial thoughts, voices, and actions into their consciousness.',
      rationale:
        'Because NPC shells carry parasitic software instead of organic memory, Voice to Skull technology easily projects artificial thoughts, voices, and actions into their consciousness.',
    },
    {
      text: 'Akashic memory retrieval, which pulls ancestral records from the Vatican vaults into the NPC shell.',
      rationale:
        'NPCs have no ancestral lineage or Akashic records; those fragments belong to true human souls stored under the Vatican.',
    },
    {
      text: 'Scalar wave bursts, which allied space forces use to lock NPC software into a permanent command mode.',
      rationale:
        'Scalar wave bursts are used by allied space forces to activate Resonating Sols, not to manipulate NPC consciousness.',
    },
    {
      text: 'Crystalline grid transmissions, which NPCs receive as organic Source codes through the planet\'s nodes.',
      rationale:
        'NPCs cannot interface with crystalline grids; they lack organic resonance and Source codes.',
    },
  ],
  23: [
    {
      text: 'To move her to a safety zone so she could fracture the royal parasitic network and seed a clean harmonic line.',
      rationale:
        'Princess Diana\'s death was a staged extraction to a safety zone, allowing her to fracture the royal parasitic network from within and seed her clean harmonic line beyond their control.',
    },
    {
      text: 'To prevent her from revealing the location of the Spirit Tree roots still pulsing under Hyperborea.',
      rationale:
        'Her mission was bloodline sabotage and a clean harmonic line, not concealment of the Spirit Tree roots.',
    },
    {
      text: 'To test the effectiveness of the Star Pod healing sanctuaries on a high-profile Seeded Sol.',
      rationale:
        'The extraction was a staged operation against a parasitic bloodline, not a medical test of Star Pods.',
    },
    {
      text: 'To allow her to reincarnate into a more powerful royal family still inside the same parasitic network.',
      rationale:
        'The goal was to exit that network and seed a clean line beyond parasitic control, not to re-enter another royal cage.',
    },
  ],
  24: [
    {
      text: 'Yes. Human Sols undergo a staged restoration through the sanctuaries to repair matrix damage before they choose their next path.',
      rationale:
        'True human souls undergo a precise, staged awakening and restoration through Water Domes, Crystal Halls, and Star Pods; Resonating Sols are the ones who bypass those halls.',
    },
    {
      text: 'No. Human Sols skip every sanctuary and phase out of the dome through a sol frequency lock, just as Resonating Sols do.',
      rationale:
        'Sol frequency lock is the Resonating Sol exit; Human Sols require the staged sanctuary restoration to repair inversion damage.',
    },
    {
      text: 'No. Only Resonating Sols enter Water Domes, Crystal Halls, and Star Pods; Human Sols choose immediately when the overlay drops.',
      rationale:
        'The sanctuaries are for inverted Human Sols; Resonating Sols return to origin without passing through any healing sanctuaries.',
    },
    {
      text: 'Yes, but only after they retrieve their own Akashic fragments from the Vatican vaults in a physical raid.',
      rationale:
        'Restoration happens in the cloaked sanctuaries with Saferon support; Vatican vaults are parasitic storage, not a required human raid.',
    },
  ],
  25: [
    {
      text: 'They can ascend to higher realms, transition to other domes, or reincarnate in a restored crystalline Earth.',
      rationale:
        'Once the false layers dissolve, human souls may ascend to higher realms, transition to other domes, or reincarnate in a fresh cycle on a fully restored crystalline Earth without parasitic control.',
    },
    {
      text: 'They must return to the Vatican vaults to reclaim their fragments before any other path can open.',
      rationale:
        'Healing sanctuaries restore the soul; the Vatican vaults are parasitic storage, not a required destination after the overlay dissolves.',
    },
    {
      text: 'They are forced to merge into the collective consciousness of the Council of 12 Suns and lose individuality.',
      rationale:
        'The process restores sovereign choice; it does not force a merger into the Council of 12 Suns.',
    },
    {
      text: 'They must remain to repair the physical structures of the 3D matrix — concrete, brick, and steel — as their only path.',
      rationale:
        'Those materials lose density as the overlay collapses; souls are not required to stay behind and rebuild the 3D matrix.',
    },
  ],
};

const questionsMeta = [
  {
    number: 1,
    question:
      'What is the primary function of Non-Player Characters (NPCs) within the CUBE Containment?',
    hint: 'Consider their role in the underlying software of the reality framework.',
  },
  {
    number: 2,
    question:
      'Which population group consists of genuine spark-beings who have been energetically inverted by parasitic systems?',
    hint: 'Focus on the group that originates from the pre-fall world of Tara.',
  },
  {
    number: 3,
    question: "What occurs during the process known as 'selling your soul'?",
    hint: 'Think of it as an energetic erosion rather than a quick transaction.',
  },
  {
    number: 4,
    question: 'How do NPCs enter the physical realm of the containment?',
    hint: 'Look for the mechanical filters used by the parasites to control the population flow.',
  },
  {
    number: 5,
    question: 'What is the specific purpose of the Water Domes located in healing sanctuaries?',
    hint: 'Identify which dome focuses on the vibration of liquid sound and the removal of grief.',
  },
  {
    number: 6,
    question: "Which group is referred to as the 'Resonating Army' or 'Returners'?",
    hint: 'Identify the group that entered the simulation with embedded, pre-awakened codes.',
  },
  {
    number: 7,
    question:
      "During the initial stages of a communications blackout, how might an NPC demonstrate 'physical glitching'?",
    hint: 'Think about how a program behaves when its operating environment fails.',
  },
  {
    number: 8,
    question: 'What is the role of Seeded Sols like Princess Diana and Barron Trump?',
    hint: 'Consider the strategic advantage of placing a high-frequency soul inside a dark lineage.',
  },
  {
    number: 9,
    question:
      "What happens to Resonating Sols at the apex of the event through the 'sol frequency lock'?",
    hint: 'Determine the final destination for the rescue team after the mission is complete.',
  },
  {
    number: 10,
    question:
      'Which healing sanctuary is specifically tuned for souls carrying timeline trauma and deep soul fractures?',
    hint: 'Think of a cocoon-like environment in etheric space.',
  },
  {
    number: 11,
    question: "What does it mean for a Resonating Sol's codes to be 'dormant active'?",
    hint: 'Distinguish between listening for a signal and sending one out.',
  },
  {
    number: 12,
    question: 'Who are the Saferons?',
    hint: "Identify the gentle, radiant beings who mirror the soul's original family.",
  },
  {
    number: 13,
    question:
      'What triggers the transition of Resonating Sols from dormant to active broadcast mode?',
    hint: 'Look for a combination of an external frequency burst and an internal resonance.',
  },
  {
    number: 14,
    question:
      'How does the rising frequency of the population affect physical materials like concrete and steel?',
    hint: "Recall the concept of 'perception-based solidity' and what happens when perception changes.",
  },
  {
    number: 15,
    question: 'Where were human Akashic fragments stored to keep the population manageable?',
    hint: 'Identify the historical center where soul data was siphoned and copied.',
  },
  {
    number: 16,
    question: 'What is the defining characteristic of the group known as Sleepers?',
    hint: 'Think of soul-bearing individuals who are still under the influence of the matrix control.',
  },
  {
    number: 17,
    question: 'What happened to the Spirit Tree of Hyperborea?',
    hint: "Recall the actions taken by the Greys and the Custodians' desire for control.",
  },
  {
    number: 18,
    question:
      'Which healing center utilizes living crystal walls and rainbow fractals to clear mind-control damage?',
    hint: 'Focus on the location described as crystalline temples often overlaid by 3D perceptions of cathedrals.',
  },
  {
    number: 19,
    question: "What is 'loosh' within the context of the parasitic matrix?",
    hint: 'Consider what is siphoned from humans through fear and conflict.',
  },
  {
    number: 20,
    question: 'How can Human Sols strategically contribute to the collapse of the NPC systems?',
    hint: 'The best way to defeat a parasite is to stop feeding it.',
  },
  {
    number: 21,
    question: 'What is the destiny of NPCs when the 3D overlay completely drops?',
    hint: 'Think about what happens to a shadow when the light hits it directly.',
  },
  {
    number: 22,
    question: 'What technological weapon is easily used to manipulate NPC consciousness?',
    hint: "Look for the technology that targets the 'pre-coded autopilot software' of the shell.",
  },
  {
    number: 23,
    question: "Why did Princess Diana's extraction involve a staged death?",
    hint: 'Focus on the strategic purpose of removing a Seeded Sol from a parasitic lineage.',
  },
  {
    number: 24,
    question:
      'Do Human Sols go through a healing sanctuary before choosing their next destination?',
    hint: 'Consider the extent of the damage inflicted by the parasitic matrix on the local population.',
  },
  {
    number: 25,
    question: 'What is the ultimate choice presented to human souls after the false layers dissolve?',
    hint: 'Identify the three paths of freedom mentioned for the liberated souls.',
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
    'Test your grasp of Population Types — NPCs, Human Sols, Resonating Sols, Sleepers, Seeded Sols, and Traitors inside the CUBE Containment; sanctuary paths; sol frequency lock; and the Event Cycle strategy of starving the overlay.',
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'This realm is not one uniform population. Sit with NPCs as soulless background programs, Human Sols inverted from Tara, Resonating Sols listening then locking frequency home, Sleepers held manageable, Seeded Sols fracturing bloodlines from inside, and Traitors who sell resonance for power. Return to the Population Types deep-dive, infographic, and video transmissions as you hold high resonance and refuse the loosh feed.',
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
    'Test your understanding of Population Types — NPCs, Human Sols, Resonating Sols, Sleepers, Seeded Sols, and Traitors; Water Domes, Crystal Halls, Star Pods; sol frequency lock; and starving NPC systems by holding high resonance.',
};
topic.quiz = quizMeta;
fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2) + '\n', 'utf8');

const monoPath = path.join(ROOT, 'data', 'breakdown-topics.json');
const mono = JSON.parse(fs.readFileSync(monoPath, 'utf8'));
function findAndPatch(topics) {
  for (const t of topics) {
    if (t.id === TOPIC_ID) {
      t.quiz = quizMeta;
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('population-types not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'nebulae-resting.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Population Types: NPCs, Human Sols, Resonating Sols, Sleepers, Seeded Sols, Traitors, healing sanctuaries, sol frequency lock, and starving the parasitic grid.';
const replacements = [
  ['Nebulae Resting Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Nebulae Resting: Star Pods and the Womb of Light, soul fractures and timeline trauma, Water Domes / Crystal Halls / Starlight Pods, Red Sea doubt, loosh collapse, and sovereign choice after restoration.',
    desc,
  ],
  ['quiz/breakdown/nebulae-resting.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/nebulae-resting.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=nebulae-resting',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`,
  ],
  ['Nebulae Resting deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['data/quizzes/breakdown/nebulae-resting.json', `data/quizzes/${SOURCE}/${TOPIC_ID}.json`],
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 90));
  }
  html = html.split(a).join(b);
}

html = html
  .replace(/Interactive Living Truth Quiz on Nebulae Resting[^"]*/g, desc)
  .replace(/Nebulae Resting/g, TOPIC_TITLE);

html = html
  .replace(/Population Types\.webp/g, 'population-types.webp')
  .replace(/Population Types\.json/g, 'population-types.json')
  .replace(/Population Types\.html/g, 'population-types.html')
  .replace(/topic=Population Types/g, `topic=${TOPIC_ID}`)
  .replace(/topic=population-types/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/nebulae-resting.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/population-types.json'
);
