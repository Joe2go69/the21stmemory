/**
 * Second pass: remove remaining "the text" meta-hedges and tidy voice.
 * Run: node scripts/dehedge-quiz-voice-pass2.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function dehedge2(s) {
  if (typeof s !== 'string') return s;
  let t = s;

  t = t.replace(
    /\bWhile these exist in the 3D realm, the text focuses on\b/gi,
    'While these exist in the 3D realm, the primary focus is'
  );
  t = t.replace(
    /\bWhile the matrix is code-based, the text specifies\b/gi,
    'While the matrix is code-based, the mechanism is'
  );
  t = t.replace(
    /\bWhile it appears solid, the text confirms it is\b/gi,
    'While it appears solid, it is'
  );
  t = t.replace(/\bThe text explicitly states that\b/gi, '');
  t = t.replace(/\bThe text explicitly states\b/gi, '');
  t = t.replace(/\bThe text confirms that\b/gi, '');
  t = t.replace(/\bThe text confirms\b/gi, '');
  t = t.replace(/\bThe text clarifies that\b/gi, '');
  t = t.replace(/\bThe text clarifies\b/gi, '');
  t = t.replace(/\bThe text suggests that\b/gi, '');
  t = t.replace(/\bThe text suggests\b/gi, '');
  t = t.replace(/\bThe text mentions\b/gi, '');
  t = t.replace(/\bThe text focuses on\b/gi, '');
  t = t.replace(/\bThe text describes\b/gi, '');
  t = t.replace(/\bThe text uses this specific term for\b/gi, 'The specific term for');
  t = t.replace(/\bThe text uses a more technical\b/gi, 'A more technical');
  t = t.replace(/\bThe text uses\b/gi, '');
  t = t.replace(/\bThe text lists this as\b/gi, 'This is');
  t = t.replace(/\bThe text lists\b/gi, '');
  t = t.replace(/\bThe text specifically identifies\b/gi, '');
  t = t.replace(
    /\bthat the text specifically aims to debunk\b/gi,
    'that Living Truth debunks'
  );
  t = t.replace(
    /\bthe text specifically aims to debunk\b/gi,
    'Living Truth debunks'
  );
  t = t.replace(
    /\bin the text's explanation of manifestation\b/gi,
    'in the explanation of manifestation'
  );
  t = t.replace(/\bdescribed in the text\b/gi, '');
  t = t.replace(/\bin the text\b/gi, '');
  t = t.replace(
    /\bNot where the population target is documented\b/gi,
    'Not where the population target is fixed'
  );
  t = t.replace(
    /\bThis number is not mentioned;\s*/gi,
    'That number is false; '
  );
  t = t.replace(
    /\ba larger population of survivors\./gi,
    'a larger population of survivors.'
  );
  t = t.replace(
    /\bnot in this Atmospheric Condensers report\b/gi,
    'not part of Atmospheric Condenser truth'
  );
  t = t.replace(/\bnot in this [A-Za-z0-9 \-]+ report\b/gi, 'false');
  t = t.replace(/\bRecall the overview of how\b/gi, 'Recall how');
  t = t.replace(
    /\bcommonly associated with resonators in the text\b/gi,
    'commonly associated with resonators'
  );
  t = t.replace(
    /\bThe term 'Aether' is equated to which modern concept in the explanation of manifestation\?/gi,
    "What modern concept is the term 'Aether' equated to in the explanation of manifestation?"
  );
  t = t.replace(
    /\bWhat was the primary goal of the '8th Re-set'\s*\?/gi,
    "What was the primary goal of the '8th Re-set'?"
  );
  t = t.replace(
    /\bWhat was the primary goal of the '8th Re-set' \?/gi,
    "What was the primary goal of the '8th Re-set'?"
  );

  // Capitalize common leftovers
  t = t.replace(/^(there is an NPC)/i, 'There is an NPC');
  t = t.replace(/^(materials like Radium)/i, 'Materials like Radium');
  t = t.replace(/^(sequences found)/i, 'Sequences found');
  t = t.replace(/^(copper as the material)/i, 'Copper is the material');
  t = t.replace(/^(a rapid, violent destruction)/i, 'It was a rapid, violent destruction');
  t = t.replace(
    /^(the energetic and structural nature)/i,
    'Focus is on the energetic and structural nature'
  );
  t = t.replace(
    /^(the replacement of boulevards)/i,
    'It describes the replacement of boulevards'
  );
  t = t.replace(/^(alchemy for wealth)/i, 'That describes alchemy for wealth');
  t = t.replace(/^(those who survive)/i, 'Those who survive');
  t = t.replace(/^(a 'Sol-system' is)/i, "A 'Sol-system' is");
  t = t.replace(/^(these beneficial scaffolds)/i, 'These beneficial scaffolds');
  t = t.replace(
    /^(while geometric, )/i,
    'While geometric, '
  );
  t = t.replace(
    /^(while highly conductive, )/i,
    'While highly conductive, '
  );
  t = t.replace(
    /^(while a network, )/i,
    'While a network, '
  );
  t = t.replace(
    /^(evidence relegated to basements)/i,
    'Evidence relegated to basements'
  );
  t = t.replace(
    /^(home utility and light)/i,
    'Focus is on home utility and light'
  );
  t = t.replace(
    /^(the Aether as the)/i,
    'The Aether is the'
  );
  t = t.replace(
    /^('frequency collapse' as the mechanism)/i,
    "'frequency collapse' is the mechanism"
  );
  t = t.replace(
    /^specifies a larger population of survivors\./i,
    'The survivor population is larger.'
  );
  t = t.replace(
    /^a larger population of survivors\./i,
    'The survivor population is larger.'
  );

  // Question capitalization
  t = t.replace(/^what is /i, 'What is ');
  t = t.replace(/^how is /i, 'How is ');
  t = t.replace(/^how are /i, 'How are ');
  t = t.replace(/^why is /i, 'Why is ');
  t = t.replace(/^where do /i, 'Where do ');
  t = t.replace(/^which /i, 'Which ');
  t = t.replace(/^true or false:/i, 'True or False:');

  t = t.replace(/\s{2,}/g, ' ').trim();
  t = t.replace(/\s+([?!.])/g, '$1');
  t = t.replace(/\s+\?/g, '?');
  return t;
}

function walk(v) {
  if (typeof v === 'string') return dehedge2(v);
  if (Array.isArray(v)) return v.map(walk);
  if (v && typeof v === 'object') {
    const o = {};
    for (const [k, val] of Object.entries(v)) o[k] = walk(val);
    return o;
  }
  return v;
}

const dirs = [
  path.join(ROOT, 'data', 'quizzes', 'alice'),
  path.join(ROOT, 'data', 'quizzes', 'breakdown'),
];

let n = 0;
for (const dir of dirs) {
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const fp = path.join(dir, f);
    const before = fs.readFileSync(fp, 'utf8');
    const after = JSON.stringify(walk(JSON.parse(before)), null, 2) + '\n';
    if (after !== before) {
      fs.writeFileSync(fp, after, 'utf8');
      n++;
      console.log('updated', f);
    }
  }
}
console.log('files updated', n);

const re =
  /\b(the text|the report|this topic|source material|according to the (report|text|source|topic)|maps back to this topic|Key Terminology|Overview states)\b/i;
let residual = 0;
for (const dir of dirs) {
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const lines = fs.readFileSync(path.join(dir, f), 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (
        re.test(line) &&
        !/according to intention|according to the cycle/i.test(line)
      ) {
        residual++;
        console.log(f + ':' + (i + 1), line.trim().slice(0, 180));
      }
    });
  }
}
if (residual) {
  console.log('RESIDUAL', residual);
  process.exitCode = 1;
} else {
  console.log('PASS: no residual document hedges');
}
