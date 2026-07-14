/**
 * Strips meta/report-hedging from all quiz JSON so copy speaks as absolute truth.
 * Also patches install-*-quiz.js sources so reinstalls do not reintroduce hedges.
 * Run: node scripts/dehedge-quiz-voice.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

/** Convert hedging / meta voice into absolute Living Truth voice. */
function dehedge(s) {
  if (typeof s !== 'string') return s;
  let t = s;

  // Reflection boilerplate
  t = t.replace(
    /\s*Every correct answer maps back to this topic's report alone\./gi,
    ''
  );

  // Question / sentence openers
  t = t.replace(/^According to this topic,\s*/i, '');
  t = t.replace(/^According to the report,\s*/i, '');
  t = t.replace(/^According to the text,\s*/i, '');
  t = t.replace(/^According to the source(?: material)?,\s*/i, '');
  t = t.replace(/\baccording to this topic\b/gi, '');
  t = t.replace(/\baccording to the report\b/gi, '');
  t = t.replace(/\baccording to the text\b/gi, '');
  t = t.replace(/\baccording to the source(?: material)?\b/gi, '');
  t = t.replace(/\baccording to the source\b/gi, '');

  // "According to the mechanical revelations of the sky event" is fine-ish but clean:
  t = t.replace(
    /^According to the mechanical revelations of the sky event,\s*/i,
    'In the mechanics of the sky event, '
  );

  // True/False wrappers
  t = t.replace(
    /True or False: According to the source,\s*/gi,
    'True or False: '
  );

  // Question stems that name the report/topic/source
  t = t.replace(
    /^What other name does the report use for /i,
    'What other name is used for '
  );
  t = t.replace(
    /^How does this topic reframe /i,
    'How is '
  );
  // Fix awkward "How is the Industrial Revolution relative" after replace — handled by specific map below

  t = t.replace(/^How does the report characterize /i, 'What is the truth about ');
  t = t.replace(/^How does the report describe /i, 'What is the truth about ');
  t = t.replace(/^How does the report physically describe /i, 'How are ');
  t = t.replace(/^How does the report reframe /i, 'How should one understand ');
  t = t.replace(/^How does the report place /i, 'How is ');
  t = t.replace(/^What does the report reveal about /i, 'What is the truth about ');
  t = t.replace(/^What does the report say about /i, 'What is the truth about ');
  t = t.replace(/^What does the report state about /i, 'What is the truth about ');
  t = t.replace(/^What does the report claim about /i, 'What is the truth about ');
  t = t.replace(/^What does the report cite about /i, 'What evidence exists about ');
  t = t.replace(
    /^What archival photographic evidence does the report cite about /i,
    'What archival photographic evidence exists about '
  );
  t = t.replace(
    /^What approximate dimensions and crowning feature does the report give for /i,
    'What approximate dimensions and crowning feature define '
  );
  t = t.replace(
    /^What larger strategic meaning does the report assign to /i,
    'What is the larger strategic meaning of '
  );
  t = t.replace(/^What does the report require for /i, 'What is required for ');
  t = t.replace(
    /^Which created negative species does the report name as used to /i,
    'Which created negative species were used to '
  );
  t = t.replace(
    /^How does the report characterize 4th density as /i,
    'How is 4th density defined as '
  );
  t = t.replace(
    /^Why does the report call Gravity a fictional mechanism\?/i,
    'Why is Gravity a fictional mechanism?'
  );
  t = t.replace(
    /^How is the Source of All Creation described in Key Terminology\?/i,
    'What is the Source of All Creation?'
  );
  t = t.replace(
    /^What does Sol-System mean in this topic's terminology\?/i,
    'What does Sol-System mean?'
  );
  t = t.replace(
    /^What was the overarching purpose of the multi-layered Control Mechanisms described in this topic\?/i,
    'What was the overarching purpose of the multi-layered Control Mechanisms?'
  );
  t = t.replace(
    /^Where do the Anuk sit within the larger parasitic hierarchy described in this topic\?/i,
    'Where do the Anuk sit within the larger parasitic hierarchy?'
  );
  t = t.replace(
    /^What is the periodic Reset as described in this topic\?/i,
    'What is the periodic Reset?'
  );
  t = t.replace(
    /^How is society repopulated after a Reset according to the report\?/i,
    'How is society repopulated after a Reset?'
  );
  t = t.replace(
    /^What dual role do Baphomet Power Pylons play according to this topic\?/i,
    'What dual role do Baphomet Power Pylons play?'
  );
  t = t.replace(
    /^What is the true nature of "space" or the dark matter field according to this topic\?/i,
    'What is the true nature of "space" or the dark matter field?'
  );
  t = t.replace(
    /^What is the true nature of 'space' or the dark matter field according to this topic\?/i,
    "What is the true nature of 'space' or the dark matter field?"
  );
  t = t.replace(
    /^What is the sun in true cosmology according to this topic\?/i,
    'What is the sun in true cosmology?'
  );
  t = t.replace(
    /^What is the true origin of the Industrial Revolution as described in the source material\?/i,
    'What is the true origin of the Industrial Revolution?'
  );
  t = t.replace(
    /^What is the ultimate goal of the 'Great Dome' simulation according to the text\?/i,
    "What is the ultimate goal of the 'Great Dome' simulation?"
  );
  t = t.replace(
    /^How are Atmospheric Condensers in Key Terminology\?/i,
    'How are Atmospheric Condensers physically constructed?'
  );
  t = t.replace(
    /^How are Atmospheric Condensers physically in Key Terminology\?/i,
    'How are Atmospheric Condensers physically constructed?'
  );
  t = t.replace(
    /^How are Atmospheric Condensers in Key Terminology, and what is their origin\?/i,
    'What other name is used for Atmospheric Condensers, and what is their origin?'
  );

  // Specific broken stems after generic replaces
  t = t.replace(
    /^How is the Industrial Revolution relative to Tartarian technology\?/i,
    'How is the Industrial Revolution reframed relative to Tartarian technology?'
  );
  t = t.replace(
    /^How are Atmospheric Condensers in Key Terminology\?/i,
    'How are Atmospheric Condensers physically constructed?'
  );
  t = t.replace(
    /How does the report physically describe Atmospheric Condensers in Key Terminology\?/gi,
    'How are Atmospheric Condensers physically constructed?'
  );
  t = t.replace(
    /How are Atmospheric Condensers in Key Terminology\?/gi,
    'How are Atmospheric Condensers physically constructed?'
  );

  // Rationale / hint / body meta voice
  t = t.replace(/\bThe report opens by defining\b/gi, '');
  t = t.replace(/\bThe report opens with\b/gi, '');
  t = t.replace(/\bOverview states\b/gi, '');
  t = t.replace(/\bThe overview states\b/gi, '');
  t = t.replace(/\bKey Terminology defines them as\b/gi, 'They are');
  t = t.replace(/\bKey Terminology defines\b/gi, '');
  t = t.replace(/\bKey Terminology places\b/gi, '');
  t = t.replace(/\bThe source material confirms that\b/gi, '');
  t = t.replace(/\bThe source material identifies\b/gi, '');
  t = t.replace(/\bThe source material emphasizes\b/gi, '');
  t = t.replace(/\bThe source material specifically lists\b/gi, '');
  t = t.replace(/\bThe source material\b/gi, 'True cosmology');
  t = t.replace(/\bCheck whether the source material describes them as\b/gi, 'Check whether they are described as');
  t = t.replace(/\bThe text states that\b/gi, '');
  t = t.replace(/\bThe text states\b/gi, '');
  t = t.replace(/\bas described in the text\b/gi, '');
  t = t.replace(/\bas described in the source material\b/gi, '');
  t = t.replace(/\bas described in the report\b/gi, '');
  t = t.replace(/\bas described in this topic\b/gi, '');
  t = t.replace(/\bdescribed in this topic\b/gi, '');
  t = t.replace(/\bnamed in the report\b/gi, 'named here');
  t = t.replace(/\bon this topic\b/gi, '');
  t = t.replace(/\bin this topic's terminology\b/gi, '');
  t = t.replace(/\bin this topic\b/gi, '');
  t = t.replace(/\bThis topic focuses on\b/gi, 'The truth focuses on');
  t = t.replace(/\boutside this report's WW1 purpose\b/gi, 'outside the WW1 purpose');
  t = t.replace(/\bin this report\b/gi, '');
  t = t.replace(/\bThose details are not in this report;\s*/gi, 'Those details are false; ');
  t = t.replace(/\bmatch the report differently\b/gi, 'do not match those facts');
  t = t.replace(/\bthe reported baseline\b/gi, 'the baseline');
  t = t.replace(/\bRecall the key terminology entry for 4th density\b/gi, 'Recall the definition of 4th density');

  // "The report [verb]..."
  t = t.replace(/\bThe report explicitly rejects\b/gi, 'This rejects');
  t = t.replace(/\bThe report rejects\b/gi, 'This rejects');
  t = t.replace(/\bThe report exposes\b/gi, '');
  t = t.replace(/\bThe report states that\b/gi, '');
  t = t.replace(/\bThe report states\b/gi, '');
  t = t.replace(/\bThe report says that\b/gi, '');
  t = t.replace(/\bThe report says\b/gi, '');
  t = t.replace(/\bThe report claims that\b/gi, '');
  t = t.replace(/\bThe report claims\b/gi, '');
  t = t.replace(/\bThe report describes\b/gi, '');
  t = t.replace(/\bThe report defines\b/gi, '');
  t = t.replace(/\bThe report places\b/gi, '');
  t = t.replace(/\bThe report frames\b/gi, '');
  t = t.replace(/\bThe report ties\b/gi, '');
  t = t.replace(/\bThe report cites\b/gi, '');
  t = t.replace(/\bThe report assigns\b/gi, '');
  t = t.replace(/\bThe report focuses on\b/gi, '');
  t = t.replace(/\bThe report requires\b/gi, '');
  t = t.replace(/\bthe report does not restore\b/gi, 'this does not restore');
  t = t.replace(/\bthe report does not\b/gi, 'this does not');
  t = t.replace(/\bThe report\b/gi, '');

  // Cleanup after stripping leading clauses
  t = t.replace(/\s{2,}/g, ' ');
  t = t.replace(/\s+([,.;:])/g, '$1');
  t = t.replace(/\.\s*\./g, '.');
  t = t.replace(/^\s*[,;:\-—]+\s*/g, '');
  t = t.replace(/\s+that\s+that\b/gi, ' that');

  // Capitalize start of string if we stripped a leading clause
  t = t.replace(/^\s+/, '');
  if (t.length && /[a-z]/.test(t[0])) {
    // Don't force-cap mid-sentence fragments that are option texts starting with "to" etc.
    // Only cap if it looks like a full sentence (rationale/question often starts with capital already)
  }
  // Force capital after we may have left lowercase from stripping "The report states that X"
  t = t.replace(
    /^(they are|it is|it was|these|this|those|stars|earth|mars|venus|gravity|overlays|asteroids|nuclear|dimensions|coal|parasitic|human|created|anuk|Betty|locomotives|performance|condensers|atmospheric|control|density|npc|evolution|society|supermarket|dark|mechanisms|survival|free-energy|complete|in true|in 9th|after the|once engaged|tracks|placement|pylons|smelting|severing|vaping|frequency|vatican|grey|galactic|complete uninstall)/i,
    (m) => m.charAt(0).toUpperCase() + m.slice(1)
  );

  // Specific full-string rewrites for known awkward leftovers
  const exact = {
    'How are Atmospheric Condensers in Key Terminology?':
      'How are Atmospheric Condensers physically constructed?',
    'How does the report physically describe Atmospheric Condensers in Key Terminology?':
      'How are Atmospheric Condensers physically constructed?',
    'What other name is used for Atmospheric Condensers, and what is their origin?':
      'What other name is used for Atmospheric Condensers, and what is their origin?',
    "Atmospheric Condensers as Atmospheric Augmentation Systems from pre-reset Great Tartary, free-energy harvesting apparatuses.":
      'Atmospheric Condensers are Atmospheric Augmentation Systems from pre-reset Great Tartary — free-energy harvesting apparatuses.',
    'Atmospheric Condensers as Atmospheric Augmentation Systems from pre-reset Great Tartary, free-energy harvesting apparatuses.':
      'Atmospheric Condensers are Atmospheric Augmentation Systems from pre-reset Great Tartary — free-energy harvesting apparatuses.',
  };
  if (exact[t]) t = exact[t];

  // Fix common leftover fragments starting mid-definition
  t = t.replace(
    /^Atmospheric Condensers as Atmospheric Augmentation Systems/i,
    'Atmospheric Condensers are Atmospheric Augmentation Systems'
  );
  t = t.replace(
    /^reality is an engineered/i,
    'Reality is an engineered'
  );
  t = t.replace(
    /^an engineered multidimensional Simulation crafted by the Source of All Creation, not an accidental vacuum\./i,
    'Reality is an engineered multidimensional Simulation crafted by the Source of All Creation, not an accidental vacuum.'
  );
  t = t.replace(
    /^Control Mechanisms were designed/i,
    'Control Mechanisms were designed'
  );
  t = t.replace(
    /^The Three Strings as Religion/i,
    'The Three Strings are Religion'
  );
  t = t.replace(
    /^Betty and Barney Hill lore/i,
    'Betty and Barney Hill lore'
  );
  t = t.replace(
    /^the Holographic Projection Dome beneath/i,
    'The Holographic Projection Dome sits beneath'
  );
  t = t.replace(
    /^Holographic Projection Dome beneath/i,
    'The Holographic Projection Dome sits beneath'
  );
  t = t.replace(
    /^4th density as the biological/i,
    '4th density is the biological'
  );
  t = t.replace(
    /^Electromagnetic Inductance as a varying/i,
    'Electromagnetic Inductance is a varying'
  );
  t = t.replace(
    /^secret sect and priestly systems/i,
    'Secret sect and priestly systems'
  );
  t = t.replace(
    /^vat fabrication, not living/i,
    'Meat is vat fabrication, not living'
  );
  t = t.replace(
    /^failure of mechanisms and G\.A\.A\. dismantling/i,
    'What is underway is the failure of mechanisms and G.A.A. dismantling'
  );
  t = t.replace(
    /^deliberate energetic interconnection of nodes\./i,
    'Roads and railways follow deliberate energetic interconnection of nodes.'
  );
  t = t.replace(
    /^energetic pathways for propulsion, not floating track beds\./i,
    'Tracks follow energetic pathways for propulsion, not floating track beds.'
  );
  t = t.replace(
    /^smelting as calculated forced financial dependency\./i,
    'Smelting was calculated forced financial dependency.'
  );
  t = t.replace(
    /^Re-sets as part of the parasitic harvest system/i,
    'Re-sets are part of the parasitic harvest system'
  );
  t = t.replace(
    /^Anuk power to cyclical/i,
    'Anuk power is tied to cyclical'
  );
  t = t.replace(
    /^Venus the Lucifer/i,
    'Venus holds the Lucifer'
  );
  t = t.replace(
    /^petrification of biological matter/i,
    'Petrification of biological matter'
  );
  t = t.replace(
    /^minerals are meant to remain/i,
    'Minerals are meant to remain'
  );
  t = t.replace(
    /^consciousness and frequency over external mechanical tools\./i,
    'Creation emphasizes consciousness and frequency over external mechanical tools.'
  );
  t = t.replace(
    /^they were suppressed, overlaid, or destroyed/i,
    'They were suppressed, overlaid, or destroyed'
  );
  t = t.replace(
    /^the resistance was hijacked/i,
    'The resistance was hijacked'
  );
  t = t.replace(
    /^without the artificial field enforcing density/i,
    'Without the artificial field enforcing density'
  );
  t = t.replace(
    /^the cosmos as perceived by humanity is an engineered holographic sieve\./i,
    'The cosmos as perceived by humanity is an engineered holographic sieve.'
  );
  t = t.replace(
    /^the Egyptian connection as a deliberate/i,
    'The Egyptian connection is a deliberate'
  );
  t = t.replace(
    /^propulsion energy and free-energy harvesting, not telegraphy\./i,
    'The function is propulsion energy and free-energy harvesting, not telegraphy.'
  );
  t = t.replace(
    /^condensers superheated boiler water/i,
    'Condensers superheated boiler water'
  );
  t = t.replace(
    /^condensers drew power from/i,
    'Condensers drew power from'
  );
  t = t.replace(
    /^the Industrial Revolution was the orchestrated/i,
    'The Industrial Revolution was the orchestrated'
  );
  t = t.replace(
    /^the Anuk did not primarily operate/i,
    'The Anuk did not primarily operate'
  );
  t = t.replace(
    /^those Grand Canyon landmarks are original/i,
    'Those Grand Canyon landmarks are original'
  );
  t = t.replace(
    /^the Anuk directly beneath the Custodians and states they share/i,
    'The Anuk sit directly beneath the Custodians and they share'
  );
  t = t.replace(
    /^the Anuk sit directly beneath the Custodians and states they share/i,
    'The Anuk sit directly beneath the Custodians and they share'
  );
  t = t.replace(
    /^Anuk survival was strictly tethered/i,
    'Anuk survival was strictly tethered'
  );
  t = t.replace(
    /^the parasitic factions inherently distrusted/i,
    'The parasitic factions inherently distrusted'
  );
  t = t.replace(
    /^those human proxies were bound/i,
    'Those human proxies were bound'
  );
  t = t.replace(
    /^the Anuk were artificially generated/i,
    'The Anuk were artificially generated'
  );
  t = t.replace(
    /^the Anuk held a dedicated tier/i,
    'The Anuk held a dedicated tier'
  );
  t = t.replace(
    /^an 1883 Russian Engineering Review/i,
    'An 1883 Russian Engineering Review'
  );
  t = t.replace(
    /^44 museum photographs from before 1880/i,
    '44 museum photographs from before 1880'
  );
  t = t.replace(
    /^the condenser is part of a unified infrastructure/i,
    'The condenser is part of a unified infrastructure'
  );
  t = t.replace(
    /^it is not built through manual labor/i,
    'The physical plain is not built through manual labor'
  );
  t = t.replace(
    /^This rejects distant-star origins for the Greys and treats those stories as cover narratives\./i,
    'Distant-star origins for the Greys are false cover narratives.'
  );
  t = t.replace(
    /^This rejects independent 19th-century invention\./i,
    'Independent 19th-century invention is false.'
  );
  t = t.replace(
    /^This rejects the burning-gas model and heliocentric orbits\./i,
    'The burning-gas model and heliocentric orbits are false.'
  );

  // Collapse double spaces again and tidy
  t = t.replace(/\s{2,}/g, ' ').trim();
  t = t.replace(/\s+([?!.])/g, '$1');
  // Remove empty " ." artifacts
  t = t.replace(/^\.\s*/, '');

  return t;
}

function walk(value) {
  if (typeof value === 'string') return dehedge(value);
  if (Array.isArray(value)) return value.map(walk);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = walk(v);
    return out;
  }
  return value;
}

const quizDirs = [
  path.join(ROOT, 'data', 'quizzes', 'alice'),
  path.join(ROOT, 'data', 'quizzes', 'breakdown'),
];

let quizFiles = 0;
let quizHits = 0;
for (const dir of quizDirs) {
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir).filter((n) => n.endsWith('.json'))) {
    const fp = path.join(dir, name);
    const before = fs.readFileSync(fp, 'utf8');
    const data = walk(JSON.parse(before));
    const after = JSON.stringify(data, null, 2) + '\n';
    if (after !== before) {
      fs.writeFileSync(fp, after, 'utf8');
      quizHits++;
    }
    quizFiles++;
  }
}

// Patch install scripts (string literals) with the same dehedge on full file content carefully
const scriptsDir = path.join(ROOT, 'scripts');
let scriptHits = 0;
for (const name of fs.readdirSync(scriptsDir).filter((n) =>
  /^install-.*-quiz\.js$/.test(n)
)) {
  const fp = path.join(scriptsDir, name);
  let src = fs.readFileSync(fp, 'utf8');
  const before = src;

  // Only transform quoted string contents by regex walking is hard; apply dehedge to full file
  // but protect supportPhrases keys and comments about "report only" audit.
  // Safer: extract template strings / quotes for question content lines by running dehedge on each line
  // that looks like user-facing copy.
  src = src
    .split('\n')
    .map((line) => {
      // Skip comments and support phrase maps / paths
      if (/^\s*\/\//.test(line)) return line;
      if (/supportPhrases|TOPIC_|SOURCE_|path\.join|readFileSync|writeFileSync/.test(line)) {
        // still transform if it has reflection body with maps back
        if (!/maps back to this topic|according to|the report |source material|the text states|Key Terminology|this topic/i.test(line)) {
          return line;
        }
      }
      if (
        !/according to|the report|this topic|source material|the text states|Key Terminology|Overview states|maps back to this topic|described in this topic|in this report|as described in/i.test(
          line
        )
      ) {
        return line;
      }
      // Transform only the string contents of the line
      return line.replace(/(['"`])((?:\\.|(?!\1).)*)\1/g, (full, q, inner) => {
        // skip path-like or short keys
        if (inner.length < 12) return full;
        if (/^[a-z0-9\-_/\\.]+$/i.test(inner)) return full;
        const cleaned = dehedge(inner.replace(/\\n/g, '\n')).replace(/\n/g, '\\n');
        // re-escape quotes used as delimiter if needed
        const esc =
          q === "'"
            ? cleaned.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
            : q === '"'
              ? cleaned.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
              : cleaned;
        return q + esc + q;
      });
    })
    .join('\n');

  if (src !== before) {
    fs.writeFileSync(fp, src, 'utf8');
    scriptHits++;
  }
}

// Residual scan
const residual = [];
const residualRe =
  /\b(according to (this topic|the report|the text|the source)|the report |this topic's report|source material|the text states|Key Terminology|Overview states|maps back to this topic|described in this topic|in this report)\b/i;

for (const dir of quizDirs) {
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir).filter((n) => n.endsWith('.json'))) {
    const fp = path.join(dir, name);
    const s = fs.readFileSync(fp, 'utf8');
    const lines = s.split('\n');
    lines.forEach((line, i) => {
      if (residualRe.test(line)) {
        residual.push(`${name}:${i + 1}: ${line.trim().slice(0, 160)}`);
      }
    });
  }
}

console.log(`Processed ${quizFiles} quiz files (${quizHits} updated).`);
console.log(`Patched ${scriptHits} install scripts.`);
if (residual.length) {
  console.log(`RESIDUAL hedges (${residual.length}):`);
  residual.forEach((r) => console.log(' ', r));
  process.exitCode = 1;
} else {
  console.log('PASS: no residual report/topic/source hedges in quiz JSON.');
}
