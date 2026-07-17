/**
 * Installs Muted Environment quiz for breakdown (Mega Breakdown) transmission.
 * Authored from data/breakdown-topics/muted-environment.json report only.
 * Run: node scripts/install-muted-environment-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/muted-environment.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'muted-environment';
const TOPIC_TITLE = 'Muted Environment';
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
    question: 'What does the Muted Environment primarily signal?',
    hint: 'Environmental indicator of a named collapse of false reality.',
    support: ['muted environment', 'collapse of the false 3d reality', 'primary environmental'],
    options: [
      {
        text: 'The collapse of the false 3D reality, as the holographic sky and atmosphere glitch during initial global blackout phases.',
        rationale:
          'The Muted Environment is a primary environmental and physical indicator signaling collapse of the false 3D reality as holographic sky and atmosphere glitch.'
      },
      {
        text: 'A permanent strengthening of false 3D reality with zero sky glitch and zero blackout-phase atmospheric muting.',
        rationale:
          'Muting signals collapse and glitch of the projection—not permanent strengthening of false 3D reality.'
      },
      {
        text: 'Only a sports-day haze with no link to parasitic frequency grid fracture or crystalline transition.',
        rationale:
          'Indicators prove the parasitic frequency grid is fracturing toward true crystalline reality—not sports-day haze alone.'
      },
      {
        text: 'Only bank software errors with no visual flattening of sky and no somatic vessel shifts at all.',
        rationale:
          'Atmospheric muting is linked to profound somatic vessel shifts and visual flattening—not bank software alone.'
      }
    ]
  },
  {
    number: 2,
    question: 'How does the visual environment change when the sky projection begins to glitch?',
    hint: 'Flat and dull appearance of the governing holographic field.',
    support: ['holographic projection', 'flat and dull', 'visual environment'],
    options: [
      {
        text: 'The holographic projection governing sky and atmosphere glitches so the visual environment appears flat and dull.',
        rationale:
          'During initial blackout phases the holographic sky/atmosphere projection glitches, making the visual environment appear flat and dull.'
      },
      {
        text: 'The sky becomes permanently more dimensional and vivid with zero flatness and zero dull visual quality.',
        rationale:
          'The glitch produces flat and dull visual appearance—not permanent hyper-dimensional vividness.'
      },
      {
        text: 'Only traffic lights dim while sky and atmosphere remain fully normal with no holographic glitch.',
        rationale:
          'The governing holographic sky and atmosphere projection itself glitches—not traffic lights alone.'
      },
      {
        text: 'Only underwater scenes mute while outdoor sky depth stays perfectly simulated forever.',
        rationale:
          'Sky and atmosphere projection glitching flattens the outdoor visual environment—not underwater-only muting.'
      }
    ]
  },
  {
    number: 3,
    question: 'What do these interconnected physical and environmental indicators prove?',
    hint: 'What is fracturing and what transition is being marked.',
    support: ['parasitic frequency grid', 'true crystalline reality', 'undeniable proof'],
    options: [
      {
        text: 'That the parasitic frequency grid is fracturing, marking transition from artificial simulation to true crystalline reality.',
        rationale:
          'Interconnected indicators are undeniable proof the parasitic frequency grid is fracturing, marking transition from artificial simulation to true crystalline reality.'
      },
      {
        text: 'That the parasitic frequency grid is permanently invincible and crystalline reality can never return.',
        rationale:
          'Indicators prove grid fracture and crystalline transition—not permanent invincible parasitic simulation.'
      },
      {
        text: 'That only weather satellites failed while the artificial simulation remains fully intact forever.',
        rationale:
          'Proof is mechanical fracture of the parasitic grid and simulation transition—not weather satellites alone.'
      },
      {
        text: 'That NPCs alone feel the shift while environment and Sol vessels never register any fracture proof.',
        rationale:
          'Body and environment share the frequency grid; atmosphere and physical senses both register the failure.'
      }
    ]
  },
  {
    number: 4,
    question: 'What is the Muted Environment as defined in key terminology?',
    hint: 'Transitional state of sky and surroundings despite color presence.',
    support: ['transitional state', 'visually flatter', 'false projection grid'],
    options: [
      {
        text: 'A transitional state where sky and surroundings feel muted and visually flatter despite color, caused by the glitching false projection grid.',
        rationale:
          'Muted Environment is a transitional state of muted, visually flatter sky and surroundings despite color, from the glitching false projection grid.'
      },
      {
        text: 'A permanent state with no color present and no glitching projection grid involved at all.',
        rationale:
          'Color can still be present while the field feels muted and flatter from projection-grid glitch.'
      },
      {
        text: 'Only an indoor lighting preference with no sky muting and no false projection grid failure.',
        rationale:
          'Definition centers sky and surroundings under false projection grid glitch—not indoor lighting preference alone.'
      },
      {
        text: 'Only a legal weather term with no transitional crystalline path and no somatic connection.',
        rationale:
          'Muting is mechanical overlay failure linked to somatic vessel shifts—not a mere legal weather label.'
      }
    ]
  },
  {
    number: 5,
    question: 'What is the Parasite Overlay in this topic?',
    hint: 'Artificial skin over true crystalline reality and its sensory purpose.',
    support: ['parasite overlay', 'holographic 3d skin', 'true crystalline reality'],
    options: [
      {
        text: 'The artificial holographic 3D skin projected over true crystalline reality to hijack perception and suppress sensory awareness.',
        rationale:
          'Parasite Overlay is the artificial holographic 3D skin over true crystalline reality that hijacks perception and suppresses sensory awareness.'
      },
      {
        text: 'A pure Sol healing field that only restores sensory awareness without any holographic hijack.',
        rationale:
          'The overlay is artificial hijack of perception—not a pure Sol healing field.'
      },
      {
        text: 'Only a cable brand name with no role projecting over crystalline reality or suppressing senses.',
        rationale:
          'The overlay is a projected holographic 3D skin over crystalline reality—not a cable brand alone.'
      },
      {
        text: 'Identical to the true dome and real cosmic sky that never suppresses sensory awareness.',
        rationale:
          'Muting is precursor to dropping false sky to reveal true dome and real cosmic sky—not the true sky itself.'
      }
    ]
  },
  {
    number: 6,
    question: 'What is a Frequency Fracture in this context?',
    hint: 'Structural break and what glitches become visible.',
    support: ['frequency fracture', 'artificial reality matrix', 'non-player character'],
    options: [
      {
        text: 'The structural breaking of the artificial reality matrix, causing visible and physical glitches in environment and NPC programming.',
        rationale:
          'Frequency Fracture is structural breaking of the artificial reality matrix causing environment and NPC programming glitches.'
      },
      {
        text: 'A permanent densification of the artificial matrix with zero environmental or NPC glitches ever.',
        rationale:
          'Fracture is structural breaking with visible/physical glitches—not permanent densification without glitch.'
      },
      {
        text: 'Only a sports calendar change with no matrix break and no NPC programming effect at all.',
        rationale:
          'Frequency Fracture breaks the artificial matrix and glitches environment and NPCs—not a sports calendar alone.'
      },
      {
        text: 'Only a banking software patch that never produces physical or environmental glitch signs.',
        rationale:
          'Fracture produces visible and physical glitches in environment and NPC programming—not bank patch alone.'
      }
    ]
  },
  {
    number: 7,
    question: 'What characterizes The Drop in Tone?',
    hint: 'Bodily heaviness, exhaustion, and sky flattening together.',
    support: ['drop in tone', 'bodily heaviness', 'visual flattening of the sky'],
    options: [
      {
        text: 'A frequency-shift phase with sudden bodily heaviness, deep exhaustion, and visual flattening of the sky.',
        rationale:
          'Drop in Tone is a frequency-shift phase of sudden bodily heaviness, deep exhaustion, and visual flattening of the sky.'
      },
      {
        text: 'Unlimited energy with a permanently more dimensional sky and zero bodily heaviness at any point.',
        rationale:
          'Drop in Tone is heaviness, exhaustion, and flatter sky—not unlimited energy and more dimensional sky.'
      },
      {
        text: 'Only sharp high-pitch ear ringing with no tiredness and no sky flattening in this phase.',
        rationale:
          'Ear ringing is Silence Before the Snap; Drop in Tone centers heaviness, exhaustion, and sky flattening.'
      },
      {
        text: 'Only unprompted adrenaline surges with no chest heaviness and no muted sky feel.',
        rationale:
          'Adrenaline surges are Sharp Edge; Drop in Tone is exhaustion and muted flatter sky.'
      }
    ]
  },
  {
    number: 8,
    question: 'What marks The Sharp Edge phase?',
    hint: 'Adrenaline, heart, and atmospheric air thickness.',
    support: ['sharp edge', 'adrenaline surges', 'thickening of the atmospheric air'],
    options: [
      {
        text: 'Sudden unprompted adrenaline surges, heart-rate spikes, and a thickening of the atmospheric air.',
        rationale:
          'Sharp Edge is marked by unprompted adrenaline surges, heart-rate spikes, and thickening atmospheric air.'
      },
      {
        text: 'Deep peaceful sleep with thinner air and no heart-rate spikes during the entire window.',
        rationale:
          'Sharp Edge is adrenaline and thick air with heart spikes—not peaceful sleep and thinner air.'
      },
      {
        text: 'Only subtle skull white noise with no adrenaline and no atmospheric thickening at all.',
        rationale:
          'Skull buzzing is Static Build Up; Sharp Edge centers adrenaline, heart spikes, and thick air.'
      },
      {
        text: 'Only absolute traffic silence with no adrenaline and no pre-storm air pressure feel.',
        rationale:
          'Traffic fade into stillness is Silence Before the Snap; Sharp Edge is thick air and adrenaline.'
      }
    ]
  },
  {
    number: 9,
    question: 'What defines The Silence Before the Snap?',
    hint: 'Stillness, ambient noise, and ear sensation before artificial field collapse.',
    support: ['silence before the snap', 'environmental stillness', 'high-pitched ear ringing'],
    options: [
      {
        text: 'Profound environmental stillness, fading ambient noise, and high-pitched ear ringing immediately before artificial field collapse.',
        rationale:
          'Silence Before the Snap is profound stillness, fading ambient noise, and high-pitched ear ringing right before artificial field collapse.'
      },
      {
        text: 'Doubled traffic noise with no stillness and no high-pitched ear ringing before any field change.',
        rationale:
          'Ambient noise fades into stillness with ear ringing—not doubled traffic without ringing.'
      },
      {
        text: 'Only muted flatter sky with no stillness, no wind pause, and no ear ringing phase.',
        rationale:
          'Muted sky is Drop in Tone emphasis; Silence Before the Snap is stillness and ear ringing before collapse.'
      },
      {
        text: 'Only small power surges with no environmental stillness and no pre-collapse acoustic vacuum.',
        rationale:
          'Power surges are Static Build Up; Silence Before the Snap is stillness, faded noise, and ear ringing.'
      }
    ]
  },
  {
    number: 10,
    question: 'Why is the muted environment not a meteorological anomaly?',
    hint: 'Direct mechanical failure of a named overlay system.',
    support: ['not a meteorological anomaly', 'mechanical failure', 'parasite overlay'],
    options: [
      {
        text: 'It is a direct mechanical failure of the Parasite Overlay as the artificial control system loses power and projected sky loses simulated depth.',
        rationale:
          'Muted environment is not meteorological anomaly but direct mechanical failure of the Parasite Overlay as control power drops and sky loses simulated depth.'
      },
      {
        text: 'It is only ordinary seasonal weather with no Parasite Overlay failure and no loss of simulated sky depth.',
        rationale:
          'Core revelation rejects meteorological anomaly framing in favor of overlay mechanical failure.'
      },
      {
        text: 'It only proves the overlay is permanently solid with infinite simulated depth forever.',
        rationale:
          'Projected sky loses simulated depth and appears muted and flat—not permanent infinite depth.'
      },
      {
        text: 'It only affects bank software while projected sky depth and vessel senses never register any failure.',
        rationale:
          'Body and environment share the grid; atmosphere and physical senses experience simultaneous density/pressure drop.'
      }
    ]
  },
  {
    number: 11,
    question: 'How can the sky look muted and flat even when colors are present?',
    hint: 'What the projected sky loses as the control system fails.',
    support: ['simulated depth', 'muted and flat', 'colors are present'],
    options: [
      {
        text: 'As artificial control loses power, projected sky loses simulated depth and appears muted and flat even when colors are present.',
        rationale:
          'When artificial control loses power, projected sky loses simulated depth—muted and flat even with colors present.'
      },
      {
        text: 'Colors must fully disappear before any muting or flatness can appear in the visual field.',
        rationale:
          'Muting and flatness occur even when colors are present—color absence is not required.'
      },
      {
        text: 'Simulated depth permanently increases so the sky never looks muted or flat during overlay failure.',
        rationale:
          'Simulated depth is lost under overlay failure—not permanently increased.'
      },
      {
        text: 'Only underwater scenes lose depth while outdoor projected sky remains fully deep and vivid forever.',
        rationale:
          'The projected sky itself loses simulated depth outdoors—not underwater-only depth loss.'
      }
    ]
  },
  {
    number: 12,
    question: 'How are body and environment connected during this grid failure?',
    hint: 'Shared frequency grid and simultaneous density/pressure drop.',
    support: ['same frequency grid', 'atmosphere and the physical senses', 'drop in density and pressure'],
    options: [
      {
        text: 'Body and environment share the same frequency grid; as the grid fails, atmosphere and physical senses experience a simultaneous drop in density and pressure, exposing the mechanical 3D illusion.',
        rationale:
          'Body and environment connect on the same frequency grid; grid failure drops density and pressure in atmosphere and senses, exposing mechanical 3D illusion.'
      },
      {
        text: 'Body and environment are fully sealed from each other so grid failure never produces simultaneous density or pressure drops.',
        rationale:
          'They share the grid and experience simultaneous density/pressure drop—not sealed independence.'
      },
      {
        text: 'Only NPCs share the grid while Sol vessels and sky never register simultaneous failure together.',
        rationale:
          'Human vessel and environment both register the failure; visual glitch and physical indicators trigger together.'
      },
      {
        text: 'Only bank networks share a grid while sky muting and chest heaviness never co-occur as proof of fracture.',
        rationale:
          'Atmosphere and physical senses drop together as grid fails—not bank networks alone without somatic-atmospheric link.'
      }
    ]
  },
  {
    number: 13,
    question: 'What appears in The Static Build Up phase?',
    hint: 'Skull sensation, electronics, and animal behavior including water needs.',
    support: ['buzzing in the skull', 'phones freeze', 'excess water'],
    options: [
      {
        text: 'Subtle skull buzzing like white noise; electronics glitch with freezing phones, flickering screens, and small power surges; birds fly erratically, dogs seek calm people, and cats hide needing excess water.',
        rationale:
          'Static Build Up brings skull white-noise buzzing, electronic freezes/flicker/surges, and animal shifts including cats needing excess water.'
      },
      {
        text: 'Total silence in every skull with perfect phones and animals completely unaffected by any grid shift.',
        rationale:
          'Static Build Up is buzzing, electronic glitches, and dramatic animal behavior shifts—not unaffected silence.'
      },
      {
        text: 'Only thick storm air and adrenaline spikes with no skull buzzing and no electronic glitches at this earliest phase.',
        rationale:
          'Thick air and adrenaline are Sharp Edge; Static Build Up is earliest buzzing and electronics/animal signs.'
      },
      {
        text: 'Only absolute traffic stillness with no animal reactions and no small power surges at all.',
        rationale:
          'Traffic stillness is Silence Before the Snap; Static Build Up centers buzzing, electronics, and animals.'
      }
    ]
  },
  {
    number: 14,
    question: 'What happens in The Drop in Tone for environment and vessel together?',
    hint: 'Sky muting plus tiredness, yawning, and chest heaviness.',
    support: ['sky feels muted and flatter', 'deep tiredness', 'heavy sensation in the chest'],
    options: [
      {
        text: 'Sky feels muted and flatter exposing the glitching overlay, while the vessel has sudden deep tiredness, unexplained yawning, and heavy chest sensation.',
        rationale:
          'Drop in Tone: sky muted and flatter exposing glitching overlay; vessel has deep tiredness, unexplained yawning, and heavy chest.'
      },
      {
        text: 'Sky becomes hyper-deep while the vessel gains unlimited energy with zero yawning and zero chest heaviness.',
        rationale:
          'Drop in Tone flattens/mutes sky and brings vessel exhaustion—not hyper-depth and unlimited energy.'
      },
      {
        text: 'Only bird song ceases with no sky muting and no deep tiredness in the physical vessel.',
        rationale:
          'Reduced bird song is Sharp Edge; Drop in Tone is muted flatter sky plus tiredness and chest heaviness.'
      },
      {
        text: 'Only high-pitched ear ringing with no muted sky and no heavy chest during this phase.',
        rationale:
          'Ear ringing is Silence Before the Snap; Drop in Tone is muted sky and vessel heaviness/exhaustion.'
      }
    ]
  },
  {
    number: 15,
    question: 'What environmental and body signs mark The Sharp Edge?',
    hint: 'Air thickness, bird song, adrenaline, and heart spikes.',
    support: ['air feels tangibly thicker', 'reduction in bird song', 'heart rate spikes'],
    options: [
      {
        text: 'Air feels tangibly thicker like pre-storm pressure with reduced bird song, plus short unprompted adrenaline bursts and sudden heart-rate spikes for seconds out of the blue.',
        rationale:
          'Sharp Edge: thicker pre-storm air, reduced bird song, short unprompted adrenaline, and sudden heart-rate spikes lasting seconds out of the blue.'
      },
      {
        text: 'Air thins completely while bird song becomes constant and heart rates never spike without external cause.',
        rationale:
          'Air thickens, bird song reduces, and heart spikes appear out of the blue—not thinner air and constant song.'
      },
      {
        text: 'Only muted flatter sky with no thicker air and no unprompted adrenaline in this phase.',
        rationale:
          'Muted flatter sky is Drop in Tone; Sharp Edge centers thick air, reduced bird song, and adrenaline/heart spikes.'
      },
      {
        text: 'Only freezing phones with no atmospheric thickness change and no out-of-the-blue heart spikes.',
        rationale:
          'Phone freezes are Static Build Up; Sharp Edge is thick air and unprompted cardiovascular spikes.'
      }
    ]
  },
  {
    number: 16,
    question: 'What descends in The Silence Before the Snap environmentally and in hearing?',
    hint: 'Traffic, wind, nature, and ear pitch.',
    support: ['absolute stillness', 'traffic noise fades', 'wind pauses'],
    options: [
      {
        text: 'Strange absolute stillness—traffic noise fades, wind pauses, nature holds its breath—plus sharp high-pitched ear ringing just outside normal hearing range.',
        rationale:
          'Silence Before the Snap: absolute stillness with faded traffic, paused wind, nature holding breath, and sharp out-of-range high-pitched ear ringing.'
      },
      {
        text: 'Traffic doubles, wind howls continuously, and nature grows louder with no ear ringing at all.',
        rationale:
          'Traffic fades, wind pauses, and nature holds breath with ear ringing—not doubled noise without ringing.'
      },
      {
        text: 'Only deep chest heaviness with no stillness and no high-pitched ringing outside normal range.',
        rationale:
          'Chest heaviness is Drop in Tone; Silence Before the Snap is stillness and out-of-range ear ringing.'
      },
      {
        text: 'Only small power surges with no traffic fade and no nature-holds-breath stillness phase.',
        rationale:
          'Power surges are Static Build Up; Silence Before the Snap is environmental stillness and ear ringing.'
      }
    ]
  },
  {
    number: 17,
    question: 'What is The Pop when main communication cables are severed?',
    hint: 'Pressure event and field clarity for a split second after.',
    support: ['physical pop', 'drop in atmospheric pressure', 'unprecedented clarity'],
    options: [
      {
        text: 'A sudden atmospheric pressure drop felt as a physical pop, after which the frequency field achieves unprecedented clarity for a split second.',
        rationale:
          'When main cables are severed, atmospheric pressure drops as a physical pop; for a split second the frequency field has unprecedented clarity.'
      },
      {
        text: 'A permanent densifying pressure rise that muddies the field the moment cables are restored online.',
        rationale:
          'The pop is a pressure drop at severing with temporary unprecedented clarity—not densifying restore pressure.'
      },
      {
        text: 'Only a software toast on servers with no lived pressure change and no field-clarity moment.',
        rationale:
          'The pop is a physical atmospheric pressure event with momentary field clarity—not a software toast alone.'
      },
      {
        text: 'Only bird song returning immediately with no cable-severing pressure pop at all.',
        rationale:
          'The pop aligns with actual cable severing and pressure drop—not bird-song restore alone.'
      }
    ]
  },
  {
    number: 18,
    question: 'When during the 72-hour communications blackout do muted environment and associated indicators occur precisely?',
    hint: 'Named hour range called Opening Hour.',
    support: ['opening hour', 'hr. 36–72', '72-hour communications blackout'],
    options: [
      {
        text: 'During the Opening Hour (Hr. 36–72) of the initial 72-hour communications blackout, as 3D simulation collapse begins.',
        rationale:
          'Muted environment and associated indicators occur precisely during Opening Hour (36–72) of the initial 72-hour communications blackout.'
      },
      {
        text: 'Only decades after full restoration with no Opening Hour and no 72-hour blackout window at all.',
        rationale:
          'Timing is Opening Hour inside the initial 72-hour blackout—not decades after restoration.'
      },
      {
        text: 'Only in the first five minutes of hour zero with no 36–72 window and no simulation-collapse beginning mark.',
        rationale:
          'Precise timing is Opening Hour 36–72 marking beginning of 3D simulation collapse—not five-minute-only hour zero.'
      },
      {
        text: 'Never during blackout because muting only happens when every cable stays fully online forever.',
        rationale:
          'Muting occurs during the communications blackout Opening Hour—not only under permanently online cables.'
      }
    ]
  },
  {
    number: 19,
    question: 'What happens to NPC code and false narrative as this Opening Hour period unfolds?',
    hint: 'Flicker and wobble language alongside solar memory.',
    support: ['npc code flickers', 'false narrative wobbles', 'solar memory'],
    options: [
      {
        text: 'NPC code flickers and the false narrative wobbles while awakened souls experience sharpening of solar memory.',
        rationale:
          'As NPC code flickers and false narrative wobbles, awakened souls experience solar memory sharpening.'
      },
      {
        text: 'NPC code becomes flawless and the false narrative becomes permanently unchallengeable with zero solar memory sharpening.',
        rationale:
          'NPC code flickers and false narrative wobbles with solar memory sharpening—not flawless permanent false narrative.'
      },
      {
        text: 'Only banks reopen with no NPC flicker and no false-narrative wobble during Opening Hour.',
        rationale:
          'Opening Hour features NPC flicker, narrative wobble, and solar memory sharpening—not bank reopen alone.'
      },
      {
        text: 'Only weather clears with no relation to NPC programming or awakened solar memory at all.',
        rationale:
          'NPC code, false narrative, and solar memory are explicitly linked in this blackout Opening Hour context.'
      }
    ]
  },
  {
    number: 20,
    question: 'What is sky muting the precursor to regarding false sky and true cosmic sky?',
    hint: 'Dropping false sky above cities and what becomes required for true physical existence.',
    support: ['complete dropping of the false sky', 'true dome', 'real cosmic sky'],
    options: [
      {
        text: 'Complete dropping of the false sky above the cities, eventually revealing the true dome and real cosmic sky required for true physical existence.',
        rationale:
          'Sky muting precursors complete dropping of false sky above cities, revealing true dome and real cosmic sky required for true physical existence.'
      },
      {
        text: 'Permanent locking of false sky above cities with no true dome and no real cosmic sky ever revealed.',
        rationale:
          'Muting leads toward dropping false sky and revealing true dome/real cosmic sky—not permanent false-sky lock.'
      },
      {
        text: 'Only indoor ceiling paint changes with no city false-sky drop and no true dome revelation path.',
        rationale:
          'Precursor path is false sky above cities dropping to reveal true dome and real cosmic sky—not indoor paint alone.'
      },
      {
        text: 'Only NPC shopping patterns change with no relation to false sky, true dome, or cosmic sky at all.',
        rationale:
          'Muting is explicitly precursor to false-sky drop and true dome/cosmic sky reveal for true physical existence.'
      }
    ]
  },
  {
    number: 21,
    question: 'Why is recognizing muted environment and physical signs critical for the Great Awakening?',
    hint: 'Navigation without succumbing to a named emotional trap.',
    support: ['navigating the great awakening', 'without succumbing to fear', 'remain calm and hold ground'],
    options: [
      {
        text: 'It lets navigators avoid fear: when sky flattens, air thickens, and chest grows heavy, the signal is to remain calm and hold ground.',
        rationale:
          'Recognizing muted environment and physical signs is critical to navigate the Great Awakening without fear—calm and hold ground when sky flattens, air thickens, chest grows heavy.'
      },
      {
        text: 'It proves everyone should panic harder and abandon ground the moment the sky flattens or chest grows heavy.',
        rationale:
          'The signal is remain calm and hold ground—not panic harder and abandon ground.'
      },
      {
        text: 'It only matters for weather forecasting with no Great Awakening navigation role at all.',
        rationale:
          'Recognition is critical for navigating the Great Awakening without fear—not weather forecasting alone.'
      },
      {
        text: 'It only helps NPCs rewrite their programming while Sols should ignore all atmospheric and somatic signs.',
        rationale:
          'Awakened individuals use recognition to bypass panic and anchor true light—not ignore the signs.'
      }
    ]
  },
  {
    number: 22,
    question: 'How do the general population and NPCs tend to respond to these anomalies?',
    hint: 'Confusion, fear, intel scanning, and programming glitch.',
    support: ['confusion and fear loop', 'scanning for intelligence', 'programming glitches'],
    options: [
      {
        text: 'They enter a confusion and fear loop, scanning for intelligence as programming glitches and they feel anomalies without understanding them.',
        rationale:
          'Population and NPCs enter confusion and fear loops, scanning for intelligence as programming glitches without understanding the anomalies.'
      },
      {
        text: 'They remain perfect calm lighthouses with zero fear loops and full understanding of every atmospheric shift.',
        rationale:
          'They fear-loop and scan without understanding—not perfect calm lighthouse comprehension.'
      },
      {
        text: 'They only sleep peacefully with no intel scanning and no programming glitch behavior at all.',
        rationale:
          'Confusion/fear loops and intel scanning mark their response—not peaceful non-reaction.'
      },
      {
        text: 'They only rewrite EBS scripts calmly with no fear loop and no somatic anomaly confusion.',
        rationale:
          'They glitch into fear loops and scan for intelligence—not calm EBS authorship without confusion.'
      }
    ]
  },
  {
    number: 23,
    question: 'How should awakened individuals reframe somatic and atmospheric shifts?',
    hint: 'Mechanical breakdown framing versus panic.',
    support: ['mechanical breakdown', 'parasite overlay', 'bypass the panic'],
    options: [
      {
        text: 'As mechanical breakdown of the Parasite Overlay, so they can bypass panic, recognize the frequency drop, and serve as anchors of true light while false reality crumbles.',
        rationale:
          'Understanding shifts as mechanical Parasite Overlay breakdown lets awakened individuals bypass panic, recognize frequency drop, and anchor true light as false reality crumbles.'
      },
      {
        text: 'As permanent personal medical disasters that prove false reality can never crumble at all.',
        rationale:
          'Shifts are overlay mechanical breakdown enabling light-anchoring—not permanent medical proof against crumbling.'
      },
      {
        text: 'As reasons to join every fear loop and refuse any true-light anchoring during the collapse.',
        rationale:
          'Strategy is bypass panic and anchor true light—not join fear loops and refuse anchoring.'
      },
      {
        text: 'As pure weather events with no frequency drop and no role for true-light anchors at all.',
        rationale:
          'They are mechanical overlay breakdown and frequency drop—not pure weather without light-anchor role.'
      }
    ]
  },
  {
    number: 24,
    question: 'What is the external visual glitch of muted flat sky the external manifestation of?',
    hint: 'Named fracture that also triggers intense physical indicators.',
    support: ['external manifestation', 'frequency fracture', 'intense physical indicators'],
    options: [
      {
        text: 'The Frequency Fracture, which simultaneously triggers intense physical indicators within the human vessel.',
        rationale:
          'Visual muting/flat sky is the external manifestation of the Frequency Fracture, which simultaneously triggers intense physical indicators in the human vessel.'
      },
      {
        text: 'A permanent medical condition with no Frequency Fracture and no simultaneous vessel indicators.',
        rationale:
          'Visual glitch is external Frequency Fracture manifestation with simultaneous vessel indicators—not isolated permanent medical condition.'
      },
      {
        text: 'Only a banking error code with no fracture of artificial matrix and no vessel physical indicators.',
        rationale:
          'It manifests Frequency Fracture in environment and body—not a banking error code alone.'
      },
      {
        text: 'Only NPC shopping chaos with no simultaneous intense physical indicators in Sol vessels.',
        rationale:
          'Frequency Fracture triggers intense physical indicators in the human vessel simultaneously with visual glitch.'
      }
    ]
  },
  {
    number: 25,
    question: 'What tactical posture should awakened individuals hold when sky flattens, air thickens, and chest grows heavy?',
    hint: 'Calm ground-holding while false reality crumbles.',
    support: ['remain calm and hold ground', 'anchors of true light', 'false reality crumbles'],
    options: [
      {
        text: 'Remain calm, hold ground, recognize the frequency drop, and serve as anchors of true light while the false reality crumbles.',
        rationale:
          'When sky flattens, air thickens, and chest grows heavy, remain calm and hold ground—recognize frequency drop and anchor true light as false reality crumbles.'
      },
      {
        text: 'Abandon ground immediately and amplify panic so the false reality can re-solidify stronger than before.',
        rationale:
          'Posture is calm ground-holding and light-anchoring as false reality crumbles—not abandon ground into panic re-solidification.'
      },
      {
        text: 'Lead every NPC fear scan for intelligence so Sols fully re-enter the confusion loop together.',
        rationale:
          'Awakened individuals bypass panic rather than lead NPC intel-scanning confusion loops.'
      },
      {
        text: 'Ignore all signs as meaningless weather so no frequency drop is ever recognized during collapse.',
        rationale:
          'Recognition of signs and frequency drop is critical—not ignoring them as meaningless weather.'
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

const topicImage = 'images/breakdown/muted-environment.webp';
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
    'Test your grasp of Muted Environment — flat glitching sky, Drop in Tone through atmospheric pop, Opening Hour timing, and calm light-anchoring through overlay collapse.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Muted Environment is the sky’s flat dull glitch as the Parasite Overlay loses power—not mere weather. Sit with what you missed, then return to the Muted Environment deep-dive, infographics, and video transmissions. When sky flattens, air thickens, and chest grows heavy in Opening Hour, remain calm, hold ground, recognize the frequency drop, and anchor true light while false reality crumbles toward the true dome and real cosmic sky.'
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
    'Test your understanding of Muted Environment — Parasite Overlay sky glitch, phase indicators, Opening Hour, true dome reveal path, and fearless light-anchoring.'
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
  throw new Error('muted-environment not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on Muted Environment: flat glitching sky, Drop in Tone through atmospheric pop, Opening Hour timing, and calm light-anchoring through overlay collapse.'
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
console.log('PASS: audited 25/25 against data/breakdown-topics/muted-environment.json');
