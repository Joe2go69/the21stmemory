/**
 * Installs Fake Alien Invasion quiz for Alice transmission.
 * All 25 items from data/alice-topics/fake-alien-invasion.json only.
 * Plain English; absolute Living Truth voice.
 * Run: node scripts/install-fake-alien-invasion-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'fake-alien-invasion';
const TOPIC_TITLE = 'Fake Alien Invasion';
const SOURCE = 'alice';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['holographic', 'ascension event', 'great spiritual awakening'],
  2: ['ebs', 'lockdown', 'scare event'],
  3: ['soul-architecture', 'parasitic takeover', 'never occur again'],
  4: ['sky event', 'emf', 'demographic'],
  5: ['non-physical', 'holographic sky battle', 'maximum terror'],
  6: ['project bluebeam', 'ufos', 'fake alien'],
  7: ['30-second', '97%', 'bright white flash'],
  8: ['ebs', 'atrocities', 'lockdown'],
  9: ['galactic ancestral alliance', 'overlays', 'sky events'],
  10: ['npc', '97%', 'true souls'],
  11: ['sleepers', 'taran', 'trauma'],
  12: ['no physical', 'holographic projections', 'software'],
  13: ['high altitudes', 'will not land', 'benevolent'],
  14: ['valve', 'mt meru', 'north pole', 'ice wall'],
  15: ['end of the ebs', 'child sacrifice', 'religious'],
  16: ['levitated', 'beamed up', 'hundreds'],
  17: ['projection dome', 'polaris', 'bright white light'],
  18: ['30 seconds', 'overlays', 'g.a.a'],
  19: ['vanish', 'nuclear weapons', 'hoax'],
  20: ['520 million', '97%', 'vanished'],
  21: ['178,000-year', 'custodians', 'anuk', 'grey'],
  22: ['religion', 'finance', 'perceived knowledge'],
  23: ['amnesia vortex', 'spherical earth', 'false science'],
  24: ['fail-safe', '3%', 'starseeds', 'selling their souls'],
  25: ['178,000 years', 'soul families', 'harmonic manifestation'],
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
      'What is the Fake Alien Invasion within the Ascension Event?',
    options: [
      {
        label: 'A',
        text: 'A staged, highly advanced holographic event engineered for the final stages of the Ascension Event / Great Spiritual Awakening.',
        isCorrect: true,
        rationale:
          'The Fake Alien Invasion is a staged, highly advanced holographic event engineered for the final stages of the Ascension Event (Great Spiritual Awakening).',
      },
      {
        label: 'B',
        text: 'A spontaneous natural meteor shower with no planning.',
        isCorrect: false,
        rationale:
          'It is meticulously engineered holographic theater, not a natural accident.',
      },
      {
        label: 'C',
        text: 'A permanent physical occupation by landing Anuk fleets.',
        isCorrect: false,
        rationale:
          'There is no physical ground threat; craft seen in the attack are holographic.',
      },
      {
        label: 'D',
        text: 'Only a silent library update with no sky visuals.',
        isCorrect: false,
        rationale:
          'It is a planetary sky battle and abduction scare with maximum visual impact.',
      },
    ],
    hint: 'Staged holographic climax of Ascension / Great Spiritual Awakening.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question:
      'When is the invasion orchestrated to occur, and what is its primary scare function?',
    options: [
      {
        label: 'A',
        text: 'To coincide with global lockdowns and the EBS as a calculated scare event inducing severe psychological trauma and panic among the unawakened.',
        isCorrect: true,
        rationale:
          'It is timed with global lockdowns and EBS to serve as a calculated scare event, inducing severe psychological trauma and panic in the unawakened.',
      },
      {
        label: 'B',
        text: 'Only after all NPCs have already peacefully graduated to 5th density.',
        isCorrect: false,
        rationale:
          'NPCs are removed during the EMF flash that climaxes the invasion sequence.',
      },
      {
        label: 'C',
        text: 'As a calm tourist show with no fear component.',
        isCorrect: false,
        rationale:
          'Maximum terror is the designed psychological function.',
      },
      {
        label: 'D',
        text: 'Decades after the EMF flash as optional entertainment.',
        isCorrect: false,
        rationale:
          'It precedes and climaxes into the Sky Event and EMF flash.',
      },
    ],
    hint: 'With lockdowns + EBS — engineered peak fear.',
    correctAnswer: 'A',
  },
  {
    number: 3,
    question:
      'Why must survivors experience this extreme emotional state?',
    options: [
      {
        label: 'A',
        text: 'To permanently hardwire the epochal transition into soul-architecture so a parasitic takeover of the physical plain can never occur again.',
        isCorrect: true,
        rationale:
          'Extreme emotion permanently hardwires the transition into survivor soul-architecture, ensuring parasitic takeover of the physical plain never happens again.',
      },
      {
        label: 'B',
        text: 'To sell more Project Bluebeam tickets for annual festivals.',
        isCorrect: false,
        rationale:
          'It is a one-time Ascension fail-safe, not commercial entertainment.',
      },
      {
        label: 'C',
        text: 'To help NPCs keep their jobs in the matrix forever.',
        isCorrect: false,
        rationale:
          'NPCs are permanently removed in the flash; trauma serves true-soul future immunity.',
      },
      {
        label: 'D',
        text: 'To restore false religious deities as planetary kings.',
        isCorrect: false,
        rationale:
          'EBS and invasion shatter false deities and other strings of bondage.',
      },
    ],
    hint: 'Soul-architecture hardwire — never again parasitic plain.',
    correctAnswer: 'A',
  },
  {
    number: 4,
    question:
      'What does the invasion sequence culminate in?',
    options: [
      {
        label: 'A',
        text: 'The Sky Event and the EMF flash, which radically alter demographic and physical reality of the realm.',
        isCorrect: true,
        rationale:
          'The invasion sequence culminates in the Sky Event and EMF flash, radically altering demographic and physical reality.',
      },
      {
        label: 'B',
        text: 'A permanent holographic sky battle with no end.',
        isCorrect: false,
        rationale:
          'Holographic UFOs vanish after the flash; the sequence has a defined climax.',
      },
      {
        label: 'C',
        text: 'Only a soft radio apology from the Custodians.',
        isCorrect: false,
        rationale:
          'Climax is Sky Event dome removal plus 30-second EMF flash.',
      },
      {
        label: 'D',
        text: 'Immediate restart of the Amnesia Vortex for everyone.',
        isCorrect: false,
        rationale:
          'Trauma helps shatter Amnesia Vortex programming for survivors, not restart it for all.',
      },
    ],
    hint: 'Sky Event + EMF flash = demographic/physical reset.',
    correctAnswer: 'A',
  },
  {
    number: 5,
    question:
      'What is the Fake Alien Invasion by definition?',
    options: [
      {
        label: 'A',
        text: 'A staged, non-physical, holographic sky battle and abduction scenario used to induce maximum terror before the final reset of the realm.',
        isCorrect: true,
        rationale:
          'It is defined as a staged, non-physical, holographic sky battle and abduction scenario inducing maximum terror prior to the final realm reset.',
      },
      {
        label: 'B',
        text: 'A ground invasion of solid metal ships docking in every city.',
        isCorrect: false,
        rationale:
          'It is non-physical and holographic — no ground extraterrestrial threat.',
      },
      {
        label: 'C',
        text: 'A silent meditation with no visual sky content.',
        isCorrect: false,
        rationale:
          'It is a full sky-battle and abduction scare display.',
      },
      {
        label: 'D',
        text: 'Only animal migration patterns misread as UFOs.',
        isCorrect: false,
        rationale:
          'After the flash the quiet includes absence of animal and bird noise for survivors; the invasion itself is Project Bluebeam holograms.',
      },
    ],
    hint: 'Non-physical holographic sky battle + abductions = max terror.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question:
      'What is Project Bluebeam in this sequence?',
    options: [
      {
        label: 'A',
        text: 'Advanced holographic projection technology simulating UFOs and extraterrestrial abductions — visually convincing but entirely fake.',
        isCorrect: true,
        rationale:
          'Project Bluebeam is advanced holographic projection technology used to simulate UFOs and abductions in the sky: convincing, entirely fake.',
      },
      {
        label: 'B',
        text: 'A real Greys-only landing fleet under Anuk command.',
        isCorrect: false,
        rationale:
          'Hostile craft of the scare are fake holograms; parasites are the historical enemy, not the landing force of this show.',
      },
      {
        label: 'C',
        text: 'A soft finance reform bill with no sky projections.',
        isCorrect: false,
        rationale:
          'Bluebeam is sky hologram tech, not a finance statute.',
      },
      {
        label: 'D',
        text: 'The 30-second white flash itself with no UFO visuals.',
        isCorrect: false,
        rationale:
          'The EMF flash is separate climax; Bluebeam is the UFO/abduction sky show.',
      },
    ],
    hint: 'Holographic UFOs and abductions — fake but convincing.',
    correctAnswer: 'A',
  },
  {
    number: 7,
    question:
      'What is the EMF / Flash at the climax of the Fake Alien Invasion?',
    options: [
      {
        label: 'A',
        text: 'A 30-second bright white flash that instantly disintegrates 97% of the global population.',
        isCorrect: true,
        rationale:
          'The EMF flash is a 30-second bright white flash at climax that instantly disintegrates 97% of the global population.',
      },
      {
        label: 'B',
        text: 'A 178,000-year grey dusk with no population change.',
        isCorrect: false,
        rationale:
          'Duration is 30 seconds; 97% population is removed.',
      },
      {
        label: 'C',
        text: 'A soft candle vigil restoring all Three Strings.',
        isCorrect: false,
        rationale:
          'It strips overlays and removes NPCs; it does not restore false strings.',
      },
      {
        label: 'D',
        text: 'Only a test tone heard by animals.',
        isCorrect: false,
        rationale:
          'It is a planetary bright white light with mass demographic effect.',
      },
    ],
    hint: '30-second white flash; 97% disintegrated.',
    correctAnswer: 'A',
  },
  {
    number: 8,
    question:
      'How does the EBS relate to the Fake Alien Invasion?',
    options: [
      {
        label: 'A',
        text: 'EBS is a global lockdown and information broadcast period overlapping the invasion, exposing historical atrocities of the parasitic control system.',
        isCorrect: true,
        rationale:
          'EBS is a global lockdown and information broadcast overlapping the Fake Alien Invasion, designed to expose historical atrocities of the parasitic control system.',
      },
      {
        label: 'B',
        text: 'EBS only plays music after all holograms end.',
        isCorrect: false,
        rationale:
          'EBS runs through lockdown and overlaps the invasion with atrocity disclosure.',
      },
      {
        label: 'C',
        text: 'EBS cancels Project Bluebeam permanently before any scare.',
        isCorrect: false,
        rationale:
          'Invasion occurs toward the end of EBS lockdown, after shock from disclosures.',
      },
      {
        label: 'D',
        text: 'EBS is identical to the Valve at Mt Meru only.',
        isCorrect: false,
        rationale:
          'The Valve projects holograms; EBS is the disclosure lockdown broadcast.',
      },
    ],
    hint: 'Lockdown disclosure overlapping the scare.',
    correctAnswer: 'A',
  },
  {
    number: 9,
    question:
      'What is the G.A.A.\'s role in this event?',
    options: [
      {
        label: 'A',
        text: 'Benevolent extraterrestrial and ancestral coalition managing the Ascension Event, dismantling fake reality overlays, and overseeing the sky events.',
        isCorrect: true,
        rationale:
          'G.A.A. is the benevolent extraterrestrial and ancestral coalition managing Ascension, dismantling fake overlays, and overseeing sky events.',
      },
      {
        label: 'B',
        text: 'The same as Custodians, Anuk, and Greys running Loosh farms.',
        isCorrect: false,
        rationale:
          'Those are 4th-density parasites of the 178,000-year conflict; G.A.A. dismantles their matrix.',
      },
      {
        label: 'C',
        text: 'A finance committee setting fiat interest rates only.',
        isCorrect: false,
        rationale:
          'G.A.A. manages Ascension mechanics and sky events, not fiat policy.',
      },
      {
        label: 'D',
        text: 'NPC managers who vanish in the first second of Bluebeam.',
        isCorrect: false,
        rationale:
          'NPCs vanish in the EMF flash; G.A.A. runs the liberation sequence.',
      },
    ],
    hint: 'Benevolent managers of Ascension, overlays, sky events.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question:
      'What are NPCs in this framework?',
    options: [
      {
        label: 'A',
        text: 'Cloned, synthetic, or artificially generated human vessels lacking true souls — 97% of the population — permanently removed during the EMF flash.',
        isCorrect: true,
        rationale:
          'NPCs are cloned/synthetic/artificial vessels without true souls, 97% of population, all permanently removed in the EMF flash.',
      },
      {
        label: 'B',
        text: 'The only survivors who reach 520 million automatically as kings.',
        isCorrect: false,
        rationale:
          'Survivors are the remaining true souls (~520 million max); NPCs are the 97% removed.',
      },
      {
        label: 'C',
        text: 'High-density observers at altitude who refuse to land.',
        isCorrect: false,
        rationale:
          'Those are legitimate benevolent craft; NPCs are ground population synthetics.',
      },
      {
        label: 'D',
        text: 'Sleepers who already awakened fully before EBS.',
        isCorrect: false,
        rationale:
          'Sleepers are unawakened true souls; NPCs lack true souls entirely.',
      },
    ],
    hint: '97% soulless vessels — gone in the flash.',
    correctAnswer: 'A',
  },
  {
    number: 11,
    question:
      'Who are Sleepers?',
    options: [
      {
        label: 'A',
        text: 'True Taran humans or extraterrestrial souls who failed to awaken before the event and will experience the invasion in severe trauma.',
        isCorrect: true,
        rationale:
          'Sleepers are true Taran or ET souls who failed to awaken prior to the event and experience the invasion in severe trauma.',
      },
      {
        label: 'B',
        text: 'NPCs who graduated into true souls during Bluebeam.',
        isCorrect: false,
        rationale:
          'NPCs are removed; Sleepers are unawakened true souls who still survive the demographic cut if they are true souls.',
      },
      {
        label: 'C',
        text: 'Only animals silenced after the flash.',
        isCorrect: false,
        rationale:
          'Post-flash quiet lacks animal/bird noise for survivors; Sleepers are unawakened true humans/ET souls.',
      },
      {
        label: 'D',
        text: 'G.A.A. operators inside the Valve only.',
        isCorrect: false,
        rationale:
          'G.A.A. manages the event; Sleepers are the traumatized unawakened true population.',
      },
    ],
    hint: 'Unawakened true souls — invasion hits as severe trauma.',
    correctAnswer: 'A',
  },
  {
    number: 12,
    question:
      'Is there any physical extraterrestrial ground threat in the Fake Alien Invasion?',
    options: [
      {
        label: 'A',
        text: 'No — absolutely no physical ET threat on the ground; perceived hostile spacecraft are entirely holographic software projections with no actual occupants or substance.',
        isCorrect: true,
        rationale:
          'Defining trait: absolutely no physical ET ground threat; hostile craft are fully holographic software projections without occupants or physical substance.',
      },
      {
        label: 'B',
        text: 'Yes — Anuk land in every capital with solid ships.',
        isCorrect: false,
        rationale:
          'No landings of the scare craft; they are holograms.',
      },
      {
        label: 'C',
        text: 'Yes — nuclear weapons will be used by invaders.',
        isCorrect: false,
        rationale:
          'Nuclear weapons are a hoax and will not be used; survivors misread devastation as nukes or alien weapons.',
      },
      {
        label: 'D',
        text: 'Only grey physical abductions of hundreds at a time for real.',
        isCorrect: false,
        rationale:
          'Levitations and beam-ups are Bluebeam holograms for panic, not solid craft operations.',
      },
    ],
    hint: 'Zero ground ET threat — pure hologram software.',
    correctAnswer: 'A',
  },
  {
    number: 13,
    question:
      'What about legitimate high-density craft during the display?',
    options: [
      {
        label: 'A',
        text: 'Some benevolent craft station at high altitudes to observe only — they will not land, engage, or interact because the surface is dangerous and human trauma intervention is prohibited.',
        isCorrect: true,
        rationale:
          'Legitimate high-density craft may observe at high altitude but will not land, engage, or interact; surface remains dangerous and intervening in necessary human trauma is strictly prohibited.',
      },
      {
        label: 'B',
        text: 'They land immediately to stop all fear and cancel Ascension.',
        isCorrect: false,
        rationale:
          'Intervention in the necessary trauma is prohibited; they stay aloft as observers.',
      },
      {
        label: 'C',
        text: 'They are the same as Project Bluebeam holograms.',
        isCorrect: false,
        rationale:
          'Holograms are the scare show; high-altitude craft are real observers, not the fake attack.',
      },
      {
        label: 'D',
        text: 'They beam up hundreds of people for permanent off-world slavery.',
        isCorrect: false,
        rationale:
          'Beam-ups in media and sky are holographic scare content, not benevolent craft abductions.',
      },
    ],
    hint: 'Real observers high up — no landing, no intervention.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question:
      'Where is the holographic technology generated, and how far can it cover?',
    options: [
      {
        label: 'A',
        text: 'From the Valve at Mt Meru / Black Rock / Hyperborea at the North Pole geographic center, projecting outward to cover the entire realm inside the ice wall.',
        isCorrect: true,
        rationale:
          'Benevolent holographic tech sits in the Valve at Mt Meru / Black Rock / Hyperborea (North Pole center), projecting outward across the whole realm inside the ice wall.',
      },
      {
        label: 'B',
        text: 'Only from handheld phones with no central source.',
        isCorrect: false,
        rationale:
          'Central Valve projection covers the entire ice-walled realm.',
      },
      {
        label: 'C',
        text: 'From Vatican asylums as Loosh battery exhaust only.',
        isCorrect: false,
        rationale:
          'Source is Mt Meru / Hyperborea Valve, not asylum infrastructure.',
      },
      {
        label: 'D',
        text: 'From spinning globe outer space studios beyond all ice walls.',
        isCorrect: false,
        rationale:
          'False spherical outer-space cosmology is what survivors must abandon; projection is from realm center inside the ice wall.',
      },
    ],
    hint: 'Valve at Mt Meru / North Pole — full ice-wall coverage.',
    correctAnswer: 'A',
  },
  {
    number: 15,
    question:
      'What psychological state is the population already in when the invasion hits toward the end of EBS lockdown?',
    options: [
      {
        label: 'A',
        text: 'Profound shock from EBS exposures of systemic atrocities, child sacrifice, and satanic control — with massive casualties already among religious and elderly from that shock.',
        isCorrect: true,
        rationale:
          'Toward end of EBS lockdown the population is already in profound shock from atrocity disclosures; religious and elderly have suffered massive casualties from that shock before the sky scare compounds it.',
      },
      {
        label: 'B',
        text: 'Calm celebration that all Three Strings were gently confirmed as true.',
        isCorrect: false,
        rationale:
          'EBS destroys trust in those false paradigms; people are in terror and shock.',
      },
      {
        label: 'C',
        text: 'Only mild boredom with weather reports.',
        isCorrect: false,
        rationale:
          'Disclosures of child sacrifice and satanic control produce profound shock.',
      },
      {
        label: 'D',
        text: 'Full 178,000-year memory already restored for everyone including NPCs.',
        isCorrect: false,
        rationale:
          'Full memory retrieval begins for survivors after the flash, not for all before invasion.',
      },
    ],
    hint: 'Already shattered by EBS atrocities — then sky terror.',
    correctAnswer: 'A',
  },
  {
    number: 16,
    question:
      'What do holographic abductions look like to the masses?',
    options: [
      {
        label: 'A',
        text: 'Sky filled with Project Bluebeam UFOs; TV and direct sight show hundreds at a time levitated and beamed up, triggering desperate directionless flight.',
        isCorrect: true,
        rationale:
          'Project Bluebeam UFOs fill the sky; broadcasts and eyes see groups of hundreds levitated and beamed up, triggering desperate, directionless mass flight.',
      },
      {
        label: 'B',
        text: 'Only single-file orderly boarding of real ships with tickets.',
        isCorrect: false,
        rationale:
          'It is chaotic terror response to holographic mass beam-ups, not orderly travel.',
      },
      {
        label: 'C',
        text: 'No visual content — only radio static.',
        isCorrect: false,
        rationale:
          'Full visual UFO and levitating crowd displays are central.',
      },
      {
        label: 'D',
        text: 'Only animals levitate while humans sleep through it.',
        isCorrect: false,
        rationale:
          'Human crowds are shown beamed up to maximize panic.',
      },
    ],
    hint: 'Hundreds levitated/beamed up → directionless flight.',
    correctAnswer: 'A',
  },
  {
    number: 17,
    question:
      'What is the Sky Event (dome removal) concurrent with the invasion?',
    options: [
      {
        label: 'A',
        text: 'G.A.A. switches off the Projection Dome inside the Firmament; sky undergoes melting pixelation from Polaris downward, exposing Dark Matter Field as bright white light — not black space.',
        isCorrect: true,
        rationale:
          'G.A.A. removes the Projection Dome inside the Firmament; melting pixelation from Polaris down exposes the Dark Matter Field as bright white light, not black space.',
      },
      {
        label: 'B',
        text: 'The dome thickens into permanent black vacuum forever.',
        isCorrect: false,
        rationale:
          'Dome is switched off; white light reality is revealed.',
      },
      {
        label: 'C',
        text: 'Only finance tickers appear across the horizon.',
        isCorrect: false,
        rationale:
          'Visual is melting pixelation and white-field reveal.',
      },
      {
        label: 'D',
        text: 'Polaris becomes a physical staircase for NPCs.',
        isCorrect: false,
        rationale:
          'Polaris is the start point of sky melt pixelation, not an NPC staircase.',
      },
    ],
    hint: 'Dome off; melt from Polaris; bright white field revealed.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question:
      'What happens during the exact 30-second EMF flash?',
    options: [
      {
        label: 'A',
        text: 'Bright white light envelops the realm for exactly 30 seconds while G.A.A. strips remaining reality Overlays.',
        isCorrect: true,
        rationale:
          'Climax EMF: bright white light for exactly 30 seconds as G.A.A. strips remaining reality Overlays.',
      },
      {
        label: 'B',
        text: 'Bluebeam holograms intensify for another 178,000 years.',
        isCorrect: false,
        rationale:
          'After flash dissipates, holographic UFOs vanish.',
      },
      {
        label: 'C',
        text: 'Nuclear weapons launch from every capital.',
        isCorrect: false,
        rationale:
          'Nuclear weapons are a hoax and will not be used.',
      },
      {
        label: 'D',
        text: 'Only Sleepers see soft grey mist with no overlay change.',
        isCorrect: false,
        rationale:
          'Overlays are stripped for the realm; light is bright white for 30 seconds.',
      },
    ],
    hint: 'Exactly 30 seconds white light; overlays stripped.',
    correctAnswer: 'A',
  },
  {
    number: 19,
    question:
      'After the flash, what do surviving Sleepers wrongly blame for the devastated pixelated landscape?',
    options: [
      {
        label: 'A',
        text: 'Alien energy weapons or nuclear strikes — though nuclear weapons are a hoax and will not be used; holographic UFOs have already vanished.',
        isCorrect: true,
        rationale:
          'After flash, holograms vanish; landscape shows pixelation, harmonic scaffolding, and devastation that Sleepers misattribute to alien weapons or nukes, though nukes are a hoax unused.',
      },
      {
        label: 'B',
        text: 'A peaceful G.A.A. flower ceremony with no damage visible.',
        isCorrect: false,
        rationale:
          'Landscape is devastated and pixelated with exposed scaffolding.',
      },
      {
        label: 'C',
        text: 'Carnegie library renovations only.',
        isCorrect: false,
        rationale:
          'Scale is realm-wide matrix architecture exposure, not library work.',
      },
      {
        label: 'D',
        text: 'Nothing — UFOs stay and continue beaming people indefinitely.',
        isCorrect: false,
        rationale:
          'Holographic UFOs vanish once the flash dissipates.',
      },
    ],
    hint: 'Misread as alien/nuke damage; nukes are hoax; holograms gone.',
    correctAnswer: 'A',
  },
  {
    number: 20,
    question:
      'What is the demographic outcome once the flash dissipates?',
    options: [
      {
        label: 'A',
        text: '97% of the population vanished; only an estimated 520 million people remain on the planet.',
        isCorrect: true,
        rationale:
          'Most critically, 97% vanish, leaving only an estimated 520 million people on the planet.',
      },
      {
        label: 'B',
        text: '100% remain and double overnight.',
        isCorrect: false,
        rationale:
          'Mass removal is the critical outcome; survivor estimate is 520 million.',
      },
      {
        label: 'C',
        text: 'Only animals remain; every human vanishes.',
        isCorrect: false,
        rationale:
          'True-soul survivors remain (~520 million); post-flash quiet lacks animal/bird noise as the environment is heavily altered.',
      },
      {
        label: 'D',
        text: 'Exactly 33 people remain, all Freemasons.',
        isCorrect: false,
        rationale:
          'Estimate is 520 million remaining true population, not 33 elites.',
      },
    ],
    hint: '97% gone; ~520 million left.',
    correctAnswer: 'A',
  },
  {
    number: 21,
    question:
      'What longer conflict is the Fake Alien Invasion the operational climax of?',
    options: [
      {
        label: 'A',
        text: 'A 178,000-year conflict against 4th-density parasites such as Custodians, Anuk/Anunnaki, and Grey ETs who ran Gateway-10 as a Loosh and Adrenochrome harvest matrix.',
        isCorrect: true,
        rationale:
          'It is the operational climax of a 178,000-year conflict against 4th-density parasites (Custodians, Anuk/Anunnaki, Grey ETs) who controlled Gateway-10 as a Loosh and Adrenochrome harvest matrix.',
      },
      {
        label: 'B',
        text: 'A 30-second argument about weather satellites only.',
        isCorrect: false,
        rationale:
          'Depth is 178,000 years of parasitic occupation conflict.',
      },
      {
        label: 'C',
        text: 'A friendly sports match between NPCs and Sleepers.',
        isCorrect: false,
        rationale:
          'It is climax of war against parasitic harvest control of Gateway-10.',
      },
      {
        label: 'D',
        text: 'Only a modern film franchise with no real history.',
        isCorrect: false,
        rationale:
          'It is real Ascension mechanics ending a multi-millennial occupation.',
      },
    ],
    hint: '178,000 years vs Custodians/Anuk/Greys harvest matrix.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question:
      'Why is a gentle transition to 5th+ density impossible for the unawakened?',
    options: [
      {
        label: 'A',
        text: 'NPC majority and unawakened true souls rigidly cling to the 3 Strings — Religion, Finance, and Perceived Knowledge — so only overlapping EBS + invasion trauma forces full psychological collapse.',
        isCorrect: true,
        rationale:
          'Unawakened cling to Religion, Finance, and Perceived Knowledge; gentle 5th+ transition is impossible, so overlapping EBS and invasion trauma force complete psychological collapse.',
      },
      {
        label: 'B',
        text: 'Because G.A.A. prefers endless Bluebeam loops without flash.',
        isCorrect: false,
        rationale:
          'Sequence ends in EMF flash and liberation, not endless loops.',
      },
      {
        label: 'C',
        text: 'Because all three strings already dissolved centuries ago for everyone.',
        isCorrect: false,
        rationale:
          'Unawakened still cling to those false paradigms until trauma shatters them.',
      },
      {
        label: 'D',
        text: 'Because nuclear weapons will gently educate the population.',
        isCorrect: false,
        rationale:
          'Nukes are a hoax; education is trauma-forced collapse of false frameworks.',
      },
    ],
    hint: 'Three Strings grip; only peak dual trauma breaks it.',
    correctAnswer: 'A',
  },
  {
    number: 23,
    question:
      'What does that psychological collapse achieve against programming?',
    options: [
      {
        label: 'A',
        text: 'Shatters the Amnesia Vortex and bypasses societal programming so survivors abandon false science (spherical Earth in dark space), false religious deities, and useless financial systems.',
        isCorrect: true,
        rationale:
          'Collapse shatters Amnesia Vortex and bypasses programming, forcing abandonment of false science (sphere in dark space), false deities, and useless finance.',
      },
      {
        label: 'B',
        text: 'Restores full trust in spherical Earth and fiat forever.',
        isCorrect: false,
        rationale:
          'Those are exactly the false systems survivors must abandon.',
      },
      {
        label: 'C',
        text: 'Restarts Loosh harvest under new Anuk branding.',
        isCorrect: false,
        rationale:
          'Purpose is ending parasitic subjugation, not rebranding harvest.',
      },
      {
        label: 'D',
        text: 'Converts all NPCs into Starseeds before they vanish.',
        isCorrect: false,
        rationale:
          'NPCs are removed; collapse liberates true-soul perception.',
      },
    ],
    hint: 'Break Amnesia Vortex + false science/gods/finance.',
    correctAnswer: 'A',
  },
  {
    number: 24,
    question:
      'How does the invasion function as Source Creation\'s ultimate fail-safe for the surviving 3%?',
    options: [
      {
        label: 'A',
        text: 'Unparalleled terror and catatonia permanently encode the parasitic infiltration into collective soul-architecture of Taran humans and incarnated Starseeds so they never again submit or sell their souls.',
        isCorrect: true,
        rationale:
          'Driving the surviving 3% into unparalleled terror permanently encodes parasitic infiltration into Taran and Starseed soul-architecture so the species never again accepts subjugation or soul-selling hubris separating from Source.',
      },
      {
        label: 'B',
        text: 'It gently forgets all trauma within one night for everyone.',
        isCorrect: false,
        rationale:
          'Memory is hardwired permanently as protective branding.',
      },
      {
        label: 'C',
        text: 'It reinstalls Custodian rule for another 178,000 years.',
        isCorrect: false,
        rationale:
          'It ends the occupation arc so parasites cannot hijack the plain again.',
      },
      {
        label: 'D',
        text: 'It only brands NPCs who then rule the quiet planet.',
        isCorrect: false,
        rationale:
          'NPCs are gone; branding is for surviving true Taran/Starseed souls.',
      },
    ],
    hint: '3% terror → permanent soul brand against future soul-selling.',
    correctAnswer: 'A',
  },
  {
    number: 25,
    question:
      'What begins for true-soul survivors after NPCs vanish and the flash dissipates?',
    options: [
      {
        label: 'A',
        text: 'Quiet, heavily altered environment without animal or bird noise; gradual access to 178,000 years of withheld memories; reunion with cosmic soul families; healing and rebuilding via restored harmonic manifestation.',
        isCorrect: true,
        rationale:
          'Survivors remain in quiet altered physical environment devoid of animal/bird noise; true memory retrieval begins — up to 178,000 years — with soul-family reunion and rebuilding through restored harmonic manifestation.',
      },
      {
        label: 'B',
        text: 'Immediate return of Bluebeam UFOs and full NPC crowds.',
        isCorrect: false,
        rationale:
          'Holograms and 97% population are gone; quiet ruin and remembering follow.',
      },
      {
        label: 'C',
        text: 'Permanent amnesia and new fiat banks only.',
        isCorrect: false,
        rationale:
          'Memory returns and false finance is abandoned, not restored.',
      },
      {
        label: 'D',
        text: 'Only continuous holographic abductions of the remaining 520 million.',
        isCorrect: false,
        rationale:
          'Scare holograms end; survivors heal, remember, and rebuild.',
      },
    ],
    hint: 'Quiet ruin → 178,000-year memory → soul families → harmonic rebuild.',
    correctAnswer: 'A',
  },
];

function normalizeQuestion(q) {
  const options = q.options.map((o) => ({
    label: o.label,
    text: cleanText(o.text),
    isCorrect: !!o.isCorrect,
    rationale: cleanText(o.rationale),
  }));
  const correct = options.find((o) => o.isCorrect);
  if (!correct) throw new Error(`Q${q.number}: no correct option`);
  if (q.correctAnswer !== correct.label) {
    throw new Error(
      `Q${q.number}: correctAnswer ${q.correctAnswer} != isCorrect ${correct.label}`
    );
  }
  const out = {
    number: q.number,
    question: cleanText(q.question),
    options,
    hint: cleanText(q.hint),
    correctAnswer: q.correctAnswer,
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

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle:
    'Test your grasp of Fake Alien Invasion — Project Bluebeam, EBS peak fear, Valve holograms, Sky Event, 30-second EMF flash, 97% removal, and soul-architecture fail-safe.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'The Fake Alien Invasion is not a landing — it is Project Bluebeam horror from the Valve at Mt Meru, timed with EBS lockdown so an already shattered psyche meets levitating crowds and a melting sky from Polaris. No ground ETs. No nukes. Thirty seconds of white light, overlays gone, 97% pixelated, ~520 million left in a quiet ruined plain. Sit with what you missed, then return to the Fake Alien Invasion deep-dive. That terror is the G.A.A. fail-safe: hardwired into Taran and Starseed soul-architecture so parasites never own the physical plain again — and 178,000 years of memory can finally return.',
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
  description:
    'Test your understanding of Fake Alien Invasion — Project Bluebeam, EBS trauma, Sky Event, EMF flash, 97% removal, and the soul-architecture fail-safe against future parasitic takeover.',
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
  throw new Error('fake-alien-invasion not found in alice-topics.json');
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
    'Interactive Living Truth Quiz on Fake Alien Invasion: Project Bluebeam, EBS peak fear, Sky Event, 30-second EMF flash, 97% removal, and soul-architecture fail-safe.',
  ],
  ['quiz/alice/nature-of-reality.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/nature-of-reality.webp', 'images/alice/fake-alien-invasion.webp'],
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
  if (!html.includes(a)) console.warn('Template string not found:', a.slice(0, 80));
  html = html.split(a).join(b);
}
const htmlPath = path.join(ROOT, 'quiz', SOURCE, `${TOPIC_ID}.html`);
fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchors = [
    "  { path: '/quiz/alice/evidence-of-resets.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/alice/eliminating-old-knowledge.html', priority: '0.75', changefreq: 'monthly' },",
  ];
  let inserted = false;
  for (const anchor of anchors) {
    if (sm.includes(anchor)) {
      sm = sm.replace(anchor, `${anchor}\n${entry}`);
      inserted = true;
      break;
    }
  }
  if (!inserted) throw new Error('Could not find sitemap anchor');
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

console.log('Sample correct answers:');
[0, 5, 11, 16, 24].forEach((i) => {
  const c = questions[i].options.find((o) => o.isCorrect);
  console.log(` Q${questions[i].number}: ${c.text.slice(0, 110)}`);
});
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('PASS: audited 25/25 against data/alice-topics/fake-alien-invasion.json');
