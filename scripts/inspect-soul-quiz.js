const fs = require('fs');
const path = require('path');

const srcPath = 'G:/My Drive/CH21/Website Files/New Downloads/soul-quiz.json';
const oursPath = path.join(__dirname, '..', 'data', 'quizzes', 'alice', '97-percent-population.json');

const rawBuf = fs.readFileSync(srcPath);
console.log('src bytes', rawBuf.length);
console.log('src first 8 hex', [...rawBuf.slice(0, 8)].map((b) => b.toString(16).padStart(2, '0')).join(' '));

let src = JSON.parse(rawBuf.toString('utf8'));
src = Array.isArray(src) ? src[0] : src;
const ours = JSON.parse(fs.readFileSync(oursPath, 'utf8'));

console.log('src qs', src.questions.length, 'ours', ours.questions.length);

let diffs = 0;
for (let i = 0; i < src.questions.length; i++) {
  const a = JSON.stringify(src.questions[i]);
  const b = JSON.stringify(ours.questions[i]);
  if (a !== b) {
    diffs++;
    console.log('DIFF q', i + 1);
    for (let j = 0; j < Math.max(a.length, b.length); j++) {
      if (a[j] !== b[j]) {
        console.log(' at', j);
        console.log(' src ', a.slice(j, j + 60));
        console.log(' ours', b.slice(j, j + 60));
        break;
      }
    }
  }
}
console.log('total question diffs', diffs);

function charReport(label, str) {
  const map = new Map();
  for (const ch of str) {
    const cp = ch.codePointAt(0);
    if (cp > 127) {
      const key = `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
      map.set(key, (map.get(key) || 0) + 1);
    }
  }
  if (map.size) {
    console.log(label, [...map.entries()].map(([k, n]) => `${n}x ${k}`).join(', '));
  }
}

charReport('src non-ascii', JSON.stringify(src));
charReport('ours non-ascii', JSON.stringify(ours));

// Print all questions; highlight anything with non-ascii or question marks mid-word
src.questions.forEach((q, i) => {
  const parts = [
    q.question,
    q.hint || '',
    ...(q.options || []).flatMap((o) => [o.text, o.rationale]),
  ];
  const joined = parts.join('\n');
  const hasWeird =
    /[^\x09\x0A\x0D\x20-\x7E]/.test(joined) ||
    /\b\w+\?\w+\b/.test(joined) ||
    /\?{2,}/.test(joined) ||
    joined.includes('\uFFFD');

  console.log(`\n--- Q${i + 1}${hasWeird ? ' [FLAG]' : ''} ---`);
  console.log(q.question);
  (q.options || []).forEach((o) => {
    console.log(`  ${o.label}. ${o.text}`);
    if (hasWeird) console.log(`     rationale: ${o.rationale}`);
  });
  if (q.hint) console.log('  hint:', q.hint);
});

// Hex-dump any non-ascii runs from source file
const text = rawBuf.toString('utf8');
for (let i = 0; i < text.length; i++) {
  const cp = text.codePointAt(i);
  if (cp > 127) {
    const start = Math.max(0, i - 30);
    const end = Math.min(text.length, i + 30);
    console.log(
      `non-ascii @${i} U+${cp.toString(16)} ctx=${JSON.stringify(text.slice(start, end))}`
    );
    if (cp > 0xffff) i++; // skip low surrogate
  }
}
