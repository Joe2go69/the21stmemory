/**
 * Installs Lockdown Window quiz for breakdown (Mega Breakdown) transmission.
 * All 25 items authored from and audited against data/breakdown-topics/lockdown-window.json only.
 * Run: node scripts/install-lockdown-window-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/lockdown-window.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'lockdown-window';
const TOPIC_TITLE = 'Lockdown Window';
const SOURCE = 'breakdown';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const metaVoiceRe =
  /\b(according to the (report|source|text)|the report states|the source (states|specifies|suggests)|the text (states|describes|suggests|explicitly|mentions)|source material)\b/i;

/** Support phrases grounded only in lockdown-window.json report. */
const supportPhrases = {
  1: ['sixth phase', 'great purge', 'lockdown window'],
  2: ['physical and informational', 'military', 'communications restrictions'],
  3: ['trigger events', 'e.b.s.', 'sleepers'],
  4: ['sleepers', 'unawakened', '3d illusion'],
  5: ['whitehats', 'allied military', 'parasitic infrastructure'],
  6: ['emergency broadcast system', 'absolute truth', 'lockdown is secured'],
  7: ['trigger events', 'fifth phase', 'geopolitical tensions'],
  8: ['narrative maintenance', 'fourth phase', 'stand-ins'],
  9: ['not an organic response', 'whitehat operation', 'world war iii'],
  10: ['maintain order', 'not to enforce parasitic control', 'old world police'],
  11: ['internet restrictions', 'blackouts', 'parasitic influence'],
  12: ['visible in the streets', 'traditional world police', 'fake governments'],
  13: ['ww3 narrative', 'position their assets', 'whitehats'],
  14: ['staged internet restrictions', 'parasitic information', 'throttle'],
  15: ['main communication cables', 'intentionally severed', 'emergency channels'],
  16: ['traditional media', 'expose their own corruption', 'removed from the airwaves'],
  17: ['freeze the population', 'protecting civilians', 'chaos low'],
  18: ['seize all broadcasting networks', 'without interference', 'e.b.s.'],
  19: ['phase four', 'phase five', 'phase six'],
  20: ['physical terrain', 'contain', 'shock'],
  21: ['phase seven', 'election fraud', 'trafficking rings', 'neutralized elites'],
  22: ['environmental containment', 'societal collapse'],
  23: ['destructive panic', '3d illusion', 'communication cables'],
  24: ['calculated stages', 'safely positioned', 'truth broadcasts'],
  25: ['ascension', 'reconstruction', 'securing the realm']
};

const RAW_QUESTIONS = [
  {
    number: 1,
    question: 'Which phase of The Great Purge is The Lockdown Window?',
    hint: 'Place it after Trigger Events and before the E.B.S. truth broadcast.',
    options: [
      {
        text: 'The sixth phase of The Great Purge, establishing controlled physical and informational containment before the truth broadcast.',
        isCorrect: true,
        rationale:
          'The Lockdown Window is the sixth phase of The Great Purge, establishing a controlled physical and informational environment to prepare for the truth broadcast.'
      },
      {
        text: 'The fourth phase of The Great Purge, focused only on Controlled Stand-ins and a docile illusion of normalcy.',
        isCorrect: false,
        rationale:
          'That describes Narrative Maintenance (Phase Four); The Lockdown Window is Phase Six after Trigger Events.'
      },
      {
        text: 'The fifth phase of The Great Purge, limited to staged geopolitical tensions and supply disruptions alone.',
        isCorrect: false,
        rationale:
          'That describes Trigger Events (Phase Five); lockdown is the subsequent physical and informational containment phase.'
      },
      {
        text: 'The seventh phase of The Great Purge, defined solely as the E.B.S. delivering absolute truth with no prior containment.',
        isCorrect: false,
        rationale:
          'Phase Seven is E.B.S. disclosure after lockdown secures the environment; Phase Six is the containment window itself.'
      }
    ]
  },
  {
    number: 2,
    question: 'What kind of containment does The Lockdown Window establish?',
    hint: 'Name both the street-level and communications dimensions of control.',
    options: [
      {
        text: 'Critical physical and informational containment through visible military deployment and communications restrictions.',
        isCorrect: true,
        rationale:
          'The Lockdown Window is the critical physical and informational containment phase, using visible military deployment and communications restrictions.'
      },
      {
        text: 'Only ceremonial stand-in optics with no military streets presence and no internet restrictions at all.',
        isCorrect: false,
        rationale:
          'Stand-in normalcy is Phase Four; Phase Six deploys military and communications restrictions for containment.'
      },
      {
        text: 'Only open-border free travel with unrestricted parasitic media flows and no street control.',
        isCorrect: false,
        rationale:
          'Lockdown freezes movement dynamics through military order and throttles parasitic information flows.'
      },
      {
        text: 'Only post-ascension reconstruction logistics after absolute truth is already fully accepted worldwide.',
        isCorrect: false,
        rationale:
          'Lockdown is the preparatory holding pattern before E.B.S. shatters false reality, not post-truth reconstruction alone.'
      }
    ]
  },
  {
    number: 3,
    question: 'What sequence places The Lockdown Window in the purge timeline?',
    hint: 'Connect preceding stress to the final holding pattern before E.B.S.',
    options: [
      {
        text: 'It follows Trigger Events psychological stress as the final preparatory holding pattern before the E.B.S. shatters the Sleepers false reality.',
        isCorrect: true,
        rationale:
          'Following Trigger Events, the lockdown is the final preparatory holding pattern engineering a controlled environment before the E.B.S. shatters the false reality of the Sleepers.'
      },
      {
        text: 'It precedes Narrative Maintenance and never connects to Trigger Events or any truth broadcast preparation.',
        isCorrect: false,
        rationale:
          'Lockdown follows Phase Four and Phase Five as Phase Six, preparing directly for E.B.S. truth delivery.'
      },
      {
        text: 'It replaces the E.B.S. entirely so absolute truth is never broadcast after streets are secured.',
        isCorrect: false,
        rationale:
          'Lockdown creates the exact controlled environment necessary for the E.B.S. to seize broadcasting networks.'
      },
      {
        text: 'It occurs only after Phase Seven disclosures about election fraud have already finished worldwide.',
        isCorrect: false,
        rationale:
          'Phase Six transitions the world into Phase Seven; lockdown is not a post-disclosure cleanup phase.'
      }
    ]
  },
  {
    number: 4,
    question: 'Who are the Sleepers during The Lockdown Window?',
    hint: 'Identify whose perception must be managed and secured in transition.',
    options: [
      {
        text: 'The unawakened masses existing within the 3D illusion whose perception must be managed and secured during the transition.',
        isCorrect: true,
        rationale:
          'Sleepers are the unawakened masses within the 3D illusion whose perception must be managed and secured during the transition.'
      },
      {
        text: 'The Whitehat multi-dimensional command forces already executing lockdown asset positioning worldwide.',
        isCorrect: false,
        rationale:
          'Whitehats execute the lockdown; Sleepers are the unawakened population being contained and prepared for truth.'
      },
      {
        text: 'Only neutralized elites already removed from power with no remaining 3D-illusion perception to manage.',
        isCorrect: false,
        rationale:
          'Neutralized elites appear in later E.B.S. disclosures; Sleepers are the unawakened masses still inside the illusion.'
      },
      {
        text: 'Only traditional media executives who voluntarily leave the airwaves before any military deployment.',
        isCorrect: false,
        rationale:
          'Media self-exposure is a lockdown mechanic; Sleepers are the broader unawakened public, not only media staff.'
      }
    ]
  },
  {
    number: 5,
    question: 'Who are the Whitehats in this phase?',
    hint: 'Name the allied forces executing lockdown and dismantling parasitic infrastructure.',
    options: [
      {
        text: 'Allied military and multi-dimensional command forces executing the lockdown and positioning assets to dismantle parasitic infrastructure.',
        isCorrect: true,
        rationale:
          'Whitehats are the allied military and multi-dimensional command forces executing the lockdown and positioning assets to dismantle parasitic infrastructure.'
      },
      {
        text: 'The old world police and corrupted media structures being restored as permanent global authority.',
        isCorrect: false,
        rationale:
          'Visible military presence signals removal of old world police and corrupted media, not their restoration.'
      },
      {
        text: 'Only parasitic command networks still enforcing control through unrestricted internet propaganda.',
        isCorrect: false,
        rationale:
          'Whitehats dismantle parasitic infrastructure; lockdown throttles parasitic information flows.'
      },
      {
        text: 'Only civilian volunteer groups with no military deployment and no asset-positioning role.',
        isCorrect: false,
        rationale:
          'Whitehats include allied military forces becoming visible in the streets and positioning operational assets.'
      }
    ]
  },
  {
    number: 6,
    question: 'What is the E.B.S. role once lockdown is secured?',
    hint: 'Connect Emergency Broadcast System takeover to absolute truth delivery.',
    options: [
      {
        text: 'It takes over media and internet networks to deliver the absolute truth once the lockdown is secured.',
        isCorrect: true,
        rationale:
          'The E.B.S. is the Emergency Broadcast System that ultimately takes over media and internet networks to deliver absolute truth once lockdown is secured.'
      },
      {
        text: 'It only restores traditional media airwaves permanently without any absolute-truth delivery mandate.',
        isCorrect: false,
        rationale:
          'Traditional media is removed after self-exposure; E.B.S. seizes networks for absolute truth delivery.'
      },
      {
        text: 'It stages only Phase Five supply disruptions with no relationship to lockdown or network takeover.',
        isCorrect: false,
        rationale:
          'E.B.S. is the post-lockdown truth-delivery system, not the Phase Five Trigger Events toolkit.'
      },
      {
        text: 'It cancels all military street presence so parasitic information flows return unrestricted.',
        isCorrect: false,
        rationale:
          'Lockdown secures the environment so E.B.S. can seize broadcasting without interference, not cancel containment.'
      }
    ]
  },
  {
    number: 7,
    question: 'What are Trigger Events relative to The Lockdown Window?',
    hint: 'Identify the preceding fifth-phase role that pushes awakening before lockdown.',
    options: [
      {
        text: 'The fifth phase using staged geopolitical tensions and supply disruptions to push the public toward awakening before lockdown.',
        isCorrect: true,
        rationale:
          'Trigger Events are the fifth phase utilizing staged geopolitical tensions and supply disruptions to push the public toward awakening prior to the lockdown.'
      },
      {
        text: 'The phase after E.B.S. disclosure that rebuilds old world police without any prior tension staging.',
        isCorrect: false,
        rationale:
          'Trigger Events precede lockdown; they are not a post-E.B.S. reconstruction of old police structures.'
      },
      {
        text: 'The fourth phase focused solely on stand-in ceremonies with no geopolitical tension tools at all.',
        isCorrect: false,
        rationale:
          'Stand-in normalcy is Narrative Maintenance; Trigger Events are Phase Five tension before lockdown.'
      },
      {
        text: 'An optional side project with no role in creating psychological stress before Phase Six containment.',
        isCorrect: false,
        rationale:
          'Lockdown follows the psychological stress of Trigger Events as the next containment phase.'
      }
    ]
  },
  {
    number: 8,
    question: 'What is Narrative Maintenance relative to The Lockdown Window?',
    hint: 'Name the fourth-phase docile illusion that comes before escalation and lockdown.',
    options: [
      {
        text: 'The fourth phase that maintains a docile illusion of normalcy through controlled stand-ins before conflict escalates.',
        isCorrect: true,
        rationale:
          'Narrative Maintenance is the fourth phase focused on maintaining a docile illusion of normalcy through controlled stand-ins before escalation of conflict.'
      },
      {
        text: 'The sixth phase itself, identical to lockdown military deployment and cable severing operations.',
        isCorrect: false,
        rationale:
          'Narrative Maintenance is Phase Four; The Lockdown Window is the distinct sixth-phase containment operation.'
      },
      {
        text: 'The only phase after E.B.S. truth where stand-ins return as permanent legitimate world leaders.',
        isCorrect: false,
        rationale:
          'Phase Four precedes escalation and lockdown; it is not a post-truth restoration of stand-in rule.'
      },
      {
        text: 'A communications-blackout protocol that severs main cables before any stand-in optics appear.',
        isCorrect: false,
        rationale:
          'Cable severing and blackouts are lockdown mechanics; Narrative Maintenance is earlier stand-in normalcy.'
      }
    ]
  },
  {
    number: 9,
    question: 'What is the true nature of sudden government and military mobilization?',
    hint: 'Contrast organic threat response with orchestrated cover narrative.',
    options: [
      {
        text: 'It is not an organic response to global threat, but a highly orchestrated Whitehat operation under a simulated World War III cover.',
        isCorrect: true,
        rationale:
          'Sudden mobilization is not an organic response to global threat, but a highly orchestrated Whitehat operation disguised under a simulated World War III cover.'
      },
      {
        text: 'It is a fully organic multipolar accident with no Whitehat orchestration and no simulated WW3 cover story.',
        isCorrect: false,
        rationale:
          'The operation is highly orchestrated Whitehat work under simulated WW3 cover, not organic accident.'
      },
      {
        text: 'It is permanent parasitic enforcement with no plan to remove old world police or corrupted media.',
        isCorrect: false,
        rationale:
          'Visible military presence signals active removal of old world police and corrupted media structures.'
      },
      {
        text: 'It is only a Phase Four awards ceremony schedule with no street military deployment at all.',
        isCorrect: false,
        rationale:
          'Phase Six features explicit military visibility in the streets under the WW3 narrative cover.'
      }
    ]
  },
  {
    number: 10,
    question: 'Why is visible military presence deployed in the streets?',
    hint: 'Distinguish order-maintenance from parasitic enforcement and institutional removal.',
    options: [
      {
        text: 'To maintain order rather than enforce parasitic control, signaling removal of old world police and corrupted media structures.',
        isCorrect: true,
        rationale:
          'Visible military presence is deployed specifically to maintain order, not to enforce parasitic control, signaling removal of old world police and corrupted media structures.'
      },
      {
        text: 'To permanently restore parasitic control and expand old world police authority over every civilian channel.',
        isCorrect: false,
        rationale:
          'Deployment signals removal of old world police and corrupted media, not parasitic restoration.'
      },
      {
        text: 'To cancel all E.B.S. plans so no absolute truth can ever seize broadcasting networks.',
        isCorrect: false,
        rationale:
          'Military order is part of creating the controlled environment required for E.B.S. takeover.'
      },
      {
        text: 'To host only peaceful festivals with no role in replacing traditional world police structures.',
        isCorrect: false,
        rationale:
          'Forces become visible to enforce order and replace traditional world police under lockdown mechanics.'
      }
    ]
  },
  {
    number: 11,
    question: 'What purpose do internet restrictions, blackouts, and communication severing serve?',
    hint: 'Link staged darkness to stripping false narratives and parasitic isolation.',
    options: [
      {
        text: 'They are deliberate staged actions designed to strip remaining false narratives and isolate the population from parasitic influence.',
        isCorrect: true,
        rationale:
          'Internet restrictions, blackouts, and communication severing are deliberate staged actions designed to strip remaining false narratives and isolate the population from parasitic influence.'
      },
      {
        text: 'They are accidental outages meant to strengthen parasitic propaganda without any isolation intent.',
        isCorrect: false,
        rationale:
          'These actions are deliberate and staged to throttle parasitic flows and isolate populations from parasitic influence.'
      },
      {
        text: 'They permanently expand unrestricted internet so traditional media never loses narrative control.',
        isCorrect: false,
        rationale:
          'Restrictions throttle parasitic information; media is later removed after self-exposure.'
      },
      {
        text: 'They only affect Phase Four stand-in ceremonies and never touch main communication cables.',
        isCorrect: false,
        rationale:
          'Main communication cables are intentionally severed during lockdown blackout phases.'
      }
    ]
  },
  {
    number: 12,
    question: 'What happens under Military Deployment and Asset Positioning?',
    hint: 'Connect street visibility, police replacement, and fake-government mobilization.',
    options: [
      {
        text: 'Military forces become explicitly visible in the streets to enforce order and replace traditional world police while fake governments mobilize under the WW3 narrative.',
        isCorrect: true,
        rationale:
          'Military forces become explicitly visible to enforce order and replace traditional world police; fake governments are mobilized under the WW3 narrative.'
      },
      {
        text: 'All military units remain permanently hidden while traditional world police expand unrestricted authority.',
        isCorrect: false,
        rationale:
          'Forces become explicitly visible and replace traditional world police rather than remaining hidden.'
      },
      {
        text: 'Only media studios are occupied with no street presence and no fake-government WW3 cover mobilization.',
        isCorrect: false,
        rationale:
          'Street visibility, police replacement, and fake-government WW3 mobilization are core deployment elements.'
      },
      {
        text: 'Civilians alone patrol streets with no Whitehat asset positioning for the next operational stage.',
        isCorrect: false,
        rationale:
          'Whitehats position assets securely for the next operational stage during this military deployment window.'
      }
    ]
  },
  {
    number: 13,
    question: 'How does the WW3 narrative assist Whitehat operations during lockdown?',
    hint: 'Focus on asset positioning under the cover story.',
    options: [
      {
        text: 'Fake governments mobilize under the WW3 guise, allowing Whitehats to position their assets securely for the next operational stage.',
        isCorrect: true,
        rationale:
          'Fake governments are mobilized under the WW3 narrative guise, which allows Whitehats to position assets securely for the next operational stage.'
      },
      {
        text: 'It permanently restores genuine parasitic governments with no asset positioning for later stages.',
        isCorrect: false,
        rationale:
          'The cover enables Whitehat asset positioning, not permanent restoration of parasitic rule.'
      },
      {
        text: 'It cancels all military street deployments so no order-enforcement presence appears publicly.',
        isCorrect: false,
        rationale:
          'Military forces become explicitly visible under this operational window, not cancelled.'
      },
      {
        text: 'It only documents history after Phase Seven disclosures with no live asset-positioning function.',
        isCorrect: false,
        rationale:
          'WW3 cover is used during Phase Six to position assets before Phase Seven truth delivery.'
      }
    ]
  },
  {
    number: 14,
    question: 'What do staged internet restrictions accomplish in the lockdown?',
    hint: 'Connect throttling to parasitic information flows.',
    options: [
      {
        text: 'They throttle parasitic information flows as part of staged communications lockdown controls.',
        isCorrect: true,
        rationale:
          'The lockdown implements staged internet restrictions to throttle parasitic information flows.'
      },
      {
        text: 'They amplify parasitic propaganda so false narratives become the only available public content.',
        isCorrect: false,
        rationale:
          'Restrictions throttle parasitic information flows rather than amplifying parasitic propaganda.'
      },
      {
        text: 'They permanently guarantee unlimited open access for every corporate media channel worldwide.',
        isCorrect: false,
        rationale:
          'Staged restrictions and later media removal reduce parasitic channels, not expand them forever.'
      },
      {
        text: 'They only affect offline newspapers with no impact on internet or major communication systems.',
        isCorrect: false,
        rationale:
          'Internet restrictions and major-comms blackouts are central lockdown communications tools.'
      }
    ]
  },
  {
    number: 15,
    question: 'What occurs during the initial blackout phases of communications lockdown?',
    hint: 'Recall intentional cable severing and emergency-channel reliance.',
    options: [
      {
        text: 'Main communication cables are intentionally severed, internet and major comms go dark, and populations are forced onto emergency channels.',
        isCorrect: true,
        rationale:
          'During initial blackout phases, main communication cables are intentionally severed, internet and major comms go dark, and reliance shifts to emergency channels.'
      },
      {
        text: 'Main cables are upgraded for faster parasitic streaming with no darkness and no emergency-channel shift.',
        isCorrect: false,
        rationale:
          'Cables are intentionally severed to create darkness and force emergency-channel reliance.'
      },
      {
        text: 'Only entertainment apps fail while government and media networks remain fully uninterrupted.',
        isCorrect: false,
        rationale:
          'Internet and major communications go dark as a deliberate lockdown action, not a minor app glitch.'
      },
      {
        text: 'Blackouts are delayed until after ascension reconstruction with no role in pre-E.B.S. containment.',
        isCorrect: false,
        rationale:
          'Blackouts are Phase Six tools that help create the controlled environment before E.B.S. takeover.'
      }
    ]
  },
  {
    number: 16,
    question: 'What happens under Media Self-Exposure during the lockdown?',
    hint: 'Describe what traditional media does before leaving the airwaves.',
    options: [
      {
        text: 'Traditional media networks, stripped of protective infrastructure, expose their own corruption before being entirely removed from the airwaves.',
        isCorrect: true,
        rationale:
          'Stripped of protective infrastructure and forced into a corner, traditional media networks expose their own corruption before being entirely removed from the airwaves.'
      },
      {
        text: 'Traditional media is permanently strengthened as the sole trusted channel after military leaves the streets.',
        isCorrect: false,
        rationale:
          'Media is removed from the airwaves after self-exposure, not permanently strengthened.'
      },
      {
        text: 'Traditional media never admits corruption and continues uninterrupted through Phase Seven disclosures.',
        isCorrect: false,
        rationale:
          'Self-exposure of corruption precedes complete removal from the airwaves during lockdown.'
      },
      {
        text: 'Only Whitehat channels self-accuse while corporate networks remain fully protected and unchallenged.',
        isCorrect: false,
        rationale:
          'Traditional media networks are the ones stripped of protection and forced into self-exposure.'
      }
    ]
  },
  {
    number: 17,
    question: 'What is the ultimate mechanical purpose of freezing the population in place?',
    hint: 'Balance civilian protection with low chaos for the next broadcast stage.',
    options: [
      {
        text: 'To protect civilians while keeping chaos low, creating the exact controlled environment needed for E.B.S. network seizure.',
        isCorrect: true,
        rationale:
          'The ultimate mechanic freezes the population in place, protecting civilians while keeping chaos low to create the controlled environment necessary for the E.B.S. to seize broadcasting networks.'
      },
      {
        text: 'To maximize destructive panic so no controlled environment for truth broadcast can ever form.',
        isCorrect: false,
        rationale:
          'Lockdown keeps chaos low and prevents unmanageable panic so truth can be delivered safely.'
      },
      {
        text: 'To restore unrestricted parasitic media so E.B.S. never needs to seize any networks.',
        isCorrect: false,
        rationale:
          'The freeze prepares E.B.S. seizure of broadcasting networks without interference.'
      },
      {
        text: 'To end The Great Purge immediately with no Phase Seven disclosures of any kind.',
        isCorrect: false,
        rationale:
          'Lockdown transitions into Phase Seven E.B.S. disclosures rather than ending the purge sequence.'
      }
    ]
  },
  {
    number: 18,
    question: 'What does the controlled lockdown environment allow the E.B.S. to do?',
    hint: 'Focus on broadcasting takeover without interference.',
    options: [
      {
        text: 'Seize all broadcasting networks without interference once the population is frozen in a low-chaos controlled state.',
        isCorrect: true,
        rationale:
          'The controlled environment is necessary for the E.B.S. to seize all broadcasting networks without interference.'
      },
      {
        text: 'Share airtime equally with parasitic media that remains fully online and unchallenged forever.',
        isCorrect: false,
        rationale:
          'Traditional media is removed; E.B.S. seizes networks for absolute truth without interference.'
      },
      {
        text: 'Cancel all truth delivery and return immediately to Phase Four stand-in normalcy optics.',
        isCorrect: false,
        rationale:
          'Lockdown prepares absolute-truth delivery, not a permanent return to Phase Four illusion.'
      },
      {
        text: 'Only print paper leaflets with no takeover of media or internet networks at all.',
        isCorrect: false,
        rationale:
          'E.B.S. takes over media and internet networks once lockdown is secured.'
      }
    ]
  },
  {
    number: 19,
    question: 'How does Phase Six relate to Phases Four and Five?',
    hint: 'Describe the bridging sequence from docile optics through tension to physical lockdown.',
    options: [
      {
        text: 'It is the physical culmination of the sequence that began with Narrative Maintenance and escalated through Trigger Events.',
        isCorrect: true,
        rationale:
          'Phase Six is the unavoidable physical culmination of the bridging sequence that began with Narrative Maintenance (Phase Four) and escalated through Trigger Events (Phase Five).'
      },
      {
        text: 'It replaces Phases Four and Five entirely and has no connection to stand-ins or psychological tension.',
        isCorrect: false,
        rationale:
          'Phase Six culminates the sequence that used stand-ins then psychological tension before physical lockdown.'
      },
      {
        text: 'It occurs before Phase Four and never follows any Trigger Events stress period.',
        isCorrect: false,
        rationale:
          'Lockdown follows Trigger Events psychological stress as Phase Six after Phases Four and Five.'
      },
      {
        text: 'It is optional and unrelated to containing the shock created by earlier phases.',
        isCorrect: false,
        rationale:
          'Phase Six locks down physical terrain to safely contain the resulting shock from prior phases.'
      }
    ]
  },
  {
    number: 20,
    question: 'Why does Phase Six lock down the physical terrain?',
    hint: 'Connect street security to containing shock from earlier fracture work.',
    options: [
      {
        text: 'To safely contain the shock produced after Phase Four docility and Phase Five psychological fracture.',
        isCorrect: true,
        rationale:
          'While Phase Four kept masses docile and Phase Five fractured reality with tension, Phase Six locks down physical terrain to safely contain the resulting shock.'
      },
      {
        text: 'To maximize uncontrolled street chaos with no containment goal after earlier phases.',
        isCorrect: false,
        rationale:
          'The purpose is safe containment of shock and low chaos, not maximizing uncontrolled street chaos.'
      },
      {
        text: 'To cancel all prior phase work and restore full parasitic narrative control immediately.',
        isCorrect: false,
        rationale:
          'Lockdown continues the purge sequence into Phase Seven disclosures, not parasitic restoration.'
      },
      {
        text: 'To host only ceremonial parades with no relationship to containing collective shock.',
        isCorrect: false,
        rationale:
          'Physical terrain lockdown secures streets and neutralizes organic communications for containment.'
      }
    ]
  },
  {
    number: 21,
    question: 'What does Phase Six directly transition the world into?',
    hint: 'Name Phase Seven E.B.S. disclosure themes listed in the report.',
    options: [
      {
        text: 'Phase Seven, where the E.B.S. delivers undeniable disclosures regarding election fraud, trafficking rings, and neutralized elites.',
        isCorrect: true,
        rationale:
          'By securing streets and neutralizing organic communications, Phase Six directly transitions into Phase Seven, where the E.B.S. delivers disclosures on election fraud, trafficking rings, and neutralized elites.'
      },
      {
        text: 'A permanent Phase Four stand-in loop with no disclosures about fraud, trafficking, or elites.',
        isCorrect: false,
        rationale:
          'The transition is into Phase Seven E.B.S. disclosures, not an endless Phase Four optics loop.'
      },
      {
        text: 'Only Phase Five again, restarting supply disruptions without any absolute-truth broadcast.',
        isCorrect: false,
        rationale:
          'After lockdown, the sequence moves into Phase Seven truth delivery, not back into Phase Five alone.'
      },
      {
        text: 'Immediate full ascension with no E.B.S. disclosures of any neutralized-elite crimes.',
        isCorrect: false,
        rationale:
          'Phase Seven E.B.S. disclosures are the direct next stage after lockdown secures the environment.'
      }
    ]
  },
  {
    number: 22,
    question: 'What is the strategic necessity of the lockdown?',
    hint: 'Name the containment goal that prevents societal collapse.',
    options: [
      {
        text: 'Total environmental containment to prevent societal collapse during the severing of communications and illusion collapse.',
        isCorrect: true,
        rationale:
          'The strategic necessity of the lockdown is total environmental containment to prevent societal collapse.'
      },
      {
        text: 'Total abandonment of order so societal collapse becomes the primary intended outcome of Phase Six.',
        isCorrect: false,
        rationale:
          'Lockdown exists to prevent societal collapse through military order and information control.'
      },
      {
        text: 'Total restoration of unrestricted parasitic media with no containment of information flow.',
        isCorrect: false,
        rationale:
          'Strategy requires strict control over information flow, not unrestricted parasitic media restoration.'
      },
      {
        text: 'Total cancellation of truth broadcasts so unawakened never receive absolute truth at all.',
        isCorrect: false,
        rationale:
          'Containment positions the unawakened to receive truth broadcasts, not to cancel disclosure.'
      }
    ]
  },
  {
    number: 23,
    question: 'What would happen without visible military presence and strict information control?',
    hint: 'Link cable severing and 3D-illusion collapse to panic risk.',
    options: [
      {
        text: 'Sudden severing of communication cables and collapse of the 3D illusion would produce unmanageable, destructive panic.',
        isCorrect: true,
        rationale:
          'Without visible military presence and strict information control, cable severing and 3D-illusion collapse would result in unmanageable, destructive panic.'
      },
      {
        text: 'Nothing would change, because cable severing never risks panic without military streets presence.',
        isCorrect: false,
        rationale:
          'Without order and info control, cable severing and illusion collapse produce unmanageable destructive panic.'
      },
      {
        text: 'Only mild boredom would occur, with no risk of destructive panic among the unawakened.',
        isCorrect: false,
        rationale:
          'The named risk is unmanageable, destructive panic—not mild boredom—if containment is absent.'
      },
      {
        text: 'Parasitic leaders would voluntarily confess on every channel without any chaos risk whatsoever.',
        isCorrect: false,
        rationale:
          'Containment is required because illusion collapse and cable severing would otherwise drive destructive panic.'
      }
    ]
  },
  {
    number: 24,
    question: 'How are the unawakened positioned by staged internet restrictions and isolation?',
    hint: 'Describe forced pause and readiness for truth broadcasts.',
    options: [
      {
        text: 'They are safely positioned and forcibly paused in calculated stages so they can receive the truth broadcasts.',
        isCorrect: true,
        rationale:
          'By isolating the population and restricting the internet in calculated stages, architects ensure the unawakened are safely positioned and forcibly paused to receive the truth broadcasts.'
      },
      {
        text: 'They are permanently cut off from all future truth broadcasts with no forced pause toward disclosure.',
        isCorrect: false,
        rationale:
          'The forced pause positions them to receive truth broadcasts, not to block disclosure forever.'
      },
      {
        text: 'They are returned immediately to unrestricted parasitic feeds with no isolation or staged throttle.',
        isCorrect: false,
        rationale:
          'Isolation and staged internet restrictions are deliberate, not a return to unrestricted parasitic feeds.'
      },
      {
        text: 'They are asked to rebuild traditional media as the only channel before any E.B.S. activation.',
        isCorrect: false,
        rationale:
          'Traditional media is removed after self-exposure; unawakened are paused for truth broadcasts via E.B.S.'
      }
    ]
  },
  {
    number: 25,
    question: 'What larger outcome does lockdown containment help secure for the realm?',
    hint: 'Connect environmental containment to ascension and reconstruction.',
    options: [
      {
        text: 'It fundamentally secures the realm for ascension and reconstruction after truth broadcasts are received.',
        isCorrect: true,
        rationale:
          'Containment that positions the unawakened for truth broadcasts fundamentally secures the realm for ascension and reconstruction.'
      },
      {
        text: 'It permanently freezes the parasitic overlay so ascension and reconstruction can never begin.',
        isCorrect: false,
        rationale:
          'The strategy secures the realm for ascension and reconstruction, not permanent parasitic freeze.'
      },
      {
        text: 'It only rebuilds old world police as the final authority with no ascension pathway at all.',
        isCorrect: false,
        rationale:
          'Old world police are removed; the larger outcome named is securing the realm for ascension and reconstruction.'
      },
      {
        text: 'It ends all multi-dimensional Whitehat operations before any reconstruction planning starts.',
        isCorrect: false,
        rationale:
          'Whitehats execute lockdown and asset positioning as part of securing the path through truth into reconstruction.'
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

const topicImage = 'images/breakdown/lockdown-window.webp';
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
    'Test your grasp of the Lockdown Window — Phase Six physical and informational containment, Whitehat military order, staged blackouts, media self-exposure, and E.B.S. preparation.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'The Lockdown Window is Phase Six of The Great Purge: physical and informational containment after Trigger Events, with visible Whitehat military order, staged communications blackouts, and media self-exposure. Sit with what you missed, then return to the Lockdown Window deep-dive, infographics, and video transmissions. Once the environment is secured, the E.B.S. can seize the networks and deliver absolute truth — securing the realm for ascension and reconstruction.'
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
    'Test your understanding of the Lockdown Window — Phase Six containment, Whitehat military deployment, internet blackouts, media self-exposure, and preparation for the E.B.S. truth broadcast.'
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
      t.title = TOPIC_TITLE;
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('lockdown-window not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on the Lockdown Window: Phase Six physical and informational containment, Whitehat military order, staged blackouts, and E.B.S. preparation for absolute truth.'
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
    "  { path: '/quiz/breakdown/trigger-events.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/breakdown/narrative-maintenance.html', priority: '0.75', changefreq: 'monthly' },",
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
console.log('PASS: audited 25/25 against data/breakdown-topics/lockdown-window.json');
