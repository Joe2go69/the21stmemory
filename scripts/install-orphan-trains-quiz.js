/**
 * Installs Orphan Trains quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/orphan-trains.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-orphan-trains-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'orphan-trains';
const TOPIC_TITLE = 'Orphan Trains';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/orphan.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['orphan trains', 're-set', 'tartaria', 'repopulate'],
  2: ['philanthropic', 'poverty', 'erase', 'ignorance'],
  3: ['rail networks', 'parentless', 'emptied cities', 'purge'],
  4: ['re-set', 'rise and fall', 'mass sacrifice', 'annihilates'],
  5: ['d.u.m.b', 'stem cells', 'laboratories', 'orphan'],
  6: ['oopa', 'artefacts', 'contradict', 'timeline'],
  7: ['tartaria', 'free-energy', 're-set', 'destroyed'],
  8: ['npc', 'soulless', 'consensus', 'majority'],
  9: ['loosh', 'adrenochrome', 'suffering', 'children'],
  10: ['clones', 'd.u.m.b', 'not the tragic survivors'],
  11: ['stem cells', 'sacrifice', 'torture', 'adrenochrome'],
  12: ['country by country', 'overlays', 'shielding', 'invisible'],
  13: ['1728', 'gold rushes', '1848', '1851'],
  14: ['3 to 5 years', 'free-energy', 'functioning', 'cities'],
  15: ['freemasons', 'arks', 'indoctrinate', 'evolution'],
  16: ['world war 1', '15 to 50', '15 to 22 million', 'flat earth'],
  17: ['railroad', 'giants', '10,000', 'smithsonian'],
  18: ['mud-floods', 'liquefaction', 'tartarian', 'repurposed'],
  19: ['lunatic asylums', '5,000-bed', '20 to 30 years', 'loosh'],
  20: ['blank slate', 'fabricated', 'parasitic', 'control'],
  21: ['industrial revolution', 'inversion', 'superior', 'civilization'],
  22: ['educational', 'financial', 'religious', 'amnesia'],
  23: ['harmonic architecture', 'rail networks', 'previous inhabitants'],
  24: ['freemason', 'railroad magnates', 'false historical'],
  25: ['cloned populations', 'next planned harvest', 'compliance'],
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
      'What are Orphan Trains in the true architecture of Re-sets and hidden history?',
    options: [
      {
        label: 'A',
        text: 'A modern subway marketing campaign with no link to planetary purges or manufactured children.',
        isCorrect: false,
        rationale:
          'Orphan Trains are logistical networks distributing newly manufactured children after a Re-set purge.',
      },
      {
        label: 'B',
        text: 'A critical logistical component used to distribute a newly manufactured population of children across the landscape after a planetary purge (Re-set), erasing knowledge of Tartaria and rebooting awareness into absolute ignorance while supplying parasitic harvest systems.',
        isCorrect: true,
        rationale:
          'Orphan Trains move post-Reset clone children into emptied lands to wipe Tartaria memory and restock the harvest farm.',
      },
      {
        label: 'C',
        text: 'Only holiday tourist trains that never repopulate cities and never touch clone logistics of any kind.',
        isCorrect: false,
        rationale:
          'They are post-purge repopulation logistics, not leisure tourism services.',
      },
      {
        label: 'D',
        text: 'G.A.A. rescue fleets that restore full old-world memory to every passenger upon arrival.',
        isCorrect: false,
        rationale:
          'They reboot awareness into ignorance, not restore Tartarian memory.',
      },
    ],
    hint: 'Post-Reset logistics — manufactured children — erase Tartaria — feed harvest.',
    correctAnswer: 'B',
  },
  {
    number: 2,
    question:
      'Why is the philanthropic urban-poverty story about Orphan Trains false?',
    options: [
      {
        label: 'A',
        text: 'Because every orphan was a free organic survivor with full Tartarian memory and no re-education needed.',
        isCorrect: false,
        rationale:
          'The system reboots awareness to absolute ignorance and erases Tartaria knowledge on purpose.',
      },
      {
        label: 'B',
        text: 'Because trains never existed and no children were ever moved after any purge event.',
        isCorrect: false,
        rationale:
          'Trains did move parentless manufactured populations; the philanthropy cover is the lie.',
      },
      {
        label: 'C',
        text: 'Because they were not a natural historical progression or philanthropic response to urban poverty, but a meticulously orchestrated system to erase Tartaria knowledge, reboot awareness to absolute ignorance, and supply energetic and physical sustenance for parasitic entities.',
        isCorrect: true,
        rationale:
          'Philanthropy is cover; real purpose is memory wipe, ignorance reboot, and parasitic supply.',
      },
      {
        label: 'D',
        text: 'Because only adult bankers rode the trains and no children or clones were involved at all.',
        isCorrect: false,
        rationale:
          'The cargo was newly generated parentless children for repopulation and control.',
      },
    ],
    hint: 'Not charity for poverty — erase Tartaria, reboot ignorance, feed parasites.',
    correctAnswer: 'C',
  },
  {
    number: 3,
    question: 'What does the term Orphan Trains specifically name as infrastructure?',
    options: [
      {
        label: 'A',
        text: 'Logistical rail networks used to transport newly generated, parentless children across continents to repopulate fully functioning but emptied cities following a planetary purge.',
        isCorrect: true,
        rationale:
          'Orphan Trains = rail logistics moving parentless generated children into emptied but intact cities.',
      },
      {
        label: 'B',
        text: 'Ocean freighters only, with no rail networks and no destination cities already built.',
        isCorrect: false,
        rationale:
          'They are rail networks into fully functioning emptied cities, not solely ocean freighters.',
      },
      {
        label: 'C',
        text: 'Local horse carts that only moved furniture and never transported children after any Re-set.',
        isCorrect: false,
        rationale:
          'Definition centers on rail transport of parentless children for city repopulation.',
      },
      {
        label: 'D',
        text: 'Virtual multiplayer games with no physical tracks and no real-world repopulation role.',
        isCorrect: false,
        rationale:
          'They are physical logistical rail networks after planetary purge events.',
      },
    ],
    hint: 'Rail networks — parentless children — emptied but functioning cities.',
    correctAnswer: 'A',
  },
  {
    number: 4,
    question: 'What is a Re-set relative to the "Rise and Fall of civilizations" story?',
    options: [
      {
        label: 'A',
        text: 'A purely natural cultural cycle with no planning, no sacrifice, and no population annihilation.',
        isCorrect: false,
        rationale:
          'A Re-set is planned planetary destruction and mass sacrifice, falsely recorded as natural rise and fall.',
      },
      {
        label: 'B',
        text: 'A cyclical, planned planetary destruction and mass sacrifice event that annihilates the existing population, falsely recorded in historical narratives as the natural Rise and Fall of civilizations.',
        isCorrect: true,
        rationale:
          'Re-set = planned annihilation harvest disguised as natural civilizational rise and fall.',
      },
      {
        label: 'C',
        text: 'A school field trip schedule with no link to planetary purge or historical cover stories.',
        isCorrect: false,
        rationale:
          'It is planetary destruction and mass sacrifice with false historical packaging.',
      },
      {
        label: 'D',
        text: 'A permanent freeze of all history so no civilization ever ends or restarts under any label.',
        isCorrect: false,
        rationale:
          'Re-sets cyclically annihilate populations and reboot the narrative as natural decline.',
      },
    ],
    hint: 'Planned planetary destruction — mass sacrifice — fake "rise and fall."',
    correctAnswer: 'B',
  },
  {
    number: 5,
    question: 'What are D.U.M.B.S. in the orphan-crop pipeline?',
    options: [
      {
        label: 'A',
        text: 'Surface farms that only grow wheat and never use stem cells or underground laboratories.',
        isCorrect: false,
        rationale:
          'DUMBS are Deep Underground Military Bases where the orphan crop is grown from harvested stem cells.',
      },
      {
        label: 'B',
        text: 'Tourist caves with no clone cultivation and no connection to Orphan Train logistics.',
        isCorrect: false,
        rationale:
          'They are subterranean labs for artificially growing the new orphan population.',
      },
      {
        label: 'C',
        text: 'G.A.A. free clinics that restore Tartarian memory and never manufacture parentless children.',
        isCorrect: false,
        rationale:
          'DUMBS grow the artificial orphan crop for post-Reset repopulation, not liberation clinics.',
      },
      {
        label: 'D',
        text: 'Deep Underground Military Bases — subterranean facilities where the new orphan crop was artificially grown in laboratories using harvested stem cells.',
        isCorrect: true,
        rationale:
          'DUMBS = underground stem-cell labs manufacturing the parentless orphan generation.',
      },
    ],
    hint: 'Deep Underground Military Bases — stem-cell lab orphan crop.',
    correctAnswer: 'D',
  },
  {
    number: 6,
    question: 'What are Oopa\'s (Out Of Place Artefacts) relative to the orphan-train era cover story?',
    options: [
      {
        label: 'A',
        text: 'Blatant physical anomalies and advanced architectural remnants that contradict the fabricated historical timeline and prove highly technological prior civilizations.',
        isCorrect: true,
        rationale:
          'OOPAs break the fake timeline the orphans are taught and expose prior high-tech worlds.',
      },
      {
        label: 'B',
        text: 'Only digital stickers that never appear as physical architecture or buried technological remnants.',
        isCorrect: false,
        rationale:
          'They are physical anomalies and advanced architectural remnants in the real landscape.',
      },
      {
        label: 'C',
        text: 'Fully explained props that support school evolution charts with no contradiction to Freemason history.',
        isCorrect: false,
        rationale:
          'They contradict the fabricated historical timeline imposed after Re-sets.',
      },
      {
        label: 'D',
        text: 'Weather balloons only, with no link to prior civilizations or timeline deception.',
        isCorrect: false,
        rationale:
          'OOPAs are evidence of highly technological prior civilizations erased from the orphan narrative.',
      },
    ],
    hint: 'Physical high-tech anomalies that contradict the fabricated timeline.',
    correctAnswer: 'A',
  },
  {
    number: 7,
    question: 'What was Tartaria relative to the most recent Re-set and Orphan Train era?',
    options: [
      {
        label: 'A',
        text: 'A future project that never existed before modern textbooks invented the name last decade.',
        isCorrect: false,
        rationale:
          'Tartaria was the advanced free-energy global civilization destroyed and hidden in the most recent Re-set.',
      },
      {
        label: 'B',
        text: 'The advanced free-energy global civilization that existed prior to the current era, systematically destroyed and hidden during the most recent Re-set.',
        isCorrect: true,
        rationale:
          'Orphan Trains repopulate after Tartaria\'s destruction and help erase knowledge of that civilization.',
      },
      {
        label: 'C',
        text: 'Only a coal company brand with no free-energy infrastructure and no civilizational architecture.',
        isCorrect: false,
        rationale:
          'It was advanced free-energy global civilization, not a mere brand label.',
      },
      {
        label: 'D',
        text: 'A Freemason charity that ran Orphan Trains as pure philanthropy without any Re-set connection.',
        isCorrect: false,
        rationale:
          'Tartaria was the civilization wiped by Re-set; Orphan Trains serve the cover and repopulation.',
      },
    ],
    hint: 'Advanced free-energy civilization — destroyed and hidden in latest Re-set.',
    correctAnswer: 'B',
  },
  {
    number: 8,
    question: 'What are NPCs among the new post-Reset populations?',
    options: [
      {
        label: 'A',
        text: 'The rare organic minority who alone remember Tartaria without any indoctrination resistance.',
        isCorrect: false,
        rationale:
          'NPCs are soulless artificially generated beings comprising the vast majority of new populations.',
      },
      {
        label: 'B',
        text: 'Only online avatars that never walk emptied cities or uphold any consensus narrative offline.',
        isCorrect: false,
        rationale:
          'They are physical population majority designed to uphold fabricated consensus reality.',
      },
      {
        label: 'C',
        text: 'Soulless, artificially generated beings that comprise the vast majority of the new populations, designed to uphold the fabricated consensus reality.',
        isCorrect: true,
        rationale:
          'NPCs = synthetic majority enforcing the fake consensus the orphan system installs.',
      },
      {
        label: 'D',
        text: 'Fully self-aware 12th-density teachers who openly teach free-energy Tartarian science in schools.',
        isCorrect: false,
        rationale:
          'NPCs uphold fabricated consensus; they are not free high-density truth teachers.',
      },
    ],
    hint: 'Vast majority — soulless artificial beings — uphold fabricated consensus.',
    correctAnswer: 'C',
  },
  {
    number: 9,
    question: 'What are Loosh and Adrenochrome in Re-set harvest relative to children?',
    options: [
      {
        label: 'A',
        text: 'Public vitamins that raise frequency and permanently end all parasitic feeding forever.',
        isCorrect: false,
        rationale:
          'Loosh is suffering energy food; Adrenochrome is extracted from children in extreme trauma.',
      },
      {
        label: 'B',
        text: 'Only weather terms for fog and rain with no sacrificial or trauma harvest meaning.',
        isCorrect: false,
        rationale:
          'Both are primary products of Re-set violence, with Adrenochrome specifically from child trauma.',
      },
      {
        label: 'C',
        text: 'Digital currencies mined by computers with no emotional content and no child sacrifice link.',
        isCorrect: false,
        rationale:
          'They are energetic and biological harvests from human and child suffering.',
      },
      {
        label: 'D',
        text: 'Loosh is negative energetic resonance from human suffering, terror, and trauma used as sustenance by parasites and demons; Adrenochrome is a biological substance extracted from children during extreme trauma and sacrifice — the primary harvestable product of a Re-set.',
        isCorrect: true,
        rationale:
          'Re-sets farm Loosh and child-sourced Adrenochrome as the core harvest products.',
      },
    ],
    hint: 'Loosh = suffering energy food; Adrenochrome = child trauma primary harvest.',
    correctAnswer: 'D',
  },
  {
    number: 10,
    question:
      'What were the children photographed on Orphan Trains primarily, if not poverty survivors?',
    options: [
      {
        label: 'A',
        text: 'Primarily clones, artificially generated without parents in subterranean D.U.M.B.S., not tragic survivors of natural poverty or disease.',
        isCorrect: true,
        rationale:
          'Orphan Train children were mainly DUMBS-grown parentless clones, not natural poverty orphans.',
      },
      {
        label: 'B',
        text: 'Only natural war refugees with living parents waiting at every station for reunion.',
        isCorrect: false,
        rationale:
          'They were generated without parents in underground labs, not reunited family refugees.',
      },
      {
        label: 'C',
        text: 'Actors hired for staged photos with no real transport of any population after Re-sets.',
        isCorrect: false,
        rationale:
          'Real clone crops were transported; photographs document the manufactured orphan population.',
      },
      {
        label: 'D',
        text: 'Fully memory-intact Tartarian heirs who taught free energy on every rail car openly.',
        isCorrect: false,
        rationale:
          'They were blank-slate clones without parents, not free Tartarian teachers.',
      },
    ],
    hint: 'Primarily DUMBS clones without parents — not natural poverty survivors.',
    correctAnswer: 'A',
  },
  {
    number: 11,
    question:
      'What happens to the surface population during a Re-set before the new orphan crop is grown?',
    options: [
      {
        label: 'A',
        text: 'Everyone receives free herbal medicine and keeps full family structure with zero sacrifice.',
        isCorrect: false,
        rationale:
          'Entire surface population faces extreme torture, sexual violence, and mass sacrifice for Adrenochrome and Loosh.',
      },
      {
        label: 'B',
        text: 'The entire surface population — adults and children — is subjected to extreme torture, sexual violence, and mass sacrifice to extract Adrenochrome and Loosh; before children are sacrificed, their stem cells are harvested to engineer the next generation.',
        isCorrect: true,
        rationale:
          'Total surface harvest violence + child stem cells taken before sacrifice to seed DUMBS clones.',
      },
      {
        label: 'C',
        text: 'Only livestock are culled while humans watch safely from Arks with no stem-cell extraction.',
        isCorrect: false,
        rationale:
          'Human adults and children are the sacrifice and stem-cell source for the next crop.',
      },
      {
        label: 'D',
        text: 'No violence occurs; Re-sets only rename cities on maps without touching bodies or energy harvest.',
        isCorrect: false,
        rationale:
          'Re-sets are mass torture and sacrifice plus stem-cell harvest for the next generation.',
      },
    ],
    hint: 'Surface torture/sacrifice for Loosh/Adrenochrome — stem cells first from children.',
    correctAnswer: 'B',
  },
  {
    number: 12,
    question:
      'Do Re-sets hit the whole planet at once, and how is active destruction hidden?',
    options: [
      {
        label: 'A',
        text: 'Yes — every continent is purged in the same hour with no shielding and full global live broadcast.',
        isCorrect: false,
        rationale:
          'Re-sets run country by country over several years using Overlays and territory shielding.',
      },
      {
        label: 'B',
        text: 'They never hide anything; neighboring regions always watch the full slaughter in real time openly.',
        isCorrect: false,
        rationale:
          'Dimensional Overlays and territory shielding render active destruction invisible to neighbors and ships.',
      },
      {
        label: 'C',
        text: 'They are executed country by country over several years, using dimensional Overlays and territory shielding to render active destruction invisible to neighboring regions or seafaring vessels.',
        isCorrect: true,
        rationale:
          'Staggered country-by-country Re-sets stay hidden behind Overlays and territory shields.',
      },
      {
        label: 'D',
        text: 'Only one island is ever reset while the rest of Earth remains permanently untouched forever.',
        isCorrect: false,
        rationale:
          'Execution is multi-year, multi-country sequencing under shield tech, not a single-island exception.',
      },
    ],
    hint: 'Country by country over years — Overlays and territory shielding hide it.',
    correctAnswer: 'C',
  },
  {
    number: 13,
    question:
      'When did America\'s last Re-set repopulation phase begin, and what did the orphans\' grandchildren later drive?',
    options: [
      {
        label: 'A',
        text: 'Repopulation began in 2000, and grandchildren only invented social media with no gold-rush role.',
        isCorrect: false,
        rationale:
          'American repopulation phase began around 1728; grandchildren drove fabricated Gold Rushes of 1848 and 1851.',
      },
      {
        label: 'B',
        text: 'There was no American Re-set; Gold Rushes were pure spontaneous discovery with no orphan lineage.',
        isCorrect: false,
        rationale:
          'Orphan-line grandchildren drove the fabricated Gold Rushes after 1728 repopulation.',
      },
      {
        label: 'C',
        text: 'Repopulation began in 1492 only, and no Gold Rush narrative was ever fabricated afterward.',
        isCorrect: false,
        rationale:
          'Last American repopulation phase is dated around 1728 with later 1848/1851 Gold Rush fabrication.',
      },
      {
        label: 'D',
        text: 'The last Re-set in America began its repopulation phase around 1728; the grandchildren of these original orphans eventually drove the fabricated Gold Rushes of 1848 and 1851.',
        isCorrect: true,
        rationale:
          '1728 orphan repopulation → generational cover → fabricated 1848/1851 Gold Rushes.',
      },
    ],
    hint: 'America ~1728 repopulation — grandchildren drive 1848/1851 fabricated Gold Rushes.',
    correctAnswer: 'D',
  },
  {
    number: 14,
    question:
      'What happens in the 3-to-5-year window before Orphan Trains deliver the new crop?',
    options: [
      {
        label: 'A',
        text: 'After a Re-set concludes, free-energy technology is dismantled or hidden for 3 to 5 years; then newly grown orphans are trained to cities that already have intricate infrastructure, harmonic architecture, and free-energy rail networks from previous inhabitants.',
        isCorrect: true,
        rationale:
          '3–5 year tech suppression, then clones into fully built Tartarian-grade cities on trains.',
      },
      {
        label: 'B',
        text: 'Cities are demolished to dust first so orphans must invent architecture from zero with hand tools only.',
        isCorrect: false,
        rationale:
          'Destination cities are fully functioning and highly developed from previous inhabitants.',
      },
      {
        label: 'C',
        text: 'Free-energy systems are left fully public and taught as core curriculum on every Orphan Train car.',
        isCorrect: false,
        rationale:
          'Free-energy tech is dismantled or hidden during the multi-year suppression window.',
      },
      {
        label: 'D',
        text: 'No waiting period exists; trains leave during the massacre while cities are still under active fire.',
        isCorrect: false,
        rationale:
          'Repopulation logistics follow a 3–5 year post-Reset suppression period after the purge concludes.',
      },
    ],
    hint: '3–5 years hide free energy — then trains into already-built advanced cities.',
    correctAnswer: 'A',
  },
  {
    number: 15,
    question:
      'Who re-educates the parentless clones, and what false doctrine do they install?',
    options: [
      {
        label: 'A',
        text: 'Random street vendors with no Freemason link and no fabricated history curriculum of any kind.',
        isCorrect: false,
        rationale:
          'Pre-selected Freemason survivors with prior knowledge were spared and deployed as educators.',
      },
      {
        label: 'B',
        text: 'Pre-selected survivors — often Freemasons with prior knowledge — were spared and hidden in temporary accommodations or Arks, then deployed to educate and indoctrinate parentless clones into a completely fabricated history, including the false biological doctrine of Evolution via natural selection.',
        isCorrect: true,
        rationale:
          'Freemason survivors from Arks indoctrinate clones with fake history and Darwinian evolution cover.',
      },
      {
        label: 'C',
        text: 'G.A.A. Micro Suns who teach pure Tartarian free-energy science and true flat-earth cosmology only.',
        isCorrect: false,
        rationale:
          'Re-education installs fabricated history and false evolution, not Tartarian truth.',
      },
      {
        label: 'D',
        text: 'No adults survive any Re-set, so clones teach themselves without any indoctrination apparatus.',
        isCorrect: false,
        rationale:
          'Select adults are spared specifically to run the re-education apparatus on clones.',
      },
    ],
    hint: 'Freemason survivors / Arks — indoctrinate clones — fake history and evolution.',
    correctAnswer: 'B',
  },
  {
    number: 16,
    question:
      'How did World War 1 finish the job of eradicating legacy knowledge after the Re-set?',
    options: [
      {
        label: 'A',
        text: 'It trained 15 to 22 million people in flat-earth science and herbal medicine for public schools.',
        isCorrect: false,
        rationale:
          'WW1 culled ages 15–50 who still remembered flat earth, herbals, and old-world civilization.',
      },
      {
        label: 'B',
        text: 'It had no demographic target and only moved furniture between empty Tartarian cities peacefully.',
        isCorrect: false,
        rationale:
          'It was engineered specifically to cull remaining memory-holders aged 15 to 50.',
      },
      {
        label: 'C',
        text: 'WW1 was engineered to cull the remaining population aged 15 to 50 — Re-set survivors who still retained memories of the flat earth, natural herbal remedies, and old-world civilization — eliminating 15 to 22 million people and severing final links to pre-Re-set knowledge.',
        isCorrect: true,
        rationale:
          'WW1 = demographic memory wipe of ages 15–50, 15–22 million dead, pre-Reset knowledge cut.',
      },
      {
        label: 'D',
        text: 'It restored Tartarian rail free energy and published true Re-set history in every newspaper.',
        isCorrect: false,
        rationale:
          'The war severed final links to pre-Re-set knowledge rather than restoring it.',
      },
    ],
    hint: 'WW1 culls ages 15–50 memory holders — 15 to 22 million — cut pre-Reset knowledge.',
    correctAnswer: 'C',
  },
  {
    number: 17,
    question:
      'How did railroad expansion for Orphan Trains collide with Giant remains, and who suppressed them?',
    options: [
      {
        label: 'A',
        text: 'Railroads never hit burial mounds; no giants were found and the Smithsonian displayed nothing related.',
        isCorrect: false,
        rationale:
          'Expansion sliced ancient burial mounds and uncovered over 10,000 Giant skeletons.',
      },
      {
        label: 'B',
        text: 'Giants were celebrated in every school as official Tartarian lineage with full Smithsonian support.',
        isCorrect: false,
        rationale:
          'Smithsonian confiscated and suppressed the artifacts to protect the false historical timeline.',
      },
      {
        label: 'C',
        text: 'Only modern cow bones were found, ranging under two meters, with no Freemason railroad link.',
        isCorrect: false,
        rationale:
          'Remains were Giants 12 to 35+ meters; Freemason railroad magnates founded the suppressing Smithsonian.',
      },
      {
        label: 'D',
        text: 'Railroad expansion facilitating Orphan Trains sliced ancient burial mounds from previous Re-sets, uncovering over 10,000 Giant skeletons (12 to 35+ meters); the Smithsonian — founded by the same Freemason railroad magnates managing the new infrastructure — immediately confiscated and suppressed the artifacts.',
        isCorrect: true,
        rationale:
          'Orphan-train rail boom exposes giants; Freemason magnate Smithsonian vaults the evidence.',
      },
    ],
    hint: 'Rails hit mounds — 10,000+ giants — Freemason railroad Smithsonian suppress.',
    correctAnswer: 'D',
  },
  {
    number: 18,
    question:
      'What landscape did Orphan Trains run through after Mud-floods, and how were surviving buildings framed?',
    options: [
      {
        label: 'A',
        text: 'A landscape recently devastated by Mud-floods from advanced soil liquefaction and energy weaponry that buried Tartarian cities and turned organic matter into stone; surviving resplendent buildings were falsely attributed to the new primitive populations and repurposed as government buildings, libraries, and schools.',
        isCorrect: true,
        rationale:
          'Mud-flood weapon aftermath + stolen Tartarian buildings rebranded as new "progress" infrastructure.',
      },
      {
        label: 'B',
        text: 'An untouched paradise where no soil liquefaction occurred and every building was newly invented by orphans.',
        isCorrect: false,
        rationale:
          'Landscape was Mud-flood devastated; buildings pre-existed from Tartaria and were repurposed.',
      },
      {
        label: 'C',
        text: 'Only empty desert with no repurposed architecture and no false attribution to primitive newcomers.',
        isCorrect: false,
        rationale:
          'Surviving Tartarian structures were repurposed as modern government, library, and school buildings.',
      },
      {
        label: 'D',
        text: 'A pure ice field with no energy weapons, no stone conversion of organics, and no city burial.',
        isCorrect: false,
        rationale:
          'Mud-floods from liquefaction and energy weapons buried Tartarian cities in the train era landscape.',
      },
    ],
    hint: 'Mud-floods bury Tartaria — survivors rebrand buildings as new primitive works.',
    correctAnswer: 'A',
  },
  {
    number: 19,
    question:
      'Why were Lunatic Asylums needed while the orphan crop matured?',
    options: [
      {
        label: 'A',
        text: 'To teach free-energy engineering so orphans would restore Tartaria within one year of arrival.',
        isCorrect: false,
        rationale:
          'Asylums held shell-shocked witnesses as Loosh Batteries while orphans took 20–30 years to mature.',
      },
      {
        label: 'B',
        text: 'Survivors who witnessed demon-led Re-set reality and were not used for re-education were incarcerated in massive repurposed Tartarian structures as Lunatic Asylums; because it takes 20 to 30 years for the new orphan population to mature enough for steady sacrifice and energy, these 5,000-bed asylums served as Loosh Batteries sustaining demons with concentrated terror of shell-shocked inmates in the interim.',
        isCorrect: true,
        rationale:
          '20–30 year maturation gap filled by 5,000-bed asylum Loosh Batteries of traumatized witnesses.',
      },
      {
        label: 'C',
        text: 'Asylums only stored train schedules and never held human inmates or fed any demonic entities.',
        isCorrect: false,
        rationale:
          'They incarcerated shell-shocked survivors as continuous Loosh supply between harvest phases.',
      },
      {
        label: 'D',
        text: 'Orphans mature in one week so asylums were never needed as interim energetic batteries.',
        isCorrect: false,
        rationale:
          'Maturation takes 20 to 30 years; asylums bridge that gap as Loosh Batteries.',
      },
    ],
    hint: '20–30 year orphan maturation — 5,000-bed asylum Loosh Batteries for Demons.',
    correctAnswer: 'B',
  },
  {
    number: 20,
    question:
      'What kind of foundational population did Orphan Trains create for the current era?',
    options: [
      {
        label: 'A',
        text: 'A fully memory-intact Tartarian elite with independent free-energy sovereignty from day one.',
        isCorrect: false,
        rationale:
          'Foundational population began as a blank slate entirely dependent on a fabricated parasitic system.',
      },
      {
        label: 'B',
        text: 'Only tourists who left after one week with no lasting demographic or control impact.',
        isCorrect: false,
        rationale:
          'Orphan Trains built the foundational population of the current era as controlled blank slate.',
      },
      {
        label: 'C',
        text: 'A mechanism of absolute control ensuring the foundational population of the current era began as a blank slate, entirely dependent on a fabricated, parasitic system.',
        isCorrect: true,
        rationale:
          'Blank-slate dependence on parasitic fabrication is the strategic purpose of Orphan Train repopulation.',
      },
      {
        label: 'D',
        text: 'A free democratic experiment with no parasitic design and no amnesia about prior civilizations.',
        isCorrect: false,
        rationale:
          'Design goal is absolute control via ignorance and dependence, not free memory-intact society.',
      },
    ],
    hint: 'Blank slate foundational population — total dependence on parasitic fabrication.',
    correctAnswer: 'C',
  },
  {
    number: 21,
    question:
      'How should the Industrial Revolution narrative be read in the Orphan Train period?',
    options: [
      {
        label: 'A',
        text: 'As pure human progress inventing all harmonic architecture from empty dirt with no prior civilization.',
        isCorrect: false,
        rationale:
          'It is a deliberate inversion: the period marks the end of a superior civilization, not invention progress.',
      },
      {
        label: 'B',
        text: 'As a G.A.A. gift program that openly credited Tartaria on every factory plaque worldwide.',
        isCorrect: false,
        rationale:
          'The narrative hides Tartaria\'s end; it does not credit the superior prior civilization.',
      },
      {
        label: 'C',
        text: 'As only a fashion trend in hats with no link to civilizational downgrade or orphan logistics.',
        isCorrect: false,
        rationale:
          'It frames the Orphan Train era as progress while actually ending superior harmonic civilization.',
      },
      {
        label: 'D',
        text: 'As a deliberate inversion — rather than human progress and invention, the Orphan Train period marked the abrupt and devastating end of a superior, mathematically and harmonically perfect civilization.',
        isCorrect: true,
        rationale:
          'Industrial Revolution story inverts the truth: superior Tartarian world ends as orphans arrive.',
      },
    ],
    hint: 'Industrial Revolution = inversion — end of superior harmonic civilization, not progress.',
    correctAnswer: 'D',
  },
  {
    number: 22,
    question:
      'What do modern educational, financial, and religious systems do relative to cloned populations?',
    options: [
      {
        label: 'A',
        text: 'They were designed by the victors to maintain mass amnesia, suppress multidimensional awareness, and secure complete compliance from cloned populations until the next planned harvest.',
        isCorrect: true,
        rationale:
          'Education, finance, and religion = amnesia and compliance machines until the next harvest.',
      },
      {
        label: 'B',
        text: 'They restore full Tartarian free-energy science and encourage multidimensional awakening for all clones.',
        isCorrect: false,
        rationale:
          'They suppress multidimensional awareness and maintain mass amnesia by design.',
      },
      {
        label: 'C',
        text: 'They have no connection to Re-sets and only regulate sports leagues without memory effects.',
        isCorrect: false,
        rationale:
          'Recognizing Orphan Trains as Re-set artifacts reveals these institutions\' true amnesia purpose.',
      },
      {
        label: 'D',
        text: 'They end all harvest cycles permanently so no next planned harvest can ever be scheduled.',
        isCorrect: false,
        rationale:
          'They secure compliance until the next planned harvest, not end the harvest cycle.',
      },
    ],
    hint: 'Education, finance, religion — mass amnesia — compliance until next harvest.',
    correctAnswer: 'A',
  },
  {
    number: 23,
    question:
      'What kind of cities did Orphan Trains deliver children into after free-energy suppression?',
    options: [
      {
        label: 'A',
        text: 'Empty deserts with no infrastructure where orphans invented every rail and building from scratch.',
        isCorrect: false,
        rationale:
          'Cities already possessed intricate infrastructure, harmonic architecture, and free-energy rail networks.',
      },
      {
        label: 'B',
        text: 'Fully functioning, highly developed cities with intricate infrastructure, harmonic architecture, and free-energy rail networks created by the previous inhabitants.',
        isCorrect: true,
        rationale:
          'Orphans inherit standing advanced cities from the prior civilization after tech is hidden.',
      },
      {
        label: 'C',
        text: 'Only tent camps with no harmonic architecture and no rail networks of any prior design.',
        isCorrect: false,
        rationale:
          'Destinations were highly developed with prior free-energy rail and harmonic buildings.',
      },
      {
        label: 'D',
        text: 'Underwater domes only, with no surface cities and no previous-inhabitant architecture remaining.',
        isCorrect: false,
        rationale:
          'Surface cities remained fully structured from previous inhabitants for clone repopulation.',
      },
    ],
    hint: 'Already-built advanced cities — harmonic architecture and free-energy rails.',
    correctAnswer: 'B',
  },
  {
    number: 24,
    question:
      'Who founded the Smithsonian in the railroad/orphan infrastructure network, and why?',
    options: [
      {
        label: 'A',
        text: 'Independent farmers seeking to display every giant skeleton publicly with full Tartarian context.',
        isCorrect: false,
        rationale:
          'Freemason railroad magnates founded it to confiscate and suppress timeline-breaking artifacts.',
      },
      {
        label: 'B',
        text: 'G.A.A. archivists who publish all OOPA evidence free and never suppress giant remains.',
        isCorrect: false,
        rationale:
          'Same Freemason railroad magnates managing new infrastructure used it to protect false history.',
      },
      {
        label: 'C',
        text: 'The same Freemason railroad magnates managing the new infrastructure founded the Smithsonian to immediately confiscate and suppress Giant remains and protect the false historical timeline.',
        isCorrect: true,
        rationale:
          'Railroad magnate Freemasons ran both Orphan Train infrastructure and artifact suppression vault.',
      },
      {
        label: 'D',
        text: 'No Freemasons were involved; the Smithsonian only cataloged train schedules without archaeology.',
        isCorrect: false,
        rationale:
          'Freemason railroad magnates founded it specifically to suppress giant and timeline evidence.',
      },
    ],
    hint: 'Freemason railroad magnates — Smithsonian suppresses giants to protect false timeline.',
    correctAnswer: 'C',
  },
  {
    number: 25,
    question:
      'What long game does the Orphan Train system serve until the next harvest?',
    options: [
      {
        label: 'A',
        text: 'Permanent liberation of every clone into 12th density with no further planned harvest cycles.',
        isCorrect: false,
        rationale:
          'Systems secure complete compliance from cloned populations until the next planned harvest.',
      },
      {
        label: 'B',
        text: 'Only one generation of trains with no educational, financial, or religious amnesia machinery afterward.',
        isCorrect: false,
        rationale:
          'Victors designed global institutions to maintain amnesia and compliance for ongoing harvest cycles.',
      },
      {
        label: 'C',
        text: 'Open teaching of Re-set mechanics so clones refuse all future sacrifice systems immediately.',
        isCorrect: false,
        rationale:
          'Design goal is mass amnesia and compliance, not open Re-set literacy for resistance.',
      },
      {
        label: 'D',
        text: 'Absolute control from a blank-slate start, then global educational, financial, and religious systems maintain mass amnesia, suppress multidimensional awareness, and secure complete compliance from cloned populations until the next planned harvest.',
        isCorrect: true,
        rationale:
          'Orphan Trains seed the blank slate; institutions hold amnesia until the next planned harvest.',
      },
    ],
    hint: 'Blank slate → institutional amnesia → compliance until next planned harvest.',
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
  'Test your grasp of Orphan Trains — post-Reset clone logistics, DUMBS stem-cell crops, Freemason re-education, WW1 memory purge, and blank-slate control.';
const DESC_META =
  'Interactive Living Truth Quiz on Orphan Trains: Re-set repopulation, Tartaria erasure, Mud-flood cities, Giant suppression, Lunatic Asylum Loosh batteries, and industrial inversion.';

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
      'Orphan Trains were not charity for urban poverty — they were Re-set logistics. DUMBS grew parentless clones from harvested stem cells. Freemasons stepped out of Arks to teach fake evolution. Trains rolled into standing Tartarian cities after free energy was buried. Mud-floods, giants vaulted by railroad Freemasons, asylums as Loosh batteries for twenty years of maturation — that is the machine. Sit with what you missed, then return to the Orphan Trains deep-dive. The Industrial Revolution was inversion of a superior world\'s end. Education, finance, and religion hold the blank slate until the next harvest. See the trains for what they are.',
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
      "  { path: '/quiz/alice/tartaria.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/resets-hidden-history.html', priority: '0.75', changefreq: 'monthly' },",
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
console.log('PASS: audited 25/25 against data/alice-topics/orphan-trains.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
