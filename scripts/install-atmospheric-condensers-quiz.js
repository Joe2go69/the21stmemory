/**
 * Installs Atmospheric Condensers quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/atmospheric-condensers.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Run: node scripts/install-atmospheric-condensers-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'atmospheric-condensers';
const TOPIC_TITLE = 'Atmospheric Condensers';
const SOURCE = 'alice';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

// Every correct concept grounded in THIS topic's report only.
const supportPhrases = {
  1: ['atmospheric augmentation systems', 'free-energy', 'great tartary'],
  2: ['industrial revolution', 'orchestrated fall', 'dismantling'],
  3: ['electromagnetic inductance', 'superheat', 'boiler', 'coal'],
  4: ['ley lines', 'lattice membrane', 'railway tracks'],
  5: ['copper', 'resonator', 'domes', 'locomotives'],
  6: ['dark ages', 'deliberately destroyed', 'tartaria'],
  7: ['varying magnetic field', 'electromotive force', 'without combustion'],
  8: ['legacy machines', 'inherited from tartaria', '19th century'],
  9: ['44 museum photographs', '305 miles', 'coal tender', 'before 1880'],
  10: ['thomas russel crampton', '1875', '40-60%'],
  11: ['russian engineering review', '1883', '40-60%'],
  12: ['consolidated coal company', '1887', 'smelted'],
  13: ['locomotive 34', 'swiss northern railway', '1987'],
  14: ['3 feet', 'diameter', 'height', '2-foot', 'spire'],
  15: ['fibonacci', 'golden ratio', 'copper wire'],
  16: ['20 miles per hour', 'baseline speed'],
  17: ['tracks', 'ley lines', 'fluctuating', 'electromagnetism'],
  18: ['coal consumption ceases', 'remainder of the journey'],
  19: ['miniature replica', 'romanesque', 'thai temples', 'static energy resonators'],
  20: ['london underground', 'pneumatic', 'electricity-free'],
  21: ['nodal points', 'tartarian cities', 'roads and railways'],
  22: ['baphomet power pylons', 'backed-up', 'ley line energy'],
  23: ['edward sterling', 'pennsylvania railway', 'coal fields'],
  24: ['artificial scarcity', 'finance paradigm', 'lattice membrane'],
  25: ['1887', 'forced financial dependency', 'consumable fuel'],
};

/** Plain English: no LaTeX, MathJax, Markdown math, or $...$ wrappers. */
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
    inner
      .replace(/\^\{([^}]+)\}/g, '$1')
      .replace(/\\%/g, '%')
      .replace(/\\/g, '')
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
      'What other name is used for Atmospheric Condensers, and what is their origin?',
    options: [
      {
        label: 'A',
        text: 'Atmospheric Augmentation Systems from the pre-reset civilisation of Great Tartary (Tartaria).',
        isCorrect: true,
        rationale:
          'Atmospheric Condensers are Atmospheric Augmentation Systems from pre-reset Great Tartary — free-energy harvesting apparatuses.',
      },
      {
        label: 'B',
        text: 'Steam Recovery Stacks invented during the Industrial Revolution in England.',
        isCorrect: false,
        rationale:
          'The Industrial Revolution is described as the fall of Tartaria, not the invention era of these free-energy devices.',
      },
      {
        label: 'C',
        text: 'Coal Superchargers patented by the Consolidated Coal Company in 1887.',
        isCorrect: false,
        rationale:
          'That company ordered the condensers destroyed to protect a fuel monopoly, not invent them.',
      },
      {
        label: 'D',
        text: 'Pneumatic domes designed exclusively for the original London Underground.',
        isCorrect: false,
        rationale:
          'The London Underground is a related Tartarian transit method; condensers were locomotive-mounted resonators.',
      },
    ],
    hint: 'Match the alternate name and the civilisation that originated free-energy harvesting.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question:
      'How is the Industrial Revolution reframed relative to Tartarian technology?',
    options: [
      {
        label: 'A',
        text: 'As the organic invention of free-energy locomotives by Victorian engineers.',
        isCorrect: false,
        rationale:
          'Locomotives are described as legacy Tartarian machines, not independent 19th-century inventions.',
      },
      {
        label: 'B',
        text: 'As the orchestrated fall and dismantling of a highly advanced civilisation of excellence.',
        isCorrect: true,
        rationale:
          'The Industrial Revolution was the orchestrated fall and dismantling of Great Tartary, with legacy tech repurposed or destroyed.',
      },
      {
        label: 'C',
        text: 'As a peaceful partnership between Tartaria and modern coal companies.',
        isCorrect: false,
        rationale:
          'Coal interests forced eradication of condensers; there was no peaceful partnership.',
      },
      {
        label: 'D',
        text: 'As the moment Tartaria openly shared Fibonacci coil designs with the public.',
        isCorrect: false,
        rationale:
          'The narrative is systematic downgrade and suppression, not open technology sharing.',
      },
    ],
    hint: 'Think dismantling and dependency, not genuine industrial progress.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question:
      'What primary locomotive function did Atmospheric Condensers perform via Electromagnetic Inductance?',
    options: [
      {
        label: 'A',
        text: 'They cooled the tracks so steel rails would not warp at high speed.',
        isCorrect: false,
        rationale:
          'The condensers heated boiler water; they did not cool rails.',
      },
      {
        label: 'B',
        text: 'They superheated boiler water, eliminating the need for vast quantities of coal.',
        isCorrect: true,
        rationale:
          'Condensers superheated boiler water via Electromagnetic Inductance, eliminating vast coal use by drawing ambient power from Ley Lines.',
      },
      {
        label: 'C',
        text: 'They converted coal smoke into clean drinking water for passengers.',
        isCorrect: false,
        rationale:
          'The technology harvests electromagnetic energy for the boiler, not smoke conversion.',
      },
      {
        label: 'D',
        text: 'They generated wireless telegraph signals between nodal cities.',
        isCorrect: false,
        rationale:
          'The function is propulsion energy and free-energy harvesting, not telegraphy.',
      },
    ],
    hint: 'Link inductance to boiler heat and reduced coal dependency.',
    correctAnswer: 'B',
  },
  {
    number: 4,
    question:
      'From what planetary energy system did the condensers draw ambient power, and why were railway tracks laid as they were?',
    options: [
      {
        label: 'A',
        text: 'From solar panels mounted on tenders; tracks followed cheapest valley routes only.',
        isCorrect: false,
        rationale:
          'Power comes from lattice membrane Ley Lines; tracks were laid strategically over those grids.',
      },
      {
        label: 'B',
        text: 'From underground coal seams; tracks were laid only near Consolidated Coal mines.',
        isCorrect: false,
        rationale:
          'Coal monopoly interests later destroyed condensers; free energy came from Ley Lines, not coal seams.',
      },
      {
        label: 'C',
        text: 'From Electromagnetic Crystalline lattice membrane networks (Ley Lines) along which global railway tracks were strategically laid.',
        isCorrect: true,
        rationale:
          'Condensers drew power from lattice membrane networks known as Ley Lines, over which railway tracks were strategically laid.',
      },
      {
        label: 'D',
        text: 'From Baphomet Power Pylons that replaced all locomotive condensers after 1887.',
        isCorrect: false,
        rationale:
          'Pylons harvest backed-up Ley Line energy at urban centers; condensers used the same pathways on moving locomotives before eradication.',
      },
    ],
    hint: 'Connect free energy harvesting to Ley Lines and track placement.',
    correctAnswer: 'C',
  },
  {
    number: 5,
    question:
      'How are Atmospheric Condensers physically constructed?',
    options: [
      {
        label: 'A',
        text: 'As cast-iron chimneys that burned wood more efficiently than coal.',
        isCorrect: false,
        rationale:
          'They are copper resonator domes harvesting ambient electromagnetic energy, not improved chimneys.',
      },
      {
        label: 'B',
        text: 'As highly advanced copper Resonator domes with intricate wire configurations mounted on early locomotives.',
        isCorrect: true,
        rationale:
          'They are copper Resonator domes with intricate wire configurations mounted on locomotives to harvest planetary-grid energy.',
      },
      {
        label: 'C',
        text: 'As glass vacuum tubes filled with radium for soft green luminescence.',
        isCorrect: false,
        rationale:
          'That description is not in this Atmospheric Condensers report.',
      },
      {
        label: 'D',
        text: 'As wooden water towers beside stations that condensed river mist.',
        isCorrect: false,
        rationale:
          'They were locomotive-mounted copper domes, not stationary wooden water towers.',
      },
    ],
    hint: 'Recall copper, resonator dome, wires, and locomotive mounting.',
    correctAnswer: 'B',
  },
  {
    number: 6,
    question:
      'What is the truth about Great Tartary and how history recorded it?',
    options: [
      {
        label: 'A',
        text: 'It was a myth invented by 20th-century rail enthusiasts.',
        isCorrect: false,
        rationale:
          'Tartaria is presented as a real advanced civilisation deliberately destroyed and misrecorded.',
      },
      {
        label: 'B',
        text: 'It was a globally advanced free-energy civilisation deliberately destroyed and falsely recorded as the Dark Ages.',
        isCorrect: true,
        rationale:
          'Great Tartary is defined as a ubiquitous free-energy and harmonic-architecture civilisation deliberately destroyed and falsely recorded as the Dark Ages.',
      },
      {
        label: 'C',
        text: 'It survived intact and still operates the Swiss Northern Railway openly.',
        isCorrect: false,
        rationale:
          'Only one un-operational condenser unit is said to remain in deep storage; Tartaria was dismantled.',
      },
      {
        label: 'D',
        text: 'It was limited to Russia and never used copper resonators.',
        isCorrect: false,
        rationale:
          'The civilisation is described as globally ubiquitous with copper resonator technology.',
      },
    ],
    hint: 'Link free energy, deliberate destruction, and the Dark Ages label.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question:
      'What is Electromagnetic Inductance in the context of how condensers heated train boilers?',
    options: [
      {
        label: 'A',
        text: 'Burning denser coal grades to raise steam pressure faster.',
        isCorrect: false,
        rationale:
          'Inductance superheats water without combustion once the condenser is engaged.',
      },
      {
        label: 'B',
        text: 'A process where a varying magnetic field induces voltage across a conductor, used to superheat boiler water without combustion.',
        isCorrect: true,
        rationale:
          'Electromagnetic Inductance is a varying magnetic field inducing electromotive force across a conductor, used to superheat boiler water without combustion.',
      },
      {
        label: 'C',
        text: 'Pumping compressed air through pneumatic tunnels under the rails.',
        isCorrect: false,
        rationale:
          'Pneumatic air pressure describes the original London Underground, not condenser inductance.',
      },
      {
        label: 'D',
        text: 'Reflecting sunlight with polished spires into the firebox.',
        isCorrect: false,
        rationale:
          'The mechanism is electromagnetic flux through Fibonacci copper coils, not solar reflection.',
      },
    ],
    hint: 'Varying magnetic field, induced voltage, heat without combustion.',
    correctAnswer: 'B',
  },
  {
    number: 8,
    question:
      'What is the truth about the origin of 19th-century steam-powered locomotives?',
    options: [
      {
        label: 'A',
        text: 'They were independently invented during the 19th century with no Tartarian precedent.',
        isCorrect: false,
        rationale:
          'Independent 19th-century invention is false.',
      },
      {
        label: 'B',
        text: 'They were legacy machines inherited from Tartaria and subsequently modified.',
        isCorrect: true,
        rationale:
          'Core Revelations state steam locomotives were legacy Tartarian machines later modified, not independent Victorian inventions.',
      },
      {
        label: 'C',
        text: 'They were gifts from the Swiss Northern Railway starting in 1987.',
        isCorrect: false,
        rationale:
          '1987 is when Locomotive 34 has held the sole surviving unit in storage, not the origin of all locomotives.',
      },
      {
        label: 'D',
        text: 'They were built solely to smelt copper for government building domes.',
        isCorrect: false,
        rationale:
          'Smelting targeted condensers in 1887; locomotives themselves were transit machines from Tartaria.',
      },
    ],
    hint: 'Legacy inheritance versus independent invention.',
    correctAnswer: 'B',
  },
  {
    number: 9,
    question:
      'What archival photographic evidence exists about early trains before 1880?',
    options: [
      {
        label: 'A',
        text: '44 museum photographs showing journeys of up to 305 miles with no attached coal tender.',
        isCorrect: true,
        rationale:
          '44 museum photographs from before 1880 of trains traveling up to 305 miles without a coal tender—impossible under standard thermodynamics.',
      },
      {
        label: 'B',
        text: '12 photographs of nuclear locomotives crossing the Ice Wall.',
        isCorrect: false,
        rationale:
          'Those details are not; the evidence is coal-tender-free journeys documented in museum photos.',
      },
      {
        label: 'C',
        text: 'Hundreds of color films showing condensers being installed after 1900.',
        isCorrect: false,
        rationale:
          'The cited archive is pre-1880 museum photographs, and condensers were ordered destroyed in 1887.',
      },
      {
        label: 'D',
        text: 'A single postcard of Locomotive 34 hauling coal through Pennsylvania.',
        isCorrect: false,
        rationale:
          'Locomotive 34 holds the sole surviving unit in Swiss storage; the 44 photos concern coal-free long journeys.',
      },
    ],
    hint: 'Count the photos, the mileage, and what was missing from the train.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question:
      'What did Thomas Russel Crampton document in 1875 regarding early railway locomotives?',
    options: [
      {
        label: 'A',
        text: 'That condensers reduced passenger fares by 90% worldwide.',
        isCorrect: false,
        rationale:
          'The cited finding is performance increases and coal reductions of 40-60%, not fare cuts.',
      },
      {
        label: 'B',
        text: 'Performance increases and coal reductions of 40-60% in "Observations on Anomalous Steam Generation in Early Railway Locomotives."',
        isCorrect: true,
        rationale:
          'In 1875 Crampton authored that work calculating 40-60% performance increases and coal reductions.',
      },
      {
        label: 'C',
        text: 'That all condensers should be smelted to protect coal markets.',
        isCorrect: false,
        rationale:
          'That mandate came from the Consolidated Coal Company in 1887, not Crampton in 1875.',
      },
      {
        label: 'D',
        text: 'That Ley Lines were imaginary and trains needed more coal tenders.',
        isCorrect: false,
        rationale:
          'Crampton documented anomalous efficiency gains consistent with free-energy assistance.',
      },
    ],
    hint: '1875 paper title and the 40-60% figures.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question:
      'Which later publication corroborated the same 40-60% efficiency gains?',
    options: [
      {
        label: 'A',
        text: 'A 2008 estate auction catalog from Pennsylvania alone.',
        isCorrect: false,
        rationale:
          'The 2008 Sterling letter concerns the motive for eradication, not the efficiency measurements.',
      },
      {
        label: 'B',
        text: 'An 1883 article in the Russian Engineering Review on imperial locomotives.',
        isCorrect: true,
        rationale:
          'An 1883 Russian Engineering Review article corroborated the exact 40-60% efficiency gains on imperial locomotives.',
      },
      {
        label: 'C',
        text: 'A 1987 Swiss Northern Railway press release about Locomotive 34.',
        isCorrect: false,
        rationale:
          '1987 relates to storage of the sole surviving unit, not the efficiency corroboration.',
      },
      {
        label: 'D',
        text: 'A Victorian cookbook describing steam kitchen appliances.',
        isCorrect: false,
        rationale:
          'The corroborating source is a Russian engineering journal article.',
      },
    ],
    hint: 'Year 1883 and the Russian engineering journal.',
    correctAnswer: 'B',
  },
  {
    number: 12,
    question:
      'What did the Consolidated Coal Company mandate in 1887 regarding Atmospheric Condensers?',
    options: [
      {
        label: 'A',
        text: 'Mass production of condensers for every imperial railway.',
        isCorrect: false,
        rationale:
          'The mandate was permanent eradication, not mass production.',
      },
      {
        label: 'B',
        text: 'Permanent eradication: all condensers forcibly removed and completely smelted into molten metal to protect their fuel monopoly.',
        isCorrect: true,
        rationale:
          'In 1887 the Consolidated Coal Company ordered condensers removed and smelted to protect its fuel monopoly.',
      },
      {
        label: 'C',
        text: 'Donation of condensers to museums for public education.',
        isCorrect: false,
        rationale:
          'Units were smelted; only one known unit escaped destruction into deep storage.',
      },
      {
        label: 'D',
        text: 'Conversion of condensers into Baphomet Power Pylons in cities.',
        isCorrect: false,
        rationale:
          'Pylons are a separate Ley Line harvesting infrastructure; condensers were smelted.',
      },
    ],
    hint: '1887, smelting, fuel monopoly.',
    correctAnswer: 'B',
  },
  {
    number: 13,
    question:
      'What is the status of the only known Atmospheric Condenser unit that evaded destruction?',
    options: [
      {
        label: 'A',
        text: 'It still powers scheduled passenger service across Europe.',
        isCorrect: false,
        rationale:
          'The unit remains un-operational in deep storage.',
      },
      {
        label: 'B',
        text: 'It remains un-operational in deep storage on Locomotive 34, held by the Swiss Northern Railway since 1987.',
        isCorrect: true,
        rationale:
          'Only one known unit evaded destruction and is un-operational in deep storage on Locomotive 34 with the Swiss Northern Railway since 1987.',
      },
      {
        label: 'C',
        text: 'It was melted in Pennsylvania after Edward Sterling retired.',
        isCorrect: false,
        rationale:
          'Sterling confirmed the coal-monopoly motive; the surviving unit is in Swiss storage.',
      },
      {
        label: 'D',
        text: 'It was rebuilt as a Thai Temple dome in the 20th century.',
        isCorrect: false,
        rationale:
          'Temple domes share design lineage as static resonators; the surviving unit is on Locomotive 34.',
      },
    ],
    hint: 'Locomotive number, country, year, and that it is not operating.',
    correctAnswer: 'B',
  },
  {
    number: 14,
    question:
      'What approximate dimensions and crowning feature define the copper condenser unit?',
    options: [
      {
        label: 'A',
        text: 'About 3 feet in diameter and 3 feet in height, crowned with a 2-foot upward-pointing spire.',
        isCorrect: true,
        rationale:
          'The unit is described as roughly 3 feet diameter and height, with a 2-foot upward-pointing spire for atmospheric energy harvesting.',
      },
      {
        label: 'B',
        text: 'Ten meters tall with no spire, matching full-size government buildings.',
        isCorrect: false,
        rationale:
          'The condenser is a miniature dome replica, about 3 feet scale, not building-sized.',
      },
      {
        label: 'C',
        text: 'One foot square with a downward iron spike into the firebox.',
        isCorrect: false,
        rationale:
          'Dimensions and the upward copper spire do not match those facts.',
      },
      {
        label: 'D',
        text: 'Flat plates only, with no dome or spire at all.',
        isCorrect: false,
        rationale:
          'It is a massive copper resonator dome with a crowning spire.',
      },
    ],
    hint: 'Three-foot cube-like dome plus a two-foot upward spire.',
    correctAnswer: 'A',
  },
  {
    number: 15,
    question:
      'How was the internal copper wire arranged inside the condenser dome?',
    options: [
      {
        label: 'A',
        text: 'In random coils with no geometric pattern.',
        isCorrect: false,
        rationale:
          'The wire is pulled into exact Fibonacci-series patterns and Golden Ratio formations.',
      },
      {
        label: 'B',
        text: 'Densely packed and pulled tightly into exact Fibonacci-series patterns and Golden Ratio formations.',
        isCorrect: true,
        rationale:
          'Internally the dome houses densely packed copper wire in Fibonacci-series and Golden Ratio formations.',
      },
      {
        label: 'C',
        text: 'As a single straight bus bar of iron.',
        isCorrect: false,
        rationale:
          'The material is copper wire in geometric free-energy patterns, not a simple iron bar.',
      },
      {
        label: 'D',
        text: 'Braided with coal dust to improve combustion.',
        isCorrect: false,
        rationale:
          'The goal is inductance without combustion, not improved coal burning.',
      },
    ],
    hint: 'Fibonacci series and Golden Ratio inside the copper dome.',
    correctAnswer: 'B',
  },
  {
    number: 16,
    question:
      'What baseline speed was required before the Atmospheric Condenser would engage?',
    options: [
      {
        label: 'A',
        text: 'Coal or wood only had to propel the locomotive to 20 miles per hour; then the condenser engaged.',
        isCorrect: true,
        rationale:
          'Coal or wood was needed only to reach a baseline of 20 miles per hour, after which the condenser engaged.',
      },
      {
        label: 'B',
        text: 'The train had to exceed 100 miles per hour before any inductance began.',
        isCorrect: false,
        rationale:
          'the baseline is 20 miles per hour, not 100.',
      },
      {
        label: 'C',
        text: 'No initial fuel was ever required; the condenser worked from a dead stop.',
        isCorrect: false,
        rationale:
          'Initial coal or wood was required to reach the engagement speed.',
      },
      {
        label: 'D',
        text: 'Engagement required a full stop at every Nodal temple for ritual charging.',
        isCorrect: false,
        rationale:
          'Engagement is velocity-based while moving over Ley Lines, not stop-and-charge rituals.',
      },
    ],
    hint: 'Initial fuel only until a specific miles-per-hour threshold.',
    correctAnswer: 'A',
  },
  {
    number: 17,
    question:
      'Why did train tracks being built over Ley Lines matter for condenser operation?',
    options: [
      {
        label: 'A',
        text: 'It let the locomotive travel through intense, fluctuating pockets of electromagnetism that drove inductance in the Fibonacci coils.',
        isCorrect: true,
        rationale:
          'Tracks over Ley Lines meant continuous travel through fluctuating electromagnetism; moving Fibonacci copper coils through that flux triggered Electromagnetic Inductance.',
      },
      {
        label: 'B',
        text: 'It kept locomotives hidden from Consolidated Coal inspectors.',
        isCorrect: false,
        rationale:
          'The purpose is energetic, not concealment from inspectors.',
      },
      {
        label: 'C',
        text: 'It allowed tracks to float above the ground without ties or ballast.',
        isCorrect: false,
        rationale:
          'Tracks follow energetic pathways for propulsion, not floating track beds.',
      },
      {
        label: 'D',
        text: 'It forced trains to burn more coal in magnetic fields.',
        isCorrect: false,
        rationale:
          'The result is near-cessation of coal use after engagement, not increased burning.',
      },
    ],
    hint: 'Fluctuating magnetic flux plus moving copper coils equals inductance.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question:
      'After the condenser engaged at speed, what happened to coal use for the rest of the journey?',
    options: [
      {
        label: 'A',
        text: 'Coal consumption doubled to feed the resonator dome.',
        isCorrect: false,
        rationale:
          'Consumption nearly stopped; free ambient energy heated the boiler.',
      },
      {
        label: 'B',
        text: 'Coal consumption ceased almost entirely for the remainder of the journey.',
        isCorrect: true,
        rationale:
          'Once engaged, inductance continuously superheated boiler water and coal consumption ceased almost entirely for the rest of the journey.',
      },
      {
        label: 'C',
        text: 'The firebox switched from coal to pure radium pellets.',
        isCorrect: false,
        rationale:
          'No radium fuel switch is described; ambient electromagnetic energy replaces most coal.',
      },
      {
        label: 'D',
        text: 'Crews still needed a full coal tender for every 305-mile segment.',
        isCorrect: false,
        rationale:
          'Pre-1880 photos show long journeys with no coal tender at all.',
      },
    ],
    hint: 'Near-zero coal after free-energy engagement.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question:
      'What larger architectural pattern does the condenser dome replicate, and why?',
    options: [
      {
        label: 'A',
        text: 'It is an exact miniature replica of Romanesque and Colonial domed roofs and Thai Temple domes designed as static energy resonators.',
        isCorrect: true,
        rationale:
          'The external dome is an exact miniature of those global domed roofs, all designed to function as static energy resonators within a unified Tartarian grid.',
      },
      {
        label: 'B',
        text: 'It copies modern nuclear cooling towers for aesthetic fashion only.',
        isCorrect: false,
        rationale:
          'The lineage is Tartarian harmonic resonators, not modern nuclear aesthetics.',
      },
      {
        label: 'C',
        text: 'It mimics coal tipples so inspectors would ignore free-energy hardware.',
        isCorrect: false,
        rationale:
          'The shared geometry is energetic, matching temple and government building domes.',
      },
      {
        label: 'D',
        text: 'It has no relation to any building; the resemblance is coincidence.',
        isCorrect: false,
        rationale:
          'The condenser is part of a unified infrastructure and an exact miniature replica of those domes.',
      },
    ],
    hint: 'Miniature dome equals static resonator architecture worldwide.',
    correctAnswer: 'A',
  },
  {
    number: 20,
    question:
      'What is the truth about the original London Underground relative to Tartarian transit?',
    options: [
      {
        label: 'A',
        text: 'It was always a diesel subway with no free-energy connection.',
        isCorrect: false,
        rationale:
          'It was initially pneumatic and electricity-free before downgrade.',
      },
      {
        label: 'B',
        text: 'It was initially designed to operate on pneumatic air pressure—clean, rapid, electricity-free mass transit—before being downgraded to perilous electrical systems.',
        isCorrect: true,
        rationale:
          'The original London Underground is cited as Tartarian pneumatic transit later downgraded to dangerous electrical systems.',
      },
      {
        label: 'C',
        text: 'It used Atmospheric Condensers on every carriage after 1887.',
        isCorrect: false,
        rationale:
          'Condensers were ordered eradicated in 1887; the Underground example is pneumatic, not condenser-based.',
      },
      {
        label: 'D',
        text: 'It never existed until Consolidated Coal built it for fuel sales.',
        isCorrect: false,
        rationale:
          'It is presented as suppressed Tartarian methodology that predated the electrical downgrade.',
      },
    ],
    hint: 'Pneumatic first, electrical downgrade later.',
    correctAnswer: 'B',
  },
  {
    number: 21,
    question:
      'Beyond convenience, why were roads and railways placed where they were?',
    options: [
      {
        label: 'A',
        text: 'They physically trace Crystalline lattice membrane networks to interconnect major Nodal points (Tartarian cities).',
        isCorrect: true,
        rationale:
          'Placement was not mere geographic convenience; roads and railways trace lattice networks to link Tartarian nodal cities.',
      },
      {
        label: 'B',
        text: 'They avoided Ley Lines entirely so magnetic fields would not derail trains.',
        isCorrect: false,
        rationale:
          'Tracks were purposefully over Ley Lines to harvest fluctuating electromagnetism.',
      },
      {
        label: 'C',
        text: 'They were random paths chosen by coin toss in the 19th century.',
        isCorrect: false,
        rationale:
          'Roads and railways follow deliberate energetic interconnection of nodes.',
      },
      {
        label: 'D',
        text: 'They only connected coal mines owned by Edward Sterling.',
        isCorrect: false,
        rationale:
          'Sterling confirmed coal monopoly motives later; the original grid linked Tartarian nodal cities.',
      },
    ],
    hint: 'Lattice paths between nodal Tartarian cities.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question:
      'How do Baphomet Power Pylons relate to the same energetic pathways used by condenser locomotives?',
    options: [
      {
        label: 'A',
        text: 'They harvest backed-up Ley Line energy radiating outward from suppressed urban centers, while locomotives used those same pathways for propulsion.',
        isCorrect: true,
        rationale:
          'Pylons harvest backed-up Ley Line energy from suppressed urban centers; locomotives used the same energetic pathways for propulsion.',
      },
      {
        label: 'B',
        text: 'They replaced Ley Lines entirely after the condensers were smelted.',
        isCorrect: false,
        rationale:
          'Pylons harvest from the same Ley Line system; they do not replace it.',
      },
      {
        label: 'C',
        text: 'They are purely decorative statues with no energy function.',
        isCorrect: false,
        rationale:
          'They are described as harvesting backed-up Ley Line energy.',
      },
      {
        label: 'D',
        text: 'They powered only the Swiss storage vault for Locomotive 34.',
        isCorrect: false,
        rationale:
          'Their role is urban Ley Line harvest, parallel to locomotive pathway use.',
      },
    ],
    hint: 'Same Ley Line energy; pylons at cities, condensers on trains.',
    correctAnswer: 'A',
  },
  {
    number: 23,
    question:
      'What did the 2008 estate auction letter from Edward Sterling confirm about the motive for destroying condensers?',
    options: [
      {
        label: 'A',
        text: 'That condensers were unsafe at any speed above 5 miles per hour.',
        isCorrect: false,
        rationale:
          'Sterling confirmed ownership of coal fields and the need for continuous fuel purchases, not a safety claim.',
      },
      {
        label: 'B',
        text: 'That controllers owned the coal fields and required the population to continuously purchase consumable fuel.',
        isCorrect: true,
        rationale:
          'Sterling, former Chief Engineer of the Pennsylvania Railway (1874–1902), confirmed the objective: coal-field owners needed continuous consumable fuel purchases.',
      },
      {
        label: 'C',
        text: 'That Tartaria voluntarily sold all copper domes to museums.',
        isCorrect: false,
        rationale:
          'The operation was forced eradication for financial dependency, not voluntary museum sales.',
      },
      {
        label: 'D',
        text: 'That Fibonacci wiring was a clerical error in Russian journals.',
        isCorrect: false,
        rationale:
          'His letter addresses the strategic fuel-monopoly motive, not dismissing coil geometry.',
      },
    ],
    hint: 'Coal ownership and forced ongoing fuel purchases.',
    correctAnswer: 'B',
  },
  {
    number: 24,
    question:
      'How did severing free-energy access to lattice membrane networks serve the Finance paradigm?',
    options: [
      {
        label: 'A',
        text: 'It enforced artificial scarcity central to Finance and conditioned people to accept austere, toxic, profitable matrix constraints.',
        isCorrect: true,
        rationale:
          'Severing free-energy access enforced artificial scarcity central to Finance and degraded expectations so populations accepted the profitable societal matrix.',
      },
      {
        label: 'B',
        text: 'It made gold-backed currency unnecessary and abolished all banks.',
        isCorrect: false,
        rationale:
          'The result is deeper financial dependency, not the abolition of money systems.',
      },
      {
        label: 'C',
        text: 'It increased Tartarian harmonic architecture in every city.',
        isCorrect: false,
        rationale:
          'Erasing Tartaria degraded aesthetic and technological expectations.',
      },
      {
        label: 'D',
        text: 'It had no economic purpose and was only a religious reform.',
        isCorrect: false,
        rationale:
          'Smelting was calculated forced financial dependency.',
      },
    ],
    hint: 'Artificial scarcity and conditioning into a profitable matrix.',
    correctAnswer: 'A',
  },
  {
    number: 25,
    question:
      'What is the larger strategic meaning of the 1887 systematic smelting of Atmospheric Condensers?',
    options: [
      {
        label: 'A',
        text: 'A random industrial accident with no lasting social effect.',
        isCorrect: false,
        rationale:
          'It is described as a highly calculated parasitic operation.',
      },
      {
        label: 'B',
        text: 'A calculated operation by the parasitic cabal to initiate forced financial dependency on consumable fuel.',
        isCorrect: true,
        rationale:
          'The 1887 smelting is a calculated parasitic strategy to force financial dependency by locking humanity into purchasing consumable fuel.',
      },
      {
        label: 'C',
        text: 'A public safety upgrade recommended by Thomas Russel Crampton.',
        isCorrect: false,
        rationale:
          'Crampton documented efficiency gains; coal interests ordered eradication later.',
      },
      {
        label: 'D',
        text: 'A temporary recall until better Fibonacci patterns could be printed.',
        isCorrect: false,
        rationale:
          'The eradication was permanent smelting into molten metal to end free-energy locomotives.',
      },
    ],
    hint: 'Parasitic cabal, 1887, forced fuel dependency.',
    correctAnswer: 'B',
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
    throw new Error(`Q${q.number}: LaTeX-like markup or $ found:\n${blob}`);
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
    'Test your grasp of Atmospheric Condensers — Tartarian free-energy locomotive resonators, Ley Line inductance, 40-60% coal savings, and the 1887 smelting that enforced fuel dependency.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      "Atmospheric Condensers were never Victorian curiosities — they were Tartarian copper resonator domes that rode Ley Lines, engaged at 20 miles per hour, and superheated boilers through Electromagnetic Inductance until coal was almost unnecessary. Sit with what you missed, then return to the Atmospheric Condensers deep-dive, infographics, and video transmissions. The 1887 smelting was not progress; it was the forced turn into artificial scarcity — and remembering the free-energy grid is part of the Great Remembering.",
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
    'Test your understanding of Atmospheric Condensers — Tartarian free-energy locomotive resonators, Ley Line inductance, documented 40-60% coal savings, and the 1887 eradication for fuel monopoly.',
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
  throw new Error('atmospheric-condensers not found in alice-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', 'alice', 'nature-of-reality.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Nature of Reality Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Nature of Reality: the flat plain, Firmament, density suppression, and the Great Spiritual Awakening.',
    'Interactive Living Truth Quiz on Atmospheric Condensers: Tartarian free-energy locomotive resonators, Ley Line inductance, 40-60% coal savings, and the 1887 smelting for fuel monopoly.',
  ],
  ['quiz/alice/nature-of-reality.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/nature-of-reality.webp', 'images/alice/atmospheric-condensers.webp'],
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
    "  { path: '/quiz/alice/ascension-event.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/alice/anunnaki.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/alice/antiquity-technology.html', priority: '0.75', changefreq: 'monthly' },",
  ];
  let inserted = false;
  for (const anchor of anchors) {
    if (sm.includes(anchor)) {
      sm = sm.replace(anchor, `${anchor}\n${entry}`);
      inserted = true;
      break;
    }
  }
  if (!inserted) {
    throw new Error('Could not find sitemap anchor to insert quiz entry');
  }
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

console.log('Sample correct answers:');
[0, 8, 11, 12, 15].forEach((i) => {
  const c = questions[i].options.find((o) => o.isCorrect);
  console.log(` Q${questions[i].number}: ${c.text.slice(0, 100)}`);
});
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log(
  'PASS: audited 25/25 against data/alice-topics/atmospheric-condensers.json'
);
