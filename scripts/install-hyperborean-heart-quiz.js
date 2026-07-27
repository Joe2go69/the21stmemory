/**
 * Installs Hyperborean Heart quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/hyperborea-quiz.json (15 items)
 * Expanded to 25; brand-footer items rewritten from hyperborean-heart report only.
 * Audits all 25 against data/breakdown-topics/hyperborean-heart.json.
 * Run: node scripts/install-hyperborean-heart-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/hyperborean-heart.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'hyperborean-heart';
const TOPIC_TITLE = 'Hyperborean Heart';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/hyperborea-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/hyperborean-heart.webp';

// Optional: load source for extractedAt only
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

/** Support phrases grounded only in hyperborean-heart.json report. */
const supportPhrases = {
  1: ['antarctica', 'holographic', 'hyperborea'],
  2: ['physical density', 'harmonic amplifier', 'higher-frequency'],
  3: ['lyran builders-architects', 'planted', 'spirit tree'],
  4: ['black cube tech', 'inward-sucking', 'vacuum'],
  5: ['polaris', 'false', 'north star'],
  6: ['living resonance field', 'beating heart', 'cube system'],
  7: ['178 physical', '8 domes', 'central heartbeat'],
  8: ['lunar', 'saturn', 'valve'],
  9: ['thalon', 'seed codes', 'spirit tree'],
  10: ['roots', 'harmonic lenses', 'nodes'],
  11: ['seven', 'gardens', 'outer domes'],
  12: ['greys', 'uproot', 'demolition'],
  13: ['could not sever', 'source', 'physically remove'],
  14: ['dome of forgotten gods', 'gardens', 'seven'],
  15: ['positive fleets', 'cracking', 'holographic ice'],
  16: ['custodians', 'parasitic', 'destruction'],
  17: ['valve', 'filter', 'siphon', 'invert'],
  18: ['aru-el-nai', 'thuban', 'north star'],
  19: ['black crystalline', 'valve locks', 'inverted'],
  20: ['outward-flowing', 'inward', 'parasitic overlays'],
  21: ['root system remains alive', 'resonant codes', 'reignite'],
  22: ['seven outer gardens', 'wilted', 'inverted prisons'],
  23: ['closed-loop', 'energy harvesting', 'amnesia'],
  24: ['e.t. sols', 'synchronizing', 'human vessels'],
  25: ['roots light up', 'starving', 'saturn', 'bloom'],
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
    [/^According to the journal,?\s*/i, ''],
    [/\baccording to the (report|source|text|core revelations|revelations|material|journal|living truth)\b/gi, ''],
    [/^The source states that\s+/i, ''],
    [/^The source specifies that\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The text identifies\s+/i, ''],
    [/^The material states that\s+/i, ''],
    [/^The journal states that\s+/i, ''],
    [/^The journal attributes\s+/i, ''],
    [/\bthe journal attributes the change to\b/gi, ''],
    [/\bthe source identifies\b/gi, ''],
    [/\bthe source explicitly describes\b/gi, ''],
    [/\bthe text focuses on\b/gi, ''],
    [/\bdescribed in the journal\b/gi, ''],
    [/\bdescribed in the architectural mechanics\b/gi, ''],
    [/\bdescribed in the hijacking\b/gi, ''],
    [/\bin this text\b/gi, ''],
    [/\bis identified as\b/gi, 'is'],
    [/\bare identified as\b/gi, 'are'],
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
 * All four options at similar depth from the hyperborean-heart report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'Antarctica — the frozen holographic wasteland that currently masks Hyperborea as a severe geographic distortion.',
      rationale:
        'Hyperborea is the true living heart of the system, currently hidden beneath the holographic illusion that humanity perceives as the frozen wasteland of Antarctica.',
    },
    {
      text: 'The Himalayas — treated as the exclusive central anchor landmass of the Great Dome and Spirit Tree trunk.',
      rationale:
        'The Himalayas are not the mask of Hyperborea; the report places the holographic ice distortion over Antarctica.',
    },
    {
      text: 'The Gobi Desert — named as the sole site of the Spirit Tree and the central axis of the known lands.',
      rationale:
        'The Gobi is not identified as the Hyperborean field or Spirit Tree center; Antarctica is the holographic mask of that living land.',
    },
    {
      text: 'The Arctic Circle — presented as the only frozen mask hiding the living resonance field of Hyperborea.',
      rationale:
        'The Arctic is often confused with a northern center, but the report identifies the southern frozen wasteland of Antarctica as the holographic mask of Hyperborea.',
    },
  ],
  2: [
    {
      text: 'Physical density of the Great Dome acting as a massive harmonic amplifier for higher-frequency domes.',
      rationale:
        "Because the Great Dome was designed with physical density, that density acted as a massive harmonic amplifier that fueled the other higher-frequency domes through the Spirit Tree's transmission.",
    },
    {
      text: 'Solar panel arrays alone absorbing sunlight to power every outer garden without any central node role.',
      rationale:
        'The system is fueled by harmonic currents from the central node and density amplification, not external solar-panel absorption as the primary mechanism.',
    },
    {
      text: 'Atmospheric pressure regulation alone pushing Source Light into the seven gardens without harmonic density.',
      rationale:
        'Physical pressure is not named as the amplifier; physical density of the Great Dome supplies the harmonic amplification for higher-frequency domes.',
    },
    {
      text: 'Crystalline grid refraction alone replacing density so the Great Dome never needs a Spirit Tree trunk.',
      rationale:
        'Crystalline grids maintain heartbeat currents, but the specific fuel for other domes is the Great Dome density acting as a harmonic amplifier through the tree.',
    },
  ],
  3: [
    {
      text: 'The Lyran Builders-Architects, who planted the Spirit Tree as the supreme central axis of consciousness.',
      rationale:
        'The Spirit Tree was planted by the Lyran Builders-Architects to generate pure bright light through sound and vibration as the axis of consciousness for the known lands.',
    },
    {
      text: 'The Greys, who alone designed and planted the original Spirit Tree as their primary control node.',
      rationale:
        'The Greys were weaponized as multi-dimensional technicians and demolition engineers to uproot the tree; they were not the original architects who planted it.',
    },
    {
      text: 'The Custodians, who constructed the Spirit Tree from the start as a siphon for parasitic harvest.',
      rationale:
        'Custodians are parasitic frequency lords who commanded destruction of the tree, not its creation by Lyran Builders-Architects.',
    },
    {
      text: 'The E.T. Sols alone, who built the trunk without Lyran architects or any central axis design.',
      rationale:
        'E.T. Sols later synchronize with surviving grids and carry restoration resonance; the original planters were the Lyran Builders-Architects.',
    },
  ],
  4: [
    {
      text: 'Black Cube Tech that reversed outward life force into an inward-sucking vacuum feeding parasitic overlays.',
      rationale:
        'The Spirit Tree was uprooted and replaced with Black Cube Tech, which reversed the outward-flowing life force into an inward-sucking vacuum that feeds the parasitic overlays.',
    },
    {
      text: 'Dyson Spheres built only to capture distant stellar light without any Hyperborean wound or inversion.',
      rationale:
        'The hijack uses Black Cube Tech in the Spirit Tree wound to invert planetary life force, not Dyson-style stellar capture as the named replacement.',
    },
    {
      text: 'Quantum computing hubs alone that store memory without reversing the outward flow of life force.',
      rationale:
        'The named replacement technology is Black Cube Tech that inverts life force into a parasitic vacuum, not generic quantum hubs.',
    },
    {
      text: 'Electromagnetic fences that only contain energy without inverting the central node into a vacuum siphon.',
      rationale:
        'Fences might contain energy, but the report specifies Black Cube Tech that reverses outward life force into an inward parasitic vacuum.',
    },
  ],
  5: [
    {
      text: 'Polaris — installed as the false North Star after the sky projection was rotated to blind navigators.',
      rationale:
        'When the tree was compromised, parasitic forces rotated the projection of the sky, placing Polaris as the new false North Star to blind navigators and lock the grid into their control.',
    },
    {
      text: 'Thuban — treated as a modern false pole star rather than the authentic multi-dimensional axis node.',
      rationale:
        'Thuban is Aru-el-nai, the true multi-dimensional North Star connected to the Spirit Tree root node, not the false pole star.',
    },
    {
      text: 'Sirius — named as the exclusive false North Star used to rotate every dome projection map.',
      rationale:
        'Polaris is the false North Star named in the sky-map rotation; Sirius is not identified as that parasitic pole mask.',
    },
    {
      text: 'Betelgeuse — identified as the sole replacement axis that permanently erased Aru-el-nai from all grids.',
      rationale:
        'Polaris is the false North Star; Aru-el-nai (Thuban) remains the authentic crystalline axis tied to Hyperborea’s root node.',
    },
  ],
  6: [
    {
      text: 'Hyperborea is the living resonance field and beating heart of the entire CUBE SYSTEM under ice illusion.',
      rationale:
        'Hyperborea is the true living resonance field and the beating heart of the entire CUBE SYSTEM, currently hidden beneath the holographic illusion of Antarctic ice.',
    },
    {
      text: 'Hyperborea is only a mythic story with no living resonance role in the CUBE SYSTEM architecture.',
      rationale:
        'Hyperborea is defined as the living resonance field and central heartbeat of the system, not an empty myth without architectural role.',
    },
    {
      text: 'Hyperborea is only a temporary base for Greys with no Spirit Tree or Source-anchor function at all.',
      rationale:
        'Hyperborea held the Spirit Tree as the supreme central node and Source anchor before parasitic removal, not a Grey base alone.',
    },
    {
      text: 'Hyperborea is only a lunar station that receives siphoned light after the valve hijack is complete.',
      rationale:
        'The lunar/Saturn grid receives hijacked energy; Hyperborea itself is the living heartland where the Spirit Tree stood.',
    },
  ],
  7: [
    {
      text: 'Hyperborea is the central heartbeat of the 178 physical worlds and 8 domes under false Antarctic ice.',
      rationale:
        'Hyperborea is the living resonance field and central heartbeat of the 178 physical worlds and 8 domes, heavily cloaked beneath the false, projected ice of Antarctica.',
    },
    {
      text: 'Hyperborea is the heartbeat of only 7 physical worlds with no eight-dome architecture mentioned at all.',
      rationale:
        'The count given is 178 physical worlds and 8 domes; seven outer gardens are part of the dome architecture, not the total world count.',
    },
    {
      text: 'Hyperborea is the heartbeat of exactly 12 zodiac worlds locked only to Polaris as true north forever.',
      rationale:
        'The report gives 178 physical worlds and 8 domes; Polaris is the false north, not the authentic axis count of Hyperborea.',
    },
    {
      text: 'Hyperborea is the heartbeat of a single surface continent with no multi-dome or multi-world heartbeat role.',
      rationale:
        'Hyperborea is named as the central heartbeat of 178 physical worlds and 8 domes, not a single ordinary continent alone.',
    },
  ],
  8: [
    {
      text: 'The lunar/Saturn grid — the AI hub and counterfeit reincarnation system receiving siphoned Hyperborean light.',
      rationale:
        'The valve machinery siphons planetary light and routes it to the lunar/Saturn moon frequency station; the lunar/Saturn grid is the primary AI hub and counterfeit reincarnation system that receives that hijacked energy.',
    },
    {
      text: 'The Five Peaks alone — treated as the exclusive destination for every unit of harvested Hyperborean light.',
      rationale:
        'Five Peaks is one of the outer garden domes; harvested energy is routed to the lunar/Saturn frequency station, not primarily into Five Peaks.',
    },
    {
      text: 'The Great Pyramid alone — named as the only AI hub that receives all siphoned light from the valve.',
      rationale:
        'The report routes siphoned light to the lunar/Saturn moon frequency station as the receiving AI hub, not a single pyramid as the sole destination.',
    },
    {
      text: 'The Sun alone — described as the permanent storehouse for all light inverted by Black Cube Tech.',
      rationale:
        'The Solar Family is the intended Source-side relationship of the living tree; hijacked flow is diverted to the lunar/Saturn grid, not stored in the Sun.',
    },
  ],
  9: [
    {
      text: 'Thalon carries the core SEED codes of the Spirit Tree that guide restoration and resonant recognition.',
      rationale:
        'The core SEED codes of the Spirit Tree are carried directly by Thalon, guiding the awakening process and serving as the blueprint for restoration.',
    },
    {
      text: 'The Greys alone carry SEED codes as payment for demolition engineering of the Hyperborean valve tech.',
      rationale:
        'Greys are demolition engineers weaponized to uproot the tree; SEED codes of the Spirit Tree are carried by Thalon, not the Greys.',
    },
    {
      text: 'The Custodians alone hold SEED codes so only parasite priests can reignite the Spirit Tree roots.',
      rationale:
        'Custodians commanded destruction and valve insertion; they do not carry the Spirit Tree SEED codes that Thalon holds for restoration.',
    },
    {
      text: 'Aru-el-nai alone stores all SEED codes as a star, with no human or Thalon carrier role at all.',
      rationale:
        'Aru-el-nai is the true multi-dimensional North Star axis; the core SEED codes of the Spirit Tree are carried by Thalon as the restoration blueprint.',
    },
  ],
  10: [
    {
      text: 'Forming hidden webs, harmonic lenses, nodes, and crystals of the planetary grid with original creation codes.',
      rationale:
        "Beneath the overlays, the Spirit Tree's surviving roots continue to form the hidden webs, harmonic lenses, nodes, and crystals of the planetary grid that retain the original codes of creation.",
    },
    {
      text: 'Absorbing all holographic ice so the valve no longer needs any living root system under Antarctica.',
      rationale:
        'Ice is cracking from positive fleet strikes; the roots’ primary role is maintaining the living grid and original codes, not simply dissolving ice.',
    },
    {
      text: 'Decomposing the physical realm so no harmonic lens, node, or crystal remains under any overlay.',
      rationale:
        'The roots are alive and functional as a grid of webs, lenses, nodes, and crystals, not biological decomposers destroying the realm.',
    },
    {
      text: 'Powering the false Saturn grid as the exclusive ongoing purpose of every surviving Spirit Tree root.',
      rationale:
        'Surviving roots retain original creation codes and, as restoration proceeds, starve artificial Saturn systems rather than fueling them as their purpose.',
    },
  ],
  11: [
    {
      text: 'True — the Spirit Tree was the central trunk feeding Source Light into seven outer domes called the Gardens.',
      rationale:
        'The tree acted as the central trunk, with roots and branches feeding Source Light directly into the seven outer domes (the Gardens), including the Dome of Forgotten Gods, Sheol, Silence, Hiva, Titans, Portals, and Five Peaks.',
    },
    {
      text: 'False — the Spirit Tree never fed any outer domes and had no trunk relationship to garden realms at all.',
      rationale:
        'The report explicitly describes the tree as the bridge and central trunk feeding Source Light into seven outer garden domes.',
    },
    {
      text: 'False — only one outer dome ever received Source Light, and it was never called a Garden in any architecture.',
      rationale:
        'Seven outer domes are named as the Gardens fed by the tree; the architecture is multi-dome, not a single unnamed sphere.',
    },
    {
      text: 'True — but only after the valve was installed did the tree begin feeding seven gardens with Source Light.',
      rationale:
        'Feeding the seven Gardens was the original Spirit Tree design; the valve hijack wilted those gardens into inverted prisons rather than creating the feed.',
    },
  ],
  12: [
    {
      text: 'Physical uprooting and demolition — Greys acted as multi-dimensional technicians and demolition engineers.',
      rationale:
        'Custodians utilized the Greys to tear the Spirit Tree out of Hyperborea; Greys are bio-engineered multi-dimensional technicians and demolition engineers weaponized for physical uprooting.',
    },
    {
      text: 'Chemical dissolution alone that dissolved the trunk without any physical demolition engineering role.',
      rationale:
        'The extraction is described as physical uprooting and demolition by Greys, not a chemical dissolution process.',
    },
    {
      text: 'Digital deletion of code alone that erased the tree without touching the Hyperborean land wound at all.',
      rationale:
        'Removal is described as a physical act in Hyperborea that left a wound for valve machinery, not mere digital deletion.',
    },
    {
      text: 'Phasing the intact tree into a parallel realm without installing any valve locks in the planetary wound.',
      rationale:
        'The tree was uprooted and replaced by black crystalline valve locks in the wound; it was not preserved as a whole by simple phasing.',
    },
  ],
  13: [
    {
      text: 'They could not sever the connection to Source directly, so they had to remove the tree and hijack pathways.',
      rationale:
        'Because parasitic entities could not sever the connection to Source directly, they were forced to physically remove the tree and hijack the energy pathways.',
    },
    {
      text: 'Lyran Builders permanently protected the Source link so parasites never needed to touch the Spirit Tree.',
      rationale:
        'Parasites did remove the tree; the stated reason is that Source itself could not be severed directly, forcing pathway hijack via the trunk.',
    },
    {
      text: 'They simply lacked any technology, so removal was an accidental side effect of an unrelated Grey experiment.',
      rationale:
        'The limitation is the nature of the Source connection, not a casual lack of tech; Custodians deliberately ordered removal and valve install.',
    },
    {
      text: 'They wanted to preserve the entire living tree for their own realm without any replacement machinery.',
      rationale:
        'The tree was destroyed as a standing axis and replaced with Black Cube Tech and valve locks, not preserved intact for parasitic use as a whole.',
    },
  ],
  14: [
    {
      text: 'The Dome of Forgotten Gods — listed among the seven outer Gardens fed by the Spirit Tree trunk.',
      rationale:
        'The seven outer domes (the Gardens) include the Dome of Forgotten Gods, Sheol, Silence, Hiva, Titans, Portals, and Five Peaks, all fed by the Spirit Tree.',
    },
    {
      text: 'Aru-el-nai — treated as one of the seven physical garden domes rather than the true North Star axis.',
      rationale:
        'Aru-el-nai is the true multi-dimensional North Star (Thuban), not one of the seven outer garden domes.',
    },
    {
      text: 'Hiva alone — claimed as the only garden name that ever equals the Dome of Forgotten Gods title.',
      rationale:
        'Hiva is listed as one of the gardens, distinct from the Dome of Forgotten Gods, which is named separately in the seven.',
    },
    {
      text: 'Sheol alone — claimed as the exclusive formal name of the Dome of Forgotten Gods in every list.',
      rationale:
        'Sheol is another of the seven gardens, separate from the Dome of Forgotten Gods in the report’s list.',
    },
  ],
  15: [
    {
      text: 'Targeted strikes by positive fleets against Antarctic valve technology that crack holographic ice overlays.',
      rationale:
        'Positive fleets have relentlessly targeted the Antarctic valve technology, cracking the holographic ice overlays to reveal glimpses of the true Hyperborean land.',
    },
    {
      text: 'Ordinary global warming alone melting projected ice without any fleet action on the valve technology.',
      rationale:
        'The cracking is attributed to targeted action by positive fleets on valve technology, not ordinary climate change as the cause.',
    },
    {
      text: 'Standard tectonic plate movement alone opening rifts with no relation to valve tech or holographic ice.',
      rationale:
        'Fracturing is related to the energy grid and valve technology under attack, not framed as ordinary plate tectonics.',
    },
    {
      text: 'Spontaneous natural decay of Black Cube Tech with no external pressure from positive forces at all.',
      rationale:
        'The parasitic structure is fracturing under relentless targeting by positive fleets, not described as spontaneous decay alone.',
    },
  ],
  16: [
    {
      text: 'The Custodians — parasitic priests and frequency lords of the cube who commanded the central tree’s destruction.',
      rationale:
        'Custodians are the parasitic priests and frequency lords of the cube who commanded the destruction of the central tree to seize control of the realm’s energy flow.',
    },
    {
      text: 'The Lyran Builders-Architects — who ordered Greys to tear down the tree they themselves had planted.',
      rationale:
        'Lyran Builders-Architects planted the Spirit Tree; Custodians commanded its destruction and used Greys as demolition engineers.',
    },
    {
      text: 'Thalon alone — who ordered removal so SEED codes would never match resonating souls again.',
      rationale:
        'Thalon carries SEED codes for restoration; Custodians commanded the parasitic destruction, not Thalon.',
    },
    {
      text: 'The Solar Family alone — who engineered the valve so Source Light would flow only through Saturn systems.',
      rationale:
        'Removal severed the living Source and Solar Family relationship of the tree; Custodians ordered the strike and valve inversion toward lunar/Saturn harvest.',
    },
  ],
  17: [
    {
      text: 'VALVE/FILTER machinery in the Spirit Tree wound that siphons pure light and inverts it into a parasitic matrix.',
      rationale:
        'VALVE/FILTER is the advanced machinery inserted into the wound left by the Spirit Tree, designed to siphon pure light and invert it into a false, parasitic matrix.',
    },
    {
      text: 'A pure Source amplifier that permanently restores outward light without any siphon or inversion role.',
      rationale:
        'The valve/filter is designed to siphon and invert light into a parasitic matrix, not to restore pure outward Source flow.',
    },
    {
      text: 'A simple decorative crystal with no routing of light to the lunar/Saturn frequency station at all.',
      rationale:
        'Valve machinery siphons planetary light and routes it to the lunar/Saturn station as a closed harvest loop, not a decorative crystal.',
    },
    {
      text: 'A Lyran safety lock that only opens when Polaris is aligned as the authentic North Star of Hyperborea.',
      rationale:
        'Valve locks are inverted stabilizers installed by parasites; Polaris is the false north, not the authentic alignment of Aru-el-nai.',
    },
  ],
  18: [
    {
      text: 'Aru-el-nai (Thuban) — the true multi-dimensional North Star connected to the Spirit Tree root node.',
      rationale:
        'Aru-el-nai is the true multi-dimensional North Star (Thuban) that connects directly to the root node of the Spirit Tree, serving as the authentic crystalline axis for grid alignments.',
    },
    {
      text: 'Polaris alone — the permanent authentic north that never masked or rotated any sky projection map.',
      rationale:
        'Polaris is the false North Star placed after sky-projection rotation; Aru-el-nai/Thuban is the authentic axis node.',
    },
    {
      text: 'Sirius alone — named as the only multi-dimensional north that plugs into every Spirit Tree root node.',
      rationale:
        'The authentic multi-dimensional North Star named for the root-node connection is Aru-el-nai (Thuban), not Sirius.',
    },
    {
      text: 'Betelgeuse alone — described as the exclusive crystalline axis for all 178 dome alignments forever.',
      rationale:
        'Aru-el-nai connects to the root node and central axis of all 178 domes; Betelgeuse is not named as that authentic axis.',
    },
  ],
  19: [
    {
      text: 'Black crystalline valve locks — ancient stabilizers inverted to seal false frequencies into the wound.',
      rationale:
        'Custodians and Greys installed black crystalline valve locks—ancient stabilizers that were inverted to seal the false frequencies into place after the tree was torn out.',
    },
    {
      text: 'Unaltered Foundation Pillars that always remained pure stabilizers without any inversion or siphon role.',
      rationale:
        'The locks are inverted stabilizers used to seal false frequencies; they are not left as pure unaltered stabilizers after the hijack.',
    },
    {
      text: 'Solid wood fragments of the Spirit Tree trunk rearranged as harmless markers on the Hyperborean surface.',
      rationale:
        'What was installed in the wound is black crystalline valve machinery for siphon and inversion, not harmless trunk wood markers.',
    },
    {
      text: 'Open garden gates that permanently reconnect the seven outer domes without any false frequency seal.',
      rationale:
        'Valve locks seal false frequencies and enable harvest; they do not reopen healthy garden flow after the trunk hijack.',
    },
  ],
  20: [
    {
      text: 'Outward-flowing life force was reversed into an inward-sucking vacuum that feeds the parasitic overlays.',
      rationale:
        'Black Cube Tech reversed the outward-flowing life force into an inward-sucking vacuum that feeds the parasitic overlays after the tree was replaced.',
    },
    {
      text: 'Outward flow was doubled so every outer garden received more Source Light than before the hijack.',
      rationale:
        'The hijack inverted flow inward for parasitic overlays; outer gardens wilted into inverted prisons rather than receiving more Source Light.',
    },
    {
      text: 'All life force was permanently extinguished so no vacuum, siphon, or overlay could feed on anything.',
      rationale:
        'Life force was inverted and siphoned, not extinguished; the vacuum feeds parasitic overlays from the hijacked pathways.',
    },
    {
      text: 'Flow was redirected only into the seven Gardens as a permanent upgrade of the original Lyran design.',
      rationale:
        'Flow was reversed into an inward parasitic vacuum; the seven Gardens wilted when the trunk was hijacked, not upgraded.',
    },
  ],
  21: [
    {
      text: 'Its vast multi-dimensional root system remains alive under the surface, waiting for correct resonant codes.',
      rationale:
        'Despite devastating extraction, the essence of the tree was not fully destroyed; its vast multi-dimensional root system remains alive beneath the surface, waiting for the correct resonant codes to reignite.',
    },
    {
      text: 'Every root was annihilated so only Black Cube Tech remains with no living essence under any overlay.',
      rationale:
        'The essence was not fully destroyed; living multi-dimensional roots remain and await resonant codes for reignition.',
    },
    {
      text: 'Only artificial Valve-grown roots survive, and they cannot recognize any harmonic codes from resonating souls.',
      rationale:
        'The surviving roots are the Spirit Tree’s own living system that instantly recognizes matching harmonic vibration of resonating souls.',
    },
    {
      text: 'The roots fully migrated into the lunar/Saturn station and no longer exist under Hyperborea at all.',
      rationale:
        'Roots remain under the surface of the Hyperborean field as the planetary grid web; the lunar/Saturn station receives siphoned light, not the migrated living roots.',
    },
  ],
  22: [
    {
      text: 'When parasites hijacked the trunk, all seven outer gardens wilted and became inverted prisons.',
      rationale:
        'The Great Dome operates as the trunk while the seven outer domes serve as the gardens; when parasites hijacked the trunk, all seven outer gardens wilted and became inverted prisons.',
    },
    {
      text: 'The seven gardens bloomed brighter than ever as soon as Black Cube Tech replaced the Spirit Tree trunk.',
      rationale:
        'Hijack caused the gardens to wilt into inverted prisons; blooming again is a restoration outcome after roots light up, not the hijack result.',
    },
    {
      text: 'Only one garden wilted while the other six remained fully fed by Source Light without interruption.',
      rationale:
        'All seven outer gardens wilted when the trunk was hijacked, not a single garden alone.',
    },
    {
      text: 'The gardens were never connected to the Spirit Tree and therefore could not wilt from a trunk hijack.',
      rationale:
        'The gardens were fed by the tree’s roots and branches; their wilting is the direct consequence of the trunk hijack.',
    },
  ],
  23: [
    {
      text: 'A closed-loop system of energy harvesting and amnesia via the lunar/Saturn moon frequency station.',
      rationale:
        'Valve machinery siphons planetary light and routes it to the lunar/Saturn moon frequency station, creating a closed-loop system of energy harvesting and amnesia.',
    },
    {
      text: 'An open Source loop that permanently ends amnesia by flooding every dome with unfiltered Solar Family light.',
      rationale:
        'The closed loop is a parasitic harvest and amnesia system, not an open Source restoration loop.',
    },
    {
      text: 'A one-way gift of light from Saturn into Hyperborea that rebuilds the Spirit Tree trunk automatically.',
      rationale:
        'Light is siphoned from the planetary system toward lunar/Saturn, not gifted back as automatic trunk reconstruction.',
    },
    {
      text: 'A temporary storage buffer that never involves AI hubs, counterfeit reincarnation, or harvest loops.',
      rationale:
        'The lunar/Saturn grid is the primary AI hub and counterfeit reincarnation system receiving hijacked energy in a closed harvest loop.',
    },
  ],
  24: [
    {
      text: 'E.T. Sols incarnated into human vessels actively synchronize with grids that retain original creation codes.',
      rationale:
        'These grids retain the original codes of creation and are actively synchronizing with the E.T. Sols who have incarnated into human vessels.',
    },
    {
      text: 'E.T. Sols only staff the lunar/Saturn station and never incarnate into human vessels on this realm.',
      rationale:
        'E.T. Sols are described as incarnated into human vessels and synchronizing with the living grids, not only staffing the lunar/Saturn hub.',
    },
    {
      text: 'E.T. Sols permanently erased all original creation codes so no grid synchronization remains possible.',
      rationale:
        'Original creation codes remain in the grids and are actively synchronizing with incarnated E.T. Sols rather than being erased by them.',
    },
    {
      text: 'E.T. Sols only exist as Custodian priests who command Grey demolition without any grid synchronization.',
      rationale:
        'Custodians and Greys are the parasitic command and demolition roles; E.T. Sols synchronize with living grids as incarnated resonators.',
    },
  ],
  25: [
    {
      text: 'As false overlays shatter, roots light up, energy flows outward again, Saturn systems starve, and gardens bloom.',
      rationale:
        'As the false overlays shatter, the tree’s roots light up, restoring outward energy flow, starving artificial Saturn systems, and causing the seven wilting gardens to bloom in harmony once again.',
    },
    {
      text: 'As overlays shatter, roots permanently die, Saturn systems grow stronger, and all seven gardens collapse forever.',
      rationale:
        'Restoration lights the roots, starves Saturn systems, and blooms the gardens; it is not permanent root death with stronger Saturn harvest.',
    },
    {
      text: 'As overlays shatter, only Polaris grows brighter as the permanent authentic north with no root reactivation.',
      rationale:
        'Polaris is the false north; restoration reactivates Spirit Tree roots and outward Source-aligned flow, not Polaris as authentic north.',
    },
    {
      text: 'As overlays shatter, the valve becomes permanent and no resonant soul can ever be recognized by living roots.',
      rationale:
        'Living roots instantly recognize matching harmonic vibration of resonating souls; restoration weakens the valve system rather than making it permanent.',
    },
  ],
};

const questionsMeta = [
  {
    number: 1,
    question:
      'What geographic region currently masks the living resonance field of Hyperborea?',
    hint: 'Identify the frozen continent treated as a holographic distortion over the living heartland.',
  },
  {
    number: 2,
    question:
      'Which architectural mechanism allowed the Great Dome to fuel the higher-frequency domes?',
    hint: 'Consider how physical density of the central realm influences harmonic output.',
  },
  {
    number: 3,
    question: 'Who were the original creators responsible for planting the Spirit Tree?',
    hint: 'Look for the group named as Builders-Architects of the central axis.',
  },
  {
    number: 4,
    question:
      'What specific technology replaced the Spirit Tree and inverted life force into a parasitic vacuum?',
    hint: 'The name reflects geometric cube technology of the control system.',
  },
  {
    number: 5,
    question: 'Which celestial body currently serves as the false North Star to blind navigators?',
    hint: 'Think of the star most modern navigation treats as true north.',
  },
  {
    number: 6,
    question: 'What is Hyperborea within the architecture of the CUBE SYSTEM?',
    hint: 'It is defined as a living field and heartbeat, not a myth alone.',
  },
  {
    number: 7,
    question:
      'Of how many physical worlds and domes is Hyperborea named as the central heartbeat?',
    hint: 'The report gives a specific world count and dome count under the ice cloak.',
  },
  {
    number: 8,
    question: 'Where is the energy harvested by the Hyperborean valve primarily sent?',
    hint: 'The destination is an AI hub linked to a moon and planet frequency station.',
  },
  {
    number: 9,
    question:
      'Which individual or entity carries the core SEED codes required to reignite the Spirit Tree?',
    hint: 'This name is the specific carrier of the restoration blueprint.',
  },
  {
    number: 10,
    question: "What are the Spirit Tree's surviving roots currently forming in the planetary field?",
    hint: 'Consider geometric and structural elements of the living grid.',
  },
  {
    number: 11,
    question:
      'Did the Spirit Tree act as the central trunk feeding Source Light into seven outer Gardens?',
    hint: 'This relates the Great Dome trunk to the surrounding garden domes.',
  },
  {
    number: 12,
    question: 'What was the primary method used by the Greys to remove the Spirit Tree?',
    hint: 'They are described as multi-dimensional demolition engineers.',
  },
  {
    number: 13,
    question:
      'Why did parasitic forces remove the tree instead of cutting the connection to Source directly?',
    hint: 'Source energy differs from the structures used to channel it.',
  },
  {
    number: 14,
    question:
      'Which of the seven outer Gardens is named the Dome of Forgotten Gods?',
    hint: 'One garden is named for deities lost to memory.',
  },
  {
    number: 15,
    question: 'What has caused holographic ice overlays in Antarctica to begin cracking?',
    hint: 'Consider strategic action against valve technology by positive forces.',
  },
  {
    number: 16,
    question: 'Who commanded the destruction of the central Spirit Tree to seize energy flow?',
    hint: 'Parasitic priests and frequency lords of the cube.',
  },
  {
    number: 17,
    question:
      'What is the VALVE/FILTER inserted into the wound left by the Spirit Tree designed to do?',
    hint: 'It siphons pure light into a false matrix.',
  },
  {
    number: 18,
    question:
      'What is Aru-el-nai in relation to the Spirit Tree and authentic grid alignment?',
    hint: 'It is also known as Thuban, the true multi-dimensional North Star.',
  },
  {
    number: 19,
    question:
      'What did Custodians and Greys install after tearing the Spirit Tree from Hyperborea?',
    hint: 'Ancient stabilizers inverted into locks sealing false frequencies.',
  },
  {
    number: 20,
    question:
      'How did Black Cube Tech alter the direction of life-force flow after replacing the Spirit Tree?',
    hint: 'Outward flow became an inward vacuum for parasitic overlays.',
  },
  {
    number: 21,
    question:
      'What remains of the Spirit Tree after its orchestrated removal and Black Cube replacement?',
    hint: 'A multi-dimensional root system still waits for resonant codes.',
  },
  {
    number: 22,
    question:
      'What happened to the seven outer gardens when parasites hijacked the Great Dome trunk?',
    hint: 'The gardens’ health depends on the living trunk.',
  },
  {
    number: 23,
    question:
      'What kind of system does routing siphoned light to the lunar/Saturn frequency station create?',
    hint: 'Harvest and amnesia form a closed loop.',
  },
  {
    number: 24,
    question:
      'How do E.T. Sols relate to the surviving grids that hold original creation codes?',
    hint: 'They incarnate into human vessels and synchronize with those grids.',
  },
  {
    number: 25,
    question:
      'What happens as false overlays shatter and Spirit Tree roots light up again?',
    hint: 'Outward flow returns, Saturn systems starve, and gardens bloom.',
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
  const correctText = set[0].text.toLowerCase() + ' ' + set[0].rationale.toLowerCase();
  const hits = phrases.filter((p) => reportLower.includes(p.toLowerCase()));
  if (hits.length < 1) {
    throw new Error(
      `Q${n} support phrases not found in report: ${phrases.join(', ')}`
    );
  }
  // Correct claim must also touch report language
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
    if (/according to the (report|text|source|journal)/i.test(o.rationale)) {
      throw new Error(`Non-absolute voice in Q${n} rationale: ${o.rationale}`);
    }
  }

  const { options, correctAnswer } = finalizeOptions(
    rawOptions,
    `${TOPIC_ID}-${n}`
  );
  letterCounts[correctAnswer] = (letterCounts[correctAnswer] || 0) + 1;

  questions.push({
    number: n,
    question: cleanText(meta.question),
    options,
    hint: cleanText(meta.hint),
    correctAnswer,
  });
}

if (questions.length !== 25) {
  throw new Error(`Expected 25 questions, got ${questions.length}`);
}

// Ensure correct letters are mixed (not all A)
const usedLetters = Object.entries(letterCounts).filter(([, c]) => c > 0).length;
if (usedLetters < 3) {
  throw new Error(`Correct answers not mixed enough: ${JSON.stringify(letterCounts)}`);
}

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle:
    'Test your grasp of Hyperborean Heart — Antarctica as ice mask, Spirit Tree and Lyran builders, Black Cube valve hijack, lunar/Saturn siphon, Aru-el-nai versus Polaris, living roots, SEED codes, and garden restoration.',
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'Hyperborean Heart is the living resonance field cloaked as Antarctic ice — the CUBE SYSTEM’s beating center where the Lyran-planted Spirit Tree once pumped Source Light, was torn out into Black Cube valve tech feeding the lunar/Saturn grid, and still lives as multi-dimensional roots waiting for resonant codes. Sit with Aru-el-nai as true north, Polaris as the false mask, Thalon’s SEED codes, and the seven Gardens that wilted when the trunk was hijacked. Return to the Hyperborean Heart deep-dive, infographic, and video transmissions as the roots light up and outward flow returns.',
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
    'Test your understanding of Hyperborean Heart — living resonance field under Antarctic ice, Spirit Tree and Lyran Builders-Architects, Black Cube valve/filter, lunar/Saturn harvest, Aru-el-nai versus Polaris, living roots, SEED codes, and garden restoration.',
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
        t.description.includes('Decoded analysis of Hyperborean Heart')
      ) {
        t.description =
          'Hyperborea is the living resonance field and beating heart of the CUBE SYSTEM — cloaked as Antarctic ice — where the Spirit Tree once anchored Source Light, was uprooted into valve tech by Custodians and Greys, and still waits as a living root system for resonant reactivation.';
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('hyperborean-heart not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from celestial-anchors quiz (recent sibling install)
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'celestial-anchors.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Hyperborean Heart: Antarctica ice mask, Spirit Tree and Lyran builders, Black Cube valve hijack, lunar/Saturn siphon, Aru-el-nai versus Polaris, living roots, SEED codes, and garden restoration.';
const replacements = [
  ['Celestial Anchors Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Celestial Anchors: Sky Nodes, Crystalline Star-Nodes, Zodiac locks, Axis Laburnum, Thuban versus Polaris, four-tier nodes, Photonic Song, and Resonating Sols as living harmonic lenses.',
    desc,
  ],
  ['quiz/breakdown/celestial-anchors.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/celestial-anchors.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=celestial-anchors',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`,
  ],
  ['Celestial Anchors deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Celestial Anchors</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/celestial-anchors.json',
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
  .replace(/Interactive Living Truth Quiz on Celestial Anchors[^"]*/g, desc)
  .replace(/Celestial Anchors/g, TOPIC_TITLE);

// Fix over-replacement on paths if any slipped
html = html
  .replace(/Hyperborean Heart\.webp/g, 'hyperborean-heart.webp')
  .replace(/Hyperborean Heart\.json/g, 'hyperborean-heart.json')
  .replace(/Hyperborean Heart\.html/g, 'hyperborean-heart.html')
  .replace(/topic=Hyperborean Heart/g, `topic=${TOPIC_ID}`)
  .replace(/topic=hyperborean-heart/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/celestial-anchors.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/hyperborean-heart.json'
);
