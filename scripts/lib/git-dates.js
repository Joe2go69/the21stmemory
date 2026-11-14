/**
 * Real "last changed" dates from git history, so a rebuild never restamps
 * pages with the day the build happened to run.
 *
 *   lastChanged('data/alice-topics/foo.json')  -> 'YYYY-MM-DD'
 *
 * - Committed and clean: the date of the last commit that touched the file.
 * - New or edited but not committed yet (a local install): today.
 * - No git history (not a checkout, or a shallow CI clone): falls back to
 *   the file's mtime, then today. Commit builds from a full clone.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');

let commitDates = null; // Map<relPath, 'YYYY-MM-DD'>
let dirty = null; // Set<relPath>

function today() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
}

function load() {
  if (commitDates) return;
  commitDates = new Map();
  dirty = new Set();
  try {
    // A shallow clone (CI default) has no real history: use mtimes instead.
    if (git(['rev-parse', '--is-shallow-repository']).trim() === 'true') return;
    // Newest commit first; the first time a path appears is its last change.
    const out = git(['log', '--format=@%cs', '--name-only', '--no-renames', 'HEAD']);
    let current = '';
    for (const line of out.split('\n')) {
      if (line.startsWith('@')) {
        current = line.slice(1).trim();
      } else if (line && current && !commitDates.has(line)) {
        commitDates.set(line, current);
      }
    }
    const status = git(['status', '--porcelain', '--untracked-files=all']);
    for (const line of status.split('\n')) {
      if (!line.trim()) continue;
      const file = line.slice(3).replace(/^"|"$/g, '');
      dirty.add(file.includes(' -> ') ? file.split(' -> ')[1] : file);
    }
  } catch {
    // Not a git checkout: every lookup falls back to mtime.
  }
}

function toRel(file) {
  const abs = path.isAbsolute(file) ? file : path.join(ROOT, file);
  return path.relative(ROOT, abs).split(path.sep).join('/');
}

function lastChanged(file) {
  load();
  const rel = toRel(file);
  if (dirty.has(rel)) return today();
  if (commitDates.has(rel)) return commitDates.get(rel);
  const abs = path.join(ROOT, rel);
  if (fs.existsSync(abs)) return fs.statSync(abs).mtime.toISOString().slice(0, 10);
  return today();
}

/** Latest of several files' dates (missing files are ignored). */
function latestChanged(files) {
  const dates = files
    .filter((f) => fs.existsSync(path.isAbsolute(f) ? f : path.join(ROOT, f)))
    .map(lastChanged);
  return dates.length ? dates.sort().pop() : today();
}

module.exports = { lastChanged, latestChanged, today };
