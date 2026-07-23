/**
 * Deep audit: every quiz correct-answer claim vs its paired topic report.
 * Also flags title/topicId mismatches and missing topic files.
 *
 * Run: node scripts/audit-quiz-report-alignment.js
 *
 * Scoring (per question, correct option + rationale + question text):
 *   tokenRatio  = distinctive words found in report
 *   gramRatio   = 2–3 word phrases found in report
 *   score       = 0.55*tokenRatio + 0.45*gramRatio
 *   weak if score < 0.35
 *
 * Quiz status:
 *   PASS  weakRatio < 0.20
 *   WARN  0.20–0.39
 *   FAIL  >= 0.40  OR missing topic OR title mismatch with empty report
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SOURCES = ['alice', 'breakdown'];

const STOP = new Set(
  `that this with from they them their have been were when what which into also only than then over under about after before while would could should being other these those there where every through between without within because during against among such just like very more most some many much each both same true false correct answer option still even used using make made does did doing known called named primary specific exactly entirely completely directly actually according itself themselves ourselves himself herself something anything everything nothing always never often once again another around between across along toward towards upon onto inside outside against within without among several various certain certain possible probably perhaps almost rather quite itself themselves`.split(
    /\s+/
  )
);

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function stripMarkdown(md) {
  return String(md || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/^#+\s*/gm, '')
    .replace(/[*_~>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, '-')
    .replace(/[^a-z0-9%.'\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokens(s) {
  return normalize(s)
    .split(' ')
    .filter((t) => t.length >= 4 && !STOP.has(t) && !/^\d+$/.test(t));
}

function ngrams(words, n) {
  const out = [];
  for (let i = 0; i + n <= words.length; i++) {
    out.push(words.slice(i, i + n).join(' '));
  }
  return out;
}

function scoreClaim(claim, reportNorm, reportWordSet) {
  const words = tokens(claim);
  const grams = ngrams(words, 3).concat(ngrams(words, 2));
  let hit = 0;
  let tot = 0;
  const missingGrams = [];
  for (const g of grams) {
    const parts = g.split(' ');
    if (parts.every((w) => w.length < 5)) continue;
    tot++;
    if (reportNorm.includes(g)) hit++;
    else if (parts.length === 2) missingGrams.push(g);
  }
  const tw = words.filter((w) => w.length >= 5);
  const th = tw.filter((w) => reportWordSet.has(w) || reportNorm.includes(w)).length;
  const gramRatio = tot ? hit / tot : 0;
  const tokenRatio = tw.length ? th / tw.length : 0;
  const score = 0.55 * tokenRatio + 0.45 * gramRatio;
  return {
    score,
    tokenRatio,
    gramRatio,
    missingGrams: missingGrams.slice(0, 8),
  };
}

/** Pull distinctive multi-word / number markers from correct answers not in report */
function unsupportedMarkers(claim, reportNorm) {
  const claimN = normalize(claim);
  const markers =
    claimN.match(
      /\b(\d[\d,]*(?:\.\d+)?\s*(?:million|percent|%|seconds?|hours?|years?|days?|meters?|feet|tons?)|\d{3,}|\b[a-z]+-\d+\b)/gi
    ) || [];
  const bad = [];
  for (const m of markers) {
    const n = normalize(m);
    if (n.length < 3) continue;
    if (!reportNorm.includes(n) && !reportNorm.includes(n.replace(/,/g, ''))) {
      bad.push(m);
    }
  }
  return [...new Set(bad)].slice(0, 10);
}

function auditQuiz(src, quizPath) {
  const quiz = loadJson(quizPath);
  const tid = quiz.topicId || quiz.id;
  const topicPath = path.join(ROOT, 'data', `${src}-topics`, `${tid}.json`);
  if (!fs.existsSync(topicPath)) {
    return {
      src,
      id: tid,
      title: quiz.title,
      status: 'FAIL',
      error: `Missing topic file: ${path.relative(ROOT, topicPath)}`,
    };
  }
  const topic = loadJson(topicPath);
  const reportPlain = stripMarkdown(topic.report || '');
  const reportNorm = normalize(reportPlain);
  const reportWordSet = new Set(tokens(reportPlain));

  const weak = [];
  const strong = [];
  const markerIssues = [];
  let totalQ = 0;

  for (const q of quiz.questions || []) {
    totalQ++;
    const c = (q.options || []).find((o) => o.isCorrect) || {};
    const claim = `${q.question} ${c.text} ${c.rationale || ''}`;
    const sc = scoreClaim(claim, reportNorm, reportWordSet);
    const row = {
      n: q.number,
      score: +sc.score.toFixed(2),
      tokenRatio: +sc.tokenRatio.toFixed(2),
      gramRatio: +sc.gramRatio.toFixed(2),
      q: (q.question || '').slice(0, 120),
      a: (c.text || '').slice(0, 140),
      missingGrams: sc.missingGrams,
    };
    if (sc.score < 0.35) weak.push(row);
    else if (sc.score >= 0.55) strong.push(row);

    const badMarkers = unsupportedMarkers(claim, reportNorm);
    if (badMarkers.length) {
      markerIssues.push({ n: q.number, markers: badMarkers, a: row.a });
    }
  }

  const weakRatio = totalQ ? weak.length / totalQ : 1;
  const titleMismatch =
    normalize(quiz.title || '') !== normalize(quiz.topicTitle || quiz.title || '');
  const idTitleHint = normalize(tid.replace(/-/g, ' '));
  const titleLooksOff =
    idTitleHint.length > 3 &&
    !normalize(quiz.title || '').includes(idTitleHint.split(' ')[0]) &&
    !normalize(quiz.topicTitle || '').includes(idTitleHint.split(' ')[0]);

  let status = 'PASS';
  if (weakRatio >= 0.4 || !reportPlain.length) status = 'FAIL';
  else if (weakRatio >= 0.2 || markerIssues.length >= 8) status = 'WARN';

  return {
    src,
    id: tid,
    title: quiz.title,
    topicTitle: quiz.topicTitle,
    totalQ,
    reportChars: reportPlain.length,
    weakQ: weak.length,
    strongQ: strong.length,
    weakRatio: +weakRatio.toFixed(2),
    status,
    titleMismatch,
    titleLooksOff,
    weak: weak.slice(0, 10),
    markerIssues: markerIssues.slice(0, 12),
  };
}

const results = [];
for (const src of SOURCES) {
  const quizDir = path.join(ROOT, 'data', 'quizzes', src);
  if (!fs.existsSync(quizDir)) continue;
  for (const file of fs.readdirSync(quizDir).filter((f) => f.endsWith('.json')).sort()) {
    results.push(auditQuiz(src, path.join(quizDir, file)));
  }
}

results.sort((a, b) => {
  const order = { FAIL: 0, WARN: 1, PASS: 2 };
  return (order[a.status] ?? 9) - (order[b.status] ?? 9) || (b.weakRatio || 0) - (a.weakRatio || 0);
});

console.log('QUIZ ↔ TOPIC REPORT ALIGNMENT AUDIT\n');
console.log('Each quiz scored against data/[source]-topics/[topicId].json only.\n');

for (const r of results) {
  if (r.error) {
    console.log(`[FAIL] ${r.src}/${r.id} — ${r.error}`);
    continue;
  }
  console.log(
    `[${r.status}] ${r.src}/${r.id}  "${r.title}"  weak ${r.weakQ}/${r.totalQ} (${(r.weakRatio * 100).toFixed(0)}%)  strong~${r.strongQ}  reportChars=${r.reportChars}`
  );
  if (r.titleMismatch) console.log(`    titleMismatch: title="${r.title}" topicTitle="${r.topicTitle}"`);
  if (r.titleLooksOff) console.log(`    titleLooksOff vs topicId "${r.id}"`);
  if (r.weak.length && r.status !== 'PASS') {
    for (const w of r.weak.slice(0, 5)) {
      console.log(`    Q${w.n} score=${w.score} (tok=${w.tokenRatio} gram=${w.gramRatio}): ${w.q}`);
      console.log(`       → ${w.a}`);
      if (w.missingGrams?.length) {
        console.log(`       missing phrases: ${w.missingGrams.slice(0, 5).join(' | ')}`);
      }
    }
  }
  if (r.markerIssues.length && r.status !== 'PASS') {
    console.log(
      `    numeric/specific markers not in report: ${r.markerIssues
        .slice(0, 5)
        .map((m) => `Q${m.n}[${m.markers.join(',')}]`)
        .join('; ')}`
    );
  }
}

const pass = results.filter((r) => r.status === 'PASS').length;
const warn = results.filter((r) => r.status === 'WARN').length;
const fail = results.filter((r) => r.status === 'FAIL').length;
console.log(`\nSUMMARY: PASS=${pass}  WARN=${warn}  FAIL=${fail}  TOTAL=${results.length}`);

const outPath = path.join(ROOT, 'scripts', 'quiz-report-alignment-deep.json');
fs.writeFileSync(outPath, JSON.stringify(results, null, 2) + '\n');
console.log(`Wrote ${path.relative(ROOT, outPath)}`);

// Also emit a short markdown summary for humans
const md = [
  '# Quiz ↔ Topic Report Alignment',
  '',
  `Generated by \`scripts/audit-quiz-report-alignment.js\`.`,
  '',
  `| Status | Count |`,
  `| --- | ---: |`,
  `| PASS | ${pass} |`,
  `| WARN | ${warn} |`,
  `| FAIL | ${fail} |`,
  '',
  '## Failures & warnings',
  '',
];
for (const r of results.filter((x) => x.status !== 'PASS')) {
  md.push(`### [${r.status}] ${r.src}/${r.id} — ${r.title || ''}`);
  if (r.error) {
    md.push(`- ${r.error}`);
  } else {
    md.push(`- Weak questions: **${r.weakQ}/${r.totalQ}** (${(r.weakRatio * 100).toFixed(0)}%)`);
    md.push(`- Report length: ${r.reportChars} chars`);
    for (const w of (r.weak || []).slice(0, 5)) {
      md.push(`- Q${w.n} (score ${w.score}): ${w.q}`);
      md.push(`  - Correct: ${w.a}`);
    }
  }
  md.push('');
}
const mdPath = path.join(ROOT, 'scripts', 'quiz-report-alignment-summary.md');
fs.writeFileSync(mdPath, md.join('\n') + '\n');
console.log(`Wrote ${path.relative(ROOT, mdPath)}`);
