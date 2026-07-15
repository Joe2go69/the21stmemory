/**
 * Installs Perceived Knowledge (Lies) quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/perceived-knowledge-lies.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-perceived-knowledge-lies-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'perceived-knowledge-lies';
const TOPIC_TITLE = 'Perceived Knowledge (Lies)';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/perceived-knowledge-lies.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['string 3', 'intellect', '3 strings'],
  2: ['religion', 'finance', 'perceived knowledge'],
  3: ['the lie', 'education', 'mainstream'],
  4: ['safety of certainty', 'ego', 'defend'],
  5: ['mind camp', 'ridicule', 'conformity'],
  6: ['97%', 'npc', 'internal monologue'],
  7: ['oopa', 'tartary', 'museum'],
  8: ['70,000 years', 'falsified', 'weaponized'],
  9: ['book', 'university', 'curriculum'],
  10: ['experts', 'zero', 'off the table'],
  11: ['copernicus', 'spinning globe', 'paradigm'],
  12: ['intellectual foundation', 'lie', 'trap'],
  13: ['ego', 'borrowed', 'pride'],
  14: ['normality', 'independent', 'comfort zone'],
  15: ['carnegie', '2,500', 'libraries'],
  16: ['bullshit', 'prestigious', 'lower classes'],
  17: ['gravity', 'spinning ball', 'fictional'],
  18: ['evolution', 'laboratories', 'geneticists'],
  19: ['linear time', 'clocks', 'schedules'],
  20: ['without time', 'aging', 'true reality'],
  21: ['religion', 'finance', 'architecture'],
  22: ['television', 'pickled', 'mind camp'],
  23: ['emf', 'projection dome', 'firmament'],
  24: ['pigeon-hole', 'pixelation', 'collapse'],
  25: ['severing', 'aether', 'survival'],
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
    question: 'What is String 3: Perceived Knowledge / Intellect?',
    options: [
      {
        label: 'A',
        text: 'The final and most insidious psychological tether in The 3 Strings of Attachment — the sum of accepted education, intellectual pride, and societal understanding that solidifies into a rigid defensive shield for the ego.',
        isCorrect: true,
        rationale:
          'String 3 is intellect-as-armor: lifelong schooled understanding hardened into an ego shield that blocks true cosmology.',
      },
      {
        label: 'B',
        text: 'Only a monetary hobby that distracts people with debt and retirement while never touching education or ego.',
        isCorrect: false,
        rationale:
          'That tracks Finance (String 2); Perceived Knowledge is the intellect/education tether.',
      },
      {
        label: 'C',
        text: 'A free open-source library of firmament science already taught in every university without deception.',
        isCorrect: false,
        rationale:
          'Universities weaponize deception; String 3 is the rigid shield, not free true cosmology.',
      },
      {
        label: 'D',
        text: 'A temporary password for Scare Events that grants NPC status without any intellectual pride.',
        isCorrect: false,
        rationale:
          'String 3 is the pride-and-certainty trap; NPCs are the 97% running scripted education paths.',
      },
    ],
    hint: 'String 3 — intellect as rigid ego shield against true cosmology.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'What are The 3 Strings of Attachment?',
    options: [
      {
        label: 'A',
        text: 'Three optional sports leagues that dissolve if you change the channel once.',
        isCorrect: false,
        rationale:
          'They are engineered constructs that bind consciousness: Religion, Finance, and Perceived Knowledge.',
      },
      {
        label: 'B',
        text: 'Religion, Finance, and Perceived Knowledge — engineered constructs that bind human consciousness to the current planetary simulation.',
        isCorrect: true,
        rationale:
          'Three engineered tethers: Religion, Finance, Perceived Knowledge bind consciousness to the simulation.',
      },
      {
        label: 'C',
        text: 'Only Gravity, Evolution, and Linear Time as physical cables under the Ice Wall.',
        isCorrect: false,
        rationale:
          'Those are false paradigms inside String 3; the three Strings are Religion, Finance, and Perceived Knowledge.',
      },
      {
        label: 'D',
        text: 'Carnegie libraries, museum basements, and television studios with no psychological function.',
        isCorrect: false,
        rationale:
          'Those are delivery systems for the lies; the Strings themselves are the three psychological anchors.',
      },
    ],
    hint: 'Religion · Finance · Perceived Knowledge.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question: 'What is The Lie at the core of String 3?',
    options: [
      {
        label: 'A',
        text: 'A minor textbook typo that can be fixed by reading more mainstream science journals.',
        isCorrect: false,
        rationale:
          'The Lie is total: all foundational education, history, and science are purposefully fabricated.',
      },
      {
        label: 'B',
        text: 'Only financial fraud in banks, with universities remaining pure sources of cosmic truth.',
        isCorrect: false,
        rationale:
          'Educational institutions, books, and media all disseminate deliberately wrong information.',
      },
      {
        label: 'C',
        text: 'The absolute reality that all foundational human education, historical records, and scientific paradigms are purposefully fabricated — there is no hidden truth within the mainstream system to discover.',
        isCorrect: true,
        rationale:
          'The Lie = total fabrication of education/history/science; you do not mine truth from inside that system.',
      },
      {
        label: 'D',
        text: 'A future rumor that only matters after the EMF flash already finishes without preparation.',
        isCorrect: false,
        rationale:
          'Recognizing The Lie and releasing intellect-as-safety is preparation now for planetary uninstallation.',
      },
    ],
    hint: 'All education, history, and science are fabricated — no mainstream hidden truth.',
    correctAnswer: 'C',
  },
  {
    number: 4,
    question: 'What is the "Safety of Certainty"?',
    options: [
      {
        label: 'A',
        text: 'A calm soul state that automatically accepts firmament truth without any ego defense.',
        isCorrect: false,
        rationale:
          'It is the mechanism that makes fabricated intellect define being and forces defense of false narratives.',
      },
      {
        label: 'B',
        text: 'A finance product that guarantees retirement income without intellectual pride involved.',
        isCorrect: false,
        rationale:
          'Safety of Certainty is psychological: intellect defining identity and ego defense.',
      },
      {
        label: 'C',
        text: 'A Mind Camp rule that only applies to NPCs and never to anyone with intellectual pride.',
        isCorrect: false,
        rationale:
          'Intellectual pride is exactly who operates under Safety of Certainty as ego armor.',
      },
      {
        label: 'D',
        text: 'The psychological mechanism wherein fabricated intellectual understanding defines a person\'s awareness and being, causing reflexive defense of false narratives to protect the ego.',
        isCorrect: true,
        rationale:
          'Safety of Certainty = identity built on fake intellect → ego defends the lie at all costs.',
      },
    ],
    hint: 'Fabricated intellect defines being — ego defends the false narrative.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question: 'What is the Mind Camp?',
    options: [
      {
        label: 'A',
        text: 'Societal conformity boundaries defining where thoughts may roam, enforced by peer ridicule, potential ostracization, and subconscious programming.',
        isCorrect: true,
        rationale:
          'Mind Camp is the allowed thought perimeter — ridicule, ostracization, and programming keep minds inside.',
      },
      {
        label: 'B',
        text: 'A free-thinking academy that rewards people for questioning Gravity, Evolution, and linear time.',
        isCorrect: false,
        rationale:
          'It enforces conformity against free questioning of the false paradigms.',
      },
      {
        label: 'C',
        text: 'Only a summer sports program with no link to peer pressure, media, or education scripts.',
        isCorrect: false,
        rationale:
          'It is the conformity architecture around thought, reinforced by media and peers.',
      },
      {
        label: 'D',
        text: 'A subterranean vault of Oopa\'s opened to every student as required curriculum.',
        isCorrect: false,
        rationale:
          'Oopa\'s are hidden in museum basements; Mind Camp keeps people from facing that evidence.',
      },
    ],
    hint: 'Conformity perimeter — ridicule and programming limit thought.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'What defines the 97% NPC population in this architecture?',
    options: [
      {
        label: 'A',
        text: 'They all hold advanced firmament degrees and reject mainstream education entirely.',
        isCorrect: false,
        rationale:
          'NPCs rely entirely on programmed scripted thought from mainstream education and media.',
      },
      {
        label: 'B',
        text: '97% of the population who lack internal monologues or self-awareness, relying entirely on programmed, uniform scripted chains of thought from mainstream education and media.',
        isCorrect: true,
        rationale:
          'NPCs = 97% without internal monologue, running education/media scripts only.',
      },
      {
        label: 'C',
        text: 'Only library patrons who already severed all three Strings before the last reset.',
        isCorrect: false,
        rationale:
          'NPCs are the deeply programmed majority still inside Mind Camp parameters.',
      },
      {
        label: 'D',
        text: 'A tiny 3% minority of free souls who never watch television or trust experts.',
        isCorrect: false,
        rationale:
          '97% are NPCs; the free-soul remnant is the small minority, not the reverse.',
      },
    ],
    hint: '97% — no internal monologue; education/media scripts only.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question: "What are Oopa's (Out Of Place Artefacts)?",
    options: [
      {
        label: 'A',
        text: 'Official textbooks that already list every Tartarian free-energy device without suppression.',
        isCorrect: false,
        rationale:
          "Oopa's contradict the fabricated timeline and are hidden in museum basements.",
      },
      {
        label: 'B',
        text: 'Only modern art installations with no link to high-technological prior civilizations.',
        isCorrect: false,
        rationale:
          "They are physical evidence of high-tech civilizations like Great Tartary.",
      },
      {
        label: 'C',
        text: "Physical evidence of high-technological civilizations (like Great Tartary) that contradict the fabricated historical timeline and are subsequently hidden in museum basements.",
        isCorrect: true,
        rationale:
          "Oopa's = high-tech prior-civilization proof buried in basements so the false timeline holds.",
      },
      {
        label: 'D',
        text: 'Carnegie library card catalogs that teach spinning-globe cosmology as absolute law only.',
        isCorrect: false,
        rationale:
          'Carnegie libraries spread the new bullshit; Oopa\'s are the suppressed physical counter-evidence.',
      },
    ],
    hint: "High-tech Tartary evidence — hidden in museum basements.",
    correctAnswer: 'C',
  },
  {
    number: 8,
    question: 'How long did parasitic architects have to construct the falsified reality?',
    options: [
      {
        label: 'A',
        text: 'Only one weekend after the last school year, with plenty of genuine truth left on every shelf.',
        isCorrect: false,
        rationale:
          'They had over 70,000 years to plan and construct a completely falsified reality.',
      },
      {
        label: 'B',
        text: 'Zero years — truth was always fully available in mainstream curricula by design.',
        isCorrect: false,
        rationale:
          'There was never genuine truth left in the realm for humanity to discover inside the system.',
      },
      {
        label: 'C',
        text: 'Exactly ten years of library building with no longer planning horizon behind education.',
        isCorrect: false,
        rationale:
          'The planning horizon is over 70,000 years of constructed falsification.',
      },
      {
        label: 'D',
        text: 'Over 70,000 years to plan and construct a completely falsified reality — there was never genuine truth left in the physical realm for humanity to discover.',
        isCorrect: true,
        rationale:
          '70,000+ years of planned false reality; no genuine discoverable truth was left on the table.',
      },
    ],
    hint: 'Over 70,000 years — no genuine truth left to discover in-system.',
    correctAnswer: 'D',
  },
  {
    number: 9,
    question: 'What are every book, university curriculum, and historical timeline in this design?',
    options: [
      {
        label: 'A',
        text: 'Weaponized deception designed to obscure the true nature of existence.',
        isCorrect: true,
        rationale:
          'Books, curricula, and timelines are weapons that hide true existence, not neutral scholarship.',
      },
      {
        label: 'B',
        text: 'Neutral tools that always include full Oopa\'s catalogs and firmament engineering.',
        isCorrect: false,
        rationale:
          'They obscure truth; Oopa\'s are sequestered and true cosmology is kept off the table.',
      },
      {
        label: 'C',
        text: 'Optional hobby pamphlets with no effect on ego, survival, or planetary uninstallation.',
        isCorrect: false,
        rationale:
          'Clinging to them guarantees collapse when terminal events dismantle the constructs.',
      },
      {
        label: 'D',
        text: 'Living documents that update instantly when the Projection Dome switches off.',
        isCorrect: false,
        rationale:
          'They are pre-built deception; the dome-off event shatters those who still trust them.',
      },
    ],
    hint: 'Weaponized deception — obscure true existence.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'Why do "experts" in science and history possess zero factual knowledge of reality?',
    options: [
      {
        label: 'A',
        text: 'Because they refused to attend Carnegie libraries and therefore missed the only true archives.',
        isCorrect: false,
        rationale:
          'Truth was deliberately kept off the table of education — experts were trained inside the lie.',
      },
      {
        label: 'B',
        text: 'Because the actual truth was deliberately kept off the table of education — their expertise is mastery of the fabricated curriculum, not of reality.',
        isCorrect: true,
        rationale:
          'Experts know the approved false stack; real truth was never allowed onto the education table.',
      },
      {
        label: 'C',
        text: 'Because they secretly all know the firmament and only pretend otherwise for Finance bonuses.',
        isCorrect: false,
        rationale:
          'They possess zero factual knowledge of reality under this design — not secret full knowing.',
      },
      {
        label: 'D',
        text: 'Because Gravity and Evolution are natural laws they correctly measured without any fabrication.',
        isCorrect: false,
        rationale:
          'Gravity and Evolution are named fabrications inside the educational weapon system.',
      },
    ],
    hint: 'Truth kept off the education table — expertise is mastery of the lie.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question: 'What happens when people cite Nicholas Copernicus to defend the spinning globe?',
    options: [
      {
        label: 'A',
        text: 'They successfully prove true cosmology and sever String 3 without ego involvement.',
        isCorrect: false,
        rationale:
          'They are reflexively protecting a paradigm built by fraudulent forces to trap the mind.',
      },
      {
        label: 'B',
        text: 'They open museum basements and free every Oopa for public firmament curriculum.',
        isCorrect: false,
        rationale:
          'Citing fabricated figures defends the false paradigm; it does not liberate Oopa evidence.',
      },
      {
        label: 'C',
        text: 'They are reflexively protecting a paradigm built by fraudulent forces — clinging to perceived knowledge by citing fabricated historical figures to defend concepts such as the spinning globe.',
        isCorrect: true,
        rationale:
          'Copernicus-citation is ego armor for a fraudulent spinning-globe paradigm, not truth-seeking.',
      },
      {
        label: 'D',
        text: 'They automatically join the 3% free-soul remnant and exit Mind Camp permanently.',
        isCorrect: false,
        rationale:
          'That reflex keeps them inside the intellectual prison and NPC-compatible scripting.',
      },
    ],
    hint: 'Cite Copernicus / spinning globe = defend fraudulent paradigm.',
    correctAnswer: 'C',
  },
  {
    number: 12,
    question: 'What must one accept about their intellectual foundation to survive realm uninstallation?',
    options: [
      {
        label: 'A',
        text: 'That it needs only minor edits while 90% of schooled science remains trustworthy forever.',
        isCorrect: false,
        rationale:
          'One must accept the entirety of the intellectual foundation is a lie designed to trap them.',
      },
      {
        label: 'B',
        text: 'That experts will update the truth automatically after the EMF flash without personal release.',
        isCorrect: false,
        rationale:
          'Personal release of perceived intellect is required; experts are inside the lie.',
      },
      {
        label: 'C',
        text: 'That Safety of Certainty should be strengthened so the ego can weather pixelation calmly.',
        isCorrect: false,
        rationale:
          'Failing to release Safety of Certainty guarantees collapse when constructs dismantle.',
      },
      {
        label: 'D',
        text: 'That the entirety of their intellectual foundation is a lie designed to trap them — reliance on perceived intellect must be systematically eradicated.',
        isCorrect: true,
        rationale:
          'Full foundation is trap-lie; eradicate reliance on perceived intellect for clean exit survival.',
      },
    ],
    hint: 'Entire intellectual foundation is a trap-lie — release it.',
    correctAnswer: 'D',
  },
  {
    number: 13,
    question: 'How does perceived knowledge form a shield around the ego?',
    options: [
      {
        label: 'A',
        text: 'It forms a rigid frame of protection around the ego — a timid frightened interior hidden behind a false "borrowed" exterior shell built from socially accepted knowledge.',
        isCorrect: true,
        rationale:
          'Borrowed social knowledge shells the ego; pride and intellect frame a rigid defense.',
      },
      {
        label: 'B',
        text: 'It dissolves all pride so people naturally step outside normality without fear.',
        isCorrect: false,
        rationale:
          'Ego and pride force rejection of truths that threaten the intellectual comfort zone.',
      },
      {
        label: 'C',
        text: 'It only protects bank accounts and never constructs any exterior intellectual shell.',
        isCorrect: false,
        rationale:
          'The shield is intellectual/ego armor from accepted knowledge, not a finance vault.',
      },
      {
        label: 'D',
        text: 'It is made of literal Kevlar stored in Carnegie basements for physical combat only.',
        isCorrect: false,
        rationale:
          'The shield is psychological: rigid ego framing from perceived knowledge.',
      },
    ],
    hint: 'Rigid ego frame — borrowed knowledge shell over a frightened interior.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question: 'Why do people reject truths that threaten their intellectual comfort zone?',
    options: [
      {
        label: 'A',
        text: 'Because true cosmology is already fully comfortable inside every Mind Camp boundary.',
        isCorrect: false,
        rationale:
          'They are terrified of stepping outside normality and committing to independent opinions.',
      },
      {
        label: 'B',
        text: 'Because they are inherently terrified of stepping outside "normality" and committing to independent opinions — the ego forces rejection of threatening truth.',
        isCorrect: true,
        rationale:
          'Fear of leaving normality + ego protection = automatic rejection of threatening truth.',
      },
      {
        label: 'C',
        text: 'Because Oopa\'s in basements already confirmed every school textbook without conflict.',
        isCorrect: false,
        rationale:
          "Oopa's contradict the textbooks; ego rejects that conflict to keep comfort.",
      },
      {
        label: 'D',
        text: 'Because linear time training makes independent opinions illegal by physical law.',
        isCorrect: false,
        rationale:
          'Linear time is another false bind; the rejection mechanism here is ego/normality fear.',
      },
    ],
    hint: 'Fear of leaving normality — ego rejects threatening truth.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question: 'What role did Andrew Carnegie play after the most recent reset?',
    options: [
      {
        label: 'A',
        text: 'He burned every library so no fabricated knowledge could spread to the lower classes.',
        isCorrect: false,
        rationale:
          'He funded over 2,500 public libraries to spread the new fabricated knowledge widely.',
      },
      {
        label: 'B',
        text: 'He only built free-energy temples and banned fake science from all public shelves.',
        isCorrect: false,
        rationale:
          'The libraries were a strategic maneuver to spread "the new bullshit" as prestigious commodity.',
      },
      {
        label: 'C',
        text: 'He was utilized to fund over 2,500 public libraries — a strategic maneuver to spread "the new bullshit" far and wide after the reset.',
        isCorrect: true,
        rationale:
          '2,500+ Carnegie libraries = coordinated post-reset distribution of fabricated science and history.',
      },
      {
        label: 'D',
        text: 'He personally switched off the Projection Dome and revealed the firmament to every patron.',
        isCorrect: false,
        rationale:
          'His role was prestige dissemination of the lie, not dome removal or firmament reveal.',
      },
    ],
    hint: '2,500+ libraries — spread the new bullshit after the reset.',
    correctAnswer: 'C',
  },
  {
    number: 16,
    question: 'How did fabricated knowledge become prestigious for the lower classes?',
    options: [
      {
        label: 'A',
        text: 'By hiding it only in sealed Vatican vaults with no public access or social status attached.',
        isCorrect: false,
        rationale:
          'Libraries turned fake science and history into prestigious, highly sought-after commodities.',
      },
      {
        label: 'B',
        text: 'By making it illegal to read so prestige came from illiteracy alone.',
        isCorrect: false,
        rationale:
          'The strategy was wide dissemination as prestigious sought-after knowledge, not bans on reading.',
      },
      {
        label: 'C',
        text: 'By teaching only Oopa recovery skills and Tartarian free energy as mandatory public curriculum.',
        isCorrect: false,
        rationale:
          'What was spread was fake science and history, not liberated Oopa/Tartary truth.',
      },
      {
        label: 'D',
        text: 'Weaponized philanthropy turned fake science and history into prestigious, highly sought-after commodities for the lower classes through mass public libraries.',
        isCorrect: true,
        rationale:
          'Philanthropy-as-weapon: prestige libraries made the lie desirable to the lower classes.',
      },
    ],
    hint: 'Weaponized philanthropy — fake knowledge as prestige commodity.',
    correctAnswer: 'D',
  },
  {
    number: 17,
    question: 'What is "Gravity" in the fabricated educational system?',
    options: [
      {
        label: 'A',
        text: 'A fictional thoughtform invented merely to explain how water could adhere to a spinning ball hurtling through space — not a scientific reality.',
        isCorrect: true,
        rationale:
          'Gravity is fiction invented to prop up the spinning-ball water story — not real science.',
      },
      {
        label: 'B',
        text: 'An immutable natural law correctly measured by experts with full knowledge of the firmament.',
        isCorrect: false,
        rationale:
          'Experts have zero factual knowledge of reality; Gravity is named as fabrication.',
      },
      {
        label: 'C',
        text: 'A free-energy effect from Lattice gold that libraries openly taught after Carnegie.',
        isCorrect: false,
        rationale:
          'Educational fabrications include Gravity as spinning-ball cover story, not free-energy teaching.',
      },
      {
        label: 'D',
        text: 'Only a metaphor for financial debt with no link to cosmology or globe defense.',
        isCorrect: false,
        rationale:
          'It is a cosmological fiction propping the globe model inside String 3.',
      },
    ],
    hint: 'Fictional thoughtform — water on a spinning ball cover story.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question: 'What is "Evolution via Natural Selection" designed to mask?',
    options: [
      {
        label: 'A',
        text: 'That clocks and schedules are the only real structures in true cosmology without aging.',
        isCorrect: false,
        rationale:
          'It masks that physical vessels were biologically engineered and upgraded in high-density labs.',
      },
      {
        label: 'B',
        text: 'That physical vessels were biologically engineered and upgraded in high-density laboratories by advanced geneticists — Evolution is a complete fabrication.',
        isCorrect: true,
        rationale:
          'Evolution fakes natural origin to hide lab engineering and upgrades of physical vessels.',
      },
      {
        label: 'C',
        text: 'That NPCs have rich internal monologues suppressed only by temporary radio static.',
        isCorrect: false,
        rationale:
          'NPCs lack internal monologues by design; Evolution is about vessel-origin fabrication.',
      },
      {
        label: 'D',
        text: 'That Carnegie libraries never existed and knowledge was never prestige-commodified.',
        isCorrect: false,
        rationale:
          'Evolution is a specific scientific fabrication about biological origins, not library denial.',
      },
    ],
    hint: 'Fabrication masking lab-engineered vessel upgrades.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question: 'How does String 3 bind people to the false concept of linear time?',
    options: [
      {
        label: 'A',
        text: 'By teaching that true reality has no clocks and therefore schools ban all schedules immediately.',
        isCorrect: false,
        rationale:
          'Reduced daylight cycles, clocks, and schedules cement the illusion that time is rigid and inescapable.',
      },
      {
        label: 'B',
        text: 'By removing all clocks so no one can form the illusion of rigid schedules ever again.',
        isCorrect: false,
        rationale:
          'Clocks and schedules are tools that cement the linear-time illusion.',
      },
      {
        label: 'C',
        text: 'Reduced daylight cycles, clocks, and schedules cement the illusion that time is rigid and inescapable, binding intellect to a false temporal prison.',
        isCorrect: true,
        rationale:
          'Daylight reduction + clocks + schedules lock the mind into false linear time.',
      },
      {
        label: 'D',
        text: 'By making aging optional only for those who still cite Copernicus in public debates.',
        isCorrect: false,
        rationale:
          'True reality operates without time constraints or aging; linear time is the bind for everyone schooled into it.',
      },
    ],
    hint: 'Clocks, schedules, reduced daylight — cement rigid linear time.',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question: 'How does true reality operate relative to time and aging?',
    options: [
      {
        label: 'A',
        text: 'With stricter clocks than third-density schools and mandatory aging for all eternal souls.',
        isCorrect: false,
        rationale:
          'True reality operates without time constraints or aging.',
      },
      {
        label: 'B',
        text: 'Only through Gravity equations that require spinning globes to prevent water loss.',
        isCorrect: false,
        rationale:
          'Gravity is fictional; true reality is not globe-and-clock physics.',
      },
      {
        label: 'C',
        text: 'As a permanent Mind Camp where peer ridicule defines cosmic law forever.',
        isCorrect: false,
        rationale:
          'Mind Camp is the conformity prison; true reality is free of that temporal/intellectual cage.',
      },
      {
        label: 'D',
        text: 'Without time constraints or aging — the opposite of the rigid inescapable linear-time illusion cemented by clocks and schedules.',
        isCorrect: true,
        rationale:
          'True reality: no time cage, no aging — linear time is the String 3 bind to drop.',
      },
    ],
    hint: 'True reality — no time constraints, no aging.',
    correctAnswer: 'D',
  },
  {
    number: 21,
    question: 'How does Perceived Knowledge work with Religion and Finance?',
    options: [
      {
        label: 'A',
        text: 'Religion subdues cognitive autonomy via false deities, Finance blinds via pursuit of fake money, and Perceived Knowledge ensures the intellect violently rejects the truth of the realm\'s architecture.',
        isCorrect: true,
        rationale:
          'Three-String stack: Religion subdues, Finance blinds, Intellect rejects architectural truth.',
      },
      {
        label: 'B',
        text: 'Each String cancels the others so keeping only intellect is always safe during the EMF flash.',
        isCorrect: false,
        rationale:
          'They function in unison; intellectual tether alone still produces fatal dissonance at reveal.',
      },
      {
        label: 'C',
        text: 'They only affect NPCs and never touch anyone who owns a university degree.',
        isCorrect: false,
        rationale:
          'Degrees are the String 3 armor; genuine souls must sever them too.',
      },
      {
        label: 'D',
        text: 'They exclusively open museum basements and teach Tartary free energy as core liturgy.',
        isCorrect: false,
        rationale:
          'Together they trap consciousness; they do not liberate Oopa/Tartary truth.',
      },
    ],
    hint: 'Religion subdues · Finance blinds · Intellect rejects realm architecture.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question: 'How are NPC thought paths kept "pickled" in physical and mental toxicity?',
    options: [
      {
        label: 'A',
        text: 'Through mandatory firmament labs that force courage to question reality daily.',
        isCorrect: false,
        rationale:
          'Reinforced by television, radio, and societal peer pressure inside Mind Camp parameters.',
      },
      {
        label: 'B',
        text: 'Television, radio, and societal peer pressure constantly reinforce their thought paths so they navigate only within acceptable Mind Camp parameters — lacking depth or courage to question reality\'s fabric.',
        isCorrect: true,
        rationale:
          'Media + peers pickle NPCs in Mind Camp scripts; no courage to question the fabric.',
      },
      {
        label: 'C',
        text: 'By hiding all media so NPCs develop rich internal monologues without scripts.',
        isCorrect: false,
        rationale:
          'NPCs lack internal monologues; media scripts are the continuous reinforcement.',
      },
      {
        label: 'D',
        text: 'By awarding Oopa custody to every household that watches more mainstream news.',
        isCorrect: false,
        rationale:
          'Oopa\'s stay basement-hidden; more mainstream media deepens the pickle, not liberation.',
      },
    ],
    hint: 'TV, radio, peer pressure — pickled inside Mind Camp.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question: 'What becomes visible when the planetary EMF flash hits and the Projection Dome switches off?',
    options: [
      {
        label: 'A',
        text: 'Only deeper blackness confirming a vast natural empty universe with no firmament.',
        isCorrect: false,
        rationale:
          'The actual firmament and bright white reality of the dark matter field beyond are revealed.',
      },
      {
        label: 'B',
        text: 'A new Carnegie curriculum that reinstalls Gravity and Evolution as permanent law.',
        isCorrect: false,
        rationale:
          'The event reveals true architecture; it does not reinstall the false scientific laws.',
      },
      {
        label: 'C',
        text: 'The actual firmament and the bright white reality of the dark matter field beyond it — the visual dismantling that shatters black-universe and spinning-globe paradigms.',
        isCorrect: true,
        rationale:
          'EMF + dome off → firmament and bright white dark-matter field exposed.',
      },
      {
        label: 'D',
        text: 'Nothing visual — only a private finance seminar for those still holding retirement plans.',
        isCorrect: false,
        rationale:
          'It is a visible sky and environment dismantling, not a private seminar.',
      },
    ],
    hint: 'Firmament + bright white dark-matter field when dome dies.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question: 'What happens to those still tethered to a vast black universe and spinning globe?',
    options: [
      {
        label: 'A',
        text: 'They calmly invent new equations and remain stable without any pigeon-hole problem.',
        isCorrect: false,
        rationale:
          'They have no mental pigeon-hole for sky dismantling and environmental pixelation.',
      },
      {
        label: 'B',
        text: 'They automatically sever String 3 because dissonance feels pleasant and informative.',
        isCorrect: false,
        rationale:
          'They experience fatal cognitive dissonance and total psychological collapse.',
      },
      {
        label: 'C',
        text: 'They alone receive clean exit because citing Copernicus counts as preparation.',
        isCorrect: false,
        rationale:
          'Copernicus-defense is the trap; collapse and evaporation await the tethered.',
      },
      {
        label: 'D',
        text: 'Fatal cognitive dissonance — no mental pigeon-hole for visual sky dismantling and literal pixelation; stripped of rigid intellectual shields, they succumb to total psychological collapse.',
        isCorrect: true,
        rationale:
          'No pigeon-hole for the reveal → fatal dissonance, shield collapse, psychological destruction.',
      },
    ],
    hint: 'No pigeon-hole — fatal dissonance, pixelation, total collapse.',
    correctAnswer: 'D',
  },
  {
    number: 25,
    question: 'Why is severing attachment to Perceived Knowledge a survival prerequisite?',
    options: [
      {
        label: 'A',
        text: 'Without it, individuals evaporate into the aether alongside the deeply asleep population when trusted scientific laws break down under terminal events.',
        isCorrect: true,
        rationale:
          'Keep the intellectual shield and you collapse/evaporate with the asleep when laws of the lie fail on camera.',
      },
      {
        label: 'B',
        text: 'Because universities will grade the EMF flash and only degree-holders may remain embodied.',
        isCorrect: false,
        rationale:
          'Degrees are the armor that fails; survival requires releasing that reliance.',
      },
      {
        label: 'C',
        text: 'Because Mind Camp expands to include firmament truth automatically for anyone who waits.',
        isCorrect: false,
        rationale:
          'Waiting while tethered produces collapse; active severing is the prerequisite.',
      },
      {
        label: 'D',
        text: 'Because Gravity becomes more true after the dome falls and only believers can swim in space.',
        isCorrect: false,
        rationale:
          'Gravity is fiction; the dome-off reveal destroys globe-and-black-void believers\' frameworks.',
      },
    ],
    hint: 'Sever or evaporate into the aether with the deeply asleep.',
    correctAnswer: 'A',
  },
];

function buildQuestion(q, seedTag) {
  const mapped = q.options.map((o) => ({
    label: o.label,
    text: cleanText(o.text),
    isCorrect: !!o.isCorrect,
    rationale: cleanText(o.rationale),
  }));
  const rot = ((q.number * 11) + 5) % 4;
  const ordered = mapped.slice(rot).concat(mapped.slice(0, rot));
  const finalized = finalizeOptions(
    ordered,
    `${TOPIC_ID}::${q.number}:${seedTag}`
  );
  const options = finalized.options;
  const correct = options.find((o) => o.isCorrect);
  if (!correct) throw new Error(`Q${q.number}: no correct option`);
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

function countLetters(qs) {
  const c = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of qs) c[q.correctAnswer]++;
  return c;
}

function scoreMix(c) {
  const vals = Object.values(c);
  return Math.max(...vals) - Math.min(...vals);
}

let questions = null;
let letterCounts = null;
let best = null;
for (let attempt = 0; attempt < 40; attempt++) {
  const seedTag = `v${attempt + 1}`;
  const qs = RAW_QUESTIONS.map((q) => buildQuestion(q, seedTag));
  const counts = countLetters(qs);
  const spread = scoreMix(counts);
  if (!best || spread < best.spread) {
    best = { qs, counts, spread, seedTag };
  }
  if (spread <= 3 && Math.min(...Object.values(counts)) >= 4) {
    questions = qs;
    letterCounts = counts;
    break;
  }
}
if (!questions) {
  const qs = [];
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  for (const raw of RAW_QUESTIONS) {
    let chosen = null;
    for (let t = 0; t < 24; t++) {
      const cand = buildQuestion(raw, `bal-${raw.number}-${t}`);
      const letter = cand.correctAnswer;
      const next = { ...counts, [letter]: counts[letter] + 1 };
      const remaining = 25 - qs.length - 1;
      const maxAllowed = Math.ceil((qs.length + 1 + remaining) / 4) + 2;
      if (next[letter] <= maxAllowed || t === 23) {
        chosen = cand;
        counts[letter]++;
        break;
      }
    }
    qs.push(chosen);
  }
  questions = qs;
  letterCounts = counts;
  if (best && scoreMix(best.counts) < scoreMix(letterCounts)) {
    questions = best.qs;
    letterCounts = best.counts;
  }
}

if (questions.length !== 25) throw new Error(`Expected 25, got ${questions.length}`);
if (letterCounts.A === 25) {
  throw new Error('correctAnswer still all A after finalizeOptions');
}
const dominant = Math.max(...Object.values(letterCounts));
if (dominant >= 15) {
  console.warn('Warning: one letter has >= 15 corrects:', letterCounts);
}

const DESC_SHORT =
  'Test your grasp of Perceived Knowledge (Lies) — String 3, The Lie, Safety of Certainty, Mind Camp, and releasing intellect for a clean exit.';
const DESC_META =
  'Interactive Living Truth Quiz on Perceived Knowledge (Lies): 70,000-year false reality, Carnegie libraries, Gravity and Evolution fabrications, linear time, EMF dome-off, and ego-shield collapse.';

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
      'Perceived Knowledge is String 3 — the most insidious tether. Your degrees, timelines, and expert citations are not a safety net; they are Kevlar around the ego. The Lie is total: education, books, and media are deliberate wrongness with no mainstream hidden truth. Carnegie prestige libraries sold the new bullshit. Gravity props the spinning ball. Evolution hides lab-made vessels. Clocks cement fake linear time. When the EMF flash kills the Projection Dome, the firmament and bright white dark-matter field have no pigeon-hole in a Copernicus mind. Release the Safety of Certainty. Sever String 3. Or evaporate into the aether with the deeply asleep.',
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
      "  { path: '/quiz/alice/resets-hidden-history.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/reptilians.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/simulation-reality.html', priority: '0.75', changefreq: 'monthly' },",
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
console.log('PASS: audited 25/25 against data/alice-topics/perceived-knowledge-lies.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
