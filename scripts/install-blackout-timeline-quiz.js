/**
 * Installs Blackout Timeline quiz for breakdown (Mega Breakdown) transmission.
 * Authored from data/breakdown-topics/blackout-timeline.json report only.
 * Run: node scripts/install-blackout-timeline-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/blackout-timeline.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'blackout-timeline';
const TOPIC_TITLE = 'Blackout Timeline';
const SOURCE = 'breakdown';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const metaVoiceRe =
  /\b(according to the (report|source|text)|the report states|the source (states|specifies|suggests)|the text (states|describes|suggests|explicitly|mentions|defines|calls|focuses)|the material clarifies|mentioned in the (text|source)|source material)\b/i;

/** Stock filler tails to strip if rebalance ever reintroduces them. */
const STOCK_TAILS = [
  /,?\s*and that is treated as the entire mechanism\.?/gi,
  /,?\s*stopping the explanation at that boundary alone\.?/gi,
  /,?\s*with no further layer required beyond that account\.?/gi,
  /,?\s*without a larger engineered system underneath\.?/gi,
  /,?\s*as if no adjacent systems participated at all\.?/gi
];

/**
 * 25 questions: options[0] = correct. Support phrases must appear in report.
 * Keep all four options at similar length/depth (full plausible wrong claims).
 */
const RAW_QUESTIONS = [
  {
    number: 1,
    question: 'What is the Blackout Timeline also called, and what duration does it cover?',
    hint: 'A surgical window that initiates collapse of the third-density parasitic overlay.',
    support: ['the cut', '72-hour', 'parasitic overlay'],
    options: [
      {
        text: 'The Cut — a highly controlled surgical 72-hour period that initiates collapse of the third-density parasitic overlay.',
        rationale:
          'The Blackout Timeline is also called The Cut: a controlled 72-hour window that starts the collapse of the third-density parasitic overlay.'
      },
      {
        text: 'The Surge — an uncontrolled seven-day riot window that permanently restores full parasitic media control worldwide.',
        rationale:
          'The event is The Cut for 72 hours of controlled fracture, not a seven-day riot restoring parasitic media control.'
      },
      {
        text: 'The Loop — a permanent blackout with no end date and no path toward EBS truth broadcasts.',
        rationale:
          'The Cut is a precise 72-hour window preparing the realm for EBS, not an endless blackout without truth delivery.'
      },
      {
        text: 'The Bloom — a two-hour cable glitch used only to reboot banks while leaving the overlay fully intact.',
        rationale:
          'The Blackout Timeline is a 72-hour Frequency Fracture collapsing the overlay, not a brief bank reboot glitch.'
      }
    ]
  },
  {
    number: 2,
    question: 'Who engineers the communications blackout as catalyst for global awakening?',
    hint: 'Allied human forces and galactic partnerships are named together.',
    support: ['whitehats', 'galactic alliances', 'global awakening'],
    options: [
      {
        text: 'Whitehats and galactic alliances engineer this calculated Frequency Fracture as the catalyst for ultimate global awakening.',
        rationale:
          'The blackout is engineered by Whitehats and galactic alliances as a Frequency Fracture catalyzing global awakening.'
      },
      {
        text: 'Only random cable technicians acting alone without Whitehat planning or galactic alliance coordination.',
        rationale:
          'The blackout is a controlled Whitehat and galactic-alliance operation, not random uncoordinated technician error.'
      },
      {
        text: 'Parasitic elites alone, intending to permanently jam every high-vibration solar-family signal forever.',
        rationale:
          'Whitehats orchestrate the controlled demolition; the fracture clears the field for solar families, not permanent parasitic jamming.'
      },
      {
        text: 'NPC background programs rewriting their own code without any multi-dimensional or human alliance oversight.',
        rationale:
          'NPCs glitch under the fracture; Whitehats and galactic alliances engineer the blackout itself.'
      }
    ]
  },
  {
    number: 3,
    question: 'Beyond severed cables, what is the true energetic nature of the blackout?',
    hint: 'A named fracture that makes the overlay wobble and true memory sharpen.',
    support: ['frequency fracture', 'parasitic overlay', 'true memory'],
    options: [
      {
        text: 'A Frequency Fracture that makes the parasitic overlay wobble and crack while allowing true memory to sharpen.',
        rationale:
          'The blackout’s true nature is a Frequency Fracture that cracks the parasitic overlay and sharpens true memory.'
      },
      {
        text: 'A permanent increase in parasitic narrative strength so no Sol memory can ever sharpen again.',
        rationale:
          'The Frequency Fracture dismantles false narratives and sharpens Sol memory; it does not strengthen parasitic control.'
      },
      {
        text: 'A simple software update that only restarts phones without any atmospheric or biological shift.',
        rationale:
          'The event includes atmospheric pressure drop, frequency shift, and biological signs—not a mere phone software update.'
      },
      {
        text: 'A voluntary media pause where every network keeps full narrative control without any glitching NPCs.',
        rationale:
          'Cables are severed, NPCs glitch, and the overlay fractures; it is not a voluntary pause leaving narrative control intact.'
      }
    ]
  },
  {
    number: 4,
    question: 'What are NPCs in the Blackout Timeline context?',
    hint: 'Background programs that hold the simulation together and glitch during the event.',
    support: ['npc', 'background programs', 'lacking true souls'],
    options: [
      {
        text: 'Non-player characters — background programs lacking true souls that hold the simulation together and glitch heavily during the blackout.',
        rationale:
          'NPCs are background programs lacking true souls; they hold the simulation together and glitch erratically during the blackout.'
      },
      {
        text: 'Fully resonating Sols whose memory always stays sharp and who never exhibit erratic blackout behavior.',
        rationale:
          'NPCs lack true souls and glitch; Sols are resonating sparks whose memory sharpens as the blackout progresses.'
      },
      {
        text: 'Only holographic Blue Beam fleets with no role in holding third-density simulation scaffolding.',
        rationale:
          'NPCs are background programs holding the simulation; Blue Beam is separate holographical fear technology.'
      },
      {
        text: 'Military Whitehat commanders who never glitch and solely run every supermarket during The Wave.',
        rationale:
          'NPCs glitch and scramble for survival; Whitehats orchestrate the blackout rather than being defined as NPCs.'
      }
    ]
  },
  {
    number: 5,
    question: 'What is a Sol within this transmission?',
    hint: 'A true spark of origin whose memory changes as the blackout advances.',
    support: ['sol', 'resonating soul', 'memory sharpens'],
    options: [
      {
        text: 'A true resonating soul or spark of origin in a physical vessel whose memory sharpens as the blackout progresses.',
        rationale:
          'A Sol is a true resonating soul or origin spark embedded in a vessel; memory sharpens as the blackout progresses.'
      },
      {
        text: 'A background program without a true soul that only glitches and never carries origin memory.',
        rationale:
          'That description fits NPCs; Sols are true resonating souls whose memory sharpens during the fracture.'
      },
      {
        text: 'A pure cable-severing machine with no consciousness and no connection to frequency lock extraction.',
        rationale:
          'Sols are conscious resonating sparks; Resonating Sols are later extracted via frequency lock, not lifeless cable machines.'
      },
      {
        text: 'An elite parasite permanently immune to Frequency Fracture and EBS truth broadcasts.',
        rationale:
          'Sols awaken as the overlay cracks; they are not parasitic elites immune to the blackout and EBS.'
      }
    ]
  },
  {
    number: 6,
    question: 'What is Project Blue Beam in this blackout strategy?',
    hint: 'Holographical fear tech used during the timeline to force global attention.',
    support: ['project blue beam', 'holographical', 'fake alien invasion'],
    options: [
      {
        text: 'Holographical fear technology Whitehats use during the blackout to stage a fake alien invasion and force global attention.',
        rationale:
          'Project Blue Beam is holographical fear tech used in the blackout timeline to stage a fake alien invasion and force attention.'
      },
      {
        text: 'A genuine first-contact protocol that only shows true living crafts with no fear staging at all.',
        rationale:
          'Blue Beam stages fake invasion holograms; true living crafts of solar families break through later on their own frequency band.'
      },
      {
        text: 'A banking software patch that restores internet cables without any sky holograms or staged battles.',
        rationale:
          'Blue Beam fills skies with holographical fleets and fake battles; it is not a cable-restore banking patch.'
      },
      {
        text: 'An NPC grocery algorithm that only manages supermarket stock during Phase Two crowd surges.',
        rationale:
          'Blue Beam is sky-level holographical invasion staging, not a supermarket inventory program.'
      }
    ]
  },
  {
    number: 7,
    question: 'Why is the communications blackout an engineered necessity?',
    hint: 'Focus on what must be severed from the parasites over the human population.',
    support: ['narrative control', 'parasites', 'engineered necessity'],
    options: [
      {
        text: 'To sever the parasites’ narrative control over the human population so awakening can proceed without continuous media spin.',
        rationale:
          'The blackout is engineered to sever parasites’ narrative control over the population as a necessity for awakening.'
      },
      {
        text: 'To permanently hand every media channel back to parasitic elites with stronger narrative lock than before.',
        rationale:
          'The blackout severs parasitic narrative control and clears the stage for EBS truth, not stronger elite spin.'
      },
      {
        text: 'To keep Sols isolated from each other forever with no community pockets or later EBS delivery.',
        rationale:
          'Sols are guided into small community pockets and later receive EBS truth; isolation is controlled, not permanent abandonment.'
      },
      {
        text: 'To prevent any atmospheric pressure drop or frequency shift from ever occurring in the realm.',
        rationale:
          'The blackout includes a sudden atmospheric pressure drop and profound frequency shift, not the prevention of those effects.'
      }
    ]
  },
  {
    number: 8,
    question: 'How are cyber actions and cable cuts framed to the sleeping public?',
    hint: 'Enemy simulation and false geopolitical blame are both described.',
    support: ['cyber strikes', 'russia, china, iran, and north korea', 'false blame'],
    options: [
      {
        text: 'Main cables are severed and cyber strikes simulate enemy actions, with false blame placed on actors such as Russia, China, Iran, and North Korea.',
        rationale:
          'Cables are deliberately severed and cyber strikes simulate enemies; false blame is directed at Russia, China, Iran, and North Korea.'
      },
      {
        text: 'Cables stay fully intact while only one country is praised as a hero with no panic narratives at all.',
        rationale:
          'Main cables go dark and panic-blame narratives flood NPC channels toward named geopolitical enemies.'
      },
      {
        text: 'Only weather satellites are rebooted with no cable cuts, cyber strikes, or manufactured fear loops.',
        rationale:
          'The plan uses deliberate cable severing, cyber strikes, and a final fear loop—not a quiet weather-satellite reboot.'
      },
      {
        text: 'Blame is placed only on Resonating Sols for cutting cables to block EBS and truth packages forever.',
        rationale:
          'False blame targets geopolitical actors to push sleepers into a fear loop; Sols are not the blamed enemy narrative.'
      }
    ]
  },
  {
    number: 9,
    question: 'Beyond data loss, what physical-field change does the blackout produce?',
    hint: 'Atmospheric pressure and the energetic field of the realm are both named.',
    support: ['atmospheric pressure', 'frequency shift', 'energetic field'],
    options: [
      {
        text: 'A sudden drop in atmospheric pressure and a profound frequency shift that permanently clears the energetic field of the realm.',
        rationale:
          'The blackout is a pressure drop and frequency shift that permanently clears the realm’s energetic field—not mere data loss.'
      },
      {
        text: 'A permanent rise in atmospheric pressure that locks the parasitic overlay denser than ever before.',
        rationale:
          'Pressure drops and the field clears as the overlay fractures; it does not densify the parasitic overlay permanently.'
      },
      {
        text: 'No atmospheric change at all—only a software error message on a few corporate servers.',
        rationale:
          'The event includes atmospheric drop, frequency shift, and a palpable atmospheric pop when cables go dark.'
      },
      {
        text: 'Only ocean tides reverse for one minute with no effect on the energetic field or overlay.',
        rationale:
          'Named field effects are atmospheric pressure drop and frequency clearing of the realm, not a one-minute tide reversal alone.'
      }
    ]
  },
  {
    number: 10,
    question: 'What defines Phase One: The Cut (Hours 0 – 12)?',
    hint: 'Communications dark, cables, and panic-blame on NPC channels.',
    support: ['hours 0', 'cables are severed', 'panic and blame'],
    options: [
      {
        text: 'Internet and communications go completely dark as main cables are severed; media and NPC channels flood with panic and geopolitical blame.',
        rationale:
          'Phase One (0–12 hours) darkens internet as cables are severed and floods channels with panic and blame narratives.'
      },
      {
        text: 'EBS already runs full tribunals while every cable remains online and no panic narratives air.',
        rationale:
          'EBS follows later after lockdown; Phase One is cable dark and panic-blame, not full tribunal broadcast yet.'
      },
      {
        text: 'Only Resonating Sols lose phones while NPC networks stay perfectly calm and fully online.',
        rationale:
          'Communications go completely dark broadly; NPC channels are flooded with panic, not left calm and online.'
      },
      {
        text: 'Project Blue Beam ends permanently in the first hour with no fear loop and no cable cuts.',
        rationale:
          'Phase One centers cable cuts and fear-blame loops; Blue Beam peaks later in the broader staged theater.'
      }
    ]
  },
  {
    number: 11,
    question: 'What characterizes Phase Two: The Wave (Hours 12 – 36)?',
    hint: 'Crowd surges, NPC glitching, and guidance for Resonating Sols.',
    support: ['hours 12', 'supermarkets, banks, and fuel stations', 'avoid large crowds'],
    options: [
      {
        text: 'Crowd surges hit supermarkets, banks, and fuel stations; NPCs glitch visibly while Resonating Sols avoid large crowds and stay in small community pockets.',
        rationale:
          'Phase Two brings crowd surges and visible NPC glitching; Resonating Sols avoid panic zones and remain in small community pockets.'
      },
      {
        text: 'Everyone is ordered into the largest stadium crowds while Sols must lead every panic zone personally.',
        rationale:
          'Sols are instructed to avoid large crowds and panic zones, not to gather in stadium-scale surges.'
      },
      {
        text: 'All military forces disappear completely and no NPCs show aggression or dazed quiet states.',
        rationale:
          'Military forces are visible nearby and NPCs lash out or become quiet and dazed during The Wave.'
      },
      {
        text: 'Internet returns to full strength with no survival scramble for food, fuel, or bank access.',
        rationale:
          'Phase Two is defined by survival scrambles at stores, banks, and fuel stations under dark communications.'
      }
    ]
  },
  {
    number: 12,
    question: 'How do military forces appear during Phase Two?',
    hint: 'Visibility and positioning relative to the public are specified.',
    support: ['military forces', 'npc-controlled', 'positioned nearby'],
    options: [
      {
        text: 'Mostly NPC-controlled military forces will be visible but positioned nearby during the wave of crowd surges.',
        rationale:
          'During Phase Two, military forces—mostly NPC-controlled—are visible but positioned nearby.'
      },
      {
        text: 'No military presence exists at all until years after the 72-hour window fully ends.',
        rationale:
          'Military is visible nearby in Phase Two and later enforces lockdown before EBS.'
      },
      {
        text: 'Only Resonating Sols wear uniforms and replace every NPC unit on every street corner globally.',
        rationale:
          'Forces are mostly NPC-controlled and positioned nearby; Sols are told to stay in small community pockets.'
      },
      {
        text: 'Military solely runs grocery restock algorithms with no street visibility during The Wave.',
        rationale:
          'Military presence is visible nearby during crowd surges, not limited to invisible restock software.'
      }
    ]
  },
  {
    number: 13,
    question: 'What defines Phase Three: Opening Hour (Hours 36 – 72)?',
    hint: 'Questioning reality, wobbling false flags, and memory versus NPC code.',
    support: ['hours 36', 'questioning their reality', 'sol memory'],
    options: [
      {
        text: 'Awakening cracks open as people heavily question reality; false-flag narratives fall while Sol memory sharpens and NPC code flickers.',
        rationale:
          'Phase Three (36–72) brings heavy reality questioning, falling false flags, sharpened Sol memory, and flickering NPC code.'
      },
      {
        text: 'False-flag narratives become permanently unchallengeable while Sol memory is fully erased for all time.',
        rationale:
          'False flags wobble and fall; Sol memory sharpens rather than being erased in Opening Hour.'
      },
      {
        text: 'Phase Three only restocks fuel stations with no questioning of reality or frequency-fracture awareness.',
        rationale:
          'Opening Hour is about awakening cracks and recognizing the frequency fracture, not mere fuel restocking.'
      },
      {
        text: 'All NPC code becomes flawless and no truth about the event as a frequency fracture ever leaks.',
        rationale:
          'Truth leaks that the event is a frequency fracture and NPC code flickers rather than perfecting itself.'
      }
    ]
  },
  {
    number: 14,
    question: 'What is The Static Build-Up during The Cut?',
    hint: 'Skull buzzing, electronics, and animal reactions are listed together.',
    support: ['static build-up', 'buzzing', 'animals react'],
    options: [
      {
        text: 'Subtle skull buzzing like white noise, glitching electronics and freezes, power surges, and strong animal reactions such as erratic birds and restless dogs.',
        rationale:
          'Static Build-Up includes skull buzzing, electronic glitches and freezes, power surges, and strong animal reactions.'
      },
      {
        text: 'Total silence in every skull with no electronic glitches and animals remaining completely unaffected.',
        rationale:
          'Static Build-Up is buzzing, glitches, surges, and strong animal reactions—not total unaffected silence.'
      },
      {
        text: 'Only stock-market tickers freeze while phones, power grids, and animals show zero change.',
        rationale:
          'Phones freeze, power surges sweep the grid, and animals react strongly—not ticker-only symptoms.'
      },
      {
        text: 'A permanent cure that ends all yawning, chest heaviness, and later atmospheric pop effects forever.',
        rationale:
          'Static Build-Up is an early symptom cluster; Drop in Tone and Silence Before the Snap still follow.'
      }
    ]
  },
  {
    number: 15,
    question: 'What is The Drop in Tone as a biological and environmental sign?',
    hint: 'Tiredness, chest heaviness, muted sky, and NPC emotional outbursts.',
    support: ['drop in tone', 'deep tiredness', 'muted and flat'],
    options: [
      {
        text: 'Sudden deep tiredness, unprovoked yawning, heavy chest, a muted flat sky, and unpredictable NPC emotional outbursts such as snapping or crying.',
        rationale:
          'Drop in Tone includes deep tiredness, yawning, heavy chest, muted flat sky, and unexpected NPC emotional outbursts.'
      },
      {
        text: 'Unlimited energy for every sleeper with a brilliantly clear sky and perfectly calm NPC behavior.',
        rationale:
          'The sign is tiredness, muted sky, and NPC outbursts—not unlimited energy and perfect NPC calm.'
      },
      {
        text: 'Only bank apps crash while bodies feel light and the parasite overlay appears more solid than ever.',
        rationale:
          'Drop in Tone signals overlay glitching with bodily heaviness and muted sky, not a more solid overlay.'
      },
      {
        text: 'A legal decree banning yawning with no biological or sky-tone changes during the blackout.',
        rationale:
          'Drop in Tone is lived biological and atmospheric experience, not a legal ban on yawning.'
      }
    ]
  },
  {
    number: 16,
    question: 'What marks The Sharp Edge during the blackout signs?',
    hint: 'Adrenaline, heart rate, air pressure feel, and bird song frequency.',
    support: ['sharp edge', 'adrenaline', 'bird songs'],
    options: [
      {
        text: 'Short unprovoked adrenaline bursts, momentary heart-rate spikes, thicker storm-like air, and infrequent bird songs.',
        rationale:
          'The Sharp Edge brings adrenaline bursts, heart-rate spikes, thicker pre-storm air, and infrequent bird songs.'
      },
      {
        text: 'Long deep sleep for everyone with thinner air and constant continuous bird songs at peak volume.',
        rationale:
          'Sharp Edge is adrenaline and thicker air with infrequent bird songs—not deep sleep and constant loud birds.'
      },
      {
        text: 'Only political speeches grow louder while hearts, air pressure feel, and birds remain unchanged.',
        rationale:
          'Named markers are biological adrenaline, thicker air, and quieter bird song—not louder speeches alone.'
      },
      {
        text: 'A permanent end to all atmospheric pop effects before cables ever go dark.',
        rationale:
          'Sharp Edge is a mid-sign cluster; Silence Before the Snap and the atmospheric pop still occur when cables darken.'
      }
    ]
  },
  {
    number: 17,
    question: 'What happens in The Silence Before the Snap when cables go dark?',
    hint: 'Ringing ears, stillness, then a pressure pop that clears the field.',
    support: ['silence before the snap', 'ears ring', 'pop'],
    options: [
      {
        text: 'Ears ring at a high pitch, strange stillness falls, then a sudden atmospheric pressure drop creates a palpable pop and leaves the field clearer than ever.',
        rationale:
          'Silence Before the Snap brings high-pitch ringing and stillness; cable dark produces a pressure pop that clears the field.'
      },
      {
        text: 'Noise doubles everywhere with no stillness, no ear ringing, and a denser more confused energetic field afterward.',
        rationale:
          'The sign is stillness and ringing ending in a clearing pop—not doubled noise and denser confusion.'
      },
      {
        text: 'Only traffic gets louder while wind and nature grow more chaotic with no atmospheric pop at all.',
        rationale:
          'Traffic noise fades, wind pauses, and nature holds its breath before the pressure pop.'
      },
      {
        text: 'Cables stay lit while a silent movie plays on every phone with no field-clearing effect.',
        rationale:
          'When cables actually go dark the pressure pop hits; the field becomes clearer, not a silent movie with live cables.'
      }
    ]
  },
  {
    number: 18,
    question: 'How does the Blackout Timeline connect to the Staged WW3 Event?',
    hint: 'A.I. war theater, surgical strikes for television, and extinction narrative.',
    support: ['staged ww3', 'a.i. war theater', 'surgical military strikes'],
    options: [
      {
        text: 'An A.I. war theater on autopilot but Whitehat-controlled uses surgical military strikes choreographed for television to convince the mass mind of extinction risk.',
        rationale:
          'Staged WW3 runs as Whitehat-controlled A.I. war theater with TV-choreographed surgical strikes to sell extinction fear.'
      },
      {
        text: 'A spontaneous unscripted war with no Whitehat control, no television choreography, and no link to the blackout.',
        rationale:
          'The theater is controlled by Whitehats and choreographed for television as part of the blackout-linked strategy.'
      },
      {
        text: 'A pure diplomatic conference with no military strikes and no mass-mind extinction narrative at all.',
        rationale:
          'Surgical military strikes for television are used to convince the mass mind of facing extinction.'
      },
      {
        text: 'Only grocery logistics training with no war theater and no connection to fake alien invasion staging.',
        rationale:
          'The blackout links to Staged WW3 and later Blue Beam fleets—not grocery training alone.'
      }
    ]
  },
  {
    number: 19,
    question: 'How does Project Blue Beam peak within this staged fear sequence?',
    hint: 'Skies fill with holographical fleets and fake galactic events.',
    support: ['project blue beam', 'holographical fleets', 'fake galactic battles'],
    options: [
      {
        text: 'Holographical fleets fill the skies staging fake galactic battles and abductions to shatter the collective completely.',
        rationale:
          'Blue Beam peaks with holographical fleets staging fake galactic battles and abductions to shatter the collective.'
      },
      {
        text: 'Only true solar-family crafts appear with full open disclosure and no fake battles or abductions staged.',
        rationale:
          'Blue Beam stages fake fleets and battles; true living crafts break through later on their own frequency band.'
      },
      {
        text: 'Blue Beam only prints newspapers with no sky holograms and no staged abduction narratives.',
        rationale:
          'The peak is holographical fleets filling the skies, not newspaper-only messaging.'
      },
      {
        text: 'Blue Beam permanently cancels EBS so no tribunals or confessions can ever broadcast.',
        rationale:
          'Blue Beam is fear staging before lockdown and EBS truth broadcasts, not the cancellation of EBS.'
      }
    ]
  },
  {
    number: 20,
    question: 'After fear peaks during the blackout, what does the military enforce next?',
    hint: 'Order maintenance that clears the stage for a named broadcast system.',
    support: ['visible lockdown', 'ebs', 'maintain order'],
    options: [
      {
        text: 'A visible lockdown to maintain order, clearing the stage for the Emergency Broadcast System (EBS).',
        rationale:
          'Once fear peaks, military enforces a visible lockdown to maintain order and clear the stage for EBS.'
      },
      {
        text: 'Immediate permanent internet restoration to parasitic media with no EBS and no lockdown.',
        rationale:
          'Lockdown clears the stage for EBS takeover of channels, not restoration of parasitic media spin.'
      },
      {
        text: 'Total disbanding of all military units so no order maintenance occurs before truth airs.',
        rationale:
          'Military enforces visible lockdown for order before EBS; it does not disband entirely first.'
      },
      {
        text: 'Only Blue Beam continues forever with no path to tribunals, confessions, or suppressed truths.',
        rationale:
          'Blue Beam fear peaks, then lockdown and EBS deliver tribunals, confessions, and proof of elite crimes.'
      }
    ]
  },
  {
    number: 21,
    question: 'What does the EBS do once it takes over public channels?',
    hint: 'Internet restrictions and the content categories of the truth broadcast.',
    support: ['emergency broadcast system', 'tribunals', 'human trafficking'],
    options: [
      {
        text: 'It severs remaining internet restrictions and broadcasts tribunals, confessions, and proof of election fraud, human trafficking, and elite corruption.',
        rationale:
          'EBS severs remaining internet restrictions and airs tribunals, confessions, and proof of fraud, trafficking, and elite corruption.'
      },
      {
        text: 'It only replays sports and weather while sealing all tribunals and confessions from public view forever.',
        rationale:
          'EBS broadcasts suppressed truths including tribunals and confessions—not sports-only sealed archives.'
      },
      {
        text: 'It returns full narrative control to the same parasitic cable news networks without any truth content.',
        rationale:
          'EBS is military-controlled takeover to shatter false reality with suppressed truths, not parasitic spin restoration.'
      },
      {
        text: 'It solely reboots NPC supermarket code with no election fraud or trafficking disclosures.',
        rationale:
          'EBS content includes election fraud, human trafficking, and elite corruption—not only NPC retail code.'
      }
    ]
  },
  {
    number: 22,
    question: 'What is the overarching strategic purpose of the Blackout Timeline?',
    hint: 'Isolation from manipulation so a truth broadcast cannot be ignored or spun.',
    support: ['isolate the population', 'ebs truth broadcast', 'external manipulation'],
    options: [
      {
        text: 'To isolate the population from external manipulation in a controlled environment where the EBS truth broadcast cannot be ignored or spun by media.',
        rationale:
          'Strategy isolates the population from external manipulation so EBS truth cannot be ignored or media-spun.'
      },
      {
        text: 'To maximize external media spin so every EBS claim can be drowned out by parasitic networks forever.',
        rationale:
          'The blackout isolates from manipulation so EBS cannot be spun—not to maximize parasitic spin.'
      },
      {
        text: 'To keep every cable online so foreign narrative feeds continue uninterrupted through the whole window.',
        rationale:
          'Cables are cut and the population is isolated from external feeds so truth can land cleanly.'
      },
      {
        text: 'To cancel EBS entirely and leave only Blue Beam holograms as the final permanent reality story.',
        rationale:
          'Blackout prepares for EBS truth after fear peaks; Blue Beam is not the permanent final story.'
      }
    ]
  },
  {
    number: 23,
    question:
      'What does the 72-hour frequency fracture ensure about parasitic networks and solar families?',
    hint: 'Jamming high-vibration signals is the capability that is broken.',
    support: ['parasitic networks', 'jam or distort', 'solar families'],
    options: [
      {
        text: 'Parasitic networks can no longer jam or distort the high-vibration signals of the incoming solar families.',
        rationale:
          'The fracture ensures parasitic networks can no longer jam or distort high-vibration solar-family signals.'
      },
      {
        text: 'Parasitic networks gain permanent exclusive control to jam every solar-family signal indefinitely.',
        rationale:
          'The fracture ends their ability to jam those signals; it does not grant permanent jamming power.'
      },
      {
        text: 'Solar families are permanently blocked while only NPC channels remain high-vibration carriers.',
        rationale:
          'High-vibration solar-family signals get a clear path; NPCs glitch rather than become primary carriers.'
      },
      {
        text: 'No signal environment changes occur and cable news remains the only frequency that matters.',
        rationale:
          'A profound frequency shift clears the field for solar-family signals beyond old cable news control.'
      }
    ]
  },
  {
    number: 24,
    question: 'What breaks through after the fake alien invasion collapses?',
    hint: 'True crafts of extraterrestrial family lines on their own frequency band.',
    support: ['living crafts', 'fake alien invasion', 'frequency band'],
    options: [
      {
        text: 'True living crafts of the Resonating Sols’ extraterrestrial families break through on their own frequency band.',
        rationale:
          'As the fake invasion collapses, true living crafts of Resonating Sols’ ET families break through their own frequency band.'
      },
      {
        text: 'Only Blue Beam holograms remain forever with no true living crafts ever breaking through.',
        rationale:
          'Fake Blue Beam collapses so true living crafts can break through—not permanent holograms alone.'
      },
      {
        text: 'Only NPC drones delivery groceries with no extraterrestrial family crafts involved at all.',
        rationale:
          'True living crafts of solar/ET families break through; the point is not NPC grocery drones.'
      },
      {
        text: 'Parasitic warships restore full third-density overlay denser than before the 72 hours began.',
        rationale:
          'The strategy reveals the original realm and true crafts, not a denser restored parasitic overlay.'
      }
    ]
  },
  {
    number: 25,
    question:
      'When true Light Grids activate after the blackout, what happens for Resonating Sols?',
    hint: 'Original realm revelation and a named extraction method.',
    support: ['light grids', 'original realm', 'frequency lock'],
    options: [
      {
        text: 'The original realm is revealed and Resonating Sols are successfully extracted via frequency lock.',
        rationale:
          'When true Light Grids activate, the original realm is revealed and Resonating Sols are extracted via frequency lock.'
      },
      {
        text: 'Resonating Sols are permanently sealed inside denser NPC code with no extraction path at all.',
        rationale:
          'Sols are extracted via frequency lock as the original realm is revealed—not sealed into denser NPC code.'
      },
      {
        text: 'Only cables restore parasitic news while Light Grids stay offline and no realm reveal occurs.',
        rationale:
          'The blackout ensures Light Grid activation and original-realm reveal, not permanent parasitic-news-only outcome.'
      },
      {
        text: 'Extraction happens only through bank loans and physical airports with no frequency lock involved.',
        rationale:
          'Extraction is via frequency lock as Light Grids activate—not bank loans or conventional airports alone.'
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

    // Recompute correctAnswer after any strip (text-only; flags unchanged)
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

const topicImage = 'images/breakdown/blackout-timeline.webp';
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
    'Test your grasp of the Blackout Timeline — The Cut’s 72-hour Frequency Fracture, NPC glitching, atmospheric signs, Blue Beam fear peak, lockdown, EBS truth, and frequency-lock extraction.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'The Blackout Timeline is The Cut: a controlled 72-hour Frequency Fracture that severs parasitic narrative control, glitches NPC scaffolding, and clears the field for EBS truth and true solar-family crafts. Sit with what you missed, then return to the Blackout Timeline deep-dive, infographics, and video transmissions. When Light Grids activate, the original realm is revealed and Resonating Sols extract via frequency lock.'
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
    'Test your understanding of the Blackout Timeline — The Cut, Frequency Fracture, three phases, NPC glitching, Blue Beam, EBS, and frequency-lock extraction.'
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
  throw new Error('blackout-timeline not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on the Blackout Timeline: The Cut’s 72-hour Frequency Fracture, NPC glitching, Blue Beam fear peak, EBS truth, and frequency-lock extraction.'
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
  'PASS: audited 25/25 against data/breakdown-topics/blackout-timeline.json'
);
