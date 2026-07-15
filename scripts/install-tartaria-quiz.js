/**
 * Installs Tartaria quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/tartaria.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-tartaria-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'tartaria';
const TOPIC_TITLE = 'Tartaria';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/tartaria.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['great tartary', 'fabrications', 're-set', 'seventh'],
  2: ['dark ages', 'industrial revolution', 'free-energy'],
  3: ['east tartary', 'west tartary', 'china', 'worldwide'],
  4: ['thousand years', 'loosh', 'adrenochrome', 'cloned'],
  5: ['oopa', 'artefacts', 'museum', 'predate'],
  6: ['density suppression', 'crystalline temples', '9th-density'],
  7: ['nodes', 'ley lines', 'lattice membrane'],
  8: ['tuning forks', 'harmonic', 'weightless', 'stone'],
  9: ['lunatic asylums', '5,000-bed', 'loosh batteries'],
  10: ['atmospheric condensers', 'ley lines', 'coal'],
  11: ['mud-floods', 'soil liquefaction', 'dustification'],
  12: ['gulliver', 'documentaries', 'plain sight'],
  13: ['1860', '1900', 'world war 1', '15 to 22 million'],
  14: ['giant', 'smithsonian', '10,000', 'freemasons'],
  15: ['carnegie', 'libraries', 'fabricated'],
  16: ['tuning forks', 'andesite', 'granite', 'putty'],
  17: ['titanic', 'crystal', 'tuning fork'],
  18: ['leedskalnin', '1,100 tons', 'limestone'],
  19: ['fibonacci', 'golden ratio', 'copper', 'domes'],
  20: ['1887', 'atmospheric', '60%', 'coal'],
  21: ['london underground', 'pneumatic', 'air pressure'],
  22: ['freemasons', 'alter', 'baphomet', 'density suppression'],
  23: ['orphan trains', 'd.u.m.b', 'stem cells', 'clones'],
  24: ['flat plane', 'firmament', '97%', 'npc', 'east tartary'],
  25: ['8th re-set', '15-minute cities', 'religion', 'finance', 'perceived knowledge'],
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
    question:
      'What was Great Tartary, and how did its end actually occur?',
    options: [
      {
        label: 'A',
        text: 'A small fishing village that faded slowly through natural economic decline with no Re-set and no global reach.',
        isCorrect: false,
        rationale:
          'Great Tartary was a globally distributed advanced civilization terminated by a pre-planned Re-set, not slow natural decline.',
      },
      {
        label: 'B',
        text: 'A globally distributed, highly advanced civilization of aesthetic and technological excellence that was abruptly terminated by a pre-planned Re-set — synchronized planet-wide extermination and repopulation — not a natural collapse. The plane is in the seventh Re-set with the eighth positioned to trigger.',
        isCorrect: true,
        rationale:
          'Tartaria was world-scale excellence wiped by a planned Re-set; we sit in the 7th cycle toward an 8th.',
      },
      {
        label: 'C',
        text: 'A future project that never existed, invented only by modern internet forums last decade.',
        isCorrect: false,
        rationale:
          'Great Tartary existed as a real worldwide civilization erased from modern records by victors.',
      },
      {
        label: 'D',
        text: 'A Freemason brand for coal companies with no free-energy infrastructure and no civilizational architecture.',
        isCorrect: false,
        rationale:
          'It was aesthetic and free-energy excellence later dismantled and hidden by parasitic proxies.',
      },
    ],
    hint: 'Global advanced civilization — pre-planned Re-set — seventh cycle now.',
    correctAnswer: 'B',
  },
  {
    number: 2,
    question:
      'What roles did the Dark Ages narrative and the Industrial Revolution play relative to Tartaria?',
    options: [
      {
        label: 'A',
        text: 'They openly celebrated Tartarian free energy and published full continuous timelines in every school.',
        isCorrect: false,
        rationale:
          'Dark Ages overwrote Tartaria\'s timeline; Industrial Revolution dismantled inherited free-energy tech.',
      },
      {
        label: 'B',
        text: 'They had no connection to Tartaria and only concerned fashion trends in hats and coats.',
        isCorrect: false,
        rationale:
          'Both were calculated historical covers for erasure and technological downgrade of Tartaria.',
      },
      {
        label: 'C',
        text: 'The Dark Ages narrative was invented specifically to overwrite the timeline of Tartaria, while the Industrial Revolution was the calculated dismantling and downgrading of inherited Tartarian free-energy technology.',
        isCorrect: true,
        rationale:
          'Dark Ages = timeline overwrite; Industrial Revolution = free-energy downgrade cover story.',
      },
      {
        label: 'D',
        text: 'They restored every Tartarian resonator dome and taught harmonic stone craft as core curriculum.',
        isCorrect: false,
        rationale:
          'They buried Tartarian excellence under false progress and dark-age myth.',
      },
    ],
    hint: 'Dark Ages overwrite timeline — Industrial Revolution downgrades free energy.',
    correctAnswer: 'C',
  },
  {
    number: 3,
    question: 'How was Great Tartary historically divided geographically?',
    options: [
      {
        label: 'A',
        text: 'Only into North and South poles with no East/West civilizational split at all.',
        isCorrect: false,
        rationale:
          'It was divided into East Tartary (modern China) and West Tartary (the rest of the world).',
      },
      {
        label: 'B',
        text: 'It had no geographic divisions and never spanned worldwide infrastructure or culture.',
        isCorrect: false,
        rationale:
          'Great Tartary was worldwide, historically split East (China) and West (rest of world).',
      },
      {
        label: 'C',
        text: 'Only into city blocks of one capital with no continental or regional naming structure.',
        isCorrect: false,
        rationale:
          'Historical division is East Tartary as modern China and West Tartary as the rest of the world.',
      },
      {
        label: 'D',
        text: 'Into East Tartary (modern China) and West Tartary (the rest of the world) — a worldwide civilization of aesthetic excellence and free-energy infrastructure erased from modern records.',
        isCorrect: true,
        rationale:
          'East Tartary = modern China; West Tartary = rest of world; records erased after Re-set.',
      },
    ],
    hint: 'East Tartary = China; West Tartary = rest of world.',
    correctAnswer: 'D',
  },
  {
    number: 4,
    question: 'What are Re-sets in the Tartarian suppression cycle?',
    options: [
      {
        label: 'A',
        text: 'Orchestrated cyclical termination events about every thousand years — population tortured, harvested for Loosh and Adrenochrome, and exterminated, then the realm repopulated with cloned entities.',
        isCorrect: true,
        rationale:
          'Re-sets = ~1000-year planned cull, energy harvest, wipe, and clone repopulation.',
      },
      {
        label: 'B',
        text: 'Peaceful festivals held annually to celebrate free energy with no torture or cloning involved.',
        isCorrect: false,
        rationale:
          'They are violent harvest and extermination cycles followed by synthetic repopulation.',
      },
      {
        label: 'C',
        text: 'Only weather seasons that never touch population memory, Loosh, or architecture inheritance.',
        isCorrect: false,
        rationale:
          'Re-sets terminate civilizations and harvest Loosh/Adrenochrome before clone repopulation.',
      },
      {
        label: 'D',
        text: 'Random accidents with no orchestration and no thousand-year planning by parasitic forces.',
        isCorrect: false,
        rationale:
          'They are orchestrated cyclical events on roughly thousand-year intervals.',
      },
    ],
    hint: 'Every ~1000 years — torture, Loosh/Adrenochrome, exterminate, clone repopulate.',
    correctAnswer: 'A',
  },
  {
    number: 5,
    question: 'What are Oopa\'s (Out Of Place Artefacts)?',
    options: [
      {
        label: 'A',
        text: 'Digital memes invented last week with no physical relics and no challenge to mainstream history.',
        isCorrect: false,
        rationale:
          'OOPAs are blatant physical evidence of high-tech civilizations that predate the current Re-set.',
      },
      {
        label: 'B',
        text: 'Blatant physical evidence of high-technological civilizations that predate the current Re-set, deliberately relegated to museum basements to maintain the false historical narrative.',
        isCorrect: true,
        rationale:
          'Out-of-place artefacts prove pre-Reset high tech and are buried in museum basements on purpose.',
      },
      {
        label: 'C',
        text: 'Fully explained school props that support Darwin charts and never contradict Freemason timelines.',
        isCorrect: false,
        rationale:
          'They contradict the false historical narrative and are kept out of public sight.',
      },
      {
        label: 'D',
        text: 'Only weather balloons with no technological content and no pre-Reset civilizational origin.',
        isCorrect: false,
        rationale:
          'They are high-technological relics from civilizations before the current Re-set.',
      },
    ],
    hint: 'Pre-Reset high-tech physical evidence — museum basements hide them.',
    correctAnswer: 'B',
  },
  {
    number: 6,
    question: 'What is Density Suppression used for regarding Tartarian-era sacred architecture?',
    options: [
      {
        label: 'A',
        text: 'Raising every region to 12th density so all tourists see Crystalline Temples without effort.',
        isCorrect: false,
        rationale:
          'It artificially lowers vibrational frequency so 9th-density Crystalline Temples become invisible to 3rd-density awareness.',
      },
      {
        label: 'B',
        text: 'Only painting walls grey with no effect on frequency, temples, or 3rd-density perception.',
        isCorrect: false,
        rationale:
          'It is technological frequency lowering that hides higher-density structures from ordinary sight.',
      },
      {
        label: 'C',
        text: 'A technological process that artificially lowers the vibrational frequency of a geographical area, rendering higher-density structures such as 9th-density Crystalline Temples invisible to beings in 3rd-density awareness.',
        isCorrect: true,
        rationale:
          'Density Suppression hides 9th-density temples from 3rd-density eyes by dropping local frequency.',
      },
      {
        label: 'D',
        text: 'A G.A.A. healing program that permanently reveals every temple and ends all parasitic hiding.',
        isCorrect: false,
        rationale:
          'Parasitic forces use it to hide temples, not liberate sight of them.',
      },
    ],
    hint: 'Lower frequency — hide 9th-density Crystalline Temples from 3rd-density sight.',
    correctAnswer: 'C',
  },
  {
    number: 7,
    question: 'What are Nodes and Ley Lines in Tartarian free-energy infrastructure?',
    options: [
      {
        label: 'A',
        text: 'Only street names invented in 1950 with no energetic junctions and no crystalline pathways.',
        isCorrect: false,
        rationale:
          'Nodes are energetic junction points; Ley Lines are the crystalline electromagnetic lattice connecting them.',
      },
      {
        label: 'B',
        text: 'Nodes are subway ticket booths; Ley Lines are train schedules with no power infrastructure role.',
        isCorrect: false,
        rationale:
          'Nodes host Crystalline Temples; Ley Lines powered free-energy infrastructure historically.',
      },
      {
        label: 'C',
        text: 'Only oceanic currents with no temple weaving and no lattice membrane network across the realm.',
        isCorrect: false,
        rationale:
          'They are planetary surface junctions and crystalline EM pathways for free-energy power.',
      },
      {
        label: 'D',
        text: 'Nodes are naturally occurring highly energetic junction points where Crystalline Temples were woven to amplify positive planetary frequencies; Ley Lines are the Lattice Membrane Network of crystalline electromagnetic pathways connecting all Nodes and historically powering free-energy infrastructure.',
        isCorrect: true,
        rationale:
          'Nodes amplify via temples; Ley Line lattice fed Tartarian free-energy systems.',
      },
    ],
    hint: 'Nodes = energy junctions/temples; Ley Lines = crystalline EM power lattice.',
    correctAnswer: 'D',
  },
  {
    number: 8,
    question: 'What are Tuning Forks in old-world Tartarian construction?',
    options: [
      {
        label: 'A',
        text: 'Highly advanced old-world technology using harmonic frequencies and intention to render heavy stone weightless and malleable for architectural construction.',
        isCorrect: true,
        rationale:
          'Tuning Forks + intention make stone weightless and malleable for harmonic architecture.',
      },
      {
        label: 'B',
        text: 'Only dinner utensils for table manners with no frequency role and no stone-craft function.',
        isCorrect: false,
        rationale:
          'They are construction tech for harmonic frequency architecture, not cutlery.',
      },
      {
        label: 'C',
        text: 'Modern electric drills that never use intention and never alter stone vibrational state.',
        isCorrect: false,
        rationale:
          'Old-world forks use harmonic frequencies and intention on heavy stone materials.',
      },
      {
        label: 'D',
        text: 'Pure metaphors in poetry with no physical devices used on andesite or granite ever.',
        isCorrect: false,
        rationale:
          'They are real devices used to turn stone temporarily to putty for building.',
      },
    ],
    hint: 'Harmonic frequencies + intention — stone weightless and malleable.',
    correctAnswer: 'A',
  },
  {
    number: 9,
    question: 'What were Lunatic Asylums after a Re-set?',
    options: [
      {
        label: 'A',
        text: 'Gentle spas that restored full old-world memory and taught free-energy craft to all survivors.',
        isCorrect: false,
        rationale:
          'They housed shell-shocked survivors as 5,000-bed Loosh batteries for demonic entities.',
      },
      {
        label: 'B',
        text: 'Massive structures housing shell-shocked human survivors who witnessed the exterminations, functioning primarily as 5,000-bed Loosh batteries to feed demonic entities.',
        isCorrect: true,
        rationale:
          'Post-Reset asylums = residual Loosh farms on traumatized witnesses between harvest cycles.',
      },
      {
        label: 'C',
        text: 'Empty ruins never used for population management or energetic harvest after any Re-set.',
        isCorrect: false,
        rationale:
          'They were prepared and used as massive Loosh batteries after exterminations.',
      },
      {
        label: 'D',
        text: 'Only libraries funded by Carnegie with no Loosh function and no survivor containment role.',
        isCorrect: false,
        rationale:
          'Asylums specifically managed survivors as demonic Loosh supply; libraries were a separate lie tool.',
      },
    ],
    hint: 'Shell-shocked survivors — 5,000-bed Loosh batteries for Demons.',
    correctAnswer: 'B',
  },
  {
    number: 10,
    question: 'What were Atmospheric Condensers on Tartarian steam locomotives?',
    options: [
      {
        label: 'A',
        text: 'Decorative chimneys that only looked copper and never interacted with Ley Lines or water heat.',
        isCorrect: false,
        rationale:
          'They were electromagnetic resonators harvesting ambient Ley Line energy to superheat water without coal.',
      },
      {
        label: 'B',
        text: 'Coal shovels redesigned for heavier fuel loads with no free-energy or inductance function.',
        isCorrect: false,
        rationale:
          'Condensers were designed to eliminate coal need by harvesting ambient Ley Line energy.',
      },
      {
        label: 'C',
        text: 'Tartarian electromagnetic resonators affixed to steam locomotives, designed to harvest ambient energy from Ley Lines to superheat water without the use of coal.',
        isCorrect: true,
        rationale:
          'Atmospheric Condensers = Ley Line energy harvest for coal-free locomotive heating.',
      },
      {
        label: 'D',
        text: 'Only rain collectors for drinking water with no electromagnetic or free-energy architecture.',
        isCorrect: false,
        rationale:
          'They are electromagnetic resonators for ambient energy harvest into boiler systems.',
      },
    ],
    hint: 'Electromagnetic resonators — Ley Line harvest — superheat without coal.',
    correctAnswer: 'C',
  },
  {
    number: 11,
    question:
      'How was Tartarian infrastructure buried, and what modern atrocity mirrors that weapon physics?',
    options: [
      {
        label: 'A',
        text: 'Only gentle sandstorms with no ET weapons and no molecular cohesion alteration involved.',
        isCorrect: false,
        rationale:
          'Burial used soil liquefaction (Mud-floods) via advanced ET energy weapons altering molecular cohesion.',
      },
      {
        label: 'B',
        text: 'Only voluntary museum donation of every building with no liquefaction and no dustification parallel.',
        isCorrect: false,
        rationale:
          'Mud-floods from ET weapons buried infrastructure; physics matches World Trade Center dustification.',
      },
      {
        label: 'C',
        text: 'Only paper decrees that never moved soil or destroyed free-energy structures physically.',
        isCorrect: false,
        rationale:
          'Physical soil liquefaction buried Tartarian infrastructure at planetary scale.',
      },
      {
        label: 'D',
        text: 'Via soil liquefaction (Mud-floods) using highly advanced ET energy weapons that alter molecular and subatomic cohesion — functioning identically to Dustification technology deployed during the World Trade Center atrocity.',
        isCorrect: true,
        rationale:
          'Mud-flood liquefaction = ET molecular weapons; same class as WTC dustification tech.',
      },
    ],
    hint: 'Mud-floods / soil liquefaction — ET weapons — same class as WTC dustification.',
    correctAnswer: 'D',
  },
  {
    number: 12,
    question:
      'How do certain cultural artifacts like Gulliver\'s Travels relate to Tartaria?',
    options: [
      {
        label: 'A',
        text: 'They are pure fiction with zero documentary value about Tartaria or giant-scale old-world reality.',
        isCorrect: false,
        rationale:
          'Artifacts such as Gulliver\'s Travels serve as literal documentaries of Tartaria hidden in plain sight.',
      },
      {
        label: 'B',
        text: 'They serve as literal documentaries of Tartaria hidden in plain sight within cultural storytelling.',
        isCorrect: true,
        rationale:
          'Gulliver\'s Travels and similar works encode Tartarian reality as "fiction" in plain sight.',
      },
      {
        label: 'C',
        text: 'They were written only after 2000 and contain no old-world geographic or scale information.',
        isCorrect: false,
        rationale:
          'They function as hidden-in-plain-sight documentaries of Tartarian civilization.',
      },
      {
        label: 'D',
        text: 'They only teach modern banking and never touch architecture, giants, or Re-set memory.',
        isCorrect: false,
        rationale:
          'Their role is encoding Tartarian documentary truth under the cover of literature.',
      },
    ],
    hint: 'Gulliver\'s Travels = Tartaria documentary hidden in plain sight.',
    correctAnswer: 'B',
  },
  {
    number: 13,
    question:
      'When did the most recent Re-set end, and how did World War 1 finish the memory purge?',
    options: [
      {
        label: 'A',
        text: 'It ended in 1200 AD everywhere, and WW1 only trained herbalists with no memory eradication goal.',
        isCorrect: false,
        rationale:
          'Most recent Re-set ended America ~1860s and UK ~1900; WW1 killed memory holders of the old world.',
      },
      {
        label: 'B',
        text: 'It never ended; Re-sets are still continuous every month with no WW1 demographic targeting.',
        isCorrect: false,
        rationale:
          'Last Re-set concluded regionally in 1860s/1900; WW1 then culled ages with old-world knowledge.',
      },
      {
        label: 'C',
        text: 'Most recent Re-set ended in America around the 1860s and in the UK around 1900; WW1 was orchestrated to eradicate 15 to 22 million fighting-age people who knew the true shape of the Earth, Tartarian reality, and effective natural herbal medicine.',
        isCorrect: true,
        rationale:
          'Post-Reset timeline: 1860s/1900 end → WW1 slaughter of 15–22 million old-world memory holders.',
      },
      {
        label: 'D',
        text: 'It ended last Tuesday only in one city, and WW1 restored Tartarian free energy in every school.',
        isCorrect: false,
        rationale:
          'Regional 1860s/1900 endings and WW1 memory purge are the stated post-Tartaria cleanup.',
      },
    ],
    hint: 'America ~1860s, UK ~1900 — WW1 kills 15–22 million memory holders.',
    correctAnswer: 'C',
  },
  {
    number: 14,
    question:
      'What happened to Giant skeletons found during American railroad expansion?',
    options: [
      {
        label: 'A',
        text: 'They were displayed in every town square as official proof of Tartarian giant lineages forever.',
        isCorrect: false,
        rationale:
          'Over 10,000 remains were confiscated by the Smithsonian Freemason "Vatican of Archaeology."',
      },
      {
        label: 'B',
        text: 'No giants were found; crews only unearthed modern tools from 1950 factories exclusively.',
        isCorrect: false,
        rationale:
          'Burial mounds held over 10,000 Giant skeletons from 12 feet to over 35 meters tall.',
      },
      {
        label: 'C',
        text: 'The Smithsonian published full open catalogs so schools would teach giant history accurately.',
        isCorrect: false,
        rationale:
          'Smithsonian was founded by Freemasons to hide evidence contradicting the imposed timeline.',
      },
      {
        label: 'D',
        text: 'Railroad expansion uncovered burial mounds with over 10,000 Giant skeletons (12 feet to over 35 meters); remains were immediately confiscated by the Smithsonian Institution — Freemason-founded as the "Vatican of Archaeology" to hide timeline-contradicting evidence.',
        isCorrect: true,
        rationale:
          'Giants unearthed → Smithsonian vault as Freemason archaeological Vatican of suppression.',
      },
    ],
    hint: '10,000+ giants — Smithsonian Freemason "Vatican of Archaeology."',
    correctAnswer: 'D',
  },
  {
    number: 15,
    question:
      'What role did Andrew Carnegie\'s libraries play after the Re-set?',
    options: [
      {
        label: 'A',
        text: 'Industrial magnates like Andrew Carnegie funded thousands of libraries to rapidly disseminate the newly fabricated false historical narrative to the public.',
        isCorrect: true,
        rationale:
          'Carnegie libraries mass-distributed the new fake history after Tartarian erasure.',
      },
      {
        label: 'B',
        text: 'They only stored Tuning Fork manuals so every citizen could rebuild Tartarian free energy freely.',
        isCorrect: false,
        rationale:
          'Libraries spread fabricated history, not old-world free-energy reconstruction manuals.',
      },
      {
        label: 'C',
        text: 'They refused all Freemason timelines and taught Mud-flood physics as required curriculum.',
        isCorrect: false,
        rationale:
          'They rapidly disseminated the newly fabricated false historical narrative.',
      },
      {
        label: 'D',
        text: 'Carnegie built no libraries and never participated in any post-Reset narrative campaign.',
        isCorrect: false,
        rationale:
          'He funded thousands of libraries specifically to push the false history package.',
      },
    ],
    hint: 'Carnegie libraries — mass-distribute fabricated history after Re-set.',
    correctAnswer: 'A',
  },
  {
    number: 16,
    question:
      'How were Tartarian edifices actually sculpted, if not by labor and chisels?',
    options: [
      {
        label: 'A',
        text: 'Only by slave gangs with iron chisels and zero harmonic frequency or intention involved.',
        isCorrect: false,
        rationale:
          'They were sculpted using harmonic tonal frequency architecture with tuning forks and intent.',
      },
      {
        label: 'B',
        text: 'Using harmonic tonal frequency architecture — advanced tuning forks and sustained intent altered vibrational state of andesite and granite, temporarily turning stone to putty imprinted with a vibrational mold and circumventing weight limitations.',
        isCorrect: true,
        rationale:
          'Tuning forks + intent → stone to putty → vibrational mold; no brute-force chisel paradigm.',
      },
      {
        label: 'C',
        text: 'Only by 3D plastic printers invented in 2010 with no granite, andesite, or old-world forks.',
        isCorrect: false,
        rationale:
          'Old-world harmonic methods worked andesite and granite via frequency, not modern plastics.',
      },
      {
        label: 'D',
        text: 'Buildings appeared fully formed from dreams with no material process and no forks at all.',
        isCorrect: false,
        rationale:
          'Process is concrete: forks, intent, putty-state stone, vibrational mold imprint.',
      },
    ],
    hint: 'Harmonic tonal architecture — forks + intent — stone to putty mold.',
    correctAnswer: 'B',
  },
  {
    number: 17,
    question:
      'Why was the Titanic intentionally sunk relative to Tartarian tech?',
    options: [
      {
        label: 'A',
        text: 'Only as a navigation drill with no crystal, no tuning fork, and no tech-destruction agenda.',
        isCorrect: false,
        rationale:
          'It was sunk partly to destroy a highly energetic Tartarian crystal and a remaining tuning fork.',
      },
      {
        label: 'B',
        text: 'To deliver free Tuning Forks to every school so megalithic harmonic craft would spread worldwide.',
        isCorrect: false,
        rationale:
          'Purpose included destroying Tartarian crystal and tuning fork tech, not distributing it.',
      },
      {
        label: 'C',
        text: 'Partly to destroy a highly energetic Tartarian crystal and one of the remaining tuning forks used in harmonic stone architecture.',
        isCorrect: true,
        rationale:
          'Titanic sacrifice targeted remaining Tartarian crystal and tuning-fork construction tech.',
      },
      {
        label: 'D',
        text: 'Because ice was rare and the event was pure weather with no parasitic orchestration involved.',
        isCorrect: false,
        rationale:
          'Sinking was intentional orchestration aimed at destroying old-world energetic devices.',
      },
    ],
    hint: 'Destroy Tartarian crystal and remaining tuning fork tech.',
    correctAnswer: 'C',
  },
  {
    number: 18,
    question:
      'How did a fragment of operational old-world knowledge survive through Edward Leedskalnin?',
    options: [
      {
        label: 'A',
        text: 'He only wrote novels and never moved stone or used magnetic arrangements of any kind.',
        isCorrect: false,
        rationale:
          'He single-handedly carved and moved 1,100 tons of limestone using old-world magnetic methods.',
      },
      {
        label: 'B',
        text: 'He used modern diesel cranes exclusively with no copper wire, glass bottles, or magnetic arrangements.',
        isCorrect: false,
        rationale:
          'Method used old-world magnetic arrangements, copper wire, and glass bottles.',
      },
      {
        label: 'C',
        text: 'He never built any monument and denied all connection to Tartarian construction physics.',
        isCorrect: false,
        rationale:
          'He built a monument by moving 1,100 tons of limestone via surviving old-world methods.',
      },
      {
        label: 'D',
        text: 'He single-handedly carved and moved 1,100 tons of limestone to build his monument utilizing old-world magnetic arrangements, copper wire, and glass bottles.',
        isCorrect: true,
        rationale:
          'Leedskalnin preserved operational harmonic/magnetic stone craft outside full Tartarian wipe.',
      },
    ],
    hint: 'Leedskalnin — 1,100 tons limestone — magnetic arrangements, copper, glass.',
    correctAnswer: 'D',
  },
  {
    number: 19,
    question:
      'How did Tartarian buildings extract power from the ether via domes?',
    options: [
      {
        label: 'A',
        text: 'Domes on government buildings and churches housed carefully woven copper wires pulled tightly in Fibonacci-series and Golden Ratio patterns to act as resonators drawing power from the ether.',
        isCorrect: true,
        rationale:
          'Dome resonators = Fibonacci/Golden Ratio copper weaves for etheric free-energy extraction.',
      },
      {
        label: 'B',
        text: 'Domes only blocked rain and never contained copper patterns or free-energy resonator function.',
        isCorrect: false,
        rationale:
          'Romanesque/Colonial domes housed copper Fibonacci/Golden Ratio resonators for ether power.',
      },
      {
        label: 'C',
        text: 'Domes stored coal only and forbade any copper wire or harmonic geometric layout inside.',
        isCorrect: false,
        rationale:
          'Power came from ether via geometric copper resonators, not coal storage in domes.',
      },
      {
        label: 'D',
        text: 'Only modern solar panels on flat roofs with no Fibonacci geometry and no ether extraction.',
        isCorrect: false,
        rationale:
          'Tartarian method used dome copper resonators in sacred-ratio patterns, not photovoltaic panels.',
      },
    ],
    hint: 'Dome copper resonators — Fibonacci and Golden Ratio — ether power.',
    correctAnswer: 'A',
  },
  {
    number: 20,
    question:
      'How did Atmospheric Augmentation Systems improve trains, and what happened in 1887?',
    options: [
      {
        label: 'A',
        text: 'They reduced performance by half and coal magnates funded installing more of them everywhere.',
        isCorrect: false,
        rationale:
          'They increased performance by 60% and negated coal need; 1887 coal order removed and smelted them.',
      },
      {
        label: 'B',
        text: 'Trains captured Electromagnetic Induction from Ley Lines matching physical tracks via Atmospheric Augmentation Systems, increasing performance by 60% and negating coal need; in 1887 coal magnates ordered condensers removed and smelted to enforce fossil-fuel dependency.',
        isCorrect: true,
        rationale:
          'Ley Line inductance +60% performance; 1887 coal sabotage melted condensers to lock fuel slavery.',
      },
      {
        label: 'C',
        text: 'Systems never worked on tracks and 1887 only renamed companies without destroying hardware.',
        isCorrect: false,
        rationale:
          'They worked via track-aligned Ley Line induction; 1887 ordered physical removal and smelting.',
      },
      {
        label: 'D',
        text: 'Coal magnates in 1887 required every train to add three more condensers for free public energy.',
        isCorrect: false,
        rationale:
          'Magnates ordered condensers removed and smelted to force fossil fuel dependence.',
      },
    ],
    hint: 'Ley Line induction +60% — 1887 coal magnates melt condensers.',
    correctAnswer: 'B',
  },
  {
    number: 21,
    question:
      'How was early subterranean transport like the London Underground originally designed to run?',
    options: [
      {
        label: 'A',
        text: 'Only on diesel smoke with no pneumatic design and no Tartarian air-pressure efficiency.',
        isCorrect: false,
        rationale:
          'Early Underground was designed to run safely on Tartarian pneumatic air pressure.',
      },
      {
        label: 'B',
        text: 'Only on coal steam identically to surface engines with no pneumatic air-pressure architecture.',
        isCorrect: false,
        rationale:
          'Original design used Tartarian pneumatic air pressure for safe efficient subterranean transport.',
      },
      {
        label: 'C',
        text: 'Safely and efficiently on Tartarian pneumatic air pressure rather than the later fossil-dependent model.',
        isCorrect: true,
        rationale:
          'London Underground origin = Tartarian pneumatic air-pressure transport system.',
      },
      {
        label: 'D',
        text: 'Only as pedestrian tunnels with no powered transport technology of any Tartarian kind.',
        isCorrect: false,
        rationale:
          'It was powered subterranean transport designed around pneumatic air pressure.',
      },
    ],
    hint: 'Early London Underground — Tartarian pneumatic air pressure.',
    correctAnswer: 'C',
  },
  {
    number: 22,
    question:
      'How do Freemasons complete Density Suppression over original temple footings after a Re-set?',
    options: [
      {
        label: 'A',
        text: 'They restore full 9th-density temple visibility and ban all stone alters over crystalline interfaces.',
        isCorrect: false,
        rationale:
          'They build 3rd-density cathedrals over original footings and place stone Alters on crystalline interfaces.',
      },
      {
        label: 'B',
        text: 'They only plant gardens with no buildings, no Baphomet pylons, and no Ley Line harvest outside cities.',
        isCorrect: false,
        rationale:
          'Cathedrals/churches/government buildings cap temples; Baphomet Power Pylons harvest backed-up Ley energy.',
      },
      {
        label: 'C',
        text: 'They demolish every Node so no residual frequency exists to suppress or harvest at all.',
        isCorrect: false,
        rationale:
          'They suppress and harvest residual Node/Ley energy rather than pure demolition of the grid.',
      },
      {
        label: 'D',
        text: 'They construct 3rd-density cathedrals, churches, and government buildings directly over original footings; a stone Alter sits where the temple crystalline interface stood, dampening and harvesting positive frequencies; Baphomet Power Pylons later harvest backed-up Ley Line energy outside suppressed population centers.',
        isCorrect: true,
        rationale:
          'Cap temples with heavy builds + Alter on interface + Baphomet pylons for overflow Ley harvest.',
      },
    ],
    hint: 'Build over footings — stone Alter on interface — Baphomet pylons harvest Ley backup.',
    correctAnswer: 'D',
  },
  {
    number: 23,
    question: 'How does synthetic repopulation refill Tartarian cities after a Re-set?',
    options: [
      {
        label: 'A',
        text: 'Parasites extract stem cells from murdered children to clone the next generation in D.U.M.B.S; clones move via Orphan Trains to re-inhabit fully structured Tartarian cities; select survivor adults are temporarily spared to educate parent-less clones into the new societal narrative.',
        isCorrect: true,
        rationale:
          'Child stem cells → DUMBS clones → Orphan Trains into standing Tartarian cities + survivor tutors.',
      },
      {
        label: 'B',
        text: 'Cities stay empty forever with no clones, no Orphan Trains, and no adult educators of any kind.',
        isCorrect: false,
        rationale:
          'Clones re-inhabit fully structured Tartarian cities after transport via Orphan Trains.',
      },
      {
        label: 'C',
        text: 'Only free volunteers with full old-world memory rebuild from ruins with no DUMBS cloning step.',
        isCorrect: false,
        rationale:
          'Repopulation is synthetic via stem-cell clones, not free memory-intact volunteers alone.',
      },
      {
        label: 'D',
        text: 'Every building is demolished first so clones must invent architecture from zero each cycle.',
        isCorrect: false,
        rationale:
          'Clones re-inhabit fully structured Tartarian cities already standing after the cull.',
      },
    ],
    hint: 'Stem cells → DUMBS clones → Orphan Trains → standing Tartarian cities.',
    correctAnswer: 'A',
  },
  {
    number: 24,
    question:
      'How do flat-earth truth, Custodian proxies, and NPCs interlock with Tartaria\'s suppression?',
    options: [
      {
        label: 'A',
        text: 'Earth is a spinning globe; Custodians never betrayed Source; NPCs are 3% organic teachers of free memory.',
        isCorrect: false,
        rationale:
          'Earth is a flat plane with Firmament; Custodians + proxies run Re-sets; NPCs are 97% synthetic buffer.',
      },
      {
        label: 'B',
        text: 'Earth is a flat plane enclosed by a Firmament; Heliocentrism and evolution are Freemason deceptions; Custodians and engineered proxies (Anunnaki, Greys, Draco, Niberians) run Re-sets but cannot create genuine architecture — only invert and hijack. NPCs are 97% synthetic 4th-density souls without internal monologue, policing old-world truths; East Tartary (China) was fully repopulated with a new high-output industrial NPC model.',
        isCorrect: true,
        rationale:
          'Flat enclosed realm + parasite non-creators + 97% NPC herd (China industrial model) seal Tartaria\'s erase.',
      },
      {
        label: 'C',
        text: 'NPCs invent free architecture better than Tartarians and need no Re-sets or Firmament lies.',
        isCorrect: false,
        rationale:
          'Parasites and NPCs cannot create genuine architecture; they invert, hijack, and manufacture fakes.',
      },
      {
        label: 'D',
        text: 'East Tartary was never repopulated and remains empty with full public Tartarian museums open daily.',
        isCorrect: false,
        rationale:
          'East Tartary was entirely repopulated with a new rigidly compliant industrial NPC model.',
      },
    ],
    hint: 'Flat Firmament realm — parasite non-creators — 97% NPCs — China industrial NPC crop.',
    correctAnswer: 'B',
  },
  {
    number: 25,
    question:
      'What was erasing Great Tartary preparing humanity for, and what three barriers must be discarded?',
    options: [
      {
        label: 'A',
        text: 'Preparing everyone for free 9th-density temples; barriers are cooking, fashion, and sports only.',
        isCorrect: false,
        rationale:
          'Erasure prepared for the 8th Re-set (15-Minute Cities, social credit, FEMA Camps); barriers are Religion, Finance, Perceived Knowledge.',
      },
      {
        label: 'B',
        text: 'Only aesthetic preference for concrete with no link to FEMA, social credit, or psychological strings.',
        isCorrect: false,
        rationale:
          'Brutalist downgrade acclimates austerity toward 8th Re-set subjugation systems.',
      },
      {
        label: 'C',
        text: 'Nothing strategic — Tartaria erasure was random and the EMF event will change no overlays.',
        isCorrect: false,
        rationale:
          'Suppression tethers to three barriers and prepares for 8th Re-set before EMF purges overlays.',
      },
      {
        label: 'D',
        text: 'Preparing for the 8th Re-set via 15-Minute Cities, social credit scores, and FEMA Camps (modern Lunatic Asylums/Workhouses). Architecture downgraded to drab brutalist concrete to lower expectations. Freedom requires discarding Religion, Finance, and Perceived Knowledge — the fabricated timeline, old-world denial, and ignorance of Re-set mechanics — before the EMF event purges deceptive overlays.',
        isCorrect: true,
        rationale:
          '8th Re-set control grid is the goal; sever the three strings and reclaim Tartarian truth before EMF.',
      },
    ],
    hint: '8th Re-set / 15-min cities / FEMA — discard Religion, Finance, Perceived Knowledge.',
    correctAnswer: 'D',
  },
];

function normalizeQuestion(q) {
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
    `${typeof TOPIC_ID !== 'undefined' ? TOPIC_ID : 'quiz'}::${q.number}:v3`
  );
  const options = finalized.options;
  const correct = options.find((o) => o.isCorrect);
  if (!correct) throw new Error(`Q${q.number}: no correct option`);
  /* correct letter assigned by finalizeOptions shuffle */
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

const questions = RAW_QUESTIONS.map(normalizeQuestion);
if (questions.length !== 25) throw new Error(`Expected 25, got ${questions.length}`);

const letterCounts = { A: 0, B: 0, C: 0, D: 0 };
for (const q of questions) letterCounts[q.correctAnswer]++;
if (letterCounts.A === 25) {
  throw new Error('correctAnswer still all A after finalizeOptions');
}
const dominant = Math.max(...Object.values(letterCounts));
if (dominant >= 15) {
  console.warn('Warning: one letter has >= 15 corrects:', letterCounts);
}

const DESC_SHORT =
  'Test your grasp of Tartaria — free-energy civilization, Mud-floods, Tuning Forks, Atmospheric Condensers, Orphan Trains, and the 8th Re-set trajectory.';
const DESC_META =
  'Interactive Living Truth Quiz on Tartaria: Great Tartary, Dark Ages overwrite, harmonic stone craft, Leedskalnin, Titanic crystal, Carnegie libraries, Density Suppression, and EMF liberation.';

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
      'Tartaria was not a myth — it was worldwide free-energy excellence murdered by a planned Re-set. Mud-floods buried the bones of that world. Tuning forks turned stone to putty. Domes sang ether. Condensers rode Ley Lines until coal melted them. Giants vaulted by the Smithsonian. Clones on Orphan Trains into empty cities. Sit with what you missed, then return to the Tartaria deep-dive. The Dark Ages and Industrial Revolution were covers. The 8th Re-set still aims 15-minute cages and FEMA asylums. Discard Religion, Finance, and Perceived Knowledge. Remember the old world before the EMF peels the lie.',
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
console.log('PASS: audited 25/25 against data/alice-topics/tartaria.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
