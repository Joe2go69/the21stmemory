// Deep-Dive page — topic viewer with breadcrumbs, media, and report

const zoomState = {
  scale: 1,
  fitScale: 1,
  panX: 0,
  panY: 0,
  dragging: false,
  pointerStartX: 0,
  pointerStartY: 0,
  panStartX: 0,
  panStartY: 0,
  lastPinchDistance: 0
};

let infographicModalTrigger = null;
/** AbortController for zoom modal listeners — aborted on close to avoid leaks */
let zoomListenerAbort = null;

function setPageMeta(name, content, attr = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Avoid "Take the The Spirit Tree Quiz" for titles that already start with The. */
function quizCtaLabel(title) {
  const t = String(title || "Living Truth").trim();
  if (/^the\b/i.test(t)) return `Take ${t} Quiz`;
  return `Take the ${t} Quiz`;
}

function updateTopicPageMeta({ topic, sourceId, fullData }) {
  const title = `${topic.title} | ${fullData.title} | The 21st Memory`;
  const description = topic.description || `AI-decoded deep-dive on ${topic.title} from the ${fullData.title} transmission.`;
  const imagePath = topic.topic_image || topic.infographic_image || "images/21.webp";
  const image = new URL(TopicUtils.encodeAssetPath(imagePath), window.location.origin).href;
  const url = `${window.location.origin}${TopicUtils.divePath(sourceId, topic.id)}`;

  document.title = title;
  setPageMeta("description", description);
  setPageMeta("og:title", title, "property");
  setPageMeta("og:description", description, "property");
  setPageMeta("og:image", image, "property");
  setPageMeta("og:url", url, "property");
  setPageMeta("twitter:title", title);
  setPageMeta("twitter:description", description);
  setPageMeta("twitter:image", image);

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url;
}

function renderTopicNav({ topics, sourceId, topicId }) {
  const { prev, next } = TopicUtils.getAdjacentTopics(topics, topicId, { sourceId });
  if (!prev && !next) return "";

  const navItem = (entry, direction) => {
    if (!entry) return `<div class="topic-prev-next__slot topic-prev-next__slot--empty"></div>`;
    const icon = direction === "prev"
      ? (typeof renderSiteIcon === "function" ? renderSiteIcon("arrowLeft", "card-icon-sm") : "")
      : (typeof renderSiteIcon === "function" ? renderSiteIcon("arrowRight", "card-icon-sm") : "");
    const label = direction === "prev" ? "Previous" : "Next";
    const safeSource = encodeURIComponent(sourceId);
    const safeTopic = encodeURIComponent(entry.id);
    const safeTitle = escapeHtml(entry.title);
    return `
      <a href="${TopicUtils.diveUrl(sourceId, entry.id)}" class="topic-prev-next__link topic-prev-next__link--${direction}">
        ${direction === "prev" ? `${icon}<span class="topic-prev-next__text"><span class="topic-prev-next__label">${label}</span><span class="topic-prev-next__title">${safeTitle}</span></span>` : `<span class="topic-prev-next__text"><span class="topic-prev-next__label">${label}</span><span class="topic-prev-next__title">${safeTitle}</span></span>${icon}`}
      </a>`;
  };

  return `${navItem(prev, "prev")}${navItem(next, "next")}`;
}

function setupReadingProgress() {
  if (typeof TopicUtils !== "undefined" && TopicUtils.initReportReadingProgress) {
    TopicUtils.initReportReadingProgress();
    return;
  }
  const bar = document.getElementById("reading-progress");
  const fill = bar?.querySelector(".reading-progress-fill");
  const report = document.getElementById("report-container");
  if (!bar || !fill || !report) return;

  const update = () => {
    const rect = report.getBoundingClientRect();
    const chrome = 96;
    const start = window.scrollY + rect.top - chrome;
    const readable = Math.max(report.offsetHeight - (window.innerHeight - chrome), 1);
    const progress = Math.min(1, Math.max(0, (window.scrollY - start) / readable));
    fill.style.width = `${Math.round(progress * 100)}%`;
    bar.hidden = progress <= 0 || progress >= 1;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function initDeepDiveStudyToolbar(toolbar) {
  if (!toolbar) return;
  // Phase 4: font size + focus mode + print (shared with static dives)
  if (typeof TopicUtils !== 'undefined' && TopicUtils.initReadingComfort) {
    TopicUtils.initReadingComfort({ toolbar });
    return;
  }
  if (toolbar.dataset.bound === '1') return;
  toolbar.dataset.bound = '1';
  toolbar.querySelector('[data-report-print]')?.addEventListener('click', () => window.print());
}

async function diveCopyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_) { /* fall through */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch (_) {
    return false;
  }
}

function initDeepDiveShareMenus() {
  document.querySelectorAll('.share-menu').forEach((menu) => {
    if (menu.dataset.bound === '1') return;
    menu.dataset.bound = '1';
    const toggle = menu.querySelector('.share-menu__toggle');
    const panel = menu.querySelector('.share-menu__panel');
    if (!toggle || !panel) return;

    const pageUrl = menu.getAttribute('data-share-url') || window.location.href;
    const pageTitle = menu.getAttribute('data-share-title') || document.title;
    const reportUrl = pageUrl.replace(/#.*$/, '') + '#report-section';

    const close = () => {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    };
    const open = () => {
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
    };

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (panel.hidden) open();
      else close();
    });

    panel.querySelectorAll('[data-share-action]').forEach((item) => {
      item.addEventListener('click', async (e) => {
        e.stopPropagation();
        const action = item.getAttribute('data-share-action');
        const original = item.textContent;
        let ok = false;
        let msg = original;
        if (action === 'copy-link') {
          ok = await diveCopyText(pageUrl);
          msg = ok ? 'Link copied' : 'Copy failed';
        } else if (action === 'copy-report') {
          ok = await diveCopyText(reportUrl);
          msg = ok ? 'Report link copied' : 'Copy failed';
        } else if (action === 'copy-title') {
          ok = await diveCopyText(`${pageTitle}\n${pageUrl}`);
          msg = ok ? 'Copied title + URL' : 'Copy failed';
        } else if (action === 'native-share') {
          if (navigator.share) {
            try {
              await navigator.share({ title: pageTitle, url: pageUrl });
              ok = true;
              msg = 'Shared';
            } catch (_) {
              msg = original;
            }
          } else {
            ok = await diveCopyText(pageUrl);
            msg = ok ? 'Link copied' : 'Share unavailable';
          }
        }
        item.textContent = msg;
        setTimeout(() => {
          item.textContent = original;
          if (ok) close();
        }, 1600);
      });
    });

    const nativeBtn = panel.querySelector('[data-share-action="native-share"]');
    if (nativeBtn && !navigator.share) nativeBtn.hidden = true;

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target)) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  });
}

function initDeepDiveSectionNavSticky() {
  if (document.querySelector('.section-nav-sticky')) return;
  const heroPills = document.getElementById('jump-to-pills');
  if (!heroPills) return;

  const sectionIds = [...heroPills.querySelectorAll('[data-jump-section]')]
    .map((btn) => btn.getAttribute('data-jump-section'))
    .filter((id) => id && document.getElementById(id));
  if (!sectionIds.length) return;

  const sticky = document.createElement('div');
  sticky.className = 'section-nav-sticky';
  sticky.setAttribute('aria-label', 'Topic sections');
  sticky.innerHTML = `<div class="dive-section-seg dive-section-seg--sticky">${sectionIds
    .map((id) => {
      const label = heroPills.querySelector(`[data-jump-section="${id}"]`)?.textContent?.trim() || id;
      return `<button type="button" data-jump-section="${id}" class="btn-jump-pill">${escapeHtml(label)}</button>`;
    })
    .join('')}</div>`;
  document.body.appendChild(sticky);

  const allPills = () =>
    document.querySelectorAll('#jump-to-pills [data-jump-section], .section-nav-sticky [data-jump-section]');
  const setActive = (activeId) => {
    allPills().forEach((pill) => {
      const on = !!activeId && pill.getAttribute('data-jump-section') === activeId;
      pill.classList.toggle('is-active', on);
      pill.classList.toggle('active', on);
      if (on) pill.setAttribute('aria-current', 'true');
      else pill.removeAttribute('aria-current');
    });
  };

  sticky.querySelectorAll('[data-jump-section]').forEach((pill) => {
    pill.addEventListener('click', () => {
      const id = pill.getAttribute('data-jump-section');
      setActive(id);
      TopicUtils.scrollToSection(id);
    });
  });

  if (typeof TopicUtils !== 'undefined' && TopicUtils.bindSectionPillSpy) {
    TopicUtils.bindSectionPillSpy(sectionIds, setActive);
  }

  const updateStickyVisibility = () => {
    const rect = heroPills.getBoundingClientRect();
    sticky.classList.toggle('is-visible', rect.bottom < 72);
  };
  updateStickyVisibility();
  window.addEventListener('scroll', updateStickyVisibility, { passive: true });
  window.addEventListener('resize', updateStickyVisibility);
}

function escapeAttr(value) {
  return TopicUtils.escapeAttr(value);
}

function escapeHtml(value) {
  return TopicUtils.escapeHtml(value);
}

function sanitizeReportHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script, iframe, object, embed, form, style').forEach((el) => el.remove());
  doc.querySelectorAll('*').forEach((el) => {
    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const val = attr.value.trim().toLowerCase();
      if (name.startsWith('on') || (name === 'href' && val.startsWith('javascript:'))) {
        el.removeAttribute(attr.name);
      }
    });
  });
  return doc.body.innerHTML;
}

function renderMarkdownReport(markdown) {
  if (typeof marked === 'undefined') {
    return '<div class="text-center py-12 text-mem-muted">Report renderer unavailable. Please refresh the page.</div>';
  }
  return sanitizeReportHtml(marked.parse(markdown));
}

const MediaEmpty = {
  replace(el, icon, message, muted = false) {
    const wrap = document.createElement('div');
    wrap.className = 'w-full h-full flex items-center justify-center p-4';
    wrap.innerHTML = RenderUtils.renderEmptyState(icon, message, { muted });
    el.replaceWith(wrap);
    if (typeof hydrateSiteIcons === 'function') hydrateSiteIcons(wrap);
  }
};

window.MediaEmpty = MediaEmpty;

function getTopicVideoLanguages(topic) {
  if (Array.isArray(topic.video_languages) && topic.video_languages.length) {
    return topic.video_languages.filter((l) => l && Array.isArray(l.videos) && l.videos.length);
  }
  return null;
}

function getDefaultTopicVideos(topic) {
  const langs = getTopicVideoLanguages(topic);
  if (langs?.length) {
    const en = langs.find((l) => l.code === 'en');
    return (en || langs[0]).videos || [];
  }
  return topic.rumble_videos || [];
}

function diveVideoGridClass(count) {
  let videoGridClass = 'grid gap-6';
  if (count === 1) videoGridClass += ' grid-cols-1 max-w-2xl mx-auto';
  else if (count === 2) videoGridClass += ' md:grid-cols-2 max-w-5xl mx-auto justify-center';
  else videoGridClass += ' md:grid-cols-2 lg:grid-cols-3';
  return videoGridClass;
}

function getTopicMediaFlags(topic) {
  const hasInfographic = !!(topic.infographic_image && String(topic.infographic_image).trim());
  const hasSlide = !!(topic.slide_deck_pdf_url && String(topic.slide_deck_pdf_url).trim() && topic.slide_deck_pdf_url !== '#');
  const hasVideos = getDefaultTopicVideos(topic).length > 0;
  const hasReport = !!(topic.report && String(topic.report).trim());
  return {
    hasInfographic,
    hasSlide,
    hasMediaPanel: hasInfographic || hasSlide,
    hasVideos,
    hasReport,
    hasAny: hasInfographic || hasSlide || hasVideos || hasReport
  };
}

function renderJumpPills(flags) {
  const pills = [];
  if (flags.hasMediaPanel) {
    pills.push(`
      <button type="button" data-jump-section="infographics-section" class="btn-jump-pill" aria-label="Scroll to infographics and slide decks section">Infographics</button>`);
  }
  if (flags.hasVideos) {
    pills.push(`
      <button type="button" data-jump-section="videos-section" class="btn-jump-pill" aria-label="Scroll to video transmissions section">Videos</button>`);
  }
  if (flags.hasReport) {
    pills.push(`
      <button type="button" data-jump-section="report-section" class="btn-jump-pill" aria-label="Scroll to deep dive report section">Report</button>`);
  }
  if (!pills.length) return '';
  return `
    <div class="dive-jump-label">In this topic</div>
    <div class="jump-to-pills dive-section-seg" id="jump-to-pills" role="navigation" aria-label="Topic sections">
      ${pills.join('')}
    </div>`;
}

function renderCinematicHero({ breadcrumbs, fullData, topic, sourceId, mediaFlags }) {
  const rawHeroImage = (topic.topic_image || topic.infographic_image || '').replace(/\\/g, '/');
  const heroImage = TopicUtils.isResolvableTopicImage(rawHeroImage, topic.is_placeholder)
    ? TopicUtils.encodeAssetPath(rawHeroImage)
    : '';
  const readingTime = topic.report ? TopicUtils.estimateReadingTime(topic.report) : '';
  const bgStyle = heroImage
    ? `style="background-image: url('${escapeAttr(heroImage)}')"`
    : '';
  const flags = mediaFlags || getTopicMediaFlags(topic);

  return `
    ${breadcrumbs}
    <div class="deep-dive-hero">
      <div class="deep-dive-hero-bg" ${bgStyle}></div>
      <div class="deep-dive-hero-scrim"></div>
      <div class="deep-dive-hero-content">
        <div class="deep-dive-hero-meta">
          <span class="deep-dive-hero-meta__path">${escapeHtml(fullData.title)}</span>
          ${readingTime ? `<span class="deep-dive-hero-meta__dot" aria-hidden="true">·</span><span class="deep-dive-hero-meta__item">${escapeHtml(readingTime)}</span>` : ''}
        </div>
        <h1 class="page-hero-title--dive">${escapeHtml(topic.title)}</h1>
        <div class="deep-dive-hero-accent" aria-hidden="true"></div>
        ${
          (topic.description || '').trim()
            ? `<p class="deep-dive-hero-deck">${escapeHtml(String(topic.description).split(/\n\n+/)[0].trim())}</p>`
            : ''
        }
        <div class="dive-hero-actions">
          ${renderJumpPills(flags)}
          ${topic.quiz?.href ? `
          <div class="deep-dive-quiz-cta">
            <a href="${escapeAttr(topic.quiz.href)}" class="btn-primary deep-dive-quiz-cta__btn">
              <span>${escapeHtml(quizCtaLabel(topic.quiz.title || 'Living Truth'))}</span>
            </a>
            ${topic.quiz.description ? `<p class="deep-dive-quiz-cta__desc">${escapeHtml(topic.quiz.description)}</p>` : ''}
          </div>
          ` : ''}
          <nav class="dive-hero-links" aria-label="Topic links">
            <a href="codex.html#codex-pill" class="dive-hero-link">Codex</a>
            <span class="dive-hero-link-sep" aria-hidden="true">·</span>
            <a href="topics.html?source=${encodeURIComponent(sourceId)}#explore-topics"
               class="dive-hero-link"
               data-back-to-topics
               data-source-id="${escapeAttr(sourceId)}"
               data-topic-id="${escapeAttr(topic.id)}">Topics</a>
            <span class="dive-hero-link-sep" aria-hidden="true">·</span>
            <a href="network.html" class="dive-hero-link">Network</a>
            <span class="dive-hero-link-sep" aria-hidden="true">·</span>
            <div class="share-menu share-menu--inline" data-share-url="${escapeAttr(`${window.location.origin}${TopicUtils.divePath(sourceId, topic.id)}`)}" data-share-title="${escapeAttr(topic.title)}">
              <button type="button" class="dive-hero-link share-menu__toggle" aria-expanded="false" aria-haspopup="true" aria-label="Share this topic">Share</button>
              <div class="share-menu__panel" role="menu" hidden>
                <button type="button" class="share-menu__item" role="menuitem" data-share-action="copy-link">Copy link</button>
                <button type="button" class="share-menu__item" role="menuitem" data-share-action="copy-report">Copy report link</button>
                <button type="button" class="share-menu__item" role="menuitem" data-share-action="copy-title">Copy title + URL</button>
                <button type="button" class="share-menu__item" role="menuitem" data-share-action="native-share">Share…</button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  `;
}

function setSectionHidden(sectionId, hide, { hideNextSibling = false } = {}) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  el.hidden = hide;
  if (hideNextSibling && el.nextElementSibling) {
    el.nextElementSibling.hidden = hide;
  }
}

function renderCompactComingSoon(message) {
  return `<div class="media-coming-soon-note text-center py-6 px-4 text-sm text-mem-muted">${escapeHtml(message)}</div>`;
}

function renderSlideDeckArtifact({ pdfUrl, previewSrc, topicTitle }) {
  const safeUrl = escapeAttr(pdfUrl || '#');
  const safePreviewSrc = escapeAttr(previewSrc);
  const safeTitle = escapeHtml(topicTitle);
  const actionIcon = typeof renderSiteIcon === 'function' ? renderSiteIcon('file', 'card-icon-sm') : '';
  const preview = safePreviewSrc
    ? `<img src="${safePreviewSrc}" alt="Slide deck preview - ${safeTitle}"
           width="600" height="400" loading="lazy"
           onerror="MediaEmpty.replace(this,'file','Preview image unavailable',true)">`
    : `<div class="dive-plate__void" aria-hidden="true"></div>`;
  return `
    <div class="slide-deck-artifact dive-plate${safePreviewSrc ? '' : ' dive-plate--empty'}" role="button" tabindex="0" aria-label="Open slide deck PDF" data-pdf-url="${safeUrl}">
      ${preview}
      <div class="slide-deck-artifact-caption dive-plate-caption">
        <span>Deck</span>
        <span class="slide-deck-artifact-action dive-plate-action">${actionIcon} Open PDF</span>
      </div>
    </div>
  `;
}

function setupSlideDeckArtifact(container) {
  const artifact = container?.querySelector('.slide-deck-artifact');
  if (!artifact) return;

  const openPdf = () => {
    const url = artifact.dataset.pdfUrl;
    if (url && url !== '#') window.open(url, '_blank');
  };

  artifact.addEventListener('click', openPdf);
  artifact.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPdf();
    }
  });
}

function setupJumpToPills() {
  const pills = document.querySelectorAll('#jump-to-pills [data-jump-section]');
  const sectionIds = [...pills]
    .map((pill) => pill.getAttribute('data-jump-section'))
    .filter((id) => id && document.getElementById(id));

  const setActive = (activeId) => {
    document
      .querySelectorAll('#jump-to-pills [data-jump-section], .section-nav-sticky [data-jump-section]')
      .forEach((pill) => {
        const on = !!activeId && pill.getAttribute('data-jump-section') === activeId;
        pill.classList.toggle('is-active', on);
        pill.classList.toggle('active', on);
        if (on) pill.setAttribute('aria-current', 'true');
        else pill.removeAttribute('aria-current');
      });
  };

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const id = pill.getAttribute('data-jump-section');
      setActive(id);
      TopicUtils.scrollToSection(id);
    });
  });

  if (TopicUtils.bindSectionPillSpy) {
    TopicUtils.bindSectionPillSpy(sectionIds, setActive);
  }
}

/** Ensure "Back to Topics" restores the opened topic in the list. */
function renderContinueLearning({ sourceId, topic }) {
  const quiz = topic.quiz;
  const hideQuizCta = Boolean(quiz?.href);
  const quizHref = quiz?.href ? escapeAttr(quiz.href) : '';
  const quizBlock = hideQuizCta
    ? ''
    : quizHref
    ? `<a href="${quizHref}" class="btn-primary dive-continue__btn">
        <span>${escapeHtml(quizCtaLabel(quiz.title || 'Living Truth'))}</span>
      </a>
      ${quiz.description ? `<p class="dive-continue__hint">${escapeHtml(quiz.description)}</p>` : ''}`
    : `<a href="quizzes.html" class="btn-secondary dive-continue__btn">Browse Living Truth Quizzes</a>`;

  return `
  <aside class="dive-continue content-card static-card p-6 md:p-8 mt-8" aria-label="Continue learning">
    <h2 class="dive-continue__title">Continue learning</h2>
    <p class="dive-continue__lead">
      This archive is an AI-assisted bridge. For the source material, visit the original transmissions on the Network.
    </p>
    <div class="dive-continue__actions">
      ${quizBlock}
      <a href="network.html" class="btn-secondary dive-continue__btn">Open the Thalon Thor Network</a>
      <a href="topics.html?source=${encodeURIComponent(sourceId)}#explore-topics" class="text-link dive-continue__link">More topics in this transmission →</a>
    </div>
    <p class="dive-continue__disclaimer">
      AI may miss higher-dimensional nuance. Prefer the raw transmissions when anything feels incomplete.
    </p>
  </aside>
  <p class="dive-support-note">This topic is free to share. <a href="support.html" class="text-link">Support the archive →</a></p>`;
}

function setupBackToTopicsLinks(sourceId, topicId) {
  document.querySelectorAll('[data-back-to-topics]').forEach((link) => {
    if (link.dataset.backBound === 'true') return;
    link.dataset.backBound = 'true';
    link.addEventListener('click', () => {
      const sid = link.dataset.sourceId || sourceId;
      const tid = link.dataset.topicId || topicId;
      // Preserve filters/scroll if user already left from topics; otherwise seed a return target
      const existing = TopicUtils.peekNavReturnState();
      if (existing?.page === 'topics' && existing.sourceId === sid) {
        TopicUtils.saveNavReturnState({
          ...existing,
          topicId: tid || existing.topicId,
          sourceId: sid
        });
      } else {
        TopicUtils.saveNavReturnState({
          page: 'topics',
          sourceId: sid,
          topicId: tid,
          filters: existing?.page === 'topics' ? existing.filters : { status: 'all', category: 'all', search: '' },
          scrollY: existing?.scrollY
        });
      }
    });
  });
}

function maybeRedirectToStaticDive() {
  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get('source');
  const topic = urlParams.get('topic');
  if (!source || !topic) return false;
  // Prefer SEO static pages when this shell is opened with query params
  const path = (window.location.pathname || '').replace(/\\/g, '/');
  if (!/deep-dive\.html$/i.test(path)) return false;
  const target = TopicUtils.divePath(source, topic);
  const next = `${window.location.origin}${target}${window.location.hash || ''}`;
  window.location.replace(next);
  return true;
}

async function loadLessonViewer() {
  if (maybeRedirectToStaticDive()) return;

  const urlParams = new URLSearchParams(window.location.search);
  const rawSource = urlParams.get('source');
  const topicId = urlParams.get('topic');

  const headerContainer = document.getElementById('lesson-header');
  const infographicContainer = document.getElementById('infographic-container');
  const pdfContainer = document.getElementById('pdf-container');
  const videosContainer = document.getElementById('videos-container');
  const reportContainer = document.getElementById('report-container');
  const pdfPreviewContainer = document.getElementById('pdf-preview-container');
  const tocContainer = document.getElementById('report-toc');
  const tocMobile = document.getElementById('report-toc-mobile');

  if (!headerContainer || !infographicContainer || !pdfContainer || !videosContainer || !reportContainer) {
    console.error('Deep-dive page is missing required DOM containers');
    return;
  }

  // Hide all content shells until we know what exists
  setSectionHidden('infographics-section', true, { hideNextSibling: true });
  setSectionHidden('videos-section', true);
  setSectionHidden('report-section', true);

  if (!topicId) {
    headerContainer.innerHTML = `
      <div class="text-center py-12">
        <p class="text-red-400 mb-4">No topic specified.</p>
        <a href="codex.html" class="btn-primary">← Back to Codex</a>
      </div>`;
    return;
  }

  headerContainer.innerHTML = TopicUtils.skeleton('deep-dive');

  try {
    const resolved = await TopicUtils.resolveSourceId(rawSource);
    if (!resolved.ok) {
      headerContainer.innerHTML = TopicUtils.renderSourceError(resolved);
      document.title = 'Transmission not found | The 21st Memory';
      return;
    }
    const sourceId = resolved.sourceId;

    const fullData = await TopicUtils.fetchSourceIndex(sourceId);
    const lightTopic = TopicUtils.findTopicById(fullData.topics, topicId);
    const topicPath = TopicUtils.findTopicPath(fullData.topics, topicId);

    if (!lightTopic) {
      headerContainer.innerHTML = `
        <div class="text-center py-12">
          <p class="text-red-400 mb-4">Topic not found: ${escapeHtml(topicId)}</p>
          <a href="topics.html?source=${encodeURIComponent(sourceId)}" class="btn-primary">← Back to topics</a>
        </div>`;
      return;
    }

    const topicContent = await TopicUtils.fetchTopicContent(sourceId, topicId);
    const topic = { ...lightTopic, ...topicContent };
    const flags = getTopicMediaFlags(topic);

    updateTopicPageMeta({ topic, sourceId, fullData });

    const breadcrumbs = TopicUtils.renderBreadcrumbs({
      sourceId,
      sourceTitle: fullData.title,
      topicPath,
      currentTitle: topic.title
    });

    headerContainer.innerHTML = renderCinematicHero({ breadcrumbs, fullData, topic, sourceId, mediaFlags: flags });
    headerContainer.classList.remove('content-card', 'static-card', 'rounded-3xl', 'rounded-card', 'p-8', 'md:p-12');
    setupJumpToPills();

    const topicNav = document.getElementById("topic-nav");
    if (topicNav) {
      const navHtml = renderTopicNav({ topics: fullData.topics, sourceId, topicId });
      if (navHtml) {
        topicNav.innerHTML = navHtml;
        topicNav.hidden = false;
      } else {
        topicNav.hidden = true;
      }
    }

    if (!flags.hasAny) {
      headerContainer.insertAdjacentHTML('afterend', `
        <div class="max-w-2xl mx-auto text-center py-20 px-6">
          ${typeof renderSiteIcon === 'function' ? `<div class="mb-8 flex justify-center">${renderSiteIcon('star', 'card-icon-lg')}</div>` : ''}
          <h2 class="text-4xl font-semibold tracking-tighter mb-6">This Topic Continues to Unfold</h2>
          <p class="text-mem-soft text-lg max-w-lg mx-auto leading-relaxed mb-10">
            The complete Codex experience for this topic is being prepared with care,
            encompassing infographics, slide decks, video transmissions, and a deep-dive report.
            The Great Remembering reveals its wisdom in perfect timing.
          </p>
          <a href="topics.html?source=${encodeURIComponent(sourceId)}#explore-topics"
             class="btn-primary"
             data-back-to-topics
             data-source-id="${escapeAttr(sourceId)}"
             data-topic-id="${escapeAttr(topicId)}">← Back to topics</a>
          <div class="mt-8 text-xs text-mem-dim tracking-wide">More content coming soon</div>
        </div>
      `);
      setupBackToTopicsLinks(sourceId, topicId);
      return;
    }

    setupBackToTopicsLinks(sourceId, topicId);

    // --- Infographics + slide deck (only if either exists) ---
    if (flags.hasMediaPanel) {
      setSectionHidden('infographics-section', false, { hideNextSibling: true });

      const infoCol = infographicContainer.closest('.md\\:col-span-6') || infographicContainer.parentElement?.parentElement;
      const pdfCol = pdfPreviewContainer?.closest('.md\\:col-span-6') || pdfPreviewContainer?.parentElement?.parentElement;

      if (flags.hasInfographic) {
        const infographicSrc = TopicUtils.encodeAssetPath(topic.infographic_image);
        infographicContainer.innerHTML = `
          <div class="infographic-artifact dive-plate" role="button" tabindex="0" aria-label="Open full size plate" data-infographic-src="${escapeAttr(infographicSrc)}">
            <img src="${escapeAttr(infographicSrc)}" alt="${escapeHtml(topic.title)} infographic"
                 loading="lazy" decoding="async"
                 onerror="MediaEmpty.replace(this,'archive','Infographic coming soon')">
            <div class="infographic-artifact-caption dive-plate-caption">
              <span>Plate</span>
              <span class="infographic-artifact-zoom dive-plate-action" aria-hidden="true">${typeof renderSiteIcon === 'function' ? renderSiteIcon('expand', 'card-icon-sm') : ''} Expand</span>
            </div>
          </div>
        `;
        infographicContainer.querySelector('.infographic-artifact')?.addEventListener('click', (e) => {
          const src = e.currentTarget.dataset.infographicSrc;
          if (src) openInfographicModal(src, e.currentTarget);
        });
        infographicContainer.querySelector('.infographic-artifact')?.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const src = e.currentTarget.dataset.infographicSrc;
            if (src) openInfographicModal(src, e.currentTarget);
          }
        });
      } else if (infoCol) {
        infoCol.hidden = true;
      } else {
        infographicContainer.innerHTML = renderCompactComingSoon('Infographic coming soon');
      }

      if (pdfPreviewContainer) {
        if (flags.hasSlide) {
          const pdfUrl = topic.slide_deck_pdf_url;
          if (topic.pdf_preview_image) {
            pdfPreviewContainer.innerHTML = renderSlideDeckArtifact({
              pdfUrl,
              previewSrc: TopicUtils.encodeAssetPath(topic.pdf_preview_image),
              topicTitle: topic.title
            });
            setupSlideDeckArtifact(pdfPreviewContainer);
          } else {
            const fileIdMatch = topic.slide_deck_pdf_url.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
            if (fileIdMatch?.[1]) {
              const thumbUrl = `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=1400`;
              pdfPreviewContainer.innerHTML = renderSlideDeckArtifact({
                pdfUrl: topic.slide_deck_pdf_url,
                previewSrc: thumbUrl,
                topicTitle: topic.title
              });
              setupSlideDeckArtifact(pdfPreviewContainer);
            } else {
              pdfPreviewContainer.innerHTML = renderSlideDeckArtifact({
                pdfUrl: topic.slide_deck_pdf_url,
                previewSrc: '',
                topicTitle: topic.title
              });
              setupSlideDeckArtifact(pdfPreviewContainer);
            }
          }
          if (pdfContainer) pdfContainer.innerHTML = '';
        } else if (pdfCol) {
          pdfCol.hidden = true;
        } else {
          pdfPreviewContainer.innerHTML = renderCompactComingSoon('Slide deck coming soon');
          pdfContainer.innerHTML = '';
        }
      }

      // If only one column remains, expand it to full width when possible
      if (flags.hasInfographic && !flags.hasSlide && infoCol) {
        infoCol.classList.remove('md:col-span-6');
        infoCol.classList.add('md:col-span-12', 'max-w-3xl', 'mx-auto');
      } else if (!flags.hasInfographic && flags.hasSlide && pdfCol) {
        pdfCol.classList.remove('md:col-span-6');
        pdfCol.classList.add('md:col-span-12', 'max-w-3xl', 'mx-auto');
      }
    }

    // --- Videos ---
    if (flags.hasVideos) {
      setSectionHidden('videos-section', false);
      const videoLangs = getTopicVideoLanguages(topic);
      let videos = getDefaultTopicVideos(topic);
      const sectionWrap = videosContainer.parentElement;
      const existingBar = sectionWrap?.querySelector('#video-lang-bar');
      if (existingBar) existingBar.remove();
      const existingData = sectionWrap?.querySelector('#video-languages-data');
      if (existingData) existingData.remove();

      const renderVideoSet = (list) => {
        videosContainer.className = diveVideoGridClass(list.length);
        videosContainer.innerHTML = list
          .map((video) => RenderUtils.renderLazyRumbleCard(video))
          .join('');
        TopicUtils.setupClickToPlayVideos(videosContainer);
        RenderUtils.setupImageFallbacks(videosContainer, 'img[data-img-fallback]');
        if (typeof window.initParticleBackgrounds === 'function') {
          requestAnimationFrame(() => window.initParticleBackgrounds(videosContainer));
        }
      };

      if (videoLangs && videoLangs.length > 1 && sectionWrap) {
        const options = videoLangs
          .map((lang) => {
            const code = TopicUtils.escapeAttr(lang.code || '');
            const label = TopicUtils.escapeHtml(lang.native_label || lang.label || lang.code || '');
            return `<option value="${code}">${label}</option>`;
          })
          .join('');
        const bar = document.createElement('div');
        bar.className = 'video-lang-bar';
        bar.id = 'video-lang-bar';
        bar.innerHTML = `
          <label class="video-lang-bar__label" for="video-lang-select">Watch in</label>
          <div class="video-lang-bar__control">
            <select id="video-lang-select" class="video-lang-select" aria-label="Video language">${options}</select>
          </div>`;
        sectionWrap.insertBefore(bar, videosContainer);

        const STORAGE_KEY = '21st-memory-video-lang';
        const select = bar.querySelector('#video-lang-select');
        let initial = 'en';
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored && videoLangs.some((l) => l.code === stored)) initial = stored;
          else {
            const nav = String(navigator.language || '').slice(0, 2).toLowerCase();
            if (nav && nav !== 'en' && videoLangs.some((l) => l.code === nav)) initial = nav;
          }
        } catch { /* ignore */ }
        if (select) {
          select.value = initial;
          const apply = (code) => {
            const lang = videoLangs.find((l) => l.code === code) || videoLangs[0];
            renderVideoSet(lang.videos || []);
            try { localStorage.setItem(STORAGE_KEY, lang.code); } catch { /* ignore */ }
          };
          apply(select.value);
          select.addEventListener('change', () => apply(select.value));
          if (typeof initVaultSelects === 'function') initVaultSelects(bar);
        } else {
          renderVideoSet(videos);
        }
      } else {
        renderVideoSet(videos);
      }
    }

    // --- Report ---
    const studyToolbar = document.getElementById('report-study-toolbar');
    if (flags.hasReport) {
      setSectionHidden('report-section', false);
      reportContainer.innerHTML = renderMarkdownReport(topic.report);
      if (typeof TopicUtils.enhanceTerminologyCards === 'function') {
        TopicUtils.enhanceTerminologyCards(reportContainer);
      }
      const lead = reportContainer.querySelector("h1 + p, p");
      if (lead) lead.classList.add("report-lead");
      setupReadingProgress();
      reportContainer.querySelectorAll('h1, h2, h3').forEach(el => {
        el.classList.add('tracking-tight', 'font-semibold');
        if (el.tagName === 'H1') el.classList.add('font-bold');
      });
      TopicUtils.buildReportToc(reportContainer, tocContainer, tocMobile);
      if (studyToolbar) {
        studyToolbar.hidden = false;
        initDeepDiveStudyToolbar(studyToolbar);
      }
    } else if (tocContainer) {
      tocContainer.hidden = true;
      if (tocMobile) tocMobile.hidden = true;
      if (studyToolbar) studyToolbar.hidden = true;
    }

    initDeepDiveShareMenus();
    initDeepDiveSectionNavSticky();

    // Trust / next-steps footer (quiz + network + AI disclaimer)
    const reportSection = document.getElementById('report-section');
    const topicNavEl = document.getElementById('topic-nav');
    const continueHtml = renderContinueLearning({ sourceId, topic });
    if (topicNavEl && !topicNavEl.hidden) {
      topicNavEl.insertAdjacentHTML('afterend', continueHtml);
    } else if (reportSection) {
      reportSection.insertAdjacentHTML('beforeend',
        `<div class="max-w-6xl mx-auto px-6">${continueHtml}</div>`);
    } else {
      headerContainer.insertAdjacentHTML('afterend',
        `<div class="max-w-6xl mx-auto px-6 mb-12">${continueHtml}</div>`);
    }
  } catch (error) {
    console.error('Error loading lesson:', error);
    if (!headerContainer) return;
    const errorIcon = typeof renderSiteIcon === 'function'
      ? `<div class="flex justify-center mb-4 text-red-400">${renderSiteIcon('archive', 'card-icon-lg')}</div>`
      : '';
    headerContainer.innerHTML = `
      <div class="text-center py-20">
        ${errorIcon}
        <h2 class="text-2xl font-semibold text-red-400 mb-4">Unable to load lesson</h2>
        <p class="text-mem-soft max-w-md mx-auto">${escapeHtml(error.message)}</p>
        <a href="codex.html" class="inline-block mt-8 text-sm underline">Return to Codex</a>
      </div>
    `;
  }
}

function touchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

function getZoomViewport(img) {
  return document.getElementById('infographic-modal-viewport') || img.parentElement;
}

function computeFitScale(img) {
  const viewport = getZoomViewport(img);
  if (!viewport || !img.naturalWidth || !img.naturalHeight) return 1;

  const { width, height } = viewport.getBoundingClientRect();
  if (width <= 0 || height <= 0) return 1;

  return Math.min(width / img.naturalWidth, height / img.naturalHeight, 1);
}

function getMaxZoom() {
  const fitScale = zoomState.fitScale || 1;
  // Allow zooming to at least 1:1 native pixels for readable text.
  return Math.max(4, (1 / fitScale) * 1.05);
}

function applyZoomTransform(img) {
  const naturalWidth = img.naturalWidth;
  const naturalHeight = img.naturalHeight;

  if (!naturalWidth || !naturalHeight) {
    img.style.transform = `translate3d(${zoomState.panX}px, ${zoomState.panY}px, 0) scale(${zoomState.scale})`;
    img.style.cursor = zoomState.scale > 1 ? (zoomState.dragging ? 'grabbing' : 'grab') : 'zoom-in';
    return;
  }

  const fitScale = Math.max(zoomState.fitScale || computeFitScale(img), 0.01);
  const totalScale = fitScale * zoomState.scale;

  img.style.width = `${naturalWidth * totalScale}px`;
  img.style.height = `${naturalHeight * totalScale}px`;
  img.style.maxWidth = 'none';
  img.style.maxHeight = 'none';
  img.style.transform = `translate3d(${zoomState.panX}px, ${zoomState.panY}px, 0)`;
  img.style.cursor = zoomState.scale > 1 ? (zoomState.dragging ? 'grabbing' : 'grab') : 'zoom-in';
}

function clearModalImageSizing(img) {
  if (!img) return;
  img.style.width = '';
  img.style.height = '';
  img.style.maxWidth = '';
  img.style.maxHeight = '';
  img.style.transform = '';
}

function clampPan(img) {
  if (zoomState.scale <= 1) {
    zoomState.scale = 1;
    zoomState.panX = 0;
    zoomState.panY = 0;
    return;
  }

  const viewport = getZoomViewport(img);
  if (!viewport) return;

  const vpRect = viewport.getBoundingClientRect();
  const imgRect = img.getBoundingClientRect();
  const maxPanX = Math.max(0, (imgRect.width - vpRect.width) / 2 + 24);
  const maxPanY = Math.max(0, (imgRect.height - vpRect.height) / 2 + 24);

  zoomState.panX = Math.max(-maxPanX, Math.min(maxPanX, zoomState.panX));
  zoomState.panY = Math.max(-maxPanY, Math.min(maxPanY, zoomState.panY));
}

function zoomAtPoint(img, clientX, clientY, newScale) {
  const viewport = getZoomViewport(img);
  if (!viewport) return;

  const vpRect = viewport.getBoundingClientRect();
  const focalX = clientX - vpRect.left - vpRect.width / 2;
  const focalY = clientY - vpRect.top - vpRect.height / 2;
  const ratio = newScale / zoomState.scale;

  zoomState.panX = focalX - (focalX - zoomState.panX) * ratio;
  zoomState.panY = focalY - (focalY - zoomState.panY) * ratio;
  zoomState.scale = newScale;

  if (zoomState.scale <= 1) {
    zoomState.scale = 1;
    zoomState.panX = 0;
    zoomState.panY = 0;
  }

  clampPan(img);
  applyZoomTransform(img);
}

function resetImageZoomState(img) {
  zoomState.scale = 1;
  zoomState.panX = 0;
  zoomState.panY = 0;
  zoomState.dragging = false;
  zoomState.lastPinchDistance = 0;
  if (img) {
    applyZoomTransform(img);
  }
}

function teardownImageZoom() {
  if (zoomListenerAbort) {
    zoomListenerAbort.abort();
    zoomListenerAbort = null;
  }
  zoomState.dragging = false;
  zoomState.lastPinchDistance = 0;
  const img = document.getElementById('modal-image');
  if (img) {
    img.dataset.zoomReady = 'false';
  }
}

function setupImageZoom(img) {
  if (!img.naturalWidth || !img.naturalHeight) return;

  // Drop any previous session listeners before rebinding
  teardownImageZoom();

  zoomState.fitScale = computeFitScale(img);
  img.style.transition = 'none';
  img.style.transformOrigin = 'center center';
  img.style.willChange = 'transform, width, height';
  img.style.touchAction = 'none';
  resetImageZoomState(img);

  zoomListenerAbort = new AbortController();
  const { signal } = zoomListenerAbort;
  img.dataset.zoomReady = 'true';

  const viewport = getZoomViewport(img);
  viewport?.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.91;
    const nextScale = Math.max(1, Math.min(getMaxZoom(), zoomState.scale * factor));
    zoomAtPoint(img, e.clientX, e.clientY, nextScale);
  }, { passive: false, signal });

  img.addEventListener('mousedown', (e) => {
    if (zoomState.scale <= 1) return;
    zoomState.dragging = true;
    zoomState.pointerStartX = e.clientX;
    zoomState.pointerStartY = e.clientY;
    zoomState.panStartX = zoomState.panX;
    zoomState.panStartY = zoomState.panY;
    img.style.cursor = 'grabbing';
    e.preventDefault();
  }, { signal });

  window.addEventListener('mousemove', (e) => {
    if (!zoomState.dragging || zoomState.scale <= 1) return;
    zoomState.panX = zoomState.panStartX + (e.clientX - zoomState.pointerStartX);
    zoomState.panY = zoomState.panStartY + (e.clientY - zoomState.pointerStartY);
    clampPan(img);
    applyZoomTransform(img);
  }, { signal });

  window.addEventListener('mouseup', () => {
    if (!zoomState.dragging) return;
    zoomState.dragging = false;
    if (img) applyZoomTransform(img);
  }, { signal });

  viewport?.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      zoomState.lastPinchDistance = touchDistance(e.touches);
      e.preventDefault();
    } else if (e.touches.length === 1 && zoomState.scale > 1) {
      zoomState.dragging = true;
      zoomState.pointerStartX = e.touches[0].clientX;
      zoomState.pointerStartY = e.touches[0].clientY;
      zoomState.panStartX = zoomState.panX;
      zoomState.panStartY = zoomState.panY;
    }
  }, { passive: false, signal });

  viewport?.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      const dist = touchDistance(e.touches);
      if (zoomState.lastPinchDistance > 0) {
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const nextScale = Math.max(1, Math.min(getMaxZoom(), zoomState.scale * (dist / zoomState.lastPinchDistance)));
        zoomAtPoint(img, midX, midY, nextScale);
      }
      zoomState.lastPinchDistance = dist;
      e.preventDefault();
    } else if (zoomState.dragging && e.touches.length === 1 && zoomState.scale > 1) {
      zoomState.panX = zoomState.panStartX + (e.touches[0].clientX - zoomState.pointerStartX);
      zoomState.panY = zoomState.panStartY + (e.touches[0].clientY - zoomState.pointerStartY);
      clampPan(img);
      applyZoomTransform(img);
      e.preventDefault();
    }
  }, { passive: false, signal });

  viewport?.addEventListener('touchend', () => {
    zoomState.dragging = false;
    zoomState.lastPinchDistance = 0;
  }, { signal });

  img.addEventListener('dblclick', (e) => {
    if (zoomState.scale > 1) {
      resetImageZoomState(img);
    } else {
      const nativeZoom = Math.min(1 / (zoomState.fitScale || 1), getMaxZoom());
      zoomAtPoint(img, e.clientX, e.clientY, Math.max(2, nativeZoom));
    }
  }, { signal });

  window.addEventListener('resize', () => {
    const modal = document.getElementById('infographic-modal');
    if (!modal || modal.classList.contains('hidden')) return;
    zoomState.fitScale = computeFitScale(img);
    applyZoomTransform(img);
    clampPan(img);
    applyZoomTransform(img);
  }, { signal });
}

function getInfographicModalFocusables(modal) {
  return [...modal.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter((el) => el.offsetParent !== null || el === modal.querySelector('#infographic-modal-close'));
}

function trapInfographicModalFocus(event) {
  const modal = document.getElementById('infographic-modal');
  if (!modal || modal.classList.contains('hidden') || event.key !== 'Tab') return;

  const focusables = getInfographicModalFocusables(modal);
  if (!focusables.length) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function openInfographicModal(src, triggerEl = null) {
  const modal = document.getElementById('infographic-modal');
  const img = document.getElementById('modal-image');
  if (!modal || !img) return;

  infographicModalTrigger = triggerEl || document.activeElement;

  clearModalImageSizing(img);
  zoomState.scale = 1;
  zoomState.fitScale = 1;
  zoomState.panX = 0;
  zoomState.panY = 0;
  zoomState.dragging = false;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const onReady = () => {
    if (!img.naturalWidth || !img.naturalHeight) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setupImageZoom(img);
      });
    });
  };

  img.loading = 'eager';
  img.onload = onReady;
  img.src = src;

  if (img.complete && img.naturalWidth) {
    onReady();
  }

  setTimeout(() => {
    const closeBtn = modal.querySelector('button[aria-label="Close infographic modal"]');
    if (closeBtn) closeBtn.focus();
  }, 50);
}

function closeInfographicModal() {
  const modal = document.getElementById('infographic-modal');
  if (!modal) return;

  teardownImageZoom();

  const img = document.getElementById('modal-image');
  if (img) {
    resetImageZoomState(img);
    clearModalImageSizing(img);
    img.onload = null;
    // Drop src to free memory when closed
    img.removeAttribute('src');
  }

  modal.classList.remove('flex');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  const restoreFocus = infographicModalTrigger;
  infographicModalTrigger = null;
  if (restoreFocus && typeof restoreFocus.focus === 'function') {
    restoreFocus.focus();
  }
}

window.openInfographicModal = openInfographicModal;
window.closeInfographicModal = closeInfographicModal;

function setupInfographicModalListeners() {
  const modal = document.getElementById('infographic-modal');
  const modalInner = document.getElementById('infographic-modal-inner');
  const closeBtn = document.getElementById('infographic-modal-close');
  if (!modal) return;

  modalInner?.addEventListener('click', (e) => {
    e.stopImmediatePropagation();
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeInfographicModal();
  });
  closeBtn?.addEventListener('click', closeInfographicModal);
  document.addEventListener('keydown', trapInfographicModalFocus);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('infographic-modal');
    if (modal && !modal.classList.contains('hidden')) closeInfographicModal();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  setupInfographicModalListeners();
  loadLessonViewer();
});