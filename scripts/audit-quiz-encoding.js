/**
 * Audit quiz JSON files for mojibake / weird symbols.
 * Run: node scripts/audit-quiz-encoding.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const dir = path.join(ROOT, 'data', 'quizzes', 'alice');

// Common UTF-8-as-Windows-1252 mojibake sequences and odd controls
const SUSPICIOUS = [
  /\uFFFD/g, // replacement character
  /Ã./g,
  /Â./g,
  /â€./g,
  /â€™/g,
  /â€œ/g,
  /â€/g,
  /â€”/g,
  /â€“/g,
  /â€¢/g,
  /Ã©/g,
  /Ã /g,
  /ï¿½/g,
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,
];

// printable-ish: allow latin, general punctuation, quotes, dashes
function isSuspiciousChar(ch) {
  const cp = ch.codePointAt(0);
  if (cp === 0xfffd) return true;
  if (cp < 32 && cp !== 9 && cp !== 10 && cp !== 13) return true;
  // Private use / specials often indicate corruption
  if (cp >= 0xe000 && cp <= 0xf8ff) return true;
  // C1 controls (often mojibake leftovers)
  if (cp >= 0x80 && cp <= 0x9f) return true;
  return false;
}

function collectHits(str, pathLabel) {
  const hits = [];
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (isSuspiciousChar(ch)) {
      const start = Math.max(0, i - 24);
      const end = Math.min(str.length, i + 24);
      hits.push({
        path: pathLabel,
        char: ch,
        code: 'U+' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0'),
        ctx: str.slice(start, end),
      });
      if (hits.length >= 40) break;
    }
  }
  // multi-byte mojibake sequences still valid unicode letters
  for (const re of SUSPICIOUS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(str))) {
      const start = Math.max(0, m.index - 20);
      const end = Math.min(str.length, m.index + m[0].length + 20);
      hits.push({
        path: pathLabel,
        char: m[0],
        code: 'seq',
        ctx: str.slice(start, end),
      });
      if (hits.length >= 80) break;
    }
  }
  return hits;
}

function walk(obj, p, out) {
  if (typeof obj === 'string') {
    out.push(...collectHits(obj, p));
  } else if (Array.isArray(obj)) {
    obj.forEach((v, i) => walk(v, `${p}[${i}]`, out));
  } else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) walk(v, `${p}.${k}`, out);
  }
}

// Also print every non-ASCII character occurrence summary per file
function nonAsciiSummary(str) {
  const map = new Map();
  for (const ch of str) {
    const cp = ch.codePointAt(0);
    if (cp > 127) {
      const key = `U+${cp.toString(16).toUpperCase().padStart(4, '0')} ${ch}`;
      map.set(key, (map.get(key) || 0) + 1);
    }
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
for (const f of files) {
  const full = path.join(dir, f);
  const buf = fs.readFileSync(full);
  const text = buf.toString('utf8');
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.log(`\n=== ${f} PARSE ERROR ===`, e.message);
    continue;
  }
  const hits = [];
  walk(data, '$', hits);
  const summary = nonAsciiSummary(text);
  console.log(`\n=== ${f} ===`);
  console.log('non-ascii unique:', summary.length);
  console.log(summary.slice(0, 25).map(([k, n]) => `  ${n}x ${k}`).join('\n'));
  console.log('suspicious hits:', hits.length);
  hits.slice(0, 12).forEach((h) => {
    console.log(`  [${h.code}] ${JSON.stringify(h.char)} @ ${h.path}`);
    console.log(`    ${JSON.stringify(h.ctx)}`);
  });
}
