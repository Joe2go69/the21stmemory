/**
 * Add defer to local asset scripts under dive/ and quiz/.
 * Run: node scripts/defer-nested-scripts.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function walk(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, list);
    else if (entry.name.endsWith('.html')) list.push(full);
  }
  return list;
}

const re = /<script src="((?:\.\.\/)+assets\/js\/[^"]+\.js)"(?![^>]*\bdefer\b)><\/script>/g;

let updated = 0;
for (const file of [...walk(path.join(ROOT, 'dive')), ...walk(path.join(ROOT, 'quiz'))]) {
  const before = fs.readFileSync(file, 'utf8');
  const after = before.replace(re, '<script src="$1" defer></script>');
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    updated += 1;
  }
}
console.log(`Deferred scripts on ${updated} nested HTML files`);
