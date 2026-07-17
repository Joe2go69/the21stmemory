/**
 * Installs Truth Disclosure quiz for breakdown (Mega Breakdown) transmission.
 * All 25 items authored from and audited against data/breakdown-topics/truth-disclosure.json only.
 * Run: node scripts/install-truth-disclosure-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/truth-disclosure.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'truth-disclosure';
const TOPIC_TITLE = 'Truth Disclosure';
const SOURCE = 'breakdown';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const metaVoiceRe =
  /\b(according to the (report|source|text)|the report states|the source (states|specifies|suggests)|the text (states|describes|suggests|explicitly|mentions)|source material)\b/i;

/** Support phrases grounded only in truth-disclosure.json report. */
const supportPhrases = {
  1: ['phase seven', 'phase eight', 'great awakening', 'absolute truth'],
  2: ['false reality', 'planetary hijacking', 'global narrative'],
  3: ['communication networks', 'military lockdown', 'elite crimes'],
  4: ['3d overlay', 'solar families', 'disclosure protocol'],
  5: ['e.b.s.', 'emergency broadcast system', 'communications blackout'],
  6: ['whitehats', 'public eye', 'systemic parasites'],
  7: ['truth packages', '72 hours', 'evidentiary broadcasts'],
  8: ['truth tribunals', 'confessions', 'executions'],
  9: ['sleepers', '3d perception overlay', 'societal collapse'],
  10: ['seeded sols', 'elite bloodlines', 'inside out'],
  11: ['single, devastating blow', 'false reality'],
  12: ['election fraud', 'child trafficking', 'satanic cult'],
  13: ['draco-grey', 'royal families', 'popes', 'presidents'],
  14: ['toxic injections', 'mmr', 'covid', 'depopulation'],
  15: ['princess diana', 'barron trump', 'jfk jnr'],
  16: ['internet', 'television', 'mobile', 'npc'],
  17: ['soft truths', 'harder truths', '72+ hours'],
  18: ['protective military stabilization', 'chaos low'],
  19: ['cloning', 'mimic tech', 'neutralized in earlier phases'],
  20: ['scare events', 'project bluebeam', 'ww3'],
  21: ['ignore the broadcasts', 'prior shaking'],
  22: ['sky opening', 'motherships', 'hostile alien invasion'],
  23: ['reconstruction', 'ascension processes', 'energy harvest'],
  24: ['resonating sols', 'living anchors', 'harmonic tone'],
  25: ['crystalline reality', 'solar families', 'false layers']
};

const RAW_QUESTIONS = [
  {
    number: 1,
    question: 'What do Phase Seven and Phase Eight represent in the Great Awakening?',
    hint: 'Climax operation using absolute truth to secure the realm for ascension.',
    options: [
      {
        text: 'The climax of the Great Awakening—a controlled operation that permanently shatters the parasitic illusion through absolute truth and secures the realm for ascension processes.',
        isCorrect: true,
        rationale:
          'Phase Seven and Phase Eight represent the climax of the Great Awakening, designed to permanently shatter the parasitic illusion through absolute truth and secure the realm for ascension processes.'
      },
      {
        text: 'Only the first secret elite dinner with no absolute-truth climax or ascension-security role.',
        isCorrect: false,
        rationale:
          'Seven and Eight are the disclosure climax, not a private elite dinner without public truth.'
      },
      {
        text: 'Only permanent Cabal narrative control with no shattering of parasitic illusion at all.',
        isCorrect: false,
        rationale:
          'The sequence dismantles false reality and replaces controlled narrative with proof of planetary hijacking.'
      },
      {
        text: 'Only a cancelled plan that never stabilizes the physical and energetic grid for disclosure.',
        isCorrect: false,
        rationale:
          'Light forces stabilize physical and energetic grid through lockdown, network severing, and evidence broadcasts.'
      }
    ]
  },
  {
    number: 2,
    question: 'What does the Truth Disclosure sequence do to the masses’ false reality?',
    hint: 'Replace tightly controlled global narrative with proof of planetary hijacking.',
    options: [
      {
        text: 'It systematically dismantles false reality, replacing a tightly controlled global narrative with undeniable proof of planetary hijacking.',
        isCorrect: true,
        rationale:
          'The sequence systematically dismantles the false reality of the masses, replacing a tightly controlled global narrative with undeniable proof of planetary hijacking.'
      },
      {
        text: 'It permanently strengthens the controlled global narrative so planetary hijacking stays forever hidden.',
        isCorrect: false,
        rationale:
          'Disclosure replaces controlled narrative with undeniable proof of planetary hijacking.'
      },
      {
        text: 'It only edits sports headlines with no dismantling of false reality or hijacking evidence.',
        isCorrect: false,
        rationale:
          'Core work is dismantling false reality and proving planetary hijacking through evidentiary broadcasts.'
      },
      {
        text: 'It only restores NPC media twisting with no military or light-force stabilization role.',
        isCorrect: false,
        rationale:
          'Cabal NPC media is cut off; only the military emergency channel broadcasts truth.'
      }
    ]
  },
  {
    number: 3,
    question: 'How do light forces stabilize the physical and energetic grid during disclosure?',
    hint: 'Name network severing, military lockdown, and elite-crime broadcasts.',
    options: [
      {
        text: 'By severing old communication networks, executing coordinated military lockdown, and broadcasting irrefutable evidence of elite crimes.',
        isCorrect: true,
        rationale:
          'By severing old communication networks, executing coordinated military lockdown, and broadcasting irrefutable evidence of elite crimes, light forces stabilize the physical and energetic grid.'
      },
      {
        text: 'By restoring Cabal media fully and cancelling all military lockdowns and elite-crime evidence.',
        isCorrect: false,
        rationale:
          'Old networks are severed and elite crimes are broadcast under protective military stabilization.'
      },
      {
        text: 'By only posting anonymous rumors with no network cut, lockdown, or irrefutable evidence stream.',
        isCorrect: false,
        rationale:
          'Disclosure uses absolute control: communications cut, military lockdown, and sequenced evidentiary packages.'
      },
      {
        text: 'By only delaying all truth until after solar families land without any grid stabilization first.',
        isCorrect: false,
        rationale:
          'Disclosure protocol paves the way for solar-family arrival after grid stabilization and truth absorption.'
      }
    ]
  },
  {
    number: 4,
    question: 'What larger outcomes does this precise disclosure protocol prepare?',
    hint: 'Connect 3D overlay collapse to safe public arrival of true solar families.',
    options: [
      {
        text: 'Total collapse of the 3D overlay and the safe, public arrival of the true solar families.',
        isCorrect: true,
        rationale:
          'This precise disclosure protocol paves the way for total collapse of the 3D overlay and the safe, public arrival of the true solar families.'
      },
      {
        text: 'Permanent thickening of the 3D overlay and permanent ban on any solar-family public arrival.',
        isCorrect: false,
        rationale:
          'Protocol enables overlay collapse and safe public solar-family arrival, not permanent thickening.'
      },
      {
        text: 'Only private elite retreats with no public path for crystalline reality to emerge.',
        isCorrect: false,
        rationale:
          'Strategic end-state includes original crystalline reality emerging and true solar families landing safely.'
      },
      {
        text: 'Only Project Bluebeam holograms treated as the final permanent destination of ascension.',
        isCorrect: false,
        rationale:
          'Bluebeam is a prior scare event; disclosure bridges to Sky Opening and true craft, not permanent holograms.'
      }
    ]
  },
  {
    number: 5,
    question: 'What is the E.B.S. during the communications blackout?',
    hint: 'Sole active military-controlled transmission network for truth delivery.',
    options: [
      {
        text: 'The Emergency Broadcast System—the sole active military-controlled transmission network deployed during the communications blackout to deliver truth directly to the population.',
        isCorrect: true,
        rationale:
          'E.B.S. is the Emergency Broadcast System, the sole active military-controlled transmission network during the communications blackout delivering truth directly to the population.'
      },
      {
        text: 'A Cabal entertainment channel that remains one of many competing networks during the blackout.',
        isCorrect: false,
        rationale:
          'Only the military emergency channel remains online; E.B.S. is sole active truth transmission.'
      },
      {
        text: 'A five-minute weather loop with no military control and no direct truth delivery role.',
        isCorrect: false,
        rationale:
          'E.B.S. delivers continuous sequenced truth packages over 72+ hours under military control.'
      },
      {
        text: 'Only a post-ascension museum exhibit with no live blackout deployment function.',
        isCorrect: false,
        rationale:
          'E.B.S. is deployed live during blackout as the disclosure transmission system.'
      }
    ]
  },
  {
    number: 6,
    question: 'Who are the Whitehats in this disclosure framework?',
    hint: 'Allied military and light forces operating in the public eye.',
    options: [
      {
        text: 'Allied military and light forces operating in the public eye to orchestrate disclosure, dismantle infrastructure, and neutralize the most dangerous systemic parasites.',
        isCorrect: true,
        rationale:
          'Whitehats are allied military and light forces operating in the public eye to orchestrate the disclosure timeline, dismantle infrastructure, and neutralize the most dangerous systemic parasites.'
      },
      {
        text: 'Only Cabal NPC media hosts who keep twisting narrative during the blackout without military role.',
        isCorrect: false,
        rationale:
          'NPC media is cut off; Whitehats run disclosure and neutralize systemic parasites publicly.'
      },
      {
        text: 'Only Sleepers with no military or light-force role in orchestrating disclosure timelines.',
        isCorrect: false,
        rationale:
          'Sleepers are guided through trauma; Whitehats orchestrate disclosure and stabilization.'
      },
      {
        text: 'Only Draco-Grey handlers still fully running every elite without any neutralization campaign.',
        isCorrect: false,
        rationale:
          'Draco-Grey influence is exposed; Whitehats neutralize dangerous systemic parasites.'
      }
    ]
  },
  {
    number: 7,
    question: 'What are Truth Packages?',
    hint: 'Duration and content of sequenced evidentiary broadcasts about the elite.',
    options: [
      {
        text: 'Over 72 hours of undeniable, carefully sequenced evidentiary broadcasts detailing the crimes, true nature, and alien influence of the ruling elite.',
        isCorrect: true,
        rationale:
          'Truth Packages are over 72 hours of undeniable, carefully sequenced evidentiary broadcasts detailing the crimes, true nature, and alien influence of the ruling elite.'
      },
      {
        text: 'Five minutes of optional rumors with no sequencing and no elite-crime evidentiary design.',
        isCorrect: false,
        rationale:
          'Packages run over 72+ hours as carefully sequenced undeniable evidentiary broadcasts.'
      },
      {
        text: 'Only corporate ads praising elites with no alien-influence or crime documentation content.',
        isCorrect: false,
        rationale:
          'Content details elite crimes, true nature, and alien influence—not corporate praise.'
      },
      {
        text: 'Only classified files never broadcast to the population during any blackout window.',
        isCorrect: false,
        rationale:
          'Truth packages are broadcast to the population via E.B.S. during the disclosure window.'
      }
    ]
  },
  {
    number: 8,
    question: 'What are Truth Tribunals established to do?',
    hint: 'Public and classified justice, confessions, arrests, and executions of operators.',
    options: [
      {
        text: 'Execute justice, secure confessions, and formalize arrests or executions of rich, powerful, and famous operators of the parasitic system—publicly and in classified proceedings.',
        isCorrect: true,
        rationale:
          'Truth Tribunals are public and classified proceedings established to execute justice, secure confessions, and formalize arrests or executions of rich, powerful, and famous operators of the parasitic system.'
      },
      {
        text: 'Only award medals to parasitic operators with no confessions, arrests, or executions.',
        isCorrect: false,
        rationale:
          'Tribunals process dangerous entities through arrests, confessions, and executions.'
      },
      {
        text: 'Only soft-truth safety messages with no formal justice process after the E.B.S. shock.',
        isCorrect: false,
        rationale:
          'Soft truths start broadcasts; tribunals are Phase Eight justice after E.B.S. shock.'
      },
      {
        text: 'Only private corporate mediation that permanently shields famous operators from justice.',
        isCorrect: false,
        rationale:
          'Tribunals formalize justice against parasitic operators, not permanent shielding.'
      }
    ]
  },
  {
    number: 9,
    question: 'Who are the Sleepers in Truth Disclosure?',
    hint: 'Consciousness in the 3D overlay guided through trauma without total collapse.',
    options: [
      {
        text: 'Human consciousness trapped in the parasitic 3D perception overlay who must be guided through disclosure trauma without triggering complete societal collapse.',
        isCorrect: true,
        rationale:
          'Sleepers are human consciousness currently trapped in the parasitic 3D perception overlay, who must be guided through disclosure trauma without triggering complete societal collapse.'
      },
      {
        text: 'Whitehat commanders already outside the overlay and immune to any disclosure trauma dynamics.',
        isCorrect: false,
        rationale:
          'Whitehats orchestrate disclosure; Sleepers are the trapped population being guided.'
      },
      {
        text: 'Only NPC media avatars with no human consciousness trapped in 3D perception overlay.',
        isCorrect: false,
        rationale:
          'Sleepers are human consciousness in the overlay; NPC media is cut off from twisting narrative.'
      },
      {
        text: 'Only Seeded Sols who never experience shock and never need guided trauma management.',
        isCorrect: false,
        rationale:
          'Seeded Sols fracture the grid from inside bloodlines; Sleepers need guided disclosure.'
      }
    ]
  },
  {
    number: 10,
    question: 'Who are Seeded Sols in this framework?',
    hint: 'High-frequency souls placed in elite bloodlines to fracture control from inside.',
    options: [
      {
        text: 'High-frequency souls covertly placed within elite bloodlines to fracture the parasitic control grid from the inside out.',
        isCorrect: true,
        rationale:
          'Seeded Sols are high-frequency souls covertly placed within elite bloodlines to fracture the parasitic control grid from the inside out.'
      },
      {
        text: 'Only Cabal enforcers placed to strengthen the parasitic grid with no fracture mission.',
        isCorrect: false,
        rationale:
          'Their mission is fracturing the parasitic control grid from inside elite bloodlines.'
      },
      {
        text: 'Only random celebrities with no strategic placement inside elite bloodlines at all.',
        isCorrect: false,
        rationale:
          'They are strategically placed within elite bloodlines; public examples include Diana, Barron Trump, and JFK Jnr.'
      },
      {
        text: 'Only post-landing solar family diplomats with no pre-disclosure bloodline insertion role.',
        isCorrect: false,
        rationale:
          'Seeded Sols operate inside bloodlines before full public solar-family landing after disclosure.'
      }
    ]
  },
  {
    number: 11,
    question: 'How is Truth Disclosure formulated to hit the sleepers’ false reality?',
    hint: 'Single devastating blow rather than endless partial leaks.',
    options: [
      {
        text: 'To shatter the sleepers’ false reality in a single, devastating blow during E.B.S. broadcasts that lay the true history of the realm bare.',
        isCorrect: true,
        rationale:
          'Truth Disclosure is formulated to shatter the sleepers’ false reality in a single, devastating blow; during E.B.S. broadcasts the true history of the realm is laid bare.'
      },
      {
        text: 'To gently reinforce false reality forever with no single blow and no true-history broadcast.',
        isCorrect: false,
        rationale:
          'Formulation is a single devastating blow laying true history bare, not reinforcing false reality.'
      },
      {
        text: 'To only whisper soft rumors offline with no E.B.S. broadcast of true history at all.',
        isCorrect: false,
        rationale:
          'Core disclosures run through E.B.S. broadcasts as sequenced evidentiary packages.'
      },
      {
        text: 'To delay all history revelation until after full crystalline emergence with no prior blow.',
        isCorrect: false,
        rationale:
          'Disclosure blow comes first so population can absorb parasitic and ET truth before Sky Opening.'
      }
    ]
  },
  {
    number: 12,
    question: 'What does the Parasitic Power Structure disclosure include?',
    hint: 'Election fraud, trafficking rings, cult rituals, and named elite evidence.',
    options: [
      {
        text: 'Absolute proof of election fraud, underground child trafficking rings, and satanic cult rituals—with names, faces, and evidence of crimes by trusted leaders and elites broadcast openly.',
        isCorrect: true,
        rationale:
          'Core disclosures include absolute proof of election fraud, underground child trafficking rings, and satanic cult rituals, with names, faces, and evidence of crimes by the world’s most trusted leaders and elites broadcast openly.'
      },
      {
        text: 'Only anonymous praise for leaders with no fraud, trafficking, cult, or open evidence packages.',
        isCorrect: false,
        rationale:
          'Disclosure openly broadcasts names, faces, and evidence of elite crimes including fraud and trafficking.'
      },
      {
        text: 'Only sports corruption stories with no child trafficking or satanic cult ritual exposure.',
        isCorrect: false,
        rationale:
          'Named themes include election fraud, underground child trafficking, and satanic cult rituals.'
      },
      {
        text: 'Only sealed files never shown to the public during any E.B.S. truth package sequence.',
        isCorrect: false,
        rationale:
          'Evidence is broadcast openly as part of the single-blow E.B.S. disclosure content.'
      }
    ]
  },
  {
    number: 13,
    question: 'What does Bloodline Exposure reveal about ruling elites?',
    hint: 'Not fully human; operated under Draco-Grey influence.',
    options: [
      {
        text: 'Irrefutable evidence that royal families, popes, presidents, and corporate giants were not fully human, but operated directly under Draco-Grey influence.',
        isCorrect: true,
        rationale:
          'Bloodline Exposure provides irrefutable evidence that royal families, popes, presidents, and corporate giants were not fully human, but operated directly under Draco-Grey influence.'
      },
      {
        text: 'Evidence that all elites were fully independent humans with no Draco-Grey influence at all.',
        isCorrect: false,
        rationale:
          'Exposure shows they were not fully human and operated under direct Draco-Grey influence.'
      },
      {
        text: 'Evidence that only Sleepers ran royal and papal lines with no elite bloodline ET influence claim.',
        isCorrect: false,
        rationale:
          'Named exposed groups are royal families, popes, presidents, and corporate giants under Draco-Grey influence.'
      },
      {
        text: 'Evidence that Whitehats invented bloodlines overnight with no prior parasitic control grid.',
        isCorrect: false,
        rationale:
          'Bloodline exposure reveals parasitic ET influence over ruling elites, not Whitehat invention of bloodlines.'
      }
    ]
  },
  {
    number: 14,
    question: 'What does Medical and Vaccine Truth expose, and what is it designed to spark?',
    hint: 'Toxic injections as depopulation tools; mass outrage and mass awakening.',
    options: [
      {
        text: 'Hard evidence that toxic injections such as MMR and Covid were deliberate depopulation mechanisms, designed to spark mass outrage and force a necessary mass awakening.',
        isCorrect: true,
        rationale:
          'Medical and Vaccine Truth exposes toxic injections such as MMR and Covid as deliberate depopulation mechanisms, designed to spark mass outrage and force a necessary mass awakening.'
      },
      {
        text: 'Soft marketing that vaccines were only harmless placebos with no depopulation or outrage role.',
        isCorrect: false,
        rationale:
          'Hard serious evidence frames toxic injections as deliberate depopulation mechanisms for mass awakening.'
      },
      {
        text: 'Only weather-related medical notes with no MMR, Covid, or depopulation exposure content.',
        isCorrect: false,
        rationale:
          'Named examples include MMR and Covid as deliberate depopulation mechanisms.'
      },
      {
        text: 'Only classified lab chatter never intended to spark public outrage or mass awakening.',
        isCorrect: false,
        rationale:
          'This revelation is specifically designed to spark mass outrage forcing necessary mass awakening.'
      }
    ]
  },
  {
    number: 15,
    question: 'Which figures are named in the Exposure of Seeded Sols?',
    hint: 'Public revelation of strategic inside-dismantling placements.',
    options: [
      {
        text: 'Key figures such as Princess Diana, Barron Trump, and JFK Jnr strategically placed to dismantle the system.',
        isCorrect: true,
        rationale:
          'Public revelation includes key figures strategically placed to dismantle the system, such as Princess Diana, Barron Trump, and JFK Jnr.'
      },
      {
        text: 'Only anonymous NPCs with no named figures such as Diana, Barron Trump, or JFK Jnr.',
        isCorrect: false,
        rationale:
          'Named Seeded Sol figures include Princess Diana, Barron Trump, and JFK Jnr.'
      },
      {
        text: 'Only Cabal enforcers publicly praised with no inside-dismantling Seeded Sol exposure.',
        isCorrect: false,
        rationale:
          'Exposure reveals high-frequency placements that fracture control from inside, not Cabal praise.'
      },
      {
        text: 'Only solar family mothership captains who never entered elite bloodlines at all.',
        isCorrect: false,
        rationale:
          'Seeded Sols are placed within elite bloodlines; mothership arrival follows proper disclosure grounding.'
      }
    ]
  },
  {
    number: 16,
    question: 'What is the Communications Cut, and why is it done?',
    hint: 'Disrupt internet, TV, and mobile so only military emergency channel remains.',
    options: [
      {
        text: 'Internet, television networks, and mobile communications are completely disrupted to stop Cabal-controlled NPC media from twisting the narrative; only the military emergency channel remains online.',
        isCorrect: true,
        rationale:
          'Internet, television networks, and mobile communications are completely disrupted to prevent Cabal-controlled NPC media from twisting the narrative; only the military emergency channel remains online to broadcast the truth.'
      },
      {
        text: 'All Cabal media stays fully online while military emergency channels are permanently muted.',
        isCorrect: false,
        rationale:
          'Cabal NPC media is cut off; only the military emergency channel remains for truth.'
      },
      {
        text: 'Only one radio station pauses ads while internet and TV continue full NPC narrative control.',
        isCorrect: false,
        rationale:
          'Communications cut is complete across internet, television, and mobile networks.'
      },
      {
        text: 'Only post-landing tourism apps go offline with no relation to narrative control during disclosure.',
        isCorrect: false,
        rationale:
          'Cut is for absolute informational control during Phase Seven and Eight disclosure mechanics.'
      }
    ]
  },
  {
    number: 17,
    question: 'How is Sequenced Delivery structured across 72+ hours?',
    hint: 'Start with reassurance and soft truths before darker harder truths.',
    options: [
      {
        text: 'Truth packages run continuously over 72+ hours, beginning with immediate reassurance and soft truths before escalating into darker, harder truths about bloodlines and trafficking.',
        isCorrect: true,
        rationale:
          'Truth packages are delivered continuously over 72+ hours, beginning with immediate reassurance and soft truths before escalating into darker, harder truths regarding bloodlines and trafficking to prevent terminal trauma.'
      },
      {
        text: 'Only harder truths first with no soft reassurance, maximizing terminal trauma by design.',
        isCorrect: false,
        rationale:
          'Sequencing starts soft to prevent the public from collapsing into terminal trauma.'
      },
      {
        text: 'Only one hour of soft truths with no continuous 72+ hour package escalation at all.',
        isCorrect: false,
        rationale:
          'Delivery is continuous over 72+ hours with careful soft-to-hard sequencing.'
      },
      {
        text: 'Only entertainment loops with no bloodline, trafficking, or reassurance content structure.',
        isCorrect: false,
        rationale:
          'Packages escalate into bloodlines and trafficking after soft reassurance stages.'
      }
    ]
  },
  {
    number: 18,
    question: 'How is Military Lockdown defined during disclosure?',
    hint: 'Protective stabilization, not parasitic control lockdown.',
    options: [
      {
        text: 'A protective military stabilization that keeps chaos low and provides a safe, quiet environment for the masses to sit, watch, and process the reality reset—not a parasitic lockdown for control.',
        isCorrect: true,
        rationale:
          'Military Lockdown is not a parasitic lockdown for control, but protective military stabilization that keeps chaos low and provides a safe, quiet environment for the masses to process the reality reset.'
      },
      {
        text: 'A pure parasitic control lockdown designed only to increase chaos and block all truth watching.',
        isCorrect: false,
        rationale:
          'It is explicitly protective stabilization for safe processing, not parasitic control lockdown.'
      },
      {
        text: 'A cancelled optional suggestion with no chaos management or quiet processing environment.',
        isCorrect: false,
        rationale:
          'Lockdown is a core sequenced mechanic for absolute environmental control during disclosure.'
      },
      {
        text: 'A permanent war footing with no safe quiet space for the public to absorb E.B.S. packages.',
        isCorrect: false,
        rationale:
          'Purpose is low chaos and safe quiet environment to sit, watch, and process the reset.'
      }
    ]
  },
  {
    number: 19,
    question: 'What is true of figures processed in Phase Eight tribunals regarding earlier neutralization?',
    hint: 'Neutralized earlier; mimic tech held the illusion until the disclosure window.',
    options: [
      {
        text: 'They were actually neutralized in earlier phases; cloning, A.I. stand-ins, digital composites, and advanced mimic tech temporarily maintained the illusion of their presence until this disclosure window.',
        isCorrect: true,
        rationale:
          'These figures were actually neutralized in earlier phases; cloning, A.I. stand-ins, digital composites, and advanced mimic tech were temporarily deployed to maintain the illusion of their presence until this exact disclosure window.'
      },
      {
        text: 'They remained fully free and unneutralized until the first tribunal second with no mimic tech ever used.',
        isCorrect: false,
        rationale:
          'Neutralization occurred in earlier phases; mimic tech held continuity optics until disclosure.'
      },
      {
        text: 'They only existed as Soft Truths with no arrests, confessions, or executions in Phase Eight.',
        isCorrect: false,
        rationale:
          'Phase Eight tribunals process them through arrests, confessions, and executions after E.B.S. shock.'
      },
      {
        text: 'They were invented after the Sky Opening with no prior parasitic operator role at all.',
        isCorrect: false,
        rationale:
          'They were dangerous parasitic operators neutralized earlier and exposed in this disclosure window.'
      }
    ]
  },
  {
    number: 20,
    question: 'What Scare Events prime the masses before truth is dropped?',
    hint: 'Staged WW3 tensions, financial collapse, and fake alien invasion via Project Bluebeam.',
    options: [
      {
        text: 'Staged geopolitical WW3 tensions, financial collapse, and a fake alien invasion via Project Bluebeam that push the collective to the edge of questioning reality.',
        isCorrect: true,
        rationale:
          'Before truth is dropped, masses are subjected to Scare Events—staged geopolitical WW3 tensions, financial collapse, and a fake alien invasion via Project Bluebeam—to push the collective to the edge of questioning reality.'
      },
      {
        text: 'Only peaceful festivals with no WW3 staging, financial collapse pressure, or Bluebeam scare narrative.',
        isCorrect: false,
        rationale:
          'Scare Events include staged WW3 tensions, financial collapse, and Project Bluebeam fake invasion.'
      },
      {
        text: 'Only permanent free-energy parties that never push anyone toward questioning their reality.',
        isCorrect: false,
        rationale:
          'Scare Events deliberately push collective consciousness to the edge of questioning.'
      },
      {
        text: 'Only tribunal confessions with no prior staged geopolitical or Bluebeam priming at all.',
        isCorrect: false,
        rationale:
          'Scare Events precede E.B.S.; tribunals follow the E.B.S. shock in Phase Eight.'
      }
    ]
  },
  {
    number: 21,
    question: 'Why must Scare Events precede E.B.S. activation?',
    hint: 'Without prior shaking, sleepers would ignore the broadcasts.',
    options: [
      {
        text: 'Without this prior shaking, sleepers would simply ignore the broadcasts and fail to pay attention.',
        isCorrect: true,
        rationale:
          'If the E.B.S. were triggered without this prior shaking, the sleepers would simply ignore the broadcasts and fail to pay attention.'
      },
      {
        text: 'Because Scare Events permanently cancel E.B.S. so no one ever needs to pay attention to truth.',
        isCorrect: false,
        rationale:
          'Scare Events prepare attention so E.B.S. is not ignored; they do not cancel disclosure.'
      },
      {
        text: 'Because Whitehats want maximum ignore-rate so truth packages never reach collective awareness.',
        isCorrect: false,
        rationale:
          'Priming exists so sleepers pay attention rather than ignore the broadcasts.'
      },
      {
        text: 'Because soft truths alone already guarantee attention without any prior edge-of-questioning stress.',
        isCorrect: false,
        rationale:
          'Prior Scare Event shaking is required so sleepers do not ignore E.B.S. entirely.'
      }
    ]
  },
  {
    number: 22,
    question: 'How does truth disclosure relate to The Sky Opening and Motherships?',
    hint: 'Population must absorb parasitic and ET truth first or true craft look like hostile invasion.',
    options: [
      {
        text: 'Only after the population absorbs parasitic-system truth and extraterrestrial manipulation can the veil thin; if true Motherships uncloaked before E.B.S. grounding, awakening masses would read arrival as hostile alien invasion and collapse into terror.',
        isCorrect: true,
        rationale:
          'Truth disclosure is the necessary bridge to The Sky Opening; if true Motherships uncloaked before E.B.S. grounded the population, awakening masses would interpret arrival as hostile alien invasion and collapse into terror.'
      },
      {
        text: 'Motherships must uncloak first with no E.B.S. grounding so terror becomes the preferred path.',
        isCorrect: false,
        rationale:
          'E.B.S. grounding comes first so true craft are not misread as hostile invasion.'
      },
      {
        text: 'Sky Opening is unrelated to disclosure and never requires absorption of parasitic-system truth.',
        isCorrect: false,
        rationale:
          'Disclosure is the necessary bridge to Sky Opening after parasitic and ET truth is absorbed.'
      },
      {
        text: 'Only Project Bluebeam craft are real Motherships with no true craft arriving after disclosure.',
        isCorrect: false,
        rationale:
          'Bluebeam is fake invasion scare; true Motherships uncloak after proper E.B.S. grounding.'
      }
    ]
  },
  {
    number: 23,
    question: 'What is the strategic goal of sequenced disclosure?',
    hint: 'Secure realm for reconstruction and ascension while ending parasitic energy harvest.',
    options: [
      {
        text: 'To secure the realm for reconstruction and final ascension processes by controlling the emotional shockwave, preventing full-scale societal collapse while terminating the parasitic energy harvest.',
        isCorrect: true,
        rationale:
          'Strategic goal is securing the realm for reconstruction and final ascension processes by controlling the emotional and psychological shockwave, preventing full-scale societal collapse while decisively terminating the parasitic energy harvest.'
      },
      {
        text: 'To maximize uncontrolled societal collapse and permanently continue the parasitic energy harvest.',
        isCorrect: false,
        rationale:
          'Whitehats prevent full-scale collapse and terminate parasitic energy harvest.'
      },
      {
        text: 'To avoid all emotional shock so no mass outrage catalyst for liberation ever occurs.',
        isCorrect: false,
        rationale:
          'Mental breakdowns and outrage from the masses are a necessary catalyst for liberation.'
      },
      {
        text: 'To freeze the 3D illusion permanently with no reconstruction or ascension pathway secured.',
        isCorrect: false,
        rationale:
          'Goal includes reconstruction and ascension after dissolving false perception layers.'
      }
    ]
  },
  {
    number: 24,
    question: 'What role do Resonating Sols play as the 3D illusion fractures completely?',
    hint: 'Living anchors and guides using harmonic tone from shock into total resonance.',
    options: [
      {
        text: 'They act as living anchors and guides, using harmonic tone to lead the newly awakened across the bridge from shock into total resonance.',
        isCorrect: true,
        rationale:
          'As the 3D illusion fractures completely, Resonating Sols are positioned to act as living anchors and guides, utilizing their harmonic tone to lead the newly awakened across the bridge from shock into total resonance.'
      },
      {
        text: 'They remain silent spectators with no anchoring, guiding, or harmonic-tone role for the newly awakened.',
        isCorrect: false,
        rationale:
          'They are living anchors and guides using harmonic tone from shock into total resonance.'
      },
      {
        text: 'They only run Cabal NPC media during the blackout instead of bridging people into resonance.',
        isCorrect: false,
        rationale:
          'NPC media is cut; Resonating Sols guide newly awakened into resonance after fracture.'
      },
      {
        text: 'They only amplify Scare Events forever with no transition from shock into total resonance.',
        isCorrect: false,
        rationale:
          'Their role is leading from shock into total resonance after the illusion fractures.'
      }
    ]
  },
  {
    number: 25,
    question: 'What does this transition permanently dissolve, and what is allowed to emerge?',
    hint: 'False perception layers dissolve; crystalline reality emerges and solar families land safely.',
    options: [
      {
        text: 'It permanently dissolves the false layers of perception, allowing original crystalline reality to emerge and true solar families to land safely.',
        isCorrect: true,
        rationale:
          'This transition permanently dissolves the false layers of perception, allowing the original crystalline reality to emerge and the true solar families to land safely.'
      },
      {
        text: 'It permanently freezes false perception layers so crystalline reality and solar-family landing never occur.',
        isCorrect: false,
        rationale:
          'Transition dissolves false layers so crystalline reality emerges and solar families land safely.'
      },
      {
        text: 'It only dissolves soft truths while harder parasitic and ET truths remain permanently sealed.',
        isCorrect: false,
        rationale:
          'Sequenced disclosure includes hard truths so the population can fully transition into crystalline reality.'
      },
      {
        text: 'It only allows Bluebeam holograms to remain as the final permanent sky reality forever.',
        isCorrect: false,
        rationale:
          'Bluebeam is prior scare; end-state is original crystalline reality and safe true solar-family landing.'
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

const topicImage = 'images/breakdown/truth-disclosure.webp';
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
    'Test your grasp of Truth Disclosure — E.B.S. packages, Whitehat lockdown, bloodline and vaccine exposure, tribunals, and the bridge to solar-family arrival.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Truth Disclosure is the Phase Seven and Eight climax that shatters false reality through E.B.S. packages, protective lockdown, and tribunals. Sit with what you missed, then return to the Truth Disclosure deep-dive, infographics, and video transmissions. Sequenced shock becomes liberation—and Resonating Sols help carry the newly awakened into total resonance as crystalline reality and true solar families emerge.'
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
    'Test your understanding of Truth Disclosure — E.B.S. truth packages, communications cut, military stabilization, elite crime exposure, and tribunals securing the realm for ascension.'
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
  throw new Error('truth-disclosure not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on Truth Disclosure: E.B.S. packages, Whitehat lockdown, bloodline and vaccine exposure, tribunals, and the bridge to solar-family arrival.'
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
    "  { path: '/quiz/breakdown/phase-seven-eight.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/breakdown/the-purge-phases.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/breakdown/lockdown-window.html', priority: '0.75', changefreq: 'monthly' },"
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
console.log('PASS: audited 25/25 against data/breakdown-topics/truth-disclosure.json');
