/**
 * Audit Alice quizzes against topic reports for structural quality + keyword coverage.
 * Run: node scripts/audit-quiz-topic-alignment.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const QUIZ_DIR = path.join(ROOT, 'data', 'quizzes', 'alice');
const TOPIC_DIR = path.join(ROOT, 'data', 'alice-topics');

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
    .replace(/[’']/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^a-z0-9%.'\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function structuralAudit(quiz) {
  const issues = [];
  const qs = quiz.questions || [];
  if (qs.length !== (quiz.totalQuestions || qs.length)) {
    issues.push({
      severity: 'warn',
      msg: `totalQuestions ${quiz.totalQuestions} != questions.length ${qs.length}`,
    });
  }
  const numbers = new Set();
  qs.forEach((q, i) => {
    const loc = `Q${q.number ?? i + 1}`;
    if (numbers.has(q.number)) issues.push({ severity: 'error', msg: `${loc} duplicate number` });
    numbers.add(q.number);
    if (!q.question || q.question.length < 12) {
      issues.push({ severity: 'error', msg: `${loc} missing/short question` });
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      issues.push({ severity: 'error', msg: `${loc} needs 2+ options` });
    }
    const corrects = (q.options || []).filter((o) => o.isCorrect);
    if (corrects.length !== 1) {
      issues.push({ severity: 'error', msg: `${loc} has ${corrects.length} correct options (need 1)` });
    }
    const byLabel = corrects[0];
    if (byLabel && q.correctAnswer && byLabel.label !== q.correctAnswer) {
      issues.push({
        severity: 'error',
        msg: `${loc} correctAnswer ${q.correctAnswer} != isCorrect label ${byLabel.label}`,
      });
    }
    (q.options || []).forEach((o) => {
      if (!o.label || !o.text) issues.push({ severity: 'error', msg: `${loc} option missing label/text` });
      if (!o.rationale || o.rationale.length < 8) {
        issues.push({ severity: 'warn', msg: `${loc}${o.label} short/missing rationale` });
      }
      // leftover latex
      const blob = `${o.text} ${o.rationale}`;
      if (/\$[^$]+\$|\^\{|\\%/.test(blob) || /\$[^$]+\$|\^\{|\\%/.test(q.question || '')) {
        issues.push({ severity: 'error', msg: `${loc} still has LaTeX-like markup` });
      }
    });
    if (!q.hint) issues.push({ severity: 'info', msg: `${loc} no hint` });
  });
  return issues;
}

/** Extract notable terms from report for coverage check */
function extractKeyTerms(reportText) {
  const text = normalize(reportText);
  // Multi-word and distinctive single terms from Alice corpus
  const candidates = [
    'gateway-10', 'gateway 10', 'firmament', 'projection dome', 'ice wall',
    '3rd density', '4th density', '9th density', '12th density',
    'overlay', 'overlays', 'sky-net-1', 'skynet', 'black void plasma',
    'npc', 'npcs', '97 percent', '97%', '520 million', 'replica soul',
    'amnesia vortex', 'loosh', 'adrenochrome', 'custodian', 'custodians',
    'anunnaki', 'grey', 'greys', 'draco', 'niberian',
    'galactic ancestral alliance', 'g.a.a', 'gaa',
    '4,000 ancients', '4000 ancients', '4 000 ancients', 'ancients',
    'star seed', 'starseed', 'taran', 'pleiadian', 'pleadian',
    'tartaria', 'tartarian', 'reset', 're-set', 'mud flood',
    'lattice membrane', 'ley line', 'ley lines', 'nodes',
    'emf', 'white flash', '30 second', '30-second', 'pixelation',
    'pineal', 'religion', 'finance', 'perceived knowledge',
    'three strings', '3 strings', 'sol-system', 'sol system',
    'holographic', 'simulation', 'density suppression', 'ulf',
    'orphan train', 'freemason', 'spirit tree', 'mt meru', 'hyperborea',
    'christian21', 'christian 21', 'micro sun', 'source creation',
  ];
  const present = [];
  for (const term of candidates) {
    if (text.includes(normalize(term))) present.push(term);
  }
  return present;
}

function termInQuiz(quiz, term) {
  const blob = normalize(
    [
      quiz.title,
      quiz.subtitle,
      ...(quiz.questions || []).flatMap((q) => [
        q.question,
        q.hint,
        ...(q.options || []).flatMap((o) => [o.text, o.rationale]),
      ]),
    ].join(' ')
  );
  return blob.includes(normalize(term));
}

function auditPair(quiz, topic) {
  const report = topic.report || '';
  const reportPlain = stripMarkdown(report);
  const reportNorm = normalize(reportPlain);
  const structural = structuralAudit(quiz);
  const reportTerms = extractKeyTerms(reportPlain);

  const covered = [];
  const missingFromQuiz = [];
  for (const term of reportTerms) {
    if (termInQuiz(quiz, term)) covered.push(term);
    else missingFromQuiz.push(term);
  }

  // Flag correct-answer claims that use distinctive phrases not in report
  const unsupportedClaims = [];
  for (const q of quiz.questions || []) {
    const correct = (q.options || []).find((o) => o.isCorrect) || {};
    const claim = normalize(`${q.question} ${correct.text} ${correct.rationale || ''}`);
    // Pull multi-word chunks that look specific (numbers + keywords)
    const markers = claim.match(
      /\b(\d[\d,]*(?:\.\d+)?\s*(?:million|percent|%|seconds?|hours?|years?|days?)|\d[\d,]{2,}|\b[a-z]+-\d+\b)/gi
    ) || [];
    for (const m of markers) {
      const n = normalize(m);
      if (n.length < 3) continue;
      if (!reportNorm.includes(n) && !reportNorm.includes(n.replace(/,/g, ''))) {
        // only flag if the full claim has low overlap
        unsupportedClaims.push({
          q: q.number,
          marker: m,
          answer: correct.text,
        });
      }
    }
  }

  // Off-topic heuristic: quiz title/topic vs question focus
  const topicTitle = normalize(topic.id + ' ' + (quiz.topicTitle || quiz.title || ''));
  const offTopicHints = [];
  // If this is a narrow topic, heavy use of unrelated major themes
  const foreignThemes = [
    { id: '97-percent', theme: 'firmament', weight: 'medium' },
    { id: '97-percent', theme: 'ice wall', weight: 'medium' },
    { id: '4000-ancients', theme: 'bitcoin', weight: 'high' },
  ];

  return {
    quizId: quiz.id,
    title: quiz.title,
    topicFile: topic.id,
    questionCount: (quiz.questions || []).length,
    reportChars: reportPlain.length,
    structural,
    reportTermCount: reportTerms.length,
    coveredTerms: covered,
    missingReportTermsInQuiz: missingFromQuiz,
    coverageRatio: reportTerms.length ? covered.length / reportTerms.length : 0,
    unsupportedNumericClaims: unsupportedClaims.slice(0, 20),
    sampleCorrectAnswers: (quiz.questions || []).slice(0, 5).map((q) => {
      const c = (q.options || []).find((o) => o.isCorrect);
      return { n: q.number, q: q.question, a: c?.text, why: c?.rationale };
    }),
  };
}

const results = [];
for (const file of fs.readdirSync(QUIZ_DIR).filter((f) => f.endsWith('.json')).sort()) {
  const quiz = loadJson(path.join(QUIZ_DIR, file));
  const topicPath = path.join(TOPIC_DIR, `${quiz.topicId || quiz.id}.json`);
  if (!fs.existsSync(topicPath)) {
    results.push({ quizId: quiz.id, error: `Missing topic file ${topicPath}` });
    continue;
  }
  const topic = loadJson(topicPath);
  results.push(auditPair(quiz, topic));
}

// Print human report
for (const r of results) {
  if (r.error) {
    console.log(`\n## ${r.quizId}\nERROR: ${r.error}`);
    continue;
  }
  console.log(`\n## ${r.title} (${r.quizId})`);
  console.log(`Questions: ${r.questionCount} | Report length: ${r.reportChars} chars`);
  console.log(`Term coverage: ${(r.coverageRatio * 100).toFixed(0)}% (${r.coveredTerms.length}/${r.reportTermCount})`);
  const errors = r.structural.filter((x) => x.severity === 'error');
  const warns = r.structural.filter((x) => x.severity === 'warn');
  console.log(`Structural: ${errors.length} errors, ${warns.length} warnings`);
  errors.forEach((e) => console.log(`  ERROR ${e.msg}`));
  warns.slice(0, 8).forEach((e) => console.log(`  WARN ${e.msg}`));
  if (r.missingReportTermsInQuiz.length) {
    console.log(`Report terms not in quiz (may be OK if niche): ${r.missingReportTermsInQuiz.slice(0, 15).join(', ')}`);
  }
  if (r.unsupportedNumericClaims.length) {
    console.log('Numeric/specific claims not found verbatim in report:');
    r.unsupportedNumericClaims.slice(0, 12).forEach((c) => {
      console.log(`  Q${c.q} marker="${c.marker}" answer="${c.answer}"`);
    });
  }
  console.log('Sample Qs:');
  r.sampleCorrectAnswers.forEach((s) => {
    console.log(`  Q${s.n}: ${s.q}`);
    console.log(`     → ${s.a}`);
  });
}

fs.writeFileSync(
  path.join(ROOT, 'scripts', 'quiz-topic-audit-report.json'),
  JSON.stringify(results, null, 2) + '\n'
);
console.log('\nWrote scripts/quiz-topic-audit-report.json');
