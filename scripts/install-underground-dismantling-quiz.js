/**
 * Installs Underground Dismantling quiz for Mega Breakdown (breakdown) transmission.
 * All 25 items authored from data/breakdown-topics/underground-dismantling.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run:
 *   node scripts/install-underground-dismantling-quiz.js
 *   node scripts/rebalance-quiz-length.js data/quizzes/breakdown/underground-dismantling.json
 *   node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'underground-dismantling';
const TOPIC_TITLE = 'Underground Dismantling';
const SOURCE = 'breakdown';
const TOPIC_IMAGE = 'images/breakdown/underground-dismantling.webp';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

/** Support phrases grounded only in underground-dismantling.json report. */
const supportPhrases = {
  1: ['underground dismantling', 'phase three', '3rd realm collapse'],
  2: ['phase one', 'phase two', 'subterranean'],
  3: ['money', 'human lifeforce', 'parasitic empire'],
  4: ['3rd realm collapse', 'underground economy', 'physical infrastructure'],
  5: ['dumbs', 'trafficking', 'military'],
  6: ['adrenochrome', 'child organ harvesting', 'stock market'],
  7: ['military and allied special forces', 'shipping routes', 'cargoes'],
  8: ['stock market', 'facade', 'underground economy'],
  9: ['human and child trafficking', 'drug pipelines', 'organ harvesting'],
  10: ['political offices', 'corporate boardrooms', 'underground lifeblood'],
  11: ['bankrupt', 'harvesting of human energy'],
  12: ['shipping routes', 'intercepting', 'cargoes'],
  13: ['tunnels', 'underground cities', 'dumbs'],
  14: ['drug running', 'smuggling', 'trafficking of humans'],
  15: ['child organ harvesting', 'adrenochrome production'],
  16: ['foundational wealth', 'money and human supply'],
  17: ['capstone', 'three-phase'],
  18: ['high military', 'police brass', 'political leaders'],
  19: ['clones', 'stand-in actors', 'a.i. driven composites'],
  20: ['political shield', 'psychological programming', 'global lockdowns'],
  21: ['hollowed out', 'lifeblood'],
  22: ['enforce their will', 'money and human supply'],
  23: ['narrative maintenance', 'mass reveal window', 'sleeping masses'],
  24: ['3d matrix net', 'light grids', 'sterilization'],
  25: ['reconstruction and ascension', 'restored realm']
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

/**
 * Each question: { question, hint, options: [correct, wrong, wrong, wrong] }
 * with { text, rationale }. finalizeOptions shuffles labels.
 */
const RAW = [
  {
    question: 'What is the Underground Dismantling within the Great Purge?',
    hint: 'Its phase number and primary character of the strike.',
    options: [
      {
        text: 'Phase Three: 3rd Realm Collapse — the decisive physical and financial strike that obliterated subterranean infrastructure and illicit supply chains.',
        rationale:
          'Underground Dismantling is Phase Three: 3rd Realm Collapse, the decisive physical and financial strike against dark controllers’ subterranean networks and supply chains.'
      },
      {
        text: 'Phase One apex leadership removal that only arrests royals and banking heads with no tunnel or pipeline action.',
        rationale:
          'Phase One decapitates political apex predators; Underground Dismantling is Phase Three’s physical and financial underground strike.'
      },
      {
        text: 'Phase Two cultural neutralization that only replaces entertainment figures and leaves DUMBS fully operational.',
        rationale:
          'Phase Two neutralizes cultural programmers; this phase systematically destroys underground cities, pipelines, and harvest supply.'
      },
      {
        text: 'A purely symbolic media announcement with no military seizures of shipping routes or subterranean bases.',
        rationale:
          'Military and Allied Special Forces seized shipping, intercepted cargoes, and dismantled tunnels and DUMBS — a real physical operation.'
      }
    ]
  },
  {
    question: 'When could this third phase run relative to Phases One and Two?',
    hint: 'What had to fall before subterranean networks were exposed.',
    options: [
      {
        text: 'Only after Phase One removed political apex protectors and Phase Two neutralized cultural programmers who could incite panic.',
        rationale:
          'It follows Phase One’s decapitation of political apex predators and Phase Two’s neutralization of cultural programmers before subterranean obliteration.'
      },
      {
        text: 'Before any political or cultural targets were touched, so tunnels fell while apex shields remained fully intact.',
        rationale:
          'It could only occur after Phase One neutralized leaders who protected underground networks and Phase Two held surface optics.'
      },
      {
        text: 'Simultaneously with open mass-reveal broadcasts that showed every raid live from the first hour.',
        rationale:
          'The three phases ran as a seamless covert sequence under global lockdown cover before the later mass reveal window.'
      },
      {
        text: 'After the organic Light Grids had already fully activated and the 3D Matrix Net was completely gone.',
        rationale:
          'Underground sterilization secures the realm so Light Grids can activate when the 3D Matrix Net collapses — not after full activation first.'
      }
    ]
  },
  {
    question: 'What vital flows did destroying these physical networks sever?',
    hint: 'What sustained the parasitic empire beneath the surface.',
    options: [
      {
        text: 'The vital flow of money and human lifeforce that sustained the overarching parasitic empire.',
        rationale:
          'Destroying subterranean infrastructure and illicit supply chains severed the vital flow of money and human lifeforce sustaining the parasitic empire.'
      },
      {
        text: 'Only tourist shipping tickets, with trafficking, drugs, and Adrenochrome production left untouched as legal trade.',
        rationale:
          'The strike hit trafficking, drug pipelines, organ harvesting, and Adrenochrome — the illicit money and human-supply lifeblood.'
      },
      {
        text: 'Only surface entertainment royalties while underground harvest networks kept full funding and cargo access.',
        rationale:
          'Phase Three targets underground money and human lifeforce, not merely surface entertainment cash flows.'
      },
      {
        text: 'Nothing material — parasites retained full money and human supply after a cosmetic rebrand of tunnel names.',
        rationale:
          'Financial decapitation removed foundational wealth and starved remaining operations of money and human supply.'
      }
    ]
  },
  {
    question: 'What does 3rd Realm Collapse focus on exclusively?',
    hint: 'Key terminology definition of Phase Three.',
    options: [
      {
        text: 'Destruction of the underground economy and its physical infrastructure — not surface political offices alone.',
        rationale:
          '3rd Realm Collapse is the third phase focusing exclusively on destruction of the underground economy and its physical infrastructure.'
      },
      {
        text: 'Replacement of sports icons and CEOs for optics with no action against tunnels, DUMBS, or pipelines.',
        rationale:
          'CEO and cultural optic replacement is Phase Two; 3rd Realm Collapse destroys the underground economy and infrastructure.'
      },
      {
        text: 'Open stock-market education seminars that leave subterranean harvest systems fully funded and running.',
        rationale:
          'Phase Three annihilates underground economic infrastructure that secretly backed markets — it does not leave harvest systems running.'
      },
      {
        text: 'Only narrative speeches about future reforms without seizing cargoes or demolishing subterranean cities.',
        rationale:
          'Tactical seizures, subterranean demolition, and pipeline severance are concrete Phase Three mechanics, not speech-only reform.'
      }
    ]
  },
  {
    question: 'What are DUMBS in this dismantling operation?',
    hint: 'Bases, cities, and what they were used for.',
    options: [
      {
        text: 'Deep underground military bases and subterranean cities used for trafficking, smuggling, and harvesting — systematically dismantled by military forces.',
        rationale:
          'DUMBS are deep underground military bases and subterranean cities for trafficking, smuggling, and harvesting, dismantled by military forces.'
      },
      {
        text: 'Surface shopping malls rebranded as military museums with no trafficking, smuggling, or harvesting role.',
        rationale:
          'DUMBS are subterranean bases and cities used for trafficking, smuggling, and harvesting — not surface malls.'
      },
      {
        text: 'Public libraries that stored only stock-market paperwork and never hosted underground cargo networks.',
        rationale:
          'DUMBS are hidden subterranean infrastructure for illicit trafficking and harvesting, not public libraries.'
      },
      {
        text: 'Orbital stations above the atmosphere with no tunnels, no smuggling routes, and no military ground entry.',
        rationale:
          'Forces entered and dismantled vast underground tunnel and city networks beneath the surface — not orbital stations.'
      }
    ]
  },
  {
    question: 'How was Adrenochrome generated, and what larger system did it secretly back?',
    hint: 'Harvest method and financial facade connection.',
    options: [
      {
        text: 'Through child organ harvesting and human trafficking, secretly backing the entire world stock market for the dark controllers.',
        rationale:
          'Adrenochrome is a vital resource for dark controllers generated through child organ harvesting and human trafficking, and it secretly backed the entire world stock market.'
      },
      {
        text: 'Through voluntary adult blood drives that transparently funded public infrastructure with no market link.',
        rationale:
          'Adrenochrome production is tied to child organ harvesting and human trafficking as illicit underground economy, not voluntary public blood drives.'
      },
      {
        text: 'Through ordinary pharmaceutical patents that never connected to trafficking, organ harvesting, or markets.',
        rationale:
          'It is generated through child organ harvesting and human trafficking and secretly backed the stock market as parasitic lifeblood.'
      },
      {
        text: 'Through surface sports betting alone, with no role in child trafficking or organ harvesting networks.',
        rationale:
          'Adrenochrome is produced via child organ harvesting and human trafficking as underground harvest resource, not sports betting.'
      }
    ]
  },
  {
    question: 'Who executed the tactical seizures of routes and cargoes?',
    hint: 'Named military actors in the key terminology.',
    options: [
      {
        text: 'Military and Allied Special Forces who seized global shipping routes, intercepted cargoes, and destroyed subterranean tunnel networks.',
        rationale:
          'Military and Allied Special Forces were deployed to seize global shipping routes, intercept cargoes, and destroy subterranean tunnel networks.'
      },
      {
        text: 'Only entertainment stand-ins and media composites with no military authority over shipping or tunnels.',
        rationale:
          'Stand-ins manage surface optics from Phase Two; Phase Three tactical work is Military and Allied Special Forces.'
      },
      {
        text: 'Volunteer civilian bloggers who mapped tunnels online without seizing routes or intercepting cargo.',
        rationale:
          'The sweep was a military special-forces operation taking total control of shipping routes and intercepting cargoes.'
      },
      {
        text: 'Parasitic banking heads who voluntarily surrendered every cargo ship before any force deployment.',
        rationale:
          'Forces initiated seizures and demolition against the underground system; it was not a voluntary banking surrender.'
      }
    ]
  },
  {
    question: 'What was the visible world stock market relative to the underground economy?',
    hint: 'Core revelation about the financial facade.',
    options: [
      {
        text: 'A facade entirely backed by a massive hidden underground economy of trafficking, drugs, organ harvesting, and Adrenochrome.',
        rationale:
          'The visible global financial system, including the world stock market, was a facade entirely backed by a massive hidden underground economy.'
      },
      {
        text: 'A fully independent transparent market with no connection to trafficking, drugs, or Adrenochrome production.',
        rationale:
          'The stock market was secretly backed by the underground harvest and trafficking economy — not independent of it.'
      },
      {
        text: 'A temporary Phase Two media prop that never depended on subterranean cities or illicit pipelines.',
        rationale:
          'Core revelation places stock-market backing in the underground economy of trafficking, drugs, organs, and Adrenochrome.'
      },
      {
        text: 'A pure Light Grid ledger that funded organic ascension without any parasitic underground backing.',
        rationale:
          'Visible markets were a facade for parasitic underground lifeblood; Light Grids activate after that sterilization.'
      }
    ]
  },
  {
    question: 'Which illicit systems composed that subterranean economy?',
    hint: 'Trafficking, drugs, organs, and the harvest product.',
    options: [
      {
        text: 'Human and child trafficking, drug pipelines, organ harvesting, and mass production of Adrenochrome.',
        rationale:
          'The subterranean system was built upon human and child trafficking, drug pipelines, organ harvesting, and mass production of Adrenochrome.'
      },
      {
        text: 'Only legal pharmaceutical exports with full public audits and no trafficking or harvesting networks.',
        rationale:
          'The underground economy is illicit trafficking, drugs, organ harvesting, and Adrenochrome — not audited legal pharma alone.'
      },
      {
        text: 'Only surface fashion logistics with no tunnels, no child trafficking, and no organ harvesting role.',
        rationale:
          'The system is subterranean trafficking, drug pipelines, organ harvesting, and Adrenochrome production.'
      },
      {
        text: 'Only historical museums of crime with no active smuggling, harvesting, or pipeline operations remaining.',
        rationale:
          'Active networks were methodically destroyed — they were live illicit systems, not inert museum displays.'
      }
    ]
  },
  {
    question: 'Where did the true power of the parasites primarily root, beyond offices and boardrooms?',
    hint: 'Physical lifeblood versus surface titles.',
    options: [
      {
        text: 'In the physical underground lifeblood of cities, pipelines, and harvest supply — not solely political offices or corporate boardrooms.',
        rationale:
          'True parasitic power did not solely reside in political offices or corporate boardrooms; it was deeply rooted in physical underground lifeblood.'
      },
      {
        text: 'Only in televised award speeches with no dependence on tunnels, cargoes, or human harvest supply.',
        rationale:
          'Power was rooted in underground physical lifeblood; surface culture was not the exclusive power base of Phase Three’s target.'
      },
      {
        text: 'Only in public school curricula that never linked to DUMBS, shipping seizures, or Adrenochrome production.',
        rationale:
          'The strike targets subterranean infrastructure and illicit supply chains as the true power root of the controllers.'
      },
      {
        text: 'Only in open democratic votes that fully funded Light Grid activation without any underground economy.',
        rationale:
          'Parasitic power was rooted in hidden underground lifeblood that had to be eradicated to bankrupt the controllers.'
      }
    ]
  },
  {
    question: 'Why was eradicating underground cities and pipelines an absolute necessity?',
    hint: 'Bankruptcy of controllers and the harvest of human energy.',
    options: [
      {
        text: 'To permanently bankrupt the controllers and halt the harvesting of human energy at its physical source.',
        rationale:
          'Eradicating underground cities and pipelines was an absolute necessity to permanently bankrupt the controllers and halt harvesting of human energy.'
      },
      {
        text: 'To renovate tourist tunnels while leaving Adrenochrome production and trafficking fully funded.',
        rationale:
          'The goal is permanent bankruptcy of controllers and halt of human-energy harvest — not tourist renovation of illicit networks.'
      },
      {
        text: 'To transfer DUMBS ownership to media moguls so surface optics could openly advertise harvest routes.',
        rationale:
          'Networks were destroyed to cut money and human supply; media moguls were already optic-replaced to prevent panic, not to inherit DUMBS.'
      },
      {
        text: 'To strengthen the stock-market facade by expanding underground harvest capacity after lockdowns.',
        rationale:
          'Phase Three annihilates the underground assets that funded parasite power — it does not expand harvest capacity.'
      }
    ]
  },
  {
    question: 'How did the tactical seizure phase of the sweep begin?',
    hint: 'Routes and cargoes under special-forces control.',
    options: [
      {
        text: 'Military and Allied Special Forces took total control over global shipping routes and intercepted vital cargoes.',
        rationale:
          'Tactical seizures began with Military and Allied Special Forces taking total control of global shipping routes and intercepting vital cargoes.'
      },
      {
        text: 'Corporate press teams issued apology tours while shipping routes remained fully under parasitic control.',
        rationale:
          'The initiation is military seizure of shipping and cargo interception, not corporate apology tours.'
      },
      {
        text: 'Sleeping masses were told to blockade ports with no special-forces role in intercepting cargoes.',
        rationale:
          'Special forces executed the seizures; public sleepers were held with narrative maintenance optics, not tasked as the seizure force.'
      },
      {
        text: 'Banking heads voluntarily published every cargo manifest before any force took a single route.',
        rationale:
          'Forces initiated the sweep by taking control and intercepting cargoes — it was not a voluntary banking disclosure first.'
      }
    ]
  },
  {
    question: 'What did subterranean demolition target beneath the surface?',
    hint: 'Tunnel networks and named base type.',
    options: [
      {
        text: 'Vast networks of tunnels and underground cities (DUMBS) that forces aggressively entered and dismantled.',
        rationale:
          'Subterranean demolition saw forces aggressively enter and dismantle vast networks of tunnels and underground cities (DUMBS).'
      },
      {
        text: 'Only empty surface warehouses with no tunnels, no DUMBS, and no subterranean city systems.',
        rationale:
          'Demolition targeted subterranean tunnels and DUMBS hidden beneath the surface, not only surface warehouses.'
      },
      {
        text: 'Only decorative subway murals while leaving trafficking tunnels and military bases intact.',
        rationale:
          'The operation dismantled the vast underground city and tunnel networks used for trafficking and harvesting.'
      },
      {
        text: 'Orbital ring stations that had no connection to deep underground military bases or tunnel grids.',
        rationale:
          'Targets are deep underground bases and tunnel networks beneath the surface — not orbital infrastructure.'
      }
    ]
  },
  {
    question: 'What did pipeline severance methodically destroy?',
    hint: 'Drugs, smuggling, and human cargo flows.',
    options: [
      {
        text: 'All interconnected pipelines used for drug running, smuggling, and the trafficking of humans and children.',
        rationale:
          'Pipeline severance methodically destroyed interconnected pipelines for drug running, smuggling, and trafficking of humans and children.'
      },
      {
        text: 'Only municipal water pipes with no link to drugs, smuggling, or human trafficking networks.',
        rationale:
          'The pipelines destroyed are illicit drug, smuggling, and human/child trafficking conduits — not ordinary water mains alone.'
      },
      {
        text: 'Only digital social-media cables while physical smuggling and trafficking routes stayed open.',
        rationale:
          'Phase Three severs physical underground illicit pipelines for drugs, smuggling, and human trafficking.'
      },
      {
        text: 'Nothing — every drug and trafficking pipeline was left running to avoid market instability.',
        rationale:
          'Methodical destruction of those pipelines was a core mechanical element of the underground dismantling.'
      }
    ]
  },
  {
    question: 'What was the primary mechanical objective of resource eradication?',
    hint: 'Child harvest and the product that funded parasite power.',
    options: [
      {
        text: 'To completely halt child organ harvesting and Adrenochrome production, annihilating illicit assets that funded parasite power.',
        rationale:
          'Resource eradication’s primary objective was completely halting child organ harvesting and Adrenochrome production, annihilating illicit funding assets.'
      },
      {
        text: 'To increase Adrenochrome output so the stock-market facade would grow stronger after lockdowns.',
        rationale:
          'The objective is complete halt of Adrenochrome production and child organ harvesting — not increased output.'
      },
      {
        text: 'To move harvest labs to surface studios so media moguls could openly film production for ratings.',
        rationale:
          'Harvest production was eradicated as illicit underground asset destruction, not relocated for media spectacle.'
      },
      {
        text: 'To replace Adrenochrome with ordinary sports supplements while leaving organ harvesting networks intact.',
        rationale:
          'Both child organ harvesting and Adrenochrome production were primary eradication targets of this phase.'
      }
    ]
  },
  {
    question: 'What did financial decapitation accomplish by destroying physical networks?',
    hint: 'Foundational wealth and remaining operations.',
    options: [
      {
        text: 'It instantly removed the foundational wealth of the parasites, starving remaining operations of money and human supply.',
        rationale:
          'By seizing and destroying physical networks, the operation instantly removed foundational wealth and starved remaining operations of money and human supply.'
      },
      {
        text: 'It donated all underground wealth back to the same controllers under a new public charity brand.',
        rationale:
          'Financial decapitation removes foundational wealth from parasites — it does not return supply to them as charity.'
      },
      {
        text: 'It only froze surface checking accounts while subterranean cargo and harvest wealth kept flowing.',
        rationale:
          'Destroying physical underground networks removed the foundational wealth rooted in those illicit systems.'
      },
      {
        text: 'It funded larger DUMBS construction so parasites could enforce their will with deeper bases.',
        rationale:
          'DUMBS were dismantled and wealth removed; parasites were stripped of ability to enforce will, not given deeper bases.'
      }
    ]
  },
  {
    question: 'How does Underground Dismantling sit in the initial three-phase takedown?',
    hint: 'Capstone role after shield and programming fall.',
    options: [
      {
        text: 'It is the capstone — physical destruction of the parasitic control grid after political shield and psychological programming were cleared.',
        rationale:
          'Underground Dismantling is the capstone of the initial three-phase takedown: after political shield removal and psychological programming disablement comes physical destruction.'
      },
      {
        text: 'It is the optional first step that can run before any political or cultural neutralization.',
        rationale:
          'It could only occur after Phase One and Phase Two cleared protectors and surface panic risk — it is the capstone, not the opener.'
      },
      {
        text: 'It replaces Phases One and Two entirely so leadership and media never need separate operations.',
        rationale:
          'All three phases form a seamless sequence; underground destruction is the third capstone, not a substitute for One and Two.'
      },
      {
        text: 'It is unrelated to the Great Purge and only renovates civilian subways after ascension completes.',
        rationale:
          'It is Phase Three of the Great Purge and the capstone physical strike of the initial three-phase takedown.'
      }
    ]
  },
  {
    question: 'Who historically protected the underground networks that Phase One had to neutralize first?',
    hint: 'Military, police, and political layers.',
    options: [
      {
        text: 'High military, police brass, and political leaders who historically protected these underground networks.',
        rationale:
          'Phase One neutralized the high military, police brass, and political leaders who historically protected the underground networks.'
      },
      {
        text: 'Only mid-level shop clerks with no military, police, or political authority over subterranean systems.',
        rationale:
          'Protectors named are high military, police brass, and political leaders — apex enforcers, not clerks.'
      },
      {
        text: 'Only Resonating Sols who openly guided Light Grid activation inside every DUMB before Phase One.',
        rationale:
          'Historical protectors of the underground networks were high military, police, and political leaders — not Resonating Sols.'
      },
      {
        text: 'Nobody — underground networks never required political or military protection of any kind.',
        rationale:
          'Phase One’s neutralization of those protectors was required before underground dismantling could proceed.'
      }
    ]
  },
  {
    question: 'How did Phase Two’s Infrastructure Sweep prevent panic as underground finances were gutted?',
    hint: 'Who was already replaced on public platforms.',
    options: [
      {
        text: 'Corporate CEOs and media moguls were already replaced by clones, stand-in actors, and A.I. driven composites so platforms could not incite panic.',
        rationale:
          'Phase Two ensured corporate CEOs and media moguls were replaced by clones, stand-in actors, and A.I. driven composites, preventing panic as financial foundations were gutted.'
      },
      {
        text: 'Every CEO and media mogul kept full real-world power and used platforms to broadcast every tunnel raid live.',
        rationale:
          'They were already optic-replaced so they could not use platforms to incite panic during financial gutting.'
      },
      {
        text: 'No optic replacements existed; Phase Three relied on empty news desks with zero composite technology.',
        rationale:
          'Clones, stand-in actors, and A.I. driven composites were already in place from Phase Two for panic control.'
      },
      {
        text: 'Media moguls were promoted into military command of DUMBS demolition crews instead of being replaced.',
        rationale:
          'Phase Two replaced them for optics; Military and Allied Special Forces ran the physical underground dismantling.'
      }
    ]
  },
  {
    question: 'What seamless sequence did Phases One through Three form under lockdown cover?',
    hint: 'Shield, programming, then physical grid destruction.',
    options: [
      {
        text: 'Removing the political shield, disabling psychological programming, then executing physical destruction of the parasitic control grid under global lockdowns.',
        rationale:
          'Phases One through Three formed a seamless sequence: political shield removal, psychological programming disablement, then physical destruction under global lockdown cover.'
      },
      {
        text: 'Activating Light Grids first, then restoring full underground harvest, then returning political shields to parasites.',
        rationale:
          'The sequence clears shield and programming then destroys the underground grid; it does not restore harvest or parasite shields.'
      },
      {
        text: 'Open mass-reveal day one, then optional tunnel tours, with no lockdown cover and no phased shield removal.',
        rationale:
          'The sequence ran under global lockdown cover as covert phased takedown before the later mass reveal window.'
      },
      {
        text: 'Only cultural award cancellations with no political shield removal and no physical underground destruction.',
        rationale:
          'All three layers — political shield, psychological programming, and physical grid — were sequenced in the purge.'
      }
    ]
  },
  {
    question: 'What condition was the old power structure left in after successful underground dismantling?',
    hint: 'Strategic implications opening image.',
    options: [
      {
        text: 'Entirely hollowed out — lifeblood money and human supply completely removed from the old structure.',
        rationale:
          'Successful dismantling left the old power structure entirely hollowed out, with lifeblood money and human supply completely removed.'
      },
      {
        text: 'Stronger than before, with deeper DUMBS and expanded Adrenochrome pipelines after lockdowns.',
        rationale:
          'Networks were destroyed and wealth removed; the structure was hollowed out, not strengthened.'
      },
      {
        text: 'Unchanged on the underground layer, with only surface logos swapped for narrative flair.',
        rationale:
          'Physical and financial sterilization of underground infrastructure hollowed out the old power structure.'
      },
      {
        text: 'Fully restored to original controllers once stand-ins finished a brief optics-only holiday.',
        rationale:
          'Parasites were permanently stripped of enforcement ability; remaining public view is controlled illusion, not restored command.'
      }
    ]
  },
  {
    question: 'What ability were parasites permanently stripped of once money and human supply were gone?',
    hint: 'Enforcement of their will.',
    options: [
      {
        text: 'Their ability to enforce their will, because lifeblood money and human supply were completely removed.',
        rationale:
          'With lifeblood money and human supply completely removed, parasites were permanently stripped of their ability to enforce their will.'
      },
      {
        text: 'Only their ability to win sports awards, while underground enforcement power remained fully intact.',
        rationale:
          'Removed was enforcement power rooted in money and human supply — the underground lifeblood of control.'
      },
      {
        text: 'Nothing permanent — they immediately rebuilt full harvest pipelines the week after Phase Three.',
        rationale:
          'Dismantling permanently stripped enforcement ability through total removal of money and human supply lifeblood.'
      },
      {
        text: 'Only their ability to appear on clones, while real subterranean command structure stayed funded.',
        rationale:
          'Foundational wealth and human supply were destroyed; remaining surface presence is hollow illusion, not funded subterranean command.'
      }
    ]
  },
  {
    question: 'What currently remains in the public eye after this physical and financial sterilization?',
    hint: 'Illusion phase until a timed disclosure.',
    options: [
      {
        text: 'A tightly controlled illusion of narrative maintenance using stand-ins to keep sleeping masses manageable until the mass reveal window.',
        rationale:
          'What remains publicly is a tightly controlled illusion — narrative maintenance with stand-ins holding sleeping masses until the designated mass reveal window.'
      },
      {
        text: 'Fully empowered underground economies broadcasting open harvest schedules with no stand-ins required.',
        rationale:
          'Underground economies were destroyed; public eye holds controlled illusion and stand-ins, not open harvest broadcasts.'
      },
      {
        text: 'An already completed mass reveal with every sleeper fully awake and no further narrative maintenance.',
        rationale:
          'Narrative maintenance continues until the designated mass reveal window — it is not already finished for all sleepers.'
      },
      {
        text: 'Only empty cities with no media, no stand-ins, and no managed story holding public attention.',
        rationale:
          'Stand-ins and narrative maintenance actively keep sleeping masses manageable until mass reveal.'
      }
    ]
  },
  {
    question: 'What does total physical and financial sterilization secure for the realm’s next stage?',
    hint: 'Matrix collapse and Light Grid activation.',
    options: [
      {
        text: 'When the 3D Matrix Net fully collapses, organic Light Grids can activate without interference from the old underground grid.',
        rationale:
          'Total physical and financial sterilization ensures that when the 3D Matrix Net fully collapses, organic Light Grids can activate without interference.'
      },
      {
        text: 'That parasitic DUMBS can reboot and block Light Grid activation permanently after the Matrix Net falls.',
        rationale:
          'Sterilization clears interference so Light Grids activate — it does not preserve DUMBS to block them.'
      },
      {
        text: 'That the stock-market facade rebuilds Adrenochrome backing before any Matrix collapse begins.',
        rationale:
          'Adrenochrome-backed underground wealth was annihilated; sterilization prepares Light Grid activation, not market harvest reboot.'
      },
      {
        text: 'That narrative maintenance becomes permanent so Light Grids never activate and the Matrix Net never collapses.',
        rationale:
          'Narrative maintenance is temporary until mass reveal; sterilization secures conditions for Matrix collapse and Light Grid activation.'
      }
    ]
  },
  {
    question: 'What larger process does this sterilization usher in for the restored realm?',
    hint: 'Reconstruction path after grid clearance.',
    options: [
      {
        text: 'Reconstruction and ascension of the restored realm once Light Grids activate without underground parasitic interference.',
        rationale:
          'Sterilization ushers in reconstruction and ascension of the restored realm as Light Grids activate without interference.'
      },
      {
        text: 'Permanent expansion of trafficking pipelines as the official economy of the so-called restored realm.',
        rationale:
          'Trafficking and harvest systems were destroyed; the path is reconstruction and ascension, not pipeline expansion.'
      },
      {
        text: 'Return of high military protectors to rebuild DUMBS under the same dark controller command structure.',
        rationale:
          'Those protectors were neutralized and underground infrastructure dismantled; the outcome is restored-realm reconstruction, not DUMBS rebuild.'
      },
      {
        text: 'Cancellation of all ascension pathways so the hollowed power structure can quietly restaff harvest labs.',
        rationale:
          'Strategic outcome is Light Grid activation and reconstruction/ascension of the restored realm after sterilization.'
      }
    ]
  }
];

if (RAW.length !== 25) {
  throw new Error(`Expected 25 raw questions, got ${RAW.length}`);
}

const questions = RAW.map((raw, idx) => {
  const number = idx + 1;
  if (!raw.options || raw.options.length !== 4) {
    throw new Error(`Q${number}: need exactly 4 options`);
  }

  const options = raw.options.map((o, i) => ({
    text: cleanText(o.text),
    isCorrect: i === 0,
    rationale: cleanText(o.rationale)
  }));

  const question = cleanText(raw.question);
  const hint = cleanText(raw.hint);

  const finalized = finalizeOptions(options, `${TOPIC_ID}-${number}`);

  const out = {
    number,
    question,
    options: finalized.options,
    hint,
    correctAnswer: finalized.correctAnswer
  };

  const blob = [
    out.question,
    out.hint,
    ...out.options.map((o) => `${o.text} ${o.rationale}`)
  ].join('\n');

  if (latexRe.test(blob) || /\$/.test(blob)) {
    throw new Error(`Q${number}: LaTeX/$ markup found`);
  }
  if (hedgeRe.test(blob)) {
    throw new Error(`Q${number}: meta/report voice still present: ${blob.match(hedgeRe)?.[0]}`);
  }

  const phrases = supportPhrases[number] || [];
  const missing = phrases.filter((p) => !reportLower.includes(p.toLowerCase()));
  if (missing.length) {
    throw new Error(`Q${number}: report does not support phrases: ${missing.join('; ')}`);
  }

  const correct = out.options.find((o) => o.isCorrect);
  const claim = `${correct.text} ${correct.rationale}`.toLowerCase();
  const claimTokens = (claim.match(/[a-z0-9%]{5,}/g) || []).filter(
    (t, i, a) => a.indexOf(t) === i
  );
  const hitRate =
    claimTokens.filter((t) => reportLower.includes(t)).length / Math.max(claimTokens.length, 1);
  if (hitRate < 0.28) {
    throw new Error(
      `Q${number}: correct claim poorly grounded in report (hitRate=${hitRate.toFixed(2)})`
    );
  }

  if (out.options.filter((o) => o.isCorrect).length !== 1) {
    throw new Error(`Q${number}: need exactly 1 correct`);
  }
  for (const o of out.options) {
    if (!o.rationale || o.rationale.length < 20) {
      throw new Error(`Q${number}${o.label}: short rationale`);
    }
    if (!o.text || o.text.length < 50) {
      throw new Error(`Q${number}${o.label}: option text too short (${o.text.length})`);
    }
  }

  return out;
});

function recountLetters(qs) {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of qs) counts[q.correctAnswer] = (counts[q.correctAnswer] || 0) + 1;
  return counts;
}

function rebalanceCorrectLetters(qs) {
  const order = ['A', 'B', 'C', 'D'];
  for (let pass = 0; pass < 40; pass++) {
    const counts = recountLetters(qs);
    const minL = order.reduce((a, b) => (counts[a] <= counts[b] ? a : b));
    const maxL = order.reduce((a, b) => (counts[a] >= counts[b] ? a : b));
    if (counts[minL] >= 4 && counts[maxL] <= 9) break;
    const donor = qs.find((q) => q.correctAnswer === maxL);
    if (!donor) break;
    const from = donor.options.find((o) => o.isCorrect);
    const to = donor.options.find((o) => o.label === minL);
    if (!from || !to || from === to) break;
    const tmp = { text: from.text, rationale: from.rationale };
    from.text = to.text;
    from.rationale = to.rationale;
    from.isCorrect = false;
    to.text = tmp.text;
    to.rationale = tmp.rationale;
    to.isCorrect = true;
    donor.correctAnswer = minL;
  }
  return recountLetters(qs);
}

const letterCounts = rebalanceCorrectLetters(questions);
const maxLetter = Math.max(...Object.values(letterCounts));
const minLetter = Math.min(...Object.values(letterCounts));
if (maxLetter >= 15 || minLetter < 2) {
  throw new Error(`Correct answers too skewed: ${JSON.stringify(letterCounts)}`);
}

if (!fs.existsSync(path.join(ROOT, TOPIC_IMAGE))) {
  throw new Error(`Missing topic image: ${TOPIC_IMAGE}`);
}

const DESC_SHORT =
  'Test your understanding of Underground Dismantling — Phase Three 3rd Realm Collapse that destroys DUMBS, trafficking pipelines, and Adrenochrome supply.';
const DESC_META =
  'Interactive Living Truth Quiz on Underground Dismantling: Phase Three Great Purge destruction of underground economies, DUMBS, and harvest supply chains under lockdown cover.';
const SUBTITLE =
  'Test your grasp of Underground Dismantling — Phase Three physical and financial collapse of subterranean networks, Adrenochrome pipelines, and the hollowed parasitic power structure.';

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle: SUBTITLE,
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Underground Dismantling is Phase Three: 3rd Realm Collapse — the physical and financial strike that obliterated DUMBS, trafficking pipelines, and Adrenochrome production after political shields and cultural programmers were cleared. Sit with what you missed, then return to the Underground Dismantling deep-dive, infographic, and video transmissions. With money and human lifeforce cut, the old structure is hollowed out; narrative maintenance holds sleepers until mass reveal while sterilization clears the path for Light Grid activation and restoration of the realm.'
  },
  relatedTopic: {
    href: `/deep-dive.html?source=${SOURCE}&topic=${TOPIC_ID}`,
    label: `Return to ${TOPIC_TITLE} deep-dive`
  },
  questions
};

const quizDir = path.join(ROOT, 'data', 'quizzes', SOURCE);
fs.mkdirSync(quizDir, { recursive: true });
const quizJsonPath = path.join(quizDir, `${TOPIC_ID}.json`);
fs.writeFileSync(quizJsonPath, JSON.stringify(quiz, null, 2) + '\n', 'utf8');

const quizMeta = {
  href: `quiz/${SOURCE}/${TOPIC_ID}.html`,
  title: TOPIC_TITLE,
  totalQuestions: 25,
  description: DESC_SHORT
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
      t.topic_image = TOPIC_IMAGE;
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error(`${TOPIC_ID} not found in breakdown-topics.json`);
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'infrastructure-sweep.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Infrastructure Sweep Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Infrastructure Sweep: Phase Two Great Purge neutralization of corporate CEOs, entertainment royalty, and cultural programmers under Whitehat optics.',
    DESC_META
  ],
  ['quiz/breakdown/infrastructure-sweep.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/infrastructure-sweep.webp', TOPIC_IMAGE],
  [
    'deep-dive.html?source=breakdown&amp;topic=infrastructure-sweep',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Infrastructure Sweep deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Infrastructure Sweep</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/infrastructure-sweep.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`
  ]
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
  const anchor =
    "  { path: '/quiz/breakdown/infrastructure-sweep.html', priority: '0.75', changefreq: 'monthly' },";
  if (sm.includes(anchor)) {
    sm = sm.replace(anchor, `${anchor}\n${entry}`);
  } else {
    const fallback =
      "  { path: '/quiz/breakdown/targeting-parasites.html', priority: '0.75', changefreq: 'monthly' },";
    if (!sm.includes(fallback)) {
      throw new Error('Could not find sitemap anchor to insert quiz entry');
    }
    sm = sm.replace(fallback, `${fallback}\n${entry}`);
  }
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

console.log('Correct-answer letter mix:', letterCounts);
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('PASS: audited 25/25 against data/breakdown-topics/underground-dismantling.json');
