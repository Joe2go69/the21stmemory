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

function sanitizeReportHtml(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

function renderMarkdown(md) {
  if (!md) return '';
  const html = markedParse(md);
  return enhanceTerminologyHtml(sanitizeReportHtml(html));
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
        let defHtml = liHtml.slice(liHtml.indexOf(strongMatch[0]) + strongMatch[0].length);
        defHtml = defHtml
          .replace(/^(\s|&nbsp;|&#160;)*[-–—:&middot;·•]+\s*/i, '')
          .replace(/^(\s|&nbsp;|&#160;)*/i, '')
          .trim();
        if (!defHtml) continue;
        cards.push(
          `<article class="term-card" role="listitem"><h3 class="term-card__term">${escapeHtml(term)}</h3><div class="term-card__def">${defHtml}</div></article>`
        );
      }

      // Require majority of items to be term/definition rows
      if (cards.length < 2 || cards.length < liMatches.length * 0.5) return match;
      return `${heading}\n<div class="term-card-grid" role="list">\n${cards.join('\n')}\n</div>`;
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

function renderSectionHeading(label, id) {
  const idAttr = id ? ` id="${escapeAttr(id)}"` : '';
  return `<div${idAttr} class="dive-section-head full-bleed-divider mb-8">
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
  if (count === 1) return 'dive-video-grid grid gap-6 grid-cols-1 max-w-2xl mx-auto';
  if (count === 2) return 'dive-video-grid grid gap-6 md:grid-cols-2 max-w-5xl mx-auto';
  return 'dive-video-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3';
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
    <div class="jump-to-pills dive-section-seg mb-4" id="jump-to-pills" role="navigation" aria-label="Topic sections">${pills.join('')}</div>`;
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

function renderContinueLearning({ sourceId, quiz, lastUpdated, assetBase = ASSET_BASE }) {
  const quizHref = quiz?.href ? withAsset(String(quiz.href).replace(/^\//, '')) : '';
  const quizBlock = quizHref
    ? `<a href="${escapeAttr(quizHref)}" class="btn-primary dive-continue__btn">
        <span>${escapeHtml(quizCtaLabel(quiz.title || 'Living Truth'))}</span>
      </a>
      ${quiz.description ? `<p class="dive-continue__hint">${escapeHtml(quiz.description)}</p>` : ''}`
    : `<a href="${assetBase}quizzes.html" class="btn-secondary dive-continue__btn">Browse Living Truth Quizzes</a>`;

  return `
  <aside class="dive-continue content-card static-card rounded-3xl p-6 md:p-8 mt-8" aria-label="Continue learning">
    <h2 class="dive-continue__title">Continue learning</h2>
    <p class="dive-continue__lead">
      This archive is an AI-assisted bridge. For the source material, visit the original transmissions on the Network — then test your understanding with a quiz.
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
  </aside>`;
}

function renderStubActions({ sourceId, assetBase = ASSET_BASE }) {
  return `
  <div class="dive-stub-actions">
    <a href="${assetBase}topics.html?source=${encodeURIComponent(sourceId)}#explore-topics" class="btn-primary dive-continue__btn">Browse ready topics</a>
    <a href="${assetBase}quizzes.html" class="btn-secondary dive-continue__btn">Living Truth Quizzes</a>
    <a href="${assetBase}network.html" class="btn-secondary dive-continue__btn">Thalon Thor Network</a>
  </div>`;
}

function renderVideos(videos) {
  if (!videos?.length) return '';
  return videos
    .map((video) => {
      const title = escapeHtml(video.title || 'Video transmission');
      const embed = escapeAttr(video.embed_url || '');
      const desc = video.description
        ? `<p class="dive-video-card__desc">${escapeHtml(video.description)}</p>`
        : '';
      return `<article class="dive-video-card content-card static-card rounded-3xl p-4">
        <div class="dive-video-card__frame aspect-[16/10] bg-black rounded-2xl overflow-hidden relative">
          <div class="video-poster-wrap absolute inset-0 flex items-center justify-center bg-mem-inset"
               data-rumble-embed="${embed}"
               data-video-title="${title}"
               role="button" tabindex="0"
               aria-label="Play video: ${title}">
            <div class="video-play-btn" aria-hidden="true"><span class="video-play-icon">▶</span></div>
          </div>
        </div>
        <h3 class="dive-video-card__title">${title}</h3>
        ${desc}
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
            <div class="inline-flex items-center px-4 py-1 rounded-full bg-black/40 text-mem-muted text-xs font-semibold tracking-[2px] border border-white/10 mb-4">
              ${escapeHtml(sourceTitle)} · Coming soon
            </div>
            <h1 class="text-4xl md:text-6xl font-semibold tracking-tighter leading-none text-white">${escapeHtml(title)}</h1>
            <div class="deep-dive-hero-accent" aria-hidden="true"></div>
            <p class="text-[17px] text-mem-secondary max-w-[52ch] leading-relaxed mt-4">${escapeHtml(description)}</p>
            <div class="mt-8 flex flex-wrap gap-3">
              <a href="${ASSET_BASE}codex.html" class="btn-topic-nav inline-flex items-center justify-center text-sm px-5">← Back to Codex</a>
              <a href="${ASSET_BASE}topics.html?source=${encodeURIComponent(sourceId)}#explore-topics" class="btn-topic-nav inline-flex items-center justify-center text-sm px-5">← Back to Topics</a>
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
    });

    bodyMain = `
    <div class="max-w-6xl mx-auto px-6 page-shell pb-4">
      <div id="lesson-header" class="mb-10">
        ${breadcrumbs}
        <div class="deep-dive-hero">
          <div class="deep-dive-hero-bg" ${bgStyle}></div>
          <div class="deep-dive-hero-scrim"></div>
          <div class="deep-dive-hero-content">
            <div class="deep-dive-hero-meta">
              <div class="inline-flex items-center px-4 py-1 rounded-full bg-black/40 text-mem-muted text-xs font-semibold tracking-[2px] border border-white/10">
                ${escapeHtml(sourceTitle)}
              </div>
              ${readingTime ? `<span class="deep-dive-reading-time">${escapeHtml(readingTime)}</span>` : ''}
              ${lastUpdated ? `<span class="deep-dive-reading-time" title="Content last updated">Updated ${escapeHtml(lastUpdated)}</span>` : ''}
            </div>
            <h1 class="text-4xl md:text-6xl font-semibold tracking-tighter leading-none text-white">${escapeHtml(title)}</h1>
            <div class="deep-dive-hero-accent" aria-hidden="true"></div>
            <div class="text-[17px] text-mem-secondary max-w-[52ch] leading-relaxed">
              ${(description || '')
                .split('\n\n')
                .map((p) => `<p class="mb-3 last:mb-0">${escapeHtml(p)}</p>`)
                .join('')}
            </div>
            <div class="mt-7 dive-hero-actions">
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
    ${renderSectionHeading('Infographics & slide decks', 'infographics-section')}
    <div class="max-w-6xl mx-auto px-6">
      <div class="dive-media-grid grid md:grid-cols-12 gap-6 mb-10">
        ${
          flags.hasInfographic
            ? `<div class="md:col-span-6${flags.hasSlide ? '' : ' md:col-span-12 max-w-3xl mx-auto'}">
          <div class="dive-media-card media-panel static-card surface-static rounded-card p-4 sm:p-5 h-full flex flex-col">
            <div class="dive-media-card__frame media-frame surface-media w-full max-w-none flex-1">
              <div class="media-scrim rounded-card overflow-hidden dive-media-card__scrim flex items-center justify-center">
                <div class="infographic-artifact" role="button" tabindex="0" aria-label="Open full size infographic" data-infographic-src="${escapeAttr(infographicSrc)}">
                  <img src="${escapeAttr(infographicSrc)}" alt="${escapeHtml(title)} Infographic" loading="lazy" decoding="async" width="800" height="600">
                  <div class="infographic-artifact-caption">
                    <span>Decoded infographic</span>
                    <span class="infographic-artifact-zoom" aria-hidden="true">Expand</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`
            : ''
        }
        ${
          flags.hasSlide
            ? `<div class="md:col-span-6${flags.hasInfographic ? '' : ' md:col-span-12 max-w-3xl mx-auto'}">
          <div class="dive-media-card media-panel static-card surface-static rounded-card p-4 sm:p-5 h-full flex flex-col">
            <div class="dive-media-card__frame media-frame surface-media w-full max-w-none flex-1 mb-3">
              <div class="media-scrim rounded-card overflow-hidden dive-media-card__scrim flex items-center justify-center">
                ${
                  pdfPreview
                    ? `<div class="slide-deck-artifact" role="button" tabindex="0" aria-label="Open slide deck PDF" data-pdf-url="${escapeAttr(topic.slide_deck_pdf_url)}">
                  <img src="${escapeAttr(pdfPreview)}" alt="Slide deck preview - ${escapeHtml(title)}" width="600" height="400" loading="lazy">
                  <div class="slide-deck-artifact-caption">
                    <span>Slide deck preview</span>
                    <span class="slide-deck-artifact-action">Open PDF</span>
                  </div>
                </div>`
                    : `<div class="media-coming-soon-note text-center py-6 px-4 text-sm text-mem-muted">Slide preview — use download below</div>`
                }
              </div>
            </div>
            <a href="${escapeAttr(topic.slide_deck_pdf_url)}" target="_blank" rel="noopener noreferrer"
               class="slide-deck-download-btn btn-secondary w-full inline-flex items-center justify-center gap-x-2 px-6 py-3 text-sm font-semibold rounded-xl">
              Download slide deck PDF
            </a>
          </div>
        </div>`
            : ''
        }
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
    <div id="videos-section" class="mb-8">
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
    <div id="report-section" class="mb-8">
      ${renderSectionHeading('Deep dive report')}
      <div class="max-w-6xl mx-auto px-6">
        <div class="content-card static-card lesson-content-card dive-report-card rounded-3xl p-8 md:p-12 lg:p-16">
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
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeAttr(metaDescription)}">
    <meta name="application-name" content="The 21st Memory">
    <meta name="theme-color" content="#0F0A1F">
${robots}    <link rel="canonical" href="${canonical}">
    <link rel="home" href="${BASE_URL}/">
    <link rel="icon" href="${BASE_URL}/images/21.webp" type="image/webp">
    <link rel="apple-touch-icon" href="${BASE_URL}/images/apple-touch-icon.png">
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
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="${ASSET_BASE}assets/css/main.css" as="style">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600&display=swap">
    <link rel="stylesheet" href="${ASSET_BASE}assets/css/tailwind.css">
    <link rel="stylesheet" href="${ASSET_BASE}assets/css/main.css">
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

    <div id="infographic-modal" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Full size infographic viewer" class="hidden fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-2 md:p-4">
        <div id="infographic-modal-inner" class="relative w-full max-w-[98vw] md:max-w-[96vw] max-h-[96vh]">
            <div id="infographic-modal-viewport" class="infographic-modal-viewport">
                <img id="modal-image" src="" alt="Full size infographic" class="infographic-modal-image">
            </div>
            <button type="button" id="close-modal" class="absolute -top-1 -right-1 md:top-0 md:right-0 z-10 p-2 rounded-full bg-black/60 text-white" aria-label="Close">✕</button>
        </div>
    </div>

    ${footerHTML}
    <script src="${ASSET_BASE}assets/js/icons.js"></script>
    <script src="${ASSET_BASE}assets/js/topics-utils.js"></script>
    <script src="${ASSET_BASE}assets/js/shared.js"></script>
    <script src="${ASSET_BASE}assets/js/dive-static.js"></script>
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

function main() {
  const sourcesPath = path.join(ROOT, 'data', 'sources.json');
  const sourcesData = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
  const sources = (sourcesData.sources || []).map((s) => s.id);

  rimrafDir(OUT_ROOT);
  fs.mkdirSync(OUT_ROOT, { recursive: true });

  let liveCount = 0;
  let stubCount = 0;
  const manifest = { generatedAt: new Date().toISOString(), pages: [] };

  for (const sourceId of sources) {
    const bundle = loadSource(sourceId);
    if (!bundle) {
      console.warn(`Skip source ${sourceId}: index missing`);
      continue;
    }
    const outDir = path.join(OUT_ROOT, sourceId);
    fs.mkdirSync(outDir, { recursive: true });

    for (const entry of bundle.entries) {
      const { prev, next } = findAdjacent(bundle.entries, entry.item.id);
      const html = buildPage({
        sourceId,
        sourceTitle: bundle.sourceTitle,
        topic: entry.item,
        topicPath: entry.path,
        isStubTopic: entry.isStub,
        prev,
        next,
        lastUpdated: entry.lastUpdated,
      });
      const outFile = path.join(outDir, `${entry.item.id}.html`);
      fs.writeFileSync(outFile, html, 'utf8');
      if (entry.isStub) stubCount++;
      else liveCount++;
      manifest.pages.push({
        sourceId,
        topicId: entry.item.id,
        path: `/${divePath(sourceId, entry.item.id)}`,
        live: !entry.isStub,
        title: entry.item.title,
      });
    }
    console.log(
      `${sourceId}: ${bundle.entries.length} pages (${bundle.entries.filter((e) => !e.isStub).length} live)`
    );
  }

  fs.writeFileSync(
    path.join(ROOT, 'data', 'dive-manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf8'
  );

  console.log(
    `build-static-dives complete — ${liveCount} live, ${stubCount} stub → dive/`
  );
}

main();
