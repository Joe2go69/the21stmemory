/**
 * Apply a quiz payload.
 *
 * Payload: scripts/payloads/{topicId}.quiz.js
 * Run:     node scripts/apply-quiz.js <source> <topicId>
 * Prefer:  node scripts/install.js quiz <source> <topicId>
 */
const path = require('path');
const { applyQuiz } = require('./lib/quiz-pipeline');

function main() {
  const source = process.argv[2];
  const topicId = process.argv[3];
  if (!source || !topicId) {
    console.error('Usage: node scripts/apply-quiz.js <source> <topicId>');
    process.exit(1);
  }

  const payloadPath = path.join(__dirname, 'payloads', `${topicId}.quiz.js`);
  let payload;
  try {
    payload = require(payloadPath);
  } catch (err) {
    throw new Error(`Missing payload ${payloadPath}: ${err.message}`);
  }

  if (payload.source && payload.source !== source) {
    throw new Error(`Payload source ${payload.source} != CLI ${source}`);
  }
  if (payload.id && payload.id !== topicId) {
    throw new Error(`Payload id ${payload.id} != CLI ${topicId}`);
  }

  payload.source = source;
  payload.id = topicId;
  applyQuiz(payload);
}

try {
  main();
} catch (err) {
  console.error(err);
  process.exit(1);
}
