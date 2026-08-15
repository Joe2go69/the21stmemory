/**
 * Collapse padded True/False questions (4 "True — … / False — …" choices)
 * to real two-option True / False items across published quiz JSON.
 *
 * Run: node scripts/collapse-tf-quiz-options.js
 */
const fs = require('fs');
const path = require('path');
const {
  isTrueFalseQuestion,
  collapseTrueFalseOptions,
} = require('./quiz-option-utils');

const ROOT = path.join(__dirname, '..');
const QUIZZES = path.join(ROOT, 'data', 'quizzes');

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, acc);
    else if (name.endsWith('.json')) acc.push(full);
  }
  return acc;
}

let filesTouched = 0;
let questionsCollapsed = 0;

for (const file of walk(QUIZZES)) {
  const quiz = JSON.parse(fs.readFileSync(file, 'utf8'));
  let changed = false;
  for (const item of quiz.questions || []) {
    if (!isTrueFalseQuestion(item.question, item.options)) continue;
    if ((item.options || []).length === 2) {
      const texts = item.options.map((o) => String(o.text || '').trim());
      const alreadyBare = texts.every((t) => /^(true|false)$/i.test(t));
      if (alreadyBare) continue;
    }
    const collapsed = collapseTrueFalseOptions(item.options);
    item.options = collapsed.options;
    item.correctAnswer = collapsed.correctAnswer;
    changed = true;
    questionsCollapsed += 1;
  }
  if (changed) {
    fs.writeFileSync(file, JSON.stringify(quiz, null, 2) + '\n', 'utf8');
    filesTouched += 1;
    console.log('updated', path.relative(ROOT, file));
  }
}

console.log(
  `Collapsed ${questionsCollapsed} True/False question(s) in ${filesTouched} file(s)`
);
