/**
 * Sync site-footer on all quiz pages to match the current index.html footer,
 * with paths rewritten for quiz/{source}/ depth (../../).
 * Run: node scripts/sync-quiz-footers.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const footerMatch = indexHtml.match(/<footer class="site-footer">[\s\S]*?<\/footer>/);
if (!footerMatch) throw new Error('Could not extract footer from index.html');

const rootFooter = footerMatch[0];

// Prefix root-relative asset/page links for pages under quiz/{source}/
function toQuizFooter(footer) {
  let f = footer;
  // Page links
  f = f.replace(/href="codex\.html"/g, 'href="../../codex.html"');
  f = f.replace(/href="network\.html"/g, 'href="../../network.html"');
  f = f.replace(/href="index\.html/g, 'href="../../index.html');
  // Asset / image paths (root-relative only)
  f = f.replace(/src="assets\//g, 'src="../../assets/');
  f = f.replace(/src="images\//g, 'src="../../images/');
  return f;
}

const quizFooter = toQuizFooter(rootFooter);

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const quizFiles = walk(path.join(ROOT, 'quiz'));
let updated = 0;
for (const file of quizFiles) {
  const html = fs.readFileSync(file, 'utf8');
  if (!/<footer class="site-footer">[\s\S]*?<\/footer>/.test(html)) {
    console.warn('No site-footer in', path.relative(ROOT, file));
    continue;
  }
  const next = html.replace(
    /<footer class="site-footer">[\s\S]*?<\/footer>/,
    quizFooter
  );
  if (next !== html) {
    fs.writeFileSync(file, next, 'utf8');
    updated++;
    console.log('updated', path.relative(ROOT, file).replace(/\\/g, '/'));
  } else {
    console.log('unchanged', path.relative(ROOT, file).replace(/\\/g, '/'));
  }
}

// Spot-check markers
const sample = fs.readFileSync(
  path.join(ROOT, 'quiz', 'alice', 'nature-of-reality.html'),
  'utf8'
);
const checks = [
  'Everything here is free',
  'footer-social-grid',
  'YouTube',
  'TikTok',
  'Instagram',
  'Official Site',
  'footer-copyright',
  'data-copy-text=',
  'bc1qnwnapp…dc9ksx',
  'href="../../codex.html"',
  'src="../../assets/images/bitcoin-qr.webp"',
  'src="../../images/kofi.webp"',
];
console.log('\nSample nature-of-reality.html checks:');
for (const c of checks) {
  console.log(sample.includes(c) ? '  OK' : '  MISSING', c);
}
console.log(`\nDone: ${updated}/${quizFiles.length} quiz pages updated.`);
