/**
 * Installs EBS Operation quiz for breakdown (Mega Breakdown) transmission.
 * Authored from data/breakdown-topics/ebs-operation.json report only.
 * Run: node scripts/install-ebs-operation-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/ebs-operation.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'ebs-operation';
const TOPIC_TITLE = 'EBS Operation';
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
    question: 'What is the E.B.S. Operation set against, and who produces it?',
    hint: 'Communications backdrop and Whitehat/G.A.A. framing.',
    support: ['communications blackout', 'whitehat/g.a.a.', '3d illusion'],
    options: [
      {
        text: 'It runs against the Communications Blackout as a coordinated Whitehat/G.A.A. Production designed to shatter the 3D illusion of the masses.',
        rationale:
          'E.B.S. execution is set against the Communications Blackout as a highly coordinated Whitehat/G.A.A. Production to shatter the 3D illusion of the masses.'
      },
      {
        text: 'It runs only as a random weather bulletin with no Whitehat/G.A.A. role and no intent to shatter any 3D illusion.',
        rationale:
          'The operation is a coordinated Whitehat/G.A.A. Production against the blackout backdrop—not a random weather bulletin.'
      },
      {
        text: 'It permanently strengthens the 3D illusion while leaving all media fully under parasitic civilian control forever.',
        rationale:
          'The design shatters the 3D illusion via military-controlled truth broadcast—not permanent parasitic strengthening.'
      },
      {
        text: 'It only reboots bank ATMs with no communications blackout and no mass-consciousness preparation for hidden truths.',
        rationale:
          'The sequence severs communications and prepares collective consciousness for un-censorable truth—not ATM reboots alone.'
      }
    ]
  },
  {
    number: 2,
    question: 'How does the precise sequence prepare collective consciousness for the truth broadcast?',
    hint: 'Staged fear followed by severance of communications.',
    support: ['staged geopolitical fear', 'severance of communications', 'un-censorable broadcast'],
    options: [
      {
        text: 'It uses staged geopolitical fear, then sudden severance of communications, to prepare consciousness for a massive un-censorable broadcast of hidden truths.',
        rationale:
          'The sequence uses staged geopolitical fear followed by sudden communications severance to prepare collective consciousness for massive un-censorable truth broadcast.'
      },
      {
        text: 'It keeps every cable online and cancels all geopolitical fear so sleepers never prepare for any truth broadcast.',
        rationale:
          'Fear staging and cable severance prepare consciousness—not permanent open cables with no scare prep.'
      },
      {
        text: 'It only airs sports highlights with no severance of communications and no hidden-truth broadcast path.',
        rationale:
          'The path is fear prep, blackout, then un-censorable truth packages—not sports highlights alone.'
      },
      {
        text: 'It only strengthens parasitic censorship so no un-censorable broadcast of hidden truths can ever air.',
        rationale:
          'The operation delivers un-censorable broadcast of hidden truths—not permanent parasitic censorship.'
      }
    ]
  },
  {
    number: 3,
    question: 'Why is the E.B.S. Operation described as an engineered necessity?',
    hint: 'Dismantling parasitic control without the worst societal outcome.',
    support: ['engineered necessity', 'parasitic control structures', 'societal collapse'],
    options: [
      {
        text: 'To dismantle parasitic control structures without triggering full-scale societal collapse.',
        rationale:
          'The operation is an engineered necessity to dismantle parasitic control structures without triggering full-scale societal collapse.'
      },
      {
        text: 'To rebuild parasitic control stronger than before through intentional full-scale societal collapse as the main goal.',
        rationale:
          'The goal is dismantling parasitic structures without full-scale collapse—not intentional total collapse to strengthen parasites.'
      },
      {
        text: 'To ignore parasitic structures entirely while only adjusting retail store hours worldwide.',
        rationale:
          'The necessity targets parasitic control dismantling—not mere retail-hour tweaks.'
      },
      {
        text: 'To freeze every NPC in perfect function so no fear loop or truth absorption ever begins.',
        rationale:
          'NPCs glitch and truth packages force absorption; the design is controlled shatter, not perfect frozen NPC function.'
      }
    ]
  },
  {
    number: 4,
    question: 'What is The Cut in EBS Operation terminology?',
    hint: 'Initial 12-hour blackout phase and public psychological state.',
    support: ['the cut', '12-hour phase', 'fear loop'],
    options: [
      {
        text: 'The initial 12-hour phase of the communications blackout where main internet cables are severed, plunging the public into confusion and a fear loop.',
        rationale:
          'The Cut is the initial 12-hour blackout phase when main internet cables are severed and the public enters confusion and a fear loop.'
      },
      {
        text: 'The final year of reconstruction when every cable is restored and no one enters any fear loop at all.',
        rationale:
          'The Cut is the initial 12-hour cable-sever phase—not a final reconstruction year of restored cables.'
      },
      {
        text: 'Only a supermarket restock drill with fully working phones and uninterrupted MSM calm.',
        rationale:
          'Main internet cables are severed and MSM floods with panic—not a calm restock drill with working phones.'
      },
      {
        text: 'The full 72+ hour E.B.S. truth cycle with soft-to-hard packages and no cable dark phase first.',
        rationale:
          'The Cut is the early blackout cable phase; E.B.S. is the later 72+ hour truth broadcast after military media takeover.'
      }
    ]
  },
  {
    number: 5,
    question: 'What defines The Wave (Hours 12-36)?',
    hint: 'Crowd targets and NPC programming behavior.',
    support: ['the wave', 'hours 12-36', 'npc programming'],
    options: [
      {
        text: 'The secondary blackout phase with crowd surges at supermarkets and banks as NPC programming begins to glitch.',
        rationale:
          'The Wave (Hours 12-36) is the secondary blackout phase of supermarket and bank surges as NPC programming begins to glitch.'
      },
      {
        text: 'A calm empty-store phase with perfectly stable NPC programming and zero survival scrambling.',
        rationale:
          'The Wave is crowd surges and NPC glitching—not empty calm stores with perfect NPC stability.'
      },
      {
        text: 'Only soft E.B.S. reassurance with “STAY CALM YOU ARE SAFE” and no supermarket or bank surges at all.',
        rationale:
          'Soft reassurance is E.B.S. rollout content; The Wave is physical survival scrambling under blackout.'
      },
      {
        text: 'Only Real Craft landings with no NPC glitch and no crowd surge toward fuel or food hubs.',
        rationale:
          'The Wave centers surges and NPC glitch; Real Crafts arrive in broader context while public focus is E.B.S. and staged invasion.'
      }
    ]
  },
  {
    number: 6,
    question: 'What is the E.B.S. (Emergency Broadcast System) as defined here?',
    hint: 'Duration, content type, and who takes media channels.',
    support: ['72+ hour', 'truth packages', 'military forces'],
    options: [
      {
        text: 'A mandatory 72+ hour broadcast of truth packages after military forces take over all media and internet channels to expose elite crimes and true reality.',
        rationale:
          'E.B.S. is a mandatory 72+ hour truth-package broadcast after military takeover of media and internet to expose elite crimes and true reality.'
      },
      {
        text: 'A five-minute weather clip with no military media takeover and no elite-crime exposure at all.',
        rationale:
          'E.B.S. is 72+ hours of truth packages under military channel control—not a five-minute weather clip.'
      },
      {
        text: 'A pure civilian streaming app that never seizes media and never airs continuous truth packages.',
        rationale:
          'Military forces take over media and internet for mandatory continuous truth—not a civilian streaming app alone.'
      },
      {
        text: 'A permanent parasitic MSM tool that blocks all exposure of elite crimes forever.',
        rationale:
          'E.B.S. exposes elite crimes and true reality—not a tool permanently blocking exposure.'
      }
    ]
  },
  {
    number: 7,
    question: 'What is The Lockdown Window in this operation?',
    hint: 'Military street role and how civilians are meant to receive E.B.S.',
    support: ['lockdown window', 'maintain order', 'absorb the e.b.s.'],
    options: [
      {
        text: 'A controlled environment where military forces maintain street order to protect civilians so they can safely sit still and absorb the E.B.S. broadcasts.',
        rationale:
          'The Lockdown Window is a controlled environment of military street order protecting civilians so they can safely sit still and absorb E.B.S. broadcasts.'
      },
      {
        text: 'A parasitic Covid-style control mechanism designed solely to harvest fear with no protective absorb-the-truth purpose.',
        rationale:
          'Lockdowns here are benevolent military operations to stabilize society—not parasitic Covid-like control.'
      },
      {
        text: 'An empty-street total military withdrawal with no order maintenance and no safe window for truth absorption.',
        rationale:
          'Military maintains order in the streets for protected absorption—not total withdrawal without protection.'
      },
      {
        text: 'Only a bank holiday with fully open media spin and no military street presence during disclosure.',
        rationale:
          'Military street presence creates the controlled absorb environment—not open media spin without lockdown cover.'
      }
    ]
  },
  {
    number: 8,
    question: 'What is Project Blue Beam in the EBS Operation sequence?',
    hint: 'Holographic fear push, tech named, and timing before E.B.S.',
    support: ['project blue beam', 'black cube tech', 'alien invasion'],
    options: [
      {
        text: 'An advanced holographic fear push using Black Cube Tech to simulate an Alien Invasion as a catalyst to shake sleepers into questioning reality before E.B.S. activates.',
        rationale:
          'Project Blue Beam is advanced holographic fear using Black Cube Tech to simulate Alien Invasion, catalyzing sleeper questioning before E.B.S. activates.'
      },
      {
        text: 'A genuine first-contact protocol that only shows true living crafts with no fear staging before E.B.S.',
        rationale:
          'Blue Beam is staged holographic invasion fear; true living ships break through later for Resonating Sols on matching frequency.'
      },
      {
        text: 'A banking software patch that restores cables without any holographic invasion or sleeper catalyst role.',
        rationale:
          'Blue Beam is holographic Alien Invasion fear staging—not a cable-restore banking patch.'
      },
      {
        text: 'A post-E.B.S. only weather graphic with no Black Cube Tech and no pre-activation catalyst function.',
        rationale:
          'Blue Beam deploys as catalyst before E.B.S. activates—not a post-E.B.S. weather graphic alone.'
      }
    ]
  },
  {
    number: 9,
    question: 'Why is the communications blackout not an accident?',
    hint: 'Frequency fracture framing and how enemy action is simulated.',
    support: ['deliberate frequency fracture', 'cyber strikes', 'russia, china, or iran'],
    options: [
      {
        text: 'It is a deliberate frequency fracture; cyber strikes and undersea cable cuts simulate enemy actions falsely blamed on actors like Russia, China, or Iran to push sleepers into fear.',
        rationale:
          'The blackout is a deliberate frequency fracture using cyber strikes and undersea cable cuts, falsely blamed on Russia, China, or Iran to push sleeping masses into fear.'
      },
      {
        text: 'It is pure random weather damage with no cyber strikes, no false geopolitical blame, and no frequency fracture design.',
        rationale:
          'Blackout is deliberate frequency fracture with simulated enemy cyber/cable actions—not pure random weather.'
      },
      {
        text: 'It permanently restores every cable while praising every geopolitical actor with zero fear push on sleepers.',
        rationale:
          'Cables are cut and false blame pushes fear—not permanent restore with praise and zero fear push.'
      },
      {
        text: 'It only freezes sports tickers while undersea cables and cyber narratives play no role at all.',
        rationale:
          'Cyber strikes and undersea cable cuts are central to the deliberate blackout design.'
      }
    ]
  },
  {
    number: 10,
    question: 'Why must scare events precede the E.B.S. broadcast?',
    hint: 'What sleepers would do without staged WW3 and holographic invasion first.',
    support: ['preceding scare events', 'staged ww3', 'simply ignore the truth'],
    options: [
      {
        text: 'Without preceding staged WW3 and holographic invasion events, sleeping masses would simply ignore the truth when E.B.S. played.',
        rationale:
          'E.B.S. cannot happen without preceding scare events; without staged WW3 and holographic invasion, sleepers would simply ignore the truth.'
      },
      {
        text: 'Because sleepers always watch every E.B.S. hour attentively even with no scare events and no holographic invasion stage.',
        rationale:
          'Without those preceding events, sleepers ignore the truth—attention is not automatic.'
      },
      {
        text: 'Because Blue Beam permanently cancels E.B.S. so no truth packages can ever air afterward.',
        rationale:
          'Scare/Blue Beam prepare attention for E.B.S.; they do not permanently cancel truth broadcasts.'
      },
      {
        text: 'Because staged WW3 only entertains NPCs and never affects whether sleepers heed E.B.S. content.',
        rationale:
          'Preceding scare events are required so sleepers do not ignore E.B.S. truth—central to the operation.'
      }
    ]
  },
  {
    number: 11,
    question: 'What will E.B.S. information cause among unprepared masses, and what proof categories drive that?',
    hint: 'Mental impact plus fraud, trafficking, cults, and bloodline controllers.',
    support: ['mental breakdowns', 'election fraud', 'true bloodline controllers'],
    options: [
      {
        text: 'Mental breakdowns among the unprepared, from undeniable proof of election fraud, child trafficking, satanic cults, and the true bloodline controllers.',
        rationale:
          'E.B.S. information causes mental breakdowns among the unprepared via undeniable proof of election fraud, child trafficking, satanic cults, and true bloodline controllers.'
      },
      {
        text: 'Only calm sports enjoyment with no election fraud, trafficking, cult, or bloodline proof content at all.',
        rationale:
          'E.B.S. delivers hard crime and bloodline proof that can break unprepared minds—not sports-only calm.'
      },
      {
        text: 'Only praise for elites with zero names, faces, or evidence of crimes and zero mental impact risk.',
        rationale:
          'Undeniable proof of elite crimes drives mental breakdowns among the unprepared—not praise without evidence.'
      },
      {
        text: 'Only five minutes of static with no multi-hour truth packages and no listed crime categories.',
        rationale:
          'Mandatory 72+ hour truth packages include those proof categories—not five minutes of static alone.'
      }
    ]
  },
  {
    number: 12,
    question: 'What happens in Phase One: The Cut (Hr 0-12)?',
    hint: 'Comms dark, MSM panic, and body/environment symptoms listed.',
    support: ['hr 0-12', 'main internet and comms go dark', 'buzzing in the skull'],
    options: [
      {
        text: 'Main internet and comms go dark; MSM floods panic and blame; symptoms include skull buzzing, static build-up, deep tiredness, erratic animals, and sudden atmospheric pressure drops.',
        rationale:
          'Phase One Cut (0-12): internet/comms dark, MSM panic-blame flood, plus skull buzzing, static, tiredness, erratic animals, and atmospheric pressure drops.'
      },
      {
        text: 'Internet stays fully online with calm MSM and zero physical or environmental blackout symptoms at all.',
        rationale:
          'Phase One darkens main internet/comms and floods panic while physical/environmental symptoms manifest.'
      },
      {
        text: 'Only soft E.B.S. hard-truth packages air with no cable dark and no MSM panic-blame narratives.',
        rationale:
          'Phase One is cable dark and MSM panic; soft-to-hard E.B.S. packages come in the later E.B.S. rollout.'
      },
      {
        text: 'Only Real Craft uncloaking for everyone with no Cut symptoms and no MSM blame flood.',
        rationale:
          'Phase One is blackout panic and body/environment signs; Real Crafts appear in broader context for matching-frequency Sols.'
      }
    ]
  },
  {
    number: 13,
    question: 'What defines Phase Two: The Wave (Hr 12-36)?',
    hint: 'Survival scrambling, hub targets, and AI scaffolding fate.',
    support: ['hr 12-36', 'supermarkets and fuel stations', 'ai scaffolding'],
    options: [
      {
        text: 'Survival scrambling as sleepers and NPCs surge toward supermarkets and fuel stations while AI scaffolding crumbles and NPC programs visibly glitch.',
        rationale:
          'Phase Two Wave (12-36): survival scrambling to supermarkets and fuel stations as AI scaffolding crumbles and NPC programs visibly glitch.'
      },
      {
        text: 'Empty calm hubs with perfect AI scaffolding and zero visible NPC program glitches whatsoever.',
        rationale:
          'The Wave is scrambling surges and visible NPC glitch as scaffolding crumbles—not empty calm perfection.'
      },
      {
        text: 'Only Opening Hour soul-memory sharpening with no supermarket surges and no AI scaffolding collapse.',
        rationale:
          'Opening Hour is Phase Three; Phase Two centers survival surges and NPC/AI glitch signs.'
      },
      {
        text: 'Only seeded-sols revelation airing with no fuel-station scramble and no NPC glitch at all.',
        rationale:
          'Seeded Sols appear in E.B.S. rollout; The Wave is physical scramble and NPC glitch under blackout.'
      }
    ]
  },
  {
    number: 14,
    question: 'What defines Phase Three: Opening Hour (Hr 36-72)?',
    hint: 'Awakening cracks, false flags, and soul memory.',
    support: ['hr 36-72', 'awakening cracks', 'soul memory sharpens'],
    options: [
      {
        text: 'First Awakening Cracks appear; the false flag narrative wobbles and undeniable truth leaks as human soul memory sharpens.',
        rationale:
          'Opening Hour (36-72): first Awakening Cracks, wobbling false flag, leaking undeniable truth, and sharpening human soul memory.'
      },
      {
        text: 'False flags become permanently unchallengeable while soul memory fully erases and no truth leaks at all.',
        rationale:
          'False flag wobbles and truth leaks with soul memory sharpening—not permanent false flags and erased memory.'
      },
      {
        text: 'Only Phase One cable dark repeats with no Awakening Cracks and no soul-memory sharpening.',
        rationale:
          'Opening Hour is the later crack/truth/memory phase—not a mere repeat of early cable dark alone.'
      },
      {
        text: 'Only full E.B.S. soft-to-hard packages finish with no false-flag wobble stage first.',
        rationale:
          'Opening Hour precedes full E.B.S. rollout emphasis with cracks and leaks as scaffolding of narrative fails.'
      }
    ]
  },
  {
    number: 15,
    question: 'What is the first public-eye step of the E.B.S. Rollout regarding media control?',
    hint: 'Who takes total control of media and internet.',
    support: ['military forces take total control', 'media and the internet', 'public eye'],
    options: [
      {
        text: 'Military forces take total control of media and the internet in the public eye.',
        rationale:
          'E.B.S. Rollout begins with military forces taking total control of media and the internet in the public eye.'
      },
      {
        text: 'Parasitic MSM keeps total media control with zero military takeover in the public eye.',
        rationale:
          'Military takes total control of media and internet publicly—not parasitic MSM remaining in control.'
      },
      {
        text: 'Only private elite radio continues with no public-eye media takeover for truth packages.',
        rationale:
          'Takeover is public-eye control of media and internet for mass truth packages—not elite-private radio alone.'
      },
      {
        text: 'Only sports networks air while military never touches media or internet channels at all.',
        rationale:
          'Military takes total control of media and internet for continuous truth—not sports-only non-takeover.'
      }
    ]
  },
  {
    number: 16,
    question: 'What is the initial E.B.S. reassurance message and its purpose?',
    hint: 'Exact calm-and-safety framing and panic avoidance.',
    support: ['stay calm you are safe', 'military control active to protect you', 'avoid full panic'],
    options: [
      {
        text: '“STAY CALM YOU ARE SAFE, MILITARY CONTROL ACTIVE TO PROTECT YOU”—to avoid full panic and establish a secure baseline.',
        rationale:
          'Initial broadcasts reassure: stay calm, you are safe, military control active to protect you—avoiding full panic and establishing a secure baseline.'
      },
      {
        text: 'Hardest bloodline and trafficking evidence first with no calm message and no secure baseline framing.',
        rationale:
          'Initial broadcasts provide immediate soft reassurance before harder truths—not hardest crimes first without calm framing.'
      },
      {
        text: 'Only weather updates with no stay-calm message and no claim of protective military control.',
        rationale:
          'The initial message explicitly reassures safety under active protective military control.'
      },
      {
        text: 'Silence for 72 hours so no soft or hard truth content ever establishes a secure baseline.',
        rationale:
          'E.B.S. begins with immediate reassurance then soft-to-hard truths—not 72 hours of silence.'
      }
    ]
  },
  {
    number: 17,
    question: 'How is truth delivery sequenced after the secure baseline?',
    hint: 'Soft first, then harder truths.',
    support: ['soft truths', 'harder truths', 'prepare the mind'],
    options: [
      {
        text: 'Soft Truths are delivered first to prepare the mind, followed by Harder Truths.',
        rationale:
          'Soft Truths come first to prepare the mind, followed by Harder Truths in the E.B.S. sequence.'
      },
      {
        text: 'Hardest truths dump first with no soft preparation and no mind-preparation phase at all.',
        rationale:
          'Sequence is soft truths first to prepare the mind, then harder truths—not hardest first without prep.'
      },
      {
        text: 'Only sports scores forever with no soft or harder truth packages in the rollout.',
        rationale:
          'Rollout delivers soft then harder truth packages—not endless sports without disclosure.'
      },
      {
        text: 'Only private elite briefings with no public soft-to-hard sequence for the masses.',
        rationale:
          'Public E.B.S. uses soft-then-harder truth delivery for the masses—not elite-only private briefings.'
      }
    ]
  },
  {
    number: 18,
    question: 'What total Parasite System exposure does the broadcast provide?',
    hint: 'Depopulation injections, money scam, and elite optics.',
    support: ['depopulation plans', 'federal reserve scam', 'elite clones and stand-ins'],
    options: [
      {
        text: 'Proof of deliberate depopulation via toxic injections (MMR, Covid), the Federal Reserve scam, and exposure of elite clones and stand-ins.',
        rationale:
          'Total Parasite System exposure includes depopulation via toxic injections (MMR, Covid), Federal Reserve scam, and elite clones/stand-ins.'
      },
      {
        text: 'Only praise for the Federal Reserve and vaccines as purely benevolent with zero clone or stand-in exposure.',
        rationale:
          'Exposure proves depopulation plans, Federal Reserve scam, and elite clones/stand-ins—not praise without exposure.'
      },
      {
        text: 'Only sports betting scams with no MMR/Covid injection evidence and no Federal Reserve content.',
        rationale:
          'Named exposure includes toxic injection depopulation plans and Federal Reserve scam—not sports betting alone.'
      },
      {
        text: 'Only weather fraud with no elite clone optics and no parasitic money-system disclosure.',
        rationale:
          'Broadcast exposes parasite system including money scam and elite clone/stand-in optics.'
      }
    ]
  },
  {
    number: 19,
    question: 'What does the broadcast reveal about Seeded Sols such as Diana, Barron, and JFK Jnr.?',
    hint: 'Placement in elite bloodlines and internal fracture mission.',
    support: ['seeded sols', 'diana, barron, and jfk jnr.', 'fracture the system from the inside'],
    options: [
      {
        text: 'Heroic entities placed within elite bloodlines—such as Diana, Barron, and JFK Jnr.—designed to fracture the system from the inside.',
        rationale:
          'Seeded Sols are heroic entities in elite bloodlines (Diana, Barron, JFK Jnr.) designed to fracture the system from the inside.'
      },
      {
        text: 'That those figures were only ordinary NPCs with no seeded role and no internal fracture mission.',
        rationale:
          'They are revealed as heroic seeded entities with inside fracture design—not ordinary NPCs.'
      },
      {
        text: 'That no named individuals were seeded and bloodlines never held internal fracture agents.',
        rationale:
          'The broadcast specifically names seeded heroic entities in elite bloodlines for internal fracture.'
      },
      {
        text: 'That seeding only happens after NPC dissolve with no E.B.S. mention during the truth rollout.',
        rationale:
          'Seeded Sols revelation is part of the E.B.S. rollout exposure sequence—not only a post-dissolve footnote.'
      }
    ]
  },
  {
    number: 20,
    question: 'How do blackout and E.B.S. relate to the Parasitic Overlay fracture?',
    hint: 'Narrative bridge for human consciousness during energetic shift.',
    support: ['parasitic overlay', 'narrative bridge', 'energetic shift'],
    options: [
      {
        text: 'As false reality collapses, E.B.S. provides the narrative bridge for human consciousness to comprehend the massive energetic shift.',
        rationale:
          'Blackout and E.B.S. link to Parasitic Overlay fracture; E.B.S. is the narrative bridge for consciousness to comprehend the massive energetic shift.'
      },
      {
        text: 'E.B.S. permanently restores the Parasitic Overlay with no narrative bridge and no energetic-shift comprehension role.',
        rationale:
          'E.B.S. bridges comprehension as false reality collapses—not permanent overlay restore without bridge.'
      },
      {
        text: 'Overlay fracture and E.B.S. never interconnect and consciousness needs no narrative bridge at all.',
        rationale:
          'They are intrinsically linked; E.B.S. supplies the narrative bridge during the energetic shift.'
      },
      {
        text: 'Only bank software links to the overlay while E.B.S. never addresses consciousness during the shift.',
        rationale:
          'E.B.S. is the consciousness narrative bridge during overlay fracture—not bank software alone.'
      }
    ]
  },
  {
    number: 21,
    question: 'How do Real Crafts from Solar Families relate to E.B.S. public focus?',
    hint: 'Staged invasion distraction and who can see true living ships.',
    support: ['real crafts', 'solar families', 'resonating sols'],
    options: [
      {
        text: 'While public focus is on E.B.S. and staged alien invasion, true living ships break through the frequency band, visible only to Resonating Sols whose vibration matches the crafts’ higher density.',
        rationale:
          'With public focus on E.B.S. and staged invasion, true living Solar Family crafts break through, visible only to Resonating Sols on matching higher density.'
      },
      {
        text: 'True living ships appear only to NPCs while Resonating Sols never see any craft during E.B.S. focus.',
        rationale:
          'Crafts are visible only to Resonating Sols on matching frequency—not primarily to NPCs.'
      },
      {
        text: 'No Real Crafts arrive and only Blue Beam holograms remain forever with no Solar Family breakthrough.',
        rationale:
          'True living ships break through the frequency band during this period—not holograms alone forever.'
      },
      {
        text: 'Every sleeper sees every craft equally with no frequency-band matching requirement at all.',
        rationale:
          'Visibility requires vibration matching the crafts’ higher density for Resonating Sols—not equal sleeper visibility.'
      }
    ]
  },
  {
    number: 22,
    question: 'How do orchestrated lockdowns during this period differ from Covid-style mechanisms?',
    hint: 'Benevolent military purpose versus parasitic control framing.',
    support: ['not parasitic control mechanisms like covid', 'benevolent military operations', 'mass riots'],
    options: [
      {
        text: 'They are benevolent military operations to stabilize society and prevent mass riots while the public absorbs disclosure trauma—not parasitic control like Covid.',
        rationale:
          'Lockdowns are benevolent military stabilization preventing mass riots during disclosure absorption—not parasitic Covid-like control.'
      },
      {
        text: 'They are identical to Covid parasitic control with no protective absorb-the-truth or anti-riot stabilization purpose.',
        rationale:
          'The report explicitly distinguishes these lockdowns from parasitic Covid mechanisms as benevolent stabilization.'
      },
      {
        text: 'They only close sports stadiums while media spin continues and no disclosure trauma absorption is protected.',
        rationale:
          'Purpose is protected absorption of disclosure trauma under military order—not sports-only limited closure.'
      },
      {
        text: 'They force mass riots intentionally with no military stabilization and no trauma-absorption window.',
        rationale:
          'They prevent mass riots while the public absorbs trauma—not intentionally force riots.'
      }
    ]
  },
  {
    number: 23,
    question: 'What is the primary strategic goal of E.B.S. and the blackout together?',
    hint: 'Shatter method and what power structures are permanently dismantled.',
    support: ['shatter the illusion', 'single, controlled blow', '3rd realm power structures'],
    options: [
      {
        text: 'Shatter the illusion in a single controlled blow and permanently dismantle 3rd Realm power structures—royals, politicians, corporate giants, and media heads—without total societal collapse.',
        rationale:
          'Primary goal is shatter the illusion in one controlled blow and permanently dismantle 3rd Realm power structures without total societal collapse.'
      },
      {
        text: 'Preserve every royal, politician, corporate giant, and media head with no illusion shatter and intentional total societal collapse.',
        rationale:
          'Goal neutralizes those power structures without total collapse—not preserve them via intentional total collapse.'
      },
      {
        text: 'Only soft weather reassurance forever with no 3rd Realm structure dismantling at all.',
        rationale:
          'Strategy guarantees permanent dismantling of 3rd Realm power structures—not endless weather-only soft messaging.'
      },
      {
        text: 'Only temporary cable glitches with zero permanent dismantling of parasitic power structures.',
        rationale:
          'Goal is permanent dismantling of 3rd Realm power structures via controlled shatter—not temporary glitches alone.'
      }
    ]
  },
  {
    number: 24,
    question: 'What path does the mandatory pause of E.B.S. clear for the Great Awakening?',
    hint: 'Transition phase for traumatized genuine souls versus NPC fate.',
    support: ['mandatory pause', 'healing sanctuaries', 'npc vessels permanently dissolve'],
    options: [
      {
        text: 'It initiates transition where traumatized but genuine human souls can be guided to Healing Sanctuaries while NPC vessels permanently dissolve with the false overlay they were tethered to.',
        rationale:
          'Mandatory pause clears Great Awakening path: genuine traumatized souls guided to Healing Sanctuaries; NPC vessels permanently dissolve with the false overlay.'
      },
      {
        text: 'It freezes every genuine soul in permanent trauma with no Healing Sanctuary path and permanent NPC overlay tethering forever.',
        rationale:
          'Genuine souls go to Healing Sanctuaries while NPCs dissolve with overlay—not permanent trauma freeze and NPC tethering.'
      },
      {
        text: 'It only reboots banks with no Great Awakening transition and no NPC dissolve pathway.',
        rationale:
          'Pause clears Great Awakening transition and NPC dissolve path—not bank reboots alone.'
      },
      {
        text: 'It converts every NPC into a permanent Sol with no dissolve and no need for Healing Sanctuaries.',
        rationale:
          'NPC vessels permanently dissolve with the false overlay; genuine souls use Healing Sanctuaries—not NPC-to-Sol conversion of all vessels.'
      }
    ]
  },
  {
    number: 25,
    question: 'What does forcing the world into a mandatory pause ultimately initiate?',
    hint: 'Great Awakening transition framing.',
    support: ['mandatory pause', 'great awakening', 'transition phase'],
    options: [
      {
        text: 'The transition phase of the Great Awakening after shattering illusion and clearing the path beyond 3rd Realm control.',
        rationale:
          'By forcing a mandatory pause, E.B.S. clears the path for the Great Awakening and initiates the transition phase beyond shattered illusion and dismantled 3rd Realm structures.'
      },
      {
        text: 'A permanent return to unexamined 3rd Realm media control with no Great Awakening transition at all.',
        rationale:
          'Mandatory pause clears Great Awakening transition—not permanent return to unexamined 3rd Realm media control.'
      },
      {
        text: 'Only a sports season restart with no illusion shatter and no transition for genuine human souls.',
        rationale:
          'Pause serves Great Awakening transition after controlled shatter—not a sports restart alone.'
      },
      {
        text: 'Only endless Phase One panic with no soft-to-hard truth packages and no healing path for genuine souls.',
        rationale:
          'E.B.S. pause enables truth absorption and transition including Healing Sanctuaries—not endless Phase One panic alone.'
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

const topicImage = 'images/breakdown/ebs-operation.webp';
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
    'Test your grasp of EBS Operation — blackout Cut/Wave/Opening Hour, Blue Beam scare prep, soft-to-hard truth rollout, Real Craft context, and controlled shatter without total collapse.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'EBS Operation is the Whitehat/G.A.A. controlled shatter of the 3D illusion—scare events, communications blackout, military media takeover, and 72+ hour truth packages without full societal collapse. Sit with what you missed, then return to the EBS Operation deep-dive, infographics, and video transmissions. Soft reassurance before harder truths; benevolent lockdown for absorption; genuine souls to Healing Sanctuaries as NPC vessels dissolve with the false overlay.'
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
    'Test your understanding of EBS Operation — Communications Blackout sequence, Project Blue Beam, military truth rollout, Seeded Sols, and Great Awakening transition.'
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
  throw new Error('ebs-operation not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on EBS Operation: blackout sequence, Blue Beam scare prep, soft-to-hard truth rollout, Real Craft context, and controlled shatter without total collapse.'
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
console.log('PASS: audited 25/25 against data/breakdown-topics/ebs-operation.json');
