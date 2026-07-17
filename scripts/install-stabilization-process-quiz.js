/**
 * Installs Stabilization Process quiz for breakdown (Mega Breakdown) transmission.
 * Authored from data/breakdown-topics/stabilization-process.json report only.
 * Run: node scripts/install-stabilization-process-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/stabilization-process.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'stabilization-process';
const TOPIC_TITLE = 'Stabilization Process';
const SOURCE = 'breakdown';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const metaVoiceRe =
  /\b(according to the (report|source|text)|the report states|the source (states|specifies|suggests)|the text (states|describes|suggests|explicitly|mentions|defines|calls|focuses)|the material clarifies|mentioned in the (text|source)|source material)\b/i;

/**
 * 25 questions: [correct, wrong, wrong, wrong] — all paraphrased from this report only.
 * Support phrases must appear as substrings in the report (case-insensitive).
 */
const RAW_QUESTIONS = [
  {
    number: 1,
    question:
      'What operational bridge does the stabilization process form during the Great Awakening transition?',
    hint: 'Recall which two named phases this process joins without letting society fully collapse.',
    support: ['phase seven', 'phase eight', 'operational bridge'],
    options: [
      {
        text: 'It is the critical bridge ensuring survival and awakening from Phase Seven (E.B.S.) into Phase Eight (Aftermath and Stabilization).',
        rationale:
          'Stabilization is the operational bridge from Phase Seven (E.B.S.) to Phase Eight (Aftermath and Stabilization), keeping humanity intact through the mass reveal.'
      },
      {
        text: 'It is a temporary ceasefire treaty signed solely between competing military factions before any truth is broadcast.',
        rationale:
          'Stabilization is not a faction ceasefire treaty; it bridges E.B.S. truth release into aftermath securing of the realm.'
      },
      {
        text: 'It is a financial bailout program that restarts banks so the 3D economy can continue unchanged after disclosure.',
        rationale:
          'The process secures military, societal, and energetic levels for ascension, not a bank bailout to preserve the old economy.'
      },
      {
        text: 'It is a voluntary online poll that lets sleepers vote on whether the parasitic overlay should remain intact.',
        rationale:
          'Stabilization is executed through military, tribunal, and energetic protocols—not a public poll preserving the overlay.'
      }
    ]
  },
  {
    number: 2,
    question:
      'On which levels are stabilization protocols executed as the parasitic reality is dismantled?',
    hint: 'Three domains of action are named together in the overview of the process.',
    support: ['military, societal, and energetic'],
    options: [
      {
        text: 'On military, societal, and energetic levels as a multi-layered process securing the realm.',
        rationale:
          'Stabilization protocols run on military, societal, and energetic levels so truth can land without full-scale collapse.'
      },
      {
        text: 'Only on corporate boardrooms and stock exchanges so markets absorb the shock of disclosure alone.',
        rationale:
          'Markets are not the named layers; the process operates on military, societal, and energetic levels.'
      },
      {
        text: 'Only through academic conferences that debate the philosophy of awakening without street presence.',
        rationale:
          'Stabilization is operational and multi-layered—military protection, society, and energy—not academic debate alone.'
      },
      {
        text: 'Only through underground tunnels used exclusively for evacuating elites away from the public eye.',
        rationale:
          'The process protects civilians and secures the grid; it is not framed as elite-only tunnel evacuation.'
      }
    ]
  },
  {
    number: 3,
    question: 'What is Phase Seven (E.B.S.) in the context of stabilization?',
    hint: 'Focus on who takes over media and internet infrastructure in the public eye.',
    support: ['phase seven', 'whitehats', 'media and internet'],
    options: [
      {
        text: 'Whitehats totally take over media and internet infrastructure to broadcast truth and shatter sleepers’ false reality in one blow.',
        rationale:
          'Phase Seven (E.B.S.) is Whitehat takeover of all media and internet to broadcast truth and shatter the sleepers’ false reality.'
      },
      {
        text: 'Truth Tribunals finish every elite trial first so no media takeover or mass truth broadcast is ever needed worldwide.',
        rationale:
          'Truth Tribunals belong to Phase Eight aftermath; Phase Seven is the E.B.S. media and internet truth broadcast.'
      },
      {
        text: 'Healing Sanctuaries permanently close so sols must stabilize only in open streets without pure frequency spaces.',
        rationale:
          'Healing Sanctuaries support traumatized sols during and after the reveal; Phase Seven is the E.B.S. broadcast takeover.'
      },
      {
        text: 'The parasitic overlay is celebrated as official history, never challenged in public, and E.B.S. packages never air.',
        rationale:
          'Phase Seven shatters the false reality with truth broadcasts; it does not celebrate the parasitic overlay.'
      }
    ]
  },
  {
    number: 4,
    question: 'What is Phase Eight (Aftermath and Stabilization) dedicated to?',
    hint: 'Think tribunals, neutralization of dangerous figures, and preparation for Ascension.',
    support: ['phase eight', 'truth tribunals', 'ascension processes'],
    options: [
      {
        text: 'Securing the realm for reconstruction and Ascension Processes through Truth Tribunals and neutralizing the world’s most dangerous figures.',
        rationale:
          'Phase Eight secures the realm for reconstruction and Ascension via Truth Tribunals and neutralization of the most dangerous figures.'
      },
      {
        text: 'Handing media control back to the same corporate networks that ran the parasitic narrative for decades.',
        rationale:
          'Phase Eight secures reconstruction and justice through tribunals; it does not restore parasitic media control.'
      },
      {
        text: 'Ending all military presence so streets remain completely empty during the entire mass reveal window.',
        rationale:
          'Phase Eight uses military protection and judicial finality; it is not an empty-street withdrawal from protection.'
      },
      {
        text: 'Deleting every Truth Package so sleepers never have to face elite crimes or satanic cults.',
        rationale:
          'Phase Eight grounds the trauma of disclosure with protection and tribunals—it does not delete the truth packages.'
      }
    ]
  },
  {
    number: 5,
    question: 'Who are the Whitehats in this stabilization framework?',
    hint: 'They are described as a human front for a deeper multi-dimensional command.',
    support: ['whitehats', 'multi-dimensional command', 'mass awakening'],
    options: [
      {
        text: 'The allied human front for multi-dimensional command, dismantling infrastructure and orchestrating mass awakening without societal destruction.',
        rationale:
          'Whitehats are the allied human front for multi-dimensional command, dismantling infrastructure and guiding mass awakening without destroying society.'
      },
      {
        text: 'A purely symbolic brand name for anonymous internet forums that never dismantle infrastructure or guide mass awakening.',
        rationale:
          'Whitehats are an operational human front coordinating infrastructure dismantling and awakening, not a symbolic forum brand.'
      },
      {
        text: 'The same parasitic elites who ran the 3D illusion, simply rebranded after Phase Seven begins without losing power.',
        rationale:
          'Whitehats dismantle parasitic infrastructure and free sleepers; they are not rebranded parasitic elites.'
      },
      {
        text: 'Solo civilian influencers who replace all military and multi-dimensional command during the Lockdown Window alone.',
        rationale:
          'Whitehats work as the human front of multi-dimensional command alongside military stabilization, not solo influencer rule.'
      }
    ]
  },
  {
    number: 6,
    question: 'What are Truth Tribunals?',
    hint: 'They produce public and behind-the-scenes outcomes against the rich, powerful, and corrupt.',
    support: ['truth tribunals', 'arrests, confessions, and executions'],
    options: [
      {
        text: 'Public and behind-the-scenes proceedings resulting in arrests, confessions, and executions of rich, powerful, and corrupt elites.',
        rationale:
          'Truth Tribunals are public and behind-the-scenes proceedings that produce arrests, confessions, and executions of corrupt elites.'
      },
      {
        text: 'Private therapy circles where elites apologize privately and keep all political and financial power intact.',
        rationale:
          'Tribunals end in arrests, confessions, and executions—not private apologies that leave elite power untouched.'
      },
      {
        text: 'Media talk shows that debate corruption hypothetically without any arrests or judicial finality.',
        rationale:
          'Truth Tribunals deliver absolute judicial finality through arrests and related outcomes, not empty talk-show debate.'
      },
      {
        text: 'Military drills that rehearse lockdowns without ever naming or neutralizing dangerous figures.',
        rationale:
          'Tribunals specifically neutralize dangerous elites through arrests, confessions, and executions, not drills alone.'
      }
    ]
  },
  {
    number: 7,
    question: 'Who are Sleepers in this context?',
    hint: 'Their entrenchment in the 3D illusion and need for disclosure shock define them.',
    support: ['sleepers', '3d parasitic illusion', 'disclosure'],
    options: [
      {
        text: 'Human vessels deeply entrenched in the 3D parasitic illusion who require the shock of the disclosure phases to awaken.',
        rationale:
          'Sleepers are human vessels deep in the 3D parasitic illusion who need the shock of disclosure phases to awaken.'
      },
      {
        text: 'Fully awakened Resonating Army commanders who already run every Truth Tribunal from day one.',
        rationale:
          'Sleepers are still entrenched in the 3D illusion; they are not already-awake tribunal commanders.'
      },
      {
        text: 'Non-physical plasma beings who never incarnate into human vessels during the transition.',
        rationale:
          'Sleepers are human vessels in the 3D illusion, not non-physical beings outside incarnation.'
      },
      {
        text: 'Cloned elites used only as optical stand-ins with no capacity to awaken through disclosure.',
        rationale:
          'Sleepers are human vessels who can awaken through disclosure shock; clones describe neutralized elite optics, not sleepers.'
      }
    ]
  },
  {
    number: 8,
    question: 'What are Healing Sanctuaries built from, and what purpose do they serve?',
    hint: 'Materials of pure frequency and the need to rest traumatized sols are named together.',
    support: ['healing sanctuaries', 'light, sound, and living crystal', 'stabilize their vibration'],
    options: [
      {
        text: 'Pure frequency spaces of light, sound, and living crystal where traumatized sols rest and stabilize their vibration.',
        rationale:
          'Healing Sanctuaries are pure frequency spaces of light, sound, and living crystal where traumatized sols rest and stabilize.'
      },
      {
        text: 'Concrete military bunkers stocked with synthetic drugs that force sleepers back into deep amnesia.',
        rationale:
          'Sanctuaries use light, sound, and living crystal for vibrational rest—not concrete bunkers enforcing amnesia.'
      },
      {
        text: 'Corporate wellness offices that teach productivity techniques while the parasitic overlay stays online.',
        rationale:
          'Healing Sanctuaries are crystalline frequency halls for trauma recovery, not corporate productivity offices.'
      },
      {
        text: 'Temporary online chat rooms with no physical or energetic architecture for the body or light body.',
        rationale:
          'Sanctuaries are built frequency spaces of light, sound, and living crystal, not mere online chat rooms.'
      }
    ]
  },
  {
    number: 9,
    question: 'How is Phase Seven described as the “Flood Gates” of disclosure?',
    hint: 'Undeniable proof categories released in that flood are listed together.',
    support: ['flood gates', 'elite corruption', 'child trafficking'],
    options: [
      {
        text: 'It releases undeniable proof of elite corruption, child trafficking, and satanic cults in one overwhelming wave.',
        rationale:
          'Phase Seven as Flood Gates releases undeniable proof of elite corruption, child trafficking, and satanic cults.'
      },
      {
        text: 'It releases only weather forecasts and sports scores so the public never faces elite crimes.',
        rationale:
          'Flood Gates push shattering truth about elite crimes and cults, not trivial weather and sports content.'
      },
      {
        text: 'It seals every archive so that proof of trafficking and cults can never reach public awareness.',
        rationale:
          'Flood Gates open proof outward; they do not seal archives against the mass reveal.'
      },
      {
        text: 'It floods cities with physical water as a literal natural disaster unrelated to truth broadcasts.',
        rationale:
          '“Flood Gates” is the metaphor for truth release through E.B.S., not a literal water disaster.'
      }
    ]
  },
  {
    number: 10,
    question:
      'How does Phase Eight ground the trauma created by the Phase Seven disclosure flood?',
    hint: 'Two pillars of grounding are named: protection on the ground and judicial finality.',
    support: ['military protection', 'truth tribunals', 'phase eight'],
    options: [
      {
        text: 'Through direct military protection and absolute judicial finality via the Truth Tribunals.',
        rationale:
          'Phase Eight grounds trauma with direct military protection and absolute judicial finality through Truth Tribunals.'
      },
      {
        text: 'By immediately ending all broadcasts and pretending the Flood Gates content was fiction.',
        rationale:
          'Phase Eight stabilizes after truth lands; it does not erase the Flood Gates content as fiction.'
      },
      {
        text: 'By asking elites to write voluntary essays without arrests, confessions, or executions.',
        rationale:
          'Grounding includes tribunal finality with arrests and related outcomes, not voluntary essays alone.'
      },
      {
        text: 'By removing every soldier from public view so civilians face chaos without a pause button.',
        rationale:
          'Military protection and lockdowns keep chaos low; Phase Eight does not abandon street presence.'
      }
    ]
  },
  {
    number: 11,
    question:
      'How were the most dangerous elements of the power structure handled before phases went fully public?',
    hint: 'Optical replacements bought time to position assets and secure the grid.',
    support: ['clones', 'holographic projections', 'mimic tech'],
    options: [
      {
        text: 'They were neutralized in advance and replaced with clones, holographic projections, and advanced mimic tech.',
        rationale:
          'Dangerous elements were neutralized early and replaced with clones, holographic projections, and mimic tech to buy the needed time window.'
      },
      {
        text: 'They were left fully in power until the last public minute so no optical cover ever hid their removal from the stage.',
        rationale:
          'Neutralization and optical replacements happened in advance, not as a last-minute surprise with no cover.'
      },
      {
        text: 'They voluntarily retired to remote islands with full wealth intact and no tribunals or judicial consequences planned.',
        rationale:
          'Dangerous figures face neutralization and later tribunals; early cover used clones and mimic tech, not peaceful elite retirement.'
      },
      {
        text: 'They were converted into Ground Healers who run Crystal Halls and Water Domes during soul stabilization.',
        rationale:
          'Ground Healers serve traumatized sols in sanctuaries; neutralized elites are not described as becoming healers.'
      }
    ]
  },
  {
    number: 12,
    question: 'What purpose did the optical illusion of still-present elites serve?',
    hint: 'Time for assets and grid security before the 3D realm’s controlled collapse.',
    support: ['time window', 'position assets', 'secure the grid'],
    options: [
      {
        text: 'It bought the exact time window needed to position assets and secure the grid so the 3D collapse would be controlled rather than apocalyptic.',
        rationale:
          'The optical illusion bought time to position assets and secure the grid, making the 3D collapse controlled rather than apocalyptic.'
      },
      {
        text: 'It was meant to permanently preserve parasitic rule by never allowing any truth broadcast at all.',
        rationale:
          'The cover prepared a controlled transition into disclosure and stabilization, not permanent parasitic rule without truth.'
      },
      {
        text: 'It entertained sleepers with celebrity holograms unrelated to neutralizing dangerous power structures.',
        rationale:
          'Clones and mimic tech replaced neutralized dangerous elements for operational timing, not mere celebrity entertainment.'
      },
      {
        text: 'It trained the public to reject all military protection during the Lockdown Window as unnecessary.',
        rationale:
          'The optical window supports a controlled transition; lockdowns still protect civilians during the reveal.'
      }
    ]
  },
  {
    number: 13,
    question: 'What is the Lockdown Window during the culmination of these phases?',
    hint: 'Military enforcement with a purpose opposite to parasitic control mechanisms.',
    support: ['lockdown', 'military stabilization protocol', 'global pause'],
    options: [
      {
        text: 'A military stabilization protocol that protects civilians, keeps chaos low, and acts as a global pause button so the public can absorb truth packages.',
        rationale:
          'The Lockdown Window is military stabilization for civilian protection and low chaos—a global pause for absorbing truth packages.'
      },
      {
        text: 'A parasitic control mechanism designed solely to harvest loosh while blocking every path to truth.',
        rationale:
          'Unlike parasitic control, this lockdown is a military stabilization protocol for protection and truth absorption.'
      },
      {
        text: 'An optional holiday where governments shut down only theme parks and leave all media fully open.',
        rationale:
          'Lockdowns are enforced military stabilization across the transition, not a limited theme-park holiday.'
      },
      {
        text: 'A permanent underground exile that moves every civilian into sealed bunkers with no truth delivery.',
        rationale:
          'The window is a protective pause for receiving truth packages, not permanent bunker exile without disclosure.'
      }
    ]
  },
  {
    number: 14,
    question:
      'How is narrative and truth delivery sequenced in the initial hours of the broadcast?',
    hint: 'Reassurance and soft truths come before the hardest evidence.',
    support: ['soft truths', 'harder evidence', 'immediate reassurance'],
    options: [
      {
        text: 'Military-protection reassurance first, then soft truths, then harder elite-crime evidence so the public does not collapse in trauma at once.',
        rationale:
          'Initial hours reassure with military protection, deliver soft truths first, then harder elite-crime evidence to avoid immediate trauma collapse.'
      },
      {
        text: 'Hardest elite crimes are dumped first with no military reassurance, then soft truths, then permanent broadcast silence forever.',
        rationale:
          'Sequencing is reassurance and soft truths before harder evidence—not hardest content first with no protection message.'
      },
      {
        text: 'Only sports and entertainment continue for days so no one ever hears military protection messaging or tribunal outcomes.',
        rationale:
          'Broadcast hours center protection messaging and graduated truth, not endless sports without disclosure.'
      },
      {
        text: 'All truth is withheld until Truth Tribunals finish every case years later, with no public E.B.S. broadcast window at all.',
        rationale:
          'E.B.S. delivers sequenced truth packages during the mass reveal window, not total silence until years of private trials.'
      }
    ]
  },
  {
    number: 15,
    question:
      'What agents are sprayed into the skies for Atmospheric Frequency Balancing?',
    hint: 'Two named materials buffer electromagnetic fields and support the pineal gland.',
    support: ['monatomic gold', 'silica crystals', 'o.r.m.e'],
    options: [
      {
        text: 'Monatomic Gold (O.R.M.E.s) and Silica Crystals (Micro-Structured Quartz) acting as frequency buffers.',
        rationale:
          'Skies are sprayed with Monatomic Gold (O.R.M.E.s) and Silica Crystals (Micro-Structured Quartz) as frequency buffers.'
      },
      {
        text: 'Only industrial smog and diesel exhaust intended to lower all consciousness permanently.',
        rationale:
          'Atmospheric balancing uses Monatomic Gold and Silica Crystals as buffers, not industrial exhaust for permanent lowering.'
      },
      {
        text: 'Pure water vapor alone with no monatomic or crystalline frequency materials involved.',
        rationale:
          'Named agents include Monatomic Gold (O.R.M.E.s) and Silica Crystals, not water vapor alone.'
      },
      {
        text: 'Radioactive waste powders meant to burn out the pineal gland before cosmic plasma arrives.',
        rationale:
          'These agents raise pineal conductivity to handle cosmic plasma; they are not radioactive waste burning out the gland.'
      }
    ]
  },
  {
    number: 16,
    question:
      'What effects do these atmospheric frequency buffers produce in the human field?',
    hint: 'Electromagnetic rebalancing and pineal conductivity are both named.',
    support: ['electromagnetic fields', 'pineal gland', 'cosmic plasma'],
    options: [
      {
        text: 'They rebalance electromagnetic fields and raise pineal conductivity so nervous systems can handle incoming cosmic plasma.',
        rationale:
          'Buffers rebalance electromagnetic fields and raise pineal conductivity to handle cosmic plasma as the 3D overlay fractures.'
      },
      {
        text: 'They permanently seal the pineal gland shut so no cosmic plasma or higher frequency can ever be perceived.',
        rationale:
          'Buffers raise pineal conductivity for plasma handling; they do not seal the gland shut.'
      },
      {
        text: 'They erase all memory of elite crimes so Truth Tribunals become unnecessary after the atmospheric sprays.',
        rationale:
          'Atmospheric balancing softens nervous-system shock; it does not erase truth or cancel tribunals.'
      },
      {
        text: 'They only tint cloud color for visual spectacle with no effect on electromagnetic fields or the pineal gland.',
        rationale:
          'The sprays are frequency buffers for EM fields and pineal conductivity, not mere cloud cosmetics.'
      }
    ]
  },
  {
    number: 17,
    question:
      'Which sanctuary types receive traumatized sols for Energetic Soul Stabilization?',
    hint: 'Three named halls of pure frequency are listed together.',
    support: ['water domes', 'crystal halls', 'star pods'],
    options: [
      {
        text: 'Water Domes, Crystal Halls, and Star Pods, where Ground Healers monitor sols until vibration fully stabilizes.',
        rationale:
          'Traumatized sols are guided into Healing Sanctuaries such as Water Domes, Crystal Halls, and Star Pods under Ground Healer care.'
      },
      {
        text: 'Only concrete hospitals stocked with synthetic pharmaceuticals and no crystalline architecture.',
        rationale:
          'Soul stabilization uses Water Domes, Crystal Halls, and Star Pods—pure frequency spaces—not only concrete hospitals.'
      },
      {
        text: 'Only outer-dome war zones where sols are left without healers until the overlay fully returns.',
        rationale:
          'Sols are guided into sanctuaries with Ground Healers, not abandoned in war zones without care.'
      },
      {
        text: 'Only digital simulation pods that replay the 3D parasitic illusion until awakening is forgotten.',
        rationale:
          'Sanctuaries restore vibration with light, sound, and living crystal; they do not reinstate the parasitic illusion.'
      }
    ]
  },
  {
    number: 18,
    question:
      'How long does a soul stay in the transition halls during energetic stabilization?',
    hint: 'Duration is tied to vibration, not a fixed calendar sentence.',
    support: ['as long as needed', 'vibration fully stabilizes'],
    options: [
      {
        text: 'Only as long as needed until their vibration fully stabilizes.',
        rationale:
          'A soul stays in transition halls only as long as needed until vibration fully stabilizes.'
      },
      {
        text: 'A mandatory life sentence with no exit even after full vibrational recovery.',
        rationale:
          'Stay length ends when vibration stabilizes; it is not an endless mandatory life sentence.'
      },
      {
        text: 'Exactly one synchronized global minute for every soul regardless of trauma depth.',
        rationale:
          'Duration matches individual need until full stabilization, not a single fixed global minute.'
      },
      {
        text: 'Until they agree to return to full sleeper status inside the parasitic overlay forever.',
        rationale:
          'Sanctuaries stabilize vibration for freedom through the transition, not re-enrollment as permanent sleepers.'
      }
    ]
  },
  {
    number: 19,
    question:
      'What becomes visible as false constructs vanish during the linked collapse of the parasitic overlay?',
    hint: 'A true structural architecture begins to bleed through.',
    support: ['great dome', 'crystalline architecture', 'false constructs'],
    options: [
      {
        text: 'The true Great Dome and its underlying crystalline architecture bleed through as false constructs vanish.',
        rationale:
          'As false constructs vanish, the true Great Dome and underlying crystalline architecture bleed through.'
      },
      {
        text: 'A permanent blank void with no dome, grid, or crystalline structure of any kind remains.',
        rationale:
          'Collapse reveals the Great Dome and crystalline architecture, not a permanent empty void.'
      },
      {
        text: 'Only stronger parasitic skyscrapers built overnight to replace every shattered false construct.',
        rationale:
          'False constructs vanish so true crystalline architecture shows through—not stronger parasitic skyscrapers.'
      },
      {
        text: 'A single paper map of old national borders with no energetic architecture behind it.',
        rationale:
          'What bleeds through is the Great Dome’s crystalline architecture, not a paper map of old borders alone.'
      }
    ]
  },
  {
    number: 20,
    question:
      'What role does Ikaij play in overseeing stabilization from above?',
    hint: 'Navigation of currents and plasma resonance against parasite remnants.',
    support: ['ikaij', 'navigator of the currents', 'plasma resonance'],
    options: [
      {
        text: 'Ikaij acts as a navigator of the currents, adjusting plasma-resonance flows so parasite remnants cannot regroup in the outer domes.',
        rationale:
          'Ikaij navigates the currents and adjusts plasma resonance so parasite remnants cannot regroup in the outer domes.'
      },
      {
        text: 'Ikaij broadcasts only sports programming during Phase Seven and ignores plasma currents entirely.',
        rationale:
          'Ikaij oversees energetic currents and plasma resonance for stabilization, not sports-only programming.'
      },
      {
        text: 'Ikaij rebuilds the parasitic overlay brick by brick after the E.B.S. window closes.',
        rationale:
          'Ikaij prevents parasite remnants from regrouping; the work supports overlay collapse, not parasitic rebuild.'
      },
      {
        text: 'Ikaij replaces all Whitehats and military forces as the sole human street commander worldwide.',
        rationale:
          'Ikaij works from above on plasma currents; Whitehats and military still execute ground stabilization.'
      }
    ]
  },
  {
    number: 21,
    question:
      'For those still anchored in the slower 3D field, what appears to happen to familiar structures?',
    hint: 'Surface appearance versus behind-the-scenes stabilization.',
    support: ['dissolve into rubble', 'slower 3d field', 'stabilized behind the scenes'],
    options: [
      {
        text: 'Familiar structures appear to dissolve into rubble, yet the temporary reality is highly stabilized behind the scenes by benevolent intelligences.',
        rationale:
          'To 3D-anchored people, structures seem to dissolve into rubble, while benevolent intelligences stabilize the temporary reality behind the scenes.'
      },
      {
        text: 'Every familiar structure becomes permanently indestructible steel with no sense of change at all.',
        rationale:
          'Familiar structures appear to dissolve into rubble for those in the slower 3D field, not freeze as indestructible steel.'
      },
      {
        text: 'All structures instantly become full Crystal Halls with no rubble appearance and no need for guides.',
        rationale:
          'Those still in slower 3D may see rubble-like dissolution while guides stabilize; not everyone instantly inhabits Crystal Halls.'
      },
      {
        text: 'Nothing changes visually while parasites openly celebrate total victory in the streets.',
        rationale:
          'False constructs vanish and structures can appear to dissolve; stabilization counters chaos rather than parasitic street victory.'
      }
    ]
  },
  {
    number: 22,
    question:
      'Who helps stabilize the environment as a healing phase rather than a punitive one for those in slower 3D?',
    hint: 'Benevolent teams offering subtle guidance and calm are named.',
    support: ['benevolent intelligences', 'solar families', 'healing phase'],
    options: [
      {
        text: 'Benevolent intelligences, solar families, and guides who provide subtle guidance and moments of calm.',
        rationale:
          'Benevolent intelligences, solar families, and guides stabilize behind the scenes so the environment acts as a healing phase, not a punitive one.'
      },
      {
        text: 'Only neutralized elite clones who punish every sleeper for watching E.B.S. broadcasts instead of offering calm.',
        rationale:
          'Stabilization for 3D-anchored people comes from benevolent intelligences and guides, not punitive elite clones.'
      },
      {
        text: 'Random street mobs with no solar families, guides, or multi-dimensional oversight calming the field at all.',
        rationale:
          'Named stabilizers include benevolent intelligences, solar families, and guides—not random mobs without oversight.'
      },
      {
        text: 'Automated banking algorithms that score souls financially instead of offering subtle guidance and calm.',
        rationale:
          'Support is subtle guidance and calm from intelligences and solar families, not financial scoring algorithms.'
      }
    ]
  },
  {
    number: 23,
    question:
      'What would executing Phase Seven without immediate Phase Eight stabilization produce?',
    hint: 'Strategic implications name the catastrophic failure mode clearly.',
    support: ['planetary madness', 'phase seven', 'phase eight'],
    options: [
      {
        text: 'Planetary madness and destruction of the human sols meant to be freed.',
        rationale:
          'Phase Seven without immediate Phase Eight stabilization would yield planetary madness and destroy the sols meant to be freed.'
      },
      {
        text: 'A smoother awakening with no need for military presence, tribunals, or atmospheric buffers.',
        rationale:
          'Without Phase Eight, the outcome is madness and destruction—not a smoother path that skips stabilization tools.'
      },
      {
        text: 'Automatic permanent victory for the parasitic overlay with full restoration of elite media control.',
        rationale:
          'The failure mode is planetary madness harming sols to be freed; the design pairs E.B.S. with stabilization to shatter parasitic control.'
      },
      {
        text: 'Instant crystalline reality for everyone with zero trauma and zero need for Healing Sanctuaries.',
        rationale:
          'Skipping Phase Eight causes trauma-scale madness; sanctuaries and stabilization exist because the threshold is dangerous.'
      }
    ]
  },
  {
    number: 24,
    question:
      'Which forces successfully guide humanity through the most dangerous threshold of the Awakening when timing is correct?',
    hint: 'A human front and a resonating collective are named together.',
    support: ['whitehats', 'resonating army', 'dangerous threshold'],
    options: [
      {
        text: 'The Whitehats and the Resonating Army, timing E.B.S. broadcasts with military presence, Truth Tribunals, and atmospheric frequency buffers.',
        rationale:
          'Whitehats and the Resonating Army guide humanity through the threshold by timing E.B.S. with military presence, tribunals, and atmospheric buffers.'
      },
      {
        text: 'Only parasitic elites using mimic tech to cancel every broadcast and every tribunal forever.',
        rationale:
          'Guidance through the threshold is by Whitehats and the Resonating Army, not parasitic elites canceling truth.'
      },
      {
        text: 'Unorganized sleepers alone with no Whitehat, military, or multi-dimensional support structure.',
        rationale:
          'Successful passage requires Whitehats and the Resonating Army coordinating protection and truth—not sleepers alone.'
      },
      {
        text: 'A single corporate news network that never yields infrastructure to any Whitehat takeover.',
        rationale:
          'Phase Seven is Whitehat takeover of media infrastructure; success is not a single parasitic network staying in control.'
      }
    ]
  },
  {
    number: 25,
    question:
      'What ultimate outcome does this balanced stabilization operation secure for Earth?',
    hint: 'Think shatter of parasitic systems and return to high-vibration crystalline reality.',
    support: ['crystalline reality', 'parasitic control systems', 'high-vibration'],
    options: [
      {
        text: 'It completely shatters parasitic control systems while permanently securing Earth for return to an integrated, high-vibration crystalline reality.',
        rationale:
          'The balanced operation shatters parasitic control and permanently secures Earth for return to integrated high-vibration crystalline reality.'
      },
      {
        text: 'It permanently freezes Earth inside denser 3D amnesia with no path back to crystalline integration.',
        rationale:
          'Stabilization frees Earth toward high-vibration crystalline reality; it does not freeze denser amnesia forever.'
      },
      {
        text: 'It hands the realm permanently to parasite remnants regrouping unopposed in the outer domes.',
        rationale:
          'Plasma-current oversight and Phase Eight securing block remnant regrouping; the goal is crystalline return, not parasite victory.'
      },
      {
        text: 'It ends all Ascension Processes so reconstruction never begins after the tribunals close.',
        rationale:
          'Phase Eight secures the realm for reconstruction and Ascension Processes, not the cancellation of ascension.'
      }
    ]
  }
];

function buildQuestions() {
  return RAW_QUESTIONS.map((q) => {
    const correct = q.options[0];
    const rawOptions = q.options.map((o, i) => ({
      text: o.text,
      isCorrect: i === 0,
      rationale: o.rationale
    }));

    const finalized = finalizeOptions(rawOptions, `${TOPIC_ID}-${q.number}`);

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

    if (out.options.length !== 4) {
      throw new Error(`Q${q.number}: need 4 options`);
    }
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

const topicImage = 'images/breakdown/stabilization-process.webp';
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
    'Test your grasp of the Stabilization Process — Phase Seven E.B.S. into Phase Eight, Truth Tribunals, lockdowns, atmospheric frequency buffers, Healing Sanctuaries, and securing Earth for crystalline return.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'The Stabilization Process is the operational bridge from Phase Seven’s Flood Gates of truth into Phase Eight’s military protection, Truth Tribunals, atmospheric frequency buffers, and Healing Sanctuaries. Sit with what you missed, then return to the Stabilization Process deep-dive, infographics, and video transmissions. Whitehats and the Resonating Army time this threshold so parasitic control shatters while Earth is secured for integrated high-vibration crystalline reality.'
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
    'Test your understanding of the Stabilization Process — Phase Seven to Phase Eight bridge, Truth Tribunals, Lockdown Window, atmospheric buffers, Healing Sanctuaries, and crystalline return.'
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
  throw new Error('stabilization-process not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on the Stabilization Process: Phase Seven E.B.S. into Phase Eight, Truth Tribunals, lockdowns, atmospheric frequency buffers, and securing crystalline return.'
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
  'PASS: audited 25/25 against data/breakdown-topics/stabilization-process.json'
);
