/**
 * Normalize quiz JSON text: strip LaTeX $...$ / ^{} artifacts for clean display.
 * Run: node scripts/fix-quiz-text.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'data', 'quizzes', 'alice');

function cleanLatex(str) {
  if (typeof str !== 'string') return str;
  let s = str;

  // Ordinals: $3^{rd}$ $9^{th}$ $1^{st}$ $2^{nd}$ $19^{th}$
  s = s.replace(/\$(\d+)\^\{(st|nd|rd|th)\}\$/gi, '$1$2');
  s = s.replace(/\$(\d+)\^(st|nd|rd|th)\$/gi, '$1$2');

  // Percent: $97\%$ $97\\%$ (after JSON parse the latter is $97\%$)
  s = s.replace(/\$(\d+(?:,\d+)*)\\?\%\$/g, '$1%');

  // Bare numbers / numbers with commas: $520$ $4,000$ $178,000$ $30$
  s = s.replace(/\$(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\$/g, '$1');

  // Acronyms / short tokens: $UHF$ $EMF$ $G.A.A$ $ULF$
  s = s.replace(/\$([A-Za-z][A-Za-z0-9./-]{0,24})\$/g, '$1');

  // Any remaining $...$ — strip dollars, flatten ^{x}
  s = s.replace(/\$([^$]+)\$/g, (_, inner) =>
    inner.replace(/\^\{([^}]+)\}/g, '$1').replace(/\\%/g, '%').replace(/\\/g, '')
  );

  // Leftover latex fragments outside dollars (rare)
  s = s.replace(/\^\{(st|nd|rd|th)\}/gi, '$1');
  s = s.replace(/\\%/g, '%');

  // Normalize fancy punctuation that can render as boxes on some systems
  s = s
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'") // smart single quotes
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"') // smart double quotes
    .replace(/[\u2013\u2014\u2015]/g, '—') // keep em dash style consistent
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ') // nbsp
    .replace(/\uFFFD/g, ''); // replacement char

  // Collapse accidental double spaces
  s = s.replace(/[ \t]{2,}/g, ' ');

  return s;
}

function walk(value) {
  if (typeof value === 'string') return cleanLatex(value);
  if (Array.isArray(value)) return value.map(walk);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = walk(v);
    return out;
  }
  return value;
}

function remainingLatex(str) {
  const hits = [];
  const re = /\$[^$]+\$|\^\{[^}]+\}|\\%/g;
  let m;
  while ((m = re.exec(str))) hits.push(m[0]);
  return hits;
}

let totalFixed = 0;
for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
  const full = path.join(DIR, file);
  const before = fs.readFileSync(full, 'utf8');
  const data = walk(JSON.parse(before));
  const after = JSON.stringify(data, null, 2) + '\n';
  const left = remainingLatex(after);
  const beforeHits = (before.match(/\$[^$]+\$/g) || []).length;
  const afterHits = (after.match(/\$[^$]+\$/g) || []).length;
  fs.writeFileSync(full, after, 'utf8');
  totalFixed += beforeHits - afterHits;
  console.log(
    `${file}: latex blocks ${beforeHits} → ${afterHits}` +
      (left.length ? ` remaining: ${[...new Set(left)].join(' | ')}` : ' (clean)')
  );
}

// Quick sample print from each file
console.log('\n--- samples after fix ---');
for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
  const data = JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8'));
  const q = data.questions.find((x) =>
    [x.question, ...(x.options || []).map((o) => o.text)].some((t) =>
      /\d(st|nd|rd|th)|UHF|ULF|EMF|97%|4,000|520/.test(t)
    )
  );
  if (q) {
    console.log(`\n${file} Q${q.number}: ${q.question}`);
    q.options.slice(0, 2).forEach((o) => console.log(`  ${o.label}) ${o.text}`));
  }
}

console.log(`\nDone. Removed ~${totalFixed} latex dollar-blocks.`);
