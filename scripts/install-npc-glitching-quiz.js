/**
 * Installs NPC Glitching quiz for breakdown (Mega Breakdown) transmission.
 * Authored from data/breakdown-topics/npc-glitching.json report only.
 * Run: node scripts/install-npc-glitching-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/npc-glitching.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'npc-glitching';
const TOPIC_TITLE = 'NPC Glitching';
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
    question: 'When does the NPC Code Glitch reach catastrophic scale for simulated background populations?',
    hint: 'A named multi-day window of the Communications Blackout.',
    support: ['first 72 hours', 'communications blackout', 'npc code glitch'],
    options: [
      {
        text: 'During The First 72 Hours of the Communications Blackout, as the Frequency Fracture severs cables and collapses the Parasitic Overlay.',
        rationale:
          'The NPC Code Glitch is the catastrophic breakdown of simulated background populations during The First 72 Hours of the Communications Blackout.'
      },
      {
        text: 'Only decades after full Second Realm restoration, when every cable is already permanently online again.',
        rationale:
          'The glitch hits during The First 72 Hours of blackout, not decades after restoration with cables fully online.'
      },
      {
        text: 'Never, because NPC programming stays perfectly stable through every Frequency Fracture forever.',
        rationale:
          'NPCs lose their AI grip and malfunction when parasitic feeds cut—glitching is inevitable in that window.'
      },
      {
        text: 'Only during calm peacetime media festivals with no cable cuts and no overlay collapse at all.',
        rationale:
          'Glitching is triggered by cable severing and overlay collapse, not calm media festivals with intact feeds.'
      }
    ]
  },
  {
    number: 2,
    question: 'What are NPCs (Non-Player Characters) in this transmission?',
    hint: 'Soul status and what they are designed to do in the 3D simulation.',
    support: ['no true soul spark', 'background programs', '3d simulation'],
    options: [
      {
        text: 'Background programs, biological copies, and AI-driven shells with no true soul spark, designed to hold the 3D simulation together.',
        rationale:
          'NPCs are background programs, biological copies, and AI-driven shells without a true soul spark, built to hold the 3D simulation together.'
      },
      {
        text: 'Fully resonating true souls with origin anchors outside the simulation who always ascend and heal.',
        rationale:
          'NPCs have no true soul spark or origin outside the simulated realm; they cannot ascend or heal.'
      },
      {
        text: 'Only Real Craft pilots from solar families who never glitch and never follow parasitic AI broadcasts.',
        rationale:
          'Real Craft and solar families bypass NPC-level panic later; NPCs themselves are AI-driven shells without soul sparks.'
      },
      {
        text: 'Purely physical undersea cables with no emotional, mental, or behavioral malfunction possible.',
        rationale:
          'NPCs are puppeted populations that malfunction physically, emotionally, and mentally—not the cables alone.'
      }
    ]
  },
  {
    number: 3,
    question: 'What is an NPC Code Glitch?',
    hint: 'Erratic breakdown when a specific signal source is cut off.',
    support: ['npc code glitch', 'parasitic ai broadcast', 'erratic behavioral'],
    options: [
      {
        text: 'The erratic behavioral breakdown of simulated populations when severed from parasitic AI broadcast signals.',
        rationale:
          'NPC Code Glitch is the erratic behavioral breakdown of simulated populations cut off from parasitic AI broadcast signals.'
      },
      {
        text: 'A permanent upgrade that perfects every NPC script so no fear loop or chaos can ever appear.',
        rationale:
          'Glitching is breakdown and malfunction, not a permanent perfection of NPC scripts.'
      },
      {
        text: 'A Sol-only meditation technique that sharpens true soul memory without affecting NPCs at all.',
        rationale:
          'The glitch is NPC-side behavioral collapse from severed AI feeds, not a Sol meditation technique.'
      },
      {
        text: 'A weather term for clear skies with no link to blackout, overlay, or simulated populations.',
        rationale:
          'NPC Code Glitch is behavioral collapse during blackout and overlay failure, not a weather label.'
      }
    ]
  },
  {
    number: 4,
    question: 'What happens to the AI systems that puppet NPCs when the Frequency Fracture hits?',
    hint: 'Grip on NPCs after media and low-frequency control feeds fail.',
    support: ['artificial intelligence systems', 'lose their grip', 'continuous feed'],
    options: [
      {
        text: 'They lose their grip as NPCs are cut off from continuous media programming and low-frequency control signals.',
        rationale:
          'When the Frequency Fracture collapses the overlay, AI systems puppeting NPCs lose their grip without continuous media and low-frequency control feeds.'
      },
      {
        text: 'They gain permanent total control and broadcast stronger cohesive narratives than before the blackout.',
        rationale:
          'AI controllers lose infrastructure for cohesive narrative; NPCs malfunction rather than gaining perfect control.'
      },
      {
        text: 'They convert every NPC into a Resonating Sol with a true soul spark overnight automatically.',
        rationale:
          'NPCs remain without true soul sparks; glitching exposes mechanical nature rather than converting them into Sols.'
      },
      {
        text: 'They ignore the blackout entirely and keep every supermarket calm with flawless NPC behavior.',
        rationale:
          'Phase Two shows severe glitching at supermarkets, banks, and fuel stations—not calm flawless NPC behavior.'
      }
    ]
  },
  {
    number: 5,
    question: 'What does widespread NPC glitching expose about the 3D illusion?',
    hint: 'What true souls are forced to witness as scaffolding fails.',
    support: ['mechanical nature', 'artificial scaffolding', '3d illusion'],
    options: [
      {
        text: 'The mechanical nature of the 3D illusion, as true human and extraterrestrial souls watch artificial scaffolding crumble around them.',
        rationale:
          'Widespread glitching exposes the mechanical nature of the 3D illusion and forces true souls to witness artificial scaffolding crumbling.'
      },
      {
        text: 'That the 3D illusion is permanently solid and that artificial scaffolding can never crumble at all.',
        rationale:
          'Glitching exposes mechanical illusion and crumbling scaffolding—not permanent unbreakable solidity.'
      },
      {
        text: 'That only weather satellites failed while NPC behavior and narrative cohesion remain perfect.',
        rationale:
          'NPCs physically, emotionally, and mentally malfunction as narrative infrastructure fails—not weather-only failure.'
      },
      {
        text: 'That Resonating Sols are the ones glitching while NPCs stay calm lighthouses in every crowd.',
        rationale:
          'NPCs scramble and glitch while Resonating Sols remain calm observers and lighthouses outside panic zones.'
      }
    ]
  },
  {
    number: 6,
    question: 'If NPCs are not real souls, what are they described as instead?',
    hint: 'Fragments and programs used to hold simulation and lure true souls.',
    support: ['fragments of light', 'background programs', 'lure true souls'],
    options: [
      {
        text: 'Fragments of light and background programs deployed to hold the simulation together and lure true souls into the illusion.',
        rationale:
          'NPCs are not real souls; they are fragments of light and background programs that hold the simulation and lure true souls into the illusion.'
      },
      {
        text: 'Eternal origin sparks from outside the simulated realm who always heal and ascend with Sols.',
        rationale:
          'NPCs have no true soul anchor or origin outside the simulated realm and cannot ascend or heal.'
      },
      {
        text: 'Only physical undersea cables with no role in luring true souls into any illusion.',
        rationale:
          'NPCs are populations of programs and shells that lure true souls into illusion—not cables alone.'
      },
      {
        text: 'Fully awake EBS commanders who author every tribunal script without any AI puppeting.',
        rationale:
          'NPCs are puppeted by AI and glitch when feeds cut; EBS fear staging targets the NPC population, not NPC-authored tribunals as true commanders.'
      }
    ]
  },
  {
    number: 7,
    question: 'What do AI controllers attempt by pushing the masses into a final fear loop during this glitch?',
    hint: 'They lack the infrastructure for something cohesive.',
    support: ['final fear loop', 'cohesive narrative', 'ai controllers'],
    options: [
      {
        text: 'To push the masses into a final fear loop without the infrastructure to maintain a cohesive narrative.',
        rationale:
          'Glitching results from AI controllers pushing masses into a final fear loop without infrastructure for a cohesive narrative.'
      },
      {
        text: 'To deliver perfect calm and total narrative coherence with zero panic across every channel.',
        rationale:
          'The push is a final fear loop under failing narrative infrastructure—not perfect calm coherence.'
      },
      {
        text: 'To permanently heal every NPC so they can ascend with true souls into the Second Realm.',
        rationale:
          'NPCs cannot ascend or heal; when the overlay collapses they dissolve rather than heal into ascension.'
      },
      {
        text: 'To shut down all fear and restore supermarket calm without any cyber-strike blame narratives.',
        rationale:
          'Phase One floods NPC channels with false cyber-strike blame and fear—not restored supermarket calm.'
      }
    ]
  },
  {
    number: 8,
    question: 'How do deep sleepers and NPCs respond for the first 48 hours of the blackout?',
    hint: 'Rejection of reality and preference over admitting wrong or asking for help.',
    support: ['first 48 hours', 'reject reality', 'admit they were wrong'],
    options: [
      {
        text: 'They vehemently reject reality and prefer facing death in their illusion rather than admit they were wrong and ask awake people for help.',
        rationale:
          'For the first 48 hours, deep sleepers and NPCs reject reality and prefer death in illusion over admitting wrong and asking for help.'
      },
      {
        text: 'They immediately admit full error, thank Resonating Sols, and calmly request help within the first hour.',
        rationale:
          'They vehemently reject reality for the first 48 hours rather than immediately admitting wrong and asking for help.'
      },
      {
        text: 'They only sleep peacefully with no fear loop and no resistance to awakened guidance at all.',
        rationale:
          'They prefer illusion and resist help; they do not rest in peaceful acceptance of awakened guidance.'
      },
      {
        text: 'They become sole military commanders who never panic and never scan for missing authority instructions.',
        rationale:
          'NPCs panic, glitch, and later scan environments for missing intel and authority instructions—not calm sole command.'
      }
    ]
  },
  {
    number: 9,
    question: 'Why can NPCs neither ascend nor heal when the overlay fully collapses?',
    hint: 'Soul anchor and origin status outside the simulated realm.',
    support: ['no true soul anchor', 'cannot ascend or heal', 'dissolve and vanish'],
    options: [
      {
        text: 'They have no true soul anchor or origin outside the simulated realm, so they dissolve and vanish like shadows when the overlay collapses.',
        rationale:
          'Without a true soul anchor or origin outside the simulation, NPCs cannot ascend or heal; they dissolve and vanish like shadows when the overlay collapses.'
      },
      {
        text: 'They permanently upgrade into Resonating Sols and ascend first before any true soul does.',
        rationale:
          'NPCs cannot ascend or heal; collapse means dissolve-and-vanish, not priority Sol ascension.'
      },
      {
        text: 'They keep full origin memory from outside the realm and rebuild the Parasitic Overlay alone.',
        rationale:
          'They lack origin outside the simulated realm and vanish with overlay collapse rather than rebuilding it as true-soul agents.'
      },
      {
        text: 'They are protected by Real Craft retrieval that converts every shell into a permanent Sol vessel.',
        rationale:
          'Real Craft and solar families retrieve true souls later while bypassing NPC-level panic; NPCs dissolve rather than convert into Sols.'
      }
    ]
  },
  {
    number: 10,
    question: 'What defines Phase One: The Cut (Hr. 0–12) for the NPC collective?',
    hint: 'Panic start and the content flooding remaining NPC channels.',
    support: ['hr. 0', 'false blame', 'cyber strikes'],
    options: [
      {
        text: 'Blackout panic begins as mainstream media and remaining NPC channels flood with false blame narratives about cyber strikes, looping NPCs into confusion and fear.',
        rationale:
          'Phase One (0–12) initiates panic; MSM and NPC channels flood with false cyber-strike blame, plunging the NPC collective into confusion and fear.'
      },
      {
        text: 'EBS already completes every truth drop while NPC channels stay calm with zero blame narratives.',
        rationale:
          'Phase One floods NPC channels with false blame and fear; full truth staging ties later to EBS fear maximization, not calm Phase One truth completion.'
      },
      {
        text: 'Only Resonating Sols panic while every NPC remains a stable lighthouse in supermarket aisles.',
        rationale:
          'NPCs enter confusion and fear loops; Sols are guided to avoid panic zones and hold calm ground.'
      },
      {
        text: 'Phase One only restocks fuel with no blackout, no false blame, and no NPC fear loop at all.',
        rationale:
          'The Cut initiates blackout panic and false-blame floods—not a quiet fuel restock without fear.'
      }
    ]
  },
  {
    number: 11,
    question: 'Where is the most severe NPC Code Glitch concentrated in Phase Two: The Wave (Hr. 12–36)?',
    hint: 'Three public focal points of chaos and crowd surges.',
    support: ['hr. 12', 'supermarkets, banks, and fuel stations', 'most severe'],
    options: [
      {
        text: 'At supermarkets, banks, and fuel stations, where crowd surges peak and NPCs scramble desperately for information and survival.',
        rationale:
          'Phase Two holds the most severe glitch; supermarkets, banks, and fuel stations become focal points of chaos and crowd surges.'
      },
      {
        text: 'Only in empty deserts with no crowd surges and no scramble for information or survival at all.',
        rationale:
          'Severe glitching concentrates at stores, banks, and fuel stations—not empty calm deserts.'
      },
      {
        text: 'Only inside Real Craft hangars where solar families calm every NPC without any public chaos.',
        rationale:
          'Phase Two chaos is public survival scramble; Real Craft contact comes later and bypasses NPC-level panic.'
      },
      {
        text: 'Only on offline library shelves with fully working internet and zero fractured NPC programming.',
        rationale:
          'Programming openly fractures amid blackout surges at essential public locations, not calm offline libraries.'
      }
    ]
  },
  {
    number: 12,
    question: 'How does NPC programming fracture during Phase Two?',
    hint: 'Two opposite behavioral poles of the open fracture.',
    support: ['lash out', 'quiet and dazed', 'programming openly fractures'],
    options: [
      {
        text: 'Some lash out erratically and aggressively, while others completely shut down, going quiet and dazed.',
        rationale:
          'In Phase Two, programming openly fractures: some NPCs lash out erratically and aggressively; others go quiet and dazed.'
      },
      {
        text: 'Every NPC becomes perfectly calm, organized, and helpful with no aggression and no shutdown states.',
        rationale:
          'Fracture shows aggression or quiet dazed shutdown—not universal calm helpful organization.'
      },
      {
        text: 'Every NPC immediately ascends, leaving empty streets with no scramble for survival at all.',
        rationale:
          'NPCs scramble for survival and cannot ascend; they glitch rather than leave via ascension.'
      },
      {
        text: 'Programming freezes into one perfect script that never runs, jumps, grabs, or loops roads meaninglessly.',
        rationale:
          'Later looping includes run, jump, grab, and meaningless road runs—not a single perfect frozen calm script.'
      }
    ]
  },
  {
    number: 13,
    question: 'What defines Phase Three: Opening Hour (Hr. 36–72) for NPC code and emotion?',
    hint: 'Code flicker, outbursts, and scanning behavior for missing guidance.',
    support: ['hr. 36', 'emotional outbursts', 'missing intel'],
    options: [
      {
        text: 'NPC code flickers intensely with random unprovoked emotional outbursts—snapping or crying—while NPCs scan environments in fear for missing intel and authority instructions.',
        rationale:
          'Opening Hour brings intense code flicker, unprovoked emotional outbursts, and fearful scanning for missing intel and authority instructions.'
      },
      {
        text: 'NPC code becomes flawless and every NPC calmly accepts Frequency Fracture truth without scanning for authority.',
        rationale:
          'Code flickers and NPCs search for missing authority instructions—not flawless calm acceptance of the fracture.'
      },
      {
        text: 'Phase Three only restocks banks with no emotional outbursts and no fearful environmental scanning.',
        rationale:
          'Opening Hour is emotional outbursts and fear scanning, not a quiet bank restock without glitch signs.'
      },
      {
        text: 'All NPCs dissolve in the first minute of hour thirty-six with no intermediate flicker or outburst stage.',
        rationale:
          'Dissolve-and-vanish comes when the overlay entirely collapses; Opening Hour still shows flicker, outbursts, and scanning.'
      }
    ]
  },
  {
    number: 14,
    question: 'What mechanical looping behaviors do glitching NPCs exhibit?',
    hint: 'Software-like motion patterns that fail to process collapsed scripts.',
    support: ['mechanical looping', 'run, jump, grab', 'end of a road'],
    options: [
      {
        text: 'Like malfunctioning software, they run, jump, grab items, run to the end of a road, and meaninglessly run back, unable to process the collapse of scripted reality.',
        rationale:
          'NPCs show mechanical looping—run, jump, grab, run to the end of a road, and run back—unable to process scripted-reality collapse.'
      },
      {
        text: 'They sit in perfect meditative stillness with no running, grabbing, or meaningless road loops at all.',
        rationale:
          'Looping is active run-jump-grab-road cycles, not perfect meditative stillness.'
      },
      {
        text: 'They only write coherent tribunal scripts for EBS with no physical looping or survival scramble.',
        rationale:
          'Looping is physical malfunction under collapsed scripts, not coherent EBS tribunal authorship.'
      },
      {
        text: 'They only repair undersea cables in organized crews with zero erratic motion patterns.',
        rationale:
          'Behaviors are erratic software-like loops amid chaos, not organized cable-repair crews.'
      }
    ]
  },
  {
    number: 15,
    question: 'How can small visual or auditory cues suddenly turn an NPC aggressive?',
    hint: 'Activation codes and a named parasite frequency technology.',
    support: ['activation codes', 'voice to skull', 'against awakened'],
    options: [
      {
        text: 'Cues such as a specific quote or a box on a screen can act as activation codes that turn an NPC aggressive or set them against awakened individuals via Voice to Skull.',
        rationale:
          'Small cues like a quote or on-screen box can be activation codes that trigger aggression against the awakened using Voice to Skull technology.'
      },
      {
        text: 'Only gentle music permanently calms every NPC with no activation codes and no Voice to Skull involvement.',
        rationale:
          'Activation codes and Voice to Skull can trigger aggression—not only permanent calm from gentle music.'
      },
      {
        text: 'Cues only heal NPCs into true souls with no risk of aggression toward awakened people.',
        rationale:
          'Cues can set NPCs against awakened individuals; they do not heal NPCs into true souls.'
      },
      {
        text: 'Screens never matter because Voice to Skull cannot project thoughts, visions, or triggers into NPC minds.',
        rationale:
          'Voice to Skull projects artificial thoughts, visions, and triggers into NPC minds to dictate actions.'
      }
    ]
  },
  {
    number: 16,
    question: 'What is Voice to Skull technology in this context?',
    hint: 'What it projects and where those projections land.',
    support: ['voice to skull', 'artificial thoughts', 'dictate their actions'],
    options: [
      {
        text: 'Advanced parasite frequency technology that projects artificial thoughts, visions, and triggers directly into NPC minds to dictate their actions.',
        rationale:
          'Voice to Skull is parasite frequency tech projecting artificial thoughts, visions, and triggers into NPC minds to dictate actions.'
      },
      {
        text: 'A Sol lighthouse method that only broadcasts calm origin memory without any parasitic control.',
        rationale:
          'Voice to Skull is parasitic control tech over NPCs, not a Sol lighthouse calm-broadcast method.'
      },
      {
        text: 'A pure hardware cable brand with no ability to project thoughts or triggers into any mind.',
        rationale:
          'Voice to Skull projects into minds to dictate actions; it is not merely a cable brand name.'
      },
      {
        text: 'An EBS weather segment that never influences NPC aggression or activation-code responses.',
        rationale:
          'Voice to Skull is used with activation cues to turn NPCs aggressive—not a neutral weather segment alone.'
      }
    ]
  },
  {
    number: 17,
    question: 'How is NPC glitching tied to Staged WW3 and the Fake Alien Invasion?',
    hint: 'Broadcast path and the fear-frequency purpose in the NPC population.',
    support: ['staged ww3', 'fake alien invasion', 'fear frequency'],
    options: [
      {
        text: 'Those staged scenarios are broadcast via the Emergency Broadcast System to maximize fear frequency in the NPC population and prepare the realm for ultimate truth drops.',
        rationale:
          'NPC glitching ties to Staged WW3 and Fake Alien Invasion broadcast via E.B.S. to maximize NPC fear frequency before ultimate truth drops.'
      },
      {
        text: 'Those staged events never air and never raise NPC fear frequency before any truth drops at all.',
        rationale:
          'Staged WW3 and Fake Alien Invasion are used via E.B.S. to maximize NPC fear frequency for truth-drop readiness.'
      },
      {
        text: 'They only calm NPCs into perfect healing so no fear frequency is ever maximized in the population.',
        rationale:
          'The staging maximizes fear frequency in NPCs rather than calming them into healing.'
      },
      {
        text: 'They only affect Real Craft pilots and never target the NPC population’s fear field at all.',
        rationale:
          'The fear-frequency maximization is aimed at the NPC population, not Real Craft pilots alone.'
      }
    ]
  },
  {
    number: 18,
    question: 'How does NPC panic contrast with Resonating Sols during this window?',
    hint: 'Frantic scrambling versus a calm observing posture.',
    support: ['resonating sols', 'frantic, scrambling', 'calm, observing'],
    options: [
      {
        text: 'Frantic scrambling NPCs in shock and trauma contrast with calm, observing true souls, highlighting the reality of the Great Awakening.',
        rationale:
          'NPC panic and devolution into shock contrast with calm, observing Resonating Sols, highlighting the Great Awakening.'
      },
      {
        text: 'Resonating Sols scramble in panic while NPCs remain the only calm observers of the Great Awakening.',
        rationale:
          'NPCs are frantic; true souls remain calm observers—not the reverse.'
      },
      {
        text: 'There is no behavioral contrast because Sols and NPCs always act identically in every crowd surge.',
        rationale:
          'The striking difference between scrambling NPCs and calm Sols is a central teaching of the window.'
      },
      {
        text: 'Only military uniforms differ while emotional and behavioral states remain the same for Sols and NPCs.',
        rationale:
          'The contrast is behavioral and energetic—frantic NPC collapse versus calm Sol observation—not uniforms alone.'
      }
    ]
  },
  {
    number: 19,
    question: 'How does the environment mirror the NPC breakdown during this window?',
    hint: 'Screens, phones, sky quality, and auditory field symptoms.',
    support: ['screens flicker', 'phones freeze', 'flat and muted'],
    options: [
      {
        text: 'Screens flicker, phones freeze, the sky looks flat and muted, and subtle buzzing or sharp ringing fills the air as the Parasitic Overlay dies.',
        rationale:
          'The environment mirrors NPC breakdown with flickering screens, frozen phones, flat muted sky, and buzzing or sharp ringing as the overlay dies.'
      },
      {
        text: 'Every screen stays perfect, phones never freeze, skies stay vivid, and no buzzing or ringing appears at all.',
        rationale:
          'Environmental glitch signs include flicker, freeze, muted sky, and buzzing/ringing—not perfect stable media and vivid calm skies.'
      },
      {
        text: 'Only stock tickers move while phones, skies, and auditory fields show zero change during overlay death.',
        rationale:
          'Phones freeze, skies mute, and buzzing/ringing fill the air—not ticker-only symptoms.'
      },
      {
        text: 'The environment only improves broadband speed with no mirror of NPC collapse in sensory signs.',
        rationale:
          'Sensory environmental collapse mirrors NPC breakdown as the Parasitic Overlay dies—not a broadband upgrade.'
      }
    ]
  },
  {
    number: 20,
    question: 'Which locations must Resonating Sols strictly avoid during the first 72 hours?',
    hint: 'Highly volatile NPC glitch zones named in strategic guidance.',
    support: ['avoid large crowds', 'supermarkets, banks, and fuel stations', 'volatile'],
    options: [
      {
        text: 'Large crowds, supermarkets, banks, and fuel stations—highly volatile NPC glitch zones in the first 72 hours.',
        rationale:
          'Resonating Sols must strictly avoid large crowds, supermarkets, banks, and fuel stations as volatile NPC glitch zones.'
      },
      {
        text: 'Only empty mountain trails where no NPC has ever glitched and no crowd surge can form.',
        rationale:
          'The named volatile zones are crowds and essential public hubs—not a warning limited to empty trails.'
      },
      {
        text: 'Nowhere—Sols are ordered to lead every supermarket surge and bank panic personally.',
        rationale:
          'Sols must avoid those panic zones, not lead the surges inside them.'
      },
      {
        text: 'Only Real Craft hangars, because public streets stay calm with zero NPC volatility.',
        rationale:
          'Public hubs are highly volatile; Real Craft contact comes later and bypasses NPC-level panic.'
      }
    ]
  },
  {
    number: 21,
    question: 'What is the Hold Ground role for awakened individuals during NPC glitching?',
    hint: 'Community scale and lighthouse function while AI scaffolding falls.',
    support: ['hold ground', 'small, calm pockets', 'stabilized lighthouses'],
    options: [
      {
        text: 'Remain in small, calm community pockets and act as stabilized lighthouses while the AI scaffolding crumbles.',
        rationale:
          'Awakened individuals must remain in small, calm community pockets as stabilized lighthouses while AI scaffolding crumbles.'
      },
      {
        text: 'Lead every large crowd into banks and fuel stations to amplify NPC fear loops on purpose.',
        rationale:
          'Hold Ground means small calm pockets and lighthouse stability—not leading crowds into panic hubs.'
      },
      {
        text: 'Abandon all communities and refuse any lighthouse role until every NPC has already dissolved.',
        rationale:
          'The role is active lighthouse presence in calm pockets during the crumbling, not total abandonment.'
      },
      {
        text: 'Rewrite MSM cyber-strike scripts so the artificial narrative regains full control of every NPC.',
        rationale:
          'Lighthouses stabilize frequency as scaffolding crumbles; they do not restore parasitic narrative control.'
      }
    ]
  },
  {
    number: 22,
    question: 'Why must Resonating Sols ignore the chaos instead of trying to save or follow NPCs?',
    hint: 'Resistance, denial, and what engagement does to frequency.',
    support: ['resist violently', 'not true souls', 'drains necessary frequency'],
    options: [
      {
        text: 'NPCs resist violently and stay entrenched in denial; they are not true souls, so engaging their fear loops only drains necessary frequency.',
        rationale:
          'Do not save or follow NPCs: they resist violently, remain in denial, are not true souls, and their fear loops drain necessary frequency.'
      },
      {
        text: 'NPCs always accept help calmly and engaging their fear loops permanently raises Sol frequency.',
        rationale:
          'They resist violently; engaging fear loops drains frequency rather than raising it.'
      },
      {
        text: 'NPCs are true souls who heal only when Sols follow them into every supermarket panic zone.',
        rationale:
          'NPCs are not true souls and Sols must avoid panic zones rather than follow NPCs into them.'
      },
      {
        text: 'Ignoring chaos is forbidden because every Sol must personally rewrite each NPC activation code.',
        rationale:
          'Guidance is to ignore the chaos and not engage NPC fear loops—not to rewrite every activation code in the surge.'
      }
    ]
  },
  {
    number: 23,
    question: 'What should Resonating Sols understand about visible military maintaining street order?',
    hint: 'Who largely controls those forces versus later true contact.',
    support: ['npc-controlled', 'real craft', 'solar families'],
    options: [
      {
        text: 'Visible military maintaining order will largely be NPC-controlled; true contact and retrieval come later from Real Craft and solar families, bypassing NPC-level panic.',
        rationale:
          'Street military will largely be NPC-controlled; true contact and retrieval come later from Real Craft and solar families, bypassing NPC-level panic.'
      },
      {
        text: 'Every visible soldier is already a fully awakened Sol with no NPC control and no later Real Craft needed.',
        rationale:
          'Military presence is largely NPC-controlled; true retrieval comes later via Real Craft and solar families.'
      },
      {
        text: 'Military presence never appears and Real Craft lands only inside supermarket panic zones first.',
        rationale:
          'Military is visible maintaining order; Real Craft bypasses NPC-level panic rather than landing first in those zones.'
      },
      {
        text: 'Solar families only command NPC military units and never bypass NPC-level panic for true retrieval.',
        rationale:
          'True contact from Real Craft and solar families completely bypasses NPC-level panic rather than commanding it as the final retrieval path.'
      }
    ]
  },
  {
    number: 24,
    question: 'What is the Parasitic Overlay’s role relative to NPC perception and behavior?',
    hint: 'How the false 3D construct relates to NPC control.',
    support: ['parasitic overlay', 'dictates and controls', 'npc perception'],
    options: [
      {
        text: 'It is the false 3D projection and density construct that dictates and controls NPC perception and behavior.',
        rationale:
          'The Parasitic Overlay is the false 3D projection and density construct that dictates and controls NPC perception and behavior.'
      },
      {
        text: 'It is a pure Sol origin field that only heals NPCs into true souls without dictating any behavior.',
        rationale:
          'The overlay is a false control construct over NPC perception and behavior—not a Sol origin healing field.'
      },
      {
        text: 'It only manages weather satellites and never influences NPC perception, fear loops, or glitching.',
        rationale:
          'The overlay dictates NPC perception and behavior; its collapse is central to the glitching cascade.'
      },
      {
        text: 'It is identical to Real Craft guidance and always bypasses parasitic AI broadcast signals entirely.',
        rationale:
          'The Parasitic Overlay is the false density construct feeding NPC control—not Real Craft guidance.'
      }
    ]
  },
  {
    number: 25,
    question: 'What is the Frequency Fracture in relation to NPC glitching?',
    hint: 'Energetic shattering linked to a drop in parasitic communication signals.',
    support: ['frequency fracture', 'energetic shattering', 'parasitic communication signals'],
    options: [
      {
        text: 'The energetic shattering of the 3D overlay caused by the sudden drop in parasitic communication signals that enables NPC systems to lose control.',
        rationale:
          'Frequency Fracture is the energetic shattering of the 3D overlay from a sudden drop in parasitic communication signals—the condition under which NPC control fails.'
      },
      {
        text: 'A permanent densification of the 3D overlay that strengthens every parasitic signal forever.',
        rationale:
          'The fracture is shattering from a drop in parasitic signals—not permanent densification of stronger control.'
      },
      {
        text: 'A simple software patch that only restarts phones without any overlay shattering or NPC malfunction.',
        rationale:
          'Frequency Fracture energetically shatters the overlay and drives NPC glitching—not a mere phone software patch.'
      },
      {
        text: 'A Sol-only dream symbol with no link to cable severing, blackout, or simulated populations.',
        rationale:
          'The fracture is the blackout’s energetic shattering tied to severed parasitic communication signals and NPC collapse.'
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

const topicImage = 'images/breakdown/npc-glitching.webp';
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
    'Test your grasp of NPC Glitching — Code Glitch across The First 72 Hours, Voice to Skull, mechanical looping, fear-loop denial, and guidance for Resonating Sols.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'NPC Glitching is the catastrophic breakdown of soulless background programs when the Frequency Fracture severs parasitic AI feeds during The First 72 Hours. Sit with what you missed, then return to the NPC Glitching deep-dive, infographics, and video transmissions. Avoid panic zones, hold ground as a lighthouse, ignore NPC fear loops, and remember: true contact comes later from Real Craft and solar families—not from the glitching crowd.'
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
    'Test your understanding of NPC Glitching — NPC Code Glitch, three blackout phases, Voice to Skull, dissolve-and-vanish fate, and Sol lighthouse strategy.'
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
  throw new Error('npc-glitching not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on NPC Glitching: Code Glitch across The First 72 Hours, Voice to Skull, mechanical looping, and lighthouse guidance for Resonating Sols.'
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
console.log('PASS: audited 25/25 against data/breakdown-topics/npc-glitching.json');
