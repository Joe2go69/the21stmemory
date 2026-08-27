/**
 * Machine checklist for a single topic/quiz install.
 * Read-only — does not write files.
 */
const fs = require('fs');
const path = require('path');
const { ROOT, REQUIRED_SECTIONS, findNode } = require('./topic-pipeline');

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function read(rel) {
  const full = path.join(ROOT, rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}

function isTfQuestion(q) {
  if (/^\s*true\s+or\s+false\b/i.test(q.question || '')) return true;
  const texts = (q.options || []).map((o) => String(o.text || '').trim());
  return texts.length === 2 && texts.every((t) => /^(true|false)$/i.test(t));
}

function verifyInstall({ source, id, kind = 'all' }) {
  const checks = [];
  const add = (name, pass, detail) => {
    checks.push({ name, pass: !!pass, detail: detail || '' });
  };

  const wantTopic = kind === 'topic' || kind === 'all';
  const wantQuiz = kind === 'quiz' || kind === 'all';

  const topicRel = `data/${source}-topics/${id}.json`;
  const diveRel = `dive/${source}/${id}.html`;
  add(`${topicRel} exists`, exists(topicRel));
  add(`${diveRel} exists`, exists(diveRel));
  const dive = read(diveRel);

  let title = id;
  let topic = {};
  if (exists(topicRel)) {
    topic = JSON.parse(read(topicRel));
  }
  const monoPath = path.join(ROOT, 'data', `${source}-topics.json`);
  if (fs.existsSync(monoPath)) {
    const tree = JSON.parse(fs.readFileSync(monoPath, 'utf8'));
    const node = findNode(tree.topics || [], id);
    if (node) {
      title = node.title || title;
      add('not a placeholder', !node.is_placeholder);
      if (wantTopic) {
        add('topic image file', node.topic_image && exists(node.topic_image), node.topic_image);
        if (node.topic_image) {
          add('hero/card image in dive', dive.includes(path.basename(node.topic_image)));
        }
      }
    } else {
      add(`${id} in ${source}-topics.json`, false);
    }
  }

  const report = topic.report || '';
  if (wantTopic) {
    for (const h of REQUIRED_SECTIONS) {
      add(`report ${h}`, report.includes(h));
    }
    add('report has no TODO', !report.includes('TODO'));
    add('infographic file', topic.infographic_image && exists(topic.infographic_image), topic.infographic_image);
    add('PDF preview file', topic.pdf_preview_image && exists(topic.pdf_preview_image), topic.pdf_preview_image);
    add('PDF URL', !!topic.slide_deck_pdf_url, topic.slide_deck_pdf_url);
    add('at least one Rumble video', Array.isArray(topic.rumble_videos) && topic.rumble_videos.length > 0);
  }

  add('dive is not a stub', dive && !dive.includes('dive-stub-actions'));
  if (wantTopic && topic.infographic_image) {
    add('infographic in dive', dive.includes(path.basename(topic.infographic_image)));
  }
  if (wantTopic && topic.pdf_preview_image) {
    add('PDF preview in dive', dive.includes(path.basename(topic.pdf_preview_image)));
  }

  const quizRel = `data/quizzes/${source}/${id}.json`;
  const quizHtmlRel = `quiz/${source}/${id}.html`;
  if (wantQuiz) {
    add(`${quizRel} exists`, exists(quizRel));
    add(`${quizHtmlRel} exists`, exists(quizHtmlRel));
    if (exists(quizRel)) {
      const quiz = JSON.parse(read(quizRel));
      add('25 questions', (quiz.questions || []).length === 25, String((quiz.questions || []).length));
      let mcOk = true;
      let tfOk = true;
      let tfCount = 0;
      for (const q of quiz.questions || []) {
        const n = (q.options || []).length;
        if (isTfQuestion(q)) {
          tfCount += 1;
          const texts = (q.options || []).map((o) => String(o.text || '').trim());
          if (n !== 2 || texts[0] !== 'True' || texts[1] !== 'False') tfOk = false;
        } else if (n !== 4) {
          mcOk = false;
        }
      }
      add('MC items have 4 options', mcOk);
      add('T/F items are True then False only', tfOk, tfCount ? `${tfCount} T/F` : 'none');
    }
    const t = String(title || '').trim();
    const cta = /^the\b/i.test(t) ? `Take ${t} Quiz` : `Take the ${t} Quiz`;
    add(`dive CTA: ${cta}`, dive.includes(cta));
  }

  const failed = checks.filter((c) => !c.pass);
  return { ok: failed.length === 0, checks, failed, title };
}

function printReport(result) {
  for (const c of result.checks) {
    const mark = c.pass ? 'OK' : 'FAIL';
    const extra = c.detail && !c.pass ? ` (${c.detail})` : '';
    console.log(`  [${mark}] ${c.name}${extra}`);
  }
  if (!result.ok) {
    console.error(`Verify failed: ${result.failed.length} check(s)`);
  } else {
    console.log('Verify passed');
  }
}

module.exports = { verifyInstall, printReport };
