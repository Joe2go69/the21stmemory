/**
 * Installs Trigger Events quiz for breakdown (Mega Breakdown) transmission.
 * All 25 items authored from and audited against data/breakdown-topics/trigger-events.json only.
 * Run: node scripts/install-trigger-events-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/trigger-events.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'trigger-events';
const TOPIC_TITLE = 'Trigger Events';
const SOURCE = 'breakdown';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const metaVoiceRe =
  /\b(according to the (report|source|text)|the report states|the source (states|specifies|suggests)|the text (states|describes|suggests|explicitly|mentions)|source material)\b/i;

/** Support phrases grounded only in trigger-events.json report. */
const supportPhrases = {
  1: ['fifth phase', 'great purge', 'trigger events'],
  2: ['phase four', 'phase six', 'controlled escalation'],
  3: ['staged geopolitical tensions', 'air raid sirens', 'supply disruptions'],
  4: ['narrative maintenance', 'fourth phase', 'stand-ins'],
  5: ['lockdown window', 'sixth phase', 'military'],
  6: ['sleepers', 'unawakened', '3d illusion'],
  7: ['a.i. war theatre', 'scripted', 'all sides'],
  8: ['false flag', 'tanker attacks', 'embassy strikes'],
  9: ['project blue beam', 'holographic', 'alien invasion'],
  10: ['whitehat production', 'not organic', 'a.i. script'],
  11: ['parasitic leaders', 'neutralized', 'controlled simulation'],
  12: ['npc programming', 'fracturing', 'brink of extinction'],
  13: ['russia', 'china', 'nato', 'world war iii'],
  14: ['expendable buildings', 'embassy strikes', 'tanker attacks'],
  15: ['panic buying', 'market drops', 'supply chain'],
  16: ['undersea cables', 'cyber attacks', 'communication darkness'],
  17: ['holographic fleets', 'fake abductions', 'cosmic battle'],
  18: ['complacency', 'narrative maintenance', 'stressor'],
  19: ['fear and confusion', 'amnesia', 'sleepers'],
  20: ['justification', 'military forces', 'streets'],
  21: ['phase seven', 'e.b.s.', 'absolute truth'],
  22: ['psychological frequency management', 'manageable pace'],
  23: ['chaotic collapse', 'without warning', 'parasitic overlay'],
  24: ['frequency fracture', 'false reality', 'seek answers'],
  25: ['resonating sols', 'truth broadcasts', 'aligning']
};

const RAW_QUESTIONS = [
  {
    number: 1,
    question: 'Which phase of The Great Purge are Trigger Events?',
    hint: 'Place them between pacifying illusions and physical containment.',
    options: [
      {
        text: 'The pivotal fifth phase of The Great Purge, a controlled escalation of global tension between Phases Four and Six.',
        isCorrect: true,
        rationale:
          'Trigger Events constitute the pivotal fifth phase of The Great Purge, operating as controlled escalation between Phase Four and Phase Six.'
      },
      {
        text: 'The fourth phase of The Great Purge, focused only on Controlled Stand-ins and fabricated normalcy optics.',
        isCorrect: false,
        rationale:
          'That describes Narrative Maintenance (Phase Four); Trigger Events are the fifth phase that follows it.'
      },
      {
        text: 'The sixth phase of The Great Purge, defined solely by visible military lockdown in the streets.',
        isCorrect: false,
        rationale:
          'That describes The Lockdown Window (Phase Six), which follows Trigger Events rather than defining them.'
      },
      {
        text: 'The seventh phase of The Great Purge, limited to the Emergency Broadcast System truth delivery alone.',
        isCorrect: false,
        rationale:
          'Phase Seven E.B.S. truth delivery comes after Trigger Events achieve emotional peak and initiate lockdown.'
      }
    ]
  },
  {
    number: 2,
    question: 'Where do Trigger Events sit in the purge sequence?',
    hint: 'Name the phases immediately before and after this controlled escalation.',
    options: [
      {
        text: 'Between Phase Four Narrative Maintenance pacifying illusions and Phase Six physical containment.',
        isCorrect: true,
        rationale:
          'Trigger Events are sandwiched between the pacifying illusions of Phase Four and the physical containment of Phase Six.'
      },
      {
        text: 'Before any Narrative Maintenance, as the first public-facing operation of The Great Purge.',
        isCorrect: false,
        rationale:
          'Phase Four Narrative Maintenance precedes Phase Five; Trigger Events are not the first optics phase.'
      },
      {
        text: 'After the E.B.S. absolute-truth broadcast has already completed worldwide.',
        isCorrect: false,
        rationale:
          'Trigger Events prepare the path into lockdown and then Phase Seven E.B.S., not events after truth is finished.'
      },
      {
        text: 'Only inside Phase Seven, with no connection to geopolitical tension or public fear pacing.',
        isCorrect: false,
        rationale:
          'Phase Five is geopolitical and psychological escalation; Phase Seven is the later absolute-truth broadcast.'
      }
    ]
  },
  {
    number: 3,
    question: 'What core tools define Trigger Events as a phase?',
    hint: 'Recall staged tensions, sirens, and supply pressure on mass consciousness.',
    options: [
      {
        text: 'Staged geopolitical tensions, air raid sirens, and supply disruptions that push public consciousness to the edge of questioning.',
        isCorrect: true,
        rationale:
          'Trigger Events use staged geopolitical tensions, air raid sirens, and supply disruptions to push mass public consciousness to the edge of questioning reality.'
      },
      {
        text: 'Only calm award ceremonies and stand-in speeches with no geopolitical pressure or sirens at all.',
        isCorrect: false,
        rationale:
          'Calm fabricated normalcy belongs to Narrative Maintenance; Trigger Events escalate tension deliberately.'
      },
      {
        text: 'Only permanent military street occupation with no staged wars, sirens, or supply disruptions beforehand.',
        isCorrect: false,
        rationale:
          'Visible military lockdown is Phase Six; Phase Five first stages tensions, sirens, and disruptions.'
      },
      {
        text: 'Only organic market accidents with no staged false flags or scripted conflict theater.',
        isCorrect: false,
        rationale:
          'Escalating crises are orchestrated Whitehat production on an A.I. script, not organic failures.'
      }
    ]
  },
  {
    number: 4,
    question: 'What is Narrative Maintenance relative to Trigger Events?',
    hint: 'Identify the preceding phase and its pacifying method.',
    options: [
      {
        text: 'The preceding fourth phase that manages sleepers through controlled stand-ins and fabricated normalcy.',
        isCorrect: true,
        rationale:
          'Narrative Maintenance is the preceding fourth phase focused on managing sleepers through controlled stand-ins and fabricated normalcy.'
      },
      {
        text: 'The phase after Trigger Events that deploys holographic alien fleets as Project Blue Beam.',
        isCorrect: false,
        rationale:
          'Alien invasion sequencing is part of Phase Five escalation after geopolitical fear peaks, not Narrative Maintenance.'
      },
      {
        text: 'The sixth phase that establishes visible military lockdown for the truth broadcast environment.',
        isCorrect: false,
        rationale:
          'That is The Lockdown Window; Narrative Maintenance is Phase Four before Trigger Events.'
      },
      {
        text: 'An unrelated side project with no role in pacifying sleepers before Phase Five stress.',
        isCorrect: false,
        rationale:
          'Phase Four establishes the docile complacency that Phase Five intentionally shatters as a stressor.'
      }
    ]
  },
  {
    number: 5,
    question: 'What is The Lockdown Window relative to Trigger Events?',
    hint: 'Name the subsequent phase and its military-informational role.',
    options: [
      {
        text: 'The subsequent sixth phase that establishes controlled physical and informational environment via visible military presence.',
        isCorrect: true,
        rationale:
          'The Lockdown Window is the subsequent sixth phase establishing controlled physical and informational environment via visible military presence for the truth broadcast.'
      },
      {
        text: 'The phase before Trigger Events that only uses stand-ins for awards and fabricated ceremonies.',
        isCorrect: false,
        rationale:
          'Stand-in normalcy is Narrative Maintenance; lockdown follows Trigger Events once emotional peak is reached.'
      },
      {
        text: 'A cancelled operation that never uses military presence once geopolitical tension begins.',
        isCorrect: false,
        rationale:
          'Staged chaos justifies military deployment into the streets as Phase Six begins after Trigger Events.'
      },
      {
        text: 'The same fifth phase renamed, with no distinction between staged wars and street lockdown.',
        isCorrect: false,
        rationale:
          'Trigger Events are Phase Five escalation; The Lockdown Window is the distinct subsequent sixth phase.'
      }
    ]
  },
  {
    number: 6,
    question: 'Who are the Sleepers in this framework?',
    hint: 'Identify whose consciousness must be carefully fractured.',
    options: [
      {
        text: 'The unawakened masses locked within the 3D illusion whose consciousness must be carefully fractured.',
        isCorrect: true,
        rationale:
          'Sleepers are the unawakened masses locked within the 3D illusion whose consciousness must be carefully fractured.'
      },
      {
        text: 'The architects of The Great Purge who write the A.I. War Theatre scripts for all sides.',
        isCorrect: false,
        rationale:
          'Architects manage pacing and production; Sleepers are the unawakened public targeted by that pressure.'
      },
      {
        text: 'Only military commanders already outside the 3D illusion and immune to fear frequency.',
        isCorrect: false,
        rationale:
          'Sleepers are the unawakened masses still locked in the 3D illusion, not already liberated commanders.'
      },
      {
        text: 'Only the neutralized parasitic leaders no longer able to appear in public optics.',
        isCorrect: false,
        rationale:
          'Parasitic leaders are already neutralized; Sleepers are the masses still inside the false reality.'
      }
    ]
  },
  {
    number: 7,
    question: 'What is the A.I. War Theatre?',
    hint: 'Focus on how staged wars are puppeteered across opposing sides.',
    options: [
      {
        text: 'An automated, scripted geopolitical conflict mechanism that puppeteers all sides of staged wars to raise global tension.',
        isCorrect: true,
        rationale:
          'The A.I. War Theatre is the automated, scripted geopolitical conflict mechanism puppeteering all sides of staged wars to raise global tension.'
      },
      {
        text: 'A natural multipolar rivalry with no shared script and fully independent national command structures.',
        isCorrect: false,
        rationale:
          'All sides are manipulated by the same A.I. script to simulate World War III, not independent organic rivalry.'
      },
      {
        text: 'A Phase Four ceremony tool used only for awards shows and fabricated leadership speeches.',
        isCorrect: false,
        rationale:
          'A.I. War Theatre is a Phase Five geopolitical tension mechanism, not Phase Four stand-in optics.'
      },
      {
        text: 'A post-E.B.S. reconstruction plan that rebuilds traditional media after absolute truth is delivered.',
        isCorrect: false,
        rationale:
          'It stages conflict during Trigger Events to raise tension before lockdown and truth broadcast.'
      }
    ]
  },
  {
    number: 8,
    question: 'What are False Flag Events in this phase?',
    hint: 'List staged incident types used to emotionally charge the public.',
    options: [
      {
        text: 'Staged incidents such as tanker attacks, embassy strikes, and targeted blackouts designed to emotionally charge the public.',
        isCorrect: true,
        rationale:
          'False Flag Events are staged incidents such as tanker attacks, embassy strikes, and targeted blackouts designed to emotionally charge the public.'
      },
      {
        text: 'Only unplanned accidents with no emotional targeting and no connection to escalation theater.',
        isCorrect: false,
        rationale:
          'These are deliberate staged escalations, including simulated tanker attacks and embassy strikes.'
      },
      {
        text: 'Only peaceful diplomatic summits that reduce tension and cancel all supply disruptions.',
        isCorrect: false,
        rationale:
          'False flags escalate emotional charge; they do not pacify or cancel Trigger Event pressure.'
      },
      {
        text: 'Only Phase Six military curfews with no tanker, embassy, or blackout staging beforehand.',
        isCorrect: false,
        rationale:
          'False flags are Phase Five escalation tools that help justify later lockdown, not lockdown itself.'
      }
    ]
  },
  {
    number: 9,
    question: 'What is Project Blue Beam in the Trigger Events sequence?',
    hint: 'Connect holographic technology to the alien-invasion fear peak.',
    options: [
      {
        text: 'Advanced holographic projection technology used to simulate an alien invasion once mass fear frequency peaks.',
        isCorrect: true,
        rationale:
          'Project Blue Beam is advanced holographic projection technology used to simulate an alien invasion once the mass fear frequency peaks.'
      },
      {
        text: 'A Phase Four stand-in cloning process used only for awards and fabricated leadership ceremonies.',
        isCorrect: false,
        rationale:
          'Project Blue Beam is alien-invasion holographic tech at peak fear, not Phase Four stand-in management.'
      },
      {
        text: 'A genuine extraterrestrial fleet arriving without any human holographic staging or scripted sky battle.',
        isCorrect: false,
        rationale:
          'The sequence uses holographic fleets and repurposed human technology to stage a fake cosmic threat.'
      },
      {
        text: 'An E.B.S. audio-only bulletin that never involves sky projections, fleets, or fake abductions.',
        isCorrect: false,
        rationale:
          'Blue Beam stages massive sky theater including fleets, cosmic battle, and fake abductions before later truth delivery.'
      }
    ]
  },
  {
    number: 10,
    question: 'What is the true nature of escalating global conflicts and sudden crises?',
    hint: 'Contrast organic failure with orchestrated production.',
    options: [
      {
        text: 'They are not organic geopolitical failures but a meticulously orchestrated Whitehat production on an A.I. script.',
        isCorrect: true,
        rationale:
          'Escalating global conflicts, cyber attacks, and sudden crises are a meticulously orchestrated Whitehat production running on an A.I. script, not organic failures.'
      },
      {
        text: 'They are fully organic multipolar accidents with no Whitehat orchestration or scripted psychological levers.',
        isCorrect: false,
        rationale:
          'The visible chaos is controlled simulation; every escalation is a deliberate psychological lever.'
      },
      {
        text: 'They are random weather events with no link to war theater, markets, or diplomatic escalation.',
        isCorrect: false,
        rationale:
          'Missile strikes, market drops, and diplomatic escalations are named as deliberate levers in the production.'
      },
      {
        text: 'They prove parasitic leaders still fully control every nation without any neutralization having occurred.',
        isCorrect: false,
        rationale:
          'True parasitic leaders have already been neutralized; visible chaos is controlled simulation after that.'
      }
    ]
  },
  {
    number: 11,
    question: 'What has already happened to the true parasitic leaders during this phase?',
    hint: 'Connect neutralization to the controlled simulation on display.',
    options: [
      {
        text: 'They have already been neutralized, and current visible chaos runs as a controlled simulation on an A.I. script.',
        isCorrect: true,
        rationale:
          'True parasitic leaders have already been neutralized, and current visible chaos is a controlled simulation running on an A.I. script.'
      },
      {
        text: 'They still personally command every missile strike without any Whitehat control of the theater.',
        isCorrect: false,
        rationale:
          'Parasitic leaders are already neutralized; the theater is Whitehat-orchestrated simulation.'
      },
      {
        text: 'They were restored to power by Phase Four stand-ins before any Trigger Events began.',
        isCorrect: false,
        rationale:
          'Stand-ins manage optics after removal; Trigger Events are not a restoration of parasitic command.'
      },
      {
        text: 'They only appear after Project Blue Beam as the sole authors of the alien invasion holograms.',
        isCorrect: false,
        rationale:
          'Neutralization precedes the controlled chaos; Blue Beam is part of the Whitehat-staged sequence.'
      }
    ]
  },
  {
    number: 12,
    question: 'What is the core objective of Trigger Events?',
    hint: 'Focus on consciousness fracture rather than pure physical destruction.',
    options: [
      {
        text: 'Systematic fracturing of NPC Programming so humanity believes it is on the brink of extinction and will accept later shattering truths.',
        isCorrect: true,
        rationale:
          'The core objective is not destruction but systematic fracturing of NPC Programming, pushing humanity to the brink of extinction so it will accept shattering truths in later phases.'
      },
      {
        text: 'Maximum uncontrolled destruction of every city with no concern for psychological pacing or later truth delivery.',
        isCorrect: false,
        rationale:
          'The objective is not destruction; it is managed psychological fracture toward later truth phases.'
      },
      {
        text: 'Permanent reinforcement of NPC Programming so sleepers never question the 3D illusion again.',
        isCorrect: false,
        rationale:
          'Trigger Events fracture programming and push questioning, not permanent reinforcement of amnesia.'
      },
      {
        text: 'Immediate full E.B.S. disclosure on day one with no fear peak, lockdown, or staged theater first.',
        isCorrect: false,
        rationale:
          'Truth delivery follows emotional peak, lockdown preparation, and Phase Seven sequencing after Trigger Events.'
      }
    ]
  },
  {
    number: 13,
    question: 'How are staged geopolitical tensions positioned in the narrative?',
    hint: 'Recall opposing blocs and the shared script behind simulated WW3.',
    options: [
      {
        text: 'Nations like Russia, Iran, China, and North Korea are positioned against the USA, UK, Israel, and NATO while all sides share the same A.I. script simulating World War III.',
        isCorrect: true,
        rationale:
          'The narrative positions Russia, Iran, China, and North Korea against the USA, UK, Israel, and NATO, while all sides are manipulated by the same A.I. script to simulate World War III.'
      },
      {
        text: 'Only two city-states argue online with no named major powers and no simulated world-war framing.',
        isCorrect: false,
        rationale:
          'Major blocs are named explicitly and framed as the simulated onset of World War III.'
      },
      {
        text: 'Every nation acts with fully independent free will and no shared scripted conflict mechanism.',
        isCorrect: false,
        rationale:
          'All sides are manipulated by the same A.I. script inside the A.I. War Theatre.'
      },
      {
        text: 'Only Phase Six military curfews appear, with no geopolitical bloc narrative at all.',
        isCorrect: false,
        rationale:
          'Staged geopolitical tensions are a core Phase Five mechanic before lockdown deployment.'
      }
    ]
  },
  {
    number: 14,
    question: 'Which incidents are executed as False Flag Escalations?',
    hint: 'Name specific emotionally charged staged operations.',
    options: [
      {
        text: 'Simulated tanker attacks, embassy strikes, and destruction of expendable buildings.',
        isCorrect: true,
        rationale:
          'False Flag Escalations include simulated tanker attacks, embassy strikes, and the destruction of expendable buildings.'
      },
      {
        text: 'Only peaceful trade festivals designed to lower fear and cancel all air raid sirens.',
        isCorrect: false,
        rationale:
          'False flags are emotionally charged escalations, not peace festivals that lower tension.'
      },
      {
        text: 'Only long-term agricultural reforms with no attacks, strikes, or expendable-structure theater.',
        isCorrect: false,
        rationale:
          'The listed tools are tanker attacks, embassy strikes, and expendable building destruction.'
      },
      {
        text: 'Only authentic enemy victories with no simulation and no Whitehat orchestration behind them.',
        isCorrect: false,
        rationale:
          'These incidents are simulated and staged as part of controlled escalation theater.'
      }
    ]
  },
  {
    number: 15,
    question: 'What do logistical and sensory disruptions include?',
    hint: 'Connect sirens, supply chains, panic buying, and markets to stress induction.',
    options: [
      {
        text: 'Phased-in air raid sirens and engineered supply-chain disruptions including panic buying and market drops to induce stress and survival urgency.',
        isCorrect: true,
        rationale:
          'Air raid sirens are phased in and supply-chain disruptions—including panic buying and market drops—are engineered to induce stress and survival urgency.'
      },
      {
        text: 'Unlimited free supply drops that eliminate panic buying and stabilize every market worldwide.',
        isCorrect: false,
        rationale:
          'Disruptions are engineered to induce stress and survival urgency, not to eliminate scarcity pressure.'
      },
      {
        text: 'Only silent policy memos with no sirens, market drops, or public sensory pressure.',
        isCorrect: false,
        rationale:
          'Sirens, supply disruptions, panic buying, and market drops are explicit sensory and logistical tools.'
      },
      {
        text: 'Only post-truth reconstruction logistics after E.B.S. has already completed disclosure.',
        isCorrect: false,
        rationale:
          'These disruptions are Phase Five tools that build fear frequency before lockdown and truth broadcast.'
      }
    ]
  },
  {
    number: 16,
    question: 'How do cyber strikes and blackouts function in Trigger Events?',
    hint: 'Link undersea cables and communication darkness to emergency-channel reliance.',
    options: [
      {
        text: 'Simulated cyber attacks and severing of undersea cables plunge regions into communication darkness, isolating populations and forcing reliance on emergency channels.',
        isCorrect: true,
        rationale:
          'Simulated cyber attacks and severing of undersea cables plunge specific regions into communication darkness, isolating populations and forcing reliance on emergency channels.'
      },
      {
        text: 'They permanently expand open internet access so traditional media never loses audience share.',
        isCorrect: false,
        rationale:
          'The goal is communication darkness and isolation, not expanded open access for traditional media.'
      },
      {
        text: 'They only upgrade entertainment streaming with no isolation effect and no emergency-channel pressure.',
        isCorrect: false,
        rationale:
          'Cyber strikes and cable severing create darkness and force emergency-channel reliance.'
      },
      {
        text: 'They occur only after absolute truth is fully accepted and no fear management remains necessary.',
        isCorrect: false,
        rationale:
          'These tools operate during Phase Five escalation to isolate and stress populations before later truth delivery.'
      }
    ]
  },
  {
    number: 17,
    question: 'What happens in the Alien Invasion Sequence once geopolitical fear peaks?',
    hint: 'Describe holographic fleets, repurposed tech, and sky theater.',
    options: [
      {
        text: 'Holographic fleets and repurposed human technology stage a massive cosmic battle and fake abductions to destabilize remaining trust in 3D reality.',
        isCorrect: true,
        rationale:
          'Once geopolitical fear reaches its apex, holographic fleets and repurposed human technology stage a massive cosmic battle and fake abductions to destabilize remaining trust in 3D reality.'
      },
      {
        text: 'Only written diplomatic notes are released with no sky fleets, battles, or abduction theater.',
        isCorrect: false,
        rationale:
          'The sequence is sky-based holographic and technological staging, not quiet diplomacy alone.'
      },
      {
        text: 'A fully organic alien civilization arrives with no human holographic projection technology involved.',
        isCorrect: false,
        rationale:
          'Project Blue Beam and holographic fleets simulate the invasion; it is staged theater.'
      },
      {
        text: 'Phase Four stand-ins simply continue award ceremonies without any extraterrestrial threat narrative.',
        isCorrect: false,
        rationale:
          'The operation transitions into an extraterrestrial threat after geopolitical fear peaks.'
      }
    ]
  },
  {
    number: 18,
    question: 'How do Trigger Events relate to Narrative Maintenance complacency?',
    hint: 'Name the intentional stressor role of Phase Five.',
    options: [
      {
        text: 'They shatter the complacency established by Narrative Maintenance as the intentional stressor that static stand-in illusion cannot hold forever.',
        isCorrect: true,
        rationale:
          'Trigger Events shatter the complacency established by Narrative Maintenance; Phase Five is the intentional stressor because the Phase Four static illusion cannot hold indefinitely.'
      },
      {
        text: 'They permanently extend Phase Four stand-in calm so no fear frequency is ever generated.',
        isCorrect: false,
        rationale:
          'Phase Five ends complacency and generates fear and confusion frequency, not endless calm.'
      },
      {
        text: 'They have no relationship to Phase Four and begin only after E.B.S. truth is finished.',
        isCorrect: false,
        rationale:
          'Phase Five follows Phase Four directly as the next mechanism after stand-in pacification.'
      },
      {
        text: 'They restore original parasitic leaders so Narrative Maintenance stand-ins become unnecessary.',
        isCorrect: false,
        rationale:
          'Parasitic leaders are already neutralized; Trigger Events escalate consciousness pressure, not restore old rulers.'
      }
    ]
  },
  {
    number: 19,
    question: 'What emotional frequency does Phase Five generate in Sleepers?',
    hint: 'Connect fear and confusion to cracking deep-seated amnesia.',
    options: [
      {
        text: 'The exact frequency of fear and confusion required to crack the deep-seated amnesia of the Sleepers.',
        isCorrect: true,
        rationale:
          'Phase Five generates the exact frequency of fear and confusion required to crack the deep-seated amnesia of the Sleepers.'
      },
      {
        text: 'A permanent tranquil bliss that deepens amnesia and blocks all later truth broadcasts.',
        isCorrect: false,
        rationale:
          'The stressor generates fear and confusion to crack amnesia, not deepen permanent tranquil sleep.'
      },
      {
        text: 'Only economic optimism with no fear, confusion, or consciousness-fracture pressure.',
        isCorrect: false,
        rationale:
          'Market drops and survival urgency support fear frequency, not pure economic optimism.'
      },
      {
        text: 'Exclusive military discipline among already-awakened Resonating Sols with no sleeper targeting.',
        isCorrect: false,
        rationale:
          'The frequency work targets Sleepers still locked in 3D amnesia, not only already-resonating souls.'
      }
    ]
  },
  {
    number: 20,
    question: 'How do Trigger Events open The Lockdown Window?',
    hint: 'Link staged chaos to unquestioned military deployment.',
    options: [
      {
        text: 'Staged chaos provides perfect, unquestioned justification for military forces to deploy into the streets, remove old world police, and enforce lockdown.',
        isCorrect: true,
        rationale:
          'Once Trigger Events hit the desired emotional peak, staged chaos justifies military deployment into the streets, removal of old world police, and physical and informational lockdown.'
      },
      {
        text: 'They cancel all military plans so streets remain empty and traditional police stay fully in charge forever.',
        isCorrect: false,
        rationale:
          'Trigger Events initiate lockdown with visible military deployment and removal of old world police.'
      },
      {
        text: 'They restore corporate media as the sole authority without any street military presence.',
        isCorrect: false,
        rationale:
          'Lockdown enforces physical and informational control preparing for truth broadcast, not corporate media restoration.'
      },
      {
        text: 'They skip lockdown entirely and jump straight to permanent open-border chaos with no containment.',
        isCorrect: false,
        rationale:
          'Emotional peak directly initiates The Lockdown Window as controlled containment after staged chaos.'
      }
    ]
  },
  {
    number: 21,
    question: 'What later phase does this sequence seamlessly prepare?',
    hint: 'Name the truth-delivery phase after lockdown environment is set.',
    options: [
      {
        text: 'Phase Seven, where the E.B.S. delivers the absolute truth into the prepared environment.',
        isCorrect: true,
        rationale:
          'The sequence seamlessly prepares the environment for Phase Seven, where the E.B.S. delivers the absolute truth.'
      },
      {
        text: 'A permanent return to Phase Four stand-in ceremonies with no absolute truth delivery planned.',
        isCorrect: false,
        rationale:
          'The path moves forward into lockdown and Phase Seven E.B.S. truth, not a permanent return to Phase Four.'
      },
      {
        text: 'Phase Two only, restarting covert removals as if Phase Five never escalated public tension.',
        isCorrect: false,
        rationale:
          'After Trigger Events and lockdown, the prepared environment is for Phase Seven truth broadcast.'
      },
      {
        text: 'An endless alien-invasion hologram loop with no Emergency Broadcast System truth phase afterward.',
        isCorrect: false,
        rationale:
          'Alien invasion sequencing destabilizes 3D trust so later E.B.S. absolute truth can be received.'
      }
    ]
  },
  {
    number: 22,
    question: 'What kind of management are Trigger Events described as strategically?',
    hint: 'Focus on psychological frequency control of how the 3D illusion falls.',
    options: [
      {
        text: 'A masterclass in psychological frequency management that destroys the 3D illusion at a manageable pace.',
        isCorrect: true,
        rationale:
          'Deployment of Trigger Events is a masterclass in psychological frequency management ensuring destruction of the 3D illusion occurs at a manageable pace.'
      },
      {
        text: 'A purely physical engineering project with no psychological frequency dimension at all.',
        isCorrect: false,
        rationale:
          'Strategy centers on psychological frequency management of threat, narrative, and mass consciousness.'
      },
      {
        text: 'An unmanaged free-for-all where no architect controls threat, narrative, or pacing.',
        isCorrect: false,
        rationale:
          'Architects of The Great Purge control both the threat and the narrative for managed pacing.'
      },
      {
        text: 'A permanent freeze of the 3D illusion so no fracture, seeking of answers, or truth broadcast occurs.',
        isCorrect: false,
        rationale:
          'The goal is managed destruction of the 3D illusion and alignment toward truth broadcasts.'
      }
    ]
  },
  {
    number: 23,
    question: 'What collapse scenario does controlled Trigger Event pacing prevent?',
    hint: 'Contrast managed escalation with dropping the parasitic overlay without warning.',
    options: [
      {
        text: 'Total, chaotic collapse that would occur if the parasitic overlay were simply dropped without warning.',
        isCorrect: true,
        rationale:
          'Managed pacing prevents the total, chaotic collapse that would occur if the parasitic overlay were simply dropped without warning.'
      },
      {
        text: 'Any possibility of later truth broadcasts, so sleepers remain forever inside the 3D illusion.',
        isCorrect: false,
        rationale:
          'Pacing enables reception of truth broadcasts; it does not block disclosure forever.'
      },
      {
        text: 'Only mild boredom, with no risk of chaos if the overlay were dropped suddenly.',
        isCorrect: false,
        rationale:
          'Sudden drop without warning is framed as risking total chaotic collapse, which pacing prevents.'
      },
      {
        text: 'The need for Resonating Sols and pure signals after the fear peak has already passed.',
        isCorrect: false,
        rationale:
          'Escalating terror ultimately aligns masses to receive pure signals of the Resonating Sols and truth broadcasts.'
      }
    ]
  },
  {
    number: 24,
    question: 'What does escalating terror force in the collective?',
    hint: 'Connect frequency fracture to abandoning false reality and seeking answers.',
    options: [
      {
        text: 'A frequency fracture that compels the masses to abandon their false reality and seek answers.',
        isCorrect: true,
        rationale:
          'Escalating terror forces a frequency fracture, compelling the masses to abandon their false reality and seek answers.'
      },
      {
        text: 'A deeper attachment to the false reality with no seeking of answers or fracture of perception.',
        isCorrect: false,
        rationale:
          'The forced outcome is abandoning false reality and seeking answers, not deeper attachment.'
      },
      {
        text: 'Immediate permanent silence with no public questioning and no later alignment to truth signals.',
        isCorrect: false,
        rationale:
          'Masses are compelled to seek answers and ultimately align to Resonating Sols and truth broadcasts.'
      },
      {
        text: 'Only economic recovery narratives with no consciousness fracture component whatsoever.',
        isCorrect: false,
        rationale:
          'Market drops support stress, but the strategic outcome named is frequency fracture of false reality.'
      }
    ]
  },
  {
    number: 25,
    question: 'What alignment do Trigger Events ultimately prepare in the masses?',
    hint: 'Name the pure signals and broadcasts they become ready to receive.',
    options: [
      {
        text: 'Alignment to receive the pure signals of the Resonating Sols and the impending truth broadcasts.',
        isCorrect: true,
        rationale:
          'Ultimately the process aligns the masses to receive the pure signals of the Resonating Sols and the impending truth broadcasts.'
      },
      {
        text: 'Alignment only to traditional world police and corporate media as permanent authority forever.',
        isCorrect: false,
        rationale:
          'Lockdown removes old world police and prepares E.B.S. truth, not permanent corporate media rule.'
      },
      {
        text: 'Alignment back to fully restored parasitic leadership with no Resonating Sol signal reception.',
        isCorrect: false,
        rationale:
          'Parasitic leaders are neutralized; the end-state alignment is toward Resonating Sols and truth broadcasts.'
      },
      {
        text: 'Alignment to endless Project Blue Beam loops with no path into absolute truth delivery.',
        isCorrect: false,
        rationale:
          'Blue Beam destabilizes 3D trust so truth broadcasts can be received, not as an endless final loop.'
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

const topicImage = 'images/breakdown/trigger-events.webp';
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
    'Test your grasp of Trigger Events — Phase Five controlled escalation, A.I. War Theatre, false flags, Project Blue Beam, and the path into lockdown and truth.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Trigger Events are Phase Five of The Great Purge: controlled escalation that fractures NPC programming through staged wars, false flags, disruptions, and holographic alien theater without total panic. Sit with what you missed, then return to the Trigger Events deep-dive, infographics, and video transmissions. When the emotional peak is reached, staged chaos opens the Lockdown Window and prepares the environment for the E.B.S. absolute truth.'
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
    'Test your understanding of Trigger Events — Phase Five escalation, A.I. War Theatre, false flags, Blue Beam alien theater, and the path into lockdown and E.B.S. truth.'
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
      t.topic_image = topicImage;
      t.title = TOPIC_TITLE;
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('trigger-events not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on Trigger Events: Phase Five controlled escalation, A.I. War Theatre, false flags, Project Blue Beam, and the path into lockdown and absolute truth.'
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
    "  { path: '/quiz/breakdown/narrative-maintenance.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/breakdown/original-realm.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/breakdown/the-purge-phases.html', priority: '0.75', changefreq: 'monthly' },"
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

console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('Correct letter mix:', letterCounts);
console.log('PASS: audited 25/25 against data/breakdown-topics/trigger-events.json');
