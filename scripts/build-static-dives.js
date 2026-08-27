/**
 * Prerender static deep-dive pages for SEO:
 *   dive/{source}/{topicId}.html
 *
 * Live topics get full content + indexable meta.
 * Stub/TODO topics get a noindex "coming soon" shell.
 *
 * Run: node scripts/build-static-dives.js
 */
const fs = require('fs');
const path = require('path');
const markedLib = require('../assets/js/vendor/marked.min.js');
const markedParse = markedLib.parse || markedLib.marked;
const { renderNavbar, renderFooter } = require('./chrome-renderer');

const ROOT = path.join(__dirname, '..');
const BASE_URL = 'https://21stmemory.com';
const ASSET_BASE = '../../';
const OUT_ROOT = path.join(ROOT, 'dive');

const navbarData = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'assets/data/navbar.json'), 'utf8')
);
const footerData = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'assets/data/footer.json'), 'utf8')
);
const seoBrand = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'assets/data/seo.json'), 'utf8')
).brand;

const navbarHTML = renderNavbar(navbarData, { basePath: ASSET_BASE });
const footerHTML = renderFooter(footerData, { basePath: ASSET_BASE });

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, '&#39;');
}

function encodeAssetPath(assetPath) {
  if (!assetPath) return '';
  return String(assetPath)
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/');
}

function withAsset(relPath) {
  if (!relPath) return '';
  if (/^https?:\/\//i.test(relPath)) return relPath;
  return ASSET_BASE + encodeAssetPath(relPath.replace(/^\//, ''));
}

function walkTopics(topics, acc = [], path = []) {
  for (const item of topics || []) {
    const current = [...path, item];
    acc.push({ item, path: current });
    if (item.subtopics?.length) walkTopics(item.subtopics, acc, current);
  }
  return acc;
}

function isStub(indexItem, content) {
  if (indexItem.is_placeholder) return true;
  const report = (content.report || '').trim();
  if (!report) return true;
  if (report.includes('TODO')) return true;
  if ((indexItem.topic_image || content.topic_image || '').includes('PLACEHOLDER')) return true;
  return false;
}

function estimateReadingTime(text) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function formatHeroDate(isoDate) {
  const raw = String(isoDate || '').trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return raw;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[Number(match[2]) - 1];
  if (!month) return raw;
  return `${Number(match[3])} ${month} ${match[1]}`;
}

function renderHeroMeta({ sourceTitle, readingTime, lastUpdated }) {
  const parts = [];
  if (sourceTitle) {
    parts.push(`<span class="deep-dive-hero-meta__path">${escapeHtml(sourceTitle)}</span>`);
  }
  if (readingTime) {
    parts.push(`<span class="deep-dive-hero-meta__item">${escapeHtml(readingTime)}</span>`);
  }
  if (lastUpdated) {
    parts.push(
      `<time class="deep-dive-hero-meta__item" datetime="${escapeAttr(lastUpdated)}">Updated ${escapeHtml(formatHeroDate(lastUpdated))}</time>`
    );
  }
  if (!parts.length) return '';
  return `<div class="deep-dive-hero-meta">${parts.join(
    '<span class="deep-dive-hero-meta__dot" aria-hidden="true">·</span>'
  )}</div>`;
}

function renderHeroDeck(description) {
  const first = String(description || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .find(Boolean);
  if (!first) return '';
  return `<p class="deep-dive-hero-deck">${escapeHtml(first)}</p>`;
}

function sanitizeReportHtml(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

function classifyTermVoice(headingText) {
  const t = String(headingText || '')
    .replace(/<[^>]+>/g, '')
    .toLowerCase();
  if (/guid(e|ance)|remembrance|integration|practice/.test(t)) return 'guidance';
  if (/nuance|caveat|further exploration/.test(t)) return 'caveat';
  if (/reminder|takeaway|revelation|insight|dot connection/.test(t)) return 'takeaway';
  if (/terminolog|glossary|definition/.test(t)) return 'glossary';
  return 'glossary';
}

function collectReportFigures(text) {
  const found = [];
  const add = (value, label) => {
    if (found.some((item) => item.value === value)) return;
    found.push({ value, label });
  };
  const src = String(text || '');
  if (/178,000/.test(src)) add('178,000', 'year cycle');
  if (/\b97\s*%/.test(src)) add('97%', 'NPC overlay');
  if (/520\s*million/i.test(src)) add('520 million', 'souls remaining');
  if (/4,000/.test(src) && /ancient/i.test(src)) add('4,000', 'Ancients');
  if (/30[-\s]?second/i.test(src)) add('30 seconds', 'EMF flash');
  return found.slice(0, 4);
}

function renderReportFigures(figures) {
  if (!figures || figures.length < 2) return '';
  return `<aside class="report-figures" aria-label="Key figures">${figures
    .map(
      (fig) =>
        `<div class="report-figure"><span class="report-figure__value">${escapeHtml(
          fig.value
        )}</span><span class="report-figure__label">${escapeHtml(fig.label)}</span></div>`
    )
    .join('')}</aside>`;
}

function stripDuplicateReportTitle(html) {
  return String(html || '').replace(/^\s*<h1\b[^>]*>[\s\S]*?<\/h1>\s*/i, '');
}

function markReportLead(html) {
  let done = false;
  return String(html || '').replace(/<p(\s[^>]*)?>/i, (match, attrs = '') => {
    if (done) return match;
    done = true;
    if (/\bclass\s*=/.test(attrs)) {
      return `<p${attrs.replace(/class=(["'])([^"']*)\1/, 'class=$1$2 report-lead$1')}>`;
    }
    return `<p class="report-lead"${attrs}>`;
  });
}

function insertReportFigures(html, figures) {
  const block = renderReportFigures(figures);
  if (!block) return html;
  if (/\breport-figures\b/.test(html)) return html;
  const leadClose = html.search(/class="[^"]*\breport-lead\b[^"]*"/i);
  if (leadClose < 0) return html;
  const endP = html.indexOf('</p>', leadClose);
  if (endP < 0) return html;
  return `${html.slice(0, endP + 4)}\n${block}${html.slice(endP + 4)}`;
}

function enhanceReportQuotes(html) {
  const blocks = [...String(html || '').matchAll(/<blockquote\b[^>]*>[\s\S]*?<\/blockquote>/gi)];
  if (!blocks.length) return html;

  let pick = blocks[0];
  const passageIdx = html.search(/<h2\b[^>]*>[\s\S]*?(notable|passage|direct insight)[\s\S]*?<\/h2>/i);
  const inPassages = passageIdx >= 0
    ? blocks.filter((m) => m.index > passageIdx)
    : blocks;
  const pool = inPassages.length ? inPassages : blocks;
  pick = pool.reduce((best, cur) => {
    const a = (best[0].replace(/<[^>]+>/g, '') || '').length;
    const b = (cur[0].replace(/<[^>]+>/g, '') || '').length;
    return b > a ? cur : best;
  }, pool[0]);

  if ((pick[0].replace(/<[^>]+>/g, '') || '').trim().length < 80) return html;

  return html.replace(pick[0], (orig) => {
    if (/\breport-pullquote\b/.test(orig)) return orig;
    const inner = orig.replace(/^<blockquote\b[^>]*>/i, '').replace(/<\/blockquote>\s*$/i, '');
    return `<blockquote class="report-pullquote">${inner}<footer class="report-pullquote__source">Thalon Thor · transmission</footer></blockquote>`;
  });
}

function enhanceReportCoda(html, assetBase = ASSET_BASE) {
  const mark = escapeAttr(`${assetBase}images/21st-mark.webp`);
  return String(html || '').replace(
    /<h2\b[^>]*>\s*Closing Invitation\s*<\/h2>\s*(<p\b[^>]*>[\s\S]*?<\/p>)/i,
    (_, paragraph) => {
      const text = paragraph.replace(/^<p\b[^>]*>/i, '').replace(/<\/p>\s*$/i, '');
      return `<footer class="report-coda"><div class="report-coda__rule" aria-hidden="true"></div><p class="report-coda__text">${text}</p><img class="report-coda__mark" src="${mark}" alt="" width="40" height="40" decoding="async" /></footer>`;
    }
  );
}

function enhanceReportHtml(html, sourceText) {
  let out = stripDuplicateReportTitle(sanitizeReportHtml(html));
  out = enhanceTerminologyHtml(out);
  out = markReportLead(out);
  out = insertReportFigures(out, collectReportFigures(sourceText || out.replace(/<[^>]+>/g, ' ')));
  out = enhanceReportQuotes(out);
  out = enhanceReportCoda(out);
  return out;
}

function renderMarkdown(md) {
  if (!md) return '';
  const html = markedParse(md);
  return enhanceReportHtml(html, md);
}

function renderFolioMasthead({ sourceTitle, readingTime, assetBase = ASSET_BASE }) {
  const parts = ['<span class="report-folio-kicker">Decoded report</span>'];
  if (sourceTitle) {
    parts.push(`<span class="report-folio-path">${escapeHtml(sourceTitle)}</span>`);
  }
  if (readingTime) {
    parts.push(`<span class="report-folio-time">${escapeHtml(readingTime)}</span>`);
  }
  return `<header class="report-folio-masthead">
    <img src="${escapeAttr(assetBase + 'images/21st-mark.webp')}" alt="" class="report-folio-mark" width="36" height="36" decoding="async" />
    <div class="report-folio-meta">${parts.join(
      '<span class="report-folio-dot" aria-hidden="true">·</span>'
    )}</div>
  </header>`;
}

/**
 * Strip list-item leftovers after the term <strong>.
 * Never put HTML entities inside a [] class — "&middot;" matches the
 * letters m/i/d/o/t (and D/T/O with the i flag), which ate "Death" → "eath".
 */
function cleanTermDefinition(defHtml) {
  let html = String(defHtml || '');
  const leadSpace = /^(?:\s|&nbsp;|&#160;)+/i;
  const leadWrap = /^(?:<\/p>|<p\b[^>]*>)+/i;
  const trailWrap = /(?:<\/p>|<p\b[^>]*>)+\s*$/i;
  const separators = /^(?:[-–—:·•]|&middot;)+/i;

  html = html.replace(leadSpace, '');
  html = html.replace(leadWrap, '');
  html = html.replace(leadSpace, '');
  html = html.replace(separators, '');
  html = html.replace(leadSpace, '');
  html = html.replace(leadWrap, '');
  html = html.replace(trailWrap, '');
  return html.trim();
}

/**
 * Transform definition-style lists after h2/h3 into term cards.
 * Covers Key Terminology, Key Reminders, Guidance lists, etc.
 * Leaves original markup if parsing fails or list is not term-like.
 */
function enhanceTerminologyHtml(html) {
  if (!html) return html;

  return html.replace(
    /(<h[23][^>]*>[\s\S]*?<\/h[23]>)\s*<ul>([\s\S]*?)<\/ul>/gi,
    (match, heading, ulInner) => {
      const liMatches = [...ulInner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
      if (liMatches.length < 2) return match;

      const cards = [];
      for (const liMatch of liMatches) {
        const liHtml = liMatch[1];
        const strongMatch = liHtml.match(/<strong[^>]*>([\s\S]*?)<\/strong>/i);
        if (!strongMatch) continue;
        const term = strongMatch[1]
          .replace(/<[^>]+>/g, '')
          .trim()
          .replace(/[:：]\s*$/, '');
        if (!term) continue;
        let defHtml = cleanTermDefinition(
          liHtml.slice(liHtml.indexOf(strongMatch[0]) + strongMatch[0].length)
        );
        if (!defHtml) continue;
        cards.push(
          `<article class="term-card" role="listitem"><h3 class="term-card__term">${escapeHtml(term)}</h3><div class="term-card__def">${defHtml}</div></article>`
        );
      }

      // Require majority of items to be term/definition rows
      if (cards.length < 2 || cards.length < liMatches.length * 0.5) return match;
      const voice = classifyTermVoice(heading);
      const voiced = cards.map((card) =>
        card.replace('class="term-card"', `class="term-card term-card--${voice}"`)
      );
      return `${heading}\n<div class="term-card-grid term-card-grid--${voice}" data-term-voice="${voice}" role="list">\n${voiced.join('\n')}\n</div>`;
    }
  );
}

function renderStudyToolbar() {
  return `<div id="report-study-toolbar" class="report-study-toolbar" role="toolbar" aria-label="Reading comfort">
    <div class="report-study-group" role="group" aria-label="Text size">
      <span class="report-study-label" id="report-size-label">Text</span>
      <button type="button" class="report-study-btn report-study-btn--size" data-report-size="sm" aria-pressed="false" aria-labelledby="report-size-label" title="Smaller text">A</button>
      <button type="button" class="report-study-btn report-study-btn--size report-study-btn--size-md" data-report-size="md" aria-pressed="true" aria-labelledby="report-size-label" title="Default text">A</button>
      <button type="button" class="report-study-btn report-study-btn--size report-study-btn--size-lg" data-report-size="lg" aria-pressed="false" aria-labelledby="report-size-label" title="Larger text">A</button>
    </div>
    <button type="button" class="report-study-btn report-study-btn--focus" data-report-focus aria-pressed="false">Focus</button>
    <button type="button" class="report-study-btn" data-report-print aria-label="Print or save report as PDF">Print</button>
  </div>`;
}

function renderShareMenu({ canonical, title }) {
  return `<div class="share-menu share-menu--inline" data-share-url="${escapeAttr(canonical)}" data-share-title="${escapeAttr(title)}">
    <button type="button" class="dive-hero-link share-menu__toggle" aria-expanded="false" aria-haspopup="true" aria-label="Share this topic">Share</button>
    <div class="share-menu__panel" role="menu" hidden>
      <button type="button" class="share-menu__item" role="menuitem" data-share-action="copy-link">Copy link</button>
      <button type="button" class="share-menu__item" role="menuitem" data-share-action="copy-report">Copy report link</button>
      <button type="button" class="share-menu__item" role="menuitem" data-share-action="copy-title">Copy title + URL</button>
      <button type="button" class="share-menu__item" role="menuitem" data-share-action="native-share">Share…</button>
    </div>
  </div>`;
}

function renderPlateCaption(kind, action) {
  const isPlate = kind === 'plate';
  return `<div class="dive-plate-caption ${isPlate ? 'infographic-artifact-caption' : 'slide-deck-artifact-caption'}">
                    <span>${isPlate ? 'Plate' : 'Deck'}</span>
                    <span class="${isPlate ? 'infographic-artifact-zoom' : 'slide-deck-artifact-action'} dive-plate-action">${escapeHtml(action)}</span>
                  </div>`;
}

function renderPlateCard({ kind, src, alt, href, action, openLabel, solo }) {
  const isPlate = kind === 'plate';
  const artifactClass = isPlate ? 'infographic-artifact' : 'slide-deck-artifact';
  const dataAttr = isPlate
    ? `data-infographic-src="${escapeAttr(src)}"`
    : `data-pdf-url="${escapeAttr(href)}"`;
  const colClass = solo ? 'md:col-span-12 max-w-3xl mx-auto' : 'md:col-span-6';
  const media = src
    ? `<img src="${escapeAttr(src)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" width="800" height="600">`
    : `<div class="dive-plate__void" aria-hidden="true"></div>`;
  return `<div class="${colClass}">
          <div class="dive-media-card media-panel static-card surface-static p-4 sm:p-5 h-full flex flex-col">
            <div class="dive-media-card__frame media-frame surface-media w-full max-w-none flex-1">
              <div class="media-scrim overflow-hidden dive-media-card__scrim flex items-center justify-center">
                <div class="${artifactClass} dive-plate${src ? '' : ' dive-plate--empty'}" role="button" tabindex="0" aria-label="${escapeAttr(openLabel)}" ${dataAttr}>
                  ${media}
                  ${renderPlateCaption(kind, action)}
                </div>
              </div>
            </div>
          </div>
        </div>`;
}

function renderSectionHeading(label, id) {
  const idAttr = id ? ` id="${escapeAttr(id)}"` : '';
  return `<div${idAttr} class="dive-section-head full-bleed-divider">
      <div class="dive-section-head__line" aria-hidden="true"></div>
      <div class="dive-section-head__label">${escapeHtml(label)}</div>
      <div class="dive-section-head__line" aria-hidden="true"></div>
    </div>`;
}

function divePath(sourceId, topicId) {
  return `dive/${sourceId}/${topicId}.html`;
}

function diveUrl(sourceId, topicId) {
  return `${BASE_URL}/${divePath(sourceId, topicId)}`;
}

function absoluteImage(rel) {
  if (!rel) return seoBrand.defaultImage || `${BASE_URL}/images/og-default.webp`;
  if (/^https?:\/\//i.test(rel)) return rel;
  return `${BASE_URL}/${rel.replace(/^\//, '')}`;
}

function findAdjacent(flat, topicId) {
  const idx = flat.findIndex((e) => e.item.id === topicId);
  if (idx < 0) return { prev: null, next: null };
  let prev = null;
  let next = null;
  for (let i = idx - 1; i >= 0; i--) {
    if (!flat[i].isStub) {
      prev = flat[i];
      break;
    }
  }
  for (let i = idx + 1; i < flat.length; i++) {
    if (!flat[i].isStub) {
      next = flat[i];
      break;
    }
  }
  return { prev, next };
}

function renderBreadcrumbs({ sourceId, sourceTitle, topicPath, currentTitle }) {
  const crumbs = [
    { label: 'Codex', href: `${ASSET_BASE}codex.html` },
    { label: sourceTitle, href: `${ASSET_BASE}topics.html?source=${encodeURIComponent(sourceId)}` },
  ];
  if (topicPath?.length) {
    topicPath.slice(0, -1).forEach((item) => {
      crumbs.push({
        label: item.title,
        href: `${ASSET_BASE}dive/${sourceId}/${item.id}.html`,
      });
    });
  }
  const items = crumbs
    .map(
      (crumb, i) => `
      <li class="breadcrumb-item flex items-center gap-1">
        ${i > 0 ? '<span class="breadcrumb-sep text-mem-dim" aria-hidden="true">›</span>' : ''}
        <a href="${escapeAttr(crumb.href)}" class="breadcrumb-link hover:text-white transition">${escapeHtml(crumb.label)}</a>
      </li>`
    )
    .join('');
  return `<nav aria-label="Breadcrumb" class="mb-5">
    <ol class="breadcrumb flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-mem-muted">
      ${items}
      <li class="breadcrumb-item flex items-center gap-1">
        <span class="breadcrumb-sep text-mem-dim" aria-hidden="true">›</span>
        <span class="text-white font-medium" aria-current="page">${escapeHtml(currentTitle)}</span>
      </li>
    </ol>
  </nav>`;
}

function getTopicVideoLanguages(topic) {
  if (Array.isArray(topic.video_languages) && topic.video_languages.length) {
    return topic.video_languages.filter((l) => l && Array.isArray(l.videos) && l.videos.length);
  }
  return null;
}

function getDefaultVideos(topic) {
  const langs = getTopicVideoLanguages(topic);
  if (langs?.length) {
    const en = langs.find((l) => l.code === 'en');
    return (en || langs[0]).videos || [];
  }
  return topic.rumble_videos || [];
}

function videoGridClass(count) {
  if (count === 1) return 'dive-video-grid dive-video-grid--1';
  if (count === 2) return 'dive-video-grid dive-video-grid--2';
  return 'dive-video-grid dive-video-grid--3';
}

function mediaFlags(topic) {
  const hasInfographic = !!(topic.infographic_image && String(topic.infographic_image).trim());
  const hasSlide = !!(
    topic.slide_deck_pdf_url &&
    String(topic.slide_deck_pdf_url).trim() &&
    topic.slide_deck_pdf_url !== '#'
  );
  const hasVideos = getDefaultVideos(topic).length > 0;
  const hasReport = !!(topic.report && String(topic.report).trim() && !topic.report.includes('TODO'));
  return {
    hasInfographic,
    hasSlide,
    hasMediaPanel: hasInfographic || hasSlide,
    hasVideos,
    hasReport,
    hasAny: hasInfographic || hasSlide || hasVideos || hasReport,
  };
}

function renderJumpPills(flags) {
  const pills = [];
  if (flags.hasMediaPanel) {
    pills.push(
      `<button type="button" data-jump-section="infographics-section" class="btn-jump-pill">Infographics</button>`
    );
  }
  if (flags.hasVideos) {
    pills.push(
      `<button type="button" data-jump-section="videos-section" class="btn-jump-pill">Videos</button>`
    );
  }
  if (flags.hasReport) {
    pills.push(
      `<button type="button" data-jump-section="report-section" class="btn-jump-pill">Report</button>`
    );
  }
  if (!pills.length) return '';
  return `<div class="dive-jump-label">In this topic</div>
    <div class="jump-to-pills dive-section-seg" id="jump-to-pills" role="navigation" aria-label="Topic sections">${pills.join('')}</div>`;
}

function renderPrevNext({ prev, next, sourceId }) {
  if (!prev && !next) return '';
  const slot = (entry, direction) => {
    if (!entry) return `<div class="topic-prev-next__slot topic-prev-next__slot--empty"></div>`;
    const href = `${ASSET_BASE}dive/${sourceId}/${entry.item.id}.html`;
    const label = direction === 'prev' ? 'Previous' : 'Next';
    const title = escapeHtml(entry.item.title);
    if (direction === 'prev') {
      return `<a href="${escapeAttr(href)}" class="topic-prev-next__link topic-prev-next__link--prev">
        <span class="topic-prev-next__text"><span class="topic-prev-next__label">${label}</span><span class="topic-prev-next__title">${title}</span></span>
      </a>`;
    }
    return `<a href="${escapeAttr(href)}" class="topic-prev-next__link topic-prev-next__link--next">
      <span class="topic-prev-next__text"><span class="topic-prev-next__label">${label}</span><span class="topic-prev-next__title">${title}</span></span>
    </a>`;
  };
  return `<nav class="topic-prev-next" aria-label="Topic navigation">${slot(prev, 'prev')}${slot(next, 'next')}</nav>`;
}

function resolveQuiz(topic, sourceId) {
  if (topic.quiz?.href) return topic.quiz;
  const quizFile = path.join(ROOT, 'quiz', sourceId, `${topic.id}.html`);
  if (fs.existsSync(quizFile)) {
    return {
      href: `quiz/${sourceId}/${topic.id}.html`,
      title: topic.title || topic.id,
      description: `Living Truth Quiz on ${topic.title || topic.id}.`,
    };
  }
  return null;
}

/** Avoid "Take the The Spirit Tree Quiz" for titles that already start with The. */
function quizCtaLabel(title) {
  const t = String(title || 'Living Truth').trim();
  if (/^the\b/i.test(t)) return `Take ${t} Quiz`;
  return `Take the ${t} Quiz`;
}

function renderContinueLearning({ sourceId, quiz, lastUpdated, assetBase = ASSET_BASE, hideQuizCta = false }) {
  const quizHref = quiz?.href ? withAsset(String(quiz.href).replace(/^\//, '')) : '';
  let quizBlock = '';
  if (!hideQuizCta) {
    quizBlock = quizHref
      ? `<a href="${escapeAttr(quizHref)}" class="btn-primary dive-continue__btn">
        <span>${escapeHtml(quizCtaLabel(quiz.title || 'Living Truth'))}</span>
      </a>
      ${quiz.description ? `<p class="dive-continue__hint">${escapeHtml(quiz.description)}</p>` : ''}`
      : `<a href="${assetBase}quizzes.html" class="btn-secondary dive-continue__btn">Browse Living Truth Quizzes</a>`;
  }

  return `
  <aside class="dive-continue content-card static-card p-6 md:p-8 mt-8" aria-label="Continue learning">
    <h2 class="dive-continue__title">Continue learning</h2>
    <p class="dive-continue__lead">
      This archive is an AI-assisted bridge. For the source material, visit the original transmissions on the Network.
    </p>
    <div class="dive-continue__actions">
      ${quizBlock}
      <a href="${assetBase}network.html" class="btn-secondary dive-continue__btn">Open the Thalon Thor Network</a>
      <a href="${assetBase}topics.html?source=${encodeURIComponent(sourceId)}#explore-topics" class="text-link dive-continue__link">More topics in this transmission →</a>
    </div>
    <p class="dive-continue__disclaimer">
      AI may miss higher-dimensional nuance. Prefer the raw transmissions when anything feels incomplete.
      ${lastUpdated ? `<span class="dive-continue__updated"> · Updated ${escapeHtml(lastUpdated)}</span>` : ''}
    </p>
  </aside>
  <p class="dive-support-note">This topic is free to share. <a href="${assetBase}support.html" class="text-link">Support the archive →</a></p>`;
}

function renderStubActions({ sourceId, assetBase = ASSET_BASE }) {
  return `
  <div class="dive-stub-actions">
    <a href="${assetBase}topics.html?source=${encodeURIComponent(sourceId)}#explore-topics" class="btn-primary dive-continue__btn">Browse ready topics</a>
    <a href="${assetBase}quizzes.html" class="btn-secondary dive-continue__btn">Living Truth Quizzes</a>
    <a href="${assetBase}network.html" class="btn-secondary dive-continue__btn">Thalon Thor Network</a>
  </div>`;
}

function renderParticleFacade(rawTitle, posterUrl) {
  const overlay =
    `<div class="video-particle-vignette absolute inset-0 pointer-events-none" aria-hidden="true"></div>` +
    `<div class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none" aria-hidden="true">` +
    `<div class="play-button">` +
    `<svg viewBox="0 0 24 24" fill="currentColor" class="play-button__icon" aria-hidden="true">` +
    `<path d="M8 5v14l11-7z"/></svg></div></div>`;
  const thumb = String(posterUrl || '').trim();
  const src = /^https?:\/\//i.test(thumb) ? thumb : `${ASSET_BASE}images/video-poster.webp`;
  return (
    `<img src="${escapeAttr(src)}" alt="" class="video-poster-img absolute inset-0 w-full h-full object-cover" width="1280" height="720" loading="lazy" decoding="async">` +
    overlay
  );
}

function renderVideos(videos) {
  if (!videos?.length) return '';
  return videos
    .map((video) => {
      const rawTitle = video.title || 'Video transmission';
      const title = escapeHtml(rawTitle);
      const embed = escapeAttr(video.embed_url || '');
      const posterUrl = video.poster_url || '';
      const posterAttr = posterUrl ? ` data-poster-url="${escapeAttr(posterUrl)}"` : '';
      const desc = video.description
        ? `<p class="dive-video-card__desc">${escapeHtml(video.description)}</p>`
        : '';
      return `<article class="dive-video-card content-card static-card">
        <div class="dive-video-card__frame">
          <div class="video-poster-wrap"
               data-rumble-embed="${embed}"
               data-video-title="${title}"${posterAttr}
               role="button" tabindex="0"
               aria-label="Play video: ${title}">
            ${renderParticleFacade(rawTitle, posterUrl)}
          </div>
        </div>
        <div class="dive-video-card__body">
          <h3 class="dive-video-card__title">${title}</h3>
          ${desc}
        </div>
      </article>`;
    })
    .join('\n');
}

function renderVideoLanguageBar(languages) {
  if (!languages || languages.length < 2) return '';
  const options = languages
    .map((lang) => {
      const code = escapeAttr(lang.code || '');
      const label = escapeHtml(lang.native_label || lang.label || lang.code || '');
      return `<option value="${code}">${label}</option>`;
    })
    .join('');
  // Prevent </script> breakout inside JSON payload
  const json = JSON.stringify(languages).replace(/</g, '\\u003c');
  return `
        <div class="video-lang-bar" id="video-lang-bar">
          <span class="video-lang-bar__kicker">Language</span>
          <label class="video-lang-bar__label" for="video-lang-select">Watch in</label>
          <div class="video-lang-bar__control">
            <select id="video-lang-select" class="video-lang-select" aria-label="Video language">
              ${options}
            </select>
          </div>
        </div>
        <script type="application/json" id="video-languages-data">${json}</script>`;
}

function buildJsonLd({ title, description, url, image, sourceTitle, dateModified, isStub }) {
  if (isStub) return '';
  const graph = [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: seoBrand.name,
      url: BASE_URL,
      logo: seoBrand.logo,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Codex', item: `${BASE_URL}/codex.html` },
        { '@type': 'ListItem', position: 3, name: sourceTitle, item: url },
        { '@type': 'ListItem', position: 4, name: title, item: url },
      ],
    },
    {
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: title,
      description,
      image,
      mainEntityOfPage: url,
      isPartOf: { '@id': `${BASE_URL}/#website` },
      author: { '@id': `${BASE_URL}/#organization` },
      publisher: { '@id': `${BASE_URL}/#organization` },
      dateModified: dateModified || undefined,
      inLanguage: 'en-US',
    },
  ];
  return `<script type="application/ld+json">
${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2)}
</script>`;
}

function buildPage({
  sourceId,
  sourceTitle,
  topic,
  topicPath,
  isStubTopic,
  prev,
  next,
  lastUpdated,
}) {
  const title = topic.title || topic.id;
  const description =
    topic.description ||
    `AI-decoded deep-dive on ${title} from the ${sourceTitle} transmission in the 21st Memory archive.`;
  // Meta/OG/Twitter only — keep body description unchanged when topic text is short.
  const metaDescription = /21st Memory/i.test(description)
    ? description
    : `${description.replace(/\s+$/, '')} — from the 21st Memory archive.`;
  const pageTitle = `${title} | ${sourceTitle} | 21st Memory`;
  const canonical = diveUrl(sourceId, topic.id);
  const ogImage = absoluteImage(
    topic.topic_image || topic.infographic_image || 'images/og-default.webp'
  );
  const flags = mediaFlags(topic);
  const readingTime = flags.hasReport ? estimateReadingTime(topic.report) : '';
  const heroImageRel = (topic.topic_image || topic.infographic_image || '').replace(/\\/g, '/');
  const heroImage = heroImageRel ? withAsset(heroImageRel) : '';
  const bgStyle = heroImage ? `style="background-image: url('${escapeAttr(heroImage)}')"` : '';
  const robots = isStubTopic ? '    <meta name="robots" content="noindex,follow">\n' : '';
  const quiz = resolveQuiz(topic, sourceId);
  const quizHref = quiz?.href ? withAsset(String(quiz.href).replace(/^\//, '')) : '';

  const breadcrumbs = renderBreadcrumbs({
    sourceId,
    sourceTitle,
    topicPath: topicPath.map((p) => p),
    currentTitle: title,
  });

  let bodyMain = '';

  if (isStubTopic || !flags.hasAny) {
    bodyMain = `
    <div class="max-w-6xl mx-auto px-6 page-shell pb-4">
      <div id="lesson-header" class="mb-10">
        ${breadcrumbs}
        <div class="deep-dive-hero">
          <div class="deep-dive-hero-bg" ${bgStyle}></div>
          <div class="deep-dive-hero-scrim"></div>
          <div class="deep-dive-hero-content">
            <p class="page-hero-eyebrow">${escapeHtml(sourceTitle)} · Coming soon</p>
            <h1 class="page-hero-title--dive">${escapeHtml(title)}</h1>
            <div class="deep-dive-hero-accent" aria-hidden="true"></div>
            <p class="text-[17px] text-mem-secondary max-w-[52ch] leading-relaxed mt-4">${escapeHtml(description)}</p>
            <div class="mt-8 flex flex-wrap gap-3">
              <a href="${ASSET_BASE}codex.html" class="btn-secondary btn-secondary--sm">← Back to Codex</a>
              <a href="${ASSET_BASE}topics.html?source=${encodeURIComponent(sourceId)}#explore-topics" class="btn-secondary btn-secondary--sm">← Back to Topics</a>
            </div>
          </div>
        </div>
      </div>
      <div class="max-w-2xl mx-auto text-center py-16 px-6">
        <h2 class="text-3xl font-semibold tracking-tighter mb-4">This topic continues to unfold</h2>
        <p class="text-mem-soft text-lg leading-relaxed mb-8">
          The complete Codex experience for this topic is being prepared — infographics, slide decks, video transmissions, and a deep-dive report. Ready entries are already available in the archive.
        </p>
        ${renderStubActions({ sourceId })}
        <div class="text-xs text-mem-dim tracking-wide mt-8">Not indexed yet · Content in preparation</div>
      </div>
    </div>`;
  } else {
    const reportHtml = flags.hasReport ? renderMarkdown(topic.report) : '';
    const infographicSrc = flags.hasInfographic ? withAsset(topic.infographic_image) : '';
    const pdfPreview = topic.pdf_preview_image ? withAsset(topic.pdf_preview_image) : '';
    const continueBlock = renderContinueLearning({
      sourceId,
      quiz,
      lastUpdated,
      hideQuizCta: Boolean(quiz),
    });

    bodyMain = `
    <div class="max-w-6xl mx-auto px-6 page-shell dive-hero-shell">
      <div id="lesson-header">
        ${breadcrumbs}
        <div class="deep-dive-hero">
          <div class="deep-dive-hero-bg" ${bgStyle}></div>
          <div class="deep-dive-hero-scrim"></div>
          <div class="deep-dive-hero-content">
            ${renderHeroMeta({ sourceTitle, readingTime, lastUpdated })}
            <h1 class="page-hero-title--dive">${escapeHtml(title)}</h1>
            <div class="deep-dive-hero-accent" aria-hidden="true"></div>
            ${renderHeroDeck(description)}
            <div class="dive-hero-actions">
              ${renderJumpPills(flags)}
              ${
                quizHref
                  ? `<div class="deep-dive-quiz-cta">
                <a href="${escapeAttr(quizHref)}" class="btn-primary deep-dive-quiz-cta__btn">
                  <span>${escapeHtml(quizCtaLabel(quiz.title || 'Living Truth'))}</span>
                </a>
                ${quiz.description ? `<p class="deep-dive-quiz-cta__desc">${escapeHtml(quiz.description)}</p>` : ''}
              </div>`
                  : ''
              }
              <nav class="dive-hero-links" aria-label="Topic links">
                <a href="${ASSET_BASE}codex.html#codex-pill" class="dive-hero-link">Codex</a>
                <span class="dive-hero-link-sep" aria-hidden="true">·</span>
                <a href="${ASSET_BASE}topics.html?source=${encodeURIComponent(sourceId)}#explore-topics" class="dive-hero-link">Topics</a>
                <span class="dive-hero-link-sep" aria-hidden="true">·</span>
                <a href="${ASSET_BASE}network.html" class="dive-hero-link">Network</a>
                <span class="dive-hero-link-sep" aria-hidden="true">·</span>
                ${renderShareMenu({ canonical, title })}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    ${
      flags.hasMediaPanel
        ? `
    <div id="infographics-section" class="dive-zone">
    ${renderSectionHeading('Infographics & slide decks')}
    <div class="max-w-6xl mx-auto px-6">
      <div class="dive-media-grid grid md:grid-cols-12 gap-6">
        ${
          flags.hasInfographic
            ? renderPlateCard({
                kind: 'plate',
                src: infographicSrc,
                alt: `${title} infographic`,
                action: 'Expand',
                openLabel: 'Open full size plate',
                solo: !flags.hasSlide,
              })
            : ''
        }
        ${
          flags.hasSlide
            ? renderPlateCard({
                kind: 'deck',
                src: pdfPreview,
                alt: `Slide deck preview — ${title}`,
                href: topic.slide_deck_pdf_url,
                action: 'Open PDF',
                openLabel: 'Open slide deck PDF',
                solo: !flags.hasInfographic,
              })
            : ''
        }
      </div>
    </div>
    </div>`
        : ''
    }

    ${
      flags.hasVideos
        ? (() => {
            const defaultVideos = getDefaultVideos(topic);
            const videoLangs = getTopicVideoLanguages(topic);
            return `
    <div id="videos-section" class="dive-zone">
      ${renderSectionHeading('Video transmissions')}
      <div class="max-w-6xl mx-auto px-6">
        ${renderVideoLanguageBar(videoLangs)}
        <div id="videos-container" class="${videoGridClass(defaultVideos.length)}">
          ${renderVideos(defaultVideos)}
        </div>
      </div>
    </div>`;
          })()
        : ''
    }

    ${
      flags.hasReport
        ? `
    <div id="report-section" class="dive-zone">
      ${renderSectionHeading('Deep dive report')}
      <div class="max-w-6xl mx-auto px-6">
        <div class="content-card static-card lesson-content-card dive-report-card p-8 md:p-12 lg:p-16">
          <div class="report-print-banner" aria-hidden="true">
            <img src="${escapeAttr(ASSET_BASE + 'images/21st-mark.webp')}" alt="" class="report-print-banner__mark" width="40" height="40" />
            <div class="report-print-banner__copy">
              <div class="report-print-banner__kicker">The 21st Memory · Decoded report</div>
              <div class="report-print-banner__title">${escapeHtml(title)}</div>
              <div class="report-print-banner__url">${escapeHtml(canonical)}</div>
            </div>
          </div>
          ${renderFolioMasthead({ sourceTitle, readingTime })}
          ${renderStudyToolbar()}
          <div id="report-toc-mobile" class="report-toc-mobile" hidden></div>
          <div class="report-layout">
            <aside id="report-toc" class="report-toc" hidden></aside>
            <div class="report-main">
              <div id="report-container" class="report-prerendered">
                ${reportHtml}
              </div>
            </div>
          </div>
        </div>
        ${renderPrevNext({ prev, next, sourceId })}
        ${continueBlock}
      </div>
    </div>`
        : `<div class="max-w-6xl mx-auto px-6 mb-12">${renderPrevNext({ prev, next, sourceId })}${continueBlock}</div>`
    }`;
  }

  const jsonLd = buildJsonLd({
    title,
    description,
    url: canonical,
    image: ogImage,
    sourceTitle,
    dateModified: lastUpdated || new Date().toISOString().slice(0, 10),
    isStub: isStubTopic,
  });

  return `<!DOCTYPE html>
<html lang="en" style="color-scheme:dark;background-color:#0F0A1F">
<head>
    <meta charset="UTF-8">
    <meta name="color-scheme" content="dark">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeAttr(metaDescription)}">
    <meta name="application-name" content="The 21st Memory">
    <meta name="theme-color" content="#0F0A1F">
${robots}    <link rel="canonical" href="${canonical}">
    <link rel="home" href="${BASE_URL}/">
    <link rel="icon" href="${BASE_URL}/images/favicon.webp?v=20260811b" type="image/webp">
    <link rel="icon" href="${BASE_URL}/images/favicon-48.png?v=20260811b" type="image/png" sizes="48x48">
    <link rel="apple-touch-icon" href="${BASE_URL}/images/apple-touch-icon.png?v=20260811b">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${canonical}">
    <meta property="og:site_name" content="The 21st Memory">
    <meta property="og:locale" content="en_US">
    <meta property="og:title" content="${escapeAttr(pageTitle)}">
    <meta property="og:description" content="${escapeAttr(metaDescription)}">
    <meta property="og:image" content="${escapeAttr(ogImage)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeAttr(pageTitle)}">
    <meta name="twitter:description" content="${escapeAttr(metaDescription)}">
    <meta name="twitter:image" content="${escapeAttr(ogImage)}">
${jsonLd}
        <!-- Critical paint: solid vault color before main.css (prevents white flash) -->
    <style>html,body{background-color:#0F0A1F;color-scheme:dark}body{padding-top:calc(5rem + env(safe-area-inset-top,0px))}</style>
    <link rel="preload" href="${ASSET_BASE}assets/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="${ASSET_BASE}assets/fonts/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="${ASSET_BASE}assets/css/main.min.css" as="style">
    <link rel="stylesheet" href="${ASSET_BASE}assets/css/fonts.css">
    <link rel="stylesheet" href="${ASSET_BASE}assets/css/tailwind.css">
    <link rel="stylesheet" href="${ASSET_BASE}assets/css/main.min.css">
</head>
<body class="cosmic-bg page-interior" data-dive-static="true" data-source="${escapeAttr(sourceId)}" data-topic="${escapeAttr(topic.id)}">
    <div id="reading-progress" class="reading-progress" aria-hidden="true" hidden>
        <div class="reading-progress-fill"></div>
    </div>
    <a href="#main" class="skip-link">Skip to content</a>
    ${navbarHTML}
    <main id="main">
${bodyMain}
    </main>

    <div id="infographic-modal" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Full size plate viewer" class="hidden fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4">
        <div id="infographic-modal-inner" class="relative w-full max-w-[98vw] md:max-w-[96vw] max-h-[96vh]">
            <div id="infographic-modal-viewport" class="infographic-modal-viewport">
                <img id="modal-image" src="" alt="Full size plate" class="infographic-modal-image">
            </div>
            <button type="button" id="infographic-modal-close" class="icon-control icon-control--close dive-plate-modal-close" aria-label="Close plate">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
            <div class="dive-plate-modal-hint md:hidden">Pinch or scroll to zoom · Drag to pan</div>
        </div>
    </div>

    ${footerHTML}
    <script src="${ASSET_BASE}assets/js/icons.js" defer></script>
    <script src="${ASSET_BASE}assets/js/topics-utils.js" defer></script>
    <script src="${ASSET_BASE}assets/js/shared.js" defer></script>
    <script src="${ASSET_BASE}assets/js/dive-static.js" defer></script>
</body>
</html>
`;
}

function loadSource(sourceId) {
  const indexPath = path.join(ROOT, 'data', `${sourceId}-topics-index.json`);
  if (!fs.existsSync(indexPath)) return null;
  const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const walked = walkTopics(indexData.topics || []);
  const enriched = walked.map(({ item, path: topicPath }) => {
    const contentPath = path.join(ROOT, 'data', `${sourceId}-topics`, `${item.id}.json`);
    let content = {};
    let lastUpdated = new Date().toISOString().slice(0, 10);
    if (fs.existsSync(contentPath)) {
      content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
      lastUpdated = fs.statSync(contentPath).mtime.toISOString().slice(0, 10);
    }
    const topic = { ...item, ...content, id: item.id, title: item.title || content.title || item.id };
    const stub = isStub(item, content);
    return { item: topic, path: topicPath, isStub: stub, content, lastUpdated };
  });
  return {
    sourceId,
    sourceTitle: indexData.title || sourceId,
    entries: enriched,
  };
}

function rimrafDir(dir) {
  if (!fs.existsSync(dir)) return;
  fs.rmSync(dir, { recursive: true, force: true });
}

function parseOnlyArg(argv) {
  const only = [];
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--only' && argv[i + 1]) {
      const raw = argv[++i];
      const slash = raw.indexOf('/');
      if (slash < 1) throw new Error(`--only expects source/id (got ${raw})`);
      only.push({ source: raw.slice(0, slash), id: raw.slice(slash + 1) });
    }
  }
  return only;
}

function writeDivePage(bundle, entry) {
  const { prev, next } = findAdjacent(bundle.entries, entry.item.id);
  const html = buildPage({
    sourceId: bundle.sourceId,
    sourceTitle: bundle.sourceTitle,
    topic: entry.item,
    topicPath: entry.path,
    isStubTopic: entry.isStub,
    prev,
    next,
    lastUpdated: entry.lastUpdated,
  });
  const outDir = path.join(OUT_ROOT, bundle.sourceId);
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${entry.item.id}.html`);
  fs.writeFileSync(outFile, html, 'utf8');
  return {
    sourceId: bundle.sourceId,
    topicId: entry.item.id,
    path: `/${divePath(bundle.sourceId, entry.item.id)}`,
    live: !entry.isStub,
    title: entry.item.title,
  };
}

function patchManifest(pages) {
  const manifestPath = path.join(ROOT, 'data', 'dive-manifest.json');
  let manifest = { pages: [] };
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch {
      manifest = { pages: [] };
    }
  }
  if (!Array.isArray(manifest.pages)) manifest.pages = [];
  for (const page of pages) {
    const idx = manifest.pages.findIndex(
      (p) => p.sourceId === page.sourceId && p.topicId === page.topicId
    );
    if (idx >= 0) manifest.pages[idx] = page;
    else manifest.pages.push(page);
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
}

/**
 * @param {{ only?: Array<{ source: string, id: string }> }} [opts]
 *   If `only` is set, rebuild those topics plus live prev/next neighbors.
 *   Does not delete other dive pages or restamp their dates.
 */
function buildDives({ only = [] } = {}) {
  const sourcesPath = path.join(ROOT, 'data', 'sources.json');
  const sourcesData = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
  const sources = (sourcesData.sources || []).map((s) => s.id);
  const incremental = only.length > 0;

  if (!incremental) {
    rimrafDir(OUT_ROOT);
  }
  fs.mkdirSync(OUT_ROOT, { recursive: true });

  if (incremental) {
    const rebuilt = [];
    const seen = new Set();
    for (const spec of only) {
      const bundle = loadSource(spec.source);
      if (!bundle) throw new Error(`Unknown source ${spec.source}`);
      const entry = bundle.entries.find((e) => e.item.id === spec.id);
      if (!entry) throw new Error(`${spec.id} not found in ${spec.source} index`);
      const { prev, next } = findAdjacent(bundle.entries, spec.id);
      for (const target of [entry, prev, next]) {
        if (!target) continue;
        const key = `${bundle.sourceId}/${target.item.id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        rebuilt.push(writeDivePage(bundle, target));
        console.log(`Rebuilt dive/${key}.html${target === entry ? '' : ' (neighbor)'}`);
      }
    }
    patchManifest(rebuilt);
    console.log(`build-static-dives incremental — ${rebuilt.length} page(s)`);
    return { incremental: true, pages: rebuilt };
  }

  let liveCount = 0;
  let stubCount = 0;
  const manifest = { pages: [] };

  for (const sourceId of sources) {
    const bundle = loadSource(sourceId);
    if (!bundle) {
      console.warn(`Skip source ${sourceId}: index missing`);
      continue;
    }

    for (const entry of bundle.entries) {
      const page = writeDivePage(bundle, entry);
      if (entry.isStub) stubCount++;
      else liveCount++;
      manifest.pages.push(page);
    }
    console.log(
      `${sourceId}: ${bundle.entries.length} pages (${bundle.entries.filter((e) => !e.isStub).length} live)`
    );
  }

  fs.writeFileSync(
    path.join(ROOT, 'data', 'dive-manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
    'utf8'
  );

  console.log(
    `build-static-dives complete — ${liveCount} live, ${stubCount} stub → dive/`
  );
  return { incremental: false, liveCount, stubCount };
}

if (require.main === module) {
  buildDives({ only: parseOnlyArg(process.argv) });
}

module.exports = { buildDives, parseOnlyArg };
