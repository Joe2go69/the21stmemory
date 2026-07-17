/**
 * Installs Mass Reveal quiz for breakdown (Mega Breakdown) transmission.
 * Authored from data/breakdown-topics/mass-reveal.json report only.
 * Run: node scripts/install-mass-reveal-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/mass-reveal.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'mass-reveal';
const TOPIC_TITLE = 'Mass Reveal';
const SOURCE = 'breakdown';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const metaVoiceRe =
  /\b(according to the (report|source|text)|the report states|the source (states|specifies|suggests)|the text (states|describes|suggests|explicitly|mentions|defines|calls|focuses)|the material clarifies|mentioned in the (text|source)|source material)\b/i;

const STOCK_TAILS = [
  /,?\s*and that is treated as the entire mechanism\.?/gi,
  /,?\s*stopping the explanation at that boundary alone\.?/gi,
  /,?\s*with no further layer required beyond that account\.?/gi,
  /,?\s*without a larger engineered system underneath\.?/gi,
  /,?\s*as if no adjacent systems participated at all\.?/gi
];

/** options[0] = correct. Support phrases must appear in this topic's report. */
const RAW_QUESTIONS = [
  {
    number: 1,
    question: 'What is the Mass Reveal within the Great Awakening?',
    hint: 'How it is executed and what system it systematically dismantles.',
    support: ['ebs operation', 'emergency broadcast system', 'parasitic system'],
    options: [
      {
        text: 'The critical juncture executed via the EBS Operation—a coordinated military and multidimensional intervention that dismantles the parasitic system and shatters false reality without total societal collapse.',
        rationale:
          'Mass Reveal is the critical Great Awakening juncture via EBS: multi-stage military and multidimensional intervention dismantling the parasitic system and shattering false reality without total societal collapse.'
      },
      {
        text: 'A random weather bulletin with no military coordination and no attempt to dismantle any parasitic system at all.',
        rationale:
          'Mass Reveal is a highly coordinated EBS military and multidimensional operation—not a random weather bulletin.'
      },
      {
        text: 'A permanent media festival that strengthens the parasitic overlay and never seizes global communications.',
        rationale:
          'The operation seizes global communications to broadcast Truth Packages that shatter the overlay—not strengthen it.'
      },
      {
        text: 'A voluntary online poll that lets sleepers vote to keep the false reality fully intact forever.',
        rationale:
          'Mass Reveal broadcasts undeniable Truth Packages to break amnesia and deception—not a poll preserving false reality.'
      }
    ]
  },
  {
    number: 2,
    question: 'What is the Mass Reveal Window?',
    hint: 'Calculated timeframe and what it is designed to fracture.',
    support: ['mass reveal window', 'undeniable truths', 'collective illusion'],
    options: [
      {
        text: 'The calculated timeframe when undeniable truths about the parasitic system and replaced elites are broadcast to purposefully fracture the collective illusion.',
        rationale:
          'The Mass Reveal Window is the calculated timeframe for broadcasting undeniable truths about the parasitic system and replaced elites to fracture the collective illusion.'
      },
      {
        text: 'A permanent blackout with no truth broadcast and no purposeful fracture of any collective illusion.',
        rationale:
          'The window is defined by truth broadcast that fractures the collective illusion—not permanent silence without disclosure.'
      },
      {
        text: 'Only a sports season calendar with no relation to replaced elites or parasitic-system disclosure.',
        rationale:
          'The window centers parasitic-system and replaced-elite truths—not a sports calendar alone.'
      },
      {
        text: 'A private elite meeting that never reaches the public and never fractures any mass illusion.',
        rationale:
          'Truths are broadcast to the public to fracture the collective illusion—not kept in private elite meetings only.'
      }
    ]
  },
  {
    number: 3,
    question: 'What is the E.B.S. (Emergency Broadcast System) in this context?',
    hint: 'Who controls it and what channels it hijacks.',
    support: ['military-controlled', 'whitehats', 'continuous truth broadcasts'],
    options: [
      {
        text: 'The military-controlled communication override Whitehats use to hijack media and internet channels for continuous truth broadcasts.',
        rationale:
          'E.B.S. is the military-controlled override Whitehats use to hijack media and internet channels and deliver continuous truth broadcasts.'
      },
      {
        text: 'A pure civilian streaming app that never hijacks media and never delivers continuous truth content.',
        rationale:
          'E.B.S. is military-controlled channel override for continuous truth—not a civilian streaming app alone.'
      },
      {
        text: 'A parasitic MSM tool that permanently blocks Whitehats from any media or internet control.',
        rationale:
          'Whitehats use E.B.S. to hijack media and internet for truth—not a parasitic tool blocking Whitehats forever.'
      },
      {
        text: 'Only a local weather radio with no military control and no multi-hour Truth Package cycle.',
        rationale:
          'E.B.S. delivers continuous truth broadcasts and 72+ hour Truth Packages—not local weather radio alone.'
      }
    ]
  },
  {
    number: 4,
    question: 'Who are the Whitehats in the Mass Reveal framework?',
    hint: 'Allied forces named with G.A.A. and Space Force.',
    support: ['whitehats', 'g.a.a.', 'space force'],
    options: [
      {
        text: 'Allied military, G.A.A. (Galactic Alliance Association), and Space Force operatives coordinating strategic dismantling of the 3D overlay.',
        rationale:
          'Whitehats are allied military, G.A.A., and Space Force operatives coordinating strategic dismantling of the 3D overlay.'
      },
      {
        text: 'Only random internet forums with no military, G.A.A., or Space Force operational role at all.',
        rationale:
          'Whitehats are operational allied military and G.A.A./Space Force forces—not symbolic forums alone.'
      },
      {
        text: 'The same parasitic elites who run Draco-Grey control without any dismantling of the 3D overlay.',
        rationale:
          'Whitehats dismantle the 3D overlay; they are not the parasitic elite control structure being exposed.'
      },
      {
        text: 'Only NPC background programs that glitch and dissolve when the overlay collapses.',
        rationale:
          'NPCs are soulless background programs; Whitehats are allied military and multidimensional operatives.'
      }
    ]
  },
  {
    number: 5,
    question: 'What are Truth Packages during the EBS phase?',
    hint: 'Duration and awakening purpose of the broadcast streams.',
    support: ['truth packages', '72+ hours', 'mass awakening'],
    options: [
      {
        text: 'Concentrated streams of evidence and disclosure broadcast during EBS, spanning 72+ hours, designed to initiate mass awakening.',
        rationale:
          'Truth Packages are concentrated evidence and disclosure streams during EBS spanning 72+ hours to initiate mass awakening.'
      },
      {
        text: 'Five-minute weather clips with no evidence, no disclosure, and no mass-awakening design at all.',
        rationale:
          'Truth Packages are concentrated multi-hour disclosure streams—not five-minute weather clips.'
      },
      {
        text: 'Private elite archives that never air publicly and never aim to awaken the global population.',
        rationale:
          'Packages are broadcast to the public for mass awakening—not sealed private archives only.'
      },
      {
        text: 'Sports highlight reels that restore parasitic narrative control without any hard-truth content.',
        rationale:
          'Packages deliver evidence and disclosure for awakening—not sports reels restoring parasitic narrative.'
      }
    ]
  },
  {
    number: 6,
    question: 'What must happen in Narrative Maintenance before the EBS takes over?',
    hint: 'Optical replacements for neutralized elites until the exact window.',
    support: ['narrative maintenance', 'clones', 'mimic tech'],
    options: [
      {
        text: 'Clones, stand-ins, digital composites, and advanced mimic tech replace neutralized elites so the illusion holds until the exact Mass Reveal Window.',
        rationale:
          'Before EBS, Narrative Maintenance uses clones, stand-ins, digital composites, and mimic tech to replace neutralized elites until the Mass Reveal Window.'
      },
      {
        text: 'Every elite is openly removed on live television with no clones, stand-ins, or mimic tech cover at all.',
        rationale:
          'Replacement optics maintain the illusion until the exact window—not open day-one removal without cover.'
      },
      {
        text: 'Only weather forecasts continue while no royals, politicians, corporate giants, or religious leaders are optically replaced.',
        rationale:
          'Neutralized elites include royals, politicians, corporate giants, and religious leaders replaced by optical covers.'
      },
      {
        text: 'EBS starts first with no prior narrative cover and no need to hold public optics until a timed window.',
        rationale:
          'Narrative Maintenance precedes EBS takeover so the illusion holds until the calculated Mass Reveal Window.'
      }
    ]
  },
  {
    number: 7,
    question: 'What categories of irrefutable proof do EBS disclosures systematically release?',
    hint: 'Fraud, trafficking, harvesting, and cult crimes with names and faces.',
    support: ['election fraud', 'child organ harvesting', 'satanic cult rituals'],
    options: [
      {
        text: 'Election fraud, human and child trafficking rings, child organ harvesting, and satanic cult rituals—with names, faces, and evidence of former elites’ crimes.',
        rationale:
          'EBS disclosures provide irrefutable proof of election fraud, trafficking rings, child organ harvesting, and satanic cult rituals with names, faces, and evidence.'
      },
      {
        text: 'Only sports scores and weather with no names, faces, or evidence of elite crimes at all.',
        rationale:
          'Disclosures systematically shatter the 3D illusion with hard crime evidence—not sports and weather alone.'
      },
      {
        text: 'Only anonymous rumors without election fraud, trafficking, harvesting, or cult ritual proof.',
        rationale:
          'Broadcasts give irrefutable proof with names, faces, and evidence across those crime categories.'
      },
      {
        text: 'Only praise for the Federal Reserve and vaccines as totally benevolent systems with no outrage expected.',
        rationale:
          'Hard truths include Federal Reserve scam and vaccine depopulation evidence that drive mass outrage and awakening.'
      }
    ]
  },
  {
    number: 8,
    question: 'What does Bloodline Exposure Evidence prove about royals, popes, and presidents?',
    hint: 'Independence versus non-human control influence.',
    support: ['bloodline exposure evidence', 'draco-grey', 'not operating independently'],
    options: [
      {
        text: 'That royal families, popes, and presidents were not operating independently but were controlled by non-human Draco-Grey influence.',
        rationale:
          'Bloodline Exposure Evidence proves royals, popes, and presidents were controlled by non-human Draco-Grey influence rather than operating independently.'
      },
      {
        text: 'That every royal, pope, and president always operated in pure independence with zero non-human influence.',
        rationale:
          'The reveal explicitly shows they were not independent but under Draco-Grey influence.'
      },
      {
        text: 'That only local mayors were exposed while royals, popes, and presidents remained completely unmentioned.',
        rationale:
          'Bloodline Exposure specifically names royal families, popes, and presidents under non-human control.'
      },
      {
        text: 'That Draco-Grey influence is a sports mascot story with no link to global power structures.',
        rationale:
          'Draco-Grey influence is tied to true nature of world power structures—not a sports mascot story.'
      }
    ]
  },
  {
    number: 9,
    question: 'What does Medical and Vaccine Truth release show, and what dual outcome follows?',
    hint: 'Depopulation plans and simultaneous public response.',
    support: ['medical and vaccine truth', 'depopulation plans', 'mass outrage'],
    options: [
      {
        text: 'Hard evidence of deliberate depopulation plans through toxic injections, causing mass outrage and simultaneous mass awakening.',
        rationale:
          'Medical and Vaccine Truth shows deliberate depopulation via toxic injections, driving mass outrage and simultaneous mass awakening.'
      },
      {
        text: 'Proof that all injections were purely healing with no depopulation design and no public outrage expected.',
        rationale:
          'The release shows deliberate depopulation plans through toxic injections—not pure healing without outrage.'
      },
      {
        text: 'Only minor pharmacy paperwork with no hard evidence and no link to mass awakening at all.',
        rationale:
          'Hard evidence of depopulation plans causes mass outrage and mass awakening—not minor paperwork alone.'
      },
      {
        text: 'A permanent ban on all tribunals so vaccine crimes never face arrests or confessions afterward.',
        rationale:
          'Mass Reveal leads into Phase 8 Truth Tribunals, arrests, and confessions—not a permanent ban on accountability.'
      }
    ]
  },
  {
    number: 10,
    question: 'What is Phase 5: Trigger Events designed to do?',
    hint: 'Geopolitical tools that push questioning without full panic.',
    support: ['trigger events', 'air raid sirens', 'without inciting full panic'],
    options: [
      {
        text: 'Deploy geopolitical tensions, air raid sirens, and staged supply disruptions to push the public to question everything without inciting full panic.',
        rationale:
          'Phase 5 Trigger Events use geopolitical tensions, air raid sirens, and staged supply disruptions to start awakening questioning without full panic.'
      },
      {
        text: 'Cancel all geopolitical tension so the public never questions anything and never begins awakening.',
        rationale:
          'Trigger Events push the public to the edge of questioning everything—not cancel tension into permanent sleep.'
      },
      {
        text: 'Start full EBS hard truths on hour zero with no sirens, no supply disruptions, and no staged edge of questioning.',
        rationale:
          'Trigger Events precede lockdown and EBS; they stage edge-of-questioning conditions before full flood-gate truths.'
      },
      {
        text: 'Only open mothership skies first so masses interpret contact as invasion with no prior conditioning.',
        rationale:
          'Scare events come before EBS conditioning; sky opening before EBS would collapse masses into invasion fear.'
      }
    ]
  },
  {
    number: 11,
    question: 'What happens in Phase 6: The Lockdown Window?',
    hint: 'Visible military role and communications environment for truth.',
    support: ['lockdown window', 'military becomes visible', 'communications blackout'],
    options: [
      {
        text: 'Military becomes visible in the streets to maintain order, replacing the world police, while a global communications blackout severs main internet cables for a controlled truth-broadcast environment.',
        rationale:
          'Phase 6 places visible military for order, replacing world police, and creates global communications blackout by severing main cables for controlled truth broadcast.'
      },
      {
        text: 'All military vanishes and every cable stays online so parasitic media can spin every truth claim freely.',
        rationale:
          'Military becomes visible and cables are severed to control the environment—not vanish with open parasitic spin.'
      },
      {
        text: 'Only sports stadiums close while police remain fully in charge and internet never goes dark.',
        rationale:
          'Military replaces world police visibility and main internet cables are severed—not sports-only limited lockdown.'
      },
      {
        text: 'EBS hard bloodline truths air first with no street military and no communications blackout cover.',
        rationale:
          'Lockdown and blackout create the controlled environment before and around the EBS flood-gate sequence.'
      }
    ]
  },
  {
    number: 12,
    question: 'What defines The Cut (Hour 0–12) in the 72-Hour Fracture Timeline?',
    hint: 'Communications status and blame narratives on mainstream channels.',
    support: ['hour 0–12', 'communications go dark', 'russia, china, iran'],
    options: [
      {
        text: 'Internet and communications go dark while mainstream channels flood with panic and blame narratives aimed at Russia, China, and Iran.',
        rationale:
          'The Cut (0–12) darkens internet and communications and floods mainstream channels with panic and blame toward Russia, China, and Iran.'
      },
      {
        text: 'Internet stays fully online with calm MSM and zero panic-blame narratives toward any geopolitical actor.',
        rationale:
          'The Cut darkens communications and floods channels with panic-blame—not calm full-online MSM.'
      },
      {
        text: 'Only soft EBS reassurance airs with “STAY CALM YOU ARE SAFE” and no dark cables at all.',
        rationale:
          'Soft reassurance is Phase 7 EBS sequence content; The Cut is cable dark and panic-blame flooding.'
      },
      {
        text: 'Motherships uncloak immediately with no false-flag wobble stage and no cable blackout first.',
        rationale:
          'Sky opening comes after EBS conditioning; The Cut is early blackout panic-blame, not immediate uncloaking.'
      }
    ]
  },
  {
    number: 13,
    question: 'What defines The Wave (Hour 12–36)?',
    hint: 'Crowd locations and how NPC programming behaves.',
    support: ['hour 12–36', 'supermarkets and fuel stations', 'npc programming'],
    options: [
      {
        text: 'Crowd surges hit supermarkets and fuel stations while NPC programming severely glitches—some lashing out, others going dazed.',
        rationale:
          'The Wave (12–36) brings supermarket and fuel-station surges and severe NPC glitching with aggression or dazed shutdown.'
      },
      {
        text: 'Every store stays empty and calm while NPC programming becomes perfectly stable and helpful.',
        rationale:
          'The Wave is crowd surges and severe NPC glitching—not empty calm stores with perfect NPC stability.'
      },
      {
        text: 'Only Truth Tribunals finish every confession with no crowd surges and no NPC glitch signs at all.',
        rationale:
          'Tribunals belong to Phase 8 aftermath; The Wave is survival surges and NPC glitching in the fracture timeline.'
      },
      {
        text: 'Only seeded-sols revelation airs while no one scrambles for fuel or food at any station.',
        rationale:
          'Seeded Sols revelation is inside Phase 7 EBS hard-truth sequence; The Wave is physical surge and NPC glitch.'
      }
    ]
  },
  {
    number: 14,
    question: 'What defines Opening Hour (Hour 36–72)?',
    hint: 'False flags, truth leak, and environmental fracture signs.',
    support: ['hour 36–72', 'false flag narratives', 'a.i. scaffolding'],
    options: [
      {
        text: 'False flag narratives wobble and fall; truth leaks with a physical Frequency Fracture—static buildup, ringing ears, and electronics flickering as A.I. Scaffolding crumbles.',
        rationale:
          'Opening Hour (36–72) wobbles false flags, leaks truth, and brings Frequency Fracture signs as A.I. Scaffolding crumbles.'
      },
      {
        text: 'False flags become permanently unchallengeable while electronics never flicker and no Frequency Fracture is felt.',
        rationale:
          'False flags fall and environmental fracture signs appear—not permanent false flags without glitch.'
      },
      {
        text: 'Only soft reassurance repeats forever with no hard truths and no physical environmental response.',
        rationale:
          'Opening Hour is truth leak and physical fracture signs; hard truths continue in the EBS flood-gate sequence.'
      },
      {
        text: 'Only Stage 3 sky opening happens first with no false-flag collapse and no A.I. Scaffolding crumble signs.',
        rationale:
          'Sky opening is Stage 3 after truth is absorbed; Opening Hour is false-flag fall and fracture signs first.'
      }
    ]
  },
  {
    number: 15,
    question: 'What is Phase 7: EBS — The Flood Gates?',
    hint: 'Who takes airwaves and how long the broadcast cycle runs.',
    support: ['flood gates', '72+ hour', 'total control of the airwaves'],
    options: [
      {
        text: 'The military takes total control of the airwaves for a 72+ hour broadcast cycle with a calibrated soft-to-hard truth sequence.',
        rationale:
          'Phase 7 Flood Gates: military takes total airwave control for a 72+ hour calibrated broadcast cycle.'
      },
      {
        text: 'Parasitic MSM keeps total airwave control with zero military takeover and zero 72+ hour truth cycle.',
        rationale:
          'Military takes total control of the airwaves for continuous truth—not parasitic MSM remaining in control.'
      },
      {
        text: 'Only five minutes of static with no reassurance, no hard truths, and no seeded-sols revelation.',
        rationale:
          'The cycle is 72+ hours with sequenced reassurance, hard truths, and seeded-sols revelation.'
      },
      {
        text: 'Only private radio for elites with no public airwave control and no mass Truth Package delivery.',
        rationale:
          'Flood Gates seize public airwaves for mass Truth Packages—not elite-only private radio.'
      }
    ]
  },
  {
    number: 16,
    question: 'What is the Immediate Reassurance message at the start of the EBS sequence?',
    hint: 'Soft truths first and the exact calm-and-safety framing.',
    support: ['immediate reassurance', 'stay calm you are safe', 'military control active'],
    options: [
      {
        text: 'Soft truths first to avoid immediate trauma, with the message: “STAY CALM YOU ARE SAFE, MILITARY CONTROL ACTIVE TO PROTECT YOU”.',
        rationale:
          'Immediate Reassurance presents soft truths first; the initial message is stay calm, you are safe, military control active to protect you.'
      },
      {
        text: 'Hardest bloodline and harvesting evidence first with no calm message and no military-protection framing.',
        rationale:
          'Sequence is soft reassurance first to avoid immediate trauma—not hardest crimes first without calm framing.'
      },
      {
        text: 'Only weather updates with no stay-calm message and no claim of protective military control.',
        rationale:
          'The initial message explicitly reassures safety under active protective military control.'
      },
      {
        text: 'Silence for 72 hours so sleepers never hear any soft or hard truth content at all.',
        rationale:
          'EBS begins continuous calibrated broadcast—not 72 hours of silence without soft truths.'
      }
    ]
  },
  {
    number: 17,
    question: 'What do Hard Truths cover once the EBS broadcast shifts past reassurance?',
    hint: 'Corruption themes including money system, medical, trafficking, and bloodlines.',
    support: ['hard truths', 'federal reserve scam', 'bloodlines'],
    options: [
      {
        text: 'Corruption exposure including the Federal Reserve scam, vaccines, trafficking, and bloodlines.',
        rationale:
          'Hard Truths shift the broadcast to expose corruption, the Federal Reserve scam, vaccines, trafficking, and bloodlines.'
      },
      {
        text: 'Only sports scores and celebrity gossip with no Federal Reserve, vaccine, trafficking, or bloodline content.',
        rationale:
          'Hard Truths target corruption systems and crimes—not sports and gossip alone.'
      },
      {
        text: 'Only soft weather reassurance repeated without any scam, vaccine, or trafficking disclosure.',
        rationale:
          'Hard Truths move past soft reassurance into systemic corruption and crime exposure.'
      },
      {
        text: 'Only praise for former elites with zero names, faces, or evidence of crimes.',
        rationale:
          'Disclosures include names, faces, and evidence of crimes by former elites—not praise without proof.'
      }
    ]
  },
  {
    number: 18,
    question: 'What does the Seeded Sols Revelation disclose about figures like Diana, Barron, and JFK Jr.?',
    hint: 'Why highly evolved sols were placed into bloodlines.',
    support: ['seeded sols revelation', 'diana, barron, and jfk jr.', 'fracture the parasitic system'],
    options: [
      {
        text: 'That key figures such as Diana, Barron, and JFK Jr. were highly evolved sols seeded into bloodlines to fracture the parasitic system from the inside.',
        rationale:
          'Seeded Sols Revelation shows figures like Diana, Barron, and JFK Jr. were highly evolved sols seeded into bloodlines to fracture the parasitic system from within.'
      },
      {
        text: 'That those figures were only ordinary NPCs with no seeded soul role and no internal fracture mission.',
        rationale:
          'They are revealed as highly evolved seeded sols with an inside fracture mission—not ordinary NPCs.'
      },
      {
        text: 'That no named individuals were ever seeded and bloodlines never contained any internal fracture agents.',
        rationale:
          'The broadcast specifically names seeded highly evolved sols inside bloodlines for internal fracture.'
      },
      {
        text: 'That seeding only happened after Stage 3 sky opening with no EBS mention during Flood Gates.',
        rationale:
          'Seeded Sols Revelation is part of the Phase 7 EBS calibrated sequence—not only a post-sky-opening footnote.'
      }
    ]
  },
  {
    number: 19,
    question: 'What precise order must the Mass Reveal follow?',
    hint: 'Scare, cut, EBS, lockdowns, then revelation sequence.',
    support: ['scare events', 'communications cut', 'the revelation'],
    options: [
      {
        text: 'Scare Events, then Communications Cut, then EBS, then Lockdowns, and finally The Revelation.',
        rationale:
          'Mass Reveal order is Scare Events, Communications Cut, EBS, Lockdowns, then The Revelation.'
      },
      {
        text: 'Sky opens first, then EBS, then scare events last with no communications cut at any point.',
        rationale:
          'Sky opening before EBS conditioning would be read as alien invasion; order starts with scare and cut before full revelation stage.'
      },
      {
        text: 'EBS hard truths alone with no scare events, no communications cut, and no lockdown environment.',
        rationale:
          'Without preceding WW3 Scare or BlueBeam illusions, sleepers would ignore broadcasts; order includes scare and cut.'
      },
      {
        text: 'Only random simultaneous chaos with no sequenced Scare, Cut, EBS, Lockdown, Revelation path.',
        rationale:
          'The operation requires a precise order—not unstructured simultaneous chaos without sequence.'
      }
    ]
  },
  {
    number: 20,
    question: 'Why must EBS condition the public before the sky opens?',
    hint: 'How unconditioned masses would misread the sky event.',
    support: ['sky were to open', 'alien invasion', 'collapse into fear'],
    options: [
      {
        text: 'If the sky opened before EBS conditioning, the masses would interpret it as an alien invasion and collapse into fear.',
        rationale:
          'If the sky opened before EBS conditioned the public, masses would read it as alien invasion and collapse into fear.'
      },
      {
        text: 'Because sky opening first always creates instant calm resonance with zero fear and zero misinterpretation.',
        rationale:
          'Without EBS conditioning first, sky opening triggers invasion fear collapse—not instant calm resonance.'
      },
      {
        text: 'Because EBS is optional and sky opening alone is always enough for sleepers to accept truth calmly.',
        rationale:
          'Without preceding scare/BlueBeam context, sleepers ignore EBS; order and conditioning are required.'
      },
      {
        text: 'Because motherships must stay cloaked forever and the sky must never open after truth is absorbed.',
        rationale:
          'After truth is absorbed and the veil thins, Stage 3 opens the sky with uncloaking motherships and Crystalline Arks.'
      }
    ]
  },
  {
    number: 21,
    question: 'Why are preceding WW3 Scare or Project BlueBeam illusions necessary for EBS success?',
    hint: 'What sleepers would do if EBS played without those preceding events.',
    support: ['ww3 scare', 'project bluebeam', 'sleepers would simply ignore'],
    options: [
      {
        text: 'Without preceding WW3 Scare or Project BlueBeam illusions, Sleepers would simply ignore the EBS broadcasts.',
        rationale:
          'If EBS played without preceding WW3 Scare or Project BlueBeam illusions, Sleepers would simply ignore the broadcasts.'
      },
      {
        text: 'Because Sleepers always watch every EBS hour attentively even with no scare events and no BlueBeam stage.',
        rationale:
          'Without those preceding illusions/scares, Sleepers ignore EBS—attention is not automatic.'
      },
      {
        text: 'Because BlueBeam permanently cancels EBS so no truth packages can ever air afterward.',
        rationale:
          'BlueBeam and scare events prepare attention for EBS; they do not permanently cancel truth broadcasts.'
      },
      {
        text: 'Because WW3 Scare only entertains NPCs and never affects whether Sleepers heed EBS content.',
        rationale:
          'Preceding scare/BlueBeam is required so Sleepers do not ignore EBS—central to conditioning order.'
      }
    ]
  },
  {
    number: 22,
    question: 'How does the environment respond as truth broadcasts intensify the Frequency Fracture?',
    hint: 'Sky, air, and how false density constructs leave.',
    support: ['skies will look mutated', 'air will feel thicker', 'frequency collapse'],
    options: [
      {
        text: 'Skies look mutated, the air feels thicker, and false density constructs begin to vanish through Frequency Collapse rather than physical demolition.',
        rationale:
          'As Frequency Fracture intensifies, skies look mutated, air feels thicker, and false density constructs vanish via Frequency Collapse—not physical demolition.'
      },
      {
        text: 'Skies stay perfectly normal, air never thickens, and every false density construct remains solid forever.',
        rationale:
          'Environment physically responds with mutated skies, thicker air, and vanishing density constructs.'
      },
      {
        text: 'Only physical demolition crews knock down buildings while frequency plays no role in construct vanishing.',
        rationale:
          'False density constructs vanish through Frequency Collapse rather than physical demolition.'
      },
      {
        text: 'Only bank software glitches while sky, air, and density constructs show zero physical response.',
        rationale:
          'The environment physically responds—sky, air, and density constructs—not bank software alone.'
      }
    ]
  },
  {
    number: 23,
    question: 'What does Phase 8: Aftermath and Stabilization bring after false reality is shattered?',
    hint: 'Tribunals and outcomes for the world’s most trusted figures.',
    support: ['phase 8', 'truth tribunals', 'arrests, and confessions'],
    options: [
      {
        text: 'Public and behind-the-scenes Truth Tribunals, arrests, and confessions of the world’s most trusted figures.',
        rationale:
          'Phase 8 Aftermath and Stabilization brings public and behind-the-scenes Truth Tribunals, arrests, and confessions of the world’s most trusted figures.'
      },
      {
        text: 'Permanent immunity for every elite with no tribunals, no arrests, and no confessions at all.',
        rationale:
          'Phase 8 produces tribunals, arrests, and confessions—not permanent elite immunity.'
      },
      {
        text: 'Only soft weather reassurance forever with no judicial finality after the EBS window ends.',
        rationale:
          'Aftermath includes Truth Tribunals and accountability—not endless soft weather-only messaging.'
      },
      {
        text: 'Immediate Stage 3 sky opening with no tribunal process and no choice-of-alignment pressure first.',
        rationale:
          'Shattering forces ultimate alignment choice and Phase 8 tribunals; Stage 3 follows once truth is absorbed and the veil thins.'
      }
    ]
  },
  {
    number: 24,
    question: 'What happens in Stage 3: The Revelation after truth is absorbed and the veil thins?',
    hint: 'Sky event and what craft types uncloak as higher density bleeds through.',
    support: ['stage 3', 'motherships and crystalline arks', 'higher density reality'],
    options: [
      {
        text: 'The sky opens; Motherships and Crystalline Arks uncloak as higher density reality bleeds through the shattered overlay.',
        rationale:
          'Stage 3 Revelation: sky opens and Motherships and Crystalline Arks uncloak as higher density reality bleeds through the shattered overlay.'
      },
      {
        text: 'The sky permanently seals and no Motherships or Crystalline Arks ever uncloak after truth absorption.',
        rationale:
          'After truth is absorbed and the veil thins, the sky opens with uncloaking craft—not permanent seal.'
      },
      {
        text: 'Only NPC drones appear while higher density reality never bleeds through the shattered overlay.',
        rationale:
          'Motherships and Crystalline Arks uncloak as higher density bleeds through—not NPC drones alone.'
      },
      {
        text: 'Only Phase 5 sirens continue forever with no sky opening and no craft uncloaking stage.',
        rationale:
          'Stage 3 is sky opening and craft uncloaking after truth absorption—not endless Phase 5 sirens alone.'
      }
    ]
  },
  {
    number: 25,
    question: 'What do Resonating Army awakened sols do at the peak of Stage 3 Revelation?',
    hint: 'Harmonic role guiding masses from shock toward home.',
    support: ['resonating army', 'harmonic tone', 'return home'],
    options: [
      {
        text: 'They step fully into their power, using harmonic tone to guide the masses from shock into absolute resonance and return home.',
        rationale:
          'At peak Revelation, the Resonating Army steps fully into power and uses harmonic tone to guide masses from shock into absolute resonance and return home.'
      },
      {
        text: 'They shut down completely and refuse any harmonic guidance until every sleeper remains in permanent shock.',
        rationale:
          'Awakened sols actively guide from shock into resonance and home—not permanent shutdown leaving shock.'
      },
      {
        text: 'They only rewrite MSM panic scripts so the parasitic overlay regains full control after uncloaking.',
        rationale:
          'Their role is harmonic guidance into resonance and home as the overlay is already shattered—not restoring parasitic control.'
      },
      {
        text: 'They only manage supermarket restocks with no harmonic tone and no guidance of the masses at peak reveal.',
        rationale:
          'Peak role is harmonic guidance of the masses into resonance and return home—not supermarket logistics alone.'
      }
    ]
  }
];

function stripStockTails(s) {
  let t = String(s || '');
  for (const re of STOCK_TAILS) t = t.replace(re, '');
  t = t.replace(/[\s,;:—–-]+$/g, '').trim();
  if (t.length > 12 && !/[.!?…]$/.test(t)) t += '.';
  return t.replace(/[ \t]{2,}/g, ' ').trim();
}

function buildQuestions() {
  return RAW_QUESTIONS.map((q) => {
    const rawOptions = q.options.map((o, i) => ({
      text: stripStockTails(o.text),
      isCorrect: i === 0,
      rationale: stripStockTails(o.rationale)
    }));

    const finalized = finalizeOptions(rawOptions, `${TOPIC_ID}-${q.number}`);

    const out = {
      number: q.number,
      question: q.question,
      options: finalized.options.map((o) => ({
        ...o,
        text: stripStockTails(o.text),
        rationale: stripStockTails(o.rationale)
      })),
      hint: q.hint,
      correctAnswer: finalized.correctAnswer
    };

    const correct = out.options.find((o) => o.isCorrect);
    out.correctAnswer = correct.label;

    const blob = [
      out.question,
      out.hint,
      ...out.options.map((o) => `${o.text} ${o.rationale}`)
    ].join('\n');

    if (latexRe.test(blob) || /\$/.test(blob)) {
      throw new Error(`Q${q.number}: LaTeX/$ markup found`);
    }
    if (metaVoiceRe.test(blob)) {
      throw new Error(
        `Q${q.number}: meta/report voice still present: ${blob.match(metaVoiceRe)?.[0]}`
      );
    }

    const missing = (q.support || []).filter(
      (p) => !reportLower.includes(p.toLowerCase())
    );
    if (missing.length) {
      throw new Error(
        `Q${q.number}: report does not support phrases: ${missing.join('; ')}`
      );
    }

    if (out.options.length !== 4) throw new Error(`Q${q.number}: need 4 options`);
    if (out.options.filter((o) => o.isCorrect).length !== 1) {
      throw new Error(`Q${q.number}: need exactly 1 correct`);
    }
    for (const o of out.options) {
      if (!o.rationale || o.rationale.length < 8) {
        throw new Error(`Q${q.number}${o.label}: short rationale`);
      }
    }
    return out;
  });
}

const questions = buildQuestions();
if (questions.length !== 25) {
  throw new Error(`Expected 25 questions, got ${questions.length}`);
}

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

const topicImage = 'images/breakdown/mass-reveal.webp';
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
    'Test your grasp of Mass Reveal — EBS Flood Gates, Narrative Maintenance, 72-hour fracture timeline, Truth Packages, and Stage 3 Revelation.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Mass Reveal is the EBS-driven shattering of false reality—Narrative Maintenance into Trigger Events, Lockdown, the 72-hour fracture, Flood Gates truth, and Phase 8 tribunals. Sit with what you missed, then return to the Mass Reveal deep-dive, infographics, and video transmissions. When truth is absorbed and the veil thins, the sky opens: Motherships and Crystalline Arks uncloak, and the Resonating Army guides the masses from shock into resonance and home.'
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
    'Test your understanding of Mass Reveal — EBS Operation, Truth Packages, phased sequence, Bloodline and Vaccine Truth, and Stage 3 Revelation.'
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
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('mass-reveal not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on Mass Reveal: EBS Flood Gates, Narrative Maintenance, 72-hour fracture timeline, Truth Packages, and Stage 3 Revelation.'
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

console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('Correct letter mix:', letterCounts);
console.log('PASS: audited 25/25 against data/breakdown-topics/mass-reveal.json');
