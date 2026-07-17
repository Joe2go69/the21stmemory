/**
 * Installs Physical Indicators quiz for breakdown (Mega Breakdown) transmission.
 * Authored from data/breakdown-topics/physical-indicators.json report only.
 * Run: node scripts/install-physical-indicators-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/physical-indicators.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'physical-indicators';
const TOPIC_TITLE = 'Physical Indicators';
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
      'When does humanity experience the intense sequence of biological, environmental, and atmospheric symptoms described here?',
    hint: 'Opening span of a named timeline of blackout transition.',
    support: ['opening hours', 'blackout timeline', 'biological, environmental, and atmospheric'],
    options: [
      {
        text: 'During the opening hours of the Blackout Timeline, as the 3D Overlay fractures and energetic grids shift.',
        rationale:
          'These physical indicators arise in the opening hours of the Blackout Timeline as the 3D Overlay fractures and energetic grids shift.'
      },
      {
        text: 'Only decades after full Second Realm restoration, when every cable is already permanently online again.',
        rationale:
          'Symptoms mark the Blackout Timeline’s opening hours—not a post-restoration era with cables fully online.'
      },
      {
        text: 'Never, because the human vessel never acts as a biological receiver of frequency collapse at all.',
        rationale:
          'The human vessel acts as a biological receiver, so parasitic-control collapse becomes tangible physical sensation.'
      },
      {
        text: 'Only during calm media festivals with no overlay fracture and no grid shifting whatsoever.',
        rationale:
          'Indicators are direct results of overlay fracturing and grid shifting—not calm festivals without fracture.'
      }
    ]
  },
  {
    number: 2,
    question: 'Why do these physical indicators appear in the body and environment?',
    hint: 'The vessel as receiver and what collapses in frequency control.',
    support: ['biological receiver', 'parasitic frequency control', 'tangible physical sensations'],
    options: [
      {
        text: 'Because the human vessel is a biological receiver, sudden collapse of parasitic frequency control becomes tangible physical sensations, erratic animal behaviors, and environmental anomalies.',
        rationale:
          'As a biological receiver, the vessel translates parasitic frequency-control collapse into tangible sensations, animal reactions, and environmental anomalies.'
      },
      {
        text: 'Because random seasonal flu always peaks exactly when cables stay fully online worldwide.',
        rationale:
          'Indicators are fracture-driven receiver responses—not random flu timed to fully online cables.'
      },
      {
        text: 'Because Resonating Sols never feel anything before visual changes appear in the sky.',
        rationale:
          'Resonating Sols feel these changes before they see them as the false matrix begins to dissolve.'
      },
      {
        text: 'Because animals alone receive the grid while human vessels remain completely frequency-blind.',
        rationale:
          'Human vessels are biological receivers; animals also react, but humans feel the sequence as well.'
      }
    ]
  },
  {
    number: 3,
    question: 'What is The Static Build Up as defined in key terminology?',
    hint: 'Initial response type and two signature features named together.',
    support: ['static build up', 'cranial buzzing', 'electronic anomalies'],
    options: [
      {
        text: 'The initial physiological and environmental response to the frequency fracture, marked by subtle cranial buzzing and localized electronic anomalies.',
        rationale:
          'Static Build Up is the initial physiological and environmental response to the frequency fracture—subtle cranial buzzing and localized electronic anomalies.'
      },
      {
        text: 'The final atmospheric pop that only happens after every cable is permanently restored worldwide.',
        rationale:
          'Static Build Up is the initial response; the atmospheric pop is the later severing moment of cable dark.'
      },
      {
        text: 'A pure weather term for clear skies with no cranial buzzing and no electronic anomalies at all.',
        rationale:
          'The term names cranial buzzing and electronic anomalies under frequency fracture—not clear-sky weather alone.'
      },
      {
        text: 'An NPC-only panic script with no biological skull buzzing or phone-and-screen glitches.',
        rationale:
          'Static Build Up includes biological buzzing and environmental electronics glitching—not NPC panic alone.'
      }
    ]
  },
  {
    number: 4,
    question: 'What is The Drop in Tone?',
    hint: 'Fatigue wave plus a visual change to the sky under glitching overlay.',
    support: ['drop in tone', 'deep physical fatigue', 'visual flattening of the sky'],
    options: [
      {
        text: 'A sudden wave of deep physical fatigue and a visual flattening of the sky caused by the glitching parasitic overlay.',
        rationale:
          'Drop in Tone is a sudden wave of deep physical fatigue and visual sky flattening from the glitching parasitic overlay.'
      },
      {
        text: 'A permanent energy boost with a brilliantly dimensional sky and zero parasitic overlay glitch.',
        rationale:
          'Drop in Tone is fatigue and flatter sky under overlay glitch—not permanent energy boost and brilliant depth.'
      },
      {
        text: 'Only a banking holiday with no body fatigue and no change in how the sky looks at all.',
        rationale:
          'The definition is bodily fatigue and sky flattening from overlay glitch—not a banking holiday alone.'
      },
      {
        text: 'The moment cables restore with full volume traffic noise and no muted visual field whatsoever.',
        rationale:
          'Drop in Tone is a heavier muted state as the false sky fails—not cable restore with full traffic noise.'
      }
    ]
  },
  {
    number: 5,
    question: 'What is The Sharp Edge?',
    hint: 'Adrenaline, heart, and atmospheric pressure feel named together.',
    support: ['sharp edge', 'bursts of adrenaline', 'thickening of the atmospheric pressure'],
    options: [
      {
        text: 'Short unexplained bursts of adrenaline and cardiovascular spikes coupled with a thickening of atmospheric pressure.',
        rationale:
          'Sharp Edge is short unexplained adrenaline and cardiovascular spikes with thickening atmospheric pressure.'
      },
      {
        text: 'Deep peaceful sleep with thinner air and no heart-rate spikes at any point in the sequence.',
        rationale:
          'Sharp Edge is adrenaline and thick pressure with heart spikes—not peaceful sleep and thinner air.'
      },
      {
        text: 'Only a legal ban on heart-rate monitors with no real adrenaline or pressure change in the field.',
        rationale:
          'The phase is lived biological and atmospheric charging—not a legal ban on monitors.'
      },
      {
        text: 'Permanent calm for every sleeper with no cardiovascular spikes and no pre-storm air feel.',
        rationale:
          'Sharp Edge charges tension with adrenaline spikes and thicker air before the blackout peaks.'
      }
    ]
  },
  {
    number: 6,
    question: 'What is The Silence Before the Snap?',
    hint: 'Final acoustic and atmospheric state before cables are cut.',
    support: ['silence before the snap', 'acoustic and atmospheric vacuum', 'severing of communication lines'],
    options: [
      {
        text: 'The final acoustic and atmospheric vacuum immediately preceding the physical severing of communication lines.',
        rationale:
          'Silence Before the Snap is the final acoustic and atmospheric vacuum right before communication lines are physically severed.'
      },
      {
        text: 'The first Static Build Up hour with continuous traffic noise and no vacuum stillness at all.',
        rationale:
          'Silence Before the Snap is the final pre-severing vacuum—not the initial Static Build Up with ordinary noise.'
      },
      {
        text: 'A permanent concert of doubled traffic noise after every cable is restored online worldwide.',
        rationale:
          'The phase is vacuum stillness before severing—not doubled traffic noise after full restore.'
      },
      {
        text: 'Only a weather forecast graphic with no ear ringing and no nature-holds-breath stillness.',
        rationale:
          'The phase includes sharp ear ringing and absolute stillness before the cable severing pop.'
      }
    ]
  },
  {
    number: 7,
    question: 'What is the Pop in the Atmosphere?',
    hint: 'Pressure change timing relative to old matrix cables.',
    support: ['pop in the atmosphere', 'drop in environmental pressure', 'old matrix cables'],
    options: [
      {
        text: 'A sudden drop in environmental pressure felt the exact moment old matrix cables are severed, revealing temporary field clarity.',
        rationale:
          'Pop in the Atmosphere is a sudden environmental pressure drop at the exact moment old matrix cables are severed, with temporary field clarity.'
      },
      {
        text: 'A permanent densifying pressure rise that muddies the field the moment cables are restored.',
        rationale:
          'The pop is a pressure drop at cable severing with temporary clarity—not densifying pressure at restore.'
      },
      {
        text: 'Only a software toast on servers with no lived pressure change and no field clarity moment.',
        rationale:
          'The pop is a physical atmospheric pressure event with momentary field clarity—not a server toast alone.'
      },
      {
        text: 'A Pure NPC slogan that never aligns with actual cable dark or pressure change in the realm.',
        rationale:
          'The pop aligns with physical cable dark and is felt as atmospheric pressure drop with field clarity.'
      }
    ]
  },
  {
    number: 8,
    question: 'Why are these indicators not random illnesses or standard weather anomalies?',
    hint: 'Literal sensations of a named energetic cut through old reality.',
    support: ['not random illnesses', 'frequency fracture', 'raw energetic friction'],
    options: [
      {
        text: 'They are literal sensations of a Frequency Fracture cutting through old reality as the Parasitic Overlay destabilizes and the body meets raw energetic friction.',
        rationale:
          'Indicators are not random illness or ordinary weather; they are Frequency Fracture sensations as the overlay destabilizes and friction hits body and environment.'
      },
      {
        text: 'They are only ordinary seasonal allergies with no Frequency Fracture and no overlay destabilization at all.',
        rationale:
          'Core revelation rejects random illness framing; symptoms track Frequency Fracture and overlay destabilization.'
      },
      {
        text: 'They only affect bank software with no sensory organs and no environmental reaction to energetic friction.',
        rationale:
          'Sensory organs and the surrounding environment react to raw energetic friction—not bank software alone.'
      },
      {
        text: 'They prove the false matrix is permanently solid and never begins to dissolve for Resonating Sols.',
        rationale:
          'Sols feel changes before they see them as the false matrix begins to dissolve—not permanent solidity.'
      }
    ]
  },
  {
    number: 9,
    question: 'How does the sequence of physical symptoms function for awake Sols during blackout?',
    hint: 'A clock metaphor for guiding through collapse while others glitch.',
    support: ['biological clock', 'blackout timeline', 'npc population'],
    options: [
      {
        text: 'As a biological clock for the Blackout Timeline, guiding awake Sols through collapse while the NPC population and deep sleepers glitch and panic.',
        rationale:
          'The symptom sequence acts as a biological clock for the Blackout Timeline, guiding awake Sols while NPCs and deep sleepers glitch and panic.'
      },
      {
        text: 'As a random noise generator that never guides Sols and never coincides with NPC panic at all.',
        rationale:
          'The sequence is a guiding biological clock during collapse—not meaningless random noise without NPC contrast.'
      },
      {
        text: 'As proof that awake Sols should lead every supermarket panic while NPCs remain perfectly calm lighthouses.',
        rationale:
          'Sols are guided through collapse while NPCs panic; later strategy is avoid panic zones, not lead them.'
      },
      {
        text: 'As a post-restoration calendar used only after all cables and MSM feeds are fully restored forever.',
        rationale:
          'The clock runs during blackout collapse, not after permanent full restore of old feeds.'
      }
    ]
  },
  {
    number: 10,
    question: 'What biological sign marks Phase 1: The Static Build Up?',
    hint: 'Skull sensation compared to continuous background noise.',
    support: ['buzzing develops in the skull', 'white noise', 'static build up'],
    options: [
      {
        text: 'A subtle buzzing in the skull like continuous white noise in the background of perception.',
        rationale:
          'Phase 1 biological sign is subtle skull buzzing functioning like continuous white noise in perception’s background.'
      },
      {
        text: 'Sudden deep chest heaviness and unprovoked yawning as the primary first-phase body signal only.',
        rationale:
          'Deep tiredness, yawning, and chest heaviness belong to Drop in Tone (Phase 2), not Static Build Up.'
      },
      {
        text: 'Sharp high-pitch ear ringing just out of normal hearing range as the only Phase 1 biological sign.',
        rationale:
          'Sharp out-of-range ear ringing belongs to Silence Before the Snap (Phase 4), not Static Build Up.'
      },
      {
        text: 'Uncaused adrenaline bursts and heart-rate spikes with no skull buzzing at any point.',
        rationale:
          'Adrenaline and heart spikes are Sharp Edge (Phase 3); Static Build Up centers cranial buzzing.'
      }
    ]
  },
  {
    number: 11,
    question: 'What environmental electronics signs appear in Phase 1: The Static Build Up?',
    hint: 'Phones, screens, and localized power behavior.',
    support: ['phones freeze', 'screens flicker', 'power surges'],
    options: [
      {
        text: 'Environmental electronics glitch—phones freeze, screens flicker, and localized small power surges occur.',
        rationale:
          'Phase 1 environmental signs include electronics glitching: phones freeze, screens flicker, and small localized power surges.'
      },
      {
        text: 'Every device becomes perfectly stable with zero freezes, zero flicker, and zero power surges.',
        rationale:
          'Electronics begin to glitch with freezes, flicker, and surges—not perfect device stability.'
      },
      {
        text: 'Only the sky flattens while phones and screens remain flawless throughout Phase 1.',
        rationale:
          'Sky flattening is emphasized in Drop in Tone; Static Build Up features electronic glitches first.'
      },
      {
        text: 'Only absolute stillness with traffic noise fully faded and no electronic glitching at all.',
        rationale:
          'Absolute stillness and faded traffic belong to Silence Before the Snap, not Static Build Up electronics.'
      }
    ]
  },
  {
    number: 12,
    question: 'How do animals behave during Phase 1: The Static Build Up?',
    hint: 'Birds, dogs near calm people, and cats with water needs.',
    support: ['birds fly erratically', 'dogs become restless', 'extra water'],
    options: [
      {
        text: 'Birds fly erratically, dogs become restless and stay close to calm individuals, and cats disappear to safe spots needing extra water as consumption rises.',
        rationale:
          'Animals react immediately: erratic birds, restless dogs near calm people, and cats hiding with increased water need.'
      },
      {
        text: 'All animals remain completely unaffected with no erratic flight, no restlessness, and no change in water needs.',
        rationale:
          'Animals are highly sensitive to grid frequencies and react immediately with clear behavioral changes.'
      },
      {
        text: 'Only fish glow while birds, dogs, and cats show zero response to shifting grid frequencies.',
        rationale:
          'Named reactions are birds, dogs, and cats—not fish-only glow without land-animal response.'
      },
      {
        text: 'Dogs abandon calm Sols while cats throw loud parties with no need for extra water at all.',
        rationale:
          'Dogs stay close to calm individuals and cats hide needing extra water—not the reverse chaos pattern.'
      }
    ]
  },
  {
    number: 13,
    question: 'What biological signs define Phase 2: The Drop in Tone?',
    hint: 'Tiredness, yawning, and chest sensation for Sols.',
    support: ['deep tiredness', 'yawning without reason', 'heaviness in the chest'],
    options: [
      {
        text: 'Sudden deep tiredness, yawning without reason, and a distinct feeling of heaviness in the chest.',
        rationale:
          'Drop in Tone biological signs for Sols are sudden deep tiredness, unreasoned yawning, and chest heaviness.'
      },
      {
        text: 'Only subtle skull white-noise buzzing with no tiredness, no yawning, and no chest heaviness.',
        rationale:
          'Skull buzzing is Static Build Up; Drop in Tone centers deep tiredness, yawning, and chest heaviness.'
      },
      {
        text: 'Only uncaused adrenaline bursts and heart spikes without any fatigue or chest heaviness.',
        rationale:
          'Adrenaline and heart spikes are Sharp Edge; Drop in Tone is heavier fatigue and chest heaviness.'
      },
      {
        text: 'Unlimited energy and light chest with no yawning as the false sky becomes more dimensional.',
        rationale:
          'Drop in Tone is fatigue, yawning, chest heaviness, and flatter muted sky—not unlimited energy and more depth.'
      }
    ]
  },
  {
    number: 14,
    question: 'How does the sky look during Phase 2: The Drop in Tone?',
    hint: 'Muted feel even when many colors are present.',
    support: ['muted', 'flatter', 'parasite overlay is actively glitching'],
    options: [
      {
        text: 'The sky feels entirely muted; even with many colors present, the visual field looks distinctly flatter because the parasite overlay is actively glitching.',
        rationale:
          'During Drop in Tone the sky feels muted and flatter despite colors, because the parasite overlay is actively glitching.'
      },
      {
        text: 'The sky becomes permanently more dimensional and vivid as the parasite overlay locks solid forever.',
        rationale:
          'The sky flattens under active overlay glitch—not permanent vivid dimensional lock.'
      },
      {
        text: 'The sky never changes while only phones freeze and no muted visual field appears at all.',
        rationale:
          'Drop in Tone specifically names muted flatter sky under overlay glitch—not phone-only symptoms.'
      },
      {
        text: 'The sky only shows absolute night black with no color present and no glitch-related flattening language.',
        rationale:
          'Many colors can still be present while the field looks flatter and muted from overlay glitch.'
      }
    ]
  },
  {
    number: 15,
    question: 'How do sleepers and NPCs react during Phase 2: The Drop in Tone?',
    hint: 'Emotional behavior as programming degrades.',
    support: ['emotional outbursts', 'snapping or crying', 'programming degrades'],
    options: [
      {
        text: 'They begin random emotional outbursts—unexpectedly snapping or crying—as their programming degrades.',
        rationale:
          'In Drop in Tone, sleepers and NPCs have random emotional outbursts, snapping or crying as programming degrades.'
      },
      {
        text: 'They remain perfectly emotionally stable with zero snapping, zero crying, and perfect programming.',
        rationale:
          'Programming degrades into random emotional outbursts—not perfect emotional stability.'
      },
      {
        text: 'They only scan for intel in overt fear with no emotional snapping or crying at this phase.',
        rationale:
          'Fearful scanning for intel is emphasized in Sharp Edge; Drop in Tone highlights emotional outbursts.'
      },
      {
        text: 'They all ascend immediately with no degraded programming and no emotional glitch signs at all.',
        rationale:
          'NPCs and sleepers glitch with emotional outbursts; they do not ascend cleanly in this phase.'
      }
    ]
  },
  {
    number: 16,
    question: 'What biological signs define Phase 3: The Sharp Edge?',
    hint: 'Adrenaline without external cause and heart-rate timing.',
    support: ['bursts of adrenaline', 'heart rates spike', 'without any external cause'],
    options: [
      {
        text: 'Short bursts of adrenaline without external cause, with heart rates spiking for brief seconds out of the blue.',
        rationale:
          'Sharp Edge biological signs are short uncaused adrenaline bursts and brief out-of-the-blue heart-rate spikes.'
      },
      {
        text: 'Only continuous skull white noise with no adrenaline and no heart-rate spikes whatsoever.',
        rationale:
          'Skull buzzing is Static Build Up; Sharp Edge centers uncaused adrenaline and heart spikes.'
      },
      {
        text: 'Only deep tiredness and unreasoned yawning with no cardiovascular spikes at all.',
        rationale:
          'Deep tiredness and yawning are Drop in Tone; Sharp Edge is adrenaline and heart spikes.'
      },
      {
        text: 'Only sharp ear ringing out of hearing range with total absence of adrenaline spikes.',
        rationale:
          'Out-of-range ear ringing is Silence Before the Snap; Sharp Edge is adrenaline and heart spikes.'
      }
    ]
  },
  {
    number: 17,
    question: 'What environmental signs mark Phase 3: The Sharp Edge?',
    hint: 'Air feel and bird song status.',
    support: ['air feels tangibly thicker', 'before a severe storm', 'bird song ceases'],
    options: [
      {
        text: 'The air feels tangibly thicker, like heavy pressure right before a severe storm, and bird song ceases.',
        rationale:
          'Sharp Edge environment: air tangibly thicker like pre-severe-storm pressure, and bird song ceases.'
      },
      {
        text: 'The air thins completely while bird song becomes constant and louder than ever before.',
        rationale:
          'Air thickens and bird song ceases—not thinner air with constant louder song.'
      },
      {
        text: 'Only phones freeze while air pressure feel and bird song remain completely unchanged.',
        rationale:
          'Sharp Edge names thicker air and ceased bird song—not phone freeze alone from Phase 1.'
      },
      {
        text: 'Absolute traffic silence only, with no thicker air and no change in bird song at this phase.',
        rationale:
          'Traffic fade into absolute stillness is Silence Before the Snap; Sharp Edge is thick air and ceased bird song.'
      }
    ]
  },
  {
    number: 18,
    question: 'How do sleepers and NPCs behave during Phase 3: The Sharp Edge?',
    hint: 'Confusion, fear, and scanning for something to hold their worldview.',
    support: ['overt confusion and fear', 'scanning their surroundings', 'collapsing worldview'],
    options: [
      {
        text: 'They display overt confusion and fear, frantically scanning surroundings for intel to maintain their collapsing worldview.',
        rationale:
          'In Sharp Edge, sleepers and NPCs show overt confusion and fear, frantically scanning for intel to hold a collapsing worldview.'
      },
      {
        text: 'They remain fully confident with no scanning, no fear, and a perfectly stable worldview throughout.',
        rationale:
          'They show overt confusion and fear and scan for intel—not perfect confident stability.'
      },
      {
        text: 'They only cry or snap emotionally with no scanning for intel and no fear display at this phase.',
        rationale:
          'Emotional outbursts are Drop in Tone emphasis; Sharp Edge emphasizes fear scanning for intel.'
      },
      {
        text: 'They all become calm community lighthouses guiding Sols through panic zones safely.',
        rationale:
          'NPCs and sleepers panic and scan; Sols are the ones instructed to hold calm lighthouse presence outside panic zones.'
      }
    ]
  },
  {
    number: 19,
    question: 'What biological sign marks Phase 4: The Silence Before the Snap?',
    hint: 'Hearing sensation relative to normal range.',
    support: ['ears ring sharply', 'high pitch', 'normal hearing range'],
    options: [
      {
        text: 'Ears ring sharply with a high pitch that sits just out of the normal hearing range.',
        rationale:
          'Silence Before the Snap biological sign is sharp high-pitch ear ringing just out of normal hearing range.'
      },
      {
        text: 'Only subtle skull white-noise buzzing with no sharp high-pitch ringing outside normal range.',
        rationale:
          'Subtle skull buzzing is Static Build Up; Phase 4 centers sharp out-of-range ear ringing.'
      },
      {
        text: 'Only chest heaviness and unreasoned yawning without any ear ringing at all.',
        rationale:
          'Chest heaviness and yawning are Drop in Tone; Silence Before the Snap is sharp ear ringing.'
      },
      {
        text: 'Only uncaused adrenaline with no auditory ringing as the final pre-severing biological sign.',
        rationale:
          'Uncaused adrenaline is Sharp Edge; the final pre-severing biological sign here is sharp ear ringing.'
      }
    ]
  },
  {
    number: 20,
    question: 'What environmental stillness signs appear in Phase 4 before the severing?',
    hint: 'Traffic, wind, and nature’s posture.',
    support: ['absolute stillness', 'traffic noise fades', 'nature appears to hold its breath'],
    options: [
      {
        text: 'Strange absolute stillness descends—traffic noise fades entirely, the wind pauses, and nature appears to hold its breath.',
        rationale:
          'Before severing, absolute stillness falls: traffic fades, wind pauses, and nature holds its breath.'
      },
      {
        text: 'Traffic doubles, wind howls continuously, and nature becomes louder than ever with no stillness.',
        rationale:
          'Traffic fades, wind pauses, and nature holds breath—not doubled noise and continuous howling.'
      },
      {
        text: 'Only screens flicker while traffic, wind, and nature sound remain completely normal.',
        rationale:
          'Phase 4 environment is absolute stillness of traffic, wind, and nature—not Phase 1 screen flicker alone.'
      },
      {
        text: 'Only muted flatter sky with many colors present and no traffic-fade stillness language.',
        rationale:
          'Muted flatter sky is Drop in Tone; Silence Before the Snap is acoustic-atmospheric vacuum stillness.'
      }
    ]
  },
  {
    number: 21,
    question: 'What happens at the exact moment physical communication cables go dark?',
    hint: 'Pressure event and what the field feels like for a split second after.',
    support: ['cables go dark', 'physical pop', 'clearer than it has ever been'],
    options: [
      {
        text: 'A sudden pressure drop is felt as a physical pop in the atmosphere, and for a split second the energetic field becomes clearer than it has ever been felt before.',
        rationale:
          'At cable dark, pressure drops as a physical atmospheric pop; for a split second the energetic field is clearer than ever felt before.'
      },
      {
        text: 'Pressure permanently rises and the field becomes denser and noisier than at any prior moment.',
        rationale:
          'Pressure drops with temporary extreme clarity—not permanent denser noisier field.'
      },
      {
        text: 'Nothing physical happens—only a software message while the field stays fully artificial-noise filled.',
        rationale:
          'A physical atmospheric pop and momentary field clarity occur—not a software message with no field change.'
      },
      {
        text: 'Only bird song returns immediately with no pressure pop and no field-clarity moment at all.',
        rationale:
          'The severing moment is pressure pop and field clarity; bird song had ceased at Sharp Edge, not an instant restore-only event.'
      }
    ]
  },
  {
    number: 22,
    question: 'When do these physical symptoms peak relative to false flag wobble and truth leak?',
    hint: 'An hour range inside the first 72 hours.',
    support: ['hours 36 and 72', 'false flag narratives', 'truth begins to leak'],
    options: [
      {
        text: 'Symptoms peak between hours 36 and 72, exactly when False Flag narratives wobble and truth begins to leak into collective consciousness.',
        rationale:
          'Symptoms peak between hours 36 and 72 when False Flag narratives wobble and truth begins leaking into collective consciousness.'
      },
      {
        text: 'Symptoms only peak in the first five minutes with no link to False Flag wobble or truth leak at all.',
        rationale:
          'Peak aligns with hours 36–72 and False Flag wobble / truth leak—not a five-minute-only spike without that link.'
      },
      {
        text: 'Symptoms never peak until decades after cables restore and False Flags become permanent unchallengeable law.',
        rationale:
          'Peak is inside the blackout window as False Flags wobble—not decades later under permanent false flags.'
      },
      {
        text: 'Symptoms peak only when MSM fully restores and truth is permanently sealed from collective awareness.',
        rationale:
          'Peak coincides with truth beginning to leak—not permanent sealing under restored MSM control.'
      }
    ]
  },
  {
    number: 23,
    question: 'How is the atmospheric pop interconnected with cable severing and fear-cycle engineering?',
    hint: 'Literal cable action, false geopolitical blame, and final fear cycle.',
    support: ['severing of the main internet', 'russia, china, or iran', 'final fear cycle'],
    options: [
      {
        text: 'The atmospheric pop aligns with literal severing of main internet and communication cables, falsely blamed on enemies such as Russia, China, or Iran to trigger the final fear cycle.',
        rationale:
          'The pop aligns with literal main-cable severing; false blame on actors such as Russia, China, or Iran triggers the final fear cycle.'
      },
      {
        text: 'The pop only happens when cables stay online and no geopolitical false blame narrative is ever used.',
        rationale:
          'The pop aligns with cable severing and is tied to false geopolitical blame for the final fear cycle.'
      },
      {
        text: 'The pop is unrelated weather while Whitehat maneuvers never intersect blackout operations at all.',
        rationale:
          'Indicators are linked to Blackout Timeline and Whitehat military maneuvers—not unrelated weather alone.'
      },
      {
        text: 'The pop restores every cable instantly with zero false blame and zero final fear-cycle push.',
        rationale:
          'The pop marks severing and clarity, not instant restore, and is paired with false blame for the fear cycle.'
      }
    ]
  },
  {
    number: 24,
    question: 'What tactical advantage do physical indicators give the Resonating Army?',
    hint: 'Recognition of signs versus fear loops designed for the masses.',
    support: ['tactical advantage', 'bypassing the fear loops', 'anchored in their truth'],
    options: [
      {
        text: 'By recognizing buzzing, adrenaline spikes, and atmospheric drops, awakened Sols stay anchored in truth and bypass fear loops designed to trap the masses.',
        rationale:
          'Anticipating indicators is a tactical advantage: recognizing buzzing, adrenaline spikes, and atmospheric drops keeps Sols truth-anchored and outside mass fear loops.'
      },
      {
        text: 'By ignoring all symptoms so Sols panic harder than NPCs inside every supermarket surge.',
        rationale:
          'Advantage is recognition and calm anchoring—not ignoring symptoms into deeper panic surges.'
      },
      {
        text: 'By using symptoms only to rewrite MSM scripts that permanently restore parasitic frequency control.',
        rationale:
          'Sols bypass fear loops as the field clears toward transition—not to restore parasitic control scripts.'
      },
      {
        text: 'By proving symptoms are random weather so no one should stay calm or avoid panic zones.',
        rationale:
          'Symptoms are Frequency Fracture signals; strategy includes calm recognition and avoiding panic zones.'
      }
    ]
  },
  {
    number: 25,
    question: 'What strategic posture should Resonating Sols hold during these physical shifts?',
    hint: 'Crowds versus community pockets, and lighthouse role in Drop in Tone and Sharp Edge.',
    support: ['avoid large crowds', 'small pockets of communities', 'lighthouses'],
    options: [
      {
        text: 'Avoid large crowds and panic zones, stay in small community pockets, and maintain harmonic calm as lighthouses while NPC scaffolding crumbles during Drop in Tone and Sharp Edge glitches.',
        rationale:
          'Sols avoid large crowds and panic zones, remain in small community pockets, and hold harmonic calm as lighthouses while NPC scaffolding crumbles.'
      },
      {
        text: 'Lead every large crowd into banks and fuel stations to amplify NPC emotional outbursts on purpose.',
        rationale:
          'Sols must avoid panic zones and hold calm lighthouse presence—not lead surges that amplify NPC glitch chaos.'
      },
      {
        text: 'Abandon all communities and refuse any lighthouse role until every physical indicator has permanently stopped.',
        rationale:
          'Strategy is active calm presence in small community pockets during the shifts—not total abandonment.'
      },
      {
        text: 'Follow every NPC fear scan for intel so Sols can fully re-enter the collapsing worldview together.',
        rationale:
          'Sols bypass fear loops and stabilize the field; they do not follow NPC intel-scanning collapse patterns.'
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

const topicImage = 'images/breakdown/physical-indicators.webp';
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
    'Test your grasp of Physical Indicators — Static Build Up through atmospheric pop, biological clock of the Blackout Timeline, and lighthouse strategy for Resonating Sols.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Physical Indicators are the body’s biological clock for Frequency Fracture during the Blackout Timeline—Static Build Up, Drop in Tone, Sharp Edge, Silence Before the Snap, and the atmospheric pop of cable dark. Sit with what you missed, then return to the Physical Indicators deep-dive, infographics, and video transmissions. Recognize the signs, stay out of panic zones, hold calm in small community pockets, and stabilize the field as NPC scaffolding crumbles.'
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
    'Test your understanding of Physical Indicators — four-phase symptom sequence, animal and NPC reactions, atmospheric pop, and Sol lighthouse posture.'
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
  throw new Error('physical-indicators not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on Physical Indicators: Static Build Up through atmospheric pop, biological clock of the Blackout Timeline, and lighthouse strategy for Resonating Sols.'
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
console.log('PASS: audited 25/25 against data/breakdown-topics/physical-indicators.json');
