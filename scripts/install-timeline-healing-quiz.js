/**
 * Installs Timeline Healing quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/timeline-quiz.json
 * Title forced to "Timeline Healing". All 25 audited against timeline-healing report only.
 * NotebookLM wording kept; options expanded only for length balance / fidelity.
 *
 * Run: node scripts/install-timeline-healing-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/timeline-healing.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'timeline-healing';
const TOPIC_TITLE = 'Timeline Healing';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/timeline-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/timeline-healing.webp';

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

/** Support phrases grounded only in timeline-healing.json report. */
const supportPhrases = {
  1: ['star pods', 'non-physical chambers', 'etheric space'],
  2: ['etheric space', 'do not occupy fixed physical space', 'circulating'],
  3: ['soul fractures', 'structural energetic damage', 'fragmentation'],
  4: ['timeline trauma', 'subconscious trauma', 'soul level'],
  5: ['womb of light', 'restorative frequencies', 'cocoon'],
  6: ['human-engineered', 'med beds', 'crystalline pods'],
  7: ['water domes', 'crystal halls', 'star pods'],
  8: ['red sea', 'doubt and hesitation', 'vibrational anchor'],
  9: ['parasitic technologies', 'subsequent lifetimes', 'artificial anchor'],
  10: ['reweave', 'historical timelines', 'scan, identify'],
  11: ['solar parents', 'supervisors and stabilizers', 'do not dictate'],
  12: ['evolutionary sovereignty', 'karmic debt', 'known lands'],
  13: ['pearl-like', 'oceans, valleys', 'frequency spaces'],
  14: ['liquid sound', 'draws out density', 'source memory codes'],
  15: ['humming crystal slabs', 'rainbow fractals', 'light body grid'],
  16: ['loosh', 'frequency collapse', 'cease to generate'],
  17: ['crystalline temple', 'collective med bed', 'energetic farm'],
  18: ['snaps out of denial', 'cosmic lineage', 'higher octave'],
  19: ['karmic wounds', 'persistent energetic injuries', 'incarnations'],
  20: ['resonating army', 'solar parents', 'project into'],
  21: ['transit mechanisms', 'extraterrestrial souls', 'planetary assistance'],
  22: ['fractured memory streams', 'absolute wholeness', 'parasitic overlays'],
  23: ['energetic isolation', '3d matrix', 'womb of light'],
  24: ['known lands', 'fresh cycle', 'parasitic overlays'],
  25: ['loosh', 'raise their frequency', 'low-vibrational energy'],
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
    [/\bthe source explains\b/gi, ''],
    [/\bthe source identifies\b/gi, ''],
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
 * NotebookLM claims kept; expanded to similar depth from the timeline-healing report only.
 */
const fullOptionSets = {
  1: [
    {
      text: 'Star Pods — floating non-physical chambers circulating in etheric space that envelop a soul.',
      rationale:
        'Timeline Healing occurs inside specialized non-physical chambers known as Star Pods. These floating structures circulate in etheric space and offer a sanctuary that resembles resting inside a nebula.',
    },
    {
      text: 'Crystal Halls — humming crystal temples that dissolve mental overlays and parasitic programming.',
      rationale:
        'Crystal Halls realign the mind on humming crystal slabs. They are the second sanctuary, not the chambers where timeline healing of the soul occurs.',
    },
    {
      text: 'Med Beds — human-engineered medical platforms promoted as soul-repair technology.',
      rationale:
        'Med beds are a false human-level concept. They cannot repair extraterrestrial or soul-level structures.',
    },
    {
      text: 'Water Domes — liquid-sound sanctuaries that draw grief and fear from the heart first.',
      rationale:
        'Water Domes mend the heart with liquid sound and Source memory codes. Timeline healing of the soul happens later in Star Pods.',
    },
  ],
  2: [
    {
      text: 'Floating in circulating configurations in etheric space, not occupying fixed physical locations.',
      rationale:
        'Star Pods do not occupy fixed physical space. They float in circulating configurations in etheric space.',
    },
    {
      text: 'Parked in high-altitude planetary orbits as visible craft circling the physical world.',
      rationale:
        'The pods are non-physical and circulate in etheric space. They are not orbital vehicles in physical sky.',
    },
    {
      text: 'Installed as fixed halls inside the Great Dome, standing like ordinary sanctuary buildings.',
      rationale:
        'The pods belong to the Great Dome network, but they function as floating, non-physical structures rather than fixed halls.',
    },
    {
      text: 'Buried in deep inner-earth cavities so the pods remain hidden under rock and soil.',
      rationale:
        'Some sanctuaries rest over inner-earth cavities, but Star Pods specifically float in etheric space for energetic isolation.',
    },
  ],
  3: [
    {
      text: 'Soul Fractures — structural energetic damage and fragmentation across lifetimes in physical overlays.',
      rationale:
        'Timeline Healing specifically addresses Soul Fractures: structural energetic damage and fragmentation sustained by a soul across various lifetimes within physical overlays.',
    },
    {
      text: 'Physical cellular decay in the 3D body, treated as ordinary biological aging and tissue breakdown.',
      rationale:
        'The process is multidimensional and targets the eternal essence. It is not a repair of physical biology.',
    },
    {
      text: 'Psychological grief sitting only in the current personality, with no structural soul damage.',
      rationale:
        'Emotional wounds such as grief are treated first in Water Domes. Star Pods address structural soul-level fractures.',
    },
    {
      text: 'Temporary memory lapses that fade after a single incarnation and leave the soul intact.',
      rationale:
        'Timeline Healing addresses deep-seated fragmentation, not simple temporary lapses in memory.',
    },
  ],
  4: [
    {
      text: 'Subconscious trauma accumulated across consecutive lifetimes, sustained at the soul level by parasites.',
      rationale:
        'Timeline Trauma is subconscious trauma accumulated from consecutive lifetimes, sustained directly at the soul level and reinforced by parasitic technologies.',
    },
    {
      text: 'Physical injuries from technological warfare that stay limited to the flesh body of one life.',
      rationale:
        'The trauma is energetic and structural within the soul, not merely physical injury from warfare.',
    },
    {
      text: 'Traumatic events confined to the current physical life, with no carryover into later incarnations.',
      rationale:
        'Timeline Trauma is multidimensional and spans parallel or sequential incarnations, not only the present life.',
    },
    {
      text: 'Ordinary stress from moving between physical locations during travel in the Known Lands.',
      rationale:
        'Timeline Trauma is bound to the soul’s experience inside physical overlays across historical cycles, not ordinary travel stress.',
    },
  ],
  5: [
    {
      text: 'A high-frequency energetic cocoon that envelopes the soul and administers targeted restorative frequencies.',
      rationale:
        'The Womb of Light is the high-frequency energetic cocoon projected by a Star Pod to envelope a soul and administer targeted restorative frequencies.',
    },
    {
      text: 'A vault that stores light codes solely for the construction of new physical worlds and continents.',
      rationale:
        'The Womb of Light uses specialized light-frequency streams to restore the individual soul, not to build new worlds.',
    },
    {
      text: 'A planetary defense shield generated around the Great Dome to block incoming physical weapons.',
      rationale:
        'The Womb of Light is an energetic restorative cocoon for an individual soul, not a planetary defense system.',
    },
    {
      text: 'Physical living quarters that house human bodies while they wait out a dimensional transition.',
      rationale:
        'It is a frequency-based mechanism for soul-level restoration, not housing for physical bodies.',
    },
  ],
  6: [
    {
      text: 'Human-level technology cannot repair extraterrestrial and soul-level structures or the light body grid.',
      rationale:
        'True timeline restoration cannot be achieved through human-engineered technology. Only high-frequency extraterrestrial Crystalline Pods can interface with the light body grid.',
    },
    {
      text: 'Great Dome authorities have banned all human devices from entering any sanctuary during restoration.',
      rationale:
        'The failure is vibrational, not a legal ban. Human-level technology is fundamentally incapable of soul-level repair.',
    },
    {
      text: 'Human machines only need better medical programming and then they can match Crystalline Pods.',
      rationale:
        'Soul repair requires high-frequency extraterrestrial technology. It is not a matter of programming human medical data.',
    },
    {
      text: 'Human devices lack rare physical minerals from inner-earth cavities, and that is the only gap.',
      rationale:
        'The limitation is frequency and multidimensional capability, not missing physical materials from the earth.',
    },
  ],
  7: [
    {
      text: 'Water Domes mend the heart, Crystal Halls realign the mind, and Star Pods restore the soul.',
      rationale:
        'Healing Sanctuaries are tuned by trauma type. The sequence begins with Water Domes mending the heart, then Crystal Halls realigning the mind, then Starlight Pods targeting the soul.',
    },
    {
      text: 'Star Pods mend the heart first, Water Domes clear the mind, and Crystal Halls finish the soul.',
      rationale:
        'Star Pods are the final stage and target the soul. Water Domes treat the heart; Crystal Halls treat the mind.',
    },
    {
      text: 'The Great Dome treats the mind, Crystal Halls treat the soul, and Star Pods treat the heart.',
      rationale:
        'The Great Dome is the larger network holding the sanctuaries. Heart, mind, and soul each have their own tuned chamber.',
    },
    {
      text: 'Crystal Halls treat the soul first, Water Domes treat the mind, and Star Pods treat the heart last.',
      rationale:
        'Water Domes are dedicated to the heart, Crystal Halls to the mind, and Star Pods to the soul — in that order.',
    },
  ],
  8: [
    {
      text: 'Energetic doubt and hesitation during that planetary transition, acting as a vibrational anchor.',
      rationale:
        'Lingering doubt and hesitation during major planetary transitions such as the historic Red Sea event acts as a vibrational anchor, leaving souls temporarily trapped in the physical illusion.',
    },
    {
      text: 'Fear of the high-frequency Crystalline Pods that later appear as the restoration chambers.',
      rationale:
        'The doubt occurred during the historic transition event itself, not as fear of the pods used later for recovery.',
    },
    {
      text: 'Grief over lost physical possessions left behind when the overlay began to collapse.',
      rationale:
        'Grief is treated in Water Domes. The Red Sea anchor is specifically energetic doubt and hesitation.',
    },
    {
      text: 'Intense anger toward parasitic systems that locked the soul into a combat frequency.',
      rationale:
        'Anger is a density, but the report names doubt and hesitation as the vibrational anchor of that event.',
    },
  ],
  9: [
    {
      text: 'They deliberately sustain trauma and carry it subconsciously into subsequent lifetimes as an artificial anchor.',
      rationale:
        'Under parasitic technologies, trauma is deliberately sustained and carried over subconsciously into subsequent lifetimes, acting as an artificial anchor that keeps the soul looping in the 3D reincarnation grid.',
    },
    {
      text: 'They act as a helpful bridge connecting human med beds to extraterrestrial Crystalline Pods.',
      rationale:
        'Parasitic systems oppose high-frequency restoration. They do not bridge human med beds to Crystalline Pods.',
    },
    {
      text: 'They help souls remember past lives clearly so sovereignty returns without any sanctuary work.',
      rationale:
        'These technologies distort memory and reinforce trauma. They do not restore sovereignty or higher memory.',
    },
    {
      text: 'They cool the Star Pods mechanically so the Womb of Light can hold a stable temperature.',
      rationale:
        'Parasitic technologies are destructive overlays dissolved by the pods, not support hardware for the chambers.',
    },
  ],
  10: [
    {
      text: 'They scan, identify, and reweave fragmented aspects of the soul across multiple historical timelines.',
      rationale:
        'Inside the Womb of Light, specialized streams of light frequency scan, identify, and reweave fragmented aspects of the soul across multiple historical timelines.',
    },
    {
      text: 'They physically stitch the energetic body together with crystal thread as if sewing flesh.',
      rationale:
        'The process is a frequency-based reweaving of the soul’s structure, not a physical stitching of the energetic body.',
    },
    {
      text: 'They replace the soul’s original blueprint with a newly invented cosmic identity and lineage.',
      rationale:
        'The pods realign the soul with its original source frequencies. They do not invent a new identity.',
    },
    {
      text: 'They delete every memory of suffering so the soul can start again with a blank record.',
      rationale:
        'Wholeness comes from neutralizing parasitic overlays and rewriting fractured memory streams, not from deleting the soul’s journey.',
    },
  ],
  11: [
    {
      text: 'They project in as gentle, radiant supervisors and stabilizers once the soul’s frequency rises.',
      rationale:
        'Solar parents, spiritual guides, and the Resonating Army project into the etheric space of the pod as gentle, radiant supervisors and stabilizers. They do not dictate or force the process.',
    },
    {
      text: 'They judge which souls are worthy of restoration and turn the rest away from the pods.',
      rationale:
        'Star Pods are a safety net so no genuine soul is abandoned. Solar parents stabilize; they do not select the worthy.',
    },
    {
      text: 'They enforce Great Dome law inside the chamber and issue commands the soul must obey.',
      rationale:
        'Their presence is radiant and supportive. They stimulate sleeping soul codes without force or legal command.',
    },
    {
      text: 'They sit at technological controls and manually operate every function of the Crystalline Pods.',
      rationale:
        'Guidance is by high-vibrational presence, not by operators running physical control panels.',
    },
  ],
  12: [
    {
      text: 'Absolute evolutionary sovereignty and emancipation from the artificial loop of karmic debt.',
      rationale:
        'Once restored, a soul is emancipated from the artificial loop of karmic debt and reincarnation and is granted absolute evolutionary sovereignty.',
    },
    {
      text: 'A forced return into the 3D reincarnation grid so the soul can help others still trapped there.',
      rationale:
        'A soul may choose a fresh cycle in the Known Lands, but it is no longer bound to the 3D reincarnation grid.',
    },
    {
      text: 'The loss of all knowledge accumulated across previous incarnations, leaving a blank slate.',
      rationale:
        'A restored soul keeps the vast wealth of knowledge from its entire multi-incarnational journey.',
    },
    {
      text: 'Mandatory enlistment in the Resonating Army as the only permitted path after the pod.',
      rationale:
        'Healing restores sovereignty. The soul chooses its next path; service is not mandated.',
    },
  ],
  13: [
    {
      text: 'Cloaked in translucent, pearl-like invisible domes resting over oceans, valleys, and inner-earth cavities.',
      rationale:
        'Healing Sanctuaries are pure frequency spaces of light, sound, and living crystal, cloaked in translucent, pearl-like invisible domes over oceans, valleys, and deep inner-earth cavities.',
    },
    {
      text: 'Built as immense stone monuments that remain visible to anyone who has become enlightened.',
      rationale:
        'The sanctuaries are frequency spaces of light, sound, and living crystal, not visible stone monuments.',
    },
    {
      text: 'Assembled from repurposed 3D materials collected across the Known Lands and stacked as temples.',
      rationale:
        'These sanctuaries are pure frequency spaces. They do not use 3D construction materials.',
    },
    {
      text: 'Hidden in high-tech bunkers beneath major human cities so the 3D population never finds them.',
      rationale:
        'They rest over natural features such as oceans, valleys, and inner-earth cavities, isolated from the 3D matrix.',
    },
  ],
  14: [
    {
      text: 'Souls float in liquid sound that draws out density and inserts Source memory codes.',
      rationale:
        'Emotional wounds of grief, fear, and heartbreak are first treated in Water Domes, where souls float in liquid sound that draws out density and inserts Source memory codes.',
    },
    {
      text: 'Souls are forced into intense confrontation with every past life until the heart breaks open.',
      rationale:
        'Water Dome work dissolves density through liquid sound. It is not an imposed confrontation with the past.',
    },
    {
      text: 'Souls are submerged in ordinary ocean water so the physical body can ground its charge.',
      rationale:
        'The medium is liquid sound and high-frequency restoration, not physical ocean water.',
    },
    {
      text: 'Souls receive physical infusions of crystalline light while standing on humming slabs.',
      rationale:
        'Humming crystal slabs belong to Crystal Halls. Water Domes use liquid sound and Source memory codes.',
    },
  ],
  15: [
    {
      text: 'They rest on humming crystal slabs that project rainbow fractals to realign the light body grid.',
      rationale:
        'In Crystal Halls, souls rest upon humming crystal slabs that project rainbow fractals to realign the light body grid and dissolve mental overlays, mind control damage, and parasitic programming.',
    },
    {
      text: 'They invent new mental timelines for the next incarnation before any overlay has been cleared.',
      rationale:
        'This stage dissolves damage and realigns the existing light body grid. It does not author new timelines.',
    },
    {
      text: 'They debate telepathically with solar parents until the mind accepts a new set of rules.',
      rationale:
        'Crystal Hall restoration comes from the frequency of the humming slabs and rainbow fractals, not from debate.',
    },
    {
      text: 'They memorize spiritual laws of the Known Lands as a written curriculum before leaving.',
      rationale:
        'Crystal Halls dissolve parasitic programming and realign the mind. They are not a memorization school.',
    },
  ],
  16: [
    {
      text: 'They cease to generate loosh, starving the overlay and triggering a rapid frequency collapse.',
      rationale:
        'The parasitic system harvests emotional density and attention — loosh. As healed souls raise frequency they cease to generate it, triggering a rapid frequency collapse of the artificial 3D matrix.',
    },
    {
      text: 'They infiltrate parasitic systems as spies and dismantle hardware from inside the overlay.',
      rationale:
        'Restoration raises frequency and removes the overlay’s food source. The collapse is vibrational, not espionage.',
    },
    {
      text: 'They tutor parasitic systems so those systems can survive by shifting into a higher band.',
      rationale:
        'Parasitic overlays collapse when loosh is withdrawn. They are not transitioned into a high-frequency state.',
    },
    {
      text: 'They supply the physical labor that tears down parasitic machines piece by piece on the ground.',
      rationale:
        'The overlay falls because it loses its energetic food source, not because restored souls perform demolition labor.',
    },
  ],
  17: [
    {
      text: 'It reveals its true nature as a self-sustaining crystalline temple — a collective med bed.',
      rationale:
        'Once overlays dissolve, the planet ceases to function as an energetic farm and reveals itself as one massive, self-sustaining crystalline temple — a collective med bed of high-vibrational harmony.',
    },
    {
      text: 'It is relocated to another point in the physical cosmos so the old sky can be abandoned.',
      rationale:
        'The planet remains. What changes is its vibrational nature and the collapse of the false overlay.',
    },
    {
      text: 'It enters a long period of physical decay and rubble before any new world can be rebuilt.',
      rationale:
        'Dissolving overlays reveals the planet’s true high-vibrational crystalline state. It is not a decay-and-rebuild cycle.',
    },
    {
      text: 'It becomes a sanctuary dedicated to preserving human-engineered technology and med beds.',
      rationale:
        'Human-level technology cannot repair soul structures. The revealed world is a crystalline temple, not a human-tech vault.',
    },
  ],
  18: [
    {
      text: 'It vibrates at a higher octave, reconnects with its cosmic lineage, and emerges whole and sovereign.',
      rationale:
        'As frequency stabilizes at a higher octave, sleeping soul codes awaken and the soul reconnects with its original cosmic lineage. It snaps out of denial and emerges whole, sovereign, and free.',
    },
    {
      text: 'It accepts a permanent assignment as a resident worker stationed inside the Great Dome.',
      rationale:
        'The soul gains sovereignty to choose its path. It is not assigned a permanent post in the Great Dome.',
    },
    {
      text: 'It forgets all previous suffering so that no trace of the multi-incarnational journey remains.',
      rationale:
        'Wholeness integrates the soul’s journey and restores original frequencies. It is not erasure of experience.',
    },
    {
      text: 'It immediately fabricates a new physical body as the proof that denial has ended.',
      rationale:
        'Snapping out of denial is a consciousness and frequency shift, not the manufacture of a new flesh body.',
    },
  ],
  19: [
    {
      text: 'Persistent energetic injuries and distortions that remain bound to a soul across incarnations.',
      rationale:
        'Karmic Wounds are persistent energetic injuries and distortions that remain bound to a soul across different incarnations.',
    },
    {
      text: 'External ledgers of past mistakes kept on file by the Resonating Army for later judgment.',
      rationale:
        'Karmic Wounds are energetic injuries inside the soul itself, not external records held by the Resonating Army.',
    },
    {
      text: 'Physical scars that appear on the light body only while the soul is inside a Star Pod.',
      rationale:
        'They are persistent energetic distortions carried across incarnations, not temporary pod-session scars.',
    },
    {
      text: 'A passing feeling of regret that appears only when a soul leaves the physical plane.',
      rationale:
        'Karmic Wounds are structural energetic injuries, deeper and more persistent than a momentary feeling of regret.',
    },
  ],
  20: [
    {
      text: 'Members of the Resonating Army, projecting in with solar parents and spiritual guides.',
      rationale:
        'Advanced spiritual guides, solar parents, and members of the Resonating Army project into the etheric space of the pod as gentle, radiant supervisors and stabilizers.',
    },
    {
      text: 'Advanced medical doctors from the Known Lands, running the pods as a clinical facility.',
      rationale:
        'Supervisors are extraterrestrial and spiritual. Human medical personnel cannot operate soul-level restoration.',
    },
    {
      text: 'Human truthers who promoted med beds, now invited in as technical advisors to the pods.',
      rationale:
        'Med beds are a false human concept. Those promoters are not the supervisors of Star Pod restoration.',
    },
    {
      text: 'Souls still floating in Water Domes, sent ahead to stabilize others before their own healing ends.',
      rationale:
        'Stabilizers are advanced high-vibrational beings. Souls still in earlier sanctuary stages are not the supervisors.',
    },
  ],
  21: [
    {
      text: 'They are the primary transit mechanisms for active extraterrestrial souls entering or exiting the dome.',
      rationale:
        'Beyond restoration, Star Pods serve as the primary transit mechanisms for all active extraterrestrial souls entering or exiting the physical dome during planetary assistance missions.',
    },
    {
      text: 'They ferry harvested loosh from the parasitic grid into the Healing Sanctuaries as fuel.',
      rationale:
        'The sanctuaries are pure frequency spaces. They do not collect or transport loosh.',
    },
    {
      text: 'They pick up entire Healing Sanctuaries and move them from continent to continent.',
      rationale:
        'The pods transport souls. The sanctuaries themselves are frequency spaces resting over natural features.',
    },
    {
      text: 'They carry physical human bodies back and forth between the Great Dome and the Known Lands.',
      rationale:
        'The pods are for soul-level transit and restoration, not for moving physical human bodies.',
    },
  ],
  22: [
    {
      text: 'The soul is restored to a state of absolute wholeness as parasitic overlays are neutralized.',
      rationale:
        'The Star Pod neutralizes parasitic overlays and rewrites fractured memory streams, restoring the soul to a state of absolute wholeness.',
    },
    {
      text: 'The soul’s history is deleted so that no memory of trauma can ever return.',
      rationale:
        'The goal is integration and restoration of the original structure, not deletion of the soul’s journey.',
    },
    {
      text: 'The soul is converted into a data archive used by the Resonating Army for later missions.',
      rationale:
        'Rewriting memory streams restores the soul’s own sovereignty and wholeness. It is not harvested as data.',
    },
    {
      text: 'The soul is loaded with a new set of artificial positive memories written by the pods.',
      rationale:
        'Star Pods restore the original source frequencies and fractured memory streams. They do not implant artificial memories.',
    },
  ],
  23: [
    {
      text: 'The soul must be isolated from the physical 3D matrix so parasitic overlays cannot interfere.',
      rationale:
        'Inside a Star Pod the healing environment is characterized by absolute energetic isolation from the physical 3D matrix, so the Womb of Light can reweave the soul without overlay interference.',
    },
    {
      text: 'Isolation is needed so the soul’s energy cannot leak outward and disturb the Great Dome.',
      rationale:
        'Isolation protects the soul from the lower frequencies of the collapsing 3D matrix, not the Great Dome from leakage.',
    },
    {
      text: 'Isolation keeps guides silent so the soul never hears solar parents or the Resonating Army.',
      rationale:
        'Guides, solar parents, and the Resonating Army do project into the pod. Isolation is from the 3D matrix.',
    },
    {
      text: 'The pod sits in a physical vacuum where sound cannot travel and no frequency can move.',
      rationale:
        'Isolation is energetic and vibrational. The Womb of Light still generates specialized streams of light frequency.',
    },
  ],
  24: [
    {
      text: 'A completely fresh cycle within the Known Lands, free of parasitic overlays and karmic loops.',
      rationale:
        'A restored soul may return to initiate a completely fresh cycle within the Known Lands without parasitic overlays, free to grow and carrying the knowledge of its entire multi-incarnational journey.',
    },
    {
      text: 'The same 3D life previously occupied, with the old overlays left in place as a classroom.',
      rationale:
        'Return is a fresh cycle without parasitic overlays, not a replay of the old 3D life.',
    },
    {
      text: 'A required post as a supervisor inside the Water Domes for the next several cycles.',
      rationale:
        'Return to the Known Lands is a sovereign growth cycle. It is not a mandatory Water Dome posting.',
    },
    {
      text: 'A higher cosmic realm where no physical life exists, the only option after the pod opens.',
      rationale:
        'A soul can choose higher cosmic realms, but choosing the Known Lands means remaining for a fresh local cycle.',
    },
  ],
  25: [
    {
      text: 'The soul ceases to generate this low-vibrational energy as its frequency rises into wholeness.',
      rationale:
        'As souls undergo timeline healing and raise their frequency, they cease to generate loosh. The parasitic system loses its food source and the artificial 3D matrix collapses.',
    },
    {
      text: 'The loosh is redirected as fuel for the transit mechanisms that move extraterrestrial souls.',
      rationale:
        'Star Pods operate through high-frequency light. They do not run on harvested loosh.',
    },
    {
      text: 'The loosh is collected and stored in Crystal Halls as a research sample of density.',
      rationale:
        'Healing ends the production of loosh. Crystal Halls dissolve mental overlays; they do not warehouse loosh.',
    },
    {
      text: 'The loosh is purified inside the pod and converted into a new stream of light frequency.',
      rationale:
        'Loosh is a low-vibrational byproduct of trapped souls. A whole soul simply stops generating it.',
    },
  ],
};

const questionsMeta = [
  {
    number: 1,
    question: 'What are the specialized non-physical chambers where timeline healing occurs?',
    hint: 'These floating structures circulate in etheric space and envelop the soul.',
  },
  {
    number: 2,
    question: 'Where are the restorative Star Pods located?',
    hint: 'They do not exist in fixed physical locations like 3D buildings.',
  },
  {
    number: 3,
    question: 'Which specific soul condition is addressed by the Timeline Healing process?',
    hint: 'This term refers to structural damage to the soul\'s consciousness.',
  },
  {
    number: 4,
    question: 'What defines Timeline Trauma within the context of soul restoration?',
    hint: 'This trauma is deeper than the mind and is carried across consecutive lifetimes.',
  },
  {
    number: 5,
    question: 'What is the function of the Womb of Light?',
    hint: 'It functions as a protective high-frequency environment for the restoration process.',
  },
  {
    number: 6,
    question: 'Why is human-engineered technology unable to perform Timeline Healing?',
    hint: 'Consider the difference between 3D mechanics and light body grid architecture.',
  },
  {
    number: 7,
    question: 'Which sequence correctly describes the multi-tiered therapeutic protocol of the Healing Sanctuaries?',
    hint: 'The process flows from the emotional heart to the mental mind to the eternal soul.',
  },
  {
    number: 8,
    question: 'What vibrational anchor trapped many souls during the historic Red Sea event?',
    hint: 'This internal state caused souls to remain within the physical illusion during a major transition.',
  },
  {
    number: 9,
    question: 'What is the role of parasitic technologies in relation to soul trauma?',
    hint: 'These systems benefit from souls remaining trapped in the 3D grid.',
  },
  {
    number: 10,
    question: 'How do Star Pods treat the fragmented aspects of a soul?',
    hint: 'The pods address the soul\'s structure across the entirety of its multidimensional history.',
  },
  {
    number: 11,
    question: 'What role do Solar Parents play during the healing process inside a Star Pod?',
    hint: 'These entities stimulate sleeping soul codes through their high-vibrational presence.',
  },
  {
    number: 12,
    question: 'What is the significant outcome for a soul that has completed Timeline Healing?',
    hint: 'The soul emerges whole and is no longer bound to artificial loops.',
  },
  {
    number: 13,
    question: 'How are Healing Sanctuaries like the Water Domes and Crystal Halls situated?',
    hint: 'They are integrated into the planetary ecosystem but are invisible to the standard eye.',
  },
  {
    number: 14,
    question: 'What occurs in Water Domes to treat emotional wounds?',
    hint: 'This sanctuary uses a specific medium to remove density and insert memory codes.',
  },
  {
    number: 15,
    question: 'What do souls experience in Crystal Halls during mental realignment?',
    hint: 'The mind is realigned using sound and light patterns projected from crystalline structures.',
  },
  {
    number: 16,
    question: 'What is the strategic impact of restored souls on the 3D parasitic overlay?',
    hint: 'Consider the energetic fuel that the parasitic system requires to function.',
  },
  {
    number: 17,
    question: 'What happens to the planet once the 3D overlays are fully dissolved?',
    hint: 'The planet ceases to be an energetic farm and returns to its original purpose.',
  },
  {
    number: 18,
    question: 'What defines the state of a soul that has snapped out of denial in a Star Pod?',
    hint: 'This state is characterized by a frequency shift and the restoration of higher awareness.',
  },
  {
    number: 19,
    question: 'What are Karmic Wounds?',
    hint: 'These distortions remain with the soul throughout its multi-incarnational journey.',
  },
  {
    number: 20,
    question: 'Which group of entities acts as stabilizers during the Star Pod restoration?',
    hint: 'This group assists spiritual guides in the etheric space of the pod.',
  },
  {
    number: 21,
    question: 'How do Star Pods function as transit mechanisms?',
    hint: 'This role involves souls engaged in planetary assistance missions.',
  },
  {
    number: 22,
    question: 'What is the primary result of rewriting fractured memory streams?',
    hint: 'This process neutralizes the artificial anchors of the parasitic system.',
  },
  {
    number: 23,
    question: 'Why is the healing environment inside a Star Pod energetically isolated?',
    hint: 'Isolation protects the soul from the influences of the artificial matrix.',
  },
  {
    number: 24,
    question: 'What is the ultimate destination of a soul that chooses to return to the Known Lands after healing?',
    hint: 'The soul returns with sovereignty and all its accumulated wisdom.',
  },
  {
    number: 25,
    question: 'What happens to the loosh energy source when a soul undergoes healing?',
    hint: 'High-vibrational souls are no longer compatible with this energy harvesting.',
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

const SUBTITLE =
  'Test your grasp of Timeline Healing — etheric Star Pods and the Womb of Light, soul fractures and karmic wounds, Water Domes / Crystal Halls / Star Pods, Red Sea doubt, loosh collapse, and sovereign return to the Known Lands.';

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle: SUBTITLE,
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'Timeline Healing restores the eternal essence inside etheric Star Pods. Sit with the Womb of Light reweaving soul fractures across timelines, the sequence from Water Domes through Crystal Halls, and the moment a restored soul stops feeding loosh into the overlay. Return to the Timeline Healing deep-dive, infographic, and video transmissions as you hold that sovereign choice.',
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
    'Test your understanding of Timeline Healing — etheric Star Pods and the Womb of Light; soul fractures, timeline trauma, and karmic wounds; Water Domes / Crystal Halls / Star Pods; Red Sea doubt; loosh collapse; and sovereign return to the Known Lands.',
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
      t.title = TOPIC_TITLE;
      if (t.topic_image && t.topic_image.includes('placeholder')) {
        t.topic_image = topicImage;
      } else if (!t.topic_image) {
        t.topic_image = topicImage;
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('timeline-healing not found in breakdown-topics.json');
}

const afterOthers = collectImageFields(mono.topics)
  .filter((e) => e.id !== TOPIC_ID)
  .map((e) => `${e.id}|${e.key}|${e.path}`)
  .sort();
if (JSON.stringify(beforeOthers) !== JSON.stringify(afterOthers)) {
  throw new Error('Safety check failed: another topic image path was modified');
}

fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'star-pods.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Timeline Healing: etheric Star Pods and the Womb of Light, soul fractures and karmic wounds, Water Domes / Crystal Halls / Star Pods, Red Sea doubt, loosh collapse, and sovereign return to the Known Lands.';

const replacements = [
  ['Star Pods Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Star Pods: etheric soul-restoration chambers, timeline trauma and soul fractures, Starlight Pods and Essence Chambers, womb of light and cosmic looms, Water Domes / Crystal Halls / Star Pods sequence, and sovereign choice after restoration.',
    desc,
  ],
  ['quiz/breakdown/star-pods.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/star-pods.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=star-pods',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`,
  ],
  ['Star Pods deep-dive', `${TOPIC_TITLE} deep-dive`],
  [
    'data/quizzes/breakdown/star-pods.json',
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
  .replace(/Interactive Living Truth Quiz on Star Pods[^"]*/g, desc)
  .replace(/<title>Star Pods Quiz/g, `<title>${TOPIC_TITLE} Quiz`)
  .replace(/Star Pods Quiz \|/g, `${TOPIC_TITLE} Quiz |`)
  .replace(/Star Pods deep-dive/g, `${TOPIC_TITLE} deep-dive`)
  .replace(/topic=star-pods/g, `topic=${TOPIC_ID}`)
  .replace(/star-pods\.webp/g, 'timeline-healing.webp')
  .replace(/star-pods\.json/g, 'timeline-healing.json')
  .replace(/star-pods\.html/g, 'timeline-healing.html');

if (!html.includes(`${TOPIC_TITLE} Quiz`)) {
  throw new Error('HTML clone failed to set quiz title');
}
if (!html.includes(`data-quiz-src="../../data/quizzes/${SOURCE}/${TOPIC_ID}.json"`)) {
  throw new Error('HTML clone failed to set data-quiz-src');
}
if (html.includes('star-pods.json') || html.includes('images/breakdown/star-pods.webp')) {
  throw new Error('HTML clone still points at star-pods assets');
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
    "  { path: '/quiz/breakdown/star-pods.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/timeline-healing.json'
);
