/**
 * Installs The First 72 Hours quiz for breakdown (Mega Breakdown) transmission.
 * Authored from data/breakdown-topics/the-first-72-hours.json report only.
 * Run: node scripts/install-the-first-72-hours-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/the-first-72-hours.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'the-first-72-hours';
const TOPIC_TITLE = 'The First 72 Hours';
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
    question:
      'What is the strategic design of the first 72 hours of the blackout timeline?',
    hint: 'A surgical window aimed at the third-density parasitic overlay.',
    support: ['surgical', 'parasitic overlay', '72 hours'],
    options: [
      {
        text: 'A surgical, highly orchestrated window designed to dismantle the third-density parasitic overlay.',
        rationale:
          'The first 72 hours is a surgical, highly orchestrated window built to dismantle the third-density parasitic overlay.'
      },
      {
        text: 'An accidental cable outage with no orchestration and no effect on the parasitic overlay at all.',
        rationale:
          'The window is deliberately orchestrated to dismantle the overlay, not an accidental outage without design.'
      },
      {
        text: 'A permanent media festival that strengthens MSM narrative control for decades without any blackout.',
        rationale:
          'Communications are severed and MSM floods with panic; the goal is overlay dismantling, not permanent MSM strength.'
      },
      {
        text: 'A voluntary internet upgrade that only improves streaming quality for sleepers worldwide.',
        rationale:
          'Main cables are severed and fear loops are engineered; it is not a voluntary streaming upgrade.'
      }
    ]
  },
  {
    number: 2,
    question:
      'How does this period push the public into a confusion and fear loop?',
    hint: 'Cable action paired with false blame on named geopolitical targets.',
    support: ['severing main communication cables', 'russia, china, and iran', 'fear loop'],
    options: [
      {
        text: 'By severing main communication cables and pushing false blame narratives onto targets like Russia, China, and Iran.',
        rationale:
          'Panic and a fear loop are driven by severed main cables plus false blame narratives toward Russia, China, and Iran.'
      },
      {
        text: 'By restoring every cable immediately and praising only local weather reports with no geopolitical blame.',
        rationale:
          'Cables go dark and false geopolitical blame floods channels; cables are not immediately restored for calm weather talk.'
      },
      {
        text: 'By silencing MSM completely so no panic or blame narratives can ever air during the window.',
        rationale:
          'MSM and NPC channels are flooded with panic and blame narratives, not silenced into total quiet.'
      },
      {
        text: 'By offering free banking apps that keep sleepers fully online without any confusion or fear.',
        rationale:
          'The public is plunged into confusion and fear through blackout and false blame, not free apps that keep them calm online.'
      }
    ]
  },
  {
    number: 3,
    question: 'What necessary conditions does this blackout establish?',
    hint: 'Mass glitching, cracked false reality, and what must follow next.',
    support: ['mass glitching', 'false reality', 'truth broadcasts'],
    options: [
      {
        text: 'Mass glitching of background programs and cracks in false reality, establishing conditions for incoming truth broadcasts.',
        rationale:
          'The blackout initiates mass glitching of background programs and cracks false reality so truth broadcasts can land.'
      },
      {
        text: 'Perfect NPC stability and a stronger false reality that blocks all future truth broadcasts forever.',
        rationale:
          'Background programs glitch and false reality cracks; the design prepares for truth broadcasts, not permanent blockage.'
      },
      {
        text: 'Only better sports coverage with no effect on background programs or the false reality construct.',
        rationale:
          'The blackout targets simulation scaffolding and false reality, not improved sports coverage.'
      },
      {
        text: 'Immediate full extraction of every sleeper with no glitching and no need for later EBS disclosures.',
        rationale:
          'The window sets conditions for truth broadcasts and later EBS; it is not instant extraction of all sleepers without process.'
      }
    ]
  },
  {
    number: 4,
    question: 'What is The Cut in this topic’s timeline?',
    hint: 'A named initial phase measured in hours, not the full 72-hour span.',
    support: ['the cut', '12-hour', 'completely dark'],
    options: [
      {
        text: 'The initial 12-hour phase where internet and communications go completely dark due to severed main cables.',
        rationale:
          'The Cut is the initial 12-hour phase when internet and communications go completely dark from severed main cables.'
      },
      {
        text: 'The final year of reconstruction when every cable is restored and no one questions the narrative.',
        rationale:
          'The Cut is the first 12 hours of dark communications, not a final reconstruction year of restored cables.'
      },
      {
        text: 'A permanent blackout lasting decades with no Opening Hour or later truth-leak phase at all.',
        rationale:
          'The Cut is a 12-hour opening phase inside a 72-hour window that continues into Wave and Opening Hour.'
      },
      {
        text: 'Only a supermarket restock drill with fully working phones and uninterrupted MSM calm.',
        rationale:
          'The Cut darkens internet and communications via severed cables; it is not a calm restock drill with working phones.'
      }
    ]
  },
  {
    number: 5,
    question: 'What is the Frequency Fracture?',
    hint: 'The true energetic nature of the blackout and what it does to memory.',
    support: ['frequency fracture', 'parasitic overlay', 'true memory'],
    options: [
      {
        text: 'The true energetic nature of the blackout, causing the parasitic overlay to wobble and crack while true memory sharpens.',
        rationale:
          'Frequency Fracture is the blackout’s true energetic nature: the parasitic overlay wobbles and cracks, and true memory sharpens.'
      },
      {
        text: 'A simple software patch that only restarts routers without any overlay crack or memory change.',
        rationale:
          'Frequency Fracture is energetic overlay collapse and memory sharpening, not a mere router software patch.'
      },
      {
        text: 'A permanent densification of the parasitic overlay so Sol memory can never sharpen again.',
        rationale:
          'The fracture cracks the overlay and allows true memory to sharpen; it does not densify the overlay permanently.'
      },
      {
        text: 'A sports-media slogan with no atmospheric pop, NPC glitching, or biological symptoms attached.',
        rationale:
          'Frequency Fracture drives environmental and biological signs plus NPC glitching—not an empty media slogan.'
      }
    ]
  },
  {
    number: 6,
    question: 'What are NPCs in this 72-hour context?',
    hint: 'Background programs, soul status, and blackout behavior.',
    support: ['npc', 'background programs', 'lacking true souls'],
    options: [
      {
        text: 'Non-player characters — background programs lacking true souls that hold the simulation together and glitch erratically during the blackout.',
        rationale:
          'NPCs are background programs lacking true souls; they hold the simulation together and glitch heavily during the blackout.'
      },
      {
        text: 'Fully resonating Sols whose memory always stays sharp and who never show erratic blackout behavior.',
        rationale:
          'Sols are true resonating souls; NPCs lack true souls and exhibit erratic glitching behavior.'
      },
      {
        text: 'Only Whitehat commanders who never glitch and solely author every EBS disclosure script.',
        rationale:
          'NPCs are simulation background programs that glitch; Whitehats orchestrate lockdown and EBS separately.'
      },
      {
        text: 'Physical cables themselves with no behavioral glitching, aggression, or dazed quiet states.',
        rationale:
          'NPCs are programs in vessels that lash out or go quiet and dazed; they are not the cables alone.'
      }
    ]
  },
  {
    number: 7,
    question: 'What is a Sol during these hours?',
    hint: 'Origin spark in a vessel and what happens to its memory.',
    support: ['sol', 'resonating soul', 'memory sharpens'],
    options: [
      {
        text: 'A true resonating soul or spark of origin in a physical vessel whose memory sharpens as the blackout progresses.',
        rationale:
          'A Sol is a true resonating soul or origin spark in a vessel; memory sharpens as the blackout progresses.'
      },
      {
        text: 'A background program without a true soul that only holds the simulation and never carries origin memory.',
        rationale:
          'That describes NPCs; Sols are true resonating souls whose memory sharpens through the fracture.'
      },
      {
        text: 'A pure MSM news desk with no consciousness and no role anchoring light in the field.',
        rationale:
          'Sols are conscious resonating sparks instructed to hold ground and anchor light, not MSM desks.'
      },
      {
        text: 'An elite parasite permanently immune to Frequency Fracture and later truth broadcasts.',
        rationale:
          'Sols awaken as the overlay cracks; they are not parasites immune to the 72-hour fracture.'
      }
    ]
  },
  {
    number: 8,
    question: 'What is MSM during the initial phases?',
    hint: 'Mainstream channels and the content they are flooded with.',
    support: ['msm', 'mainstream media', 'panic and blame'],
    options: [
      {
        text: 'Mainstream media channels flooded with panic and blame narratives during the initial phases of the window.',
        rationale:
          'MSM means mainstream media channels flooded with panic and blame narratives in the initial phases.'
      },
      {
        text: 'Military-only private radios that never speak to the public and never air any panic content.',
        rationale:
          'MSM is mainstream public media flooded with panic and blame, not silent private military radio only.'
      },
      {
        text: 'Crystal-healing podcasts that only teach calm with zero geopolitical false-blame messaging.',
        rationale:
          'MSM is flooded with panic and false blame toward geopolitical actors, not calm-only crystal podcasts.'
      },
      {
        text: 'A single offline library book with no role in the fear loop or public confusion at all.',
        rationale:
          'MSM channels actively flood the public with panic narratives that deepen the confusion and fear loop.'
      }
    ]
  },
  {
    number: 9,
    question: 'Why is the 72-hour window more than a simple communications failure?',
    hint: 'Engineered energetic nature paired with manufactured geopolitical fear.',
    support: ['engineered frequency fracture', 'geopolitical fear', 'npc programming'],
    options: [
      {
        text: 'It is an engineered Frequency Fracture paired with manufactured geopolitical fear to glitch NPC programming and shake sleepers into questioning reality.',
        rationale:
          'The window is an engineered Frequency Fracture; lost access plus manufactured fear glitches NPCs and shakes sleepers to question reality.'
      },
      {
        text: 'It is only a random weather outage with no fear manufacturing and no effect on NPC programming.',
        rationale:
          'The outage is engineered with manufactured geopolitical fear to glitch NPCs—not a random weather failure.'
      },
      {
        text: 'It permanently freezes Sol memory and perfects every NPC script without any reality questioning.',
        rationale:
          'Sol memory sharpens and NPCs glitch while people begin questioning narratives—not frozen Sols and perfect NPCs.'
      },
      {
        text: 'It only upgrades banking apps while MSM stays calm and the artificial intelligence scaffolding stays intact.',
        rationale:
          'Artificial intelligence scaffolding crumbles and MSM floods with panic; this is not a calm banking-app upgrade.'
      }
    ]
  },
  {
    number: 10,
    question: 'What must resonating Sols do as the artificial intelligence scaffolding crumbles?',
    hint: 'A posture of calm ground-holding is named.',
    support: ['hold their ground calmly', 'artificial intelligence scaffolding'],
    options: [
      {
        text: 'Hold their ground calmly while the artificial intelligence scaffolding crumbles around the field.',
        rationale:
          'Throughout these hours, resonating Sols must hold their ground calmly as the artificial intelligence scaffolding crumbles.'
      },
      {
        text: 'Lead every supermarket panic surge and amplify fear loops across the largest possible crowds.',
        rationale:
          'Sols must avoid large crowds and panic zones and hold calm ground—not lead fear surges.'
      },
      {
        text: 'Shut down completely and refuse to anchor any light until long after EBS ends.',
        rationale:
          'Sols hold calm ground so they can later anchor light as the frequency fracture clears the stage.'
      },
      {
        text: 'Rewrite MSM scripts to restore full parasitic narrative control during The Cut.',
        rationale:
          'Sols hold calm presence as scaffolding crumbles; they do not restore parasitic MSM control.'
      }
    ]
  },
  {
    number: 11,
    question: 'What environmental culmination leaves the energetic field clearer than ever?',
    hint: 'A named atmospheric sensation when pressure shifts.',
    support: ['pop', 'atmosphere', 'energetic field'],
    options: [
      {
        text: 'A palpable pop in the atmosphere that leaves the energetic field clearer than ever before.',
        rationale:
          'The environment shifts toward a palpable atmospheric pop that leaves the energetic field clearer than ever.'
      },
      {
        text: 'A permanent fog that densifies the parasitic overlay and muddies the energetic field forever.',
        rationale:
          'The pop clears the field; it does not densify the overlay or permanently muddy the field.'
      },
      {
        text: 'Only louder traffic noise with no pressure drop and no clearing of the energetic field.',
        rationale:
          'Traffic noise fades into stillness before the pressure drop and pop that clear the field.'
      },
      {
        text: 'A silent legal memo with no lived atmospheric or biological experience for anyone on the ground.',
        rationale:
          'The pop is a lived atmospheric pressure event felt in the environment, not a paper memo alone.'
      }
    ]
  },
  {
    number: 12,
    question: 'What defines Phase One: The Cut (Hours 0 – 12)?',
    hint: 'Dark communications and who gets flooded with panic-blame content.',
    support: ['hours 0', 'msm and npc channels', 'russia, china, iran'],
    options: [
      {
        text: 'Internet and communications go dark as cables are severed; MSM and NPC channels flood with panic and false blame toward Russia, China, and Iran.',
        rationale:
          'Phase One (0–12) darkens communications via severed cables and floods MSM and NPC channels with panic and false blame at Russia, China, and Iran.'
      },
      {
        text: 'EBS already airs full tribunals while every cable stays online and MSM stays perfectly calm.',
        rationale:
          'Phase One is cable dark and panic-blame flooding; EBS comes after this catalyst window and Whitehat lockdown setup.'
      },
      {
        text: 'Only Sols lose signal while MSM praises geopolitical harmony with zero fear messaging.',
        rationale:
          'Communications go dark broadly and MSM floods with panic and false blame, not harmony praise.'
      },
      {
        text: 'Phase One only restocks fuel with no dark internet and no confusion-and-fear loop for the public.',
        rationale:
          'The public is pushed into a deep loop of confusion and fear as internet goes dark—not a quiet fuel restock.'
      }
    ]
  },
  {
    number: 13,
    question: 'What characterizes Phase Two: The Wave (Hours 12 – 36)?',
    hint: 'Crowd targets, NPC glitch styles, and Sol guidance.',
    support: ['hours 12', 'supermarkets, banks, and fuel stations', 'small pockets'],
    options: [
      {
        text: 'Crowd surges hit supermarkets, banks, and fuel stations; NPCs glitch with aggression or dazed quiet while Sols avoid crowds in small community pockets.',
        rationale:
          'Phase Two brings surges at stores, banks, and fuel stations; NPCs glitch aggressively or dazed while Sols stay in small community pockets.'
      },
      {
        text: 'Everyone is ordered into the largest stadium crowds while Sols must amplify panic in every zone.',
        rationale:
          'Sols are instructed to avoid large crowds and panic zones, not to fill stadiums with more panic.'
      },
      {
        text: 'All military vanishes and no sleeper or NPC scrambles for survival or information at all.',
        rationale:
          'Sleepers and NPCs scramble for survival and information; NPC-controlled military is visible nearby.'
      },
      {
        text: 'Internet returns fully with calm shopping and zero visible NPC programming glitches.',
        rationale:
          'The Wave is defined by survival scrambles and visible NPC glitching under blackout conditions.'
      }
    ]
  },
  {
    number: 14,
    question: 'How do military forces appear during Phase Two?',
    hint: 'Control type and positioning relative to the public.',
    support: ['npc-controlled military', 'visible', 'stationed nearby'],
    options: [
      {
        text: 'NPC-controlled military forces will be visible and stationed nearby during the wave of surges.',
        rationale:
          'During Phase Two, NPC-controlled military forces are visible and stationed nearby.'
      },
      {
        text: 'No military presence appears until years after the full 72-hour window has already ended.',
        rationale:
          'Military is visible and nearby in Phase Two as part of the 12–36 hour wave dynamics.'
      },
      {
        text: 'Only Resonating Sols form every uniformed unit on every street with no NPC-controlled forces.',
        rationale:
          'Forces are NPC-controlled and stationed nearby; Sols remain in small community pockets.'
      },
      {
        text: 'Military exists only as a radio slogan with no street visibility during The Wave at all.',
        rationale:
          'Military forces are visible and stationed nearby, not merely an invisible slogan.'
      }
    ]
  },
  {
    number: 15,
    question: 'What defines Phase Three: Opening Hour (Hours 36 – 72)?',
    hint: 'Awakening cracks, false flags, and Sol memory versus NPC code.',
    support: ['hours 36', 'questioning the narrative', 'sol memory sharpens'],
    options: [
      {
        text: 'Awakening cracks open as people heavily question the narrative; false flags fall, truth leaks that the event is a Frequency Fracture, Sol memory sharpens, and NPC code flickers.',
        rationale:
          'Opening Hour (36–72) brings heavy narrative questioning, falling false flags, Frequency Fracture truth leaks, sharpened Sol memory, and flickering NPC code.'
      },
      {
        text: 'False-flag stories become permanently unchallengeable while Sol memory is fully erased for all time.',
        rationale:
          'False flags wobble and fall while Sol memory sharpens—not permanent false flags and erased Sol memory.'
      },
      {
        text: 'Phase Three only restocks banks with no awakening cracks and no recognition of a Frequency Fracture.',
        rationale:
          'Opening Hour is about awakening cracks and Frequency Fracture truth, not mere bank restocking.'
      },
      {
        text: 'All NPC code becomes flawless and no one questions MSM panic narratives during these hours.',
        rationale:
          'People heavily question the narrative and NPC code flickers rather than perfecting itself.'
      }
    ]
  },
  {
    number: 16,
    question: 'What is The Static Build-Up during the 72 hours?',
    hint: 'Skull sensation, electronics, grid, and animal behavior including cats.',
    support: ['static build-up', 'buzzing', 'cats disappear'],
    options: [
      {
        text: 'Subtle skull buzzing like white noise, glitching electronics and freezes, power surges, erratic birds, restless dogs near calm people, and cats disappearing to safe spots needing extra water.',
        rationale:
          'Static Build-Up includes skull buzzing, electronic glitches, power surges, and animal reactions including cats needing extra water in safe spots.'
      },
      {
        text: 'Total silence in every skull with perfect electronics and animals completely unaffected by the field.',
        rationale:
          'Static Build-Up is buzzing, glitches, surges, and strong animal reactions—not unaffected silence.'
      },
      {
        text: 'Only stock tickers freeze while phones, power grids, birds, dogs, and cats show zero change.',
        rationale:
          'Phones freeze or flicker, power surges hit the grid, and animals react strongly—not ticker-only effects.'
      },
      {
        text: 'A legal ban on yawning that ends all later Drop in Tone and Sharp Edge symptoms forever.',
        rationale:
          'Static Build-Up is an early symptom cluster; Drop in Tone and Sharp Edge still follow in the sequence.'
      }
    ]
  },
  {
    number: 17,
    question: 'What is The Drop in Tone as experienced in these hours?',
    hint: 'Body heaviness, sky quality, and NPC emotional behavior.',
    support: ['drop in tone', 'deep tiredness', 'muted and flat'],
    options: [
      {
        text: 'Sudden deep tiredness, unprovoked yawning, heavy chest, a muted flat sky, and NPCs snapping or crying unexpectedly.',
        rationale:
          'Drop in Tone includes deep tiredness, yawning, heavy chest, muted flat sky, and unexpected NPC emotional outbursts.'
      },
      {
        text: 'Unlimited sleeper energy with a brilliantly clear sky and perfectly calm NPC emotional states.',
        rationale:
          'The sign is tiredness, muted sky, and NPC outbursts—not unlimited energy and perfect NPC calm.'
      },
      {
        text: 'Only bank apps crash while bodies feel light and the parasite overlay looks more solid than ever.',
        rationale:
          'Drop in Tone signals overlay glitching with bodily heaviness and muted sky, not a more solid overlay.'
      },
      {
        text: 'A courtroom order banning tiredness with no biological or sky-tone changes during the window.',
        rationale:
          'Drop in Tone is lived biological and atmospheric experience, not a legal ban on tiredness.'
      }
    ]
  },
  {
    number: 18,
    question: 'What marks The Sharp Edge, including sleeper behavior in the first 48 hours?',
    hint: 'Adrenaline, air feel, bird song, and refusal patterns among sleepers and NPCs.',
    support: ['sharp edge', 'adrenaline', 'first 48 hours'],
    options: [
      {
        text: 'Unprovoked adrenaline and heart-rate spikes, thicker pre-storm air, fewer bird songs, and sleepers and NPCs scanning fearfully while often refusing to admit wrong or ask for help in the first 48 hours.',
        rationale:
          'Sharp Edge brings adrenaline spikes, thicker air, fewer bird songs, and fearful scanning with refusal to admit wrong or ask for help in the first 48 hours.'
      },
      {
        text: 'Deep peaceful sleep for all, thinner air, constant loud bird songs, and immediate humble help-seeking by every sleeper.',
        rationale:
          'Sharp Edge is adrenaline and thicker air with decreased bird songs and refusal patterns—not peaceful sleep and instant humility.'
      },
      {
        text: 'Only political ads grow louder while hearts, air pressure feel, birds, and help-seeking stay unchanged.',
        rationale:
          'Named markers are biological adrenaline, thicker air, quieter birds, and fearful refusal to admit wrong—not louder ads alone.'
      },
      {
        text: 'A permanent end to atmospheric pop effects before any cable ever goes dark in Phase One.',
        rationale:
          'Sharp Edge is a mid-sign cluster; Silence Before the Snap and the atmospheric pop still occur around cable dark.'
      }
    ]
  },
  {
    number: 19,
    question: 'What happens in The Silence Before the Snap when cables go dark?',
    hint: 'Hearing, stillness, then pressure change that clears the field.',
    support: ['silence before the snap', 'ears ring', 'pop'],
    options: [
      {
        text: 'Ears ring at a high pitch, strange stillness falls, then a sudden pressure drop creates an atmospheric pop that clears the field.',
        rationale:
          'Silence Before the Snap brings high-pitch ringing and stillness; cable dark yields a pressure pop that clears the field.'
      },
      {
        text: 'Noise doubles everywhere with no stillness, no ear ringing, and a denser more confused field afterward.',
        rationale:
          'The sign is stillness and ringing ending in a clearing pop—not doubled noise and denser confusion.'
      },
      {
        text: 'Only traffic gets louder while wind and nature grow more chaotic with no atmospheric pop at all.',
        rationale:
          'Traffic noise fades, wind pauses, and nature holds its breath before the pressure pop.'
      },
      {
        text: 'Cables stay fully lit while a silent movie plays on every phone with no field-clearing effect.',
        rationale:
          'When cables actually go dark the pressure pop hits and the field clears—not silent movies on live cables.'
      }
    ]
  },
  {
    number: 20,
    question:
      'What larger Mega Breakdown stages does The First 72 Hours set up as catalyst?',
    hint: 'Whitehat action and a named broadcast system follow this window.',
    support: ['whitehat lockdown', 'emergency broadcast system', 'catalyst'],
    options: [
      {
        text: 'It sets the stage for the Whitehat lockdown and the activation of the Emergency Broadcast System (EBS).',
        rationale:
          'The First 72 Hours is the catalyst that directly sets the stage for Whitehat lockdown and EBS activation.'
      },
      {
        text: 'It permanently cancels every lockdown and ensures EBS never activates in any country.',
        rationale:
          'The window prepares for Whitehat lockdown and EBS, not the permanent cancellation of both.'
      },
      {
        text: 'It only restarts local sports leagues with no link to lockdown or emergency truth broadcasts.',
        rationale:
          'The 72 hours catalyze lockdown and EBS for global awakening, not sports-league restarts alone.'
      },
      {
        text: 'It hands MSM permanent exclusive control so Whitehats never touch public channels again.',
        rationale:
          'Parasitic media programming is cut off so the system can force a global pause toward EBS truth.'
      }
    ]
  },
  {
    number: 21,
    question:
      'How does manufactured chaos peak alongside larger staged narratives?',
    hint: 'Two fear narratives run with the chaos before truth broadcasts.',
    support: ['world war iii', 'alien invasion', 'truth broadcasts'],
    options: [
      {
        text: 'Manufactured chaos peaks with staged World War III and alien invasion narratives, using fear to shatter the collective before truth broadcasts.',
        rationale:
          'Chaos peaks with staged WW3 and alien invasion narratives to shatter the collective before truth broadcasts arrive.'
      },
      {
        text: 'Chaos never peaks and no WW3 or alien invasion narratives appear before calm routine programming returns.',
        rationale:
          'Manufactured chaos peaks with staged WW3 and alien invasion narratives before truth broadcasts.'
      },
      {
        text: 'Only weather documentaries air with no fear staging and no shattering of the collective field.',
        rationale:
          'Fear from staged war and invasion narratives is used to shatter the collective before truth airs.'
      },
      {
        text: 'Truth broadcasts are cancelled forever so staged fear remains the only permanent public story.',
        rationale:
          'Fear staging comes before introducing truth broadcasts; truth is not cancelled forever.'
      }
    ]
  },
  {
    number: 22,
    question:
      'What strategic necessity does the first 72 hours serve regarding parasitic infrastructure?',
    hint: 'Controlled demolition without the worst societal outcome.',
    support: ['controlled demolition', 'parasitic infrastructure', 'societal collapse'],
    options: [
      {
        text: 'To initiate controlled demolition of parasitic infrastructure without causing total societal collapse.',
        rationale:
          'The strategic necessity is controlled demolition of parasitic infrastructure without total societal collapse.'
      },
      {
        text: 'To rebuild parasitic infrastructure stronger than before with full societal collapse as the main goal.',
        rationale:
          'The aim is controlled demolition without total collapse—not rebuilding parasites via intentional total collapse.'
      },
      {
        text: 'To ignore parasitic infrastructure entirely while only adjusting retail store hours worldwide.',
        rationale:
          'The blackout targets parasitic infrastructure and influence over perception, not mere retail-hour tweaks.'
      },
      {
        text: 'To freeze every NPC in perfect function so no glitching or sleeper questioning ever begins.',
        rationale:
          'Strategy forces NPCs to glitch and sleepers to question reality—not perfect frozen NPC function.'
      }
    ]
  },
  {
    number: 23,
    question: 'How does the blackout change the parasites’ influence over public perception?',
    hint: 'Isolation of the population and the cut connection described.',
    support: ['isolates the population', 'parasites', 'public perception'],
    options: [
      {
        text: 'It isolates the population, cutting the connection between the parasites and their influence over public perception.',
        rationale:
          'The blackout isolates the population and cuts the parasites’ connection to influence over public perception.'
      },
      {
        text: 'It multiplies parasitic influence by restoring every media feed stronger than before the window began.',
        rationale:
          'The blackout cuts parasitic influence over perception; it does not multiply restored media control.'
      },
      {
        text: 'It only isolates Resonating Sols while leaving all sleepers fully plugged into parasitic feeds.',
        rationale:
          'The population is isolated from usual parasitic media programming as a global pause is forced.'
      },
      {
        text: 'It changes nothing about perception because MSM panic narratives never air at any point.',
        rationale:
          'MSM floods with panic while the deeper cut still severs ongoing parasitic perception control pathways.'
      }
    ]
  },
  {
    number: 24,
    question:
      'What does the frequency fracture clear the stage for resonating Sols to do?',
    hint: 'Anchoring action named in the strategic implications.',
    support: ['anchor their light', 'frequency fracture', 'resonating sols'],
    options: [
      {
        text: 'It clears the stage for resonating Sols to anchor their light as NPCs glitch and sleepers question reality.',
        rationale:
          'By forcing NPC glitching and sleeper questioning, the frequency fracture clears the stage for Sols to anchor their light.'
      },
      {
        text: 'It clears the stage only for NPCs to perfect their code and permanently silence every Sol field.',
        rationale:
          'NPCs glitch and Sols anchor light; the fracture does not perfect NPC code or silence Sols.'
      },
      {
        text: 'It requires Sols to abandon the field entirely and never hold calm ground during the window.',
        rationale:
          'Sols must hold ground calmly and anchor light—not abandon the field during the 72 hours.'
      },
      {
        text: 'It only benefits MSM anchors reading blame scripts with no light-anchoring role for Sols.',
        rationale:
          'Strategic clearing is for resonating Sols to anchor light, not for MSM blame-script readers alone.'
      }
    ]
  },
  {
    number: 25,
    question:
      'What ultimate preparation does this window complete before EBS disclosures begin?',
    hint: 'Extraction path, solar families, and public focus when disclosures start.',
    support: ['extraction', 'solar families', 'ebs'],
    options: [
      {
        text: 'It prepares the realm for ultimate extraction and the return of true solar families, ensuring the public is entirely focused when EBS begins its disclosures.',
        rationale:
          'The 72 hours prepare for extraction and return of true solar families so the public is fully focused when EBS disclosures begin.'
      },
      {
        text: 'It permanently blocks extraction and ensures solar families never return while EBS stays offline forever.',
        rationale:
          'The window prepares for extraction, solar-family return, and focused EBS disclosures—not permanent blockage.'
      },
      {
        text: 'It only reboots NPC grocery code with no extraction path and no solar-family return narrative.',
        rationale:
          'Preparation is for extraction and true solar families plus EBS focus—not grocery code alone.'
      },
      {
        text: 'It scatters public attention so no one notices when any disclosure attempt tries to begin.',
        rationale:
          'The design ensures the public is entirely focused when EBS begins disclosures—not scattered attention.'
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

const topicImage = 'images/breakdown/the-first-72-hours.webp';
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
    'Test your grasp of The First 72 Hours — The Cut, Frequency Fracture, NPC glitching, atmospheric signs, Whitehat lockdown setup, and preparation for EBS and solar-family return.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'The First 72 Hours is a surgical Frequency Fracture that severs cables, floods MSM with panic-blame, glitches NPCs, and cracks false reality so truth broadcasts can land. Sit with what you missed, then return to The First 72 Hours deep-dive, infographics, and video transmissions. Hold calm ground: this window clears the stage for Sols to anchor light, Whitehat lockdown, EBS disclosures, extraction, and the return of true solar families.'
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
    'Test your understanding of The First 72 Hours — The Cut, three phases, Frequency Fracture, NPC glitching, atmospheric signs, and setup for EBS and solar-family return.'
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
  throw new Error('the-first-72-hours not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on The First 72 Hours: The Cut, Frequency Fracture, NPC glitching, atmospheric signs, and setup for Whitehat lockdown and EBS.'
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
console.log(
  'PASS: audited 25/25 against data/breakdown-topics/the-first-72-hours.json'
);
