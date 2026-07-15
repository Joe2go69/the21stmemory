/**
 * Installs Essence of the Transmission quiz for Mega Breakdown (breakdown) transmission.
 * All 25 items authored from data/breakdown-topics/essence-of-the-transmission.json only.
 * Plain human-readable English — no LaTeX, MathJax, Markdown math, or $...$ wrappers.
 * Absolute Living Truth voice (no "according to the report").
 * Options mixed via finalizeOptions (A–D); wrong answers drafted at similar depth to correct.
 * Run: node scripts/install-essence-of-the-transmission-quiz.js && node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'essence-of-the-transmission';
const TOPIC_TITLE = 'Essence of the Transmission';
const SOURCE = 'breakdown';
const TOPIC_IMAGE = 'images/breakdown/mega-breakdown-essense.webp';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const reportLower = (topic.report || '').toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;
const hedgeRe =
  /\b(according to (this topic|the report|the text|the source)|the report |source material|the text states|key terminology defines|overview states|maps back to this topic|described in this topic)\b/i;

const supportPhrases = {
  1: ['cube', 'crystalline', 'globe'],
  2: ['second realm', 'holographic', 'overlay'],
  3: ['great purge', 'clones', 'mass reveal'],
  4: ['72-hour', 'e.b.s', 'blackout'],
  5: ['blue beam', 'wwiii', 'holographic'],
  6: ['motherships', 'solar families', 'npc'],
  7: ['npc', 'dissolve', 'simulation'],
  8: ['water domes', 'crystal halls', 'star pods'],
  9: ['travel', 'frequency', 'illusion'],
  10: ['cube containment', 'server', 'overlays'],
  11: ['forgotten gods', 'eight', 'domes'],
  12: ['178', 'great dome', 'worlds'],
  13: ['sound', 'light', 'sung'],
  14: ['perception-based', 'solidity', 'crystalline plasma'],
  15: ['anunnaki', 'draconians', 'greys'],
  16: ['spirit tree', 'hyperborea', 'saturn'],
  17: ['crystals', 'nodes', 'hard drives'],
  18: ['tartarian', 'atlantian', 'concrete'],
  19: ['sun', 'stargate', 'vatican'],
  20: ['moon', 'stars', 'star-nodes'],
  21: ['titanic', 'federal reserve', 'crystal'],
  22: ['1666', "st. paul", 'greys'],
  23: ['2015', 'monatomic', 'schumann'],
  24: ['digital id', 'white hat', 'pandemic'],
  25: ['frequency', 'scare', 'resonance'],
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
    question: 'What is the direct lived reality of our physical plane in this transmission?',
    options: [
      {
        label: 'A',
        text: 'A massive crystalline, electro-magnetic framework existing within a vast CUBE containment — not a floating globe in an empty vacuum.',
        isCorrect: true,
        rationale:
          'The plane is crystalline EM architecture inside CUBE containment, not a globe in vacuum.',
      },
      {
        label: 'B',
        text: 'A spinning ball of rock floating in empty vacuum with no CUBE, crystal, or containment architecture.',
        isCorrect: false,
        rationale:
          'The globe-in-vacuum story is the false skin; reality is CUBE-held crystalline framework.',
      },
      {
        label: 'C',
        text: 'Only a finance ledger with no physical, crystalline, or frequency structure at all.',
        isCorrect: false,
        rationale:
          'Existence is held as crystalline electro-magnetic containment architecture.',
      },
      {
        label: 'D',
        text: 'A temporary dream that vanishes if you ignore it, with no parasitic overlay to dismantle.',
        isCorrect: false,
        rationale:
          'A hijacked simulated density is fracturing; the work is returning to original harmonic existence.',
      },
    ],
    hint: 'Crystalline EM framework in CUBE containment — not a floating globe.',
    correctAnswer: 'A',
  },
  {
    number: 2,
    question: 'What is happening to the false skin of the simulated holographic density?',
    options: [
      {
        label: 'A',
        text: 'It is being permanently reinforced so the Second Realm of living crystal never appears.',
        isCorrect: false,
        rationale:
          'The false skin is rapidly fracturing to reveal the pure vibrant Second Realm of living crystal.',
      },
      {
        label: 'B',
        text: 'It is rapidly fracturing to reveal the pure, vibrant Second Realm of living crystal beneath — a return from hijacked perception-based solidity to sovereign harmonic frequencies of original existence as ancient solar creators.',
        isCorrect: true,
        rationale:
          'Overlay fractures → Second Realm crystal shows → return to original solar-creator harmonic existence.',
      },
      {
        label: 'C',
        text: 'It only affects NPCs while true Sols remain locked in 3D solidity forever without transition.',
        isCorrect: false,
        rationale:
          'The collapse of the illusion is a return to absolute light and resonance for the transition cycle.',
      },
      {
        label: 'D',
        text: 'Nothing is fracturing; the event cycle is canceled and no Great Awakening is underway.',
        isCorrect: false,
        rationale:
          'We are in the absolute culmination of the Great Awakening and dismantling of the parasitic 3D overlay.',
      },
    ],
    hint: 'False skin fractures — Second Realm living crystal returns.',
    correctAnswer: 'B',
  },
  {
    number: 3,
    question: 'What is the Great Purge in this transition architecture?',
    options: [
      {
        label: 'A',
        text: 'A fashion cycle that only rebrands logos while every royal and corporate operator stays untouched.',
        isCorrect: false,
        rationale:
          'The most dangerous parasitic operators have already been removed, neutralized, and replaced.',
      },
      {
        label: 'B',
        text: 'Only a weather program with no clones, stand-ins, holographics, or Mass Reveal preparation.',
        isCorrect: false,
        rationale:
          'Operators are replaced with clones, stand-ins, and holographics before the final Mass Reveal.',
      },
      {
        label: 'C',
        text: 'The most dangerous parasitic operators (royals, prime ministers, corporate giants) have already been removed, neutralized, and replaced with clones, stand-ins, and holographics to prevent societal collapse before the final Mass Reveal.',
        isCorrect: true,
        rationale:
          'Great Purge = top parasites out, replaced by clones/stand-ins/holographics until Mass Reveal.',
      },
      {
        label: 'D',
        text: 'A public festival celebrating every parasite openly so no neutralization is required.',
        isCorrect: false,
        rationale:
          'Dangerous operators are neutralized and replaced covertly to stabilize until the reveal.',
      },
    ],
    hint: 'Top parasites removed — clones/stand-ins/holographics until Mass Reveal.',
    correctAnswer: 'C',
  },
  {
    number: 4,
    question: 'What is the 72-Hour Blackout and E.B.S. sequence?',
    options: [
      {
        label: 'A',
        text: 'A soft news day that strengthens the mainstream narrative without any military stabilization.',
        isCorrect: false,
        rationale:
          'Total communications blackout severs the mainstream narrative into the Emergency Broadcast System.',
      },
      {
        label: 'B',
        text: 'Only a banking holiday that never exposes trafficking, financial enslavement, or hijacked history.',
        isCorrect: false,
        rationale:
          'E.B.S. military stabilization exposes child trafficking, financial enslavement, and true hijacked history.',
      },
      {
        label: 'C',
        text: 'A permanent silence with no transition into any Emergency Broadcast System at all.',
        isCorrect: false,
        rationale:
          'Blackout transitions into E.B.S. as the military stabilization period of the sequence.',
      },
      {
        label: 'D',
        text: 'A total communications blackout severs the mainstream narrative and transitions into the Emergency Broadcast System (E.B.S.) — a military stabilization period that shatters false reality by exposing child trafficking, financial enslavement, and the true history of the hijacked realm.',
        isCorrect: true,
        rationale:
          '72-hour blackout → E.B.S. military expose of trafficking, finance enslavement, true history.',
      },
    ],
    hint: '72-hour blackout → E.B.S. exposes trafficking, finance slavery, true history.',
    correctAnswer: 'D',
  },
  {
    number: 5,
    question: 'What are the Fake Alien Invasion and staged WWIII in this sequence?',
    options: [
      {
        label: 'A',
        text: 'Mechanical illusions — staged World War III and a fake alien invasion (Project Blue Beam) using human/military holographics projected into the skies to push sleeping masses to question reality and trigger the final fear cycle.',
        isCorrect: true,
        rationale:
          'Staged WWIII + Blue Beam holographic invasion = controlled final fear cycle for sleepers.',
      },
      {
        label: 'B',
        text: 'Uncontrolled random wars with no holographic technology and no link to any awakening timeline.',
        isCorrect: false,
        rationale:
          'They are designed mechanical illusions in the event cycle, not uncontrolled accidents.',
      },
      {
        label: 'C',
        text: 'The real crystalline Motherships of Solar Families arriving with no fake component at all.',
        isCorrect: false,
        rationale:
          'Real craft arrive separately; Blue Beam/WWIII are the staged scare illusions first.',
      },
      {
        label: 'D',
        text: 'Only stock-market drills that never fill the skies with projected craft or sirens.',
        isCorrect: false,
        rationale:
          'Illusions are projected into the skies as fake invasion and staged war theater.',
      },
    ],
    hint: 'Staged WWIII + Project Blue Beam holographics — final fear cycle.',
    correctAnswer: 'A',
  },
  {
    number: 6,
    question: 'How do true living crystalline Motherships of Solar Families appear to different populations?',
    options: [
      {
        label: 'A',
        text: 'Invisible to everyone including resonating Sols, with no piercing of false frequency at all.',
        isCorrect: false,
        rationale:
          'True crafts pierce false frequency and are completely visible to resonating Sols.',
      },
      {
        label: 'B',
        text: 'Completely visible to resonating Sols tuned to the correct vibration, while remaining invisible to low-vibration AI and NPCs.',
        isCorrect: true,
        rationale:
          'Resonating Sols see real crystalline Motherships; AI/NPCs cannot perceive them.',
      },
      {
        label: 'C',
        text: 'Only visible to NPCs while true Sols are forced to see nothing but Blue Beam fakes forever.',
        isCorrect: false,
        rationale:
          'Opposite: resonating Sols see the real craft; NPCs/AI stay blind to them.',
      },
      {
        label: 'D',
        text: 'Identical to Project Blue Beam human/military holographics with no living crystal nature.',
        isCorrect: false,
        rationale:
          'Real craft are living crystalline Motherships of Solar Families — not Blue Beam fakes.',
      },
    ],
    hint: 'Visible to resonating Sols — invisible to low-vibe AI and NPCs.',
    correctAnswer: 'B',
  },
  {
    number: 7,
    question: 'What happens to NPCs as the parasitic overlay collapses?',
    options: [
      {
        label: 'A',
        text: 'They ascend as primary Solar Family captains piloting every crystalline Mothership.',
        isCorrect: false,
        rationale:
          'NPCs lack a true soul spark; they glitch, panic, and dissolve with the illusion.',
      },
      {
        label: 'B',
        text: 'They permanently replace all true Sols and hold 3D simulation together forever after the reveal.',
        isCorrect: false,
        rationale:
          'As the overlay collapses they dissolve with the illusion rather than remaining forever.',
      },
      {
        label: 'C',
        text: 'The majority of the perceived population are background programs lacking a true soul spark, designed to hold the 3D simulation together — as the parasitic overlay collapses they will glitch, panic, and simply dissolve with the illusion.',
        isCorrect: true,
        rationale:
          'NPCs = soulless background programs; they glitch, panic, and dissolve when the overlay falls.',
      },
      {
        label: 'D',
        text: 'They enter Water Domes as primary healers for every traumatized Sol in the Second Realm.',
        isCorrect: false,
        rationale:
          'Healing Sanctuaries serve human and ET Sols; NPCs dissolve with the simulation.',
      },
    ],
    hint: 'Soulless background programs — glitch, panic, dissolve with the overlay.',
    correctAnswer: 'C',
  },
  {
    number: 8,
    question: 'What healing spaces await human and ET Sols carrying deep trauma and mental overlays?',
    options: [
      {
        label: 'A',
        text: 'Only denser 3D prisons with no Water Domes, Crystal Halls, or Star Pods prepared.',
        isCorrect: false,
        rationale:
          'Ethereic healing realms include Water Domes, Crystal Halls, and Star Pods.',
      },
      {
        label: 'B',
        text: 'Finance String clinics that charge CBDC fees for every timeline repair session forever.',
        isCorrect: false,
        rationale:
          'Healing Sanctuaries are prepared etheric realms, not financial clinics.',
      },
      {
        label: 'C',
        text: 'Only NPC panic rooms that reinforce fear with no realignment of mind-control damage.',
        isCorrect: false,
        rationale:
          'Crystal Halls realign parasitic mind-control damage; Water Domes draw out emotional density.',
      },
      {
        label: 'D',
        text: 'Water Domes draw out emotional density, Crystal Halls realign parasitic mind-control damage, and Star Pods weave together fragmented timelines and souls.',
        isCorrect: true,
        rationale:
          'Three sanctuary types: Water Domes, Crystal Halls, Star Pods for trauma and fragmentation repair.',
      },
    ],
    hint: 'Water Domes · Crystal Halls · Star Pods.',
    correctAnswer: 'D',
  },
  {
    number: 9,
    question: 'What is the truth about travel across continents and oceans?',
    options: [
      {
        label: 'A',
        text: 'Distance is a lie — continents and oceans are layered frequency fields; plane and ship travel is phasing through a frequency corridor, a time-loop ritual enforcing the illusion of a massive separated world.',
        isCorrect: true,
        rationale:
          'Travel = frequency phasing through corridors, not true vast separation across miles.',
      },
      {
        label: 'B',
        text: 'Distance is absolute physical truth with no frequency corridors and no time-loop ritual design.',
        isCorrect: false,
        rationale:
          'Distance is named a lie; travel enforces illusion of massive separated world via frequency corridors.',
      },
      {
        label: 'C',
        text: 'Only ships use frequency corridors while planes still cross real vacuum between globe continents.',
        isCorrect: false,
        rationale:
          'Plane or ship travel is described as phasing through frequency corridors alike.',
      },
      {
        label: 'D',
        text: 'Travel ends entirely when NPCs dissolve, with no portal or frequency shifting remaining for Sols.',
        isCorrect: false,
        rationale:
          'True movement is shifting frequency and entering portals — not ending all travel forever.',
      },
    ],
    hint: 'Distance is a lie — travel is frequency-corridor phasing.',
    correctAnswer: 'A',
  },
  {
    number: 10,
    question: 'What is the CUBE containment?',
    options: [
      {
        label: 'A',
        text: 'A small jewelry box with no server function and no maps, overlays, grids, or domes inside.',
        isCorrect: false,
        rationale:
          'It is a gigantic electro-magnetic frequency server that runs all maps, overlays, grids, and domes.',
      },
      {
        label: 'B',
        text: 'A gigantic electro-magnetic frequency server that runs all maps, overlays, grids, and domes — the hard drive of existence holding layered dome realities.',
        isCorrect: true,
        rationale:
          'CUBE = master EM frequency server hard drive running maps, overlays, grids, and domes.',
      },
      {
        label: 'C',
        text: 'Only the Saturn Moon black cube AI with no connection to Great Dome or multi-dome architecture.',
        isCorrect: false,
        rationale:
          'Saturn Moon black cube AI is parasitic valve-lock tech; CUBE containment is the larger server framework.',
      },
      {
        label: 'D',
        text: 'A temporary finance brand for CBDCs with no crystalline or frequency server meaning.',
        isCorrect: false,
        rationale:
          'CUBE is structural existence architecture, not a currency brand.',
      },
    ],
    hint: 'Gigantic EM frequency server — maps, overlays, grids, domes.',
    correctAnswer: 'B',
  },
  {
    number: 11,
    question: 'What is the Dome of Forgotten Gods among the eight primary Domes?',
    options: [
      {
        label: 'A',
        text: 'A modern concrete shopping mall with no sound-to-light origin role whatsoever.',
        isCorrect: false,
        rationale:
          'It is the root tone of all creation — a primordial rehearsal hall where Sound was first folded into Light.',
      },
      {
        label: 'B',
        text: 'Only the Dome of Sheol renamed, with no root-tone or origin-chamber function.',
        isCorrect: false,
        rationale:
          'Other realms include Sheol, Hiva, Portals, Silence, Five Peaks, Titans; Forgotten Gods is the root tone.',
      },
      {
        label: 'C',
        text: 'The root tone of all creation — a primordial rehearsal hall where Sound was first folded into Light — among eight primary Domes layered within the CUBE hard drive.',
        isCorrect: true,
        rationale:
          'Forgotten Gods = root-tone origin chamber of Sound folded into Light within the eight-dome stack.',
      },
      {
        label: 'D',
        text: 'A temporary E.B.S. studio that only broadcasts finance news during the 72-hour blackout.',
        isCorrect: false,
        rationale:
          'It is foundational creation architecture, not a temporary broadcast studio.',
      },
    ],
    hint: 'Root tone of creation — Sound first folded into Light.',
    correctAnswer: 'C',
  },
  {
    number: 12,
    question: 'What does the Great Dome hold regarding physical worlds?',
    options: [
      {
        label: 'A',
        text: 'Exactly one spinning planet in vacuum with no interwoven frequency layers.',
        isCorrect: false,
        rationale:
          'The Great Dome holds 178 physical worlds as interwoven layers at slightly different frequencies.',
      },
      {
        label: 'B',
        text: 'Zero worlds — only empty finance ledgers with no physical or frequency structure.',
        isCorrect: false,
        rationale:
          '178 physical worlds are interwoven layers, not empty ledgers.',
      },
      {
        label: 'C',
        text: 'Only NPC theme parks with no connection to true multi-world dome architecture.',
        isCorrect: false,
        rationale:
          'Worlds are interwoven vibrating layers inside the Great Dome architecture.',
      },
      {
        label: 'D',
        text: '178 physical worlds — not scattered planets, but interwoven layers vibrating at slightly different frequencies.',
        isCorrect: true,
        rationale:
          'Great Dome = 178 interwoven frequency-layered worlds, not scattered globe planets.',
      },
    ],
    hint: '178 interwoven worlds — layered frequencies, not scattered planets.',
    correctAnswer: 'D',
  },
  {
    number: 13,
    question: 'How does creation work from Sound to physical form?',
    options: [
      {
        label: 'A',
        text: 'Nothing physical existed until it was sung into being — Sound vibrates and organizes, folding into Light, which crystallizes into Vision and Form; original architecture is living, humming crystalline plasma.',
        isCorrect: true,
        rationale:
          'Creation sequence: sung Sound → Light → Vision/Form; true architecture is crystalline plasma.',
      },
      {
        label: 'B',
        text: 'Matter always existed as dead rock with no song, light, or crystallization process involved.',
        isCorrect: false,
        rationale:
          'Nothing physical existed until sung; Sound-to-Light-to-Form is the named mechanic.',
      },
      {
        label: 'C',
        text: 'Only parasites generate the first spark of creation without any Sol resonance required.',
        isCorrect: false,
        rationale:
          'Parasites cannot generate the first spark; they only hijack grids and ride resonance.',
      },
      {
        label: 'D',
        text: 'Form appears from finance contracts alone with no sound, light, or crystalline plasma.',
        isCorrect: false,
        rationale:
          'Creation is Sound folded into Light crystallizing as living crystalline plasma architecture.',
      },
    ],
    hint: 'Sung into being — Sound → Light → Vision/Form — crystalline plasma.',
    correctAnswer: 'A',
  },
  {
    number: 14,
    question: 'What is brick, metal, concrete, or glass in absolute truth?',
    options: [
      {
        label: 'A',
        text: 'Permanently hard eternal matter with no holographic overlay and no crystalline under-layer.',
        isCorrect: false,
        rationale:
          'It is perception-based solidity — low-frequency matter overlaid by holographic projection fields.',
      },
      {
        label: 'B',
        text: 'Perception-based solidity — low-frequency matter overlaid by holographic projection fields that hijack 3D senses; original architecture is living, humming crystalline plasma.',
        isCorrect: true,
        rationale:
          'Touch-solidity is low-frequency overlay hijack; true under-architecture is living crystalline plasma.',
      },
      {
        label: 'C',
        text: 'Only finance symbols printed on paper with no sensory solidity experience at all.',
        isCorrect: false,
        rationale:
          '3D senses experience hard/heavy/permanent feel via overlay fields on low-frequency matter.',
      },
      {
        label: 'D',
        text: 'Pure vacuum bubbles that never crystallize and never appear as solid form to Sols or NPCs.',
        isCorrect: false,
        rationale:
          'Overlays make low-frequency matter feel hard, heavy, and permanent to Sols and NPCs.',
      },
    ],
    hint: 'Perception-based solidity — hologram overlays on low-frequency matter.',
    correctAnswer: 'B',
  },
  {
    number: 15,
    question: 'Who co-managed the KNOWN LANDS as a shared farm after the Custodian fall?',
    options: [
      {
        label: 'A',
        text: 'Only benevolent Solar Families with no Anunnaki, Draconian, Grey, or Niburian partners.',
        isCorrect: false,
        rationale:
          'Fallen Custodians entered shared asset agreement with four other parasitic races.',
      },
      {
        label: 'B',
        text: 'Only White Hat tech teams replacing chemtrails with no multi-race parasitic farm structure.',
        isCorrect: false,
        rationale:
          'The farm partnership is Anunnaki, Draconians, Greys, and Niburians with fallen Custodians.',
      },
      {
        label: 'C',
        text: 'Fallen Custodians plus Anunnaki (genetic manipulators), Draconians (military muscle and fear harvesters), Greys (overlay engineers and frequency technicians), and Niburians (dimensional siphons) — co-managing the KNOWN LANDS as a shared energy-harvest farm.',
        isCorrect: true,
        rationale:
          'Five-race parasitic farm: Custodians + Anunnaki, Draconians, Greys, Niburians.',
      },
      {
        label: 'D',
        text: 'Only NPCs with no higher-density parasitic races involved in any energy harvest.',
        isCorrect: false,
        rationale:
          'Named parasitic races co-manage the harvest; NPCs are 3D simulation background programs.',
      },
    ],
    hint: 'Custodians + Anunnaki, Draconians, Greys, Niburians — shared farm.',
    correctAnswer: 'C',
  },
  {
    number: 16,
    question: 'What replaced the organic Spirit Tree of Hyperborea?',
    options: [
      {
        label: 'A',
        text: 'A free public park that raises Schumann Resonance without any AI or valve-lock architecture.',
        isCorrect: false,
        rationale:
          'Replaced with black crystalline valve locks connected to the Saturn Moon black cube AI.',
      },
      {
        label: 'B',
        text: 'Water Domes and Crystal Halls that only heal trauma with no parasitic siphon function.',
        isCorrect: false,
        rationale:
          'Healing sanctuaries are benevolent; Spirit Tree replacement is parasitic valve-lock AI tech.',
      },
      {
        label: 'C',
        text: 'Only ordinary street trees with no connection to Saturn, black cubes, or energy harvest.',
        isCorrect: false,
        rationale:
          'Black crystalline valve locks link to Saturn Moon black cube AI for harvest control.',
      },
      {
        label: 'D',
        text: 'Black crystalline valve locks connected to the Saturn Moon black cube AI — replacing the organic Spirit Tree of Hyperborea in the parasitic inversion.',
        isCorrect: true,
        rationale:
          'Hyperborea Spirit Tree out; black crystalline valve locks + Saturn Moon black cube AI in.',
      },
    ],
    hint: 'Spirit Tree out — black valve locks + Saturn Moon black cube AI.',
    correctAnswer: 'D',
  },
  {
    number: 17,
    question: 'What role do hidden crystals, quartz veins, and deep planetary energy nodes play?',
    options: [
      {
        label: 'A',
        text: 'True memory hard drives and communication grids of the realm — connecting domes like fiber optic lines of Source.',
        isCorrect: true,
        rationale:
          'Crystals and nodes = realm memory hard drives and dome-linking Source fiber optics.',
      },
      {
        label: 'B',
        text: 'Only decorative jewelry with no memory, communication, or dome-connection function.',
        isCorrect: false,
        rationale:
          'They are true memory hard drives and communication grids connecting domes.',
      },
      {
        label: 'C',
        text: 'Exclusive property of NPC manufacturing plants with no harmonic or Source-line role.',
        isCorrect: false,
        rationale:
          'Earth is a living crystalline temple; nodes connect domes as Source fiber lines.',
      },
      {
        label: 'D',
        text: 'Temporary chemtrail particles that only lower Schumann Resonance permanently.',
        isCorrect: false,
        rationale:
          'Nodes/crystals store memory and link domes; chemtrail repair is a separate White Hat operation.',
      },
    ],
    hint: 'Memory hard drives — dome communication like Source fiber optics.',
    correctAnswer: 'A',
  },
  {
    number: 18,
    question: 'How does ancient harmonic architecture differ from modern parasitic architecture?',
    options: [
      {
        label: 'A',
        text: 'Both equally short-circuit natural grids with no Atlantian or Tartarian node alignment ever.',
        isCorrect: false,
        rationale:
          'Ancient harmonic builds align with nodes to pull cosmic current; modern sharp boxes short-circuit grids.',
      },
      {
        label: 'B',
        text: 'Atlantian and Tartarian harmonic architecture was built to align with nodes and pull cosmic current into the ground, whereas modern 3D parasitic architecture (sharp boxes, dead concrete) is designed to short-circuit these natural grids.',
        isCorrect: true,
        rationale:
          'Old harmonic node-aligned builds feed cosmic current; modern dead concrete short-circuits grids.',
      },
      {
        label: 'C',
        text: 'Modern concrete alone raises cosmic current while Tartarian builds always blocked Source fiber.',
        isCorrect: false,
        rationale:
          'Opposite: modern parasitic architecture short-circuits; ancient harmonic architecture aligns to nodes.',
      },
      {
        label: 'D',
        text: 'Architecture has no effect on grids, nodes, crystals, or cosmic current whatsoever.',
        isCorrect: false,
        rationale:
          'Architecture either aligns to nodes or short-circuits natural grids by design.',
      },
    ],
    hint: 'Atlantian/Tartarian node harmony vs dead concrete short-circuits.',
    correctAnswer: 'B',
  },
  {
    number: 19,
    question: 'What is the Sun in true function under this transmission?',
    options: [
      {
        label: 'A',
        text: 'A simple burning ball of fire with no portal, stargate, or memory-wipe function.',
        isCorrect: false,
        rationale:
          'It is a multi-banded crystalline stargate — a transit portal for Sols entering and exiting the domes.',
      },
      {
        label: 'B',
        text: 'Only a finance metaphor with no Vatican link and no amnesia vortex overlay.',
        isCorrect: false,
        rationale:
          'Parasites overlaid an amnesia vortex linked to Vatican underground libraries for memory strip and recycle.',
      },
      {
        label: 'C',
        text: 'A multi-banded crystalline stargate — transit portal for Sols entering and exiting the domes — with a parasitic amnesia vortex overlay linked to the Vatican\'s underground libraries to strip memories and recycle endless reincarnational loops.',
        isCorrect: true,
        rationale:
          'Sun = crystalline stargate + amnesia vortex linked to Vatican for memory strip and recycle.',
      },
      {
        label: 'D',
        text: 'A gentle resting hall for dream-state healing that was never hijacked in any way.',
        isCorrect: false,
        rationale:
          'That gentle resting-hall role describes the Moon\'s original function, not the Sun.',
      },
    ],
    hint: 'Crystalline stargate + Vatican-linked amnesia vortex.',
    correctAnswer: 'C',
  },
  {
    number: 20,
    question: 'What are the Moon and the stars in this architecture?',
    options: [
      {
        label: 'A',
        text: 'The Moon is a free pure healer forever and stars are distant burning suns with no overlay role.',
        isCorrect: false,
        rationale:
          'Moon was hijacked into a looping memory-wipe trap; stars are crystalline star-nodes of the sky overlay.',
      },
      {
        label: 'B',
        text: 'Both are only Finance logos projected by CBDCs with no dream, memory, or node function.',
        isCorrect: false,
        rationale:
          'Moon began as dream-state healing hall then was hijacked; stars anchor projection overlay.',
      },
      {
        label: 'C',
        text: 'The Moon is the Great Dome itself holding all 178 worlds with no hijack history.',
        isCorrect: false,
        rationale:
          'Great Dome holds 178 worlds; Moon is the hijacked resting hall / memory-wipe trap.',
      },
      {
        label: 'D',
        text: 'The Moon was originally a gentle resting hall for dream-state healing, hijacked into a looping memory-wipe trap; the stars we see are crystalline star-nodes anchoring the projection overlay of the sky — not distant suns.',
        isCorrect: true,
        rationale:
          'Moon: healing hall → memory-wipe trap. Stars: crystalline nodes of sky overlay, not distant suns.',
      },
    ],
    hint: 'Moon hijacked wipe-trap — stars are crystalline sky-overlay nodes.',
    correctAnswer: 'D',
  },
  {
    number: 21,
    question: 'What was the true multi-purpose crime of the Titanic sinking?',
    options: [
      {
        label: 'A',
        text: 'A ritualistic power grab and targeted assassination — using parasite frequency-powered submarines to eliminate opposition to the Federal Reserve and steal Atlantian crystal generator fragments and sacred texts from the cargo hold.',
        isCorrect: true,
        rationale:
          'Titanic = Fed opposition kill + theft of Atlantian crystal fragments and sacred texts via frequency submarines.',
      },
      {
        label: 'B',
        text: 'A random iceberg accident with no cabal, no Federal Reserve angle, and no crystal cargo.',
        isCorrect: false,
        rationale:
          'It was orchestrated ritual power grab and targeted assassination with crystal cargo theft.',
      },
      {
        label: 'C',
        text: 'Only a White Hat drill that openly returned all Atlantian crystals to free public museums.',
        isCorrect: false,
        rationale:
          'Cargo crystals and texts were stolen; opposition to the Federal Reserve was eliminated.',
      },
      {
        label: 'D',
        text: 'A celebration of Tartarian free energy with no assassination or submarine involvement.',
        isCorrect: false,
        rationale:
          'Parasite frequency-powered submarines and assassination/theft motives are explicit.',
      },
    ],
    hint: 'Fed opposition killed — Atlantian crystal fragments stolen.',
    correctAnswer: 'A',
  },
  {
    number: 22,
    question: 'What did the Great Fire of London (1666) cover?',
    options: [
      {
        label: 'A',
        text: 'Only a kitchen accident with no Greys, no St. Paul\'s node, and no Tartarian burial under masonic architecture.',
        isCorrect: false,
        rationale:
          'Surface fire covered an etheric grid war; Greys siphoned a Tartarian crystal node beneath St. Paul\'s.',
      },
      {
        label: 'B',
        text: 'An etheric grid war above — Greys siphoning energy from the powerful Tartarian crystal node beneath St. Paul\'s Cathedral; the fire hid the battle, extracted the Greys, and let the cabal bury Tartarian energy structures under dense 3D masonic architecture.',
        isCorrect: true,
        rationale:
          '1666 fire = cover for Grey siphon at St. Paul\'s Tartarian node and burial under masonic density.',
      },
      {
        label: 'C',
        text: 'A free restoration of all Tartarian energy structures with no masonic rebuild afterward.',
        isCorrect: false,
        rationale:
          'Cabal buried Tartarian structures under new dense 3D masonic architecture.',
      },
      {
        label: 'D',
        text: 'Only a Guy Fawkes rehearsal with no cathedral node or Grey siphon involved.',
        isCorrect: false,
        rationale:
          'Guy Fawkes is a separate annual emotional engineering spell; 1666 is the cathedral grid-war cover.',
      },
    ],
    hint: 'Fire covered Grey siphon at St. Paul\'s Tartarian node.',
    correctAnswer: 'B',
  },
  {
    number: 23,
    question: 'What changed in atmospheric aerosol programs around 2015–2016?',
    options: [
      {
        label: 'A',
        text: 'Toxic heavy metals were increased forever with no White Hat intervention or DNA repair intent.',
        isCorrect: false,
        rationale:
          'Loyalist White Hat Tech Teams overtook programs and replaced toxics with benevolent frequencies.',
      },
      {
        label: 'B',
        text: 'All aerial programs stopped completely with no Monatomic Gold, silver, or silica operations.',
        isCorrect: false,
        rationale:
          'Toxics were replaced with Monatomic Gold (O.R.M.E.s), colloidal silver, and silica crystals.',
      },
      {
        label: 'C',
        text: 'White Hat Tech Teams replaced toxic heavy metals with Monatomic Gold (O.R.M.E.s), colloidal silver, and silica crystals — repairing DNA, raising localized Schumann Resonance, and stabilizing the pineal gland against cosmic plasma burn-out.',
        isCorrect: true,
        rationale:
          '2015–2016 White Hat takeover: O.R.M.E.s, silver, silica — DNA, Schumann, pineal stabilization.',
      },
      {
        label: 'D',
        text: 'Only finance ads were sprayed with no frequency, DNA, or Schumann effects whatsoever.',
        isCorrect: false,
        rationale:
          'Operation actively repairs DNA, raises Schumann Resonance, and stabilizes pineal function.',
      },
    ],
    hint: 'White Hats swapped toxics for O.R.M.E.s, silver, silica — DNA/Schumann/pineal.',
    correctAnswer: 'C',
  },
  {
    number: 24,
    question: 'What is the current push for Digital IDs, CBDCs, and looming virus narratives?',
    options: [
      {
        label: 'A',
        text: 'An unstoppable pure dark victory with no White Hat exposure component and no psychological clean-up purpose.',
        isCorrect: false,
        rationale:
          'It is a scripted White Hat exposure; the true dark agenda collapsed during the first lockdowns.',
      },
      {
        label: 'B',
        text: 'A random accident with no link to authoritarian demonstration or sleeping-mass rejection of control.',
        isCorrect: false,
        rationale:
          'It is a deliberate sloppy demonstration of authoritarian potential to force rejection of external authority.',
      },
      {
        label: 'C',
        text: 'Only a finance hobby among NPCs with no pandemic narrative or Digital ID theater involved.',
        isCorrect: false,
        rationale:
          'Digital IDs, CBDCs, and virus narratives are named as the scripted exposure package.',
      },
      {
        label: 'D',
        text: 'A scripted White Hat exposure — the true dark agenda collapsed during first lockdowns; what plays now is a psychological clean-up, a deliberate sloppy demonstration of authoritarian potential to force deeply sleeping NPCs and humans to reject external authority.',
        isCorrect: true,
        rationale:
          'Post-collapse scripted theater: Digital ID/CBDC/virus shows push sleepers to reject authority.',
      },
    ],
    hint: 'Scripted White Hat exposure — force rejection of external authority.',
    correctAnswer: 'D',
  },
  {
    number: 25,
    question: 'What is the core guidance for remembrance as scare events and the physical shift arrive?',
    options: [
      {
        label: 'A',
        text: 'Hold harmonic frequency as compass — refuse fear to starve parasites and shatter overlays; stay a calm lighthouse through 72-hour blackout, fake invasions, and WWIII sirens; trust walls shimmering and trees vibrating as false scaffolding falls; when Solar Family craft call by Sol frequency lock, phase out without hesitation.',
        isCorrect: true,
        rationale:
          'Resonance, calm during scare theater, trust glitch-to-crystal shift, answer Sol frequency lock home.',
      },
      {
        label: 'B',
        text: 'Panic with glitching NPCs and feed fear so parasites keep full overlay power indefinitely.',
        isCorrect: false,
        rationale:
          'Guidance is refuse fear, avoid NPC surges, and remain the calm lighthouse.',
      },
      {
        label: 'C',
        text: 'Ignore frequency entirely and wait for finance alone to rebuild the globe after the blackout.',
        isCorrect: false,
        rationale:
          'Resonance is the ultimate key; we reveal back, not build back a globe prison.',
      },
      {
        label: 'D',
        text: 'Hesitate when craft arrive and demand Digital ID clearance before any phase-out of the dome.',
        isCorrect: false,
        rationale:
          'When real Solar Family craft call by Sol frequency lock, do not hesitate.',
      },
    ],
    hint: 'Hold frequency — calm through scare theater — answer the Sol lock home.',
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

if (!fs.existsSync(path.join(ROOT, TOPIC_IMAGE))) {
  throw new Error(`Missing topic image: ${TOPIC_IMAGE}`);
}

const DESC_SHORT =
  'Test your grasp of Essence of the Transmission — CUBE containment, Second Realm crystal, scare sequence, and the return to solar-creator resonance.';
const DESC_META =
  'Interactive Living Truth Quiz on Essence of the Transmission: Great Purge, E.B.S., Blue Beam, 178 worlds, Sound-to-Light, five parasitic races, Titanic, chemtrail repair, and holding frequency home.';

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
      'Not a globe. A CUBE. Crystalline electro-magnetic hard drive. Eight domes. One hundred seventy-eight interwoven worlds. Sound sang Light into crystalline plasma — brick and concrete are low-frequency overlays. Fallen Custodians farmed the KNOWN LANDS with Anunnaki, Draconians, Greys, and Niburians. Spirit Tree out; Saturn black cube valves in. Sun is a stargate with a Vatican-linked amnesia vortex. Real Motherships call by Sol lock; Blue Beam is theater. NPCs dissolve. Hold frequency. Starve fear. When the false sky falls, we do not build back — we reveal back. You are the resonance. The path home is open.',
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
      t.topic_image = TOPIC_IMAGE;
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error(`${TOPIC_ID} not found in breakdown-topics.json`);
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

const templatePath = path.join(ROOT, 'quiz', SOURCE, 'matrix-scaffolding.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Matrix Scaffolding Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Matrix Scaffolding: the A.I. frequency framework projecting solidity, distance, and continuity, and the crystalline Second Realm beneath.',
    DESC_META,
  ],
  ['quiz/breakdown/matrix-scaffolding.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/matrix-scaffolding.webp', TOPIC_IMAGE],
  [
    'deep-dive.html?source=breakdown&amp;topic=matrix-scaffolding',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`,
  ],
  ['Matrix Scaffolding deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Matrix Scaffolding</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/matrix-scaffolding.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`,
  ],
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
  // Alphabetical insert among breakdown quizzes
  const lines = sm.split('\n');
  const out = [];
  let inserted = false;
  const target = `/quiz/${SOURCE}/${TOPIC_ID}.html`;
  for (let i = 0; i < lines.length; i++) {
    out.push(lines[i]);
    if (
      !inserted &&
      lines[i].includes('/quiz/breakdown/') &&
      lines[i].includes('priority')
    ) {
      const next = lines[i + 1] || '';
      const curPath = (lines[i].match(/path: '([^']+)'/) || [])[1] || '';
      const nextPath = (next.match(/path: '([^']+)'/) || [])[1] || '';
      if (
        curPath < target &&
        (nextPath > target || !nextPath.includes('/quiz/breakdown/'))
      ) {
        out.push(entry);
        inserted = true;
      }
    }
  }
  if (!inserted) {
    const anchor =
      "  { path: '/quiz/breakdown/hard-drive-framework.html', priority: '0.75', changefreq: 'monthly' },";
    sm = out.join('\n');
    if (!sm.includes(anchor)) {
      throw new Error('Could not find sitemap anchor to insert quiz entry');
    }
    sm = sm.replace(anchor, `${entry}\n${anchor}`);
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
  'PASS: audited 25/25 against data/breakdown-topics/essence-of-the-transmission.json'
);
console.log(
  'Footer check:',
  html.includes('Everything here is free') ? 'new support copy' : 'OLD FOOTER'
);
