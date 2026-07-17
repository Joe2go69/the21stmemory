/**
 * Installs Original Realm quiz for breakdown (Mega Breakdown) transmission.
 * Source: G:/My Drive/CH21/Website Files/New Downloads/cosmology-quiz.json
 * Audits all 25 items against data/breakdown-topics/original-realm.json.
 * Run: node scripts/install-original-realm-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/original-realm.json
 *      node scripts/split-topics-data.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'original-realm';
const TOPIC_TITLE = 'Original Realm';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/cosmology-quiz.json';

const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

/** Support phrases grounded only in original-realm.json report. */
const supportPhrases = {
  1: ['original realm', 'second realm', 'tara', '5d+', 'parasitic overlays'],
  2: ['pure sound woven into light', 'crystalline temple'],
  3: ['great dome', '178', 'physical worlds'],
  4: ['spirit tree', 'pulsed harmonic currents', 'great dome'],
  5: ['council of 12 suns', 'keepers of balance', 'cube system'],
  6: ['consciousness', 'form from nothing', 'friction, frequency, and sound'],
  7: ['crystalline nodes', 'stars', 'projection overlays'],
  8: ['dome of portals', 'travel hub'],
  9: ['instant resonance alignment', 'folding spacetime'],
  10: ['no physical reconstruction', 'frequency collapse', 'perfectly intact'],
  11: ['black cube tech', 'frequency siphon', 'saturn moon'],
  12: ['dome of forgotten gods', 'memory and creation'],
  13: ['squares', 'sharp right angles', 'dead frequency holders'],
  14: ['pleiadians', 'telepathic humanoid vessel', 'sols of tara'],
  15: ['harmonic resonance', 'light lattices', 'glitch and shatter'],
  16: ['hyperborean halls', 'lemuria', 'asgard'],
  17: ['oceans and skies', 'rendered filler', 'simulations'],
  18: ['consciousness', 'awareness that brings form', '5 solar masters'],
  19: ['custodians', 'neutral overseers', 'desire for control'],
  20: ['crystalline plasma', 'dead materials', 'concrete', 'steel'],
  21: ['seven gardens', 'spirit tree', 'seven external domes'],
  22: ['hollow rubble', 'bound to the 3d program', 'lack the frequency'],
  23: ['tartarian', 'arches, domes, and spirals', 'ley-lines'],
  24: ['crystalline membranes', 'solidified into physical matter'],
  25: ['free energy', 'drawn directly from the field']
};

function cleanText(s) {
  let t = String(s || '');
  t = t.replace(/\$5D\+\$/g, '5D+');
  t = t.replace(/\$5\\mathrm\{D\}\+\$/g, '5D+');
  t = t.replace(/\$3\\text\{D\}\$/g, '3D');
  t = t.replace(/\$3\\mathrm\{D\}\$/g, '3D');
  t = t.replace(/\$3D\$/g, '3D');
  t = t.replace(/\$(\d+(?:\.\d+)?)\$/g, '$1');
  t = t.replace(/\$(\d+)%\$/g, '$1%');
  t = t.replace(/\$([^$]+)\$/g, (_, inner) =>
    inner
      .replace(/\\text\{([^}]*)\}/g, '$1')
      .replace(/\\mathrm\{([^}]*)\}/g, '$1')
      .replace(/\\[a-zA-Z]+/g, '')
      .replace(/[{}]/g, '')
  );
  t = t.replace(/\\\(|\\\)|\\\[|\\\]/g, '');
  t = t.replace(/\\text\{([^}]*)\}/g, '$1');
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

function absoluteVoice(s) {
  let t = String(s || '');
  const rewrites = [
    [/^According to the source,?\s*/i, ''],
    [/^According to the report,?\s*/i, ''],
    [/^According to the text,?\s*/i, ''],
    [/^According to the mechanics of the True Material World,?\s*/i, 'In the mechanics of the True Material World, '],
    [/^The source states that\s+/i, ''],
    [/^The source specifies that\s+/i, ''],
    [/^The source suggests that\s+/i, ''],
    [/^The source material explicitly states that\s+/i, ''],
    [/^The source material specifies that\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The text suggests that\s+/i, ''],
    [/^The text mentions\s+/i, ''],
    [/^The text focuses on\s+/i, ''],
    [/^The text identifies\s+/i, ''],
    [/^The text explicitly states that\s+/i, ''],
    [/^The material clarifies that\s+/i, ''],
    [/\bThe source defines\b/gi, 'Stars are defined as'],
    [/\bThe source defines stars as\b/gi, 'Stars are'],
    [/\bThe source states they were\b/gi, 'They were'],
    [/\bthe source material specifies that\b/gi, ''],
    [/\bthe source material explicitly states that\b/gi, ''],
    [/\bmentioned in the source material\b/gi, ''],
    [/\bmentioned in the text\b/gi, ''],
    [/\bsource material\b/gi, 'transmission'],
    [/\bin the source material\b/gi, ''],
    [/\bthe source specifies that\b/gi, ''],
    [/\bThe text identifies consciousness as\b/gi, 'Consciousness is'],
    [
      /While plasma is involved in nodes, the core architecture is specifically described as sound-woven light\./i,
      'While plasma appears in crystalline nodes, the temple itself is pure sound woven into light.'
    ],
    [
      /The source material explicitly states that no physical reconstruction is required\./i,
      'No physical reconstruction is required — the realm is revealed by frequency collapse alone.'
    ],
    [
      /The source states they were initially neutral before their fall into parasitic behaviors\./i,
      'The Custodians were initially neutral overseers before drifting into parasitic control.'
    ],
    [
      /The source material specifies that all systems operate on free energy from the field\./i,
      'All systems in the Original Realm operate on free energy drawn directly from the field.'
    ]
  ];
  for (const [re, rep] of rewrites) {
    t = t.replace(re, rep);
  }
  t = t.replace(/^\s*([a-z])/, (_, c) => c.toUpperCase());
  t = t.replace(/\s+/g, ' ').trim();
  t = t.replace(/\s+([.,;:])/g, '$1');
  return t;
}

/**
 * Full-depth option text expansions so no one-line distractors remain.
 * Keys: `${qNum}.${label}.text` or full question rewrite keys.
 */
const overrides = {
  // Q1
  '1.question':
    'What is the true underlying 5D+ baseline of existence beneath the current parasitic overlays?',
  '1.A.text':
    'The Original Realm, also called the Second Realm or Tara, as the intact crystalline baseline of existence.',
  '1.B.text':
    'The Cube Containment alone, treated as the baseline state of existence rather than the master hard drive framework.',
  '1.C.text':
    'The Saturn Moon matrix, treated as the original foundation of life rather than a parasitic siphon system.',
  '1.D.text':
    'The Great Dome alone, treated as the full multidimensional baseline rather than one physical layer inside containment.',
  '1.A.rationale':
    'The Original Realm, also known as Tara or the Second Realm, is the true 5D+ crystalline foundation beneath the parasitic overlays.',
  '1.B.rationale':
    'The Cube Containment is the master hard drive framework for domes and simulations, not the baseline state of existence itself.',
  '1.C.rationale':
    'The Saturn Moon matrix is parasitic harvesting technology, not the original foundation of the realm.',
  '1.D.rationale':
    'The Great Dome is a central physical layer holding 178 worlds, not the underlying multidimensional baseline.',
  '1.hint': 'Recall the 5D environment often referred to as Tara or the Second Realm.',

  // Q2
  '2.A.text':
    'Pure sound woven into light, forming a vast interconnected Crystalline Temple.',
  '2.B.text':
    'Liquid plasma and gaseous ethers alone, without sound folding into light as the core architecture.',
  '2.C.text':
    'Dense volcanic stone and minerals laid as permanent building blocks of the 5D+ temple.',
  '2.D.text':
    'Digital binary code structures that generate the organic crystalline truth of the realm.',
  '2.A.rationale':
    'The Original Realm is a Crystalline Temple composed of pure sound woven into light.',
  '2.B.rationale':
    'Environments may grow from crystalline plasma, but the temple itself is pure sound woven into light.',
  '2.C.rationale':
    'Dense stone is a trait of the 3D parasitic overlay, not the true 5D+ crystalline state.',
  '2.D.rationale':
    'Binary digital structures reflect false simulation framing, not the organic crystalline temple.',

  // Q3
  '3.A.text':
    'Exactly 5 physical worlds, matching the five Solar Masters of the Elements.',
  '3.B.text':
    'Exactly 178 physical worlds held as the central physical layer of the Cube Containment.',
  '3.C.text':
    'Exactly 7 physical worlds, matching the seven external gardens around the Known Lands.',
  '3.D.text':
    'Exactly 12 physical worlds, matching the Council of 12 Suns solar stewardship count.',
  '3.A.rationale':
    'Five names the Solar Masters of the Elements, not the world count inside the Great Dome.',
  '3.B.rationale':
    'The Great Dome holds 178 physical worlds and amplifies frequency into dense structure.',
  '3.C.rationale':
    'Seven names the external domes or gardens surrounding the Known Lands, not the Great Dome world count.',
  '3.D.rationale':
    'Twelve names the Council of 12 Suns, not the count of physical worlds in the Great Dome.',
  '3.hint': 'Recall the three-digit world count inside the Great Dome frequency amplifier.',

  // Q4
  '4.A.text':
    'To stabilize the rotation of a planetary globe floating in vacuum space.',
  '4.B.text':
    'To pulse harmonic currents across the Great Dome as the central axis of consciousness.',
  '4.C.text':
    'To serve as a storage bank for dense 3D historical memories and trauma loops.',
  '4.D.text':
    'To act as a parasitic valve for harvesting emotional energy from reincarnation loops.',
  '4.A.rationale':
    'A rotating globe is part of the 3D illusion; reality is anchored by frequency nodes and crystalline structure.',
  '4.B.rationale':
    'The Spirit Tree was the central axis of consciousness that pulsed harmonic currents across the Great Dome.',
  '4.C.rationale':
    'Memory and creation belong with the Dome of Forgotten Gods, not the Spirit Tree axis.',
  '4.D.rationale':
    'Emotional harvesting is the function of Black Cube Tech that replaced the Spirit Tree.',

  // Q5
  '5.A.text':
    'The Council of 12 Suns, the original solar stewardship that keeps balance without force.',
  '5.B.text':
    'The Custodians alone, permanently trusted as neutral keepers of the entire Cube system.',
  '5.C.text':
    'The Atlantean Architects alone, charged with overseeing every dome and solar balance.',
  '5.D.text':
    'The Sols of Tara alone, assigned to govern the full Cube system rather than seed life.',
  '5.A.rationale':
    'The Council of 12 Suns oversees the entire Cube system as keepers of balance, guiding without force.',
  '5.B.rationale':
    'The Custodians began as neutral gateway overseers and later drifted into control and harvesting.',
  '5.C.rationale':
    'Atlantean lines built living geometric conductors; they did not oversee the entire Cube stewardship.',
  '5.D.rationale':
    'The Sols of Tara were first stewards seeding organic life, oceans, and garden ecosystems.',
  '5.hint': 'Identify the solar stewardship named after a fixed count of suns.',

  // Q6
  '6.question':
    'In the mechanics of the True Material World, what is the role of the element Consciousness?',
  '6.A.text':
    'To bring form from nothing through friction, frequency, and sound as foundational awareness.',
  '6.B.text':
    'To act as a permanent filter that preserves the parasitic overlay for 3D senses.',
  '6.C.text':
    'To regulate only the flow of water and air without generating form from frequency.',
  '6.D.text':
    'To serve as a passive repository for historical data rather than an active creative force.',
  '6.A.rationale':
    'Consciousness is the foundational element that brings form from nothing via friction, frequency, and sound.',
  '6.B.rationale':
    'Consciousness creates the Original Realm; the parasitic overlay is a manipulation designed to trick the senses.',
  '6.C.rationale':
    'Water and Air are distinct Solar Master elements; Consciousness is the awareness that initiates form.',
  '6.D.rationale':
    'Consciousness is an active creative element, not a passive storage system for history.',
  '6.hint': 'Recall how awareness interacts with friction, frequency, and sound to create form.',

  // Q7
  '7.A.text':
    'Simple reflections of the Spirit Tree projected onto a flat sky ceiling.',
  '7.B.text':
    'Distant burning suns floating in a vacuum of empty outer space.',
  '7.C.text':
    'Artificial communication satellites built solely for modern broadcast networks.',
  '7.D.text':
    'Multidimensional Crystalline Nodes that anchor projection overlays between realms.',
  '7.A.rationale':
    'Stars are crystalline nodes for anchoring overlays and streaming plasma, not mere Spirit Tree reflections.',
  '7.B.rationale':
    'Burning suns in a vacuum are part of the 3D illusion grid masking true crystalline structure.',
  '7.C.rationale':
    'Stars are multidimensional crystalline anchors, not man-made communication satellites.',
  '7.D.rationale':
    'Stars are multidimensional Crystalline Nodes anchoring projection overlays and once open plasma portals.',

  // Q8
  '8.A.text':
    'Dome of Silence, used for pure frequency connection rather than inter-realm travel logistics.',
  '8.B.text':
    'Dome of 5 Peaks, used for ascension processes rather than serving as the travel hub.',
  '8.C.text':
    'Dome of Hiva, focused on harmonics and sound rather than movement between realms.',
  '8.D.text':
    'Dome of Portals, the designated travel hub within the seven external gardens.',
  '8.A.rationale':
    'The Dome of Silence is pure frequency connection to Source, not the travel hub.',
  '8.B.rationale':
    'The Dome of 5 Peaks is associated with ascension, not general travel logistics.',
  '8.C.rationale':
    'The Dome of Hiva is focused on harmonics and sound, not travel routing.',
  '8.D.rationale':
    'The Dome of Portals is the travel hub among the seven external domes supporting the Known Lands.',

  // Q9
  '9.A.text':
    'Walking along fixed physical road networks built from concrete and engineered mileage.',
  '9.B.text':
    'High-speed electromagnetic vehicles carrying bodies across measurable geographic distance.',
  '9.C.text':
    'Propulsion through the vacuum of outer space between floating planetary globes.',
  '9.D.text':
    'Instant resonance alignment that folds spacetime around consciousness rather than moving through it.',
  '9.A.rationale':
    'The Original Realm has no roads; natural paths are formed by consciousness, not 3D road networks.',
  '9.B.rationale':
    'There are no vehicles in the Original Realm; movement is resonance and consciousness, not machine travel.',
  '9.C.rationale':
    'Outer-space vacuum travel is an optical illusion of the 3D grid, not Original Realm movement.',
  '9.D.rationale':
    'In the Original Realm, movement is instant resonance alignment that folds spacetime around consciousness.',
  '9.hint': 'Think how travel works when distance is a frequency state rather than miles.',

  // Q10 True/False → four full options (handled in expandTrueFalse + text overrides)
  '10.question':
    'Must the Original Realm be physically reconstructed once the 3D matrix is destroyed?',
  '10.hint': 'Does restoration depend on human building, or on frequency collapse revealing what already exists?',

  // Q11
  '11.A.text':
    'Crystalline Plasma Grids grown as organic living environments of the Original Realm.',
  '11.B.text':
    'Tartarian arches and spirals built as living geometric conductors on ley-lines.',
  '11.C.text':
    'The Spirit Tree itself, left intact as the main emotional harvesting valve.',
  '11.D.text':
    'Black Cube Tech, a frequency siphon and valve system linked to the Saturn Moon matrix.',
  '11.A.rationale':
    'Crystalline plasma is an organic growth medium of the Original Realm, not the parasitic harvester.',
  '11.B.rationale':
    'Tartarian architecture amplifies frequency through living geometry; it does not harvest emotional energy.',
  '11.C.rationale':
    'The Spirit Tree pulsed harmonic currents before parasites removed it and installed Black Cube Tech.',
  '11.D.rationale':
    'Black Cube Tech is the parasitic frequency siphon linked to the Saturn Moon matrix for emotional harvest and reincarnation loops.',

  // Q12
  '12.A.text':
    'Dome of Sheol, described primarily as healing and sanctuary rather than memory creation.',
  '12.B.text':
    'Dome of Titans, described as builder realms rather than the memory-and-creation garden.',
  '12.C.text':
    'Dome of Silence, described as pure Source frequency connection rather than memory vault work.',
  '12.D.text':
    'Dome of Forgotten Gods, the external garden dedicated to memory and creation.',
  '12.A.rationale':
    'Sheol is healing and sanctuary, not the memory-and-creation dome.',
  '12.B.rationale':
    'Titans is the builder realm, not the memory-and-creation garden.',
  '12.C.rationale':
    'Silence is pure frequency connection to Source, not the memory-and-creation center.',
  '12.D.rationale':
    'The Dome of Forgotten Gods is the garden for memory and creation within the Seven Gardens.',

  // Q13
  '13.A.text':
    'Atlantean spiral ley-line connectors designed to amplify free energy from the field.',
  '13.B.text':
    'Tartarian geometric conductors using arches, domes, and spirals to raise resonance.',
  '13.C.text':
    'Living crystalline plasma structures grown from consciousness rather than dead materials.',
  '13.D.text':
    'Modern 3D architecture using squares, sharp right angles, and dead frequency holders.',
  '13.A.rationale':
    'Atlantean lines feature living geometric conductors that amplify frequency, not drain it.',
  '13.B.rationale':
    'Tartarian architecture uses living geometry to amplify frequency and connect to ley-lines.',
  '13.C.rationale':
    'Living crystalline plasma is true Original Realm growth, not anti-resonance architecture.',
  '13.D.rationale':
    'Modern 3D architecture uses squares and sharp right angles as dead frequency holders that drain perception.',

  // Q14
  '14.A.text':
    'The physical geography of Asgard as a fixed landmass rather than preserved vessel codes.',
  '14.B.text':
    'The Black Cube siphon technology used to lock souls into emotional harvest loops.',
  '14.C.text':
    'The creation of planetary globes floating in vacuum as the true map of existence.',
  '14.D.text':
    'The high-frequency telepathic humanoid vessel perfected after migration to the Pleiades.',
  '14.A.rationale':
    'Asgard is linked to Hyperborean design halls; Pleiadian focus is preserving Tara codes in a telepathic vessel.',
  '14.B.rationale':
    'Pleiadians descend from the Sols of Tara and preserve organic codes, not parasitic cube tech.',
  '14.C.rationale':
    'Planetary globes are part of the illusion grid; Pleiadians preserve pre-fall codes beyond that overlay.',
  '14.D.rationale':
    'After Tara fractured, Pleiadians migrated to preserve the codes and perfected a high-frequency telepathic humanoid vessel.',

  // Q15
  '15.A.text':
    'The Council of 12 Suns physically descends to Earth and rebuilds every dome by force.',
  '15.B.text':
    'The 3D world becomes more solid and permanent as harmonic resonance locks the overlay.',
  '15.C.text':
    'The Spirit Tree is replanted by hand as a physical sapling before any frequency change.',
  '15.D.text':
    'The Light Lattices of the parasitic overlay glitch and shatter under held harmonic resonance.',
  '15.A.rationale':
    'Return of the Original Realm is driven by soul harmonic resonance and frequency collapse, not a Council descent.',
  '15.B.rationale':
    'Held resonance destabilizes the dense 3D overlay rather than making it more solid.',
  '15.C.rationale':
    'Restoration is frequency revelation of what remains intact; it is not a physical tree-replanting project.',
  '15.D.rationale':
    'As awakened souls hold harmonic resonance, Light Lattices of the parasitic overlay glitch and shatter.',

  // Q16
  '16.A.text':
    'The Dome of Titans alone, without Hyperborean design near Asgard by the Solar Masters.',
  '16.B.text':
    'The Lands of Pleiades alone, as the original design site rather than a later sanctuary.',
  '16.C.text':
    'The Hyperborean Halls near Asgard, after the realm was first birthed in Lemuria.',
  '16.D.text':
    'The Saturn Moon matrix, as the original design chamber of the crystalline temple.',
  '16.A.rationale':
    'Titans is a builder realm among the gardens; the template was designed in the Hyperborean Halls.',
  '16.B.rationale':
    'The Pleiades became a sanctuary after Tara fractured, not the original design site.',
  '16.C.rationale':
    'The Original Realm was birthed in Lemuria and designed in the Hyperborean Halls near Asgard by the 5 Solar Masters.',
  '16.D.rationale':
    'The Saturn Moon matrix is parasitic inversion technology, not the design site of the Original Realm.',
  '16.hint': 'Look for the location associated with Asgard and the five Solar Masters.',

  // Q17
  '17.A.text':
    'Natural free-energy conduits that permanently power every 3D city without illusion filler.',
  '17.B.text':
    'Rendered filler between simulations, enforced by Frequency Corridors and time loops.',
  '17.C.text':
    'Protective barriers that permanently seal the Seven Gardens from any projection overlay.',
  '17.D.text':
    'The sole organic source of crystalline plasma for the entire Cube Containment system.',
  '17.A.rationale':
    'In the Original Realm energy is drawn from the field; under the overlay, oceans and skies act as rendered filler.',
  '17.B.rationale':
    'Oceans and skies act as rendered filler between simulations while Frequency Corridors enforce illusory distance.',
  '17.C.rationale':
    'The Seven Gardens are external domes; current oceans and skies are illusion filler in the central overlay.',
  '17.D.rationale':
    'Crystalline plasma is true material growth of the realm; the sky we are shown is a false 3D projection layer.',

  // Q18
  '18.A.text':
    'Air alone, without Consciousness as the awareness that initiates form from frequency.',
  '18.B.text':
    'Fire alone, providing heat without the foundational awareness that structures creation.',
  '18.C.text':
    'Earth alone, as solidified membranes without the awareness that begins manifestation.',
  '18.D.text':
    'Consciousness, the foundational element among the five Solar Masters that brings form from nothing.',
  '18.A.rationale':
    'Air is one of five elements, but Consciousness is the awareness that brings form from nothing.',
  '18.B.rationale':
    'Fire is one of the five Solar Master elements; Consciousness is the foundational awareness for form.',
  '18.C.rationale':
    'Earth is densified structure; Consciousness is the awareness that initiates manifestation.',
  '18.D.rationale':
    'Consciousness is the foundational element among the five Solar Masters and brings form via friction, frequency, and sound.',

  // Q19 True/False expanded below
  '19.question':
    'Were the Custodians originally malevolent beings intent on imprisoning souls from the start?',
  '19.hint': 'Recall their original status as gateway overseers before the fall into control.',

  // Q20
  '20.A.text':
    'Gravity-bound matter versus permanently weightless light with no structured environments.',
  '20.B.text':
    'Solid objects versus purely gaseous illusions with no living material structure at all.',
  '20.C.text':
    'Dead materials such as concrete and steel versus environments grown from living crystalline plasma.',
  '20.D.text':
    'Biological life versus digital AI life as the only material distinction named in the realm.',
  '20.A.rationale':
    'The Original Realm is structured and physical through resonance; the contrast is not weightless light versus gravity alone.',
  '20.B.rationale':
    'True material is living crystalline structure, not a claim that everything is only gas.',
  '20.C.rationale':
    'The 3D overlay uses dead materials like concrete and steel; the true realm grows from crystalline plasma.',
  '20.D.rationale':
    'The core material contrast is dead anti-resonance construction versus living crystalline plasma growth.',

  // Q21
  '21.A.text':
    'The Solar Masters alone, without the Spirit Tree as the central distribution axis.',
  '21.B.text':
    'The Spirit Tree, which pulsed harmonic currents that fed all seven external gardens.',
  '21.C.text':
    'The Saturn Moon matrix, as the original nourishing feeder of the Seven Gardens.',
  '21.D.text':
    'The Council of 12 Suns alone, acting as the direct energetic feeder of every garden dome.',
  '21.A.rationale':
    'Solar Masters designed the elements; the Spirit Tree was the axis that fed the seven gardens.',
  '21.B.rationale':
    'The seven external domes, originally the Seven Gardens, were fed directly by the Spirit Tree.',
  '21.C.rationale':
    'The Saturn Moon matrix is a parasitic replacement after the Spirit Tree was removed.',
  '21.D.rationale':
    'The Council oversees balance; the Spirit Tree was the direct harmonic feeder of the gardens.',

  // Q22
  '22.A.text':
    'Only a temporary digital glitch that leaves the 3D cityscape fully solid and livable.',
  '22.B.text':
    'Hollow rubble, because they lack the frequency to anchor into the restored dimension.',
  '22.C.text':
    'A fully visible beautiful garden perceived the same way by both sleeping and awakened souls.',
  '22.D.text':
    'Only a blinding light with no description of collapsed scaffolding or rubble for the unawakened.',
  '22.A.rationale':
    'Lattice glitching is part of collapse, but those bound to 3D initially perceive hollow rubble.',
  '22.B.rationale':
    'For those bound to the 3D program, collapse initially looks like hollow rubble without the frequency to anchor the restored dimension.',
  '22.C.rationale':
    'Only awakened souls instantly transition into the vibrant crystalline reality; the 3D-bound do not.',
  '22.D.rationale':
    'The specific description for the 3D-bound is hollow rubble, not a universal blinding light.',

  // Q23
  '23.A.text':
    'Mechanical combustion engines required to produce all energy for solar architecture.',
  '23.B.text':
    'Living geometric conductors such as arches, domes, and spirals that connect to ley-lines.',
  '23.C.text':
    'Steel and concrete boxes deliberately chosen to ground and deaden natural resonance.',
  '23.D.text':
    'Sharp right angles used as the preferred form for amplifying free-energy fields.',
  '23.A.rationale':
    'True solar architecture draws free energy from the field; it does not rely on mechanical engines.',
  '23.B.rationale':
    'Atlantean and Tartarian lines built living geometric conductors—arches, domes, and spirals—linked to ley-lines.',
  '23.C.rationale':
    'Concrete and steel are dead frequency holders of the parasitic 3D overlay, not Tartarian design.',
  '23.D.rationale':
    'Sharp right angles are modern anti-resonance forms that drain perception, not Tartarian geometry.',

  // Q24
  '24.A.text':
    'To regulate only the flow of plasma between star nodes without densifying vision into matter.',
  '24.B.text':
    'To solidify vision into physical matter after sound folds into light.',
  '24.C.text':
    'To act solely as a permanent shield against every parasitic siphon in the Cube system.',
  '24.D.text':
    'To store the collective history of the Sols instead of densifying form from frequency.',
  '24.A.rationale':
    'Star nodes stream living plasma; crystalline membranes solidify vision into physical matter.',
  '24.B.rationale':
    'Reality begins as sound, folds into light and Vision, then solidifies into matter via stable Crystalline Membranes.',
  '24.C.rationale':
    'Their primary mechanical role is densifying vision into matter, not acting solely as anti-siphon shields.',
  '24.D.rationale':
    'History and memory align with nodes and gardens such as the Dome of Forgotten Gods, not membrane densification.',

  // Q25 True/False expanded below
  '25.question':
    'In the Original Realm, do all systems operate on free energy drawn directly from the field?',
  '25.hint': 'Contrast 3D resource scarcity with the free-energy field of the restored crystalline realm.'
};

/** Expand True/False pairs into four full options (site quality standard). */
function expandTrueFalse(qNum, options) {
  if (options.length !== 2) return options;
  const correct = options.find((o) => o.isCorrect);
  const wrong = options.find((o) => !o.isCorrect);
  if (!correct || !wrong) return options;

  const extras = {
    10: {
      correctText:
        'No — the Original Realm remains perfectly intact and is revealed by frequency collapse of the false matrices, with no physical reconstruction required.',
      correctRationale:
        'Restoration requires no physical reconstruction; the intact realm is revealed when the false matrices collapse in frequency.',
      wrongText:
        'Yes — the crystalline temple must be rebuilt brick by brick after the 3D matrix is demolished by external armies.',
      wrongRationale:
        'No physical reconstruction is required; the realm is perfectly intact beneath the cloaking Illusion Grid.',
      extra: [
        {
          text: 'Yes — awakened souls must reconstruct every coastline and city using modern concrete before Tara can return.',
          rationale:
            'True environments are grown from crystalline plasma and revealed by frequency, not rebuilt with dead 3D materials.'
        },
        {
          text: 'No — the Original Realm was fully overwritten and permanently deleted, so nothing remains to reveal.',
          rationale:
            'The Original Realm was never destroyed or overwritten; it remains intact and only cloaked by the Illusion Grid.'
        }
      ]
    },
    19: {
      correctText:
        'No — the Custodians began as neutral overseers of the gateways and only later drifted into control and energy feeding.',
      correctRationale:
        'The Custodians were initially placed as neutral overseers and later drifted into a desire for control and harvesting.',
      wrongText:
        'Yes — the Custodians were created as malevolent wardens whose only purpose was imprisoning souls from day one.',
      wrongRationale:
        'They were not originally malevolent; they began as neutral gateway overseers before the parasitic inversion.',
      extra: [
        {
          text: 'Yes — the Custodians always operated Black Cube Tech and never held a neutral stewardship role.',
          rationale:
            'Black Cube Tech was installed after they inverted the domes and removed the Spirit Tree; it was not their original role.'
        },
        {
          text: 'No — the Custodians were the Council of 12 Suns and never drifted from perfect solar balance.',
          rationale:
            'The Council of 12 Suns is the original solar stewardship; the Custodians are a separate group that later fell into control.'
        }
      ]
    },
    25: {
      correctText:
        'Yes — all systems operate on free energy drawn directly from the field, with no roads or vehicles required.',
      correctRationale:
        'In the Original Realm, all systems operate on free energy drawn directly from the field; paths form by consciousness.',
      wrongText:
        'No — the Original Realm still depends on mined fuels, paved roads, and mechanical engines for all systems.',
      wrongRationale:
        'There are no roads or vehicles; systems draw free energy directly from the field rather than scarce fuels.',
      extra: [
        {
          text: 'No — free energy exists only inside the Saturn Moon matrix and is withheld from the crystalline temple.',
          rationale:
            'Free energy from the field is the operating mode of the Original Realm, not a privilege of the parasitic matrix.'
        },
        {
          text: 'Yes — free energy exists, but only after the Council of 12 Suns installs mechanical power plants in every dome.',
          rationale:
            'Energy is drawn directly from the field through living architecture and consciousness, not mechanical power plants.'
        }
      ]
    }
  };

  const pack = extras[qNum];
  if (!pack) {
    return [
      correct,
      wrong,
      {
        label: 'C',
        text: 'This claim contradicts Original Realm mechanics and cannot hold.',
        isCorrect: false,
        rationale: 'Only report-aligned claims describe Original Realm mechanics accurately.'
      },
      {
        label: 'D',
        text: 'The framework operates in reverse of the correct option with no crystalline baseline.',
        isCorrect: false,
        rationale: 'Original Realm mechanics are fixed by the intact 5D+ crystalline template.'
      }
    ];
  }

  return [
    {
      label: 'A',
      text: pack.correctText,
      isCorrect: correct.isCorrect,
      rationale: pack.correctRationale
    },
    {
      label: 'B',
      text: pack.wrongText,
      isCorrect: wrong.isCorrect,
      rationale: pack.wrongRationale
    },
    {
      label: 'C',
      text: pack.extra[0].text,
      isCorrect: false,
      rationale: pack.extra[0].rationale
    },
    {
      label: 'D',
      text: pack.extra[1].text,
      isCorrect: false,
      rationale: pack.extra[1].rationale
    }
  ].map((o) => {
    // Preserve which of the original T/F was correct by matching isCorrect flags above carefully
    return o;
  });
}

function applyTfCorrectFlags(qNum, options, originalCorrectIsTrue) {
  if (qNum === 10) {
    // Correct is False ("must reconstruct?" → No)
    return options.map((o, i) => ({
      ...o,
      isCorrect: i === 0 // first option is the No / correct pack
    }));
  }
  if (qNum === 19) {
    // Correct is False ("originally malevolent?" → No)
    return options.map((o, i) => ({
      ...o,
      isCorrect: i === 0
    }));
  }
  if (qNum === 25) {
    // Correct is True
    return options.map((o, i) => ({
      ...o,
      isCorrect: i === 0
    }));
  }
  return options;
}

const metaVoiceRe =
  /\b(according to the (report|source|text)|the report states|the source (states|specifies|suggests|defines|material)|the text (states|describes|suggests|explicitly|mentions|defines|calls|focuses|identifies)|the material clarifies|mentioned in the (text|source)|source material)\b/i;

const questions = raw.questions.map((q) => {
  let options = q.options.map((o) => {
    let text = cleanText(o.text);
    let rationale = cleanText(o.rationale);
    const tKey = `${q.number}.${o.label}.text`;
    const rKey = `${q.number}.${o.label}.rationale`;
    if (overrides[tKey]) text = overrides[tKey];
    if (overrides[rKey]) rationale = overrides[rKey];
    else rationale = absoluteVoice(rationale);
    return {
      label: o.label,
      text,
      isCorrect: !!o.isCorrect,
      rationale
    };
  });

  if (options.length === 2) {
    const originalTrueCorrect = options.find((o) => /true/i.test(o.text) && o.isCorrect);
    options = expandTrueFalse(q.number, options);
    options = applyTfCorrectFlags(q.number, options, !!originalTrueCorrect);
  }

  const correctBefore = options.find((o) => o.isCorrect);
  if (!correctBefore) throw new Error(`Q${q.number}: no correct option`);

  let question = cleanText(q.question);
  let hint = cleanText(q.hint);
  if (overrides[`${q.number}.question`]) question = overrides[`${q.number}.question`];
  else question = absoluteVoice(question);
  if (overrides[`${q.number}.hint`]) hint = overrides[`${q.number}.hint`];
  else hint = absoluteVoice(hint);

  // Expand any remaining short non-TF options via overrides already applied
  const finalized = finalizeOptions(
    options.map(({ text, isCorrect, rationale }) => ({ text, isCorrect, rationale })),
    `${TOPIC_ID}-${q.number}`
  );

  const out = {
    number: q.number,
    question,
    options: finalized.options,
    hint,
    correctAnswer: finalized.correctAnswer
  };

  const blob = [
    out.question,
    out.hint,
    ...out.options.map((o) => `${o.text} ${o.rationale}`)
  ].join('\n');
  if (latexRe.test(blob) || /\$/.test(blob)) {
    throw new Error(`Q${q.number}: LaTeX/$ markup found: ${blob.match(/\$[^$]*\$|\$/)?.[0]}`);
  }
  if (metaVoiceRe.test(blob)) {
    throw new Error(`Q${q.number}: meta/report voice still present: ${blob.match(metaVoiceRe)?.[0]}`);
  }

  const phrases = supportPhrases[q.number] || [];
  const missing = phrases.filter((p) => !reportLower.includes(p.toLowerCase()));
  if (missing.length) {
    throw new Error(
      `Q${q.number}: report does not support phrases: ${missing.join('; ')}`
    );
  }

  if (out.options.length !== 4) throw new Error(`Q${q.number}: need 4 options, got ${out.options.length}`);
  if (out.options.filter((o) => o.isCorrect).length !== 1) {
    throw new Error(`Q${q.number}: need exactly 1 correct`);
  }
  for (const o of out.options) {
    if (!o.rationale || o.rationale.length < 8) {
      throw new Error(`Q${q.number}${o.label}: short rationale`);
    }
    if (o.text.length < 40) {
      throw new Error(`Q${q.number}${o.label}: option text too short (${o.text.length}): ${o.text}`);
    }
  }
  return out;
});

if (questions.length !== 25) {
  throw new Error(`Expected 25 questions, got ${questions.length}`);
}

function recountLetters(qs) {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of qs) counts[q.correctAnswer] = (counts[q.correctAnswer] || 0) + 1;
  return counts;
}

/** Nudge correct-letter distribution when one letter is starved. */
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

const topicImage = 'images/breakdown/original-realm.webp';
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
    'Test your grasp of the Original Realm — Tara as the 5D+ crystalline baseline, Cube Containment architecture, Spirit Tree inversion, and the frequency collapse that reveals the living temple.',
  totalQuestions: 25,
  extractedAt: new Date().toISOString(),
  reflection: {
    title: 'Reflection',
    body:
      'The Original Realm, also called the Second Realm or Tara, is the intact 5D+ crystalline baseline beneath the parasitic 3D overlay. Sit with what you missed, then return to the Original Realm deep-dive, infographics, and video transmissions. As awakened souls hold harmonic resonance, Light Lattices glitch and shatter — and the living crystalline temple is revealed without any physical reconstruction.'
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
    'Test your understanding of the Original Realm — Tara as the 5D+ crystalline baseline, Cube Containment, Spirit Tree inversion, Black Cube Tech, and frequency collapse that reveals the living temple.'
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
  throw new Error('original-realm not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from hard-drive-framework quiz page
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hard-drive-framework.html');
let html = fs.readFileSync(templatePath, 'utf8');
const replacements = [
  ['Hard Drive Framework Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on the Hard Drive Framework: The CUBE Containment as master frequency server, crystalline hard drives, perception overlays, and the reboot of the crystalline temple.',
    'Interactive Living Truth Quiz on the Original Realm: Tara as the 5D+ crystalline baseline, Cube Containment architecture, Spirit Tree inversion, and frequency collapse that reveals the living temple.'
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
    "  { path: '/quiz/breakdown/the-purge-phases.html', priority: '0.75', changefreq: 'monthly' },";
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
  'PASS: audited 25/25 against data/breakdown-topics/original-realm.json'
);
