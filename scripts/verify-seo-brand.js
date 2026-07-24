/** Quick SEO brand/domain verification for quiz + dive HTML. */
const fs = require('fs');
const path = require('path');

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, acc);
    else if (name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const sample = fs.readFileSync('quiz/alice/nature-of-reality.html', 'utf8');
const sampleDesc = (sample.match(/meta name="description" content="([^"]+)"/) || [])[1] || '';
console.log('sample desc:', sampleDesc);
console.log('has emdash:', sampleDesc.includes('\u2014'));

let badTitle = 0;
let badCanon = 0;
let badDesc = 0;
let total = 0;

for (const dir of ['quiz', 'dive']) {
  for (const f of walk(dir)) {
    total++;
    const h = fs.readFileSync(f, 'utf8');
    const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
    const desc = (h.match(/meta name="description" content="([^"]*)"/) || [])[1] || '';
    const can = (h.match(/rel="canonical" href="([^"]*)"/) || [])[1] || '';
    if (!/21st Memory/i.test(title)) badTitle++;
    if (!/21st Memory/i.test(desc)) badDesc++;
    if (!can.startsWith('https://21stmemory.com/')) badCanon++;
  }
}

console.log({ total, badTitle, badDesc, badCanon });
process.exitCode = badTitle || badDesc || badCanon ? 1 : 0;
