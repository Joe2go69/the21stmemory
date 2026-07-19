const fs = require('fs');
const path = require('path');

const checks = [];
function check(name, ok, detail = '') {
  checks.push({ name, ok: !!ok, detail });
}

const q = fs.readFileSync(path.join(__dirname, '..', 'quizzes.html'), 'utf8');
check('SEO title', q.includes('Living Truth Quizzes'));
check('theme-color', q.includes('theme-color'));
check('og-default', q.includes('og-default.webp'));
check('nav Quizzes', /href="quizzes\.html"[^>]*>Quizzes</.test(q));
check('filters', q.includes('data-quiz-filter'));
check('stats', q.includes('quiz-hub-stat__value'));
const cardCount = (q.match(/class="quiz-hub-card/g) || []).length;
check('99 cards', cardCount >= 99, String(cardCount));
check('footer Quizzes', q.includes('>Quizzes</a>') && q.includes('footer-link'));
check('quizzes.js', q.includes('assets/js/quizzes.js'));

const i = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
check('home quiz CTA', i.includes('href="quizzes.html"'));
check('index nav Quizzes', /href="quizzes\.html"[^>]*>Quizzes</.test(i));

const codex = fs.readFileSync(path.join(__dirname, '..', 'codex.html'), 'utf8');
check('codex quiz link', codex.includes('quizzes.html'));

const quizPage = fs.readFileSync(
  path.join(__dirname, '..', 'quiz', 'alice', 'nature-of-reality.html'),
  'utf8'
);
check('quiz nested nav Quizzes', quizPage.includes('../../quizzes.html'));
check('quiz nested footer Quizzes', /href="\.\.\/\.\.\/quizzes\.html"[^>]*>Quizzes</.test(quizPage));

const sm = fs.readFileSync(path.join(__dirname, '..', 'sitemap.xml'), 'utf8');
check('sitemap hub', sm.includes('/quizzes.html'));

const indexJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'quizzes-index.json'), 'utf8')
);
check('index total 99', indexJson.total === 99, String(indexJson.total));

let failed = 0;
for (const c of checks) {
  console.log(c.ok ? 'OK  ' : 'FAIL', c.name, c.detail || '');
  if (!c.ok) failed += 1;
}
console.log(failed ? `\n${failed} failed` : `\nAll ${checks.length} checks passed`);
process.exitCode = failed ? 1 : 0;
