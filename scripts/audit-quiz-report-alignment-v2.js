/**
 * Flexible claim support audit: each quiz vs its topic report.
 * Handles case mismatches, hyphen variants, paraphrasing better than exact 3-grams.
 *
 * Run: node scripts/audit-quiz-report-alignment-v2.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/gateway\s*10/g, 'gateway-10')
    .replace(/re-?sets?/g, 'reset')
    .replace(/oopa'?s?/g, 'oopa')
    .replace(/[\u2013\u2014\u2015]/g, '-')
    .replace(/[^a-z0-9%.'\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripMarkdown(md) {
  return String(md || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/^#+\s*/gm, '')
    .replace(/[*_~>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const GENERIC = new Set(
  `the and for with that this from into have been were will would could should which their there about after before during between without within according because through people human humans entities physical reality simulation population knowledge history control energy frequency density advanced technology technological primary specific entirely completely directly actually something anything everything nothing always never often once again another around across along toward towards upon onto inside outside against among several various certain possible probably perhaps almost rather quite itself themselves correct answer option question false true nature system matrix realm world earth planet human being beings process function purpose result using used make made known called named`.split(
    /\s+/
  )
);

function atoms(text) {
  const n = normalize(text);
  const out = new Set();
  const w = n.split(' ').filter(Boolean);
  for (let len = 4; len >= 2; len--) {
    for (let i = 0; i + len <= w.length; i++) {
      const parts = w.slice(i, i + len);
      if (parts.every((p) => GENERIC.has(p) || p.length < 4)) continue;
      const g = parts.join(' ');
      if (g.length < 10) continue;
      out.add(g);
    }
  }
  const nums =
    n.match(
      /\b\d[\d,]*(?:\.\d+)?\s*(?:million|percent|%|seconds?|hours?|years?|days?|meters?|feet|tons?|bed)?\b/g
    ) || [];
  nums.forEach((x) => out.add(x.trim()));
  w.filter((x) => x.length >= 6 && !GENERIC.has(x)).forEach((x) => out.add(x));
  return [...out];
}

function inReport(atom, report) {
  if (report.includes(atom)) return true;
  if (report.includes(atom.replace(/-/g, ' '))) return true;
  if (report.includes(atom.replace(/ /g, '-'))) return true;
  // partial: all content words present nearby (loose)
  const parts = atom.split(' ').filter((p) => p.length >= 4 && !GENERIC.has(p));
  if (parts.length >= 2 && parts.every((p) => report.includes(p))) return true;
  return false;
}

function supportRatio(claim, report) {
  const a = atoms(claim);
  if (!a.length) return { ratio: 1, hit: 0, miss: [], total: 0 };
  let hit = 0;
  const miss = [];
  for (const x of a) {
    if (inReport(x, report)) hit++;
    else miss.push(x);
  }
  return { ratio: hit / a.length, hit, miss, total: a.length };
}

function resolveTopicPath(src, topicId) {
  const dir = path.join(ROOT, 'data', `${src}-topics`);
  const exact = path.join(dir, `${topicId}.json`);
  if (fs.existsSync(exact)) return exact;
  const lower = path.join(dir, `${String(topicId).toLowerCase()}.json`);
  if (fs.existsSync(lower)) return lower;
  const match = fs
    .readdirSync(dir)
    .find((f) => f.toLowerCase() === `${String(topicId).toLowerCase()}.json`);
  return match ? path.join(dir, match) : null;
}

const results = [];
for (const src of ['alice', 'breakdown']) {
  const qdir = path.join(ROOT, 'data', 'quizzes', src);
  if (!fs.existsSync(qdir)) continue;
  const seen = new Set();
  for (const f of fs.readdirSync(qdir).filter((x) => x.endsWith('.json')).sort()) {
    // Windows may list same file twice with different case — skip duplicates
    const key = f.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const quiz = JSON.parse(fs.readFileSync(path.join(qdir, f), 'utf8'));
    const tid = quiz.topicId || quiz.id;
    const tp = resolveTopicPath(src, tid);
    if (!tp) {
      results.push({
        src,
        file: f,
        id: tid,
        status: 'FAIL',
        error: 'missing topic file',
      });
      continue;
    }
    const topic = JSON.parse(fs.readFileSync(tp, 'utf8'));
    const report = normalize(stripMarkdown(topic.report || ''));
    const weakQs = [];
    let sum = 0;
    const qs = quiz.questions || [];
    for (const q of qs) {
      const c = (q.options || []).find((o) => o.isCorrect) || {};
      const claim = `${q.question} ${c.text} ${c.rationale || ''}`;
      const s = supportRatio(claim, report);
      sum += s.ratio;
      if (s.ratio < 0.22) {
        weakQs.push({
          n: q.number,
          ratio: +s.ratio.toFixed(2),
          miss: s.miss.slice(0, 6),
          q: (q.question || '').slice(0, 90),
          a: (c.text || '').slice(0, 110),
        });
      }
    }
    const avg = qs.length ? sum / qs.length : 0;
    const weakRatio = qs.length ? weakQs.length / qs.length : 1;
    let status = 'PASS';
    if (weakRatio >= 0.35 || avg < 0.25) status = 'FAIL';
    else if (weakRatio >= 0.18 || avg < 0.32) status = 'WARN';

    const titleOk =
      normalize(quiz.title || '') === normalize(quiz.topicTitle || quiz.title || '');
    const idSlug = normalize(String(topic.id || tid).replace(/-/g, ' '));
    const titleHasIdHint =
      !idSlug ||
      normalize(quiz.title || '').includes(idSlug.split(' ')[0]) ||
      normalize(quiz.topicTitle || '').includes(idSlug.split(' ')[0]);

    results.push({
      src,
      file: f,
      id: topic.id || tid,
      title: quiz.title,
      topicTitle: quiz.topicTitle,
      topicFile: path.relative(ROOT, tp),
      avg: +avg.toFixed(3),
      weakQ: weakQs.length,
      total: qs.length,
      weakRatio: +weakRatio.toFixed(2),
      status,
      titleOk,
      titleHasIdHint,
      idCaseMismatch: String(tid) !== String(topic.id),
      weakQs: weakQs.slice(0, 8),
      reportLen: (topic.report || '').length,
    });
  }
}

results.sort(
  (a, b) =>
    ({ FAIL: 0, WARN: 1, PASS: 2 }[a.status] - { FAIL: 0, WARN: 1, PASS: 2 }[b.status] ||
    b.weakRatio - a.weakRatio ||
    a.avg - b.avg)
);

console.log('QUIZ ↔ REPORT ALIGNMENT (v2 flexible support)\n');
for (const r of results) {
  if (r.error) {
    console.log(`[FAIL] ${r.src}/${r.file} — ${r.error}`);
    continue;
  }
  console.log(
    `[${r.status}] ${r.src}/${r.id}  avgSupport=${r.avg}  weak=${r.weakQ}/${r.total}  "${r.title}"`
  );
  if (r.idCaseMismatch) {
    console.log(`    idCaseMismatch: quiz topicId differs from topic file id`);
  }
  if (!r.titleOk) {
    console.log(`    title vs topicTitle mismatch: "${r.title}" / "${r.topicTitle}"`);
  }
  if (!r.titleHasIdHint) {
    console.log(`    title may not match topic id "${r.id}"`);
  }
  if (r.status !== 'PASS') {
    for (const w of r.weakQs) {
      console.log(`    Q${w.n} r=${w.ratio}: ${w.q}`);
      console.log(`       → ${w.a}`);
      if (w.miss?.length) console.log(`       miss: ${w.miss.slice(0, 4).join(' | ')}`);
    }
  }
}

const p = results.filter((r) => r.status === 'PASS').length;
const w = results.filter((r) => r.status === 'WARN').length;
const f = results.filter((r) => r.status === 'FAIL').length;
console.log(`\nSUMMARY: PASS=${p}  WARN=${w}  FAIL=${f}  TOTAL=${results.length}`);

const out = path.join(ROOT, 'scripts', 'quiz-report-alignment-v2.json');
fs.writeFileSync(out, JSON.stringify(results, null, 2) + '\n');
console.log('Wrote', path.relative(ROOT, out));

// Human summary md
const md = [
  '# Quiz report alignment (v2)',
  '',
  `PASS **${p}** · WARN **${w}** · FAIL **${f}** · TOTAL **${results.length}**`,
  '',
  'Method: each correct answer (question + option + rationale) is scored for support against `data/[source]-topics/[topicId].json` only. Flexible matching for hyphens/paraphrase.',
  '',
  '## Issues',
  '',
];
for (const r of results.filter((x) => x.status !== 'PASS' || x.idCaseMismatch || x.error)) {
  md.push(`### [${r.status}] ${r.src}/${r.id || r.file}`);
  if (r.error) md.push(`- ${r.error}`);
  else {
    md.push(`- avgSupport **${r.avg}**, weak **${r.weakQ}/${r.total}**`);
    if (r.idCaseMismatch) md.push(`- topicId case mismatch vs topic file`);
    for (const wq of (r.weakQs || []).slice(0, 5)) {
      md.push(`- Q${wq.n} (${wq.ratio}): ${wq.q}`);
    }
  }
  md.push('');
}
fs.writeFileSync(
  path.join(ROOT, 'scripts', 'quiz-report-alignment-v2-summary.md'),
  md.join('\n') + '\n'
);
console.log('Wrote scripts/quiz-report-alignment-v2-summary.md');
