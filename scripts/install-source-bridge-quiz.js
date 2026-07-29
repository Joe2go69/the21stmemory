/**
 * Installs Source Bridge quiz for breakdown (Mega Breakdown) transmission.
 * Source draft: G:/My Drive/CH21/Website Files/New Downloads/spirit-tree-quiz.json
 * Title forced to "Source Bridge". Brand-footer items rewritten from source-bridge report only.
 * Audits all 25 against data/breakdown-topics/source-bridge.json.
 *
 * Run: node scripts/install-source-bridge-quiz.js
 * Then: node scripts/rebalance-quiz-length.js data/quizzes/breakdown/source-bridge.json
 *      node scripts/split-topics-data.js && node scripts/build-quizzes-hub.js && node scripts/build-static-dives.js && node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const TOPIC_ID = 'source-bridge';
const TOPIC_TITLE = 'Source Bridge';
const SOURCE = 'breakdown';
const SOURCE_QUIZ =
  'G:/My Drive/CH21/Website Files/New Downloads/spirit-tree-quiz.json';

const topicPath = path.join(ROOT, 'data', 'breakdown-topics', `${TOPIC_ID}.json`);
const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
const report = topic.report || '';
const reportLower = report.toLowerCase();
const topicImage = 'images/breakdown/source-bridge.webp';

let extractedAt = new Date().toISOString();
try {
  if (fs.existsSync(SOURCE_QUIZ)) {
    const raw = JSON.parse(fs.readFileSync(SOURCE_QUIZ, 'utf8'));
    if (raw.extractedAt) extractedAt = raw.extractedAt;
  }
} catch (_) {
  /* keep default */
}

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

/** Support phrases grounded only in source-bridge.json report. */
const supportPhrases = {
  1: ['harmonic chord', 'pure light', 'not a biological'],
  2: ['known lands', 'permanently anchored', 'great dome'],
  3: ['lyran builders-architects', 'planted', 'engineered'],
  4: ['axis laburnum', 'harmonic bridge', 'star-nodes'],
  5: ['black cube tech', 'saturn moon frequency', 'custodians'],
  6: ['root system survived', 'foundational grids', 'harmonic lenses'],
  7: ['source light', 'feeds', 'domes'],
  8: ['reincarnation', 'amnesia', 'valve'],
  9: ['resonating sols', 'seed codes', 'reactivate'],
  10: ['spiritual numbness', 'confusion', 'loss of direction'],
  11: ['central node', 'power amplifier', 'bridge to the other'],
  12: ['seven gardens', 'outer domes', 'seven outer'],
  13: ['roots and branches', 'outer realms', 'source light'],
  14: ['inward', 'parasitic grid', 'outward energy flow'],
  15: ['not a biological', 'harmonic chord', 'lyran'],
  16: ['sever', 'source', 'solar family'],
  17: ['fractures', 'parasitic overlays', 'roots light up'],
  18: ['hyperborea', 'outer', 'seven gardens'],
  19: ['physical density', 'harmonic amplifier', 'great dome'],
  20: ['extraterrestrial fleets', 'awakened human', 'seed codes'],
  21: ['3d control', 'saturnian loop', 'artificial buffers'],
  22: ['cosmic symphony', 'pure source flow', 'realigning'],
  23: ['saturn moon frequency station', 'valve', 'black cube'],
  24: ['black cube tech', 'harmonic lenses', 'nodes'],
  25: ['hyperborea', 'cube system', 'originally stood'],
};

function cleanText(s) {
  let t = String(s || '');
  t = t.replace(/\$(\d+)\^\{(st|nd|rd|th)\}\$/gi, '$1$2');
  t = t.replace(/\$(\d+)\^(st|nd|rd|th)\$/gi, '$1$2');
  t = t.replace(/\$3\\text\{D\}\$/g, '3D');
  t = t.replace(/\$3\\mathrm\{D\}\$/g, '3D');
  t = t.replace(/\$3D\$/g, '3D');
  t = t.replace(/\$(\d+(?:\.\d+)?)\$/g, '$1');
  t = t.replace(/\$(\d+)%\$/g, '$1%');
  t = t.replace(/\$([A-Za-z][A-Za-z0-9./-]{0,24})\$/g, '$1');
  t = t.replace(/\$([^$]+)\$/g, (_, inner) =>
    inner
      .replace(/\^\{([^}]+)\}/g, '$1')
      .replace(/\\text\{([^}]*)\}/g, '$1')
      .replace(/\\mathrm\{([^}]*)\}/g, '$1')
      .replace(/\\%/g, '%')
      .replace(/\\[a-zA-Z]+/g, '')
      .replace(/[{}]/g, '')
  );
  t = t.replace(/\^\{(st|nd|rd|th)\}/gi, '$1');
  t = t.replace(/\\\(|\\\)|\\\[|\\\]/g, '');
  t = t.replace(/\\%/g, '%');
  t = t
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, '—')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ');
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

function absoluteVoice(s) {
  let t = String(s || '');
  const rewrites = [
    [/^According to the (core revelations|source|report|text|revelations|material|detailed mechanics|journal|living truth),?\s*/i, ''],
    [/^According to the report,?\s*/i, ''],
    [/^According to the text,?\s*/i, ''],
    [/^According to the material,?\s*/i, ''],
    [/\baccording to the (report|source|text|core revelations|revelations|material|journal|living truth)\b/gi, ''],
    [/^The (source|text|material|report) (states|specifies|describes|identifies) that\s+/i, ''],
    [/^The material explicitly states that\s+/i, ''],
    [/\bthe material specifies that\b/gi, ''],
    [/\bthe source material confirms\b/gi, ''],
    [/\bthe text identifies\b/gi, ''],
    [/\bthe text mentions that\b/gi, ''],
  ];
  for (const [re, rep] of rewrites) t = t.replace(re, rep);
  t = t.replace(/\s{2,}/g, ' ').trim();
  if (t.length) t = t.charAt(0).toUpperCase() + t.slice(1);
  return t;
}

/**
 * fullOptionSets[n] = [correct, wrong, wrong, wrong]
 * Each text is a full claim of similar length/depth.
 */
const fullOptionSets = {
  1: [
    {
      text: 'A colossal multidimensional Harmonic Chord of pure light pulsing through every Dome and realm as the central axis of consciousness.',
      rationale:
        'The Spirit Tree is not biological matter but a multidimensional Harmonic Chord of pure light that pulses through Domes and realms as the central axis of consciousness.',
    },
    {
      text: 'A colossal biological world-tree of living wood planted only in the outer Seven Gardens as a decorative life form.',
      rationale:
        'The Tree is explicitly not a biological entity; it is a frequency structure of pure light, not a wooden organism confined to the gardens.',
    },
    {
      text: 'A purely mental projection created by Solar Family thought alone with no structural role as a bridge or axis.',
      rationale:
        'The Tree is a structural Source Bridge and central axis feeding Domes with Source Light, not a subjective mental projection alone.',
    },
    {
      text: 'An artificial satellite grid built by the Custodians to harvest light from the Saturn Moon Frequency Station.',
      rationale:
        'Artificial grids and the Saturn Moon station belong to the parasitic replacement system, not the original Spirit Tree architecture.',
    },
  ],
  2: [
    {
      text: 'The KNOWN LANDS — the central dense physical realm and heart of the Great Dome where the Spirit Tree is permanently anchored.',
      rationale:
        'KNOWN LANDS are the central dense physical realm and heart of the Great Dome where the Spirit Tree is permanently anchored.',
    },
    {
      text: 'The Seven Gardens alone — exclusive outer Domes that permanently root the Spirit Tree trunk outside the Great Dome.',
      rationale:
        'The Seven Gardens are outer Domes fed by the Tree; the permanent anchor is the KNOWN LANDS at the heart of the Great Dome.',
    },
    {
      text: 'Hyperborea as the only permanent root site, with no broader designation for the central dense physical realm.',
      rationale:
        'Hyperborea is the living resonance field where the Tree originally stood; the permanent anchor realm is named KNOWN LANDS.',
    },
    {
      text: 'The Saturn Moon Frequency Station, which permanently fixes the Spirit Tree as the new central Source Bridge.',
      rationale:
        'The Saturn Moon Frequency Station is parasitic valve technology that replaced the Source Bridge, not its permanent anchor.',
    },
  ],
  3: [
    {
      text: 'The Lyran Builders-Architects, who planted and engineered the Spirit Tree for continuous pure light and vibration.',
      rationale:
        'Lyran Builders-Architects are the original creators who planted and engineered the Spirit Tree to ensure continuous pure flow of light and vibration.',
    },
    {
      text: 'The Custodians, who designed the Tree as a harvesting pillar for the Saturn Moon Frequency Station.',
      rationale:
        'Custodians ordered the Tree torn down and replaced it with parasitic tech; they did not create the original Spirit Tree.',
    },
    {
      text: 'The Greys, who engineered the Tree as a biological organism using multidimensional demolition skills.',
      rationale:
        'Greys supplied multidimensional engineering for removal of the Tree, not for its original Lyran planting and design.',
    },
    {
      text: 'The Solar Family alone, who built the Tree without any Lyran Builder-Architect engineering role.',
      rationale:
        'The Tree links to Source and the Solar Family, but planting and engineering are attributed to Lyran Builders-Architects.',
    },
  ],
  4: [
    {
      text: 'A harmonic bridge rooting in crystalline earth grids and branching to star-nodes to keep heavens aligned with the earth.',
      rationale:
        'Axis Laburnum is the true framework harmonic bridge that roots in crystalline grids and branches to star-nodes, maintaining vertical alignment between realms.',
    },
    {
      text: 'A mechanism for recycling souls into the parasitic reincarnation and amnesia loop of the Saturn grid.',
      rationale:
        'Soul recycling and amnesia are products of the parasitic valve inversion, not the Axis Laburnum true harmonic bridge.',
    },
    {
      text: 'A frequency station mounted on the Moon that intercepts outward Source Light for the Custodians.',
      rationale:
        'The Saturn Moon Frequency Station is parasitic valve tech; Axis Laburnum is the true vertical harmonic bridge.',
    },
    {
      text: 'A technological barrier wall built solely to contain the KNOWN LANDS and block all outer Domes.',
      rationale:
        'Axis Laburnum is a living current of order and alignment, not a containment barrier around the KNOWN LANDS.',
    },
  ],
  5: [
    {
      text: 'Black Cube Tech and the Saturn Moon Frequency Station, installed as valve tech to intercept light and invert flow.',
      rationale:
        'Custodians replaced the Source Bridge with Black Cube Tech and the Saturn Moon Frequency Station so valve technology could suck light inward for the parasitic grid.',
    },
    {
      text: 'Crystalline Grids alone, rebuilt as the sole replacement trunk after the Spirit Tree was dismantled.',
      rationale:
        'Crystalline Grids are the original medium the Tree pulsed through; they are not the Custodians’ replacement technology.',
    },
    {
      text: 'The Axis Laburnum, reprogrammed by Custodians as their primary harvest station for Source Light.',
      rationale:
        'Axis Laburnum is the true harmonic bridge they sought to cut or distort, not a tool they installed as a replacement.',
    },
    {
      text: 'Harmonic Lenses, repurposed as artificial valves that permanently erase all surviving root codes.',
      rationale:
        'Harmonic Lenses remain part of the surviving root architecture carrying Source codes, not the parasitic replacement.',
    },
  ],
  6: [
    {
      text: 'It survived and continues to form foundational grids, webs, Harmonic Lenses, and nodes carrying original Source codes.',
      rationale:
        'Even after the physical trunk was dismantled, the vast root system survived as foundational grids, webs, Harmonic Lenses, and nodes with original Source codes.',
    },
    {
      text: 'It was fully converted into Black Cube Tech so the original roots became the Saturn valve machinery.',
      rationale:
        'Black Cube Tech is an artificial replacement installed in the wound; it is not a transformation of the living roots.',
    },
    {
      text: 'It withered completely once solar currents stopped reaching the crown of the dismantled trunk.',
      rationale:
        'The living roots continued forming foundational grids and carrying Source codes rather than withering away.',
    },
    {
      text: 'It was completely eradicated by the Greys so no residual network could ever reactivate.',
      rationale:
        'Despite trunk removal, the root system survived and can still reactivate when seed codes make contact.',
    },
  ],
  7: [
    {
      text: 'Source Light — pure life-giving frequency and consciousness energy distributed across realms through the Tree’s network.',
      rationale:
        'Source Light is the pure life-giving frequency from Source that the Spirit Tree distributes across all realms through its network.',
    },
    {
      text: 'Only black cube frequency beams generated by the Saturn Moon Station for outer Dome control.',
      rationale:
        'Black cube and Saturn Moon frequencies belong to the parasitic inversion that intercepts light, not the Tree’s pure feed.',
    },
    {
      text: 'Amnesia-loop codes that keep every Dome locked into counterfeit reincarnation cycles alone.',
      rationale:
        'Amnesia and counterfeit reincarnation are enforced by parasitic valve tech, not by the Tree’s Source Light distribution.',
    },
    {
      text: 'Physical density only, with no frequency or consciousness energy moving between Domes at all.',
      rationale:
        'Physical density acts as a harmonic amplifier, but what feeds the Domes is Source Light frequency and consciousness energy.',
    },
  ],
  8: [
    {
      text: 'A counterfeit cycle of reincarnation and amnesia by sucking outward light inward into the parasitic grid.',
      rationale:
        'Valve technology intercepts light that once flowed outward, sucking it inward to feed the parasitic grid and enforce counterfeit reincarnation and amnesia.',
    },
    {
      text: 'Perfect blooming of the Seven Gardens under pure outward Source flow without any inversion.',
      rationale:
        'Perfect garden harmony belongs to the restored Tree system; valves invert flow and damage true design.',
    },
    {
      text: 'Stronger vertical alignment of star-nodes with crystalline grids through Axis Laburnum alone.',
      rationale:
        'Axis Laburnum maintains true vertical alignment; parasitic valves cut or distort that current rather than strengthen it.',
    },
    {
      text: 'Unmediated direct link between every human soul and the Solar Family without any intermediate tech.',
      rationale:
        'The unmediated link to Source and the Solar Family is the Spirit Tree itself, not the parasitic valve station.',
    },
  ],
  9: [
    {
      text: 'They carry original seed codes of the Tree’s frequency so surviving root grids recognize them and reactivate on contact.',
      rationale:
        'Resonating Sols hold original seed codes; because those codes exist in positive fleets and awakened human souls, root grids recognize them and reactivate on contact.',
    },
    {
      text: 'They negotiate political treaties with Custodians to leave Black Cube Tech permanently in place.',
      rationale:
        'Restoration is vibrational recognition of seed codes by living roots, not diplomatic negotiation with Custodians.',
    },
    {
      text: 'They construct entirely new physical pillars in each outer Garden to replace all surviving roots.',
      rationale:
        'Reactivation works through existing living roots and seed codes, not by building new physical pillars from scratch.',
    },
    {
      text: 'They staff and maintain the Saturn Moon Frequency Station so valve harvest never fails.',
      rationale:
        'Resonating Sols help dismantle the parasitic system; they do not operate the Saturn Moon valve station.',
    },
  ],
  10: [
    {
      text: 'Spiritual numbness, confusion, and a loss of direction within human consciousness as earthly–stellar flow weakens.',
      rationale:
        'When Axis Laburnum’s vertical current is cut or distorted, flow between earthly and stellar grids weakens, causing spiritual numbness, confusion, and loss of direction.',
    },
    {
      text: 'Instant total collapse of every outer Garden with no remaining Dome structure of any kind.',
      rationale:
        'Gardens suffer inversion and loss of true design; severance does not mean every structure vanishes instantly.',
    },
    {
      text: 'Enhanced multidimensional clarity as human consciousness expands without any Source Bridge support.',
      rationale:
        'Severing the Source Bridge reduces alignment and awareness; it does not enhance multidimensional perception.',
    },
    {
      text: 'Increased pure Source Light flooding all outer Domes faster than the Tree ever provided.',
      rationale:
        'Severance cuts off the pure feed; light is intercepted for the parasitic grid rather than increased outward.',
    },
  ],
  11: [
    {
      text: 'Central Node of the Great Dome, Bridge to the other Domes, and Power Amplifier using physical density.',
      rationale:
        'The three pillars are Central Node (harmonic heartbeat through crystalline grids), Bridge to the other Domes, and Power Amplifier leveraging Great Dome density.',
    },
    {
      text: 'Brand footer placement, stencil font rules, and warm gold glow as the three cosmic pillars of the Tree.',
      rationale:
        'Brand slide rules are not Tree architecture; the three pillars are Central Node, Bridge, and Power Amplifier.',
    },
    {
      text: 'Saturn Moon Station, Black Cube locks, and amnesia valves as the Tree’s original three support pillars.',
      rationale:
        'Those systems are parasitic replacements, not the Spirit Tree’s three original functional pillars.',
    },
    {
      text: 'Only a single sealed archive function with no bridge, node, or amplifier roles described.',
      rationale:
        'The Tree’s three pillars explicitly cover central pulse, outer Dome bridge, and density-based amplification.',
    },
  ],
  12: [
    {
      text: 'The seven outer Domes sustained by the Spirit Tree as central trunk so they bloom in harmony.',
      rationale:
        'Seven Gardens are the seven outer Domes; the Tree is the central trunk that sustains them so they bloom in perfect harmony.',
    },
    {
      text: 'The seven primary layers of Black Cube Tech inside the Saturn Moon Frequency Station.',
      rationale:
        'Saturn and Black Cube structures are parasitic; Seven Gardens are outer Domes fed by the true Source Bridge.',
    },
    {
      text: 'The seven original clans of Lyran Builders-Architects who each own one sealed garden world.',
      rationale:
        'Seven Gardens name dimensional outer Domes, not Lyran clans or ownership groups.',
    },
    {
      text: 'Seven purely physical climate zones inside the KNOWN LANDS with no Dome or Source role.',
      rationale:
        'Gardens are outer Domes fed via roots and branches of the Tree, not mere climate zones of the central lands.',
    },
  ],
  13: [
    {
      text: 'Through the roots and branches of the Spirit Tree acting as the ultimate Source Bridge trunk.',
      rationale:
        'As ultimate Source Bridge, the Tree feeds outer realms such as Forgotten Gods, Sheol, Silence, Hiva, Titans, Portals, and Five Peaks via roots and branches.',
    },
    {
      text: 'Only through amnesia-inducing valve technology sucking light inward from every outer Dome.',
      rationale:
        'Valves suck energy inward for the parasitic grid; pure feed to outer Domes is outward through Tree roots and branches.',
    },
    {
      text: 'Only by direct one-to-one transmission from each Resonating Sol without any Tree network.',
      rationale:
        'Resonating Sols reactivate roots; distribution of Source Light still runs through the Tree’s root and branch network.',
    },
    {
      text: 'Via the closed Saturnian loop as the only authorized channel between Domes.',
      rationale:
        'The Saturnian loop is the parasitic inversion that intercepts pure light rather than the Tree’s pure distribution path.',
    },
  ],
  14: [
    {
      text: 'A contained inward-sucking grid that intercepts outward light to feed the parasitic system.',
      rationale:
        'Parasites inverted outward energy flow into a contained parasitic grid; valve tech sucks light inward instead of nourishing realms outward.',
    },
    {
      text: 'Unbroken blooming of the Seven Gardens in perfect harmony under pure outward Source feed.',
      rationale:
        'Inversion produces disharmony and loss of true garden design rather than perfect blooming.',
    },
    {
      text: 'Stronger Axis Laburnum alignment between star-nodes and crystalline earth grids.',
      rationale:
        'True alignment is Axis Laburnum’s role; parasitic inversion cuts or distorts that vertical current.',
    },
    {
      text: 'Unchanged outward projection of power from the KNOWN LANDS into the wider cosmic framework.',
      rationale:
        'Original design projected energy outward; inversion reverses that into an inward harvest for parasites.',
    },
  ],
  15: [
    {
      text: 'False — it is a multidimensional Harmonic Chord of pure light engineered by Lyran Builders-Architects, not Greys.',
      rationale:
        'The Spirit Tree is not biological; it is a Harmonic Chord of pure light planted and engineered by Lyran Builders-Architects. Greys aided removal, not creation.',
    },
    {
      text: 'True — Greys grew it as organic timber inside Hyperborea to feed only the Saturn Moon Station.',
      rationale:
        'Greys helped tear the Tree down; Lyrans engineered it as light frequency, not as Grey-grown organic timber for Saturn harvest.',
    },
    {
      text: 'True — Custodians built it as a biological harvest organism long before any Lyran involvement.',
      rationale:
        'Custodians ordered its destruction and installed Black Cube valve tech; Lyran Builders-Architects created the original Tree.',
    },
    {
      text: 'False — because the Tree never existed except as a brand logo on 21st Memory slides.',
      rationale:
        'The Tree is described as the supreme Source Bridge and central axis of the KNOWN LANDS, not a brand logo only.',
    },
  ],
  16: [
    {
      text: 'Source — cutting the direct unmediated link to Source and the Solar Family.',
      rationale:
        'Tearing down the Spirit Tree was ordered to sever the KNOWN LANDS from Source; the Tree is the direct unmediated link to Source and the Solar Family.',
    },
    {
      text: 'Physical density of the Great Dome itself, so density could never amplify anything again.',
      rationale:
        'The Tree leverages physical density as a power amplifier; removal targets Source connection, not density as such.',
    },
    {
      text: 'All crystalline grids, leaving no residual network of nodes or Harmonic Lenses.',
      rationale:
        'Roots still form grids, lenses, and nodes after trunk removal; the strategic cut is from Source itself.',
    },
    {
      text: 'Black Cube technology, which the Tree had always generated as its primary product.',
      rationale:
        'Black Cube Tech is the parasitic replacement installed after removal, not something the Tree was severed from as its product.',
    },
  ],
  17: [
    {
      text: 'Parasitic overlays and illusions systematically fracture as original Source frequency returns.',
      rationale:
        'Reactivation of Spirit Tree root networks systematically fractures parasitic overlays and illusions as dormant roots light up with Source frequency.',
    },
    {
      text: 'Lyran Architects return solely to dismantle every remaining root and end Source flow forever.',
      rationale:
        'Lyrans planted roots to maintain light flow; lighting roots restores design rather than ordering permanent dismantling.',
    },
    {
      text: 'The amnesia loop is reinforced so counterfeit reincarnation becomes unbreakable.',
      rationale:
        'Source frequency in the roots dismantles false loops; it does not reinforce parasitic amnesia.',
    },
    {
      text: 'The KNOWN LANDS are relocated wholesale into the outer Domes as mobile gardens.',
      rationale:
        'KNOWN LANDS remain the central node and are realigned with the cosmic symphony, not physically moved into outer Domes.',
    },
  ],
  18: [
    {
      text: 'Hyperborea — the living resonance field and Cube core where the Tree stood, not one of the outer Gardens.',
      rationale:
        'Hyperborea is the living resonance field and core of the Cube system where the central Spirit Tree originally stood, not one of the seven outer Domes.',
    },
    {
      text: 'Portals — never named among outer realms fed by the Tree’s roots and branches.',
      rationale:
        'Portals is listed among outer realms such as Forgotten Gods, Sheol, Silence, Hiva, Titans, Portals, and Five Peaks.',
    },
    {
      text: 'Hiva — excluded from the outer Dome list and treated only as a parasitic station.',
      rationale:
        'Hiva is specifically named as one of the outer realms fed by the Tree as Source Bridge.',
    },
    {
      text: 'Sheol — excluded from the Seven Gardens and defined only as a brand footer term.',
      rationale:
        'Sheol is explicitly named as one of the outer Domes in the Seven Gardens system.',
    },
  ],
  19: [
    {
      text: 'Its physical density acts as a harmonic amplifier so the Tree can fuel outer realms and project energy outward.',
      rationale:
        'As Power Amplifier, the Tree leverages physical density of the Great Dome to fuel outer realms and project energy into the wider cosmic framework.',
    },
    {
      text: 'It supplies only stencil fonts and warm gold glow rules for archive branding on every slide.',
      rationale:
        'Brand styling is unrelated; the Great Dome’s density role is harmonic amplification for Source projection.',
    },
    {
      text: 'It is the exclusive generator of the amnesia frequency used by the Saturn Moon Station.',
      rationale:
        'Amnesia is enforced by parasitic valve technology and the Saturn Moon Frequency Station, not by the Great Dome’s amplifier role.',
    },
    {
      text: 'It functions only as a shield that permanently blocks all Source Light from leaving the center.',
      rationale:
        'The Dome’s density helps the Tree project energy outward; it is not a permanent shield against Source Light distribution.',
    },
  ],
  20: [
    {
      text: 'Positive extraterrestrial fleets and awakened human souls carrying Resonating Sol seed codes.',
      rationale:
        'Seed codes are embedded in both positive extraterrestrial fleets and awakened human souls; root grids recognize those Resonating Sol codes and reactivate.',
    },
    {
      text: 'Custodians and Grey demolition teams who tore down the trunk and installed Black Cube Tech.',
      rationale:
        'Those forces suppress and invert the system; they do not carry the seed codes that reactivate living roots.',
    },
    {
      text: 'The Saturnian valve machinery itself as an artificial carrier of original Source seed codes.',
      rationale:
        'Valve technology is artificial and parasitic; original seed codes are carried by living Resonating Sols.',
    },
    {
      text: 'Crystalline grids alone without any living fleet or human soul participation.',
      rationale:
        'Grids and nodes host the roots, but the codes that trigger reactivation are carried by fleets and awakened souls.',
    },
  ],
  21: [
    {
      text: 'Artificial buffers of the 3D control system and the false Saturnian loop so pure Source flow can return eternally.',
      rationale:
        'Restoring the Source Bridge eliminates artificial buffers of the 3D control system, dismantles the false Saturnian loop, realigns the KNOWN LANDS, and ensures eternal return of pure Source flow.',
    },
    {
      text: 'Only the requirement to keep brand footers on crowded slides in the archive presentation deck.',
      rationale:
        'Restoring the Source Bridge is a cosmic structural act described in strategic implications, not a slide-footer policy.',
    },
    {
      text: 'The Lyran Builders-Architects themselves so no further engineering of light can occur.',
      rationale:
        'Restoration returns Source flow and true garden design; it does not eliminate the Lyran creators of the Tree.',
    },
    {
      text: 'All surviving Harmonic Lenses and nodes so the root web can never light up again.',
      rationale:
        'Restoration lights dormant roots and preserves the living network rather than wiping lenses and nodes.',
    },
  ],
  22: [
    {
      text: 'Realignment of the KNOWN LANDS with the cosmic symphony and eternal return of pure Source flow.',
      rationale:
        'Strategic implications state restoration realigns the KNOWN LANDS with the cosmic symphony and ensures eternal return of pure Source flow while dismantling the false loop.',
    },
    {
      text: 'Conversion of the Spirit Tree into a purely biological timber model for the outer Gardens.',
      rationale:
        'The Tree remains a Harmonic Chord of pure light; restoration does not change it into a biological organism.',
    },
    {
      text: 'Stabilization and permanent reinforcement of the 3D control system and its amnesia valves.',
      rationale:
        'Restoration dismantles artificial 3D buffers and the Saturnian loop rather than stabilizing them.',
    },
    {
      text: 'Permanent removal of all physical density from the Great Dome so amplification becomes impossible.',
      rationale:
        'Density is a tool of the Power Amplifier; parasitic overlays are what restoration removes, not density itself.',
    },
  ],
  23: [
    {
      text: 'The Saturn Moon Frequency Station working with Black Cube Tech as intercepting valve technology.',
      rationale:
        'Black Cube Tech and the Saturn Moon Frequency Station replace the Source Bridge; this valve tech intercepts light and feeds the parasitic grid.',
    },
    {
      text: 'Harmonic Lens arrays that pure Lyran builders installed as the only light distribution path.',
      rationale:
        'Harmonic Lenses belong to the surviving original root architecture, not to the parasitic intercepting valve.',
    },
    {
      text: 'Axis Laburnum rebranded as a harvest station under direct Custodian command.',
      rationale:
        'Axis Laburnum is the true harmonic bridge; intercepting valves are Black Cube and Saturn Moon technology.',
    },
    {
      text: 'Resonating Sols treated as mechanical valves rather than living carriers of seed codes.',
      rationale:
        'Resonating Sols are living carriers of seed codes, not the named valve technology of the parasitic grid.',
    },
  ],
  24: [
    {
      text: 'Black Cube Tech — parasitic replacement machinery, not a component of the surviving original root web.',
      rationale:
        'Surviving roots form grids, webs, Harmonic Lenses, and nodes with Source codes; Black Cube Tech is the artificial replacement, not part of that original architecture.',
    },
    {
      text: 'Harmonic Lenses — never mentioned as part of the post-dismantling root network.',
      rationale:
        'Harmonic Lenses are explicitly named among structures the surviving roots continue to form.',
    },
    {
      text: 'Foundational grids — erased completely when the physical trunk was removed.',
      rationale:
        'Living roots continue to form foundational grids even after the trunk is dismantled.',
    },
    {
      text: 'Nodes carrying original Source codes — absent from any surviving root description.',
      rationale:
        'Surviving roots maintain nodes that carry the original Source codes of the Tree’s frequency.',
    },
  ],
  25: [
    {
      text: 'True — Hyperborea is the living resonance field and core of the Cube system where the central Spirit Tree originally stood.',
      rationale:
        'Hyperborea is defined as the living resonance field and core of the Cube system where the central Spirit Tree originally stood.',
    },
    {
      text: 'False — Hyperborea is only an outer Garden Dome listed beside Hiva and Five Peaks.',
      rationale:
        'Hyperborea is the core resonance field of the Cube system, not one of the seven outer Garden Domes.',
    },
    {
      text: 'False — Hyperborea is another name for the Saturn Moon Frequency Station alone.',
      rationale:
        'The Saturn Moon Frequency Station is parasitic valve tech; Hyperborea is the living field where the Tree stood.',
    },
    {
      text: 'True — but only as a temporary brand slogan with no Cube-system or Spirit Tree meaning.',
      rationale:
        'Hyperborea is substantive cosmology in the Key Terminology of the Source Bridge report, not a slogan without meaning.',
    },
  ],
};

const questionsMeta = [
  {
    number: 1,
    question: 'What is the true nature of the Spirit Tree within the multidimensional framework?',
    hint: 'It is defined by frequency and light, not organic growth alone.',
  },
  {
    number: 2,
    question: 'Where is the Spirit Tree permanently anchored within the Great Dome?',
    hint: 'Name the central dense physical realm at the heart of the Great Dome.',
  },
  {
    number: 3,
    question: 'Who were the original creators responsible for engineering the Spirit Tree?',
    hint: 'Look for the Builders-Architects named as planters of the Tree.',
  },
  {
    number: 4,
    question: 'What is the function of the Axis Laburnum?',
    hint: 'Focus on the harmonic bridge between crystalline earth grids and star-nodes.',
  },
  {
    number: 5,
    question: 'Which technology did the Custodians install to replace the original Source Bridge?',
    hint: 'Name the cube tech and moon frequency station of the parasitic inversion.',
  },
  {
    number: 6,
    question: "What happened to the Spirit Tree's root system after the physical trunk was dismantled?",
    hint: 'A vital network persisted and still carries original codes.',
  },
  {
    number: 7,
    question: 'What pure energy does the Spirit Tree distribute across realms through its network?',
    hint: 'It is the life-giving frequency flowing from Source.',
  },
  {
    number: 8,
    question: 'What counterfeit cycle does parasitic valve technology enforce by sucking light inward?',
    hint: 'Think of forced return and memory wipe together.',
  },
  {
    number: 9,
    question: 'How do Resonating Sols influence restoration of the Source Bridge?',
    hint: 'Their contribution is coded frequency the roots recognize.',
  },
  {
    number: 10,
    question: 'What is the consequence when the vertical current of Axis Laburnum is cut or distorted?',
    hint: 'Human consciousness loses alignment with stellar and earthly grids.',
  },
  {
    number: 11,
    question: 'Which three pillars describe the Spirit Tree’s function as Source Bridge?',
    hint: 'Central pulse, outer feed, and density-based amplification.',
  },
  {
    number: 12,
    question: "What are the 'Seven Gardens' in the context of the Spirit Tree?",
    hint: 'They are outer Domes sustained by the central trunk.',
  },
  {
    number: 13,
    question: 'How does Source Light reach outer Domes such as Hiva and the Five Peaks?',
    hint: 'The Tree is a trunk with a living network for feeding realms.',
  },
  {
    number: 14,
    question: 'Which description matches the parasitic inversion’s energy flow?',
    hint: 'Compare an outward fountain with an inward vacuum.',
  },
  {
    number: 15,
    question: 'Is the Spirit Tree a biological entity engineered by the Greys?',
    hint: 'Check both its nature as light and who planted it.',
  },
  {
    number: 16,
    question: 'The removal of the Spirit Tree was intended to sever the KNOWN LANDS from:',
    hint: 'Name the ultimate unmediated link the Tree provides.',
  },
  {
    number: 17,
    question: 'What occurs as dormant roots of the Spirit Tree light up with Source frequency?',
    hint: 'True signal returns into a corrupted control overlay.',
  },
  {
    number: 18,
    question: 'Which of these is NOT listed as one of the outer Domes (Seven Gardens)?',
    hint: 'Distinguish the Cube core field from outer garden Domes.',
  },
  {
    number: 19,
    question: 'What role does the Great Dome play in the functioning of the Spirit Tree?',
    hint: 'Physical density is used as a power tool.',
  },
  {
    number: 20,
    question: 'Surviving root grids recognize seed codes carried by:',
    hint: 'Living fleets and awakened humans share Resonating Sol essence.',
  },
  {
    number: 21,
    question: 'What does restoring the Source Bridge eliminate in the control architecture?',
    hint: 'Strategic implications name 3D buffers and a false planetary loop.',
  },
  {
    number: 22,
    question: 'What is the ultimate result of restoring the Source Bridge?',
    hint: 'Look for realignment with the cosmic symphony and pure Source flow.',
  },
  {
    number: 23,
    question: 'What valve technology intercepts light to feed the parasitic grid after the Tree’s removal?',
    hint: 'It pairs cube tech with a planet-and-moon frequency station.',
  },
  {
    number: 24,
    question: 'Which component is NOT part of the surviving root system’s architecture?',
    hint: 'Separate original living structures from parasitic replacements.',
  },
  {
    number: 25,
    question: 'Is Hyperborea the core of the Cube system where the Spirit Tree originally stood?',
    hint: 'Recall Key Terminology on the living resonance field at the Cube core.',
  },
];

const questions = [];
const letterCounts = { A: 0, B: 0, C: 0, D: 0 };

for (const meta of questionsMeta) {
  const n = meta.number;
  const set = fullOptionSets[n];
  if (!set || set.length !== 4) {
    throw new Error(`fullOptionSets[${n}] must have 4 options`);
  }

  const phrases = supportPhrases[n];
  if (!phrases || !phrases.length) {
    throw new Error(`Missing supportPhrases for Q${n}`);
  }
  const correctText = set[0].text.toLowerCase() + ' ' + set[0].rationale.toLowerCase();
  const hits = phrases.filter((p) => reportLower.includes(p.toLowerCase()));
  if (hits.length < 1) {
    throw new Error(`Q${n} support phrases not found in report: ${phrases.join(', ')}`);
  }
  const correctHits = phrases.filter((p) => correctText.includes(p.toLowerCase()));
  if (correctHits.length < 1) {
    throw new Error(`Q${n} correct option not grounded in support phrases`);
  }

  const rawOptions = set.map((o, i) => ({
    label: ['A', 'B', 'C', 'D'][i],
    text: cleanText(o.text),
    isCorrect: i === 0,
    rationale: absoluteVoice(cleanText(o.rationale)),
  }));

  for (const o of rawOptions) {
    if (latexRe.test(o.text) || latexRe.test(o.rationale)) {
      throw new Error(`LaTeX residue in Q${n}: ${o.text}`);
    }
    if (/according to the (report|text|source|journal|material)/i.test(o.rationale + o.text)) {
      throw new Error(`Non-absolute voice in Q${n}: ${o.rationale}`);
    }
  }

  // Length balance soft check before finalize
  const lens = rawOptions.map((o) => o.text.length);
  const maxL = Math.max(...lens);
  const minL = Math.min(...lens);
  if (maxL > minL * 2.4) {
    console.warn(`Q${n} length spread wide (min ${minL}, max ${maxL}) — finalize/rebalance will tighten`);
  }

  const { options, correctAnswer } = finalizeOptions(rawOptions, `${TOPIC_ID}-${n}`);
  letterCounts[correctAnswer] = (letterCounts[correctAnswer] || 0) + 1;

  questions.push({
    number: n,
    question: cleanText(meta.question),
    options,
    hint: cleanText(meta.hint),
    correctAnswer,
  });
}

if (questions.length !== 25) {
  throw new Error(`Expected 25 questions, got ${questions.length}`);
}

const usedLetters = Object.entries(letterCounts).filter(([, c]) => c > 0).length;
if (usedLetters < 3) {
  throw new Error(`Correct answers not mixed enough: ${JSON.stringify(letterCounts)}`);
}

const quiz = {
  id: TOPIC_ID,
  topicId: TOPIC_ID,
  sourceId: SOURCE,
  topicTitle: TOPIC_TITLE,
  title: TOPIC_TITLE,
  subtitle:
    'Test your grasp of Source Bridge — Spirit Tree as Harmonic Chord of pure light, KNOWN LANDS anchor, Axis Laburnum, Lyran Builders-Architects, Black Cube and Saturn Moon inversion, surviving roots, Resonating Sols, and restoration of pure Source flow.',
  totalQuestions: 25,
  extractedAt,
  reflection: {
    title: 'Reflection',
    body: 'Source Bridge is the Spirit Tree as supreme conduit for the KNOWN LANDS — a multidimensional Harmonic Chord of pure light, Axis Laburnum keeping heavens aligned with earth, and Lyran-planted architecture that feeds the Seven Gardens. Sit with the parasitic inversion: Custodians and Greys tearing the trunk, Black Cube Tech and the Saturn Moon Frequency Station sucking light inward into reincarnation and amnesia. The living roots still form grids, Harmonic Lenses, and nodes that recognize Resonating Sol seed codes. Return to the Source Bridge deep-dive, infographic, and video transmissions as those roots light up, overlays fracture, and pure Source flow returns.',
  },
  relatedTopic: {
    href: `/deep-dive.html?source=${SOURCE}&topic=${TOPIC_ID}`,
    label: `Return to ${TOPIC_TITLE} deep-dive`,
  },
  questions,
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
    'Test your understanding of Source Bridge — Spirit Tree as Harmonic Chord of pure light, KNOWN LANDS, Axis Laburnum, Lyran Builders-Architects, Black Cube and Saturn Moon valve inversion, surviving roots, Resonating Sols, and restoration of pure Source flow.',
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
      if (
        !t.description ||
        t.description.includes('Decoded analysis of Source Bridge')
      ) {
        t.description =
          'The Spirit Tree as the supreme Source Bridge for the KNOWN LANDS — Axis Laburnum, Source Light, Lyran Builders-Architects, parasitic inversion via Black Cube Tech, and reactivation of the living root web by Resonating Sols.';
      }
      return true;
    }
    if (t.subtopics && findAndPatch(t.subtopics)) return true;
  }
  return false;
}
if (!findAndPatch(mono.topics)) {
  throw new Error('source-bridge not found in breakdown-topics.json');
}
fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

// Clone HTML from hyperborean-heart quiz (recent sibling)
const templatePath = path.join(ROOT, 'quiz', SOURCE, 'hyperborean-heart.html');
let html = fs.readFileSync(templatePath, 'utf8');
const desc =
  'Interactive Living Truth Quiz on Source Bridge: Spirit Tree as Harmonic Chord of pure light, KNOWN LANDS anchor, Axis Laburnum, Lyran Builders-Architects, Black Cube and Saturn Moon inversion, surviving roots, Resonating Sols, and restoration of pure Source flow.';
const replacements = [
  ['Hyperborean Heart Quiz', `${TOPIC_TITLE} Quiz`],
  [
    'Interactive Living Truth Quiz on Hyperborean Heart: Antarctica ice mask, Spirit Tree and Lyran builders, Black Cube valve hijack, lunar/Saturn siphon, Aru-el-nai versus Polaris, living roots, SEED codes, and garden restoration.',
    desc,
  ],
  ['quiz/breakdown/hyperborean-heart.html', `quiz/${SOURCE}/${TOPIC_ID}.html`],
  ['images/breakdown/hyperborean-heart.webp', topicImage],
  [
    'deep-dive.html?source=breakdown&amp;topic=hyperborean-heart',
    `deep-dive.html?source=${SOURCE}&amp;topic=${TOPIC_ID}`,
  ],
  ['Hyperborean Heart deep-dive', `${TOPIC_TITLE} deep-dive`],
  ['>Hyperborean Heart</div>', `>${TOPIC_TITLE}</div>`],
  [
    'data/quizzes/breakdown/hyperborean-heart.json',
    `data/quizzes/${SOURCE}/${TOPIC_ID}.json`,
  ],
];
for (const [a, b] of replacements) {
  if (!html.includes(a)) {
    console.warn('Template string not found:', a.slice(0, 90));
  }
  html = html.split(a).join(b);
}

html = html
  .replace(/Interactive Living Truth Quiz on Hyperborean Heart[^"]*/g, desc)
  .replace(/Hyperborean Heart/g, TOPIC_TITLE);

html = html
  .replace(/Source Bridge\.webp/g, 'source-bridge.webp')
  .replace(/Source Bridge\.json/g, 'source-bridge.json')
  .replace(/Source Bridge\.html/g, 'source-bridge.html')
  .replace(/topic=Source Bridge/g, `topic=${TOPIC_ID}`)
  .replace(/topic=source-bridge/g, `topic=${TOPIC_ID}`);

const htmlDir = path.join(ROOT, 'quiz', SOURCE);
fs.mkdirSync(htmlDir, { recursive: true });
const htmlPath = path.join(htmlDir, `${TOPIC_ID}.html`);
fs.writeFileSync(htmlPath, html, 'utf8');

const sitemapScript = path.join(ROOT, 'scripts', 'generate-sitemap.js');
let sm = fs.readFileSync(sitemapScript, 'utf8');
const entry = `  { path: '/quiz/${SOURCE}/${TOPIC_ID}.html', priority: '0.75', changefreq: 'monthly' },`;
if (!sm.includes(`/quiz/${SOURCE}/${TOPIC_ID}.html`)) {
  const anchors = [
    "  { path: '/quiz/breakdown/hyperborean-heart.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/breakdown/celestial-anchors.html', priority: '0.75', changefreq: 'monthly' },",
    "  { path: '/quiz/breakdown/central-axis.html', priority: '0.75', changefreq: 'monthly' },",
  ];
  let inserted = false;
  for (const anchor of anchors) {
    if (sm.includes(anchor)) {
      sm = sm.replace(anchor, `${anchor}\n${entry}`);
      inserted = true;
      break;
    }
  }
  if (!inserted) {
    throw new Error('Could not find sitemap anchor to insert quiz entry');
  }
  fs.writeFileSync(sitemapScript, sm, 'utf8');
}

console.log('Wrote', path.relative(ROOT, quizJsonPath));
console.log('Wrote', path.relative(ROOT, htmlPath));
console.log('Updated topic.quiz on', TOPIC_ID);
console.log('Correct letter mix:', letterCounts);
console.log('PASS: audited 25/25 against data/breakdown-topics/source-bridge.json');
