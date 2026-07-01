/**
 * Backs up assets/css/main.css to main.monolith.css.
 * CSS splitting is disabled — line-based splits cut selectors mid-rule and break layouts.
 * Edit assets/css/main.css directly.
 */
const fs = require('fs');
const path = require('path');

const CSS_DIR = path.join(__dirname, '..', 'assets', 'css');
const MAIN = path.join(CSS_DIR, 'main.css');
const BACKUP = path.join(CSS_DIR, 'main.monolith.css');

const raw = fs.readFileSync(MAIN, 'utf8');

if (raw.trimStart().startsWith('@import') || raw.length < 1000) {
  console.error('main.css looks like an import-only stub or is empty.');
  console.error('Restore full CSS: git checkout HEAD -- assets/css/main.css');
  process.exit(1);
}

fs.writeFileSync(BACKUP, raw, 'utf8');
console.log(`Backed up main.css → ${path.relative(path.join(__dirname, '..'), BACKUP)}`);