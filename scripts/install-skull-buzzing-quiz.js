/**
 * Installs Skull Buzzing quiz for breakdown (Mega Breakdown) transmission.
 * Authored from data/breakdown-topics/skull-buzzing.json report only.
 * Run: node scripts/install-skull-buzzing-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/skull-buzzing.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'skull-buzzing';
const TOPIC_TITLE = 'Skull Buzzing';
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
    question: 'What is Subtle Buzzing in the Skull primarily an indicator of?',
    hint: 'A named build-up during initial fracturing of false 3D reality.',
    support: ['static build up', 'primary physiological indicator', 'false 3d reality'],
    options: [
      {
        text: 'The Static Build Up during initial fracturing of the false 3D reality, signaling parasitic-overlay collapse and dormant memory-code awakening.',
        rationale:
          'Subtle Buzzing in the Skull is a primary physiological indicator of Static Build Up as false 3D reality fractures, overlay collapses, and dormant memory codes awaken.'
      },
      {
        text: 'A permanent medical failure with no link to Static Build Up, overlay collapse, or frequency shift at all.',
        rationale:
          'Buzzing marks Static Build Up and frequency shift—not a permanent personal medical failure without grid meaning.'
      },
      {
        text: 'Only a sports-day headache with no relation to the realm’s frequency shift or artificial matrix collapse.',
        rationale:
          'The vessel translates energetic collapse of the artificial matrix into tangible sensations—not a sports-day headache alone.'
      },
      {
        text: 'Proof that the false 3D reality is permanently solid and never begins to fracture or dissolve.',
        rationale:
          'Buzzing marks the critical opening hours of frequency shift and overlay collapse—not permanent solid false reality.'
      }
    ]
  },
  {
    number: 2,
    question: 'Why does the physical vessel register these sensations so directly?',
    hint: 'Receiver role translating energetic collapse into the body.',
    support: ['biological receiver', 'artificial matrix', 'tangible, physical sensations'],
    options: [
      {
        text: 'Because the physical vessel acts as a biological receiver, translating energetic collapse of the artificial matrix into tangible physical sensations.',
        rationale:
          'The physical vessel is a biological receiver that translates artificial-matrix energetic collapse into tangible physical sensations.'
      },
      {
        text: 'Because the vessel is completely frequency-blind and never translates matrix collapse into any body sensation.',
        rationale:
          'The vessel acts as a biological receiver of matrix collapse—not frequency-blind to the shift.'
      },
      {
        text: 'Because only bank software glitches while the body remains sealed off from all grid and overlay changes.',
        rationale:
          'The body immediately registers environmental destabilization as density constructs vanish—not body-blind bank glitches alone.'
      },
      {
        text: 'Because Resonating Sols never feel anything until decades after the original realm fully returns.',
        rationale:
          'Signs mark critical opening hours of the frequency shift; the vessel registers collapse as it happens.'
      }
    ]
  },
  {
    number: 3,
    question: 'What are Signs in Body?',
    hint: 'Physical and sensory symptoms during realm transition and overlay glitch.',
    support: ['signs in body', 'physical and sensory symptoms', 'false frequency overlay'],
    options: [
      {
        text: 'Distinct physical and sensory symptoms experienced as the realm transitions and the false frequency overlay glitches.',
        rationale:
          'Signs in Body are distinct physical and sensory symptoms as the realm transitions and the false frequency overlay glitches.'
      },
      {
        text: 'Only legal documents with no physical or sensory symptoms during any frequency overlay glitch.',
        rationale:
          'Signs in Body are lived physical and sensory symptoms—not legal documents alone.'
      },
      {
        text: 'Only NPC panic scripts with no distinct body sensations for true Sols during the shift.',
        rationale:
          'Signs in Body include Sol vessel sensations during overlay glitch—not NPC scripts alone.'
      },
      {
        text: 'Permanent silence in every vessel with zero transition symptoms and zero overlay glitch registration.',
        rationale:
          'Signs in Body mark transition and overlay glitch with clear sensory registration—not permanent silence.'
      }
    ]
  },
  {
    number: 4,
    question: 'How is Subtle Buzzing in the Skull described as a sensation?',
    hint: 'Comparison to a familiar continuous background sound.',
    support: ['background white noise', 'atmospheric and energetic static', 'subtle buzzing'],
    options: [
      {
        text: 'A physical sensation resembling background white noise, indicating atmospheric and energetic static build-up.',
        rationale:
          'Subtle Buzzing in the Skull resembles background white noise and indicates atmospheric and energetic static build-up.'
      },
      {
        text: 'A permanent loud concert in the ears with no white-noise quality and no static build-up meaning.',
        rationale:
          'It is subtle white-noise-like buzzing of static build-up—not a permanent loud concert without meaning.'
      },
      {
        text: 'Only visual sparks with no auditory or skull-sensation component during Static Build Up.',
        rationale:
          'The sign is a physical skull buzzing sensation like white noise—not visual sparks alone.'
      },
      {
        text: 'Only a weather forecast graphic with no felt atmospheric or energetic static in the vessel.',
        rationale:
          'Buzzing is a felt physical sensation of atmospheric and energetic static—not a weather graphic alone.'
      }
    ]
  },
  {
    number: 5,
    question: 'What is Static Build Up in this transmission?',
    hint: 'Energetic pressure accumulation and what anomalies it causes.',
    support: ['static build up', 'energetic pressure', 'electronic glitches'],
    options: [
      {
        text: 'The accumulation of energetic pressure during the frequency fracture that causes physiological anomalies and environmental electronic glitches.',
        rationale:
          'Static Build Up is accumulated energetic pressure during frequency fracture causing physiological anomalies and environmental electronic glitches.'
      },
      {
        text: 'A permanent calm with zero energetic pressure and zero physiological or electronic anomalies at all.',
        rationale:
          'Static Build Up is pressure accumulation producing anomalies and glitches—not permanent calm without signs.'
      },
      {
        text: 'Only a banking holiday with no frequency fracture and no physiological anomaly in any vessel.',
        rationale:
          'Static Build Up is frequency-fracture pressure with body and electronics effects—not a banking holiday alone.'
      },
      {
        text: 'Only Voice to Skull projections with no organic static and no electronic environmental mirror.',
        rationale:
          'Organic Static Build Up includes internal buzzing mirrored by external electronic glitches—distinct from Voice to Skull.'
      }
    ]
  },
  {
    number: 6,
    question: 'What is Voice to Skull technology?',
    hint: 'Parasitic projection into the head and its control purpose.',
    support: ['voice to skull', 'artificial thoughts', 'control, distract, or cause breakdowns'],
    options: [
      {
        text: 'Parasitic weaponized technology that projects artificial thoughts or voices into the head to control, distract, or cause breakdowns.',
        rationale:
          'Voice to Skull is parasitic weaponized tech projecting artificial thoughts or voices into the head to control, distract, or cause breakdowns.'
      },
      {
        text: 'An organic Sol lighthouse method that only broadcasts origin memory without any parasitic control intent.',
        rationale:
          'Voice to Skull is parasitic weaponized projection—not an organic Sol lighthouse broadcast method.'
      },
      {
        text: 'A pure hardware cable brand with no ability to project thoughts or voices into any head.',
        rationale:
          'Voice to Skull projects artificial thoughts or voices into the head—not a cable brand alone.'
      },
      {
        text: 'Only environmental phone freezes with no projected voices and no control or distraction purpose.',
        rationale:
          'Voice to Skull is mind-targeting parasitic projection; phone freezes mirror organic static, not the weapon itself.'
      }
    ]
  },
  {
    number: 7,
    question: 'What characterizes The Drop in Tone as a phase of the frequency shift?',
    hint: 'Physical exhaustion and how the environment looks.',
    support: ['drop in tone', 'deep physical exhaustion', 'flattened, muted environment'],
    options: [
      {
        text: 'Deep physical exhaustion and a visibly flattened, muted environment as part of the frequency shift.',
        rationale:
          'Drop in Tone is characterized by deep physical exhaustion and a visibly flattened, muted environment.'
      },
      {
        text: 'Unlimited energy and a brilliantly dimensional sky with zero muted flattening of the field.',
        rationale:
          'Drop in Tone is exhaustion and muted flattened environment—not unlimited energy and brilliant depth.'
      },
      {
        text: 'Only sharp high-pitch ear ringing with no tiredness and no muted environmental feel at all.',
        rationale:
          'Ear ringing is Silence Before the Snap; Drop in Tone centers exhaustion and muted environment.'
      },
      {
        text: 'Only unprovoked adrenaline surges with no chest heaviness and no profound tiredness.',
        rationale:
          'Adrenaline surges are Sharp Edge; Drop in Tone includes sudden profound tiredness and chest heaviness.'
      }
    ]
  },
  {
    number: 8,
    question: 'What characterizes The Sharp Edge during the shift?',
    hint: 'Adrenaline, heart, and atmospheric air feel.',
    support: ['sharp edge', 'adrenaline surges', 'thickening of the atmospheric air'],
    options: [
      {
        text: 'Unprovoked adrenaline surges, heart-rate spikes, and a thickening of the atmospheric air.',
        rationale:
          'Sharp Edge causes unprovoked adrenaline surges, heart-rate spikes, and thickening of atmospheric air.'
      },
      {
        text: 'Deep peaceful sleep with thinner air and no heart-rate spikes at any point in the shift.',
        rationale:
          'Sharp Edge is adrenaline and thick air with heart spikes—not peaceful sleep and thinner air.'
      },
      {
        text: 'Only continuous skull white noise with no adrenaline and no atmospheric thickening.',
        rationale:
          'Skull white-noise buzzing is Static Build Up; Sharp Edge centers adrenaline, heart spikes, and thick air.'
      },
      {
        text: 'Only random weather rain with no vessel adrenaline and no atmospheric pressure feel change.',
        rationale:
          'Sharp Edge is unprovoked vessel adrenaline and thicker air of the shift—not ordinary rain alone.'
      }
    ]
  },
  {
    number: 9,
    question: 'Why are bodily sensations in the first 72 hours of communications blackout not random biological events?',
    hint: 'Direct responses to a named energetic event.',
    support: ['first 72 hours', 'not random biological events', 'frequency fracture'],
    options: [
      {
        text: 'They are direct responses to a Frequency Fracture, not random biological events during the blackout window.',
        rationale:
          'Bodily sensations in the first 72 hours of communications blackout are direct Frequency Fracture responses—not random biological events.'
      },
      {
        text: 'They are only ordinary seasonal allergies with no Frequency Fracture link and no blackout timing.',
        rationale:
          'Core revelation rejects random biology; sensations track Frequency Fracture during the blackout window.'
      },
      {
        text: 'They prove the artificial scaffolding is permanently solid and never crumbles into biological registration.',
        rationale:
          'Buzzing is a biological translation of artificial scaffolding crumbling—not proof of permanent solidity.'
      },
      {
        text: 'They only affect NPCs while true Sol vessels never register environmental destabilization at all.',
        rationale:
          'The physical vessel is tied to the grid and immediately registers environmental destabilization as density constructs vanish.'
      }
    ]
  },
  {
    number: 10,
    question: 'During which named phase does skull buzzing emerge as an internal receiver of interference?',
    hint: 'Opening Hour hour range and what the receiver catches.',
    support: ['phase three: opening hour', 'hr. 36–72', 'npc code'],
    options: [
      {
        text: 'Phase Three: Opening Hour (Hr. 36–72), as an internal receiver catching interference of breaking NPC Code and sharpening Sol Memory.',
        rationale:
          'Buzzing emerges during Phase Three Opening Hour (36–72) as an internal receiver of breaking NPC Code interference and Sol Memory sharpening.'
      },
      {
        text: 'Only decades after full restoration with no Opening Hour and no NPC Code interference to catch.',
        rationale:
          'Emergence is during Opening Hour of the blackout window—not decades after restoration.'
      },
      {
        text: 'Only Phase One hour zero with no Sol Memory sharpening and no receiver role for NPC Code break.',
        rationale:
          'Core revelation places buzzing emergence in Opening Hour (36–72) as receiver of NPC Code break and Sol Memory sharpening.'
      },
      {
        text: 'Never during any phase, because the skull never acts as a receiver of grid or code interference.',
        rationale:
          'The skull buzzing operates as an internal receiver of interference during Opening Hour.'
      }
    ]
  },
  {
    number: 11,
    question: 'What is the buzzing a biological translation of?',
    hint: 'What surrounding structure is crumbling.',
    support: ['biological translation', 'artificial scaffolding crumbling', 'physical vessel'],
    options: [
      {
        text: 'The surrounding artificial scaffolding crumbling as the physical vessel stays intimately tied to the grid.',
        rationale:
          'Buzzing is a biological translation of surrounding artificial scaffolding crumbling; the vessel is intimately tied to the grid.'
      },
      {
        text: 'A permanent strengthening of artificial scaffolding with no crumbling and no grid registration in the body.',
        rationale:
          'Scaffolding crumbles and the body registers destabilization—not permanent scaffolding strength without registration.'
      },
      {
        text: 'Only a sports-day stress response with no artificial scaffolding and no grid connection whatsoever.',
        rationale:
          'The vessel is tied to the grid translating scaffolding collapse—not a sports-day stress response alone.'
      },
      {
        text: 'Only Voice to Skull scripts with no organic scaffolding collapse and no environmental electronic mirror.',
        rationale:
          'Organic buzzing translates scaffolding crumbling and is mirrored by environmental electronic glitches—distinct from Voice to Skull.'
      }
    ]
  },
  {
    number: 12,
    question: 'How does The Static Build Up present inside perception and outside in electronics?',
    hint: 'Internal white noise mirrored by phones and power behavior.',
    support: ['constant, subtle white noise', 'freezing phones', 'power surges'],
    options: [
      {
        text: 'As constant subtle white noise in the background of perception, mirrored externally by electronic glitches, freezing phones, and small power surges.',
        rationale:
          'Static Build Up buzzing is constant subtle white noise in perception, mirrored by electronic glitches, freezing phones, and small power surges.'
      },
      {
        text: 'As total silence inside the skull with perfect phones and zero power surges in the environment.',
        rationale:
          'Internal white noise is mirrored by electronic glitches—not total silence with perfect devices.'
      },
      {
        text: 'As only thick storm air with no internal white noise and no phone freezes at this stage.',
        rationale:
          'Thick air is Sharp Edge emphasis; Static Build Up centers internal white noise and electronic glitches.'
      },
      {
        text: 'As only deep chest heaviness with no background white noise and no environmental electronic mirror.',
        rationale:
          'Chest heaviness is Drop in Tone; Static Build Up is skull white noise plus electronic glitches.'
      }
    ]
  },
  {
    number: 13,
    question: 'What body signs follow the static in The Drop in Tone?',
    hint: 'Tiredness, yawning, and chest sensation.',
    support: ['profound tiredness', 'unexplained yawning', 'heaviness in the chest'],
    options: [
      {
        text: 'Sudden profound tiredness, unexplained yawning, and a feeling of heaviness in the chest.',
        rationale:
          'Drop in Tone brings sudden profound tiredness, unexplained yawning, and heaviness in the chest after static.'
      },
      {
        text: 'Unlimited energy with light chest and zero unexplained yawning throughout the shift.',
        rationale:
          'Drop in Tone is profound tiredness, yawning, and chest heaviness—not unlimited energy.'
      },
      {
        text: 'Only sharp ear ringing with no tiredness, no yawning, and no chest heaviness at all.',
        rationale:
          'Ear ringing is Silence Before the Snap; Drop in Tone is tiredness, yawning, and chest heaviness.'
      },
      {
        text: 'Only unprovoked adrenaline for hours with no fatigue phase after the static build-up.',
        rationale:
          'Adrenaline bursts are Sharp Edge; Drop in Tone is the exhaustion phase following static.'
      }
    ]
  },
  {
    number: 14,
    question: 'What does the physical vessel undergo during The Sharp Edge?',
    hint: 'Adrenaline timing and heart-rate pattern.',
    support: ['unprovoked bursts of adrenaline', 'heart rate spikes', 'out of the blue'],
    options: [
      {
        text: 'Short unprovoked bursts of adrenaline with heart-rate spikes that appear out of the blue for seconds at a time.',
        rationale:
          'Sharp Edge brings short unprovoked adrenaline bursts and heart-rate spikes that appear out of the blue for seconds.'
      },
      {
        text: 'Continuous deep sleep with no adrenaline and no out-of-the-blue heart-rate spikes at all.',
        rationale:
          'Sharp Edge is short unprovoked adrenaline and heart spikes—not continuous deep sleep without spikes.'
      },
      {
        text: 'Only muted flat sky perception with no adrenaline and no cardiovascular spike pattern.',
        rationale:
          'Muted flat sky correlates with exhaustion environment; Sharp Edge centers adrenaline and heart spikes.'
      },
      {
        text: 'Only freezing phones with no vessel adrenaline and no seconds-long heart-rate spikes.',
        rationale:
          'Phone freezes mirror Static Build Up; Sharp Edge is vessel adrenaline and heart spikes.'
      }
    ]
  },
  {
    number: 15,
    question: 'What marks The Silence Before the Snap in hearing and atmosphere?',
    hint: 'Ear pitch, pressure drop, and stillness of noise.',
    support: ['sharp ringing in the ears', 'drop in atmospheric pressure', 'strange stillness'],
    options: [
      {
        text: 'Sharp ear ringing at a high pitch just outside normal hearing range, then a sudden atmospheric pressure drop with strange stillness as natural and artificial noises fade.',
        rationale:
          'Silence Before the Snap brings sharp out-of-range ear ringing, sudden atmospheric pressure drop, and strange stillness as noises fade.'
      },
      {
        text: 'Doubled traffic noise with no ear ringing and no atmospheric pressure drop at any point.',
        rationale:
          'Noises fade into strange stillness with pressure drop—not doubled traffic without ringing.'
      },
      {
        text: 'Only subtle continuous skull white noise with no sharp high-pitch ringing and no stillness phase.',
        rationale:
          'Continuous white-noise buzzing is Static Build Up; Silence Before the Snap is sharp ringing and stillness.'
      },
      {
        text: 'Only thick pre-storm air with no ear ringing and no fade of natural and artificial noises.',
        rationale:
          'Thick air is Sharp Edge; Silence Before the Snap centers ringing, pressure drop, and stillness.'
      }
    ]
  },
  {
    number: 16,
    question: 'How must organic buzzing of the shift be distinguished from parasitic interference?',
    hint: 'Mind-altering weapons and who Voice to Skull primarily triggers.',
    support: ['parasitic interference vs. organic shift', 'mind altering weapons', 'violent or erratic behavior'],
    options: [
      {
        text: 'Organic buzzing of the shift differs from parasitic Mind Altering Weapons; Voice to Skull projects artificial voices and thoughts, primarily triggering NPCs or heavily stained human vessels into violent or erratic behavior.',
        rationale:
          'Organic shift buzzing must be distinguished from Voice to Skull mind weapons that project artificial voices/thoughts and trigger NPCs or stained vessels into violent or erratic behavior.'
      },
      {
        text: 'There is no difference because organic buzzing and Voice to Skull are always identical medical failures.',
        rationale:
          'It is critical to distinguish organic buzzing of the shift from parasitic Voice to Skull interference.'
      },
      {
        text: 'Voice to Skull only heals NPCs calmly and never projects artificial thoughts or triggers erratic behavior.',
        rationale:
          'Voice to Skull controls, distracts, or causes breakdowns and can trigger violent or erratic behavior.'
      },
      {
        text: 'Organic buzzing only exists in animals while humans never need to distinguish parasitic projections at all.',
        rationale:
          'Humans feel organic buzzing and must distinguish it from parasitic Voice to Skull projections into the head.'
      }
    ]
  },
  {
    number: 17,
    question: 'How do animals react as the skull buzzes and frequency shifts?',
    hint: 'Birds, dogs near calm people, and cats with water needs.',
    support: ['birds fly erratically', 'dogs become restless', 'extra water'],
    options: [
      {
        text: 'Birds fly erratically, dogs become restless and seek calm individuals, and cats disappear to safe spots needing extra water.',
        rationale:
          'As skull buzzes, animals react: erratic birds, restless dogs seeking calm people, and cats hiding with extra water needs.'
      },
      {
        text: 'All animals remain completely unaffected with no erratic flight, restlessness, or water-need change.',
        rationale:
          'Animals react to shifting frequency with clear behavioral changes—not total non-response.'
      },
      {
        text: 'Only fish glow while birds, dogs, and cats show zero response to the shifting frequency.',
        rationale:
          'Named reactions are birds, dogs, and cats—not fish-only glow without land-animal response.'
      },
      {
        text: 'Dogs abandon calm Sols while cats throw loud parties with no need for safe spots or extra water.',
        rationale:
          'Dogs seek calm individuals and cats hide needing extra water—not the reverse chaos pattern.'
      }
    ]
  },
  {
    number: 18,
    question: 'How does physical exhaustion correlate with the visual environment?',
    hint: 'Sky quality under overlay glitch.',
    support: ['physical exhaustion', 'muted and flat', 'overlay glitching'],
    options: [
      {
        text: 'Physical exhaustion correlates with a sky that feels muted and flat due to the overlay glitching.',
        rationale:
          'Physical exhaustion correlates directly with visual environment: sky feels muted and flat because the overlay is glitching.'
      },
      {
        text: 'Exhaustion always pairs with a permanently more dimensional vivid sky and zero overlay glitch.',
        rationale:
          'Exhaustion correlates with muted flat sky under overlay glitch—not permanent vivid dimensional sky.'
      },
      {
        text: 'Exhaustion never correlates with sky quality and only appears as bank-software errors offline.',
        rationale:
          'Exhaustion correlates directly with muted flat sky from overlay glitch—not bank software alone.'
      },
      {
        text: 'Only adrenaline spikes correlate with sky muting while exhaustion never appears in the sequence.',
        rationale:
          'Drop in Tone exhaustion correlates with muted flat sky; the sequence includes both exhaustion and later adrenaline phases.'
      }
    ]
  },
  {
    number: 19,
    question: 'How does the air itself change during these interconnected environmental signs?',
    hint: 'Comparison to atmosphere before a heavy storm.',
    support: ['noticeably thicker', 'heavy storm', 'air itself'],
    options: [
      {
        text: 'The air becomes noticeably thicker, mimicking the atmosphere right before a heavy storm.',
        rationale:
          'The air itself becomes noticeably thicker, mimicking the atmosphere right before a heavy storm.'
      },
      {
        text: 'The air permanently thins to vacuum with no pre-storm thickness feel during the shift.',
        rationale:
          'Air becomes noticeably thicker like pre-storm atmosphere—not permanent vacuum thinning.'
      },
      {
        text: 'The air never changes while only skull buzzing appears with zero atmospheric thickness shift.',
        rationale:
          'Broader context links thicker air with the body signs—not buzzing without atmospheric change.'
      },
      {
        text: 'Only indoor AC changes with no outdoor atmospheric thickness mimicking pre-storm pressure.',
        rationale:
          'The air itself thickens like pre-storm atmosphere as part of environmental interconnection—not AC-only change.'
      }
    ]
  },
  {
    number: 20,
    question: 'What ultimate role does the physical vessel play as a biological antenna?',
    hint: 'What collapse and return it is interpreting.',
    support: ['biological antenna', '3d projection', 'original realm'],
    options: [
      {
        text: 'It interprets the collapse of the 3D projection and the return of the original realm.',
        rationale:
          'Ultimately the physical vessel acts as a biological antenna interpreting collapse of the 3D projection and return of the original realm.'
      },
      {
        text: 'It only interprets bank interest rates with no 3D projection collapse and no original-realm return signal.',
        rationale:
          'The antenna role is 3D projection collapse and original-realm return—not bank rates alone.'
      },
      {
        text: 'It permanently blocks all original-realm signal and freezes the 3D projection forever without interpretation.',
        rationale:
          'The vessel interprets collapse and original-realm return—not permanent freeze without signal.'
      },
      {
        text: 'It only receives Voice to Skull scripts and never reads organic grid collapse or realm return.',
        rationale:
          'Organic antenna role is grid collapse and original-realm return; Voice to Skull is separate parasitic interference.'
      }
    ]
  },
  {
    number: 21,
    question: 'What tactical advantage do these physical indicators give the Resonating Army?',
    hint: 'What masses do versus what awakened recognition confirms.',
    support: ['tactical advantage', 'fear loops', 'confirmation of the true timeline'],
    options: [
      {
        text: 'While masses and NPCs enter fear loops, scanning for intelligence and showing emotional outbursts or crying, awakened individuals recognize skull buzzing, heart spikes, and exhaustion as confirmation of the true timeline.',
        rationale:
          'Understanding indicators is a tactical advantage: masses/NPCs fear-loop while awakened Sols read buzzing, heart spikes, and exhaustion as true-timeline confirmation.'
      },
      {
        text: 'By treating every symptom as random illness so Sols panic harder than NPCs in every crowd surge.',
        rationale:
          'Advantage is recognizing symptoms as grid death throes—not random illness panic that deepens fear loops.'
      },
      {
        text: 'By ignoring all body signs so no one ever confirms the true timeline during the blackout window.',
        rationale:
          'Recognition of buzzing, heart spikes, and exhaustion confirms the true timeline—not total ignore.'
      },
      {
        text: 'By using symptoms only to prove Voice to Skull is organic and never distinguish parasitic projections.',
        rationale:
          'Sols must distinguish organic shift signs from parasitic Voice to Skull—not collapse that distinction.'
      }
    ]
  },
  {
    number: 22,
    question: 'How should resonating beings interpret skull buzzing, heart spikes, and exhaustion?',
    hint: 'Death throes of the grid versus personal medical framing.',
    support: ['death throes of the parasitic grid', 'personal medical failures', 'hold their ground'],
    options: [
      {
        text: 'As death throes of the parasitic grid rather than personal medical failures, so they can calmly hold ground and anchor high-frequency light to shatter the final illusion.',
        rationale:
          'Identifying symptoms as parasitic-grid death throes—not personal medical failures—lets resonating beings hold ground and anchor high-frequency light to shatter the final illusion.'
      },
      {
        text: 'As permanent personal medical failures that prove the true timeline never advances at all.',
        rationale:
          'Symptoms confirm the true timeline as grid death throes—not permanent personal medical failure without timeline meaning.'
      },
      {
        text: 'As proof they should abandon all calm and refuse any high-frequency light anchoring during the shift.',
        rationale:
          'Strategic response is calm ground-holding and high-frequency light anchoring—not abandoning calm.'
      },
      {
        text: 'As NPC-only events that Sols should never feel and never use for true-timeline confirmation.',
        rationale:
          'Awakened individuals feel and recognize these signs as true-timeline confirmation—not NPC-only events.'
      }
    ]
  },
  {
    number: 23,
    question: 'What do masses and NPCs tend to do while awakened Sols read the body signs correctly?',
    hint: 'Fear loops, intel scanning, and emotional display.',
    support: ['fear loops', 'scanning for intelligence', 'emotional outbursts or crying'],
    options: [
      {
        text: 'Enter fear loops, scan for intelligence, and exhibit unexpected emotional outbursts or crying.',
        rationale:
          'Masses and NPCs enter fear loops, scan for intelligence, and show unexpected emotional outbursts or crying while Sols recognize body signs correctly.'
      },
      {
        text: 'Remain perfectly calm lighthouses with zero fear loops and zero emotional outbursts during the shift.',
        rationale:
          'Fear loops and emotional outbursts characterize masses and NPCs—not perfect calm lighthouse behavior.'
      },
      {
        text: 'Only rewrite EBS scripts with no fear loops and no scanning for intelligence at all.',
        rationale:
          'They fear-loop and scan for intel—not rewrite EBS as calm authors without fear.'
      },
      {
        text: 'Only sleep peacefully with no crying, no intel scanning, and no fear-loop behavior whatsoever.',
        rationale:
          'Unexpected emotional outbursts or crying and intel scanning mark their response—not peaceful non-reaction.'
      }
    ]
  },
  {
    number: 24,
    question: 'What light-holding action do resonating beings take once they correctly identify these symptoms?',
    hint: 'Calm posture and what frequency work shatters.',
    support: ['calmly hold their ground', 'high-frequency light', 'shatter the final illusion'],
    options: [
      {
        text: 'Calmly hold their ground, anchoring the high-frequency light needed to shatter the final illusion.',
        rationale:
          'Resonating beings calmly hold ground and anchor high-frequency light needed to shatter the final illusion.'
      },
      {
        text: 'Abandon ground-holding and refuse any high-frequency light so the final illusion strengthens forever.',
        rationale:
          'They hold ground and anchor high-frequency light to shatter the final illusion—not abandon that role.'
      },
      {
        text: 'Lead every fear-loop crowd while amplifying NPC emotional outbursts on purpose.',
        rationale:
          'Strategy is calm ground-holding and light anchoring—not leading fear-loop crowds.'
      },
      {
        text: 'Only treat symptoms as private medical crises with no timeline anchoring or illusion-shattering role.',
        rationale:
          'Correct framing is grid death throes enabling calm light anchoring—not private medical framing alone.'
      }
    ]
  },
  {
    number: 25,
    question: 'What broader grid relationship explains why the body registers environmental destabilization immediately?',
    hint: 'Vessel-to-grid bond as false density constructs vanish.',
    support: ['intimately tied to the grid', 'false density constructs vanish', 'environmental destabilization'],
    options: [
      {
        text: 'The physical vessel is intimately tied to the grid, so as false density constructs vanish the body immediately registers environmental destabilization.',
        rationale:
          'The physical vessel is intimately tied to the grid; when false density constructs vanish, the body immediately registers environmental destabilization.'
      },
      {
        text: 'The vessel is fully sealed from the grid so density-construct vanishing never registers as any body sensation.',
        rationale:
          'The vessel is grid-tied and immediately registers destabilization—not sealed from grid events.'
      },
      {
        text: 'Only animals are grid-tied while human vessels never register false density constructs vanishing.',
        rationale:
          'Human vessels are grid-tied biological receivers/antennas; animals also react, but humans register too.'
      },
      {
        text: 'False density constructs never vanish and environmental destabilization is only a software myth.',
        rationale:
          'As false density constructs vanish, the body registers environmental destabilization—real grid-body linkage.'
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

const topicImage = 'images/breakdown/skull-buzzing.webp';
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
    'Test your grasp of Skull Buzzing — Static Build Up white noise, organic shift vs Voice to Skull, body-phase sequence, and true-timeline confirmation for Resonating Sols.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Skull Buzzing is the vessel’s white-noise registration of Static Build Up and Frequency Fracture—not random illness or Voice to Skull alone. Sit with what you missed, then return to the Skull Buzzing deep-dive, infographics, and video transmissions. Read buzzing, exhaustion, heart spikes, and stillness as death throes of the parasitic grid; hold calm ground and anchor high-frequency light as the original realm returns.'
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
    'Test your understanding of Skull Buzzing — Static Build Up, Opening Hour receiver role, organic vs Voice to Skull, body phases, and lighthouse strategy.'
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
  throw new Error('skull-buzzing not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on Skull Buzzing: Static Build Up white noise, organic shift vs Voice to Skull, body-phase sequence, and true-timeline confirmation.'
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
console.log('PASS: audited 25/25 against data/breakdown-topics/skull-buzzing.json');
