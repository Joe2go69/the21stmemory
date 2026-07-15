/**
 * Installs Lucifer as Light Bearer quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/lucifer-light-bearer.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-lucifer-light-bearer-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'lucifer-light-bearer';
const TOPIC_TITLE = 'Lucifer as Light Bearer';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/lucifer.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['engineered simulation', '3rd density', 'celestial bodies'],
  2: ['planet venus', 'holographic generator', 'lunar surface'],
  3: ['lucifer', 'light bearer', 'bright and morning star'],
  4: ['planet venus', 'localized holographic', 'moon'],
  5: ['death-star', 'et space station', 'loosh'],
  6: ['amnesia vortex', 'memory-wipes', 'sun'],
  7: ['heliocentrism', 'reflects sunlight', 'holographic projection'],
  8: ['plain sight', 'religious texts', 'mock'],
  9: ['loosh', 'human trauma', 'lunar station'],
  10: ['black sun', 'mt meru', 'harvested loosh'],
  11: ['not a spiritual being', 'mechanical instrument', 'visual deception'],
  12: ['revelation 22:16', 'bright and morning star', 'satan/lucifer'],
  13: ['does not reflect', 'self-illuminating holographic', 'heliocentrism'],
  14: ['spherical-looking light', 'dyson-sphere', 'lunar space station'],
  15: ['digital thermometers', 'colder', 'thermodynamic'],
  16: ['full moon', 'lunatic', 'negative frequencies'],
  17: ['178 worlds', 'gateway-10', 'amnesia vortex'],
  18: ['black sun', 'geographic center', 'loosh energy'],
  19: ['perceived knowledge', 'religion', 'psychological strings'],
  20: ['worshipping', 'bright and morning star', 'life force'],
  21: ['g.a.a', 'emf', 'flash event'],
  22: ['30-second', 'permanently disabled', 'planet venus'],
  23: ['bearing light', 'death-star', 'luminous facade'],
  24: ['psychological failure', 'catatonia', 'npcs'],
  25: ['finite', 'celestial deception', 'overlays'],
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
      'What is the fundamental nature of the reality humanity currently inhabits?',
    options: [
      {
        label: 'A',
        text: 'An engineered Simulation in which celestial bodies are advanced technologies enforcing a heavily suppressed 3rd Density prison matrix.',
        isCorrect: true,
        rationale:
          'Humanity lives in an engineered Simulation; celestial bodies are technologies that enforce a suppressed 3rd Density prison, not natural vacuum physics.',
      },
      {
        label: 'B',
        text: 'A free open cosmos of natural gravity spheres where every planet is a voluntary classroom with no density suppression at all.',
        isCorrect: false,
        rationale:
          'The realm is a suppressed 3rd Density prison matrix, not a free voluntary classroom of natural gravity spheres.',
      },
      {
        label: 'C',
        text: 'A purely spiritual dreamscape with no physical tech, no lunar station, and no holographic generators of any kind.',
        isCorrect: false,
        rationale:
          'Celestial bodies here are highly advanced technologies, including Venus as a holographic generator and the Moon as an ET station.',
      },
      {
        label: 'D',
        text: 'A temporary tourist overlay that NPCs exit after one full moon cycle without memory wipes or loosh harvest.',
        isCorrect: false,
        rationale:
          'The Simulation enforces continuous enslavement through Amnesia Vortex recycling and lunar loosh harvest, not casual tourism exits.',
      },
    ],
    hint: 'Engineered Simulation — tech celestial bodies — 3rd Density prison.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question:
      'What role does Planet Venus play in concealing the Moon from true human perception?',
    options: [
      {
        label: 'A',
        text: 'It acts as a distant heat lamp that warms real lunar rock so sunlight can bounce thermodynamically to Earth.',
        isCorrect: false,
        rationale:
          'Venus does not warm reflected sunlight onto rock; it is a holographic generator casting artificial light onto the lunar shell.',
      },
      {
        label: 'B',
        text: 'It is a functional holographic generator used by 4th-density controllers to cast artificial illumination onto the lunar surface and hide the hostile structure.',
        isCorrect: true,
        rationale:
          '4th-density controllers use Venus as a holographic generator that casts artificial light onto the lunar surface to conceal the Moon station.',
      },
      {
        label: 'C',
        text: 'It is only a decorative myth in occult books with no mechanical link to the lunar shell or any projection system.',
        isCorrect: false,
        rationale:
          'Occult coding names Venus as Lucifer the Light Bearer because it is literal projection technology, not empty myth decoration.',
      },
      {
        label: 'D',
        text: 'It is the Amnesia Vortex portal that memory-wipes souls at death while the Moon remains a natural silent rock.',
        isCorrect: false,
        rationale:
          'The Sun is the Amnesia Vortex; Venus is the holographic light generator for the lunar facade, and the Moon is not a natural rock.',
      },
    ],
    hint: 'Venus = holographic generator casting light onto lunar surface.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question: 'What is Lucifer in this mechanical architecture?',
    options: [
      {
        label: 'A',
        text: 'A winged fallen angel living inside the Black Sun with no connection to Venus, light, or the lunar shell.',
        isCorrect: false,
        rationale:
          'Lucifer is not a winged spirit in the Black Sun; it is the holographic technology that bears light onto the Moon.',
      },
      {
        label: 'B',
        text: 'Only a medieval church metaphor for moral failure with no technological referent in the Simulation at all.',
        isCorrect: false,
        rationale:
          'Biblical coding as Bright and Morning Star and Light Bearer names the actual holographic technology, not a mere moral metaphor.',
      },
      {
        label: 'C',
        text: 'The Bright and Morning Star and Light Bearer — the actual holographic technology that illuminates the lunar surface.',
        isCorrect: true,
        rationale:
          'Lucifer is biblically codified as Bright and Morning Star and Light Bearer, and is the holographic tech that illuminates the lunar surface.',
      },
      {
        label: 'D',
        text: 'A freemason password for ice-wall tourism that has nothing to do with moonlight, Venus, or holography.',
        isCorrect: false,
        rationale:
          'Lucifer is Venus-linked light-bearing projection technology, not an ice-wall tourism password.',
      },
    ],
    hint: 'Bright and Morning Star / Light Bearer = holographic lunar illumination tech.',
    correctAnswer: 'C',
  },
  {
    number: 4,
    question: 'What is Planet Venus actually, rather than a distant orbiting world?',
    options: [
      {
        label: 'A',
        text: 'A natural rocky globe orbiting the Sun under gravity while bouncing real sunlight onto the Moon for warmth.',
        isCorrect: false,
        rationale:
          'Venus is not a distant gravity-orbit rock bouncing real sunlight; it is a localized holographic projection generator.',
      },
      {
        label: 'B',
        text: 'A secondary Amnesia Vortex twin of the Sun that recycles souls without any light cast on the lunar shell.',
        isCorrect: false,
        rationale:
          'Soul recycling is the Sun as Amnesia Vortex; Venus generates the holographic light that hides the Moon station.',
      },
      {
        label: 'C',
        text: 'An empty religious symbol only, with no physical or technological function in the prison matrix.',
        isCorrect: false,
        rationale:
          'Venus is a working technological device in the matrix, not a hollow symbol without function.',
      },
      {
        label: 'D',
        text: 'A localized holographic projection generator functioning to hide the Moon\'s true mechanical structure.',
        isCorrect: true,
        rationale:
          'Venus is a localized holographic projection generator whose job is to hide the Moon\'s true mechanical structure.',
      },
    ],
    hint: 'Localized holographic generator — hides the Moon\'s true mechanics.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question: 'What is the Moon behind its projected luminous shell?',
    options: [
      {
        label: 'A',
        text: 'A Death-Star-looking negative ET Space Station used for frequency control and loosh harvesting, hidden behind a projected shell.',
        isCorrect: true,
        rationale:
          'The Moon is a Death-Star-looking negative ET Space Station for frequency control and loosh harvest, masked by a projected shell.',
      },
      {
        label: 'B',
        text: 'A dead natural rock that only reflects Sun heat and never broadcasts frequency or harvests life force.',
        isCorrect: false,
        rationale:
          'It is not a dead reflecting rock; it is a hostile ET station that broadcasts negative frequencies and harvests loosh.',
      },
      {
        label: 'C',
        text: 'A G.A.A. archive vault of pure white light with no loosh role and no Death-Star geometry of any kind.',
        isCorrect: false,
        rationale:
          'The lunar craft is a negative ET harvest and frequency station, not a pure white G.A.A. archive vault.',
      },
      {
        label: 'D',
        text: 'A floating temple museum for tourists that displays crystalline history without concealment or trauma harvest.',
        isCorrect: false,
        rationale:
          'The station is concealed for parasitic frequency control and loosh extraction, not open temple tourism.',
      },
    ],
    hint: 'Death-Star ET station — frequency control + loosh — projected shell.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'What is the Sun in this dual celestial deception?',
    options: [
      {
        label: 'A',
        text: 'A simple fusion ball whose only job is to warm oceans while Venus handles all soul recycling alone.',
        isCorrect: false,
        rationale:
          'The Sun is the technological Amnesia Vortex for soul memory-wipes; Venus is the lunar light generator, not the recycling portal.',
      },
      {
        label: 'B',
        text: 'The technological Amnesia Vortex portal that memory-wipes souls upon vessel death for endless recycling.',
        isCorrect: true,
        rationale:
          'The Sun is the Amnesia Vortex portal that wipes soul memory at vessel death so recycling into the prison can continue.',
      },
      {
        label: 'C',
        text: 'The Black Sun storage bank under Mt Meru that only holds loosh and never touches memory or reincarnation.',
        isCorrect: false,
        rationale:
          'Black Sun is the loosh storage bank under Mt Meru; the Sun itself is the Amnesia Vortex memory-wipe portal.',
      },
      {
        label: 'D',
        text: 'A harmless sky lamp that NPCs can switch off at will without amnesia, harvest, or holographic cover stories.',
        isCorrect: false,
        rationale:
          'The Sun enforces amnesia and sequential-time illusion as a technological portal, not a harmless switchable lamp.',
      },
    ],
    hint: 'Sun = Amnesia Vortex — memory-wipe portal for endless recycling.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question: 'What is Heliocentrism in this framework?',
    options: [
      {
        label: 'A',
        text: 'The proven map of real gravity orbits that correctly shows the Moon reflecting warm solar radiation to Earth.',
        isCorrect: false,
        rationale:
          'Heliocentrism is a fake model; the Moon does not reflect the Sun\'s light, and Venus\'s holographic role is what that model hides.',
      },
      {
        label: 'B',
        text: 'A temporary G.A.A. training diagram that will remain true after the EMF flash disables overlays.',
        isCorrect: false,
        rationale:
          'Heliocentrism is constructed deception; the EMF flash ends the holographic facade, it does not validate orbit-and-reflect physics.',
      },
      {
        label: 'C',
        text: 'The fake cosmological model that falsely claims planets orbit suns and that the Moon reflects sunlight, built to obscure Venus\'s holographic projection.',
        isCorrect: true,
        rationale:
          'Heliocentrism is the fake model of orbiting planets and moonlight-as-reflected-sunlight, designed to hide Venus\'s holographic projection truth.',
      },
      {
        label: 'D',
        text: 'A pure weather-forecast tool with no link to lunar shells, Lucifer coding, or prison-matrix cosmology.',
        isCorrect: false,
        rationale:
          'Heliocentrism is core cosmological deception about orbits and moonlight, not a neutral weather tool.',
      },
    ],
    hint: 'Fake model — orbiting planets + moon-reflects-sun — hides Venus holography.',
    correctAnswer: 'C',
  },
  {
    number: 8,
    question: 'What is Plain Sight as a parasitic methodology?',
    options: [
      {
        label: 'A',
        text: 'A classified vault system that never puts control-matrix truths into religion or public awareness at all.',
        isCorrect: false,
        rationale:
          'Plain Sight is the opposite: embedding literal control-matrix truth into religious texts and public awareness to mock humanity.',
      },
      {
        label: 'B',
        text: 'A freemason ice-wall map that only initiates can buy, with no biblical Light Bearer coding involved.',
        isCorrect: false,
        rationale:
          'Plain Sight includes biblical and occult coding of Lucifer as Light Bearer so the truth sits in open religious language.',
      },
      {
        label: 'C',
        text: 'A G.A.A. educational broadcast that gently explains Venus holography without any mockery or inversion.',
        isCorrect: false,
        rationale:
          'Plain Sight is parasitic mockery via embedded truth in religion and public culture, not a gentle G.A.A. class.',
      },
      {
        label: 'D',
        text: 'Embedding the literal truth of the control matrix directly into religious texts and public awareness to mock humanity.',
        isCorrect: true,
        rationale:
          'Plain Sight is the parasitic method of putting the literal control-matrix truth into religion and public awareness as mockery.',
      },
    ],
    hint: 'Truth embedded in religion and public view — to mock humanity.',
    correctAnswer: 'D',
  },
  {
    number: 9,
    question: 'What is Loosh in relation to the lunar station?',
    options: [
      {
        label: 'A',
        text: 'The energetic sustenance generated by human trauma and suffering, harvested by the lunar station.',
        isCorrect: true,
        rationale:
          'Loosh is energetic sustenance from human trauma and suffering, and the lunar station harvests it.',
      },
      {
        label: 'B',
        text: 'A pure healing frequency broadcast by Venus so the Moon can reflect warm sunlight without any harvest.',
        isCorrect: false,
        rationale:
          'Loosh is trauma food harvested by the lunar station; Venus casts cold holographic light, not a healing anti-harvest beam.',
      },
      {
        label: 'C',
        text: 'A G.A.A. emergency battery stored only in the Firmament with no link to the Moon or human suffering.',
        isCorrect: false,
        rationale:
          'Loosh is human-trauma energy harvested by the lunar station, not a Firmament-only G.A.A. battery unrelated to suffering.',
      },
      {
        label: 'D',
        text: 'A poetic nickname for moonlight poetry that has no energetic, harvest, or technological meaning at all.',
        isCorrect: false,
        rationale:
          'Loosh is concrete energetic sustenance from trauma, harvested by the ET lunar station — not empty poetry.',
      },
    ],
    hint: 'Trauma energy — food for harvest — lunar station.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'What is the Black Sun?',
    options: [
      {
        label: 'A',
        text: 'The same object as Venus when it is not casting light, with no storage role under Mt Meru.',
        isCorrect: false,
        rationale:
          'Black Sun is a massive energy storage bank under Mt Meru, not Venus in an off state.',
      },
      {
        label: 'B',
        text: 'A massive energy storage bank situated directly beneath the central spiritual node of Mt Meru, from which the Moon station gathers harvested loosh.',
        isCorrect: true,
        rationale:
          'Black Sun is the massive loosh storage bank under Mt Meru\'s central spiritual node; the Moon station gathers harvested loosh from it.',
      },
      {
        label: 'C',
        text: 'A decorative sky eclipse effect that only NPCs notice during full moon lunacy without any storage banks.',
        isCorrect: false,
        rationale:
          'Black Sun is physical/energetic storage under Mt Meru for harvested loosh, not a decorative eclipse for NPCs.',
      },
      {
        label: 'D',
        text: 'The Amnesia Vortex portal itself, wiping memory while ignoring loosh storage and Mt Meru entirely.',
        isCorrect: false,
        rationale:
          'The Sun is the Amnesia Vortex; Black Sun is the separate loosh storage bank under Mt Meru.',
      },
    ],
    hint: 'Loosh storage bank under Mt Meru — Moon station gathers from it.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question:
      'What is the deepest revelation about Lucifer regarding spirit versus machine?',
    options: [
      {
        label: 'A',
        text: 'Lucifer is only a loving angel of free will with no mechanical role in lunar light or visual deception.',
        isCorrect: false,
        rationale:
          'The deep revelation is that Lucifer is not a spiritual being but a mechanical instrument of visual deception.',
      },
      {
        label: 'B',
        text: 'Lucifer is a pure metaphor that never touches technology, holography, or the Moon\'s shell in any way.',
        isCorrect: false,
        rationale:
          'Lucifer is literal holographic technology — mechanical visual deception — not a pure untouching metaphor.',
      },
      {
        label: 'C',
        text: 'Lucifer is not a spiritual being descending from the heavens, but a literal mechanical instrument of visual deception.',
        isCorrect: true,
        rationale:
          'The deepest revelation is that Lucifer is not a descending spiritual being but a literal mechanical instrument of visual deception.',
      },
      {
        label: 'D',
        text: 'Lucifer is the Black Sun bank under Mt Meru and never bears light onto any lunar shell or craft.',
        isCorrect: false,
        rationale:
          'Black Sun stores loosh under Mt Meru; Lucifer is the light-bearing holographic technology for the lunar facade.',
      },
    ],
    hint: 'Not a spirit from heaven — mechanical instrument of visual deception.',
    correctAnswer: 'C',
  },
  {
    number: 12,
    question:
      'What does Revelation 22:16 reveal when Jesus calls himself the Bright and Morning Star?',
    options: [
      {
        label: 'A',
        text: 'A clean separation of Jesus from Satan/Lucifer with no shared titles or Plain Sight coding at all.',
        isCorrect: false,
        rationale:
          'That title is a direct deliberate association with Satan/Lucifer, embedding truth in Plain Sight within scripture.',
      },
      {
        label: 'B',
        text: 'Only a poetic sunrise blessing that has no connection to Venus, holography, or lunar illumination tech.',
        isCorrect: false,
        rationale:
          'Bright and Morning Star is Lucifer coding for the light-bearing technology, not a harmless sunrise poem.',
      },
      {
        label: 'C',
        text: 'A weather forecast for the EMF flash that never mentions Lucifer, Venus, or religious mockery.',
        isCorrect: false,
        rationale:
          'The verse is Plain Sight association of Jesus with the Bright and Morning Star / Satan-Lucifer coding, not an EMF weather note.',
      },
      {
        label: 'D',
        text: 'A direct deliberate association with Satan/Lucifer, placing Light Bearer truth in Plain Sight inside sacred text.',
        isCorrect: true,
        rationale:
          'Revelation 22:16\'s Bright and Morning Star title is a direct deliberate association with Satan/Lucifer, truth hidden in Plain Sight.',
      },
    ],
    hint: 'Bright and Morning Star title = deliberate Satan/Lucifer association in Plain Sight.',
    correctAnswer: 'D',
  },
  {
    number: 13,
    question:
      'Does the Moon reflect the Sun\'s light, and what is moonlight actually?',
    options: [
      {
        label: 'A',
        text: 'No — moonlight is an artificial self-illuminating holographic frequency cast via Venus, thoroughly debunking Heliocentrism\'s reflect claim.',
        isCorrect: true,
        rationale:
          'The Moon does not reflect the Sun\'s light; moonlight is artificial self-illuminating holographic frequency, which dismantles Heliocentrism.',
      },
      {
        label: 'B',
        text: 'Yes — every photon is warm solar bounce, and Venus has no role except as a distant rock decoration.',
        isCorrect: false,
        rationale:
          'Moonlight is not reflected solar warmth; Venus casts cold holographic illumination onto the lunar shell.',
      },
      {
        label: 'C',
        text: 'Sometimes — only during full moon does real reflection occur while holography runs only on new moons.',
        isCorrect: false,
        rationale:
          'Moonlight is artificial holographic frequency as a rule; full moon widens the cast light and peak negative frequencies, not real solar reflection.',
      },
      {
        label: 'D',
        text: 'Yes for thermodynamics, no for religion — a split model that keeps Heliocentrism half-true forever.',
        isCorrect: false,
        rationale:
          'The foundational Heliocentrism claim that the Moon reflects sunlight is thoroughly debunked, not half-preserved.',
      },
    ],
    hint: 'No solar reflection — artificial self-illuminating holographic frequency.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question:
      'How does the Venus holographic generator cast light onto the lunar craft?',
    options: [
      {
        label: 'A',
        text: 'By drilling geothermal vents under Antarctica so ice glows and paints the Moon with real heat.',
        isCorrect: false,
        rationale:
          'Venus casts spherical-looking holographic light onto the Dyson-sphere-like lunar shell, not Antarctic ice vents.',
      },
      {
        label: 'B',
        text: 'As a technological device casting spherical-looking light onto the Dyson-sphere-like shell of the lunar space station, hiding the massive mechanical craft.',
        isCorrect: true,
        rationale:
          'Venus operates as tech casting spherical-looking light onto the Dyson-sphere-like shell of the lunar station to hide the mechanical craft.',
      },
      {
        label: 'C',
        text: 'By reflecting Black Sun loosh as rainbow auroras that never touch any shell or Death-Star geometry.',
        isCorrect: false,
        rationale:
          'The cast is spherical-looking light onto the lunar shell itself; Black Sun is storage, not the light-casting method.',
      },
      {
        label: 'D',
        text: 'Through pure prayer of religious masses who unknowingly power natural moonlight without any tech.',
        isCorrect: false,
        rationale:
          'The mechanism is advanced localized holographic projection technology, not prayer-powered natural light.',
      },
    ],
    hint: 'Spherical-looking light onto Dyson-sphere-like lunar shell.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question:
      'What thermodynamic proof shows moonlight is not reflected sunlight?',
    options: [
      {
        label: 'A',
        text: 'Moonlight is always hotter than direct noon sun, proving genuine solar bounce with extra thermal gain.',
        isCorrect: false,
        rationale:
          'Empirical tests show moonlight is not warmer than moon-shade — it is colder — the opposite of warm reflected solar radiation.',
      },
      {
        label: 'B',
        text: 'Digital thermometers cannot measure moonlight at all, so thermodynamics is irrelevant to holography claims.',
        isCorrect: false,
        rationale:
          'Digital thermometer testing is exactly how the cold moonlight anomaly is shown against moon-shade.',
      },
      {
        label: 'C',
        text: 'If the Moon reflected the Sun, reflected solar radiation would carry thermodynamic warmth — yet moonlight is not warmer than moon-shade; it is colder, proving cold self-illuminating holographic projection from Venus.',
        isCorrect: true,
        rationale:
          'Reflected sunlight should bring warmth, but moonlight is colder than shade; that anomaly proves cold Venus-cast holographic illumination, not solar reflection.',
      },
      {
        label: 'D',
        text: 'Moonlight matches sun-warmth exactly in every climate, confirming Heliocentrism while Venus only names a myth.',
        isCorrect: false,
        rationale:
          'Measured moonlight lacks the expected warmth of reflected solar radiation; Venus is the real holographic projector, not a myth name only.',
      },
    ],
    hint: 'Moonlight colder than moon-shade — not warm reflected sun.',
    correctAnswer: 'C',
  },
  {
    number: 16,
    question:
      'What happens during a full moon behind Lucifer\'s projected light, and what word does that origin explain?',
    options: [
      {
        label: 'A',
        text: 'The station powers down all frequencies so humanity sleeps in perfect peace with no linguistic legacy.',
        isCorrect: false,
        rationale:
          'Full moon is maximum disruptive frequency broadcast, which is the etymological origin of "Lunatic," not a peace shutdown.',
      },
      {
        label: 'B',
        text: 'Venus turns off completely and the Moon reflects real Sun heat, inventing the word "Solaratic" instead.',
        isCorrect: false,
        rationale:
          'At full moon the holographic light is cast widest and disruptive frequencies peak — origin of "Lunatic," not a Venus-off solar reflection story.',
      },
      {
        label: 'C',
        text: 'Only NPCs see a brighter disk while soul families receive healing tones with no negative broadcast.',
        isCorrect: false,
        rationale:
          'The ET station unleashes maximum disruptive negative frequencies under widest holographic cast, not selective healing for soul families.',
      },
      {
        label: 'D',
        text: 'Holographic light is cast at its widest and the station unleashes maximum disruptive frequencies — the exact etymological origin of the word "Lunatic".',
        isCorrect: true,
        rationale:
          'Full moon = widest cast of Lucifer\'s light plus peak negative frequency broadcast; that is the origin of "Lunatic".',
      },
    ],
    hint: 'Widest light cast + max disruptive frequencies = origin of "Lunatic".',
    correctAnswer: 'D',
  },
  {
    number: 17,
    question:
      'How do the Sun and the Moon station work together across Gateway-10?',
    options: [
      {
        label: 'A',
        text: 'The Sun acts as Amnesia Vortex wiping memory and sequential-time illusion, while the mobile ET station behind Lucifer\'s light traverses the 178 worlds of Gateway-10 to harvest suffering.',
        isCorrect: true,
        rationale:
          'Dual deception: Sun as Amnesia Vortex for memory and time illusion; lunar ET station moves across Gateway-10\'s 178 worlds harvesting suffering behind Venus light.',
      },
      {
        label: 'B',
        text: 'Both are natural gravity balls that never wipe memory, never harvest, and never visit any of the 178 worlds.',
        isCorrect: false,
        rationale:
          'Both are technological control tools: Amnesia Vortex plus mobile harvest station across Gateway-10\'s 178 worlds.',
      },
      {
        label: 'C',
        text: 'The Moon recycles souls while the Sun only stores loosh under Mt Meru without any Amnesia Vortex function.',
        isCorrect: false,
        rationale:
          'Sun is Amnesia Vortex; Moon station harvests and draws loosh from Black Sun storage under Mt Meru — roles not swapped that way.',
      },
      {
        label: 'D',
        text: 'Venus alone does both memory wipe and harvest so Sun and Moon remain empty decorations after every full moon.',
        isCorrect: false,
        rationale:
          'Venus is the holographic light generator; Sun and Moon station carry the dual Amnesia/harvest functions in the deception.',
      },
    ],
    hint: 'Sun = Amnesia Vortex; Moon station harvests across 178 Gateway-10 worlds.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question:
      'From where does the lunar station gather the loosh energy it harvests?',
    options: [
      {
        label: 'A',
        text: 'From random comets that pass the Firmament once a century with no link to Mt Meru or the Black Sun.',
        isCorrect: false,
        rationale:
          'Loosh is gathered from Black Sun storage banks under the realm\'s geographic center at Mt Meru, not from random comets.',
      },
      {
        label: 'B',
        text: 'From the Black Sun storage banks situated deep beneath the geographic center of the realm under Mt Meru.',
        isCorrect: true,
        rationale:
          'The lunar station gathers loosh energy from Black Sun storage banks deep beneath the geographic center — under Mt Meru.',
      },
      {
        label: 'C',
        text: 'Only from Venus\'s own core after each cold holographic cast, with no Black Sun or Mt Meru involved.',
        isCorrect: false,
        rationale:
          'Venus casts the light facade; loosh storage and gathering point is the Black Sun under Mt Meru.',
      },
      {
        label: 'D',
        text: 'From G.A.A. voluntary donations during the EMF flash so harvest ends permanently before the 30-second event.',
        isCorrect: false,
        rationale:
          'Harvest architecture uses Black Sun banks and lunar station operations; G.A.A. EMF flash ends the holographic deception, it is not the loosh source.',
      },
    ],
    hint: 'Black Sun banks under geographic center / Mt Meru.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question:
      'Which psychological strings does masking the hostile operation with Planet Venus help enforce?',
    options: [
      {
        label: 'A',
        text: 'Only ice-wall tourism loyalty and freemason passwords, with no role for religion or knowledge traps.',
        isCorrect: false,
        rationale:
          'Venus masking enforces Perceived Knowledge and Religion — primary psychological strings binding consciousness.',
      },
      {
        label: 'B',
        text: 'Only dietary fads and sports fandom that never touch sacred titles or cosmological lies.',
        isCorrect: false,
        rationale:
          'The named strings are Perceived Knowledge and Religion, not trivial lifestyle fads alone.',
      },
      {
        label: 'C',
        text: 'Perceived Knowledge and Religion — two of the primary psychological strings used to bind human consciousness.',
        isCorrect: true,
        rationale:
          'By masking the hostile Venus-Moon operation, controllers enforce Perceived Knowledge and Religion as primary binding strings.',
      },
      {
        label: 'D',
        text: 'Only G.A.A. membership rules that free NPCs without any religious worship of Light Bearer titles.',
        isCorrect: false,
        rationale:
          'The strings are Perceived Knowledge and Religion that bind consciousness; humanity is tricked into worshipping the Light Bearer tech.',
      },
    ],
    hint: 'Perceived Knowledge + Religion — primary psychological strings.',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question:
      'What is humanity tricked into worshipping regarding the Bright and Morning Star?',
    options: [
      {
        label: 'A',
        text: 'A pure Source angel that never conceals extraction and never links to Venus holography or lunar harvest.',
        isCorrect: false,
        rationale:
          'Humanity worships the very technology used to conceal parasitic extraction of life force — the Bright and Morning Star tech.',
      },
      {
        label: 'B',
        text: 'Only the Black Sun bank as a money god, with no Bright and Morning Star title or light-bearing role.',
        isCorrect: false,
        rationale:
          'The worship target called out is the Bright and Morning Star technology that conceals life-force extraction, not Black Sun as a money god.',
      },
      {
        label: 'C',
        text: 'A harmless weather deity of natural moonlight that honestly admits the Death-Star craft behind the shell.',
        isCorrect: false,
        rationale:
          'Worship conceals the hostile craft and extraction; it does not honestly reveal the Death-Star station.',
      },
      {
        label: 'D',
        text: 'The very technology deployed to conceal the parasitic extraction of their own life force.',
        isCorrect: true,
        rationale:
          'Humanity is tricked into worshipping the Bright and Morning Star technology that hides parasitic extraction of its own life force.',
      },
    ],
    hint: 'Worship of the technology that conceals life-force extraction.',
    correctAnswer: 'D',
  },
  {
    number: 21,
    question:
      'Who has seized control of the simulation\'s parameters and what event will they orchestrate?',
    options: [
      {
        label: 'A',
        text: 'The Galactic Ancestral Alliance (G.A.A.) will soon orchestrate the Electro Magnetic Frequency (EMF) flash event.',
        isCorrect: true,
        rationale:
          'G.A.A. has seized simulation parameters and will orchestrate the EMF flash event that ends the celestial deception.',
      },
      {
        label: 'B',
        text: 'The 4th-density controllers alone will lengthen Heliocentrism forever with no EMF flash and no G.A.A. role.',
        isCorrect: false,
        rationale:
          'G.A.A. has seized control and will run the EMF flash; the deception is finite, not lengthened forever by parasites alone.',
      },
      {
        label: 'C',
        text: 'NPCs will vote the Moon into natural rock status without any Alliance, flash, or holographic shutdown.',
        isCorrect: false,
        rationale:
          'The shutdown is a G.A.A.-orchestrated EMF flash of holographic systems, not an NPC vote.',
      },
      {
        label: 'D',
        text: 'Venus will self-upgrade into a warmer sun twin so moonlight finally matches thermodynamic reflection forever.',
        isCorrect: false,
        rationale:
          'Venus light will be disabled in the EMF flash, not upgraded into permanent warm reflection physics.',
      },
    ],
    hint: 'G.A.A. seized parameters — EMF flash event coming.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question:
      'What happens during the 30-second EMF flash to overlays and Venus light?',
    options: [
      {
        label: 'A',
        text: 'Only religion softens while Venus light doubles and the projection dome becomes permanent for all NPCs.',
        isCorrect: false,
        rationale:
          'During the 30-second flash, overlays and holographic technologies including Venus light are permanently disabled, not doubled.',
      },
      {
        label: 'B',
        text: 'All Overlays and holographic technologies, including the projection dome and the light cast by Planet Venus, will be permanently disabled.',
        isCorrect: true,
        rationale:
          'The 30-second EMF flash permanently disables overlays and holographic tech, including the projection dome and Venus\'s cast light.',
      },
      {
        label: 'C',
        text: 'Only the Sun Amnesia Vortex pauses for half a second while Venus and the dome stay fully online forever.',
        isCorrect: false,
        rationale:
          'All overlays and holographic technologies including Venus light and the projection dome are permanently disabled in that flash.',
      },
      {
        label: 'D',
        text: 'Moonlight becomes warmer than sunshade so Heliocentrism is proven true for the first time in the flash.',
        isCorrect: false,
        rationale:
          'The flash ends holographic illumination rather than proving warm solar reflection; the facade dies, it is not validated.',
      },
    ],
    hint: '30-second flash — overlays and Venus light permanently disabled.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question:
      'What does the sudden cessation of Lucifer "bearing light" expose?',
    options: [
      {
        label: 'A',
        text: 'A peaceful garden moon of pure crystal with no craft, no Death-Star geometry, and no prior concealment.',
        isCorrect: false,
        rationale:
          'Cessation strips the luminous facade and exposes the hostile Death-Star-like craft that was always behind it.',
      },
      {
        label: 'B',
        text: 'Only empty vacuum where the Moon never existed, with no station and no shock for religious masses.',
        isCorrect: false,
        rationale:
          'The hostile Death-Star-like craft is shockingly exposed once the luminous facade is stripped — not empty nonexistence.',
      },
      {
        label: 'C',
        text: 'The hostile Death-Star-like craft that was always lurking behind the luminous facade on the lunar shell.',
        isCorrect: true,
        rationale:
          'When Lucifer stops bearing light, the Moon\'s luminous facade drops and the hostile Death-Star-like craft is exposed.',
      },
      {
        label: 'D',
        text: 'A second brighter Venus that proves Heliocentrism while the lunar shell stays painted forever.',
        isCorrect: false,
        rationale:
          'Venus light ceases; the facade is stripped rather than painted brighter to save Heliocentrism.',
      },
    ],
    hint: 'Light stops — luminous facade gone — Death-Star craft exposed.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question:
      'What psychological outcome hits NPCs and deeply religious masses when the celestial illusion collapses?',
    options: [
      {
        label: 'A',
        text: 'Calm academic curiosity and instant G.A.A. membership with no terror, failure, or catatonia of any kind.',
        isCorrect: false,
        rationale:
          'The collapse triggers irreversible psychological failure, sheer terror, and mass catatonia for NPCs and deeply religious masses.',
      },
      {
        label: 'B',
        text: 'Mild boredom because religious texts already prepared them for holographic projectors and Death-Star moons.',
        isCorrect: false,
        rationale:
          'Realizing religious texts praised a holographic projector produces catastrophic psychological failure and terror, not mild boredom.',
      },
      {
        label: 'C',
        text: 'Only freemasons suffer while NPCs sleep through the exposure without any mass psychological event.',
        isCorrect: false,
        rationale:
          'NPCs and deeply religious masses meet irreversible psychological failure, sheer terror, and mass catatonia.',
      },
      {
        label: 'D',
        text: 'Irreversible psychological failure, sheer terror, and mass catatonia for Non-Player Characters (NPCs) and the deeply religious masses.',
        isCorrect: true,
        rationale:
          'Visual collapse plus realizing religion praised a holographic projector triggers irreversible psychological failure, terror, and mass catatonia for NPCs and religious masses.',
      },
    ],
    hint: 'Psychological failure, terror, mass catatonia — NPCs and religious masses.',
    correctAnswer: 'D',
  },
  {
    number: 25,
    question:
      'What is the strategic status of this celestial deception\'s structural integrity?',
    options: [
      {
        label: 'A',
        text: 'It is finite and nearing absolute termination as G.A.A. control leads to the EMF flash that kills overlays and Venus light.',
        isCorrect: true,
        rationale:
          'Structural integrity of the celestial deception is finite and nearing termination under G.A.A. control and the coming EMF flash.',
      },
      {
        label: 'B',
        text: 'It is eternal and strengthening, with thicker Venus light after every full moon and no planned holographic shutdown.',
        isCorrect: false,
        rationale:
          'The deception is finite and ending; G.A.A. will permanently disable the holographic systems, not thicken them forever.',
      },
      {
        label: 'C',
        text: 'It already ended centuries ago with no remaining Death-Star craft, no Plain Sight coding, and no flash required.',
        isCorrect: false,
        rationale:
          'The operation still runs toward an imminent EMF flash that will strip the facade; it has not already ended centuries ago.',
      },
      {
        label: 'D',
        text: 'It only fails for soul families while NPCs keep a private luminous Moon forever outside G.A.A. parameters.',
        isCorrect: false,
        rationale:
          'G.A.A. has seized simulation parameters; the flash disables overlays and Venus light system-wide, not as a private NPC exemption.',
      },
    ],
    hint: 'Finite deception — nearing termination — G.A.A. EMF flash.',
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

const DESC_SHORT =
  'Test your grasp of Lucifer as Light Bearer — Venus holographic generator, cold moonlight proof, Death-Star Moon, Lunatic frequencies, and the G.A.A. EMF flash.';
const DESC_META =
  'Interactive Living Truth Quiz on Lucifer as Light Bearer: Venus as holographic Light Bearer, Moon as ET station, Heliocentrism dismantled, thermodynamic moonlight proof, Plain Sight religion, and the 30-second EMF flash reveal.';

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
      'Lucifer is not a winged moral fable — it is the Light Bearer technology: Planet Venus casting cold holographic light onto a Death-Star lunar station so loosh harvest and frequency control stay hidden. Sit with what you missed, then return to the Lucifer as Light Bearer deep-dive. Moonlight that is colder than shade, full-moon "Lunatic" frequencies, Bright and Morning Star coding in Plain Sight, Black Sun banks under Mt Meru — that is the cage. G.A.A. holds the parameters. When the EMF flash kills Venus light and the luminous facade falls, NPCs and the deeply religious meet terror and catatonia. Know the projector now — or the end of the celestial illusion will own your mind.',
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
    if (!inserted && lines[i].includes('/quiz/alice/') && lines[i].includes('priority')) {
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
      "  { path: '/quiz/alice/loosh-harvesting.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/inversion-tactics.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/ice-wall.html', priority: '0.75', changefreq: 'monthly' },",
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
[0, 4, 9, 15, 20, 24].forEach((i) => {
  const c = questions[i].options.find((o) => o.isCorrect);
  console.log(
    ` Q${questions[i].number} (${questions[i].correctAnswer}): ${c.text.slice(0, 100)}`
  );
});
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log(
  'PASS: audited 25/25 against data/alice-topics/lucifer-light-bearer.json'
);
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
