const fs = require('fs');
const path = require('path');

function extractFooter(html) {
  const m = html.match(/<footer[\s\S]*?<\/footer>/i);
  return m ? m[0] : null;
}

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h;
}

function walkHtml(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walkHtml(p, acc);
    else if (name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const roots = ['.', 'quiz'];
const files = [];
for (const r of roots) {
  if (r === '.') {
    for (const name of fs.readdirSync('.')) {
      if (name.endsWith('.html')) files.push(name);
    }
  } else {
    walkHtml(r, files);
  }
}

const groups = new Map();
const markers = [
  'footer-support',
  'Support the Archive',
  'Voluntary contributions',
  'All content on this site is freely available',
  'Bitcoin',
  'Ko-fi',
  'GoFundMe',
  'No religion',
  'footer-donate-grid',
  'value all help',
];

for (const f of files.sort()) {
  const html = fs.readFileSync(f, 'utf8');
  const footer = extractFooter(html);
  if (!footer) {
    console.log('NO FOOTER', f);
    continue;
  }
  const h = hash(footer);
  if (!groups.has(h)) groups.set(h, { len: footer.length, files: [], sample: footer, marks: {} });
  const g = groups.get(h);
  g.files.push(f.replace(/\\/g, '/'));
  for (const m of markers) g.marks[m] = footer.includes(m);
}

console.log('Distinct footer variants:', groups.size);
let i = 0;
for (const [h, g] of groups) {
  i++;
  console.log('\n=== VARIANT', i, 'hash=' + h, 'len=' + g.len, 'count=' + g.files.length, '===');
  console.log('files:', g.files.join(', '));
  console.log(
    'markers:',
    Object.entries(g.marks)
      .map(([k, v]) => `${k}:${v ? 'Y' : 'N'}`)
      .join(' | ')
  );
  // show first 400 chars of support section if present
  const supportIdx = g.sample.indexOf('footer-support');
  if (supportIdx >= 0) {
    console.log('support snippet:', g.sample.slice(supportIdx, supportIdx + 350).replace(/\s+/g, ' '));
  } else {
    console.log('support snippet: (none)');
    console.log('footer head:', g.sample.slice(0, 300).replace(/\s+/g, ' '));
  }
}
