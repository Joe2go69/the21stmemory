/**
 * Remove redundant top section-pill banners from quiz pages.
 * Quiz content already has its own title card.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const quizRoot = path.join(ROOT, 'quiz');

const PILL_RE =
  /\s*<div class="section-pill-wrap full-bleed-divider mb-8">\s*<div class="section-pill-line"><\/div>\s*<div class="section-pill section-pill-lg">[\s\S]*?<\/div>\s*<div class="section-pill-line"><\/div>\s*<\/div>\s*/g;

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, acc);
    else if (name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

let updated = 0;
let skipped = 0;

for (const file of walk(quizRoot)) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('section-pill-wrap full-bleed-divider mb-8')) {
    skipped++;
    continue;
  }
  let next = html.replace(PILL_RE, '\n\n    ');
  next = next.replace(
    'class="max-w-6xl mx-auto px-6 pb-20 quiz-page"',
    'class="max-w-6xl mx-auto px-6 page-shell pb-20 quiz-page"'
  );
  next = next.replace(
    'class="max-w-6xl mx-auto px-6 pt-6 pb-20 quiz-page"',
    'class="max-w-6xl mx-auto px-6 page-shell pb-20 quiz-page"'
  );
  if (next !== html) {
    fs.writeFileSync(file, next, 'utf8');
    updated++;
  } else {
    skipped++;
  }
}

console.log(`strip-quiz-top-pills: ${updated} updated, ${skipped} skipped`);
