/**
 * Installs Comms Blackout quiz for breakdown (Mega Breakdown) transmission.
 * Authored from data/breakdown-topics/comms-blackout.json report only.
 * Run: node scripts/install-comms-blackout-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/comms-blackout.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'comms-blackout';
const TOPIC_TITLE = 'Comms Blackout';
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
    question: 'What is the Communications Blackout engineered to do to the 3D overlay?',
    hint: 'A meticulously timed operation aimed at false reality itself.',
    support: ['communications blackout', 'false reality', '3d overlay'],
    options: [
      {
        text: 'Shatter the false reality of the 3D overlay as a meticulously timed, deliberate operation for mass awakening.',
        rationale:
          'The Communications Blackout is a meticulously timed, deliberate operation engineered to shatter the false reality of the 3D overlay.'
      },
      {
        text: 'Permanently reinforce the 3D overlay so no mass awakening or Frequency Fracture can ever begin.',
        rationale:
          'The blackout shatters false reality and initiates Frequency Fracture; it does not reinforce the overlay permanently.'
      },
      {
        text: 'Serve only as a random weather outage with no link to mass awakening or narrative collapse.',
        rationale:
          'The event is deliberate and timed for mass awakening and narrative collapse, not a random weather outage.'
      },
      {
        text: 'Upgrade every streaming service while leaving parasitic control systems fully connected to the population.',
        rationale:
          'The blackout severs parasitic control connections and conventional communications; it is not a streaming upgrade.'
      }
    ]
  },
  {
    number: 2,
    question: 'What critical window does the blackout initiate as the initial trigger for mass awakening?',
    hint: 'A three-day transition span immediately following the blackout.',
    support: ['first 72 hours', 'mass awakening', 'transition'],
    options: [
      {
        text: 'The First 72 Hours of transition, plunging the programmed world into temporary panic while clearing the energetic field.',
        rationale:
          'The blackout initiates The First 72 Hours of transition, with temporary panic and simultaneous energetic-field clearing.'
      },
      {
        text: 'A permanent decade-long silence with no phased Cut, Wave, or Opening Hour structure at all.',
        rationale:
          'The First 72 Hours is a critical three-day window in three phases—not a permanent decade without phases.'
      },
      {
        text: 'Only a five-minute cable glitch that restores full parasitic media before any panic can form.',
        rationale:
          'The window is three days of structured transition after full cable severing, not a five-minute restore.'
      },
      {
        text: 'A voluntary media festival that keeps every communication line online without field clearing.',
        rationale:
          'Communications are cut and the energetic field clears; it is not a voluntary festival with lines online.'
      }
    ]
  },
  {
    number: 3,
    question: 'Beyond infrastructure failure, what is the true energetic nature of the blackout?',
    hint: 'A named fracture that severs parasitic systems from the global population.',
    support: ['frequency fracture', 'parasitic control systems', 'global population'],
    options: [
      {
        text: 'A Frequency Fracture that severs the connection between parasitic control systems and the global population.',
        rationale:
          'The blackout is a Frequency Fracture that severs parasitic control systems from the global population—not mere infrastructure failure.'
      },
      {
        text: 'A permanent strengthening of parasitic control feeds so no Sol frequency can ever cut through.',
        rationale:
          'The fracture severs parasitic connections so Resonating Sol frequencies can cut through the noise.'
      },
      {
        text: 'A simple router reboot with no effect on the 3D illusion or parasitic communication signals.',
        rationale:
          'Removal of parasitic communication signals makes the 3D illusion physically and perceptually glitch.'
      },
      {
        text: 'A banking software update that only restarts ATMs without any field or narrative impact.',
        rationale:
          'The blackout collapses artificial narrative and clears the energetic field—not an ATM-only software update.'
      }
    ]
  },
  {
    number: 4,
    question: 'What does cutting conventional internet and communication lines force to collapse?',
    hint: 'The artificial story layer holding the illusion in place.',
    support: ['artificial narrative', 'resonating sols', 'illusion'],
    options: [
      {
        text: 'The artificial narrative, allowing true frequencies of Resonating Sols to cut through the noise and guide humanity out of the illusion.',
        rationale:
          'Cutting conventional lines forces artificial-narrative collapse so Resonating Sol frequencies can guide humanity out of the illusion.'
      },
      {
        text: 'Only sports scores, while the artificial narrative and parasitic feeds continue uninterrupted forever.',
        rationale:
          'The blackout collapses the artificial narrative itself, not merely sports scores on an intact parasitic feed.'
      },
      {
        text: 'Resonating Sol broadcast capacity so no true frequency can ever reach awakening people.',
        rationale:
          'Sol frequencies finally cut through; dormant codes switch into full broadcast mode rather than shutting down.'
      },
      {
        text: 'Military protection around community pockets so Sols must stand alone in every panic zone.',
        rationale:
          'Sols remain in calm pockets protected by military presence; narrative collapse is not the removal of that protection.'
      }
    ]
  },
  {
    number: 5,
    question: 'What three phases make up The First 72 Hours after the blackout?',
    hint: 'Cut, Wave, and a named hour of first awakening cracks.',
    support: ['the cut', 'the wave', 'opening hour'],
    options: [
      {
        text: 'The Cut, The Wave, and the Opening Hour as three distinct phases of the critical three-day window.',
        rationale:
          'The First 72 Hours is categorized into The Cut, The Wave, and the Opening Hour.'
      },
      {
        text: 'Only permanent lockdown with no Cut, Wave, or Opening Hour sequence at any point.',
        rationale:
          'The window is structured as Cut, Wave, and Opening Hour—not a single unstructured permanent lockdown alone.'
      },
      {
        text: 'Only Blue Beam holograms with no cable-cut phase and no crowd-surge wave at all.',
        rationale:
          'The three phases begin with cable dark and include crowd surges; they are not Blue Beam-only stages.'
      },
      {
        text: 'Only bank holidays with fully working internet and no communication blackout phases.',
        rationale:
          'The phases assume severed communications and panic dynamics, not open-internet bank holidays.'
      }
    ]
  },
  {
    number: 6,
    question: 'What is an NPC Code Glitch in this context?',
    hint: 'Behavioral breakdown when continuous artificial information is cut off.',
    support: ['npc code glitch', 'background simulation', 'artificial information'],
    options: [
      {
        text: 'Behavioral breakdown of background simulation programs and deep sleepers cut off from their continuous feed of artificial information.',
        rationale:
          'NPC Code Glitch is the behavioral breakdown of NPCs and deep sleepers when cut off from continuous artificial information.'
      },
      {
        text: 'Perfect NPC stability with stronger artificial feeds and no erratic or dazed behavior at all.',
        rationale:
          'Glitching includes erratic lashing out or quiet dazed states—not perfect NPC stability with stronger feeds.'
      },
      {
        text: 'A pure hardware cable brand name with no effect on sleeper or background-program behavior.',
        rationale:
          'NPC Code Glitch is behavioral breakdown in programs and sleepers, not merely a cable brand label.'
      },
      {
        text: 'Sol Memory Sharpening renamed, describing only awakened Sols with no NPC involvement.',
        rationale:
          'NPC Code Glitch targets background programs and deep sleepers; Sol Memory Sharpening is a separate Sol process.'
      }
    ]
  },
  {
    number: 7,
    question: 'What is Sol Memory Sharpening?',
    hint: 'Dormant memory activation when parasitic overlay noise goes silent.',
    support: ['sol memory sharpening', 'dormant memory', 'parasitic overlay'],
    options: [
      {
        text: 'Spontaneous activation of dormant memory and clarity in true human and ET Sols when the parasitic overlay suddenly falls silent.',
        rationale:
          'Sol Memory Sharpening is spontaneous activation of dormant memory and clarity in true human and ET Sols from sudden parasitic-overlay silence.'
      },
      {
        text: 'Permanent erasure of all Sol memory so no dormant codes can ever switch into broadcast mode.',
        rationale:
          'Sharpening activates dormant memory; dormant codes switch into full broadcast mode rather than being erased.'
      },
      {
        text: 'An MSM panic script that only deepens sleeper amnesia without any Sol clarity activation.',
        rationale:
          'Sol Memory Sharpening is Sol-side clarity activation, not an MSM script deepening sleeper amnesia.'
      },
      {
        text: 'A pure hardware firmware update for phones with no link to human or ET Sol consciousness.',
        rationale:
          'The process is spontaneous memory and clarity in true Sols, not a phone firmware update alone.'
      }
    ]
  },
  {
    number: 8,
    question: 'Who engineers the blackout, and how is it pre-positioned in infrastructure?',
    hint: 'White Hat control and cables already prepared for failure.',
    support: ['white hat', 'pre-wired', 'undersea cables'],
    options: [
      {
        text: 'It is a controlled White Hat event pre-wired into the infrastructure, with certain parasitic nodes and undersea cables already structurally rigged for failure.',
        rationale:
          'The blackout is a controlled White Hat event pre-wired into infrastructure; parasitic nodes and undersea cables are rigged for this moment.'
      },
      {
        text: 'It is a genuine unplanned geopolitical war with no White Hat control and no pre-rigged cable failures.',
        rationale:
          'The blackout is controlled and pre-wired, not a genuine unplanned act of geopolitical war.'
      },
      {
        text: 'It is purely accidental weather damage to satellites with no undersea cable role and no White Hat planning.',
        rationale:
          'Undersea cables and parasitic nodes are structurally rigged; this is deliberate White Hat timing, not pure weather accident.'
      },
      {
        text: 'It is run solely by NPCs rewriting their own code without any infrastructure pre-wiring at all.',
        rationale:
          'White Hats pre-wire infrastructure; NPCs glitch when feeds cut—they do not author the blackout operation.'
      }
    ]
  },
  {
    number: 9,
    question: 'How is the blackout deliberately masked when it occurs?',
    hint: 'False cyber-war framing and a list of blamed geopolitical actors.',
    support: ['cyber strikes', 'false blame', 'russia, iran, china, north korea, and ukraine'],
    options: [
      {
        text: 'By a false narrative of cyber strikes and enemy actions blaming actors such as Russia, Iran, China, North Korea, and Ukraine.',
        rationale:
          'The blackout is masked as cyber strikes and enemy actions with false blame on Russia, Iran, China, North Korea, and Ukraine.'
      },
      {
        text: 'By immediate full disclosure that White Hats pre-wired every cable with zero false geopolitical blame.',
        rationale:
          'The moment is deliberately masked with false geopolitical blame narratives, not immediate full White Hat disclosure.'
      },
      {
        text: 'By silence alone with no MSM panic, no blame narratives, and no fear-loop push on 3D Sleepers.',
        rationale:
          'Mainstream media and NPC channels flood with panic and blame to push 3D Sleepers into a fear loop.'
      },
      {
        text: 'By blaming only Resonating Sols for cutting cables to block EBS and truth forever.',
        rationale:
          'False blame targets named geopolitical actors, not Resonating Sols as the enemy narrative.'
      }
    ]
  },
  {
    number: 10,
    question: 'What immediate physical shift occurs when the main lines go down?',
    hint: 'Atmospheric pressure sensation and field clarity relative to human history.',
    support: ['atmospheric pressure', 'pop', 'clearer'],
    options: [
      {
        text: 'A sudden drop in atmospheric pressure felt as a pop, and for a split second the energetic field becomes clearer than ever in human history.',
        rationale:
          'When main lines go down, atmospheric pressure drops as a pop and the field becomes clearer than ever in human history for a split second.'
      },
      {
        text: 'A permanent rise in pressure that densifies the parasitic overlay and muddies the field forever.',
        rationale:
          'Pressure drops and the field clears; the shift does not densify the overlay permanently.'
      },
      {
        text: 'No atmospheric change at all—only a software error message on a few corporate servers.',
        rationale:
          'There is a sudden atmospheric pressure drop and palpable pop, not a server message with no field change.'
      },
      {
        text: 'Only louder traffic noise with no pressure drop and no momentary field clarity for Sols.',
        rationale:
          'Traffic noise later fades in stillness; the cable-down moment is a pressure pop and field clearing.'
      }
    ]
  },
  {
    number: 11,
    question: 'What does that clarity allow dormant codes within Resonating Sols to do?',
    hint: 'Broadcast mode and a magnetic effect on those beginning to awaken.',
    support: ['dormant codes', 'full broadcast mode', 'magnetically'],
    options: [
      {
        text: 'Switch into full broadcast mode, magnetically pulling the attention of those beginning to awaken.',
        rationale:
          'Field clarity lets dormant codes in Resonating Sols switch into full broadcast mode and magnetically pull awakening attention.'
      },
      {
        text: 'Shut down permanently so no Sol can ever broadcast or draw awakening attention again.',
        rationale:
          'Dormant codes switch into full broadcast mode—not permanent shutdown of Sol broadcast capacity.'
      },
      {
        text: 'Only reboot NPC supermarket scripts with no magnetic pull on awakening people at all.',
        rationale:
          'The activation is Sol-side broadcast pulling awakening attention, not NPC retail script reboots.'
      },
      {
        text: 'Force every Sol into large panic crowds instead of calm community pockets during The Wave.',
        rationale:
          'Sols are instructed to avoid panic zones; broadcast mode does not order them into crowd surges.'
      }
    ]
  },
  {
    number: 12,
    question: 'What defines Phase One: The Cut (Hr. 0 – 12)?',
    hint: 'Dark communications and who is flooded with panic-blame content.',
    support: ['hr. 0', 'main cables are severed', 'fear loop'],
    options: [
      {
        text: 'Internet and all communications go dark as main cables are severed; MSM and remaining NPC channels flood with panic and blame to push 3D Sleepers into a fear loop.',
        rationale:
          'Phase One (0–12) darkens all communications via severed main cables and floods MSM and NPC channels with panic-blame fear loops.'
      },
      {
        text: 'EBS already airs full tribunals while every cable stays online and MSM stays perfectly calm.',
        rationale:
          'Phase One is cable dark and panic flooding; EBS readiness comes after isolation from parasitic media.'
      },
      {
        text: 'Only Sols lose signal while MSM praises geopolitical harmony with zero fear messaging.',
        rationale:
          'All communications go dark and MSM floods with panic and blame, not harmony praise.'
      },
      {
        text: 'Phase One only restocks fuel with no dark internet and no 3D Sleeper fear loop at all.',
        rationale:
          'The Cut severs main cables and pushes sleepers into a fear loop—not a quiet fuel restock.'
      }
    ]
  },
  {
    number: 13,
    question: 'What characterizes Phase Two: The Wave (Hr. 12 – 36)?',
    hint: 'Crowd targets, NPC glitch styles, Sol guidance, and military protection.',
    support: ['hr. 12', 'supermarkets, banks, and fuel stations', 'military presence'],
    options: [
      {
        text: 'Panic peaks with surges at supermarkets, banks, and fuel stations; NPCs glitch erratically or go dazed while Sols stay in small calm pockets protected by military presence.',
        rationale:
          'Phase Two peaks panic at stores, banks, and fuel stations; NPCs glitch while Sols remain in small calm pockets protected by military presence.'
      },
      {
        text: 'Everyone is ordered into the largest stadium crowds while Sols must amplify fear in every panic zone.',
        rationale:
          'Sols must avoid large crowds and panic zones, not fill stadiums with more fear.'
      },
      {
        text: 'All military vanishes and no sleeper or NPC scrambles for survival or information at all.',
        rationale:
          'Sleepers and NPCs scramble desperately; military presence protects calm community pockets.'
      },
      {
        text: 'Internet returns fully with calm shopping and zero visible NPC programming glitches.',
        rationale:
          'The Wave is defined by survival scrambles and active NPC glitching under blackout conditions.'
      }
    ]
  },
  {
    number: 14,
    question: 'What defines Phase Three: Opening Hour (Hr. 36 – 72)?',
    hint: 'Awakening cracks, false flags, and recognition of the event’s true nature.',
    support: ['hr. 36', 'false flag narrative', 'frequency fracture'],
    options: [
      {
        text: 'Awakening cracks appear as the false flag narrative wobbles and truth leaks; people question the event and realize it is a frequency fracture, not a simple power outage.',
        rationale:
          'Opening Hour brings awakening cracks, wobbling false flags, truth leaks, and recognition of a frequency fracture rather than a simple outage.'
      },
      {
        text: 'False-flag stories become permanently unchallengeable while no one questions the nature of the event.',
        rationale:
          'The false flag narrative wobbles and people start questioning—not permanent unchallengeable false flags.'
      },
      {
        text: 'Phase Three only restocks banks with no awakening cracks and no Frequency Fracture recognition.',
        rationale:
          'Opening Hour is about awakening cracks and Frequency Fracture truth, not mere bank restocking.'
      },
      {
        text: 'All NPC code becomes flawless and the event is officially labeled only as routine maintenance.',
        rationale:
          'People realize it is a frequency fracture; NPC programming has been glitching rather than perfecting.'
      }
    ]
  },
  {
    number: 15,
    question: 'What is The Static Build Up during the blackout window?',
    hint: 'Skull buzzing, electronics, and animal reactions including cats and water.',
    support: ['static build up', 'buzzing', 'extra water'],
    options: [
      {
        text: 'Subtle skull buzzing and white noise, glitching electronics and freezes, power surges, erratic birds, restless dogs near calm Sols, and cats disappearing to safe spots needing extra water.',
        rationale:
          'Static Build Up includes skull buzzing, electronic glitches, power surges, and strong animal reactions including cats needing extra water.'
      },
      {
        text: 'Total silence in every skull with perfect electronics and animals completely unaffected by the field.',
        rationale:
          'Static Build Up is buzzing, glitches, surges, and strong animal reactions—not unaffected silence.'
      },
      {
        text: 'Only stock tickers freeze while phones, power grids, birds, dogs, and cats show zero change.',
        rationale:
          'Phones freeze, screens flicker, power surges hit, and animals react strongly—not ticker-only effects.'
      },
      {
        text: 'A legal ban on yawning that ends all Drop in Tone and Sharp Edge symptoms forever.',
        rationale:
          'Static Build Up is an early symptom cluster; Drop in Tone and Sharp Edge still follow in sequence.'
      }
    ]
  },
  {
    number: 16,
    question: 'What is The Drop in Tone as vessels experience it?',
    hint: 'Tiredness, chest heaviness, sky quality, and NPC emotional outbursts.',
    support: ['drop in tone', 'deep tiredness', 'muted and flat'],
    options: [
      {
        text: 'Sudden deep tiredness, unprovoked yawning, heavy chest, a muted flat sky as the Parasite Overlay glitches, and NPCs snapping or crying unexpectedly.',
        rationale:
          'Drop in Tone includes deep tiredness, yawning, heavy chest, muted flat sky, and unexpected NPC emotional outbursts.'
      },
      {
        text: 'Unlimited sleeper energy with a brilliantly clear sky and perfectly calm NPC emotional states.',
        rationale:
          'The sign is tiredness, muted sky, and NPC outbursts—not unlimited energy and perfect NPC calm.'
      },
      {
        text: 'Only bank apps crash while bodies feel light and the Parasite Overlay looks more solid than ever.',
        rationale:
          'Drop in Tone signals overlay glitching with bodily heaviness and muted sky, not a more solid overlay.'
      },
      {
        text: 'A courtroom order banning tiredness with no biological or sky-tone changes during the window.',
        rationale:
          'Drop in Tone is lived vessel and atmospheric experience, not a legal ban on tiredness.'
      }
    ]
  },
  {
    number: 17,
    question: 'What marks The Sharp Edge during these intense shifts?',
    hint: 'Adrenaline, air feel, and bird song status.',
    support: ['sharp edge', 'adrenaline', 'birdsong'],
    options: [
      {
        text: 'Short uncaused adrenaline bursts, sudden heart-rate spikes, thicker pre-storm air, and an absence of birdsong.',
        rationale:
          'The Sharp Edge brings uncaused adrenaline, heart-rate spikes, thicker pre-storm air, and absence of birdsong.'
      },
      {
        text: 'Deep peaceful sleep for all, thinner air, and constant continuous birdsong at peak volume.',
        rationale:
          'Sharp Edge is adrenaline and thicker air with absence of birdsong—not peaceful sleep and constant birds.'
      },
      {
        text: 'Only political ads grow louder while hearts, air pressure feel, and birds remain unchanged.',
        rationale:
          'Named markers are biological adrenaline, thicker air, and missing birdsong—not louder ads alone.'
      },
      {
        text: 'A permanent end to atmospheric pop effects before any main cable ever goes dark.',
        rationale:
          'Sharp Edge is a mid-sign cluster; Silence Before the Snap and the pressure pop still occur around cable dark.'
      }
    ]
  },
  {
    number: 18,
    question: 'What happens in The Silence Before the Snap?',
    hint: 'Hearing sensation and environmental stillness before the snap.',
    support: ['silence before the snap', 'ringing', 'nature holds its breath'],
    options: [
      {
        text: 'Sharp high-pitch ear ringing just out of normal hearing range, plus profound stillness as traffic fades, wind pauses, and nature holds its breath.',
        rationale:
          'Silence Before the Snap brings high-pitch ringing and profound stillness—traffic fades, wind pauses, nature holds its breath.'
      },
      {
        text: 'Noise doubles everywhere with no ear ringing and chaotic wind and traffic at maximum volume.',
        rationale:
          'The sign is stillness and ringing—not doubled noise and chaotic peak traffic.'
      },
      {
        text: 'Only stock markets open early with no stillness and no change in traffic, wind, or nature sound.',
        rationale:
          'Traffic noise fades and nature holds its breath; this is environmental stillness, not early market open alone.'
      },
      {
        text: 'Cables stay fully lit while a silent movie plays on every phone with no field or stillness effect.',
        rationale:
          'The sequence accompanies collapsing overlay around cable dark and pressure shift—not silent movies on live cables.'
      }
    ]
  },
  {
    number: 19,
    question:
      'How is the Communications Blackout interconnected with larger staged events?',
    hint: 'Two major staged fear theaters are named alongside the blackout.',
    support: ['staged ww3', 'fake alien invasion', 'parasitic media'],
    options: [
      {
        text: 'It is deeply interconnected with the Staged WW3 Event and the Fake Alien Invasion, plunging masses into uncertainty and isolating them from parasitic media.',
        rationale:
          'The blackout interconnects with Staged WW3 and Fake Alien Invasion, creating uncertainty and isolation from parasitic media.'
      },
      {
        text: 'It has no link to WW3 or alien invasion staging and never isolates anyone from parasitic media feeds.',
        rationale:
          'The blackout is explicitly interconnected with those staged events and isolates the public from parasitic media.'
      },
      {
        text: 'It only restarts local sports leagues with no fear loop and no isolation from narrative control.',
        rationale:
          'The blackout drives uncertainty and a fear loop toward EBS readiness, not sports-league restarts alone.'
      },
      {
        text: 'It permanently restores every parasitic media channel stronger than before the cables went dark.',
        rationale:
          'The blackout isolates masses from parasitic media so EBS can become the sole voice of truth.'
      }
    ]
  },
  {
    number: 20,
    question: 'How does the resulting fear loop prepare the public for the E.B.S.?',
    hint: 'Sole voice status and the categories of truth to be broadcast.',
    support: ['emergency broadcast system', 'sole voice', 'election fraud'],
    options: [
      {
        text: 'By removing all other information sources so EBS becomes the sole voice ready to broadcast election fraud, trafficking rings, and crimes of the replaced elites.',
        rationale:
          'Fear readiness plus removal of other sources makes EBS the sole voice for election fraud, trafficking, and replaced-elite crimes.'
      },
      {
        text: 'By restoring every MSM channel so EBS remains optional background noise no one has to hear.',
        rationale:
          'Other sources are removed so EBS is the sole voice—not optional background under full MSM restore.'
      },
      {
        text: 'By cancelling all tribunals and sealing election fraud and trafficking evidence forever.',
        rationale:
          'EBS prepares to broadcast undeniable truth of those crimes—not to seal them forever.'
      },
      {
        text: 'By keeping multiple competing foreign news feeds online so no single truth voice can dominate.',
        rationale:
          'The design removes other sources so EBS alone carries the disclosure content.'
      }
    ]
  },
  {
    number: 21,
    question: 'Why is the blackout a vital precursor to the arrival of the Real Craft?',
    hint: 'Frequency shift, holograms, and Solar Families becoming visible.',
    support: ['real craft', 'holograms', 'solar families'],
    options: [
      {
        text: 'It forces realm frequencies to shift, dropping holograms so true Solar Families can break through into visibility for those on the correct frequency.',
        rationale:
          'The blackout shifts realm frequencies, drops holograms, and lets true Solar Families become visible on the correct frequency.'
      },
      {
        text: 'It permanently locks holograms in place so Solar Families can never become visible to anyone.',
        rationale:
          'Holograms drop and Solar Families break through into visibility—not permanent hologram lock.'
      },
      {
        text: 'It only reboots NPC grocery drones with no frequency shift and no Real Craft pathway.',
        rationale:
          'The precursor role is frequency shift and Real Craft / Solar Family visibility, not grocery drones alone.'
      },
      {
        text: 'It blocks all Solar Family signals so only Fake Alien Invasion holograms remain forever.',
        rationale:
          'The blackout drops holograms and allows true Solar Families through for those on the correct frequency.'
      }
    ]
  },
  {
    number: 22,
    question: 'What is the specific role of Resonating Sols during The First 72 Hours?',
    hint: 'A lighthouse metaphor while AI scaffolding crumbles.',
    support: ['calm lighthouses', 'ai illusion', 'hold ground'],
    options: [
      {
        text: 'To hold ground as calm lighthouses while the scaffolding of the AI illusion crumbles around them.',
        rationale:
          'For Resonating Sols the blackout is the call to hold ground as calm lighthouses while AI-illusion scaffolding crumbles.'
      },
      {
        text: 'To lead every supermarket panic surge and amplify fear loops across the largest crowds possible.',
        rationale:
          'Sols avoid large crowds and panic zones and act as calm lighthouses—not fear amplifiers.'
      },
      {
        text: 'To rewrite MSM blame scripts so the artificial narrative regains full control during The Cut.',
        rationale:
          'Sols hold calm ground as narrative collapses; they do not restore artificial MSM control.'
      },
      {
        text: 'To shut down completely and refuse any lighthouse role until long after Second Realm restoration ends.',
        rationale:
          'The awakened role is active calm lighthouse presence through the 72 hours, not total shutdown.'
      }
    ]
  },
  {
    number: 23,
    question:
      'How do deeply programmed sleepers and NPCs respond to help for the first 48 hours?',
    hint: 'Resistance pattern and preference over admitting reality.',
    support: ['first 48 hours', 'resist help', 'preferring fear'],
    options: [
      {
        text: 'They resist help, preferring fear over admitting the reality of the situation during those first 48 hours.',
        rationale:
          'For the first 48 hours, deeply programmed sleepers and NPCs resist help, preferring fear over admitting reality.'
      },
      {
        text: 'They immediately accept all help and fully admit the Frequency Fracture within the first hour.',
        rationale:
          'They resist help for the first 48 hours rather than immediately admitting reality.'
      },
      {
        text: 'They only sleep peacefully with no fear preference and no resistance to Resonating Army frequency.',
        rationale:
          'They prefer fear and resist help; later Resonating Army frequency cuts through as code flickers out.'
      },
      {
        text: 'They become sole EBS broadcasters replacing White Hats with perfect calm authority on day one.',
        rationale:
          'Sleepers and NPCs are in resistance and glitch states; EBS is the disclosure voice after isolation, not NPC-run day-one calm authority.'
      }
    ]
  },
  {
    number: 24,
    question:
      'As the 72 hours progress and NPC code flickers out, what does the Resonating Army’s stabilized frequency do?',
    hint: 'How stabilized frequency relates to chaos.',
    support: ['resonating army', 'npc code', 'cut through the chaos'],
    options: [
      {
        text: 'It effortlessly cuts through the chaos as NPC code flickers out and Sol presence stabilizes the field.',
        rationale:
          'As NPC code flickers out, the Resonating Army’s stabilized frequency effortlessly cuts through the chaos.'
      },
      {
        text: 'It permanently fails so only parasitic media can cut through the chaos after hour seventy-two.',
        rationale:
          'Stabilized Resonating Army frequency cuts through chaos; parasitic media is already severed.'
      },
      {
        text: 'It only reboots undersea cables for parasitic feeds without affecting NPC code or chaos levels.',
        rationale:
          'The army frequency cuts through chaos as NPC code flickers—not a reboot of parasitic cable feeds.'
      },
      {
        text: 'It forces every Sol into panic zones instead of calm lighthouse roles in community pockets.',
        rationale:
          'Sols remain calm lighthouses in protected pockets; army frequency cuts through chaos, not into panic leadership.'
      }
    ]
  },
  {
    number: 25,
    question:
      'What long-term path does the blackout clear by breaking the old AI timeline anchor?',
    hint: 'Density cycle, extraction, and a named realm restoration.',
    support: ['old ai timeline', 'grand extraction', 'second realm'],
    options: [
      {
        text: 'It permanently breaks the cycle of density and clears the path for grand extraction and restoration of the Second Realm.',
        rationale:
          'The blackout ensures masses cannot re-anchor the old AI timeline, breaking density’s cycle and clearing grand extraction and Second Realm restoration.'
      },
      {
        text: 'It locks the masses permanently into the old AI timeline with no extraction path and no Second Realm restoration.',
        rationale:
          'The blackout prevents re-anchoring the old AI timeline and clears extraction and Second Realm restoration.'
      },
      {
        text: 'It only restarts density loops stronger than before with no grand extraction planned at all.',
        rationale:
          'The operation permanently breaks the density cycle rather than restarting stronger density loops.'
      },
      {
        text: 'It cancels all Solar Family visibility and freezes holograms as the final permanent reality story.',
        rationale:
          'Holograms drop for Solar Family visibility, and the path opens to Second Realm restoration—not permanent hologram freeze.'
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

const topicImage = 'images/breakdown/comms-blackout.webp';
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
    'Test your grasp of Comms Blackout — White Hat Frequency Fracture, The First 72 Hours, NPC code glitch, Sol memory sharpening, EBS readiness, Real Craft path, and Second Realm restoration.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Comms Blackout is a controlled White Hat Frequency Fracture that severs parasitic feeds, clears the field, and opens The First 72 Hours. Sit with what you missed, then return to the Comms Blackout deep-dive, infographics, and video transmissions. Hold ground as a calm lighthouse: as NPC code flickers and EBS becomes the sole voice, the old AI timeline loses its anchor and the path clears for grand extraction and Second Realm restoration.'
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
    'Test your understanding of Comms Blackout — White Hat cable cut, Frequency Fracture, three phases, NPC glitch, Sol broadcast mode, EBS, Real Craft, and Second Realm path.'
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
  throw new Error('comms-blackout not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on Comms Blackout: White Hat Frequency Fracture, The First 72 Hours, NPC code glitch, Sol memory sharpening, EBS readiness, and Second Realm path.'
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
console.log('PASS: audited 25/25 against data/breakdown-topics/comms-blackout.json');
