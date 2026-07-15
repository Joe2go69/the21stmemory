/**
 * Installs World War I quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/world-war-i.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-world-war-i-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'world-war-i';
const TOPIC_TITLE = 'World War I';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/ww1.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['demographic cull', 'old world', '1914'],
  2: ['reset', 'young adults', 'herbal medicine'],
  3: ['15 to 22 million', 'orphans', 'npc'],
  4: ['great tartary', 'linear', 'progress'],
  5: ['arch duke ferdinand', 'fabricated', '16'],
  6: ['1860s', 'flat', 'copernican'],
  7: ['big pharma', 'herbal', 'synthetic'],
  8: ['1860', '1900', 'america', 'uk'],
  9: ['lunatic asylums', 'loosh', '5,000-bed'],
  10: ['reptilian', 'catatonic', 'containment'],
  11: ['d.u.m.b', 'stem cells', 'clones'],
  12: ['orphan trains', 'tartarian cities', 'empty'],
  13: ['npc', 'safe zones', 'indoctrinate'],
  14: ['teens', 'mid-50s', 'old world knowledge'],
  15: ['9–11 million', 'military', 'civilian'],
  16: ['tartaria', 'industrial revolution', 'free-energy'],
  17: ['atmospheric condensers', 'ley lines', 'coal'],
  18: ['london underground', 'pneumatic', 'suppressed'],
  19: ['carnegie', 'freemasons', 'library'],
  20: ['hyper-bullshit', 'fake history', 'tartarian architecture'],
  21: ['religion', 'finance', 'perceived knowledge'],
  22: ['97%', 'npc', 'programmed'],
  23: ['sanitation', 'post-reset', 'trenches'],
  24: ['medical-industrial', 'banking', 'education'],
  25: ['178,000-year', 'spiritual awakening', 'chronological history'],
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
    question: 'What was World War 1 (1914–1918) in truth?',
    options: [
      {
        label: 'A',
        text: 'A highly orchestrated demographic cull designed to permanently sever humanity\'s connection to the Old World — not a natural geopolitical conflict sparked by a political assassination.',
        isCorrect: true,
        rationale:
          'WW1 was engineered extermination of truth-bearing survivors, not spontaneous great-power accident.',
      },
      {
        label: 'B',
        text: 'A purely accidental border skirmish that killed almost no one and left Old World knowledge fully intact in every household.',
        isCorrect: false,
        rationale:
          'It was planetary-scale slaughter that erased generational knowledge, not a minor accident.',
      },
      {
        label: 'C',
        text: 'A peaceful conference that restored free-energy Tartarian technology and reopened herbal medicine schools worldwide.',
        isCorrect: false,
        rationale:
          'The war destroyed knowledge-bearers and cleared the way for matrix control, not free-energy restoration.',
      },
      {
        label: 'D',
        text: 'A railroad strike over coal prices that never drafted teenagers or young adults into trenches.',
        isCorrect: false,
        rationale:
          'The draft and trenches targeted the memory-bearing generation after the Reset, not a coal-price strike.',
      },
    ],
    hint: 'Orchestrated demographic cull — sever the Old World link.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'When did the war occur relative to the Reset, and whom did it target first?',
    options: [
      {
        label: 'A',
        text: 'Centuries before any Reset, and only elderly librarians who already rejected herbal medicine and flat-earth knowledge.',
        isCorrect: false,
        rationale:
          'It came immediately after the latest Reset and hit young adults and teenagers who still held suppressed truth.',
      },
      {
        label: 'B',
        text: 'Immediately after the most recent planetary Reset, engineered to eradicate surviving young adults and teenagers who still retained suppressed knowledge of reality, herbal medicine, and the true structure of the Flat Earth.',
        isCorrect: true,
        rationale:
          'Post-Reset cull of the youth generation that still knew reality, herbs, and Flat Earth architecture.',
      },
      {
        label: 'C',
        text: 'During a future spiritual awakening only, with no link to herbalists, geography, or demographic planning.',
        isCorrect: false,
        rationale:
          'WW1 was the historical sanitation step after Reset, not a future awakening event.',
      },
      {
        label: 'D',
        text: 'Only inside orphan train cars, where no military machinery and no trench warfare ever appeared.',
        isCorrect: false,
        rationale:
          'Orphan Trains repopulated after the cull; WW1 itself was mechanized slaughter of knowledge-bearers.',
      },
    ],
    hint: 'Right after Reset — kill youth who still knew herbs and Flat Earth.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question: 'What death scale and demographic replacement followed the cull?',
    options: [
      {
        label: 'A',
        text: 'Fewer than one thousand deaths, after which free citizens rebuilt Tartaria with open elections and full memory of the Reset.',
        isCorrect: false,
        rationale:
          'Deaths ran 15 to 22 million; replacement used cloned Orphans and NPCs under fabricated paradigms.',
      },
      {
        label: 'B',
        text: 'Only animal livestock were counted as casualties, while human populations stayed continuous without clones or NPCs.',
        isCorrect: false,
        rationale:
          'Human slaughter cleared the field for manufactured Orphans and NPCs, not livestock bookkeeping.',
      },
      {
        label: 'C',
        text: 'By exterminating 15 to 22 million individuals, controllers cleared the landscape to install a manufactured compliant society of cloned Orphans and NPCs, enabling total fabrication of modern historical, scientific, and medical paradigms.',
        isCorrect: true,
        rationale:
          '15–22 million dead opened the slot for clone/NPC society and fully fake modern paradigms.',
      },
      {
        label: 'D',
        text: 'Exact zero civilian impact, because the war only rearranged museum labels without touching living knowledge-bearers.',
        isCorrect: false,
        rationale:
          'Millions died and living memory was erased; this was population engineering, not museum relabeling.',
      },
    ],
    hint: '15–22 million dead → cloned Orphans and NPCs installed.',
    correctAnswer: 'C',
  },
  {
    number: 4,
    question: 'Why was this global slaughter a prerequisite for the modern control story?',
    options: [
      {
        label: 'A',
        text: 'It was needed only to invent better trench poetry with no relation to Tartary, progress myths, or historical fabrication.',
        isCorrect: false,
        rationale:
          'The cull cemented linear-progress illusion and hid Great Tartary\'s ruins, not poetry workshops.',
      },
      {
        label: 'B',
        text: 'It restored Great Tartary openly so every school could teach free-energy architecture without resistance.',
        isCorrect: false,
        rationale:
          'Tartary was hidden and rebranded; the war buried witnesses, not celebrated free energy.',
      },
      {
        label: 'C',
        text: 'It funded only railroad tickets for orphan trains and never touched scientific or medical narratives.',
        isCorrect: false,
        rationale:
          'Clearing truth-bearers enabled full fabrication of history, science, and medicine.',
      },
      {
        label: 'D',
        text: 'It cemented the illusion of linear human progress and hid the ruins of Great Tartary by removing anyone who could still contradict the new matrix of control.',
        isCorrect: true,
        rationale:
          'Kill the witnesses → sell linear progress → keep Tartarian ruins misframed and buried.',
      },
    ],
    hint: 'Linear-progress myth + hide Great Tartary — need the witnesses gone.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question: 'What about the Arch Duke Ferdinand story and the real age target of the cull?',
    options: [
      {
        label: 'A',
        text: 'The conventional outbreak story — specifically the assassination of Arch Duke Ferdinand — is entirely fabricated. The true objective was to eliminate everyone over the age of 16 who had survived the Reset but was not already locked away in an asylum.',
        isCorrect: true,
        rationale:
          'Ferdinand is cover narrative; real target was post-Reset survivors over 16 still free of asylums.',
      },
      {
        label: 'B',
        text: 'Ferdinand\'s death alone caused every battle without planning, and only children under ten were ever drafted.',
        isCorrect: false,
        rationale:
          'Outbreak narrative is fabricated; the cull hit the over-16 knowledge-bearing cohort.',
      },
      {
        label: 'C',
        text: 'The assassination restored Flat Earth schooling and emptied every Lunatic Asylum by royal decree overnight.',
        isCorrect: false,
        rationale:
          'Asylums held traumatized adults as Loosh sources; the war did not liberate truth schooling.',
      },
      {
        label: 'D',
        text: 'No age targeting occurred because every adult with Old World knowledge was promoted to university chair.',
        isCorrect: false,
        rationale:
          'Knowledge-bearers were slaughtered or already confined — not promoted into academia.',
      },
    ],
    hint: 'Ferdinand is fake cover — real target: free survivors over 16.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'How did pre-war home education about Earth\'s shape feed into the WW1 draft?',
    options: [
      {
        label: 'A',
        text: 'In the 1860s homes taught only globe models, so WW1 soldiers already fully accepted Copernican cosmology without any need for erasure.',
        isCorrect: false,
        rationale:
          '1860s home teaching held Flat Earth truth; killing that generation installed Copernican deception.',
      },
      {
        label: 'B',
        text: 'In the 1860s, before state-regulated curriculums, most adults understood the earth was flat and taught this at home. Those children became the generation drafted into WW1 trenches; killing them erased the last vestiges of truth about Earth\'s architecture so the next generation would accept the Copernican globe without resistance.',
        isCorrect: true,
        rationale:
          'Home-taught Flat Earth kids grew into the draft cohort; their deaths locked in globe deception.',
      },
      {
        label: 'C',
        text: 'Schools in 1860 already banned all geography talk, so WW1 had no connection to Earth-shape knowledge at all.',
        isCorrect: false,
        rationale:
          'Pre-standardization homes still taught Flat Earth; that is exactly why that generation was culled.',
      },
      {
        label: 'D',
        text: 'Copernican globe teaching was abandoned during WW1 so every survivor rebuilt Tartarian free-energy maps.',
        isCorrect: false,
        rationale:
          'The war enabled globe deception to stick by removing those who knew better.',
      },
    ],
    hint: '1860s Flat Earth at home → that generation dies in trenches → globe sticks.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question: 'How was the war weaponized against natural medicine and Big Pharma\'s rise?',
    options: [
      {
        label: 'A',
        text: 'It funded free herbal colleges in every capital and banned synthetic drugs for the next century.',
        isCorrect: false,
        rationale:
          'Herbalists were purged so future generations would depend on synthetic Big Pharma meds.',
      },
      {
        label: 'B',
        text: 'It left healers untouched and only drafted accountants who had never worked with plants or remedies.',
        isCorrect: false,
        rationale:
          'Millions with herbal experience were removed from the gene pool as part of the control grid.',
      },
      {
        label: 'C',
        text: 'Because the incoming control grid required a sickened population dependent on emerging Big Pharma, individuals with extensive herbal experience had to be removed from the gene pool so future generations would rely on synthetic medications with debilitating side effects.',
        isCorrect: true,
        rationale:
          'Cull the herbal knowledge-bearers → lock dependency on petrochemical synthetic medicine.',
      },
      {
        label: 'D',
        text: 'Big Pharma donated atmospheric condensers to hospitals so natural healers could keep practicing openly forever.',
        isCorrect: false,
        rationale:
          'Parasites planned pharma monopoly by eradicating traditional healers, not empowering them.',
      },
    ],
    hint: 'Purge herbalists → sickened, synthetic-dependent population.',
    correctAnswer: 'C',
  },
  {
    number: 8,
    question: 'When did the last major Reset\'s destruction conclude in America and the UK?',
    options: [
      {
        label: 'A',
        text: 'Both regions finished Reset destruction only after 1950, long after WW1 had already ended without demographic purpose.',
        isCorrect: false,
        rationale:
          'America around 1860 and UK around 1900 — WW1 follows as the cleanup cull of survivors.',
      },
      {
        label: 'B',
        text: 'Neither region experienced a Reset; WW1 alone invented all ruins without prior torture or sacrifice.',
        isCorrect: false,
        rationale:
          'WW1 sits in the direct timeline after Reset destruction and population decimation.',
      },
      {
        label: 'C',
        text: 'Resets finished in the medieval period only, with continuous free-energy Tartaria operating openly through 1918.',
        isCorrect: false,
        rationale:
          'Recent Reset windows are 1860 America / 1900 UK, then WW1 sanitation of remaining witnesses.',
      },
      {
        label: 'D',
        text: 'The last major Reset concluded its destruction in America around 1860 and in the UK around 1900, leaving ruined landscapes and populations decimated through torture, rape, and mass sacrifice before the WW1 cull.',
        isCorrect: true,
        rationale:
          '1860 America / 1900 UK end the Reset wave; WW1 then kills remaining free knowledge-bearers.',
      },
    ],
    hint: 'America ~1860, UK ~1900 — then WW1 as follow-on cull.',
    correctAnswer: 'D',
  },
  {
    number: 9,
    question: 'What were Lunatic Asylums in the post-Reset strategy?',
    options: [
      {
        label: 'A',
        text: 'Vast, repurposed Old World architectural complexes used immediately post-Reset to imprison shell-shocked surviving adults who witnessed the carnage, converting them into 5,000-bed Loosh Batteries to feed demonic entities.',
        isCorrect: true,
        rationale:
          'Asylums were Tartarian-scale shells turned into mass Loosh farms for traumatized adult witnesses.',
      },
      {
        label: 'B',
        text: 'Brand-new tiny clinics that taught Flat Earth geography and herbal medicine to every inmate as free curriculum.',
        isCorrect: false,
        rationale:
          'They contained and harvested trauma energy; they did not teach Old World truth.',
      },
      {
        label: 'C',
        text: 'Open museums that displayed atmospheric condensers and Carnegie-free histories without any imprisonment.',
        isCorrect: false,
        rationale:
          'They were containment and Loosh extraction, not free-energy museums.',
      },
      {
        label: 'D',
        text: 'Temporary train stations for orphan trains that never held traumatized adults at all.',
        isCorrect: false,
        rationale:
          'Orphan Trains moved clones; asylums locked adult witnesses as Loosh Batteries.',
      },
    ],
    hint: 'Old World shells → 5,000-bed Loosh Batteries for shell-shocked adults.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'How were adult Reset witnesses handled in the containment leg of the strategy?',
    options: [
      {
        label: 'A',
        text: 'They were elected as city mayors and ordered to publish full reptilian timelines in every newspaper without censorship.',
        isCorrect: false,
        rationale:
          'Witnesses were driven catatonic and incarcerated — not given media platforms.',
      },
      {
        label: 'B',
        text: 'Adults who survived and witnessed overt reptilian and parasitic slaughter were driven catatonic by trauma, swept off the streets, and incarcerated in Lunatic Asylums where inmate agony was harvested as Loosh for demonic hosts of sold-soul proxies.',
        isCorrect: true,
        rationale:
          'Trauma → catatonia → asylum containment → continuous Loosh harvest for parasitic hosts.',
      },
      {
        label: 'C',
        text: 'They received stem-cell therapy in D.U.M.B.S. and returned as free-energy engineers rebuilding condensers.',
        isCorrect: false,
        rationale:
          'Stem cells fed clone production; witnesses were not restored as free-energy engineers.',
      },
      {
        label: 'D',
        text: 'They were all drafted as generals who prevented WW1 and protected Old World knowledge by force of arms.',
        isCorrect: false,
        rationale:
          'Containment removed them from society; WW1 still culled the free mid-age cohort.',
      },
    ],
    hint: 'Catatonic witnesses → asylums → Loosh for demonic proxy hosts.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question: 'How were new populations manufactured after original children and adults were consumed in the Reset?',
    options: [
      {
        label: 'A',
        text: 'Natural birth rates alone filled cities overnight with full inherited memory of Tartaria and herbal law.',
        isCorrect: false,
        rationale:
          'Clones from stem cells in D.U.M.B.S. replaced consumed populations without true memory.',
      },
      {
        label: 'B',
        text: 'Only foreign tourists were invited to settle empty cities while no underground labs or cloning occurred.',
        isCorrect: false,
        rationale:
          'Subterranean clone growth and Orphan Train logistics were the artificial repopulation path.',
      },
      {
        label: 'C',
        text: 'Stem cells taken from children prior to sacrifice were used to grow clones in subterranean D.U.M.B.S (Deep Underground Military Bases), then moved into the emptied realm as the new populace.',
        isCorrect: true,
        rationale:
          'Pre-sacrifice stem cells → underground clone growth → artificial repopulation without Old World memory.',
      },
      {
        label: 'D',
        text: 'Giants were reawakened from burial mounds to serve as the sole new citizen class with full free-energy rights.',
        isCorrect: false,
        rationale:
          'Repopulation used lab-grown clones, not revived mound giants as free citizens.',
      },
    ],
    hint: 'Stem cells → D.U.M.B.S. clones → replace the consumed.',
    correctAnswer: 'C',
  },
  {
    number: 12,
    question: 'What role did Orphan Trains play after the Reset?',
    options: [
      {
        label: 'A',
        text: 'They evacuated free-energy engineers to safe moons so Tartaria could restart without any fabricated schooling.',
        isCorrect: false,
        rationale:
          'Trains distributed memory-blank clones into empty Tartarian cities under new programming.',
      },
      {
        label: 'B',
        text: 'They only moved coal and never carried children, clones, or educational programming of any kind.',
        isCorrect: false,
        rationale:
          'Orphan Trains were the child-distribution network for artificial repopulation.',
      },
      {
        label: 'C',
        text: 'They returned asylum inmates to open leadership so Loosh harvesting would end immediately after 1900.',
        isCorrect: false,
        rationale:
          'Asylums kept adult witnesses; trains moved cloned children into emptied cities.',
      },
      {
        label: 'D',
        text: 'Cloned children grown underground were transported via Orphan Trains to fully functioning empty Tartarian cities to repopulate the realm under strict, newly fabricated educational programming.',
        isCorrect: true,
        rationale:
          'Orphan Trains seeded amnesiac clones into intact empty Tartarian shells with fake curricula.',
      },
    ],
    hint: 'Clones on rails into empty Tartarian cities — fabricated schooling.',
    correctAnswer: 'D',
  },
  {
    number: 13,
    question: 'Who raised the clones and with what history?',
    options: [
      {
        label: 'A',
        text: 'Specific NPC adults had been "saved" in temporary safe zones prior to the Reset and were brought in to indoctrinate the clones with new, falsified history.',
        isCorrect: true,
        rationale:
          'Preserved NPC caregivers from safe zones installed the fake timeline into clone children.',
      },
      {
        label: 'B',
        text: 'Shell-shocked asylum inmates were released as teachers of pure Old World knowledge without any falsification.',
        isCorrect: false,
        rationale:
          'Asylum populations were Loosh sources; indoctrination used saved NPC adults, not freed witnesses.',
      },
      {
        label: 'C',
        text: 'No adults were involved; clones self-taught free-energy engineering from intact Carnegie-free archives.',
        isCorrect: false,
        rationale:
          'NPC adults delivered falsified history; Carnegie libraries later bound the deceit.',
      },
      {
        label: 'D',
        text: 'Arch Duke Ferdinand personally adopted every clone and taught Flat Earth and herbal medicine as official doctrine.',
        isCorrect: false,
        rationale:
          'Ferdinand is fabricated cover; clone rearing used NPC indoctrinators with fake history.',
      },
    ],
    hint: 'Safe-zone NPC adults → indoctrinate clones with falsified history.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question: 'Which remaining demographic was rounded into the mechanized slaughter of WW1?',
    options: [
      {
        label: 'A',
        text: 'Only infants under two who had never learned language, geography, or herbal practice of any kind.',
        isCorrect: false,
        rationale:
          'The cull hit late teens to mid-50s who still held Old World knowledge outside asylums.',
      },
      {
        label: 'B',
        text: 'Those in their late teens to mid-50s who possessed Old World knowledge but avoided the asylums — the free cohort still capable of disputing the incoming narrative.',
        isCorrect: true,
        rationale:
          'Free knowledge-bearers from late teens through mid-50s were the WW1 kill window.',
      },
      {
        label: 'C',
        text: 'Only Carnegie librarians who already believed every page of fabricated globe science without doubt.',
        isCorrect: false,
        rationale:
          'Targets were people who could still dispute the narrative, not already-captured believers.',
      },
      {
        label: 'D',
        text: 'Nobody human — only pneumatic trains were destroyed while populations stayed demographically whole.',
        isCorrect: false,
        rationale:
          'Human demographic cleansing was the point; millions of knowledge-bearers died.',
      },
    ],
    hint: 'Late teens to mid-50s — free Old World memory, not asylums.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question: 'What death totals and breakdown are given for 1914–1918?',
    options: [
      {
        label: 'A',
        text: 'Under one hundred total deaths, all accidental, with no military or civilian split worth recording.',
        isCorrect: false,
        rationale:
          'Scale is 15 to 22 million with multi-million military and civilian components.',
      },
      {
        label: 'B',
        text: 'Exactly equal military and civilian zero-casualty "war games" staged for newspapers without real slaughter.',
        isCorrect: false,
        rationale:
          'Real mass death: millions military and millions civilian within the 15–22 million band.',
      },
      {
        label: 'C',
        text: 'Between 1914 and 1918 the conflict yielded 15 to 22 million deaths — about 9–11 million military and 6–13 million civilian — cleansing the realm of anyone capable of disputing the incoming narrative.',
        isCorrect: true,
        rationale:
          '15–22 million total (roughly 9–11M military, 6–13M civilian) as narrative-cleansing slaughter.',
      },
      {
        label: 'D',
        text: 'Only 15 librarians died, which was enough to rewrite every science book without wider demographic impact.',
        isCorrect: false,
        rationale:
          'Tens of millions died; this was realm-scale cleansing, not a library staffing event.',
      },
    ],
    hint: '15–22 million total — roughly 9–11M military, 6–13M civilian.',
    correctAnswer: 'C',
  },
  {
    number: 16,
    question: 'What was the so-called Industrial Revolution relative to Tartaria?',
    options: [
      {
        label: 'A',
        text: 'A pure celebration of human ingenuity that invented free energy from nothing without dismantling any prior civilization.',
        isCorrect: false,
        rationale:
          'It was deliberate dismantling of Tartaria\'s advanced free-energy tech, not innocent invention.',
      },
      {
        label: 'B',
        text: 'A religious revival that restored Great Tartary\'s architecture and banned coal monopolies forever.',
        isCorrect: false,
        rationale:
          'Tartary fell and was rebranded Dark Ages / Industrial Revolution while free energy was stripped.',
      },
      {
        label: 'C',
        text: 'Only a fashion change in factory hats with no effect on locomotives, Ley Lines, or energy systems.',
        isCorrect: false,
        rationale:
          'Core free-energy systems were removed and smelted to force primitive resource dependency.',
      },
      {
        label: 'D',
        text: 'Not human ingenuity but deliberate dismantling of Tartaria\'s advanced free-energy technologies — the violent transition mechanism between Tartarian remnants and the fully realized modern matrix, with WW1 as the bloody hinge.',
        isCorrect: true,
        rationale:
          'Industrial Revolution = free-energy teardown; WW1 finishes the human-memory teardown.',
      },
    ],
    hint: 'Dismantle Tartarian free energy — WW1 as the bloody hinge.',
    correctAnswer: 'D',
  },
  {
    number: 17,
    question: 'What example shows free-energy rail tech being forced into coal dependency?',
    options: [
      {
        label: 'A',
        text: 'Atmospheric Condensers that powered steam locomotives by extracting electromagnetic energy from the Lattice Membrane Network (Ley Lines) were systematically removed and smelted down by corporate monopolies to enforce dependency on restricted resources like coal.',
        isCorrect: true,
        rationale:
          'Condensers rode Ley-line electromagnetics until monopolies melted them to lock coal dependency.',
      },
      {
        label: 'B',
        text: 'Atmospheric Condensers were mass-produced after 1918 so every family locomotive ran without coal forever.',
        isCorrect: false,
        rationale:
          'They were removed and smelted — opposite of postwar mass free-energy rollout.',
      },
      {
        label: 'C',
        text: 'Ley Lines were imaginary myths with no locomotive application, so coal was always the only possible fuel.',
        isCorrect: false,
        rationale:
          'Lattice/Ley induction powered condensers until corporate monopoly destroyed the devices.',
      },
      {
        label: 'D',
        text: 'Coal companies donated condensers to orphan trains so clones would learn electromagnetic engineering first.',
        isCorrect: false,
        rationale:
          'Monopolies enforced coal; clones received fabricated education, not condenser craft.',
      },
    ],
    hint: 'Condensers on Ley Lines → stripped and smelted for coal monopoly.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question: 'What happened to clean transport systems such as the original London Underground?',
    options: [
      {
        label: 'A',
        text: 'They expanded freely as the global standard, replacing every coal system and teaching lattice physics in schools.',
        isCorrect: false,
        rationale:
          'Clean pneumatic systems like the original London Underground were suppressed.',
      },
      {
        label: 'B',
        text: 'Clean pneumatic transport systems like the original London Underground were suppressed as part of dismantling superior Tartarian-era technologies.',
        isCorrect: true,
        rationale:
          'Pneumatic Underground excellence was suppressed alongside other free/clean systems.',
      },
      {
        label: 'C',
        text: 'They were converted into Lunatic Asylums with 5,000 beds and no transport function remaining.',
        isCorrect: false,
        rationale:
          'Asylums repurposed Old World architectural complexes; Underground suppression is a separate tech-erasure track.',
      },
      {
        label: 'D',
        text: 'They only ever existed as cartoon drawings in Carnegie libraries with no real pneumatic engineering history.',
        isCorrect: false,
        rationale:
          'Real superior systems were suppressed; libraries pushed fake history over living tech memory.',
      },
    ],
    hint: 'Original pneumatic London Underground — suppressed.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question: 'How did Andrew Carnegie and 33rd-degree Freemasons shape the post-cull mind?',
    options: [
      {
        label: 'A',
        text: 'They burned every book and forbade reading so clones would have zero text-based programming of any kind.',
        isCorrect: false,
        rationale:
          'They distributed prestige libraries of fake history/science inside Tartarian shells — binding deceit, not illiteracy.',
      },
      {
        label: 'B',
        text: 'They restored free-energy manuals to every shelf and openly admitted the Reset, Orphan Trains, and WW1 cull.',
        isCorrect: false,
        rationale:
          'Philanthropy packaged hyper-deceit, not full disclosure of Reset and cull mechanics.',
      },
      {
        label: 'C',
        text: 'Wealthy industrialists and 33rd-degree Freemasons like Andrew Carnegie used vast library-building philanthropy as a calculated distribution network for fabricated history and science, packaged in prestigious vaulted Tartarian architecture to bind the new populace intellectually.',
        isCorrect: true,
        rationale:
          'Carnegie libraries = attractive Tartarian shells filled with programmed fake history and science.',
      },
      {
        label: 'D',
        text: 'Carnegie only funded herbal clinics that reversed Big Pharma plans and banned globe models in every town.',
        isCorrect: false,
        rationale:
          'His network bound clones to fake paradigms; it did not restore herbal Old World medicine.',
      },
    ],
    hint: 'Freemason industrialist libraries — fake history in Tartarian prestige shells.',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question: 'What does "hyper-bullshit" describe in the Carnegie library operation?',
    options: [
      {
        label: 'A',
        text: 'Strictly true free-energy schematics and honest Reset chronologies printed without any deceitful packaging.',
        isCorrect: false,
        rationale:
          'Hyper-bullshit means packaged fake history and fake science made to look prestigious and binding.',
      },
      {
        label: 'B',
        text: 'Only blank pages donated to empty cities with no historical or scientific claims at all.',
        isCorrect: false,
        rationale:
          'The libraries actively distributed false history and science to program the new populace.',
      },
      {
        label: 'C',
        text: 'Military trench manuals that admitted WW1 was a demographic cull and urged soldiers to desert with Old World knowledge intact.',
        isCorrect: false,
        rationale:
          'Library content bound people to deceit; it did not confess the cull or preserve Old World truth.',
      },
      {
        label: 'D',
        text: 'Packaging fake history and fake science inside prestigious, vaulted Tartarian architecture so the deceit became attractive and intellectually binding to newly cloned orphans who never knew their true inheritance.',
        isCorrect: true,
        rationale:
          'Hyper-bullshit = seductive false canon in grand old shells so orphans never find their inheritance.',
      },
    ],
    hint: 'Fake history/science in grand Tartarian libraries — binding the clones.',
    correctAnswer: 'D',
  },
  {
    number: 21,
    question: 'What three strings of absolute control did the elimination of WW1 truth-bearers allow parasites to establish?',
    options: [
      {
        label: 'A',
        text: 'Religion, Finance, and Perceived Knowledge — the structural triad that keeps the buried true history from overturning the matrix.',
        isCorrect: true,
        rationale:
          'With truth-bearers dead in trenches, Religion, Finance, and Perceived Knowledge lock the grid.',
      },
      {
        label: 'B',
        text: 'Only gardening, folk dance, and pottery classes with no financial, religious, or knowledge control involved.',
        isCorrect: false,
        rationale:
          'The named triad is Religion, Finance, and Perceived Knowledge — full spectrum control.',
      },
      {
        label: 'C',
        text: 'Free herbal unions, open Flat Earth academies, and public condenser factories as the new global law.',
        isCorrect: false,
        rationale:
          'Those liberatory structures were suppressed; the three strings enforce dependency and deceit.',
      },
      {
        label: 'D',
        text: 'Orphan train schedules, coal prices, and trench poetry contests as the only lasting control mechanisms.',
        isCorrect: false,
        rationale:
          'Strategic control is Religion, Finance, Perceived Knowledge — not peripheral logistics hobbies.',
      },
    ],
    hint: 'Religion · Finance · Perceived Knowledge.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question: 'What share of the current global population is described as heavily programmed NPCs after this burial of truth?',
    options: [
      {
        label: 'A',
        text: 'Under 3%, with 97% fully awake to Reset mechanics, Tartaria, and the WW1 sanitation operation.',
        isCorrect: false,
        rationale:
          '97% operate as programmed NPCs; only a thin remainder can still conceptualize beyond assigned parameters.',
      },
      {
        label: 'B',
        text: '97% of the current global population operates as heavily programmed NPCs, incapable of conceptualizing reality beyond parameters assigned by modern media, education, and science — because true history was buried in the trenches.',
        isCorrect: true,
        rationale:
          'Trench burial of truth-bearers left ~97% as parameter-bound NPCs under media/education/science.',
      },
      {
        label: 'C',
        text: 'Exactly 50% NPCs and 50% free-energy engineers openly rebuilding Ley Line condensers in every capital.',
        isCorrect: false,
        rationale:
          'The figure given is 97% programmed NPCs, not a half-and-half free-energy renaissance.',
      },
      {
        label: 'D',
        text: 'Zero NPCs remain because Carnegie libraries accidentally printed the full 178,000-year occupation timeline.',
        isCorrect: false,
        rationale:
          'Libraries bound deceit; 97% still run as programmed NPCs inside assigned parameters.',
      },
    ],
    hint: '97% heavily programmed NPCs — truth buried in the trenches.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question: 'How should World War 1 be viewed strategically, rather than as a tragic political failure?',
    options: [
      {
        label: 'A',
        text: 'As a random weather disaster with no parasitic planning, no Reset link, and no demographic design.',
        isCorrect: false,
        rationale:
          'It was calculated post-Reset sanitation, not weather or mere political accident.',
      },
      {
        label: 'B',
        text: 'As a victorious restoration of Tartaria that reopened Old World knowledge for every orphan train child.',
        isCorrect: false,
        rationale:
          'It transitioned into the modern matrix by killing remaining truth-bearers, not restoring Tartaria.',
      },
      {
        label: 'C',
        text: 'As a calculated, post-Reset sanitation operation that exposed the structural deceit of modern civilization by clearing anyone who could still remember the prior realm.',
        isCorrect: true,
        rationale:
          'WW1 = planned post-Reset sanitation of memory-bearers so the modern deceit could harden.',
      },
      {
        label: 'D',
        text: 'As nothing more than a debate club argument between librarians that never entered trenches or casualty lists.',
        isCorrect: false,
        rationale:
          'Millions died in mechanized slaughter; this was realm sanitation, not a debate club.',
      },
    ],
    hint: 'Calculated post-Reset sanitation — not tragic political accident.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question: 'What was constructed over the intellectual void left by the millions slaughtered between 1914 and 1918?',
    options: [
      {
        label: 'A',
        text: 'Only temporary tents that taught Flat Earth and herbal medicine until free energy returned unopposed.',
        isCorrect: false,
        rationale:
          'Modern control institutions rose over that void — medicine, banking, education, theoretical physics.',
      },
      {
        label: 'B',
        text: 'Nothing institutional — society remained without medical cartels, banks, schools, or physics doctrines.',
        isCorrect: false,
        rationale:
          'Every modern institution listed was built atop the void created by the slaughter.',
      },
      {
        label: 'C',
        text: 'Only atmospheric condenser factories jointly owned by the clones and the asylum survivors as equal partners.',
        isCorrect: false,
        rationale:
          'Free-energy was dismantled; pharma, banks, education, and physics filled the knowledge gap.',
      },
      {
        label: 'D',
        text: 'Every modern institution — from the medical-industrial complex and centralized banking system to public education and theoretical physics — was constructed directly over the intellectual void created by those millions of dead.',
        isCorrect: true,
        rationale:
          'Pharma, banks, schools, and physics doctrines stand on the grave of the culled knowledge-bearers.',
      },
    ],
    hint: 'Pharma, banks, schools, physics — built on the 1914–1918 void.',
    correctAnswer: 'D',
  },
  {
    number: 25,
    question: 'Why does recognizing WW1 as this cull matter for the wider occupation and awakening?',
    options: [
      {
        label: 'A',
        text: 'It is critical for dismantling psychological barriers needed to comprehend the wider 178,000-year occupation and to prepare for total uninstallation of chronological history during the imminent spiritual awakening.',
        isCorrect: true,
        rationale:
          'See WW1 as sanitation → crack the mind-cage → face 178,000-year occupation and chronological uninstall at awakening.',
      },
      {
        label: 'B',
        text: 'It only matters for collecting trench medals and has no link to occupation timelines or spiritual awakening.',
        isCorrect: false,
        rationale:
          'Recognition is strategic preparation for wider occupation truth and chronological uninstallation.',
      },
      {
        label: 'C',
        text: 'It proves chronological history must remain permanently installed and that awakening should never uninstall the false timeline.',
        isCorrect: false,
        rationale:
          'Preparation is for uninstalling chronological history in the awakening — opposite of permanent install.',
      },
      {
        label: 'D',
        text: 'It shows the 178,000-year occupation already ended in 1918 when NPCs voluntarily restored Tartaria without further work.',
        isCorrect: false,
        rationale:
          'Occupation comprehension and awakening preparation remain necessary; 1918 sealed the modern matrix, not liberation.',
      },
    ],
    hint: 'Crack barriers → 178,000-year occupation → uninstall false chronology at awakening.',
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
  // Per-question seed nudge toward underrepresented letters
  const targetOrder = ['A', 'B', 'C', 'D'];
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
  // Prefer global best if still more even
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
  'Test your grasp of World War I — the post-Reset demographic cull, Old World knowledge erasure, Orphan Trains, Loosh asylums, and the rise of the modern matrix.';
const DESC_META =
  'Interactive Living Truth Quiz on World War I: 15–22 million dead, Flat Earth generation draft, Big Pharma purge, D.U.M.B.S. clones, Carnegie libraries, and the three strings of control.';

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
      'World War 1 was not a tragic accident of empires. It was post-Reset sanitation — the deliberate murder of the free generation that still knew Flat Earth, herbs, and the Old World. Fifteen to twenty-two million dead. Asylums farmed Loosh from catatonic witnesses. Clones rode Orphan Trains into empty Tartarian cities under NPC handlers. Condensers were smelted for coal. Carnegie libraries bound fake history in beautiful stolen shells. Religion, Finance, and Perceived Knowledge locked the grid. Sit with the trenches as a memory grave. When you stop calling it politics and start calling it a cull, the 178,000-year occupation comes into focus — and chronological history becomes something you can uninstall.',
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
console.log('PASS: audited 25/25 against data/alice-topics/world-war-i.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
