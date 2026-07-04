/**
 * Renames image files to kebab-case and updates path references.
 * Run: node scripts/normalize-image-assets.js
 * Then: npm run build:data
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'images');

const MANUAL_TARGETS = {
  'nat of real.webp': 'nature-of-reality.webp',
  'sim real.webp': 'simulation-reality.webp',
  '3d overlay.webp': '3d-overlay.webp',
  '3d overlay pdf.webp': '3d-overlay-pdf.webp',
  'Nature of reality pdf preview.webp': 'nature-of-reality-pdf-preview.webp',
  'Ascension Event.webp': 'ascension-event.webp',
  'NPC Population.webp': 'npc-population.webp',
  'mud flood.webp': 'mud-flood.webp',
  'mud floodpdf.webp': 'mud-flood-pdf.webp',
  'free Energy.webp': 'free-energy.webp',
  'soul family.webp': 'soul-family.webp',
  'Star Seeds.webp': 'star-seeds.webp',
  'Spiritual Awakening.webp': 'spiritual-awakening.webp',
  'The 3 Strings of Attachment.webp': 'the-3-strings-of-attachment.webp',
  'Religion (False Gods).webp': 'religion-false-gods.webp',
  'Finance (Fake Money).webp': 'finance-fake-money.webp',
  'Perceived Knowledge (Lies).webp': 'perceived-knowledge-lies.webp'
};

function toKebabFilename(filename) {
  if (MANUAL_TARGETS[filename]) return MANUAL_TARGETS[filename];

  const ext = path.extname(filename);
  const base = filename.slice(0, -ext.length);
  return base
    .replace(/[()]/g, '')
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() + ext.toLowerCase();
}

function walkFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, files);
    else files.push(full);
  }
  return files;
}

function shouldScanFile(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  if (rel.startsWith('node_modules/')) return false;
  if (rel === 'assets/css/main.monolith.css') return false;
  return /\.(json|html|js|css|md)$/i.test(rel);
}

const imageFiles = walkFiles(IMAGES_DIR);
const renameMap = new Map();
const usedTargets = new Set();

for (const filePath of imageFiles) {
  const dir = path.dirname(filePath);
  const oldName = path.basename(filePath);
  let newName = toKebabFilename(oldName);
  if (newName === oldName) continue;

  while (usedTargets.has(path.join(dir, newName))) {
    const ext = path.extname(newName);
    const stem = path.basename(newName, ext);
    newName = `${stem}-2${ext}`;
  }

  const oldRel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  const newRel = path.relative(ROOT, path.join(dir, newName)).replace(/\\/g, '/');
  renameMap.set(oldRel, newRel);
  usedTargets.add(path.join(dir, newName));
}

let renamed = 0;
for (const [oldRel, newRel] of renameMap.entries()) {
  const oldAbs = path.join(ROOT, oldRel);
  const newAbs = path.join(ROOT, newRel);
  fs.mkdirSync(path.dirname(newAbs), { recursive: true });
  if (fs.existsSync(newAbs)) {
    console.warn(`Skip rename (exists): ${newRel}`);
    continue;
  }
  fs.renameSync(oldAbs, newAbs);
  renamed++;
  console.log(`${oldRel} → ${newRel}`);
}

const scanRoots = [ROOT];
let updatedFiles = 0;
let replacements = 0;

for (const scanRoot of scanRoots) {
  const queue = [scanRoot];
  while (queue.length) {
    const current = queue.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git') continue;
        queue.push(full);
        continue;
      }
      if (!shouldScanFile(full)) continue;

      let content = fs.readFileSync(full, 'utf8');
      let changed = false;
      for (const [oldRel, newRel] of renameMap.entries()) {
        if (!content.includes(oldRel)) continue;
        const parts = oldRel.split('/');
        const escaped = parts.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('/');
        const re = new RegExp(escaped, 'g');
        const count = (content.match(re) || []).length;
        if (count) {
          content = content.replace(re, newRel);
          replacements += count;
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(full, content, 'utf8');
        updatedFiles++;
      }
    }
  }
}

console.log(`\nRenamed ${renamed} image files`);
console.log(`Updated ${updatedFiles} files (${replacements} path replacements)`);
console.log('Next: npm run build:data');