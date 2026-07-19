/**
 * Installs Phases Four - Six quiz for Mega Breakdown (breakdown) transmission.
 * All 25 items authored from data/breakdown-topics/phase-four-six.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run:
 *   node scripts/install-phase-four-six-quiz.js
 *   node scripts/rebalance-quiz-length.js data/quizzes/breakdown/phase-four-six.json
 *   node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'phase-four-six';
const TOPIC_TITLE = 'Phases Four - Six';
const SOURCE = 'breakdown';
const TOPIC_IMAGE = 'images/breakdown/phases-four-six.webp';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

/** Support phrases grounded only in phase-four-six.json report. */
const supportPhrases = {
  1: ['operational bridge', 'phases one through three', 'phases seven and eight'],
  2: ['psychological management', 'controlled demolition', 'false reality'],
  3: ['oblivious slumber', 'acute questioning', 'locked-down'],
  4: ['great purge', 'parasitic control', 'societal collapse'],
  5: ['sleepers', '3d illusion', 'mass reveal'],
  6: ['stand-ins', 'clones', 'holographic projections'],
  7: ['trigger events', 'geopolitical tensions', 'logistical disruptions'],
  8: ['lockdown window', 'military presence', 'communication restriction'],
  9: ['whitehats', 'military', 'multi-dimensional'],
  10: ['e.b.s.', 'emergency broadcast', 'media networks'],
  11: ['narrative maintenance', 'fabricated theater', 'world leaders'],
  12: ['air raid sirens', 'supply chain', 'orchestrated'],
  13: ['phase four', 'narrative maintenance', 'business'],
  14: ['fake meetings', 'speeches', 'public ceremonies'],
  15: ['manageable', 'docile', 'mass reveal'],
  16: ['phase five', 'trigger events', 'public consciousness'],
  17: ['air raid sirens', 'supply disruptions', 'full panic'],
  18: ['phase six', 'lockdown window', 'military forces'],
  19: ['internet restrictions', 'mainstream media', 'e.b.s.'],
  20: ['phase one', 'vatican', 'banking heads'],
  21: ['phase two', 'corporate ceos', 'cultural influencers'],
  22: ['phase three', '3rd realm collapse', 'underground tunnels'],
  23: ['theatrical', 'psychological bridge', 'societal collapse'],
  24: ['election fraud', 'satanic cults', 'truth tribunals'],
  25: ['npc programming', 'frequency fracture', 'resonating sols']
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
    question: 'What role do Phases Four through Six play in the Great Purge sequence?',
    hint: 'They sit between covert dismantling and overt revelation.',
    options: [
      {
        text: 'They form the crucial operational bridge between covert dismantling of parasitic power (Phases One through Three) and overt revelation of the truth (Phases Seven and Eight).',
        rationale:
          'Phases Four through Six bridge the hidden neutralization work of Phases One through Three and the public truth phases that follow in Seven and Eight.'
      },
      {
        text: 'They replace Phases One through Three entirely by reopening underground economies and restoring full elite power before any public work begins.',
        rationale:
          'These phases follow after elites and underground economies are already neutralized; they do not reopen that power structure.'
      },
      {
        text: 'They skip straight to Phase Eight tribunals and executions with no psychological management or lockdown preparation for the population.',
        rationale:
          'Phases Four through Six manage psychology and lockdown first; tribunals belong to Phase Eight after the E.B.S. reveal.'
      },
      {
        text: 'They permanently freeze the timeline at business-as-usual optics so E.B.S. disclosure and mass reveal never arrive for sleepers.',
        rationale:
          'Narrative maintenance and lockdown prepare the population for the final truth broadcast rather than cancelling disclosure forever.'
      }
    ]
  },
  {
    question: 'After hidden neutralization of elites and underground economies, what do Phases Four, Five, and Six focus on?',
    hint: 'Mind management and controlled collapse of the false frame.',
    options: [
      {
        text: 'Psychological management and the controlled demolition of the false reality for the still-unawakened population.',
        rationale:
          'These three phases focus entirely on psychological management and controlled demolition of the false reality after covert neutralization.'
      },
      {
        text: 'Rebuilding child trafficking pipelines and underground tunnels so the hidden economy can fund a new leadership pyramid.',
        rationale:
          'Underground tunnels, trafficking, and the hidden economy were dismantled in earlier phases; Four through Six manage the public psyche next.'
      },
      {
        text: 'Immediate open execution of every stand-in on live television before any trigger events or lockdown window is staged.',
        rationale:
          'Stand-ins uphold optics during Narrative Maintenance; open justice and tribunals come later after E.B.S., not at this bridge stage.'
      },
      {
        text: 'Only restoring Vatican hierarchy and banking heads to original free-will command with no psychological bridge for sleepers.',
        rationale:
          'True power centers were already neutralized; these phases are theatrical psychological management, not restoration of parasite command.'
      }
    ]
  },
  {
    question: 'How does the Four–Six progression move the population psychologically?',
    hint: 'From deep sleep through questioning into a contained reveal environment.',
    options: [
      {
        text: 'From oblivious slumber to acute questioning, culminating in a locked-down environment prepared for the final broadcast of absolute truth.',
        rationale:
          'The sequence carefully transitions people from oblivious slumber to acute questioning, then into lockdown ready for the truth broadcast.'
      },
      {
        text: 'From full E.B.S. realization backward into deeper oblivious slumber with no questioning stage or lockdown preparation at all.',
        rationale:
          'The direction is out of slumber into questioning and lockdown for reveal, not a reverse slide back into deeper sleep.'
      },
      {
        text: 'From open tribunals and executions straight into permanent war theatre with no mass-reveal containment window for sleepers.',
        rationale:
          'Tribunals are Phase Eight aftermath; Four through Six build toward the truth broadcast through questioning and lockdown first.'
      },
      {
        text: 'From Real Craft Arrival on day one into immediate crystalline reconstruction with no staged psychological bridge phases.',
        rationale:
          'Real Craft Arrival breaks the frequency net after staged fear theatre; Four through Six are the prior psychological bridge.'
      }
    ]
  },
  {
    question: 'What is The Great Purge in this operational timeline?',
    hint: 'Multi-phase removal of parasitic control without early collapse.',
    options: [
      {
        text: 'The multi-phase operational timeline initiated to remove all parasitic control from the realm without triggering premature societal collapse.',
        rationale:
          'The Great Purge is the multi-phase timeline that removes parasitic control while avoiding premature societal collapse.'
      },
      {
        text: 'A single-day weather event that dissolves every city overnight with no phased sequence, stand-ins, or psychological management stages.',
        rationale:
          'The purge is a multi-phase operational timeline with covert and theatrical stages, not an instant city-dissolving weather event.'
      },
      {
        text: 'A pure finance rebrand that leaves world leaders, trafficking rings, and underground economies fully intact under new logos only.',
        rationale:
          'The purge removes parasitic control structures; earlier phases already neutralized elites and underground economies.'
      },
      {
        text: 'A bottom-up street revolt that begins with local vendors and never involves Whitehats, E.B.S., or multi-phase military orchestration.',
        rationale:
          'Whitehats and multi-dimensional command orchestrate the takedown; it is not a random bottom-up vendor revolt.'
      }
    ]
  },
  {
    question: 'Who are Sleepers in this architecture?',
    hint: 'Unawakened masses still inside the 3D illusion.',
    options: [
      {
        text: 'The unawakened masses existing within the 3D illusion who must be psychologically managed before the mass reveal.',
        rationale:
          'Sleepers are the unawakened masses still inside the 3D illusion, held manageable until the mass reveal window opens.'
      },
      {
        text: 'Allied military and multi-dimensional command forces orchestrating the takedown of the parasitic structure worldwide.',
        rationale:
          'Those allied forces are the Whitehats; Sleepers are the unawakened public who still need psychological management.'
      },
      {
        text: 'Resonating Sols whose high-frequency signals already cut cleanly through every false-flag narrative without any management.',
        rationale:
          'Resonating Sols anchor truth as frequency fractures; Sleepers are the unawakened who must be managed before mass reveal.'
      },
      {
        text: 'Neutralized royals and banking heads permanently restored to original free-will power after Phase Three tunnel work ends.',
        rationale:
          'Neutralized leaders are replaced by controlled stand-ins for optics; Sleepers are the unawakened population, not restored elites.'
      }
    ]
  },
  {
    question: 'What are Controlled Stand-ins used for after leaders are neutralized?',
    hint: 'Optics tools that keep neutralized figures looking active.',
    options: [
      {
        text: 'Clones, biological copies, masked actors, holographic projections, and A.I. driven composites that replace neutralized leaders to maintain optics.',
        rationale:
          'Controlled stand-ins include clones, biological copies, masked actors, holographics, and A.I. composites used to keep leadership optics intact.'
      },
      {
        text: 'Permanent free-will world leaders who keep full original power and never follow scripted meetings, speeches, or public ceremonies.',
        rationale:
          'Stand-ins preserve optics after real power is removed; they are not permanent free-will rulers with original command.'
      },
      {
        text: 'Only underground tunnel workers who dismantle trafficking pipelines by hand with no role in surface leadership appearances.',
        rationale:
          'Tunnel and trafficking dismantling belongs to earlier phases; stand-ins replace leaders for public optics on the surface.'
      },
      {
        text: 'Truth tribunal judges who immediately execute every parasite on day one without any business-as-usual holding pattern.',
        rationale:
          'Tribunals and executions are Phase Eight aftermath; stand-ins hold the business-as-usual illusion during Narrative Maintenance.'
      }
    ]
  },
  {
    question: 'What are Trigger Events designed to do to the public?',
    hint: 'Staged pressure that pushes people to question reality.',
    options: [
      {
        text: 'Stage geopolitical tensions and logistical disruptions designed to push the public toward questioning their reality.',
        rationale:
          'Trigger Events are staged geopolitical tensions and logistical disruptions that push people toward questioning reality.'
      },
      {
        text: 'Restore full trust in mainstream media and world police so sleepers never question leadership optics again.',
        rationale:
          'Trigger Events push toward questioning; Phase Six later removes traditional media structures and stages internet restrictions.'
      },
      {
        text: 'Skip all psychological tension and jump straight to permanent crystalline reconstruction without any public pressure stage.',
        rationale:
          'Phase Five deliberately stages tension and disruptions as a bridge before lockdown and E.B.S., not a skip to reconstruction.'
      },
      {
        text: 'Reopen child trafficking pipelines and underground economies so stock markets can rebuild on the old illicit lifeblood.',
        rationale:
          'Those underground systems were dismantled earlier; Trigger Events stage surface geopolitical and supply stress, not a trafficking rebuild.'
      }
    ]
  },
  {
    question: 'What is The Lockdown Window?',
    hint: 'Military presence plus restricted communications before truth lands.',
    options: [
      {
        text: 'A period of military presence and communication restriction establishing a controlled environment for the truth broadcast.',
        rationale:
          'The Lockdown Window uses military presence and communication restriction to create the controlled environment for the truth broadcast.'
      },
      {
        text: 'An open festival of unrestricted internet and traditional media celebrating business-as-usual leadership forever.',
        rationale:
          'The window restricts communications and stages removal of traditional media structures rather than expanding unrestricted media freedom.'
      },
      {
        text: 'Only Phase One silent arrests of royalty with no street military presence or later E.B.S. containment role at all.',
        rationale:
          'Phase One was covert apex neutralization; the Lockdown Window is Phase Six physical and informational control before E.B.S.'
      },
      {
        text: 'A permanent cancellation of the Emergency Broadcast System so absolute truth is never delivered to the public.',
        rationale:
          'The Lockdown Window prepares the exact controlled environment necessary for the E.B.S. to take over and broadcast truth.'
      }
    ]
  },
  {
    question: 'Who are the Whitehats in this operation?',
    hint: 'Allied forces running the takedown and narrative transition.',
    options: [
      {
        text: 'Allied military and multi-dimensional command forces orchestrating the takedown of the parasitic structure and managing the narrative transition.',
        rationale:
          'Whitehats are allied military and multi-dimensional command forces that orchestrate the takedown and manage the narrative transition.'
      },
      {
        text: 'Unawakened sleepers who only watch television and never touch any operational timeline, lockdown, or media transition work.',
        rationale:
          'Sleepers are psychologically managed; Whitehats run the military and multi-dimensional command operation.'
      },
      {
        text: 'Parasitic banking heads and Vatican hierarchy restored to full pyramid power after underground economies are rebuilt.',
        rationale:
          'Banking heads and Vatican hierarchy were Phase One targets neutralized at the apex; Whitehats orchestrate their removal, not their return.'
      },
      {
        text: 'Only NPC programs that glitch endlessly with no role in military presence, narrative management, or truth broadcast preparation.',
        rationale:
          'NPC programming breaks down under pressure; Whitehats are the allied command forces guiding the purge and narrative transition.'
      }
    ]
  },
  {
    question: 'What is the E.B.S. in this sequence?',
    hint: 'The system that seizes media to deliver ultimate truth.',
    options: [
      {
        text: 'The Emergency Broadcast System that takes over media networks to deliver the ultimate truth to the public.',
        rationale:
          'E.B.S. is the Emergency Broadcast System that takes over media networks to deliver the ultimate truth to the public.'
      },
      {
        text: 'A permanent Narrative Maintenance studio that only airs fake meetings and ceremonies with no truth disclosure ever planned.',
        rationale:
          'Narrative Maintenance is Phase Four optics; E.B.S. is the later system that delivers ultimate truth after the lockdown window.'
      },
      {
        text: 'A Phase Three tunnel-mapping tool used only to chart underground shipping routes with no public media role.',
        rationale:
          'Phase Three dismantled underground infrastructure; E.B.S. is the media takeover system for public truth delivery.'
      },
      {
        text: 'A sleeper-only social app that restores trust in world police without any military or Whitehat involvement.',
        rationale:
          'E.B.S. is the Emergency Broadcast System taking over media networks under the larger Whitehat-managed purge sequence.'
      }
    ]
  },
  {
    question: 'What is true of visible global leadership and routine governance during these bridge phases?',
    hint: 'What the public sees after covert removal of real power.',
    options: [
      {
        text: 'Events perceived as current global leadership and routine governance are entirely fabricated theater running on Narrative Maintenance.',
        rationale:
          'After covert removal of leaders and influencers, the visible world operates strictly on Narrative Maintenance as fabricated theater.'
      },
      {
        text: 'Every world leader, corporate head, and cultural influencer still holds full original free-will power with no stand-in optics layer.',
        rationale:
          'Those figures were covertly removed in earlier phases; what remains visible is stand-in theater, not original free-will power.'
      },
      {
        text: 'Leadership optics are abandoned on day one so streets fill with unmanaged chaos before any lockdown window is prepared.',
        rationale:
          'Narrative Maintenance deliberately upholds business-as-usual optics so sleepers stay manageable until the mass reveal window.'
      },
      {
        text: 'Only Phase Eight tribunals are running live while Phase Four stand-ins and Phase Five triggers are skipped entirely.',
        rationale:
          'Four through Six are the theatrical bridge before Seven and Eight; fabricated leadership theater is still active in this window.'
      }
    ]
  },
  {
    question: 'How should staged geopolitical tensions, air raid sirens, and supply chain disruptions be understood?',
    hint: 'Not organic chaos — engineered pressure on mass consciousness.',
    options: [
      {
        text: 'Not organic chaos but a meticulously orchestrated operation to stretch mass public consciousness to the edge of awareness.',
        rationale:
          'Global distress of that kind is orchestrated to stretch mass public consciousness to the edge of awareness, not random organic chaos.'
      },
      {
        text: 'Proof that Whitehats lost control and that parasitic underground economies have fully returned to fund real open war.',
        rationale:
          'The distress is orchestrated theatrical pressure after those economies were neutralized, not proof of a returned underground war machine.'
      },
      {
        text: 'Only natural weather cycles with no staged geopolitical, siren, or supply component aimed at public consciousness at all.',
        rationale:
          'The mechanics name staged geopolitical tensions, air raid sirens, and supply disruptions as deliberate operations on mass consciousness.'
      },
      {
        text: 'Immediate unfiltered E.B.S. truth packages already disclosing election fraud, trafficking rings, and satanic cults on every channel.',
        rationale:
          'Those disclosures are Phase Seven E.B.S. work; Phase Five stages edge-of-awareness pressure without yet delivering the full truth package.'
      }
    ]
  },
  {
    question: 'What is Phase Four: Narrative Maintenance primarily targeting?',
    hint: 'Perception management for the still-unawakened.',
    options: [
      {
        text: 'The perception of the unawakened, keeping business as usual through controlled stand-ins while real power is already gone.',
        rationale:
          'Phase Four targets the perception of the unawakened and uses controlled stand-ins so business carries on as usual.'
      },
      {
        text: 'The immediate physical dismantling of underground tunnels, child trafficking pipelines, and the entire hidden economy on camera.',
        rationale:
          'That underground dismantling is Phase Three; Phase Four is narrative optics for sleepers after real power centers fell.'
      },
      {
        text: 'Open street military lockdowns and staged internet blackouts before any stand-in speeches or fake ceremonies begin.',
        rationale:
          'Military street presence and internet restrictions are Phase Six; Phase Four first holds business-as-usual optics with stand-ins.'
      },
      {
        text: 'Full E.B.S. disclosure of satanic cults and election fraud with no holding pattern for sleeper perception management.',
        rationale:
          'E.B.S. shatter is Phase Seven; Phase Four holds sleepers in a manageable, docile state until the mass reveal window opens.'
      }
    ]
  },
  {
    question: 'How do replaced leaders uphold the illusion during Phase Four?',
    hint: 'Scripted public performance that looks like normal governance.',
    options: [
      {
        text: 'They conduct fake meetings, deliver speeches, and attend public ceremonies so leadership still appears active and legitimate.',
        rationale:
          'Replaced leaders conduct fake meetings, deliver speeches, and attend public ceremonies to uphold the business-as-usual illusion.'
      },
      {
        text: 'They immediately confess every crime on E.B.S. loops so sleepers never experience a business-as-usual optics period.',
        rationale:
          'Stand-ins maintain normal-looking governance; full truth broadcast comes later through E.B.S., not during Phase Four optics.'
      },
      {
        text: 'They only appear inside dismantled DUMBS tunnels and never on surface media that unawakened sleepers actually watch.',
        rationale:
          'Stand-ins replace leaders for public optics — meetings, speeches, and ceremonies the surface population still sees.'
      },
      {
        text: 'They restore full trafficking and adrenochrome pipelines so the stock market can rebuild on the same illicit foundation.',
        rationale:
          'Underground illicit economies were already dismantled; Phase Four maintains visual normalcy, not a return of that lifeblood.'
      }
    ]
  },
  {
    question: 'What is the strict purpose of Phase Four Narrative Maintenance?',
    hint: 'Hold sleepers steady until the reveal window opens.',
    options: [
      {
        text: 'To hold sleepers in a manageable, docile state until the precise mass reveal window opens.',
        rationale:
          'The strict purpose of Phase Four is to hold sleepers in a manageable, docile state until the precise mass reveal window opens.'
      },
      {
        text: 'To force immediate worldwide panic by revealing every satanic operator before any lockdown containment exists.',
        rationale:
          'Phase Four prevents premature collapse by keeping sleepers docile; panic mitigation is the strategic point of this bridge.'
      },
      {
        text: 'To reinstall royalty, prime ministers, and banking heads with original free-will command over the pyramid apex.',
        rationale:
          'Those apex figures were neutralized in Phase One; Phase Four uses stand-ins for optics, not restoration of original parasite command.'
      },
      {
        text: 'To cancel Phases Five through Eight so trigger events, lockdown, and E.B.S. never pressure public consciousness.',
        rationale:
          'Phase Four is the holding pattern before Phase Five triggers, Phase Six lockdown, and later E.B.S. truth phases.'
      }
    ]
  },
  {
    question: 'Where does Phase Five: Trigger Events shift the operational focus?',
    hint: 'From quiet optics to mass public consciousness pressure.',
    options: [
      {
        text: 'Onto mass public consciousness, staging tensions and disruptions that push sleepers toward the edge of questioning reality.',
        rationale:
          'Phase Five shifts focus to mass public consciousness, staging operations that push sleepers to the edge of questioning reality.'
      },
      {
        text: 'Back onto silent Phase One arrests of Vatican hierarchy with no public-facing geopolitical or supply pressure at all.',
        rationale:
          'Phase One apex arrests already happened; Phase Five is the public-consciousness pressure stage with staged global distress.'
      },
      {
        text: 'Onto permanent celebration of Real Craft Arrival with no fear theatre, sirens, or supply disruption staging beforehand.',
        rationale:
          'Staged WW3 and fake alien invasion theatre push sleepers into fear before Real Craft Arrival; Phase Five is the tension bridge.'
      },
      {
        text: 'Onto Phase Eight truth tribunals and executions as the first public step with no prior questioning pressure built up.',
        rationale:
          'Tribunals are aftermath stabilization; Phase Five first stretches consciousness through staged trigger pressure.'
      }
    ]
  },
  {
    question: 'What precise balance do Phase Five trigger mechanics aim for?',
    hint: 'Questioning without total panic.',
    options: [
      {
        text: 'Push sleepers to the absolute edge of questioning their reality without inducing full panic.',
        rationale:
          'Phase Five aims to push sleepers to the absolute edge of questioning reality without inducing full panic.'
      },
      {
        text: 'Induce total societal collapse and uncontrollable worldwide panic before any military lockdown can contain the environment.',
        rationale:
          'The strategy mitigates uncontrollable panic; Phase Five stops short of full panic while stretching consciousness to the edge.'
      },
      {
        text: 'Restore total trust in traditional media and world police so questioning never begins among the unawakened masses.',
        rationale:
          'Trigger Events push toward questioning; Phase Six later signals removal of world police and traditional media structures.'
      },
      {
        text: 'Deliver complete E.B.S. packages on election fraud and satanic cults as the very first public pressure step.',
        rationale:
          'Full E.B.S. disclosure is Phase Seven; Phase Five stages geopolitical, siren, and supply pressure without the full truth dump yet.'
      }
    ]
  },
  {
    question: 'What happens when the operation enters Phase Six: The Lockdown Window?',
    hint: 'From psychological tension into physical and informational control.',
    options: [
      {
        text: 'Visible military forces deploy in the streets to maintain order, signaling removal of world police and traditional media structures.',
        rationale:
          'Phase Six moves into physical and informational control with visible military street presence and removal of world police and traditional media structures.'
      },
      {
        text: 'Only more fake board meetings and award ceremonies with no military street presence or communications control at all.',
        rationale:
          'Fake meetings and ceremonies are Phase Four optics; Phase Six deploys military forces and restricts information channels.'
      },
      {
        text: 'Underground economies reopen under Whitehat logos while sleepers are told nothing has changed in surface governance.',
        rationale:
          'Underground economies were dismantled earlier; Phase Six locks down the physical environment for the coming truth broadcast.'
      },
      {
        text: 'Phase One royalty arrests begin for the first time with no prior covert neutralization or stand-in optics layer.',
        rationale:
          'Apex neutralization was Phase One; Phase Six is the later lockdown bridge after Narrative Maintenance and Trigger Events.'
      }
    ]
  },
  {
    question: 'Which information-control steps does Phase Six introduce before E.B.S. takeover?',
    hint: 'Staged net limits and media self-exposure.',
    options: [
      {
        text: 'Internet restrictions introduced in stages, and mainstream media exposes its own corruption, preparing the controlled environment for E.B.S.',
        rationale:
          'Phase Six stages internet restrictions and has mainstream media expose its own corruption so E.B.S. can take over cleanly.'
      },
      {
        text: 'Unlimited internet freedom and stronger mainstream media narrative control with no self-exposure of corruption at all.',
        rationale:
          'The phase restricts internet access in stages and has mainstream media expose its own corruption rather than tightening old narrative control.'
      },
      {
        text: 'Only underground tunnel tours for tourists with no public internet or mainstream media dimension to the lockdown.',
        rationale:
          'Phase Six is surface military and informational control for the truth broadcast, not underground tourism.'
      },
      {
        text: 'Immediate Phase Eight executions on every corner with no staged communications restriction or media corruption reveal first.',
        rationale:
          'Executions and tribunals are Phase Eight aftermath; Phase Six first builds the controlled informational environment for E.B.S.'
      }
    ]
  },
  {
    question: 'What did Phase One dismantle at the apex of the parasitic pyramid?',
    hint: 'Highest political, financial, and religious control layers.',
    options: [
      {
        text: 'Royals, prime ministers, banking heads, and Vatican hierarchy at the apex of the parasitic pyramid.',
        rationale:
          'Phase One targeted royals, prime ministers, banking heads, and Vatican hierarchy at the apex of the parasitic pyramid.'
      },
      {
        text: 'Only local sports coaches and weather presenters with no reach into royalty, banking, or Vatican hierarchy.',
        rationale:
          'Phase One hits the pyramid apex — royals, prime ministers, banking heads, and Vatican hierarchy — not minor local figures alone.'
      },
      {
        text: 'Only corporate CEOs and cultural influencers, leaving banking heads and Vatican hierarchy in full original power.',
        rationale:
          'Corporate CEOs and cultural influencers are Phase Two; Phase One targets the apex including banking heads and Vatican hierarchy.'
      },
      {
        text: 'Only underground tunnels and child trafficking pipelines with no action against surface political or religious hierarchy.',
        rationale:
          'Underground tunnels and trafficking are Phase Three; Phase One dismantles the apex leadership layers first.'
      }
    ]
  },
  {
    question: 'What did Phase Two enact as the infrastructure sweep?',
    hint: 'Corporate and cultural influence layers.',
    options: [
      {
        text: 'An infrastructure sweep of corporate CEOs and cultural influencers after the apex leadership was already neutralized.',
        rationale:
          'Phase Two enacted an infrastructure sweep of corporate CEOs and cultural influencers following apex dismantling.'
      },
      {
        text: 'Only Vatican hierarchy arrests while every corporate CEO and cultural influencer kept full real-world command.',
        rationale:
          'Vatican hierarchy is named in Phase One apex work; Phase Two specifically sweeps corporate CEOs and cultural influencers.'
      },
      {
        text: 'Only E.B.S. truth packages on election fraud with no corporate or cultural influence infrastructure action.',
        rationale:
          'E.B.S. disclosure is Phase Seven; Phase Two is the earlier infrastructure sweep of CEOs and cultural influencers.'
      },
      {
        text: 'Only military street lockdowns and staged internet blackouts with no action against corporate or cultural power.',
        rationale:
          'Military street presence and internet restrictions are Phase Six; Phase Two is the CEO and cultural influencer sweep.'
      }
    ]
  },
  {
    question: 'What did Phase Three: 3rd Realm Collapse systematically dismantle?',
    hint: 'Subterranean crime and hidden economic lifeblood.',
    options: [
      {
        text: 'Underground tunnels, child trafficking pipelines, and the hidden economy that funded parasitic power.',
        rationale:
          'Phase Three systematically dismantled underground tunnels, child trafficking pipelines, and the hidden economy.'
      },
      {
        text: 'Only surface fashion brands and award shows with no action on tunnels, trafficking, or hidden finance.',
        rationale:
          'Surface cultural influence is Phase Two territory; Phase Three hits subterranean tunnels, trafficking, and the hidden economy.'
      },
      {
        text: 'Only Narrative Maintenance studios so stand-ins could never hold fake meetings or public ceremonies again.',
        rationale:
          'Narrative Maintenance is Phase Four after the underground collapse; Phase Three targets tunnels, trafficking, and hidden economy.'
      },
      {
        text: 'Only Resonating Sols frequency anchors so NPC programming would never glitch during later false-flag theatre.',
        rationale:
          'Resonating Sols cut through noise as frequency fractures; Phase Three dismantles underground parasitic infrastructure, not light anchors.'
      }
    ]
  },
  {
    question: 'Why are Phases Four through Six described as entirely theatrical?',
    hint: 'True power centers were already neutralized covertly.',
    options: [
      {
        text: 'Because true power centers were neutralized covertly, these phases function as a psychological bridge to prevent total societal collapse.',
        rationale:
          'With true power already removed covertly, Phases Four through Six are theatrical psychological bridging to prevent total societal collapse.'
      },
      {
        text: 'Because no prior neutralization happened and every royal, CEO, and trafficking pipeline still holds full original power.',
        rationale:
          'Prior phases already dismantled apex, influencers, and underground economies; the theatre exists because real power is already gone.'
      },
      {
        text: 'Because Whitehats abandoned the realm and left sleepers with no military, multi-dimensional, or narrative management at all.',
        rationale:
          'Whitehats orchestrate the takedown and narrative transition; the theatrical bridge is managed, not an abandonment.'
      },
      {
        text: 'Because Phase Seven E.B.S. and Phase Eight tribunals were cancelled, leaving permanent stand-in governance forever.',
        rationale:
          'These phases prepare the terrain for Phase Seven E.B.S. and Phase Eight stabilization rather than cancelling those later steps.'
      }
    ]
  },
  {
    question: 'What does Phase Seven disclose, and what does Phase Eight secure afterward?',
    hint: 'E.B.S. shatter contents, then tribunals and executions.',
    options: [
      {
        text: 'Phase Seven E.B.S. discloses election fraud, trafficking rings, and satanic cults; Phase Eight secures the realm through truth tribunals and executions.',
        rationale:
          'Phase Seven shatters false reality by disclosing election fraud, trafficking rings, and satanic cults; Phase Eight uses truth tribunals and executions for aftermath stabilization.'
      },
      {
        text: 'Phase Seven only airs more fake stand-in ceremonies; Phase Eight reopens underground tunnels and child trafficking for a new hidden economy.',
        rationale:
          'Phase Seven discloses the crimes; Phase Eight stabilizes through tribunals and executions rather than rebuilding underground crime.'
      },
      {
        text: 'Phase Seven restores Vatican and banking free-will power; Phase Eight cancels all military lockdowns with no justice process.',
        rationale:
          'Seven and Eight reveal crimes and execute justice after the bridge phases, not restore apex parasites or cancel justice.'
      },
      {
        text: 'Phase Seven and Eight only repeat Phase Four Narrative Maintenance with no E.B.S. disclosure or tribunal function at all.',
        rationale:
          'Four is the holding pattern; Seven and Eight are overt revelation and stabilization after the lockdown window prepares the field.'
      }
    ]
  },
  {
    question: 'What strategic effect do Phases Four through Six create for NPC programming and Resonating Sols?',
    hint: 'Glitching false flags, frequency fracture, truth anchors.',
    options: [
      {
        text: 'They force NPC Programming to glitch and flicker as false-flag narratives wobble, creating frequency fracture so Resonating Sols signals cut through and anchor the truth.',
        rationale:
          'Timed psychological pressure breaks NPC Programming into glitches, creates frequency fracture, and lets Resonating Sols signals cut through to anchor truth.'
      },
      {
        text: 'They permanently strengthen NPC Programming and seal the frequency net so Resonating Sols can never cut through staged fear theatre.',
        rationale:
          'The sequence breaks NPC Programming down and opens frequency fracture for Resonating Sols, rather than sealing them out forever.'
      },
      {
        text: 'They only rebuild A.I. War Theatre forever with no path to Real Craft Arrival or any break of the frequency net.',
        rationale:
          'Staged WW3 and fake alien invasion theatre push sleepers into fear before Real Craft Arrival breaks the frequency net.'
      },
      {
        text: 'They cancel all trigger pressure and lockdown so sleepers remain in oblivious slumber without any path toward mass reveal.',
        rationale:
          'Four through Six deliberately move sleepers from slumber through questioning into lockdown prepared for the truth broadcast.'
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
  'Test your understanding of Phases Four - Six — narrative maintenance, trigger events, and the lockdown window bridging covert neutralization to E.B.S. truth.';
const DESC_META =
  'Interactive Living Truth Quiz on Phases Four - Six: narrative maintenance, trigger events, lockdown window, and the theatrical bridge to absolute truth.';
const SUBTITLE =
  'Test your grasp of Phases Four - Six — narrative maintenance, trigger events, and the lockdown window that prepare sleepers for the mass reveal.';

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
      'Phases Four through Six of The Great Purge are the theatrical psychological bridge after covert neutralization — Narrative Maintenance holds sleepers docile, Trigger Events push them to the edge of questioning, and the Lockdown Window locks the field for E.B.S. truth. Sit with what you missed, then return to the Phases Four - Six deep-dive, infographic, and video transmissions. Controlled demolition of false reality prepares the path from oblivious slumber through acute questioning into the final broadcast of absolute truth.'
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

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    DESC_META
  ],
  ['quiz/breakdown/hard-drive-framework.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/hard-drive-framework.webp', TOPIC_IMAGE],
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

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchor =
    "  { path: '/quiz/breakdown/hard-drive-framework.html', priority: '0.75', changefreq: 'monthly' },";
  if (!sm.includes(anchor)) {
    throw new Error('Could not find sitemap anchor to insert quiz entry');
  }
  sm = sm.replace(anchor, `${anchor}\n${entry}`);
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

console.log('Correct-answer letter mix:', letterCounts);
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('PASS: audited 25/25 against data/breakdown-topics/phase-four-six.json');
