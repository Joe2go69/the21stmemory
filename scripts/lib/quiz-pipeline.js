/**
 * Shared quiz install pipeline.
 * Used by scripts/apply-quiz.js. Do not copy into per-topic install scripts.
 */
const fs = require('fs');
const path = require('path');
const { finalizeOptions } = require('../quiz-option-utils');
const { rebalanceQuizFile } = require('../rebalance-quiz-length');

const ROOT = path.join(__dirname, '..', '..');

const latexRe = /\$[^$]+\$|\\\(|\\\[|\\\]|\\\)|\^\{|_\{|\\frac|MathJax|\\\w+\{/;

function cleanText(s) {
  let t = String(s || '');
  t = t.replace(/\$(\d+)\^\{(st|nd|rd|th)\}\$/gi, '$1$2');
  t = t.replace(/\$(\d+)\^(st|nd|rd|th)\$/gi, '$1$2');
  t = t.replace(/\$3\\text\{D\}\$/g, '3D');
  t = t.replace(/\$3\\mathrm\{D\}\$/g, '3D');
  t = t.replace(/\$3D\$/g, '3D');
  t = t.replace(/\$(\d+(?:\.\d+)?)\$/g, '$1');
  t = t.replace(/\$(\d+)%\$/g, '$1%');
  t = t.replace(/\$([A-Za-z][A-Za-z0-9./-]{0,24})\$/g, '$1');
  t = t.replace(/\$([^$]+)\$/g, (_, inner) =>
    inner
      .replace(/\^\{([^}]+)\}/g, '$1')
      .replace(/\\text\{([^}]*)\}/g, '$1')
      .replace(/\\mathrm\{([^}]*)\}/g, '$1')
      .replace(/\\%/g, '%')
      .replace(/\\[a-zA-Z]+/g, '')
      .replace(/[{}]/g, '')
  );
  t = t.replace(/\^\{(st|nd|rd|th)\}/gi, '$1');
  t = t.replace(/\\\(|\\\)|\\\[|\\\]/g, '');
  t = t.replace(/\\%/g, '%');
  t = t
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, '—')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ');
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

function absoluteVoice(s) {
  let t = String(s || '');
  const rewrites = [
    [/^According to the (core revelations|source|report|text|revelations|material|detailed mechanics|journal|living truth),?\s*/i, ''],
    [/^According to the report,?\s*/i, ''],
    [/^According to the text,?\s*/i, ''],
    [/^According to the material,?\s*/i, ''],
    [/\baccording to the (report|source|text|core revelations|revelations|material|journal|living truth)\b/gi, ''],
    [/^The source states that\s+/i, ''],
    [/^The source material specifies that\s+/i, ''],
    [/^The source material (identifies|states|explicitly states|specifically lists) that\s+/i, ''],
    [/^The source material (identifies|states|explicitly states|specifically lists)\s+/i, ''],
    [/^The source explains that\s+/i, ''],
    [/^The source explains\s+/i, ''],
    [/^The source specifies that\s+/i, ''],
    [/^The text states that\s+/i, ''],
    [/^The text describes\s+/i, ''],
    [/^The material states that\s+/i, ''],
    [/^The material describes them as\s+/i, 'They are '],
    [/^The material describes\s+/i, ''],
    [/\bthe text describes them as\b/gi, 'they are'],
    [/\bthe text describes\b/gi, ''],
    [/\bthe text states\b/gi, ''],
    [/\bthe text emphasizes\b/gi, ''],
    [/\bthe text uses\b/gi, ''],
    [/\bthe source material specifies that\b/gi, ''],
    [/\bthe source material (identifies|states|explicitly states|specifically lists) that\b/gi, ''],
    [/\bthe source material (identifies|states|explicitly states|specifically lists)\b/gi, ''],
    [/\bthe source specifies that\b/gi, ''],
    [/\bthe source explains that\b/gi, ''],
    [/\bthe source explains\b/gi, ''],
    [/\bthe material describes them as\b/gi, 'they are'],
    [/\bthe material describes\b/gi, ''],
    [/\bis described as\b/gi, 'is'],
    [/\bare described as\b/gi, 'are'],
    [/\bis identified as\b/gi, 'is'],
    [/\bare identified as\b/gi, 'are']
  ];
  for (const [re, rep] of rewrites) t = t.replace(re, rep);
  t = t.replace(/^\s*([a-z])/, (_, c) => c.toUpperCase());
  t = t.replace(/\s+/g, ' ').trim();
  t = t.replace(/\s+([.,;:])/g, '$1');
  return t;
}

function collectImageFields(topics, out = []) {
  for (const t of topics) {
    for (const key of ['topic_image', 'infographic_image', 'pdf_preview_image']) {
      if (t[key]) out.push({ id: t.id, key, path: t[key] });
    }
    if (t.subtopics) collectImageFields(t.subtopics, out);
  }
  return out;
}

function renderQuizHtml({ source, topicId, title, topicImage, seoDesc }) {
  const templatePath = path.join(ROOT, 'quiz', '_template.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error('Missing quiz/_template.html');
  }
  return fs
    .readFileSync(templatePath, 'utf8')
    .replace(/__TOPIC_TITLE__/g, title)
    .replace(/__SOURCE__/g, source)
    .replace(/__TOPIC_ID__/g, topicId)
    .replace(/__TOPIC_IMAGE__/g, topicImage)
    .replace(/__SEO_DESC__/g, seoDesc);
}

function reportHits(reportLower, text) {
  const words = String(text || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2);
  const hits = [];
  for (let n = 6; n >= 3; n--) {
    for (let i = 0; i + n <= words.length; i++) {
      const phrase = words.slice(i, i + n).join(' ');
      if (phrase.length >= 12 && reportLower.includes(phrase)) hits.push(phrase);
    }
    if (hits.length) return hits;
  }
  return hits;
}

function assertGrounded(n, correct, reportLower, supportPhrases) {
  const blob = `${correct.text || ''} ${correct.rationale || ''}`;
  const blobLower = blob.toLowerCase();
  const provided = (supportPhrases || []).map((p) => String(p || '').trim()).filter(Boolean);
  if (provided.length) {
    const inReport = provided.filter((p) => reportLower.includes(p.toLowerCase()));
    if (!inReport.length) {
      throw new Error(`Q${n} support phrases not found in report: ${provided.join(', ')}`);
    }
    const inCorrect = inReport.filter((p) => blobLower.includes(p.toLowerCase()));
    if (!inCorrect.length) {
      throw new Error(`Q${n} correct option not grounded in support phrases`);
    }
    return inCorrect;
  }
  const hits = reportHits(reportLower, blob);
  if (!hits.length) {
    throw new Error(`Q${n} correct answer is not grounded in the topic report`);
  }
  return hits;
}

function applyQuiz(payload) {
  const source = payload.source;
  const topicId = payload.id;
  const title = payload.title;
  if (!source || !topicId || !title) {
    throw new Error('Payload needs source, id, title');
  }
  if (!['alice', 'breakdown'].includes(source)) {
    throw new Error(`Unknown source: ${source}`);
  }

  const topicPath = path.join(ROOT, 'data', `${source}-topics`, `${topicId}.json`);
  const topic = JSON.parse(fs.readFileSync(topicPath, 'utf8'));
  const report = topic.report || '';
  const reportLower = report.toLowerCase();
  const topicImage =
    payload.topicImage ||
    `images/${source}/${topicId}.webp`;

  const questionsIn = payload.questions || [];
  if (questionsIn.length !== 25) {
    throw new Error(`Expected 25 questions, got ${questionsIn.length}`);
  }

  const questions = [];

  for (const q of questionsIn) {
    const n = q.number;
    const opts = q.options || [];
    const isTF = /^\s*true\s+or\s+false\b/i.test(q.question);
    const tfByOptions =
      opts.length >= 2 &&
      opts.every((o) => /^(true|false)(\s*[—–\-:].*)?$/i.test(String(o.text || '').trim()));
    const expect = isTF || tfByOptions ? 2 : 4;
    if (opts.length !== expect) {
      throw new Error(`Q${n}: expected ${expect} options, got ${opts.length}`);
    }

    const correct = opts.find((o) => o.isCorrect) || opts[0];
    assertGrounded(n, correct, reportLower, payload.supportPhrases && payload.supportPhrases[n]);

    const rawOptions = opts.map((o, i) => ({
      label: ['A', 'B', 'C', 'D'][i],
      text: cleanText(o.text),
      isCorrect: o.isCorrect != null ? !!o.isCorrect : i === 0,
      rationale: absoluteVoice(cleanText(o.rationale))
    }));
    if (rawOptions.filter((o) => o.isCorrect).length !== 1) {
      throw new Error(`Q${n}: need exactly 1 correct option`);
    }

    for (const o of rawOptions) {
      if (latexRe.test(o.text) || latexRe.test(o.rationale)) {
        throw new Error(`LaTeX residue in Q${n}: ${o.text}`);
      }
      if (
        /according to the (report|text|source|journal|material)/i.test(o.rationale) ||
        /according to the (report|text|source|journal|material)/i.test(o.text) ||
        /source material/i.test(o.rationale) ||
        /the source explains/i.test(o.rationale)
      ) {
        throw new Error(`Non-absolute voice in Q${n}: ${o.rationale || o.text}`);
      }
    }

    const qText = cleanText(q.question);
    const hText = cleanText(q.hint || '');
    if (latexRe.test(qText) || latexRe.test(hText)) {
      throw new Error(`LaTeX in Q${n} question/hint`);
    }
    if (/according to the (report|text|source|journal|material)/i.test(qText)) {
      throw new Error(`Non-absolute voice in Q${n} stem: ${qText}`);
    }

    const { options, correctAnswer } = finalizeOptions(
      rawOptions,
      `${topicId}-${n}`,
      qText
    );
    questions.push({ number: n, question: qText, options, hint: hText, correctAnswer });
  }

  const quizDesc =
    payload.description ||
    `Test your understanding of ${title}.`;
  const seoDesc =
    payload.seoDescription ||
    `Interactive Living Truth Quiz on ${title}.`;
  const reflection = payload.reflection || {
    title: 'Reflection',
    body: `Return to the ${title} deep-dive, infographic, and video transmissions.`
  };

  const quiz = {
    id: topicId,
    topicId,
    sourceId: source,
    topicTitle: title,
    title,
    subtitle: quizDesc,
    totalQuestions: 25,
    extractedAt: payload.extractedAt || new Date().toISOString(),
    reflection,
    relatedTopic: {
      href: `/deep-dive.html?source=${source}&topic=${topicId}`,
      label: `Return to ${title} deep-dive`
    },
    questions
  };

  const quizDir = path.join(ROOT, 'data', 'quizzes', source);
  fs.mkdirSync(quizDir, { recursive: true });
  const quizJsonPath = path.join(quizDir, `${topicId}.json`);
  fs.writeFileSync(quizJsonPath, JSON.stringify(quiz, null, 2) + '\n', 'utf8');
  const rebalanced = rebalanceQuizFile(quizJsonPath);
  const letterCounts = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of rebalanced.quiz.questions || []) {
    if (q.correctAnswer) letterCounts[q.correctAnswer] = (letterCounts[q.correctAnswer] || 0) + 1;
  }
  const usedLetters = Object.entries(letterCounts).filter(([, c]) => c > 0).length;
  if (usedLetters < 3) {
    throw new Error(`Correct answers not mixed enough: ${JSON.stringify(letterCounts)}`);
  }
  const maxLetter = Math.max(...Object.values(letterCounts));
  if (maxLetter >= 15) {
    throw new Error(`One letter dominates (${JSON.stringify(letterCounts)}); reseed needed`);
  }

  const quizMeta = {
    href: `quiz/${source}/${topicId}.html`,
    title,
    totalQuestions: 25,
    description: quizDesc
  };
  topic.quiz = quizMeta;
  fs.writeFileSync(topicPath, JSON.stringify(topic, null, 2) + '\n', 'utf8');

  const monoPath = path.join(ROOT, 'data', `${source}-topics.json`);
  const mono = JSON.parse(fs.readFileSync(monoPath, 'utf8'));
  const beforeOthers = collectImageFields(mono.topics)
    .filter((e) => e.id !== topicId)
    .map((e) => `${e.id}|${e.key}|${e.path}`)
    .sort();

  function patchQuiz(topics) {
    for (const t of topics) {
      if (t.id === topicId) {
        t.quiz = quizMeta;
        t.title = title;
        t.is_placeholder = false;
        if (!t.topic_image || t.topic_image.includes('placeholder')) {
          t.topic_image = topicImage;
        }
        return true;
      }
      if (t.subtopics && patchQuiz(t.subtopics)) return true;
    }
    return false;
  }
  if (!patchQuiz(mono.topics)) {
    throw new Error(`${topicId} not found in data/${source}-topics.json`);
  }

  const afterOthers = collectImageFields(mono.topics)
    .filter((e) => e.id !== topicId)
    .map((e) => `${e.id}|${e.key}|${e.path}`)
    .sort();
  if (JSON.stringify(beforeOthers) !== JSON.stringify(afterOthers)) {
    throw new Error('Safety check failed: another topic image path was modified');
  }
  fs.writeFileSync(monoPath, JSON.stringify(mono, null, 2) + '\n', 'utf8');

  const html = renderQuizHtml({
    source,
    topicId,
    title,
    topicImage,
    seoDesc
  });
  const htmlDir = path.join(ROOT, 'quiz', source);
  fs.mkdirSync(htmlDir, { recursive: true });
  const htmlPath = path.join(htmlDir, `${topicId}.html`);
  fs.writeFileSync(htmlPath, html, 'utf8');

  console.log('Wrote', path.relative(ROOT, quizJsonPath));
  console.log('Wrote', path.relative(ROOT, htmlPath));
  console.log('Updated topic.quiz on', topicId);
  console.log('Correct letter mix:', letterCounts);
  return { quizJsonPath, htmlPath, letterCounts };
}

module.exports = {
  ROOT,
  cleanText,
  absoluteVoice,
  applyQuiz,
  renderQuizHtml,
  assertGrounded
};
