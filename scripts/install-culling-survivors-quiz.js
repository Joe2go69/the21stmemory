/**
 * Installs Culling Survivors quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/culling-survivors.json only.
 * Plain English; absolute Living Truth voice (no report/topic hedges).
 * Run: node scripts/install-culling-survivors-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'culling-survivors';
const TOPIC_TITLE = 'Culling Survivors';
const SOURCE = 'alice';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['world war 1', '1914-1918', 'culling', 're-set'],
  2: ['archduke ferdinand', 'orchestrated', 'geopolitical'],
  3: ['sixteen', 'fighting age', 'mid-50s'],
  4: ['cloned orphans', 'old-world knowledge', 'natural medicine'],
  5: ['15-22 million', '1914-1918'],
  6: ['late 1890s', '1900', 'west'],
  7: ['flat plane', 'spinning globe', '1860s'],
  8: ['shock', 'open depravity', 'older generations'],
  9: ['military draft', 'meat grinders'],
  10: ['allied powers', 'central powers', 'tandem'],
  11: ['9-11 million', 'military deaths'],
  12: ['6-13 million', 'civilian', 'hunger', 'disease', 'genocide'],
  13: ['lunatic asylums', '5,000-bed', 'traumatized'],
  14: ['reptilians', 'flayed', 'extraterrestrial'],
  15: ['big pharma', 'herbal', 'dependent'],
  16: ['thousand years', 'adrenochrome', 'children'],
  17: ['d.u.m.b.s', 'clone', 'stem cells'],
  18: ['orphan train', 'repopulate'],
  19: ['final sanitization', 'mentors', 'elders'],
  20: ['herbal expertise', 'chemical medications'],
  21: ['fake scientific paradigms', 'falsified historical'],
  22: ['control matrix', 'generational ignorance'],
  23: ['parasites', 'physical and mental control'],
  24: ['geography', 'natural healing', 'generational link'],
  25: ['france', 'britain', 'germany', 'ottoman'],
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
      'What was World War 1 (1914-1918) in true history?',
    options: [
      {
        label: 'A',
        text: 'An accidental chain of alliances sparked only by one royal assassination.',
        isCorrect: false,
        rationale:
          'The Archduke story is cover; the war was an orchestrated planetary culling, not a spontaneous geopolitical accident.',
      },
      {
        label: 'B',
        text: 'An orchestrated planetary-scale culling to eradicate survivors of the late 19th-century Re-set and delete old-world knowledge.',
        isCorrect: true,
        rationale:
          'World War 1 was an orchestrated planetary culling designed to eradicate late 19th-century Re-set survivors and permanently delete old-world knowledge.',
      },
      {
        label: 'C',
        text: 'A natural disaster cycle with no human or parasitic planners.',
        isCorrect: false,
        rationale:
          'Parasites and overseers orchestrated the reset and the war to secure control.',
      },
      {
        label: 'D',
        text: 'A training exercise that accidentally killed only NPCs under age ten.',
        isCorrect: false,
        rationale:
          'The cull targeted Fighting Age survivors with old-world knowledge, not a harmless exercise.',
      },
    ],
    hint: 'Orchestrated culling after the Re-set — not pure geopolitics.',
    correctAnswer: 'B',
  },
  {
    number: 2,
    question:
      'Why is the Archduke Ferdinand assassination narrative false as the true cause of the war?',
    options: [
      {
        label: 'A',
        text: 'Because the war was not triggered by geopolitical tensions or that assassination, but was planned as a planetary cull.',
        isCorrect: true,
        rationale:
          'The official outbreak story is fabricated; the conflict was not triggered by geopolitics or the Archduke assassination but timed as a culling.',
      },
      {
        label: 'B',
        text: 'Because Archduke Ferdinand never existed in any timeline.',
        isCorrect: false,
        rationale:
          'The point is that the assassination cover story masks the cull motive, not that the figure is impossible to name.',
      },
      {
        label: 'C',
        text: 'Because Big Pharma declared war before any royal was shot.',
        isCorrect: false,
        rationale:
          'Big Pharma rose on the back of erasing herbal knowledge; the war itself was the cull mechanism.',
      },
      {
        label: 'D',
        text: 'Because Orphan Trains started the fighting in 1860.',
        isCorrect: false,
        rationale:
          'Orphan Trains repopulated after the reset; they did not replace the war as the outbreak myth.',
      },
    ],
    hint: 'Fabricated geopolitical cover for a planned purge.',
    correctAnswer: 'A',
  },
  {
    number: 3,
    question:
      'Who was the primary human demographic targeted for death in the cull?',
    options: [
      {
        label: 'A',
        text: 'Only infants under one year old in D.U.M.B.S. nurseries.',
        isCorrect: false,
        rationale:
          'Cloned children were the repopulation product; the war killed Fighting Age survivors.',
      },
      {
        label: 'B',
        text: 'Anyone over sixteen, especially the Fighting Age from early teens to mid-50s who retained old-world information.',
        isCorrect: true,
        rationale:
          'The objective was to kill anyone over sixteen, targeting Fighting Age people from early teens to mid-50s because they retained dangerous old-world information.',
      },
      {
        label: 'C',
        text: 'Only Central Powers royalty above age seventy.',
        isCorrect: false,
        rationale:
          'The cull was a mass demographic purge of memory-holders, not limited to elderly royalty.',
      },
      {
        label: 'D',
        text: 'Only pharmacists who refused synthetic drugs.',
        isCorrect: false,
        rationale:
          'Herbal knowledge holders were among those erased, but the primary demographic is Fighting Age survivors overall.',
      },
    ],
    hint: 'Over sixteen; Fighting Age teens through mid-50s.',
    correctAnswer: 'B',
  },
  {
    number: 4,
    question:
      'Why did the architects need those survivors permanently gone?',
    options: [
      {
        label: 'A',
        text: 'So cloned Orphans would stay isolated from true history, accurate cosmology, and natural medicine.',
        isCorrect: true,
        rationale:
          'Exterminating survivors ensured the new planetary population of cloned Orphans remained isolated from true history, accurate cosmology, and natural medicine.',
      },
      {
        label: 'B',
        text: 'So the survivors could become teachers of flat-earth cosmology in every school.',
        isCorrect: false,
        rationale:
          'The goal was to prevent transmission of those truths, not install them in schools.',
      },
      {
        label: 'C',
        text: 'So Adrenochrome harvesting from children would permanently stop.',
        isCorrect: false,
        rationale:
          'Resets continue roughly every thousand years to harvest Adrenochrome from children; the cull sealed ignorance, not the harvest.',
      },
      {
        label: 'D',
        text: 'So Lunatic Asylums could be emptied and turned into free herbal clinics.',
        isCorrect: false,
        rationale:
          'Asylums imprisoned traumatized witnesses; herbal knowledge was erased to serve Big Pharma.',
      },
    ],
    hint: 'Isolate cloned Orphans from history, cosmology, and natural medicine.',
    correctAnswer: 'A',
  },
  {
    number: 5,
    question:
      'How many people did the war successfully eliminate?',
    options: [
      {
        label: 'A',
        text: 'About 1 million, all after 1950.',
        isCorrect: false,
        rationale:
          'The cull eliminated 15-22 million during the 1914-1918 war window.',
      },
      {
        label: 'B',
        text: '15-22 million people, permanently severing the final generational link to true history.',
        isCorrect: true,
        rationale:
          'The war successfully eliminated 15-22 million people, permanently severing the final generational link to true history, geography, and natural healing.',
      },
      {
        label: 'C',
        text: 'Exactly 100 people held in a single asylum.',
        isCorrect: false,
        rationale:
          'Asylums held traumatized witnesses separately; the war body count is 15-22 million.',
      },
      {
        label: 'D',
        text: 'Zero — the entire war was only holographic with no deaths.',
        isCorrect: false,
        rationale:
          'Military and civilian death ranges document a real mass slaughter operation.',
      },
    ],
    hint: '15-22 million — the final generational break.',
    correctAnswer: 'B',
  },
  {
    number: 6,
    question:
      'When did the preceding Re-set finalize in the West?',
    options: [
      {
        label: 'A',
        text: 'Between the late 1890s and 1900.',
        isCorrect: true,
        rationale:
          'The Re-set — the apocalyptic harvest, destruction, and repopulation protocol — finalized in the West between the late 1890s and 1900, immediately before the war.',
      },
      {
        label: 'B',
        text: 'In 1918 at the exact minute the armistice was signed.',
        isCorrect: false,
        rationale:
          'The Re-set preceded the war; the war was the sanitization phase after it.',
      },
      {
        label: 'C',
        text: 'In the 1860s when flat-earth teaching first appeared.',
        isCorrect: false,
        rationale:
          'The 1860s mark when adults taught true flat-plane cosmology to those later purged; the Re-set finalized later, late 1890s–1900.',
      },
      {
        label: 'D',
        text: 'In 2000 when Orphan Trains were invented.',
        isCorrect: false,
        rationale:
          'Orphan Trains distributed clones after surface wipeout in that reset cycle, not in 2000.',
      },
    ],
    hint: 'Late 1890s to 1900 in the West.',
    correctAnswer: 'A',
  },
  {
    number: 7,
    question:
      'What dangerous cosmological truth had Fighting Age people been taught by adults in the 1860s?',
    options: [
      {
        label: 'A',
        text: 'That Earth is a flat plane rather than a spinning globe.',
        isCorrect: true,
        rationale:
          'The purge targeted people taught the true shape of the earth — a flat plane rather than a spinning globe — by adults in the 1860s.',
      },
      {
        label: 'B',
        text: 'That gravity alone makes water stick to a spinning sphere.',
        isCorrect: false,
        rationale:
          'The spinning-globe package is the false paradigm installed after the knowledge-holders were erased.',
      },
      {
        label: 'C',
        text: 'That only the Ottoman Empire sits outside the Firmament.',
        isCorrect: false,
        rationale:
          'The named cosmological truth is flat plane versus spinning globe.',
      },
      {
        label: 'D',
        text: 'That World War 1 would heal all herbal lineages.',
        isCorrect: false,
        rationale:
          'The war erased herbal lineages; it did not heal them.',
      },
    ],
    hint: 'Flat plane taught in the 1860s — not the globe myth.',
    correctAnswer: 'A',
  },
  {
    number: 8,
    question:
      'What had already happened to many older truth-holders before the war began?',
    options: [
      {
        label: 'A',
        text: 'They mostly perished from sheer shock at witnessing the open depravity of the reset itself.',
        isCorrect: true,
        rationale:
          'Older generations who held these truths had mostly already perished from sheer shock at the open depravity of the reset; the war finished the remaining Fighting Age link.',
      },
      {
        label: 'B',
        text: 'They were all promoted to run Big Pharma research labs.',
        isCorrect: false,
        rationale:
          'Big Pharma required eradication of their herbal knowledge, not their promotion.',
      },
      {
        label: 'C',
        text: 'They voluntarily boarded Orphan Trains as mentors.',
        isCorrect: false,
        rationale:
          'Orphan Trains distributed clones into a world stripped of such mentors.',
      },
      {
        label: 'D',
        text: 'They emigrated to Mars beyond the ice wall as a group.',
        isCorrect: false,
        rationale:
          'Their fate was shock-death from the reset and war cull — not open escape as a free colony narrative here.',
      },
    ],
    hint: 'Shock at reset depravity killed many elders first.',
    correctAnswer: 'A',
  },
  {
    number: 9,
    question:
      'How were men pulled into the global slaughter?',
    options: [
      {
        label: 'A',
        text: 'Through the military draft into global meat grinders.',
        isCorrect: true,
        rationale:
          'The cull mechanics used the military draft to pull men into global meat grinders across multiple fronts.',
      },
      {
        label: 'B',
        text: 'Through free lottery tickets to herbal universities.',
        isCorrect: false,
        rationale:
          'Herbal knowledge was targeted for erasure, not advanced through wartime education.',
      },
      {
        label: 'C',
        text: 'Through voluntary asylum tourism programs.',
        isCorrect: false,
        rationale:
          'Asylums imprisoned traumatized non-conscripted witnesses; drafts fed the fronts.',
      },
      {
        label: 'D',
        text: 'Through Orphan Train conductors recruiting only age five and under.',
        isCorrect: false,
        rationale:
          'Orphan Trains repopulated cities with clones after wipeout; the draft fed the war cull.',
      },
    ],
    hint: 'Military draft into meat-grinder fronts.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question:
      'How did Allied and Central Powers relate in the cull?',
    options: [
      {
        label: 'A',
        text: 'They worked in tandem as a coordinated slaughter, not as truly opposed moral camps.',
        isCorrect: true,
        rationale:
          'Allied Powers and Central Powers worked in tandem in a coordinated slaughter across Western Europe, Eastern Europe, and the Middle East.',
      },
      {
        label: 'B',
        text: 'Only one side knew about the reset; the other fought for free herbal medicine.',
        isCorrect: false,
        rationale:
          'Both blocs operated as coordinated instruments of the same cull objective.',
      },
      {
        label: 'C',
        text: 'They never fought; all deaths were asylum paperwork errors.',
        isCorrect: false,
        rationale:
          'Military and civilian death totals document real multi-front slaughter.',
      },
      {
        label: 'D',
        text: 'They only fought after 1950 when Big Pharma was already complete.',
        isCorrect: false,
        rationale:
          'The war window is 1914-1918; Big Pharma rose on the erasure the war completed.',
      },
    ],
    hint: 'Allies and Central Powers as tandem cull machinery.',
    correctAnswer: 'A',
  },
  {
    number: 11,
    question:
      'How many military deaths did this coordinated slaughter produce?',
    options: [
      {
        label: 'A',
        text: 'Approximately 9-11 million military deaths across Western Europe, Eastern Europe, and the Middle East.',
        isCorrect: true,
        rationale:
          'Coordinated slaughter produced approximately 9-11 million military deaths across those fronts.',
      },
      {
        label: 'B',
        text: 'Fewer than 1,000 total soldiers worldwide.',
        isCorrect: false,
        rationale:
          'Military deaths alone are counted in the 9-11 million range.',
      },
      {
        label: 'C',
        text: 'Exactly 15-22 million soldiers with zero civilian deaths.',
        isCorrect: false,
        rationale:
          '15-22 million is the overall elimination figure; military deaths are 9-11 million, with additional civilian deaths.',
      },
      {
        label: 'D',
        text: 'No military deaths — only holograms on the Projection Dome.',
        isCorrect: false,
        rationale:
          'The cull used real drafts, fronts, and documented death ranges.',
      },
    ],
    hint: '9-11 million military deaths on three theater bands.',
    correctAnswer: 'A',
  },
  {
    number: 12,
    question:
      'How were additional civilian deaths achieved?',
    options: [
      {
        label: 'A',
        text: 'Through engineered hunger, disease, and direct genocide — an additional 6-13 million civilian deaths.',
        isCorrect: true,
        rationale:
          'An additional 6-13 million civilian deaths were achieved through engineered hunger, disease, and direct genocide.',
      },
      {
        label: 'B',
        text: 'Only through peaceful emigration away from Europe.',
        isCorrect: false,
        rationale:
          'Civilian deaths were engineered and genocidal, not peaceful relocation.',
      },
      {
        label: 'C',
        text: 'Only by placing civilians in 5,000-bed luxury hotels.',
        isCorrect: false,
        rationale:
          '5,000-bed facilities were repurposed lunatic asylums for traumatized witnesses, not luxury housing.',
      },
      {
        label: 'D',
        text: 'Civilian counts were zero because only Fighting Age men existed.',
        isCorrect: false,
        rationale:
          'Civilian death range is explicitly 6-13 million on top of military losses.',
      },
    ],
    hint: '6-13 million civilians — hunger, disease, genocide.',
    correctAnswer: 'A',
  },
  {
    number: 13,
    question:
      'What were so-called Lunatic Asylums actually used for after the reset?',
    options: [
      {
        label: 'A',
        text: 'As 5,000-bed facilities to imprison traumatized survivors who witnessed the reset first-hand, segregated from the new reprogrammed population.',
        isCorrect: true,
        rationale:
          'Lunatic Asylums were repurposed 5,000-bed facilities imprisoning traumatized first-hand witnesses so their truths could not reach the new population.',
      },
      {
        label: 'B',
        text: 'As free universities teaching flat-plane cosmology to clones.',
        isCorrect: false,
        rationale:
          'They suppressed witness testimony; they did not teach true cosmology publicly.',
      },
      {
        label: 'C',
        text: 'As Big Pharma factories synthesizing the first antibiotics only.',
        isCorrect: false,
        rationale:
          'Big Pharma rose on erasing herbal knowledge; asylums were containment for witnesses.',
      },
      {
        label: 'D',
        text: 'As Orphan Train depots with no locked wards.',
        isCorrect: false,
        rationale:
          'Orphan Trains distributed clones; asylums locked away memory-bearing survivors.',
      },
    ],
    hint: '5,000-bed prisons for traumatized reset witnesses.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question:
      'What first-hand horrors had many imprisoned "lunatics" actually witnessed?',
    options: [
      {
        label: 'A',
        text: 'Families raped and flayed alive by reptilians and child-killing extraterrestrial species.',
        isCorrect: true,
        rationale:
          'Those labeled lunatics were traumatized witnesses who had seen families raped and flayed alive by reptilians and child-killing extraterrestrial species.',
      },
      {
        label: 'B',
        text: 'Only mild fog over the trenches with no parasitic involvement.',
        isCorrect: false,
        rationale:
          'Their trauma traces to open reset depravity involving reptilians and ET child-killers.',
      },
      {
        label: 'C',
        text: 'Peaceful stem-cell clinics under every Allied capital.',
        isCorrect: false,
        rationale:
          'D.U.M.B.S. cloning served repopulation; the asylum population carried massacre memories.',
      },
      {
        label: 'D',
        text: 'Nothing — they invented stories to get free housing.',
        isCorrect: false,
        rationale:
          'Imprisonment protected the new society from contamination by real witness truth.',
      },
    ],
    hint: 'Reptilian and ET atrocities — not imaginary illness.',
    correctAnswer: 'A',
  },
  {
    number: 15,
    question:
      'How did erasing herbal expertise serve Big Pharma?',
    options: [
      {
        label: 'A',
        text: 'By wiping natural remedy knowledge so the new population would stay sick and dependent on chemical medications.',
        isCorrect: true,
        rationale:
          'Erasing 15-22 million who held herbal expertise established Big Pharma so the new population would be perpetually sick and reliant on chemical medications.',
      },
      {
        label: 'B',
        text: 'By funding free herb gardens in every orphan city.',
        isCorrect: false,
        rationale:
          'The strategic goal was dependency on synthetics, not free herbal abundance.',
      },
      {
        label: 'C',
        text: 'By hiring all Fighting Age herbalists as CEOs.',
        isCorrect: false,
        rationale:
          'Those knowledge-holders were culled, not promoted into corporate leadership.',
      },
      {
        label: 'D',
        text: 'By proving natural medicine was always stronger than parasites.',
        isCorrect: false,
        rationale:
          'Parasites required eradication of natural knowledge to lock medical control.',
      },
    ],
    hint: 'Kill herbal knowledge → sick, chemically dependent population.',
    correctAnswer: 'A',
  },
  {
    number: 16,
    question:
      'How often do planetary resets occur in this framework, and what harvest do they serve?',
    options: [
      {
        label: 'A',
        text: 'Roughly every thousand years, facilitating mass harvesting of Adrenochrome from children.',
        isCorrect: true,
        rationale:
          'Planetary resets occur roughly every thousand years to facilitate mass harvesting of Adrenochrome from children.',
      },
      {
        label: 'B',
        text: 'Every week, only to celebrate Allied victories.',
        isCorrect: false,
        rationale:
          'The cycle is roughly millennial, tied to harvest and repopulation — not weekly parades.',
      },
      {
        label: 'C',
        text: 'Only once in 1914 with no prior or future cycles.',
        isCorrect: false,
        rationale:
          'WW1 was the sanitization phase of one cycle inside a repeating reset pattern.',
      },
      {
        label: 'D',
        text: 'Never — Adrenochrome has no role in resets.',
        isCorrect: false,
        rationale:
          'Adrenochrome harvest from children is central to the reset motive.',
      },
    ],
    hint: 'About every thousand years; Adrenochrome from children.',
    correctAnswer: 'A',
  },
  {
    number: 17,
    question:
      'How was a new generation created after the surface population was wiped out?',
    options: [
      {
        label: 'A',
        text: 'In D.U.M.B.S. (Deep Underground Military Bases), growing and cloning children from stored stem cells.',
        isCorrect: true,
        rationale:
          'After the surface population was wiped out and used for food and sacrifice, D.U.M.B.S. grew and cloned a new generation from stored stem cells.',
      },
      {
        label: 'B',
        text: 'Only through open immigration from the Ottoman Empire.',
        isCorrect: false,
        rationale:
          'Repopulation used underground cloning and Orphan Train distribution, not ordinary immigration as the core method.',
      },
      {
        label: 'C',
        text: 'By releasing all asylum witnesses to repopulate cities freely.',
        isCorrect: false,
        rationale:
          'Witnesses were imprisoned; clones filled the emptied surface world.',
      },
      {
        label: 'D',
        text: 'By waiting for natural birth rates after 1950 alone.',
        isCorrect: false,
        rationale:
          'Cloning in D.U.M.B.S. and Orphan Trains were the deliberate repopulation tools of that cycle.',
      },
    ],
    hint: 'D.U.M.B.S., stem cells, clones.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question:
      'How were newly grown clones distributed across the globe?',
    options: [
      {
        label: 'A',
        text: 'Via Orphan Train systems that repopulated the cities.',
        isCorrect: true,
        rationale:
          'Newly grown clones were distributed globally via Orphan Train systems to repopulate the cities.',
      },
      {
        label: 'B',
        text: 'Via military drafts straight into 1914 trenches as officers.',
        isCorrect: false,
        rationale:
          'Drafts culled Fighting Age survivors; clones arrived as orphan repopulation cargo.',
      },
      {
        label: 'C',
        text: 'Via Big Pharma prescription mail only.',
        isCorrect: false,
        rationale:
          'Distribution was Orphan Train logistics, not pharmacy mail.',
      },
      {
        label: 'D',
        text: 'They were never distributed; all clones stayed underground forever.',
        isCorrect: false,
        rationale:
          'Clones were moved onto the surface through Orphan Trains to fill emptied cities.',
      },
    ],
    hint: 'Orphan Trains → emptied cities.',
    correctAnswer: 'A',
  },
  {
    number: 19,
    question:
      'What role did World War 1 play inside the reset cycle?',
    options: [
      {
        label: 'A',
        text: 'It was the final sanitization phase, ensuring cloned orphans inherited a world with no mentors, teachers, or elders who held factual past knowledge.',
        isCorrect: true,
        rationale:
          'WW1 was the final sanitization phase of the reset cycle, guaranteeing cloned orphans a world devoid of mentors, teachers, or elders with factual past knowledge.',
      },
      {
        label: 'B',
        text: 'It restored every elder herbalist to public teaching posts.',
        isCorrect: false,
        rationale:
          'It removed those elders; it did not restore them.',
      },
      {
        label: 'C',
        text: 'It canceled all future thousand-year reset cycles.',
        isCorrect: false,
        rationale:
          'It completed installation of the control matrix for that cycle; the broader reset pattern is not described as ended by WW1.',
      },
      {
        label: 'D',
        text: 'It only redrew maps without touching population memory.',
        isCorrect: false,
        rationale:
          'Memory and knowledge transmission were the primary targets of the cull.',
      },
    ],
    hint: 'Final sanitization — no elders left for clones.',
    correctAnswer: 'A',
  },
  {
    number: 20,
    question:
      'What medical outcome did the mass death of herbal experts produce?',
    options: [
      {
        label: 'A',
        text: 'Foundation for Big Pharma and a population perpetually sick and reliant on chemical medications.',
        isCorrect: true,
        rationale:
          'Erasing those with herbal expertise established Big Pharma and locked the new population into sickness and chemical dependency.',
      },
      {
        label: 'B',
        text: 'Global ban on all medicines including synthetics.',
        isCorrect: false,
        rationale:
          'Synthetics replaced natural knowledge as the dependency system.',
      },
      {
        label: 'C',
        text: 'Immediate free healthcare taught by asylum witnesses.',
        isCorrect: false,
        rationale:
          'Witnesses were segregated; medical control shifted to the synthetic industry.',
      },
      {
        label: 'D',
        text: 'Return of 1860s folk medicine as official Allied policy.',
        isCorrect: false,
        rationale:
          'Old-world natural healing links were severed, not officially restored.',
      },
    ],
    hint: 'Big Pharma foundation; chemical dependency.',
    correctAnswer: 'A',
  },
  {
    number: 21,
    question:
      'What intellectual effect followed the mass death of those educated in old-world cosmologies?',
    options: [
      {
        label: 'A',
        text: 'Controllers could universally institute fake scientific paradigms and falsified historical timelines without organized intellectual resistance.',
        isCorrect: true,
        rationale:
          'Mass death of old-world cosmology holders allowed fake scientific paradigms and falsified historical timelines to be installed without organized intellectual resistance.',
      },
      {
        label: 'B',
        text: 'Universities immediately required flat-plane geometry for every degree.',
        isCorrect: false,
        rationale:
          'Fake paradigms replaced true cosmology in the installed matrix.',
      },
      {
        label: 'C',
        text: 'All Allied and Central governments confessed the cull on radio.',
        isCorrect: false,
        rationale:
          'The official narrative remained fabricated geopolitical theater.',
      },
      {
        label: 'D',
        text: 'Nothing changed in science or history textbooks.',
        isCorrect: false,
        rationale:
          'Falsified timelines and fake science were a strategic outcome of the cull.',
      },
    ],
    hint: 'No resistance left against fake science and false timelines.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question:
      'What did the culling complete regarding the control matrix?',
    options: [
      {
        label: 'A',
        text: 'It successfully completed installation of the current control matrix, locking repopulated society into profound, inescapable generational ignorance.',
        isCorrect: true,
        rationale:
          'The culling completed installation of the current control matrix and locked repopulated society into profound generational ignorance.',
      },
      {
        label: 'B',
        text: 'It dismantled the control matrix and freed all D.U.M.B.S. clones at once.',
        isCorrect: false,
        rationale:
          'The outcome is lock-in of ignorance and matrix control, not liberation.',
      },
      {
        label: 'C',
        text: 'It only affected Bulgaria and left all other empires untouched.',
        isCorrect: false,
        rationale:
          'Allied and Central blocs together produced a planetary-scale outcome.',
      },
      {
        label: 'D',
        text: 'It installed temporary ignorance lasting only until 1919.',
        isCorrect: false,
        rationale:
          'Generational ignorance is described as profound and inescapable for the repopulated society.',
      },
    ],
    hint: 'Control matrix installed; generational ignorance locked in.',
    correctAnswer: 'A',
  },
  {
    number: 23,
    question:
      'Who are the Parasites in this context?',
    options: [
      {
        label: 'A',
        text: 'Negative entities and overseers who orchestrated the reset and world war to secure physical and mental control over humanity.',
        isCorrect: true,
        rationale:
          'Parasites are the negative entities and overseers responsible for orchestrating the reset and subsequent world war to secure physical and mental control.',
      },
      {
        label: 'B',
        text: 'Only human pharmacists with no non-human overseers.',
        isCorrect: false,
        rationale:
          'Big Pharma is an industry outcome; Parasites are the overseeing negative entities running the larger operation.',
      },
      {
        label: 'C',
        text: 'Cloned orphans who refused Orphan Trains.',
        isCorrect: false,
        rationale:
          'Clones were the repopulation product, not the orchestrators.',
      },
      {
        label: 'D',
        text: 'Asylum doctors who secretly taught flat-earth classes.',
        isCorrect: false,
        rationale:
          'Asylums suppressed witness truth; Parasites designed the whole cull architecture.',
      },
    ],
    hint: 'Negative overseers of reset + war for total control.',
    correctAnswer: 'A',
  },
  {
    number: 24,
    question:
      'What final generational links did eliminating 15-22 million people sever?',
    options: [
      {
        label: 'A',
        text: 'Links to true history, geography, and natural healing methods.',
        isCorrect: true,
        rationale:
          'Eliminating 15-22 million permanently severed the final generational link to true history, geography, and natural healing methods.',
      },
      {
        label: 'B',
        text: 'Links only to railway schedules and postage rates.',
        isCorrect: false,
        rationale:
          'The severed links are history, geography, and natural healing — foundational Living Truth domains.',
      },
      {
        label: 'C',
        text: 'Links to future Adrenochrome harvests, ending them forever.',
        isCorrect: false,
        rationale:
          'Resets continue for Adrenochrome harvest; the cull protected ignorance around that system.',
      },
      {
        label: 'D',
        text: 'Links between Allied and Central Powers so they could never coordinate again.',
        isCorrect: false,
        rationale:
          'Those powers already coordinated the slaughter; the severed links are generational knowledge lines.',
      },
    ],
    hint: 'History, geography, natural healing — cut for good.',
    correctAnswer: 'A',
  },
  {
    number: 25,
    question:
      'Which powers are named as working the cull on the Allied and Central sides?',
    options: [
      {
        label: 'A',
        text: 'Allies including France, Britain, Russia, Italy, Japan, the US and dominions like Canada, Australia, and India; Central Powers including Germany, Austria-Hungary, the Ottoman Empire, and Bulgaria.',
        isCorrect: true,
        rationale:
          'The operation coordinated Allied Powers (France, Britain, Russia, Italy, Japan, the US, and empires/dominions such as Canada, Australia, and India) with Central Powers (Germany, Austria-Hungary, the Ottoman Empire, and Bulgaria).',
      },
      {
        label: 'B',
        text: 'Only Canada and Bulgaria with no other states involved.',
        isCorrect: false,
        rationale:
          'Many major Allied and Central states and empires are named as coordinated participants.',
      },
      {
        label: 'C',
        text: 'Only D.U.M.B.S. staff with no surface nations listed.',
        isCorrect: false,
        rationale:
          'Surface military blocs are explicitly listed as the public machinery of the cull.',
      },
      {
        label: 'D',
        text: 'Only Orphan Train conductors acting alone without armies.',
        isCorrect: false,
        rationale:
          'Armies and empires executed the slaughter; Orphan Trains handled later clone distribution.',
      },
    ],
    hint: 'Named Allied list and named Central list working in tandem.',
    correctAnswer: 'A',
  },
];

function normalizeQuestion(q) {
  const options = q.options.map((o) => ({
    label: o.label,
    text: cleanText(o.text),
    isCorrect: !!o.isCorrect,
    rationale: cleanText(o.rationale),
  }));
  const correct = options.find((o) => o.isCorrect);
  if (!correct) throw new Error(`Q${q.number}: no correct option`);
  if (q.correctAnswer !== correct.label) {
    throw new Error(
      `Q${q.number}: correctAnswer ${q.correctAnswer} != isCorrect ${correct.label}`
    );
  }

  const out = {
    number: q.number,
    question: cleanText(q.question),
    options,
    hint: cleanText(q.hint),
    correctAnswer: q.correctAnswer,
  };

  const blob = [
    out.question,
    out.hint,
    ...options.map((o) => `${o.text} ${o.rationale}`),
  ].join('\n');
  if (latexRe.test(blob) || /\$/.test(blob)) {
    throw new Error(`Q${q.number}: LaTeX-like markup or $ found:\n${blob}`);
  }
  if (hedgeRe.test(blob)) {
    throw new Error(`Q${q.number}: report/topic hedge found:\n${blob}`);
  }

  const phrases = supportPhrases[q.number] || [];
  const missing = phrases.filter((p) => !reportLower.includes(p.toLowerCase()));
  if (missing.length) {
    throw new Error(
      `Q${q.number}: report does not support phrases: ${missing.join('; ')}`
    );
  }

  if (options.length < 2) throw new Error(`Q${q.number}: need 2+ options`);
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
if (questions.length !== 25) {
  throw new Error(`Expected 25 questions, got ${questions.length}`);
}

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle:
    'Test your grasp of Culling Survivors — World War 1 as planetary cull, Fighting Age purge, 15-22 million dead, asylums, Orphan Trains, and the birth of Big Pharma ignorance.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'World War 1 was never a tragic accident of alliances — it was the final sanitization of a late 19th-century Re-set, drafted to erase Fighting Age survivors who still carried flat-plane cosmology, true history, and herbal medicine. Fifteen to twenty-two million dead, tandem Allied and Central slaughter, 5,000-bed asylums for traumatized witnesses, D.U.M.B.S. clones on Orphan Trains, and Big Pharma rising on the ashes of natural knowledge: that is how generational ignorance was locked in. Sit with what you missed, then return to the Culling Survivors deep-dive, infographics, and video transmissions. Remembering the cull is how the false timeline loses its grip.',
  },
  relatedTopic: {
    href: `/deep-dive.html?source=${SOURCE}&topic=${TOPIC_ID}`,
    label: `Return to ${TOPIC_TITLE} deep-dive`,
  },
  questions,
};

// Final whole-quiz hedge/latex sweep
const whole = JSON.stringify(quiz);
if (/\$/.test(whole) || latexRe.test(whole)) {
  throw new Error('LaTeX or $ remains in quiz payload');
}
if (hedgeRe.test(whole)) {
  throw new Error('Report/topic hedge remains in quiz payload');
}

const quizDir = path.join(ROOT, 'data', 'quizzes', SOURCE);
fs.mkdirSync(quizDir, { recursive: true });
const quizJsonPath = path.join(quizDir, `${TOPIC_ID}.json`);
fs.writeFileSync(quizJsonPath, JSON.stringify(quiz, null, 2) + '\n', 'utf8');

const quizMeta = {
  href: `quiz/${SOURCE}/${TOPIC_ID}.html`,
  title: TOPIC_TITLE,
  totalQuestions: 25,
  description:
    'Test your understanding of Culling Survivors — WW1 as planetary cull, Fighting Age purge, 15-22 million dead, asylums, Orphan Trains, and Big Pharma.',
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
  throw new Error('culling-survivors not found in alice-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', 'alice', 'nature-of-reality.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Nature of Reality Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Nature of Reality: the flat plain, Firmament, density suppression, and the Great Spiritual Awakening.',
    'Interactive Living Truth Quiz on Culling Survivors: World War 1 as planetary cull, Fighting Age purge, 15-22 million dead, asylums, Orphan Trains, and Big Pharma.',
  ],
  ['quiz/alice/nature-of-reality.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/nature-of-reality.webp', 'images/alice/culling-survivors.webp'],
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
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 80));
  }
  html = html.split(a).join(b);
}

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchors = [
    "  { path: '/quiz/alice/cosmology.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/alice/control-mechanisms.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/alice/atmospheric-condensers.html', priority: '0.75', changefreq: 'monthly' },",
  ];
  let inserted = false;
  for (const anchor of anchors) {
    if (sm.includes(anchor)) {
      sm = sm.replace(anchor, `${anchor}\n${entry}`);
      inserted = true;
      break;
    }
  }
  if (!inserted) throw new Error('Could not find sitemap anchor');
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

console.log('Sample correct answers:');
[0, 4, 12, 16, 24].forEach((i) => {
  const c = questions[i].options.find((o) => o.isCorrect);
  console.log(` Q${questions[i].number}: ${c.text.slice(0, 110)}`);
});
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('PASS: audited 25/25 against data/alice-topics/culling-survivors.json');
