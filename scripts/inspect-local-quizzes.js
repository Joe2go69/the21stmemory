const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'data', 'quizzes', 'alice');

function dumpFile(file) {
  const full = path.join(dir, file);
  const buf = fs.readFileSync(full);
  const text = buf.toString('utf8');
  const data = JSON.parse(text);

  console.log('\n########', file, 'bytes', buf.length);

  // Map every non-ascii
  const map = new Map();
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp > 127) {
      const k = `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
      map.set(k, (map.get(k) || 0) + 1);
    }
  }
  console.log('non-ascii:', [...map.entries()].map(([k, n]) => `${n}x ${k}`).join(', ') || '(none)');

  // Show contexts for non-ascii
  for (let i = 0; i < text.length; i++) {
    const cp = text.codePointAt(i);
    if (cp > 127) {
      console.log(
        `  @${i} U+${cp.toString(16)} ${JSON.stringify(text.slice(Math.max(0, i - 40), i + 40))}`
      );
      if (cp > 0xffff) i++;
    }
  }

  // Print all questions for human scan
  (data.questions || []).forEach((q) => {
    console.log(`\nQ${q.number}: ${q.question}`);
    (q.options || []).forEach((o) => {
      console.log(`  ${o.label}) ${o.text}`);
      console.log(`     (${o.rationale})`);
    });
    if (q.hint) console.log(`  HINT: ${q.hint}`);
  });
}

for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
  dumpFile(f);
}
