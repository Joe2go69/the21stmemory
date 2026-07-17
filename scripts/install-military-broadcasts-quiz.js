/**
 * Installs Military Broadcasts quiz for breakdown (Mega Breakdown) transmission.
 * Authored from data/breakdown-topics/military-broadcasts.json report only.
 * Run: node scripts/install-military-broadcasts-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/military-broadcasts.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'military-broadcasts';
const TOPIC_TITLE = 'Military Broadcasts';
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
    question: 'What is the EBS Operation in the Military Broadcasts framework?',
    hint: 'Who coordinates it and what overlay it dismantles.',
    support: ['ebs operation', 'white hats', 'parasitic overlay'],
    options: [
      {
        text: 'A highly synchronized multi-stage intervention by White Hats and allied military forces to dismantle the Parasitic Overlay and awaken humanity.',
        rationale:
          'EBS Operation is a highly synchronized multi-stage intervention coordinated by White Hats and allied military to dismantle the Parasitic Overlay and awaken humanity.'
      },
      {
        text: 'A random weather bulletin with no White Hat role and no attempt to dismantle any Parasitic Overlay at all.',
        rationale:
          'EBS is a synchronized multi-stage White Hat and military intervention—not a random weather bulletin.'
      },
      {
        text: 'A permanent MSM-only campaign that strengthens the Parasitic Overlay without any military airwave control.',
        rationale:
          'Military seizes airwaves to bypass MSM and dismantle the overlay—not permanent MSM strengthening of the overlay.'
      },
      {
        text: 'A voluntary online poll that lets sleepers vote to keep false reality fully intact forever.',
        rationale:
          'EBS forces absorption of Truth Packages under controlled blackout and protection—not a voluntary poll preserving illusion.'
      }
    ]
  },
  {
    number: 2,
    question: 'What triggers military seizure of complete airwave control?',
    hint: 'Staged crises before bypassing MSM with Truth Packages.',
    support: ['staged geopolitical crises', 'mainstream media', 'truth packages'],
    options: [
      {
        text: 'A series of staged geopolitical crises, after which the military seizes complete airwave control to bypass MSM and deliver undeniable Truth Packages.',
        rationale:
          'After staged geopolitical crises, the military seizes complete airwave control to bypass traditional MSM and deliver undeniable Truth Packages.'
      },
      {
        text: 'Calm peacetime with zero staged crises so MSM keeps total control and no Truth Packages ever air.',
        rationale:
          'Seizure follows staged geopolitical crises for Truth Package delivery—not calm peacetime MSM permanence.'
      },
      {
        text: 'Only a sports season restart with no airwave seizure and no bypass of traditional Mainstream Media.',
        rationale:
          'Military seizes airwaves to bypass MSM for disclosures—not a sports restart without seizure.'
      },
      {
        text: 'Only bank software updates with no geopolitical scare staging and no public Truth Package delivery.',
        rationale:
          'Staged geopolitical crises prepare focus for military Truth Packages—not bank updates alone.'
      }
    ]
  },
  {
    number: 3,
    question: 'How does the operation keep the public absorbing disclosures without total societal collapse?',
    hint: 'Blackout plus physical protection together.',
    support: ['communications blackout', 'physical military protection', 'societal collapse'],
    options: [
      {
        text: 'Through a massive communications blackout and physical military protection that force absorption of critical disclosures without inciting total societal collapse.',
        rationale:
          'The operation uses a massive communications blackout and physical military protection so the population absorbs critical disclosures without total societal collapse.'
      },
      {
        text: 'Through permanent open MSM spin with zero blackout and zero military protection during disclosure.',
        rationale:
          'Blackout and military protection force absorption—not permanent open MSM spin without cover.'
      },
      {
        text: 'Through intentional full-scale riots with no blackout and no protective street presence at all.',
        rationale:
          'Design prevents total collapse via blackout and protection—not intentional full-scale riots.'
      },
      {
        text: 'Through five-minute weather clips only with no critical disclosures and no controlled absorption environment.',
        rationale:
          'Truth Packages run over 72 hours under controlled blackout and protection—not five-minute weather clips alone.'
      }
    ]
  },
  {
    number: 4,
    question: 'What is the EBS Operation as defined in key terminology?',
    hint: 'Multi-stage activation and who commandeers channels.',
    support: ['multi-stage activation', 'commandeer all media', 'suppressed truths'],
    options: [
      {
        text: 'A multi-stage activation where military and White Hat forces commandeer all media and internet channels to broadcast suppressed truths globally.',
        rationale:
          'EBS Operation is multi-stage activation where military and White Hats commandeer all media and internet to broadcast suppressed truths to the global population.'
      },
      {
        text: 'A single five-minute local radio test with no media commandeering and no global suppressed-truth broadcast.',
        rationale:
          'EBS is multi-stage global channel commandeering for suppressed truths—not a five-minute local test alone.'
      },
      {
        text: 'A pure civilian app that never commandeers media and never airs continuous suppressed truths.',
        rationale:
          'Military and White Hats commandeer media and internet—not a pure civilian app without takeover.'
      },
      {
        text: 'A permanent parasitic tool that blocks all suppressed truths from ever reaching the public.',
        rationale:
          'EBS broadcasts suppressed truths to the public—not a tool permanently blocking them.'
      }
    ]
  },
  {
    number: 5,
    question: 'What are Truth Packages during the EBS?',
    hint: 'Duration and categories of evidence released continuously.',
    support: ['72 hours', 'undeniable evidence', 'human trafficking'],
    options: [
      {
        text: 'Over 72 hours of undeniable evidence and disclosures on corruption, human trafficking, and true global control structures, broadcast continuously during the EBS.',
        rationale:
          'Truth Packages are over 72 hours of undeniable evidence and disclosures revealing corruption, human trafficking, and true global control structures, broadcast continuously.'
      },
      {
        text: 'Five-minute sports scores with no corruption evidence and no continuous EBS disclosure cycle.',
        rationale:
          'Packages are 72+ hours of continuous hard evidence—not five-minute sports scores.'
      },
      {
        text: 'Private elite archives that never air publicly and never address trafficking or global control structures.',
        rationale:
          'Packages are broadcast to the public during EBS—not sealed private archives only.'
      },
      {
        text: 'Only weather maps with zero election-fraud or Federal Reserve content in any window.',
        rationale:
          'Hard truths include election fraud, Federal Reserve scam, trafficking, and more—not weather maps alone.'
      }
    ]
  },
  {
    number: 6,
    question: 'Who are the White Hats in this transmission?',
    hint: 'Human and off-world allies including G.A.A. and Space Force.',
    support: ['white hats', 'global alliance army', 'space force'],
    options: [
      {
        text: 'Allied human and off-world forces, including the Global Alliance Army (G.A.A.) and Space Force, executing the EBS and dismantling parasitic control systems.',
        rationale:
          'White Hats are allied human and off-world forces including G.A.A. and Space Force, responsible for executing EBS and dismantling parasitic control systems.'
      },
      {
        text: 'Only random internet forums with no G.A.A., Space Force, or EBS execution role at all.',
        rationale:
          'White Hats are operational allied forces executing EBS—not symbolic forums alone.'
      },
      {
        text: 'The same parasitic elites who run global control without any dismantling of control systems.',
        rationale:
          'White Hats dismantle parasitic control systems—not the parasitic elite structure being exposed.'
      },
      {
        text: 'Only NPC background programs that dissolve when the overlay collapses with no military role.',
        rationale:
          'White Hats are human and off-world allied forces; NPCs are not the executors of EBS.'
      }
    ]
  },
  {
    number: 7,
    question: 'What is the Communications Cut/Blackout designed to prevent?',
    hint: 'What parasitic forces must not do before EBS activation.',
    support: ['communications cut', 'twisting the narrative', 'prior to the ebs'],
    options: [
      {
        text: 'Parasitic forces twisting the narrative before EBS activation, via deliberate severing of internet and traditional media lines.',
        rationale:
          'Communications Cut/Blackout deliberately severs internet and traditional media lines to prevent parasitic forces from twisting the narrative before EBS activation.'
      },
      {
        text: 'Any Truth Package from airing by permanently restoring full parasitic MSM spin with zero cable cuts.',
        rationale:
          'Blackout prevents narrative twisting so Truth Packages can land—not permanent MSM restore blocking EBS.'
      },
      {
        text: 'Only sports blackouts with no internet severing and no pre-EBS narrative-protection purpose.',
        rationale:
          'Cut severs internet and traditional media for pre-EBS narrative control—not sports-only blackouts.'
      },
      {
        text: 'Only local radio silence while global internet stays fully open for parasitic counter-spin forever.',
        rationale:
          'Major internet cables and traditional communications go dark—not open global internet for counter-spin.'
      }
    ]
  },
  {
    number: 8,
    question: 'What are Military Stabilization Lockdowns?',
    hint: 'Street presence purpose during EBS absorption.',
    support: ['military stabilization lockdowns', 'maintain order', 'safely absorb'],
    options: [
      {
        text: 'Protective measures placing military personnel on the streets during EBS to maintain order so the public can safely absorb disclosures.',
        rationale:
          'Military Stabilization Lockdowns place personnel on the streets to maintain order and allow the public to safely absorb disclosures.'
      },
      {
        text: 'Parasitic control lockdowns of the past designed solely to harvest fear with no absorption-protection purpose.',
        rationale:
          'Military presence is strictly for civilian protection and stabilization, contrasting parasitic control lockdowns of the past.'
      },
      {
        text: 'Total military withdrawal with empty streets and no order maintenance during the broadcast window.',
        rationale:
          'Personnel are on the streets to maintain order—not total withdrawal without protection.'
      },
      {
        text: 'Only bank holidays with fully open chaotic crowds and no military street presence at all.',
        rationale:
          'Lockdowns provide physical environment against surging-crowd chaos—not open chaotic non-military holidays.'
      }
    ]
  },
  {
    number: 9,
    question: 'What are Scare Events in pre-EBS design?',
    hint: 'Staged crises that force attention to emergency broadcasts.',
    support: ['scare events', 'world war iii', 'financial collapse'],
    options: [
      {
        text: 'Staged crises such as simulated World War III and financial collapse designed to stress the public into paying full attention to the emergency broadcasts.',
        rationale:
          'Scare Events are staged crises such as simulated WW3 and financial collapse designed to stress the public into full attention to emergency broadcasts.'
      },
      {
        text: 'Genuine unscripted wars with no staging and no design to focus attention on EBS at all.',
        rationale:
          'Scare Events are staged crises designed for attention to EBS—not framed as unscripted non-catalyst wars alone.'
      },
      {
        text: 'Only calm market holidays that encourage the public to ignore every emergency broadcast entirely.',
        rationale:
          'Scare Events stress the public into paying full attention—not calm holidays that encourage ignoring EBS.'
      },
      {
        text: 'Only sports finals with no WW3 simulation and no financial-collapse stress component.',
        rationale:
          'Named examples include simulated WW3 and financial collapse—not sports finals alone.'
      }
    ]
  },
  {
    number: 10,
    question: 'What is the EBS beyond a mere emergency alert?',
    hint: 'Psychological and energetic weapon framing against Sleepers and NPCs.',
    support: ['ultimate psychological and energetic weapon', 'false reality', 'sleepers and npcs'],
    options: [
      {
        text: 'The ultimate psychological and energetic weapon deployed to shatter the False Reality of Sleepers and NPCs in one decisive blow.',
        rationale:
          'EBS is not a mere emergency alert; it is the ultimate psychological and energetic weapon to shatter False Reality of Sleepers and NPCs in one decisive blow.'
      },
      {
        text: 'A minor weather warning with no psychological impact and no shatter of any False Reality at all.',
        rationale:
          'EBS is the ultimate weapon for decisive False Reality shatter—not a minor weather warning.'
      },
      {
        text: 'A permanent tool that reinforces Sleeper and NPC illusion with no decisive blow against false reality.',
        rationale:
          'EBS shatters False Reality in one blow—not permanently reinforces Sleeper/NPC illusion.'
      },
      {
        text: 'Only a bank outage notice with no energetic or psychological shatter function for the masses.',
        rationale:
          'EBS is psychological and energetic shatter of false reality—not a bank outage notice alone.'
      }
    ]
  },
  {
    number: 11,
    question: 'How are broadcasts meticulously staged regarding truth intensity?',
    hint: 'Soft first, then severe truths, for trauma management.',
    support: ['soft reassurance', 'paradigm-shifting truths', 'collapse from trauma'],
    options: [
      {
        text: 'They begin with soft reassurance before escalating into severe paradigm-shifting truths so the population does not entirely collapse from trauma.',
        rationale:
          'Broadcasts begin with soft reassurance then escalate into severe paradigm-shifting truths so the population does not entirely collapse from trauma.'
      },
      {
        text: 'They dump hardest paradigm-shifting truths first with no soft reassurance and no trauma-management staging.',
        rationale:
          'Staging is soft first then severe truths—not hardest first without reassurance.'
      },
      {
        text: 'They only air sports forever with no soft reassurance and no paradigm-shifting truth escalation.',
        rationale:
          'Staging moves soft reassurance into hard truths—not endless sports without disclosure escalation.'
      },
      {
        text: 'They remain silent for 72 hours so no soft or hard truth content ever manages public trauma.',
        rationale:
          'Disclosures run continuously with soft-to-hard staging—not 72 hours of silence.'
      }
    ]
  },
  {
    number: 12,
    question: 'How does military presence during EBS contrast with parasitic lockdowns of the past?',
    hint: 'Civilian protection and stabilization purpose.',
    support: ['civilian protection and stabilization', 'parasitic control lockdowns', 'strictly for'],
    options: [
      {
        text: 'Military presence is strictly for civilian protection and stabilization, contrasting sharply with parasitic control lockdowns of the past.',
        rationale:
          'Military presence during EBS is strictly for civilian protection and stabilization, contrasting parasitic control lockdowns of the past.'
      },
      {
        text: 'Military presence is identical to past parasitic control lockdowns with no protective or stabilization purpose.',
        rationale:
          'The report contrasts EBS military presence as protection/stabilization against past parasitic control lockdowns.'
      },
      {
        text: 'There is never any military street presence and protection is left entirely to surging crowds alone.',
        rationale:
          'Military personnel are on the streets for order and safe absorption—not absent entirely.'
      },
      {
        text: 'Military only manages sports venues with no civilian protection role during disclosures.',
        rationale:
          'Presence maintains order for public absorption of disclosures—not sports venues alone.'
      }
    ]
  },
  {
    number: 13,
    question: 'What does Pre-EBS Conditioning use to push collective consciousness to the brink?',
    hint: 'Missile and market examples for focus and desperation for answers.',
    support: ['pre-ebs conditioning', 'missile strikes', 'market crashes'],
    options: [
      {
        text: 'Orchestrated scare events such as staged missile strikes and market crashes that push the public to panic’s brink so they focus, seek answers, and cannot ignore the transmission.',
        rationale:
          'Pre-EBS Conditioning uses orchestrated scare events like staged missile strikes and market crashes to push consciousness to panic’s brink for full focus on the transmission.'
      },
      {
        text: 'Calm peacetime programming that encourages the public to switch off any emergency transmission immediately.',
        rationale:
          'Conditioning stresses focus and desperation for answers—not calm programming that invites ignoring EBS.'
      },
      {
        text: 'Only weather documentaries with no missile-strike staging and no market-crash stress component.',
        rationale:
          'Named tools include staged missile strikes and market crashes—not weather documentaries alone.'
      },
      {
        text: 'Only post-EBS sports recaps with no pre-trigger brink-of-panic design at all.',
        rationale:
          'Pre-EBS Conditioning happens before trigger—not post-EBS sports recaps.'
      }
    ]
  },
  {
    number: 14,
    question: 'What happens during The Blackout in the first 72 hours of the operation?',
    hint: 'Cables, traditional communications, and who assumes media control.',
    support: ['first 72 hours', 'internet cables are severed', 'total control'],
    options: [
      {
        text: 'Major internet cables are severed, traditional communications go dark, and the military assumes total control over all media and broadcasting channels.',
        rationale:
          'In the first 72 hours, major internet cables are severed, traditional communications go dark, and the military assumes total media and broadcasting control.'
      },
      {
        text: 'Every cable stays online, MSM keeps total control, and the military never assumes any broadcasting channel.',
        rationale:
          'Cables are severed and military takes total media control—not permanent MSM open control.'
      },
      {
        text: 'Only local phones dim while global internet and traditional media remain fully open for parasitic spin.',
        rationale:
          'Major internet cables and traditional communications go dark—not open global channels for spin.'
      },
      {
        text: 'Only soft reassurance airs with no cable cuts and no military media takeover at all.',
        rationale:
          'Blackout severs cables and military takes channels before/around full broadcast control—not soft messages without cut.'
      }
    ]
  },
  {
    number: 15,
    question: 'What is the explicit initial broadcast reassurance message?',
    hint: 'Stay calm framing and police contrast.',
    support: ['stay calm you are safe', 'military control active to protect you', 'no police'],
    options: [
      {
        text: '“STAY CALM YOU ARE SAFE, MILITARY CONTROL ACTIVE TO PROTECT YOU (NO POLICE),” establishing trust, bypassing NPC panic loops, and setting the stage for revelations.',
        rationale:
          'Initial message is stay calm, you are safe, military control active to protect you (no police)—building trust, bypassing NPC panic loops, staging revelations.'
      },
      {
        text: 'Hardest trafficking and satanic-cult evidence first with no calm message and no military-protection framing.',
        rationale:
          'First messages are strictly soft reassurance before Flood Gates harder truths—not hardest crimes first.'
      },
      {
        text: 'Only weather updates with no stay-calm message and no claim of protective military control without police.',
        rationale:
          'The explicit message reassures safety under military protection with no police—not weather updates alone.'
      },
      {
        text: 'Silence for days so no trust baseline is established and NPC panic loops run unchecked forever.',
        rationale:
          'Initial broadcasts establish trust and bypass panic loops—not prolonged silence without baseline.'
      }
    ]
  },
  {
    number: 16,
    question: 'What does The Flood Gates stage release once the population is stabilized?',
    hint: 'Hard-truth categories including money, trafficking, cults, and parasite-controlled leaders.',
    support: ['flood gates', 'election fraud', 'federal reserve scam'],
    options: [
      {
        text: 'Verifiable proof of election fraud, the Federal Reserve scam, child trafficking rings, satanic cults, and global leaders entirely controlled by parasite systems.',
        rationale:
          'Flood Gates release verifiable proof of election fraud, Federal Reserve scam, child trafficking, satanic cults, and parasite-controlled global leaders.'
      },
      {
        text: 'Only sports scores and celebrity gossip with no fraud, Fed, trafficking, or cult proof content.',
        rationale:
          'Flood Gates deliver hard verifiable crime and control-structure proofs—not sports and gossip alone.'
      },
      {
        text: 'Only soft stay-calm loops forever with no transition into harder paradigm-shifting truths.',
        rationale:
          'After stabilization, EBS transitions into hard truths—not endless soft loops only.'
      },
      {
        text: 'Only praise for parasite-controlled leaders with zero verifiable evidence of election fraud or trafficking.',
        rationale:
          'Flood Gates expose leaders controlled by parasite systems with verifiable crime proofs—not praise without evidence.'
      }
    ]
  },
  {
    number: 17,
    question: 'What is the design purpose of the continuous 72+ hour disclosure window?',
    hint: 'Mental breakdowns, 3D Simulation fracture, and collective pause.',
    support: ['72+ hour', 'mental breakdowns', '3d simulation'],
    options: [
      {
        text: 'To run continuously over 72 hours, intentionally causing mental breakdowns needed to fracture the 3D Simulation, acting as a collective pause button for the world to sit still, watch, process trauma, and reset.',
        rationale:
          'The 72+ hour window runs continuously to cause mental breakdowns that fracture the 3D Simulation—a collective pause for sitting still, watching, processing trauma, and reset.'
      },
      {
        text: 'To air five minutes only so no mental breakdown, no 3D Simulation fracture, and no collective pause ever occur.',
        rationale:
          'Disclosures run over 72 hours as intentional pause/fracture design—not five minutes without impact.'
      },
      {
        text: 'To keep the public distracted with sports so no one sits still or processes any disclosure trauma.',
        rationale:
          'Window forces the world to sit still, watch, and process trauma—not sports distraction.'
      },
      {
        text: 'To permanently restore MSM spin midway so the 3D Simulation never fractures under continuous truth.',
        rationale:
          'Continuous truth is designed to fracture the 3D Simulation—not restore MSM spin mid-window.'
      }
    ]
  },
  {
    number: 18,
    question: 'Why must EBS disclosures provide context before true off-world fleets uncloak?',
    hint: 'What the public would assume without context.',
    support: ['off-world fleets', 'alien attack', 'collapse in terror'],
    options: [
      {
        text: 'Without EBS context first, the public would assume an alien attack and collapse in terror when fleets uncloak.',
        rationale:
          'If true off-world fleets uncloaked before EBS disclosures gave context, the public would assume alien attack and collapse in terror.'
      },
      {
        text: 'Because fleets uncloaking first always creates instant calm with zero terror and zero misread as attack.',
        rationale:
          'Without EBS context first, uncloaking is read as alien attack and terror—not instant calm.'
      },
      {
        text: 'Because fleets must never uncloak after EBS and context is never needed for any sky event.',
        rationale:
          'EBS prepares for Mass Reveal and Sky Opening with true fleets—context first prevents terror misread.'
      },
      {
        text: 'Because only NPCs see fleets and sleepers never need disclosure context for sky events.',
        rationale:
          'Public-wide terror risk without context is the stated reason EBS must precede uncloaking.'
      }
    ]
  },
  {
    number: 19,
    question: 'What would happen if EBS aired without preceding scare events?',
    hint: 'Sleeper distraction response.',
    support: ['preceding scare events', 'sleeping masses', 'switch it off'],
    options: [
      {
        text: 'Sleeping masses would remain distracted and switch it off.',
        rationale:
          'If EBS aired without preceding scare events, sleeping masses would remain distracted and switch it off.'
      },
      {
        text: 'Sleeping masses would always watch every hour attentively even with no scare events at all.',
        rationale:
          'Without scare events, sleepers remain distracted and switch EBS off—attention is not automatic.'
      },
      {
        text: 'Scare events permanently cancel EBS so no Truth Packages can ever air afterward.',
        rationale:
          'Scare events prepare attention for EBS; they do not permanently cancel truth broadcasts.'
      },
      {
        text: 'Only NPCs ignore EBS while every sleeper is already fully focused without any scare conditioning.',
        rationale:
          'Sleeping masses specifically remain distracted and switch off without preceding scare events.'
      }
    ]
  },
  {
    number: 20,
    question: 'How does EBS act as a primary catalyst for the Frequency Fracture?',
    hint: 'Truth packages, shockwaves of awakening, and parasitic energy grid.',
    support: ['frequency fracture', 'shockwaves of awakening', 'parasitic energy grid'],
    options: [
      {
        text: 'As military media drops massive Truth Packages, shockwaves of awakening among human and E.T. Sols destabilize the entire parasitic energy grid.',
        rationale:
          'EBS catalyzes Frequency Fracture: massive Truth Packages create awakening shockwaves among human and E.T. Sols that destabilize the parasitic energy grid.'
      },
      {
        text: 'By permanently stabilizing the parasitic energy grid with zero awakening shockwaves among any Sols.',
        rationale:
          'Awakening shockwaves destabilize the parasitic grid—not permanently stabilize it.'
      },
      {
        text: 'By only rebooting bank networks with no Truth Package drops and no Sol awakening shockwaves.',
        rationale:
          'Catalyst path is Truth Package drops and Sol awakening shockwaves—not bank reboots alone.'
      },
      {
        text: 'By silencing all military media so no Frequency Fracture pathway ever opens from disclosure shock.',
        rationale:
          'Military media dropping Truth Packages drives the fracture pathway—not media silence.'
      }
    ]
  },
  {
    number: 21,
    question: 'What physical environment do military lockdowns provide during EBS relative to Light Grids?',
    hint: 'Processing frequencies without surging-crowd chaos.',
    support: ['light grids', 'surging crowds', 'physical environment'],
    options: [
      {
        text: 'The exact physical environment needed to process incoming Light Grids and frequencies without chaotic interference of surging crowds.',
        rationale:
          'Military lockdowns provide the exact physical environment to process incoming Light Grids and frequencies without surging-crowd chaos.'
      },
      {
        text: 'Maximum surging-crowd chaos so no one can process Light Grids or incoming frequencies at all.',
        rationale:
          'Lockdowns remove chaotic surging-crowd interference for Light Grid processing—not maximize chaos.'
      },
      {
        text: 'Only sports-stadium control with no relation to Light Grids or frequency processing during EBS.',
        rationale:
          'Lockdowns support Light Grid and frequency processing during EBS—not sports control alone.'
      },
      {
        text: 'Only open markets forever with zero street military and zero protection from surging-crowd interference.',
        rationale:
          'Street military lockdowns specifically counter surging-crowd interference during absorption.'
      }
    ]
  },
  {
    number: 22,
    question: 'How did White Hats buy time to position military assets before EBS without premature collapse?',
    hint: 'Secret replacement of compromised leaders.',
    support: ['clones, stand-in actors, and holograms', 'position military assets', 'societal collapse'],
    options: [
      {
        text: 'By secretly replacing compromised global leaders with clones, stand-in actors, and holograms long before the event to position military assets without premature societal collapse.',
        rationale:
          'White Hats secretly replaced compromised leaders with clones, stand-ins, and holograms long before, buying time to position military assets for EBS without premature collapse.'
      },
      {
        text: 'By openly removing every leader on day one with no clones, stand-ins, or holograms and no asset-positioning cover.',
        rationale:
          'Secret optical replacements bought time for asset positioning—not open day-one removal without cover.'
      },
      {
        text: 'By leaving every compromised leader fully in power with no replacement optics and no military positioning window.',
        rationale:
          'Compromised leaders were secretly replaced to enable positioning—not left fully in power without cover.'
      },
      {
        text: 'By only rewriting sports schedules with no leader optics and no EBS asset-positioning strategy.',
        rationale:
          'Strategy is leader replacement optics for military EBS positioning—not sports schedules alone.'
      }
    ]
  },
  {
    number: 23,
    question: 'What does staged EBS execution ensure regarding parasitic narrative and hostile AI programming?',
    hint: 'Permanent dismantling plus insulation of the public.',
    support: ['parasitic narrative is permanently dismantled', 'hostile ai programming', 'fear loops'],
    options: [
      {
        text: 'That the parasitic narrative is permanently dismantled while the public is insulated from hostile AI programming and fear loops.',
        rationale:
          'Staged EBS ensures parasitic narrative is permanently dismantled while insulating the public from hostile AI programming and fear loops.'
      },
      {
        text: 'That the parasitic narrative is permanently restored while the public is flooded with hostile AI programming and fear loops.',
        rationale:
          'Execution dismantles parasitic narrative and insulates from hostile AI and fear loops—not restores them.'
      },
      {
        text: 'That only sports narratives change with no insulation from hostile AI and no parasitic-narrative dismantling.',
        rationale:
          'Strategic outcome is parasitic-narrative dismantling and AI/fear-loop insulation—not sports-only change.'
      },
      {
        text: 'That MSM keeps full narrative power forever with zero military Truth Package challenge.',
        rationale:
          'EBS bypasses MSM and permanently dismantles parasitic narrative via continuous Truth Packages.'
      }
    ]
  },
  {
    number: 24,
    question: 'What larger windows does EBS ultimately prepare humanity for?',
    hint: 'Mass Reveal and sky event after the bridge from blindness.',
    support: ['mass reveal window', 'sky opening', 'great dome'],
    options: [
      {
        text: 'The Mass Reveal Window and subsequent Sky Opening—the bridge from controlled blindness to realizing true existence within the Great Dome.',
        rationale:
          'EBS prepares for Mass Reveal Window and subsequent Sky Opening, bridging controlled blindness to realization of true existence within the Great Dome.'
      },
      {
        text: 'Permanent controlled blindness with no Mass Reveal, no Sky Opening, and no Great Dome realization path.',
        rationale:
          'EBS bridges out of controlled blindness toward Mass Reveal and Sky Opening—not permanent blindness.'
      },
      {
        text: 'Only bank reopenings with no sky event and no Great Dome existence realization after disclosures.',
        rationale:
          'Preparation is Mass Reveal and Sky Opening toward Great Dome realization—not bank reopenings alone.'
      },
      {
        text: 'Only endless Scare Events with no bridge to true fleets arriving or resonating-soul extraction.',
        rationale:
          'EBS paves the way for true fleets to arrive and extraction of resonating souls after the bridge opens.'
      }
    ]
  },
  {
    number: 25,
    question: 'What does EBS pave the way for after the Great Dome realization bridge?',
    hint: 'True fleets and extraction of a named soul group.',
    support: ['true fleets to arrive', 'extraction of resonating souls', 'paving the way'],
    options: [
      {
        text: 'True fleets to arrive and the extraction of resonating souls after the population realizes true existence within the Great Dome.',
        rationale:
          'EBS paves the way for true fleets to arrive and extraction of resonating souls following the bridge to Great Dome realization.'
      },
      {
        text: 'Permanent fleet cloaking forever with no extraction path for any resonating soul after disclosures.',
        rationale:
          'Path opens for true fleets to arrive and resonating-soul extraction—not permanent cloaking without extraction.'
      },
      {
        text: 'Only NPC grocery restocks with no true fleets and no resonating-soul extraction pathway.',
        rationale:
          'Strategic end-state includes true fleets and resonating-soul extraction—not grocery restocks alone.'
      },
      {
        text: 'Only parasitic media restoration so no Great Dome realization or fleet arrival can follow EBS.',
        rationale:
          'EBS dismantles parasitic narrative and paves fleet arrival and extraction—not parasitic media restoration.'
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

const topicImage = 'images/breakdown/military-broadcasts.webp';
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
    'Test your grasp of Military Broadcasts — EBS soft-to-hard Truth Packages, blackout and stabilization lockdowns, scare conditioning, Frequency Fracture catalysis, and the path to Sky Opening.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Military Broadcasts are the White Hat EBS airwave seizure—scare conditioning, communications blackout, soft reassurance, then Flood Gates of hard truth under protective stabilization. Sit with what you missed, then return to the Military Broadcasts deep-dive, infographics, and video transmissions. Soft first, then paradigm-shifting proof; lockdowns for Light Grid processing; the bridge from controlled blindness toward Mass Reveal, Sky Opening, true fleets, and resonating-soul extraction.'
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
    'Test your understanding of Military Broadcasts — EBS Operation, Truth Packages, White Hats, blackout, soft-to-hard rollout, and Mass Reveal preparation.'
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
  throw new Error('military-broadcasts not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on Military Broadcasts: EBS soft-to-hard Truth Packages, blackout and stabilization lockdowns, scare conditioning, and the path to Sky Opening.'
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
console.log('PASS: audited 25/25 against data/breakdown-topics/military-broadcasts.json');
