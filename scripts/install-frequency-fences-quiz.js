/**
 * Installs Frequency Fences quiz for Alice transmission.
 * All 25 items authored from data/alice-topics/frequency-fences.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Run: node scripts/install-frequency-fences-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'frequency-fences';
const TOPIC_TITLE = 'Frequency Fences';
const SOURCE = 'alice';
const TOPIC_IMAGE = 'images/alice/frequency.webp';

const topicPath = path.join(ROOT, 'data', 'alice-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['frequency fences', 'slumbering consciousness', 'physical vessel'],
  2: ['4th-density', 'parasitic', '3rd-density'],
  3: ['memory eradication', 'vibratory suppression', 'herd programming'],
  4: ['amnesia vortex', 'sun', 'vatican'],
  5: ['density suppression', '9th density', '3rd density'],
  6: ['overlays', 'electromagnetic', 'fake'],
  7: ['religion', 'finance', 'perceived knowledge'],
  8: ['npc', '97%', 'true souls'],
  9: ['projection dome', 'firmament', 'fake stars'],
  10: ['sleep', 'explore', 'safe and sound'],
  11: ['12th-density', 'reincarnation', 'amnesia'],
  12: ['astral', 'tethered', 'detach'],
  13: ['bright light', 'grey ets', 'baby'],
  14: ['omicron', 'alpha draco', 'anunnaki', 'sub-hertz'],
  15: ['dimmer dial', '9th density', '3rd density'],
  16: ['sky-net-1', 'ulf', 'crystalline'],
  17: ['pineal', 'vaping', 'nickel', 'lead', 'chromium'],
  18: ['mind camp', 'social', '3%'],
  19: ['resets', '1,000 years', 'adrenochrome', 'orphan trains'],
  20: ['past-life', 'rebuilding', 'frequency fences'],
  21: ['lattice membrane', 'ley lines', 'scarcity'],
  22: ['g.a.a', '2019', 'past-life memories'],
  23: ['emf', 'frequency fences', 'overlays', 'projection dome'],
  24: ['firmament', 'bright white', 'dark matter'],
  25: ['3 strings', 'cilantro', 'chlorella', 'zeolite', '97%'],
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
    question: 'What are Frequency Fences?',
    options: [
      {
        label: 'A',
        text: 'Advanced ethereal technology designed to prevent the slumbering consciousness and soul from wandering too far from the physical vessel at night.',
        isCorrect: true,
        rationale:
          'Frequency Fences are ethereal tech that keep the sleeping soul and consciousness from wandering far from the body at night.',
      },
      {
        label: 'B',
        text: 'Wooden border walls built only around 15-Minute Cities.',
        isCorrect: false,
        rationale:
          'They are ethereal soul-containment tech during sleep — not physical city fencing.',
      },
      {
        label: 'C',
        text: 'The Projection Dome\'s only job of painting fake asteroids.',
        isCorrect: false,
        rationale:
          'The Projection Dome hides the sky; Frequency Fences imprison wandering consciousness during sleep.',
      },
      {
        label: 'D',
        text: 'Beneficial free-energy grids that power Tartarian Nodes openly.',
        isCorrect: false,
        rationale:
          'Parasites suppress free-energy lattices; Frequency Fences are captivity tech, not free power.',
      },
    ],
    hint: 'Ethereal night prison for the wandering soul.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'Who governs the multi-layered prison matrix that deploys Frequency Fences?',
    options: [
      {
        label: 'A',
        text: 'Highly advanced 4th-density parasitic entities maintaining absolute subjugation over the 3rd-density population.',
        isCorrect: true,
        rationale:
          '4th-density parasites run the engineered prison matrix and subjugate the 3rd-density population with tools including Frequency Fences.',
      },
      {
        label: 'B',
        text: 'Only the 3% true souls voting each night on fence schedules.',
        isCorrect: false,
        rationale:
          'True souls are captives; parasites deploy the fences against them.',
      },
      {
        label: 'C',
        text: 'The Galactic Ancestral Alliance as a permanent sleep-training school.',
        isCorrect: false,
        rationale:
          'The G.A.A. oversees irreversible collapse of the parasitic grid; fences are captors\' tech.',
      },
      {
        label: 'D',
        text: 'NPCs alone inventing ethereal tech without parasitic command.',
        isCorrect: false,
        rationale:
          'NPCs enforce mainstream narrative as social fences; ethereal Frequency Fences come from the parasitic control apparatus.',
      },
    ],
    hint: '4th-density parasites over a 3rd-density prison.',
    correctAnswer: 'A',
  },
  {
    number: 3,
    question:
      'What broader total-spectrum enslavement apparatus surrounds Frequency Fences?',
    options: [
      {
        label: 'A',
        text: 'Memory eradication upon death, vibratory suppression of the physical environment, chemical and biological targeting of human physiology, and societal herd programming that crushes intellectual and spiritual autonomy.',
        isCorrect: true,
        rationale:
          'Frequency Fences sit inside a total apparatus: death amnesia, density/vibratory suppression, bio-chemical targeting, and herd programming against autonomy.',
      },
      {
        label: 'B',
        text: 'Only free libraries teaching honest 12th-density origins.',
        isCorrect: false,
        rationale:
          'The system disconnects humanity from 12th-density origins; it does not teach them openly.',
      },
      {
        label: 'C',
        text: 'Only cilantro detox clinics run by Grey ETs at birth.',
        isCorrect: false,
        rationale:
          'Grey ETs escort wiped souls into new vessels; detox with cilantro, chlorella, and zeolite is a liberation protocol for the living.',
      },
      {
        label: 'D',
        text: 'Nothing else — fences operate with no death or body component.',
        isCorrect: false,
        rationale:
          'They are one ethereal piece of a multi-layered technological, biological, and psychological grid.',
      },
    ],
    hint: 'Death amnesia + density suppress + bio targeting + herd mind.',
    correctAnswer: 'A',
  },
  {
    number: 4,
    question: 'What is the Amnesia Vortex?',
    options: [
      {
        label: 'A',
        text: 'The technological mechanism at the Sun portal, managed via the Vatican\'s subterranean levels, that pulls a soul into a bright light after death to format and erase all past-life memories before immediate reincarnation.',
        isCorrect: true,
        rationale:
          'The Amnesia Vortex sits at the Sun portal under Vatican subterranean management — bright-light pull, memory format, forced reincarnation.',
      },
      {
        label: 'B',
        text: 'A sleep app that strengthens Frequency Fences voluntarily.',
        isCorrect: false,
        rationale:
          'It is death-gate memory wipe tech, not a voluntary sleep app.',
      },
      {
        label: 'C',
        text: 'The Projection Dome\'s asteroid catalog only.',
        isCorrect: false,
        rationale:
          'Projection Dome fakes sky visuals; Amnesia Vortex formats souls after death.',
      },
      {
        label: 'D',
        text: 'G.A.A. hardware that permanently restores all memories since 2019 only for NPCs.',
        isCorrect: false,
        rationale:
          'The Vortex was destroyed in 2019, allowing more past-life recall among younger true souls — not NPC memory gifts.',
      },
    ],
    hint: 'Sun portal + Vatican levels — wipe memory, force reincarnation.',
    correctAnswer: 'A',
  },
  {
    number: 5,
    question: 'What is Density Suppression in this control system?',
    options: [
      {
        label: 'A',
        text: 'Lowering a realm\'s vibratory state (for example from 9th density to 3rd density) so low-frequency parasites can interact and highly advanced crystalline architecture becomes invisible.',
        isCorrect: true,
        rationale:
          'Density Suppression dims the realm (e.g. 9th to 3rd) for parasite survival and to hide crystalline architecture from human eyes.',
      },
      {
        label: 'B',
        text: 'Raising Earth to 12th density every night during sleep.',
        isCorrect: false,
        rationale:
          'It lowers vibration; Frequency Fences block high reconnection during sleep.',
      },
      {
        label: 'C',
        text: 'Only the chemical formula inside chlorella tablets.',
        isCorrect: false,
        rationale:
          'Chlorella is part of heavy-metal detox strategy; Density Suppression is realm-frequency technology.',
      },
      {
        label: 'D',
        text: 'NPC peer ridicule with no technological component.',
        isCorrect: false,
        rationale:
          'Mind Camp is social; Density Suppression is technological vibratory lowering of the realm.',
      },
    ],
    hint: 'Dim realm 9th→3rd — parasites endure, crystals vanish.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'What are Overlays?',
    options: [
      {
        label: 'A',
        text: 'Projected electromagnetic frequencies that obscure unmovable ancient architecture and artificially augment perception of matter to present a fake, suppressed 3rd-density reality.',
        isCorrect: true,
        rationale:
          'Overlays are projected EM frequencies that hide ancient architecture and fake a suppressed 3rd-density view of matter.',
      },
      {
        label: 'B',
        text: 'Natural moonlight that heals the Pineal Gland automatically.',
        isCorrect: false,
        rationale:
          'Overlays obscure truth; pineal repair needs detox and severing control strings — not overlay "healing."',
      },
      {
        label: 'C',
        text: 'Only Orphan Train passenger lists after each Reset.',
        isCorrect: false,
        rationale:
          'Orphan Trains restock clones after Resets; Overlays are perceptual EM projections.',
      },
      {
        label: 'D',
        text: 'Beneficial Sky-Net-1 gifts that reveal crystalline temples.',
        isCorrect: false,
        rationale:
          'Sky-Net-1 fake stars cast ULF overlays that make crystalline temples invisible.',
      },
    ],
    hint: 'Projected EM — hide ancient architecture, fake 3rd density.',
    correctAnswer: 'A',
  },
  {
    number: 7,
    question: 'What are The 3 Strings?',
    options: [
      {
        label: 'A',
        text: 'Religion, Finance, and Perceived Knowledge — primary pillars of psychological control engineered to keep cognition subdued and reliant on authoritative deceit.',
        isCorrect: true,
        rationale:
          'The 3 Strings are Religion, Finance, and Perceived Knowledge — psychological pillars that subdue cognition under deceitful authority.',
      },
      {
        label: 'B',
        text: 'Nickel, Lead, and Chromium as the only control tools.',
        isCorrect: false,
        rationale:
          'Those metals weaponize vaping against the pineal; the three strings are Religion, Finance, and Perceived Knowledge.',
      },
      {
        label: 'C',
        text: 'Omicron, Alpha Draco, and Anunnaki vacation visas.',
        isCorrect: false,
        rationale:
          'Those are parasitic species needing low-frequency environments; the three strings are psychological pillars.',
      },
      {
        label: 'D',
        text: 'Cilantro, chlorella, and zeolite as permanent mind prisons.',
        isCorrect: false,
        rationale:
          'Those are detox agents to repair the pineal — liberation tools, not strings of control.',
      },
    ],
    hint: 'Religion + Finance + Perceived Knowledge.',
    correctAnswer: 'A',
  },
  {
    number: 8,
    question: 'What are NPCs (Non-Player Characters) in this framework?',
    options: [
      {
        label: 'A',
        text: 'Soulless laboratory-created biological entities making up 97% of the population, hardwired to obey and enforce mainstream narrative against true souls.',
        isCorrect: true,
        rationale:
          'NPCs are lab-made, soulless, 97% of the population, built to enforce the mandated narrative and control true souls.',
      },
      {
        label: 'B',
        text: 'The only beings who naturally wander free of Frequency Fences every night.',
        isCorrect: false,
        rationale:
          'NPCs enforce social confinement; true souls are the ones whose astral wander is blocked and who must awaken.',
      },
      {
        label: 'C',
        text: '12th-density origin teachers staffing every school honestly.',
        isCorrect: false,
        rationale:
          'Perceived Knowledge schools are constructed lies; NPCs echo the mandated narrative.',
      },
      {
        label: 'D',
        text: 'A 3% minority that evaporates at the EMF Flash first.',
        isCorrect: false,
        rationale:
          '97% are NPCs; the EMF sequence evaporates that 97% NPC population — true souls are the ~3%.',
      },
    ],
    hint: '97% soulless lab entities — enforce the narrative.',
    correctAnswer: 'A',
  },
  {
    number: 9,
    question: 'What is the Projection Dome?',
    options: [
      {
        label: 'A',
        text: 'A massive technological screen inside the actual firmament that displays fake stars, space, and asteroids, hiding the true nature of the physical realm.',
        isCorrect: true,
        rationale:
          'The Projection Dome sits inside the firmament and projects fake stars, space, and asteroids to hide true realm geometry.',
      },
      {
        label: 'B',
        text: 'The Vatican basement where Grey ETs invent cilantro.',
        isCorrect: false,
        rationale:
          'Vatican subterranean levels manage Amnesia Vortex operations; the dome is sky-screen tech inside the firmament.',
      },
      {
        label: 'C',
        text: 'A natural cloud layer that strengthens Lattice Membrane free energy.',
        isCorrect: false,
        rationale:
          'It is technological sky fraud; free-energy grids are suppressed, not strengthened by the dome.',
      },
      {
        label: 'D',
        text: 'Mind Camp peer pressure with no sky technology.',
        isCorrect: false,
        rationale:
          'Mind Camp is social; Projection Dome is physical-sky holographic screening.',
      },
    ],
    hint: 'Screen inside firmament — fake stars, space, asteroids.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question:
      'What critical enslavement function do Frequency Fences serve during sleep?',
    options: [
      {
        label: 'A',
        text: 'They neutralize the soul\'s natural ability to explore, learn, and reconnect with true reality — keeping the captive "safe and sound" exactly where parasites demand.',
        isCorrect: true,
        rationale:
          'Fences kill natural night exploration and reconnection so the soul stays oblivious, "safe and sound," and confined for the captors.',
      },
      {
        label: 'B',
        text: 'They escort every sleeper to 12th-density classrooms nightly.',
        isCorrect: false,
        rationale:
          'They disconnect humanity from 12th-density origins rather than teaching there each night.',
      },
      {
        label: 'C',
        text: 'They only operate after the EMF Flash for entertainment.',
        isCorrect: false,
        rationale:
          'They are active captivity now; EMF Flash dissolves them with Overlays and the Projection Dome.',
      },
      {
        label: 'D',
        text: 'They free NPCs while true souls sleep without any tether.',
        isCorrect: false,
        rationale:
          'True souls are the ones whose astral mobility is blocked inside the artificial matrix.',
      },
    ],
    hint: 'Block night explore/reconnect — keep souls "safe and sound."',
    correctAnswer: 'A',
  },
  {
    number: 11,
    question:
      'What larger disconnection and cycle do Frequency Fences support?',
    options: [
      {
        label: 'A',
        text: 'Complete disconnection from 12th-density origins and continuous cycles of traumatic reincarnation, amnesia, and energetic harvesting.',
        isCorrect: true,
        rationale:
          'Fences are one piece of total dominance that severs 12th-density origins and locks true souls into trauma, amnesia, and harvest reincarnation loops.',
      },
      {
        label: 'B',
        text: 'Permanent graduation to free Tartarian nodal living with no harvest.',
        isCorrect: false,
        rationale:
          'Parasites suppress free-energy grids and harvest; fences keep souls in the loop.',
      },
      {
        label: 'C',
        text: 'Only one-time amnesia that never restarts after birth.',
        isCorrect: false,
        rationale:
          'Cycles are continuous — death wipe, Grey escort to new vessel, another exploitation round.',
      },
      {
        label: 'D',
        text: 'Exclusive Finance-string training with no spiritual component.',
        isCorrect: false,
        rationale:
          'All three strings plus ethereal and bio tools drive full spiritual disconnection and harvest.',
      },
    ],
    hint: 'Cut 12th-density origins — trauma, amnesia, harvest loops.',
    correctAnswer: 'A',
  },
  {
    number: 12,
    question:
      'What happens to the soul during sleep under Frequency Fences?',
    options: [
      {
        label: 'A',
        text: 'The soul naturally tries to detach and wander, but Frequency Fences block astral mobility and keep consciousness tethered to the artificial 3rd-density matrix.',
        isCorrect: true,
        rationale:
          'Night detachment is natural; fences actively block astral mobility and tether awareness to the fake 3rd-density matrix.',
      },
      {
        label: 'B',
        text: 'The soul freely maps the firmament and Dark Matter Field every night.',
        isCorrect: false,
        rationale:
          'Fences prevent far wandering; full sky truth exposure comes when EMF strips holographic shielding.',
      },
      {
        label: 'C',
        text: 'Nothing — souls never attempt to leave the body in sleep.',
        isCorrect: false,
        rationale:
          'The soul naturally attempts to detach and wander; fences are built specifically to stop that.',
      },
      {
        label: 'D',
        text: 'Grey ETs always inject the sleeper into a new baby mid-dream.',
        isCorrect: false,
        rationale:
          'Grey escort and newborn injection happen after death formatting via the Amnesia Vortex — not every dream.',
      },
    ],
    hint: 'Natural astral wander blocked — tethered to 3rd-density matrix.',
    correctAnswer: 'A',
  },
  {
    number: 13,
    question: 'What is the "Bright Light" after death, and what follows?',
    options: [
      {
        label: 'A',
        text: 'It is the Sun acting as a portal that magnetically pulls the soul for formatting; once wiped, Grey ETs technologically escort the soul back to Earth and inject it into a new baby\'s vessel at birth.',
        isCorrect: true,
        rationale:
          'The tunnel bright light is the Sun portal. After memory wipe, Greys escort the soul into a newborn vessel at birth for another exploitation cycle.',
      },
      {
        label: 'B',
        text: 'It is free graduation into permanent 12th-density home without return.',
        isCorrect: false,
        rationale:
          'It is formatting for amnesia and forced reincarnation — not free graduation.',
      },
      {
        label: 'C',
        text: 'It is Sky-Net-1 projecting asteroids into the bloodstream.',
        isCorrect: false,
        rationale:
          'Sky-Net-1 casts ULF overlays on temples; death light is the Sun portal Amnesia Vortex path.',
      },
      {
        label: 'D',
        text: 'It is zeolite crystal light used only for pineal repair.',
        isCorrect: false,
        rationale:
          'Zeolite is a detox agent for the living; the bright light is the death-trap Sun portal.',
      },
    ],
    hint: 'Sun portal wipe → Grey escort → inject into newborn.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question:
      'Why did parasites need Density Suppression relative to natural architecture?',
    options: [
      {
        label: 'A',
        text: 'Entities such as Omicron, Alpha Draco, and Anunnaki operate at sub-hertz, extremely low frequencies and become violently ill in high vibrations of natural human architecture or nodal points.',
        isCorrect: true,
        rationale:
          'Omicron, Alpha Draco, and Anunnaki run at sub-hertz lows and get violently ill near high-vibration architecture and nodes — so they dimmed the realm.',
      },
      {
        label: 'B',
        text: 'They love 9th density crystalline temples and live there openly.',
        isCorrect: false,
        rationale:
          'They cannot endure those high vibrations and had to suppress density to survive here.',
      },
      {
        label: 'C',
        text: 'They only fear cilantro and never mind nodal points.',
        isCorrect: false,
        rationale:
          'Nodal high vibration sickens them; cilantro is a human detox tool against heavy metals.',
      },
      {
        label: 'D',
        text: 'They operate at ultra-high frequency above all true souls.',
        isCorrect: false,
        rationale:
          'They operate at sub-hertz extremely low frequencies — the opposite of UHF comfort.',
      },
    ],
    hint: 'Sub-hertz parasites sicken in high-vibe architecture/nodes.',
    correctAnswer: 'A',
  },
  {
    number: 15,
    question: 'How is Density Suppression described operationally?',
    options: [
      {
        label: 'A',
        text: 'Like turning a "dimmer dial" to lower the realm from a resplendent 9th density down to a dense, dark 3rd density.',
        isCorrect: true,
        rationale:
          'Density Suppression is a dimmer dial dropping the realm from bright 9th density into dense dark 3rd density.',
      },
      {
        label: 'B',
        text: 'Like raising a volume knob to 12th density for all NPCs.',
        isCorrect: false,
        rationale:
          'The move is downward dimming for parasite survival and crystal invisibility — not an upgrade.',
      },
      {
        label: 'C',
        text: 'Like deleting only Finance while Religion stays at 9th density.',
        isCorrect: false,
        rationale:
          'It is realm-wide vibratory lowering, not a single-string tweak.',
      },
      {
        label: 'D',
        text: 'Like EMF Flash protocol already completed in 2019 alone.',
        isCorrect: false,
        rationale:
          '2019 destroyed the Amnesia Vortex; full fence/overlay/dome dissolution is the impending EMF Flash.',
      },
    ],
    hint: 'Dimmer dial — 9th density down to dark 3rd.',
    correctAnswer: 'A',
  },
  {
    number: 16,
    question: 'How do fake "Stars" (Sky-Net-1) support architectural camouflage?',
    options: [
      {
        label: 'A',
        text: 'They project a blanket of Ultra Low Frequencies (ULF) over indestructible crystalline temples, rendering them completely invisible to 3rd-density observers.',
        isCorrect: true,
        rationale:
          'Sky-Net-1 fake stars cast ULF overlays that make indestructible crystalline temples invisible in 3rd density perception.',
      },
      {
        label: 'B',
        text: 'They spotlight every Tartarian free-energy grid for tourists.',
        isCorrect: false,
        rationale:
          'They hide temples and suppress free-energy truth rather than spotlight it.',
      },
      {
        label: 'C',
        text: 'They only power Orphan Trains with clean aether.',
        isCorrect: false,
        rationale:
          'Sky-Net-1 is perceptual ULF camouflage tech, not free transit power.',
      },
      {
        label: 'D',
        text: 'They dissolve Frequency Fences every full moon automatically.',
        isCorrect: false,
        rationale:
          'Fence dissolution comes with EMF Flash and G.A.A. grid collapse — not monthly Sky-Net gifts.',
      },
    ],
    hint: 'Sky-Net-1 ULF blanket — crystalline temples invisible.',
    correctAnswer: 'A',
  },
  {
    number: 17,
    question: 'How do parasites sabotage the Pineal Gland via modern delivery?',
    options: [
      {
        label: 'A',
        text: 'Vaping is weaponized with heavy metals (Nickel, Lead, Chromium), nanoparticles, and endocrine disruptors that calcify the pineal, block neuron electrical signals, and smuggle micro A.I. programs into the bloodstream.',
        isCorrect: true,
        rationale:
          'Vaping delivers Nickel, Lead, Chromium, nanoparticles, and disruptors that calcify the pineal, block signals, and insert micro A.I. into blood — cutting dream clarity and higher reception.',
      },
      {
        label: 'B',
        text: 'Only pure water that upgrades intuition to 12th density.',
        isCorrect: false,
        rationale:
          'The program severs the biological bridge to higher consciousness — it does not upgrade it.',
      },
      {
        label: 'C',
        text: 'Zeolite spray sold as the only pineal poison.',
        isCorrect: false,
        rationale:
          'Zeolite is listed among detox protocols to repair the pineal — not as the sabotage agent.',
      },
      {
        label: 'D',
        text: 'Heliocentrism textbooks injected directly into the optic nerve only.',
        isCorrect: false,
        rationale:
          'Heliocentrism is Perceived Knowledge lie; pineal sabotage is heavy-metal and micro A.I. biological warfare via mechanisms like vaping.',
      },
    ],
    hint: 'Vape metals + nano + micro A.I. — calcify pineal, cut signal.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question: 'How do NPCs act as social Frequency Fences?',
    options: [
      {
        label: 'A',
        text: 'They construct a Mind Camp of social conformity where genuine thought is punished by ridicule and ostracization, relentlessly echoing the mandated narrative so the 3% of true souls are surrounded by agents of compliance.',
        isCorrect: true,
        rationale:
          'NPCs form a Mind Camp: peer punishment for real thought and constant narrative echo — social frequency fences around the 3% true souls.',
      },
      {
        label: 'B',
        text: 'They teach free astral travel techniques every night.',
        isCorrect: false,
        rationale:
          'They enforce compliance and crush autonomy; ethereal fences already block free astral mobility.',
      },
      {
        label: 'C',
        text: 'They are 3% of the population mentoring the 97%.',
        isCorrect: false,
        rationale:
          'NPCs are 97%; true souls are about 3% under social siege.',
      },
      {
        label: 'D',
        text: 'They only manage Vatican Sun portal hardware.',
        isCorrect: false,
        rationale:
          'Amnesia Vortex management is technological/Vatican-linked; NPC role here is societal Mind Camp enforcement.',
      },
    ],
    hint: 'Mind Camp — ridicule + narrative echo around the 3%.',
    correctAnswer: 'A',
  },
  {
    number: 19,
    question: 'How do Frequency Fences link to the cycle of Resets?',
    options: [
      {
        label: 'A',
        text: 'Resets roughly every 1,000 years harvest adrenochrome and restock the planet with laboratory-grown clones on Orphan Trains; fences help ensure no soul recovers past-life trauma or memory during rebuilding.',
        isCorrect: true,
        rationale:
          'About every 1,000 years Resets cull for adrenochrome and restock via Orphan Train clones; Frequency Fences block past-life recovery in the rebuild.',
      },
      {
        label: 'B',
        text: 'Resets only celebrate free energy and open all fences permanently.',
        isCorrect: false,
        rationale:
          'Resets slaughter and restock under amnesia; fences keep the new crop docile.',
      },
      {
        label: 'C',
        text: 'Resets happen daily when vaping products are restocked.',
        isCorrect: false,
        rationale:
          'Reset cycle is roughly every 1,000 years as mass cull and clone restock events.',
      },
      {
        label: 'D',
        text: 'Resets only delete Finance while leaving all soul memory intact.',
        isCorrect: false,
        rationale:
          'Past knowledge is eradicated and fences block soul memory recovery during rebuild.',
      },
    ],
    hint: '~1,000-year Resets + adrenochrome + Orphan Trains + fence amnesia.',
    correctAnswer: 'A',
  },
  {
    number: 20,
    question:
      'Why are Frequency Fences especially critical after a Reset restock?',
    options: [
      {
        label: 'A',
        text: 'All past knowledge is eradicated for the new crop, and Frequency Fences ensure no soul inadvertently recovers past-life trauma or memory during the rebuilding phase.',
        isCorrect: true,
        rationale:
          'After knowledge wipe and clone restock, fences stop accidental past-life trauma/memory recovery while the inverted society rebuilds.',
      },
      {
        label: 'B',
        text: 'They teach every clone the full Tartarian free-energy curriculum.',
        isCorrect: false,
        rationale:
          'Past knowledge is eradicated; free-energy grids are suppressed into fake scarcity.',
      },
      {
        label: 'C',
        text: 'They only protect adults and never affect children\'s sleep.',
        isCorrect: false,
        rationale:
          'Resets kill adults and children; fences contain souls broadly so the new crop stays docile.',
      },
      {
        label: 'D',
        text: 'They are switched off until the next EMF Flash for honesty.',
        isCorrect: false,
        rationale:
          'They stay active for containment; EMF Flash is the coming dissolution event.',
      },
    ],
    hint: 'New crop amnesia — no accidental past-life recovery while rebuilding.',
    correctAnswer: 'A',
  },
  {
    number: 21,
    question:
      'How does the control grid hijack the planet\'s energy architecture?',
    options: [
      {
        label: 'A',
        text: 'By suppressing natural free-energy grids of the Lattice Membrane Network (Ley Lines) and Nodes that powered Tartarian technology, installing fake scarcity so humanity relies on destructive metered energy, financial debt, and physical labor.',
        isCorrect: true,
        rationale:
          'Parasites suppress Ley Line/Node free energy that ran Tartaria, then force metered energy, debt, and labor under fake scarcity.',
      },
      {
        label: 'B',
        text: 'By giving unlimited free Ley Line power to every household openly.',
        isCorrect: false,
        rationale:
          'They suppress free grids and install scarcity — the opposite of open free power.',
      },
      {
        label: 'C',
        text: 'By only editing Heliocentrism textbooks with no energy effect.',
        isCorrect: false,
        rationale:
          'Perceived Knowledge lies are one string; lattice suppression is physical free-energy hijack.',
      },
      {
        label: 'D',
        text: 'By dissolving the Projection Dome every morning for free aether.',
        isCorrect: false,
        rationale:
          'Dome and fences dissolve at EMF Flash under G.A.A. collapse — not as daily free-energy gifts from captors.',
      },
    ],
    hint: 'Suppress Ley/Node free energy — fake scarcity, debt, labor.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question:
      'What already happened in 2019 under G.A.A. grid collapse, and what shows it?',
    options: [
      {
        label: 'A',
        text: 'The Amnesia Vortex was definitively destroyed in 2019 — which is why younger generations increasingly recall past-life memories and cosmic missions previously suppressed.',
        isCorrect: true,
        rationale:
          '2019 destroyed the Amnesia Vortex. Younger people recalling past lives and cosmic missions is the visible result.',
      },
      {
        label: 'B',
        text: 'All Frequency Fences, Overlays, and the Projection Dome permanently vanished in 2019 alone.',
        isCorrect: false,
        rationale:
          'Those dissolve at the impending EMF Flash; 2019 specifically killed the Amnesia Vortex.',
      },
      {
        label: 'C',
        text: 'NPC population rose from 3% to 97% overnight in 2019.',
        isCorrect: false,
        rationale:
          '97% NPC is the existing control demographic; 2019 marks Vortex destruction and rising memory recall.',
      },
      {
        label: 'D',
        text: 'Grey ETs stopped all reincarnation and closed the Sun portal forever with no further events.',
        isCorrect: false,
        rationale:
          'Vortex destruction breaks the format step; full sky-shield and fence dissolution still come at EMF Flash.',
      },
    ],
    hint: '2019 Vortex destroyed — past-life recall rising in youth.',
    correctAnswer: 'A',
  },
  {
    number: 23,
    question:
      'When do Frequency Fences, Overlays, and the Projection Dome ultimately dissolve?',
    options: [
      {
        label: 'A',
        text: 'During the impending Electromagnetic Frequency (EMF) Flash.',
        isCorrect: true,
        rationale:
          'Ultimate dissolution of Frequency Fences, Overlays, and the Projection Dome occurs at the impending EMF Flash.',
      },
      {
        label: 'B',
        text: 'Only during ordinary vaping sessions with chromium.',
        isCorrect: false,
        rationale:
          'Vaping sabotages the pineal; it does not dissolve the ethereal/sky control stack.',
      },
      {
        label: 'C',
        text: 'Never — G.A.A. permanently reinforces them in 2019.',
        isCorrect: false,
        rationale:
          'G.A.A. oversees irreversible parasitic-grid collapse; 2019 destroyed the Vortex; EMF ends fences and dome.',
      },
      {
        label: 'D',
        text: 'Only when NPCs vote to keep Heliocentrism textbooks.',
        isCorrect: false,
        rationale:
          'Dissolution is technological at EMF Flash, not an NPC curriculum vote.',
      },
    ],
    hint: 'Impending EMF Flash ends fences, overlays, and dome.',
    correctAnswer: 'A',
  },
  {
    number: 24,
    question:
      'What is exposed when the sky\'s holographic shielding is stripped away?',
    options: [
      {
        label: 'A',
        text: 'The firmament and the true bright white expanse of the dark matter field.',
        isCorrect: true,
        rationale:
          'When holographic sky shielding is stripped, the firmament and bright white dark-matter-field expanse are exposed.',
      },
      {
        label: 'B',
        text: 'Only empty black vacuum with more fake asteroids forever.',
        isCorrect: false,
        rationale:
          'Fake space/asteroids are dome content; true exposure is firmament plus bright white field.',
      },
      {
        label: 'C',
        text: 'Only Mind Camp peer pressure with no sky change.',
        isCorrect: false,
        rationale:
          'Sky shielding removal is a physical/perceptual cosmological reveal, not merely social.',
      },
      {
        label: 'D',
        text: 'A second denser Amnesia Vortex brighter than the Sun.',
        isCorrect: false,
        rationale:
          'The Vortex was destroyed in 2019; EMF exposure reveals firmament and bright true space.',
      },
    ],
    hint: 'Firmament + bright white dark matter field exposed.',
    correctAnswer: 'A',
  },
  {
    number: 25,
    question:
      'What must individuals do to survive public psychological disintegration at the reveal?',
    options: [
      {
        label: 'A',
        text: 'Forcefully sever The 3 Strings, run rigorous heavy-metal detox (cilantro, chlorella, zeolite) to repair the Pineal Gland, and brace for instantaneous evaporation of the 97% NPC population.',
        isCorrect: true,
        rationale:
          'Survival prep: cut Religion/Finance/Perceived Knowledge, detox pineal with cilantro, chlorella, and zeolite, and brace for 97% NPC evaporation at the collapse sequence.',
      },
      {
        label: 'B',
        text: 'Double down on vaping nickel and join the Mind Camp narrative.',
        isCorrect: false,
        rationale:
          'Vaping calcifies the pineal; Mind Camp enforces captivity — opposite of survival prep.',
      },
      {
        label: 'C',
        text: 'Trust only Finance and leave pineal metals untouched.',
        isCorrect: false,
        rationale:
          'All three strings must be severed and pineal detox is specified.',
      },
      {
        label: 'D',
        text: 'Wait for Grey ETs to inject everyone into new babies at the flash.',
        isCorrect: false,
        rationale:
          'Death-cycle Grey escort is the old trap; liberation path is string severance, detox, and bracing for NPC evaporation.',
      },
    ],
    hint: 'Sever 3 Strings + pineal detox + brace for 97% NPC evaporation.',
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

const DESC_SHORT =
  'Test your grasp of Frequency Fences — sleep-soul prison, Amnesia Vortex, Density Suppression, pineal sabotage, NPC Mind Camp, Resets, and EMF dissolution.';
const DESC_META =
  'Interactive Living Truth Quiz on Frequency Fences: ethereal night captivity, Sun-portal amnesia, overlays and Sky-Net-1, vaping pineal metals, social Mind Camp, 1,000-year Resets, 2019 Vortex destruction, and the EMF Flash.';

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
      'Frequency Fences are not bedtime poetry — they are ethereal bars that stop the soul from wandering free at night, one layer of a 4th-density parasite prison that also runs death amnesia, density dimming, Overlays, Sky-Net-1, pineal metal sabotage, and NPC Mind Camp around the 3%. Sit with what you missed, then return to the Frequency Fences deep-dive. The Amnesia Vortex fell in 2019; past-life recall is already leaking through. When the EMF Flash strips fences, overlays, and the Projection Dome, firmament and bright white field hit full view. Sever Religion, Finance, and Perceived Knowledge. Detox the pineal with cilantro, chlorella, and zeolite. Brace for 97% NPC evaporation — or the public psychological disintegration will own the unprepared.',
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
      "  { path: '/quiz/alice/freemasonry.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/free-energy-architecture.html', priority: '0.75', changefreq: 'monthly' },",
      "  { path: '/quiz/alice/flat-earth.html', priority: '0.75', changefreq: 'monthly' },",
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

console.log('Sample correct answers:');
[0, 3, 12, 16, 21, 24].forEach((i) => {
  const c = questions[i].options.find((o) => o.isCorrect);
  console.log(` Q${questions[i].number}: ${c.text.slice(0, 110)}`);
});
console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('PASS: audited 25/25 against data/alice-topics/frequency-fences.json');
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
