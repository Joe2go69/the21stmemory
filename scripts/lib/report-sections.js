/**
 * Map quiz questions to the report section on the built dive page that best
 * explains them, so the quiz "Why" can link to /dive/<source>/<id>.html#<anchor>.
 * Anchors come from build-static-dives.js addReportAnchors ("r-…" headings,
 * "term-…" term cards). Pure text matching, no network.
 */
const STOP = new Set(
  ('a an the and or but of to in on at by for with from as is are was were be been being it its this that these those ' +
    'which what who whom whose how why when where does do did has have had not no than then so such into onto over under ' +
    'their there they them he she his her you your we our us i me my can could would should will may might must also only ' +
    'more most other some any all each both one two three about after before during through between within without upon ' +
    'according report quiz true false following statement option options answer described describe role purpose primary main')
    .split(/\s+/)
);

function tokens(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/g, ' ')
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !STOP.has(w))
    .map((w) => w.replace(/(ing|ed|es|s)$/, '').slice(0, 9));
}

function plain(html) {
  return String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Sections in document order from the built dive HTML report container. */
function reportSections(diveHtml) {
  const start = diveHtml.indexOf('id="report-container"');
  if (start < 0) return [];
  const body = diveHtml.slice(start);
  const re = /<(h[23]|article)\b[^>]*\bid="((?:r|term)-[^"]+)"[^>]*>/g;
  const hits = [];
  let m;
  while ((m = re.exec(body))) hits.push({ id: m[2], at: m.index, tag: m[1] });
  return hits.map((h, i) => {
    const end = i + 1 < hits.length ? hits[i + 1].at : Math.min(body.length, h.at + 8000);
    const chunk = body.slice(h.at, end);
    const titleMatch = chunk.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/);
    const title = plain(titleMatch ? titleMatch[1] : '');
    return { id: h.id, title, isTerm: h.id.startsWith('term-'), toks: tokens(chunk), titleToks: tokens(title) };
  });
}

function bestSection(question, sections) {
  if (!sections.length) return null;
  const df = new Map();
  for (const s of sections) for (const t of new Set(s.toks)) df.set(t, (df.get(t) || 0) + 1);
  const idf = (t) => Math.log((sections.length + 1) / ((df.get(t) || 0) + 0.5));
  const correct = (question.options || []).find((o) => o.isCorrect);
  const qText = `${question.question} ${correct ? correct.text : ''} ${correct?.rationale || ''}`;
  const qToks = new Set(tokens(qText));
  const stemToks = new Set(tokens(question.question));
  let best = null;
  for (const s of sections) {
    const set = new Set(s.toks);
    let score = 0;
    for (const t of qToks) if (set.has(t)) score += idf(t);
    // A section/term whose title is named in the question is a strong signal.
    for (const t of new Set(s.titleToks)) if (stemToks.has(t)) score += 2 * idf(t);
    score /= 1 + 0.25 * Math.log(1 + s.toks.length / 40);
    if (!best || score > best.score) best = { id: s.id, title: s.title, score };
  }
  return best && best.score >= 3 ? { id: best.id, title: best.title } : null;
}

module.exports = { reportSections, bestSection, tokens };
