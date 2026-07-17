/**
 * Installs Truth Packages quiz for breakdown (Mega Breakdown) transmission.
 * All 25 items authored from and audited against data/breakdown-topics/truth-packages.json only.
 * Run: node scripts/install-truth-packages-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/truth-packages.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'truth-packages';
const TOPIC_TITLE = 'Truth Packages';
const SOURCE = 'breakdown';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const metaVoiceRe =
  /\b(according to the (report|source|text)|the report states|the source (states|specifies|suggests)|the text (states|describes|suggests|explicitly|mentions)|source material)\b/i;

/** Support phrases grounded only in truth-packages.json report. */
const supportPhrases = {
  1: ['e.b.s.', 'emergency broadcast system', 'false reality', 'one decisive blow'],
  2: ['truth packages', '72+', 'media and internet'],
  3: ['great awakening', 'parasitic overlay', 'crimes of the elite'],
  4: ['whitehats', 'military', 'broadcast disclosures'],
  5: ['truth packages', 'irrefutable proof', 'bloodlines', 'parasite control'],
  6: ['sleepers', 'shock', 'mental breakdowns'],
  7: ['earth-based alliance', 'galactic alliance', 'parasite system'],
  8: ['flood gates', '72+', 'mental breakdowns'],
  9: ['soft truths', 'harder truths', 'human trafficking'],
  10: ['draco-grey', 'royal families', 'popes', 'presidents'],
  11: ['poison-toxic injections', 'mmr', 'covid', 'depopulation'],
  12: ['mass outrage', 'mass awakening'],
  13: ['whitehats', 'parasite system', 'twist the narrative'],
  14: ['military emergency channel', 'npc media'],
  15: ['stay calm you are safe', 'military control active'],
  16: ['election fraud', 'child trafficking', 'satanic cults'],
  17: ['names, faces, and proof', 'replaced elites'],
  18: ['stabilization lockdowns', 'chaos low', 'reset and pause'],
  19: ['stage 2', 'stage 1', 'ww3', 'alien invasion'],
  20: ['scare events', 'switch off', 'pay attention'],
  21: ['frequency fracture', 'resonating sols', 'lighthouses'],
  22: ['npc code', 'a.i. scaffolding'],
  23: ['opening of the sky', 'motherships', 'higher-density reality'],
  24: ['shatter', 'false reality', 'energetic hold'],
  25: ['truth tribunals', 'arrests', 'executions', 'ascension']
};

const RAW_QUESTIONS = [
  {
    number: 1,
    question: 'What is the E.B.S. operation designed to do to humanity’s false reality?',
    hint: 'Synchronized global event and one decisive blow.',
    options: [
      {
        text: 'Shatter the false reality of humanity in one decisive blow as a synchronized global event.',
        isCorrect: true,
        rationale:
          'The E.B.S. operation is a synchronized global event designed to shatter the false reality of humanity in one decisive blow.'
      },
      {
        text: 'Gently reinforce the false reality forever with no decisive blow or synchronized global disclosure.',
        isCorrect: false,
        rationale:
          'E.B.S. is designed to shatter false reality in one decisive blow, not reinforce it.'
      },
      {
        text: 'Only pause local radio ads with no planetary intervention or false-reality shatter role.',
        isCorrect: false,
        rationale:
          'It is a planetary intervention and worldwide communication takeover for disclosures.'
      },
      {
        text: 'Only restore Cabal media ownership with no Whitehat military broadcast takeover at all.',
        isCorrect: false,
        rationale:
          'Military and Whitehats seize media and internet to broadcast Truth Packages.'
      }
    ]
  },
  {
    number: 2,
    question: 'How are Truth Packages disseminated during this intervention?',
    hint: 'Duration and channel control after media and internet seizure.',
    options: [
      {
        text: 'Over a 72+ hour period, broadcast directly to the masses after military forces seize control of all media and internet channels.',
        isCorrect: true,
        rationale:
          'Truth Packages are disseminated over a 72+ hour period, broadcast directly to the masses after military forces seize control of all media and internet channels.'
      },
      {
        text: 'Over five optional minutes on Cabal channels that never lose narrative control.',
        isCorrect: false,
        rationale:
          'Packages run 72+ hours after full media and internet seizure by military/Whitehats.'
      },
      {
        text: 'Only as sealed paper files never broadcast after any media takeover window.',
        isCorrect: false,
        rationale:
          'They are broadcast via E.B.S. directly to the masses during the takeover window.'
      },
      {
        text: 'Only after Ascension reconstruction with no 72+ hour flood-gate disclosure phase.',
        isCorrect: false,
        rationale:
          'Truth Packages are the flood-gate disclosure catalyst of the Great Awakening, not post-Ascension only.'
      }
    ]
  },
  {
    number: 3,
    question: 'What catalyst role do Truth Packages play in the Great Awakening?',
    hint: 'Force confrontation with parasitic overlay and elite crimes.',
    options: [
      {
        text: 'They function as the ultimate catalyst for the Great Awakening, forcing the collective to confront the suppressed reality of the parasitic overlay and the crimes of the elite.',
        isCorrect: true,
        rationale:
          'This phase functions as the ultimate catalyst for the Great Awakening, forcing the collective to confront the suppressed reality of the parasitic overlay and the crimes of the elite.'
      },
      {
        text: 'They permanently hide the parasitic overlay and elite crimes so no collective confrontation occurs.',
        isCorrect: false,
        rationale:
          'They force confrontation with parasitic overlay and elite crimes as the awakening catalyst.'
      },
      {
        text: 'They only entertain Sleepers with no suppressed-reality confrontation content at all.',
        isCorrect: false,
        rationale:
          'Content includes irrefutable proof of corruption, bloodlines, and parasite control.'
      },
      {
        text: 'They only manage weather alerts with no Great Awakening catalyst function.',
        isCorrect: false,
        rationale:
          'Truth Packages are core to planetary intervention and Great Awakening catalysis.'
      }
    ]
  },
  {
    number: 4,
    question: 'What is the E.B.S. (Emergency Broadcast System) as a mechanism?',
    hint: 'Worldwide communication takeover by Whitehats and military.',
    options: [
      {
        text: 'The worldwide communication takeover mechanism deployed by the Whitehats and military to broadcast disclosures and shatter the false reality.',
        isCorrect: true,
        rationale:
          'E.B.S. is the worldwide communication takeover mechanism deployed by the Whitehats and military to broadcast disclosures and shatter the false reality.'
      },
      {
        text: 'A Cabal entertainment network that remains one of many competing channels during disclosure.',
        isCorrect: false,
        rationale:
          'One military emergency channel remains online; E.B.S. is Whitehat/military takeover, not Cabal entertainment.'
      },
      {
        text: 'Only a local weather loop with no worldwide disclosure or false-reality shatter role.',
        isCorrect: false,
        rationale:
          'It is a worldwide takeover mechanism for disclosures that shatter false reality.'
      },
      {
        text: 'Only a post-tribunal museum channel with no live media seizure function.',
        isCorrect: false,
        rationale:
          'E.B.S. is the live broadcast takeover delivering Truth Packages before tribunals follow.'
      }
    ]
  },
  {
    number: 5,
    question: 'What are Truth Packages defined as?',
    hint: 'Concentrated 72+ hour data releases via E.B.S. with irrefutable proof.',
    options: [
      {
        text: 'Concentrated, 72+ hour data releases broadcast via the E.B.S. containing irrefutable proof of global corruption, bloodlines, and parasite control.',
        isCorrect: true,
        rationale:
          'Truth Packages are concentrated, 72+ hour data releases broadcast via the E.B.S. containing irrefutable proof of global corruption, bloodlines, and parasite control.'
      },
      {
        text: 'Optional five-minute rumors with no irrefutable proof of corruption, bloodlines, or parasite control.',
        isCorrect: false,
        rationale:
          'They are concentrated 72+ hour releases of irrefutable proof, not optional short rumors.'
      },
      {
        text: 'Only corporate ads praising elites with no bloodline or parasite-control documentation.',
        isCorrect: false,
        rationale:
          'Content proves global corruption, bloodlines, and parasite control against the elite system.'
      },
      {
        text: 'Only classified files never released on any military emergency channel to the masses.',
        isCorrect: false,
        rationale:
          'They are broadcast via E.B.S. directly to the masses on the remaining military channel.'
      }
    ]
  },
  {
    number: 6,
    question: 'Who are the Sleepers relative to Truth Packages?',
    hint: 'Unaware of overlay; shock and mental breakdowns on exposure.',
    options: [
      {
        text: 'Individuals entirely unaware of the parasitic overlay and false reality who will experience shock and mental breakdowns upon exposure to the Truth Packages.',
        isCorrect: true,
        rationale:
          'Sleepers are individuals entirely unaware of the parasitic overlay and false reality, who will experience shock and mental breakdowns upon exposure to the Truth Packages.'
      },
      {
        text: 'Whitehat commanders already fully aware of the overlay and immune to any shock from packages.',
        isCorrect: false,
        rationale:
          'Whitehats execute the takedown and manage E.B.S.; Sleepers are the unaware population shocked by packages.'
      },
      {
        text: 'Only NPC media hosts who never experience shock and never lose narrative control.',
        isCorrect: false,
        rationale:
          'Cabal-controlled NPC media is blocked from interfering; Sleepers are unaware humans facing shock.'
      },
      {
        text: 'Only Resonating Sols who never need lighthouse support during A.I. scaffolding collapse.',
        isCorrect: false,
        rationale:
          'Resonating Sols act as lighthouses; Sleepers are the unaware facing breakdowns and awakening.'
      }
    ]
  },
  {
    number: 7,
    question: 'Who are the Whitehats in this Truth Packages framework?',
    hint: 'Earth-based alliance, military, and Galactic Alliance assets.',
    options: [
      {
        text: 'Earth-based alliance forces, military, and Galactic Alliance assets executing the takedown of the parasite system and managing the E.B.S. broadcast.',
        isCorrect: true,
        rationale:
          'Whitehats are the Earth-based alliance forces, military, and Galactic Alliance assets executing the takedown of the parasite system and managing the E.B.S. broadcast.'
      },
      {
        text: 'Only Cabal banking elites permanently managing parasite narrative without any E.B.S. role.',
        isCorrect: false,
        rationale:
          'Whitehats take down the parasite system and manage E.B.S., not Cabal narrative management.'
      },
      {
        text: 'Only Sleepers voting online with no military or Galactic Alliance execution role.',
        isCorrect: false,
        rationale:
          'Whitehats include military and Galactic Alliance assets executing takedown and broadcast management.'
      },
      {
        text: 'Only NPC media avatars allowed to keep twisting the narrative during disclosure.',
        isCorrect: false,
        rationale:
          'NPC media is prevented from interfering; Whitehats seize channels for Truth Packages.'
      }
    ]
  },
  {
    number: 8,
    question: 'What do the E.B.S. broadcasts act as when delivering Truth Packages?',
    hint: 'Flood Gates metaphor and impact on the unprepared public.',
    options: [
      {
        text: 'The Flood Gates—delivering 72+ hours of Truth Packages that will cause mental breakdowns among the unprepared public.',
        isCorrect: true,
        rationale:
          'E.B.S. Broadcasts act as The Flood Gates, delivering 72+ hours of Truth Packages that will cause mental breakdowns among the unprepared public.'
      },
      {
        text: 'A gentle trickle with no flood-gate intensity and no mental impact on the unprepared public.',
        isCorrect: false,
        rationale:
          'They act as Flood Gates delivering 72+ hours of packages that cause mental breakdowns among the unprepared.'
      },
      {
        text: 'Only a closed vault never opened to the public during any military channel window.',
        isCorrect: false,
        rationale:
          'Packages are broadcast openly via the remaining military emergency channel.'
      },
      {
        text: 'Only a post-ascension archive with no live 72+ hour flood of soft-then-hard truths.',
        isCorrect: false,
        rationale:
          'Live structured soft-to-hard disclosure over 72+ hours is the Flood Gates event.'
      }
    ]
  },
  {
    number: 9,
    question: 'How is information strategically structured for psychological impact?',
    hint: 'Soft truths first for reassurance, then harder truths.',
    options: [
      {
        text: 'First delivering soft truths for reassurance, then escalating into harder truths detailing corruption, human trafficking, and hidden bloodlines.',
        isCorrect: true,
        rationale:
          'Information is strategically structured: first soft truths for reassurance, escalating into harder truths detailing corruption, human trafficking, and hidden bloodlines.'
      },
      {
        text: 'Harder truths only first with no soft reassurance and no staged psychological management.',
        isCorrect: false,
        rationale:
          'Soft truths come first for reassurance before harder corruption and trafficking evidence.'
      },
      {
        text: 'Only entertainment loops with no corruption, trafficking, or bloodline disclosure content.',
        isCorrect: false,
        rationale:
          'Harder truths specifically detail corruption, human trafficking, and hidden bloodlines.'
      },
      {
        text: 'Only permanent silence after soft truths with no escalation into harder evidence at all.',
        isCorrect: false,
        rationale:
          'Structure escalates into harder truths after the soft reassurance wave.'
      }
    ]
  },
  {
    number: 10,
    question: 'What will bloodline exposure evidence explicitly reveal about world leaders?',
    hint: 'Not human; operated under Draco-Grey influence.',
    options: [
      {
        text: 'That world leaders including royal families, popes, and presidents were not human, but operated under Draco-Grey influence.',
        isCorrect: true,
        rationale:
          'Bloodline exposure evidence will explicitly reveal that world leaders, including royal families, popes, and presidents, were not human, but operated under Draco-Grey influence.'
      },
      {
        text: 'That all leaders were fully human and independent with no Draco-Grey influence of any kind.',
        isCorrect: false,
        rationale:
          'Exposure shows they were not human and operated under Draco-Grey influence.'
      },
      {
        text: 'That only Sleepers ran royal and papal lines with no elite bloodline ET influence claim.',
        isCorrect: false,
        rationale:
          'Named exposed groups are royal families, popes, and presidents under Draco-Grey influence.'
      },
      {
        text: 'That Whitehats invented bloodlines overnight with no prior parasitic control evidence.',
        isCorrect: false,
        rationale:
          'Broadcasts expose parasite control and bloodline influence, not Whitehat invention of bloodlines.'
      }
    ]
  },
  {
    number: 11,
    question: 'What medical truth will the broadcasts expose?',
    hint: 'Poison-toxic injections and deliberate depopulation plans.',
    options: [
      {
        text: 'Hard, serious evidence of poison-toxic injections such as MMR and Covid vaccines and deliberate depopulation plans.',
        isCorrect: true,
        rationale:
          'Broadcasts expose hard, serious evidence of poison-toxic injections (such as MMR and Covid vaccines) and deliberate depopulation plans.'
      },
      {
        text: 'Only marketing claims that all injections were harmless placebos with no depopulation plan exposure.',
        isCorrect: false,
        rationale:
          'Hard serious evidence frames poison-toxic injections and deliberate depopulation plans.'
      },
      {
        text: 'Only weather-related health notes with no MMR, Covid, or depopulation content.',
        isCorrect: false,
        rationale:
          'Named examples include MMR and Covid as poison-toxic injections in depopulation plans.'
      },
      {
        text: 'Only sealed lab notes never released as hard evidence during Truth Packages.',
        isCorrect: false,
        rationale:
          'This medical truth is part of the public E.B.S. Truth Package releases.'
      }
    ]
  },
  {
    number: 12,
    question: 'What does release of this medical and corruption information cause, and what does that act as?',
    hint: 'Mass outrage as catalyst for mass awakening.',
    options: [
      {
        text: 'Mass outrage, which acts as the catalyst for a mass awakening.',
        isCorrect: true,
        rationale:
          'The release of this information will cause mass outrage, which acts as the catalyst for a mass awakening.'
      },
      {
        text: 'Permanent mass apathy that prevents any awakening catalyst from forming.',
        isCorrect: false,
        rationale:
          'Mass outrage is the catalyst for mass awakening, not permanent apathy.'
      },
      {
        text: 'Only quiet private agreement with no public outrage or mass-awakening catalyst role.',
        isCorrect: false,
        rationale:
          'Mass outrage is explicitly the catalyst for mass awakening.'
      },
      {
        text: 'Only reinforcement of Sleepers false reality with no shatter or awakening pathway.',
        isCorrect: false,
        rationale:
          'Ultimate purpose is entirely shattering Sleepers false reality via packages and resulting outrage/trauma.'
      }
    ]
  },
  {
    number: 13,
    question: 'What happens in the military takeover and media seizure?',
    hint: 'Total Whitehat takeover so Parasite System cannot twist the narrative.',
    options: [
      {
        text: 'Media and internet are totally taken over by Whitehats, ensuring the Parasite System cannot twist the narrative.',
        isCorrect: true,
        rationale:
          'Media and internet will be totally taken over by Whitehats, ensuring the Parasite System cannot twist the narrative.'
      },
      {
        text: 'Media and internet remain fully under Parasite System control with no Whitehat seizure.',
        isCorrect: false,
        rationale:
          'Total Whitehat takeover ensures the Parasite System cannot twist the narrative.'
      },
      {
        text: 'Only one sports channel pauses ads while all other Cabal networks continue unchallenged.',
        isCorrect: false,
        rationale:
          'Takeover is total of media and internet, with one military emergency channel remaining online for packages.'
      },
      {
        text: 'Only post-tribunal museums seize archives with no live disclosure channel control.',
        isCorrect: false,
        rationale:
          'Live media and internet seizure enables E.B.S. Truth Package delivery during the intervention.'
      }
    ]
  },
  {
    number: 14,
    question: 'What remains online to deliver Truth Packages, and what is blocked?',
    hint: 'One military emergency channel vs Cabal-controlled NPC media.',
    options: [
      {
        text: 'One military emergency channel remains online to deliver Truth Packages, preventing Cabal-controlled NPC media from interfering with disclosure.',
        isCorrect: true,
        rationale:
          'One military emergency channel will remain online to deliver the Truth Packages, preventing Cabal-controlled NPC media from interfering with the disclosure.'
      },
      {
        text: 'All Cabal NPC media stays online while the military emergency channel is permanently muted.',
        isCorrect: false,
        rationale:
          'Only the military emergency channel remains; NPC media is prevented from interfering.'
      },
      {
        text: 'No channels remain online, so Truth Packages cannot be delivered to the masses at all.',
        isCorrect: false,
        rationale:
          'One military emergency channel remains specifically to deliver Truth Packages.'
      },
      {
        text: 'Only entertainment apps remain online with no military channel and no disclosure content.',
        isCorrect: false,
        rationale:
          'The remaining channel is the military emergency channel for Truth Package disclosure.'
      }
    ]
  },
  {
    number: 15,
    question: 'What initial public reassurance is stated in the first wave of disclosures?',
    hint: 'Stay calm, safe, military control active to protect you.',
    options: [
      {
        text: 'Stay calm you are safe, military control active to protect you—before progressing into harder evidence.',
        isCorrect: true,
        rationale:
          'Initial messages reassure the public stating Stay calm you are safe, military control active to protect you, before progressing into harder evidence.'
      },
      {
        text: 'Panic immediately with no military protection message and no soft-truth reassurance wave.',
        isCorrect: false,
        rationale:
          'First wave softens trauma with explicit safety and military protection reassurance.'
      },
      {
        text: 'Only harder evidence first with no stay-calm safety statement of any kind.',
        isCorrect: false,
        rationale:
          'Disclosures are softened first with safety reassurance before harder evidence.'
      },
      {
        text: 'Only weather safety tips with no military control active protection framing.',
        isCorrect: false,
        rationale:
          'The stated reassurance explicitly frames military control active to protect the public.'
      }
    ]
  },
  {
    number: 16,
    question: 'What harder evidence will broadcasts ultimately reveal about elite crimes?',
    hint: 'Election fraud, child trafficking, Satanic cults, replaced elite rituals.',
    options: [
      {
        text: 'Election fraud, child trafficking rings, Satanic cults, and the rituals of replaced elites, complete with names, faces, and proof of crimes.',
        isCorrect: true,
        rationale:
          'Broadcasts ultimately reveal election fraud, child trafficking rings, Satanic cults, and the rituals of replaced elites, complete with names, faces, and proof of crimes.'
      },
      {
        text: 'Only sports gambling stories with no election fraud, trafficking, cult, or proof packages.',
        isCorrect: false,
        rationale:
          'Harder evidence includes election fraud, child trafficking, Satanic cults, and elite rituals with proof.'
      },
      {
        text: 'Only anonymous praise for elites with no names, faces, or crime proof of any kind.',
        isCorrect: false,
        rationale:
          'Revelations include names, faces, and proof of crimes of replaced elites.'
      },
      {
        text: 'Only sealed tribunal notes never shown during the live E.B.S. package window.',
        isCorrect: false,
        rationale:
          'These revelations are part of the progressive harder-evidence broadcast content.'
      }
    ]
  },
  {
    number: 17,
    question: 'What level of proof accompanies revelations about replaced elites?',
    hint: 'Names, faces, and proof of crimes.',
    options: [
      {
        text: 'Complete packages including names, faces, and proof of crimes of the replaced elites and their systems.',
        isCorrect: true,
        rationale:
          'Harder revelations include names, faces, and proof of crimes regarding replaced elites and related systems of control.'
      },
      {
        text: 'Only vague rumors with no names, faces, or crime proof attached to any elite figures.',
        isCorrect: false,
        rationale:
          'Broadcasts include complete names, faces, and proof of crimes.'
      },
      {
        text: 'Only cartoon caricatures with no evidentiary proof structure in the Truth Packages.',
        isCorrect: false,
        rationale:
          'Truth Packages contain irrefutable proof with names, faces, and crime evidence.'
      },
      {
        text: 'Only financial stock tickers with no personal identity or crime documentation content.',
        isCorrect: false,
        rationale:
          'Identity and crime proof of elites is central harder-evidence content.'
      }
    ]
  },
  {
    number: 18,
    question: 'How do lockdowns during E.B.S. differ from parasite-driven lockdowns?',
    hint: 'Stabilization, low chaos, sit still, watch, think, reset and pause.',
    options: [
      {
        text: 'They are stabilization lockdowns that keep chaos low so the population can sit still, watch, think, and hit the reset and pause button on their reality—unlike parasite-driven control lockdowns.',
        isCorrect: true,
        rationale:
          'Military forces implement stabilization lockdowns to protect civilians; unlike parasite-driven lockdowns, this keeps chaos low, allowing the population to sit still, watch, think, and hit the reset and pause button on their reality.'
      },
      {
        text: 'They are pure parasite-driven control lockdowns designed only to maximize chaos and block watching.',
        isCorrect: false,
        rationale:
          'E.B.S. lockdowns are stabilization to keep chaos low for watching and processing, not parasite control lockdowns.'
      },
      {
        text: 'There are no lockdowns at all during E.B.S., so chaos is left unmanaged during the flood of packages.',
        isCorrect: false,
        rationale:
          'Military forces implement stabilization lockdowns during the broadcast.'
      },
      {
        text: 'They only lock military bases with no civilian protective stabilization environment.',
        isCorrect: false,
        rationale:
          'Lockdowns protect civilians and create a low-chaos environment for public processing.'
      }
    ]
  },
  {
    number: 19,
    question: 'Where do Truth Packages sit in the final event flow sequence?',
    hint: 'Stage 2 after Stage 1 WW3 and Alien Invasion scare events.',
    options: [
      {
        text: 'Stage 2, immediately following Stage 1 WW3 and Alien Invasion scare events that fracture the illusion and force the public to ask what is really happening.',
        isCorrect: true,
        rationale:
          'Truth Packages occur sequentially as Stage 2 of the final event flow, immediately following Stage 1 WW3 and Alien Invasion scare events which fracture the illusion and force the public to ask what is really happening.'
      },
      {
        text: 'Stage 1 only, with no prior scare events and no Stage 2 placement in the final event flow.',
        isCorrect: false,
        rationale:
          'Truth Packages are Stage 2 after Stage 1 scare events.'
      },
      {
        text: 'Only after motherships fully uncloak with no Stage 1 scare priming or Stage 2 package window.',
        isCorrect: false,
        rationale:
          'E.B.S. bridges chaotic 3D collapse toward sky opening; packages follow scare events first.'
      },
      {
        text: 'Only as a cancelled optional stage with no sequential relationship to WW3 scare events.',
        isCorrect: false,
        rationale:
          'Release is sequential Stage 2 after Stage 1 scare events that make Sleepers pay attention.'
      }
    ]
  },
  {
    number: 20,
    question: 'Why must scare events precede E.B.S. Truth Packages?',
    hint: 'Without them Sleepers switch off and fail to pay attention.',
    options: [
      {
        text: 'If E.B.S. ran without scare events, Sleepers would simply switch off the broadcasts and fail to pay attention.',
        isCorrect: true,
        rationale:
          'If the E.B.S. were run without these scare events, Sleepers would simply switch off the broadcasts and fail to pay attention.'
      },
      {
        text: 'Because scare events permanently cancel E.B.S. so no one ever needs to pay attention to packages.',
        isCorrect: false,
        rationale:
          'Scare events prepare attention so packages are not ignored; they do not cancel E.B.S.'
      },
      {
        text: 'Because Whitehats want maximum ignore-rate so Truth Packages never reach collective awareness.',
        isCorrect: false,
        rationale:
          'Priming exists so Sleepers pay attention rather than switch off.'
      },
      {
        text: 'Because soft truths alone already guarantee attention without any prior illusion-fracturing scares.',
        isCorrect: false,
        rationale:
          'Stage 1 scare events are required so Sleepers do not switch off Stage 2 packages.'
      }
    ]
  },
  {
    number: 21,
    question: 'How does the E.B.S. Operation act for Resonating Sols during collapse?',
    hint: 'Frequency fracture; lighthouses as NPC code flickers.',
    options: [
      {
        text: 'As a frequency fracture allowing Resonating Sols (awakened souls) to act as lighthouses and help guide humanity as NPC code flickers and A.I. scaffolding crumbles.',
        isCorrect: true,
        rationale:
          'The E.B.S. Operation acts as a frequency fracture, allowing Resonating Sols to act as lighthouses and help guide humanity as the NPC code flickers and the A.I. scaffolding crumbles.'
      },
      {
        text: 'As permanent reinforcement of NPC code so Resonating Sols never need to act as lighthouses.',
        isCorrect: false,
        rationale:
          'NPC code flickers and A.I. scaffolding crumbles; Resonating Sols act as lighthouses.'
      },
      {
        text: 'As pure entertainment with no frequency-fracture role and no lighthouse guidance function.',
        isCorrect: false,
        rationale:
          'E.B.S. is a frequency fracture enabling lighthouse guidance during scaffolding collapse.'
      },
      {
        text: 'As only tribunal audio with no bridge role for awakened souls during 3D illusion collapse.',
        isCorrect: false,
        rationale:
          'E.B.S. bridges chaotic 3D collapse and sky opening while Resonating Sols guide humanity.'
      }
    ]
  },
  {
    number: 22,
    question: 'What happens to NPC code and A.I. scaffolding as packages land?',
    hint: 'Flickers and crumbles while Resonating Sols guide.',
    options: [
      {
        text: 'NPC code flickers and A.I. scaffolding crumbles while Resonating Sols guide humanity through the fracture.',
        isCorrect: true,
        rationale:
          'As Resonating Sols act as lighthouses, the NPC code flickers and the A.I. scaffolding crumbles during the frequency fracture of E.B.S.'
      },
      {
        text: 'NPC code permanently solidifies and A.I. scaffolding becomes thicker than ever before.',
        isCorrect: false,
        rationale:
          'NPC code flickers and A.I. scaffolding crumbles, not solidifies or thickens.'
      },
      {
        text: 'Only animal behavior changes with no NPC code flicker or A.I. scaffolding collapse at all.',
        isCorrect: false,
        rationale:
          'Named collapse signs include NPC code flicker and A.I. scaffolding crumbling.'
      },
      {
        text: 'Only Cabal media grows stronger with no scaffolding collapse during Truth Package delivery.',
        isCorrect: false,
        rationale:
          'Cabal NPC media is blocked; scaffolding crumbles as packages and frequency fracture land.'
      }
    ]
  },
  {
    number: 23,
    question: 'What gap does the broadcast bridge toward higher-density reality?',
    hint: 'Between 3D illusion collapse and sky opening with uncloaking motherships.',
    options: [
      {
        text: 'The gap between chaotic collapse of the 3D Illusion and the eventual opening of the sky, where motherships uncloak and true higher-density reality bleeds through.',
        isCorrect: true,
        rationale:
          'The broadcast bridges the gap between chaotic collapse of the 3D Illusion and eventual opening of the sky, where motherships will uncloak and true higher-density reality bleeds through.'
      },
      {
        text: 'Only a gap into permanent 3D Illusion with no sky opening or mothership uncloaking path.',
        isCorrect: false,
        rationale:
          'Bridge leads toward sky opening, mothership uncloaking, and higher-density reality bleeding through.'
      },
      {
        text: 'Only a gap into endless scare events with no higher-density reality breakthrough afterward.',
        isCorrect: false,
        rationale:
          'Scare events are Stage 1; E.B.S. packages bridge toward sky opening and higher-density bleed-through.'
      },
      {
        text: 'Only a gap into sealed tribunals with no public sky-opening or mothership context at all.',
        isCorrect: false,
        rationale:
          'Strategic context includes sky opening and motherships after packages shatter false reality.'
      }
    ]
  },
  {
    number: 24,
    question: 'What is the ultimate purpose of E.B.S. and Truth Packages for Sleepers?',
    hint: 'Entirely shatter false reality; outrage and trauma break parasitic energetic hold.',
    options: [
      {
        text: 'To entirely shatter the Sleepers false reality so resulting mass outrage and trauma break the energetic hold of the parasites.',
        isCorrect: true,
        rationale:
          'Ultimate purpose is to entirely shatter the Sleepers false reality; resulting mass outrage and trauma breaks the energetic hold of the parasites.'
      },
      {
        text: 'To permanently protect Sleepers false reality so parasites keep full energetic hold forever.',
        isCorrect: false,
        rationale:
          'Purpose is shattering false reality and breaking parasites energetic hold via outrage and trauma.'
      },
      {
        text: 'To entertain only with no shatter of false reality and no break of parasitic energetic hold.',
        isCorrect: false,
        rationale:
          'Shatter of false reality and break of energetic hold are the stated ultimate purpose.'
      },
      {
        text: 'To cancel tribunals so no path from packages into justice and reconstruction exists.',
        isCorrect: false,
        rationale:
          'Packages immediately pave the way for Truth Tribunals, arrests, and executions.'
      }
    ]
  },
  {
    number: 25,
    question: 'What does this operation immediately pave the way for after packages land?',
    hint: 'Truth Tribunals, arrests, executions; secure realm for reconstruction and ascension.',
    options: [
      {
        text: 'Truth Tribunals, arrests, and executions of the replaced elites, securing the realm for reconstruction and ascension processes.',
        isCorrect: true,
        rationale:
          'This operation immediately paves the way for Truth Tribunals, arrests, and executions of the replaced elites, securing the realm for the reconstruction and ascension processes.'
      },
      {
        text: 'Permanent restoration of replaced elites with no tribunals, arrests, or ascension pathway.',
        isCorrect: false,
        rationale:
          'Path is tribunals, arrests, and executions of replaced elites, then reconstruction and ascension.'
      },
      {
        text: 'Only endless Stage 1 scare events with no justice process after Truth Packages.',
        isCorrect: false,
        rationale:
          'After packages, the path is Truth Tribunals and securing the realm for reconstruction and ascension.'
      },
      {
        text: 'Only NPC media restoration with no realm security for reconstruction of any kind.',
        isCorrect: false,
        rationale:
          'Parasite narrative control is broken so the realm can be secured for reconstruction and ascension.'
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

// Expand any short options before finalize (Q12 correct can be short)
const questions = RAW_QUESTIONS.map((q) => {
  const opts = q.options.map((o) => {
    let text = o.text;
    if (text.length < 50 && o.isCorrect && q.number === 12) {
      text =
        'The release of this information causes mass outrage, which acts as the catalyst for a mass awakening across the collective.';
    }
    return { ...o, text };
  });

  const finalized = finalizeOptions(
    opts.map(({ text, isCorrect, rationale }) => ({ text, isCorrect, rationale })),
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
      throw new Error(`Q${q.number}${o.label}: option too short (${o.text.length}): ${o.text}`);
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

const topicImage = 'images/breakdown/truth-packages.webp';
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
    'Test your grasp of Truth Packages — 72+ hour E.B.S. flood gates, soft-to-hard disclosure, Whitehat media seizure, and the path into tribunals and ascension.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Truth Packages are the 72+ hour E.B.S. flood gates that shatter Sleepers false reality after military media seizure. Sit with what you missed, then return to the Truth Packages deep-dive, infographics, and video transmissions. Soft reassurance becomes hard proof—outrage becomes awakening—and the path opens to tribunals, reconstruction, and the sky’s higher-density bleed-through.'
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
    'Test your understanding of Truth Packages — 72+ hour E.B.S. releases, soft-to-hard sequencing, bloodline and medical exposure, Whitehat channel control, and mass-awakening catalysis.'
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
  throw new Error('truth-packages not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on Truth Packages: 72+ hour E.B.S. flood gates, soft-to-hard disclosure, Whitehat media seizure, and the path into tribunals and ascension.'
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
    "  { path: '/quiz/breakdown/atmospheric-pop.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/breakdown/truth-disclosure.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/breakdown/phase-seven-eight.html', priority: '0.75', changefreq: 'monthly' },"
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
console.log('PASS: audited 25/25 against data/breakdown-topics/truth-packages.json');
