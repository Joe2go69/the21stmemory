/**
 * One-time (idempotent) backfill of `added: YYYY-MM-DD` on every topic node in
 * data/{source}-topics.json, from the date each dive/<source>/<id>.html was
 * FIRST committed to git (not last edited).
 *
 * Uses `git log --diff-filter=A` WITHOUT --follow: --follow's rename detection
 * matched brand-new near-identical stub pages to older files (e.g.
 * ascension/dna-strand, added 2026-10-14, reported as 2026-07-13).
 * Falls back to the series data file's first-commit date, then today.
 *
 * Never overwrites an existing `added` (so edits never move a date).
 * Run: node scripts/backfill-topic-added.js [--dry]
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DRY = process.argv.includes('--dry');

function git(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch (_) {
    return '';
  }
}

function firstAdded(rel) {
  return git(['log', '--diff-filter=A', '--format=%cs', '--', rel]).split('\n').filter(Boolean).pop() || '';
}

function walk(nodes, fn) {
  for (const n of nodes || []) {
    fn(n);
    if (n.subtopics?.length) walk(n.subtopics, fn);
  }
}

if (git(['rev-parse', '--is-shallow-repository']) === 'true') {
  console.error('Shallow clone: first-commit dates would be wrong. Run `git fetch --unshallow` first.');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const sources = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources.json'), 'utf8')).sources.map((s) => s.id);
for (const source of sources) {
  const file = path.join(ROOT, 'data', `${source}-topics.json`);
  if (!fs.existsSync(file)) continue;
  const tree = JSON.parse(fs.readFileSync(file, 'utf8'));
  const seriesDate = firstAdded(`data/${source}-topics.json`) || today;
  let stamped = 0, kept = 0, fallback = 0;
  walk(tree.topics, (node) => {
    if (node.added) { kept++; return; }
    const d = firstAdded(`dive/${source}/${node.id}.html`);
    if (!d) fallback++;
    node.added = d || seriesDate;
    stamped++;
  });
  if (!DRY) fs.writeFileSync(file, JSON.stringify(tree, null, 2) + '\n', 'utf8');
  console.log(`${source}: stamped ${stamped} (fallback ${fallback}), kept ${kept}`);
}
