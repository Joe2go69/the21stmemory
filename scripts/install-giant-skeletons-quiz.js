/**
 * Installs Giant Skeletons quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/giant-skeletons.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Run: node scripts/install-giant-skeletons-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'giant-skeletons';
const TOPIC_TITLE = 'Giant Skeletons';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/giants.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['giants', 're-set', 'evolution'],
  2: ['re-set', 'clones', 'orphans'],
  3: ["oopa's", 'advanced civilizations', 'hidden'],
  4: ['12 feet', '35 meters', 'mounds'],
  5: ['smithsonian', 'vatican of archaeology'],
  6: ['freemasons', 'parasitic', 'rewriting history'],
  7: ['railroad magnates', '33rd-degree', 'burial mounds'],
  8: ['nda', 'threats', 'silence'],
  9: ['mudflood', 'soil liquefaction', 'energy weapon'],
  10: ['tartaria', 'dark ages'],
  11: ['10,000', 'american soil'],
  12: ['2 meters', '1.5 meters', '30 meters'],
  13: ['railroads', 'burial mounds', 'train tracks'],
  14: ['smithsonian', 'confiscation', 'deep storage'],
  15: ['newspaper', '1970s', 'microfiche'],
  16: ['police', 'universities', 'smithsonian'],
  17: ['vaults', 'vatican', 'bloodline'],
  18: ['petrified', 'giants', 'energy weapons'],
  19: ['evolution', 'apes', '35-meter'],
  20: ['grand canyon', 'anuk', 'zep tepi'],
  21: ['npc', 'orphans', 'tartary'],
  22: ['lunatic asylums', 'loosh', 'catatonic'],
  23: ['world war 1', '15 to 55', 'natural medicine'],
  24: ['perceived knowledge', 'resets', 'control grid'],
  25: ['harvesting', 'immortal souls', 'oopa'],
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
      'What do Giant skeletal remains prove about official history and Evolution?',
    options: [
      {
        label: 'A',
        text: 'They are profound suppressed evidence of prior epochs after Re-sets — proof of a hidden timeline that shatters the fabricated doctrine of Evolution and linear progress from primitive origins.',
        isCorrect: true,
        rationale:
          'Giants entombed after Re-sets contradict institutional timelines and demolish fabricated Evolution and linear primitive-to-modern progress.',
      },
      {
        label: 'B',
        text: 'They prove apes evolved into modern humans on a spinning globe without interruption.',
        isCorrect: false,
        rationale:
          'Giants and Oopa\'s demolish natural-evolution narrative; controllers hide them because they cannot fit that story.',
      },
      {
        label: 'C',
        text: 'They are only Hollywood props stored openly in every museum lobby.',
        isCorrect: false,
        rationale:
          'They are confiscated into sealed Smithsonian vaults — not open lobby displays.',
      },
      {
        label: 'D',
        text: 'They only appear in freemason textbooks as proof of Dark Ages excellence.',
        isCorrect: false,
        rationale:
          'Tartaria was falsely labeled Dark Ages; freemasons rewrite history and suppress old-world evidence including giants.',
      },
    ],
    hint: 'Hidden-timeline proof after Re-sets — shatters Evolution doctrine.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'What is a Re-set?',
    options: [
      {
        label: 'A',
        text: 'A globally orchestrated catastrophic termination and harvesting of a civilization that wipes knowledge, infrastructure, and adult populations, then repopulates with memory-wiped clones and orphans.',
        isCorrect: true,
        rationale:
          'A Re-set is planned global termination and harvest: wipe knowledge, infrastructure, and adults, then restock with memory-wiped clones and orphans.',
      },
      {
        label: 'B',
        text: 'A gentle museum renovation that displays all giant skeletons publicly.',
        isCorrect: false,
        rationale:
          'Resets bury and erase; institutions confiscate giant evidence rather than display it.',
      },
      {
        label: 'C',
        text: 'Only a railroad schedule change with no population impact.',
        isCorrect: false,
        rationale:
          'Resets terminate civilizations; railroads later slice burial mounds and expose what was buried.',
      },
      {
        label: 'D',
        text: 'Natural evolution speeding up every century without violence.',
        isCorrect: false,
        rationale:
          'Resets are violent orchestrated catastrophes — opposite of peaceful natural-evolution myth.',
      },
    ],
    hint: 'Global cull/harvest → memory-wiped clones and orphans.',
    correctAnswer: 'A',
  },
  {
    number: 3,
    question: "What are Oopa's (Out Of Place Artefacts)?",
    options: [
      {
        label: 'A',
        text: 'Blatant physical evidence and embarrassing technological or biological remnants from highly advanced pre-reset civilizations, deliberately hidden from public view.',
        isCorrect: true,
        rationale:
          "Oopa's are advanced pre-reset tech/biological remnants that embarrass the fake timeline and are deliberately hidden.",
      },
      {
        label: 'B',
        text: 'Official evolution diagrams hung in every school cafeteria.',
        isCorrect: false,
        rationale:
          "Oopa's contradict evolution narrative and are sequestered, not celebrated as curriculum.",
      },
      {
        label: 'C',
        text: 'Only coal tickets issued by Railroad Magnates.',
        isCorrect: false,
        rationale:
          'Railroad Magnates oversee mound cuts and cover-ups; Oopa\'s are anomalous advanced remnants.',
      },
      {
        label: 'D',
        text: 'Lunatic Asylum floor plans with no link to prior epochs.',
        isCorrect: false,
        rationale:
          'Asylums house post-reset traumatized survivors as Loosh batteries; Oopa\'s are pre-reset advanced evidence.',
      },
    ],
    hint: 'Hidden advanced pre-reset remnants — tech and biological.',
    correctAnswer: 'A',
  },
  {
    number: 4,
    question: 'What size range do Giant skeletal remains span?',
    options: [
      {
        label: 'A',
        text: 'Exceptionally large humanoid remains from 12 feet to over 35 meters in height, entombed in mounds across the terrain.',
        isCorrect: true,
        rationale:
          'Giants measure from 12 feet to over 35 meters tall, buried in mounds across the landscape.',
      },
      {
        label: 'B',
        text: 'Only modern athletes under 6 feet cataloged as ordinary graves.',
        isCorrect: false,
        rationale:
          'Scale reaches multi-meter to 35+ meter humanoid skeletons — not ordinary modern graves.',
      },
      {
        label: 'C',
        text: 'Exactly one size: always 2 meters with no variation.',
        isCorrect: false,
        rationale:
          'Remains are highly varied; range runs 12 feet to over 35 meters, plus extreme skull and femur finds.',
      },
      {
        label: 'D',
        text: 'Only animal bones mislabeled as human by newspapers.',
        isCorrect: false,
        rationale:
          'They are humanoid giant remains; newspapers reported discoveries until scrubbed.',
      },
    ],
    hint: '12 feet to over 35 meters — mound-entombed humanoids.',
    correctAnswer: 'A',
  },
  {
    number: 5,
    question: 'What is the Smithsonian Institute in this cover-up?',
    options: [
      {
        label: 'A',
        text: 'The "Vatican of Archaeology," founded and controlled by secret societies to aggressively confiscate, hide, and hoard physical anomalies like giant skeletons.',
        isCorrect: true,
        rationale:
          'Smithsonian functions as secret-society "Vatican of Archaeology" — confiscating and hoarding giants and other anomalies.',
      },
      {
        label: 'B',
        text: 'An independent public vault that free-releases every giant femur.',
        isCorrect: false,
        rationale:
          'Evidence goes into sealed off-limits vaults — opposite of free public release.',
      },
      {
        label: 'C',
        text: 'Only a railroad company that lays tracks without archaeology.',
        isCorrect: false,
        rationale:
          'Railroad Magnates cut mounds; Smithsonian runs confiscation and deep storage.',
      },
      {
        label: 'D',
        text: 'A Tartarian free-energy museum celebrating Dark Ages truth.',
        isCorrect: false,
        rationale:
          'It suppresses pre-reset truth; Tartaria was terminated and mislabeled Dark Ages.',
      },
    ],
    hint: 'Secret-society "Vatican of Archaeology" — confiscate and hoard.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'What role do Freemasons play regarding giants and history?',
    options: [
      {
        label: 'A',
        text: 'A deeply embedded secret society working for parasitic overlords — rewriting history, executing resets, suppressing old-world technology, and monopolizing public knowledge.',
        isCorrect: true,
        rationale:
          'Freemasons serve parasitic overlords by rewriting history, running resets, suppressing old-world tech, and monopolizing public knowledge.',
      },
      {
        label: 'B',
        text: 'Neutral journalists who only publish giant finds without interference.',
        isCorrect: false,
        rationale:
          'They suppress and rewrite; newspaper reports were scrubbed from mainstream discourse.',
      },
      {
        label: 'C',
        text: 'Builders who only restore every Oopa to public parks.',
        isCorrect: false,
        rationale:
          'They suppress old-world technology and evidence rather than restore Oopa\'s publicly.',
      },
      {
        label: 'D',
        text: 'NPC orphans with no rank in railroad or Smithsonian operations.',
        isCorrect: false,
        rationale:
          '33rd-degree freemason Railroad Magnates work lockstep with Smithsonian on cover-ups.',
      },
    ],
    hint: 'Parasitic proxy — rewrite history, run resets, suppress tech.',
    correctAnswer: 'A',
  },
  {
    number: 7,
    question: 'Who were the Railroad Magnates in the giant cover-up?',
    options: [
      {
        label: 'A',
        text: 'High-ranking 33rd-degree Freemasons controlling post-reset coal and steam expansion, directly overseeing unearthing and cover-up of giant burial mounds.',
        isCorrect: true,
        rationale:
          'Railroad Magnates were 33rd-degree freemasons who drove post-reset rail expansion and oversaw giant mound exposure and cover-up.',
      },
      {
        label: 'B',
        text: 'Independent farmers with no freemason rank or Smithsonian link.',
        isCorrect: false,
        rationale:
          'They were uniformly 33rd-degree freemasons working lockstep with the Smithsonian.',
      },
      {
        label: 'C',
        text: 'Only Vatican tour guides with no American land cuts.',
        isCorrect: false,
        rationale:
          'They cut American land for tracks; Vatican-style secrecy is the vault model Smithsonian mirrors.',
      },
      {
        label: 'D',
        text: 'Egyptian Anuk priests openly labeling every mound for tourists.',
        isCorrect: false,
        rationale:
          'Anuk/Egyptian names appear in Grand Canyon cover-up context; railroad magnates are freemason industrial overseers of mound cuts.',
      },
    ],
    hint: '33rd-degree freemasons — rail cuts, mound unearth, cover-up.',
    correctAnswer: 'A',
  },
  {
    number: 8,
    question: 'What is an NDA in the civilian discovery protocol?',
    options: [
      {
        label: 'A',
        text: 'A coercive Non Disclosure Agreement weaponized to silence civilians who find anomalous remains — enforced through severe threats to life, property, and freedom.',
        isCorrect: true,
        rationale:
          'NDAs force silence on discoverers under threats to life, property, and freedom — including prison and family harm.',
      },
      {
        label: 'B',
        text: 'A public press release celebrating giant finds on national television.',
        isCorrect: false,
        rationale:
          'NDAs suppress speech; they do not authorize national celebration of finds.',
      },
      {
        label: 'C',
        text: 'A museum membership card granting vault tours to all citizens.',
        isCorrect: false,
        rationale:
          'Vaults are off-limits except to elite bloodlines and parasitic controllers.',
      },
      {
        label: 'D',
        text: 'A railroad timetable for Orphan Trains only.',
        isCorrect: false,
        rationale:
          'Orphan/NPC repopulation is separate; NDA is the silence tool after accidental giant finds.',
      },
    ],
    hint: 'Coercive silence contract — threats to life, property, freedom.',
    correctAnswer: 'A',
  },
  {
    number: 9,
    question: 'What is a Mudflood in reset mechanics?',
    options: [
      {
        label: 'A',
        text: 'Mass soil liquefaction from advanced extraterrestrial energy weapons, intentionally burying lower levels of grand old-world architecture during a reset.',
        isCorrect: true,
        rationale:
          'Mudflood is ET energy-weapon soil liquefaction used in resets to bury grand old-world architecture.',
      },
      {
        label: 'B',
        text: 'Gentle rain that cleans giant bones for Smithsonian display.',
        isCorrect: false,
        rationale:
          'It is weaponized burial technology — not gentle museum cleaning rain.',
      },
      {
        label: 'C',
        text: 'Only newspaper ink flooding microfiche rooms in the 1970s.',
        isCorrect: false,
        rationale:
          'Mudflood is physical landscape liquefaction; newspapers recorded giant finds before scrubbing.',
      },
      {
        label: 'D',
        text: 'Natural evolution of rivers inventing burial mounds slowly.',
        isCorrect: false,
        rationale:
          'Burial of architecture is intentional reset weaponry, not slow natural evolution.',
      },
    ],
    hint: 'ET energy weapons → soil liquefaction → bury old-world architecture.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'What was Tartaria / Great Tartary, and how was it labeled after termination?',
    options: [
      {
        label: 'A',
        text: 'A globally unified, highly advanced civilization of aesthetic and technological excellence abruptly terminated by a reset and falsely labeled the "Dark Ages."',
        isCorrect: true,
        rationale:
          'Great Tartary was advanced global civilization killed by reset, then falsely branded as the Dark Ages.',
      },
      {
        label: 'B',
        text: 'A freemason invention that never had architecture or technology.',
        isCorrect: false,
        rationale:
          'It was real advanced civilization; freemasons suppress old-world tech and rewrite the aftermath.',
      },
      {
        label: 'C',
        text: 'Only the Smithsonian\'s public wing for giant skeleton tourism.',
        isCorrect: false,
        rationale:
          'Smithsonian hides anomalies; Tartaria is the terminated advanced epoch.',
      },
      {
        label: 'D',
        text: 'A 1970s newspaper brand with no civilizational scale.',
        isCorrect: false,
        rationale:
          'Newspapers reported giant finds; Tartaria is the pre-reset global civilization itself.',
      },
    ],
    hint: 'Advanced global civilization — reset, then fake "Dark Ages" label.',
    correctAnswer: 'A',
  },
  {
    number: 11,
    question:
      'How many Giant remains were recovered from American soil alone?',
    options: [
      {
        label: 'A',
        text: 'Over 10,000 Giant remains systematically recovered from American soil alone.',
        isCorrect: true,
        rationale:
          'American soil alone yielded over 10,000 systematically recovered Giant remains.',
      },
      {
        label: 'B',
        text: 'Exactly three skeletons under 6 feet total nationwide.',
        isCorrect: false,
        rationale:
          'Scale is over 10,000 remains — not a handful of ordinary bones.',
      },
      {
        label: 'C',
        text: 'Zero — all finds were declared hoaxes before any recovery.',
        isCorrect: false,
        rationale:
          'Mass recovery happened; then Smithsonian confiscation and vaulting followed.',
      },
      {
        label: 'D',
        text: 'Only newspaper drawings with no physical recoveries.',
        isCorrect: false,
        rationale:
          'Physical skeletons were unearthed and confiscated; newspapers also documented finds.',
      },
    ],
    hint: 'Over 10,000 from American soil alone.',
    correctAnswer: 'A',
  },
  {
    number: 12,
    question:
      'What extreme isolated measurements are cited for skulls and femurs?',
    options: [
      {
        label: 'A',
        text: 'Massive human skulls about 2 meters tall by 1.5 meters wide, and human femurs reaching up to 30 meters in length — within overall skeletons from 12 feet to 35+ meters.',
        isCorrect: true,
        rationale:
          'Isolated finds include ~2m by 1.5m skulls and femurs up to 30m, with full skeletons from 12 feet to 35+ meters.',
      },
      {
        label: 'B',
        text: 'Only mouse-sized bones used to invent evolution textbooks.',
        isCorrect: false,
        rationale:
          'Cited proportions are multi-meter skulls and extreme-length femurs of giants.',
      },
      {
        label: 'C',
        text: 'Skulls always under 20 centimeters with no femur anomalies.',
        isCorrect: false,
        rationale:
          'Skulls reach ~2m tall by 1.5m wide — staggering proportions.',
      },
      {
        label: 'D',
        text: 'Femurs only 30 centimeters as proof of ape-to-human progress.',
        isCorrect: false,
        rationale:
          'Femurs up to 30 meters demolish the ape-evolution story rather than support it.',
      },
    ],
    hint: 'Skulls ~2m x 1.5m; femurs up to 30m; bodies 12ft–35m+.',
    correctAnswer: 'A',
  },
  {
    number: 13,
    question:
      'How did railroad expansion become a catalyst for giant discoveries?',
    options: [
      {
        label: 'A',
        text: 'Rail lines cut through vast land; large hills unknown to repopulated masses as ancient burial mounds were sliced in half for tracks, exposing multiple giants of varying sizes in the same earthen structures.',
        isCorrect: true,
        rationale:
          'Post-reset rail cuts bisected unrecognized burial mounds and exposed multiple giants entombed in those hills.',
      },
      {
        label: 'B',
        text: 'Trains carefully avoided every mound so no bones were ever seen.',
        isCorrect: false,
        rationale:
          'Industrial incisions through mounds are exactly what exposed the entombed giants.',
      },
      {
        label: 'C',
        text: 'Only tunnels under the Vatican with no American land cuts.',
        isCorrect: false,
        rationale:
          'The catalyst described is American railroad expansion through burial-mound hills.',
      },
      {
        label: 'D',
        text: 'Rails were laid only on ice walls with no earthen mounds.',
        isCorrect: false,
        rationale:
          'Cuts went through earthen hills that were ancient burial mounds.',
      },
    ],
    hint: 'Track cuts slice burial-mound hills — giants exposed inside.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question:
      'What happened every time a giant skeleton was unearthed under railroad/Smithsonian coordination?',
    options: [
      {
        label: 'A',
        text: 'Immediate confiscation by the Smithsonian so physical evidence vanished into deep storage before public awareness could take root.',
        isCorrect: true,
        rationale:
          'Each unearthing triggered immediate Smithsonian confiscation into deep storage before the public could awaken to it.',
      },
      {
        label: 'B',
        text: 'National holidays with free school tours of every skeleton.',
        isCorrect: false,
        rationale:
          'Suppression prevented public awareness — not celebration.',
      },
      {
        label: 'C',
        text: 'Railroad Magnates published full measurements in evolution journals.',
        isCorrect: false,
        rationale:
          'Magnates worked lockstep with Smithsonian to make evidence vanish — not to publish it as evolution proof.',
      },
      {
        label: 'D',
        text: 'Bones were left in place as tourist stops on every line.',
        isCorrect: false,
        rationale:
          'Evidence was removed to deep storage, not left as public tourism.',
      },
    ],
    hint: 'Immediate Smithsonian confiscation → deep storage.',
    correctAnswer: 'A',
  },
  {
    number: 15,
    question:
      'What documentary trail survived despite the cover-up scale?',
    options: [
      {
        label: 'A',
        text: 'Hundreds of early United States newspaper microfiche slides, stretching well into the 1970s, with explicit reports of giant discoveries before aggressive scrubbing from mainstream discourse.',
        isCorrect: true,
        rationale:
          'Hundreds of U.S. newspaper microfiche reports into the 1970s documented giant finds before mainstream scrubbing.',
      },
      {
        label: 'B',
        text: 'Zero documents — no paper ever mentioned giants anywhere.',
        isCorrect: false,
        rationale:
          'Explicit newspaper reports existed and were later scrubbed from mainstream channels.',
      },
      {
        label: 'C',
        text: 'Only Smithsonian press kits admitting all vault contents since 1900.',
        isCorrect: false,
        rationale:
          'Smithsonian sequesters evidence; the surviving trail is early newspaper microfiche.',
      },
      {
        label: 'D',
        text: 'Live television from sub-basement vaults every decade.',
        isCorrect: false,
        rationale:
          'Vaults are strictly off-limits; newspapers were the leaked documentary trail.',
      },
    ],
    hint: 'Hundreds of U.S. newspaper microfiche reports into the 1970s.',
    correctAnswer: 'A',
  },
  {
    number: 16,
    question:
      'What is the civilian confiscation chain when someone finds a giant remain?',
    options: [
      {
        label: 'A',
        text: 'Citizen calls police → universities notified → Smithsonian or London counterparts alerted → recovery teams arrive within hours, seize photos, force strict NDA, and threaten imprisonment, property loss, and family harm for silence breaks.',
        isCorrect: true,
        rationale:
          'Protocol escalates police → university → Smithsonian/London, then hours-scale seizure of photos, forced NDA, and severe threats to enforce silence.',
      },
      {
        label: 'B',
        text: 'Citizen keeps the skull and opens a roadside museum the same day with state funding.',
        isCorrect: false,
        rationale:
          'All photographic evidence is surrendered under NDA threat — not funded as public museums.',
      },
      {
        label: 'C',
        text: 'Police ignore finds and never contact any institution.',
        isCorrect: false,
        rationale:
          'Police escalate anomalies to universities, which notify Smithsonian networks.',
      },
      {
        label: 'D',
        text: 'Only freemason newspapers print the address for free public digs.',
        isCorrect: false,
        rationale:
          'Freemason/Smithsonian apparatus confiscates; it does not organize free public digs.',
      },
    ],
    hint: 'Police → university → Smithsonian → NDA + threats within hours.',
    correctAnswer: 'A',
  },
  {
    number: 17,
    question: 'Where do confiscated giants and Oopa\'s go?',
    options: [
      {
        label: 'A',
        text: 'Sealed vaults beneath the Smithsonian — like the 13 hidden subterranean levels beneath the Vatican — off-limits to the public and open only to elite bloodline members and parasitic controllers.',
        isCorrect: true,
        rationale:
          'Giants and Oopa\'s go to sealed Smithsonian sub-basement vaults, Vatican-style, accessible only to elite bloodlines and parasitic controllers.',
      },
      {
        label: 'B',
        text: 'Open city parks labeled as evolution teaching gardens.',
        isCorrect: false,
        rationale:
          'Vaults are strictly off-limits — not open evolution gardens.',
      },
      {
        label: 'C',
        text: 'Orphan Train luggage racks for cloned children to study.',
        isCorrect: false,
        rationale:
          'Orphans are trained into false history; physical giants are vaulted, not study kits for clones.',
      },
      {
        label: 'D',
        text: 'Grand Canyon gift shops selling Anuk name magnets only.',
        isCorrect: false,
        rationale:
          'Grand Canyon evidence of pre-reset occupation was declared hoax; vault sequestration is the storage end-state.',
      },
    ],
    hint: 'Smithsonian sealed vaults — elite/parasite access only.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question:
      'Besides Mudflood burial, what can reset energy weapons do to biological entities including Giants?',
    options: [
      {
        label: 'A',
        text: 'Directed frequencies can instantly fuse incompatible materials or turn biological entities — Giants, humans, trees, and everyday objects like hats and books — into petrified stone.',
        isCorrect: true,
        rationale:
          'Reset energy weapons alter molecular/subatomic cohesion — fusing materials or petrifying Giants, humans, trees, hats, books, and more.',
      },
      {
        label: 'B',
        text: 'They only gently clean newspapers for microfiche storage.',
        isCorrect: false,
        rationale:
          'Weapons liquefy soil and petrify biology — not gentle archival cleaning.',
      },
      {
        label: 'C',
        text: 'They heal giant bones into living freemason guides.',
        isCorrect: false,
        rationale:
          'Effect is petrification and destruction, not healing into guides.',
      },
      {
        label: 'D',
        text: 'They only affect coal and steam engines on railroads.',
        isCorrect: false,
        rationale:
          'Targets include biological entities and everyday objects, not just rail engines.',
      },
    ],
    hint: 'Petrify Giants/humans/trees/objects — fuse materials.',
    correctAnswer: 'A',
  },
  {
    number: 19,
    question:
      'Why do Giants and advanced Oopa\'s demolish the fake evolutionary timeline?',
    options: [
      {
        label: 'A',
        text: 'Controllers cannot explain 35-meter skeletons or advanced fossilized texts in a story of apes evolving into modern humans on a spinning globe — so they sweep evidence under the rug to prevent awakening.',
        isCorrect: true,
        rationale:
          '35m skeletons and advanced fossilized texts cannot fit ape-to-human globe evolution, so evidence is buried to block public awakening.',
      },
      {
        label: 'B',
        text: 'Because evolution already predicted 35-meter humans in every textbook.',
        isCorrect: false,
        rationale:
          'Official narrative cannot explain them — that is why suppression is required.',
      },
      {
        label: 'C',
        text: 'Because freemasons want more giants displayed to prove Darwin weekly.',
        isCorrect: false,
        rationale:
          'Freemasons rewrite history and suppress old-world evidence; they do not prove Darwin with vaulted giants.',
      },
      {
        label: 'D',
        text: 'Because Mudflood only creates new species of apes overnight.',
        isCorrect: false,
        rationale:
          'Mudflood buries architecture; giants demolish evolution rather than create new ape chapters.',
      },
    ],
    hint: '35m skeletons + advanced texts ≠ ape-to-human globe story.',
    correctAnswer: 'A',
  },
  {
    number: 20,
    question: 'What is suppressed about the Grand Canyon region?',
    options: [
      {
        label: 'A',
        text: 'Egyptian and Anuk (Anunnaki) names on landmarks marking Zep Tepi ("First Time") headquarters, plus early 20th-century underground-city reports the Smithsonian aggressively declared a hoax to hide non-human high-technology history.',
        isCorrect: true,
        rationale:
          'Grand Canyon holds Egyptian/Anuk Zep Tepi headquarters markers and underground-city reports Smithsonian branded hoax to suppress non-human high-tech history.',
      },
      {
        label: 'B',
        text: 'Only freemason picnic tables with no ancient names or cities.',
        isCorrect: false,
        rationale:
          'Named landmarks and underground-city reports are the suppressed pre-reset occupation evidence.',
      },
      {
        label: 'C',
        text: 'Open Smithsonian tours of Anunnaki subway stations daily.',
        isCorrect: false,
        rationale:
          'Smithsonian declared underground-city reports a hoax — not open tours.',
      },
      {
        label: 'D',
        text: 'Proof that no pre-reset occupation ever touched North America.',
        isCorrect: false,
        rationale:
          'Evidence of pre-reset occupation is exactly what is being covered up there.',
      },
    ],
    hint: 'Anuk/Egyptian Zep Tepi names + underground city called "hoax."',
    correctAnswer: 'A',
  },
  {
    number: 21,
    question:
      'Who repopulated after Great Tartary\'s catastrophic termination?',
    options: [
      {
        label: 'A',
        text: 'Newly introduced populations heavily composed of mind-wiped NPC entities and cloned Orphans grown in underground facilities, trained to accept a completely false historical timeline.',
        isCorrect: true,
        rationale:
          'Post-Tartary repopulation used mind-wiped NPCs and underground-grown cloned Orphans trained into false history while claiming surviving architecture.',
      },
      {
        label: 'B',
        text: 'Only freemason scholars who openly taught Tartarian free energy.',
        isCorrect: false,
        rationale:
          'New populations were trained into false timeline ignorance — not open Tartarian truth.',
      },
      {
        label: 'C',
        text: 'Unaltered pre-reset adults with full generational memory intact.',
        isCorrect: false,
        rationale:
          'Adults and memory keepers were targeted; WW1 later culled remaining 15–55 memory holders.',
      },
      {
        label: 'D',
        text: 'Only giants rebuilt from Smithsonian vaults into living guides.',
        isCorrect: false,
        rationale:
          'Giants remain vaulted evidence; repopulation is NPC/orphan insertion into false history.',
      },
    ],
    hint: 'Mind-wiped NPCs + cloned Orphans trained on false history.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question:
      'What were massive Lunatic Asylums in the immediate post-reset period?',
    options: [
      {
        label: 'A',
        text: 'Pre-planned containment for traumatized survivors who witnessed global destruction — housing catatonic victims while functioning as massive Loosh energetic harvesting batteries for demonic entities.',
        isCorrect: true,
        rationale:
          'Lunatic Asylums were pre-planned post-reset containment for catatonic witnesses and simultaneous Loosh harvest batteries for demonic entities.',
      },
      {
        label: 'B',
        text: 'Free universities teaching honest giant history to all orphans.',
        isCorrect: false,
        rationale:
          'They contained traumatized witnesses and harvested Loosh — not honest giant education centers.',
      },
      {
        label: 'C',
        text: 'Open Smithsonian annexes displaying 10,000 skeletons.',
        isCorrect: false,
        rationale:
          'Skeletons go to sealed vaults; asylums house living traumatized survivors as harvest nodes.',
      },
      {
        label: 'D',
        text: 'Railroad depots with no energetic or trauma function.',
        isCorrect: false,
        rationale:
          'Function is trauma containment plus Loosh battery harvesting after reset catastrophe.',
      },
    ],
    hint: 'Catatonic witness containment + Loosh harvest batteries.',
    correctAnswer: 'A',
  },
  {
    number: 23,
    question: 'Why was World War 1 initiated in this cover-up framework?',
    options: [
      {
        label: 'A',
        text: 'To cull remaining population aged 15 to 55 who still held generational memory of the pre-reset world, natural medicine, and the true shape of the earth — a direct threat to newly imposed ignorance.',
        isCorrect: true,
        rationale:
          'WW1 culled ages 15–55 still carrying pre-reset memory, natural medicine knowledge, and true Earth shape — protecting imposed ignorance.',
      },
      {
        label: 'B',
        text: 'To protect home-school flat-earth teachers and expand herbal colleges.',
        isCorrect: false,
        rationale:
          'It targeted those memory keepers for eradication — not protection.',
      },
      {
        label: 'C',
        text: 'To force Smithsonian vaults open for public giant tourism.',
        isCorrect: false,
        rationale:
          'War cemented cover-up of prior civilization — not vault tourism.',
      },
      {
        label: 'D',
        text: 'To celebrate Mudflood as a natural weather festival only.',
        isCorrect: false,
        rationale:
          'WW1 is orchestrated culling of memory keepers, not a weather festival.',
      },
    ],
    hint: 'Cull ages 15–55 — kill pre-reset memory, herbs, true Earth shape.',
    correctAnswer: 'A',
  },
  {
    number: 24,
    question:
      'Why does acknowledging Giant Skeletons threaten the control grid?',
    options: [
      {
        label: 'A',
        text: 'It shatters the Perceived Knowledge string; if humanity saw history as cycles of violent resets, the entire psychological and societal control grid would collapse.',
        isCorrect: true,
        rationale:
          'Giant truth breaks Perceived Knowledge. Seeing history as violent reset cycles collapses the psychological and societal control grid.',
      },
      {
        label: 'B',
        text: 'It strengthens evolution textbooks and makes populations more docile.',
        isCorrect: false,
        rationale:
          'Controllers need linear-progress illusion for docility; giant truth ends that illusion.',
      },
      {
        label: 'C',
        text: 'It only affects railroad stock prices with no spiritual impact.',
        isCorrect: false,
        rationale:
          'Impact is psychological/spiritual control collapse via Perceived Knowledge breakage.',
      },
      {
        label: 'D',
        text: 'It proves NDAs were never used on any civilian discoverer.',
        isCorrect: false,
        rationale:
          'NDAs and threats are core to suppression; acknowledgment undoes the knowledge cage.',
      },
    ],
    hint: 'Breaks Perceived Knowledge — reset-cycle history collapses the grid.',
    correctAnswer: 'A',
  },
  {
    number: 25,
    question:
      'Why must parasites suppress reset evidence, and why is exposure inevitable?',
    options: [
      {
        label: 'A',
        text: 'They need linear natural-progress illusion so people stay docile in a multi-millennial harvest loop for energy and genetic material; yet tens of thousands of hidden skeletons and unmovable nodal architecture make the narrative unstable — unerasable Oopa\'s catalyze deconstruction of the fabricated simulation.',
        isCorrect: true,
        rationale:
          'Suppression protects the immortal-soul harvest loop under fake linear progress. Scale of vaulted giants and nodal anomalies keeps the lie unstable and forces awakenings.',
      },
      {
        label: 'B',
        text: 'Because all evidence was already erased perfectly with zero leftovers.',
        isCorrect: false,
        rationale:
          'Failure to completely erase Oopa\'s and giants is exactly what catalyzes exposure.',
      },
      {
        label: 'C',
        text: 'Because freemasons want everyone free of all harvesting immediately.',
        isCorrect: false,
        rationale:
          'Parasitic paradigm requires docile harvest; freemasons serve that suppression structure.',
      },
      {
        label: 'D',
        text: 'Because newspaper microfiche never existed after 1900.',
        isCorrect: false,
        rationale:
          'Microfiche reports into the 1970s are part of the unerasable documentary trail.',
      },
    ],
    hint: 'Protect harvest loop — but unerasable Oopa\'s/giants force awakening.',
    correctAnswer: 'A',
  },
];

function normalizeQuestion(q) {
  const mapped = q.options.map((o) => ({
    label: o.label,
    text: cleanText(o.text),
    isCorrect: !!o.isCorrect,
    rationale: cleanText(o.rationale),
  }));
  const finalized = finalizeOptions(
    mapped,
    `${typeof TOPIC_ID !== 'undefined' ? TOPIC_ID : 'quiz'}::${q.number}`
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

const DESC_SHORT =
  'Test your grasp of Giant Skeletons — Re-sets, 10,000+ American finds, railroad freemason cover-ups, Smithsonian vaults, NDAs, Mudfloods, and the shattered Evolution timeline.';
const DESC_META =
  'Interactive Living Truth Quiz on Giant Skeletons: 12 feet to 35+ meters, Railroad Magnates, Smithsonian Vatican of Archaeology, civilian NDA protocol, Tartaria, Grand Canyon Anuk sites, WW1 memory cull, and Perceived Knowledge collapse.';

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
      'Giant Skeletons are not folklore footnotes — they are mound-entombed proof that Re-sets cycle advanced worlds into amnesia. Over 10,000 American recoveries, skulls and femurs at impossible scale, rail cuts through burial hills, 33rd-degree magnates, Smithsonian vaults like a Vatican of Archaeology, NDA terror, Mudflood weapons, Tartaria mislabeled Dark Ages, Grand Canyon Anuk/Zep Tepi cover stories, NPC/orphan restock, Loosh asylums, WW1 cull of ages 15–55: that is the machine. Sit with what you missed, then return to the Giant Skeletons deep-dive. Evolution and linear progress are the cage. Acknowledge the giants and the control grid\'s Perceived Knowledge string snaps — and unerasable Oopa\'s keep forcing the simulation mask to crack.',
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
      "  { path: '/quiz/alice/gateway-10-system.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/frequency-fences.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/freemasonry.html', priority: '0.75', changefreq: 'monthly' },",
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

console.log('Sample correct answers:');
[0, 6, 11, 15, 19, 24].forEach((i) => {
  const c = questions[i].options.find((o) => o.isCorrect);
  console.log(` Q${questions[i].number}: ${c.text.slice(0, 110)}`);
});
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('PASS: audited 25/25 against data/alice-topics/giant-skeletons.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
