/**
 * Installs Frequency Fracture quiz for breakdown (Mega Breakdown) transmission.
 * Authored from data/breakdown-topics/frequency-fracture.json report only.
 * Run: node scripts/install-frequency-fracture-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/frequency-fracture.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'frequency-fracture';
const TOPIC_TITLE = 'Frequency Fracture';
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
      'What is the Frequency Fracture relative to the event people outwardly call a communications blackout?',
    hint: 'True energetic mechanism versus the outward 3D mask during The First 72 Hours.',
    support: ['true energetic mechanism', 'communications blackout', 'first 72 hours'],
    options: [
      {
        text: 'It is the true energetic mechanism behind the event outwardly perceived as the communications blackout during The First 72 Hours of transition.',
        rationale:
          'The Frequency Fracture is the true energetic mechanism behind what is outwardly perceived as the communications blackout in The First 72 Hours.'
      },
      {
        text: 'It is only a random weather outage with no link to the blackout mask or The First 72 Hours at all.',
        rationale:
          'The fracture is the deliberate energetic mechanism of the blackout window, not a random weather outage.'
      },
      {
        text: 'It is a permanent media festival that strengthens the Parasitic Overlay without any shattering effect.',
        rationale:
          'The fracture deliberately shatters the Parasitic Overlay; it does not strengthen it via a media festival.'
      },
      {
        text: 'It is merely a banking app update that never touches crystalline reality or artificial frequency nets.',
        rationale:
          'The fracture dismantles the artificial frequency net and suppresses true crystalline reality’s hijack—not a banking app update.'
      }
    ]
  },
  {
    number: 2,
    question: 'What does the Frequency Fracture deliberately shatter?',
    hint: 'A false projection that hijacked perception and suppressed crystalline reality.',
    support: ['parasitic overlay', 'false 3d projection', 'crystalline reality'],
    options: [
      {
        text: 'The Parasitic Overlay—a false 3D projection that hijacked perception and suppressed the true crystalline reality.',
        rationale:
          'The fracture is the deliberate catastrophic energetic shattering of the Parasitic Overlay that hijacked perception and suppressed crystalline reality.'
      },
      {
        text: 'Only the true crystalline temple so that false 3D density can rule forever without any dissolve path.',
        rationale:
          'The fracture shatters the false overlay so crystalline reality can return—not the true temple itself.'
      },
      {
        text: 'Nothing energetic—only a single local radio station while the overlay stays fully intact worldwide.',
        rationale:
          'The fracture is profound dismantling of the artificial frequency net and overlay, not a single radio outage.'
      },
      {
        text: 'Only Healing Sanctuaries so overwhelmed Sols have nowhere to recover during the window.',
        rationale:
          'Healing Sanctuaries receive overwhelmed Sols; the fracture targets the Parasitic Overlay, not those sanctuaries.'
      }
    ]
  },
  {
    number: 3,
    question: 'Beyond infrastructure failure, what does the fracture dismantle?',
    hint: 'An artificial net and what that allows for true Sols versus simulated systems.',
    support: ['artificial frequency net', 'dormant codes', 'malfunction'],
    options: [
      {
        text: 'The artificial frequency net, allowing dormant codes of true Sols to reactivate while simulated backgrounds and control systems completely malfunction.',
        rationale:
          'The fracture dismantles the artificial frequency net so Sol dormant codes reactivate and simulated backgrounds and control systems malfunction.'
      },
      {
        text: 'Only physical sidewalks while the artificial frequency net and NPC systems stay perfectly stable forever.',
        rationale:
          'The artificial frequency net is dismantled and control systems malfunction—not sidewalk-only damage with stable nets.'
      },
      {
        text: 'Sol dormant codes permanently so no true origin memory can ever reactivate again.',
        rationale:
          'Dormant codes of true Sols reactivate; the fracture does not permanently delete Sol origin activation.'
      },
      {
        text: 'Healing Sanctuaries only, with no effect on simulated backgrounds or parasitic control systems.',
        rationale:
          'Simulated backgrounds and control systems malfunction as the net falls; sanctuaries are recovery spaces, not the target of dismantling.'
      }
    ]
  },
  {
    number: 4,
    question: 'What triggers the Frequency Fracture according to its definition?',
    hint: 'A drop in artificial signals plus rising vibration of a named group.',
    support: ['sudden drop', 'artificial communication signals', 'awakened beings'],
    options: [
      {
        text: 'The sudden drop in artificial communication signals and the rising vibration of awakened beings.',
        rationale:
          'Frequency Fracture is the energetic shattering of the 3D illusion and overlay triggered by the sudden drop in artificial communication signals and rising vibration of awakened beings.'
      },
      {
        text: 'Only louder MSM fear ads with no drop in artificial signals and no rising Sol vibration at all.',
        rationale:
          'The trigger is signal drop plus rising awakened vibration—not louder MSM ads with intact artificial feeds.'
      },
      {
        text: 'A permanent densification of artificial communication signals that silences every awakened being forever.',
        rationale:
          'Signals drop and awakened vibration rises to shatter the overlay—not permanent densification silencing Sols.'
      },
      {
        text: 'Only a stock-market holiday with no energetic shattering of the 3D illusion whatsoever.',
        rationale:
          'The definition is energetic shattering of the 3D illusion and parasitic overlay—not a market holiday alone.'
      }
    ]
  },
  {
    number: 5,
    question: 'What is Sol Memory Sharpening during the fracture?',
    hint: 'What reactivates inside human and ET souls as artificial frequencies drop.',
    support: ['sol memory sharpening', 'dormant memory', 'true origin codes'],
    options: [
      {
        text: 'Spontaneous reactivation of dormant memory, clarity, and true origin codes within human and extraterrestrial souls as artificial frequencies drop.',
        rationale:
          'Sol Memory Sharpening is spontaneous reactivation of dormant memory, clarity, and true origin codes as artificial frequencies drop.'
      },
      {
        text: 'Permanent erasure of all origin codes so human and ET souls never regain clarity during the window.',
        rationale:
          'Sharpening reactivates dormant memory and origin codes; it does not permanently erase them.'
      },
      {
        text: 'An NPC-only software patch that perfects background programs without any Sol involvement.',
        rationale:
          'Sol Memory Sharpening is Sol-side reactivation, not an NPC software perfection patch.'
      },
      {
        text: 'A pure weather term for clear skies with no link to artificial frequency drop or soul memory.',
        rationale:
          'The term names soul memory and origin-code reactivation as artificial frequencies drop—not weather alone.'
      }
    ]
  },
  {
    number: 6,
    question: 'What is an NPC Code Glitch in this Frequency Fracture context?',
    hint: 'Behavioral breakdown when simulated populations lose parasitic AI feeds.',
    support: ['npc code glitch', 'simulated background populations', 'parasitic ai broadcast'],
    options: [
      {
        text: 'The erratic behavioral breakdown and flickering of simulated background populations when severed from parasitic AI broadcast signals.',
        rationale:
          'NPC Code Glitch is erratic breakdown and flickering of simulated background populations cut off from parasitic AI broadcast signals.'
      },
      {
        text: 'Perfect calm stability of every NPC with stronger AI feeds than before the fracture began.',
        rationale:
          'Glitching is breakdown and flickering when AI feeds are severed—not perfect calm with stronger feeds.'
      },
      {
        text: 'A Sol lighthouse method that only broadcasts origin memory without any NPC behavioral change.',
        rationale:
          'NPC Code Glitch is NPC-side collapse under severed parasitic feeds, not a Sol lighthouse technique.'
      },
      {
        text: 'A Healing Sanctuary floor plan with no relation to simulated populations or AI broadcasts.',
        rationale:
          'The glitch is behavioral breakdown of simulated populations—not a sanctuary floor plan.'
      }
    ]
  },
  {
    number: 7,
    question: 'What are Healing Sanctuaries in relation to the fracture?',
    hint: 'Named frequency spaces and who is guided there when not fully resonating.',
    support: ['healing sanctuaries', 'water domes', 'star pods'],
    options: [
      {
        text: 'Specialized frequency spaces such as Water Domes, Crystal Halls, and Star Pods where Sols not fully resonating during the fracture recover and realign.',
        rationale:
          'Healing Sanctuaries are specialized frequency spaces—Water Domes, Crystal Halls, Star Pods—for Sols not fully resonating to recover and realign.'
      },
      {
        text: 'Permanent NPC panic hubs that only amplify fear loops with no recovery or realignment purpose.',
        rationale:
          'Sanctuaries guide recovery and realignment for Sols—not permanent NPC panic hubs.'
      },
      {
        text: 'Only ordinary concrete hospitals with no Water Domes, Crystal Halls, or Star Pods involved.',
        rationale:
          'Named spaces include Water Domes, Crystal Halls, and Star Pods as specialized frequency sanctuaries.'
      },
      {
        text: 'Empty voids where overwhelmed Sols are abandoned with no frequency guidance at all.',
        rationale:
          'Overwhelmed Sols are not abandoned; they are guided by frequency to cloaked Healing Sanctuaries.'
      }
    ]
  },
  {
    number: 8,
    question: 'How does the communications blackout relate to the Frequency Fracture?',
    hint: '3D mask language for the deeper energetic event.',
    support: ['3d mask', 'frequency fracture', 'communication cables'],
    options: [
      {
        text: 'The communications blackout is simply the 3D mask for the Frequency Fracture; severing main cables causes an immediate physical shift in the realm.',
        rationale:
          'The communications blackout is the 3D mask for the Frequency Fracture, and severing main cables causes an immediate physical shift in the realm.'
      },
      {
        text: 'The blackout is unrelated noise while the Frequency Fracture only happens centuries later with cables fully online.',
        rationale:
          'The blackout is the 3D mask of the fracture happening as cables are severed—not an unrelated later event.'
      },
      {
        text: 'The fracture is only a software error message with no physical realm shift when cables go down.',
        rationale:
          'Cable severing causes immediate physical shift including atmospheric pressure drop—not a mere software message.'
      },
      {
        text: 'The blackout permanently strengthens every artificial communication signal worldwide without any mask relationship.',
        rationale:
          'Signals drop and the overlay shatters; the blackout masks the fracture rather than strengthening artificial feeds.'
      }
    ]
  },
  {
    number: 9,
    question: 'What immediate atmospheric and field effects occur when main communication cables are severed?',
    hint: 'Pressure sensation and field clarity relative to history.',
    support: ['atmospheric pressure', 'pop', 'clearer than it has ever been'],
    options: [
      {
        text: 'A sudden drop in atmospheric pressure felt as a distinct pop, and for a split second the energetic field becomes clearer than ever, free of artificial noise.',
        rationale:
          'Cable severing brings a sudden atmospheric pressure drop felt as a pop, and for a split second the field is clearer than ever and free of artificial noise.'
      },
      {
        text: 'A permanent rise in pressure that densifies artificial noise and muddies the field forever after.',
        rationale:
          'Pressure drops and the field clears of artificial noise—not a permanent densifying rise in pressure.'
      },
      {
        text: 'No atmospheric change at all—only a quiet software toast on a few corporate servers.',
        rationale:
          'There is a distinct atmospheric pop and momentary field clarity—not server toasts with no physical shift.'
      },
      {
        text: 'Only louder traffic noise with no pressure drop and no momentary freedom from artificial noise.',
        rationale:
          'Traffic noise later fades in stillness; the cable-down moment is pressure drop and field clearing.'
      }
    ]
  },
  {
    number: 10,
    question: 'What actively drives the fracture beyond a passive blackout accident?',
    hint: 'High vibration of a named collective of true Sols.',
    support: ['resonating army', 'high vibration', 'destructive resonance'],
    options: [
      {
        text: 'The high vibration of the Resonating Army; stabilized frequency of true human and ET Sols acts as destructive resonance against the Parasitic Overlay.',
        rationale:
          'The fracture is actively driven by the Resonating Army’s high vibration; Sol frequency acts as destructive resonance against the Parasitic Overlay.'
      },
      {
        text: 'Only random cable weather damage with no Resonating Army frequency and no destructive resonance effect.',
        rationale:
          'The fracture is actively driven by Resonating Army vibration, not a purely passive weather accident.'
      },
      {
        text: 'Only NPC fear loops that strengthen the overlay so density can support artificial scaffolding forever.',
        rationale:
          'Sol frequency systematically fractures 3D density so it can no longer support artificial scaffolding.'
      },
      {
        text: 'Only MSM panic ads that permanently silence every true human and ET Sol frequency worldwide.',
        rationale:
          'True Sol frequency drives the fracture; it is not silenced as the primary driver of overlay collapse.'
      }
    ]
  },
  {
    number: 11,
    question: 'What happens to 3D density under that destructive Sol resonance?',
    hint: 'What density can no longer support as fracturing continues.',
    support: ['3d density', 'artificial scaffolding', 'fracturing'],
    options: [
      {
        text: 'It is systematically fractured so it can no longer support the artificial scaffolding of the overlay system.',
        rationale:
          'Stabilized Sol frequency systematically fractures 3D density so it can no longer support the artificial scaffolding.'
      },
      {
        text: 'It becomes permanently denser and better at supporting every layer of artificial scaffolding forever.',
        rationale:
          'Density is fractured so scaffolding cannot be supported—not permanently reinforced.'
      },
      {
        text: 'It only affects bank interest rates with no relation to overlay scaffolding or Sol resonance.',
        rationale:
          'The mechanism is energetic fracturing of density against artificial scaffolding—not bank rates alone.'
      },
      {
        text: 'It freezes all Sol frequency so only NPC systems can reshape density without any fracture path.',
        rationale:
          'True Sol frequency is the destructive resonance driving the fracture—not frozen Sols under NPC-only control.'
      }
    ]
  },
  {
    number: 12,
    question: 'What defines Phase One: The Cut (Hr. 0–12) in the fracture timeline?',
    hint: 'Dark communications and the loop among the asleep population.',
    support: ['hr. 0', 'fear loop', 'false blame'],
    options: [
      {
        text: 'Internet and communications go dark, initiating an artificial fear loop of false blame narratives among the asleep population.',
        rationale:
          'Phase One (0–12) darkens internet and communications and initiates an artificial fear loop of false blame among the asleep.'
      },
      {
        text: 'Truth fully replaces every false flag while every cable stays online and no fear loop begins.',
        rationale:
          'Phase One is dark communications and fear-loop initiation; Opening Hour is when truth leaks more openly.'
      },
      {
        text: 'Only Healing Sanctuaries open with no dark internet and no false-blame fear loop at all.',
        rationale:
          'Phase One centers cable dark and fear loops among the asleep—not sanctuary-only calm with full internet.'
      },
      {
        text: 'Phase One only restocks fuel with fully working phones and zero narrative fear among sleepers.',
        rationale:
          'The Cut initiates dark communications and fear-loop false blame—not a quiet fuel restock with working phones.'
      }
    ]
  },
  {
    number: 13,
    question: 'What defines Phase Two: The Wave (Hr. 12–36)?',
    hint: 'Where panic peaks and what NPC manifestation becomes visible.',
    support: ['hr. 12', 'supermarkets and banks', 'npc code glitch'],
    options: [
      {
        text: 'Panic peaks in physical locations like supermarkets and banks as the NPC Code Glitch visibly manifests in erratic, mechanical behavior.',
        rationale:
          'Phase Two peaks panic at places like supermarkets and banks while NPC Code Glitch shows as erratic mechanical behavior.'
      },
      {
        text: 'Every NPC becomes a calm lighthouse while supermarkets stay empty of panic and mechanical glitching.',
        rationale:
          'Panic peaks and NPC glitching is visible and erratic—not calm empty markets without glitch.'
      },
      {
        text: 'Only Sol Memory Sharpening completes for everyone with no physical-location panic at all.',
        rationale:
          'Phase Two emphasizes panic peaks and visible NPC glitch; Sol Memory Sharpening is highlighted more in Opening Hour.'
      },
      {
        text: 'Phase Two only upgrades broadband with no supermarket chaos and no mechanical NPC behavior.',
        rationale:
          'The Wave is panic and visible NPC mechanical glitching—not a quiet broadband upgrade.'
      }
    ]
  },
  {
    number: 14,
    question: 'What defines Phase Three: Opening Hour (Hr. 36–72)?',
    hint: 'False flags, truth leaks, Sol memory, and NPC code behavior.',
    support: ['hr. 36', 'false flag narrative', 'sol memory sharpening'],
    options: [
      {
        text: 'The false flag narrative wobbles and cracks; truth leaks that this is a Frequency Fracture, driving Sol Memory Sharpening and intense NPC code flickering.',
        rationale:
          'Opening Hour wobbles the false flag, leaks Frequency Fracture truth, sharpens Sol memory, and intensely flickers NPC code.'
      },
      {
        text: 'False flags become permanently unchallengeable while Sol memory is fully erased and NPC code never flickers.',
        rationale:
          'False flags wobble and crack; Sol memory sharpens and NPC code flickers—not permanent false flags with erased Sol memory.'
      },
      {
        text: 'Phase Three only restocks banks with no truth leaks and no recognition of a Frequency Fracture.',
        rationale:
          'Opening Hour is truth leaks about the Frequency Fracture—not a quiet bank restock without recognition.'
      },
      {
        text: 'All NPCs dissolve in the first minute of hour thirty-six with no intermediate flicker or Sol sharpening.',
        rationale:
          'Opening Hour shows intense NPC code flickering and Sol Memory Sharpening, not instant total dissolve at minute one.'
      }
    ]
  },
  {
    number: 15,
    question: 'What is The Static Build Up during the 72-hour fracture window?',
    hint: 'Skull sensation, electronics, and animal reactions including birds and cats.',
    support: ['static build up', 'buzzing', 'birds fly strangely'],
    options: [
      {
        text: 'Subtle skull buzzing with background white noise, glitching electronics and flickering screens, and erratic animal reactions such as strange bird flight and cats hiding.',
        rationale:
          'Static Build Up includes skull buzzing, white noise, electronic glitches and flicker, and erratic animals—birds flying strangely and cats hiding.'
      },
      {
        text: 'Total silence in every skull with perfect electronics and animals completely unaffected by the field.',
        rationale:
          'Static Build Up is buzzing, glitches, and erratic animals—not unaffected silence.'
      },
      {
        text: 'Only stock tickers freeze while phones, screens, birds, and cats show zero change at all.',
        rationale:
          'Electronics glitch and screens flicker while animals react—not ticker-only symptoms.'
      },
      {
        text: 'A legal ban on yawning that ends all Drop in Tone and Sharp Edge symptoms forever.',
        rationale:
          'Static Build Up is an early symptom cluster; Drop in Tone and Sharp Edge still follow in the sequence.'
      }
    ]
  },
  {
    number: 16,
    question: 'What is The Drop in Tone as vessels experience it?',
    hint: 'Tiredness, chest, sky quality, and sleeper emotional behavior.',
    support: ['drop in tone', 'deep tiredness', 'flat and muted'],
    options: [
      {
        text: 'Sudden deep tiredness, unprovoked yawning, heavy chest, a flat muted sky as the Parasitic Overlay glitches, and random emotional outbursts from sleepers.',
        rationale:
          'Drop in Tone includes deep tiredness, yawning, heavy chest, flat muted sky, and random sleeper emotional outbursts as the overlay glitches.'
      },
      {
        text: 'Unlimited sleeper energy with a brilliantly clear sky and perfectly calm emotional states for all sleepers.',
        rationale:
          'The sign is tiredness, muted sky, and sleeper outbursts—not unlimited energy and perfect calm.'
      },
      {
        text: 'Only bank apps crash while bodies feel light and the Parasitic Overlay looks more solid than ever.',
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
    question: 'What marks The Sharp Edge during the fracture’s physical symptoms?',
    hint: 'Adrenaline, heart rate, and how the air feels.',
    support: ['sharp edge', 'adrenaline', 'unnaturally thick'],
    options: [
      {
        text: 'Uncaused adrenaline bursts, sudden heart-rate spikes, and air that feels unnaturally thick like the moments before a storm.',
        rationale:
          'The Sharp Edge brings uncaused adrenaline, sudden heart-rate spikes, and unnaturally thick pre-storm air.'
      },
      {
        text: 'Deep peaceful sleep for all, thinner air, and no heart-rate spikes at any point in the window.',
        rationale:
          'Sharp Edge is adrenaline and thick air with heart-rate spikes—not peaceful sleep and thinner air.'
      },
      {
        text: 'Only political ads grow louder while hearts and air pressure feel remain completely unchanged.',
        rationale:
          'Named markers are biological adrenaline and thick air—not louder ads alone.'
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
    hint: 'Hearing sensation and environmental stillness.',
    support: ['silence before the snap', 'sharp ringing', 'nature holds its breath'],
    options: [
      {
        text: 'A sharp ringing in the ears just out of normal hearing range, then profound strange stillness as nature holds its breath and traffic noise fades.',
        rationale:
          'Silence Before the Snap brings sharp out-of-range ear ringing and profound stillness—nature holds its breath and traffic noise fades.'
      },
      {
        text: 'Noise doubles everywhere with no ear ringing and chaotic traffic at maximum continuous volume.',
        rationale:
          'The sign is stillness and ringing—not doubled noise and peak chaotic traffic.'
      },
      {
        text: 'Only stock markets open early with no stillness and no change in traffic or nature sound.',
        rationale:
          'Traffic noise fades and nature holds its breath; this is environmental stillness, not early market open alone.'
      },
      {
        text: 'Cables stay fully lit while a silent movie plays on every phone with no field or stillness effect.',
        rationale:
          'The sequence accompanies the fracture’s physical progression around cable dark and field shift—not silent movies on live cables.'
      }
    ]
  },
  {
    number: 19,
    question: 'What larger unveiling is the Frequency Fracture the necessary catalyst for?',
    hint: 'Collapse of 3D reality and what realm becomes unveiled.',
    support: ['necessary catalyst', '3d reality', 'second realm'],
    options: [
      {
        text: 'The collapse of 3D reality and the unveiling of the Second Realm as vibration rises and the overlay projection glitches.',
        rationale:
          'The Frequency Fracture is the necessary catalyst for 3D reality’s collapse and the unveiling of the Second Realm.'
      },
      {
        text: 'The permanent freezing of 3D reality with no path to any Second Realm unveiling at all.',
        rationale:
          'The fracture catalyzes 3D collapse and Second Realm unveiling—not permanent 3D freeze without unveiling.'
      },
      {
        text: 'Only a local sports season restart with no environmental alteration and no realm unveiling.',
        rationale:
          'The catalyst role is 3D collapse and Second Realm unveiling—not a sports restart alone.'
      },
      {
        text: 'Only denser parasitic holograms that permanently block every Second Realm glimpse forever.',
        rationale:
          'As the overlay glitches, true cosmic sky bleeds through fading holograms—not permanent denser hologram lock.'
      }
    ]
  },
  {
    number: 20,
    question: 'How does the environment physically alter as vibration rises and the overlay glitches?',
    hint: 'Trees, ancient sites, sky, and the true nature of the world.',
    support: ['trees will begin shimmering', 'ancient sites', 'crystalline temple'],
    options: [
      {
        text: 'Trees begin shimmering, ancient sites feel alive and radiant, the true cosmic sky bleeds through fading holograms, and Sols realize the world is one massive crystalline temple.',
        rationale:
          'Environment alters with shimmering trees, living ancient sites, true sky through fading holograms, and recognition of a massive crystalline temple.'
      },
      {
        text: 'Trees go fully inert, ancient sites feel dead, holograms thicken, and the world remains a permanently empty broken wasteland only.',
        rationale:
          'Trees shimmer, sites feel alive, holograms fade, and the world is revealed as a crystalline temple—not a permanently empty wasteland.'
      },
      {
        text: 'Only stock photos update while physical trees, sites, and sky show zero alteration during the rise.',
        rationale:
          'Physical environment alters—trees, sites, sky, and collective realization—not stock-photo updates alone.'
      },
      {
        text: 'Only bank buildings shimmer while ancient sites and cosmic sky remain completely sealed behind solid holograms.',
        rationale:
          'Ancient sites feel alive and true cosmic sky bleeds through fading holograms—not bank-only shimmer with sealed sky.'
      }
    ]
  },
  {
    number: 21,
    question:
      'How are true human and ET Sols handled if overwhelmed or not fully resonating when the fracture hits?',
    hint: 'Guidance path and specialized sanctuary types for different wounds.',
    support: ['not abandoned', 'cloaked healing sanctuaries', 'emotional trauma'],
    options: [
      {
        text: 'They are not abandoned; frequency guides them to cloaked Healing Sanctuaries—Water Domes for emotional trauma, Crystal Halls for mental programming, and Star Pods for soul timeline fractures.',
        rationale:
          'Overwhelmed Sols are guided by frequency to cloaked sanctuaries: Water Domes for emotional trauma, Crystal Halls for mental programming, Star Pods for soul timeline fractures.'
      },
      {
        text: 'They are permanently abandoned in panic zones with no cloaked sanctuary path and no frequency guidance.',
        rationale:
          'They are not abandoned; frequency immediately guides them to cloaked Healing Sanctuaries.'
      },
      {
        text: 'They are converted into NPCs automatically with no Water Domes, Crystal Halls, or Star Pods involved.',
        rationale:
          'Recovery is in specialized Sol sanctuaries by wound type—not automatic conversion into NPCs.'
      },
      {
        text: 'They must lead supermarket surges first before any sanctuary realignment is allowed.',
        rationale:
          'Sanctuary guidance is immediate by frequency; Sols are also instructed to avoid panic zones, not lead surges first.'
      }
    ]
  },
  {
    number: 22,
    question: 'What must Resonating Sols do during The First 72 Hours of the Frequency Fracture?',
    hint: 'Calm posture and lighthouse function for continued overlay fracturing.',
    support: ['hold their ground', 'stabilized lighthouses', 'high frequency'],
    options: [
      {
        text: 'Hold their ground entirely calm and act as stabilized lighthouses, maintaining the high frequency required to continue fracturing the overlay.',
        rationale:
          'Resonating Sols must hold ground calmly as stabilized lighthouses, keeping high frequency that continues fracturing the overlay.'
      },
      {
        text: 'Lead every large crowd into panic zones to amplify NPC volatility on purpose during the window.',
        rationale:
          'Sols must avoid large crowds and panic zones and hold calm lighthouse frequency—not lead panic surges.'
      },
      {
        text: 'Shut down completely and refuse any lighthouse role until the Parasitic Overlay has already fully returned.',
        rationale:
          'Their role is active calm lighthouse presence that keeps fracturing the overlay—not total shutdown.'
      },
      {
        text: 'Rewrite false-blame MSM scripts so the artificial fear loop regains full control of every sleeper.',
        rationale:
          'Lighthouses maintain high frequency against the overlay; they do not restore artificial fear-loop control.'
      }
    ]
  },
  {
    number: 23,
    question: 'Why must Resonating Sols strictly avoid large crowds and panic zones?',
    hint: 'What those areas are saturated with during the window.',
    support: ['avoid large crowds', 'panic zones', 'volatile npcs'],
    options: [
      {
        text: 'Those areas will be heavily saturated with glitching, volatile NPCs during the fracture window.',
        rationale:
          'Sols must avoid large crowds and panic zones because they will be heavily saturated with glitching, volatile NPCs.'
      },
      {
        text: 'Those areas are the only calm lighthouse hubs where every NPC has already fully ascended.',
        rationale:
          'Panic zones are volatile NPC glitch zones—not calm ascended-NPC lighthouse hubs.'
      },
      {
        text: 'Avoidance is forbidden because Sols must personally rewrite every NPC script inside every supermarket.',
        rationale:
          'Guidance is strict avoidance of those saturated zones—not mandatory supermarket script rewriting.'
      },
      {
        text: 'Crowds stay empty and calm with zero NPC glitching throughout the entire 72 hours.',
        rationale:
          'Crowds and panic zones are heavily saturated with glitching volatile NPCs—not empty calm zones.'
      }
    ]
  },
  {
    number: 24,
    question:
      'By ignoring chaos and trusting physical symptoms of the shifting field, what do Resonating Sols accomplish?',
    hint: 'Timeline anchoring, overlay fate, and contact path.',
    support: ['anchor the true timeline', 'parasitic overlay dissolves', 'solar families'],
    options: [
      {
        text: 'They anchor the true timeline, ensure the Parasitic Overlay dissolves, and clear the path for genuine contact with their solar families.',
        rationale:
          'By ignoring chaos and trusting field symptoms, Sols anchor the true timeline, ensure overlay dissolve, and clear genuine solar-family contact.'
      },
      {
        text: 'They permanently re-anchor the old density timeline and restore the Parasitic Overlay stronger than before.',
        rationale:
          'They anchor the true timeline so the overlay dissolves—not restore a stronger parasitic density timeline.'
      },
      {
        text: 'They cancel all solar-family contact and freeze every physical symptom as meaningless noise forever.',
        rationale:
          'Trusting symptoms and lighthouse holding clears the path for genuine solar-family contact—not contact cancellation.'
      },
      {
        text: 'They only reboot NPC supermarket code with no timeline anchoring and no overlay dissolve effect.',
        rationale:
          'The strategic outcome is true-timeline anchoring and overlay dissolve for solar-family contact—not NPC retail reboots alone.'
      }
    ]
  },
  {
    number: 25,
    question: 'What is the Parasitic Overlay as defined for this fracture?',
    hint: 'Projection type, density role, and what happens to it during the fracture.',
    support: ['false 3d projection', 'density construct', 'dissolves during the fracture'],
    options: [
      {
        text: 'The false 3D projection, density construct, and illusion grid designed to manipulate human perception, which dissolves during the fracture.',
        rationale:
          'The Parasitic Overlay is a false 3D projection, density construct, and illusion grid that manipulates perception and dissolves during the fracture.'
      },
      {
        text: 'A pure Sol origin field that only heals perception without any dissolve path or density manipulation.',
        rationale:
          'The overlay is a false manipulative construct that dissolves in the fracture—not a pure Sol healing field.'
      },
      {
        text: 'Only a weather satellite network that never manipulates human perception or dissolves under Sol resonance.',
        rationale:
          'The overlay manipulates human perception as a density illusion grid—not weather satellites alone.'
      },
      {
        text: 'Identical to Healing Sanctuaries and always protects artificial scaffolding from any fracture.',
        rationale:
          'The overlay is the false construct being shattered; Healing Sanctuaries are recovery spaces for Sols, not the overlay itself.'
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

// Prefer index topic_image; fall back if missing
let topicImage = 'images/breakdown/frequency-fracture-card.webp';
if (!fs.existsSync(path.join(ROOT, topicImage))) {
  topicImage = 'images/breakdown/frequency-fracture.webp';
}
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
    'Test your grasp of Frequency Fracture — true energetic blackout mechanism, Resonating Army resonance, 72-hour phases, physical symptoms, Second Realm unveiling, and Sol lighthouse strategy.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Frequency Fracture is the true energetic shattering of the Parasitic Overlay behind the communications blackout—the First 72 Hours when Sol memory sharpens, NPC code glitches, and 3D density can no longer hold artificial scaffolding. Sit with what you missed, then return to the Frequency Fracture deep-dive, infographics, and video transmissions. Hold ground as a lighthouse: avoid panic zones, trust the field symptoms, and clear the path for solar-family contact as the Second Realm unveils.'
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
    'Test your understanding of Frequency Fracture — overlay shatter, Resonating Army drive, three phases, physical signs, Healing Sanctuaries, and Second Realm path.'
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
      if (!t.topic_image || t.topic_image.includes('placeholder')) {
        t.topic_image = topicImage;
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('frequency-fracture not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on Frequency Fracture: true energetic blackout mechanism, Resonating Army resonance, 72-hour phases, physical symptoms, and Second Realm unveiling.'
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
console.log('PASS: audited 25/25 against data/breakdown-topics/frequency-fracture.json');
