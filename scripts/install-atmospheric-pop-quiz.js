/**
 * Installs Atmospheric Pop quiz for breakdown (Mega Breakdown) transmission.
 * All 25 items authored from and audited against data/breakdown-topics/atmospheric-pop.json only.
 * Run: node scripts/install-atmospheric-pop-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/atmospheric-pop.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'atmospheric-pop';
const TOPIC_TITLE = 'Atmospheric Pop';
const SOURCE = 'breakdown';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const metaVoiceRe =
  /\b(according to the (report|source|text)|the report states|the source (states|specifies|suggests)|the text (states|describes|suggests|explicitly|mentions)|source material)\b/i;

/** Support phrases grounded only in atmospheric-pop.json report. */
const supportPhrases = {
  1: ['atmospheric pop', '3d illusion', 'physiological', 'environmental'],
  2: ['not merely technological failures', 'parasitic control systems', 'fracturing'],
  3: ['first 72 hours', 'communications blackout', 'crystalline field'],
  4: ['drop in pressure', 'main communication cables', 'energetic clarity'],
  5: ['frequency fracture', 'artificial reality', 'npc', 'electronics'],
  6: ['static build up', 'buzzing in the skull', 'white noise'],
  7: ['drop in tone', 'deep tiredness', 'yawning', 'heaviness in the chest'],
  8: ['sharp edge', 'adrenaline', 'heart rate spikes', 'thickening of the air'],
  9: ['silence before the snap', 'ear ringing', 'nature holds its breath'],
  10: ['deeply physical', 'frequency fracture', 'communications blackout'],
  11: ['old frequency tethers', 'parasitic overlay', 'clearer'],
  12: ['static build up', 'phones freeze', 'power surges'],
  13: ['muted and flat', 'parasitic overlay is glitching'],
  14: ['bird songs cease', 'before a storm', 'adrenaline without cause'],
  15: ['traffic noise fades', 'wind pauses', 'high pitch'],
  16: ['cables are physically and energetically severed', 'literal pop', 'absolute clarity'],
  17: ['a.i. war theatre', 'npc programming', 'erratic emotional outbursts'],
  18: ['birds fly erratically', 'dogs', 'cats disappear'],
  19: ['resonating sols', 'not as illness or panic', 'great awakening'],
  20: ['static build up', 'atmospheric pop', 'lighthouses', 'npc scaffolding'],
  21: ['momentary field clarity', 'fear frequencies', 'world war iii'],
  22: ['artificial timeline', 'staged world war iii activation'],
  23: ['72 hours', 'sequence', 'physical indicators'],
  24: ['split-second', 'unprecedented energetic clarity'],
  25: ['hold their ground', 'cut through the fear frequencies']
};

const RAW_QUESTIONS = [
  {
    number: 1,
    question: 'What marks the transition out of the 3D illusion in this framework?',
    hint: 'Name the culminating event among physiological and environmental shifts.',
    options: [
      {
        text: 'A series of distinct physiological and environmental shifts culminating in the Atmospheric Pop.',
        isCorrect: true,
        rationale:
          'The transition out of the 3D illusion is marked by distinct physiological and environmental shifts culminating in the Atmospheric Pop.'
      },
      {
        text: 'Only a single weather forecast update with no physiological or Atmospheric Pop sequence at all.',
        isCorrect: false,
        rationale:
          'The transition involves a full physical-indicator sequence ending in the Atmospheric Pop, not a mere forecast update.'
      },
      {
        text: 'Only permanent technological upgrades with no environmental pressure drop or field clarity event.',
        isCorrect: false,
        rationale:
          'These phenomena are responses to parasitic control fracturing, culminating in atmospheric pressure drop and field clarity.'
      },
      {
        text: 'Only post-Ascension reconstruction logistics with no first-72-hour blackout physical indicators.',
        isCorrect: false,
        rationale:
          'Indicators occur within the first 72 hours of the communications blackout as artificial frequencies collapse.'
      }
    ]
  },
  {
    number: 2,
    question: 'What are these phenomena, rather than ordinary tech failures or weather anomalies?',
    hint: 'Connect them to fracturing parasitic control systems.',
    options: [
      {
        text: 'Direct physical and energetic responses to the fracturing of the parasitic control systems.',
        isCorrect: true,
        rationale:
          'These phenomena are not merely technological failures or weather anomalies; they are direct physical and energetic responses to the fracturing of parasitic control systems.'
      },
      {
        text: 'Only random weather anomalies with no link to parasitic control systems or frequency fracture.',
        isCorrect: false,
        rationale:
          'They are not mere weather anomalies; they respond to fracturing parasitic control systems.'
      },
      {
        text: 'Only routine software patches with no physical vessel indicators or atmospheric pressure drop.',
        isCorrect: false,
        rationale:
          'The human vessel undergoes intense physical indicators as artificial frequencies collapse.'
      },
      {
        text: 'Only staged movie effects with no real energetic clarity or cable-severing moment.',
        isCorrect: false,
        rationale:
          'The Atmospheric Pop is a real pressure drop at cable severing, producing unprecedented energetic clarity.'
      }
    ]
  },
  {
    number: 3,
    question: 'When do the intense physical indicators of this sequence primarily occur?',
    hint: 'Place them in the first 72 hours of the communications blackout.',
    options: [
      {
        text: 'Within the first 72 hours of the communications blackout, as artificial frequencies collapse and the true crystalline field is revealed underneath.',
        isCorrect: true,
        rationale:
          'Within the first 72 hours of the communications blackout, the human vessel undergoes intense physical indicators as artificial frequencies collapse, revealing the true crystalline field underneath.'
      },
      {
        text: 'Only years after Ascension reconstruction with no relation to communications blackout timing.',
        isCorrect: false,
        rationale:
          'The sequence is timed to the first 72 hours of the communications blackout.'
      },
      {
        text: 'Only before any blackout begins, with no crystalline field reveal or artificial-frequency collapse.',
        isCorrect: false,
        rationale:
          'Indicators run during blackout as artificial frequencies collapse and crystalline field shows through.'
      },
      {
        text: 'Only during permanent full power restoration with no cable severing or Atmospheric Pop moment.',
        isCorrect: false,
        rationale:
          'The Pop occurs when main communication cables are severed, not during permanent full restoration alone.'
      }
    ]
  },
  {
    number: 4,
    question: 'What is the Atmospheric Pop?',
    hint: 'Sudden pressure drop at cable severing with split-second energetic clarity.',
    options: [
      {
        text: 'A sudden drop in atmospheric pressure at the exact moment main communication cables are severed, producing a split-second of unprecedented energetic clarity.',
        isCorrect: true,
        rationale:
          'Atmospheric Pop is a sudden drop in pressure when main communication cables are severed, resulting in a split-second of unprecedented energetic clarity.'
      },
      {
        text: 'A slow multi-week weather front with no cable-severing moment and no energetic clarity spike.',
        isCorrect: false,
        rationale:
          'It is sudden, timed to cable severing, with split-second unprecedented clarity—not a slow weather front.'
      },
      {
        text: 'Only a software reboot sound with no atmospheric pressure change of any kind.',
        isCorrect: false,
        rationale:
          'It manifests as a literal pop in the atmosphere with a real pressure drop and field clarity.'
      },
      {
        text: 'Only permanent silence with no pressure drop and no piercing of the Parasitic Overlay.',
        isCorrect: false,
        rationale:
          'The Pop pierces the Parasitic Overlay temporarily and clears the energetic field for a split second.'
      }
    ]
  },
  {
    number: 5,
    question: 'What is Frequency Fracture in this topic?',
    hint: 'True nature of the blackout; glitches in NPC programming and electronics.',
    options: [
      {
        text: 'The true nature of the communications blackout—a breakdown in artificial reality creating glitches in non-player character programming and electronics.',
        isCorrect: true,
        rationale:
          'Frequency Fracture is the true nature of the communications blackout, causing breakdown in artificial reality and glitches in NPC programming and electronics.'
      },
      {
        text: 'Only a routine cable repair with no artificial-reality breakdown or NPC programming glitches.',
        isCorrect: false,
        rationale:
          'Frequency Fracture is deeper than repair: artificial reality breaks down with NPC and electronics glitches.'
      },
      {
        text: 'Only a psychological metaphor with no environmental electronics or physical vessel effects.',
        isCorrect: false,
        rationale:
          'It is a profound physical and energetic event with body indicators and environmental glitches.'
      },
      {
        text: 'Only permanent A.I. War Theatre reinforcement with no collapse of artificial frequencies.',
        isCorrect: false,
        rationale:
          'Indicators link to broader collapse of the A.I. War Theatre, not its permanent reinforcement.'
      }
    ]
  },
  {
    number: 6,
    question: 'What characterizes Static Build Up as the initial physical-indicator stage?',
    hint: 'Skull buzzing and background white noise.',
    options: [
      {
        text: 'A subtle buzzing in the skull and background white noise as the body detects the incoming fracture.',
        isCorrect: true,
        rationale:
          'Static Build Up is characterized by subtle buzzing in the skull and background white noise as the body detects the incoming fracture.'
      },
      {
        text: 'Only total silence with no skull buzzing, white noise, or electronics glitches at all.',
        isCorrect: false,
        rationale:
          'Static Build Up includes skull buzzing, white noise, and simultaneous electronics glitches.'
      },
      {
        text: 'Only the Atmospheric Pop itself with no prior buzzing or white-noise build stage.',
        isCorrect: false,
        rationale:
          'Static Build Up is the initial stage before Drop In Tone, Sharp Edge, Silence, and Pop.'
      },
      {
        text: 'Only deep chest heaviness and muted sky with no skull buzzing or white noise component.',
        isCorrect: false,
        rationale:
          'Chest heaviness and muted sky belong to Drop In Tone; Static Build Up is buzzing and white noise.'
      }
    ]
  },
  {
    number: 7,
    question: 'What defines The Drop In Tone physiologically?',
    hint: 'Tiredness, yawning, and heaviness in the chest.',
    options: [
      {
        text: 'Sudden deep tiredness, unprovoked yawning, and a feeling of heaviness in the chest.',
        isCorrect: true,
        rationale:
          'The Drop In Tone induces sudden deep tiredness, unprovoked yawning, and heaviness in the chest.'
      },
      {
        text: 'Only unexplained adrenaline bursts and heart rate spikes with no tiredness or yawning.',
        isCorrect: false,
        rationale:
          'Adrenaline and heart spikes define The Sharp Edge, not The Drop In Tone.'
      },
      {
        text: 'Only high-pitch ear ringing and total nature stillness with no chest heaviness.',
        isCorrect: false,
        rationale:
          'High-pitch ringing and stillness define The Silence Before the Snap.'
      },
      {
        text: 'Only permanent insomnia with no deep tiredness, yawning, or chest heaviness phase.',
        isCorrect: false,
        rationale:
          'Drop In Tone is specifically sudden deep tiredness, yawning, and chest heaviness.'
      }
    ]
  },
  {
    number: 8,
    question: 'What defines The Sharp Edge period?',
    hint: 'Adrenaline bursts, heart spikes, and thickened air.',
    options: [
      {
        text: 'Short bursts of unexplained adrenaline, sudden heart rate spikes, and an environmental thickening of the air.',
        isCorrect: true,
        rationale:
          'The Sharp Edge is defined by short bursts of unexplained adrenaline, sudden heart rate spikes, and environmental thickening of the air.'
      },
      {
        text: 'Only skull buzzing and white noise with no adrenaline, heart spikes, or air thickening.',
        isCorrect: false,
        rationale:
          'Buzzing and white noise are Static Build Up; Sharp Edge is adrenaline, heart spikes, and thicker air.'
      },
      {
        text: 'Only the atmospheric pressure pop at cable severing with no prior adrenaline or heart spikes.',
        isCorrect: false,
        rationale:
          'The Pop is later; Sharp Edge is the adrenaline and pressure-like air thickening stage before it.'
      },
      {
        text: 'Only permanent calm with no heart spikes and no storm-like atmospheric pressure feel.',
        isCorrect: false,
        rationale:
          'Air feels thicker like pressure before a storm during The Sharp Edge.'
      }
    ]
  },
  {
    number: 9,
    question: 'What is The Silence Before the Snap?',
    hint: 'Stillness, nature holding breath, and high-pitch ear ringing before the Pop.',
    options: [
      {
        text: 'A strange stillness where nature holds its breath, with high-pitch ear ringing just prior to the Atmospheric Pop.',
        isCorrect: true,
        rationale:
          'The Silence Before the Snap is a strange stillness where nature holds its breath, accompanied by high-pitch ear ringing just prior to the Atmospheric Pop.'
      },
      {
        text: 'Only constant traffic roar and wind with no stillness, ringing, or pre-Pop pause.',
        isCorrect: false,
        rationale:
          'Traffic noise fades, wind pauses, and nature holds its breath in this stage.'
      },
      {
        text: 'Only muted colorful sky flatness with no ear ringing or total environmental stillness.',
        isCorrect: false,
        rationale:
          'Muted flat sky is Drop In Tone environmentally; Silence Before Snap is stillness and high-pitch ringing.'
      },
      {
        text: 'Only the moment after the Pop when field clarity has already fully permanently stabilized forever.',
        isCorrect: false,
        rationale:
          'Silence Before the Snap is immediately prior to the Pop; clarity after Pop is a split-second piercing.'
      }
    ]
  },
  {
    number: 10,
    question: 'How should the communications blackout be understood at core?',
    hint: 'Not only geopolitical or cyber—also a profound Frequency Fracture.',
    options: [
      {
        text: 'Not only as geopolitical or cyber incidents, but as a profound Frequency Fracture and deeply physical experience of 3D reality collapse.',
        isCorrect: true,
        rationale:
          'Events surrounding the communications blackout are not just geopolitical or cyber incidents, but a profound Frequency Fracture; collapse of 3D reality is a deeply physical experience.'
      },
      {
        text: 'Only as a routine geopolitical story with no Frequency Fracture or physical vessel indicators.',
        isCorrect: false,
        rationale:
          'Core revelation is Frequency Fracture and deeply physical indicators, not geopolitics alone.'
      },
      {
        text: 'Only as permanent cyber utopia with no artificial-frequency collapse or crystalline field reveal.',
        isCorrect: false,
        rationale:
          'Artificial frequencies collapse and the crystalline field underneath is revealed.'
      },
      {
        text: 'Only as weather noise with no blackout, no fracture, and no Atmospheric Pop tether severing.',
        isCorrect: false,
        rationale:
          'Blackout, Frequency Fracture, and Atmospheric Pop sever old frequency tethers.'
      }
    ]
  },
  {
    number: 11,
    question: 'What does the Atmospheric Pop signify about old frequency tethers and the overlay?',
    hint: 'Definitive severing; temporary pierce of Parasitic Overlay with clearer field.',
    options: [
      {
        text: 'Definitive severing of old frequency tethers; for a split second the energetic field is clearer than ever as the Parasitic Overlay is temporarily pierced.',
        isCorrect: true,
        rationale:
          'The Atmospheric Pop signifies definitive severing of old frequency tethers; for a split second the field becomes clearer than ever as the Parasitic Overlay is temporarily pierced.'
      },
      {
        text: 'Permanent reinforcement of old frequency tethers with no pierce of the Parasitic Overlay at all.',
        isCorrect: false,
        rationale:
          'It severs old tethers and temporarily pierces the Parasitic Overlay for field clarity.'
      },
      {
        text: 'Only a mental visualization with no real energetic clarity or overlay piercing moment.',
        isCorrect: false,
        rationale:
          'The field becomes clearer than ever before felt in a split second after the pop.'
      },
      {
        text: 'Only permanent darkness of the field with no temporary clarity after cable severing.',
        isCorrect: false,
        rationale:
          'Post-pop clarity is the opposite of permanent field darkness.'
      }
    ]
  },
  {
    number: 12,
    question: 'What environmental electronics signs accompany Static Build Up?',
    hint: 'Glitches, frozen phones, and small power surges.',
    options: [
      {
        text: 'Electronics begin to glitch, phones freeze, and small power surges occur alongside skull buzzing and white noise.',
        isCorrect: true,
        rationale:
          'During Static Build Up, environmental electronics glitch, phones freeze, and small power surges occur simultaneously with skull buzzing and white noise.'
      },
      {
        text: 'All electronics run perfectly with no freezes, glitches, or power surges during Static Build Up.',
        isCorrect: false,
        rationale:
          'Electronics glitching, phone freezes, and power surges are named Static Build Up signs.'
      },
      {
        text: 'Only bird songs cease with no phone freezes or power surges in this initial stage.',
        isCorrect: false,
        rationale:
          'Bird songs ceasing is Sharp Edge; Static Build Up is electronics glitches and freezes.'
      },
      {
        text: 'Only permanent blackout of all devices with no gradual glitch and surge stage first.',
        isCorrect: false,
        rationale:
          'Static Build Up shows glitches, freezes, and surges as the fracture is detected, before the Pop.'
      }
    ]
  },
  {
    number: 13,
    question: 'What environmental sky sign appears during The Drop In Tone?',
    hint: 'Muted flat sky even if colorful, signaling overlay glitch.',
    options: [
      {
        text: 'The sky appears muted and flat, even if colorful, signaling that the parasitic overlay is glitching.',
        isCorrect: true,
        rationale:
          'During Drop In Tone, the sky appears muted and flat, even if colorful, signaling the parasitic overlay is glitching.'
      },
      {
        text: 'The sky permanently displays only crystalline coastlines with no muted or flat overlay glitch sign.',
        isCorrect: false,
        rationale:
          'At this stage the sky looks muted and flat as overlay glitches—not full crystalline coastline reveal.'
      },
      {
        text: 'Only high-pitch ear ringing defines Drop In Tone with no sky muting or flatness at all.',
        isCorrect: false,
        rationale:
          'High-pitch ringing is Silence Before the Snap; Drop In Tone includes muted flat sky.'
      },
      {
        text: 'Only permanent storm darkness with no muted colorful-but-flat sky presentation.',
        isCorrect: false,
        rationale:
          'Sky can still look colorful yet muted and flat as the overlay glitches.'
      }
    ]
  },
  {
    number: 14,
    question: 'What environmental and animal signs appear during The Sharp Edge?',
    hint: 'Storm-like air pressure feel and natural sounds ceasing.',
    options: [
      {
        text: 'Air feels thicker like atmospheric pressure before a storm, and natural sounds such as bird songs cease while adrenaline and heart rate spike briefly.',
        isCorrect: true,
        rationale:
          'During Sharp Edge, air thickens like pre-storm pressure, bird songs cease, and the vessel gets short adrenaline bursts and heart rate spikes.'
      },
      {
        text: 'Bird songs grow louder and air feels thinner with no adrenaline or heart-rate spikes at all.',
        isCorrect: false,
        rationale:
          'Bird songs cease and air thickens; adrenaline and heart spikes are part of Sharp Edge.'
      },
      {
        text: 'Only skull white noise continues with no air thickening or cessation of natural sounds.',
        isCorrect: false,
        rationale:
          'Air thickening and bird-song cessation are Sharp Edge environmental signs.'
      },
      {
        text: 'Only the cable pop itself with no prior storm-like pressure feel or adrenaline bursts.',
        isCorrect: false,
        rationale:
          'Sharp Edge precedes the Pop with pressure-like air and unexplained adrenaline.'
      }
    ]
  },
  {
    number: 15,
    question: 'What happens environmentally during The Silence Before the Snap?',
    hint: 'Traffic fades, wind pauses, nature holds breath; high-pitch ringing.',
    options: [
      {
        text: 'Ears ring at a high pitch just out of normal hearing range; traffic noise fades, wind pauses, and nature holds its breath in total strange stillness.',
        isCorrect: true,
        rationale:
          'Ears ring sharply with high pitch just out of normal hearing range; total stillness falls—traffic fades, wind pauses, nature holds its breath.'
      },
      {
        text: 'Traffic and wind grow louder with no ear ringing and no stillness before the Pop.',
        isCorrect: false,
        rationale:
          'Traffic fades, wind pauses, and stillness falls with high-pitch ringing before the Pop.'
      },
      {
        text: 'Only phone freezes occur with no environmental stillness or high-pitch ringing stage.',
        isCorrect: false,
        rationale:
          'Phone freezes are Static Build Up; Silence Before Snap is stillness and ringing.'
      },
      {
        text: 'Only permanent chaos with continuous bird songs and no pre-Pop pause of nature.',
        isCorrect: false,
        rationale:
          'Nature holds its breath in strange total stillness just prior to the Atmospheric Pop.'
      }
    ]
  },
  {
    number: 16,
    question: 'What happens at the moment of the Atmospheric Pop itself?',
    hint: 'Cables severed physically and energetically; literal pop; absolute clarity.',
    options: [
      {
        text: 'When cables are physically and energetically severed, a sudden pressure drop manifests as a literal atmospheric pop, creating an instant of absolute clarity in the energy field.',
        isCorrect: true,
        rationale:
          'When cables are physically and energetically severed, a sudden drop in pressure manifests as a literal pop in the atmosphere, creating absolute clarity in the energy field for an instant.'
      },
      {
        text: 'Cables remain fully intact with no pressure drop, no literal pop, and no field clarity moment.',
        isCorrect: false,
        rationale:
          'The Pop is timed to physical and energetic cable severing with pressure drop and clarity.'
      },
      {
        text: 'Only a slow multi-day cable repair with no sudden pop or absolute clarity instant.',
        isCorrect: false,
        rationale:
          'It is sudden—a literal pop and instant of absolute energetic clarity.'
      },
      {
        text: 'Only permanent field darkness after severing with no clarity piercing the Parasitic Overlay.',
        isCorrect: false,
        rationale:
          'Post-pop field clarity temporarily pierces the Parasitic Overlay.'
      }
    ]
  },
  {
    number: 17,
    question: 'How do NPCs react while the human vessel undergoes these biological shifts?',
    hint: 'Link to A.I. War Theatre collapse and programming flickers.',
    options: [
      {
        text: 'NPC programming flickers and glitches, causing erratic emotional outbursts, unexpected crying, or snapping as the A.I. War Theatre collapses.',
        isCorrect: true,
        rationale:
          'Physical indicators link to A.I. War Theatre collapse; NPC programming flickers and glitches, causing erratic emotional outbursts, unexpected crying, or snapping.'
      },
      {
        text: 'NPCs remain perfectly calm and never glitch, cry, snap, or show erratic emotional outbursts.',
        isCorrect: false,
        rationale:
          'NPC programming flickers with erratic outbursts, crying, or snapping during this collapse.'
      },
      {
        text: 'Only Resonating Sols glitch emotionally while NPCs stay fully stable as programming anchors.',
        isCorrect: false,
        rationale:
          'NPC scaffolding crumbles and programming glitches; Resonating Sols are to remain calm as lighthouses.'
      },
      {
        text: 'Only electronics glitch with no human NPC emotional or behavioral flicker at all.',
        isCorrect: false,
        rationale:
          'Both electronics and NPC programming glitch; inhabitants react chaotically alongside vessel shifts.'
      }
    ]
  },
  {
    number: 18,
    question: 'How do animals respond to these frequency changes?',
    hint: 'Birds, dogs, and cats show specific sensitive behaviors.',
    options: [
      {
        text: 'Birds fly erratically, dogs become restless and seek calm individuals, and cats disappear to safe spots.',
        isCorrect: true,
        rationale:
          'Animals are highly sensitive: birds fly erratically, dogs become restless and seek out calm individuals, and cats disappear to safe spots.'
      },
      {
        text: 'Animals show no sensitivity and never change flight, restlessness, or hiding behavior at all.',
        isCorrect: false,
        rationale:
          'Animals are highly sensitive to these frequency changes with clear behavioral shifts.'
      },
      {
        text: 'Only fish in aquariums react while birds, dogs, and cats remain completely unaffected.',
        isCorrect: false,
        rationale:
          'Named responses are birds, dogs, and cats reacting to the frequency changes.'
      },
      {
        text: 'Only after the Pop permanently ends do animals react, with no earlier erratic or restless signs.',
        isCorrect: false,
        rationale:
          'Animal reactions occur as frequency changes unfold during the broader collapse sequence.'
      }
    ]
  },
  {
    number: 19,
    question: 'How must Resonating Sols interpret these physical signs?',
    hint: 'Not illness or panic—confirmation of Great Awakening timeline.',
    options: [
      {
        text: 'Not as illness or panic, but as confirmation of the Great Awakening timeline.',
        isCorrect: true,
        rationale:
          'Resonating Sols must recognize these physical signs not as illness or panic, but as confirmation of the Great Awakening timeline.'
      },
      {
        text: 'Only as random illness and panic with no Great Awakening timeline confirmation meaning.',
        isCorrect: false,
        rationale:
          'They must not read signs as illness or panic, but as timeline confirmation.'
      },
      {
        text: 'Only as permanent medical failure requiring abandonment of lighthouse calm entirely.',
        isCorrect: false,
        rationale:
          'Understanding the sequence allows remaining calm and serving as lighthouses.'
      },
      {
        text: 'Only as proof that the Atmospheric Pop will never arrive and cables will never sever.',
        isCorrect: false,
        rationale:
          'Progression from Static Build Up to Atmospheric Pop is to be anticipated and understood.'
      }
    ]
  },
  {
    number: 20,
    question: 'Why understand the progression from Static Build Up to Atmospheric Pop?',
    hint: 'Stay calm as lighthouses while NPC scaffolding crumbles.',
    options: [
      {
        text: 'So awakened individuals can remain calm and serve as lighthouses while the NPC scaffolding crumbles.',
        isCorrect: true,
        rationale:
          'Understanding the progression from Static Build Up to Atmospheric Pop allows awakened individuals to remain calm and serve as lighthouses while NPC scaffolding crumbles.'
      },
      {
        text: 'So awakened individuals panic harder and collapse the lighthouse role during NPC glitches.',
        isCorrect: false,
        rationale:
          'The purpose is remaining calm as lighthouses, not panicking harder.'
      },
      {
        text: 'So everyone ignores animal and body signs and anchors deeper into fear frequencies.',
        isCorrect: false,
        rationale:
          'Resonating souls hold ground and cut through fear frequencies after anticipating the Pop.'
      },
      {
        text: 'So staged World War III Activation becomes the only permanent artificial timeline for all.',
        isCorrect: false,
        rationale:
          'Holding ground during clarity helps ensure masses do not anchor into artificial WW3 timeline.'
      }
    ]
  },
  {
    number: 21,
    question: 'What should resonating souls do by anticipating the Atmospheric Pop and momentary field clarity?',
    hint: 'Hold ground and cut through fear frequencies.',
    options: [
      {
        text: 'Hold their ground and cut through the fear frequencies during the momentary field clarity.',
        isCorrect: true,
        rationale:
          'By anticipating the Atmospheric Pop and subsequent momentary field clarity, resonating souls can hold their ground and cut through the fear frequencies.'
      },
      {
        text: 'Abandon ground entirely and amplify fear frequencies during the momentary field clarity.',
        isCorrect: false,
        rationale:
          'They hold ground and cut through fear frequencies, not amplify them.'
      },
      {
        text: 'Ignore the Pop entirely and never use clarity to counter fear frequencies of any kind.',
        isCorrect: false,
        rationale:
          'Anticipating Pop and clarity is strategic for cutting through fear frequencies.'
      },
      {
        text: 'Only sleep through Static Build Up so no lighthouse function operates when NPCs glitch.',
        isCorrect: false,
        rationale:
          'Recognition and calm lighthouse presence are required while NPC scaffolding crumbles.'
      }
    ]
  },
  {
    number: 22,
    question: 'What artificial timeline must the masses not anchor into during this window?',
    hint: 'Staged World War III Activation.',
    options: [
      {
        text: 'The artificial timeline of staged World War III Activation, which fear frequencies try to lock people into.',
        isCorrect: true,
        rationale:
          'Resonating souls cut through fear frequencies to ensure the masses do not anchor into the artificial timeline during staged World War III Activation.'
      },
      {
        text: 'Only a permanent crystalline free-energy timeline with no staged WW3 artificial trap risk.',
        isCorrect: false,
        rationale:
          'The risk named is anchoring into artificial staged WW3 Activation timeline under fear.'
      },
      {
        text: 'Only a local weather timeline with no staged geopolitical WW3 activation component.',
        isCorrect: false,
        rationale:
          'Staged World War III Activation is the artificial timeline to avoid anchoring into.'
      },
      {
        text: 'Only an animal behavior timeline with no fear-frequency mass-anchoring concern at all.',
        isCorrect: false,
        rationale:
          'Strategic implication centers on masses not anchoring into artificial WW3 timeline via fear.'
      }
    ]
  },
  {
    number: 23,
    question: 'In what order do the physical indicators progress during the first 72 hours?',
    hint: 'Static Build Up → Drop In Tone → Sharp Edge → Silence Before the Snap → Atmospheric Pop.',
    options: [
      {
        text: 'Static Build Up, then Drop In Tone, then Sharp Edge, then Silence Before the Snap, then Atmospheric Pop.',
        isCorrect: true,
        rationale:
          'Physical indicators manifest in precise sequence: Static Build Up, Drop In Tone, Sharp Edge, Silence Before the Snap, then Atmospheric Pop during the first 72 hours.'
      },
      {
        text: 'Atmospheric Pop first, then Silence, then Sharp Edge, with no Static Build Up stage at all.',
        isCorrect: false,
        rationale:
          'Sequence begins with Static Build Up and ends with Atmospheric Pop, not the reverse.'
      },
      {
        text: 'Only Sharp Edge and Pop with no Static Build Up, Drop In Tone, or Silence stages.',
        isCorrect: false,
        rationale:
          'All five stages are listed in precise sequential order in the first 72 hours.'
      },
      {
        text: 'Random simultaneous symptoms with no precise sequential progression during blackout hours.',
        isCorrect: false,
        rationale:
          'Indicators manifest in a precise sequence during the first 72 hours of blackout.'
      }
    ]
  },
  {
    number: 24,
    question: 'What kind of clarity follows the Atmospheric Pop?',
    hint: 'Split-second unprecedented energetic clarity.',
    options: [
      {
        text: 'A split-second of unprecedented energetic clarity as the field becomes clearer than ever before felt.',
        isCorrect: true,
        rationale:
          'The Pop results in a split-second of unprecedented energetic clarity; for a split second the field becomes clearer than ever before felt.'
      },
      {
        text: 'A permanent multi-year clarity with no split-second character to the post-pop field state.',
        isCorrect: false,
        rationale:
          'Clarity is described as split-second / instant absolute clarity when the overlay is temporarily pierced.'
      },
      {
        text: 'No clarity at all—only permanent white noise with no field-clearing moment after the pop.',
        isCorrect: false,
        rationale:
          'Absolute clarity in the energy field is the named post-pop effect.'
      },
      {
        text: 'Only visual map clarity with no energetic field clarity of any kind after cable severing.',
        isCorrect: false,
        rationale:
          'Clarity is energetic field clarity from severing tethers and piercing the Parasitic Overlay.'
      }
    ]
  },
  {
    number: 25,
    question: 'What is the lighthouse strategy for resonating souls through this sequence?',
    hint: 'Recognize signs, stay calm, hold ground, cut fear frequencies.',
    options: [
      {
        text: 'Recognize signs as timeline confirmation, remain calm as lighthouses while NPC scaffolding crumbles, hold ground, and cut through fear frequencies so masses do not anchor into staged WW3 artificial timeline.',
        isCorrect: true,
        rationale:
          'Resonating Sols recognize signs as Great Awakening confirmation, stay calm as lighthouses while NPC scaffolding crumbles, hold ground, and cut through fear frequencies so masses do not anchor into artificial staged WW3 Activation timeline.'
      },
      {
        text: 'Treat signs only as illness, panic with the masses, and fully anchor everyone into staged WW3 artificial timeline.',
        isCorrect: false,
        rationale:
          'Strategy is the opposite: not illness/panic framing, calm lighthouse presence, cut fear, avoid WW3 artificial anchor.'
      },
      {
        text: 'Ignore Static Build Up through Pop entirely and never serve as calm anchors during glitches.',
        isCorrect: false,
        rationale:
          'Understanding progression enables calm lighthouse function during the sequence.'
      },
      {
        text: 'Only amplify NPC emotional outbursts so no harmonic ground-holding occurs after the Pop.',
        isCorrect: false,
        rationale:
          'Resonating souls hold ground and cut fear frequencies rather than amplifying NPC outbursts.'
      }
    ]
  }
];

for (const [num, phrases] of Object.entries(supportPhrases)) {
  const missing = phrases.filter((p) => !reportLower.includes(p.toLowerCase()));
  if (missing.length) {
    throw new Error(`Support phrase missing for Q${num}: ${missing.join('; ')}`);
  }
}

if (RAW_QUESTIONS.length !== 25) {
  throw new Error(`Expected 25 raw questions, got ${RAW_QUESTIONS.length}`);
}

const questions = RAW_QUESTIONS.map((q) => {
  const finalized = finalizeOptions(
    q.options.map(({ text, isCorrect, rationale }) => ({ text, isCorrect, rationale })),
    `${TOPIC_ID}-${q.number}`
  );

  const out = {
    number: q.number,
    question: q.question,
    options: finalized.options,
    hint: q.hint,
    correctAnswer: finalized.correctAnswer
  };

  const blob = [
    out.question,
    out.hint,
    ...out.options.map((o) => `${o.text} ${o.rationale}`)
  ].join('\n');
  if (latexRe.test(blob) || /\$/.test(blob)) {
    throw new Error(`Q${q.number}: LaTeX/$ markup found`);
  }
  if (metaVoiceRe.test(blob)) {
    throw new Error(`Q${q.number}: meta/report voice still present`);
  }

  const phrases = supportPhrases[q.number] || [];
  const missing = phrases.filter((p) => !reportLower.includes(p.toLowerCase()));
  if (missing.length) {
    throw new Error(`Q${q.number}: report does not support: ${missing.join('; ')}`);
  }

  if (out.options.length !== 4) throw new Error(`Q${q.number}: need 4 options`);
  if (out.options.filter((o) => o.isCorrect).length !== 1) {
    throw new Error(`Q${q.number}: need exactly 1 correct`);
  }
  for (const o of out.options) {
    if (!o.rationale || o.rationale.length < 20) {
      throw new Error(`Q${q.number}${o.label}: short rationale`);
    }
    if (o.text.length < 40) {
      throw new Error(`Q${q.number}${o.label}: option too short (${o.text.length})`);
    }
  }
  return out;
});

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

const topicImage = 'images/breakdown/atmospheric-pop.webp';
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
    'Test your grasp of Atmospheric Pop — 72-hour physical indicators, Frequency Fracture, cable severing clarity, and lighthouse strategy through the blackout.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Atmospheric Pop is the pressure-drop moment when main cables sever and the Parasitic Overlay is briefly pierced. Sit with what you missed, then return to the Atmospheric Pop deep-dive, infographics, and video transmissions. From Static Build Up to the Pop, these signs confirm the Great Awakening timeline—so Resonating Sols can stay calm as lighthouses and keep the masses off the staged WW3 artificial timeline.'
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
    'Test your understanding of Atmospheric Pop — physical indicator sequence, Frequency Fracture blackout, field clarity at cable severing, and Resonating Sol lighthouse strategy.'
};
topic.quiz = quizMeta;
fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2) + '\n', 'utf8');

const monoPath = path.join(ROOT, 'data', 'breakdown-topics.json');
const mono = JSON.parse(fs.readFileSync(monoPath, 'utf8'));
function findAndPatch(topics) {
  for (const t of topics) {
    if (t.id === TOPIC_ID) {
      const existingSubtopics = t.subtopics;
      t.quiz = quizMeta;
      if (topic.report) t.report = topic.report;
      if (topic.infographic_image) t.infographic_image = topic.infographic_image;
      if (topic.pdf_preview_image) t.pdf_preview_image = topic.pdf_preview_image;
      if (topic.slide_deck_pdf_url) t.slide_deck_pdf_url = topic.slide_deck_pdf_url;
      if (topic.rumble_videos) t.rumble_videos = topic.rumble_videos;
      t.is_placeholder = false;
      t.topic_image = topicImage;
      t.title = TOPIC_TITLE;
      if (existingSubtopics) t.subtopics = existingSubtopics;
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('atmospheric-pop not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on Atmospheric Pop: 72-hour physical indicators, Frequency Fracture, cable-severing field clarity, and lighthouse strategy through the blackout.'
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

const htmlPath = path.join(ROOT, 'quiz', SOURCE, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchors = [
    "  { path: '/quiz/breakdown/truth-disclosure.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/breakdown/phase-seven-eight.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/breakdown/the-purge-phases.html', priority: '0.75', changefreq: 'monthly' },"
  ];
  let inserted = false;
  for (const anchor of anchors) {
    if (sm.includes(anchor)) {
      sm = sm.replace(anchor, `${anchor}\n${entry}`);
      inserted = true;
      break;
    }
  }
  if (!inserted) throw new Error('Could not find sitemap anchor to insert quiz entry');
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('Correct letter mix:', letterCounts);
console.log('PASS: audited 25/25 against data/breakdown-topics/atmospheric-pop.json');
