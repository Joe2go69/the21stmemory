const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'dive');

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, acc);
    else if (name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

let updated = 0;
for (const file of walk(root)) {
  let html = fs.readFileSync(file, 'utf8');
  const next = html
    .replace(
      'class="max-w-6xl mx-auto px-6 pt-8 pb-4"',
      'class="max-w-6xl mx-auto px-6 page-shell pb-4"'
    )
    .replace(
      'class="max-w-6xl mx-auto px-6 pt-8 pb-6"',
      'class="max-w-6xl mx-auto px-6 page-shell pb-6"'
    );
  if (next !== html) {
    fs.writeFileSync(file, next, 'utf8');
    updated++;
  }
}
console.log('dive spacing updated:', updated);
