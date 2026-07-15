/**
 * Strip stock length-padding filler from quiz wrong answers.
 *
 * Root cause: quiz-option-utils.expandWrong() appended stock tails to pad short
 * distractors, then hard-truncated mid-phrase when still over target length.
 * Result: thousands of options ending in "— a cover story…", "which collapses
 * once the inverted.", etc.
 *
 * Run: node scripts/strip-quiz-filler-tails.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const QUIZ_DIRS = [
  path.join(ROOT, 'data', 'quizzes', 'alice'),
  path.join(ROOT, 'data', 'quizzes', 'breakdown'),
];

/** Full tails as expandWrong originally appended (order: longer first). */
const FULL_TAIL_RES = [
  /,?\s*presented as if it were the natural or official account of events\.?/gi,
  /,?\s*which would leave the control matrix intact and the population asleep\.?/gi,
  /\s*[—–-]\s*a cover story that cannot survive contact with the deeper mechanics\.?/gi,
  /,?\s*treating the prison architecture as if it were ordinary progress or accident\.?/gi,
  /,?\s*as though the parasitic inversion had never engineered the outcome\.?/gi,
  /\s+and ignoring the deliberate design of the subjugation systems\.?/gi,
  /,?\s*which collapses once the inverted timeline and harvest architecture are seen\.?/gi,
];

/**
 * Truncated / partial endings of those same tails (after hard cut).
 * Use prefix-open patterns so any cut point of a known tail is stripped.
 */
const PARTIAL_TAIL_RES = [
  // presented as if it were the natural or official account of events
  /[,\s;]*presented as if(?:\s+\S+){0,12}\.?$/i,

  // which would leave the control matrix intact and the population asleep
  /[,\s;]*which would leave the(?:\s+\S+){0,10}\.?$/i,
  /[,\s;]*which would leave\.?$/i,

  // — a cover story that cannot survive contact with the deeper mechanics
  /\s*[—–-]?\s*a cover story(?:\s+\S+){0,12}\.?$/i,

  // treating the prison architecture as if it were ordinary progress or accident
  /[,\s;]*treating the prison architecture(?:\s+\S+){0,12}\.?$/i,
  /[,\s;]*treating the(?:\s+\S+){0,12}\.?$/i,

  // as though the parasitic inversion had never engineered the outcome
  /[,\s;]*as though the parasitic(?:\s+\S+){0,10}\.?$/i,
  /[,\s;]*as though the\.?$/i,

  // and ignoring the deliberate design of the subjugation systems
  /\s+and ignoring the(?:\s+\S+){0,10}\.?$/i,
  /\s+ignoring the deliberate(?:\s+\S+){0,8}\.?$/i,

  // which collapses once the inverted timeline and harvest architecture are seen
  /[,\s;]*which collapses once the(?:\s+\S+){0,10}\.?$/i,
  /[,\s;]*which collapses once\.?$/i,
  /[,\s;]*which collapses\.?$/i,
];

function stripFiller(text) {
  if (typeof text !== 'string' || !text.trim()) return text;
  let t = text.trim();
  let prev;
  let guard = 0;

  // Full tails may be stacked; loop until stable.
  do {
    prev = t;
    for (const re of FULL_TAIL_RES) {
      t = t.replace(re, '');
    }
    t = t.replace(/[ \t]{2,}/g, ' ').trim();
    guard++;
  } while (t !== prev && guard < 8);

  // Partial / truncated tails at the end.
  do {
    prev = t;
    for (const re of PARTIAL_TAIL_RES) {
      t = t.replace(re, '');
    }
    t = t.replace(/[ \t]{2,}/g, ' ').trim();
    guard++;
  } while (t !== prev && guard < 20);

  // Trailing joiners left after a strip: ", " " —" " and" etc.
  t = t
    .replace(/[\s,;:—–-]+$/g, '')
    .replace(/\s+and$/i, '')
    .replace(/\s+or$/i, '')
    .replace(/\s+with$/i, '')
    .replace(/\s+of$/i, '')
    .replace(/\s+the$/i, '')
    .replace(/\s+a$/i, '')
    .trim();

  // If we left a dangling clause start that is still a known filler opener
  t = t
    .replace(/,?\s*which collapses once the inverted timeline and harvest architecture are seen$/i, '')
    .replace(/,?\s*which would leave the control matrix intact and the population asleep$/i, '')
    .trim();

  // Restore terminal punctuation for multi-word answers that lost it.
  // Keep True/False and very short tokens without forcing a period.
  if (t.length > 12 && !/[.!?…]$/.test(t) && !/^(true|false)$/i.test(t)) {
    t += '.';
  }

  return t;
}

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  let changed = 0;
  const samples = [];

  for (const q of data.questions || []) {
    for (const o of q.options || []) {
      if (typeof o.text !== 'string') continue;
      const before = o.text;
      const after = stripFiller(before);
      if (after !== before) {
        changed++;
        if (samples.length < 3) {
          samples.push({
            q: q.number,
            label: o.label,
            before: before.slice(0, 120),
            after: after.slice(0, 120),
          });
        }
        o.text = after;
      }
    }
  }

  if (changed > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }
  return { changed, samples };
}

let totalChanged = 0;
const fileStats = [];

for (const dir of QUIZ_DIRS) {
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const full = path.join(dir, file);
    const { changed, samples } = processFile(full);
    if (changed) {
      totalChanged += changed;
      fileStats.push({ file, changed, samples });
    }
  }
}

fileStats.sort((a, b) => b.changed - a.changed);
console.log(`Stripped filler from ${totalChanged} option texts across ${fileStats.length} files.\n`);
for (const s of fileStats.slice(0, 8)) {
  console.log(`${s.file}: ${s.changed} options`);
  for (const ex of s.samples) {
    console.log(`  Q${ex.q} ${ex.label}`);
    console.log(`    before: ${ex.before}`);
    console.log(`    after:  ${ex.after}`);
  }
}

// Residual audit
const residualPhrases = [
  'cover story that cannot',
  'collapses once the inverted',
  'parasitic inversion had never',
  'natural or official account',
  'control matrix intact',
  'deliberate design of the subjugation',
  'prison architecture as if',
];
let residual = 0;
const residualSamples = [];
for (const dir of QUIZ_DIRS) {
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    for (const q of data.questions || []) {
      for (const o of q.options || []) {
        const t = o.text || '';
        for (const ph of residualPhrases) {
          if (t.includes(ph)) {
            residual++;
            if (residualSamples.length < 15) {
              residualSamples.push({ file, q: q.number, label: o.label, t: t.slice(0, 160) });
            }
            break;
          }
        }
        // incomplete endings
        if (/\b(and|the|of|once|never|had|were|with|for|to|a|an)\.?$/i.test(t.trim())) {
          residual++;
          if (residualSamples.length < 15) {
            residualSamples.push({
              file,
              q: q.number,
              label: o.label,
              t: `[END] ${t.slice(-80)}`,
            });
          }
        }
      }
    }
  }
}
console.log(`\nResidual filler/incomplete hits: ${residual}`);
if (residualSamples.length) {
  console.log('Samples:');
  residualSamples.forEach((r) => console.log(JSON.stringify(r)));
}
