/**
 * Installs Phase Seven - Eight quiz for breakdown (Mega Breakdown) transmission.
 * All 25 items authored from and audited against data/breakdown-topics/phase-seven-eight.json only.
 * Run: node scripts/install-phase-seven-eight-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/phase-seven-eight.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'phase-seven-eight';
const TOPIC_TITLE = 'Phase Seven - Eight';
const SOURCE = 'breakdown';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const metaVoiceRe =
  /\b(according to the (report|source|text)|the report states|the source (states|specifies|suggests)|the text (states|describes|suggests|explicitly|mentions)|source material)\b/i;

/** Support phrases grounded only in phase-seven-eight.json report. */
const supportPhrases = {
  1: ['phase seven', 'phase eight', 'great purge', 'culmination'],
  2: ['e.b.s.', 'emergency broadcast system', '3d illusion'],
  3: ['tribunals', 'stabilization', 'ascension'],
  4: ['controlled ignorance', 'planetary hijack', 'liberation'],
  5: ['top-down', 'parasitic control structure', 'mass public awakening'],
  6: ['phase seven', 'global media', 'internet', 'elite crimes'],
  7: ['phase eight', 'tribunals', 'arrests', 'executions'],
  8: ['72-plus hour', 'truth packages', '3d illusion'],
  9: ['sleepers', '3d parasitic overlay', 'premature panic'],
  10: ['whitehats', 'military forces', 'great purge'],
  11: ['mimic tech', 'clones', 'holographical projections'],
  12: ['truth tribunals', 'confessions', 'justice'],
  13: ['neutralized', 'royals', 'presidents', 'banking heads'],
  14: ['single blow', 'mainstream media', 'trafficking rings'],
  15: ['communications takeover', 'whitehat', 'narrative control'],
  16: ['soft truths', 'military protection', 'trauma'],
  17: ['election fraud', 'toxic vaccine', 'child trafficking', 'satanic'],
  18: ['draco', 'grey', 'parasitic forces'],
  19: ['seeded sols', 'princess diana', 'jfk jr.'],
  20: ['global tribunals', 'military truth tribunals'],
  21: ['confessions and executions', 'corporate giants', 'closure'],
  22: ['realm security', 'societal collapse', 'psychological fallout'],
  23: ['phase one', 'phase two', 'phase three'],
  24: ['phase four', 'phase five and six', 'project blue beam'],
  25: ['covert operations', 'overt liberation', 'crystalline world']
};

const RAW_QUESTIONS = [
  {
    number: 1,
    question: 'What do Phase Seven and Phase Eight represent in The Great Purge?',
    hint: 'Place them as culmination and physical resolution after earlier covert removals.',
    options: [
      {
        text: 'The culmination and physical resolution of The Great Purge, systematically dismantling the parasitic control structure of this realm.',
        isCorrect: true,
        rationale:
          'Phase Seven and Phase Eight represent the culmination and physical resolution of The Great Purge, systematically dismantling the parasitic control structure of this realm.'
      },
      {
        text: 'Only the first secret neutralization of a few local officials with no global purge culmination role.',
        isCorrect: false,
        rationale:
          'Early covert removals are prior phases; Seven and Eight are the culmination and physical resolution of the purge.'
      },
      {
        text: 'Only permanent Narrative Maintenance with Mimic Tech and no E.B.S. disclosure or tribunals.',
        isCorrect: false,
        rationale:
          'Mimic Tech docility is Phase Four; Seven and Eight are disclosure and stabilization, not endless maintenance.'
      },
      {
        text: 'Only a cancelled operation that never transitions the public from controlled ignorance to realization.',
        isCorrect: false,
        rationale:
          'Together these phases transition the public from controlled ignorance into full realization of hijack and liberation.'
      }
    ]
  },
  {
    number: 2,
    question: 'How does Phase Seven fracture the 3D illusion?',
    hint: 'Name the global system activated for definitive psychological fracture.',
    options: [
      {
        text: 'Through global activation of the E.B.S. (Emergency Broadcast System) that initiates the definitive psychological fracture of the 3D illusion.',
        isCorrect: true,
        rationale:
          'Phase Seven initiates the definitive psychological fracture of the 3D illusion through global activation of the E.B.S. (Emergency Broadcast System).'
      },
      {
        text: 'Only through quiet newspaper editorials with no Emergency Broadcast System activation at all.',
        isCorrect: false,
        rationale:
          'Phase Seven is defined by global E.B.S. activation, not quiet editorials alone.'
      },
      {
        text: 'Only by restoring mainstream media narrative control without any truth broadcast takeover.',
        isCorrect: false,
        rationale:
          'Phase Seven seizes media and internet to broadcast truth, severing previous narrative control.'
      },
      {
        text: 'Only by delaying all disclosure until after Ascension with no 3D-illusion fracture step.',
        isCorrect: false,
        rationale:
          'Phase Seven is the disclosure fracture stage before Phase Eight stabilization and Ascension prep.'
      }
    ]
  },
  {
    number: 3,
    question: 'What is Phase Eight’s primary role after the E.B.S. blow?',
    hint: 'Connect aftermath, tribunals, and securing the realm for Ascension.',
    options: [
      {
        text: 'Immediate aftermath and stabilization, executing justice through tribunals and permanently securing the realm for upcoming Ascension processes.',
        isCorrect: true,
        rationale:
          'Phase Eight is the immediate aftermath and stabilization period, executing justice through tribunals and permanently securing the realm for upcoming Ascension processes.'
      },
      {
        text: 'Only soft reassurance ads with no tribunals, arrests, or realm security function.',
        isCorrect: false,
        rationale:
          'Phase Eight includes tribunals, arrests, executions, and realm security—not soft ads alone.'
      },
      {
        text: 'Only restarting Phase One covert removals as if disclosure never happened publicly.',
        isCorrect: false,
        rationale:
          'Phase Eight is aftermath stabilization after public disclosure, not a restart of Phase One secrecy.'
      },
      {
        text: 'Only permanent Mimic Tech continuity so neutralized elites appear forever without justice.',
        isCorrect: false,
        rationale:
          'Phase Eight publicly confirms arrests, confessions, and executions rather than endless Mimic continuity.'
      }
    ]
  },
  {
    number: 4,
    question: 'What transition do these final phases create for the public?',
    hint: 'Move from controlled ignorance to undeniable realization of hijack and liberation.',
    options: [
      {
        text: 'From controlled ignorance into full, undeniable realization of the planetary hijack and its subsequent liberation.',
        isCorrect: true,
        rationale:
          'These final phases transition the public from controlled ignorance into full, undeniable realization of the planetary hijack and its subsequent liberation.'
      },
      {
        text: 'From full liberation back into deeper controlled ignorance with no hijack realization allowed.',
        isCorrect: false,
        rationale:
          'The direction is out of controlled ignorance into realization of hijack and liberation.'
      },
      {
        text: 'From Trigger Events scare alone into permanent war with no truth packages or tribunals.',
        isCorrect: false,
        rationale:
          'Trigger Events prepare Sleepers; Seven and Eight deliver truth packages and justice stabilization.'
      },
      {
        text: 'From Ascension completion backward into underground trafficking reconstruction.',
        isCorrect: false,
        rationale:
          'Phase Three dismantled underground networks earlier; final phases secure liberation and Ascension prep.'
      }
    ]
  },
  {
    number: 5,
    question: 'How is The Great Purge defined across the full sequence?',
    hint: 'Describe top-down removal from leaders through infrastructure to mass awakening.',
    options: [
      {
        text: 'Systematic, top-down removal of the parasitic control structure, beginning with global leaders and moving through infrastructure, culminating in mass public awakening.',
        isCorrect: true,
        rationale:
          'The Great Purge is the systematic, top-down removal of the parasitic control structure, beginning with global leaders and moving through infrastructure, culminating in mass public awakening.'
      },
      {
        text: 'Only a bottom-up street protest with no top-down leader removal or infrastructure sweep.',
        isCorrect: false,
        rationale:
          'The purge is top-down from leaders through infrastructure, not only bottom-up protest.'
      },
      {
        text: 'Only a single media interview with no multi-phase dismantling of parasitic control.',
        isCorrect: false,
        rationale:
          'It is a multi-tiered operation culminating in mass public awakening through phased removal.'
      },
      {
        text: 'Only permanent protection of banking heads and media moguls with no neutralization stages.',
        isCorrect: false,
        rationale:
          'Dangerous entities including banking heads and media moguls were neutralized in covert stages before Seven and Eight.'
      }
    ]
  },
  {
    number: 6,
    question: 'What defines Phase Seven as the disclosure stage?',
    hint: 'Focus on seizure of media and internet to broadcast proof of elite crimes.',
    options: [
      {
        text: 'Benevolent forces seize total control of global media and internet to broadcast undeniable proof of elite crimes.',
        isCorrect: true,
        rationale:
          'Phase Seven is the disclosure stage where benevolent forces seize total control of global media and internet to broadcast undeniable proof of elite crimes.'
      },
      {
        text: 'Benevolent forces permanently restore corporate media ownership with no elite-crime broadcasts.',
        isCorrect: false,
        rationale:
          'Phase Seven seizes media to expose elite crimes, not restore corporate narrative ownership.'
      },
      {
        text: 'Only private courtroom notes with no global media and internet takeover in the public eye.',
        isCorrect: false,
        rationale:
          'Communications takeover is complete and public; broadcasts run as continuous truth packages.'
      },
      {
        text: 'Only Mimic Tech replacements with no seizure of narrative channels for disclosure.',
        isCorrect: false,
        rationale:
          'Mimic Tech is Phase Four continuity; Phase Seven is public E.B.S. disclosure seizure.'
      }
    ]
  },
  {
    number: 7,
    question: 'What does Phase Eight involve as aftermath and stabilization?',
    hint: 'List tribunals, arrests, executions, and reconstruction prep.',
    options: [
      {
        text: 'Public and private tribunals, arrests, and executions of neutralized parasites to prepare the realm for reconstruction.',
        isCorrect: true,
        rationale:
          'Phase Eight is the aftermath and stabilization period involving public and private tribunals, arrests, and executions of neutralized parasites to prepare the realm for reconstruction.'
      },
      {
        text: 'Only soft truths with no arrests, executions, or reconstruction preparation of any kind.',
        isCorrect: false,
        rationale:
          'Soft truths begin Phase Seven broadcasts; Phase Eight executes tribunals, arrests, and executions.'
      },
      {
        text: 'Only restoring all neutralized parasites to power without any tribunal justice process.',
        isCorrect: false,
        rationale:
          'Phase Eight executes justice upon neutralized parasites rather than restoring them to power.'
      },
      {
        text: 'Only Project Blue Beam sky shows with no realm reconstruction preparation function.',
        isCorrect: false,
        rationale:
          'Blue Beam is a Phase Five/Six scare tool; Phase Eight prepares reconstruction after justice.'
      }
    ]
  },
  {
    number: 8,
    question: 'What is the E.B.S. (Emergency Broadcast System) in this sequence?',
    hint: 'Recall continuous multi-day truth packages that dismantle the 3D illusion.',
    options: [
      {
        text: 'A continuous 72-plus hour global broadcast of truth packages designed to dismantle the 3D illusion and expose the parasite system.',
        isCorrect: true,
        rationale:
          'E.B.S. is a continuous 72-plus hour global broadcast of truth packages designed to dismantle the 3D illusion and expose the parasite system.'
      },
      {
        text: 'A five-minute local weather loop with no truth packages or parasite-system exposure.',
        isCorrect: false,
        rationale:
          'It is a continuous 72-plus hour global truth-package broadcast, not a brief weather loop.'
      },
      {
        text: 'Only a corporate ad network that strengthens the 3D illusion without exposing parasites.',
        isCorrect: false,
        rationale:
          'E.B.S. dismantles the 3D illusion and exposes the parasite system under Whitehat control.'
      },
      {
        text: 'Only a post-Ascension entertainment channel with no role in Phase Seven disclosure.',
        isCorrect: false,
        rationale:
          'E.B.S. is the Phase Seven disclosure mechanism before Ascension processes in the secured realm.'
      }
    ]
  },
  {
    number: 9,
    question: 'Who are the Sleepers in this framework?',
    hint: 'Identify unawakened populations and why earlier phases shielded them from panic.',
    options: [
      {
        text: 'Unawakened human populations trapped in the 3D parasitic overlay, shielded from premature panic by artificial constructs until the final phases.',
        isCorrect: true,
        rationale:
          'Sleepers are unawakened human populations trapped in the 3D parasitic overlay, shielded from premature panic by artificial constructs until the final phases.'
      },
      {
        text: 'Whitehat galactic commanders already outside the 3D overlay and immune to all panic dynamics.',
        isCorrect: false,
        rationale:
          'Whitehats orchestrate the purge; Sleepers are the unawakened population inside the overlay.'
      },
      {
        text: 'Only Mimic Tech clones with no human population still trapped in parasitic overlay perception.',
        isCorrect: false,
        rationale:
          'Sleepers are unawakened humans; Mimic Tech replaces neutralized elites to maintain continuity optics.'
      },
      {
        text: 'Only Seeded Sols who never needed shielding from premature panic during earlier phases.',
        isCorrect: false,
        rationale:
          'Seeded Sols fracture the system from inside bloodlines; Sleepers are the unawakened masses.'
      }
    ]
  },
  {
    number: 10,
    question: 'Who are the Whitehats in The Great Purge?',
    hint: 'Name Earth-based and galactic military forces running the awakening narrative.',
    options: [
      {
        text: 'Benevolent Earth-based and galactic military forces orchestrating The Great Purge and controlling the awakening narrative.',
        isCorrect: true,
        rationale:
          'Whitehats are the benevolent Earth-based and galactic military forces orchestrating The Great Purge and controlling the awakening narrative.'
      },
      {
        text: 'Only corporate media moguls still running parasitic narrative control without military Whitehat seizure.',
        isCorrect: false,
        rationale:
          'Media moguls were among neutralized dangerous entities; Whitehats seize channels for truth.'
      },
      {
        text: 'Only Draco and Grey handlers directing world leaders without any benevolent purge role.',
        isCorrect: false,
        rationale:
          'Draco and Grey forces influenced leaders as parasites; Whitehats dismantle that control structure.'
      },
      {
        text: 'Only Sleepers voting online with no military or galactic orchestration of the purge.',
        isCorrect: false,
        rationale:
          'Whitehats are military forces orchestrating the purge, not sleeper online voting alone.'
      }
    ]
  },
  {
    number: 11,
    question: 'What is Mimic Tech used for in the broader purge sequence?',
    hint: 'List clones, composites, stand-ins, and holograms for continuity after neutralization.',
    options: [
      {
        text: 'Advanced biological clones, AI-driven digital composites, stand-in actors, and holographical projections used to replace neutralized elites and maintain the illusion of continuity.',
        isCorrect: true,
        rationale:
          'Mimic Tech includes biological clones, AI-driven digital composites, stand-in actors, and holographical projections used to replace neutralized elites and maintain the illusion of continuity.'
      },
      {
        text: 'Only E.B.S. camera hardware with no role replacing neutralized elites for continuity optics.',
        isCorrect: false,
        rationale:
          'Mimic Tech replaces neutralized elites to maintain continuity; E.B.S. is the later disclosure broadcast.'
      },
      {
        text: 'Only Truth Tribunal microphones used after Phase Eight with no Phase Four docility function.',
        isCorrect: false,
        rationale:
          'Phase Four used Mimic Tech to keep masses docile before scare events and E.B.S. disclosure.'
      },
      {
        text: 'Only free-energy devices that never appear as clones, composites, or holographical stand-ins.',
        isCorrect: false,
        rationale:
          'Mimic Tech is explicitly replacement optics: clones, composites, actors, and holograms.'
      }
    ]
  },
  {
    number: 12,
    question: 'What are Truth Tribunals during Phase Eight?',
    hint: 'Describe public and covert proceedings for confessions and justice.',
    options: [
      {
        text: 'Public and covert legal proceedings held during Phase Eight to extract confessions and execute justice upon the world’s most dangerous operatives.',
        isCorrect: true,
        rationale:
          'Truth Tribunals are public and covert legal proceedings held during Phase Eight to extract confessions and execute justice upon the world’s most dangerous operatives.'
      },
      {
        text: 'Only Phase Four award ceremonies with no confessions, justice, or dangerous-operative reckoning.',
        isCorrect: false,
        rationale:
          'Tribunals are Phase Eight justice proceedings, not Phase Four continuity ceremonies.'
      },
      {
        text: 'Only corporate shareholder meetings that protect banking heads from any public reckoning.',
        isCorrect: false,
        rationale:
          'Tribunals extract confessions and execute justice on dangerous operatives, including old-matrix power figures.'
      },
      {
        text: 'Only soft-truth safety messages with no legal proceedings or justice execution component.',
        isCorrect: false,
        rationale:
          'Soft truths start E.B.S. reassurance; tribunals are hard justice mechanics of Phase Eight.'
      }
    ]
  },
  {
    number: 13,
    question: 'What is already true of the most dangerous world controllers before Phase Seven?',
    hint: 'Connect covert neutralization of royals, presidents, banking heads, and media moguls.',
    options: [
      {
        text: 'They were already neutralized during covert Great Purge stages, while leadership normalcy remained a controlled theatrical production.',
        isCorrect: true,
        rationale:
          'The most dangerous entities—royals, presidents, banking heads, and media moguls—were already neutralized during covert stages; current leadership perception is controlled theatrical production.'
      },
      {
        text: 'They still personally command every nation without any prior covert neutralization having occurred.',
        isCorrect: false,
        rationale:
          'Covert neutralization already happened; Phase Seven exposes crimes while Phase Eight confirms consequences.'
      },
      {
        text: 'They only appear after E.B.S. as brand-new leaders with no pre-Seven neutralization history.',
        isCorrect: false,
        rationale:
          'Neutralization precedes Phase Seven; Mimic Tech maintained continuity until public disclosure.'
      },
      {
        text: 'They were never replaced by Mimic Tech and never removed in any purge phase.',
        isCorrect: false,
        rationale:
          'Mimic Tech replaced neutralized elites so continuity optics held until the disclosure blow.'
      }
    ]
  },
  {
    number: 14,
    question: 'What is Phase Seven’s master-stroke purpose against false reality?',
    hint: 'Shatter in a single blow by overriding mainstream media with corruption proof.',
    options: [
      {
        text: 'To shatter false reality in a single blow by overriding mainstream media and exposing global corruption, trafficking rings, and occult control.',
        isCorrect: true,
        rationale:
          'Phase Seven is the master stroke to shatter false reality in a single blow, overriding mainstream media to expose global corruption, trafficking rings, and occult control.'
      },
      {
        text: 'To gently reinforce mainstream media so trafficking rings and occult control remain permanently hidden.',
        isCorrect: false,
        rationale:
          'Phase Seven overrides mainstream media to expose those crimes, not reinforce concealment.'
      },
      {
        text: 'To delay all exposure until after reconstruction with no single-blow psychological fracture.',
        isCorrect: false,
        rationale:
          'Phase Seven is the single-blow disclosure fracture; Phase Eight then anchors and stabilizes.'
      },
      {
        text: 'To cancel E.B.S. entirely and return Sleepers to Mimic Tech normalcy forever.',
        isCorrect: false,
        rationale:
          'Phase Seven activates E.B.S. disclosure; Phase Eight confirms justice rather than endless Mimic normalcy.'
      }
    ]
  },
  {
    number: 15,
    question: 'What happens in Total Communications Takeover during Phase Seven?',
    hint: 'Name who seizes media and internet and what happens to prior narrative control.',
    options: [
      {
        text: 'Media and internet are completely seized by Whitehat forces in the public eye, and all previous narrative control is severed.',
        isCorrect: true,
        rationale:
          'In Total Communications Takeover, media and internet are completely seized by Whitehat forces in the public eye and all previous narrative control is severed.'
      },
      {
        text: 'Media and internet remain fully owned by parasitic moguls with no Whitehat seizure at all.',
        isCorrect: false,
        rationale:
          'Whitehats completely seize media and internet and sever previous narrative control.'
      },
      {
        text: 'Only radio weather bands are paused while all internet narrative control continues unchanged.',
        isCorrect: false,
        rationale:
          'Takeover is total for media and internet, not a partial weather-band pause.'
      },
      {
        text: 'Only Phase Eight tribunals touch communications with no public Phase Seven channel seizure.',
        isCorrect: false,
        rationale:
          'Communications takeover is a core Phase Seven E.B.S. action before Phase Eight tribunals.'
      }
    ]
  },
  {
    number: 16,
    question: 'How do the 72-Hour Truth Packages begin, and why?',
    hint: 'Start with soft truths and military-protection reassurance to prevent trauma collapse.',
    options: [
      {
        text: 'With first-stage soft truths that reassure the public they are safe under military protection, preventing collapse into total trauma.',
        isCorrect: true,
        rationale:
          'Broadcasts initiate with first-stage soft truths for immediate reassurance that the public is safe under military protection, preventing collapse into total trauma.'
      },
      {
        text: 'With immediate maximum trauma only, with no soft truths or military-protection reassurance at all.',
        isCorrect: false,
        rationale:
          'Soft truths and safety reassurance come first specifically to prevent total trauma collapse.'
      },
      {
        text: 'With permanent silence so no truth packages ever begin after communications takeover.',
        isCorrect: false,
        rationale:
          'After takeover, continuous 72-plus hour truth packages begin with staged soft-to-hard escalation.'
      },
      {
        text: 'With only entertainment loops that never mention safety, military protection, or hard truths later.',
        isCorrect: false,
        rationale:
          'Packages are truth disclosures escalating from soft reassurance to hard crime evidence.'
      }
    ]
  },
  {
    number: 17,
    question: 'What hard truths does the E.B.S. systematically escalate into?',
    hint: 'List election fraud, vaccines, trafficking, and cult ritual evidence themes.',
    options: [
      {
        text: 'Undeniable proof of election fraud, toxic vaccine deployments, human and child trafficking networks, and satanic cult rituals.',
        isCorrect: true,
        rationale:
          'Broadcasts escalate to undeniable proof of election fraud, toxic vaccine deployments, human and child trafficking networks, and satanic cult rituals.'
      },
      {
        text: 'Only sports scores and weather with no election, vaccine, trafficking, or cult exposure content.',
        isCorrect: false,
        rationale:
          'Hard truths specifically include election fraud, toxic vaccines, trafficking, and satanic cult rituals.'
      },
      {
        text: 'Only praise for banking heads and media moguls with no crime evidence packages at all.',
        isCorrect: false,
        rationale:
          'E.B.S. exposes elite crimes; banking heads and media moguls were among neutralized dangerous entities.'
      },
      {
        text: 'Only Project Blue Beam fiction treated as the final permanent destination of Ascension.',
        isCorrect: false,
        rationale:
          'Blue Beam is an earlier scare narrative; E.B.S. hard truths expose real elite crime systems.'
      }
    ]
  },
  {
    number: 18,
    question: 'What bloodline and parasite exposure does the E.B.S. provide?',
    hint: 'Connect world leaders to Draco and Grey parasitic influence rather than independent rule.',
    options: [
      {
        text: 'Definitive evidence that world leaders were not operating independently, but under direct influence of Draco and Grey parasitic forces.',
        isCorrect: true,
        rationale:
          'E.B.S. provides definitive evidence that world leaders were not operating independently, but under direct influence of Draco and Grey parasitic forces.'
      },
      {
        text: 'Evidence that world leaders always operated fully independently with no Draco or Grey influence.',
        isCorrect: false,
        rationale:
          'Exposure shows leaders were under Draco and Grey parasitic influence, not independent operation.'
      },
      {
        text: 'Evidence that only Sleepers controlled global policy with no parasitic bloodline influence narrative.',
        isCorrect: false,
        rationale:
          'The exposure targets elite leadership under parasitic Draco and Grey influence.'
      },
      {
        text: 'Evidence that Whitehats never existed and no military seizure of media ever occurred.',
        isCorrect: false,
        rationale:
          'Whitehats seize media for E.B.S.; parasite exposure is part of that disclosure content.'
      }
    ]
  },
  {
    number: 19,
    question: 'What does the revelation of Seeded Sols disclose about certain historical figures?',
    hint: 'Name examples like Princess Diana and JFK Jr. and their inside-fracture role.',
    options: [
      {
        text: 'That key historical figures such as Princess Diana, JFK Jr., and others were benevolent Seeded Sols inserted into bloodlines to fracture the system from the inside out.',
        isCorrect: true,
        rationale:
          'Broadcasts reveal that key historical figures such as Princess Diana, JFK Jr., and others were benevolent Seeded Sols inserted into the bloodlines to fracture the system from the inside out.'
      },
      {
        text: 'That Princess Diana, JFK Jr., and similar figures were only Mimic Tech props with no Seeded Sol mission.',
        isCorrect: false,
        rationale:
          'They are revealed as benevolent Seeded Sols inserted into bloodlines to fracture the system internally.'
      },
      {
        text: 'That no historical figures were ever inserted into bloodlines for any system-fracture purpose.',
        isCorrect: false,
        rationale:
          'E.B.S. specifically reveals Seeded Sols inserted into bloodlines for inside fracture of the system.'
      },
      {
        text: 'That Seeded Sols only appear after Phase Eight tribunals and never during E.B.S. broadcasts.',
        isCorrect: false,
        rationale:
          'Seeded Sol revelation is part of Phase Seven E.B.S. broadcast content alongside hard truths.'
      }
    ]
  },
  {
    number: 20,
    question: 'How is justice executed in Phase Eight Global Tribunals?',
    hint: 'Public and behind-the-scenes military Truth Tribunals.',
    options: [
      {
        text: 'Both publicly and behind the scenes through military Truth Tribunals.',
        isCorrect: true,
        rationale:
          'In Phase Eight, justice is executed both publicly and behind the scenes through military Truth Tribunals.'
      },
      {
        text: 'Only as private corporate arbitration with no military Truth Tribunals of any kind.',
        isCorrect: false,
        rationale:
          'Justice runs through military Truth Tribunals, publicly and behind the scenes.'
      },
      {
        text: 'Only as Phase Four Mimic Tech ceremonies with no real justice process after disclosure.',
        isCorrect: false,
        rationale:
          'Phase Eight tribunals are real justice after disclosure, not Mimic Tech continuity theater.'
      },
      {
        text: 'Only as cancelled plans so no confessions or justice ever follow the E.B.S. blow.',
        isCorrect: false,
        rationale:
          'Phase Eight immediately anchors new reality with tribunals, arrests, confessions, and executions.'
      }
    ]
  },
  {
    number: 21,
    question: 'What do the world witness in Arrests and Executions during Phase Eight?',
    hint: 'Final consequences for corporate, military, and political parasite network maintainers.',
    options: [
      {
        text: 'Final physical consequences for corporate giants, military brass, and political leaders who maintained the Parasite network, with confessions and executions broadcast for collective closure.',
        isCorrect: true,
        rationale:
          'The world witnesses final physical consequences for corporate giants, military brass, and political leaders who maintained the Parasite network; confessions and executions are broadcast to provide closure to collective consciousness.'
      },
      {
        text: 'Permanent promotions for those leaders with no confessions, executions, or collective closure process.',
        isCorrect: false,
        rationale:
          'Phase Eight shows consequences including confessions and executions for collective closure.'
      },
      {
        text: 'Only soft-truth safety messages with no arrests of corporate, military, or political parasite maintainers.',
        isCorrect: false,
        rationale:
          'Soft truths begin E.B.S.; Phase Eight arrests and executions target parasite-network maintainers.'
      },
      {
        text: 'Only Mimic Tech replacements continuing forever without any public justice broadcast.',
        isCorrect: false,
        rationale:
          'Phase Eight publicly confirms arrests, confessions, and executions of old-matrix power figures.'
      }
    ]
  },
  {
    number: 22,
    question: 'What does Realm Security accomplish in Phase Eight?',
    hint: 'Military lockdown managing psychological fallout while old infrastructure is dismantled.',
    options: [
      {
        text: 'Military forces lock down the realm to prevent societal collapse, carefully managing psychological fallout as old infrastructure is entirely dismantled.',
        isCorrect: true,
        rationale:
          'Military forces lock down the realm to prevent societal collapse, carefully managing psychological fallout as the old infrastructure is entirely dismantled.'
      },
      {
        text: 'Military forces abandon all streets so societal collapse becomes the intended permanent outcome.',
        isCorrect: false,
        rationale:
          'Realm security prevents societal collapse through military lockdown and fallout management.'
      },
      {
        text: 'Military forces only restore parasitic media ownership with no infrastructure dismantling management.',
        isCorrect: false,
        rationale:
          'Old infrastructure is dismantled under managed lockdown, not restored to parasitic media control.'
      },
      {
        text: 'Military forces only run Phase Four awards with no psychological fallout management role.',
        isCorrect: false,
        rationale:
          'Phase Eight realm security manages psychological fallout during dismantling after disclosure.'
      }
    ]
  },
  {
    number: 23,
    question: 'What earlier purge stages must precede Phase Seven and Eight?',
    hint: 'Recall Phase One leaders, Phase Two infrastructure/cultural sweep, Phase Three underground networks.',
    options: [
      {
        text: 'Phase One top-of-pyramid removal, Phase Two infrastructure sweep of corporate and cultural influencers, and Phase Three dismantling of underground trafficking networks.',
        isCorrect: true,
        rationale:
          'The Great Purge began at the top of the pyramid (Phase One), then infrastructure sweep removing corporate and cultural influencers (Phase Two), and dismantling underground trafficking networks (Phase Three).'
      },
      {
        text: 'Only Phase Eight tribunals first, with no prior covert leader, infrastructure, or underground work.',
        isCorrect: false,
        rationale:
          'Seven and Eight cannot exist without precise prior execution of Phases One through Three (and Four through Six).'
      },
      {
        text: 'Only Ascension completion first, with no need to hollow out enemy operational capacity beforehand.',
        isCorrect: false,
        rationale:
          'Earlier phases hollow out enemy capacity so Seven and Eight can demolish remaining psychological hold.'
      },
      {
        text: 'Only random uncoordinated events with no pyramid, infrastructure, or underground sequencing.',
        isCorrect: false,
        rationale:
          'The sequence is systematic: pyramid top, infrastructure/cultural sweep, then underground trafficking dismantling.'
      }
    ]
  },
  {
    number: 24,
    question: 'How do Phases Four through Six prepare Sleepers for E.B.S. without total terror?',
    hint: 'Mimic Tech docility, then Trigger Events including fake WW3 and Project Blue Beam.',
    options: [
      {
        text: 'Phase Four uses Mimic Tech for docility; Phases Five and Six stage Trigger Events including fake WW3 escalation and Project Blue Beam alien invasion narrative to push Sleepers to the edge of questioning.',
        isCorrect: true,
        rationale:
          'Phase Four used Mimic Tech to keep masses docile; Phases Five and Six introduced staged Trigger Events including fake WW3 and Project Blue Beam alien invasion narrative to push Sleepers to the edge of questioning without uncontrolled terror if E.B.S. came too early.'
      },
      {
        text: 'Phases Four through Six permanently cancel all E.B.S. plans so Sleepers never face truth packages.',
        isCorrect: false,
        rationale:
          'Those phases prepare Sleepers so E.B.S. can land without ignore-or-terror extremes.'
      },
      {
        text: 'Phases Four through Six only run Truth Tribunals with no Mimic Tech or Trigger Event staging.',
        isCorrect: false,
        rationale:
          'Tribunals are Phase Eight; Four–Six are Mimic continuity and staged scare/questioning events.'
      },
      {
        text: 'Phases Four through Six only reveal Seeded Sols with no scare events or docility management.',
        isCorrect: false,
        rationale:
          'Seeded Sols are E.B.S. content; Four–Six manage docility and staged questioning pressure first.'
      }
    ]
  },
  {
    number: 25,
    question: 'What strategic transition do Phase Seven and Eight complete for the realm?',
    hint: 'From covert operations to overt liberation, stabilized and prepared for crystalline reconstruction.',
    options: [
      {
        text: 'Transition from covert operations to overt liberation, ensuring the realm is fully stabilized, parasite-free, and energetically prepared for physical and dimensional reconstruction of the true crystalline world.',
        isCorrect: true,
        rationale:
          'Phase Seven and Eight represent transition from covert operations to overt liberation, ensuring the realm is fully stabilized, parasite-free, and energetically prepared for physical and dimensional reconstruction of the true crystalline world.'
      },
      {
        text: 'Transition back into permanent covert Mimic normalcy with no overt liberation or crystalline reconstruction prep.',
        isCorrect: false,
        rationale:
          'The move is from covert to overt liberation and crystalline-world reconstruction readiness.'
      },
      {
        text: 'Transition only into endless Trigger Events with no stabilization or parasite-free securing of the realm.',
        isCorrect: false,
        rationale:
          'Trigger Events prepare the path; Seven and Eight stabilize and secure a parasite-free realm.'
      },
      {
        text: 'Transition only into thicker 3D illusion with no justice, tribunals, or Ascension preparation.',
        isCorrect: false,
        rationale:
          'These phases shatter illusion, execute justice, and prepare the realm for Ascension and crystalline reconstruction.'
      }
    ]
  }
];

for (const [num, phrases] of Object.entries(supportPhrases)) {
  const missing = phrases.filter((p) => !reportLower.includes(p.toLowerCase()));
  if (missing.length) {
    throw new Error(`Support phrase missing for Q${num}: ${missing.join('; ')}`);
  }
}

if (RAW_QUESTIONS.length !== 25) {
  throw new Error(`Expected 25 raw questions, got ${RAW_QUESTIONS.length}`);
}

const questions = RAW_QUESTIONS.map((q) => {
  const finalized = finalizeOptions(
    q.options.map(({ text, isCorrect, rationale }) => ({ text, isCorrect, rationale })),
    `${TOPIC_ID}-${q.number}`
  );

  const out = {
    number: q.number,
    question: q.question,
    options: finalized.options,
    hint: q.hint,
    correctAnswer: finalized.correctAnswer
  };

  const blob = [
    out.question,
    out.hint,
    ...out.options.map((o) => `${o.text} ${o.rationale}`)
  ].join('\n');
  if (latexRe.test(blob) || /\$/.test(blob)) {
    throw new Error(`Q${q.number}: LaTeX/$ markup found`);
  }
  if (metaVoiceRe.test(blob)) {
    throw new Error(`Q${q.number}: meta/report voice still present`);
  }

  const phrases = supportPhrases[q.number] || [];
  const missing = phrases.filter((p) => !reportLower.includes(p.toLowerCase()));
  if (missing.length) {
    throw new Error(`Q${q.number}: report does not support: ${missing.join('; ')}`);
  }

  if (out.options.length !== 4) throw new Error(`Q${q.number}: need 4 options`);
  if (out.options.filter((o) => o.isCorrect).length !== 1) {
    throw new Error(`Q${q.number}: need exactly 1 correct`);
  }
  for (const o of out.options) {
    if (!o.rationale || o.rationale.length < 20) {
      throw new Error(`Q${q.number}${o.label}: short rationale`);
    }
    if (o.text.length < 40) {
      throw new Error(`Q${q.number}${o.label}: option too short (${o.text.length})`);
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

const topicImage = 'images/breakdown/phase-seven-eight.webp';
if (!fs.existsSync(path.join(ROOT, topicImage))) {
  throw new Error(`Missing topic image: ${topicImage}`);
}

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle:
    'Test your grasp of Phase Seven - Eight — E.B.S. truth packages, Whitehat media takeover, Truth Tribunals, and overt liberation of the realm.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Phase Seven - Eight is the culmination of The Great Purge: E.B.S. shatters the 3D illusion, then tribunals and realm security stabilize the aftermath. Sit with what you missed, then return to the Phase Seven - Eight deep-dive, infographics, and video transmissions. Covert neutralization becomes overt liberation—and the realm is secured for crystalline reconstruction and Ascension.'
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
  description:
    'Test your understanding of Phase Seven - Eight — E.B.S. disclosure, Whitehat communications takeover, Truth Tribunals, and stabilization for Ascension.'
};
topic.quiz = quizMeta;
fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2) + '\n', 'utf8');

const monoPath = path.join(ROOT, 'data', 'breakdown-topics.json');
const mono = JSON.parse(fs.readFileSync(monoPath, 'utf8'));
function findAndPatch(topics) {
  for (const t of topics) {
    if (t.id === TOPIC_ID) {
      const existingSubtopics = t.subtopics;
      t.quiz = quizMeta;
      if (topic.report) t.report = topic.report;
      if (topic.infographic_image) t.infographic_image = topic.infographic_image;
      if (topic.pdf_preview_image) t.pdf_preview_image = topic.pdf_preview_image;
      if (topic.slide_deck_pdf_url) t.slide_deck_pdf_url = topic.slide_deck_pdf_url;
      if (topic.rumble_videos) t.rumble_videos = topic.rumble_videos;
      t.is_placeholder = false;
      t.topic_image = topicImage;
      t.title = TOPIC_TITLE;
      if (existingSubtopics) t.subtopics = existingSubtopics;
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('phase-seven-eight not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on Phase Seven - Eight: E.B.S. truth packages, Whitehat media takeover, Truth Tribunals, and overt liberation of the realm.'
  ],
  ['quiz/breakdown/hard-drive-framework.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/hard-drive-framework.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=hard-drive-framework',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`
  ],
  ['Hard Drive Framework deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Hard Drive Framework</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/hard-drive-framework.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`
  ]
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 80));
  }
  html = html.split(a).join(b);
}

const htmlPath = path.join(ROOT, 'quiz', SOURCE, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchors = [
    "  { path: '/quiz/breakdown/reality-constructs.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/breakdown/the-purge-phases.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/breakdown/lockdown-window.html', priority: '0.75', changefreq: 'monthly' },"
  ];
  let inserted = false;
  for (const anchor of anchors) {
    if (sm.includes(anchor)) {
      sm = sm.replace(anchor, `${anchor}\n${entry}`);
      inserted = true;
      break;
    }
  }
  if (!inserted) throw new Error('Could not find sitemap anchor to insert quiz entry');
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

const patched = JSON.parse(fs.readFileSync(monoPath, 'utf8'));
function findNode(topics, id) {
  for (const t of topics) {
    if (t.id === id) return t;
    if (t.subtopics) {
      const f = findNode(t.subtopics, id);
      if (f) return f;
    }
  }
  return null;
}
const node = findNode(patched.topics, TOPIC_ID);
const subIds = (node.subtopics || []).map((s) => s.id);
if (!subIds.includes('truth-disclosure') || !subIds.includes('stabilization-process')) {
  throw new Error(`Subtopics not preserved: ${subIds.join(', ')}`);
}

console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('Subtopics preserved:', subIds.join(', '));
console.log('Correct letter mix:', letterCounts);
console.log('PASS: audited 25/25 against data/breakdown-topics/phase-seven-eight.json');
