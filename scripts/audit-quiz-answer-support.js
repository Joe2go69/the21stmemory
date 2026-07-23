/**
 * Answer-only support audit (ignores question-stem phrasing noise).
 * Scores correct option text + rationale against the paired topic report.
 *
 * Run: node scripts/audit-quiz-answer-support.js
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
    .replace(/[\u2013\u2014\u2015]/g, '-')
    .replace(/[^a-z0-9%.\-\s]/g, ' ')
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

const STOP = new Set(
  `is are was were the and for with that this from into will would could should which their there about after before during between without within according because through using used make made been being have has had does did can may might must shall not only more most some many much each both same very just like also than then when what where who how why such into onto upon over under into them they you your our its it's a an or of to in on at by as if so no yes all any few`.split(
    /\s+/
  )
);

function keyClaims(text) {
  const n = normalize(text);
  const claims = [];
  const nums =
    n.match(
      /\b\d[\d,]*(?:\.\d+)?(?:\s*(?:million|percent|%|seconds?|hours?|years?|days?|meters?|feet|tons?|bed))?\b/g
    ) || [];
  nums.forEach((x) => claims.push(x.trim()));

  const phrases = n.match(/\b[a-z][a-z\-]+(?:\s+[a-z0-9][a-z0-9\-]*){1,3}\b/g) || [];
  for (const p of phrases) {
    const parts = p.split(' ');
    if (parts.every((x) => STOP.has(x) || x.length < 4)) continue;
    if (p.length >= 8) claims.push(p);
  }
  // distinctive singles
  n.split(' ')
    .filter((w) => w.length >= 7 && !STOP.has(w))
    .forEach((w) => claims.push(w));

  return [...new Set(claims)].slice(0, 50);
}

function supported(claim, report) {
  if (report.includes(claim)) return true;
  if (report.includes(claim.replace(/-/g, ' '))) return true;
  if (report.includes(claim.replace(/ /g, '-'))) return true;
  const parts = claim.split(' ').filter((w) => w.length >= 4 && !STOP.has(w));
  if (parts.length >= 2 && parts.every((w) => report.includes(w))) return true;
  if (parts.length === 1 && report.includes(parts[0])) return true;
  return false;
}

function resolveTopic(src, topicId) {
  const dir = path.join(ROOT, 'data', `${src}-topics`);
  const candidates = [
    path.join(dir, `${topicId}.json`),
    path.join(dir, `${String(topicId).toLowerCase()}.json`),
  ];
  for (const c of candidates) if (fs.existsSync(c)) return c;
  const match = fs
    .readdirSync(dir)
    .find((f) => f.toLowerCase() === `${String(topicId).toLowerCase()}.json`);
  return match ? path.join(dir, match) : null;
}

const all = [];
for (const src of ['alice', 'breakdown']) {
  const qdir = path.join(ROOT, 'data', 'quizzes', src);
  if (!fs.existsSync(qdir)) continue;
  const seen = new Set();
  for (const f of fs.readdirSync(qdir).filter((x) => x.endsWith('.json'))) {
    if (seen.has(f.toLowerCase())) continue;
    seen.add(f.toLowerCase());

    const quiz = JSON.parse(fs.readFileSync(path.join(qdir, f), 'utf8'));
    const tid = quiz.topicId || quiz.id;
    const tp = resolveTopic(src, tid);
    if (!tp) {
      all.push({ src, id: tid, status: 'FAIL', error: 'no topic file' });
      continue;
    }
    const topic = JSON.parse(fs.readFileSync(tp, 'utf8'));
    const report = normalize(stripMarkdown(topic.report || ''));
    const unsupportedQs = [];
    let totalClaims = 0;
    let hitClaims = 0;

    for (const q of quiz.questions || []) {
      const c = (q.options || []).find((o) => o.isCorrect) || {};
      const claims = keyClaims(`${c.text || ''} ${c.rationale || ''}`);
      let qHit = 0;
      let qTot = 0;
      const miss = [];
      for (const cl of claims) {
        qTot++;
        totalClaims++;
        if (supported(cl, report)) {
          qHit++;
          hitClaims++;
        } else miss.push(cl);
      }
      const ratio = qTot ? qHit / qTot : 1;
      if (ratio < 0.35 && miss.length) {
        unsupportedQs.push({
          n: q.number,
          ratio: +ratio.toFixed(2),
          miss: miss.slice(0, 6),
          a: (c.text || '').slice(0, 130),
        });
      }
    }

    const support = totalClaims ? hitClaims / totalClaims : 1;
    const weakRatio = unsupportedQs.length / Math.max((quiz.questions || []).length, 1);
    let status = 'PASS';
    if (weakRatio >= 0.4 || support < 0.4) status = 'FAIL';
    else if (weakRatio >= 0.2 || support < 0.55) status = 'WARN';

    all.push({
      src,
      id: topic.id,
      title: quiz.title,
      topicTitle: quiz.topicTitle,
      support: +support.toFixed(3),
      weakQ: unsupportedQs.length,
      total: (quiz.questions || []).length,
      status,
      unsupportedQs: unsupportedQs.slice(0, 8),
      idMismatch: String(quiz.topicId) !== String(topic.id),
      reportLen: (topic.report || '').length,
    });
  }
}

all.sort(
  (a, b) =>
    ({ FAIL: 0, WARN: 1, PASS: 2 }[a.status] -
      { FAIL: 0, WARN: 1, PASS: 2 }[b.status] ||
    a.support - b.support)
);

console.log('ANSWER-ONLY QUIZ ↔ REPORT SUPPORT AUDIT\n');
console.log('(Correct option text + rationale only; topic report is sole source of truth)\n');

for (const r of all) {
  if (r.error) {
    console.log(`[FAIL] ${r.src}/${r.id} — ${r.error}`);
    continue;
  }
  console.log(
    `[${r.status}] ${r.src}/${r.id}  answerSupport=${r.support}  weakQs=${r.weakQ}/${r.total}${
      r.idMismatch ? '  [topicId case mismatch]' : ''
    }`
  );
  if (r.status !== 'PASS') {
    for (const u of r.unsupportedQs) {
      console.log(`    Q${u.n} r=${u.ratio}: ${u.a}`);
      console.log(`       miss: ${u.miss.join(' | ')}`);
    }
  }
}

const p = all.filter((x) => x.status === 'PASS').length;
const w = all.filter((x) => x.status === 'WARN').length;
const f = all.filter((x) => x.status === 'FAIL').length;
console.log(`\nSUMMARY: PASS=${p}  WARN=${w}  FAIL=${f}  TOTAL=${all.length}`);

fs.writeFileSync(
  path.join(ROOT, 'scripts', 'quiz-report-alignment-final.json'),
  JSON.stringify(all, null, 2) + '\n'
);
console.log('Wrote scripts/quiz-report-alignment-final.json');

// Manual cross-check: any quiz whose title clearly doesn't match topic id words
console.log('\n--- Title / topicId sanity ---');
for (const r of all) {
  if (r.error) continue;
  const idWords = String(r.id)
    .toLowerCase()
    .split(/-/)
    .filter((w) => w.length > 2 && !['the', 'and', 'of', 'as'].includes(w));
  const title = normalize(r.title || '');
  const hits = idWords.filter((w) => title.includes(w) || title.includes(w.replace(/s$/, '')));
  if (hits.length === 0 && idWords.length) {
    console.log(`  ? ${r.src}/${r.id} title="${r.title}" has no id-word overlap`);
  }
}
