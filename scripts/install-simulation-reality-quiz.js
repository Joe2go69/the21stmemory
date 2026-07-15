/**
 * Installs Simulation Reality quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/simulation-reality.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-simulation-reality-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'simulation-reality';
const TOPIC_TITLE = 'Simulation Reality';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/simulation-reality.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['spinning globe', 'simulation', '3rd density'],
  2: ['aether', 'consciousness', 'physical matter'],
  3: ['five billion years', 'source of creation', 'experience-based wisdom'],
  4: ['custodians', '9th-density', 'harvesting matrix'],
  5: ['no coincidences', 'accidents', 'awakening pathways'],
  6: ['simulation', 'pre-ordained', '3rd-density'],
  7: ['aether', 'sustained intent', 'subatomic'],
  8: ['97%', 'npc', 'hive-aligned', '4th density'],
  9: ['projection dome', 'firmament', 'sieve', 'colander'],
  10: ['overlays', 'ultra low frequencies', 'crystalline architecture'],
  11: ['amnesia vortex', 'bright light', 'sun', 'memories'],
  12: ['black void plasma', 'dark matter', 'nighttime sky'],
  13: ['linear time', '3.9', '96 hours'],
  14: ['space', 'dark matter field', 'black void plasma'],
  15: ['pineal gland', 'aether', 'subatomic particles'],
  16: ['npc', 'grand theft auto', 'internal monologue'],
  17: ['amnesia vortex', 'vatican', 'grey'],
  18: ['moon', 'holographic shell', 'space station'],
  19: ['asteroids', 'projection dome', 'projections'],
  20: ['9th-density', 'gateway-10', 'spirit tree', 'mt meru'],
  21: ['re-sets', 'thousand years', 'mud-floods', 'orphans'],
  22: ['religion', 'finance', 'perceived knowledge'],
  23: ['g.a.a', 'ebs', 'emergency broadcast system'],
  24: ['fake alien invasion', 'project bluebeam', 'projection dome'],
  25: ['30-second', 'emf', 'evaporate', 'aether'],
};

function cleanText(s) {
  if (typeof s !== 'string') return s;
  let t = s;
  t = t.replace(/\$(\d+)\^\{(st|nd|rd|th)\}\$/gi, '$1$2');
  t = t.replace(/\$(\d+)\^(st|nd|rd|th)\$/gi, '$1$2');
  t = t.replace(/\$(\d+(?:,\d+)*)\\+%\$/g, '$1%');
  t = t.replace(/\$(\d+(?:,\d+)*)\\?\%\$/g, '$1%');
  t = t.replace(/\$(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\$/g, '$1');
  t = t.replace(/\$([A-Za-z][A-Za-z0-9./-]{0,24})\$/g, '$1');
  t = t.replace(/\$([^$]+)\$/g, (_, inner) =>
    inner.replace(/\^\{([^}]+)\}/g, '$1').replace(/\\%/g, '%').replace(/\\/g, '')
  );
  t = t.replace(/\^\{(st|nd|rd|th)\}/gi, '$1');
  t = t.replace(/\\%/g, '%');
  t = t.replace(/\\\(|\\\)|\\\[|\\\]/g, '');
  t = t
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, '—')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ')
    .replace(/\uFFFD/g, '');
  return t.replace(/[ \t]{2,}/g, ' ').trim();
}

const RAW_QUESTIONS = [
  {
    number: 1,
    question:
      'Where does humanity actually exist, relative to the globe-in-vacuum story sold as science?',
    options: [
      {
        label: 'A',
        text: 'On a free-spinning planetary ball orbiting a nuclear star through infinite vacuum space, exactly as textbooks and space agencies insist.',
        isCorrect: false,
        rationale:
          'The globe-in-vacuum model is the cover story. Humanity sits inside a controlled simulation, not on a ball in space.',
      },
      {
        label: 'B',
        text: 'Inside a highly controlled, tightly managed, and heavily corrupted Simulation — an artificial 3rd-density physical environment, not a spinning globe in a vacuum.',
        isCorrect: true,
        rationale:
          'Humanity is entrapped in a corrupted 3rd-density Simulation, not living on a spinning globe in open vacuum.',
      },
      {
        label: 'C',
        text: 'On an unregulated natural plain with no software layer, no density management, and no parasitic interference of any kind.',
        isCorrect: false,
        rationale:
          'The realm is software-managed and heavily corrupted by Custodians, not an untouched natural plain.',
      },
      {
        label: 'D',
        text: 'Only in dream states and meditation; waking physical life is pure unprogrammed organic reality without simulation parameters.',
        isCorrect: false,
        rationale:
          'Waking physical life itself is the simulated 3rd-density construct; it is not limited to dreams or meditation.',
      },
    ],
    hint: 'Not a globe in vacuum — a controlled 3rd-density Simulation.',
    correctAnswer: 'B',
  },
  {
    number: 2,
    question:
      'What is the Aether in the architecture of this physical realm?',
    options: [
      {
        label: 'A',
        text: 'A poetic name for empty outer space that does nothing but separate stars and planets with inert vacuum.',
        isCorrect: false,
        rationale:
          'Aether is not empty space. It is the simulation software that turns consciousness into matter.',
      },
      {
        label: 'B',
        text: 'A purely chemical gas layer in the upper atmosphere used only for weather and aviation, with no link to consciousness.',
        isCorrect: false,
        rationale:
          'Aether is core simulation software, not a weather gas or atmospheric chemistry layer.',
      },
      {
        label: 'C',
        text: 'The core simulation software of the realm, which mathematically translates consciousness into physical matter and ordains subatomic structure.',
        isCorrect: true,
        rationale:
          'Aether is the simulation software that interfaces consciousness with the subatomic fabric of physical reality.',
      },
      {
        label: 'D',
        text: 'A bank of human-built computers under the ice that only stores historical archives and media files.',
        isCorrect: false,
        rationale:
          'Aether is the living simulation software of the realm, not a human archive server farm.',
      },
    ],
    hint: 'Core simulation software — consciousness into matter.',
    correctAnswer: 'C',
  },
  {
    number: 3,
    question:
      'Who originally constructed this physical simulation, and for what primary purpose?',
    options: [
      {
        label: 'A',
        text: 'Random quantum fluctuations five minutes ago with no designer, no purpose, and no experiential goal for souls.',
        isCorrect: false,
        rationale:
          'The simulation was deliberately built by the Source of Creation, not by random chance.',
      },
      {
        label: 'B',
        text: 'Military contractors in the 20th century, solely to train pilots and soldiers inside closed virtual ranges.',
        isCorrect: false,
        rationale:
          'Origin is five billion years ago under the Source of Creation — not modern military VR.',
      },
      {
        label: 'C',
        text: 'Custodian parasites from day one, built only as a loosh farm with no prior pure design for wisdom.',
        isCorrect: false,
        rationale:
          'Custodians hijacked an existing Source-built realm; they did not create the original pure design.',
      },
      {
        label: 'D',
        text: 'The Source of Creation, five billion years ago, to procure experience-based wisdom through embodied living.',
        isCorrect: true,
        rationale:
          'Source built the simulation five billion years ago so souls could gain experience-based wisdom.',
      },
    ],
    hint: 'Source of Creation — five billion years — experience-based wisdom.',
    correctAnswer: 'D',
  },
  {
    number: 4,
    question:
      'What did the Custodians do after they seized control of the realm?',
    options: [
      {
        label: 'A',
        text: 'They raised the realm from 3rd density straight into 12th density and opened free travel for every soul.',
        isCorrect: false,
        rationale:
          'Custodians suppressed density downward; they did not elevate the realm.',
      },
      {
        label: 'B',
        text: 'They deployed advanced visual and frequency technologies to suppress the native 9th-density vibration, turning the realm into a dystopian harvesting matrix.',
        isCorrect: true,
        rationale:
          'Custodians hijacked the realm and forced native 9th-density down into a 3rd-density harvest prison.',
      },
      {
        label: 'C',
        text: 'They left the native 9th-density vibration intact and only rewrote school textbooks about geography.',
        isCorrect: false,
        rationale:
          'Suppression of native 9th-density vibration is central to the hijack, not mere textbook edits.',
      },
      {
        label: 'D',
        text: 'They dissolved the simulation entirely so that physical matter and bodies no longer exist anywhere.',
        isCorrect: false,
        rationale:
          'The simulation still runs as a harvesting matrix; it was corrupted, not deleted.',
      },
    ],
    hint: 'Suppress 9th-density — dystopian harvesting matrix.',
    correctAnswer: 'B',
  },
  {
    number: 5,
    question:
      'How should genuine souls read every interaction, obstacle, and hostile encounter inside this simulation?',
    options: [
      {
        label: 'A',
        text: 'As pure random noise with zero design, zero routing, and no connection to any awakening path.',
        isCorrect: false,
        rationale:
          'There are no accidents. Every interaction is calculated to route souls toward awakening pathways.',
      },
      {
        label: 'B',
        text: 'As optional side quests that only NPCs experience while true souls live outside all programming.',
        isCorrect: false,
        rationale:
          'True souls are inside the programmed field; naysayers and authorities are part of the calculated route.',
      },
      {
        label: 'C',
        text: 'As calculated routing with no coincidences or accidents — every encounter, including naysayers and hostile authorities, steers genuine souls toward specific awakening pathways.',
        isCorrect: true,
        rationale:
          'Reality as simulation means zero coincidence; every interaction is calculated for awakening pathways.',
      },
      {
        label: 'D',
        text: 'As proof that spiritual growth is impossible and that the system will never allow any soul to awaken.',
        isCorrect: false,
        rationale:
          'The programming itself funnels souls toward the Great Spiritual Awakening, not permanent sleep.',
      },
    ],
    hint: 'No coincidences — calculated awakening pathways.',
    correctAnswer: 'C',
  },
  {
    number: 6,
    question: 'What does the term Simulation name in this framework?',
    options: [
      {
        label: 'A',
        text: 'The artificially manipulated 3rd-density physical construct where humanity is entrapped, running on strict parameters so events, encounters, and obstacles are pre-ordained by the system\'s programming.',
        isCorrect: true,
        rationale:
          'Simulation is the artificial 3rd-density construct with pre-ordained events under system programming.',
      },
      {
        label: 'B',
        text: 'A weekend virtual-reality headset game that players exit whenever they remove the goggles and return to unsimulated life.',
        isCorrect: false,
        rationale:
          'This is the full physical realm of entrapped humanity, not a removable headset game.',
      },
      {
        label: 'C',
        text: 'Only the stock market and media news cycle, while bodies, matter, and geography remain fully free of any code.',
        isCorrect: false,
        rationale:
          'The whole 3rd-density physical construct is the simulation, not merely markets or news.',
      },
      {
        label: 'D',
        text: 'A future project planned by humans that has not yet been switched on and does not currently bind anyone.',
        isCorrect: false,
        rationale:
          'Humanity is already entrapped in the running construct; it is not a future unbuilt project.',
      },
    ],
    hint: '3rd-density construct — pre-ordained parameters.',
    correctAnswer: 'A',
  },
  {
    number: 7,
    question:
      'How does the Aether respond when a genuine soul holds sustained intent?',
    options: [
      {
        label: 'A',
        text: 'It ignores consciousness entirely and only rearranges matter when governments issue paper permits.',
        isCorrect: false,
        rationale:
          'Aether interfaces instantaneously with sustained intent from human consciousness.',
      },
      {
        label: 'B',
        text: 'It waits centuries for random mutations before any desire can affect the subatomic field at all.',
        isCorrect: false,
        rationale:
          'Response is instantaneous with sustained intent, not multi-century random mutation.',
      },
      {
        label: 'C',
        text: 'It only records wishes as diary text without ever ordaining the subatomic parts of physical reality.',
        isCorrect: false,
        rationale:
          'Aether ordains the subatomic constituents of physical reality from projected intent.',
      },
      {
        label: 'D',
        text: 'It interfaces instantaneously with that sustained intent and ordains the subatomic constituent parts of physical reality accordingly.',
        isCorrect: true,
        rationale:
          'Aether trusts and answers sustained consciousness by structuring matter at the subatomic level.',
      },
    ],
    hint: 'Instant interface — sustained intent — subatomic ordaining.',
    correctAnswer: 'D',
  },
  {
    number: 8,
    question:
      'What are Non-Player Characters (NPCs) within the localized simulation?',
    options: [
      {
        label: 'A',
        text: 'The rare 3% of beings who hold full organic soul architecture and lead every genuine awakening movement.',
        isCorrect: false,
        rationale:
          'NPCs are the 97% synthetic majority, not the rare genuine-soul minority.',
      },
      {
        label: 'B',
        text: 'Synthetically manufactured entities making up 97% of the population, powered by Hive-Aligned replica souls created in 4th density to enforce consensus reality and conformity.',
        isCorrect: true,
        rationale:
          'NPCs are 97% of the population — Hive-Aligned 4th-density replica souls enforcing herd consensus.',
      },
      {
        label: 'C',
        text: 'Fully self-aware organic souls who simply prefer quiet private lives and never speak in public.',
        isCorrect: false,
        rationale:
          'NPCs are synthetic, hive-aligned constructs, not quiet organic souls.',
      },
      {
        label: 'D',
        text: 'Only digital avatars on social media apps that never walk, work, or interact in physical streets.',
        isCorrect: false,
        rationale:
          'NPCs populate the physical simulation as synthetic people, not merely online avatars.',
      },
    ],
    hint: '97% — Hive-Aligned replica souls — 4th density.',
    correctAnswer: 'B',
  },
  {
    number: 9,
    question: 'What is the Projection Dome and where does it sit?',
    options: [
      {
        label: 'A',
        text: 'A natural cloud layer made only of water vapor that randomly scatters sunlight with no projection role.',
        isCorrect: false,
        rationale:
          'The Projection Dome is artificial tech under the Firmament, not ordinary weather clouds.',
      },
      {
        label: 'B',
        text: 'An underground bunker network that projects political slogans onto city walls during elections only.',
        isCorrect: false,
        rationale:
          'It is a sky-level technological barrier for holographic space and false sky imagery.',
      },
      {
        label: 'C',
        text: 'An artificial technological barrier like a nested sieve or colander, positioned directly beneath the true Firmament, serving as the canvas for holographic space phenomena and false sky imagery.',
        isCorrect: true,
        rationale:
          'Projection Dome is the sieve-like tech layer under the Firmament that paints fake sky and space.',
      },
      {
        label: 'D',
        text: 'The solid outer Firmament itself, with no separate inner screen and no projected celestial theater.',
        isCorrect: false,
        rationale:
          'The dome is distinct from and beneath the true Firmament as an inner projection canvas.',
      },
    ],
    hint: 'Sieve/colander under Firmament — holographic sky canvas.',
    correctAnswer: 'C',
  },
  {
    number: 10,
    question: 'What do Overlays do to 3rd-density visual perception?',
    options: [
      {
        label: 'A',
        text: 'They are powerful projected Ultra Low Frequencies that drape the simulation and artificially hide high-frequency crystalline architecture and fundamental physical truths from 3rd-density sight.',
        isCorrect: true,
        rationale:
          'Overlays are ULF fields that hide crystalline architecture and true physical structure from ordinary sight.',
      },
      {
        label: 'B',
        text: 'They are decorative wallpaper apps that only change phone lock screens and never touch physical perception.',
        isCorrect: false,
        rationale:
          'Overlays are realm-scale ULF projections over the simulation, not phone wallpaper.',
      },
      {
        label: 'C',
        text: 'They amplify crystalline temples into full 9th-density visibility for every unawakened person at once.',
        isCorrect: false,
        rationale:
          'Overlays hide high-frequency crystalline architecture; they do not reveal it to the herd.',
      },
      {
        label: 'D',
        text: 'They only affect animals and plants while leaving human visual perception completely unaltered.',
        isCorrect: false,
        rationale:
          'Overlays specifically mask truths from 3rd-density human visual perception.',
      },
    ],
    hint: 'ULF drapes — hide crystalline architecture from 3rd-density sight.',
    correctAnswer: 'A',
  },
  {
    number: 11,
    question:
      'What is the Amnesia Vortex in the soul-recycling architecture?',
    options: [
      {
        label: 'A',
        text: 'A gentle spa of free will where souls choose which memories to keep and which childhood hobbies to forget.',
        isCorrect: false,
        rationale:
          'The vortex forcibly wipes memories; it is a technological trap, not a gentle free-will spa.',
      },
      {
        label: 'B',
        text: 'An advanced technological trap in the recycling process that pulls deceased souls toward a bright light (the sun) to forcibly wipe their memories before insertion into a new physical vessel.',
        isCorrect: true,
        rationale:
          'Amnesia Vortex pulls souls to the sun\'s bright light, wipes memory, then loads them into new vessels.',
      },
      {
        label: 'C',
        text: 'A museum tour of past lives that fully restores every memory before the soul returns to Earth.',
        isCorrect: false,
        rationale:
          'The vortex erases memory; it does not restore a complete past-life archive.',
      },
      {
        label: 'D',
        text: 'A weather cyclone in the southern oceans that only sinks ships and never interacts with souls.',
        isCorrect: false,
        rationale:
          'It is a soul-technology trap in reincarnation, not a maritime weather event.',
      },
    ],
    hint: 'Bright light / sun — forced memory wipe — new vessel.',
    correctAnswer: 'B',
  },
  {
    number: 12,
    question:
      'What is Black Void Plasma engineered to do to the night sky?',
    options: [
      {
        label: 'A',
        text: 'Brighten the entire cosmos so every city on Earth has permanent noon daylight without night cycles.',
        isCorrect: false,
        rationale:
          'Black Void Plasma creates the false pitch-black night, not permanent daylight.',
      },
      {
        label: 'B',
        text: 'Paint rainbow auroras for tourism festivals with no link to Dark Matter or true space appearance.',
        isCorrect: false,
        rationale:
          'Its role is cloaking the bright white Dark Matter field as terrifying black vacuum.',
      },
      {
        label: 'C',
        text: 'Remove all stars so the Projection Dome can never display any celestial imagery again.',
        isCorrect: false,
        rationale:
          'Stars and space theater still project; plasma cloaks the white field into black night.',
      },
      {
        label: 'D',
        text: 'Artificially cloak the naturally bright white Dark Matter field, creating the false visual illusion of a pitch-black nighttime sky.',
        isCorrect: true,
        rationale:
          'Custodian Black Void Plasma hides the bright white Dark Matter field behind fake black night.',
      },
    ],
    hint: 'Cloak bright white Dark Matter — fake pitch-black night.',
    correctAnswer: 'D',
  },
  {
    number: 13,
    question:
      'What is the truth about linear time and the length of a true day?',
    options: [
      {
        label: 'A',
        text: 'Linear time is fully organic and natural; a true day is exactly 24 hours with no simulation enforcement.',
        isCorrect: false,
        rationale:
          'Linear time is fabricated; a true day is about 3.9 Earth days, not a natural 24 hours.',
      },
      {
        label: 'B',
        text: 'Linear time is a fabricated illusion held by 3rd-density overlays; a true day spans about 3.9 Earth days (nearly 96 hours), while clocks and schedules enforce a fake 24-hour cycle.',
        isCorrect: true,
        rationale:
          'Overlays and social machinery fake 24-hour days; true day length is roughly 3.9 Earth days.',
      },
      {
        label: 'C',
        text: 'Time does not exist at all in any form, so no day length, clock, or schedule can ever be discussed.',
        isCorrect: false,
        rationale:
          'Time is stretched and bent under overlays; a measurable true-day span is still named.',
      },
      {
        label: 'D',
        text: 'A true day lasts only twelve minutes, and every longer sense of time is pure individual hallucination.',
        isCorrect: false,
        rationale:
          'The stated true day is about 3.9 Earth days (nearly 96 hours), not twelve minutes.',
      },
    ],
    hint: 'Fabricated linear time — true day ~3.9 Earth days / ~96 hours.',
    correctAnswer: 'B',
  },
  {
    number: 14,
    question:
      'Does "space" as modern science teaches it actually exist beyond the simulation?',
    options: [
      {
        label: 'A',
        text: 'Yes — an infinite black vacuum filled with random debris is the true exterior of the realm.',
        isCorrect: false,
        rationale:
          'Taught "space" is false. Beyond the simulation is the brightly illuminated white Dark Matter field.',
      },
      {
        label: 'B',
        text: 'No — the area beyond is the brightly illuminated, profoundly white Dark Matter field, hidden by Black Void Plasma to fake a terrifying empty vacuum.',
        isCorrect: true,
        rationale:
          'True exterior is bright white Dark Matter, cloaked into the illusion of black empty space.',
      },
      {
        label: 'C',
        text: 'Only a thin grey fog exists beyond the dome, with no Dark Matter field and no plasma cloak.',
        isCorrect: false,
        rationale:
          'The named exterior is the bright white Dark Matter field under Black Void Plasma.',
      },
      {
        label: 'D',
        text: 'Beyond the dome is another identical spinning globe Earth that astronauts visit every decade.',
        isCorrect: false,
        rationale:
          'There is no globe-space exterior; the white Dark Matter field is what is hidden.',
      },
    ],
    hint: 'No vacuum space — bright white Dark Matter under Black Void Plasma.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question:
      'In the uncorrupted Manifestation Software, how does a genuine soul birth solid matter?',
    options: [
      {
        label: 'A',
        text: 'By filing government forms and waiting for industrial factories to manufacture objects over years.',
        isCorrect: false,
        rationale:
          'Manifestation runs through Pineal projection into the Aether in real time, not bureaucracy.',
      },
      {
        label: 'B',
        text: 'By shouting at NPCs until they hand over pre-made objects that already existed in warehouses.',
        isCorrect: false,
        rationale:
          'Matter is woven from subatomic particles via Aether trust, not NPC warehouse handoffs.',
      },
      {
        label: 'C',
        text: 'The soul projects highly complex mathematical desires through the Pineal Gland into the Aether; the Aether trusts the soul and instantly unfolds subatomic particles into solid fractal formations in real time.',
        isCorrect: true,
        rationale:
          'Pineal → Aether → instant subatomic unfolding into solid fractal matter when the software is pure.',
      },
      {
        label: 'D',
        text: 'By falling asleep and dreaming objects that never enter waking physical reality at all.',
        isCorrect: false,
        rationale:
          'Uncorrupted Aether weaves solid waking matter in real time from sustained conscious intent.',
      },
    ],
    hint: 'Pineal Gland → Aether trusts → instant solid fractal matter.',
    correctAnswer: 'C',
  },
  {
    number: 16,
    question:
      'How do NPCs function relative to genuine Taran souls in daily life?',
    options: [
      {
        label: 'A',
        text: 'Like background characters in a computer game such as Grand Theft Auto — fixed thought-avenues and boundaries, no deep internal monologue or courage of conviction, anchoring herd narrative and derailing true souls through peer pressure.',
        isCorrect: true,
        rationale:
          'NPCs are hard-wired herd anchors without deep self-awareness, built to enforce conformity on Taran souls.',
      },
      {
        label: 'B',
        text: 'As independent philosophers with richer inner lives than genuine souls and unlimited free creative range.',
        isCorrect: false,
        rationale:
          'NPCs lack internal monologue, deep self-awareness, and courage of conviction.',
      },
      {
        label: 'C',
        text: 'As silent statues that never speak, move, or participate in media, education, or social pressure.',
        isCorrect: false,
        rationale:
          'They actively echo media/education herd narratives and apply peer pressure.',
      },
      {
        label: 'D',
        text: 'As temporary holograms that only appear during holidays and cannot hold jobs or relationships.',
        isCorrect: false,
        rationale:
          'They populate ordinary society as synthetic people enforcing consensus year-round.',
      },
    ],
    hint: 'Game NPCs — herd narrative — derail Taran souls.',
    correctAnswer: 'A',
  },
  {
    number: 17,
    question:
      'How does the closed-loop reincarnation system keep the harvest population stocked?',
    options: [
      {
        label: 'A',
        text: 'Souls freely choose new lives with full memory intact and never pass through any light trap or portal.',
        isCorrect: false,
        rationale:
          'Souls are pulled into the Amnesia Vortex, memory-wiped, then forced into new vessels.',
      },
      {
        label: 'B',
        text: 'Upon death, souls are pulled into the Amnesia Vortex, routed through portals beneath the Vatican, stripped of memories, and assigned to new infant vessels via advanced Grey extraterrestrial technology.',
        isCorrect: true,
        rationale:
          'Amnesia Vortex → Vatican portals → memory strip → Grey tech into new infant bodies for continuous loosh harvest.',
      },
      {
        label: 'C',
        text: 'Only animals reincarnate; human souls permanently exit the simulation at first death without recycling.',
        isCorrect: false,
        rationale:
          'Human souls are recycled in a closed loop to keep the simulation populated for harvest.',
      },
      {
        label: 'D',
        text: 'Cloning factories print empty bodies with no soul insertion, no vortex, and no Grey technology involved.',
        isCorrect: false,
        rationale:
          'Deceased souls are memory-wiped and inserted into new vessels through the vortex-Vatican-Grey path.',
      },
    ],
    hint: 'Amnesia Vortex — Vatican portals — Grey tech — new vessels.',
    correctAnswer: 'B',
  },
  {
    number: 18,
    question: 'What is the moon in this simulation architecture?',
    options: [
      {
        label: 'A',
        text: 'A pure natural rock that formed randomly and never hosts technology, energy harvest, or frequency work.',
        isCorrect: false,
        rationale:
          'The moon is a holographic shell hiding a negative ET space station used for energy and frequency control.',
      },
      {
        label: 'B',
        text: 'A solid gold idol sitting on the North Pole with no role in sky imagery or soul systems.',
        isCorrect: false,
        rationale:
          'Gold idols relate to ULF dampening on the plain; the moon is a holographic ET station shell.',
      },
      {
        label: 'C',
        text: 'A friendly rescue station run by the G.A.A. that only heals children and never harvests energy.',
        isCorrect: false,
        rationale:
          'It is a negative extraterrestrial space station for harvest and frequency manipulation.',
      },
      {
        label: 'D',
        text: 'Not a natural satellite, but a holographic shell hiding a negative extraterrestrial space station that harvested energy and manipulated frequencies.',
        isCorrect: true,
        rationale:
          'Moon = holographic shell over a negative ET station for energy harvest and frequency control.',
      },
    ],
    hint: 'Holographic shell — negative ET space station.',
    correctAnswer: 'D',
  },
  {
    number: 19,
    question: 'What are asteroids in the sky theater of the simulation?',
    options: [
      {
        label: 'A',
        text: 'Genuine rocks from deep vacuum space that randomly threaten Earth with unscripted extinction events.',
        isCorrect: false,
        rationale:
          'Asteroids are not space debris; they are projections on the Projection Dome.',
      },
      {
        label: 'B',
        text: 'Projections on the Projection Dome — not space debris — occasionally synchronized with biological weapons fired through portals by parasites.',
        isCorrect: true,
        rationale:
          'Asteroid events are dome projections, sometimes timed with portal-delivered biological weapons.',
      },
      {
        label: 'C',
        text: 'Friendly supply crates dropped by the Source to feed cities during famine without any projection layer.',
        isCorrect: false,
        rationale:
          'They are false sky projections used in control theater, not Source supply drops.',
      },
      {
        label: 'D',
        text: 'Only metaphors in ancient poetry that never appear as visual events in the modern night sky.',
        isCorrect: false,
        rationale:
          'They appear as projected sky events on the dome, sometimes synced to weaponized operations.',
      },
    ],
    hint: 'Projection Dome images — not real space debris.',
    correctAnswer: 'B',
  },
  {
    number: 20,
    question:
      'What was the current 3rd-density simulation before Custodian downgrade, and how was the fall achieved?',
    options: [
      {
        label: 'A',
        text: 'It was always 3rd density from first creation, with no 9th-density past and no destroyed power source.',
        isCorrect: false,
        rationale:
          'It was once a vibrant 9th-density plain on Gateway-10 before parasitic downgrade.',
      },
      {
        label: 'B',
        text: 'It was a digital-only dreamworld with no physical plain, Spirit Tree, or gold-based frequency weapons.',
        isCorrect: false,
        rationale:
          'It was a physical 9th-density plain; Custodians destroyed the Spirit Tree and used gold ULF fields.',
      },
      {
        label: 'C',
        text: 'A highly vibrant 9th-density physical plain on Gateway-10; Custodians destroyed the Spirit Tree (Mt Meru / Hyperborea) and deployed massive fields of extracted gold idols broadcasting ULF dampening fields.',
        isCorrect: true,
        rationale:
          'Downgrade path: kill Spirit Tree / Mt Meru power source + gold-idol ULF dampening on Gateway-10.',
      },
      {
        label: 'D',
        text: 'A 12th-density music realm that fell only because humans invented radio and drowned out the songs.',
        isCorrect: false,
        rationale:
          'Fall came from Custodian destruction of the Spirit Tree and gold ULF fields, not human radio.',
      },
    ],
    hint: '9th-density Gateway-10 — Spirit Tree / Mt Meru — gold ULF idols.',
    correctAnswer: 'C',
  },
  {
    number: 21,
    question:
      'How do parasitic controllers maintain simulation integrity across ages?',
    options: [
      {
        label: 'A',
        text: 'By open transparent archives, unbroken family memory, and free public access to every prior civilization.',
        isCorrect: false,
        rationale:
          'They systemically delete history via cyclical Re-sets and repopulate with fabricated narratives.',
      },
      {
        label: 'B',
        text: 'Through cyclical Re-sets every thousand years that liquidate populations via soil liquefaction (Mud-floods) and energy weapons, then repopulate with mind-wiped clone Orphans trained by surviving Freemasons into new false history and science.',
        isCorrect: true,
        rationale:
          'Thousand-year Re-sets, Mud-floods, energy weapons, clone Orphans, and Freemason re-education keep the lie stable.',
      },
      {
        label: 'C',
        text: 'By never killing anyone and simply asking people politely to forget inconvenient buildings and maps.',
        isCorrect: false,
        rationale:
          'Re-sets are violent population liquidations, not polite memory requests.',
      },
      {
        label: 'D',
        text: 'By freezing time completely so no new generation is ever born and no history needs rewriting.',
        isCorrect: false,
        rationale:
          'They recycle and repopulate after catastrophic resets rather than freezing birth forever.',
      },
    ],
    hint: 'Re-sets every ~1000 years — Mud-floods — clone Orphans — Freemasons.',
    correctAnswer: 'B',
  },
  {
    number: 22,
    question:
      'What three artificial control strings keep psychological belief in the simulation locked?',
    options: [
      {
        label: 'A',
        text: 'Cooking, fashion design, and professional sports as the only pillars of consensus reality.',
        isCorrect: false,
        rationale:
          'The three strings are Religion, Finance, and Perceived Knowledge.',
      },
      {
        label: 'B',
        text: 'Religion (worship of false or demonic deities), Finance (pursuit of fake monetary value), and Perceived Knowledge (indoctrination into false history and heliocentric globe-earth models).',
        isCorrect: true,
        rationale:
          'Religion, Finance, and Perceived Knowledge are the three artificial strings of simulation persistence.',
      },
      {
        label: 'C',
        text: 'Only military draft law, with no role for temples, banks, schools, or globe mythology.',
        isCorrect: false,
        rationale:
          'Psychological lock uses religion, money, and false knowledge systems together.',
      },
      {
        label: 'D',
        text: 'Pure love, free energy for all, and transparent history teaching in every school.',
        isCorrect: false,
        rationale:
          'Those liberate; the control strings are religion, fake money, and false knowledge.',
      },
    ],
    hint: 'Religion — Finance — Perceived Knowledge.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question:
      'How does the Galactic Ancestral Alliance (G.A.A.) begin the forced conclusion of the simulation?',
    options: [
      {
        label: 'A',
        text: 'With a silent private email to bankers only, leaving the public matrix story untouched forever.',
        isCorrect: false,
        rationale:
          'Opening move is the EBS broadcasting undeniable truths about the matrix\'s history to the masses.',
      },
      {
        label: 'B',
        text: 'By immediately evaporating all matter with no broadcast, no disclosure, and no staged invasion theater.',
        isCorrect: false,
        rationale:
          'Sequence starts with EBS disclosure, then Fake Alien Invasion holographics, before dome teardown.',
      },
      {
        label: 'C',
        text: 'With the EBS (Emergency Broadcast System) broadcasting undeniable truths about the matrix\'s history, before the later invasion and dome events.',
        isCorrect: true,
        rationale:
          'G.A.A. opens with EBS truth broadcast as the first public strike on simulation belief.',
      },
      {
        label: 'D',
        text: 'By asking Custodians to kindly resign and keep the Projection Dome running as a tourist attraction.',
        isCorrect: false,
        rationale:
          'Conclusion is forced: EBS truths, then Bluebeam invasion theater, then dome deactivation.',
      },
    ],
    hint: 'G.A.A. opens with EBS — undeniable matrix history.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question:
      'What follows EBS disclosure in the climax sequence, and what happens to the Projection Dome?',
    options: [
      {
        label: 'A',
        text: 'A gentle weather report, after which the dome is upgraded and made permanent for all future ages.',
        isCorrect: false,
        rationale:
          'A traumatizing Fake Alien Invasion via Project Bluebeam comes next; then G.A.A. deactivates the dome.',
      },
      {
        label: 'B',
        text: 'A highly traumatizing Fake Alien Invasion projected into the sky via Project Bluebeam holographics; at climax the G.A.A. permanently deactivates the artificial Projection Dome so the sky tears open into intense pixelation and the bright white true plain.',
        isCorrect: true,
        rationale:
          'Bluebeam fake invasion traumatizes the herd; then dome death exposes white true expanse and collapses false paradigms.',
      },
      {
        label: 'C',
        text: 'Immediate permanent peace treaties with no sky theater, no pixelation, and no psychological shock.',
        isCorrect: false,
        rationale:
          'Fake invasion holographics and dome teardown produce absolute psychological collapse for the anchored.',
      },
      {
        label: 'D',
        text: 'Only a music festival on the moon station while the black night sky stays exactly as programmed.',
        isCorrect: false,
        rationale:
          'False blackness dissolves into pixelation; bright white true plain is exposed after dome shutdown.',
      },
    ],
    hint: 'Bluebeam Fake Alien Invasion — G.A.A. kills Projection Dome — white plain.',
    correctAnswer: 'B',
  },
  {
    number: 25,
    question:
      'What is the final uninstall flash of the simulation, and what happens to the 97% NPC population?',
    options: [
      {
        label: 'A',
        text: 'A 30-second EMF (Electro Magnetic Frequency) flash; NPCs with only 4th-density replica souls lack the harmonic architecture to survive and instantly evaporate into the Aether, leaving a reduced population of genuine souls in restored, de-pixelating reality.',
        isCorrect: true,
        rationale:
          'Final 30-second EMF flash uninstalls the matrix; synthetic NPCs evaporate; genuine souls remain.',
      },
      {
        label: 'B',
        text: 'A ten-year soft software update that upgrades every NPC into full organic 9th-density soul status automatically.',
        isCorrect: false,
        rationale:
          'NPCs cannot survive the high-frequency shift; they evaporate rather than upgrade into organic souls.',
      },
      {
        label: 'C',
        text: 'A silent lights-out for genuine souls only, while NPCs inherit the restored crystalline plain forever.',
        isCorrect: false,
        rationale:
          'Genuine souls remain; the 97% synthetic population evaporates into the Aether.',
      },
      {
        label: 'D',
        text: 'No frequency event at all — only a paper decree from banks that renames the simulation without changing density.',
        isCorrect: false,
        rationale:
          'Uninstall is a real 30-second EMF flash that clears synthetic population from the field.',
      },
    ],
    hint: '30-second EMF flash — NPCs evaporate — genuine souls remain.',
    correctAnswer: 'A',
  },
];

function normalizeQuestion(q) {
  const mapped = q.options.map((o) => ({
    label: o.label,
    text: cleanText(o.text),
    isCorrect: !!o.isCorrect,
    rationale: cleanText(o.rationale),
  }));
  const finalized = finalizeOptions(
    mapped,
    `${typeof TOPIC_ID !== 'undefined' ? TOPIC_ID : 'quiz'}::${q.number}`
  );
  const options = finalized.options;
  const correct = options.find((o) => o.isCorrect);
  if (!correct) throw new Error(`Q${q.number}: no correct option`);
  /* correct letter assigned by finalizeOptions shuffle */
  const out = {
    number: q.number,
    question: cleanText(q.question),
    options,
    hint: cleanText(q.hint),
    correctAnswer: finalized.correctAnswer,
  };
  const blob = [
    out.question,
    out.hint,
    ...options.map((o) => `${o.text} ${o.rationale}`),
  ].join('\n');
  if (latexRe.test(blob) || /\$/.test(blob)) {
    throw new Error(`Q${q.number}: LaTeX/$ found`);
  }
  if (hedgeRe.test(blob)) throw new Error(`Q${q.number}: hedge found`);
  const missing = (supportPhrases[q.number] || []).filter(
    (p) => !reportLower.includes(p.toLowerCase())
  );
  if (missing.length) {
    throw new Error(`Q${q.number}: unsupported: ${missing.join('; ')}`);
  }
  if (options.filter((o) => o.isCorrect).length !== 1) {
    throw new Error(`Q${q.number}: need exactly 1 correct`);
  }
  for (const o of options) {
    if (!o.rationale || o.rationale.length < 8) {
      throw new Error(`Q${q.number}${o.label}: short rationale`);
    }
  }
  return out;
}

const questions = RAW_QUESTIONS.map(normalizeQuestion);
if (questions.length !== 25) throw new Error(`Expected 25, got ${questions.length}`);

const letterCounts = { A: 0, B: 0, C: 0, D: 0 };
for (const q of questions) letterCounts[q.correctAnswer]++;
if (letterCounts.A === 25) {
  throw new Error('correctAnswer still all A after finalizeOptions');
}
const dominant = Math.max(...Object.values(letterCounts));
if (dominant >= 15) {
  console.warn('Warning: one letter has >= 15 corrects:', letterCounts);
}

const DESC_SHORT =
  'Test your grasp of Simulation Reality — Aether software, Custodian hijack, NPCs, Projection Dome, Amnesia Vortex, control strings, and the G.A.A. uninstall.';
const DESC_META =
  'Interactive Living Truth Quiz on Simulation Reality: the corrupted 3rd-density construct, Aether manifestation, 97% NPCs, Overlays, Black Void Plasma, reincarnation loop, Re-sets, EBS, Bluebeam, and the 30-second EMF flash.';

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle: DESC_SHORT,
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'Simulation Reality is the controlled 3rd-density prison running on Aether software — hijacked by Custodians from a once-vibrant 9th-density Gateway-10 plain. NPCs, Overlays, Black Void Plasma, the Projection Dome, and the Amnesia Vortex are not metaphors; they are the harvest machine. Religion, Finance, and Perceived Knowledge are the three strings that keep the mind hooked. Sit with what you missed, then return to the Simulation Reality deep-dive. G.A.A. opens with EBS truth, Bluebeam invasion theater, dome death into white Dark Matter, and a 30-second EMF flash that evaporates the synthetic 97%. Hold frequency as a genuine soul — the uninstall does not wait for permission.',
  },
  relatedTopic: {
    href: `/deep-dive.html?source=${SOURCE}&topic=${TOPIC_ID}`,
    label: `Return to ${TOPIC_TITLE} deep-dive`,
  },
  questions,
};

const whole = JSON.stringify(quiz);
if (/\$/.test(whole) || latexRe.test(whole) || hedgeRe.test(whole)) {
  throw new Error('LaTeX or hedge remains in quiz payload');
}

const quizDir = path.join(ROOT, 'data', 'quizzes', SOURCE);
fs.mkdirSync(quizDir, { recursive: true });
const quizJsonPath = path.join(quizDir, `${TOPIC_ID}.json`);
fs.writeFileSync(quizJsonPath, JSON.stringify(quiz, null, 2) + '\n', 'utf8');

const quizMeta = {
  href: `quiz/${SOURCE}/${TOPIC_ID}.html`,
  title: TOPIC_TITLE,
  totalQuestions: 25,
  description: DESC_SHORT,
};
topic.quiz = quizMeta;
fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2) + '\n', 'utf8');

const monoPath = path.join(ROOT, 'data', 'alice-topics.json');
const mono = JSON.parse(fs.readFileSync(monoPath, 'utf8'));
function findAndPatch(topics) {
  for (const t of topics) {
    if (t.id === TOPIC_ID) {
      t.quiz = quizMeta;
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error(`${TOPIC_ID} not found in alice-topics.json`);
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

let html = fs.readFileSync(
  path.join(ROOT, 'quiz', 'alice', 'nature-of-reality.html'),
  'utf8'
);
const replacements = [
  ['Nature of Reality Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Nature of Reality: the flat plain, Firmament, density suppression, and the Great Spiritual Awakening.',
    DESC_META,
  ],
  ['quiz/alice/nature-of-reality.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/nature-of-reality.webp', TOPIC_IMAGE],
  ['images/faketime.webp', TOPIC_IMAGE],
  [
    'deep-dive.html?source=alice&amp;topic=nature-of-reality',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`,
  ],
  ['Nature of Reality deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Nature of Reality</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/alice/nature-of-reality.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`,
  ],
];
for (const [a, b] of replacements) {
  if (!html.includes(a) && a.includes('nature-of-reality')) {
    console.warn('Template string not found:', a.slice(0, 80));
  }
  html = html.split(a).join(b);
}
if (html.includes('images/nature-of-reality.webp')) {
  html = html.split('images/nature-of-reality.webp').join(TOPIC_IMAGE);
}
const htmlPath = path.join(ROOT, 'quiz', SOURCE, `${TOPIC_ID}.html`);
fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const lines = sm.split('\n');
  const out = [];
  let inserted = false;
  const target = `/quiz/${SOURCE}/${TOPIC_ID}.html`;
  for (let i = 0; i < lines.length; i++) {
    out.push(lines[i]);
    if (!inserted && lines[i].includes("/quiz/alice/") && lines[i].includes('priority')) {
      const next = lines[i + 1] || '';
      const curPath = (lines[i].match(/path: '([^']+)'/) || [])[1] || '';
      const nextPath = (next.match(/path: '([^']+)'/) || [])[1] || '';
      if (
        curPath < target &&
        (nextPath > target || !nextPath.includes('/quiz/alice/'))
      ) {
        out.push(entry);
        inserted = true;
      }
    }
  }
  if (!inserted) {
    const anchors = [
      "  { path: '/quiz/alice/grey-ets.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/giant-skeletons.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/gateway-10-system.html', priority: '0.75', changefreq: 'monthly' },",
    ];
    sm = out.join('\n');
    for (const anchor of anchors) {
      if (sm.includes(anchor)) {
        sm = sm.replace(anchor, `${anchor}\n${entry}`);
        inserted = true;
        break;
      }
    }
    if (!inserted) throw new Error('Could not find sitemap anchor');
    fs.writeFileSync(sitemapScript, sm, 'utf8');
  } else {
    fs.writeFileSync(sitemapScript, out.join('\n'), 'utf8');
  }
}

console.log('Correct-answer letter mix:', letterCounts);
console.log('Sample correct answers:');
[0, 6, 11, 18, 20, 24].forEach((i) => {
  const c = questions[i].options.find((o) => o.isCorrect);
  console.log(
    ` Q${questions[i].number} (${questions[i].correctAnswer}): ${c.text.slice(0, 100)}`
  );
});
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log(
  'PASS: audited 25/25 against data/alice-topics/simulation-reality.json'
);
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
