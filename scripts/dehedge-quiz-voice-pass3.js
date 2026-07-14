const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const fixes = [
  [
    path.join(ROOT, 'data', 'quizzes', 'alice', 'antiquity-technology.json'),
    "Consider the text's view on 'progress' as an inversion of true technology.",
    "Consider 'progress' as an inversion of true technology.",
  ],
  [
    path.join(ROOT, 'data', 'quizzes', 'alice', 'essence-of-the-transmission.json'),
    'That number is false; the text specifies a larger population of survivors.',
    'That number is false; the survivor population is larger.',
  ],
];

for (const [fp, a, b] of fixes) {
  let s = fs.readFileSync(fp, 'utf8');
  if (!s.includes(a)) {
    console.warn('not found in', path.basename(fp), a.slice(0, 60));
  } else {
    s = s.split(a).join(b);
    fs.writeFileSync(fp, s, 'utf8');
    console.log('fixed', path.basename(fp));
  }
}

const re =
  /\b(the text|the report|this topic|source material|according to the (report|text|source|topic)|maps back to this topic|Key Terminology|Overview states)\b/i;
let residual = 0;
for (const dir of [
  path.join(ROOT, 'data', 'quizzes', 'alice'),
  path.join(ROOT, 'data', 'quizzes', 'breakdown'),
]) {
  for (const name of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    fs.readFileSync(path.join(dir, name), 'utf8')
      .split('\n')
      .forEach((line, i) => {
        if (
          re.test(line) &&
          !/according to intention|according to the cycle/i.test(line)
        ) {
          residual++;
          console.log(name + ':' + (i + 1), line.trim().slice(0, 180));
        }
      });
  }
}
console.log(residual ? 'RESIDUAL ' + residual : 'PASS: clean');
process.exitCode = residual ? 1 : 0;
