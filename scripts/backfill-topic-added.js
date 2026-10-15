/**
 * Idempotent backfill of `added` on every topic node in data/{source}-topics.json
 * that does not have one yet, from the time each dive/<source>/<id>.html was
 * FIRST committed to git (not last edited). Runs automatically at the start of
 * `npm run build`.
 *
 * New stamps are full ISO timestamps (git %cI, committer time with offset) so
 * same-day topics sort by time on the homepage. If the dive page is not
 * committed yet, the current local time is used. Existing values — including
 * legacy date-only "YYYY-MM-DD" ones — are never rewritten.
 *
 * Uses `git log --diff-filter=A` WITHOUT --follow: --follow's rename detection
 * matched brand-new near-identical stub pages to older files (e.g.
 * ascension/dna-strand, added 2026-10-14, reported as 2026-07-13).
 *
 * Never overwrites an existing `added` (so edits never move a date).
 * Run: node scripts/backfill-topic-added.js [--dry] [--build]
 *   --build: called from npm run build; on a shallow clone (CI) skip quietly
 *            instead of failing, and only print when something was stamped.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DRY = process.argv.includes('--dry');
const BUILD = process.argv.includes('--build');
const { localIsoTimestamp } = require('./lib/topic-added');

function git(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch (_) {
    return '';
  }
}

function firstAdded(rel) {
  return git(['log', '--diff-filter=A', '--format=%cI', '--', rel]).split('\n').filter(Boolean).pop() || '';
}

function walk(nodes, fn) {
  for (const n of nodes || []) {
    fn(n);
    if (n.subtopics?.length) walk(n.subtopics, fn);
  }
}

if (git(['rev-parse', '--is-shallow-repository']) === 'true') {
  if (BUILD) {
    console.log('backfill-topic-added: shallow clone, skipped (no topics stamped).');
    process.exit(0);
  }
  console.error('Shallow clone: first-commit dates would be wrong. Run `git fetch --unshallow` first.');
  process.exit(1);
}

const now = localIsoTimestamp();
const sources = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources.json'), 'utf8')).sources.map((s) => s.id);
for (const source of sources) {
  const file = path.join(ROOT, 'data', `${source}-topics.json`);
  if (!fs.existsSync(file)) continue;
  const tree = JSON.parse(fs.readFileSync(file, 'utf8'));
  let stamped = 0, kept = 0, fallback = 0;
  walk(tree.topics, (node) => {
    if (node.added) { kept++; return; }
    const d = firstAdded(`dive/${source}/${node.id}.html`);
    if (!d) fallback++;
    node.added = d || now;
    stamped++;
  });
  if (!DRY && stamped) fs.writeFileSync(file, JSON.stringify(tree, null, 2) + '\n', 'utf8');
  if (BUILD && !stamped) continue;
  console.log(`${source}: stamped ${stamped} (not committed yet, used now: ${fallback}), kept ${kept}`);
}
