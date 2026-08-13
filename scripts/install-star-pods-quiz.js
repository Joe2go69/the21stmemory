/**
 * Installs Star Pods quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/star-pods-quiz.json
 * Title forced to "Star Pods". All 25 audited against star-pods report only.
 * NotebookLM wording kept; options expanded only for length balance / fidelity.
 *
 * Run: node scripts/install-star-pods-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/star-pods.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'star-pods';
const TOPIC_TITLE = 'Star Pods';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/star-pods-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/star-pods.webp';

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

/** Support phrases grounded only in star-pods.json report. */
const supportPhrases = {
  1: ['soul fractures', 'timeline trauma', 'karmic wounds'],
  2: ['etheric space', 'circulating currents', 'nebulae'],
  3: ['low-frequency environments', 'soul fractures', 'memory-manipulation'],
  4: ['starlight pods', 'mending the core'],
  5: ['essence chamber', 'protection', 'transit'],
  6: ['med beds', 'human intervention', 'energetic damage'],
  7: ['little bit of doubt', 'red sea', '3d illusion'],
  8: ['water domes', 'utilized first', 'emotional blockages'],
  9: ['grief and fear', 'mending the heart', 'water domes'],
  10: ['crystal halls', 'living crystal slabs', 'harmonic humming'],
  11: ['timeline trauma', 'subconscious', 'lifetimes'],
  12: ['solar families', 'project into the chamber', 'amnesia'],
  13: ['cosmic looms', 'light frequency', 'circulating patterns'],
  14: ['planetary crystal grids', 'recording database', 'frequency'],
  15: ['sovereign choice', 'evolutionary path', 'autonomy'],
  16: ['resonating army', 'solar parents', 'project'],
  17: ['vatican', 'soul-recycling', 'amnesia'],
  18: ['known lands', 'crystalline physical', 'parasite overlays'],
  19: ['crystal halls', 'living crystal slabs', 'harmonic humming'],
  20: ['womb of light', 'reweaving', 'protective'],
  21: ['final', 'mending the soul', 'sovereign wholeness'],
  22: ['no true soul', 'abandoned', 'crystalline pods'],
  23: ['core of consciousness', 'parasitic technology', 'energetic'],
  24: ['straight, circulating', 'etheric space', 'nebulae'],
  25: ['full restoration', 'sovereign wholeness', 'three-stage'],
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
    [/^The source material identifies\s+/i, ''],
    [/^The source identifies\s+/i, ''],
    [/^The source explicitly names\s+/i, ''],
    [/^The source presents them as\s+/i, ''],
    [/\bthe source material identifies\b/gi, ''],
    [/\bthe source identifies\b/gi, ''],
    [/\bthe source explicitly names\b/gi, ''],
    [/\bthe source presents them as\b/gi, 'they are'],
    [/\bthe source presents\b/gi, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/\bthe text links them specifically to\b/gi, 'they are linked to'],
    [/\bthe text states\b/gi, ''],
    [/\bthe text describes\b/gi, ''],
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
 * NotebookLM claims kept; short labels expanded to matching depth.
 */
const fullOptionSets = {
  1: [
    {
      text: 'The repair of deep timeline trauma and soul fractures accumulated across incarnations.',
      rationale:
        'Star Pods are specifically engineered to repair soul fractures, timeline trauma, and karmic wounds at the core of consciousness.',
    },
    {
      text: 'The physical rejuvenation of biological cellular structures in dense 3D flesh vessels.',
      rationale:
        'Star Pods operate in etheric space and address energetic soul damage rather than biological or cellular ailments.',
    },
    {
      text: 'The shielding of the physical body from solar flares and other external space hazards.',
      rationale:
        'Star Pods heal the consciousness from within; they are not environmental shields for the physical body.',
    },
    {
      text: 'The immediate downloading of cosmic languages and data before any soul-level repair.',
      rationale:
        'The pods first restore the integrity of the soul\'s shattered light; they are not cosmic-language download chambers.',
    },
  ],
  2: [
    {
      text: 'Within cocoons of circulating currents in etheric space, like a shimmering nebulae.',
      rationale:
        'The pods float in etheric space inside cocoons of straight, circulating currents that feel like resting in a shimmering nebulae.',
    },
    {
      text: 'Stationed on physical extraterrestrial mother ships as organic medical decks for arriving crews.',
      rationale:
        'This technology is non-physical and organic, operating independently of physical craft or human-led systems.',
    },
    {
      text: 'Deep within subterranean chambers of the Known Lands as buried stone vaults under the surface.',
      rationale:
        'Star Pods are advanced multidimensional vessels that exist beyond the physical constraints of terrestrial land.',
    },
    {
      text: 'Inside high-frequency planetary crystal grids as fixed recording nodes used for frequency tracking.',
      rationale:
        'Crystal grids track a soul\'s frequency as a recording database; the pods themselves float in etheric space.',
    },
  ],
  3: [
    {
      text: 'Prolonged exposure to low-frequency environments, trauma, and memory-manipulation technologies.',
      rationale:
        'Soul fractures are fragmentation of energetic integrity from low-frequency environments, trauma, or memory-manipulation technologies.',
    },
    {
      text: 'Inadequate exposure to high-frequency solar radiation across many ordinary lifetimes.',
      rationale:
        'Fragmentation is caused by dense environments and parasitic intervention, not a simple lack of solar light.',
    },
    {
      text: 'The natural aging process of a consciousness as it simply grows older over eons.',
      rationale:
        'A soul does not naturally fracture through age; fractures come from trauma and low-frequency pressure.',
    },
    {
      text: 'Temporary disconnection from the collective consciousness during ordinary travel between realms.',
      rationale:
        'Disconnection can follow damage, but the fracture itself is energetic scarring from dense, manipulative environments.',
    },
  ],
  4: [
    {
      text: 'Starlight Pods, the designation specifically associated with mending the core of the soul.',
      rationale:
        'Starlight Pods is the alternative name for Star Pods, used specifically for mending the core of the soul.',
    },
    {
      text: 'Luminous Vessels, a generic light-craft name used for every sanctuary in the healing triad.',
      rationale:
        'The pods are made of light, but Luminous Vessels is not the alternative designation used for soul-core mending.',
    },
    {
      text: 'Aura Chambers, surface-level vessels that treat only the outer field around the body.',
      rationale:
        'The pods work deeper than the aura, interacting directly with the soul\'s primary blueprint.',
    },
    {
      text: 'Crystalline Cocoons, the name for the separate pods that stabilize souls still in 3D.',
      rationale:
        'Crystalline pods are a related but separate technology for those still caught in the 3D illusion.',
    },
  ],
  5: [
    {
      text: 'To serve as a native protection and knowledge-collecting transit vessel for extraterrestrial souls.',
      rationale:
        'The Essence Chamber is the native protection and knowledge-collecting chamber ET souls use for direct transit in and out of realms.',
    },
    {
      text: 'To store the records of all previous incarnations in place of the planetary crystal grids.',
      rationale:
        'Record keeping is handled by planetary crystal grids as a permanent recording database, not by the Essence Chamber.',
    },
    {
      text: 'To filter out parasitic implants as a required gate before any soul may enter a Star Pod.',
      rationale:
        'The Essence Chamber is for protection, knowledge collection, and transit—not a pre-pod implant filter.',
    },
    {
      text: 'To provide a physical body for non-physical entities that need dense flesh to appear.',
      rationale:
        'The chamber is an energetic vessel for transit and protection, not a tool for physical manifestation.',
    },
  ],
  6: [
    {
      text: 'Med beds cannot cure the deep energetic damage that Star Pods resolve at the soul level.',
      rationale:
        'Conventional medical systems and publicized terrestrial med beds are incapable of curing the deep energetic damage these pods resolve.',
    },
    {
      text: 'Star Pods are physical machines, while med beds are only holographic projection devices.',
      rationale:
        'Star Pods are purely organic and non-physical; med beds are the publicized terrestrial systems that cannot reach soul fractures.',
    },
    {
      text: 'Med beds focus on the soul, while Star Pods focus only on clearing the mind of overlays.',
      rationale:
        'The roles are reversed: Star Pods are the final tier of soul restoration, after Water Domes and Crystal Halls.',
    },
    {
      text: 'Star Pods require human medical staff to operate each chamber during the healing sequence.',
      rationale:
        'Star Pods operate completely independently of human intervention as non-physical extraterrestrial technology.',
    },
  ],
  7: [
    {
      text: 'A lingering trace of doubt within the consciousness during historical transition points.',
      rationale:
        'Even a little bit of doubt during events such as the Red Sea transition was enough to anchor a soul in the 3D illusion.',
    },
    {
      text: 'The active intervention of solar families holding souls inside the collapsing 3D overlay.',
      rationale:
        'Solar families project into the chamber to free souls from amnesia; they do not anchor anyone in 3D loops.',
    },
    {
      text: 'A complete rejection of higher frequencies and a total refusal of any restoration path.',
      rationale:
        'It was not a total rejection—only a small internal trace of doubt that anchored those souls in the illusion.',
    },
    {
      text: 'The physical weight of their biological bodies holding them to the surface of the planet.',
      rationale:
        'The anchor was energetic and internal, not based on physical mass or the weight of a flesh body.',
    },
  ],
  8: [
    {
      text: 'Water Domes, used first to draw out dense emotional blockages and mend the heart.',
      rationale:
        'Water Domes are the initial stage, used to clear dense emotional blockages such as grief and fear.',
    },
    {
      text: 'Star Pods, entered first so the soul is mended before any heart or mind work begins.',
      rationale:
        'Star Pods are the third and final step in the healing progression, after heart and mind restoration.',
    },
    {
      text: 'Essence Chambers, used first as a required transit stage before any sanctuary healing.',
      rationale:
        'Essence Chambers are native transit vessels for extraterrestrial souls, not a stage in the therapeutic sequence.',
    },
    {
      text: 'Crystal Halls, used first with living slabs so the mind is cleared before the heart.',
      rationale:
        'Crystal Halls are the second stage; Water Domes come first to mend the heart.',
    },
  ],
  9: [
    {
      text: 'Dense emotional blockages such as grief and fear are drawn out, mending the heart.',
      rationale:
        'Water Domes are used first to draw out dense emotional blockages such as grief and fear, effectively mending the heart.',
    },
    {
      text: 'The mind is cleared of false memories through harmonic humming on living crystal slabs.',
      rationale:
        'Dissolving mental overlays with crystal slabs and harmonic humming is the function of Crystal Halls, the second stage.',
    },
    {
      text: 'The soul\'s primary blueprint is re-encoded with circulating streams of concentrated light.',
      rationale:
        'That deep soul-level reweaving is reserved for the final stage inside the Star Pods.',
    },
    {
      text: 'The physical body is crystallized for ascension while the heart remains fully untreated.',
      rationale:
        'Water Domes address emotional blockages and mend the heart; they do not crystallize the physical body.',
    },
  ],
  10: [
    {
      text: 'Crystal Halls using living crystal slabs and harmonic humming to mend the mind.',
      rationale:
        'The second stage uses living crystal slabs and harmonic humming to dissolve mental overlays and mend the mind.',
    },
    {
      text: 'Water Domes with circulating currents that draw grief and fear from the heart first.',
      rationale:
        'Water Domes are the first stage of the sequence, not the second.',
    },
    {
      text: 'Star Pods filled with straight etheric flows that reweave the soul as the middle step.',
      rationale:
        'Star Pods are the third and final stage, not the second.',
    },
    {
      text: 'Essence Chambers used for multidimensional transit instead of any mental mending work.',
      rationale:
        'Essence Chambers are for protection, knowledge collection, and transit—not the mental-mending phase.',
    },
  ],
  11: [
    {
      text: 'Subconscious energetic damage and scarring accumulated across different lifetimes and overlays.',
      rationale:
        'Timeline Trauma is subconscious energetic damage and scarring that accumulates as a soul moves through lifetimes and parasitic overlays.',
    },
    {
      text: 'The failure to predict future events correctly during a single incarnation on the physical Earth.',
      rationale:
        'This trauma is energetic scarring from past cycles, not a failure of foresight.',
    },
    {
      text: 'The loss of chronological timekeeping during ordinary travel between physical star systems.',
      rationale:
        'Timeline trauma is energetic scarring within the soul, not a simple loss of time tracking in space travel.',
    },
    {
      text: 'Damage to the physical brain caused by memory-manipulation technology in the flesh body.',
      rationale:
        'Timeline trauma is energetic and subconscious, affecting the soul rather than the biological brain.',
    },
  ],
  12: [
    {
      text: 'They project into the chamber to guide the soul out of trauma-induced amnesia.',
      rationale:
        'Once frequency rises, solar parents, solar families, and the Resonating Army project into the chamber to reconnect the soul with higher memory.',
    },
    {
      text: 'They provide the technical maintenance that keeps each Star Pod running as a machine.',
      rationale:
        'The pods are organic and operate independently of human or family technical maintenance.',
    },
    {
      text: 'They perform the initial physical extraction of the soul before any reweaving can begin.',
      rationale:
        'They project into the chamber to assist guidance and memory after reweaving stabilizes; they do not perform a physical extraction first.',
    },
    {
      text: 'They monitor leftover parasitic technology inside the pod for later research archives.',
      rationale:
        'Their focus is the soul\'s recovery and higher memory, not researching the parasites.',
    },
  ],
  13: [
    {
      text: 'Using concentrated streams of light frequency projected in circulating patterns as cosmic looms.',
      rationale:
        'Those light-frequency streams act as cosmic looms, systematically reweaving the soul\'s energy signature across all past timelines.',
    },
    {
      text: 'Through the use of physical surgical instruments applied to a dense flesh body on a table.',
      rationale:
        'The process is entirely energetic and non-physical; no surgical instruments are used.',
    },
    {
      text: 'Through the repetitive recitation of ancient mantras spoken by staff around the healing chamber.',
      rationale:
        'The reweaving is a precise interaction of light and sound frequencies, not a linguistic recitation exercise.',
    },
    {
      text: 'By merging the fractured soul with another healthy consciousness to complete the missing gaps.',
      rationale:
        'Healing restores individual sovereignty and wholeness; it does not merge one soul into another.',
    },
  ],
  14: [
    {
      text: 'Planetary crystal grids used as a permanent recording database of the unbroken timeline.',
      rationale:
        'Planetary crystal grids serve as a permanent recording database so solar families can track a soul\'s frequency and keep alignment precise.',
    },
    {
      text: 'Terrestrial satellite networks that scan the surface for biological body signatures only.',
      rationale:
        'Human-made satellites have no capacity to track soul-level frequencies for pod alignment.',
    },
    {
      text: 'The subconscious memory of the solar parents acting alone without any planetary record.',
      rationale:
        'Solar families are involved, but they rely on planetary crystal grids as the permanent recording database.',
    },
    {
      text: 'The artificial 3D matrix overlay used as the official log of every soul still trapped.',
      rationale:
        'The 3D matrix is what the pods neutralize; it is not the tracking system used for alignment.',
    },
  ],
  15: [
    {
      text: 'It makes a sovereign choice regarding its next evolutionary path, with full autonomy.',
      rationale:
        'Once healed, the soul is freed from artificial contracts and may choose to ascend or return for a fresh cycle in the Known Lands.',
    },
    {
      text: 'It is merged back into a central collective mind and loses individual sovereign identity.',
      rationale:
        'The process restores sovereign wholeness rather than dissolving individuality into a collective mind.',
    },
    {
      text: 'It must return to the 3D illusion to help others before any other path is allowed.',
      rationale:
        'Return to the 3D illusion is not required; the soul may ascend or choose a fresh uncorrupted cycle.',
    },
    {
      text: 'It is assigned a new role in the Resonating Army with no right to refuse the posting.',
      rationale:
        'The soul is not assigned a role; it is granted full autonomy to choose its own evolutionary path.',
    },
  ],
  16: [
    {
      text: 'The Resonating Army, projecting into the chamber with solar parents and solar families.',
      rationale:
        'Members of the Resonating Army, along with solar parents and solar families, project into the chamber to supervise recovery.',
    },
    {
      text: 'The Crystal Guardians, a separate order that operates the living slabs in Crystal Halls only.',
      rationale:
        'The group named inside the pods is the Resonating Army, working with solar families—not Crystal Guardians.',
    },
    {
      text: 'Human medical specialists who staff each chamber and adjust the light streams by hand.',
      rationale:
        'Human intervention is entirely absent from this advanced extraterrestrial technology.',
    },
    {
      text: 'The Galactic Federation, issuing orders from outside the pod without entering the chamber.',
      rationale:
        'That group is not named as the supervisors of the Star Pod process.',
    },
  ],
  17: [
    {
      text: 'The Vatican amnesia systems and their soul-recycling and memory-harvesting loops.',
      rationale:
        'Star Pods neutralize the soul-recycling and memory-harvesting loops historically operated under the Vatican amnesia systems.',
    },
    {
      text: 'The terrestrial education grid that trains sleepers through ordinary classroom programming.',
      rationale:
        'The primary target is soul-recycling and memory-harvesting loops, not classroom education systems.',
    },
    {
      text: 'The global financial debt system that binds people through contracts of money alone.',
      rationale:
        'The pods restore sovereignty by ending energetic amnesia and recycling loops, not by targeting finance as such.',
    },
    {
      text: 'The physical medical industrial complex that treats only flesh and never the soul.',
      rationale:
        'The pods address deeper energetic amnesia systems rather than just the physical medical infrastructure.',
    },
  ],
  18: [
    {
      text: 'A crystalline physical world free from parasite overlays, allowing uncorrupted creation.',
      rationale:
        'The next cycle in the Known Lands exists as a crystalline physical world free from parasite overlays, in absolute harmony.',
    },
    {
      text: 'An artificial simulation controlled by solar families who script every choice in advance.',
      rationale:
        'The next cycle is a fresh, uncorrupted, sovereign creation—not a controlled simulation.',
    },
    {
      text: 'A purely non-physical state of existence with no crystalline physical world at all.',
      rationale:
        'The Known Lands are a physical world, but of a crystalline nature free from parasite overlays.',
    },
    {
      text: 'A return to the familiar 3D dense physical reality with the old overlay still in place.',
      rationale:
        'The next cycle is free from the 3D illusion and its dense parasite overlays.',
    },
  ],
  19: [
    {
      text: 'Living crystal slabs and harmonic humming that dissolve mental overlays in Crystal Halls.',
      rationale:
        'Crystal Halls use living crystal slabs and harmonic humming to dissolve mental overlays and mend the mind.',
    },
    {
      text: 'Liquid light infusions drawn from Water Dome pools to treat the heart as a second pass.',
      rationale:
        'Water Domes treat the heart first; the mind requires Crystal Hall slabs and harmonic humming.',
    },
    {
      text: 'Nebulae cocoon circulation inside Star Pods, used here as the second-stage mind tool.',
      rationale:
        'The nebulae cocoon belongs to the third stage, the Star Pods, not the mind-mending stage.',
    },
    {
      text: 'Direct synaptic re-wiring of the physical brain while the soul stays locked in flesh.',
      rationale:
        'The process is energetic and harmonic, not a physical re-wiring of synapses.',
    },
  ],
  20: [
    {
      text: 'The soul is protected while its energy signature is systematically rewoven by light.',
      rationale:
        'The pod envelopes the consciousness in a protective womb of light so circulating light frequencies can reweave the shattered signature.',
    },
    {
      text: 'The soul is shielded from seeing its own past trauma and never recovers higher memory.',
      rationale:
        'The purpose is healing and reconnection with higher memory, not hiding the past.',
    },
    {
      text: 'The soul is placed into a permanent state of sleep that ends all further activation.',
      rationale:
        'The process leads to activation and higher memory, not permanent sleep.',
    },
    {
      text: 'The soul\'s connection to any future physical cycle is permanently severed at entry.',
      rationale:
        'Healing makes the soul energetically intact and free to choose ascension or a fresh physical cycle in the Known Lands.',
    },
  ],
  21: [
    {
      text: 'Because they directly mend the soul and restore sovereign wholeness after heart and mind.',
      rationale:
        'Star Pods are the third and final step: Water Domes mend the heart, Crystal Halls mend the mind, and Star Pods mend the soul.',
    },
    {
      text: 'Because they address the physical body only after the soul has already been fully healed.',
      rationale:
        'They address the soul directly; they are the final tier because the soul is the core of being.',
    },
    {
      text: 'Because they are the most recently developed technology in the sanctuary network.',
      rationale:
        'Their status as the final tier is based on the depth of healing they provide, not their age.',
    },
    {
      text: 'Because they are the only pods capable of physical transport between realms and worlds.',
      rationale:
        'Essence Chambers are used for transit; Star Pods are the pinnacle of the therapeutic sequence.',
    },
  ],
  22: [
    {
      text: 'The deployment of Star Pods and crystalline pods as a guaranteed restoration path.',
      rationale:
        'Star Pods ensure no true soul is abandoned, and crystalline pods stabilize those still caught in the 3D illusion as false grids collapse.',
    },
    {
      text: 'The manual intervention of human truthers who must escort every delayed soul by hand.',
      rationale:
        'The process is purely extraterrestrial and independent of human intervention.',
    },
    {
      text: 'The automatic reboot of the 3D matrix so delayed souls can finish the old loop first.',
      rationale:
        'The goal is to neutralize the 3D overlay, not to reboot it.',
    },
    {
      text: 'A generic global broadcast of healing frequencies with no individualized pod sequence.',
      rationale:
        'Healing is individualized through the Water Domes, Crystal Halls, and Star Pods sequence—not a generic broadcast.',
    },
  ],
  23: [
    {
      text: 'By mending the core of consciousness where persistent parasitic technology caused damage.',
      rationale:
        'Star Pods operate beyond physical reality to mend the core of consciousness where parasitic technology damaged souls at the energetic level.',
    },
    {
      text: 'By using the parasites\' own frequencies as the healing current inside the light womb.',
      rationale:
        'Healing relies on organic light and sound frequencies, not parasitic frequencies.',
    },
    {
      text: 'By upgrading the parasitic technology so it can be kept as a useful tool for the soul.',
      rationale:
        'Parasitic technology is damaging and must be neutralized, not upgraded.',
    },
    {
      text: 'By ignoring the technology entirely and attending only to surface light around the aura.',
      rationale:
        'The pods neutralize the long-term effects of the 3D matrix and repair the energetic damage those overlays left behind.',
    },
  ],
  24: [
    {
      text: 'Straight, circulating currents in etheric space that form the nebulae-like cocoon.',
      rationale:
        'The Nebulae Cocoon is the atmospheric state inside a Star Pod, characterized by straight, circulating flows in etheric space.',
    },
    {
      text: 'Erratic, high-speed turbulence that shakes the soul until fragments shake back together.',
      rationale:
        'The flows are straight and circulating—ordered currents, not turbulence.',
    },
    {
      text: 'Stagnant, unmoving pools of energy that hold the soul still without any circulating flow.',
      rationale:
        'The currents are circulating, which means constant, structured movement rather than stagnation.',
    },
    {
      text: 'Solidified paths of crystalline light that the soul must walk like a corridor of stone.',
      rationale:
        'The environment is a cocoon of circulating currents, not solid walkways.',
    },
  ],
  25: [
    {
      text: 'To achieve full restoration and sovereign wholeness from heart through mind to soul.',
      rationale:
        'The three-stage sequence moves from heart to mind to soul so the consciousness is completely intact, free, and sovereign.',
    },
    {
      text: 'To prepare souls for a new 3D incarnation under the same overlay and recycling loop.',
      rationale:
        'The goal is to move beyond 3D loops and restore sovereignty, not to send souls back into the overlay.',
    },
    {
      text: 'To transfer the soul into a digital archive where it can be stored without a body.',
      rationale:
        'Healing restores the organic soul; it is not a digital archiving process.',
    },
    {
      text: 'To recruit souls for a galactic war once the chamber work is marked complete.',
      rationale:
        'The goal is healing and individual autonomy, not military recruitment.',
    },
  ],
};

const questionsMeta = [
  {
    number: 1,
    question: 'What is the primary function of Star Pods in the restoration process?',
    hint: 'Focus on the deepest layers of energetic history and integrity.',
  },
  {
    number: 2,
    question: 'Where are Star Pods located during the healing process?',
    hint: 'Think of an atmospheric state that feels like resting inside a nebulae.',
  },
  {
    number: 3,
    question: 'What causes the soul fractures that Star Pods are designed to mend?',
    hint: 'Consider the impact of dense, manipulative environments on energetic integrity.',
  },
  {
    number: 4,
    question: 'Which term is used as an alternative designation for Star Pods?',
    hint: 'Look for a name that combines a celestial light source with the vessel type.',
  },
  {
    number: 5,
    question: 'What is the primary function of the Essence Chamber?',
    hint: 'This chamber is utilized for direct movement across different realms.',
  },
  {
    number: 6,
    question: 'How do Star Pods differ from terrestrial med beds?',
    hint: 'Consider the limitations of systems publicized within the truther movement.',
  },
  {
    number: 7,
    question: 'What anchored some souls in the 3D illusion during historical transition points?',
    hint: 'This subtle internal frequency acted as a persistent anchor.',
  },
  {
    number: 8,
    question: 'What is the first stage in the three-stage therapeutic sequence?',
    hint: 'This stage focuses on mending the heart through emotional release.',
  },
  {
    number: 9,
    question: 'What occurs within the Water Domes?',
    hint: 'Think of the first step in healing the emotional center.',
  },
  {
    number: 10,
    question: 'Which environment is used during the second stage of restoration?',
    hint: 'This stage uses harmonic sound and solid living structures.',
  },
  {
    number: 11,
    question: 'What defines Timeline Trauma in the context of soul healing?',
    hint: 'It is the result of long-term exposure to dense cycles and overlays.',
  },
  {
    number: 12,
    question: 'What role do solar families play once a soul\'s frequency rises in the pod?',
    hint: 'They assist in the transition from trauma-induced forgetfulness to clarity.',
  },
  {
    number: 13,
    question: 'How are fragmented aspects of the soul\'s energy signature rewoven?',
    hint: 'This process involves specific patterns of light acting as a cosmic loom.',
  },
  {
    number: 14,
    question: 'What mechanism is used to track a soul\'s frequency for precise alignment?',
    hint: 'This system utilizes the planet\'s own crystalline infrastructure.',
  },
  {
    number: 15,
    question: 'What happens to a soul once it is freed from artificial contracts and healed?',
    hint: 'The outcome is based on absolute autonomy and free will.',
  },
  {
    number: 16,
    question: 'Which group is specifically mentioned as supervising the soul\'s recovery?',
    hint: 'This group works alongside solar families.',
  },
  {
    number: 17,
    question: 'What historical system is neutralized by the deployment of Star Pods?',
    hint: 'This system is responsible for memory harvesting and recycling souls.',
  },
  {
    number: 18,
    question: 'What defines the environment of the Known Lands in the next evolutionary cycle?',
    hint: 'It is a harmonious physical world of a higher vibrational quality.',
  },
  {
    number: 19,
    question: 'Which technology is specifically used to mend the mind during the second stage of healing?',
    hint: 'This stage involves solid structures and sound vibrations.',
  },
  {
    number: 20,
    question: 'What is the result of a soul being enveloped in a womb of light inside the pod?',
    hint: 'This initial step provides safety for the subsequent reconstruction.',
  },
  {
    number: 21,
    question: 'Why are Star Pods considered the final tier of restoration?',
    hint: 'Consider the order of the heart, mind, and soul in the healing sequence.',
  },
  {
    number: 22,
    question: 'What ensures that no true soul is abandoned during the collapse of the 3D overlay?',
    hint: 'These specialized vessels provide a fail-safe for restoration.',
  },
  {
    number: 23,
    question: 'How do Star Pods interact with parasitic technology?',
    hint: 'Consider how the pods address the core damage left behind by these overlays.',
  },
  {
    number: 24,
    question: 'What characterizes the circulating flows inside a Star Pod?',
    hint: 'These currents define the specific atmospheric state of the pod.',
  },
  {
    number: 25,
    question: 'What is the ultimate goal of the three-stage restoration sequence?',
    hint: 'This involves the complete return of the soul to its original, uncorrupted state.',
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
      /the source identifies/i.test(o.rationale) ||
      /the source material/i.test(o.rationale) ||
      /the source explicitly/i.test(o.rationale) ||
      /the text states/i.test(o.rationale) ||
      /the text describes/i.test(o.rationale)
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
    'Test your grasp of Star Pods — etheric soul-restoration chambers, timeline trauma and soul fractures, the womb of light and cosmic looms, Water Domes / Crystal Halls / Star Pods, and sovereign choice after Vatican amnesia loops dissolve.',
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'Star Pods are the final restoration tier: multidimensional chambers in etheric nebulae cocoons that reweave soul fractures and timeline trauma. Sit with the womb of light, circulating light frequencies as cosmic looms, solar families and the Resonating Army projecting into the chamber, and the three-stage path from heart to mind to soul. Return to the Star Pods deep-dive, infographic, and video transmissions as you hold the sovereign choice to ascend or enter a fresh Known Lands cycle free of parasite overlays.',
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
    'Test your understanding of Star Pods — etheric soul-restoration chambers; timeline trauma and soul fractures; Starlight Pods and Essence Chambers; womb of light and cosmic looms; Water Domes / Crystal Halls / Star Pods sequence; and sovereign choice after Vatican amnesia loops dissolve.',
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
        t.description.includes('Decoded analysis of Star Pods')
      ) {
        t.description =
          'Star Pods are specialized multidimensional chambers floating in etheric nebulae cocoons — the final restoration tier that reweaves soul fractures and timeline trauma, neutralizing 3D matrix damage and restoring sovereign wholeness.';
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('star-pods not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from crystal-halls (closest sibling under Healing Sanctuaries)
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'crystal-halls.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Star Pods: etheric soul-restoration chambers, timeline trauma and soul fractures, Starlight Pods and Essence Chambers, womb of light and cosmic looms, Water Domes / Crystal Halls / Star Pods sequence, and sovereign choice after restoration.';

const replacements = [
  ['Crystal Halls Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Crystal Halls: mind-mending living crystal temples under cathedral overlays, humming harmonic slabs, rainbow fractals, Lungs of Light, Saferons, Giants, and the Water Domes / Crystal Halls / Star Pods triad.',
    desc,
  ],
  ['quiz/breakdown/crystal-halls.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/crystal-halls.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=crystal-halls',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`,
  ],
  ['Crystal Halls deep-dive', `${TOPIC_TITLE} deep-dive`],
  [
    'data/quizzes/breakdown/crystal-halls.json',
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
  .replace(/Interactive Living Truth Quiz on Crystal Halls[^"]*/g, desc)
  .replace(/<title>Crystal Halls Quiz/g, `<title>${TOPIC_TITLE} Quiz`)
  .replace(/Crystal Halls Quiz \|/g, `${TOPIC_TITLE} Quiz |`)
  .replace(/Crystal Halls deep-dive/g, `${TOPIC_TITLE} deep-dive`)
  .replace(/topic=crystal-halls/g, `topic=${TOPIC_ID}`)
  .replace(/crystal-halls\.webp/g, 'star-pods.webp')
  .replace(/crystal-halls\.json/g, 'star-pods.json')
  .replace(/crystal-halls\.html/g, 'star-pods.html');

if (!html.includes('html,body{background-color:#0F0A1F}')) {
  html = html.replace(
    '    <link rel="preload"',
    `    <!-- Critical paint: solid vault color before main.css (prevents white flash) -->
    <style>html,body{background-color:#0F0A1F}</style>
    <link rel="preload"`
  );
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
    "  { path: '/quiz/breakdown/overlay-clearing.html', priority: '0.75', changefreq: 'monthly' },";
  if (!sm.includes(anchor)) {
    const alt =
      "  { path: '/quiz/breakdown/crystal-halls.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/star-pods.json'
);
