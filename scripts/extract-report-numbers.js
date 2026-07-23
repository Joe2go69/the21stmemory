const fs = require('fs');
const path = require('path');
const ids = [
  'nature-of-reality',
  '3rd-density-overlays',
  'essence-of-the-transmission',
  '97-percent-population',
  '4000-ancients',
];
for (const id of ids) {
  const t = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'alice-topics', `${id}.json`), 'utf8')
  );
  const r = t.report || '';
  console.log(`\n==== ${id} ====`);
  const re = /[^.!?\n]{0,40}\d[^.!?\n]{0,120}/g;
  let m;
  const seen = new Set();
  while ((m = re.exec(r))) {
    const s = m[0].replace(/\s+/g, ' ').trim();
    if (seen.has(s)) continue;
    seen.add(s);
    console.log('-', s);
  }
}
