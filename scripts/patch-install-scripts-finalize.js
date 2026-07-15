/**
 * Patch install-*-quiz.js to use finalizeOptions (shuffle + length rebalance).
 * Run: node scripts/patch-install-scripts-finalize.js
 */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter((f) => /^install-.*-quiz\.js$/.test(f));

let patched = 0;
let skipped = 0;

for (const f of files) {
  const p = path.join(dir, f);
  let s = fs.readFileSync(p, 'utf8');
  if (s.includes('quiz-option-utils') || s.includes('finalizeOptions')) {
    skipped++;
    continue;
  }

  if (!/const path = require\(['"]path['"]\);/.test(s)) {
    console.log('skip (no path require):', f);
    skipped++;
    continue;
  }

  s = s.replace(
    /const path = require\(['"]path['"]\);/,
    "const path = require('path');\nconst { finalizeOptions } = require('./quiz-option-utils');"
  );

  const re =
    /const options = q\.options\.map\(\(o\) => \(\{[\s\S]*?\}\)\)\;\s*const correct = options\.find\(\(o\) => o\.isCorrect\);/;

  if (!re.test(s)) {
    console.log('skip (normalize pattern miss):', f);
    skipped++;
    continue;
  }

  s = s.replace(
    re,
    `const mapped = q.options.map((o) => ({
    label: o.label,
    text: cleanText(o.text),
    isCorrect: !!o.isCorrect,
    rationale: cleanText(o.rationale),
  }));
  const finalized = finalizeOptions(
    mapped,
    \`\${typeof TOPIC_ID !== 'undefined' ? TOPIC_ID : 'quiz'}::\${q.number}\`
  );
  const options = finalized.options;
  const correct = options.find((o) => o.isCorrect);`
  );

  // Drop rigid correctAnswer === label check (letter is reassigned by shuffle)
  s = s.replace(
    /if \(q\.correctAnswer !== correct\.label\) \{\s*throw new Error\([\s\S]*?\);\s*\}/,
    '/* correct letter assigned by finalizeOptions shuffle */'
  );

  s = s.replace(
    /correctAnswer: q\.correctAnswer/g,
    'correctAnswer: finalized.correctAnswer'
  );

  fs.writeFileSync(p, s, 'utf8');
  patched++;
  console.log('patched', f);
}

console.log(JSON.stringify({ patched, skipped, total: files.length }, null, 2));
