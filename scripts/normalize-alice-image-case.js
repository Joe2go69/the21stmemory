/**
 * Renames capitalized Alice image files to lowercase and updates data references.
 * Run: node scripts/normalize-alice-image-case.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const ALICE_DIR = path.join(ROOT, 'images', 'alice');

const RENAMES = [
  ['Amnesia.webp', 'amnesia.webp'],
  ['Amnesiapdf.webp', 'amnesiapdf.webp'],
  ['False.webp', 'false.webp'],
  ['Firmpdf.webp', 'firmpdf.webp'],
  ['Frequencypdf.webp', 'frequencypdf.webp'],
  ['Parasitepdf.webp', 'parasitepdf.webp'],
  ['Reptilian.webp', 'reptilian.webp'],
  ['Reptilianpdf.webp', 'reptilianpdf.webp'],
  ['Tartaria.webp', 'tartaria.webp'],
  ['Tartariapdf.webp', 'tartariapdf.webp']
];

function gitMvCaseOnly(fromName, toName) {
  const from = path.join(ALICE_DIR, fromName);
  const to = path.join(ALICE_DIR, toName);
  if (!fs.existsSync(from)) {
    if (fs.existsSync(to)) {
      console.log(`skip (already lowercase): ${toName}`);
      return;
    }
    throw new Error(`Missing source file: ${from}`);
  }
  if (fromName === toName) return;

  const temp = path.join(ALICE_DIR, `__case_tmp__${toName}`);
  execSync(`git mv "${from}" "${temp}"`, { cwd: ROOT, stdio: 'inherit' });
  execSync(`git mv "${temp}" "${to}"`, { cwd: ROOT, stdio: 'inherit' });
  console.log(`renamed: ${fromName} -> ${toName}`);
}

function updateDataFiles() {
  const targets = [
    path.join(ROOT, 'data', 'alice-topics-index.json'),
    path.join(ROOT, 'data', 'alice-topics.json'),
    ...fs.readdirSync(path.join(ROOT, 'data', 'alice-topics'))
      .filter(name => name.endsWith('.json'))
      .map(name => path.join(ROOT, 'data', 'alice-topics', name))
  ];

  for (const [fromName, toName] of RENAMES) {
    const fromPath = `images/alice/${fromName}`;
    const toPath = `images/alice/${toName}`;
    for (const filePath of targets) {
      let raw = fs.readFileSync(filePath, 'utf8');
      if (!raw.includes(fromPath)) continue;
      raw = raw.split(fromPath).join(toPath);
      fs.writeFileSync(filePath, raw, 'utf8');
      console.log(`updated refs: ${path.relative(ROOT, filePath)} (${fromName})`);
    }
  }
}

for (const [from, to] of RENAMES) {
  gitMvCaseOnly(from, to);
}

updateDataFiles();
console.log('Done. Run: node scripts/audit-topic-images.js');