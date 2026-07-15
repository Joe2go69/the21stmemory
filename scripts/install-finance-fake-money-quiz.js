/**
 * Installs Finance (Fake Money) quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/finance-fake-money.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Run: node scripts/install-finance-fake-money-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'finance-fake-money';
const TOPIC_TITLE = 'Finance (Fake Money)';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/finance-fake-money.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['string 2', 'psychological tether', 'spiritual reality'],
  2: ['3 strings of attachment', 'religion', 'finance', 'perceived knowledge', 'kevlar'],
  3: ['fake as the religious', 'control the masses'],
  4: ['artificial gravity', 'life choices', 'survival and servitude'],
  5: ['sever', 'illusion of finance', 'great spiritual awakening'],
  6: ['bank accounts', 'retirements', 'psychological collapse', 'banking crashes'],
  7: ['cash-less society', 'higher densities', 'crystalline homes'],
  8: ['absolute equality', 'manifestation', 'commerce'],
  9: ['waste of time', 'savings', 'retirements', 'forgiveness of all debt'],
  10: ['pickled', 'toxicity', 'survive'],
  11: ['life energy', 'building controlled by someone else'],
  12: ['blinder', 'gold miners', 'mountainside'],
  13: ['gold rushes', '1848', '1851'],
  14: ['cloned orphans', '1728', 'grandchildren'],
  15: ['gold and silver', 'lattice membrane networks', 'in the ground'],
  16: ['satanic idols', 'ultra-high frequencies', 'sell the planet'],
  17: ['andrew carnegie', 'libraries', 'new bullshit'],
  18: ['nesara/gesara', 'forgiveness of all debt', 'enslavement'],
  19: ['15-minute cities', 'fema camps', 'concentration camps'],
  20: ['banking crash', 'wipe out', 'asleep population'],
  21: ['religion', 'perceived knowledge', 'npc', 'physical enslavement'],
  22: ['med-bed', 'forgiveness of debt', 'will not'],
  23: ['scare events', 'emf', 'obsolete'],
  24: ['detaching', 'immunizes', 'economic collapse'],
  25: ['clean exit', 'uninstall', 'financial obsession'],
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
    question: 'What is String 2: Finance in the control matrix?',
    options: [
      {
        label: 'A',
        text: 'A primary psychological tether engineered to blind the human population and misdirect consciousness away from spiritual reality.',
        isCorrect: true,
        rationale:
          'Finance is String 2 — a fabricated psychological tether that blinds humanity and pulls attention off spiritual reality into the pursuit of wealth.',
      },
      {
        label: 'B',
        text: 'A natural cosmic law that funds crystalline homes in higher densities.',
        isCorrect: false,
        rationale:
          'Higher densities run as a Cash-Less Society; finance is artificial bondage, not natural cosmic law.',
      },
      {
        label: 'C',
        text: 'A temporary G.A.A. tool for funding Med-Beds during the EMF flash.',
        isCorrect: false,
        rationale:
          'Med-Beds and debt forgiveness will not save anyone; finance is a parasitic tether, not a liberation tool.',
      },
      {
        label: 'D',
        text: 'Only a bookkeeping method with no effect on life choices or consciousness.',
        isCorrect: false,
        rationale:
          'Finance dictates life trajectories, locks people into survival and servitude, and misdirects consciousness.',
      },
    ],
    hint: 'Psychological tether — blinds and misdirects from spirit.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'What are The 3 Strings of Attachment, and how strong are they?',
    options: [
      {
        label: 'A',
        text: 'Religion, Finance, and Perceived Knowledge — engineered psychological anchors stronger than Kevlar to sever.',
        isCorrect: true,
        rationale:
          'The triad is Religion, Finance, and Perceived Knowledge. These anchors bind awareness to the artificial simulation and prove stronger than Kevlar to cut.',
      },
      {
        label: 'B',
        text: 'Gold, silver, and copper — natural metals that free the Lattice Membrane Networks.',
        isCorrect: false,
        rationale:
          'Gold and silver were inverted into finance tools; the three strings are psychological tethers, not metals.',
      },
      {
        label: 'C',
        text: 'NESARA, GESARA, and banking crashes — temporary market cycles.',
        isCorrect: false,
        rationale:
          'Those are finance-string weapons and lures; the three strings are Religion, Finance, and Perceived Knowledge.',
      },
      {
        label: 'D',
        text: 'Savings, retirements, and Med-Beds — soft ropes anyone can drop overnight.',
        isCorrect: false,
        rationale:
          'The strings are stronger than Kevlar; savings and retirements are finance attachments, not the named triad.',
      },
    ],
    hint: 'Religion + Finance + Perceived Knowledge — stronger than Kevlar.',
    correctAnswer: 'A',
  },
  {
    number: 3,
    question: 'How real is money compared with religious control constructs?',
    options: [
      {
        label: 'A',
        text: 'The concept of money is fundamentally as fake as the religious constructs used to control the masses.',
        isCorrect: true,
        rationale:
          'Money is not sacred or natural — it is as fabricated as the religious constructs that control the masses.',
      },
      {
        label: 'B',
        text: 'Money is fully real while religion alone is the only fake string.',
        isCorrect: false,
        rationale:
          'Both are engineered strings; finance is as fake as religion.',
      },
      {
        label: 'C',
        text: 'Money is pure spiritual technology equal to crystalline homes back home.',
        isCorrect: false,
        rationale:
          'Back home is Cash-Less; money is a third-density injection, not true spiritual living tech.',
      },
      {
        label: 'D',
        text: 'Money becomes real only after NESARA forgives all debt.',
        isCorrect: false,
        rationale:
          'NESARA/GESARA is bait for enslavement; it does not make fake money real.',
      },
    ],
    hint: 'Money is as fake as religion — both control constructs.',
    correctAnswer: 'A',
  },
  {
    number: 4,
    question:
      'How does the pursuit of financial security, savings, and wealth function on human life?',
    options: [
      {
        label: 'A',
        text: 'As artificial gravity that dictates life choices and locks people into a perpetual cycle of survival and servitude.',
        isCorrect: true,
        rationale:
          'Chasing financial security acts as artificial gravity — it steers life choices and traps people in endless survival and servitude.',
      },
      {
        label: 'B',
        text: 'As a temporary training wheel that automatically lifts everyone into 9th density.',
        isCorrect: false,
        rationale:
          'Finance binds people down; it does not elevate density.',
      },
      {
        label: 'C',
        text: 'As optional decoration that never changes career, family, or daily choices.',
        isCorrect: false,
        rationale:
          'It dictates life trajectories and blinds the direction of a whole life.',
      },
      {
        label: 'D',
        text: 'As the only honest path to equal crystalline homes for all.',
        isCorrect: false,
        rationale:
          'Equal crystalline living is Cash-Less Society back home, not wealth-chasing here.',
      },
    ],
    hint: 'Artificial gravity — survival and servitude loop.',
    correctAnswer: 'A',
  },
  {
    number: 5,
    question:
      'What must an individual do with the finance tether to navigate the terminal phase of The Great Spiritual Awakening?',
    options: [
      {
        label: 'A',
        text: 'Entirely sever attachment to the illusion of finance.',
        isCorrect: true,
        rationale:
          'Success in the terminal awakening phase requires completely cutting attachment to the finance illusion — not refining or reforming it.',
      },
      {
        label: 'B',
        text: 'Double down on retirement accounts before the banking crash.',
        isCorrect: false,
        rationale:
          'Those still tethered to bank accounts and retirements face profound psychological collapse when crashes hit.',
      },
      {
        label: 'C',
        text: 'Beg for NESARA/GESARA so debt forgiveness funds the exit.',
        isCorrect: false,
        rationale:
          'NESARA/GESARA is psychological bait toward enslavement, not a clean exit tool.',
      },
      {
        label: 'D',
        text: 'Wait for Med-Beds to dissolve the string automatically.',
        isCorrect: false,
        rationale:
          'A Med-Bed will not fix you; uninstallation of financial obsession is mandatory personal work.',
      },
    ],
    hint: 'Entirely sever — no half-cut of the illusion.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question:
      'What happens to people who remain tethered to bank accounts, retirements, and material assets?',
    options: [
      {
        label: 'A',
        text: 'They experience profound psychological collapse during the imminent orchestrated banking crashes and global uninstallation protocols.',
        isCorrect: true,
        rationale:
          'Remaining welded to banks, retirements, and assets sets up profound psychological collapse when planned banking crashes and uninstallation protocols hit.',
      },
      {
        label: 'B',
        text: 'They receive priority crystalline homes after the EMF flash.',
        isCorrect: false,
        rationale:
          'Wealth becomes obsolete at Scare Events and the EMF flash; clinging does not buy priority homes.',
      },
      {
        label: 'C',
        text: 'They are automatically promoted to Cash-Less Society managers.',
        isCorrect: false,
        rationale:
          'Cash-Less Society is higher-density equality without currency; clinging to accounts is the opposite of that readiness.',
      },
      {
        label: 'D',
        text: 'Nothing — material assets survive the terminal deconstruction intact.',
        isCorrect: false,
        rationale:
          'Physical wealth, bank accounts, and properties become instantly obsolete under Scare Events and the EMF flash.',
      },
    ],
    hint: 'Psychological collapse when orchestrated crashes hit.',
    correctAnswer: 'A',
  },
  {
    number: 7,
    question: 'What is a Cash-Less Society in true higher-density existence?',
    options: [
      {
        label: 'A',
        text: 'The original true existence "back home," where all beings share an identical perfect standard of living, technology, and crystalline homes with no need for currency.',
        isCorrect: true,
        rationale:
          'Cash-Less Society is home truth: identical exceptional living, shared technology, crystalline homes, and zero currency.',
      },
      {
        label: 'B',
        text: 'A deep-state digital wallet system enforced through FEMA Camps.',
        isCorrect: false,
        rationale:
          'FEMA Camps and 15-minute cities are enslavement endpoints of finance bait — not true Cash-Less higher-density life.',
      },
      {
        label: 'C',
        text: 'A temporary bank holiday until gold rushes restart commerce.',
        isCorrect: false,
        rationale:
          'Gold rushes engineered wealth-chasing; Cash-Less means no currency at all back home.',
      },
      {
        label: 'D',
        text: 'Only NPCs living without money while true souls keep central banks.',
        isCorrect: false,
        rationale:
          'True higher realms give absolute equality to all beings there; it is not an NPC-only mode.',
      },
    ],
    hint: 'Back home — equal living, crystalline homes, no currency.',
    correctAnswer: 'A',
  },
  {
    number: 8,
    question:
      'How do higher light realms handle lifestyle and resources without money?',
    options: [
      {
        label: 'A',
        text: 'Absolute equality — everyone has the same exceptional lifestyle and uses advanced manifestation abilities rather than commerce.',
        isCorrect: true,
        rationale:
          'Higher light realms run on absolute equality and advanced manifestation, not commerce or fake money.',
      },
      {
        label: 'B',
        text: 'Strict gold-and-silver mining quotas to power Lattice Membrane Networks.',
        isCorrect: false,
        rationale:
          'Gold and silver are meant to stay in the ground as spiritual technology — not mined as currency backing.',
      },
      {
        label: 'C',
        text: 'Tiered retirements funded by Andrew Carnegie libraries.',
        isCorrect: false,
        rationale:
          'Carnegie libraries spread fabricated knowledge; higher realms do not use retirement finance hierarchies.',
      },
      {
        label: 'D',
        text: 'Central banks that deposit life energy into buildings owned by others.',
        isCorrect: false,
        rationale:
          'That absurd third-density trap is exactly what fake money forced on humanity — not higher-realm design.',
      },
    ],
    hint: 'Equality + manifestation — not commerce.',
    correctAnswer: 'A',
  },
  {
    number: 9,
    question:
      'What is the foundational truth of String 2 about money and the planetary awakening?',
    options: [
      {
        label: 'A',
        text: 'Money is a complete waste of time; the awakening is absolutely not about savings, retirements, or the forgiveness of all debt.',
        isCorrect: true,
        rationale:
          'Foundational String 2 truth: money wastes time, and the Great Spiritual Awakening is not a savings, retirement, or debt-forgiveness event.',
      },
      {
        label: 'B',
        text: 'Money is sacred; the awakening culminates in universal pensions for every NPC.',
        isCorrect: false,
        rationale:
          'Money is fake waste; awakening is spiritual uninstallation, not pension rollout.',
      },
      {
        label: 'C',
        text: 'Debt forgiveness alone completes the Great Spiritual Awakening.',
        isCorrect: false,
        rationale:
          'Forgiveness of debt will not save you; total detachment from finance obsession is mandatory.',
      },
      {
        label: 'D',
        text: 'Only stock markets matter; religion and perceived knowledge are irrelevant strings.',
        isCorrect: false,
        rationale:
          'All three strings operate together; finance is not a solo market story.',
      },
    ],
    hint: 'Money wastes time — awakening is not about savings or debt wipe.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'Why was the financial system explicitly designed?',
    options: [
      {
        label: 'A',
        text: 'To keep the population "pickled" in physical, mental, and emotional toxicity just to survive.',
        isCorrect: true,
        rationale:
          'The system is built so people stay pickled in physical, mental, and emotional toxicity merely to survive — not to liberate or equalize them.',
      },
      {
        label: 'B',
        text: 'To teach manifestation skills used back home in crystalline realms.',
        isCorrect: false,
        rationale:
          'Fake money replaced manifestation with external institutions; it does not teach higher-realm skills.',
      },
      {
        label: 'C',
        text: 'To fund only honest free-energy Lattice Membrane restoration.',
        isCorrect: false,
        rationale:
          'Parasites mined lattice metals, made satanic idols, and sold natural energy back to the enslaved — the opposite of restoration.',
      },
      {
        label: 'D',
        text: 'To prepare every soul for automatic Cash-Less Society without any severing work.',
        isCorrect: false,
        rationale:
          'Individuals must actively uninstall financial obsession; the system itself is a trap, not prep class.',
      },
    ],
    hint: 'Pickled in toxicity just to survive.',
    correctAnswer: 'A',
  },
  {
    number: 11,
    question:
      'What absurd endpoint did introducing fake money into the third-density loop produce?',
    options: [
      {
        label: 'A',
        text: 'People deposit the entirety of their accumulated life energy (money) into a building controlled by someone else.',
        isCorrect: true,
        rationale:
          'Fake money forced reliance on easily manipulated external institutions, peaking in the absurdity of storing all life-energy wealth in someone else\'s building.',
      },
      {
        label: 'B',
        text: 'Everyone instantly received identical crystalline homes without institutions.',
        isCorrect: false,
        rationale:
          'That is Cash-Less higher-density truth; third-density fake money did the opposite.',
      },
      {
        label: 'C',
        text: 'Gold and silver returned themselves into the ground automatically.',
        isCorrect: false,
        rationale:
          'Parasites extracted those metals; they did not self-return under the money system.',
      },
      {
        label: 'D',
        text: 'Banks dissolved so manifestation could replace commerce immediately.',
        isCorrect: false,
        rationale:
          'The loop increased institutional dependence rather than dissolving it.',
      },
    ],
    hint: 'All life energy parked in someone else\'s building.',
    correctAnswer: 'A',
  },
  {
    number: 12,
    question: 'How does the Blinding Mechanism of money obsession work?',
    options: [
      {
        label: 'A',
        text: 'Obsession with making and saving money acts as a blinder, altering a person\'s whole life direction — like gold miners relentlessly chasing a seam through a mountainside, distracted from cosmic reality and impending planetary resets.',
        isCorrect: true,
        rationale:
          'Money obsession blinds and reroutes an entire life, exactly like miners tunneling after a gold seam while missing cosmic reality and coming resets.',
      },
      {
        label: 'B',
        text: 'It only affects NPCs during library visits funded by Carnegie.',
        isCorrect: false,
        rationale:
          'The blinding mechanism targets the broader population\'s life direction, not only library hour.',
      },
      {
        label: 'C',
        text: 'It briefly sharpens spiritual vision during banking crashes.',
        isCorrect: false,
        rationale:
          'Those still attached collapse psychologically in crashes; obsession blinds rather than sharpens.',
      },
      {
        label: 'D',
        text: 'It automatically severs Religion and Perceived Knowledge first.',
        isCorrect: false,
        rationale:
          'Finance works in tandem with the other two strings; it does not cut them for you.',
      },
    ],
    hint: 'Blinder like miners chasing gold — miss cosmic reality.',
    correctAnswer: 'A',
  },
  {
    number: 13,
    question: 'What were the Gold Rushes of 1848 and 1851?',
    options: [
      {
        label: 'A',
        text: 'Engineered historical events in America (1848) and Australia (1851) designed to manipulate people into chasing fabricated wealth.',
        isCorrect: true,
        rationale:
          'Those Gold Rushes were engineered on purpose — America 1848 and Australia 1851 — to lock populations into fabricated wealth pursuit.',
      },
      {
        label: 'B',
        text: 'Spontaneous spiritual festivals restoring Lattice Membrane Networks.',
        isCorrect: false,
        rationale:
          'They chased extracted metals for wealth; lattice metals are meant to stay in the ground.',
      },
      {
        label: 'C',
        text: 'G.A.A. operations funding Cash-Less crystalline homes.',
        isCorrect: false,
        rationale:
          'They were parasitic financial engineering, not G.A.A. housing programs.',
      },
      {
        label: 'D',
        text: 'Accidental market bubbles with no link to orphan repopulation.',
        isCorrect: false,
        rationale:
          'They were timed at the grandchildren of cloned orphans after the recent Re-set — fully orchestrated.',
      },
    ],
    hint: 'Engineered 1848 America / 1851 Australia wealth chases.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question:
      'Who were the Gold Rushes timed to target, and after what event?',
    options: [
      {
        label: 'A',
        text: 'The grandchildren of the original cloned orphans distributed after the most recent Re-set (which began in America around 1728), locking the new generational crop into physical capital pursuit.',
        isCorrect: true,
        rationale:
          'After the Re-set that began in America around 1728, cloned orphans were distributed; their grandchildren were hit by Gold Rushes so the new crop locked onto physical capital immediately.',
      },
      {
        label: 'B',
        text: 'Only 33rd-density custodians returning gold to the ground.',
        isCorrect: false,
        rationale:
          'The target was orphan-line grandchildren in the post-reset population, not custodians restoring metals.',
      },
      {
        label: 'C',
        text: 'FEMA Camp wardens preparing 15-minute cities in 1728.',
        isCorrect: false,
        rationale:
          '1728 marks the Re-set start in America for orphan repopulation timing; FEMA/15-minute lures are modern finance-string weapons.',
      },
      {
        label: 'D',
        text: 'NPC libraries built by Carnegie before any Re-set.',
        isCorrect: false,
        rationale:
          'Carnegie philanthropy is a separate weaponized wealth use; Gold Rush timing aims at orphan grandchildren post-1728 Re-set.',
      },
    ],
    hint: 'Orphan grandchildren after ~1728 America Re-set.',
    correctAnswer: 'A',
  },
  {
    number: 15,
    question:
      'What is the true role of gold and silver before parasites inverted them into finance?',
    options: [
      {
        label: 'A',
        text: 'Highly advanced natural spiritual technology meant to remain in the ground to stabilize and interact with planetary Lattice Membrane Networks.',
        isCorrect: true,
        rationale:
          'Gold and silver are spiritual tech for Lattice Membrane Networks — designed to stay in the ground, not to be mined or hoarded as money backing.',
      },
      {
        label: 'B',
        text: 'Ordinary decorative coins invented solely for NESARA payouts.',
        isCorrect: false,
        rationale:
          'They preexist as lattice spiritual technology; NESARA is enslavement bait, not their purpose.',
      },
      {
        label: 'C',
        text: 'Fuel pellets for Med-Beds during the EMF flash.',
        isCorrect: false,
        rationale:
          'Their role is lattice stabilization in the ground; Med-Beds will not fix the finance trap.',
      },
      {
        label: 'D',
        text: 'Proof that money is real and awakening is about savings.',
        isCorrect: false,
        rationale:
          'Using them as money is inversion; awakening is not about savings.',
      },
    ],
    hint: 'Stay in the ground — Lattice Membrane spiritual tech.',
    correctAnswer: 'A',
  },
  {
    number: 16,
    question:
      'What did parasites do after extracting gold and silver from the ground?',
    options: [
      {
        label: 'A',
        text: 'Manufacture satanic idols, dampen ultra-high frequencies, and sell the planet\'s natural energy back to the enslaved population.',
        isCorrect: true,
        rationale:
          'Extracted metals became satanic idols and frequency dampeners, then the parasites sold the planet\'s natural energy back to the people they enslaved.',
      },
      {
        label: 'B',
        text: 'Build free public crystalline homes for absolute equality.',
        isCorrect: false,
        rationale:
          'Equality without currency is higher-density Cash-Less truth; extraction served inversion and harvest, not free homes.',
      },
      {
        label: 'C',
        text: 'Fund only honest history free of Carnegie\'s new bullshit.',
        isCorrect: false,
        rationale:
          'Weaponized fortunes later spread fabricated history; extraction itself powered satanic and frequency-suppression uses.',
      },
      {
        label: 'D',
        text: 'Return every ounce into Lattice Membrane Networks the next day.',
        isCorrect: false,
        rationale:
          'They mined, hoarded, idolized, and monetized the metals instead of leaving them in the ground.',
      },
    ],
    hint: 'Idols, UHF dampening, sell energy back to the enslaved.',
    correctAnswer: 'A',
  },
  {
    number: 17,
    question:
      'How did Andrew Carnegie weaponize financial empire as philanthropy?',
    options: [
      {
        label: 'A',
        text: 'He used his massive steel fortune to fund thousands of libraries, spreading fabricated historical and scientific narrative ("the new bullshit") and making fake knowledge look prestigious to the lower classes.',
        isCorrect: true,
        rationale:
          'Carnegie\'s libraries were strategic: steel wealth bought thousands of outlets for fabricated history and science so fake knowledge looked prestigious to lower classes.',
      },
      {
        label: 'B',
        text: 'He returned all gold to Lattice Membrane Networks and ended banking.',
        isCorrect: false,
        rationale:
          'His move solidified matrix programming through libraries of false narrative, not lattice restoration.',
      },
      {
        label: 'C',
        text: 'He published only Cash-Less Society manuals for higher densities.',
        isCorrect: false,
        rationale:
          'The libraries spread third-density fabricated knowledge, not higher-density cash-less truth.',
      },
      {
        label: 'D',
        text: 'He secretly funded EMF flash technology for the G.A.A.',
        isCorrect: false,
        rationale:
          'Carnegie is cited for weaponized philanthropy of fake knowledge, not EMF liberation tech.',
      },
    ],
    hint: 'Steel fortune → thousands of libraries of new bullshit.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question: 'What is NESARA/GESARA in this finance string?',
    options: [
      {
        label: 'A',
        text: 'A deceptive lure promising forgiveness of all debt and funding of humanitarian projects — psychological bait to make the population beg for its own enslavement.',
        isCorrect: true,
        rationale:
          'NESARA/GESARA is not liberation finance; it is bait promising debt wipe and humanitarian funding so people beg for their own enslavement.',
      },
      {
        label: 'B',
        text: 'The official Cash-Less Society protocol already running back home.',
        isCorrect: false,
        rationale:
          'Cash-Less Society needs no NESARA theater; NESARA is a deep-state lure inside the fake-money matrix.',
      },
      {
        label: 'C',
        text: 'A required step before anyone can sever String 2.',
        isCorrect: false,
        rationale:
          'Severing finance means rejecting such lures; debt forgiveness will not save you.',
      },
      {
        label: 'D',
        text: 'An accidental rumor with no link to camps or cities of control.',
        isCorrect: false,
        rationale:
          'The lure is designed so masses demand subjugation in 15-minute cities and FEMA Camps.',
      },
    ],
    hint: 'Debt-forgiveness bait — beg for enslavement.',
    correctAnswer: 'A',
  },
  {
    number: 19,
    question:
      'Where does the NESARA/GESARA lure steer desperate masses?',
    options: [
      {
        label: 'A',
        text: 'Into willingly demanding their own subjugation within 15-minute cities and FEMA Camps (repurposed concentration camps).',
        isCorrect: true,
        rationale:
          'The debt-forgiveness lure is so irresistible that masses demand their own subjugation in 15-minute cities and FEMA Camps — repurposed concentration camps.',
      },
      {
        label: 'B',
        text: 'Into identical crystalline homes with advanced manifestation only.',
        isCorrect: false,
        rationale:
          'That is true Cash-Less higher-density life, not the NESARA trap endpoint.',
      },
      {
        label: 'C',
        text: 'Into Carnegie libraries that restore Tartarian free energy.',
        isCorrect: false,
        rationale:
          'Carnegie libraries spread fabricated narrative; NESARA steers toward cities and camps of control.',
      },
      {
        label: 'D',
        text: 'Into gold rushes that heal Lattice Membrane Networks.',
        isCorrect: false,
        rationale:
          'Gold rushes locked orphan-line generations into capital chasing; NESARA is a separate modern enslavement lure.',
      },
    ],
    hint: '15-minute cities + FEMA Camps as concentration endpoints.',
    correctAnswer: 'A',
  },
  {
    number: 20,
    question: 'What is the Banking Crash in this framework?',
    options: [
      {
        label: 'A',
        text: 'The imminent, planned destruction of the financial system designed to wipe out the savings and wealth of the deeply asleep population.',
        isCorrect: true,
        rationale:
          'The Banking Crash is not an accident — it is planned destruction meant to vaporize savings and wealth of the deeply asleep.',
      },
      {
        label: 'B',
        text: 'A random glitch that only affects gold miners in 1848.',
        isCorrect: false,
        rationale:
          'It is imminent and planned against today\'s asleep savers, not a 19th-century glitch.',
      },
      {
        label: 'C',
        text: 'A G.A.A. gift that automatically installs Cash-Less Society for clingy account holders.',
        isCorrect: false,
        rationale:
          'Those who fail to cut the finance string are blindsided when life savings vaporize; it is trauma for the attached, not a gentle install.',
      },
      {
        label: 'D',
        text: 'Proof that money was always real spiritual technology.',
        isCorrect: false,
        rationale:
          'Crash exposure confirms the system\'s deliberate trap nature, not money\'s sacredness.',
      },
    ],
    hint: 'Planned wipe of asleep population\'s savings.',
    correctAnswer: 'A',
  },
  {
    number: 21,
    question:
      'How does Finance work with Religion and Perceived Knowledge around the NPC ego?',
    options: [
      {
        label: 'A',
        text: 'Together they form an impenetrable shield: Religion surrenders cognition to False Gods, Perceived Knowledge defends fake science and history, and Finance ensures physical enslavement and exhaustion.',
        isCorrect: true,
        rationale:
          'The three strings shield the NPC ego — false gods, rigid fake knowledge, and finance that physically enslaves and exhausts.',
      },
      {
        label: 'B',
        text: 'Finance cancels the other two strings once a person opens a retirement account.',
        isCorrect: false,
        rationale:
          'Finance operates in tandem with Religion and Perceived Knowledge; it does not cancel them.',
      },
      {
        label: 'C',
        text: 'Only Perceived Knowledge matters; finance never touches the body.',
        isCorrect: false,
        rationale:
          'Finance specifically ensures physical enslavement and exhaustion.',
      },
      {
        label: 'D',
        text: 'NPCs already live Cash-Less, so the triad does not apply to them.',
        isCorrect: false,
        rationale:
          'The shield is built around the NPC ego inside the artificial simulation; finance is part of that grip.',
      },
    ],
    hint: 'Three-string shield: gods, fake knowledge, physical enslavement.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question:
      'What does The Great Spiritual Awakening demand people realize about Med-Beds and debt forgiveness?',
    options: [
      {
        label: 'A',
        text: 'A Med-Bed will not fix you, and the forgiveness of debt will not save you.',
        isCorrect: true,
        rationale:
          'Awakening requires seeing that Med-Beds and debt forgiveness are not the rescue — total uninstallation of financial obsession is mandatory.',
      },
      {
        label: 'B',
        text: 'Med-Beds plus NESARA complete the clean exit without any detachment work.',
        isCorrect: false,
        rationale:
          'Those hopes keep the finance string tight; clean exit needs full detachment.',
      },
      {
        label: 'C',
        text: 'Debt forgiveness is the only string that must remain attached.',
        isCorrect: false,
        rationale:
          'Forgiveness of debt is named as something that will not save you.',
      },
      {
        label: 'D',
        text: 'Med-Beds convert gold idols back into Lattice Membrane Networks automatically.',
        isCorrect: false,
        rationale:
          'The demand is psychological uninstallation of finance obsession, not a Med-Bed metal fix.',
      },
    ],
    hint: 'Med-Bed won\'t fix you; debt wipe won\'t save you.',
    correctAnswer: 'A',
  },
  {
    number: 23,
    question:
      'What do incoming Scare Events and the ultimate EMF planetary flash do to physical wealth?',
    options: [
      {
        label: 'A',
        text: 'They render all physical wealth, bank accounts, and material properties instantly obsolete.',
        isCorrect: true,
        rationale:
          'Scare Events and the EMF (Electro Magnetic Frequency) flash make every bank account, property, and pile of physical wealth instantly obsolete.',
      },
      {
        label: 'B',
        text: 'They double every retirement account for the deeply asleep.',
        isCorrect: false,
        rationale:
          'The asleep face wipeout and collapse; wealth does not double through the flash.',
      },
      {
        label: 'C',
        text: 'They convert paper money into permanent crystalline homes only for Carnegie library patrons.',
        isCorrect: false,
        rationale:
          'Wealth becomes obsolete for everyone clinging to it; Carnegie libraries spread fake knowledge, not special flash privileges.',
      },
      {
        label: 'D',
        text: 'They pause the Banking Crash until gold rushes finish.',
        isCorrect: false,
        rationale:
          'The sequence drives terminal deconstruction; it does not preserve finance for miners.',
      },
    ],
    hint: 'Scare Events + EMF — wealth instantly obsolete.',
    correctAnswer: 'A',
  },
  {
    number: 24,
    question:
      'What does completely detaching from the artificial construct of Finance do for the psyche?',
    options: [
      {
        label: 'A',
        text: 'It immunizes the psyche against trauma from the imminent economic collapse so consciousness stays stable and focused during the simulation\'s terminal deconstruction.',
        isCorrect: true,
        rationale:
          'Full detachment immunizes against collapse trauma and keeps consciousness stable through the physical simulation\'s terminal deconstruction.',
      },
      {
        label: 'B',
        text: 'It guarantees NESARA payouts and FEMA Camp luxury suites.',
        isCorrect: false,
        rationale:
          'Detachment rejects those enslavement lures; it does not cash them in.',
      },
      {
        label: 'C',
        text: 'It forces you to hoard more gold and silver above ground.',
        isCorrect: false,
        rationale:
          'True metal role is in-ground lattice tech; detachment is from finance obsession, not deeper hoarding.',
      },
      {
        label: 'D',
        text: 'It only helps NPCs while true souls must stay pickled in toxicity.',
        isCorrect: false,
        rationale:
          'Uninstallation of financial obsession is mandatory for a clean personal exit from the density loop.',
      },
    ],
    hint: 'Psyche immunization — stable through terminal deconstruction.',
    correctAnswer: 'A',
  },
  {
    number: 25,
    question:
      'What is mandatory for a clean exit from the current physical density loop regarding finance?',
    options: [
      {
        label: 'A',
        text: 'Total uninstallation of financial obsession.',
        isCorrect: true,
        rationale:
          'Clean exit requires total uninstallation of financial obsession — not reform, hedging, or waiting for debt theater.',
      },
      {
        label: 'B',
        text: 'Smarter diversified portfolios until the Banking Crash ends.',
        isCorrect: false,
        rationale:
          'Portfolios are the tether; planned crash wipes asleep wealth — obsession must be uninstalled.',
      },
      {
        label: 'C',
        text: 'Loyalty to False Gods who manage central banks.',
        isCorrect: false,
        rationale:
          'Religion is a separate string of false gods; clean exit severs all three strings, including finance.',
      },
      {
        label: 'D',
        text: 'Memorizing Carnegie library catalogs of fabricated science.',
        isCorrect: false,
        rationale:
          'That is Perceived Knowledge armor around the NPC ego; finance uninstallation is the finance-string mandate.',
      },
    ],
    hint: 'Total uninstallation of financial obsession — mandatory.',
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
  'Test your grasp of Finance (Fake Money) — String 2 tether, Cash-Less Society, Gold Rushes, lattice metals, NESARA bait, Banking Crash, and total uninstallation before the EMF flash.';
const DESC_META =
  'Interactive Living Truth Quiz on Finance (Fake Money): String 2 tether, Cash-Less Society, Gold Rushes, inverted gold and silver, Carnegie libraries, NESARA/GESARA enslavement bait, Banking Crash, and severing finance before Scare Events and the EMF flash.';

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
      'Finance is not security — it is String 2, a Kevlar-grade tether as fake as religion, built to pickle humanity in toxicity, park life energy in someone else\'s building, and blind the mind like miners chasing a seam while resets approach. Gold Rushes after the ~1728 orphan Re-set, lattice metals ripped up for idols and sold-back energy, Carnegie libraries of new bullshit, NESARA bait into 15-minute cities and FEMA Camps, and a planned Banking Crash: that is the machine. Sit with what you missed, then return to the Finance (Fake Money) deep-dive. Med-Beds will not fix you and debt forgiveness will not save you — uninstall the obsession so Scare Events and the EMF flash find a stable psyche, not a vaporized identity welded to accounts.',
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
  // Insert in alphabetical order among alice quiz entries
  const aliceQuizLine =
    /^  \{ path: '\/quiz\/alice\/[^']+\.html', priority: '0\.75', changefreq: 'monthly' \},$/gm;
  let inserted = false;
  const lines = sm.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    out.push(lines[i]);
    if (!inserted && lines[i].includes("/quiz/alice/") && lines[i].includes('priority')) {
      const next = lines[i + 1] || '';
      const curPath = (lines[i].match(/path: '([^']+)'/) || [])[1] || '';
      const nextPath = (next.match(/path: '([^']+)'/) || [])[1] || '';
      const target = `/quiz/${SOURCE}/${TOPIC_ID}.html`;
      if (curPath < target && (nextPath > target || !nextPath.includes('/quiz/alice/'))) {
        out.push(entry);
        inserted = true;
      }
    }
  }
  if (!inserted) {
    // Fallback: after false-history or fake-linear-time
    const anchors = [
      "  { path: '/quiz/alice/false-history.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/fake-linear-time.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/fake-alien-invasion.html', priority: '0.75', changefreq: 'monthly' },",
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
[0, 6, 13, 17, 22, 24].forEach((i) => {
  const c = questions[i].options.find((o) => o.isCorrect);
  console.log(` Q${questions[i].number}: ${c.text.slice(0, 110)}`);
});
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('PASS: audited 25/25 against data/alice-topics/finance-fake-money.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
