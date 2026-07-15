/**
 * Installs Star Seeds quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/star-seeds.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-star-seeds-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'star-seeds';
const TOPIC_TITLE = 'Star Seeds';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/star-seeds.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['sol-system', 'souls', 'heliocentric'],
  2: ['200 million', 'star seeds', 'frequencies'],
  3: ['4,000', 'star seeds', 'taran'],
  4: ['taran humans', '178,000', 'ancients'],
  5: ['pleiadians', '100,000', 'evaded'],
  6: ['pod cluster', 'soul family', 'proximity'],
  7: ['twin flame', 'separated', 'rebellion'],
  8: ['amnesia vortex', 'bright light', 'sun'],
  9: ['us', 'uk', 'europe'],
  10: ['unawakened', 'inoculations', 'suppression'],
  11: ['family members', 'friends', 'pod clusters'],
  12: ['twin flames', 'amnesia vortex', 'rebellion'],
  13: ['vatican', 'grey', 'thirteen'],
  14: ['umbilical', 'trillivolts', 'birth'],
  15: ['450', '20,000', '5th density'],
  16: ['voluntary', 'time', 'transitions'],
  17: ['soul codex', 'micro suns', 'lattice'],
  18: ['emf', '178,000', 'pleiadian'],
  19: ['gateway-10', '178', 'spirit tree'],
  20: ['mt meru', 'uhf', 'custodians'],
  21: ['97%', 'npc', 'buffer'],
  22: ['pineal', '4th density', 'cloning'],
  23: ['heavy metals', 'nano-polymers', 'toxins'],
  24: ['religion', 'finance', 'perceived knowledge'],
  25: ['emf', '3%', 'ice wall'],
};

function cleanText(s) {
  if (typeof s !== 'string') return s;
  let t = s;
  t = t.replace(/\$(\d+)\^\{(st|nd|rd|th)\}\$/gi, '$1$2');
  t = t.replace(/\$(\d+)\^(st|nd|rd|th)\$/gi, '$1$2');
  t = t.replace(/\$(\d+(?:,\d+)*)\\+%\$/g, '$1%');
  t = t.replace(/\$(\d+(?:,\d+)*)\\?\%\$/g, '$1%');
  t = t.replace(/\$(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\$/g, '$1');
  t = t.replace(/\$([A-Za-z][A-Za-z0-9./-]{0,24})\$/g, '$1');
  t = t.replace(/\$([^$]+)\$/g, (_, inner) =>
    inner.replace(/\^\{([^}]+)\}/g, '$1').replace(/\\%/g, '%').replace(/\\/g, '')
  );
  t = t.replace(/\^\{(st|nd|rd|th)\}/gi, '$1');
  t = t.replace(/\\%/g, '%');
  t = t.replace(/\\\(|\\\)|\\\[|\\\]/g, '');
  t = t
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, '—')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ')
    .replace(/\uFFFD/g, '');
  return t.replace(/[ \t]{2,}/g, ' ').trim();
}

const RAW_QUESTIONS = [
  {
    number: 1,
    question: 'What is the true definition of a Sol-System?',
    options: [
      {
        label: 'A',
        text: 'The authentic cosmic family network of individual Sols (Souls) — fundamentally unrelated to the falsified heliocentric model of planetary space.',
        isCorrect: true,
        rationale:
          'A Sol-System is a soul-family network of Sols/Souls, not planets orbiting a star.',
      },
      {
        label: 'B',
        text: 'A set of spinning astronomical planets orbiting a burning star in infinite black vacuum, with no soul-family meaning at all.',
        isCorrect: false,
        rationale:
          'That heliocentric planetary picture is the falsified model; Sol-System names cosmic family.',
      },
      {
        label: 'C',
        text: 'Only a Vatican subway map used by Grey ETs with no connection to cosmic lineages.',
        isCorrect: false,
        rationale:
          'Vatican levels host reincarnation routing; Sol-System is the soul-family architecture itself.',
      },
      {
        label: 'D',
        text: 'A finance product that replaces all Pod Clusters with debt accounts after each reset.',
        isCorrect: false,
        rationale:
          'Finance is a String of compliance; Sol-System is the authentic cosmic family network.',
      },
    ],
    hint: 'Network of Sols/Souls — not planets around a star.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'What are Star Seeds in this architecture?',
    options: [
      {
        label: 'A',
        text: 'A random fashion label for anyone who likes astronomy with no incarnational mission or headcount.',
        isCorrect: false,
        rationale:
          'Star Seeds are a specific 200-million incarnational group deployed to anchor frequencies.',
      },
      {
        label: 'B',
        text: 'A specific incarnational group numbering 200 million, deployed into key geographical regions to anchor frequencies — though heavily suppressed by 3rd density toxins and societal programming.',
        isCorrect: true,
        rationale:
          '200 million Star Seeds were placed to anchor frequencies; 3rd-density toxins and programming suppress most.',
      },
      {
        label: 'C',
        text: 'Only the 4,000 Ancient Souls under another brand name with no separate population count.',
        isCorrect: false,
        rationale:
          'Star Seeds are 200 million; the 4,000 Ancients are a distinct group inserted because Star Seeds forgot.',
      },
      {
        label: 'D',
        text: 'Synthetic NPCs built in 4th density to replace all Taran humans after the EMF event.',
        isCorrect: false,
        rationale:
          'NPCs are the 97% buffer; Star Seeds are higher-density true souls trapped in the loop.',
      },
    ],
    hint: '200 million — deploy to key regions to anchor frequencies.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question: 'How do Star Seeds sit in the cosmic family hierarchy of this realm?',
    options: [
      {
        label: 'A',
        text: 'They sit above Source and created the Micro Suns last week with no Ancients involved.',
        isCorrect: false,
        rationale:
          'Hierarchy includes original creators, 4,000 Ancient Souls, and 200 million Star Seeds alongside Tarans.',
      },
      {
        label: 'B',
        text: 'They only exist as textbook diagrams and never incarnate into the 3rd density simulation.',
        isCorrect: false,
        rationale:
          'They are embedded in the simulation, trapped alongside Taran Humans in suppressed reincarnation loops.',
      },
      {
        label: 'C',
        text: 'Within the 3rd density simulation the structural hierarchy includes the original creators, the 4,000 Ancient Souls, and an embedded population of 200 million Star Seeds — trapped alongside Taran Humans in repetitive suppressed reincarnation.',
        isCorrect: true,
        rationale:
          'Creators → 4,000 Ancients → 200M Star Seeds embedded with Tarans in the suppressed loop.',
      },
      {
        label: 'D',
        text: 'They replace Pleiadians entirely and never share any lineage with Taran humans at all.',
        isCorrect: false,
        rationale:
          'Pleiadians are former Tarans who escaped; Star Seeds are a distinct embedded group in the trap.',
      },
    ],
    hint: 'Creators, 4,000 Ancients, 200M Star Seeds — trapped with Tarans.',
    correctAnswer: 'C',
  },
  {
    number: 4,
    question: 'Who are Taran Humans relative to the 4,000 Ancients?',
    options: [
      {
        label: 'A',
        text: 'Grey ET clones with no past lives and no connection to the Ancients\' creative line.',
        isCorrect: false,
        rationale:
          'Tarans are native human souls created by the 4,000 Ancients, trapped 178,000 years.',
      },
      {
        label: 'B',
        text: 'Only Pleiadians who never left and never experienced any density trap whatsoever.',
        isCorrect: false,
        rationale:
          'Pleiadians escaped about 100,000 years ago; Tarans remain trapped in the realm.',
      },
      {
        label: 'C',
        text: 'A finance caste that only manages ice-wall tourism with no harvesting history.',
        isCorrect: false,
        rationale:
          'Tarans are subjected to systemic parasitic harvesting across the occupation.',
      },
      {
        label: 'D',
        text: 'Native human souls created by the 4,000 Ancients, trapped within the current realm for 178,000 years and subjected to systemic parasitic harvesting.',
        isCorrect: true,
        rationale:
          'Tarans = Ancient-created native souls; full 178,000-year trap and harvest.',
      },
    ],
    hint: 'Ancient-created native souls — trapped 178,000 years under harvest.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question: 'Who are the Pleiadians relative to Taran souls?',
    options: [
      {
        label: 'A',
        text: 'Former Taran souls who successfully evaded the initial planetary capture approximately 100,000 Earth years ago — now highly advanced iterations of their trapped counterparts.',
        isCorrect: true,
        rationale:
          'Pleiadians = escaped Tarans (~100,000 years ago), now advanced kin of those still trapped.',
      },
      {
        label: 'B',
        text: 'NPC replicas manufactured last century with no escape history and no advanced evolution.',
        isCorrect: false,
        rationale:
          'NPCs are synthetic buffers; Pleiadians are escaped true-soul Tarans.',
      },
      {
        label: 'C',
        text: 'Only Star Seeds who never left power centers in the US, UK, and Europe.',
        isCorrect: false,
        rationale:
          'Star Seeds are the 200 million still embedded; Pleiadians already got out long ago.',
      },
      {
        label: 'D',
        text: 'Custodians rebranded as heroes who keep the Amnesia Vortex running forever.',
        isCorrect: false,
        rationale:
          'Custodians suppressed UHF at Mt Meru; Pleiadians are escaped family, not occupiers.',
      },
    ],
    hint: 'Escaped Tarans ~100,000 years ago — advanced terrestrial kin.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'What is a Pod Cluster?',
    options: [
      {
        label: 'A',
        text: 'A random workplace only NPCs share with no repeated incarnation pattern across loops.',
        isCorrect: false,
        rationale:
          'Pod Clusters are Soul Family groups who repeatedly incarnate together for proximity and support.',
      },
      {
        label: 'B',
        text: 'The localized group of incarnated Soul Family members who repeatedly incarnate together within the physical simulation to maintain proximity and support.',
        isCorrect: true,
        rationale:
          'Pod Cluster = same Soul Family re-entering together for proximity support despite amnesia.',
      },
      {
        label: 'C',
        text: 'A Grey ET storage crate under the Vatican for unused umbilical cords only.',
        isCorrect: false,
        rationale:
          'Pods are living soul-family incarnation groups, not storage crates.',
      },
      {
        label: 'D',
        text: 'A Twin Flame housing program that guarantees cohabitation every single lifetime.',
        isCorrect: false,
        rationale:
          'Twin Flames are kept separated; pods still cluster without guaranteeing twin cohabitation.',
      },
    ],
    hint: 'Soul Family re-incarnating together for proximity and support.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question: 'What is a Twin Flame in this architecture?',
    options: [
      {
        label: 'A',
        text: 'An NPC script partner assigned randomly each week with no cosmic counterpart meaning.',
        isCorrect: false,
        rationale:
          'Twin Flame is the direct energetic and cosmic counterpart of a soul.',
      },
      {
        label: 'B',
        text: 'A finance co-signer required for all ice-wall travel with no memory-activation risk.',
        isCorrect: false,
        rationale:
          'Parasites separate Twin Flames specifically to prevent memory activation and rebellion.',
      },
      {
        label: 'C',
        text: 'The direct energetic and cosmic counterpart of a soul — purposefully kept separated in the physical realm by hostile technology to prevent memory activation and rebellion.',
        isCorrect: true,
        rationale:
          'Twin Flame = cosmic counterpart; forced separation blocks memory spark and rebellion.',
      },
      {
        label: 'D',
        text: 'Any coworker who shares a Pod Cluster address for one school year only.',
        isCorrect: false,
        rationale:
          'Pod members are Soul Family support; Twin Flame is the specific counterpart kept apart.',
      },
    ],
    hint: 'Cosmic counterpart — kept apart to block memory and rebellion.',
    correctAnswer: 'C',
  },
  {
    number: 8,
    question: 'What is the Amnesia Vortex?',
    options: [
      {
        label: 'A',
        text: 'A free reunion lounge at death where Twin Flames always meet with full memory intact.',
        isCorrect: false,
        rationale:
          'It pulls souls to the bright light (the sun), deletes memory, and recycles into a new vessel.',
      },
      {
        label: 'B',
        text: 'A natural aging law that only affects NPCs and never true Star Seeds after death.',
        isCorrect: false,
        rationale:
          'It is technological trap tech applied to souls routed through the sun portal.',
      },
      {
        label: 'C',
        text: 'Only the Projection Dome software that paints fake stars without touching reincarnation.',
        isCorrect: false,
        rationale:
          'Amnesia Vortex is the death-memory recycle trap; sky fakery is a separate overlay layer.',
      },
      {
        label: 'D',
        text: 'The technological trap that pulls souls toward the "bright light" (the sun) upon physical death, facilitating memory deletion and immediate recycling into a new vessel.',
        isCorrect: true,
        rationale:
          'Bright-light sun pull = Amnesia Vortex: wipe memory and force immediate vessel recycle.',
      },
    ],
    hint: 'Bright-light sun trap — wipe memory, force new vessel.',
    correctAnswer: 'D',
  },
  {
    number: 9,
    question: 'Where were the 200 million Star Seeds strategically positioned?',
    options: [
      {
        label: 'A',
        text: 'In key global power centers, primarily the US, UK, and Europe, to anchor frequencies within the physical density.',
        isCorrect: true,
        rationale:
          'Star Seeds were embedded mainly in US, UK, and Europe power centers for frequency anchoring.',
      },
      {
        label: 'B',
        text: 'Only under the ice wall with zero presence in any terrestrial power capital.',
        isCorrect: false,
        rationale:
          'They were embedded in terrestrial key regions — US, UK, Europe — not only beyond the ice wall.',
      },
      {
        label: 'C',
        text: 'Exclusively in museum basements as Oopa displays with no living incarnation mission.',
        isCorrect: false,
        rationale:
          'They are living incarnational population deployed into power centers, not museum exhibits.',
      },
      {
        label: 'D',
        text: 'Randomly across all 178 worlds of Gateway-10 with no preference for Earth power centers.',
        isCorrect: false,
        rationale:
          'This report specifies primary positioning in US, UK, and Europe power centers.',
      },
    ],
    hint: 'US, UK, Europe — key power centers for frequency anchoring.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'What happened to most Star Seeds under 3rd density suppression?',
    options: [
      {
        label: 'A',
        text: 'They all fully awakened in year one and refused every toxic inoculation as a unified bloc.',
        isCorrect: false,
        rationale:
          'Vast majority remained unawakened, succumbing to biological degradation and compliance.',
      },
      {
        label: 'B',
        text: 'The severity of 3rd density suppression left the vast majority unawakened, succumbing to biological degradation and compliance — such as receiving multiple toxic inoculations.',
        isCorrect: true,
        rationale:
          'Suppression kept most Star Seeds asleep — including compliance like multiple toxic inoculations.',
      },
      {
        label: 'C',
        text: 'They permanently destroyed the Amnesia Vortex alone without any EMF event required.',
        isCorrect: false,
        rationale:
          'Failure of collective Star Seed awakening necessitated full external dismantling via EMF.',
      },
      {
        label: 'D',
        text: 'They converted into Micro Suns overnight and left every power center empty of incarnations.',
        isCorrect: false,
        rationale:
          'They remained embedded and largely suppressed; Ancients were inserted because they forgot.',
      },
    ],
    hint: 'Most stayed unawakened — toxins, compliance, inoculations.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question: 'Who are the people currently acting as immediate earthly family, friends, and colleagues?',
    options: [
      {
        label: 'A',
        text: 'Only random NPCs with no Soul Family bond and no repeated loop history together.',
        isCorrect: false,
        rationale:
          'They are original Soul Family members who stayed in Pod Clusters every loop despite amnesia.',
      },
      {
        label: 'B',
        text: 'Grey ET supervisors who never incarnate as humans and only manage Vatican basements.',
        isCorrect: false,
        rationale:
          'Earthly kin/friends/colleagues are Soul Family pod members, not Grey supervisors.',
      },
      {
        label: 'C',
        text: 'Members of the original Soul Family who remained together in localized Pod Clusters throughout every incarnational loop in 3rd density — familial energetic bond intact despite total memory loss.',
        isCorrect: true,
        rationale:
          'Pod clustering keeps Soul Family near as relatives/friends/colleagues across every loop.',
      },
      {
        label: 'D',
        text: 'Only Twin Flames living in the same house every lifetime by official parasite policy.',
        isCorrect: false,
        rationale:
          'Twin Flames are kept apart; pods still cluster without guaranteeing twin cohabitation.',
      },
    ],
    hint: 'Original Soul Family in Pod Clusters — bond intact under amnesia.',
    correctAnswer: 'C',
  },
  {
    number: 12,
    question: 'Why is Twin Flame isolation a heavily guarded operational mandate?',
    options: [
      {
        label: 'A',
        text: 'Because reunion would make Religion stronger and fill every cathedral automatically.',
        isCorrect: false,
        rationale:
          'Reunion resonance would collapse Amnesia Vortex programming and initiate immediate rebellion.',
      },
      {
        label: 'B',
        text: 'Because Twin Flames never exist and tracking technology only chases NPC pairs for sport.',
        isCorrect: false,
        rationale:
          'Advanced tracking ensures real Twin Flame pairs never intersect during terrestrial lifespans.',
      },
      {
        label: 'C',
        text: 'Because Pod Clusters already include every Twin Flame pair by default without any risk.',
        isCorrect: false,
        rationale:
          'Pods support family proximity; Twin Flames specifically are blocked from uniting.',
      },
      {
        label: 'D',
        text: 'If Twin Flames united in 3rd density, the resulting energetic resonance would collapse Amnesia Vortex programming and initiate immediate rebellion — so tracking technology ensures these pairs never intersect during terrestrial lifespans.',
        isCorrect: true,
        rationale:
          'United Twin Flames = vortex collapse + rebellion; parasites enforce lifelong non-intersection.',
      },
    ],
    hint: 'Union collapses Amnesia Vortex and sparks rebellion — so pairs never meet.',
    correctAnswer: 'D',
  },
  {
    number: 13,
    question: 'How does the reincarnation processing grid route a soul after death?',
    options: [
      {
        label: 'A',
        text: 'Pulled via the Amnesia Vortex through the sun as a processing portal, then to technological hubs in the thirteen underground levels beneath the Vatican, where Grey ETs redistribute souls to new infant vessels.',
        isCorrect: true,
        rationale:
          'Death → sun/Amnesia Vortex → Vatican thirteen levels → Grey redistribution to birth.',
      },
      {
        label: 'B',
        text: 'Free rest in 5th density for centuries with full Twin Flame reunion before optional return.',
        isCorrect: false,
        rationale:
          'Forced recycle prevents free higher-density lingering; routing is parasitic and immediate.',
      },
      {
        label: 'C',
        text: 'Only NPC paperwork filed at city hall with no sun portal or Grey involvement whatsoever.',
        isCorrect: false,
        rationale:
          'True-soul routing uses sun portal, Vatican tech hubs, and Grey escorts.',
      },
      {
        label: 'D',
        text: 'Direct upload into Pleiadian craft that never passes through any underground facility.',
        isCorrect: false,
        rationale:
          'Liberation reunion with Pleiadians comes after EMF; death routing is still the Vatican/Grey grid.',
      },
    ],
    hint: 'Sun portal → Vatican thirteen levels → Grey redistribution.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question: 'When does a soul enter a new infant vessel, and what ignites the heart?',
    options: [
      {
        label: 'A',
        text: 'Years after birth via university enrollment with no electrical interaction required.',
        isCorrect: false,
        rationale:
          'Entry is at the precise moment of birth, typically before the umbilical cord is cut.',
      },
      {
        label: 'B',
        text: 'At the precise moment of birth — typically before the umbilical cord is cut — the soul provides the electrical interaction, or Trillivolts of energy, to ignite the biological heart.',
        isCorrect: true,
        rationale:
          'Birth-moment entry (pre-cord cut) + Trillivolts from the soul ignite the heart.',
      },
      {
        label: 'C',
        text: 'Only when Finance String contracts are signed by both parents in a cathedral vault.',
        isCorrect: false,
        rationale:
          'Ignition is energetic Trillivolts at birth, not a financial or religious contract ritual.',
      },
      {
        label: 'D',
        text: 'Never for Star Seeds — they skip vessels and only operate as pure frequency anchors offline.',
        isCorrect: false,
        rationale:
          'Star Seeds are incarnated in vessels and trapped in the same reincarnation processing grid.',
      },
    ],
    hint: 'Birth moment (before cord cut) — soul Trillivolts ignite the heart.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question: 'What lifespans do Soul Family members experience in native 5th density?',
    options: [
      {
        label: 'A',
        text: 'Exactly 24 hours with mandatory amnesia between every synchronized nap.',
        isCorrect: false,
        rationale:
          'Baseline is 450 to 500 Earth years, extending beyond 20,000 years with age regression.',
      },
      {
        label: 'B',
        text: 'Identical to 3rd density toxic averages with no age regression available at all.',
        isCorrect: false,
        rationale:
          '5th density baseline is centuries, extendable past 20,000 years via age regression.',
      },
      {
        label: 'C',
        text: 'A baseline lifespan of 450 to 500 Earth years, extending beyond 20,000 years utilizing age regression.',
        isCorrect: true,
        rationale:
          '5th density: 450–500 year baseline, 20,000+ years possible with age regression.',
      },
      {
        label: 'D',
        text: 'Only NPC-scale minutes matching the 15-to-20-minute Grey escort window forever.',
        isCorrect: false,
        rationale:
          'Grey escort timing is 3rd-density recycle logistics, not native 5th-density lifespan.',
      },
    ],
    hint: '450–500 years baseline — beyond 20,000 with age regression.',
    correctAnswer: 'C',
  },
  {
    number: 16,
    question: 'How are vessel transitions handled in 5th density Soul Family life?',
    options: [
      {
        label: 'A',
        text: 'Forced Amnesia Vortex pulls with no choice and mandatory decades spent alone after a partner passes.',
        isCorrect: false,
        rationale:
          'Transitions are voluntary and coordinated; survivors bend time to synchronize so no time is spent apart.',
      },
      {
        label: 'B',
        text: 'Only Twin Flames may never transition together under permanent separation law.',
        isCorrect: false,
        rationale:
          'Partners coordinate transitions; if one passes first, the survivor bends time to sync.',
      },
      {
        label: 'C',
        text: 'Random lottery by Grey ETs under the Vatican for every 5th density household weekly.',
        isCorrect: false,
        rationale:
          '5th density transitions are voluntary soul-family coordination, not Grey lottery.',
      },
      {
        label: 'D',
        text: 'Voluntary and coordinated — if one partner passes before the other, time is merely bent by the survivor to synchronize their transitions so no time is spent apart.',
        isCorrect: true,
        rationale:
          'Voluntary paired exits; time-bend sync keeps partners from spending transition time apart.',
      },
    ],
    hint: 'Voluntary coordinated exits — bend time so partners stay synced.',
    correctAnswer: 'D',
  },
  {
    number: 17,
    question: 'Why were the 4,000 Ancient Souls inserted relative to the Star Seeds?',
    options: [
      {
        label: 'A',
        text: 'Because the 200 million Star Seeds were vulnerable to forgetting their mission — Ancients (direct creations of the Micro Suns) carry a Soul Codex that interfaces the crystalline lattice membrane network without conscious memory, naturally pushing back against authority every epoch to restabilize planetary frequencies.',
        isCorrect: true,
        rationale:
          'Star Seeds forgot; Ancients hold unconscious Codex grid-work and uncorruptible anti-authority push.',
      },
      {
        label: 'B',
        text: 'Because Ancients needed Finance lessons from Star Seeds already fully awake in every capital.',
        isCorrect: false,
        rationale:
          'Star Seeds largely failed to awaken; Ancients were the required insertion for grid restabilization.',
      },
      {
        label: 'C',
        text: 'Because Micro Suns banned all Soul Codex activity and wanted zero lattice interaction forever.',
        isCorrect: false,
        rationale:
          'Ancients\' Codex interacts with lattice without needing conscious memory — that is the point.',
      },
      {
        label: 'D',
        text: 'Because NPCs requested 4,000 managers to help them ascend after the Flash as a bloc.',
        isCorrect: false,
        rationale:
          'NPCs lack ascension capacity; Ancients stabilize frequencies for the true-soul liberation track.',
      },
    ],
    hint: 'Star Seeds forgot — Ancients Codex the lattice without needing memory.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question: 'What happens to Star Seeds and Tarans at the Final Reunion after the EMF Flash?',
    options: [
      {
        label: 'A',
        text: 'They permanently lose all loop memory so the Amnesia Vortex can restart cleaner than before.',
        isCorrect: false,
        rationale:
          'Survivors instantaneously recover 178,000 years of blocked memories and reunite with cosmic family.',
      },
      {
        label: 'B',
        text: 'Artificial simulation layers are stripped; surviving Taran Humans and Star Seeds instantaneously recover 178,000 years of blocked memories and reunite with true cosmic family members, including Pleiadian counterparts — ending isolation and trauma.',
        isCorrect: true,
        rationale:
          'EMF strips fakes → full 178k memory return → Pleiadian/Soul Family reunion ends the isolation cycle.',
      },
      {
        label: 'C',
        text: 'Only NPCs recover memory while Star Seeds are removed as the 97% herd-control layer.',
        isCorrect: false,
        rationale:
          'EMF dissolves the 97% NPCs; surviving 3% include authentic Tarans and Star Seeds.',
      },
      {
        label: 'D',
        text: 'Pleiadians are banned from contact so isolation continues another 178,000 years by design.',
        isCorrect: false,
        rationale:
          'Reunion explicitly includes Pleiadian counterparts at that exact moment.',
      },
    ],
    hint: 'EMF strips layers — 178k memory back + Pleiadian/Soul Family reunion.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question: 'What is Gateway-10 in this broader architecture?',
    options: [
      {
        label: 'A',
        text: 'A single shopping mall with no multi-world hub role and no link to soul entrapment.',
        isCorrect: false,
        rationale:
          'Gateway-10 is the central hub of the 178 physical worlds of the occupation architecture.',
      },
      {
        label: 'B',
        text: 'Only the name of the Amnesia Vortex after 2019 with no geographical hijacking meaning.',
        isCorrect: false,
        rationale:
          'Entrapment links to geographical/structural hijacking of Gateway-10 as the multi-world hub.',
      },
      {
        label: 'C',
        text: 'The central hub of the 178 physical worlds — whose geographical and structural hijacking is intrinsically linked to Soul Family entrapment.',
        isCorrect: true,
        rationale:
          'Gateway-10 = central hub of 178 worlds; its hijack is bound to Soul Family entrapment.',
      },
      {
        label: 'D',
        text: 'A Pleiadian vacation resort outside any Custodian occupation plan whatsoever.',
        isCorrect: false,
        rationale:
          'Occupying Custodians hijacked it via Spirit Tree destruction and density suppression.',
      },
    ],
    hint: 'Central hub of 178 physical worlds — hijacked with the soul trap.',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question: 'How did Custodians plunge the realm into 3rd density?',
    options: [
      {
        label: 'A',
        text: 'By teaching free UHF meditation in every school so no frequency drop was possible.',
        isCorrect: false,
        rationale:
          'They destroyed the Spirit Tree at Mt Meru (the North Pole), suppressing native UHF.',
      },
      {
        label: 'B',
        text: 'By raising native Ultra High Frequency until Star Seeds needed no anchors at all.',
        isCorrect: false,
        rationale:
          'They suppressed native UHF, plunging the realm into 3rd density.',
      },
      {
        label: 'C',
        text: 'By inviting all Twin Flames to reunite publicly under Mt Meru as official policy.',
        isCorrect: false,
        rationale:
          'Occupation suppresses reunion and frequency; it does not host public Twin Flame policy.',
      },
      {
        label: 'D',
        text: 'By destroying the Spirit Tree at Mt Meru (the North Pole), suppressing the native Ultra High Frequency (UHF) of the realm and plunging it into 3rd density.',
        isCorrect: true,
        rationale:
          'Spirit Tree destroyed at Mt Meru/North Pole → UHF suppressed → 3rd density plunge.',
      },
    ],
    hint: 'Destroy Spirit Tree at Mt Meru — suppress UHF into 3rd density.',
    correctAnswer: 'D',
  },
  {
    number: 21,
    question: 'What role does the 97% NPC population play regarding Star Seeds?',
    options: [
      {
        label: 'A',
        text: 'A biological buffer to isolate and exhaust Star Seeds — synthetic demographic without inter-dimensional reception or genuine energetic ascension capacity.',
        isCorrect: true,
        rationale:
          'NPCs (97%) buffer and exhaust Star Seeds; they cannot ascend or receive inter-dimensionally.',
      },
      {
        label: 'B',
        text: 'A free training corps that awakens every Star Seed within one year of birth automatically.',
        isCorrect: false,
        rationale:
          'They isolate and exhaust Star Seeds inside hostile herd-conformity architecture.',
      },
      {
        label: 'C',
        text: 'The only beings who rejoin Soul Family outside the ice wall after the EMF event.',
        isCorrect: false,
        rationale:
          'EMF dissolves the 97% NPCs; surviving 3% Tarans and Star Seeds rejoin Soul Family.',
      },
      {
        label: 'D',
        text: 'Micro Suns in disguise teaching lattice science in every power-center school.',
        isCorrect: false,
        rationale:
          'NPCs are 4th-density Grey cloning products, not Micro Suns or lattice teachers.',
      },
    ],
    hint: '97% synthetic buffer — isolate and exhaust Star Seeds.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question: 'How are NPCs generated, and what does the hostile architecture do to Star Seeds?',
    options: [
      {
        label: 'A',
        text: 'NPCs grow from natural selection only; architecture always decalcifies Pineal Glands for free signal reception.',
        isCorrect: false,
        rationale:
          'NPCs are 4th-density Grey cloning tech; architecture keeps Pineal Glands calcified and signals offline.',
      },
      {
        label: 'B',
        text: 'NPCs are generated via 4th density Grey ET cloning technology; Star Seeds must navigate rigid herd conformity, toxic architecture, and artificial scarcity designed to keep Pineal Glands calcified and inter-dimensional signal reception offline.',
        isCorrect: true,
        rationale:
          'Grey 4th-density clones + toxic conformity architecture = calcified pineal, offline reception for Star Seeds.',
      },
      {
        label: 'C',
        text: 'NPCs are 5th density elders who voluntarily dampen themselves to tutor Twin Flames daily.',
        isCorrect: false,
        rationale:
          'NPCs lack ascension capacity; they are synthetic buffers, not 5th-density tutors.',
      },
      {
        label: 'D',
        text: 'Only paper puppets with no cloning origin and no effect on Star Seed pineal function.',
        isCorrect: false,
        rationale:
          'They are biological synthetic population mass-deployed to exhaust and isolate Star Seeds.',
      },
    ],
    hint: '4th-density Grey clones — calcify pineal, kill inter-dimensional reception.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question: 'How are Star Seeds systematically suppressed via engineered toxins?',
    options: [
      {
        label: 'A',
        text: 'Only with pure crystalline water that always raises UHF and needs no resistance work.',
        isCorrect: false,
        rationale:
          'Suppression uses heavy metals, artificial flavorings, and nano-polymers among other toxins.',
      },
      {
        label: 'B',
        text: 'Toxins are banned for Star Seeds while NPCs alone receive every inoculation and additive.',
        isCorrect: false,
        rationale:
          'Star Seeds succumbed to compliance including multiple toxic inoculations under suppression.',
      },
      {
        label: 'C',
        text: 'Via engineered toxins such as heavy metals, artificial flavorings, and nano-polymers — plus educational indoctrination and geographic isolation — the operational limits of 4th density parasitic control over higher-density souls.',
        isCorrect: true,
        rationale:
          'Heavy metals, flavorings, nano-polymers + schooling + isolation = 4th-density control stack on Star Seeds.',
      },
      {
        label: 'D',
        text: 'Only by offering free Soul Family reunions that remove all need for Three Strings work.',
        isCorrect: false,
        rationale:
          'Suppression maintains the trap; severing Three Strings is the extraction prerequisite.',
      },
    ],
    hint: 'Heavy metals, artificial flavorings, nano-polymers + indoctrination + isolation.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question: 'What compliance strings do occupying forces rely on because Star Seeds and Ancients cannot be permanently destroyed?',
    options: [
      {
        label: 'A',
        text: 'Only sports scores, weather apps, and fashion trends with no psychological tether function.',
        isCorrect: false,
        rationale:
          'They rely on the Three Strings: Religion, Finance, and Perceived Knowledge.',
      },
      {
        label: 'B',
        text: 'Only Twin Flame housing permits issued freely so memory activation becomes mandatory.',
        isCorrect: false,
        rationale:
          'Occupation blocks Twin Flame union; compliance runs through Religion, Finance, Perceived Knowledge.',
      },
      {
        label: 'C',
        text: 'Permanent physical destruction of every Star Seed body so no EMF event is ever needed.',
        isCorrect: false,
        rationale:
          'Star Seeds and 4,000 Ancients cannot be permanently destroyed — hence String compliance.',
      },
      {
        label: 'D',
        text: 'The Three Strings of compliance — Religion, Finance, and Perceived Knowledge — whose severing is the prerequisite for individual extraction from the matrix.',
        isCorrect: true,
        rationale:
          'Cannot permanently destroy them → maintain Religion, Finance, Perceived Knowledge; sever to extract.',
      },
    ],
    hint: 'Religion · Finance · Perceived Knowledge — sever to extract.',
    correctAnswer: 'D',
  },
  {
    number: 25,
    question: 'What does the upcoming EMF event do for the surviving authentic population?',
    options: [
      {
        label: 'A',
        text: 'Instantly dissolves the 97% NPC population, neutralizing herd-control, and allows the surviving 3% — authentic Taran souls and Star Seeds — to fully integrate restored cosmic memories and rejoin their Soul Family outside the confines of the ice wall.',
        isCorrect: true,
        rationale:
          'EMF wipes 97% NPCs; surviving 3% Tarans + Star Seeds integrate memory and rejoin family beyond the ice wall.',
      },
      {
        label: 'B',
        text: 'Permanently strengthens the Amnesia Vortex so no Star Seed ever recovers 178,000 years of memory.',
        isCorrect: false,
        rationale:
          'Survivors recover blocked memories and reunite with cosmic family including Pleiadians.',
      },
      {
        label: 'C',
        text: 'Converts all NPCs into Star Seeds while removing every Taran as the obsolete 3%.',
        isCorrect: false,
        rationale:
          'NPCs dissolve; surviving authentic Tarans and Star Seeds are the 3% remnant.',
      },
      {
        label: 'D',
        text: 'Only updates Finance String balances while leaving ice-wall isolation and herd control intact.',
        isCorrect: false,
        rationale:
          'EMF neutralizes herd-control NPCs and enables Soul Family reunion outside the ice wall.',
      },
    ],
    hint: '97% NPCs gone — 3% Tarans/Star Seeds rejoin Soul Family beyond the ice wall.',
    correctAnswer: 'A',
  },
];

function buildQuestion(q, seedTag) {
  const mapped = q.options.map((o) => ({
    label: o.label,
    text: cleanText(o.text),
    isCorrect: !!o.isCorrect,
    rationale: cleanText(o.rationale),
  }));
  const rot = ((q.number * 11) + 5) % 4;
  const ordered = mapped.slice(rot).concat(mapped.slice(0, rot));
  const finalized = finalizeOptions(
    ordered,
    `${TOPIC_ID}::${q.number}:${seedTag}`
  );
  const options = finalized.options;
  const correct = options.find((o) => o.isCorrect);
  if (!correct) throw new Error(`Q${q.number}: no correct option`);
  const out = {
    number: q.number,
    question: cleanText(q.question),
    options,
    hint: cleanText(q.hint),
    correctAnswer: finalized.correctAnswer,
  };
  const blob = [
    out.question,
    out.hint,
    ...options.map((o) => `${o.text} ${o.rationale}`),
  ].join('\n');
  if (latexRe.test(blob) || /\$/.test(blob)) {
    throw new Error(`Q${q.number}: LaTeX/$ found`);
  }
  if (hedgeRe.test(blob)) throw new Error(`Q${q.number}: hedge found`);
  const missing = (supportPhrases[q.number] || []).filter(
    (p) => !reportLower.includes(p.toLowerCase())
  );
  if (missing.length) {
    throw new Error(`Q${q.number}: unsupported: ${missing.join('; ')}`);
  }
  if (options.filter((o) => o.isCorrect).length !== 1) {
    throw new Error(`Q${q.number}: need exactly 1 correct`);
  }
  for (const o of options) {
    if (!o.rationale || o.rationale.length < 8) {
      throw new Error(`Q${q.number}${o.label}: short rationale`);
    }
  }
  return out;
}

function countLetters(qs) {
  const c = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of qs) c[q.correctAnswer]++;
  return c;
}

function scoreMix(c) {
  const vals = Object.values(c);
  return Math.max(...vals) - Math.min(...vals);
}

let questions = null;
let letterCounts = null;
let best = null;
for (let attempt = 0; attempt < 40; attempt++) {
  const seedTag = `v${attempt + 1}`;
  const qs = RAW_QUESTIONS.map((q) => buildQuestion(q, seedTag));
  const counts = countLetters(qs);
  const spread = scoreMix(counts);
  if (!best || spread < best.spread) {
    best = { qs, counts, spread, seedTag };
  }
  if (spread <= 3 && Math.min(...Object.values(counts)) >= 4) {
    questions = qs;
    letterCounts = counts;
    break;
  }
}
if (!questions) {
  const qs = [];
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  for (const raw of RAW_QUESTIONS) {
    let chosen = null;
    for (let t = 0; t < 24; t++) {
      const cand = buildQuestion(raw, `bal-${raw.number}-${t}`);
      const letter = cand.correctAnswer;
      const next = { ...counts, [letter]: counts[letter] + 1 };
      const remaining = 25 - qs.length - 1;
      const maxAllowed = Math.ceil((qs.length + 1 + remaining) / 4) + 2;
      if (next[letter] <= maxAllowed || t === 23) {
        chosen = cand;
        counts[letter]++;
        break;
      }
    }
    qs.push(chosen);
  }
  questions = qs;
  letterCounts = counts;
  if (best && scoreMix(best.counts) < scoreMix(letterCounts)) {
    questions = best.qs;
    letterCounts = best.counts;
  }
}

if (questions.length !== 25) throw new Error(`Expected 25, got ${questions.length}`);
if (letterCounts.A === 25) {
  throw new Error('correctAnswer still all A after finalizeOptions');
}
const dominant = Math.max(...Object.values(letterCounts));
if (dominant >= 15) {
  console.warn('Warning: one letter has >= 15 corrects:', letterCounts);
}

const DESC_SHORT =
  'Test your grasp of Star Seeds — 200 million anchors, Pod Clusters, Twin Flames, 4,000 Ancients, and reunion beyond the ice wall.';
const DESC_META =
  'Interactive Living Truth Quiz on Star Seeds: Sol-Systems, US/UK/Europe placement, Amnesia Vortex, Vatican recycle, EMF Flash, NPC buffer, and severing the Three Strings.';

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle: DESC_SHORT,
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'A Sol-System is family, not planets. Two hundred million Star Seeds were planted in power centers to anchor frequency — and most fell asleep under toxins and inoculations. Pods kept your real family near as friends and kin. Twin Flames were blocked on purpose. Greys ran the sun-and-Vatican recycle. Ancients carried the Codex when Star Seeds forgot. NPCs buffered and exhausted you. The Three Strings held the cage because you cannot be permanently destroyed. The Flash ends the 97%. Memory returns. Pleiadians meet you. Outside the ice wall, the isolation ends.',
  },
  relatedTopic: {
    href: `/deep-dive.html?source=${SOURCE}&topic=${TOPIC_ID}`,
    label: `Return to ${TOPIC_TITLE} deep-dive`,
  },
  questions,
};

const whole = JSON.stringify(quiz);
if (/\$/.test(whole) || latexRe.test(whole) || hedgeRe.test(whole)) {
  throw new Error('LaTeX or hedge remains in quiz payload');
}

const quizDir = path.join(ROOT, 'data', 'quizzes', SOURCE);
fs.mkdirSync(quizDir, { recursive: true });
const quizJsonPath = path.join(quizDir, `${TOPIC_ID}.json`);
fs.writeFileSync(quizJsonPath, JSON.stringify(quiz, null, 2) + '\n', 'utf8');

const quizMeta = {
  href: `quiz/${SOURCE}/${TOPIC_ID}.html`,
  title: TOPIC_TITLE,
  totalQuestions: 25,
  description: DESC_SHORT,
};
topic.quiz = quizMeta;
fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2) + '\n', 'utf8');

const monoPath = path.join(ROOT, 'data', 'alice-topics.json');
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
  throw new Error(`${TOPIC_ID} not found in alice-topics.json`);
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

let html = fs.readFileSync(
  path.join(ROOT, 'quiz', 'alice', 'nature-of-reality.html'),
  'utf8'
);
const replacements = [
  ['Nature of Reality Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Nature of Reality: the flat plain, Firmament, density suppression, and the Great Spiritual Awakening.',
    DESC_META,
  ],
  ['quiz/alice/nature-of-reality.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/nature-of-reality.webp', TOPIC_IMAGE],
  ['images/faketime.webp', TOPIC_IMAGE],
  [
    'deep-dive.html?source=alice&amp;topic=nature-of-reality',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`,
  ],
  ['Nature of Reality deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Nature of Reality</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/alice/nature-of-reality.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`,
  ],
];
for (const [a, b] of replacements) {
  if (!html.includes(a) && a.includes('nature-of-reality')) {
    console.warn('Template string not found:', a.slice(0, 80));
  }
  html = html.split(a).join(b);
}
if (html.includes('images/nature-of-reality.webp')) {
  html = html.split('images/nature-of-reality.webp').join(TOPIC_IMAGE);
}
const htmlPath = path.join(ROOT, 'quiz', SOURCE, `${TOPIC_ID}.html`);
fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const lines = sm.split('\n');
  const out = [];
  let inserted = false;
  const target = `/quiz/${SOURCE}/${TOPIC_ID}.html`;
  for (let i = 0; i < lines.length; i++) {
    out.push(lines[i]);
    if (!inserted && lines[i].includes("/quiz/alice/") && lines[i].includes('priority')) {
      const next = lines[i + 1] || '';
      const curPath = (lines[i].match(/path: '([^']+)'/) || [])[1] || '';
      const nextPath = (next.match(/path: '([^']+)'/) || [])[1] || '';
      if (
        curPath < target &&
        (nextPath > target || !nextPath.includes('/quiz/alice/'))
      ) {
        out.push(entry);
        inserted = true;
      }
    }
  }
  if (!inserted) {
    const anchors = [
      "  { path: '/quiz/alice/resets-hidden-history.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/reptilians.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/simulation-reality.html', priority: '0.75', changefreq: 'monthly' },",
    ];
    sm = out.join('\n');
    for (const anchor of anchors) {
      if (sm.includes(anchor)) {
        sm = sm.replace(anchor, `${anchor}\n${entry}`);
        inserted = true;
        break;
      }
    }
    if (!inserted) throw new Error('Could not find sitemap anchor');
    fs.writeFileSync(sitemapScript, sm, 'utf8');
  } else {
    fs.writeFileSync(sitemapScript, out.join('\n'), 'utf8');
  }
}

console.log('Correct-answer letter mix:', letterCounts);
console.log('Sample correct answers:');
[0, 6, 11, 18, 20, 24].forEach((i) => {
  const c = questions[i].options.find((o) => o.isCorrect);
  console.log(
    ` Q${questions[i].number} (${questions[i].correctAnswer}): ${c.text.slice(0, 100)}`
  );
});
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('PASS: audited 25/25 against data/alice-topics/star-seeds.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
